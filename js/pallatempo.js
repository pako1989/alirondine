// js/pallatempo.js - «PALLA DEL TEMPO» · la partita originale di «Rondine 1938-2038» (motore proprio, NON il kit di partita)
// UNA partita sola, giocata in tre epoche: 1938 (bianco e nero), 1978 (anni '70), 2038 (neon). Ogni epoca è un TEMPO.
// Si vede dall'alto, 2 contro 2 più i portieri. Levetta mobile (trascini il dito sul campo o frecce/WASD), PASSA, TIRA.
// Novità di regole:
//  - LE TRACCE: in 1938 e 1978 sul campo brillano dei SEGNI (seme, pietra, cavo, idrante). Se il pallone ci passa sopra, il segno si
//    ATTIVA, e nelle epoche dopo il campo CAMBIA: il seme diventa albero (1978) e albero-flipper al neon (2038); la pietra diventa statua
//    e poi un VARCO (il pallone che ci entra esce davanti alla porta); il cavo stacca il portiere-robot del 2038; l'idrante allaga il campo.
//  - TEMPO: ferma gli avversari per due secondi e mezzo (ricarica a ogni epoca). Col fischietto (o.fischio) c'è anche FISCHIO: annulla
//    l'ultimo gol subito.
// Uso: window.__pallatempo.start({ title, us, usColor, hero:{ name }, mate:{ name }, opp:{ name, color, players:[{ name }], keeper:{ name } },
//   eras:[1938,1978,2038], secs, pre:{ seme, pietra, cavo, idrante }, tempo, fischio, auto, oppStyle, intro, winTitle, onDone })
//   → r.data = { segni:[…], gol:{ 1938:[a,b], … }, tempi, fischi, rete }
(function () {
  "use strict";
  if (window.__pallatempo) return;
  const W = 240, H = 360, X0 = 14, X1 = 226, Y0 = 28, Y1 = 332, GX0 = 90, GX1 = 150, GM = 120;
  const R = Math.random, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ERA = {
    1938: { name: "1938", sub: "Bianco e nero", filter: "bn", col: "#d8d0bc", bg: "#14120e", card: "#2a2620", line: "rgba(240,236,220,.85)" },
    1978: { name: "1978", sub: "Anni '70", filter: "anni70", col: "#ffb347", bg: "#1e140c", card: "#3a2412", line: "rgba(255,248,225,.9)" },
    2038: { name: "2038", sub: "Neon", filter: null, col: "#46f0ff", bg: "#070a1c", card: "#101434", line: "rgba(70,240,255,.95)" },
  };
  // i segni: dove brillano, in che epoca, e cosa lasciano nelle epoche dopo
  const SEG = {
    seme: { era: 1938, x: 60, y: 236, name: "Seme", icon: "🌱", col: "#7ac84a", fx: { 1978: "albero", 2038: "alberoneon" }, txt: "nel 1978 un albero (sponda), nel 2038 un albero-flipper al neon" },
    pietra: { era: 1938, x: 182, y: 176, name: "Pietra", icon: "🪨", col: "#c8c0b0", fx: { 1978: "statua", 2038: "varco" }, txt: "nel 1978 una statua, nel 2038 un VARCO che porta il pallone davanti alla porta" },
    cavo: { era: 1978, x: 178, y: 246, name: "Cavo", icon: "🔌", col: "#ffd23f", fx: { 2038: "guasto" }, txt: "nel 2038 il portiere-robot è in avaria" },
    idrante: { era: 1978, x: 58, y: 142, name: "Idrante", icon: "💧", col: "#5ac8ff", fx: { 2038: "pozza" }, txt: "nel 2038 una pozza che rallenta tutti a centrocampo" },
  };
  const FXTXT = { albero: "un albero", statua: "una statua", alberoneon: "un albero-flipper", varco: "un varco", guasto: "il portiere-robot in avaria", pozza: "una pozza" };
  let STATE = null;
  function layout(era, act) { // gli ostacoli che le tracce attive lasciano in quest'epoca
    const L = [];
    Object.keys(SEG).forEach((id) => {
      if (!act.has(id)) return; const s = SEG[id], k = s.fx[era]; if (!k) return;
      if (k === "albero") L.push({ k, id, x: s.x, y: s.y, r: 9, solid: true });
      else if (k === "statua") L.push({ k, id, x: s.x, y: s.y, r: 11, solid: true });
      else if (k === "alberoneon") L.push({ k, id, x: s.x, y: s.y, r: 10, bump: true });
      else if (k === "varco") L.push({ k, id, x: s.x, y: s.y, r: 9, bx: GM, by: 82, cd: 0 });
      else if (k === "pozza") L.push({ k, id, x: 120, y: 190, r: 28 });
      else if (k === "guasto") L.push({ k, id, x: 0, y: 0, r: 0 });
    });
    return L;
  }
  function start(o) {
    if (document.querySelector(".ptOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1, steal: 1, shot: 1, gk0: 0, gk1: 0 }, style: "" }, DF = Object.assign({ opp: 1, steal: 1, shot: 1, gk0: 0, gk1: 0 }, cur.opts || {});
    const style = o.oppStyle || cur.style || "equilibrata", ERAS = (o.eras && o.eras.length ? o.eras : [1938, 1978, 2038]).filter((e) => ERA[e]);
    const usCol = o.usColor || "#2a6adf", opp = Object.assign({ name: "Avversari", color: "#d84a3a", players: [], keeper: { name: "Il portiere" } }, o.opp || {});
    while (opp.players.length < 2) opp.players.push({ name: ["Il primo", "Il secondo"][opp.players.length] });
    const bonusT = ((o.bonus || {}).te | 0), SECS = (o.secs || 38) + bonusT * 2;
    const mk = (team, role, sp, p) => ({ team, role, sp, p: p || {}, x: 0, y: 0, vx: 0, vy: 0, face: team ? Math.PI / 2 : -Math.PI / 2, cool: 0, hold: 0, frz: 0, think: 0, rolled: false, stun: 0 });
    const HERO = mk(0, "hero", 1.5, Object.assign({ name: "Tu" }, o.hero || o.heroLook)), MATE = mk(0, "mate", 1.38, Object.assign({ name: "Il compagno" }, o.mate)), GK0 = mk(0, "gk", 1.3, { name: "Il nostro portiere" });
    const kOpp = DF.opp > 1.05 ? 1.1 : DF.opp < 0.95 ? 0.82 : 1;
    const OP1 = mk(1, "press", 1.46 * kOpp, opp.players[0]), OP2 = mk(1, "ancora", 1.3 * kOpp, opp.players[1]), GK1 = mk(1, "gk", 1.3, opp.keeper);
    const ENTS = [HERO, MATE, GK0, OP1, OP2, GK1];
    const S = { o, a: 0, b: 0, ei: -1, era: null, phase: "intro", t: 0, left: 0, over: false, keys: {}, joy: null, fx: null, shake: 0, ents: ENTS, hero: HERO, ball: { x: GM, y: 200, vx: 0, vy: 0, own: null, noPick: 0, spin: 0 }, last: null,
      segni: new Set(), pre: new Set(Object.keys(o.pre || {}).filter((k) => o.pre[k] && SEG[k])), obst: [], marks: [], tempoLeft: 0, tempoFrz: 0, fischi: o.fischio | 0, fischiMax: o.fischio | 0, lastConc: 0, golden: false, gl: [], shots: 0, goalPause: 0, count: 0, auto: !!o.auto,
      data: { segni: [], gol: {}, tempi: 0, fischi: 0, rete: 0 }, log: [], raf: 0 };
    S.pre.forEach((k) => S.segni.add(k));
    STATE = S; css();
    const el = document.createElement("div"); el.className = "ptOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc">0 – 0</span><span class="n1"></span></div><div class="bar"><b class="era"></b><i class="clock"></i><span class="tip"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="pad"><button type="button" class="pass">↪ PASSA</button><button type="button" class="shoot">⚽ TIRA</button><button type="button" class="tmp">⏳ TEMPO</button><button type="button" class="fis">🎺 FISCHIO</button></div><div class="help">Trascina il dito sul campo per muoverti. Tasti: frecce o WASD · Spazio tira · P passa · T tempo${S.fischiMax ? " · F fischio" : ""}.</div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = opp.name; el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    if (!S.fischiMax) el.querySelector(".fis").style.display = "none";
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    const tip = (t) => { el.querySelector(".tip").innerHTML = t; };
    function tone(f, d, type, v, slide) { try { const A = (window.__ptAC = window.__ptAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.04; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const fx = (text, col, t) => { S.fx = { text, col: col || "#ffd23f", t: 0, max: t || 70 }; };
    const goalY = (team) => (team ? Y1 : Y0);
    const hud = () => {
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; const e = S.era;
      const eb = el.querySelector(".era"); eb.textContent = e ? `${e.name} · ${e.sub}` : ""; eb.style.color = e ? e.col : "#fff";
      el.querySelector(".clock").textContent = S.phase === "play" ? `${Math.max(0, Math.ceil(S.left / 60))}″${S.golden ? " ORO" : ""}` : "";
      const tb = el.querySelector(".tmp"); tb.textContent = `⏳ TEMPO ${S.tempoLeft}`; tb.disabled = S.phase !== "play" || S.tempoLeft <= 0 || S.tempoFrz > 0;
      const fb = el.querySelector(".fis"); fb.textContent = `🎺 FISCHIO ${S.fischi}`; fb.disabled = S.phase !== "play" || S.fischi <= 0;
      el.querySelector(".pass").disabled = S.phase !== "play" || S.ball.own !== HERO; el.querySelector(".shoot").disabled = S.phase !== "play";
      if (S.phase === "play") tip(S.tempoFrz > 0 ? "<b>Tempo fermo!</b> Gli avversari sono bloccati." : !S.ball.own ? "Pallone libero: prendilo!" : S.ball.own.team ? `Il pallone ce l'ha <b>${esc(opp.name)}</b>: toccalo per rubarlo.` : S.ball.own === HERO ? "Pallone tuo: <b>TIRA</b> in porta, o <b>PASSA</b>. Passa sui segni che brillano!" : "Il compagno ha il pallone: smarcati.");
    };
    // ------------------------------------------------------------ campo, epoche, tracce
    function place() { // posizioni di calcio d'inizio
      const set = (p, x, y) => { p.x = x; p.y = y; p.vx = p.vy = 0; p.cool = 20; p.frz = 0; p.hold = 0; p.rolled = false; p.think = 0; p.stun = 0; };
      set(HERO, GM, 262); set(MATE, 170, 236); set(GK0, GM, Y1 - 14); set(OP1, 112, 150); set(OP2, 134, 112); set(GK1, GM, Y0 + 14);
      HERO.face = MATE.face = -Math.PI / 2; OP1.face = OP2.face = Math.PI / 2;
      S.obst.forEach((ob) => { if (ob.k === "varco") ob.cd = 0; });
    }
    function kickoff(team) {
      place(); const b = S.ball; b.vx = b.vy = 0; b.noPick = 0; S.lastConc = 0;
      if (team) { OP1.x = 120; OP1.y = 176; OP2.x = 150; OP2.y = 124; b.own = OP1; b.x = OP1.x; b.y = OP1.y + 6; } else { HERO.y = 196; HERO.x = GM; b.own = HERO; b.x = HERO.x; b.y = HERO.y - 6; }
      S.last = b.own; S.phase = "play"; S.count = 0;
    }
    function beginPeriod(i) {
      S.ei = i; S.era = ERA[ERAS[i]]; const e = ERAS[i];
      S.obst = layout(e, S.segni); S.marks = Object.keys(SEG).filter((id) => SEG[id].era === e && !S.pre.has(id)).map((id) => ({ id, on: false, t: 0 }));
      S.left = SECS * 60; S.tempoLeft = (o.tempo == null ? 2 : o.tempo) + (e === 2038 ? 0 : 0); S.tempoFrz = 0; S.fischi = S.fischiMax; S.gl.push([0, 0]); S.golden = false;
      kickoff(i % 2 ? 1 : 0); hud(); tone(520, 0.25, "triangle", 0.05, 880);
      S.count = 150; S.phase = "count";
    }
    function activate(id) {
      const s = SEG[id]; S.segni.add(id); S.data.segni.push(id); const m = S.marks.find((x) => x.id === id); if (m) { m.on = true; m.t = 0; }
      fx(`${s.icon} ${s.name.toUpperCase()}!`, s.col, 90); tone(660, 0.3, "triangle", 0.06, 1320); tone(990, 0.25, "sine", 0.04, 1980);
      const nx = Object.keys(s.fx).filter((e) => ERAS.includes(+e) && +e > S.era.name * 1).map((e) => `${e}: ${FXTXT[s.fx[e]]}`); tip(`<b>${s.icon} ${s.name}</b> attivato · lascia ${nx.length ? nx.join(" · ") : "una traccia"}.`);
    }
    // ------------------------------------------------------------ azioni
    function kick(p, tx, ty, sp, err) {
      const b = S.ball; if (b.own !== p) return false;
      const ang = Math.atan2(ty - p.y, tx - p.x) + (R() - 0.5) * (err || 0);
      b.own = null; b.x = p.x + Math.cos(ang) * 8; b.y = p.y + Math.sin(ang) * 8; b.vx = Math.cos(ang) * sp; b.vy = Math.sin(ang) * sp; b.noPick = 12; S.last = p; p.cool = 16; p.face = ang;
      tone(p.team ? 240 : 420, 0.1, "square", 0.04, p.team ? 160 : 300); return true;
    }
    function shoot(p, powerful) {
      const b = S.ball; if (b.own !== p) return false; const gy = goalY(p.team), d = Math.hypot(p.x - GM, p.y - gy);
      let tx = GM + (p.x < GM ? 1 : -1) * 22, ty = gy; // al palo lontano
      if (p === HERO) { const fa = Math.atan2(Math.sin(p.face), Math.cos(p.face)), ga = Math.atan2(gy - p.y, tx - p.x); let df = Math.abs(fa - ga); if (df > Math.PI) df = 2 * Math.PI - df; if (df > 1.25) { tx = p.x + Math.cos(fa) * 120; ty = p.y + Math.sin(fa) * 120; } }
      S.shots++; if (p.team === 0) S.data.rete++; return kick(p, tx, ty, p.team ? 7.2 * clamp(DF.shot, 0.8, 1.2) : powerful ? 9.2 : 8.6, (p.team ? 0.26 : 0.2) * (1 + d / 220));
    }
    function pass(p, to) {
      const b = S.ball; if (b.own !== p) return false; if (!to) return false;
      const lead = 8; return kick(p, to.x + to.vx * lead, to.y + to.vy * lead, 6.4, 0.07);
    }
    const mateOf = (p) => (p === HERO ? MATE : p === MATE ? HERO : p === OP1 ? OP2 : p === OP2 ? OP1 : null);
    function useTempo() {
      if (S.phase !== "play" || S.tempoLeft <= 0 || S.tempoFrz > 0) return false;
      S.tempoLeft--; S.tempoFrz = 150; S.data.tempi++; ENTS.forEach((p) => { if (p.team) p.frz = 150; }); fx("⏳ TEMPO!", "#9af0ff", 60); tone(300, 0.5, "sawtooth", 0.05, 80); hud(); return true;
    }
    function useFischio() {
      if (S.phase !== "play" || S.fischi <= 0) return false; S.fischi--; S.data.fischi++;
      if (S.lastConc > 0 && S.b > 0) { S.b--; S.gl[S.gl.length - 1][1]--; S.lastConc = 0; kickoff(0); fx("🎺 ANNULLATO!", "#ffd23f", 90); tone(1600, 0.4, "square", 0.05, 900); hud(); return true; }
      ENTS.forEach((p) => { if (p.team) p.frz = Math.max(p.frz, 200); }); S.tempoFrz = 200; fx("🎺 FISCHIO!", "#ffd23f", 70); tone(1700, 0.35, "square", 0.05, 1000); hud(); return true;
    }
    function heroShoot() { if (S.phase !== "play") return false; if (S.ball.own === HERO) return shoot(HERO, true); return false; }
    function heroPass() { if (S.phase !== "play" || S.ball.own !== HERO) return false; return pass(HERO, MATE); }
    // ------------------------------------------------------------ gol
    function goal(team) {
      if (S.phase !== "play") return; const b = S.ball; b.own = null; b.vx = b.vy = 0;
      if (team === 0) { S.a++; S.gl[S.gl.length - 1][0]++; } else { S.b++; S.gl[S.gl.length - 1][1]++; S.lastConc = 240; }
      fx(team === 0 ? "GOL!" : "GOL LORO", team === 0 ? "#ffd23f" : "#ff8a7a", 80); S.shake = 10; S.phase = "goal"; S.goalPause = 110; S.next = team ? 0 : 1; S.nextKick = team;
      tone(team === 0 ? 660 : 220, 0.5, "triangle", 0.07, team === 0 ? 1320 : 110); hud();
    }
    // ------------------------------------------------------------ intelligenza dei giocatori
    function moveTo(p, tx, ty, k) {
      if (p.frz > 0) { p.vx *= 0.6; p.vy *= 0.6; return; }
      const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy); let sp = p.sp * (k || 1); S.obst.forEach((ob) => { if (ob.k === "pozza" && Math.hypot(p.x - ob.x, p.y - ob.y) < ob.r) sp *= 0.55; });
      if (S.ball.own === p) sp *= 0.93; if (p.role === "gk" && S.era && S.era.name === "2038" && p.team && S.segni.has("cavo")) sp *= 0.55;
      if (d > 2) { p.vx += ((dx / d) * sp - p.vx) * 0.35; p.vy += ((dy / d) * sp - p.vy) * 0.35; } else { p.vx *= 0.6; p.vy *= 0.6; }
      if (Math.hypot(p.vx, p.vy) > 0.3) p.face = Math.atan2(p.vy, p.vx);
    }
    function think(p) {
      const b = S.ball, own = b.own, gy = goalY(p.team), dir = p.team ? 1 : -1;
      p.think++;
      if (p.role === "gk") {
        const home = p.team ? Y0 + 12 : Y1 - 12;
        if (own === p) { p.hold--; moveTo(p, GM, home, 0.3); if (p.hold <= 0) { const to = p.team ? OP1 : MATE; kick(p, to.x, to.y, 5.6, 0.2); } return; }
        const near = Math.abs(b.y - home) < 170, tx = near ? clamp(b.x + b.vx * 4, GX0 - 6, GX1 + 6) : GM, ty = home + (near && Math.abs(b.y - home) < 70 ? dir * 10 : 0);
        moveTo(p, tx, clamp(ty, p.team ? Y0 + 6 : Y1 - 22, p.team ? Y0 + 22 : Y1 - 6), 0.9); return;
      }
      if (p.frz > 0) { p.frz--; p.vx *= 0.5; p.vy *= 0.5; return; }
      if (own === p) { // chi ha palla corre verso la porta, tira da vicino, passa se pressato
        const d = Math.hypot(p.x - GM, p.y - gy), cl = ENTS.filter((q) => q.team !== p.team && q.role !== "gk" && dist(q, p) < 26).length;
        moveTo(p, GM + (p.x < GM ? 24 : -24), gy, 1);
        const lim = style === "pressing" && p.team ? 140 : 120;
        if (d < lim && p.think > (p.team ? 34 : 48) && R() < (p.team ? 0.026 * DF.shot : 0.04)) shoot(p);
        else if (cl && p.think > 30 && mateOf(p) && R() < (p.team ? 0.025 : 0.035)) pass(p, mateOf(p));
        else if (p.role === "mate" && p.think > 100) pass(p, HERO);
        return;
      }
      if (own && own.team === p.team) { // sostiene l'azione
        const lane = p.role === "mate" || p.role === "ancora" ? 1 : -1;
        moveTo(p, clamp(own.x + (own.x < GM ? 52 : -52) * lane, X0 + 14, X1 - 14), clamp(own.y + dir * 48, Y0 + 40, Y1 - 40), 0.95); return;
      }
      if (p.role === "mate") { // chi non ha palla: si smarca / pressa
        const tx = own ? own.x : b.x, ty = own ? own.y : b.y; if (!own && dist(p, b) < 150) { moveTo(p, b.x, b.y, 1); return; }
        moveTo(p, own ? clamp(own.x + (own.x < GM ? 36 : -36), X0 + 14, X1 - 14) : tx, clamp(ty + 30, Y0 + 60, Y1 - 50), 0.9); return;
      }
      if (p.role === "press" || (p.team === 0 && p.role === "hero")) { moveTo(p, b.x + (own ? own.vx * 4 : b.vx * 3), b.y + (own ? own.vy * 4 : b.vy * 3), 1); return; }
      // ancora: sta fra pallone e porta
      const hy = p.team ? 108 : 252, tx = clamp((b.x + GM) / 2, GX0 - 30, GX1 + 30), ty = clamp(b.y * 0.35 + hy * 0.65, p.team ? 70 : 200, p.team ? 160 : 290);
      if (!own && dist(p, b) < 54) moveTo(p, b.x, b.y, 1); else moveTo(p, tx, ty, 0.9);
    }
    function heroMove() {
      let ix = 0, iy = 0; const K = S.keys;
      if (K.ArrowLeft || K.a) ix -= 1; if (K.ArrowRight || K.d) ix += 1; if (K.ArrowUp || K.w) iy -= 1; if (K.ArrowDown || K.s) iy += 1;
      if (S.joy) { const dx = S.joy.x - S.joy.ax, dy = S.joy.y - S.joy.ay, d = Math.hypot(dx, dy); if (d > 3) { const m = Math.min(1, d / 22); ix += (dx / d) * m; iy += (dy / d) * m; } }
      const l = Math.hypot(ix, iy); if (l > 1) { ix /= l; iy /= l; }
      let sp = HERO.sp; S.obst.forEach((ob) => { if (ob.k === "pozza" && Math.hypot(HERO.x - ob.x, HERO.y - ob.y) < ob.r) sp *= 0.55; }); if (S.ball.own === HERO) sp *= 0.93;
      HERO.vx += (ix * sp - HERO.vx) * 0.4; HERO.vy += (iy * sp - HERO.vy) * 0.4; if (Math.hypot(ix, iy) > 0.2) HERO.face = Math.atan2(iy, ix);
    }
    // la parata: quando il pallone passa la linea, conta quanto il portiere è vicino (e quanto è lontano il tiro)
    function saveAt(k) {
      const b = S.ball, dx = Math.abs(b.x - k.x), reach = dx < 11 ? 1 : dx < 22 ? 0.62 : dx < 34 ? 0.28 : 0.06;
      const sh = S.last && S.last.team !== k.team ? Math.hypot(S.last.x - k.x, S.last.y - k.y) : 100; let pr = (0.82 + (k.team ? DF.gk1 : DF.gk0)) * reach + (sh > 110 ? 0.1 : sh < 50 ? -0.14 : 0);
      if (k.team && S.era && S.era.name === "2038" && S.segni.has("cavo")) pr *= 0.4; pr = clamp(pr, 0.03, 0.95);
      if (R() >= pr) return false;
      b.own = k; k.hold = 36; b.vx = b.vy = 0; k.x = clamp(b.x, GX0 + 4, GX1 - 4); fx("PARATA!", k.team ? "#ff8a7a" : "#9af0ff", 40); tone(k.team ? 260 : 540, 0.18, "triangle", 0.05); if (k.team) S.data.parate = (S.data.parate | 0) + 1; return true;
    }
    // ------------------------------------------------------------ fisica
    function stepPlay() {
      const b = S.ball;
      if (S.auto) think(HERO); else heroMove();
      ENTS.forEach((p) => { if (p !== HERO) think(p); });
      ENTS.forEach((p) => {
        if (p.cool > 0) p.cool--; if (p.stun > 0) p.stun--;
        p.x += p.vx; p.y += p.vy; p.x = clamp(p.x, X0 + 6, X1 - 6); p.y = clamp(p.y, Y0 + (p.role === "gk" ? 4 : 10), Y1 - (p.role === "gk" ? 4 : 10));
        S.obst.forEach((ob) => { if (ob.solid) { const dx = p.x - ob.x, dy = p.y - ob.y, d = Math.hypot(dx, dy) || 1; if (d < ob.r + 6) { p.x = ob.x + (dx / d) * (ob.r + 6); p.y = ob.y + (dy / d) * (ob.r + 6); } } });
      });
      for (let i = 0; i < ENTS.length; i++) for (let j = i + 1; j < ENTS.length; j++) { const p = ENTS[i], q = ENTS[j]; if (p.role === "gk" || q.role === "gk") continue; const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1; if (d < 11) { const push = (11 - d) / 2; p.x -= (dx / d) * push; p.y -= (dy / d) * push; q.x += (dx / d) * push; q.y += (dy / d) * push; } }
      // il pallone
      if (b.own) {
        const p = b.own; b.x = p.x + Math.cos(p.face) * 6.5; b.y = p.y + Math.sin(p.face) * 6.5; b.vx = p.vx; b.vy = p.vy;
        if (p.role === "gk") { b.x = p.x; b.y = p.y + (p.team ? 7 : -7); }
        // contrasto: un avversario a contatto lo ruba, con una certa probabilità
        ENTS.forEach((q) => { if (b.own === p && q.team !== p.team && q.role !== "gk" && q.frz <= 0 && q.cool <= 0 && p.role !== "gk" && dist(q, p) < 10 && R() < (q.team ? 0.05 * DF.steal : 0.05)) { b.own = q; q.cool = 12; p.cool = 38; S.last = q; b.noPick = 6; tone(180, 0.1, "square", 0.04); } });
      } else {
        b.x += b.vx; b.y += b.vy; b.vx *= 0.985; b.vy *= 0.985; if (b.noPick > 0) b.noPick--; b.spin += Math.hypot(b.vx, b.vy) * 0.1;
        S.obst.forEach((ob) => {
          if (ob.k === "pozza") { if (Math.hypot(b.x - ob.x, b.y - ob.y) < ob.r) { b.vx *= 0.95; b.vy *= 0.95; } return; }
          if (ob.k === "varco") { if (ob.cd > 0) ob.cd--; else if (Math.hypot(b.x - ob.x, b.y - ob.y) < ob.r) { b.x = ob.bx; b.y = ob.by + 6; b.vx = (R() - 0.5) * 2.2; b.vy = -5.2; ob.cd = 50; S.varchi = (S.varchi || 0) + 1; fx("🌀 VARCO!", "#c8a8ff", 50); tone(300, 0.4, "sine", 0.06, 1400); } return; }
          if (ob.solid || ob.bump) { const dx = b.x - ob.x, dy = b.y - ob.y, d = Math.hypot(dx, dy) || 1; if (d < ob.r + 3) { const nx = dx / d, ny = dy / d, dot = b.vx * nx + b.vy * ny; if (dot < 0) { const k = ob.bump ? 1.9 : 1.6; b.vx -= k * dot * nx; b.vy -= k * dot * ny; if (ob.bump) { const v = Math.hypot(b.vx, b.vy); if (v < 6.5) { b.vx *= 6.5 / (v || 1); b.vy *= 6.5 / (v || 1); } } tone(ob.bump ? 880 : 200, 0.1, ob.bump ? "triangle" : "square", 0.04); } b.x = ob.x + nx * (ob.r + 3); b.y = ob.y + ny * (ob.r + 3); } }
        });
        const v = Math.hypot(b.vx, b.vy); if (v > 11) { b.vx *= 11 / v; b.vy *= 11 / v; }
        if (b.x < X0 + 2) { b.x = X0 + 2; b.vx = Math.abs(b.vx) * 0.8; } if (b.x > X1 - 2) { b.x = X1 - 2; b.vx = -Math.abs(b.vx) * 0.8; }
        // porte e traversa
        if (b.y < Y0 + 2) { if (b.x > GX0 + 3 && b.x < GX1 - 3) { if (!saveAt(GK1)) return goal(0); } else { b.y = Y0 + 2; b.vy = Math.abs(b.vy) * 0.8; } }
        if (b.y > Y1 - 2) { if (b.x > GX0 + 3 && b.x < GX1 - 3) { if (!saveAt(GK0)) return goal(1); } else { b.y = Y1 - 2; b.vy = -Math.abs(b.vy) * 0.8; } }
        // segni
        S.marks.forEach((m) => { const s = SEG[m.id]; if (!m.on && Math.hypot(b.x - s.x, b.y - s.y) < 11) activate(m.id); });
        // si raccoglie toccandolo
        if (b.noPick <= 0 && Math.hypot(b.vx, b.vy) < 5.2) { let best = null, bd = 8; ENTS.forEach((p) => { const d = dist(p, b); if (p.cool <= 0 && p.stun <= 0 && d < bd && !(p.role === "gk" && false)) { bd = d; best = p; } }); if (best) { b.own = best; S.last = best; best.think = 0; if (best.role === "gk") best.hold = 30; } }
      }
      // tempi fermi
      if (S.tempoFrz > 0) S.tempoFrz--;
      if (S.lastConc > 0) S.lastConc--;
      S.left--; if (S.left <= 0) endPeriod();
    }
    // ------------------------------------------------------------ fasi, schede
    function card(title, html, btn, fn, ecol) {
      const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; ov.querySelector(".card").style.borderColor = ecol || "#c8a040";
      const b = document.createElement("button"); b.type = "button"; b.className = "goB"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); S.cardOn = true;
    }
    const tracceHtml = () => {
      const act = [...S.segni]; if (!act.length) return `<p class="tr">Nessuna traccia, per ora. In 1938 e 1978 fai passare il pallone sui <b>segni che brillano</b>: lasceranno qualcosa nelle epoche dopo.</p>`;
      return `<p class="tr"><b>Le tue tracce</b><br>${act.map((id) => `${SEG[id].icon} <b>${SEG[id].name}</b>: ${esc(SEG[id].txt)}`).join("<br>")}</p>`;
    };
    function periodCard() {
      const i = S.ei + 1, e = ERA[ERAS[i]], lay = layout(ERAS[i], S.segni);
      const now = lay.length ? `<p class="tr">Nel ${e.name} il campo è <b>cambiato</b>: ${lay.map((x) => FXTXT[x.k]).join(", ")}.</p>` : "";
      const mk2 = Object.keys(SEG).filter((id) => SEG[id].era === ERAS[i] && !S.pre.has(id));
      const find = mk2.length ? `<p class="tr">Segni da trovare: ${mk2.map((id) => `${SEG[id].icon} <b>${SEG[id].name}</b>`).join(" · ")}.</p>` : "";
      card(`${e.name} · ${e.sub}`, `<p class="sc2">${S.a} – ${S.b}</p>${now}${find}${tracceHtml()}`, `Gioca il ${e.name} ▸`, () => { S.cardOn = false; beginPeriod(i); }, e.col);
    }
    function endPeriod() {
      S.phase = "pause"; S.data.gol[S.era.name] = S.gl[S.gl.length - 1].slice(); tone(1200, 0.5, "triangle", 0.06, 700);
      const last = S.ei >= ERAS.length - 1;
      if (!last) { fx("FISCHIO!", "#fff", 60); setTimeout(() => { if (!S.over) periodCard(); }, 900); return; }
      if (S.a === S.b && !S.golden && !S.extraDone) { S.extraDone = true; S.golden = true; S.left = 25 * 60; S.phase = "pause"; fx("GOL D'ORO!", "#ffd23f", 80); setTimeout(() => { if (!S.over) { kickoff(0); hud(); } }, 900); return; }
      setTimeout(() => finish(false), 600);
    }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const win = !quit && S.a > S.b;
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win, quit: !!quit, draw: !quit && S.a === S.b, data: Object.assign({}, S.data, { segni: [...new Set(S.data.segni)], varchi: S.varchi | 0 }) };
      const sg = [...S.segni].map((id) => `${SEG[id].icon} ${SEG[id].name}`).join(" · ") || "nessuna";
      const gl = Object.keys(S.data.gol).map((k) => `${k}: ${S.data.gol[k][0]}–${S.data.gol[k][1]}`).join(" · ");
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA NEL TEMPO!" : res.draw ? "Pareggio: il tempo non basta" : "Sconfitta: il tempo scorre", `<p class="big">${S.a} – ${S.b}</p><p>${gl || ""}</p><p>Tracce lasciate: ${sg}</p>`, "Fine partita ▸", () => { cancelAnimationFrame(S.raf); window.removeEventListener("keydown", kd, true); window.removeEventListener("keyup", ku, true); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); }, "#c8a040");
    }
    S.nEra = ERAS.length; S.finish = finish; S.skip = endPeriod; S.shoot = heroShoot; S.pass = heroPass; S.tempo = useTempo; S.fischio = useFischio; S.begin = beginPeriod; S.activate = activate; S.layout = layout;
    // ------------------------------------------------------------ comandi
    const toLocal = (e) => { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; };
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); const q = toLocal(e); S.joy = { ax: q.x, ay: q.y, x: q.x, y: q.y }; try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
    cv.addEventListener("pointermove", (e) => { if (S.joy) { const q = toLocal(e); S.joy.x = q.x; S.joy.y = q.y; } });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => cv.addEventListener(ev, () => { S.joy = null; }));
    [["pass", heroPass], ["shoot", heroShoot], ["tmp", useTempo], ["fis", useFischio]].forEach(([c, fn]) => el.querySelector("." + c).addEventListener("pointerdown", (e) => { e.preventDefault(); fn(); hud(); }));
    const KM = { ArrowLeft: "ArrowLeft", ArrowRight: "ArrowRight", ArrowUp: "ArrowUp", ArrowDown: "ArrowDown", a: "a", d: "d", w: "w", s: "s", A: "a", D: "d", W: "w", S: "s" };
    const kd = (e) => { if (!el.isConnected) return; if (KM[e.key]) { S.keys[KM[e.key]] = true; e.preventDefault(); e.stopPropagation(); } else if (e.key === " ") { heroShoot(); e.preventDefault(); e.stopPropagation(); } else if (e.key === "p" || e.key === "P") { heroPass(); e.stopPropagation(); } else if (e.key === "t" || e.key === "T") { useTempo(); e.stopPropagation(); } else if (e.key === "f" || e.key === "F") { useFischio(); e.stopPropagation(); } };
    const ku = (e) => { if (KM[e.key]) { S.keys[KM[e.key]] = false; e.stopPropagation(); } };
    window.addEventListener("keydown", kd, true); window.addEventListener("keyup", ku, true);
    // ------------------------------------------------------------ disegno
    const px = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function circ(x, y, r, c) { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    function field(en) {
      const t = S.t;
      if (en === 1938) { // campo di terra e sterpaglie, steccato di legno, folla coi cappelli
        px(0, 0, W, H, "#1c1914"); for (let y = Y0; y < Y1; y += 24) px(X0, y, X1 - X0, 24, (y / 24) % 2 ? "#6e7a58" : "#657150");
        for (let i = 0; i < 40; i++) px(X0 + ((i * 53) % (X1 - X0 - 12)), Y0 + ((i * 97) % (Y1 - Y0 - 8)), 9, 3, "rgba(90,70,40,.55)");
        for (let y = 6; y < H - 6; y += 12) { [4, 232].forEach((x) => { px(x, y, 6, 8, "#8a8070"); px(x - 1, y - 2, 8, 2, "#3a342c"); }); }
        px(X0 - 3, 0, 2, H, "#5a4a3a"); px(X1 + 1, 0, 2, H, "#5a4a3a");
      } else if (en === 1978) { // erba all'italiana, cartelloni arancioni, folla con le bandiere
        px(0, 0, W, H, "#3a2412"); for (let y = Y0; y < Y1; y += 22) px(X0, y, X1 - X0, 22, (y / 22) % 2 ? "#4f9a3a" : "#459033");
        for (let y = 8; y < H - 8; y += 10) { [3, 229].forEach((x, k) => { px(x, y, 7, 7, ["#ff7a3a", "#ffd23f", "#3a8ac8", "#fff"][(y / 10 + k) % 4 | 0]); }); }
        for (let i = 0; i < 4; i++) { px(1, 20 + i * 86, 10, 5, ["#ff5a3a", "#ffd23f"][i % 2]); px(X1 + 3, 60 + i * 86, 10, 5, ["#3a8ac8", "#ff5a3a"][i % 2]); }
      } else { // neon: prato scuro con griglia luminosa, tifosi-ologramma, droni
        px(0, 0, W, H, "#05071a"); for (let y = Y0; y < Y1; y += 24) px(X0, y, X1 - X0, 24, (y / 24) % 2 ? "#0b1c3a" : "#0a1832");
        g.strokeStyle = "rgba(70,240,255,.08)"; g.lineWidth = 1; for (let x = X0; x <= X1; x += 16) { g.beginPath(); g.moveTo(x, Y0); g.lineTo(x, Y1); g.stroke(); }
        for (let y = 8; y < H - 8; y += 9) { [5, 231].forEach((x, k) => { const on = ((t >> 3) + y + k) % 5; px(x, y, 4, 4, on ? "rgba(70,240,255,.55)" : "rgba(255,70,200,.8)"); }); }
        const dy = Math.sin(t / 30) * 4; px(60, 10 + dy, 14, 3, "#46f0ff"); px(166, 12 - dy, 14, 3, "#ff46c8"); px(64, 13 + dy, 6, 1, "rgba(70,240,255,.5)");
      }
      const E = ERA[en], gl = en === 2038 ? "#46f0ff" : en === 1978 ? "#fff8e1" : "#e8e4d4";
      g.strokeStyle = E.line; g.lineWidth = en === 2038 ? 1.4 : 1.2; g.strokeRect(X0, Y0, X1 - X0, Y1 - Y0); g.beginPath(); g.moveTo(X0, 180); g.lineTo(X1, 180); g.stroke(); g.beginPath(); g.arc(GM, 180, 28, 0, 7); g.stroke();
      g.strokeRect(GX0 - 30, Y0, 120, 44); g.strokeRect(GX0 - 30, Y1 - 44, 120, 44); g.strokeRect(GX0 + 10, Y0, 40, 18); g.strokeRect(GX0 + 10, Y1 - 18, 40, 18);
      [[Y0, -1], [Y1, 1]].forEach(([y, s]) => { px(GX0, s < 0 ? y - 8 : y, GX1 - GX0, 8, en === 2038 ? "rgba(70,240,255,.28)" : "rgba(255,255,255,.22)"); g.strokeStyle = gl; g.lineWidth = 2; g.strokeRect(GX0, s < 0 ? y - 8 : y, GX1 - GX0, 8); if (en === 2038) { g.strokeStyle = "rgba(70,240,255,.5)"; g.lineWidth = 1; for (let k = GX0 + 6; k < GX1; k += 6) { g.beginPath(); g.moveTo(k, s < 0 ? y - 8 : y); g.lineTo(k, s < 0 ? y : y + 8); g.stroke(); } } });
    }
    function obstacles() {
      S.obst.forEach((ob) => {
        if (ob.k === "pozza") { g.fillStyle = S.era.name === "2038" ? "rgba(255,70,200,.28)" : "rgba(80,140,200,.35)"; g.beginPath(); g.ellipse(ob.x, ob.y, ob.r, ob.r * 0.7, 0, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1; g.beginPath(); g.ellipse(ob.x, ob.y, ob.r * 0.6 + Math.sin(S.t / 12) * 2, ob.r * 0.4, 0, 0, 7); g.stroke(); }
        else if (ob.k === "albero") { px(ob.x - 2, ob.y - 2, 4, 9, "#5a3a22"); circ(ob.x, ob.y - 6, 11, "#2f6a2a"); circ(ob.x - 5, ob.y - 3, 7, "#3f8a34"); circ(ob.x + 5, ob.y - 3, 7, "#357a2d"); }
        else if (ob.k === "statua") { px(ob.x - 8, ob.y + 2, 16, 8, "#9a9486"); px(ob.x - 4, ob.y - 10, 8, 13, "#bdb7a8"); circ(ob.x, ob.y - 12, 4, "#cfc9ba"); }
        else if (ob.k === "alberoneon") { const a = 0.6 + 0.3 * Math.sin(S.t / 9); g.save(); g.globalCompositeOperation = "lighter"; circ(ob.x, ob.y, 17, `rgba(70,255,160,${a * 0.25})`); g.restore(); px(ob.x - 2, ob.y - 2, 4, 9, "#1a4a3a"); circ(ob.x, ob.y - 5, 10, "#0a3a2a"); g.strokeStyle = `rgba(70,255,160,${a})`; g.lineWidth = 2; g.beginPath(); g.arc(ob.x, ob.y - 5, 10, 0, 7); g.stroke(); for (let k = 0; k < 5; k++) circ(ob.x + Math.cos(S.t / 20 + k * 1.3) * 6, ob.y - 5 + Math.sin(S.t / 20 + k * 1.3) * 6, 1.4, "#c8ffe0"); }
        else if (ob.k === "varco") { [[ob.x, ob.y], [ob.bx, ob.by]].forEach(([x, y], q) => { for (let k = 0; k < 3; k++) { g.strokeStyle = `rgba(${q ? "255,120,230" : "180,140,255"},${0.8 - k * 0.2})`; g.lineWidth = 1.6; g.beginPath(); g.ellipse(x, y, 9 - k * 2.5, 9 - k * 2.5, S.t / 14 + k, 0, 5); g.stroke(); } }); }
      });
    }
    function marks() {
      S.marks.forEach((m) => {
        const s = SEG[m.id], a = 0.5 + 0.4 * Math.sin(S.t / 10 + s.x); m.t++;
        if (m.on) { g.strokeStyle = s.col; g.globalAlpha = Math.max(0, 1 - m.t / 60); g.lineWidth = 2; g.beginPath(); g.arc(s.x, s.y, 8 + m.t / 3, 0, 7); g.stroke(); g.globalAlpha = 1; g.font = "10px system-ui"; g.textAlign = "center"; g.fillStyle = s.col; g.globalAlpha = 0.55; g.fillText(s.icon, s.x, s.y + 4); g.globalAlpha = 1; return; }
        g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createRadialGradient(s.x, s.y, 1, s.x, s.y, 17); gr.addColorStop(0, s.col); gr.addColorStop(1, "rgba(0,0,0,0)"); g.globalAlpha = a * 0.55; g.fillStyle = gr; g.fillRect(s.x - 18, s.y - 18, 36, 36); g.restore();
        g.strokeStyle = s.col; g.lineWidth = 1.6; g.globalAlpha = 0.8; g.setLineDash([3, 3]); g.beginPath(); g.arc(s.x, s.y, 9, S.t / 30, S.t / 30 + 6.28); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
        g.font = "12px system-ui"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText(s.icon, s.x, s.y + 4.5);
      });
      g.textAlign = "left";
    }
    function player(p) {
      const en = S.era ? S.era.name * 1 : 2038, col = p.team ? opp.color : usCol, hero = p === HERO, run = Math.sin(S.t / 3 + p.x) * (Math.hypot(p.vx, p.vy) > 0.4 ? 1.6 : 0);
      g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); g.ellipse(p.x, p.y + 6, 6, 2.6, 0, 0, 7); g.fill();
      if (p.frz > 0) { g.strokeStyle = "rgba(154,240,255,.75)"; g.lineWidth = 1.2; g.beginPath(); g.arc(p.x, p.y, 9, 0, 7); g.stroke(); }
      if (p.role === "gk") { px(p.x - 5, p.y - 3, 10, 9, p.team ? "#2a2a30" : "#e8d84a"); circ(p.x, p.y - 6, 4, "#e0b890"); px(p.x - 8, p.y - 2 + run * 0.3, 3, 5, "#fff"); px(p.x + 5, p.y - 2 - run * 0.3, 3, 5, "#fff"); return; }
      if (hero) { g.strokeStyle = "#ffd23f"; g.lineWidth = 1.4; g.beginPath(); g.arc(p.x, p.y, 9.5, 0, 7); g.stroke(); g.fillStyle = "#ffd23f"; g.beginPath(); g.moveTo(p.x, p.y - 17); g.lineTo(p.x - 3, p.y - 22); g.lineTo(p.x + 3, p.y - 22); g.fill(); }
      px(p.x - 4, p.y - 3, 8, 8, col); px(p.x - 4 + (run > 0 ? 1 : 0), p.y + 5, 3, 3 + Math.abs(run) * 0.4, en === 1938 ? "#e8e4d4" : en === 1978 ? "#fff" : "#10162a"); px(p.x + 1 - (run > 0 ? 1 : 0), p.y + 5, 3, 3 + Math.abs(run) * 0.4, en === 1938 ? "#e8e4d4" : en === 1978 ? "#fff" : "#10162a");
      if (en === 1978) { px(p.x - 4, p.y + 7, 3, 2, "#c83a3a"); px(p.x + 1, p.y + 7, 3, 2, "#c83a3a"); }
      circ(p.x, p.y - 6, 4, p.p.skin || (p.team ? "#d9a679" : "#e0b48a"));
      const hair = p.p.hair || (p.team ? "#2a2a2a" : "#3a2a1a");
      if (en === 1938) { px(p.x - 4, p.y - 11, 8, 3, hair); if (!p.team && p.role !== "hero") px(p.x - 5, p.y - 9, 10, 1.5, "#cfc8b4"); }
      else if (en === 1978) { px(p.x - 5, p.y - 11, 10, 4, hair); px(p.x - 5, p.y - 8, 2, 5, hair); px(p.x + 3, p.y - 8, 2, 5, hair); if (p.role !== "hero") px(p.x - 3, p.y - 4, 6, 1.5, hair); }
      else { px(p.x - 4, p.y - 11, 8, 3, hair); g.strokeStyle = col; g.globalAlpha = 0.8; g.lineWidth = 1.2; g.strokeRect(p.x - 4.5, p.y - 3.5, 9, 9); g.globalAlpha = 1; g.save(); g.globalCompositeOperation = "lighter"; circ(p.x, p.y + 9, 4 + Math.sin(S.t / 5 + p.x) * 0.8, "rgba(70,240,255,.35)"); g.restore(); }
      px(p.x + Math.cos(p.face) * 3 - 1, p.y - 6 + Math.sin(p.face) * 2 - 1, 2, 2, "rgba(0,0,0,.6)");
    }
    function ballDraw() {
      const b = S.ball, en = S.era ? S.era.name * 1 : 2038; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(b.x, b.y + 3, 3.6, 1.6, 0, 0, 7); g.fill();
      if (en === 2038) { g.save(); g.globalCompositeOperation = "lighter"; circ(b.x, b.y, 8, "rgba(70,240,255,.28)"); g.restore(); circ(b.x, b.y, 3.6, "#e8ffff"); g.strokeStyle = "#46f0ff"; g.lineWidth = 1; g.beginPath(); g.arc(b.x, b.y, 3.6, 0, 7); g.stroke(); }
      else if (en === 1978) { circ(b.x, b.y, 3.8, "#fff"); g.fillStyle = "#222"; for (let k = 0; k < 3; k++) { const a = b.spin + k * 2.1; g.fillRect(b.x + Math.cos(a) * 2 - 0.9, b.y + Math.sin(a) * 2 - 0.9, 1.8, 1.8); } g.strokeStyle = "#222"; g.lineWidth = 0.6; g.beginPath(); g.arc(b.x, b.y, 3.8, 0, 7); g.stroke(); }
      else { circ(b.x, b.y, 4.2, "#a8744a"); g.strokeStyle = "#3a2410"; g.lineWidth = 0.8; g.beginPath(); g.arc(b.x, b.y, 4.2, 0, 7); g.stroke(); g.beginPath(); g.moveTo(b.x - 3, b.y); g.lineTo(b.x + 3, b.y); g.moveTo(b.x - 1.5, b.y - 1); g.lineTo(b.x - 1.5, b.y + 1); g.moveTo(b.x + 1.5, b.y - 1); g.lineTo(b.x + 1.5, b.y + 1); g.stroke(); }
    }
    function draw() {
      g.setTransform(2, 0, 0, 2, 0, 0);
      if (S.shake > 0) { g.translate((R() - 0.5) * S.shake * 0.6, (R() - 0.5) * S.shake * 0.6); S.shake--; }
      const en = S.era ? S.era.name * 1 : ERAS[0]; field(en); obstacles(); marks();
      [...ENTS].sort((p, q) => p.y - q.y).forEach(player); ballDraw();
      if (S.tempoFrz > 0) { g.fillStyle = "rgba(120,200,255,.14)"; g.fillRect(0, 0, W, H); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 1.5; g.beginPath(); g.arc(W / 2, H / 2, 60 + (150 - S.tempoFrz % 150) / 2, 0, 7); g.stroke(); }
      const E = S.era; if (E && E.filter && C && C.filter) { try { C.filter(g, E.filter, W, H); } catch (er) {} }
      if (E && E.name === "2038") { g.fillStyle = "rgba(0,0,0,.14)"; for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1); }
      if (S.joy) { g.strokeStyle = "rgba(255,255,255,.45)"; g.lineWidth = 1.4; g.beginPath(); g.arc(S.joy.ax, S.joy.ay, 20, 0, 7); g.stroke(); const dx = S.joy.x - S.joy.ax, dy = S.joy.y - S.joy.ay, d = Math.min(20, Math.hypot(dx, dy)), a = Math.atan2(dy, dx); circ(S.joy.ax + Math.cos(a) * d, S.joy.ay + Math.sin(a) * d, 7, "rgba(255,255,255,.5)"); }
      if (S.phase === "count") { g.textAlign = "center"; g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(0, 140, W, 70); g.fillStyle = E ? E.col : "#fff"; g.font = "bold 34px Georgia, serif"; g.fillText(E ? E.name : "", W / 2, 180); g.font = "bold 14px system-ui"; g.fillStyle = "#fff"; g.fillText(S.count > 100 ? "Pronti…" : S.count > 50 ? "…" : "VIA!", W / 2, 202); g.textAlign = "left"; }
      if (S.fx) { const f = S.fx; f.t++; if (f.t > f.max) S.fx = null; else { const k = Math.min(1, f.t / 8); g.save(); g.globalAlpha = Math.min(1, (f.max - f.t) / 14); g.textAlign = "center"; g.font = `900 ${Math.round(26 * (0.7 + 0.3 * k))}px Georgia, serif`; g.lineWidth = 4; g.strokeStyle = "rgba(0,0,0,.75)"; g.strokeText(f.text, W / 2, 168); g.fillStyle = f.col; g.fillText(f.text, W / 2, 168); g.restore(); } }
    }
    // ------------------------------------------------------------ ciclo
    let acc = 0, last = performance.now();
    function loop(now) {
      S.raf = requestAnimationFrame(loop); const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; acc += dt;
      while (acc >= 1 / 60) {
        acc -= 1 / 60; S.t++;
        for (let q = 0; q < (S.fast || 1); q++) { // S.fast: solo per i test (passi di gioco in più per ogni fotogramma)
          if (S.over || S.cardOn) break;
          if (S.phase === "count") { S.count--; if (S.count <= 0) S.phase = "play"; }
          else if (S.phase === "play") stepPlay();
          else if (S.phase === "goal") { S.goalPause--; if (S.goalPause <= 0) { kickoff(S.nextKick === 0 ? 1 : 0); hud(); if (S.golden) { endPeriod(); } } }
        }
      }
      draw(); if (S.t % 6 === 0) hud();
    }
    S.raf = requestAnimationFrame(loop);
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    const intro = `${o.intro || ""}<p>Una partita sola, in <b>${ERAS.length > 1 ? ERAS.length + " epoche" : "un'epoca"}</b>: ${ERAS.map((e) => `<b>${e}</b>`).join(", ")}. Ogni epoca è un tempo di ${SECS} secondi; il punteggio è uno solo.</p><p><b>Trascina il dito</b> sul campo per muoverti. <b>TIRA</b> in porta, <b>PASSA</b> al compagno. Fai passare il pallone sui <b>segni che brillano</b> (🌱 🪨 🔌 💧): nelle epoche dopo il campo cambia.</p><p><b>TEMPO</b> ferma gli avversari per due secondi e mezzo.${S.fischiMax ? " <b>FISCHIO</b> annulla l'ultimo gol subito." : ""}</p>${S.pre.size ? `<p class="tr">Tracce già lasciate: ${[...S.pre].map((id) => `${SEG[id].icon} ${SEG[id].name}`).join(" · ")}.</p>` : ""}<p style="opacity:.8;font-size:12px">Avversari: <b>${esc(opp.name)}</b> · difficoltà ${esc((cur && cur.diff) || "normale")}.</p>`;
    card(o.title || "Palla del Tempo", intro, "Si parte! ▸", () => { S.cardOn = false; beginPeriod(0); }, "#c8a040");
    hud();
    return true;
  }
  function css() {
    if (document.getElementById("ptCss")) return; const st = document.createElement("style"); st.id = "ptCss";
    st.textContent = `.ptOv{position:fixed;inset:0;z-index:300;background:#0c0a12;display:flex;flex-direction:column;align-items:center;gap:5px;padding:6px 8px 10px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#fff;overflow:auto}
.ptOv .hud{width:min(100%,420px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #c8a040;border-radius:12px;background:linear-gradient(#262034,#14101e);padding:3px 12px;font:800 12px system-ui}
.ptOv .hud .n0{color:var(--us);filter:brightness(1.5)}.ptOv .hud .n1{text-align:right;color:var(--opp);filter:brightness(1.4)}.ptOv .hud .sc{font:900 22px Georgia,serif;color:#ffd23f}
.ptOv .bar{width:min(100%,420px);display:flex;gap:8px;align-items:center;font:600 12px system-ui;min-height:30px}.ptOv .bar b{font:900 13px Georgia,serif;white-space:nowrap}.ptOv .bar i{font-style:normal;color:#ffd23f;font-family:'Courier New',monospace;font-weight:900;white-space:nowrap}.ptOv .tip{flex:1;opacity:.92;line-height:1.2}.ptOv .tip b{color:#ffd23f;font:inherit}
.ptOv canvas{width:min(100%,420px,calc((100dvh - 212px) * 2 / 3));height:auto;aspect-ratio:2/3;flex:none;border:2px solid #c8a040;border-radius:12px;touch-action:none;background:#000}
.ptOv .pad{width:min(100%,420px);display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:6px}.ptOv .pad .fis{grid-column:1/-1}
.ptOv .pad button{min-height:50px;border-radius:12px;border:2px solid #c8a040;background:#2a2238;color:#fff;font:900 14px system-ui;cursor:pointer}.ptOv .pad .shoot{background:linear-gradient(#e8a43a,#b86a1a)}.ptOv .pad .tmp{background:linear-gradient(#3a7ac8,#1a3a78)}.ptOv .pad .fis{min-height:40px;background:#6a5a1a}.ptOv button:disabled{opacity:.4}
.ptOv .help{width:min(100%,420px);font-size:10.5px;opacity:.6}
.ptOv .quit{position:absolute;right:8px;bottom:8px;min-height:30px;font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid #6a5a3a;background:#14101e;color:#cfc8b4;opacity:.8}
.ptOv .ov{position:absolute;inset:0;background:rgba(8,6,14,.94);display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto;z-index:2}
.ptOv .card{max-width:430px;width:100%;border:3px solid #c8a040;border-radius:16px;background:linear-gradient(#2a2238,#120e1c);color:#fff;padding:14px;box-shadow:0 0 30px rgba(200,160,64,.25)}.ptOv .card h3{margin:0 0 8px;font:900 22px Georgia,serif;color:#ffd23f}.ptOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.ptOv .card b{color:#ffd23f}.ptOv .card .big,.ptOv .card .sc2{font:900 34px Georgia,serif;color:#ffd23f}.ptOv .card .tr{font-size:13px;background:rgba(255,255,255,.07);border-radius:8px;padding:6px 8px}
.ptOv .card .goB{width:100%;margin-top:10px;background:linear-gradient(#e8a43a,#b86a1a);color:#fff;font:900 15px system-ui;min-height:50px;border:2px solid #c8a040;border-radius:12px}`;
    document.head.appendChild(st);
  }
  window.__pallatempo = { start, SEG, ERA, layout, get state() { return STATE; } };
})();
