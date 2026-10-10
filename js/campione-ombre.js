// ============================================================================
// IL CIRCUITO DELLE OMBRE · L'ATOLLO DELLA FALESIA CIECA
// Saga Urbana, Noir Notturno & Tattica Clandestina per il Tuo Campione
// Ispirata a Blade Runner, Fight Club Clandestino, Deus Ex e Blue Lock
// Motore 2D Camminabile HD con Visore delle Ombre, Calcio di Precisione Ambientale e Partite nella Gabbia
// ============================================================================
(function () {
  "use strict";

  if (window.__campioneOmbreLoaded) return;
  window.__campioneOmbreLoaded = true;

  const KEY = "ali-di-rondine.campione-ombre";
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
  const rnd = (tx, ty, k) => hash(tx * 83 + ty * 139 + k * 29) / 4294967296;

  // ------------------------------------------------------------------ Audio Synthesizer Noir & Cyber-Ombra
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  // Scanner Visore delle Ombre: impulso sub-bass e risonanza ciano
  function sfxShadowScan() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.55);
      g.gain.setValueAtTime(0.01, now);
      g.gain.linearRampToValueAtTime(0.4, now + 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.6);

      // Sovratono metallico ciano
      const osc2 = ctx.createOscillator(), g2 = ctx.createGain();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(640, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(1280, now + 0.25);
      g2.gain.setValueAtTime(0.12, now + 0.08);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc2.connect(g2); g2.connect(ctx.destination);
      osc2.start(now + 0.08); osc2.stop(now + 0.4);
    } catch (e) {}
  }

  // Ronzio e accensione neon notturno
  function sfxNeonFlicker() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [120, 240, 480].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        g.gain.setValueAtTime(0.08, now + idx * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + idx * 0.06); osc.stop(now + idx * 0.06 + 0.18);
      });
    } catch (e) {}
  }

  // Terminal hack: beep di decifrazione dati
  function sfxTerminalHack() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [880, 1174, 1480, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        g.gain.setValueAtTime(0.2, now + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.05 + 0.12);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.05); osc.stop(now + i * 0.05 + 0.12);
      });
    } catch (e) {}
  }

  // Impatto balistico metallico sulla grata
  function sfxMetalImpact() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);
      g.gain.setValueAtTime(0.65, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Fanfara noir ritrovamento dossier o indizio segreto
  function sfxClueFound() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [392, 466.16, 523.25, 698.46].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        g.gain.setValueAtTime(0.3, now + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.09 + 0.45);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.09); osc.stop(now + i * 0.09 + 0.45);
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
      if (api && api.trToast) api.trToast(`🕵️ Fascicolo Ombre: ${name}`);
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
    saetta: "una folgore nera che penetra i riflettori ciechi della gabbia",
    serpentina: "un fendente d'ombra a zig-zag che disorienta i sensori biometrici",
    parabola: "un arco silenzioso a spiovere oltre i reticolati metallici",
    martello: "una bordata d'acciaio che fa tremare le travi della darsena",
    traversa: "un rimbalzo al millimetro tra le grate bagnate di pioggia",
    saudade: "una traiettoria nostalgica che scivola sul vapore della notte",
    muro: "una chiusura implacabile che annienta ogni contropiede del sindacato"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "TIRO DELLE OMBRE", shot: "saetta" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "TIRO DELLE OMBRE")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un tiro leggendario che squarcia le tenebre");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "ombra", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye || "#38bdf8",
      bg: ["#090d16", "#1e293b"], shirt: "#0f172a", num: String(h.num), acc: h.acc,
      cap: h.acc === "cappellino" ? "#0f172a" : h.acc === "berretto" ? "#1e293b" : undefined
    };
  }

  const coinsGive = (n) => {
    if (n > 0 && typeof window.addCoins === "function") {
      try { window.addCoins(n); return n; } catch (e) { return 0; }
    }
    return 0;
  };
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

  // ------------------------------------------------------------------ Effetto Visore delle Ombre (Shadow Visor Scan)
  let shadowVisorActive = false;
  let shadowVisorAlpha = 0;

  function triggerShadowVisorVisualFx(onFinish) {
    shadowVisorActive = true;
    shadowVisorAlpha = 1.0;
    sfxShadowScan();
    setTimeout(() => { sfxTerminalHack(); }, 180);
    const checkInterval = setInterval(() => {
      shadowVisorAlpha -= 0.05;
      if (shadowVisorAlpha <= 0) {
        shadowVisorAlpha = 0;
        shadowVisorActive = false;
        clearInterval(checkInterval);
        if (typeof onFinish === "function") onFinish();
      }
    }, 32);
  }

  function drawShadowOverlay(g, W, H) {
    if (!shadowVisorActive && shadowVisorAlpha <= 0) return;
    g.save();
    // Tinta termica ciano-viola cyberpunk
    const gr = g.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, Math.max(W, H));
    gr.addColorStop(0, `rgba(56, 189, 248, ${shadowVisorAlpha * 0.35})`);
    gr.addColorStop(0.6, `rgba(168, 85, 247, ${shadowVisorAlpha * 0.5})`);
    gr.addColorStop(1, `rgba(15, 23, 42, ${shadowVisorAlpha * 0.8})`);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);

    // Scanlines orizzontali
    g.fillStyle = `rgba(0, 0, 0, ${shadowVisorAlpha * 0.4})`;
    for (let y = 0; y < H; y += 3) {
      g.fillRect(0, y, W, 1);
    }

    // Reticolo di puntamento balistico
    const cx = W / 2, cy = H / 2;
    g.save();
    g.strokeStyle = `rgba(56, 189, 248, ${shadowVisorAlpha * 0.9})`;
    g.lineWidth = 1.5;

    // Mirino circolare con notch
    g.beginPath();
    g.arc(cx, cy, 32, 0, Math.PI * 2);
    g.stroke();

    g.beginPath();
    g.moveTo(cx - 44, cy); g.lineTo(cx - 20, cy);
    g.moveTo(cx + 20, cy); g.lineTo(cx + 44, cy);
    g.moveTo(cx, cy - 44); g.lineTo(cx, cy - 20);
    g.moveTo(cx, cy + 20); g.lineTo(cx, cy + 44);
    g.stroke();

    // Dati telemetrici HUD
    g.fillStyle = `rgba(56, 189, 248, ${shadowVisorAlpha * 0.95})`;
    g.font = "8px monospace";
    g.fillText("SYS: SHADOW_SCAN [ONLINE]", 10, 16);
    g.fillText("FREQ: 844.2 MHz · SENSOR: CALIBRATED", 10, 26);
    g.fillText("TARGET LOCK: 98.4%", W - 110, 16);

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

  // Sfondo 1: La Darsena del Molo Nero a Mezzanotte
  function bgDarsenaNotte(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#050811", "#0b1329", "#111c38"]);

    // Sagoma della Fortezza San Giuda sugli scogli a picco in lontananza
    g.fillStyle = "#03060c";
    g.beginPath();
    g.moveTo(20, 100); g.lineTo(35, 60); g.lineTo(80, 50); g.lineTo(110, 75); g.lineTo(130, 100);
    g.closePath(); g.fill();
    R(g, 72, 42, 12, 10, "#08101e");
    const lBeam = (Math.sin(f * 0.04) * 0.5 + 0.5);
    glow(g, 78, 47, 24, "56,189,248", 0.6 * lBeam);
    g.fillStyle = "#bae6fd"; g.fillRect(77, 46, 2, 2);

    // Gru industriali portuali
    [160, 260].forEach((gx, idx) => {
      g.strokeStyle = "#08101d";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(gx, 115); g.lineTo(gx + 12, 60); g.lineTo(gx + 24, 115);
      g.moveTo(gx - 16, 60); g.lineTo(gx + 44, 52);
      g.stroke();
      const fl = Math.sin(f * 0.1 + idx) > 0 ? 0.9 : 0.2;
      glow(g, gx + 44, 52, 6, "239,68,68", fl);
    });

    // Mare nero increspato con riflessi d'olio
    grad(g, 0, 115, W, 85, ["#020814", "#061324", "#030a16"]);
    for (let i = 0; i < 12; i++) {
      const rx = (i * 35 + f * 0.5) % (W + 50) - 25;
      const ry = 125 + (i % 4) * 14;
      g.fillStyle = i % 2 === 0 ? "rgba(56, 189, 248, 0.25)" : "rgba(168, 85, 247, 0.2)";
      g.fillRect(rx, ry, 26, 1);
    }

    // Peschereccio nero "Nadir"
    R(g, 15, 122, 54, 16, "#0a0a10");
    R(g, 25, 112, 22, 10, "#16161f");
    R(g, 34, 102, 3, 10, "#27272a");
    g.fillStyle = "rgba(148, 163, 184, 0.25)";
    for (let i = 0; i < 3; i++) {
      g.beginPath(); g.arc(35 + Math.sin(f * 0.05 + i) * 6, 95 - i * 8, 4 + i * 2, 0, Math.PI * 2); g.fill();
    }

    // Molo d'attracco con cemento bagnato
    R(g, 0, 152, W, 48, "#0f172a");
    R(g, 0, 152, W, 2, "#38bdf8");
    for (let x = 0; x < W; x += 28) {
      R(g, x, 154, 1, 46, "#090d16");
    }
    [50, 275].forEach((bx) => {
      R(g, bx - 2, 140, 4, 14, "#334155");
      glow(g, bx, 138, 20, "250,204,21", 0.75);
      R(g, bx - 1, 136, 2, 4, "#fef08a");
    });

    // Pioggia sottile
    g.strokeStyle = "rgba(186, 230, 253, 0.35)";
    g.lineWidth = 1;
    for (let i = 0; i < 28; i++) {
      const rx = (i * 21 + f * 4) % W;
      const ry = (i * 17 + f * 7) % H;
      g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 3, ry + 9); g.stroke();
    }
  }

  // Sfondo 2: I Cunicoli Idraulici
  function bgCunicoliNotte(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#06080e", "#0e1520", "#080c14"]);
    for (let y = 10; y < 140; y += 14) {
      const off = (y % 28 === 0) ? 0 : 12;
      for (let x = 0; x < W; x += 24) {
        g.strokeStyle = "#04060a";
        g.lineWidth = 1;
        g.strokeRect(x + off, y, 24, 14);
      }
    }
    R(g, 0, 35, W, 10, "#1e293b");
    R(g, 0, 37, W, 2, "#475569");
    R(g, 110, 20, 12, 120, "#1e293b");
    R(g, 112, 20, 2, 120, "#475569");

    glow(g, 210, 50, 28, "239,68,68", 0.7 + Math.sin(f * 0.1) * 0.2);
    R(g, 208, 48, 4, 6, "#fca5a5");

    R(g, 40, 80, 48, 34, "#020617");
    R(g, 42, 82, 44, 30, "#052e16");
    g.fillStyle = "#22c55e";
    g.font = "6px monospace";
    g.fillText("> CHIMERA_SYS", 44, 92);
    g.fillText("> BYPASS: OK", 44, 100);
    glow(g, 64, 97, 24, "34,197,94", 0.4);

    R(g, 0, 145, W, 55, "#0b1120");
    g.strokeStyle = "#1e293b";
    for (let x = 0; x < W; x += 8) {
      g.beginPath(); g.moveTo(x, 145); g.lineTo(x, 200); g.stroke();
    }
    R(g, 0, 160, W, 4, "rgba(56, 189, 248, 0.25)");
  }

  // Sfondo 3: La Gabbia delle Onde (Arena Clandestina)
  function bgGabbiaOnde(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#020617", "#0f172a", "#1e1b4b"]);
    g.fillStyle = "#050814";
    g.beginPath();
    g.moveTo(0, 130); g.lineTo(60, 95); g.lineTo(160, 90); g.lineTo(260, 95); g.lineTo(W, 130);
    g.lineTo(W, 200); g.lineTo(0, 200);
    g.closePath(); g.fill();

    g.fillStyle = "rgba(224, 242, 254, 0.45)";
    for (let i = 0; i < 7; i++) {
      const sx = (i * 50 + f * 0.7) % (W + 60) - 30;
      const sy = 120 + Math.sin(f * 0.08 + i) * 6;
      g.beginPath(); g.arc(sx, sy, 16, 0, Math.PI * 2); g.fill();
    }

    [30, 90, 230, 290].forEach((rx, idx) => {
      R(g, rx - 3, 40, 6, 85, "#1e293b");
      R(g, rx - 6, 36, 12, 8, "#334155");
      const lightCol = idx % 2 === 0 ? "56,189,248" : "250,204,21";
      glow(g, rx, 40, 36, lightCol, 0.75 + Math.sin(f * 0.05 + idx) * 0.15);
      R(g, rx - 2, 38, 4, 4, "#ffffff");
      g.fillStyle = `rgba(${lightCol}, 0.18)`;
      g.beginPath();
      g.moveTo(rx, 42); g.lineTo(rx - 45, 175); g.lineTo(rx + 45, 175);
      g.closePath(); g.fill();
    });

    R(g, 20, 125, W - 40, 75, "#0b2545");
    g.strokeStyle = "rgba(56, 189, 248, 0.85)";
    g.lineWidth = 1.5;
    g.strokeRect(30, 135, W - 60, 60);
    g.beginPath(); g.arc(W / 2, 165, 20, 0, Math.PI * 2); g.stroke();

    g.strokeStyle = "rgba(148, 163, 184, 0.3)";
    g.lineWidth = 1;
    for (let x = 20; x <= W - 20; x += 12) {
      g.beginPath(); g.moveTo(x, 105); g.lineTo(x, 195); g.stroke();
    }
  }

  // Sfondo 4: I Magazzini Blindati & Hangar dei Droni (Capitolo 2)
  function bgMagazziniLaser(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#02040a", "#0b1324", "#030712"]);
    // Scaffali industriali colossali
    for (let x = 15; x < W; x += 65) {
      R(g, x, 20, 48, 110, "#090f1d");
      for (let y = 30; y < 120; y += 22) {
        R(g, x, y, 48, 2, "#1e293b");
        R(g, x + 6, y - 14, 16, 12, (x + y) % 2 === 0 ? "#0284c7" : "#b91c1c");
        R(g, x + 26, y - 14, 16, 12, "#334155");
      }
    }
    // Barriere laser orizzontali pulsanti
    const lAlpha = Math.sin(f * 0.1) * 0.35 + 0.65;
    g.strokeStyle = `rgba(239, 68, 68, ${lAlpha})`;
    g.lineWidth = 2;
    [55, 95].forEach((ly) => {
      g.beginPath(); g.moveTo(0, ly); g.lineTo(W, ly); g.stroke();
      glow(g, 160, ly, 20, "239,68,68", lAlpha * 0.5);
    });

    // Pavimento industriale diamantato
    R(g, 0, 140, W, 60, "#080e1a");
    g.strokeStyle = "#1e293b";
    for (let x = 0; x < W; x += 18) {
      g.beginPath(); g.moveTo(x, 140); g.lineTo(x + 10, 200); g.stroke();
    }
    // Droni in sorveglianza
    const dx = (120 + Math.sin(f * 0.05) * 80);
    R(g, dx - 8, 38, 16, 6, "#1e293b");
    glow(g, dx, 42, 10, "56,189,248", 0.8);
  }

  // Sfondo 5: La Suite Panoramica della Lanterna Nera (Capitolo 3)
  function bgSuiteTempesta(g, W, H, f) {
    // Vetrate panoramiche a tutto sesto con pioggia e fulmini
    grad(g, 0, 0, W, 120, ["#030712", "#0f172a", "#1e1b4b"]);
    // Fulmine occasionale
    if ((f % 160) > 155) {
      g.fillStyle = "rgba(255, 255, 255, 0.45)";
      g.fillRect(0, 0, W, 120);
    }
    // Montanti delle vetrate
    g.strokeStyle = "#334155";
    g.lineWidth = 3;
    for (let x = 0; x <= W; x += 55) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 120); g.stroke();
    }
    g.beginPath(); g.moveTo(0, 70); g.lineTo(W, 70); g.stroke();

    // Salone lussuoso
    R(g, 0, 120, W, 80, "#1c1917");
    // Tappeto rosso scuro centrale
    R(g, 40, 135, W - 80, 60, "#7f1d1d");
    // Tavolo di cristallo con ologrammi finanziari
    R(g, 100, 145, 120, 24, "rgba(56, 189, 248, 0.25)");
    R(g, 100, 145, 120, 2, "#38bdf8");
    glow(g, 160, 145, 30, "56,189,248", 0.5);

    // Camino a bioetanolo
    R(g, 15, 130, 22, 28, "#09090b");
    glow(g, 26, 144, 18, "249,115,22", 0.8 + Math.sin(f * 0.15) * 0.2);
  }

  // Sfondo 6: Il Tetto Supremo della Falesia Cieca (Capitolo 4 Finale)
  function bgTettoSupremo(g, W, H, f) {
    // Cielo tempestoso epico a 360°
    grad(g, 0, 0, W, H, ["#020408", "#0b1120", "#1e1138"]);
    // Faro della fortezza che spazza il cielo
    const beamAngle = f * 0.03;
    const bx = 160, by = 40;
    g.save();
    g.fillStyle = "rgba(56, 189, 248, 0.22)";
    g.beginPath();
    g.moveTo(bx, by);
    g.arc(bx, by, 180, beamAngle - 0.25, beamAngle + 0.25);
    g.closePath(); g.fill();
    g.restore();

    // Elicottero di Madame V in stazionamento a sinistra
    const ex = 55, ey = 35 + Math.sin(f * 0.1) * 3;
    R(g, ex - 12, ey, 24, 10, "#09090b");
    R(g, ex + 10, ey + 2, 14, 4, "#18181b");
    // Rotore in movimento
    g.strokeStyle = "rgba(224, 242, 254, 0.55)";
    g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(ex - 22, ey - 2); g.lineTo(ex + 22, ey - 2); g.stroke();
    glow(g, ex + 10, ey + 4, 6, "239,68,68", 0.8);

    // Muro d'acciaio del tetto
    R(g, 10, 110, W - 20, 85, "#0a192f");
    g.strokeStyle = "rgba(56, 189, 248, 0.85)";
    g.lineWidth = 2;
    g.strokeRect(20, 120, W - 40, 70);
    g.beginPath(); g.arc(W / 2, 155, 24, 0, Math.PI * 2); g.stroke();
  }

  const BGS = {
    omb_darsena_notte: bgDarsenaNotte,
    omb_cunicoli_sotterranei: bgCunicoliNotte,
    omb_arena_gabbia: bgGabbiaOnde,
    omb_magazzini_laser: bgMagazziniLaser,
    omb_suite_tempesta: bgSuiteTempesta,
    omb_tetto_supremo: bgTettoSupremo
  };

  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) {
      safe(() => BGS[kind](g, W || 320, H || 200, frame || 0));
      if (shadowVisorActive || shadowVisorAlpha > 0) {
        drawShadowOverlay(g, W || 320, H || 200);
      }
      return true;
    }
    const res = typeof prevBg === "function" ? prevBg.apply(this, arguments) : false;
    if (shadowVisorActive || shadowVisorAlpha > 0) {
      drawShadowOverlay(g, W || 320, H || 200);
    }
    return res;
  };

  // ------------------------------------------------------------------ Tessere 16x16 (Pixel Art Urbana Notturna)
  const FLOORS = '_=.~y';
  const SOLID = 'MCGRPTXBbLSHWE><^d';
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);

  const ZX = { map: null, under: null, id: "", cvs: null };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "M";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || "_";

  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const frNow = () => Math.floor(performance.now() / 16);

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 1);
    if (f === "_") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0b121e" : "#0f172a");
      if (r < 0.25) P(sx + 4, sy + 6, 6, 2, "rgba(56, 189, 248, 0.35)");
    } else if (f === "=") {
      P(sx, sy, 16, 16, "#090d16");
      P(sx, sy + 3, 16, 1, "#334155");
      P(sx, sy + 7, 16, 1, "#334155");
      P(sx, sy + 11, 16, 1, "#334155");
      P(sx, sy + 15, 16, 1, "#334155");
      for (let i = 0; i < 16; i += 4) P(sx + i, sy, 1, 16, "#1e293b");
    } else if (f === ".") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#1e293b" : "#334155");
      P(sx, sy + 15, 16, 1, "#0f172a");
      P(sx + 15, sy, 1, 16, "#0f172a");
      if (r < 0.15) P(sx + 5, sy + 4, 3, 2, "#475569");
    } else if (f === "~") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#030712" : "#020b18");
      P(sx + 3, sy + 6, 8, 2, "rgba(56, 189, 248, 0.4)");
      if (r < 0.2) P(sx + 8, sy + 11, 4, 1, "rgba(168, 85, 247, 0.35)");
    } else if (f === "y") {
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0c2340" : "#0f2f56");
      if (tx % 6 === 0) P(sx, sy, 1, 16, "rgba(56, 189, 248, 0.3)");
      if (ty % 6 === 0) P(sx, sy, 16, 1, "rgba(56, 189, 248, 0.3)");
    }
  }

  const PAINT = {
    M(sx, sy, tx, ty) {
      P(sx, sy, 16, 16, "#090e17");
      P(sx, sy + 1, 16, 2, "#1e293b");
      P(sx, sy + 8, 16, 1, "#030712");
      P(sx + 3, sy + 4, 2, 2, "#334155");
      P(sx + 11, sy + 11, 2, 2, "#334155");
    },
    C(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      const col = (tx % 2 === 0) ? "#0284c7" : "#b91c1c";
      const colD = (tx % 2 === 0) ? "#0369a1" : "#991b1b";
      P(sx + 1, sy + 1, 14, 14, col);
      for (let i = 3; i < 14; i += 3) P(sx + i, sy + 2, 1, 12, colD);
      P(sx + 1, sy + 14, 14, 1, "#0f172a");
    },
    G(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 2, sy + 3, 12, 12, "#1e293b");
      P(sx + 4, sy + 5, 8, 6, "#334155");
      const spark = (fr >> 3) % 2 === 0 ? "#38bdf8" : "#facc15";
      P(sx + 7, sy + 7, 2, 2, spark);
      P(sx + 3, sy + 13, 10, 2, "#0f172a");
    },
    R(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 6, sy + 6, 4, 10, "#334155");
      P(sx + 4, sy + 2, 8, 5, "#475569");
      const fl = Math.sin(fr / 8 + tx * 2) * 1.5;
      GP.fillStyle = "#ffd23f";
      GP.beginPath(); GP.arc(sx + 8, sy + 4, 3 + fl * 0.2, 0, 7); GP.fill();
      P(sx + 7, sy + 3, 2, 2, "#ffffff");
    },
    P(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 1, sy + 1, 14, 14, "#1e293b");
      P(sx + 2, sy + 3, 12, 1, "#ef4444");
      P(sx + 2, sy + 7, 12, 1, "#334155");
      P(sx + 2, sy + 11, 12, 1, "#334155");
      P(sx + 7, sy + 8, 2, 3, "#facc15");
    },
    T(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 2, sy + 4, 12, 11, "#090d16");
      P(sx + 3, sy + 5, 10, 6, "#052e16");
      const blink = (fr >> 4) % 2 === 0 ? "#22c55e" : "#4ade80";
      P(sx + 5, sy + 7, 6, 2, blink);
      P(sx + 4, sy + 12, 8, 2, "#1e293b");
    },
    X(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 2, sy + 3, 12, 11, "#1e293b");
      P(sx + 4, sy + 5, 8, 7, "#0f172a");
      P(sx + 7, sy + 7, 2, 3, "#facc15");
      P(sx + 2, sy + 3, 12, 1, "#475569");
    },
    B(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 5, sy + 4, 6, 9, "#334155");
      P(sx + 4, sy + 3, 8, 3, "#475569");
      P(sx + 2, sy + 11, 12, 2, "#d97706");
    },
    b(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      P(sx + 3, sy + 2, 10, 12, "#1e293b");
      P(sx + 2, sy + 4, 12, 8, "#334155");
      P(sx + 2, sy + 6, 12, 1, "#ef4444");
      P(sx + 2, sy + 10, 12, 1, "#ef4444");
    },
    L(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Barriera laser
      P(sx, sy + 7, 16, 2, (fr >> 3) % 2 === 0 ? "#ef4444" : "#f87171");
      P(sx + 2, sy + 4, 2, 8, "#334155");
      P(sx + 12, sy + 4, 2, 8, "#334155");
    },
    S(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Server rack
      P(sx + 2, sy + 1, 12, 14, "#0f172a");
      P(sx + 3, sy + 3, 10, 3, "#1e293b");
      P(sx + 3, sy + 7, 10, 3, "#1e293b");
      const sCol = (fr >> 4) % 2 === 0 ? "#38bdf8" : "#22c55e";
      P(sx + 10, sy + 4, 2, 1, sCol);
      P(sx + 10, sy + 8, 2, 1, sCol);
    },
    H(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Cella criogenica
      P(sx + 3, sy + 1, 10, 14, "#1e293b");
      P(sx + 4, sy + 3, 8, 10, "rgba(56, 189, 248, 0.45)");
    },
    W(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Vetrata
      P(sx + 1, sy + 1, 14, 14, "#1e293b");
      P(sx + 2, sy + 2, 12, 12, "rgba(14, 165, 233, 0.35)");
    },
    E(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Elicottero
      P(sx + 1, sy + 4, 14, 8, "#09090b");
      P(sx + 4, sy + 2, 8, 2, "#cbd5e1");
    },
    ">": (sx, sy) => passTile(sx, sy, ">"),
    "<": (sx, sy) => passTile(sx, sy, "<"),
    "^": (sx, sy) => passTile(sx, sy, "^"),
    "d": (sx, sy) => passTile(sx, sy, "d")
  };

  function passTile(sx, sy, dir) {
    P(sx + 2, sy + 2, 12, 12, "#090d16");
    P(sx + 3, sy + 4, 10, 8, "#1e293b");
    GP.fillStyle = "#38bdf8";
    GP.beginPath();
    if (dir === ">") { GP.moveTo(sx + 6, sy + 5); GP.lineTo(sx + 11, sy + 8); GP.lineTo(sx + 6, sy + 11); }
    else if (dir === "<") { GP.moveTo(sx + 10, sy + 5); GP.lineTo(sx + 5, sy + 8); GP.lineTo(sx + 10, sy + 11); }
    else if (dir === "^") { GP.moveTo(sx + 5, sy + 10); GP.lineTo(sx + 8, sy + 5); GP.lineTo(sx + 11, sy + 10); }
    else { GP.moveTo(sx + 5, sy + 6); GP.lineTo(sx + 8, sy + 11); GP.lineTo(sx + 11, sy + 6); }
    GP.fill();
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
    const m = ZX.map, u = Array.from({ length: h }, () => Array(w).fill("_"));
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
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "omb_darsena_notte";

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

  const CAST_OK = (id) => !!(api && api.CAST && api.CAST[id]);

  function say(lines, then) {
    if (!Array.isArray(lines) || !lines.length) { if (typeof then === "function") then(); return; }
    castHero();
    const pl = lines.map(([who, text]) => {
      const sp = who === "hero" ? "hero" : who;
      return api.L(sp, T(text), "night");
    });
    api.play(pl, then);
  }

  function ask(who, text, buttons) {
    castHero();
    const opts = (buttons || []).map((b) => ({
      label: b.label,
      sub: b.sub,
      cls: b.cls,
      fn: b.fn
    }));
    api.trAsk(who === "hero" ? "hero" : who, T(text), opts, bgNow());
  }

  const done = () => { refreshZone(); if (api && api.trDone) api.trDone(); };
  const go = (zid, tx, ty) => {
    castHero();
    if (api && api.trGo) {
      api.trGo(zid, tx, ty);
      setTimeout(() => safe(refreshZone), 0);
    }
  };

  function reward(key, o) {
    const m = mem();
    if (m.rew[key]) return "";
    m.rew[key] = 1; save();
    const bits = [];
    if (o.coins) { const c = coinsGive(o.coins); if (c) bits.push(`🪙 +${c} Monete`); }
    if (o.cos && api && api.trUnlockCos) { api.trUnlockCos(o.cos); bits.push("✨ Nuovo Costume Sbloccato"); }
    if (o.note) note(o.note);
    return bits.join(" · ");
  }

  // ------------------------------------------------------------------ Registrazione Zone TRZ
  function registerZone(chN, zid, spec) {
    const Z = {
      name: spec.name,
      short: spec.short || spec.name,
      sub: spec.sub || "",
      w: spec.w,
      h: spec.h,
      start: spec.start || [2, 2],
      theme: spec.theme || "torino",
      bg: spec.bg || "omb_darsena_notte",
      areas: spec.areas || [],
      act: spec.act || {},
      items: spec.items || [],
      npcs: [],
      hints: {}
    };

    if (spec.item) {
      Z.item = spec.item[0];
      Z.itemsName = spec.item[1] || spec.item[0];
      Z.itemCount = () => (spec.items || []).length;
      Z.itemLeft = () => (spec.items || []).filter(([x, y]) => !F.is(`${zid}_it_${x}_${y}`)).length;
      Z.itemPick = (x, y) => {
        const k = `${zid}_it_${x}_${y}`;
        if (F.is(k)) return false;
        F.set(k, 1);
        coinsGive(5);
        sfxTerminalHack();
        if (api && api.trToast) api.trToast(`+1 ${spec.item[0]}`);
        if (spec.itemCos && Z.itemLeft() === 0) {
          reward(`cos_${zid}`, { cos: spec.itemCos, coins: 25, note: `Raccolti tutti gli indizi di ${spec.name}` });
        }
        return true;
      };
      Z.itemDraw = (g, x, y) => {
        g.fillStyle = "#38bdf8";
        g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#ffffff"; g.fillRect(x - 1, y - 1, 2, 2);
      };
    }

    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: Fascicolo Ombre ed Esci." });

    Z.build = function (m) {
      ZX.map = m; ZX.id = zid; GP = document.getElementById("cv").getContext("2d");
      const Ls = makeLayers(spec.w, spec.h);
      Ls.lay(0, 0, spec.w - 1, spec.h - 1, "_");
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
      if (shadowVisorActive || shadowVisorAlpha > 0) {
        const cv = document.getElementById("cv");
        if (cv) drawShadowOverlay(cv.getContext("2d"), cv.width, cv.height);
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

  // ------------------------------------------------------------------ Menu & Fascicolo delle Ombre
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
      `<b>Il Circuito delle Ombre</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Monete ${bal()} · Dossier Segreti ${mem().clues.length}${h ? " · " + esc(h.name) : ""}</span>`,
      [
        { label: "📁 Fascicolo Ombre & Indagini", sub: "Dossier biometrici, indizi della Lanterna Nera e microchip", cls: "hot", fn: () => notebook(zoneMenu, true) },
        { label: "📜 I Capitoli della Saga (1-4)", sub: "Visualizza i capitoli completati e riparti", fn: chaptersList },
        { label: "Esci dalla Fortezza", sub: "I progressi dell'infiltrazione restano salvati", cls: "hot", fn: leave }
      ],
      bgNow()
    );
  }

  function notebook(back, inZone) {
    const m = mem(), h = hero() || { name: "Campione", num: 9, shotName: "", shot: "saetta" };
    const clueRows = m.clues.map((c) => {
      const parts = c.split(":::");
      return `• <b>${esc(parts[1] || "Dossier")}</b>: <span style="color:var(--dim)">${esc(parts[2] || "")}</span>`;
    }).join("<br>") || "<span style='color:var(--dim)'>Nessun dossier ancora intercettato. Usa il Visore delle Ombre e colpisci i quadri elettrici col pallone.</span>";

    const cTact = F.get("tattica_gabbia") === "potenza"
      ? "Sfondamento Fisico Balistico (Resistenza diretta al muro d'acciaio di Zoran)"
      : F.get("tattica_gabbia") === "angoli"
        ? "Traiettoria a Spiovere ad Effetto (Tiro radente nei coni d'ombra del portiere)"
        : "In corso di pianificazione";

    const cCh2 = F.get("scelta_ch2") === "sabotaggio"
      ? "Sabotaggio Criogenico Server"
      : F.get("scelta_ch2") === "telemetria"
        ? "Salvataggio Telemetrie Atleti"
        : "In attesa";

    const cEnd = F.get("finale_ombre") || "In corso";

    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} (Infiltrato alla Lanterna Nera)<br><span style="color:var(--dim)">Tiro Clandestino: «${esc(h.shotName || "Il Tiro delle Ombre")}»</span><br><br><b>Fascicolo & Dossier Intercettati</b><br>${clueRows}<br><br><b>Scelte Tattiche & Codice Morale</b><br>• <b>Tattica nella Gabbia (Cap. 1):</b> <span style="color:var(--dim)">${cTact}</span><br>• <b>Dilemma dei Server (Cap. 2):</b> <span style="color:var(--dim)">${cCh2}</span><br>• <b>Epilogo Finale (Cap. 4):</b> <span style="color:var(--dim)">${cEnd}</span><br><br><span style="color:var(--dim)">Vittorie nella Gabbia: ${m.wins} · Sconfitte: ${m.losses}</span>`;

    if (inZone) {
      api.trAsk("voce", html, [{ label: "◂ Torna all'Infiltrazione", fn: done }], bgNow());
    } else {
      api.scene(bgNow(), "voce", html, [{ label: "◂ Indietro", fn: back }], "Fascicolo delle Ombre");
    }
  }

  function chaptersList() {
    const m = mem(), rows = [];
    for (let n = 1; n <= 4; n++) {
      const c = CHAPTERS[n];
      if (c && (n === 1 || m.done[n - 1] || m.ch >= n)) {
        rows.push(`${m.done[n] ? "✓" : "▸"} <b>Capitolo ${n}</b> · ${esc(c.title)} <span style="color:var(--dim)">${esc(m.done[n] ? "completato" : c.sub || "")}</span>`);
      } else {
        rows.push(`<span style="color:var(--dim)">• Capitolo ${n} · Bloccato</span>`);
      }
    }
    api.scene(
      "omb_darsena_notte", "voce",
      `<b>I Capitoli del Circuito delle Ombre (4 Capitoli)</b><br>${rows.join("<br>")}<br><br><span style="color:var(--dim)">Le tue decisioni balistiche e morali determinano quale dei 4 epiloghi riscriverà il destino del calcio.</span>`,
      [
        { label: "Ricomincia da Capo", sub: "Azzera progressi (monete e cosmetici restano salvati)", fn: resetConfirm },
        { label: "◂ Indietro", fn: openMain }
      ],
      "Il Circuito delle Ombre"
    );
  }

  function resetConfirm() {
    api.scene(
      "omb_darsena_notte", "voce",
      "<b>Ricominciare la Saga delle Ombre?</b><br>Tutti i 4 capitoli e i dossier raccolti verranno azzerati. Le monete e i costumi sbloccati rimarranno nel tuo inventario.",
      [
        { label: "Sì, azzera e ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
        { label: "◂ Annulla", fn: chaptersList }
      ],
      "Il Circuito delle Ombre"
    );
  }

  // ------------------------------------------------------------------ Partita Narrativa nella Gabbia
  let inMatch = false;
  function playMatch(o) {
    castHero(); inMatch = true;
    api.match({
      id: o.id, chap: o.chap, intro: T(o.intro), mate: o.mate || "Milo", mateGeneric: true,
      us: o.us || "I Ribelli delle Ombre", min: o.min || 45, team: o.team, hero: undefined,
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
    reward, coinsGive, bal, hero, castHero, say, ask, done, go, playMatch, finishChapter,
    addClue, triggerShadowVisorVisualFx, sfxShadowScan, sfxNeonFlicker, sfxTerminalHack, sfxMetalImpact, sfxClueFound,
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
  // CAPITOLO 1 · L'APPRODO ALLA FALESIA CIECA & LA GABBIA DELLE ONDE
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addClue, triggerShadowVisorVisualFx, sfxShadowScan, sfxNeonFlicker, sfxTerminalHack, sfxMetalImpact } = X;
    const N = 1, S = () => X.stepOf(N);

    // Personaggi delle Ombre
    X.cast("omb_milo", {
      name: "Milo «La Volpe»", tag: "staffetta", hair: "#f97316", style: "messy", skin: "#fed7aa", eye: "#0284c7",
      cap: "#1e293b", bg: ["#0f172a", "#f97316"], shirt: "#334155"
    }, "Scugnizzo e staffetta dei moli sommersi dell'Atollo. Conosce ogni condotto d'aria e scarico d'olio della Lanterna Nera: «Nessuno entra o esce dalla Falesia senza che io lo sappia, forestiero!»");

    X.cast("omb_madame_v", {
      name: "Madame Vera", tag: "allibratrice", hair: "#090d16", style: "bun", skin: "#fae8ff", eye: "#a855f7",
      bg: ["#2e1065", "#7e22ce"], shirt: "#3b0764"
    }, "La potente padrona della Lanterna Nera. Spilla d'ossidiana al bavero, voce gelida e un impero di scommesse clandestine che muove capitali tra Singapore e Zurigo: «Qui il talento non si regala... si monetizza o si cancella.»");

    X.cast("omb_zoran", {
      name: "Zoran «Il Colosso»", tag: "portiere", hair: "#18181b", style: "buzz", skin: "#e4d4c8", eye: "#38bdf8",
      beard: true, bg: ["#1c1917", "#44403c"], shirt: "#292524"
    }, "Portiere monumentale dei Titani della Falesia. Mani come tenaglie e una cicatrice sull'arcata sopraccigliare. Schiavo dei contratti di Madame V per proteggere la libertà dei suoi vecchi marinai.");

    X.cast("omb_maya", {
      name: "Maya «La Sonda»", tag: "giornalista", hair: "#dc2626", style: "bob", skin: "#fef2f2", eye: "#10b981",
      glasses: true, bg: ["#064e3b", "#059669"], shirt: "#047857"
    }, "Reporter investigativa scandinava sotto copertura per 'Offside International'. Ha intercettato la frequenza del 'Progetto Chimera' e cerca la prova regina per smascherare il sindacato.");

    X.cast("omb_victor", {
      name: "Victor «Ombra Cieca»", tag: "sicurezza", hair: "#030712", style: "buzz", skin: "#cbd5e1", eye: "#ef4444",
      bg: ["#18181b", "#450a0a"], shirt: "#09090b"
    }, "Capo dei gorilla armati e della sorveglianza notturna con visore termico.");

    // Ricompensa cosmetica esclusiva Capitolo 1
    X.cos("omb_maschera_notte", { kind: "acc", label: "Visore Notturno delle Ombre & Cravatta Nera", val: "#38bdf8", from: "Completa il Capitolo 1 del Circuito delle Ombre" });

    const goal = (s) => ({
      0: "Parla con Milo «La Volpe» sul molo della Darsena per capire dove ti trovi.",
      1: "Attiva il Visore delle Ombre ed esamina il Quadro Comandi per aprire la grata dei cunicoli.",
      2: "Scendi nei Cunicoli della Lanterna Nera ed incontra Maya la giornalista investigativa.",
      3: "Calcia il pallone con precisione sul generatore elettrico per disattivare l'allarme biometrico.",
      4: "Sali alla Gabbia delle Onde: affronta Madame Vera e scegli la tattica contro Zoran.",
      5: "Scendi sul campo della Gabbia delle Onde e sconfiggi i Titani di Zoran!",
      6: "Capitolo 1 completato! Parla con Zoran per ricevere la chiave del Livello 2 e scoprire il segreto di Kaelen."
    }[s] || "Capitolo 1 concluso. Esplora i moli notturni e raccogli i microchip segreti.");

    const zones = {
      omb_darsena: {
        name: "Fortezza San Giuda · Darsena del Molo Nero", short: "Molo della Darsena", sub: "Nebbia, container industriali e riflettori alogeni",
        w: 40, h: 26, start: [19, 21], theme: "torino", bg: "omb_darsena_notte",
        item: ["Microchip Ombra", "Microchip"], itemCos: "omb_maschera_notte",
        items: [[3, 5], [36, 5], [10, 17], [29, 17]],
        areas: [
          [2, 2, 14, 10, "La Banchina del Nadir"],
          [26, 2, 38, 10, "La Saracinesca dei Magazzini"],
          [14, 1, 23, 6, "La Grata dei Cunicoli"],
          [12, 12, 28, 23, "Il Piazzale dei Container"]
        ],
        hints: () => ({
          "La Banchina del Nadir": "Il vecchio peschereccio galleggia nell'acqua nera. La saracinesca alle tue spalle è chiusa.",
          "La Saracinesca dei Magazzini": "Blindatura d'acciaio controllata a distanza dalle telecamere di Victor.",
          "La Grata dei Cunicoli": "Una pesante grata in ghisa arrugginita. Il lucchetto elettronico pulsa a frequenza ciano.",
          "Il Piazzale dei Container": "Container accatastati sotto la pioggia battente e pozzanghere oleose."
        }),
        act: {
          G: "Esamina il generatore", T: "Hakkera il terminale portuale",
          X: "Ispeziona la cassetta di sicurezza", B: "Guarda la bitta bagnata",
          "^": "Scendi nei Cunicoli", ">": "Sali alla Gabbia delle Onde"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "M");
          Ls.lay(0, 0, 1, 25, "M");
          Ls.lay(38, 0, 39, 25, "M");
          Ls.lay(0, 24, 39, 25, "M");
          Ls.lay(2, 2, 37, 23, ".");
          Ls.lay(10, 10, 29, 22, "_");
          Ls.lay(3, 4, 7, 7, "C");
          Ls.lay(32, 4, 36, 7, "C");
          Ls.lay(4, 14, 8, 17, "C");
          Ls.lay(31, 14, 35, 17, "C");
          Ls.put(2, 21, "B");
          Ls.put(37, 21, "B");
          Ls.put(18, 5, "G");
          Ls.put(21, 5, "T");
          Ls.put(14, 12, "R");
          Ls.put(25, 12, "R");
          Ls.put(19, 2, "^");
          Ls.put(20, 2, "^");
          Ls.put(37, 12, ">");
        },
        npcs: (s) => {
          const list = [
            { id: "omb_milo", x: 19, y: 19, dir: "down", name: "Milo «La Volpe»" }
          ];
          if (s >= 1) {
            list.push({ id: "omb_victor", x: 30, y: 10, dir: "left", name: "Victor (Sicurezza)" });
          }
          return list;
        }
      },

      omb_cunicoli: {
        name: "Sotterranei della Fortezza · I Cunicoli Idraulici", short: "I Cunicoli Idraulici", sub: "Grate metalliche, tubature gocciolanti e frequenze satellitari",
        w: 36, h: 22, start: [18, 19], theme: "torino", bg: "omb_cunicoli_sotterranei",
        item: ["Dossier Cifrato", "Dossier"],
        items: [[4, 4], [31, 4], [9, 14], [26, 14]],
        areas: [
          [2, 2, 14, 9, "La Sala Pompe Sommersa"],
          [21, 2, 33, 9, "Il Posto Radio di Maya"],
          [13, 11, 23, 19, "Il Corridoio delle Grate"]
        ],
        hints: () => ({
          "La Sala Pompe Sommersa": "Valvole colossali e acqua di mare che filtra dal soffitto.",
          "Il Posto Radio di Maya": "Antenne improvvisate collegate a monitor con codici biometrici.",
          "Il Corridoio delle Grate": "Grate traforate con scarichi d'olio sotto i tuoi passi."
        }),
        act: {
          G: "Colpisci il generatore con la palla", T: "Leggi i dati del satellite",
          X: "Apri la cassetta stagna", "=": "Ascolta l'eco nei cunicoli",
          "d": "Risali alla Darsena", ">": "Sali alla Gabbia delle Onde"
        },
        build(Ls) {
          Ls.lay(0, 0, 35, 1, "M");
          Ls.lay(0, 0, 1, 21, "M");
          Ls.lay(34, 0, 35, 21, "M");
          Ls.lay(0, 20, 35, 21, "M");
          Ls.lay(2, 2, 33, 19, "=");
          Ls.lay(14, 2, 15, 9, "M");
          Ls.lay(20, 2, 21, 9, "M");
          Ls.put(5, 4, "G");
          Ls.put(7, 4, "b");
          Ls.put(27, 4, "T");
          Ls.put(29, 4, "X");
          Ls.put(18, 20, "d");
          Ls.put(33, 10, ">");
        },
        npcs: (s) => {
          const list = [];
          if (s >= 2) {
            list.push({ id: "omb_maya", x: 26, y: 6, dir: "down", name: "Maya «La Sonda»" });
          }
          return list;
        }
      },

      omb_gabbia: {
        name: "Scogliera Cieca · La Gabbia delle Onde", short: "La Gabbia delle Onde", sub: "Il campo d'acciaio a bordo mare: onde, riflettori e scommesse",
        w: 38, h: 24, start: [19, 21], theme: "torino", bg: "omb_arena_gabbia",
        item: ["Tessera del Club", "Tessere"],
        items: [[4, 4], [33, 4], [8, 17], [29, 17]],
        areas: [
          [2, 2, 12, 10, "La Passerella di Madame V"],
          [25, 2, 35, 10, "La Panca dei Titani"],
          [8, 7, 29, 20, "Il Rettangolo di Gioco Blu"]
        ],
        hints: () => ({
          "La Passerella di Madame V": "Passerella sospesa dove gli allibratori sorseggiano champagne guardando il match.",
          "La Panca dei Titani": "Zoran e i suoi giganti in tuta d'acciaio si scaldano sotto la pioggia.",
          "Il Rettangolo di Gioco Blu": "Campo sintetico trafitto da quattro coni di luce alogena abbagliante."
        }),
        act: {
          R: "Riflettore alogeno puntato sulla porta", P: "Cancello d'accesso al campo",
          "<": "Torna alla Darsena"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "M");
          Ls.lay(0, 0, 1, 23, "M");
          Ls.lay(36, 0, 37, 23, "M");
          Ls.lay(0, 22, 37, 23, "M");
          Ls.lay(2, 2, 35, 21, ".");
          Ls.lay(6, 6, 31, 18, "y");
          Ls.put(5, 5, "R");
          Ls.put(32, 5, "R");
          Ls.put(5, 19, "R");
          Ls.put(32, 19, "R");
          Ls.put(2, 11, "<");
        },
        npcs: (s) => {
          const list = [];
          if (s >= 4) {
            list.push({ id: "omb_madame_v", x: 8, y: 4, dir: "down", name: "Madame Vera" });
            list.push({ id: "omb_zoran", x: 28, y: 4, dir: "down", name: "Zoran «Il Colosso»" });
          }
          return list;
        }
      }
    };

    function miloTalk() {
      const s = S();
      if (s === 0) {
        return say([
          ["omb_milo", "Ehi tu! Ragazzo con la maglia numero {num}! Abbassa la testa prima che i fari di Victor ti inquadrino!"],
          ["hero", "Chi sei? E cos'è questo posto? La lettera diceva che c'era un provino per talenti d'élite."],
          ["omb_milo", "Provino?! Ti hanno teso un'imboscata! Sei all'Atollo della Falesia Cieca. La roccaforte di Madame Vera e del Sindacato delle Ombre. Chi entra qui dentro firma un contratto in bianco o non torna più a riva."],
          ["hero", "Nessuno mi costringe a firmare nulla. Io gioco al calcio per la mia gente e per vincere con il mio «{tiro}»."],
          ["omb_milo", "Hai fegato, {n}. Ascoltami: i cancelli principali sono sbarrati dai droni di Victor. Ma c'è una grata che porta ai vecchi cunicoli idraulici sotto la banchina. Prendi questo Scanner delle Frequenze: attivalo per localizzare il punto debole del lucchetto elettronico!"]
        ], () => {
          setStep(N, 1);
          addClue("chiave_cunicoli", "Frequenza Cunicoli", "Milo ti ha svelato l'accesso ai sotterranei segreti dell'atollo.");
          note("Incontrato Milo «La Volpe»: svelata la trappola dell'Atollo.");
          say([
            ["voce", "Hai ricevuto lo Scanner delle Ombre! Premi il pulsante del Visore o esamina il Quadro Comandi per aprire la grata."]
          ], done);
        });
      }
      if (s === 1) {
        return ask("omb_milo", "«Attiva il Visore delle Ombre per scansionare il circuito elettronico della grata a nord, {n}!»", [
          {
            label: "👁️ [ATTIVA VISORE DELLE OMBRE]: Scansiona la frequenza del lucchetto!",
            cls: "hot",
            fn: () => {
              triggerShadowVisorVisualFx(() => {
                sfxTerminalHack();
                setStep(N, 2);
                note("Grata dei cunicoli sbloccata con il Visore delle Ombre!");
                say([
                  ["omb_milo", "CLIC! Il circuito è andato in corto! La grata è aperta a nord. Scendi nei cunicoli: c'è una ragazza con la giacca rossa... parla con lei!"]
                ], done);
              });
            }
          },
          {
            label: "💬 Chiedi informazioni su chi comanda qui",
            fn: () => {
              say([
                ["omb_milo", "Madame Vera Malaspina controlla le quote delle scommesse, mentre Don Renzo ci mette i picchiatori. Ma sul campo il vero ostacolo è Zoran, il portiere imbattibile della Gabbia."]
              ], done);
            }
          }
        ]);
      }
      if (s >= 2 && s < 6) {
        return say([
          ["omb_milo", "Scendi nei cunicoli a nord e trova Maya! Io tengo d'occhio i movimenti delle guardie di Victor sulla banchina."]
        ], done);
      }
      return say([
        ["omb_milo", "Ce l'abbiamo fatta a battere i Titani! Ora Madame V sta tremando!"]
      ], done);
    }

    function victorTalk() {
      return say([
        ["omb_victor", "Circolare, ragazzo. Qui si muovono solo container autorizzati dal Sindacato. Se crei disordini, il mio visore a infrarossi sarà l'ultima cosa che vedrai."]
      ], done);
    }

    function mayaTalk() {
      const s = S();
      if (s === 2) {
        return say([
          ["omb_maya", "(sollevando lo sguardo da un terminale schermato con cavi satellitari) «Non fare un passo! Sei... sei {n}, vero? Il ragazzo del Borgo con la maglia numero {num}?»"],
          ["hero", "Sì. E tu sei Maya, la ragazza di cui parlava Milo. Perché sei nascosta qui sotto con apparecchiature da spionaggio?"],
          ["omb_maya", "Sono Maya Lindqvist, reporter per 'Offside International'. Sono infiltrata qui da sei mesi. {n}, questo torneo non serve a trovare nuovi talenti: è il collaudo sul campo del 'Progetto Chimera'."],
          ["hero", "Progetto Chimera? Di cosa si tratta?"],
          ["omb_maya", "Un algoritmo predittivo biometrico! I riflettori della Gabbia delle Onde non illuminano soltanto: registrano l'angolo del ginocchio, la dilatazione pupillare e la rotazione del tuo tiro «{tiro}» per rivendere modelli di scommesse truccate a broker clandestini esteri. Kaelen Vance, il fuoriclasse mascherato scomparso 7 anni fa, si rifiutò di cedere i suoi dati... e lo hanno rinchiuso nei piani alti."],
          ["hero", "È una follia. Dobbiamo disattivare quei sensori e liberarlo."],
          ["omb_maya", "Esatto! Ma prima dobbiamo spegnere il nodo di trasmissione centrale della gabbia. Il generatore è protetto da una gabbia rinforzata a prova di grimaldello... solo una cannonata balistica chirurgica può far saltare il commutatore!"]
        ], () => {
          setStep(N, 3);
          addClue("dossier_chimera", "Progetto Chimera", "Scoperto il complotto biometrico del Sindacato delle Ombre.");
          note("Incontrata Maya: svelato il mistero dell'algoritmo Chimera.");
          say([
            ["voce", "Obiettivo aggiornato: Calcia con precisione contro il generatore elettrico a ovest nei cunicoli!"]
          ], done);
        });
      }
      if (s === 3) {
        return ask("omb_maya", "«Calcia il pallone con il tuo tiro speciale dritto nel trasformatore del generatore, {n}!»", [
          {
            label: "⚡ [CALCIO BALISTICO DI PRECISIONE]: Usa «{tiro}» contro il trasformatore!",
            cls: "hot",
            fn: () => {
              sfxMetalImpact();
              setTimeout(() => { sfxTerminalHack(); sfxNeonFlicker(); }, 200);
              setStep(N, 4);
              addClue("generatore_sabotato", "Riflettori Sabotati", "Hai disattivato i sensori biometrici della Gabbia delle Onde.");
              note("Generatore sabotato col tiro speciale: riflettori manomessi!");
              say([
                ["voce", "BOOOM! La palla colpisce l'interruttore principale con una violenza inaudita! Una pioggia di scintille bluastre inonda il corridoio: l'allarme si spegne!"],
                ["omb_maya", "Centro perfetto! I sensori biometrici di Madame V sono ciechi. Ora sali alla Gabbia delle Onde da est: Madame V ti sta aspettando. Gioca per vincere... e Zoran capirà che non sei una marionetta!"]
              ], done);
            }
          },
          {
            label: "🔍 Chiedi informazioni su Kaelen Vance",
            fn: () => {
              say([
                ["omb_maya", "Kaelen era il miglior numero 10 d'Europa. Quando scoprì che la finale del 2017 era pilotata, si tolse la maglia e sparì. È vivo, rinchiuso nella torre superiore. Se battiamo Zoran nella gabbia, potremo salire al Livello 2 e liberarlo!"]
              ], done);
            }
          }
        ]);
      }
      if (s >= 4 && s < 6) {
        return say([
          ["omb_maya", "Sali alla Gabbia delle Onde da est! Zoran è forte, ma senza i riflettori truccati il tuo tiro «{tiro}» farà breccia!"]
        ], done);
      }
      return say([
        ["omb_maya", "Vittoria straordinaria! Zoran ha cambiato fazione e Don Renzo è nel panico. Prepariamoci a salire alla fortezza superiore!"]
      ], done);
    }

    function madameVTalk() {
      const s = S();
      if (s === 4) {
        return say([
          ["omb_madame_v", "(dalla passerella d'acciaio, con voce sinuosa e sprezzante) «Benvenuto nell'arena dei reietti, {n}. I miei uomini dicono che ti sei divertito a curiosare nei cunicoli.»"],
          ["hero", "So tutto di Chimera e di Kaelen Vance, Madame Vera. Il vostro piccolo teatrino è finito."],
          ["omb_madame_v", "Che ingenuità romantica. Pensi davvero che al pubblico importi della purezza dello sport? Il mondo vuole emozioni estreme e quote alte su cui puntare. Se vuoi uscire da questa gabbia con le tue gambe, devi sconfiggere Zoran e i suoi Titani. Se perdi... la tua carriera appartiene a me."],
          ["hero", "Accetto la sfida. Ma dopo che avrò segnato, questo posto non apparterrà più a voi."]
        ], () => {
          ask("hero", "Come affronti il duello tattico contro Zoran «Il Colosso» nella Gabbia delle Onde?", [
            {
              label: "💥 [FORZA & IMPATTO FRONTALE]: Sfida fisica a tutto campo contro i Titani!",
              cls: "hot",
              fn: () => {
                sfxMetalImpact();
                F.set("tattica_gabbia", "potenza");
                setStep(N, 5);
                note("Tattica scelta: Forza e impatto frontale contro Zoran!");
                say([
                  ["omb_madame_v", "Molto bene. Zoran, entra nella gabbia. Mostra a questo ragazzo cosa succede a sfidare la Lanterna Nera!"]
                ], done);
              }
            },
            {
              label: "🎯 [TRAIETTORIA RADENTE AD EFFETTO]: Sfrutta i coni d'ombra per battere il portiere!",
              fn: () => {
                sfxShadowScan();
                F.set("tattica_gabbia", "angoli");
                setStep(N, 5);
                note("Tattica scelta: Traiettoria radente nei coni d'ombra!");
                say([
                  ["omb_madame_v", "Pensi di trovare angoli scoperti? Vedremo se la tua precisione regge la pressione delle scommesse!"]
                ], done);
              }
            }
          ]);
        });
      }
      return say([
        ["omb_madame_v", "La Gabbia delle Onde ti attende. Dimostra il tuo valore sul campo!"]
      ], done);
    }

    function zoranTalk() {
      const s = S();
      if (s < 5) {
        return say([
          ["omb_zoran", "Non ho parole per te prima del fischio d'inizio, ragazzino. Nella gabbia contano solo i fatti."]
        ], done);
      }
      if (s === 5) {
        return ask("omb_zoran", "«Sei pronto a scendere sul campo sintetico della Gabbia delle Onde, {n}?»", [
          {
            label: "⚽ [INIZIA LA PARTITA]: Sfida i Titani di Zoran nella Gabbia delle Onde!",
            cls: "hot",
            fn: () => startMatchCage1()
          },
          {
            label: "◂ Un attimo di respiro",
            fn: done
          }
        ]);
      }
      if (s === 6) {
        return say([
          ["omb_zoran", "(togliendosi i guantoni da portiere intrisi di pioggia, con gli occhi colmi di rispetto sincero) «Hai un tiro che non appartiene a questa cloaca, {n}. Quella traiettoria... mi ha ricordato la finale europea di sette anni fa.»"],
          ["hero", "Parlavi di Kaelen Vance, vero? Zoran, perché difendi questo posto se sai che è tutto marcio?"],
          ["omb_zoran", "Madame V e Don Renzo tengono sotto ricatto le famiglie dei miei marinai a Spalato. Ma stasera, vedendo come hai lottato e come hai disattivato quei sensori infernali, ho capito che non possiamo più essere complici."],
          ["hero", "Aiutami a salire alla fortezza. Liberiamo Kaelen e Silvia Moretti."],
          ["omb_zoran", "(estrae una chiave magnetica nera con il sigillo di San Giuda e te la porge) «Prendi questa. È il pass magnetico del Livello 2: i Magazzini Blindati e la Suite della Falesia. Io bloccherò le guardie di Victor al piano terra. Salite e fate crollare la Lanterna Nera una volta per tutte!»"],
          ["hero", "Grazie, Zoran. Da oggi non sei più prigioniero di nessuno."]
        ], () => {
          finishChapter(N, "trionfo_gabbia_onde");
          note("Capitolo 1 completato! Ricevuta la Chiave Magnetica del Livello 2 da Zoran.");
          const rewMsg = reward("omb_ch1_win", {
            coins: 40,
            cos: "omb_maschera_notte",
            note: "Completato il Capitolo 1 del Circuito delle Ombre!"
          });
          say([
            ["voce", `<b>🏆 CAPITOLO 1 COMPLETATO CON SUCCESSO!</b><br>Hai espugnato la Gabbia delle Onde e conquistato il rispetto di Zoran!<br><br><span style="color:#38bdf8">${rewMsg}</span><br>La strada verso i livelli superiori della Fortezza Cieca è aperta!`]
          ], done);
        });
      }
      return say([
        ["omb_zoran", "La chiave magnetica aprirà i Magazzini Blindati. Fa' attenzione: Don Renzo ha schierato i droni d'assalto al piano di sopra!"]
      ], done);
    }

    function startMatchCage1() {
      X.playMatch({
        id: "omb_match_1",
        chap: "Il Circuito delle Ombre · La Gabbia delle Onde",
        us: "I Ribelli delle Ombre",
        mate: "Milo",
        min: 45,
        intro: "Partita clandestina sul campo d'acciaio trafitto da riflettori e pioggia! Il tuo Campione {n} sfida i colossi dei Titani della Falesia guidati da Zoran!",
        team: (t, st) => ({
          name: "Titani della Falesia di Zoran",
          col: "#475569",
          style: "Muro Cieco & Difesa Fisica",
          atk: t(st.atk * 0.95),
          def: t(st.def * 1.05),
          vel: t(st.vel * 0.9),
          specials: ["Muro d'Acciaio", "Presa del Colosso"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 6);
            note("Trionfo clamoroso nella Gabbia delle Onde: i Titani di Zoran sono battuti!");
            say([
              ["voce", `RETEEE! Il tuo tiro «{tiro}» buca la rete metallica della porta all'incrocio dei pali! Fischio finale: I Ribelli delle Ombre vincono la sfida clandestina!`],
              ["omb_madame_v", `«Impossibile... Nessuno ha mai segnato a Zoran nella Gabbia!»`]
            ], () => {
              zoranTalk();
            });
          } else {
            say([
              ["omb_zoran", `«Hai combattuto con tenacia, {n}, ma la risacca e la pioggia della Gabbia non perdonano! Milo ti passa un asciugamano: <i>«Non mollare! Ricalibra l'angolazione e tiragli sul palo lontano!»</i>`],
              ["hero", "Non finisce qui. Riprendiamo la palla e andiamo a vincere!"]
            ], () => {
              ask("hero", "Vuoi riprovare subito la sfida nella Gabbia contro Zoran?", [
                { label: "⚽ Riprova la Partita nella Gabbia", cls: "hot", fn: startMatchCage1 },
                { label: "◂ Riorganizzati con Milo", fn: done }
              ]);
            });
          }
        }
      });
    }

    return {
      n: N,
      title: "L'Approdo alla Falesia Cieca & La Gabbia delle Onde",
      goal,
      zones,
      talk: {
        omb_milo: miloTalk,
        omb_victor: victorTalk,
        omb_maya: mayaTalk,
        omb_madame_v: madameVTalk,
        omb_zoran: zoranTalk
      },
      obj: {
        "omb_darsena:^": () => {
          if (S() < 2) {
            say([["voce", "La grata dei cunicoli è sigillata da un lucchetto a combinazione ciano. Parla con Milo e usa il Visore delle Ombre!"]], done);
          } else {
            go("omb_cunicoli", 18, 18);
          }
        },
        "omb_darsena:>": () => {
          if (S() < 4) {
            say([["voce", "La saracinesca verso la Gabbia delle Onde è presidiata dalle guardie. Devi prima penetrare nei cunicoli!"]], done);
          } else {
            go("omb_gabbia", 4, 11);
          }
        },
        "omb_cunicoli:d": () => {
          go("omb_darsena", 19, 4);
        },
        "omb_cunicoli:>": () => {
          if (S() < 4) {
            say([["voce", "Devi prima sabotare il generatore con il tuo tiro speciale insieme a Maya!"]], done);
          } else {
            go("omb_gabbia", 4, 11);
          }
        },
        "omb_gabbia:<": () => {
          go("omb_darsena", 36, 12);
        }
      }
    };
  });

  // ============================================================================
  // CAPITOLO 2 · I MAGAZZINI BLINDATI & IL LABORATORIO DI SILVIA
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, reward, esc, addClue, triggerShadowVisorVisualFx, sfxShadowScan, sfxNeonFlicker, sfxTerminalHack, sfxMetalImpact } = X;
    const N = 2, S = () => X.stepOf(N);

    // Personaggi Capitolo 2
    X.cast("omb_silvia", {
      name: "Silvia Moretti «Chimera»", tag: "scienza", hair: "#4a3b32", style: "bob", skin: "#f4d6c1", eye: "#38bdf8",
      glasses: true, bg: ["#091e3a", "#0f3a60"], shirt: "#164e63"
    }, "Scienziata informatica geniale e sorella scomparsa di Leo. Ha ideato l'algoritmo biometrico per curare le lesioni muscolari, ma Madame V e Don Renzo l'hanno imprigionata per manipolare le scommesse sportive.");

    X.cos("omb_cintura_chimera", { kind: "acc", label: "Cintura Tattica delle Ombre & Ologramma Chimera", val: "#38bdf8", from: "Completa il Capitolo 2 del Circuito delle Ombre" });

    const goal = (s) => ({
      0: "Usa la Chiave Magnetica di Zoran per accedere ai Magazzini Blindati al Livello 2.",
      1: "Attiva il Visore delle Ombre per disattivare la Barriera Laser di Victor.",
      2: "Raggiungi il Laboratorio Olografico ed incontra Silvia Moretti «Chimera».",
      3: "Prendi la decisione etica: Sabotaggio Criogenico dei server o Salvataggio delle Telemetrie?",
      4: "Scendi nell'Hangar dei Droni e sconfiggi la Pattuglia Nera di Victor!",
      5: "Capitolo 2 concluso! Ricevi la Card d'Accesso alla Suite Panoramica."
    }[s] || "Capitolo 2 concluso. Esplora i magazzini e raccogli i wafer criogenici.");

    const zones = {
      omb_magazzini: {
        name: "Livello 2 · Magazzini Blindati della Fortezza", short: "Magazzini Blindati", sub: "Container criogenici, barriere laser e nastri trasportatori",
        w: 38, h: 24, start: [4, 18], theme: "torino", bg: "omb_magazzini_laser",
        item: ["Wafer Criogenico", "Wafer"], itemCos: "omb_cintura_chimera",
        items: [[6, 6], [32, 6], [12, 16], [28, 16]],
        areas: [
          [2, 2, 14, 10, "Il Settore Frigorifero"],
          [24, 2, 35, 10, "L'Uscita verso il Laboratorio"],
          [8, 12, 30, 20, "Il Corridoio Laser"]
        ],
        hints: () => ({
          "Il Settore Frigorifero": "Container criogenici sigillati con vapori bianchi che condensano a terra.",
          "L'Uscita verso il Laboratorio": "La porta blindata che conduce al laboratorio segreto di Silvia Moretti.",
          "Il Corridoio Laser": "Reticolo di fasci laser rossi collegati all'allarme centrale di Victor."
        }),
        act: {
          L: "Barriera laser armata", S: "Server criogenico",
          "^": "Entra nel Laboratorio Chimera", ">": "Scendi all'Hangar dei Droni"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "M");
          Ls.lay(0, 0, 1, 23, "M");
          Ls.lay(36, 0, 37, 23, "M");
          Ls.lay(0, 22, 37, 23, "M");
          Ls.lay(2, 2, 35, 21, "=");

          // Scaffali e container
          Ls.lay(4, 4, 12, 8, "C");
          Ls.lay(25, 4, 33, 8, "C");

          // Linee laser
          Ls.lay(14, 10, 23, 10, "L");
          Ls.put(18, 14, "G");
          Ls.put(20, 14, "S");

          // Passaggi
          Ls.put(29, 2, "^");
          Ls.put(35, 12, ">");
        },
        npcs: (s) => {
          const list = [];
          if (s >= 1) list.push({ id: "omb_victor", x: 18, y: 12, dir: "down", name: "Victor (Sicurezza)" });
          return list;
        }
      },

      omb_lab_silvia: {
        name: "Livello 2 · Laboratorio Chimera", short: "Laboratorio Chimera", sub: "Schermi olografici, capsule criogeniche e codice predittivo",
        w: 34, h: 20, start: [17, 17], theme: "torino", bg: "omb_cunicoli_sotterranei",
        item: ["Chip Echo", "Chip"],
        items: [[4, 4], [29, 4], [10, 14], [24, 14]],
        areas: [
          [2, 2, 14, 8, "Il Banco Olografico"],
          [20, 2, 31, 8, "I Server delle Scommesse"]
        ],
        hints: () => ({
          "Il Banco Olografico": "Proiezioni tridimensionali che riproducono le traiettorie balistiche dei calciatori del Borgo.",
          "I Server delle Scommesse": "Unità rack nere collegate via satellite alla finanza nera asiatica."
        }),
        act: {
          S: "Server principale di Chimera", H: "Capsula olografica",
          "d": "Torna ai Magazzini"
        },
        build(Ls) {
          Ls.lay(0, 0, 33, 1, "M");
          Ls.lay(0, 0, 1, 19, "M");
          Ls.lay(32, 0, 33, 19, "M");
          Ls.lay(0, 18, 33, 19, "M");
          Ls.lay(2, 2, 31, 17, "_");
          Ls.put(6, 4, "H");
          Ls.put(8, 4, "S");
          Ls.put(24, 4, "S");
          Ls.put(26, 4, "T");
          Ls.put(17, 18, "d");
        },
        npcs: () => [
          { id: "omb_silvia", x: 16, y: 8, dir: "down", name: "Silvia Moretti «Chimera»" }
        ]
      },

      omb_hangar_droni: {
        name: "Livello 2 · Hangar di Collaudo dei Droni", short: "Hangar dei Droni", sub: "Pareti magnetiche, riflettori stroboscopici e sicurezza armata",
        w: 36, h: 22, start: [18, 19], theme: "torino", bg: "omb_magazzini_laser",
        item: ["Batteria Droni", "Batterie"],
        items: [[5, 5], [30, 5], [10, 15], [25, 15]],
        areas: [
          [6, 6, 29, 16, "Il Rettangolo di Prova"]
        ],
        hints: () => ({
          "Il Rettangolo di Prova": "Campo da gioco schermato da barriere laser di contenimento."
        }),
        act: {
          L: "Barriera di contenimento", "<": "Torna ai Magazzini"
        },
        build(Ls) {
          Ls.lay(0, 0, 35, 1, "M");
          Ls.lay(0, 0, 1, 21, "M");
          Ls.lay(34, 0, 35, 21, "M");
          Ls.lay(0, 20, 35, 21, "M");
          Ls.lay(2, 2, 33, 19, ".");
          Ls.lay(6, 6, 29, 16, "y");
          Ls.put(2, 11, "<");
        },
        npcs: (s) => {
          const list = [];
          if (s >= 3) list.push({ id: "omb_victor", x: 18, y: 5, dir: "down", name: "Victor «Ombra Cieca»" });
          return list;
        }
      }
    };

    function victorTalkCh2() {
      const s = S();
      if (s === 1) {
        return ask("omb_victor", "«Victor blocca il corridoio con la barriera laser! Come agisci, {n}?»", [
          {
            label: "👁️ [VISORE DELLE OMBRE]: Scansiona e sovraccarica i relè laser!",
            cls: "hot",
            fn: () => {
              triggerShadowVisorVisualFx(() => {
                sfxTerminalHack();
                setStep(N, 2);
                note("Laser disattivati! Passaggio per il laboratorio aperto.");
                say([
                  ["omb_victor", "«Allarme! Il circuito dei laser è saltato! Prendetelo!»"],
                  ["hero", "«Troppo tardi, Victor. La porta del laboratorio è spalancata!»"]
                ], done);
              });
            }
          },
          { label: "◂ Ripiega", fn: done }
        ]);
      }
      if (s === 4) {
        return ask("omb_victor", "«Sei entrato nell'Hangar dei Droni, {n}. Qui le regole le detta la sicurezza del Sindacato!»", [
          {
            label: "⚽ [SFIDA LA PATTUGLIA NERA]: Vinci la partita nell'Hangar!",
            cls: "hot",
            fn: () => startMatchHangar()
          },
          { label: "◂ Riorganizzati", fn: done }
        ]);
      }
      return say([
        ["omb_victor", "I droni sono in modalità standby. Don Renzo ti aspetta nella Suite al piano di sopra..."]
      ], done);
    }

    function silviaTalk() {
      const s = S();
      if (s === 2) {
        return say([
          ["omb_silvia", "(voltandosi sorpresa tra le proiezioni olografiche) «Tu... tu sei {n}! Riconosco il tuo baricentro e il modo in cui calzi gli scarpini... è identico a come calciava mio fratello Leo al molo!»"],
          ["hero", "Silvia Moretti?! Sei davvero tu?! Al Borgo credono tutti che tu sia scomparsa in Germania dieci anni fa!"],
          ["omb_silvia", "Madame V e Don Renzo mi hanno attirata con una borsa di ricerca medica. Hanno rubato i miei algoritmi riabilitativi per trasformarli in 'Chimera': un software predittivo che anticipa dove il portiere o l'attaccante si sposteranno, permettendo loro di truccare qualsiasi scommessa a livello globale."],
          ["hero", "Zoran ci ha aperto la strada dal basso. Maya e Milo sono con noi. Dobbiamo distruggere i server e portarti a casa."],
          ["omb_silvia", "Prima di fuggire dobbiamo prendere una decisione sui server. Ho creato un virus chiamato 'Echo', ma dobbiamo scegliere cosa fare dei dati!"]
        ], () => {
          setStep(N, 3);
          addClue("chip_echo", "Chip Echo di Silvia", "Il codice sorgente dell'algoritmo biometrico della famiglia Moretti.");
          note("Incontrata Silvia Moretti: svelata la verità medica dietro Chimera.");
          done();
        });
      }
      if (s === 3) {
        return ask("omb_silvia", "«Cosa facciamo con i server centrali di Chimera prima di salire alla Suite, {n}?»", [
          {
            label: "❄️ [SABOTAGGIO CRIOGENICO]: Congela e distruggi i server delle scommesse!",
            cls: "hot",
            fn: () => {
              sfxMetalImpact();
              sfxTerminalHack();
              F.set("scelta_ch2", "sabotaggio");
              setStep(N, 4);
              addClue("server_congelati", "Server Distrutti", "I server delle scommesse clandestine sono stati congelati col criogeno.");
              note("Scelta: Sabotaggio criogenico eseguito!");
              say([
                ["omb_silvia", "Valvole aperte! Il criogeno liquido ha mandato in corto tutti i mainframe! Ora Don Renzo non può più quotare le partite truccate. Victor sta schierando i suoi uomini nell'Hangar a sud: dobbiamo batterli per raggiungere l'ascensore della Suite!"]
              ], done);
            }
          },
          {
            label: "💾 [SALVA LE TELEMETRIE]: Scarica le prove per scagionare gli atleti ricattati!",
            fn: () => {
              sfxTerminalHack();
              F.set("scelta_ch2", "telemetria");
              setStep(N, 4);
              addClue("telemetrie_salvate", "Dossier Telemetrico", "Hai estratto le prove per scagionare Kaelen e gli altri campioni ricattati.");
              note("Scelta: Salvataggio telemetrico completato!");
              say([
                ["omb_silvia", "Download completato sulla chiavetta criptata! Ora abbiamo le prove che Kaelen Vance non ha mai voluto perdere quella finale. Andiamo all'Hangar dei Droni!"]
              ], done);
            }
          }
        ]);
      }
      return say([
        ["omb_silvia", "L'ascensore per la Suite è al sicuro. Andiamo a liberare Kaelen Vance!"]
      ], done);
    }

    function startMatchHangar() {
      X.playMatch({
        id: "omb_match_2",
        chap: "Il Circuito delle Ombre · L'Hangar dei Droni",
        us: "I Ribelli delle Ombre",
        mate: "Silvia",
        min: 45,
        intro: "Partita blindata nell'hangar di collaudo tra pareti magnetiche! Sfida la Pattuglia Nera di Victor con l'aiuto di Silvia Moretti!",
        team: (t, st) => ({
          name: "Pattuglia Nera di Victor",
          col: "#09090b",
          style: "Pressing Termico & Droni Tattici",
          atk: t(st.atk * 1.0),
          def: t(st.def * 1.05),
          vel: t(st.vel * 0.95),
          specials: ["Intercettazione Termica", "Laser Difensivo"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 5);
            finishChapter(N, "trionfo_hangar_droni");
            note("Capitolo 2 completato! Victor battuto nell'Hangar dei Droni.");
            const rewMsg = reward("omb_ch2_win", {
              coins: 45,
              cos: "omb_cintura_chimera",
              note: "Completato il Capitolo 2 del Circuito delle Ombre!"
            });
            say([
              ["voce", `GOOOOL! Con un bolide «{tiro}» pieghi le mani del portiere robotico! La Pattuglia Nera è sconfitta!`],
              ["omb_silvia", `«Ce l'abbiamo fatta! L'ascensore della Suite Panoramica è sbloccato. Kaelen Vance è lassù... andiamo a prenderlo!»`],
              ["voce", `<b>🏆 CAPITOLO 2 COMPLETATO!</b><br><span style="color:#38bdf8">${rewMsg}</span><br>Accesso al Livello 3 (La Suite del Ricatto) sbloccato!`]
            ], done);
          } else {
            say([
              ["omb_victor", "«I droni di Victor hanno respinto i tuoi tiri! Silvia ti incoraggia: <i>«Non farti intimidire dai radar! Calcia radente negli angoli ciechi!»</i>"]
            ], () => {
              ask("hero", "Vuoi riprovare la sfida contro la Pattuglia Nera?", [
                { label: "⚽ Rigioca la partita", cls: "hot", fn: startMatchHangar },
                { label: "◂ Riorganizzati", fn: done }
              ]);
            });
          }
        }
      });
    }

    return {
      n: N,
      title: "I Magazzini Blindati & Il Laboratorio di Silvia",
      goal,
      zones,
      talk: {
        omb_victor: victorTalkCh2,
        omb_silvia: silviaTalk
      },
      obj: {
        "omb_magazzini:^": () => {
          if (S() < 2) {
            say([["voce", "La barriera laser è attiva. Parla con Victor o usa il Visore delle Ombre per neutralizzarla!"]], done);
          } else {
            go("omb_lab_silvia", 17, 16);
          }
        },
        "omb_magazzini:>": () => {
          if (S() < 4) {
            say([["voce", "Devi prima prendere la decisione sui server nel laboratorio di Silvia!"]], done);
          } else {
            go("omb_hangar_droni", 4, 11);
          }
        },
        "omb_lab_silvia:d": () => {
          go("omb_magazzini", 29, 4);
        },
        "omb_hangar_droni:<": () => {
          go("omb_magazzini", 34, 12);
        }
      }
    };
  });

  // ============================================================================
  // CAPITOLO 3 · LA SUITE DEL RICATTO & IL CAMPIONE MASCHERATO
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, reward, esc, addClue, triggerShadowVisorVisualFx, sfxShadowScan, sfxNeonFlicker, sfxTerminalHack, sfxMetalImpact } = X;
    const N = 3, S = () => X.stepOf(N);

    // Personaggi Capitolo 3
    X.cast("omb_kaelen", {
      name: "Kaelen «Il Fantasma»", tag: "fantasma", hair: "#d8dfe8", style: "messy", skin: "#eedac8", eye: "#3a7bd5",
      acc: "maschera", bg: ["#0b1626", "#1e4273"], shirt: "#0d1b2a"
    }, "Ex prodigio europeo del calcio. Rifiutò di perdere la finale truccata del 2017 e fu rinchiuso nella Cella d'Ebano. Custode del leggendario «Tiro Eclisse».");

    X.cast("omb_don_renzo", {
      name: "Don Renzo Sforza", tag: "boss", hair: "#1f1f28", style: "slick", skin: "#ecd0b8", eye: "#111827",
      shades: true, bg: ["#241b12", "#4a3622"], shirt: "#2b2218"
    }, "Boss spietato della malavita che gestisce i gorilla e le sale di scommesse clandestine dell'Atollo.");

    X.cos("omb_mantello_ombre", { kind: "acc", label: "Mantello Noir delle Ombre & Orologio Clandestino", val: "#38bdf8", from: "Completa il Capitolo 3 del Circuito delle Ombre" });

    const goal = (s) => ({
      0: "Sali alla Suite Panoramica e affronta Don Renzo e Madame Vera.",
      1: "Rifiuta la valigetta da un milione di euro e penetra nella Cella d'Ebano.",
      2: "Usa il tuo tiro speciale per disattivare il campo di forza e liberare Kaelen Vance.",
      3: "Apprendi i segreti del Tiro Eclisse da Kaelen e scegli la strategia morale del bivio.",
      4: "Scendi sull'Arena Panoramica tra le due torri e sconfiggi i Guardiani d'Oro di Don Renzo!",
      5: "Capitolo 3 completato! Accesso al Tetto Supremo della Falesia Cieca sbloccato."
    }[s] || "Capitolo 3 concluso. Preparati al Gran Finale sul tetto della fortezza.");

    const zones = {
      omb_suite: {
        name: "Livello 3 · Suite Panoramica della Lanterna Nera", short: "Suite Panoramica", sub: "Vetrate a picco sulle onde burrascose, caminetti e valigette di banconote",
        w: 38, h: 22, start: [19, 19], theme: "torino", bg: "omb_suite_tempesta",
        item: ["Sigillo di Don Renzo", "Sigilli"], itemCos: "omb_mantello_ombre",
        items: [[5, 5], [32, 5], [10, 15], [27, 15]],
        areas: [
          [10, 2, 28, 8, "Il Tavolo del Ricatto"],
          [2, 2, 8, 10, "La Cella d'Ebano"]
        ],
        hints: () => ({
          "Il Tavolo del Ricatto": "Don Renzo e Madame V contano mazzette di obbligazioni al riparo dalla tempesta.",
          "La Cella d'Ebano": "Porta blindata elettrificata dove è rinchiuso Kaelen Vance."
        }),
        act: {
          W: "Guarda le onde schiantarsi sulle scogliere", X: "Valigetta dei contratti",
          "^": "Varca la Cella d'Ebano", ">": "Sali all'Arena Panoramica"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "M");
          Ls.lay(0, 0, 1, 21, "M");
          Ls.lay(36, 0, 37, 21, "M");
          Ls.lay(0, 20, 37, 21, "M");
          Ls.lay(2, 2, 35, 19, ".");

          // Vetrate panoramiche a nord
          Ls.lay(10, 1, 28, 1, "W");

          // Tavolo e mobili
          Ls.put(18, 5, "T");
          Ls.put(20, 5, "X");

          // Cella a ovest
          Ls.lay(2, 2, 8, 8, "M");
          Ls.put(5, 8, "^");

          // Uscita verso l'arena a est
          Ls.put(35, 10, ">");
        },
        npcs: (s) => {
          const list = [
            { id: "omb_don_renzo", x: 17, y: 6, dir: "down", name: "Don Renzo Sforza" },
            { id: "omb_madame_v", x: 21, y: 6, dir: "down", name: "Madame Vera" }
          ];
          if (s >= 3) {
            list.push({ id: "omb_kaelen", x: 19, y: 14, dir: "down", name: "Kaelen «Il Fantasma»" });
          }
          return list;
        }
      },

      omb_cella_ebano: {
        name: "Livello 3 · La Cella d'Ebano di Kaelen", short: "La Cella d'Ebano", sub: "Pareti di grafite, campo di forza e ritagli di giornale del 2017",
        w: 30, h: 18, start: [15, 15], theme: "torino", bg: "omb_cunicoli_sotterranei",
        item: ["Maschera Spezzata", "Frammenti"],
        items: [[4, 4], [25, 4], [8, 12], [21, 12]],
        areas: [
          [4, 4, 25, 12, "Il Confinamento di Kaelen"]
        ],
        hints: () => ({
          "Il Confinamento di Kaelen": "Un campo di forza azzurro isola il fuoriclasse mascherato dal resto del mondo."
        }),
        act: {
          G: "Interruttore del campo di forza", "d": "Torna alla Suite"
        },
        build(Ls) {
          Ls.lay(0, 0, 29, 1, "M");
          Ls.lay(0, 0, 1, 17, "M");
          Ls.lay(28, 0, 29, 17, "M");
          Ls.lay(0, 16, 29, 17, "M");
          Ls.lay(2, 2, 27, 15, "=");
          Ls.put(14, 4, "G");
          Ls.put(15, 16, "d");
        },
        npcs: (s) => {
          const list = [];
          if (s < 3) list.push({ id: "omb_kaelen", x: 14, y: 8, dir: "down", name: "Kaelen «Il Fantasma»" });
          return list;
        }
      },

      omb_arena_panoramica: {
        name: "Livello 3 · L'Arena dei Riflettori Alti", short: "Arena Panoramica", sub: "Ponte sospeso tra le torri: vento fortissimo e parapetti d'acciaio",
        w: 38, h: 24, start: [4, 12], theme: "torino", bg: "omb_suite_tempesta",
        item: ["Trofeo Dorato", "Trofei"],
        items: [[6, 6], [32, 6], [10, 17], [27, 17]],
        areas: [
          [6, 6, 31, 18, "Il Campo Sospeso"]
        ],
        hints: () => ({
          "Il Campo Sospeso": "Un campo da gioco sintetico teso tra due torri a picco sulla scogliera."
        }),
        act: {
          R: "Riflettore alogeno", "<": "Torna alla Suite", ">": "Sali al Tetto Supremo"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "M");
          Ls.lay(0, 0, 1, 23, "M");
          Ls.lay(36, 0, 37, 23, "M");
          Ls.lay(0, 22, 37, 23, "M");
          Ls.lay(2, 2, 35, 21, ".");
          Ls.lay(6, 6, 31, 18, "y");
          Ls.put(5, 5, "R");
          Ls.put(32, 5, "R");
          Ls.put(2, 12, "<");
          Ls.put(35, 12, ">");
        },
        npcs: (s) => {
          const list = [];
          if (s >= 3) list.push({ id: "omb_don_renzo", x: 19, y: 4, dir: "down", name: "Don Renzo" });
          return list;
        }
      }
    };

    function donRenzoTalk() {
      const s = S();
      if (s === 0) {
        return say([
          ["omb_don_renzo", "(aprendo una valigetta colma di mazzette di banconote da 500 euro) «Accomodati, {n}. Hai fatto più rumore tu stanotte che una mareggiata di libeccio.»"],
          ["omb_madame_v", "«Ti facciamo un'offerta che non si può rifiutare, ragazzo. Un milione di euro puliti su un conto a Lugano. In cambio, al minuto 88 della finale simulerai uno strappo al bicipite femorale.»"],
          ["hero", "«Tenetevi i vostri soldi sporchi. Il calcio del mio paese non è in vendita né a Lugano né a Singapore.»"],
          ["omb_don_renzo", "«Ragazzino insolente... Pensi di fare l'eroe? Kaelen Vance ha fatto la stessa scelta sette anni fa, e ora marcisce nella Cella d'Ebano dietro quella porta. O firmi, o farai la sua stessa fine!»"]
        ], () => {
          setStep(N, 1);
          note("Rifiutata la valigetta da un milione di Don Renzo!");
          say([
            ["hero", "«La mia risposta è no. E adesso libero Kaelen!»"]
          ], done);
        });
      }
      if (s === 4) {
        return ask("omb_don_renzo", "«I miei Guardiani d'Oro ti schiacceranno sul campo sospeso, {n}!»", [
          {
            label: "⚽ [SFIDA I GUARDIANI D'ORO]: Scendi in campo con Kaelen!",
            cls: "hot",
            fn: () => startMatchSuite()
          },
          { label: "◂ Riorganizzati", fn: done }
        ]);
      }
      return say([
        ["omb_don_renzo", "«Questo posto crollerà prima che io vi lasci vincere...»"]
      ], done);
    }

    function madameVTalkCh3() {
      return say([
        ["omb_madame_v", "«Non hai idea delle forze che stai sfidando, {n}. I compratori della finale stanno già atterrando sul tetto...»"]
      ], done);
    }

    function kaelenTalk() {
      const s = S();
      if (s === 1 || s === 2) {
        return say([
          ["omb_kaelen", "(dietro il campo di forza azzurro, con la maschera spezzata che riflette la luce) «Sei... sei venuto davvero a cercarmi? Nessuno oltrepassa la sicurezza di Don Renzo.»"],
          ["hero", "«Zoran, Milo, Maya e Silvia Moretti sono con noi. Resisti, Kaelen: faccio saltare il campo di forza!»"],
          ["omb_kaelen", "«Colpisci il generatore al vertice della cella! Ha una frequenza a risonanza armonica... solo un tiro potente ed elastico può mandarlo in frantumi!»"]
        ], () => {
          ask("hero", "Come disattivi il campo di forza della Cella d'Ebano?", [
            {
              label: "⚡ [TIRO DI PRECISIONE]: Calcia «{tiro}» contro il generatore!",
              cls: "hot",
              fn: () => {
                sfxMetalImpact();
                sfxTerminalHack();
                setStep(N, 3);
                addClue("kaelen_libero", "Kaelen Vance Liberato", "Hai liberato il leggendario fuoriclasse mascherato.");
                note("Kaelen Vance liberato dalla Cella d'Ebano!");
                say([
                  ["voce", "CRASH! Il commutatore va in pezzi e il campo di forza si dissolve in una nuvola d'ozono!"],
                  ["omb_kaelen", "(togliendosi la maschera d'argento) «Grazie, {n}. Sette anni di buio finiscono stanotte. Lascia che ti insegni il segreto del mio 'Tiro Eclisse': piega il collo del piede all'ultimo istante per far scomparire la sfera nei riflettori!»"],
                  ["hero", "«Un tiro formidabile, Kaelen. Ora andiamo a riprenderci la finale sull'Arena Panoramica!»"]
                ], done);
              }
            }
          ]);
        });
      }
      if (s === 3) {
        return ask("omb_kaelen", "«Quale strategia scegliamo per la resa dei conti contro Don Renzo, {n}?»", [
          {
            label: "🌟 [LA VIA DELLA GIUSTIZIA]: Collega il satellite per trasmettere le prove in mondovisione!",
            cls: "hot",
            fn: () => {
              F.set("bivio_ch3", "giustizia");
              setStep(N, 4);
              note("Bivio morale: La Via della Giustizia scelta!");
              say([
                ["omb_kaelen", "«Maya ha agganciato il feed satellitare europeo: al fischio finale il mondo vedrà i documenti di Don Renzo!»"]
              ], done);
            }
          },
          {
            label: "🏴‍☠️ [IL PATTO DEI CORSARI]: Usa i fondi di Don Renzo per finanziare il calcio libero!",
            fn: () => {
              F.set("bivio_ch3", "corsari");
              setStep(N, 4);
              note("Bivio morale: Il Patto dei Corsari scelto!");
              say([
                ["omb_kaelen", "«Milo ha confiscato la cassaforte di Don Renzo: apriremo accademie libere su tutte le isole del Tirreno!»"]
              ], done);
            }
          }
        ]);
      }
      return say([
        ["omb_kaelen", "«Andiamo all'Arena Panoramica a est. Don Renzo pagherà per ogni talento che ha cercato di spezzare!»"]
      ], done);
    }

    function startMatchSuite() {
      X.playMatch({
        id: "omb_match_3",
        chap: "Il Circuito delle Ombre · L'Arena Panoramica",
        us: "I Ribelli delle Ombre",
        mate: "Kaelen",
        min: 45,
        intro: "Partita mozzafiato sul campo sospeso tra le due torri a picco sulla burrasca! Sfida i Guardiani d'Oro di Don Renzo insieme a Kaelen Vance!",
        team: (t, st) => ({
          name: "Guardiani d'Oro di Don Renzo",
          col: "#ca8a04",
          style: "Bordata Blindata & Gabbia d'Oro",
          atk: t(st.atk * 1.05),
          def: t(st.def * 1.1),
          vel: t(st.vel * 1.0),
          specials: ["Valigia d'Oro", "Pressing Cieco"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 5);
            finishChapter(N, "trionfo_suite_panoramica");
            note("Capitolo 3 completato! Don Renzo sconfitto sull'Arena Panoramica.");
            const rewMsg = reward("omb_ch3_win", {
              coins: 50,
              cos: "omb_mantello_ombre",
              note: "Completato il Capitolo 3 del Circuito delle Ombre!"
            });
            say([
              ["voce", `GOOOOL! Con una combinazione perfetta tra il tuo tiro «{tiro}» e il Tiro Eclisse di Kaelen gonfiate la rete! I Guardiani d'Oro sono battuti!`],
              ["omb_don_renzo", `«No... i miei capitali... le mie scommesse... è finita!»`],
              ["omb_kaelen", `«Madame Vera è fuggita verso il Tetto Supremo con l'elicottero. Dobbiamo salire lassù prima che decolli!»`],
              ["voce", `<b>🏆 CAPITOLO 3 COMPLETATO!</b><br><span style="color:#38bdf8">${rewMsg}</span><br>La porta verso il Tetto Supremo della Falesia Cieca è spalancata!`]
            ], done);
          } else {
            say([
              ["omb_don_renzo", "«I Guardiani d'Oro hanno bloccato il contropiede! Kaelen ti porge la mano nella bufera: <i>«Non mollare, {n}! Combina la rotazione con la mia sponda e la palla entra!»</i>"]
            ], () => {
              ask("hero", "Vuoi riprovare la partita contro i Guardiani d'Oro?", [
                { label: "⚽ Rigioca la partita", cls: "hot", fn: startMatchSuite },
                { label: "◂ Riorganizzati", fn: done }
              ]);
            });
          }
        }
      });
    }

    return {
      n: N,
      title: "La Suite del Ricatto & Il Campione Mascherato",
      goal,
      zones,
      talk: {
        omb_don_renzo: donRenzoTalk,
        omb_madame_v: madameVTalkCh3,
        omb_kaelen: kaelenTalk
      },
      obj: {
        "omb_suite:^": () => {
          go("omb_cella_ebano", 15, 14);
        },
        "omb_suite:>": () => {
          if (S() < 3) {
            say([["voce", "Devi prima liberare Kaelen dalla Cella d'Ebano a ovest!"]], done);
          } else {
            go("omb_arena_panoramica", 4, 12);
          }
        },
        "omb_cella_ebano:d": () => {
          go("omb_suite", 5, 10);
        },
        "omb_arena_panoramica:<": () => {
          go("omb_suite", 34, 10);
        },
        "omb_arena_panoramica:>": () => {
          if (S() < 5) {
            say([["voce", "Devi prima sconfiggere i Guardiani d'Oro nella partita sull'Arena!"]], done);
          } else {
            api.trToast("Sali al Tetto Supremo per il Capitolo 4!");
          }
        }
      }
    };
  });

  // ============================================================================
  // CAPITOLO 4 · LA BATTAGLIA DELLA FALESIA CIECA & I QUATTRO EPILOGHI
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, reward, hero, esc, addClue, triggerShadowVisorVisualFx, sfxShadowScan, sfxNeonFlicker, sfxTerminalHack, sfxMetalImpact } = X;
    const N = 4, S = () => X.stepOf(N);

    X.cos("omb_maschera_argento", { kind: "acc", label: "Maschera d'Argento di Kaelen «Il Fantasma»", val: "#e2e8f0", from: "Completa la Saga Il Circuito delle Ombre (Tutti i 4 Capitoli)" });

    const goal = (s) => ({
      0: "Raggiungi il Tetto Supremo della Falesia Cieca sotto la tempesta.",
      1: "Confronta Madame Vera Malaspina davanti all'elicottero di fuga.",
      2: "Scegli il tuo epilogo leggendario per il destino della Lanterna Nera.",
      3: "Scendi in campo per la Finale Suprema contro i Cavalieri dell'Ombra!",
      4: "Saga Completata con Trionfo! Assisti all'epilogo finale che hai scelto."
    }[s] || "Saga completata con successo! Hai liberato l'Atollo della Falesia Cieca.");

    const zones = {
      omb_tetto_supremo: {
        name: "Vertice della Fortezza · Il Tetto Supremo", short: "Tetto Supremo", sub: "Tempesta d'alta quota, fari rotanti della Lanterna Nera ed elicottero in fuga",
        w: 38, h: 24, start: [19, 21], theme: "torino", bg: "omb_tetto_supremo",
        item: ["Trofeo Supremo delle Ombre", "Trofei"], itemCos: "omb_maschera_argento",
        items: [[4, 4], [33, 4], [8, 17], [29, 17]],
        areas: [
          [2, 2, 12, 10, "La Piazzola dell'Elicottero"],
          [25, 2, 35, 10, "La Torre del Faro"],
          [6, 8, 31, 20, "Il Campo d'Acciaio Terminale"]
        ],
        hints: () => ({
          "La Piazzola dell'Elicottero": "L'elicottero di Madame V con i motori accesi pronto a decollare verso la Svizzera.",
          "La Torre del Faro": "La massiccia lanterna nera che spazza il mare buio con un fascio azzurrino.",
          "Il Campo d'Acciaio Terminale": "Il rettangolo di gioco supremo dove si decide la libertà del calcio."
        }),
        act: {
          E: "Elicottero di Madame V", R: "Faro della Lanterna Nera",
          P: "Cancello d'accesso al campo supremo"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "M");
          Ls.lay(0, 0, 1, 23, "M");
          Ls.lay(36, 0, 37, 23, "M");
          Ls.lay(0, 22, 37, 23, "M");
          Ls.lay(2, 2, 35, 21, ".");

          // Piazzola elicottero
          Ls.put(5, 5, "E");

          // Torre del faro
          Ls.put(31, 5, "R");

          // Campo sintetico d'acciaio terminale
          Ls.lay(6, 9, 31, 19, "y");
          Ls.put(5, 9, "R");
          Ls.put(32, 9, "R");
        },
        npcs: (s) => [
          { id: "omb_madame_v", x: 8, y: 5, dir: "down", name: "Madame Vera" },
          { id: "omb_kaelen", x: 17, y: 8, dir: "down", name: "Kaelen Vance" },
          { id: "omb_silvia", x: 21, y: 8, dir: "down", name: "Silvia Moretti" },
          { id: "omb_zoran", x: 25, y: 8, dir: "down", name: "Zoran «Il Colosso»" }
        ]
      }
    };

    function madameVFinalTalk() {
      const s = S();
      if (s === 0 || s === 1) {
        return say([
          ["omb_madame_v", "(con il trench bagnato dal vento sotto le pale dell'elicottero, stringendo una valigetta di chiavi crittografiche) «Siete arrivati fin quassù. Non avrei mai creduto che un ragazzo di un borgo ligure e un manipolo di ribelli potessero abbattere il mio sindacato.»"],
          ["hero", "«Il talento non si compra e non si ricatta, Madame Vera. Il vostro impero di scommesse truccate finisce stanotte su questo tetto.»"],
          ["omb_madame_v", "«Non avete ancora vinto. I miei Cavalieri dell'Ombra sono pronti sul campo terminale. Se mi battete... l'Atollo cadrà nelle vostre mani. Ma a quale prezzo? Quale futuro sceglierete per questa fortezza?»"]
        ], () => {
          setStep(N, 2);
          note("Raggiunto il confronto finale con Madame Vera sul Tetto Supremo!");
          chooseFinalDestiny();
        });
      }
      if (s === 2) {
        return chooseFinalDestiny();
      }
      if (s === 3) {
        return ask("omb_madame_v", "«I Cavalieri dell'Ombra vi attendono sul campo terminale. Sei pronto al match definitivo, {n}?»", [
          {
            label: "⚽ [FISCHIO D'INIZIO]: Gioca la Finale del Secolo sul Tetto!",
            cls: "hot",
            fn: () => startFinalMatch()
          },
          { label: "◂ Un attimo di respiro", fn: done }
        ]);
      }
      return say([
        ["omb_madame_v", "«Hai vinto tu, Campione. Il calcio appartiene a chi ha il coraggio di sognare...»"]
      ], done);
    }

    function chooseFinalDestiny() {
      ask("hero", "Le tue scelte hanno condotto a questo istante. Quale destino scegli per la Lanterna Nera?", [
        {
          label: "🌟 [FINALE 1 · LA LANTERNA SPEZZATA]: Verità & Giustizia mondiali!",
          sub: "Maya diffonde le prove in diretta satellitare, arresto dei boss e ritorno da eroe puro",
          cls: "hot",
          fn: () => {
            F.set("finale_ombre", "verita");
            setStep(N, 3);
            note("Scelto Finale 1: La Lanterna Spezzata!");
            say([
              ["omb_maya", "«Ho agganciato tutti i network sportivi! Al 90° minuto la verità illuminerà il mondo!»"]
            ], done);
          }
        },
        {
          label: "👑 [FINALE 2 · IL SIGNORE DELL'ATOLLO]: Crea la Lega Libera Sotterranea!",
          sub: "Con Zoran e i Titani, trasforma la fortezza in un rifugio per tutti i talenti oppressi",
          fn: () => {
            F.set("finale_ombre", "sovrano");
            setStep(N, 3);
            note("Scelto Finale 2: Il Signore dell'Atollo!");
            say([
              ["omb_zoran", "«Da stanotte questo atollo appartiene ai calciatori liberi. I Titani sono con te, Campione!»"]
            ], done);
          }
        },
        {
          label: "🤝 [FINALE 3 · IL PATTO DEI CORSARI]: Fuga notturna sul Tirreno!",
          sub: "Salpa col motoscafo Albatros con Kaelen e Maya per aprire scuole calcio nelle isole",
          fn: () => {
            F.set("finale_ombre", "corsari");
            setStep(N, 3);
            note("Scelto Finale 3: Il Patto dei Corsari!");
            say([
              ["omb_milo", "«Motoscafo pronto alla banchina! Prenderemo il largo verso la Corsica e la Grecia!»"]
            ], done);
          }
        },
        {
          label: "🧬 [FINALE 4 · LA CHIMERA REDENTA]: Trionfo Scientifico & Famiglia Moretti!",
          sub: "Silvia Moretti libera: l'algoritmo diventa un'app aperta e gratuita per i ragazzi del Borgo",
          fn: () => {
            F.set("finale_ombre", "chimera_redenta");
            setStep(N, 3);
            note("Scelto Finale 4: La Chimera Redenta!");
            say([
              ["omb_silvia", "«Tornerò a casa con te al Borgo da mio fratello Leo. Doneremo il futuro a tutti i ragazzi del quartiere!»"]
            ], done);
          }
        }
      ]);
    }

    function startFinalMatch() {
      X.playMatch({
        id: "omb_match_final",
        chap: "Il Circuito delle Ombre · Il Derby Supremo della Tempesta",
        us: "I Ribelli delle Ombre",
        mate: "Kaelen",
        min: 45,
        intro: "La finale del secolo sul tetto della Fortezza San Giuda sotto una tempesta maestosa! Il tuo Campione {n} e Kaelen Vance sfidano i Cavalieri dell'Ombra di Madame Vera!",
        team: (t, st) => ({
          name: "Cavalieri dell'Ombra di Madame V",
          col: "#3b0764",
          style: "Algoritmo Nero & Tiro delle Tenebre",
          atk: t(st.atk * 1.05),
          def: t(st.def * 1.1),
          vel: t(st.vel * 1.0),
          specials: ["Tiro delle Tenebre", "Muro dell'Algoritmo"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 4);
            finishChapter(N, "trionfo_supremo_ombre");
            note("SAGA COMPLETATA! Trionfo supremo sul Tetto della Falesia Cieca!");
            const rewMsg = reward("omb_ch4_win", {
              coins: 60,
              cos: "omb_maschera_argento",
              note: "Completata l'intera Saga del Circuito delle Ombre!"
            });

            const finKey = F.get("finale_ombre") || "verita";
            showFinalEpilogue(finKey, rewMsg);
          } else {
            say([
              ["omb_kaelen", "«Il vento ha deviato il tiro sul palo al 90° minuto! Ma la partita non è finita: rialzati, {n}! Insieme possiamo ribaltarla!»"]
            ], () => {
              ask("hero", "Vuoi riprovare subito la Finale Suprema sul Tetto?", [
                { label: "⚽ Rigioca la Finale Suprema", cls: "hot", fn: startFinalMatch },
                { label: "◂ Riorganizzati con i compagni", fn: done }
              ]);
            });
          }
        }
      });
    }

    function showFinalEpilogue(finKey, rewMsg) {
      const h = hero();
      const nm = (h && h.name) || "Campione";

      if (finKey === "verita") {
        say([
          ["voce", `RETEEE! AL MINUTO 93! Con una combinazione leggendaria tra «{tiro}» e il Tiro Eclisse, il pallone gonfia la rete d'acciaio! I Ribelli delle Ombre vincono la finale!`],
          ["omb_maya", `(al microfono satellitare) «Parla Maya Lindqvist in diretta mondiale da Fortezza San Giuda! I registri del sindacato, i contratti coercitivi e i video dell'asta sono trasmessi su tutti gli schermi d'Europa!»`],
          ["voce", `Sirene della Guardia Costiera squarciano la notte attorno all'atollo. Don Renzo e Madame Vera vengono circondati e arrestati!`],
          ["omb_kaelen", `(sorridendo alla luce dell'alba) «Dopo sette anni di incubo... il calcio è di nuovo libero. Grazie, ${nm}.»`],
          ["hero", `«Torniamo a casa. Al Borgo Marino c'è un campo che ci aspetta per giocare a calcio vero!»`],
          ["voce", `<b>🏆 EPILOGO 1: LA LANTERNA SPEZZATA RAGGIUNTO!</b><br><span style="color:#38bdf8">${rewMsg}</span><br>Hai salvato lo sport e sei tornato a casa da autentica leggenda!`]
        ], done);
      } else if (finKey === "sovrano") {
        say([
          ["voce", `GOOOOL AL 90° MINUTO! Il boato dei marinai e dei corsari fa tremare la roccaforte!`],
          ["hero", `(salendo sulla torre della Lanterna Nera) «Da oggi questo posto non appartiene più a strozzini e speculatori. Questo atollo sarà il rifugio di tutti i campioni dimenticati dal sistema!»`],
          ["omb_zoran", `«I Titani d'Acciaio sono al tuo servizio, Campione!»`],
          ["omb_madame_v", `(lasciando la fortezza su una lancia con amaro rispetto) «Hai vinto tu, ragazzo. Sei diventato il vero sovrano del mare.»`],
          ["voce", `<b>👑 EPILOGO 2: IL SIGNORE DELL'ATOLLO RAGGIUNTO!</b><br><span style="color:#38bdf8">${rewMsg}</span><br>Hai fondato la prima Lega Libera Indipendente del Mediterraneo!`]
        ], done);
      } else if (finKey === "corsari") {
        say([
          ["voce", `GOL LEGGENDARIO ALL'INCROCIO DEI PALI! Fischio finale sul tetto della fortezza!`],
          ["omb_milo", `«Motoscafo Albatros carico alla banchina! Abbiamo i fondi di Don Renzo e viveri per un anno intero!»`],
          ["omb_kaelen", `(al timone dell'Albatros mentre taglia le onde dell'alba verso la Corsica) «Niente federazioni corrotte, niente contratti capestro. Fondiamo scuole calcio libere su ogni isola!»`],
          ["hero", `(guardando la fortezza svanire nella nebbia) «Il nostro vero viaggio comincia adesso!»`],
          ["voce", `<b>🤝 EPILOGO 3: IL PATTO DEI CORSARI RAGGIUNTO!</b><br><span style="color:#38bdf8">${rewMsg}</span><br>Hai acceso la rivoluzione del calcio popolare in mare aperto!`]
        ], done);
      } else {
        say([
          ["voce", `RETE TRIONFALE AL 90°! Il pallone piega i riflettori e chiude la partita del secolo!`],
          ["omb_silvia", `(stringendo ${nm} in un abbraccio colmo di commozione) «Ce l'abbiamo fatta! Ho riscritto il codice di Chimera: ora non calcola quote per le scommesse, ma consiglia ai giovani del Borgo come migliorare postura e traiettorie gratis!»`],
          ["hero", `«Leo sarà orgoglioso di te, Silvia. La famiglia Moretti ha regalato il futuro al nostro quartiere.»`],
          ["omb_kaelen", `«E la mia scuola calcio al molo adotterà il programma fin da domani mattina!»`],
          ["voce", `<b>🧬 EPILOGO 4: LA CHIMERA REDENTA RAGGIUNTO!</b><br><span style="color:#38bdf8">${rewMsg}</span><br>Hai riportato Silvia a casa e donato la scienza al Borgo Marino!`]
        ], done);
      }
    }

    return {
      n: N,
      title: "La Battaglia della Falesia Cieca & I Quattro Epiloghi",
      goal,
      zones,
      talk: {
        omb_madame_v: madameVFinalTalk,
        omb_kaelen: () => say([["omb_kaelen", "«Siamo pronti al fischio d'inizio, {n}. Fai brillare il tuo «{tiro}»!»"]], done),
        omb_silvia: () => say([["omb_silvia", "«I sensori del campo sono con noi. Vinciamo questa finale per tutti i ragazzi del Borgo!»"]], done),
        omb_zoran: () => say([["omb_zoran", "«Se Madame V prova a scappare con l'elicottero, ci penso io a bloccare le pale!»"]], done)
      },
      obj: {
        "omb_tetto_supremo:E": () => {
          madameVFinalTalk();
        }
      }
    };
  });

  // ------------------------------------------------------------------ Pulsante Esci e Avvio
  function setupExitButton() {
    const existing = document.getElementById("ombExit");
    if (existing) return;
    const st = document.createElement("style");
    st.textContent = `
      #ombExit {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 36px; padding: 6px 14px; border-radius: 10px;
        border: 1px solid rgba(56, 189, 248, 0.7); background: rgba(15, 23, 42, 0.92);
        color: #e0f2fe; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.7); cursor: pointer;
      }
      #ombExit.on { display: block; }
      #ombExit:active { transform: translateY(1px); }
    `;
    document.head.appendChild(st);

    const btn = document.createElement("button");
    btn.id = "ombExit"; btn.type = "button";
    btn.textContent = "✕ Esci dal Circuito delle Ombre";
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

  function openMain(opts) {
    opts = obj(opts);
    EXIT = typeof opts.onExit === "function" ? opts.onExit : null;
    const h = hero();
    if (!h || !h.name) {
      if (api && api.scene) {
        api.scene(
          "omb_darsena_notte", "voce",
          "<b>Il Circuito delle Ombre</b><br>Questa modalità è riservata al tuo <b>Campione Personalizzato</b>.<br>Crea prima il tuo Campione scegliendo nome, maglia, numero e tiro speciale!",
          [
            {
              label: "Crea il Tuo Campione", cls: "hot",
              fn: () => { if (window.openHeroStoryMenu) window.openHeroStoryMenu(EXIT); }
            },
            { label: "◂ Indietro", fn: leave }
          ],
          "Il Circuito delle Ombre"
        );
      }
      return;
    }

    const c = activeChapter();
    const curZ = (c && c.zones && Object.keys(c.zones)[0]) || "omb_darsena";
    const startPos = (c && c.zones && c.zones[curZ] && c.zones[curZ].start) || [19, 21];

    if (!mem().intro[c.n]) {
      mem().intro[c.n] = 1; save();
      castHero();
      api.scene(
        "omb_darsena_notte", "voce",
        `<b>Atollo della Falesia Cieca · Mezzanotte</b><br>La Caligo ligure cancella la costa. Sei sbarcato dal peschereccio nero Nadir convocato con un invito anonimo in ceralacca.<br>Ma appena scendi a terra, una saracinesca d'acciaio crolla sull'acqua sigillando l'uscita.<br><br><b>«Benvenuto alla Lanterna Nera, ${esc(h.name)} (N.${esc(h.num)})... qui il calcio non serve per le cartoline. Serve per sopravvivere.»</b>`,
        [
          { label: "Inizia l'Infiltrazione ▸", cls: "hot", fn: () => go(curZ, startPos[0], startPos[1]) }
        ],
        "Il Circuito delle Ombre"
      );
    } else {
      go(curZ, startPos[0], startPos[1]);
    }
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
  window.__campioneOmbre = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "🌃 Il Circuito delle Ombre",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Infiltrazione notturna, Visore delle Ombre e 4 Finali"}`
          : "Crea prima il tuo campione · Saga noir notturna con Visore e tornei clandestini"
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
