// js/vignette.js - «VIGNETTE» · la partita originale di «Il Torneo delle Cento Scuole» (motore proprio, NON il kit di partita)
// Una partita a fumetti, vista di lato, raccontata ad AZIONI (come le tavole di un manga sportivo):
//  - ATTACCO: il campo scorre a destra su tre corsie. ▲▼ cambia corsia, FINTA salta il difensore se la premi al momento
//    giusto (quando è vicino, non troppo), PASSA dà la palla (e il controllo) al compagno in un'altra corsia libera.
//    In fondo, il TIRO: la porta vista di fronte, il mirino che oscilla e il portiere che si muove. Tira nel varco.
//  - DIFESA: l'attaccante avversario arriva da destra. Mettiti nella sua corsia e CONTRASTO al momento giusto.
//    Se ti supera, sei in porta: guarda dove guarda il tiratore e tuffati (◀ ● ▶).
//  - SPIRITO: le belle giocate riempiono la barra. Piena, sblocca le TECNICHE DI SQUADRA imparate nella storia
//    (stacco a vignetta, onomatopea e linee cinetiche): Tiro a Tre (gol), Muro Umano (difesa), Finta dell'Ombra (salta tutti).
// Grafica: carta, inchiostro, retini e un solo colore per squadra. Difficoltà e carattere degli avversari dal motore delle saghe.
// Uso: window.__vignette.start({ title, us, opp:{ name, color, players }, mates:[{name,...}], heroLook, techniques:[...], actions, intro, onDone })
(function () {
  "use strict";
  if (window.__vignette) return;
  const W = 360, H = 240, LANES = [104, 150, 196], HX = 86;
  const TECH = {
    tiro3: { name: "TIRO A TRE", sub: "Tre passaggi, un solo tiro: è sempre gol", when: "shot", sfx: "DOOOM" },
    muro: { name: "MURO UMANO", sub: "Tutta la squadra in fila: l'attaccante si ferma", when: "def", sfx: "GHAAN" },
    ombra: { name: "FINTA DELL'OMBRA", sub: "Salti tutti i difensori in un colpo solo", when: "run", sfx: "SHUUN" },
  };
  const ONO = { finta: ["SWISH", "FFUP", "ZAN"], tackle: ["DOKK", "GASH", "BAM"], goal: ["GOOOL", "DOOOM", "ZAAAN"], save: ["PARATA", "BAAN", "GHON"] };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let STATE = null;
  function start(o) {
    if (document.querySelector(".vgOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1, gk0: 0, gk1: 0 }, style: "" }, DF = cur.opts || { opp: 1, gk0: 0, gk1: 0 }, style = o.oppStyle || cur.style || "equilibrata";
    const usCol = (o.heroLook && o.heroLook.shirt) || o.usColor || "#c8302a", oppCol = (o.opp && o.opp.color) || "#2a3a6a";
    const hero = Object.assign({ name: "Tu", id: "hero", skin: "#e0ac7e", hair: "#2b1d14" }, o.heroLook || {}, { shirt: usCol });
    const mates = (o.mates || [{ name: "Compagno", skin: "#e8c4a0", hair: "#3a2a1a" }]).map((m) => Object.assign({ shirt: usCol }, m));
    const oppP = (o.opp && o.opp.players) || [{ name: "Avversario", skin: "#d9b38c", hair: "#1a1a1a" }];
    const techs = (o.techniques || []).filter((k) => TECH[k]);
    const S = { o, a: 0, b: 0, act: 0, nAct: o.actions || 8, phase: "intro", t: 0, spirit: 0, fx: [], panel: null, data: { finte: 0, contrasti: 0, tecniche: 0, passaggi: 0 }, over: false, extra: 0 };
    STATE = S;
    // ------------------------------------------------------------ interfaccia
    css();
    const el = document.createElement("div"); el.className = "vgOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas>
<canvas class="cu" width="${W * 2}" height="${110 * 2}"></canvas>
<div class="spirit"><i></i><b>SPIRITO</b></div>
<div class="pad"><button type="button" data-k="up">▲</button><button type="button" data-k="a1" class="main">FINTA</button><button type="button" data-k="a2">PASSA</button><button type="button" data-k="down">▼</button></div>
<div class="pad2"><button type="button" data-k="tech" class="tech" disabled>TECNICA</button><button type="button" data-k="quit" class="quit">Esci</button></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = (o.opp && o.opp.name) || "Avversari";
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", oppCol);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d"); g.scale(2, 2); const cu = el.querySelector(".cu").getContext("2d");
    const hud = () => { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".spirit i").style.width = `${Math.min(100, S.spirit)}%`; const tb = el.querySelector(".tech"); const ok = S.spirit >= 100 && techs.some((k) => TECH[k].when === techPhase()); tb.disabled = !ok; tb.classList.toggle("on", ok); };
    const techPhase = () => (S.phase === "run" ? "run" : S.phase === "aim" ? "shot" : S.phase === "def" ? "def" : "");
    const labels = () => { const [a1, a2] = S.phase === "run" ? ["FINTA", "PASSA"] : S.phase === "aim" ? ["TIRA", "—"] : S.phase === "def" ? ["CONTRASTO", "—"] : S.phase === "dive" ? ["◀", "▶"] : ["…", "…"]; el.querySelector('[data-k="a1"]').textContent = a1; el.querySelector('[data-k="a2"]').textContent = a2; el.querySelector('[data-k="up"]').textContent = S.phase === "dive" ? "●" : "▲"; el.querySelector('[data-k="down"]').textContent = S.phase === "dive" ? "●" : "▼"; };
    function tone(f, d, type, v) { try { const A = (window.__vgAC = window.__vgAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "square"; os.frequency.value = f; gn.gain.value = v || 0.04; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const pop = (txt, x, y, big) => S.fx.push({ txt, x, y, t: big ? 70 : 45, big });
    const BN = o.bonus || {}, addSpirit = (n) => { S.spirit = Math.min(100, S.spirit + n * (1 + 0.1 * (BN.te | 0))); }; // Sogni: la TECNICA carica prima lo Spirito
    const say = (side, txt) => { S.say = { side, txt, t: 80 }; }; // la nuvoletta nei primi piani (0 = noi, 1 = loro)
    // ------------------------------------------------------------ azioni
    function nextAction() {
      if (S.over) return;
      if (S.act >= S.nAct && (S.a !== S.b || S.extra >= 3 || o.extra === false)) return finish();
      if (S.act >= S.nAct) S.extra++;
      const attack = S.act % 2 === 0; S.act++; S.res = null;
      S.panel = { t: 70, txt: S.act > S.nAct ? "AZIONE DECISIVA" : `AZIONE ${S.act}/${S.nAct}`, sub: attack ? "ATTACCO" : "DIFESA", next: attack ? startRun : startDef };
      S.phase = "panel"; labels(); hud();
    }
    function startRun() {
      const nDef = 3 + (style === "pressing" ? 1 : 0) + (DF.opp > 1.05 ? 1 : 0) - (DF.opp < 0.95 ? 1 : 0);
      S.phase = "run"; S.x = 0; S.lane = 1; S.len = 520 + nDef * 120; S.carrier = 0; // 0 = Campione, 1.. = compagni
      S.defs = []; for (let i = 0; i < nDef; i++) S.defs.push({ x: 220 + i * ((S.len - 260) / nDef) + Math.random() * 40, lane: Math.floor(Math.random() * 3), p: oppP[i % oppP.length], spun: 0, drift: style === "pressing" ? 0.012 : 0.004 });
      S.team = mates.slice(0, 2).map((m, i) => ({ p: m, lane: (S.lane + 1 + i) % 3, off: -20 + i * 30 }));
      S.speed = 2.1; labels(); hud();
    }
    function startAim() { S.phase = "aim"; S.t = 0; S.kx = 0; S.kv = (1.1 + (style === "difensiva" ? 0.4 : 0)) * DF.opp; S.reach = Math.max(9, 15 + DF.gk1 * 60 - 1.5 * (BN.at | 0)) + (style === "difensiva" ? 4 : 0); labels(); hud(); }
    function startDef() {
      S.phase = "def"; S.x = 0; S.lane = 1; S.olane = Math.floor(Math.random() * 3); S.ox = 300; S.ovel = (1.9 + (style === "contropiede" ? 0.6 : 0)) * DF.opp; S.osw = 0;
      S.op = oppP[Math.floor(Math.random() * oppP.length)]; say(1, pick(["Arrivo!", "Fammi spazio!", "Tocca a me!"])); labels(); hud();
    }
    function startDive() { S.phase = "dive"; S.t = 0; S.shotDir = Math.floor(Math.random() * 3) - 1; S.fake = DF.opp > 1.05 && Math.random() < 0.3; S.tell = S.fake ? -S.shotDir || 1 : S.shotDir; labels(); hud(); }
    // ------------------------------------------------------------ comandi
    function press(k) {
      if (S.over) return;
      if (k === "quit") return finish(true);
      if (S.phase === "dive") { if (k === "a1" || k === "a2" || k === "up" || k === "down") return dive(k === "a1" ? -1 : k === "a2" ? 1 : 0); return; }
      if (k === "up" || k === "down") { if (S.phase === "run" || S.phase === "def") { S.lane = Math.max(0, Math.min(2, S.lane + (k === "up" ? -1 : 1))); tone(520, 0.05, "triangle"); } return; }
      if (k === "tech") return useTech();
      if (S.phase === "run" && k === "a1") return finta();
      if (S.phase === "run" && k === "a2") return pass();
      if (S.phase === "aim" && k === "a1") return shoot(false);
      if (S.phase === "def" && k === "a1") return tackle();
    }
    const front = () => S.defs.filter((d) => !d.spun && d.lane === S.lane && d.x - S.x > 0).sort((a, b) => a.x - b.x)[0];
    function finta() {
      const d = front(), dx = d ? d.x - S.x : 999;
      if (d && dx > 10 && dx < 46) { d.spun = 1; S.data.finte++; addSpirit(18); say(0, pick(["Di qua!", "Troppo lento!", "Ciao!"])); pop(pick(ONO.finta), HX + dx, LANES[S.lane] - 30); tone(880, 0.08, "triangle"); }
      else { S.speed = 1.2; pop("…", HX, LANES[S.lane] - 30); setTimeout(() => (S.speed = 2.1), 400); }
      hud();
    }
    function pass() {
      const t = S.team.find((m) => !S.defs.some((d) => !d.spun && d.lane === m.lane && d.x - S.x > 0 && d.x - S.x < 70));
      if (!t) { pop("CHIUSO!", HX, LANES[S.lane] - 30); return; }
      const old = S.lane; S.lane = t.lane; t.lane = old; const cp = S.carrier; S.carrier = S.team.indexOf(t) + 1; t.p = cp === 0 ? hero : mates[cp - 1];
      S.data.passaggi++; addSpirit(10); say(0, pick(["Tua!", "Vai!", "Corri!"])); pop("PASSA!", HX, LANES[S.lane] - 30); tone(660, 0.06, "triangle"); hud();
    }
    function shoot(auto) {
      const x = auto ? S.kx + 60 : Math.sin(S.t / 22) * 54, saved = !auto && Math.abs(x - S.kx) < S.reach;
      S.phase = "result"; S.res = { x, saved, t: 80 };
      if (saved) { pop(pick(ONO.save), W / 2, 70, true); tone(200, 0.2, "sawtooth"); say(1, "Presa!"); } else { S.a++; say(0, "GOOOL!"); pop(pick(ONO.goal), W / 2, 70, true); [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 0.15, "triangle", 0.06), i * 90)); addSpirit(8); }
      hud(); setTimeout(nextAction, 1400);
    }
    function tackle() {
      if (S.stun > 0) return; const dx = S.ox - HX;
      if (S.lane === S.olane && dx > 6 && dx < 34) { S.data.contrasti++; addSpirit(16); say(0, pick(["Non passi!", "Mia!", "Fermo lì!"])); pop(pick(ONO.tackle), HX + dx, LANES[S.lane] - 30, true); tone(140, 0.12, "sawtooth", 0.06); S.phase = "result"; S.res = { won: true, t: 60 }; setTimeout(nextAction, 1000); }
      else { pop("A VUOTO", HX, LANES[S.lane] - 30); S.stun = 30; }
      hud();
    }
    function dive(dir) {
      if (S.phase !== "dive") return; const saved = dir === S.shotDir || (DF.gk0 > 0.1 && Math.random() < 0.15) || Math.random() < 0.05 * (BN.df | 0);
      S.phase = "result"; S.res = { dive: dir, saved, t: 80 };
      if (saved) { pop(pick(ONO.save), W / 2, 70, true); addSpirit(14); say(0, "Presa!"); tone(300, 0.15, "triangle"); } else { S.b++; pop("GOL LORO", W / 2, 70, true); tone(160, 0.3, "sawtooth"); }
      hud(); setTimeout(nextAction, 1400);
    }
    function useTech() {
      const ph = techPhase(), k = techs.find((x) => TECH[x].when === ph); if (!k || S.spirit < 100) return;
      S.spirit = 0; S.data.tecniche++; (S.data.usate = S.data.usate || {})[k] = 1; const T = TECH[k]; say(0, T.name + "!!"); S.panel = { t: 100, txt: T.name, sub: T.sub, tech: T.sfx, next: null }; const prev = S.phase; S.phase = "panel"; hud(); tone(220, 0.5, "sawtooth", 0.05);
      S.panel.next = () => { if (ph === "run") { S.phase = "run"; S.defs.forEach((d) => (d.spun = 1)); S.x = Math.max(S.x, S.len - 60); } else if (ph === "shot") { S.phase = "aim"; shoot(true); } else if (ph === "def") { S.phase = "def"; S.lane = S.olane; S.ox = HX + 20; tackle(); } labels(); };
      void prev;
    }
    // ------------------------------------------------------------ ciclo
    function tick() {
      S.t++;
      if (S.panel) { S.panel.t--; if (S.panel.t <= 0) { const n = S.panel.next; S.panel = null; if (n) n(); labels(); } return; }
      if (S.phase === "run") {
        S.x += S.speed;
        S.defs.forEach((d) => { if (d.spun) return; if (Math.random() < d.drift && d.x - S.x < 160) d.lane = Math.max(0, Math.min(2, d.lane + (d.lane < S.lane ? 1 : d.lane > S.lane ? -1 : 0))); });
        const d = front(); if (d && d.x - S.x <= 8) { // contrasto subito: palla persa
          S.phase = "result"; S.res = { lost: true, t: 60 }; say(1, pick(["Non passi!", "Presa!", "Ingenuo!"])); pop(pick(ONO.tackle), HX + 8, LANES[S.lane] - 30, true); tone(140, 0.15, "sawtooth"); setTimeout(nextAction, 1100); return;
        }
        if (S.x >= S.len) startAim();
      } else if (S.phase === "aim") { S.kx += S.kv; if (Math.abs(S.kx) > 50) S.kv = -S.kv; if (S.t > 420) shoot(false); }
      else if (S.phase === "def") {
        if (S.stun > 0) S.stun--;
        S.ox -= S.ovel; if (Math.random() < 0.012 + (style === "contropiede" ? 0.01 : 0)) S.olane = Math.max(0, Math.min(2, S.olane + (Math.random() < 0.5 ? -1 : 1)));
        if (S.ox < HX - 20) { pop("TI HA SUPERATO", HX, 80); startDive(); }
      } else if (S.phase === "dive") { if (S.t > 150) dive(9); }
      if (S.res && S.res.t > 0) S.res.t--;
    }
    // ------------------------------------------------------------ disegno (carta, inchiostro, retini)
    const ink = "#141414";
    function paper() { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, W, H); g.fillStyle = "rgba(20,20,20,.06)"; for (let y = 0; y < H; y += 5) for (let x = (y / 5) % 2 ? 2 : 0; x < W; x += 5) g.fillRect(x, y, 1.2, 1.2); }
    function speedLines(cx, cy, n, col) { g.strokeStyle = col || "rgba(20,20,20,.35)"; g.lineWidth = 1; for (let i = 0; i < n; i++) { const a = (i / n) * 6.28 + S.t * 0.01, r0 = 60 + (i % 3) * 15; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * 400, cy + Math.sin(a) * 400); g.stroke(); } }
    function person(x, y, p, col, flip, run) {
      const b = run ? Math.abs(Math.sin(S.t / 4)) * 2 : 0; g.save(); g.translate(x, y - b); g.scale(flip ? -1.3 : 1.3, 1.3);
      g.fillStyle = "rgba(0,0,0,.15)"; g.beginPath(); g.ellipse(0, 18 + b, 9, 3, 0, 0, 7); g.fill();
      g.strokeStyle = ink; g.lineWidth = 1.6; const lg = run ? Math.sin(S.t / 4) * 5 : 0;
      g.beginPath(); g.moveTo(-2, 8); g.lineTo(-3 - lg, 17); g.moveTo(2, 8); g.lineTo(3 + lg, 17); g.stroke();
      g.fillStyle = col; g.beginPath(); g.moveTo(-7, -2); g.lineTo(7, -2); g.lineTo(6, 10); g.lineTo(-6, 10); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = p.skin || "#e0ac7e"; g.beginPath(); g.arc(0, -9, 7, 0, 7); g.fill(); g.stroke();
      g.fillStyle = p.hair || ink; g.beginPath(); g.arc(0, -11, 7, Math.PI * 1.05, Math.PI * 1.95); g.lineTo(5, -12); g.closePath(); g.fill();
      g.fillStyle = ink; g.fillRect(2, -10, 1.6, 2.4); g.restore();
      if (p.name) { g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillStyle = ink; g.fillText(String(p.name).split(" ")[0], x, y + 31); g.textAlign = "left"; }
    }
    function field(scroll, dir) {
      paper(); g.fillStyle = "rgba(60,120,60,.12)"; g.fillRect(0, 80, W, 140);
      g.strokeStyle = ink; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 80); g.lineTo(W, 80); g.moveTo(0, 220); g.lineTo(W, 220); g.stroke();
      g.strokeStyle = "rgba(20,20,20,.25)"; g.setLineDash([4, 6]); LANES.forEach((y) => { g.beginPath(); g.moveTo(0, y + 18); g.lineTo(W, y + 18); g.stroke(); }); g.setLineDash([]);
      for (let i = 0; i < 8; i++) { const x = ((i * 60 - scroll * dir) % 480 + 480) % 480 - 60; g.fillStyle = "rgba(20,20,20,.08)"; g.fillRect(x, 80, 2, 140); }
      // tribuna disegnata a tratteggio
      g.fillStyle = "rgba(20,20,20,.1)"; for (let i = 0; i < 40; i++) { const x = ((i * 23 - scroll * 0.3 * dir) % 400 + 400) % 400 - 20; g.beginPath(); g.arc(x, 64 + (i % 3) * 4, 5, 0, 7); g.fill(); }
      g.strokeStyle = ink; g.lineWidth = 2; g.strokeRect(1, 1, W - 2, H - 2);
    }
    function draw() {
      g.setTransform(2, 0, 0, 2, 0, 0);
      if (S.phase === "run" || (S.phase === "result" && S.res && S.res.lost)) {
        field(S.x, 1); speedLines(-200, 150, 18, "rgba(20,20,20,.12)");
        S.team.forEach((m) => person(HX - 20 + m.off, LANES[m.lane], m.p, usCol, false, true));
        S.defs.forEach((d) => { const x = HX + (d.x - S.x); if (x < -20 || x > W + 20) return; if (d.spun) { g.save(); g.translate(x, LANES[d.lane]); g.rotate(S.t / 5); g.translate(-x, -LANES[d.lane]); person(x, LANES[d.lane], d.p, oppCol, true, false); g.restore(); } else person(x, LANES[d.lane], d.p, oppCol, true, true); });
        const me = S.carrier === 0 ? hero : mates[S.carrier - 1]; person(HX, LANES[S.lane], me, usCol, false, true);
        g.fillStyle = "#fff"; g.strokeStyle = ink; g.lineWidth = 1.2; g.beginPath(); g.arc(HX + 10, LANES[S.lane] + 15, 4, 0, 7); g.fill(); g.stroke();
        g.fillStyle = ink; g.beginPath(); g.moveTo(HX - 5, LANES[S.lane] - 30); g.lineTo(HX + 5, LANES[S.lane] - 30); g.lineTo(HX, LANES[S.lane] - 24); g.closePath(); g.fill();
        const k = Math.min(1, S.x / S.len); g.fillStyle = ink; g.fillRect(20, 228, (W - 40) * k, 3); g.strokeRect(20, 227, W - 40, 5); g.font = "bold 7px sans-serif"; g.fillText("PORTA", W - 46, 224);
      } else if (S.phase === "def" || (S.phase === "result" && S.res && S.res.won)) {
        field(S.t * 2, -1); person(S.ox, LANES[S.olane], S.op, oppCol, true, true);
        g.fillStyle = "#fff"; g.strokeStyle = ink; g.beginPath(); g.arc(S.ox - 10, LANES[S.olane] + 15, 4, 0, 7); g.fill(); g.stroke();
        person(HX, LANES[S.lane], hero, usCol, false, false);
        g.fillStyle = ink; g.beginPath(); g.moveTo(HX - 5, LANES[S.lane] - 30); g.lineTo(HX + 5, LANES[S.lane] - 30); g.lineTo(HX, LANES[S.lane] - 24); g.closePath(); g.fill();
        if (S.ox - HX < 50 && S.ox - HX > 0 && S.lane === S.olane) { g.strokeStyle = "rgba(200,40,40,.8)"; g.lineWidth = 2; g.beginPath(); g.arc(HX + 14, LANES[S.lane], 16, 0, 7); g.stroke(); }
      } else if (S.phase === "aim" || S.phase === "dive" || (S.phase === "result" && S.res)) {
        // la porta vista di fronte
        paper(); speedLines(W / 2, 140, 30);
        g.fillStyle = "rgba(60,120,60,.15)"; g.fillRect(0, 170, W, 70); g.strokeStyle = ink; g.lineWidth = 3; g.strokeRect(W / 2 - 80, 80, 160, 92); g.lineWidth = 0.6; for (let i = 1; i < 10; i++) { g.beginPath(); g.moveTo(W / 2 - 80 + i * 16, 80); g.lineTo(W / 2 - 80 + i * 16, 172); g.stroke(); } for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(W / 2 - 80, 80 + i * 16); g.lineTo(W / 2 + 80, 80 + i * 16); g.stroke(); }
        const mine = S.phase === "aim" || (S.res && S.res.x !== undefined), kx = mine ? S.kx : S.res && S.res.dive !== undefined ? S.res.dive * 45 : 0;
        person(W / 2 + kx, 150, mine ? (oppP[0].gk || { name: "Portiere", skin: "#d9b38c", hair: ink }) : hero, mine ? oppCol : usCol, false, false);
        g.strokeStyle = ink; g.lineWidth = 1.5; g.beginPath(); g.moveTo(W / 2 + kx - 22, 140); g.lineTo(W / 2 + kx + 22, 140); g.stroke();
        if (S.phase === "aim") { const x = W / 2 + Math.sin(S.t / 22) * 54; g.strokeStyle = "rgba(200,40,40,.9)"; g.lineWidth = 2; g.beginPath(); g.arc(x, 118, 9, 0, 7); g.moveTo(x - 13, 118); g.lineTo(x + 13, 118); g.moveTo(x, 105); g.lineTo(x, 131); g.stroke(); g.fillStyle = ink; g.font = "bold 9px sans-serif"; g.textAlign = "center"; g.fillText("TIRA NEL VARCO!", W / 2, 70); g.textAlign = "left"; }
        if (S.phase === "dive") { // il tiratore: guarda dove tirerà (attento alle finte in Sfida)
          person(W / 2, 214, S.op || oppP[0], oppCol, false, false); g.fillStyle = ink; g.font = "bold 9px sans-serif"; g.textAlign = "center"; g.fillText("TUFFATI! ◀ ● ▶", W / 2, 70);
          const ex = W / 2 + S.tell * 30; g.strokeStyle = "rgba(20,20,20,.6)"; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(W / 2, 205); g.lineTo(ex, 125); g.stroke(); g.setLineDash([]); g.textAlign = "left";
        }
        if (S.res && S.res.x !== undefined) { const t = 1 - S.res.t / 80, bx = W / 2 + S.res.x * Math.min(1, t * 2), by = 230 - Math.min(1, t * 2) * 112; g.fillStyle = "#fff"; g.strokeStyle = ink; g.lineWidth = 1.2; g.beginPath(); g.arc(bx, by, 5, 0, 7); g.fill(); g.stroke(); }
      }
      // onomatopee
      S.fx = S.fx.filter((f) => f.t-- > 0); S.fx.forEach((f) => { g.save(); g.translate(f.x, f.y - (f.big ? 0 : (45 - f.t) * 0.4)); g.rotate(-0.12); g.font = `900 ${f.big ? 30 : 15}px Impact, sans-serif`; g.textAlign = "center"; g.lineWidth = f.big ? 6 : 4; g.strokeStyle = "#fff"; g.strokeText(f.txt, 0, 0); g.fillStyle = f.big ? usCol : ink; g.fillText(f.txt, 0, 0); g.restore(); });
      // stacco a vignetta
      if (S.panel) {
        const p = S.panel, k = Math.min(1, (p.tech ? 100 : 70) - p.t) / 12;
        g.fillStyle = p.tech ? ink : "#f6f1e4"; g.fillRect(0, 0, W, H); if (p.tech) speedLines(W / 2, H / 2, 46, "rgba(255,255,255,.4)"); else speedLines(W / 2, H / 2, 30);
        g.fillStyle = p.tech ? usCol : ink; g.save(); g.translate(W / 2, H / 2 - 6); g.scale(Math.min(1, k), Math.min(1, k)); g.rotate(-0.06); g.font = `900 ${p.tech ? 34 : 28}px Impact, sans-serif`; g.textAlign = "center"; g.lineWidth = 6; g.strokeStyle = p.tech ? "#fff" : "#f6f1e4"; g.strokeText(p.txt, 0, 0); g.fillText(p.txt, 0, 0); g.restore();
        g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillStyle = p.tech ? "#fff" : ink; g.fillText(p.sub || "", W / 2, H / 2 + 26); if (p.tech) { g.font = "900 20px Impact, sans-serif"; g.fillText(p.tech + "!!", W / 2, H - 24); } g.textAlign = "left";
        g.strokeStyle = p.tech ? "#fff" : ink; g.lineWidth = 3; g.strokeRect(6, 6, W - 12, H - 12);
      }
      // la cornice della vignetta
      g.strokeStyle = ink; g.lineWidth = 3; g.strokeRect(1.5, 1.5, W - 3, H - 3);
    }
    // i primi piani: chi ha la palla (noi) e l'avversario più vicino, con la nuvoletta
    function face(c, x, w, p, col, mirror) {
      c.save(); c.beginPath(); c.rect(x, 4, w, 102); c.clip(); c.fillStyle = "#f6f1e4"; c.fillRect(x, 4, w, 102);
      c.strokeStyle = "rgba(20,20,20,.18)"; c.lineWidth = 1; for (let i = 0; i < 26; i++) { const a = i / 26 * 6.28 + S.t * 0.004; c.beginPath(); c.moveTo(x + w / 2 + Math.cos(a) * 30, 60 + Math.sin(a) * 30); c.lineTo(x + w / 2 + Math.cos(a) * 200, 60 + Math.sin(a) * 200); c.stroke(); }
      const A = window.__borgoApi, ok = p.id && A && A.portraitTo && A.CAST && A.CAST[p.id];
      if (ok) { try { A.portraitTo(c, p.id, x + w / 2, 58, 1.25); } catch (e) {} }
      else { c.fillStyle = col; c.beginPath(); c.moveTo(x + w / 2 - 40, 110); c.quadraticCurveTo(x + w / 2, 70, x + w / 2 + 40, 110); c.fill(); c.fillStyle = p.skin || "#e0ac7e"; c.beginPath(); c.ellipse(x + w / 2, 52, 24, 28, 0, 0, 7); c.fill(); c.strokeStyle = ink; c.lineWidth = 2; c.stroke(); c.fillStyle = p.hair || ink; c.beginPath(); c.ellipse(x + w / 2, 34, 25, 14, 0, Math.PI, 0); c.fill(); c.fillStyle = ink; [-9, 9].forEach((ex) => { c.beginPath(); c.moveTo(x + w / 2 + ex - 6, 50 - (mirror ? -1 : 1) * 2); c.lineTo(x + w / 2 + ex + 6, 50); c.lineTo(x + w / 2 + ex, 54); c.fill(); }); }
      c.restore(); c.strokeStyle = ink; c.lineWidth = 3; c.strokeRect(x, 4, w, 102);
      c.font = "900 11px Impact, sans-serif"; c.fillStyle = col; c.fillText(String(p.name || "").toUpperCase(), x + 6, 100);
    }
    function drawCu() {
      const c = cu; c.setTransform(2, 0, 0, 2, 0, 0); c.fillStyle = "#e9e2cf"; c.fillRect(0, 0, W, 110);
      const me = S.phase === "def" || S.phase === "dive" ? hero : S.carrier ? mates[S.carrier - 1] : hero;
      const near = S.phase === "def" || S.phase === "dive" ? S.op || oppP[0] : ((S.defs || []).filter((d) => !d.spun && d.x - S.x > 0).sort((a, b) => a.x - b.x)[0] || { p: oppP[0] }).p;
      face(c, 3, W / 2 - 8, me, usCol, false); face(c, W / 2 + 5, W / 2 - 8, near, oppCol, true);
      if (S.say && S.say.t > 0) { S.say.t--; const x = S.say.side ? W / 2 + 5 + 10 : 12, w = W / 2 - 30; c.fillStyle = "#fff"; c.strokeStyle = ink; c.lineWidth = 2; c.beginPath(); c.ellipse(x + w / 2, 22, w / 2, 14, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(x + w / 2 - 6, 34); c.lineTo(x + w / 2, 46); c.lineTo(x + w / 2 + 4, 34); c.fill(); c.font = "900 11px Impact, sans-serif"; c.textAlign = "center"; c.fillStyle = ink; c.fillText(S.say.txt, x + w / 2, 26); c.textAlign = "left"; }
    }
    function loop() { if (!el.isConnected) return; if (S.phase !== "intro" && !S.over) tick(); draw(); drawCu(); hud(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: S.data };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA!" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Finte ${S.data.finte} · Contrasti ${S.data.contrasti} · Passaggi ${S.data.passaggi} · Tecniche ${S.data.tecniche}</p>`, "Continua ▸", () => { cancelAnimationFrame(S.raf); window.removeEventListener("keydown", kd, true); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); try { (o.onDone || (() => {}))(res); } catch (e) { console.error(e); } });
    }
    S.finish = finish; S.press = press;
    el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("pointerdown", (e) => { e.preventDefault(); press(b.dataset.k); }));
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); const r = cv.getBoundingClientRect(), y = (e.clientY - r.top) / r.height; if (S.phase === "run" || S.phase === "def") press(y < 0.5 ? "up" : "down"); else if (S.phase === "dive") { const x = (e.clientX - r.left) / r.width; dive(x < 0.36 ? -1 : x > 0.64 ? 1 : 0); } else if (S.phase === "aim") press("a1"); });
    const kd = (e) => { const m = { ArrowUp: "up", ArrowDown: "down", " ": "a1", z: "a1", x: "a2", c: "tech" }[e.key]; if (S.phase === "dive" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { dive(e.key === "ArrowLeft" ? -1 : 1); e.preventDefault(); return; } if (m) { press(m); e.preventDefault(); e.stopPropagation(); } };
    window.addEventListener("keydown", kd, true);
    const techTxt = techs.length ? `<p><b>Tecniche</b> (con lo Spirito pieno): ${techs.map((k) => `<b>${TECH[k].name}</b> – ${TECH[k].sub}`).join(" · ")}.</p>` : "";
    card(o.title || "Vignette", `${o.intro || ""}<p><b>Attacco</b>: ▲▼ (o tocca in alto/in basso) cambia corsia. <b>FINTA</b> quando il difensore è vicino (non troppo!). <b>PASSA</b> al compagno libero. In fondo <b>TIRA</b> nel varco, lontano dal portiere.</p><p><b>Difesa</b>: mettiti nella corsia dell'attaccante e <b>CONTRASTO</b> quando è a un passo. Se ti supera, tuffati ◀ ● ▶ dove guarda il tiratore.</p>${techTxt}<p style="opacity:.8;font-size:12px">${S.nAct} azioni · avversari: ${esc(style)}</p>`, "Fischio d'inizio ▸", () => { S.phase = "wait"; nextAction(); });
    labels(); hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("vgCss")) return; const st = document.createElement("style"); st.id = "vgCss";
    st.textContent = `.vgOv{position:fixed;inset:0;z-index:300;background:#e9e2cf;display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#141414}
.vgOv .hud{width:min(100%,520px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:3px solid #141414;background:#f6f1e4;padding:4px 10px;font:900 13px system-ui;box-shadow:4px 4px 0 #141414}
.vgOv .hud .n0{color:var(--us)}.vgOv .hud .n1{text-align:right;color:var(--opp)}.vgOv .hud .sc{font:900 24px Impact,sans-serif;letter-spacing:2px}
.vgOv canvas{width:min(100%,520px);height:auto;aspect-ratio:3/2;flex:none;border:3px solid #141414;box-shadow:4px 4px 0 #141414;background:#f6f1e4;touch-action:none}
.vgOv canvas.cu{aspect-ratio:36/11;box-shadow:3px 3px 0 #141414;border-width:0}
.vgOv .spirit{position:relative;width:min(100%,520px);height:16px;border:3px solid #141414;background:#f6f1e4}.vgOv .spirit i{display:block;height:100%;width:0;background:repeating-linear-gradient(45deg,var(--us) 0 6px,#141414 6px 8px);transition:width .2s}.vgOv .spirit b{position:absolute;inset:0;text-align:center;font:900 10px/10px system-ui;letter-spacing:2px;color:#141414;text-shadow:0 0 3px #fff}
.vgOv .pad{width:min(100%,520px);display:grid;grid-template-columns:56px 1fr 1fr 56px;gap:8px}.vgOv .pad2{width:min(100%,520px);display:grid;grid-template-columns:1fr 80px;gap:8px}
.vgOv button{min-height:54px;border:3px solid #141414;background:#f6f1e4;font:900 16px Impact,system-ui,sans-serif;letter-spacing:1px;box-shadow:3px 3px 0 #141414;color:#141414;cursor:pointer}
.vgOv button:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #141414}.vgOv button.main{background:var(--us);color:#fff}.vgOv .tech:disabled{opacity:.4}.vgOv .tech.on{background:#141414;color:#ffd23f;animation:vgPulse .6s infinite alternate}.vgOv .quit{font-size:12px}
@keyframes vgPulse{to{transform:scale(1.04)}}
.vgOv .ov{position:absolute;inset:0;background:rgba(233,226,207,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
.vgOv .card{max-width:440px;width:100%;border:3px solid #141414;background:#f6f1e4;box-shadow:6px 6px 0 #141414;padding:14px}.vgOv .card h3{margin:0 0 8px;font:900 24px Impact,sans-serif;letter-spacing:1px}.vgOv .card p{margin:6px 0;font-size:14px;line-height:1.4}.vgOv .card .big{font:900 34px Impact,sans-serif}.vgOv .card button{width:100%;margin-top:10px;background:#141414;color:#ffd23f}`;
    document.head.appendChild(st);
  }
  window.__vignette = { start, TECH, get state() { return STATE; } };
})();
