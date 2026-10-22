// js/corsa.js - «Gran Premio dei Sogni»: corsa a squadre con i personaggi della Squadra dei Sogni (js/sogni.js).
// Due visuali: da dietro (pseudo-3D, joystick analogico) o dall'alto (la vecchia). Tre piste. Tu guidi un pilota (gas automatico: sterzi, usi Turbo e Abilità), gli altri due della tua squadra corrono da soli;
// i punti dei tre si sommano contro la squadra rivale (3 piloti) e due indipendenti. Il campionato dura tre gare.
// Corsia interna = percorso più corto, ma la curva spinge fuori: serve sterzare. Scia (stare dietro un rivale) = piccolo bonus.
(function () {
  "use strict";
  if (window.__corsa) return;
  const KEY = "ali-di-rondine.corsa", W = 380, H = 230, HW = 36, LAPS = 2, PTS = [10, 7, 5, 4, 3, 2, 1, 0], SC = 1.5, SS = 2, HY = 88, DZ = 5, NSEG = 110;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const ABIL = { A: ["Scia di Fuoco", "scatto lungo", 30], C: ["Scorciatoia", "balzo in avanti", 40], D: ["Muro", "scudo e spinta ai vicini", 30], P: ["Chiazza d'olio", "trappola dietro di te", 25] };
  const TRACKS = [
    { id: "mare", n: "Lungomare del Borgo", ground: "#c9b27a", road: "#4a4f5c", edge: "#fff", deco: ["🌴", "🏖️", "⛱️", "🌊"], sky: ["#4aa8f0", "#e8f6ff"], hill: ["#7ab8c8", "#4a9a6a"], grass: ["#c9b27a", "#bda56c"], pts: [[0, 0], [260, -30], [520, 40], [640, 220], [520, 400], [250, 430], [60, 330], [-160, 400], [-340, 250], [-250, 40]] },
    { id: "neve", n: "Valico Innevato", ground: "#e8f0fa", road: "#6a7488", edge: "#e8603a", deco: ["🌲", "⛄", "🏔️", "❄️"], sky: ["#8aa0c8", "#eef4fc"], hill: ["#b8c8e0", "#8aa0c0"], grass: ["#e8f0fa", "#d8e4f2"], pts: [[0, 0], [300, 20], [450, -120], [650, -60], [700, 180], [500, 300], [280, 240], [200, 420], [-80, 430], [-240, 250], [-200, 60]] },
    { id: "neon", n: "Circuito Neon", ground: "#14102a", road: "#272342", edge: "#ff4fd8", deco: ["💡", "🌆", "🛸", "✨"], sky: ["#06021a", "#4a0a6a"], hill: ["#1a1040", "#2a1460"], grass: ["#14102a", "#1a1436"], neon: 1, pts: [[0, 0], [220, 60], [440, -20], [600, 120], [560, 330], [320, 420], [120, 300], [-60, 420], [-300, 360], [-380, 160], [-200, -20]] },
  ];
  const THEME = { mare: { bump: "🦀", patch: "rgba(216,190,120,.9)" }, neve: { bump: "⛄", patch: "rgba(190,230,255,.9)", ice: 1 }, neon: { bump: "🚧", patch: "rgba(255,79,216,.55)" } };
  const ZON = [{ f: 0.17, len: 150, side: 1, gated: 0 }, { f: 0.55, len: 170, side: -1, gated: 1 }];
  const ITEMN = { fire: "Missile di Fuoco", thunder: "Fulmine", curve: "Presa perfetta", zig: "Zig-zag", spiral: "Tornado", vanish: "Fantasma", ice: "Gelata", change: "Scambio", drill: "Trivella" };
  const ITEMD = { fire: "colpisce chi hai davanti", thunder: "frena tutti i rivali davanti", curve: "curve senza sbandare + turbo", zig: "turbo e niente ostacoli", spiral: "lascia un tornado dietro", vanish: "attraversi tutto per un po'", ice: "congela chi hai davanti", change: "scambi posto con chi hai davanti", drill: "scudo + turbo" };
  const ITEMI = { fire: "🔥", thunder: "⚡", curve: "🎯", zig: "〰️", spiral: "🌪️", vanish: "👻", ice: "🧊", change: "🔄", drill: "🔩" };
  const MODES = { classic: ["🏁 Classica", "8 piloti, squadre, punti: la gara di sempre"], time: ["⏱️ Giro lanciato", "da solo contro il cronometro: batti il tuo record"], duel: ["⚔️ Testa a testa", "tu contro un solo rivale forte: chi arriva prima vince"], caos: ["🎲 Caos", "scatole 🎁 ovunque e si ricaricano subito: vince chi usa meglio gli oggetti"] };
  const KARTS = {
    classic: {
      id: "classic",
      name: "🏎️ Rondine Standard",
      icon: "🏎️",
      tag: "Equilibrato",
      perk: "Scia Pro: +60% velocità in scia e ricarica continua di energia",
      desc: "Assetto ufficiale da competizione: velocità, tenuta e scatto bilanciati",
      vm: 1.0, grip: 1.0, hold: 1.0, acc: 1.0, eRate: 1.0, initShield: 0,
      stats: { vel: "3/5", acc: "3/5", man: "3/5", res: "3/5" }
    },
    speed: {
      id: "speed",
      name: "⚡ Saetta Rossa",
      icon: "⚡",
      tag: "Velocità Pura",
      perk: "Overdrive: velocità max +18%, turbo dura 72f con scia di fuoco",
      desc: "Bolide aerodinamico a cuneo da Formula: velocità di punta insuperabile",
      vm: 1.18, grip: 0.85, hold: 0.88, acc: 0.95, eRate: 1.0, initShield: 0,
      stats: { vel: "5/5", acc: "3/5", man: "2/5", res: "2/5" }
    },
    light: {
      id: "light",
      name: "🪶 Piuma Scattante",
      icon: "🪶",
      tag: "Agilità & Curve",
      perk: "Grip Magnetico: ricarica energia +45%, curve millimetriche e presa sul fango",
      desc: "Pod ultraleggero a turbina: accelerazione fulminea e traiettorie perfette",
      vm: 0.94, grip: 1.30, hold: 1.25, acc: 1.35, eRate: 1.45, initShield: 0,
      stats: { vel: "2/5", acc: "5/5", man: "5/5", res: "1/5" }
    },
    heavy: {
      id: "heavy",
      name: "🛡️ Titano Corazzato",
      icon: "🛡️",
      tag: "Corazza Pesante",
      perk: "Ariete da Corsa: scudo iniziale da 240f, sperona e spinge via gli avversari",
      desc: "Mezzo corazzato con ruote giganti tassellate, rollbar e piastre d'acciaio",
      vm: 1.04, grip: 1.05, hold: 1.25, acc: 0.88, eRate: 1.0, initShield: 240,
      stats: { vel: "4/5", acc: "2/5", man: "3/5", res: "5/5" }
    }
  };
  let OV = null, BACK = null, R = null, RAF = 0, PAUSE = false;
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { champ: r.champ | 0, wins: r.wins | 0, best: r.best || {}, view: r.view === "top" ? "top" : "rear", fun: r.fun !== false, mode: MODES[r.mode] ? r.mode : "classic", kart: KARTS[r.kart] ? r.kart : "classic", rec: r.rec || {} }; };
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
    const rr = seeded(T.id.length * 977 + 3); T.decor = []; for (let i = 0; i < N; i += 7) { const sd = rr() < 0.5 ? -1 : 1, off = HW + 26 + rr() * 70, c = cs[i], t = T.tan[i]; T.decor.push([c[0] - t[1] * off * sd, c[1] + t[0] * off * sd, T.deco[Math.floor(rr() * T.deco.length)], 11 + rr() * 9, i * STEP, (sd * off) / HW]); }
    { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; cs.forEach((c) => { x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]); y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]); }); T.bb = [x0, y0, x1, y1]; }
    // bonus e chiazze d'olio fisse sul percorso (un po' variabili con il seme della gara)
    return T;
  }
  const at = (T, s) => { s = ((s % T.len) + T.len) % T.len; const f = s / T.step, i = Math.floor(f) % T.N, j = (i + 1) % T.N, u = f - Math.floor(f); return { c: [T.cs[i][0] + (T.cs[j][0] - T.cs[i][0]) * u, T.cs[i][1] + (T.cs[j][1] - T.cs[i][1]) * u], t: T.tan[i], k: T.k[i] }; };
  const pos = (T, s, lat) => { const a = at(T, s); return [a.c[0] - a.t[1] * lat * HW, a.c[1] + a.t[0] * lat * HW, Math.atan2(a.t[1], a.t[0]), a.k]; }; // lat > 0 = a destra
  // ------------------------------------------------------------ piloti
  function mk(card, team, idx, o) {
    o = o || {}; const e = safe(() => S().eff(card), card), m = 1 + (o.m || 0);
    const roleKart = (card.role === "A" ? "speed" : card.role === "C" ? "light" : card.role === "D" ? "heavy" : (idx % 3 === 1 ? "speed" : idx % 3 === 2 ? "light" : "classic"));
    const kartId = o.human ? (o.kart || load().kart) : (o.kart || roleKart);
    const kData = KARTS[kartId] || KARTS.classic;
    const vmax = (1.55 + e.at / 260) * m * (o.human ? kData.vm : (0.97 + (kData.vm - 1) * 0.45));
    const grip = (0.9 + e.te / 220) * (o.human ? kData.grip : 1);
    const hold = (1 - e.df / 520) * (o.human ? kData.hold : 1);
    const shield = o.human ? kData.initShield : (kData.id === "heavy" ? 140 : 0);
    return { id: card.id, n: name(card.id), role: ABIL[card.role] ? card.role : { at: "A", te: "C", df: "D" }[(e.at >= e.df && e.at >= e.te) ? "at" : e.df >= e.te ? "df" : "te"], team, idx, col: team === 0 ? "#3aa0ff" : team === 1 ? "#ff5a5a" : "#b0b0b0", s: -idx * 22 - (team === 1 ? 14 : 0), lat: ((idx % 3) - 1) * 0.55, v: 0, vmax, grip, hold, energy: o.energy != null ? o.energy : 40, boost: 0, cd: 0, shield, stun: 0, laps: 0, fin: 0, finT: 0, ai: o.ai || 0, human: !!o.human, dash: 0, tlat: 0, w: 0, wall: 0, prog: 0, fxk: safe(() => window.__supers.of(card.id).fx, "fire"), held: null, inv: 0, ghost: 0, sure: 0, bc: 0, zc: 0, pat: 0, kart: kData.id, kAcc: o.human ? kData.acc : 1, kRate: o.human ? kData.eRate : 1 };
  }
  function begin(cfg) {
    const T = build(cfg.track), rnd = seeded(cfg.seed != null ? cfg.seed : (Date.now() & 0xfffff));
    R = { cfg, T, rnd, racers: cfg.racers, items: [], oils: [], t: -180, over: null, fin: [], inp: {}, edge: {}, fast: !!cfg.fast, fxs: [] };
    for (let s = 120; s < T.len - 40; s += 150 + Math.floor(rnd() * 110)) R.items.push({ s, lat: (rnd() * 2 - 1) * 0.8, k: rnd() < 0.72 ? "e" : "b", on: 1 }); // e = ⚡ energia, b = piastra turbo
    R.caos = cfg.mode === "caos"; R.fun = cfg.fun !== false || R.caos; R.obs = []; R.pads = []; R.zones = [];
    if (R.fun) {
      R.zones = ZON.map((z) => { const a = Math.floor(T.len * z.f); return { a, b: a + z.len, side: z.side, gated: z.gated, open: 0 }; });
      for (let s = 200; s < T.len - 60; s += 120 + Math.floor(rnd() * 100)) { if (R.zones.some((z) => s > z.a - 30 && s < z.b + 30)) continue; R.obs.push({ s, lat: rnd() * 1.6 - 0.8, k: rnd() < 0.5 ? "bump" : "patch", on: 1 }); }
      R.zones.forEach((z) => { if (!z.gated) for (let s = z.a + 25; s < z.b - 15; s += 45) R.obs.push({ s, lat: z.side * (0.8 + rnd() * 0.15), k: "bump", on: 1 }); else R.pads.push({ s: z.a - 140, lat: 0, z }); });
      for (let s = 260; s < T.len - 80; s += R.caos ? 85 + Math.floor(rnd() * 40) : 230 + Math.floor(rnd() * 120)) if (!R.items.some((it) => Math.abs(it.s - s) < 40)) R.items.push({ s, lat: (rnd() * 2 - 1) * 0.7, k: "x", on: 1 });
    }
    R.me = R.racers.find((r) => r.human);
    return R;
  }
  const place = () => R.racers.slice().sort((a, b) => (a.fin && b.fin ? a.finT - b.finT : a.fin ? -1 : b.fin ? 1 : b.prog - a.prog));
  function useAbil(r) {
    const A = ABIL[r.role]; if (r.cd > 0 || r.energy < A[2] || r.stun > 0) return; r.energy -= A[2]; r.cd = 150; fx(r, A[0]);
    if (r.role === "A") r.boost = Math.max(r.boost, 70); else if (r.role === "C") r.dash = 14; else if (r.role === "D") { r.shield = 240; R.racers.forEach((o) => { if (o !== r && Math.abs(o.prog - r.prog) < 70 && Math.abs(o.lat - r.lat) < 0.8) { o.stun = Math.max(o.stun, 25); o.v *= 0.6; } }); } else R.oils.push({ s: r.prog - 26, lat: r.lat, own: r, l: 900 });
  }
  function turbo(r) {
    if (r.energy < 25 || r.stun > 0) return;
    r.energy -= 25;
    const dur = r.kart === "speed" ? 72 : 55;
    r.boost = Math.max(r.boost, dur);
    fx(r, r.kart === "speed" ? "⚡ OVERDRIVE!" : "TURBO");
  }
  function fx(r, t) { if (!R.fast) R.fxs.push({ r, t, l: 40 }); }
  function hit(o, st, vm, txt) { if (o.inv > 0) return false; if (o.shield > 0) { o.shield = 0; fx(o, "SCUDO!"); return false; } o.stun = Math.max(o.stun, st); o.v *= vm; fx(o, txt || "COLPITO!"); return true; }
  const ahead = (r, d, lw) => R.racers.filter((o) => o !== r && !o.fin && o.prog > r.prog && o.prog - r.prog < d && Math.abs(o.lat - r.lat) < lw).sort((a, b) => a.prog - b.prog)[0];
  function useItem(r) {
    if (!r.held || r.stun > 0) return; const k = r.held; r.held = null; fx(r, ITEMN[k]); let t;
    if (k === "fire") { t = ahead(r, 320, 0.6); if (t) hit(t, 55, 0.4, "MISSILE!"); else r.boost = Math.max(r.boost, 35); }
    else if (k === "thunder") { R.racers.forEach((o) => { if (o !== r && !o.fin && o.prog > r.prog && o.prog - r.prog < 450) hit(o, 35, 0.6, "FULMINE!"); }); }
    else if (k === "curve") { r.sure = 200; r.boost = Math.max(r.boost, 60); }
    else if (k === "zig") { r.boost = Math.max(r.boost, 70); r.inv = 150; }
    else if (k === "spiral") { [-0.3, 0.3].forEach((d) => R.oils.push({ s: r.prog - 26, lat: clampN(r.lat + d, -0.9, 0.9), own: r, l: 900, tor: 1 })); }
    else if (k === "vanish") { r.ghost = 240; r.inv = 240; }
    else if (k === "ice") { t = ahead(r, 400, 0.9); if (t) hit(t, 80, 0.2, "GELATA!"); else r.boost = Math.max(r.boost, 35); }
    else if (k === "change") { t = ahead(r, 500, 2); if (t) { const p = r.prog, l = r.lat; r.prog = t.prog; r.lat = t.lat; t.prog = p; t.lat = l; t.stun = Math.max(t.stun, 20); fx(t, "SCAMBIO!"); } else r.boost = Math.max(r.boost, 50); }
    else { r.shield = 240; r.boost = Math.max(r.boost, 50); }
  }
  function aiIn(r) {
    const T = R.T, lvl = r.ai, a = at(T, r.prog + 70 + r.v * 20), inner = a.k > 0.0006 ? 0.75 : a.k < -0.0006 ? -0.75 : 0; // k>0: curva a destra? (vedi pos) -> corsia interna
    let want = inner * (0.5 + lvl * 0.08);
    for (const it of R.items) if (it.on && it.s - r.prog > 20 && it.s - r.prog < 140) { want = it.lat; break; }
    if (R.zones) for (const z of R.zones) { const ps = ((r.prog % T.len) + T.len) % T.len, d = z.a - ps; if (d > 10 && d < 150 && (!z.gated || z.open > 0) && R.rnd() < 0.5 + lvl * 0.1) { want = z.side * 0.85; break; } }
    if (R.pads) for (const pd of R.pads) { const ps = ((r.prog % T.len) + T.len) % T.len, d = pd.s - ps; if (d > 5 && d < 150 && pd.z.open <= 0 && lvl >= 2) { want = 0; break; } }
    for (const o of R.oils) if (o.own !== r && o.s - r.prog > 5 && o.s - r.prog < 90 && Math.abs(o.lat - r.lat) < 0.35) want = o.lat > 0 ? -0.8 : 0.8;
    r.tlat = want; const d = want - r.lat, inp = {}; if (d > 0.06) inp.r = 1; else if (d < -0.06) inp.l = 1;
    if (r.held && R.rnd() < 0.03 + lvl * 0.004 && (["fire", "ice", "change"].includes(r.held) ? !!ahead(r, 300, 0.7) : r.held === "thunder" ? !!ahead(r, 300, 3) : true)) inp.o = 1;
    if (r.energy >= 55 && r.boost <= 0 && R.rnd() < 0.02 * lvl) inp.t = 1;
    if (r.energy >= ABIL[r.role][2] + 10 && r.cd <= 0 && R.rnd() < 0.012 * lvl) inp.a = 1; return inp;
  }
  function stepR(r, inp) {
    const T = R.T; if (r.fin) { r.v *= 0.97; r.prog += r.v; return; }
    if (r.stun > 0) r.stun--; if (r.cd > 0) r.cd--; if (r.shield > 0) r.shield--; if (r.boost > 0) r.boost--; if (r.inv > 0) r.inv--; if (r.ghost > 0) r.ghost--; if (r.sure > 0) r.sure--; if (r.bc > 0) r.bc--;
    if (inp.o) useItem(r); if (inp.t) turbo(r); if (inp.a) useAbil(r);
    const a = at(T, r.prog), steer = (inp.sx != null ? inp.sx : (inp.r ? 1 : 0) - (inp.l ? 1 : 0)) * 0.034 * r.grip * (r.stun > 0 ? 0.3 : 1) * (r.pat === 2 ? (r.kart === "light" ? 0.7 : 0.45) : 1);
    // la curva spinge verso l'esterno
    const curveCentrif = r.kart === "light" ? 0.65 : 0.82;
    r.w = r.sure > 0 ? 0 : r.w * curveCentrif + (-a.k * r.v * r.v * 1.9) * (r.hold);
    r.lat += steer + r.w * 0.1; if (r.lat > 1 || r.lat < -1) { r.lat = Math.max(-1, Math.min(1, r.lat)); r.v *= 0.93; r.wall = 8; } else if (r.wall > 0) r.wall--;
    // velocità
    let vt = r.vmax * (r.boost > 0 ? 1.55 : 1) * (r.stun > 0 ? 0.45 : 1) * (r.pat && r.inv <= 0 ? (r.kart === "light" ? 0.88 : 0.72) : 1); if (r.dash > 0) { vt = r.vmax * 3; r.dash--; }
    for (const o of R.racers) {
      if (o !== r && o.prog > r.prog && o.prog - r.prog < 48 && Math.abs(o.lat - r.lat) < 0.35 && !o.fin) {
        const slip = r.kart === "classic" ? 1.15 : 1.07;
        vt *= slip;
        if (r.kart === "classic" && r.human) r.energy = Math.min(100, r.energy + 0.06);
        break;
      }
    }
    r.v += (vt - r.v) * 0.045 * (r.kAcc || 1); if (r.energy < 100) r.energy = Math.min(100, r.energy + 0.025 * (r.kRate || 1));
    r.prog += r.v / Math.max(0.55, 1 - a.k * r.lat * HW);
    // oggetti e chiazze
    const sd = (x) => ((x - r.prog) % T.len + T.len * 1.5) % T.len - T.len / 2; // distanza con segno lungo il giro
    for (const it of R.items) { if (!it.on) continue; if (Math.abs(sd(it.s)) < 9 && Math.abs(it.lat - r.lat) < 0.35) { it.on = 0; it.t = R.caos ? 150 : 420; if (it.k === "x") { if (!r.held) { r.held = r.fxk; fx(r, "🎁 " + ITEMN[r.fxk]); } else r.energy = Math.min(100, r.energy + 20); } else { if (it.k === "e") r.energy = Math.min(100, r.energy + 30); else r.boost = Math.max(r.boost, 40); fx(r, it.k === "e" ? "+⚡" : "TURBO!"); } } }
    R.oils = R.oils.filter((o) => { if (o.own !== r && Math.abs(sd(o.s)) < 8 && Math.abs(o.lat - r.lat) < 0.32 && r.stun <= 0 && r.inv <= 0) { if (r.shield > 0) { r.shield = 0; fx(r, "SCUDO!"); } else { r.stun = o.tor ? 70 : 55; r.v *= 0.5; fx(r, o.tor ? "TORNADO!" : "OLIO!"); } o.l = 0; } return o.l > 0; });
    // ostacoli di pista, chiazze lente, scorciatoie e leve
    r.pat = 0; for (const o of R.obs) {
      if (!o.on) continue; const dd = Math.abs(sd(o.s));
      if (o.k === "patch") { if (dd < 11 && Math.abs(o.lat - r.lat) < 0.4) r.pat = (THEME[T.id] || THEME.mare).ice ? 2 : 1; }
      else if (dd < 7 && Math.abs(o.lat - r.lat) < 0.2 && r.bc <= 0 && r.inv <= 0) {
        r.bc = 30;
        if (r.shield > 0) { r.shield = 0; o.on = 0; o.t = 600; fx(r, "SFONDATO!"); }
        else if (r.kart === "heavy") { r.stun = Math.max(r.stun, 12); r.v *= 0.78; o.on = 0; o.t = 600; fx(r, "SFONDATO!"); }
        else { r.stun = Math.max(r.stun, 35); r.v *= 0.45; fx(r, "OSTACOLO!"); }
      }
    }
    for (const pd of R.pads) if (Math.abs(sd(pd.s)) < 9 && Math.abs(pd.lat - r.lat) < 0.55 && pd.z.open <= 0) { pd.z.open = 600; fx(r, "CANCELLO APERTO!"); }
    { const ps = ((r.prog % T.len) + T.len) % T.len; for (const z of R.zones) { if (ps >= z.a && ps < z.b) { if (r.lat * z.side > 0.5) { if (z.gated && z.open <= 0) { if (!r.zc) { r.zc = 1; r.v *= 0.35; r.stun = Math.max(r.stun, 30); r.lat = 0; fx(r, "CANCELLO CHIUSO!"); } } else if (!r.zc) { r.prog += r.v * 0.38; } } } else r.zc = 0; } }
    if (r.prog >= T.len * LAPS && !r.fin) { r.fin = 1; r.finT = R.t; R.fin.push(r); }
    r.laps = Math.min(LAPS, Math.floor(r.prog / T.len));
  }
  function collide() {
    const T = R.T;
    for (let i = 0; i < R.racers.length; i++) for (let j = i + 1; j < R.racers.length; j++) {
      const a = R.racers[i], b = R.racers[j];
      if (a.fin || b.fin) continue;
      const ds = a.prog - b.prog;
      if (a.ghost > 0 || b.ghost > 0) continue;
      if (Math.abs(ds) < 14 && Math.abs(a.lat - b.lat) < 0.32) {
        const f = ds > 0 ? [a, b] : [b, a]; /* f[0] davanti */
        if (a.kart === "heavy" && b.kart !== "heavy") {
          b.v *= 0.78; b.lat += (b.lat >= a.lat ? 1 : -1) * 0.15; b.stun = Math.max(b.stun, 16); fx(b, "SPINTA!");
        } else if (b.kart === "heavy" && a.kart !== "heavy") {
          a.v *= 0.78; a.lat += (a.lat >= b.lat ? 1 : -1) * 0.15; a.stun = Math.max(a.stun, 16); fx(a, "SPINTA!");
        } else if (f[1].shield > 0) {
          f[0].v *= 0.9;
        } else {
          f[1].v *= 0.9;
          f[1].lat += (f[1].lat >= f[0].lat ? 1 : -1) * 0.06;
          f[0].lat += (f[0].lat >= f[1].lat ? 1 : -1) * 0.06;
        }
      }
    }
  }
  function tick() {
    if (!R || R.over) return; R.t++; R.fxs = R.fxs.filter((x) => --x.l > 0);
    if (R.t < 0) return; const e = R.edge; R.edge = {};
    R.racers.forEach((r) => { let inp = null; if (r.human) { inp = Object.assign({}, R.inp, e); const sv = R.stk && R.stk.v; if (sv && sv.m > 0) inp.sx = sv.x; R.leanIn = inp.sx != null ? inp.sx : (inp.r ? 1 : 0) - (inp.l ? 1 : 0); } stepR(r, inp || aiIn(r)); });
    R.items.forEach((it) => { if (!it.on && --it.t <= 0) it.on = 1; }); R.obs.forEach((o) => { if (!o.on && --o.t <= 0) o.on = 1; }); R.zones.forEach((z) => { if (z.open > 0) z.open--; }); R.oils.forEach((o) => o.l--);
    collide();
    if (R.me.fin && !R.over) { R.after = (R.after || 0) + 1; if (R.after > (R.fast ? 1 : 420) || R.racers.every((r) => r.fin)) finish(); }
  }
  function finish() {
    if (R.over) return; const order = place(); R.order = order; const pts = {}; order.forEach((r, i) => { pts[r.team] = (pts[r.team] || 0) + (PTS[i] || 0); });
    R.pts = pts; R.over = true; R.myPos = order.indexOf(R.me) + 1; const f = R.cfg.onEnd; setTimeout(() => f && f(R), R.fast ? 0 : 600);
  }
  // ------------------------------------------------------------ disegno
  function draw(g) { g.setTransform(SS, 0, 0, SS, 0, 0); if (R.cfg.view === "rear") draw3(g); else drawTop(g); }
  function drawTop(g) {
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
    R.items.forEach((it) => { if (!it.on) return; const q = pos(T, it.s, it.lat); if (Math.abs(q[0] - cx) > vx || Math.abs(q[1] - cy) > vy) return; g.font = "14px serif"; g.fillText(it.k === "e" ? "⚡" : it.k === "x" ? "🎁" : "🔶", q[0], q[1] + 5); });
    { const TH = THEME[T.id] || THEME.mare; R.obs.forEach((o) => { if (!o.on) return; const q = pos(T, o.s, o.lat); if (Math.abs(q[0] - cx) > vx || Math.abs(q[1] - cy) > vy) return; if (o.k === "patch") { g.fillStyle = TH.patch; g.beginPath(); g.ellipse(q[0], q[1], 14, 9, q[2], 0, 7); g.fill(); } else { g.font = "14px serif"; g.fillText(TH.bump, q[0], q[1] + 5); } }); R.pads.forEach((pd) => { const q = pos(T, pd.s, pd.lat); g.font = "14px serif"; g.fillText("🔘", q[0], q[1] + 5); }); }
    R.oils.forEach((o) => { const q = pos(T, o.s, o.lat); g.fillStyle = "#000b"; g.beginPath(); g.ellipse(q[0], q[1], 10, 7, q[2], 0, 7); g.fill(); });
    R.racers.slice().sort((a, b) => a.prog - b.prog).forEach((r) => kart(g, r, T));
    g.restore(); hud(g);
  }
  function hud(g) {
    const T = R.T, me = R.me;
    g.fillStyle = "#000a"; g.fillRect(0, 0, W, 26); g.fillStyle = "#fff"; g.font = "bold 12px system-ui"; g.textAlign = "left"; const ord = place(), pl = ord.indexOf(me) + 1;
    const selK = KARTS[me.kart || "classic"] || KARTS.classic;
    g.fillText(`${pl}° / ${R.racers.length} · ${(Math.max(0, me.fin ? me.finT : R.t) / 60).toFixed(1)}s`, 8, 17); g.textAlign = "center"; g.fillText(`Giro ${Math.min(LAPS, me.laps + 1)}/${LAPS}`, W / 2, 17); g.textAlign = "right"; g.fillText(`${T.n} · ${selK.icon}`, W - 8, 17);
    // barre energia e abilità
    g.fillStyle = "#000a"; g.fillRect(8, H - 20, 110, 11); g.fillStyle = me.energy >= 25 ? "#ffd23f" : "#8a7a30"; g.fillRect(9, H - 19, 108 * me.energy / 100, 9); g.fillStyle = "#fff"; g.font = "bold 9px system-ui"; g.textAlign = "left"; g.fillText("⚡ ENERGIA", 12, H - 11);
    if (me.held) { g.textAlign = "left"; g.fillStyle = "#000b"; g.fillRect(8, H - 56, 190, 28); g.strokeStyle = "#ffd23f"; g.lineWidth = 1; g.strokeRect(8, H - 56, 190, 28); g.fillStyle = "#ffd23f"; g.font = "bold 10px system-ui"; g.fillText((ITEMI[me.held] || "🎁") + " " + ITEMN[me.held] + " · tasto Oggetto", 12, H - 44); g.fillStyle = "#fff"; g.font = "9px system-ui"; g.fillText(ITEMD[me.held], 12, H - 33); }
    g.textAlign = "right"; g.fillStyle = me.cd <= 0 && me.energy >= ABIL[me.role][2] ? "#7ad87a" : "#aaa"; g.fillText(`${ABIL[me.role][0]} (${ABIL[me.role][2]})`, W - 8, H - 11);
    R.fxs.forEach((x) => { if (x.r !== me) return; g.globalAlpha = x.l / 40; g.fillStyle = "#ffd23f"; g.font = "bold 16px system-ui"; g.textAlign = "center"; g.fillText(x.t, W / 2, H / 2 - 40 - (40 - x.l)); g.globalAlpha = 1; });
    if (R.t < 0) { g.fillStyle = "#0008"; g.fillRect(0, 80, W, 60); g.fillStyle = "#ffd23f"; g.font = "900 38px system-ui"; g.textAlign = "center"; g.fillText(Math.ceil(-R.t / 60), W / 2, 124); } else if (R.t < 50) { g.fillStyle = "#ffd23f"; g.font = "900 30px system-ui"; g.textAlign = "center"; g.fillText("VIA!", W / 2, 124); }
    if (me.fin && !R.over) { g.fillStyle = "#0008"; g.fillRect(0, 90, W, 44); g.fillStyle = "#fff"; g.font = "900 22px system-ui"; g.textAlign = "center"; g.fillText(`Traguardo! ${pl}° posto`, W / 2, 120); }
  }
  // ------------------------------------------------------------ vista da dietro (pseudo-3D)
  const F3 = 91.6, D0 = 14, HC = 21.7, KG = 1.25;
  const quad = (g, xa, xb, ya, xc, xd, yb) => { g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, ya); g.lineTo(xd, yb); g.lineTo(xc, yb); g.closePath(); g.fill(); };
  function scenery(g, T, head) {
    const off = head * 230;
    if (T.neon) { const sx = ((W * 0.62 - off * 0.12) % (W + 160) + (W + 160)) % (W + 160) - 80; const gr = g.createLinearGradient(0, HY - 70, 0, HY); gr.addColorStop(0, "#ff4fd8"); gr.addColorStop(1, "#ffd23f"); g.fillStyle = gr; g.beginPath(); g.arc(sx, HY - 30, 36, Math.PI, 0); g.fill(); g.fillStyle = T.sky[0]; for (let i = 0; i < 5; i++) g.fillRect(sx - 40, HY - 28 + i * 6, 80, 1.5 + i * 0.6); }
    else if (T.id === "mare") { const sx = ((W * 0.3 - off * 0.1) % (W + 160) + (W + 160)) % (W + 160) - 80; g.fillStyle = "rgba(255,248,200,.95)"; g.beginPath(); g.arc(sx, HY - 44, 20, 0, 7); g.fill(); g.fillStyle = "rgba(255,248,200,.25)"; g.beginPath(); g.arc(sx, HY - 44, 34, 0, 7); g.fill(); }
    [[0.25, 38, 0.014, T.hill[0]], [0.55, 24, 0.03, T.hill[1]]].forEach(([k, amp, fr, col], L) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(-4, HY + 1);
      for (let x = -4; x <= W + 8; x += 6) { const u = x + off * k; let h; if (T.neon) { const cell = Math.floor(u / 15); h = 8 + ((cell * 2654435761 >>> 0) % (L ? 26 : 46)); h = (u % 15 + 15) % 15 < 13 ? h : 0; g.lineTo(x, HY - h); continue; } h = amp * (0.55 + 0.45 * Math.sin(u * fr + L * 2.1)) + amp * 0.45 * Math.sin(u * fr * 2.7 + 1 + L); g.lineTo(x, HY - h); }
      g.lineTo(W + 8, HY + 1); g.closePath(); g.fill();
      if (T.neon && L === 0) { g.fillStyle = "rgba(255,79,216,.18)"; g.fillRect(0, HY - 2, W, 3); }
    });
  }
  function kartRear(g, x, y, u, r, tilt) {
    g.save(); g.translate(x, y); g.rotate(tilt || 0); if (r.ghost > 0) g.globalAlpha = 0.45; if (r.stun > 0) g.rotate(Math.sin(R.t * 0.5) * 0.35);
    const k = r.kart || "classic";
    if (k === "speed") {
      g.fillStyle = "rgba(0,0,0,.4)"; g.beginPath(); g.ellipse(0, 3 * u, 20 * u, 4.2 * u, 0, 0, 7); g.fill();
      g.fillStyle = "#111"; g.fillRect(-19 * u, -8 * u, 7 * u, 10 * u); g.fillRect(12 * u, -8 * u, 7 * u, 10 * u);
      g.fillStyle = "#e62810"; g.fillRect(-17 * u, -4 * u, 3 * u, 3 * u); g.fillRect(14 * u, -4 * u, 3 * u, 3 * u);
      if ((r.boost > 0 || r.v > r.vmax * 1.06) && !R.fast) {
        for (let j = 0; j < 3; j++) {
          g.fillStyle = j === 0 ? "#ffd23f" : j === 1 ? "#ff5010" : "#ffffff";
          g.beginPath(); g.moveTo(4 * u, -2 * u); g.lineTo(0, (7 + Math.random() * 9 + (r.boost > 0 ? 5 : 0)) * u); g.lineTo(-4 * u, -2 * u); g.fill();
        }
      }
      g.fillStyle = "#c81410"; g.strokeStyle = "#111"; g.lineWidth = Math.max(1, u * 0.6);
      g.beginPath(); g.moveTo(-13 * u, 0); g.lineTo(-11 * u, -12 * u); g.lineTo(11 * u, -12 * u); g.lineTo(13 * u, 0); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#ffd700"; g.beginPath(); g.moveTo(-6 * u, -12 * u); g.lineTo(0, -3 * u); g.lineTo(6 * u, -12 * u); g.lineTo(3 * u, -12 * u); g.lineTo(0, -6 * u); g.lineTo(-3 * u, -12 * u); g.fill();
      g.fillStyle = "#1a1a24"; g.fillRect(-16 * u, -17 * u, 32 * u, 3 * u); g.fillRect(-14 * u, -21 * u, 28 * u, 2.5 * u);
      g.fillStyle = "#e62810"; g.fillRect(-17 * u, -22 * u, 2.5 * u, 8 * u); g.fillRect(14.5 * u, -22 * u, 2.5 * u, 8 * u);
      g.fillStyle = "#333"; g.fillRect(-7 * u, -17 * u, 2 * u, 6 * u); g.fillRect(5 * u, -17 * u, 2 * u, 6 * u);
      g.fillStyle = (R.t % 14 < 7) ? "#ff2222" : "#550000"; g.fillRect(-2 * u, -4 * u, 4 * u, 3 * u);
    } else if (k === "light") {
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(0, 3 * u, 14 * u, 4 * u, 0, 0, 7); g.fill();
      g.fillStyle = "#15151c"; g.fillRect(-14 * u, -9 * u, 4.5 * u, 11 * u); g.fillRect(9.5 * u, -9 * u, 4.5 * u, 11 * u);
      g.strokeStyle = "#00e5ff"; g.lineWidth = Math.max(1, u * 0.5);
      g.strokeRect(-13.5 * u, -8 * u, 3.5 * u, 9 * u); g.strokeRect(10 * u, -8 * u, 3.5 * u, 9 * u);
      if (r.boost > 0 && !R.fast) {
        g.fillStyle = "#00e5ff"; g.beginPath(); g.arc(-4 * u, 0, (3 + Math.random() * 4) * u, 0, 7); g.arc(4 * u, 0, (3 + Math.random() * 4) * u, 0, 7); g.fill();
      }
      g.fillStyle = "#0a2a3a"; g.strokeStyle = "#00e5ff"; g.lineWidth = Math.max(1, u * 0.7);
      g.beginPath(); g.roundRect(-9 * u, -13 * u, 18 * u, 13 * u, 6 * u); g.fill(); g.stroke();
      g.fillStyle = "#76ff03"; g.fillRect(-7 * u, -7 * u, 14 * u, 2 * u);
      g.strokeStyle = "rgba(0,229,255,.8)"; g.lineWidth = 1.8 * u; g.beginPath(); g.arc(0, -14 * u, 9 * u, Math.PI, 0); g.stroke();
      const sway = Math.sin(R.t * 0.3) * 1.5 * u;
      g.strokeStyle = "#99ffff"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(-7 * u, -13 * u); g.lineTo(-9 * u + sway, -25 * u); g.stroke();
      g.beginPath(); g.moveTo(7 * u, -13 * u); g.lineTo(9 * u + sway, -25 * u); g.stroke();
      g.fillStyle = "#00e5ff"; g.beginPath(); g.arc(-9 * u + sway, -25 * u, 2 * u, 0, 7); g.fill(); g.beginPath(); g.arc(9 * u + sway, -25 * u, 2 * u, 0, 7); g.fill();
    } else if (k === "heavy") {
      g.fillStyle = "rgba(0,0,0,.5)"; g.beginPath(); g.ellipse(0, 3.5 * u, 22 * u, 5.5 * u, 0, 0, 7); g.fill();
      g.fillStyle = "#111"; g.fillRect(-20 * u, -11 * u, 8 * u, 14 * u); g.fillRect(12 * u, -11 * u, 8 * u, 14 * u);
      g.fillStyle = "#444"; for (let t = -9; t <= 1; t += 3) { g.fillRect(-19 * u, t * u, 6 * u, 1.2 * u); g.fillRect(13 * u, t * u, 6 * u, 1.2 * u); }
      if (!R.fast && (r.boost > 0 || R.t % 4 === 0)) {
        g.fillStyle = r.boost > 0 ? "#ff9a2a" : "rgba(80,80,80,.6)";
        g.beginPath(); g.arc(-11 * u, -24 * u, (r.boost > 0 ? 4 : 2) * u, 0, 7); g.arc(11 * u, -24 * u, (r.boost > 0 ? 4 : 2) * u, 0, 7); g.fill();
      }
      g.fillStyle = "#222"; g.fillRect(-12 * u, -22 * u, 3 * u, 14 * u); g.fillRect(9 * u, -22 * u, 3 * u, 14 * u);
      g.fillStyle = "#3a404a"; g.strokeStyle = "#1a1e24"; g.lineWidth = Math.max(1, u * 0.8);
      g.beginPath(); g.roundRect(-13 * u, -15 * u, 26 * u, 15 * u, 3 * u); g.fill(); g.stroke();
      g.save(); g.beginPath(); g.rect(-12 * u, -6 * u, 24 * u, 5 * u); g.clip();
      g.fillStyle = "#ffd23f"; g.fillRect(-12 * u, -6 * u, 24 * u, 5 * u); g.fillStyle = "#111";
      for (let xh = -16; xh <= 16; xh += 5) { g.beginPath(); g.moveTo(xh * u, -6 * u); g.lineTo((xh + 3) * u, -6 * u); g.lineTo((xh - 1) * u, -1 * u); g.lineTo((xh - 4) * u, -1 * u); g.fill(); }
      g.restore();
      g.strokeStyle = "#ffd23f"; g.lineWidth = 1.6 * u;
      g.beginPath(); g.moveTo(-9 * u, -15 * u); g.lineTo(-6 * u, -24 * u); g.lineTo(6 * u, -24 * u); g.lineTo(9 * u, -15 * u); g.stroke();
      g.fillStyle = "#fff"; g.fillRect(-4 * u, -25.5 * u, 3 * u, 2 * u); g.fillRect(1 * u, -25.5 * u, 3 * u, 2 * u);
      g.fillStyle = "#1a1e24"; g.fillRect(-14 * u, -1 * u, 28 * u, 2.5 * u);
    } else {
      g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(0, 3 * u, 17 * u, 4.6 * u, 0, 0, 7); g.fill();
      g.fillStyle = "#15151c"; g.fillRect(-16 * u, -9 * u, 6 * u, 11 * u); g.fillRect(10 * u, -9 * u, 6 * u, 11 * u);
      g.fillStyle = "#34343f"; g.fillRect(-15 * u, -9 * u, 2 * u, 11 * u); g.fillRect(11 * u, -9 * u, 2 * u, 11 * u);
      if (r.boost > 0 && !R.fast) {
        for (let k = 0; k < 2; k++) {
          g.fillStyle = k ? "#fff3a0" : "#ff9a2a"; g.beginPath(); g.moveTo((k ? 4 : 8) * u, -3 * u); g.lineTo(6 * u * (k ? 0.5 : 1) , (6 + Math.random() * 6) * u); g.lineTo(0, -3 * u); g.lineTo(-6 * u * (k ? 0.5 : 1), (6 + Math.random() * 6) * u); g.lineTo(-8 * u, -3 * u); g.fill();
        }
      }
      g.fillStyle = r.col; g.strokeStyle = "#111"; g.lineWidth = Math.max(1, u * 0.6); g.beginPath(); g.roundRect(-11 * u, -14 * u, 22 * u, 14 * u, 4 * u); g.fill(); g.stroke();
      g.fillStyle = "#ffffff"; g.fillRect(-2.5 * u, -14 * u, 1.8 * u, 14 * u); g.fillRect(0.7 * u, -14 * u, 1.8 * u, 14 * u);
      g.fillStyle = "rgba(255,255,255,.3)"; g.fillRect(-9 * u, -12 * u, 18 * u, 2.4 * u);
      g.fillStyle = "#111"; g.fillRect(-14 * u, -19 * u, 28 * u, 3.4 * u); g.fillRect(-9 * u, -19 * u, 2 * u, 6 * u); g.fillRect(7 * u, -19 * u, 2 * u, 6 * u);
      g.fillStyle = "#ff3a3a"; g.fillRect(-9 * u, -6 * u, 4 * u, 2.2 * u); g.fillRect(5 * u, -6 * u, 4 * u, 2.2 * u);
    }
    const im = imgOf(r.id), hr = 7.4 * u; g.save(); g.beginPath(); g.arc(0, -22 * u, hr, 0, 7); g.clip(); if (im && im.complete && im.naturalWidth) g.drawImage(im, -hr, -22 * u - hr, hr * 2, hr * 2); else { g.fillStyle = "#e8c8a0"; g.fillRect(-hr, -22 * u - hr, hr * 2, hr * 2); } g.restore();
    g.strokeStyle = r.human ? "#ffd23f" : r.col; g.lineWidth = Math.max(1, u * (r.human ? 1 : 0.7)); g.beginPath(); g.arc(0, -22 * u, hr, 0, 7); g.stroke();
    if (r.shield > 0) { g.strokeStyle = k === "heavy" ? "#ffd23f" : "#9ad8ff"; g.lineWidth = Math.max(1, u * (k === "heavy" ? 1.4 : 0.7)); g.beginPath(); g.arc(0, -12 * u, 24 * u, 0, 7); g.stroke(); }
    g.restore();
  }
  function draw3(g) {
    const T = R.T, me = R.me, a0 = at(T, me.prog), head = Math.atan2(a0.t[1], a0.t[0]), len = T.len, camX = me.lat * HW;
    g.save(); if ((me.wall > 0 || me.stun > 0) && !R.fast) g.translate((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
    const sk = g.createLinearGradient(0, 0, 0, HY); sk.addColorStop(0, T.sky[0]); sk.addColorStop(1, T.sky[1]); g.fillStyle = sk; g.fillRect(-4, -4, W + 8, HY + 5);
    scenery(g, T, head); g.fillStyle = T.grass[0]; g.fillRect(-4, HY, W + 8, H - HY + 4);
    const seg = []; let th = 0, xo = 0;
    for (let i = 0; i <= NSEG; i++) { const d = i * DZ, sc = F3 / (d + D0), a = at(T, me.prog + d); seg.push({ d, sc, y: HY + HC * sc, cx: W / 2 + (xo - camX) * sc, hw: HW * sc, s: me.prog + d }); th += a.k * DZ * KG; xo += th * DZ * 0.85; }
    // sprite: raggruppati per segmento
    const bk = []; for (let i = 0; i < NSEG; i++) bk.push([]);
    const rel = (s) => (((s - me.prog) % len) + len * 1.5) % len - len / 2;
    const put = (s, lat, o) => { const d = rel(s); if (d < 0.5 || d >= NSEG * DZ - 1) return; const i = Math.floor(d / DZ), u = d / DZ - i, A = seg[i], B = seg[i + 1]; o.sc = A.sc + (B.sc - A.sc) * u; o.y = A.y + (B.y - A.y) * u; o.x = A.cx + (B.cx - A.cx) * u + lat * (A.hw + (B.hw - A.hw) * u); o.d = d; bk[i].push(o); };
    T.decor.forEach((dc) => { if (dc[4] != null) put(dc[4], dc[5], { k: "d", e: dc[2], z: dc[3] }); });
    R.items.forEach((it) => { if (it.on) put(it.s, it.lat, { k: "i", e: it.k === "e" ? "⚡" : it.k === "x" ? "🎁" : "🔶" }); });
    { const TH = THEME[T.id] || THEME.mare; R.obs.forEach((o) => { if (o.on) put(o.s, o.lat, o.k === "patch" ? { k: "p", c: TH.patch } : { k: "i", e: TH.bump }); }); R.pads.forEach((pd) => put(pd.s, pd.lat, { k: "i", e: "🔘" }));
      R.zones.forEach((z) => { const g1 = z.gated; [0.7, 0.95, 1.2].forEach((l) => put(z.a, z.side * l, { k: "i", e: g1 ? (z.open > 0 ? "🟢" : "⛔") : "🛤️" })); put(((z.a - 50) % len + len) % len, z.side * 1.3, { k: "i", e: g1 ? (z.open > 0 ? "🔓" : "🔒") : "⚠️" }); }); }
    R.oils.forEach((o) => put(o.s, o.lat, { k: "o" }));
    R.racers.forEach((r) => { if (r !== me) put(r.prog, r.lat, { k: "r", r }); });
    for (let i = NSEG - 1; i >= 0; i--) {
      const a = seg[i], b = seg[i + 1], st = Math.floor(a.s / (DZ * 3)) & 1;
      if (b.y < a.y) {
        g.fillStyle = T.grass[st]; g.fillRect(-4, b.y, W + 8, a.y - b.y + 1);
        g.fillStyle = st ? T.edge : (T.neon ? "#22d8ff" : "#f4f0e4"); quad(g, b.cx - b.hw * 1.14, b.cx + b.hw * 1.14, b.y, a.cx - a.hw * 1.14, a.cx + a.hw * 1.14, a.y);
        g.fillStyle = st ? T.road : (T.neon ? "#2f2a52" : "#555b69"); quad(g, b.cx - b.hw, b.cx + b.hw, b.y, a.cx - a.hw, a.cx + a.hw, a.y);
        { const sa = ((a.s % len) + len) % len; R.zones.forEach((z) => { if (sa >= z.a && sa < z.b) { g.fillStyle = z.gated ? (z.open > 0 ? "rgba(90,210,130,.6)" : "rgba(210,70,70,.5)") : "rgba(150,110,60,.75)"; const x0 = z.side > 0 ? 0.5 : -1, x1 = z.side > 0 ? 1 : -0.5; quad(g, b.cx + b.hw * x0, b.cx + b.hw * x1, b.y, a.cx + a.hw * x0, a.cx + a.hw * x1, a.y); } }); }
        if (st) { g.fillStyle = "rgba(255,255,255,.55)"; quad(g, b.cx - b.hw * 0.025, b.cx + b.hw * 0.025, b.y, a.cx - a.hw * 0.025, a.cx + a.hw * 0.025, a.y); }
        if (Math.floor(a.s / len) !== Math.floor(b.s / len)) { for (let k = 0; k < 10; k++) { g.fillStyle = k & 1 ? "#fff" : "#111"; const x0 = -1 + k * 0.2; quad(g, b.cx + b.hw * x0, b.cx + b.hw * (x0 + 0.2), b.y, a.cx + a.hw * x0, a.cx + a.hw * (x0 + 0.2), a.y); } }
      }
      bk[i].sort((p, q) => q.d - p.d).forEach((o) => {
        if (o.k === "d") { g.font = Math.max(6, o.z * o.sc * 1.5) + "px serif"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText(o.e, o.x, o.y); }
        else if (o.k === "i") { g.font = Math.max(6, 15 * o.sc * 1.6) + "px serif"; g.textAlign = "center"; g.fillText(o.e, o.x, o.y - 4 * o.sc); }
        else if (o.k === "p") { g.fillStyle = o.c; g.beginPath(); g.ellipse(o.x, o.y, HW * 0.42 * o.sc, HW * 0.12 * o.sc, 0, 0, 7); g.fill(); }
        else if (o.k === "o") { g.fillStyle = "rgba(0,0,0,.78)"; g.beginPath(); g.ellipse(o.x, o.y, HW * 0.3 * o.sc, HW * 0.09 * o.sc, 0, 0, 7); g.fill(); g.fillStyle = "rgba(120,120,255,.25)"; g.beginPath(); g.ellipse(o.x - 2 * o.sc, o.y - 0.5 * o.sc, HW * 0.12 * o.sc, HW * 0.03 * o.sc, 0, 0, 7); g.fill(); }
        else { kartRear(g, o.x, o.y, o.sc * 0.37, o.r, 0); if (o.d < 260) { g.font = "bold " + Math.max(7, Math.min(11, 11 * o.sc * 0.5)) + "px system-ui"; g.textAlign = "center"; g.fillStyle = o.r.col; g.strokeStyle = "#000"; g.lineWidth = 2.5; const ty = o.y - 36 * o.sc * 0.37 - 6; g.strokeText(o.r.n.split(" ")[0], o.x, ty); g.fillText(o.r.n.split(" ")[0], o.x, ty); } }
      });
    }
    // pilota (sempre davanti, in basso)
    R.lean = (R.lean || 0) * 0.8 + 0.2 * (R.leanIn || 0); const lean = R.lean, slide = clampN(me.w * 6, -1, 1);
    if ((me.boost > 0 || me.v > me.vmax * 1.2) && !R.fast) { g.strokeStyle = "rgba(255,255,255,.3)"; g.lineWidth = 1.2; for (let i = 0; i < 14; i++) { const a = R.t * 0.37 + i * 2.1, rx = W / 2 + Math.cos(a) * (60 + (i * 37) % 120), ry = HY + 20 + Math.abs(Math.sin(a * 1.3)) * 100; g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx + (rx - W / 2) * 0.25, ry + (ry - HY) * 0.25); g.stroke(); } }
    kartRear(g, W / 2 + lean * 10 + slide * 4, H - 30, 2.35, me, lean * 0.1 + slide * 0.08);
    g.restore(); hud(g);
    // contachilometri e minimappa
    g.textAlign = "center"; g.fillStyle = "#fff"; g.strokeStyle = "#000"; g.lineWidth = 3; g.font = "900 20px system-ui"; g.strokeText(Math.round(me.v * 95), W - 34, 94); g.fillText(Math.round(me.v * 95), W - 34, 94); g.font = "bold 8px system-ui"; g.fillText("km/h", W - 34, 104);
    const bb = T.bb, mw = 62, mh = 44, k = Math.min((mw - 8) / (bb[2] - bb[0]), (mh - 8) / (bb[3] - bb[1])), mx = (x) => W - mw - 4 + 4 + (x - bb[0]) * k + ((mw - 8) - (bb[2] - bb[0]) * k) / 2, my = (y) => 30 + 4 + (y - bb[1]) * k + ((mh - 8) - (bb[3] - bb[1]) * k) / 2;
    g.fillStyle = "rgba(0,0,0,.5)"; g.beginPath(); g.roundRect(W - mw - 4, 30, mw, mh, 6); g.fill(); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 2; g.beginPath(); T.cs.forEach((c, i) => { if (i % 3) return; i ? g.lineTo(mx(c[0]), my(c[1])) : g.moveTo(mx(c[0]), my(c[1])); }); g.closePath(); g.stroke();
    R.racers.forEach((r) => { const q = pos(T, r.prog, 0); g.fillStyle = r.human ? "#ffd23f" : r.col; g.beginPath(); g.arc(mx(q[0]), my(q[1]), r.human ? 3.2 : 2, 0, 7); g.fill(); });
  }
  const IMG = {}; const imgOf = (id) => { if (IMG[id] !== undefined) return IMG[id]; const u = safe(() => S().port(id), null); if (!u) return (IMG[id] = null); const i = new Image(); i.src = u; return (IMG[id] = i); };
  function kart(g, r, T) {
    const q = pos(T, r.prog, r.lat); g.save(); g.translate(q[0], q[1]); g.rotate(q[2] + (r.stun > 0 ? Math.sin(R.t * 0.6) * 0.6 : 0));
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(2, 3, 13, 8, 0, 0, 7); g.fill();
    const k = r.kart || "classic";
    if (k === "speed") {
      g.fillStyle = "#c81410"; g.strokeStyle = "#ffd700"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(14, 0); g.lineTo(-12, -8); g.lineTo(-8, 0); g.lineTo(-12, 8); g.closePath();
      g.fill(); g.stroke();
      g.fillStyle = "#111"; g.fillRect(-13, -11, 3, 22);
    } else if (k === "light") {
      g.fillStyle = "#0a2a3a"; g.strokeStyle = "#00e5ff"; g.lineWidth = 1.5;
      g.beginPath(); g.ellipse(1, 0, 11, 7, 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = "#76ff03"; g.beginPath(); g.arc(10, 0, 2.5, 0, 7); g.fill();
    } else if (k === "heavy") {
      g.fillStyle = "#111";
      g.fillRect(-14, -10, 8, 4); g.fillRect(-14, 6, 8, 4);
      g.fillRect(4, -10, 8, 4); g.fillRect(4, 6, 8, 4);
      g.fillStyle = "#3a404a"; g.strokeStyle = "#ffd23f"; g.lineWidth = 1.6;
      g.beginPath(); g.roundRect(-11, -7, 22, 14, 2); g.fill(); g.stroke();
    } else {
      g.fillStyle = r.col; g.strokeStyle = "#111"; g.lineWidth = 1.5;
      g.beginPath(); g.roundRect(-12, -7, 24, 14, 4); g.fill(); g.stroke();
      g.fillStyle = "#fff"; g.fillRect(-11, -1, 22, 2);
    }
    if (r.boost > 0) {
      g.fillStyle = k === "light" ? "#00e5ff" : k === "speed" ? "#ff4010" : "#ffb347";
      g.beginPath(); g.moveTo(-12, -4); g.lineTo(-24 - Math.random() * 6, 0); g.lineTo(-12, 4); g.fill();
    }
    g.rotate(-q[2]); const im = imgOf(r.id); g.beginPath(); g.arc(1, -1, 8, 0, 7); g.save(); g.clip();
    if (im && im.complete && im.naturalWidth) g.drawImage(im, -8, -9, 18, 18); else { g.fillStyle = "#e8c8a0"; g.fillRect(-8, -9, 18, 18); } g.restore();
    g.strokeStyle = r.human ? "#ffd23f" : r.col; g.lineWidth = r.human ? 2.5 : 1.5; g.beginPath(); g.arc(1, -1, 8, 0, 7); g.stroke();
    if (r.shield > 0) { g.strokeStyle = k === "heavy" ? "#ffd23f" : "#9ad8ff"; g.lineWidth = 1.5; g.beginPath(); g.arc(1, -1, 14, 0, 7); g.stroke(); }
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
.crCtl{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:8px;touch-action:none;user-select:none;-webkit-user-select:none}.crCtl button{border-radius:14px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 15px system-ui;padding:4px;touch-action:none;min-height:64px}.crCtl .st{display:grid;grid-template-columns:64px 64px;gap:6px}.crCtl .ac{display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:1}.crCtl button.on,.crCtl button:active{background:#5a3aa8}.crCtl .tb{background:#7a5a10;color:#ffe9a8}.crCtl .ab{background:#2a4a7a}.crCtl small{display:block;font-weight:400;font-size:9px;opacity:.8}
.crTab{width:100%;border-collapse:collapse;font-size:13px;margin:6px 0}.crTab td{padding:5px 4px;border-top:1px solid #2a2040}.crTab tr.me td{color:#ffd23f;font-weight:800}.crRes{text-align:center;margin:10px 0}.crRes h3{font:900 24px system-ui;margin:4px 0}
.crOv .crX{display:none}.crOv.land{overflow:hidden}.crOv.land .wrap{max-width:none;padding:0;height:100%}.crOv.land .bar{display:none}.crOv.land .body{height:100%;position:relative;display:flex;justify-content:center;background:#000}.crOv.land canvas{height:100%;width:auto;max-width:100%;border-radius:0;max-width:calc(100% - 0px)}
.crOv.land .crX{display:block;position:absolute;top:6px;right:8px;z-index:7;width:36px;height:36px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36cc;color:#fff;font-size:15px}.crOv.land .crCtl{position:absolute;left:0;right:0;bottom:6px;padding:0 12px;margin:0;pointer-events:none;align-items:flex-end}.crOv.land .crCtl>*{pointer-events:auto}.crOv.land .sum{display:none}
.crOv.land .stk{background:rgba(20,15,40,.16)!important;border-color:rgba(255,255,255,.22)!important;box-shadow:none!important}.crOv.land .stk i{opacity:.62}.crOv.land .crCtl button{background:rgba(34,26,54,.45);border-color:rgba(255,255,255,.2)}.crOv.land .crCtl .tb,.crOv.land .crCtl .sp{background:rgba(42,74,122,.5)}.crOv.land .crCtl .su{background:rgba(122,90,16,.5)}.crOv.land .crCtl .ac{flex:none;width:230px}.crOv .body{position:relative}.crOv .crQ{position:absolute;top:-45px;right:48px;width:40px;height:40px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#ffd23f;font:900 18px system-ui;z-index:4}.crOv.land .crQ{top:6px;right:50px;width:36px;height:36px}.crOv .crQ{display:none}.crOv .race .crQ,.crOv .crX~.crQ{display:block}.crTut{position:absolute;inset:0;z-index:6;background:#0c0818;min-height:380px;overflow:auto;padding:12px;border-radius:10px}.crTut h4{margin:0 0 6px;font:900 16px system-ui;color:#ffd23f}.crTut p{margin:6px 0;font-size:13px;line-height:1.4}.crTut .il{display:grid;gap:3px;font-size:12px}.crTut .il div{padding:3px 6px;border-radius:6px;background:#221a36}.crTut .il .mine{background:#5a3aa8}.crTut .nv{display:flex;gap:6px;margin-top:10px}.crTut .nv button{flex:1;min-height:44px;border-radius:10px;border:2px solid #ffd23f;background:#221a36;color:#fff;font:800 14px system-ui}`;
    document.head.appendChild(st);
  }
  function shell(title) { css(); halt(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "crOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const live = R && !R.over; halt(); if (live) return menu(); const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  let LAY = null;
  function halt() { cancelAnimationFrame(RAF); RAF = 0; if (LAY) { window.removeEventListener("resize", LAY); window.removeEventListener("orientationchange", LAY); LAY = null; } window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); }
  function close() { halt(); R = null; if (OV) { OV.remove(); OV = null; } }
  const KM = { ArrowLeft: "l", ArrowRight: "r", a: "l", d: "r", " ": "t", j: "t", k: "a", l: "a", o: "o", e: "o" };
  const kd = (e) => { const k = KM[e.key]; if (!k || !R) return; e.preventDefault(); if (k === "t" || k === "a" || k === "o") R.edge[k] = 1; else R.inp[k] = 1; };
  const ku = (e) => { const k = KM[e.key]; if (k && R && k !== "t" && k !== "a" && k !== "o") R.inp[k] = 0; };
  function press(k, on) { if (!R) return; if (k === "t" || k === "a" || k === "o") { if (on) R.edge[k] = 1; } else R.inp[k] = on ? 1 : 0; }
  function tutor(body, me) {
    if (body.querySelector(".crTut")) return; const mine = me.fxk, wasP = PAUSE; PAUSE = true; let i = 0;
    const pages = [
      ["Guida", `<p>Il <b>gas è automatico</b>: tu sterzi (joystick o ◀ ▶). <b>⚡ Turbo</b> (25 energia) dà una spinta. L'<b>✦ abilità</b> dipende dal ruolo. Stare dietro a un rivale dà <b>scia</b>. Sulla pista raccogli ⚡ (energia) e 🔶 (turbo).</p><p>Dentro la curva si risparmia strada, ma la curva ti spinge fuori.</p>`],
      ["Gli oggetti 🎁", `<p>Passa su una <b>scatola 🎁</b> sulla pista: ricevi l'oggetto della tua saga (ne tieni uno solo). Poi premi il pulsante <b>🎁 Oggetto</b> (tasto O) per usarlo. Se ne hai già uno, la scatola ti dà +20 energia. In alto a sinistra vedi quello che hai e cosa fa.</p><div class="il">${Object.keys(ITEMN).map((k) => `<div class="${k === mine ? "mine" : ""}">${ITEMI[k]} <b>${ITEMN[k]}</b>: ${ITEMD[k]}${k === mine ? " ← il tuo" : ""}</div>`).join("")}</div>`],
      ["Ostacoli e scorciatoie", `<p><b>Ostacoli</b> e <b>chiazze</b> sulla pista ti rallentano. Ai bordi ci sono <b>scorciatoie</b>: quella sterrata è sempre aperta ma piena di ostacoli, quella con il <b>cancello</b> si apre passando sulla leva 🔘 prima.</p><p>Le modalità si cambiano dal menu: Classica, Giro lanciato (cronometro), Testa a testa, Caos.</p>`]
    ];
    const ov = document.createElement("div"); ov.className = "crTut"; body.appendChild(ov);
    const end = () => { ov.remove(); PAUSE = false; safe(() => localStorage.setItem("ali-di-rondine.mini.corsa", "1"), 0); };
    const show = () => { const p = pages[i], last = i === pages.length - 1; ov.innerHTML = `<h4>${i + 1}/${pages.length} · ${p[0]}</h4>${p[1]}<div class="nv">${i ? `<button type="button" data-a="b">◂ Indietro</button>` : `<button type="button" data-a="x">Salta</button>`}<button type="button" data-a="${last ? "x" : "n"}">${last ? "▶ Via!" : "Avanti ▸"}</button></div>`; ov.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => { const a = b.dataset.a; if (a === "n") { i++; show(); } else if (a === "b") { i--; show(); } else end(); })); };
    show();
  }
  function raceUI(cfg) {
    const body = shell(cfg.title || "🏁 Gran Premio dei Sogni"); begin(cfg); const me = R.me, rear = cfg.view === "rear";
    body.innerHTML = `<canvas width="${W * SS}" height="${H * SS}"></canvas><button type="button" class="crX" aria-label="Esci">✕</button><button type="button" class="crQ" aria-label="Come si gioca">?</button><div class="crCtl">${rear ? `<div class="stkSlot"></div>` : `<div class="st"><button data-k="l">◀</button><button data-k="r">▶</button></div>`}<div class="ac"><button data-k="t" class="tb">⚡ Turbo<small>25 energia</small></button><button data-k="a" class="ab">✦ ${esc(ABIL[me.role][0])}<small>${esc(ABIL[me.role][1])}</small></button>${R.fun ? `<button data-k="o" class="it" style="grid-column:1/3;background:#3a2a5a">🎁 Oggetto<small>raccogli 🎁 sulla pista</small></button>` : ""}</div></div><p class="sum" style="font-size:11px;opacity:.65;margin-top:6px">Il gas è automatico. ${rear ? "Joystick ◀▶: sterza (più lo spingi, più giri)." : "Sterza ◀ ▶."} Dentro la curva si risparmia strada, ma la curva ti spinge fuori. ⚡ e 🔶 sulla pista ricaricano l'energia o danno turbo. Stare dietro un rivale dà scia. ${R.fun ? "🎁 dà l'oggetto della tua saga (tasto Oggetto). Ostacoli e chiazze rallentano. Scorciatoie ai bordi: quella sterrata è sempre aperta ma con ostacoli; quella col cancello si apre passando sulla leva 🔘. " : ""}Tasti: frecce, spazio turbo, K abilità, O oggetto.</p>`;
    if (rear && window.__stick) { R.stk = window.__stick.make({ size: 118 }); body.querySelector(".stkSlot").appendChild(R.stk.el); }
    const cv = body.querySelector("canvas"), g = cv.getContext("2d");
    body.querySelectorAll("[data-k]").forEach((b) => { const k = b.dataset.k, up = () => { press(k, false); b.classList.remove("on"); }; b.addEventListener("pointerdown", (e) => { e.preventDefault(); press(k, true); b.classList.add("on"); }); b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("pointerleave", up); });
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const layout = () => { if (OV) OV.classList.toggle("land", innerWidth > innerHeight * 1.1); }; LAY = layout; window.addEventListener("resize", LAY); window.addEventListener("orientationchange", LAY); layout(); body.querySelector(".crX").onclick = () => OV.querySelector(".bar .x").click();
    body.querySelector(".crQ").onclick = () => tutor(body, R.me);
    if (cfg.tutorial !== false && !safe(() => localStorage.getItem("ali-di-rondine.mini.corsa") === "1", false)) tutor(body, R.me);
    let last = performance.now(), acc = 0; const loop = (t) => { if (!OV || !R) return; acc += Math.min(100, t - last); last = t; try { while (acc >= 16.67) { if (!PAUSE) tick(); acc -= 16.67; } draw(g); } catch (er) { acc = 0; if (window.console) console.warn("corsa", er); } const ib = body.querySelector(".it"); if (ib && R) { const hl = R.me.held || ""; if (ib.dataset.h !== hl) { ib.dataset.h = hl; ib.innerHTML = hl ? `🎁 ${esc(ITEMN[hl])}<small>${esc(ITEMD[hl])}</small>` : `🎁 Oggetto<small>raccogli 🎁 sulla pista</small>`; } } if (R && !R.over) RAF = requestAnimationFrame(loop); }; RAF = requestAnimationFrame(loop);
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
    const selK = KARTS[r.kart] || KARTS.classic;
    body.innerHTML = `<p class="sum">Corsa a squadre con i personaggi delle saghe: <b>guidi uno dei tuoi tre piloti</b>, gli altri due corrono da soli e i punti di tutti e tre si sommano contro la squadra rivale. Scia, turbo, abilità di ruolo e veicoli differenziati.</p><div class="sec">La tua squadra (dalla Squadra dei Sogni)</div><p class="sum">${team.map((c) => `<b>${esc(name(c.id))}</b> (${esc(ABIL[rlOf(c)][0])})`).join(" · ")}</p><div class="sec">Scegli il tuo Veicolo · Attivo: ${esc(selK.name)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:6px 0">${Object.values(KARTS).map((k) => `<button type="button" class="one" data-pick-kart="${k.id}" style="margin:0;min-height:80px;border:2px solid ${k.id === r.kart ? '#ffd23f' : '#4a3a6a'};background:${k.id === r.kart ? '#3a2254' : '#221a36'}"><div style="display:flex;justify-content:space-between;align-items:center"><b>${k.name}</b><span style="font-size:9px;font-weight:900;padding:2px 5px;border-radius:4px;background:#000;color:${k.id === r.kart ? '#ffd23f' : '#bbb'}">${k.tag}</span></div><small style="margin-top:3px;color:#c8b8ff">⚡ ${esc(k.perk)}</small><small style="color:#aaa;font-size:9px;margin-top:2px">Vel: ${k.stats.vel} · Scat: ${k.stats.acc} · Manov: ${k.stats.man} · Resist: ${k.stats.res}</small></button>`).join("")}</div><button type="button" class="one" data-kart="1" style="display:none">Cambia kart</button><div class="sec">Opzioni e Piste</div><button type="button" class="one" data-mode="1">${MODES[r.mode][0]}<small>${MODES[r.mode][1]}. Tocca per cambiare (vale per le gare singole, il campionato è sempre classico)</small></button><button type="button" class="one" data-view="1">👁️ Visuale: ${r.view === "rear" ? "da dietro (joystick)" : "dall'alto"}<small>tocca per cambiare: da dietro oppure dall'alto (la classica)</small></button><button type="button" class="one" data-fun="1">🎁 Oggetti, ostacoli e scorciatoie: ${r.fun ? "SÌ" : "NO"}<small>oggetti della tua saga, ostacoli per pista, scorciatoie (una sempre aperta, una con leva). Tocca per cambiare</small></button><button type="button" class="one" data-go="champ">🏆 Campionato dei Sogni<small>3 gare su 3 piste · ${r.champ ? "vinto " + r.champ + " volte" : "mai vinto"} · premi in monete</small></button>${TRACKS.map((t, i) => `<button type="button" class="one" data-t="${i}">🏁 ${esc(t.n)}<small>gara singola · 2 giri${r.best[t.id] ? " · record posto " + r.best[t.id] : ""}</small></button>`).join("")}`;
    body.querySelectorAll('[data-pick-kart]').forEach((b) => {
      b.onclick = () => { const x = load(); x.kart = b.dataset.pickKart; save(x); menu(); };
    });
    const dk = body.querySelector('[data-kart]');
    if (dk) dk.onclick = () => { const x = load(), ks = Object.keys(KARTS); x.kart = ks[(ks.indexOf(x.kart) + 1) % ks.length]; save(x); menu(); };
    body.querySelector('[data-mode]').onclick = () => { const x = load(), k = Object.keys(MODES); x.mode = k[(k.indexOf(x.mode) + 1) % k.length]; save(x); menu(); };
    body.querySelector('[data-view]').onclick = () => { const x = load(); x.view = x.view === "rear" ? "top" : "rear"; save(x); menu(); };
    body.querySelector('[data-fun]').onclick = () => { const x = load(); x.fun = !x.fun; save(x); menu(); };
    body.querySelector('[data-go="champ"]').onclick = () => champ(0, 0, { t: 0 });
    body.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => race(+b.dataset.t, 2, null)));
  }
  function setup(ti, lvl, seed, mode) {
    const T = TRACKS[ti], rand = seeded(seed != null ? seed : (Date.now() & 0xffff)), me = myTeam(), ss = [...new Set(S().CARDS.map((c) => c.saga))], th = ss[Math.floor(rand() * ss.length)], rv = rivals(rand, lvl, th);
    const rac = [];
    const userKart = load().kart;
    if (mode === "time") rac.push(mk(me[0], 0, 0, { human: true, m: 0.02, ai: 3, kart: userKart }));
    else if (mode === "duel") { rac.push(mk(me[0], 0, 0, { human: true, m: 0.02, ai: 3, kart: userKart })); rac.push(mk(rv[0], 1, 0, { ai: 4, m: 0.02 })); }
    else { me.forEach((c, i) => rac.push(mk(c, 0, i, { human: i === 0, m: 0.02, ai: 3, kart: userKart })));
    rv.forEach((c, i) => rac.push(mk(c, i < 3 ? 1 : 2, i, { ai: lvl, m: (lvl - 3) * 0.035 }))); }
    return { track: T, racers: rac, seed: Math.floor(rand() * 1e6), mode: mode || "classic" };
  }
  function race(ti, lvl, st) {
    const mode = st ? "classic" : load().mode, cfg = setup(ti, lvl, null, mode); cfg.view = load().view; cfg.fun = load().fun; cfg.title = st ? `🏆 Campionato · gara ${st.n + 1}/3` : MODES[mode][0].split(" ")[0] + " " + TRACKS[ti].n; cfg.onEnd = (G) => results(G, ti, lvl, st); raceUI(cfg);
  }
  function champ(n, tot, st) { race(n, 1 + n, { n, tot: st.tot || tot || 0, pts: st.pts || 0 }); }
  function results(G, ti, lvl, st) {
    const body = shell("🏁 Risultati"), order = G.order, tp = G.pts[0] || 0, rp = G.pts[1] || 0, md = G.cfg.mode || "classic", win = md === "duel" ? G.myPos === 1 : tp > rp, a = load(), L = [];
    const nm = ["Tua squadra", "Squadra rivale", "Indipendenti"];
    body.innerHTML = `<div class="crRes"><h3>${md === "time" ? "⏱️ " + (G.me.finT / 60).toFixed(1) + " s" : G.myPos + "° posto"}</h3>${md === "time" ? "" : md === "duel" ? `<p class="sum">${win ? "🏅 Testa a testa vinto" : "Il rivale ti ha battuto"}</p>` : `<p class="sum">Squadra: <b>${tp}</b> punti contro <b>${rp}</b> dei rivali ${win ? "· 🏅 gara di squadra vinta" : ""}</p>`}</div><table class="crTab">${order.map((r, i) => `<tr class="${r.human ? "me" : ""}"><td>${i + 1}°</td><td>${esc(r.n)}</td><td style="color:${r.col}">${nm[r.team]}</td><td>${PTS[i] || 0} pt</td></tr>`).join("")}</table>`;
    let coins = Math.max(0, 14 - G.myPos * 2) + (win ? 12 : 0);
    if (md === "time") { const sec = +(G.me.finT / 60).toFixed(1), old = a.rec[TRACKS[ti].id], nr = !old || sec < old; if (nr) a.rec[TRACKS[ti].id] = sec; coins = nr ? 10 : 2; L.push(`Record della pista: ${Math.min(old || sec, sec)} s${nr ? " · 🏅 nuovo record!" : ""}`); } safe(() => window.addCoins(coins), 0); L.push(`+${coins} monete.`);
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
  window.__corsa = { open: menu, close, state: () => R, tick, press, begin, setup, build, TRACKS, ABIL, KARTS, pos, at, _fast: (v) => { if (R) R.fast = !!v; }, pause: (v) => { PAUSE = !!v; }, race, load, save, mk };
})();
