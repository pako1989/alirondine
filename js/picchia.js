// js/picchia.js - «Duello dei Sogni»: picchiaduro 1 contro 1 con i personaggi della Squadra dei Sogni (js/sogni.js).
// Mosse base (pugno, calcio, para, salto), speciale per ruolo (carica con i colpi) e Super con cut-in. Si vince al meglio di tre round.
(function () {
  "use strict";
  if (window.__picchia) return;
  const KEY = "ali-di-rondine.picchia", W = 380, H = 230, GY = 196; // GY = linea del terreno
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const TR = { at: ["Assalto", "🔥"], df: ["Muro", "🛡️"], te: ["Mente", "🎯"] }, BEATS = { at: "te", te: "df", df: "at" };
  const SPEC = { A: ["Tiro Fuoco", "palla di fuoco a distanza"], C: ["Regia in Scatto", "scatto con colpo"], D: ["Muro Vivente", "onda d'urto a terra"], P: ["Parata Totale", "controcolpo"] };
  const ATK = { // su = avvio, ac = frame attivi, rc = recupero
    a: { su: 4, ac: 3, rc: 8, dmg: 6, reach: 34, stun: 13, kb: 2.2, nm: "pugno" }, b: { su: 9, ac: 4, rc: 15, dmg: 12, reach: 44, stun: 19, kb: 5, nm: "calcio" },
  };
  let OV = null, BACK = null, G = null, RAF = 0, PAUSE = false;
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { tour: r.tour | 0, wins: r.wins | 0, fighter: r.fighter || "" }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  const name = (id) => safe(() => S().name(id), id);
  const rlOf = (c) => { if (SPEC[c.role]) return c.role; const e = safe(() => S().eff(c), c); return { at: "A", te: "C", df: "D" }[e.at >= e.df && e.at >= e.te ? "at" : e.df >= e.te ? "df" : "te"]; };
  const trOf = (c) => (c.at >= c.df && c.at >= c.te ? "at" : c.df >= c.te ? "df" : "te");
  const IMG = {}; const imgOf = (id) => { if (IMG[id] !== undefined) return IMG[id]; const u = safe(() => S().port(id), null); if (!u) return (IMG[id] = null); const i = new Image(); i.src = u; return (IMG[id] = i); };
  const SAGCOL = (c) => safe(() => (window.__sogni.SAGHE && window.__sogni.SAGHE[c.saga] ? window.__sogni.SAGHE[c.saga][2] : "#7a5ad8"), "#7a5ad8");
  // ------------------------------------------------------------ combattente
  function mkF(card, side, o) {
    o = o || {}; const e = safe(() => S().eff(card), card), lv = o.lv || 0, m = 1 + lv * 0.04 + (o.m || 0), tr = trOf(e);
    const hpMax = Math.round((92 + e.df * 1.05) * m * (o.hpm || 1));
    return { id: card.id, n: name(card.id), role: SPEC[card.role] ? card.role : { at: "A", te: "C", df: "D" }[tr], tr, col: SAGCOL(card), side, x: side ? 280 : 100, y: 0, vy: 0, dir: side ? -1 : 1, hp: hpMax, hpMax, meter: 0, st: "idle", t: 0, atk: null, hit: false, stun: 0, kbv: 0, dmgM: (0.7 + e.at / 100) * m, spd: 1.5 + e.te / 130, ai: o.ai || 0, combo: 0, counter: 0, rounds: 0, flash: 0, boss: !!o.boss };
  }
  const grounded = (f) => f.y <= 0;
  const busy = (f) => f.st === "atk" || f.st === "hit" || f.st === "ko" || f.st === "spec";
  function startAtk(f, k) {
    if (busy(f) && f.st !== "spec") return; const A = ATK[k]; if (!grounded(f) && k === "b") return;
    f.st = "atk"; f.atk = Object.assign({ k }, A); f.t = 0; f.hit = false;
  }
  function startSpec(f, sup) {
    if (busy(f)) return; if (f.meter < (sup ? 100 : 50)) return; f.meter -= sup ? 100 : 50; f.sup = !!sup; f.st = "spec"; f.t = 0; f.hit = false;
    if (sup) cutin(f);
  }
  const box = (f, reach, rev) => { const d = f.dir; const x0 = f.x + d * 8, x1 = f.x + d * (8 + reach); return [Math.min(x0, x1), Math.max(x0, x1), f.y + 8, f.y + 62]; };
  const hurt = (f) => [f.x - 13, f.x + 13, f.y, f.y + 64];
  const over = (a, b) => a[0] < b[1] && b[0] < a[1] && a[2] < b[3] && b[2] < a[3];
  function damage(att, def, base, stun, kb, opts) {
    opts = opts || {}; let v = base * att.dmgM * (BEATS[att.tr] === def.tr ? 1.15 : BEATS[def.tr] === att.tr ? 0.9 : 1);
    if (def.counter > 0 && !opts.unblock) { def.counter = 0; def.meter = Math.min(100, def.meter + 25); fx(def.x, def.y + 40, "PARATA!", "#7ad87a"); counterHit(def, att); return 0; }
    const blk = def.st === "block" && def.dir === -att.dir && !opts.unblock;
    if (blk) { v *= 0.2; def.x += att.dir * 3; def.meter = Math.min(100, def.meter + v * 0.5); fx(def.x, def.y + 44, "BLOCCO", "#9ad8ff"); G.stop = 2; }
    else { def.st = "hit"; def.t = 0; def.stun = stun; def.kbv = att.dir * kb; def.atk = null; att.combo++; G.stop = 4; fx(def.x, def.y + 40, "✸", "#ffd23f"); def.meter = Math.min(100, def.meter + v * 0.45); }
    def.hp = Math.max(0, def.hp - Math.round(v)); att.meter = Math.min(100, att.meter + v * 0.6); def.flash = 6; G.log = `${att.n} → ${Math.round(v)}`;
    if (def.hp <= 0) { def.st = "ko"; def.t = 0; def.kbv = att.dir * 4; def.vy = 5; def.y = 0.1; }
    return v;
  }
  function counterHit(def, att) { att.st = "hit"; att.t = 0; att.stun = 22; att.kbv = def.dir * 6; att.atk = null; const v = Math.round(14 * def.dmgM * (def.sup ? 2.2 : 1)); att.hp = Math.max(0, att.hp - v); if (att.hp <= 0) { att.st = "ko"; att.vy = 5; att.y = 0.1; } G.stop = 6; }
  function fx(x, y, t, c) { if (G && !G.fast) G.fxs.push({ x, y, t, c, l: 30 }); }
  // un frame di un combattente (inp = ingressi: l r u d a b s x)
  function tickF(f, o, inp) {
    if (f.flash > 0) f.flash--; if (f.counter > 0) f.counter--;
    // fisica
    if (f.y > 0 || f.vy) { f.y += f.vy; f.vy -= 0.55; if (f.y <= 0) { f.y = 0; f.vy = 0; if (f.st === "jump") f.st = "idle"; } }
    if (f.st === "ko") { f.t++; f.x += f.kbv; f.kbv *= 0.9; return; }
    if (f.st === "hit") { f.t++; f.x += f.kbv; f.kbv *= 0.82; if (--f.stun <= 0) { f.st = grounded(f) ? "idle" : "jump"; f.combo = 0; } clamp(f); return; }
    if (f.st === "atk") {
      const a = f.atk; f.t++; if (grounded(f) && a.k === "b") { /* fermo */ }
      if (f.t >= a.su && f.t < a.su + a.ac && !f.hit && over(box(f, a.reach), hurt(o)) && o.st !== "ko") { f.hit = true; damage(f, o, a.dmg, a.stun, a.kb); }
      if (f.t >= a.su + a.ac + a.rc) { f.st = grounded(f) ? "idle" : "jump"; f.atk = null; } clamp(f); return;
    }
    if (f.st === "spec") { specTick(f, o); clamp(f); return; }
    // scelte
    if (f.st === "block" && !inp.d) f.st = "idle";
    if (grounded(f) && (f.st === "idle" || f.st === "walk" || f.st === "block")) {
      f.dir = o.x >= f.x ? 1 : -1;
      if (inp.x) return startSpec(f, true); if (inp.s) return startSpec(f, false);
      if (inp.a) return startAtk(f, "a"); if (inp.b) return startAtk(f, "b");
      if (inp.d) { f.st = "block"; } else { f.st = inp.l || inp.r ? "walk" : "idle"; f.x += ((inp.r ? 1 : 0) - (inp.l ? 1 : 0)) * f.spd; }
      if (inp.u) { f.vy = 9; f.st = "jump"; f.y = 0.1; }
    } else if (f.st === "jump") { f.x += ((inp.r ? 1 : 0) - (inp.l ? 1 : 0)) * f.spd * 0.8; if (inp.a && !f.airHit) { f.airHit = 1; f.st = "atk"; f.atk = Object.assign({ k: "a" }, ATK.a, { su: 2, rc: 10 }); f.t = 0; f.hit = false; } }
    if (grounded(f)) f.airHit = 0;
    clamp(f);
  }
  function specTick(f, o) {
    f.t++; const s = f.sup, m = s ? 2.2 : 1;
    if (f.role === "A") { if (f.t === 12) G.proj.push({ x: f.x + f.dir * 20, y: 34 + f.y, vx: f.dir * (s ? 6 : 5), own: f, d: 13 * m, big: s, l: 90 }); if (f.t >= 30) end(f); }
    else if (f.role === "C") { if (f.t >= 6 && f.t < 20) f.x += f.dir * (s ? 7 : 5.5); if (f.t >= 6 && f.t < 22 && !f.hit && over(box(f, 26), hurt(o)) && o.st !== "ko") { f.hit = true; damage(f, o, 11 * m, 20, 5); } if (f.t >= 34) end(f); }
    else if (f.role === "D") { if (f.t === 12) { G.waves.push({ x: f.x, own: f, l: 18, r: s ? 120 : 80 }); if (grounded(o) && Math.abs(o.x - f.x) < (s ? 120 : 80) && o.st !== "ko") damage(f, o, 12 * m, 22, 6, { unblock: s }); } if (f.t >= 34) end(f); }
    else { if (f.t === 1) { f.counter = s ? 70 : 40; } if (f.t >= (s ? 52 : 40)) { if (s) f.hp = Math.min(f.hpMax, f.hp + 20); end(f); } }
  }
  const end = (f) => { f.st = "idle"; f.sup = false; };
  function clamp(f) { f.x = Math.max(22, Math.min(W - 22, f.x)); }
  function push(a, b) { if (grounded(a) && grounded(b) && Math.abs(a.x - b.x) < 24) { const d = (24 - Math.abs(a.x - b.x)) / 2, s = a.x <= b.x ? -1 : 1; a.x += s * d; b.x -= s * d; clamp(a); clamp(b); } }
  // ------------------------------------------------------------ intelligenza dei rivali (livello 1-5)
  function ai(f, o) {
    const L = f.ai, d = Math.abs(o.x - f.x), inp = {}, r = G.r; if (!L) return inp;
    f.think = (f.think || 0) - 1; if (f.think > 0) return f.keep || inp;
    f.think = Math.max(2, 14 - L * 2); const toward = o.x > f.x ? "r" : "l", away = toward === "r" ? "l" : "r";
    const oAtk = o.st === "atk" || o.st === "spec";
    if (oAtk && d < 70 && r() < 0.15 + L * 0.12) inp.d = 1;
    else if (f.meter >= 100 && d < 140 && r() < 0.5) inp.x = 1;
    else if (f.meter >= 50 && r() < 0.12 + L * 0.03 && (f.role === "A" ? d > 70 : d < 80)) inp.s = 1;
    else if (d > 46) { inp[toward] = 1; if (r() < 0.04 + L * 0.01) inp.u = 1; }
    else if (r() < 0.3 + L * 0.1) { if (r() < 0.55) inp.a = 1; else inp.b = 1; }
    else if (r() < 0.2) inp[away] = 1;
    f.keep = inp; return inp;
  }
  // ------------------------------------------------------------ round e partita
  function begin(cfg) {
    const A = cfg.me, B = cfg.foe;
    G = { cfg, p: A, e: B, proj: [], waves: [], fxs: [], stop: 0, round: 1, time: 45 * 60, phase: "intro", pt: 0, inp: {}, edge: {}, fast: !!cfg.fast, r: cfg.seed != null ? seeded(cfg.seed) : Math.random, over: null, log: "", cut: 0, bg: null };
    return G;
  }
  function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function resetRound() { const p = G.p, e = G.e; [p, e].forEach((f, i) => { f.hp = f.hpMax; f.x = i ? 280 : 100; f.dir = i ? -1 : 1; f.y = 0; f.vy = 0; f.st = "idle"; f.atk = null; f.stun = 0; f.counter = 0; f.combo = 0; f.meter = Math.min(f.meter, 50); }); G.proj = []; G.waves = []; G.time = 45 * 60; G.phase = "intro"; G.pt = 0; }
  function tick() {
    if (!G || G.over) return; if (G.stop > 0) { G.stop--; return; }
    const p = G.p, e = G.e; G.pt++;
    if (G.phase === "intro") { if (G.pt > (G.fast ? 1 : 80)) { G.phase = "fight"; G.pt = 0; } return; }
    if (G.phase === "ko") { tickF(p, e, {}); tickF(e, p, {}); if (G.pt > (G.fast ? 1 : 100)) roundEnd(); return; }
    const pin = Object.assign({}, G.inp, G.edge); G.edge = {};
    tickF(p, e, pin); tickF(e, p, G.cfg.dummy ? {} : ai(e, p)); push(p, e);
    G.proj = G.proj.filter((q) => { q.x += q.vx; q.l--; const t = q.own === p ? e : p; if (t.st !== "ko" && Math.abs(q.x - t.x) < (q.big ? 20 : 14) && q.y < t.y + 66 && q.y > t.y - 8) { damage(q.own, t, q.d, 18, 4); return false; } return q.l > 0 && q.x > -20 && q.x < W + 20; });
    G.waves = G.waves.filter((w) => --w.l > 0); G.fxs = G.fxs.filter((x) => --x.l > 0);
    G.time--;
    if (p.st === "ko" || e.st === "ko" || G.time <= 0) { G.phase = "ko"; G.pt = 0; if (G.time <= 0 && p.st !== "ko" && e.st !== "ko") { (p.hp / p.hpMax >= e.hp / e.hpMax ? e : p).hp = 0; (p.hp / p.hpMax >= e.hp / e.hpMax ? e : p).st = "ko"; (p.hp / p.hpMax >= e.hp / e.hpMax ? e : p).y = 0.1; (p.hp / p.hpMax >= e.hp / e.hpMax ? e : p).vy = 4; } }
  }
  function roundEnd() {
    const p = G.p, e = G.e, win = e.hp <= 0 && p.hp > 0; if (win) p.rounds++; else e.rounds++;
    if (p.rounds >= 2 || e.rounds >= 2) { G.over = p.rounds >= 2 ? "win" : "lose"; if (G.cfg.onEnd) G.cfg.onEnd(G.over, G); return; }
    G.round++; resetRound();
  }
  // ------------------------------------------------------------ disegno
  function draw(g) {
    if (!G.bg) { const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d"); let ok = false; safe(() => { const t = document.createElement("canvas"); t.width = 320; t.height = 200; ok = typeof window.renderDetailedBg === "function" && window.renderDetailedBg(G.cfg.bgKey || "stadium", t.getContext("2d"), 320, 200, 140) === true; if (ok) x.drawImage(t, 0, 0, W, H); }, 0); if (!ok) { const gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, G.e.col); gr.addColorStop(1, "#0b0a18"); x.fillStyle = gr; x.fillRect(0, 0, W, H); } x.fillStyle = "rgba(0,0,0,.35)"; x.fillRect(0, GY, W, H - GY); x.fillStyle = "rgba(255,255,255,.12)"; x.fillRect(0, GY, W, 2); G.bg = c; }
    g.drawImage(G.bg, 0, 0);
    G.waves.forEach((w) => { const k = 1 - w.l / 18; g.strokeStyle = `rgba(255,220,120,${1 - k})`; g.lineWidth = 4; g.beginPath(); g.ellipse(w.x, GY, w.r * k, 10, 0, 0, Math.PI * 2); g.stroke(); });
    [G.p, G.e].forEach((f) => fig(g, f));
    G.proj.forEach((q) => { const r = q.big ? 12 : 8; const gr = g.createRadialGradient(q.x, GY - q.y, 1, q.x, GY - q.y, r); gr.addColorStop(0, "#fff"); gr.addColorStop(0.4, "#ffb347"); gr.addColorStop(1, "rgba(255,80,0,0)"); g.fillStyle = gr; g.beginPath(); g.arc(q.x, GY - q.y, r, 0, 7); g.fill(); });
    g.font = "bold 14px system-ui"; g.textAlign = "center"; G.fxs.forEach((x) => { g.globalAlpha = x.l / 30; g.fillStyle = x.c; g.fillText(x.t, x.x, GY - x.y - (30 - x.l)); }); g.globalAlpha = 1;
    // HUD
    bar(g, 8, 8, 162, G.p, false); bar(g, W - 170, 8, 162, G.e, true);
    g.fillStyle = "#fff"; g.font = "bold 15px system-ui"; g.textAlign = "center"; g.fillText(Math.max(0, Math.ceil(G.time / 60)), W / 2, 22);
    [[G.p, 176 - 40], [G.e, W / 2 + 12]].forEach(([f, x], i) => { for (let k = 0; k < 2; k++) { g.fillStyle = k < f.rounds ? "#ffd23f" : "#ffffff33"; g.beginPath(); g.arc(i ? W / 2 + 14 + k * 11 : W / 2 - 14 - k * 11, 34, 4, 0, 7); g.fill(); } });
    if (G.phase === "intro") { g.fillStyle = "#0008"; g.fillRect(0, 80, W, 56); g.fillStyle = "#ffd23f"; g.font = "900 26px system-ui"; g.fillText(G.pt < 45 ? `ROUND ${G.round}` : "COMBATTI!", W / 2, 118); }
    if (G.phase === "ko") { g.fillStyle = "#0008"; g.fillRect(0, 80, W, 56); g.fillStyle = "#ff5a5a"; g.font = "900 30px system-ui"; g.fillText(G.time <= 0 ? "TEMPO!" : "K.O.", W / 2, 118); }
  }
  function bar(g, x, y, w, f, right) {
    g.fillStyle = "#000a"; g.fillRect(x - 1, y - 1, w + 2, 12); const p = Math.max(0, f.hp / f.hpMax); g.fillStyle = p > 0.5 ? "#7ad87a" : p > 0.25 ? "#e8d03a" : "#e8603a"; const ww = w * p; g.fillRect(right ? x + w - ww : x, y, ww, 10);
    g.fillStyle = "#000a"; g.fillRect(x - 1, y + 13, w + 2, 6); const m = f.meter / 100; g.fillStyle = f.meter >= 100 ? "#ffd23f" : f.meter >= 50 ? "#9ad8ff" : "#5a7ad8"; const mw = w * m; g.fillRect(right ? x + w - mw : x, y + 14, mw, 4);
    g.fillStyle = "#fff"; g.font = "bold 10px system-ui"; g.textAlign = right ? "right" : "left"; g.fillText(f.n, right ? x + w : x, y + 31);
  }
  function fig(g, f) {
    const d = f.dir, bx = f.x, by = GY - f.y, ko = f.st === "ko", sw = f.st === "walk" ? Math.sin(G.pt * 0.4) * 5 : 0, idle = f.st === "idle" ? Math.sin(G.pt * 0.12) * 1.5 : 0;
    g.save(); g.translate(bx, by); if (ko) { g.rotate((Math.min(f.t, 14) / 14) * (Math.PI / 2) * -d); g.translate(0, -4); }
    if (f.flash > 0 && f.flash % 2) g.globalAlpha = 0.55;
    g.strokeStyle = "#111"; g.lineWidth = 5; g.lineCap = "round";
    const a = f.atk, atkT = f.st === "atk" ? Math.min(1, f.t / (a.su + 2)) : 0, kick = f.st === "atk" && a.k === "b";
    // gambe
    g.strokeStyle = "#222"; g.beginPath(); g.moveTo(-4, -26); g.lineTo(-6 - sw, 0); g.moveTo(4, -26); g.lineTo(kick ? d * (6 + 30 * atkT) : 6 + sw, kick ? -14 : 0); g.stroke();
    // busto
    g.fillStyle = f.col; g.strokeStyle = "#111"; g.lineWidth = 2; g.beginPath(); g.roundRect(-10, -52 + idle, 20, 28, 5); g.fill(); g.stroke();
    // braccia
    g.strokeStyle = f.st === "block" ? "#9ad8ff" : "#e8c8a0"; g.lineWidth = 5;
    g.beginPath(); g.moveTo(0, -46 + idle);
    if (f.st === "block") { g.lineTo(d * 12, -54); g.moveTo(0, -46); g.lineTo(d * 14, -42); }
    else if (f.st === "atk" && !kick) { g.lineTo(d * (8 + 28 * atkT), -44); g.moveTo(0, -46); g.lineTo(-d * 8, -34); }
    else if (f.st === "spec") { g.lineTo(d * 20, -50 - Math.sin(f.t * 0.3) * 6); g.moveTo(0, -46); g.lineTo(d * 14, -38); }
    else { g.lineTo(d * 10 + sw * 0.5 * d, -34); g.moveTo(0, -46); g.lineTo(-d * 8, -34 - sw * 0.3); }
    g.stroke();
    // testa: il ritratto del personaggio
    const im = imgOf(f.id), hx = 0, hy = -66 + idle; g.save(); g.beginPath(); g.arc(hx, hy, 14, 0, 7); g.clip(); if (im && im.complete && im.naturalWidth) g.drawImage(im, hx - 15, hy - 15, 30, 30); else { g.fillStyle = "#e8c8a0"; g.fillRect(hx - 15, hy - 15, 30, 30); } g.restore();
    g.strokeStyle = f.tr === "at" ? "#e8603a" : f.tr === "df" ? "#3a8ad8" : "#a85ad8"; g.lineWidth = 2.5; g.beginPath(); g.arc(hx, hy, 14, 0, 7); g.stroke();
    if (f.counter > 0) { g.strokeStyle = "#7ad87a"; g.lineWidth = 2; g.beginPath(); g.arc(0, -38, 34, 0, 7); g.stroke(); }
    if (f.boss) { g.fillStyle = "#ff5a5a"; g.font = "bold 9px system-ui"; g.textAlign = "center"; g.fillText("BOSS", 0, -86); }
    g.restore();
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(bx, GY + 2, 16 - f.y * 0.05, 4, 0, 0, 7); g.fill();
  }
  // ------------------------------------------------------------ cut-in del Super
  function cutin(f) { if (G.fast || !OV) return; const w = OV.querySelector(".pcStage"); if (!w) return; const c = document.createElement("div"); c.className = "pcCut"; const u = safe(() => S().port(f.id), null); c.innerHTML = `${u ? `<img alt="" src="${u}">` : ""}<div><b>${esc(SPEC[f.role][0])} · SUPER</b><span>${esc(f.n)}</span></div>`; w.appendChild(c); G.stop = 38; setTimeout(() => c.remove(), 900); }
  // ------------------------------------------------------------ interfaccia
  function css() {
    if (document.getElementById("pcCss")) return; const st = document.createElement("style"); st.id = "pcCss";
    st.textContent = `.pcOv{position:fixed;inset:0;z-index:314;background:#0c0818;color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto;touch-action:manipulation}.pcOv .wrap{max-width:560px;margin:0 auto;padding:8px 8px 20px}
.pcOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#0c0818;padding:5px 0;z-index:3}.pcOv h2{margin:0;font:900 19px system-ui;color:#ffd23f}.pcOv .x{width:40px;height:40px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#fff;font-size:17px}
.pcOv .sum{font-size:13px;line-height:1.45;opacity:.9}.pcOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}
.pcOv .one{width:100%;min-height:54px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px;margin:5px 0}.pcOv .one small{display:block;font-weight:400;font-size:11px;opacity:.75}.pcOv button:disabled{opacity:.4}
.pcPick{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:6px}.pcPick .c{border-radius:9px;border:2px solid #4a3a6a;background:#1a1428;padding:3px;text-align:center;font-size:9.5px;font-weight:700;cursor:pointer}.pcPick .c.sel{border-color:#ffd23f;box-shadow:0 0 10px #ffd23f88}.pcPick img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;display:block}
.pcStage{position:relative;width:100%;max-width:520px;margin:0 auto}.pcStage canvas{display:block;width:100%;height:auto;border-radius:10px;background:#000}
.pcCtl{display:flex;justify-content:space-between;gap:8px;margin-top:8px;user-select:none;-webkit-user-select:none;touch-action:none}.pcCtl .g{display:grid;gap:6px}.pcCtl .dp{grid-template-columns:repeat(3,58px);grid-template-rows:repeat(2,52px)}.pcCtl .ab{grid-template-columns:repeat(2,70px);grid-template-rows:repeat(2,52px)}
.pcCtl button{border-radius:12px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 13px system-ui;padding:2px;touch-action:none}.pcCtl button.on,.pcCtl button:active{background:#5a3aa8}.pcCtl .sp{background:#2a4a7a}.pcCtl .su{background:#7a5a10;color:#ffe9a8}.pcCtl button small{display:block;font-weight:400;font-size:9px;opacity:.8}
.pcCut{position:absolute;left:0;right:0;top:30%;height:84px;overflow:hidden;z-index:6;pointer-events:none;background:linear-gradient(90deg,#000c,#3a1a6ccc 40%,#000c);border-top:3px solid #ffd23f;border-bottom:3px solid #ffd23f;animation:pcCut .9s forwards;display:flex;align-items:center;gap:12px;padding:0 14px}
.pcCut img{height:74px;width:74px;object-fit:cover;object-position:50% 20%;border-radius:50%;border:2px solid #ffd23f}.pcCut b{font:900 20px system-ui;color:#ffd23f;text-shadow:0 2px 0 #000}.pcCut span{display:block;font-size:12px;color:#fff}
@keyframes pcCut{0%{opacity:0;transform:scaleY(.1)}12%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0}}.pcRes{text-align:center;margin:12px 0}.pcRes h3{font:900 24px system-ui;margin:4px 0}`;
    document.head.appendChild(st);
  }
  function shell(title) { css(); stop(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "pcOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const live = G && !G.over; stop(); if (live) return menu(); const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function stop() { cancelAnimationFrame(RAF); RAF = 0; window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); G = G && G.over ? G : null; if (G && !G.over) G = null; }
  function close() { stop(); G = null; if (OV) { OV.remove(); OV = null; } }
  const KM = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d", a: "l", d: "r", w: "u", s: "d", j: "a", k: "b", l: "s", ";": "x" };
  const kd = (e) => { const k = KM[e.key]; if (!k || !G) return; e.preventDefault(); if ("abxs".includes(k)) G.edge[k] = 1; else G.inp[k] = 1; };
  const ku = (e) => { const k = KM[e.key]; if (k && G && !"abxs".includes(k)) G.inp[k] = 0; };
  function press(k, on) { if (!G) return; if ("abxs".includes(k)) { if (on) G.edge[k] = 1; } else G.inp[k] = on ? 1 : 0; }
  function fightUI(cfg) {
    const body = shell(cfg.title || "🥊 Duello dei Sogni"); begin(cfg);
    body.innerHTML = `<div class="pcStage"><canvas width="${W}" height="${H}"></canvas></div><div class="pcCtl"><div class="g dp"><button data-k="u" style="grid-column:2">▲</button><button data-k="l" style="grid-row:2">◀</button><button data-k="d" style="grid-row:2">🛡️</button><button data-k="r" style="grid-row:2">▶</button></div><div class="g ab"><button data-k="a">👊 Pugno</button><button data-k="b">🦵 Calcio</button><button data-k="s" class="sp">✦ Speciale<small>${esc(SPEC[G.p.role][0])}</small></button><button data-k="x" class="su">★ SUPER<small>barra piena</small></button></div></div><p class="sum" style="font-size:11px;opacity:.65;margin-top:6px">🛡️ tieni premuto per pararti. Gli speciali costano mezza barra, il Super tutta. Tasti: frecce/WASD, J pugno, K calcio, L speciale, ; super. Tratto favorevole: +15% danni.</p>`;
    const cv = body.querySelector("canvas"), g = cv.getContext("2d");
    body.querySelectorAll("[data-k]").forEach((b) => { const k = b.dataset.k, up = () => { press(k, false); b.classList.remove("on"); }; b.addEventListener("pointerdown", (e) => { e.preventDefault(); b.setPointerCapture && safe(() => b.setPointerCapture(e.pointerId), 0); press(k, true); b.classList.add("on"); }); b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("pointerleave", up); });
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    let last = performance.now(), acc = 0;
    const loop = (t) => { if (!OV || !G) return; acc += Math.min(100, t - last); last = t; while (acc >= 16.67) { if (!PAUSE) tick(); acc -= 16.67; } draw(g); if (G && !G.over) RAF = requestAnimationFrame(loop); };
    RAF = requestAnimationFrame(loop); G.draw = () => draw(g);
  }
  // ------------------------------------------------------------ menu, torneo
  const mine = () => safe(() => S()._load().own.map((id) => S().BY[id]).filter(Boolean), []);
  const lvOf = (id) => safe(() => window.__arena.lvOf((window.__arena.load().xp[id]) | 0) - 1, 0);
  function menu(back) {
    if (back) BACK = back; const body = shell("🥊 Duello dei Sogni"), r = load(), own = mine();
    if (!own.length) { body.innerHTML = `<p class="sum">Servono carte: sblocca personaggi giocando le saghe, poi torna qui.</p>`; return; }
    if (!r.fighter || !own.some((c) => c.id === r.fighter)) { r.fighter = own.slice().sort((a, b) => b.at + b.df + b.te - (a.at + a.df + a.te))[0].id; save(r); }
    const cur = S().BY[r.fighter];
    body.innerHTML = `<p class="sum">Picchiaduro 1 contro 1 con i personaggi delle saghe. Pugno, calcio, para, salto; lo <b>Speciale</b> dipende dal ruolo e il <b>Super</b> ha il cut-in. Al meglio di tre round.</p><div class="sec">Il tuo combattente: ${esc(name(cur.id))} · ${esc(({ A: "Attaccante", C: "Centrocampista", D: "Difensore", P: "Portiere" })[rlOf(cur)])} · ${TR[trOf(cur)][1]} ${TR[trOf(cur)][0]} · speciale «${esc(SPEC[rlOf(cur)][0])}»</div><div class="pcPick">${own.slice().sort((a, b) => b.at + b.df + b.te - (a.at + a.df + a.te)).map((c) => `<div class="c${c.id === r.fighter ? " sel" : ""}" data-c="${c.id}">${safe(() => S().port(c.id), null) ? `<img alt="" src="${S().port(c.id)}">` : "?"}${esc(name(c.id))}</div>`).join("")}</div><div class="sec">Modalità</div><button type="button" class="one" data-go="tour">🏆 Torneo dei Sogni<small>5 incontri, un boss in finale · ${r.tour}/5 superati · premi in monete</small></button><button type="button" class="one" data-go="quick">⚡ Incontro rapido<small>un rivale a caso, livello a scelta</small></button><button type="button" class="one" data-go="train">🥋 Allenamento<small>un sacco da boxe che non risponde: prova mosse e Super</small></button>`;
    body.querySelectorAll("[data-c]").forEach((e) => (e.onclick = () => { const x = load(); x.fighter = e.dataset.c; save(x); menu(); }));
    body.querySelector('[data-go="tour"]').onclick = () => tour(0);
    body.querySelector('[data-go="quick"]').onclick = quickPick; body.querySelector('[data-go="train"]').onclick = train;
  }
  const foeCard = (rand, theme, lvl) => { const pool = S().CARDS.filter((c) => !theme || c.saga === theme), p = pool.length ? pool : S().CARDS; return p[Math.floor(rand() * p.length)]; };
  const meCfg = (r) => { const c = S().BY[r.fighter]; return mkF(c, 0, { lv: lvOf(c.id) }); };
  function quickPick() {
    const body = shell("⚡ Incontro rapido");
    body.innerHTML = `<p class="sum">Scegli la difficoltà del rivale.</p>${[1, 2, 3, 4, 5].map((l) => `<button type="button" class="one" data-l="${l}">Livello ${l}${"★".repeat(l)}<small>${["molto facile", "facile", "medio", "difficile", "implacabile"][l - 1]} · ${8 * l} monete</small></button>`).join("")}<button type="button" class="one" data-go="back">◂ Indietro</button>`;
    body.querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => match(+b.dataset.l, null, false, "quick")));
    body.querySelector('[data-go="back"]').onclick = () => menu();
  }
  function train() { const r = load(), me = meCfg(r), foe = mkF(foeCard(Math.random), 1, { ai: 0 }); me.meter = 100; fightUI({ me, foe, dummy: true, title: "🥋 Allenamento", onEnd: () => {}, bgKey: "stadium" }); G.p.rounds = 0; G.e.hpMax = G.e.hp = 9999; }
  function sagas() { return [...new Set(S().CARDS.map((c) => c.saga))].filter((k) => S().CARDS.filter((c) => c.saga === k).length >= 2); }
  function tour(i) {
    const ss = sagas(), th = ss[(new Date().getDate() * 3 + i * 5) % ss.length]; match(i + 1, th, i === 4, "tour", i);
  }
  function match(lvl, theme, boss, mode, idx) {
    const r = load(), rand = Math.random, me = meCfg(r), c = foeCard(rand, theme), foe = mkF(c, 1, { ai: lvl, m: (lvl - 3) * 0.06, boss, hpm: boss ? 1.25 : 1 });
    fightUI({ me, foe, title: mode === "tour" ? `🏆 Torneo · incontro ${idx + 1}/5` : `⚡ Livello ${lvl}`, bgKey: "stadium", onEnd: (res, g) => {
      const a = load(), L = [], win = res === "win";
      if (win) { a.wins++; const coins = mode === "tour" ? 15 * (idx + 1) + (boss ? 85 : 0) : 8 * lvl; safe(() => window.addCoins(coins), 0); L.push(`+${coins} monete.`); if (mode === "tour" && a.tour < idx + 1) a.tour = idx + 1; save(a); if (safe(() => window.__arena, null)) { const ar = window.__arena.load(); ar.xp[me.id] = Math.min(60, (ar.xp[me.id] | 0) + 1); window.__arena.save(ar); L.push("📈 +1 esperienza di Arena."); } }
      else L.push("Riprova: studia le sue mosse e usa Para e Speciale al momento giusto.");
      const body = shell(win ? "🏆 Vittoria" : "💫 Sconfitta");
      const next = win && mode === "tour" && idx < 4;
      body.innerHTML = `<div class="pcRes"><h3>${win ? "Vittoria!" : "Sconfitta"}</h3><p class="sum">${esc(me.n)} ${win ? "batte" : "perde contro"} ${esc(foe.n)} (${g.p.rounds}-${g.e.rounds}).</p>${L.map((l) => `<p class="sum">${l}</p>`).join("")}${win && mode === "tour" && idx === 4 ? `<p class="sum"><b>Torneo dei Sogni vinto!</b></p>` : ""}</div>${next ? `<button type="button" class="one" data-go="next">▶ Prossimo incontro<small>${idx + 2}/5${idx + 1 === 4 ? " · BOSS" : ""}</small></button>` : ""}<button type="button" class="one" data-go="again">↺ Rivincita<small>stesso livello</small></button><button type="button" class="one" data-go="menu">◂ Menu<small>torna al Duello dei Sogni</small></button>`;
      const q = (s) => body.querySelector(s); if (next) q('[data-go="next"]').onclick = () => tour(idx + 1);
      q('[data-go="again"]').onclick = () => (mode === "tour" ? tour(idx) : match(lvl, theme, boss, mode, idx)); q('[data-go="menu"]').onclick = () => menu();
    } });
  }
  window.__picchia = { open: menu, close, state: () => G, begin, tick, press, mkF, _fast: (v) => { if (G) G.fast = !!v; }, pause: (v) => { PAUSE = !!v; }, match, load, save, fightUI, SPEC };
})();
