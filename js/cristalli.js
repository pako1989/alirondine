// js/cristalli.js - CRISTALLI DEL CAMPO · Final Tactics · motore della saga
// JRPG a 16 bit per il Campione creato dall'utente (heroLoad()). Ispirato a Final Fantasy, Bravely Default, Octopath Traveler.
// Nel regno sospeso di Calcistea quattro Cristalli tengono in volo i continenti, e restano accesi solo se ogni anno, nel loro
// santuario, si gioca la Partita del Cristallo. L'Impero di Ferrogrigio ne succhia la luce. Il Cristallo della Terra sceglie il Campione.
// Novità di questa saga:
//  - MONDO A PIEDI «HD-2D»: pixel art con profondità di campo (bordi sfocati, effetto miniatura), bagliori sulle luci,
//    particelle e una tinta di colore per ogni regione. Gli alberi e i cristalli sporgono sulla fila di sopra (profondità).
//  - MESTIERI (Bomber, Regista, Muro, Funambolo): si cambiano dal menu e contano SOLO nella Battaglia ATB (js/cristalli-atb.js).
//  - AERONAVE: la mappa del mondo in pseudo-3D (Mode 7, js/cristalli-mode7.js), si atterra nei luoghi sbloccati.
//  - LEGAMI: le scelte spostano tre valori nascosti (Luce, Ferro, Corona) e la fiducia di Aira. Decidono i finali.
// Zone sul motore TRZ di game.js (window.__borgoApi), sfondi cr_* in js/bg-scenarios.js. Ricompense: solo monete e cosmetici.
// Salvataggio proprio: ali-di-rondine.cristalli.
(function () {
  "use strict";
  if (window.__cristalliLoaded) return;
  window.__cristalliLoaded = true;
  const KEY = "ali-di-rondine.cristalli", TS = 16;
  let api = null, tries = 0, EXIT = null;

  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  const arr = (a) => (Array.isArray(a) ? a : []);
  const clampI = (v, a, b, d) => { v = Math.round(+v); return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; return h >>> 0; };
  const rnd = (tx, ty, k) => hash(tx * 73 + ty * 131 + (k || 0) * 17) / 4294967296;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const frNow = () => Math.floor(performance.now() / 16);

  // ------------------------------------------------------------------ audio (arpeggi da JRPG)
  let actx = null;
  function ac() { if (!actx && (window.AudioContext || window.webkitAudioContext)) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (actx && actx.state === "suspended") safe(() => actx.resume()); return actx; }
  function tone(f, d, type, vol, when, slide) { const c = ac(); if (!c) return; safe(() => { const t = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02); }); }
  const SFX = {
    crystal: () => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, 0.35, "triangle", 0.06, i * 0.07)), // il preludio
    chest: () => { [392, 494, 587, 784].forEach((f, i) => tone(f, 0.12, "square", 0.05, i * 0.08)); tone(1047, 0.4, "triangle", 0.06, 0.34); },
    save: () => { tone(784, 0.3, "sine", 0.07); tone(1175, 0.5, "sine", 0.05, 0.12); },
    job: () => [659, 880, 1319].forEach((f, i) => tone(f, 0.15, "square", 0.05, i * 0.06)),
    ship: () => { tone(110, 0.8, "sawtooth", 0.04, 0, 220); tone(220, 0.6, "triangle", 0.05, 0.2, 440); },
    bad: () => { tone(196, 0.3, "square", 0.05, 0, 98); },
  };

  // ------------------------------------------------------------------ salvataggio
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  const JOB_IDS = ["bomber", "regista", "muro", "funambolo"], MATES = ["aira", "bram", "vela"];
  const LORE = {};
  function norm(o) {
    o = obj(o);
    const m = { v: 1, ch: clampI(o.ch, 1, 9, 1), step: {}, flags: {}, rew: {}, done: {}, zone: "", log: [], intro: {}, ends: [], wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0),
      jobs: {}, unl: [], party: [], form: [], lore: [], luce: clampI(o.luce, 0, 99, 0), ferro: clampI(o.ferro, 0, 99, 0), corona: clampI(o.corona, 0, 99, 0), trust: clampI(o.trust, -9, 9, 0), ship: null };
    const st = obj(o.step); Object.keys(st).slice(0, 20).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n) m.step[n] = clampI(st[k], 0, 99, 0); });
    const fl = obj(o.flags); let c = 0;
    Object.keys(fl).forEach((k) => { if (c >= 300 || !FLAG_RE.test(k)) return; const v = fl[k]; if (typeof v === "boolean" || (typeof v === "number" && Number.isFinite(v)) || (typeof v === "string" && v.length <= 24)) { m.flags[k] = v; c++; } });
    Object.keys(obj(o.rew)).forEach((k) => { if (REW_RE.test(k) && Object.keys(m.rew).length < 200) m.rew[k] = 1; });
    const dn = obj(o.done); Object.keys(dn).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n && typeof dn[k] === "string" && dn[k].length <= 24) m.done[n] = dn[k]; });
    m.zone = typeof o.zone === "string" && ZONE_RE.test(o.zone) ? o.zone : "";
    m.log = arr(o.log).filter((x) => typeof x === "string").map((x) => x.slice(0, 220)).slice(-80);
    Object.keys(obj(o.intro)).forEach((k) => { if (FLAG_RE.test(k)) m.intro[k] = 1; });
    m.ends = [...new Set(arr(o.ends).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 12);
    const jb = obj(o.jobs); ["hero", ...MATES].forEach((k) => { if (JOB_IDS.includes(jb[k])) m.jobs[k] = jb[k]; });
    m.unl = [...new Set(arr(o.unl).filter((x) => JOB_IDS.includes(x)))];
    m.party = [...new Set(arr(o.party).filter((x) => MATES.includes(x)))];
    m.form = [...new Set(arr(o.form).filter((x) => MATES.includes(x)))].slice(0, 2);
    m.lore = [...new Set(arr(o.lore).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 40);
    const sh = obj(o.ship); if (Number.isFinite(+sh.x) && Number.isFinite(+sh.y)) m.ship = { x: +sh.x % 512, y: +sh.y % 512, a: Number.isFinite(+sh.a) ? +sh.a : 0 };
    return m;
  }
  let MEM = null;
  const mem = () => MEM || (MEM = norm(safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {})));
  const save = () => { safe(() => localStorage.setItem(KEY, JSON.stringify(mem()))); };
  const reload = () => { MEM = null; return mem(); };
  const F = {
    get: (k, d) => { const v = mem().flags[k]; return v === undefined ? d : v; },
    set: (k, v) => { if (FLAG_RE.test(k)) { mem().flags[k] = v; save(); } },
    is: (k) => !!mem().flags[k],
    add: (k, n) => { const v = (+mem().flags[k] || 0) + (n || 1); F.set(k, v); return v; },
  };
  const stepOf = (ch) => mem().step[ch] | 0;
  const setStep = (ch, n) => { mem().step[ch] = clampI(n, 0, 99, 0); save(); };
  const note = (txt) => { const m = mem(); if (!m.log.includes(txt)) { m.log.push(txt); if (m.log.length > 80) m.log.shift(); save(); } };
  const once = (key, fn) => { const m = mem(); if (m.rew[key]) return false; m.rew[key] = 1; save(); fn(); return true; };
  // i tre legami nascosti e la fiducia di Aira
  const bond = (k, d) => { const m = mem(); if (k === "trust") m.trust = Math.max(-9, Math.min(9, m.trust + d)); else if (["luce", "ferro", "corona"].includes(k)) m[k] = Math.max(0, Math.min(99, m[k] + d)); save(); };

  // ------------------------------------------------------------------ il Campione
  const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "il tuo tiro" };
    return String(s).replace(/\{n\}/g, () => h.name).replace(/\{num\}/g, () => h.num).replace(/\{tiro\}/g, () => h.shotName || "il tuo tiro");
  }
  function castHero() {
    const h = hero(), C = api && api.CAST; if (!h || !C) return;
    const job = mem().jobs.hero, sh = { bomber: "#c0392b", regista: "#2c7fb8", muro: "#a8862a", funambolo: "#7a4ab0" }[job] || "#3f5fbf";
    C.hero = Object.assign({}, C.hero || {}, { name: h.name, tag: "", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye, bg: ["#0a1440", "#c9a227"], shirt: sh, num: String(h.num) });
  }
  const coinsGive = (n) => (n > 0 && typeof window.addCoins === "function" ? safe(() => { window.addCoins(n); return n; }, 0) : 0);
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

  // ------------------------------------------------------------------ REGIONI (palette HD-2D)
  // grass/path/stone/pitch/carpet/bridge: colori dei pavimenti · wall: roccia o muro · tint: tinta di colore · fx: particelle · ray: raggi di luce
  const REG = {
    borgo: { grass: ["#5f9a3e", "#67a344", "#5a933b"], path: ["#c9a46a", "#bf9a60"], stone: ["#b7aa94", "#aa9d88"], wall: ["#7a6a58", "#6a5a4a"], water: ["#2f7fb0", "#3a8cc0"], tint: "255,190,120", tintA: 0.1, fx: "pollen", ray: "255,230,170", sky: "#9fd7ff" },
    bosco: { grass: ["#2f5a2a", "#36632f", "#2b5426"], path: ["#8a7048", "#806842"], stone: ["#7a7468", "#6e685c"], wall: ["#3a4a2a", "#2e3e22"], water: ["#1f5a6a", "#246676"], tint: "120,200,160", tintA: 0.14, fx: "fireflies", ray: "200,255,200", sky: "#7fb8d8" },
    grotta: { grass: ["#4a3a2a", "#523f2c", "#463626"], path: ["#6a5236", "#5f4a30"], stone: ["#5a4a3a", "#504234"], wall: ["#2e241a", "#3a2e22"], water: ["#1a4a5a", "#22566a"], tint: "255,150,60", tintA: 0.16, fx: "dust", ray: null, sky: "#1a120a" },
    cielo: { grass: ["#8fcf7a", "#98d683", "#86c672"], path: ["#efe6d6", "#e6dccb"], stone: ["#f2f0ea", "#e4e2dc"], wall: ["#cfd8e4", "#bcc8d8"], water: ["#7cc4ff", "#8ccdff"], tint: "200,230,255", tintA: 0.12, fx: "wind", ray: "255,255,240", sky: "#bfe3ff" },
    forgia: { grass: ["#3a3236", "#40373b", "#352d31"], path: ["#5a4a44", "#52433e"], stone: ["#4a4448", "#423c40"], wall: ["#2a2428", "#3a3236"], water: ["#e05a1a", "#f07a2a"], tint: "255,90,40", tintA: 0.16, fx: "embers", ray: null, sky: "#2a0a08" },
    acqua: { grass: ["#3f8a7a", "#46927f", "#3a8274"], path: ["#d8d0b8", "#cfc6ac"], stone: ["#8fb8c8", "#84aec0"], wall: ["#2a5a6a", "#336878"], water: ["#1e6a9a", "#2878a8"], tint: "120,220,255", tintA: 0.14, fx: "bubbles", ray: "180,240,255", sky: "#0e4a6a" },
    trono: { grass: ["#4a3a5a", "#523f62", "#463654"], path: ["#b89a5a", "#ae9050"], stone: ["#6a5a7a", "#625272"], wall: ["#2a1a3a", "#36244a"], water: ["#3a2a6a", "#44307a"], tint: "200,150,255", tintA: 0.14, fx: "sparkle", ray: "255,220,160", sky: "#0a0614" },
  };
  const FLOORS = ',:+-"=';
  // Solidi: a muro/roccia · t albero · r masso · y casa · q porta · w acqua (o lava nella Forgia) · c Grande Cristallo · s Cristallo di salvataggio
  //         x forziere · f staccionata · l lanterna · b panca · g porta da calcio · j tribuna · n cartello · k incudine · o statua · p colonna
  //         m grappolo di cristalli · e vuoto del cielo · i aeronave all'ormeggio · u bancarella · z botte e casse · h timone
  const SOLID = "atryqwcsxflbgjnkopmeiuzh";
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);
  const ZX = { map: null, under: null, meta: null, id: "", rg: REG.borgo, rk: "borgo", lights: [], ships: [] };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "a";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  const light = (x, y, r, rgb, a) => { if (ZX.lights.length < 60) ZX.lights.push([x, y, r, rgb, a]); };
  // ombra morbida in basso a destra: l'effetto «miniatura»
  const shadow = (sx, sy, w) => { GP.fillStyle = "rgba(0,0,0,.22)"; GP.beginPath(); GP.ellipse(sx + 9, sy + 14, w || 7, 2.6, 0, 0, 7); GP.fill(); };

  function floorPaint(f, sx, sy, tx, ty) {
    const R = ZX.rg, r = rnd(tx, ty, 1), k = ZX.rk;
    if (f === ",") {
      P(sx, sy, 16, 16, R.grass[hash(tx * 3 + ty * 7) % 3]);
      if (k === "grotta" || k === "forgia") { for (let i = 0; i < 3; i++) P(sx + ((tx * 5 + i * 6) % 14), sy + ((ty * 7 + i * 5) % 14), 2, 1, "rgba(0,0,0,.18)"); if (r < 0.1) P(sx + 4, sy + 9, 3, 2, "rgba(255,200,120,.12)"); }
      else if (k === "trono") { P(sx, sy, 16, 1, "rgba(255,220,160,.06)"); if ((tx + ty) % 4 === 0) P(sx + 7, sy + 7, 2, 2, "rgba(255,220,160,.15)"); }
      else {
        for (let i = 0; i < 5; i++) P(sx + ((tx * 5 + i * 4) % 15), sy + ((ty * 7 + i * 5) % 13), 1, 3, "rgba(30,70,20,.35)");
        for (let i = 0; i < 3; i++) P(sx + ((tx * 3 + i * 7) % 15), sy + ((ty * 5 + i * 3) % 14), 1, 1, "rgba(255,255,200,.25)");
        if (r < 0.07) { P(sx + 5, sy + 6, 2, 2, ["#ffffff", "#ffd36b", "#ff8aa8", "#bfa6ff"][hash(tx + ty * 9) % 4]); P(sx + 5, sy + 8, 1, 2, "#3f7a2a"); }
        if (k === "acqua" && r > 0.92) P(sx + 3, sy + 3, 2, 2, "rgba(200,255,255,.3)");
      }
    } else if (f === ":") {
      P(sx, sy, 16, 16, R.path[(tx + ty) % 2]);
      for (let i = 0; i < 4; i++) P(sx + ((tx * 7 + i * 5) % 14), sy + ((ty * 3 + i * 7) % 14), 2, 1, "rgba(0,0,0,.1)");
      if (r < 0.15) P(sx + 9, sy + 4, 2, 2, "rgba(255,255,255,.18)");
      // bordo erboso: il sentiero sfuma nel prato
      if (undAt(tx, ty - 1) === "," && at(tx, ty - 1) === ",") P(sx, sy, 16, 2, "rgba(60,110,40,.35)");
    } else if (f === "+") {
      P(sx, sy, 16, 16, R.stone[(tx + ty) % 2]); P(sx, sy + 15, 16, 1, "rgba(0,0,0,.15)"); P(sx + 15, sy, 1, 16, "rgba(0,0,0,.12)"); P(sx, sy, 16, 1, "rgba(255,255,255,.12)");
      if (k === "cielo" && (tx + ty) % 3 === 0) P(sx + 6, sy + 6, 4, 4, "rgba(150,190,230,.35)");
      if (k === "trono") P(sx + 7, sy + 7, 2, 2, "rgba(255,220,160,.25)");
    } else if (f === "-") {
      P(sx, sy, 16, 16, tx % 2 ? "#4f9a3e" : "#57a345"); for (let i = 0; i < 3; i++) P(sx + ((tx * 5 + i * 5) % 15), sy + ((ty * 7 + i * 4) % 13), 1, 3, "rgba(255,255,255,.12)");
      if (k === "grotta" || k === "forgia" || k === "trono") { P(sx, sy, 16, 16, tx % 2 ? "#3a4a26" : "#40522a"); for (let i = 0; i < 3; i++) P(sx + ((tx * 7 + i * 5) % 14), sy + ((ty * 5 + i * 3) % 14), 2, 2, "rgba(0,0,0,.18)"); P(sx, sy, 16, 1, "rgba(255,220,150,.06)"); }
    } else if (f === '"') {
      P(sx, sy, 16, 16, k === "trono" ? "#6a1a3a" : "#8a2a2a"); P(sx, sy + 1, 16, 1, "rgba(255,210,120,.4)"); P(sx, sy + 14, 16, 1, "rgba(255,210,120,.4)"); if ((tx + ty) % 2) P(sx + 6, sy + 6, 4, 4, "rgba(255,210,120,.18)");
    } else if (f === "=") {
      P(sx, sy, 16, 16, "#7a5a3a"); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "rgba(0,0,0,.3)"); P(sx, sy, 16, 1, "#a07a4a"); if (r < 0.2) P(sx + 5, sy + 1, 1, 1, "#2a1a10");
    } else P(sx, sy, 16, 16, R.grass[0]);
  }
  function houseTile(sx, sy, tx, ty) {
    const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx], R = ZX.rg;
    if (!m) { P(sx, sy, 16, 16, R.wall[0]); return; }
    const o = m.o, roof = o.roof || "#b8452a", wall = o.wall || "#e8d6b0";
    if (m.ry < o.rr) { // tetto a falde con tegole e colmo illuminato
      P(sx, sy, 16, 16, roof); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "rgba(0,0,0,.22)"); for (let i = 0; i < 16; i += 4) P(sx + i + (m.ry % 2) * 2, sy, 1, 16, "rgba(0,0,0,.08)");
      if (m.ry === 0) P(sx, sy, 16, 2, "rgba(255,255,255,.25)");
      if (m.ry === o.rr - 1) P(sx, sy + 13, 16, 3, "rgba(0,0,0,.35)");
      if (m.rx === 0) P(sx, sy, 2, 16, "rgba(255,255,255,.12)"); if (m.rx === o.w - 1) P(sx + 14, sy, 2, 16, "rgba(0,0,0,.25)");
      if (o.chimney && m.rx === o.w - 2 && m.ry === 0) { P(sx + 4, sy - 6, 6, 10, "#6a4a3a"); const f = frNow(); for (let i = 0; i < 3; i++) { GP.fillStyle = `rgba(230,230,230,${0.35 - i * 0.1})`; GP.beginPath(); GP.arc(sx + 7 + Math.sin(f / 20 + i) * 2, sy - 10 - i * 5 - (f / 6 % 5), 2 + i, 0, 7); GP.fill(); } }
      return;
    }
    P(sx, sy, 16, 16, wall); P(sx, sy, 16, 1, "rgba(0,0,0,.2)");
    if (o.timber) { P(sx, sy, 2, 16, o.timber); P(sx, sy + 7, 16, 2, o.timber); }
    else for (let r = 0; r < 4; r++) P(sx + ((r % 2) * 8 + (tx % 2) * 4), sy + r * 4, 1, 4, "rgba(0,0,0,.1)");
    const win = m.rx > 0 && m.rx < o.w - 1 && m.rx % 2 === 1 && !(o.door && o.door[0] === tx && o.door[1] === ty);
    if (win) { P(sx + 4, sy + 3, 8, 8, "#3a2a1a"); const lit = rnd(tx, ty, 5) < 0.7; P(sx + 5, sy + 4, 6, 6, lit ? "#ffd98a" : "#4a5a7a"); P(sx + 7, sy + 4, 1, 6, "#3a2a1a"); P(sx + 5, sy + 6, 6, 1, "#3a2a1a"); P(sx + 3, sy + 11, 10, 2, "#6a4a2a"); if (lit) light(sx + 8, sy + 7, 14, "255,210,120", 0.35); if (rnd(tx, ty, 7) < 0.5) { P(sx + 4, sy + 10, 2, 2, "#ff7a9a"); P(sx + 9, sy + 10, 2, 2, "#ffd36b"); } }
    if (m.rx === 0) P(sx, sy, 1, 16, "rgba(255,255,255,.18)"); if (m.rx === o.w - 1) P(sx + 15, sy, 1, 16, "rgba(0,0,0,.35)");
    if (m.ry === o.h - 1) P(sx, sy + 14, 16, 2, "rgba(0,0,0,.2)");
  }
  function crystalShape(sx, sy, h, col, fr, i) {
    const b = Math.sin(fr / 30 + (i || 0)) * 1.5;
    GP.fillStyle = col; GP.beginPath(); GP.moveTo(sx + 8, sy - h + b); GP.lineTo(sx + 14, sy + 4 + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 2, sy + 4 + b); GP.closePath(); GP.fill();
    GP.fillStyle = "rgba(255,255,255,.55)"; GP.beginPath(); GP.moveTo(sx + 8, sy - h + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 2, sy + 4 + b); GP.closePath(); GP.fill();
    GP.strokeStyle = "rgba(255,255,255,.8)"; GP.lineWidth = 1; GP.beginPath(); GP.moveTo(sx + 8, sy - h + b); GP.lineTo(sx + 14, sy + 4 + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 2, sy + 4 + b); GP.closePath(); GP.stroke();
  }
  const hexRgb = (h) => { const n = parseInt(String(h).slice(1), 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`; };
  const PAINT = {
    a(sx, sy, tx, ty) { // muro di roccia (o di pietra nei palazzi), con il bordo in alto illuminato
      const R = ZX.rg, k = ZX.rk; P(sx, sy, 16, 16, R.wall[(tx + ty) % 2]);
      if (k === "cielo" || k === "trono") { P(sx, sy + 4, 16, 1, "rgba(0,0,0,.15)"); P(sx, sy + 10, 16, 1, "rgba(0,0,0,.15)"); P(sx + (ty % 2) * 8, sy, 1, 16, "rgba(0,0,0,.12)"); if (k === "trono" && ty % 3 === 0) P(sx, sy + 12, 16, 2, "#c9a227"); }
      else { for (let i = 0; i < 4; i++) P(sx + ((tx * 5 + i * 4) % 13), sy + ((ty * 3 + i * 5) % 13), 3, 2, "rgba(0,0,0,.18)"); for (let i = 0; i < 2; i++) P(sx + ((tx * 3 + i * 7) % 13), sy + ((ty * 5 + i * 7) % 13), 2, 1, "rgba(255,255,255,.1)"); }
      if (at(tx, ty - 1) !== "a") P(sx, sy, 16, 2, "rgba(255,255,255,.18)");
      if (at(tx, ty + 1) !== "a") { P(sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); }
    },
    t(sx, sy, tx, ty, fr) { // albero tondo che sporge sulla fila di sopra
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 8);
      P(sx + 6, sy + 6, 4, 9, "#6a4a2a"); P(sx + 6, sy + 6, 1, 9, "#8a6a3a");
      const sw = Math.sin(fr / 60 + tx * 0.7) * 0.8, k = ZX.rk, c = k === "cielo" ? ["#5aa86a", "#7ac884", "#a8e0a0"] : k === "acqua" ? ["#2a7a6a", "#3a9a84", "#6ac8a8"] : k === "trono" ? ["#5a3a6a", "#7a4a8a", "#a87ab8"] : ["#2f6a2a", "#3f8a34", "#6ab84a"];
      GP.fillStyle = c[0]; GP.beginPath(); GP.arc(sx + 8 + sw, sy - 1, 8, 0, 7); GP.fill();
      GP.fillStyle = c[1]; GP.beginPath(); GP.arc(sx + 7 + sw, sy - 3, 6.5, 0, 7); GP.fill();
      GP.fillStyle = c[2]; GP.beginPath(); GP.arc(sx + 5 + sw, sy - 5, 3, 0, 7); GP.fill();
      if (rnd(tx, ty, 4) < 0.3) { P(sx + 10 + sw, sy - 2, 2, 2, "#e05a5a"); P(sx + 4 + sw, sy + 1, 2, 2, "#e05a5a"); }
    },
    r(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); GP.fillStyle = ZX.rk === "forgia" ? "#2a2226" : "#7a7268"; GP.beginPath(); GP.ellipse(sx + 8, sy + 9, 7, 6, 0, 0, 7); GP.fill(); GP.fillStyle = "rgba(255,255,255,.22)"; GP.beginPath(); GP.ellipse(sx + 6, sy + 6, 3.5, 2.5, -0.4, 0, 7); GP.fill(); P(sx + 9, sy + 10, 3, 1, "rgba(0,0,0,.3)"); },
    y: (sx, sy, tx, ty) => houseTile(sx, sy, tx, ty),
    q(sx, sy, tx, ty) { const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx]; P(sx, sy, 16, 16, (m && m.o.wall) || ZX.rg.wall[0]); P(sx + 3, sy + 2, 10, 14, "#6a3a1a"); P(sx + 3, sy + 2, 10, 2, "#8a5a2a"); P(sx + 8, sy + 2, 1, 14, "rgba(0,0,0,.3)"); P(sx + 10, sy + 9, 2, 2, "#ffd36b"); light(sx + 8, sy + 2, 10, "255,200,120", 0.25); },
    w(sx, sy, tx, ty, fr) { // acqua (o lava) con riflessi animati e bordo di schiuma
      const R = ZX.rg, lava = ZX.rk === "forgia"; P(sx, sy, 16, 16, R.water[(tx + ty) % 2]);
      const o = (fr / 3 + tx * 5 + ty * 3) % 16; P(sx + o - 4, sy + 4 + (ty % 2) * 6, 6, 1, lava ? "rgba(255,230,120,.7)" : "rgba(255,255,255,.35)");
      if (rnd(tx, ty, 3) < 0.1) P(sx + 7, sy + 8, 2, 1, lava ? "#ffe08a" : "rgba(255,255,255,.5)");
      if (at(tx, ty - 1) !== "w" && at(tx, ty - 1) !== "=") P(sx, sy, 16, 2, lava ? "rgba(40,10,10,.6)" : "rgba(255,255,255,.4)");
      if (lava && (tx + ty) % 3 === 0) light(sx + 8, sy + 8, 16, "255,120,40", 0.3);
    },
    c(sx, sy, tx, ty, fr) { // il Grande Cristallo del santuario
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      const col = ZX.crystalCol || "#ffd36b", rgb = hexRgb(col), dim = ZX.crystalDim ? ZX.crystalDim() : false;
      GP.fillStyle = "rgba(0,0,0,.3)"; GP.beginPath(); GP.ellipse(sx + 8, sy + 14, 8, 3, 0, 0, 7); GP.fill();
      P(sx + 1, sy + 11, 14, 4, "#8a7a6a"); P(sx + 1, sy + 11, 14, 1, "#b8a898");
      crystalShape(sx, sy - 6, 14, dim ? "rgba(140,140,160,.85)" : col, fr, tx);
      light(sx + 8, sy - 2, dim ? 18 : 34 + Math.sin(fr / 20) * 4, dim ? "160,160,190" : rgb, dim ? 0.2 : 0.55);
    },
    s(sx, sy, tx, ty, fr) { // il cristallo di salvataggio, rotante, azzurro
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 5);
      const w = Math.abs(Math.cos(fr / 25)) * 6 + 1, b = Math.sin(fr / 18) * 2;
      GP.fillStyle = "#7ae0ff"; GP.beginPath(); GP.moveTo(sx + 8, sy - 2 + b); GP.lineTo(sx + 8 + w, sy + 5 + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 8 - w, sy + 5 + b); GP.closePath(); GP.fill();
      GP.fillStyle = "rgba(255,255,255,.7)"; GP.fillRect(sx + 7, sy + b, 1, 10);
      light(sx + 8, sy + 5, 22, "122,224,255", 0.45);
    },
    x(sx, sy, tx, ty) { // forziere (aperto se già preso)
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7);
      const open = ZX.chestOpen && ZX.chestOpen(tx, ty);
      P(sx + 2, sy + 6, 12, 8, "#8a4a1a"); P(sx + 2, sy + 9, 12, 1, "#c9a227"); P(sx + 2, sy + 13, 12, 1, "#5a2a0a");
      if (open) { P(sx + 2, sy + 2, 12, 4, "#5a2a0a"); P(sx + 3, sy + 6, 10, 2, "#2a1a0a"); }
      else { P(sx + 2, sy + 3, 12, 4, "#a85a2a"); P(sx + 2, sy + 3, 12, 1, "#c97a3a"); P(sx + 7, sy + 7, 2, 3, "#ffd36b"); light(sx + 8, sy + 8, 10, "255,211,107", 0.2); }
    },
    f(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx, sy + 6, 16, 2, "#8a6a3a"); P(sx, sy + 10, 16, 2, "#8a6a3a"); P(sx + 2, sy + 4, 2, 11, "#a07a4a"); P(sx + 12, sy + 4, 2, 11, "#a07a4a"); P(sx, sy + 14, 16, 1, "rgba(0,0,0,.2)"); },
    l(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 3); P(sx + 7, sy + 2, 2, 13, "#3a2a20"); P(sx + 4, sy - 2, 8, 6, "#2a1a10"); P(sx + 5, sy - 1, 6, 4, "#ffd98a"); light(sx + 8, sy + 1, 26 + Math.sin(fr / 10 + tx) * 2, "255,200,110", 0.5); },
    b(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); P(sx + 1, sy + 6, 14, 3, "#a07a4a"); P(sx + 1, sy + 6, 14, 1, "#c99a5a"); P(sx + 2, sy + 9, 2, 5, "#5a3a20"); P(sx + 12, sy + 9, 2, 5, "#5a3a20"); },
    g(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 2, sy + 2, 12, 12, "rgba(255,255,255,.2)"); for (let i = 3; i < 14; i += 3) { P(sx + i, sy + 2, 1, 12, "rgba(255,255,255,.5)"); P(sx + 2, sy + i, 12, 1, "rgba(255,255,255,.5)"); } P(sx + 1, sy + 1, 14, 2, "#fff"); P(sx + 1, sy + 1, 2, 14, "#fff"); P(sx + 13, sy + 1, 2, 14, "#fff"); },
    j(sx, sy, tx, ty, fr) { P(sx, sy, 16, 16, "#5a4a3a"); P(sx, sy + 7, 16, 2, "rgba(0,0,0,.3)"); const c = ZX.standCol || ["#c0392b", "#2c7fb8", "#c9a227"]; for (let i = 0; i < 2; i++) for (let k = 0; k < 2; k++) { const jmp = (Math.floor(fr / 12) + tx + i) % 5 === 0 ? 1 : 0; P(sx + 2 + i * 7, sy + 2 + k * 8 - jmp, 5, 5, c[(tx + i + k) % c.length]); P(sx + 3 + i * 7, sy + 1 + k * 8 - jmp, 3, 2, "#e0b48a"); } },
    n(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 4); P(sx + 7, sy + 7, 2, 8, "#5a3a20"); P(sx + 2, sy + 1, 12, 8, "#c99a5a"); P(sx + 2, sy + 1, 12, 1, "#e8c48a"); P(sx + 4, sy + 4, 8, 1, "#5a3a20"); P(sx + 4, sy + 6, 6, 1, "#5a3a20"); },
    k(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); P(sx + 2, sy + 4, 12, 4, "#4a4a52"); P(sx + 1, sy + 4, 3, 2, "#4a4a52"); P(sx + 5, sy + 8, 6, 6, "#3a3a42"); P(sx + 2, sy + 4, 12, 1, "#8a8a9a"); if ((fr / 20 | 0) % 6 === 0) { P(sx + 10, sy + 1, 1, 1, "#ffd36b"); P(sx + 12, sy + 2, 1, 1, "#ff8a3a"); } },
    o(sx, sy, tx, ty) { // statua (o golem dormiente nella Grotta)
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); const gol = ZX.rk === "grotta";
      P(sx + 3, sy + 12, 10, 3, "#8a8278"); P(sx + 4, sy + 1, 8, 11, gol ? "#6a5a4a" : "#c8c0b4"); P(sx + 5, sy - 3, 6, 5, gol ? "#7a6a5a" : "#d8d0c4"); P(sx + 4, sy + 1, 1, 11, "rgba(255,255,255,.2)");
      if (gol) { P(sx + 6, sy - 1, 1, 1, "#ffb347"); P(sx + 9, sy - 1, 1, 1, "#ffb347"); P(sx + 2, sy + 3, 2, 6, "#6a5a4a"); P(sx + 12, sy + 3, 2, 6, "#6a5a4a"); }
    },
    p(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 6); const k = ZX.rk, c = k === "trono" ? "#d8c08a" : k === "forgia" ? "#4a4448" : "#e8e4dc"; P(sx + 3, sy - 4, 10, 18, c); P(sx + 3, sy - 4, 3, 18, "rgba(255,255,255,.3)"); P(sx + 10, sy - 4, 3, 18, "rgba(0,0,0,.18)"); P(sx + 2, sy - 6, 12, 3, c); P(sx + 2, sy + 12, 12, 3, c); P(sx + 2, sy - 6, 12, 1, "rgba(255,255,255,.4)"); },
    m(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); const col = ZX.clusterCol || "#ffb347"; [[3, 8, 7], [8, 10, 10], [11, 12, 6]].forEach(([x, y, h], i) => { GP.fillStyle = col; GP.beginPath(); GP.moveTo(sx + x, sy + y + 4); GP.lineTo(sx + x + 2, sy + y - h + 4); GP.lineTo(sx + x + 4, sy + y + 4); GP.fill(); GP.fillStyle = "rgba(255,255,255,.5)"; GP.fillRect(sx + x + 1, sy + y - h + 6, 1, h - 3); }); light(sx + 8, sy + 8, 18, hexRgb(col), 0.3 + 0.1 * Math.sin(fr / 25 + tx)); },
    e(sx, sy, tx, ty, fr) { // il vuoto: si vede il cielo sotto le isole, con le nuvole che scorrono
      const R = ZX.rg; P(sx, sy, 16, 16, R.sky); const o = ((fr / 4 + tx * 16 + ty * 37) % 64) - 16; if (ty % 3 === 0) { GP.fillStyle = "rgba(255,255,255,.55)"; GP.beginPath(); GP.ellipse(sx + o, sy + 8, 10, 3, 0, 0, 7); GP.fill(); }
      if (at(tx, ty - 1) !== "e") { P(sx, sy, 16, 5, ZX.rk === "cielo" ? "#a89a88" : "#5a4a3a"); P(sx, sy + 5, 16, 2, "rgba(0,0,0,.3)"); for (let i = 0; i < 3; i++) P(sx + 2 + i * 5, sy + 5, 2, 3 + (tx + i) % 3, "#7a6a58"); }
    },
    i(sx, sy, tx, ty) { // l'aeronave all'ormeggio (3x2 tessere): qui solo il pavimento, la nave la disegna drawShips() sopra le tessere
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      if (at(tx - 1, ty) !== "i" && at(tx, ty - 1) !== "i" && ZX.ships.length < 4) ZX.ships.push([sx, sy]);
    },
    u(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 8); P(sx + 1, sy + 7, 14, 7, "#8a5a3a"); P(sx + 1, sy + 7, 14, 1, "#c99a5a"); const c = ["#e05a3a", "#ffd36b", "#7ac84a", "#ff8aa8"]; for (let i = 0; i < 3; i++) { GP.fillStyle = c[(tx + i) % 4]; GP.beginPath(); GP.arc(sx + 4 + i * 4, sy + 6, 2, 0, 7); GP.fill(); } P(sx, sy - 2, 16, 3, (tx % 2) ? "#c0392b" : "#e8e0d0"); },
    z(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); if ((tx + ty) % 2) { P(sx + 3, sy + 3, 10, 12, "#7a4e2a"); P(sx + 3, sy + 5, 10, 1, "#4a3a2a"); P(sx + 3, sy + 11, 10, 1, "#4a3a2a"); P(sx + 3, sy + 3, 10, 1, "#9a6e3a"); } else { P(sx + 2, sy + 4, 12, 10, "#9a6e3a"); P(sx + 2, sy + 4, 12, 1, "#c99a5a"); P(sx + 7, sy + 4, 1, 10, "rgba(0,0,0,.3)"); P(sx + 2, sy + 9, 12, 1, "rgba(0,0,0,.3)"); } },
    h(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 6); P(sx + 7, sy + 8, 2, 7, "#5a3a20"); GP.save(); GP.translate(sx + 8, sy + 6); GP.rotate(Math.sin(fr / 60) * 0.4); GP.strokeStyle = "#8a5a2a"; GP.lineWidth = 2; GP.beginPath(); GP.arc(0, 0, 5.5, 0, 7); GP.stroke(); for (let i = 0; i < 4; i++) { GP.rotate(Math.PI / 4); GP.fillStyle = "#8a5a2a"; GP.fillRect(-0.7, -8, 1.4, 16); } GP.restore(); P(sx + 7, sy + 5, 2, 2, "#c9a227"); },
    ">": (sx, sy, tx, ty) => arrowTile(">", sx, sy, tx, ty), "<": (sx, sy, tx, ty) => arrowTile("<", sx, sy, tx, ty), "^": (sx, sy, tx, ty) => arrowTile("^", sx, sy, tx, ty), v: (sx, sy, tx, ty) => arrowTile("v", sx, sy, tx, ty),
  };
  function drawShips(fr) { // la «Rondine Grigia» all'ormeggio, che ondeggia appena
    ZX.ships.forEach(([sx, sy]) => {
      const b = Math.sin(fr / 30) * 1.5; GP.fillStyle = "rgba(0,0,0,.25)"; GP.beginPath(); GP.ellipse(sx + 24, sy + 30, 22, 4, 0, 0, 7); GP.fill();
      GP.fillStyle = "#8a5a3a"; GP.beginPath(); GP.moveTo(sx + 2, sy + 16 + b); GP.lineTo(sx + 46, sy + 16 + b); GP.lineTo(sx + 40, sy + 26 + b); GP.lineTo(sx + 8, sy + 26 + b); GP.closePath(); GP.fill(); P(sx + 4, sy + 15 + b, 40, 2, "#c9a227");
      for (let i = 0; i < 5; i++) P(sx + 8 + i * 8, sy + 19 + b, 3, 3, "#ffd98a");
      GP.fillStyle = "#9aa5b1"; GP.beginPath(); GP.ellipse(sx + 24, sy + 4 + b, 24, 9, 0, 0, 7); GP.fill(); GP.fillStyle = "#c9d1d8"; GP.beginPath(); GP.ellipse(sx + 20, sy + 1 + b, 16, 4, 0, 0, 7); GP.fill();
      GP.fillStyle = "#c0392b"; GP.beginPath(); GP.moveTo(sx, sy + 4 + b); GP.lineTo(sx - 6, sy - 2 + b); GP.lineTo(sx - 6, sy + 10 + b); GP.fill();
      for (let i = 0; i < 3; i++) P(sx + 12 + i * 10, sy + 12 + b, 1, 4, "#5a3a2a");
      const pr = fr / 3; P(sx + 47, sy + 2 + b + Math.sin(pr) * 4, 2, 3, "#e8e0d0"); P(sx + 47, sy + 2 + b - Math.sin(pr) * 4, 2, 3, "#e8e0d0");
      light(sx + 24, sy + 20, 22, "255,211,107", 0.25);
    });
    ZX.ships.length = 0;
  }
  function arrowTile(ch, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty); const b = Math.sin(frNow() / 8) * 1.5;
    GP.fillStyle = "#ffd36b"; GP.strokeStyle = "rgba(0,0,0,.4)"; GP.lineWidth = 1; GP.beginPath();
    if (ch === ">") { GP.moveTo(sx + 4 + b, sy + 4); GP.lineTo(sx + 12 + b, sy + 8); GP.lineTo(sx + 4 + b, sy + 12); } else if (ch === "<") { GP.moveTo(sx + 12 - b, sy + 4); GP.lineTo(sx + 4 - b, sy + 8); GP.lineTo(sx + 12 - b, sy + 12); } else if (ch === "v") { GP.moveTo(sx + 4, sy + 4 + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 12, sy + 4 + b); } else { GP.moveTo(sx + 4, sy + 12 - b); GP.lineTo(sx + 8, sy + 4 - b); GP.lineTo(sx + 12, sy + 12 - b); }
    GP.closePath(); GP.fill(); GP.stroke(); light(sx + 8, sy + 8, 12, "255,211,107", 0.25);
  }
  function drawTile(ch, sx, sy, tx, ty) {
    GP = GP || document.getElementById("cv").getContext("2d");
    if (isFloor(ch)) { floorPaint(ch, sx, sy, tx, ty); return true; }
    const fn = PAINT[ch]; if (fn) { fn(sx, sy, tx, ty, frNow()); return true; }
    floorPaint(",", sx, sy, tx, ty); return true;
  }
  function makeLayers(w, h, base) {
    const m = ZX.map, u = Array.from({ length: h }, () => Array(w).fill(base || ",")), meta = Array.from({ length: h }, () => Array(w).fill(null));
    ZX.under = u; ZX.meta = meta;
    const put = (x, y, ch) => { if (m[y] && x >= 0 && x < w) { m[y][x] = ch; if (isFloor(ch)) u[y][x] = ch; } };
    const lay = (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, ch); };
    // casa: o.rr = file di tetto (default metà altezza); o.door = [x, y]
    const house = (x, y, hw, hh, o) => { o = Object.assign({ w: hw, h: hh, rr: Math.max(1, Math.floor(hh / 2)) }, o || {}); for (let yy = 0; yy < hh; yy++) for (let xx = 0; xx < hw; xx++) { put(x + xx, y + yy, "y"); if (meta[y + yy]) meta[y + yy][x + xx] = { o, rx: xx, ry: yy }; } if (o.door) { put(o.door[0], o.door[1], o.door[2] || "q"); if (meta[o.door[1]]) meta[o.door[1]][o.door[0]] = { o, rx: o.door[0] - x, ry: o.door[1] - y }; } };
    const ship = (x, y) => lay(x, y, x + 2, y + 1, "i");
    return { lay, put, house, ship, w, h };
  }

  // ------------------------------------------------------------------ EFFETTO HD-2D (sopra ai personaggi, sotto all'HUD)
  let BLUR = null;
  const PART = [];
  function hd2d(g, fr) {
    const R = ZX.rg, k = ZX.rk;
    // 1) bagliori: ogni luce registrata dalle tessere diventa un alone additivo (bloom)
    g.save(); g.globalCompositeOperation = "lighter";
    ZX.lights.forEach(([x, y, r, rgb, a]) => glow(g, x, y, r, rgb, a * 0.8));
    // raggi di luce obliqui (borgo, cielo, acqua, trono)
    if (R.ray) for (let i = 0; i < 3; i++) { const x = ((i * 130 + fr * 0.15) % 460) - 80, a = 0.05 + 0.03 * Math.sin(fr / 90 + i); g.fillStyle = `rgba(${R.ray},${a})`; g.beginPath(); g.moveTo(x, -10); g.lineTo(x + 34, -10); g.lineTo(x + 120, 210); g.lineTo(x + 70, 210); g.closePath(); g.fill(); }
    g.restore(); ZX.lights.length = 0;
    // 2) particelle della regione
    while (PART.length < 26) PART.push({ x: Math.random() * 320, y: Math.random() * 200, s: Math.random(), p: Math.random() * 6.28 });
    PART.forEach((p) => {
      if (R.fx === "fireflies") { p.x += Math.sin(fr / 50 + p.p) * 0.35; p.y += Math.cos(fr / 70 + p.p) * 0.25; const tw = Math.max(0, Math.sin(fr / 25 + p.p * 2)); if (tw > 0.1) { g.save(); g.globalCompositeOperation = "lighter"; glow(g, p.x, p.y, 5, "200,255,120", tw * 0.6); g.restore(); g.fillStyle = `rgba(230,255,160,${tw})`; g.fillRect(p.x, p.y, 1.5, 1.5); } }
      else if (R.fx === "pollen") { p.x += Math.sin(fr / 60 + p.p) * 0.2 + 0.1; p.y -= 0.05 + p.s * 0.08; const tw = 0.4 + 0.4 * Math.sin(fr / 20 + p.p); g.fillStyle = `rgba(255,250,200,${tw})`; g.fillRect(p.x, p.y, 1.5, 1.5); }
      else if (R.fx === "dust") { p.x += Math.sin(fr / 80 + p.p) * 0.15; p.y += 0.06 + p.s * 0.05; g.fillStyle = `rgba(255,200,130,${0.25 + p.s * 0.3})`; g.fillRect(p.x, p.y, 1, 1); }
      else if (R.fx === "wind") { p.x += 1.2 + p.s * 1.5; p.y += Math.sin(fr / 30 + p.p) * 0.2; if (p.s > 0.6) { g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(p.x, p.y, 8 + p.s * 8, 1); } else { g.fillStyle = "rgba(255,190,210,.8)"; g.fillRect(p.x, p.y, 2, 1.5); } }
      else if (R.fx === "embers") { p.y -= 0.4 + p.s * 0.6; p.x += Math.sin(fr / 15 + p.p) * 0.4; g.fillStyle = `rgba(255,${120 + (p.s * 100 | 0)},40,${0.5 + p.s * 0.4})`; g.fillRect(p.x, p.y, 1.5, 1.5); }
      else if (R.fx === "bubbles") { p.y -= 0.25 + p.s * 0.3; p.x += Math.sin(fr / 25 + p.p) * 0.3; g.strokeStyle = `rgba(200,250,255,${0.3 + p.s * 0.3})`; g.lineWidth = 0.7; g.beginPath(); g.arc(p.x, p.y, 1 + p.s * 1.5, 0, 7); g.stroke(); }
      else { p.y += 0.05; const tw = Math.max(0, Math.sin(fr / 15 + p.p * 3)); g.fillStyle = `rgba(255,230,180,${tw * 0.8})`; g.fillRect(p.x, p.y, 1, 1); if (tw > 0.9) { g.fillRect(p.x - 2, p.y, 5, 0.6); g.fillRect(p.x, p.y - 2, 0.6, 5); } }
      if (p.x > 330) p.x = -10; if (p.x < -10) p.x = 330; if (p.y < -10) p.y = 205; if (p.y > 205) p.y = -5;
    });
    // 3) tinta di colore della regione (luce del tramonto, della lava, del mare…)
    g.save(); g.globalCompositeOperation = "soft-light"; g.fillStyle = `rgba(${R.tint},${R.tintA * 2.2})`; g.fillRect(0, 0, 320, 200); g.restore();
    // 4) profondità di campo: il bordo in alto e in basso sfocati (l'effetto «plastico in miniatura» dell'HD-2D)
    safe(() => {
      const cv = g.canvas, cw = cv.width, chh = cv.height, s = chh / 200;
      if (!BLUR || BLUR.width !== cw || BLUR.height !== chh) { BLUR = document.createElement("canvas"); BLUR.width = cw; BLUR.height = chh; BLUR.g = BLUR.getContext("2d"); }
      const b = BLUR.g; b.clearRect(0, 0, cw, chh); b.filter = `blur(${1.6 * s}px)`; b.drawImage(cv, 0, 0); b.filter = "none";
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      [[0, 14, 0.95], [14, 12, 0.65], [26, 12, 0.32], [200 - 12, 12, 0.95], [200 - 24, 12, 0.6], [200 - 34, 10, 0.28]].forEach(([y, h, a]) => { g.globalAlpha = a; g.drawImage(BLUR, 0, y * s, cw, h * s, 0, y * s, cw, h * s); });
      g.restore();
    });
    // 5) vignetta
    const vg = g.createRadialGradient(160, 100, 90, 160, 100, 210); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, k === "grotta" || k === "forgia" || k === "trono" ? "rgba(0,0,0,.5)" : "rgba(20,10,30,.28)"); g.fillStyle = vg; g.fillRect(0, 0, 320, 200);
    // 6) entrata in una zona: il nome del luogo su un cartiglio, come nei JRPG
    const e = fr - FX.enter;
    if (e >= 0 && e < 150 && FX.title) {
      const a = e < 20 ? e / 20 : e > 120 ? (150 - e) / 30 : 1; g.save(); g.globalAlpha = a;
      g.font = "bold 11px Georgia, serif"; const w = g.measureText(FX.title).width + 40; const x = 160 - w / 2, y = 38;
      const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, "rgba(10,20,64,0)"); gr.addColorStop(0.2, "rgba(10,20,64,.85)"); gr.addColorStop(0.8, "rgba(10,20,64,.85)"); gr.addColorStop(1, "rgba(10,20,64,0)"); g.fillStyle = gr; g.fillRect(x, y, w, 22);
      g.fillStyle = "#c9a227"; g.fillRect(x + 20, y, w - 40, 1); g.fillRect(x + 20, y + 21, w - 40, 1);
      g.fillStyle = "#ffe9b0"; g.textAlign = "center"; g.fillText(FX.title, 160, y + 15); g.textAlign = "left"; g.restore();
    }
  }
  const FX = { enter: -999, title: "" };

  // ------------------------------------------------------------------ capitoli e zone
  const CHAPTERS = {}, ZONES = {}, COS = {}, PLACES = {}, PENDING = [];
  const zoneRec = () => (api ? ZONES[api.trZone()] || null : null);
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "cr_borgo";
  const activeChapter = () => { const m = mem(); let best = null; Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).forEach((n) => { if (n <= m.ch) best = CHAPTERS[n]; }); return best || CHAPTERS[1] || null; };
  const CAST_OK = (id) => !!(api && api.CAST && api.CAST[id]);
  const goalNow = () => { const c = activeChapter(); return c && c.goal ? T(c.goal(stepOf(c.n))) : ""; };
  // capitoli attivi su una zona: quello che l'ha creata e i successivi già sbloccati (patch/talk/obj dei più recenti vincono)
  const chainFor = (zr) => { const m = mem(); return Object.keys(CHAPTERS).map(Number).filter((n) => n >= zr.ch && n <= m.ch).sort((a, b) => b - a).map((n) => CHAPTERS[n]); };
  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch]; castHero();
    const s = stepOf(c.n); let list = zr.spec.npcs ? zr.spec.npcs(s) : [];
    chainFor(zr).slice().reverse().forEach((cc) => { const p = cc.n !== zr.ch && cc.patch && cc.patch[api.trZone()]; if (p && p.npcs) list = p.npcs(stepOf(cc.n), list); });
    zr.Z.npcs = list.filter((n) => CAST_OK(n.id));
    const hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(s) : zr.spec.hints || {}), gl = goalNow();
    [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => { if (k) hints[k] = (gl ? "Obiettivo: " + gl + " · " : "") + (hints[k] || ""); });
    zr.Z.hints = hints;
  }
  let soon = 0;
  const refreshSoon = () => { clearTimeout(soon); soon = setTimeout(() => safe(refreshZone), 0); };
  const done = () => { refreshZone(); api.trResume(); };
  function lines(ls, bg) { return ls.map((l) => api.L(l[0], T(l[1]), l[2] || bg || bgNow())); }
  function say(ls, then) { api.trSay(lines(ls), typeof then === "function" ? then : done); }
  function ask(who, prompt, opts, bg) { api.trAsk(who, esc(T(prompt)).replace(/\n/g, "<br>"), opts.map((o) => ({ label: T(o.label), sub: o.sub ? T(o.sub) : undefined, cls: o.cls || "", disabled: !!o.disabled, fn: o.fn })), bg || bgNow()); }
  function reward(key, o) {
    const msg = [];
    once(key, () => { if (o.coins) { const n = coinsGive(o.coins); if (n) msg.push(`+${n} monete`); } (o.cos ? [].concat(o.cos) : []).forEach((id) => { const c = api.COSM && api.COSM[id] && safe(() => api.bCos(id), false) ? api.COSM[id].label : null; if (c) msg.push(`Nuovo in guardaroba: ${c}`); }); });
    return msg;
  }
  function setTiles(x0, y0, x1, y1, ch) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (ZX.map && ZX.map[y] && x >= 0 && x < ZX.map[y].length) { ZX.map[y][x] = ch; if (isFloor(ch) && ZX.under && ZX.under[y]) ZX.under[y][x] = ch; } }
  function go(zid, tx, ty) { const tr = api.trRec(); tr.pos[zid] = [tx * TS + 8, ty * TS + 12]; enterZone(zid); }
  function enterZone(zid) {
    const zr = ZONES[zid]; if (!zr) return;
    const m = mem(); m.zone = zid; save();
    castHero(); api.trRec().seen[zid] = true;
    FX.enter = frNow(); FX.title = zr.spec.short;
    api.trGo(zid); refreshZone();
    if (!m.intro[zid]) { m.intro[zid] = 1; save(); if (zr.spec.intro && zr.spec.intro.length) return say(zr.spec.intro, done); }
  }

  // ------------------------------------------------------------------ forzieri, cristalli di salvataggio, frammenti di storia
  const chestKey = (zid, tx, ty) => `x_${zid}_${tx}_${ty}`;
  function openChest(zid, tx, ty, def) {
    const k = chestKey(zid, tx, ty);
    if (F.is(k)) return say([["voce", "Il forziere è vuoto. Ci hai già messo le mani, e la tua faccia soddisfatta si riflette sul fondo."]]);
    F.set(k, true); SFX.chest();
    const msg = def && def.cos ? reward("chest:" + k, { cos: def.cos }) : [];
    if (def && def.coins) { const n = coinsGive(def.coins); if (n) msg.unshift(`+${n} monete`); }
    if (def && def.lore) learnLore(def.lore, true);
    say([["voce", `Apri il forziere. ${def && def.text ? def.text + " " : ""}${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}${def && def.lore && LORE[def.lore] ? ` · Nel Diario: «${LORE[def.lore].t}».` : ""}`]]);
  }
  function learnLore(id, quiet) { const m = mem(); if (!LORE[id] || m.lore.includes(id)) return false; m.lore.push(id); save(); if (!quiet) SFX.crystal(); return true; }
  function saveCrystal(back) {
    SFX.save(); refreshZone();
    ask("trillo", "Il cristallo azzurro gira piano. Ti senti rinfrancato. (Il gioco salva da solo, ma qui puoi anche cambiare i mestieri e la formazione.)", [
      { label: "✦ Mestieri e formazione", sub: "Contano solo nella Battaglia ATB", cls: "hot", fn: () => jobsMenu(() => saveCrystal(back)) },
      { label: "Il Diario del Cristallo", fn: () => diario(() => saveCrystal(back), true) },
      { label: "Riprendi il cammino", fn: back || done },
    ]);
  }

  // ------------------------------------------------------------------ MESTIERI
  const JOB_TXT = () => (window.__crATB && window.__crATB.JOBS) || { bomber: { n: "Bomber", ab: "Tiro Meteora" }, regista: { n: "Regista", ab: "Filtrante" }, muro: { n: "Muro", ab: "Barriera" }, funambolo: { n: "Funambolo", ab: "Finta Lunare" } };
  const MATE_DEF = { aira: { id: "cr_aira", job: "regista" }, bram: { id: "cr_bram", job: "muro" }, vela: { id: "cr_vela", job: "funambolo" } };
  const jobOf = (who) => { const m = mem(), j = m.jobs[who] || (who === "hero" ? "bomber" : MATE_DEF[who].job); return m.unl.includes(j) || (who !== "hero" && j === MATE_DEF[who].job) ? j : "bomber"; };
  const nameOf = (who) => (who === "hero" ? (hero() || {}).name || "Campione" : (api.CAST[MATE_DEF[who].id] || {}).name || who);
  function formation() { const m = mem(); const f = m.form.filter((x) => m.party.includes(x)); m.party.forEach((x) => { if (f.length < 2 && !f.includes(x)) f.push(x); }); return f.slice(0, 2); }
  function jobsMenu(back) {
    const m = mem(), J = JOB_TXT(), list = ["hero", ...m.party];
    if (!m.unl.length) return say([["voce", "Non conosci ancora nessun mestiere. Li insegnano i Cristalli."]], back);
    const f = formation();
    ask("voce", `Mestieri (valgono solo nella Battaglia ATB, non nelle partite normali).\nIn campo: ${nameOf("hero")}${f.map((x) => ", " + nameOf(x)).join("")}.`, [
      ...list.map((w) => ({ label: `${nameOf(w)} · ${J[jobOf(w)].n}`, sub: `Abilità: ${J[jobOf(w)].ab}${w !== "hero" && !f.includes(w) ? " · in panchina" : ""}`, fn: () => pickJob(w, () => jobsMenu(back)) })),
      ...(m.party.length > 2 ? [{ label: "⇄ Cambia formazione", sub: "Chi gioca accanto a te nella Battaglia ATB", fn: () => pickForm(() => jobsMenu(back)) }] : []),
      { label: "◂ Fatto", fn: back || done },
    ]);
  }
  function pickJob(who, back) {
    const m = mem(), J = JOB_TXT(), opts = (who === "hero" ? m.unl : [...new Set([MATE_DEF[who].job, ...m.unl])]).filter((j) => J[j]);
    ask("voce", `Che mestiere per ${nameOf(who)}?`, opts.map((j) => ({ label: `${jobOf(who) === j ? "✓ " : ""}${J[j].n}`, sub: `${J[j].ab}: ${J[j].d || ""}`, cls: jobOf(who) === j ? "hot" : "", fn: () => { m.jobs[who] = j; save(); SFX.job(); castHero(); back(); } })).concat([{ label: "◂ Indietro", fn: back }]));
  }
  function pickForm(back) {
    const m = mem(), f = formation();
    ask("voce", "Chi resta in panchina?", m.party.map((x) => ({ label: `${nameOf(x)}${f.includes(x) ? "" : " (già in panchina)"}`, disabled: !f.includes(x), fn: () => { m.form = m.party.filter((y) => y !== x).slice(0, 2); save(); back(); } })).concat([{ label: "◂ Indietro", fn: back }]));
  }
  function unlockJob(j) { const m = mem(); if (!JOB_IDS.includes(j) || m.unl.includes(j)) return false; m.unl.push(j); if (!m.jobs.hero) m.jobs.hero = j; save(); return true; }
  function join(who) { const m = mem(); if (!MATES.includes(who) || m.party.includes(who)) return false; m.party.push(who); save(); return true; }

  // ------------------------------------------------------------------ BATTAGLIA ATB e partite
  let inMatch = false;
  function battle(o) {
    const B = window.__crATB; castHero();
    if (!B || !B.start) return say([["voce", "La Battaglia ATB non si è caricata. Ricarica la pagina e riprova."]]);
    const h = hero() || {}, C = api.CAST, mk = (who) => { const c = who === "hero" ? h : C[MATE_DEF[who].id] || {}; return { name: nameOf(who), job: jobOf(who), skin: c.skin, hair: c.hair, shirt: who === "hero" ? (C.hero && C.hero.shirt) || "#3f5fbf" : c.shirt }; };
    const party = ["hero", ...formation()].map(mk);
    while (party.length < 3) party.push({ name: o.extraName || "Trillo", job: "muro", skin: "#f2e6dc", hair: "#ffffff", shirt: "#7ac84a" });
    api.scene(o.bg2 || bgNow(), "voce", "La battaglia è cominciata.", [{ label: "◂ Torna a camminare", fn: done }], o.title || "Battaglia ATB");
    inMatch = true;
    B.start({ title: T(o.title), bg: o.bg || "terra", us: o.us || "Guerrieri della Luce", oppName: o.oppName, party, foes: o.foes, keeper: o.keeper, foeCol: o.foeCol, boss: !!o.boss, target: o.target || 3, minutes: o.minutes || 2, diff: o.diff || 1, intro: T(o.intro || ""),
      onDone: (r) => { inMatch = false; const m = mem(); if (r.win) m.wins++; else m.losses++; save(); refreshZone(); safe(() => o.done(r), null); } });
  }
  function playMatch(o) {
    castHero(); inMatch = true;
    api.matchPick({
      alt: o.alt, oppNames: o.oppNames, squad: o.squad, azPitch: o.azPitch, cageMut: o.cageMut, cageTarget: o.cageTarget, homeKit: o.homeKit, cageField: o.cageField,
      force: o.force !== false && !!o.alt && !/,/.test(o.alt), id: o.id, chap: T(o.chap), intro: T(o.intro), mate: o.mate, mateGeneric: true, us: o.us, min: o.min || 45, team: o.team, venue: o.venue, weather: o.weather, bg: o.bg, hero: undefined,
      onDone: (r) => { inMatch = false; const m = mem(); if (r.win) m.wins++; else if (r.a < r.b) m.losses++; save(); refreshZone(); safe(() => o.done(r), null); },
    });
  }

  // ------------------------------------------------------------------ AERONAVE (Mode 7)
  function fly(fromZone) {
    const M7 = window.__crMode7; if (!M7 || !M7.start) return say([["voce", "La mappa del mondo non si è caricata. Ricarica la pagina e riprova."]]);
    const m = mem(), list = Object.keys(PLACES).map((id) => Object.assign({ id }, PLACES[id])).filter((p) => !p.hidden || !p.hidden());
    const here = list.find((p) => p.zone === fromZone) || list.find((p) => p.zone === "cr_borgo") || list[0];
    const startAt = m.ship || (here ? { x: here.x - 30, y: here.y + 20, a: -0.6 } : { x: 100, y: 100, a: 0 });
    SFX.ship(); inMatch = true;
    api.scene("cr_cielo", "voce", "La Rondine Grigia prende il volo.", [{ label: "◂ Torna a terra", fn: done }], "Rondine Grigia");
    M7.start({ title: "Rondine Grigia", at: startAt,
      places: list.map((p) => ({ id: p.id, name: p.name, x: p.x, y: p.y, col: p.col, r: p.r, locked: p.locked ? !!p.locked() : false })),
      onLand: (id, pos) => { inMatch = false; mem().ship = pos; save(); const p = PLACES[id]; if (p && p.land) safe(() => p.land(), null); else if (p) go(p.zone, p.at[0], p.at[1]); },
      onExit: (pos) => { inMatch = false; mem().ship = pos; save(); done(); },
    });
  }

  // l'aeronave: volare, oppure salire sul ponte (dove il gruppo chiacchiera tra un'isola e l'altra)
  function shipMenu(zid) {
    const deck = ZONES.cr_nave && zid !== "cr_nave" && ZONES.cr_nave.ch <= mem().ch;
    if (!deck) return fly(zid);
    ask("cr_vela", "La Rondine Grigia è pronta. Dove si va, Guerriero?", [
      { label: "✈ Prendi il volo", sub: "La mappa del mondo", cls: "hot", fn: () => fly(zid) },
      { label: "Sali sul ponte", sub: "Parla con il gruppo, cambia i mestieri", fn: () => { F.set("deck_from", zid); go("cr_nave", 8, 7); } },
      { label: "Resta a terra", fn: done },
    ]);
  }
  function registerZone(chN, zid, spec) {
    const rk = spec.region || "borgo";
    const syncZX = () => { ZX.id = zid; ZX.rk = rk; ZX.rg = REG[rk]; ZX.crystalCol = spec.crystal || "#ffd36b"; ZX.clusterCol = spec.cluster || spec.crystal || "#ffb347"; ZX.standCol = spec.stands; ZX.chestOpen = (tx, ty) => F.is(chestKey(zid, tx, ty)); ZX.crystalDim = spec.dim ? () => !!safe(() => spec.dim(stepOf(chN)), false) : null; };
    const Z = {
      name: spec.name, short: spec.short, sub: spec.sub || "", need: 0, w: spec.w, h: spec.h, start: spec.start, theme: "torino", isCustomSaga: true,
      bus: "uscita", busLabel: "Esci dalla saga",
      item: spec.item || ["Frammento di luce", "Frammenti"], itemCos: spec.itemCos, items: spec.items || [], bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: spec.pitch || [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({ s: "Tocca il cristallo azzurro", x: "Apri il forziere", i: "Sali sull'aeronave", h: "Prendi il timone" }, spec.act || {}), intro: [],
      me: () => { const c = api.CAST.hero || api.CAST.leo; return Object.assign({}, c); },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d"), f = frNow();
        g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, y, 11, "255,240,170", 0.5 + 0.2 * Math.sin(f / 10 + i)); g.restore();
        const w = Math.abs(Math.cos(f / 15 + i)) * 3 + 0.5; g.fillStyle = "#fff6c8"; g.beginPath(); g.moveTo(x, y - 5); g.lineTo(x + w, y); g.lineTo(x, y + 5); g.lineTo(x - w, y); g.closePath(); g.fill();
      },
    };
    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: il Diario, i Mestieri ed Esci." });
    Z.build = function (m) {
      ZX.map = m; syncZX(); GP = document.getElementById("cv").getContext("2d");
      const Ls = makeLayers(spec.w, spec.h, spec.base || ","); Ls.lay(0, 0, spec.w - 1, spec.h - 1, spec.base || ",");
      spec.build(Ls);
      chainFor(ZONES[zid]).slice().reverse().forEach((cc) => { const p = cc.n !== chN && cc.patch && cc.patch[zid]; if (p && p.build) p.build(Ls); });
      refreshSoon();
    };
    Z.tile = function (ch, sx, sy, tx, ty) { GP = GP || document.getElementById("cv").getContext("2d"); if (ZX.id !== zid) syncZX(); return drawTile(ch, sx, sy, tx, ty); };
    const dd = (cx, cy) => ({ X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow() });
    Z.decor = function (cx, cy) { safe(() => drawShips(frNow())); if (spec.decor) safe(() => spec.decor(GP, cx, cy, dd(cx, cy))); };
    Z.top = function (cx, cy) { if (spec.top) safe(() => spec.top(GP, cx, cy, dd(cx, cy))); safe(() => hd2d(GP, frNow())); };
    Z.onObj = function (ch, tx, ty) {
      let f = null;
      chainFor(ZONES[zid]).some((c) => { f = c.obj && (c.obj[zid + ":" + ch + ":" + tx + "," + ty] || c.obj[zid + ":" + ch]); return !!f; });
      if (f) { f({ ch, tx, ty, zid }); return true; }
      if (ch === "s") { saveCrystal(done); return true; }
      if (ch === "x") { const def = spec.chests && spec.chests[tx + "," + ty]; openChest(zid, tx, ty, def || { coins: 10 }); return true; }
      if (ch === "i" || ch === "h") { if (!F.is("ship")) { say([["voce", "Un'aeronave all'ormeggio. Non è tua. Non ancora."]]); return true; } shipMenu(zid); return true; }
      const flav = spec.flavor && (spec.flavor[tx + "," + ty] || spec.flavor[ch]);
      if (flav) { say([["voce", Array.isArray(flav) ? pick(flav) : flav]], done); return true; }
      if (Z.act[tx + "," + ty] || Z.act[ch]) { say([["voce", "Niente di speciale. Ma la luce, qui, è bellissima."]], done); return true; }
      return false;
    };
    Z.menu = () => zoneMenu();
    api.TRZ[zid] = Z;
    ZONES[zid] = { ch: chN, spec, Z };
  }

  // ------------------------------------------------------------------ menu e Diario
  function leave() { const back = EXIT || window.title; EXIT = null; api.trExitTo(typeof back === "function" ? back : null); }
  function zoneMenu() {
    const c = activeChapter(), m = mem(), zr = zoneRec();
    api.trAsk("voce", `<b>Cristalli del Campo</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Monete ${bal()} · Frammenti del Diario ${m.lore.length}</span>`, [
      { label: "Il Diario del Cristallo", sub: "Compagni, mestieri, storie trovate, finali", cls: "hot", fn: () => diario(zoneMenu, true) },
      ...(m.unl.length ? [{ label: "✦ Mestieri e formazione", sub: "Contano solo nella Battaglia ATB", fn: () => jobsMenu(zoneMenu) }] : []),
      ...(F.is("ship") && zr && zr.spec.dock ? [{ label: "✈ Vola con la Rondine Grigia", sub: "La mappa del mondo", fn: () => fly(api.trZone()) }] : []),
      { label: "Esci da Cristalli del Campo", sub: "Progressi e posizione restano salvati", cls: "hot", fn: leave },
    ], bgNow());
  }
  const ENDINGS = {
    luce: ["LA LUCE RITORNA", "I quattro Cristalli si riaccendono. Calcistea vola ancora, e ogni anno si gioca."],
    terra: ["LA TERRA FERMA", "I Cristalli si spezzano. I continenti scendono, piano, sul mare. Nessuno dovrà più giocare per non cadere."],
    corona: ["IL NUOVO RE", "Prendi la corona di Aldeberto. Il regno è salvo. Ed è tuo."],
    campo: ["IL QUINTO CAMPO", "Il finale segreto. Aira resta, e la luce la fanno tutte le partite del mondo."],
  };
  function diario(back, inZone) {
    const m = mem(), h0 = hero() || { name: "Campione", num: 9 }, J = JOB_TXT();
    const party = ["hero", ...m.party].map((w) => `• <b>${esc(nameOf(w))}</b> · ${esc(m.unl.length || w !== "hero" ? J[jobOf(w)].n : "senza mestiere")}`).join("<br>");
    const lore = Object.keys(LORE).map((k) => (m.lore.includes(k) ? `• <b>${esc(LORE[k].t)}</b><br><span style="color:var(--dim)">${esc(T(LORE[k].d))}</span>` : "<span style='color:var(--dim)'>• ???</span>")).join("<br>");
    const ends = Object.keys(ENDINGS).map((k) => (m.ends.includes(k) ? `✓ <b>${esc(ENDINGS[k][0])}</b> <span style="color:var(--dim)">${esc(ENDINGS[k][1])}</span>` : "<span style='color:var(--dim)'>• ???</span>")).join("<br>");
    const html = `<b>${esc(h0.name)}</b> · Guerriero della Luce · vittorie ${m.wins}<br><br><b>Compagni</b><br>${party}<br><br><b>Frammenti di storia</b> (${m.lore.length}/${Object.keys(LORE).length})<br>${lore || "<span style='color:var(--dim)'>Niente, per ora.</span>"}<br><br><b>Finali</b><br>${ends}`;
    if (inZone) return api.trAsk("voce", html, [{ label: "◂ Indietro", fn: back }], bgNow());
    api.scene("cr_borgo", "voce", html, [{ label: "◂ Indietro", fn: back }], "Il Diario del Cristallo");
  }

  function finishChapter(n, ending) { const m = mem(); m.done[n] = String(ending || "ok").slice(0, 24); if (m.ch <= n) m.ch = n + 1; save(); }

  const XTOOLS = {
    get api() { return api; }, TS, T, esc, hash, rnd, pick, safe, F, mem, save, stepOf, setStep, note, once, reward, coinsGive, bal, hero, castHero,
    say, ask, done, go, enterZone, playMatch, battle, fly, finishChapter, setTiles, SFX, glow, frNow, refreshZone, bgNow, diario, leave, lines,
    bond, learnLore, unlockJob, join, jobsMenu, formation, jobOf, nameOf, ENDINGS, ZX, light,
    scene: (ls, then, bg) => api.play(lines(ls, bg || "cr_borgo"), then),
    lore: (id, d) => { LORE[id] = d; },
    place: (id, d) => { PLACES[id] = d; },
    cast: (id, c, bio) => { if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c); if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio; },
    cos: (id, d) => { COS[id] = d; if (api && api.COSM && !api.COSM[id]) api.COSM[id] = d; },
    end: (id) => { const m = mem(); if (ENDINGS[id] && !m.ends.includes(id)) { m.ends.push(id); save(); } },
    continueStory: () => continueStory(), hasChapter: (n) => !!CHAPTERS[n], setInMatch: (v) => { inMatch = !!v; },
  };
  function addChapter(fn) {
    if (!api) { PENDING.push(fn); return; }
    const def = typeof fn === "function" ? fn(XTOOLS) : fn;
    if (!def || !def.n || CHAPTERS[def.n]) return;
    CHAPTERS[def.n] = def;
    Object.keys(def.zones || {}).forEach((zid) => registerZone(def.n, zid, def.zones[zid]));
    Object.keys(def.patch || {}).forEach((zid) => { const p = def.patch[zid]; if (p.act && ZONES[zid]) Object.assign(ZONES[zid].Z.act, p.act); });
  }

  function leaveToModes() { const back = EXIT || window.title; EXIT = null; api.trExitTo(typeof back === "function" ? back : null); }
  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    reload();
    const h = hero();
    if (!h) return api.scene("cr_borgo", "voce", "<b>Cristalli del Campo</b><br>Il Cristallo della Terra cerca un Guerriero della Luce: il tuo Campione. Prima crealo.", [
      { label: "Crea il tuo Campione", sub: "Nome, numero e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Cristalli del Campo");
    castHero();
    const c = activeChapter(), m = mem(), cur = c && m.done[c.n], nextOk = !!CHAPTERS[(c ? c.n : 0) + 1];
    const status = m.done[3] ? `Storia conclusa. Finali trovati: ${m.ends.length} su ${Object.keys(ENDINGS).length}.` : cur ? (nextOk ? "Il prossimo capitolo ti aspetta." : "Capitolo concluso · il prossimo è in arrivo.") : goalNow();
    api.scene("cr_borgo", "voce", `<b>💎 Cristalli del Campo · Final Tactics</b><br>${esc(h.name)} · Guerriero della Luce<br><span style="color:var(--dim)">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}<br>${esc(status)}</span>`, [
      { label: c && !m.intro["ch" + c.n] ? (c.n > 1 ? `Inizia il Capitolo ${c.n}` : "Inizia l'avventura") : "Continua l'avventura", sub: c ? `Capitolo ${c.n} · ${c.title}` : "", cls: "hot", fn: continueStory },
      { label: "Il Diario del Cristallo", sub: "Compagni, storie trovate, finali", fn: () => diario(openMain, false) },
      { label: "Capitoli", sub: "Rigioca i capitoli già sbloccati", fn: chapters },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Cristalli del Campo");
  }
  function chapters() {
    const m = mem(), opts = [];
    for (let n = 1; n <= 3; n++) {
      const c = CHAPTERS[n], open = c && (n === 1 || m.done[n - 1] || m.ch >= n);
      if (open) opts.push({ label: `${m.done[n] ? "✓" : "▸"} Capitolo ${n} · ${c.title}`, sub: m.done[n] ? "Concluso · rigioca" : c.sub || "", cls: m.ch === n ? "hot" : "", fn: () => { m.ch = n; save(); continueStory(); } });
      else opts.push({ label: `• Capitolo ${n} · ${c ? c.title : "???"}`, sub: c ? "Finisci il capitolo prima" : "In arrivo", disabled: true, fn: chapters });
    }
    opts.push({ label: "Ricomincia da capo", sub: "Cancella solo questo salvataggio", fn: resetAsk });
    opts.push({ label: "◂ Indietro", fn: openMain });
    api.scene("cr_borgo", "voce", "<b>Capitoli</b><br>Tre capitoli, quattro Cristalli. Le scelte restano: cambiano il finale.", opts, "Cristalli del Campo · Capitoli");
  }
  function resetAsk() {
    api.scene("cr_borgo", "voce", "<b>Ricominciare?</b><br>Si cancellano scelte, mestieri, compagni e finali di Cristalli del Campo. Monete e cosmetici restano tuoi.", [
      { label: "Sì, ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
      { label: "◂ No", fn: chapters },
    ], "Cristalli del Campo");
  }
  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    if (!m.intro["ch" + c.n]) {
      m.intro["ch" + c.n] = 1; save();
      return api.play(lines(c.intro(), c.introBg || "cr_borgo"), () => { const z = ZONES[c.start]; go(c.start, z.spec.start[0], z.spec.start[1]); });
    }
    const zid = m.zone && ZONES[m.zone] && ZONES[m.zone].ch <= m.ch ? m.zone : c.start;
    enterZone(zid);
  }

  function start() {
    Object.keys(COS).forEach((id) => { if (api.COSM && !api.COSM[id]) api.COSM[id] = COS[id]; });
    const desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    const chained = !(desc && desc.set);
    const prev = chained ? window.trTalkHook : null;
    const mineC = (id) => { const zr = zoneRec(); if (!zr || !zr.Z.npcs.some((n) => n.id === id)) return null; return chainFor(zr).find((c) => c.talk && c.talk[id]) || null; };
    window.trTalkHook = function (id) { const c = mineC(id); if (c) { castHero(); safe(() => c.talk[id](), null); return true; } return chained && typeof prev === "function" ? prev(id) : false; };
    const prevNews = window.trNewsHook;
    window.trNewsHook = function (id) { const c = zoneRec() && mineC(id); if (c) return c.news ? !!safe(() => c.news(id, stepOf(c.n)), false) : false; return typeof prevNews === "function" ? prevNews(id) : null; };
    PENDING.splice(0).forEach(addChapter);
    chip();
  }
  function chip() {
    if (document.getElementById("crExit")) return;
    const st = document.createElement("style");
    st.textContent = "#crExit{position:fixed;left:8px;bottom:8px;z-index:60;display:none;min-height:36px;padding:6px 12px;border-radius:8px;border:2px solid #e8e0d0;background:linear-gradient(#1a2a6a,#0a1440);color:#f0e6c8;font:700 13px/1.1 Georgia,serif;box-shadow:0 2px 8px #0008}#crExit.on{display:block}body.crMM #stats{margin-bottom:54px}";
    document.head.appendChild(st);
    const b = document.createElement("button"); b.id = "crExit"; b.type = "button"; b.textContent = "✕ Esci"; b.setAttribute("aria-label", "Esci da Cristalli del Campo");
    b.onclick = () => { if (inMatch) { const hb = document.getElementById("homeBtn"); if (hb) hb.click(); return; } if (zoneRec()) leave(); };
    document.body.appendChild(b);
    const oc = document.getElementById("ovlCh");
    if (oc) oc.addEventListener("click", (e) => { if (inMatch && e.target && e.target.closest && e.target.closest("button.danger")) { inMatch = false; setTimeout(() => safe(() => api.trExitTo(function () {})), 0); } });
    setInterval(() => {
      const hud = document.getElementById("matchHud"), live = !!(hud && !hud.hidden), zr = zoneRec(), own = !!(document.getElementById("crATB") || document.getElementById("crM7"));
      const on = !own && !!((zr && document.body.classList.contains("borgo")) || (inMatch && live));
      b.classList.toggle("on", on); document.body.classList.toggle("crMM", !!(inMatch && live)); b.textContent = inMatch && live ? "✕ Esci dalla partita" : "✕ Esci";
    }, 400);
  }
  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match || !a.matchPick) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a; start();
  }
  window.__cristalli = {
    version: 1, KEY, addChapter, open: openMain, SFX, _has: (n) => !!CHAPTERS[n],
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return { label: "💎 Cristalli del Campo", cls: "hot", fn: () => openMain({ onExit: back }), sub: h ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "JRPG"} · mestieri, aeronave, battaglie ATB` : "Crea prima il tuo campione · JRPG a 16 bit" };
    },
    endings() { const m = mem(); return Object.keys(ENDINGS).map((k) => ({ id: k, title: ENDINGS[k][0], desc: ENDINGS[k][1], found: m.ends.includes(k) })); },
    info() { const m = mem(); return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), ends: m.ends.slice(), flags: Object.assign({}, m.flags), jobs: Object.assign({}, m.jobs), unl: m.unl.slice(), party: m.party.slice(), lore: m.lore.slice(), luce: m.luce, ferro: m.ferro, corona: m.corona, trust: m.trust }; },
    _dbg: /[?&]debug\b/.test(location.search || "") ? { mem, ZONES, CHAPTERS, ZX, go, F, LORE, PLACES, fly } : undefined,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
