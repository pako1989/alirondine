// js/picchia.js - «Duello dei Sogni»: picchiaduro 1 contro 1 con i personaggi della Squadra dei Sogni (js/sogni.js).
// Joystick analogico (js/stick.js) o tasti. Mosse: pugno (catena a 3 colpi), calcio, anti-aereo (giù + pugno), presa, para, salto con colpi in aria,
// scatto (doppio tocco) e schivata, speciale per ruolo e Super con cut-in. Combo con danno che cala, atterramenti, hit-stop, scosse, scenari per saga. Al meglio di tre round.
(function () {
  "use strict";
  if (window.__picchia) return;
  const KEY = "ali-di-rondine.picchia", W = 380, H = 230, GY = 196, SS = 2; // GY = linea del terreno
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const TR = { at: ["Assalto", "🔥"], df: ["Muro", "🛡️"], te: ["Mente", "🎯"] }, BEATS = { at: "te", te: "df", df: "at" };
  const SPEC = { A: ["Tiro Fuoco", "palla di fuoco a distanza"], C: ["Regia in Scatto", "scatto con colpo"], D: ["Muro Vivente", "onda d'urto a terra"], P: ["Parata Totale", "controcolpo"] };
  const ATK = { // su = avvio, ac = frame attivi, rc = recupero
    a: { su: 4, ac: 3, rc: 8, dmg: 6, reach: 34, stun: 13, kb: 2.2, nm: "pugno" }, b: { su: 9, ac: 4, rc: 15, dmg: 12, reach: 44, stun: 19, kb: 5, nm: "calcio" },
    u: { su: 6, ac: 4, rc: 18, dmg: 10, reach: 30, stun: 24, kb: 2, launch: 8.5, kd: true, nm: "anti-aereo" },
    j: { su: 3, ac: 14, rc: 4, dmg: 9, reach: 36, stun: 16, kb: 3, nm: "calcio volante" },
    t: { su: 5, ac: 2, rc: 16, dmg: 15, reach: 26, stun: 30, kb: 4, kd: true, launch: 5, grab: true, nm: "presa" },
  };
  let OV = null, BACK = null, G = null, RAF = 0, PAUSE = false;
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { tour: r.tour | 0, wins: r.wins | 0, fighter: r.fighter || "" }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  const name = (id) => safe(() => S().name(id), id);
  const rlOf = (c) => { if (SPEC[c.role]) return c.role; const e = safe(() => S().eff(c), c); return { at: "A", te: "C", df: "D" }[e.at >= e.df && e.at >= e.te ? "at" : e.df >= e.te ? "df" : "te"]; };
  const trOf = (c) => (c.at >= c.df && c.at >= c.te ? "at" : c.df >= c.te ? "df" : "te");
  const IMG = {}; const imgOf = (id) => { if (IMG[id] !== undefined) return IMG[id]; const u = safe(() => S().port(id), null); if (!u) return (IMG[id] = null); const i = new Image(); i.src = u; return (IMG[id] = i); };
  const SAGCOL = (c) => safe(() => (window.__sogni.SAGHE && window.__sogni.SAGHE[c.saga] ? window.__sogni.SAGHE[c.saga][2] : "#7a5ad8"), "#7a5ad8");
  const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  // ------------------------------------------------------------ combattente
  function mkF(card, side, o) {
    o = o || {}; const e = safe(() => S().eff(card), card), lv = o.lv || 0, m = 1 + lv * 0.04 + (o.m || 0), tr = trOf(e);
    const hpMax = Math.round((92 + e.df * 1.05) * m * (o.hpm || 1));
    return { id: card.id, n: name(card.id), saga: card.saga || "", role: SPEC[card.role] ? card.role : { at: "A", te: "C", df: "D" }[tr], tr, col: SAGCOL(card), side, x: side ? 280 : 100, y: 0, vy: 0, dir: side ? -1 : 1, hp: hpMax, hpMax, meter: 0, st: "idle", t: 0, atk: null, hit: false, stun: 0, kbv: 0, dmgM: (0.7 + e.at / 100) * m, spd: 1.5 + e.te / 130, ai: o.ai || 0, combo: 0, hits: 0, chain: 0, counter: 0, rounds: 0, flash: 0, inv: 0, ghost: 0, ice: 0, sg: safe(() => window.__supers.of(card.id), { fx: "fire", name: "Super", col: "#ffb347", saga: "" }), boss: !!o.boss, dt: 0, dd: 0, pd: 0, pu: 0, parry: 0, pblk: 0 };
  }
  const grounded = (f) => f.y <= 0;
  const busy = (f) => f.st === "atk" || f.st === "hit" || f.st === "ko" || f.st === "spec" || f.st === "down";
  function startAtk(f, k, force) {
    if (!force && busy(f) && f.st !== "spec") return; if (!grounded(f) && k !== "j") return; if (f.st === "spec" && !force) return;
    f.chain = force ? f.chain + 1 : 0; const A = ATK[k]; f.st = "atk"; f.atk = Object.assign({ k }, A); f.t = 0; f.hit = false;
  }
  function startSpec(f, sup, force) {
    if (busy(f) && !force) return; if (f.meter < (sup ? 100 : 50)) return; f.meter -= sup ? 100 : 50; f.sup = !!sup; f.st = "spec"; f.t = 0; f.hit = false; f.atk = null;
    if (sup) cutin(f);
  }
  const box = (f, reach) => { const d = f.dir; const x0 = f.x + d * 8, x1 = f.x + d * (8 + reach); return [Math.min(x0, x1), Math.max(x0, x1), f.y + 8, f.y + 62]; };
  const hurt = (f) => [f.x - 13, f.x + 13, f.y, f.y + 64];
  const over = (a, b) => a[0] < b[1] && b[0] < a[1] && a[2] < b[3] && b[2] < a[3];
  function spark(x, y, col, n, big) { if (!G || G.fast) return; for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = (big ? 2.6 : 1.8) * (0.4 + Math.random()); G.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s + 1, l: 16 + (Math.random() * 10) | 0, c: col, s: big ? 2.6 : 1.8 }); } G.bursts.push({ x, y, l: 9, big: !!big, c: col }); }
  function damage(att, def, base, stun, kb, opts) {
    opts = opts || {}; if (def.st === "down" || def.st === "ko" || def.inv > 0) return 0;
    let v = base * att.dmgM * (BEATS[att.tr] === def.tr ? 1.15 : BEATS[def.tr] === att.tr ? 0.9 : 1);
    if (def.counter > 0 && !opts.unblock) { def.counter = 0; def.meter = Math.min(100, def.meter + 25); fx(def.x, def.y + 40, "PARATA!", "#7ad87a"); counterHit(def, att); return 0; }
    const blk = def.st === "block" && def.dir === -att.dir && !opts.unblock;
    if (blk) {
      if (def.parry > 0) {
        def.parry = 0;
        def.meter = Math.min(100, def.meter + 25);
        fx(def.x, def.y + 44, "✨ PARRY PERFETTO!", "#ffd23f");
        spark(def.x + att.dir * -8, def.y + 44, "#ffd23f", 12, true);
        G.stop = 10; G.shake = Math.max(G.shake, 6);
        att.st = "hit"; att.t = 0; att.stun = 36; att.atk = null; att.kbv = -att.dir * 3;
        G.log = `✨ PARRY PERFETTO di ${def.n}!`;
        return 0;
      }
      v *= 0.2; def.x += att.dir * 3; def.meter = Math.min(100, def.meter + v * 0.5); fx(def.x, def.y + 44, "BLOCCO", "#9ad8ff"); G.stop = 2; spark(def.x + att.dir * -8, def.y + 44, "#9ad8ff", 5); G.shake = Math.max(G.shake, 1.5);
    }
    else {
      def.hits++; v *= Math.max(0.45, 1 - 0.12 * (def.hits - 1)); def.st = "hit"; def.t = 0; def.stun = stun; def.kbv = att.dir * kb; def.atk = null; att.combo = def.hits; if (opts.freeze) { def.stun = opts.freeze; def.kbv = 0; def.ice = opts.freeze; fx(def.x, def.y + 60, "GELATO!", "#9ad8ff"); }
      if (opts.kd || opts.launch) { def.kd = true; def.vy = opts.launch || 6; def.y = Math.max(def.y, 0.1); }
      G.stop = opts.kd ? 7 : 4; G.shake = Math.max(G.shake, opts.kd ? 6 : 3); spark(def.x, def.y + 42, att.sup ? "#fff3a0" : "#ffd23f", opts.kd ? 12 : 7, !!opts.kd);
      fx(def.x, def.y + 40, opts.kd ? "✸✸" : "✸", "#ffd23f"); def.meter = Math.min(100, def.meter + v * 0.45); G.cmb = { n: def.hits, who: att, l: 100 };
    }
    def.hp = Math.max(0, def.hp - Math.round(v)); att.meter = Math.min(100, att.meter + v * 0.6); def.flash = 6; G.log = `${att.n} → ${Math.round(v)}`;
    if (def.hp <= 0) { def.st = "ko"; def.t = 0; def.kbv = att.dir * 4; def.vy = 6; def.y = 0.1; def.kd = false; G.stop = 14; G.shake = 9; }
    return v;
  }
  function counterHit(def, att) { att.st = "hit"; att.t = 0; att.stun = 22; att.kbv = def.dir * 6; att.atk = null; const v = Math.round(14 * def.dmgM * (def.sup ? 2.2 : 1)); att.hp = Math.max(0, att.hp - v); if (att.hp <= 0) { att.st = "ko"; att.vy = 5; att.y = 0.1; } G.stop = 6; spark(att.x, att.y + 42, "#7ad87a", 9, true); G.shake = 5; }
  function fx(x, y, t, c) { if (G && !G.fast) G.fxs.push({ x, y, t, c, l: 30 }); }
  // un frame di un combattente (inp = ingressi: l r u d a b s x t h, m = intensità del joystick)
  function tickF(f, o, inp) {
    if (f.flash > 0) f.flash--; if (f.counter > 0) f.counter--; if (f.inv > 0) f.inv--; if (f.parry > 0) f.parry--;
    // fisica
    if (f.y > 0 || f.vy) { f.y += f.vy; f.vy -= 0.55; if (f.y <= 0) { f.y = 0; f.vy = 0; if (f.st === "jump") f.st = "idle"; } }
    if (f.st === "ko") { f.t++; f.x += f.kbv; f.kbv *= 0.9; clamp(f); return; }
    if (f.st === "down") { f.t++; f.x += f.kbv; f.kbv *= 0.8; if (f.t === 1 && !G.fast) G.parts.push({ x: f.x, y: 2, vx: 0.6, vy: 0.8, l: 14, c: "#ffffff88", s: 3 }); if (f.t >= 36) { f.st = "idle"; f.hits = 0; f.inv = 24; } clamp(f); return; }
    if (f.st === "hit") {
      f.t++; f.x += f.kbv; f.kbv *= 0.82; f.stun--; if (f.ice > 0) f.ice--;
      if (f.kd && f.y <= 0 && f.t > 2) { f.st = "down"; f.t = 0; f.kd = false; f.kbv = -f.dir * 2.5; G.shake = Math.max(G.shake, 4); fx(f.x, 20, "BUM", "#fff"); }
      else if (f.stun <= 0 && !f.kd) { f.st = grounded(f) ? "idle" : "jump"; f.combo = 0; f.hits = 0; }
      clamp(f); return;
    }
    if (f.st === "atk") {
      const a = f.atk; f.t++;
      if (f.t >= a.su && f.t < a.su + a.ac && !f.hit && over(box(f, a.reach), hurt(o)) && o.st !== "ko") {
        if (a.grab && (!grounded(o) || o.st === "hit" || o.st === "down")) { /* presa a vuoto */ }
        else { f.hit = true; const fin = a.k === "a" && f.chain >= 2; damage(f, o, a.dmg * (fin ? 1.5 : 1), a.stun, fin ? 5 : a.kb, { kd: a.kd || fin, launch: a.launch || (fin ? 5 : 0), unblock: !!a.grab }); if (a.grab) { o.dir = o.x < f.x ? 1 : -1; } }
      }
      // catena: dopo un colpo a segno si può annullare in un altro colpo o in uno speciale
      if (f.hit && f.t > a.su + 1 && (a.k === "a" || a.k === "b") && o.st !== "ko") {
        if (inp.x && f.meter >= 100) return startSpec(f, true, true); if (inp.s && f.meter >= 50) return startSpec(f, false, true);
        if (a.k === "a" && inp.b) return startAtk(f, "b", true); if (a.k === "a" && inp.a && f.chain < 2) return startAtk(f, "a", true);
      }
      if (f.t >= a.su + a.ac + a.rc) { f.st = grounded(f) ? "idle" : "jump"; f.atk = null; f.chain = 0; } clamp(f); return;
    }
    if (f.st === "spec") { specTick(f, o); clamp(f); return; }
    if (f.st === "dash") {
      f.t++; f.x += f.dv * Math.max(0, 1 - f.t / 13); if (!G.fast && f.t % 2 === 0) G.ghosts.push({ x: f.x, y: f.y, dir: f.dir, col: f.col, l: 8 });
      if (f.t > 4 && inp.a) return startAtk(f, "a", false, (f.st = "idle")); if (f.t > 4 && inp.b) return startAtk(f, "b", false, (f.st = "idle"));
      if (f.t >= 13) f.st = "idle"; clamp(f); return;
    }
    // scelte
    const isDown = !!inp.d;
    if (isDown && !f.pblk) { f.parry = 7; }
    f.pblk = isDown;
    if (f.st === "block" && !inp.d) f.st = "idle";
    const dr = inp.r ? 1 : inp.l ? -1 : 0; if (dr && dr !== f.pd) { if (f.dt > 0 && f.dd === dr) { f.dtrig = 1; f.dt = 0; } else { f.dt = 14; f.dd = dr; } } f.pd = dr; if (f.dt > 0) f.dt--;
    if (grounded(f) && (f.st === "idle" || f.st === "walk" || f.st === "block")) {
      f.dir = o.x >= f.x ? 1 : -1;
      if (inp.x) return startSpec(f, true); if (inp.s) return startSpec(f, false);
      if (inp.t) return startAtk(f, "t"); if (inp.d && inp.a) return startAtk(f, "u"); if (inp.a) return startAtk(f, "a"); if (inp.b) return startAtk(f, "b");
      if (f.dtrig || inp.h) { const ddr = f.dtrig ? dr || f.dd : inp.r ? 1 : inp.l ? -1 : f.dir; f.dtrig = 0; f.st = "dash"; f.t = 0; f.dv = ddr * 6.8; f.inv = 14; fx(f.x, f.y + 46, "⚡ SCHIVATA!", "#c084fc"); return; }
      if (inp.d) { f.st = "block"; } else { f.st = inp.l || inp.r ? "walk" : "idle"; f.x += dr * f.spd * (inp.m ? clampN(inp.m, 0.55, 1) : 1); }
      if (inp.u && !f.pu) { f.vy = 9; f.st = "jump"; f.y = 0.1; f.jx = dr; }
    } else if (f.st === "jump") { f.x += dr * f.spd * 0.85; if ((inp.a || inp.b) && !f.airHit) { f.airHit = 1; f.st = "atk"; f.atk = Object.assign({ k: inp.b ? "j" : "a" }, inp.b ? ATK.j : ATK.a, inp.b ? {} : { su: 2, rc: 10 }); f.t = 0; f.hit = false; f.chain = 0; } }
    f.pu = inp.u ? 1 : 0; if (grounded(f)) f.airHit = 0;
    clamp(f);
  }
  // Super firmati per saga (fx da js/supers.js): ognuno ha la sua animazione e il suo effetto
  function supTick(f, o) {
    f.t++; const t = f.t, fx = f.sg.fx, col = f.sg.col, d = f.dir, m = 2.2, hb = (r) => over(box(f, r), hurt(o)) && o.st !== "ko";
    if (fx === "fire") { if (t === 14) G.proj.push({ x: f.x + d * 20, y: 34 + f.y, vx: d * 6, own: f, d: 13 * m, big: true, l: 90, c: col, opt: { kd: true } }); if (t >= 36) end(f); }
    else if (fx === "thunder") { if (t < 18) f.tx = o.x; if (t === 26) { G.bolts.push({ x: f.tx, l: 16, c: col }); G.shake = 9; if (Math.abs(o.x - f.tx) < 26 && o.st !== "ko") damage(f, o, 26, 24, 6, { unblock: true, kd: true }); } if (t >= 42) end(f); }
    else if (fx === "curve") { if (t === 10) G.proj.push({ x: f.x + d * 16, y: 96 + f.y, vx: d * 4.2, k: "arc", own: f, d: 12 * m, big: true, l: 80, c: col, opt: { kd: true }, home: o }); if (t >= 34) end(f); }
    else if (fx === "zig") { if (t >= 6 && t < 26) { f.x += d * 5; if (!G.fast && t % 2 === 0) G.ghosts.push({ x: f.x, y: f.y, dir: d, col, l: 9 }); } if ((t === 10 || t === 16 || t === 22) && hb(34)) damage(f, o, (t === 22 ? 10 : 6) * m * 0.6, 12, t === 22 ? 5 : 2, { kd: t === 22 }); if (t >= 36) end(f); }
    else if (fx === "spiral") { if (t === 10) G.proj.push({ x: f.x + d * 20, y: 34 + f.y, vx: d * 2.2, k: "tor", own: f, d: 16 * m, big: true, l: 80, c: col, opt: { kd: true, launch: 7 } }); if (t >= 34) end(f); }
    else if (fx === "vanish") { if (t === 2) { f.ghost = 1; f.inv = Math.max(f.inv, 22); } if (t === 10) { f.x = clamp2(o.x + (f.x < o.x ? 26 : -26)); f.dir = o.x > f.x ? 1 : -1; f.ghost = 0; spark(f.x, f.y + 40, col, 10, true); } if ((t === 14 || t === 20 || t === 26) && hb(34)) damage(f, o, (t === 26 ? 9 : 6) * m * 0.7, 12, t === 26 ? 5 : 2, { kd: t === 26 }); if (t >= 40) end(f); }
    else if (fx === "ice") { if (t === 12) G.proj.push({ x: f.x + d * 20, y: 34 + f.y, vx: d * 6.5, k: "ice", own: f, d: 9 * m, l: 60, c: col, opt: { freeze: 80 } }); if (t >= 30) end(f); }
    else if (fx === "change") { if (t === 8) G.proj.push({ x: f.x + d * 20, y: 36 + f.y, vx: d * 1.1, k: "orb", age: 0, own: f, d: 22 * m, big: true, l: 100, c: col, opt: { kd: true } }); if (t >= 34) end(f); }
    else { if (t >= 6 && t < 24) { f.x += d * 8; if (!G.fast && t % 2 === 0) G.ghosts.push({ x: f.x, y: f.y, dir: d, col, l: 9 }); if (!f.hit && hb(30)) { f.hit = true; damage(f, o, 24, 22, 4, { unblock: true, kd: true }); } } if (t >= 38) end(f); }
  }
  const clamp2 = (x) => Math.max(22, Math.min(W - 22, x));
  function specTick(f, o) {
    if (f.sup) return supTick(f, o);
    f.t++; const s = f.sup, m = s ? 2.2 : 1;
    if (f.role === "A") { if (f.t === 12) G.proj.push({ x: f.x + f.dir * 20, y: 34 + f.y, vx: f.dir * 5, own: f, d: 13, big: false, l: 90, c: f.sg.col }); if (f.t >= 30) end(f); }
    else if (f.role === "C") { if (f.t >= 6 && f.t < 20) { f.x += f.dir * (s ? 7 : 5.5); if (!G.fast && f.t % 2 === 0) G.ghosts.push({ x: f.x, y: f.y, dir: f.dir, col: f.col, l: 9 }); } if (f.t >= 6 && f.t < 22 && !f.hit && over(box(f, 26), hurt(o)) && o.st !== "ko") { f.hit = true; damage(f, o, 11 * m, 20, 5, { kd: s }); } if (f.t >= 34) end(f); }
    else if (f.role === "D") { if (f.t === 12) { G.waves.push({ x: f.x, own: f, l: 18, r: s ? 120 : 80 }); G.shake = 6; if (grounded(o) && Math.abs(o.x - f.x) < (s ? 120 : 80) && o.st !== "ko") damage(f, o, 12 * m, 22, 6, { unblock: s, kd: true, launch: 4 }); } if (f.t >= 34) end(f); }
    else { if (f.t === 1) { f.counter = s ? 70 : 40; } if (f.t >= (s ? 52 : 40)) { if (s) f.hp = Math.min(f.hpMax, f.hp + 20); end(f); } }
  }
  const end = (f) => { f.st = "idle"; f.sup = false; };
  function clamp(f) { f.x = Math.max(22, Math.min(W - 22, f.x)); }
  function push(a, b) { if (grounded(a) && grounded(b) && Math.abs(a.x - b.x) < 24 && a.st !== "down" && b.st !== "down") { const d = (24 - Math.abs(a.x - b.x)) / 2, s = a.x <= b.x ? -1 : 1; a.x += s * d; b.x -= s * d; clamp(a); clamp(b); } }
  // ------------------------------------------------------------ intelligenza dei rivali (livello 1-5)
  function ai(f, o) {
    const L = f.ai, d = Math.abs(o.x - f.x), inp = {}, r = G.r; if (!L) return inp;
    if (f.st === "atk" && f.hit && f.t > f.atk.su + 1 && (f.atk.k === "a") && r() < 0.18 + L * 0.1) return r() < 0.5 ? { b: 1 } : { a: 1 };
    f.think = (f.think || 0) - 1; if (f.think > 0) return f.keep || inp;
    f.think = Math.max(2, 14 - L * 2); const toward = o.x > f.x ? "r" : "l", away = toward === "r" ? "l" : "r";
    const oAtk = o.st === "atk" || o.st === "spec";
    if (oAtk && d < 70 && r() < 0.15 + L * 0.12) inp.d = 1;
    else if (o.st !== "jump" && !grounded(o) && d < 60 && L >= 2 && r() < 0.3) { inp.d = 1; inp.a = 1; }
    else if (f.meter >= 100 && d < 140 && r() < 0.5) inp.x = 1;
    else if (f.meter >= 50 && r() < 0.12 + L * 0.03 && (f.role === "A" ? d > 70 : d < 80)) inp.s = 1;
    else if (o.st === "block" && d < 34 && r() < 0.15 + L * 0.08) inp.t = 1;
    else if (d > 96 && L >= 3 && r() < 0.18) { inp.h = 1; inp[toward] = 1; }
    else if (d > 46) { inp[toward] = 1; if (r() < 0.04 + L * 0.01) inp.u = 1; }
    else if (r() < 0.3 + L * 0.1) { if (r() < 0.55) inp.a = 1; else inp.b = 1; }
    else if (r() < 0.2) { inp[away] = 1; if (L >= 4 && r() < 0.3) inp.h = 1; }
    f.keep = inp; return inp;
  }
  // ------------------------------------------------------------ round e partita
  function begin(cfg) {
    const A = cfg.me, B = cfg.foe;
    G = { cfg, p: A, e: B, proj: [], waves: [], fxs: [], parts: [], bursts: [], ghosts: [], bolts: [], stop: 0, shake: 0, cmb: null, round: 1, time: 45 * 60, phase: "intro", pt: 0, inp: {}, edge: {}, stk: null, fast: !!cfg.fast, r: cfg.seed != null ? seeded(cfg.seed) : Math.random, over: null, log: "", cut: 0, bg: null, sl: 0, camx: W / 2, zoom: 1 };
    return G;
  }
  function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function resetRound() { const p = G.p, e = G.e; [p, e].forEach((f, i) => { f.hp = f.hpMax; f.x = i ? 280 : 100; f.dir = i ? -1 : 1; f.y = 0; f.vy = 0; f.st = "idle"; f.atk = null; f.stun = 0; f.counter = 0; f.combo = 0; f.hits = 0; f.chain = 0; f.kd = false; f.inv = 0; f.ghost = 0; f.ice = 0; f.meter = Math.min(f.meter, 50); }); G.proj = []; G.waves = []; G.ghosts = []; G.bolts = []; G.cmb = null; G.time = 45 * 60; G.phase = "intro"; G.pt = 0; }
  function inputs() {
    const k = G.inp, e = G.edge, pin = Object.assign({}, k, e), sv = G.stk && G.stk.v; G.edge = {};
    if (sv && sv.m > 0) { if (sv.x < -0.35) pin.l = 1; if (sv.x > 0.35) pin.r = 1; if (sv.y < -0.6) pin.u = 1; if (sv.y > 0.6) pin.d = 1; pin.m = Math.abs(sv.x) > 0.35 ? Math.abs(sv.x) : 0; }
    return pin;
  }
  function tick() {
    if (!G || G.over) return; if (G.stop > 0) { G.stop--; return; }
    const p = G.p, e = G.e; G.pt++;
    if (G.shake > 0) G.shake = Math.max(0, G.shake - 0.5); if (G.cmb && --G.cmb.l <= 0) G.cmb = null;
    G.parts = G.parts.filter((q) => { q.x += q.vx; q.y += q.vy; q.vy -= 0.12; return --q.l > 0; }); G.bursts = G.bursts.filter((b) => --b.l > 0); G.ghosts = G.ghosts.filter((z) => --z.l > 0);
    if (G.phase === "intro") { if (G.pt > (G.fast ? 1 : 80)) { G.phase = "fight"; G.pt = 0; } return; }
    if (G.phase === "ko") { if (!G.fast && (G.pt & 1)) return; tickF(p, e, {}); tickF(e, p, {}); if (G.pt > (G.fast ? 1 : 190)) roundEnd(); return; }
    const pin = inputs();
    tickF(p, e, pin); tickF(e, p, G.cfg.dummy ? {} : ai(e, p)); push(p, e);
    G.proj = G.proj.filter((q) => {
      q.x += q.vx; q.l--; const t = q.own === p ? e : p;
      if (q.k === "arc") q.y += (q.home.y + 36 - q.y) * 0.07; else if (q.k === "orb") { if (++q.age === 28) q.vx *= 5.5; } else if (q.k === "tor" && t.st !== "ko" && grounded(t) && Math.abs(q.x - t.x) < 80 && Math.abs(q.x - t.x) > 10) t.x += (q.x - t.x) * 0.08;
      if (t.st !== "ko" && Math.abs(q.x - t.x) < (q.k === "tor" ? 22 : q.big ? 20 : 14) && q.y < t.y + 66 && q.y > t.y - 8) { damage(q.own, t, q.d, 18, 4, q.opt || { kd: q.big }); return false; } return q.l > 0 && q.x > -20 && q.x < W + 20;
    });
    G.bolts = G.bolts.filter((b) => --b.l > 0);
    G.waves = G.waves.filter((w) => --w.l > 0); G.fxs = G.fxs.filter((x) => --x.l > 0);
    G.time--;
    if (p.st === "ko" || e.st === "ko" || G.time <= 0) { G.phase = "ko"; G.pt = 0; if (G.time <= 0 && p.st !== "ko" && e.st !== "ko") { const l = p.hp / p.hpMax >= e.hp / e.hpMax ? e : p; l.hp = 0; l.st = "ko"; l.y = 0.1; l.vy = 4; } }
  }
  function roundEnd() {
    const p = G.p, e = G.e, win = e.hp <= 0 && p.hp > 0; if (win) p.rounds++; else e.rounds++;
    if (p.rounds >= 2 || e.rounds >= 2) { G.over = p.rounds >= 2 ? "win" : "lose"; if (G.cfg.onEnd) G.cfg.onEnd(G.over, G); return; }
    G.round++; resetRound();
  }
  // ------------------------------------------------------------ scenari (uno per saga, disegnati a mano con il canvas)
  const NSC = 4;
  function mkBg(col, sc) {
    const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d"); const h = hash(col + sc);
    const tint = (a) => { const n = parseInt(col.slice(1), 16) || 0x7a5ad8; return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    const sky = x.createLinearGradient(0, 0, 0, 160);
    if (sc === 0) { sky.addColorStop(0, "#050a1c"); sky.addColorStop(1, "#1b2a55"); } else if (sc === 1) { sky.addColorStop(0, "#2a1550"); sky.addColorStop(0.6, "#b4506a"); sky.addColorStop(1, "#f0a05a"); } else if (sc === 2) { sky.addColorStop(0, "#1a0f1a"); sky.addColorStop(1, "#3a1f24"); } else { sky.addColorStop(0, "#0e2a5a"); sky.addColorStop(0.7, "#4a8ac0"); sky.addColorStop(1, "#f0c890"); }
    x.fillStyle = sky; x.fillRect(0, 0, W, 170);
    const rnd = (() => { let a = h; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; })();
    if (sc === 0) { // stadio di notte: stelle, gradinate, riflettori
      for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.6})`; x.fillRect(rnd() * W, rnd() * 60, 1, 1); }
      for (let r = 0; r < 5; r++) { x.fillStyle = r % 2 ? "#141c3a" : "#1a2448"; x.fillRect(0, 70 + r * 17, W, 17); for (let i = 0; i < 90; i++) { x.fillStyle = ["#e8603a", "#f0d060", "#6ab0f0", "#e8e8f0", col][(rnd() * 5) | 0]; x.globalAlpha = 0.55; x.fillRect(i * 4.3 + rnd() * 2, 74 + r * 17 + rnd() * 8, 2.4, 3.4); } x.globalAlpha = 1; }
      [[40, 28], [W - 40, 28]].forEach(([tx, ty]) => { x.fillStyle = "#0a0f20"; x.fillRect(tx - 3, ty, 6, 90); x.fillStyle = "#fff"; for (let i = 0; i < 6; i++) x.fillRect(tx - 12 + (i % 3) * 8, ty - 8 + ((i / 3) | 0) * 7, 6, 5); });
    } else if (sc === 1) { // tetti al tramonto
      x.fillStyle = "#ffe9a8"; x.beginPath(); x.arc(250, 108, 26, 0, 7); x.fill();
      for (let l = 0; l < 3; l++) { x.fillStyle = ["#6a3a6a", "#4a2a52", "#2a1838"][l]; let bx = -10; while (bx < W) { const bw = 28 + rnd() * 30, bh = 40 + l * 18 + rnd() * 40; x.fillRect(bx, 170 - bh - (2 - l) * 6, bw, bh + 20); if (l > 0) for (let wy = 170 - bh; wy < 168; wy += 9) for (let wx = bx + 4; wx < bx + bw - 4; wx += 8) if (rnd() < 0.45) { x.fillStyle = "rgba(255,220,140,.85)"; x.fillRect(wx, wy - (2 - l) * 6, 3, 4); } x.fillStyle = ["#6a3a6a", "#4a2a52", "#2a1838"][l]; bx += bw + 2; } }
    } else if (sc === 2) { // sala con stendardi e lanterne
      for (let i = 0; i < 9; i++) { x.fillStyle = i % 2 ? "#2a1418" : "#341a20"; x.fillRect(i * 44, 0, 44, 170); x.fillStyle = "#00000044"; x.fillRect(i * 44, 0, 2, 170); }
      [60, 190, 320].forEach((bx) => { x.fillStyle = tint(0.85); x.fillRect(bx - 16, 14, 32, 84); x.beginPath(); x.moveTo(bx - 16, 98); x.lineTo(bx, 110); x.lineTo(bx + 16, 98); x.fill(); x.fillStyle = "#ffffff55"; x.beginPath(); x.arc(bx, 50, 8, 0, 7); x.fill(); });
      [125, 255].forEach((lx) => { x.fillStyle = "#ffb347"; x.beginPath(); x.ellipse(lx, 38, 9, 12, 0, 0, 7); x.fill(); x.fillStyle = "#ffb34733"; x.beginPath(); x.arc(lx, 38, 26, 0, 7); x.fill(); });
    } else { // porto: mare, sole, barche
      x.fillStyle = "#ffe9a8"; x.beginPath(); x.arc(95, 128, 22, 0, 7); x.fill();
      x.fillStyle = "#2a6aa8"; x.fillRect(0, 128, W, 44); for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(255,255,255,${0.15 + rnd() * 0.2})`; x.fillRect(rnd() * W, 130 + rnd() * 40, 6 + rnd() * 12, 1); }
      [[60, 120, 1], [200, 124, 0.8], [310, 118, 1.2]].forEach(([bx, by, k]) => { x.fillStyle = "#1a1a2a"; x.beginPath(); x.moveTo(bx - 20 * k, by); x.lineTo(bx + 20 * k, by); x.lineTo(bx + 14 * k, by + 8 * k); x.lineTo(bx - 14 * k, by + 8 * k); x.fill(); x.fillRect(bx - 1, by - 34 * k, 2, 34 * k); x.fillStyle = tint(0.9); x.beginPath(); x.moveTo(bx + 2, by - 32 * k); x.lineTo(bx + 20 * k, by - 6 * k); x.lineTo(bx + 2, by - 6 * k); x.fill(); });
    }
    // pavimento in prospettiva
    const fl = x.createLinearGradient(0, 170, 0, H); const FC = [["#2a6a3a", "#14401f"], ["#4a4a58", "#26262f"], ["#7a4a2a", "#3e2414"], ["#8a6a42", "#4a3820"]][sc]; fl.addColorStop(0, FC[0]); fl.addColorStop(1, FC[1]); x.fillStyle = fl; x.fillRect(0, 170, W, H - 170);
    x.strokeStyle = "rgba(255,255,255,.13)"; x.lineWidth = 1; for (let i = -8; i <= 8; i++) { x.beginPath(); x.moveTo(W / 2 + i * 14, 170); x.lineTo(W / 2 + i * 56, H); x.stroke(); } for (let i = 1; i < 5; i++) { x.beginPath(); x.moveTo(0, 170 + i * i * 2.6); x.lineTo(W, 170 + i * i * 2.6); x.stroke(); }
    x.fillStyle = "rgba(255,255,255,.18)"; x.fillRect(0, 170, W, 1.5); const vg = x.createRadialGradient(W / 2, 120, 90, W / 2, 120, 260); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.5)"); x.fillStyle = vg; x.fillRect(0, 0, W, H);
    return c;
  }
  // ------------------------------------------------------------ disegno
  function drawBg(g) {
    if (!G.bg) G.bg = mkBg(G.e.col, hash(G.e.saga || G.e.id) % NSC);
    const par = (G.camx - W / 2) * 0.1; g.drawImage(G.bg, -12 - par, -4, W + 24, H + 8);
    // luci/sprazzi animati
    const T = G.pt; g.globalCompositeOperation = "lighter"; for (let i = 0; i < 3; i++) { const lx = 60 + i * 130 + Math.sin(T * 0.02 + i) * 14; g.fillStyle = `rgba(255,255,255,${0.025 + 0.02 * Math.sin(T * 0.05 + i * 2)})`; g.beginPath(); g.moveTo(lx, 0); g.lineTo(lx - 26, 175); g.lineTo(lx + 26, 175); g.fill(); } g.globalCompositeOperation = "source-over";
  }
  function draw(g) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H);
    const p = G.p, e = G.e, mid = (p.x + e.x) / 2, dist = Math.abs(p.x - e.x), tz = 1 + clampN((190 - dist) / 190, 0, 1) * 0.12;
    G.zoom += (tz - G.zoom) * 0.08; G.camx += (mid - G.camx) * 0.1; const z = G.zoom, cx = clampN(G.camx, W / (2 * z), W - W / (2 * z));
    g.save(); const sh = G.shake > 0 ? G.shake : 0; g.translate(W / 2 + (sh ? (Math.random() - 0.5) * sh : 0), GY + (sh ? (Math.random() - 0.5) * sh : 0)); g.scale(z, z); g.translate(-cx, -GY);
    drawBg(g);
    G.waves.forEach((w) => { const k = 1 - w.l / 18; g.strokeStyle = `rgba(255,220,120,${1 - k})`; g.lineWidth = 4; g.beginPath(); g.ellipse(w.x, GY, w.r * k, 10, 0, 0, Math.PI * 2); g.stroke(); });
    G.ghosts.forEach((z2) => { g.globalAlpha = z2.l / 14; g.fillStyle = z2.col; g.beginPath(); g.roundRect(z2.x - 11, GY - z2.y - 56, 22, 34, 6); g.fill(); g.beginPath(); g.arc(z2.x, GY - z2.y - 68, 12, 0, 7); g.fill(); }); g.globalAlpha = 1;
    [p, e].sort((a, b) => (a.st === "ko") - (b.st === "ko") || (a.st === "atk") - (b.st === "atk")).forEach((f) => fig(g, f));
    G.proj.forEach((q) => {
      const r = q.big ? 13 : 9, qy = GY - q.y, c = q.c || "#ff8a30";
      for (let i = 1; i < 5; i++) { g.globalAlpha = 0.5 / i; g.fillStyle = c; g.beginPath(); g.arc(q.x - q.vx * i * 1.6, qy, r * (1 - i * 0.13), 0, 7); g.fill(); } g.globalAlpha = 1;
      if (q.k === "tor") { g.strokeStyle = c; g.lineWidth = 2.2; for (let i = 0; i < 4; i++) { const a = G.pt * 0.4 + i * 1.57, yy = qy - 18 + i * 12; g.beginPath(); g.ellipse(q.x, yy, 10 + Math.sin(a) * 4, 3.5, 0, 0, 7); g.stroke(); } }
      else if (q.k === "ice") { g.fillStyle = "#e8f8ff"; g.strokeStyle = c; g.lineWidth = 2; g.beginPath(); g.moveTo(q.x + 12 * Math.sign(q.vx), qy); g.lineTo(q.x, qy - 6); g.lineTo(q.x - 9 * Math.sign(q.vx), qy); g.lineTo(q.x, qy + 6); g.closePath(); g.fill(); g.stroke(); }
      else { const rr = q.k === "orb" ? r * (0.8 + 0.25 * Math.sin(G.pt * 0.5)) : r; const gr = g.createRadialGradient(q.x, qy, 1, q.x, qy, rr); gr.addColorStop(0, "#fff"); gr.addColorStop(0.4, c); gr.addColorStop(1, "rgba(255,80,0,0)"); g.fillStyle = gr; g.beginPath(); g.arc(q.x, qy, rr, 0, 7); g.fill(); }
    });
    [G.p, G.e].forEach((f) => { if (f.st === "spec" && f.sup && f.sg.fx === "thunder" && f.t >= 10 && f.t < 26 && f.tx != null) { g.strokeStyle = f.sg.col; g.lineWidth = 2; g.globalAlpha = 0.5 + 0.4 * Math.sin(G.pt * 0.8); g.beginPath(); g.ellipse(f.tx, GY, 22 - (f.t - 10) * 0.5, 6, 0, 0, 7); g.stroke(); g.globalAlpha = 1; } });
    G.bolts.forEach((b) => { g.strokeStyle = "#fff"; g.shadowColor = b.c; g.shadowBlur = 10; g.lineWidth = 3 + b.l * 0.2; g.beginPath(); let yy = -10, xx = b.x; g.moveTo(xx, yy); while (yy < GY) { yy += 18; xx = b.x + ((yy * 7 + b.l * 13) % 15) - 7; g.lineTo(xx, Math.min(GY, yy)); } g.stroke(); g.shadowBlur = 0; g.fillStyle = `rgba(255,255,255,${b.l / 40})`; g.fillRect(b.x - 80, -10, 160, GY + 10); });
    G.bursts.forEach((b) => { const k = 1 - b.l / 9, n = b.big ? 10 : 7, R = (b.big ? 26 : 16) * (0.4 + k); g.strokeStyle = b.c; g.globalAlpha = 1 - k; g.lineWidth = 2.5 - k * 1.5; g.beginPath(); for (let i = 0; i < n; i++) { const a = (i / n) * 6.283 + (b.x % 6), r0 = R * 0.35, r1 = R; g.moveTo(b.x + Math.cos(a) * r0, GY - b.y + Math.sin(a) * r0); g.lineTo(b.x + Math.cos(a) * r1, GY - b.y + Math.sin(a) * r1); } g.stroke(); g.globalAlpha = 1; });
    G.parts.forEach((q) => { g.globalAlpha = Math.min(1, q.l / 10); g.fillStyle = q.c; g.fillRect(q.x - q.s / 2, GY - q.y - q.s / 2, q.s, q.s); }); g.globalAlpha = 1;
    g.font = "bold 14px system-ui"; g.textAlign = "center"; G.fxs.forEach((x) => { g.globalAlpha = x.l / 30; g.fillStyle = x.c; g.strokeStyle = "#000"; g.lineWidth = 3; g.strokeText(x.t, x.x, GY - x.y - (30 - x.l)); g.fillText(x.t, x.x, GY - x.y - (30 - x.l)); }); g.globalAlpha = 1;
    g.restore();
    // Super: linee di velocità a schermo
    if ((p.sup || e.sup) && !G.fast) { g.strokeStyle = "rgba(255,255,255,.28)"; g.lineWidth = 1.5; for (let i = 0; i < 16; i++) { const yy = (i * 41 + G.pt * 13) % H, xx = (i * 97 + G.pt * 29) % W; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 36, yy); g.stroke(); } }
    hud(g);
  }
  function hud(g) {
    const p = G.p, e = G.e;
    g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(0, 0, W, 38); bar(g, 30, 8, 138, p, false); bar(g, W - 168, 8, 138, e, true);
    [[p, 4, 5], [e, W - 28, 5]].forEach(([f, x, y]) => { const im = imgOf(f.id); g.save(); g.beginPath(); g.arc(x + 12, y + 12, 12, 0, 7); g.clip(); g.fillStyle = f.col; g.fillRect(x, y, 24, 24); if (im && im.complete && im.naturalWidth) g.drawImage(im, x, y, 24, 24); g.restore(); g.strokeStyle = f.tr === "at" ? "#e8603a" : f.tr === "df" ? "#3a8ad8" : "#a85ad8"; g.lineWidth = 2; g.beginPath(); g.arc(x + 12, y + 12, 12, 0, 7); g.stroke(); });
    g.fillStyle = "#000b"; g.beginPath(); g.roundRect(W / 2 - 18, 4, 36, 22, 6); g.fill(); g.strokeStyle = "#ffd23f"; g.lineWidth = 1.5; g.stroke();
    g.fillStyle = "#fff"; g.font = "bold 15px system-ui"; g.textAlign = "center"; g.fillText(Math.max(0, Math.ceil(G.time / 60)), W / 2, 21);
    [p, e].forEach((f, i) => { for (let k = 0; k < 2; k++) { g.fillStyle = k < f.rounds ? "#ffd23f" : "#ffffff33"; g.beginPath(); g.arc(i ? W / 2 + 10 + k * 10 : W / 2 - 10 - k * 10, 33, 3.4, 0, 7); g.fill(); } });
    if (G.cmb && G.cmb.n >= 2) { const c = G.cmb, left = c.who === p, k = Math.min(1, (100 - c.l) / 6) < 1 ? 1.3 - Math.min(1, (100 - c.l) / 6) * 0.3 : 1; g.save(); g.translate(left ? 56 : W - 56, 78); g.scale(k, k); g.textAlign = "center"; g.fillStyle = "#ffd23f"; g.strokeStyle = "#000"; g.lineWidth = 4; g.font = "900 28px system-ui"; g.strokeText(c.n, 0, 0); g.fillText(c.n, 0, 0); g.font = "900 11px system-ui"; g.strokeText(c.n >= 4 ? "COMBO!" : "HIT", 0, 14); g.fillStyle = "#fff"; g.fillText(c.n >= 4 ? "COMBO!" : "HIT", 0, 14); g.restore(); }
    g.textAlign = "center";
    if (G.phase === "intro") { g.fillStyle = "#0009"; g.fillRect(0, 84, W, 56); g.fillStyle = "#ffd23f"; g.font = "900 28px system-ui"; g.save(); g.translate(W / 2, 122); const k = G.pt < 45 ? 1 + Math.max(0, 8 - (G.pt % 45)) * 0.05 : 1 + Math.max(0, 6 - (G.pt - 45)) * 0.06; g.scale(k, k); g.fillText(G.pt < 45 ? `ROUND ${G.round}` : "COMBATTI!", 0, 0); g.restore(); }
    if (G.phase === "ko") { g.fillStyle = "#0009"; g.fillRect(0, 84, W, 56); g.fillStyle = "#ff5a5a"; g.font = "900 32px system-ui"; g.fillText(G.time <= 0 ? "TEMPO!" : "K.O.", W / 2, 124); }
  }
  function bar(g, x, y, w, f, right) {
    g.fillStyle = "#000a"; g.fillRect(x - 1, y - 1, w + 2, 12); const p = Math.max(0, f.hp / f.hpMax); g.fillStyle = p > 0.5 ? "#7ad87a" : p > 0.25 ? "#e8d03a" : "#e8603a"; const ww = w * p; g.fillRect(right ? x + w - ww : x, y, ww, 10); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(right ? x + w - ww : x, y, ww, 3);
    g.fillStyle = "#000a"; g.fillRect(x - 1, y + 13, w + 2, 6); const m = f.meter / 100, pulse = f.meter >= 100 ? 0.6 + 0.4 * Math.sin(G.pt * 0.3) : 1; g.globalAlpha = pulse; g.fillStyle = f.meter >= 100 ? "#ffd23f" : f.meter >= 50 ? "#9ad8ff" : "#5a7ad8"; const mw = w * m; g.fillRect(right ? x + w - mw : x, y + 14, mw, 4); g.globalAlpha = 1;
    g.fillStyle = "#fff"; g.font = "bold 9px system-ui"; g.textAlign = right ? "right" : "left"; g.fillText(f.n + (f.meter >= 100 ? " · SUPER!" : ""), right ? x + w : x, y + 29);
  }
  function ik(g, x0, y0, x1, y1, l1, l2, bend) {
    let dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 0.01; const mx = l1 + l2 - 0.05; if (d > mx) { x1 = x0 + (dx / d) * mx; y1 = y0 + (dy / d) * mx; dx = x1 - x0; dy = y1 - y0; d = mx; }
    const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a)), ex = x0 + (dx * a) / d - (dy / d) * h * bend, ey = y0 + (dy * a) / d + (dx / d) * h * bend;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(ex, ey); g.lineTo(x1, y1); g.stroke(); return [x1, y1];
  }
  function pose(f) {
    const t = f.t, s = f.st, T = G.pt, idle = Math.sin(T * 0.12) * 1.4, sw = Math.sin(T * 0.45) * 8;
    const P = { hf: [14, -52], hb: [8, -45], ff: [9, 0], fb: [-9, 0], lean: 0, hip: -30, sh: -50, hy: -68, hx: 0 };
    if (s === "idle") { P.hip = -29 + idle * 0.5; P.sh = -49 + idle; P.hy = -67 + idle; P.hf[1] += idle; }
    else if (s === "walk") { P.ff = [8 + sw, -Math.max(0, -sw) * 0.6]; P.fb = [-8 - sw, -Math.max(0, sw) * 0.6]; P.lean = 2; P.hip = -29 + Math.abs(sw) * 0.08; P.hf = [13 - sw * 0.3, -51]; P.hb = [6 + sw * 0.3, -45]; }
    else if (s === "jump") { P.ff = [11, -17]; P.fb = [-5, -12]; P.hf = [16, -60]; P.hb = [8, -56]; P.hip = -34; P.sh = -54; P.hy = -72; }
    else if (s === "block") { P.hf = [13, -62]; P.hb = [10, -52]; P.hip = -27; P.sh = -47; P.hy = -65; P.lean = -2; P.ff = [11, 0]; P.fb = [-9, 0]; }
    else if (s === "hit") { P.lean = -9; P.hx = -6; P.hy = -64; P.hf = [2, -40]; P.hb = [-5, -38]; P.ff = [8, -3]; P.fb = [-10, 0]; }
    else if (s === "dash") { P.lean = 9; P.ff = [18, -3]; P.fb = [-15, -6]; P.hf = [20, -48]; P.hb = [-6, -44]; P.hip = -26; P.sh = -44; P.hy = -61; }
    else if (s === "spec") { const w = Math.sin(t * 0.3) * 3; P.hf = [24, -52 + w]; P.hb = [18, -44]; P.lean = f.role === "C" ? 8 : 2; if (f.role === "D") { P.hf = [14, -78 + (t < 12 ? 0 : 24)]; P.hb = [8, -74 + (t < 12 ? 0 : 24)]; P.hip = -24 + (t >= 12 ? 4 : 0); } if (f.role === "P") { P.hf = [12, -62]; P.hb = [20, -56]; } if (f.role === "C") { P.ff = [18, -3]; P.fb = [-15, -6]; } }
    else if (s === "atk") {
      const a = f.atk, p = t < a.su ? t / a.su : t < a.su + a.ac ? 1 : Math.max(0, 1 - (t - a.su - a.ac) / a.rc), k = a.k;
      if (k === "a") { P.hf = [10 + a.reach * 0.7 * p, -50 + (f.chain === 2 ? -6 * p : 0)]; P.hb = [6 - 4 * p, -45]; P.lean = 5 * p; }
      else if (k === "b") { P.ff = [9 + (a.reach - 8) * p, -26 - 8 * p]; P.lean = -6 * p; P.hf = [10, -58]; P.hb = [4, -50]; }
      else if (k === "u") { P.hf = [8 + 6 * p, -52 - 36 * p]; P.lean = 3 * p; P.hip = -29 + 4 * p; P.ff = [12, 0]; }
      else if (k === "j") { P.ff = [14 + 18 * p, -8 - 4 * p]; P.fb = [-2, -24]; P.lean = 8; P.hf = [4, -50]; P.hb = [-2, -48]; P.hip = -34; }
      else if (k === "t") { P.hf = [18 + 6 * p, -48 + (p > 0.6 ? -22 : 0)]; P.hb = [16, -46 + (p > 0.6 ? -22 : 0)]; P.lean = 4 * p; }
    }
    return P;
  }
  function fig(g, f) {
    const d = f.dir, bx = f.x, by = GY - f.y, ko = f.st === "ko" || f.st === "down", P = pose(f);
    // ombra
    g.fillStyle = "rgba(0,0,0,.38)"; g.beginPath(); g.ellipse(bx, GY + 2, Math.max(6, 17 - f.y * 0.06), 4, 0, 0, 7); g.fill();
    g.save(); g.translate(bx, by); g.scale(d, 1);
    if (f.sup && !G.fast) { const gr = g.createRadialGradient(0, -38, 4, 0, -38, 44); gr.addColorStop(0, "rgba(255,230,120,.55)"); gr.addColorStop(1, "rgba(255,160,40,0)"); g.fillStyle = gr; g.beginPath(); g.arc(0, -38, 44 + Math.sin(G.pt * 0.5) * 3, 0, 7); g.fill(); }
    if (ko) { const k = Math.min(1, f.t / (f.st === "ko" ? 14 : 6)); g.translate(-10 * k, -3 * k); g.rotate(-k * (Math.PI / 2)); g.translate(0, 8 * k); }
    else if (P.lean) { g.translate(0, -30); g.rotate((P.lean * Math.PI) / 180 * 0.9); g.translate(0, 30); }
    if (f.flash > 0 && f.flash % 2) g.globalAlpha = 0.6; if (f.ghost) g.globalAlpha = 0.2;
    g.lineCap = "round"; g.lineJoin = "round";
    const skin = "#e8c8a0", dark = "#1d1d28", hip = [0, P.hip], sh = [P.hb ? 0 : 0, P.sh];
    // arto posteriore: gamba e braccio
    g.strokeStyle = "#111"; g.lineWidth = 6.5; ik(g, -2, hip[1], P.fb[0], P.fb[1], 15, 15, -1); g.strokeStyle = dark; g.lineWidth = 4.6; ik(g, -2, hip[1], P.fb[0], P.fb[1], 15, 15, -1);
    g.fillStyle = "#f4f0e4"; g.beginPath(); g.ellipse(P.fb[0] + 2, P.fb[1] - 1, 5, 2.6, 0, 0, 7); g.fill();
    g.strokeStyle = "#111"; g.lineWidth = 5.4; ik(g, -1, sh[1] + 3, P.hb[0], P.hb[1], 12, 12, 1); g.strokeStyle = skin; g.lineWidth = 3.6; ik(g, -1, sh[1] + 3, P.hb[0], P.hb[1], 12, 12, 1);
    // busto + calzoncini
    g.fillStyle = f.col; g.strokeStyle = "#111"; g.lineWidth = 2; g.beginPath(); g.moveTo(-9, sh[1]); g.lineTo(9, sh[1]); g.lineTo(8, hip[1] + 2); g.lineTo(-8, hip[1] + 2); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,.28)"; g.fillRect(-9, sh[1] + 7, 17, 3); g.fillStyle = f.tr === "at" ? "#e8603a" : f.tr === "df" ? "#3a8ad8" : "#a85ad8"; g.fillRect(-8, hip[1] - 2, 16, 3);
    g.fillStyle = dark; g.beginPath(); g.roundRect(-8, hip[1] + 1, 16, 9, 2); g.fill();
    // testa: il ritratto
    const im = imgOf(f.id), hx = P.hx + 1, hy = P.hy; g.save(); g.scale(d, 1); g.beginPath(); g.arc(hx * d, hy, 15, 0, 7); g.clip(); if (im && im.complete && im.naturalWidth) g.drawImage(im, hx * d - 16, hy - 16, 32, 32); else { g.fillStyle = skin; g.fillRect(hx * d - 16, hy - 16, 32, 32); } g.restore();
    g.strokeStyle = f.tr === "at" ? "#e8603a" : f.tr === "df" ? "#3a8ad8" : "#a85ad8"; g.lineWidth = 2.5; g.beginPath(); g.arc(hx, hy, 15, 0, 7); g.stroke();
    g.fillStyle = "#e8c8a0"; g.fillRect(-2, hy + 13, 4, 5);
    // arto anteriore
    g.strokeStyle = "#111"; g.lineWidth = 6.5; ik(g, 2, hip[1], P.ff[0], P.ff[1], 15, 15, -1); g.strokeStyle = skin; g.lineWidth = 4.6; ik(g, 2, hip[1], P.ff[0], P.ff[1], 15, 15, -1);
    g.fillStyle = "#f4f0e4"; g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.ellipse(P.ff[0] + 2, P.ff[1] - 1, 5.4, 2.8, 0, 0, 7); g.fill(); g.stroke();
    const blk = f.st === "block"; g.strokeStyle = "#111"; g.lineWidth = 5.8; ik(g, 1, sh[1] + 3, P.hf[0], P.hf[1], 12, 12, 1); g.strokeStyle = blk ? "#9ad8ff" : skin; g.lineWidth = 3.9; const hnd = ik(g, 1, sh[1] + 3, P.hf[0], P.hf[1], 12, 12, 1);
    g.fillStyle = blk ? "#9ad8ff" : f.st === "atk" || f.st === "spec" ? "#fff" : skin; g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.arc(hnd[0], hnd[1], 3.4, 0, 7); g.fill(); g.stroke();
    if (f.ice > 0) { g.fillStyle = "rgba(150,225,255,.5)"; g.strokeStyle = "#e8f8ff"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(-15, -86, 30, 90, 6); g.fill(); g.stroke(); }
    if (f.counter > 0) { g.strokeStyle = "#7ad87a"; g.lineWidth = 2; g.beginPath(); g.arc(0, -38, 34 + Math.sin(G.pt * 0.4) * 2, 0, 7); g.stroke(); }
    if (f.boss) { g.save(); g.scale(d, 1); g.fillStyle = "#ff5a5a"; g.font = "bold 9px system-ui"; g.textAlign = "center"; g.fillText("BOSS", 0, -88); g.restore(); }
    g.restore();
  }
  // ------------------------------------------------------------ cut-in del Super
  function cutin(f) { if (G.fast || !OV) return; const w = OV.querySelector(".pcStage"); if (!w) return; const c = document.createElement("div"); c.className = "pcCut"; const u = safe(() => S().port(f.id), null); c.innerHTML = `${u ? `<img alt="" src="${u}">` : ""}<div><b>${esc(f.sg.name)} · SUPER</b><span>${esc(f.n)}${f.sg.saga ? " · " + esc(f.sg.saga) : ""}</span></div>`; c.style.borderColor = f.sg.col; c.querySelector("b").style.color = f.sg.col; w.appendChild(c); G.stop = 38; setTimeout(() => c.remove(), 900); }
  // ------------------------------------------------------------ interfaccia
  function css() {
    if (document.getElementById("pcCss")) return; const st = document.createElement("style"); st.id = "pcCss";
    st.textContent = `.pcOv{position:fixed;inset:0;z-index:314;background:#0c0818;color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto;touch-action:manipulation}.pcOv .wrap{max-width:560px;margin:0 auto;padding:8px 8px 20px}
.pcOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#0c0818;padding:5px 0;z-index:3}.pcOv h2{margin:0;font:900 19px system-ui;color:#ffd23f}.pcOv .x{width:40px;height:40px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#fff;font-size:17px}
.pcOv .sum{font-size:13px;line-height:1.45;opacity:.9}.pcOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}
.pcOv .one{width:100%;min-height:54px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px;margin:5px 0}.pcOv .one small{display:block;font-weight:400;font-size:11px;opacity:.75}.pcOv button:disabled{opacity:.4}
.pcPick{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:6px}.pcPick .c{border-radius:9px;border:2px solid #4a3a6a;background:#1a1428;padding:3px;text-align:center;font-size:9.5px;font-weight:700;cursor:pointer}.pcPick .c.sel{border-color:#ffd23f;box-shadow:0 0 10px #ffd23f88}.pcPick img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;display:block}
.pcStage{position:relative;width:100%;max-width:520px;margin:0 auto}.pcStage canvas{display:block;width:100%;height:auto;border-radius:10px;background:#000}
.pcCtl{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px;user-select:none;-webkit-user-select:none;touch-action:none}.pcCtl .g{display:grid;gap:6px}.pcCtl .ab{grid-template-columns:repeat(3,minmax(0,56px));grid-template-rows:repeat(2,56px)}
.pcCtl button{border-radius:12px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 12px system-ui;padding:2px;touch-action:none;line-height:1.15}.pcCtl button.on,.pcCtl button:active{background:#5a3aa8}.pcCtl .sp{background:#2a4a7a}.pcCtl .su{background:#7a5a10;color:#ffe9a8}.pcCtl .pr{background:#4a2a5a}.pcCtl button small{display:block;font-weight:400;font-size:8.5px;opacity:.8}
.pcCut{position:absolute;left:0;right:0;top:30%;height:84px;overflow:hidden;z-index:6;pointer-events:none;background:linear-gradient(90deg,#000c,#3a1a6ccc 40%,#000c);border-top:3px solid #ffd23f;border-bottom:3px solid #ffd23f;animation:pcCut .9s forwards;display:flex;align-items:center;gap:12px;padding:0 14px}
.pcCut img{height:74px;width:74px;object-fit:cover;object-position:50% 20%;border-radius:50%;border:2px solid #ffd23f}.pcCut b{font:900 20px system-ui;color:#ffd23f;text-shadow:0 2px 0 #000}.pcCut span{display:block;font-size:12px;color:#fff}
@keyframes pcCut{0%{opacity:0;transform:scaleY(.1)}12%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0}}.pcRes{text-align:center;margin:12px 0}.pcRes h3{font:900 24px system-ui;margin:4px 0}
.pcOv .pcX{display:none}.pcOv.land{overflow:hidden}.pcOv.land .wrap{max-width:none;padding:0;height:100%}.pcOv.land .bar{display:none}.pcOv.land .body{height:100%;position:relative}.pcOv.land .pcStage{max-width:none;width:100%;height:100%;display:flex;justify-content:center;background:#000}.pcOv.land .pcStage canvas{height:100%;width:auto;max-width:100%;border-radius:0}
.pcOv.land .pcX{display:block;position:absolute;top:6px;right:8px;z-index:7;width:36px;height:36px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36cc;color:#fff;font-size:15px}.pcOv.land .pcCtl{position:absolute;left:0;right:0;bottom:6px;padding:0 12px;margin:0;pointer-events:none;align-items:flex-end}.pcOv.land .pcCtl>*{pointer-events:auto}.pcOv.land .sum{display:none}
.pcOv.land .stk{background:rgba(20,15,40,.16)!important;border-color:rgba(255,255,255,.22)!important;box-shadow:none!important}.pcOv.land .stk i{opacity:.62}.pcOv.land .pcCtl button{background:rgba(34,26,54,.45);border-color:rgba(255,255,255,.2)}.pcOv.land .pcCtl .tb,.pcOv.land .pcCtl .sp{background:rgba(42,74,122,.5)}.pcOv.land .pcCtl .su{background:rgba(122,90,16,.5)}`;
    document.head.appendChild(st);
  }
  function shell(title) { css(); stop(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "pcOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const live = G && !G.over; stop(); if (live) return menu(); const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  let LAY = null;
  function stop() { cancelAnimationFrame(RAF); RAF = 0; if (LAY) { window.removeEventListener("resize", LAY); window.removeEventListener("orientationchange", LAY); LAY = null; } window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); G = G && G.over ? G : null; if (G && !G.over) G = null; }
  function close() { stop(); G = null; if (OV) { OV.remove(); OV = null; } }
  const KM = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d", a: "l", d: "r", w: "u", s: "d", j: "a", k: "b", l: "s", ";": "x", u: "t", i: "h" };
  const EDGE = "abxst";
  const kd = (e) => { const k = KM[e.key]; if (!k || !G) return; e.preventDefault(); if (EDGE.includes(k)) G.edge[k] = 1; else if (k === "h") G.edge.h = 1; else G.inp[k] = 1; };
  const ku = (e) => { const k = KM[e.key]; if (k && G && !EDGE.includes(k) && k !== "h") G.inp[k] = 0; };
  function press(k, on) { if (!G) return; if (EDGE.includes(k) || k === "h") { if (on) G.edge[k] = 1; } else G.inp[k] = on ? 1 : 0; }
  function fightUI(cfg) {
    const body = shell(cfg.title || "🥊 Duello dei Sogni"); begin(cfg);
    body.innerHTML = `<div class="pcStage"><canvas width="${W * SS}" height="${H * SS}"></canvas><button type="button" class="pcX" aria-label="Esci">✕</button></div><div class="pcCtl"><div class="stkSlot"></div><div class="g ab"><button data-k="a">👊<br>Pugno</button><button data-k="b">🦵<br>Calcio</button><button data-k="t" class="pr">🤼<br>Presa</button><button data-k="d">🛡️<br>Para/Parry</button><button data-k="s" class="sp">✦ Speciale<small>${esc(SPEC[G.p.role][0])}</small></button><button data-k="x" class="su">★ SUPER<small>${esc(G.p.sg.name)}</small></button></div></div><p class="sum" style="font-size:11px;opacity:.65;margin-top:6px">Joystick: ◀▶ muovi (doppio tocco = scatto/schivata ⚡), ▲ salta, ▼ para. ✨ PARRY PERFETTO: premi ▼ un istante prima dell'impatto per azzerare il danno, stordire il rivale e caricare la Super! ▼ + Pugno = anti-aereo. Pugno ×3 = catena; dopo un colpo a segno puoi annullare in Calcio o Speciale. Presa buca la parata. Super di saga. Tasti: frecce/WASD, J pugno, K calcio, U presa, L speciale, ; super, I schivata.</p>`;
    const cv = body.querySelector("canvas"), g = cv.getContext("2d"), slot = body.querySelector(".stkSlot");
    if (window.__stick) { G.stk = window.__stick.make({ size: 122 }); slot.appendChild(G.stk.el); }
    body.querySelectorAll("[data-k]").forEach((b) => { const k = b.dataset.k, up = () => { press(k, false); b.classList.remove("on"); }; b.addEventListener("pointerdown", (e) => { e.preventDefault(); b.setPointerCapture && safe(() => b.setPointerCapture(e.pointerId), 0); press(k, true); b.classList.add("on"); }); b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("pointerleave", up); });
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const layout = () => { if (OV) OV.classList.toggle("land", innerWidth > innerHeight * 1.1); }; LAY = layout; window.addEventListener("resize", LAY); window.addEventListener("orientationchange", LAY); layout(); body.querySelector(".pcX").onclick = () => OV.querySelector(".bar .x").click();
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
