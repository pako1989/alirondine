// js/eroi.js - «Calcio d'Azione Eroi»: partita a squadre (3v3 o 5v5 più i portieri), anche in orizzontale (landscape), con i personaggi della Squadra dei Sogni (js/sogni.js).
// Vista 2,5D con sponde (stile calcetto), joystick analogico (js/stick.js), Passa/Contrasta (scivolata senza palla), Tira (tieni premuto per caricare,
// su/giù per mirare), Scatto con fiato e Abilità di ruolo pagata con la Grinta di squadra (si carica con passaggi, rubate e possesso):
// Tiro Fuoco, Regia, Muro, Magnete. Super tiri firmati per saga (curva, zig-zag, invisibile, ghiaccio, fulmine...). Campo grande con camera che segue la palla. Grafica a doppia risoluzione: tribune, tabelloni, reti, figure animate con il ritratto come testa.
(function () {
  "use strict";
  if (window.__eroi) return;
  const KEY = "ali-di-rondine.eroi", PR = 9, MX = 16, OY = 24, SS = 2;
  let W = 380, H = 230, TOP = 10, BOT = 220, GY0 = 88, GY1 = 142, CY = 115, DUR = 80 * 60, CW = W + MX * 2, CH = H + OY + 12, NP = 3, BXW = 44, BXH = 110;
  function setField(n) { NP = n === 5 ? 5 : 3; if (NP === 5) { W = 620; H = 270; DUR = 110 * 60; BXW = 58; BXH = 150; } else { W = 380; H = 230; DUR = 80 * 60; BXW = 44; BXH = 110; } TOP = 10; BOT = H - 10; CY = H / 2; const gm = NP === 5 ? 30 : 27; GY0 = CY - gm; GY1 = CY + gm; CW = W + MX * 2; CH = H + OY + 12; }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const ABIL = { A: ["Tiro Fuoco", "tiro incontenibile", 40], C: ["Regia", "passaggio magico al compagno più avanti", 35], D: ["Muro", "ferma tutti i vicini e ruba palla", 40], P: ["Magnete", "attira la palla vicina", 30] };
  const ADS = [["RONDINE FC", "#c8301e"], ["PORTO LUCE", "#1e6ac8"], ["BANCA COSTA", "#1e8a4a"], ["RADIO 98.6", "#8a3ac8"], ["FORNO DEL MOLO", "#c8901e"], ["TRATTORIA PINA", "#c83a7a"]];
  // Super tiri firmati: ogni saga ha il suo effetto sulla palla (fx) e il suo nome. fx: fire, thunder, curve, zig, spiral, vanish, ice, change, drill
  const FXD = (window.__supers || { FXD: {} }).FXD;
  const supOf = (p) => (window.__supers ? window.__supers.of(p.id) : { fx: "fire", name: "Tiro Fuoco", col: "#ff8a30", saga: "" });
  let LAY = null, OV = null, BACK = null, M = null, RAF = 0, PAUSE = false, STATIC = null;
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { cup: r.cup | 0, wins: r.wins | 0, goals: r.goals | 0, mode: r.mode === 5 ? 5 : 3, tele: r.tele !== false, combo: r.combo !== false }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  const name = (id) => safe(() => S().name(id), id);
  function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  // ------------------------------------------------------------ giocatori
  const formation = (team, i) => { const F = NP === 5 ? [[130, CY - 70], [130, CY + 70], [225, CY], [285, CY - 60], [285, CY + 60]] : [[120, CY - 45], [120, CY + 45], [175, CY]], f = F[i]; return f ? (team ? [W - f[0], f[1]] : f) : [0, 0]; };
  function mk(card, team, i, o) {
    o = o || {}; const e = safe(() => S().eff(card), card), m = 1 + (o.m || 0), tr = e.at >= e.df && e.at >= e.te ? "at" : e.df >= e.te ? "df" : "te";
    const role = ABIL[card.role] ? card.role : { at: "A", te: "C", df: "D" }[tr], h = formation(team, i);
    return { id: card.id, saga: card.saga || "", n: name(card.id), team, i, role, x: h[0], y: h[1], vx: 0, vy: 0, fx: team ? -1 : 1, fy: 0, home: h, spd: (1.5 + e.te / 150) * m, shoot: 5.2 + (e.at * m) / 36, dribble: e.te * m, tack: e.df * m, stun: 0, keeper: false, col: team ? "#e8453a" : "#2f86f0", col2: team ? "#7a1a14" : "#14407a", kdf: e.df * m, hold: 0, slide: 0, run: 0, num: i + 7, skin: 0 };
  }
  function mkKeeper(team, card, o) { const k = mk(card || { id: "gk", at: 50, df: 70, te: 50, role: "P" }, team, NP, o); k.keeper = true; k.x = team ? W - 16 : 16; k.y = CY; k.home = [k.x, CY]; k.n = card ? k.n : "Portiere"; k.col = team ? "#e8d030" : "#3ac878"; k.col2 = "#1a1a1a"; k.num = 1; return k; }
  function begin(cfg) {
    setField(cfg.n || 3);
    const P = cfg.mine.map((c, i) => mk(c, 0, i, { m: 0.02 })).concat([mkKeeper(0, cfg.myKeeper, { m: 0 })]), Q = cfg.foes.map((c, i) => mk(c, 1, i, { m: (cfg.lvl - 3) * 0.04 })).concat([mkKeeper(1, cfg.foeKeeper, { m: (cfg.lvl - 3) * 0.04 })]);
    M = { cfg, opt: cfg.fast ? { tele: false, combo: cfg.combo !== false } : load(), cm: null, cmCd: 0, lvl: cfg.lvl, p: P, q: Q, all: P.concat(Q), ball: { x: W / 2, y: H / 2, vx: 0, vy: 0, owner: null, cool: 0, kick: 0, magic: 0, rot: 0, tr: [] }, score: [0, 0], t: -150, extra: false, ctl: P[2], inp: {}, edge: {}, hold: {}, chg: 0, stam: 100, stick: null, energy: [30, 30], fx: [], parts: [], goalT: 0, over: null, r: cfg.seed != null ? seeded(cfg.seed) : Math.random, fast: !!cfg.fast, lastScorer: -1, stat: { shots: [0, 0], saves: [0, 0] }, poss: [0, 0], shake: 0, scorer: null, cam: -MX, vw: Math.min(CW, 412) };
    STATIC = null; kickoff(0); return M;
  }
  function kickoff(team) {
    M.all.forEach((p) => { p.x = p.team === team && !p.keeper ? p.home[0] + (p.team ? -20 : 20) * (p.i === 2 ? 1 : 0.4) : p.home[0]; p.y = p.home[1]; p.vx = p.vy = 0; p.stun = 0; p.slide = 0; p.fx = p.team ? -1 : 1; p.fy = 0; });
    const b = M.ball; b.x = W / 2; b.y = H / 2; b.vx = b.vy = 0; b.owner = null; b.cool = 0; b.magic = 0; b.tr = []; M.ctl = M.p[2]; M.goalT = 0; M.chg = 0; const k = M.all.find((p) => p.team === team && p.i === 2); k.x = W / 2 - (team ? -14 : 14); k.y = H / 2; b.owner = k; k.hold = 0;
  }
  const mate = (p) => (p.team ? M.q : M.p), foe = (p) => (p.team ? M.p : M.q), gx = (team) => (team ? 0 : W);
  function fxAdd(x, y, t, c) { if (!M.fast) M.fx.push({ x, y, t, c, l: 36 }); }
  // telecronaca: una riga di commento in basso (opzione nel menu) + tiro combinato (due compagni vicini, opzione nel menu)
  const pickL = (a) => a[Math.floor(M.r() * a.length)];
  function say(txt, pri) { if (M.fast || !M.opt.tele) return; pri = pri || 0; if (M.cm && M.cm.l > 90 && M.cm.pri > pri) return; M.cm = { t: txt, l: 190, pri }; }
  function sayCd(txt, cd) { if (M.cmCd > 0) return; M.cmCd = cd || 150; say(txt, 0); }
  function comboOf(p) {
    if (!M.opt.combo || p.team !== 0 || M.ball.owner !== p || !(p.role === "A" || p.role === "D" || p.role === "P")) return null; const cost = p.role === "A" ? 40 : 50; if (M.energy[0] < cost + 25) return null;
    let best = null, bd = 85; mate(p).forEach((m) => { if (m === p || m.keeper || m.stun > 0) return; const d = dist(m, p); if (d < bd) { bd = d; best = m; } }); return best;
  }
  function burst(x, y, n, cols, sp, up) { if (M.fast) return; for (let i = 0; i < n; i++) { const a = M.r() * 6.283, v = (0.4 + M.r()) * sp; M.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (up || 0), l: 30 + M.r() * 30, c: cols[Math.floor(M.r() * cols.length)], s: 1.5 + M.r() * 2 }); } }
  // ------------------------------------------------------------ azioni
  function shoot(p, o) {
    const b = M.ball; if (b.owner !== p) return; o = o || {}; const tx = gx(p.team), aim = o.aim != null ? o.aim : CY, ty = Math.max(GY0 + 5, Math.min(GY1 - 5, aim));
    const dx = tx - p.x, dy = ty - p.y, l = Math.hypot(dx, dy) || 1, sp = (o.power || p.shoot) * (o.mult || 1) * (o.f || 1), err = (o.exact ? 0 : ((100 - Math.min(99, p.dribble)) / 100) * 0.12 * (o.mult ? 0.2 : 1)) * (o.f > 1.25 ? 1.6 : 1) * (M.r() - 0.5) * 2;
    const c = Math.cos(err), s = Math.sin(err); b.vx = ((dx / l) * c - (dy / l) * s) * sp; b.vy = ((dx / l) * s + (dy / l) * c) * sp; b.owner = null; b.cool = 14; b.kick = p.team; b.shotBy = p; b.big = !!o.mult; b.sup = null; b.twin = o.twin || null; if (o.sup) startSup(b, o.sup); M.stat.shots[p.team]++; p.hold = 0; fxAdd(p.x, p.y - 30, o.mult ? "🔥" : "tiro!", "#ffd23f"); burst(p.x, p.y, 6, ["#fff", "#cfe"], 1.2); if (o.mult) M.shake = 8;
  }
  function startSup(b, sp) {
    b.sup = sp.fx; b.supCol = sp.col; b.age = 0; b.big = true; b.cs = M.r() < 0.5 ? -1 : 1; const mul = { thunder: 1.3, drill: 1.1, change: 0.45 }[sp.fx] || 1; b.vx *= mul; b.vy *= mul;
    if (sp.fx === "curve") { const a = -b.cs * 0.26, c = Math.cos(a), s = Math.sin(a), x = b.vx, y = b.vy; b.vx = x * c - y * s; b.vy = x * s + y * c; }
  }
  function flySup(b) {
    b.age++; const a = b.age, v = Math.hypot(b.vx, b.vy) || 1, f = b.sup;
    if (f === "curve" && a < 24) { const r = b.cs * 0.0225, c = Math.cos(r), s = Math.sin(r), x = b.vx, y = b.vy; b.vx = x * c - y * s; b.vy = x * s + y * c; }
    if (f === "change" && a === 16) { b.vx *= 2.9; b.vy *= 2.9; fxAdd(b.x, b.y - 10, "SCATTO!", b.supCol); burst(b.x, b.y, 10, ["#fff", b.supCol], 2); }
    if (f === "zig" || f === "spiral") { const amp = f === "zig" ? 1.7 : 2.5, fr = f === "zig" ? 0.5 : 0.8, k = Math.cos(a * fr) * amp; b.x += (-b.vy / v) * k; b.y += (b.vx / v) * k; }
    if (f === "ice") M.all.forEach((q) => { if (!q.keeper && q.team !== b.kick && q.stun <= 0 && dist(q, b) < 14) { q.stun = 70; fxAdd(q.x, q.y - 30, "GELATO!", "#9ad8ff"); burst(q.x, q.y - 10, 10, ["#cfefff", "#7ac8ff"], 1.4); } });
    if (!M.fast && a % 2 === 0) M.parts.push({ x: b.x, y: b.y, vx: (M.r() - 0.5) * 0.6, vy: (M.r() - 0.5) * 0.6, l: 22, c: f === "thunder" && a % 4 === 0 ? "#fff" : b.supCol, s: 2.6 });
  }
  function pass(p, to, o) { const b = M.ball; if (b.owner !== p || !to) return; o = o || {}; const dx = to.x + to.vx * 8 - p.x, dy = to.y + to.vy * 8 - p.y, l = Math.hypot(dx, dy) || 1, sp = o.fast ? 8 : 4.8 + Math.min(1.8, l / 90); b.vx = (dx / l) * sp; b.vy = (dy / l) * sp; b.owner = null; b.cool = 12; b.kick = p.team; b.shotBy = null; b.to = to; b.sup = null; b.big = false; b.magic = o.magic || 0; p.hold = 0; M.energy[p.team] = Math.min(100, M.energy[p.team] + 6); }
  function bestMate(p, dirx, diry) {
    let best = null, bs = -1e9; mate(p).forEach((m) => { if (m === p || m.keeper) return; const dx = m.x - p.x, dy = m.y - p.y, l = Math.hypot(dx, dy) || 1; let s = -l * 0.3; if (dirx || diry) s += ((dx / l) * dirx + (dy / l) * diry) * 60; else s += ((dx * (p.team ? -1 : 1)) / l) * 25; if (s > bs) { bs = s; best = m; } }); return best;
  }
  function tackle(p) {
    const b = M.ball, o = b.owner; if (!o || o.team === p.team || dist(p, o) > 24) return slide(p);
    return steal(p, o, 0);
  }
  function steal(p, o, bonus) {
    const b = M.ball, prob = Math.max(0.2, Math.min(0.88, 0.45 + (p.tack - o.dribble) / 220 + bonus)); if (M.r() < prob) { b.owner = null; b.cool = 12; b.vx = (M.r() - 0.5) * 3 + p.fx * 1.5; b.vy = (M.r() - 0.5) * 3 + p.fy * 1.5; M.energy[p.team] = Math.min(100, M.energy[p.team] + 12); fxAdd(p.x, p.y - 30, "rubata!", "#7ad87a"); sayCd(pickL([`${p.n} ruba palla a ${o.n}!`, `Che scivolata di ${p.n}!`, `${o.n} perde il pallone, lo prende ${p.n}.`]), 170); burst(o.x, o.y, 8, ["#3a9a40", "#8ad87a", "#6a4a2a"], 1.4); p.hold = 0; return true; }
    p.stun = 20; fxAdd(p.x, p.y - 30, "mancata", "#aaa"); return false;
  }
  function slide(p) { if (p.slide > 0 || p.stun > 0) return false; const l = Math.hypot(p.fx, p.fy) || 1; p.slide = 14; p.sx = (p.fx / l) * 3.6; p.sy = (p.fy / l) * 3.6; return true; }
  function ability(p) {
    const A = ABIL[p.role], t = p.team, b = M.ball; if (!A || p.stun > 0) return false;
    const own = b.owner === p, shot = own && (p.role === "A" || p.role === "D" || p.role === "P"), cost = shot ? (p.role === "A" ? 40 : 50) : A[2];
    if (M.energy[t] < cost) return false; if (p.role === "C" && !own) return false; if (p.role === "A" && !own) return false;
    const pa = shot ? comboOf(p) : null; M.energy[t] -= cost + (pa ? 25 : 0);
    if (shot) { const sp = supOf(p); if (pa) { const sp2 = supOf(pa); cutin(p, "TIRO COMBINATO", sp.col, p.n + " + " + pa.n, pa); fxAdd(p.x, p.y - 36, "COMBO!", "#ffd23f"); fxAdd(pa.x, pa.y - 30, "+" + sp2.name, sp2.col); say(pickL([`${p.n} e ${pa.n} insieme: TIRO COMBINATO!`, `Due campioni, un solo tiro: ${p.n} e ${pa.n}!`, `${pa.n} lo serve, ${p.n} lo scarica: combinato!`]), 3); shoot(p, { aim: CY, mult: (p.role === "A" ? 1.75 : 1.5) * 1.3, power: p.shoot, sup: sp, twin: sp2.col, exact: pa.role === "C" }); return true; }
      cutin(p, sp.name, sp.col, FXD[sp.fx]); fxAdd(p.x, p.y - 36, sp.name.toUpperCase() + "!", sp.col); say(pickL([`${p.n} carica il ${sp.name}!`, `Attenzione: ${p.n} ha un colpo speciale!`, `${p.n} lascia partire il ${sp.name}!`]), 2); shoot(p, { aim: CY, mult: p.role === "A" ? 1.75 : 1.5, power: p.shoot, sup: sp }); return true; }
    cutin(p, A[0]);
    if (p.role === "C") { const m = mate(p).filter((x) => x !== p && !x.keeper).sort((a, c) => (t ? a.x - c.x : c.x - a.x))[0]; pass(p, m, { fast: true, magic: 70 }); }
    else if (p.role === "D") { foe(p).forEach((o) => { if (dist(o, p) < 75) { o.stun = Math.max(o.stun, 45); if (b.owner === o) { b.owner = p; p.hold = 0; } } }); fxAdd(p.x, p.y - 30, "MURO!", "#ffd23f"); M.fx.push({ ring: 1, x: p.x, y: p.y, l: 20 }); burst(p.x, p.y, 16, ["#ffd23f", "#fff"], 2.2); M.shake = 6; }
    else { b.owner === null && dist(b, p) < 120 && (b.owner = p, b.vx = b.vy = 0); fxAdd(p.x, p.y - 30, "MAGNETE!", "#9ad8ff"); M.fx.push({ ring: 1, x: p.x, y: p.y, l: 20 }); }
    return true;
  }
  function cutin(p, ab, col, sub, p2) { if (M.fast || !OV) return; const w = OV.querySelector(".erStage"); if (!w) return; const c = document.createElement("div"); c.className = "erCut"; const u = safe(() => S().port(p.id), null); const u2 = p2 ? safe(() => S().port(p2.id), null) : null; c.innerHTML = `${u ? `<img alt="" src="${u}">` : ""}<div><b>${esc(ab)}</b><span>${p2 ? "" : esc(p.n) + (sub ? " · " : "")}${sub ? esc(sub) : ""}</span></div>${u2 ? `<img alt="" src="${u2}">` : ""}`; if (col) { c.style.borderColor = col; const im = c.querySelector("img"); if (im) im.style.borderColor = col; c.querySelector("b").style.color = col; } w.appendChild(c); M.stop = 30; setTimeout(() => c.remove(), 900); }
  // ------------------------------------------------------------ AI
  function aiMove(p) {
    const b = M.ball, atk = (b.owner && b.owner.team === p.team) || (!b.owner && b.kick === p.team), own = b.owner === p, L = M.lvl, sp = p.spd * (0.8 + L * 0.04), tgx = gx(p.team), out = { x: p.x, y: p.y, s: sp };
    if (p.keeper) {
      const ex = p.team ? W - 14 : 14; let ty = b.y * 0.55 + CY * 0.45, tx = ex + (p.team ? -1 : 1) * Math.min(26, Math.abs(b.x - ex) / 6);
      const toward = p.team ? b.vx > 1.2 : b.vx < -1.2; if (!b.owner && toward && Math.abs(b.vx) > 2) { const t = (ex - b.x) / b.vx; if (t > 0 && t < 40) ty = b.y + b.vy * t; out.s = p.spd * 1.7; }
      out.x = tx; out.y = Math.max(GY0 + 3, Math.min(GY1 - 3, ty)); out.s = Math.max(out.s, p.spd * 1.2);
      if (b.owner === p) { const m = mate(p).filter((x) => !x.keeper)[0]; pass(p, bestMate(p, 0, 0) || m); }
      if (!b.owner && dist(b, p) < 44 && Math.abs(b.vx) < 3) { out.x = b.x; out.y = b.y; }
      return out;
    }
    if (own) {
      const goalD = Math.abs(p.x - tgx);
      if (goalD < W * 0.33 && M.r() < 0.05 + L * 0.012) { shoot(p, { aim: CY + (M.r() - 0.5) * 50, f: 0.95 + M.r() * 0.3 }); return out; }
      const pressed = foe(p).some((o) => !o.keeper && dist(o, p) < 22);
      if (pressed && M.r() < 0.05 + L * 0.01) { const m = bestMate(p, 0, 0); if (m) { pass(p, m); return out; } }
      if (M.energy[p.team] > 60 && M.r() < 0.004 * L) ability(p);
      let ty = p.y; const blockers = foe(p).filter((o) => !o.keeper && Math.abs(o.x - p.x) < 60 && (p.team ? o.x < p.x : o.x > p.x)); if (blockers.length) { const o = blockers[0]; ty = p.y + (o.y > p.y ? -1 : 1) * 40; } else ty = p.y + (CY - p.y) * 0.3;
      out.x = tgx; out.y = Math.max(TOP + 10, Math.min(BOT - 10, ty)); out.s = sp * 0.93; return out;
    }
    const cand = mate(p).filter((x) => !x.keeper).sort((a, c) => dist(a, b) - dist(c, b)), recv = b.to === p && !b.owner, chaser = recv || cand[0] === p || (cand[1] === p && !atk && dist(p, b) < 50);
    if (chaser) { out.x = b.x + b.vx * 6; out.y = b.y + b.vy * 6; if (b.owner && b.owner.team !== p.team && dist(p, b.owner) < 22 && M.r() < 0.02 + L * 0.008) tackle(p); if (b.owner && b.owner.team !== p.team && dist(p, b.owner) < 40 && p.slide <= 0 && M.r() < 0.004 * L) slide(p); if (M.energy[p.team] > 70 && p.role === "D" && b.owner && dist(p, b.owner) < 60 && M.r() < 0.004 * L) ability(p); if (M.energy[p.team] > 70 && p.role === "P" && !b.owner && M.r() < 0.003 * L) ability(p); out.s = sp * 1.1; return out; }
    if (atk) { const o = b.owner || { x: b.x, y: b.y }; const fw = p.team ? -1 : 1, lane = (p.home[1] - CY) * 1.2; out.x = Math.max(30, Math.min(W - 30, o.x + fw * (50 + p.i * 14))); out.y = Math.max(TOP + 16, Math.min(BOT - 16, o.y * 0.4 + CY * 0.6 + lane)); out.s = sp * 0.85; return out; }
    const own0 = p.team ? W : 0, fw = p.team ? -1 : 1, hx = own0 + (p.team ? -1 : 1) * 0 + (b.x - own0) * 0.5 + fw * -0; out.x = Math.max(30, Math.min(W - 30, Math.min(Math.abs(b.x - own0), (120 + p.i * 20) * (W / 380)) * (p.team ? -1 : 1) + own0)); out.y = p.home[1] + (b.y - CY) * 0.35; out.s = sp * 0.8; return out;
  }
  function moveTo(p, t, s) { const dx = t.x - p.x, dy = t.y - p.y, l = Math.hypot(dx, dy); if (l < 2) { p.vx *= 0.5; p.vy *= 0.5; return; } p.vx += ((dx / l) * s - p.vx) * 0.3; p.vy += ((dy / l) * s - p.vy) * 0.3; }
  // ------------------------------------------------------------ simulazione
  function inputVec() {
    const st = M.stick && M.stick.v; if (st && st.m > 0) return { x: st.x, y: st.y, m: st.m };
    const dx = (M.inp.r ? 1 : 0) - (M.inp.l ? 1 : 0), dy = (M.inp.d ? 1 : 0) - (M.inp.u ? 1 : 0), l = Math.hypot(dx, dy); return l ? { x: dx / l, y: dy / l, m: 1 } : { x: 0, y: 0, m: 0 };
  }
  function tick() {
    if (!M || M.over) return; if (M.stop > 0) { M.stop--; return; } M.fx = M.fx.filter((x) => --x.l > 0); M.parts = M.parts.filter((q) => { q.x += q.vx; q.y += q.vy; q.vy += 0.06; return --q.l > 0; }); if (M.shake > 0) M.shake--;
    if (M.goalT > 0) { if (M.goalT % 4 === 0) burst(M.scorer ? M.scorer.x : W / 2, 60, 5, ["#ffd23f", "#ff5a5a", "#5ad8ff", "#fff"], 2.4, 1.2); if (M.goalT % 6 === 0 && M.scorer) burst(M.scorer.x, M.scorer.y - 20, 4, [look(M.scorer).col, "#fff"], 1.6, 1.4); if (--M.goalT === 0) kickoff(M.lastScorer ? 0 : 1); return; }
    if (M.cm) M.cm.l--; if (M.cmCd > 0) M.cmCd--;
    M.t++; if (M.t === 2) say(pickL(["Si parte! Calcio d'inizio.", "Fischio d'inizio: si gioca!", "Ci siamo: parte la partita!"]), 1); else if (M.t === Math.floor(DUR / 2)) say("Siamo a metà: tutto ancora da decidere.", 1); else if (M.t === DUR - 600 && !M.extra) say("Ultimi dieci secondi: ora o mai più!", 4); else if (M.t > 0 && M.t % 700 === 350 && !M.cm) say(pickL(["Ritmo alto, il campo scotta.", "Si gioca a viso aperto.", "Il pubblico canta: che atmosfera!"]), 0);
    if (M.t < 0) return; const b = M.ball, e = M.edge; M.edge = {}; M.energy[0] = Math.min(100, M.energy[0] + 0.03); M.energy[1] = Math.min(100, M.energy[1] + 0.03);
    if (b.owner) { M.poss[b.owner.team]++; if (M.t % 40 === 0) M.energy[b.owner.team] = Math.min(100, M.energy[b.owner.team] + 0.6); }
    const fld = M.p.filter((x) => !x.keeper); if (b.owner && b.owner.team === 0 && !b.owner.keeper) M.ctl = b.owner; else if (M.t % 12 === 0) { const nb = fld.slice().sort((a, c) => dist(a, b) - dist(c, b))[0]; if (nb !== M.ctl && dist(nb, b) + 14 < dist(M.ctl, b)) M.ctl = nb; }
    // carica del tiro: si tiene premuto, al rilascio parte
    const bh = !!(M.hold.b || M.inp.bh); if (bh && M.ctl && b.owner === M.ctl) M.chg = Math.min(70, M.chg + 1); else if (!bh && M.chg > 0) { const p = M.ctl, v = inputVec(); if (p && b.owner === p) shoot(p, { aim: CY + v.y * 30, f: 0.78 + 0.55 * Math.min(1, M.chg / 40) }); M.chg = 0; } else if (!bh) M.chg = 0; else M.chg = 0;
    const sprint = !!M.hold.s && M.stam > 0;
    M.all.forEach((p) => {
      if (p.stun > 0) { p.stun--; p.vx *= 0.8; p.vy *= 0.8; }
      else if (p.slide > 0) { p.slide--; p.vx = p.sx; p.vy = p.sy; const o = b.owner; if (o && o.team !== p.team && dist(p, o) < 16 && p.slide > 1) { p.slide = 0; steal(p, o, 0.22); } if (p.slide === 0) p.stun = Math.max(p.stun, 14); if (!b.owner && dist(p, b) < 11 && b.cool <= 0) { b.owner = p; p.hold = 0; } }
      else if (p === M.ctl && !M.cfg.auto) {
        const v = inputVec(), s = p.spd * (b.owner === p ? 0.94 : 1) * (sprint && v.m ? 1.38 : 1) * Math.min(1, v.m * 1.15);
        p.vx += ((v.m ? v.x * s : 0) - p.vx) * (v.m ? 0.3 : 0.4); p.vy += ((v.m ? v.y * s : 0) - p.vy) * (v.m ? 0.3 : 0.4); if (v.m) { p.fx = v.x; p.fy = v.y; if (sprint) M.stam = Math.max(0, M.stam - 0.85); }
        if (e.a) { if (b.owner === p) pass(p, bestMate(p, v.x, v.y)); else tackle(p); } if (e.c) ability(p);
      } else { const t = aiMove(p); moveTo(p, t, t.s); const sv = Math.hypot(p.vx, p.vy); if (sv > 0.3) { p.fx = p.vx / sv; p.fy = p.vy / sv; } }
      p.x += p.vx; p.y += p.vy; p.x = Math.max(PR + 2, Math.min(W - PR - 2, p.x)); p.y = Math.max(TOP + PR, Math.min(BOT - PR, p.y)); { const sv2 = Math.hypot(p.vx, p.vy), L = look(p); p.run += sv2 * 0.22 * L.gait; if (!M.fast && sv2 > 1.15 && L.fx && M.t % 3 === 0) M.parts.push({ x: p.x - p.vx * 2, y: p.y - 3, vx: -p.vx * 0.15, vy: -0.2, l: 16, c: L.col, s: 2 }); }
      if (p.keeper) p.x = Math.max(p.team ? W - 60 : 8, Math.min(p.team ? W - 8 : 60, p.x));
    });
    if (!sprint || !M.hold.s) M.stam = Math.min(100, M.stam + 0.4);
    for (let i = 0; i < M.all.length; i++) for (let j = i + 1; j < M.all.length; j++) { const a = M.all[i], c = M.all[j], d = dist(a, c); if (d < PR * 1.8 && d > 0.01) { const k = (PR * 1.8 - d) / 2 / d; a.x += (a.x - c.x) * k; a.y += (a.y - c.y) * k; c.x -= (a.x - c.x) * k; c.y -= (a.y - c.y) * k; } }
    if (b.cool > 0) b.cool--; if (b.magic > 0) b.magic--;
    if (b.owner) { const o = b.owner, l = Math.hypot(o.fx, o.fy) || 1; b.x = o.x + (o.fx / l) * (PR + 3); b.y = o.y + (o.fy / l) * (PR + 3); b.vx = b.vy = 0; o.hold++; if (o.keeper && o.hold > 60) pass(o, bestMate(o, 0, 0)); if (o.hold > 400) o.hold = 0;
      foe(o).forEach((q) => { if (!q.keeper && q.stun <= 0 && dist(q, o) < PR * 2 + 1 && M.r() < 0.012 + (q.tack - o.dribble) / 9000) { b.owner = q; b.cool = 8; q.hold = 0; } });
    } else {
      if (b.sup) flySup(b); b.x += b.vx; b.y += b.vy; const sp0 = Math.hypot(b.vx, b.vy), fr = sp0 > 6 ? 0.995 : 0.985; b.vx *= fr; b.vy *= fr; b.rot += sp0 * 0.25; if ((sp0 > 5.5 || b.sup) && !M.fast) { b.tr.push([b.x, b.y]); if (b.tr.length > 7) b.tr.shift(); } else if (b.tr.length) b.tr.shift();
      if (b.y < TOP + 3) { b.y = TOP + 3; b.vy = Math.abs(b.vy) * 0.8; } if (b.y > BOT - 3) { b.y = BOT - 3; b.vy = -Math.abs(b.vy) * 0.8; }
      const inMouth = b.y > GY0 && b.y < GY1;
      if (b.x < 2 && !inMouth) { b.x = 2; b.vx = Math.abs(b.vx) * 0.8; } if (b.x > W - 2 && !inMouth) { b.x = W - 2; b.vx = -Math.abs(b.vx) * 0.8; }
      [M.p[NP], M.q[NP]].forEach((k) => { const sp = Math.hypot(b.vx, b.vy), toward = k.team ? b.vx > 0.5 : b.vx < -0.5; if (toward && sp > 2.5 && b.kick !== k.team && dist(b, k) < 20 && k.stun <= 0) { const big = b.big ? 0.15 : 1, pr = Math.max(0.1, Math.min(0.85, (0.5 + k.kdf / 260 - sp / 22)) * big); if (M.r() < pr) { M.stat.saves[k.team]++; b.vx = (k.team ? -1 : 1) * (1.5 + M.r()); b.vy = (M.r() - 0.5) * 3; b.kick = -1; b.big = false; b.sup = null; fxAdd(k.x, k.y - 30, "PARATA!", "#9ad8ff"); say(pickL([`${k.n} dice di no!`, `Che parata di ${k.n}!`, `${k.n} si allunga e salva tutto!`]), 2); burst(b.x, b.y, 8, ["#fff", "#9ad8ff"], 1.6); if (M.r() < 0.5) { b.owner = k; k.hold = 0; } } else k.stun = 6; } });
      if (Math.hypot(b.vx, b.vy) > 4 && b.magic <= 0) M.all.forEach((p) => { if (!p.keeper && p.team !== b.kick && p.stun <= 0 && dist(p, b) < PR + 2 && M.r() < 0.35 + (p.tack - 50) / 400 && !b.big) { b.vx *= -0.4; b.vy = (M.r() - 0.5) * 4; b.kick = p.team; fxAdd(p.x, p.y - 30, "blocco", "#ccc"); } });
      if (b.cool <= 0 && Math.hypot(b.vx, b.vy) < 4.2) { let best = null, bd = PR + 4; M.all.forEach((p) => { if (p.stun > 0) return; const d = dist(p, b); if (d < bd) { bd = d; best = p; } }); if (best) { b.owner = best; best.hold = 0; b.kick = -1; b.big = false; b.sup = null; } }
      else if (b.magic > 0 && b.to && dist(b.to, b) < PR + 3) { b.owner = b.to; b.to.hold = 0; b.magic = 0; }
      if (b.x < -2 && inMouth) goal(1); else if (b.x > W + 2 && inMouth) goal(0);
    }
    if (!M.extra) {
      if (M.t >= DUR) {
        if (M.score[0] === M.score[1]) {
          M.extra = true;
          M.t = DUR;
          say("⚽ TEMPI SUPPLEMENTARI: GOLDEN GOL! Chi segna il prossimo gol vince!", 10);
          fxAdd(W / 2, 80, "GOLDEN GOL!", "#ffd23f");
          M.shake = 16;
          kickoff(0);
        } else finish();
      }
    } else if (M.t >= DUR + 1800) {
      if (M.score[0] === M.score[1]) {
        const s0 = M.stat.shots[0], s1 = M.stat.shots[1];
        if (s0 > s1) M.score[0]++;
        else if (s1 > s0) M.score[1]++;
        else M.score[M.r() < 0.5 ? 0 : 1]++;
        say("Fischio finale: spareggio deciso ai calci di rigore!", 10);
      }
      finish();
    }
  }
  function goal(team) {
    M.score[team]++; M.lastScorer = team; M.goalT = M.fast ? 1 : 130; M.scorer = M.ball.shotBy || M.all.find((p) => p.team === team && !p.keeper);
    const sc = M.scorer ? M.scorer.n : ""; const n = `${M.score[0]}-${M.score[1]}`;
    if (M.extra) {
      say(team === 0 ? `✨ GOLDEN GOL DI ${sc}! VITTORIA! ${n}` : `Ahi! Golden gol di ${sc}... sconfitta. ${n}`, 10);
      fxAdd(W / 2, 80, "GOLDEN GOL!", "#ffd23f");
      M.shake = 18; M.flash = 20;
    } else {
      say(team === 0 ? pickL([`GOOOL! ${sc} la mette dentro! ${n}`, `${sc} non perdona: è rete! ${n}`, `Che gol di ${sc}! ${n}`]) : pickL([`Gol avversario: ${sc} ci punisce. ${n}`, `Rete per loro, ${sc} è freddissimo. ${n}`, `Ahi, ${sc} trova la porta. ${n}`]), 5);
    }
    M.ball.owner = null; M.ball.vx = M.ball.vy = 0; M.ball.tr = [];
    fxAdd(W / 2, 100, "GOL!", "#ffd23f"); M.shake = 14; M.flash = 14;
    burst(team ? 8 : W - 8, CY, 30, ["#ffd23f", "#ff5a5a", "#5ad8ff", "#fff"], 3.2, 1);
    if (M.extra) finish();
  }
  function finish() {
    if (M.over) return;
    const s = M.score;
    M.over = s[0] > s[1] ? "win" : s[0] < s[1] ? "lose" : "draw";
    say(M.over === "win" ? (M.extra ? `✨ Fischio finale: vittoria al Golden Gol ${s[0]}-${s[1]}!` : `Fischio finale: vittoria ${s[0]}-${s[1]}!`) : M.over === "lose" ? (M.extra ? `Fischio finale: sconfitta al Golden Gol ${s[0]}-${s[1]}.` : `Fischio finale: sconfitta ${s[0]}-${s[1]}.`) : `Fischio finale: pari ${s[0]}-${s[1]}.`, 9);
    const f = M.cfg.onEnd;
    setTimeout(() => f && f(M.over, M), M.fast ? 0 : 1100);
  }
  // ------------------------------------------------------------ disegno (doppia risoluzione)
  const IMG = {}; const imgOf = (id) => { if (IMG[id] !== undefined) return IMG[id]; const u = safe(() => S().port(id), null); if (!u) return (IMG[id] = null); const i = new Image(); i.src = u; return (IMG[id] = i); };
  function buildStatic() {
    const c = document.createElement("canvas"); c.width = CW * SS; c.height = CH * SS; const g = c.getContext("2d"); g.scale(SS, SS); const r = seeded(77);
    // tribune
    const gr = g.createLinearGradient(0, 0, 0, OY); gr.addColorStop(0, "#14122a"); gr.addColorStop(1, "#2a2448"); g.fillStyle = gr; g.fillRect(0, 0, CW, OY);
    for (let row = 0; row < 3; row++) for (let x = 2 + (row % 2) * 2; x < CW; x += 5) { const cols = ["#d8584a", "#e8c84a", "#4a8ad8", "#e8e8e8", "#5ad88a", "#c85ad8"]; g.fillStyle = cols[Math.floor(r() * cols.length)]; g.globalAlpha = 0.85; g.beginPath(); g.arc(x, 4 + row * 5.5, 2, 0, 7); g.fill(); g.fillStyle = "#1a1a2a"; g.globalAlpha = 0.55; g.fillRect(x - 1.5, 5.5 + row * 5.5, 3, 2); } g.globalAlpha = 1;
    // cartelloni
    const bw = CW / ADS.length; ADS.forEach((a, i) => { g.fillStyle = a[1]; g.fillRect(i * bw, OY - 7, bw - 1, 7); g.fillStyle = "#fff"; g.font = "bold 5px system-ui"; g.textAlign = "center"; g.fillText(a[0], i * bw + bw / 2, OY - 2); });
    g.save(); g.translate(MX, OY);
    // erba a bande con grana
    const ns = NP === 5 ? 22 : 14; for (let i = 0; i < ns; i++) { g.fillStyle = i % 2 ? "#2d8a43" : "#359c4d"; g.fillRect((W / ns) * i, 0, W / ns + 1, H); }
    for (let i = 0; i < 900 * (W / 380); i++) { g.fillStyle = r() < 0.5 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.05)"; g.fillRect(r() * W, r() * H, 1.2, 1.2); }
    g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(-MX, H - 4, CW, 16);
    g.strokeStyle = "rgba(255,255,255,.88)"; g.lineWidth = 2; g.strokeRect(2, TOP, W - 4, BOT - TOP); g.beginPath(); g.moveTo(W / 2, TOP); g.lineTo(W / 2, BOT); g.stroke(); g.beginPath(); g.arc(W / 2, H / 2, 28, 0, 7); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.arc(W / 2, H / 2, 2, 0, 7); g.fill();
    g.strokeRect(2, CY - BXH / 2, BXW, BXH); g.strokeRect(W - BXW - 2, CY - BXH / 2, BXW, BXH); g.strokeRect(2, GY0 - 6, 18, GY1 - GY0 + 12); g.strokeRect(W - 20, GY0 - 6, 18, GY1 - GY0 + 12); g.beginPath(); g.arc(BXW + 2, CY, 14, -1.1, 1.1); g.stroke(); g.beginPath(); g.arc(W - BXW - 2, CY, 14, Math.PI - 1.1, Math.PI + 1.1); g.stroke();
    [[2, TOP], [W - 2, TOP], [2, BOT], [W - 2, BOT]].forEach(([x, y], i) => { g.beginPath(); g.arc(x, y, 5, (i % 2 ? 0.5 : -0.1) * Math.PI + (i > 1 ? 0 : 0), 0, true); g.stroke(); });
    // porte con rete
    [[-MX + 2, 0], [W, 1]].forEach(([x0, rt]) => { g.fillStyle = "rgba(20,20,30,.55)"; g.fillRect(x0, GY0, MX - 2, GY1 - GY0); g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 0.7; for (let y = GY0; y <= GY1; y += 4) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + MX - 2, y); g.stroke(); } for (let x = x0; x <= x0 + MX - 2; x += 4) { g.beginPath(); g.moveTo(x, GY0); g.lineTo(x, GY1); g.stroke(); } g.strokeStyle = "#fff"; g.lineWidth = 3; g.strokeRect(rt ? W - 1 : -MX + 2, GY0, MX - 1, GY1 - GY0); });
    g.restore(); return c;
  }
  // dettagli per personaggio: aspetto, andatura e scia in base alla saga (supers.js) e al ruolo
  function look(p) { if (p._lk) return p._lk; const s = p.keeper ? { fx: "", col: p.col } : supOf(p); return (p._lk = { fx: s.fx, col: s.col || p.col, gait: p.keeper ? 0.9 : p.role === "A" ? 1.18 : p.role === "D" ? 0.88 : 1 }); }
  function accBack(g, p, L, bob, sgn, sv) {
    const t = M.t, c = L.col; g.save();
    if (L.fx === "vanish" || L.fx === "change") { const b = -sgn * (5 + sv * 4) + Math.sin(t * 0.2 + p.x) * 1.5; g.fillStyle = c + "bb"; g.beginPath(); g.moveTo(-4, -19 - bob); g.lineTo(4, -19 - bob); g.lineTo(b + 4, -4); g.lineTo(b - 4, -3); g.closePath(); g.fill(); }
    if (L.fx === "spiral") { g.strokeStyle = c + "88"; g.lineWidth = 1; g.beginPath(); g.ellipse(0, -14 - bob, 10, 3.2, 0, Math.PI, 0); g.stroke(); }
    g.restore();
  }
  function accFront(g, p, L, bob, hy) {
    const t = M.t, c = L.col; g.save(); g.lineCap = "round";
    if (L.fx === "fire") { for (let i = -1; i <= 1; i++) { const h = 6 + Math.sin(t * 0.5 + i * 2 + p.x) * 2 - Math.abs(i) * 1.6; g.fillStyle = i ? c : "#ffe066"; g.beginPath(); g.moveTo(i * 3 - 2, hy - 7); g.quadraticCurveTo(i * 3, hy - 7 - h, i * 3 + 2, hy - 7); g.fill(); } }
    else if (L.fx === "thunder") { g.strokeStyle = "#fff6a8"; g.fillStyle = c; g.lineWidth = 1; g.beginPath(); g.moveTo(1.5, -19 - bob); g.lineTo(-2, -15 - bob); g.lineTo(1, -15 - bob); g.lineTo(-1.5, -11 - bob); g.lineTo(3, -16 - bob); g.lineTo(0, -16 - bob); g.closePath(); g.fill(); if (t % 40 < 5) { g.strokeStyle = c; g.beginPath(); g.moveTo(-9, hy - 4); g.lineTo(-5, hy - 9); g.lineTo(-7, hy - 10); g.lineTo(-3, hy - 14); g.stroke(); } }
    else if (L.fx === "curve") { g.strokeStyle = c; g.lineWidth = 2; const sgn = p.vx >= 0 ? -1 : 1; g.beginPath(); g.moveTo(sgn * 7, hy - 3); g.bezierCurveTo(sgn * 12, hy - 6 + Math.sin(t * 0.3) * 3, sgn * 15, hy + 1, sgn * 20, hy - 2 + Math.sin(t * 0.3 + 1) * 4); g.stroke(); }
    else if (L.fx === "zig") { g.strokeStyle = c; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-5, -18 - bob); g.lineTo(-2, -15 - bob); g.lineTo(-5, -13 - bob); g.lineTo(5, -11 - bob); g.stroke(); }
    else if (L.fx === "spiral") { const a = t * 0.18 + p.x; g.fillStyle = c; g.beginPath(); g.arc(Math.cos(a) * 10, -14 - bob + Math.sin(a) * 3.2, 1.8, 0, 7); g.fill(); }
    else if (L.fx === "vanish") { g.fillStyle = c + "cc"; g.fillRect(-8, hy - 1, 16, 3.5); g.fillStyle = "#fff"; g.fillRect(-4, hy - 0.5, 2.5, 1.6); g.fillRect(2, hy - 0.5, 2.5, 1.6); }
    else if (L.fx === "ice") { g.fillStyle = "#cfefff"; g.strokeStyle = c; g.lineWidth = 0.8; for (let i = -1; i <= 1; i++) { const h = 5 - Math.abs(i) * 1.2; g.beginPath(); g.moveTo(i * 3.2, hy - 7); g.lineTo(i * 3.2 - 1.6, hy - 7 - h * 0.6); g.lineTo(i * 3.2, hy - 7 - h); g.lineTo(i * 3.2 + 1.6, hy - 7 - h * 0.6); g.closePath(); g.fill(); g.stroke(); } }
    else if (L.fx === "change") { g.strokeStyle = c; g.lineWidth = 1.6; g.globalAlpha = 0.6 + Math.sin(t * 0.2) * 0.35; g.beginPath(); g.ellipse(0, hy - 11, 6, 2, 0, 0, 7); g.stroke(); }
    else if (L.fx === "drill") { g.fillStyle = "#b8bcc8"; g.strokeStyle = "#444"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-6, hy - 4); g.lineTo(0, hy - 14); g.lineTo(6, hy - 4); g.closePath(); g.fill(); g.stroke(); g.strokeStyle = c; g.beginPath(); g.moveTo(-3, hy - 8); g.lineTo(3, hy - 8); g.stroke(); }
    g.restore();
  }
  function fig(g, p) {
    const sv = Math.hypot(p.vx, p.vy), sw = Math.sin(p.run) * Math.min(1, sv) * 4.2, bob = Math.abs(Math.sin(p.run)) * Math.min(1, sv) * 1.2, ko = p.stun > 0 && !p.slide, L = look(p), cel = M.goalT > 0 && p.team === M.lastScorer ? (p === M.scorer ? 1 : 0.5) : 0, jy = cel ? -Math.abs(Math.sin(M.goalT * 0.22 + p.x)) * 9 * cel : 0, up = cel === 1, sgn = p.vx >= 0 ? 1 : -1;
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(p.x, p.y + 1, 8, 3, 0, 0, 7); g.fill();
    g.save(); g.translate(p.x, p.y + jy); if (!p.keeper) accBack(g, p, L, bob, sgn, sv); if (p.slide > 0) { g.rotate(Math.atan2(p.sy, p.sx) * 0 + (p.sx >= 0 ? 1.2 : -1.2)); g.translate(0, -4); } if (ko) g.globalAlpha = 0.7 + Math.sin(M.t * 0.8) * 0.2;
    const sk = "#e8bc90";
    // gambe e calzettoni
    g.lineCap = "round"; g.strokeStyle = sk; g.lineWidth = 3; g.beginPath(); g.moveTo(-2.5, -8); g.lineTo(-3 + sw, -1 - bob * 0.2); g.moveTo(2.5, -8); g.lineTo(3 - sw, -1 - bob * 0.2); g.stroke();
    g.strokeStyle = p.col2; g.lineWidth = 3.2; g.beginPath(); g.moveTo(-3 + sw * 0.8, -4); g.lineTo(-3 + sw, -1); g.moveTo(3 - sw * 0.8, -4); g.lineTo(3 - sw, -1); g.stroke();
    g.fillStyle = "#111"; g.fillRect(-5 + sw, -1.6, 4, 2); g.fillRect(1 - sw, -1.6, 4, 2);
    // pantaloncini e maglia
    g.fillStyle = p.col2; g.beginPath(); g.roundRect(-5, -11 - bob, 10, 5, 1.5); g.fill();
    g.fillStyle = p.col; g.strokeStyle = "rgba(0,0,0,.6)"; g.lineWidth = 1; g.beginPath(); g.roundRect(-5.5, -20 - bob, 11, 10, 3); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,.85)"; g.font = "bold 6px system-ui"; g.textAlign = "center"; g.fillText(p.num, 0, -12.6 - bob);
    // braccia
    g.strokeStyle = p.keeper ? "#ffe066" : sk; g.lineWidth = p.keeper ? 3.4 : 2.4; g.beginPath(); g.moveTo(-5.5, -18 - bob); g.lineTo(up ? -9 : -8 - sw * 0.5, up ? -27 : -12 - bob); g.moveTo(5.5, -18 - bob); g.lineTo(up ? 9 : 8 + sw * 0.5, up ? -27 : -12 - bob); g.stroke();
    // testa = ritratto
    const im = imgOf(p.id), hy = -27 - bob; g.save(); g.beginPath(); g.arc(0, hy, 8, 0, 7); g.clip(); if (im && im.complete && im.naturalWidth && !p.keeper) g.drawImage(im, -8, hy - 8.5, 16, 16); else { g.fillStyle = p.keeper ? "#caa070" : sk; g.fillRect(-8, hy - 8, 16, 16); if (p.keeper) { g.fillStyle = "#222"; g.fillRect(-8, hy - 8, 16, 5); } } g.restore();
    g.strokeStyle = p.col; g.lineWidth = 2; g.beginPath(); g.arc(0, hy, 8, 0, 7); g.stroke();
    if (!p.keeper) accFront(g, p, L, bob, hy);
    g.restore();
    if (ko) { g.strokeStyle = "#ffd23f"; g.lineWidth = 1.2; for (let i = 0; i < 3; i++) { const a = M.t * 0.15 + i * 2.1; g.beginPath(); g.arc(p.x + Math.cos(a) * 7, p.y - 36 + Math.sin(a) * 2.5, 1.3, 0, 7); g.stroke(); } }
    if (p === M.ctl) { g.fillStyle = "#ffd23f"; g.strokeStyle = "#000"; g.lineWidth = 1; g.beginPath(); g.moveTo(p.x, p.y - 41 + Math.sin(M.t * 0.15) * 2); g.lineTo(p.x - 5, p.y - 48 + Math.sin(M.t * 0.15) * 2); g.lineTo(p.x + 5, p.y - 48 + Math.sin(M.t * 0.15) * 2); g.closePath(); g.fill(); g.stroke(); }
  }
  function draw(g) {
    if (!STATIC) STATIC = buildStatic();
    const vw = M.vw, b0 = M.ball, fo = b0.owner ? b0.owner.x : b0.x + b0.vx * 9, tcam = vw >= CW ? -MX : clampN(fo - vw / 2, -MX, W + MX - vw); M.cam += (tcam - M.cam) * (M.fast ? 1 : 0.1);
    g.save(); g.scale(SS, SS); g.fillStyle = "#000"; g.fillRect(0, 0, vw, CH); const sh = M.shake > 0 ? (M.r() - 0.5) * M.shake * 0.5 : 0; g.drawImage(STATIC, (M.cam + MX) * SS, 0, vw * SS, CH * SS, sh, sh * 0.5, vw, CH); g.translate(-M.cam + sh, OY + sh * 0.5);
    if (M.flash > 0) { g.fillStyle = `rgba(255,255,200,${M.flash / 40})`; g.fillRect(M.cam, -OY, vw, CH); M.flash--; }
    { const o0 = M.ctl, pa = o0 && M.ball.owner === o0 ? comboOf(o0) : null; if (pa) { g.strokeStyle = "rgba(255,210,63," + (0.55 + 0.4 * Math.sin(M.t * 0.2)) + ")"; g.lineWidth = 2; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(o0.x, o0.y - 6); g.lineTo(pa.x, pa.y - 6); g.stroke(); g.setLineDash([]); g.fillStyle = "#ffd23f"; g.font = "bold 9px system-ui"; g.textAlign = "center"; g.fillText("COMBO", (o0.x + pa.x) / 2, (o0.y + pa.y) / 2 - 10); } }
    M.fx.forEach((x) => { if (x.ring) { g.strokeStyle = `rgba(255,220,120,${x.l / 20})`; g.lineWidth = 3; g.beginPath(); g.arc(x.x, x.y, 75 * (1 - x.l / 20), 0, 7); g.stroke(); } });
    // indicatori: mira e ricevente
    const c = M.ctl, b = M.ball;
    if (c && b.owner === c && !M.over) { const tx = gx(0), v = inputVec(), ay = Math.max(GY0 + 5, Math.min(GY1 - 5, CY + v.y * 30)); if (M.chg > 0 || M.hold.b) { const f = Math.min(1, M.chg / 40); g.strokeStyle = `rgba(255,${Math.round(220 - 140 * f)},60,.85)`; g.lineWidth = 1.5; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(c.x, c.y - 4); g.lineTo(tx, ay); g.stroke(); g.setLineDash([]); g.fillStyle = "#000a"; g.fillRect(c.x - 14, c.y + 6, 28, 5); g.fillStyle = M.chg >= 40 ? "#ff6a3a" : "#ffd23f"; g.fillRect(c.x - 13, c.y + 7, 26 * Math.min(1, M.chg / 40), 3); } else { const m = bestMate(c, v.x, v.y); if (m) { g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1.2; g.beginPath(); g.ellipse(m.x, m.y, 11, 4.5, 0, 0, 7); g.stroke(); } } }
    M.all.slice().sort((a, d) => a.y - d.y).forEach((p) => fig(g, p));
    // palla con scia
    const hid = b.sup === "vanish" && b.age > 6 && b.age < 26;
    b.tr.forEach((t, i) => { if (b.sup) { g.globalAlpha = (i / 14) * (hid ? 0.4 : 1); g.fillStyle = b.twin && i % 2 ? b.twin : b.supCol; } else g.fillStyle = `rgba(255,${b.big ? 160 : 255},${b.big ? 60 : 255},${i / 14})`; g.beginPath(); g.arc(t[0], t[1], 2 + i * 0.35, 0, 7); g.fill(); g.globalAlpha = 1; });
    if (b.sup && !hid) { const gr = g.createRadialGradient(b.x, b.y - 2, 1, b.x, b.y - 2, 12); gr.addColorStop(0, b.supCol + "cc"); gr.addColorStop(1, b.supCol + "00"); g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y - 2, 12, 0, 7); g.fill(); }
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(b.x + 1, b.y + 3, 5, 2.4, 0, 0, 7); g.fill();
    if (hid) { g.globalAlpha = 0.25; }
    g.fillStyle = b.sup ? "#fff" : b.big ? "#ffb347" : "#fff"; g.strokeStyle = "#111"; g.lineWidth = 1.1; g.beginPath(); g.arc(b.x, b.y - 2, 4.5, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#222"; for (let i = 0; i < 3; i++) { const a = b.rot + i * 2.1; g.beginPath(); g.arc(b.x + Math.cos(a) * 2.3, b.y - 2 + Math.sin(a) * 2.3, 1, 0, 7); g.fill(); }
    M.parts.forEach((q) => { g.globalAlpha = Math.min(1, q.l / 20); g.fillStyle = q.c; g.fillRect(q.x, q.y, q.s, q.s); }); g.globalAlpha = 1;
    g.textAlign = "center"; g.font = "bold 11px system-ui"; M.fx.forEach((x) => { if (x.ring) return; g.globalAlpha = Math.min(1, x.l / 24); g.lineWidth = 3; g.strokeStyle = "#000"; g.strokeText(x.t, x.x, x.y - (36 - x.l) * 0.6); g.fillStyle = x.c; g.fillText(x.t, x.x, x.y - (36 - x.l) * 0.6); }); g.globalAlpha = 1;
    g.restore();
    // HUD (coordinate dello schermo, a doppia risoluzione)
    g.save(); g.scale(SS, SS); const cx = vw / 2;
    g.fillStyle = "#0009"; g.beginPath(); g.roundRect(cx - 72, 2, 144, 17, 6); g.fill(); g.font = "900 10px system-ui"; g.textAlign = "right"; g.fillStyle = "#6ab0ff"; g.fillText(M.cfg.myName || "TU", cx - 22, 14); g.textAlign = "left"; g.fillStyle = "#ff8a7a"; g.fillText(M.cfg.foeName || "RIVALI", cx + 22, 14);
    g.textAlign = "center"; g.fillStyle = "#fff"; g.font = "900 13px system-ui"; g.fillText(`${M.score[0]}-${M.score[1]}`, cx, 15);
    if (M.cm && M.cm.l > 0) { const a = Math.min(1, M.cm.l / 20); g.globalAlpha = a; g.fillStyle = "#000b"; g.beginPath(); g.roundRect(6, 22, vw - 12, 17, 6); g.fill(); g.fillStyle = "#ffe08a"; g.font = "bold 10px system-ui"; g.textAlign = "center"; g.fillText("🎙️ " + M.cm.t, cx, 34, vw - 24); g.globalAlpha = 1; }
    const rem = M.extra ? Math.max(0, Math.ceil((DUR + 1800 - M.t) / 60)) : Math.max(0, Math.ceil((DUR - Math.max(0, M.t)) / 60)); g.font = "bold 9px system-ui"; g.fillStyle = "#000a"; g.fillRect(2, 2, 48, 14); g.fillStyle = M.extra ? "#ffd23f" : "#fff"; g.textAlign = "center"; g.fillText((M.extra ? "ORO " : "") + rem + "s", 26, 12);
    const A = M.ctl ? ABIL[M.ctl.role] : null, can = A && M.energy[0] >= A[2];
    const BY = M.land ? 28 : CH - 11;
    g.fillStyle = "#000a"; g.fillRect(4, BY - 1, 100, 9); g.fillStyle = can ? "#ffd23f" : "#8a7a30"; g.fillRect(5, BY, 98 * M.energy[0] / 100, 7); g.fillStyle = "#fff"; g.font = "bold 7px system-ui"; g.textAlign = "left"; g.fillText(`GRINTA${A ? " · " + A[0] : ""}${can ? " ✓" : ""}`, 7, BY + 6);
    g.fillStyle = "#000a"; const FXo = M.land ? 44 : 0; g.fillRect(vw - 62 - FXo, BY - 1, 58, 9); g.fillStyle = M.stam > 25 ? "#5ad8ff" : "#d85a5a"; g.fillRect(vw - 61 - FXo, BY, 56 * M.stam / 100, 7); g.fillStyle = "#fff"; g.textAlign = "right"; g.fillText("FIATO", vw - 7 - FXo, BY + 6);
    if (vw < CW) { const rw = 76, rh = rw * H / W, rx = vw / 2 - rw / 2, ry = CH - rh - 3; g.fillStyle = "rgba(10,40,20,.65)"; g.fillRect(rx, ry, rw, rh); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 0.7; g.strokeRect(rx, ry, rw, rh); g.beginPath(); g.moveTo(rx + rw / 2, ry); g.lineTo(rx + rw / 2, ry + rh); g.stroke(); const mx = (x) => rx + (x / W) * rw, my = (y) => ry + (y / H) * rh; M.all.forEach((q) => { g.fillStyle = q === M.ctl ? "#ffd23f" : q.team ? "#ff6a5a" : "#5aa8ff"; g.beginPath(); g.arc(mx(q.x), my(q.y), q === M.ctl ? 2 : 1.4, 0, 7); g.fill(); }); g.fillStyle = "#fff"; g.beginPath(); g.arc(mx(M.ball.x), my(M.ball.y), 1.6, 0, 7); g.fill(); g.strokeStyle = "#ffd23f"; g.strokeRect(rx + ((M.cam + MX) / CW) * rw, ry, (vw / CW) * rw, rh); }
    if (M.t < 0) { g.fillStyle = "#0008"; g.fillRect(0, CH / 2 - 30, vw, 54); g.fillStyle = "#ffd23f"; g.font = "900 26px system-ui"; g.textAlign = "center"; g.fillText(M.t > -70 ? "FISCHIO D'INIZIO!" : "PRONTI?", cx, CH / 2 + 8); }
    if (M.extra && M.t >= DUR && M.t < DUR + 90) { g.fillStyle = "#0009"; g.fillRect(0, CH / 2 - 28, vw, 50); g.fillStyle = "#ffd23f"; g.font = "900 20px system-ui"; g.textAlign = "center"; g.fillText("⚽ GOLDEN GOL!", cx, CH / 2); g.font = "bold 10px system-ui"; g.fillStyle = "#fff"; g.fillText("Tempi supplementari: chi segna vince!", cx, CH / 2 + 16); }
    if (M.goalT > 0) { g.fillStyle = "#0008"; const oy = CH / 2 - 120; g.fillRect(0, 84 + oy, vw, 72); const s = M.scorer, u = s && imgOf(s.id); if (u && u.complete && u.naturalWidth) { g.save(); g.beginPath(); g.arc(cx - 70, 120 + oy, 30, 0, 7); g.clip(); g.drawImage(u, cx - 100, 90 + oy, 60, 60); g.restore(); g.strokeStyle = s.col; g.lineWidth = 3; g.beginPath(); g.arc(cx - 70, 120 + oy, 30, 0, 7); g.stroke(); } g.fillStyle = M.lastScorer ? "#ff8a8a" : "#ffd23f"; g.font = "900 36px system-ui"; g.textAlign = "center"; g.fillText("GOOOL!", cx + 16, 128 + oy); if (s) { g.font = "bold 11px system-ui"; g.fillStyle = "#fff"; g.fillText(s.n, cx + 16, 146 + oy); } }
    g.restore();
  }
  // ------------------------------------------------------------ interfaccia
  function css() {
    if (document.getElementById("erCss")) return; const st = document.createElement("style"); st.id = "erCss";
    st.textContent = `.erOv{position:fixed;inset:0;z-index:314;background:#0c0818;color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto;touch-action:manipulation}.erOv .wrap{max-width:560px;margin:0 auto;padding:8px 8px 20px}
.erOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#0c0818;padding:5px 0;z-index:3}.erOv h2{margin:0;font:900 19px system-ui;color:#ffd23f}.erOv .x{width:40px;height:40px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#fff;font-size:17px}
.erOv .sum{font-size:13px;line-height:1.45;opacity:.9}.erOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}
.erOv .one{width:100%;min-height:54px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px;margin:5px 0}.erOv .one small{display:block;font-weight:400;font-size:11px;opacity:.75}.erOv button:disabled{opacity:.4}
.erStage{position:relative;width:100%;max-width:560px;margin:0 auto}.erStage canvas{display:block;width:100%;height:auto;border-radius:10px;background:#000}
.erCtl{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:8px;touch-action:none;user-select:none;-webkit-user-select:none}.erCtl button{border-radius:14px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 13px system-ui;padding:2px;touch-action:none}.erCtl .ab{display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:1;max-width:220px}
.erCtl button.on,.erCtl button:active{background:#5a3aa8}.erCtl .tb{background:#2a4a7a}.erCtl .sb{background:#1a5a5a}.erCtl .ac{background:#7a5a10;color:#ffe9a8}.erCtl .ab button{min-height:64px}.erCtl small{display:block;font-weight:400;font-size:9px;opacity:.8}
.erCut{position:absolute;left:0;right:0;top:30%;height:84px;overflow:hidden;z-index:6;pointer-events:none;background:linear-gradient(90deg,#000c,#3a1a6ccc 40%,#000c);border-top:3px solid #ffd23f;border-bottom:3px solid #ffd23f;animation:erCut .9s forwards;display:flex;align-items:center;gap:12px;padding:0 14px}
.erCut img{height:74px;width:74px;object-fit:cover;object-position:50% 20%;border-radius:50%;border:2px solid #ffd23f}.erCut b{font:900 20px system-ui;color:#ffd23f;text-shadow:0 2px 0 #000}.erCut span{display:block;font-size:12px;color:#fff}
.erOv .erX{display:none}.erOv.land{overflow:hidden}.erOv.land .wrap{max-width:none;padding:0;height:100%}.erOv.land .bar{display:none}.erOv.land .body{height:100%;position:relative}
.erOv.land .erStage{max-width:none;width:100%;height:100%;display:flex;justify-content:center;background:#000}.erOv.land .erStage canvas{height:100%;width:auto;max-width:100%;border-radius:0}
.erOv.land .erX{display:block;position:absolute;top:6px;right:8px;z-index:7;width:36px;height:36px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36cc;color:#fff;font-size:15px}
.erOv.land .erCtl{position:absolute;left:0;right:0;bottom:6px;padding:0 12px;margin:0;pointer-events:none;align-items:flex-end}.erOv.land .erCtl>*{pointer-events:auto}.erOv.land .erCtl .ab{max-width:250px;opacity:.9}.erOv.land .erCtl .ab button{min-height:50px}.erOv.land .sum{display:none}
.erOv.land .stk{background:rgba(20,15,40,.16)!important;border-color:rgba(255,255,255,.22)!important;box-shadow:none!important}.erOv.land .stk::before{border-color:#ffffff18}.erOv.land .stk i{opacity:.62}.erOv.land .erCtl button{background:rgba(34,26,54,.45);border-color:rgba(255,255,255,.2)}.erOv.land .erCtl .tb,.erOv.land .erCtl .sp{background:rgba(42,74,122,.5)}.erOv.land .erCtl .sb{background:rgba(26,90,90,.5)}.erOv.land .erCtl .ac,.erOv.land .erCtl .su{background:rgba(122,90,16,.5)}
@keyframes erCut{0%{opacity:0;transform:scaleY(.1)}12%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0}}.erRes{text-align:center;margin:12px 0}.erRes h3{font:900 24px system-ui;margin:4px 0}`;
    document.head.appendChild(st);
  }
  function shell(title) { css(); halt(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "erOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const live = M && !M.over; halt(); if (live) return menu(); const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function halt() { cancelAnimationFrame(RAF); RAF = 0; if (LAY) { window.removeEventListener("resize", LAY); window.removeEventListener("orientationchange", LAY); LAY = null; } window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); }
  function close() { halt(); M = null; if (OV) { OV.remove(); OV = null; } }
  const KM = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d", a: "l", d: "r", w: "u", s: "d", j: "a", k: "bh", l: "c", Shift: "s" };
  const kd = (e) => { const k = KM[e.key]; if (!k || !M) return; e.preventDefault(); if (k === "a" || k === "c") M.edge[k] = 1; else if (k === "s") M.hold.s = 1; else M.inp[k] = 1; };
  const ku = (e) => { const k = KM[e.key]; if (k && M && k !== "a" && k !== "c") { if (k === "s") M.hold.s = 0; else M.inp[k] = 0; } };
  function press(k, on) { if (!M) return; if (k === "a" || k === "c") { if (on) M.edge[k] = 1; } else if (k === "b" || k === "s") M.hold[k] = on ? 1 : 0; else M.inp[k] = on ? 1 : 0; }
  function matchUI(cfg) {
    const body = shell(cfg.title || "⚽ Calcio d'Azione Eroi"); begin(cfg);
    body.innerHTML = `<div class="erStage"><canvas width="${M.vw * SS}" height="${CH * SS}"></canvas><button type="button" class="erX" aria-label="Esci">✕</button></div><div class="erCtl"><div class="stkSlot"></div><div class="ab"><button data-k="a">⚽ Passa<small>senza palla: scivolata</small></button><button data-k="b" class="tb">🎯 Tira<small>tieni: carica</small></button><button data-k="s" class="sb">⚡ Scatto<small>tieni premuto</small></button><button data-k="c" class="ac">✦ Abilità<small>costa Grinta</small></button></div></div><p class="sum" style="font-size:11px;opacity:.65;margin-top:6px">Joystick libero: muovi il giocatore col segno ▼ (cambia da solo verso la palla). Tira: tieni premuto per caricare, joystick su/giù per mirare, rilascia. Abilità con la Grinta: con la palla è il SUPER TIRO della tua saga (curva, zig-zag, ghiaccio, fulmine...); senza palla Muro e Magnete. Gira il telefono per giocare in orizzontale. Tasti: frecce, J passa, K tira, Maiusc scatto, L abilità.</p>`;
    const cv = body.querySelector("canvas"), g = cv.getContext("2d"); M.stick = safe(() => window.__stick.make({ size: 140 }), null); if (M.stick) body.querySelector(".stkSlot").appendChild(M.stick.el);
    body.querySelectorAll("[data-k]").forEach((b) => { const k = b.dataset.k, up = () => { press(k, false); b.classList.remove("on"); }; b.addEventListener("pointerdown", (e) => { e.preventDefault(); press(k, true); b.classList.add("on"); }); b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("pointerleave", up); });
    const layout = () => { if (!OV || !M) return; const land = innerWidth > innerHeight * 1.1; OV.classList.toggle("land", land); M.land = land; const vw = land ? Math.min(CW, Math.round(CH * Math.min(2.3, innerWidth / Math.max(1, innerHeight)))) : Math.min(CW, 412); if (vw !== M.vw || cv.width !== vw * SS) { M.vw = vw; cv.width = vw * SS; cv.height = CH * SS; } };
    LAY = layout; window.addEventListener("resize", LAY); window.addEventListener("orientationchange", LAY); layout(); body.querySelector(".erX").onclick = () => OV.querySelector(".bar .x").click();
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    let last = performance.now(), acc = 0; const loop = (t) => { if (!OV || !M) return; acc += Math.min(100, t - last); last = t; while (acc >= 16.67) { if (!PAUSE) tick(); acc -= 16.67; } draw(g); if (M && !M.over) RAF = requestAnimationFrame(loop); }; RAF = requestAnimationFrame(loop); M.draw = () => draw(g);
  }
  // ------------------------------------------------------------ menu e coppa
  const mine = () => safe(() => S()._load().own.map((id) => S().BY[id]).filter(Boolean), []);
  const strength = (c) => c.at + c.df + c.te;
  function myTeam(n) {
    n = n || 3;
    const r = safe(() => S()._load(), { own: [], team: [] }), own = mine().slice().sort((a, b) => strength(b) - strength(a)), pick = [];
    r.team.forEach((id) => { const c = S().BY[id]; if (c && c.role !== "P" && pick.length < n) pick.push(c); }); own.forEach((c) => { if (pick.length < n && !pick.includes(c) && c.role !== "P") pick.push(c); });
    const pool = S().CARDS.slice().sort((a, b) => strength(a) - strength(b)); while (pick.length < n) pick.push(pool[(pick.length * 11) % pool.length]);
    return pick.slice(0, n);
  }
  function foesFor(rand, theme, n) {
    n = n || 3; const all = S().CARDS, pool = all.filter((c) => c.saga === theme), p = pool.length >= n + 1 ? pool : all, out = [], used = {}; for (let i = 0; i < n + 1; i++) { let c; for (let k = 0; k < 20; k++) { c = p[Math.floor(rand() * p.length)]; if (!used[c.id]) break; } used[c.id] = 1; out.push(c); } return out; }
  function menu(back) {
    if (back) BACK = back; const body = shell("⚽ Calcio d'Azione Eroi"), r = load(), team = myTeam(r.mode), rl = (c) => (ABIL[c.role] ? c.role : "A");
    body.innerHTML = `<p class="sum">Partita a squadre (formato 3v3 o 5v5 con campo grande e telecamera) con i personaggi delle saghe, joystick libero, tiro caricato, scivolata, anche in orizzontale. Ogni personaggio ha il <b>super tiro della sua saga</b> (curva, zig-zag, invisibile, ghiaccio, fulmine...); poi Regia, Muro, Magnete.</p><button type="button" class="one" data-mode="1">👥 Formato: ${r.mode === 5 ? "5 contro 5 (campo grande)" : "3 contro 3"}<small>tocca per cambiare · durata: ${r.mode === 5 ? "110 secondi" : "80 secondi"}</small></button><button type="button" class="one" data-tele="1">🎙️ Telecronaca: ${r.tele ? "SÌ" : "NO"}<small>una riga di commento per gol, parate, scivolate, super. Tocca per cambiare</small></button><button type="button" class="one" data-combo="1">🤝 Tiro combinato: ${r.combo ? "SÌ" : "NO"}<small>il Super con un compagno vicino (filo dorato COMBO): +25 energia, tiro molto più forte. Tocca per cambiare</small></button><div class="sec">La tua squadra</div><p class="sum">${team.map((c) => `<b>${esc(name(c.id))}</b> (${esc(ABIL[rl(c)][0])})`).join(" · ")}</p><div class="sec">Modalità</div><button type="button" class="one" data-go="cup">🏆 Coppa degli Eroi<small>3 turni a eliminazione (Quarti, Semifinale, Finale) · Tempi supplementari & Golden Gol · ${r.cup ? "vinta " + r.cup + " volte" : "mai vinta"}</small></button>${[1, 2, 3, 4, 5].map((l) => `<button type="button" class="one" data-l="${l}">Amichevole ${l}${"★".repeat(l)}<small>${["molto facile", "facile", "media", "difficile", "implacabile"][l - 1]} · ${r.mode === 5 ? 110 : 80} secondi · ${8 * l} monete</small></button>`).join("")}`;
    body.querySelector('[data-tele]').onclick = () => { const x = load(); x.tele = !x.tele; save(x); menu(); };
    body.querySelector('[data-combo]').onclick = () => { const x = load(); x.combo = !x.combo; save(x); menu(); };
    body.querySelector('[data-mode]').onclick = () => { const x = load(); x.mode = x.mode === 5 ? 3 : 5; save(x); menu(); };
    body.querySelector('[data-go="cup"]').onclick = () => cup(0);
    body.querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => game(+b.dataset.l, null)));
  }
  function game(lvl, st) {
    const rand = seeded(Date.now() & 0xffff), ss = [...new Set(S().CARDS.map((c) => c.saga))], th = ss[Math.floor(rand() * ss.length)], n = load().mode, fo = foesFor(rand, th, n), gk = (cs) => cs.find((c) => c.role === "P") || null;
    const SN = safe(() => S().SAGHE[th][1], "RIVALI");
    const cupTitles = ["🏆 Coppa · Quarti", "🏆 Coppa · Semifinale", "🏆 Coppa · FINALE"];
    const cfg = { n, mine: myTeam(n), foes: fo.slice(0, n), foeKeeper: gk(fo.slice(n)), myKeeper: null, lvl, myName: "TU", foeName: String(SN).replace(/^(Il |La |L'|Lo |I |Le )/, "").slice(0, 10).toUpperCase(), title: st ? cupTitles[st.n] || "🏆 Coppa degli Eroi" : `⚽ Amichevole ${lvl}★`, onEnd: (res, G) => results(res, G, lvl, st) };
    matchUI(cfg);
  }
  function cup(n) { game(2 + n, { n }); }
  function results(res, G, lvl, st) {
    const body = shell(res === "win" ? (G.extra ? "🏆 Vittoria al Golden Gol!" : "🏆 Vittoria") : res === "lose" ? (G.extra ? "💫 Sconfitta al Golden Gol" : "💫 Sconfitta") : "🤝 Pareggio"), a = load(), L = []; let coins = 0;
    if (res === "win") { a.wins++; coins = st ? 20 * (st.n + 1) + (st.n === 2 ? 100 : 0) : 8 * lvl; safe(() => window.addCoins(coins), 0); L.push(`+${coins} monete.`); if (st && st.n === 2) a.cup++; }
    a.goals += G.score[0]; save(a);
    if (safe(() => window.__arena, null)) safe(() => { const ar = window.__arena.load(); G.p.filter((p) => !p.keeper).forEach((p) => { ar.xp[p.id] = Math.min(60, (ar.xp[p.id] | 0) + (st && st.n === 2 ? 3 : 1)); }); window.__arena.save(ar); L.push(`📈 +${st && st.n === 2 ? "3" : "1"} esperienza di Arena a tutta la squadra.`); }, 0);
    const next = res === "win" && st && st.n < 2, pt = G.poss[0] + G.poss[1] || 1;
    const stages = ["Quarti", "Semifinale", "Finale"];
    const bracketHTML = st ? `<div style="display:flex;justify-content:center;align-items:center;gap:6px;margin:8px 0;font-size:11px;font-weight:800"><span style="padding:4px 8px;border-radius:6px;background:${st.n > 0 || (st.n === 0 && res === 'win') ? '#1e7a3a' : st.n === 0 && res !== 'win' ? '#7a2020' : '#221a36'}">1. Quarti ${st.n > 0 || (st.n === 0 && res === 'win') ? '✓' : ''}</span><span>›</span><span style="padding:4px 8px;border-radius:6px;background:${st.n > 1 || (st.n === 1 && res === 'win') ? '#1e7a3a' : st.n === 1 && res !== 'win' ? '#7a2020' : '#221a36'}">2. Semifinale ${st.n > 1 || (st.n === 1 && res === 'win') ? '✓' : ''}</span><span>›</span><span style="padding:4px 8px;border-radius:6px;background:${st.n === 2 && res === 'win' ? '#ffd23f;color:#111' : st.n === 2 && res !== 'win' ? '#7a2020' : '#221a36'}">3. Finale ${st.n === 2 && res === 'win' ? '🏆' : ''}</span></div>` : "";
    body.innerHTML = `<div class="erRes"><h3>${G.score[0]} - ${G.score[1]}</h3>${G.extra ? `<p style="font-weight:800;color:#ffd23f;font-size:12px;margin:2px 0">⚽ Decisa ai supplementari con il Golden Gol!</p>` : ""}<p class="sum">Tiri ${G.stat.shots[0]}-${G.stat.shots[1]} · parate ${G.stat.saves[0]}-${G.stat.saves[1]} · possesso ${Math.round((G.poss[0] / pt) * 100)}%</p>${bracketHTML}${L.map((l) => `<p class="sum">${l}</p>`).join("")}${res === "win" && st && st.n === 2 ? `<p class="sum" style="color:#ffd23f;font-size:14px"><b>🏆 COPPA DEGLI EROI VINTA! Campioni!</b></p>` : ""}${res === "draw" ? `<p class="sum">Pareggio: ripetiamo.</p>` : ""}</div>${next ? `<button type="button" class="one" data-go="next">▶ Turno successivo<small>${stages[st.n + 1]}</small></button>` : ""}<button type="button" class="one" data-go="again">↺ ${st && res !== "win" ? "Riprova il turno" : "Rivincita"}</button><button type="button" class="one" data-go="menu">◂ Menu</button>`;
    const q = (s) => body.querySelector(s); if (next) q('[data-go="next"]').onclick = () => cup(st.n + 1); q('[data-go="again"]').onclick = () => (st ? cup(st.n) : game(lvl, null)); q('[data-go="menu"]').onclick = () => menu();
  }
  window.__eroi = { open: menu, close, state: () => M, tick, press, begin, matchUI, game, cup, shoot, pass, ability, tackle, _fast: (v) => { if (M) M.fast = !!v; }, pause: (v) => { PAUSE = !!v; }, load, save, ABIL, myTeam, foesFor };
})();
