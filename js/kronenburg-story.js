// ============================================================================
// KRONENBURG · IL PATTO DELLE TRE CORONE
// Saga Tattica & Investigativa per il Tuo Campione
// Ispirata a Code Geass, Death Note e Game of Thrones
// Motore 2D Camminabile HD con Occhio del Geass, Deduzioni, Intrighi di Corte e Partite Tattiche
// ============================================================================
(function () {
  "use strict";

  if (window.__kronenburgStoryLoaded) return;
  window.__kronenburgStoryLoaded = true;

  const KEY = "ali-di-rondine.kronenburg-story";
  const TS = 16;
  let tries = 0, api = null, EXIT = null;
  const CAST_Q = []; // personaggi registrati prima che __borgoApi sia pronto

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

  // ------------------------------------------------------------------ Audio Synthesizer (Geass & Atmosfera Gotica)
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  function sfxGeassHeartbeat() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Primo battito (grave)
      const osc1 = ctx.createOscillator(), g1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.16);
      g1.gain.setValueAtTime(0.5, now);
      g1.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc1.connect(g1); g1.connect(ctx.destination);
      osc1.start(now); osc1.stop(now + 0.18);

      // Secondo battito
      const osc2 = ctx.createOscillator(), g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(95, now + 0.22);
      osc2.frequency.exponentialRampToValueAtTime(36, now + 0.38);
      g2.gain.setValueAtTime(0.65, now + 0.22);
      g2.gain.linearRampToValueAtTime(0.01, now + 0.42);
      osc2.connect(g2); g2.connect(ctx.destination);
      osc2.start(now + 0.22); osc2.stop(now + 0.42);
    } catch (e) {}
  }

  function sfxGeassResonance() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Suono mistico dell'ala scarlatta di Geass
      [330, 495, 660, 990].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = idx % 2 === 0 ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(freq * 0.9, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.08, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.7);
        g.gain.setValueAtTime(0.01, now);
        g.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now); osc.stop(now + 1.2);
      });
    } catch (e) {}
  }

  function sfxClueFound() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        g.gain.setValueAtTime(0.2, now + i * 0.09);
        g.exponentialRampToValueAtTime(0.005, now + i * 0.09 + 0.35);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.09); osc.stop(now + i * 0.09 + 0.35);
      });
    } catch (e) {}
  }

  function sfxGeassShatter() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [880, 1174.66, 1760, 2349.32].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        osc.frequency.exponentialRampToValueAtTime(110, now + i * 0.04 + 0.35);
        g.gain.setValueAtTime(0.16 / (i + 1), now + i * 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.4);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.04); osc.stop(now + i * 0.04 + 0.4);
      });
    } catch (e) {}
  }

  function sfxDramaticRevelation() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [130.81, 164.81, 196.0, 261.63].forEach((freq) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.8);
        g.gain.setValueAtTime(0.01, now);
        g.gain.linearRampToValueAtTime(0.2, now + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now); osc.stop(now + 1.4);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Salvataggio normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  function norm(o) {
    o = obj(o);
    const m = {
      v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {},
      zone: "", clues: [], log: [], intro: {}, wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0)
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
      sfxClueFound();
      if (api && api.trToast) api.trToast(`📜 Indizio Acquisito: ${name}`);
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
    saetta: "un tiro fulmineo che spacca l'aria come una freccia d'acciaio",
    serpentina: "un tiro a spirale che disorienta lo sguardo del guardiano",
    parabola: "un fendente arcuato che scavalca i bastioni come un falco",
    martello: "un impatto pesante come la lama di un boia che abbatte la rete",
    traversa: "un tiro a ricasco calcolato con millimetrica ferocia",
    saudade: "una traiettoria malinconica e inafferrabile come un'ombra",
    muro: "una cannonata di pietra nera che frantuma ogni barriera"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "IL TIRO DELLA CORONA", shot: "saetta" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "IL TIRO DELLA CORONA")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un colpo letale e impeccabile");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "corvo", hair: h.hair, style: h.style, skin: h.skin, eye: "#dc2626",
      bg: ["#0f172a", "#ef4444"], shirt: "#18181b", num: String(h.num), acc: h.acc,
      cap: h.acc === "cappellino" ? "#18181b" : h.acc === "berretto" ? "#0f172a" : undefined
    };
  }

  const coinsGive = (n) => {
    if (n > 0 && typeof window.addCoins === "function") {
      try { window.addCoins(n); return n; } catch (e) { return 0; }
    }
    return 0;
  };
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

  // ------------------------------------------------------------------ Effetto Geass Visivo
  let geassFlashActive = false;
  let geassFlashAlpha = 0;
  function triggerGeassVisualFx(onFinish) {
    geassFlashActive = true;
    geassFlashAlpha = 1.0;
    sfxGeassHeartbeat();
    setTimeout(() => { sfxGeassResonance(); }, 220);

    const checkInterval = setInterval(() => {
      geassFlashAlpha -= 0.05;
      if (geassFlashAlpha <= 0) {
        geassFlashAlpha = 0;
        geassFlashActive = false;
        clearInterval(checkInterval);
        if (typeof onFinish === "function") onFinish();
      }
    }, 30);
  }

  function drawGeassOverlay(g, W, H) {
    if (!geassFlashActive && geassFlashAlpha <= 0) return;
    g.save();
    // Crimson vignette glow
    const gr = g.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, Math.max(W, H));
    gr.addColorStop(0, `rgba(239, 68, 68, ${geassFlashAlpha * 0.4})`);
    gr.addColorStop(0.5, `rgba(185, 28, 28, ${geassFlashAlpha * 0.65})`);
    gr.addColorStop(1, `rgba(15, 23, 42, ${geassFlashAlpha * 0.85})`);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);

    // Iconic Geass Crimson Wing/Bird Sigil in center
    const cx = W / 2, cy = H / 2;
    g.save();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = `rgba(254, 202, 202, ${geassFlashAlpha * 0.95})`;
    g.strokeStyle = `rgba(239, 68, 68, ${geassFlashAlpha})`;
    g.lineWidth = 3;

    // Wing left & right
    g.beginPath();
    g.moveTo(cx, cy + 18);
    // ala sinistra
    g.bezierCurveTo(cx - 24, cy + 12, cx - 44, cy - 8, cx - 38, cy - 26);
    g.bezierCurveTo(cx - 26, cy - 20, cx - 18, cy - 8, cx - 8, cy - 4);
    g.bezierCurveTo(cx - 12, cy - 14, cx - 8, cy - 24, cx, cy - 30);
    // ala destra
    g.bezierCurveTo(cx + 8, cy - 24, cx + 12, cy - 14, cx + 8, cy - 4);
    g.bezierCurveTo(cx + 18, cy - 8, cx + 26, cy - 20, cx + 38, cy - 26);
    g.bezierCurveTo(cx + 44, cy - 8, cx + 24, cy + 12, cx, cy + 18);
    g.closePath();
    g.fill();
    g.stroke();

    // Eye pupil in center
    g.fillStyle = `rgba(255, 255, 255, ${geassFlashAlpha})`;
    g.beginPath();
    g.arc(cx, cy - 8, 4, 0, Math.PI * 2);
    g.fill();
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

  // Sfondo: Corte dei Grifoni (Bastione di Kronenburg sotto la bufera)
  function bgKronenburgCorte(g, W, H, f) {
    // Cielo notturno tempestoso
    grad(g, 0, 0, W, H, ["#050814", "#0f172a", "#1e1b4b"]);
    // Luna d'inverno
    glow(g, 260, 42, 45, "254,243,199", 0.35);
    g.fillStyle = "#fef3c7"; g.beginPath(); g.arc(260, 42, 12, 0, 7); g.fill();
    g.fillStyle = "#0f172a"; g.beginPath(); g.arc(264, 40, 10, 0, 7); g.fill();

    // Sagoma delle torri e delle guglie gotiche lontane
    g.fillStyle = "#090d16";
    // Torre sinistra
    g.fillRect(16, 50, 42, 110);
    g.beginPath(); g.moveTo(10, 50); g.lineTo(37, 18); g.lineTo(64, 50); g.fill();
    // Torre centrale
    g.fillRect(110, 35, 70, 130);
    g.beginPath(); g.moveTo(100, 35); g.lineTo(145, 6); g.lineTo(190, 35); g.fill();
    // Torre destra
    g.fillRect(240, 60, 50, 100);
    g.beginPath(); g.moveTo(234, 60); g.lineTo(265, 30); g.lineTo(296, 60); g.fill();

    // Mura con merlature
    R(g, 0, 120, W, 35, "#131a29");
    for (let i = 0; i < 18; i++) {
      if (i % 2 === 0) R(g, i * 18, 110, 12, 12, "#131a29");
    }

    // Selciato inferiore con lastre nere e bracieri ardenti
    R(g, 0, 155, W, 45, "#0b0f19");
    for (let x = 0; x < W; x += 32) {
      R(g, x, 155, 1, 45, "#1f293d");
      R(g, 0, 175, W, 1, "#1f293d");
    }

    // Due grandi bracieri con fiamme cremisi animate
    [65, 255].forEach((bx) => {
      R(g, bx - 6, 148, 12, 16, "#334155");
      R(g, bx - 10, 144, 20, 5, "#475569");
      const fl = Math.sin(f * 0.18 + bx) * 3;
      glow(g, bx, 140, 36 + fl, "239,68,68", 0.5);
      glow(g, bx, 138, 20 + fl, "251,191,36", 0.6);
      g.fillStyle = "#ef4444";
      g.beginPath(); g.arc(bx, 141, 7 + fl * 0.5, 0, 7); g.fill();
      g.fillStyle = "#fef08a";
      g.beginPath(); g.arc(bx, 141, 4, 0, 7); g.fill();
    });

    // Neve che scende
    g.fillStyle = "#e2e8f0";
    for (let i = 0; i < 48; i++) {
      const sx = (i * 37 + f * 0.75 + Math.sin(f * 0.04 + i) * 16) % W;
      const sy = (i * 29 + f * 1.4) % H;
      R(g, sx, sy, (i % 3 === 0 ? 2 : 1), (i % 3 === 0 ? 2 : 1), "rgba(226,232,240,0.65)");
    }
  }

  // Sfondo: Grande Biblioteca & Archivio delle Sentenze
  function bgKronenburgBiblioteca(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#18100c", "#2d1b14", "#150d0a"]);
    // Finestra ad arco gotico al centro con cielo notturno
    g.fillStyle = "#0c1222";
    g.beginPath();
    g.arc(160, 48, 38, Math.PI, 0);
    g.rect(122, 48, 76, 75);
    g.fill();
    // Bifora di pietra
    g.strokeStyle = "#44342b"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(160, 10); g.lineTo(160, 123); g.stroke();
    g.beginPath(); g.arc(160, 48, 38, Math.PI, 0); g.rect(122, 48, 76, 75); g.stroke();

    // Scaffali di tomi antichi a sinistra e a destra
    [0, W - 100].forEach((ox) => {
      R(g, ox, 10, 100, 160, "#291811");
      for (let y = 30; y < 170; y += 32) {
        R(g, ox, y, 100, 4, "#45291d");
        // Libri
        for (let bx = ox + 4; bx < ox + 94; bx += 7) {
          const bcols = ["#991b1b", "#1e3a8a", "#065f46", "#854d0e", "#374151"];
          const c = bcols[(bx + y) % bcols.length];
          const bh = 18 + ((hash(bx * 7 + y) % 9));
          R(g, bx, y - bh, 6, bh, c);
          R(g, bx + 1, y - bh, 4, 1, "#fde047");
        }
      }
    });

    // Tavolo centrale con pergamene e candelabro dorato
    R(g, 100, 140, 120, 50, "#3e2417");
    R(g, 96, 138, 128, 4, "#5c3824");
    // Fogli e libri aperti
    R(g, 114, 132, 28, 6, "#fef3c7");
    R(g, 178, 131, 32, 7, "#fde68a");
    // Candelabro con 3 fiammelle
    [150, 160, 170].forEach((cx, ci) => {
      R(g, cx - 1, 124, 2, 14, "#d97706");
      const fl = Math.sin(f * 0.22 + ci * 2) * 1.5;
      glow(g, cx, 120, 18 + fl, "251,191,36", 0.45);
      R(g, cx - 1, 119 + fl * 0.5, 3, 4, "#fef08a");
    });
  }

  // Sfondo: L'Arena d'Ossidiana (Il Campo della Corona)
  function bgKronenburgArena(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#050811", "#0b1220", "#111827"]);
    // Balconata dei nobili e stendardi delle 3 Casate in alto
    R(g, 0, 30, W, 22, "#1f2937");
    R(g, 0, 52, W, 4, "#374151");
    // Stendardi
    const flags = ["#dc2626", "#7c3aed", "#0284c7"];
    for (let i = 0; i < 9; i++) {
      const fx = 20 + i * 34;
      R(g, fx, 32, 14, 28, flags[i % 3]);
      R(g, fx + 5, 34, 4, 16, "#fef08a");
    }

    // Il campo d'ossidiana con linee luminescenti rosse e argento
    R(g, 10, 80, W - 20, 110, "#090d16");
    g.strokeStyle = "rgba(239, 68, 68, 0.7)";
    g.lineWidth = 1.5;
    g.strokeRect(20, 90, W - 40, 95);
    // Cerchio di centrocampo
    g.beginPath();
    g.arc(W / 2, 138, 28, 0, Math.PI * 2);
    g.stroke();
    // Linea di metà campo
    g.beginPath(); g.moveTo(W / 2, 90); g.lineTo(W / 2, 185); g.stroke();

    // Porte d'acciaio ai due estremi
    R(g, 16, 120, 4, 35, "#e2e8f0");
    R(g, W - 20, 120, 4, 35, "#e2e8f0");

    // Bracieri ardenti ai 4 angoli dell'arena
    [[24, 94], [W - 24, 94], [24, 180], [W - 24, 180]].forEach(([bx, by]) => {
      glow(g, bx, by, 22, "239,68,68", 0.45);
      R(g, bx - 2, by - 2, 4, 4, "#f87171");
    });
  }

  // Sfondo: Le Catacombe dei Dannati & Prigioni di Pietra Nera (Capitolo 2)
  function bgKronenburgSotterranei(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#020617", "#09101d", "#022c22"]);
    // Arcate di pietra stillanti umidità
    for (let i = 0; i < 4; i++) {
      const ax = 15 + i * 85;
      g.strokeStyle = "#1e293b"; g.lineWidth = 4;
      g.beginPath(); g.arc(ax + 35, 75, 42, Math.PI, 0); g.stroke();
      R(g, ax, 75, 8, 125, "#0f172a");
      R(g, ax + 62, 75, 8, 125, "#0f172a");
    }
    // Celle di ferro con sbarre verticali
    [60, 210].forEach((cx) => {
      R(g, cx, 50, 52, 90, "#050a14");
      for (let bx = cx + 4; bx < cx + 50; bx += 8) {
        R(g, bx, 50, 2, 90, "#334155");
      }
      // Catena arrugginita che pende
      g.strokeStyle = "#64748b"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(cx + 26, 40); g.lineTo(cx + 26, 75); g.stroke();
    });
    // Canale di scolo sulfureo con acque luminescenti verde smeraldo
    R(g, 0, 160, W, 40, "#022c22");
    g.fillStyle = "rgba(16, 185, 129, 0.45)";
    g.fillRect(0, 170, W, 25);
    for (let x = 0; x < W; x += 24) {
      const woff = Math.sin(f * 0.12 + x * 0.2) * 2;
      R(g, x, 175 + woff, 14, 2, "#34d399");
    }
    // Torce al fosforo verde/blu sui pilastri
    [45, 135, 225, 295].forEach((tx, ti) => {
      R(g, tx - 2, 88, 4, 12, "#1e293b");
      const fl = Math.sin(f * 0.2 + ti * 2) * 2;
      glow(g, tx, 84, 24 + fl, "16,185,129", 0.6);
      g.fillStyle = "#34d399"; g.beginPath(); g.arc(tx, 84, 4 + fl * 0.3, 0, 7); g.fill();
      g.fillStyle = "#a7f3d0"; g.beginPath(); g.arc(tx, 84, 2, 0, 7); g.fill();
    });
  }

  // Sfondo: La Sala del Trono d'Ebano & Banchetto dei Traditori (Capitolo 2)
  function bgKronenburgSalatrono(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#090514", "#1e102a", "#0f0814"]);
    // Enorme rosone gotico con luna di sangue al centro
    g.fillStyle = "#2e1065";
    g.beginPath(); g.arc(160, 52, 44, 0, Math.PI * 2); g.fill();
    glow(g, 160, 52, 55, "239,68,68", 0.35);
    g.fillStyle = "#ef4444"; g.beginPath(); g.arc(160, 52, 22, 0, Math.PI * 2); g.fill();
    // Telaio di pietra del rosone
    g.strokeStyle = "#4c1d95"; g.lineWidth = 2.5;
    for (let a = 0; a < 8; a++) {
      const ang = (a * Math.PI) / 4;
      g.beginPath(); g.moveTo(160, 52); g.lineTo(160 + Math.cos(ang) * 44, 52 + Math.sin(ang) * 44); g.stroke();
    }
    // Arazzi nobiliari cremisi scuro ai lati
    [10, 50, W - 64, W - 24].forEach((ax) => {
      R(g, ax, 20, 16, 95, "#831843");
      R(g, ax + 2, 22, 12, 90, "#9f1239");
      R(g, ax + 6, 30, 4, 30, "#fbbf24");
    });
    // Trono delle Spade rialzato al centro su gradini d'ossidiana
    for (let st = 0; st < 4; st++) {
      R(g, 120 - st * 8, 120 + st * 7, 80 + st * 16, 7, (st % 2 === 0 ? "#18181b" : "#27272a"));
    }
    // Scranno del Trono
    R(g, 144, 82, 32, 42, "#09090b");
    R(g, 140, 78, 40, 5, "#dc2626");
    // Lame delle spade incastonate nello schienale
    for (let s = 0; s < 6; s++) {
      R(g, 138 + s * 8, 64 + (s % 2) * 5, 2, 18, "#cbd5e1");
    }
    // Candelabri a 6 braccia con fiammelle dorate
    [85, 235].forEach((cx, ci) => {
      R(g, cx - 2, 105, 4, 32, "#78350f");
      for (let b = -2; b <= 2; b++) {
        const bx = cx + b * 7, by = 102;
        const fl = Math.sin(f * 0.22 + ci * 2 + b) * 1.5;
        glow(g, bx, by, 14, "251,191,36", 0.45);
        g.fillStyle = "#fef08a"; g.fillRect(bx - 1, by - 3 + fl * 0.3, 2, 4);
      }
    });
    // Pavimento a specchio con riflessi d'ossidiana
    R(g, 0, 150, W, 50, "#050508");
    for (let x = 0; x < W; x += 32) {
      R(g, x, 150, 1, 50, "#27272a");
      R(g, 0, 172, W, 1, "#27272a");
    }
  }

  // Sfondo: Il Bastione dei Ghiacci Eterni (Capitolo 3)
  function bgKronenburgBastionegelo(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#030712", "#0c182d", "#082f49"]);
    // Cielo polare con riflessi di aurora boreale azzurra e verde
    glow(g, 120, 30, 75, "34,211,238", 0.25);
    glow(g, 220, 25, 80, "52,211,153", 0.2);
    // Vette di ghiaccio e abisso marino in lontananza
    g.fillStyle = "#021626";
    g.beginPath();
    g.moveTo(0, 110); g.lineTo(60, 45); g.lineTo(130, 95); g.lineTo(210, 35); g.lineTo(280, 85); g.lineTo(W, 60); g.lineTo(W, 130); g.lineTo(0, 130);
    g.fill();
    // Mura del bastione ricoperte di brina e stalattiti
    R(g, 0, 115, W, 38, "#0f172a");
    for (let i = 0; i < 18; i++) {
      if (i % 2 === 0) R(g, i * 18, 105, 12, 12, "#1e293b");
      // Stalattiti di ghiaccio
      g.fillStyle = "#bae6fd";
      g.beginPath(); g.moveTo(i * 18 + 4, 117); g.lineTo(i * 18 + 6, 125); g.lineTo(i * 18 + 8, 117); g.fill();
    }
    // Balista d'assedio congelata a sinistra
    R(g, 35, 122, 28, 14, "#334155");
    R(g, 46, 112, 6, 24, "#475569");
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(25, 118); g.lineTo(73, 118); g.stroke();
    // Spalti innevati inferiori
    R(g, 0, 150, W, 50, "#081320");
    // Bufera di neve polare diagonale
    g.fillStyle = "#e0f2fe";
    for (let i = 0; i < 60; i++) {
      const sx = (i * 31 - f * 2.8 + Math.sin(f * 0.05 + i) * 12 + W * 10) % W;
      const sy = (i * 23 + f * 1.6) % H;
      R(g, sx, sy, (i % 4 === 0 ? 3 : 1.5), (i % 4 === 0 ? 2 : 1), "rgba(224,242,254,0.75)");
    }
  }

  // Sfondo: La Fucina Nera & Officine d'Assedio (Capitolo 3)
  function bgKronenburgFucina(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#180804", "#2a1005", "#130906"]);
    // Fornace monumentale al centro con fuoco e colate incandescenti
    R(g, 100, 30, 120, 110, "#1c1917");
    // Bocca della fornace ad arco
    g.fillStyle = "#7c2d12";
    g.beginPath(); g.arc(160, 85, 36, Math.PI, 0); g.rect(124, 85, 72, 45); g.fill();
    // Fuoco magico azzurro/arancio pulsante
    const fl = Math.sin(f * 0.25) * 4;
    glow(g, 160, 100, 48 + fl, "249,115,22", 0.6);
    glow(g, 160, 100, 28 + fl, "56,189,248", 0.5);
    g.fillStyle = "#ea580c"; g.beginPath(); g.arc(160, 105, 24 + fl * 0.4, 0, 7); g.fill();
    g.fillStyle = "#38bdf8"; g.beginPath(); g.arc(160, 105, 12 + fl * 0.2, 0, 7); g.fill();
    // Tubazioni di vapore industriali e ingranaggi di bronzo
    [30, W - 60].forEach((ix) => {
      // Ingranaggio
      g.strokeStyle = "#78350f"; g.lineWidth = 3;
      g.beginPath(); g.arc(ix + 15, 60, 18, 0, Math.PI * 2); g.stroke();
      // Tubo verticale
      R(g, ix + 12, 10, 6, 130, "#44403c");
      // Sbuffo di vapore
      glow(g, ix + 15, 35, 18, "245,245,244", 0.35 + 0.1 * Math.sin(f * 0.2));
    });
    // Incudine ciclopica a destra
    R(g, 230, 125, 28, 18, "#292524");
    R(g, 224, 122, 40, 5, "#44403c");
    // Griglia metallica inferiore con faville calde
    R(g, 0, 145, W, 55, "#0c0a09");
    for (let x = 0; x < W; x += 16) {
      R(g, x, 145, 1, 55, "#292524");
      R(g, 0, 165, W, 1, "#292524");
      if ((x + Math.floor(f * 0.1)) % 32 === 0) {
        R(g, x + 4, 175, 2, 2, "#f97316");
      }
    }
  }

  // Sfondo: La Guglia dell'Eclisse Celeste (Capitolo 4 Finale)
  function bgKronenburgGuglia(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#020208", "#0f051d", "#1e1035"]);
    // Mare di nubi tempestose sotto la guglia
    g.fillStyle = "rgba(30, 27, 75, 0.75)";
    for (let i = 0; i < 8; i++) {
      const cx = (i * 48 + f * 0.3) % (W + 60) - 30;
      g.beginPath(); g.arc(cx, 150 + Math.sin(f * 0.05 + i) * 6, 35, 0, Math.PI * 2); g.fill();
    }
    // L'ECLISSE SOLARE CELESTE: Anello di fuoco cremisi & viola con disco nero al centro
    const ex = 160, ey = 60;
    glow(g, ex, ey, 72, "225,29,72", 0.65);
    glow(g, ex, ey, 45, "168,85,247", 0.8);
    glow(g, ex, ey, 28, "251,191,36", 0.9);
    // Corona di raggi dell'eclisse
    g.strokeStyle = "rgba(244, 63, 94, 0.85)"; g.lineWidth = 2;
    for (let a = 0; a < 16; a++) {
      const ang = (a * Math.PI) / 8 + f * 0.01;
      const len = 26 + (Math.sin(f * 0.15 + a) * 6);
      g.beginPath(); g.moveTo(ex + Math.cos(ang) * 20, ey + Math.sin(ang) * 20);
      g.lineTo(ex + Math.cos(ang) * (20 + len), ey + Math.sin(ang) * (20 + len)); g.stroke();
    }
    // Disco oscuro della luna nera
    g.fillStyle = "#030206";
    g.beginPath(); g.arc(ex, ey, 19, 0, Math.PI * 2); g.fill();
    // Colonne gotiche spezzate ai due lati della piattaforma
    [25, 65, W - 75, W - 35].forEach((px, pi) => {
      R(g, px, 90 + pi * 8, 14, 80, "#18181b");
      R(g, px - 2, 86 + pi * 8, 18, 5, "#27272a");
    });
    // Altare della Pietra delle Sentenze al centro
    R(g, 136, 126, 48, 22, "#09090b");
    R(g, 132, 124, 56, 4, "#27272a");
    // Pietra del Geass fluttuante sull'altare
    const pfl = Math.sin(f * 0.15) * 3;
    glow(g, 160, 114 + pfl, 26, "239,68,68", 0.85);
    g.fillStyle = "#ef4444";
    g.beginPath();
    g.moveTo(160, 106 + pfl); g.lineTo(166, 114 + pfl); g.lineTo(160, 122 + pfl); g.lineTo(154, 114 + pfl);
    g.closePath(); g.fill();
    g.fillStyle = "#fef08a"; g.fillRect(159, 113 + pfl, 2, 2);
    // Pavimento d'ossidiana riflettente
    R(g, 0, 148, W, 52, "#050308");
    for (let x = 0; x < W; x += 28) {
      R(g, x, 148, 1, 52, "#312e81");
      R(g, 0, 170, W, 1, "#312e81");
    }
  }

  const BGS = {
    kb_corte: bgKronenburgCorte,
    kb_biblioteca: bgKronenburgBiblioteca,
    kb_arena: bgKronenburgArena,
    kb_sotterranei: bgKronenburgSotterranei,
    kb_salatrono: bgKronenburgSalatrono,
    kb_bastionegelo: bgKronenburgBastionegelo,
    kb_fucina: bgKronenburgFucina,
    kb_guglia: bgKronenburgGuglia
  };

  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) {
      safe(() => BGS[kind](g, W || 320, H || 200, frame || 0));
      if (geassFlashActive || geassFlashAlpha > 0) {
        drawGeassOverlay(g, W || 320, H || 200);
      }
      return true;
    }
    const res = typeof prevBg === "function" ? prevBg.apply(this, arguments) : false;
    if (geassFlashActive || geassFlashAlpha > 0) {
      drawGeassOverlay(g, W || 320, H || 200);
    }
    return res;
  };

  // ------------------------------------------------------------------ Set di Tessere 16x16 (Pixel Art Gotica Kronenburg)
  // Pavimenti:
  //   , = lastricato di scisto grigio scuro
  //   p = lastricato imperiale nero con bordi in ferro
  //   c = tappeto imperiale in velluto rosso / oro
  //   : = selciato ghiacciato / pietra grezza
  //   w = parquet scuro di quercia (biblioteca)
  //   y = manto del campo da gioco d'ossidiana
  // Solidi / Oggetti:
  //   A = mura ciclopiche di pietra nera con feritoie
  //   B = braciere di ferro fuso ardente (luce rossa pulsante)
  //   S = scaffale gigante di tomi antichi
  //   T = grande tavolo da consultazione / mappa tattica
  //   b = panchina di pietra intagliata
  //   l = candelabro / lanterna gotica a muro
  //   n = bacheca dei bandi e sentenze imperiali
  //   F = fontana monumentale con gargoyle d'ebano
  //   k = statua di Re Alden bendata
  //   W = trono delle Spade / scranno nobiliare
  //   x = casse di provviste / tomi proibiti impilati
  //   ^ > < d = cancelli in ferro battuto con punte a lancia
  //   u v q m = portoni ad arco in quercia e ferro
  //   J = vetrata istoriata gotica
  //   P = leggio con il Libro delle Sentenze
  const FLOORS = ',pc:wyesg';
  const SOLID = 'ABSTblnFkWx^><duvqmJPCGEHRM';
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
      // Scisto scuro
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#1e2433" : "#242c3d");
      P(sx, sy + 7, 16, 1, "#151b27");
      P(sx + (ty % 2 ? 4 : 11), sy, 1, 7, "#151b27");
      P(sx + (ty % 2 ? 11 : 4), sy + 8, 1, 8, "#151b27");
      if (r < 0.15) P(sx + 5, sy + 3, 2, 2, "#334155");
    } else if (f === "p") {
      // Lastricato imperiale d'ossidiana
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0f172a" : "#141e33");
      P(sx, sy, 16, 1, "#334155");
      P(sx + 15, sy, 1, 16, "#020617");
      P(sx, sy + 15, 16, 1, "#020617");
      if ((tx + ty * 3) % 4 === 0) {
        P(sx + 7, sy + 7, 2, 2, "#ef4444");
      }
    } else if (f === "c") {
      // Tappeto rosso imperiale con bordi oro
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#7f1d1d" : "#991b1b");
      P(sx, sy, 16, 1, "#b91c1c");
      if (at(tx - 1, ty) !== "c") P(sx, sy, 2, 16, "#eab308");
      if (at(tx + 1, ty) !== "c") P(sx + 14, sy, 2, 16, "#eab308");
    } else if (f === ":") {
      // Pietra ghiacciata
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#334155" : "#475569");
      P(sx + 4, sy + 5, 2, 2, "#94a3b8");
      if (r < 0.2) P(sx + 8, sy + 11, 3, 1, "#e2e8f0");
    } else if (f === "w") {
      // Parquet di quercia antica
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#27170e" : "#351f13");
      P(sx, sy + 4, 16, 1, "#170e08");
      P(sx, sy + 11, 16, 1, "#170e08");
      P(sx + (ty % 2 ? 6 : 13), sy, 1, 16, "#170e08");
    } else if (f === "y") {
      // Campo d'ossidiana
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#090d16" : "#0d131f");
      if (tx % 6 === 0) P(sx, sy, 1, 16, "rgba(239, 68, 68, 0.4)");
      if (ty % 6 === 0) P(sx, sy, 16, 1, "rgba(239, 68, 68, 0.4)");
    } else if (f === "e") {
      // Marmo d'ossidiana lucido a specchio
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#030712" : "#090d16");
      P(sx, sy, 16, 1, "#1e293b");
      P(sx + 15, sy, 1, 16, "#020617");
      if ((tx * 3 + ty) % 5 === 0) P(sx + 8, sy + 8, 2, 2, "rgba(239, 68, 68, 0.4)");
    } else if (f === "s") {
      // Scisto umido delle catacombe
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0a101d" : "#0f172a");
      P(sx + 3, sy + 4, 3, 2, "#064e3b");
      if (r < 0.2) P(sx + 9, sy + 10, 2, 2, "#10b981");
    } else if (f === "g") {
      // Griglia metallica della fucina
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#18181b" : "#27272a");
      P(sx, sy + 7, 16, 2, "#09090b");
      P(sx + 7, sy, 2, 16, "#09090b");
      if (r < 0.25) P(sx + 8, sy + 8, 2, 2, "#f97316");
    }
  }

  function gateTile(ch, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty);
    // Cancello in ferro a barre verticali con punte
    P(sx + 1, sy, 2, 16, "#475569");
    P(sx + 6, sy, 2, 16, "#475569");
    P(sx + 11, sy, 2, 16, "#475569");
    P(sx, sy + 4, 16, 2, "#1e293b");
    P(sx, sy + 12, 16, 2, "#1e293b");
    // Punte
    P(sx + 1, sy - 2, 2, 2, "#94a3b8");
    P(sx + 6, sy - 2, 2, 2, "#94a3b8");
    P(sx + 11, sy - 2, 2, 2, "#94a3b8");
    // Freccia indicatrice
    GP.fillStyle = "#ef4444"; GP.beginPath();
    if (ch === ">") { GP.moveTo(sx + 6, sy + 5); GP.lineTo(sx + 11, sy + 8); GP.lineTo(sx + 6, sy + 11); }
    else if (ch === "<") { GP.moveTo(sx + 10, sy + 5); GP.lineTo(sx + 5, sy + 8); GP.lineTo(sx + 10, sy + 11); }
    else if (ch === "d") { GP.moveTo(sx + 5, sy + 5); GP.lineTo(sx + 8, sy + 11); GP.lineTo(sx + 11, sy + 5); }
    else { GP.moveTo(sx + 5, sy + 11); GP.lineTo(sx + 8, sy + 5); GP.lineTo(sx + 11, sy + 11); }
    GP.fill();
  }

  const PAINT = {
    A(sx, sy, tx, ty) {
      // Mura ciclopiche nere
      P(sx, sy, 16, 16, "#111827");
      P(sx, sy + 5, 16, 1, "#030712");
      P(sx, sy + 11, 16, 1, "#030712");
      P(sx + ((hash(tx * 5 + ty) % 7) + 2), sy, 1, 5, "#030712");
      P(sx + ((hash(tx + ty * 9) % 7) + 4), sy + 6, 1, 5, "#030712");
      if (at(tx, ty - 1) !== "A") P(sx, sy, 16, 2, "#374151");
    },
    B(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Tripode in ferro
      P(sx + 2, sy + 7, 12, 8, "#1e293b");
      P(sx + 4, sy + 13, 2, 3, "#0f172a");
      P(sx + 10, sy + 13, 2, 3, "#0f172a");
      // Fiamme ardenti
      const fl = Math.sin(fr / 8 + tx * 3 + ty) * 1.5;
      GP.fillStyle = "#ef4444";
      GP.beginPath(); GP.arc(sx + 8, sy + 5, 5 + fl * 0.4, 0, 7); GP.fill();
      GP.fillStyle = "#f59e0b";
      GP.beginPath(); GP.arc(sx + 8, sy + 5, 3, 0, 7); GP.fill();
      GP.fillStyle = "#fef08a";
      P(sx + 7, sy + 4, 2, 2, "#fef08a");
    },
    S(sx, sy, tx, ty) {
      // Scaffale tomi
      P(sx, sy, 16, 16, "#27170e");
      P(sx, sy + 7, 16, 2, "#45291d");
      P(sx, sy + 15, 16, 1, "#170e08");
      // Libri colorati
      const cols = ["#991b1b", "#1e3a8a", "#065f46", "#854d0e", "#4b5563"];
      for (let i = 0; i < 4; i++) {
        P(sx + 1 + i * 4, sy + 1, 3, 6, cols[(tx + i) % cols.length]);
        P(sx + 1 + i * 4, sy + 9, 3, 6, cols[(ty + i) % cols.length]);
      }
    },
    T(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Tavolo massiccio di quercia
      P(sx + 1, sy + 3, 14, 10, "#3e2417");
      P(sx + 1, sy + 3, 14, 2, "#5c3824");
      P(sx + 2, sy + 13, 2, 3, "#27170e");
      P(sx + 12, sy + 13, 2, 3, "#27170e");
      // Mappa o pergamena
      P(sx + 4, sy + 5, 8, 5, "#fef3c7");
    },
    b(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Panca di pietra intagliata
      P(sx + 1, sy + 6, 14, 4, "#334155");
      P(sx + 2, sy + 10, 2, 5, "#1e293b");
      P(sx + 12, sy + 10, 2, 5, "#1e293b");
    },
    l(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Torcia a muro
      P(sx + 7, sy + 4, 2, 10, "#475569");
      P(sx + 5, sy + 2, 6, 3, "#334155");
      const fl = Math.sin(fr / 9 + tx) * 1.2;
      GP.fillStyle = "#f59e0b";
      GP.beginPath(); GP.arc(sx + 8, sy + 2, 3 + fl * 0.3, 0, 7); GP.fill();
    },
    n(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Bacheca delle sentenze
      P(sx + 2, sy + 1, 12, 10, "#451a03");
      P(sx + 3, sy + 2, 10, 8, "#fef3c7");
      P(sx + 4, sy + 4, 8, 1, "#991b1b");
      P(sx + 4, sy + 6, 6, 1, "#1f2937");
      P(sx + 4, sy + 8, 7, 1, "#1f2937");
      P(sx + 7, sy + 11, 2, 5, "#292524");
    },
    F(sx, sy, tx, ty, fr) {
      floorPaint("p", sx, sy, tx, ty);
      // Fontana monumentale
      P(sx + 1, sy + 1, 14, 14, "#334155");
      P(sx + 3, sy + 3, 10, 10, "#0f172a");
      const w = Math.sin(fr / 12 + tx) * 2;
      P(sx + 5, sy + 5, 6, 6, "#0284c7");
      P(sx + 7, sy + 4 + w, 2, 2, "#38bdf8");
    },
    k(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Statua di Re Alden
      P(sx + 4, sy + 8, 8, 8, "#475569");
      P(sx + 5, sy + 2, 6, 7, "#64748b");
      // Benda sugli occhi della statua
      P(sx + 5, sy + 4, 6, 2, "#991b1b");
    },
    W(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Trono delle Spade d'Acciaio
      P(sx + 2, sy + 1, 12, 14, "#0f172a");
      P(sx + 3, sy + 6, 10, 8, "#991b1b");
      P(sx + 1, sy, 2, 7, "#94a3b8");
      P(sx + 13, sy, 2, 7, "#94a3b8");
      P(sx + 6, sy + 2, 4, 3, "#eab308");
    },
    x(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Casse di legno rinforzate in ferro
      P(sx + 2, sy + 4, 12, 11, "#5c3824");
      P(sx + 2, sy + 4, 12, 2, "#784b31");
      P(sx + 2, sy + 9, 12, 1, "#27170e");
      P(sx + 7, sy + 4, 2, 11, "#27170e");
    },
    P(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Leggio del Libro delle Sentenze
      P(sx + 5, sy + 9, 6, 7, "#78350f");
      P(sx + 2, sy + 3, 12, 7, "#1c1917");
      P(sx + 3, sy + 4, 10, 5, "#fef3c7");
      // Sigillo rosso di Geass sul foglio
      P(sx + 7, sy + 5, 2, 3, "#dc2626");
    },
    J(sx, sy, tx, ty) {
      // Vetrata gotica
      P(sx, sy, 16, 16, "#1e1b4b");
      P(sx + 2, sy + 2, 12, 12, "#312e81");
      P(sx + 4, sy + 4, 8, 8, "#6366f1");
      P(sx + 7, sy, 2, 16, "#0f172a");
      P(sx, sy + 7, 16, 2, "#0f172a");
    },
    C(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Gabbia di ferro per prigionieri
      P(sx + 1, sy + 1, 14, 14, "#0f172a");
      for (let i = 2; i <= 14; i += 3) {
        P(sx + i, sy + 1, 1, 14, "#475569");
      }
      P(sx + 1, sy + 7, 14, 2, "#334155");
      P(sx + 7, sy + 7, 2, 2, "#cbd5e1"); // Lucchetto
    },
    O(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Condotto di zolfo con griglia
      P(sx + 2, sy + 2, 12, 12, "#042f2e");
      P(sx + 3, sy + 3, 10, 10, "#064e3b");
      const fl = Math.sin(fr / 7 + tx * 2 + ty) * 1.5;
      GP.fillStyle = "rgba(16, 185, 129, 0.75)";
      GP.beginPath(); GP.arc(sx + 8, sy + 8, 4 + fl * 0.4, 0, 7); GP.fill();
      GP.fillStyle = "#a7f3d0";
      P(sx + 7, sy + 7, 2, 2, "#a7f3d0");
    },
    G(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Ingranaggio industriale di bronzo
      P(sx + 3, sy + 3, 10, 10, "#78350f");
      P(sx + 5, sy + 5, 6, 6, "#92400e");
      P(sx + 7, sy + 7, 2, 2, "#fbbf24");
      const ang = (fr / 12 + tx) % 4;
      if (ang < 2) {
        P(sx + 7, sy + 1, 2, 3, "#d97706");
        P(sx + 7, sy + 12, 2, 3, "#d97706");
      } else {
        P(sx + 1, sy + 7, 3, 2, "#d97706");
        P(sx + 12, sy + 7, 3, 2, "#d97706");
      }
    },
    H(sx, sy, tx, ty, fr) {
      floorPaint("e", sx, sy, tx, ty);
      // Altare della Pietra delle Sentenze
      P(sx + 2, sy + 5, 12, 9, "#18181b");
      P(sx + 1, sy + 4, 14, 2, "#27272a");
      const fl = Math.sin(fr / 8 + tx) * 1.2;
      GP.fillStyle = "#ef4444";
      GP.beginPath();
      GP.moveTo(sx + 8, sy + 1 + fl * 0.3);
      GP.lineTo(sx + 11, sy + 4);
      GP.lineTo(sx + 8, sy + 7);
      GP.lineTo(sx + 5, sy + 4);
      GP.closePath(); GP.fill();
      GP.fillStyle = "#fef08a"; P(sx + 7, sy + 3, 2, 2, "#fef08a");
    },
    E(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Balista da bastione congelata
      P(sx + 3, sy + 5, 10, 8, "#334155");
      P(sx + 6, sy + 2, 4, 12, "#475569");
      P(sx + 1, sy + 4, 14, 2, "#94a3b8");
      P(sx + 7, sy + 1, 2, 2, "#bae6fd"); // Brina
    },
    R(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Tavola del Banchetto Reale
      P(sx + 1, sy + 2, 14, 12, "#451a03");
      P(sx + 2, sy + 3, 12, 10, "#7f1d1d"); // Tovaglia scarlatta
      P(sx + 4, sy + 5, 3, 3, "#facc15"); // Calice oro
      P(sx + 9, sy + 5, 3, 3, "#e2e8f0"); // Piatto argento
    },
    M(sx, sy, tx, ty) {
      // Arazzo ducale cremisi
      P(sx + 1, sy, 14, 16, "#831843");
      P(sx + 2, sy + 1, 12, 14, "#9f1239");
      P(sx + 5, sy + 4, 6, 8, "#fbbf24"); // Sigillo d'oro
      P(sx + 7, sy + 6, 2, 4, "#0f172a");
    },
    u: (sx, sy, tx, ty) => doorTile(sx, sy, "#7f1d1d"),
    v: (sx, sy, tx, ty) => doorTile(sx, sy, "#1e3a8a"),
    q: (sx, sy, tx, ty) => doorTile(sx, sy, "#065f46"),
    m: (sx, sy, tx, ty) => doorTile(sx, sy, "#374151"),
    ">": (sx, sy, tx, ty) => gateTile(">", sx, sy, tx, ty),
    "<": (sx, sy, tx, ty) => gateTile("<", sx, sy, tx, ty),
    "^": (sx, sy, tx, ty) => gateTile("^", sx, sy, tx, ty),
    d: (sx, sy, tx, ty) => gateTile("d", sx, sy, tx, ty)
  };

  function doorTile(sx, sy, archColor) {
    // Portone ad arco
    P(sx + 1, sy + 2, 14, 14, "#291811");
    P(sx + 1, sy + 1, 14, 2, archColor);
    P(sx + 7, sy + 2, 2, 14, "#170e08");
    P(sx + 5, sy + 8, 2, 3, "#facc15");
    P(sx + 9, sy + 8, 2, 3, "#facc15");
  }

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

  const PENDING = [];
  const COS_Q = [];
  function registerChapterZones(c) {
    Object.keys(c.zones || {}).forEach((zid) => registerZone(c.n, zid, c.zones[zid]));
  }

  // dialoghi dei PNG: solo quelli della zona corrente, il resto passa alla catena esistente
  function installHooks() {
    const desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    const chained = !(desc && desc.set); // con accessor (cage-borgo.js) la catena la fa il setter
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
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "kb_corte";

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
      bus: "cancello", busLabel: "Esci da Kronenburg",
      item: spec.item || ["Sigillo di Corvo", "Sigilli"], itemCos: spec.itemCos, items: spec.items || [],
      bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({}, spec.act || {}), intro: [],
      me: () => {
        const c = api.CAST.hero || api.CAST.leo;
        return Object.assign({}, c, { shirt: "#18181b", eye: "#dc2626" });
      },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d");
        g.save(); g.globalCompositeOperation = "lighter";
        glow(g, x, y, 12, "239,68,68", 0.6 + 0.2 * Math.sin(frNow() / 10 + i));
        g.restore();
        g.fillStyle = "#ef4444";
        g.beginPath(); g.moveTo(x, y - 5); g.lineTo(x + 4, y); g.lineTo(x, y + 5); g.lineTo(x - 4, y); g.closePath(); g.fill();
        g.fillStyle = "#fef08a"; g.fillRect(x - 1, y - 1, 2, 2);
      }
    };

    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: Codice delle Sentenze ed Esci." });

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
      // Disegna l'effetto Geass se attivo
      if (geassFlashActive || geassFlashAlpha > 0) {
        const cv = document.getElementById("cv");
        if (cv) drawGeassOverlay(cv.getContext("2d"), cv.width, cv.height);
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

  // ------------------------------------------------------------------ Menu in gioco e Codice delle Sentenze
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
      `<b>Kronenburg</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Monete ${bal()} · Indizi ${mem().clues.length}${h ? " · " + esc(h.name) : ""}</span>`,
      [
        { label: "Codice delle Sentenze", sub: "Prove raccolte, alibi e mappa dei sospetti", cls: "hot", fn: () => notebook(zoneMenu, true) },
        { label: "Esci da Kronenburg", sub: "La storia e i progressi restano salvati", cls: "hot", fn: leave }
      ],
      bgNow()
    );
  }

  function notebook(back, inZone) {
    const m = mem(), h = hero() || { name: "Campione", num: 9, shotName: "", shot: "saetta" };
    const cluesRows = m.clues.map((c) => {
      const parts = c.split(":::");
      return `• <b>${esc(parts[1] || "Indizio")}</b>: <span style="color:var(--dim)">${esc(parts[2] || "")}</span>`;
    }).join("<br>") || "<span style='color:var(--dim)'>Nessuna prova ancora raccolta. Esplora la Fortezza e usa l'Occhio di Geass.</span>";

    const cPrig = F.get("scelta_prigioni") === "geass_boia"
      ? "Comando Assoluto su Brutus (Sottomissione Geass)"
      : F.get("scelta_prigioni") === "sabotaggio_zolfo"
        ? "Sabotaggio Condotti di Zolfo (Astuzia Deduttiva)"
        : "In attesa d'indagine";

    const cAll = F.get("alleanza_nobile") === "lyanna"
      ? "Patto d'Ombra con Lady Lyanna (Cospirazione Machiavellica)"
      : F.get("alleanza_nobile") === "zero"
        ? "La Giustizia Assoluta di Zero (Nessun compromesso nobiliare)"
        : "In attesa d'indagine";

    const cVesp = F.get("duello_vespera") === "verita"
      ? "Verità dell'Ala Scarlatta (Confessione delle Origini)"
      : F.get("duello_vespera") === "logica"
        ? "Contro-Deduzione Logica (Smascherato il complotto di corte)"
        : "In attesa d'indagine";

    const cTact = F.get("fucina_tattica") === "distruggi_armi"
      ? "Incursione alle Fucine (Armeria ducale distrutta)"
      : F.get("fucina_tattica") === "potenzia_tiro"
        ? "Tacchetti d'Ossidiana & Tiro Termico (Potenziamento estremo)"
        : "In attesa d'indagine";

    const cEnd = F.get("finale_kronenburg") === "zero_requiem"
      ? "ZERO REQUIEM · Il Sacrificio del Corvo (Repubblica Libera & Leggenda nell'Ombra)"
      : F.get("finale_kronenburg") === "imperatore_ossidiana"
        ? "IL NUOVO IMPERATORE · La Corona d'Ossidiana (Dominio d'Acciaio & Ordine Assoluto)"
        : F.get("finale_kronenburg") === "volo_rondine"
          ? "IL VOLO DELLA RONDINE · Libertà Errante (Pietra infranta & Ritorno sui Campi)"
          : "In corso d'investigazione";

    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} (Erede del Sigillo)<br><span style="color:var(--dim)">Tiro Risvegliato: «${esc(h.shotName || "Il Tiro della Corona")}»</span><br><br><b>Codice delle Sentenze & Prove</b><br>${cluesRows}<br><br><b>Scelte Morali & Intrighi Politici</b><br>• <b>Dilemma delle Segrete (Cap. 2):</b> <span style="color:var(--dim)">${cPrig}</span><br>• <b>Alleanza di Corte (Cap. 2):</b> <span style="color:var(--dim)">${cAll}</span><br>• <b>Interrogatorio di Vespera (Cap. 3):</b> <span style="color:var(--dim)">${cVesp}</span><br>• <b>Strategia del Gelo (Cap. 3):</b> <span style="color:var(--dim)">${cTact}</span><br>• <b>Epilogo del Trono (Cap. 4):</b> <span style="color:var(--dim)">${cEnd}</span><br><br><span style="color:var(--dim)">Vittorie in Arena: ${m.wins} · Sconfitte: ${m.losses}</span>`;

    if (inZone) {
      api.trAsk("voce", html, [{ label: "◂ Torna a esplorare", fn: done }], bgNow());
    } else {
      api.scene(bgNow(), "voce", html, [{ label: "◂ Indietro", fn: back }], "Kronenburg · Il Codice");
    }
  }

  // ------------------------------------------------------------------ Partita Tattica Narrativa
  let inMatch = false;
  const VENUE_KRO = { ads: [["BASTIONE DI KRONENBURG", "#3f3f46"], ["GUARDIA D'ACCIAIO", "#52525b"], ["CORTE DEI GRIFONI", "#7c2d12"], ["PREGHIERA E FERRO", "#27272a"]], crowd: ["#27272a", "#52525b", "#78716c", "#44403c", "#a8a29e"], tint: "rgba(30,34,44,.3)", glow: "203,213,225" };
  function playMatch(o) {
    castHero(); inMatch = true;
    api.matchPick({
      alt: o.alt, oppNames: o.oppNames, squad: o.squad, azPitch: o.azPitch, cageMut: o.cageMut, cageTarget: o.cageTarget,
      id: o.id, chap: o.chap, intro: T(o.intro), mate: o.mate || "Celia", mateGeneric: true,
      us: o.us || "I Corvi Ribelli", min: o.min || 45, team: o.team, venue: o.venue || VENUE_KRO, hero: undefined,
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
    addClue, triggerGeassVisualFx, sfxGeassHeartbeat, sfxGeassResonance, sfxClueFound,
    sfxGeassShatter, sfxDramaticRevelation,
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
  // CAPITOLO 1 · IL PATTO DELLE TRE CORONE & L'OCCHIO DI CORVO
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addClue, triggerGeassVisualFx } = X;
    const N = 1, S = () => X.stepOf(N);

    // ---- Personaggi Nuovi Gotico/Psicologici
    X.cast("kb_celia", {
      name: "Celia", tag: "immortale", hair: "#10b981", style: "long", skin: "#f6ede2", eye: "#059669",
      bg: ["#0f172a", "#10b981"], shirt: "#f8fafc"
    }, "L'Immortale del Patto. Voce serafica, occhi di smeraldo e un passato sepolto sotto le fondamenta della Fortezza. È lei che ti ha concesso il Geass: «Io non sono la tua padrona, né la tua serva. Sono solo la tua complice».");

    X.cast("kb_malakar", {
      name: "Lord Malakar", tag: "duca", hair: "#18181b", style: "slick", skin: "#e2d4c0", eye: "#38bdf8",
      beard: true, bg: ["#1e1b4b", "#ef4444"], shirt: "#0f172a"
    }, "Duca Reggente di Valecorvo. Crudele, freddo e machiavellico alla Tywin Lannister. Guarda il regno e la gente comune come semplici pedine sacrificabili sulla scacchiera.");

    X.cast("kb_vespera", {
      name: "Lady Vespera", tag: "inquisitrice", hair: "#0f172a", style: "bun", skin: "#f3e8ff", eye: "#a855f7",
      glasses: true, bg: ["#2e1065", "#c084fc"], shirt: "#3b0764"
    }, "La Giudice di Ferro del Tribunale delle Sentenze. Brillante mente deduttiva alla L (Death Note). Mastica caramelle all'anice, osserva i micro-movimenti delle pupille e non crede alle coincidenze.");

    X.cast("kb_gareth", {
      name: "Sir Gareth", tag: "cavaliere", hair: "#f59e0b", style: "messy", skin: "#fef08a", eye: "#78350f",
      bg: ["#451a03", "#fbbf24"], shirt: "#b45309"
    }, "Il Primo Cavaliere del Duca. Diviso tra il rigido voto d'onore e un segreto inconfessabile sulla morte del Re. La sua armatura bianca nasconde un tremito della mano sinistra.");

    X.cast("kb_baelor", {
      name: "Mastro Baelor", tag: "archivista", hair: "#d6d3d1", style: "bald", skin: "#e7e5e4", shades: true,
      beard: true, bg: ["#292524", "#d97706"], shirt: "#44403c"
    }, "Archivista cieco della Biblioteca Proibita. Conosce a memoria la genealogia delle Tre Casate e il sapore di ogni veleno del continente: «I miei occhi non vedono il sole, ma le mie orecchie sentono il peso della tua colpa».");

    X.cast("kb_guardia", {
      name: "Guardia d'Ossidiana", tag: "armatura", hair: "#334155", style: "buzz", skin: "#cbd5e1",
      cap: "#0f172a", bg: ["#020617", "#475569"], shirt: "#1e293b"
    }, "Sentinella corazzata che sbarra la Porta dell'Archivio. Incorruttibile con il denaro... ma inerme contro il comando assoluto del Geass.");

    X.cast("kb_kaelen", {
      name: "Kaelen", tag: "ribelle", hair: "#1c1917", style: "cresta", skin: "#d6d3d1", eye: "#ef4444",
      bg: ["#18181b", "#dc2626"], shirt: "#09090b"
    }, "Tenente dell'Ordine dei Corvi Ribelli. Crede fermamente nella rinascita della giustizia attraverso la sconfitta dell'aristocrazia sul campo.");

    // Accessorio cosmetico speciale per ricompensa del capitolo 1
    X.cos("kb_mantello_zero", { kind: "acc", label: "Mantello di Zero & Corona d'Ebano", val: "#dc2626", from: "Completa il Capitolo 1 di Kronenburg" });

    const goal = (s) => ({
      0: "Trova Celia nella Cappella in rovina (a ovest della Corte d'Armi) per risvegliare il Patto.",
      1: "Usa l'Occhio di Geass sulla Guardia d'Ossidiana per sbloccare la porta della Biblioteca.",
      2: "Esplora la Grande Biblioteca e interroga Mastro Baelor.",
      3: "Esamina il Leggio delle Sentenze e gli scaffali per scoprire il referto segreto sulla morte del Re.",
      4: "Affronta Lady Vespera, la Giudice di Ferro: smaschera la falsa testimonianza della coppa d'oro.",
      5: "Interroga Sir Gareth al Bastione per fargli confessare il comando segreto del Duca.",
      6: "Scendi nell'Arena d'Ossidiana e sconfiggi la Guardia Ducale con il tuo tiro speciale {tiro}!",
      7: "Capitolo concluso! Parla con Celia per suggellare l'inizio della ribellione."
    }[s] || "Capitolo 1 concluso. Esplora liberamente la fortezza e raccogli i sigilli segreti.");

    // ---------------------------------------------------------------- Zone del Capitolo 1
    const zones = {
      // 1. La Corte d'Armi
      kb_corte: {
        name: "Kronenburg · Corte dei Grifoni", short: "Corte d'Armi", sub: "Bastioni di pietra nera, bracieri e sentinelle",
        w: 40, h: 26, start: [19, 21], theme: "torino", bg: "kb_corte",
        item: ["Sigillo di Corvo", "Sigilli"], itemCos: "kb_mantello_zero",
        items: [[3, 6], [36, 6], [12, 18], [28, 18]],
        areas: [
          [1, 1, 15, 12, "La Cappella in Rovina"],
          [24, 1, 38, 12, "Il Bastione d'Oriente"],
          [14, 1, 23, 8, "La Porta della Biblioteca"],
          [12, 13, 27, 23, "Il Piazzale dei Bracieri"]
        ],
        hints: () => ({
          "La Cappella in Rovina": "Una navata spoglia con vetrate infrante. È qui che Celia ti attende nell'ombra.",
          "La Porta della Biblioteca": "Un imponente portale in ferro e quercia guardato a vista dalla sentinella d'ossidiana.",
          "Il Piazzale dei Bracieri": "Le guardie ducale pattugliano il selciato sotto la neve che fiocca densa.",
          "Il Bastione d'Oriente": "Spalti rialzati con la vista sull'abisso marino di Kronenburg."
        }),
        act: {
          B: "Scalda le mani al braciere", k: "Osserva la statua di Re Alden",
          F: "Guarda la fontana monumentale", ">": "Scendi all'Arena", "^": "Entra nella Biblioteca"
        },
        build(Ls) {
          // Mura perimetrali
          Ls.lay(0, 0, 39, 2, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(38, 0, 39, 25, "A");
          Ls.lay(0, 24, 39, 25, "A");

          // Piazzale centrale in pietra imperiale
          Ls.lay(8, 6, 31, 22, "p");
          // Tappeto imperiale centrale
          Ls.lay(18, 3, 21, 22, "c");

          // Cappella a ovest
          Ls.lay(2, 3, 12, 10, ",");
          Ls.put(4, 4, "k");
          Ls.put(7, 3, "J");

          // Bastione a est
          Ls.lay(27, 3, 37, 10, ":");
          Ls.put(34, 4, "W");

          // Bracieri ardenti
          [[14, 7], [25, 7], [14, 15], [25, 15], [10, 20], [29, 20]].forEach(([bx, by]) => Ls.put(bx, by, "B"));

          // Fontana centrale
          Ls.put(19, 13, "F"); Ls.put(20, 13, "F");

          // Porta della Biblioteca al centro nord
          Ls.put(19, 2, "^"); Ls.put(20, 2, "^");
          // Cancello verso l'Arena a sud est
          Ls.put(35, 23, ">");

          // Panchine di pietra
          Ls.put(10, 10, "b"); Ls.put(29, 10, "b");
        },
        npcs(s) {
          const list = [];
          // Celia attende nella cappella (step 0 o sempre presente per supporto)
          list.push({ id: "kb_celia", at: [6, 6] });

          // Guardia alla porta
          if (s >= 1) list.push({ id: "kb_guardia", at: [18, 3] });

          // Kaelen il ribelle vicino al bastione
          if (s >= 1) list.push({ id: "kb_kaelen", at: [32, 7] });

          // Sir Gareth compare al bastione dopo le indagini
          if (s >= 5) list.push({ id: "kb_gareth", at: [28, 5] });

          return list;
        }
      },

      // 2. La Grande Biblioteca & Archivio delle Sentenze
      kb_biblioteca: {
        name: "Kronenburg · Archivio delle Sentenze", short: "Grande Biblioteca", sub: "Tomi secolari, pergamene segrete e inquisitori",
        w: 38, h: 26, start: [19, 22], theme: "torino", bg: "kb_biblioteca",
        item: ["Sigillo di Corvo", "Sigilli"],
        items: [[4, 4], [33, 4], [7, 16], [30, 16]],
        areas: [
          [2, 2, 15, 12, "Ala Storica & Genealogie"],
          [22, 2, 35, 12, "Settore Proibito & Veleni"],
          [14, 10, 23, 20, "Tavolo della Giudice"],
          [16, 2, 21, 8, "Il Leggio del Re"]
        ],
        hints: () => ({
          "Ala Storica & Genealogie": "File interminabili di tomi rilegati in cuoio. Mastro Baelor siede tra i faldoni.",
          "Settore Proibito & Veleni": "Scaffali chiusi da catene. Qui si conservano i registri delle morti insolite.",
          "Tavolo della Giudice": "Lady Vespera analizza documenti alla luce dei candelabri.",
          "Il Leggio del Re": "Sotto la vetrata gotica, il grande registro ufficiale con l'elenco dei caduti della Fortezza."
        }),
        act: {
          S: "Consulta i tomi antichi", P: "Leggi il Libro delle Sentenze",
          T: "Esamina la mappa delle Casate", l: "Osserva la candela di cera",
          d: "Torna alla Corte d'Armi"
        },
        build(Ls) {
          // Mura
          Ls.lay(0, 0, 37, 1, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(36, 0, 37, 25, "A");
          Ls.lay(0, 24, 37, 25, "A");

          // Pavimento in parquet di quercia
          Ls.lay(2, 2, 35, 23, "w");

          // Tappeto rosso verso il leggio
          Ls.lay(18, 4, 19, 22, "c");

          // Scaffali di tomi a perdita d'occhio
          for (let y = 3; y <= 9; y += 3) {
            Ls.lay(4, y, 13, y, "S");
            Ls.lay(24, y, 33, y, "S");
          }

          // Leggio monumentale
          Ls.put(18, 3, "P"); Ls.put(19, 3, "P");
          Ls.put(18, 1, "J"); Ls.put(19, 1, "J");

          // Tavolo di consultazione
          Ls.lay(16, 13, 21, 14, "T");

          // Candelabri
          [[12, 13], [25, 13], [8, 6], [29, 6]].forEach(([lx, ly]) => Ls.put(lx, ly, "l"));

          // Uscita verso la corte
          Ls.put(18, 23, "d"); Ls.put(19, 23, "d");
        },
        npcs(s) {
          const list = [];
          // Mastro Baelor presente per assistere o testimoniare
          list.push({ id: "kb_baelor", at: [8, 8] });

          // Lady Vespera siede al tavolo delle indagini
          if (s >= 2) list.push({ id: "kb_vespera", at: [18, 12] });

          return list;
        }
      },

      // 3. L'Arena d'Ossidiana (Il Campo della Corona)
      kb_arena: {
        name: "Kronenburg · Il Colosseo d'Ossidiana", short: "L'Arena del Solstizio", sub: "La fossa d'onore dove si decidono i destini",
        w: 40, h: 28, start: [20, 23], theme: "torino", bg: "kb_arena",
        item: ["Sigillo di Corvo", "Sigilli"],
        items: [[3, 5], [36, 5]],
        areas: [
          [2, 2, 37, 6, "La Loggia Ducale"],
          [4, 8, 35, 22, "Il Rettangolo di Gioco"],
          [16, 23, 23, 26, "L'Arco dei Gladiatori"]
        ],
        hints: () => ({
          "La Loggia Ducale": "Gli stendardi scarlatti garriste sulle teste dei nobili impassibili.",
          "Il Rettangolo di Gioco": "Pavimentazione in ossidiana levigata con incisioni runiche infuocate.",
          "L'Arco dei Gladiatori": "Il cancello di ferro che riconduce alla Corte d'Armi."
        }),
        act: {
          W: "Osserva il trono ducale", B: "Guarda il braciere cerimoniale",
          "<": "Torna alla Corte d'Armi"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "A");
          Ls.lay(0, 0, 1, 27, "A");
          Ls.lay(38, 0, 39, 27, "A");
          Ls.lay(0, 26, 39, 27, "A");

          // Loggia in alto
          Ls.lay(2, 2, 37, 5, "p");
          Ls.put(19, 3, "W"); Ls.put(20, 3, "W");

          // Il campo vero e proprio in ossidiana
          Ls.lay(4, 7, 35, 21, "y");

          // Bracieri sui 4 angoli del campo
          [[4, 7], [35, 7], [4, 21], [35, 21]].forEach(([bx, by]) => Ls.put(bx, by, "B"));

          // Cancello d'uscita
          Ls.put(19, 25, "<"); Ls.put(20, 25, "<");
        },
        npcs(s) {
          const list = [];
          if (s >= 6) {
            list.push({ id: "kb_malakar", at: [19, 4] });
            list.push({ id: "kb_gareth", at: [20, 11] });
          }
          return list;
        }
      }
    };

    // ---------------------------------------------------------------- Dialoghi & Connessioni NPC
    // 1. Celia (Il Risveglio del Geass & Il Patto)
    function celiaTalk() {
      const s = S();
      if (s === 0) {
        return say([
          ["kb_celia", "Ti stavo aspettando, {n}."],
          ["hero", "Chi sei tu? E come fai a sapere il mio nome?"],
          ["kb_celia", "I nomi sono solo etichette date dai mortali per fingere di possedere qualcosa. Io sono Celia. E quella che calpesti non è una semplice fortezza... è una prigione travestita da corte nobiliare."],
          ["hero", "Sono venuto qui per il Torneo delle Tre Corone. Il mio numero {num} e il mio tiro speciale «{tiro}» sono conosciuti ovunque."],
          ["kb_celia", "Lo so bene. Ma il torneo è una farsa mortale. Re Alden non è scivolato dai bastioni: è stato assassinato da Lord Malakar con un veleno che non lascia traccia nel sangue, ma consuma il cuore dall'interno."],
          ["hero", "Un regicidio? Perché il Duca dovrebbe volerlo?"],
          ["kb_celia", "Per impadronirsi della Pietra delle Sentenze e sterminare i campioni ribelli. Tra poche ore la porta dell'Archivio verrà sigillata col piombo fuso e la verità svanirà per sempre."],
          ["kb_celia", "Ma tu... tu hai negli occhi la scintilla di chi non accetta di essere una pedina. Dimmi, {n}: se ti concedessi il potere di costringere chiunque a obbedire a un tuo singolo comando assoluto... cosa ne faresti?"],
        ], () => {
          ask("kb_celia", "«Accetti il Patto del Geass, {n}? In cambio della verità assoluta, dovrai rovesciare il tiranno prima che cali la notte.»", [
            {
              label: "«Accetto il Patto. Dammi l'Occhio di Geass!»",
              cls: "hot",
              fn: () => {
                triggerGeassVisualFx(() => {
                  setStep(N, 1);
                  note("Patto suggellato con Celia: Risvegliato l'Occhio di Geass (Comando Assoluto).");
                  addClue("geass", "L'Occhio del Geass", "Potere del comando assoluto. Chi incrocia il tuo sguardo deve eseguire un ordine incondizionato.");
                  say([
                    ["voce", "Una fiammata cremisi avvolge la tua iride sinistra. Senti il battito del tuo cuore raddoppiare, mentre un brivido di gelido calcolo ti pervade la mente."],
                    ["kb_celia", "Il patto è compiuto. L'ala scarlatta vive dentro di te. Ora va' alla Porta della Biblioteca: la sentinella non lascia passare nessuno... costringila a inginocchiarsi e ad aprirti la via."],
                  ], done);
                });
              }
            },
            {
              label: "«Perché hai scelto proprio me tra tutti?»",
              fn: () => {
                say([
                  ["kb_celia", "Perché non ti pieghi alle regole scritte da altri. Il tuo stile e il tuo tiro speciale nascono da una volontà incrollabile. Ora decidi: sarai il re della scacchiera o l'ennesimo pedone caduto?"],
                ], celiaTalk);
              }
            }
          ]);
        });
      }

      if (s === 1) {
        return say([
          ["kb_celia", "La guardia alla Porta dell'Archivio custodisce la chiave. Avvicinati a lui, incrocia il suo sguardo e ordina: «Apri il portale e dimentica il mio volto!»."],
        ], done);
      }

      if (s === 7) {
        return say([
          ["kb_celia", "Hai sconfitto i campioni di Malakar sull'ossidiana e scosso le fondamenta di Kronenburg. Ma Malakar non accetterà la sconfitta così facilmente... I suoi fedelissimi hanno gettato i testimoni nelle Catacombe sotterranee e convocato un concilio d'emergenza nella Sala del Trono."],
        ], () => {
          ask("kb_celia", "«Sei pronto a calarti nei sotterranei di Kronenburg per iniziare il Capitolo 2, {n}?»", [
            {
              label: "⚔️ «Scendiamo subito nelle Catacombe!»",
              cls: "hot",
              fn: () => {
                setStep(N, 8);
                const m = mem();
                if (m.ch <= 1) m.ch = 2;
                save();
                continueStory();
              }
            },
            {
              label: "«Voglio esplorare ancora la Corte d'Armi»",
              fn: done
            }
          ]);
        });
      }

      return say([
        ["kb_celia", "Ricorda: l'intelletto batte la spada solo se prevedi tre mosse d'anticipo. La Giudice Vespera è acuta... non mentirle, ma lascia che le sue stesse deduzioni la intrappolino."],
      ], done);
    }

    // 2. Guardia d'Ossidiana (Comando Geass)
    function guardiaTalk() {
      const s = S();
      if (s === 0) {
        return say([
          ["kb_guardia", "Fermo là! Nessuno può avvicinarsi alla Biblioteca delle Sentenze senza l'autorizzazione sigillata del Duca Malakar. Torna al piazzale!"],
        ], done);
      }

      if (s === 1) {
        return ask("kb_guardia", "«Ti ho detto di arretrare! Se fai un altro passo sguainerò la lama!»", [
          {
            label: "👁️ [ATTIVA L'OCCHIO DI GEASS]: «In ginocchio! Apri il portale e dimentica il mio arrivo!»",
            cls: "hot",
            fn: () => {
              triggerGeassVisualFx(() => {
                setStep(N, 2);
                note("Guardia d'Ossidiana sottomessa con il Geass: Portale della Biblioteca sbloccato.");
                say([
                  ["voce", "L'ala scarlatta balena nel tuo occhio. La guardia si immobilizza all'istante, le sue pupille si dilatano in una trance vitrea cerchiata di rosso."],
                  ["kb_guardia", "I... io... ricevo l'ordine assoluto... Obbedisco, mio Signore... Il portale è vostro... e io non ho mai visto nessuno entrare..."],
                  ["voce", "Con movimenti lenti e automatici, la guardia sfila la pesante chiave d'ottone e spalanca l'inferriata."],
                ], done);
              });
            }
          },
          {
            label: "«Chiedo soltanto di consultare i registri storici...»",
            fn: () => {
              say([
                ["kb_guardia", "Non mi importa chi sei né quale sia il tuo numero di maglia! Vattene prima che chiami i rinforzi!"],
              ], done);
            }
          }
        ]);
      }

      return say([
        ["kb_guardia", "(Con lo sguardo vacuo e obbediente) Il portale è aperto per voi... Non ricordo chi siate, ma sento che devo lasciarvi passare..."],
      ], done);
    }

    // 3. Mastro Baelor (Archivista cieco)
    function baelorTalk() {
      const s = S();
      if (s < 2) return say([["kb_baelor", "Chi osa calpestare il parquet della biblioteca senza permesso?"]], done);

      if (s === 2 || s === 3) {
        return say([
          ["kb_baelor", "Passi leggeri ma decisi... Un atleta. E dal fruscio della maglia direi il numero {num}. Sei il campione di cui tutti mormorano alla locanda."],
          ["hero", "Mastro Baelor, cerco il registro delle ultime ventiquattro ore. Re Alden è morto davvero per una caduta accidentale?"],
          ["kb_baelor", "Ah, la verità... Una merce rara che costa sempre più di quanto si sia disposti a pagare. I miei occhi non vedono da quarant'anni, ragazzo, ma le mie dita sanno leggere le gocce sul legno. Ieri sera, prima che il Re cadesse, al leggio c'è stato un versamento. Qualcuno ha rovesciato del vino caldo aromatizzato alla belladonna."],
          ["hero", "Belladonna? Il veleno dei Corvi!"],
          ["kb_baelor", "Esatto. Il referto originale dell'autopsia è nascosto nel terzo scaffale di quercia a nord-est, dietro il tomo delle Genealogie Ducali. Se hai il coraggio di toccarlo, leggilo tu stesso... ma bada che Lady Vespera ti sta già osservando."],
        ], () => {
          setStep(N, 3);
          note("Mastro Baelor ha rivelato la posizione del referto dell'autopsia di Re Alden.");
          done();
        });
      }

      return say([
        ["kb_baelor", "La verità è come il vino versato: penetra nelle crepe del legno e macchia per sempre le mani di chi ha ordinato il brindisi."],
      ], done);
    }

    // 4. Lady Vespera (Il Duello Intellettuale alla Death Note)
    function vesperaTalk() {
      const s = S();
      if (s < 4) {
        return say([
          ["kb_vespera", "(Senza alzare lo sguardo dal faldone) Non disturbare il Tribunale. Se sei qui per chiedere favori sul tabellone del torneo, stai perdendo il tuo tempo."],
        ], done);
      }

      if (s === 4) {
        return say([
          ["kb_vespera", "Ti stavo osservando, {n}. Hai passato gli ultimi dieci minuti a esaminare proprio il settore delle morti improvvise. Perché un finalista del torneo di calcio dovrebbe interessarsi ai referti del Re?"],
          ["hero", "Perché chi cerca la corona deve sapere se il trono è solido o se trabocca di veleno, Giudice."],
          ["kb_vespera", "Interessante risposta. Ma vedi, io ho già interrogato Sir Gareth e il coppiere di corte. Entrambi giurano che il Re abbia bevuto solo acqua di fonte prima di salire sui bastioni. Secondo la mia logica deduttiva, l'ipotesi di omicidio ha solo lo 0.4% di probabilità."],
        ], () => {
          ask("kb_vespera", "«Cosa hai da obiettare alle mie conclusioni, Campione?»", [
            {
              label: "«Mostra la fiala di Belladonna trovata tra i tomi e il referto macchiato!»",
              cls: "hot",
              fn: () => {
                addClue("veleno", "Fiala di Belladonna", "Trovata nella biblioteca: sostanza tossica usata per paralizzare i muscoli del Re prima della caduta.");
                say([
                  ["voce", "Estrai la fiala di cristallo scuro e la pergamena nascosta da Baelor, appoggiandole con fermezza sul tavolo di fronte a lei."],
                  ["kb_vespera", "(Le pupille di Vespera si restringono dietro le lenti. Mastica nervosamente la caramella d'anice)."],
                  ["kb_vespera", "Questo... questo è il sigillo di ceralacca personale della Casata Corvo! Il coppiere ha mentito... e Sir Gareth ha coperto la ritirata dell'assassino!"],
                  ["kb_vespera", "Notevole, {n}. Davvero notevole. Pensavo fossi solo muscoli e tiri ad effetto, ma la tua mente ragiona come quella di un vero inquisitore."],
                  ["kb_vespera", "Se questo è vero, Gareth è complice del Duca. È al Bastione d'Oriente in questo momento. Va' a fargli confessare chi ha dato l'ordine prima che Malakar se ne accorga!"],
                ], () => {
                  setStep(N, 5);
                  note("Lady Vespera convinta dalle prove: autorizza il confronto con Sir Gareth.");
                  done();
                });
              }
            },
            {
              label: "«Il Duca Malakar sembra troppo sicuro della sua incoronazione...»",
              fn: () => {
                say([
                  ["kb_vespera", "I sospetti senza prove materiali sono solo chiacchiere da osteria. Mostrami un elemento concreto o lascia la stanza."],
                ], done);
              }
            }
          ]);
        });
      }

      return say([
        ["kb_vespera", "Trova Gareth al Bastione d'Oriente. Se crolla lui, l'alibi del Duca crollerà come un castello di carte."],
      ], done);
    }

    // 5. Sir Gareth (Il Cavaliere Spezzato)
    function garethTalk() {
      const s = S();
      if (s < 5) return say([["kb_gareth", "Non ho tempo per i forestieri. La Guardia Ducale deve preparare l'arena."]], done);

      if (s === 5) {
        return say([
          ["kb_gareth", "Cosa vuoi da me, numero {num}? Perché mi fissi in quel modo?"],
          ["hero", "Gareth, so che eri di guardia alla torre ieri sera. E so che hai lasciato passare il servo con il calice di Belladonna."],
          ["kb_gareth", "(Sbianca, la mano sull'elsa della spada trema visibilmente) Tu... tu non sai niente! Non sai cosa significa servire un uomo come Malakar! Ha la mia famiglia nelle sue prigioni sotterranee!"],
        ], () => {
          ask("kb_gareth", "«Cosa vuoi fare adesso? Gridarlo a tutta la corte e far uccidere i miei cari?»", [
            {
              label: "👁️ [ATTIVA L'OCCHIO DI GEASS]: «Dì la verità: chi ti ha ordinato di avvelenare il Re?»",
              cls: "hot",
              fn: () => {
                triggerGeassVisualFx(() => {
                  addClue("ordine_duca", "Confessione di Gareth", "Malakar ha minacciato la famiglia di Gareth per fargli avvelenare Re Alden.");
                  setStep(N, 6);
                  note("Sir Gareth sottomesso al Geass: confessione completa sul complotto di Malakar.");
                  say([
                    ["voce", "Il battito cardiaco riecheggia profondo. Il Geass piega l'ultima resistenza morale del cavaliere."],
                    ["kb_gareth", "È... è stato Malakar! Mi ha fatto consegnare la fiala alle ore ventuno... Mi ha ordinato di non entrare nella camera reale fino all'alba!"],
                    ["kb_gareth", "(Crolla in ginocchio col respiro ansimante) Mi ha detto che sul campo d'ossidiana avrebbe fatto eliminare chiunque avesse osato contestare il suo titolo."],
                    ["hero", "Allora ci vediamo nell'Arena del Solstizio, Gareth. Raduna la tua guardia d'acciaio. Dimostrerò davanti a tutti che il tuo padrone non è invincibile!"],
                  ], done);
                });
              }
            },
            {
              label: "«Dimmi solo se Malakar sarà presente alla finale dell'Arena.»",
              fn: () => {
                say([
                  ["kb_gareth", "Sarà sul trono della loggia ducale... E ha ordinato alla squadra di non avere pietà di te."],
                ], done);
              }
            }
          ]);
        });
      }

      return say([
        ["kb_gareth", "L'Arena ti aspetta a sud... Che gli dei abbiano pietà di noi."],
      ], done);
    }

    // 6. Kaelen (I Corvi Ribelli)
    function kaelenTalk() {
      return say([
        ["kb_kaelen", "Noi dei Corvi Ribelli sappiamo cosa stai facendo, {n}. Se scendi in campo contro i campioni del Duca, io e i miei compagni ti copriremo le spalle come ali d'acciaio!"],
      ], done);
    }

    // 7. Lord Malakar (Il Duca Reggente nell'Arena)
    function malakarTalk() {
      const s = S();
      if (s < 6) return say([["kb_malakar", "Non mi rivolgo ai plebei prima dell'inizio ufficiale dei giochi."]], done);

      return say([
        ["kb_malakar", "Dunque sei tu il presuntuoso che va sussurrando calunnie per la mia fortezza? Guardati intorno, {n}: questa è l'Arena d'Ossidiana. Qui non contano le parole o i sofismi dei filosofi. Qui vince chi schiaccia l'avversario sotto i tacchetti!"],
        ["hero", "La tua scacchiera è finita, Malakar. Scendo in campo con il mio tiro «{tiro}» per smascherare il tuo regno di sangue!"],
        ["kb_malakar", "Parole coraggiose. Gareth! Scendi in campo con i Cavalieri di Ferro. Spezzagli le gambe e gettatelo oltre i bastioni!"],
      ], () => {
        // Avvia la Partita del Giudizio d'Acciaio
        startBattleMatch();
      });
    }

    // Partita Tattica del Capitolo 1
    function startBattleMatch() {
      X.playMatch({
        id: "kb_match_1",
        alt: "az", azPitch: "campo",
        chap: "Kronenburg · Il Giudizio d'Ossidiana",
        us: "I Corvi di {n}",
        mate: "Celia",
        min: 45,
        intro: "Finale del Solstizio di Kronenburg! Il tuo Campione {n} scende sull'ossidiana contro i Cavalieri di Ferro di Sir Gareth e Lord Malakar!",
        team: (t, st) => ({
          name: "Guardia d'Acciaio",
          col: "#475569",
          style: "Catenaccio d'Acciaio & Contropiede Spietato",
          atk: t(st.atk * 0.95),
          def: t(st.def * 1.25),
          vel: t(st.vel * 0.9),
          specials: ["Barriera dei Grifoni", "Carica Pesante"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 7);
            finishChapter(N, "vittoria_ossidiana");
            note("Vittoria memorabile nell'Arena d'Ossidiana: la Guardia d'Acciaio è caduta!");
            const rewMsg = reward("kb_ch1_win", {
              coins: 400,
              cos: "kb_mantello_zero"
            });
            say([
              ["voce", "GOOOOL! Con una traiettoria devastante scagliata dal tuo tiro «{tiro}», la sfera d'ebano perfora la barriera d'acciaio ed esplode nell'incrocio dei pali!"],
              ["voce", "L'Arena piomba in un silenzio tombale, poi il boato dei ribelli e della plebe scuote le torri di Kronenburg!"],
              ["kb_malakar", "(Dalla loggia ducale, rovescia il suo calice con gli occhi carichi d'ira funesta) Com'è possibile?! Un semplice straniero ha spezzato la mia Guardia!"],
              ["kb_celia", "(Appare al tuo fianco con un sorriso enigmatico) Scacco al Re, Malakar. Il popolo ha visto il tuo idolo d'argilla crollare."],
              ["voce", `CAPITOLO 1 CONCLUSO CON SUCCESSO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("kb_corte", 19, 15);
            });
          } else {
            say([
              ["kb_gareth", "Sei stato valoroso, {n}, ma la nostra difesa non cede così facilmente. Riorganizza le tue forze e sfida di nuovo l'Arena!"],
            ], done);
          }
        }
      });
    }

    // ---------------------------------------------------------------- Interazione Oggetti del Mondo
    const obj = {
      // Passaggi tra le zone
      "kb_corte:^": () => {
        if (S() < 2) {
          say([["voce", "Il portale della Biblioteca è sbarrato da pesanti inferriate. La Guardia d'Ossidiana sorveglia l'accesso."]], done);
        } else {
          go("kb_biblioteca", 18, 22);
        }
      },
      "kb_corte:>": () => {
        go("kb_arena", 20, 24);
      },
      "kb_biblioteca:d": () => {
        go("kb_corte", 19, 4);
      },
      "kb_arena:<": () => {
        go("kb_corte", 33, 22);
      },

      // Oggetti interattivi nella Corte
      "kb_corte:B": () => {
        say([["voce", "Il braciere arde con fiamme cremisi scoppiettanti. La cenere si mescola ai fiocchi di neve sul lastricato."]], done);
      },
      "kb_corte:k": () => {
        say([["voce", "La statua di Re Alden in granito nero. Qualcuno ha legato una benda di panno scarlatto sugli occhi di pietra del vecchio sovrano: il simbolo della giustizia tradita."]], done);
      },
      "kb_corte:F": () => {
        say([["voce", "L'acqua della fontana monumentale è quasi congelata. L'effigie di un grifone ad ali spiegate ruggisce verso il cielo d'inverno."]], done);
      },

      // Oggetti nella Biblioteca
      "kb_biblioteca:P": () => {
        if (S() < 3) {
          say([["voce", "Il grande Libro delle Sentenze. Sotto l'ultima riga, una macchia scura ha reso illeggibili le ultime parole del Re."]], done);
        } else {
          say([
            ["voce", "Esamini da vicino la pergamena: tra le pieghe della rilegatura trovi la minuta strappata dell'autopsia."],
            ["voce", "«Re Alden è deceduto prima dell'impatto col suolo. Nei polmoni: tracce inequivocabili di essenza di Belladonna». Una prova schiacciante!"],
          ], () => {
            setStep(N, 4);
            note("Prova schiacciante ottenuta dal Libro delle Sentenze: pronto per affrontare Lady Vespera.");
            done();
          });
        }
      },
      "kb_biblioteca:S": () => {
        say([["voce", "Migliaia di tomi rilegati in pergamena e cuoio di cinghiale. Raccontano secoli di guerre feudali, tradimenti e matrimoni combinati delle Tre Casate."]], done);
      },
      "kb_biblioteca:T": () => {
        say([["voce", "La mappa tattica del continente di Kronenburg. Segna le rotte dei rifornimenti e le fortezze fedeli al Duca."]], done);
      }
    };

    const talk = {
      kb_celia: celiaTalk,
      kb_guardia: guardiaTalk,
      kb_baelor: baelorTalk,
      kb_vespera: vesperaTalk,
      kb_gareth: garethTalk,
      kb_kaelen: kaelenTalk,
      kb_malakar: malakarTalk
    };

    return {
      n: N,
      title: "Il Sangue del Corvo",
      sub: "Il risveglio dell'Occhio di Geass e il mistero del Re caduto",
      start: "kb_corte",
      zones,
      talk,
      obj,
      goal,
      intro: () => [
        ["voce", "KRONENBURG · LA FORTEZZA DELLE TRE CORONE", "kb_corte"],
        ["voce", "La bufera di neve sibila tra le guglie gotiche e le merlature di pietra nera. Sotto le fiaccole scoppiettanti, la guardia imperiale pattuglia i bastioni con le lance sguainate.", "kb_corte"],
        ["voce", "Sei arrivato come campione prescelto, con la maglia numero {num} e la fama del tuo tiro speciale «{tiro}». Ma l'aria è intrisa del sentore acre del tradimento: Re Alden è morto solo poche ore fa.", "kb_corte"],
        ["voce", "In fondo alla Corte d'Armi, tra le arcate in rovina della Cappella a ovest, una presenza enigmatica dai capelli color smeraldo ti osserva nell'ombra...", "kb_corte"]
      ]
    };
  });

  // ============================================================================
  // CAPITOLO 2 · LA SCACCHIERA DI SANGUE & I SOTTERRANEI DELLE OMBRE
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addClue, triggerGeassVisualFx, sfxGeassHeartbeat, sfxGeassShatter, sfxDramaticRevelation } = X;
    const N = 2, S = () => X.stepOf(N);

    // Personaggi del Capitolo 2
    X.cast("kb_lyanna", {
      name: "Lady Lyanna", tag: "nobiltà", hair: "#1c1917", style: "long", skin: "#fdf4ff", eye: "#e11d48",
      bg: ["#4c0519", "#f43f5e"], shirt: "#881337"
    }, "Sorellastra del Duca Malakar. Sguardo tagliente da vipera reale in abito di seta cremisi. Odia il fratello quanto te, ma il suo fine ultimo è reclamare il trono per sé: «Nella politica di Kronenburg o vinci o muori. Non c'è terra di mezzo, numero {num}».");

    X.cast("kb_rennick", {
      name: "Rennick l'Ombra", tag: "spia", hair: "#475569", style: "hood", skin: "#cbd5e1", eye: "#065f46",
      bg: ["#022c22", "#10b981"], shirt: "#064e3b"
    }, "Capo della rete clandestina dei Corvi nei bassifondi. Un maestro di veleni e chiavi contraffatte che si muove silenzioso come fumo nelle catacombe.");

    X.cast("kb_brutus", {
      name: "Brutus il Boia", tag: "carceriere", hair: "#0f172a", style: "buzz", skin: "#94a3b8", eye: "#dc2626",
      beard: true, bg: ["#18181b", "#7f1d1d"], shirt: "#020617"
    }, "Colosso in armatura d'ebano forgiata a becco di corvo. Custode delle chiavi delle prigioni e fedelissimo esecutore delle sentenze capitali di Malakar.");

    X.cast("kb_prigioniero", {
      name: "Damas il Dissidente", tag: "anziano", hair: "#e2e8f0", style: "messy", skin: "#f1f5f9", eye: "#0284c7",
      beard: true, bg: ["#09101d", "#38bdf8"], shirt: "#1e293b"
    }, "Anziano cancelliere di Re Alden. Rinchiuso nella cella dei dannati per essersi rifiutato di apporre il sigillo di stato sul decreto di incoronazione di Malakar.");

    // Cosmetico speciale Capitolo 2
    X.cos("kb_maschera_zero", { kind: "acc", label: "Maschera di Zero & Visiera Cremisi", val: "#18181b", from: "Completa il Capitolo 2 di Kronenburg" });

    const goal = (s) => ({
      0: "Parla con Rennick l'Ombra nelle Catacombe per individuare la cella di Damas.",
      1: "Affronta Brutus il Boia alla Cella dei Dannati: usa il Geass o sabota i condotti di zolfo.",
      2: "Interroga Damas il Dissidente nella cella per recuperare il testamento di Re Alden.",
      3: "Sali attraverso il passaggio segreto (a nord) fino alla Sala del Trono d'Ebano.",
      4: "Interroga Lady Lyanna al Banchetto Mascherato: scegli se stringere un patto d'ombra o rifiutare.",
      5: "Incontra Lady Vespera nella Sala del Trono per formalizzare il mandato d'arresto.",
      6: "Scendi in campo contro i Boia delle Segrete e la Guardia Nera del Duca!",
      7: "Capitolo 2 completato! Parla con Celia per pianificare la marcia verso il Bastione dei Ghiacci."
    }[s] || "Capitolo 2 concluso. Esplora le catacombe e raccogli i sigilli nascosti.");

    const zones = {
      // 1. Catacombe dei Dannati
      kb_sotterranei: {
        name: "Kronenburg · Catacombe dei Dannati", short: "Le Catacombe", sub: "Prigioni di pietra nera, zolfo e catene",
        w: 38, h: 26, start: [18, 22], theme: "torino", bg: "kb_sotterranei",
        item: ["Sigillo di Corvo", "Sigilli"], itemCos: "kb_maschera_zero",
        items: [[4, 4], [33, 4], [6, 18], [31, 18]],
        areas: [
          [2, 2, 14, 12, "Il Settore delle Gabbie"],
          [22, 2, 35, 12, "I Condotti di Zolfo"],
          [14, 10, 23, 20, "L'Atrio del Boia"],
          [16, 2, 21, 6, "La Scala per il Trono"]
        ],
        hints: () => ({
          "Il Settore delle Gabbie": "Celle di ferro incassate nella pietra stillante. Qui giacciono i testimoni del regicidio.",
          "I Condotti di Zolfo": "Grate da cui fuoriescono esalazioni verdastre luminescenti. Rennick si nasconde tra le ombre.",
          "L'Atrio del Boia": "Un grande braciere illumina il banco degli strumenti di tortura e l'ascia di Brutus.",
          "La Scala per il Trono": "Un passaggio ad arco in quercia ferrata che conduce direttamente sotto la Sala del Trono."
        }),
        act: {
          C: "Esamina le sbarre della cella", O: "Osserva il condotto di zolfo",
          B: "Scaldati al braciere verde", x: "Ispeziona le casse di catene",
          "^": "Sali alla Sala del Trono", d: "Torna alla Corte d'Armi"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(36, 0, 37, 25, "A");
          Ls.lay(0, 24, 37, 25, "A");
          // Pavimento in scisto umido
          Ls.lay(2, 2, 35, 23, "s");
          // Condotti di zolfo
          Ls.lay(4, 3, 12, 3, "O");
          Ls.lay(24, 3, 32, 3, "O");
          // Celle di contenimento a ovest
          Ls.put(4, 6, "C"); Ls.put(8, 6, "C"); Ls.put(12, 6, "C");
          // Bracieri
          Ls.put(14, 12, "B"); Ls.put(23, 12, "B");
          // Casse
          Ls.put(4, 20, "x"); Ls.put(32, 20, "x");
          // Passaggio nord verso la Sala del Trono
          Ls.put(18, 1, "^"); Ls.put(19, 1, "^");
          // Uscita sud
          Ls.put(18, 24, "d"); Ls.put(19, 24, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "kb_celia", at: [14, 20] });
          if (s >= 0) list.push({ id: "kb_rennick", at: [28, 5] });
          if (s <= 1) list.push({ id: "kb_brutus", at: [8, 8] });
          if (s >= 1) list.push({ id: "kb_prigioniero", at: [8, 5] });
          return list;
        }
      },
      // 2. Sala del Trono d'Ebano
      kb_salatrono: {
        name: "Kronenburg · Sala del Trono d'Ebano", short: "Sala del Trono", sub: "Trono delle Tre Corone, arazzi cremisi e nobili",
        w: 40, h: 26, start: [19, 22], theme: "torino", bg: "kb_salatrono",
        item: ["Sigillo di Corvo", "Sigilli"],
        items: [[3, 5], [36, 5], [10, 16], [29, 16]],
        areas: [
          [16, 2, 23, 8, "Il Trono delle Spade"],
          [2, 8, 14, 20, "Il Tavolo del Banchetto"],
          [26, 8, 37, 20, "La Loggia dei Giudici"],
          [16, 18, 23, 24, "L'Ingresso d'Onore"]
        ],
        hints: () => ({
          "Il Trono delle Spade": "Lo scranno reale forgiato con l'acciaio dei condottieri sconfitti. Il trono è attualmente vacante.",
          "Il Tavolo del Banchetto": "Coppe dorate, frutta candita e vino speziato. Lady Lyanna osserva i convitati da dietro una maschera.",
          "La Loggia dei Giudici": "Lady Vespera analizza documenti legali mentre le guardie d'onore vigilano.",
          "L'Ingresso d'Onore": "Portoni ad arco vigilati da sentinelle con alabarde nere."
        }),
        act: {
          W: "Ammira il Trono delle Spade", R: "Esamina il calice di vino dorato",
          M: "Osserva l'arazzo nobiliare", l: "Guarda il candelabro d'oro",
          d: "Scendi alle Catacombe"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(38, 0, 39, 25, "A");
          Ls.lay(0, 24, 39, 25, "A");
          // Pavimento in marmo nero a specchio
          Ls.lay(2, 2, 37, 23, "e");
          // Tappeto imperiale centrale
          Ls.lay(18, 4, 21, 23, "c");
          // Il Trono in alto
          Ls.put(19, 3, "W"); Ls.put(20, 3, "W");
          // Arazzi ai lati del trono
          Ls.put(15, 2, "M"); Ls.put(24, 2, "M");
          // Tavoli del banchetto
          Ls.lay(4, 10, 12, 10, "R");
          Ls.lay(4, 14, 12, 14, "R");
          // Candelabri
          [[16, 6], [23, 6], [16, 16], [23, 16]].forEach(([cx, cy]) => Ls.put(cx, cy, "l"));
          // Passaggio sud
          Ls.put(19, 24, "d"); Ls.put(20, 24, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "kb_celia", at: [22, 21] });
          if (s >= 3) list.push({ id: "kb_lyanna", at: [8, 12] });
          if (s >= 5) list.push({ id: "kb_vespera", at: [30, 12] });
          if (s >= 6) list.push({ id: "kb_malakar", at: [19, 5] });
          return list;
        }
      }
    };

    // Dialoghi Capitolo 2
    function celiaTalk2() {
      const s = S();
      if (s === 0) {
        return say([
          ["kb_celia", "Siamo scesi nelle viscere di Kronenburg, {n}."],
          ["hero", "L'aria qui puzza di zolfo e muffa millenaria."],
          ["kb_celia", "Malakar crede di aver soffocato la ribellione rinchiudendo qui i vecchi consiglieri di Re Alden. Rennick l'Ombra, il capo dei nostri informatori, è appostato vicino ai condotti di zolfo a nord-est. Parla con lui per localizzare la cella di Damas."],
        ], done);
      }
      if (s === 7) {
        return say([
          ["kb_celia", "La vittoria sui Boia delle Segrete ha spalancato le porte della verità. Abbiamo il testamento autentico di Re Alden."],
          ["hero", "Malakar non ha più alcuna legittimità legale al trono."],
          ["kb_celia", "Eppure è fuggito verso nord, al Bastione dei Ghiacci Eterni, dove il Generale Voss comanda l'esercito d'assedio. Il Capitolo 3 ci attende nella tormenta artica."],
        ], () => {
          if (CHAPTERS[3]) {
            ask("kb_celia", "«Sei pronto a marciare verso il Bastione dei Ghiacci per il Capitolo 3, {n}?»", [
              {
                label: "❄️ «Marciamo verso il Bastione dei Ghiacci!»",
                cls: "hot",
                fn: () => {
                  setStep(N, 8);
                  const m = mem();
                  if (m.ch <= 2) m.ch = 3;
                  save();
                  X.continueStory();
                }
              },
              { label: "«Voglio esplorare ancora la Sala del Trono»", fn: done }
            ]);
          } else {
            done();
          }
        });
      }
      return say([
        ["kb_celia", "Ricorda: Lady Lyanna è pericolosa quanto suo fratello. Non lasciarti abbagliare dalla sua maschera di seta."],
      ], done);
    }

    function rennickTalk() {
      const s = S();
      if (s === 0) {
        return say([
          ["kb_rennick", "Shhh! Abbassa la voce, numero {num}. I ratti qui dentro hanno orecchie ben pagate dal Duca."],
          ["hero", "Cerco Damas il Dissidente. Dov'è rinchiuso?"],
          ["kb_rennick", "Nella Cella dei Dannati, a ovest. Ma c'è un problema grosso: Brutus il Boia d'Acciaio fa la ronda davanti alle sbarre con un'ascia bipenne. Non puoi avvicinarti senza essere fatto a pezzi."],
        ], () => {
          setStep(N, 1);
          note("Rennick ha indicato la Cella dei Dannati: Brutus il Boia sbarra la via.");
          done();
        });
      }
      return say([
        ["kb_rennick", "Se hai bisogno di vie di fuga, i condotti portano dritti al fiume sotterraneo."],
      ], done);
    }

    function brutusTalk() {
      const s = S();
      if (s !== 1) return say([["kb_brutus", "Nessuno parla con i condannati senza un ordine scritto con sigillo di cera nera."]], done);
      return ask("kb_brutus", "«Chi osa avvicinarsi alla Cella dei Dannati?! Fai un altro passo e ti stacco la testa dal collo, plebeo!»", [
        {
          label: "👁️ [ATTIVA IL GEASS]: «In ginocchio! Getta l'ascia e spalanca la cella per sempre!»",
          cls: "hot",
          fn: () => {
            triggerGeassVisualFx(() => {
              sfxGeassShatter();
              F.set("scelta_prigioni", "geass_boia");
              setStep(N, 2);
              addClue("brutus_geass", "Sottomissione di Brutus", "Il colosso è stato piegato dal Geass e ha consegnato le chiavi maestre delle segrete.");
              note("Brutus il Boia sottomesso dal comando assoluto del Geass.");
              say([
                ["voce", "L'ala scarlatta balena nel tuo occhio sinistro. L'ascia di Brutus cade al suolo con un frastuono metallico rimbombante."],
                ["kb_brutus", "(Occhi vitrei cerchiati di rosso) Ordine... ricevuto... Il volere vostro... è legge assoluta... Ecco la chiave delle segrete..."],
                ["voce", "Brutus sfila la catena e spalanca la grata di ferro della cella di Damas."],
              ], done);
            });
          }
        },
        {
          label: "🧪 [SABOTAGGIO DEI CONDOTTI]: Rompi la valvola di zolfo per addormentare i carcerieri!",
          fn: () => {
            F.set("scelta_prigioni", "sabotaggio_zolfo");
            setStep(N, 2);
            addClue("sabotaggio_zolfo", "Astuzia dei Condotti", "Hai saturato il settore con i vapori soporiferi, neutralizzando i carcerieri senza usare il Geass.");
            note("Carcerieri neutralizzati con astuzia attraverso le esalazioni di zolfo.");
            say([
              ["voce", "Con un calcio ben assestato forzi la valvola del condotto. Una nube densa di zolfo verde invade l'atrio."],
              ["kb_brutus", "Cosa... soffoco... non respiro... allarme..."],
              ["voce", "Brutus barcolla e crolla a terra svenuto sul selciato umido. La chiave della cella scivola dalla sua cintura!"],
            ], done);
          }
        }
      ]);
    }

    function damasTalk() {
      const s = S();
      if (s === 2) {
        return say([
          ["kb_prigioniero", "Sei... sei tu? Il giovane con il numero {num} sul petto... Credevo che nessuno avrebbe più osato sfidare Malakar."],
          ["hero", "Damas, sono venuto a liberarti. Mastro Baelor mi ha detto che tu possiedi l'unica copia autentica del testamento reale."],
          ["kb_prigioniero", "(Solleva una pietra mobile sotto il suo giaciglio) È qui. Re Alden sapeva che Malakar tramava nell'ombra. Questo rotolo di pergamena con il Sigillo delle Tre Corone disereda Malakar e nomina te e l'ordine dei Corvi garanti della corona!"],
          ["hero", "Questa è la fine per il Duca. Con questo documento, la legge è dalla nostra parte."],
          ["kb_prigioniero", "Attento, ragazzo. Lady Lyanna ha convocato i baroni nella Sala del Trono per un banchetto mascherato. Vuole farsi proclamare reggente al posto del fratello. Sali dalla scala a nord e smascherala!"],
        ], () => {
          setStep(N, 3);
          addClue("testamento_alden", "Il Testamento di Re Alden", "Documento sovrano originale con il Sigillo d'Oro che disereda Malakar.");
          note("Recuperato il Testamento autentico di Re Alden.");
          done();
        });
      }
      return say([
        ["kb_prigioniero", "Prendi quel rotolo e mostralo ai giudici. Che la giustizia trionfi su Kronenburg!"],
      ], done);
    }

    function lyannaTalk() {
      const s = S();
      if (s < 4) return say([["kb_lyanna", "Un ospite non annunciato al mio banchetto? Le mie guardie dovrebbero essere più attente."]], done);
      if (s === 4) {
        return say([
          ["kb_lyanna", "Ti stavo osservando, {n}. Hai sconfitto i campioni sull'ossidiana e fatto fuggire mio fratello dai bastioni. Notevole."],
          ["hero", "Ho il testamento di Re Alden, Lady Lyanna. La farsa di casa Valecorvo è finita."],
          ["kb_lyanna", "(Sorride enigmaticamente, portando il calice d'oro alle labbra) Mio fratello è un bruto senza visione, {n}. Ma tu ed io possiamo accordarci. Tu mi consegni il testamento e mi proclami Regina Reggente... e in cambio io concederò ai Corvi e alla tua gente l'amnistia totale e le terre del borgo!"],
        ], () => {
          ask("kb_lyanna", "«Qual è la tua risposta, {n}? Vuoi essere il braccio armato del mio nuovo impero, o un martire dimenticato?»", [
            {
              label: "👑 [PATTO D'OMBRA]: «Accetto l'alleanza con te, Lyanna: rovesciamo Malakar dall'interno!»",
              cls: "hot",
              fn: () => {
                sfxDramaticRevelation();
                F.set("alleanza_nobile", "lyanna");
                setStep(N, 5);
                addClue("patto_lyanna", "Patto con Lady Lyanna", "Hai stretto un patto machiavellico con la sorellastra del Duca per il controllo del trono.");
                note("Patto d'Ombra suggellato con Lady Lyanna nella Sala del Trono.");
                say([
                  ["kb_lyanna", "Scelta saggia. La politica è un gioco crudele e tu hai appena giocato la mossa vincente. Lady Vespera sta arrivando: la convinceremo insieme."],
                ], done);
              }
            },
            {
              label: "⚖️ [LA GIUSTIZIA DI ZERO]: «Rifiuto! Nessun re, nessun tiranno: il potere tornerà al popolo!»",
              fn: () => {
                sfxGeassHeartbeat();
                F.set("alleanza_nobile", "zero");
                setStep(N, 5);
                addClue("giustizia_zero", "La Giustizia di Zero", "Hai respinto ogni compromesso con la nobiltà corrotta, proclamando la sovranità popolare.");
                note("Rifiutato il patto con Lyanna: fedeltà assoluta all'ideale della Repubblica libera.");
                say([
                  ["kb_lyanna", "(I suoi occhi brillano d'ira fredda) Sei un idealista pericoloso, {n}. Vedremo quanto durerà la tua purezza sul campo di battaglia!"],
                ], done);
              }
            }
          ]);
        });
      }
      return say([
        ["kb_lyanna", "La scacchiera si sta muovendo velocemente... Preparati al confronto con i giudici."],
      ], done);
    }

    function vesperaTalk2() {
      const s = S();
      if (s < 5) return say([["kb_vespera", "Il tribunale sta esaminando le prove fornite nel Capitolo 1."]], done);
      if (s === 5) {
        return say([
          ["kb_vespera", "Campione {n}, ho esaminato il documento di Damas. Il sigillo di cera è autentico al cento per cento. Re Alden non ha mai designato Malakar come successore."],
          ["hero", "Allora emetti il mandato di cattura immediato."],
          ["kb_vespera", "È già firmato. Ma Malakar ha ordinato alla sua Guardia Nera e ai Boia d'élite di occupare l'accesso alla roccaforte per sbarrarci il passo. Dovrai guidare i Corvi in campo e spezzare le loro linee d'acciaio!"],
        ], () => {
          setStep(N, 6);
          note("Lady Vespera ha emesso il mandato di cattura contro Malakar: pronti per la sfida tattica.");
          done();
        });
      }
      return say([
        ["kb_vespera", "I campioni della Guardia Nera ti aspettano al varco. Spezza la loro formazione!"],
      ], done);
    }

    function malakarTalk2() {
      return say([
        ["kb_malakar", "Credete di aver vinto perché avete trovato un pezzo di carta nelle segrete?! La corona appartiene a chi ha la forza di tenerla sul capo! Boia d'ebano, massacrateli!"],
      ], () => {
        startMatch2();
      });
    }

    function startMatch2() {
      X.playMatch({
        id: "kb_match_2",
        alt: "cage,az", azPitch: "campo", cageTarget: 5,
        chap: "Kronenburg · Il Giudizio delle Segrete",
        us: "I Corvi di {n}",
        mate: "Celia",
        min: 45,
        intro: "Partita decisiva per il controllo delle segrete e della Sala del Trono! Il tuo Campione {n} sfida la Guardia Nera dei Boia!",
        team: (t, st) => ({
          name: "Guardia Nera dei Boia",
          col: "#18181b",
          style: "Marcatura a Uomo Spietata & Contrasto di Ferro",
          atk: t(st.atk * 1.1),
          def: t(st.def * 1.3),
          vel: t(st.vel * 0.95),
          specials: ["Mannaia d'Ebano", "Gabbia d'Acciaio"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 7);
            finishChapter(N, "liberazione_segrete");
            note("Vittoria schiacciante contro la Guardia Nera: segrete liberate e Sala del Trono conquistata!");
            const rewMsg = reward("kb_ch2_win", {
              coins: 500,
              cos: "kb_maschera_zero"
            });
            say([
              ["voce", "RETEEE! Un fendente imparabile scagliato dal tuo tiro «{tiro}» piega le mani del portiere in armatura e squarcia la rete delle ombre!"],
              ["voce", "La Guardia Nera depone le armi. I prigionieri politici escono dalle celle tra grida di giubilo per il Campione {n}!"],
              ["kb_celia", "La prima fortezza è caduta. Malakar è in fuga verso il Bastione dei Ghiacci Eterni."],
              ["voce", `CAPITOLO 2 CONCLUSO CON SUCCESSO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("kb_salatrono", 19, 15);
            });
          } else {
            say([
              ["kb_lyanna", "La Guardia Nera ha retto l'urto. Riorganizza le tue linee tattiche e riprova!"],
            ], done);
          }
        }
      });
    }

    const obj = {
      "kb_sotterranei:^": () => go("kb_salatrono", 19, 22),
      "kb_sotterranei:d": () => go("kb_corte", 19, 21),
      "kb_salatrono:d": () => go("kb_sotterranei", 18, 4),
      "kb_sotterranei:C": () => {
        if (S() < 2) say([["voce", "La cella di Damas è sbarrata da catene pesanti. Brutus il Boia sorveglia l'ingresso con la sua ascia."]], done);
        else say([["voce", "La cella è ora aperta. Damas è stato liberato e ha consegnato il testamento autentico."]], done);
      },
      "kb_sotterranei:O": () => say([["voce", "Dalla grata sale un vapore denso di zolfo con bagliori verdi fosforescenti."]], done),
      "kb_sotterranei:B": () => say([["voce", "Il braciere arde con carbone fossile e zolfo, scaldando a stento la pietra ghiacciata."]], done),
      "kb_salatrono:W": () => say([["voce", "Il Trono delle Tre Corone. Centinaia di lame forgiate a freddo compongono lo schienale: il simbolo del potere assoluto di Kronenburg."]], done),
      "kb_salatrono:R": () => say([["voce", "Tavola imbandita per il banchetto dei nobili: calici d'oro zecchino e vassoi d'argento carichi di spezie orientali."]], done),
      "kb_salatrono:M": () => say([["voce", "Un antico arazzo di seta cremisi intessuto con fili d'oro. Raffigura il Corvo Imperiale che artiglia la corona."]], done)
    };

    const talk = {
      kb_celia: celiaTalk2,
      kb_rennick: rennickTalk,
      kb_brutus: brutusTalk,
      kb_prigioniero: damasTalk,
      kb_lyanna: lyannaTalk,
      kb_vespera: vesperaTalk2,
      kb_malakar: malakarTalk2
    };

    return {
      n: N,
      title: "La Scacchiera di Sangue",
      sub: "I sotterranei delle ombre, il testamento di pietra e il banchetto mascherato",
      start: "kb_sotterranei",
      zones,
      talk,
      obj,
      goal,
      intro: () => [
        ["voce", "KRONENBURG · CAPITOLO 2: LA SCACCHIERA DI SANGUE", "kb_sotterranei"],
        ["voce", "Scendendo per i condotti segreti dell'Archivio, raggiungi le viscere buie della fortezza: le Catacombe dei Dannati.", "kb_sotterranei"],
        ["voce", "Mentre nelle prigioni risuona il gocciolio dell'acqua sulfurea e il gemito dei dissidenti incatenati, al piano superiore nella Sala del Trono i nobili festeggiano dietro maschere di velluto.", "kb_sotterranei"],
        ["voce", "Celia ti accompagna nell'oscurità: è tempo di liberare i testimoni della verità e ribaltare la scacchiera!", "kb_sotterranei"]
      ]
    };
  });

  // ============================================================================
  // CAPITOLO 3 · LA FORTEZZA DI GHIACCIO & IL GIURAMENTO DI VALECORVO
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addClue, triggerGeassVisualFx, sfxGeassHeartbeat, sfxGeassShatter, sfxDramaticRevelation } = X;
    const N = 3, S = () => X.stepOf(N);

    // Personaggi del Capitolo 3
    X.cast("kb_voss", {
      name: "Gen. Voss", tag: "comandante", hair: "#94a3b8", style: "short", skin: "#cbd5e1", eye: "#0284c7",
      beard: true, bg: ["#082f49", "#38bdf8"], shirt: "#0f172a"
    }, "Comandante supremo delle legioni d'inverno di Kronenburg. Veterano di cento campagne vestito di corazza polare e mantello di lupo artico: «La pietà è una debolezza che congela il sangue prima del nemico. Dimostrami che la tua fama non è solo polvere da sparo, numero {num}».");

    X.cast("kb_merrick", {
      name: "Merrick il Fabbro", tag: "artigiano", hair: "#b45309", style: "messy", skin: "#d97706", eye: "#f59e0b",
      beard: true, bg: ["#180804", "#ea580c"], shirt: "#451a03"
    }, "Mastro forgiatore della Fucina Nera. Conosce il segreto per fondere il minerale d'ossidiana con le sfere da gioco per generare traiettorie rotanti capaci di perforare qualsiasi barriera difensiva.");

    X.cast("kb_soldato_ghiaccio", {
      name: "Sentinella Polare", tag: "guardia", hair: "#334155", style: "buzz", skin: "#e2e8f0",
      cap: "#0f172a", bg: ["#030712", "#0284c7"], shirt: "#082f49"
    }, "Balestriere d'élite schierato sugli spalti ghiacciati a guardia delle batterie d'assedio.");

    // Cosmetico speciale Capitolo 3
    X.cos("kb_corona_ghiaccio", { kind: "acc", label: "Diadema dei Ghiacci d'Ossidiana", val: "#0284c7", from: "Completa il Capitolo 3 di Kronenburg" });

    const goal = (s) => ({
      0: "Parla con Celia sul Bastione dei Ghiacci per pianificare la neutralizzazione delle difese di Voss.",
      1: "Scendi nella Fucina Nera e consulta Merrick per superare le armature d'acciaio runico.",
      2: "Scegli la strategia nella Fucina: sabotare l'armeria ducale o forgiare i tacchetti termici.",
      3: "Torna agli spalti: affronta Lady Vespera nel duello deduttivo psicologico sulla verità del Geass.",
      4: "Raggiungi il Generale Voss davanti alle baliste polari sul precipizio.",
      5: "Affronta il Generale Voss: usa l'Occhio di Geass per sfidarlo al duello d'onore.",
      6: "Scendi in campo nella tormenta artica contro la Legione dei Ghiacci di Voss!",
      7: "Capitolo 3 completato! Parla con Celia per intraprendere la salita alla Guglia dell'Eclisse."
    }[s] || "Capitolo 3 concluso. Esplora il bastione e raccogli i sigilli nascosti.");

    const zones = {
      // 1. Il Bastione dei Ghiacci Eterni
      kb_bastionegelo: {
        name: "Kronenburg · Bastione dei Ghiacci", short: "Bastione dei Ghiacci", sub: "Spalti sferzati da bufera artica e baliste",
        w: 40, h: 26, start: [19, 21], theme: "torino", bg: "kb_bastionegelo",
        item: ["Sigillo di Corvo", "Sigilli"], itemCos: "kb_corona_ghiaccio",
        items: [[3, 5], [36, 5], [11, 17], [28, 17]],
        areas: [
          [2, 2, 14, 10, "La Batteria delle Baliste"],
          [26, 2, 38, 10, "Il Precipizio sul Mare Artico"],
          [14, 1, 23, 6, "La Porta della Fucina Nera"],
          [12, 12, 28, 23, "Il Piazzale della Tormenta"]
        ],
        hints: () => ({
          "La Batteria delle Baliste": "Colossali macchine belliche puntate verso la vallata, coperte di ghiaccioli e catene.",
          "Il Precipizio sul Mare Artico": "Uno strapiombo di roccia nera su onde gelide in tempesta. Il vento soffia a raffiche furiose.",
          "La Porta della Fucina Nera": "Un massiccio portale di ferro battuto da cui esce fumo acre e bagliori arancioni.",
          "Il Piazzale della Tormenta": "Piattaforma ghiacciata dove i soldati di Voss pattugliano con corazze artiche."
        }),
        act: {
          E: "Esamina la balista congelata", B: "Scalda le dita al braciere polare",
          x: "Ispeziona i dardi pesanti", "^": "Entra nella Fucina Nera",
          d: "Torna alla Sala del Trono"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(38, 0, 39, 25, "A");
          Ls.lay(0, 24, 39, 25, "A");
          // Selciato ghiacciato
          Ls.lay(2, 2, 37, 23, ":");
          // Baliste d'assedio sugli spalti
          Ls.put(5, 4, "E"); Ls.put(10, 4, "E"); Ls.put(30, 4, "E"); Ls.put(34, 4, "E");
          // Bracieri polari
          Ls.put(14, 8, "B"); Ls.put(25, 8, "B");
          Ls.put(8, 18, "B"); Ls.put(31, 18, "B");
          // Casse
          Ls.put(4, 12, "x"); Ls.put(35, 12, "x");
          // Portone Fucina a nord
          Ls.put(19, 1, "^"); Ls.put(20, 1, "^");
          // Uscita sud
          Ls.put(19, 24, "d"); Ls.put(20, 24, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "kb_celia", at: [16, 18] });
          if (s >= 0) list.push({ id: "kb_soldato_ghiaccio", at: [7, 6] });
          if (s >= 3) list.push({ id: "kb_vespera", at: [28, 14] });
          if (s >= 4) list.push({ id: "kb_voss", at: [20, 6] });
          return list;
        }
      },
      // 2. La Fucina Nera
      kb_fucina: {
        name: "Kronenburg · La Fucina Nera", short: "La Fucina Nera", sub: "Incudini titaniche, colate incandescenti e vapore",
        w: 38, h: 26, start: [18, 22], theme: "torino", bg: "kb_fucina",
        item: ["Sigillo di Corvo", "Sigilli"],
        items: [[4, 4], [33, 4], [8, 18], [29, 18]],
        areas: [
          [12, 2, 25, 10, "La Fornace Primordiale"],
          [2, 4, 10, 16, "Il Banco degli Ingranaggi"],
          [27, 4, 35, 16, "La Grande Incudine"],
          [14, 16, 23, 23, "L'Officina degli Scarpini"]
        ],
        hints: () => ({
          "La Fornace Primordiale": "Una bocca di fuoco azzurro e arancio dove ribolle il minerale d'ossidiana fuso.",
          "Il Banco degli Ingranaggi": "Ruote dentate di bronzo e pistoni di vapore ad alta pressione.",
          "La Grande Incudine": "Merrick il Fabbro batte il ferro con un maglio che fa tremare le pareti.",
          "L'Officina degli Scarpini": "Tavoli da lavoro con cuoio rinforzato e lamine d'acciaio termico."
        }),
        act: {
          G: "Osserva l'ingranaggio di bronzo", B: "Guarda la colata di fuoco",
          T: "Esamina i progetti delle armature", x: "Ispeziona i lingotti d'ossidiana",
          d: "Torna al Bastione dei Ghiacci"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(36, 0, 37, 25, "A");
          Ls.lay(0, 24, 37, 25, "A");
          // Pavimento a griglia metallica
          Ls.lay(2, 2, 35, 23, "g");
          // Fornace monumentale
          Ls.put(18, 3, "B"); Ls.put(19, 3, "B");
          // Ingranaggi rotanti
          Ls.put(5, 8, "G"); Ls.put(32, 8, "G");
          // Condotti di vapore
          Ls.put(5, 14, "O"); Ls.put(32, 14, "O");
          // Tavoli da lavoro
          Ls.put(12, 12, "T"); Ls.put(25, 12, "T");
          // Casse lingotti
          Ls.put(8, 20, "x"); Ls.put(29, 20, "x");
          // Uscita sud
          Ls.put(18, 24, "d"); Ls.put(19, 24, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "kb_merrick", at: [20, 10] });
          if (s >= 1) list.push({ id: "kb_kaelen", at: [10, 12] });
          return list;
        }
      }
    };

    // Dialoghi Capitolo 3
    function celiaTalk3() {
      const s = S();
      if (s === 0) {
        return say([
          ["kb_celia", "Siamo in cima al mondo, {n}. Il vento qui taglia la pelle come schegge di vetro."],
          ["hero", "Malakar si nasconde oltre questa bufera?"],
          ["kb_celia", "Il Generale Voss difende la gola con le sue legioni corazzate. Le loro armature sono state forgiate nella Fucina Nera con un trattamento termico che respinge i colpi convenzionali. Dobbiamo consultare Merrick il Fabbro Eretico nella Fucina (il portone a nord) per trovare il punto debole."],
        ], done);
      }
      if (s === 7) {
        return say([
          ["kb_celia", "Il Generale Voss ha ceduto. Non ci sono più truppe o barriere tra noi e il traditore."],
          ["hero", "Dov'è Malakar adesso?"],
          ["kb_celia", "È salito oltre il limite delle nuvole, sulla Guglia dell'Eclisse Celeste. Ha portato con sé la Pietra delle Sentenze per risvegliare il Geass proibito del Dominio Assoluto. Se non lo fermiamo all'apice dell'Eclisse, la mente di ogni cittadino del regno verrà sottomessa per sempre."],
        ], () => {
          if (CHAPTERS[4]) {
            ask("kb_celia", "«Sei pronto a salire sulla Guglia dell'Eclisse per la resa dei conti finale, {n}?»", [
              {
                label: "⚡ «Saliamo alla Guglia dell'Eclisse Celeste!»",
                cls: "hot",
                fn: () => {
                  setStep(N, 8);
                  const m = mem();
                  if (m.ch <= 3) m.ch = 4;
                  save();
                  X.continueStory();
                }
              },
              { label: "«Voglio esplorare ancora il Bastione dei Ghiacci»", fn: done }
            ]);
          } else {
            done();
          }
        });
      }
      return say([
        ["kb_celia", "Vespera sta analizzando ogni tua singola parola. Nei duelli dell'intelletto, la verità detta con calma è più letale di una lama."],
      ], done);
    }

    function merrickTalk() {
      const s = S();
      if (s === 0) return say([["kb_merrick", "Attento a dove metti i piedi! Il metallo fuso non perdona i distratti."]], done);
      if (s === 1) {
        return say([
          ["kb_merrick", "Campione {n}! Kaelen mi ha parlato di te. Ho visto il tuo tiro speciale «{tiro}» durante le eliminatorie."],
          ["hero", "Merrick, le armature della Legione dei Ghiacci di Voss sono troppo pesanti. Dobbiamo ribaltare la situazione."],
          ["kb_merrick", "Ho due opzioni sul banco, figliolo. Posso farti saltare i serbatoi di pece delle fornaci ducali, distruggendo i rifornimenti delle legioni. Oppure posso montare sui tuoi scarpini dei ramponi d'acciaio termico fusi con ossidiana pura: il tuo tiro sprigionerà un'energia incandescente che brucerà il ghiaccio di Voss!"],
        ], () => {
          ask("kb_merrick", "«Quale tattica scegli per affrontare la Legione dei Ghiacci, {n}?»", [
            {
              label: "💥 [INCURSIONE ALLE FUCINE]: Sabota le fornaci ducali per disarmare le legioni!",
              cls: "hot",
              fn: () => {
                sfxGeassShatter();
                F.set("fucina_tattica", "distruggi_armi");
                setStep(N, 2);
                addClue("fucine_sabotate", "Sabotaggio delle Fucine", "Le riserve di armi e corazze pesanti di Malakar sono state distrutte.");
                note("Sabotate le riserve d'armi imperiali nella Fucina Nera.");
                say([
                  ["kb_merrick", "Fatto! I serbatoi di pece sono stati sabotati. Le legioni di Voss combatteranno senza armature di rinforzo."],
                ], () => { setStep(N, 3); done(); });
              }
            },
            {
              label: "🔥 [TACCHETTI D'OSSIDIANA]: Forgia i ramponi d'acciaio termico per potenziare «{tiro}»!",
              fn: () => {
                sfxDramaticRevelation();
                F.set("fucina_tattica", "potenzia_tiro");
                setStep(N, 2);
                addClue("tacchetti_termici", "Tacchetti d'Ossidiana Termica", "Scarpini potenziati con minerali ardenti per una trazione micidiale sul ghiaccio.");
                note("Forgiati i tacchetti d'ossidiana termica per massimizzare la potenza di {tiro}.");
                say([
                  ["kb_merrick", "Ecco a te! Lamine incandescenti forgiate a mano. Quando calcerai la sfera sul campo di ghiaccio, lascerai una scia di fuoco fuso!"],
                ], () => { setStep(N, 3); done(); });
              }
            }
          ]);
        });
      }
      return say([
        ["kb_merrick", "Torna sugli spalti e fai vedere a Voss di che pasta è fatto il tuo tiro!"],
      ], done);
    }

    function vesperaTalk3() {
      const s = S();
      if (s < 3) return say([["kb_vespera", "Sto conducendo accertamenti topografici sul bastione."]], done);
      if (s === 3) {
        return say([
          ["kb_vespera", "{n}, fermati. Dobbiamo parlare."],
          ["hero", "Lady Vespera. Credevo avessimo concordato che Malakar è il traditore."],
          ["kb_vespera", "(Toglie gli occhiali, pulendoli con un fazzoletto di seta nera) Ho analizzato ogni singola discrepanza delle ultime quarantotto ore. La guardia della biblioteca che apre il portale senza opporre resistenza. Brutus il Boia che crolla in ginocchio fissandoti negli occhi. Tu non sei semplicemente un atleta prodigioso col numero {num}."],
          ["hero", "Cosa stai insinuando?"],
          ["kb_vespera", "Tu possiedi un potere che viola ogni legge della natura umana: l'Occhio di Geass. Nei tomi proibiti di Baelor è descritto come la maledizione dei Sovrani di Sangue. Dimmi la verità: stai usando questo potere per liberare Kronenburg... o per sostituirti a Malakar e diventare il nuovo padrone della nostra volontà?"],
        ], () => {
          ask("kb_vespera", "«Rispondi, {n}: qual è la vera natura del tuo scopo?»", [
            {
              label: "👁️ [LA VERITÀ DELL'ALA SCARLATTA]: «Il Geass è un fardello, non un trono. Il mio solo fine è restituire la libertà alla gente!»",
              cls: "hot",
              fn: () => {
                sfxDramaticRevelation();
                F.set("duello_vespera", "verita");
                setStep(N, 4);
                addClue("verita_geass", "Confessione dell'Ala Scarlatta", "Lady Vespera ha compreso la purezza del tuo ideale e si è schierata totalmente al tuo fianco.");
                note("Lady Vespera convinta dalla sincerità dell'ideale: alleanza indissolubile con il Tribunale.");
                say([
                  ["kb_vespera", "(Ripone gli occhiali con un cenno solenne del capo) Ho guardato le tue pupille mentre pronunciavi queste parole. Nessun battito accelerato, nessun tremito della voce. Ti credo, {n}. Il Tribunale delle Sentenze è con te: va' da Voss e spezza l'ultima difesa di Malakar."],
                ], done);
              }
            },
            {
              label: "🧠 [CONTRO-DEDUZIONE LOGICA]: «Chi ha creato i tiranni? Voi con i vostri codici ciechi! La mia logica è la sola salvezza!»",
              fn: () => {
                sfxGeassHeartbeat();
                F.set("duello_vespera", "logica");
                setStep(N, 4);
                addClue("logica_zero", "Trionfo della Pura Deduzione", "Hai demolito le certezze legalistiche di Vespera costringendola a riconoscere il fallimento delle leggi attuali.");
                note("Trionfo dialettico su Lady Vespera: la Giudice cede davanti alla realtà dei fatti.");
                say([
                  ["kb_vespera", "(Un sorriso amaro le increspa le labbra) Spietato, brillante e matematicamente ineccepibile. Sei la medicina amara di cui questo regno aveva disperatamente bisogno."],
                ], done);
              }
            }
          ]);
        });
      }
      return say([
        ["kb_vespera", "Generale Voss ti aspetta sulla terrazza dei ghiacci. Mettilo alle strette."],
      ], done);
    }

    function vossTalk() {
      const s = S();
      if (s < 4) return say([["kb_voss", "Non ho tempo per i ribelli mentre la bufera imperversa."]], done);
      if (s === 4 || s === 5) {
        return say([
          ["kb_voss", "Dunque sei tu il corvo che ha sconvolto la fortezza."],
          ["hero", "Generale Voss. Malakar ti sta usando come scudo per fuggire alla sua condanna."],
          ["kb_voss", "Il mio giuramento è verso la Corona, ragazzo! Finché respiro, nessuno oltrepasserà questo bastione!"],
        ], () => {
          ask("kb_voss", "«Sguaina la tua fede se ne hai una, numero {num}!»", [
            {
              label: "👁️ [ATTIVA IL GEASS]: «Nel nome del vero Re: affrontami in campo aperto con la tua legione!»",
              cls: "hot",
              fn: () => {
                triggerGeassVisualFx(() => {
                  sfxGeassShatter();
                  setStep(N, 6);
                  note("Generale Voss costretto dal Geass ad accettare la sfida sul campo di ghiaccio.");
                  say([
                    ["voce", "L'ala scarlatta squarcia la tormenta di neve. Il Generale Voss sobbalza, i suoi occhi azzurri si tingono di cremisi."],
                    ["kb_voss", "Io... accetto il comando d'onore! Legione dei Ghiacci, allineatevi sull'arena artica!"],
                  ], () => {
                    startMatch3();
                  });
                });
              }
            },
            {
              label: "«Accetta la sfida leale: se vinco, abbassi le armi!»",
              fn: () => {
                setStep(N, 6);
                say([
                  ["kb_voss", "Un vero guerriero non rifiuta mai un duello d'onore. Ci vediamo sul manto di ghiaccio!"],
                ], () => {
                  startMatch3();
                });
              }
            }
          ]);
        });
      }
      return say([
        ["kb_voss", "Sei stato un avversario degno... La via per la Guglia è aperta."],
      ], done);
    }

    function startMatch3() {
      X.playMatch({
        id: "kb_match_3",
        alt: "az", azPitch: "campo",
        chap: "Kronenburg · La Battaglia della Tormenta",
        us: "I Liberatori di {n}",
        mate: "Celia",
        min: 45,
        intro: "Scontro titanico sul campo di ghiaccio perenne! Il tuo Campione {n} sfida la Legione d'Inverno del Generale Voss!",
        team: (t, st) => ({
          name: "Legione dei Ghiacci di Voss",
          col: "#0284c7",
          style: "Pressione Totale Artica & Muro Polare",
          atk: t(st.atk * 1.15),
          def: t(st.def * 1.35),
          vel: t(st.vel * 1.05),
          specials: ["Muro di Banchisa", "Carica Polare"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 7);
            finishChapter(N, "caduta_bastione_ghiaccio");
            note("Vittoria memorabile contro la Legione dei Ghiacci di Voss: Bastione artico espugnato!");
            const rewMsg = reward("kb_ch3_win", {
              coins: 650,
              cos: "kb_corona_ghiaccio"
            });
            say([
              ["voce", "GOL ECCEZIONALE! Calciata tra le folate di neve dal tuo tiro «{tiro}», la sfera traccia un solco di fuoco nell'aria e sfonda l'incrocio dei pali congelato!"],
              ["voce", "I legionari di Voss abbassano gli stendardi in segno di rispetto per il Campione {n}."],
              ["kb_voss", "(Inchinandosi con la mano sul petto) Ho combattuto quarant'anni, ma non ho mai visto una volontà così incrollabile. La via per la Guglia è tua."],
              ["kb_celia", "Ora resta solo Malakar. La resa dei conti sotto l'Eclisse Celeste ti aspetta."],
              ["voce", `CAPITOLO 3 CONCLUSO CON SUCCESSO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("kb_bastionegelo", 19, 15);
            });
          } else {
            say([
              ["kb_voss", "Il ghiaccio di Valecorvo non si scioglie così facilmente! Riposati e riprova, {n}!"],
            ], done);
          }
        }
      });
    }

    const obj = {
      "kb_bastionegelo:^": () => go("kb_fucina", 18, 22),
      "kb_bastionegelo:d": () => go("kb_salatrono", 19, 22),
      "kb_fucina:d": () => go("kb_bastionegelo", 19, 4),
      "kb_bastionegelo:E": () => say([["voce", "Colossale balista da guerra in legno di frassino e acciaio runico. I dardi pesanti sono intrisi di pece infiammabile."]], done),
      "kb_bastionegelo:B": () => say([["voce", "Il braciere polare arde con fiamma azzurrina che resiste alle folate furiose della bufera."]], done),
      "kb_fucina:G": () => say([["voce", "Un ingranaggio monumentale in bronzo massiccio che trasmette il moto alle pompe idrauliche dell'officina."]], done),
      "kb_fucina:B": () => say([["voce", "La fornace primaria della fortezza: il metallo d'ossidiana fuso brilla come lava pura nel cuore della pietra."]], done),
      "kb_fucina:O": () => say([["voce", "I tubi di scarico sfiatano vapore caldissimo con un sibilo ritmico che fa vibrare le incudini."]], done)
    };

    const talk = {
      kb_celia: celiaTalk3,
      kb_merrick: merrickTalk,
      kb_vespera: vesperaTalk3,
      kb_voss: vossTalk,
      kb_soldato_ghiaccio: () => say([["kb_soldato_ghiaccio", "Il Generale Voss difende questa fortezza da quando ero bambino. Se lo sconfiggi sul campo, il regno è tuo."]], done),
      kb_kaelen: () => say([["kb_kaelen", "Tutto l'Ordine dei Corvi è pronto a sostenerti per l'assalto finale alla Guglia!"]], done)
    };

    return {
      n: N,
      title: "La Fortezza di Ghiaccio",
      sub: "La morsa del generale Voss, il fuoco d'ossidiana e l'interrogatorio delle verità",
      start: "kb_bastionegelo",
      zones,
      talk,
      obj,
      goal,
      intro: () => [
        ["voce", "KRONENBURG · CAPITOLO 3: LA FORTEZZA DI GHIACCIO", "kb_bastionegelo"],
        ["voce", "Sopra i ghiacciai perenni del nord si erge il Bastione dei Ghiacci Eterni: una muraglia di pietra e ghiaccio a picco sull'oceano polare.", "kb_bastionegelo"],
        ["voce", "Lord Malakar si è rifugiato qui tra le legioni del Generale Voss e i magli incandescenti della Fucina Nera.", "kb_bastionegelo"],
        ["voce", "Il tuo Campione {n} affronta la prova più gelida dell'intelletto e della forza: rompere la barriera d'inverno prima che cali l'Eclisse finale!", "kb_bastionegelo"]
      ]
    };
  });

  // ============================================================================
  // CAPITOLO 4 · L'ECLISSE DEI CORVI · IL VERDETTO FINALE
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addClue, triggerGeassVisualFx, sfxGeassHeartbeat, sfxGeassResonance, sfxGeassShatter, sfxDramaticRevelation } = X;
    const N = 4, S = () => X.stepOf(N);

    // Personaggi del Capitolo 4
    X.cast("kb_malakar_geass", {
      name: "Imp. Malakar", tag: "usurpatore", hair: "#0f172a", style: "slick", skin: "#cbd5e1", eye: "#dc2626",
      beard: true, bg: ["#450a0a", "#dc2626"], shirt: "#18181b"
    }, "Lord Malakar asceso a Imperatore dell'Eclisse. Ha incastonato nella propria fronte una scheggia della Pietra delle Sentenze, risvegliando un Geass corrotto: «Se il mondo non vuole inginocchiarsi con le leggi, piegherò le loro menti una per una!»");

    X.cast("kb_oracolo", {
      name: "La Pietra delle Sentenze", tag: "reliquia", hair: "#ef4444", style: "short", skin: "#fef08a", eye: "#fef08a",
      bg: ["#020208", "#dc2626"], shirt: "#1e1b4b"
    }, "L'eco cosmica e millenaria racchiusa nel cristallo d'ossidiana di Kronenburg. La fonte originale del potere del Geass.");

    // Cosmetico epico finale della Saga
    X.cos("kb_aura_geass", { kind: "acc", label: "Aura Fiammeggiante dell'Ala Scarlatta", val: "#ef4444", from: "Completa la Saga di Kronenburg" });

    const goal = (s) => ({
      0: "Avanza verso l'Altare della Pietra delle Sentenze e affronta Lord Malakar sotto l'Eclisse.",
      1: "Sostieni il duello ideologico e lo scontro delle volontà con Malakar.",
      2: "Consulta Celia e i tuoi alleati (Vespera, Gareth, Lyanna) riuniti sulla Guglia.",
      3: "Scendi in campo per la Finale delle Finali: La Partita dell'Eclisse Celeste!",
      4: "Vittoria memorabile! Frantuma la barriera oscura di Malakar con «{tiro}».",
      5: "IL VERDETTO SUPREMO: Scegli il destino del Trono e l'epilogo di Kronenburg!",
      6: "Saga di Kronenburg completata! Raccogli la gloria e le ricompense leggendarie."
    }[s] || "Saga di Kronenburg completata con successo! Esplora liberamente tutte le ambientazioni.");

    const zones = {
      // La Guglia dell'Eclisse Celeste
      kb_guglia: {
        name: "Kronenburg · Guglia dell'Eclisse Celeste", short: "Guglia dell'Eclisse", sub: "La cima sopra le nubi, altare cosmico e trono",
        w: 42, h: 28, start: [20, 24], theme: "torino", bg: "kb_guglia",
        item: ["Sigillo di Corvo", "Sigilli"], itemCos: "kb_aura_geass",
        items: [[3, 6], [38, 6], [10, 18], [31, 18]],
        areas: [
          [16, 4, 25, 12, "L'Altare della Pietra"],
          [2, 8, 14, 22, "La Terrazza d'Occidente"],
          [27, 8, 39, 22, "La Terrazza d'Oriente"],
          [17, 20, 24, 26, "La Scala del Firmamento"]
        ],
        hints: () => ({
          "L'Altare della Pietra": "Un cerchio d'ossidiana al centro della sommità. La Pietra delle Sentenze pulsa come un cuore cosmico cremisi.",
          "La Terrazza d'Occidente": "Colonne di pietra gotica spezzate a picco sul mare di nuvole illuminate dalla corona solare.",
          "La Terrazza d'Oriente": "Spalti rialzati dove i tuoi compagni e i giudici osservano il verdetto della storia.",
          "La Scala del Firmamento": "La scalinata di marmo nero che sale dal Bastione dei Ghiacci."
        }),
        act: {
          H: "Osserva la Pietra delle Sentenze", B: "Scaldati al braciere dell'Eclisse",
          W: "Ammira il trono supremo", d: "Torna al Bastione dei Ghiacci"
        },
        build(Ls) {
          Ls.lay(0, 0, 41, 1, "A");
          Ls.lay(0, 0, 1, 27, "A");
          Ls.lay(40, 0, 41, 27, "A");
          Ls.lay(0, 26, 41, 27, "A");
          // Pavimento a specchio d'ossidiana
          Ls.lay(2, 2, 39, 25, "e");
          // Cerchio centrale dell'altare
          Ls.lay(17, 6, 24, 13, "c");
          // Pietra delle Sentenze
          Ls.put(20, 8, "H"); Ls.put(21, 8, "H");
          // Colonne spezzate
          Ls.put(6, 6, "A"); Ls.put(6, 12, "A"); Ls.put(6, 18, "A");
          Ls.put(35, 6, "A"); Ls.put(35, 12, "A"); Ls.put(35, 18, "A");
          // Bracieri cosmici
          Ls.put(14, 6, "B"); Ls.put(27, 6, "B");
          Ls.put(14, 15, "B"); Ls.put(27, 15, "B");
          // Trono supremo a nord
          Ls.put(20, 3, "W"); Ls.put(21, 3, "W");
          // Uscita sud
          Ls.put(20, 26, "d"); Ls.put(21, 26, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "kb_celia", at: [18, 18] });
          if (s <= 4) list.push({ id: "kb_malakar_geass", at: [20, 7] });
          if (s >= 2) {
            list.push({ id: "kb_vespera", at: [12, 14] });
            list.push({ id: "kb_gareth", at: [29, 14] });
            list.push({ id: "kb_lyanna", at: [32, 16] });
          }
          return list;
        }
      }
    };

    // Dialoghi Capitolo 4
    function celiaTalk4() {
      const s = S();
      if (s === 0) {
        return say([
          ["kb_celia", "Guardati intorno, {n}. Siamo sopra le nuvole."],
          ["hero", "L'Eclisse solare... il cielo sembra una ferita aperta."],
          ["kb_celia", "Questa è la fine e il principio di tutto. Malakar attende al centro dell'altare. Ha assorbito la scheggia del Geass. Se lasci che la campana dell'eclisse rintocchi, nessuno potrà più ribellarsi. Avanza verso di lui e affrontalo!"],
        ], done);
      }
      if (s === 2) {
        return say([
          ["kb_celia", "Tutti coloro che hai incontrato nel tuo cammino sono qui. La Giudice Vespera, Sir Gareth, Lady Lyanna. Nessuno di loro può combattere al tuo posto: la finale si gioca sul campo d'ossidiana tra te e i campioni dell'Eclisse."],
        ], done);
      }
      if (s === 6) {
        const ep = F.get("finale_kronenburg") || "liberta";
        return say([
          ["kb_celia", `Il tuo verdetto è scritto nelle stelle, {n}. Qualunque sia la via che hai scelto, la leggenda del tuo numero {num} e del tuo tiro «{tiro}» non verrà mai dimenticata.`],
        ], done);
      }
      return say([
        ["kb_celia", "L'Occhio del Geass brilla al culmine della sua potenza... Guida la sfera alla vittoria!"],
      ], done);
    }

    function malakarGeassTalk() {
      const s = S();
      if (s === 0 || s === 1) {
        return say([
          ["kb_malakar_geass", "Sei arrivato fin qui, minuscolo parassita col numero {num}."],
          ["hero", "È finita, Malakar. Tutte le tue fortezze sono cadute. Il testamento di Re Alden è pubblico e la corte ti ha disconosciuto."],
          ["kb_malakar_geass", "(Scende dai gradini dell'altare, mentre un'aura di fiamme cremisi gli avvolge lo sguardo) La corte? Il popolo? Sono formiche che strisciano nella polvere! Con questo frammento di Geass io non ho bisogno di titoli o consensi: io ordinerò loro di amarmi, e loro si getteranno ai miei piedi sorridendo!"],
          ["hero", "Questo non è regnare, Malakar. Questa è la follia di chi ha paura di essere un uomo ordinario."],
          ["kb_malakar_geass", "Allora sottomettiti anche tu! Sull'Arena dell'Eclisse, i miei campioni immortali divoreranno la tua anima!"],
        ], () => {
          setStep(N, 2);
          note("Lord Malakar affrontato sulla Guglia: pronta la partita dell'Eclisse Celeste.");
          done();
        });
      }
      if (s === 2) {
        return ask("kb_malakar_geass", "«Hai il coraggio di scendere in campo per la finale della storia del mondo, {n}?»", [
          {
            label: "⚡ «Scendo in campo! Frantumerò la tua illusione con «{tiro}»!»",
            cls: "hot",
            fn: () => {
              setStep(N, 3);
              startMatch4();
            }
          },
          {
            label: "«Voglio prima consultare i miei compagni»",
            fn: done
          }
        ]);
      }
      if (s === 4) {
        // Scena della Vittoria & Il Momento del Verdetto Finale!
        return showFinalVerdictChoice();
      }
      return say([
        ["kb_malakar_geass", "(A terra sconfitto, mentre il suo Geass si disgrega in faville scarlatte) Maledetto... come hai potuto... superare la perfezione dell'Eclisse..."],
      ], done);
    }

    function gateEnds(opts, conds, again) {
      const ok = conds.map(Boolean);
      if (ok.filter(Boolean).length < 2) return opts;
      return opts.map((o, i) => ok[i] ? o : {
        label: "🔒 ??? · Finale non raggiungibile",
        sub: "Dipende dalle scelte fatte durante la storia: rigioca la saga con scelte diverse per scoprirlo",
        fn: () => say([["voce", "Con le scelte che hai fatto questo finale non si apre. Ricomincia la saga dal menu per vederlo."]], again)
      });
    }

    function showFinalVerdictChoice() {
      sfxDramaticRevelation();
      const _opts = [
        {
          label: "🖤 [ZERO REQUIEM]: Assumi su di te l'odio del mondo, distruggi la tirannia e dona la repubblica al popolo!",
          cls: "hot",
          fn: () => {
            F.set("finale_kronenburg", "zero_requiem");
            setStep(N, 5);
            addClue("epilogo_zero_requiem", "Zero Requiem: Il Sacrificio", "Hai abbattuto la corona e affidato Kronenburg a una repubblica libera guidata da Lady Vespera, scomparendo nell'ombra con Celia.");
            note("EPILOGO SCELTO: ZERO REQUIEM · Il Sacrificio del Corvo.");
            finishChapter(N, "zero_requiem");
            showEndingScene("zero_requiem");
          }
        },
        {
          label: "👑 [IL NUOVO IMPERATORE]: Indossa la Corona d'Ossidiana sul Trono delle Spade e fonda un'era di ordine assoluto!",
          cls: "hot",
          fn: () => {
            F.set("finale_kronenburg", "imperatore_ossidiana");
            setStep(N, 5);
            addClue("epilogo_imperatore", "Il Nuovo Imperatore d'Ossidiana", "Sei salito al Trono delle Tre Corone, instaurando un regno di disciplina ferrea e invincibilità assoluta.");
            note("EPILOGO SCELTO: IL NUOVO IMPERATORE · La Corona d'Ossidiana.");
            finishChapter(N, "imperatore_ossidiana");
            showEndingScene("imperatore_ossidiana");
          }
        },
        {
          label: "🕊️ [IL VOLO DELLA RONDINE]: Frantuma per sempre la Pietra delle Sentenze, sciogli il Geass e torna libero sui campi!",
          cls: "hot",
          fn: () => {
            F.set("finale_kronenburg", "volo_rondine");
            setStep(N, 5);
            addClue("epilogo_volo_rondine", "Il Volo della Rondine: Libertà", "Hai distrutto la Pietra magica spezzando ogni catena, tornando a essere un campione errante insieme a Celia.");
            note("EPILOGO SCELTO: IL VOLO DELLA RONDINE · La Rinuncia al Trono.");
            finishChapter(N, "volo_rondine");
            showEndingScene("volo_rondine");
          }
        }
      ];
      const g = (k) => F.get(k);
      ask("kb_celia", "«La vittoria è tua, {n}. Malakar è sconfitto e l'Eclisse volge al termine. La Pietra delle Sentenze e la Corona delle Tre Corone sono nelle tue mani. Qual è il tuo verdetto supremo per il destino di Kronenburg?»", gateEnds(_opts, [
        g("alleanza_nobile") === "zero" || g("duello_vespera") === "verita",
        g("scelta_prigioni") === "geass_boia" || g("fucina_tattica") === "potenzia_tiro" || g("duello_vespera") === "logica",
        g("scelta_prigioni") === "sabotaggio_zolfo" || g("fucina_tattica") === "distruggi_armi" || g("alleanza_nobile") === "lyanna"
      ], showFinalVerdictChoice));
    }

    function showEndingScene(endingKey) {
      const rewMsg = reward("kb_saga_complete", {
        coins: 1000,
        cos: "kb_aura_geass"
      });

      if (endingKey === "zero_requiem") {
        say([
          ["voce", "🖤 EPILOGO: ZERO REQUIEM · IL SACRIFICIO DEL CORVO"],
          ["hero", "«La catena dell'odio si spezza qui. Il trono di Kronenburg non esisterà mai più. Lady Vespera, Damas, Mastro Baelor: questo paese appartiene alla sua gente.»"],
          ["kb_vespera", "(Trattiene a stento l'emozione, inchinandosi profondamente) Avete liberato il popolo da secoli di buio, Campione. Il vostro nome non sarà su una lapide di re... ma nei canti di ogni piazza libera."],
          ["kb_celia", "(Ti prende la mano mentre il sole riemerge dall'Eclisse) Il patto è sciolto, mio complice. Ora siamo due ombre libere nel vento dell'alba."],
          ["voce", `SAGA DI KRONENBURG COMPLETATA! ${rewMsg.join(" · ")}`],
        ], () => {
          setStep(N, 6);
          go("kb_guglia", 20, 20);
        });
      } else if (endingKey === "imperatore_ossidiana") {
        say([
          ["voce", "👑 EPILOGO: IL NUOVO IMPERATORE · LA CORONA D'OSSIDIANA"],
          ["hero", "«I deboli cercano padroni, i tiranni cercano servi. Io sarò la legge incrollabile che nessuno potrà mai corrompere!»"],
          ["kb_gareth", "(Sfodera la spada bianca e la posa al suolo) Salve a voi, Sire d'Acciaio! I cavalieri di Kronenburg obbediranno al vostro comando fino alla fine dei giorni!"],
          ["kb_lyanna", "(Sorride ammirata) Una mossa degna del più grande stratega della storia. L'Impero delle Tre Corone dominerà il continente sotto la vostra bandiera."],
          ["kb_celia", "Che tu sia re o ribelle, il mio sguardo sarà sempre al tuo fianco, mio sovrano."],
          ["voce", `SAGA DI KRONENBURG COMPLETATA! ${rewMsg.join(" · ")}`],
        ], () => {
          setStep(N, 6);
          go("kb_guglia", 20, 20);
        });
      } else {
        say([
          ["voce", "🕊️ EPILOGO: IL VOLO DELLA RONDINE · LA LIBERTÀ ERRANTE"],
          ["hero", "«Nessun uomo dovrebbe possedere il comando sulla mente di un altro. Questo potere finisce oggi!»"],
          ["voce", "Con un colpo potente e perfetto scagliato dal tuo tiro «{tiro}», la sfera impatta contro la Pietra delle Sentenze. Il cristallo millenario esplode in un milione di schegge di luce che svaniscono nel vento!"],
          ["kb_celia", "(I suoi occhi brillano di una gioia pura mai vista prima) Ho vissuto mille anni aspettando questo momento. Finalmente... siamo entrambi liberi."],
          ["kb_vespera", "La leggenda del Campione numero {num} rimarrà scolpita nella memoria di ogni bambino che calcerà un pallone sulle coste."],
          ["voce", `SAGA DI KRONENBURG COMPLETATA! ${rewMsg.join(" · ")}`],
        ], () => {
          setStep(N, 6);
          go("kb_guglia", 20, 20);
        });
      }
    }

    function startMatch4() {
      X.playMatch({
        id: "kb_match_4",
        alt: "hd,az", azPitch: "erba",
        oppNames: ["Custode dell'Eclisse", "Custode Scarlatto", "Custode d'Ossidiana", "Cavaliere del Geass", "Lord Malakar"],
        squad: ["Damas", "Mastro Baelor", "Lady Vespera"],
        chap: "Kronenburg · L'Eclisse Celeste Finale",
        us: "L'Ordine dei Corvi Sovrani",
        mate: "Celia",
        min: 45,
        intro: "LA FINALE ASSOLUTA! Il tuo Campione {n} sfida i Custodi dell'Eclisse Eterna guidati dal Geass di Lord Malakar!",
        team: (t, st) => ({
          name: "Custodi dell'Eclisse di Malakar",
          col: "#dc2626",
          style: "Dominio Mentale & Attacco Devastante",
          atk: t(st.atk * 1.3),
          def: t(st.def * 1.35),
          vel: t(st.vel * 1.15),
          specials: ["Distorsione d'Eclisse", "Comando Assoluto"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 4);
            note("VITTORIA LEGGENDARIA NELLA FINALE DELL'ECLISSE! Malakar e la sua guardia oscura sono caduti!");
            say([
              ["voce", "GOOOOOOOL LEGGENDARIOOOO! Con un tiro sovrannaturale sprigionato dalla tua volontà e dal tuo colpo «{tiro}», la sfera squarcia l'eclisse e frantuma la rete di luce cremisi!"],
              ["voce", "Il sole riemerge dal disco di luna nera. La tirannia di Malakar è spezzata per sempre!"],
            ], () => {
              showFinalVerdictChoice();
            });
          } else {
            say([
              ["kb_malakar_geass", "Il tuo Geass ha vacillato davanti all'Eclisse! Riorganizza il tuo spirito e sfida di nuovo il destino!"],
            ], done);
          }
        }
      });
    }

    const obj = {
      "kb_guglia:d": () => go("kb_bastionegelo", 19, 21),
      "kb_guglia:H": () => {
        if (S() < 5) say([["voce", "La Pietra delle Sentenze fluttua sull'altare emettendo un ronzio armonico cremisi. È il cuore pulsante del potere del Geass."]], done);
        else say([["voce", "L'altare dell'Eclisse: testimone del verdetto finale pronunciato dal Campione {n}."]], done);
      },
      "kb_guglia:W": () => say([["voce", "Il trono supremo della vetta: da quassù lo sguardo abbraccia l'intero continente fino all'orizzonte marino."]], done),
      "kb_guglia:B": () => say([["voce", "I bracieri della guglia ardono con fiamme purpuree, nutrite dal vento astrale dell'Eclisse."]], done)
    };

    const talk = {
      kb_celia: celiaTalk4,
      kb_malakar_geass: malakarGeassTalk,
      kb_vespera: () => say([["kb_vespera", "Il tribunale è pronto a registrare il tuo verdetto nella storia di Kronenburg."]], done),
      kb_gareth: () => say([["kb_gareth", "Il mio onore è riscattato grazie a te, {n}. Seguirò la via che indicherai."]], done),
      kb_lyanna: () => say([["kb_lyanna", "Hai dimostrato di saper giocare sulla scacchiera meglio di qualsiasi re o duca."]], done)
    };

    return {
      n: N,
      title: "L'Eclisse dei Corvi · Il Verdetto Finale",
      sub: "L'eclisse celeste, lo scontro delle due volontà assolute e i finali delle Tre Corone",
      start: "kb_guglia",
      zones,
      talk,
      obj,
      goal,
      intro: () => [
        ["voce", "KRONENBURG · CAPITOLO 4: L'ECLISSE DEI CORVI", "kb_guglia"],
        ["voce", "Sopra l'oceano di nubi, la Guglia dell'Eclisse tocca il cielo scuro dove la luna nera divora il sole in una corona di fuoco scarlatto.", "kb_guglia"],
        ["voce", "Lord Malakar ti attende sull'altare cosmico con il Geass del Dominio Assoluto risvegliato.", "kb_guglia"],
        ["voce", "La resa dei conti suprema è giunta: con Celia e i tuoi alleati al fianco, scendi in campo per decidere il futuro del mondo!", "kb_guglia"]
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
        "kb_corte", "voce",
        "<b>Kronenburg · Il Patto delle Tre Corone</b><br>Questa saga tattica e investigativa richiede il tuo Campione: nome, aspetto, numero e tiro speciale sono protagonisti assoluti.<br><br>Prima crea il tuo campione nel menu!",
        [
          { label: "Crea il tuo Campione", sub: "Nome, look e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
          { label: "◂ Torna alle Modalità", fn: leaveToModes }
        ],
        "Kronenburg"
      );
    }

    castHero();
    const c = activeChapter(), m = mem(), isSagaComplete = !!(m.done[4]), curDone = c && m.done[c.n];
    const statusText = isSagaComplete
      ? "👑 <b>Saga di Kronenburg Completata!</b> Tutti i 4 capitoli e il verdetto finale sono stati raggiunti."
      : curDone
        ? `Capitolo ${c.n} concluso con successo! Il prossimo capitolo ti attende.`
        : esc(goalNow());

    api.scene(
      "kb_salatrono", "voce",
      `<b>👑 Kronenburg · Il Patto delle Tre Corone</b><br>${esc(h.name)} · n. ${esc(h.num)} (Erede del Sigillo)<br><span style="color:var(--dim)">«${esc(h.shotName || "Il Tiro della Corona")}»</span><br><br><span style="color:#f87171">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}</span><br><span style="color:var(--dim)">${statusText}</span>`,
      [
        {
          label: isSagaComplete
            ? "Esplora Kronenburg"
            : c && !m.intro["ch" + c.n]
              ? `Inizia il Capitolo ${c.n}`
              : "Continua la Storia",
          sub: c ? `Capitolo ${c.n} · ${c.title}` : "",
          cls: "hot",
          fn: continueStory
        },
        { label: "Codice delle Sentenze", sub: `Prove ${m.clues.length} · Indagini di ${h.name}`, fn: () => notebook(openMain, false) },
        { label: "Capitoli della Saga", sub: "Esplora, seleziona o rigioca i capitoli", fn: chaptersList },
        { label: "◂ Torna alle Modalità", fn: leaveToModes }
      ],
      "Kronenburg"
    );
  }

  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    const isNew = !m.intro["ch" + c.n];
    if (isNew) {
      m.intro["ch" + c.n] = 1; save();
      if (c.intro) {
        return say(c.intro(), () => {
          go(c.start || "kb_corte", 19, 21);
        });
      }
    }
    const tr = api.trRec();
    const curZ = (m.zone && ZONES[m.zone]) ? m.zone : (c.start || "kb_corte");
    if (!tr.pos[curZ]) {
      const zr = ZONES[curZ];
      const st = (zr && zr.spec.start) || [19, 21];
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
    opts.push({ label: "Ricomincia da Capo", sub: "Azzera capitoli e indagini (monete e cosmetici restano salvati)", fn: resetConfirm });
    opts.push({ label: "◂ Indietro", fn: openMain });

    api.scene(
      "kb_salatrono", "voce",
      `<b>👑 I Capitoli di Kronenburg</b><br>La saga tattica e investigativa in 4 capitoli completi. Scelte morali, deduzioni e l'Occhio di Geass determinano il destino del trono.<br><br><span style="color:var(--dim)">Seleziona un capitolo sbloccato per entrarvi:</span>`,
      opts,
      "Kronenburg · Capitoli"
    );
  }

  function resetConfirm() {
    api.scene(
      "kb_corte", "voce",
      "<b>Ricominciare la Saga di Kronenburg?</b><br>I progressi del capitolo 1, gli indizi raccolti e il taccuino verranno azzerati. Le monete e gli accessori già riscattati rimarranno nel tuo guardaroba.",
      [
        { label: "Sì, azzera e ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
        { label: "◂ Annulla", fn: chaptersList }
      ],
      "Kronenburg"
    );
  }

  // ------------------------------------------------------------------ Pulsante Esci e Avvio
  function setupExitButton() {
    const existing = document.getElementById("kbExit");
    if (existing) return;
    const st = document.createElement("style");
    st.textContent = `
      #kbExit {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 36px; padding: 6px 14px; border-radius: 10px;
        border: 1px solid rgba(239, 68, 68, 0.6); background: rgba(15, 23, 42, 0.88);
        color: #fecaca; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6); cursor: pointer;
      }
      #kbExit.on { display: block; }
      #kbExit:active { transform: translateY(1px); }
    `;
    document.head.appendChild(st);

    const btn = document.createElement("button");
    btn.id = "kbExit"; btn.type = "button";
    btn.textContent = "✕ Esci da Kronenburg";
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
    CAST_Q.splice(0).forEach(([id, c, bio]) => { if (a.CAST && !a.CAST[id]) a.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c); if (bio && a.BIO && !a.BIO[id]) a.BIO[id] = bio; });
    COS_Q.splice(0).forEach(([id, d]) => { if (a.COSM && !a.COSM[id]) a.COSM[id] = d; });
    installHooks();
    PENDING.splice(0).forEach(registerChapterZones);
    setupExitButton();
  }

  // Esportazione Globale dell'API
  window.__kronenburgStory = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "👑 Kronenburg · Il Patto delle Tre Corone",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Occhio di Geass e intrigo feudale"}`
          : "Crea prima il tuo campione · Saga investigativa con Occhio di Geass"
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
