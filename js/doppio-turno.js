// js/doppio-turno.js - DOPPIO TURNO · motore della saga
// Saga psicologica e misteriosa per il Campione creato dall'utente (heroLoad()). Ispirata a Scissione (Severance), Mr. Robot, Paprika.
// Il Campione firma con il Valtorre FC e accetta la «Procedura Duale»: nel Complesso è il DENTRO e non ricorda la città;
// in città è il FUORI e non ricorda il Complesso. Le due metà si parlano solo con i BIGLIETTI lasciati nell'Armadietto 7.
// Meccaniche:
//  - FATTI separati per metà: quello che scopre il Dentro il Fuori non lo sa (e viceversa), finché non arriva un biglietto.
//  - BIGLIETTI: si scrivono all'armadietto scegliendo un fatto; l'altra metà li legge e decide se crederci.
//    Non tutti i biglietti sono tuoi: inchiostro (Dentro = penna blu aziendale, Fuori = pennarello verde) e firma (il tuo numero) li tradiscono.
//  - INDICE DI CONFORMITÀ: sale quando obbedisci al club e alla Voce, scende quando disobbedisci.
// Zone sul motore TRZ di game.js (window.__borgoApi), sfondi dt_* in js/bg-scenarios.js. Ricompense: solo monete e cosmetici.
// Salvataggio proprio: ali-di-rondine.doppio-turno.
(function () {
  "use strict";
  if (window.__doppioTurnoLoaded) return;
  window.__doppioTurnoLoaded = true;
  const KEY = "ali-di-rondine.doppio-turno", TS = 16;
  let tries = 0, api = null, EXIT = null;

  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  const arr = (a) => (Array.isArray(a) ? a : []);
  const clampI = (v, a, b, d) => { v = Math.round(+v); return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; return h >>> 0; };
  const rnd = (tx, ty, k) => hash(tx * 73 + ty * 131 + (k || 0) * 17) / 4294967296;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const frNow = () => Math.floor(performance.now() / 16);

  // ------------------------------------------------------------------ audio
  let actx = null;
  function ac() { if (!actx && (window.AudioContext || window.webkitAudioContext)) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (actx && actx.state === "suspended") safe(() => actx.resume()); return actx; }
  function tone(f, d, type, vol, when, slide) { const c = ac(); if (!c) return; safe(() => { const t = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02); }); }
  const SFX = {
    ding: () => { tone(880, 0.5, "sine", 0.08); tone(1320, 0.6, "sine", 0.05, 0.12); }, // ascensore
    hum: () => { tone(60, 0.8, "sawtooth", 0.03); tone(120, 0.8, "sine", 0.03); }, // neon
    note: () => { tone(660, 0.08, "triangle", 0.06); tone(990, 0.12, "triangle", 0.05, 0.08); },
    fact: () => [523, 659, 784].forEach((f, i) => tone(f, 0.2, "triangle", 0.07, i * 0.07)),
    fake: () => { tone(220, 0.3, "square", 0.05, 0, 110); tone(330, 0.3, "square", 0.04, 0.1, 160); },
    swap: () => { tone(200, 0.6, "sine", 0.08, 0, 800); tone(800, 0.6, "sine", 0.05, 0.3, 200); },
  };

  // ------------------------------------------------------------------ salvataggio
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  const FACTS = {}, NOTES = {};
  function norm(o) {
    o = obj(o);
    const m = { v: 1, ch: clampI(o.ch, 1, 9, 1), step: {}, flags: {}, rew: {}, done: {}, zone: "", facts: { d: [], f: [] }, notes: {}, log: [], intro: {}, ends: [], wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0), conf: clampI(o.conf, 0, 100, 50) };
    const st = obj(o.step); Object.keys(st).slice(0, 20).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n) m.step[n] = clampI(st[k], 0, 99, 0); });
    const fl = obj(o.flags); let c = 0;
    Object.keys(fl).forEach((k) => { if (c >= 300 || !FLAG_RE.test(k)) return; const v = fl[k]; if (typeof v === "boolean" || (typeof v === "number" && Number.isFinite(v)) || (typeof v === "string" && v.length <= 24)) { m.flags[k] = v; c++; } });
    Object.keys(obj(o.rew)).forEach((k) => { if (REW_RE.test(k) && Object.keys(m.rew).length < 200) m.rew[k] = 1; });
    const dn = obj(o.done); Object.keys(dn).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n && typeof dn[k] === "string" && dn[k].length <= 24) m.done[n] = dn[k]; });
    m.zone = typeof o.zone === "string" && ZONE_RE.test(o.zone) ? o.zone : "";
    const fa = obj(o.facts); ["d", "f"].forEach((h) => { m.facts[h] = [...new Set(arr(fa[h]).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 60); });
    // biglietti: { id: { to: "d"|"f", st: "new"|"vero"|"falso" } } (testo e verità vivono nel codice, non nel salvataggio)
    Object.keys(obj(o.notes)).slice(0, 80).forEach((k) => { const n = obj(o.notes[k]); if (FLAG_RE.test(k) && (n.to === "d" || n.to === "f")) m.notes[k] = { to: n.to, st: ["new", "vero", "falso"].includes(n.st) ? n.st : "new", fact: typeof n.fact === "string" && FLAG_RE.test(n.fact) ? n.fact : undefined, mine: !!n.mine }; });
    m.log = arr(o.log).filter((x) => typeof x === "string").map((x) => x.slice(0, 220)).slice(-80);
    Object.keys(obj(o.intro)).forEach((k) => { if (FLAG_RE.test(k)) m.intro[k] = 1; });
    m.ends = [...new Set(arr(o.ends).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 12);
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

  // ------------------------------------------------------------------ il Campione e le sue due metà
  const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
  const half = () => { const zr = zoneRec(); return zr ? zr.spec.half : F.get("half", "d"); };
  const other = (h) => (h === "d" ? "f" : "d");
  const HALF_NAME = { d: "il Dentro", f: "il Fuori" };
  const INK = { d: "penna blu aziendale", f: "pennarello verde" };
  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "il tuo tiro" };
    return String(s).replace(/\{n\}/g, () => h.name).replace(/\{num\}/g, () => h.num).replace(/\{tiro\}/g, () => h.shotName || "il tuo tiro");
  }
  function castHero(hh) {
    const h = hero(), C = api && api.CAST; if (!h || !C) return;
    const inside = (hh || half()) === "d";
    C.hero = { name: h.name, tag: "", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye || "#2a1a0a", bg: inside ? ["#dfe9e7", "#2a9d8f"] : [h.shirt || "#3b3a4a", "#ffb347"], shirt: inside ? "#9aa5b1" : h.shirt, num: String(h.num), acc: h.acc, cap: !inside && h.acc === "cappellino" ? "#ffd23f" : undefined };
  }
  const coinsGive = (n) => (n > 0 && typeof window.addCoins === "function" ? safe(() => { window.addCoins(n); return n; }, 0) : 0);
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);
  const knows = (id, h) => mem().facts[h || half()].includes(id);
  function learnFact(id, h, quiet) {
    h = h || half(); const m = mem(); if (!FACTS[id] || m.facts[h].includes(id)) return false;
    m.facts[h].push(id); save(); SFX.fact(); if (!quiet) safe(() => api.trToast(`📁 ${HALF_NAME[h]} sa: ${FACTS[id].t}`)); return true;
  }
  function conf(d) { const m = mem(); m.conf = Math.max(0, Math.min(100, m.conf + d)); save(); return m.conf; }

  // ------------------------------------------------------------------ STILI: il Dentro (uffici bianchi e verde acqua) e il Fuori (porto di sera)
  const STY = {
    den: { carpet: ["#3f7f5f", "#467f62", "#3a7658"], tile: ["#eef2f1", "#e2e9e7"], lino: ["#cfe3df", "#2a9d8f"], wall: "#f4f6f5", wall2: "#2a9d8f", ink: "#2b3a3a", pitch: ["#d9efe6", "#cfe8de"], line: "#ffffff" },
    fuo: { cob: ["#5a4b52", "#62525a", "#53454c"], plank: ["#8a5a3a", "#7a4e32"], walk: ["#6e6268", "#655960"], wall: "#7a3b2e", wall2: "#5a2b22", ink: "#1a1018", sea: ["#1b2a4a", "#22345a"], pitch: ["#4a4f5a", "#525866"], line: "#f2e6c8" },
  };
  const FLOORS = ',:+-"=';
  // Solidi: a muro · d scrivania con terminale · k divisorio · x schedario/casse · p pianta · K armadietto 7 · e ascensore · q porta · Q porta con codice
  //         n manifesto · b panchina · g porta da calcio · j tribuna · w acqua (mare / distributore) · f ringhiera · l lampione · u tavolino · y casa · c barca
  //         C giostra · i reti da pesca · P tabellone · Y scrivania della direttrice · Z colonna · F fontana · V macchina del caffè
  const SOLID = "adkxpKeqQnbgjwfluycCiPYZFVI";
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);
  const ZX = { map: null, under: null, meta: null, id: "", st: STY.den, stk: "den" };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "a";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  const D = () => ZX.stk === "den";

  function floorPaint(f, sx, sy, tx, ty) {
    const st = ZX.st, r = rnd(tx, ty, 1);
    if (D()) {
      if (f === ",") { P(sx, sy, 16, 16, st.carpet[(hash(tx * 3 + ty * 7) % 3)]); for (let i = 0; i < 4; i++) P(sx + ((tx * 5 + i * 4) % 15), sy + ((ty * 3 + i * 5) % 15), 1, 1, "rgba(255,255,255,.08)"); if (r < 0.06) P(sx + 6, sy + 6, 3, 2, "rgba(0,0,0,.12)"); }
      else if (f === "+") { P(sx, sy, 16, 16, (tx + ty) % 2 ? st.tile[0] : st.tile[1]); P(sx, sy + 15, 16, 1, "rgba(43,58,58,.12)"); P(sx + 15, sy, 1, 16, "rgba(43,58,58,.12)"); }
      else if (f === ":") { P(sx, sy, 16, 16, st.lino[0]); P(sx, sy + 7, 16, 2, "rgba(42,157,143,.35)"); if (r < 0.1) P(sx + 3, sy + 3, 2, 1, "rgba(255,255,255,.6)"); }
      else if (f === "-") { P(sx, sy, 16, 16, tx % 2 ? st.pitch[0] : st.pitch[1]); P(sx, sy, 16, 1, "rgba(42,157,143,.12)"); P(sx, sy, 1, 16, "rgba(42,157,143,.12)"); }
      else if (f === '"') { P(sx, sy, 16, 16, "#c9d6e3"); if ((tx + ty) % 2) P(sx + 4, sy + 4, 8, 8, "#bccada"); }
      else if (f === "=") { P(sx, sy, 16, 16, "#dfe6e4"); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 2, 16, 1, "rgba(43,58,58,.18)"); }
      else P(sx, sy, 16, 16, st.tile[0]);
      return;
    }
    if (f === ",") { P(sx, sy, 16, 16, st.cob[(hash(tx * 3 + ty * 7) % 3)]); for (let i = 0; i < 4; i++) { const ox = (i % 2) * 8 + ((ty % 2) * 4), oy = Math.floor(i / 2) * 8; P(sx + ox, sy + oy, 7, 7, "rgba(255,255,255,.05)"); P(sx + ox, sy + oy + 6, 7, 1, "rgba(0,0,0,.25)"); } }
    else if (f === ":") { P(sx, sy, 16, 16, st.plank[(tx + ty) % 2]); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "rgba(0,0,0,.3)"); if (r < 0.2) P(sx + 5, sy + 1, 1, 1, "#2a1a10"); }
    else if (f === "+") { P(sx, sy, 16, 16, st.walk[(tx + ty) % 2]); P(sx, sy + 15, 16, 1, "rgba(0,0,0,.25)"); P(sx + 15, sy, 1, 16, "rgba(0,0,0,.2)"); }
    else if (f === "-" && ZX.grass) { P(sx, sy, 16, 16, tx % 2 ? "#2f5a32" : "#35623a"); for (let i = 0; i < 4; i++) P(sx + ((tx * 5 + i * 4) % 15), sy + ((ty * 7 + i * 5) % 12), 1, 4, "rgba(150,200,110,.5)"); if (r < 0.08) P(sx + 6, sy + 6, 3, 3, "rgba(220,220,180,.35)"); }
    else if (f === "-") { P(sx, sy, 16, 16, tx % 2 ? st.pitch[0] : st.pitch[1]); if (r < 0.1) P(sx + 4, sy + 9, 4, 1, "rgba(255,255,255,.08)"); }
    else if (f === '"') { P(sx, sy, 16, 16, "#6a2f3a"); P(sx, sy + 2, 16, 1, "rgba(255,200,120,.25)"); }
    else if (f === "=") { P(sx, sy, 16, 16, "#3a3236"); P(sx, sy + 7, 16, 2, "#c9b48a"); }
    else P(sx, sy, 16, 16, st.cob[0]);
    // riflessi delle lucine sul selciato bagnato
    if ((f === "," || f === "+") && rnd(tx, ty, 9) < 0.12) P(sx + 3 + r * 8, sy + 9, 3, 1, "rgba(255,200,120,.35)");
  }
  function houseTile(sx, sy, tx, ty) {
    const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx], st = ZX.st;
    if (!m) { P(sx, sy, 16, 16, st.wall); return; }
    const o = m.o, roof = o.roof || (D() ? "#c9d6d3" : "#3a2a2e"), wall = o.wall || st.wall;
    if (m.ry === 0) { P(sx, sy, 16, 16, roof); P(sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); if (!D()) { for (let i = 0; i < 16; i += 4) P(sx + i, sy + 2, 2, 10, "rgba(255,255,255,.06)"); if (o.lights && m.rx % 2 === 0) { P(sx + 7, sy + 14, 2, 2, ["#ffd36b", "#ff7a7a", "#7ae0ff"][(tx + Math.floor(frNow() / 20)) % 3]); } } return; }
    P(sx, sy, 16, 16, wall);
    if (!D()) { for (let r = 0; r < 4; r++) P(sx, sy + r * 4 + 3, 16, 1, "rgba(0,0,0,.18)"); }
    else { P(sx, sy + 10, 16, 2, st.wall2); }
    const win = m.ry >= 1 && m.ry < o.h - 1 && m.rx > 0 && m.rx < o.w - 1 && m.rx % 2 === 1;
    if (win && !(o.door && o.door[0] === tx && o.door[1] === ty)) {
      const lit = D() ? true : rnd(tx, ty, 5) < 0.6;
      P(sx + 3, sy + 3, 10, 9, D() ? "#2b3a3a" : "#1a1018"); P(sx + 4, sy + 4, 8, 7, lit ? (D() ? "#bfeee6" : "#ffcf7a") : "#2a2a3a"); P(sx + 8, sy + 4, 1, 7, D() ? "#2b3a3a" : "#1a1018");
    }
    if (m.rx === 0) P(sx, sy, 1, 16, "rgba(0,0,0,.25)"); if (m.rx === o.w - 1) P(sx + 15, sy, 1, 16, "rgba(0,0,0,.35)");
  }
  const PAINT = {
    a(sx, sy, tx, ty) { // muro
      if (D()) { P(sx, sy, 16, 16, ZX.st.wall); P(sx, sy + 10, 16, 2, ZX.st.wall2); P(sx, sy + 15, 16, 1, "#c9d6d3"); P(sx + 15, sy, 1, 16, "rgba(43,58,58,.08)"); if (at(tx, ty + 1) !== "a") P(sx, sy + 14, 16, 2, "rgba(0,0,0,.12)"); }
      else { P(sx, sy, 16, 16, ZX.st.wall); for (let r = 0; r < 4; r++) { P(sx, sy + r * 4 + 3, 16, 1, ZX.st.wall2); P(sx + ((r % 2) * 8 + (tx % 2) * 4), sy + r * 4, 1, 4, ZX.st.wall2); } if (at(tx, ty + 1) !== "a") P(sx, sy + 14, 16, 2, "rgba(0,0,0,.35)"); }
    },
    d(sx, sy, tx, ty, fr) { // scrivania con terminale a tubo catodico
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx, sy + 8, 16, 7, "#e9ede8"); P(sx, sy + 8, 16, 1, "#ffffff"); P(sx + 1, sy + 14, 2, 2, "#8a948f"); P(sx + 13, sy + 14, 2, 2, "#8a948f");
      P(sx + 3, sy, 10, 9, "#cfd6c8"); P(sx + 4, sy + 1, 8, 6, "#0e2a24");
      if ((tx + Math.floor(fr / 40)) % 3) { P(sx + 5, sy + 2, 4, 1, "#5af0c8"); P(sx + 5, sy + 4, 6, 1, "#5af0c8"); } else P(sx + 5, sy + 3, 1, 1, "#5af0c8");
      P(sx + 5, sy + 10, 6, 2, "#bfc8bd");
    },
    k(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx, sy + 3, 16, 10, "#b9c7c3"); P(sx, sy + 3, 16, 2, "#dfe9e7"); P(sx, sy + 12, 16, 1, "rgba(0,0,0,.2)"); for (let i = 2; i < 16; i += 4) P(sx + i, sy + 6, 1, 5, "rgba(0,0,0,.08)"); },
    x(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); if (D()) { P(sx + 2, sy + 1, 12, 14, "#a9b4b0"); for (let i = 0; i < 3; i++) { P(sx + 3, sy + 2 + i * 4, 10, 3, "#c4cdca"); P(sx + 7, sy + 3 + i * 4, 2, 1, "#5a6560"); } } else { P(sx + 2, sy + 4, 12, 11, "#6a4a2a"); P(sx + 2, sy + 4, 12, 2, "#8a6a3a"); P(sx + 7, sy + 4, 2, 11, "rgba(0,0,0,.3)"); P(sx + 4, sy + 8, 3, 2, "#c9b48a"); } },
    p(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 5, sy + 10, 6, 5, D() ? "#dfe6e4" : "#7a4e32"); const sw = Math.sin(fr / 50 + tx) * 0.8; GP.fillStyle = D() ? "#5a9a72" : "#3a6a4a"; GP.beginPath(); GP.arc(sx + 8 + sw, sy + 6, 5, 0, 7); GP.arc(sx + 5 + sw, sy + 8, 3, 0, 7); GP.arc(sx + 11 + sw, sy + 8, 3, 0, 7); GP.fill(); },
    K(sx, sy, tx, ty, fr) { // l'Armadietto 7
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 2, sy, 12, 16, D() ? "#9fb7b2" : "#5a6a7a"); P(sx + 2, sy, 12, 1, "#ffffff55"); P(sx + 4, sy + 2, 8, 2, "rgba(0,0,0,.25)"); P(sx + 4, sy + 5, 8, 1, "rgba(0,0,0,.25)");
      GP.fillStyle = "#ffd23f"; GP.font = "bold 7px sans-serif"; GP.textAlign = "center"; GP.fillText("7", sx + 8, sy + 13); GP.textAlign = "left";
      if (ZX.unread && ZX.unread()) { GP.save(); GP.globalCompositeOperation = "lighter"; glow(GP, sx + 8, sy + 8, 14, "255,220,120", 0.35 + 0.2 * Math.sin(fr / 8)); GP.restore(); P(sx + 12, sy + 1, 3, 3, "#ff5a5a"); }
    },
    e(sx, sy, tx, ty, fr) { // ascensore
      P(sx, sy, 16, 16, D() ? "#c9d1cf" : "#3a3a44"); P(sx + 1, sy + 2, 14, 14, D() ? "#aeb8b5" : "#555a66"); P(sx + 7, sy + 2, 2, 14, D() ? "#8a948f" : "#2a2a33");
      P(sx + 5, sy, 6, 2, "#1a1a1a"); P(sx + 6, sy, 1, 1, (fr / 30 | 0) % 2 ? "#ff5a5a" : "#5af0c8"); P(sx + 9, sy, 1, 1, "#5af0c8");
    },
    q(sx, sy, tx, ty) { const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx]; P(sx, sy, 16, 16, (m && m.o.wall) || ZX.st.wall); P(sx + 3, sy + 2, 10, 14, D() ? "#9fb7b2" : "#5a3a28"); P(sx + 3, sy + 2, 10, 1, "#ffffff44"); P(sx + 10, sy + 9, 2, 2, "#ffd23f"); },
    Q(sx, sy, tx, ty, fr) { P(sx, sy, 16, 16, ZX.st.wall); P(sx + 2, sy + 1, 12, 15, D() ? "#7f8f8b" : "#3a2a2e"); P(sx + 10, sy + 6, 4, 6, "#1a1a1a"); for (let i = 0; i < 3; i++) P(sx + 11, sy + 7 + i * 2, 2, 1, (fr / 20 | 0) % 3 === i ? "#ff5a5a" : "#3a3a3a"); },
    n(sx, sy, tx, ty) { // manifesto
      if (D()) { P(sx, sy, 16, 16, ZX.st.wall); P(sx + 2, sy + 1, 12, 11, "#ffffff"); P(sx + 2, sy + 1, 12, 3, ZX.st.wall2); GP.fillStyle = "#2a9d8f"; GP.beginPath(); GP.arc(sx + 8, sy + 8, 2.5, 0, Math.PI); GP.stroke(); P(sx + 6, sy + 6, 1, 1, "#2b3a3a"); P(sx + 9, sy + 6, 1, 1, "#2b3a3a"); }
      else { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 7, sy + 8, 2, 8, "#3a2a20"); P(sx + 1, sy + 1, 14, 9, "#e8d6b0"); P(sx + 2, sy + 2, 12, 7, ["#c0392b", "#2c7fb8", "#e8a33d"][(tx + ty) % 3]); P(sx + 3, sy + 4, 8, 1, "#fff"); }
    },
    b(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); const c = D() ? "#e9ede8" : "#6a4a2a"; P(sx + 1, sy + 6, 14, 3, c); P(sx + 2, sy + 9, 2, 5, D() ? "#8a948f" : "#3a2a20"); P(sx + 12, sy + 9, 2, 5, D() ? "#8a948f" : "#3a2a20"); },
    g(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 2, sy + 2, 12, 12, "rgba(255,255,255,.25)"); for (let i = 3; i < 14; i += 3) { P(sx + i, sy + 2, 1, 12, "rgba(255,255,255,.55)"); P(sx + 2, sy + i, 12, 1, "rgba(255,255,255,.55)"); } P(sx + 1, sy + 1, 14, 2, "#fff"); },
    j(sx, sy, tx, ty) { P(sx, sy, 16, 16, D() ? "#dfe6e4" : "#3a3236"); P(sx, sy + 7, 16, 2, "rgba(0,0,0,.2)"); P(sx + 2, sy + 2, 5, 5, D() ? "#2a9d8f" : "#7a2a2a"); P(sx + 9, sy + 2, 5, 5, D() ? "#2a9d8f" : "#7a2a2a"); P(sx + 2, sy + 10, 5, 5, D() ? "#2a9d8f" : "#7a2a2a"); P(sx + 9, sy + 10, 5, 5, D() ? "#2a9d8f" : "#7a2a2a"); },
    w(sx, sy, tx, ty, fr) {
      if (D()) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 4, sy + 6, 8, 10, "#dfe6e4"); P(sx + 5, sy, 6, 7, "#9fd8f0"); P(sx + 6, sy + 1 + (fr / 30 | 0) % 4, 1, 1, "#ffffff"); return; } // distributore d'acqua
      const st = ZX.st; P(sx, sy, 16, 16, st.sea[(tx + ty) % 2]); const o = (fr / 4 + tx * 5) % 16; P(sx + o - 4, sy + 5 + (ty % 2) * 6, 6, 1, "rgba(255,200,120,.35)"); if (rnd(tx, ty, 3) < 0.08) P(sx + 7, sy + 7, 1, 1, "#ffe9a0");
    },
    f(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); const c = D() ? "#8a948f" : "#2a2a33"; P(sx, sy + 4, 16, 2, c); P(sx, sy + 10, 16, 1, c); P(sx + 2, sy + 4, 2, 12, c); P(sx + 12, sy + 4, 2, 12, c); },
    l(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 7, sy + 2, 2, 14, D() ? "#c9d1cf" : "#2a2a33"); P(sx + 4, sy, 8, 3, D() ? "#ffffff" : "#ffcf7a"); GP.save(); GP.globalCompositeOperation = "lighter"; glow(GP, sx + 8, sy + 2, 14 + Math.sin(fr / 12 + tx), D() ? "200,255,240" : "255,190,110", D() ? 0.25 : 0.4); GP.restore(); },
    u(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); GP.fillStyle = "#c9b48a"; GP.beginPath(); GP.arc(sx + 8, sy + 8, 6, 0, 7); GP.fill(); P(sx + 7, sy + 8, 2, 7, "#3a2a20"); P(sx + 6, sy + 5, 3, 3, "#ffcf7a"); },
    y: (sx, sy, tx, ty) => houseTile(sx, sy, tx, ty),
    c(sx, sy, tx, ty, fr) { const b = Math.sin(fr / 30 + tx) * 1; P(sx, sy, 16, 16, ZX.st.sea ? ZX.st.sea[0] : "#1b2a4a"); GP.fillStyle = ["#c0392b", "#e8e0d0", "#2c7fb8"][(tx >> 1) % 3]; GP.beginPath(); GP.moveTo(sx, sy + 6 + b); GP.lineTo(sx + 16, sy + 6 + b); GP.lineTo(sx + 13, sy + 13 + b); GP.lineTo(sx + 3, sy + 13 + b); GP.fill(); P(sx + 7, sy - 2 + b, 1, 8, "#e8e0d0"); },
    C(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); GP.fillStyle = "#3a2a4a"; GP.beginPath(); GP.arc(sx + 8, sy + 8, 7, 0, 7); GP.fill(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + (F.is("giostra_on") ? fr / 30 : 0); P(sx + 8 + Math.cos(a) * 5, sy + 8 + Math.sin(a) * 5, 2, 2, ["#ffd36b", "#ff7a7a", "#7ae0ff"][i % 3]); } },
    i(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); GP.strokeStyle = "#8a7a5a"; GP.lineWidth = 1; GP.beginPath(); for (let i = 0; i < 16; i += 4) { GP.moveTo(sx + i, sy + 2); GP.lineTo(sx + i + 4, sy + 14); GP.moveTo(sx + i + 4, sy + 2); GP.lineTo(sx + i, sy + 14); } GP.stroke(); P(sx + 2, sy + 10, 3, 3, "#e05a3a"); },
    P(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx, sy + 1, 16, 11, "#1a1a22"); P(sx + 1, sy + 2, 14, 9, "#0a0a12"); GP.fillStyle = D() ? "#5af0c8" : "#ffcf7a"; GP.font = "bold 6px monospace"; GP.fillText(F.get("tab_" + ZX.id, "0:0"), sx + 2, sy + 9); P(sx + 7, sy + 12, 2, 4, "#5a5a66"); },
    Y(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx, sy + 6, 16, 8, "#ffffff"); P(sx, sy + 6, 16, 1, "#2a9d8f"); P(sx + 2, sy + 3, 5, 4, "#e9ede8"); P(sx + 10, sy + 2, 2, 5, "#2a9d8f"); P(sx + 9, sy + 1, 4, 2, "#5a9a72"); },
    Z(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 3, sy, 10, 16, D() ? "#ffffff" : "#5a4b52"); P(sx + 3, sy, 2, 16, "rgba(0,0,0,.08)"); P(sx + 11, sy, 2, 16, "rgba(0,0,0,.15)"); },
    F(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); GP.fillStyle = D() ? "#dfe6e4" : "#6e6268"; GP.beginPath(); GP.arc(sx + 8, sy + 9, 7, 0, 7); GP.fill(); GP.fillStyle = D() ? "#9fd8f0" : "#22345a"; GP.beginPath(); GP.arc(sx + 8, sy + 9, 5, 0, 7); GP.fill(); P(sx + 7, sy + 2 + (fr / 10 | 0) % 3, 2, 3, "#bfeefc"); },
    I(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); GP.save(); GP.globalCompositeOperation = "lighter"; glow(GP, sx + 8, sy + 8, 14, "255,240,180", 0.3 + 0.2 * Math.sin(fr / 15)); GP.restore(); GP.fillStyle = "#ffffff"; GP.beginPath(); GP.arc(sx + 8, sy + 8, 3, 0, 7); GP.fill(); }, // il dischetto del rigore
    V(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 3, sy + 1, 10, 14, "#3a3a44"); P(sx + 4, sy + 2, 8, 4, "#1a1a22"); P(sx + 5, sy + 3, 3, 1, "#ff5a5a"); P(sx + 6, sy + 9, 4, 4, "#e9ede8"); if ((fr / 60 | 0) % 2) P(sx + 7, sy + 7 - (fr / 6 | 0) % 4, 1, 2, "rgba(255,255,255,.5)"); },
    ">": (sx, sy, tx, ty) => arrowTile(">", sx, sy, tx, ty), "<": (sx, sy, tx, ty) => arrowTile("<", sx, sy, tx, ty), "^": (sx, sy, tx, ty) => arrowTile("^", sx, sy, tx, ty), v: (sx, sy, tx, ty) => arrowTile("v", sx, sy, tx, ty),
  };
  function arrowTile(ch, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty); const b = Math.sin(frNow() / 8) * 1.5;
    GP.fillStyle = D() ? "#2a9d8f" : "#ffb347"; GP.beginPath();
    if (ch === ">") { GP.moveTo(sx + 4 + b, sy + 4); GP.lineTo(sx + 12 + b, sy + 8); GP.lineTo(sx + 4 + b, sy + 12); } else if (ch === "<") { GP.moveTo(sx + 12 - b, sy + 4); GP.lineTo(sx + 4 - b, sy + 8); GP.lineTo(sx + 12 - b, sy + 12); } else if (ch === "v") { GP.moveTo(sx + 4, sy + 4 + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 12, sy + 4 + b); } else { GP.moveTo(sx + 4, sy + 12 - b); GP.lineTo(sx + 8, sy + 4 - b); GP.lineTo(sx + 12, sy + 12 - b); }
    GP.closePath(); GP.fill();
  }
  function drawTile(ch, sx, sy, tx, ty) {
    GP = GP || document.getElementById("cv").getContext("2d");
    if (isFloor(ch)) { floorPaint(ch, sx, sy, tx, ty); return true; }
    const fn = PAINT[ch]; if (fn) { fn(sx, sy, tx, ty, frNow()); return true; }
    floorPaint(",", sx, sy, tx, ty); return true;
  }
  function makeLayers(w, h) {
    const m = ZX.map, u = Array.from({ length: h }, () => Array(w).fill(",")), meta = Array.from({ length: h }, () => Array(w).fill(null));
    ZX.under = u; ZX.meta = meta;
    const put = (x, y, ch) => { if (m[y] && x >= 0 && x < w) { m[y][x] = ch; if (isFloor(ch)) u[y][x] = ch; } };
    const lay = (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, ch); };
    const house = (x, y, hw, hh, o) => { o = Object.assign({ w: hw, h: hh }, o || {}); for (let yy = 0; yy < hh; yy++) for (let xx = 0; xx < hw; xx++) { put(x + xx, y + yy, "y"); if (meta[y + yy]) meta[y + yy][x + xx] = { o, rx: xx, ry: yy }; } if (o.door) { put(o.door[0], o.door[1], o.door[2] || "q"); if (meta[o.door[1]]) meta[o.door[1]][o.door[0]] = { o, rx: o.door[0] - x, ry: o.door[1] - y }; } };
    return { lay, put, house, w, h };
  }

  // ------------------------------------------------------------------ capitoli e zone
  const CHAPTERS = {}, ZONES = {}, COS = {}, PENDING = [];
  const zoneRec = () => (api ? ZONES[api.trZone()] || null : null);
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "dt_atrio";
  const activeChapter = () => { const m = mem(); let best = null; Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).forEach((n) => { if (n <= m.ch) best = CHAPTERS[n]; }); return best || CHAPTERS[1] || null; };
  const CAST_OK = (id) => !!(api && api.CAST && api.CAST[id]);
  const goalNow = () => { const c = activeChapter(); return c && c.goal ? T(c.goal(stepOf(c.n))) : ""; };
  // capitoli «attivi» su una zona: quello che l'ha creata e i successivi già sbloccati (dal più recente). I successivi possono
  // ritoccare la zona con def.patch[zid] = { npcs(step, lista) }, e i loro talk/obj hanno la precedenza.
  const chainFor = (zr) => { const m = mem(); return Object.keys(CHAPTERS).map(Number).filter((n) => n >= zr.ch && n <= m.ch).sort((a, b) => b - a).map((n) => CHAPTERS[n]); };
  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch]; castHero();
    const s = stepOf(c.n); let list = zr.spec.npcs ? zr.spec.npcs(s) : [];
    chainFor(zr).slice().reverse().forEach((cc) => { const p = cc.n !== zr.ch && cc.patch && cc.patch[api.trZone()]; if (p && p.npcs) list = p.npcs(stepOf(cc.n), list); });
    zr.Z.npcs = list.filter((n) => CAST_OK(n.id));
    const hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(s) : zr.spec.hints || {}), gl = goalNow();
    [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => { if (k) hints[k] = `[${zr.spec.half === "d" ? "DENTRO" : "FUORI"}] ` + (gl ? "Obiettivo: " + gl + " · " : "") + (hints[k] || ""); });
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

  // ---- passaggio di metà: l'ascensore. Effetto visivo: lo schermo si «spezza» in due
  const FX = { enter: -999, swap: -999 };
  function topFx(g) {
    const fr = frNow(), s = ZX.stk;
    if (s === "den") { // neon che sfarfallano, un velo verde acqua, vignetta fredda
      const fl = (fr % 240) < 4 ? 0.08 : 0; g.fillStyle = `rgba(200,255,240,${0.05 + fl})`; g.fillRect(0, 0, 320, 200);
      for (let y = 0; y < 200; y += 3) { g.fillStyle = "rgba(0,0,0,.025)"; g.fillRect(0, y, 320, 1); }
      const vg = g.createRadialGradient(160, 100, 90, 160, 100, 200); vg.addColorStop(0, "rgba(10,40,40,0)"); vg.addColorStop(1, "rgba(10,40,40,.28)"); g.fillStyle = vg; g.fillRect(0, 0, 320, 200);
    } else { // pioggerella, lucine, vignetta calda
      g.strokeStyle = "rgba(180,200,255,.18)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 30; i++) { const x = (i * 47 + fr * 1.5) % 340 - 10, y = (i * 71 + fr * 4) % 210 - 5; g.moveTo(x, y); g.lineTo(x - 2, y + 6); } g.stroke();
      const vg = g.createRadialGradient(160, 100, 80, 160, 100, 200); vg.addColorStop(0, "rgba(40,10,20,0)"); vg.addColorStop(1, "rgba(20,5,20,.4)"); g.fillStyle = vg; g.fillRect(0, 0, 320, 200);
    }
    const k = fr - FX.enter;
    if (k >= 0 && k < 40) { // le porte dell'ascensore che si aprono
      const t = Math.min(1, k / 30), w = 160 * (1 - t);
      g.fillStyle = s === "den" ? "#c9d1cf" : "#3a3a44"; g.fillRect(0, 0, w, 200); g.fillRect(320 - w, 0, w, 200);
      g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(w - 2, 0, 2, 200); g.fillRect(320 - w, 0, 2, 200);
      if (t < 0.6) { g.fillStyle = s === "den" ? "#2a9d8f" : "#ffb347"; g.font = "bold 10px sans-serif"; g.textAlign = "center"; g.fillText(s === "den" ? "IL DENTRO" : "IL FUORI", 160, 104); g.textAlign = "left"; }
    }
  }
  function go(zid, tx, ty) { const tr = api.trRec(); tr.pos[zid] = [tx * TS + 8, ty * TS + 12]; enterZone(zid); }
  function enterZone(zid) {
    const zr = ZONES[zid]; if (!zr) return;
    const m = mem(), was = F.get("half", ""); m.zone = zid; save(); F.set("half", zr.spec.half);
    castHero(zr.spec.half); api.trRec().seen[zid] = true;
    FX.enter = frNow(); if (was && was !== zr.spec.half) SFX.swap(); else SFX.ding();
    api.trGo(zid); refreshZone();
    if (!m.intro[zid]) { m.intro[zid] = 1; save(); if (zr.spec.intro && zr.spec.intro.length) return say(zr.spec.intro, done); }
    api.trToast(zr.spec.short);
  }

  // ------------------------------------------------------------------ BIGLIETTI (l'Armadietto 7)
  const noteList = (h) => Object.keys(mem().notes).filter((k) => mem().notes[k].to === h);
  const unreadFor = (h) => noteList(h).filter((k) => mem().notes[k].st === "new");
  function noteText(id) {
    const n = mem().notes[id], d = NOTES[id];
    if (n.mine) { const f = FACTS[n.fact]; return { ink: INK[other(n.to)], sign: String((hero() || {}).num || "?"), text: `Ciao. Sono te, ${HALF_NAME[other(n.to)]}. Una cosa che devi sapere: ${f ? f.t + ". " + f.d : "…"}`, fake: false }; }
    return d ? { ink: d.ink, sign: T(d.sign), text: T(d.text), fake: !!d.fake } : { ink: "?", sign: "?", text: "…", fake: false };
  }
  // un biglietto «del copione» (vero o falso) compare nell'armadietto
  function plant(id) { const d = NOTES[id], m = mem(); if (!d || m.notes[id]) return false; m.notes[id] = { to: d.to, st: "new", fact: d.fact }; save(); return true; }
  function readNote(id, back) {
    const n = mem().notes[id], t = noteText(id), h = half();
    ask("voce", `Un biglietto piegato in quattro.\nInchiostro: ${t.ink}. Firma: «${t.sign}».\n\n«${t.text}»`, [
      { label: "✔ È mio: ci credo", sub: "L'altra metà sa questa cosa", cls: "hot", fn: () => judge(id, "vero", back) },
      { label: "✘ Non l'ho scritto io", sub: "Questo biglietto è falso", fn: () => judge(id, "falso", back) },
      { label: "Ci penso dopo", sub: "Il biglietto resta nell'armadietto", fn: back || done },
    ]);
  }
  function judge(id, verdict, back) {
    const m = mem(), n = m.notes[id], t = noteText(id), d = NOTES[id] || {}, h = half();
    n.st = verdict; save();
    const right = (verdict === "falso") === t.fake;
    const after = () => (d.after ? d.after(verdict, right) : (back || done)());
    if (verdict === "vero") {
      if (n.fact) learnFact(n.fact, h);
      if (t.fake) { F.add("fake_believed"); note(`Ho creduto a un biglietto falso: «${t.text.slice(0, 60)}…»`); if (d.onBelieve) d.onBelieve(); return say([["voce", "Pieghi il biglietto e lo metti in tasca. Ti fidi. In fondo, chi altro potrebbe scriverti?"]], after); }
      return say([["voce", n.mine ? "La tua calligrafia. Le tue manie. Ti fidi: è come parlarsi allo specchio, ma lo specchio è in un'altra città." : "Ti fidi del biglietto. Qualcosa, dentro, si sistema."]], after);
    }
    if (t.fake) { F.add("fake_unmasked"); SFX.fake(); note(`Ho smascherato un biglietto falso (${d.who || "?"}).`); if (d.onUnmask) d.onUnmask(); return say([["voce", `Lo guardi meglio. ${d.tell || "Qualcosa non torna."} Non l'hai scritto tu.`]], after); }
    F.add("true_burned"); if (n.mine) delete m.notes[id]; save();
    return say([["voce", "Strappi il biglietto. Poi ti viene un dubbio: e se fosse stato davvero tuo? Troppo tardi. Il fatto che conteneva è perso: l'altra metà dovrà riscriverlo."]], after);
  }
  function writeNote(back) {
    const h = half(), o = other(h), m = mem();
    const pend = new Set(Object.values(m.notes).filter((n) => n.mine && n.st === "new").map((n) => n.fact));
    const cand = m.facts[h].filter((f) => FACTS[f] && !FACTS[f].secret && !f.startsWith(o + "_") && !m.facts[o].includes(f) && !pend.has(f)); // un fatto «del Fuori» il Fuori lo sa già (e viceversa)
    if (!cand.length) return say([["voce", `Prendi la ${INK[h]}… e ti accorgi che non hai niente di nuovo da dire all'altra metà. Tutto quello che sai, lo sa anche ${HALF_NAME[o]}.`]], back || done);
    ask("voce", `Scrivi un biglietto per ${HALF_NAME[o]} (${INK[h]}, firma «{num}»). Quale cosa vuoi fargli sapere?`, cand.map((f) => ({ label: "✎ " + FACTS[f].t, sub: FACTS[f].d.slice(0, 80), fn: () => { m.notes["w_" + f] = { to: o, st: "new", fact: f, mine: true }; save(); SFX.note(); note(`${HALF_NAME[h]} ha scritto un biglietto: ${FACTS[f].t}.`); say([["voce", `Scrivi, pieghi in quattro, firmi «{num}». Il biglietto finisce nell'Armadietto 7. ${HALF_NAME[o]} lo troverà.`]], back || done); } })).concat([{ label: "Lascia stare", fn: back || done }]));
  }
  function locker(back) {
    const h = half(), un = unreadFor(h), mineOut = Object.values(mem().notes).filter((n) => n.mine && n.to === other(h) && n.st === "new").length;
    ask("voce", `L'Armadietto 7. ${un.length ? `Dentro ci sono ${un.length} bigliett${un.length === 1 ? "o" : "i"} che non hai ancora letto.` : "Nessun biglietto nuovo per te."}${mineOut ? `\n${mineOut} tuo/tuoi aspettano ${HALF_NAME[other(h)]}.` : ""}`, [
      ...un.map((id) => ({ label: "📄 Leggi un biglietto", sub: `Inchiostro: ${noteText(id).ink}`, cls: "hot", fn: () => readNote(id, () => locker(back)) })),
      { label: "✎ Scrivi un biglietto", sub: `Per ${HALF_NAME[other(h)]}`, fn: () => writeNote(() => locker(back)) },
      { label: "Chiudi l'armadietto", fn: back || done },
    ]);
  }

  function registerZone(chN, zid, spec) {
    const stk = spec.half === "d" ? "den" : "fuo";
    const Z = {
      name: spec.name, short: spec.short, sub: spec.sub || "", need: 0, w: spec.w, h: spec.h, start: spec.start, theme: "doppio", isCustomSaga: true,
      bus: "uscita", busLabel: "Esci dalla saga",
      item: spec.item || (spec.half === "d" ? ["Graffetta d'oro", "Graffette"] : ["Conchiglia", "Conchiglie"]), itemCos: spec.itemCos, items: spec.items || [], bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({ K: "Apri l'Armadietto 7", e: spec.half === "d" ? "Prendi l'ascensore" : "Ingresso del personale" }, spec.act || {}), intro: [],
      me: () => { const c = api.CAST.hero || api.CAST.leo; return Object.assign({}, c); },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d");
        g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, y, 10, spec.half === "d" ? "120,255,220" : "255,200,120", 0.45 + 0.15 * Math.sin(frNow() / 10 + i)); g.restore();
        if (spec.half === "d") { g.strokeStyle = "#ffd23f"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x - 2, y + 4); g.lineTo(x - 2, y - 4); g.arc(x, y - 4, 2, Math.PI, 0); g.lineTo(x + 2, y + 2); g.stroke(); }
        else { g.fillStyle = "#f2d0b0"; g.beginPath(); g.moveTo(x - 4, y + 3); g.quadraticCurveTo(x, y - 6, x + 4, y + 3); g.fill(); g.strokeStyle = "#c0907a"; g.beginPath(); g.moveTo(x, y + 3); g.lineTo(x, y - 2); g.stroke(); }
      },
    };
    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: il Fascicolo ed Esci." });
    Z.build = function (m) {
      ZX.map = m; ZX.id = zid; ZX.stk = stk; ZX.st = STY[stk]; ZX.grass = !!spec.grass; ZX.unread = () => unreadFor(spec.half).length > 0; GP = document.getElementById("cv").getContext("2d");
      const Ls = makeLayers(spec.w, spec.h); Ls.lay(0, 0, spec.w - 1, spec.h - 1, spec.half === "d" ? "+" : ",");
      spec.build(Ls);
      chainFor(ZONES[zid]).slice().reverse().forEach((cc) => { const p = cc.n !== chN && cc.patch && cc.patch[zid]; if (p && p.build) p.build(Ls); });
      refreshSoon();
    };
    Z.tile = function (ch, sx, sy, tx, ty) { GP = GP || document.getElementById("cv").getContext("2d"); if (ZX.id !== zid) { ZX.id = zid; ZX.stk = stk; ZX.st = STY[stk]; ZX.grass = !!spec.grass; ZX.unread = () => unreadFor(spec.half).length > 0; } return drawTile(ch, sx, sy, tx, ty); };
    const dd = (cx, cy) => ({ X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow() });
    Z.decor = function (cx, cy) { if (spec.decor) safe(() => spec.decor(GP, cx, cy, dd(cx, cy))); };
    Z.top = function (cx, cy) { if (spec.top) safe(() => spec.top(GP, cx, cy, dd(cx, cy))); safe(() => topFx(GP)); };
    Z.onObj = function (ch, tx, ty) {
      let f = null;
      chainFor(ZONES[zid]).some((c) => { f = c.obj && (c.obj[zid + ":" + ch + ":" + tx + "," + ty] || c.obj[zid + ":" + ch]); return !!f; });
      if (f) { f({ ch, tx, ty, zid }); return true; }
      if (ch === "K") { locker(done); return true; }
      const flav = spec.flavor && (spec.flavor[tx + "," + ty] || spec.flavor[ch]);
      if (flav) { say([["voce", Array.isArray(flav) ? pick(flav) : flav]], done); return true; }
      if (Z.act[tx + "," + ty] || Z.act[ch]) { say([["voce", spec.half === "d" ? "Tutto in ordine. Tutto pulito. Tutto, qui dentro, sorride." : "Niente di speciale. La città fa il suo rumore di sempre."]], done); return true; }
      return false;
    };
    Z.menu = () => zoneMenu();
    api.TRZ[zid] = Z;
    ZONES[zid] = { ch: chN, spec, Z };
  }

  // ------------------------------------------------------------------ menu e Fascicolo
  function leave() { const back = EXIT || window.title; EXIT = null; api.trExitTo(typeof back === "function" ? back : null); }
  function zoneMenu() {
    const c = activeChapter(), m = mem(), h = half();
    api.trAsk("voce", `<b>Doppio Turno</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")} · <b>${h === "d" ? "DENTRO" : "FUORI"}</b><br><span style="color:var(--dim)">${esc(goalNow())}<br>Conformità ${m.conf}/100 · Fatti: Dentro ${m.facts.d.length}, Fuori ${m.facts.f.length} · Monete ${bal()}</span>`, [
      { label: "Il Fascicolo", sub: "Cosa sa ciascuna metà, i biglietti, i finali", cls: "hot", fn: () => fascicolo(zoneMenu, true) },
      { label: "Esci da Doppio Turno", sub: "Progressi e posizione restano salvati", cls: "hot", fn: leave },
    ], bgNow());
  }
  const ENDINGS = {
    unito: ["UN SOLO TURNO", "Le due metà si ricompongono. Ricordi tutto, e scegli lo stesso."],
    diviso: ["DOPPIO TURNO", "Restate due. Ciascuno con la sua vita, e un armadietto in comune."],
    dentro: ["IL DENTRO RESTA", "Il Fuori si addormenta. Resta solo chi ama il calcio senza ricordare."],
    porto: ["IL PORTO RINASCE", "Il finale segreto. Il vecchio stadio torna alla città."],
  };
  function fascicolo(back, inZone) {
    const m = mem(), h0 = hero() || { name: "Campione", num: 9 };
    const list = (hh) => m.facts[hh].filter((f) => FACTS[f]).map((f) => `• ${esc(FACTS[f].t)}`).join("<br>") || "<span style='color:var(--dim)'>Niente, per ora.</span>";
    const nn = Object.values(m.notes), fakesU = F.get("fake_unmasked", 0), fakesB = F.get("fake_believed", 0);
    const ends = Object.keys(ENDINGS).map((k) => (m.ends.includes(k) ? `✓ <b>${esc(ENDINGS[k][0])}</b> <span style="color:var(--dim)">${esc(ENDINGS[k][1])}</span>` : "<span style='color:var(--dim)'>• ???</span>")).join("<br>");
    const html = `<b>${esc(h0.name)}</b> · n. ${esc(h0.num)} · Conformità <b>${m.conf}</b>/100<br><br><b>Il Dentro sa</b><br>${list("d")}<br><br><b>Il Fuori sa</b><br>${list("f")}<br><br><b>Biglietti</b> ${nn.length} · falsi smascherati ${fakesU}${fakesB ? ` · <span style="color:#ff8a8a">falsi creduti ${fakesB}</span>` : ""}<br><br><b>Finali</b><br>${ends}`;
    if (inZone) return api.trAsk("voce", html, [{ label: "◂ Indietro", fn: back }], bgNow());
    api.scene("dt_atrio", "voce", html, [{ label: "◂ Indietro", fn: back }], "Il Fascicolo");
  }

  // ------------------------------------------------------------------ partite
  let inMatch = false;
  function playMatch(o) {
    castHero(); inMatch = true;
    api.matchPick({
      alt: o.alt, oppNames: o.oppNames, squad: o.squad, azPitch: o.azPitch, cageMut: o.cageMut, cageTarget: o.cageTarget, homeKit: o.homeKit, cageField: o.cageField,
      force: o.force !== false && !!o.alt && !/,/.test(o.alt), id: o.id, chap: T(o.chap), intro: T(o.intro), mate: o.mate, mateGeneric: true, us: o.us, min: o.min || 45, team: o.team, venue: o.venue, weather: o.weather, bg: o.bg, hero: undefined,
      onDone: (r) => { inMatch = false; const m = mem(); if (r.win) m.wins++; else if (r.a < r.b) m.losses++; save(); refreshZone(); safe(() => o.done(r), null); },
    });
  }
  function finishChapter(n, ending) { const m = mem(); m.done[n] = String(ending || "ok").slice(0, 24); if (m.ch <= n) m.ch = n + 1; save(); }

  const XTOOLS = {
    get api() { return api; }, TS, T, esc, hash, rnd, pick, safe, F, mem, save, stepOf, setStep, note, once, reward, coinsGive, bal, hero, castHero,
    say, ask, done, go, enterZone, playMatch, finishChapter, setTiles, SFX, glow, frNow, refreshZone, bgNow, fascicolo, leave, lines,
    half, other, knows, learnFact, conf, locker, plant, unreadFor, HALF_NAME, INK, ENDINGS,
    scene: (ls, then) => api.play(lines(ls, "dt_atrio"), then),
    fact: (id, d) => { FACTS[id] = d; }, noteDef: (id, d) => { NOTES[id] = d; },
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
    if (!h) return api.scene("dt_atrio", "voce", "<b>Doppio Turno</b><br>Questa storia ha bisogno del tuo Campione: anzi, di due. Prima crealo.", [
      { label: "Crea il tuo Campione", sub: "Nome, numero e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Doppio Turno");
    castHero("d");
    const c = activeChapter(), m = mem(), cur = c && m.done[c.n], nextOk = !!CHAPTERS[(c ? c.n : 0) + 1];
    const status = m.done[3] ? `Storia conclusa. Finali trovati: ${m.ends.length} su ${Object.keys(ENDINGS).length}.` : cur ? (nextOk ? "Il prossimo turno ti aspetta." : "Turno concluso · il prossimo capitolo è in arrivo.") : goalNow();
    api.scene("dt_atrio", "voce", `<b>🪞 Doppio Turno</b><br>${esc(h.name)} · n. ${esc(h.num)} · Conformità ${m.conf}/100<br><span style="color:var(--dim)">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}<br>${esc(status)}</span>`, [
      { label: c && !m.intro["ch" + c.n] ? (c.n > 1 ? `Inizia il Capitolo ${c.n}` : "Firma il contratto") : "Continua il turno", sub: c ? `Capitolo ${c.n} · ${c.title}` : "", cls: "hot", fn: continueStory },
      { label: "Il Fascicolo", sub: "Cosa sanno il Dentro e il Fuori", fn: () => fascicolo(openMain, false) },
      { label: "Capitoli", sub: "Rigioca i capitoli già sbloccati", fn: chapters },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Doppio Turno");
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
    api.scene("dt_atrio", "voce", "<b>Capitoli</b><br>Due metà, tre turni. Le scelte e i biglietti restano: cambiano il finale.", opts, "Doppio Turno · Capitoli");
  }
  function resetAsk() {
    api.scene("dt_atrio", "voce", "<b>Ricominciare?</b><br>Si cancellano scelte, fatti, biglietti e finali di Doppio Turno. Monete e cosmetici restano tuoi.", [
      { label: "Sì, ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
      { label: "◂ No", fn: chapters },
    ], "Doppio Turno");
  }
  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    if (!m.intro["ch" + c.n]) {
      m.intro["ch" + c.n] = 1; save();
      return api.play(lines(c.intro(), "dt_atrio"), () => { const z = ZONES[c.start]; go(c.start, z.spec.start[0], z.spec.start[1]); });
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
    if (document.getElementById("dtExit")) return;
    const st = document.createElement("style");
    st.textContent = "#dtExit{position:fixed;left:8px;bottom:8px;z-index:60;display:none;min-height:36px;padding:6px 12px;border-radius:10px;border:1px solid #2a9d8f;background:#eef2f1ee;color:#2b3a3a;font:700 13px/1.1 system-ui,sans-serif;box-shadow:0 2px 8px #0008}#dtExit.f{background:#2a1a24ee;color:#ffcf7a;border-color:#ffb347}#dtExit.on{display:block}body.dtMM #stats{margin-bottom:54px}";
    document.head.appendChild(st);
    const b = document.createElement("button"); b.id = "dtExit"; b.type = "button"; b.textContent = "✕ Esci"; b.setAttribute("aria-label", "Esci da Doppio Turno");
    b.onclick = () => { if (inMatch) { const hb = document.getElementById("homeBtn"); if (hb) hb.click(); return; } if (zoneRec()) leave(); };
    document.body.appendChild(b);
    const oc = document.getElementById("ovlCh");
    if (oc) oc.addEventListener("click", (e) => { if (inMatch && e.target && e.target.closest && e.target.closest("button.danger")) { inMatch = false; setTimeout(() => safe(() => api.trExitTo(function () {})), 0); } });
    setInterval(() => {
      const hud = document.getElementById("matchHud"), live = !!(hud && !hud.hidden), zr = zoneRec();
      const on = !!((zr && document.body.classList.contains("borgo")) || (inMatch && live));
      b.classList.toggle("on", on); b.classList.toggle("f", !!(zr && zr.spec.half === "f")); document.body.classList.toggle("dtMM", !!(inMatch && live)); b.textContent = inMatch && live ? "✕ Esci dalla partita" : "✕ Esci";
    }, 400);
  }
  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match || !a.matchPick) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a; start();
  }
  window.__doppioTurno = {
    version: 1, KEY, addChapter, open: openMain, SFX, _has: (n) => !!CHAPTERS[n],
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return { label: "🪞 Doppio Turno", cls: "hot", fn: () => openMain({ onExit: back }), sub: h ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "mistero"} · due metà, un contratto` : "Crea prima il tuo campione · mistero a due metà" };
    },
    endings() { const m = mem(); return Object.keys(ENDINGS).map((k) => ({ id: k, title: ENDINGS[k][0], desc: ENDINGS[k][1], found: m.ends.includes(k) })); },
    info() { const m = mem(); return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), facts: { d: m.facts.d.slice(), f: m.facts.f.slice() }, notes: JSON.parse(JSON.stringify(m.notes)), conf: m.conf, ends: m.ends.slice(), flags: Object.assign({}, m.flags) }; },
    _dbg: /[?&]debug\b/.test(location.search || "") ? { mem, ZONES, CHAPTERS, ZX, go, F, FACTS, NOTES } : undefined,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
