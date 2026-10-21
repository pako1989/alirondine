// js/beat.js - «Rissa dei Sogni»: beat 'em up a scorrimento con i personaggi della Squadra dei Sogni (js/sogni.js).
// Joystick analogico (js/stick.js) su due assi (lato e profondità), pugni a catena, salto, speciale di ruolo e Super firmato dalla saga (js/supers.js).
// 3 stadi (stadio, tetti, porto): ondate che bloccano lo schermo, barili, cibo, mini-boss e boss di una saga. Nemici = personaggi di quella saga.
(function () {
  "use strict";
  if (window.__beat) return;
  const KEY = "ali-di-rondine.beat", W = 380, H = 230, SS = 2, LY0 = 150, LY1 = 214, GR = 0.55;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const SPEC = { A: ["Palla di Fuoco", "fiammata in avanti"], C: ["Contropiede", "scatto con montante"], D: ["Onda d'Urto", "colpo a terra intorno a te"], P: ["Scudo Riflesso", "invulnerabile e ti cura"] };
  const TR = { at: "#e8603a", df: "#3a8ad8", te: "#a85ad8" };
  const STG = [{ n: "Stadio di Notte", sc: 0, len: 1500 }, { n: "Tetti al Tramonto", sc: 1, len: 1500 }, { n: "Porto Vecchio", sc: 3, len: 1500 }];
  const ET = { // tipi di nemico: hp, dmg, spd, rng (portata), wu (preavviso), cd (pausa)
    thug: { hp: 34, dmg: 7, spd: 0.95, rng: 28, wu: 22, cd: 90, sc: 1, n: "Teppista" }, fast: { hp: 24, dmg: 6, spd: 1.7, rng: 26, wu: 12, cd: 60, sc: 0.95, n: "Scattista" },
    heavy: { hp: 85, dmg: 14, spd: 0.6, rng: 34, wu: 34, cd: 120, sc: 1.2, n: "Corazziere", kd: true }, ranged: { hp: 28, dmg: 7, spd: 0.8, rng: 140, wu: 26, cd: 130, sc: 1, n: "Lanciatore", ranged: true },
    boss: { hp: 300, dmg: 16, spd: 0.9, rng: 40, wu: 30, cd: 70, sc: 1.3, n: "Boss", boss: true },
  };
  let OV = null, BACK = null, G = null, RAF = 0, PAUSE = false, LAY = null;
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { best: r.best | 0, wins: r.wins | 0, fighter: r.fighter || "" }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  const name = (id) => safe(() => S().name(id), id);
  const IMG = {}; const imgOf = (id) => { if (IMG[id] !== undefined) return IMG[id]; const u = safe(() => S().port(id), null); if (!u) return (IMG[id] = null); const i = new Image(); i.src = u; return (IMG[id] = i); };
  const SAGCOL = (c) => safe(() => (S().SAGHE[c.saga] ? S().SAGHE[c.saga][2] : "#7a5ad8"), "#7a5ad8");
  const SGOF = (id) => safe(() => window.__supers.of(id), { fx: "fire", name: "Super", col: "#ffb347", saga: "" });
  const rlOf = (c) => { if (SPEC[c.role]) return c.role; const e = safe(() => S().eff(c), c); return { at: "A", te: "C", df: "D" }[e.at >= e.df && e.at >= e.te ? "at" : e.df >= e.te ? "df" : "te"]; };
  const trOf = (c) => (c.at >= c.df && c.at >= c.te ? "at" : c.df >= c.te ? "df" : "te");
  // ------------------------------------------------------------ personaggi
  function mkP(card, o) {
    o = o || {}; const e = safe(() => S().eff(card), card), lv = o.lv || 0, m = 1 + lv * 0.04, hpMax = Math.round((120 + e.df * 1.4) * m);
    return { id: card.id, n: name(card.id), role: rlOf(card), tr: trOf(e), col: SAGCOL(card), sg: SGOF(card.id), x: 40, y: 182, z: 0, vx: 0, vy: 0, vz: 0, dir: 1, hp: hpMax, hpMax, meter: 0, st: "idle", t: 0, atk: null, hit: false, chain: 0, stun: 0, inv: 0, dmgM: (0.8 + e.at / 100) * m, spd: 1.45 + e.te / 170, jump: false, ghost: 0, sc: 1, human: true, kd: false, hits: 0 };
  }
  function mkE(kind, card, stg, i) {
    const T = ET[kind], k = 1 + stg * 0.35, e = safe(() => S().eff(card), card);
    return { id: card.id, n: kind === "boss" ? name(card.id) : T.n + " " + name(card.id).split(" ")[0], kind, T, col: SAGCOL(card), sg: SGOF(card.id), x: 0, y: 180, z: 0, vx: 0, vy: 0, vz: 0, dir: -1, hp: Math.round(T.hp * k), hpMax: Math.round(T.hp * k), st: "idle", t: 0, stun: 0, ice: 0, cool: 20 + i * 18, dmg: T.dmg * (0.8 + k * 0.25), hits: 0, sc: T.sc, spd: T.spd * (0.9 + stg * 0.1), tgy: 180, boss: !!T.boss, ph: 0, kd: false, human: false, cardAt: e.at };
  }
  // ------------------------------------------------------------ livello
  function begin(cfg) {
    const stg = cfg.stage | 0, ST = STG[stg], rnd = seeded(cfg.seed != null ? cfg.seed : (Date.now() & 0xfffff)), ss = [...new Set(S().CARDS.map((c) => c.saga))].filter((k) => S().CARDS.filter((c) => c.saga === k).length >= 3);
    const th = cfg.theme || ss[Math.floor(rnd() * ss.length)], pool = S().CARDS.filter((c) => c.saga === th), pick = () => pool[Math.floor(rnd() * pool.length)];
    const P = cfg.me, ws = [[320, ["thug", "thug"]], [700, ["thug", "fast", "thug"]], [1060, ["heavy", "ranged", "fast"]], [1360, ["boss"]]];
    if (stg === 0) ws[2][1] = ["thug", "ranged", "fast"]; if (stg === 2) ws[1][1] = ["fast", "fast", "ranged", "thug"];
    G = { cfg, st: ST, stg, P, en: [], items: [], proj: [], fxs: [], parts: [], bolts: [], waves: ws.map((w) => ({ x: w[0], kinds: w[1], done: false })), cam: 0, lock: null, t: -120, state: "play", rnd, theme: th, pool, pick, score: cfg.score | 0, kills: 0, stop: 0, shake: 0, cmb: null, fast: !!cfg.fast, inp: {}, edge: {}, stk: null, go: 0, sgName: safe(() => S().SAGHE[th][1], ""), boss: null, over: null, bg: null, clr: 0 };
    P.x = 40; P.y = 182; P.z = 0; P.st = "idle"; P.inv = 40; P.atk = null; P.stun = 0;
    for (let x = 200; x < ST.len - 200; x += 250 + Math.floor(rnd() * 120)) G.items.push({ k: "barrel", x: x + 40, y: LY0 + 10 + rnd() * 50, hp: 2, z: 0, id: 0 });
    return G;
  }
  const alive = () => G.en.filter((e) => e.hp > 0);
  function spawnWave(w) {
    w.done = true; G.lock = G.cam; const sides = [1, -1]; G.go = 0;
    w.kinds.forEach((k, i) => { const e = mkE(k, k === "boss" ? G.pool.slice().sort((a, b) => b.at + b.df + b.te - (a.at + a.df + a.te))[0] : G.pick(), G.stg, i), s = sides[i % 2]; e.x = s > 0 ? G.cam + W + 24 + i * 14 : G.cam - 24 - i * 14; e.y = LY0 + 12 + ((i * 23) % 50); e.dir = s > 0 ? -1 : 1; G.en.push(e); if (k === "boss") { G.boss = e; e.hpMax = e.hp = Math.round(e.hp * (1 + (G.cfg.lvl || 0) * 0.05)); banner(`${e.n} · ${G.sgName}`); } });
  }
  const banner = (t) => { if (!G.fast) G.fxs.push({ x: W / 2, y: 90, t, c: "#ffd23f", l: 100, big: true, sx: true }); };
  const fx = (x, y, t, c) => { if (!G.fast) G.fxs.push({ x, y, t, c, l: 30 }); };
  function spark(x, y, col, n) { if (G.fast) return; for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 0.8 + Math.random() * 2; G.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, l: 16 + (Math.random() * 10 | 0), c: col, s: 2 }); } }
  // ------------------------------------------------------------ danni
  function hurtE(e, d, o) {
    o = o || {}; if (e.hp <= 0 || e.st === "down") return false; if (e.ice > 0) d *= 1.5; if (e.boss && e.st === "wind") d *= 0.6;
    e.hp -= Math.round(d); e.hits++; const P = G.P; P.meter = Math.min(100, P.meter + 4); G.stop = o.kd ? 5 : 2; G.shake = Math.max(G.shake, o.kd ? 5 : 2); spark(e.x - G.cam, e.y - 30, "#ffd23f", o.kd ? 9 : 5); G.cmb = { n: (G.cmb ? G.cmb.n : 0) + 1, l: 90 };
    if (o.freeze) { e.ice = o.freeze; e.st = "idle"; }
    if (e.hp <= 0) { e.st = "down"; e.t = 0; e.vz = 6; e.vx = (o.dir || 1) * 3; e.kd = true; G.score += 100; G.kills++; return true; }
    if (!o.freeze && !e.boss && (o.kd || (e.hits >= 3 && !e.T.kd))) { e.st = "down"; e.t = 0; e.vz = 5; e.vx = (o.dir || 1) * 2.6; e.kd = true; e.hits = 0; }
    else if (!o.freeze && !(e.boss && e.st === "wind")) { e.st = "hit"; e.t = 0; e.stun = 12; e.vx = (o.dir || 1) * (o.kb || 1.6); }
    e.dirH = o.dir; return true;
  }
  function hurtP(d, kd, dir) {
    const P = G.P; if (P.inv > 0 || P.st === "down" || G.state !== "play") return; d = Math.round(d); P.hp -= d; P.meter = Math.min(100, P.meter + 3); G.shake = 4; G.stop = 3; spark(P.x - G.cam, P.y - 30, "#ff6a5a", 6); fx(P.x - G.cam, P.y - 60, "-" + d, "#ff8a7a");
    if (P.hp <= 0) { P.hp = 0; P.st = "down"; P.t = 0; P.vz = 6; P.vx = (dir || -1) * 3; G.state = "lose"; G.clr = 0; return; }
    if (kd) { P.st = "down"; P.t = 0; P.vz = 5; P.vx = (dir || -1) * 2.6; P.inv = 60; } else { P.st = "hit"; P.t = 0; P.stun = 14; P.vx = (dir || -1) * 1.5; P.atk = null; }
  }
  // ------------------------------------------------------------ azioni del giocatore
  const ATK = [{ su: 3, ac: 3, rc: 9, dmg: 7, reach: 34, kb: 1.4 }, { su: 3, ac: 3, rc: 9, dmg: 8, reach: 36, kb: 1.8 }, { su: 5, ac: 4, rc: 16, dmg: 12, reach: 42, kb: 3, kd: true }];
  const front = (P, reach, dy) => G.en.filter((e) => e.hp > 0 && e.st !== "down" && Math.abs(e.y - P.y) < (dy || 16) && (e.x - P.x) * P.dir > -8 && (e.x - P.x) * P.dir < reach + 8 * e.sc);
  function pAtk(P, k) { if (P.st !== "idle" && P.st !== "walk") return; P.st = "atk"; P.atk = Object.assign({ k }, ATK[k]); P.t = 0; P.hit = false; P.chain = k; }
  function special(P) {
    if (P.meter < 50 || !(P.st === "idle" || P.st === "walk" || P.st === "atk") || P.z > 0) return; P.meter -= 50; P.st = "spec"; P.t = 0; P.hit = false; P.atk = null; P.sup = false; fx(P.x - G.cam, P.y - 70, SPEC[P.role][0], "#9ad8ff");
  }
  function superMove(P) {
    if (P.meter < 100 || !(P.st === "idle" || P.st === "walk" || P.st === "atk") || P.z > 0) return; P.meter = 0; P.st = "spec"; P.t = 0; P.hit = false; P.atk = null; P.sup = true; P.hitset = []; G.stop = G.fast ? 0 : 34; if (!G.fast) cutin(P);
  }
  function cutin(P) { if (!OV) return; const w = OV.querySelector(".btStage"); if (!w) return; const c = document.createElement("div"); c.className = "btCut"; const u = safe(() => S().port(P.id), null); c.innerHTML = `${u ? `<img alt="" src="${u}">` : ""}<div><b>${esc(P.sg.name)}</b><span>${esc(P.n)}${P.sg.saga ? " · " + esc(P.sg.saga) : ""}</span></div>`; c.style.borderColor = P.sg.col; c.querySelector("b").style.color = P.sg.col; w.appendChild(c); setTimeout(() => c.remove(), 900); }
  const vis = (e) => e.x > G.cam - 20 && e.x < G.cam + W + 20;
  function specTick(P) {
    P.t++; const t = P.t, d = P.dir;
    if (!P.sup) {
      if (P.role === "A") { if (t === 8) G.proj.push({ x: P.x + d * 20, y: P.y, z: 28, vx: d * 5, own: P, dmg: 14 * P.dmgM, l: 60, c: P.sg.col, mine: true, kd: true }); if (t >= 22) P.st = "idle"; }
      else if (P.role === "C") { if (t >= 4 && t < 16) { P.x += d * 5; P.inv = 4; front(P, 30).forEach((e) => { if (!P.hitset.includes(e)) { P.hitset.push(e); hurtE(e, 9 * P.dmgM, { dir: d, kd: t > 12 }); } }); } if (t === 1) P.hitset = []; if (t >= 26) P.st = "idle"; }
      else if (P.role === "D") { if (t === 8) { G.fxs.push({ ring: 1, x: P.x, y: P.y, l: 18 }); G.shake = 6; G.en.forEach((e) => { if (e.hp > 0 && Math.hypot(e.x - P.x, (e.y - P.y) * 2) < 78) hurtE(e, 12 * P.dmgM, { dir: e.x >= P.x ? 1 : -1, kd: true }); }); } if (t >= 26) P.st = "idle"; }
      else { if (t === 1) { P.inv = 90; P.hp = Math.min(P.hpMax, P.hp + 16); fx(P.x - G.cam, P.y - 70, "+16", "#7ad87a"); } if (t >= 20) P.st = "idle"; }
      return;
    }
    const fxk = P.sg.fx, m = P.dmgM;
    P.inv = Math.max(P.inv, 3);
    if (fxk === "fire") { if (t === 14) G.proj.push({ x: P.x + d * 24, y: P.y, z: 30, vx: d * 6, own: P, dmg: 20 * m, l: 90, c: P.sg.col, mine: true, kd: true, pierce: true, big: true }); if (t >= 34) P.st = "idle"; }
    else if (fxk === "thunder") { if (t === 20) { G.shake = 10; G.en.forEach((e) => { if (e.hp > 0 && vis(e)) { G.bolts.push({ x: e.x, y: e.y, l: 16, c: P.sg.col }); hurtE(e, 24 * m, { dir: d, kd: true }); } }); } if (t >= 40) P.st = "idle"; }
    else if (fxk === "curve") { if (t === 10) G.proj.push({ x: P.x + d * 20, y: P.y, z: 30, vx: d * 4.2, own: P, dmg: 14 * m, l: 110, c: P.sg.col, mine: true, pierce: true, boom: P.x, big: true }); if (t >= 30) P.st = "idle"; }
    else if (fxk === "zig") { if (t >= 4 && t < 34) { P.x += d * 4.5; if (t % 6 === 0) { P.hitset = []; } front(P, 36, 22).forEach((e) => { if (!P.hitset.includes(e)) { P.hitset.push(e); hurtE(e, 6 * m, { dir: d, kb: 1 }); } }); } if (t >= 44) P.st = "idle"; }
    else if (fxk === "spiral") { if (t === 10) G.proj.push({ x: P.x + d * 24, y: P.y, z: 0, vx: d * 1.8, own: P, dmg: 5 * m, l: 90, c: P.sg.col, mine: true, tor: true, pierce: true, multi: true }); if (t >= 34) P.st = "idle"; }
    else if (fxk === "vanish") { if (t === 2) P.ghost = 1; if (t >= 8 && t < 44 && t % 7 === 1) { const es = alive().filter(vis).sort((a, b) => Math.abs(a.x - P.x) - Math.abs(b.x - P.x)); if (es[0]) { const e = es[(t / 7 | 0) % es.length] || es[0]; P.x = e.x - e.dir * -1 * 0 + (e.x > P.x ? -22 : 22); P.y = e.y; P.dir = e.x > P.x ? 1 : -1; hurtE(e, 9 * m, { dir: P.dir, kb: 1.4, kd: t > 38 }); spark(P.x - G.cam, P.y - 30, P.sg.col, 6); } } if (t >= 46) { P.st = "idle"; P.ghost = 0; } }
    else if (fxk === "ice") { if (t === 14) { G.en.forEach((e) => { if (e.hp > 0 && vis(e)) hurtE(e, 8 * m, { dir: d, freeze: 150 }); }); G.shake = 5; } if (t >= 34) P.st = "idle"; }
    else if (fxk === "change") { if (t === 8) G.proj.push({ x: P.x + d * 30, y: P.y, z: 30, vx: d * 0.6, own: P, dmg: 30 * m, l: 60, c: P.sg.col, mine: true, orb: true, big: true }); if (t >= 30) P.st = "idle"; }
    else { if (t >= 4 && t < 24) { P.x += d * 7.5; front(P, 34, 20).forEach((e) => { if (!P.hitset.includes(e)) { P.hitset.push(e); hurtE(e, 24 * m, { dir: d, kd: true, kb: 3 }); } }); } if (t >= 36) P.st = "idle"; }
  }
  // ------------------------------------------------------------ simulazione
  function inputs() {
    const k = G.inp, e = G.edge, sv = G.stk && G.stk.v; G.edge = {}; let x = (k.r ? 1 : 0) - (k.l ? 1 : 0), y = (k.d ? 1 : 0) - (k.u ? 1 : 0), m = x || y ? 1 : 0;
    if (sv && sv.m > 0) { x = sv.x; y = sv.y; m = sv.m; } else if (m) { const l = Math.hypot(x, y); x /= l; y /= l; }
    return { x, y, m, a: e.a, j: e.j, s: e.s, X: e.x };
  }
  function playerTick(P, I) {
    if (P.inv > 0) P.inv--;
    if (P.z > 0 || P.vz) { P.z += P.vz; P.vz -= GR; if (P.z <= 0) { P.z = 0; P.vz = 0; P.jump = false; if (P.st === "jump") P.st = "idle"; } }
    if (P.st === "down") { P.t++; P.x += P.vx; P.vx *= 0.85; if (G.state === "lose") return; if (P.t > 40 && P.z <= 0) { P.st = "idle"; P.inv = 50; } return; }
    if (P.st === "hit") { P.t++; P.x += P.vx; P.vx *= 0.8; if (--P.stun <= 0) P.st = "idle"; return; }
    if (P.st === "spec") { specTick(P); return; }
    if (P.st === "atk") {
      const a = P.atk; P.t++;
      if (!P.hit && P.t >= a.su && P.t < a.su + a.ac) { const hs = front(P, a.reach); if (hs.length || P.jump) { hs.forEach((e) => { P.hit = true; hurtE(e, a.dmg * P.dmgM, { dir: P.dir, kb: a.kb, kd: a.kd }); }); } }
      if (P.hit && P.t > a.su + 1 && I.a && P.chain < 2 && !P.jump) return pAtk(Object.assign(P, { st: "idle" }), P.chain + 1);
      if (P.t >= a.su + a.ac + a.rc) { P.st = P.z > 0 ? "jump" : "idle"; P.atk = null; P.chain = 0; } if (!P.jump) return;
    }
    if (I.X) return superMove(P); if (I.s) return special(P);
    if (P.z <= 0 && (P.st === "idle" || P.st === "walk")) {
      if (I.a) return pAtk(P, 0);
      if (I.j) { P.vz = 8.4; P.z = 0.1; P.jump = true; P.st = "jump"; P.jx = I.m ? I.x : 0; }
    }
    if (P.st === "idle" || P.st === "walk" || P.st === "jump" || (P.st === "atk" && P.jump)) {
      const sp = P.spd * (P.z > 0 ? 0.9 : 1); if (P.st !== "atk" || !P.z) { P.x += I.x * sp * I.m; P.y += I.y * sp * 0.72 * I.m; }
      if (I.m && P.st !== "atk") P.dir = Math.abs(I.x) > 0.2 ? (I.x > 0 ? 1 : -1) : P.dir; if (P.st === "idle" || P.st === "walk") P.st = I.m ? "walk" : "idle";
      if (P.st === "jump" && I.a && !P.air) { P.air = true; P.st = "atk"; P.atk = { k: 9, su: 2, ac: 12, rc: 3, dmg: 9, reach: 32, kb: 2 }; P.t = 0; P.hit = false; P.chain = 2; }
    }
    if (P.z <= 0) P.air = false;
  }
  function enemyTick(e) {
    if (e.ice > 0) { e.ice--; if (e.z > 0 || e.vz) { e.z += e.vz; e.vz -= GR; if (e.z < 0) { e.z = 0; e.vz = 0; } } return; }
    if (e.z > 0 || e.vz) { e.z += e.vz; e.vz -= GR; if (e.z <= 0) { e.z = 0; e.vz = 0; } }
    if (e.st === "down") { e.t++; e.x += e.vx; e.vx *= 0.85; if (e.hp <= 0) { if (e.t > 36) { e.dead = true; } return; } if (e.t > 44 && e.z <= 0) { e.st = "idle"; e.hits = 0; e.cool = 20; } return; }
    if (e.st === "hit") { e.t++; e.x += e.vx; e.vx *= 0.8; if (--e.stun <= 0) { e.st = "idle"; e.hits = Math.max(0, e.hits - 1); } return; }
    const P = G.P, T = e.T, dx = P.x - e.x, dy = P.y - e.y; if (e.cool > 0) e.cool--;
    if (e.st === "wind") {
      e.t++; if (e.boss && e.ph === 1) { /* salto del boss */ e.z = Math.max(0, Math.sin(Math.min(1, e.t / (T.wu + 10)) * Math.PI) * 38); }
      if (e.t >= T.wu + (e.boss && e.ph === 1 ? 10 : 0)) strike(e); return;
    }
    if (e.st === "rec") { if (++e.t >= T.cd * 0.45) { e.st = "idle"; e.t = 0; } return; }
    if (e.st === "charge") { e.t++; e.x += e.dir * 4.6; e.y += clampN(dy, -1, 1) * 0.4; if (Math.abs(e.x - P.x) < 22 && Math.abs(e.y - P.y) < 14) { hurtP(e.dmg * 1.2, true, e.dir); e.st = "rec"; e.t = 0; } if (e.t > 38) { e.st = "rec"; e.t = 0; } return; }
    e.dir = dx >= 0 ? 1 : -1; const sp = e.spd * (e.boss && e.hp < e.hpMax * 0.5 ? 1.35 : 1), atkers = G.en.filter((q) => q.hp > 0 && q.st === "wind").length;
    if (T.ranged) { const want = Math.abs(dx) < 90 ? -e.dir : Math.abs(dx) > 160 ? e.dir : 0; e.x += want * sp; e.y += clampN(dy, -1, 1) * sp * 0.6; if (e.cool <= 0 && Math.abs(dy) < 10 && Math.abs(dx) < 220 && atkers < 2) { e.st = "wind"; e.t = 0; } return; }
    const gx = P.x - e.dir * (T.rng - 8); e.x += clampN(gx - e.x, -sp, sp); e.y += clampN(dy, -sp * 0.7, sp * 0.7);
    if (e.cool <= 0 && Math.abs(dx) < T.rng + 6 && Math.abs(dy) < 12 && atkers < 2) { e.st = "wind"; e.t = 0; e.ph = e.boss ? (G.rnd() < 0.4 ? 1 : 0) : 0; }
    else if (e.boss && e.cool <= 0 && Math.abs(dx) > 110 && atkers < 2 && G.rnd() < 0.02) { e.st = "charge"; e.t = 0; fx(e.x - G.cam, e.y - 70, "!", "#ff5a5a"); }
  }
  function strike(e) {
    const P = G.P, T = e.T; e.st = "rec"; e.t = 0; e.cool = T.cd * (e.boss && e.hp < e.hpMax * 0.5 ? 0.6 : 1) + 10;
    if (T.ranged) { G.proj.push({ x: e.x + e.dir * 12, y: e.y, z: 30, vx: e.dir * 3.4, own: e, dmg: e.dmg, l: 140, c: e.col, mine: false }); return; }
    if (e.boss && e.ph === 1) { e.z = 0; G.shake = 8; G.fxs.push({ ring: 1, x: e.x, y: e.y, l: 18 }); if (Math.hypot(P.x - e.x, (P.y - e.y) * 2) < 80 && P.z < 14) hurtP(e.dmg, true, P.x >= e.x ? 1 : -1); return; }
    if (Math.abs(P.x - e.x) < T.rng + 10 && Math.abs(P.y - e.y) < 15 && P.z < 20 && (P.x - e.x) * e.dir > -10) hurtP(e.dmg, !!T.kd || (e.boss), e.dir);
  }
  function tick() {
    if (!G) return; if (G.stop > 0) { G.stop--; return; } G.t++;
    if (G.shake > 0) G.shake = Math.max(0, G.shake - 0.5); if (G.cmb && --G.cmb.l <= 0) G.cmb = null;
    G.parts = G.parts.filter((q) => { q.x += q.vx; q.y += q.vy; q.vy += 0.1; return --q.l > 0; }); G.fxs = G.fxs.filter((x) => --x.l > 0); G.bolts = G.bolts.filter((b) => --b.l > 0);
    const P = G.P; if (G.t < 0) return;
    if (G.state === "play" || G.state === "lose") playerTick(P, G.state === "play" ? inputs() : { x: 0, y: 0, m: 0 });
    if (G.state === "lose") { if (++G.clr > (G.fast ? 1 : 120) && !G.over) { G.over = "lose"; if (G.cfg.onEnd) G.cfg.onEnd("lose", G); } }
    const ST = G.st, minX = G.lock != null ? G.cam + 12 : Math.max(12, G.cam + 12), maxX = G.lock != null ? G.cam + W - 12 : ST.len - 12;
    P.x = clampN(P.x, minX, maxX); P.y = clampN(P.y, LY0, LY1);
    // ondate
    if (G.state === "play") { const w = G.waves.find((q) => !q.done); if (w && P.x >= w.x && G.lock == null) spawnWave(w); }
    G.en.forEach(enemyTick); G.en.forEach((e) => { e.y = clampN(e.y, LY0, LY1); if (G.lock != null) e.x = clampN(e.x, G.cam - 40, G.cam + W + 40); });
    G.en = G.en.filter((e) => { if (e.dead) { if (Math.random() < 0.3 || e.boss) G.items.push({ k: Math.random() < 0.6 ? "food" : "coin", x: e.x, y: e.y, z: 0 }); if (e.boss) { G.state = "clear"; G.clr = 0; fx(W / 2, 90, "STADIO COMPLETATO!", "#ffd23f"); } return false; } return true; });
    // separazione nemici
    for (let i = 0; i < G.en.length; i++) for (let j = i + 1; j < G.en.length; j++) { const a = G.en[i], b = G.en[j]; if (a.st === "down" || b.st === "down") continue; const d = Math.hypot(a.x - b.x, (a.y - b.y) * 2); if (d < 22 && d > 0.01) { const k = (22 - d) / 2 / d; a.x += (a.x - b.x) * k; b.x -= (a.x - b.x) * k; a.y += (a.y - b.y) * k * 0.5; b.y -= (a.y - b.y) * k * 0.5; } }
    // proiettili
    G.proj = G.proj.filter((q) => {
      q.x += q.vx; q.l--; if (q.boom != null && q.l === 55) q.vx *= -1;
      if (q.mine) { G.en.forEach((e) => { if (e.hp > 0 && e.st !== "down" && Math.abs(e.x - q.x) < (q.tor ? 28 : 18) && Math.abs(e.y - q.y) < 18) { if (q.tor && Math.abs(e.x - q.x) > 8) e.x += (q.x - e.x) * 0.1; if (q.multi && G.t % 6 !== 0) return; if (q.orb) return; q.hits = q.hits || []; if (!q.multi && q.hits.includes(e)) return; if (!q.multi) q.hits.push(e); hurtE(e, q.dmg, { dir: Math.sign(q.vx) || 1, kd: q.kd }); if (!q.pierce) q.l = 0; } });
        if (q.orb && q.l === 1) { G.shake = 9; G.fxs.push({ ring: 1, x: q.x, y: q.y, l: 18 }); G.en.forEach((e) => { if (e.hp > 0 && Math.hypot(e.x - q.x, (e.y - q.y) * 2) < 95) hurtE(e, q.dmg, { dir: e.x >= q.x ? 1 : -1, kd: true }); }); }
      } else if (Math.abs(q.x - P.x) < 14 && Math.abs(q.y - P.y) < 14 && P.z < 30) { hurtP(q.dmg, false, Math.sign(q.vx)); return false; }
      return q.l > 0 && q.x > G.cam - 60 && q.x < G.cam + W + 60;
    });
    // oggetti
    G.items = G.items.filter((it) => {
      if (it.k === "barrel") { if (it.hp <= 0) return false; if (P.st === "atk" && P.hit === false && P.t >= P.atk.su && P.t < P.atk.su + P.atk.ac && Math.abs(it.y - P.y) < 16 && (it.x - P.x) * P.dir > -8 && (it.x - P.x) * P.dir < P.atk.reach + 8) { it.hp--; P.hit = true; spark(it.x - G.cam, it.y - 20, "#c8964a", 8); if (it.hp <= 0) { G.items.push({ k: Math.random() < 0.55 ? "food" : "coin", x: it.x, y: it.y, z: 0 }); G.score += 20; } } return true; }
      if (Math.abs(it.x - P.x) < 16 && Math.abs(it.y - P.y) < 14 && G.state === "play") { if (it.k === "food") { P.hp = Math.min(P.hpMax, P.hp + 35); fx(P.x - G.cam, P.y - 70, "+35", "#7ad87a"); } else { G.score += 50; G.coins = (G.coins | 0) + 5; fx(P.x - G.cam, P.y - 70, "+5🪙", "#ffd23f"); } return false; } return true;
    });
    // fine ondata / camera
    if (G.lock != null && !alive().length && G.state === "play") { G.lock = null; G.go = 1; if (!G.fast) fx(W / 2, 100, "VAI →", "#ffd23f"); }
    const tcam = G.lock != null ? G.lock : clampN(P.x - 150, G.cam, ST.len - W); G.cam += (tcam - G.cam) * (G.fast ? 1 : 0.15); G.cam = clampN(G.cam, 0, ST.len - W);
    if (G.state === "clear") { if (++G.clr > (G.fast ? 1 : 150) && !G.over) { G.over = "clear"; if (G.cfg.onEnd) G.cfg.onEnd("clear", G); } }
  }
  // ------------------------------------------------------------ scenari (3 stadi) con parallasse
  function mkLayers(sc, col) {
    const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; }, rnd = seeded(hash(col) + sc * 31);
    const [far, f] = mk(W * 2, 150), [mid, m] = mk(W * 2, 150);
    const sky = f.createLinearGradient(0, 0, 0, 150);
    if (sc === 0) { sky.addColorStop(0, "#050a1c"); sky.addColorStop(1, "#1b2a55"); } else if (sc === 1) { sky.addColorStop(0, "#2a1550"); sky.addColorStop(0.65, "#b4506a"); sky.addColorStop(1, "#f0a05a"); } else { sky.addColorStop(0, "#0e2a5a"); sky.addColorStop(0.7, "#4a8ac0"); sky.addColorStop(1, "#f0c890"); }
    f.fillStyle = sky; f.fillRect(0, 0, W * 2, 150);
    if (sc === 0) { for (let i = 0; i < 70; i++) { f.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.6})`; f.fillRect(rnd() * W * 2, rnd() * 60, 1, 1); } for (let r = 0; r < 4; r++) { f.fillStyle = r % 2 ? "#141c3a" : "#1a2448"; f.fillRect(0, 70 + r * 20, W * 2, 20); for (let i = 0; i < 190; i++) { f.fillStyle = ["#e8603a", "#f0d060", "#6ab0f0", "#e8e8f0", col][(rnd() * 5) | 0]; f.globalAlpha = 0.55; f.fillRect(i * 4 + rnd() * 2, 74 + r * 20 + rnd() * 8, 2.4, 3.4); } f.globalAlpha = 1; } for (let i = 0; i < 4; i++) { const tx = 60 + i * 190; f.fillStyle = "#0a0f20"; f.fillRect(tx - 3, 22, 6, 110); f.fillStyle = "#fff"; for (let k = 0; k < 6; k++) f.fillRect(tx - 12 + (k % 3) * 8, 14 + ((k / 3) | 0) * 7, 6, 5); } }
    else if (sc === 1) { f.fillStyle = "#ffe9a8"; f.beginPath(); f.arc(520, 100, 28, 0, 7); f.fill(); f.fillStyle = "#6a3a6a"; let bx = 0; while (bx < W * 2) { const bw = 24 + rnd() * 30, bh = 30 + rnd() * 60; f.fillRect(bx, 150 - bh, bw, bh); bx += bw + 2; } }
    else { f.fillStyle = "#ffe9a8"; f.beginPath(); f.arc(220, 118, 24, 0, 7); f.fill(); f.fillStyle = "#2a6aa8"; f.fillRect(0, 118, W * 2, 32); for (let i = 0; i < 80; i++) { f.fillStyle = `rgba(255,255,255,${0.15 + rnd() * 0.2})`; f.fillRect(rnd() * W * 2, 120 + rnd() * 28, 6 + rnd() * 12, 1); } }
    // livello medio: edifici/recinzioni
    if (sc === 0) { for (let x = 0; x < W * 2; x += 70) { m.fillStyle = col; m.globalAlpha = 0.85; m.fillRect(x, 112, 66, 22); m.globalAlpha = 1; m.fillStyle = "#fff"; m.font = "bold 9px system-ui"; m.textAlign = "center"; m.fillText(["RONDINE FC", "PORTO LUCE", "BANCA COSTA", "RADIO 98.6"][(x / 70) % 4], x + 33, 127); } m.fillStyle = "#1a1a28"; m.fillRect(0, 134, W * 2, 16); }
    else if (sc === 1) { let bx = 0; while (bx < W * 2) { const bw = 36 + rnd() * 40, bh = 50 + rnd() * 50; m.fillStyle = "#3a2040"; m.fillRect(bx, 150 - bh, bw, bh); for (let wy = 150 - bh + 6; wy < 140; wy += 11) for (let wx = bx + 5; wx < bx + bw - 5; wx += 9) if (rnd() < 0.5) { m.fillStyle = "rgba(255,220,140,.85)"; m.fillRect(wx, wy, 4, 5); } bx += bw + 6; } }
    else { for (let x = 20; x < W * 2; x += 110 + ((x * 7) % 40)) { m.fillStyle = "#222a3a"; m.fillRect(x, 70, 6, 80); m.fillRect(x - 24, 70, 54, 5); m.fillStyle = "#c8601e"; m.fillRect(x + 30, 104, 40, 46); m.fillStyle = "#1e6ac8"; m.fillRect(x + 72, 112, 34, 38); } }
    return { far, mid, floor: [["#2a6a3a", "#14401f"], ["#4a4a58", "#26262f"], null, ["#8a6a42", "#4a3820"]][sc] || ["#4a4a58", "#26262f"] };
  }
  // ------------------------------------------------------------ disegno
  function ik(g, x0, y0, x1, y1, l1, l2, bend) {
    let dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 0.01; const mx = l1 + l2 - 0.05; if (d > mx) { x1 = x0 + (dx / d) * mx; y1 = y0 + (dy / d) * mx; dx = x1 - x0; dy = y1 - y0; d = mx; }
    const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a)), ex = x0 + (dx * a) / d - (dy / d) * h * bend, ey = y0 + (dy * a) / d + (dx / d) * h * bend;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(ex, ey); g.lineTo(x1, y1); g.stroke(); return [x1, y1];
  }
  function fig(g, e) {
    const sx = e.x - G.cam, sy = e.y - e.z, d = e.dir, T = G.t, down = e.st === "down", moving = e.st === "walk" || (!e.human && (e.st === "idle") && e.cool > 0 && !e.frozen);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(sx, e.y + 1, Math.max(5, 15 - e.z * 0.15) * e.sc, 4, 0, 0, 7); g.fill();
    g.save(); g.translate(sx, sy); g.scale(d * e.sc * 0.78, e.sc * 0.78);
    if (e.ghost) g.globalAlpha = 0.25; if (e.inv > 0 && e.human && Math.floor(T / 3) % 2 && !e.ghost) g.globalAlpha = 0.5;
    const sw = moving || e.st === "walk" ? Math.sin(T * 0.4 + (e.cardAt || 0)) * 8 : 0, idle = Math.sin(T * 0.12) * 1.3;
    let hf = [14, -52 + idle], hb = [8, -45], ff = [9, 0], fb = [-9, 0], lean = 0, hy = -67 + idle;
    if (e.st === "walk" || moving) { ff = [8 + sw, -Math.max(0, -sw) * 0.6]; fb = [-8 - sw, -Math.max(0, sw) * 0.6]; lean = 2; }
    if (e.z > 0) { ff = [11, -17]; fb = [-5, -12]; hf = [16, -60]; hb = [8, -56]; }
    if (e.st === "hit") { lean = -9; hf = [2, -40]; hb = [-5, -38]; hy = -63; }
    if (e.st === "atk" && e.atk) { const a = e.atk, p = e.t < a.su ? e.t / a.su : e.t < a.su + a.ac ? 1 : Math.max(0, 1 - (e.t - a.su - a.ac) / a.rc); if (a.k === 2) { ff = [9 + 30 * p, -28 - 8 * p]; lean = -5 * p; } else if (a.k === 9) { ff = [14 + 18 * p, -8]; fb = [-2, -24]; lean = 8; } else { hf = [10 + a.reach * 0.75 * p, -50]; lean = 5 * p; } }
    if (e.st === "spec") { hf = [24, -52]; hb = [18, -44]; lean = 6; }
    if (e.st === "wind") { hf = [-4, -60]; hb = [-8, -52]; lean = -6; }
    if (e.st === "rec") { hf = [20, -48]; lean = 4; }
    if (e.st === "charge") { lean = 10; ff = [18, -3]; fb = [-15, -6]; hf = [20, -48]; }
    if (down) { const k = Math.min(1, e.t / 8); g.translate(-8 * k, -3 * k); g.rotate(-k * Math.PI / 2); g.translate(0, 8 * k); } else if (lean) { g.translate(0, -30); g.rotate(lean * Math.PI / 180 * 0.9); g.translate(0, 30); }
    g.lineCap = "round"; g.lineJoin = "round"; const skin = "#e8c8a0", dark = "#1d1d28";
    g.strokeStyle = "#111"; g.lineWidth = 6.5; ik(g, -2, -29, fb[0], fb[1], 15, 15, -1); g.strokeStyle = dark; g.lineWidth = 4.6; ik(g, -2, -29, fb[0], fb[1], 15, 15, -1);
    g.strokeStyle = "#111"; g.lineWidth = 5.4; ik(g, -1, -47, hb[0], hb[1], 12, 12, 1); g.strokeStyle = skin; g.lineWidth = 3.6; ik(g, -1, -47, hb[0], hb[1], 12, 12, 1);
    g.fillStyle = e.col; g.strokeStyle = "#111"; g.lineWidth = 2; g.beginPath(); g.moveTo(-9, -50); g.lineTo(9, -50); g.lineTo(8, -28); g.lineTo(-8, -28); g.closePath(); g.fill(); g.stroke();
    if (e.human) { g.fillStyle = TR[e.tr]; g.fillRect(-8, -32, 16, 3); } else if (e.boss) { g.fillStyle = "#ffd23f"; g.fillRect(-9, -44, 18, 3); }
    g.fillStyle = dark; g.beginPath(); g.roundRect(-8, -29, 16, 9, 2); g.fill();
    const im = imgOf(e.id), hr = e.boss ? 16 : 15; g.save(); g.scale(d, 1); g.beginPath(); g.arc(0, hy, hr, 0, 7); g.clip(); if (im && im.complete && im.naturalWidth) g.drawImage(im, -hr - 1, hy - hr - 1, hr * 2 + 2, hr * 2 + 2); else { g.fillStyle = skin; g.fillRect(-hr, hy - hr, hr * 2, hr * 2); } g.restore();
    g.strokeStyle = e.human ? TR[e.tr] : "#ff6a5a"; g.lineWidth = 2.5; g.beginPath(); g.arc(0, hy, hr, 0, 7); g.stroke();
    g.strokeStyle = "#111"; g.lineWidth = 6.5; ik(g, 2, -29, ff[0], ff[1], 15, 15, -1); g.strokeStyle = skin; g.lineWidth = 4.6; ik(g, 2, -29, ff[0], ff[1], 15, 15, -1);
    g.strokeStyle = "#111"; g.lineWidth = 5.8; ik(g, 1, -47, hf[0], hf[1], 12, 12, 1); g.strokeStyle = skin; g.lineWidth = 3.9; const hn = ik(g, 1, -47, hf[0], hf[1], 12, 12, 1); g.fillStyle = skin; g.beginPath(); g.arc(hn[0], hn[1], 3.4, 0, 7); g.fill();
    if (e.ice > 0) { g.fillStyle = "rgba(150,225,255,.5)"; g.strokeStyle = "#e8f8ff"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(-15, -86, 30, 90, 6); g.fill(); g.stroke(); }
    if (e.st === "wind") { g.fillStyle = "#ff5a5a"; g.font = "bold 16px system-ui"; g.textAlign = "center"; g.scale(d, 1); g.fillText("!", 0, -88); }
    g.restore();
    if (!e.human && e.hp > 0 && e.hp < e.hpMax) { g.fillStyle = "#000a"; g.fillRect(sx - 14, sy - 66 * e.sc, 28, 4); g.fillStyle = e.boss ? "#ff5a5a" : "#e8c83a"; g.fillRect(sx - 13, sy - 66 * e.sc + 1, 26 * e.hp / e.hpMax, 2); }
  }
  function draw(g) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); const P = G.P, cam = G.cam;
    if (!G.bg) G.bg = mkLayers(G.st.sc, G.pool[0] ? SAGCOL(G.pool[0]) : "#7a5ad8"); const sh = G.shake > 0 ? (Math.random() - 0.5) * G.shake : 0; g.save(); g.translate(sh, sh * 0.5);
    const far = G.bg.far, mid = G.bg.mid, fo = (cam * 0.25) % (W * 2), mo = (cam * 0.55) % (W * 2);
    g.drawImage(far, -fo, 0); g.drawImage(far, W * 2 - fo, 0); g.drawImage(mid, -mo, 20); g.drawImage(mid, W * 2 - mo, 20);
    const gr = g.createLinearGradient(0, 138, 0, H); gr.addColorStop(0, G.bg.floor[0]); gr.addColorStop(1, G.bg.floor[1]); g.fillStyle = gr; g.fillRect(0, 138, W, H - 138);
    for (let i = -1; i < 12; i++) { const x = i * 40 - (cam % 40); g.fillStyle = i % 2 ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.06)"; g.fillRect(x, 138, 40, H - 138); } g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(0, 138, W, 1.5);
    g.strokeStyle = "rgba(255,255,255,.1)"; for (let i = 1; i < 5; i++) { const y = 138 + i * i * 4.4; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    G.fxs.forEach((x) => { if (x.ring) { g.strokeStyle = `rgba(255,220,120,${x.l / 18})`; g.lineWidth = 4; g.beginPath(); g.ellipse(x.x - cam, x.y, 80 * (1 - x.l / 18), 26 * (1 - x.l / 18), 0, 0, 7); g.stroke(); } });
    const ents = [].concat(G.en, [P], G.items.map((i) => ({ item: i, y: i.y })));
    ents.sort((a, b) => a.y - b.y).forEach((e) => {
      if (e.item) { const it = e.item, sx = it.x - cam; if (sx < -20 || sx > W + 20) return; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx, it.y + 1, 11, 3.5, 0, 0, 7); g.fill(); if (it.k === "barrel") { g.fillStyle = "#8a5a2a"; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(sx - 10, it.y - 24, 20, 24, 4); g.fill(); g.stroke(); g.fillStyle = "#c8a060"; g.fillRect(sx - 10, it.y - 17, 20, 2); g.fillRect(sx - 10, it.y - 8, 20, 2); } else { g.font = "16px serif"; g.textAlign = "center"; g.fillText(it.k === "food" ? "🍙" : "🪙", sx, it.y - 4 - Math.abs(Math.sin(G.t * 0.1)) * 3); } return; }
      if (e.hp <= 0 && e.st === "down" && e.t > 20 && Math.floor(e.t / 3) % 2) return; fig(g, e);
    });
    G.proj.forEach((q) => { const sx = q.x - cam, sy = q.y - q.z, r = q.big ? 12 : 8; if (q.tor) { g.strokeStyle = q.c; g.lineWidth = 2.5; for (let i = 0; i < 4; i++) { const yy = sy - 6 - i * 13; g.beginPath(); g.ellipse(sx, yy, 11 + Math.sin(G.t * 0.4 + i) * 4, 4, 0, 0, 7); g.stroke(); } return; } for (let i = 1; i < 5; i++) { g.globalAlpha = 0.5 / i; g.fillStyle = q.c; g.beginPath(); g.arc(sx - q.vx * i * 1.6, sy, r * (1 - i * 0.13), 0, 7); g.fill(); } g.globalAlpha = 1; const rr = q.orb ? r * (0.8 + 0.3 * Math.sin(G.t * 0.5)) : r, gg = g.createRadialGradient(sx, sy, 1, sx, sy, rr); gg.addColorStop(0, "#fff"); gg.addColorStop(0.4, q.c); gg.addColorStop(1, "rgba(255,80,0,0)"); g.fillStyle = gg; g.beginPath(); g.arc(sx, sy, rr, 0, 7); g.fill(); });
    G.bolts.forEach((b) => { const sx = b.x - cam; g.strokeStyle = "#fff"; g.shadowColor = b.c; g.shadowBlur = 10; g.lineWidth = 3 + b.l * 0.2; g.beginPath(); let yy = -10, xx = sx; g.moveTo(xx, yy); while (yy < b.y) { yy += 18; xx = sx + ((yy * 7 + b.l * 13) % 15) - 7; g.lineTo(xx, Math.min(b.y, yy)); } g.stroke(); g.shadowBlur = 0; });
    G.parts.forEach((q) => { g.globalAlpha = Math.min(1, q.l / 10); g.fillStyle = q.c; g.fillRect(q.x, q.y, q.s, q.s); }); g.globalAlpha = 1;
    g.font = "bold 12px system-ui"; g.textAlign = "center"; G.fxs.forEach((x) => { if (x.ring) return; const big = x.big; g.globalAlpha = Math.min(1, x.l / 20); g.fillStyle = x.c; g.strokeStyle = "#000"; g.lineWidth = 3; if (big) g.font = "900 20px system-ui"; else g.font = "bold 12px system-ui"; const yy = x.y - (x.big ? 0 : (30 - x.l)); g.strokeText(x.t, x.x, yy); g.fillText(x.t, x.x, yy); }); g.globalAlpha = 1;
    g.restore(); hud(g);
  }
  function hud(g) {
    const P = G.P; g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(0, 0, W, 34);
    const im = imgOf(P.id); g.save(); g.beginPath(); g.arc(18, 17, 13, 0, 7); g.clip(); g.fillStyle = P.col; g.fillRect(4, 4, 28, 28); if (im && im.complete && im.naturalWidth) g.drawImage(im, 4, 4, 28, 28); g.restore(); g.strokeStyle = TR[P.tr]; g.lineWidth = 2; g.beginPath(); g.arc(18, 17, 13, 0, 7); g.stroke();
    g.fillStyle = "#000a"; g.fillRect(36, 6, 130, 11); const p = Math.max(0, P.hp / P.hpMax); g.fillStyle = p > 0.5 ? "#7ad87a" : p > 0.25 ? "#e8d03a" : "#e8603a"; g.fillRect(37, 7, 128 * p, 9);
    g.fillStyle = "#000a"; g.fillRect(36, 20, 130, 6); const mf = P.meter >= 100 ? 0.6 + 0.4 * Math.sin(G.t * 0.3) : 1; g.globalAlpha = mf; g.fillStyle = P.meter >= 100 ? "#ffd23f" : P.meter >= 50 ? "#9ad8ff" : "#5a7ad8"; g.fillRect(37, 21, 128 * P.meter / 100, 4); g.globalAlpha = 1;
    g.fillStyle = "#fff"; g.font = "bold 9px system-ui"; g.textAlign = "left"; g.fillText(P.n + (P.meter >= 100 ? " · SUPER!" : ""), 38, 32.5 - 0);
    g.textAlign = "right"; g.font = "900 11px system-ui"; g.fillStyle = "#ffd23f"; g.fillText(String(G.score).padStart(6, "0"), W - 6, 14); g.font = "bold 9px system-ui"; g.fillStyle = "#fff"; g.fillText(`${G.stg + 1}/3 · ${G.st.n}`, W - 6, 27);
    if (G.boss && G.boss.hp > 0 && G.lock != null) { g.fillStyle = "#000a"; g.fillRect(90, 38, 200, 8); g.fillStyle = "#ff5a5a"; g.fillRect(91, 39, 198 * G.boss.hp / G.boss.hpMax, 6); g.fillStyle = "#fff"; g.font = "bold 8px system-ui"; g.textAlign = "center"; g.fillText(G.boss.n, 190, 55); }
    if (G.cmb && G.cmb.n >= 3) { g.textAlign = "left"; g.fillStyle = "#ffd23f"; g.strokeStyle = "#000"; g.lineWidth = 4; g.font = "900 22px system-ui"; g.strokeText(G.cmb.n + " HIT", 8, 70); g.fillText(G.cmb.n + " HIT", 8, 70); }
    if (G.go && G.lock == null && G.state === "play" && Math.floor(G.t / 20) % 2) { g.fillStyle = "#ffd23f"; g.strokeStyle = "#000"; g.lineWidth = 4; g.font = "900 26px system-ui"; g.textAlign = "right"; g.strokeText("VAI ▶", W - 14, 100); g.fillText("VAI ▶", W - 14, 100); }
    if (G.t < 0) { g.fillStyle = "#0009"; g.fillRect(0, 84, W, 56); g.fillStyle = "#ffd23f"; g.font = "900 22px system-ui"; g.textAlign = "center"; g.fillText(G.st.n.toUpperCase(), W / 2, 108); g.font = "bold 12px system-ui"; g.fillStyle = "#fff"; g.fillText("Rivali: " + G.sgName, W / 2, 128); }
    if (G.state === "lose") { g.fillStyle = "#0008"; g.fillRect(0, 84, W, 56); g.fillStyle = "#ff5a5a"; g.font = "900 30px system-ui"; g.textAlign = "center"; g.fillText("K.O.", W / 2, 124); }
  }
  // ------------------------------------------------------------ interfaccia
  function css() {
    if (document.getElementById("btCss")) return; const st = document.createElement("style"); st.id = "btCss";
    st.textContent = `.btOv{position:fixed;inset:0;z-index:314;background:#0c0818;color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto;touch-action:manipulation}.btOv .wrap{max-width:560px;margin:0 auto;padding:8px 8px 20px}
.btOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#0c0818;padding:5px 0;z-index:3}.btOv h2{margin:0;font:900 19px system-ui;color:#ffd23f}.btOv .x{width:40px;height:40px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#fff;font-size:17px}
.btOv .sum{font-size:13px;line-height:1.45;opacity:.9}.btOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}
.btOv .one{width:100%;min-height:54px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px;margin:5px 0}.btOv .one small{display:block;font-weight:400;font-size:11px;opacity:.75}
.btPick{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:6px}.btPick .c{border-radius:9px;border:2px solid #4a3a6a;background:#1a1428;padding:3px;text-align:center;font-size:9.5px;font-weight:700;cursor:pointer}.btPick .c.sel{border-color:#ffd23f;box-shadow:0 0 10px #ffd23f88}.btPick img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;display:block}
.btStage{position:relative;width:100%;max-width:560px;margin:0 auto}.btStage canvas{display:block;width:100%;height:auto;border-radius:10px;background:#000}
.btCtl{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:8px;touch-action:none;user-select:none;-webkit-user-select:none}.btCtl .ab{display:grid;grid-template-columns:repeat(2,minmax(0,76px));grid-template-rows:repeat(2,56px);gap:6px}
.btCtl button{border-radius:12px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 12px system-ui;padding:2px;touch-action:none;line-height:1.15}.btCtl button.on,.btCtl button:active{background:#5a3aa8}.btCtl .sp{background:#2a4a7a}.btCtl .su{background:#7a5a10;color:#ffe9a8}.btCtl small{display:block;font-weight:400;font-size:8.5px;opacity:.8}
.btCut{position:absolute;left:0;right:0;top:30%;height:84px;overflow:hidden;z-index:6;pointer-events:none;background:linear-gradient(90deg,#000c,#3a1a6ccc 40%,#000c);border-top:3px solid #ffd23f;border-bottom:3px solid #ffd23f;animation:btCut .9s forwards;display:flex;align-items:center;gap:12px;padding:0 14px}
.btCut img{height:74px;width:74px;object-fit:cover;object-position:50% 20%;border-radius:50%;border:2px solid #ffd23f}.btCut b{font:900 20px system-ui;color:#ffd23f;text-shadow:0 2px 0 #000}.btCut span{display:block;font-size:12px;color:#fff}
.btOv.land .stk{background:rgba(20,15,40,.16)!important;border-color:rgba(255,255,255,.22)!important;box-shadow:none!important}.btOv.land .stk::before{border-color:#ffffff18}.btOv.land .stk i{opacity:.62}.btOv.land .btCtl button{background:rgba(34,26,54,.45);border-color:rgba(255,255,255,.2)}.btOv.land .btCtl .tb,.btOv.land .btCtl .sp{background:rgba(42,74,122,.5)}.btOv.land .btCtl .sb{background:rgba(26,90,90,.5)}.btOv.land .btCtl .ac,.btOv.land .btCtl .su{background:rgba(122,90,16,.5)}
@keyframes btCut{0%{opacity:0;transform:scaleY(.1)}12%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0}}.btRes{text-align:center;margin:12px 0}.btRes h3{font:900 24px system-ui;margin:4px 0}
.btOv .btX{display:none}.btOv.land{overflow:hidden}.btOv.land .wrap{max-width:none;padding:0;height:100%}.btOv.land .bar{display:none}.btOv.land .body{height:100%;position:relative}.btOv.land .btStage{max-width:none;width:100%;height:100%;display:flex;justify-content:center;background:#000}.btOv.land .btStage canvas{height:100%;width:auto;max-width:100%;border-radius:0}
.btOv.land .btX{display:block;position:absolute;top:6px;right:8px;z-index:7;width:36px;height:36px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36cc;color:#fff;font-size:15px}.btOv.land .btCtl{position:absolute;left:0;right:0;bottom:6px;padding:0 12px;margin:0;pointer-events:none;align-items:flex-end}.btOv.land .btCtl>*{pointer-events:auto}.btOv.land .btCtl .ab{opacity:.9}.btOv.land .sum{display:none}`;
    document.head.appendChild(st);
  }
  function shell(title) { css(); halt(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "btOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const live = G && !G.over; halt(); if (live) return menu(); const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function halt() { cancelAnimationFrame(RAF); RAF = 0; if (LAY) { window.removeEventListener("resize", LAY); window.removeEventListener("orientationchange", LAY); LAY = null; } window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); }
  function close() { halt(); G = null; if (OV) { OV.remove(); OV = null; } }
  const KM = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d", a: "l", d: "r", w: "u", s: "d", j: "a", k: "j", l: "s", ";": "x" };
  const EDGE = "ajsx";
  const kd = (e) => { const k = KM[e.key]; if (!k || !G) return; e.preventDefault(); if (EDGE.includes(k)) G.edge[k] = 1; else G.inp[k] = 1; };
  const ku = (e) => { const k = KM[e.key]; if (k && G && !EDGE.includes(k)) G.inp[k] = 0; };
  function press(k, on) { if (!G) return; if (EDGE.includes(k)) { if (on) G.edge[k] = 1; } else G.inp[k] = on ? 1 : 0; }
  function fightUI(cfg) {
    const body = shell(cfg.title || "🥋 Rissa dei Sogni"); begin(cfg);
    body.innerHTML = `<div class="btStage"><canvas width="${W * SS}" height="${H * SS}"></canvas><button type="button" class="btX" aria-label="Esci">✕</button></div><div class="btCtl"><div class="stkSlot"></div><div class="ab"><button data-k="a">👊<br>Pugno</button><button data-k="j">⤴<br>Salto</button><button data-k="s" class="sp">✦ Speciale<small>${esc(SPEC[G.P.role][0])}</small></button><button data-k="x" class="su">★ SUPER<small>${esc(G.P.sg.name)}</small></button></div></div><p class="sum" style="font-size:11px;opacity:.65;margin-top:6px">Joystick: muovi in tutte le direzioni (anche in profondità). Pugno ×3 = catena con calcio finale. Salto + Pugno = calcio volante. La barra si carica coi colpi: metà = Speciale di ruolo, piena = SUPER della tua saga. Rompi i barili: cibo e monete. Le ondate bloccano lo schermo finché non le batti. Tasti: frecce, J pugno, K salto, L speciale, ; super.</p>`;
    const cv = body.querySelector("canvas"), g = cv.getContext("2d");
    if (window.__stick) { G.stk = window.__stick.make({ size: 126 }); body.querySelector(".stkSlot").appendChild(G.stk.el); }
    body.querySelectorAll("[data-k]").forEach((b) => { const k = b.dataset.k, up = () => { press(k, false); b.classList.remove("on"); }; b.addEventListener("pointerdown", (e) => { e.preventDefault(); safe(() => b.setPointerCapture(e.pointerId), 0); press(k, true); b.classList.add("on"); }); b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("pointerleave", up); });
    const layout = () => { if (OV) OV.classList.toggle("land", innerWidth > innerHeight * 1.1); }; LAY = layout; window.addEventListener("resize", LAY); window.addEventListener("orientationchange", LAY); layout(); body.querySelector(".btX").onclick = () => OV.querySelector(".bar .x").click();
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    let last = performance.now(), acc = 0; const loop = (t) => { if (!OV || !G) return; acc += Math.min(100, t - last); last = t; try { while (acc >= 16.67) { if (!PAUSE) tick(); acc -= 16.67; } draw(g); } catch (er) { acc = 0; if (window.console) console.warn("beat", er); } if (G && !G.over) RAF = requestAnimationFrame(loop); }; RAF = requestAnimationFrame(loop); G.draw = () => draw(g);
  }
  // ------------------------------------------------------------ menu e avventura
  const mine = () => safe(() => S()._load().own.map((id) => S().BY[id]).filter(Boolean), []);
  const lvOf = (id) => safe(() => window.__arena.lvOf((window.__arena.load().xp[id]) | 0) - 1, 0);
  function menu(back) {
    if (back) BACK = back; const body = shell("🥋 Rissa dei Sogni"), r = load(), own = mine();
    if (!own.length) { body.innerHTML = `<p class="sum">Servono carte: sblocca personaggi giocando le saghe, poi torna qui.</p>`; return; }
    if (!r.fighter || !own.some((c) => c.id === r.fighter)) { r.fighter = own.slice().sort((a, b) => b.at + b.df + b.te - (a.at + a.df + a.te))[0].id; save(r); }
    const cur = S().BY[r.fighter], sg = SGOF(cur.id), sorted = own.slice().sort((a, b) => b.at + b.df + b.te - (a.at + a.df + a.te));
    body.innerHTML = `<p class="sum">Beat 'em up a scorrimento: attraversa 3 stadi pieni di rivali, rompi barili, sfonda le ondate e batti il boss di una saga. Il tuo <b>Super</b> è quello della tua saga.</p><div class="sec">Il tuo eroe: ${esc(name(cur.id))} · ${esc(SPEC[rlOf(cur)][0])} · Super «${esc(sg.name)}» (${esc(window.__supers ? window.__supers.FXD[sg.fx] || "" : "")})</div><div class="btPick">${sorted.map((c) => `<div class="c${c.id === r.fighter ? " sel" : ""}" data-c="${c.id}">${safe(() => S().port(c.id), null) ? `<img alt="" src="${S().port(c.id)}">` : "?"}${esc(name(c.id))}</div>`).join("")}</div><div class="sec">Modalità</div><button type="button" class="one" data-go="run">🏙️ Avventura in 3 stadi<small>Stadio di Notte, Tetti al Tramonto, Porto Vecchio · miglior risultato ${r.best}/3 · premi in monete</small></button><button type="button" class="one" data-go="one">⚡ Stadio singolo<small>scegli lo stadio, rivali a caso</small></button>`;
    body.querySelectorAll("[data-c]").forEach((e) => (e.onclick = () => { const x = load(); x.fighter = e.dataset.c; save(x); menu(); }));
    body.querySelector('[data-go="run"]').onclick = () => run(0, null);
    body.querySelector('[data-go="one"]').onclick = () => { const b2 = shell("⚡ Stadio singolo"); b2.innerHTML = STG.map((s, i) => `<button type="button" class="one" data-s="${i}">${esc(s.n)}<small>stadio ${i + 1} · rivali a caso · boss finale</small></button>`).join("") + `<button type="button" class="one" data-go="back">◂ Indietro</button>`; b2.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => run(+b.dataset.s, { single: true }))); b2.querySelector('[data-go="back"]').onclick = () => menu(); };
  }
  function run(stage, st) {
    const r = load(), c = S().BY[r.fighter], me = (st && st.me) || mkP(c, { lv: lvOf(c.id) });
    if (!st || !st.me) { me.meter = 0; } if (st && st.hp != null) me.hp = Math.min(me.hpMax, st.hp + 25);
    fightUI({ me, stage, lvl: lvOf(c.id), score: (st && st.score) | 0, title: `🥋 Stadio ${stage + 1}/3 · ${STG[stage].n}`, onEnd: (res, g) => results(res, g, stage, st, me) });
  }
  function results(res, g, stage, st, me) {
    const a = load(), L = [], win = res === "clear", single = st && st.single, last = stage >= 2;
    const body = shell(win ? (last && !single ? "🏆 Avventura completata" : "✅ Stadio completato") : "💫 Sconfitta");
    if (win) { const coins = (20 * (stage + 1) + (g.coins | 0)) + (last && !single ? 100 : 0); safe(() => window.addCoins(coins), 0); L.push(`+${coins} monete (comprese quelle raccolte).`); if (!single && a.best < stage + 1) a.best = stage + 1; if (last && !single) a.wins++; save(a); if (safe(() => window.__arena, null)) safe(() => { const ar = window.__arena.load(); ar.xp[me.id] = Math.min(60, (ar.xp[me.id] | 0) + 1); window.__arena.save(ar); L.push("📈 +1 esperienza di Arena."); }, 0); }
    else L.push("Riprova: usa il Salto per schivare, il Super per liberarti dalle ondate e mangia il cibo.");
    const next = win && !single && !last;
    body.innerHTML = `<div class="btRes"><h3>${win ? "Vittoria!" : "K.O."}</h3><p class="sum">${esc(me.n)} · punteggio ${g.score} · ${g.kills} rivali battuti.</p>${L.map((l) => `<p class="sum">${l}</p>`).join("")}${win && last && !single ? `<p class="sum"><b>Hai attraversato i tre stadi!</b></p>` : ""}</div>${next ? `<button type="button" class="one" data-go="next">▶ Prossimo stadio<small>${esc(STG[stage + 1].n)} · +25 salute</small></button>` : ""}<button type="button" class="one" data-go="again">↺ ${win ? "Rigioca" : "Riprova"} questo stadio</button><button type="button" class="one" data-go="menu">◂ Menu</button>`;
    const q = (s) => body.querySelector(s); if (next) q('[data-go="next"]').onclick = () => run(stage + 1, { me, hp: me.hp, score: g.score, single });
    q('[data-go="again"]').onclick = () => run(stage, single ? { single: true } : null); q('[data-go="menu"]').onclick = () => menu();
  }
  window.__beat = { open: menu, close, state: () => G, begin, tick, press, mkP, mkE, STG, ET, hurtE, special, superMove, _fast: (v) => { if (G) G.fast = !!v; }, pause: (v) => { PAUSE = !!v; }, load, save, run, fightUI };
})();
