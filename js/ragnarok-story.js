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
  let tries = 0, api = null, inMatch = false;
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

  function registerZone(chN, id, Z) {
    if (!api || !api.TRZ) return;
    const rec = {
      ch: chN, Z, id,
      build(m, fill) {
        ZX.map = m; ZX.id = id;
        fill("A");
        const Ls = makeLayers(Z.w, Z.h);
        Z.build(Ls);
      },
      tile: drawTile,
      npcs() {
        const s = stepOf(chN);
        return typeof Z.npcs === "function" ? Z.npcs(s) : (Z.npcs || []);
      },
      onObj(o) {
        const c = CHAPTERS[chN] || activeChapter();
        const key = `${id}:${o}`;
        if (c && c.obj && c.obj[key]) { castHero(); c.obj[key](); return true; }
        return false;
      }
    };
    ZONES[id] = rec;
    api.TRZ[id] = {
      name: Z.name, short: Z.short || Z.name, sub: Z.sub || "",
      w: Z.w, h: Z.h, bg: Z.bg || "rag_fiordo", theme: Z.theme || "torino",
      build: rec.build, tile: rec.tile, npcs: rec.npcs,
      items: Z.item || ["Pietra Runica", "Pietre"],
      onObj: (o) => rec.onObj(o)
    };
  }

  function zoneRec() {
    const TW = window.TW;
    return TW && TW.id && ZONES[TW.id] ? ZONES[TW.id] : null;
  }

  function refreshZone() {
    const TW = window.TW;
    if (!TW || !TW.z || !zoneRec()) return;
    const zr = zoneRec(), c = CHAPTERS[zr.ch] || activeChapter();
    TW.npcs = zr.npcs();
    if (typeof TW.loadNpcs === "function") TW.loadNpcs();
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

  function say(lines, onDone, bg) {
    if (!api) return;
    const items = lines.map(([who, txt]) => ({
      who,
      text: esc(T(txt)).replace(/\n/g, "<br>"),
      bg: bg || bgNow()
    }));
    api.trSay(items, onDone);
  }

  function ask(who, prompt, opts, bg) {
    if (!api) return;
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
        const inForgia = !!(window.TW && window.TW.id === "rag_forgia");
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

  // ------------------------------------------------------------------ Hub Principale e Menu della Saga
  function openMain(opts) {
    opts = opts || {};
    if (opts.onExit) EXIT = opts.onExit;
    if (!hero()) {
      if (api && api.scene) {
        api.scene(
          "title", "voce",
          "<b>Ragnarok Ball · Il Fuoco di Fimbulwinter</b><br><br>Prima di calciare la Sfera di Pietra Fusa nel gelo eterno, devi creare il tuo Campione nell'Editor!<br>Scegli il tuo nome, il tuo numero e il tuo tiro speciale.",
          [
            {
              label: "⭐ Crea il tuo Campione nell'Editor",
              cls: "hot",
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

    api.scene(
      "rag_sala", "voce",
      `<b>DIARIO DELLE RUNE DI FIMBULWINTER</b><br><br>` +
      `Guerriero: <b>${h ? esc(h.name) : "Campione"}</b> · N.${h ? h.num : 9}<br>` +
      `Tiro Speciale: <b>${h ? esc(h.shotName || "COLPO DEL VULCANO") : "COLPO DEL VULCANO"}</b><br><br>` +
      `<div style="max-height:180px;overflow-y:auto;text-align:left;padding:8px;background:rgba(0,0,0,0.4);border-radius:8px">` +
      `<b>PROGRESSO SAGA:</b><br>${chInfo}<br><br>` +
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
      if (zoneRec()) { api.trLeave(); openMain(); }
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
      if (kind === "rag_fiordo" || kind === "rag_sala" || kind === "rag_arena") {
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
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "🔥 Ragnarok Ball · Il Fuoco di Fimbulwinter",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Mito Norreno, Furia Berserker e Crepe Telluriche"}`
          : "Crea prima il tuo campione · Saga norrena tra ghiaccio e fiamme"
      };
    },
    info() {
      const m = mem();
      return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), runes: m.runes.length };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
