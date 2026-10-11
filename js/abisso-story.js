// ============================================================================
// ABISSO DI DUNWICH · IL PATTO DELLE ONDE NERE
// Saga Dark Gothic Marina & Mistero Oceanico per il Tuo Campione
// Ispirata a Lovecraft, Sunless Sea e Dishonored
// Motore 2D Camminabile HD con Fari di Fosforo, Onde di Marea e Partite Abissali
// ============================================================================
(function () {
  "use strict";
  if (window.__abissoStoryLoaded) return;
  window.__abissoStoryLoaded = true;

  const KEY = "ali-di-rondine.abisso";
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

  // ------------------------------------------------------------------ Audio Synthesizer (Corni da nebbia, Onde e Sirene)
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  function sfxFogHorn() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [65.4, 98.0, 130.8].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq * 0.98, now + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.96, now + 1.6);
        g.gain.setValueAtTime(0.01, now);
        g.gain.linearRampToValueAtTime(0.18, now + 0.25);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + idx * 0.04); osc.stop(now + 1.85);
      });
    } catch (e) {}
  }

  function sfxAbyssalBell() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [440, 880, 1320, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(0.25 / (i + 1), now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + i * 0.2);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now); osc.stop(now + 1.6);
      });
    } catch (e) {}
  }

  function sfxOceanWaves() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.8));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.linearRampToValueAtTime(700, now + 0.5);
      filter.frequency.linearRampToValueAtTime(150, now + 1.4);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.005, now + 1.5);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  function sfxSirenSong() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [587.33, 739.99, 880.0].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        osc.frequency.linearRampToValueAtTime(freq * 1.05, now + i * 0.1 + 0.4);
        osc.frequency.linearRampToValueAtTime(freq * 0.98, now + i * 0.1 + 0.9);
        g.gain.setValueAtTime(0.01, now + i * 0.1);
        g.gain.linearRampToValueAtTime(0.12, now + i * 0.1 + 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 1.1);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 1.15);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Salvataggio normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  function norm(o) {
    o = obj(o);
    const m = {
      v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {},
      zone: "", marea: clampI(o.marea, 0, 100, 20), pearls: clampI(o.pearls, 0, 999, 0),
      relics: [], log: [], intro: {}, wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0)
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
    m.relics = [...new Set(arr(o.relics).filter((x) => typeof x === "string"))].slice(0, 20);
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
  const addRelic = (id, name, desc) => {
    const m = mem();
    if (!m.relics.includes(id)) {
      m.relics.push(id); save();
      sfxAbyssalBell();
      if (api && api.trToast) api.trToast(`⚓ Nuova Reliquia Abissale: ${name}`);
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
    saetta: "un lampo di fosforo marino che fende la nebbia e trafigge la risacca",
    serpentina: "un'anguilla abissale che scivola tra i vortici di marea",
    parabola: "un arco spumeggiante che sormonta i marosi come l'onda di un tifone",
    martello: "un impatto sottomarino che schianta i frangiflutti con boato di tuono",
    traversa: "un fendente radente che spazza il pontile sollevando schiuma salmastra",
    saudade: "una scia nostalgica di sirena che incanta il vento dell'arcipelago",
    muro: "una barriera di corallo nero che arresta qualsiasi marea rivale"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 10, shotName: "TIRO DELL'ABISSO", shot: "martello" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "TIRO DELL'ABISSO")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un tiro antico modellato dai gorghi abissali");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "marinaio", hair: h.hair, style: h.style, skin: h.skin, eye: "#38bdf8",
      bg: ["#082f49", "#0284c7"], shirt: "#0c4a6e", num: String(h.num), acc: h.acc,
      cap: h.acc === "cappellino" ? "#082f49" : h.acc === "berretto" ? "#0369a1" : undefined
    };
  }

  const coinsGive = (n) => {
    if (n > 0 && typeof window.addCoins === "function") {
      try { window.addCoins(n); return n; } catch (e) { return 0; }
    }
    return 0;
  };

  // ------------------------------------------------------------------ Set di Tessere 16x16 (Pixel Art Dunwich)
  // Pavimenti:
  //   . = pietra consunta dei moli con alghe e sale
  //   w = legno bagnato dei pontili
  //   ~ = acqua scura con fosforescenza abissale
  //   t = assi di pino catramato della taverna
  //   s = sabbia nera bagnata dalla risacca
  //   r = roccia frastagliata e scogliera a picco
  // Solidi / Oggetti:
  //   M = molo rialzato / balaustra di ferro battuto
  //   B = boa di segnalazione con lanterna
  //   L = lanterna di fosforo verde su palo
  //   F = faro ciclopico (lente Fresnel rotante)
  //   T = tavolo di legno da taverna
  //   b = botte di rum e aringhe
  //   N = rete da pesca bagnata appesa
  //   G = porta da calcio cerimoniale in gomene e legni di naufragio
  //   d = porta di legno borchiata
  //   u = ingresso taverna
  //   ^, v, <, > = varchi di mappa

  function drawTile(ctx, ch, px, py, tx, ty) {
    const x = px, y = py;
    switch (ch) {
      case ".": // Pietra del molo bagnata con alghe
        ctx.fillStyle = "#1e293b"; ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = "#0f172a"; ctx.fillRect(x, y, 15, 1); ctx.fillRect(x, y, 1, 15);
        if (rnd(tx, ty, 1) > 0.6) {
          ctx.fillStyle = "#14532d"; ctx.fillRect(x + 3, y + 5, 4, 2); ctx.fillRect(x + 2, y + 6, 6, 2);
        }
        if (rnd(tx, ty, 2) > 0.75) {
          ctx.fillStyle = "#0ea5e9"; ctx.fillRect(x + 10, y + 10, 2, 2);
        }
        break;
      case "w": // Legno bagnato del pontile
        ctx.fillStyle = "#334155"; ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = "#1e293b"; ctx.fillRect(x, y + 7, 16, 1); ctx.fillRect(x, y + 15, 16, 1);
        ctx.fillStyle = "#0284c7"; ctx.fillRect(x + 3, y + 2, 1, 3); ctx.fillRect(x + 11, y + 10, 1, 3);
        break;
      case "~": // Acqua scura con riflesso fosforo
        ctx.fillStyle = "#031525"; ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = "#083344"; ctx.fillRect(x, y + 4, 16, 3); ctx.fillRect(x, y + 11, 16, 3);
        ctx.fillStyle = "rgba(45, 212, 191, 0.45)";
        ctx.fillRect(x + ((Math.floor(Date.now() / 150) + tx) % 12), y + 5, 4, 1);
        ctx.fillRect(x + ((Math.floor(Date.now() / 180) + ty * 2) % 12), y + 12, 3, 1);
        break;
      case "t": // Pavimento taverna
        ctx.fillStyle = "#292524"; ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = "#1c1917"; ctx.fillRect(x, y + 8, 16, 1);
        ctx.fillStyle = "#44403c"; ctx.fillRect(x + 4, y + 2, 8, 4);
        break;
      case "s": // Sabbia nera vulcanica
        ctx.fillStyle = "#111827"; ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = "#1f2937"; ctx.fillRect(x + 2, y + 3, 3, 2); ctx.fillRect(x + 9, y + 8, 4, 2);
        break;
      case "r": // Roccia scogliera
        ctx.fillStyle = "#0b0f19"; ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = "#1e293b"; ctx.fillRect(x + 2, y + 2, 12, 12);
        ctx.fillStyle = "#334155"; ctx.fillRect(x + 4, y + 4, 6, 6);
        break;
      case "M": // Muro / Balaustra ferro
        ctx.fillStyle = "#090d16"; ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = "#1e293b"; ctx.fillRect(x + 2, y + 2, 12, 12);
        ctx.fillStyle = "#0284c7"; ctx.fillRect(x + 3, y + 3, 10, 2);
        ctx.fillStyle = "#0f172a"; ctx.fillRect(x + 7, y + 5, 2, 8);
        break;
      case "B": // Boa marina
        drawTile(ctx, "~", px, py, tx, ty);
        ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(x + 8, y + 8, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ffffff"; ctx.fillRect(x + 6, y + 7, 4, 2);
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(x + 7, y + 2, 2, 3);
        break;
      case "L": // Lanterna di fosforo
        drawTile(ctx, ".", px, py, tx, ty);
        ctx.fillStyle = "#475569"; ctx.fillRect(x + 7, y + 6, 2, 10);
        ctx.fillStyle = "#2dd4bf"; ctx.beginPath(); ctx.arc(x + 8, y + 4, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ffffff"; ctx.fillRect(x + 7, y + 3, 2, 2);
        break;
      case "F": // Faro ciclopico
        ctx.fillStyle = "#020617"; ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = "#1e293b"; ctx.fillRect(x + 2, y + 2, 12, 12);
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(x + 6, y + 6, 4, 4);
        break;
      case "T": // Tavolo taverna
        drawTile(ctx, "t", px, py, tx, ty);
        ctx.fillStyle = "#451a03"; ctx.fillRect(x + 2, y + 3, 12, 10);
        ctx.fillStyle = "#78350f"; ctx.fillRect(x + 3, y + 4, 10, 8);
        break;
      case "b": // Botte
        drawTile(ctx, "t", px, py, tx, ty);
        ctx.fillStyle = "#78350f"; ctx.beginPath(); ctx.ellipse(x + 8, y + 8, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1c1917"; ctx.fillRect(x + 4, y + 5, 8, 1); ctx.fillRect(x + 4, y + 10, 8, 1);
        break;
      case "N": // Rete da pesca
        drawTile(ctx, ".", px, py, tx, ty);
        ctx.fillStyle = "#0284c7";
        for (let i = 2; i < 14; i += 3) {
          ctx.fillRect(x + i, y + 2, 1, 12);
          ctx.fillRect(x + 2, y + i, 12, 1);
        }
        break;
      case "G": // Porta calcio in gomene
        drawTile(ctx, ".", px, py, tx, ty);
        ctx.fillStyle = "#0284c7"; ctx.fillRect(x + 1, y + 1, 14, 2);
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(x + 1, y + 3, 2, 12); ctx.fillRect(x + 13, y + 3, 2, 12);
        break;
      case "d": // Porta chiusa
        drawTile(ctx, ".", px, py, tx, ty);
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(x + 3, y + 2, 10, 12);
        ctx.fillStyle = "#0369a1"; ctx.fillRect(x + 5, y + 4, 6, 8);
        break;
      case "u": // Ingresso taverna
        drawTile(ctx, ".", px, py, tx, ty);
        ctx.fillStyle = "#020617"; ctx.fillRect(x + 3, y + 1, 10, 14);
        ctx.fillStyle = "#f59e0b"; ctx.fillRect(x + 5, y + 8, 2, 2);
        break;
      case "^": case "v": case "<": case ">":
        drawTile(ctx, ".", px, py, tx, ty);
        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        ctx.fillRect(x + 2, y + 2, 12, 12);
        break;
      default:
        drawTile(ctx, ".", px, py, tx, ty);
        break;
    }
  }

  // ------------------------------------------------------------------ Personaggi CAST
  const CAST = {
    abi_silas: {
      name: "Silas il Palombaro Cieco", tag: "custode", hair: "#94a3b8", style: "calvo", skin: "#e2e8f0", eye: "#38bdf8",
      bg: ["#082f49", "#0e7490"], shirt: "#164e63", num: "⚓", acc: "occhiali"
    },
    abi_nerissa: {
      name: "Nerissa delle Onde", tag: "sacerdotessa", hair: "#0f766e", style: "lisci", skin: "#ccfbf1", eye: "#2dd4bf",
      bg: ["#042f2e", "#0d9488"], shirt: "#115e59", num: "🌊", acc: "fascia"
    },
    abi_barnaby: {
      name: "Capitan Barnaby", tag: "capitano", hair: "#cbd5e1", style: "mossi", skin: "#f8fafc", eye: "#0284c7",
      bg: ["#020617", "#1e3a8a"], shirt: "#172554", num: "🏴‍☠️", acc: "benda"
    },
    abi_marinaio: {
      name: "Vecchio Marinaio di Dunwich", tag: "equipaggio", hair: "#64748b", style: "corti", skin: "#cbd5e1", eye: "#64748b",
      bg: ["#0f172a", "#334155"], shirt: "#1e293b", num: "🐟", acc: "berretto"
    }
  };

  // ------------------------------------------------------------------ Registro Zone
  const ZONES = {
    abi_molo: {
      name: "La Banchina dei Fari Spenti", short: "Molo Dunwich",
      sub: "Banchina battuta dalle maree nere, fasci di fosforo verde e relitti di golette",
      w: 24, h: 22, start: [11, 17], bg: "abi_banchina", theme: "chiavari",
      item: ["Conchiglia Fosforescente", "Conchiglie"],
      build(Ls) {
        const { lay, put } = Ls;
        // Acqua abissale ovunque intorno
        lay(0, 0, 23, 21, "~");
        // Molo principale di pietra
        lay(6, 4, 17, 19, ".");
        // Pontili in legno laterali
        lay(2, 8, 5, 10, "w");
        lay(18, 12, 21, 14, "w");
        // Balaustre di contenimento
        for (let y = 5; y <= 18; y++) {
          if (y !== 9) put(6, y, "M");
          if (y !== 13) put(17, y, "M");
        }
        for (let x = 7; x <= 16; x++) {
          if (x !== 11 && x !== 12) put(x, 19, "M");
        }
        // Taverna del Gabbiano Cieco a nord-ovest
        lay(7, 4, 12, 7, "M");
        put(9, 7, "u"); // porta taverna
        // Lanterne di fosforo
        put(7, 10, "L"); put(16, 10, "L");
        put(7, 16, "L"); put(16, 16, "L");
        // Boe marine nell'acqua
        put(3, 4, "B"); put(20, 5, "B");
        put(4, 17, "B"); put(19, 18, "B");
        // Reti e botti sul pontile
        put(8, 12, "N"); put(15, 12, "b");
        put(8, 15, "b"); put(15, 15, "N");
        // Varco nord per il Faro
        put(11, 4, "^"); put(12, 4, "^");
      },
      npcs(s) {
        const list = [];
        if (s === 0) {
          list.push({ id: "abi_silas", at: [11, 13] });
        } else if (s === 1) {
          list.push({ id: "abi_silas", at: [8, 11] });
          list.push({ id: "abi_marinaio", at: [14, 14] });
        } else {
          list.push({ id: "abi_silas", at: [15, 14] });
          list.push({ id: "abi_marinaio", at: [8, 14] });
        }
        return list;
      }
    },
    abi_faro: {
      name: "Il Faro delle Maree Nere", short: "Faro Ciclopico",
      sub: "Lente Fresnel in ottone titanico che squarcia l'abisso con fasci color perla",
      w: 18, h: 16, start: [9, 13], bg: "abi_faro", theme: "chiavari",
      item: ["Perla del Faro", "Perle"],
      build(Ls) {
        const { lay, put } = Ls;
        // Basamento circolare di scogliera e mare
        lay(0, 0, 17, 15, "~");
        lay(3, 2, 14, 13, ".");
        for (let x = 4; x <= 13; x++) { put(x, 2, "M"); put(x, 13, "M"); }
        for (let y = 3; y <= 12; y++) { put(3, y, "M"); put(14, y, "M"); }
        // Lente del Faro monumentale al centro
        lay(7, 5, 10, 8, "F");
        // Lanterne di fosforo votive
        put(5, 5, "L"); put(12, 5, "L");
        put(5, 10, "L"); put(12, 10, "L");
        // Altare delle Onde
        put(8, 10, "G"); put(9, 10, "G");
        // Varco sud di ritorno al Molo
        put(9, 13, "v");
      },
      npcs(s) {
        const list = [];
        list.push({ id: "abi_nerissa", at: [9, 9] });
        if (s >= 2) list.push({ id: "abi_barnaby", at: [11, 9] });
        return list;
      }
    },
    abi_taverna: {
      name: "La Taverna del Gabbiano Cieco", short: "Gabbiano Cieco",
      sub: "Travi impregnate di sale, odore di rum speziato e carte nautiche ingiallite",
      w: 16, h: 14, start: [7, 11], bg: "abi_taverna", theme: "chiavari",
      item: ["Fiala di Rum Speziato", "Fiale"],
      build(Ls) {
        const { lay, put } = Ls;
        // Muri taverna
        lay(0, 0, 15, 13, "M");
        lay(1, 1, 14, 12, "t");
        // Bancone di quercia marina
        lay(3, 3, 12, 4, "T");
        put(2, 3, "b"); put(13, 3, "b");
        // Tavolini
        put(4, 7, "T"); put(11, 7, "T");
        put(4, 9, "b"); put(11, 9, "b");
        // Uscita a sud
        put(7, 12, "d");
      },
      npcs(s) {
        const list = [];
        list.push({ id: "abi_barnaby", at: [7, 5] });
        list.push({ id: "abi_marinaio", at: [4, 8] });
        return list;
      }
    }
  };

  // ------------------------------------------------------------------ Motore di Gioco Camminabile
  let currentZoneId = "abi_molo";
  let playerPos = [11, 17];
  let walkTarget = null;
  let walkBusy = false;
  let activeSayCb = null;

  function initPlayer() {
    castHero();
    const z = ZONES[currentZoneId];
    if (z) playerPos = [...z.start];
  }

  function setZone(zid) {
    if (!ZONES[zid]) return;
    currentZoneId = zid;
    mem().zone = zid;
    save();
    const z = ZONES[zid];
    playerPos = [...z.start];
    sfxOceanWaves();
    if (api && api.renderText) {
      api.renderText("voce", `<b>${esc(z.name)}</b><br><span style="color:var(--dim)">${esc(z.sub)}</span>`);
    }
  }

  // Costruttore livelli
  function getBuiltZone(zid) {
    const z = ZONES[zid];
    if (!z) return null;
    const grid = [];
    for (let y = 0; y < z.h; y++) {
      grid[y] = [];
      for (let x = 0; x < z.w; x++) grid[y][x] = ".";
    }
    const lay = (x1, y1, x2, y2, ch) => {
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          if (grid[y] && grid[y][x] !== undefined) grid[y][x] = ch;
        }
      }
    };
    const put = (x, y, ch) => {
      if (grid[y] && grid[y][x] !== undefined) grid[y][x] = ch;
    };
    z.build({ lay, put });
    return { z, grid };
  }

  function isSolid(ch) {
    return ch === "M" || ch === "B" || ch === "F" || ch === "T" || ch === "b" || ch === "r";
  }

  // ------------------------------------------------------------------ Flusso Capitolo 1
  function S() { return stepOf(1); }

  function handleInteraction(npcId) {
    const s = S();
    if (npcId === "abi_silas") {
      if (s === 0) {
        sfxFogHorn();
        return say([
          ["abi_silas", "Ascolta i flutti, forestiero... L'odore della salsedine di Dunwich non mente. Sei vivo, contro ogni legge delle maree."],
          ["hero", "Dove mi trovo? Ricordo una tempesta repentina, la nebbia che inghiottiva la scogliera... e una luce verde smeraldo."],
          ["abi_silas", "Quella luce era il <b>Faro delle Maree Nere</b>. Sono settant'anni che le sue lenti non giravano più. Ha chiamato te."],
          ["abi_silas", "Porti sulle spalle il numero {num} e nelle gambe la risonanza di un tiro leggendario: «{tiro}». Le antiche profezie dei sommozzatori lo chiamano <i>Il Respiro della Marea</i>."],
          ["hero", "Il mio tiro speciale? Come può un tiro di calcio avere a che fare con questo arcipelago maledetto?"],
          ["abi_silas", "Qui il calcio non è solo un gioco, figliolo. È il rituale col quale i guardiani placano il <b>Grande Leviatano degli Abissi</b> prima che scagli onde di trenta metri sui nostri porti."],
          ["abi_silas", "Raccogli la prima <b>Conchiglia Fosforescente</b> vicino alla banchina e dirigiti alla <b>Taverna del Gabbiano Cieco</b> a nord-ovest. Capitan Barnaby deve vederti con i suoi occhi prima dell'alta marea."]
        ], () => {
          setStep(1, 1);
          addRelic("conchiglia_abisso", "Conchiglia Fosforescente", "Emette una luminescenza verdastra che pulsa al ritmo del battito cardiaco.");
          note("Risveglio sulla Banchina di Dunwich: Silas rivela che il Faro ha risvegliato il Campione per contrastare la marea del Leviatano.");
          done();
        });
      }
      if (s === 1) {
        return say([
          ["abi_silas", "Entra nella Taverna a nord-ovest (segui la porta con la luce ambrata). Capitan Barnaby sta discutendo con i marinai della flotta."],
        ], done);
      }
      return say([
        ["abi_silas", "Le correnti si stanno muovendo... Lo sento nelle ossa. Mostra a Barnaby di che pasta è fatto il tuo tiro!"]
      ], done);
    }

    if (npcId === "abi_marinaio") {
      sfxOceanWaves();
      return say([
        ["abi_marinaio", "Ieri notte la marea è salita di tre braccia in dieci minuti... I pesci avevano occhi umani, ve lo giuro sui miei stivali!"],
        ["hero", "La gente del borgo non ha paura di restare qui?"],
        ["abi_marinaio", "Dunwich non si abbandona, ragazzo. Chi nasce sotto il Faro ha il sale nel sangue. Ma se Barnaby non raduna una squadra per la sfida rituale, finiremo tutti in pasto ai flutti."]
      ], done);
    }

    if (npcId === "abi_barnaby") {
      if (s === 1) {
        sfxAbyssalBell();
        return say([
          ["abi_barnaby", "Per mille seppie fantasma! Allora Silas non vaneggiava... Sei davvero tu. Il Campione di cui parlano le carte nautiche."],
          ["hero", "Capitan Barnaby, immagino. Silas mi ha detto che avete bisogno del mio tiro «{tiro}» per una partita rituale."],
          ["abi_barnaby", "I pescatori sono terrorizzati. La <b>Fossa dei Sette Abissi</b> si è risvegliata. Ogni dieci inverni, dobbiamo sfidare l'equipaggio dei <i>Non-Morti della Corrente</i> sulla banchina per sigillare il gorgo."],
          ["abi_barnaby", "Ma prima di ammetterti al rito, devi dimostrarmi che sai calciare con la marea che ti bagna le caviglie. Vieni al Faro a nord: Nerissa, la Sacerdotessa delle Onde, sintonizzerà la tua aura con l'Altare."],
          ["abi_barnaby", "Se la sacerdotessa approva, giocherai la prima partita sul campo della Banchina contro i miei migliori ramponieri!"]
        ], () => {
          setStep(1, 2);
          note("Incontro con Capitan Barnaby: il Campione deve raggiungere il Faro monumentale per farsi consacrare da Nerissa.");
          done();
        });
      }
      if (s === 2) {
        return say([
          ["abi_barnaby", "Raggiungi il Faro Ciclopico salendo verso nord. Nerissa ti sta attendendo all'Altare delle Onde."]
        ], done);
      }
      if (s === 3) {
        return startMatchChapter1();
      }
      return say([
        ["abi_barnaby", "Che partita memorabile! I ramponieri non credevano ai loro occhi. Il tuo «{tiro}» ha spezzato la cresta dell'onda nera!"]
      ], done);
    }

    if (npcId === "abi_nerissa") {
      if (s === 2) {
        sfxSirenSong();
        return say([
          ["abi_nerissa", "Sento l'eco del tuo passo, Campione. Le onde di Dunwich cantano il tuo nome..."],
          ["hero", "Sei Nerissa? Barnaby mi ha mandato qui per la consacrazione del Faro."],
          ["abi_nerissa", "Guarda la lente Fresnel sopra di noi. Questa luce verde non brucia olio: brucia la determinazione di chi non cede all'abisso."],
          ["abi_nerissa", "Poggia le mani sull'Altare. Dimmi, cosa vedi nel fondo del mare? La gloria del trionfo o la salvezza di chi non sa nuotare?"],
          ["hero", "Vedo un pallone che vola oltre l'orizzonte, portando via con sé l'oscurità e restituendo la speranza a questo mare."],
          ["abi_nerissa", "Risposta degna dei Grandi Nocchieri. Ricevi la <b>Perla del Faro</b>. Il tuo tiro {tipo} ora arde con l'energia del Maelstrom."],
          ["abi_nerissa", "Torna da Barnaby: l'alta marea è giunta. È tempo di scendere sul campo della <b>Banchina delle Onde Nere</b>!"]
        ], () => {
          setStep(1, 3);
          addRelic("perla_faro", "Perla del Faro", "Una perla nera opalescente che emana un sibilo simile al canto delle onde.");
          note("Consacrazione al Faro delle Maree: Nerissa conferisce al Campione la Perla del Faro. La sfida rituale ha inizio.");
          done();
        });
      }
      return say([
        ["abi_nerissa", "Che la marea ti sia propizia, Campione. Calcia dritto verso la gloria."]
      ], done);
    }
  }

  // ------------------------------------------------------------------ Partita Capitolo 1
  function startMatchChapter1() {
    sfxFogHorn();
    const h = hero();
    const heroName = h ? h.name : "Campione";

    if (window.azStartSagaMatch) {
      // Partita d'azione pro context-aware
      if (api && api.trToast) api.trToast("⚽ SFIDA RITUALE: IL RITO DELLA BANCHINA DI DUNWICH!");
      window.azStartSagaMatch("pescatori_dunwich", {
        mode: "amic",
        pitch: "neve", // shader freddo con spruzzi
        diff: "norm",
        pu: true,
        weather: "fog",
        title: "Sfida della Marea Nera",
        roles: ["tiro", "contrasto", "dribbling"]
      }, (myGoals, oppGoals) => {
        handleMatchResult(myGoals, oppGoals);
      });
      return;
    }

    // Fallback partita JRPG narrativa del motore
    if (window.gameEngine && window.gameEngine.startMatch) {
      window.gameEngine.startMatch({
        team: "pescatori_dunwich",
        story: true,
        diff: "norm",
        onEnd: (won) => {
          handleMatchResult(won ? 2 : 0, won ? 1 : 2);
        }
      });
      return;
    }

    // Vittoria automatica fallback collaudo
    handleMatchResult(2, 1);
  }

  function handleMatchResult(myGoals, oppGoals) {
    const won = myGoals > oppGoals;
    if (won) {
      sfxAbyssalBell();
      setStep(1, 4);
      coinsGive(5);
      mem().wins = (mem().wins || 0) + 1;
      save();
      note(`Vittoria leggendaria nella Sfida della Marea (${myGoals}-${oppGoals})! Il gorgo della banchina è temporaneamente sigillato.`);
      say([
        ["abi_barnaby", `Incredibile! Vittoria ${myGoals} a ${oppGoals}! I miei ramponieri si inchinano al tuo talento, ${hero() ? hero().name : "Campione"}!`],
        ["abi_nerissa", "La marea retrocede per oggi. Ma dal profondo sento già il ruggito delle Fosse Abissali... Nel Capitolo 2 dovremo scendere nella Cripta dei Flutti Sommersa!"],
        ["hero", "Io sarò pronto. La luce del Faro non si spegnerà finché sarò in campo."],
        ["voce", `<b>CAPITOLO 1 COMPLETATO CON SUCCESSO!</b><br>Hai ottenuto 5 Monete d'Oro 🪙 e la leggendaria <i>Perla del Faro</i>.`]
      ], () => {
        renderHub();
      });
    } else {
      mem().losses = (mem().losses || 0) + 1;
      save();
      say([
        ["abi_barnaby", `La marea ha avuto la meglio: ${myGoals} a ${oppGoals}. Non disperare, ${hero() ? hero().name : "Campione"}. I flutti si ritirano sempre prima del secondo assalto. Riprova!`]
      ], () => {
        renderHub();
      });
    }
  }

  // ------------------------------------------------------------------ Dialoghi
  function say(dialogues, onComplete) {
    if (!dialogues || !dialogues.length) {
      if (onComplete) onComplete();
      return;
    }
    const [spk, text] = dialogues[0];
    const rest = dialogues.slice(1);
    const speakerId = spk === "hero" ? "hero" : spk;
    const speakerName = (CAST[speakerId] && CAST[speakerId].name) || (spk === "hero" ? (hero() ? hero().name : "Tu") : "Voce");

    const textEl = document.getElementById("text");
    if (textEl) {
      const spkColor = (CAST[speakerId] && CAST[speakerId].bg && CAST[speakerId].bg[0]) || "#0284c7";
      textEl.innerHTML = `<span class="who" style="background:${spkColor}; color:#fff; font-weight:bold;">${esc(speakerName)}</span><span class="t">${T(esc(text))}</span>`;
    }

    const choicesEl = document.getElementById("choices");
    if (choicesEl) {
      choicesEl.innerHTML = `
        <button type="button" class="choice-btn hot" id="abiAdvBtn">Continua ▸</button>
      `;
      const btn = document.getElementById("abiAdvBtn");
      if (btn) {
        btn.onclick = () => {
          if (rest.length) say(rest, onComplete);
          else if (onComplete) onComplete();
        };
      }
    }
  }

  function done() {
    renderHub();
  }

  // ------------------------------------------------------------------ Hub e Rendering
  function renderHub() {
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = false;
    if (typeof window.closeAltStage === "function") window.closeAltStage();
    if (typeof window.setView === "function") window.setView({ kind: "abisso_walk" });

    drawWorldScene();
    updateChoicesMenu();
  }

  function drawWorldScene() {
    const cv = document.getElementById("cv");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);

    const data = getBuiltZone(currentZoneId);
    if (!data) return;
    const { z, grid } = data;

    // Disegna tessere mondo centrate
    const offsetX = Math.floor((W - z.w * TS) / 2);
    const offsetY = Math.floor((H - z.h * TS) / 2);

    // Sfondo profondo abisso
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    for (let y = 0; y < z.h; y++) {
      for (let x = 0; x < z.w; x++) {
        const ch = grid[y][x];
        drawTile(ctx, ch, offsetX + x * TS, offsetY + y * TS, x, y);
      }
    }

    // Disegna NPC
    const npcs = z.npcs ? z.npcs(S()) : [];
    npcs.forEach((npc) => {
      const [nx, ny] = npc.at;
      const rx = offsetX + nx * TS;
      const ry = offsetY + ny * TS;
      // sagoma NPC
      ctx.fillStyle = (CAST[npc.id] && CAST[npc.id].bg && CAST[npc.id].bg[0]) || "#0284c7";
      ctx.beginPath();
      ctx.arc(rx + 8, ry + 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(rx + 4, ry + 10, 8, 6);
      // Fumetto indicatore interazione
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(rx + 6, ry - 4, 4, 3);
    });

    // Disegna Giocatore (Il Campione)
    const px = offsetX + playerPos[0] * TS;
    const py = offsetY + playerPos[1] * TS;
    const h = hero();
    const heroColor = (h && h.shirt) || "#0284c7";

    ctx.fillStyle = heroColor;
    ctx.beginPath();
    ctx.arc(px + 8, py + 6, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px + 4, py + 10, 8, 6);

    // Alone luce lanterna
    const grad = ctx.createRadialGradient(px + 8, py + 8, 6, px + 8, py + 8, 45);
    grad.addColorStop(0, "rgba(56, 189, 248, 0.28)");
    grad.addColorStop(1, "rgba(56, 189, 248, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px + 8, py + 8, 45, 0, Math.PI * 2);
    ctx.fill();

    // Effetto foschia / nebbia animata
    ctx.fillStyle = "rgba(14, 116, 144, 0.08)";
    for (let i = 0; i < 4; i++) {
      const fogY = (i * 45 + Date.now() * 0.02) % H;
      ctx.fillRect(0, fogY, W, 20);
    }
  }

  function updateChoicesMenu() {
    const choicesEl = document.getElementById("choices");
    if (!choicesEl) return;

    const z = ZONES[currentZoneId];
    const npcs = z.npcs ? z.npcs(S()) : [];
    const btns = [];

    // Interazioni PNG nella zona attuale
    npcs.forEach((npc) => {
      const c = CAST[npc.id];
      const name = c ? c.name : npc.id;
      btns.push({
        label: `💬 Parla con ${name}`,
        sub: `Presso (${npc.at[0]}, ${npc.at[1]})`,
        cls: "hot",
        fn: () => handleInteraction(npc.id)
      });
    });

    // Movimenti tra le zone
    if (currentZoneId === "abi_molo") {
      btns.push({
        label: "🍺 Entra nella Taverna del Gabbiano Cieco",
        sub: "Porta della taverna dei pescatori",
        fn: () => setZone("abi_taverna")
      });
      btns.push({
        label: "🗼 Sali verso il Faro delle Maree Nere",
        sub: "Sentiero delle scogliere a nord",
        fn: () => setZone("abi_faro")
      });
    } else {
      btns.push({
        label: "🌊 Torna alla Banchina dei Fari Spenti",
        sub: "Ritorno al molo principale",
        fn: () => setZone("abi_molo")
      });
    }

    if (S() >= 3) {
      btns.push({
        label: "⚽ Gioca la Sfida della Marea Nera!",
        sub: "Partita rituale contro i Pescatori dell'Abisso",
        cls: "hot",
        fn: startMatchChapter1
      });
    }

    btns.push({
      label: "◂ Torna al Menu Saghe",
      sub: "Salva i progressi dell'Abisso ed esci",
      fn: () => {
        if (EXIT) EXIT();
        else if (window.title) window.title();
      }
    });

    choicesEl.innerHTML = "";
    btns.forEach((b) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `choice-btn ${b.cls || ""}`;
      btn.innerHTML = `<span>${esc(b.label)}</span>${b.sub ? `<small>${esc(b.sub)}</small>` : ""}`;
      btn.onclick = () => {
        try { if (window.haptic) window.haptic(15); } catch (e) {}
        if (b.fn) b.fn();
      };
      choicesEl.appendChild(btn);
    });
  }

  // ------------------------------------------------------------------ Hook nel Loop di Render del Gioco
  function hookGameRender() {
    const origRender = window.render;
    // Se view.kind è abisso_walk, disegna il mondo ad ogni frame per consentire effetti animati
    const tick = () => {
      if (window.view && window.view.kind === "abisso_walk") {
        drawWorldScene();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  hookGameRender();

  // ------------------------------------------------------------------ API Pubblica
  function openAbisso(opts) {
    EXIT = (opts && opts.onExit) || null;
    initPlayer();
    setZone("abi_molo");
    sfxFogHorn();

    if (window.setChapter) window.setChapter("Abisso di Dunwich · Cap. 1: Il Risveglio tra le Nebbie");
    if (api && api.renderText) {
      api.renderText("voce", `<b>Abisso di Dunwich · Il Patto delle Onde Nere</b><br>La nebbia avvolge la costa spettrale. Silas il Palombaro ti osserva dalla banchina bagnata dalla risacca.`);
    }

    renderHub();
  }

  window.__abissoStory = {
    open: openAbisso,
    sfxHorn: sfxFogHorn,
    sfxBell: sfxAbyssalBell,
    sfxWaves: sfxOceanWaves,
    sfxSiren: sfxSirenSong,
    menuEntry(backFn) {
      return {
        label: "⚓ Gioca «Abisso di Dunwich · Il Patto delle Onde Nere» ▸",
        sub: `Nuova saga dark oceanica Lovecraftiana con ${hero() ? hero().name : "il tuo Campione"}`,
        cls: "hot",
        fn: () => openAbisso({ onExit: backFn })
      };
    }
  };

  // Integrazione api con il motore principale
  const poll = setInterval(() => {
    tries++;
    if (window.CAST && window.TEAMS) {
      api = {
        CAST: window.CAST,
        TEAMS: window.TEAMS,
        renderText: window.renderText || window.text,
        trToast: window.toast || ((t) => console.log(t))
      };
      // Inietta CAST in CAST globale
      Object.assign(window.CAST, CAST);
      // Inietta squadra avversaria nei TEAMS di gioco
      window.TEAMS.pescatori_dunwich = {
        name: "Pescatori dell'Abisso",
        short: "Abisso",
        color: "#0369a1",
        gk: ["Dagon «Mano Salata»", 78],
        df: ["Barnaby il Vecchio", "Silas il Sub"],
        mf: ["Nerissa delle Onde", "Jonah il Naufrago"],
        fw: ["Goran l'Arpione", "Marea Nera"]
      };
      clearInterval(poll);
    }
    if (tries > 60) clearInterval(poll);
  }, 100);

})();
