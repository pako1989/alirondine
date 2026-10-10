// ============================================================================
// CHRONO-BREAK · IL TEMPIO DEI TRE TEMPI
// Nuova Saga Temporale & Tattica per il Tuo Campione
// Ispirata a Chrono Trigger, Steins;Gate e Prince of Persia
// Motore 2D Camminabile HD con Orologio di Quarzo, Salto d'Epoca ed Eco Temporale
// ============================================================================
(function () {
  "use strict";
  if (window.__chronoStoryLoaded) return;
  window.__chronoStoryLoaded = true;
  const KEY = "ali-di-rondine.chrono-story";
  const TS = 16;
  let tries = 0, api = null, EXIT = null;
  const CAST_Q = [];
  const COS_Q = [];
  const PENDING = [];

  // ------------------------------------------------------------------ Utilità
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  const arr = (a) => (Array.isArray(a) ? a : []);
  const clampI = (v, a, b, d) => { v = Math.round(+v); return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
  const hash = (s) => {
    let h = 2166136261; s = String(s);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
    return h >>> 0;
  };
  const rnd = (tx, ty, k) => hash(tx * 89 + ty * 149 + k * 31) / 4294967296;

  // ------------------------------------------------------------------ Audio Synthesizer Temporale
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  function sfxChronoTick() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
      g.gain.setValueAtTime(0.35, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.07);
    } catch (e) {}
  }

  function sfxTimeRewind() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [220, 330, 440, 660, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq * 0.5, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 2.2, now + 0.45);
        g.gain.setValueAtTime(0.01, now);
        g.gain.linearRampToValueAtTime(0.2 / (idx + 1), now + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.55);
      });
    } catch (e) {}
  }

  function sfxParadoxWarning() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(125, now + 0.25);
      g.gain.setValueAtTime(0.4, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.35);
    } catch (e) {}
  }

  function sfxFragmentFound() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [587.33, 739.99, 880, 1174.66, 1479.98].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        g.gain.setValueAtTime(0.25, now + i * 0.07);
        g.exponentialRampToValueAtTime(0.005, now + i * 0.07 + 0.35);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.07); osc.stop(now + i * 0.07 + 0.35);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Persistenza e Memoria della Saga
  const FLAG_RE = /^[a-z0-9_]{1,32}$/i;
  const REW_RE = /^[a-z0-9_]{1,32}$/i;
  const ZONE_RE = /^[a-z0-9_]{1,32}$/i;

  function norm(o) {
    o = obj(o);
    const m = {
      ch: clampI(o.ch, 1, 99, 1),
      step: {},
      flags: {},
      rew: {},
      done: {},
      zone: "",
      clues: [],
      log: [],
      intro: {},
      wins: clampI(o.wins, 0, 9999, 0),
      losses: clampI(o.losses, 0, 9999, 0),
      epoch: (typeof o.epoch === "string" && ["alba", "mezzogiorno", "crepuscolo"].includes(o.epoch)) ? o.epoch : "alba"
    };
    Object.keys(obj(o.step)).forEach((k) => { const n = clampI(k, 1, 99, 0); if (n) m.step[n] = clampI(o.step[k], 0, 99, 0); });
    const fl = obj(o.flags);
    let c = 0;
    Object.keys(fl).forEach((k) => {
      if (c >= 240 || !FLAG_RE.test(k)) return;
      const v = fl[k];
      if (typeof v === "boolean" || typeof v === "number" || (typeof v === "string" && v.length <= 40)) {
        m.flags[k] = v; c++;
      }
    });
    Object.keys(obj(o.rew)).forEach((k) => { if (REW_RE.test(k) && Object.keys(m.rew).length < 200) m.rew[k] = 1; });
    const dn = obj(o.done);
    Object.keys(dn).forEach((k) => { const n = clampI(k, 1, 99, 0); if (n && typeof dn[k] === "string") m.done[n] = dn[k].slice(0, 30); });
    m.zone = typeof o.zone === "string" && ZONE_RE.test(o.zone) ? o.zone : "";
    m.clues = [...new Set(arr(o.clues).filter((x) => typeof x === "string"))].slice(0, 50);
    m.log = arr(o.log).filter((x) => typeof x === "string").map((x) => x.slice(0, 240)).slice(-120);
    Object.keys(obj(o.intro)).forEach((k) => { if (FLAG_RE.test(k)) m.intro[k] = 1; });
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
  const note = (txt) => {
    const m = mem();
    if (!m.log.includes(txt)) { m.log.push(txt); if (m.log.length > 120) m.log.shift(); save(); }
  };

  const addClue = (id, name, desc) => {
    const m = mem();
    const key = `${id}:::${name}:::${desc}`;
    if (!m.clues.some((c) => c.startsWith(id + ":::"))) {
      m.clues.push(key); save();
      sfxFragmentFound();
      if (api && api.trToast) api.trToast(`⏳ Frammento di Tempo: ${name}`);
      return true;
    }
    return false;
  };

  const once = (key, fn) => {
    const m = mem();
    if (m.rew[key]) return false;
    m.rew[key] = 1; save(); fn(); return true;
  };

  // ------------------------------------------------------------------ Il Campione
  const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
  const SHOT = {
    saetta: "un dardo di quarzo temporale che anticipa il battito delle ali del tempo",
    serpentina: "un fendente a clessidra che curva curvando lo scorrere dei secondi",
    parabola: "un arcobaleno d'oro che scavalca i secoli precipitando all'incrocio",
    martello: "un impatto sismico capace di arrestare la rotazione dell'ingranaggio",
    traversa: "un rimbalzo matematico programmato nel futuro e calcolato nel passato",
    saudade: "un eco malinconico che attraversa le epoche senza disperdersi",
    muro: "una muraglia di sabbia dorata impenetrabile come il destino"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "CHRONO-BURST", shot: "saetta" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "CHRONO-BURST")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un tiro che attraversa il tempo");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "crononauta", hair: h.hair, style: h.style, skin: h.skin, eye: "#38bdf8",
      bg: ["#082f49", "#0284c7"], shirt: "#0284c7", num: String(h.num), acc: h.acc,
      cap: h.acc === "cappellino" ? "#0284c7" : h.acc === "berretto" ? "#0369a1" : undefined
    };
  }

  const coinsGive = (n) => {
    if (n > 0 && typeof window.addCoins === "function") {
      try { window.addCoins(n); return n; } catch (e) { return 0; }
    }
    return 0;
  };
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

  // ------------------------------------------------------------------ Effetto Grafico Shift Temporale (Chrono-Warp Overlay)
  let chronoFlashActive = false;
  let chronoFlashAlpha = 0;

  function triggerChronoVisualFx(onFinish) {
    chronoFlashActive = true;
    chronoFlashAlpha = 1.0;
    sfxTimeRewind();
    const checkInterval = setInterval(() => {
      chronoFlashAlpha -= 0.05;
      if (chronoFlashAlpha <= 0) {
        chronoFlashAlpha = 0;
        chronoFlashActive = false;
        clearInterval(checkInterval);
        if (typeof onFinish === "function") onFinish();
      }
    }, 30);
  }

  function drawChronoOverlay(g, W, H) {
    if (!chronoFlashActive && chronoFlashAlpha <= 0) return;
    g.save();
    const gr = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, Math.max(W, H));
    gr.addColorStop(0, `rgba(56, 189, 248, ${chronoFlashAlpha * 0.45})`);
    gr.addColorStop(0.5, `rgba(2, 132, 199, ${chronoFlashAlpha * 0.65})`);
    gr.addColorStop(1, `rgba(251, 191, 36, ${chronoFlashAlpha * 0.85})`);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(254, 240, 138, ${chronoFlashAlpha * 0.95})`;
    g.lineWidth = 3;
    g.beginPath();
    g.arc(cx, cy, 32, 0, Math.PI * 2);
    g.stroke();

    const ang = performance.now() * 0.02;
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(ang) * 22, cy + Math.sin(ang) * 22);
    g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(-ang * 1.6) * 16, cy + Math.sin(-ang * 1.6) * 16);
    g.stroke();
    g.restore();
    g.restore();
  }

  // ------------------------------------------------------------------ Sfondi Scenici (320x200 Pixel Art Procedurale)
  function R(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
  function grad(g, x, y, w, h, stops) {
    const gr = g.createLinearGradient(x, y, x, y + h);
    stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s));
    g.fillStyle = gr; g.fillRect(x, y, w, h);
  }
  function glow(g, x, y, r, rgb, a) {
    const gr = g.createRadialGradient(x, y, 1, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},${a})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function bgChronoAlba(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#022c22", "#065f46", "#047857", "#fef08a"]);
    glow(g, 250, 48, 50, "254,240,138", 0.45);
    g.fillStyle = "#fef08a"; g.beginPath(); g.arc(250, 48, 14, 0, 7); g.fill();
    g.fillStyle = "#064e3b";
    g.beginPath();
    g.moveTo(0, 115); g.lineTo(50, 60); g.lineTo(120, 100); g.lineTo(190, 50); g.lineTo(260, 95); g.lineTo(W, 70); g.lineTo(W, 130); g.lineTo(0, 130);
    g.fill();
    R(g, 0, 125, W, 75, "#065f46");
    R(g, 0, 145, W, 55, "#047857");
    for (let i = 0; i < W; i += 28) {
      R(g, i, 120, 10, 35, "#a7f3d0");
      R(g, i - 2, 117, 14, 4, "#6ee7b7");
    }
  }

  function bgChronoMezzogiorno(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#1e3a8a", "#0284c7", "#38bdf8", "#fed7aa"]);
    glow(g, 160, 40, 65, "254,215,170", 0.55);
    g.fillStyle = "#fef08a"; g.beginPath(); g.arc(160, 40, 16, 0, 7); g.fill();
    g.fillStyle = "#0c4a6e";
    g.fillRect(40, 55, 60, 90);
    g.beginPath(); g.arc(70, 55, 30, Math.PI, 0); g.fill();
    g.fillRect(200, 65, 80, 80);
    g.beginPath(); g.arc(240, 65, 40, Math.PI, 0); g.fill();
    R(g, 0, 135, W, 65, "#d97706");
    R(g, 0, 150, W, 50, "#b45309");
  }

  function bgChronoCrepuscolo(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#180828", "#4c1d95", "#831843", "#ea580c"]);
    glow(g, 80, 70, 75, "249,115,22", 0.45);
    g.strokeStyle = "rgba(251,191,36,0.7)"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(80, 20); g.lineTo(130, 60); g.lineTo(110, 110); g.lineTo(170, 140); g.stroke();
    g.fillStyle = "#1e1b4b";
    g.fillRect(30, 85, 45, 65);
    g.fillRect(190, 75, 55, 75);
    R(g, 0, 140, W, 60, "#2e1065");
    R(g, 0, 160, W, 40, "#1f1d36");
  }

  function bgChronoPortale(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#020617", "#0f172a", "#1e1b4b"]);
    const cx = 160, cy = 90;
    glow(g, cx, cy, 60, "56,189,248", 0.6);
    g.fillStyle = "#0284c7"; g.beginPath(); g.arc(cx, cy, 38, 0, 7); g.fill();
    g.fillStyle = "#fef08a"; g.beginPath(); g.arc(cx, cy, 18, 0, 7); g.fill();
    g.strokeStyle = "#38bdf8"; g.lineWidth = 2;
    g.beginPath(); g.arc(cx, cy, 54, 0, 7); g.stroke();
    R(g, 0, 145, W, 55, "#090d16");
    for (let x = 0; x < W; x += 32) {
      R(g, x, 145, 1, 55, "#1e293b");
    }
  }

  // ------------------------------------------------------------------ Motore Grafico 2D Tilemap HD
  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const frNow = () => safe(() => (typeof window.fr === "function" ? window.fr() : performance.now() / 16), 0);

  const ZX = { map: null, id: "", under: null };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || " ";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";

  function makeLayers(w, h) {
    const m = ZX.map, u = Array.from({ length: h }, () => Array(w).fill(","));
    ZX.under = u;
    const put = (x, y, ch, top) => {
      if (m[y] && x >= 0 && x < w && y >= 0 && y < h) { m[y][x] = ch; if (!top) u[y][x] = ch; }
    };
    const lay = (x0, y0, x1, y1, ch, top) => {
      for (let y = Math.max(0, y0); y <= Math.min(h - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(w - 1, x1); x++) put(x, y, ch, top);
    };
    return { lay, put };
  }

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 3);
    if (f === ",") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#d97706" : "#b45309");
      P(sx, sy + 7, 16, 1, "#92400e");
      P(sx + (ty % 2 ? 4 : 11), sy, 1, 7, "#92400e");
      if (r < 0.2) P(sx + 5, sy + 3, 2, 2, "#fde68a");
    } else if (f === "p") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0369a1" : "#0284c7");
      P(sx, sy, 16, 1, "#38bdf8");
      P(sx + 15, sy, 1, 16, "#0c4a6e");
      if ((tx + ty * 3) % 4 === 0) P(sx + 7, sy + 7, 2, 2, "#fef08a");
    } else if (f === "c") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#b45309" : "#d97706");
      P(sx, sy, 16, 1, "#f59e0b");
      if (at(tx - 1, ty) !== "c") P(sx, sy, 2, 16, "#fef08a");
      if (at(tx + 1, ty) !== "c") P(sx + 14, sy, 2, 16, "#fef08a");
    } else if (f === ":") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#2e1065" : "#3b0764");
      P(sx + 4, sy + 5, 2, 2, "#c084fc");
      if (r < 0.25) P(sx + 8, sy + 11, 3, 1, "#f43f5e");
    } else if (f === "w") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#047857" : "#065f46");
      P(sx + 3, sy + 4, 3, 2, "#10b981");
      if (r < 0.2) P(sx + 9, sy + 10, 2, 2, "#6ee7b7");
    } else if (f === "y") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0284c7" : "#0369a1");
      if (tx % 6 === 0) P(sx, sy, 1, 16, "rgba(254, 240, 138, 0.4)");
      if (ty % 6 === 0) P(sx, sy, 16, 1, "rgba(254, 240, 138, 0.4)");
    }
  }

  function gateTile(ch, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty);
    P(sx + 1, sy, 2, 16, "#38bdf8");
    P(sx + 6, sy, 2, 16, "#38bdf8");
    P(sx + 11, sy, 2, 16, "#38bdf8");
    P(sx, sy + 4, 16, 2, "#0369a1");
    P(sx, sy + 12, 16, 2, "#0369a1");
    GP.fillStyle = "#f59e0b"; GP.beginPath();
    if (ch === ">") { GP.moveTo(sx + 6, sy + 5); GP.lineTo(sx + 11, sy + 8); GP.lineTo(sx + 6, sy + 11); }
    else if (ch === "<") { GP.moveTo(sx + 10, sy + 5); GP.lineTo(sx + 5, sy + 8); GP.lineTo(sx + 10, sy + 11); }
    else if (ch === "d") { GP.moveTo(sx + 5, sy + 5); GP.lineTo(sx + 8, sy + 11); GP.lineTo(sx + 11, sy + 5); }
    else { GP.moveTo(sx + 5, sy + 11); GP.lineTo(sx + 8, sy + 5); GP.lineTo(sx + 11, sy + 11); }
    GP.fill();
  }

  const PAINT = {
    A(sx, sy, tx, ty) {
      P(sx, sy, 16, 16, "#1e1b4b");
      P(sx, sy + 5, 16, 1, "#0f172a");
      P(sx, sy + 11, 16, 1, "#0f172a");
      P(sx + ((hash(tx * 5 + ty) % 7) + 2), sy, 1, 5, "#0f172a");
      if (at(tx, ty - 1) !== "A") P(sx, sy, 16, 2, "#f59e0b");
    },
    B(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 2, sy + 7, 12, 8, "#0284c7");
      const fl = Math.sin(fr / 8 + tx * 3 + ty) * 1.5;
      GP.fillStyle = "#38bdf8";
      GP.beginPath(); GP.arc(sx + 8, sy + 5, 5 + fl * 0.4, 0, 7); GP.fill();
      GP.fillStyle = "#fef08a";
      P(sx + 7, sy + 4, 2, 2, "#fef08a");
    },
    O(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      const cx = sx + 8, cy = sy + 8;
      const ang = (fr * 0.05 + tx * 2 + ty) % (Math.PI * 2);
      GP.strokeStyle = "#f59e0b"; GP.lineWidth = 2;
      GP.beginPath(); GP.arc(cx, cy, 6, 0, 7); GP.stroke();
      GP.beginPath();
      GP.moveTo(cx + Math.cos(ang) * 7, cy + Math.sin(ang) * 7);
      GP.lineTo(cx - Math.cos(ang) * 7, cy - Math.sin(ang) * 7);
      GP.stroke();
    },
    T(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 1, sy + 3, 14, 10, "#0369a1");
      P(sx + 1, sy + 3, 14, 2, "#38bdf8");
      P(sx + 2, sy + 13, 2, 3, "#0c4a6e");
    },
    P(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 4, sy + 1, 8, 2, "#f59e0b");
      P(sx + 4, sy + 13, 8, 2, "#f59e0b");
      P(sx + 5, sy + 3, 6, 10, "rgba(56,189,248,0.7)");
      P(sx + 7, sy + 7, 2, 3, "#fef08a");
    }
  };

  function drawTile(ch, sx, sy, tx, ty) {
    const fr = frNow();
    if (["<", ">", "d", "u"].includes(ch)) { gateTile(ch, sx, sy, tx, ty); return true; }
    if (PAINT[ch]) { PAINT[ch](sx, sy, tx, ty, fr); return true; }
    floorPaint(ch, sx, sy, tx, ty);
    return true;
  }

  // ------------------------------------------------------------------ Sistema Zone e Capitoli
  const CHAPTERS = {};
  const ZONES = {};

  function addChapter(fn) {
    const ch = {
      n: 0, title: "", sub: "", goal: null,
      zones: {}, act: {}, obj: {}, talk: {}
    };
    const chObj = {
      setMeta: (n, title, sub) => { ch.n = n; ch.title = title; ch.sub = sub; },
      setGoal: (fnGoal) => { ch.goal = fnGoal; },
      cast: (id, c, bio) => {
        if (!api) { CAST_Q.push([id, c, bio]); return; }
        if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c);
        if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio;
      },
      cos: (id, d) => {
        if (!api) { COS_Q.push([id, d]); return; }
        if (api.COSM && !api.COSM[id]) api.COSM[id] = d;
      },
      act: (key, desc) => { ch.act[key] = desc; },
      obj: (key, fnObj) => { ch.obj[key] = fnObj; },
      talk: (id, fnTalk) => { ch.talk[id] = fnTalk; },
      XTOOLS
    };
    fn(chObj);
    if (chObj.zones) ch.zones = chObj.zones;
    ["talk", "obj", "act"].forEach((k) => { if (chObj[k] && typeof chObj[k] === "object") ch[k] = chObj[k]; });
    CHAPTERS[ch.n] = ch;
    registerChapterZones(ch);
  }

  function activeChapter() {
    const m = mem();
    return CHAPTERS[m.ch] || CHAPTERS[1];
  }

  function registerChapterZones(ch) {
    if (!api || !api.TRZ) { PENDING.push(ch); return; }
    Object.keys(ch.zones || {}).forEach((zid) => registerZone(zid, ch.n, ch.zones[zid]));
  }

  function registerZone(zid, chN, spec) {
    const Z = {
      id: zid, name: spec.name, short: spec.short || spec.name, sub: spec.sub || "",
      w: spec.w, h: spec.h, start: spec.start || [2, 2], theme: spec.theme || "torino",
      bg: spec.bg || "chr_alba", item: spec.item || ["Clessidra", "Clessidre"],
      items: spec.items || [], areas: spec.areas || [], npcs: [],
      act: spec.act || {},
      hints: typeof spec.hints === "function" ? spec.hints : () => spec.hints || {}
    };
    Z.build = function (m) {
      ZX.map = m; ZX.id = zid; GP = document.getElementById("cv").getContext("2d");
      const Ls = makeLayers(spec.w, spec.h);
      Ls.lay(0, 0, spec.w - 1, spec.h - 1, ",");
      spec.build(Ls);
      setTimeout(() => safe(refreshZone), 0);
    };
    Z.tile = function (ch, sx, sy, tx, ty) {
      GP = GP || document.getElementById("cv").getContext("2d");
      return drawTile(ch, sx, sy, tx, ty);
    };
    const dd = (cx, cy) => ({ X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow() });
    Z.decor = function (cx, cy) { if (spec.decor) spec.decor(cx, cy, dd(cx, cy)); };
    Z.top = function (cx, cy) {
      if (spec.top) spec.top(cx, cy, dd(cx, cy));
      if (chronoFlashActive || chronoFlashAlpha > 0) {
        const cv = document.getElementById("cv");
        if (cv) drawChronoOverlay(cv.getContext("2d"), cv.width, cv.height);
      }
    };
    Z.onObj = function (ch, tx, ty) {
      const c = activeChapter();
      if (!c || !c.obj) return false;
      const fn = c.obj[zid + ":" + ch + ":" + tx + "," + ty] || c.obj[zid + ":" + ch] || c.obj[ch];
      if (!fn) return false;
      fn({ ch, tx, ty, zid });
      return true;
    };
    Z.menu = () => zoneMenu();
    api.TRZ[zid] = Z;
    ZONES[zid] = { ch: chN, spec, Z };
  }

  const zoneRec = () => (api && api.trZone && ZONES[api.trZone()]) || null;
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "chr_alba";

  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch] || activeChapter();
    castHero();
    const list = zr.spec.npcs ? zr.spec.npcs(stepOf(c.n)) : [];
    zr.Z.npcs = list.filter((n) => CAST_OK(n.id)).map((n) => (n.at ? n : { ...n, at: [n.x, n.y] }));
  }

  const CAST_OK = (id) => !!(api && api.CAST && api.CAST[id]);

  let UITOK = 0;
  function say(lines, then) {
    if (!Array.isArray(lines) || !lines.length) { if (typeof then === "function") then(); return; }
    castHero();
    const bg = bgNow();
    const tok = ++UITOK;
    api.trSay(lines.map((l) => api.L(l[0] === "hero" ? "hero" : l[0], T(l[1]), l[2] || bg)), () => {
      if (typeof then !== "function" || then === done) { done(); return; }
      then();
      if (UITOK === tok && !inMatch) done();
    });
  }

  function ask(who, prompt, opts, bg) {
    UITOK++;
    castHero();
    api.trAsk(
      who, T(prompt),
      (opts || []).map((o) => ({ label: o.label, sub: o.sub, cls: o.cls, fn: o.fn })),
      bg || bgNow()
    );
  }

  function done() {
    if (api && api.trResume) api.trResume();
  }

  function go(zid, tx, ty) {
    const zr = ZONES[zid]; if (!zr) return;
    const m = mem(); m.zone = zid; save();
    castHero();
    if (api && api.trRec) api.trRec().seen[zid] = true;
    if (api && api.trGo) api.trGo(zid);
    if (Number.isFinite(tx) && Number.isFinite(ty)) {
      const B = api.borgoLoad ? api.borgoLoad() : null;
      if (B) { B.x = tx * TS + 8; B.y = ty * TS + 12; if (api.borgoSave) api.borgoSave(); }
    }
    refreshZone();
  }

  const goalNow = () => {
    const c = activeChapter();
    return c && c.goal ? T(c.goal(stepOf(c.n))) : "";
  };

  function leave() {
    const back = EXIT || window.title;
    EXIT = null;
    api.trExitTo(typeof back === "function" ? back : null);
  }

  function zoneMenu() {
    const c = activeChapter(), h = hero();
    api.trAsk(
      "voce",
      `<b>Chrono-Break · Il Tempio dei Tre Tempi</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Monete ${bal()} · Frammenti ${mem().clues.length}${h ? " · " + esc(h.name) : ""}</span>`,
      [
        { label: "Diario del Crononauta", sub: "Frammenti temporali, linee temporali e paradossi", cls: "hot", fn: () => notebook(zoneMenu, true) },
        { label: "Esci dal Tempio", sub: "I progressi restano salvati", cls: "hot", fn: leave }
      ],
      bgNow()
    );
  }

  function notebook(back, inZone) {
    const m = mem(), h = hero() || { name: "Campione", num: 9, shotName: "", shot: "saetta" };
    const cluesRows = m.clues.map((c) => {
      const parts = c.split(":::");
      return `• <b>${esc(parts[1] || "Frammento")}</b>: <span style="color:var(--dim)">${esc(parts[2] || "")}</span>`;
    }).join("<br>") || "<span style='color:var(--dim)'>Nessun frammento ancora recuperato. Esplora il Tempio e interagisci con le clessidre.</span>";

    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} (Crononauta della Rondine)<br><span style="color:var(--dim)">Tiro Risvegliato: «${esc(h.shotName || "CHRONO-BURST")}»</span><br><br><b>Frammenti del Tempo Acquisiti</b><br>${cluesRows}<br><br><span style="color:var(--dim)">Vittorie nel Flusso: ${m.wins} · Sconfitte: ${m.losses}</span>`;
    if (inZone) {
      api.trAsk("voce", html, [{ label: "◂ Torna a esplorare", fn: done }], bgNow());
    } else {
      api.scene(bgNow(), "voce", html, [{ label: "◂ Indietro", fn: back }], "Chrono-Break · Diario");
    }
  }

  // ------------------------------------------------------------------ Partita sul Campo con Eco Temporale
  let inMatch = false;
  const VENUE_CHR = { ads: [["SANTUARIO DEL TEMPO", "#0284c7"], ["ANELLO DI QUARZO", "#f59e0b"], ["PARADOSSO ZERO", "#7c3aed"], ["IL REGNO DEI TRAMONTI", "#ea580c"]], crowd: ["#0284c7", "#f59e0b", "#7c3aed", "#1e293b", "#38bdf8"], tint: "rgba(2,132,199,.25)", glow: "56,189,248" };

  function playMatch(o) {
    castHero(); inMatch = true;
    api.matchPick({
      alt: o.alt, oppNames: o.oppNames, squad: o.squad, azPitch: o.azPitch, cageMut: o.cageMut, cageTarget: o.cageTarget, homeKit: o.homeKit, cageField: o.cageField,
      id: o.id, chap: o.chap, intro: T(o.intro), mate: o.mate || "Aria", mateGeneric: true,
      us: o.us || "I Custodi del Tempo", min: o.min || 45, team: o.team, venue: o.venue || VENUE_CHR, hero: undefined,
      onDone: (r) => {
        inMatch = false;
        const m = mem();
        if (r.win) m.wins++; else if (r.a < r.b) m.losses++;
        save(); refreshZone(); o.done(r);
      }
    });
  }

  function finishChapter(n, ending) {
    const m = mem();
    m.done[n] = String(ending || "ok").slice(0, 30);
    if (m.ch <= n) m.ch = n + 1;
    save();
  }

  // ------------------------------------------------------------------ Modulo Eco Temporale & Meccanica Partita Inedita
  const CHRONO_STATE = {
    active: false,
    history: [], // buffer posizioni [x, y] di 2 secondi
    echoPlayer: null,
    slowdownTime: 0,
    burstCharges: 3
  };

  window.chronoAzTick = function (A) {
    if (!A || !inMatch) return;
    const l = (typeof window.azMe === "function") ? window.azMe(A) : A.us[0];
    if (!l) return;
    
    // Registra scia storica ogni 3 frame per 120 frame (~2 secondi a 60fps)
    if (A.t % 3 === 0) {
      CHRONO_STATE.history.push({ x: l.x, y: l.y, t: A.t });
      if (CHRONO_STATE.history.length > 40) CHRONO_STATE.history.shift();
    }

    // Effetto rallentamento se attivo
    if (CHRONO_STATE.slowdownTime > 0) {
      CHRONO_STATE.slowdownTime--;
      if (A.ball && !A.owner) {
        A.ball.vx *= 0.94;
        A.ball.vy *= 0.94;
      }
    }
  };

  window.chronoAzDrawEffects = function (A, g, W, H) {
    if (!A || !inMatch) return;
    
    // Disegna scia di eco temporale (fantasma del passato)
    if (CHRONO_STATE.history.length >= 10) {
      const past = CHRONO_STATE.history[0];
      g.save();
      g.strokeStyle = "rgba(56, 189, 248, 0.45)";
      g.fillStyle = "rgba(56, 189, 248, 0.25)";
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(past.x, past.y, 8, 0, Math.PI * 2);
      g.fill();
      g.stroke();
      g.font = "bold 7px sans-serif";
      g.textAlign = "center";
      g.fillStyle = "#38bdf8";
      g.fillText("ECO PASSATO", past.x, past.y - 10);
      g.restore();
    }

    // Indicatore Clessidra HUD in alto
    g.save();
    g.fillStyle = "rgba(2, 132, 199, 0.85)";
    g.strokeStyle = "#fef08a";
    g.lineWidth = 1;
    g.fillRect(W / 2 - 40, H - 24, 80, 16);
    g.strokeRect(W / 2 - 40, H - 24, 80, 16);
    g.fillStyle = "#fff";
    g.font = "bold 8px sans-serif";
    g.textAlign = "center";
    g.fillText("CHRONO-BREAK", W / 2, H - 13);
    g.restore();
  };

  // ------------------------------------------------------------------ Cassetta degli Attrezzi XTOOLS
  const XTOOLS = {
    get api() { return api; }, TS, T, esc, hash, rnd, safe, F, mem, save, stepOf, setStep, note, once,
    reward: (key, o) => {
      const m = mem();
      if (m.rew[key]) return [];
      m.rew[key] = 1; save();
      const msgs = [];
      if (o && o.coins) { coinsGive(o.coins); msgs.push(`+${o.coins} monete d'oro`); }
      return msgs;
    },
    coinsGive, bal, hero, castHero, say, ask, done, go, playMatch, finishChapter,
    addClue, triggerChronoVisualFx, sfxChronoTick, sfxTimeRewind, sfxParadoxWarning, sfxFragmentFound,
    P: (x, y, w, h, c) => P(x, y, w, h, c), glow, grad, floorPaint, drawTile, makeLayers,
    frNow, refreshZone, bgNow,
    zone: registerZone,
    cast: (id, c, bio) => {
      if (!api) { CAST_Q.push([id, c, bio]); return; }
      if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c);
      if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio;
    },
    cos: (id, d) => {
      if (!api) { COS_Q.push([id, d]); return; }
      if (api.COSM && !api.COSM[id]) api.COSM[id] = d;
    }
  };

  // ============================================================================
  // CAPITOLO 1 · IL RISVEGLIO ALL'ALBA & L'OROLOGIO DI QUARZO
  // ============================================================================
  addChapter(function (chObj) {
    const X = XTOOLS;
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addClue, triggerChronoVisualFx } = X;
    const N = 1, S = () => X.stepOf(N);

    // Cast Personaggi Capitolo 1
    chObj.cast("chr_aria", {
      name: "Aria", tag: "cronista", hair: "#0284c7", style: "bob", skin: "#f6ede2", eye: "#38bdf8",
      bg: ["#020617", "#0284c7"], shirt: "#f8fafc"
    }, "La Guardiana dell'Orologio Solare. Ha atteso per secoli che il Campione prescelto attraversasse la frattura.");

    chObj.cast("chr_elias", {
      name: "Mastro Elias", tag: "orologiaio", hair: "#94a3b8", style: "bald", skin: "#e2e8f0", eye: "#f59e0b",
      beard: true, bg: ["#1e1b4b", "#f59e0b"], shirt: "#334155"
    }, "L'antico artigiano che forgiò la Clessidra di Quarzo con sabbie strappate alle stelle cadenti.");

    chObj.cast("chr_guardiano_alba", {
      name: "Solon", tag: "campione_antico", hair: "#d97706", style: "spiky", skin: "#fed7aa", eye: "#ea580c",
      bg: ["#047857", "#d97706"], shirt: "#047857"
    }, "Capitano dei Primi Pionieri dell'Alba. Custode della prima prova sul campo da gioco sacro.");

    chObj.setMeta(1, "Il Risveglio all'Alba", "La Frattura del Tempo e la Clessidra di Quarzo");
    chObj.setGoal((s) => {
      if (s === 0) return "Parla con Aria davanti all'Orologio Solare";
      if (s === 1) return "Raggiungi l'Officina di Mastro Elias a est e ripara la Clessidra";
      if (s === 2) return "Esamina la Clessidra Monumentale al centro della radura";
      if (s === 3) return "Sfida Solon e i Pionieri dell'Alba nell'Antico Stadio";
      return "Il portale verso il Mezzogiorno è aperto! Avanza al Capitolo 2.";
    });

    chObj.zones = {
      // 1. Il Santuario dell'Alba (Radura Sacra)
      chr_santuario_alba: {
        name: "Valle d'Ambra · Il Santuario dell'Alba", short: "Santuario dell'Alba", sub: "La radura intatta prima del Cataclisma",
        w: 36, h: 26, start: [18, 13], theme: "torino", bg: "chr_alba",
        item: ["Sabbia di Quarzo", "Sabbie"],
        items: [[5, 6], [30, 6], [18, 20]],
        areas: [
          [2, 2, 33, 8, "L'Orologio Monumentale"],
          [2, 10, 33, 23, "Il Prato dei Pionieri"]
        ],
        act: {
          O: "Esamina l'antico ingranaggio di bronzo",
          P: "Tocca la Clessidra Sacra",
          ">": "Vai all'Officina dell'Orologiaio (Est)",
          "d": "Raggiungi l'Antico Stadio (Sud)"
        },
        build(Ls) {
          Ls.lay(0, 0, 35, 1, "A");
          Ls.lay(0, 0, 1, 24, "A");
          Ls.lay(34, 0, 35, 24, "A");
          Ls.lay(0, 23, 35, 24, "A");
          Ls.lay(2, 2, 33, 22, "w");
          Ls.lay(17, 3, 18, 22, "c");
          Ls.put(17, 4, "O"); Ls.put(18, 4, "O");
          Ls.put(17, 8, "P"); Ls.put(18, 8, "P");
          [[6, 6], [29, 6], [6, 18], [29, 18]].forEach(([bx, by]) => Ls.put(bx, by, "B"));
          Ls.put(34, 13, ">"); Ls.put(34, 14, ">");
          Ls.put(17, 23, "d"); Ls.put(18, 23, "d");
        },
        npcs(s) {
          const list = [{ id: "chr_aria", at: [17, 10] }];
          return list;
        }
      },

      // 2. L'Officina dell'Orologiaio
      chr_officina_elias: {
        name: "Valle d'Ambra · L'Officina di Elias", short: "Officina di Elias", sub: "Ingranaggi, molle di bronzo e mappe stellari",
        w: 32, h: 24, start: [3, 12], theme: "torino", bg: "chr_alba",
        item: ["Molla Astrale", "Molle"],
        items: [[10, 5], [22, 5]],
        act: {
          T: "Consulta il banco da lavoro di Elias",
          O: "Osserva la molla armonica",
          "<": "Torna al Santuario (Ovest)"
        },
        build(Ls) {
          Ls.lay(0, 0, 31, 1, "A");
          Ls.lay(0, 0, 1, 22, "A");
          Ls.lay(30, 0, 31, 22, "A");
          Ls.lay(0, 21, 31, 22, "A");
          Ls.lay(2, 2, 29, 20, ",");
          Ls.lay(12, 6, 20, 8, "T");
          Ls.put(16, 4, "O");
          Ls.put(1, 12, "<"); Ls.put(1, 13, "<");
        },
        npcs(s) {
          return [{ id: "chr_elias", at: [16, 10] }];
        }
      },

      // 3. L'Antico Stadio dell'Alba
      chr_stadio_alba: {
        name: "Valle d'Ambra · Il Prato dei Pionieri", short: "Stadio dell'Alba", sub: "Il campo verde dove nacque il primo calcio",
        w: 38, h: 26, start: [19, 4], theme: "torino", bg: "chr_alba",
        item: ["Gemma d'Erba", "Gemme"],
        items: [[5, 12], [32, 12]],
        act: {
          u: "Torna al Santuario dell'Alba (Nord)"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "A");
          Ls.lay(0, 0, 1, 24, "A");
          Ls.lay(36, 0, 37, 24, "A");
          Ls.lay(0, 23, 37, 24, "A");
          Ls.lay(2, 2, 35, 22, "w");
          Ls.lay(4, 6, 33, 18, "y");
          Ls.put(18, 1, "u"); Ls.put(19, 1, "u");
        },
        npcs(s) {
          return [{ id: "chr_guardiano_alba", at: [19, 12] }];
        }
      }
    };

    // Dialoghi e Azioni con i PNG
    chObj.talk = {
      chr_aria() {
        const s = S();
        if (s === 0) {
          say([
            ["chr_aria", "Ti sei svegliato finalmente, {n}! Non avere paura: non sei più nel tuo secolo. Quel tuo tiro speciale ha incrinato la membrana del tempo."],
            ["hero", "Dove mi trovo? E perché la luce del sole sembra non muoversi?"],
            ["chr_aria", "Sei nella Valle d'Ambra, diecimila albe prima della fondazione della Rondine. Il tempo qui si è arrestato in un anello di 24 ore. Per ripartire, devi raccogliere i tre Frammenti dell'Orologio."],
            ["chr_aria", "Vai da Mastro Elias nell'Officina a est. Ti consegnerà il primo frammento e incastonerà la Clessidra al tuo polso!"]
          ], () => {
            setStep(N, 1);
            addClue("c1_aria", "La Frattura del Tempo", "Aria rivela che il tiro speciale del Campione ha squarciato il flusso temporale.");
          });
        } else if (s === 1) {
          say([
            ["chr_aria", "L'officina di Mastro Elias è subito a destra attraverso l'arcata. Non fargli perdere tempo: gli orologiai sono permalosi."]
          ], done);
        } else if (s === 2) {
          say([
            ["chr_aria", "Ora tocca la grande Clessidra d'Oro al centro del Santuario per sincronizzare la tua eco temporale!"]
          ], done);
        } else {
          say([
            ["chr_aria", "I Pionieri ti aspettano nello stadio a sud. Dimostra a Solon che la forza del futuro può salvare il passato!"]
          ], done);
        }
      },

      chr_elias() {
        const s = S();
        if (s === 1) {
          say([
            ["chr_elias", "Per tutti gli ingranaggi celesti! Quel ragazzo è arrivato davvero dal futuro! Mostrami le mani... sì, hai la rotazione perfetta nei polsi."],
            ["chr_elias", "Ecco la Clessidra di Quarzo. Quando calci, una scia della tua eco rimarrà impressa nel campo per 2 secondi. Potrai usarla per scambiare la palla al volo!"],
            ["hero", "Un compagno generato dal mio stesso passato? Straordinario."],
            ["chr_elias", "Prendi questo frammento. Ora torna da Aria e tocca la Clessidra monumentale al Santuario per attivare la risonanza!"]
          ], () => {
            setStep(N, 2);
            addClue("c1_clessidra", "La Clessidra di Quarzo", "Permette al Campione di generare echi di se stesso sul campo.");
            triggerChronoVisualFx();
          });
        } else {
          say([
            ["chr_elias", "Gli ingranaggi non mentono mai. Ricordati: se alteri il passato senza purificare l'eco, il paradosso divorerà la Valle!"]
          ], done);
        }
      },

      chr_guardiano_alba() {
        const s = S();
        if (s === 3) {
          ask("chr_guardiano_alba", "Io sono Solon, primo capitano della Valle d'Ambra! Chi dice di venire dal futuro deve dimostrarlo col cuoio tra i piedi. Sei pronto per la Sfida dell'Alba?", [
            { label: "⚽ Scendi in Campo contro i Pionieri", cls: "hot", fn: startMatchAlba },
            { label: "Ho bisogno di un momento", fn: done }
          ]);
        } else if (s > 3) {
          say([
            ["chr_guardiano_alba", "Hai sconfitto i nostri migliori difensori! La tua eco temporale è formidabile. Il portale verso l'Era del Mezzogiorno ti attende al Santuario."]
          ], done);
        } else {
          say([
            ["chr_guardiano_alba", "Prima di sfidarmi devi sintonizzare la Clessidra di Quarzo al Santuario."]
          ], done);
        }
      }
    };

    // Interazioni oggetti
    chObj.obj = {
      "chr_santuario_alba:P"(e) {
        const s = S();
        if (s === 2) {
          triggerChronoVisualFx(() => {
            say([
              ["voce", "La Clessidra Monumentale risuona con il tuo orologio da polso! Un'onda di pura luce dorata avvolge {n}."],
              ["hero", "Sento l'energia del tempo scorrere nei piedi... Posso scattare e vedere il mio passato!"],
              ["voce", "La via verso l'Antico Stadio a Sud è aperta. Raggiungi Solon!"]
            ], () => {
              setStep(N, 3);
              addClue("c1_sintonizzazione", "Risonanza dell'Alba", "La Clessidra è ora sintonizzata al battito del Campione.");
            });
          });
        } else {
          say([["voce", "Una monumentale clessidra scolpita nel quarzo puro. La sabbia dorata all'interno scorre dal basso verso l'alto!"]], done);
        }
      },
      "chr_santuario_alba:O"(e) {
        say([["voce", "Un gigantesco ingranaggio di bronzo celestiale. Segna l'ora zero dell'Alba Perpetua."]], done);
      },
      "chr_santuario_alba:>"(e) { go("chr_officina_elias", 3, 12); },
      "chr_officina_elias:<"(e) { go("chr_santuario_alba", 32, 13); },
      "chr_santuario_alba:d"(e) { go("chr_stadio_alba", 18, 3); },
      "chr_stadio_alba:u"(e) { go("chr_santuario_alba", 18, 21); }
    };

    function startMatchAlba() {
      playMatch({
        id: "chr_match_1",
        alt: "az",
        azPitch: "erba",
        chap: "Chrono-Break · Il Duello dei Pionieri dell'Alba",
        us: "I Viaggiatori del Tempo",
        mate: "Aria",
        min: 45,
        intro: "Prima partita temporale! Il tuo Campione {n} e Aria affrontano i Pionieri dell'Alba guidati da Solon. Sfrutta l'Eco Temporale!",
        team: (t, st) => ({
          name: "I Pionieri dell'Alba",
          color: "#047857",
          defs: [["Kaelen del Prato", t(st.drib * 0.85)], ["Goran il Muro", t(st.drib * 0.9)], ["Tarek l'Antico", t(st.drib * 0.88)]],
          atk: [["Solon il Rapido", t(st.tiro * 0.92)], ["Mirko l'Ala", t(st.vel * 0.88)]],
          gk: ["Orion il Sole", t(st.tiro * 0.95)],
          power: t(st.tiro * 0.85),
          special: ["TIRO DELL'ALBA RADIANTE", t(st.tiro * 1.1)]
        }),
        done: (r) => {
          if (r.win) {
            const rw = reward("chr_ch1_win", { coins: 35 });
            say([
              ["chr_guardiano_alba", "Incredibile... Il tuo tiro ha scavalcato la nostra linea difensiva come un fulmine fuori dal tempo! Meriti la nostra stima."],
              ["chr_aria", "Ce l'abbiamo fatta, {n}! Il primo Sigillo è infranto. L'Orologio monumentale sta aprendo il varco verso il Mezzogiorno dell'Oro!"],
              ["voce", `CAPITOLO 1 COMPLETATO! ${rw.join(" · ")}. Preparati per il Capitolo 2!`]
            ], () => {
              finishChapter(1, "alba_completata");
              setStep(N, 4);
              go("chr_santuario_alba", 18, 13);
            });
          } else {
            say([
              ["chr_guardiano_alba", "I nostri difensori sono abituati a correre fin dall'origine dei tempi. Riprova: sintonizza i tuoi passi con l'eco!"]
            ], done);
          }
        }
      });
    }
  });

  // ============================================================================
  // CAPITOLO 2 · IL MEZZOGIORNO DELL'ORO & IL CAVALIERE SENZA VOLTO
  // ============================================================================
  addChapter(function (chObj) {
    const X = XTOOLS;
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addClue, triggerChronoVisualFx } = X;
    const N = 2, S = () => X.stepOf(N);

    chObj.cast("chr_re_aurelio", {
      name: "Re Aurelio", tag: "sovrano", hair: "#fbbf24", style: "long", skin: "#fed7aa", eye: "#78350f",
      bg: ["#1e3a8a", "#fbbf24"], shirt: "#d97706"
    }, "Signore del Secolo d'Oro della Valle. Crede che la prosperità del suo regno durerà per sempre, ignorando i presagi del Cataclisma.");

    chObj.cast("chr_cavaliere_nero", {
      name: "Il Cavaliere del Tempo", tag: "misterioso", hair: "#0f172a", style: "spiky", skin: "#e2e8f0", eye: "#ef4444",
      bg: ["#020617", "#ef4444"], shirt: "#18181b"
    }, "Un guerriero d'ebano con la maglia numero {num}. Calcia esattamente con lo stesso stile di {n} e conosce ogni sua finta!");

    chObj.setMeta(2, "Il Mezzogiorno dell'Oro", "Il Re del Sole e l'Ombra del Cavaliere Senza Volto");
    chObj.setGoal((s) => {
      if (s === 0) return "Presentati a Re Aurelio nella Sala del Trono d'Oro";
      if (s === 1) return "Indaga sul Cavaliere Misterioso avvistato nei sotterranei";
      if (s === 2) return "Recupera il Frammento di Mezzogiorno nella Sala delle Mappe";
      if (s === 3) return "Affronta la Guardia d'Oro del Re nel Gran Colosseo";
      return "Il portale verso il Crepuscolo del Cataclisma è accessibile!";
    });

    chObj.zones = {
      // 1. La Sala del Trono Solare
      chr_trono_oro: {
        name: "Valle d'Ambra · Il Palazzo del Mezzogiorno", short: "Trono Solare", sub: "I marmi splendenti del secolo d'oro",
        w: 36, h: 26, start: [18, 22], theme: "torino", bg: "chr_mezzogiorno",
        item: ["Lingotto Solare", "Lingotti"],
        items: [[6, 6], [29, 6]],
        act: {
          W: "Ammira il Trono dell'Oro Solare",
          T: "Esamina il registro degli tributi del Re",
          ">": "Accedi alla Sala delle Mappe (Est)",
          "d": "Raggiungi il Gran Colosseo (Sud)"
        },
        build(Ls) {
          Ls.lay(0, 0, 35, 1, "A");
          Ls.lay(0, 0, 1, 24, "A");
          Ls.lay(34, 0, 35, 24, "A");
          Ls.lay(0, 23, 35, 24, "A");
          Ls.lay(2, 2, 33, 22, "p");
          Ls.lay(17, 3, 18, 22, "c");
          Ls.put(17, 3, "W"); Ls.put(18, 3, "W");
          Ls.put(34, 12, ">"); Ls.put(34, 13, ">");
          Ls.put(17, 23, "d"); Ls.put(18, 23, "d");
        },
        npcs(s) {
          const list = [{ id: "chr_re_aurelio", at: [18, 6] }];
          if (s >= 1) list.push({ id: "chr_aria", at: [14, 12] });
          return list;
        }
      },

      // 2. La Sala delle Mappe Temporali
      chr_mappe_temporali: {
        name: "Valle d'Ambra · Sala delle Mappe", short: "Sala delle Mappe", sub: "Rotte temporali e simulazioni celesti",
        w: 32, h: 24, start: [3, 12], theme: "torino", bg: "chr_mezzogiorno",
        item: ["Astrolabio d'Oro", "Astrolabi"],
        items: [[16, 4]],
        act: {
          T: "Consulta la mappa dell'Eclisse",
          P: "Raccogli il Frammento di Mezzogiorno",
          "<": "Torna alla Sala del Trono (Ovest)"
        },
        build(Ls) {
          Ls.lay(0, 0, 31, 1, "A");
          Ls.lay(0, 0, 1, 22, "A");
          Ls.lay(30, 0, 31, 22, "A");
          Ls.lay(0, 21, 31, 22, "A");
          Ls.lay(2, 2, 29, 20, "p");
          Ls.lay(12, 6, 20, 8, "T");
          Ls.put(16, 4, "P");
          Ls.put(1, 12, "<"); Ls.put(1, 13, "<");
        },
        npcs(s) {
          if (s === 1) return [{ id: "chr_cavaliere_nero", at: [16, 12] }];
          return [];
        }
      },

      // 3. Il Gran Colosseo Solare
      chr_colosseo_solare: {
        name: "Valle d'Ambra · Il Gran Colosseo", short: "Gran Colosseo", sub: "La monumentale arena dorata del mezzogiorno",
        w: 40, h: 28, start: [20, 4], theme: "torino", bg: "chr_mezzogiorno",
        item: ["Alloro d'Oro", "Allori"],
        items: [[6, 14], [34, 14]],
        act: {
          u: "Torna al Palazzo del Mezzogiorno (Nord)"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "A");
          Ls.lay(0, 0, 1, 26, "A");
          Ls.lay(38, 0, 39, 26, "A");
          Ls.lay(0, 25, 39, 26, "A");
          Ls.lay(2, 2, 37, 24, "p");
          Ls.lay(4, 6, 35, 20, "y");
          Ls.put(19, 1, "u"); Ls.put(20, 1, "u");
        },
        npcs(s) {
          return [{ id: "chr_re_aurelio", at: [20, 12] }];
        }
      }
    };

    chObj.talk = {
      chr_re_aurelio() {
        const s = S();
        if (s === 0) {
          say([
            ["chr_re_aurelio", "Chi osa presentarsi al cospetto di Re Aurelio senza un dono d'oro massiccio? Ah... il viaggiatore profetizzato da Aria."],
            ["hero", "Maestà, il vostro mezzogiorno non durerà per sempre. Le crepe nel cielo annunciano il Crepuscolo del Cataclisma!"],
            ["chr_re_aurelio", "(Ride sonoramente) Cataclisma? La Valle d'Ambra è eterna! Tuttavia... c'è un'ombra che inquieta le mie guardie. Un cavaliere vestito di nero con il tuo stesso numero di maglia è stato visto nella Sala delle Mappe a est."],
            ["chr_re_aurelio", "Trovalo e scopri le sue intenzioni, e ti permetterò di calcare il Gran Colosseo!"]
          ], () => {
            setStep(N, 1);
            addClue("c2_re", "L'Arroganza del Mezzogiorno", "Re Aurelio nega il Cataclisma ma teme il Cavaliere Nero.");
          });
        } else if (s === 3) {
          ask("chr_re_aurelio", "Il Gran Colosseo è gremito! I miei campioni d'oro vogliono vedere se la tua eco temporale può superare la muraglia del sole!", [
            { label: "⚽ Inizia la Partita nel Gran Colosseo", cls: "hot", fn: startMatchMezzogiorno },
            { label: "Un attimo di concentrazione", fn: done }
          ]);
        } else {
          say([
            ["chr_re_aurelio", "Risolvi il mistero dell'ombra a est, crononauta."]
          ], done);
        }
      },

      chr_cavaliere_nero() {
        say([
          ["chr_cavaliere_nero", "(La sua voce è distorta da un'eco metallica agghiacciante) Guardati, {n}... Sei ancora così giovane e ingenuo. Credi davvero che basti calciare bene per cambiare il destino?"],
          ["hero", "Chi sei?! Come fai a conoscere il mio nome e a indossare la mia stessa maglia numero {num}?"],
          ["chr_cavaliere_nero", "Io sono te. O meglio... ciò che resterà di te dopo che avrai visto morire la Valle. Fermati finché sei in tempo, o il paradosso ci distruggerà entrambi!"],
          ["voce", "Il Cavaliere Nero scompare in un vortice di sabbia oscura, lasciando a terra il Frammento di Mezzogiorno!"]
        ], () => {
          setStep(N, 2);
          addClue("c2_paradosso", "L'Identità del Cavaliere", "Il rivale misterioso è una versione futura del Campione stesso!");
          triggerChronoVisualFx();
        });
      },

      chr_aria() {
        say([
          ["chr_aria", "{n}! Ho percepito una distorsione gravissima! Quell'uomo... aveva le tue stesse onde sinaptiche! È il paradosso di cui parlava Elias!"]
        ], done);
      }
    };

    chObj.obj = {
      "chr_mappe_temporali:P"(e) {
        const s = S();
        if (s === 2) {
          triggerChronoVisualFx(() => {
            say([
              ["voce", "Hai raccolto il Frammento di Mezzogiorno! La Clessidra di Quarzo al tuo polso brilla di luce dorata."],
              ["chr_aria", "Ora puoi sfidare i campioni del Re al Gran Colosseo a Sud!"]
            ], () => {
              setStep(N, 3);
            });
          });
        } else {
          say([["voce", "Il piedistallo astronomico della Sala delle Mappe."]], done);
        }
      },
      "chr_trono_oro:>"(e) { go("chr_mappe_temporali", 3, 12); },
      "chr_mappe_temporali:<"(e) { go("chr_trono_oro", 32, 12); },
      "chr_trono_oro:d"(e) { go("chr_colosseo_solare", 20, 3); },
      "chr_colosseo_solare:u"(e) { go("chr_trono_oro", 18, 21); }
    };

    function startMatchMezzogiorno() {
      playMatch({
        id: "chr_match_2",
        alt: "az",
        azPitch: "erba",
        chap: "Chrono-Break · Il Torneo dell'Oro Solare",
        us: "I Custodi del Tempo",
        mate: "Aria",
        min: 45,
        intro: "Partita nel monumentale Gran Colosseo! Sfida la Legione d'Oro di Re Aurelio. I difensori hanno scudi dorati, ma l'Eco Temporale può aggirarli!",
        team: (t, st) => ({
          name: "La Guardia d'Oro Solare",
          color: "#d97706",
          defs: [["Centurione Flavio", t(st.drib * 0.95)], ["Tiberio la Roccia", t(st.drib * 0.98)], ["Aurelio Junior", t(st.drib * 0.92)]],
          atk: [["Valerio il Dardo", t(st.tiro * 0.98)], ["Cassio il Falco", t(st.vel * 0.95)]],
          gk: ["Titanus Aureo", t(st.tiro * 1.05)],
          power: t(st.tiro * 0.95),
          special: ["IL MURO DI MEZZOGIORNO", t(st.tiro * 1.2)]
        }),
        done: (r) => {
          if (r.win) {
            const rw = reward("chr_ch2_win", { coins: 45 });
            say([
              ["chr_re_aurelio", "Il Gran Colosseo ha applaudito... Non ho mai visto una traiettoria così visionaria! Accetto la verità: il cielo si sta oscurando."],
              ["chr_aria", "Due frammenti su tre sono recuperati! La frattura finale si sta aprendo verso il Crepuscolo del Cataclisma. Lì incontreremo il Cavaliere Nero per la sfida definitiva!"],
              ["voce", `CAPITOLO 2 COMPLETATO! ${rw.join(" · ")}. Avanza al Capitolo Finale!`]
            ], () => {
              finishChapter(2, "mezzogiorno_completato");
              setStep(N, 4);
              go("chr_trono_oro", 18, 12);
            });
          } else {
            say([
              ["chr_re_aurelio", "La Guardia d'Oro non concede varchi facilmente! Riprova e sfrutta il passaggio di ritorno con la tua eco!"]
            ], done);
          }
        }
      });
    }
  });

  // ============================================================================
  // CAPITOLO 3 · IL CREPUSCOLO DEL CATACLISMA & IL PARADOSSO FINALE
  // ============================================================================
  addChapter(function (chObj) {
    const X = XTOOLS;
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addClue, triggerChronoVisualFx } = X;
    const N = 3, S = () => X.stepOf(N);

    chObj.cast("chr_aria_crepuscolo", {
      name: "Aria (Memoria Eterna)", tag: "spirito", hair: "#c084fc", style: "long", skin: "#f3e8ff", eye: "#f43f5e",
      bg: ["#180828", "#831843"], shirt: "#4c1d95"
    }, "La forma spirituale di Aria nelle rovine del Cataclisma. Custodisce l'ultima possibilità di riscrittura del continuum temporale.");

    chObj.cast("chr_alter_hero", {
      name: "Chrono-Lord {n}", tag: "paradosso", hair: "#0f172a", style: "messy", skin: "#cbd5e1", eye: "#ef4444",
      bg: ["#020617", "#ef4444"], shirt: "#020617"
    }, "La versione del futuro di {n}, distrutta dal rimorso e consumata dalla potenza della Clessidra infranta.");

    chObj.setMeta(3, "Il Crepuscolo del Cataclisma", "La Battaglia delle Rovine e la Riscrittura del Tempo");
    chObj.setGoal((s) => {
      if (s === 0) return "Raggiungi il Cratere dell'Eclisse e parla con Aria Spirituale";
      if (s === 1) return "Attiva i tre Pilastri di Quarzo per stabilizzare la realtà";
      if (s === 2) return "Entra nel Santuario dell'Eclisse e sfida il Chrono-Lord {n}";
      if (s === 3) return "Compi la scelta definitiva del Paradosso del Tempo";
      return "SAGA DI CHRONO-BREAK COMPLETATA! Sei il Signore del Tempo.";
    });

    chObj.zones = {
      // 1. Il Cratere del Crepuscolo
      chr_cratere_rovine: {
        name: "Valle d'Ambra · Il Cratere del Crepuscolo", short: "Cratere del Crepuscolo", sub: "Rovine sospese nel vuoto e cielo infranto",
        w: 36, h: 26, start: [18, 22], theme: "torino", bg: "chr_crepuscolo",
        item: ["Scheggia di Paradosso", "Schegge"],
        items: [[6, 6], [29, 6]],
        act: {
          P: "Attiva il Pilastro di Quarzo Risonante",
          ">": "Entra nel Santuario dell'Eclisse (Est)"
        },
        build(Ls) {
          Ls.lay(0, 0, 35, 1, "A");
          Ls.lay(0, 0, 1, 24, "A");
          Ls.lay(34, 0, 35, 24, "A");
          Ls.lay(0, 23, 35, 24, "A");
          Ls.lay(2, 2, 33, 22, ":");
          Ls.lay(17, 3, 18, 22, "c");
          Ls.put(8, 8, "P"); Ls.put(26, 8, "P"); Ls.put(17, 4, "P");
          Ls.put(34, 12, ">"); Ls.put(34, 13, ">");
        },
        npcs(s) {
          return [{ id: "chr_aria_crepuscolo", at: [18, 10] }];
        }
      },

      // 2. Il Santuario dell'Eclisse (Stadio Supremo del Paradosso)
      chr_stadio_paradosso: {
        name: "Valle d'Ambra · L'Arena del Paradosso", short: "Arena del Paradosso", sub: "Il campo finale sospeso fuori dall'universo",
        w: 40, h: 28, start: [20, 22], theme: "torino", bg: "chr_portale",
        item: ["Corona del Tempo", "Corone"],
        items: [[6, 6], [34, 6]],
        act: {
          "<": "Torna alle Rovine (Ovest)"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "A");
          Ls.lay(0, 0, 1, 26, "A");
          Ls.lay(38, 0, 39, 26, "A");
          Ls.lay(0, 25, 39, 26, "A");
          Ls.lay(2, 2, 37, 24, "p");
          Ls.lay(4, 6, 35, 20, "y");
          Ls.put(1, 12, "<"); Ls.put(1, 13, "<");
        },
        npcs(s) {
          return [{ id: "chr_alter_hero", at: [20, 10] }];
        }
      }
    };

    chObj.talk = {
      chr_aria_crepuscolo() {
        const s = S();
        if (s === 0) {
          say([
            ["chr_aria_crepuscolo", "Sei arrivato, {n}... Questo è il futuro che accadrà se non fermi il paradosso. Le mura sono crollate, il cielo è a pezzi."],
            ["hero", "Il Cavaliere Nero... è davvero me stesso dal futuro?"],
            ["chr_aria_crepuscolo", "Sì. Nel suo ciclo originario non è riuscito a salvare i compagni e ha usato la Clessidra per riavvolgere il mondo all'infinito, intrappolandoci tutti."],
            ["chr_aria_crepuscolo", "Tocca i tre pilastri di quarzo nel cratere per sincronizzare il Frammento Finale, poi entra nell'Arena dell'Eclisse a est!"]
          ], () => {
            setStep(N, 1);
            addClue("c3_rivelazione", "Il Ciclo Infinito", "Il futuro può essere spezzato solo battendo il Chrono-Lord.");
          });
        } else {
          say([
            ["chr_aria_crepuscolo", "I pilastri sono quasi carichi. Non avere pietà del tuo vecchio rimorso: supera te stesso sul campo!"]
          ], done);
        }
      },

      chr_alter_hero() {
        const s = S();
        if (s >= 1 && s <= 2) {
          ask("chr_alter_hero", "Sei arrivato fin qui, mio giovane passato. Credi che un tiro perfetto possa salvare ciò che è già svanito? Dimostramelo nel Duello del Destino!", [
            { label: "⚽ La Battaglia Finale del Paradosso", cls: "hot", fn: startFinalMatch },
            { label: "Aspetta", fn: done }
          ]);
        } else {
          say([
            ["chr_alter_hero", "Il tempo si piega alla volontà di chi non ha paura di ricominciare."]
          ], done);
        }
      }
    };

    chObj.obj = {
      "chr_cratere_rovine:P"(e) {
        const s = S();
        if (s === 1) {
          triggerChronoVisualFx(() => {
            say([
              ["voce", "I tre Pilastri di Quarzo risuonano simultaneamente! L'energia temporale stabilizza il cratere."],
              ["hero", "La via verso l'Arena del Paradosso a Est è aperta. È tempo di affrontare il mio destino!"]
            ], () => {
              setStep(N, 2);
            });
          });
        } else {
          say([["voce", "Un pilastro di quarzo che pulsa a frequenze ultraterrene."]], done);
        }
      },
      "chr_cratere_rovine:>"(e) { go("chr_stadio_paradosso", 3, 12); },
      "chr_stadio_paradosso:<"(e) { go("chr_cratere_rovine", 32, 12); }
    };

    function startFinalMatch() {
      playMatch({
        id: "chr_match_final",
        alt: "az",
        azPitch: "campo",
        chap: "Chrono-Break · Il Derby Supremo del Paradosso",
        us: "I Custodi dell'Alba",
        mate: "Aria",
        min: 45,
        intro: "LA FINALE ASSOLUTA! Sfida il Chrono-Lord {n} e la sua Legione dell'Eclisse! Entrambi possedete l'Eco Temporale e la Clessidra di Quarzo!",
        team: (t, st) => ({
          name: "L'Eclisse del Paradosso",
          color: "#0f172a",
          defs: [["Fantasma del Passato", t(st.drib * 1.05)], ["Eco di Rimorso", t(st.drib * 1.08)], ["Ombra del Destino", t(st.drib * 1.02)]],
          atk: [["Chrono-Lord {n}", t(st.tiro * 1.15)], ["Spettro del Futuro", t(st.vel * 1.05)]],
          gk: ["Il Custode dell'Eternità", t(st.tiro * 1.18)],
          power: t(st.tiro * 1.1),
          special: ["CHRONO-BREAK APOCALYPSE", t(st.tiro * 1.35)]
        }),
        done: (r) => {
          if (r.win) {
            const rw = reward("chr_ch3_win", { coins: 60 });
            say([
              ["chr_alter_hero", "(Cade in ginocchio mentre la sua armatura d'ebano si dissolve in petali di luce) Sei... più forte di quanto fossi io. Hai superato la paura di perdere."],
              ["chr_alter_hero", "Prendi l'Orologio di Quarzo primordiale. Il Cataclisma è scongiurato. La Valle d'Ambra vivrà... e la Rondine tornerà a volare libera nel tuo presente."],
              ["chr_aria_crepuscolo", "{n}! Ce l'hai fatta! Il cielo sta tornando limpido, le crepe sono scomparse! Sei il vero Signore del Tempo!"],
              ["voce", `SAGA DI CHRONO-BREAK COMPLETATA CON SUCCESSO! ${rw.join(" · ")}! La leggenda del Campione numero {num} attraversa ora ogni secolo!`]
            ], () => {
              finishChapter(3, "paradosso_risolto");
              setStep(N, 4);
              go("chr_stadio_paradosso", 20, 10);
            });
          } else {
            say([
              ["chr_alter_hero", "Non ancora... Il passato non può vincere se esita davanti all'incrocio dei pali! Riprova, me stesso!"]
            ], done);
          }
        }
      });
    }
  });

  // ------------------------------------------------------------------ Pulsante Esci e Avvio
  function setupExitButton() {
    const existing = document.getElementById("chrExit");
    if (existing) return;
    const st = document.createElement("style");
    st.textContent = `
      #chrExit {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 36px; padding: 6px 14px; border-radius: 10px;
        border: 1px solid rgba(56, 189, 248, 0.7); background: rgba(15, 23, 42, 0.92);
        color: #7dd3fc; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6); cursor: pointer;
        touch-action: manipulation; transition: all .15s ease;
      }
      #chrExit:hover { background: rgba(2, 132, 199, 0.95); color: #fff; transform: translateY(-1px); }
      #chrExit.on { display: inline-flex; align-items: center; justify-content: center; }
    `;
    document.head.appendChild(st);
    const btn = document.createElement("button");
    btn.id = "chrExit"; btn.type = "button";
    btn.textContent = "✕ Esci da Chrono-Break";
    btn.onclick = () => {
      if (inMatch) {
        const h = document.getElementById("homeBtn");
        if (h) h.click();
        return;
      }
      if (zoneRec()) leave();
    };
    document.body.appendChild(btn);
    setInterval(() => {
      const live = !!(zoneRec() && document.body.classList.contains("borgo"));
      btn.classList.toggle("on", live);
    }, 400);
  }

  function installHooks() {
    const desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    const chained = !(desc && desc.set);
    const prev = chained ? window.trTalkHook : null;
    window.trTalkHook = function (id) {
      const zr = zoneRec();
      if (zr && zr.Z.npcs.some((n) => n.id === id)) {
        const c = CHAPTERS[zr.ch] || activeChapter();
        const f = c && c.talk && c.talk[id];
        if (f) { castHero(); f(); return true; }
      }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
  }

  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match) {
      if (++tries < 200) setTimeout(init, 150);
      return;
    }
    api = a;
    CAST_Q.splice(0).forEach(([id, c, bio]) => { if (a.CAST && !a.CAST[id]) a.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c); if (bio && a.BIO && !a.BIO[id]) a.BIO[id] = bio; });
    COS_Q.splice(0).forEach(([id, d]) => { if (a.COSM && !a.COSM[id]) a.COSM[id] = d; });
    PENDING.splice(0).forEach(registerChapterZones);
    setupExitButton();
    installHooks();
  }

  function openMain(opts) {
    opts = opts || {};
    EXIT = opts.onExit || null;
    if (!hero()) {
      if (window.heroCreate) {
        window.heroCreate(() => openMain(opts));
      } else {
        alert("Crea prima il tuo Campione dal menu principale!");
      }
      return;
    }
    castHero();
    const c = activeChapter(), m = mem();
    const curZ = m.zone && ZONES[m.zone] ? m.zone : "chr_santuario_alba";
    const zr = ZONES[curZ];
    const startPos = (zr && zr.spec.start) || [18, 13];
    go(curZ, startPos[0], startPos[1]);
  }

  // Esportazione Globale dell'API
  window.__chronoStory = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "⏳ Chrono-Break · Il Tempio dei Tre Tempi",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Viaggi nel tempo ed Eco Temporale"}`
          : "Crea prima il tuo campione · Saga dei viaggi nel tempo con Eco Temporale"
      };
    },
    info() {
      const m = mem();
      return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), clues: m.clues.length };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
