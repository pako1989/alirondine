// ============================================================================
// L'ALCHIMIA D'ACCIAIO · IL CERCHIO PROIBITO
// Saga Alchemica & Tattica per il Tuo Campione
// Ispirata a Fullmetal Alchemist: Brotherhood & Steampunk Dieselpunk
// Motore 2D Camminabile HD con Trasmutazione a Mani Nude, Scienza Proibita e Partite Alchemiche
// ============================================================================
(function () {
  "use strict";

  if (window.__alchimiaStoryLoaded) return;
  window.__alchimiaStoryLoaded = true;

  const KEY = "ali-di-rondine.alchimia-story";
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
  const rnd = (tx, ty, k) => hash(tx * 83 + ty * 149 + k * 29) / 4294967296;

  // ------------------------------------------------------------------ Audio Synthesizer (Trasmutazione & Vapore)
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  // Battito delle mani + scarica elettrica di trasmutazione alchemica
  function sfxAlchemicClap() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // 1. Il "Clap" d'impatto delle mani
      const oscClap = ctx.createOscillator(), gClap = ctx.createGain();
      oscClap.type = "triangle";
      oscClap.frequency.setValueAtTime(260, now);
      oscClap.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gClap.gain.setValueAtTime(0.8, now);
      gClap.gain.linearRampToValueAtTime(0.01, now + 0.14);
      oscClap.connect(gClap); gClap.connect(ctx.destination);
      oscClap.start(now); oscClap.stop(now + 0.14);

      // 2. Scarica di fulmini alchemici cerulei
      [440, 880, 1320, 1760].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.1), now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.45);
        g.gain.setValueAtTime(0.01, now + 0.08);
        g.gain.linearRampToValueAtTime(0.2 / (idx + 1), now + 0.14);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + 0.08); osc.stop(now + 0.6);
      });
    } catch (e) {}
  }

  function sfxSteamHiss() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Sibilo del vapore
      const bufSize = ctx.sampleRate * 0.4;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass"; filter.frequency.value = 1800; filter.Q.value = 3;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      src.start(now);
    } catch (e) {}
  }

  function sfxDiscovery() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.25, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.08 + 0.4);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Salvataggio normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  function norm(o) {
    o = obj(o);
    const m = {
      v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {},
      zone: "", formulas: [], log: [], intro: {}, wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0)
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
    m.formulas = [...new Set(arr(o.formulas).filter((x) => typeof x === "string"))].slice(0, 50);
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
  const addFormula = (id, name, desc) => {
    const m = mem();
    const key = `${id}:::${name}:::${desc}`;
    if (!m.formulas.some((f) => f.startsWith(id + ":::"))) {
      m.formulas.push(key); save();
      sfxDiscovery();
      if (api && api.trToast) api.trToast(`⚗️ Formula Acquisita: ${name}`);
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
    saetta: "una lama d'acciaio trasmutata che fende l'aria con sibilo metallico",
    serpentina: "un getto di mercurio liquido che cambia traiettoria all'ultimo istante",
    parabola: "un proiettile di tungsteno pesante che scavalca qualsiasi baluardo",
    martello: "un impatto di ferro battuto che demolisce pali e traversa con onde d'urto",
    traversa: "un fendente piroforico che accende l'incrocio dei pali con scintille dorate",
    saudade: "una trasmutazione gassosa che attraversa la linea di porta come un miraggio",
    muro: "un monolite di pietra eretto all'istante che rimbalza con precisione millimetrica"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "IL COLPO DELL'ACCIAIO", shot: "saetta" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "IL COLPO DELL'ACCIAIO")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un fendente alchemico perfetto");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "alchimista", hair: h.hair, style: h.style, skin: h.skin, eye: "#38bdf8",
      bg: ["#1e293b", "#0284c7"], shirt: "#b91c1c", num: String(h.num), acc: h.acc,
      cap: h.acc === "cappellino" ? "#b91c1c" : h.acc === "berretto" ? "#1e293b" : undefined
    };
  }

  const coinsGive = (n) => {
    if (n > 0 && typeof window.addCoins === "function") {
      try { window.addCoins(n); return n; } catch (e) { return 0; }
    }
    return 0;
  };
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

  // ------------------------------------------------------------------ Effetto Visivo Trasmutazione (Fulmini Alchemici)
  let transmuteActive = false;
  let transmuteAlpha = 0;
  function triggerTransmutationFx(onFinish) {
    transmuteActive = true;
    transmuteAlpha = 1.0;
    sfxAlchemicClap();
    setTimeout(() => { sfxSteamHiss(); }, 180);

    const intv = setInterval(() => {
      transmuteAlpha -= 0.05;
      if (transmuteAlpha <= 0) {
        transmuteAlpha = 0;
        transmuteActive = false;
        clearInterval(intv);
        if (typeof onFinish === "function") onFinish();
      }
    }, 28);
  }

  function drawTransmutationOverlay(g, W, H) {
    if (!transmuteActive && transmuteAlpha <= 0) return;
    g.save();
    // Bagliore ceruleo/elettrico
    const gr = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, Math.max(W, H) * 0.9);
    gr.addColorStop(0, `rgba(56, 189, 248, ${transmuteAlpha * 0.55})`);
    gr.addColorStop(0.5, `rgba(2, 132, 199, ${transmuteAlpha * 0.4})`);
    gr.addColorStop(1, `rgba(15, 23, 42, ${transmuteAlpha * 0.7})`);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);

    // Cerchio di Trasmutazione che si illumina al centro
    const cx = W / 2, cy = H / 2;
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(224, 242, 254, ${transmuteAlpha * 0.95})`;
    g.lineWidth = 2.5;

    // Doppio cerchio concentrico
    g.beginPath(); g.arc(cx, cy, 42, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(cx, cy, 32, 0, Math.PI * 2); g.stroke();

    // Triangolo interno & esagramma alchemico
    for (let r = 0; r < 2; r++) {
      g.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI * 2 / 3) + (r * Math.PI / 3);
        const x = cx + Math.cos(a) * 32, y = cy + Math.sin(a) * 32;
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.closePath(); g.stroke();
    }

    // Scariche elettriche casuali ai bordi
    g.strokeStyle = `rgba(125, 211, 252, ${transmuteAlpha})`;
    g.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      let curX = cx + (Math.random() - 0.5) * 60;
      let curY = cy + (Math.random() - 0.5) * 60;
      g.beginPath(); g.moveTo(curX, curY);
      for (let s = 0; s < 4; s++) {
        curX += (Math.random() - 0.5) * 35;
        curY += (Math.random() - 0.5) * 35;
        g.lineTo(curX, curY);
      }
      g.stroke();
    }
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

  // Sfondo: Distretto Meccanico & Eisenstadt (Dieselpunk, vapore e binari)
  function bgAlchimiaDistretto(g, W, H, f) {
    // Cielo crepuscolare industriale con fumo denso
    grad(g, 0, 0, W, H, ["#18181b", "#3f3f46", "#71717a"]);
    // Ciminiere in lontananza che sbuffano vapore
    [40, 110, 220, 280].forEach((cx) => {
      R(g, cx, 40, 18, 90, "#27272a");
      R(g, cx - 2, 38, 22, 5, "#18181b");
      // Fumo che sale animato
      for (let s = 0; s < 4; s++) {
        const sy = 34 - ((f * 0.6 + s * 22) % 60);
        const sx = cx + 9 + Math.sin(f * 0.05 + s) * 12 + (s * 4);
        g.fillStyle = "rgba(161, 161, 170, 0.4)";
        g.beginPath(); g.arc(sx, sy, 8 + s * 3, 0, Math.PI * 2); g.fill();
      }
    });

    // Fabbriche e officine in metallo rivettato
    R(g, 0, 110, W, 45, "#1e293b");
    for (let x = 10; x < W; x += 40) {
      // Finestre illuminate arancione
      R(g, x, 120, 18, 14, "#f59e0b");
      R(g, x + 8, 120, 2, 14, "#1e293b");
      R(g, x, 126, 18, 2, "#1e293b");
    }

    // Binari e selciato in basso
    R(g, 0, 155, W, 45, "#0f172a");
    // Rotaie
    R(g, 0, 168, W, 3, "#64748b");
    R(g, 0, 182, W, 3, "#64748b");
    for (let x = 0; x < W; x += 16) {
      R(g, x, 165, 4, 22, "#334155"); // Traversine in legno
    }

    // Lampioni a gas d'ottone
    [50, 160, 270].forEach((lx) => {
      R(g, lx, 140, 3, 28, "#78350f");
      glow(g, lx + 1, 138, 24, "251,191,36", 0.55);
      R(g, lx - 2, 136, 7, 7, "#fef08a");
    });
  }

  // Sfondo: Laboratorio Alchemico Statale (Alambicchi, cerchi al gesso e provette)
  function bgAlchimiaLaboratorio(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#090d16", "#172554", "#0f172a"]);
    // Lavagna monumentale con formule alchemiche e cerchio
    R(g, 80, 20, 160, 85, "#064e3b");
    R(g, 76, 16, 168, 4, "#78350f");
    R(g, 76, 105, 168, 4, "#78350f");
    // Cerchio alchemico tracciato a gesso bianco
    g.strokeStyle = "rgba(240, 253, 244, 0.75)";
    g.lineWidth = 1.5;
    g.beginPath(); g.arc(160, 62, 28, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(160, 62, 20, 0, Math.PI * 2); g.stroke();
    // Simboli e scritte a gesso
    g.fillStyle = "rgba(240, 253, 244, 0.6)";
    g.fillRect(95, 34, 25, 2); g.fillRect(95, 40, 35, 2);
    g.fillRect(200, 34, 30, 2); g.fillRect(200, 40, 20, 2);

    // Banchi di lavoro con alambicchi di vetro e rame
    R(g, 20, 130, 280, 55, "#3e2417");
    R(g, 16, 126, 288, 4, "#5c3824");

    // Alambicchi con liquidi ribollenti (blu, rosso, verde)
    [[60, "#38bdf8"], [110, "#ef4444"], [210, "#10b981"], [260, "#f59e0b"]].forEach(([ax, col]) => {
      // Base e matracci
      R(g, ax - 1, 108, 2, 18, "#94a3b8");
      g.fillStyle = col;
      g.beginPath(); g.arc(ax, 116, 8, 0, Math.PI * 2); g.fill();
      glow(g, ax, 116, 16, "56,189,248", 0.4);
      // Bollicine
      const bY = 116 - ((f * 0.4 + ax) % 8);
      R(g, ax - 2, bY, 2, 2, "#ffffff");
    });
  }

  // Sfondo: L'Arena di Mercurio (Il Campo della Trasmutazione Militare)
  function bgAlchimiaArena(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#090d16", "#1e293b", "#334155"]);
    // Torri d'acciaio e condotte a vapore della tribuna
    R(g, 0, 35, W, 25, "#1e293b");
    R(g, 0, 58, W, 4, "#475569");
    // Stendardi dell'Esercito Statale (blu e oro)
    for (let x = 18; x < W; x += 36) {
      R(g, x, 36, 16, 26, "#1d4ed8");
      R(g, x + 5, 38, 6, 16, "#facc15");
    }

    // Condotto a vapore con sfiato
    R(g, 0, 72, W, 6, "#64748b");
    const sX = 160 + Math.sin(f * 0.08) * 30;
    g.fillStyle = "rgba(226, 232, 240, 0.5)";
    g.beginPath(); g.arc(sX, 68, 6, 0, Math.PI * 2); g.fill();

    // Il campo in sabbia ferrosa e linee luminescenti di mercurio
    R(g, 10, 85, W - 20, 105, "#1c1917");
    g.strokeStyle = "rgba(56, 189, 248, 0.85)";
    g.lineWidth = 1.5;
    g.strokeRect(20, 95, W - 40, 90);
    // Cerchio alchemico di centrocampo
    g.beginPath(); g.arc(W / 2, 140, 26, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(W / 2, 95); g.lineTo(W / 2, 185); g.stroke();

    // Porte da calcio in tubi d'acciaio rivettati
    R(g, 16, 122, 4, 36, "#94a3b8");
    R(g, W - 20, 122, 4, 36, "#94a3b8");
  }

  const BGS = {
    al_distretto: bgAlchimiaDistretto,
    al_laboratorio: bgAlchimiaLaboratorio,
    al_arena: bgAlchimiaArena
  };

  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) {
      safe(() => BGS[kind](g, W || 320, H || 200, frame || 0));
      if (transmuteActive || transmuteAlpha > 0) {
        drawTransmutationOverlay(g, W || 320, H || 200);
      }
      return true;
    }
    const res = typeof prevBg === "function" ? prevBg.apply(this, arguments) : false;
    if (transmuteActive || transmuteAlpha > 0) {
      drawTransmutationOverlay(g, W || 320, H || 200);
    }
    return res;
  };

  // ------------------------------------------------------------------ Set Tessere 16x16 (Pixel Art Alchimia & Steampunk)
  // Pavimenti:
  //   , = lastricato industriale in ghisa e selciato
  //   p = mattonelle esagonali di laboratorio
  //   c = pedana d'acciaio rivettata
  //   : = terra battuta / sabbia ferrosa dell'arena
  //   w = parquet scuro dell'archivio militare
  //   y = campo alchemico con solchi di mercurio
  // Solidi / Oggetti:
  //   A = mura di mattoni rossi di fabbrica / blocchi d'acciaio
  //   B = fornace a carbone con fiamma alchemica pulsante
  //   S = scaffale di reagenti chimici e matracci
  //   T = banco di lavoro con attrezzi d'automail
  //   b = panchina di ferro rivettato
  //   l = lampione a gas con luce d'ottone
  //   n = bacheca delle ordinanze dell'Esercito Statale
  //   F = fontana monumentale con pompa a pistone
  //   k = locomotiva corazzata / vagoni a carbone
  //   W = podio del Comandante Supremo
  //   x = casse di minerale di ferro e barili di polvere
  //   ^ > < d = cancelli ad ingranaggi pneumatici
  //   P = cerchio di trasmutazione inciso sul pavimento
  //   J = vetrata industriale a rombi
  const FLOORS = ',pc:wy';
  const SOLID = 'ABSTblnFkWx^><dPJ';
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);

  const ZX = { map: null, under: null, id: "", cvs: null };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "A";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";

  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const frNow = () => Math.floor(performance.now() / 16);

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 1);
    if (f === ",") {
      // Ghisa e selciato grigio-ferro
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#27272a" : "#3f3f46");
      P(sx, sy + 7, 16, 1, "#18181b");
      P(sx + (ty % 2 ? 4 : 11), sy, 1, 7, "#18181b");
      P(sx + (ty % 2 ? 11 : 4), sy + 8, 1, 8, "#18181b");
      if (r < 0.18) P(sx + 6, sy + 4, 3, 2, "#52525b");
    } else if (f === "p") {
      // Laboratorio esagonale piastrellato
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#1e293b" : "#334155");
      P(sx, sy, 16, 1, "#475569");
      P(sx + 15, sy, 1, 16, "#0f172a");
      if ((tx + ty * 2) % 3 === 0) P(sx + 7, sy + 7, 2, 2, "#38bdf8");
    } else if (f === "c") {
      // Piastre metalliche rivettate
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#475569" : "#64748b");
      P(sx, sy, 16, 1, "#94a3b8");
      P(sx + 2, sy + 2, 2, 2, "#0f172a");
      P(sx + 12, sy + 2, 2, 2, "#0f172a");
      P(sx + 2, sy + 12, 2, 2, "#0f172a");
      P(sx + 12, sy + 12, 2, 2, "#0f172a");
    } else if (f === ":") {
      // Sabbia ferrosa
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#292524" : "#44403c");
      if (r < 0.25) P(sx + 5, sy + 7, 2, 2, "#78716c");
    } else if (f === "w") {
      // Parquet industriale
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#451a03" : "#78350f");
      P(sx, sy + 8, 16, 1, "#292524");
    } else if (f === "y") {
      // Campo alchemico con linee di mercurio
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#1c1917" : "#292524");
      if (tx % 5 === 0) P(sx, sy, 1, 16, "rgba(56, 189, 248, 0.45)");
      if (ty % 5 === 0) P(sx, sy, 16, 1, "rgba(56, 189, 248, 0.45)");
    }
  }

  function gateTile(ch, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty);
    // Cancello a saracinesca d'acciaio con pistoni
    P(sx + 1, sy, 2, 16, "#334155");
    P(sx + 7, sy, 2, 16, "#334155");
    P(sx + 13, sy, 2, 16, "#334155");
    P(sx, sy + 3, 16, 2, "#64748b");
    P(sx, sy + 11, 16, 2, "#64748b");
    // Pistoni pneumatici
    P(sx + 2, sy + 6, 3, 4, "#f59e0b");
    P(sx + 11, sy + 6, 3, 4, "#f59e0b");

    // Freccia indicatrice azzurra alchemica
    GP.fillStyle = "#38bdf8"; GP.beginPath();
    if (ch === ">") { GP.moveTo(sx + 6, sy + 5); GP.lineTo(sx + 11, sy + 8); GP.lineTo(sx + 6, sy + 11); }
    else if (ch === "<") { GP.moveTo(sx + 10, sy + 5); GP.lineTo(sx + 5, sy + 8); GP.lineTo(sx + 10, sy + 11); }
    else if (ch === "d") { GP.moveTo(sx + 5, sy + 5); GP.lineTo(sx + 8, sy + 11); GP.lineTo(sx + 11, sy + 5); }
    else { GP.moveTo(sx + 5, sy + 11); GP.lineTo(sx + 8, sy + 5); GP.lineTo(sx + 11, sy + 11); }
    GP.fill();
  }

  const PAINT = {
    A(sx, sy, tx, ty) {
      // Mura di mattoni rossi di fabbrica con giunti di cemento
      P(sx, sy, 16, 16, "#7f1d1d");
      P(sx, sy + 5, 16, 1, "#450a0a");
      P(sx, sy + 11, 16, 1, "#450a0a");
      P(sx + ((hash(tx * 3 + ty) % 5) + 3), sy, 1, 5, "#450a0a");
      P(sx + ((hash(tx + ty * 7) % 5) + 4), sy + 6, 1, 5, "#450a0a");
      if (at(tx, ty - 1) !== "A") P(sx, sy, 16, 2, "#991b1b");
    },
    B(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Fornace a carbone in ghisa
      P(sx + 1, sy + 3, 14, 12, "#18181b");
      P(sx + 2, sy + 4, 12, 10, "#27272a");
      // Bocca della fornace ardente
      const fl = Math.sin(fr / 8 + tx * 3) * 1.5;
      GP.fillStyle = "#ef4444";
      GP.beginPath(); GP.arc(sx + 8, sy + 9, 4 + fl * 0.4, 0, 7); GP.fill();
      GP.fillStyle = "#f59e0b";
      GP.beginPath(); GP.arc(sx + 8, sy + 9, 2.5, 0, 7); GP.fill();
      // Tubo a vapore superiore
      P(sx + 6, sy, 4, 3, "#71717a");
    },
    S(sx, sy, tx, ty) {
      // Scaffale di reagenti e matracci
      P(sx, sy, 16, 16, "#334155");
      P(sx, sy + 7, 16, 2, "#1e293b");
      P(sx, sy + 15, 16, 1, "#0f172a");
      // Provette e matracci colorati
      const cols = ["#38bdf8", "#ef4444", "#10b981", "#f59e0b", "#c084fc"];
      for (let i = 0; i < 4; i++) {
        P(sx + 2 + i * 3.5, sy + 2, 2.5, 5, cols[(tx + i) % cols.length]);
        P(sx + 2 + i * 3.5, sy + 10, 2.5, 5, cols[(ty + i) % cols.length]);
      }
    },
    T(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Banco di lavoro automail
      P(sx + 1, sy + 4, 14, 10, "#451a03");
      P(sx + 1, sy + 4, 14, 2, "#78350f");
      P(sx + 2, sy + 14, 2, 2, "#292524");
      P(sx + 12, sy + 14, 2, 2, "#292524");
      // Chiave inglese e ingranaggi sul tavolo
      P(sx + 4, sy + 6, 6, 2, "#cbd5e1");
      P(sx + 10, sy + 7, 3, 3, "#f59e0b");
    },
    b(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Panchina in ghisa
      P(sx + 1, sy + 6, 14, 4, "#27272a");
      P(sx + 2, sy + 10, 2, 5, "#18181b");
      P(sx + 12, sy + 10, 2, 5, "#18181b");
    },
    l(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Lampione a gas d'ottone
      P(sx + 7, sy + 4, 2, 10, "#78350f");
      P(sx + 5, sy + 2, 6, 3, "#b45309");
      const fl = Math.sin(fr / 10 + tx) * 1.2;
      GP.fillStyle = "#f59e0b";
      GP.beginPath(); GP.arc(sx + 8, sy + 2, 3.5 + fl * 0.3, 0, 7); GP.fill();
    },
    n(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Bacheca ordinanze militari
      P(sx + 2, sy + 1, 12, 10, "#1e3a8a");
      P(sx + 3, sy + 2, 10, 8, "#fef3c7");
      P(sx + 4, sy + 4, 8, 1, "#1d4ed8");
      P(sx + 4, sy + 7, 7, 1, "#1e293b");
      P(sx + 7, sy + 11, 2, 5, "#0f172a");
    },
    F(sx, sy, tx, ty, fr) {
      floorPaint("c", sx, sy, tx, ty);
      // Fontana con pompa a pistoni
      P(sx + 1, sy + 1, 14, 14, "#334155");
      P(sx + 3, sy + 3, 10, 10, "#0284c7");
      const w = Math.sin(fr / 10 + tx) * 2;
      P(sx + 7, sy + 4 + w, 2, 4, "#38bdf8");
    },
    k(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Locomotiva corazzata a vapore
      P(sx, sy + 2, 16, 12, "#09090b");
      P(sx + 1, sy + 4, 14, 8, "#27272a");
      P(sx + 3, sy + 6, 4, 4, "#f59e0b"); // Faro della motrice
      P(sx + 10, sy, 3, 4, "#52525b");   // Fumaiolo
    },
    W(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Scranno del Comandante
      P(sx + 2, sy + 1, 12, 14, "#1e3a8a");
      P(sx + 4, sy + 4, 8, 8, "#facc15");
    },
    x(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Casse di ferro e barili di minerale
      P(sx + 2, sy + 4, 12, 11, "#52525b");
      P(sx + 2, sy + 4, 12, 2, "#71717a");
      P(sx + 4, sy + 7, 8, 2, "#eab308"); // Sigillo d'ottone
    },
    P(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Cerchio alchemico inciso sul pavimento
      P(sx + 2, sy + 2, 12, 12, "#0284c7");
      P(sx + 4, sy + 4, 8, 8, "#0f172a");
      P(sx + 7, sy + 7, 2, 2, "#38bdf8");
    },
    J(sx, sy, tx, ty) {
      // Vetrata industriale
      P(sx, sy, 16, 16, "#334155");
      P(sx + 2, sy + 2, 12, 12, "#0ea5e9");
      P(sx + 7, sy, 2, 16, "#1e293b");
      P(sx, sy + 7, 16, 2, "#1e293b");
    },
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

  function registerChapterZones(c) {
    Object.keys(c.zones || {}).forEach((zid) => registerZone(c.n, zid, c.zones[zid]));
  }

  function addChapter(fn) {
    const X = Object.assign({}, XTOOLS);
    const c = fn(X);
    if (!c || !c.n) return;
    CHAPTERS[c.n] = c;
    if (api) registerChapterZones(c); else PENDING.push(c);
  }

  // Hook per i dialoghi dei PNG nel mondo camminabile
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
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "al_distretto";

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
      bus: "cancello", busLabel: "Esci da Eisenstadt",
      item: spec.item || ["Scaglia d'Automail", "Scaglie"], itemCos: spec.itemCos, items: spec.items || [],
      bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({}, spec.act || {}), intro: [],
      me: () => {
        const c = api.CAST.hero || api.CAST.leo;
        return Object.assign({}, c, { shirt: "#b91c1c", eye: "#38bdf8" });
      },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d");
        g.save(); g.globalCompositeOperation = "lighter";
        glow(g, x, y, 12, "56,189,248", 0.6 + 0.2 * Math.sin(frNow() / 10 + i));
        g.restore();
        g.fillStyle = "#38bdf8";
        g.beginPath(); g.moveTo(x, y - 5); g.lineTo(x + 4, y); g.lineTo(x, y + 5); g.lineTo(x - 4, y); g.closePath(); g.fill();
        g.fillStyle = "#ffffff"; g.fillRect(x - 1, y - 1, 2, 2);
      }
    };

    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: Diario di Flamel ed Esci." });

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
      if (transmuteActive || transmuteAlpha > 0) {
        const cv = document.getElementById("cv");
        if (cv) drawTransmutationOverlay(cv.getContext("2d"), cv.width, cv.height);
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

  // ------------------------------------------------------------------ Menu & Diario di Flamel
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
      `<b>Eisenstadt</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Monete ${bal()} · Formule ${mem().formulas.length}${h ? " · " + esc(h.name) : ""}</span>`,
      [
        { label: "Diario Alchemico di Flamel", sub: "Formule, cerchi di trasmutazione e nodi scoperti", cls: "hot", fn: () => notebook(zoneMenu, true) },
        { label: "Esci da Eisenstadt", sub: "La storia e le scoperte restano salvate", cls: "hot", fn: leave }
      ],
      bgNow()
    );
  }

  function notebook(back, inZone) {
    const m = mem(), h = hero() || { name: "Campione", num: 9, shotName: "", shot: "saetta" };
    const formRows = m.formulas.map((f) => {
      const parts = f.split(":::");
      return `• <b>${esc(parts[1] || "Formula")}</b>: <span style="color:var(--dim)">${esc(parts[2] || "")}</span>`;
    }).join("<br>") || "<span style='color:var(--dim)'>Ancora nessuna formula decifrata. Esplora i laboratori e le officine.</span>";

    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} (Alchimista d'Acciaio)<br><span style="color:var(--dim)">Trasmutazione Personale: «${esc(h.shotName || "Il Colpo dell'Acciaio")}»</span><br><br><b>Formule & Ricerche Alchemiche</b><br>${formRows}<br><br><span style="color:var(--dim)">Vittorie nell'Arena: ${m.wins} · Sconfitte: ${m.losses}</span>`;

    if (inZone) {
      api.trAsk("voce", html, [{ label: "◂ Torna a esplorare", fn: done }], bgNow());
    } else {
      api.scene(bgNow(), "voce", html, [{ label: "◂ Indietro", fn: back }], "Eisenstadt · Il Diario");
    }
  }

  // ------------------------------------------------------------------ Partita Narrativa Alchemica
  let inMatch = false;
  function playMatch(o) {
    castHero(); inMatch = true;
    api.match({
      id: o.id, chap: o.chap, intro: T(o.intro), mate: o.mate || "Kira", mateGeneric: true,
      us: o.us || "I Falchi d'Acciaio", min: o.min || 45, team: o.team, hero: undefined,
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

  // ------------------------------------------------------------------ Cassetta degli Attrezzi XTOOLS
  const XTOOLS = {
    get api() { return api; }, TS, T, esc, hash, rnd, safe, F, mem, save, stepOf, setStep, note, once,
    reward, coinsGive, bal, hero, castHero, say, ask, done, go, enterZone, playMatch, finishChapter,
    addFormula, triggerTransmutationFx, sfxAlchemicClap, sfxSteamHiss, sfxDiscovery,
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
  // CAPITOLO 1 · L'ALCHIMIA D'ACCIAIO & IL CERCHIO PROIBITO
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addFormula, triggerTransmutationFx } = X;
    const N = 1, S = () => X.stepOf(N);

    // ---- Personaggi Alchemici (Ispirati a FMA)
    X.cast("al_kira", {
      name: "Kira Vaporevivo", tag: "meccanica", hair: "#facc15", style: "ponytail", skin: "#fde047", eye: "#0284c7",
      bg: ["#78350f", "#facc15"], shirt: "#451a03"
    }, "Brillante meccanica di automail dell'officina della stazione (ispirata a Winry Rockbell). Regola gli scarpini con pistoni idraulici, sbraita quando rovini le lamine di titanio, ma ha un cuore d'oro puro.");

    X.cast("al_royden", {
      name: "Col. Royden", tag: "fiamma", hair: "#09090b", style: "slick", skin: "#f4f4f5", eye: "#18181b",
      bg: ["#1e3a8a", "#ef4444"], shirt: "#1d4ed8"
    }, "Il Colonnello della Fiamma Nera (ispirato a Roy Mustang). Guanti bianchi con cerchi piroforici incisi sul dorso. Schiocca le dita e genera muri di fuoco. Freddo e ambizioso, ma fedele solo alla vera giustizia.");

    X.cast("al_armatura", {
      name: "L'Armatura d'Ebano", tag: "armatura", hair: "#71717a", style: "buzz", skin: "#94a3b8", eye: "#38bdf8",
      bg: ["#0f172a", "#64748b"], shirt: "#334155"
    }, "Un'imponente corazza di ferro vuota semovente (ispirata ad Alphonse Elric). La sua anima è legata all'armatura da un sigillo di sangue alchemico all'interno dell'elmo. Parla con gentilezza ed è un baluardo difensivo invalicabile.");

    X.cast("al_knox", {
      name: "Dottor Knox", tag: "chirurgo", hair: "#e2e8f0", style: "messy", skin: "#e7e5e4", glasses: true,
      bg: ["#1c1917", "#059669"], shirt: "#292524"
    }, "Ex alchimista militare disilluso, rifugiato nel laboratorio sotterraneo. Conosce il terrificante segreto della Pietra Rossa e non sopporta la propaganda dell'Esercito.");

    X.cast("al_sentinella", {
      name: "Sentinella Statale", tag: "militare", hair: "#1e293b", style: "buzz", skin: "#cbd5e1",
      cap: "#1e3a8a", bg: ["#172554", "#3b82f6"], shirt: "#1e40af"
    }, "Guardia armata della stazione. Blocca il passaggio ai civili verso il settore dei laboratori.");

    // Ricompensa cosmetica
    X.cos("al_guanto_alchimista", { kind: "acc", label: "Guanto della Trasmutazione & Cerchio Ouroboros", val: "#0284c7", from: "Completa il Capitolo 1 di Alchimia d'Acciaio" });

    const goal = (s) => ({
      0: "Parla con Kira nell'Officina Meccanica (a ovest della Stazione di Eisenstadt).",
      1: "Usa la Trasmutazione a mani nude per riparare il condotto a vapore bloccato.",
      2: "Raggiungi il Laboratorio Alchemico Statale a nord e parla con il Dottor Knox.",
      3: "Esamina il Leggio delle Formule e recupera il frammento di Pietra Rossa.",
      4: "Confronta il Colonnello Royden al tavolo di comando: mostra la prova del Cerchio.",
      5: "Scendi nell'Arena di Mercurio per la sfida di qualificazione contro i Guardiani d'Acciaio.",
      6: "Capitolo 1 concluso! Parla con Kira e Royden per decifrare il Cerchio Continentale."
    }[s] || "Capitolo 1 concluso. Esplora Eisenstadt e raccogli le scaglie d'automail.");

    // ---------------------------------------------------------------- Zone del Capitolo 1
    const zones = {
      // 1. Il Distretto Meccanico & Piazza della Locomotiva
      al_distretto: {
        name: "Eisenstadt · Il Distretto Meccanico", short: "Piazza della Stazione", sub: "Locomotive a vapore, automail e officine di ghisa",
        w: 40, h: 26, start: [20, 20], theme: "torino", bg: "al_distretto",
        item: ["Scaglia d'Automail", "Scaglie"], itemCos: "al_guanto_alchimista",
        items: [[4, 6], [35, 6], [12, 17], [29, 17]],
        areas: [
          [1, 1, 14, 12, "L'Officina Automail di Kira"],
          [24, 1, 38, 12, "La Banchina dei Treni Corazzati"],
          [15, 1, 23, 8, "L'Arco del Laboratorio Statale"],
          [10, 13, 29, 23, "Il Piazzale delle Fornaci"]
        ],
        hints: () => ({
          "L'Officina Automail di Kira": "Ingranaggi d'acciaio, pistoni idraulici e l'odore pungente di olio motore.",
          "La Banchina dei Treni Corazzati": "Un mastodontico convoglio a carbone con cannoni d'ordinanza.",
          "L'Arco del Laboratorio Statale": "Il passaggio sorvegliato che conduce ai laboratori alchemici dell'esercito.",
          "Il Piazzale delle Fornaci": "Fornaci industriali a carbone che alimentano le presse a vapore del distretto."
        }),
        act: {
          T: "Esamina il banco degli automail", B: "Guarda la fornace a carbone",
          k: "Osserva la locomotiva corazzata", ">": "Vai all'Arena di Mercurio", "^": "Entra nel Laboratorio"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 2, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(38, 0, 39, 25, "A");
          Ls.lay(0, 24, 39, 25, "A");

          // Selciato industriale
          Ls.lay(8, 6, 31, 22, ",");
          // Pedana in piastre d'acciaio rivettate
          Ls.lay(18, 3, 21, 22, "c");

          // Officina a ovest
          Ls.lay(2, 3, 12, 10, "w");
          Ls.put(4, 4, "T"); Ls.put(5, 4, "T");
          Ls.put(9, 4, "S");

          // Stazione treni a est
          Ls.lay(27, 3, 37, 10, ":");
          Ls.put(31, 4, "k"); Ls.put(32, 4, "k");

          // Fornaci e lampioni a gas
          [[14, 8], [25, 8], [14, 16], [25, 16]].forEach(([bx, by]) => Ls.put(bx, by, "B"));
          [[10, 12], [29, 12]].forEach(([lx, ly]) => Ls.put(lx, ly, "l"));

          // Fontana centrale a pistoni
          Ls.put(19, 13, "F"); Ls.put(20, 13, "F");

          // Portale a nord verso il Laboratorio
          Ls.put(19, 2, "^"); Ls.put(20, 2, "^");
          // Cancello verso l'Arena a sud est
          Ls.put(35, 23, ">");

          // Panchine
          Ls.put(10, 20, "b"); Ls.put(29, 20, "b");
        },
        npcs(s) {
          const list = [];
          // Kira nell'officina
          list.push({ id: "al_kira", at: [6, 6] });
          // L'Armatura d'Ebano al fianco di Kira
          list.push({ id: "al_armatura", at: [8, 6] });

          // Sentinella statale al portale
          if (s >= 1) list.push({ id: "al_sentinella", at: [18, 3] });

          // Colonnello Royden dopo i primi avvenimenti
          if (s >= 4) list.push({ id: "al_royden", at: [28, 5] });

          return list;
        }
      },

      // 2. Il Laboratorio Alchemico Statale
      al_laboratorio: {
        name: "Eisenstadt · Laboratorio Alchemico Statale", short: "Laboratorio Alchemico", sub: "Reagenti, cerchi di trasmutazione e fiale di mercurio",
        w: 38, h: 26, start: [19, 22], theme: "torino", bg: "al_laboratorio",
        item: ["Scaglia d'Automail", "Scaglie"],
        items: [[4, 4], [33, 4], [8, 16], [29, 16]],
        areas: [
          [2, 2, 15, 12, "Settore Reagenti Chimici"],
          [22, 2, 35, 12, "Settore Pietra Filosofale"],
          [14, 10, 23, 20, "La Grande Lavagna"],
          [16, 2, 21, 8, "Il Banco delle Trasmutazioni"]
        ],
        hints: () => ({
          "Settore Reagenti Chimici": "Scaffali carichi di acidi, metalli rari e polvere di piombo.",
          "Settore Pietra Filosofale": "Fiale ermetiche sigillate con il marchio dell'Esercito.",
          "La Grande Lavagna": "Schemi di cerchi di trasmutazione complessi tracciati a gesso bianco.",
          "Il Banco delle Trasmutazioni": "Una lastra d'ardesia su cui vengono testate le reazioni alchemiche."
        }),
        act: {
          S: "Esamina i reagenti chimici", P: "Osserva il cerchio alchemico inciso",
          T: "Consulta i registri di laboratorio", d: "Torna alla Piazza della Stazione"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(36, 0, 37, 25, "A");
          Ls.lay(0, 24, 37, 25, "A");

          // Piastrelle di laboratorio
          Ls.lay(2, 2, 35, 23, "p");
          Ls.lay(18, 4, 19, 22, "c");

          // Scaffali di alambicchi
          for (let y = 3; y <= 9; y += 3) {
            Ls.lay(4, y, 13, y, "S");
            Ls.lay(24, y, 33, y, "S");
          }

          // Cerchio alchemico centrale sul pavimento
          Ls.put(18, 3, "P"); Ls.put(19, 3, "P");

          // Tavolo di lavoro
          Ls.lay(16, 13, 21, 14, "T");

          // Uscita verso la stazione
          Ls.put(18, 23, "d"); Ls.put(19, 23, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "al_knox", at: [8, 8] });
          if (s >= 3) list.push({ id: "al_royden", at: [18, 12] });
          return list;
        }
      },

      // 3. L'Arena di Mercurio (Il Campo della Trasmutazione Militare)
      al_arena: {
        name: "Eisenstadt · L'Arena di Mercurio", short: "Arena di Mercurio", sub: "Il colosseo alchemico con sabbia ferrosa e condotte a vapore",
        w: 40, h: 28, start: [20, 23], theme: "torino", bg: "al_arena",
        item: ["Scaglia d'Automail", "Scaglie"],
        items: [[3, 5], [36, 5]],
        areas: [
          [2, 2, 37, 6, "La Tribuna degli Alchimisti di Stato"],
          [4, 8, 35, 22, "Il Rettangolo di Mercurio"],
          [16, 23, 23, 26, "Il Tunnel delle Turbine"]
        ],
        hints: () => ({
          "La Tribuna degli Alchimisti di Stato": "Gli ufficiali dell'Esercito osservano impassibili dai balconi d'acciaio.",
          "Il Rettangolo di Mercurio": "Il campo in sabbia ferrosa percorso da solchi alchemici luminescenti.",
          "Il Tunnel delle Turbine": "Il cancello di ferro da cui entrano i gladiatori d'acciaio."
        }),
        act: {
          W: "Guarda il podio militare", B: "Osserva la caldaia a vapore",
          "<": "Torna alla Piazza della Stazione"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "A");
          Ls.lay(0, 0, 1, 27, "A");
          Ls.lay(38, 0, 39, 27, "A");
          Ls.lay(0, 26, 39, 27, "A");

          // Tribuna superiore
          Ls.lay(2, 2, 37, 5, "c");
          Ls.put(19, 3, "W"); Ls.put(20, 3, "W");

          // Il campo di gioco alchemico
          Ls.lay(4, 7, 35, 21, "y");

          // Caldaie sui 4 angoli
          [[4, 7], [35, 7], [4, 21], [35, 21]].forEach(([bx, by]) => Ls.put(bx, by, "B"));

          // Cancello d'uscita
          Ls.put(19, 25, "<"); Ls.put(20, 25, "<");
        },
        npcs(s) {
          const list = [];
          if (s >= 5) {
            list.push({ id: "al_royden", at: [20, 10] });
          }
          return list;
        }
      }
    };

    // ---------------------------------------------------------------- Dialoghi & Eventi NPC
    // 1. Kira Vaporevivo (La Meccanica di Automail)
    function kiraTalk() {
      const s = S();
      if (s === 0) {
        return say([
          ["al_kira", "Ehi! Guarda dove metti i piedi! Ho appena calibrato le valvole di pressione su questo giunto idraulico!"],
          ["hero", "Calmati, Kira. Sono arrivato con l'espresso di mezzogiorno per il Torneo della Pietra Rossa. Numero {num}."],
          ["al_kira", "(Ti osserva con aria sorpresa, posando la chiave inglese) Il numero {num}... Allora sei tu l'alchimista autodidatta di cui parlano tutti! Quello che calcia come una pressa a vapore!"],
          ["al_armatura", "È un piacere conoscerti, {n}. Io sono l'Armatura d'Ebano. Kira mi ha salvato la vita vincolando la mia anima a queste piastre di ferro."],
          ["hero", "Un legame dell'anima? Questa è trasmutazione biologica proibita..."],
          ["al_kira", "Non avevamo scelta! Ma c'è di peggio: la condotta principale a vapore tra la stazione e i laboratori è stata sabotata. C'è una crepa di ghisa fusa che blocca la valvola a pressione nord. Se non la ripariamo, l'intera stazione rischia di saltare in aria!"],
          ["hero", "Posso ripararla io. Non ho bisogno di disegnare un cerchio sul pavimento."],
          ["al_kira", "Senza cerchio di trasmutazione?! Ma stai scherzando?! Nessun alchimista può violare la legge della matrice a mani nude!"],
        ], () => {
          ask("al_kira", "«Vuoi davvero provare a trasmutare la condotta a mani nude, {n}?»", [
            {
              label: "⚗️ [BATTI LE MANI A PALMO APERTO]: «Guarda e impara, Kira!»",
              cls: "hot",
              fn: () => {
                triggerTransmutationFx(() => {
                  setStep(N, 1);
                  note("Trasmutazione a mani nude eseguita: Condotta a vapore riparata all'istante.");
                  addFormula("trasmutazione_pura", "La Porta della Verità", "Capacità di trasmutare materia senza cerchio alchemico battendo le mani a palmo aperto.");
                  say([
                    ["voce", "Batti le mani con uno schiocco secco. Scariche di fulmini azzurri crepitano lungo le tue braccia e si propagano nella ghisa fusa!"],
                    ["voce", "La crepa metallica si risalda con perfezione assoluta, lasciando una superficie liscia e un sibilo regolare di vapore."],
                    ["al_kira", "(A bocca aperta, fa cadere la pinza) Non ci credo... Tu... tu hai visto la Porta della Verità, vero?!"],
                    ["al_armatura", "Incredibile... Proprio come le leggende degli antichi Alchimisti d'Acciaio!"],
                    ["al_kira", "Ora la via per il Laboratorio Statale è aperta. Va' dal Dottor Knox: ha scoperto qualcosa di mostruoso sulla vera natura del Torneo!"],
                  ], done);
                });
              }
            },
            {
              label: "«Spiegami prima come funziona il tuo scarpino ad automail.»",
              fn: () => {
                say([
                  ["al_kira", "Gli scarpini usano micromolle in lega di cromo e vanadio. Assorbono l'energia d'urto del tuo tiro «{tiro}» e la rilasciano con una spinta quintuplicata!"],
                ], kiraTalk);
              }
            }
          ]);
        });
      }

      if (s === 1) {
        return say([
          ["al_kira", "La porta a nord è sbloccata. La sentinella ti lascerà passare ora che i manometri sono tornati stabili. Cerca il Dottor Knox nel laboratorio!"],
        ], done);
      }

      if (s === 6) {
        return say([
          ["al_kira", "Hai trionfato sull'Arena di Mercurio! Ma ora dobbiamo decifrare la mappa: il Cerchio Continentale tocca altre quattro città... dobbiamo fermarli prima del Solstizio!"],
        ], done);
      }

      return say([
        ["al_kira", "Non rovinare quegli scarpini, {n}! Altrimenti ti tiro la chiave inglese dritta sulla fronte!"],
      ], done);
    }

    // 2. Sentinella Statale
    function sentinellaTalk() {
      const s = S();
      if (s === 0) {
        return say([
          ["al_sentinella", "Alt! Zona interdetta ai civili per allarme pressione vapore. Nessuno può avvicinarsi ai laboratori finché la condotta non viene riparata."],
        ], done);
      }
      return say([
        ["al_sentinella", "I manometri sono tornati nella norma. Puoi accedere al Laboratorio Statale, numero {num}."],
      ], done);
    }

    // 3. Dottor Knox (Il Chirurgo della Pietra)
    function knoxTalk() {
      const s = S();
      if (s < 2) return say([["al_knox", "Chiunque tu sia, non toccare le fiale di acido cloridrico. Sto lavorando."]], done);

      if (s === 2 || s === 3) {
        return say([
          ["al_knox", "Ti stavo aspettando, {n}. Kira mi ha inviato un dispaccio pneumatico."],
          ["hero", "Dottor Knox, cosa sta succedendo in questa fortezza? Perché l'Esercito organizza un torneo sportivo con una simile mobilitazione di truppe?"],
          ["al_knox", "(Si toglie gli occhiali con un sospiro stanco, mostrandoti una fiala di cristallo con una polvere cremisi brillante)"],
          ["al_knox", "Vedi questa? La chiamano Pietra Rossa. Un surrogato grezzo della leggendaria Pietra Filosofale."],
          ["hero", "La Pietra Filosofale... L'amplificatore alchemico che supera la legge dello Scambio Equivalente?"],
          ["al_knox", "Esatto. Ma sai qual è l'ingrediente per crearla? Non l'oro, né il mercurio. Anime umane. Sangue, sudore e sacrificio di migliaia di vite."],
          ["al_knox", "Il campo da gioco dell'Arena di Mercurio non è altro che il vertice centrale di un gigantesco Cerchio di Trasmutazione Nazionale! La finale del torneo serve a innescare la reazione e sacrificare i centomila abitanti di Eisenstadt!"],
        ], () => {
          setStep(N, 3);
          addFormula("pietra_rossa", "Frammento di Pietra Rossa", "Surrogato della Pietra Filosofale: materia cremisi concentrata ottenuta attraverso reazioni alchemiche estreme.");
          note("Dottor Knox ha svelato il complotto del Cerchio di Trasmutazione Continentale.");
          say([
            ["hero", "È una follia... Dobbiamo fermarli subito!"],
            ["al_knox", "Il Colonnello Royden è nell'altra stanza. Si finge un fedele cane dell'Esercito, ma so che sta indagando in segreto. Mostragli il frammento e il disegno del cerchio... vedi se ha il coraggio di schierarsi con noi."],
          ], done);
        });
      }

      return say([
        ["al_knox", "La scienza senza etica è solo una lama affilata data in mano a un bambino arrabbiato. Ricordalo sempre quando scendi in campo."],
      ], done);
    }

    // 4. Colonnello Royden (La Fiamma Nera)
    function roydenTalk() {
      const s = S();
      if (s < 3) return say([["al_royden", "I civili non dovrebbero girovagare nei laboratori di Stato. Torna alla stazione prima che ti faccia scortare fuori."]], done);

      if (s === 3 || s === 4) {
        return say([
          ["al_royden", "Ti muovi con troppa sicurezza per essere una semplice recluta del torneo, {n}."],
          ["hero", "E tu fingi troppo bene di non vedere cosa si nasconde sotto le gradinate dell'Arena, Colonnello."],
          ["al_royden", "(Un lampo d'interesse gli attraversa lo sguardo) Parla chiaro. Cosa credi di sapere?"],
        ], () => {
          ask("al_royden", "«Cosa hai trovato in questo laboratorio, Campione?»", [
            {
              label: "«Mostra il frammento di Pietra Rossa e la mappa del Cerchio Sotterraneo!»",
              cls: "hot",
              fn: () => {
                setStep(N, 5);
                note("Colonnello Royden alleato: confermata la cospirazione dei vertici militari.");
                say([
                  ["voce", "Estrai il frammento scarlatto e la pergamena con i condotti sotterranei della città."],
                  ["al_royden", "(Schiocca le dita con un lampo di fuoco controllato, bruciando solo un angolo della carta)"],
                  ["al_royden", "Dunque Knox ha deciso di parlare. Sapevo già del piano del Comandante Supremo Vane. Ma per colpirlo al vertice senza provocare una guerra civile, serve una dimostrazione pubblica."],
                  ["al_royden", "Se vinci la partita di qualificazione nell'Arena di Mercurio contro la Guardia d'Acciaio, conquisterai l'accesso alla Loggia del Comando. E lì, davanti all'intero popolo di Eisenstadt, mostreremo al mondo che la Pietra è un'illusione d'argilla!"],
                  ["hero", "Ci sto, Royden. Io, Kira e l'Armatura d'Ebano scenderemo in campo. Dimostreremo cosa può fare la vera alchimia!"],
                ], done);
              }
            },
            {
              label: "«So solo che il tuo fuoco non brucerà la verità.»",
              fn: () => {
                say([
                  ["al_royden", "La poesia non ferma le baionette, ragazzo. Portami fatti o vattene."],
                ], done);
              }
            }
          ]);
        });
      }

      if (s === 5) {
        return say([
          ["al_royden", "L'Arena di Mercurio ti aspetta a sud. La Guardia d'Acciaio è schierata: usano tattiche pesanti e barricate di pietra alchemica. Spazzali via col tuo tiro «{tiro}»!"],
        ], () => {
          startAlchemicMatch();
        });
      }

      return say([
        ["al_royden", "Vittoria impeccabile, {n}. Il primo nodo del Cerchio è disinnescato. Ma Vane ha già allertato gli Alchimisti di Stato delle altre provincie."],
      ], done);
    }

    // Partita Alchemica del Capitolo 1
    function startAlchemicMatch() {
      X.playMatch({
        id: "al_match_1",
        chap: "Eisenstadt · Il Torneo di Mercurio",
        us: "I Falchi d'Acciaio",
        mate: "Kira",
        min: 45,
        intro: "Qualificazione Militare di Eisenstadt! Il tuo Campione {n} scende sulla sabbia ferrosa contro la Guardia d'Acciaio dell'Esercito!",
        team: (t, st) => ({
          name: "Guardia d'Acciaio",
          col: "#1e3a8a",
          style: "Pressing Pesante & Barricate Alchemiche",
          atk: t(st.atk * 0.95),
          def: t(st.def * 1.3),
          vel: t(st.vel * 0.9),
          specials: ["Muro di Piombo", "Scintilla Piroforica"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 6);
            finishChapter(N, "vittoria_mercurio");
            note("Trionfo nell'Arena di Mercurio: La Guardia d'Acciaio è stata sconfitta!");
            const rewMsg = reward("al_ch1_win", {
              coins: 450,
              cos: "al_guanto_alchimista"
            });
            say([
              ["voce", "RETEEE! Batti le mani al suolo e colpisci la sfera d'acciaio: il tuo tiro «{tiro}» si trasforma in un siluro di tungsteno fuso che polverizza la barriera alchemica del portiere ed entra in porta!"],
              ["voce", "L'intera Arena di Eisenstadt esplode in un tripudio di applausi e vapore sibilante!"],
              ["al_royden", "(Dalla tribuna fa un cenno d'intesa, con un mezzo sorriso) Niente male, ragazzo. Hai disinnescato il generatore alchemico della porta."],
              ["al_armatura", "Evviva! Che tiro magnifico, {n}!"],
              ["voce", `CAPITOLO 1 CONCLUSO CON SUCCESSO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("al_distretto", 20, 16);
            });
          } else {
            say([
              ["al_royden", "La barriera d'acciaio avversaria era troppo solida. Ricalibra la formula del tuo tiro e riprova la sfida!"],
            ], done);
          }
        }
      });
    }

    // ---------------------------------------------------------------- Interazione Oggetti del Mondo
    const obj = {
      "al_distretto:^": () => {
        if (S() < 1) {
          say([["voce", "Il portale verso il Laboratorio Statale è sbarrato per sicurezza. Una condotta a vapore rotta sfiata fumo rovente sulla soglia."]], done);
        } else {
          go("al_laboratorio", 18, 22);
        }
      },
      "al_distretto:>": () => {
        go("al_arena", 20, 24);
      },
      "al_laboratorio:d": () => {
        go("al_distretto", 19, 4);
      },
      "al_arena:<": () => {
        go("al_distretto", 33, 22);
      },

      // Oggetti Distretto
      "al_distretto:B": () => {
        say([["voce", "La caldaia a carbone arde con braci incandescenti. Alimentano le turbine pneumatiche dei treni corazzati."]], done);
      },
      "al_distretto:k": () => {
        say([["voce", "Un'imponente locomotiva corazzata della ferrovia di Stato. Le lamiere d'acciaio sono spesse venti centimetri e recano il sigillo dell'Esercito."]], done);
      },
      "al_distretto:T": () => {
        say([["voce", "Il banco di lavoro di Kira: chiavi inglesi, boccette di lubrificante al grafite e ingranaggi per protesi automail."]], done);
      },

      // Oggetti Laboratorio
      "al_laboratorio:P": () => {
        say([["voce", "Un cerchio di trasmutazione inciso direttamente nelle piastrelle: serve a stabilizzare le reazioni esotermiche del laboratorio."]], done);
      },
      "al_laboratorio:S": () => {
        say([["voce", "Centinaia di provette e fiale di reagenti rari: mercurio distillato, polvere di zolfo, limatura di titanio e sali di bismuto."]], done);
      }
    };

    const talk = {
      al_kira: kiraTalk,
      al_armatura: () => say([["al_armatura", "Io non sento il freddo né la fatica, {n}. Fintanto che il sigillo di sangue regge all'interno dell'elmo, sarò il tuo scudo in campo!"]], done),
      al_sentinella: sentinellaTalk,
      al_knox: knoxTalk,
      al_royden: roydenTalk
    };

    return {
      n: N,
      title: "Il Cerchio Proibito",
      sub: "Il risveglio della trasmutazione senza cerchio e il segreto della Pietra Rossa",
      start: "al_distretto",
      zones,
      talk,
      obj,
      goal,
      intro: () => [
        ["voce", "EISENSTADT · LA CITTADELLA D'ACCIAIO", "al_distretto"],
        ["voce", "Il sibilo dei pistoni idraulici e il denso fumo di carbone avvolgono la banchina della stazione. Locomotive corazzate arrivano dal fronte tra clangori di ferro battuto.", "al_distretto"],
        ["voce", "Sei giunto in città con il tuo numero {num} e il tuo tiro leggendario «{tiro}». Ma l'alchimia che si respira nell'aria ha il retrogusto amaro del segreto militare.", "al_distretto"],
        ["voce", "Dall'officina meccanica a ovest, un martellare ritmico e una nube di scintille dorate segnalano la presenza di Kira e della sua possente armatura semovente...", "al_distretto"]
      ]
    };
  });

  // ------------------------------------------------------------------ Interfaccia Principale & Schermate
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
        "al_distretto", "voce",
        "<b>L'Alchimia d'Acciaio · Il Cerchio Proibito</b><br>Questa saga richiede il tuo Campione: nome, aspetto, numero e tiro speciale entrano direttamente nella storia e nella scienza alchemica.<br><br>Prima crea il tuo campione nel menu!",
        [
          { label: "Crea il tuo Campione", sub: "Nome, look e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
          { label: "◂ Torna alle Modalità", fn: leaveToModes }
        ],
        "Alchimia d'Acciaio"
      );
    }

    castHero();
    const c = activeChapter(), m = mem(), allDone = c && m.done[c.n];

    api.scene(
      "al_distretto", "voce",
      `<b>⚗️ L'Alchimia d'Acciaio · Il Cerchio Proibito</b><br>${esc(h.name)} · n. ${esc(h.num)} (Alchimista d'Acciaio)<br><span style="color:var(--dim)">«${esc(h.shotName || "Il Colpo dell'Acciaio")}»</span><br><br><span style="color:#38bdf8">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}</span><br><span style="color:var(--dim)">${allDone ? "Capitolo 1 concluso! Il prossimo capitolo ti attende." : esc(goalNow())}</span>`,
      [
        {
          label: allDone ? "Esplora Eisenstadt" : c && !m.intro["ch" + c.n] ? "Inizia il Capitolo 1" : "Continua la Storia",
          sub: c ? `Capitolo ${c.n} · ${c.title}` : "",
          cls: "hot",
          fn: continueStory
        },
        { label: "Diario di Flamel", sub: `Formule ${m.formulas.length} · Ricerche di ${h.name}`, fn: () => notebook(openMain, false) },
        { label: "Capitoli della Saga", sub: "I capitoli e le trasmutazioni", fn: chaptersList },
        { label: "◂ Torna alle Modalità", fn: leaveToModes }
      ],
      "Alchimia d'Acciaio"
    );
  }

  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    const isNew = !m.intro["ch" + c.n];
    if (isNew) {
      m.intro["ch" + c.n] = 1; save();
      if (c.intro) {
        return say(c.intro(), () => {
          go(c.start || "al_distretto", 20, 20);
        });
      }
    }
    const tr = api.trRec();
    const curZ = (m.zone && ZONES[m.zone]) ? m.zone : (c.start || "al_distretto");
    if (!tr.pos[curZ]) {
      const zr = ZONES[curZ];
      const st = (zr && zr.spec.start) || [20, 20];
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
        rows.push(`<span style="color:var(--dim)">• Capitolo ${n} · Prossimamente</span>`);
      }
    }
    api.scene(
      "al_arena", "voce",
      `<b>I Capitoli di Alchimia d'Acciaio</b><br>${rows.join("<br>")}<br><br><span style="color:var(--dim)">Il principio dello Scambio Equivalente governa ogni trasmutazione.</span>`,
      [
        { label: "Ricomincia da Capo", sub: "Azzera progressi (monete e oggetti restano tuoi)", fn: resetConfirm },
        { label: "◂ Indietro", fn: openMain }
      ],
      "Alchimia · Capitoli"
    );
  }

  function resetConfirm() {
    api.scene(
      "al_distretto", "voce",
      "<b>Ricominciare la Saga Alchemica?</b><br>I progressi della storia e le formule raccolte verranno azzerate. Le monete e gli accessori riscattati rimarranno nel tuo guardaroba.",
      [
        { label: "Sì, azzera e ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
        { label: "◂ Annulla", fn: chaptersList }
      ],
      "Alchimia d'Acciaio"
    );
  }

  // ------------------------------------------------------------------ Pulsante Esci e Avvio
  function setupExitButton() {
    const existing = document.getElementById("alExit");
    if (existing) return;
    const st = document.createElement("style");
    st.textContent = `
      #alExit {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 36px; padding: 6px 14px; border-radius: 10px;
        border: 1px solid rgba(56, 189, 248, 0.6); background: rgba(15, 23, 42, 0.88);
        color: #e0f2fe; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6); cursor: pointer;
      }
      #alExit.on { display: block; }
      #alExit:active { transform: translateY(1px); }
    `;
    document.head.appendChild(st);

    const btn = document.createElement("button");
    btn.id = "alExit"; btn.type = "button";
    btn.textContent = "✕ Esci da Eisenstadt";
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

  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match) {
      if (++tries < 200) setTimeout(init, 150);
      return;
    }
    api = a;
    CAST_Q.splice(0).forEach(([id, c, bio]) => {
      if (a.CAST && !a.CAST[id]) a.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c);
      if (bio && a.BIO && !a.BIO[id]) a.BIO[id] = bio;
    });
    COS_Q.splice(0).forEach(([id, d]) => { if (a.COSM && !a.COSM[id]) a.COSM[id] = d; });
    installHooks();
    PENDING.splice(0).forEach(registerChapterZones);
    setupExitButton();
  }

  // Esportazione Globale dell'API
  window.__alchimiaStory = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "⚗️ L'Alchimia d'Acciaio · Il Cerchio Proibito",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Trasmutazione e scienza proibita"}`
          : "Crea prima il tuo campione · Saga alchemica a puntate"
      };
    },
    info() {
      const m = mem();
      return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), formulas: m.formulas.length };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
