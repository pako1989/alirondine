// js/corsa.js - «Gran Premio dei Sogni»: corsa a squadre con i personaggi della Squadra dei Sogni (js/sogni.js).
// Vista dall'alto, tre piste. Tu guidi un pilota (gas automatico: sterzi, usi Turbo e Abilità), gli altri due della tua squadra corrono da soli;
// i punti dei tre si sommano contro la squadra rivale (3 piloti) e due indipendenti. Il campionato dura tre gare.
// Corsia interna = percorso più corto, ma la curva spinge fuori: serve sterzare. Scia (stare dietro un rivale) = piccolo bonus.
(function () {
  "use strict";
  if (window.__corsa) return;
  const KEY = "ali-di-rondine.corsa", W = 380, H = 230, HW = 36, LAPS = 2, PTS = [10, 7, 5, 4, 3, 2, 1, 0], SC = 1.5;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const ABIL = { A: ["Scia di Fuoco", "scatto lungo", 30], C: ["Scorciatoia", "balzo in avanti", 40], D: ["Muro", "scudo e spinta ai vicini", 30], P: ["Chiazza d'olio", "trappola dietro di te", 25] };
  const TRACKS = [
    { id: "mare", n: "Lungomare del Borgo", ground: "#c9b27a", road: "#4a4f5c", edge: "#fff", deco: ["🌴", "🏖️", "⛱️", "🌊"], pts: [[0, 0], [260, -30], [520, 40], [640, 220], [520, 400], [250, 430], [60, 330], [-160, 400], [-340, 250], [-250, 40]] },
    { id: "neve", n: "Valico Innevato", ground: "#e8f0fa", road: "#6a7488", edge: "#e8603a", deco: ["🌲", "⛄", "🏔️", "❄️"], pts: [[0, 0], [300, 20], [450, -120], [650, -60], [700, 180], [500, 300], [280, 240], [200, 420], [-80, 430], [-240, 250], [-200, 60]] },
    { id: "neon", n: "Circuito Neon", ground: "#14102a", road: "#272342", edge: "#ff4fd8", deco: ["💡", "🌆", "🛸", "✨"], pts: [[0, 0], [220, 60], [440, -20], [600, 120], [560, 330], [320, 420], [120, 300], [-60, 420], [-300, 360], [-380, 160], [-200, -20]] },
  ];
  let OV = null, BACK = null, R = null, RAF = 0, PAUSE = false;
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { champ: r.champ | 0, wins: r.wins | 0, best: r.best || {} }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  const name = (id) => safe(() => S().name(id), id);
  const rlOf = (c) => { if (ABIL[c.role]) return c.role; const e = safe(() => S().eff(c), c); return { at: "A", te: "C", df: "D" }[e.at >= e.df && e.at >= e.te ? "at" : e.df >= e.te ? "df" : "te"]; };
  function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  // ------------------------------------------------------------ pista (spline chiusa campionata)
  function build(T) {
    if (T.cs) return T; const P = T.pts, n = P.length, S0 = [];
    const cr = (p0, p1, p2, p3, t) => [0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t * t + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t * t * t), 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t * t + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t * t * t)];
    for (let i = 0; i < n; i++) for (let k = 0; k < 24; k++) S0.push(cr(P[(i + n - 1) % n], P[i], P[(i + 1) % n], P[(i + 2) % n], k / 24));
    // ricampiona a passo costante
    let L = 0; const d = S0.map((p, i) => { const q = S0[(i + 1) % S0.length]; const l = Math.hypot(q[0] - p[0], q[1] - p[1]); L += l; return l; });
    const STEP = 6, N = Math.floor(L / STEP), cs = [];
    let acc = 0, j = 0; for (let i = 0; i < N; i++) { const target = i * STEP; while (acc + d[j] < target) { acc += d[j]; j = (j + 1) % S0.length; } const f = (target - acc) / d[j], a = S0[j], b = S0[(j + 1) % S0.length]; cs.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); }
    T.cs = cs; T.N = N; T.step = STEP; T.len = N * STEP; T.tan = []; T.k = [];
    for (let i = 0; i < N; i++) { const a = cs[(i + N - 2) % N], b = cs[(i + 2) % N], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); T.tan.push([dx / l, dy / l]); }
    for (let i = 0; i < N; i++) { const a = T.tan[(i + N - 3) % N], b = T.tan[(i + 3) % N]; let da = Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]); while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; T.k.push(da / (6 * STEP)); }
    // decorazioni fisse
    const rr = seeded(T.id.length * 977 + 3); T.decor = []; for (let i = 0; i < N; i += 7) { const sd = rr() < 0.5 ? -1 : 1, off = HW + 26 + rr() * 70, c = cs[i], t = T.tan[i]; T.decor.push([c[0] - t[1] * off * sd, c[1] + t[0] * off * sd, T.deco[Math.floor(rr() * T.deco.length)], 11 + rr() * 9]); }
    // bonus e chiazze d'olio fisse sul percorso (un po' variabili con il seme della gara)
    return T;
  }
  const at = (T, s) => { s = ((s % T.len) + T.len) % T.len; const f = s / T.step, i = Math.floor(f) % T.N, j = (i + 1) % T.N, u = f - Math.floor(f); return { c: [T.cs[i][0] + (T.cs[j][0] - T.cs[i][0]) * u, T.cs[i][1] + (T.cs[j][1] - T.cs[i][1]) * u], t: T.tan[i], k: T.k[i] }; };
  const pos = (T, s, lat) => { const a = at(T, s); return [a.c[0] - a.t[1] * lat * HW, a.c[1] + a.t[0] * lat * HW, Math.atan2(a.t[1], a.t[0]), a.k]; }; // lat > 0 = a destra
  // ------------------------------------------------------------ piloti
  function mk(card, team, idx, o) {
    o = o || {}; const e = safe(() => S().eff(card), card), m = 1 + (o.m || 0);
    return { id: card.id, n: name(card.id), role: ABIL[card.role] ? card.role : { at: "A", te: "C", df: "D" }[(e.at >= e.df && e.at >= e.te) ? "at" : e.df >= e.te ? "df" : "te"], team, idx, col: team === 0 ? "#3aa0ff" : team === 1 ? "#ff5a5a" : "#b0b0b0", s: -idx * 22 - (team === 1 ? 14 : 0), lat: ((idx % 3) - 1) * 0.55, v: 0, vmax: (1.55 + e.at / 260) * m, grip: 0.9 + e.te / 220, hold: 1 - e.df / 520, energy: o.energy != null ? o.energy : 40, boost: 0, cd: 0, shield: 0, stun: 0, laps: 0, fin: 0, finT: 0, ai: o.ai || 0, human: !!o.human, dash: 0, tlat: 0, w: 0, wall: 0, prog: 0 };
  }
  function begin(cfg) {
    const T = build(cfg.track), rnd = seeded(cfg.seed != null ? cfg.seed : (Date.now() & 0xfffff));
    R = { cfg, T, rnd, racers: cfg.racers, items: [], oils: [], t: -180, over: null, fin: [], inp: {}, edge: {}, fast: !!cfg.fast, fxs: [] };
    for (let s = 120; s < T.len - 40; s += 150 + Math.floor(rnd() * 110)) R.items.push({ s, lat: (rnd() * 2 - 1) * 0.8, k: rnd() < 0.72 ? "e" : "b", on: 1 }); // e = ⚡ energia, b = piastra turbo
    R.me = R.racers.find((r) => r.human);
    return R;
  }
  const place = () => R.racers.slice().sort((a, b) => (a.fin && b.fin ? a.finT - b.finT : a.fin ? -1 : b.fin ? 1 : b.prog - a.prog));
  function useAbil(r) {
    const A = ABIL[r.role]; if (r.cd > 0 || r.energy < A[2] || r.stun > 0) return; r.energy -= A[2]; r.cd = 150; fx(r, A[0]);
    if (r.role === "A") r.boost = Math.max(r.boost, 70); else if (r.role === "C") r.dash = 14; else if (r.role === "D") { r.shield = 240; R.racers.forEach((o) => { if (o !== r && Math.abs(o.prog - r.prog) < 70 && Math.abs(o.lat - r.lat) < 0.8) { o.stun = Math.max(o.stun, 25); o.v *= 0.6; } }); } else R.oils.push({ s: r.prog - 26, lat: r.lat, own: r, l: 900 });
  }
  function turbo(r) { if (r.energy < 25 || r.stun > 0) return; r.energy -= 25; r.boost = Math.max(r.boost, 55); fx(r, "TURBO"); }
  function fx(r, t) { if (!R.fast) R.fxs.push({ r, t, l: 40 }); }
  function aiIn(r) {
    const T = R.T, lvl = r.ai, a = at(T, r.prog + 70 + r.v * 20), inner = a.k > 0.0006 ? 0.75 : a.k < -0.0006 ? -0.75 : 0; // k>0: curva a destra? (vedi pos) -> corsia interna
    let want = inner * (0.5 + lvl * 0.08);
    for (const it of R.items) if (it.on && it.s - r.prog > 20 && it.s - r.prog < 140) { want = it.lat; break; }
    for (const o of R.oils) if (o.own !== r && o.s - r.prog > 5 && o.s - r.prog < 90 && Math.abs(o.lat - r.lat) < 0.35) want = o.lat > 0 ? -0.8 : 0.8;
    r.tlat = want; const d = want - r.lat, inp = {}; if (d > 0.06) inp.r = 1; else if (d < -0.06) inp.l = 1;
    if (r.energy >= 55 && r.boost <= 0 && R.rnd() < 0.02 * lvl) inp.t = 1;
    if (r.energy >= ABIL[r.role][2] + 10 && r.cd <= 0 && R.rnd() < 0.012 * lvl) inp.a = 1; return inp;
  }
  function stepR(r, inp) {
    const T = R.T; if (r.fin) { r.v *= 0.97; r.prog += r.v; return; }
    if (r.stun > 0) r.stun--; if (r.cd > 0) r.cd--; if (r.shield > 0) r.shield--; if (r.boost > 0) r.boost--;
    if (inp.t) turbo(r); if (inp.a) useAbil(r);
    const a = at(T, r.prog), steer = ((inp.r ? 1 : 0) - (inp.l ? 1 : 0)) * 0.034 * r.grip * (r.stun > 0 ? 0.3 : 1);
    // la curva spinge verso l'esterno (k>0 = si gira verso destra: la forza va a sinistra)
    r.w = r.w * 0.82 + (-a.k * r.v * r.v * 1.9) * (r.hold) ;
    r.lat += steer + r.w * 0.1; if (r.lat > 1 || r.lat < -1) { r.lat = Math.max(-1, Math.min(1, r.lat)); r.v *= 0.93; r.wall = 8; } else if (r.wall > 0) r.wall--;
    // velocità
    let vt = r.vmax * (r.boost > 0 ? 1.55 : 1) * (r.stun > 0 ? 0.45 : 1); if (r.dash > 0) { vt = r.vmax * 3; r.dash--; }
    for (const o of R.racers) if (o !== r && o.prog > r.prog && o.prog - r.prog < 46 && Math.abs(o.lat - r.lat) < 0.35 && !o.fin) { vt *= 1.07; break; } // scia
    r.v += (vt - r.v) * 0.045; if (r.energy < 100) r.energy = Math.min(100, r.energy + 0.025);
    r.prog += r.v / Math.max(0.55, 1 - a.k * r.lat * HW);
    // oggetti e chiazze
    const sd = (x) => ((x - r.prog) % T.len + T.len * 1.5) % T.len - T.len / 2; // distanza con segno lungo il giro
    for (const it of R.items) { if (!it.on) continue; if (Math.abs(sd(it.s)) < 9 && Math.abs(it.lat - r.lat) < 0.35) { if (it.k === "e") r.energy = Math.min(100, r.energy + 30); else r.boost = Math.max(r.boost, 40); it.on = 0; it.t = 420; fx(r, it.k === "e" ? "+⚡" : "TURBO!"); } }
    R.oils = R.oils.filter((o) => { if (o.own !== r && Math.abs(sd(o.s)) < 8 && Math.abs(o.lat - r.lat) < 0.32 && r.stun <= 0) { if (r.shield > 0) { r.shield = 0; fx(r, "SCUDO!"); } else { r.stun = 55; r.v *= 0.5; fx(r, "OLIO!"); } o.l = 0; } return o.l > 0; });
    if (r.prog >= T.len * LAPS && !r.fin) { r.fin = 1; r.finT = R.t; R.fin.push(r); }
    r.laps = Math.min(LAPS, Math.floor(r.prog / T.len));
  }
  function collide() {
    const T = R.T; for (let i = 0; i < R.racers.length; i++) for (let j = i + 1; j < R.racers.length; j++) { const a = R.racers[i], b = R.racers[j]; if (a.fin || b.fin) continue; const ds = a.prog - b.prog; if (Math.abs(ds) < 13 && Math.abs(a.lat - b.lat) < 0.3) { const f = ds > 0 ? [a, b] : [b, a]; /* f[0] davanti */ if (f[1].shield > 0) { f[0].v *= 0.9; } else { f[1].v *= 0.9; f[1].lat += (f[1].lat >= f[0].lat ? 1 : -1) * 0.06; f[0].lat += (f[0].lat >= f[1].lat ? 1 : -1) * 0.06; } } }
  }
  function tick() {
    if (!R || R.over) return; R.t++; R.fxs = R.fxs.filter((x) => --x.l > 0);
    if (R.t < 0) return; const e = R.edge; R.edge = {};
    R.racers.forEach((r) => stepR(r, r.human ? Object.assign({}, R.inp, e) : aiIn(r)));
    R.items.forEach((it) => { if (!it.on && --it.t <= 0) it.on = 1; }); R.oils.forEach((o) => o.l--);
    collide();
    if (R.me.fin && !R.over) { R.after = (R.after || 0) + 1; if (R.after > (R.fast ? 1 : 420) || R.racers.every((r) => r.fin)) finish(); }
  }
  function finish() {
    if (R.over) return; const order = place(); R.order = order; const pts = {}; order.forEach((r, i) => { pts[r.team] = (pts[r.team] || 0) + (PTS[i] || 0); });
    R.pts = pts; R.over = true; R.myPos = order.indexOf(R.me) + 1; const f = R.cfg.onEnd; setTimeout(() => f && f(R), R.fast ? 0 : 600);
  }
  // ------------------------------------------------------------ disegno
  function draw(g) {
    const T = R.T, me = R.me, p = pos(T, me.prog, me.lat), cx = p[0], cy = p[1];
    g.fillStyle = T.ground; g.fillRect(0, 0, W, H); g.save(); g.translate(W / 2, H / 2); g.scale(SC, SC); g.translate(-cx, -cy);
    const vx = W / 2 / SC + 60, vy = H / 2 / SC + 60;
    // asfalto: tratti vicini al pilota
    const i0 = Math.floor(((me.prog % T.len) + T.len) % T.len / T.step), span = Math.ceil(Math.max(vx, vy) / T.step) + 4;
    const vis = (i) => { const c = T.cs[((i % T.N) + T.N) % T.N]; return Math.abs(c[0] - cx) < vx + 40 && Math.abs(c[1] - cy) < vy + 40; };
    g.lineCap = "round"; g.lineJoin = "round";
    [["#000", HW * 2 + 10], [T.edge, HW * 2 + 6], [T.road, HW * 2]].forEach(([col, w], k) => { g.strokeStyle = col; g.lineWidth = w; g.globalAlpha = k === 0 ? 0.35 : 1; g.beginPath(); let on = false; for (let d = -span; d <= span * 1.6; d++) { const c = T.cs[(((i0 + d) % T.N) + T.N) % T.N]; if (!on) { g.moveTo(c[0], c[1]); on = true; } else g.lineTo(c[0], c[1]); } g.stroke(); }); g.globalAlpha = 1;
    // tratteggio centrale e traguardo
    g.strokeStyle = "#ffffff55"; g.lineWidth = 2; g.setLineDash([10, 14]); g.beginPath(); { let on = false; for (let d = -span; d <= span * 1.6; d++) { const c = T.cs[(((i0 + d) % T.N) + T.N) % T.N]; if (!on) { g.moveTo(c[0], c[1]); on = true; } else g.lineTo(c[0], c[1]); } } g.stroke(); g.setLineDash([]);
    { const a = at(T, 0), nx = -a.t[1], ny = a.t[0]; for (let k = -4; k < 4; k++) { g.fillStyle = (k & 1) ? "#fff" : "#111"; g.fillRect(a.c[0] + nx * (k * 9) - 4, a.c[1] + ny * (k * 9) - 4, 8, 8); } }
    g.font = "16px serif"; g.textAlign = "center"; T.decor.forEach((d) => { if (Math.abs(d[0] - cx) < vx + 20 && Math.abs(d[1] - cy) < vy + 20) { g.font = d[3] + "px serif"; g.fillText(d[2], d[0], d[1]); } });
    R.items.forEach((it) => { if (!it.on) return; const q = pos(T, it.s, it.lat); if (Math.abs(q[0] - cx) > vx || Math.abs(q[1] - cy) > vy) return; g.font = "14px serif"; g.fillText(it.k === "e" ? "⚡" : "🔶", q[0], q[1] + 5); });
    R.oils.forEach((o) => { const q = pos(T, o.s, o.lat); g.fillStyle = "#000b"; g.beginPath(); g.ellipse(q[0], q[1], 10, 7, q[2], 0, 7); g.fill(); });
    R.racers.slice().sort((a, b) => a.prog - b.prog).forEach((r) => kart(g, r, T));
    g.restore();
    g.fillStyle = "#000a"; g.fillRect(0, 0, W, 26); g.fillStyle = "#fff"; g.font = "bold 12px system-ui"; g.textAlign = "left"; const ord = place(), pl = ord.indexOf(me) + 1;
    g.fillText(`${pl}° / ${R.racers.length}`, 8, 17); g.textAlign = "center"; g.fillText(`Giro ${Math.min(LAPS, me.laps + 1)}/${LAPS}`, W / 2, 17); g.textAlign = "right"; g.fillText(T.n, W - 8, 17);
    // barre energia e abilità
    g.fillStyle = "#000a"; g.fillRect(8, H - 20, 110, 11); g.fillStyle = me.energy >= 25 ? "#ffd23f" : "#8a7a30"; g.fillRect(9, H - 19, 108 * me.energy / 100, 9); g.fillStyle = "#fff"; g.font = "bold 9px system-ui"; g.textAlign = "left"; g.fillText("⚡ ENERGIA", 12, H - 11);
    g.textAlign = "right"; g.fillStyle = me.cd <= 0 && me.energy >= ABIL[me.role][2] ? "#7ad87a" : "#aaa"; g.fillText(`${ABIL[me.role][0]} (${ABIL[me.role][2]})`, W - 8, H - 11);
    R.fxs.forEach((x) => { if (x.r !== me) return; g.globalAlpha = x.l / 40; g.fillStyle = "#ffd23f"; g.font = "bold 16px system-ui"; g.textAlign = "center"; g.fillText(x.t, W / 2, H / 2 - 40 - (40 - x.l)); g.globalAlpha = 1; });
    if (R.t < 0) { g.fillStyle = "#0008"; g.fillRect(0, 80, W, 60); g.fillStyle = "#ffd23f"; g.font = "900 38px system-ui"; g.textAlign = "center"; g.fillText(Math.ceil(-R.t / 60), W / 2, 124); } else if (R.t < 50) { g.fillStyle = "#ffd23f"; g.font = "900 30px system-ui"; g.textAlign = "center"; g.fillText("VIA!", W / 2, 124); }
    if (me.fin && !R.over) { g.fillStyle = "#0008"; g.fillRect(0, 90, W, 44); g.fillStyle = "#fff"; g.font = "900 22px system-ui"; g.textAlign = "center"; g.fillText(`Traguardo! ${pl}° posto`, W / 2, 120); }
  }
  const IMG = {}; const imgOf = (id) => { if (IMG[id] !== undefined) return IMG[id]; const u = safe(() => S().port(id), null); if (!u) return (IMG[id] = null); const i = new Image(); i.src = u; return (IMG[id] = i); };
  function kart(g, r, T) {
    const q = pos(T, r.prog, r.lat); g.save(); g.translate(q[0], q[1]); g.rotate(q[2] + (r.stun > 0 ? Math.sin(R.t * 0.6) * 0.6 : 0));
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(2, 3, 13, 8, 0, 0, 7); g.fill();
    g.fillStyle = r.col; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(-12, -7, 24, 14, 4); g.fill(); g.stroke();
    if (r.boost > 0) { g.fillStyle = "#ffb347"; g.beginPath(); g.moveTo(-12, -4); g.lineTo(-24 - Math.random() * 6, 0); g.lineTo(-12, 4); g.fill(); }
    g.rotate(-q[2]); const im = imgOf(r.id); g.beginPath(); g.arc(1, -1, 8, 0, 7); g.save(); g.clip(); if (im && im.complete && im.naturalWidth) g.drawImage(im, -8, -9, 18, 18); else { g.fillStyle = "#e8c8a0"; g.fillRect(-8, -9, 18, 18); } g.restore();
    g.strokeStyle = r.human ? "#ffd23f" : r.col; g.lineWidth = r.human ? 2.5 : 1.5; g.beginPath(); g.arc(1, -1, 8, 0, 7); g.stroke();
    if (r.shield > 0) { g.strokeStyle = "#9ad8ff"; g.lineWidth = 1.5; g.beginPath(); g.arc(1, -1, 14, 0, 7); g.stroke(); }
    if (r.human) { g.fillStyle = "#ffd23f"; g.font = "bold 8px system-ui"; g.textAlign = "center"; g.fillText("TU", 1, -14); }
    g.restore();
  }
  // ------------------------------------------------------------ interfaccia
  function css() {
    if (document.getElementById("crCss")) return; const st = document.createElement("style"); st.id = "crCss";
    st.textContent = `.crOv{position:fixed;inset:0;z-index:314;background:#0c0818;color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto;touch-action:manipulation}.crOv .wrap{max-width:560px;margin:0 auto;padding:8px 8px 20px}
.crOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#0c0818;padding:5px 0;z-index:3}.crOv h2{margin:0;font:900 19px system-ui;color:#ffd23f}.crOv .x{width:40px;height:40px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#fff;font-size:17px}
.crOv .sum{font-size:13px;line-height:1.45;opacity:.9}.crOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}
.crOv .one{width:100%;min-height:54px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px;margin:5px 0}.crOv .one small{display:block;font-weight:400;font-size:11px;opacity:.75}.crOv button:disabled{opacity:.4}
.crOv canvas{display:block;width:100%;max-width:520px;margin:0 auto;height:auto;border-radius:10px;background:#000}
.crCtl{display:flex;justify-content:space-between;gap:10px;margin-top:8px;touch-action:none;user-select:none;-webkit-user-select:none}.crCtl button{border-radius:14px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 15px system-ui;padding:4px;touch-action:none;min-height:64px}.crCtl .st{display:grid;grid-template-columns:64px 64px;gap:6px}.crCtl .ac{display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:1}.crCtl button.on,.crCtl button:active{background:#5a3aa8}.crCtl .tb{background:#7a5a10;color:#ffe9a8}.crCtl .ab{background:#2a4a7a}.crCtl small{display:block;font-weight:400;font-size:9px;opacity:.8}
.crTab{width:100%;border-collapse:collapse;font-size:13px;margin:6px 0}.crTab td{padding:5px 4px;border-top:1px solid #2a2040}.crTab tr.me td{color:#ffd23f;font-weight:800}.crRes{text-align:center;margin:10px 0}.crRes h3{font:900 24px system-ui;margin:4px 0}`;
    document.head.appendChild(st);
  }
  function shell(title) { css(); halt(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "crOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const live = R && !R.over; halt(); if (live) return menu(); const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function halt() { cancelAnimationFrame(RAF); RAF = 0; window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); }
  function close() { halt(); R = null; if (OV) { OV.remove(); OV = null; } }
  const KM = { ArrowLeft: "l", ArrowRight: "r", a: "l", d: "r", " ": "t", j: "t", k: "a", l: "a" };
  const kd = (e) => { const k = KM[e.key]; if (!k || !R) return; e.preventDefault(); if (k === "t" || k === "a") R.edge[k] = 1; else R.inp[k] = 1; };
  const ku = (e) => { const k = KM[e.key]; if (k && R && k !== "t" && k !== "a") R.inp[k] = 0; };
  function press(k, on) { if (!R) return; if (k === "t" || k === "a") { if (on) R.edge[k] = 1; } else R.inp[k] = on ? 1 : 0; }
  function raceUI(cfg) {
    const body = shell(cfg.title || "🏁 Gran Premio dei Sogni"); begin(cfg); const me = R.me;
    body.innerHTML = `<canvas width="${W}" height="${H}"></canvas><div class="crCtl"><div class="st"><button data-k="l">◀</button><button data-k="r">▶</button></div><div class="ac"><button data-k="t" class="tb">⚡ Turbo<small>25 energia</small></button><button data-k="a" class="ab">✦ ${esc(ABIL[me.role][0])}<small>${esc(ABIL[me.role][1])}</small></button></div></div><p class="sum" style="font-size:11px;opacity:.65;margin-top:6px">Il gas è automatico. Sterza ◀ ▶: dentro la curva si risparmia strada, ma la curva ti spinge fuori. ⚡ e 🔶 sulla pista ricaricano l'energia o danno turbo. Stare dietro un rivale dà scia. Tasti: frecce, spazio turbo, K abilità.</p>`;
    const cv = body.querySelector("canvas"), g = cv.getContext("2d");
    body.querySelectorAll("[data-k]").forEach((b) => { const k = b.dataset.k, up = () => { press(k, false); b.classList.remove("on"); }; b.addEventListener("pointerdown", (e) => { e.preventDefault(); press(k, true); b.classList.add("on"); }); b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("pointerleave", up); });
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    let last = performance.now(), acc = 0; const loop = (t) => { if (!OV || !R) return; acc += Math.min(100, t - last); last = t; while (acc >= 16.67) { if (!PAUSE) tick(); acc -= 16.67; } draw(g); if (R && !R.over) RAF = requestAnimationFrame(loop); }; RAF = requestAnimationFrame(loop);
    R.draw = () => draw(g);
  }
  // ------------------------------------------------------------ menu e campionato
  const mine = () => safe(() => S()._load().own.map((id) => S().BY[id]).filter(Boolean), []);
  const strength = (c) => c.at + c.df + c.te;
  function myTeam() {
    const r = safe(() => S()._load(), { own: [], team: [] }), own = mine().slice().sort((a, b) => strength(b) - strength(a)), pick = [];
    r.team.forEach((id) => { const c = S().BY[id]; if (c && pick.length < 3) pick.push(c); }); own.forEach((c) => { if (pick.length < 3 && !pick.includes(c)) pick.push(c); });
    const pool = S().CARDS.slice().sort((a, b) => strength(a) - strength(b)); while (pick.length < 3) pick.push(pool[pick.length * 7 % pool.length]);
    return pick.slice(0, 3);
  }
  function rivals(rand, lvl, theme) {
    const all = S().CARDS, pool = all.filter((c) => c.saga === theme), p = pool.length >= 3 ? pool : all, out = [], used = {};
    for (let i = 0; i < 5; i++) { const src = i < 3 ? p : all; let c; for (let k = 0; k < 20; k++) { c = src[Math.floor(rand() * src.length)]; if (!used[c.id]) break; } used[c.id] = 1; out.push(c); }
    return out;
  }
  function menu(back) {
    if (back) BACK = back; const body = shell("🏁 Gran Premio dei Sogni"), r = load(), team = myTeam();
    body.innerHTML = `<p class="sum">Corsa a squadre con i personaggi delle saghe: <b>guidi uno dei tuoi tre piloti</b>, gli altri due corrono da soli e i punti di tutti e tre si sommano contro la squadra rivale. Scia, turbo, abilità di ruolo e chiazze d'olio.</p><div class="sec">La tua squadra (dalla Squadra dei Sogni)</div><p class="sum">${team.map((c) => `<b>${esc(name(c.id))}</b> (${esc(ABIL[rlOf(c)][0])})`).join(" · ")}</p><div class="sec">Modalità</div><button type="button" class="one" data-go="champ">🏆 Campionato dei Sogni<small>3 gare su 3 piste · ${r.champ ? "vinto " + r.champ + " volte" : "mai vinto"} · premi in monete</small></button>${TRACKS.map((t, i) => `<button type="button" class="one" data-t="${i}">🏁 ${esc(t.n)}<small>gara singola · 2 giri${r.best[t.id] ? " · record posto " + r.best[t.id] : ""}</small></button>`).join("")}`;
    body.querySelector('[data-go="champ"]').onclick = () => champ(0, 0, { t: 0 });
    body.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => race(+b.dataset.t, 2, null)));
  }
  function setup(ti, lvl, seed) {
    const T = TRACKS[ti], rand = seeded(seed != null ? seed : (Date.now() & 0xffff)), me = myTeam(), ss = [...new Set(S().CARDS.map((c) => c.saga))], th = ss[Math.floor(rand() * ss.length)], rv = rivals(rand, lvl, th);
    const rac = [];
    me.forEach((c, i) => rac.push(mk(c, 0, i, { human: i === 0, m: 0.02, ai: 3 })));
    rv.forEach((c, i) => rac.push(mk(c, i < 3 ? 1 : 2, i, { ai: lvl, m: (lvl - 3) * 0.035 })));
    return { track: T, racers: rac, seed: Math.floor(rand() * 1e6) };
  }
  function race(ti, lvl, st) {
    const cfg = setup(ti, lvl); cfg.title = st ? `🏆 Campionato · gara ${st.n + 1}/3` : "🏁 " + TRACKS[ti].n; cfg.onEnd = (G) => results(G, ti, lvl, st); raceUI(cfg);
  }
  function champ(n, tot, st) { race(n, 1 + n, { n, tot: st.tot || tot || 0, pts: st.pts || 0 }); }
  function results(G, ti, lvl, st) {
    const body = shell("🏁 Risultati"), order = G.order, tp = G.pts[0] || 0, rp = G.pts[1] || 0, win = tp > rp, a = load(), L = [];
    const nm = ["Tua squadra", "Squadra rivale", "Indipendenti"];
    body.innerHTML = `<div class="crRes"><h3>${G.myPos}° posto</h3><p class="sum">Squadra: <b>${tp}</b> punti contro <b>${rp}</b> dei rivali ${win ? "· 🏅 gara di squadra vinta" : ""}</p></div><table class="crTab">${order.map((r, i) => `<tr class="${r.human ? "me" : ""}"><td>${i + 1}°</td><td>${esc(r.n)}</td><td style="color:${r.col}">${nm[r.team]}</td><td>${PTS[i] || 0} pt</td></tr>`).join("")}</table>`;
    const coins = Math.max(0, 14 - G.myPos * 2) + (win ? 12 : 0); safe(() => window.addCoins(coins), 0); L.push(`+${coins} monete.`);
    const T = TRACKS[ti]; if (!a.best[T.id] || G.myPos < a.best[T.id]) a.best[T.id] = G.myPos;
    let html = L.map((l) => `<p class="sum" style="text-align:center">${l}</p>`).join("");
    if (st) {
      const tot = (st.tot || 0) + tp, rtot = (st.rt || 0) + rp, n = st.n + 1;
      if (n >= 3) { const cw = tot > rtot; if (cw) { a.champ++; safe(() => window.addCoins(100), 0); } save(a); html += `<p class="sum" style="text-align:center"><b>Campionato: ${tot} punti contro ${rtot}.</b><br>${cw ? "🏆 Campionato dei Sogni vinto! +100 monete." : "Rivali campioni. Riprova!"}</p><button type="button" class="one" data-go="again">↺ Nuovo campionato</button>`; }
      else { save(a); html += `<p class="sum" style="text-align:center">Classifica squadre: <b>${tot}</b> contro <b>${rtot}</b>.</p><button type="button" class="one" data-go="next">▶ Prossima gara<small>${TRACKS[n].n}</small></button>`; }
      body.insertAdjacentHTML("beforeend", html + `<button type="button" class="one" data-go="menu">◂ Menu</button>`);
      const q = (s) => body.querySelector(s); const nx = q('[data-go="next"]'); if (nx) nx.onclick = () => race(n, 1 + n, { n, tot, rt: rtot }); const ag = q('[data-go="again"]'); if (ag) ag.onclick = () => race(0, 1, { n: 0, tot: 0, rt: 0 }); q('[data-go="menu"]').onclick = () => menu();
    } else { save(a); body.insertAdjacentHTML("beforeend", html + `<button type="button" class="one" data-go="again">↺ Rivincita</button><button type="button" class="one" data-go="menu">◂ Menu</button>`); body.querySelector('[data-go="again"]').onclick = () => race(ti, lvl, null); body.querySelector('[data-go="menu"]').onclick = () => menu(); }
    if (safe(() => window.__arena, null)) safe(() => { const ar = window.__arena.load(), id = G.me.id; ar.xp[id] = Math.min(60, (ar.xp[id] | 0) + 1); window.__arena.save(ar); }, 0);
  }
  window.__corsa = { open: menu, close, state: () => R, tick, press, begin, setup, build, TRACKS, ABIL, pos, at, _fast: (v) => { if (R) R.fast = !!v; }, pause: (v) => { PAUSE = !!v; }, race, load, save, mk };
})();
