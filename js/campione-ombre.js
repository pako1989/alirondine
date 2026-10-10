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
      name: h.name, tag: "ombra", hair: h.hair, style: h.style, skin: h.skin, eye: "#38bdf8",
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
    // Cielo notturno plumbeo con fumo industriale e lampi lontani
    grad(g, 0, 0, W, H, ["#050811", "#0b1329", "#111c38"]);

    // Sagoma della Fortezza San Giuda sugli scogli a picco in lontananza
    g.fillStyle = "#03060c";
    g.beginPath();
    g.moveTo(20, 100); g.lineTo(35, 60); g.lineTo(80, 50); g.lineTo(110, 75); g.lineTo(130, 100);
    g.closePath(); g.fill();
    // Faro/Riflettore della torre della fortezza
    R(g, 72, 42, 12, 10, "#08101e");
    const lBeam = (Math.sin(f * 0.04) * 0.5 + 0.5);
    glow(g, 78, 47, 24, "56,189,248", 0.6 * lBeam);
    g.fillStyle = "#bae6fd"; g.fillRect(77, 46, 2, 2);

    // Gru industriali portuali scheletriche
    [160, 260].forEach((gx, idx) => {
      g.strokeStyle = "#08101d";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(gx, 115); g.lineTo(gx + 12, 60); g.lineTo(gx + 24, 115);
      g.moveTo(gx - 16, 60); g.lineTo(gx + 44, 52);
      g.stroke();
      // Luce rossa d'ingombro in cima alla gru
      const fl = Math.sin(f * 0.1 + idx) > 0 ? 0.9 : 0.2;
      glow(g, gx + 44, 52, 6, "239,68,68", fl);
    });

    // Mare nero increspato della darsena con riflessi d'olio al neon
    grad(g, 0, 115, W, 85, ["#020814", "#061324", "#030a16"]);
    for (let i = 0; i < 12; i++) {
      const rx = (i * 35 + f * 0.5) % (W + 50) - 25;
      const ry = 125 + (i % 4) * 14;
      g.fillStyle = i % 2 === 0 ? "rgba(56, 189, 248, 0.25)" : "rgba(168, 85, 247, 0.2)";
      g.fillRect(rx, ry, 26, 1);
    }

    // Peschereccio nero "Nadir" ormeggiato a sinistra
    R(g, 15, 122, 54, 16, "#0a0a10");
    R(g, 25, 112, 22, 10, "#16161f");
    R(g, 34, 102, 3, 10, "#27272a");
    // Fumo dal camino
    g.fillStyle = "rgba(148, 163, 184, 0.25)";
    for (let i = 0; i < 3; i++) {
      g.beginPath(); g.arc(35 + Math.sin(f * 0.05 + i) * 6, 95 - i * 8, 4 + i * 2, 0, Math.PI * 2); g.fill();
    }

    // Molo d'attracco in primo piano con banchina di cemento bagnato
    R(g, 0, 152, W, 48, "#0f172a");
    R(g, 0, 152, W, 2, "#38bdf8"); //striscia segnaletica ciano bagnata
    for (let x = 0; x < W; x += 28) {
      R(g, x, 154, 1, 46, "#090d16");
    }
    // Bitte d'ormeggio e lampioni industriali
    [50, 275].forEach((bx) => {
      R(g, bx - 2, 140, 4, 14, "#334155");
      glow(g, bx, 138, 20, "250,204,21", 0.75);
      R(g, bx - 1, 136, 2, 4, "#fef08a");
    });

    // Pioggia sottile animata
    g.strokeStyle = "rgba(186, 230, 253, 0.35)";
    g.lineWidth = 1;
    for (let i = 0; i < 28; i++) {
      const rx = (i * 21 + f * 4) % W;
      const ry = (i * 17 + f * 7) % H;
      g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 3, ry + 9); g.stroke();
    }
  }

  // Sfondo 2: I Cunicoli Idraulici & La Cripta della Fortezza
  function bgCunicoliNotte(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#06080e", "#0e1520", "#080c14"]);
    // Mattoni a vista scuri con muffa e umidità
    for (let y = 10; y < 140; y += 14) {
      const off = (y % 28 === 0) ? 0 : 12;
      for (let x = 0; x < W; x += 24) {
        g.strokeStyle = "#04060a";
        g.lineWidth = 1;
        g.strokeRect(x + off, y, 24, 14);
      }
    }

    // Tubature a vista giganti con condensa
    R(g, 0, 35, W, 10, "#1e293b");
    R(g, 0, 37, W, 2, "#475569");
    R(g, 110, 20, 12, 120, "#1e293b");
    R(g, 112, 20, 2, 120, "#475569");

    // Valvole di scarico e lampada rossa d'emergenza
    glow(g, 210, 50, 28, "239,68,68", 0.7 + Math.sin(f * 0.1) * 0.2);
    R(g, 208, 48, 4, 6, "#fca5a5");

    // Monitor/terminale verde fosfori hackerato
    R(g, 40, 80, 48, 34, "#020617");
    R(g, 42, 82, 44, 30, "#052e16");
    g.fillStyle = "#22c55e";
    g.font = "6px monospace";
    g.fillText("> CHIMERA_SYS", 44, 92);
    g.fillText("> BYPASS: OK", 44, 100);
    glow(g, 64, 97, 24, "34,197,94", 0.4);

    // Pavimento di grate d'acciaio con scarico d'acqua sottostante
    R(g, 0, 145, W, 55, "#0b1120");
    g.strokeStyle = "#1e293b";
    for (let x = 0; x < W; x += 8) {
      g.beginPath(); g.moveTo(x, 145); g.lineTo(x, 200); g.stroke();
    }
    // Riflesso bluastro di scarico
    R(g, 0, 160, W, 4, "rgba(56, 189, 248, 0.25)");
  }

  // Sfondo 3: La Gabbia delle Onde (Arena Clandestina)
  function bgGabbiaOnde(g, W, H, f) {
    // Cielo notturno in tempesta sopra il mare aperto
    grad(g, 0, 0, W, H, ["#020617", "#0f172a", "#1e1b4b"]);

    // Scogliera nera e marosi che sbattono sui tralicci
    g.fillStyle = "#050814";
    g.beginPath();
    g.moveTo(0, 130); g.lineTo(60, 95); g.lineTo(160, 90); g.lineTo(260, 95); g.lineTo(W, 130);
    g.lineTo(W, 200); g.lineTo(0, 200);
    g.closePath(); g.fill();

    // Spruzzi delle onde sul fondo
    g.fillStyle = "rgba(224, 242, 254, 0.45)";
    for (let i = 0; i < 7; i++) {
      const sx = (i * 50 + f * 0.7) % (W + 60) - 30;
      const sy = 120 + Math.sin(f * 0.08 + i) * 6;
      g.beginPath(); g.arc(sx, sy, 16, 0, Math.PI * 2); g.fill();
    }

    // Quattro torri con riflettori giganti
    [30, 90, 230, 290].forEach((rx, idx) => {
      R(g, rx - 3, 40, 6, 85, "#1e293b");
      R(g, rx - 6, 36, 12, 8, "#334155");
      const lightCol = idx % 2 === 0 ? "56,189,248" : "250,204,21";
      glow(g, rx, 40, 36, lightCol, 0.75 + Math.sin(f * 0.05 + idx) * 0.15);
      R(g, rx - 2, 38, 4, 4, "#ffffff");

      // Fascio di luce proiettato verso il campo
      g.fillStyle = `rgba(${lightCol}, 0.18)`;
      g.beginPath();
      g.moveTo(rx, 42); g.lineTo(rx - 45, 175); g.lineTo(rx + 45, 175);
      g.closePath(); g.fill();
    });

    // Campo sintetico della Gabbia delle Onde
    R(g, 20, 125, W - 40, 75, "#0b2545");
    g.strokeStyle = "rgba(56, 189, 248, 0.85)";
    g.lineWidth = 1.5;
    g.strokeRect(30, 135, W - 60, 60);

    // Cerchio di centrocampo
    g.beginPath(); g.arc(W / 2, 165, 20, 0, Math.PI * 2); g.stroke();

    // Reticolato metallico della gabbia (recinzione)
    g.strokeStyle = "rgba(148, 163, 184, 0.3)";
    g.lineWidth = 1;
    for (let x = 20; x <= W - 20; x += 12) {
      g.beginPath(); g.moveTo(x, 105); g.lineTo(x, 195); g.stroke();
    }
  }

  const BGS = {
    omb_darsena_notte: bgDarsenaNotte,
    omb_cunicoli_sotterranei: bgCunicoliNotte,
    omb_arena_gabbia: bgGabbiaOnde
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
  // Pavimenti:
  //   _ = Asfalto bagnato
  //   = = Grata metallica industriale
  //   . = Lastre di cemento scuro del molo
  //   ~ = Acqua scura della rada con riflessi
  //   y = Manto sintetico della gabbia
  // Solidi:
  //   M = Parete di cemento armato
  //   C = Container portuale (ciano/rosso)
  //   G = Generatore elettrico trifase
  //   R = Riflettore alogeno su traliccio
  //   P = Paratia stagna / saracinesca blindata
  //   T = Terminale dati olografico
  //   X = Cassaforte / cassa di contrabbando
  //   B = Bitta d'ormeggio con fune
  //   b = Barile di carburante
  //   > < ^ d = Varchi e porte di transito
  const FLOORS = '_=.~y';
  const SOLID = 'MCGRPTXBb><^d';
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
      // Asfalto bagnato scuro
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0b121e" : "#0f172a");
      if (r < 0.25) P(sx + 4, sy + 6, 6, 2, "rgba(56, 189, 248, 0.35)"); // riflesso pozzanghera
    } else if (f === "=") {
      // Grata metallica industriale
      P(sx, sy, 16, 16, "#090d16");
      P(sx, sy + 3, 16, 1, "#334155");
      P(sx, sy + 7, 16, 1, "#334155");
      P(sx, sy + 11, 16, 1, "#334155");
      P(sx, sy + 15, 16, 1, "#334155");
      for (let i = 0; i < 16; i += 4) P(sx + i, sy, 1, 16, "#1e293b");
    } else if (f === ".") {
      // Lastre di cemento scuro della darsena
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#1e293b" : "#334155");
      P(sx, sy + 15, 16, 1, "#0f172a");
      P(sx + 15, sy, 1, 16, "#0f172a");
      if (r < 0.15) P(sx + 5, sy + 4, 3, 2, "#475569");
    } else if (f === "~") {
      // Acqua nera della rada con riflessi
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#030712" : "#020b18");
      P(sx + 3, sy + 6, 8, 2, "rgba(56, 189, 248, 0.4)");
      if (r < 0.2) P(sx + 8, sy + 11, 4, 1, "rgba(168, 85, 247, 0.35)");
    } else if (f === "y") {
      // Manto sintetico della Gabbia delle Onde
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0c2340" : "#0f2f56");
      if (tx % 6 === 0) P(sx, sy, 1, 16, "rgba(56, 189, 248, 0.3)");
      if (ty % 6 === 0) P(sx, sy, 16, 1, "rgba(56, 189, 248, 0.3)");
    }
  }

  const PAINT = {
    M(sx, sy, tx, ty) {
      // Parete di cemento armato industriale
      P(sx, sy, 16, 16, "#090e17");
      P(sx, sy + 1, 16, 2, "#1e293b");
      P(sx, sy + 8, 16, 1, "#030712");
      P(sx + 3, sy + 4, 2, 2, "#334155");
      P(sx + 11, sy + 11, 2, 2, "#334155");
    },
    C(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Container portuale
      const col = (tx % 2 === 0) ? "#0284c7" : "#b91c1c";
      const colD = (tx % 2 === 0) ? "#0369a1" : "#991b1b";
      P(sx + 1, sy + 1, 14, 14, col);
      for (let i = 3; i < 14; i += 3) {
        P(sx + i, sy + 2, 1, 12, colD);
      }
      P(sx + 1, sy + 14, 14, 1, "#0f172a");
    },
    G(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Generatore elettrico trifase
      P(sx + 2, sy + 3, 12, 12, "#1e293b");
      P(sx + 4, sy + 5, 8, 6, "#334155");
      const spark = (fr >> 3) % 2 === 0 ? "#38bdf8" : "#facc15";
      P(sx + 7, sy + 7, 2, 2, spark);
      P(sx + 3, sy + 13, 10, 2, "#0f172a");
    },
    R(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Riflettore alogeno su traliccio
      P(sx + 6, sy + 6, 4, 10, "#334155");
      P(sx + 4, sy + 2, 8, 5, "#475569");
      const fl = Math.sin(fr / 8 + tx * 2) * 1.5;
      GP.fillStyle = "#ffd23f";
      GP.beginPath(); GP.arc(sx + 8, sy + 4, 3 + fl * 0.2, 0, 7); GP.fill();
      P(sx + 7, sy + 3, 2, 2, "#ffffff");
    },
    P(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Paratia blindata / saracinesca
      P(sx + 1, sy + 1, 14, 14, "#1e293b");
      P(sx + 2, sy + 3, 12, 1, "#ef4444");
      P(sx + 2, sy + 7, 12, 1, "#334155");
      P(sx + 2, sy + 11, 12, 1, "#334155");
      P(sx + 7, sy + 8, 2, 3, "#facc15"); // pannello keycard
    },
    T(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Terminale dati olografico
      P(sx + 2, sy + 4, 12, 11, "#090d16");
      P(sx + 3, sy + 5, 10, 6, "#052e16");
      const blink = (fr >> 4) % 2 === 0 ? "#22c55e" : "#4ade80";
      P(sx + 5, sy + 7, 6, 2, blink);
      P(sx + 4, sy + 12, 8, 2, "#1e293b"); // tastiera
    },
    X(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Cassaforte / cassa contrabbando
      P(sx + 2, sy + 3, 12, 11, "#1e293b");
      P(sx + 4, sy + 5, 8, 7, "#0f172a");
      P(sx + 7, sy + 7, 2, 3, "#facc15"); // serratura magnetica
      P(sx + 2, sy + 3, 12, 1, "#475569");
    },
    B(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Bitta d'ormeggio con corda
      P(sx + 5, sy + 4, 6, 9, "#334155");
      P(sx + 4, sy + 3, 8, 3, "#475569");
      P(sx + 2, sy + 11, 12, 2, "#d97706"); // gomena avvolta
    },
    b(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Barile di carburante
      P(sx + 3, sy + 2, 10, 12, "#1e293b");
      P(sx + 2, sy + 4, 12, 8, "#334155");
      P(sx + 2, sy + 6, 12, 1, "#ef4444"); // striscia pericolo
      P(sx + 2, sy + 10, 12, 1, "#ef4444");
    },
    ">": (sx, sy, tx, ty) => passTile(sx, sy, ">"),
    "<": (sx, sy, tx, ty) => passTile(sx, sy, "<"),
    "^": (sx, sy, tx, ty) => passTile(sx, sy, "^"),
    "d": (sx, sy, tx, ty) => passTile(sx, sy, "d")
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

    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} (Infiltrato alla Lanterna Nera)<br><span style="color:var(--dim)">Tiro Clandestino: «${esc(h.shotName || "Il Tiro delle Ombre")}»</span><br><br><b>Fascicolo & Dossier Intercettati</b><br>${clueRows}<br><br><b>Scelte Tattiche & Codice Morale</b><br>• <b>Tattica nella Gabbia (Cap. 1):</b> <span style="color:var(--dim)">${cTact}</span><br><br><span style="color:var(--dim)">Vittorie nella Gabbia: ${m.wins} · Sconfitte: ${m.losses}</span>`;

    if (inZone) {
      api.trAsk("voce", html, [{ label: "◂ Torna all'Infiltrazione", fn: done }], bgNow());
    } else {
      api.scene(bgNow(), "voce", html, [{ label: "◂ Indietro", fn: back }], "Fascicolo delle Ombre");
    }
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
      // 1. La Darsena del Molo Nero
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

          // Banchine di cemento
          Ls.lay(2, 2, 37, 23, ".");
          // Piazzale asfalto
          Ls.lay(10, 10, 29, 22, "_");

          // Container industriali
          Ls.lay(3, 4, 7, 7, "C");
          Ls.lay(32, 4, 36, 7, "C");
          Ls.lay(4, 14, 8, 17, "C");
          Ls.lay(31, 14, 35, 17, "C");

          // Bitte e generatori
          Ls.put(2, 21, "B");
          Ls.put(37, 21, "B");
          Ls.put(18, 5, "G");
          Ls.put(21, 5, "T");
          Ls.put(14, 12, "R");
          Ls.put(25, 12, "R");

          // Ingresso ai cunicoli (porta ^ al centro nord)
          Ls.put(19, 2, "^");
          Ls.put(20, 2, "^");

          // Uscita verso la gabbia a sud-est
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

      // 2. I Cunicoli della Lanterna Nera
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

          // Pavimento a grate industriali
          Ls.lay(2, 2, 33, 19, "=");

          // Pareti interne e corridoi
          Ls.lay(14, 2, 15, 9, "M");
          Ls.lay(20, 2, 21, 9, "M");

          // Macchinari e terminali
          Ls.put(5, 4, "G");
          Ls.put(7, 4, "b");
          Ls.put(27, 4, "T");
          Ls.put(29, 4, "X");

          // Uscita verso Darsena (d) e verso Gabbia (>)
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

      // 3. La Gabbia delle Onde (Arena Clandestina)
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

          // Banchina esterna
          Ls.lay(2, 2, 35, 21, ".");

          // Campo sintetico centrale
          Ls.lay(6, 6, 31, 18, "y");

          // Torri riflettori agli angoli
          Ls.put(5, 5, "R");
          Ls.put(32, 5, "R");
          Ls.put(5, 19, "R");
          Ls.put(32, 19, "R");

          // Porte d'accesso
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

    // ---------------------------------------------------------------- Dialoghi & Eventi NPC
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
      const s = S();
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
          def: t(st.def * 1.05), // Bilanciamento perfetto per garantire tiri fluidi e gol soddisfacenti
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
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Infiltrazione notturna, Visore delle Ombre e Gabbia"}`
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
