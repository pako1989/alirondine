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
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.09 + 0.35);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.09); osc.stop(now + i * 0.09 + 0.35);
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

  const BGS = {
    kb_corte: bgKronenburgCorte,
    kb_biblioteca: bgKronenburgBiblioteca,
    kb_arena: bgKronenburgArena
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
  const FLOORS = ',pc:wy';
  const SOLID = 'ABSTblnFkWx^><duvqmJP';
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

    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} (Erede del Sigillo)<br><span style="color:var(--dim)">Tiro Risvegliato: «${esc(h.shotName || "Il Tiro della Corona")}»</span><br><br><b>Codice delle Sentenze & Prove</b><br>${cluesRows}<br><br><span style="color:var(--dim)">Vittorie in Arena: ${m.wins} · Sconfitte: ${m.losses}</span>`;

    if (inZone) {
      api.trAsk("voce", html, [{ label: "◂ Torna a esplorare", fn: done }], bgNow());
    } else {
      api.scene(bgNow(), "voce", html, [{ label: "◂ Indietro", fn: back }], "Kronenburg · Il Codice");
    }
  }

  // ------------------------------------------------------------------ Partita Tattica Narrativa
  let inMatch = false;
  function playMatch(o) {
    castHero(); inMatch = true;
    api.match({
      id: o.id, chap: o.chap, intro: T(o.intro), mate: o.mate || "Celia", mateGeneric: true,
      us: o.us || "I Corvi Ribelli", min: o.min || 45, team: o.team, hero: undefined,
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
          ["kb_celia", "Hai sconfitto i campioni di Malakar sull'ossidiana e scosso le fondamenta di Kronenburg. Ma Malakar non accetterà la sconfitta così facilmente... Il Capitolo 2 ci porterà nel cuore della sua Sala del Trono."],
        ], done);
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
    const c = activeChapter(), m = mem(), allDone = c && m.done[c.n];

    api.scene(
      "kb_corte", "voce",
      `<b>👑 Kronenburg · Il Patto delle Tre Corone</b><br>${esc(h.name)} · n. ${esc(h.num)} (Erede del Sigillo)<br><span style="color:var(--dim)">«${esc(h.shotName || "Il Tiro della Corona")}»</span><br><br><span style="color:#f87171">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}</span><br><span style="color:var(--dim)">${allDone ? "Capitolo 1 concluso con successo! Il prossimo capitolo ti attende." : esc(goalNow())}</span>`,
      [
        {
          label: allDone ? "Esplora Kronenburg" : c && !m.intro["ch" + c.n] ? "Inizia il Capitolo 1" : "Continua la Storia",
          sub: c ? `Capitolo ${c.n} · ${c.title}` : "",
          cls: "hot",
          fn: continueStory
        },
        { label: "Codice delle Sentenze", sub: `Prove ${m.clues.length} · Indagini di ${h.name}`, fn: () => notebook(openMain, false) },
        { label: "Capitoli della Saga", sub: "I capitoli e i finali raggiunti", fn: chaptersList },
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
      "kb_arena", "voce",
      `<b>I Capitoli di Kronenburg</b><br>${rows.join("<br>")}<br><br><span style="color:var(--dim)">Le scelte morali e l'uso dell'Occhio di Geass determinano il destino del trono.</span>`,
      [
        { label: "Ricomincia da Capo", sub: "Azzera scelte e indagini (monete e oggetti restano tuoi)", fn: resetConfirm },
        { label: "◂ Indietro", fn: openMain }
      ],
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
