// ============================================================================
// RAGNAROK BALL · IL FUOCO DI FIMBULWINTER
// Saga Dark Fantasy & Mito Norreno per il Tuo Campione
// Ispirata a God of War (Norse), Vinland Saga e Hades
// Motore 2D Camminabile HD con Furia Berserker, Crepe Telluriche e Scelte Divine
// ============================================================================
(function () {
  "use strict";
  if (window.__ragnarokStoryLoaded) return;
  window.__ragnarokStoryLoaded = true;

  const KEY = "ali-di-rondine.ragnarok";
  const TS = 16;
  let tries = 0, api = null, inMatch = false, EXIT = null;
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
  const rnd = (tx, ty, k) => hash(tx * 83 + ty * 149 + k * 29) / 4294967296;

  // ------------------------------------------------------------------ Audio Synthesizer (Corni Vichinghi, Tamburi e Lava)
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  function sfxRagnarokHorn() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Corno da guerra profondo di Gjallarhorn
      [98.0, 146.83, 196.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq * 0.95, now + idx * 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 1.2);
        g.gain.setValueAtTime(0.01, now);
        g.gain.linearRampToValueAtTime(0.2, now + 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + idx * 0.05); osc.stop(now + 1.35);
      });
    } catch (e) {}
  }

  function sfxRagnarokDrum() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);
      g.gain.setValueAtTime(0.35, now);
      g.gain.exponentialRampToValueAtTime(0.002, now + 0.45);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.45);
    } catch (e) {}
  }

  function sfxRagnarokLavaCrack() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [220, 310, 180, 95].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + i * 0.04 + 0.15);
        g.gain.setValueAtTime(0.18, now + i * 0.04);
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.04 + 0.16);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.04); osc.stop(now + i * 0.04 + 0.18);
      });
    } catch (e) {}
  }

  function sfxRagnarokValkyrie() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.16, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.002, now + i * 0.08 + 0.5);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.55);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Salvataggio normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  function norm(o) {
    o = obj(o);
    const m = {
      v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {},
      zone: "", fury: clampI(o.fury, 0, 100, 0), runes: [], log: [], intro: {},
      wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0)
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
    m.runes = [...new Set(arr(o.runes).filter((x) => typeof x === "string"))].slice(0, 20);
    m.log = arr(o.log).filter((x) => typeof x === "string").map((x) => x.slice(0, 240)).slice(-120);
    Object.keys(obj(o.intro)).forEach((k) => { if (FLAG_RE.test(k)) m.intro[k] = 1; });
    return m;
  }

  let MEM = null;
  const mem = () => MEM || (MEM = norm(safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {})));
  const save = () => { safe(() => localStorage.setItem(KEY, JSON.stringify(mem()))); };

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
  const addRune = (id, name, desc) => {
    const m = mem();
    if (!m.runes.includes(id)) {
      m.runes.push(id); save();
      sfxRagnarokValkyrie();
      if (api && api.trToast) api.trToast(`ᚱ Nuova Runa Divina: ${name}`);
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
    saetta: "una freccia di fulmine lavico che sibila nel ghiaccio",
    serpentina: "un solco fuso che serpeggia tra i banchi di permafrost",
    parabola: "un arco fiammeggiante che scavalca i totem come un drakkar celeste",
    martello: "un impatto sismico di Mjolnir che schianta il terreno in mille crepe",
    traversa: "un fendente radente che rimbalza con boato di tuono",
    saudade: "una scia crepuscolare che scalda il gelo della tundra",
    muro: "un blocco di basalto incandescente che travolge ogni contrasto"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "COLPO DEL VULCANO", shot: "martello" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "COLPO DEL VULCANO")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un tiro antico di fuoco primordiale");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "einherjar", hair: h.hair, style: h.style, skin: h.skin, eye: "#f59e0b",
      bg: ["#1c1917", "#ef4444"], shirt: "#991b1b", num: String(h.num), acc: h.acc,
      cap: h.acc === "cappellino" ? "#1c1917" : h.acc === "berretto" ? "#991b1b" : undefined
    };
  }

  const coinsGive = (n) => {
    if (n > 0 && typeof window.addCoins === "function") {
      try { window.addCoins(n); return n; } catch (e) { return 0; }
    }
    return 0;
  };

  // ------------------------------------------------------------------ Set di Tessere 16x16 (Pixel Art Ragnarok)
  // Pavimenti:
  //   , = neve compatta con brina e orme
  //   p = tavole di pino vichingo nodose
  //   m = legno affumicato della Sala Comune
  //   l = lastre di basalto lavico con crepe incandescenti
  //   c = cenere vulcanica mista a brina
  //   : = lastra di ghiaccio spesso con crepe infuocate
  //   y = terra cerimoniale con linee runiche incise
  // Solidi / Oggetti:
  //   A = palizzata di tronchi con teschi e neve
  //   K = prua a testa di drago della Drakkar
  //   T = totem runico con corna d'alce
  //   F = braciere votivo lavico fumante
  //   W = altare della Sfera Magmatica
  //   R = monolite runico inciso
  //   J = scudi vichinghi tondi appesi
  //   H = camino monumentale con ceppi ardenti
  //   G = porta cerimoniale da calcio in ossa e legno di drakkar
  //   u = portone in legno ferrato
  //   x = catasta di legna coperta da pelli
  //   b = panca di quercia
  //   ^ > < d = varchi della costa e sentieri
  const FLOORS = ',pml:cy';
  const SOLID = 'AKTFWRJHGuxb^><du';
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);

  const ZX = { map: null, under: null, id: "", cvs: null };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "A";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";

  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const frNow = () => Math.floor(performance.now() / 16);

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 5);
    if (f === ",") {
      // Neve compatta con permafrost
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#e2e8f0" : "#cbd5e1");
      if (r < 0.2) P(sx + 2, sy + 3, 3, 2, "#94a3b8");
      if (r > 0.8) P(sx + 8, sy + 9, 2, 2, "#f8fafc");
      if ((tx * 3 + ty) % 11 === 0) P(sx + 5, sy + 5, 2, 1, "#f97316"); // Scintilla di lava
    } else if (f === "p") {
      // Assi di pino intagliate con nodi
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#451a03" : "#2e1065" ? "#3b1a0a" : "#451a03");
      P(sx, sy + 7, 16, 1, "#1c0b03");
      P(sx + (ty % 2 ? 4 : 11), sy, 1, 7, "#1c0b03");
      P(sx + (ty % 2 ? 11 : 4), sy + 8, 1, 8, "#1c0b03");
      if (r < 0.15) P(sx + 6, sy + 2, 3, 2, "#b45309");
    } else if (f === "m") {
      // Parquet affumicato della Sala del Mead
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#27150c" : "#1c0e08");
      P(sx, sy + 15, 16, 1, "#0c0503");
      if (r < 0.2) P(sx + 3, sy + 4, 2, 8, "#3d2012");
    } else if (f === "l") {
      // Basalto lavico nero con crepe ardenti
      P(sx, sy, 16, 16, "#1c1917");
      P(sx + 3, sy + 4, 10, 1, "#ea580c");
      P(sx + 5, sy + 5, 6, 2, "#f97316");
      P(sx + 7, sy + 6, 2, 1, "#fef08a"); // Cuore fuso
      if (r > 0.6) P(sx + 11, sy + 10, 3, 1, "#ea580c");
    } else if (f === "c") {
      // Cenere vulcanica mista a brina
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#334155" : "#1e293b");
      if (r < 0.3) P(sx + 2, sy + 2, 2, 2, "#64748b");
      if (r > 0.7) P(sx + 9, sy + 7, 3, 2, "#cbd5e1");
    } else if (f === ":") {
      // Ghiaccio profondo con riflessi e crepe
      P(sx, sy, 16, 16, "#0f2744");
      P(sx + 2, sy + 2, 12, 12, "#1e3a8a");
      P(sx + 4, sy + 6, 8, 1, "#60a5fa");
      P(sx + 7, sy + 3, 1, 7, "#93c5fd");
      if (r < 0.3) P(sx + 8, sy + 8, 2, 2, "#f97316"); // Riflesso lava sotto il ghiaccio
    } else if (f === "y") {
      // Terra battuta runica cerimoniale
      P(sx, sy, 16, 16, "#292524");
      P(sx + 1, sy + 1, 14, 14, "#1c1917");
      P(sx + 4, sy + 4, 8, 8, "#44403c");
      // Rune d'oro incise
      if ((tx + ty) % 4 === 0) {
        P(sx + 7, sy + 5, 2, 6, "#d97706");
        P(sx + 6, sy + 7, 4, 2, "#f59e0b");
      }
    }
  }

  function doorTile(sx, sy, col) {
    P(sx, sy, 16, 16, "#1c1917");
    P(sx + 2, sy + 1, 12, 15, col || "#78350f");
    P(sx + 3, sy + 2, 10, 2, "#451a03");
    P(sx + 3, sy + 7, 10, 1, "#1c0b03");
    P(sx + 3, sy + 12, 10, 1, "#1c0b03");
    // Maniglia in ferro battuto
    P(sx + 11, sy + 8, 2, 3, "#f59e0b");
  }

  function gateTile(dir, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty);
    const fr = frNow();
    const fl = Math.sin(fr / 5) * 1.5;
    P(sx + 2, sy + 2, 12, 12, "rgba(239, 68, 68, 0.25)");
    P(sx + 3, sy + 3, 10, 10, "rgba(249, 115, 22, 0.45)");
    // Freccia runica dorata
    GP.fillStyle = "#fef08a";
    if (dir === ">") {
      P(sx + 4 + fl, sy + 6, 5, 4, "#fbbf24");
      P(sx + 9 + fl, sy + 4, 2, 8, "#fef08a");
      P(sx + 11 + fl, sy + 6, 2, 4, "#fef08a");
    } else if (dir === "<") {
      P(sx + 7 - fl, sy + 6, 5, 4, "#fbbf24");
      P(sx + 5 - fl, sy + 4, 2, 8, "#fef08a");
      P(sx + 3 - fl, sy + 6, 2, 4, "#fef08a");
    } else if (dir === "^") {
      P(sx + 6, sy + 7 - fl, 4, 5, "#fbbf24");
      P(sx + 4, sy + 5 - fl, 8, 2, "#fef08a");
      P(sx + 6, sy + 3 - fl, 4, 2, "#fef08a");
    } else {
      P(sx + 6, sy + 4 + fl, 4, 5, "#fbbf24");
      P(sx + 4, sy + 9 + fl, 8, 2, "#fef08a");
      P(sx + 6, sy + 11 + fl, 4, 2, "#fef08a");
    }
  }

  const PAINT = {
    A(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Palizzata di tronchi con neve sopra
      P(sx + 1, sy + 3, 14, 13, "#27150c");
      P(sx + 3, sy + 4, 3, 12, "#451a03");
      P(sx + 7, sy + 4, 3, 12, "#3b1a0a");
      P(sx + 11, sy + 4, 3, 12, "#451a03");
      P(sx, sy, 16, 4, "#f8fafc"); // Calotta di neve
      P(sx + 2, sy + 3, 12, 1, "#cbd5e1");
    },
    K(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Prua a testa di drago della Drakkar
      P(sx + 2, sy + 5, 12, 11, "#27150c");
      P(sx + 4, sy + 2, 8, 7, "#78350f");
      P(sx + 6, sy, 6, 5, "#9a3412"); // Bocca drago
      P(sx + 11, sy + 2, 2, 2, "#ea580c"); // Occhio ardente
      P(sx + 1, sy + 10, 14, 2, "#b45309"); // Fasciame dorato
      P(sx + 2, sy + 14, 12, 2, "#0f172a"); // Scafo nel ghiaccio
    },
    T(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Totem runico con corna d'alce
      P(sx + 4, sy + 6, 8, 10, "#44403c");
      P(sx + 5, sy + 7, 6, 9, "#292524");
      // Corna d'alce ramificate
      P(sx + 1, sy + 2, 4, 3, "#e2e8f0");
      P(sx + 11, sy + 2, 4, 3, "#e2e8f0");
      P(sx + 3, sy + 4, 10, 2, "#cbd5e1");
      // Rune d'oro incandescenti che pulsano
      const pulse = 0.5 + 0.5 * Math.sin(fr / 7 + tx);
      GP.fillStyle = `rgba(249, 115, 22, ${pulse})`;
      P(sx + 7, sy + 9, 2, 4, GP.fillStyle);
      P(sx + 6, sy + 10, 4, 2, GP.fillStyle);
    },
    F(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Braciere votivo di pietra e lava
      P(sx + 3, sy + 10, 10, 6, "#292524");
      P(sx + 2, sy + 8, 12, 3, "#44403c");
      // Fiamme animate e bagliore
      const fl = Math.sin(fr / 4 + tx) * 2;
      P(sx + 4, sy + 2 + fl, 8, 7, "#ea580c");
      P(sx + 5, sy + 3 + fl, 6, 5, "#f97316");
      P(sx + 7, sy + 4 + fl, 2, 3, "#fef08a");
      // Faville che salgono
      if ((fr + tx * 3) % 4 === 0) P(sx + 6, sy - 1, 2, 2, "#f97316");
    },
    W(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Altare della Sfera Magmatica (pietra sacra)
      P(sx + 2, sy + 8, 12, 8, "#1c1917");
      P(sx + 1, sy + 7, 14, 2, "#44403c");
      // La Sfera di Pietra Fusa fluttuante
      const fl = Math.sin(fr / 6 + tx) * 1.5;
      GP.fillStyle = "rgba(239, 68, 68, 0.4)";
      P(sx + 3, sy + 1 + fl, 10, 7, GP.fillStyle);
      P(sx + 5, sy + 1 + fl, 6, 6, "#ea580c");
      P(sx + 6, sy + 2 + fl, 4, 4, "#f97316");
      P(sx + 7, sy + 3 + fl, 2, 2, "#fef08a"); // Cuore solare
    },
    R(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Monolite runico di pietra antica
      P(sx + 3, sy + 2, 10, 14, "#475569");
      P(sx + 4, sy + 3, 8, 12, "#334155");
      P(sx + 5, sy + 1, 6, 2, "#94a3b8");
      // Incisioni runiche luminose
      P(sx + 7, sy + 5, 2, 7, "#f59e0b");
      P(sx + 6, sy + 7, 4, 1, "#f59e0b");
      P(sx + 6, sy + 10, 4, 1, "#f59e0b");
    },
    J(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Scudi vichinghi tondi appesi alla parete
      P(sx + 2, sy + 3, 12, 12, "#7f1d1d");
      P(sx + 4, sy + 5, 8, 8, "#991b1b");
      P(sx + 6, sy + 7, 4, 4, "#f59e0b"); // Umbone dorato
      P(sx + 7, sy + 8, 2, 2, "#1c1917");
    },
    H(sx, sy, tx, ty, fr) {
      // Camino titanico della Sala Comune
      P(sx, sy, 16, 16, "#1c1917");
      P(sx + 1, sy + 1, 14, 15, "#292524");
      P(sx + 3, sy + 5, 10, 11, "#0c0a09");
      // Ceppi ardenti e fuoco
      P(sx + 4, sy + 12, 8, 3, "#451a03");
      const fl = Math.sin(fr / 3) * 2;
      P(sx + 5, sy + 7 + fl, 6, 6, "#ea580c");
      P(sx + 6, sy + 8 + fl, 4, 4, "#f97316");
      P(sx + 7, sy + 9 + fl, 2, 2, "#fef08a");
    },
    G(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Porte cerimoniali da calcio (travi di drakkar e ossa)
      P(sx + 1, sy + 1, 14, 3, "#78350f");
      P(sx + 2, sy + 4, 2, 12, "#451a03");
      P(sx + 12, sy + 4, 2, 12, "#451a03");
      // Ossa di balena e corna
      P(sx + 4, sy, 3, 2, "#e2e8f0");
      P(sx + 9, sy, 3, 2, "#e2e8f0");
      // Rete di corde di canapa
      P(sx + 4, sy + 5, 8, 9, "rgba(254, 243, 199, 0.2)");
    },
    x(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Catasta di legna coperta da pelli
      P(sx + 2, sy + 6, 12, 9, "#451a03");
      P(sx + 3, sy + 7, 10, 2, "#78350f");
      P(sx + 3, sy + 10, 10, 2, "#78350f");
      P(sx + 1, sy + 4, 14, 3, "#713f12"); // Pelle di lupo
      P(sx + 3, sy + 3, 10, 2, "#e2e8f0"); // Neve sopra
    },
    b(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Panca di quercia
      P(sx + 2, sy + 6, 12, 5, "#5c2406");
      P(sx + 3, sy + 11, 2, 4, "#27150c");
      P(sx + 11, sy + 11, 2, 4, "#27150c");
    },
    I(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Incudine Titanica di Brokk in meteorite
      P(sx + 2, sy + 7, 12, 8, "#292524");
      P(sx + 1, sy + 5, 14, 3, "#475569");
      P(sx + 2, sy + 4, 12, 1, "#94a3b8"); // Piano battuto
      // Martello di meteorite appoggiato
      P(sx + 9, sy + 1, 4, 3, "#1c1917");
      P(sx + 10, sy + 4, 2, 4, "#78350f");
      // Scintilla magmatica pulsante
      if ((fr + tx * 3) % 4 === 0) P(sx + 5, sy + 2, 2, 2, "#fef08a");
    },
    S(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Fornace a cupola dei Nani
      P(sx + 1, sy + 3, 14, 13, "#292524");
      P(sx + 2, sy + 1, 12, 3, "#44403c");
      // Bocca ardente con metallo fuso
      P(sx + 4, sy + 7, 8, 7, "#0c0a09");
      const fl = Math.sin(fr / 3 + tx) * 2;
      P(sx + 5, sy + 8 + fl, 6, 5, "#ea580c");
      P(sx + 6, sy + 9 + fl, 4, 3, "#fef08a");
      // Tubo del soffietto
      P(sx + 7, sy, 2, 2, "#78350f");
    },
    M(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Monolite di meteorite grezzo
      P(sx + 3, sy + 2, 10, 14, "#1c1917");
      P(sx + 4, sy + 3, 8, 12, "#292524");
      P(sx + 5, sy + 5, 2, 3, "#38bdf8"); // Venatura di cobalto
      P(sx + 8, sy + 9, 3, 2, "#f59e0b"); // Venatura d'oro
    },
    L(sx, sy, tx, ty, fr) {
      // Cascata / colata di lava attiva
      P(sx, sy, 16, 16, "#1c1917");
      const fl = Math.sin(fr / 4 + ty) * 2;
      P(sx + 3, sy, 10, 16, "#ea580c");
      P(sx + 5 + fl, sy, 6, 16, "#f97316");
      P(sx + 7 + fl, sy, 2, 16, "#fef08a");
    },
    u: (sx, sy, tx, ty) => doorTile(sx, sy, "#7f1d1d"),
    q: (sx, sy, tx, ty) => doorTile(sx, sy, "#1e293b"),
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
      if (zr && zr.npcs().some((n) => n.id === id)) {
        const c = CHAPTERS[zr.ch] || activeChapter();
        const f = c && c.talk && c.talk[id];
        if (f) { castHero(); f(); return true; }
      }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
  }

  const EXIT_CH = "^><du";
  function registerZone(chN, id, Z) {
    if (!api || !api.TRZ) return;
    const rec = {
      ch: chN, Z, id,
      npcs() {
        const s = stepOf(chN);
        const l = typeof Z.npcs === "function" ? Z.npcs(s) : (Z.npcs || []);
        return l.filter((n) => api.CAST && api.CAST[n.id]).map((n) => (n.at ? n : { ...n, at: [n.x, n.y] }));
      },
      onObj(ch, tx, ty) {
        const c = CHAPTERS[chN] || activeChapter();
        const o = (c && c.obj) || {};
        const fn = o[`${id}:${ch}:${tx},${ty}`] || o[`${id}:${tx},${ty}`] || o[`${id}:${ch}`];
        if (typeof fn !== "function") return false;
        castHero(); fn({ ch, tx, ty, zid: id }); return true;
      }
    };
    ZONES[id] = rec;
    // Etichette dei pulsanti: ogni lettera con un gestore deve avere la sua (anche B, S, D, O, N, M)
    const act = Object.assign({}, Z.act || {});
    const c0 = CHAPTERS[chN];
    Object.keys((c0 && c0.obj) || {}).forEach((k) => {
      if (k.indexOf(id + ":") !== 0) return;
      const ch = k.slice(id.length + 1);
      if (ch.length === 1 && !act[ch]) act[ch] = EXIT_CH.includes(ch) ? "Passa oltre" : "Esamina";
    });
    const T0 = {
      name: Z.name, short: Z.short || Z.name, sub: Z.sub || "", need: 0,
      w: Z.w, h: Z.h, start: Z.start || [2, 2], theme: Z.theme || "torino", bg: Z.bg || "rag_fiordo",
      bus: "cancello", busLabel: "Lascia Midgard",
      item: Z.item || ["Pietra Runica", "Pietre"], itemCos: Z.itemCos, items: Z.items || [],
      bld: [], npcs: [], areas: Z.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act, intro: [],
      me() {
        const c = api.CAST.hero || api.CAST.leo || {};
        return Object.assign({}, c);
      },
      build(m, fill) {
        ZX.map = m; ZX.id = id;
        fill(0, 0, Z.w - 1, Z.h - 1, ",");
        Z.build(makeLayers(Z.w, Z.h));
        T0.npcs = rec.npcs();
      },
      tile: drawTile,
      onObj: (ch, tx, ty) => rec.onObj(ch, tx, ty),
      menu() {
        api.trAsk("voce", "<b>Ragnarok Ball</b><br><span style=\"color:var(--dim)\">Il Fuoco di Fimbulwinter</span>", [
          { label: "◂ Torna a esplorare", cls: "hot", fn: () => api.trResume() },
          { label: "Menu della saga", sub: "Diario, capitoli, progressi", fn: () => api.trExitTo(() => openMain()) },
          { label: "Esci da Ragnarok Ball", sub: "I progressi restano salvati", fn: () => leaveToModes() }
        ], bgNow());
      }
    };
    T0.npcs = rec.npcs();
    rec.T = T0;
    api.TRZ[id] = T0;
  }

  function zoneRec() {
    const z = api && api.trZone ? api.trZone() : null;
    return z && ZONES[z] ? ZONES[z] : null;
  }

  function refreshZone() {
    const zr = zoneRec();
    if (zr && zr.T) zr.T.npcs = zr.npcs();
  }

  function enterZone(zid, x, y) {
    if (!api) return;
    castHero();
    const zr = ZONES[zid];
    if (!zr) return;
    mem().zone = zid; save();
    const tr = api.trRec();
    if (tr && tr.pos) {
      const px = (x != null ? x : zr.Z.start[0]) * TS + 8;
      const py = (y != null ? y : zr.Z.start[1]) * TS + 12;
      tr.pos[zid] = [px, py];
    }
    api.trGo(zid);
  }

  function activeChapter() {
    const m = mem();
    return CHAPTERS[m.ch] || CHAPTERS[1];
  }

  function finishChapter(chN, flagDone) {
    const m = mem();
    m.done[chN] = flagDone || "completato";
    if (m.ch === chN && CHAPTERS[chN + 1]) m.ch = chN + 1;
    save();
  }

  let UITOK = 0;
  function say(lines, onDone, bg) {
    if (!api) return;
    const tok = ++UITOK, cb = onDone;
    onDone = (typeof cb !== "function" || cb === done) ? cb : () => { cb(); if (UITOK === tok && !inMatch && zoneRec()) done(); };
    const items = lines.map(([who, txt]) => ({
      who,
      text: esc(T(txt)).replace(/\n/g, "<br>"),
      bg: bg || bgNow()
    }));
    api.trSay(items, onDone);
  }

  function ask(who, prompt, opts, bg) {
    if (!api) return;
    UITOK++;
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

  function bgNow() {
    const zr = zoneRec();
    return zr && zr.Z && zr.Z.bg ? zr.Z.bg : "rag_fiordo";
  }

  // ------------------------------------------------------------------ Strumenti per i Capitoli
  const RV = (ads, crowd, ground, line, tint, glow, glow2) => ({ ads, crowd, ground, line, tint, glow, glow2, grid: "rgba(255,255,255,.06)" });
  const VENUES = {
    rag_match_1: RV([["JARL RAGNAR", "#7c2d12"], ["DRAKKAR & FIGLI", "#1e3a8a"], ["IDROMELE DEL FIORDO", "#92400e"], ["RUNE DEL GELO", "#0e7490"]], ["#7c2d12", "#1e3a8a", "#e2e8f0", "#92400e", "#cbd5e1"], ["#cfe3f2", "#dbeafe"], "#1e3a8aee", "rgba(147,197,253,.16)", "147,197,253", "250,204,21"),
    rag_match_2: RV([["FUCINE DI BROKK", "#7f1d1d"], ["MARTELLI SINDRI", "#78350f"], ["ORO DEI NANI", "#a16207"], ["INCUDINE VIVA", "#44403c"]], ["#44403c", "#7f1d1d", "#a16207", "#57534e", "#d6d3d1"], ["#3b2a22", "#4a3328"], "#fdba74dd", "rgba(120,30,0,.22)", "249,115,22", "250,204,21"),
    rag_match_3: RV([["OMBRA DI SURTR", "#450a0a"], ["CENERE & BRACE", "#44403c"], ["MAGMA CLUB", "#7c2d12"], ["FIMBULWINTER", "#1e293b"]], ["#292524", "#450a0a", "#57534e", "#7f1d1d", "#a8a29e"], ["#44403c", "#57534e"], "#f87171cc", "rgba(60,20,20,.3)", "239,68,68", "251,146,60"),
    rag_match_4: RV([["OMBELICO DEL COSMO", "#a16207"], ["SFERA DI LUCE", "#ca8a04"], ["YGGDRASIL", "#14532d"], ["I NOVE REGNI", "#1e3a8a"]], ["#a16207", "#ca8a04", "#e2e8f0", "#14532d", "#fde68a"], ["#e7d5a6", "#f0e0b3"], "#92400ecc", "rgba(253,224,71,.14)", "253,224,71", "147,197,253")
  };
  const WEATHER = { rag_match_1: "neve", rag_match_2: "sereno", rag_match_3: "vento", rag_match_4: "neve" };

  const XTOOLS = {
    stepOf, setStep, note, addRune, T, F, esc, say, ask, done, reward,
    sfxHorn: sfxRagnarokHorn, sfxDrum: sfxRagnarokDrum, sfxLava: sfxRagnarokLavaCrack, sfxValkyrie: sfxRagnarokValkyrie,
    go: (zid, x, y) => enterZone(zid, x, y),
    finishChapter,
    cast: (id, c, bio) => {
      if (!api) { CAST_Q.push([id, c, bio]); return; }
      if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#f59e0b", skin: "#e0b48a" }, c);
      if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio;
    },
    cos: (id, d) => {
      if (!api) { COS_Q.push([id, d]); return; }
      if (api.COSM && !api.COSM[id]) api.COSM[id] = d;
    },
    playMatch: (cfg) => {
      inMatch = true;
      if (typeof cfg.intro === "string") cfg.intro = T(cfg.intro);
      if (!cfg.venue && VENUES[cfg.id]) cfg.venue = VENUES[cfg.id];
      if (!cfg.weather && WEATHER[cfg.id]) cfg.weather = WEATHER[cfg.id];
      if (!cfg.homeKit) cfg.homeKit = ["#7c2d12", "#e2e8f0"];
      const prevDone = cfg.done;
      cfg.onDone = (res) => {
        inMatch = false;
        if (typeof prevDone === "function") prevDone(res);
      };
      if (api.matchPick) api.matchPick(cfg); else api.match(cfg);
    }
  };

  // ==========================================================================
  // CAPITOLO 1: IL RISVEGLIO DELLE DRAKKAR
  // ==========================================================================
  addChapter(function (X) {
    const { T, F, sfxHorn, sfxDrum, sfxLava, sfxValkyrie, note, setStep, addRune, reward, go } = X;
    const N = 1, S = () => X.stepOf(N);

    // Cast del Capitolo 1
    X.cast("rag_kara", {
      name: "Valchiria Kara", tag: "giudice", hair: "#e2e8f0", style: "long", skin: "#f1f5f9", eye: "#38bdf8",
      bg: ["#0f172a", "#38bdf8"], shirt: "#0284c7"
    }, "Giudice eterea caduta dalle sale celesti di Asgard. Ali d'argento cangiante e sguardo inflessibile. È lei ad aver risvegliato il Campione nel Fimbulwinter per compiere la profezia della Sfera Fusa.");

    X.cast("rag_sigrid", {
      name: "Sigrid la Scalda", tag: "poetessa", hair: "#fef08a", style: "braids", skin: "#fed7aa", eye: "#10b981",
      bg: ["#1c1917", "#10b981"], shirt: "#047857"
    }, "Custode della memoria e cantatrice delle saghe. Porta un tamburo sciamanico intarsiato di rune e un corvo dalle ali blu notte sulla spalla. Conosce i versi perduti che risvegliano la Furia Berserker.");

    X.cast("rag_ragnar", {
      name: "Jarl Ragnar Zanna-di-Ferro", tag: "jarl", hair: "#ea580c", style: "messy", skin: "#d97706", eye: "#7c2d12",
      beard: true, bg: ["#1c1917", "#ea580c"], shirt: "#7c2d12"
    }, "Condottiero titanico dei sopravvissuti della costa. Corazza forgiata con scaglie d'orso polare e piastre di ferro lavico. Guida la squadra dei Lupi di Fimbulwinter con ferocia ancestrale.");

    X.cast("rag_guerriero", {
      name: "Einherjar del Fiordo", tag: "sentinella", hair: "#94a3b8", style: "buzz", skin: "#fcd34d", eye: "#334155",
      beard: true, bg: ["#1e293b", "#64748b"], shirt: "#334155"
    }, "Guerriero immortale della guarnigione costiera. Veglia sul varco verso l'Arena cerimoniale tra i banchi di ghiaccio.");

    // Cosmetico Capitolo 1: Elmo Runico di Fimbulwinter
    X.cos("rag_elmo_berserker", {
      id: "rag_elmo_berserker",
      label: "Elmo Runico di Fimbulwinter",
      sub: "Elmo vichingo in ferro brunito con corna d'alce e rune di magma ardente.",
      cat: "cappello",
      val: 0
    });

    // Definizione Zone Capitolo 1
    const zones = {
      rag_fiordo: {
        name: "Il Fiordo delle Drakkar", short: "Fiordo di Fimbulwinter",
        sub: "Navi vichinghe imprigionate nel pack ghiacciato sotto un cielo di cenere e aurore",
        w: 24, h: 22, start: [12, 17], bg: "rag_fiordo", theme: "torino",
        item: ["Scheggia di Basalto", "Schegge"],
        build(Ls) {
          const { lay, put } = Ls;
          // Neve compatta di base
          lay(0, 0, 23, 21, ",");
          // Mare ghiacciato con riflessi neri a sud
          lay(0, 19, 23, 21, ":");
          // Passerelle in assi di pino tra le navi
          lay(11, 4, 13, 19, "p");
          lay(4, 11, 19, 13, "p");
          lay(4, 4, 11, 6, "p");
          // Scogliera e palizzata perimetrale
          for (let x = 0; x < 24; x++) { put(x, 0, "A"); put(x, 21, "A"); }
          for (let y = 1; y < 21; y++) { put(0, y, "A"); put(23, y, "A"); }
          // Varco nord per l'Arena del Gelo e della Brace
          put(11, 0, "^"); put(12, 0, "^"); put(13, 0, "^");
          // Varco ovest verso le Fucine di Nidavellir
          lay(0, 11, 4, 11, "p");
          put(0, 11, "<");
          // Varco est verso la Piana di Vigrid
          lay(19, 11, 23, 11, "p");
          put(23, 11, ">");
          // La Grande Casa dello Jarl (a sinistra)
          lay(2, 2, 8, 6, "A");
          put(5, 6, "u"); // Portone sala del mead
          put(3, 4, "J"); // Scudi appesi
          put(7, 4, "x"); // Legnaia
          // Drakkar incagliate nei ghiacci (a destra e in basso)
          put(18, 5, "K"); put(19, 5, "K");
          put(20, 16, "K"); put(21, 16, "K");
          // Altare della Sfera Magmatica al centro
          put(12, 10, "W");
          // Bracieri votivi lavici
          put(9, 9, "F"); put(15, 9, "F");
          put(9, 15, "F"); put(15, 15, "F");
          // Totem d'alce e monoliti
          put(7, 11, "T"); put(17, 11, "T");
          put(12, 4, "R");
          // Panche e casse
          put(6, 14, "b"); put(18, 14, "b");
        },
        npcs(s) {
          const list = [];
          if (s === 0) {
            list.push({ id: "rag_kara", at: [12, 13] });
            list.push({ id: "rag_sigrid", at: [8, 12] });
          } else if (s === 1) {
            list.push({ id: "rag_sigrid", at: [12, 12] });
            list.push({ id: "rag_kara", at: [16, 10] });
          } else {
            list.push({ id: "rag_sigrid", at: [7, 12] });
            list.push({ id: "rag_kara", at: [17, 10] });
          }
          list.push({ id: "rag_guerriero", at: [12, 2] });
          return list;
        }
      },
      rag_sala: {
        name: "La Sala del Mead di Ragnar", short: "Sala del Fuoco",
        sub: "Travi imponenti di quercia affumicata, pelli di lupo e camino titanico",
        w: 16, h: 14, start: [7, 11], bg: "rag_sala", theme: "torino",
        item: ["Corno di Idromele", "Corni"],
        build(Ls) {
          const { lay, put } = Ls;
          // Mura di tronchi
          lay(0, 0, 15, 13, "A");
          // Parquet affumicato
          lay(1, 1, 14, 12, "m");
          // Camino titanico a nord
          put(7, 1, "H"); put(8, 1, "H");
          // Scudi vichinghi tondi alle pareti
          put(3, 1, "J"); put(4, 1, "J");
          put(11, 1, "J"); put(12, 1, "J");
          put(1, 5, "J"); put(14, 5, "J");
          // Tavola dello Jarl e panche
          lay(5, 5, 10, 7, "p");
          put(4, 6, "b"); put(11, 6, "b");
          put(5, 5, "x"); put(10, 5, "x");
          // Bracieri ardenti
          put(3, 9, "F"); put(12, 9, "F");
          // Totem d'alce nell'angolo
          put(2, 2, "T"); put(13, 2, "T");
          // Portone d'uscita a sud
          put(7, 12, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "rag_ragnar", at: [7, 4] });
          return list;
        }
      },
      rag_arena: {
        name: "L'Arena del Gelo e della Brace", short: "Arena di Vigrid",
        sub: "Piana di permafrost e colate laviche: qui si forgia la Furia Berserker",
        w: 24, h: 22, start: [12, 19], bg: "rag_arena", theme: "torino",
        item: ["Brace di Basalto", "Braci"],
        build(Ls) {
          const { lay, put } = Ls;
          // Cenere vulcanica e permafrost
          lay(0, 0, 23, 21, "c");
          // Barriera di tronchi e pietre laviche
          for (let x = 0; x < 24; x++) { put(x, 0, "A"); put(x, 21, "A"); }
          for (let y = 1; y < 21; y++) { put(0, y, "A"); put(23, y, "A"); }
          // Campo di calcio cerimoniale
          lay(4, 4, 19, 16, "y");
          // Linea di metà campo in basalto lavico con crepe roventi
          for (let x = 4; x <= 19; x++) put(x, 10, "l");
          put(11, 10, "l"); put(12, 10, "l");
          // Porte cerimoniali in legno di drakkar e ossa
          put(11, 3, "G"); put(12, 3, "G");
          put(11, 17, "G"); put(12, 17, "G");
          // Bracieri di fuoco ai quattro angoli
          put(3, 4, "F"); put(20, 4, "F");
          put(3, 16, "F"); put(20, 16, "F");
          // Totem d'alce sui bordi
          put(3, 10, "T"); put(20, 10, "T");
          // Varco di ritorno a sud
          put(12, 21, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "rag_ragnar", at: [10, 11] });
          list.push({ id: "rag_sigrid", at: [8, 12] });
          list.push({ id: "rag_kara", at: [14, 11] });
          return list;
        }
      }
    };

    // Dialoghi Capitolo 1
    function karaTalk1() {
      const s = S();
      if (s === 0) {
        sfxValkyrie();
        return say([
          ["rag_kara", "Apri gli occhi, spirito del calcio. La neve di Fimbulwinter non ha ancora congelato il fuoco che arde nel tuo petto."],
          ["hero", "Dove... dove mi trovo? Ricordo una partita sulla costa, poi una tempesta di fiamme e ghiaccio che ha oscurato il sole."],
          ["rag_kara", "Sei giunto al confine estremo di Midgard, mortale. Il Ragnarok ha già devastato il reame degli dei: il sole è una brace spenta nel cielo e il gelo eterno divora le anime."],
          ["rag_kara", "Ho cercato nei secoli un guerriero che sapesse calciare la Sfera di Pietra Fusa senza spezzarsi le ossa. Il tuo numero {num} e il tuo tiro «{tiro}» sono la profezia che attendevamo."],
          ["rag_kara", "Parla con Sigrid la Scalda al centro del Fiordo. Ascolta i suoi versi e sintonizzati con l'Altare Magmatico."],
        ], () => {
          setStep(N, 1);
          note("Risveglio nel Fiordo: la Valchiria Kara svela al Campione che il Ragnarok è già avvenuto e il sole è spento.");
          done();
        });
      }
      if (s === 1) {
        return say([
          ["rag_kara", "L'Altare della Sfera Magmatica è al centro del Fiordo. Toccalo e lascia che la pietra fusa scelga la tua via."],
        ], done);
      }
      if (s === 2) {
        return say([
          ["rag_kara", "Lo Jarl Ragnar ti aspetta nella Sala del Mead a sinistra. Convincilo con la fierezza del tuo spirito."],
        ], done);
      }
      if (s === 3) {
        return say([
          ["rag_kara", "L'Arena del Gelo e della Brace è pronta a nord. Dimostra ai guerrieri di Fimbulwinter che la speranza non è morta."],
        ], done);
      }
      return say([
        ["rag_kara", "Hai sconfitto i Lupi di Ragnar con la tua Furia. Il primo passo verso la Fornace di Nidavellir è compiuto."],
      ], done);
    }

    function sigridTalk1() {
      const s = S();
      if (s === 0 || s === 1) {
        sfxDrum();
        return ask("rag_sigrid", "«(Batte sul tamburo sciamanico con ritmo cupo) Ascolta il corvo Munin, straniero. Tre inverni senza estate hanno divorato il mondo. Credi che una semplice sfera possa ridare vita alle ceneri?»", [
          {
            label: "🔥 «Il calcio non è un semplice gioco: è fuoco vitale che risveglia i cuori!»",
            cls: "hot",
            fn: () => {
              F.set("rag_scelta_tono", "fuoco");
              setStep(N, 1);
              say([
                ["rag_sigrid", "Parole degne di un vero berserker! Sento il sangue scaldarsi nelle vene."],
                ["rag_sigrid", "Tocca l'Altare della Sfera Fusa al centro del molo. Quando avrai risvegliato la prima Runa, entra nella Sala dello Jarl."],
              ], done);
            }
          },
          {
            label: "🛡️ «Sono qui per difendere chi trema nel freddo, non per cercare gloria.»",
            fn: () => {
              F.set("rag_scelta_tono", "difesa");
              setStep(N, 1);
              say([
                ["rag_sigrid", "La pietà è rara tra le macerie del Ragnarok, ma gli dei caduti la rispettavano."],
                ["rag_sigrid", "Tocca l'Altare della Sfera al centro. Poi affronta lo Jarl Ragnar nella sua dimora."],
              ], done);
            }
          }
        ]);
      }
      if (s === 2) {
        return say([
          ["rag_sigrid", "La Runa arde sulla tua fronte! Entra dal portone rinforzato a sinistra: Ragnar Zanna-di-Ferro ti attende davanti al camino."],
        ], done);
      }
      if (s === 3) {
        return ask("rag_sigrid", "«Il clan è radunato nell'Arena a nord. Sei pronto a scendere sul campo di ghiaccio e lava?»", [
          {
            label: "⚡ «Andiamo all'Arena! Mostrerò il tiro «{tiro}»!»",
            cls: "hot",
            fn: () => {
              go("rag_arena", 12, 18);
            }
          },
          { label: "«Dammi un attimo per affilare i tacchetti»", fn: done }
        ]);
      }
      return say([
        ["rag_sigrid", "I miei canti racconteranno questo giorno, {n}! Il boato del tuo tiro ha fatto tremare i ghiacci eterni."],
      ], done);
    }

    function ragnarTalk1() {
      const s = S();
      if (s < 2) {
        return say([
          ["rag_ragnar", "Fuori dalla mia sala, vagabondo! Solo chi possiede una Runa consacrata dalle Valchirie può parlare con Zanna-di-Ferro."],
        ], done);
      }
      if (s === 2) {
        sfxHorn();
        return ask("rag_ragnar", "«(Ti squadra dalla sua mole titanica sollevando il boccale) Kara ti ha scelto, dunque? I miei occhi hanno visto cento guerrieri cadere assiderati su queste sponde. Perché dovrei fidarmi di un calciatore straniero?»", [
          {
            label: "⚔️ «Metti la tua migliore squadra in campo e giudica la mia Furia coi tuoi occhi!»",
            cls: "hot",
            fn: () => {
              F.set("rag_scelta_ragnar", "sfida");
              setStep(N, 3);
              say([
                ["rag_ragnar", "(Scoppia in una risata fragorosa che fa tintinnare gli scudi) Sangue caldo! Mi piace! Nessun ossequio, solo la legge del campo!"],
                ["rag_ragnar", "I miei Lupi di Fimbulwinter ti attendono nell'Arena a nord. Se saprai superare la nostra barriera di piastre d'orso, ti aprirò la via per le Fucine dei Nani."],
              ], () => {
                done();
              });
            }
          },
          {
            label: "🤝 «La Valchiria cerca speranza per tutti noi. Uniamo le forze prima che il gelo ci consumi.»",
            fn: () => {
              F.set("rag_scelta_ragnar", "alleanza");
              setStep(N, 3);
              say([
                ["rag_ragnar", "(Sguardo cupo) Le speranze sono fragili come stalattiti, ragazzo. Ma il tuo coraggio merita una prova d'onore."],
                ["rag_ragnar", "Raggiungimi nell'Arena cerimoniale. Vediamo se il tuo tiro sa rompere il silenzio del Fimbulwinter."],
              ], () => {
                done();
              });
            }
          }
        ]);
      }
      if (s === 3) {
        return ask("rag_ragnar", "«La sfida sta per cominciare. Vuoi dare inizio alla partita rituale sul terreno ghiacciato?»", [
          {
            label: "⚽ «Fischia l'inizio! Che parli la palla fusa!»",
            cls: "hot",
            fn: startMatch1
          },
          { label: "«Studio ancora le formazioni avversarie»", fn: done }
        ]);
      }
      return say([
        ["rag_ragnar", "Mi hai battuto con onore, {n}. Hai il cuore di un vero berserker. Le Fucine di Brokk a Nidavellir sono la tua prossima meta."],
      ], done);
    }

    function guerrieroTalk1() {
      const s = S();
      if (s < 3) {
        return say([
          ["rag_guerriero", "L'accesso all'Arena cerimoniale a nord è sigillato. Ottieni prima il consenso dello Jarl Ragnar nella Sala del Mead."],
        ], done);
      }
      return ask("rag_guerriero", "«Lo Jarl ha aperto i cancelli dell'Arena. Vuoi entrare a disputare la partita rituale?»", [
        {
          label: "🛡️ «Entro nell'Arena di Vigrid!»",
          cls: "hot",
          fn: () => go("rag_arena", 12, 18)
        },
        { label: "«Rimango ancora al fiordo»", fn: done }
      ]);
    }

    function esaminaAltareMagmatico() {
      if (S() !== 1) {
        return say([["voce", "L'Altare della Sfera: la pietra lavica fusa pulsa dolcemente, emanando un calore primordiale che tiene a bada la brina."]], done);
      }
      sfxLava();
      ask("voce", "La Sfera di Pietra Fusa fluttua sopra l'altare emettendo fiamme arancioni e faville di cenere. Come decidi di accogliere il suo potere nel tuo calcio?", [
        {
          label: "🔥 «Abbraccio la Furia Berserker: il mio tiro spezzerà la terra creando crepe di fuoco!»",
          sub: "Via della Furia Distruttiva (scelta morale per i finali multipli)",
          cls: "hot",
          fn: () => {
            F.set("rag_scelta_1", "furia");
            concludiSintonizzazione("furia");
          }
        },
        {
          label: "ᚱ «Innovo l'armonia delle Rune: colpirò con saggezza e visione tattica divina»",
          sub: "Via della Sapienza Runica (scelta morale per i finali multipli)",
          cls: "hot",
          fn: () => {
            F.set("rag_scelta_1", "saggezza");
            concludiSintonizzazione("saggezza");
          }
        },
        {
          label: "🛡️ «Consacro la fiamma alla protezione del popolo e degli ultimi sopravvissuti»",
          sub: "Via della Custodia Mortale (scelta morale per i finali multipli)",
          fn: () => {
            F.set("rag_scelta_1", "popolo");
            concludiSintonizzazione("popolo");
          }
        }
      ]);
    }

    function concludiSintonizzazione(scelta) {
      sfxLava();
      addRune("fehu_magma", "Runa Fehu del Magma", "Carica la Furia Berserker nei contrasti ed evoca Crepe Telluriche durante il tiro.");
      setStep(N, 2);
      const descScelta = scelta === "furia"
        ? "Hai infuso nel tuo animo la furia selvaggia dei berserker, pronto a spaccare la crosta del mondo."
        : scelta === "saggezza"
          ? "Hai accolto il sussurro delle antiche rune di Odino, unendo fuoco e mente in un equilibrio sacro."
          : "Hai promesso di usare il fuoco solo come scudo per chi soffre nel gelo eterno.";
      note(`RUNA DEL MAGMA RISVEGLIATA (${scelta.toUpperCase()}): ${descScelta}`);

      say([
        ["voce", "BOOM! Una colonna di faville si alza dall'altare! La Sfera di Pietra Fusa si posa docilmente sui tuoi piedi senza bruciare la pelle."],
        ["rag_kara", "(Annuisce con sguardo solenne) La pietra fusa ti riconosce come suo campione, {n}. Il fuoco di Fimbulwinter scorre nei tuoi tacchetti."],
        ["hero", "Sento l'energia della terra ribollire... ogni contrasto caricherà la mia Furia!"],
        ["rag_sigrid", "Ora affronta lo Jarl Ragnar nella Sala del Mead a sinistra. Solo lui può concederti il diritto di giocare nell'Arena."],
      ], done);
    }

    function startMatch1() {
      sfxHorn();
      X.playMatch({
        id: "rag_match_1",
        alt: "hd,az", azPitch: "neve",
        oppNames: ["Ragnar Zanna-di-Ferro", "Orso di Ghiaccio", "Lupo del Pack", "Spacca-Scudi", "Guerriero del Braciere"],
        squad: ["Sigrid la Scalda", "Kara la Valchiria", "Einherjar del Fiordo"],
        chap: "Ragnarok Ball · La Prova dei Lupi",
        us: "Gli Eletti della Brace",
        mate: "Sigrid la Scalda",
        min: 45,
        intro: "SFIDA DEL FIORDO GHIACCIATO! Il tuo Campione {n} affronta lo Jarl Ragnar e i Lupi di Fimbulwinter con la Sfera di Pietra Fusa!",
        team: (t, st) => ({
          name: "I Lupi di Fimbulwinter",
          col: "#7c2d12",
          style: "Carica Berserker, Contrasti Pesanti & Muro di Scudi",
          atk: t(st.atk * 1.1),
          def: t(st.def * 1.2),
          vel: t(st.vel * 1.05),
          specials: ["Zanna d'Orso", "Barriera di Tronchi"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 4);
            note("VITTORIA CONTRO I LUPI DI FIMBULWINTER! Lo Jarl Ragnar cede il passo davanti alla Furia Tellurica.");
            const rewMsg = reward("rag_ch1_complete", {
              coins: 300,
              cos: "rag_elmo_berserker"
            });
            finishChapter(N, "ragnar_battuto");
            say([
              ["voce", "GOOOOOOOOOOOL DEVASTANTEEEEE! Con il tiro «{tiro}» la Sfera di Pietra Fusa apre una crepa tellurica sul campo che blocca i difensori e fa esplodere la rete in una pioggia di faville!"],
              ["rag_ragnar", "(Posa la mano pesante sulla tua spalla, ammirato) Per il martello di Thor! Non vedevo un impatto simile dal giorno in cui crollò il ponte Bifrost."],
              ["rag_kara", "La tua Furia ha risvegliato il cuore della terra, Campione. Le radici del Fimbulwinter cominciano a tremare."],
              ["rag_sigrid", "(Intona un inno trionfale col tamburo) I Lupi hanno chinato il capo! Il sentiero sotterraneo verso le Fucine di Brokk a Nidavellir è spalancato."],
              ["voce", `CAPITOLO 1 COMPLETATO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("rag_fiordo", 12, 16);
            });
          } else {
            say([
              ["rag_ragnar", "I tuoi tacchetti sono scivolati sul permafrost! Rialzati, Campione: i veri guerrieri di Midgard non cedono alla prima caduta!"],
            ], done);
          }
        }
      });
    }

    const obj = {
      "rag_fiordo:u": () => go("rag_sala", 7, 11),
      "rag_fiordo:^": () => {
        if (S() < 3) say([["voce", "L'accesso all'Arena cerimoniale è sbarrato dalle guardie. Ottieni prima il permesso dello Jarl Ragnar."]], done);
        else go("rag_arena", 12, 18);
      },
      "rag_fiordo:<": () => {
        const m = mem();
        if (!m.done[1]) say([["voce", "La voragine verso le Fucine di Nidavellir è bloccata da lastroni di ghiaccio. Supera prima la prova di Ragnar nel Capitolo 1."]], done);
        else go("rag_fucine", 14, 11);
      },
      "rag_fiordo:>": () => {
        const m = mem();
        if (!m.done[2]) say([["voce", "Il passo montano verso la Piana di Vigrid è sepolto dalle nevi perenni. Tempra prima i tuoi tacchetti a Nidavellir nel Capitolo 2."]], done);
        else go("rag_vigrid", 12, 19);
      },
      "rag_fiordo:W": esaminaAltareMagmatico,
      "rag_fiordo:F": () => say([["voce", "Il braciere votivo lavico: le fiamme ardono di una luce rosso rubino, sciogliendo la neve all'intorno."]], done),
      "rag_fiordo:T": () => say([["voce", "Il maestoso Totem con corna d'alce: incisioni runiche brillano dolcemente nel buio del Fimbulwinter."]], done),
      "rag_fiordo:K": () => say([["voce", "La prua a testa di drago della Drakkar vichinga: il legno d'olmo intagliato sfida il ghiaccio da secoli."]], done),
      "rag_fiordo:R": () => say([["voce", "Il monolite delle profezie: vi è inciso il destino del Ragnarok e l'avvento del guerriero con la sfera ardente."]], done),
      "rag_fiordo:b": () => say([["voce", "Una panca di quercia coperta da una morbida pelle di lupo."]], done),
      "rag_sala:d": () => go("rag_fiordo", 5, 7),
      "rag_sala:H": () => say([["voce", "Il camino monumentale: ceppi giganteschi scoppiettano diffondendo un profumo acre di pece e calore ristoratore."]], done),
      "rag_sala:J": () => say([["voce", "Scudi vichinghi tondi dipinti con i simboli del lupo e dell'alce."]], done),
      "rag_sala:T": () => say([["voce", "Un piccolo idolo di Thor con un martello intagliato nel corno d'alce."]], done),
      "rag_arena:d": () => go("rag_fiordo", 12, 2),
      "rag_arena:G": () => say([["voce", "Le porte dell'Arena: rami di quercia fossilizzata intrecciati a possenti ossa di balena boreale."]], done),
      "rag_arena:F": () => say([["voce", "I bracieri ardenti dell'Arena segnano i limiti sacri della prova di forza berserker."]], done),
      "rag_arena:T": () => say([["voce", "I totem dell'Arena risuonano con le vibrazioni sismiche dei tiri tellurici."]], done)
    };

    return {
      n: 1,
      title: "Il Risveglio delle Drakkar",
      sub: "Il risveglio nel Fimbulwinter, l'Altare della Sfera e la sfida allo Jarl Ragnar",
      zones,
      talk: {
        rag_kara: karaTalk1,
        rag_sigrid: sigridTalk1,
        rag_ragnar: ragnarTalk1,
        rag_guerriero: guerrieroTalk1
      },
      obj
    };
  });

  // ==========================================================================
  // CAPITOLO 2: LE FUCINE DI NIDAVELLIR
  // ==========================================================================
  addChapter(function (X) {
    const { T, F, sfxHorn, sfxDrum, sfxLava, sfxValkyrie, note, setStep, addRune, reward, go } = X;
    const N = 2, S = () => X.stepOf(N);

    // Cast del Capitolo 2
    X.cast("rag_brokk", {
      name: "Brokk il Fabbro", tag: "fabbro", hair: "#1c1917", style: "braids", skin: "#b45309", eye: "#ea580c",
      beard: true, bg: ["#0c0a09", "#ea580c"], shirt: "#451a03"
    }, "Leggendario mastro forgiatore delle caverne di Nidavellir. Barba nera intrecciata con anelli d'oro puro, grembiule di cuoio indurito dalle colate di lava e martello in ferro di meteorite. Tempra i tacchetti del Campione nel fango primordiale.");

    X.cast("rag_sindri", {
      name: "Sindri l'Orafo", tag: "orafo", hair: "#78350f", style: "buzz", skin: "#d97706", eye: "#38bdf8",
      beard: true, bg: ["#1c1917", "#f59e0b"], shirt: "#78350f"
    }, "Fratello di Brokk, meticoloso e raffinato cesellatore. Indossa occhiali con lenti d'ambra vulcanica per scorgere le imperfezioni delle rune. Teme lo sporco e la polvere di cenere ma ama l'armonia del gioco.");

    X.cast("rag_guardia_nano", {
      name: "Sentinella di Nidavellir", tag: "sentinella", hair: "#475569", style: "messy", skin: "#94a3b8", eye: "#f59e0b",
      beard: true, bg: ["#1e293b", "#ea580c"], shirt: "#334155"
    }, "Guerriero nano in pesante cotta di maglia di bronzo dorato. Custodisce l'accesso al Ponte dei Fiumi di Magma.");

    // Cosmetico Capitolo 2: Tacchetti Forgiati di Brokk
    X.cos("rag_tacchetti_magma", {
      id: "rag_tacchetti_magma",
      label: "Tacchetti Forgiati di Brokk",
      sub: "Tacchetti d'acciaio meteoritico temprati nel fango primordiale e riscaldati dal fuoco di Nidavellir.",
      cat: "scarpe",
      val: 0
    });

    // Definizione Zone Capitolo 2
    const zones = {
      rag_fucine: {
        name: "Le Fucine dei Nani Sotterranei", short: "Fucine di Brokk",
        sub: "Incudine di meteorite, fiumi di lava e calore primordiale nelle viscere della terra",
        w: 16, h: 14, start: [14, 11], bg: "rag_fucine", theme: "torino",
        item: ["Scoria di Meteorite", "Scorie"],
        build(Ls) {
          const { lay, put } = Ls;
          // Pavimento in lastre di basalto e pietra lavica
          lay(0, 0, 15, 13, "m");
          // Mura di roccia basaltica
          for (let x = 0; x < 16; x++) { put(x, 0, "A"); put(x, 13, "A"); }
          for (let y = 1; y < 13; y++) { put(0, y, "A"); put(15, y, "A"); }
          // Varco a est di ritorno al Fiordo
          put(15, 11, ">");
          // Varco a nord verso il Ponte di Magma
          put(8, 0, "^");
          // Incudine Titanica di Brokk al centro
          put(8, 6, "I");
          // Fornace a cupola e soffietti a sinistra
          put(2, 3, "S"); put(3, 3, "S");
          // Canali di lava che scorrono sui bordi
          for (let y = 2; y <= 10; y++) { put(1, y, "l"); put(14, y, "l"); }
          // Monolite di meteorite grezzo
          put(12, 3, "M");
          // Bracieri nanici e panche
          put(5, 2, "F"); put(11, 2, "F");
          put(6, 10, "b"); put(10, 10, "b");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "rag_brokk", at: [8, 5] });
          list.push({ id: "rag_sindri", at: [4, 4] });
          list.push({ id: "rag_kara", at: [12, 8] });
          list.push({ id: "rag_guardia_nano", at: [8, 1] });
          return list;
        }
      },
      rag_ponte: {
        name: "Il Ponte dei Fiumi di Magma", short: "Ponte di Magma",
        sub: "Arco di roccia sospeso su cascate di lava fusa e vapori incandescenti",
        w: 18, h: 16, start: [8, 14], bg: "rag_ponte", theme: "torino",
        item: ["Pietra Pomice Fusa", "Pomici"],
        build(Ls) {
          const { lay, put } = Ls;
          // Lava fusa su tutta la caverna
          lay(0, 0, 17, 15, "l");
          // Roccia perimetrale
          for (let x = 0; x < 18; x++) { put(x, 0, "A"); put(x, 15, "A"); }
          for (let y = 1; y < 15; y++) { put(0, y, "A"); put(17, y, "A"); }
          // Il Ponte centrale in basalto battuto
          lay(7, 1, 10, 14, "p");
          // Parapetto con monoliti e bracieri
          for (let y = 2; y <= 13; y += 3) {
            put(6, y, "T"); put(11, y, "T");
          }
          // Varchi
          put(8, 15, "d"); put(9, 15, "d"); // Verso fucine
          put(8, 0, "^"); put(9, 0, "^");   // Verso l'Arena Forgia
        },
        npcs(s) {
          const list = [];
          list.push({ id: "rag_sindri", at: [9, 9] });
          list.push({ id: "rag_guardia_nano", at: [8, 2] });
          return list;
        }
      },
      rag_forgia: {
        name: "L'Arena delle Scintille di Nidavellir", short: "Arena della Forgia",
        sub: "Campo cerimoniale dei nani: basalto levigato, porte d'ossidiana e colonne di fuoco",
        w: 24, h: 22, start: [12, 19], bg: "rag_forgia", theme: "torino",
        item: ["Lingotto di Meteorite", "Lingotti"],
        build(Ls) {
          const { lay, put } = Ls;
          // Basalto perimetrale
          lay(0, 0, 23, 21, "m");
          for (let x = 0; x < 24; x++) { put(x, 0, "A"); put(x, 21, "A"); }
          for (let y = 1; y < 21; y++) { put(0, y, "A"); put(23, y, "A"); }
          // Campo di calcio cerimoniale
          lay(4, 4, 19, 16, "y");
          // Linea mediana e canali di lava
          for (let x = 4; x <= 19; x++) put(x, 10, "l");
          // Porte cerimoniali in ossidiana e catene
          put(11, 3, "G"); put(12, 3, "G");
          put(11, 17, "G"); put(12, 17, "G");
          // Bracieri ardenti
          put(3, 4, "F"); put(20, 4, "F");
          put(3, 16, "F"); put(20, 16, "F");
          // Monoliti
          put(3, 10, "M"); put(20, 10, "M");
          // Varco nord verso la Piana di Vigrid
          put(11, 0, "^"); put(12, 0, "^");
          // Varco sud verso il Ponte
          put(12, 21, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "rag_brokk", at: [10, 11] });
          list.push({ id: "rag_sindri", at: [14, 11] });
          list.push({ id: "rag_kara", at: [12, 7] });
          return list;
        }
      }
    };

    // Dialoghi Capitolo 2
    function brokkTalk2() {
      const s = S();
      if (s === 0) {
        sfxDrum();
        return say([
          ["rag_brokk", "(Scaglia il martello con un colpo assordante sull'incudine, facendo schizzare scintille dorate) Chi osa disturbare il ritmo di Brokk? I nani non forgiano per i deboli di cuore."],
          ["hero", "Sono {n}. La Valchiria Kara e lo Jarl Ragnar mi hanno mandato qui. Ho la Sfera di Pietra Fusa, ma il permafrost rende i miei tacchetti insicuri contro le difese nane."],
          ["rag_brokk", "(Ti squadra i piedi, poi accarezza la barba con soddisfazione) Uno che capisce l'importanza dell'attrezzo! Quei tacchetti di cuoio mortale non reggerebbero un solo tiro della Furia Berserker."],
          ["rag_brokk", "Vieni all'Incudine Titanica al centro della sala. Con il fango primordiale e il ferro di meteorite temprerò per te una calzatura degna di calciare su un lago di magma!"],
        ], () => {
          setStep(N, 1);
          note("Incontro con Brokk: il fabbro accetta di temprare i tacchetti del Campione con fango primordiale.");
          done();
        });
      }
      if (s === 1) {
        return say([
          ["rag_brokk", "L'Incudine Titanica è pronta. Esaminala e scegli come infondere la fiamma nei tuoi nuovi tacchetti."],
        ], done);
      }
      if (s === 2 || s === 3) {
        const inForgia = !!(api.trZone && api.trZone() === "rag_forgia");
        if (inForgia) {
          if (s === 2) setStep(N, 3);
          return ask("rag_brokk", "«Sei giunto nella nostra forgia cerimoniale, {n}. Pronto a vedere se i tuoi nuovi tacchetti reggono l'impatto col muro dei Nani?»", [
            {
              label: "⚽ «Fischia l'inizio del Torneo della Fornace!»",
              cls: "hot",
              fn: startMatch2
            },
            { label: "«Sto saggiando la presa sul basalto»", fn: done }
          ]);
        }
        return say([
          ["rag_brokk", "I tacchetti sono forgiati! Ora attraversa il Ponte dei Fiumi di Magma a nord. La mia squadra di forgiatori ti aspetta nell'Arena di Nidavellir."],
        ], done);
      }
      return say([
        ["rag_brokk", "Per tutti i metalli di Midgard! Il tuo tiro «{tiro}» ha scosso le fondamenta di Nidavellir. Ti sei guadagnato la salita verso la Piana di Vigrid!"],
      ], done);
    }

    function sindriTalk2() {
      const s = S();
      if (s === 0 || s === 1) {
        return say([
          ["rag_sindri", "Attento dove metti i piedi! Quella cenere sul pavimento è piena di scorie di meteorite non raffinate... e spero che le tue mani siano pulite prima di toccare l'incudine di mio fratello!"],
          ["rag_sindri", "Brokk è rude, ma la sua tempra col fango primordiale è la migliore dei Nove Regni."],
        ], done);
      }
      if (s === 2) {
        return ask("rag_sindri", "«Vedo i tacchetti brillare di luce ambrata. Il Ponte di Magma a nord è pronto per essere attraversato. Vuoi avanzare verso l'Arena sotterranea?»", [
          {
            label: "🌉 «Attraversiamo il Ponte di Magma!»",
            cls: "hot",
            fn: () => go("rag_ponte", 8, 13)
          },
          { label: "«Studio ancora le colate di lava»", fn: done }
        ]);
      }
      if (s === 3) {
        return say([
          ["rag_sindri", "L'Arena delle Scintille è perfetta: zero polvere, solo basalto levigato a specchio e catene d'oro. Dai il massimo sul campo, Campione!"],
        ], done);
      }
      return say([
        ["rag_sindri", "Che partita spettacolare! Persino il mio martello ha vibrato all'unisono con il tuo tiro."],
      ], done);
    }

    function karaTalk2() {
      const s = S();
      if (s < 2) {
        return say([
          ["rag_kara", "Le profondità di Nidavellir custodiscono il fuoco primordiale che forgiò Mjolnir e Gungnir. Lascia che Brokk consacri il tuo calcio."],
        ], done);
      }
      return say([
        ["rag_kara", "Sento la Runa Uruz pulsare nella roccia. I nani riconoscono la grandezza solo in chi sa resistere alle fiamme."],
      ], done);
    }

    function guardiaNanoTalk2() {
      const s = S();
      if (s < 2) {
        return say([
          ["rag_guardia_nano", "L'accesso al Ponte di Magma è riservato a chi possiede tacchetti temprati. Parla con mastro Brokk."],
        ], done);
      }
      return ask("rag_guardia_nano", "«I cancelli verso il Ponte di Magma sono aperti. Vuoi proseguire?»", [
        {
          label: "🔥 «Avanzo verso l'Arena delle Scintille!»",
          cls: "hot",
          fn: () => go("rag_ponte", 8, 13)
        },
        { label: "«Resto ancora nella bottega»", fn: done }
      ]);
    }

    function esaminaIncudineBrokk() {
      if (S() !== 1) {
        return say([["voce", "L'Incudine Titanica di Brokk: la superficie in ferro di meteorite è levigata da millenni di colpi, emanando un calore magnetico."]], done);
      }
      sfxLava();
      ask("voce", "Mastro Brokk versa il fango primordiale fuso sopra i tuoi tacchetti. Come decidi di imprimere la tua volontà nel metallo incandescente?", [
        {
          label: "🔥 «Furia della Lava: tempra il metallo per spaccare ogni difesa con impatto vulcanico!»",
          sub: "Via della Furia Inarrestabile (scelta morale per i finali multipli)",
          cls: "hot",
          fn: () => {
            F.set("rag_scelta_2", "furia");
            concludiTempra("furia");
          }
        },
        {
          label: "ᚱ «Equilibrio delle Rune: incidi il sigillo di Mjolnir per dominare i rimbalzi sulla roccia»",
          sub: "Via della Precisione Divina (scelta morale per i finali multipli)",
          cls: "hot",
          fn: () => {
            F.set("rag_scelta_2", "saggezza");
            concludiTempra("saggezza");
          }
        },
        {
          label: "⚒️ «Lega dei Nani: tempra i tacchetti con la tenacia di chi lavora nelle ombre per proteggere la luce»",
          sub: "Via della Solidarietà dei Nove Regni (scelta morale per i finali multipli)",
          fn: () => {
            F.set("rag_scelta_2", "popolo");
            concludiTempra("popolo");
          }
        }
      ]);
    }

    function concludiTempra(scelta) {
      sfxDrum();
      addRune("uruz_forgia", "Runa Uruz della Roccia Fusa", "Raddoppia l'aderenza sulle superfici laviche e potenzia la resistenza ai contrasti.");
      setStep(N, 2);
      const descScelta = scelta === "furia"
        ? "Hai fuso i tacchetti nella lava viva, ottenendo una carica fisica devastante in ogni contrasto."
        : scelta === "saggezza"
          ? "Hai cesellato le rune di Thor nel ferro meteoritico, garantendo traiettorie telecomandate anche a piena potenza."
          : "Hai consacrato i tacchetti all'onore del lavoro nanico, unendo la forza del sottosuolo alla tua causa.";
      note(`RUNA URUZ RISVEGLIATA (${scelta.toUpperCase()}): ${descScelta}`);

      say([
        ["voce", "TSSSSS! Una nuvola di vapore dorato si sprigiona dall'incudine mentre Brokk immerge i tacchetti nel fango primordiale!"],
        ["rag_brokk", "(Solleva il martello con un cenno fiero) Ecco fatto! L'acciaio di Nidavellir ora è parte dei tuoi piedi, {n}."],
        ["hero", "Sento il terreno come se fosse incollato alla suola... posso scattare e cambiare direzione su qualsiasi lastra di roccia o ghiaccio!"],
        ["rag_sindri", "Ora andiamo all'Arena delle Scintille oltre il ponte a nord. La sfida dei nani non aspetta!"],
      ], done);
    }

    function startMatch2() {
      sfxHorn();
      X.playMatch({
        id: "rag_match_2",
        alt: "hd,az", azPitch: "neve",
        oppNames: ["Brokk il Bastione", "Sindri il Fulmine", "Martello di Pietra", "Fonderia Viva", "Guardiano di Bronzo"],
        squad: ["Kara la Valchiria", "Sigrid la Scalda", "Einherjar del Fiordo"],
        chap: "Ragnarok Ball · Il Torneo della Fornace",
        us: "Gli Eletti della Brace",
        mate: "Kara la Valchiria",
        min: 45,
        intro: "TORNEO DI NIDAVELLIR! Il tuo Campione {n} affronta la muraglia dei Nani Forgiatori tra canali di lava e porte d'ossidiana!",
        team: (t, st) => ({
          name: "I Forgiatori di Nidavellir",
          col: "#ea580c",
          style: "Pressing Asfissiante, Muro d'Acciaio & Fendenti Sismici",
          atk: t(st.atk * 1.15),
          def: t(st.def * 1.3),
          vel: t(st.vel * 1.1),
          specials: ["Incudine d'Ossidiana", "Colata Sulfurea"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 4);
            note("VITTORIA NELLA FORNACE DI NIDAVELLIR! Brokk e i suoi nani riconoscono la superiorità del Campione.");
            const rewMsg = reward("rag_ch2_complete", {
              coins: 350,
              cos: "rag_tacchetti_magma"
            });
            finishChapter(N, "brokk_battuto");
            say([
              ["voce", "GOOOOOOOOOOOL MONUMENTALEEEE! Con una staffilata tellurica potenziata dai tacchetti di Brokk, la Sfera di Pietra Fusa spacca la barriera nanica e fa risuonare la rete di catene con un boato sismico!"],
              ["rag_brokk", "(Si toglie il grembiule con una risata roboante) Per gli occhi di Mimir! Non vedevo un tiro simile da quando Thor scagliò il fulmine contro il Serpente del Mondo."],
              ["rag_sindri", "I tacchetti hanno retto alla perfezione! Nessuna crepa, solo pura potenza incisa nel metallo."],
              ["rag_kara", "Nidavellir si inchina al tuo coraggio, {n}. Il cuore della terra è con noi. Ora la via verso la superficie, verso la tremenda Piana di Vigrid, è dischiusa!"],
              ["voce", `CAPITOLO 2 COMPLETATO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("rag_fucine", 8, 8);
            });
          } else {
            say([
              ["rag_brokk", "La barriera di bronzo ha respinto il tuo tiro! Ricalibra il baricentro sui tacchetti e riprova, Campione!"],
            ], done);
          }
        }
      });
    }

    const obj = {
      "rag_fucine:>": () => go("rag_fiordo", 1, 11),
      "rag_fucine:^": () => {
        if (S() < 2) say([["voce", "L'accesso al Ponte di Magma è sbarrato: devi prima temprare i tuoi tacchetti all'Incudine di Brokk."]], done);
        else go("rag_ponte", 8, 14);
      },
      "rag_fucine:I": esaminaIncudineBrokk,
      "rag_fucine:S": () => say([["voce", "La grande Fornace dei Nani: fiumi di bronzo e ferro di meteorite fusi ribollono all'interno."]], done),
      "rag_fucine:M": () => say([["voce", "Un gigantesco blocco di meteorite grezzo: venature d'oro e cobalto brillano nella roccia nera."]], done),
      "rag_fucine:F": () => say([["voce", "Bracieri a colonna scolpiti nel basalto delle profondità."]], done),
      "rag_ponte:d": () => go("rag_fucine", 8, 2),
      "rag_ponte:^": () => {
        if (S() === 2) setStep(N, 3);
        go("rag_forgia", 12, 19);
      },
      "rag_ponte:T": () => say([["voce", "Pilastrini del ponte istoriati con le gesta dei primi forgiatori di Asgard."]], done),
      "rag_forgia:d": () => go("rag_ponte", 8, 2),
      "rag_forgia:^": () => {
        const m = mem();
        if (!m.done[2]) say([["voce", "La via di risalita verso la superficie è bloccata. Vinci prima la prova del Torneo della Fornace."]], done);
        else go("rag_vigrid", 12, 19);
      },
      "rag_forgia:G": () => say([["voce", "Le porte della Fornace: blocchi monolitici di ossidiana pura con catene d'oro e ferro."]], done),
      "rag_forgia:F": () => say([["voce", "Colonne di fuoco che illuminano l'Arena sotterranea."]], done),
      "rag_forgia:M": () => say([["voce", "Monoliti cerimoniali della gloria nanica."]], done)
    };

    return {
      n: 2,
      title: "Le Fucine di Nidavellir",
      sub: "Il regno sotterraneo dei nani, l'Incudine di Brokk e il Torneo della Fornace",
      zones,
      talk: {
        rag_brokk: brokkTalk2,
        rag_sindri: sindriTalk2,
        rag_kara: karaTalk2,
        rag_guardia_nano: guardiaNanoTalk2
      },
      obj
    };
  });

  // ==========================================================================
  // CAPITOLO 3: LA PIANA DI VIGRID (IL BIFROST FRANTUMATO E LA VERITÀ DEL LIMBO)
  // ==========================================================================
  addChapter(function (X) {
    const { T, F, sfxHorn, sfxDrum, sfxLava, sfxValkyrie, note, setStep, addRune, reward, go } = X;
    const N = 3, S = () => X.stepOf(N);

    // Cast del Capitolo 3
    X.cast("rag_surtr_ombra", {
      name: "Ombra di Surtr", tag: "spettro", hair: "#ea580c", style: "spiky", skin: "#1c1917", eye: "#fef08a",
      beard: true, bg: ["#09090b", "#ea580c"], shirt: "#450a0a"
    }, "Spettro millenario dell'armata del fuoco caduto sulla Piana di Vigrid. Custodisce le ceneri dell'antica fine del mondo ed è convinto che il silenzio di Fimbulwinter sia preferibile al ritorno di un nuovo ciclo di sofferenza.");

    // Cosmetico Capitolo 3: Mantello delle Piume di Corvo
    X.cos("rag_mantello_corvo", {
      id: "rag_mantello_corvo",
      label: "Mantello delle Piume di Corvo",
      sub: "Mantello sciamanico intessuto con piume di corvo boreale, scaglie di basalto e rune d'argento da Sigrid la Scalda.",
      cat: "maglia",
      val: 0
    });

    // Definizione Zone Capitolo 3
    const zones = {
      rag_vigrid: {
        name: "La Piana di Vigrid sotto la Cenere", short: "Piana di Vigrid",
        sub: "Distesa sterminata di basalto e permafrost dove caddero dei ed eroi del passato",
        w: 24, h: 22, start: [12, 19], bg: "rag_vigrid", theme: "torino",
        item: ["Cenere Primordiale", "Ceneri"],
        build(Ls) {
          const { lay, put } = Ls;
          // Cenere e permafrost di base
          lay(0, 0, 23, 21, "c");
          // Fessura tellurica orizzontale
          lay(2, 12, 21, 12, "l");
          // Strade di lastre laviche
          lay(11, 4, 13, 20, "y");
          lay(4, 11, 19, 13, "y");
          // Rocce basaltiche perimetrali
          for (let x = 0; x < 24; x++) { put(x, 0, "A"); put(x, 21, "A"); }
          for (let y = 1; y < 21; y++) { put(0, y, "A"); put(23, y, "A"); }
          // Varco sud verso il Fiordo
          put(12, 21, "d");
          // Varco ovest verso i Frammenti del Bifrost
          lay(0, 11, 4, 11, "p");
          put(0, 11, "<");
          // Varco nord verso il Cerchio di Cenere
          put(11, 0, "^"); put(12, 0, "^"); put(13, 0, "^");
          // Totem con corna d'alce e bracieri
          put(6, 6, "T"); put(18, 6, "T");
          put(6, 16, "T"); put(18, 16, "T");
          put(9, 10, "F"); put(15, 10, "F");
          put(9, 14, "F"); put(15, 14, "F");
          // Monoliti del crepuscolo e scudi infranti
          put(4, 4, "M"); put(20, 4, "M");
          put(4, 18, "J"); put(20, 18, "J");
          // Altare delle ceneri
          put(12, 8, "W");
        },
        npcs(s) {
          const list = [];
          if (s === 0) {
            list.push({ id: "rag_kara", at: [12, 14] });
            list.push({ id: "rag_sigrid", at: [10, 16] });
            list.push({ id: "rag_ragnar", at: [14, 16] });
            list.push({ id: "rag_brokk", at: [8, 17] });
          } else if (s === 1) {
            list.push({ id: "rag_sigrid", at: [6, 12] });
            list.push({ id: "rag_ragnar", at: [14, 15] });
            list.push({ id: "rag_brokk", at: [12, 16] });
          } else if (s === 2) {
            list.push({ id: "rag_ragnar", at: [12, 6] });
            list.push({ id: "rag_brokk", at: [10, 7] });
            list.push({ id: "rag_sigrid", at: [14, 7] });
          } else if (s === 3) {
            list.push({ id: "rag_kara", at: [12, 3] });
            list.push({ id: "rag_ragnar", at: [10, 5] });
            list.push({ id: "rag_sigrid", at: [14, 5] });
            list.push({ id: "rag_brokk", at: [8, 6] });
          } else {
            list.push({ id: "rag_kara", at: [12, 12] });
            list.push({ id: "rag_sigrid", at: [10, 14] });
            list.push({ id: "rag_ragnar", at: [14, 14] });
            list.push({ id: "rag_brokk", at: [12, 16] });
          }
          return list;
        }
      },
      rag_bifrost: {
        name: "I Frammenti del Bifrost Frantumato", short: "Rovine del Bifrost",
        sub: "Monoliti di cristallo prismatico sospesi sul baratro cosmico",
        w: 18, h: 16, start: [9, 13], bg: "rag_bifrost", theme: "torino",
        item: ["Frammento di Prisma", "Prismi"],
        build(Ls) {
          const { lay, put } = Ls;
          // Pavimento etereo e lastre cosmiche
          lay(0, 0, 17, 15, ":");
          lay(4, 3, 13, 13, "p");
          lay(6, 5, 11, 11, "y");
          // Baratro cosmico perimetrale
          for (let x = 0; x < 18; x++) { put(x, 0, "A"); put(x, 15, "A"); }
          for (let y = 1; y < 15; y++) { put(0, y, "A"); put(17, y, "A"); }
          // Varco sud di ritorno a Vigrid
          put(9, 15, "d");
          // Monolite Centrale delle Rivelazioni
          put(9, 6, "M");
          // Cristalli del ponte e colonne runiche
          put(5, 5, "R"); put(13, 5, "R");
          put(5, 11, "R"); put(13, 11, "R");
          put(7, 3, "b"); put(11, 3, "b");
          put(9, 9, "F");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "rag_kara", at: [9, 8] });
          list.push({ id: "rag_sigrid", at: [7, 8] });
          return list;
        }
      },
      rag_cerchio_cenere: {
        name: "L'Arena degli Spettri di Vigrid", short: "Cerchio di Cenere",
        sub: "Il cerchio sacro di battaglia dove riposano le armi dell'ultimo scontro",
        w: 24, h: 22, start: [12, 19], bg: "rag_cerchio_cenere", theme: "torino",
        item: ["Favilla di Vigrid", "Faville"],
        build(Ls) {
          const { lay, put } = Ls;
          // Cenere e basalto duro
          lay(0, 0, 23, 21, "c");
          // Rettangolo di gioco
          lay(3, 3, 20, 18, "m");
          // Fessura tellurica centrale
          for (let x = 4; x <= 19; x++) put(x, 10, "l");
          // Recinzione di monoliti
          for (let x = 0; x < 24; x++) { put(x, 0, "A"); put(x, 21, "A"); }
          for (let y = 1; y < 21; y++) { put(0, y, "A"); put(23, y, "A"); }
          // Porte cerimoniali in teschi e ossa
          put(11, 3, "G"); put(12, 3, "G");
          put(11, 18, "G"); put(12, 18, "G");
          // Bracieri cerimoniali e totem
          put(3, 4, "F"); put(20, 4, "F");
          put(3, 17, "F"); put(20, 17, "F");
          put(3, 10, "T"); put(20, 10, "T");
          // Varco sud verso la Piana
          put(12, 21, "d");
          // Varco nord verso Yggdrasil
          put(11, 0, "^"); put(12, 0, "^");
        },
        npcs(s) {
          const list = [];
          if (s < 4) {
            list.push({ id: "rag_surtr_ombra", at: [12, 10] });
            list.push({ id: "rag_ragnar", at: [8, 17] });
            list.push({ id: "rag_brokk", at: [6, 16] });
            list.push({ id: "rag_sigrid", at: [16, 17] });
            list.push({ id: "rag_kara", at: [18, 16] });
          } else {
            list.push({ id: "rag_kara", at: [12, 5] });
            list.push({ id: "rag_sigrid", at: [10, 7] });
            list.push({ id: "rag_ragnar", at: [14, 7] });
            list.push({ id: "rag_brokk", at: [12, 9] });
          }
          return list;
        }
      }
    };

    // Dialoghi Capitolo 3
    function karaTalk3() {
      const s = S();
      if (s === 0) {
        sfxValkyrie();
        return say([
          ["rag_kara", "Siamo giunti a Vigrid, {n}. Qui un tempo si riunirono dei, giganti e guerrieri per l'ultima battaglia."],
          ["hero", "L'aria è densa di cenere rovente e neve boreale. Sento il terreno vibrare sotto i tacchetti forgiati da Brokk."],
          ["rag_kara", "Prima di sfidare gli Spettri del Cerchio a nord, dobbiamo recarci a ovest, tra i Frammenti del Bifrost Frantumato."],
          ["rag_kara", "C'è un'antica memoria che devo mostrarti sul Monolite delle Rivelazioni. Seguimi attraverso il varco a sinistra (<)."],
        ], () => { setStep(N, 1); refreshZone(); });
      }
      if (s === 1) {
        return say([
          ["rag_kara", "Il varco per i Frammenti del Bifrost è a ovest (<). Io e Sigrid ti aspettiamo dinanzi al Monolite cosmico."],
        ], done);
      }
      if (s === 2) {
        return say([
          ["rag_kara", "Esamina il Monolite di pietra stellare al centro [M]. Tocca le sue incisioni con la Sfera di Pietra Fusa."],
        ], done);
      }
      if (s === 3) {
        return say([
          ["rag_kara", "Ora conosci la verità, {n}: il Ragnarok è già accaduto, e questo mondo è un limbo congelato. Ma la Sfera conserva la scintilla per decidere il futuro."],
          ["rag_kara", "L'Ombra di Surtr presidia il Cerchio di Cenere a nord (^). Sconfiggila con la Furia Berserker e apri la via per Yggdrasil!"],
        ], done);
      }
      say([
        ["rag_kara", "La Piana di Vigrid è purificata! La colonna di luce cosmica verso le Radici Celesti di Yggdrasil è aperta a nord (^)."],
      ], done);
    }

    function sigridTalk3() {
      const s = S();
      sfxDrum();
      if (s === 0 || s === 1) {
        return say([
          ["rag_sigrid", "(Batte il tamburo sciamanico con ritmo cupo e solenne) «Un'era di asce, un'era di spade... gli scudi si spaccano, un'era di tempeste prima che il mondo crolli.»"],
          ["rag_sigrid", "Munin avverte fremiti di dolore tra i cristalli del Bifrost a ovest. Qualcosa di immenso è sepolto laggiù, {n}."],
        ], done);
      }
      if (s === 2) {
        return say([
          ["rag_sigrid", "Avvicinati al Monolite [M]. La voce degli antichi scaldi risuonerà nella tua mente."],
        ], done);
      }
      if (s === 3) {
        return say([
          ["rag_sigrid", "(Ti porge il Mantello delle Piume di Corvo) Indossa le ali della memoria, {n}. Quando calci la Sfera, lascia che il tamburo guidi la traiettoria tra i crepacci!"],
        ], done);
      }
      say([
        ["rag_sigrid", "I canti dell'antico Asgard stanno risorgendo dalla cenere. Yggdrasil ci attende lassù, oltre il cerchio di fuoco!"],
      ], done);
    }

    function ragnarTalk3() {
      const s = S();
      sfxHorn();
      if (s < 3) {
        return say([
          ["rag_ragnar", "(Posa la pesante ascia sul terreno di basalto) Questa terra puzza di battaglie titaniche. Il mio sangue di lupo ribolle a ogni passo!"],
          ["rag_ragnar", "Qualunque cosa ci riveli quel vecchio ponte di cristallo, ricorda una cosa: un vero guerriero norreno non china la testa davanti al fato."],
        ], done);
      }
      if (s === 3) {
        return say([
          ["rag_ragnar", "Limbo o no, fantasmi o mortali, se quegli spettri del fuoco pensano di sbarrarci il cammino assaggeranno i miei contrasti d'orso!"],
          ["rag_ragnar", "Entriamo nel Cerchio di Cenere e spacchiamo la loro difesa con le Crepe Telluriche!"],
        ], done);
      }
      say([
        ["rag_ragnar", "Che vittoria epica! Quell'Ombra di Surtr non si aspettava che dei guerrieri di Midgard potessero calciare pietra fusa con tanta rabbia!"],
      ], done);
    }

    function brokkTalk3() {
      sfxDrum();
      say([
        ["rag_brokk", "(Esamina il terreno con perizia nanica) La cenere di Vigrid è compatta ma sotto ci sono vene di magma vivo."],
        ["rag_brokk", "I tacchetti forgiati all'Incudine stanno mordendo la roccia alla perfezione. Quando colpisci la palla con la Furia, il contraccolpo spaccherà il campo esattamente a metà!"],
      ], done);
    }

    // Colpo di scena 1: Rivelazione temporale al Monolite del Bifrost
    function esaminaMonoliteBifrost() {
      sfxValkyrie();
      sfxLava();
      say([
        ["voce", "Tocchi la superficie gelida e levigata del Monolite prismatico con la Sfera di Pietra Fusa..."],
        ["voce", "I cristalli del Bifrost si accendono di una luce abbagliante: visioni di cieli in fiamme, il lupo Fenrir che spezza le catene, il serpente Jormungandr che avvelena gli oceani... e poi il nulla. Un silenzio infinito."],
        ["rag_kara", "(Gli occhi d'argento della Valchiria brillano di lacrime divine) «Non posso più celarvelo, Campione {n}. Non siamo alla vigilia del Ragnarok.»"],
        ["hero", "Kara... cosa intendi? Abbiamo appena traversato le fucine per prepararci alla battaglia finale..."],
        ["rag_kara", "«Il Ragnarok è GIÀ accaduto. Mille inverni fa. Gli dei sono caduti, Asgard è stata ridotta in cenere e il sole primordiale è morto.»"],
        ["rag_kara", "«Midgard non è il mondo dei viventi: è un limbo congelato nel silenzio di Fimbulwinter. Noi siamo solo echi, anime che combattono all'infinito per non dissolversi nell'oblio cosmico.»"],
        ["rag_ragnar", "(Sbarra gli occhi, sconvolto e furente) Per gli dei caduti! Dunque io... i miei compagni... siamo solo ombre in un sonno senza fine?! Dobbiamo arrenderci a questo gelo?! No!"],
        ["rag_brokk", "Un momento! Se tutto è polvere e ombra, da dove viene questa Sfera di Pietra Fusa che continua a bruciare ai piedi del Campione?!"],
        ["rag_sigrid", "(Batte il tamburo sciamanico con ritmo potente) Brokk ha ragione! La Sfera è il Cuore del Sole originale, strappato dal crepuscolo e affidato a un mortale con il sangue ancora caldo e indomito!"],
        ["rag_kara", "«Sigrid dice il vero. Questo limbo non è eterno: se vincerai la prova del Cerchio di Cenere contro gli Spettri di Surtr e salirai su Yggdrasil, potrai calciare la Sfera nel Cuore del Mondo e decidere il destino di tutti i Nove Regni!»"],
        ["voce", "Una scarica tellurica pervade il tuo corpo: la Runa THURISAZ (ᚦ) - Runa del Tuono e della Furia Tellurica - si illumina sul tuo petto!"],
      ], () => {
        addRune("thurisaz");
        setStep(N, 3);
        note("COLPO DI SCENA: Il Ragnarok è già avvenuto! Il mondo è un limbo congelato. Risvegliata la Runa Thurisaz.");
        refreshZone();
      });
    }

    function surtrTalk3() {
      if (S() < 3) {
        return say([
          ["rag_surtr_ombra", "Non avete ancora compreso la verità di questo luogo. Andate al Bifrost prima di pretendere il giudizio del fuoco."],
        ], done);
      }
      ask("rag_surtr_ombra", "Perché volete riaccendere ciò che gli dei stessi hanno lasciato morire? Nel silenzio di Fimbulwinter regna la pace eterna. Se riporterete il sole, riporterete il sangue, le lacrime e la guerra!", [
        { label: "⚔️ La vita vale la lotta! Calciamo per il destino!", cls: "hot", fn: startMatch3 },
        { label: "◂ Devo riflettere con i compagni", fn: () => done() }
      ]);
    }

    function startMatch3() {
      sfxHorn();
      sfxDrum();
      X.playMatch({
        id: "rag_match_3",
        alt: "hd,az", azPitch: "cenere",
        oppNames: ["Ombra di Surtr", "Falena di Cenere", "Spettro di Magma", "Colosso di Zolfo", "Guerriero del Crepuscolo"],
        squad: ["Sigrid la Scalda", "Ragnar Zanna-di-Ferro", "Brokk il Fabbro"],
        chap: "Ragnarok Ball · La Battaglia di Vigrid",
        us: "Gli Eletti della Brace",
        mate: "Ragnar Zanna-di-Ferro",
        min: 50,
        intro: "BATTAGLIA DEGLI SPETTRI DI VIGRID! Sul campo di cenere ardente, la Furia Berserker spacca la roccia creando crepe telluriche invalicabili!",
        team: (t, st) => ({
          name: "Gli Spettri del Crepuscolo",
          col: "#450a0a",
          style: "Fiamme Eteree, Pressing Spettrale & Barriera di Cenere",
          atk: t(st.atk * 1.25),
          def: t(st.def * 1.25),
          vel: t(st.vel * 1.2),
          specials: ["Fiammata di Surtr", "Voragine di Zolfo"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 4);
            note("VITTORIA CONTRO GLI SPETTRI DI SURTR! Vigrid è liberata dalla morsa del crepuscolo eterno.");
            const rewMsg = reward("rag_ch3_complete", {
              coins: 400,
              cos: "rag_mantello_corvo"
            });
            finishChapter(N, "vigrid_liberata");
            say([
              ["voce", "GOOOOOOOOOOOL LEGGENDARIOOOOO! Il tiro «{tiro}» scaglia la Sfera di Pietra Fusa oltre la barriera di spettri, squarciando il Cerchio di Cenere con una crepa tellurica monumentale!"],
              ["rag_surtr_ombra", "(Lo spettro si dissolve lentamente in una pioggia di faville) «La vostra... fiamma... non è quella della distruzione. È il calore dei vivi che rifiuta di arrendersi. Salite su Yggdrasil, campioni...»"],
              ["rag_ragnar", "(Urla di trionfo sollevando l'ascia al cielo) Abbiamo spezzato le catene del silenzio! Nessuno spettro del crepuscolo può fermare la nostra squadra!"],
              ["rag_kara", "La via verso la sommità dell'Albero del Mondo è finalmente aperta. Lassù, al Cratere del Sole, prenderai la decisione che cambierà per sempre il cosmo."],
              ["rag_sigrid", "La Scalda canterà questo giorno per l'eternità! Guarda a nord: le radici cosmiche di Yggdrasil si illuminano d'aurore dorate."],
              ["voce", `CAPITOLO 3 COMPLETATO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("rag_vigrid", 12, 19);
            });
          } else {
            say([
              ["rag_surtr_ombra", "La vostra fiamma si è affievolita sul permafrost di Vigrid. Il silenzio vi avvolge... ma potete riprovare se il vostro cuore arde ancora."],
            ], done);
          }
        }
      });
    }

    const obj = {
      "rag_vigrid:d": () => go("rag_fiordo", 22, 11),
      "rag_vigrid:<": () => go("rag_bifrost", 9, 13),
      "rag_vigrid:^": () => {
        if (S() < 3) say([["voce", "Il Cerchio di Cenere è sigillato dalle fiamme spettrali. Consulta prima il Monolite del Bifrost a ovest (<)."]], done);
        else go("rag_cerchio_cenere", 12, 19);
      },
      "rag_vigrid:T": () => say([["voce", "Il possente Totem delle Corna d'Alce: intagliato nel legno prima del Ragnarok, sfida la bufera di cenere."]], done),
      "rag_vigrid:F": () => say([["voce", "Bracieri votivi delle Ceneri: le fiamme ardono di un rosso intenso in memoria degli eroi caduti."]], done),
      "rag_vigrid:M": () => say([["voce", "Monoliti di basalto intrisi dell'antico potere degli dei boreali."]], done),
      "rag_vigrid:W": () => say([["voce", "L'Altare delle Ceneri: qui la Sfera risuona con il battito sotterraneo di Midgard."]], done),
      "rag_bifrost:d": () => go("rag_vigrid", 4, 11),
      "rag_bifrost:M": esaminaMonoliteBifrost,
      "rag_bifrost:R": () => say([["voce", "Colonne di cristallo del Bifrost: riflettono aurore cangianti e memorie perdute."]], done),
      "rag_bifrost:F": () => say([["voce", "Fuoco celeste che galleggia nel vuoto del baratro cosmico."]], done),
      "rag_cerchio_cenere:d": () => go("rag_vigrid", 12, 2),
      "rag_cerchio_cenere:^": () => {
        const m = mem();
        if (!m.done[3]) say([["voce", "L'accesso a Yggdrasil è sbarrato. Sconfiggi prima gli Spettri del Crepuscolo nel Cerchio di Cenere."]], done);
        else go("rag_yggdrasil", 11, 17);
      },
      "rag_cerchio_cenere:G": () => say([["voce", "Porte cerimoniali formate da teschi d'alce e scudi del crepuscolo."]], done),
      "rag_cerchio_cenere:F": () => say([["voce", "Colonne ardenti del Cerchio di Battaglia."]], done),
      "rag_cerchio_cenere:T": () => say([["voce", "Totem che tremano al passaggio della Sfera di Pietra Fusa."]], done)
    };

    return {
      n: 3,
      title: "La Piana di Vigrid",
      sub: "I Frammenti del Bifrost Frantumato, la rivelazione del Limbo e la Battaglia di Vigrid",
      zones,
      talk: {
        rag_kara: karaTalk3,
        rag_sigrid: sigridTalk3,
        rag_ragnar: ragnarTalk3,
        rag_brokk: brokkTalk3,
        rag_surtr_ombra: surtrTalk3
      },
      obj
    };
  });

  // ==========================================================================
  // CAPITOLO 4: L'ALBERO DEL MONDO E IL SOLE RINATO (LA SCELTA DIVINA DEI NOVE REGNI)
  // ==========================================================================
  addChapter(function (X) {
    const { T, F, sfxHorn, sfxDrum, sfxLava, sfxValkyrie, note, setStep, addRune, reward, go } = X;
    const N = 4, S = () => X.stepOf(N);

    // Cast del Capitolo 4
    X.cast("rag_custode_vuoto", {
      name: "Il Guardiano del Silenzio", tag: "guardiano", hair: "#e0f2fe", style: "flowing", skin: "#0f172a", eye: "#38bdf8",
      beard: false, bg: ["#020617", "#0284c7"], shirt: "#0369a1"
    }, "L'Avatar del Fimbulwinter e custode dell'Eterno Silenzio. Veglia sul Cratere del Sole in cima a Yggdrasil per preservare la quiete incorrotta del mondo congelato.");

    // Cosmetico Capitolo 4: Corona Solare delle Rune
    X.cos("rag_corona_solare", {
      id: "rag_corona_solare",
      label: "Corona Solare delle Rune",
      sub: "Corona regale intrecciata con rami dorati di Yggdrasil, diamanti boreali e il fuoco immortale del Sole Rinato.",
      cat: "cappello",
      val: 0
    });

    // Definizione Zone Capitolo 4
    const zones = {
      rag_yggdrasil: {
        name: "Le Radici Celesti di Yggdrasil", short: "Radici di Yggdrasil",
        sub: "Tronco titanico dell'Albero del Mondo avvolto da aurore boreali e stelle primordiali",
        w: 22, h: 20, start: [11, 17], bg: "rag_yggdrasil", theme: "torino",
        item: ["Linfa Dorata", "Gocce"],
        build(Ls) {
          const { lay, put } = Ls;
          // Spazio cosmico e radici lignee dorate
          lay(0, 0, 21, 19, ":");
          lay(7, 2, 14, 18, "p");
          lay(9, 4, 12, 16, "y");
          // Pareti cosmiche
          for (let x = 0; x < 22; x++) { put(x, 0, "A"); put(x, 19, "A"); }
          for (let y = 1; y < 19; y++) { put(0, y, "A"); put(21, y, "A"); }
          // Varco sud verso il Cerchio di Cenere
          put(11, 19, "d");
          // Varco nord verso il Cratere del Sole
          put(10, 0, "^"); put(11, 0, "^");
          // Monoliti celesti e altari
          put(8, 4, "W"); put(13, 4, "W");
          put(6, 9, "R"); put(15, 9, "R");
          put(8, 14, "F"); put(13, 14, "F");
          put(11, 8, "M");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "rag_sigrid", at: [9, 13] });
          list.push({ id: "rag_ragnar", at: [13, 13] });
          list.push({ id: "rag_brokk", at: [8, 15] });
          list.push({ id: "rag_kara", at: [11, 11] });
          return list;
        }
      },
      rag_cratere_sole: {
        name: "Il Cratere del Sole di Pietra Fusa", short: "Cratere del Sole",
        sub: "Il culmine dell'universo: il santuario dove riposa il destino di Midgard",
        w: 24, h: 22, start: [12, 19], bg: "rag_cratere_sole", theme: "torino",
        item: ["Brace del Sole", "Braci"],
        build(Ls) {
          const { lay, put } = Ls;
          // Cenere e magma dorato cosmico
          lay(0, 0, 23, 21, "c");
          lay(4, 4, 19, 17, "m");
          // Cratere circolare di magma solare
          lay(8, 7, 15, 14, "l");
          lay(10, 9, 13, 12, "y");
          // Limiti cosmici
          for (let x = 0; x < 24; x++) { put(x, 0, "A"); put(x, 21, "A"); }
          for (let y = 1; y < 21; y++) { put(0, y, "A"); put(23, y, "A"); }
          // Porte solari
          put(11, 3, "G"); put(12, 3, "G");
          put(11, 18, "G"); put(12, 18, "G");
          // Altare del Sole al centro
          put(11, 10, "W"); put(12, 10, "W");
          // Bracieri del firmamento
          put(5, 5, "F"); put(18, 5, "F");
          put(5, 16, "F"); put(18, 16, "F");
          put(7, 10, "T"); put(16, 10, "T");
          // Varco sud verso le Radici
          put(12, 21, "d");
        },
        npcs(s) {
          const list = [];
          if (s < 4) {
            list.push({ id: "rag_custode_vuoto", at: [12, 9] });
            list.push({ id: "rag_kara", at: [10, 16] });
            list.push({ id: "rag_sigrid", at: [8, 17] });
            list.push({ id: "rag_ragnar", at: [14, 16] });
            list.push({ id: "rag_brokk", at: [16, 17] });
          } else {
            list.push({ id: "rag_kara", at: [11, 8] });
            list.push({ id: "rag_sigrid", at: [9, 10] });
            list.push({ id: "rag_ragnar", at: [14, 10] });
            list.push({ id: "rag_brokk", at: [12, 12] });
          }
          return list;
        }
      }
    };

    // Dialoghi Capitolo 4
    function yggdrasilTalk4() {
      const s = S();
      if (s === 0) {
        sfxValkyrie();
        sfxDrum();
        return say([
          ["rag_sigrid", "(Fa risuonare il tamburo sciamanico all'unisono con le radici di Yggdrasil) Guarda, {n}! Le rune Kenaz, Uruz e Thurisaz stanno convergendo in una sola luce dorata!"],
          ["rag_kara", "È la Runa SOWILO (ᛋ) - il Sole Rinato e la Vittoria Finale. L'Albero del Mondo riconosce il tuo cuore."],
          ["rag_ragnar", "Siamo in cima al cosmo, amici miei! Oltre quel varco a nord c'è il Cratere del Sole. Nessun timore: scendiamo in campo uniti!"],
          ["rag_brokk", "I tacchetti vibrano d'oro e fuoco primordiale. Sei pronto per l'ultimo match, Campione?"],
        ], () => {
          addRune("sowilo");
          setStep(N, 1);
          refreshZone();
        });
      }
      say([
        ["rag_kara", "Il Cratere del Sole è dinnanzi a noi a nord (^). Il Guardiano del Silenzio attende il calcio d'inizio supremo."],
      ], done);
    }

    function custodeTalk4() {
      const s = S();
      if (s < 3) {
        sfxValkyrie();
        return ask("rag_custode_vuoto", "Campione dei mortali, sei giunto all'Ombelico del Cosmo. Se calcerai la Sfera nel cratere riporterai la vita con tutte le sue sofferenze; se la cederai a me, i Nove Regni godranno di un sonno perfetto. Sei pronto a dimostrare la tua volontà sul campo della leggenda?", [
          { label: "☀️ Sfida i Custodi dell'Eterno Silenzio!", cls: "hot", fn: startMatch4 },
          { label: "◂ Consulta i compagni di squadra", fn: () => done() }
        ]);
      }
      if (s === 3) {
        verdettoFinaleDivino();
      }
    }

    function startMatch4() {
      sfxHorn();
      sfxValkyrie();
      sfxLava();
      X.playMatch({
        id: "rag_match_4",
        alt: "hd,az", azPitch: "neve",
        oppNames: ["Guardiano del Silenzio", "Sfinge di Brina", "Ombra della Nebbia", "Golem di Permafrost", "Spettro dell'Aurora"],
        squad: ["Kara la Valchiria", "Ragnar Zanna-di-Ferro", "Sigrid la Scalda", "Brokk il Fabbro"],
        chap: "Ragnarok Ball · La Partita del Crepuscolo Cosmico",
        us: "I Risvegliatori dell'Alba",
        mate: "Kara la Valchiria",
        min: 60,
        intro: "LA PARTITA SUPREMA DEL CREPUSCOLO COSMICO! Kara spiega le ali d'argento, Ragnar carica con le piastre d'orso, Brokk e Sigrid supportano il Campione {n} con la Sfera di Pietra Fusa contro i Custodi del Silenzio!",
        team: (t, st) => ({
          name: "I Custodi dell'Eterno Silenzio",
          col: "#0284c7",
          style: "Gelo Astrale, Muro dell'Aurora & Barriera di Permafrost",
          atk: t(st.atk * 1.35),
          def: t(st.def * 1.35),
          vel: t(st.vel * 1.3),
          specials: ["Sguardo di Brina", "Glaciazione Cosmica"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 3);
            note("VITTORIA NELLA PARTITA DEL CREPUSCOLO COSMICO! I Custodi del Silenzio si inchinano. È giunto il momento del Verdetto Divino.");
            say([
              ["voce", "GOOOOOOOOOOOOOOOOOOL DELL'UNIVERSOOOOOOOO! Con il tiro leggendario «{tiro}» la Sfera di Pietra Fusa frantuma la barriera di permafrost ed entra al centro del Cratere del Sole in un'esplosione d'oro e fuoco celeste!"],
              ["rag_custode_vuoto", "(Cade in ginocchio, illuminato dal calore solare) «Avete vinto... il verdetto cosmico non appartiene più al Fimbulwinter. Spetta a te, Campione {n}, decidere la sorte dei Nove Regni...»"],
            ], verdettoFinaleDivino);
          } else {
            say([
              ["rag_custode_vuoto", "Il ghiaccio dell'Aurora ha respinto la vostra carica. Riscaldate nuovamente i vostri spiriti e riprovate, Campione."],
            ], done);
          }
        }
      });
    }

    // Colpo di scena 2: La Scelta Morale Divina dei Nove Regni
    function verdettoFinaleDivino() {
      sfxValkyrie();
      sfxDrum();
      api.scene(
        "rag_cratere_sole", "voce",
        `<b>LA SCELTA MORALE DIVINA DEI NOVE REGNI</b><br><br>` +
        `Sei in piedi sul bordo del Cratere del Sole. Tra i tuoi piedi riposa la Sfera di Pietra Fusa, pulsante di tutta l'energia solare primordiale.<br><br>` +
        `<b>Kara la Valchiria:</b> <i>«{n}, l'intero universo trattiene il respiro. Quale destino sceglierai per Midgard e per tutti noi?»</i><br><br>` +
        `<b>Sigrid:</b> <i>«Qualunque sia il tuo verdetto, sarà inciso nelle rune eterne.»</i><br>` +
        `<b>Ragnar:</b> <i>«Siamo con te fino alla fine, fratello di ferro!»</i><br>` +
        `<b>Brokk:</b> <i>«Parla col tuo cuore, Campione!»</i>`,
        [
          {
            label: "🔥 1. Riattivare il Ciclo della Vita (Il Risveglio di Midgard)",
            cls: "hot",
            fn: () => epilogoScelto("vita_rinata")
          },
          {
            label: "❄️ 2. Lasciarlo Dormire in Pace (La Quiete Eterna di Fimbulwinter)",
            fn: () => epilogoScelto("quiete_eterna")
          },
          {
            label: "⚖️ 3. L'Eterno Guardiano dell'Equilibrio (La Sentinella delle Braci)",
            fn: () => epilogoScelto("guardiano_equilibrio")
          }
        ],
        "Il Giudizio degli Dei"
      );
    }

    function epilogoScelto(tipo) {
      const m = mem();
      m.finale = tipo; save();

      if (tipo === "vita_rinata") {
        sfxHorn();
        sfxLava();
        note("FINALE DIVINO: Riattivato il Ciclo della Vita. Il sole è rinato su Midgard!");
        const rewMsg = reward("rag_ch4_complete", {
          coins: 1000,
          cos: "rag_corona_solare"
        });
        finishChapter(N, "vita_rinata");
        say([
          ["hero", "(Carichi la gamba e calci con tutta la Furia la Sfera nel centro del cuore vulcanico di Yggdrasil!) «Midgard vivrà di nuovo! Nessun freddo spegnerà il coraggio dei mortali!»"],
          ["voce", "BOOOOOOOOOOM! Una colonna solare d'oro zecchino erutta dal cratere e sale nel cielo boreale, disperdendo la cenere e il Fimbulwinter in un tripudio di luce calda!"],
          ["voce", "Sotto di voi i ghiacci millenari del Fiordo si sciolgono in fiumi limpidi. L'erba verde smeraldo germoglia sulle scogliere, i fiori di tundra sbocciano e il canto degli uccelli risveglia il mondo."],
          ["rag_ragnar", "(Alza al cielo il corno colmo d'idromele dorato, con lacrime di gioia) Il sole! Guardate il sole! I nostri clan torneranno a navigare, a seminare e a vivere!"],
          ["rag_brokk", "(Batte il martello di meteorite che ora risplende d'oro puro) Forgerò aratri, navi e armature per la nuova era dei mortali!"],
          ["rag_sigrid", "(Intona l'inno più bello che Midgard abbia mai ascoltato) «Sorge il sole dalle acque chiare, l'aquila plana sui torrenti del monte... Il Campione ha riportato la vita!»"],
          ["rag_kara", "(Le sue ali d'argento si tingono di piume dorate) Hai scelto il fardello più grande e più nobile, {n}: la vita con le sue passioni e le sue sfide. Sei il «Risvegliatore di Soli»!"],
          ["voce", `SAGA RAGNAROK BALL COMPLETATA! FINALE 1: IL RISVEGLIO DI MIDGARD ✦ ${rewMsg.join(" · ")}`],
        ], () => {
          showEpilogoFinalScene("vita_rinata");
        });
      } else if (tipo === "quiete_eterna") {
        sfxValkyrie();
        note("FINALE DIVINO: Lasciato dormire in pace. Midgard riposa nella quiete eterna.");
        const rewMsg = reward("rag_ch4_complete", {
          coins: 1000,
          cos: "rag_corona_solare"
        });
        finishChapter(N, "quiete_eterna");
        say([
          ["hero", "(Trattieni la Sfera e la adagi delicatamente sul cuscino di neve cosmica) «Il mondo ha sofferto abbastanza guerre, tradimenti e fiamme. Riposa in pace, Midgard. Nessuno soffrirà più.»"],
          ["voce", "La fiamma violenta della Sfera si placa in una calda luce d'ambra dolce che illumina il permafrost senza bruciarlo. Un senso infinito di serenità e grazia scende su tutti i Nove Regni."],
          ["voce", "Nessuna guerra turbierà più questa pace immacolata. I ghiacci si trasformano in cristalli trasparenti sotto una maestosa aurora boreale eterna."],
          ["rag_kara", "(Depone la spada d'argento e chiude gli occhi con un sospiro di gratitudine) «Hai donato la pace che perfino gli dei avevano negato ai mortali. Sei il «Signore del Silenzio».»"],
          ["rag_sigrid", "I poeti canteranno il tuo nome nel riposo eterno dei campioni, dove non esistono più lacrime né inverni solitari."],
          ["rag_ragnar", "Riposo... una tregua degna dei più grandi eroi. Onore a te, Campione."],
          ["rag_brokk", "Un santuario incorrotto. La nostra opera rimarrà intatta per sempre."],
          ["voce", `SAGA RAGNAROK BALL COMPLETATA! FINALE 2: LA QUIETE ETERNA ✦ ${rewMsg.join(" · ")}`],
        ], () => {
          showEpilogoFinalScene("quiete_eterna");
        });
      } else {
        sfxHorn();
        sfxDrum();
        note("FINALE DIVINO: L'Eterno Guardiano dell'Equilibrio. Custode immortale tra brina e lava.");
        const rewMsg = reward("rag_ch4_complete", {
          coins: 1000,
          cos: "rag_corona_solare"
        });
        finishChapter(N, "guardiano_equilibrio");
        say([
          ["hero", "(Conficchi la Sfera sul monolite centrale tra la lava e il ghiaccio) «Non spegnerò il fuoco né distruggerò il gelo. Rimarrò qui come sentinella, affinché gli spiriti possano misurarsi in eterno nella lealtà del gioco e dell'onore!»"],
          ["voce", "Un cerchio perfetto di fuoco e permafrost si stabilizza attorno a Yggdrasil: un equilibrio cosmico dove la fiamma scalda senza distruggere e il ghiaccio protegge senza pietrificare."],
          ["rag_ragnar", "(Posa la mano sulla tua spalla con fierezza titanica) Io rimarrò al tuo fianco come tuo capitano! La squadra dell'Equilibrio non conoscerà mai la sconfitta!"],
          ["rag_brokk", "E io continuerò a temprare tacchetti e sfere fusi per tutti i campioni che saliranno quassù a sfidarci!"],
          ["rag_sigrid", "La ballata dell'Equilibrio non avrà mai fine: ogni partita celebrerà il coraggio dei guerrieri di Midgard!"],
          ["rag_kara", "«Sei il «Guardiano delle Braci», custode immortale dei confini del mondo. Gli dei si inchinano alla tua fermezza!»"],
          ["voce", `SAGA RAGNAROK BALL COMPLETATA! FINALE 3: IL GUARDIANO DELL'EQUILIBRIO ✦ ${rewMsg.join(" · ")}`],
        ], () => {
          showEpilogoFinalScene("guardiano_equilibrio");
        });
      }
    }

    function showEpilogoFinalScene(tipo) {
      const h = hero();
      const tit = tipo === "vita_rinata"
        ? "🔥 IL RISVEGLIO DI MIDGARD (IL SOLE È RINATO)"
        : tipo === "quiete_eterna"
        ? "❄️ LA QUIETE ETERNA (IL SANTUARIO DELLA PACE)"
        : "⚖️ IL GUARDIANO DELLE BRACI (L'ETERNO EQUILIBRIO)";

      const desc = tipo === "vita_rinata"
        ? "Il ghiaccio del Fimbulwinter si è sciolto, i mari sono tornati navigabili e la primavera germoglia sulle rive del Fiordo. Il tuo Campione viene acclamato come il Risvegliatore di Soli!"
        : tipo === "quiete_eterna"
        ? "Il cosmo ha trovato la pace serena e inviolabile. Le anime degli eroi riposano nella gloria imperitura sotto l'infinita aurora boreale, senza più dolore né guerra."
        : "Sulla vetta di Yggdrasil hai istituito il santuario dell'onore immortale, dove il fuoco e il ghiaccio convivono in perfetto equilibrio sotto la tua eterna custodia.";

      api.scene(
        "rag_cratere_sole", "voce",
        `<b>TRIONFO DELLA SAGA · RAGNAROK BALL</b><br><br>` +
        `Campione: <b>${h ? esc(h.name) : "Campione"}</b> · N.${h ? h.num : 9}<br>` +
        `Tiro Speciale: <b>${h ? esc(h.shotName || "COLPO DEL VULCANO") : "COLPO DEL VULCANO"}</b><br><br>` +
        `<b>VERDETTO DEI NOVE REGNI:</b><br><span style="color:#fef08a;font-size:15px">${tit}</span><br><br>` +
        `<i>${desc}</i><br><br>` +
        `👑 <b>Corona Solare delle Rune</b> sbloccata nel Guardaroba!<br>` +
        `ᛋ Tutte le 4 Rune Divine (Kenaz, Uruz, Thurisaz, Sowilo) sono state incise nella leggenda.`,
        [
          { label: "📖 Consulta il Diario Runico", cls: "hot", fn: journalView },
          { label: "◂ Torna alle Modalità", fn: () => leaveToModes() }
        ],
        "Vittoria Mitica"
      );
    }

    const obj = {
      "rag_yggdrasil:d": () => go("rag_cerchio_cenere", 12, 2),
      "rag_yggdrasil:^": () => {
        if (S() < 1) say([["voce", "Raccogli prima la risonanza della Runa Sowilo ascoltando i compagni di squadra."]], done);
        else go("rag_cratere_sole", 12, 19);
      },
      "rag_yggdrasil:W": () => say([["voce", "L'Altare Celestiale di Yggdrasil: la corteccia pulsa di linfa dorata e calore solare."]], done),
      "rag_yggdrasil:M": () => say([["voce", "Monolite dell'antico Asgard scolpito prima del grande silenzio."]], done),
      "rag_yggdrasil:R": () => say([["voce", "Rune cosmiche che brillano con la luce delle aurore boreali."]], done),
      "rag_yggdrasil:F": () => say([["voce", "Bracieri dell'alba cosmica: faville di fuoco primordiale."]], done),
      "rag_cratere_sole:d": () => go("rag_yggdrasil", 11, 2),
      "rag_cratere_sole:W": () => {
        if (S() >= 3) verdettoFinaleDivino();
        else say([["voce", "Il Cratere del Sole: la Sfera di Pietra Fusa attende la conclusione del match per il verdetto divino."]], done);
      },
      "rag_cratere_sole:G": () => say([["voce", "Le porte del firmamento forgiate con l'oro primordiale di Yggdrasil."]], done),
      "rag_cratere_sole:F": () => say([["voce", "Fiamme solari dell'aurora cosmica."]], done),
      "rag_cratere_sole:T": () => say([["voce", "Totem celesti che vegliano sull'equilibrio del mondo."]], done)
    };

    return {
      n: 4,
      title: "Il Sole Rinato e il Verdetto dei Nove Regni",
      sub: "La salita su Yggdrasil, la Partita del Crepuscolo Cosmico e la Scelta Morale Divina",
      zones,
      talk: {
        rag_sigrid: yggdrasilTalk4,
        rag_ragnar: yggdrasilTalk4,
        rag_brokk: yggdrasilTalk4,
        rag_kara: yggdrasilTalk4,
        rag_custode_vuoto: custodeTalk4
      },
      obj
    };
  });

  // ------------------------------------------------------------------ Hub Principale e Menu della Saga
  function openMain(opts) {
    opts = opts || {};
    if (opts.onExit) EXIT = opts.onExit;
    if (!api) {
      if (window.__borgoApi) init();
      if (!api) {
        setTimeout(() => openMain(opts), 100);
        return;
      }
    }
    if (!hero()) {
      if (api && api.scene) {
        api.scene(
          "title", "voce",
          "<b>Ragnarok Ball · Il Fuoco di Fimbulwinter</b><br><br>Nel gelo eterno di Fimbulwinter, le Valchirie cercano un guerriero per calciare la Sfera di Pietra Fusa.<br>Puoi risvegliare subito l'Einherjar Leggendario oppure personalizzare il tuo Campione nell'Editor!",
          [
            {
              label: "⚡ Risveglia l'Einherjar Leggendario (Avvio Rapido)",
              cls: "hot",
              fn: () => {
                const defaultHero = {
                  v: 1,
                  name: "Einherjar",
                  num: 9,
                  hair: "#f59e0b",
                  style: "lungi",
                  skin: "#e0b48a",
                  eye: "#f59e0b",
                  shirt: "#991b1b",
                  acc: "nessuno",
                  shot: "martello",
                  shotName: "COLPO DEL VULCANO"
                };
                if (typeof window.writeJSON === "function") {
                  window.writeJSON("ali-di-rondine.hero", defaultHero);
                } else {
                  try { localStorage.setItem("ali-di-rondine.hero", JSON.stringify(defaultHero)); } catch (e) {}
                }
                openMain(opts);
              }
            },
            {
              label: "⭐ Crea il tuo Campione nell'Editor",
              fn: () => {
                if (typeof window.heroEditor === "function") {
                  window.heroEditor(() => openMain(opts));
                }
              }
            },
            { label: "◂ Torna alle Modalità", fn: () => leaveToModes() }
          ],
          "Ragnarok Ball"
        );
      }
      return;
    }

    castHero();
    const c = activeChapter();
    const m = mem();
    const isNew = !m.intro || !m.intro["ch1"];

    if (isNew) {
      m.intro = m.intro || {};
      m.intro["ch1"] = 1; save();
      sfxRagnarokHorn();
      api.scene(
        "rag_fiordo", "voce",
        `<b>RAGNAROK BALL · IL FUOCO DI FIMBULWINTER</b><br><br>` +
        `<i>«Il sole è caduto. Tre inverni senza estate hanno coperto Midgard di ghiaccio e cenere.»</i><br><br>` +
        `Una luce azzurrina squarcia la tormenta. Le ali d'argento della Valchiria Kara ti sollevano dal sonno eterno sul pack gelato del Fiordo.<br>` +
        `Ai tuoi piedi non c'è una spada, ma una sfera di pietra fusa che non si spegne mai.<br><br>` +
        `Benvenuto guerriero <b>{n}</b> (N.{num}). Il destino dei Nove Regni riposa sui tuoi tacchetti!`,
        [
          { label: "🔥 Attiva la Sfera di Fimbulwinter ▸", cls: "hot", fn: () => continueStory() },
          { label: "📖 Diario delle Rune e Memorie", fn: journalView },
          { label: "◂ Torna alle Modalità", fn: () => leaveToModes() }
        ],
        "Prologo Epico"
      );
      return;
    }

    continueStory();
  }

  function continueStory() {
    const c = activeChapter();
    const m = mem();
    const curZ = m.zone && ZONES[m.zone] ? m.zone : "rag_fiordo";
    const zr = ZONES[curZ];
    const startPos = (zr && zr.Z && zr.Z.start) ? zr.Z.start : [12, 17];
    enterZone(curZ, startPos[0], startPos[1]);
  }

  function leaveToModes() {
    if (api && api.trExitTo) {
      api.trExitTo(EXIT);
    } else if (typeof EXIT === "function") {
      EXIT();
    } else if (typeof window.modes === "function") {
      window.modes();
    }
  }

  function journalView() {
    const m = mem();
    const h = hero();
    const chInfo = Object.keys(CHAPTERS).map((k) => {
      const c = CHAPTERS[k];
      const d = m.done[k];
      return `<b>Capitolo ${k}: ${esc(c.title)}</b> — <i>${d ? "✓ Concluso (" + esc(d) + ")" : (m.ch === +k ? "▶ In corso (Fase " + stepOf(k) + ")" : "Bloccato")}</i><br><span style="color:var(--dim);font-size:12px">${esc(c.sub)}</span>`;
    }).join("<br><br>");

    const runeList = m.runes.length
      ? m.runes.map((r) => `ᚱ <b>${esc(r.toUpperCase())}</b>`).join(" &nbsp;·&nbsp; ")
      : "<i>Nessuna runa risvegliata finora.</i>";

    const logHistory = m.log.length
      ? m.log.slice(-6).map((l) => `· ${esc(l)}`).join("<br>")
      : "<i>Nessuna memoria trascritta.</i>";

    const finaleNote = m.finale
      ? `<br><br><b>DESTINO DEI NOVE REGNI:</b><br><span style="color:#fef08a">✦ ${
          m.finale === "vita_rinata"
            ? "🔥 Il Risveglio di Midgard (Ciclo della Vita Riattivato)"
            : m.finale === "quiete_eterna"
            ? "❄️ La Quiete Eterna di Fimbulwinter (Pace Inviolabile)"
            : "⚖️ L'Eterno Guardiano dell'Equilibrio (La Sentinella delle Braci)"
        }</span>`
      : "";

    api.scene(
      "rag_sala", "voce",
      `<b>DIARIO DELLE RUNE DI FIMBULWINTER</b><br><br>` +
      `Guerriero: <b>${h ? esc(h.name) : "Campione"}</b> · N.${h ? h.num : 9}<br>` +
      `Tiro Speciale: <b>${h ? esc(h.shotName || "COLPO DEL VULCANO") : "COLPO DEL VULCANO"}</b><br><br>` +
      `<div style="max-height:180px;overflow-y:auto;text-align:left;padding:8px;background:rgba(0,0,0,0.4);border-radius:8px">` +
      `<b>PROGRESSO SAGA:</b><br>${chInfo}${finaleNote}<br><br>` +
      `<b>RUNE DIVINE OTTENUTE:</b><br>${runeList}<br><br>` +
      `<b>ULTIME MEMORIE DELLA SCALDA:</b><br>${logHistory}` +
      `</div>`,
      [
        { label: "⚔️ Prosegui il Cammino ▸", cls: "hot", fn: continueStory },
        { label: "♻️ Ricomincia la Saga", fn: resetConfirm },
        { label: "◂ Torna alle Modalità", fn: () => leaveToModes() }
      ],
      "Diario Runico"
    );
  }

  function resetConfirm() {
    api.scene(
      "rag_fiordo", "voce",
      "<b>Ricominciare Ragnarok Ball?</b><br>I progressi dei capitoli, le rune raccolte e le scelte verranno azzerati. Le monete e gli accessori del guardaroba rimarranno salvati.",
      [
        { label: "Sì, azzera e ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
        { label: "◂ Annulla", fn: journalView }
      ],
      "Ragnarok Ball"
    );
  }

  // ------------------------------------------------------------------ Pulsante Esci e Avvio
  function setupExitButton() {
    const existing = document.getElementById("ragExit");
    if (existing) return;
    const st = document.createElement("style");
    st.textContent = `
      #ragExit {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 36px; padding: 6px 14px; border-radius: 10px;
        border: 1px solid rgba(239, 68, 68, 0.6); background: rgba(28, 25, 23, 0.95);
        color: #fef08a; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.7); cursor: pointer;
      }
      #ragExit.on { display: block; }
      #ragExit:active { transform: translateY(1px); }
    `;
    document.head.appendChild(st);
    const btn = document.createElement("button");
    btn.id = "ragExit"; btn.type = "button";
    btn.textContent = "✕ Esci da Ragnarok Ball";
    btn.onclick = () => {
      if (inMatch) {
        const h = document.getElementById("homeBtn");
        if (h) h.click();
        return;
      }
      if (zoneRec()) { api.trExitTo(() => openMain()); }
    };
    document.body.appendChild(btn);
    setInterval(() => {
      const live = !!(zoneRec() && document.body.classList.contains("borgo"));
      btn.classList.toggle("on", live);
    }, 400);
  }

  // Fallback rendering per sfondi nel caso vengano chiamati prima di bg-scenarios
  function setupDetailedBgFallback() {
    const prev = window.renderDetailedBg;
    window.renderDetailedBg = function (kind, g, W, H, f) {
      if (kind && kind.startsWith("rag_")) {
        if (typeof window.drawRagnarokScenario === "function") {
          return window.drawRagnarokScenario(kind, g, W, H, f);
        }
      }
      return typeof prev === "function" ? prev(kind, g, W, H, f) : false;
    };
  }

  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match) {
      if (++tries < 200) setTimeout(init, 150);
      return;
    }
    api = a;
    CAST_Q.splice(0).forEach(([id, c, bio]) => {
      if (a.CAST && !a.CAST[id]) a.CAST[id] = Object.assign({ tag: "", eye: "#f59e0b", skin: "#e0b48a" }, c);
      if (bio && a.BIO && !a.BIO[id]) a.BIO[id] = bio;
    });
    COS_Q.splice(0).forEach(([id, d]) => { if (a.COSM && !a.COSM[id]) a.COSM[id] = d; });
    installHooks();
    setupDetailedBgFallback();
    PENDING.splice(0).forEach(registerChapterZones);
    setupExitButton();
  }

  // Esportazione Globale dell'API
  window.__ragnarokStory = {
    version: 1,
    addChapter,
    open: openMain,
    sfxHorn: sfxRagnarokHorn,
    sfxDrum: sfxRagnarokDrum,
    sfxLava: sfxRagnarokLavaCrack,
    sfxValkyrie: sfxRagnarokValkyrie,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "🔥 Ragnarok Ball · Il Fuoco di Fimbulwinter",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Mito Norreno, Furia Berserker e Crepe Telluriche · 4 Capitoli"}`
          : "Saga norrena tra ghiaccio e lava · Gioca subito o con il tuo Campione · 4 Capitoli"
      };
    },
    info() {
      const m = mem();
      return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), runes: m.runes.length, finale: m.finale };
    }
  };

  window.openRagnarokStory = function (onBack) {
    if (window.__ragnarokStory) window.__ragnarokStory.open({ onExit: onBack });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
