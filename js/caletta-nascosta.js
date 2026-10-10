/* La Caletta che non c'è — esplorazione a piedi, di notte, con tre colpi di scena.
   Si apre da Saghe, Modalità e Borgo. Salvataggio: ali-di-rondine.caletta */
(function () {
  "use strict";
  const KEY = "ali-di-rondine.caletta";
  const SND = "ali-di-rondine.suoni";
  const TS = 48;

  // 34×20. ~ acqua, # roccia, . ciottoli, = molo, , erba, s sabbia, p campo, | reti, + lanterna
  const MAP = [
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~##############################~~~~~~",
    "~~#............................#~~~~~~",
    "~~#.+===========...............#~~~~~~",
    "~~#..===========...............#~~~~~~",
    "~~#..===========#########......#~~~~~~",
    "~~#.............#.......#......#~~~~~~",
    "~~#.....................#......#~~~~~~",
    "~~#...########..#.......#......#~~~~~~",
    "~~#...#......#..#########......#~~~~~~",
    "~~#..........#.................######~",
    "~~#...########.................##sss#~",
    "~~#............................||sss#~",
    "~~#............................||ppp#~",
    "~~#............................##ppp#~",
    "~~#............................##s+s#~",
    "~~##############################ssss#~",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~######~",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  ];
  const COLS = MAP[0].length;
  const ROWS = MAP.length;
  const WORLD_W = COLS * TS;
  const WORLD_H = ROWS * TS;

  const SOLID = { "~": 1, "#": 1, "|": 1 };

  function tileAt(c, r) {
    if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return "~";
    return MAP[r][c];
  }
  function worldSolid(x, y, netsOpen) {
    const c = Math.floor(x / TS);
    const r = Math.floor(y / TS);
    const t = tileAt(c, r);
    if (t === "|" && netsOpen) return false;
    return !!SOLID[t];
  }

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (d && d.v === 1) return d;
    } catch (e) {}
    return { v: 1, step: 0, miraWith: false, endings: [], played: false };
  }
  function save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function soundOn() {
    try { return localStorage.getItem(SND) !== "off"; } catch (e) { return true; }
  }
  function blip(freq, dur, type, gain) {
    if (!soundOn()) return;
    try {
      const ac = window.__calettaAC || (window.__calettaAC = new (window.AudioContext || window.webkitAudioContext)());
      if (ac.state === "suspended") ac.resume();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.04, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + dur + 0.02);
    } catch (e) {}
  }
  function heroName() {
    try {
      const h = window.heroLoad && window.heroLoad();
      if (h && h.name) return h.name;
    } catch (e) {}
    return "Leo";
  }

  const NPC_DEF = [
    { id: "ginetta", name: "Ginetta", c: 8, r: 5, hair: "#c4b8a8", shirt: "#9f1239", tag: "osteria" },
    { id: "nino", name: "Nino", c: 20, r: 8, hair: "#f5d76e", shirt: "#eab308", tag: "cerata" },
    { id: "mira", name: "Mira", c: 10, r: 10, hair: "#1f2937", shirt: "#1d4ed8", tag: "ex capitano" },
    { id: "elio", name: "Elio Vento", c: 33, r: 16, hair: "#e5e7eb", shirt: "#44403c", tag: "il cancellato" },
  ];

  let root = null, cv = null, ctx = null, raf = 0, alive = false, onExit = null;
  let cam = { x: 0, y: 0 };
  let you = { x: 6 * TS + 24, y: 5 * TS + 24, vx: 0, vy: 0, face: 0, bob: 0 };
  let viewW = 800, viewH = 600, dpr = 1;
  let keys = {};
  let stick = { on: false, x: 0, y: 0, pid: null };
  let prog = null;
  let dlg = null;
  let banner = "";
  let t = 0;
  let examine = null;
  let lastStep = 0;
  const listeners = [];

  function on(el, ev, fn, opt) {
    el.addEventListener(ev, fn, opt);
    listeners.push([el, ev, fn, opt]);
  }
  function goalText() {
    const s = prog.step;
    if (s <= 0) return "Parla con Ginetta, sul molo.";
    if (s === 1) return "Qualcuno con la cerata gialla è nel vicolo.";
    if (s === 2) return "Le reti chiudono la scogliera. C'è Mira.";
    if (s === 3) return "La marea ha aperto la caletta. Scendi.";
    if (s === 4) return "Mira è all'imbocco della cala. Chiedile del pennello.";
    if (s === 5) return "Il campo è tuo. Fischio d'inizio, sulla sabbia.";
    if (prog.endings && prog.endings.length) return "La caletta resta. Puoi rigiocare il derby.";
    return "Scegli cosa farne, con Elio.";
  }
  function npcPos(n) {
    if (n.id === "mira" && prog && prog.step >= 4) return { x: 29 * TS + 20, y: 13 * TS + 16 };
    return { x: n.c * TS + TS / 2, y: n.r * TS + TS / 2 };
  }
  function nearestNpc() {
    let best = null, bd = 56;
    NPC_DEF.forEach((n) => {
      const p = npcPos(n);
      const d = Math.hypot(p.x - you.x, p.y - you.y);
      if (d < bd) { bd = d; best = n; }
    });
    return best;
  }
  function onPitch() {
    const c = Math.floor(you.x / TS), r = Math.floor(you.y / TS);
    return tileAt(c, r) === "p";
  }

  function line(name, text, extra) {
    return Object.assign({ name, text }, extra || {});
  }

  function ginettaTalk() {
    const me = heroName();
    if (prog.step > 0) {
      talk([
        line("Ginetta", "Il fritto si fredda e le storie no. Il vicolo è ancora lì, " + me + "."),
      ]);
      return;
    }
    talk([
      line("Ginetta", "Hai finito l'allenamento e il Tango della Rondine non è più appeso alla rete del gozzo. Quello della bacheca, " + me + ". Quello che non si presta."),
      line("Ginetta", "L'ho visto io: cerata gialla, basso, correva verso il vicolo senza correre. I bambini che hanno ragione fanno così."),
      line(me, "Un pallone non sparisce da solo."),
      line("Ginetta", "In questo borgo sì. Soprattutto se sopra c'è scritta una cosa e sotto un'altra."),
    ], () => { prog.step = 1; save(prog); blip(520, 0.08, "triangle", 0.05); });
  }

  function ninoTalk() {
    const me = heroName();
    if (prog.step < 1) {
      talk([line("Nino", "Non sono io che devi cercare per primo. La signora del molo ha già la bocca aperta.")]);
      return;
    }
    if (prog.step > 2) {
      talk([line("Nino", prog.step >= 5 ? "Elio dice che il campo non è di nessuno finché la marea non se lo riprende." : "Mira è alla scogliera. Non alzarla la voce: lei c'era, nel novantaquattro.")]);
      return;
    }
    talk([
      line("Nino", "Non l'ho rubato. L'ho portato via perché è nostro. Guardalo, invece di metterlo in una teca."),
      line(me, "È il pallone del derby. C'è il segno della Rondine."),
      line("Nino", "La vernice si stacca se la guardi di lato. Sotto c'è un nome. Non il vostro."),
    ], () => { examine = { k: 0 }; });
  }

  function afterExamine() {
    const me = heroName();
    examine = null;
    talk([
      line("Nino", "E. Vento, 1994. Elio. Mio nonno. Ha segnato un autogol nel derby e il borgo l'ha cancellato. Il pallone l'avete ridipinto e appeso come se fosse nato blu."),
      line(me, "Un autogol non si ridipinge. Si ricorda."),
      line("Nino", "Allora scendi. La caletta compare solo quando la marea sbaglia, cioè stanotte. Le reti le tiene Mira. Era la capitana. Chiedile perché ha il pennello ancora in tasca."),
    ], () => { prog.step = 2; save(prog); blip(660, 0.09, "sine", 0.05); });
  }

  function miraTalk() {
    const me = heroName();
    if (prog.step < 2) {
      talk([line("Mira", "Il sentiero è chiuso. E tu hai ancora la faccia di chi non ha visto il pallone da vicino.")]);
      return;
    }
    if (prog.step >= 4) {
      talk([
        line("Mira", "Sono scesa anch'io. Tanto la marea, stanotte, non prende ordini dal club."),
        line("Mira", "Il pennello ce l'ho ancora. Blu Rondine. Nel novantaquattro ho coperto il nome di Elio perché il comitato voleva una leggenda pulita, e io volevo continuare a giocare."),
        line("Mira", "Il Tiro della Rondine è il suo. Gliel'abbiamo cambiato il nome, non la traiettoria."),
      ], () => {
        if (prog.step < 5) { prog.step = 5; prog.elio = true; save(prog); }
      });
      return;
    }
    if (prog.step > 2) {
      talk([line("Mira", "Le reti sono giù. Se devi odiare qualcuno, odia il verbale del comitato, non il ragazzo.")]);
      return;
    }
    talk([
      line("Mira", "Se scendi, rompi una tregua che tiene due club nello stesso bar. Elio ha segnato nella propria porta. La città ha scelto di ricordare solo questo."),
      line(me, "E tu cosa ricordi?"),
      line("Mira", "Che mentre tutti guardavano la rete, in mare una barca stava andando sugli scogli. Elio ha urlato. Nessuno si è girato, finché il pallone non è entrato dalla parte sbagliata."),
    ], null, [
      { label: "Voglio vedere la caletta", fn: () => chooseMira(false) },
      { label: "Allora accompagnami", fn: () => chooseMira(true) },
    ]);
  }

  function chooseMira(withHer) {
    prog.miraWith = !!withHer;
    prog.step = 3;
    save(prog);
    blip(440, 0.1, "triangle", 0.05);
    talk([
      line("Mira", withHer
        ? "Va bene. Ti accompagno. Se Elio è ancora là, gli devo una frase che non ho detto nel '94."
        : "Allora vai. Le reti le tiro io. Non farmi pentire di averti creduto più sveglio del verbale."),
    ]);
  }

  function elioTalk() {
    const me = heroName();
    if (prog.step < 3) {
      talk([line("Elio", "La lampada resta spenta finché le reti sono su. Non è maleducazione: è marea.")]);
      return;
    }
    if (prog.step >= 6 && prog.endings && prog.endings.length) {
      const last = prog.endings[prog.endings.length - 1];
      const map = {
        targa: "La targa tiene. Una volta l'anno, con la marea bassa, si gioca e si dice il nome giusto.",
        silenzio: "Hai scelto il silenzio. Il campo c'è lo stesso. Io resto. Il nome, per ora, no.",
        scandalo: "Pina ha già il titolo. I bambini hanno già il campo. Il borgo sopravvive a tutte e due le cose.",
      };
      talk([line("Elio", map[last] || "Sei tornato. Il campo è ancora buono."), line("Elio", "Se vuoi, si rigioca. La sabbia non tiene il punteggio.")]);
      return;
    }
    if (prog.step >= 5 && prog.step < 6) {
      talk([
        line("Elio", "Basta parole. Quattro contro quattro, niente fuorigioco, il vento decide gli esterni. Se vinci, il pallone resta a te e tu rimetti il nome. Se perdi, il pallone torna alle Lampare e il nome lo rimetti lo stesso."),
        line(me, "Allora il risultato non compra la verità."),
        line("Elio", "No. Compra solo chi porta il pallone a casa. Il tiro lo imparo a chi resta fino al fischio finale."),
      ], () => startStoryMatch());
      return;
    }
    if (prog.step > 5) {
      endingChoice();
      return;
    }
    talk([
      line("Elio", "Sei " + me + ". Hai la faccia di chi ha già letto un nome sotto la vernice."),
      line("Elio", "L'autogol era l'unico modo per fermare la partita. Sulla barca c'era il padre di Nino, piccolo. Ho urlato verso gli scogli. Il pubblico guardava me, non il mare. Allora ho messo la palla nella mia rete e ho urlato ancora."),
      line("Elio", "Mi hanno creduto abbastanza da salvargli il figlio. Non abbastanza da lasciarmi nel libro del club. Mira ha ridipinto il pallone. Il tiro, quello, non si è fatto ridipingere: l'avete solo chiamato in un altro modo."),
      line(prog.miraWith ? "Mira" : "Elio", prog.miraWith
        ? "Sono qui. Il pennello è blu perché il comitato pagava il blu, non perché il tiro fosse nato blu."
        : "Dille di scendere. Tanto l'ho vista sulla scogliera: le reti le ha aperte lei, e le cose aperte non si richiudono con una mano sola."),
    ], () => { prog.step = 4; prog.elio = true; save(prog); });
  }

  function endingChoice() {
    const me = heroName();
    talk([
      line("Elio", "La marea tra poco si riprende il campo. Il punteggio resta sulle scarpe. Il nome no, se non lo metti da qualche parte."),
      line(me, "Dimmi tu dove."),
    ], null, [
      { label: "Appendi la targa e fai il derby ogni anno", fn: () => finishEnd("targa") },
      { label: "Tieni la caletta segreta", fn: () => finishEnd("silenzio") },
      { label: "Racconta tutto a Pina, sul Corriere", fn: () => finishEnd("scandalo") },
    ]);
  }

  function finishEnd(id) {
    const txt = {
      targa: "Sulla roccia, a vernice bianca e piccola: ELIO VENTO, 1994. Sotto, due stemmi che non si somigliano. Ginetta, l'anno dopo, mette il fritto in mezzo e non chiede di chi è.",
      silenzio: "Il pallone torna in bacheca, vernice intatta. Elio spegne la lampada quando te ne vai. Nino non ti saluta. La caletta, l'anno prossimo, potrebbe non aprirsi.",
      scandalo: "Pina pubblica il nome e il borgo litiga per sei giorni. Il settimo, i bambini delle due squadre sono già in spiaggia con un pallone solo. Il titolo del Corriere invecchia. Il campo no.",
    };
    if (!prog.endings.includes(id)) prog.endings.push(id);
    prog.step = 7;
    prog.elio = true;
    save(prog);
    blip(id === "silenzio" ? 220 : 720, 0.18, "triangle", 0.06);
    talk([line(id === "silenzio" ? "Elio" : "Mira", txt[id])]);
  }

  function startStoryMatch() {
    if (!window.openDerbyLampare) {
      talk([line("Elio", "Il campo c'è. Manca solo chi fischia l'inizio.")]);
      return;
    }
    const backAlive = alive;
    window.openDerbyLampare({
      story: true,
      elio: true,
      wind: 0.42,
      onExit(res) {
        if (!backAlive) return;
        if (!res || res.quit) {
          talk([line("Elio", "La marea aspetta. Tu, a quanto pare, no.")]);
          return;
        }
        prog.played = true;
        prog.step = 6;
        prog.lastUs = res.us;
        prog.lastThem = res.them;
        save(prog);
        const me = heroName();
        const verb = res.us > res.them ? "Avete vinto" : res.us < res.them ? "Avete perso" : "Avete pareggiato";
        talk([
          line("Elio", verb + " " + res.us + " a " + res.them + ". Il vento si è preso il resto."),
          line(me, "Il nome?"),
          line("Elio", "Quello non l'ha deciso il risultato. Decidilo tu, prima che torni l'acqua."),
        ], () => endingChoice());
      },
    });
  }

  function talk(lines, onDone, choices) {
    dlg = { lines, i: 0, onDone: onDone || null, choices: null };
    if (choices) dlg.lines[dlg.lines.length - 1].choices = choices;
  }
  function dlgLine() { return dlg && dlg.lines[dlg.i]; }
  function advance() {
    if (examine) { afterExamine(); return; }
    if (!dlg) { interact(); return; }
    const cur = dlgLine();
    if (!cur) { closeDlg(); return; }
    if (cur.choices) return;
    dlg.i += 1;
    if (dlg.i >= dlg.lines.length) closeDlg();
  }
  function closeDlg() {
    const cb = dlg && dlg.onDone;
    dlg = null;
    if (cb) cb();
  }
  function interact() {
    if (onPitch() && prog.step >= 5) {
      if (prog.step >= 6 && prog.endings.length) {
        if (window.openDerbyLampare) window.openDerbyLampare({ story: false, elio: true, onExit() {} });
        return;
      }
      startStoryMatch();
      return;
    }
    const n = nearestNpc();
    if (!n) {
      talk([line(heroName(), "Onde, reti e una lanterna. Nessuno ha voglia di parlare, qui.")]);
      return;
    }
    if (n.id === "ginetta") ginettaTalk();
    else if (n.id === "nino") ninoTalk();
    else if (n.id === "mira") miraTalk();
    else elioTalk();
  }

  function tryMove(dx, dy, dt) {
    const sp = 168;
    you.vx = dx * sp;
    you.vy = dy * sp;
    const nx = you.x + you.vx * dt;
    const ny = you.y + you.vy * dt;
    const r = 12;
    const nets = prog.step >= 3;
    function blocked(x, y) {
      return worldSolid(x - r, y - r, nets) || worldSolid(x + r, y - r, nets) || worldSolid(x - r, y + r, nets) || worldSolid(x + r, y + r, nets);
    }
    if (!blocked(nx, you.y)) you.x = nx;
    if (!blocked(you.x, ny)) you.y = ny;
    you.x = Math.max(r, Math.min(WORLD_W - r, you.x));
    you.y = Math.max(r, Math.min(WORLD_H - r, you.y));
    if (dx || dy) {
      you.face = Math.atan2(dy, dx);
      you.bob += dt * 10;
      if (Math.floor(you.bob) !== lastStep && Math.floor(you.bob) % 4 === 0) blip(90 + (you.bob % 2) * 30, 0.03, "triangle", 0.015);
      lastStep = Math.floor(you.bob);
    }
  }

  function drawTile(c, r, x, y) {
    const ch = tileAt(c, r);
    const netsOpen = prog.step >= 3;
    if (ch === "~") {
      const g = ctx.createLinearGradient(x, y, x, y + TS);
      g.addColorStop(0, "#0b3148");
      g.addColorStop(1, "#071422");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, TS + 1, TS + 1);
      ctx.strokeStyle = "rgba(186,230,253,0.25)";
      ctx.beginPath();
      const yy = y + 10 + Math.sin(t * 1.7 + c * 0.7 + r) * 3;
      ctx.moveTo(x, yy);
      ctx.bezierCurveTo(x + 16, yy - 4, x + 32, yy + 5, x + TS, yy + 1);
      ctx.stroke();
      return;
    }
    if (ch === "#") {
      const g = ctx.createLinearGradient(x, y, x + TS, y + TS);
      g.addColorStop(0, "#4b5568");
      g.addColorStop(1, "#1f2937");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, TS + 1, TS + 1);
      ctx.strokeStyle = "rgba(0,0,0,.35)";
      ctx.strokeRect(x + 6, y + 8, 18, 10);
      return;
    }
    if (ch === "=") {
      ctx.fillStyle = "#7c4a2d";
      ctx.fillRect(x, y, TS + 1, TS + 1);
      ctx.strokeStyle = "rgba(40,18,8,.45)";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + 6 + i * 12);
        ctx.lineTo(x + TS, y + 6 + i * 12);
        ctx.stroke();
      }
      return;
    }
    if (ch === ",") {
      ctx.fillStyle = "#1b4630";
      ctx.fillRect(x, y, TS + 1, TS + 1);
      ctx.fillStyle = "#2f6d45";
      for (let i = 0; i < 5; i++) ctx.fillRect(x + 6 + (i * 9) % 36, y + 8 + (i * 7) % 28, 3, 7);
      return;
    }
    const sand = ch === "s" || ch === "p" || (ch === "|" && netsOpen);
    if (sand || ch === "|" || ch === "+" || ch === ".") {
      ctx.fillStyle = ch === "." || ch === "+" ? "#5c6572" : (ch === "p" ? "#c4a36e" : "#b99262");
      ctx.fillRect(x, y, TS + 1, TS + 1);
      if (ch === "." || ch === "+") {
        ctx.fillStyle = "rgba(255,255,255,.08)";
        ctx.fillRect(x + 4, y + 6, 14, 8);
        ctx.fillRect(x + 24, y + 22, 16, 9);
      } else {
        ctx.fillStyle = "rgba(90,60,30,.18)";
        ctx.fillRect(x + (c * 13) % 20, y + (r * 9) % 18, 6, 3);
      }
      if (ch === "|") {
        ctx.strokeStyle = "#d6d3d1";
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(x + 8 + i * 10, y);
          ctx.lineTo(x + 8 + i * 10, y + TS);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }
      if (ch === "+") {
        ctx.fillStyle = "#292524";
        ctx.fillRect(x + TS / 2 - 2, y + 8, 4, TS - 10);
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(x + TS / 2, y + 10, 4, 0, 7);
        ctx.fill();
      }
    }
  }

  function drawPitchMarks() {
    let minC = 99, minR = 99, maxC = 0, maxR = 0, any = false;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (MAP[r][c] === "p") {
      any = true;
      minC = Math.min(minC, c); minR = Math.min(minR, r); maxC = Math.max(maxC, c); maxR = Math.max(maxR, r);
    }
    if (!any) return;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.75)";
    ctx.lineWidth = 2;
    const x = minC * TS + 6, y = minR * TS + 6, w = (maxC - minC + 1) * TS - 12, h = (maxR - minR + 1) * TS - 12;
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, 16, 0, 7); ctx.stroke();
    ctx.restore();
  }

  function drawActor(x, y, face, shirt, hair, name, moving) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.beginPath(); ctx.ellipse(0, 10, 11, 4.5, 0, 0, 7); ctx.fill();
    const bob = moving ? Math.sin(t * 12) * 1.5 : 0;
    ctx.rotate(face);
    ctx.fillStyle = shirt;
    ctx.beginPath(); ctx.ellipse(0, bob, 8, 11, 0, 0, 7); ctx.fill();
    ctx.rotate(-face);
    ctx.fillStyle = "#e7c2a0";
    ctx.beginPath(); ctx.arc(0, -8 + bob, 6.5, 0, 7); ctx.fill();
    ctx.fillStyle = hair;
    ctx.beginPath(); ctx.arc(0, -11 + bob, 6.2, Math.PI, 0); ctx.fill();
    if (name) {
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(0,0,0,.55)";
      ctx.fillText(name, 0, -22);
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(name, 0, -23);
    }
    ctx.restore();
  }

  function drawBoat(x, y, lit) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#3f2a1d";
    ctx.beginPath();
    ctx.moveTo(-28, 6); ctx.lineTo(30, 6); ctx.lineTo(22, 16); ctx.lineTo(-20, 16); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#292524";
    ctx.fillRect(-6, -10, 16, 14);
    if (lit) {
      ctx.fillStyle = "rgba(253,224,71,.95)";
      ctx.fillRect(-2, -6, 6, 5);
    } else {
      ctx.fillStyle = "#1c1917";
      ctx.fillRect(-2, -6, 6, 5);
    }
    ctx.restore();
  }

  function lights() {
    const list = [{ x: you.x, y: you.y - 8, rad: 190, a: 0.85 }];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (MAP[r][c] === "+") {
      list.push({ x: c * TS + TS / 2, y: r * TS + 10, rad: 120, a: 0.5 + Math.sin(t * 3 + c) * 0.08 });
    }
    if (prog.step >= 4) list.push({ x: 34 * TS + 16, y: 16 * TS, rad: 150, a: 0.7 });
    return list;
  }

  function frame(now) {
    if (!alive) return;
    const dt = Math.min(0.033, (now - (frame.prev || now)) / 1000 || 0.016);
    frame.prev = now;
    t += dt;
    let ix = 0, iy = 0;
    if (keys.a || keys.arrowleft) ix -= 1;
    if (keys.d || keys.arrowright) ix += 1;
    if (keys.w || keys.arrowup) iy -= 1;
    if (keys.s || keys.arrowdown) iy += 1;
    if (stick.on) { ix += stick.x; iy += stick.y; }
    const len = Math.hypot(ix, iy);
    if (!dlg && !examine && len > 0.12) tryMove(ix / len, iy / len, dt);

    const vw = viewW, vh = viewH;
    const targetX = you.x - vw / 2, targetY = you.y - vh / 2;
    cam.x += (targetX - cam.x) * Math.min(1, dt * 6);
    cam.y += (targetY - cam.y) * Math.min(1, dt * 6);
    cam.x = Math.max(0, Math.min(WORLD_W - vw, cam.x));
    cam.y = Math.max(0, Math.min(WORLD_H - vh, cam.y));

    ctx.fillStyle = "#070b14";
    ctx.fillRect(0, 0, vw, vh);
    const c0 = Math.max(0, Math.floor(cam.x / TS) - 1);
    const r0 = Math.max(0, Math.floor(cam.y / TS) - 1);
    const c1 = Math.min(COLS - 1, Math.floor((cam.x + vw) / TS) + 1);
    const r1 = Math.min(ROWS - 1, Math.floor((cam.y + vh) / TS) + 1);
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) drawTile(c, r, c * TS - cam.x, r * TS - cam.y);
    ctx.save();
    ctx.translate(-cam.x, -cam.y);
    drawPitchMarks();
    drawBoat(10 * TS, 1 * TS + 20, false);
    drawBoat(34 * TS, 16 * TS + 6, prog.step >= 4);
    NPC_DEF.forEach((n) => {
      const p = npcPos(n);
      const mv = n.id === "nino" && prog.step < 3;
      drawActor(p.x, p.y + (mv ? Math.sin(t * 2) * 1 : 0), n.id === "mira" ? -0.6 : Math.PI / 2, n.shirt, n.hair, n.name, false);
    });
    drawActor(you.x, you.y, you.face, "#1d4ed8", "#3f2a1c", heroName(), len > 0.12 && !dlg);
    ctx.restore();

    const night = document.createElement("canvas");
    night.width = vw; night.height = vh;
    const nx = night.getContext("2d");
    nx.fillStyle = "rgba(5,10,24,0.42)";
    nx.fillRect(0, 0, vw, vh);
    nx.globalCompositeOperation = "destination-out";
    lights().forEach((L) => {
      const gx = L.x - cam.x, gy = L.y - cam.y;
      const g = nx.createRadialGradient(gx, gy, 8, gx, gy, L.rad);
      g.addColorStop(0, "rgba(0,0,0," + L.a + ")");
      g.addColorStop(1, "rgba(0,0,0,0)");
      nx.fillStyle = g;
      nx.beginPath(); nx.arc(gx, gy, L.rad, 0, 7); nx.fill();
    });
    ctx.drawImage(night, 0, 0);

    const moon = ctx.createRadialGradient(vw - 80, 50, 4, vw - 80, 50, 180);
    moon.addColorStop(0, "rgba(224,242,254,.18)");
    moon.addColorStop(1, "rgba(224,242,254,0)");
    ctx.fillStyle = moon;
    ctx.fillRect(0, 0, vw, vh);

    hud(vw, vh);
    if (examine) drawExamine(vw, vh);
    else if (dlg) drawDlg(vw, vh);
    raf = requestAnimationFrame(frame);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function hud(vw, vh) {
    ctx.save();
    roundRect(12, 12, Math.min(460, vw - 24), 54, 10);
    ctx.fillStyle = "rgba(8,12,24,.78)";
    ctx.fill();
    ctx.strokeStyle = "rgba(251,191,36,.7)";
    ctx.stroke();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "700 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("La Caletta che non c'è", 24, 34);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px sans-serif";
    ctx.fillText(goalText(), 24, 52);

    const near = nearestNpc();
    const hint = examine || dlg ? "" : (onPitch() && prog.step >= 5 ? "E  ·  Scendi in campo" : near ? "E  ·  Parla con " + near.name : "WASD o levetta  ·  esplora");
    if (hint) {
      ctx.textAlign = "center";
      ctx.font = "700 14px sans-serif";
      roundRect(vw / 2 - 150, vh - 78, 300, 32, 16);
      ctx.fillStyle = "rgba(8,12,24,.8)";
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(hint, vw / 2, vh - 57);
    }
    ctx.restore();
    banner = goalText();
  }

  function wrap(text, max) {
    const words = text.split(" ");
    const rows = [];
    let cur = "";
    words.forEach((w) => {
      const n = cur ? cur + " " + w : w;
      if (ctx.measureText(n).width > max && cur) { rows.push(cur); cur = w; }
      else cur = n;
    });
    if (cur) rows.push(cur);
    return rows;
  }

  function drawDlg(vw, vh) {
    const cur = dlgLine();
    if (!cur) return;
    const boxW = Math.min(640, vw - 24);
    const x = (vw - boxW) / 2;
    const y = vh - 168;
    roundRect(x, y, boxW, 150, 14);
    ctx.fillStyle = "rgba(10,14,28,.92)";
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.stroke();
    ctx.fillStyle = "#93c5fd";
    ctx.font = "700 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(cur.name, x + 16, y + 24);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "15px sans-serif";
    const rows = wrap(cur.text, boxW - 32);
    rows.slice(0, 4).forEach((row, i) => ctx.fillText(row, x + 16, y + 50 + i * 20));
    if (cur.choices) {
      cur.choices.forEach((ch, i) => {
        const by = y - 16 - (cur.choices.length - i) * 38;
        roundRect(x, by, boxW, 34, 8);
        ctx.fillStyle = i === 0 ? "rgba(29,78,216,.9)" : "rgba(30,41,59,.9)";
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "14px sans-serif";
        ctx.fillText(ch.label, x + 12, by + 22);
        ch._box = { x, y: by, w: boxW, h: 34 };
      });
    } else {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px sans-serif";
      ctx.fillText("E, Invio o tocco  ·  avanti", x + 16, y + 136);
    }
  }

  function drawExamine(vw, vh) {
    examine.k += 1;
    const x = vw / 2, y = vh / 2 - 10;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.45)";
    ctx.fillRect(0, 0, vw, vh);
    const g = ctx.createRadialGradient(x - 10, y - 16, 8, x, y, 70);
    g.addColorStop(0, "#f8fafc");
    g.addColorStop(0.7, "#1d4ed8");
    g.addColorStop(1, "#0f172a");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, 62, 0, 7); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.8)";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, 62, 0, 7); ctx.stroke();
    const flake = Math.min(1, examine.k / 50);
    ctx.fillStyle = "rgba(15,23,42," + (0.15 + flake * 0.75) + ")";
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 20);
    ctx.lineTo(x + 36, y - 8);
    ctx.lineTo(x + 20, y + 28);
    ctx.lineTo(x - 24, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fef3c7";
    ctx.font = "700 16px sans-serif";
    ctx.textAlign = "center";
    if (flake > 0.45) ctx.fillText("E. VENTO  1994", x, y + 6);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px sans-serif";
    ctx.fillText("Sotto la vernice blu c'è un altro nome.", x, y + 100);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Tocca o premi E", x, y + 122);
    ctx.restore();
  }

  function resize() {
    if (!cv) return;
    const dprNow = Math.min(2, window.devicePixelRatio || 1);
    dpr = dprNow;
    const w = root.clientWidth, h = root.clientHeight;
    viewW = Math.max(320, w);
    viewH = Math.max(240, h);
    cv.width = Math.floor(viewW * dpr);
    cv.height = Math.floor(viewH * dpr);
    cv.style.width = viewW + "px";
    cv.style.height = viewH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function pointer(ev) {
    const r = cv.getBoundingClientRect();
    return { x: (ev.clientX - r.left), y: (ev.clientY - r.top) };
  }
  function hitChoice(p) {
    const cur = dlgLine();
    if (!cur || !cur.choices) return null;
    return cur.choices.find((ch) => ch._box && p.x >= ch._box.x && p.x <= ch._box.x + ch._box.w && p.y >= ch._box.y && p.y <= ch._box.y + ch._box.h) || null;
  }

  function destroy() {
    alive = false;
    cancelAnimationFrame(raf);
    listeners.splice(0).forEach(([el, ev, fn, opt]) => el.removeEventListener(ev, fn, opt));
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null; cv = null; ctx = null;
    keys = {};
  }

  function open(back) {
    if (alive) destroy();
    onExit = typeof back === "function" ? back : (back && back.onExit) || null;
    prog = load();
    you.x = 8 * TS; you.y = 5 * TS + 10; you.face = 0.4;
    cam.x = you.x - 400; cam.y = you.y - 240;
    alive = true;
    root = document.createElement("div");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "La Caletta che non c'è");
    root.style.cssText = "position:fixed;inset:0;z-index:10020;background:#070b14;touch-action:none;font-family:sans-serif;";
    cv = document.createElement("canvas");
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    root.appendChild(cv);
    const exit = document.createElement("button");
    exit.type = "button";
    exit.textContent = "Esci";
    exit.style.cssText = "position:absolute;top:12px;right:12px;z-index:2;background:#111827;color:#fff;border:1px solid #fbbf24;border-radius:999px;padding:8px 14px;cursor:pointer;";
    exit.onclick = () => { const cb = onExit; destroy(); if (cb) cb(); };
    root.appendChild(exit);

    const joy = document.createElement("div");
    joy.style.cssText = "position:absolute;left:18px;bottom:18px;width:116px;height:116px;border-radius:58px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);z-index:2;";
    const knob = document.createElement("div");
    knob.style.cssText = "position:absolute;left:38px;top:38px;width:40px;height:40px;border-radius:20px;background:rgba(255,255,255,.85);";
    joy.appendChild(knob);
    root.appendChild(joy);
    const act = document.createElement("button");
    act.type = "button";
    act.textContent = "Parla";
    act.style.cssText = "position:absolute;right:18px;bottom:28px;z-index:2;width:74px;height:74px;border-radius:37px;background:#1d4ed8;color:#fff;border:2px solid #bfdbfe;font-weight:700;cursor:pointer;";
    act.onclick = () => advance();
    root.appendChild(act);

    document.body.appendChild(root);
    ctx = cv.getContext("2d");
    resize();

    function setStick(ev, on) {
      if (!on) { stick.on = false; stick.x = 0; stick.y = 0; knob.style.left = "38px"; knob.style.top = "38px"; return; }
      const box = joy.getBoundingClientRect();
      const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
      let dx = ev.clientX - cx, dy = ev.clientY - cy;
      const m = Math.hypot(dx, dy) || 1;
      const k = Math.min(36, m);
      dx = dx / m * k; dy = dy / m * k;
      stick.on = k > 8;
      stick.x = dx / 36; stick.y = dy / 36;
      knob.style.left = (38 + dx) + "px";
      knob.style.top = (38 + dy) + "px";
    }
    on(joy, "pointerdown", (e) => { joy.setPointerCapture(e.pointerId); setStick(e, true); });
    on(joy, "pointermove", (e) => { if (stick.on) setStick(e, true); });
    on(joy, "pointerup", () => setStick(null, false));
    on(window, "resize", resize);
    on(window, "keydown", (e) => {
      if (!alive) return;
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "enter"].includes(e.key.toLowerCase()) || "wasde".includes(k) || k === "escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      if (k === "escape") { const cb = onExit; destroy(); if (cb) cb(); return; }
      if (k === "e" || k === "enter" || k === " ") { advance(); return; }
      keys[k] = true;
    }, true);
    on(window, "keyup", (e) => { keys[e.key.toLowerCase()] = false; }, true);
    on(cv, "pointerdown", (e) => {
      const p = pointer(e);
      const ch = hitChoice(p);
      if (ch) { dlg = null; ch.fn(); return; }
      if (dlg || examine) advance();
    });
    if (prog.step === 0 && !prog.intro) {
      prog.intro = true; save(prog);
      talk([
        line(heroName(), "Allenamento finito. Il molo, di notte, tiene solo le lampade e le cose che di giorno fanno finta di essere semplici."),
        line(heroName(), "Manca un pallone. E, a Borgo Marino, un pallone che manca ha sempre un nome sotto."),
      ]);
    }
    raf = requestAnimationFrame(frame);
  }

  window.openCalettaNascosta = function (back) { open(back); };
  window.__calettaNascosta = {
    open,
    load,
    line() { const c = dlgLine(); return c ? { name: c.name, i: dlg.i, n: dlg.lines.length, text: c.text } : null; },
    _reachable() {
      const start = [8, 5];
      const seen = new Set();
      const q = [start];
      seen.add(start[0] + "," + start[1]);
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      while (q.length) {
        const [c, r] = q.pop();
        dirs.forEach(([dc, dr]) => {
          const nc = c + dc, nr = r + dr;
          const k = nc + "," + nr;
          if (seen.has(k)) return;
          const t = tileAt(nc, nr);
          if (!t || t === "~" || t === "#") return;
          seen.add(k); q.push([nc, nr]);
        });
      }
      return seen;
    },
  };
})();
