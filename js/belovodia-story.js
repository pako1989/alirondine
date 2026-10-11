// ============================================================================
// IL CANTO DI BELOVODIA · IL BOSCO DELLE MASCHERE
// Saga Dark Fantasy & Folklore Slavo per il Tuo Campione
// Ispirata a The Witcher, Folklore di Baba Jaga, Princess Mononoke e Fiabe d'Inverno
// Motore 2D Camminabile HD con Maschere Spiritiche, Scelte Morali e Partite sul Ghiaccio
// ============================================================================
(function () {
  "use strict";

  if (window.__belovodiaStoryLoaded) return;
  window.__belovodiaStoryLoaded = true;

  const KEY = "ali-di-rondine.belovodia-story";
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
  const rnd = (tx, ty, k) => hash(tx * 79 + ty * 137 + k * 23) / 4294967296;

  // ------------------------------------------------------------------ Audio Synthesizer (Folklore & Tormenta)
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  function sfxBelovodiaWind() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);
      g.gain.setValueAtTime(0.01, now);
      g.gain.linearRampToValueAtTime(0.25, now + 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.7);
    } catch (e) {}
  }

  function sfxBelovodiaMaskEquip() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Campane di ghiaccio cristalline
      [587.33, 880.0, 1174.66, 1760.0].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.18, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.45);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.45);
      });
    } catch (e) {}
  }

  function sfxBelovodiaIceCrack() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [320, 480, 240, 160].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + i * 0.03);
        g.gain.setValueAtTime(0.12, now + i * 0.03);
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.03 + 0.12);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.03); osc.stop(now + i * 0.03 + 0.12);
      });
    } catch (e) {}
  }

  function sfxBelovodiaChimes() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        g.gain.setValueAtTime(0.15, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.002, now + i * 0.06 + 0.35);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.06); osc.stop(now + i * 0.06 + 0.35);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Salvataggio normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  function norm(o) {
    o = obj(o);
    const m = {
      v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {},
      zone: "", masks: [], log: [], intro: {}, wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0)
    };
    const st = obj(o.step);
    Object.keys(st).slice(0, 99).forEach((k) => { const n = clampI(k, 1, 99, 0); if (n) m.step[n] = clampI(st[k], 0, 99, 0); });
    const fl = obj(o.flags); let c = 0;
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
    m.masks = [...new Set(arr(o.masks).filter((x) => typeof x === "string"))].slice(0, 20);
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
  const addMask = (id, name, desc) => {
    const m = mem();
    if (!m.masks.includes(id)) {
      m.masks.push(id); save();
      sfxBelovodiaMaskEquip();
      if (api && api.trToast) api.trToast(`🎭 Nuova Maschera Ancestrale: ${name}`);
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
    saetta: "un dardo di fuoco fatuo che sibila come vento boreale",
    serpentina: "una traiettoria a spirale che aggira i tronchi come una volpe",
    parabola: "un fendente arcuato che scavalca le betulle come un falco d'argento",
    martello: "un colpo pesante come la zampa di un orso che frantuma la barriera di brina",
    traversa: "un impatto chirurgico che scuote la traversa innevata",
    saudade: "una parabola malinconica che accarezza il silenzio della taiga",
    muro: "un tiro compatto e roccioso che sradica ogni difesa"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "IL TIRO DEL BOSCO", shot: "parabola" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "IL TIRO DEL BOSCO")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un tiro antico e armonico");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "viandante", hair: h.hair, style: h.style, skin: h.skin, eye: "#38bdf8",
      bg: ["#0f172a", "#38bdf8"], shirt: "#0284c7", num: String(h.num), acc: h.acc,
      cap: h.acc === "cappellino" ? "#0f172a" : h.acc === "berretto" ? "#0284c7" : undefined
    };
  }

  const coinsGive = (n) => {
    if (n > 0 && typeof window.addCoins === "function") {
      try { window.addCoins(n); return n; } catch (e) { return 0; }
    }
    return 0;
  };

  // ------------------------------------------------------------------ Set di Tessere 16x16 (Pixel Art Belovodia)
  // Pavimenti:
  //   , = neve battuta con orme e brina
  //   p = assi di legno di pino calpestate
  //   w = parquet scuro di betulla tagliata (izba)
  //   c = tappeto slavo damascato rosso carminio e oro
  //   : = lastra di ghiaccio spesso con crepe azzurre
  //   y = campo cerimoniale di neve pressata
  // Solidi / Oggetti:
  //   A = palizzata di tronchi con pelli e neve spessa
  //   M = totem delle maschere intagliato con corna e occhi
  //   B = braciere cerimoniale ardente con faville
  //   S = grande stufa russa in ghisa fumante
  //   T = banco di lavoro dell'intagliatore con scalpelli
  //   b = panchina di legno rustico
  //   l = lanterna in ferro battuto con brina
  //   F = pozzo sacro gelato con carrucola e ghiaccioli
  //   k = idolo di legno antico dello Zar Moroz
  //   W = scranno intagliato con corna di cervo
  //   x = catasta di ceppi di betulla da ardere
  //   ^ > < d = varchi della foresta e sentieri
  //   u v q m = portoni pesanti ad arco dell'izba con tettoia
  //   J = finestrelle piccole con vetri gelati
  //   H = altare della Maschera Ancestrale
  //   G = porta cerimoniale con corna di cervo
  const FLOORS = ',pc:wy';
  const SOLID = 'AMSTblnFkWx^><duvqmJPGHE';
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);
  const ZX = { map: null, under: null, id: "", cvs: null };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "A";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const frNow = () => Math.floor(performance.now() / 16);

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 3);
    if (f === ",") {
      // Neve battuta soffice con orme e cristalli
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#e2e8f0" : "#edf2f7");
      if (r < 0.25) P(sx + 3, sy + 4, 3, 2, "#cbd5e1");
      if (r > 0.75) P(sx + 9, sy + 10, 2, 2, "#ffffff");
      if ((tx * 3 + ty) % 7 === 0) P(sx + 6, sy + 7, 2, 1, "#bae6fd");
    } else if (f === "p") {
      // Assi di legno rustiche calpestate
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#451a03" : "#5c2406");
      P(sx, sy + 7, 16, 1, "#27150c");
      P(sx + (ty % 2 ? 5 : 12), sy, 1, 7, "#27150c");
      P(sx + (ty % 2 ? 12 : 5), sy + 8, 1, 8, "#27150c");
      if (r < 0.2) P(sx + 7, sy + 3, 2, 2, "#94a3b8"); // Traccia di neve
    } else if (f === "w") {
      // Parquet caldo dell'izba
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#3b2314" : "#4a2c19");
      P(sx, sy + 5, 16, 1, "#27150c");
      P(sx, sy + 11, 16, 1, "#27150c");
      P(sx + (ty % 2 ? 4 : 10), sy, 1, 16, "#27150c");
      if (r < 0.15) P(sx + 8, sy + 8, 2, 2, "#fde68a"); // Truciolo di legno
    } else if (f === "c") {
      // Tappeto slavo damascato rosso carminio e oro
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#7f1d1d" : "#991b1b");
      P(sx, sy, 16, 1, "#b91c1c");
      if (at(tx - 1, ty) !== "c") P(sx, sy, 2, 16, "#fbbf24");
      if (at(tx + 1, ty) !== "c") P(sx + 14, sy, 2, 16, "#fbbf24");
      if ((tx + ty) % 3 === 0) P(sx + 7, sy + 7, 2, 2, "#fef08a");
    } else if (f === ":") {
      // Lastra di ghiaccio vivo con crepe
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#38bdf8" : "#0284c7");
      P(sx, sy, 16, 1, "#bae6fd");
      P(sx + 3, sy + 4, 8, 1, "#e0f2fe");
      P(sx + 9, sy + 5, 1, 7, "#e0f2fe");
      if (r < 0.3) P(sx + 4, sy + 11, 4, 1, "#ffffff");
    } else if (f === "y") {
      // Campo cerimoniale di neve pressata
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#cbd5e1" : "#94a3b8");
      if (tx % 6 === 0) P(sx, sy, 1, 16, "rgba(56, 189, 248, 0.45)");
      if (ty % 6 === 0) P(sx, sy, 16, 1, "rgba(56, 189, 248, 0.45)");
    }
  }

  function gateTile(ch, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty);
    // Tronchi d'ingresso con rami intrecciati e lanterna
    P(sx + 1, sy, 3, 16, "#3b2314");
    P(sx + 12, sy, 3, 16, "#3b2314");
    P(sx, sy + 2, 16, 3, "#5c2406");
    P(sx, sy, 16, 2, "#f8fafc"); // Neve sopra
    // Freccia luminosa ciano
    GP.fillStyle = "#38bdf8"; GP.beginPath();
    if (ch === "^") { GP.moveTo(sx + 8, sy + 6); GP.lineTo(sx + 4, sy + 12); GP.lineTo(sx + 12, sy + 12); }
    else if (ch === "d") { GP.moveTo(sx + 8, sy + 12); GP.lineTo(sx + 4, sy + 6); GP.lineTo(sx + 12, sy + 6); }
    else if (ch === "<") { GP.moveTo(sx + 5, sy + 8); GP.lineTo(sx + 11, sy + 4); GP.lineTo(sx + 11, sy + 12); }
    else { GP.moveTo(sx + 11, sy + 8); GP.lineTo(sx + 5, sy + 4); GP.lineTo(sx + 5, sy + 12); }
    GP.closePath(); GP.fill();
  }

  function doorTile(sx, sy, color) {
    // Portone di legno dell'izba
    P(sx + 1, sy + 2, 14, 14, "#27150c");
    P(sx + 2, sy + 3, 12, 12, color || "#451a03");
    P(sx + 1, sy, 14, 2, "#f8fafc"); // Neve sulla tettoia
    P(sx + 7, sy + 3, 2, 12, "#180c06");
    P(sx + 10, sy + 9, 2, 3, "#fbbf24"); // Maniglia d'ottone
  }

  const PAINT = {
    A(sx, sy, tx, ty) {
      // Palizzata di tronchi di pino con spuntoni e neve
      P(sx, sy + 3, 16, 13, "#3b2314");
      P(sx + 2, sy + 3, 4, 13, "#27150c");
      P(sx + 8, sy + 3, 4, 13, "#27150c");
      P(sx + 14, sy + 3, 2, 13, "#27150c");
      // Spuntoni intagliati
      P(sx + 3, sy + 1, 2, 2, "#5c2406");
      P(sx + 9, sy + 1, 2, 2, "#5c2406");
      // Calotta di neve candida
      P(sx, sy, 16, 3, "#f8fafc");
      P(sx + 1, sy + 3, 3, 2, "#f8fafc");
      P(sx + 7, sy + 3, 3, 2, "#f8fafc");
    },
    M(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Palo di betulla intagliato
      P(sx + 6, sy + 6, 4, 10, "#e2e8f0");
      P(sx + 7, sy + 8, 2, 2, "#1e293b");
      // Maschera intagliata in cima
      P(sx + 3, sy + 1, 10, 8, "#78350f");
      P(sx + 4, sy + 2, 8, 6, "#92400e");
      // Occhi luminosi animati
      const eyeCol = (fr % 30 < 15) ? "#fbbf24" : "#fef08a";
      P(sx + 5, sy + 4, 2, 2, eyeCol);
      P(sx + 9, sy + 4, 2, 2, eyeCol);
      P(sx + 7, sy + 6, 2, 2, "#1c1917");
      // Corna o piume in cima
      P(sx + 2, sy - 1, 2, 3, "#cbd5e1");
      P(sx + 12, sy - 1, 2, 3, "#cbd5e1");
    },
    B(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Braciere di rami di conifera e pietre scure
      P(sx + 3, sy + 9, 10, 5, "#334155");
      P(sx + 2, sy + 8, 12, 2, "#475569");
      P(sx + 4, sy + 13, 2, 3, "#1e293b");
      P(sx + 10, sy + 13, 2, 3, "#1e293b");
      // Fiamme ardenti animate
      const fl = Math.sin(fr / 5 + tx) * 2;
      GP.fillStyle = "#ef4444";
      GP.beginPath();
      GP.moveTo(sx + 4, sy + 8);
      GP.lineTo(sx + 8, sy + 1 + fl);
      GP.lineTo(sx + 12, sy + 8);
      GP.closePath(); GP.fill();
      GP.fillStyle = "#fbbf24";
      GP.beginPath();
      GP.moveTo(sx + 6, sy + 8);
      GP.lineTo(sx + 8, sy + 3 + fl * 0.5);
      GP.lineTo(sx + 10, sy + 8);
      GP.closePath(); GP.fill();
    },
    S(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Stufa russa in ghisa nera
      P(sx + 2, sy + 3, 12, 12, "#18181b");
      P(sx + 1, sy + 2, 14, 2, "#27272a");
      P(sx + 6, sy, 4, 3, "#27272a"); // Tubo
      // Bocca del fuoco
      P(sx + 5, sy + 7, 6, 5, "#09090b");
      const fl = (fr % 16 < 8) ? "#ea580c" : "#f59e0b";
      P(sx + 6, sy + 8, 4, 3, fl);
      P(sx + 7, sy + 9, 2, 2, "#fef08a");
    },
    T(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Banco di lavoro dell'intagliatore
      P(sx + 1, sy + 3, 14, 8, "#451a03");
      P(sx + 1, sy + 2, 14, 2, "#5c2406");
      P(sx + 2, sy + 11, 2, 5, "#27150c");
      P(sx + 12, sy + 11, 2, 5, "#27150c");
      // Scalpello d'argento e trucioli
      P(sx + 4, sy + 4, 6, 2, "#cbd5e1");
      P(sx + 2, sy + 4, 2, 2, "#78350f");
      P(sx + 11, sy + 5, 2, 2, "#fde68a");
    },
    b(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Panchina di legno di betulla
      P(sx + 1, sy + 5, 14, 4, "#5c2406");
      P(sx + 2, sy + 9, 2, 5, "#3b2314");
      P(sx + 12, sy + 9, 2, 5, "#3b2314");
      P(sx + 2, sy + 4, 12, 1, "#e2e8f0"); // Spolverata di neve
    },
    l(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Lanterna in ferro battuto su palo
      P(sx + 7, sy + 4, 2, 12, "#1e293b");
      P(sx + 5, sy + 2, 6, 5, "#0f172a");
      P(sx + 5, sy, 6, 2, "#f8fafc"); // Neve sopra
      // Luce tremolante calda
      const fl = (fr % 20 < 10) ? "#f59e0b" : "#fbbf24";
      P(sx + 6, sy + 3, 4, 3, fl);
      P(sx + 7, sy + 4, 2, 1, "#fef08a");
    },
    F(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Pozzo sacro gelato con carrucola
      P(sx + 2, sy + 6, 12, 8, "#334155");
      P(sx + 1, sy + 5, 14, 2, "#475569");
      P(sx + 4, sy + 7, 8, 5, "#0284c7"); // Ghiaccio interno
      // Tettoia e pali
      P(sx + 3, sy + 1, 2, 5, "#3b2314");
      P(sx + 11, sy + 1, 2, 5, "#3b2314");
      P(sx + 1, sy, 14, 2, "#f8fafc");
      // Ghiaccioli
      P(sx + 4, sy + 2, 1, 2, "#bae6fd");
      P(sx + 11, sy + 2, 1, 3, "#bae6fd");
    },
    k(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Idolo sacro dello Zar Moroz
      P(sx + 4, sy + 3, 8, 12, "#3b2314");
      P(sx + 5, sy + 1, 6, 4, "#5c2406");
      // Corna di cervo innevate
      P(sx + 2, sy - 1, 3, 3, "#cbd5e1");
      P(sx + 11, sy - 1, 3, 3, "#cbd5e1");
      // Occhi di ghiaccio azzurro
      P(sx + 6, sy + 2, 1, 1, "#38bdf8");
      P(sx + 9, sy + 2, 1, 1, "#38bdf8");
    },
    W(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Scranno intagliato con corna di cervo
      P(sx + 3, sy + 3, 10, 12, "#27150c");
      P(sx + 4, sy + 5, 8, 8, "#7f1d1d"); // Cuscino di velluto rosso
      // Corna
      P(sx + 1, sy, 3, 5, "#e2e8f0");
      P(sx + 12, sy, 3, 5, "#e2e8f0");
    },
    x(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Catasta di ceppi di betulla
      P(sx + 1, sy + 6, 14, 9, "#e2e8f0");
      P(sx + 2, sy + 7, 12, 7, "#3b2314");
      P(sx + 3, sy + 9, 3, 3, "#e2e8f0");
      P(sx + 9, sy + 9, 3, 3, "#e2e8f0");
      P(sx + 6, sy + 6, 4, 3, "#e2e8f0");
      P(sx + 1, sy + 4, 14, 2, "#f8fafc"); // Neve sopra
    },
    H(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Altare della Maschera Ancestrale del Falco
      P(sx + 2, sy + 6, 12, 9, "#27150c");
      P(sx + 1, sy + 5, 14, 2, "#451a03");
      // La Maschera del Falco fluttuante con bagliore azzurro
      const fl = Math.sin(fr / 8 + tx) * 1.5;
      GP.fillStyle = "#38bdf8";
      P(sx + 4, sy + 1 + fl, 8, 5, "rgba(56, 189, 248, 0.45)");
      P(sx + 6, sy + 1 + fl, 4, 5, "#f8fafc");
      P(sx + 7, sy + 5 + fl, 2, 2, "#fbbf24"); // Becco oro
      P(sx + 6, sy + 2 + fl, 1, 1, "#0284c7"); // Occhio
      P(sx + 9, sy + 2 + fl, 1, 1, "#0284c7");
    },
    G(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Porta da calcio cerimoniale
      P(sx + 1, sy + 2, 14, 3, "#5c2406");
      P(sx + 2, sy + 5, 2, 11, "#3b2314");
      P(sx + 12, sy + 5, 2, 11, "#3b2314");
      // Corna di cervo sulla traversa
      P(sx + 4, sy, 3, 3, "#cbd5e1");
      P(sx + 9, sy, 3, 3, "#cbd5e1");
      // Rete di rami
      P(sx + 4, sy + 6, 8, 8, "rgba(241, 245, 249, 0.25)");
    },
    J(sx, sy, tx, ty) {
      // Finestrella gelata
      P(sx + 3, sy + 2, 10, 12, "#0f172a");
      P(sx + 4, sy + 3, 8, 10, "#38bdf8");
      P(sx + 7, sy + 3, 2, 10, "#27150c");
      P(sx + 4, sy + 7, 8, 2, "#27150c");
      P(sx + 5, sy + 4, 2, 2, "#e0f2fe"); // Brina
    },
    u: (sx, sy, tx, ty) => doorTile(sx, sy, "#5c2406"),
    v: (sx, sy, tx, ty) => doorTile(sx, sy, "#7f1d1d"),
    q: (sx, sy, tx, ty) => doorTile(sx, sy, "#1e3a8a"),
    m: (sx, sy, tx, ty) => doorTile(sx, sy, "#065f46"),
    ">": (sx, sy, tx, ty) => gateTile(">", sx, sy, tx, ty),
    "<": (sx, sy, tx, ty) => gateTile("<", sx, sy, tx, ty),
    "^": (sx, sy, tx, ty) => gateTile("^", sx, sy, tx, ty),
    d: (sx, sy, tx, ty) => gateTile("d", sx, sy, tx, ty)
  };

  function drawTile(ch, sx, sy, tx, ty) {
    GP = GP || document.getElementById("cv").getContext("2d");
    if (isFloor(ch)) { floorPaint(ch, sx, sy, tx, ty); return true; }
    const fn = PAINT[ch];
    if (!fn) return false;
    fn(sx, sy, tx, ty, frNow());
    return true;
  }

  function makeLayers(w, h) {
    const m = ZX.map, u = Array.from({ length: h }, () => Array(w).fill(","));
    ZX.under = u;
    const lay = (x0, y0, x1, y1, ch) => {
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          if (m[y] && x >= 0 && x < w) {
            m[y][x] = ch;
            if (isFloor(ch)) u[y][x] = ch;
          }
        }
      }
    };
    const put = (x, y, ch) => {
      if (m[y] && x >= 0 && x < w) {
        m[y][x] = ch;
        if (isFloor(ch)) u[y][x] = ch;
      }
    };
    return { lay, put };
  }

  // ------------------------------------------------------------------ Zone & Motore Camminabile (TRZ)
  const ZONES = {};
  const CHAPTERS = {};

  function addChapter(fn) {
    const X = Object.assign({}, XTOOLS);
    const c = fn(X);
    if (!c || !c.n) return;
    CHAPTERS[c.n] = c;
    if (api) registerChapterZones(c); else PENDING.push(c);
  }

  function registerChapterZones(c) {
    Object.keys(c.zones || {}).forEach((zid) => registerZone(c.n, zid, c.zones[zid]));
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

  const activeChapter = () => {
    const m = mem(); let best = null;
    Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).forEach((n) => {
      if (n <= m.ch) best = CHAPTERS[n];
    });
    return best || CHAPTERS[1] || null;
  };

  const zoneRec = () => (api ? ZONES[api.trZone()] : null);
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "bv_villaggio";

  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch] || activeChapter();
    castHero();
    const list = zr.spec.npcs ? zr.spec.npcs(stepOf(c.n)) : [];
    const hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(stepOf(c.n)) : zr.spec.hints || {});
    zr.Z.npcs = list.filter((n) => CAST_OK(n.id));

    const gl = goalNow();
    [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => {
      if (k) hints[k] = (gl ? "Obiettivo: " + gl + " · " : "") + (hints[k] || "");
    });
    zr.Z.hints = hints;
  }

  const CAST_OK = (id) => !!(api.CAST && api.CAST[id]);

  function say(lines, then) {
    const bg = bgNow();
    api.trSay(lines.map((l) => api.L(l[0], T(l[1]), l[2] || bg)), then);
  }

  function ask(who, prompt, opts, bg) {
    api.trAsk(
      who,
      esc(T(prompt)).replace(/\n/g, "<br>"),
      opts.map((o) => ({ label: T(o.label), sub: o.sub ? T(o.sub) : undefined, cls: o.cls || "", disabled: !!o.disabled, fn: o.fn })),
      bg || bgNow()
    );
  }

  const done = () => { refreshZone(); api.trResume(); };

  function reward(key, o) {
    const msg = [];
    once(key, () => {
      if (o.coins) { const n = coinsGive(o.coins); if (n) msg.push(`+${n} monete`); }
      (o.cos ? [].concat(o.cos) : []).forEach((id) => {
        const c = api.COSM && api.COSM[id] && safe(() => api.bCos(id), false) ? api.COSM[id].label : null;
        if (c) msg.push(`Nuovo accessorio: ${c}`);
      });
    });
    return msg;
  }

  function go(zid, tx, ty) {
    const tr = api.trRec();
    tr.pos[zid] = [tx * TS + 8, ty * TS + 12];
    enterZone(zid);
  }

  function enterZone(zid) {
    const zr = ZONES[zid]; if (!zr) return;
    const m = mem(); m.zone = zid; save();
    castHero();
    api.trRec().seen[zid] = true;
    api.trGo(zid);
    refreshZone();
    if (!m.intro[zid]) {
      m.intro[zid] = 1; save();
      if (zr.spec.intro && zr.spec.intro.length) return say(zr.spec.intro, done);
    }
    api.trToast(zr.spec.short);
  }

  function registerZone(chN, zid, spec) {
    const Z = {
      name: spec.name, short: spec.short, sub: spec.sub || "", need: 0,
      w: spec.w, h: spec.h, start: spec.start, theme: spec.theme || "torino",
      bus: "cancello", busLabel: "Esci da Belovodia",
      item: spec.item || ["Piuma di Betulla", "Piume"], itemCos: spec.itemCos, items: spec.items || [],
      bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({}, spec.act || {}), intro: [],
      me: () => {
        const c = api.CAST.hero || api.CAST.leo;
        return Object.assign({}, c, { shirt: "#0284c7", eye: "#38bdf8" });
      },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d");
        g.fillStyle = "#38bdf8";
        g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#ffffff"; g.fillRect(x - 1, y - 1, 2, 2);
      }
    };

    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: Canto delle Maschere ed Esci." });

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

  // ------------------------------------------------------------------ Menu in gioco e Canto delle Maschere
  function zoneMenu() {
    const c = activeChapter(), m = mem(), h = hero();
    const opts = [
      { label: "Canto delle Maschere", sub: `Maschere possedute: ${m.masks.length} · Il cammino di ${h ? h.name : "Leo"}`, fn: () => notebook(done, true) },
      { label: "Resta a esplorare", fn: done },
      { label: "◂ Esci al Menu Belovodia", fn: () => { api.trLeave(); openMain(); } }
    ];
    api.scene(bgNow(), "voce", `<b>🌲 Il Canto di Belovodia</b><br>${c ? esc("Capitolo " + c.n + ": " + c.title) : ""}<br><span style="color:var(--dim)">${esc(goalNow())}</span>`, opts, "Belovodia · Menu");
  }

  function notebook(backFn, fromZone) {
    const m = mem(), h = hero();
    const masksList = m.masks.length ? m.masks.map((k) => `• <b>${esc(k.toUpperCase())}</b>`).join("<br>") : "<i>Nessuna maschera ancora risvegliata.</i>";
    const chronicle = m.log.length ? m.log.slice(-6).map((l) => `• ${esc(l)}`).join("<br>") : "<i>Il vento copre le orme recenti.</i>";
    api.scene(
      bgNow(), "voce",
      `<b>🎭 Il Canto delle Maschere Ancestrali</b><br>Taccuino spirituale di ${h ? esc(h.name) : "Campione"}<br><br><span style="color:#38bdf8"><b>MASCHERE DEL BOSCO:</b></span><br>${masksList}<br><br><span style="color:#fbbf24"><b>CRONACHE DEL DISGELO:</b></span><br>${chronicle}`,
      [{ label: "◂ Chiudi Taccuino", fn: backFn || done }],
      "Canto delle Maschere"
    );
  }

  function goalNow() {
    const c = activeChapter();
    return (c && c.goal && c.goal(stepOf(c.n))) || "Esplora il villaggio e parla con gli abitanti.";
  }

  function finishChapter(n, endingId) {
    const m = mem();
    m.done[n] = endingId || "completato";
    if (m.ch === n && CHAPTERS[n + 1]) m.ch = n + 1;
    save();
  }

  let inMatch = false;
  const XTOOLS = {
    T, F, S: () => stepOf(activeChapter().n), stepOf, setStep, note, addMask, once, reward, hero, esc,
    say, ask, done, go, finishChapter, bgNow,
    sfxWind: sfxBelovodiaWind, sfxMask: sfxBelovodiaMaskEquip, sfxCrack: sfxBelovodiaIceCrack, sfxChimes: sfxBelovodiaChimes,
    cast: (id, c, bio) => {
      if (!api) { CAST_Q.push([id, c, bio]); return; }
      if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c);
      if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio;
    },
    cos: (id, d) => {
      if (!api) { COS_Q.push([id, d]); return; }
      if (api.COSM && !api.COSM[id]) api.COSM[id] = d;
    },
    playMatch: (cfg) => {
      inMatch = true;
      const prevDone = cfg.done;
      cfg.onDone = (res) => {
        inMatch = false;
        if (typeof prevDone === "function") prevDone(res);
      };
      if (api.matchPick) api.matchPick(cfg); else api.match(cfg);
    }
  };

  // ------------------------------------------------------------------ CAPITOLO 1: IL VARCO DELLE BETULLE
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, reward, esc, addMask, sfxMask, sfxWind } = X;
    const N = 1, S = () => X.stepOf(N);

    // Personaggi del Capitolo 1
    X.cast("bv_boris", {
      name: "Nonno Boris", tag: "intagliatore", hair: "#cbd5e1", style: "buzz", skin: "#d49b6a", eye: "#1e293b",
      beard: true, bg: ["#1e293b", "#78350f"], shirt: "#451a03"
    }, "L'antico mastro intagliatore di Belovodia. Cieco dalla grande tormenta, legge i nodi del legno con le dita e custodisce il segreto delle Tre Maschere Ancestrali.");

    X.cast("bv_nadia", {
      name: "Nadezhda", tag: "cacciatrice", hair: "#291811", style: "messy", skin: "#f3d2b8", eye: "#d97706",
      bg: ["#0f172a", "#991b1b"], shirt: "#991b1b"
    }, "Giovane e scaltra cacciatrice con maschera di volpe e pelliccia bianca. Veloce sui pattini di legno e diffidente verso chiunque arrivi dal mondo oltre la tormenta.");

    X.cast("bv_guardia", {
      name: "Guardiano del Gelo", tag: "boiardo", hair: "#475569", style: "slick", skin: "#e0a97d", eye: "#0284c7",
      beard: true, cap: "#1e293b", bg: ["#091220", "#38bdf8"], shirt: "#1e293b"
    }, "Sentinella dei cancelli della radura. Indossa una pesante pelliccia di lupo e diffida dei forestieri.");

    X.cast("bv_falco", {
      name: "Spirito del Falco", tag: "spirito", hair: "#f8fafc", style: "long", skin: "#f1f5f9", eye: "#fbbf24",
      bg: ["#0369a1", "#38bdf8"], shirt: "#0284c7"
    }, "L'antico spirito alato dell'inverno boreale. Simbolo di visione acuta, precisione chirurgica e libertà.");

    // Cosmetico Capitolo 1
    X.cos("bv_maschera_falco", {
      id: "bv_maschera_falco",
      label: "Maschera del Falco di Belovodia",
      sub: "Maschera in legno di betulla con occhi dorati, intagliata da Nonno Boris.",
      cat: "cappello",
      val: 0
    });

    const goal = (s) => {
      if (s === 0) return "Parla con Nadezhda nella piazza di Belovodia.";
      if (s === 1) return "Raggiungi la Bottega di Nonno Boris ed entra per consultarlo.";
      if (s === 2) return "Esamina l'altare delle maschere nella bottega e sintonizzati con il Falco.";
      if (s === 3) return "Raggiungi la Radura del Gelo a nord per la prova sul campo.";
      if (s === 4) return "Affronta la Guardia del Gelo nella partita cerimoniale sul ghiaccio.";
      return "Hai superato la Prova del Falco. Il cammino verso il Lago è aperto!";
    };

    // Zone del Capitolo 1
    const zones = {
      bv_villaggio: {
        name: "Piazza di Belovodia", short: "Belovodia · Il Borgo Innevato",
        sub: "Case di tronchi con comignoli fumanti, lanterne e betulle secolari",
        w: 24, h: 22, start: [12, 16], bg: "bv_villaggio", theme: "torino",
        item: ["Piuma di Betulla", "Piume"],
        build(Ls) {
          const { lay, put } = Ls;
          // Pavimento innevato
          lay(0, 0, 23, 21, ",");
          // Sentiero battuto in assi di pino
          lay(11, 1, 13, 19, "p");
          lay(6, 8, 11, 10, "p");
          lay(13, 11, 17, 13, "p");

          // Palizzata nord con varco d'uscita per la radura
          lay(0, 0, 10, 0, "A");
          lay(14, 0, 23, 0, "A");
          put(11, 0, "^"); put(12, 0, "^"); put(13, 0, "^");

          // Palizzata perimetrale
          for (let y = 1; y < 21; y++) { put(0, y, "A"); put(23, y, "A"); }
          lay(0, 21, 23, 21, "A");

          // Izba di Boris (a sinistra)
          lay(2, 4, 8, 7, "A");
          put(6, 7, "u"); // Porta dell'izba
          put(4, 5, "J"); // Finestra
          put(7, 4, "S"); // Comignolo
          put(2, 8, "x"); // Catasta di legna

          // Izba dei guardiani (a destra)
          lay(15, 4, 21, 7, "A");
          put(17, 7, "u");
          put(19, 5, "J");
          put(21, 8, "x");

          // Elementi della piazza
          put(12, 11, "F"); // Pozzo sacro gelato
          put(9, 13, "B");  // Braciere sinistro
          put(15, 13, "B"); // Braciere destro
          put(10, 15, "l"); // Lanterna
          put(14, 15, "l"); // Lanterna
          put(8, 7, "M");   // Totem
          put(8, 12, "b");  // Panca
          put(18, 14, "k"); // Idolo dello Zar
        },
        npcs(s) {
          const list = [];
          if (s <= 1) list.push({ id: "bv_nadia", at: [14, 14] });
          else list.push({ id: "bv_nadia", at: [12, 3] });
          if (s === 0) list.push({ id: "bv_boris", at: [8, 11] });
          list.push({ id: "bv_guardia", at: [12, 2] });
          return list;
        }
      },

      bv_bottega: {
        name: "Bottega di Nonno Boris", short: "L'Atelier delle Maschere",
        sub: "Profumo di resina, trucioli arricciati e stufa in ghisa ardente",
        w: 16, h: 14, start: [7, 10], bg: "bv_bottega", theme: "torino",
        item: ["Truciolo d'Argento", "Trucioli"],
        build(Ls) {
          const { lay, put } = Ls;
          // Mura
          lay(0, 0, 15, 13, "A");
          // Pavimento in parquet caldo dell'izba
          lay(1, 1, 14, 12, "w");
          // Tappeto slavo al centro
          lay(5, 5, 10, 9, "c");
          // Stufa russa in ghisa in alto a destra
          put(12, 2, "S"); put(13, 2, "S");
          // Banco da lavoro in alto a sinistra
          put(3, 3, "T"); put(4, 3, "T");
          // Rastrelliere delle maschere
          put(7, 2, "M"); put(8, 2, "M");
          // Altare della Maschera del Falco
          put(8, 4, "H");
          // Finestre
          put(2, 6, "J"); put(13, 6, "J");
          // Cataste di ceppi e panche
          put(2, 10, "x"); put(13, 10, "x");
          put(4, 8, "b");
          // Porta d'uscita a sud
          put(7, 12, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "bv_boris", at: [5, 4] });
          return list;
        }
      },

      bv_radura: {
        name: "La Radura del Gelo", short: "Il Campo delle Betulle",
        sub: "Campo cerimoniale tra betulle d'argento e aurora boreale",
        w: 24, h: 22, start: [12, 19], bg: "bv_radura", theme: "torino",
        item: ["Ghiacciolo Boreale", "Ghiaccioli"],
        build(Ls) {
          const { lay, put } = Ls;
          // Neve candida
          lay(0, 0, 23, 21, ",");
          // Cerchio di betulle perimetrale
          for (let x = 0; x < 24; x++) { put(x, 0, "A"); put(x, 21, "A"); }
          for (let y = 1; y < 21; y++) { put(0, y, "A"); put(23, y, "A"); }

          // Campo di calcio cerimoniale innevato
          lay(4, 4, 19, 16, "y");
          // Linea mediana e cerchio di ghiaccio
          for (let x = 4; x <= 19; x++) put(x, 10, ":");
          put(11, 10, ":"); put(12, 10, ":");

          // Porte cerimoniali con corna di cervo
          put(11, 3, "G"); put(12, 3, "G");
          put(11, 17, "G"); put(12, 17, "G");

          // Bracieri ardenti ai lati
          put(3, 7, "B"); put(20, 7, "B");
          put(3, 13, "B"); put(20, 13, "B");

          // Lanterne ai 4 angoli
          put(4, 4, "l"); put(19, 4, "l");
          put(4, 16, "l"); put(19, 16, "l");

          // Totem e idoli
          put(7, 2, "M"); put(16, 2, "M");
          put(12, 1, "k");

          // Varco di ritorno a sud
          put(12, 21, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "bv_nadia", at: [10, 11] });
          list.push({ id: "bv_guardia", at: [14, 11] });
          if (s >= 3 && s <= 4) list.push({ id: "bv_falco", at: [12, 7] });
          return list;
        }
      }
    };

    // Dialoghi Capitolo 1
    function nadiaTalk1() {
      const s = S();
      if (s === 0) {
        return say([
          ["bv_nadia", "Fermo lì, straniero! Chi sei e come hai fatto a superare la bufera senza congelare?"],
          ["hero", "Mi chiamo {n}. Ero sui campi della costa quando una tormenta violenta ha inghiottito il sentiero. Mi sono risvegliato qui con il mio pallone."],
          ["bv_nadia", "(Ti squadra con la maschera di volpe, poi nota il numero {num} sulla maglia) Una sfera di cuoio... e nessun'arma. Sei finito a Belovodia, il borgo dimenticato dallo scorrere del tempo."],
          ["bv_nadia", "Nessun mortale attraversa la taiga dello Zar Moroz senza una guida. Parla con Nonno Boris laggiù vicino al pozzo: solo lui può capire se sei una benedizione o una sciagura."],
        ], () => {
          setStep(N, 1);
          note("Incontro con Nadezhda: il Campione è giunto a Belovodia oltre il varco della tormenta.");
          done();
        });
      }
      if (s === 1) {
        return say([
          ["bv_nadia", "Nonno Boris è tornato nella sua bottega a sinistra. Entra dalla porta pesante in legno. Se ti ha concesso udienza, non farlo attendere."],
        ], done);
      }
      if (s === 2) {
        return say([
          ["bv_nadia", "Sento l'odore della corteccia di betulla e della pece. Sintonizzati con l'altare della bottega, {n}."],
        ], done);
      }
      if (s === 3) {
        return ask("bv_nadia", "«Vedo la Maschera del Falco sul tuo volto, {n}. I suoi occhi d'oro risuonano con il tuo spirito. Sei pronto per la prova del campo cerimoniale a nord?»", [
          {
            label: "⚡ «Andiamo alla Radura del Gelo! Mostrerò il tiro «{tiro}»!»",
            cls: "hot",
            fn: () => {
              setStep(N, 4);
              go("bv_radura", 12, 18);
            }
          },
          { label: "«Dammi un attimo per prepararmi»", fn: done }
        ]);
      }
      if (s === 4) {
        return ask("bv_nadia", "«La Guardia del Gelo è schierata sul campo. Sei pronto a calciare sul ghiaccio vivo?»", [
          {
            label: "⚽ «Fischia l'inizio della partita!»",
            cls: "hot",
            fn: startMatch1
          },
          { label: "«Sto studiando il vento boreale»", fn: done }
        ]);
      }
      return say([
        ["bv_nadia", "Hai sconfitto i guardiani sul ghiaccio, {n}. Forse le antiche leggende sulle ali di rondine non erano solo favole per addormentare i bambini."],
      ], done);
    }

    function borisTalk1() {
      const s = S();
      if (s === 0 || s === 1) {
        return say([
          ["bv_boris", "(Muove lentamente le mani nell'aria, sentendo il calore del tuo respiro) Non temere, ragazzo. I miei occhi non vedono la luce del sole da trent'anni, ma sento il battito del tuo cuore."],
          ["hero", "Boris, signore... dicono che lei possa spiegarmi come uscire da questa foresta gelata."],
          ["bv_boris", "Uscire? (Sorride con dolcezza amara) Da Belovodia non si esce camminando all'indietro. Da quando lo Zar Moroz si è chiuso nel suo palazzo di ghiaccio, la foresta imprigiona chiunque non conosca il Canto delle Maschere."],
          ["bv_boris", "Vieni nella mia bottega. C'è té caldo sul samovar e un pezzo di legno di betulla che attende le tue mani."],
        ], () => {
          setStep(N, 1);
          done();
        });
      }
      if (s === 2) {
        return say([
          ["bv_boris", "L'altare al centro della bottega custodisce la Maschera del Falco d'Argento. Avvicinati ed esaminala. Il legno parlerà alla tua anima."],
        ], done);
      }
      if (s === 3 || s === 4) {
        return say([
          ["bv_boris", "Il Falco è la maschera della visione lontana e del tiro preciso come un raggio di luna. Portala con onore sulla Radura del Gelo."],
        ], done);
      }
      return say([
        ["bv_boris", "Hai scaldato il ghiaccio della radura con il tuo coraggio. Ma il cammino è appena iniziato: il Lago dei Silenzi a ovest attende la Maschera dell'Orso."],
      ], done);
    }

    function guardiaTalk1() {
      const s = S();
      if (s < 3) {
        return say([
          ["bv_guardia", "L'accesso alla Radura del Gelo è riservato a chi possiede una maschera intagliata. Torna indietro, forestiero."],
        ], done);
      }
      if (s === 3 || s === 4) {
        return ask("bv_guardia", "«Porti la Maschera del Falco. Ma il calcio dei boschi non perdona chi scivola. Vuoi sfidare i Custodi del Bosco Bianco?»", [
          {
            label: "⚔️ «Accetto la sfida sul ghiaccio!»",
            cls: "hot",
            fn: () => {
              if (s === 3) setStep(N, 4);
              startMatch1();
            }
          },
          { label: "«Aspetto ancora un momento»", fn: done }
        ]);
      }
      return say([
        ["bv_guardia", "Un tiro impressionante. Quel pallone sembrava una cometa scagliata attraverso la nebbia."],
      ], done);
    }

    function falcoTalk1() {
      return say([
        ["bv_falco", "«Io sono il vento che scavalca le vette innevate. Chi indossa il mio volto non teme la distanza né la bufera. Mira alla rete e calcia, Campione!»"],
      ], done);
    }

    function esaminaAltareFalco() {
      if (S() !== 2) {
        return say([["voce", "L'altare di betulla: profuma di resina antica e aghi di pino."]], done);
      }
      sfxBelovodiaChimes();
      ask("voce", "La Maschera del Falco d'Argento riposa su un cuscino di muschio boreale. Come decidi di sintonizzarti con il suo spirito?", [
        {
          label: "🕊️ «Ascolto il respiro del vento boreale e cerco l'armonia con il bosco»",
          sub: "Via della Grazia Spirituale (scelta morale per il finale)",
          cls: "hot",
          fn: () => {
            F.set("bv_scelta_1", "spirito");
            concludiSintonizzazione("spirito");
          }
        },
        {
          label: "⚡ «Concentro la grinta del mio tiro «{tiro}» per accendere il legno!»",
          sub: "Via della Volontà e del Fuoco Mortale (scelta morale per il finale)",
          cls: "hot",
          fn: () => {
            F.set("bv_scelta_1", "volonta");
            concludiSintonizzazione("volonta");
          }
        },
        {
          label: "🏹 «Chiedo la guida di Nadezhda per onorare le tradizioni dei cacciatori»",
          sub: "Via del Popolo di Belovodia (scelta morale per il finale)",
          fn: () => {
            F.set("bv_scelta_1", "popolo");
            concludiSintonizzazione("popolo");
          }
        }
      ]);
    }

    function concludiSintonizzazione(scelta) {
      sfxMask();
      addMask("falco", "La Maschera del Falco d'Argento", "Permette tiri tesi e precisi dalla lunga distanza, ignorando il vento.");
      setStep(N, 3);
      const descScelta = scelta === "spirito"
        ? "Hai respirato la quiete millenaria degli spiriti, unendo la tua anima al silenzio della neve."
        : scelta === "volonta"
          ? "Hai impresso il calore ribelle del tuo cuore sul legno gelato, risvegliando il falco con puro ardore."
          : "Hai reso omaggio alla memoria dei cacciatori, ponendo il destino della gente di Belovodia al centro.";
      note(`MASCHERA DEL FALCO RISVEGLIATA (${scelta.toUpperCase()}): ${descScelta}`);

      say([
        ["voce", "Un bagliore azzurro e dorato avvolge la bottega! Il legno di betulla si adatta perfettamente ai lineamenti del tuo volto."],
        ["bv_boris", "(Solleva il capo annuendo) La maschera ha accettato il tuo spirito, {n}. Ora le tue pupille vedono le traiettorie dell'aria."],
        ["hero", "Sento l'aria scorrere leggera... posso mirare con una precisione millimetrica anche in mezzo alla tormenta!"],
        ["bv_boris", "Ora va' da Nadezhda e dalla guardia alla Radura del Gelo a nord. È tempo di mostrare la tua arte sul campo cerimoniale."],
      ], done);
    }

    function startMatch1() {
      sfxWind();
      X.playMatch({
        id: "bv_match_1",
        alt: "hd,az", azPitch: "neve",
        oppNames: ["Gelo Eterno", "Corteccia", "Brina", "Tormenta", "Lupo Bianco"],
        squad: ["Nadezhda", "Sentinella Boreale", "Guardiano delle Betulle"],
        chap: "Belovodia · La Prova del Falco",
        us: "I Cacciatori del Disgelo",
        mate: "Nadezhda",
        min: 45,
        intro: "PRIMA SFIDA DI BELOVODIA! Il tuo Campione {n} sfida i Custodi del Bosco Bianco sul terreno ghiacciato della Radura!",
        team: (t, st) => ({
          name: "I Custodi del Bosco Bianco",
          col: "#0284c7",
          style: "Pressione sul Ghiaccio & Difesa Granitica",
          atk: t(st.atk * 1.05),
          def: t(st.def * 1.15),
          vel: t(st.vel * 1.0),
          specials: ["Soffio della Bufera", "Muro di Brina"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 5);
            note("VITTORIA NELLA PROVA DEL FALCO! Il tiro del Campione ha sbaragliato i difensori del bosco.");
            const rewMsg = reward("bv_ch1_complete", {
              coins: 250,
              cos: "bv_maschera_falco"
            });
            finishChapter(N, "falco_superato");
            say([
              ["voce", "GOOOOOOOL FANTASTICOOOO! La sfera colpisce l'incrocio tra i rami e le corna di cervo, facendo scendere una pioggia di faville e cristalli di ghiaccio!"],
              ["bv_guardia", "Incredibile... non avevo mai visto una parabola tagliare la bufera con tale purezza."],
              ["bv_nadia", "(Ti si avvicina togliendosi per un attimo la maschera e sorridendoti) Benvenuto tra noi, {n}. Ora nessuno potrà più negare che sei un vero cacciatore."],
              ["bv_boris", "La prima prova è vinta. Ma all'orizzonte ovest, il Lago dei Silenzi continua a gelare... Il Capitolo 2 ti attende presto!"],
              ["voce", `CAPITOLO 1 COMPLETATO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("bv_villaggio", 12, 16);
            });
          } else {
            say([
              ["bv_guardia", "Il ghiaccio ha tradito i tuoi passi! Riorganizza il respiro e sfida di nuovo il Bosco Bianco!"],
            ], done);
          }
        }
      });
    }

    const obj = {
      "bv_villaggio:u": () => go("bv_bottega", 7, 10),
      "bv_villaggio:^": () => {
        if (S() < 3) say([["voce", "La via verso la Radura del Gelo è bloccata: devi prima ottenere la Maschera del Falco da Nonno Boris."]], done);
        else go("bv_radura", 12, 18);
      },
      "bv_villaggio:F": () => say([["voce", "Il pozzo sacro di pietra: la superficie è coperta da una lastra di ghiaccio spesso, ma sotto l'acqua pulsa di luce verdina."]], done),
      "bv_villaggio:B": () => say([["voce", "I rami di conifera scoppiettano nel braciere, diffondendo un profumo resinoso e un calore ristoratore."]], done),
      "bv_villaggio:k": () => say([["voce", "L'idolo di legno antico dello Zar Moroz: le corna di cervo innevate vegliano silenziose sul villaggio."]], done),
      "bv_villaggio:x": () => say([["voce", "Ceppi di betulla spaccati di fresco e impilati contro il gelo notturno."]], done),

      "bv_bottega:d": () => go("bv_villaggio", 6, 8),
      "bv_bottega:H": esaminaAltareFalco,
      "bv_bottega:S": () => say([["voce", "La grande stufa russa in ghisa: il calore dei ceppi scoppietta allegro, proteggendo la bottega dalla tormenta."]], done),
      "bv_bottega:T": () => say([["voce", "Il banco di lavoro di Nonno Boris: sgorbie affilatissime, pialle d'epoca e trucioli di corteccia argentea profumata."]], done),
      "bv_bottega:M": () => say([["voce", "Maschere di volpi, gufi e lupi intagliate con maestria: sembrano respirare nella penombra dorata."]], done),

      "bv_radura:d": () => go("bv_villaggio", 12, 1),
      "bv_radura:G": () => say([["voce", "Le porte del campo cerimoniale: rami di betulla intrecciati a maestose corna di cervo fossile."]], done),
      "bv_radura:B": () => say([["voce", "I bracieri cerimoniali della radura segnano il confine sacro dove le leggi degli spiriti incontrano il gioco del calcio."]], done)
    };

    const talk = {
      bv_nadia: nadiaTalk1,
      bv_boris: borisTalk1,
      bv_guardia: guardiaTalk1,
      bv_falco: falcoTalk1
    };

    return {
      n: N,
      title: "Il Varco delle Betulle · La Maschera del Falco",
      sub: "L'arrivo a Belovodia, l'incontro con Nonno Boris e il risveglio della prima maschera",
      start: "bv_villaggio",
      zones,
      talk,
      obj,
      goal,
      intro: () => [
        ["voce", "BELOVODIA · CAPITOLO 1: IL VARCO DELLE BETULLE", "bv_villaggio"],
        ["voce", "Inghiottito da una tormenta sovrannaturale mentre calciavi sulle coste liguri, ti risvegli tra fitte foreste di betulle d'argento.", "bv_villaggio"],
        ["voce", "Davanti a te sorge Belovodia: un borgo immoto fuori dal tempo, prigioniero dell'Inverno Eterno dello Zar Moroz.", "bv_villaggio"],
        ["voce", "Per trovare la via del ritorno e scaldare il cuore della foresta, dovrai imparare l'arte delle Maschere Ancestrali!", "bv_villaggio"]
      ]
    };
  });

  // ------------------------------------------------------------------ Interfaccia Principale
  function leaveToModes() {
    const back = EXIT || window.title;
    EXIT = null;
    api.trExitTo(typeof back === "function" ? back : null);
  }

  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    reload();
    const h = hero();
    if (!h) {
      return api.scene(
        "bv_villaggio", "voce",
        "<b>Il Canto di Belovodia · Il Bosco delle Maschere</b><br>Questa saga nel folklore innevato richiede il tuo Campione: nome, aspetto, numero e tiro speciale sono protagonisti assoluti.<br><br>Prima crea il tuo campione nel menu!",
        [
          { label: "Crea il tuo Campione", sub: "Nome, look e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
          { label: "◂ Torna alle Modalità", fn: leaveToModes }
        ],
        "Belovodia"
      );
    }

    castHero();
    const c = activeChapter(), m = mem(), isSagaComplete = !!(m.done[4]), curDone = c && m.done[c.n];
    const statusText = isSagaComplete
      ? "❄️ <b>Saga di Belovodia Completata!</b> Tutti i capitoli e il verdetto finale sono stati raggiunti."
      : curDone
        ? `Capitolo ${c.n} concluso con successo! Il prossimo capitolo ti attende.`
        : esc(goalNow());

    api.scene(
      "bv_villaggio", "voce",
      `<b>🌲 Il Canto di Belovodia · Il Bosco delle Maschere</b><br>${esc(h.name)} · n. ${esc(h.num)} (Cacciatore del Disgelo)<br><span style="color:var(--dim)">«${esc(h.shotName || "Il Tiro del Bosco")}»</span><br><br><span style="color:#38bdf8">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}</span><br><span style="color:var(--dim)">${statusText}</span>`,
      [
        {
          label: isSagaComplete
            ? "Esplora Belovodia"
            : c && !m.intro["ch" + c.n]
              ? `Inizia il Capitolo ${c.n}`
              : "Continua la Storia",
          sub: c ? `Capitolo ${c.n} · ${c.title}` : "",
          cls: "hot",
          fn: continueStory
        },
        { label: "Canto delle Maschere", sub: `Maschere ${m.masks.length} · Il taccuino di ${h.name}`, fn: () => notebook(openMain, false) },
        { label: "Capitoli della Saga", sub: "Esplora o rigioca i capitoli sbloccati", fn: chaptersList },
        { label: "◂ Torna alle Modalità", fn: leaveToModes }
      ],
      "Belovodia"
    );
  }

  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    const isNew = !m.intro["ch" + c.n];
    if (isNew) {
      m.intro["ch" + c.n] = 1; save();
      if (c.intro) {
        return say(c.intro(), () => {
          go(c.start || "bv_villaggio", 12, 16);
        });
      }
    }
    const tr = api.trRec();
    const curZ = (m.zone && ZONES[m.zone]) ? m.zone : (c.start || "bv_villaggio");
    if (!tr.pos[curZ]) {
      const zr = ZONES[curZ];
      const st = (zr && zr.spec.start) || [12, 16];
      tr.pos[curZ] = [st[0] * TS + 8, st[1] * TS + 12];
    }
    enterZone(curZ);
  }

  function chaptersList() {
    const m = mem(), opts = [];
    for (let n = 1; n <= 4; n++) {
      const c = CHAPTERS[n];
      const isUnlocked = (n === 1 || m.done[n - 1] || m.ch >= n);
      if (c && isUnlocked) {
        opts.push({
          label: `${m.done[n] ? "✓" : "▸"} Capitolo ${n}: ${c.title}`,
          sub: m.done[n] ? `Completato (${m.done[n]}) · Clicca per giocare` : (c.sub || "In corso"),
          cls: m.ch === n ? "hot" : "",
          fn: () => {
            m.ch = n;
            save();
            continueStory();
          }
        });
      } else {
        opts.push({
          label: `• Capitolo ${n}: ${c ? c.title : "Prossimamente"}`,
          sub: "Completa il capitolo precedente per sbloccarlo",
          disabled: true
        });
      }
    }
    opts.push({ label: "Ricomincia da Capo", sub: "Azzera capitoli e scelte (monete e cosmetici restano salvati)", fn: resetConfirm });
    opts.push({ label: "◂ Indietro", fn: openMain });

    api.scene(
      "bv_villaggio", "voce",
      `<b>🌲 I Capitoli di Belovodia</b><br>La saga a capitoli nel folklore d'inverno. Maschere spiritiche, scelte morali e finali esclusivi determinano il destino del villaggio.<br><br><span style="color:var(--dim)">Seleziona un capitolo sbloccato per entrarvi:</span>`,
      opts,
      "Belovodia · Capitoli"
    );
  }

  function resetConfirm() {
    api.scene(
      "bv_villaggio", "voce",
      "<b>Ricominciare la Saga di Belovodia?</b><br>I progressi dei capitoli, le maschere raccolte e le scelte verranno azzerati. Le monete e gli accessori del guardaroba rimarranno salvati.",
      [
        { label: "Sì, azzera e ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
        { label: "◂ Annulla", fn: chaptersList }
      ],
      "Belovodia"
    );
  }

  // ------------------------------------------------------------------ Pulsante Esci e Avvio
  function setupExitButton() {
    const existing = document.getElementById("bvExit");
    if (existing) return;
    const st = document.createElement("style");
    st.textContent = `
      #bvExit {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 36px; padding: 6px 14px; border-radius: 10px;
        border: 1px solid rgba(56, 189, 248, 0.6); background: rgba(15, 23, 42, 0.92);
        color: #e0f2fe; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6); cursor: pointer;
      }
      #bvExit.on { display: block; }
      #bvExit:active { transform: translateY(1px); }
    `;
    document.head.appendChild(st);

    const btn = document.createElement("button");
    btn.id = "bvExit"; btn.type = "button";
    btn.textContent = "✕ Esci da Belovodia";
    btn.onclick = () => {
      if (inMatch) {
        const h = document.getElementById("homeBtn");
        if (h) h.click();
        return;
      }
      if (zoneRec()) { api.trLeave(); openMain(); }
    };
    document.body.appendChild(btn);

    setInterval(() => {
      const live = !!(zoneRec() && document.body.classList.contains("borgo"));
      btn.classList.toggle("on", live);
    }, 400);
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
    installHooks();
    PENDING.splice(0).forEach(registerChapterZones);
    setupExitButton();
  }

  // Esportazione Globale dell'API
  window.__belovodiaStory = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "🌲 Belovodia · Il Bosco delle Maschere",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Folklore slavo e Maschere Ancestrali"}`
          : "Crea prima il tuo campione · Saga dark fantasy nel folklore slavo"
      };
    },
    info() {
      const m = mem();
      return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), masks: m.masks.length };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
