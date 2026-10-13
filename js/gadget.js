// js/gadget.js - «OMBRE E GADGET» · la partita originale di «Il Cavaliere della Notte di Porto Grigio» (motore proprio, NON il kit di partita)
// Una partita di notte, sotto la pioggia, su un campo diviso in caselle (8 colonne × 3 corsie). Si gioca a turni, come un rompicapo:
// prima di ogni tua mossa i difensori MOSTRANO dove entreranno (caselle rosse = contrasto). Tu muovi il portatore di palla
// (avanti, su, giù, proteggi), passi a un compagno o tiri. Poi i difensori fanno esattamente quello che avevano annunciato.
// Le OMBRE: di notte vedi le intenzioni solo dei difensori vicini (una colonna) o sotto i due fari del campo; gli altri sono un «?».
// La CINTURA: prima della partita scegli fino a 4 gadget, ognuno si usa una volta (il Visore due):
//   visore (vedi tutto per 3 turni e dove si tuffa il portiere) · fumo (i difensori si fermano un turno) · rampino (avanti di 2 caselle)
//   scudo (il prossimo contrasto non passa) · segnale (i compagni scattano di 2 e il passaggio non si intercetta) · bolas (blocca un difensore per 2 turni)
// Quando la palla ce l'hanno loro: indovina la corsia del loro attaccante (un indizio c'è sempre, il Visore lo rende sicuro).
// Uso: window.__gadget.start({ title, us, usColor, hero:{ name, skin, hair }, mates:[{ name }], opp:{ name, color, players:[{ name }], keeper:{ name } },
//   gadgets:[id…] (disponibili), belt:[id…] (già in cintura), slots, minutes, intro, winTitle, onDone })
(function () {
  "use strict";
  if (window.__gadget) return;
  const W = 320, H = 220, CW = 34, CH = 46, BX = 18, BY = 44, COLS = 8, LIT = [2, 5];
  const GADGETS = {
    visore: { e: "🔭", n: "Visore", d: "3 turni: vedi tutte le intenzioni e il tuffo del portiere", uses: 2 },
    fumo: { e: "💨", n: "Fumogeno", d: "i difensori restano fermi questo turno", uses: 1 },
    rampino: { e: "🪝", n: "Rampino", d: "il portatore avanza di due caselle", uses: 1 },
    scudo: { e: "🛡️", n: "Mantello", d: "il prossimo contrasto non passa", uses: 1 },
    segnale: { e: "📣", n: "Segnale", d: "i compagni scattano di due, passaggio sicuro", uses: 1 },
    bolas: { e: "🕸️", n: "Bolas", d: "il difensore più vicino è bloccato 2 turni", uses: 1 },
  };
  const LANE = ["alta", "centrale", "bassa"];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random, cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)), key = (p) => p.x + "," + p.y;
  let STATE = null;
  function start(o) {
    if (document.querySelector(".gdOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.8 : 1;
    const hero = Object.assign({ name: "Tu", skin: "#e0ac7e", hair: "#2b1d14" }, o.hero || o.heroLook || {}), usCol = o.usColor || "#5a6a8a";
    const opp = Object.assign({ name: "Avversari", color: "#c83a3a", players: [], keeper: { name: "Il portiere" } }, o.opp || {});
    while (opp.players.length < 3) opp.players.push({ name: ["Il mastino", "Il pilone", "L'ombra"][opp.players.length] });
    const mates = (o.mates && o.mates.length ? o.mates : [{ name: "Il compagno" }, { name: "La compagna" }]).slice(0, 2); while (mates.length < 2) mates.push({ name: "Il compagno" });
    const avail = (o.gadgets && o.gadgets.length ? o.gadgets : Object.keys(GADGETS)).filter((k) => GADGETS[k]), slots = o.slots || 4;
    const S = { o, a: 0, b: 0, min: 0, nMin: o.minutes || 90, phase: "intro", over: false, t: 0, turn: 0, visor: 0, shield: false, safePass: false, fx: null, log: "",
      belt: (o.belt || avail.slice(0, slots)).filter((k) => avail.includes(k)).slice(0, slots), uses: {}, us: [], ds: [], car: 0, keeperDive: 1, att: null,
      data: { turni: 0, schivati: 0, contrasti: 0, tiri: 0, gadget: 0, recuperi: 0 } };
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "gdOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="clock"></i><span class="belt"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="msg"></div><div class="pad"></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || hero.name; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__gdAC = window.__gdAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.05; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (h) => { el.querySelector(".msg").innerHTML = h; };
    const pad = (btns) => { const p = el.querySelector(".pad"); p.innerHTML = ""; btns.forEach((b) => { const x = document.createElement("button"); x.type = "button"; x.innerHTML = b.l; if (b.cls) x.className = b.cls; x.disabled = !!b.dis; x.addEventListener("pointerdown", (e) => { e.preventDefault(); if (!x.disabled && !S.over) b.fn(); }); p.appendChild(x); }); };
    const left = (k) => (GADGETS[k].uses - (S.uses[k] | 0));
    const hud = () => {
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".clock").textContent = `${Math.min(S.nMin, Math.round(S.min))}'`;
      el.querySelector(".belt").innerHTML = S.belt.map((k) => `<b class="${left(k) > 0 ? "" : "off"}" title="${esc(GADGETS[k].n)}">${GADGETS[k].e}${left(k) > 1 ? "²" : ""}</b>`).join("");
    };
    const fx = (text, col) => { S.fx = { text, col: col || "#ffd23f", t: 0 }; };
    // ------------------------------------------------------------ il campo: posizioni e intenzioni
    const car = () => S.us[S.car];
    const free = (x, y, skip) => x >= 0 && x < COLS && y >= 0 && y < 3 && !S.ds.some((d) => d !== skip && d.x === x && d.y === y);
    const visible = (d) => S.visor > 0 || Math.abs(d.x - car().x) <= 1 || LIT.includes(d.x);
    function kickoff() {
      S.phase = "att"; S.car = 0; S.shield = false;
      S.us = [{ x: 1, y: 1, p: hero }, { x: 0, y: 0, p: mates[0] }, { x: 0, y: 2, p: mates[1] }];
      const lanes = [0, 1, 2].sort(() => R() - 0.5);
      S.ds = [4, 5, 6].map((x, i) => ({ x, y: lanes[i], p: opp.players[i], stun: 0, off: 0, int: null }));
      S.us.concat(S.ds).forEach((u) => { if (u.dx == null) { u.dx = u.x; u.dy = u.y; } });
      intents(); turnUi();
    }
    function intents() {
      const c = car(), opts = [[c.x + 1, c.y], [c.x, c.y - 1], [c.x, c.y + 1], [c.x, c.y]].filter(([x, y]) => x < COLS && y >= 0 && y < 3).map(([x, y]) => ({ x, y }));
      const pref = style === "difensiva" ? [3, 1, 1, 2] : style === "pressing" ? [4, 2, 2, 1] : [3, 2, 2, 1.5], taken = new Set(), aggr = Math.min(0.97, 0.8 * oppK * (DF.steal || 1));
      S.ds.slice().sort((a, b) => cheb(a, c) - cheb(b, c)).forEach((d) => {
        d.int = null; if (d.stun > 0) return;
        const cand = opts.map((p, i) => ({ p, w: pref[i] })).filter(({ p }) => cheb(p, d) <= 1 && !taken.has(key(p)) && free(p.x, p.y, d));
        if (cand.length && R() < aggr) { let r = R() * cand.reduce((s, q) => s + q.w, 0), pick = cand[0]; for (const q of cand) { r -= q.w; if (r <= 0) { pick = q; break; } } d.int = { x: pick.p.x, y: pick.p.y, tackle: true }; taken.add(key(pick.p)); return; }
        const tx = Math.min(COLS - 1, c.x + 1), nx = d.x + Math.sign(tx - d.x), ny = d.y + Math.sign(c.y - d.y);
        d.int = free(nx, ny, d) && !taken.has(nx + "," + ny) ? { x: nx, y: ny, tackle: false } : { x: d.x, y: d.y, tackle: false }; taken.add(key(d.int));
      });
      S.keeperDive = R() < 0.55 ? c.y : [0, 1, 2].filter((y) => y !== c.y)[R() < 0.5 ? 0 : 1];
    }
    function moveMates(n) {
      const c = car();
      S.us.forEach((u, i) => { if (i === S.car) return; for (let k = 0; k < n; k++) { if (u.x <= c.x && u.x < COLS - 1 && !S.us.some((v) => v !== u && v.x === u.x + 1 && v.y === u.y)) u.x++; } });
    }
    function enemies(still) {
      const c = car(); let lost = false;
      S.ds.forEach((d) => { d.off = Math.max(0, (d.off | 0) - 1); });
      S.ds.forEach((d) => {
        if (d.stun > 0) { d.stun--; return; } if (still || !d.int) return;
        if (free(d.int.x, d.int.y, d)) { d.x = d.int.x; d.y = d.int.y; }
        if (d.int.tackle && d.x === c.x && d.y === c.y && !lost) {
          S.data.contrasti++;
          if (S.shield) { S.shield = false; fx("MANTELLO!", "#c8d8ff"); tone(880, 0.2, "triangle", 0.05); }
          else if (R() < 0.88) { lost = true; S.lostBy = d; }
        } else if (d.int.tackle) { S.data.schivati++; d.off = 1; }
      });
      return lost;
    }
    // un turno d'attacco: la tua mossa, poi i compagni, poi i difensori
    function step(kind, arg) {
      if (S.phase !== "att" || S.over) return;
      const c = car(); let still = false, mates = 1; S.data.turni++; S.turn++;
      const mv = kind === "fwd" && c.x < COLS - 1 ? [c.x + 1, c.y] : kind === "up" && c.y > 0 ? [c.x, c.y - 1] : kind === "down" && c.y < 2 ? [c.x, c.y + 1] : null;
      if (mv && !moveTo(mv[0], mv[1])) { S.min += 3; return lose(`<b>CHIUSO!</b> ${esc(S.lostBy.p.name)} non si fa saltare. (Chi sbaglia un contrasto resta sbilanciato: quello sì che si salta.)`); }
      else if (kind === "pass") {
        const m = S.us[arg], blk = S.safePass ? null : between(c, m);
        if (blk && R() < 0.8) { S.safePass = false; tone(160, 0.3, "square", 0.04); return lose(`<b>INTERCETTATO!</b> ${esc(blk.p.name)} si mette in mezzo al passaggio.`); }
        S.car = arg; tone(520, 0.12, "triangle", 0.04);
      } else if (kind === "g") {
        const k = arg; if (!S.belt.includes(k) || left(k) <= 0) return; S.uses[k] = (S.uses[k] | 0) + 1; S.data.gadget++; tone(700, 0.18, "sine", 0.05, 1100);
        if (k === "visore") { S.visor = 3; fx("VISORE", "#7ad8ff"); S.turn--; S.data.turni--; hud(); return turnUi(); }
        if (k === "scudo") { S.shield = true; fx("MANTELLO", "#c8d8ff"); S.turn--; S.data.turni--; hud(); return turnUi(); }
        if (k === "bolas") { const d = S.ds.filter((q) => q.stun <= 0).sort((a, b) => cheb(a, c) - cheb(b, c))[0]; if (d) { d.stun = 2; d.int = null; } fx("BOLAS!", "#ffd23f"); S.turn--; S.data.turni--; hud(); return turnUi(); }
        if (k === "fumo") { still = true; fx("FUMOGENO", "#c8c8c8"); }
        if (k === "rampino") { for (let i = 0; i < 2 && car().x < COLS - 1; i++) swapTo(car().x + 1, car().y, true); fx("RAMPINO!", "#ffd23f"); }
        if (k === "segnale") { mates = 2; S.safePass = true; fx("SEGNALE", "#ffd23f"); }
      }
      moveMates(mates);
      S.min += 2;
      if (enemies(still)) return lose(`<b>CONTRASTO!</b> ${esc(S.lostBy.p.name)} entra nella casella annunciata e ti porta via la palla.`);
      if (S.visor > 0) S.visor--;
      if (S.min >= S.nMin) return finish();
      intents(); turnUi();
    }
    // dribbling: se nella casella c'è un difensore, si prova a saltarlo (sicuro se è sbilanciato o legato dalle bolas)
    function moveTo(x, y) {
      const d = S.ds.find((q) => q.x === x && q.y === y), c = car(); if (!d) { swapTo(x, y); return true; }
      if (!(d.off > 0 || d.stun > 0 || R() < 0.42 / oppK)) { S.lostBy = d; return false; }
      d.x = c.x; d.y = c.y; d.int = null; swapTo(x, y); S.data.dribbling = (S.data.dribbling | 0) + 1; fx("DRIBBLING!", "#7ad87a"); tone(760, 0.15, "triangle", 0.05, 990); return true;
    }
    // il portatore si sposta (scambiandosi col compagno se la casella è sua); jump = col Rampino scavalca i difensori
    function swapTo(x, y, jump) {
      const c = car(); if (!jump && !free(x, y)) return;
      if (jump && !free(x, y)) { const d = S.ds.find((q) => q.x === x && q.y === y); if (d) { d.x = Math.max(0, x - 1); } }
      const m = S.us.find((u) => u !== c && u.x === x && u.y === y); if (m) { m.x = c.x; m.y = c.y; }
      c.x = x; c.y = y;
    }
    function between(a, b) {
      const n = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); if (n <= 1) return null;
      for (let i = 1; i < n; i++) { const x = Math.round(a.x + ((b.x - a.x) * i) / n), y = Math.round(a.y + ((b.y - a.y) * i) / n), d = S.ds.find((q) => q.x === x && q.y === y && q.stun <= 0); if (d) return d; }
      return null;
    }
    function shoot(lane) {
      if (S.phase !== "att" || S.over) return; const c = car(); if (c.x < 5) return;
      S.data.tiri++; S.min += 3; const dist = COLS - 1 - c.x, base = [0.9, 0.74, 0.58][dist] || 0.5, saved = lane === S.keeperDive;
      const p = saved ? 0.1 : base / (style === "difensiva" ? 1.1 : 1) / oppK, goal = R() < p;
      tone(goal ? 660 : 200, 0.4, goal ? "triangle" : "square", 0.06, goal ? 1320 : 120);
      if (goal) { S.a++; fx("GOOOL!", "#ffd23f"); S.phase = "wait"; hud(); msg(`<b>GOL!</b> Tiro in corsia ${LANE[lane]}, il portiere ${esc(opp.keeper.name)} si tuffa ${saved ? "giusto ma non basta" : "dall'altra parte"}.`); return pad([{ l: "Avanti ▸", cls: "go", fn: defend }]); }
      fx(saved ? "PARATA!" : "FUORI!", "#ff8a7a"); S.phase = "wait"; hud();
      msg(saved ? `<b>PARATA.</b> ${esc(opp.keeper.name)} aveva letto la corsia ${LANE[lane]}.` : `<b>Fuori di poco.</b> La pioggia ha fatto scivolare il pallone.`);
      pad([{ l: "Avanti ▸", cls: "go", fn: defend }]);
    }
    function lose(t) { S.phase = "wait"; S.min += 1; fx("PALLA PERSA", "#ff8a7a"); hud(); msg(t); pad([{ l: "Difendi ▸", cls: "go", fn: defend }]); }
    // ------------------------------------------------------------ in difesa: la corsia del loro attaccante
    function defend() {
      if (S.over) return; if (S.min >= S.nMin) return finish();
      S.phase = "def"; const lane = style === "contropiede" ? [0, 2][R() < 0.5 ? 0 : 1] : Math.floor(R() * 3);
      const hint = S.visor > 0 || R() < 0.65 ? lane : (lane + 1 + Math.floor(R() * 2)) % 3;
      S.att = { lane, hint, who: opp.players[Math.floor(R() * opp.players.length)], fumo: false };
      S.ds.forEach((d, i) => { d.x = 2 + i; d.y = i; d.int = null; d.stun = 0; }); const at = S.att.who; S.ds[0].x = 1; S.ds[0].y = lane; S.ds[0].p = at;
      S.us.forEach((u, i) => { u.x = 0; u.y = i; });
      defUi(); hud();
    }
    function defUi() {
      const A = S.att;
      msg(`${Math.round(S.min)}' · Palla a loro. <b>${esc(A.who.name)}</b> parte in contropiede. ${S.visor > 0 ? `Col Visore lo vedi: va sulla corsia <b>${LANE[A.lane]}</b>.` : `Nella pioggia ti sembra che guardi verso la corsia <b>${LANE[A.hint]}</b>.`} Dove chiudi?`);
      const b = [0, 1, 2].map((y) => ({ l: `🧱 Chiudi ${LANE[y]}`, cls: y === (S.visor > 0 ? A.lane : -1) ? "hot" : "", fn: () => block(y) }));
      ["visore", "fumo", "bolas"].forEach((k) => { if (S.belt.includes(k)) b.push({ l: `${GADGETS[k].e} ${GADGETS[k].n}<small>${k === "visore" ? "vedi la corsia vera" : k === "fumo" ? "il loro tiro vale metà" : "lo fermi e basta"}</small>`, cls: "gd", dis: left(k) <= 0, fn: () => defGadget(k) }); });
      pad(b);
    }
    function defGadget(k) {
      if (S.phase !== "def" || left(k) <= 0) return; S.uses[k] = (S.uses[k] | 0) + 1; S.data.gadget++; tone(700, 0.18, "sine", 0.05, 1100);
      if (k === "visore") { S.visor = 3; fx("VISORE", "#7ad8ff"); hud(); return defUi(); }
      if (k === "fumo") { S.att.fumo = true; fx("FUMOGENO", "#c8c8c8"); hud(); return defUi(); }
      if (k === "bolas") { fx("BOLAS!", "#ffd23f"); return recover(`<b>BOLAS!</b> ${esc(S.att.who.name)} si ritrova con le caviglie legate. Palla tua.`); }
    }
    function block(y) {
      if (S.phase !== "def" || S.over) return; const A = S.att; S.min += 4; if (S.visor > 0) S.visor--;
      if (y === A.lane) { tone(600, 0.2, "triangle", 0.05); fx("RECUPERO!", "#7ad87a"); return recover(`<b>Letto!</b> Chiudi la corsia ${LANE[y]} e ${esc(A.who.name)} ti finisce addosso. Palla tua.`); }
      const p = 0.45 * oppK * (DF.shot || 1) * (A.fumo ? 0.5 : 1) * (style === "contropiede" ? 1.15 : 1), goal = R() < p;
      S.phase = "wait";
      if (goal) { S.b++; fx("GOL...", "#ff6a5a"); tone(140, 0.5, "sawtooth", 0.05); msg(`<b>GOL DI ${esc(A.who.name).toUpperCase()}.</b> È passato sulla corsia ${LANE[A.lane]}, tu chiudevi la ${LANE[y]}.`); }
      else { fx("FUORI!", "#7ad87a"); msg(`Passa sulla corsia ${LANE[A.lane]} e tira… <b>fuori!</b> ${A.fumo ? "Il fumogeno gli ha tolto la mira." : "La pioggia è dalla tua parte."}`); }
      hud(); pad([{ l: "Ripartiamo ▸", cls: "go", fn: () => (S.min >= S.nMin ? finish() : kickoff()) }]);
    }
    function recover(t) { S.data.recuperi++; S.phase = "wait"; hud(); msg(t); pad([{ l: "All'attacco ▸", cls: "go", fn: () => (S.min >= S.nMin ? finish() : kickoff()) }]); }
    // ------------------------------------------------------------ comandi del turno d'attacco
    function turnUi() {
      const c = car(), seen = S.ds.filter((d) => visible(d)).length;
      msg(`${Math.round(S.min)}' · Palla a <b>${esc(c.p.name)}</b>, corsia ${LANE[c.y]}. ${S.ds.some((d) => d.int && d.int.tackle && visible(d)) ? "Le caselle <b>rosse</b> sono i contrasti annunciati." : "Nessun contrasto in vista."}${S.ds.some((d) => d.off > 0) ? " Chi ha mancato il contrasto è <b>sbilanciato</b> (≈): saltalo!" : ""}${seen < 3 ? " Nel buio, qualcuno è un «?»." : ""}${S.shield ? " 🛡️" : ""}`);
      const b = [
        { l: "▲ Su", dis: c.y === 0, fn: () => step("up") }, { l: "▶ Avanti", cls: "go", dis: c.x >= COLS - 1, fn: () => step("fwd") }, { l: "▼ Giù", dis: c.y === 2, fn: () => step("down") }, { l: "● Proteggi", fn: () => step("hold") },
      ];
      S.us.forEach((u, i) => { if (i !== S.car) b.push({ l: `➜ Passa a ${esc(u.p.name)}`, fn: () => step("pass", i) }); });
      if (c.x >= 5) [0, 1, 2].forEach((y) => b.push({ l: `🎯 Tiro ${LANE[y]}${S.visor > 0 && y === S.keeperDive ? "<small>il portiere va qui</small>" : ""}`, cls: "hot", fn: () => shoot(y) }));
      S.belt.forEach((k) => { if (k !== "visore" || S.visor <= 0) b.push({ l: `${GADGETS[k].e} ${GADGETS[k].n}<small>${GADGETS[k].d}</small>`, cls: "gd", dis: left(k) <= 0 || (k === "rampino" && c.x >= COLS - 1), fn: () => step("g", k) }); });
      pad(b); hud();
    }
    // ------------------------------------------------------------ disegno: notte, pioggia, fari, pozzanghere
    const cx = (x) => BX + x * CW + CW / 2, cy = (y) => BY + y * CH + CH / 2;
    function token(x, y, col, p, isHero, dark) {
      g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(x, y + 10, 9, 3.5, 0, 0, 7); g.fill();
      if (isHero) { g.fillStyle = "#3a4458"; g.beginPath(); g.moveTo(x - 8, y - 4); g.quadraticCurveTo(x - 14 - Math.sin(S.t / 9) * 2, y + 10, x - 4, y + 11); g.lineTo(x + 2, y - 4); g.fill(); }
      g.fillStyle = dark ? "#1a1c24" : col; g.beginPath(); g.ellipse(x, y + 3, 7, 8, 0, 0, 7); g.fill();
      g.fillStyle = dark ? "#262833" : (p && p.skin) || "#e0b890"; g.beginPath(); g.arc(x, y - 7, 5, 0, 7); g.fill();
      if (!dark) { g.fillStyle = (p && p.hair) || "#2a2a2a"; g.beginPath(); g.arc(x, y - 9, 5, Math.PI, 0); g.fill(); }
      if (isHero) { g.fillStyle = "#2a3040"; g.fillRect(x - 5, y - 9, 10, 3); g.fillStyle = "#fff"; g.fillRect(x - 3, y - 8, 2, 1); g.fillRect(x + 1, y - 8, 2, 1); }
      if (dark) { g.fillStyle = "#ffd23f"; g.fillRect(x - 3, y - 8, 2, 1.5); g.fillRect(x + 1, y - 8, 2, 1.5); }
    }
    function draw() {
      S.t++; g.setTransform(2, 0, 0, 2, 0, 0);
      const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#0a0e18"); sky.addColorStop(1, "#141a26"); g.fillStyle = sky; g.fillRect(0, 0, W, H);
      // la città dietro la tribuna, con le finestre accese
      g.fillStyle = "#151b28"; for (let i = 0; i < 16; i++) { const h = 10 + ((i * 37) % 22); g.fillRect(i * 21, 30 - h, 19, h); }
      for (let i = 0; i < 40; i++) { if ((i * 13 + Math.floor(S.t / 90)) % 5) continue; g.fillStyle = "rgba(255,210,120,.6)"; g.fillRect((i * 29) % 316 + 2, 12 + ((i * 7) % 14), 2, 2); }
      // il prato bagnato, a strisce
      for (let x = 0; x < COLS; x++) { g.fillStyle = x % 2 ? "#1d3a26" : "#204029"; g.fillRect(BX + x * CW, BY, CW, CH * 3); }
      g.fillStyle = "#e8e8e8"; g.fillRect(BX + COLS * CW, BY + CH - 6, 6, CH + 12); g.strokeStyle = "rgba(232,232,232,.5)"; g.lineWidth = 1; g.strokeRect(BX + COLS * CW + 6, BY + CH - 6, 10, CH + 12);
      g.strokeStyle = "rgba(255,255,255,.08)"; for (let x = 0; x <= COLS; x++) { g.beginPath(); g.moveTo(BX + x * CW, BY); g.lineTo(BX + x * CW, BY + CH * 3); g.stroke(); } for (let y = 0; y <= 3; y++) { g.beginPath(); g.moveTo(BX, BY + y * CH); g.lineTo(BX + COLS * CW, BY + y * CH); g.stroke(); }
      // il buio: le colonne lontane dal portatore e fuori dai fari si scuriscono
      const c = S.us.length ? car() : { x: 1, y: 1 };
      for (let x = 0; x < COLS; x++) { const lit = LIT.includes(x), near = Math.abs(x - c.x) <= 1 || S.visor > 0 || S.phase !== "att"; if (!lit && !near) { g.fillStyle = "rgba(4,6,12,.55)"; g.fillRect(BX + x * CW, BY, CW, CH * 3); } }
      // i fari: coni di luce dall'alto e riflessi nelle pozzanghere
      g.save(); g.globalCompositeOperation = "lighter";
      LIT.forEach((x) => { const X = cx(x), gr = g.createLinearGradient(X, 0, X, BY + CH * 3); gr.addColorStop(0, "rgba(255,240,190,.28)"); gr.addColorStop(1, "rgba(255,240,190,0)"); g.fillStyle = gr; g.beginPath(); g.moveTo(X - 4, 2); g.lineTo(X + 4, 2); g.lineTo(X + CW / 2 + 4, BY + CH * 3); g.lineTo(X - CW / 2 - 4, BY + CH * 3); g.fill(); g.fillStyle = "#fff6d0"; g.fillRect(X - 5, 0, 10, 4); });
      [[2, 1.6], [5, 0.4], [3.3, 2.5], [6.4, 1.2]].forEach(([x, y], i) => { const X = BX + x * CW, Y = BY + y * CH, s = 0.6 + 0.2 * Math.sin(S.t / 30 + i); g.fillStyle = `rgba(150,180,255,${0.08 * s})`; g.beginPath(); g.ellipse(X, Y, 12, 4, 0, 0, 7); g.fill(); g.fillStyle = `rgba(255,220,150,${0.12 * s})`; g.fillRect(X - 6, Y - 1, 12, 1); });
      g.restore();
      if (S.us.length) {
        // le intenzioni dei difensori
        if (S.phase === "att") S.ds.forEach((d) => {
          if (d.stun > 0 || !d.int) return; const vis = visible(d);
          if (!vis) return;
          const X = cx(d.int.x), Y = cy(d.int.y);
          if (d.int.tackle) { g.fillStyle = `rgba(232,60,50,${0.28 + 0.1 * Math.sin(S.t / 6)})`; g.fillRect(X - CW / 2 + 2, Y - CH / 2 + 2, CW - 4, CH - 4); g.strokeStyle = "#ff5a4a"; g.lineWidth = 2; g.strokeRect(X - CW / 2 + 2, Y - CH / 2 + 2, CW - 4, CH - 4); }
          if (d.int.x !== d.x || d.int.y !== d.y) { g.strokeStyle = d.int.tackle ? "#ff8a7a" : "rgba(220,220,220,.6)"; g.lineWidth = 2; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(cx(d.x), cy(d.y)); g.lineTo(X, Y); g.stroke(); g.setLineDash([]); }
        });
        if (S.phase === "def" && S.att) { const y = S.visor > 0 ? S.att.lane : S.att.hint; g.fillStyle = S.visor > 0 ? "rgba(122,216,255,.22)" : "rgba(255,210,63,.13)"; g.fillRect(BX, BY + y * CH, CW * 3, CH); }
        // i giocatori (scivolano verso la casella)
        S.us.concat(S.ds).forEach((u) => { u.dx += (u.x - u.dx) * 0.2; u.dy += (u.y - u.dy) * 0.2; });
        S.ds.forEach((d) => { const vis = S.phase !== "att" || visible(d); token(cx(d.dx), cy(d.dy), opp.color, d.p, false, !vis); if (!vis && S.phase === "att") { g.fillStyle = "#ffd23f"; g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillText("?", cx(d.dx) + 9, cy(d.dy) - 10); } if (d.off > 0 && S.phase === "att") { g.fillStyle = "#7ad87a"; g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillText("≈", cx(d.dx) - 9, cy(d.dy) - 10); } if (d.stun > 0) { g.strokeStyle = "#ffd23f"; g.lineWidth = 1; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(cx(d.dx), cy(d.dy) + 6, 4 + k * 2, 0, 3.2); g.stroke(); } } });
        S.us.forEach((u, i) => token(cx(u.dx), cy(u.dy), usCol, u.p, i === 0, false));
        if (S.phase === "att" || S.phase === "wait") { const b = car(); S.bx = S.bx == null ? cx(b.dx) : S.bx + (cx(b.dx) + 7 - S.bx) * 0.3; S.by = S.by == null ? cy(b.dy) : S.by + (cy(b.dy) + 8 - S.by) * 0.3; g.fillStyle = "#f4f0e4"; g.beginPath(); g.arc(S.bx, S.by, 3, 0, 7); g.fill(); g.fillStyle = "#222"; g.fillRect(S.bx - 1, S.by - 1, 2, 2); }
        // i nomi, piccoli e sotto, per non coprire le teste
        g.font = "700 6.5px system-ui"; g.textAlign = "center"; g.fillStyle = "rgba(244,240,228,.8)"; const b = car(); if (b) g.fillText(b.p.name.split(" ")[0], cx(b.dx), cy(b.dy) + 19);
        // il portiere in porta, e dove si tufferà se hai il Visore
        const kx = BX + COLS * CW + 4, ky = BY + CH * 1.5 + (S.visor > 0 && S.phase === "att" ? (S.keeperDive - 1) * 16 : Math.sin(S.t / 25) * 6); token(kx, ky, "#2a2a2a", opp.keeper, false, false);
      }
      // la pioggia, davanti a tutto
      g.strokeStyle = "rgba(170,190,230,.35)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 60; i++) { const x = (i * 47 + S.t * 1.4) % 340 - 10, y = (i * 71 + S.t * 6) % 230 - 8; g.moveTo(x, y); g.lineTo(x - 2, y + 7); } g.stroke();
      if (S.fx) { const F = S.fx; F.t++; const a = Math.max(0, 1 - F.t / 50); g.font = "900 26px Impact, 'Arial Black', sans-serif"; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = `rgba(10,10,14,${a})`; g.strokeText(F.text, W / 2, 34 + F.t * 0.2); g.fillStyle = F.col; g.globalAlpha = a; g.fillText(F.text, W / 2, 34 + F.t * 0.2); g.globalAlpha = 1; if (F.t > 50) S.fx = null; }
    }
    function loop() { if (!el.isConnected) return; draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ inizio (la cintura) e fine
    function card(title, html, btn, fn, setup) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.className = "goB"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); if (setup) setup(ov); }
    function beltHtml() { return `<div class="pick">${avail.map((k) => `<button type="button" data-g="${k}" class="${S.belt.includes(k) ? "on" : ""}">${GADGETS[k].e} <b>${esc(GADGETS[k].n)}</b><small>${esc(GADGETS[k].d)}${GADGETS[k].uses > 1 ? " · 2 usi" : ""}</small></button>`).join("")}</div><p class="nb">Cintura: <b class="cnt">${S.belt.length}</b>/${slots}</p>`; }
    function beltSetup(ov) { ov.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { const k = b.dataset.g; if (S.belt.includes(k)) S.belt = S.belt.filter((x) => x !== k); else if (S.belt.length < slots) S.belt.push(k); ov.querySelectorAll("[data-g]").forEach((q) => q.classList.toggle("on", S.belt.includes(q.dataset.g))); ov.querySelector(".cnt").textContent = S.belt.length; hud(); })); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data) };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA NELLA NOTTE!" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Contrasti schivati ${S.data.schivati} · tiri ${S.data.tiri} · recuperi ${S.data.recuperi} · gadget usati ${S.data.gadget}</p>`, "Fine partita ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); });
    }
    S.finish = finish; S.step = step; S.shoot = shoot; S.block = block; S.defGadget = defGadget; S.kickoff = kickoff; S.defend = defend;
    S.act = (k, arg) => (S.phase === "def" ? (k === "g" ? defGadget(arg) : block(arg)) : k === "shoot" ? shoot(arg) : step(k, arg));
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    card(o.title || "Ombre e Gadget", `${o.intro || ""}<p>Si gioca a turni, di notte. Prima di ogni mossa i difensori <b>annunciano</b> dove entreranno: le caselle <b>rosse</b> sono contrasti. Muovi, passa o tira (dalla sesta colonna), poi loro fanno quello che hanno annunciato. Chi manca un contrasto resta <b>sbilanciato</b>: puoi saltarlo col dribbling. Nel buio vedi solo i vicini e chi è sotto i fari.</p><p><b>Scegli la cintura</b> (fino a ${slots} gadget):</p>${beltHtml()}`, "In campo ▸", () => kickoff(), beltSetup);
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("gdCss")) return; const st = document.createElement("style"); st.id = "gdCss";
    st.textContent = `.gdOv{position:fixed;inset:0;z-index:300;background:#0b0e16;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#e8eaf0;overflow:auto}
.gdOv .hud{width:min(100%,440px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:1px solid #3a4458;border-radius:6px;background:#121724;padding:4px 10px;font:800 12px system-ui,sans-serif}
.gdOv .hud .n0{color:var(--us);filter:brightness(1.8)}.gdOv .hud .n1{text-align:right;color:var(--opp);filter:brightness(1.6)}.gdOv .hud .sc{font:900 22px Impact,'Arial Black',sans-serif;color:#ffd23f}
.gdOv .bar{width:min(100%,440px);display:flex;justify-content:space-between;align-items:center;font:800 12px system-ui,sans-serif}.gdOv .bar i{font-style:normal}.gdOv .belt b{display:inline-block;margin-left:6px;font-size:17px}.gdOv .belt b.off{opacity:.25;filter:grayscale(1)}
.gdOv canvas{width:min(100%,440px,calc((100vh - 360px) * 1.45));height:auto;aspect-ratio:320/220;flex:none;border-radius:6px;border:1px solid #3a4458}
.gdOv .msg{width:min(100%,440px);min-height:36px;font-size:13px;line-height:1.4}.gdOv .msg b{color:#ffd23f}
.gdOv .pad{width:min(100%,440px);display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
.gdOv button{min-height:44px;border-radius:6px;border:1px solid #5a6680;background:#1c2232;color:#e8eaf0;font:800 12.5px system-ui,sans-serif;cursor:pointer;padding:5px}.gdOv button small{display:block;font:500 9.5px system-ui,sans-serif;opacity:.8;margin-top:2px}.gdOv button:disabled{opacity:.3}
.gdOv .pad button.go{background:#ffd23f;color:#111;border-color:#ffd23f}.gdOv .pad button.hot{background:#8a2a2a;border-color:#e85a4a}.gdOv .pad button.gd{background:#1a2a3e;border-color:#4a7ab8;grid-column:span 2;text-align:left}
.gdOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px}
.gdOv .ov{position:absolute;inset:0;background:rgba(6,8,14,.95);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.gdOv .card{max-width:440px;width:100%;border:1px solid #5a6680;border-radius:8px;background:#141a28;color:#e8eaf0;padding:14px;box-shadow:0 0 0 3px #0b0e16,0 0 24px rgba(122,170,255,.2)}.gdOv .card h3{margin:0 0 8px;font:900 22px Impact,'Arial Black',sans-serif;letter-spacing:.5px;color:#ffd23f}.gdOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.gdOv .card .big{font:900 34px Impact,'Arial Black',sans-serif;color:#ffd23f}
.gdOv .card .goB{width:100%;margin-top:10px;background:#ffd23f;color:#111;border-color:#ffd23f;font-size:15px;min-height:50px}
.gdOv .pick{display:grid;grid-template-columns:1fr 1fr;gap:6px}.gdOv .pick button{text-align:left;font-weight:600}.gdOv .pick button.on{background:#24406a;border-color:#7ab8ff;box-shadow:inset 0 0 0 2px #7ab8ff}.gdOv .nb{font-size:12px;opacity:.85}`;
    document.head.appendChild(st);
  }
  window.__gadget = { start, GADGETS, get state() { return STATE; } };
})();
