// js/abisso-story.js - ABISSO DI DUNWICH: Il Patto delle Onde Nere
// Saga dark oceanica / Lovecraftian nautical mystery con il Campione creato dall'utente come protagonista.
// Motore 2D camminabile integrato in window.__borgoApi (stesso sistema di Vallombra, Pirati Celesti, Kronenburg e Ragnarok).
// Camminamento a piedi libero con D-pad e tastiera, tessere pixel-art esclusive, PNG animati, reperti da raccogliere,
// dialoghi a scelte, colpi di scena e partite di calcio a tema idrodinamico con pareti d'acqua e correnti marine.
(function () {
  "use strict";
  if (window.__abissoStoryLoaded) return;
  window.__abissoStoryLoaded = true;

  const KEY = "ali-di-rondine.abisso-story", TS = 16;
  let api = null, tries = 0, EXIT = null;

  // ------------------------------------------------------------------ Audio Procedurale Marino
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function sfxFogHorn() {
    try {
      const ctx = getAudioCtx(); if (!ctx) return;
      const osc = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 2.2);
      filter.type = "lowpass"; filter.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.4);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 2.5);
    } catch (e) {}
  }

  function sfxAbyssalBell() {
    try {
      const ctx = getAudioCtx(); if (!ctx) return;
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 1.8);
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 2.0);
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Utilità e Salvataggio Normalizzato
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  const arr = (a) => (Array.isArray(a) ? a : []);
  const clampI = (v, a, b, d) => { v = Math.round(+v); return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rnd = (tx, ty, k) => (hash(tx * 89 + ty * 149 + k * 23) % 1000) / 1000;

  function norm(o) {
    o = obj(o);
    const m = {
      v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {},
      zone: typeof o.zone === "string" ? o.zone : "abi_molo", relics: arr(o.relics), log: arr(o.log), intro: {}
    };
    const st = obj(o.step); Object.keys(st).forEach((k) => { const n = clampI(k, 1, 99, 0); if (n) m.step[n] = clampI(st[k], 0, 99, 0); });
    const fl = obj(o.flags); Object.keys(fl).forEach((k) => { m.flags[k] = fl[k]; });
    const dn = obj(o.done); Object.keys(dn).forEach((k) => { m.done[k] = String(dn[k]); });
    Object.keys(obj(o.intro)).forEach((k) => { m.intro[k] = 1; });
    return m;
  }

  let MEM = null;
  const mem = () => MEM || (MEM = norm(safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {})));
  const save = () => { safe(() => localStorage.setItem(KEY, JSON.stringify(mem()))); };
  const reload = () => { MEM = null; return mem(); };

  const F = {
    get: (k, d) => { const v = mem().flags[k]; return v === undefined ? d : v; },
    set: (k, v) => { mem().flags[k] = v; save(); },
    is: (k) => !!mem().flags[k],
    add: (k, n) => { const v = (+mem().flags[k] || 0) + (n || 1); F.set(k, v); return v; }
  };

  const stepOf = (ch) => clampI(mem().step[ch], 0, 99, 0);
  const setStep = (ch, s) => { mem().step[ch] = clampI(s, 0, 99, 0); save(); refreshZone(); };

  const hero = () => (typeof window.heroLoad === "function" ? window.heroLoad() : null);
  function castHero() {
    if (!api || !api.CAST) return;
    const h = hero();
    if (h) {
      api.CAST.hero = Object.assign({}, h, {
        role: "Il Campione dell'Abisso",
        shirt: h.shirt || "#0284c7",
        eye: h.eye || "#38bdf8"
      });
    }
  }

  function T(s) {
    if (typeof s !== "string") return "";
    const h = hero();
    const name = (h && h.name) || "Campione";
    const num = (h && h.num) || 10;
    const shot = (h && h.shotName) || "Tiro dell'Abisso";
    return s.replace(/\{n\}/g, name).replace(/\{num\}/g, String(num)).replace(/\{shot\}/g, shot);
  }

  // ------------------------------------------------------------------ Cast & Personaggi di Dunwich
  const CAST_Q = [
    ["abi_silas", { name: "Silas il Palombaro", tag: "Palombaro dell'Abisso", skin: "#c89d7c", hair: "#64748b", style: "corto", eye: "#38bdf8", shirt: "#0f766e" }, "Veterano delle immersioni profonde a Dunwich. Porta un antico scafandro in rame con incisioni runiche."],
    ["abi_barnaby", { name: "Capitan Barnaby", tag: "Comandante della Sirena Spezzata", skin: "#b48a60", hair: "#e2e8f0", style: "lungo", eye: "#0284c7", shirt: "#1e293b" }, "Burbero capitano di mare con la barba incrostata di sale e la pipa in radica. Comanda la ciurma dei pescatori di Dunwich."],
    ["abi_armitage", { name: "Dottor Armitage", tag: "Erudito di Archeologia Marina", skin: "#e2c09c", hair: "#94a3b8", style: "ordinato", eye: "#475569", shirt: "#334155" }, "Studioso giunto dal continente per decifrare i tomi ricoperti di balani e le misteriose rune della Coppa delle Onde Nere."],
    ["abi_nora", { name: "Nora la Guardiana", tag: "Custode del Faro delle Maree", skin: "#dab490", hair: "#b45309", style: "coda", eye: "#06b6d4", shirt: "#ca8a04" }, "Veglia sull'antica torre ottagonale del Faro di Dunwich dopo l'oscura scomparsa del padre tra i flutti."],
    ["abi_jonah", { name: "Jonah dei Fondali", tag: "Pescatore d'Alto Mare", skin: "#a87850", hair: "#1e293b", style: "corto", eye: "#0369a1", shirt: "#0369a1" }, "Pescatore veterano che conosce ogni secca, ogni scoglio e ogni canto ingannevole che sale dalla fossa marina."],
    ["abi_corvo", { name: "Marinaio Corvo", tag: "Vedetta del Frangiflutti", skin: "#c49a74", hair: "#0f172a", style: "bandana", eye: "#334155", shirt: "#0f172a" }, "Silenziosa vedetta che scruta le onde e batte i rintocchi della campana al salire della marea."]
  ];

  // ------------------------------------------------------------------ Sfondi Dettagliati (renderDetailedBg)
  function glow(g, x, y, rad, col, a) {
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    grd.addColorStop(0, `rgba(${col},${a})`);
    grd.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  }

  function bgMolo(g, W, H, f) {
    // Cielo notturno oceanico
    const sky = g.createLinearGradient(0, 0, 0, H * 0.65);
    sky.addColorStop(0, "#020617"); sky.addColorStop(0.5, "#0b192c"); sky.addColorStop(1, "#1e293b");
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    // Stelle salmastre
    g.fillStyle = "#ffffff";
    for (let i = 0; i < 30; i++) {
      const sx = (i * 37 + 11) % W, sy = (i * 29 + 7) % (H * 0.45);
      if ((i + Math.floor(f / 20)) % 5 !== 0) g.fillRect(sx, sy, 1.5, 1.5);
    }
    // Luna velata
    glow(g, W * 0.75, 38, 40, "186,230,253", 0.35);
    g.fillStyle = "#e0f2fe"; g.beginPath(); g.arc(W * 0.75, 38, 12, 0, Math.PI * 2); g.fill();
    // Faro in lontananza sulla scogliera
    g.fillStyle = "#0f172a";
    g.beginPath(); g.moveTo(W * 0.88, H * 0.45); g.lineTo(W * 0.86, H * 0.22); g.lineTo(W * 0.90, H * 0.22); g.lineTo(W * 0.88, H * 0.45); g.fill();
    // Fascio di luce del faro
    const beamAngle = (f * 0.03) % (Math.PI * 2);
    g.save(); g.globalCompositeOperation = "lighter";
    const bgd = g.createRadialGradient(W * 0.88, H * 0.22, 2, W * 0.88 + Math.cos(beamAngle) * 120, H * 0.22 + Math.sin(beamAngle) * 30, 90);
    bgd.addColorStop(0, "rgba(56,189,248,0.7)"); bgd.addColorStop(1, "rgba(56,189,248,0)");
    g.fillStyle = bgd; g.beginPath(); g.moveTo(W * 0.88, H * 0.22); g.arc(W * 0.88, H * 0.22, 140, beamAngle - 0.25, beamAngle + 0.25); g.fill();
    g.restore();
    // Mare scuro con riflessi d'onda
    const sea = g.createLinearGradient(0, H * 0.55, 0, H);
    sea.addColorStop(0, "#082f49"); sea.addColorStop(0.5, "#0369a1"); sea.addColorStop(1, "#075985");
    g.fillStyle = sea; g.fillRect(0, H * 0.55, W, H * 0.45);
    g.fillStyle = "#38bdf8";
    for (let r = 0; r < 5; r++) {
      const y = H * 0.58 + r * 14;
      const waveOff = Math.sin(f / 15 + r) * 8;
      g.fillRect(10 + waveOff, y, W * 0.35, 1);
      g.fillRect(W * 0.45 - waveOff, y + 4, W * 0.45, 1);
    }
    // Molo di pietre scure in primo piano
    g.fillStyle = "#0f172a"; g.fillRect(0, H * 0.78, W, H * 0.22);
    g.fillStyle = "#1e293b"; g.fillRect(0, H * 0.78, W, 3);
    // Palo d'ormeggio e lanterna calda
    g.fillStyle = "#334155"; g.fillRect(24, H * 0.68, 6, 26);
    glow(g, 27, H * 0.68, 22, "251,191,36", 0.5 + 0.1 * Math.sin(f / 10));
    g.fillStyle = "#fbbf24"; g.fillRect(25, H * 0.67, 4, 5);
  }

  function bgTaverna(g, W, H, f) {
    // Interno caldo della Taverna del Gabbiano Cieco
    g.fillStyle = "#0f172a"; g.fillRect(0, 0, W, H);
    // Travi in legno massiccio
    g.fillStyle = "#1e293b";
    for (let x = 0; x < W; x += 40) g.fillRect(x, 0, 6, H * 0.7);
    g.fillRect(0, H * 0.35, W, 8);
    // Focolare con fiamme calde
    glow(g, W * 0.22, H * 0.55, 60, "249,115,22", 0.45 + 0.08 * Math.sin(f / 8));
    g.fillStyle = "#ea580c"; g.fillRect(W * 0.16, H * 0.5, 36, 30);
    g.fillStyle = "#facc15"; g.fillRect(W * 0.19, H * 0.53 + Math.sin(f / 6) * 2, 20, 18);
    // Bancone del bar con barili e boccali
    g.fillStyle = "#334155"; g.fillRect(W * 0.45, H * 0.55, W * 0.52, 24);
    g.fillStyle = "#475569"; g.fillRect(W * 0.45, H * 0.55, W * 0.52, 3);
    // Bottiglie e boccali sul bancone
    g.fillStyle = "#0284c7"; g.fillRect(W * 0.52, H * 0.51, 4, 7);
    g.fillStyle = "#10b981"; g.fillRect(W * 0.60, H * 0.50, 5, 8);
    g.fillStyle = "#fbbf24"; g.fillRect(W * 0.72, H * 0.52, 6, 6);
    // Pavimento in tavolame
    g.fillStyle = "#090d16"; g.fillRect(0, H * 0.75, W, H * 0.25);
    g.fillStyle = "#1e293b";
    for (let y = H * 0.75; y < H; y += 10) g.fillRect(0, y, W, 1);
  }

  function bgFaro(g, W, H, f) {
    // Rupe oceanica con scogliera a picco e maestoso faro
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#030712"); sky.addColorStop(0.5, "#0c1829"); sky.addColorStop(1, "#034066");
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    // Onde che si infrangono sui faraglioni
    glow(g, W * 0.5, 45, 90, "56,189,248", 0.4);
    // Torre ottagonale in muratura
    g.fillStyle = "#1e293b";
    g.beginPath(); g.moveTo(W * 0.44, H * 0.9); g.lineTo(W * 0.47, H * 0.2); g.lineTo(W * 0.53, H * 0.2); g.lineTo(W * 0.56, H * 0.9); g.fill();
    // Fasce bianche e rosse del faro
    g.fillStyle = "#cbd5e1"; g.fillRect(W * 0.46, H * 0.35, W * 0.08, 14);
    g.fillStyle = "#991b1b"; g.fillRect(W * 0.455, H * 0.52, W * 0.09, 14);
    // Lanterna del faro e cupola
    g.fillStyle = "#38bdf8"; g.fillRect(W * 0.465, H * 0.16, W * 0.07, 10);
    g.fillStyle = "#0f172a";
    g.beginPath(); g.arc(W * 0.5, H * 0.16, 12, Math.PI, 0); g.fill();
    // Fascio girevole
    const ang = (f * 0.04) % (Math.PI * 2);
    g.save(); g.globalCompositeOperation = "lighter";
    const grd = g.createLinearGradient(W * 0.5, H * 0.2, W * 0.5 + Math.cos(ang) * 160, H * 0.2 + Math.sin(ang) * 60);
    grd.addColorStop(0, "rgba(56,189,248,0.85)"); grd.addColorStop(1, "rgba(56,189,248,0)");
    g.fillStyle = grd; g.beginPath(); g.moveTo(W * 0.5, H * 0.2); g.arc(W * 0.5, H * 0.2, 180, ang - 0.22, ang + 0.22); g.fill();
    g.restore();
    // Scogliera nera e spruzzi
    g.fillStyle = "#020617";
    g.beginPath(); g.moveTo(0, H * 0.75); g.lineTo(W * 0.35, H * 0.65); g.lineTo(W * 0.65, H * 0.68); g.lineTo(W, H * 0.72); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  }

  function bgArena(g, W, H, f) {
    // Campo della Risacca Sommersa: mura di pietra ciclopiche e campo tra i frangiflutti
    const sky = g.createLinearGradient(0, 0, 0, H * 0.5);
    sky.addColorStop(0, "#020617"); sky.addColorStop(1, "#072b4a");
    g.fillStyle = sky; g.fillRect(0, 0, W, H * 0.5);
    // Spalti e frangiflutti con lanterne accese
    g.fillStyle = "#0f172a"; g.fillRect(0, H * 0.25, W, H * 0.25);
    for (let x = 15; x < W; x += 30) {
      glow(g, x, H * 0.32, 14, "56,189,248", 0.5);
      g.fillStyle = "#38bdf8"; g.fillRect(x - 1, H * 0.31, 3, 3);
    }
    // Terreno di gioco: sabbia scura e prato marino salmastro
    const pitch = g.createLinearGradient(0, H * 0.45, 0, H);
    pitch.addColorStop(0, "#064e3b"); pitch.addColorStop(1, "#022c22");
    g.fillStyle = pitch; g.fillRect(0, H * 0.45, W, H * 0.55);
    // Linee di gesso bianco luminoso
    g.strokeStyle = "#38bdf8"; g.lineWidth = 1.5;
    g.strokeRect(20, H * 0.55, W - 40, H * 0.4);
    g.beginPath(); g.arc(W / 2, H * 0.75, 24, 0, Math.PI * 2); g.stroke();
    // Cartelloni pubblicitari marinari d'epoca
    g.fillStyle = "#1e293b"; g.fillRect(25, H * 0.46, 75, 10);
    g.fillRect(W - 100, H * 0.46, 75, 10);
    g.fillStyle = "#38bdf8"; g.font = "bold 6px sans-serif";
    g.fillText("FARO DI DUNWICH 1892", 28, H * 0.46 + 7);
    g.fillText("LEVIATANI D'ABISSO", W - 97, H * 0.46 + 7);
  }

  const BGS = {
    abi_molo: bgMolo,
    abi_taverna: bgTaverna,
    abi_faro: bgFaro,
    abi_arena: bgArena
  };

  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) { safe(() => BGS[kind](g, W || 320, H || 200, frame || 0)); return true; }
    return typeof prevBg === "function" ? prevBg.apply(this, arguments) : false;
  };

  // ------------------------------------------------------------------ Tessere Pixel-Art (16x16) del Motore Camminabile
  // Pavimenti:
  //   , = lastricato scuro di pietra umida del porto
  //   = = pontile di assi di legno marinaro
  //   ~ = acqua oceanica profonda con fosforescenza
  //   p = piazza circolare del faro con mosaico
  //   _ = roccia basaltica della scogliera
  //   y = erba salmastra / sabbia marina della risacca
  //   i = pavimento a doghe in legno della taverna
  //   c = tappeto / stuoia di canapa cerata
  // Ostacoli & Oggetti:
  //   W = parete di legno massiccio
  //   h = muraglione di pietra scura
  //   e = tetto spiovente in ardesia
  //   u, q, w, D = porte d'ingresso
  //   l = lampione a cherosene con alone caldo
  //   b = barile di rum e salamoia
  //   x = casse di legname e merci
  //   t = palo d'ormeggio con gomena
  //   r = parapetto di ferro e catene
  //   k = barca da pesca ormeggiata
  //   F = grande lente del faro / altare
  //   C = cristallo / conchiglia bioluminescente
  //   s = cartello di legno intagliato
  //   R = campana delle nebbie di bronzo
  //   A = grande ancora arrugginita
  //   >, <, ^, d = varchi di passaggio tra le zone
  const FLOORS = ',=~p_yic';
  const SOLID = "WheuqwtlbrkxFCsRA><^d";
  const isFloor = (c) => !!c && FLOORS.includes(c);

  let GP = null;
  const P = (x, y, w, h, col) => { if (GP) { GP.fillStyle = col; GP.fillRect(x, y, w, h); } };
  const frNow = () => Math.floor(performance.now() / 16);

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 1);
    if (f === ",") {
      // Lastricato di pietra umida
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#1e293b" : "#172554");
      P(sx, sy + 7, 16, 1, "#0f172a");
      P(sx + (ty % 2 ? 4 : 11), sy, 1, 7, "#0f172a");
      P(sx + (ty % 2 ? 11 : 4), sy + 8, 1, 8, "#0f172a");
      if (r < 0.2) P(sx + 5, sy + 9, 3, 2, "#38bdf8"); // riflesso d'acqua
    } else if (f === "=") {
      // Pontile in legno
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#334155" : "#38475c");
      for (let i = 0; i < 4; i++) P(sx, sy + i * 4, 16, 1, "#1e293b");
      P(sx + 2, sy + 2, 1, 1, "#94a3b8"); P(sx + 13, sy + 2, 1, 1, "#94a3b8");
    } else if (f === "~") {
      // Acqua oceanica profonda con onde animate
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0369a1" : "#0284c7");
      const off = (tx + Math.floor(frNow() / 14) + ty) % 4;
      if (off === 0) P(sx + 2, sy + 6, 8, 1, "#bae6fd");
      if (off === 2) P(sx + 7, sy + 11, 7, 1, "#38bdf8");
    } else if (f === "p") {
      // Piazza circolare del faro
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#334155" : "#475569");
      P(sx, sy, 16, 1, "#64748b"); P(sx, sy + 15, 16, 1, "#1e293b");
      if ((tx * 3 + ty * 7) % 5 === 0) P(sx + 7, sy + 7, 2, 2, "#06b6d4");
    } else if (f === "_") {
      // Roccia basaltica scura
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0f172a" : "#1e1e24");
      if (r < 0.25) P(sx + 4, sy + 5, 4, 3, "#334155");
    } else if (f === "y") {
      // Erba salmastra / sabbia dell'arena
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#064e3b" : "#047857");
      if ((tx * 5 + ty * 3) % 4 === 0) P(sx + 6, sy + 6, 2, 2, "#10b981");
    } else if (f === "i") {
      // Doghe in legno della taverna
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#451a03" : "#78350f");
      P(sx, sy + 7, 16, 1, "#291307"); P(sx + (ty % 2 ? 5 : 12), sy, 1, 16, "#291307");
    } else if (f === "c") {
      // Tappeto / stuoia marina
      P(sx, sy, 16, 16, "#0f766e");
      P(sx + 1, sy + 1, 14, 14, "#115e59");
    }
  }

  const PAINT = {
    W(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx, sy, 16, 16, "#1e293b");
      P(sx, sy, 16, 2, "#334155"); P(sx, sy + 14, 16, 2, "#0f172a");
      for (let i = 0; i < 3; i++) P(sx + i * 5 + 3, sy + 2, 1, 12, "#0f172a");
    },
    h(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx, sy, 16, 16, "#0f172a");
      P(sx, sy, 16, 2, "#334155"); P(sx, sy + 8, 16, 1, "#020617");
      P(sx + (ty % 2 ? 4 : 11), sy + 2, 1, 6, "#020617");
    },
    e(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx, sy, 16, 16, "#020617");
      for (let r = 0; r < 4; r++) { P(sx, sy + r * 4, 16, 1, "#1e293b"); P(sx, sy + r * 4 + 1, 16, 3, "#0f172a"); }
    },
    D(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 2, sy + 1, 12, 15, "#1e293b");
      P(sx + 3, sy + 2, 10, 13, "#78350f");
      P(sx + 11, sy + 8, 2, 2, "#fbbf24"); // maniglia in ottone
      P(sx + 5, sy + 4, 6, 4, "#0284c7"); // finestrella a vetro
    },
    u(sx, sy, tx, ty) { PAINT.D(sx, sy, tx, ty); },
    q(sx, sy, tx, ty) { PAINT.D(sx, sy, tx, ty); },
    w(sx, sy, tx, ty) { PAINT.D(sx, sy, tx, ty); },
    l(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 7, sy + 4, 2, 12, "#334155");
      P(sx + 5, sy + 2, 6, 4, "#fbbf24");
      glow(GP, sx + 8, sy + 4, 16, "251,191,36", 0.45 + 0.1 * Math.sin(frNow() / 10));
    },
    b(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 3, sy + 2, 10, 12, "#78350f");
      P(sx + 2, sy + 5, 12, 2, "#1e293b"); // cerchio di ferro
      P(sx + 2, sy + 10, 12, 2, "#1e293b");
      P(sx + 4, sy + 2, 8, 1, "#b45309");
    },
    x(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 2, sy + 2, 12, 12, "#92400e");
      P(sx + 2, sy + 2, 12, 1, "#d97706"); P(sx + 2, sy + 13, 12, 1, "#451a03");
      P(sx + 3, sy + 3, 10, 10, "#78350f");
      P(sx + 4, sy + 4, 8, 8, "#92400e");
    },
    t(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 6, sy + 3, 4, 13, "#475569");
      P(sx + 5, sy + 6, 6, 4, "#b45309"); // gomena arrotolata
    },
    r(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx, sy + 6, 16, 2, "#334155"); P(sx + 2, sy + 6, 2, 10, "#1e293b"); P(sx + 12, sy + 6, 2, 10, "#1e293b");
    },
    k(sx, sy, tx, ty) {
      // Barca da pesca ormeggiata
      P(sx, sy, 16, 16, "#0369a1");
      P(sx + 1, sy + 4, 14, 8, "#1e293b");
      P(sx + 3, sy + 5, 10, 6, "#b45309");
      P(sx + 7, sy + 2, 2, 5, "#e2e8f0");
      glow(GP, sx + 8, sy + 3, 8, "251,191,36", 0.35);
    },
    F(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 4, sy + 2, 8, 12, "#0891b2");
      P(sx + 6, sy + 4, 4, 8, "#e0f2fe");
      glow(GP, sx + 8, sy + 8, 20, "56,189,248", 0.6 + 0.15 * Math.sin(frNow() / 12));
    },
    C(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 6, sy + 5, 4, 6, "#06b6d4");
      P(sx + 7, sy + 6, 2, 3, "#cffafe");
      glow(GP, sx + 8, sy + 8, 14, "6,182,212", 0.5 + 0.2 * Math.sin(frNow() / 10));
    },
    s(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 7, sy + 8, 2, 8, "#78350f");
      P(sx + 3, sy + 3, 10, 6, "#b45309");
      P(sx + 4, sy + 4, 8, 4, "#d97706");
    },
    R(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 6, sy + 2, 4, 3, "#475569");
      P(sx + 4, sy + 5, 8, 7, "#d97706");
      P(sx + 5, sy + 6, 6, 5, "#fbbf24"); // campana di bronzo
      P(sx + 7, sy + 12, 2, 2, "#78350f");
    },
    A(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 6, sy + 2, 4, 2, "#475569");
      P(sx + 7, sy + 4, 2, 8, "#334155");
      P(sx + 3, sy + 10, 10, 2, "#334155");
      P(sx + 2, sy + 8, 2, 3, "#475569"); P(sx + 12, sy + 8, 2, 3, "#475569");
    },
    // Varchi di passaggio
    ">": (sx, sy, tx, ty) => { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 6, sy + 4, 4, 8, "#38bdf8"); },
    "<": (sx, sy, tx, ty) => { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 6, sy + 4, 4, 8, "#38bdf8"); },
    "^": (sx, sy, tx, ty) => { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 4, sy + 6, 8, 4, "#38bdf8"); },
    d: (sx, sy, tx, ty) => { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 4, sy + 6, 8, 4, "#38bdf8"); }
  };

  const ZX = { map: null, under: null, id: "" };
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";

  function drawTile(ch, sx, sy, tx, ty) {
    GP = GP || document.getElementById("cv").getContext("2d");
    if (isFloor(ch)) { floorPaint(ch, sx, sy, tx, ty); return true; }
    const fn = PAINT[ch];
    if (fn) { fn(sx, sy, tx, ty); return true; }
    floorPaint(",", sx, sy, tx, ty);
    return false;
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
  const PENDING = [];

  function addChapter(fn) {
    const c = typeof fn === "function" ? fn(XTOOLS) : fn;
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
      if (zr && zr.Z && zr.Z.npcs.some((n) => n.id === id)) {
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
        const fn = o[`${id}:${ch}:${tx},${ty}`] || o[`${id}:${tx},${ty}`] || o[`${id}:${ch}`] || o[ch];
        if (typeof fn !== "function") return false;
        castHero(); fn({ ch, tx, ty, zid: id }); return true;
      }
    };
    ZONES[id] = rec;

    const act = Object.assign({}, Z.act || {});
    const c0 = CHAPTERS[chN];
    Object.keys((c0 && c0.obj) || {}).forEach((k) => {
      if (k.indexOf(id + ":") !== 0) return;
      const ch = k.slice(id.length + 1);
      if (ch.length === 1 && !act[ch]) act[ch] = EXIT_CH.includes(ch) ? "Passa oltre" : "Esamina";
    });

    const T0 = {
      name: Z.name, short: Z.short || Z.name, sub: Z.sub || "", need: 0,
      w: Z.w, h: Z.h, start: Z.start || [6, 18], theme: Z.theme || "torino", bg: Z.bg || "abi_molo",
      bus: "cancello", busLabel: "Lascia Dunwich",
      item: Z.item || ["Perla dell'Abisso", "Perle"], itemCos: Z.itemCos, items: Z.items || [],
      bld: [], npcs: [], areas: Z.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act, intro: [],
      me() {
        const c = api.CAST.hero || api.CAST.leo || {};
        return Object.assign({}, c, { shirt: "#0284c7", eye: "#38bdf8" });
      },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d");
        g.save(); g.globalCompositeOperation = "lighter";
        glow(g, x, y, 14, "56,189,248", 0.6 + 0.2 * Math.sin(frNow() / 10 + i));
        g.restore();
        g.fillStyle = "#38bdf8";
        g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#ffffff"; g.fillRect(x - 1, y - 1, 2, 2);
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
        zoneMenu();
      }
    };

    if (Z.decor) {
      T0.decor = function (cx, cy) {
        if (Z.decor) Z.decor(cx, cy);
      };
    }

    T0.npcs = rec.npcs();
    rec.T = T0;
    rec.Z = T0;
    api.TRZ[id] = T0;
  }

  const zoneRec = () => (api && api.trZone ? ZONES[api.trZone()] : null);
  const bgNow = () => (zoneRec() && zoneRec().spec && zoneRec().spec.bg) || (zoneRec() && zoneRec().Z && zoneRec().Z.bg) || "abi_molo";

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

  function go(zid, tx, ty) {
    const tr = api.trRec();
    if (tr && tr.pos) tr.pos[zid] = [tx * TS + 8, ty * TS + 12];
    enterZone(zid, tx, ty);
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
    const m = mem();
    if (!m.rew[key]) {
      m.rew[key] = 1;
      if (o.coins && api.bCos) {
        // monete
        msg.push(`+${o.coins} monete d'oro`);
      }
      if (o.relic) {
        m.relics.push(o.relic);
        msg.push(`Nuovo reperto: ${o.relic}`);
      }
      save();
    }
    return msg;
  }

  const dunwichTeam = (t, st) => ({
    name: "Sirena Spezzata",
    col: "#0f766e",
    color: "#0f766e",
    vs: "l'Equipaggio della Sirena Spezzata",
    style: "Tackle Bassi, Pareti d'Acqua & Tiro a Spirale",
    atk: t(((st && st.tiro) || 14) * 1.05),
    def: t(((st && st.contrasto) || 12) * 1.15),
    vel: t(((st && st.drib) || 12) * 1.05),
    gk: ["Barnaby", t(((st && st.tiro) || 14) * 1.1)],
    defs: [["Jonah", t(12)], ["Corvo", t(13)], ["Palombaro Nero", t(12)]],
    atk: [["Baciccia d'Abisso", t(13)], ["Marinaio Marea", t(14)]]
  });

  function playMatch(o) {
    castHero();
    const VENUE_DUNWICH = {
      ads: [["FARO DI DUNWICH 1892", "#0284c7"], ["SIRENA SPEZZATA", "#0f766e"], ["LEVIATANI D'ABISSO", "#075985"], ["RUM DEL PALOMBARO", "#b45309"]],
      crowd: ["#0284c7", "#0f766e", "#1e293b", "#38bdf8", "#facc15"],
      ground: ["#064e3b", "#047857"],
      patches: "rgba(56,189,248,.35)",
      tint: "rgba(2,132,199,.15)",
      glow: "56,189,248"
    };

    api.matchPick({
      alt: o.alt,
      oppNames: o.oppNames || ["Barnaby", "Jonah", "Corvo", "Silas", "Marea"],
      squad: o.squad,
      azPitch: "neve",
      homeKit: "#0284c7",
      id: o.id || "dunwich_cup",
      chap: o.chap || "Abisso di Dunwich · Coppa delle Onde Nere",
      intro: T(o.intro),
      mate: o.mate || "Silas",
      mateGeneric: true,
      us: o.us || "Leviatani Dunwich",
      min: o.min || 45,
      team: typeof o.team === "function" ? o.team : dunwichTeam,
      venue: o.venue || VENUE_DUNWICH,
      onDone: (r) => {
        refreshZone();
        o.done(r);
      }
    });
  }

  const goalNow = () => {
    const c = activeChapter();
    return c && c.goal ? T(c.goal(stepOf(c.n))) : "";
  };

  function zoneMenu() {
    const c = activeChapter(), h = hero(), m = mem();
    api.trAsk(
      "voce",
      `<b>⚓ Abisso di Dunwich</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Reperti abissali ${m.relics.length}/8${h ? " · " + esc(h.name) : ""}</span>`,
      [
        { label: "◂ Torna a camminare", cls: "hot", fn: () => api.trResume() },
        { label: "Taccuino dell'Abisso", sub: "Reperti, tomi e annotazioni marine", fn: () => notebook(zoneMenu, true) },
        { label: "Menu della Saga", sub: "Ricomincia o consulta capitoli", fn: () => api.trExitTo(() => openMain()) },
        { label: "Esci da Dunwich", sub: "Salva ed esci al menu principale", fn: leaveToModes }
      ],
      bgNow()
    );
  }

  function notebook(back, inZone) {
    const m = mem(), h = hero();
    const rows = (m.relics.length ? m.relics.map((r) => `⚓ <b>${esc(r)}</b>`) : ["<span style='color:var(--dim)'>Nessun reperto recuperato finora. Esplora il molo e le scogliere.</span>"]);
    const text = `<b>Taccuino di ${esc((h && h.name) || "Dunwich")}</b><br>Capitolo attivo: ${m.ch}<br><br><b>Reperti e Segreti dell'Abisso:</b><br>${rows.join("<br>")}`;
    if (inZone) {
      api.trAsk("voce", text, [{ label: "◂ Indietro", fn: back }], bgNow());
    } else {
      api.scene("abi_molo", "voce", text, [{ label: "◂ Indietro", fn: back }], "Taccuino dell'Abisso");
    }
  }

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
        "abi_molo", "voce",
        "<b>⚓ Abisso di Dunwich · Il Patto delle Onde Nere</b><br>Una saga oscura marina di mistero e calcio oceanico. Richiede il tuo Campione: nome, aspetto, numero e tiro speciale sono protagonisti assoluti.<br><br>Prima crea il tuo campione nel menu!",
        [
          { label: "Crea il tuo Campione", sub: "Nome, look e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
          { label: "◂ Torna alle Modalità", fn: leaveToModes }
        ],
        "Abisso di Dunwich"
      );
    }

    castHero();
    const c = activeChapter(), m = mem(), curDone = c && m.done[c.n];

    api.scene(
      "abi_molo", "voce",
      `<b>⚓ Abisso di Dunwich · Il Patto delle Onde Nere</b><br>${esc(h.name)} · n. ${esc(h.num)}<br><span style="color:var(--dim)">«${esc(h.shotName || "Il Richiamo dell'Abisso")}»</span><br><br><span style="color:#38bdf8">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}</span><br><span style="color:var(--dim)">${curDone ? "Capitolo completato! Esplora Dunwich, parla con i marinai o rigioca la sfida." : esc(goalNow())}</span>`,
      [
        {
          label: curDone ? "Torna a Dunwich" : c && !m.intro["ch" + c.n] ? `Inizia il Capitolo ${c.n}` : "Continua l'Esplorazione",
          sub: c ? `Capitolo ${c.n} · ${c.title}` : "",
          cls: "hot",
          fn: continueStory
        },
        { label: "Taccuino dell'Abisso", sub: `Reperti ${m.relics.length}/8 · Note e annotazioni`, fn: () => notebook(openMain, false) },
        { label: "Capitoli della Saga", sub: "Progressi ed episodi", fn: chaptersList },
        { label: "◂ Torna alle Modalità", fn: leaveToModes }
      ],
      "Abisso di Dunwich"
    );
  }

  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    const isNew = !m.intro["ch" + c.n];
    if (isNew) {
      m.intro["ch" + c.n] = 1; save();
      sfxFogHorn();
      if (c.intro) {
        return say(c.intro(), () => {
          go(c.start || "abi_molo", 6, 18);
        });
      }
    }
    const tr = api.trRec();
    const curZ = (m.zone && ZONES[m.zone]) ? m.zone : (c.start || "abi_molo");
    if (!tr.pos[curZ]) {
      const zr = ZONES[curZ];
      const st = (zr && zr.Z && zr.Z.start) || [6, 18];
      tr.pos[curZ] = [st[0] * TS + 8, st[1] * TS + 12];
    }
    enterZone(curZ);
  }

  function chaptersList() {
    const m = mem(), rows = [];
    for (let n = 1; n <= 4; n++) {
      const c = CHAPTERS[n];
      if (c && (n === 1 || m.done[n - 1] || m.ch >= n)) {
        rows.push(`${m.done[n] ? "✓" : "▸"} <b>Capitolo ${n}</b> · ${esc(c.title)} <span style="color:var(--dim)">${esc(m.done[n] ? "completato" : c.sub || "")}</span>`);
      } else {
        rows.push(`<span style="color:var(--dim)">• Capitolo ${n} · ??? (In arrivo)</span>`);
      }
    }
    api.scene(
      "abi_molo", "voce",
      `<b>I Capitoli di Dunwich</b><br>${rows.join("<br>")}<br><br><span style="color:var(--dim)">I segreti del Faro e le fosse abissali si svelano puntata dopo puntata.</span>`,
      [
        { label: "Ricomincia da Capo", sub: "Azzera scelte e progressi di Dunwich", fn: resetAsk },
        { label: "◂ Indietro", fn: openMain }
      ],
      "Abisso di Dunwich · Capitoli"
    );
  }

  function resetAsk() {
    api.scene(
      "abi_molo", "voce",
      "<b>Ricominciare la saga dell'Abisso da capo?</b><br>I reperti, i bivi e i progressi di Dunwich verranno azzerati. Le monete e il guardaroba resteranno tuoi.",
      [
        { label: "Sì, ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
        { label: "◂ No, torna indietro", fn: chaptersList }
      ],
      "Abisso di Dunwich"
    );
  }

  const XTOOLS = {
    get api() { return api; }, TS, T, esc, hash, rnd, safe, F, mem, save, stepOf, setStep,
    hero, castHero, say, ask, done, go, enterZone, playMatch, finishChapter, reward, zoneMenu, leaveToModes,
    sfxFogHorn, sfxAbyssalBell
  };

  // ------------------------------------------------------------------ Setup e Inizializzazione
  function setupExitButton() {
    const oc = document.getElementById("ovlCh");
    if (oc) {
      oc.addEventListener("click", (e) => {
        if (e.target && e.target.closest && e.target.closest("button.danger")) {
          setTimeout(() => safe(() => api.trExitTo(function () {})), 0);
        }
      });
    }
  }

  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match) {
      if (++tries < 200) setTimeout(init, 150);
      return;
    }
    api = a;
    CAST_Q.forEach(([id, c, bio]) => {
      if (a.CAST && !a.CAST[id]) a.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c);
      if (bio && a.BIO && !a.BIO[id]) a.BIO[id] = bio;
    });
    installHooks();
    PENDING.splice(0).forEach(registerChapterZones);
    setupExitButton();
  }

  window.__abissoStory = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "⚓ Abisso di Dunwich · Il Patto delle Onde Nere",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Coppa delle Onde Nere e misteri dell'abisso"}`
          : "Crea prima il tuo campione · Saga dark oceanica camminabile 2D"
      };
    },
    info() {
      const m = mem();
      return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), relics: m.relics.length };
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // ===================================================================================================
  // CAPITOLO 1: LA BANCHINA DEI FARI SPENTI
  // ===================================================================================================
  addChapter(function (X) {
    const N = 1;

    // --- Definizione delle Zone Camminabili del Capitolo 1 ---
    const zones = {
      // 1. MOLO PRINCIPALE DI DUNWICH (40 x 26)
      abi_molo: {
        name: "Dunwich · La Banchina dei Fari Spenti",
        short: "Banchina di Dunwich",
        sub: "Lastricato scuro, salsedine e la nebbia densa del molo",
        w: 40, h: 26, start: [6, 18], theme: "torino", bg: "abi_molo",
        item: ["Perla Nera di Marea", "Perle"],
        items: [[14, 20], [28, 16], [34, 8]],
        act: {
          D: "Entra nella Taverna",
          ">": "Verso la Rupe del Faro",
          "^": "All'Arena della Risacca",
          s: "Leggi il Cartello",
          t: "Ormeggio della Corvetta",
          b: "Esamina i Barili",
          k: "Barca del Palombaro"
        },
        build(L) {
          // Pavimentazione base: lastricato scuro
          L.lay(0, 0, 39, 25, ",");
          // Oceano a sud e sud-ovest
          L.lay(0, 22, 39, 25, "~");
          L.lay(0, 16, 3, 21, "~");
          // Pontile di legno lungo l'acqua
          L.lay(4, 20, 36, 21, "=");
          L.lay(12, 19, 16, 21, "=");
          // Parapetto lungo l'acqua
          L.lay(4, 19, 11, 19, "r");
          L.lay(17, 19, 36, 19, "r");
          // Mura della Taverna a nord-ovest (x: 4..14, y: 2..8)
          L.lay(4, 2, 14, 2, "e");
          L.lay(4, 3, 14, 7, "W");
          L.put(8, 7, "D"); // Porta della Taverna
          // Lampioni a cherosene
          L.put(7, 8, "l"); L.put(16, 14, "l"); L.put(27, 14, "l"); L.put(34, 6, "l");
          // Barili e casse vicino al magazzino e alla taverna
          L.put(4, 8, "b"); L.put(5, 8, "b"); L.put(14, 8, "x"); L.put(13, 8, "x");
          L.put(24, 17, "b"); L.put(25, 17, "x");
          // Pali d'ormeggio e barca
          L.put(10, 20, "t"); L.put(20, 20, "t"); L.put(30, 20, "t");
          L.put(14, 21, "k");
          // Cartello del porto
          L.put(8, 14, "s");
          // Grande ancora incastonata
          L.put(20, 12, "A");
          // Uscita verso il Faro (est: x: 39, y: 11..13)
          L.put(39, 11, ">"); L.put(39, 12, ">"); L.put(39, 13, ">");
          // Uscita verso l'Arena (nord: x: 19..21, y: 0)
          L.put(19, 0, "^"); L.put(20, 0, "^"); L.put(21, 0, "^");
        },
        npcs(step) {
          const l = [];
          l.push({ id: "abi_silas", x: 12, y: 15 });
          l.push({ id: "abi_jonah", x: 22, y: 18 });
          if (step >= 2) l.push({ id: "abi_corvo", x: 32, y: 12 });
          return l;
        }
      },

      // 2. LA TAVERNA DEL GABBIANO CIECO (34 x 22)
      abi_taverna: {
        name: "Dunwich · La Taverna del Gabbiano Cieco",
        short: "Taverna del Gabbiano Cieco",
        sub: "Legno antico intriso di tabacco, rum ambrato e canzoni di mare",
        w: 34, h: 22, start: [16, 19], theme: "torino", bg: "abi_taverna",
        item: ["Moneta dei Corsari Abissali", "Monete"],
        items: [[6, 6], [28, 8]],
        act: {
          D: "Esci sul Molo",
          b: "Fusto di Rum Speziato",
          x: "Cassa di Attrezzi Navali",
          R: "Campanella dell'Oste",
          s: "Mappa delle Correnti"
        },
        build(L) {
          // Pavimento a doghe di legno
          L.lay(0, 0, 33, 21, "i");
          // Pareti perimetrali in legno massiccio
          L.lay(0, 0, 33, 1, "W");
          L.lay(0, 0, 1, 21, "W");
          L.lay(32, 0, 33, 21, "W");
          L.lay(0, 20, 33, 21, "W");
          // Porta di uscita a sud
          L.put(16, 20, "D");
          // Bancone del bar (x: 10..22, y: 7..8)
          L.lay(10, 7, 22, 7, "h");
          L.put(10, 8, "b"); L.put(22, 8, "b");
          L.put(16, 6, "R"); // Campanella dell'oste
          // Focolare / camino a est
          L.lay(28, 2, 31, 5, "h");
          // Tavoli e stuoie nella taverna
          L.lay(5, 11, 8, 13, "c"); L.lay(6, 12, 7, 12, "x");
          L.lay(23, 11, 27, 13, "c"); L.lay(24, 12, 26, 12, "x");
          // Mappa sul muro
          L.put(16, 2, "s");
          // Barili di scorta
          L.put(3, 3, "b"); L.put(4, 3, "b"); L.put(3, 4, "b");
          L.put(16, 18, "c");
        },
        npcs(step) {
          const l = [];
          l.push({ id: "abi_barnaby", x: 16, y: 5 });
          l.push({ id: "abi_armitage", x: 25, y: 12 });
          return l;
        }
      },

      // 3. IL FARO DELLE MAREE NERE (36 x 26)
      abi_faro: {
        name: "Dunwich · Il Faro delle Maree Nere",
        short: "Il Faro delle Maree",
        sub: "Scogliere sferzate dal maestrale e l'antica torre ottagonale",
        w: 36, h: 26, start: [4, 14], theme: "torino", bg: "abi_faro",
        item: ["Scheggia di Lente di Fresnel", "Schegge"],
        items: [[18, 6], [28, 20]],
        act: {
          "<": "Ritorna al Molo",
          w: "Porta della Torre del Faro",
          R: "Suona la Campana delle Nebbie",
          F: "Guarda la Scogliera",
          s: "Targa dei Caduti della Tempesta"
        },
        build(L) {
          // Terreno scogliere basaltiche
          L.lay(0, 0, 35, 25, "_");
          // Oceano furioso a nord e a est
          L.lay(0, 0, 35, 3, "~");
          L.lay(29, 0, 35, 25, "~");
          // Piazza circolare del faro
          L.lay(14, 8, 26, 20, "p");
          // Parapetto verso il mare
          L.lay(10, 4, 28, 4, "r");
          L.lay(28, 4, 28, 22, "r");
          // Torre del faro ottagonale (x: 18..24, y: 7..12)
          L.lay(18, 7, 24, 11, "h");
          L.put(21, 11, "w"); // Porta della torre
          L.put(21, 7, "F"); // Grande lente
          // Campana delle nebbie
          L.put(12, 10, "R");
          // Lampioni della scogliera
          L.put(14, 14, "l"); L.put(26, 14, "l"); L.put(8, 12, "l");
          // Targa commemorativa
          L.put(14, 8, "s");
          // Sentiero d'ingresso da ovest (collega al Molo)
          L.lay(0, 13, 8, 15, ",");
          L.put(0, 13, "<"); L.put(0, 14, "<"); L.put(0, 15, "<");
        },
        npcs(step) {
          const l = [];
          l.push({ id: "abi_nora", x: 19, y: 15 });
          return l;
        }
      },

      // 4. L'ARENA DELLA RISACCA SOMMERSA (40 x 26)
      abi_arena: {
        name: "Dunwich · L'Arena della Risacca Sommersa",
        short: "Arena della Risacca",
        sub: "Il campo scavato tra i frangiflutti per la Coppa delle Onde Nere",
        w: 40, h: 26, start: [20, 23], theme: "torino", bg: "abi_arena",
        item: ["Bivalve Gigante Fossile", "Fossili"],
        items: [[6, 8], [34, 8]],
        act: {
          d: "Torna alla Banchina del Molo",
          s: "Albo d'Oro della Risacca",
          b: "Rete da Calcio in Corda Catramata"
        },
        build(L) {
          // Banchina perimetrale di pietra
          L.lay(0, 0, 39, 25, ",");
          // Terreno di gioco dell'arena (erba salmastra / sabbia marina)
          L.lay(4, 4, 35, 20, "y");
          // Spalti e mura di frangiflutti a nord
          L.lay(0, 0, 39, 3, "h");
          L.lay(0, 0, 3, 23, "h");
          L.lay(36, 0, 39, 23, "h");
          // Lanterne attorno al campo
          L.put(6, 4, "l"); L.put(33, 4, "l"); L.put(6, 20, "l"); L.put(33, 20, "l");
          // Cartellone e albo
          L.put(20, 3, "s");
          // Porte da calcio (est e ovest)
          L.put(4, 11, "b"); L.put(4, 12, "b"); L.put(4, 13, "b");
          L.put(35, 11, "b"); L.put(35, 12, "b"); L.put(35, 13, "b");
          // Uscita verso il Molo (sud: x: 19..21, y: 25)
          L.put(19, 25, "d"); L.put(20, 25, "d"); L.put(21, 25, "d");
        },
        npcs(step) {
          const l = [];
          if (step >= 2) l.push({ id: "abi_barnaby", x: 20, y: 12 });
          return l;
        }
      }
    };

    // --- Gestori degli Oggetti e Porte (Interazione Camminabile) ---
    const obj = {
      // Passaggi dalla Banchina del Molo
      "abi_molo:D:8,7": () => X.go("abi_taverna", 16, 19),
      "abi_molo:>": () => X.go("abi_faro", 4, 14),
      "abi_molo:^": () => X.go("abi_arena", 20, 23),
      "abi_molo:s": () => {
        X.say([
          ["voce", "CARTELLO DEL MOLO DI DUNWICH (1892): «Attenti all'alta marea delle ore 21:00. Il Faro protegge chi naviga onesto. I traditori delle maree appartengono all'Abisso.»"]
        ], X.done);
      },
      "abi_molo:k": () => {
        X.say([
          ["voce", "La lancia da palombaro di Silas. A bordo si scorge un pesante compressore d'aria in bronzo e catene arrugginite lunghe decine di braccia."]
        ], X.done);
      },
      "abi_molo:A": () => {
        X.say([
          ["voce", "Una gigantesca ancora in ferro scuro forgiata a mano. Sulle marre sono incise le stesse spirali runiche che brillano sul tuo pallone da calcio."]
        ], X.done);
      },

      // Passaggi dalla Taverna
      "abi_taverna:D:16,20": () => X.go("abi_molo", 8, 8),
      "abi_taverna:s": () => {
        X.say([
          ["voce", "La carta nautica delle Fosse di Dunwich: segna correnti violente, gorghi concentrici e al centro una misteriosa cupola battezzata «L'Arena Sommerse dei Leviatani»."]
        ], X.done);
      },
      "abi_taverna:R": () => {
        X.sfxAbyssalBell();
        X.say([
          ["voce", "Dlin dlin! Il rintocco della campanella d'ottone attira gli sguardi incuriositi dei vecchi pescatori al bancone."]
        ], X.done);
      },

      // Passaggi dal Faro
      "abi_faro:<": () => X.go("abi_molo", 38, 12),
      "abi_faro:w": () => {
        const s = X.stepOf(N);
        if (s >= 4 || X.F.is("key_faro")) {
          X.say([
            ["voce", "Inserisci la Chiave di Rame vinta da Capitan Barnaby: il pesante portone di ferro del Faro si apre cigolando verso la sala superiore! (Il Capitolo 2 ti porterà in cima alla torre!)"]
          ], X.done);
        } else {
          X.say([
            ["voce", "Il portone in ferro massiccio del Faro è sprangato con tre lucchetti d'ottone massiccio. Solo Capitan Barnaby possiede la chiave della lente."]
          ], X.done);
        }
      },
      "abi_faro:R": () => {
        X.sfxAbyssalBell();
        X.say([
          ["voce", "Bong... bong... Il cupo rintocco della Campana delle Nebbie risuona lungo le scogliere. Dalle onde sembra rispondere una strana eco gorgogliante..."]
        ], X.done);
      },
      "abi_faro:s": () => {
        X.say([
          ["voce", "TARGA COMMEMORATIVA: «In memoria dell'equipaggio della Rondine d'Abisso, svanito tra i gorghi nella tempesta del 1912 per difendere il segreto della Coppa.»"]
        ], X.done);
      },

      // Passaggi dall'Arena
      "abi_arena:d": () => X.go("abi_molo", 20, 2),
      "abi_arena:s": () => {
        X.say([
          ["voce", "ALBO D'ORO DELLA RISACCA: «Chi doma il pallone tra le pareti d'acqua e batte i flutti con un tiro a spirale ottiene il titolo di Signore delle Maree.»"]
        ], X.done);
      }
    };

    // --- Dialoghi e PNG Narrativi ---
    const talk = {
      // Silas il Palombaro
      abi_silas() {
        const s = X.stepOf(N);
        if (s === 0) {
          X.say([
            ["abi_silas", "Ti stavo aspettando, {n}. Riconosco quel passo deciso... e soprattutto l'odore di quella sfera di cuoio."],
            ["hero", "Tu sai chi sono? E che posto è questo? Il mare qui sembra vibrare in un modo che non ho mai sentito."],
            ["abi_silas", "(alza la visiera dello scafandro con mani callose) Questo è il molo di Dunwich. Qui il calcio non è un semplice gioco per la folla: è il rito con cui teniamo a bada le maree."],
            ["abi_silas", "Quel tiro speciale che porti dentro... {shot}... ha la stessa identica frequenza d'urto con cui i Leviatani cantano nelle fosse."],
            ["hero", "I Leviatani? Dici sul serio? Io voglio solo giocare e dimostrare il mio valore in campo!"],
            ["abi_silas", "Lo dimostrerai presto. Capitan Barnaby è nella Taverna del Gabbiano Cieco. Porta con sé la squadra più dura che abbia mai solcato questi fondali. Va' da lui, fagli vedere chi sei!"]
          ], () => {
            X.setStep(N, 1);
            X.done();
          });
        } else if (s === 1) {
          X.say([
            ["abi_silas", "Capitan Barnaby ti aspetta nella Taverna, dietro la porta in legno sulla banchina a nord. Non farti intimorire dalle sue urla."]
          ], X.done);
        } else if (s === 2) {
          X.say([
            ["abi_silas", "Barnaby ti ha sfidato all'Arena della Risacca? Attento ai suoi difensori: giocano scivolate basse che sembrano ancore lanciate nel fango!"]
          ], X.done);
        } else {
          X.say([
            ["abi_silas", "Hai battuto Barnaby e domato la Risacca! Era da cinquant'anni che non vedevo un tiro come {shot}. Sei tu il prescelto del patto."]
          ], X.done);
        }
      },

      // Jonah il Pescatore
      abi_jonah() {
        X.say([
          ["abi_jonah", "Le onde stanotte sono alte tre metri, ragazzo. Se tiri controvento, la palla ti torna indietro dritta sul naso come un gabbiano infuriato! Usa tiri a giro!"]
        ], X.done);
      },

      // Dottor Armitage (nella Taverna)
      abi_armitage() {
        const s = X.stepOf(N);
        X.say([
          ["abi_armitage", "(sistema gli occhiali spessi sfogliando un quaderno macchiato di sale) Affascinante... davvero affascinante!"],
          ["hero", "Dottore, cosa sta studiando con tanto fervore?"],
          ["abi_armitage", "I resoconti del 1892. Dicevano che una squadra di undici marinai riuscì a segnare un gol da quaranta metri imprimendo alla palla una rotazione idrodinamica."],
          ["abi_armitage", "Prendi questo frammento di taccuino, {n}: annota la traiettoria delle correnti marine durante le partite. Ti tornerà utile quando affronterai la Coppa."]
        ], () => {
          X.reward("frammento_armitage", { relic: "Taccuino Idrodinamico di Armitage" });
          X.done();
        });
      },

      // Capitan Barnaby (nella Taverna al bancone o all'Arena)
      abi_barnaby() {
        const s = X.stepOf(N);
        const z = X.api.trZone();

        if (z === "abi_arena" && s >= 2) {
          // All'Arena: sfida decisiva!
          X.ask("abi_barnaby", "Eccoti finalmente sul campo della Risacca, {n}! I miei marinai hanno i tacchetti affilati e il sale nelle vene. Pronto a giocarti la Chiave del Faro?", [
            {
              label: "⚽ Scendi in campo e gioca la Coppa delle Onde Nere!",
              cls: "hot",
              fn: () => startChapterMatch()
            },
            {
              label: "Un momento, voglio studiare ancora il campo",
              fn: () => X.done()
            }
          ]);
          return;
        }

        if (s <= 1) {
          X.say([
            ["abi_barnaby", "(batte un boccale di peltro sul bancone facendo tremare le bottiglie) E così saresti tu il fenomeno di cui parla Silas? {n}, dico bene?"],
            ["hero", "In persona. E non sono venuto per bere sidro: voglio scendere in campo e capire cosa succede al Faro."],
            ["abi_barnaby", "Ah! Bella sfacciataggine! A Dunwich chi vuole risposte deve guadagnarsele sull'erba salmastra dell'Arena della Risacca."],
            ["abi_barnaby", "Se vuoi la Chiave di Rame del Faro, vieni all'Arena a nord. Porta la tua grinta: il mio equipaggio non concede sconti nemmeno ai campioni!"]
          ], () => {
            X.setStep(N, 2);
            X.done();
          });
        } else if (s === 2) {
          X.say([
            ["abi_barnaby", "Ti aspetto all'Arena della Risacca a nord del molo. Vediamo se {shot} è all'altezza dei nostri marosi!"]
          ], X.done);
        } else {
          X.say([
            ["abi_barnaby", "(sorride togliendosi il berretto da capitano) Mi hai lasciato di stucco, {n}. Il tuo tiro speciale ha squarciato la barriera d'acqua. La Chiave del Faro è tua di diritto."]
          ], X.done);
        }
      },

      // Nora la Guardiana (al Faro)
      abi_nora() {
        const s = X.stepOf(N);
        X.say([
          ["abi_nora", "Il vento stanotte fischia tra le fessure della torre... Tu devi essere {n}."],
          ["hero", "Nora, perché la luce del faro è diventata di uno strano verde fosforescente?"],
          ["abi_nora", "Mio padre diceva sempre: «Quando il faro diventa smeraldo, l'Abisso sta chiamando i suoi campioni». Se riesci a vincere la partita con Barnaby, la porta in ferro si aprirà e potremo salire insieme alla lanterna!"]
        ], () => {
          X.reward("conchiglia_nora", { relic: "Amuleto di Conchiglia della Guardiana" });
          X.done();
        });
      },

      // Corvo la Vedetta
      abi_corvo() {
        X.say([
          ["abi_corvo", "L'Arena della Risacca è pronta a nord. Si sentono già i cori della curva dei pescatori: 'Onde d'abisso, frangiti sul palo!'"]
        ], X.done);
      }
    };

    // --- Partita Narrativa Ufficiale del Capitolo 1 ---
    function startChapterMatch() {
      X.sfxFogHorn();
      X.playMatch({
        id: "dunwich_cap1_match",
        chap: "Dunwich · Coppa delle Onde Nere",
        intro: "Partita decisiva alla Banchina della Risacca! Affronti l'Equipaggio della Sirena Spezzata capitanato dal roccioso Capitan Barnaby tra pareti d'acqua e nebbia fitta.",
        oppNames: ["Barnaby", "Jonah", "Corvo", "Baciccia d'Abisso", "Marea"],
        us: "Leviatani Dunwich",
        done: (r) => {
          if (r.win || r.a >= r.b) {
            // Vittoria del Campione!
            X.sfxAbyssalBell();
            X.F.set("key_faro", true);
            X.finishChapter(N, "trionfo");
            X.setStep(N, 4);

            const rew = X.reward("cap1_vittoria", {
              coins: 150,
              relic: "Chiave di Rame della Sala della Lente"
            });

            X.say([
              ["voce", `<b>VITTORIA EPICA A DUNWICH!</b><br>Risultato finale: ${r.a} – ${r.b}!<br>${rew.join(" · ")}`],
              ["abi_barnaby", "Per tutte le balene dell'Atlantico... hai piegato la traiettoria del vento! {shot} ha fatto tremare la traversa di pietra!"],
              ["abi_barnaby", "Tieni: questa è la Chiave di Rame del Faro delle Maree. Va' da Nora. Ora tocca a te scoprire quale mistero si nasconde lassù."],
              ["hero", "Grazie, Capitano. È stata una partita indimenticabile."],
              ["voce", "CAPITOLO 1 · LA BANCHINA DEI FARI SPENTI · CONCLUSO!<br>Il portone del Faro ora è accessibile. Il Capitolo 2 è in arrivo! Nel frattempo puoi esplorare liberamente le zone di Dunwich, parlare con tutti e raccogliere i reperti abissali."]
            ], () => {
              X.go("abi_molo", 12, 16);
            });
          } else {
            // Pareggio o sconfitta: Barnaby concede la rivincita sportiva
            X.say([
              ["abi_barnaby", "Bella grinta, ragazzo, ma la risacca non perdona le incertezze! Riprova quando hai scaldato i muscoli: noi siamo sempre qui ad aspettarti!"]
            ], () => {
              X.done();
            });
          }
        }
      });
    }

    return {
      n: N,
      title: "La Banchina dei Fari Spenti",
      sub: "Arrivo a Dunwich, il palombaro cieco e la Coppa delle Onde Nere",
      start: "abi_molo",
      zones,
      talk,
      obj,
      goal: (s) => {
        if (s === 0) return "Parla con Silas il Palombaro sulla banchina del molo.";
        if (s === 1) return "Entra nella Taverna a nord-ovest e parla con Capitan Barnaby.";
        if (s === 2) return "Raggiungi l'Arena della Risacca a nord e sfida l'Equipaggio di Barnaby!";
        return "Capitolo 1 concluso! Esplora il porto di Dunwich o visita il Faro.";
      },
      intro: () => [
        ["voce", "DUNWICH HARBOUR · ORE 21:14 · MAREA CRESCENTE", "abi_molo"],
        ["voce", "Il vecchio traghetto a vapore attracca con un gemito di ferro contro la banchina di pietra nera. Una nebbia salmastra e densa avvolge ogni cosa.", "abi_molo"],
        ["hero", "Quindi questa è Dunwich... L'odore di salsedine e catrame qui è diverso da qualunque altro porto. Sembra quasi vivo.", "abi_molo"],
        ["voce", "In lontananza, sulla scogliera, la luce del Faro delle Maree Nere ruota nel buio, proiettando una lama di luce color smeraldo. La tua avventura ha inizio.", "abi_molo"]
      ]
    };
  });
})();
