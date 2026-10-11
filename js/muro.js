// js/muro.js - IL MURO · motore della saga
// Saga cupa e avventurosa per il Campione creato dall'utente (heroLoad()). Ispirata a L'attacco dei giganti, Trono di Spade, The Last of Us.
// Cintavecchia è l'ultima città, chiusa dentro un muro altissimo. Fuori camminano i COLOSSI di pietra: lenti, enormi, silenziosi.
// Sopra il muro si gioca la Partita sul Muro (js/muro-partita.js). Il Campione entra nella Guardia del Muro.
// Novità di questa saga:
//  - QUARTIERI con un'atmosfera propria: la Città Bassa (pioggia e lanterne), il Camminamento (vento), la Terra di Fuori (nebbia,
//    erba alta), il Palazzo del Consiglio, le viscere del muro.
//  - RICOGNIZIONE FURTIVA: nella Terra di Fuori i Colossi camminano lungo i loro giri e guardano davanti a sé (un cono di sguardo).
//    Nell'ERBA ALTA non ti vedono, a meno che tu non gli passi proprio sotto. Se ti vedono, una mano scende, e ti ritrovi all'ingresso.
//  - IL TACCUINO: si disegnano i Colossi addormentati e si raccolgono documenti. Le scoperte cambiano i finali.
//  - FAZIONI: le scelte spostano tre legami (Guardia, Consiglio, Fuorimura) e la fiducia di Nives.
// Zone sul motore TRZ di game.js (window.__borgoApi), sfondi mu_* in js/bg-scenarios.js. Ricompense: solo monete e cosmetici.
// Salvataggio proprio: ali-di-rondine.muro.
(function () {
  "use strict";
  if (window.__muroLoaded) return;
  window.__muroLoaded = true;
  const KEY = "ali-di-rondine.muro", TS = 16;
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

  // ------------------------------------------------------------------ audio: campane, corni, passi di pietra
  let actx = null;
  function ac() { if (!actx && (window.AudioContext || window.webkitAudioContext)) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (actx && actx.state === "suspended") safe(() => actx.resume()); return actx; }
  function tone(f, d, type, vol, when, slide) { const c = ac(); if (!c) return; safe(() => { const t = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02); }); }
  const SFX = {
    bell: () => { tone(392, 1.6, "sine", 0.08); tone(588, 1.2, "sine", 0.04, 0.02); },
    horn: () => { tone(110, 1.2, "sawtooth", 0.05, 0, 98); tone(165, 1.0, "triangle", 0.05, 0.1); },
    sketch: () => [880, 988, 1175].forEach((f, i) => tone(f, 0.08, "triangle", 0.05, i * 0.05)),
    chest: () => { [330, 415, 494].forEach((f, i) => tone(f, 0.12, "triangle", 0.06, i * 0.08)); },
    step: () => tone(55, 0.4, "sine", 0.12, 0, 40),
    caught: () => { tone(80, 0.8, "sawtooth", 0.08, 0, 40); tone(60, 1.0, "square", 0.05, 0.2, 30); },
    warn: () => tone(220, 0.25, "square", 0.04, 0, 180),
    fire: () => tone(150, 0.5, "triangle", 0.05, 0, 300),
  };

  // ------------------------------------------------------------------ salvataggio
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  const LORE = {};
  function norm(o) {
    o = obj(o);
    const m = { v: 1, ch: clampI(o.ch, 1, 9, 1), step: {}, flags: {}, rew: {}, done: {}, zone: "", log: [], intro: {}, ends: [], wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0),
      lore: [], guardia: clampI(o.guardia, 0, 99, 0), consiglio: clampI(o.consiglio, 0, 99, 0), fuori: clampI(o.fuori, 0, 99, 0), trust: clampI(o.trust, -9, 9, 0), caught: clampI(o.caught, 0, 9999, 0) };
    const st = obj(o.step); Object.keys(st).slice(0, 20).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n) m.step[n] = clampI(st[k], 0, 99, 0); });
    const fl = obj(o.flags); let c = 0;
    Object.keys(fl).forEach((k) => { if (c >= 300 || !FLAG_RE.test(k)) return; const v = fl[k]; if (typeof v === "boolean" || (typeof v === "number" && Number.isFinite(v)) || (typeof v === "string" && v.length <= 24)) { m.flags[k] = v; c++; } });
    Object.keys(obj(o.rew)).forEach((k) => { if (REW_RE.test(k) && Object.keys(m.rew).length < 200) m.rew[k] = 1; });
    const dn = obj(o.done); Object.keys(dn).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n && typeof dn[k] === "string" && dn[k].length <= 24) m.done[n] = dn[k]; });
    m.zone = typeof o.zone === "string" && ZONE_RE.test(o.zone) ? o.zone : "";
    m.log = arr(o.log).filter((x) => typeof x === "string").map((x) => x.slice(0, 220)).slice(-80);
    Object.keys(obj(o.intro)).forEach((k) => { if (FLAG_RE.test(k)) m.intro[k] = 1; });
    m.ends = [...new Set(arr(o.ends).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 12);
    m.lore = [...new Set(arr(o.lore).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 40);
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
  const bond = (k, d) => { const m = mem(); if (k === "trust") m.trust = Math.max(-9, Math.min(9, m.trust + d)); else if (["guardia", "consiglio", "fuori"].includes(k)) m[k] = Math.max(0, Math.min(99, m[k] + d)); save(); };

  // ------------------------------------------------------------------ il Campione
  const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "il tuo tiro" };
    return String(s).replace(/\{n\}/g, () => h.name).replace(/\{num\}/g, () => h.num).replace(/\{tiro\}/g, () => h.shotName || "il tuo tiro");
  }
  function castHero() {
    const h = hero(), C = api && api.CAST; if (!h || !C) return;
    C.hero = Object.assign({}, C.hero || {}, { name: h.name, tag: "", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye, bg: ["#1a1c24", "#a8322a"], shirt: F.is("guardia_mantello") ? "#a8322a" : "#5a5a62", num: String(h.num) });
  }
  const coinsGive = (n) => (n > 0 && typeof window.addCoins === "function" ? safe(() => { window.addCoins(n); return n; }, 0) : 0);
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

  // ------------------------------------------------------------------ QUARTIERI (palette e atmosfera)
  // grass: terra/erba · path: selciato · stone: lastre · wall: mattoni o pietra · tall: erba alta · fx: particelle · tint: tinta
  const REG = {
    bassa: { grass: ["#3a3638", "#403b3d", "#363234"], path: ["#5a5250", "#524a48"], stone: ["#6a6260", "#625a58"], wall: ["#5a3a30", "#4a3028"], water: ["#1e2a3a", "#243246"], tall: "#3a5a3a", tint: "255,180,110", tintA: 0.1, fx: "rain", dark: 0.32 },
    muro: { grass: ["#7a7468", "#827c70", "#746e62"], path: ["#8a8478", "#958e80"], stone: ["#9a9488", "#8e887c"], wall: ["#5a564e", "#4e4a42"], water: ["#3a5a7a", "#446888"], tall: "#6a8a4a", tint: "255,210,160", tintA: 0.1, fx: "wind", dark: 0.15 },
    fuori: { grass: ["#4a6a3a", "#52723f", "#466436"], path: ["#7a6a4a", "#706044"], stone: ["#7a7a70", "#707066"], wall: ["#4a4a42", "#3e3e36"], water: ["#2a4a5a", "#305466"], tall: "#5f8a45", tint: "200,220,200", tintA: 0.14, fx: "fog", dark: 0.18 },
    palazzo: { grass: ["#5a1e24", "#62222a", "#561c22"], path: ["#c9b48a", "#bfaa80"], stone: ["#d8d0c0", "#ccc4b4"], wall: ["#7a6a5a", "#6e5e4e"], water: ["#2a4a6a", "#305474"], tall: "#4a6a3a", tint: "255,220,170", tintA: 0.12, fx: "dust", dark: 0.2 },
    cavo: { grass: ["#2e2a26", "#34302a", "#2a2622"], path: ["#4a4238", "#443c32"], stone: ["#4e4840", "#46403a"], wall: ["#22201c", "#2a2722"], water: ["#1a2a2a", "#203232"], tall: "#3a4a2a", tint: "255,160,80", tintA: 0.16, fx: "dust", dark: 0.45 },
  };
  const FLOORS = ',:+-"=;';
  // Solidi: a muro/mattoni · t albero · r rovina/masso · y casa · q porta · w acqua · c il Grande Portone · s braciere (riposo)
  //         x baule · f parapetto/staccionata · l lanterna · b panca · g porta da calcio · j tribuna · n cartello · k argano
  //         o Colosso addormentato · p colonna · m macerie · e strapiombo · u bancarella · z casse e botti · d scaffale d'archivio
  // Pavimenti: , terra · : selciato · + lastre · - campo · " tappeto · = assi · ; erba alta (nasconde)
  const SOLID = "atryqwcsxflbgjnkopmeuzd";
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);
  const ZX = { map: null, under: null, meta: null, id: "", rg: REG.bassa, rk: "bassa", lights: [], statues: [] };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "a";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  const light = (x, y, r, rgb, a) => { if (ZX.lights.length < 60) ZX.lights.push([x, y, r, rgb, a]); };
  const shadow = (sx, sy, w) => { GP.fillStyle = "rgba(0,0,0,.25)"; GP.beginPath(); GP.ellipse(sx + 9, sy + 14, w || 7, 2.6, 0, 0, 7); GP.fill(); };

  function floorPaint(f, sx, sy, tx, ty) {
    const R = ZX.rg, r = rnd(tx, ty, 1), k = ZX.rk;
    if (f === ",") {
      P(sx, sy, 16, 16, R.grass[hash(tx * 3 + ty * 7) % 3]);
      if (k === "fuori") { for (let i = 0; i < 5; i++) P(sx + ((tx * 5 + i * 4) % 15), sy + ((ty * 7 + i * 5) % 13), 1, 3, "rgba(20,40,10,.35)"); if (r < 0.06) { P(sx + 5, sy + 6, 2, 2, "#e8e2c8"); } }
      else if (k === "palazzo") { if ((tx + ty) % 2) P(sx, sy, 16, 16, "rgba(0,0,0,.08)"); P(sx, sy, 16, 1, "rgba(255,220,160,.15)"); }
      else { for (let i = 0; i < 3; i++) P(sx + ((tx * 5 + i * 6) % 14), sy + ((ty * 7 + i * 5) % 14), 2, 1, "rgba(0,0,0,.2)"); if (k === "bassa" && r < 0.1) P(sx + 3, sy + 9, 5, 1, "rgba(255,190,120,.25)"); }
    } else if (f === ":") {
      P(sx, sy, 16, 16, R.path[(tx + ty) % 2]);
      for (let i = 0; i < 4; i++) { const ox = (i % 2) * 8 + ((ty % 2) * 4), oy = Math.floor(i / 2) * 8; P(sx + ox, sy + oy, 7, 7, "rgba(255,255,255,.05)"); P(sx + ox, sy + oy + 6, 7, 1, "rgba(0,0,0,.22)"); }
      if (k === "bassa" && rnd(tx, ty, 9) < 0.14) P(sx + 3 + r * 8, sy + 9, 3, 1, "rgba(255,200,120,.35)"); // riflessi sul selciato bagnato
    } else if (f === "+") {
      P(sx, sy, 16, 16, R.stone[(tx + ty) % 2]); P(sx, sy + 15, 16, 1, "rgba(0,0,0,.18)"); P(sx + 15, sy, 1, 16, "rgba(0,0,0,.14)"); P(sx, sy, 16, 1, "rgba(255,255,255,.1)");
      if (r < 0.12) P(sx + 4, sy + 6, 5, 1, "rgba(0,0,0,.2)");
    } else if (f === "-") {
      if (k === "muro") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8a8478" : "#827c70"); P(sx, sy, 16, 1, "rgba(255,255,255,.18)"); }
      else { P(sx, sy, 16, 16, tx % 2 ? "#4f7a3e" : "#57843f"); for (let i = 0; i < 3; i++) P(sx + ((tx * 5 + i * 5) % 15), sy + ((ty * 7 + i * 4) % 13), 1, 3, "rgba(255,255,255,.1)"); }
    } else if (f === '"') { P(sx, sy, 16, 16, "#6a1a24"); P(sx, sy + 1, 16, 1, "rgba(232,196,106,.45)"); P(sx, sy + 14, 16, 1, "rgba(232,196,106,.45)"); }
    else if (f === "=") { P(sx, sy, 16, 16, "#6a4a30"); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "rgba(0,0,0,.3)"); P(sx, sy, 16, 1, "#8a6a40"); }
    else if (f === ";") { // erba alta: fili che ondeggiano e sporgono verso l'alto
      P(sx, sy, 16, 16, R.grass[hash(tx * 3 + ty * 7) % 3]); const fr = frNow(), sw = Math.sin(fr / 30 + tx * 0.7 + ty) * 1.5;
      for (let i = 0; i < 7; i++) { const x = sx + 1 + i * 2.2 + ((tx + i) % 2), h = 10 + ((tx * 3 + i * 5 + ty) % 6); GP.strokeStyle = i % 2 ? R.tall : "#4a7034"; GP.lineWidth = 1.4; GP.beginPath(); GP.moveTo(x, sy + 15); GP.quadraticCurveTo(x + sw * 0.5, sy + 15 - h * 0.6, x + sw, sy + 15 - h); GP.stroke(); }
    } else P(sx, sy, 16, 16, R.grass[0]);
  }
  function houseTile(sx, sy, tx, ty) {
    const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx], R = ZX.rg;
    if (!m) { P(sx, sy, 16, 16, R.wall[0]); return; }
    const o = m.o, roof = o.roof || "#4a3a3a", wall = o.wall || "#8a7a68";
    if (m.ry < o.rr) {
      P(sx, sy, 16, 16, roof); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "rgba(0,0,0,.25)"); for (let i = 0; i < 16; i += 4) P(sx + i + (m.ry % 2) * 2, sy, 1, 16, "rgba(0,0,0,.1)");
      if (m.ry === 0) P(sx, sy, 16, 2, "rgba(255,255,255,.15)"); if (m.ry === o.rr - 1) P(sx, sy + 13, 16, 3, "rgba(0,0,0,.4)");
      if (o.chimney && m.rx === o.w - 2 && m.ry === 0) { P(sx + 4, sy - 6, 6, 10, "#4a3a32"); const f = frNow(); for (let i = 0; i < 3; i++) { GP.fillStyle = `rgba(160,160,160,${0.35 - i * 0.1})`; GP.beginPath(); GP.arc(sx + 7 + Math.sin(f / 20 + i) * 2, sy - 10 - i * 5 - (f / 6 % 5), 2 + i, 0, 7); GP.fill(); } }
      return;
    }
    P(sx, sy, 16, 16, wall); P(sx, sy, 16, 1, "rgba(0,0,0,.2)");
    for (let r = 0; r < 4; r++) { P(sx, sy + r * 4 + 3, 16, 1, "rgba(0,0,0,.15)"); P(sx + ((r % 2) * 8 + (tx % 2) * 4), sy + r * 4, 1, 4, "rgba(0,0,0,.12)"); }
    const win = m.rx > 0 && m.rx < o.w - 1 && m.rx % 2 === 1 && !(o.door && o.door[0] === tx && o.door[1] === ty);
    if (win) { const lit = rnd(tx, ty, 5) < 0.65; P(sx + 4, sy + 3, 8, 8, "#2a1a14"); P(sx + 5, sy + 4, 6, 6, lit ? "#ffcf7a" : "#3a4a5a"); P(sx + 7, sy + 4, 1, 6, "#2a1a14"); if (lit) light(sx + 8, sy + 7, 14, "255,200,110", 0.4); }
    if (m.rx === 0) P(sx, sy, 1, 16, "rgba(255,255,255,.12)"); if (m.rx === o.w - 1) P(sx + 15, sy, 1, 16, "rgba(0,0,0,.35)");
  }
  // un Colosso disegnato in piedi (pos. in pixel di schermo, piedi in basso), con sguardo verso dir (radianti)
  function colossus(g, x, y, dir, fr, o) {
    o = o || {}; const s = o.s || 1, step = Math.sin(fr / 26 + (o.ph || 0)) * 2 * s, col = o.col || "#8a8278", dk = o.dk || "#5a5248";
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(x, y, 20 * s, 7 * s, 0, 0, 7); g.fill();
    g.fillStyle = dk; g.fillRect(x - 12 * s, y - 22 * s + step, 9 * s, 22 * s - step); g.fillRect(x + 3 * s, y - 22 * s - step, 9 * s, 22 * s + step);
    g.fillStyle = col; g.fillRect(x - 16 * s, y - 58 * s, 32 * s, 38 * s); g.fillStyle = "rgba(0,0,0,.15)"; g.fillRect(x + 6 * s, y - 58 * s, 10 * s, 38 * s);
    g.fillStyle = dk; g.fillRect(x - 24 * s, y - 54 * s - step, 8 * s, 30 * s); g.fillRect(x + 16 * s, y - 54 * s + step, 8 * s, 30 * s);
    g.fillStyle = col; g.fillRect(x - 10 * s, y - 76 * s, 20 * s, 19 * s);
    // crepe e muschio
    g.fillStyle = "rgba(60,90,40,.6)"; g.fillRect(x - 14 * s, y - 40 * s, 6 * s, 3 * s); g.fillRect(x + 2 * s, y - 70 * s, 5 * s, 2 * s);
    g.strokeStyle = dk; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 4 * s, y - 56 * s); g.lineTo(x, y - 48 * s); g.lineTo(x - 3 * s, y - 40 * s); g.stroke();
    const ex = Math.cos(dir) * 3 * s; g.fillStyle = o.alert ? "#ff5a3a" : "#ffcf7a"; g.fillRect(x - 6 * s + ex, y - 70 * s, 4 * s, 3 * s); g.fillRect(x + 2 * s + ex, y - 70 * s, 4 * s, 3 * s);
    g.save(); g.globalCompositeOperation = "lighter"; glow(g, x + ex, y - 69 * s, 12 * s, o.alert ? "255,90,60" : "255,200,120", 0.4); g.restore();
    if (o.num) { g.fillStyle = dk; g.font = `bold ${Math.round(9 * s)}px Georgia, serif`; g.textAlign = "center"; g.fillText(o.num, x, y - 34 * s); g.textAlign = "left"; }
  }
  const PAINT = {
    a(sx, sy, tx, ty) { // mattoni (città) o grandi blocchi (il muro)
      const R = ZX.rg, k = ZX.rk; P(sx, sy, 16, 16, R.wall[(tx + ty) % 2]);
      if (k === "muro" || k === "cavo" || k === "fuori") { P(sx, sy + 7, 16, 1, "rgba(0,0,0,.3)"); P(sx + ((ty % 2) * 8), sy, 1, 7, "rgba(0,0,0,.25)"); P(sx + (((ty + 1) % 2) * 8), sy + 8, 1, 8, "rgba(0,0,0,.25)"); if (rnd(tx, ty, 4) < 0.2) P(sx + 3, sy + 10, 4, 2, "rgba(60,90,40,.5)"); }
      else { for (let r = 0; r < 4; r++) { P(sx, sy + r * 4 + 3, 16, 1, "rgba(0,0,0,.25)"); P(sx + ((r % 2) * 8 + (tx % 2) * 4), sy + r * 4, 1, 4, "rgba(0,0,0,.2)"); } }
      if (at(tx, ty - 1) !== "a") P(sx, sy, 16, 2, "rgba(255,255,255,.12)");
      if (at(tx, ty + 1) !== "a") P(sx, sy + 13, 16, 3, "rgba(0,0,0,.35)");
    },
    t(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 8); P(sx + 6, sy + 6, 4, 9, "#4a3420"); const sw = Math.sin(fr / 60 + tx * 0.7) * 0.8, dead = ZX.rk === "bassa" || ZX.rk === "cavo"; const c = dead ? ["#3a3a2a", "#4a4a34", "#5a5a40"] : ["#2a4a26", "#36602e", "#4f7f3a"]; GP.fillStyle = c[0]; GP.beginPath(); GP.arc(sx + 8 + sw, sy - 1, 8, 0, 7); GP.fill(); GP.fillStyle = c[1]; GP.beginPath(); GP.arc(sx + 7 + sw, sy - 3, 6.5, 0, 7); GP.fill(); GP.fillStyle = c[2]; GP.beginPath(); GP.arc(sx + 5 + sw, sy - 5, 3, 0, 7); GP.fill(); },
    r(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); const ruin = ZX.rk === "fuori"; if (ruin && (tx + ty) % 2) { P(sx + 2, sy + 2, 12, 13, "#7a7468"); P(sx + 2, sy + 2, 12, 2, "#9a9488"); P(sx + 2, sy + 8, 12, 1, "rgba(0,0,0,.25)"); P(sx + 7, sy + 2, 1, 6, "rgba(0,0,0,.25)"); P(sx + 3, sy + 12, 4, 2, "rgba(60,90,40,.6)"); return; } GP.fillStyle = "#6a6a62"; GP.beginPath(); GP.ellipse(sx + 8, sy + 9, 7, 6, 0, 0, 7); GP.fill(); GP.fillStyle = "rgba(255,255,255,.18)"; GP.beginPath(); GP.ellipse(sx + 6, sy + 6, 3.5, 2.5, -0.4, 0, 7); GP.fill(); },
    y: (sx, sy, tx, ty) => houseTile(sx, sy, tx, ty),
    q(sx, sy, tx, ty) { const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx]; P(sx, sy, 16, 16, (m && m.o.wall) || ZX.rg.wall[0]); P(sx + 3, sy + 2, 10, 14, "#3a2418"); P(sx + 3, sy + 2, 10, 2, "#5a3a24"); P(sx + 8, sy + 2, 1, 14, "rgba(0,0,0,.4)"); P(sx + 10, sy + 9, 2, 2, "#c9a227"); },
    w(sx, sy, tx, ty, fr) { const R = ZX.rg; P(sx, sy, 16, 16, R.water[(tx + ty) % 2]); const o = (fr / 3 + tx * 5 + ty * 3) % 16; P(sx + o - 4, sy + 4 + (ty % 2) * 6, 6, 1, "rgba(255,255,255,.3)"); if (at(tx, ty - 1) !== "w") P(sx, sy, 16, 2, "rgba(255,255,255,.3)"); },
    c(sx, sy, tx, ty, fr) { // il Grande Portone (una tessera per pezzo: ferro e legno, borchie)
      P(sx, sy, 16, 16, "#3a2a1e"); P(sx, sy, 16, 1, "rgba(255,255,255,.1)"); for (let i = 0; i < 16; i += 4) P(sx + i, sy, 1, 16, "rgba(0,0,0,.35)"); P(sx, sy + 5, 16, 2, "#4a4a52"); P(sx, sy + 11, 16, 2, "#4a4a52"); P(sx + 3, sy + 5, 2, 2, "#8a8a9a"); P(sx + 11, sy + 11, 2, 2, "#8a8a9a");
      if (ZX.gateOpen && ZX.gateOpen()) { P(sx, sy, 16, 16, "rgba(255,240,200,.35)"); light(sx + 8, sy + 8, 18, "255,240,200", 0.3); }
    },
    s(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 6); P(sx + 3, sy + 9, 10, 6, "#3a3a42"); P(sx + 2, sy + 8, 12, 2, "#5a5a62"); for (let i = 0; i < 3; i++) { const h = 4 + Math.abs(Math.sin(fr / 6 + i * 2)) * 4; P(sx + 4 + i * 3, sy + 8 - h, 2, h, i === 1 ? "#ffd36b" : "#ff8a3a"); } light(sx + 8, sy + 5, 24, "255,150,60", 0.5); },
    x(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); const open = ZX.chestOpen && ZX.chestOpen(tx, ty); P(sx + 2, sy + 6, 12, 8, "#5a3a20"); P(sx + 2, sy + 9, 12, 1, "#8a8a9a"); if (open) { P(sx + 2, sy + 2, 12, 4, "#3a2410"); P(sx + 3, sy + 6, 10, 2, "#1a120a"); } else { P(sx + 2, sy + 3, 12, 4, "#6a4a28"); P(sx + 7, sy + 7, 2, 3, "#c9a227"); } },
    f(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); if (ZX.rk === "muro") { P(sx, sy + 2, 16, 12, "#6a6458"); P(sx, sy + 2, 16, 2, "#8a8478"); if (tx % 2) P(sx + 4, sy - 2, 8, 5, "#6a6458"); P(sx, sy + 13, 16, 1, "rgba(0,0,0,.35)"); return; } P(sx, sy + 6, 16, 2, "#5a4028"); P(sx, sy + 10, 16, 2, "#5a4028"); P(sx + 2, sy + 4, 2, 11, "#6a4a30"); P(sx + 12, sy + 4, 2, 11, "#6a4a30"); },
    l(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 3); P(sx + 7, sy + 2, 2, 13, "#2a2a2a"); P(sx + 4, sy - 2, 8, 6, "#1a1a1a"); P(sx + 5, sy - 1, 6, 4, "#ffcf7a"); light(sx + 8, sy + 1, 26 + Math.sin(fr / 10 + tx) * 2, "255,190,100", 0.5); },
    b(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); P(sx + 1, sy + 6, 14, 3, "#6a4a30"); P(sx + 2, sy + 9, 2, 5, "#3a2a1a"); P(sx + 12, sy + 9, 2, 5, "#3a2a1a"); },
    g(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 2, sy + 2, 12, 12, "rgba(255,255,255,.18)"); for (let i = 3; i < 14; i += 3) { P(sx + i, sy + 2, 1, 12, "rgba(255,255,255,.45)"); P(sx + 2, sy + i, 12, 1, "rgba(255,255,255,.45)"); } P(sx + 1, sy + 1, 14, 2, "#e8e2d4"); },
    j(sx, sy, tx, ty, fr) { if (ZX.standCol === "empty") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#7a7468" : "#6e685c"); P(sx, sy + 7, 16, 2, "rgba(0,0,0,.3)"); P(sx, sy, 16, 1, "rgba(255,255,255,.15)"); if (rnd(tx, ty, 6) < 0.35) P(sx + 3 + (tx % 3) * 3, sy + 10, 4, 3, "#5f8a45"); if (rnd(tx, ty, 8) < 0.15) P(sx + 9, sy + 3, 2, 2, ["#e8c46a", "#d86a6a", "#e8e2d4"][tx % 3]); return; } P(sx, sy, 16, 16, "#4a4440"); P(sx, sy + 7, 16, 2, "rgba(0,0,0,.3)"); const c = ZX.standCol || ["#a8322a", "#5a5a62", "#e8e2d4"]; for (let i = 0; i < 2; i++) for (let k = 0; k < 2; k++) { const jmp = (Math.floor(fr / 12) + tx + i) % 5 === 0 ? 1 : 0; P(sx + 2 + i * 7, sy + 2 + k * 8 - jmp, 5, 5, c[(tx + i + k) % c.length]); P(sx + 3 + i * 7, sy + 1 + k * 8 - jmp, 3, 2, "#d9b38c"); } },
    n(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 4); P(sx + 7, sy + 7, 2, 8, "#3a2a1a"); P(sx + 2, sy + 1, 12, 8, "#8a7050"); P(sx + 2, sy + 1, 12, 1, "#aa9070"); P(sx + 4, sy + 4, 8, 1, "#2a1a10"); P(sx + 4, sy + 6, 6, 1, "#2a1a10"); },
    k(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); P(sx + 2, sy + 4, 2, 11, "#4a3420"); P(sx + 12, sy + 4, 2, 11, "#4a3420"); GP.save(); GP.translate(sx + 8, sy + 8); GP.rotate(fr / 80); GP.strokeStyle = "#6a4a30"; GP.lineWidth = 2; GP.beginPath(); GP.arc(0, 0, 5, 0, 7); GP.stroke(); for (let i = 0; i < 4; i++) { GP.rotate(Math.PI / 2); GP.fillStyle = "#6a4a30"; GP.fillRect(-1, -7, 2, 7); } GP.restore(); P(sx + 1, sy + 13, 14, 1, "#8a8a9a"); },
    o(sx, sy, tx, ty) { // un Colosso addormentato (2x2): qui solo il pavimento, la statua la disegna drawStatues() sopra le tessere
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      if (at(tx - 1, ty) !== "o" && at(tx, ty + 1) !== "o" && ZX.statues.length < 12) ZX.statues.push([sx + (at(tx + 1, ty) === "o" ? 16 : 8), sy + 16, tx, ty]);
    },
    p(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 6); const c = ZX.rk === "palazzo" ? "#d8d0c0" : "#7a7468"; P(sx + 3, sy - 4, 10, 18, c); P(sx + 3, sy - 4, 3, 18, "rgba(255,255,255,.2)"); P(sx + 10, sy - 4, 3, 18, "rgba(0,0,0,.2)"); P(sx + 2, sy - 6, 12, 3, c); P(sx + 2, sy + 12, 12, 3, c); },
    m(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); [[3, 9, 5, 4], [8, 6, 6, 5], [5, 11, 7, 4], [10, 11, 4, 3]].forEach(([x, y, w, h], i) => { P(sx + x, sy + y, w, h, i % 2 ? "#6a645a" : "#7a7468"); P(sx + x, sy + y, w, 1, "rgba(255,255,255,.2)"); }); },
    e(sx, sy, tx, ty, fr) { // lo strapiombo: giù, lontanissimo, la città (lato ovest) o la terra di fuori (lato est)
      const out = ZX.dropOut ? ZX.dropOut(tx, ty) : tx > 10; P(sx, sy, 16, 16, out ? "#3a5a3a" : "#2a2228");
      if (out) { if (rnd(tx, ty, 2) < 0.3) P(sx + 4, sy + 6, 3, 3, "#4a6a42"); if (rnd(tx, ty, 3) < 0.05) { P(sx + 6, sy + 4, 3, 5, "#6a645a"); P(sx + 6, sy + 3, 3, 1, "#ffcf7a"); } }
      else { if (rnd(tx, ty, 2) < 0.4) P(sx + 2, sy + 4, 6, 4, "#4a3a32"); if (rnd(tx, ty, 3) < 0.2) P(sx + 4, sy + 5, 1, 1, "#ffcf7a"); }
      P(sx, sy, 16, 16, "rgba(140,160,190,.18)");
      if (at(tx, ty - 1) !== "e" && ZX.rk !== "muro") { P(sx, sy, 16, 3, "#4a4a42"); P(sx, sy + 3, 16, 2, "rgba(0,0,0,.4)"); }
    },
    u(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 8); P(sx + 1, sy + 7, 14, 7, "#5a3a20"); P(sx + 1, sy + 7, 14, 1, "#8a6a40"); const c = ["#c9a227", "#8a3a2a", "#6a8a3a", "#d8c8a0"]; for (let i = 0; i < 3; i++) { GP.fillStyle = c[(tx + i) % 4]; GP.beginPath(); GP.arc(sx + 4 + i * 4, sy + 6, 2, 0, 7); GP.fill(); } P(sx, sy - 2, 16, 3, (tx % 2) ? "#8a3a2a" : "#d8c8a0"); },
    z(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); shadow(sx, sy, 7); if ((tx + ty) % 2) { P(sx + 3, sy + 3, 10, 12, "#5a3a20"); P(sx + 3, sy + 5, 10, 1, "#2a1a10"); P(sx + 3, sy + 11, 10, 1, "#2a1a10"); } else { P(sx + 2, sy + 4, 12, 10, "#7a5a34"); P(sx + 2, sy + 4, 12, 1, "#9a7a4a"); P(sx + 7, sy + 4, 1, 10, "rgba(0,0,0,.3)"); } },
    d(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 1, sy, 14, 16, "#4a3420"); for (let i = 0; i < 3; i++) { P(sx + 2, sy + 2 + i * 5, 12, 4, "#2a1a10"); for (let k = 0; k < 5; k++) P(sx + 3 + k * 2, sy + 2 + i * 5, 1.5, 4, ["#8a3a2a", "#c9a227", "#5a6a8a", "#d8c8a0"][(tx + i + k) % 4]); } },
    ">": (sx, sy, tx, ty) => arrowTile(">", sx, sy, tx, ty), "<": (sx, sy, tx, ty) => arrowTile("<", sx, sy, tx, ty), "^": (sx, sy, tx, ty) => arrowTile("^", sx, sy, tx, ty), v: (sx, sy, tx, ty) => arrowTile("v", sx, sy, tx, ty),
  };
  function drawStatues() { // i Colossi addormentati, seduti, enormi: sporgono sulle file di sopra
    ZX.statues.forEach(([x, y, tx, ty]) => {
      const sk = ZX.sketched && ZX.sketched(tx, ty);
      GP.fillStyle = "rgba(0,0,0,.3)"; GP.beginPath(); GP.ellipse(x, y - 2, 22, 6, 0, 0, 7); GP.fill();
      GP.fillStyle = "#7a7468"; GP.fillRect(x - 18, y - 16, 36, 14); GP.fillRect(x - 14, y - 44, 28, 30); GP.fillStyle = "#6a645a"; GP.fillRect(x - 22, y - 30, 8, 22); GP.fillRect(x + 14, y - 30, 8, 22); GP.fillStyle = "#7a7468"; GP.fillRect(x - 9, y - 60, 18, 17);
      GP.fillStyle = "rgba(0,0,0,.15)"; GP.fillRect(x + 4, y - 44, 10, 30); GP.fillStyle = "rgba(60,90,40,.7)"; GP.fillRect(x - 12, y - 42, 10, 4); GP.fillRect(x + 4, y - 58, 6, 3); GP.fillRect(x - 18, y - 6, 12, 3);
      GP.fillStyle = "#3a3630"; GP.fillRect(x - 5, y - 53, 3, 1); GP.fillRect(x + 2, y - 53, 3, 1);
      if (sk) { GP.fillStyle = "#e8e2d4"; GP.font = "bold 9px Georgia, serif"; GP.textAlign = "center"; GP.fillText("✎", x, y - 64); GP.textAlign = "left"; }
    });
    ZX.statues.length = 0;
  }
  function arrowTile(ch, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty); const b = Math.sin(frNow() / 8) * 1.5;
    GP.fillStyle = "#e8c46a"; GP.strokeStyle = "rgba(0,0,0,.5)"; GP.lineWidth = 1; GP.beginPath();
    if (ch === ">") { GP.moveTo(sx + 4 + b, sy + 4); GP.lineTo(sx + 12 + b, sy + 8); GP.lineTo(sx + 4 + b, sy + 12); } else if (ch === "<") { GP.moveTo(sx + 12 - b, sy + 4); GP.lineTo(sx + 4 - b, sy + 8); GP.lineTo(sx + 12 - b, sy + 12); } else if (ch === "v") { GP.moveTo(sx + 4, sy + 4 + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 12, sy + 4 + b); } else { GP.moveTo(sx + 4, sy + 12 - b); GP.lineTo(sx + 8, sy + 4 - b); GP.lineTo(sx + 12, sy + 12 - b); }
    GP.closePath(); GP.fill(); GP.stroke();
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
    const house = (x, y, hw, hh, o) => { o = Object.assign({ w: hw, h: hh, rr: Math.max(1, Math.floor(hh / 2)) }, o || {}); for (let yy = 0; yy < hh; yy++) for (let xx = 0; xx < hw; xx++) { put(x + xx, y + yy, "y"); if (meta[y + yy]) meta[y + yy][x + xx] = { o, rx: xx, ry: yy }; } if (o.door) { put(o.door[0], o.door[1], o.door[2] || "q"); if (meta[o.door[1]]) meta[o.door[1]][o.door[0]] = { o, rx: o.door[0] - x, ry: o.door[1] - y }; } };
    const colosso = (x, y) => lay(x, y, x + 1, y + 1, "o");
    return { lay, put, house, colosso, w, h };
  }

  // ------------------------------------------------------------------ ATMOSFERA (sopra ai personaggi, sotto all'HUD)
  let BLUR = null;
  const PART = [];
  function mood(g, fr) {
    const R = ZX.rg;
    g.save(); g.globalCompositeOperation = "lighter"; ZX.lights.forEach(([x, y, r, rgb, a]) => glow(g, x, y, r, rgb, a * 0.8)); g.restore(); ZX.lights.length = 0;
    while (PART.length < 30) PART.push({ x: Math.random() * 320, y: Math.random() * 200, s: Math.random(), p: Math.random() * 6.28 });
    if (R.fx === "rain") { g.strokeStyle = "rgba(170,190,230,.32)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 46; i++) { const x = (i * 47 + fr * 1.6) % 340 - 10, y = (i * 71 + fr * 5) % 210 - 5; g.moveTo(x, y); g.lineTo(x - 2, y + 7); } g.stroke(); }
    else PART.forEach((p) => {
      if (R.fx === "wind") { p.x += 1.4 + p.s * 1.6; p.y += Math.sin(fr / 30 + p.p) * 0.3; g.fillStyle = p.s > 0.5 ? "rgba(255,255,255,.3)" : "rgba(200,180,150,.7)"; g.fillRect(p.x, p.y, p.s > 0.5 ? 9 + p.s * 8 : 2, 1); }
      else if (R.fx === "fog") { if (p.s > 0.45) return; p.x += 0.15 + p.s * 0.2; g.fillStyle = `rgba(220,225,220,${0.03 + p.s * 0.05})`; g.beginPath(); g.ellipse(p.x, p.y, 40 + p.s * 30, 10 + p.s * 6, 0, 0, 7); g.fill(); }
      else { p.y += 0.05 + p.s * 0.05; p.x += Math.sin(fr / 80 + p.p) * 0.15; g.fillStyle = `rgba(255,220,170,${0.2 + p.s * 0.3})`; g.fillRect(p.x, p.y, 1, 1); }
      if (p.x > 340) p.x = -40; if (p.y > 205) p.y = -5;
    });
    g.save(); g.globalCompositeOperation = "soft-light"; g.fillStyle = `rgba(${R.tint},${R.tintA * 2.2})`; g.fillRect(0, 0, 320, 200); g.restore();
    safe(() => { // bordi sfocati (profondità)
      const cv = g.canvas, cw = cv.width, chh = cv.height, s = chh / 200;
      if (!BLUR || BLUR.width !== cw || BLUR.height !== chh) { BLUR = document.createElement("canvas"); BLUR.width = cw; BLUR.height = chh; BLUR.g = BLUR.getContext("2d"); }
      const b = BLUR.g; b.clearRect(0, 0, cw, chh); b.filter = `blur(${1.3 * s}px)`; b.drawImage(cv, 0, 0); b.filter = "none";
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); [[0, 12, 0.85], [12, 12, 0.45], [188, 12, 0.85], [176, 12, 0.45]].forEach(([y, h, a]) => { g.globalAlpha = a; g.drawImage(BLUR, 0, y * s, cw, h * s, 0, y * s, cw, h * s); }); g.restore();
    });
    const vg = g.createRadialGradient(160, 100, 80, 160, 100, 210); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(5,5,10,${R.dark + 0.15})`); g.fillStyle = vg; g.fillRect(0, 0, 320, 200);
    const e = fr - FX.enter;
    if (e >= 0 && e < 150 && FX.title) {
      const a = e < 20 ? e / 20 : e > 120 ? (150 - e) / 30 : 1; g.save(); g.globalAlpha = a; g.font = "bold 11px Georgia, serif"; const w = g.measureText(FX.title).width + 40, x = 160 - w / 2, y = 38;
      g.fillStyle = "rgba(15,15,20,.82)"; g.fillRect(x, y, w, 22); g.fillStyle = "#a8322a"; g.fillRect(x, y, 3, 22); g.fillRect(x + w - 3, y, 3, 22); g.fillStyle = "#e8e2d4"; g.textAlign = "center"; g.fillText(FX.title, 160, y + 15); g.textAlign = "left"; g.restore();
    }
  }
  const FX = { enter: -999, title: "" };

  // ------------------------------------------------------------------ capitoli e zone
  const CHAPTERS = {}, ZONES = {}, COS = {}, PENDING = [];
  const zoneRec = () => (api ? ZONES[api.trZone()] || null : null);
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "mu_bassa";
  const activeChapter = () => { const m = mem(); let best = null; Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).forEach((n) => { if (n <= m.ch) best = CHAPTERS[n]; }); return best || CHAPTERS[1] || null; };
  const CAST_OK = (id) => !!(api && api.CAST && api.CAST[id]);
  const goalNow = () => { const c = activeChapter(); return c && c.goal ? T(c.goal(stepOf(c.n))) : ""; };
  const chainFor = (zr) => { const m = mem(); return Object.keys(CHAPTERS).map(Number).filter((n) => n >= zr.ch && n <= m.ch).sort((a, b) => b - a).map((n) => CHAPTERS[n]); };
  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch]; castHero();
    const s = stepOf(c.n); let list = zr.spec.npcs ? zr.spec.npcs(s) : [];
    chainFor(zr).slice().reverse().forEach((cc) => { const p = cc.n !== zr.ch && cc.patch && cc.patch[api.trZone()]; if (p && p.npcs) list = p.npcs(stepOf(cc.n), list); });
    zr.Z.npcs = list.filter((n) => CAST_OK(n.id));
    const hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(s) : zr.spec.hints || {}), gl = goalNow();
    [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => { if (k) hints[k] = (gl ? "Obiettivo: " + gl + " · " : "") + (zr.spec.stealth ? "Nell'erba alta i Colossi non ti vedono. " : "") + (hints[k] || ""); });
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
    FX.enter = frNow(); FX.title = zr.spec.short; STL.alarm = 0; STL.cool = 60;
    api.trGo(zid); refreshZone();
    if (!m.intro[zid]) { m.intro[zid] = 1; save(); if (zr.spec.intro && zr.spec.intro.length) return say(zr.spec.intro, done); }
  }

  // ------------------------------------------------------------------ bauli, bracieri, taccuino
  const chestKey = (zid, tx, ty) => `x_${zid}_${tx}_${ty}`;
  function openChest(zid, tx, ty, def) {
    const k = chestKey(zid, tx, ty);
    if (F.is(k)) return say([["voce", "Il baule è vuoto. Dentro c'è solo l'odore di chi l'ha chiuso, tanto tempo fa."]]);
    F.set(k, true); SFX.chest();
    const msg = def && def.cos ? reward("chest:" + k, { cos: def.cos }) : [];
    if (def && def.coins) { const n = coinsGive(def.coins); if (n) msg.unshift(`+${n} monete`); }
    if (def && def.lore) learnLore(def.lore, true);
    say([["voce", `Apri il baule. ${def && def.text ? def.text + " " : ""}${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}${def && def.lore && LORE[def.lore] ? ` · Nel Taccuino: «${LORE[def.lore].t}».` : ""}`]]);
  }
  function learnLore(id, quiet) { const m = mem(); if (!LORE[id] || m.lore.includes(id)) return false; m.lore.push(id); save(); if (!quiet) SFX.sketch(); return true; }
  const sketchKey = (zid, tx, ty) => `sk_${zid}_${tx}_${ty}`;
  function sketch(zid, tx, ty, def) {
    const k = sketchKey(zid, tx, ty);
    if (F.is(k)) return say([["voce", "L'hai già disegnato. Nel Taccuino, il suo profilo ti guarda dalla pagina con gli occhi chiusi."]]);
    F.set(k, true); SFX.sketch(); F.add("sketches", 1);
    if (def && def.lore) learnLore(def.lore, true);
    say([["voce", `Ti siedi ai piedi del Colosso addormentato e lo disegni nel Taccuino, a carboncino. ${def && def.text ? def.text : ""}${def && def.lore && LORE[def.lore] ? ` · Nel Taccuino: «${LORE[def.lore].t}».` : ""} <b>Colossi disegnati: ${F.get("sketches", 0)}</b>`]]);
  }
  function brazier(back) {
    SFX.fire(); refreshZone();
    ask("voce", "Ti scaldi le mani al braciere. Il fuoco scoppietta. (Il gioco salva da solo: qui puoi rileggere il Taccuino.)", [
      { label: "Il Taccuino della Guardia", cls: "hot", fn: () => taccuino(() => brazier(back), true) },
      { label: "Riprendi il cammino", fn: back || done },
    ]);
  }

  // ------------------------------------------------------------------ RICOGNIZIONE FURTIVA
  // spec.colossi: [{ path: [[tx,ty],...], speed (tessere al secondo), num, sight (tessere), fov (gradi) }]
  const STL = { alarm: 0, cool: 0, hidden: false, near: false, cs: {} };
  function colState(zid, spec) {
    const k = zid; if (!STL.cs[k]) STL.cs[k] = (spec.colossi || []).map((c) => ({ c, seg: 0, t: 0, x: c.path[0][0] * TS + 8, y: c.path[0][1] * TS + 12, dir: 0, alert: 0 }));
    return STL.cs[k];
  }
  function colUpdate(cs, dt) {
    cs.forEach((s) => {
      const p = s.c.path, a = p[s.seg], b = p[(s.seg + 1) % p.length], ax = a[0] * TS + 8, ay = a[1] * TS + 12, bx = b[0] * TS + 8, by = b[1] * TS + 12, len = Math.hypot(bx - ax, by - ay) || 1;
      s.t += (s.c.speed || 0.9) * TS * dt / len; if (s.t >= 1) { s.t = 0; s.seg = (s.seg + 1) % p.length; }
      s.x = ax + (bx - ax) * s.t; s.y = ay + (by - ay) * s.t; const want = Math.atan2(by - ay, bx - ax); let d = want - s.dir; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; s.dir += d * Math.min(1, dt * 3);
    });
  }
  function sees(s, px, py, hidden) {
    const dx = px - s.x, dy = py - (s.y - 6), d = Math.hypot(dx, dy), sight = (s.c.sight || 5) * TS, fov = ((s.c.fov || 70) / 2) * Math.PI / 180;
    if (d < 18) return true; // sotto i piedi ti vede sempre
    if (hidden || d > sight) return false;
    let a = Math.atan2(dy, dx) - s.dir; while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2;
    return Math.abs(a) < fov;
  }
  function stealthTick(zid, spec, px, py, dt) {
    const cs = colState(zid, spec); colUpdate(cs, dt);
    const tx = Math.floor(px / TS), ty = Math.floor((py - 4) / TS); STL.hidden = undAt(tx, ty) === ";" && at(tx, ty) === ";";
    if (STL.cool > 0) { STL.cool--; return null; }
    let seen = null; cs.forEach((s) => { const v = sees(s, px, py, STL.hidden); s.alert = v ? Math.min(1, s.alert + dt * 2.2) : Math.max(0, s.alert - dt * 1.5); if (v) seen = s; });
    const top = Math.max(0, ...cs.map((s) => s.alert)); if (top > 0.05 && STL.alarm < 0.05) SFX.warn(); STL.alarm = top;
    STL.near = cs.some((s) => Math.hypot(px - s.x, py - s.y) < 6 * TS);
    if (top >= 1) { // preso: la mano scende, e ti ritrovi all'ingresso
      STL.cool = 90; STL.alarm = 0; cs.forEach((s) => { s.alert = 0; }); mem().caught++; save(); SFX.caught(); F.add("c_presi_" + zid, 1);
      const st = spec.start; setTimeout(() => safe(() => say([["voce", pick(["Un'ombra enorme. Il Colosso si ferma, gira la testa, e abbassa una mano grande come una casa. Non ti schiaccia: ti solleva, piano, e ti riporta indietro, oltre l'erba, all'ingresso. Come si fa con un gattino che è scappato.", "Due occhi color brace ti trovano. La terra trema. Una mano di pietra ti chiude il passo e ti spinge indietro, delicatamente, fino al punto da cui sei partito. Il Colosso resta a guardarti. Poi riprende il suo giro.", "Ti ha visto. Il Colosso si china, ti osserva da vicinissimo (puzza di muschio e di pioggia vecchia), poi ti posa all'ingresso con due dita. Come per dire: non ancora."])]], done), null), 30);
      return [st[0] * TS + 8, st[1] * TS + 12];
    }
    return null;
  }
  function drawColossi(g, zid, spec, cx, cy, fr) {
    const cs = colState(zid, spec);
    // coni di sguardo (prima), poi i corpi ordinati dall'alto in basso
    cs.forEach((s) => {
      const x = s.x - cx, y = s.y - 6 - cy, sight = (s.c.sight || 5) * TS, fov = ((s.c.fov || 70) / 2) * Math.PI / 180;
      const gr = g.createRadialGradient(x, y, 4, x, y, sight); const col = s.alert > 0.05 ? "255,80,50" : "255,220,140"; gr.addColorStop(0, `rgba(${col},${0.28 + s.alert * 0.3})`); gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr; g.beginPath(); g.moveTo(x, y); g.arc(x, y, sight, s.dir - fov, s.dir + fov); g.closePath(); g.fill();
    });
    cs.slice().sort((a, b) => a.y - b.y).forEach((s, i) => {
      const x = s.x - cx, y = s.y - cy; if (x < -60 || x > 380 || y < -20 || y > 300) return;
      colossus(g, x, y, s.dir, fr, { s: 0.9, ph: i, num: s.c.num, alert: s.alert > 0.3 });
      if (s.alert > 0.05) { g.fillStyle = "#ff5a3a"; g.font = "bold 14px Georgia, serif"; g.textAlign = "center"; g.fillText(s.alert > 0.6 ? "!!" : "?", x, y - 80); g.textAlign = "left"; }
      if (fr % 52 === 0 && Math.abs(x - 160) < 200) SFX.step();
    });
  }
  function stealthHud(g) {
    g.fillStyle = "rgba(10,12,18,.8)"; g.fillRect(4, 186, 112, 12); g.font = "bold 8px sans-serif";
    g.fillStyle = STL.hidden ? "#7ae0a0" : STL.alarm > 0.05 ? "#ff8a6a" : "#e8e2d4"; g.fillText(STL.hidden ? "🌾 Nascosto nell'erba alta" : STL.alarm > 0.05 ? "⚠ Ti stanno guardando…" : "👁 Allo scoperto", 8, 195);
    if (STL.alarm > 0) { g.fillStyle = "#3a1a14"; g.fillRect(120, 188, 60, 8); g.fillStyle = "#ff5a3a"; g.fillRect(120, 188, 60 * STL.alarm, 8); }
  }

  function registerZone(chN, zid, spec) {
    const rk = spec.region || "bassa";
    const syncZX = () => { ZX.id = zid; ZX.rk = rk; ZX.rg = REG[rk]; ZX.standCol = spec.stands; ZX.chestOpen = (tx, ty) => F.is(chestKey(zid, tx, ty)); ZX.sketched = (tx, ty) => F.is(sketchKey(zid, tx, ty)) || F.is(sketchKey(zid, tx + 1, ty)) || F.is(sketchKey(zid, tx, ty - 1)) || F.is(sketchKey(zid, tx + 1, ty - 1)); ZX.gateOpen = spec.gateOpen ? () => !!safe(() => spec.gateOpen(stepOf(chN)), false) : null; ZX.dropOut = spec.dropOut || null; };
    const Z = {
      name: spec.name, short: spec.short, sub: spec.sub || "", need: 0, w: spec.w, h: spec.h, start: spec.start, theme: "torino", isCustomSaga: true,
      bus: "uscita", busLabel: "Esci dalla saga",
      item: spec.item || ["Piuma di corvo", "Piume"], itemCos: spec.itemCos, items: spec.items || [], bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: spec.pitch || [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({ s: "Scaldati al braciere", x: "Apri il baule", o: "Disegna il Colosso addormentato", d: "Guarda gli scaffali" }, spec.act || {}), intro: [],
      me: () => { const c = api.CAST.hero || api.CAST.leo; return Object.assign({}, c); },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d"), f = frNow();
        g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, y, 9, "220,220,255", 0.35 + 0.15 * Math.sin(f / 10 + i)); g.restore();
        g.save(); g.translate(x, y); g.rotate(-0.6 + Math.sin(f / 20 + i) * 0.2); g.fillStyle = "#1a1a24"; g.beginPath(); g.ellipse(0, 0, 2.5, 6.5, 0, 0, 7); g.fill(); g.fillStyle = "#5a5a7a"; g.fillRect(-0.5, -6, 1, 12); g.restore();
      },
    };
    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: il Taccuino ed Esci." });
    Z.build = function (m) {
      ZX.map = m; syncZX(); GP = document.getElementById("cv").getContext("2d");
      const Ls = makeLayers(spec.w, spec.h, spec.base || ","); Ls.lay(0, 0, spec.w - 1, spec.h - 1, spec.base || ",");
      spec.build(Ls);
      chainFor(ZONES[zid]).slice().reverse().forEach((cc) => { const p = cc.n !== chN && cc.patch && cc.patch[zid]; if (p && p.build) p.build(Ls); });
      refreshSoon();
    };
    Z.tile = function (ch, sx, sy, tx, ty) { GP = GP || document.getElementById("cv").getContext("2d"); if (ZX.id !== zid) syncZX(); return drawTile(ch, sx, sy, tx, ty); };
    const dd = (cx, cy) => ({ X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow() });
    const stealthOn = () => spec.stealth && (!spec.stealthWhen || safe(() => spec.stealthWhen(stepOf(chN)), true));
    if (spec.stealth) Z.tick = function (px, py, dt) { if (!stealthOn() || api.trZone() !== zid) return null; return stealthTick(zid, spec, px, py, Math.min(0.05, dt || 0.016)); };
    Z.decor = function (cx, cy) { safe(drawStatues); if (spec.decor) safe(() => spec.decor(GP, cx, cy, dd(cx, cy))); };
    Z.top = function (cx, cy) { if (spec.top) safe(() => spec.top(GP, cx, cy, dd(cx, cy))); if (stealthOn()) safe(() => drawColossi(GP, zid, spec, cx, cy, frNow())); safe(() => mood(GP, frNow())); if (stealthOn()) safe(() => stealthHud(GP)); };
    Z.onObj = function (ch, tx, ty) {
      let f = null;
      chainFor(ZONES[zid]).some((c) => { f = c.obj && (c.obj[zid + ":" + ch + ":" + tx + "," + ty] || c.obj[zid + ":" + ch]); return !!f; });
      if (f) { f({ ch, tx, ty, zid }); return true; }
      if (ch === "s") { brazier(done); return true; }
      if (ch === "x") { const def = spec.chests && spec.chests[tx + "," + ty]; openChest(zid, tx, ty, def || { coins: 10 }); return true; }
      if (ch === "o") { // il gruppo 2x2: si usa la tessera in basso a sinistra come chiave
        let bx = tx, by = ty; if (at(bx - 1, by) === "o") bx--; if (at(bx, by + 1) === "o") by++;
        sketch(zid, bx, by, spec.sketches && spec.sketches[bx + "," + by]); return true;
      }
      const flav = spec.flavor && (spec.flavor[tx + "," + ty] || spec.flavor[ch]);
      if (flav) { say([["voce", Array.isArray(flav) ? pick(flav) : flav]], done); return true; }
      if (Z.act[tx + "," + ty] || Z.act[ch]) { say([["voce", "Niente di speciale. Solo pietra, e vento."]], done); return true; }
      return false;
    };
    Z.menu = () => zoneMenu();
    api.TRZ[zid] = Z;
    ZONES[zid] = { ch: chN, spec, Z };
  }

  // ------------------------------------------------------------------ partite
  let inMatch = false;
  function wallMatch(o) {
    const M = window.__muroPartita; castHero();
    if (!M || !M.start) return say([["voce", "La Partita sul Muro non si è caricata. Ricarica la pagina e riprova."]]);
    const h = hero() || {}, C = api.CAST, mt = C[o.mate] || {};
    api.scene(o.bg || bgNow(), "voce", "La partita è cominciata.", [{ label: "◂ Torna a camminare", fn: done }], o.title || "Partita sul Muro");
    inMatch = true;
    M.start({ title: T(o.title), us: o.us || "Guardia del Muro", hero: { name: h.name || "Campione", skin: h.skin, hair: h.hair, shirt: "#a8322a" }, mate: { name: mt.name || "Compagno", skin: mt.skin, hair: mt.hair, shirt: o.mateShirt || "#2c5f8a" },
      opp: o.opp, hands: o.hands, friendly: o.friendly, wind: o.wind, night: o.night, hard: o.hard, half: o.half || 40, halftime: T(o.halftime || ""), handRate: o.handRate,
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

  // ------------------------------------------------------------------ menu e Taccuino
  function leave() { const back = EXIT || window.title; EXIT = null; api.trExitTo(typeof back === "function" ? back : null); }
  function zoneMenu() {
    const c = activeChapter(), m = mem();
    api.trAsk("voce", `<b>Il Muro</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Monete ${bal()} · Taccuino ${m.lore.length} · Colossi disegnati ${F.get("sketches", 0)}</span>`, [
      { label: "Il Taccuino della Guardia", sub: "Persone, Colossi disegnati, documenti, finali", cls: "hot", fn: () => taccuino(zoneMenu, true) },
      { label: "Esci da Il Muro", sub: "Progressi e posizione restano salvati", cls: "hot", fn: leave },
    ], bgNow());
  }
  const ENDINGS = {
    aperto: ["IL MURO SI APRE", "Il Grande Portone si spalanca. Chi era fuori torna a casa."],
    chiuso: ["IL MURO RESTA", "Il Portone resta chiuso. Cintavecchia è salva. E sola."],
    via: ["OLTRE L'ORIZZONTE", "Parti con i Fuorimura, a cercare il resto del mondo."],
    tribuna: ["IL MURO È UNA TRIBUNA", "Il finale segreto. La città sopra, i Colossi intorno: tutti a guardare la stessa partita."],
  };
  const BOND_TXT = (v) => (v >= 5 ? "fortissimo" : v >= 3 ? "forte" : v >= 1 ? "c'è" : "nessuno");
  function taccuino(back, inZone) {
    const m = mem(), h0 = hero() || { name: "Campione", num: 9 };
    const lore = Object.keys(LORE).map((k) => (m.lore.includes(k) ? `• <b>${esc(LORE[k].t)}</b><br><span style="color:var(--dim)">${esc(T(LORE[k].d))}</span>` : "<span style='color:var(--dim)'>• ???</span>")).join("<br>");
    const ends = Object.keys(ENDINGS).map((k) => (m.ends.includes(k) ? `✓ <b>${esc(ENDINGS[k][0])}</b> <span style="color:var(--dim)">${esc(ENDINGS[k][1])}</span>` : "<span style='color:var(--dim)'>• ???</span>")).join("<br>");
    const html = `<b>${esc(h0.name)}</b> · Guardia del Muro · n. ${esc(h0.num)}<br>Legame con la Guardia: ${BOND_TXT(m.guardia)} · con il Consiglio: ${BOND_TXT(m.consiglio)} · con i Fuorimura: ${BOND_TXT(m.fuori)}<br>Colossi disegnati: ${F.get("sketches", 0)} · Volte in cui ti hanno visto: ${m.caught}<br><br><b>Pagine del Taccuino</b> (${m.lore.length}/${Object.keys(LORE).length})<br>${lore || "<span style='color:var(--dim)'>Niente, per ora.</span>"}<br><br><b>Finali</b><br>${ends}`;
    if (inZone) return api.trAsk("voce", html, [{ label: "◂ Indietro", fn: back }], bgNow());
    api.scene("mu_bassa", "voce", html, [{ label: "◂ Indietro", fn: back }], "Il Taccuino della Guardia");
  }
  function finishChapter(n, ending) { const m = mem(); m.done[n] = String(ending || "ok").slice(0, 24); if (m.ch <= n) m.ch = n + 1; save(); }

  const XTOOLS = {
    get api() { return api; }, TS, T, esc, hash, rnd, pick, safe, F, mem, save, stepOf, setStep, note, once, reward, coinsGive, bal, hero, castHero,
    say, ask, done, go, enterZone, playMatch, wallMatch, finishChapter, setTiles, SFX, glow, frNow, refreshZone, bgNow, taccuino, leave, lines, bond, learnLore, ENDINGS, ZX, light, colossus, STL,
    scene: (ls, then, bg) => api.play(lines(ls, bg || "mu_bassa"), then),
    lore: (id, d) => { LORE[id] = d; },
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
    if (!h) return api.scene("mu_bassa", "voce", "<b>Il Muro</b><br>La Guardia del Muro cerca reclute. Prima crea il tuo Campione.", [
      { label: "Crea il tuo Campione", sub: "Nome, numero e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Il Muro");
    castHero();
    const c = activeChapter(), m = mem(), cur = c && m.done[c.n], nextOk = !!CHAPTERS[(c ? c.n : 0) + 1];
    const status = m.done[3] ? `Storia conclusa. Finali trovati: ${m.ends.length} su ${Object.keys(ENDINGS).length}.` : cur ? (nextOk ? "Il prossimo capitolo ti aspetta." : "Capitolo concluso · il prossimo è in arrivo.") : goalNow();
    api.scene("mu_bassa", "voce", `<b>🧱 Il Muro</b><br>${esc(h.name)} · ${F.is("guardia_mantello") ? "Guardia del Muro" : "recluta"}<br><span style="color:var(--dim)">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}<br>${esc(status)}</span>`, [
      { label: c && !m.intro["ch" + c.n] ? (c.n > 1 ? `Inizia il Capitolo ${c.n}` : "Inizia la storia") : "Continua la storia", sub: c ? `Capitolo ${c.n} · ${c.title}` : "", cls: "hot", fn: continueStory },
      { label: "Il Taccuino della Guardia", sub: "Colossi disegnati, documenti, finali", fn: () => taccuino(openMain, false) },
      { label: "Capitoli", sub: "Rigioca i capitoli già sbloccati", fn: chapters },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Il Muro");
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
    api.scene("mu_bassa", "voce", "<b>Capitoli</b><br>Tre capitoli, un muro. Le scelte restano: cambiano il finale.", opts, "Il Muro · Capitoli");
  }
  function resetAsk() {
    api.scene("mu_bassa", "voce", "<b>Ricominciare?</b><br>Si cancellano scelte, Taccuino e finali de Il Muro. Monete e cosmetici restano tuoi.", [
      { label: "Sì, ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
      { label: "◂ No", fn: chapters },
    ], "Il Muro");
  }
  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    if (!m.intro["ch" + c.n]) {
      m.intro["ch" + c.n] = 1; save();
      return api.play(lines(c.intro(), c.introBg || "mu_bassa"), () => { const z = ZONES[c.start]; go(c.start, z.spec.start[0], z.spec.start[1]); });
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
    if (document.getElementById("muExit")) return;
    const st = document.createElement("style");
    st.textContent = "#muExit{position:fixed;left:8px;bottom:8px;z-index:60;display:none;min-height:36px;padding:6px 12px;border-radius:6px;border:2px solid #8a8070;background:#2a2c34ee;color:#e8e2d4;font:700 13px/1.1 Georgia,serif;box-shadow:0 2px 8px #0008}#muExit.on{display:block}body.muMM #stats{margin-bottom:54px}";
    document.head.appendChild(st);
    const b = document.createElement("button"); b.id = "muExit"; b.type = "button"; b.textContent = "✕ Esci"; b.setAttribute("aria-label", "Esci da Il Muro");
    b.onclick = () => { if (inMatch) { const hb = document.getElementById("homeBtn"); if (hb) hb.click(); return; } if (zoneRec()) leave(); };
    document.body.appendChild(b);
    const oc = document.getElementById("ovlCh");
    if (oc) oc.addEventListener("click", (e) => { if (inMatch && e.target && e.target.closest && e.target.closest("button.danger")) { inMatch = false; setTimeout(() => safe(() => api.trExitTo(function () {})), 0); } });
    setInterval(() => {
      const hud = document.getElementById("matchHud"), live = !!(hud && !hud.hidden), zr = zoneRec(), own = !!document.getElementById("muPM");
      const on = !own && !!((zr && document.body.classList.contains("borgo")) || (inMatch && live));
      b.classList.toggle("on", on); document.body.classList.toggle("muMM", !!(inMatch && live)); b.textContent = inMatch && live ? "✕ Esci dalla partita" : "✕ Esci";
    }, 400);
  }
  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match || !a.matchPick) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a; start();
  }
  window.__muro = {
    version: 1, KEY, addChapter, open: openMain, SFX, _has: (n) => !!CHAPTERS[n],
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return { label: "🧱 Il Muro", cls: "hot", fn: () => openMain({ onExit: back }), sub: h ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "saga"} · Colossi, ricognizioni, partite sul muro` : "Crea prima il tuo campione · i Colossi aspettano" };
    },
    info() { const m = mem(); return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), ends: m.ends.slice(), flags: Object.assign({}, m.flags), lore: m.lore.slice(), guardia: m.guardia, consiglio: m.consiglio, fuori: m.fuori, trust: m.trust, caught: m.caught }; },
    _dbg: /[?&]debug\b/.test(location.search || "") ? { mem, ZONES, CHAPTERS, ZX, go, F, LORE, STL } : undefined,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
