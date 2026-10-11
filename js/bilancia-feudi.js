// ============================================================================
// LA BILANCIA DELLE TRE CORONE · IL GIUDIZIO DEI FEUDI
// Nuova Grande Saga Tattica Medievale per il Tuo Campione
// Ispirata a Triangle Strategy, Tactics Ogre e Suikoden
// Motore 2D Camminabile HD con Bilancia delle Convinzioni (Moralità / Utilità / Libertà),
// Consiglio dei Feudi, Gettoni del Giudizio, Prove Nascoste e Partite d'Elevazione Tattica.
// ============================================================================

(function () {
  "use strict";

  if (window.__bilanciaFeudiLoaded) return;
  window.__bilanciaFeudiLoaded = true;

  const KEY = "ali-di-rondine.bilancia-feudi";
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

  // ------------------------------------------------------------------ Web Audio Synthesizer Feudale
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  // Squillo di Trombe & Corno Medievale
  function sfxFeudalFanfare() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [220, 277.18, 329.63, 440].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.001, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.08 + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.65);
      });
    } catch (e) {}
  }

  // Tintinnio Metallico & Bilancia del Giudizio
  function sfxScalesBalance() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [880, 1174.66, 1760].forEach((f, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        g.gain.setValueAtTime(0.35, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.45);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.06); osc.stop(now + i * 0.06 + 0.5);
      });
    } catch (e) {}
  }

  // Caduta del Gettone d'Oro sulla Bilancia
  function sfxCoinWeigh() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.18);
      g.gain.setValueAtTime(0.4, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Scricchiolio del Ponte Levatoio e Catene
  function sfxDrawbridge() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.4);
      g.gain.setValueAtTime(0.3, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.5);
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Memoria & Convinzioni (Triangle Strategy)
  function mem() {
    const d = {
      ch: 1,
      step: {},
      done: {},
      intro: {},
      rew: {},
      zone: null,
      tokens: 3, // Gettoni d'Oro del Giudizio
      convictions: {
        moralita: 10,
        utilita: 10,
        liberta: 10
      },
      clues: [],    // Indizi e prove raccolti
      decisions: {} // Decisioni storiche prese
    };
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return d;
      const p = JSON.parse(raw);
      if (!p || typeof p !== "object") return d;
      return {
        ch: clampI(p.ch, 1, 4, 1),
        step: obj(p.step),
        done: obj(p.done),
        intro: obj(p.intro),
        rew: obj(p.rew),
        zone: p.zone || null,
        tokens: clampI(p.tokens, 0, 99, 3),
        convictions: Object.assign({ moralita: 10, utilita: 10, liberta: 10 }, obj(p.convictions)),
        clues: Array.isArray(p.clues) ? p.clues : [],
        decisions: obj(p.decisions)
      };
    } catch (e) {
      return d;
    }
  }

  function save(m) {
    try {
      localStorage.setItem(KEY, JSON.stringify(m || mem()));
    } catch (e) {}
  }

  function addConviction(type, pts, reason) {
    const m = mem();
    if (m.convictions[type] != null) {
      m.convictions[type] += pts;
      save(m);
      sfxScalesBalance();
      if (api && api.trToast) {
        const label = type === "moralita" ? "Moralità" : type === "utilita" ? "Utilità" : "Libertà";
        const icon = type === "moralita" ? "⚖️" : type === "utilita" ? "📜" : "🕊️";
        api.trToast(`${icon} Convinzione: +${pts} ${label} · ${reason || ""}`);
      }
    }
  }

  function addClue(id, title, desc) {
    const m = mem();
    if (!m.clues.some((c) => c.id === id)) {
      m.clues.push({ id, title, desc, time: Date.now() });
      m.tokens = (m.tokens || 0) + 1; // Ogni prova raccolta conferisce un gettone aggiuntivo
      save(m);
      sfxCoinWeigh();
      if (api && api.trToast) {
        api.trToast(`📜 Nuova Prova: ${title} (+1 Gettone d'Oro)`);
      }
    }
  }

  const F = {
    get: (k, d) => { const m = mem(); return m.decisions[k] != null ? m.decisions[k] : d; },
    set: (k, v) => { const m = mem(); m.decisions[k] = v; save(m); }
  };

  // ------------------------------------------------------------------ Sfondi Scenografici Procedurali HD
  function px(g, x, y, w, h, col) { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }

  function bgConsiglioWolffort(g, W, H, f) {
    // Sala del Trono & del Consiglio con vetrate cattedrale e bracieri ardenti
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0b0f19");
    sky.addColorStop(0.5, "#18233c");
    sky.addColorStop(1, "#241812");
    g.fillStyle = sky; g.fillRect(0, 0, W, H);

    // Vetrate policrome gotiche centrali con fasci di luce dorati
    for (let i = 0; i < 3; i++) {
      const vx = 90 + i * 50;
      g.fillStyle = "#1e293b";
      g.beginPath();
      g.moveTo(vx, 70); g.lineTo(vx, 20);
      g.arc(vx + 18, 20, 18, Math.PI, 0);
      g.lineTo(vx + 36, 70); g.closePath(); g.fill();

      // Raggi di luce filtranti
      const lightGrad = g.createLinearGradient(vx + 18, 20, vx + 18, H);
      lightGrad.addColorStop(0, "rgba(253, 224, 71, 0.22)");
      lightGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
      g.fillStyle = lightGrad;
      g.beginPath();
      g.moveTo(vx + 4, 30); g.lineTo(vx - 20, H); g.lineTo(vx + 56, H); g.lineTo(vx + 32, 30);
      g.closePath(); g.fill();

      // Motivi della vetrata (Il Falco di Wolffort al centro)
      px(g, vx + 16, 26, 4, 18, "#f59e0b");
      px(g, vx + 10, 32, 16, 4, "#ef4444");
    }

    // Pavimento in lastre di marmo bicolore a scacchiera prospettica
    const floor = g.createLinearGradient(0, 110, 0, H);
    floor.addColorStop(0, "#292524");
    floor.addColorStop(1, "#1c1917");
    g.fillStyle = floor; g.fillRect(0, 110, W, H - 110);

    for (let y = 110; y < H; y += 14) {
      g.strokeStyle = "#44403c"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
    }
    for (let x = -40; x < W + 40; x += 36) {
      g.strokeStyle = "#38332f"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, 110); g.lineTo(x * 1.4 - 50, H); g.stroke();
    }

    // La Monumentale Bilancia del Giudizio d'Oro (sullo sfondo)
    const bx = W / 2, by = 60;
    // Fusto centrale
    px(g, bx - 3, by - 24, 6, 68, "#eab308");
    px(g, bx - 14, by + 40, 28, 6, "#ca8a04");
    // Braccio basculante della bilancia (oscilla leggermente)
    const m = mem();
    const diff = (m.convictions.liberta - m.convictions.utilita) * 0.02;
    const ang = Math.sin((f || 0) / 40) * 0.03 + diff;
    g.save();
    g.translate(bx, by - 16);
    g.rotate(ang);
    px(g, -54, -2, 108, 4, "#facc15");
    // Piatti della Bilancia
    // Sinistra (Moralità/Libertà)
    g.strokeStyle = "#eab308"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(-50, 0); g.lineTo(-58, 26); g.moveTo(-50, 0); g.lineTo(-42, 26); g.stroke();
    px(g, -64, 26, 28, 4, "#ca8a04");
    // Destra (Utilità)
    g.beginPath(); g.moveTo(50, 0); g.lineTo(42, 26); g.moveTo(50, 0); g.lineTo(58, 26); g.stroke();
    px(g, 36, 26, 28, 4, "#ca8a04");
    g.restore();

    // Bracieri laterali con fiamme medievali animate
    [32, W - 32].forEach((fx, idx) => {
      px(g, fx - 8, 92, 16, 20, "#52525b");
      px(g, fx - 12, 88, 24, 5, "#3f3f46");
      const flameH = 14 + Math.sin((f || 0) / 5 + idx * 3) * 4;
      const fl = g.createRadialGradient(fx, 86, 2, fx, 86, flameH);
      fl.addColorStop(0, "#fef08a");
      fl.addColorStop(0.4, "#f97316");
      fl.addColorStop(1, "rgba(220, 38, 38, 0)");
      g.fillStyle = fl;
      g.beginPath(); g.arc(fx, 84, flameH, 0, Math.PI * 2); g.fill();
    });

    // Grande tavolo ovale del Consiglio dei Sette Feudi
    g.fillStyle = "#3b1e08";
    g.beginPath(); g.ellipse(W / 2, 160, 96, 28, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#854d0e"; g.lineWidth = 2.5; g.stroke();
    // Mappa tattica srotolata al centro del tavolo
    px(g, W / 2 - 28, 150, 56, 20, "#fef3c7");
    px(g, W / 2 - 12, 154, 8, 4, "#1d4ed8");
    px(g, W / 2 + 6, 154, 8, 4, "#dc2626");
  }

  function bgMastioWolffort(g, W, H, f) {
    // Cortile d'Armi del Mastio con mura merlate e cielo alpino
    const sky = g.createLinearGradient(0, 0, 0, 100);
    sky.addColorStop(0, "#1e3a8a");
    sky.addColorStop(1, "#60a5fa");
    g.fillStyle = sky; g.fillRect(0, 0, W, 100);

    // Cime innevate lontane
    g.fillStyle = "#e2e8f0";
    g.beginPath();
    g.moveTo(0, 75); g.lineTo(50, 35); g.lineTo(110, 80);
    g.lineTo(170, 25); g.lineTo(240, 85); g.lineTo(W, 40); g.lineTo(W, 100); g.lineTo(0, 100);
    g.closePath(); g.fill();

    // Mura in pietra del Mastio con merlature
    g.fillStyle = "#64748b";
    g.fillRect(0, 70, W, 45);
    for (let x = 0; x < W; x += 24) {
      px(g, x, 56, 14, 16, "#475569");
    }

    // Pavimentazione in ciottoli del cortile d'armi
    const ground = g.createLinearGradient(0, 115, 0, H);
    ground.addColorStop(0, "#78716c");
    ground.addColorStop(1, "#44403c");
    g.fillStyle = ground; g.fillRect(0, 115, W, H - 115);

    // Stendardi araldici del Falco rosso e oro mossi dal vento
    [60, W - 60].forEach((bx, idx) => {
      px(g, bx - 1, 30, 3, 50, "#1e293b");
      const sway = Math.sin((f || 0) / 14 + idx) * 4;
      g.fillStyle = "#b91c1c";
      g.beginPath();
      g.moveTo(bx + 2, 32); g.lineTo(bx + 30 + sway, 34);
      g.lineTo(bx + 24 + sway, 54); g.lineTo(bx + 2, 50);
      g.closePath(); g.fill();
      // Bordo dorato
      px(g, bx + 10 + sway * 0.5, 40, 6, 6, "#fbbf24");
    });

    // Sagome di manichini d'allenamento e rastrelliere d'aste
    px(g, 36, 128, 4, 24, "#713f12");
    px(g, 30, 134, 16, 10, "#d97706");
  }

  function bgGlenbrookDighe(g, W, H, f) {
    // Fortezza Fluviale di Glenbrook con cascate e paratie
    const sky = g.createLinearGradient(0, 0, 0, 80);
    sky.addColorStop(0, "#0c4a6e");
    sky.addColorStop(1, "#38bdf8");
    g.fillStyle = sky; g.fillRect(0, 0, W, 80);

    // Torri della Diga di Glenbrook
    g.fillStyle = "#334155";
    px(g, 40, 20, 48, 80, "#475569");
    px(g, W - 88, 20, 48, 80, "#475569");
    // Ponte di pietra centrale
    px(g, 0, 80, W, 25, "#64748b");

    // Cascata d'acqua fluviale impetuosa con spruzzi animati
    const water = g.createLinearGradient(0, 105, 0, H);
    water.addColorStop(0, "#0284c7");
    water.addColorStop(0.5, "#0369a1");
    water.addColorStop(1, "#075985");
    g.fillStyle = water; g.fillRect(0, 105, W, H - 105);

    // Schiuma e corrente animata
    for (let y = 110; y < H; y += 12) {
      const offset = Math.sin((f || 0) / 8 + y) * 12;
      px(g, 20 + offset, y, 70, 2, "rgba(224, 242, 254, 0.45)");
      px(g, 150 + offset, y, 90, 2, "rgba(224, 242, 254, 0.35)");
    }
  }

  function bgGlacefortMiniere(g, W, H, f) {
    // Miniere di Sale di Glacefort (cristalli turchesi nel buio e ghiaccio)
    const cave = g.createLinearGradient(0, 0, 0, H);
    cave.addColorStop(0, "#020617");
    cave.addColorStop(0.5, "#0f172a");
    cave.addColorStop(1, "#1e293b");
    g.fillStyle = cave; g.fillRect(0, 0, W, H);

    // Stalattiti di sale candido
    for (let x = 10; x < W; x += 22) {
      const h = 20 + (x % 37);
      g.fillStyle = "#cbd5e1";
      g.beginPath();
      g.moveTo(x, 0); g.lineTo(x + 10, 0); g.lineTo(x + 5, h);
      g.closePath(); g.fill();
    }

    // Cristalli di sale fosforescenti turchesi
    [40, 110, 210, 280].forEach((cx, i) => {
      const cy = 110 + (i % 3) * 18;
      const glow = g.createRadialGradient(cx, cy, 2, cx, cy, 18);
      glow.addColorStop(0, "rgba(56, 189, 248, 0.7)");
      glow.addColorStop(1, "rgba(56, 189, 248, 0)");
      g.fillStyle = glow;
      g.beginPath(); g.arc(cx, cy, 18, 0, Math.PI * 2); g.fill();
      // Cristallo sfaccettato
      g.fillStyle = "#e0f2fe";
      g.beginPath();
      g.moveTo(cx, cy - 10); g.lineTo(cx + 6, cy); g.lineTo(cx, cy + 10); g.lineTo(cx - 6, cy);
      g.closePath(); g.fill();
    });

    // Pavimento coperto da coltre di sale bianco e binari dei carrelli
    px(g, 0, 140, W, H - 140, "#94a3b8");
    px(g, 0, 144, W, 4, "#f8fafc");
    // Binari in ferro scuro
    px(g, 0, 160, W, 2, "#334155");
    px(g, 0, 172, W, 2, "#334155");
    for (let x = 0; x < W; x += 16) {
      px(g, x, 158, 4, 18, "#475569");
    }
  }

  function bgColosseoFeudi(g, W, H, f) {
    // Anfiteatro del Gran Giudizio dei Tre Feudi
    const sky = g.createLinearGradient(0, 0, 0, 70);
    sky.addColorStop(0, "#78350f");
    sky.addColorStop(0.5, "#d97706");
    sky.addColorStop(1, "#fde68a");
    g.fillStyle = sky; g.fillRect(0, 0, W, 70);

    // Archi del Colosseo Imperiale
    g.fillStyle = "#e7e5e4";
    px(g, 0, 50, W, 50, "#d6d3d1");
    for (let x = 12; x < W; x += 32) {
      g.fillStyle = "#292524";
      g.beginPath();
      g.moveTo(x, 90); g.lineTo(x, 62);
      g.arc(x + 10, 62, 10, Math.PI, 0);
      g.lineTo(x + 20, 90); g.closePath(); g.fill();
    }

    // Tribuna Reale dei Tre Feudi con stendardi tricolori (Rosso, Zaffiro, Bianco)
    px(g, W / 2 - 40, 36, 80, 24, "#451a03");
    px(g, W / 2 - 32, 40, 18, 16, "#b91c1c"); // Wolffort
    px(g, W / 2 - 9, 40, 18, 16, "#1d4ed8");  // Glenbrook
    px(g, W / 2 + 14, 40, 18, 16, "#0284c7"); // Glacefort

    // Sabbia dorata del campo da gioco
    const sand = g.createLinearGradient(0, 100, 0, H);
    sand.addColorStop(0, "#fde047");
    sand.addColorStop(1, "#ca8a04");
    g.fillStyle = sand; g.fillRect(0, 100, W, H - 100);

    // Linee bianche di calce del campo feudale
    g.strokeStyle = "rgba(255, 255, 255, 0.75)"; g.lineWidth = 2;
    g.strokeRect(16, 114, W - 32, H - 128);
    g.beginPath(); g.moveTo(W / 2, 114); g.lineTo(W / 2, H - 14); g.stroke();
    g.beginPath(); g.arc(W / 2, 155, 24, 0, Math.PI * 2); g.stroke();
  }

  const BGS = {
    feudi_consiglio: bgConsiglioWolffort,
    feudi_mastio: bgMastioWolffort,
    feudi_glenbrook: bgGlenbrookDighe,
    feudi_glacefort: bgGlacefortMiniere,
    feudi_colosseo: bgColosseoFeudi
  };

  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) {
      safe(() => BGS[kind](g, W || 320, H || 200, frame || 0));
      return true;
    }
    return typeof prevBg === "function" ? prevBg.apply(this, arguments) : false;
  };

  // ------------------------------------------------------------------ Set Tessere 16x16 Feudale
  const SOLID = "#~WSMCPGTA";

  function drawTile(ch, sx, sy, tx, ty) {
    const g = document.getElementById("cv").getContext("2d");
    if (ch === ",") {
      // Lastricato nobile levigato
      px(g, sx, sy, TS, TS, (tx + ty) % 2 ? "#d6d3d1" : "#e7e5e4");
      if ((tx * 3 + ty * 7) % 5 === 0) px(g, sx + 5, sy + 7, 3, 2, "#a8a29e");
    } else if (ch === ".") {
      // Terra battuta e ciottoli
      px(g, sx, sy, TS, TS, (tx + ty) % 2 ? "#78716c" : "#854d0e");
      if ((tx * 5 + ty * 3) % 4 === 0) px(g, sx + 6, sy + 5, 2, 2, "#57534e");
    } else if (ch === "_") {
      // Parquet in noce del mastio
      px(g, sx, sy, TS, TS, (tx + ty) % 2 ? "#451a03" : "#3b1e08");
      px(g, sx, sy + 7, TS, 1, "#271202");
    } else if (ch === "~") {
      // Canale d'acqua
      px(g, sx, sy, TS, TS, "#0284c7");
      if ((tx + ty + Math.floor(Date.now() / 250)) % 3 === 0) px(g, sx + 3, sy + 6, 8, 1, "#bae6fd");
    } else if (ch === "=") {
      // Ponte in travi di quercia
      px(g, sx, sy, TS, TS, "#713f12");
      px(g, sx, sy + 3, TS, 1, "#451a03");
      px(g, sx, sy + 11, TS, 1, "#451a03");
    } else if (ch === "#") {
      // Mura in pietra massiccia
      px(g, sx, sy, TS, TS, "#475569");
      px(g, sx, sy, TS, 2, "#94a3b8");
      px(g, sx, sy + 7, TS, 1, "#334155");
    } else if (ch === "W") {
      // Torretta feudale
      px(g, sx, sy, TS, TS, "#334155");
      px(g, sx + 5, sy + 4, 6, 8, "#0f172a");
    } else if (ch === "B") {
      // Portone ad arco
      px(g, sx, sy, TS, TS, "#52525b");
      px(g, sx + 2, sy + 2, 12, 14, "#451a03");
      px(g, sx + 7, sy + 8, 2, 2, "#eab308");
    } else if (ch === "M") {
      // Banco del mercato feudale
      px(g, sx, sy, TS, TS, "#854d0e");
      px(g, sx + 2, sy + 1, 12, 5, "#dc2626");
      px(g, sx + 3, sy + 8, 10, 6, "#fef08a");
    } else if (ch === "X") {
      // Altare della Bilancia
      px(g, sx, sy, TS, TS, "#d97706");
      px(g, sx + 5, sy + 2, 6, 12, "#fbbf24");
      px(g, sx + 2, sy + 4, 12, 2, "#fef08a");
    } else if (ch === "H") {
      // Forgia del fabbro
      px(g, sx, sy, TS, TS, "#1e293b");
      px(g, sx + 3, sy + 5, 10, 8, "#ea580c");
      px(g, sx + 6, sy + 7, 4, 4, "#fde047");
    } else if (ch === "P") {
      // Torre di vedetta / Belvedere del borgo
      px(g, sx, sy, TS, TS, "#334155");
      px(g, sx + 2, sy + 2, 12, 12, "#475569");
      px(g, sx + 5, sy + 4, 6, 4, "#0f172a");
      px(g, sx + 7, sy, 2, 4, "#b91c1c"); // Stendardo piccolo
    } else if (ch === "C") {
      // Scuderie, carrello da trasporto o barca da pesca
      px(g, sx, sy, TS, TS, "#78350f");
      px(g, sx + 2, sy + 4, 12, 8, "#b45309");
      px(g, sx + 4, sy + 2, 8, 4, "#fef3c7");
    } else if (ch === "G") {
      // Sentinella di ferro / Paladino d'onore
      px(g, sx, sy, TS, TS, "#64748b");
      px(g, sx + 5, sy + 2, 6, 5, "#cbd5e1");
      px(g, sx + 4, sy + 7, 8, 8, "#475569");
      px(g, sx + 12, sy, 2, 16, "#eab308"); // Asta alabarda
    } else if (ch === "T") {
      // Pozzo in pietra con carrucola
      px(g, sx, sy, TS, TS, "#78716c");
      px(g, sx + 3, sy + 3, 10, 10, "#44403c");
      px(g, sx + 5, sy + 5, 6, 6, "#0284c7"); // Acqua nel pozzo
      px(g, sx + 7, sy + 1, 2, 4, "#713f12"); // Carrucola
    } else if (ch === "V") {
      // Grande Vetrata araldica
      px(g, sx, sy, TS, TS, "#18181b");
      px(g, sx + 2, sy + 1, 12, 14, "#1d4ed8");
      px(g, sx + 5, sy + 4, 6, 8, "#fbbf24");
    } else if (ch === "A") {
      // Scaffale degli Antichi Trattati
      px(g, sx, sy, TS, TS, "#451a03");
      px(g, sx + 2, sy + 3, 12, 3, "#fef3c7");
      px(g, sx + 2, sy + 9, 12, 3, "#93c5fd");
    } else if (ch === "S") {
      // Spalti dei Feudi / Palco reale
      px(g, sx, sy, TS, TS, "#451a03");
      px(g, sx + 1, sy + 1, 14, 6, "#b91c1c");
      px(g, sx + 3, sy + 8, 10, 6, "#fbbf24");
    } else {
      return false;
    }
    return true;
  }

  function makeLayers(w, h) {
    const map = Array.from({ length: h }, () => Array(w).fill("."));
    return {
      map,
      lay(x0, y0, x1, y1, ch) {
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            if (map[y] && x >= 0 && x < w) map[y][x] = ch;
          }
        }
      },
      put(x, y, ch) {
        if (map[y] && x >= 0 && x < w) map[y][x] = ch;
      }
    };
  }

  // ------------------------------------------------------------------ Gestione Eroe e Dialoghi
  const hero = () => (window.heroLoad ? window.heroLoad() : null);

  function castHero() {
    if (!api || !api.CAST) return;
    const h = hero();
    if (h) {
      api.CAST.hero = {
        name: h.name,
        tag: "Lord Custode",
        hair: h.hair || "#2b1d14",
        style: h.style || "spiky",
        skin: h.skin || "#f2c9a0",
        eye: h.eye || "#2a1a0a",
        shirt: h.shirt || "#b91c1c",
        num: String(h.num || 9),
        bg: [h.shirt || "#b91c1c", "#fbbf24"],
        acc: "sciarpa"
      };
    }
  }

  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "COLPO DEL FALCO" };
    return String(s || "")
      .replace(/\{n\}/g, h.name)
      .replace(/\{num\}/g, String(h.num))
      .replace(/\{tiro\}/g, h.shotName || "COLPO DEL FALCO");
  }

  const CHAPTERS = {};
  const ZONES = {};

  function addChapter(fn) {
    if (!api) { PENDING.push(fn); return; }
    const def = typeof fn === "function" ? fn(XTOOLS) : fn;
    if (!def || !def.n || CHAPTERS[def.n]) return;
    CHAPTERS[def.n] = def;
    Object.keys(def.zones || {}).forEach((zid) => registerZone(def.n, zid, def.zones[zid]));
  }

  function activeChapter() {
    const m = mem(); let best = null;
    Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).forEach((n) => {
      if (n <= m.ch) best = CHAPTERS[n];
    });
    return best || CHAPTERS[1] || null;
  }

  const zoneRec = () => (api ? ZONES[api.trZone()] : null);
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "feudi_consiglio";
  const stepOf = (chN) => clampI(mem().step[chN], 0, 99, 0);

  function setStep(chN, s) {
    const m = mem();
    m.step[chN] = s;
    save(m);
    refreshZone();
  }

  function note(txt) {
    if (api && api.trToast) api.trToast(T(txt));
  }

  function reward(key, o) {
    const m = mem();
    if (m.rew[key]) return "";
    m.rew[key] = 1; save(m);
    const bits = [];
    if (o.coins && api && api.addCoins) { api.addCoins(o.coins); bits.push(`+${o.coins} Monete d'Oro`); }
    if (o.cos && api && api.bCos) { api.bCos(o.cos); bits.push("Nuovo Manufatto Araldico"); }
    return bits.join(" · ");
  }

  function coinsGive(n) {
    if (api && api.addCoins) { api.addCoins(n); return n; }
    return 0;
  }

  function bal() { return api && api.bCoins ? api.bCoins() : 0; }

  function say(lines, then) {
    if (!Array.isArray(lines) || !lines.length) { if (typeof then === "function") then(); return; }
    castHero();
    const bg = bgNow();
    api.trSay(lines.map((l) => api.L(l[0] === "hero" ? "hero" : l[0], T(l[1]), l[2] || bg)), then || done);
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

  const done = () => { refreshZone(); if (api && api.trResume) api.trResume(); };

  function go(zid, tx, ty) {
    const tr = api && api.trRec ? api.trRec() : null;
    if (tr) tr.pos[zid] = [tx * TS + 8, ty * TS + 12];
    enterZone(zid);
  }

  function enterZone(zid) {
    const zr = ZONES[zid]; if (!zr) return;
    const m = mem(); m.zone = zid; save(m);
    castHero();
    if (api && api.trRec) api.trRec().seen[zid] = true;
    if (api && api.trGo) api.trGo(zid);
    refreshZone();
    if (!m.intro[zid]) {
      m.intro[zid] = 1; save(m);
      if (zr.spec.intro && zr.spec.intro.length) return say(zr.spec.intro, done);
    }
    if (api && api.trToast) api.trToast(zr.spec.short);
  }

  function registerZone(chN, zid, spec) {
    const Z = {
      name: spec.name, short: spec.short, sub: spec.sub || "", need: 0,
      w: spec.w, h: spec.h, start: spec.start, theme: spec.theme || "torino",
      bus: "cancello", busLabel: "Lascia il Feudo",
      isCustomSaga: true,
      item: spec.item || ["Gettone del Consiglio", "Gettoni"], itemCos: spec.itemCos, items: spec.items || [],
      bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID,
      // Risoluzione bug commit ee010d9: actLabels & act espliciti su tutti i caratteri interattivi
      actLabels: Object.assign({
        "B": "🚪 Portone Feudale",
        "M": "⚖️ Banco delle Risorse",
        "X": "⚖️ Altare della Bilancia",
        "H": "🔨 Forgia d'Acciaio",
        "P": "🏰 Belvedere del Borgo",
        "C": "🐴 Scuderie & Carri",
        "G": "🛡️ Sentinella dei Feudi",
        "T": "⛲ Pozzo della Piazza",
        "V": "🪟 Vetrata Araldica",
        "A": "📜 Archivio Trattati",
        "S": "🏟️ Spalti del Gran Giudizio",
        ">": "🚪 Varchi del Feudo",
        "<": "🚪 Varchi del Feudo",
        "^": "🚪 Varchi del Feudo",
        "v": "🚪 Varchi del Feudo",
        "D": "🚪 Portone del Consiglio"
      }, spec.actLabels || {}),
      act: Object.assign({}, spec.act || {}),
      intro: [],
      me: () => {
        const c = api.CAST.hero || api.CAST.leo;
        return Object.assign({}, c, { shirt: (hero() && hero().shirt) || "#b91c1c" });
      },
      drawItem(x, y, i) {
        const cv = document.getElementById("cv");
        const g = cv ? cv.getContext("2d") : null;
        if (!g) return;
        // Gettone d'Oro scintillante
        g.fillStyle = "#eab308";
        g.beginPath(); g.arc(x, y, 4.5, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#fef08a";
        g.beginPath(); g.arc(x, y, 2.5, 0, Math.PI * 2); g.fill();
        px(g, x - 1, y - 2, 2, 4, "#ca8a04");
      }
    };

    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso per Consiglio, Bilancia ed Esci." });

    Z.build = function (m) {
      const Ls = makeLayers(spec.w, spec.h);
      Ls.lay(0, 0, spec.w - 1, spec.h - 1, ",");
      spec.build(Ls);
      for (let y = 0; y < spec.h; y++) {
        for (let x = 0; x < spec.w; x++) {
          if (m[y] && Ls.map[y]) m[y][x] = Ls.map[y][x];
        }
      }
    };

    Z.tile = function (ch, sx, sy, tx, ty) { return drawTile(ch, sx, sy, tx, ty); };
    Z.menu = () => openCouncilModal();

    Z.onObj = function (ch, tx, ty) {
      const zr = ZONES[zid]; if (!zr) return false;
      const c = activeChapter(); if (!c) return false;
      const o = c.obj || {};
      const f = o[zid + ":" + ch + ":" + tx + "," + ty] ||
                o[zid + ":" + tx + "," + ty] ||
                o[zid + ":" + ch] ||
                o[ch];
      if (typeof f === "function") { f({ ch, tx, ty, zid }); return true; }
      return false;
    };

    api.TRZ[zid] = Z;
    ZONES[zid] = { ch: chN, spec, Z };
  }

  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch] || activeChapter();
    castHero();
    const list = zr.spec.npcs ? zr.spec.npcs(stepOf(c.n)) : [];
    const hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(stepOf(c.n)) : zr.spec.hints || {});

    // Nessun mirino o freccia guida per non semplificare il gioco (richiesta esplicita utente)
    zr.Z.npcs = list.filter((n) => api.CAST && api.CAST[n.id]).map((n) => {
      const at = Array.isArray(n.at) ? n.at : [n.x != null ? n.x : 0, n.y != null ? n.y : 0];
      return Object.assign({}, n, { at, x: at[0], y: at[1] });
    });

    [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => {
      if (k) hints[k] = hints[k] || "Esplora i segreti del feudo.";
    });
    zr.Z.hints = hints;
  }

  function leave() {
    const back = EXIT || window.title;
    EXIT = null;
    if (api && api.trExitTo) api.trExitTo(typeof back === "function" ? back : null);
  }

  function finishChapter(n, reason) {
    const m = mem();
    m.done[n] = reason || "completato";
    if (m.ch <= n) m.ch = n + 1;
    save(m);
  }

  // ------------------------------------------------------------------ Partite Tattiche del Giudizio Feudale
  const VENUE_FEUDI = {
    ads: [["CASA WOLFFORT", "#991b1b"], ["REGNO DI GLENBROOK", "#1d4ed8"], ["DUCATI D'ACCIAIO", "#0f172a"], ["LEGA DEI ROSELIANI", "#db2777"]],
    crowd: ["#7f1d1d", "#1e3a8a", "#0f172a", "#831843", "#78350f"],
    ground: ["#78716c", "#57534e"],
    line: "#fef08acc",
    grid: "rgba(254,240,138,.10)",
    tint: "rgba(30,20,10,.25)",
    glow: "234,179,8",
    glow2: "220,38,38"
  };

  function playFeudalMatch(cfg) {
    if (!api || !api.match) return;
    const h = hero() || { name: "Campione", num: 9, shotName: "COLPO DEL FALCO", shot: "saetta" };
    castHero();

    const m = mem();
    const cM = (m.convictions && m.convictions.moralita) || 0;
    const cU = (m.convictions && m.convictions.utilita) || 0;
    const cL = (m.convictions && m.convictions.liberta) || 0;
    let stanceLabel = "⚖️ Bilanciamento Neutro";
    let stanceBonus = "Formazione bilanciata dei Tre Feudi";
    let spdBonus = 0;
    let defBonus = 0;
    let atkBonus = 0;

    if (cM >= cU && cM >= cL && cM > 0) {
      stanceLabel = "⚖️ Vantaggio Feudale · Moralità";
      stanceBonus = "Schieramento del Baluardo Leale: Erador & Roland alzano il muro difensivo (+Resistenza e contrasti)!";
      defBonus = 2;
    } else if (cU >= cL && cU > 0) {
      stanceLabel = "📜 Vantaggio Feudale · Utilità";
      stanceBonus = "Calcolo Strategico di Benedict: linee corte, contropiedi millimetrici e tiri calibrati sul palo lontano!";
      atkBonus = 2;
    } else if (cL > 0) {
      stanceLabel = "🕊️ Vantaggio Feudale · Libertà";
      stanceBonus = "Vento di Rivolta dei Roselliani: Frederica ispira scatti brucianti sulle fasce e dribbling imprevedibili!";
      spdBonus = 0.4;
    }

    const homeSquad = [
      { name: h.name, skin: h.skin || "#f2c9a0", hair: h.hair || "#2b1d14", spd: 5.3 + spdBonus },
      { name: "Roland", skin: "#fed7aa", hair: "#ca8a04", spd: 5.4 + spdBonus },
      { name: "Frederica", skin: "#fde2e4", hair: "#f472b6", spd: 5.0 + spdBonus },
      { name: "Erador", skin: "#e2e8f0", hair: "#94a3b8", spd: 4.6 + spdBonus }
    ];

    const opps = Array.isArray(cfg.oppNames) && cfg.oppNames.length >= 5
      ? cfg.oppNames
      : ["Portiere Corazzato", "Cavaliere di Ferro", "Lanciere dei Feudi", "Alfiere d'Acciaio", "Campione d'Assalto"];

    const baseIntro = (cfg.intro || "Sfida tattica sui campi d'elevazione dei Tre Feudi!").replace("{tiro}", h.shotName || "COLPO DEL FALCO");
    const richIntro = `${baseIntro}<br><span style="color:#fde047;font-size:12px;display:inline-block;margin-top:4px;"><b>${stanceLabel}</b>: ${stanceBonus}</span>`;

    const matchCfg = {
      id: "feudi_" + (cfg.id || hash(cfg.title || "match")),
      chap: cfg.title || "Il Torneo del Giudizio dei Feudi",
      intro: richIntro,
      us: "Casa Wolffort & I Custodi",
      mate: cfg.mate || "Roland",
      mateGeneric: true,
      squad: homeSquad,
      oppNames: opps,
      team: (t, st) => ({
        name: cfg.teamName || "Legione d'Acciaio",
        color: cfg.teamCol || "#1e293b",
        col: cfg.teamCol || "#1e293b",
        atk: Math.max(15, (cfg.atk || 26) - defBonus),
        def: Math.max(15, (cfg.def || 27) - atkBonus),
        vel: cfg.vel || 25,
        power: 27,
        special: [cfg.specialName || "CARICA DEI FEUDI", 29]
      }),
      venue: cfg.venue || VENUE_FEUDI,
      weather: cfg.weather || "sereno",
      alt: "hd,cage,az",
      onDone: (res) => {
        const win = !!res.win;
        if (win) {
          sfxFeudalFanfare();
          mem().wins = (mem().wins || 0) + 1;
          mem().tokens = (mem().tokens || 0) + 1;
          if (window.toast) window.toast("Vittoria Feudale! +1 Gettone del Giudizio 🪙", "info", "⚖️");
        } else {
          mem().losses = (mem().losses || 0) + 1;
          if (window.toast) window.toast("Sconfitta sul campo d'armi. Riprova o adatta la strategia!", "warn", "🛡️");
        }
        save();
        if (typeof cfg.done === "function") {
          cfg.done({ ...res, win });
        }
      }
    };

    if (api.matchPick) api.matchPick(matchCfg);
    else api.match(matchCfg);
  }

  // ------------------------------------------------------------------ UI Unica · La Bilancia del Consiglio
  function openCouncilModal() {
    const m = mem();
    const h = hero();
    const nm = h ? h.name : "Lord Custode";

    const totalC = m.convictions.moralita + m.convictions.utilita + m.convictions.liberta;
    const pM = Math.round((m.convictions.moralita / (totalC || 1)) * 100);
    const pU = Math.round((m.convictions.utilita / (totalC || 1)) * 100);
    const pL = Math.round((m.convictions.liberta / (totalC || 1)) * 100);

    const dominant = m.convictions.moralita >= m.convictions.utilita && m.convictions.moralita >= m.convictions.liberta
      ? "⚖️ Moralità (Giustizia & Onore di Roland)"
      : m.convictions.utilita >= m.convictions.liberta
      ? "📜 Utilità (Pragmatismo & Calcolo di Benedict)"
      : "🕊️ Libertà (Compassione & Rivoluzione di Frederica)";

    const cluesHtml = m.clues.length
      ? m.clues.map((c) => `<div style="margin:4px 0;padding:6px 10px;background:rgba(255,255,255,0.06);border-left:3px solid #fbbf24;border-radius:4px;"><b>📜 ${esc(c.title)}</b>: <small style="color:#cbd5e1">${esc(c.desc)}</small></div>`).join("")
      : "<em style='color:#94a3b8'>Nessuna prova raccolta finora. Esplora il feudo per scovarne di nascoste!</em>";

    api.scene(
      "feudi_consiglio", "fe_benedict",
      `<b>⚖️ La Bilancia delle Tre Corone · Consiglio di Casa Wolffort</b><br>` +
      `Lord ${esc(nm)}, ecco lo stato delle convinzioni del feudo e i voti del Consiglio:<br><br>` +
      `<div style="display:flex;gap:12px;margin:8px 0;font-size:13px;">` +
      `  <div style="flex:1;background:rgba(220,38,38,0.25);border:1px solid #ef4444;border-radius:8px;padding:8px;text-align:center;"><b>⚖️ Moralità</b><br><span style="font-size:18px;color:#fca5a5;">${m.convictions.moralita}</span> (${pM}%)</div>` +
      `  <div style="flex:1;background:rgba(30,58,138,0.25);border:1px solid #3b82f6;border-radius:8px;padding:8px;text-align:center;"><b>📜 Utilità</b><br><span style="font-size:18px;color:#93c5fd;">${m.convictions.utilita}</span> (${pU}%)</div>` +
      `  <div style="flex:1;background:rgba(190,24,93,0.25);border:1px solid #ec4899;border-radius:8px;padding:8px;text-align:center;"><b>🕊️ Libertà</b><br><span style="font-size:18px;color:#fbcfe8;">${m.convictions.liberta}</span> (${pL}%)</div>` +
      `</div>` +
      `<small style="color:#fde047;">Orientamento Dominante Attuale: <b>${dominant}</b></small><br>` +
      `<small style="color:#38bdf8;">Gettoni del Giudizio Disponibili: <b>${m.tokens}</b> 🪙</small><br><br>` +
      `<b>Dossier delle Prove e dei Documenti Acquisiti:</b><br>${cluesHtml}`,
      [
        { label: "Consulto Tattico con Benedict", sub: "Lo stratega calcolatore", fn: () => talkCounselor("fe_benedict") },
        { label: "Consulto Feudale con Roland", sub: "Il principe di Glenbrook", fn: () => talkCounselor("fe_roland") },
        { label: "Consulto Ideale con Frederica", sub: "La voce dei Roselliani", fn: () => talkCounselor("fe_frederica") },
        { label: "◂ Riprendi l'Esplorazione", fn: done }
      ],
      "La Bilancia delle Tre Corone"
    );
  }

  function talkCounselor(id) {
    if (id === "fe_benedict") {
      say([
        ["fe_benedict", "«Lord {n}, non possiamo permetterci il lusso del sentimentalismo. In tempo di guerra, un solo barile di sale grezzo vale più di dieci giuramenti cavallereschi. Se volete proteggere il feudo, dovete pesare il vantaggio con il freddo calcolo.»"],
        ["hero", "«La vittoria ha senso solo se resta un feudo da governare, Benedict.»"],
        ["fe_benedict", "«Esattamente ciò che vostro padre avrebbe risposto. Usiamo la Bilancia con saggezza.»"]
      ], openCouncilModal);
    } else if (id === "fe_roland") {
      say([
        ["fe_roland", "«Amico mio, non abbandonerò il mio popolo alle grinfie di Glacefort. La lealtà alla corona di Glenbrook non si vende al mercato del sale. Finché avrò la forza di calciare, lotterò per la giustizia!»"],
        ["hero", "«Siamo compagni d'armi e di campo, Roland. Resteremo compatti.»"]
      ], openCouncilModal);
    } else {
      say([
        ["fe_frederica", "«{n}, i Roselliani scavano nelle miniere di sale come schiavi senza nome. Se il nostro feudo accetta quel monopolio macchiato di lacrime, non saremo migliori dei tiranni di Glacefort. Dobbiamo spezzare quelle catene!»"],
        ["hero", "«La dignità umana viene prima di qualsiasi trattato, Frederica.»"]
      ], openCouncilModal);
    }
  }

  // ------------------------------------------------------------------ Pulsante Contestuale "La Bilancia del Consiglio"
  function setupCouncilFloatingButton() {
    const existing = document.getElementById("feudiCouncilBtn");
    if (existing) return;

    const st = document.createElement("style");
    st.textContent = `
      #feudiCouncilBtn {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 38px; padding: 7px 15px; border-radius: 12px;
        border: 1.5px solid rgba(251, 191, 36, 0.85); background: rgba(24, 24, 27, 0.94);
        color: #fef08a; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .25px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.7), 0 0 10px rgba(251, 191, 36, 0.35); cursor: pointer;
      }
      #feudiCouncilBtn.on { display: block; }
      #feudiCouncilBtn:active { transform: translateY(1px); }
    `;
    document.head.appendChild(st);

    const btn = document.createElement("button");
    btn.id = "feudiCouncilBtn"; btn.type = "button";
    btn.innerHTML = "⚖️ La Bilancia del Consiglio";
    btn.onclick = () => {
      openCouncilModal();
    };
    document.body.appendChild(btn);

    setInterval(() => {
      const live = !!(zoneRec() && document.body.classList.contains("borgo"));
      btn.classList.toggle("on", live);
      if (live) {
        const padacts = document.querySelector(".padacts");
        const bMenu = document.getElementById("bMenu");
        if (padacts && bMenu && !document.getElementById("bBilancia")) {
          const bBil = document.createElement("button");
          bBil.id = "bBilancia";
          bBil.type = "button";
          bBil.className = "pad";
          bBil.style.borderColor = "rgba(251, 191, 36, 0.85)";
          bBil.style.color = "#fef08a";
          bBil.textContent = "⚖️ Bilancia";
          bBil.onclick = openCouncilModal;
          padacts.insertBefore(bBil, bMenu);
        }
      }
    }, 250);
  }

  const XTOOLS = {
    T: { TS }, F,
    stepOf, setStep, note, addConviction, addClue,
    reward, coinsGive, bal, hero, castHero, say, ask, done, go, enterZone,
    playMatch: playFeudalMatch, finishChapter,
    sfxFeudalFanfare, sfxScalesBalance, sfxCoinWeigh, sfxDrawbridge,
    esc,
    cos: (id, def) => { if (api && api.COSM) api.COSM[id] = def; else COS_Q.push([id, def]); },
    cast: (id, def, bio) => { if (api && api.CAST) { api.CAST[id] = def; if (bio && api.BIO) api.BIO[id] = bio; } else CAST_Q.push([id, def, bio]); },
  };

  // ------------------------------------------------------------------ Inizializzazione Cast Feudale
  function registerCast() {
    XTOOLS.cast("fe_benedict", {
      name: "Benedict", tag: "Stratega", hair: "#cbd5e1", style: "slick", skin: "#e8c9a8", eye: "#475569",
      shirt: "#1e3a8a", bg: ["#1e3a8a", "#93c5fd"], num: "4"
    }, "Stratega supremo di Casa Wolffort. Freddo calcolatore di Utilità, devoto alla prosperità del feudo.");

    XTOOLS.cast("fe_roland", {
      name: "Principe Roland", tag: "Erede di Glenbrook", hair: "#ca8a04", style: "spiky", skin: "#f0c9a0", eye: "#2563eb",
      shirt: "#2563eb", bg: ["#1d4ed8", "#ffd23f"], num: "7"
    }, "Principe cadetto di Glenbrook e migliore amico del Campione. Simbolo ardente di Moralità e rettitudine.");

    XTOOLS.cast("fe_frederica", {
      name: "Lady Frederica", tag: "Spirito dei Roselliani", hair: "#f472b6", style: "long", skin: "#f6d9c4", eye: "#0284c7",
      shirt: "#db2777", bg: ["#9d174d", "#fbcfe8"], num: "11"
    }, "Giovane nobildonna Aesfrost legata al popolo dei Roselliani. Simbolo di Libertà e riscatto.");

    XTOOLS.cast("fe_erador", {
      name: "Comandante Erador", tag: "Baluardo", hair: "#94a3b8", style: "buzz", skin: "#d9a77a", eye: "#334155",
      shirt: "#b91c1c", bg: ["#991b1b", "#fbbf24"], num: "5"
    }, "Veterano delle mura e gigante dal cuore leale. Difensore incrollabile dei Wolffort.");

    XTOOLS.cast("fe_avlora", {
      name: "Generale Avlora", tag: "Spada d'Acciaio", hair: "#18181b", style: "slick", skin: "#e2b99a", eye: "#dc2626",
      shirt: "#450a0a", bg: ["#7f1d1d", "#f87171"], num: "10"
    }, "La più temuta stratega d'assalto del Ducato d'Acciaio. Imbattuta sul campo.");

    XTOOLS.cos("feudi_elmo_falco", { kind: "acc", label: "Elmo del Falco Dorato", val: "feudi_elmo_falco", from: "Capitolo 1 · Bilancia dei Feudi" });
    XTOOLS.cos("feudi_stendardo_rosso", { kind: "shirt", label: "Cotta di Maglia dei Wolffort", val: "#b91c1c", from: "Capitolo 2 · Bilancia dei Feudi" });
    XTOOLS.cos("feudi_mantello_sale", { kind: "acc", label: "Mantello di Seta e Cristalli di Sale", val: "feudi_mantello_sale", from: "Capitolo 3 · Bilancia dei Feudi" });
    XTOOLS.cos("feudi_corona_norzelia", { kind: "acc", label: "Corona Unita delle Tre Corone", val: "feudi_corona_norzelia", from: "Finale d'Oro · Bilancia dei Feudi" });
  }

  // ------------------------------------------------------------------ UI Menu Saga
  function openMain(opts) {
    EXIT = (opts && opts.onExit) || EXIT || window.title;
    const a = window.__borgoApi;
    if (!a) return;
    const h = hero();
    if (!h) {
      a.scene("feudi_consiglio", "fe_benedict",
        "<b>La Bilancia delle Tre Corone · Il Giudizio dei Feudi</b><br>" +
        "Questa saga tattica feudale è forgiata per il tuo <b>Campione Personalizzato</b>.<br>" +
        "Crea o personalizza prima il tuo Campione per guidare Casa Wolffort!",
        [
          { label: "✨ Crea il tuo Campione ▸", cls: "hot", fn: () => { if (window.heroEditor) window.heroEditor(openMain); } },
          { label: "◂ Torna alle Modalità", fn: leave }
        ],
        "La Bilancia delle Tre Corone"
      );
      return;
    }

    castHero();
    const c = activeChapter();
    const m = mem();
    const chDone = c && m.done[c.n];

    a.scene(
      "feudi_consiglio", "fe_benedict",
      `<b>⚖️ La Bilancia delle Tre Corone · Il Giudizio dei Feudi</b><br>` +
      `Benvenuto a Castel Wolffort, Lord <b>${esc(h.name)}</b> (N.${esc(h.num)}).<br>` +
      `<span style="color:var(--dim)">«${esc(h.shotName || "Il Colpo del Falco")}»</span><br><br>` +
      `<span style="color:#fbbf24">${c ? "Capitolo " + c.n + " · " + esc(c.title) : "Saga dei Feudi"}</span><br>` +
      `<small style="color:#94a3b8">Convinzioni feudo: Moralità ${m.convictions.moralita} · Utilità ${m.convictions.utilita} · Libertà ${m.convictions.liberta} (Gettoni ${m.tokens} 🪙)</small>`,
      [
        {
          label: chDone ? (c.n < 4 ? `Avanti ▸ Inizia Capitolo ${c.n + 1}` : "Rigioca la Saga Feudale") : "Entra nel Feudo a piedi ▸",
          cls: "hot",
          fn: () => {
            if (chDone && c.n < 4) {
              m.ch = c.n + 1; save(m);
            }
            continueStory();
          }
        },
        { label: "⚖️ La Bilancia del Consiglio", sub: "Ispeziona convinzioni, prove e consiglieri", fn: openCouncilModal },
        { label: "◂ Torna alle Modalità", fn: leave }
      ],
      "La Bilancia delle Tre Corone"
    );
  }

  function continueStory() {
    const c = activeChapter(); if (!c) return;
    const m = mem();
    const curZ = (m.zone && ZONES[m.zone]) ? m.zone : Object.keys(c.zones || {})[0] || "feudi_mastio_ch1";
    const zr = ZONES[curZ];
    const sp = (zr && zr.spec.start) || [14, 14];

    if (!m.intro["ch" + c.n]) {
      m.intro["ch" + c.n] = 1; save(m);
      castHero();
      api.scene(
        "feudi_mastio", "fe_benedict",
        `<b>Castel Wolffort · Capitolo ${c.n}</b><br><b>${esc(c.title)}</b><br><br>` +
        `Il suono delle campane e i corni d'araldo echeggiano nella vallata.<br>` +
        `<b>«Lord ${esc(hero() ? hero().name : "Custode")}, il destino di Casa Wolffort e delle Tre Corone è nelle vostre mani.»</b>`,
        [{ label: "Entra nel Cortile d'Armi ▸", cls: "hot", fn: () => go(curZ, sp[0], sp[1]) }],
        "La Bilancia delle Tre Corone"
      );
      return;
    }

    const tr = api.trRec();
    if (!tr.pos[curZ]) tr.pos[curZ] = [sp[0] * TS + 8, sp[1] * TS + 12];
    enterZone(curZ);
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
        if (typeof f === "function") { castHero(); f(); return true; }
      }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
  }

  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match) {
      if (++tries < 200) setTimeout(init, 150);
      return;
    }
    api = a;
    registerCast();
    CAST_Q.splice(0).forEach(([id, c, bio]) => {
      if (a.CAST && !a.CAST[id]) a.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c);
      if (bio && a.BIO && !a.BIO[id]) a.BIO[id] = bio;
    });
    COS_Q.splice(0).forEach(([id, d]) => { if (a.COSM && !a.COSM[id]) a.COSM[id] = d; });
    PENDING.splice(0).forEach(addChapter);
    setupCouncilFloatingButton();
    installHooks();
  }

  // ============================================================================
  // CAPITOLO 1: L'EREDITÀ DEL FALCO & LA BILANCIA DEI TRE PIATTI
  // ============================================================================
  addChapter((X) => {
    const N = 1;
    const S = () => X.stepOf(N);

    return {
      n: N,
      title: "L'Eredità del Falco & La Bilancia del Giudizio",
      sub: "Il giuramento di Casa Wolffort, i carichi segreti di sale grezzo e la Giostra nel Cortile",
      zones: {
        feudi_mastio_ch1: {
          name: "Castel Wolffort · Cortile d'Armi del Mastio",
          short: "Mastio dei Wolffort",
          sub: "Mura merlate, stendardi del Falco e armieri al lavoro",
          w: 32, h: 22, start: [15, 17], theme: "torino", bg: "feudi_mastio",
          item: ["Gettone del Consiglio", "Gettoni"], itemCos: "feudi_elmo_falco",
          items: [[5, 6], [26, 6], [8, 14], [23, 15]],
          areas: [
            [2, 2, 29, 9, "Il Cortile Superiore d'Armi"],
            [2, 10, 29, 20, "La Piazza d'Adunata del Falco"]
          ],
          intro: [
            ["fe_benedict", "«Lord {n}, benvenuto al mastio di Casa Wolffort. Vostro padre Symon vi ha lasciato la guida del casato in un'ora buia.»", "feudi_mastio"],
            ["hero", "«I tre feudi sono davvero sull'orlo della guerra, Benedict?»", "feudi_mastio"],
            ["fe_benedict", "«Le scorte di sale di Glacefort scarseggiano e Glenbrook rifiuta di aprire le chiuse commerciali. Andate prima dal Comandante Erador vicino alla forgia: dobbiamo testare le difese.»", "feudi_mastio"]
          ],
          build(Ls) {
            Ls.lay(0, 0, 31, 21, ",");
            // Mura di cinta
            Ls.lay(0, 0, 31, 2, "#");
            Ls.lay(0, 0, 1, 21, "#");
            Ls.lay(30, 0, 31, 21, "#");
            Ls.lay(0, 20, 31, 21, "#");
            // Torrette merlate agli angoli
            Ls.put(0, 0, "W"); Ls.put(31, 0, "W");
            Ls.put(0, 21, "W"); Ls.put(31, 21, "W");
            // Forgia e Altare
            Ls.put(6, 4, "H");
            Ls.put(25, 4, "X");
            // Portone per la Sala del Consiglio
            Ls.put(15, 2, "B");
            // Mercante di grano
            Ls.put(8, 16, "M");
            // Elementi scenografici del borgo
            Ls.put(22, 16, "P"); // Belvedere delle Valli
            Ls.put(5, 15, "C");  // Scuderie e carri da guerra
            Ls.put(25, 14, "T"); // Pozzo antico della piazza
            Ls.put(15, 8, "G");  // Sentinella d'onore
          },
          actLabels: {
            "B": "🚪 Sala del Consiglio",
            "X": "⚖️ Altare della Bilancia",
            "H": "🔨 Forgia del Fabbro",
            "M": "⚖️ Carretto delle Risorse",
            "P": "🏰 Belvedere delle Valli",
            "C": "🐴 Scuderie & Carri da Guerra",
            "T": "⛲ Pozzo Antico della Piazza",
            "G": "🛡️ Sentinella d'Onore",
            "15,2": "🚪 Sala del Consiglio",
            "6,4": "🔨 Forgia del Fabbro",
            "25,4": "⚖️ Altare della Bilancia",
            "8,16": "⚖️ Carretto delle Risorse",
            "22,16": "🏰 Belvedere delle Valli",
            "5,15": "🐴 Scuderie & Carri da Guerra",
            "25,14": "⛲ Pozzo Antico della Piazza",
            "15,8": "🛡️ Sentinella d'Onore"
          },
          npcs: (s) => {
            const list = [
              { id: "fe_benedict", at: [13, 14], dir: "down", name: "Benedict" },
              { id: "fe_erador", at: [7, 6], dir: "down", name: "Erador" }
            ];
            if (s >= 1) {
              list.push({ id: "fe_roland", at: [18, 14], dir: "down", name: "Roland" });
              list.push({ id: "fe_frederica", at: [23, 6], dir: "down", name: "Frederica" });
            }
            return list;
          }
        },
        feudi_sala_consiglio_ch1: {
          name: "Castel Wolffort · Gran Sala della Bilancia",
          short: "Sala del Consiglio",
          sub: "La Bilancia delle Tre Corone, vetrate gotiche e bracieri ardenti",
          w: 26, h: 18, start: [13, 15], theme: "torino", bg: "feudi_consiglio",
          item: ["Gettone d'Oro Wolffort", "Gettoni"],
          items: [[4, 5], [21, 5], [13, 8]],
          areas: [
            [2, 2, 23, 16, "Il Santuario della Bilancia"]
          ],
          intro: [
            ["fe_benedict", "«Questa è la Gran Sala del Consiglio. Sulla Bilancia delle Tre Corone, ogni consigliere esprimerà il proprio voto ponderato coi Gettoni d'Oro.»", "feudi_consiglio"]
          ],
          build(Ls) {
            Ls.lay(0, 0, 25, 17, "_");
            Ls.lay(0, 0, 25, 1, "#");
            Ls.lay(0, 0, 1, 17, "#");
            Ls.lay(24, 0, 25, 17, "#");
            Ls.lay(0, 16, 25, 17, "#");
            // Uscita verso il Cortile
            Ls.put(13, 16, "D");
            // Monumento della Bilancia al centro
            Ls.put(13, 4, "X");
            // Elementi scenografici nobili
            Ls.put(13, 1, "V"); // Vetrata araldica del Falco
            Ls.put(4, 9, "A");  // Scaffale degli Antichi Trattati
            Ls.put(21, 9, "G"); // Statua di Lord Symon
          },
          actLabels: {
            "D": "🚪 Torna al Cortile d'Armi",
            "X": "⚖️ Bilancia del Giudizio",
            "V": "🪟 Vetrata del Falco Dorato",
            "A": "📜 Archivio degli Antichi Trattati",
            "G": "🗿 Statua di Lord Symon",
            "13,16": "🚪 Torna al Cortile d'Armi",
            "13,4": "⚖️ Bilancia del Giudizio",
            "13,1": "🪟 Vetrata del Falco Dorato",
            "4,9": "📜 Archivio degli Antichi Trattati",
            "21,9": "🗿 Statua di Lord Symon"
          },
          npcs: () => [
            { id: "fe_benedict", at: [9, 7], dir: "right", name: "Benedict" },
            { id: "fe_roland", at: [17, 7], dir: "left", name: "Roland" },
            { id: "fe_frederica", at: [13, 9], dir: "up", name: "Frederica" }
          ]
        }
      },
      talk: {
        fe_erador: () => {
          const s = S();
          if (s === 0) {
            say([
              ["fe_erador", "«Lord {n}! Che gioia vedervi in piedi con l'armatura del Falco! Vostro padre vi ha insegnato a calciare prima ancora di camminare.»", "feudi_mastio"],
              ["hero", "«Comandante Erador, qual è lo stato della guarnigione?»", "feudi_mastio"],
              ["fe_erador", "«I ragazzi sono pronti, ma la guardia ha bisogno di vedere la vostra autorità sul campo. Se volete che il castello vi segua, dovete battere il mio muro di scudi nella Giostra del Cortile!»", "feudi_mastio"],
              ["fe_erador", "«Ma prima... andate alla forgia dal vecchio fabbro: ha terminato i tacchetti d'acciaio commissionati per il vostro tiro!»", "feudi_mastio"]
            ], () => {
              setStep(N, 1);
              note("Vai alla forgia (in alto a sinistra, simbolo H) per ritirare i tacchetti d'acciaio.");
              done();
            });
            return;
          }
          if (s === 1) {
            say([["fe_erador", "«Andate prima alla forgia dal fabbro (tessera H) per ritirare i tacchetti d'acciaio!»", "feudi_mastio"]], done);
            return;
          }
          if (s === 2) {
            ask("fe_erador", "«Avete i tacchetti d'acciaio! Siete pronto per la Giostra del Cortile d'Armi contro il mio battaglione di scudi?»", [
              {
                label: "⚽ Inizia la Giostra del Cortile contro Erador!",
                cls: "hot",
                fn: () => startMatchCortile()
              },
              { label: "Un momento di respiro", fn: done }
            ]);
            return;
          }
          say([["fe_erador", "«Che tiro formidabile, Lord {n}! Il muro di Casa Wolffort è al vostro comando!»", "feudi_mastio"]], done);
        },
        fe_roland: () => {
          const s = S();
          if (s < 3) {
            say([["fe_roland", "«{n}, sono arrivato non appena ho saputo della scomparsa di Symon. Qualunque cosa accada alla Bilancia, sarò sempre al tuo fianco.»", "feudi_mastio"]], done);
            return;
          }
          say([
            ["fe_roland", "«Benedict ha scoperto i carichi clandestini di sale grezzo nei magazzini. Glacefort pretende la resa immediata di quel sale. Se lo cediamo, ammettiamo la nostra debolezza; se lo teniamo, rischiamo l'invasione.»", "feudi_mastio"]
          ], done);
        },
        fe_frederica: () => {
          say([
            ["fe_frederica", "«Lord {n}... le voci che giungono da Glacefort sono tremende. Se scoppia la guerra, il mio popolo nei campi di sale pagherà il prezzo più alto. Vi prego, ascoltate la voce della pietà alla Bilancia.»", "feudi_mastio"]
          ], done);
        },
        fe_benedict: () => {
          const s = S();
          if (s < 3) {
            say([["fe_benedict", "«Lord {n}, dimostrate il vostro valore nella Giostra con Erador. Un leader senza rispetto sul campo non potrà mai guidare il Consiglio.»", "feudi_mastio"]], done);
            return;
          }
          if (s === 3) {
            ask("fe_benedict", "«Lord {n}, la situazione è critica: Glacefort ha inviato un ultimatum per il sale. È giunto il momento di convocare il Consiglio nella Sala della Bilancia.»", [
              {
                label: "⚖️ Entra nella Sala del Consiglio & Vota alla Bilancia",
                cls: "hot",
                fn: () => {
                  go("feudi_sala_consiglio_ch1", 13, 14);
                }
              },
              { label: "Resta nel cortile ad indagare", fn: done }
            ]);
            return;
          }
          say([["fe_benedict", "«Il verdetto è stato espresso. Il nostro cammino verso le dighe di Glenbrook è tracciato.»", "feudi_mastio"]], done);
        }
      },
      obj: {
        // Forgia del fabbro (H o 6,4)
        "feudi_mastio_ch1:H": () => handleForgia(),
        "feudi_mastio_ch1:6,4": () => handleForgia(),
        // Altare / Prova
        "feudi_mastio_ch1:X": () => handleAltareCortile(),
        "feudi_mastio_ch1:25,4": () => handleAltareCortile(),
        // Mercante di grano
        "feudi_mastio_ch1:M": () => handleMercante(),
        "feudi_mastio_ch1:8,16": () => handleMercante(),
        // Porta del Mastio (B o 15,2)
        "feudi_mastio_ch1:B": () => {
          if (S() >= 3) {
            go("feudi_sala_consiglio_ch1", 13, 15);
          } else {
            say([["voce", "Il Portone della Sala del Consiglio è custodito dalle guardie d'onore. Parla prima con Erador e disputa la Giostra!", "feudi_mastio"]], done);
          }
        },
        "feudi_mastio_ch1:15,2": () => {
          if (S() >= 3) {
            go("feudi_sala_consiglio_ch1", 13, 15);
          } else {
            say([["voce", "Il Portone della Sala del Consiglio è custodito dalle guardie d'onore. Parla prima con Erador e disputa la Giostra!", "feudi_mastio"]], done);
          }
        },
        // Uscita della Sala del Consiglio (D o 13,16)
        "feudi_sala_consiglio_ch1:D": () => go("feudi_mastio_ch1", 15, 4),
        "feudi_sala_consiglio_ch1:13,16": () => go("feudi_mastio_ch1", 15, 4),
        // Altare della Bilancia nella Sala (X o 13,4)
        "feudi_sala_consiglio_ch1:X": () => handleVotazioneConsiglio1(),
        "feudi_sala_consiglio_ch1:13,4": () => handleVotazioneConsiglio1(),
        // Elementi scenografici interattivi del cortile
        "feudi_mastio_ch1:P": () => handleBelvedereCortile(),
        "feudi_mastio_ch1:22,16": () => handleBelvedereCortile(),
        "feudi_mastio_ch1:C": () => handleScuderieCortile(),
        "feudi_mastio_ch1:5,15": () => handleScuderieCortile(),
        "feudi_mastio_ch1:T": () => handlePozzoCortile(),
        "feudi_mastio_ch1:25,14": () => handlePozzoCortile(),
        "feudi_mastio_ch1:G": () => handleSentinellaCortile(),
        "feudi_mastio_ch1:15,8": () => handleSentinellaCortile(),
        // Elementi scenografici della sala del consiglio
        "feudi_sala_consiglio_ch1:V": () => handleVetrataConsiglio(),
        "feudi_sala_consiglio_ch1:13,1": () => handleVetrataConsiglio(),
        "feudi_sala_consiglio_ch1:A": () => handleArchivioConsiglio(),
        "feudi_sala_consiglio_ch1:4,9": () => handleArchivioConsiglio(),
        "feudi_sala_consiglio_ch1:G": () => handleStatuaConsiglio(),
        "feudi_sala_consiglio_ch1:21,9": () => handleStatuaConsiglio()
      }
    };

    function handleBelvedereCortile() {
      say([
        ["voce", "Dall'alto del belvedere si abbraccia l'intero borgo di Castel Wolffort: i tetti d'ardesia fumano nella brezza alpina e in lontananza brillano le chiuse di Glenbrook.", "feudi_mastio"],
        ["hero", "«La nostra gente coltiva queste terre con onore. Qualunque decisione prenderemo al Consiglio, difenderemo le loro case.»", "feudi_mastio"]
      ], done);
    }

    function handleScuderieCortile() {
      say([
        ["voce", "I destrieri corazzati di Casa Wolffort battono gli zoccoli nella paglia dorata. Gli stallieri li sellano con finimenti vermigli: la cavalleria è pronta a muovere alla prima campana d'allarme.", "feudi_mastio"]
      ], done);
    }

    function handlePozzoCortile() {
      say([
        ["voce", "L'antico pozzo in pietra fresca del cortile. Getti una monetina nell'acqua scura: il rintocco argentino sigilla la tua determinazione di comandante.", "feudi_mastio"]
      ], done);
    }

    function handleSentinellaCortile() {
      say([
        ["voce", "La sentinella d'onore batte il pugno sullo spallaccio d'acciaio: «Per il Falco e per Lord {n}! I bastioni di Castel Wolffort non sono mai caduti e mai cadranno!»", "feudi_mastio"]
      ], done);
    }

    function handleVetrataConsiglio() {
      say([
        ["voce", "La monumentale vetrata gotica del Falco proietta fasci di luce rubino e dorata sul pavimento della sala: l'araldo sacro di Casa Wolffort veglia su ogni giudizio.", "feudi_consiglio"]
      ], done);
    }

    function handleArchivioConsiglio() {
      say([
        ["voce", "Scaffali carichi di tomi rilegati in cuoio e pergamene coi sigilli in ceralacca dei tre feudi: l'equilibrio tra grano, ferro e sale è sempre stato fragile.", "feudi_consiglio"]
      ], done);
    }

    function handleStatuaConsiglio() {
      say([
        ["voce", "L'imponente effigie marmorea di tuo padre Symon Wolffort. Alla base è scolpito: «NON CON LA SUPERBIA DELLE ARMI, MA COL PESO DEL GIUDIZIO SI GOVERNA NORZELIA».", "feudi_consiglio"]
      ], done);
    }

    function handleForgia() {
      if (S() === 1) {
        X.sfxDrawbridge();
        say([
          ["voce", "Il vecchio mastro fabbro dei Wolffort ripone il martello sull'incudine e ti porge due scarpini cerchiati d'acciaio brunito.", "feudi_mastio"],
          ["hero", "«I tacchetti d'acciaio del Falco! Con questi l'aderenza sulle lastre bagnate è totale.»", "feudi_mastio"]
        ], () => {
          setStep(N, 2);
          note("Tacchetti ottenuti! Torna da Erador per iniziare la Giostra del Cortile.");
          done();
        });
      } else {
        say([["voce", "L'incudine del mastio fuma ancora. Lame e scudi di riserva sono allineati ordinatamente.", "feudi_mastio"]], done);
      }
    }

    function handleAltareCortile() {
      say([
        ["voce", "Un antico cippo con lo stemma del Falco e la scritta incisa: «NON LA FORZA DELLE LAME, MA IL PESO DEL GIUDIZIO DECIDE IL DESTINO».", "feudi_mastio"]
      ], done);
    }

    function handleMercante() {
      say([
        ["voce", "Il carrettiere di Casa Wolffort controlla i sacchi di grano: «Lord {n}, i dazi sul sale imposti da Glacefort stanno raddoppiando il prezzo del pane. La gente comincia ad avere paura.»", "feudi_mastio"]
      ], () => {
        addClue("prova_dazi_pane", "Rincaro dei Dazi sul Pane", "Glacefort sta soffocando i commerci con dazi esorbitanti per provocare la ribellione.");
        done();
      });
    }

    function startMatchCortile() {
      X.sfxFeudalFanfare();
      X.playMatch({
        title: "La Giostra del Cortile d'Armi di Casa Wolffort",
        intro: "Il Comandante Erador schiera il Muro d'Acciaio! Usa i tacchetti per trovare l'angolo cieco e batti il portiere con «{tiro}»!",
        teamName: "Guardia d'Élite di Erador",
        teamCol: "#475569",
        oppNames: ["Comandante Erador", "Veterano Lanciere", "Alabardiere del Mastio", "Scudo Torre"],
        done: (r) => {
          if (r.win) {
            X.sfxScalesBalance();
            setStep(N, 3);
            note("Vittoria nella Giostra! Il castello riconosce la tua autorità.");
            say([
              ["voce", "GOL! Il tuo tiro speciale «{tiro}» supera l'incrocio piegando i guanti dei veterani! Un boato di giubilo si alza dalle mura del mastio!", "feudi_mastio"],
              ["fe_erador", "«Per tutti i numi, che potenza! Lord Symon sarebbe fiero di voi, {n}. La guardia dei Wolffort obbedirà ad ogni vostro ordine!»", "feudi_mastio"],
              ["fe_benedict", "«La dimostrazione di forza è riuscita. Ora dobbiamo recarci subito alla Sala del Consiglio: il corriere di Glacefort è alle porte.»", "feudi_mastio"]
            ], done);
          } else {
            say([
              ["fe_erador", "«Il muro ha retto! Riprendete fiato, Lord {n}, e calciate con più rotazione contro i miei scudi!»", "feudi_mastio"]
            ], done);
          }
        }
      });
    }

    function handleVotazioneConsiglio1() {
      if (F.get("voto_ch1")) {
        say([["fe_benedict", "«Il verdetto della Bilancia per questo capitolo è già stato sigillato coi Gettoni d'Oro. Dobbiamo marciare verso le dighe di Glenbrook.»", "feudi_consiglio"]], done);
        return;
      }

      X.sfxScalesBalance();
      ask("fe_benedict", "«Signori del Consiglio, siamo chiamati alla Bilancia. Glacefort pretende la confisca del sale segreto. Come risponde Casa Wolffort?»", [
        {
          label: "⚖️ [MORALITÀ]: Rifiuta l'ultimatum e difendi la sovranità dei feudi con Roland!",
          sub: "+15 Moralità · Onore e fedeltà al trattato di Glenbrook",
          cls: "hot",
          fn: () => voteEnding1("moralita")
        },
        {
          label: "📜 [UTILITÀ]: Negozia una tregua commerciale cedendo una parte del carico!",
          sub: "+15 Utilità · Guadagni tempo e riserve auree con Benedict",
          cls: "hot",
          fn: () => voteEnding1("utilita")
        },
        {
          label: "🕊️ [LIBERTÀ]: Distribuisci il sale ai cittadini oppressi e ai Roselliani!",
          sub: "+15 Libertà · Spezza il monopolio al fianco di Frederica",
          cls: "hot",
          fn: () => voteEnding1("liberta")
        }
      ]);
    }

    function voteEnding1(voto) {
      X.sfxCoinWeigh();
      F.set("voto_ch1", voto);
      addConviction(voto, 15, "Scelta del Consiglio al Capitolo 1");

      const endingLines = voto === "moralita"
        ? [
          ["fe_roland", "«Una decisione degna del vostro casato, {n}! Norzelia saprà che Casa Wolffort non si piega alle minacce dei tiranni!»", "feudi_consiglio"],
          ["fe_benedict", "«Così sia. Prepariamo le truppe per difendere le dighe fluviali di Glenbrook.»", "feudi_consiglio"]
        ]
        : voto === "utilita"
        ? [
          ["fe_benedict", "«Una scelta saggia e pragmatica, Lord {n}. Evitiamo una carneficina immediata e accumuliamo provviste strategiche per l'inverno.»", "feudi_consiglio"],
          ["fe_roland", "«Spero solo che la storia non giudichi questo calcolo come una debolezza...»", "feudi_consiglio"]
        ]
        : [
          ["fe_frederica", "«Grazie, {n}... Vedere i sorrisi della gente che non deve più mendicare il sale per conservare il cibo vale ogni rischio.»", "feudi_consiglio"],
          ["fe_erador", "«I popolani del borgo stanno brindando al vostro nome, Lord Custode!»", "feudi_consiglio"]
        ];

      say(endingLines, () => {
        finishChapter(N, "consiglio_wolffort_" + voto);
        const rewMsg = reward("feudi_ch1_win", { coins: 50, cos: "feudi_elmo_falco" });
        note("Capitolo 1 completato! Sigillato il verdetto della Bilancia.");
        say([
          ["voce", `<b>🏆 CAPITOLO 1 COMPLETATO CON SUCCESSO!</b><br>Hai guidato il Consiglio dei Feudi e sigillato la prima grande decisione morale!<br><br><span style="color:#fbbf24">${rewMsg}</span><br>La strada verso il Capitolo 2 (L'Assedio delle Dighe di Glenbrook) è aperta!`, "feudi_consiglio"]
        ], () => {
          ask("fe_benedict", "«I corrieri annunciano che la flotta di Gustadolph si sta avvicinando alle chiuse di Glenbrook. Volete avanzare subito al Capitolo 2?»", [
            { label: "Avanti ▸ Inizia il Capitolo 2 (L'Assedio delle Dighe)", cls: "hot", fn: () => { mem().ch = 2; save(); continueStory(); } },
            { label: "Resta nella Sala del Consiglio", fn: done }
          ]);
        });
      });
    }
  });

  // ============================================================================
  // CAPITOLO 2: L'ASSEDIO DELLE DIGHE & IL FIUME ROSSO DI GLENBROOK
  // ============================================================================
  addChapter((X) => {
    const N = 2;
    const S = () => X.stepOf(N);

    return {
      n: N,
      title: "L'Assedio delle Dighe & Il Fiume Rosso",
      sub: "La Fortezza Fluviale di Glenbrook, la leva delle paratie e la battaglia sul ponte bagnato",
      zones: {
        feudi_glenbrook_ch2: {
          name: "Glenbrook · Fortezza Fluviale delle Grandi Dighe",
          short: "Dighe di Glenbrook",
          sub: "Canali navigabili, torri delle chiuse e flotta corazzata all'orizzonte",
          w: 34, h: 22, start: [17, 18], theme: "torino", bg: "feudi_glenbrook",
          item: ["Sigillo Fluviale di Glenbrook", "Sigilli"], itemCos: "feudi_stendardo_rosso",
          items: [[6, 6], [28, 6], [12, 14], [22, 14]],
          areas: [
            [2, 2, 31, 9, "Il Ponte Superiore delle Chiuse"],
            [2, 10, 31, 20, "Le Banchine Fluviali di Glenbrook"]
          ],
          intro: [
            ["fe_roland", "«Siamo arrivati alle dighe di Glenbrook! Guardate laggiù: i battelli corazzati di Glacefort hanno gettato l'ancora alla foce.»", "feudi_glenbrook"],
            ["hero", "«La corrente è impetuosa, Roland. Se perdiamo il ponte, la capitale cadrà prima del tramonto.»", "feudi_glenbrook"],
            ["fe_benedict", "«C'è una torre di controllo sulla sponda ovest (tessera W). Dobbiamo ispezionare i meccanismi delle chiuse idrauliche prima di decidere come combattere.»", "feudi_glenbrook"]
          ],
          build(Ls) {
            Ls.lay(0, 0, 33, 21, ",");
            // Canale fluviale centrale
            Ls.lay(0, 8, 33, 11, "~");
            // Ponte in legno e pietra che attraversa il fiume
            Ls.lay(14, 8, 19, 11, "=");
            // Mura di difesa delle dighe
            Ls.lay(0, 0, 33, 2, "#");
            Ls.lay(0, 20, 33, 21, "#");
            // Torri delle chiuse (sinistra e destra)
            Ls.put(4, 4, "W");
            Ls.put(29, 4, "W");
            // Portone della torre di controllo (B)
            Ls.put(4, 7, "B");
            // Leva idraulica d'emergenza (H)
            Ls.put(29, 7, "H");
            // Banco dei rifornimenti dei barcaioli (M)
            Ls.put(10, 16, "M");
            // Elementi scenografici del presidio fluviale
            Ls.put(24, 16, "C"); // Chiatte e barche fluviali
            Ls.put(16, 5, "G");  // Guardia del presidio
            Ls.put(8, 5, "P");   // Belvedere della cateratta
          },
          actLabels: {
            "B": "🚪 Torre delle Chiuse Fluviali",
            "H": "⚙️ Leva Idraulica delle Paratie",
            "M": "⛵ Banchina dei Barcaioli",
            "W": "🏰 Bastione di Glenbrook",
            "=": "🌉 Ponte delle Dighe",
            "C": "⛵ Chiatte & Barche Fluviali",
            "G": "🛡️ Guardia del Presidio",
            "P": "🌊 Belvedere della Cateratta",
            "4,7": "🚪 Torre delle Chiuse Fluviali",
            "29,7": "⚙️ Leva Idraulica delle Paratie",
            "10,16": "⛵ Banchina dei Barcaioli",
            "24,16": "⛵ Chiatte & Barche Fluviali",
            "16,5": "🛡️ Guardia del Presidio",
            "8,5": "🌊 Belvedere della Cateratta"
          },
          npcs: (s) => {
            const list = [
              { id: "fe_benedict", at: [12, 14], dir: "up", name: "Benedict" },
              { id: "fe_roland", at: [17, 7], dir: "down", name: "Roland" },
              { id: "fe_frederica", at: [22, 14], dir: "up", name: "Frederica" }
            ];
            if (s >= 2) {
              list.push({ id: "fe_erador", at: [16, 12], dir: "down", name: "Erador" });
            }
            return list;
          }
        },
        feudi_torre_chiuse_ch2: {
          name: "Glenbrook · Sala Meccanismi della Diga",
          short: "Torre delle Paratie",
          sub: "Ingranaggi in bronzo, catene d'argano e registri idraulici",
          w: 24, h: 16, start: [12, 13], theme: "torino", bg: "feudi_glenbrook",
          item: ["Ingranaggio di Bronzo", "Ingranaggi"],
          items: [[5, 5], [19, 5], [12, 8]],
          areas: [[2, 2, 21, 14, "La Stanza degli Argani"]],
          intro: [
            ["fe_benedict", "«Guardate questi argani: azionando questa leva, le paratie si spalancherebbero rilasciando una piena devastante su tutto il corso inferiore del fiume.»", "feudi_glenbrook"]
          ],
          build(Ls) {
            Ls.lay(0, 0, 23, 15, "_");
            Ls.lay(0, 0, 23, 1, "#");
            Ls.lay(0, 0, 1, 15, "#");
            Ls.lay(22, 0, 23, 15, "#");
            Ls.lay(0, 14, 23, 15, "#");
            // Uscita verso le banchine
            Ls.put(12, 14, "D");
            // Altare di comando delle chiuse
            Ls.put(12, 4, "X");
            // Archivio progetti idraulici
            Ls.put(6, 6, "A");
          },
          actLabels: {
            "D": "🚪 Torna alle Dighe Esterne",
            "X": "📜 Registro Segreto delle Chiuse",
            "A": "📜 Piani Architettonici della Diga",
            "12,14": "🚪 Torna alle Dighe Esterne",
            "12,4": "📜 Registro Segreto delle Chiuse",
            "6,6": "📜 Piani Architettonici della Diga"
          },
          npcs: () => [
            { id: "fe_benedict", at: [9, 6], dir: "right", name: "Benedict" },
            { id: "fe_roland", at: [15, 6], dir: "left", name: "Roland" }
          ]
        }
      },
      talk: {
        fe_benedict: () => {
          const s = S();
          if (s === 0) {
            say([
              ["fe_benedict", "«Lord {n}, entrate nella torre delle chiuse (porta B, in alto a sinistra). Dobbiamo verificare se il registro idraulico è intatto.»", "feudi_glenbrook"]
            ], done);
            return;
          }
          if (s === 1) {
            say([
              ["fe_benedict", "«Avete trovato il registro segreto! Come temevo: le paratie possono spazzare via l'intera flotta nemica... ma inonderemmo il borgo basso. Andate sul ponte da Roland.»", "feudi_glenbrook"]
            ], () => {
              setStep(N, 2);
              note("Raggiungi Roland al centro del ponte (tessera =)");
              done();
            });
            return;
          }
          if (s === 2) {
            ask("fe_benedict", "«Lord {n}, i battelli d'assalto nemici hanno attraccato al molo! Il Generale d'Assalto di Gustadolph guida la carica. Difendiamo il ponte nella Battaglia delle Chiuse?»", [
              {
                label: "⚽ Sfida l'Armata d'Assalto sul Ponte di Glenbrook!",
                cls: "hot",
                fn: () => startMatchGlenbrook()
              },
              { label: "Un momento di riflessione", fn: done }
            ]);
            return;
          }
          if (s === 3) {
            handleVotazioneConsiglio2();
            return;
          }
          say([["fe_benedict", "«La battaglia è vinta e il consiglio ha deliberato. La nostra marcia verso Glacefort è imminente.»", "feudi_glenbrook"]], done);
        },
        fe_roland: () => {
          say([
            ["fe_roland", "«{n}, mio padre ha edificato questo ponte con la pietra bianca delle nostre cave. Non permetterò che Glacefort lo calpesti senza incontrare la mia lancia!»", "feudi_glenbrook"]
          ], done);
        },
        fe_frederica: () => {
          say([
            ["fe_frederica", "«I pescatori del borgo fluviale non c'entrano nulla con la cupidigia dei sovrani. Se apriamo quelle dighe, perderanno tutto ciò che hanno costruito.»", "feudi_glenbrook"]
          ], done);
        },
        fe_erador: () => {
          say([
            ["fe_erador", "«Le mie ginocchia sentono il fango della piena, Lord Custode! In campo useremo le sponde dei bastioni per far rimbalzare i loro attaccanti nel fiume!»", "feudi_glenbrook"]
          ], done);
        }
      },
      obj: {
        "feudi_glenbrook_ch2:B": () => go("feudi_torre_chiuse_ch2", 12, 13),
        "feudi_glenbrook_ch2:4,7": () => go("feudi_torre_chiuse_ch2", 12, 13),
        "feudi_glenbrook_ch2:H": () => {
          say([["voce", "La leva principale delle paratie idrauliche. È bloccata da un sigillo di sicurezza imperiale.", "feudi_glenbrook"]], done);
        },
        "feudi_glenbrook_ch2:29,7": () => {
          say([["voce", "La leva principale delle paratie idrauliche. È bloccata da un sigillo di sicurezza imperiale.", "feudi_glenbrook"]], done);
        },
        "feudi_glenbrook_ch2:M": () => {
          say([["voce", "I pescatori di Glenbrook riparano le reti con le lacrime agli occhi: «Lord {n}, non fate annegare le nostre case!»", "feudi_glenbrook"]], done);
        },
        "feudi_glenbrook_ch2:10,16": () => {
          say([["voce", "I pescatori di Glenbrook riparano le reti con le lacrime agli occhi: «Lord {n}, non fate annegare le nostre case!»", "feudi_glenbrook"]], done);
        },
        "feudi_glenbrook_ch2:C": () => handleChiatteGlenbrook(),
        "feudi_glenbrook_ch2:24,16": () => handleChiatteGlenbrook(),
        "feudi_glenbrook_ch2:G": () => handleGuardiaGlenbrook(),
        "feudi_glenbrook_ch2:16,5": () => handleGuardiaGlenbrook(),
        "feudi_glenbrook_ch2:P": () => handleBelvedereCateratta(),
        "feudi_glenbrook_ch2:8,5": () => handleBelvedereCateratta(),
        "feudi_torre_chiuse_ch2:D": () => go("feudi_glenbrook_ch2", 5, 8),
        "feudi_torre_chiuse_ch2:12,14": () => go("feudi_glenbrook_ch2", 5, 8),
        "feudi_torre_chiuse_ch2:X": () => handleRegistroChiuse(),
        "feudi_torre_chiuse_ch2:12,4": () => handleRegistroChiuse(),
        "feudi_torre_chiuse_ch2:A": () => handlePianiTorre(),
        "feudi_torre_chiuse_ch2:6,6": () => handlePianiTorre()
      }
    };

    function handleChiatteGlenbrook() {
      say([
        ["voce", "Le chiatte fluviali in quercia dei battellieri di Glenbrook. Le donne caricano ceste di provviste e lanterne a olio: pronte all'evacuazione se la diga dovesse cedere.", "feudi_glenbrook"]
      ], done);
    }

    function handleGuardiaGlenbrook() {
      say([
        ["voce", "Il picchiere di guardia al camminamento fluviale scruta la nebbia del fiume: «La flotta corazzata ha gettato le ancore alla foce. Attendiamo il vostro segnale, Lord Custode!»", "feudi_glenbrook"]
      ], done);
    }

    function handleBelvedereCateratta() {
      say([
        ["voce", "Dalla sporgenza della cateratta si ammira il salto d'acqua di trenta metri: il rombo delle onde copre perfino il clangore delle armature.", "feudi_glenbrook"]
      ], done);
    }

    function handlePianiTorre() {
      say([
        ["voce", "Le pergamene d'ingegneria idraulica dei mastri costruttori di Glenbrook: una complessa rete di canali e paratie a cascata concepita per resistere alle piene centenarie.", "feudi_glenbrook"]
      ], done);
    }

    function handleRegistroChiuse() {
      if (S() === 0) {
        X.sfxDrawbridge();
        say([
          ["voce", "Sul leggio di bronzo trovi il rotolo pergamenato con i piani idraulici segreti della Diga di Glenbrook.", "feudi_glenbrook"],
          ["hero", "«Ecco la mappa delle chiuse! Il meccanismo è progettato per allagare il settore ovest spazzando via chiunque si trovi sul fondovalle.»", "feudi_glenbrook"]
        ], () => {
          addClue("prova_chiuse_segrete", "Piani Idraulici Segreti di Glenbrook", "La diga possiede un meccanismo d'alluvione estrema che sacrifica il borgo inferiore per distruggere le armate.");
          setStep(N, 1);
          note("Prova acquisita! Esci e parla con Benedict sulla banchina.");
          done();
        });
      } else {
        say([["voce", "I meccanismi degli argani ronzano al passaggio dell'acqua nelle condutture sotterranee.", "feudi_glenbrook"]], done);
      }
    }

    function startMatchGlenbrook() {
      X.sfxFeudalFanfare();
      X.playMatch({
        title: "La Battaglia delle Chiuse sul Ponte di Glenbrook",
        intro: "I Paladini d'Acciaio attaccano a ranghi serrati sul ponte scivoloso! Sfrutta l'elevazione dei bastioni e colpisci con «{tiro}»!",
        teamName: "Divisione d'Assalto di Glacefort",
        teamCol: "#1e3a8a",
        oppNames: ["Comandante d'Assalto", "Cavaliere di Ferro 1", "Cavaliere di Ferro 2", "Lanciere Fluviale", "Sentinella Corazzata"],
        done: (r) => {
          if (r.win) {
            X.sfxScalesBalance();
            setStep(N, 3);
            note("Vittoria sul ponte di Glenbrook! L'avanzata nemica è stroncata.");
            say([
              ["voce", "GOL FANTASTICO! Con un bolide all'incrocio tra le travi del ponte fai rotolare la palla nella corrente! La Divisione d'Assalto arretra nel panico!", "feudi_glenbrook"],
              ["fe_roland", "«Li abbiamo respinti sul ponte! Norzelia è salva grazie a voi, {n}!»", "feudi_glenbrook"],
              ["fe_benedict", "«Ma la retroguardia si sta riorganizzando. Dobbiamo convocare subito la Bilancia per decidere il destino delle dighe!»", "feudi_glenbrook"]
            ], () => {
              handleVotazioneConsiglio2();
            });
          } else {
            say([
              ["fe_roland", "«I cavlieri corazzati fanno muro davanti all'area! Non arrenderti, {n}: passa di prima intenzione a Frederica per scavalcare la difesa!»", "feudi_glenbrook"]
            ], done);
          }
        }
      });
    }

    function handleVotazioneConsiglio2() {
      if (F.get("voto_ch2")) {
        say([["fe_benedict", "«Il verdetto sulle dighe è stato espresso. Proseguiamo la marcia verso le miniere di Glacefort.»", "feudi_glenbrook"]], done);
        return;
      }

      X.sfxScalesBalance();
      ask("fe_benedict", "«Lord {n}, il nemico si sta riorganizzando. Dobbiamo decidere l'impiego delle paratie fluviali prima della notte. Come vota il Consiglio?»", [
        {
          label: "⚖️ [MORALITÀ]: Difendi il ponte corpo a corpo senza toccare le chiuse per salvare i civili!",
          sub: "+20 Moralità · Nessun danno collaterale ai pescatori e alle case",
          cls: "hot",
          fn: () => voteEnding2("moralita")
        },
        {
          label: "📜 [UTILITÀ]: Aziona le chiuse spazzando via l'esercito nemico con l'inondazione tattica!",
          sub: "+20 Utilità · Vittoria militare schiacciante e risparmio delle truppe",
          cls: "hot",
          fn: () => voteEnding2("utilita")
        },
        {
          label: "🕊️ [LIBERTÀ]: Apri i canali laterali e organizza l'evacuazione su chiatte coi Roselliani!",
          sub: "+20 Libertà · Salva ogni vita umana infrangendo gli ordini di corte",
          cls: "hot",
          fn: () => voteEnding2("liberta")
        }
      ]);
    }

    function voteEnding2(voto) {
      X.sfxCoinWeigh();
      F.set("voto_ch2", voto);
      addConviction(voto, 20, "Decisione cruciale alle Dighe di Glenbrook");

      const endingLines = voto === "moralita"
        ? [
          ["fe_roland", "«Avete scelto l'onore, {n}! Nessuna casa di Glenbrook sarà sommersa nel nostro nome. Manterremo la linea sul ponte a testa alta!»", "feudi_glenbrook"],
          ["fe_benedict", "«Una prova di coraggio ammirevole. L'opinione pubblica dei feudi è commossa dalla vostra lealtà.»", "feudi_glenbrook"]
        ]
        : voto === "utilita"
        ? [
          ["fe_benedict", "«(abbassa la leva idraulica) Il fragore delle acque travolge gli accampamenti di Gustadolph! Abbiamo annientato la loro flotta senza perdere un solo soldato.»", "feudi_glenbrook"],
          ["fe_frederica", "«È stata una mossa spietata... ma non posso negare che abbia salvato le nostre vite.»", "feudi_glenbrook"]
        ]
        : [
          ["fe_frederica", "«Le chiatte hanno tratto in salvo centinaia di famiglie prima che il fiume straripasse! Avete dimostrato che la compassione è la vera forza di un condottiero.»", "feudi_glenbrook"],
          ["fe_erador", "«I barcaioli urlano il vostro nome al cielo, Lord Custode!»", "feudi_glenbrook"]
        ];

      say(endingLines, () => {
        finishChapter(N, "dighe_glenbrook_" + voto);
        const rewMsg = reward("feudi_ch2_win", { coins: 60, cos: "feudi_stendardo_rosso" });
        note("Capitolo 2 completato! Verdetto delle dighe emesso.");
        say([
          ["voce", `<b>🏆 CAPITOLO 2 COMPLETATO CON SUCCESSO!</b><br>Hai risolto l'assedio delle dighe di Glenbrook e guidato il casato nella tempesta!<br><br><span style="color:#fbbf24">${rewMsg}</span><br>L'infiltrazione nelle Miniere di Cristallo di Glacefort (Capitolo 3) è pronta!`, "feudi_glenbrook"]
        ], () => {
          ask("fe_benedict", "«Le spie ci confermano che a Glacefort il Ministro Sorsley sta reprimendo nel sangue i minatori Roselliani. Volete avanzare al Capitolo 3?»", [
            { label: "Avanti ▸ Inizia il Capitolo 3 (Le Miniere di Glacefort)", cls: "hot", fn: () => { mem().ch = 3; save(); continueStory(); } },
            { label: "Resta alle Dighe ad esplorare", fn: done }
          ]);
        });
      });
    }
  });

  // ============================================================================
  // CAPITOLO 3: LE MINIERE DI CRISTALLO & LA NOTTE DEI ROSELIANI
  // ============================================================================
  addChapter((X) => {
    const N = 3;
    const S = () => X.stepOf(N);

    return {
      n: N,
      title: "Le Miniere di Cristallo & La Notte dei Roselliani",
      sub: "Il gelo delle cave di sale di Glacefort, il registro di Sorsley e la liberazione degli schiavi",
      zones: {
        feudi_glacefort_ch3: {
          name: "Glacefort · Le Cave di Cristallo e Sale",
          short: "Miniere di Sale",
          sub: "Stalattiti di minerale scintillante, vagonetti su rotaie e freddo pungente",
          w: 32, h: 22, start: [15, 18], theme: "torino", bg: "feudi_glacefort",
          item: ["Cristallo di Salgemma Puro", "Cristalli"], itemCos: "feudi_mantello_sale",
          items: [[5, 6], [26, 6], [8, 14], [23, 14]],
          areas: [
            [2, 2, 29, 9, "Le Gallerie dei Cristalli Fosforescenti"],
            [2, 10, 29, 20, "Il Binario di Carico del Sale"]
          ],
          intro: [
            ["fe_frederica", "«Siamo all'interno delle cave di Glacefort... Sentite questo gelo? I Roselliani lavorano qui dentro per quattordici ore al giorno senza mai vedere la luce del sole.»", "feudi_glacefort"],
            ["hero", "«Trovare le prove delle frodi fiscali del Ministro Sorsley farà crollare il suo monopolio corrotto.»", "feudi_glacefort"],
            ["fe_benedict", "«C'è l'ufficio di sorveglianza del cartello in fondo al binario (porta B). Dobbiamo penetrare all'interno e sottrarre i registri contabili.»", "feudi_glacefort"]
          ],
          build(Ls) {
            Ls.lay(0, 0, 31, 21, ",");
            // Mura di roccia e stalattiti
            Ls.lay(0, 0, 31, 2, "#");
            Ls.lay(0, 0, 1, 21, "#");
            Ls.lay(30, 0, 31, 21, "#");
            Ls.lay(0, 20, 31, 21, "#");
            // Binari dei carrelli al centro
            Ls.lay(0, 10, 31, 11, "=");
            // Ufficio blindato di Sorsley
            Ls.put(6, 4, "B");
            // Forgia clandestina dei minatori
            Ls.put(25, 4, "H");
            // Banco pesatura del sale
            Ls.put(10, 16, "M");
            // Elementi scenografici delle cave
            Ls.put(18, 16, "C"); // Carrello di salgemma
            Ls.put(25, 16, "P"); // Alloggi dei Roselliani
            Ls.put(12, 6, "G");  // Sorvegliante di Glacefort
          },
          actLabels: {
            "B": "🚪 Archivio Segreto del Ministro Sorsley",
            "H": "🔨 Forgia dei Minatori Ribelli",
            "M": "⚖️ Banco di Pesatura del Sale",
            "=": "🛤️ Binari dei Carrelli Minerari",
            "C": "🛤️ Carrello di Salgemma",
            "P": "🏕️ Alloggi dei Minatori Roselliani",
            "G": "🛡️ Sorvegliante di Glacefort",
            "6,4": "🚪 Archivio Segreto del Ministro Sorsley",
            "25,4": "🔨 Forgia dei Minatori Ribelli",
            "10,16": "⚖️ Banco di Pesatura del Sale",
            "18,16": "🛤️ Carrello di Salgemma",
            "25,16": "🏕️ Alloggi dei Minatori Roselliani",
            "12,6": "🛡️ Sorvegliante di Glacefort"
          },
          npcs: (s) => {
            const list = [
              { id: "fe_frederica", at: [13, 14], dir: "up", name: "Frederica" },
              { id: "fe_benedict", at: [17, 14], dir: "up", name: "Benedict" },
              { id: "fe_roland", at: [21, 6], dir: "down", name: "Roland" }
            ];
            if (s >= 2) {
              list.push({ id: "fe_erador", at: [15, 6], dir: "down", name: "Erador" });
            }
            return list;
          }
        },
        feudi_archivio_sorsley_ch3: {
          name: "Glacefort · Ufficio Segreto di Sorsley",
          short: "Archivio di Sorsley",
          sub: "Casseforti di ferro nero, registri con sigilli d'oro e lingotti di sale",
          w: 24, h: 16, start: [12, 13], theme: "torino", bg: "feudi_glacefort",
          item: ["Sigillo Nobile di Glacefort", "Sigilli"],
          items: [[5, 5], [19, 5], [12, 8]],
          areas: [[2, 2, 21, 14, "La Cassaforte del Cartello"]],
          intro: [
            ["fe_frederica", "«Questo è il luogo dove Sorsley conta il sangue del mio popolo trasformato in monete d'oro. Troviamo il registro nero!»", "feudi_glacefort"]
          ],
          build(Ls) {
            Ls.lay(0, 0, 23, 15, "_");
            Ls.lay(0, 0, 23, 1, "#");
            Ls.lay(0, 0, 1, 15, "#");
            Ls.lay(22, 0, 23, 15, "#");
            Ls.lay(0, 14, 23, 15, "#");
            Ls.put(12, 14, "D");
            Ls.put(12, 4, "X"); // La cassaforte con la prova
            // Elementi scenografici dell'ufficio
            Ls.put(5, 8, "A");  // Scaffale dei contratti di monopolio
            Ls.put(19, 8, "V"); // Inferriata sul pozzo delle miniere
          },
          actLabels: {
            "D": "🚪 Torna alle Cave di Cristallo",
            "X": "📜 Cassaforte del Cartello del Sale",
            "A": "📜 Contratti del Monopolio del Sale",
            "V": "🪟 Inferriata sul Baratro delle Cave",
            "12,14": "🚪 Torna alle Cave di Cristallo",
            "12,4": "📜 Cassaforte del Cartello del Sale",
            "5,8": "📜 Contratti del Monopolio del Sale",
            "19,8": "🪟 Inferriata sul Baratro delle Cave"
          },
          npcs: () => [
            { id: "fe_frederica", at: [9, 6], dir: "right", name: "Frederica" },
            { id: "fe_benedict", at: [15, 6], dir: "left", name: "Benedict" }
          ]
        }
      },
      talk: {
        fe_frederica: () => {
          const s = S();
          if (s === 0) {
            say([
              ["fe_frederica", "«Lord {n}, entriamo nell'ufficio di Sorsley (porta B). Dentro quella cassaforte sono custoditi i registri delle frodi che possono incriminarlo!»", "feudi_glacefort"]
            ], done);
            return;
          }
          if (s === 1) {
            say([
              ["fe_frederica", "«Abbiamo il libro mastro del contrabbando! Con queste prove possiamo liberare i Roselliani e abbattere il prezzo del sale in tutta Norzelia!»", "feudi_glacefort"]
            ], () => {
              setStep(N, 2);
              note("Parla con Roland ed Erador al centro delle gallerie per fronteggiare i carcerieri.");
              done();
            });
            return;
          }
          if (s === 2) {
            ask("fe_frederica", "«I Guardiani d'Alabarda di Sorsley ci hanno sbarrato l'uscita con le picche! Dobbiamo travolgerli nella Partita delle Cave di Sale!»", [
              {
                label: "⚽ Sfida i Guardiani di Sorsley sulle Lastre di Cristallo!",
                cls: "hot",
                fn: () => startMatchMiniere()
              },
              { label: "Un attimo di raccoglimento", fn: done }
            ]);
            return;
          }
          if (s === 3) {
            handleVotazioneConsiglio3();
            return;
          }
          say([["fe_frederica", "«Il verdetto è stato espresso. Il nostro popolo non dimenticherà mai il vostro coraggio, Lord Custode.»", "feudi_glacefort"]], done);
        },
        fe_benedict: () => {
          say([
            ["fe_benedict", "«Lord {n}, con le prove di Sorsley possiamo ricattare il cartello per ottenere le armature d'acciaio più resistenti del continente. Non sprecate un simile vantaggio per mero impeto di pietà.»", "feudi_glacefort"]
          ], done);
        },
        fe_roland: () => {
          say([
            ["fe_roland", "«La schiavitù è un'onta che macchia la dignità di qualsiasi regno. Porterò questo registro davanti a tutti i feudi nel gran torneo di Norzelia!»", "feudi_glacefort"]
          ], done);
        },
        fe_erador: () => {
          say([
            ["fe_erador", "«Il terreno qui è scivoloso come sapone, Lord {n}! I tacchetti d'acciaio ci daranno un vantaggio enorme nei contrasti in scivolata!»", "feudi_glacefort"]
          ], done);
        }
      },
      obj: {
        "feudi_glacefort_ch3:B": () => go("feudi_archivio_sorsley_ch3", 12, 13),
        "feudi_glacefort_ch3:6,4": () => go("feudi_archivio_sorsley_ch3", 12, 13),
        "feudi_glacefort_ch3:H": () => {
          say([["voce", "La fucina segreta dove i minatori fabbricano picconi di nascosto. Un vecchio Roselliano vi benedice commosso: «Che il Falco spezzi le nostre catene!»", "feudi_glacefort"]], done);
        },
        "feudi_glacefort_ch3:25,4": () => {
          say([["voce", "La fucina segreta dove i minatori fabbricano picconi di nascosto. Un vecchio Roselliano vi benedice commosso: «Che il Falco spezzi le nostre catene!»", "feudi_glacefort"]], done);
        },
        "feudi_glacefort_ch3:M": () => {
          say([["voce", "Bilance piombate usate dai carcerieri per falsificare il peso del minerale estratto.", "feudi_glacefort"]], done);
        },
        "feudi_glacefort_ch3:10,16": () => {
          say([["voce", "Bilance piombate usate dai carcerieri per falsificare il peso del minerale estratto.", "feudi_glacefort"]], done);
        },
        "feudi_glacefort_ch3:C": () => handleCarrelloSalgemma(),
        "feudi_glacefort_ch3:18,16": () => handleCarrelloSalgemma(),
        "feudi_glacefort_ch3:P": () => handleAlloggiRoselliani(),
        "feudi_glacefort_ch3:25,16": () => handleAlloggiRoselliani(),
        "feudi_glacefort_ch3:G": () => handleSorveglianteGlacefort(),
        "feudi_glacefort_ch3:12,6": () => handleSorveglianteGlacefort(),
        "feudi_archivio_sorsley_ch3:D": () => go("feudi_glacefort_ch3", 7, 5),
        "feudi_archivio_sorsley_ch3:12,14": () => go("feudi_glacefort_ch3", 7, 5),
        "feudi_archivio_sorsley_ch3:X": () => handleCassaforteSorsley(),
        "feudi_archivio_sorsley_ch3:12,4": () => handleCassaforteSorsley(),
        "feudi_archivio_sorsley_ch3:A": () => handleContrattiSorsley(),
        "feudi_archivio_sorsley_ch3:5,8": () => handleContrattiSorsley(),
        "feudi_archivio_sorsley_ch3:V": () => handleInferriataSorsley(),
        "feudi_archivio_sorsley_ch3:19,8": () => handleInferriataSorsley()
      }
    };

    function handleCarrelloSalgemma() {
      say([
        ["voce", "Un pesante vagonetto in ferro carico di salgemma fosforescente. I blocchi di sale puro riflettono la luce delle torce come diamanti grezzi.", "feudi_glacefort"]
      ], done);
    }

    function handleAlloggiRoselliani() {
      say([
        ["voce", "Nicchie scavate nella roccia fredda con giacigli di paglia: qui dormono i minatori stremati dopo turni estenuanti. Una bambina roselliana vi guarda con occhi colmi di speranza.", "feudi_glacefort"]
      ], done);
    }

    function handleSorveglianteGlacefort() {
      say([
        ["voce", "Il gendarme di guardia con corazza d'acciaio nero vi osserva con diffidenza: «Nessun visitatore ha accesso ai settori inferiori senza il lasciapassare del Ministro Sorsley!»", "feudi_glacefort"]
      ], done);
    }

    function handleContrattiSorsley() {
      say([
        ["voce", "Buste sigillate con lo stemma del Cartello del Sale: accordi segreti di compravendita e quote di riserva occultate per gonfiare artificialmente i prezzi.", "feudi_glacefort"]
      ], done);
    }

    function handleInferriataSorsley() {
      say([
        ["voce", "Dall'inferriata si domina la cavità principale delle miniere: centinaia di lanterne scintillano nelle profondità come stelle imprigionate nella roccia.", "feudi_glacefort"]
      ], done);
    }

    function handleCassaforteSorsley() {
      if (S() === 0) {
        X.sfxScalesBalance();
        say([
          ["voce", "Forzi la serratura della cassaforte d'ebano. Al suo interno giace il famigerato Libro Mastro del Ministro Sorsley!", "feudi_glacefort"],
          ["hero", "«Ecco la prova schiacciante! Sorsley nasconde il 60% del sale estratto per creare una falsa carestia e raddoppiare i profitti.»", "feudi_glacefort"]
        ], () => {
          addClue("prova_contrabbando_sorsley", "Libro Mastro delle Frodi di Sorsley", "Le prove inconfutabili del falso monopolio del sale architettato da Glacefort per strangolare Glenbrook.");
          setStep(N, 1);
          note("Terza prova acquisita! Esci e parla con Frederica e i compagni.");
          done();
        });
      } else {
        say([["voce", "La cassaforte è vuota, ma le carte sequestrate saranno determinanti per il Gran Consiglio.", "feudi_glacefort"]], done);
      }
    }

    function startMatchMiniere() {
      X.sfxFeudalFanfare();
      X.playMatch({
        title: "Il Derby del Cristallo e del Sale nelle Cave",
        intro: "I Guardiani d'Alabarda schierano i veterani dei picconi! Fai scivolare il pallone sulle lastre gelate e insacca con «{tiro}»!",
        teamName: "Guardiani d'Alabarda di Sorsley",
        teamCol: "#0f172a",
        oppNames: ["Carceriere Supremo", "Picconatore di Cristallo 1", "Picconatore di Cristallo 2", "Guardia d'Alabarda", "Gendarme del Sale"],
        done: (r) => {
          if (r.win) {
            X.sfxScalesBalance();
            setStep(N, 3);
            note("Vittoria nelle miniere! I carcerieri sono messi in fuga.");
            say([
              ["voce", "GOL LEGGENDARIO! Il pallone sfiora le stalattiti e si infila all'angolino basso facendo tremare la caverna! I carcerieri abbandonano le alabarde e fuggono!", "feudi_glacefort"],
              ["fe_frederica", "«Ce l'abbiamo fatta! Le gallerie sono libere! Guardate le facce dei minatori... vedono la speranza dopo vent'anni di buio!»", "feudi_glacefort"],
              ["fe_benedict", "«Dobbiamo riunire il Consiglio immediatamente: il destino di questa gente e dell'intera Norzelia deve essere deciso alla Bilancia.»", "feudi_glacefort"]
            ], () => {
              handleVotazioneConsiglio3();
            });
          } else {
            say([
              ["fe_erador", "«Le alabarde ci hanno chiuso lo spazio! Riproviamo subito, Lord Custode: sfruttate lo scatto di Roland sulla corsia di destra!»", "feudi_glacefort"]
            ], done);
          }
        }
      });
    }

    function handleVotazioneConsiglio3() {
      if (F.get("voto_ch3")) {
        say([["fe_benedict", "«Il verdetto delle miniere è stato sancito. Mancano poche ore al Torneo Supremo nell'Arena dei Tre Regni.»", "feudi_glacefort"]], done);
        return;
      }

      X.sfxScalesBalance();
      ask("fe_benedict", "«Lord {n}, abbiamo il Libro Mastro di Sorsley e i Roselliani attendono il verdetto. Come vota il Consiglio di Casa Wolffort?»", [
        {
          label: "⚖️ [MORALITÀ]: Presenta ufficialmente le prove al Gran Tribunale di Norzelia per ripristinare la legge!",
          sub: "+25 Moralità · Processo pubblico ed equità per tutti i feudi",
          cls: "hot",
          fn: () => voteEnding3("moralita")
        },
        {
          label: "📜 [UTILITÀ]: Ricatta Sorsley usando le prove per ottenere le armi supreme dell'Impero!",
          sub: "+25 Utilità · Supremazia tecnologica e bellica per la nostra casata",
          cls: "hot",
          fn: () => voteEnding3("utilita")
        },
        {
          label: "🕊️ [LIBERTÀ]: Guida l'evacuazione immediata di tutti i Roselliani e accoglili a Castel Wolffort!",
          sub: "+25 Libertà · Spezza ogni schiavitù al fianco di Frederica",
          cls: "hot",
          fn: () => voteEnding3("liberta")
        }
      ]);
    }

    function voteEnding3(voto) {
      X.sfxCoinWeigh();
      F.set("voto_ch3", voto);
      addConviction(voto, 25, "Decisione capitale nelle Miniere di Sale");

      const endingLines = voto === "moralita"
        ? [
          ["fe_roland", "«La verità esposta alla luce del sole è l'arma più affilata di un re giusto. Nessun tiranno potrà nascondersi dietro false leggi!»", "feudi_glacefort"],
          ["fe_benedict", "«La nostra posizione diplomatica al Torneo Supremo sarà inattaccabile.»", "feudi_glacefort"]
        ]
        : voto === "utilita"
        ? [
          ["fe_benedict", "«(firma l'accordo forzato) Sorsley ha ceduto tutte le riserve d'acciaio e le armature migliori per evitare lo scandalo. Casa Wolffort non è mai stata così temuta e armata!»", "feudi_glacefort"],
          ["fe_erador", "«I nostri scarpini sono rivestiti del metallo più impenetrabile dell'Impero!»", "feudi_glacefort"]
        ]
        : [
          ["fe_frederica", "«(lacrime di gioia le rigano il volto) Il mio popolo è libero! Abbiamo spezzato le catene che soffocavano la nostra gente da generazioni. Grazie, {n}... sarò al tuo fianco fino alla fine!»", "feudi_glacefort"],
          ["fe_roland", "«Casa Wolffort ha mostrato al mondo che cosa significa essere nobili nello spirito.»", "feudi_glacefort"]
        ];

      say(endingLines, () => {
        finishChapter(N, "miniere_glacefort_" + voto);
        const rewMsg = reward("feudi_ch3_win", { coins: 75, cos: "feudi_mantello_sale" });
        note("Capitolo 3 completato! Proclama della Bilancia registrato.");
        say([
          ["voce", `<b>🏆 CAPITOLO 3 COMPLETATO CON SUCCESSO!</b><br>Hai espugnato le miniere di sale di Glacefort e scritto la storia di Norzelia!<br><br><span style="color:#fbbf24">${rewMsg}</span><br>L'Anfiteatro del Gran Giudizio (Capitolo 4 · Gran Finale) ti attende!`, "feudi_glacefort"]
        ], () => {
          ask("fe_benedict", "«I tamburi di guerra chiamano tutte le casate nell'Anfiteatro dei Tre Feudi per la sfida decisiva. Siete pronto per il Capitolo Finale?»", [
            { label: "Avanti ▸ Sali all'Anfiteatro (Capitolo 4 · Gran Finale)", cls: "hot", fn: () => { mem().ch = 4; save(); continueStory(); } },
            { label: "Resta nelle Miniere ad esplorare", fn: done }
          ]);
        });
      });
    }
  });

  // ============================================================================
  // CAPITOLO 4: IL GIUDIZIO SUPREMO & LE QUATTRO CORONE DI NORZELIA
  // ============================================================================
  addChapter((X) => {
    const N = 4;
    const S = () => X.stepOf(N);

    return {
      n: N,
      title: "Il Giudizio Supremo & Le Quattro Corone",
      sub: "L'Anfiteatro dei Sette Feudi, il duello supremo contro Avlora e i 4 Finali di Norzelia",
      zones: {
        feudi_colosseo_ch4: {
          name: "Norzelia · Anfiteatro Imperiale del Gran Giudizio",
          short: "Anfiteatro del Giudizio",
          sub: "Sabbia dorata, palchi dei consoli, bandiere delle tre potenze e sole accecante",
          w: 36, h: 24, start: [18, 19], theme: "torino", bg: "feudi_colosseo",
          item: ["Gettone Supremo del Giudizio", "Gettoni"], itemCos: "feudi_corona_norzelia",
          items: [[6, 6], [30, 6], [10, 15], [26, 15]],
          areas: [
            [2, 2, 33, 9, "La Tribuna dei Sovrani di Norzelia"],
            [2, 10, 33, 22, "L'Arena di Sabbia Dorata"]
          ],
          intro: [
            ["fe_benedict", "«Siamo all'Anfiteatro del Gran Giudizio. I regnanti di Glenbrook, Glacefort e i baroni del sale sono seduti sulle tribune d'onore.»", "feudi_colosseo"],
            ["fe_roland", "«Di fronte a noi c'è la Generale Avlora con la Legione d'Acciaio Suprema. Questa partita deciderà le sorti dell'intero continente.»", "feudi_colosseo"],
            ["hero", "«La nostra squadra non combatte per la sete di potere, ma per il futuro del popolo. Vinciamo questa finale!»", "feudi_colosseo"]
          ],
          build(Ls) {
            Ls.lay(0, 0, 35, 23, ",");
            // Mura del Colosseo
            Ls.lay(0, 0, 35, 2, "#");
            Ls.lay(0, 0, 1, 23, "#");
            Ls.lay(34, 0, 35, 23, "#");
            Ls.lay(0, 22, 35, 23, "#");
            // Il Campo di Sabbia Dorata al centro
            Ls.lay(4, 8, 31, 19, ".");
            // Tribuna d'onore dei feudi (B)
            Ls.put(18, 3, "B");
            // Altare del Gran Verdetto (X)
            Ls.put(18, 5, "X");
            // Fucina cerimoniale dei trofei (H)
            Ls.put(6, 4, "H");
            Ls.put(29, 4, "H");
            // Elementi scenografici dell'anfiteatro
            Ls.put(12, 5, "S"); // Spalti popolari
            Ls.put(24, 5, "G"); // Palco dei Senatori di Norzelia
            Ls.put(6, 17, "P"); // Ingresso d'onore dei Campioni
            Ls.put(29, 17, "C"); // Carro trionfale d'oro
          },
          actLabels: {
            "B": "👑 Tribuna Imperiale dei Tre Regni",
            "X": "⚖️ Altare della Bilancia Suprema",
            "H": "🏆 Forgia dei Trofei di Norzelia",
            "S": "🏟️ Spalti del Popolo di Norzelia",
            "G": "🏛️ Palco dei Senatori dei Feudi",
            "P": "🚪 Varchi d'Onore dei Gladiatori",
            "C": "🏆 Carro Trionfale delle Tre Corone",
            "18,3": "👑 Tribuna Imperiale dei Tre Regni",
            "18,5": "⚖️ Altare della Bilancia Suprema",
            "6,4": "🏆 Forgia dei Trofei di Norzelia",
            "29,4": "🏆 Forgia dei Trofei di Norzelia",
            "12,5": "🏟️ Spalti del Popolo di Norzelia",
            "24,5": "🏛️ Palco dei Senatori dei Feudi",
            "6,17": "🚪 Varchi d'Onore dei Gladiatori",
            "29,17": "🏆 Carro Trionfale delle Tre Corone"
          },
          npcs: (s) => {
            const list = [
              { id: "fe_benedict", at: [13, 16], dir: "up", name: "Benedict" },
              { id: "fe_roland", at: [18, 16], dir: "up", name: "Roland" },
              { id: "fe_frederica", at: [23, 16], dir: "up", name: "Frederica" },
              { id: "fe_erador", at: [18, 20], dir: "up", name: "Erador" }
            ];
            if (s <= 1) {
              list.push({ id: "fe_avlora", at: [18, 10], dir: "down", name: "Generale Avlora" });
            }
            return list;
          }
        }
      },
      talk: {
        fe_avlora: () => {
          const s = S();
          if (s === 0) {
            say([
              ["fe_avlora", "«Così siete voi il famoso Lord {n} di Casa Wolffort. Vostro padre Symon era un guerriero di pietra e cuore. Mostratemi se siete all'altezza del suo nome o solo l'ombra di un casato al tramonto!»", "feudi_colosseo"],
              ["hero", "«La nostra determinazione è stata forgiata sulla Bilancia, Generale Avlora. Non ci arrenderemo.»", "feudi_colosseo"],
              ["fe_avlora", "«Bene. Che il campo di sabbia sia testimone del nostro destino!»", "feudi_colosseo"]
            ], () => {
              setStep(N, 1);
              note("Parla con Benedict e Roland per dare il fischio d'inizio alla Finale Suprema.");
              done();
            });
            return;
          }
          if (s === 1) {
            ask("fe_avlora", "«I trombonieri hanno annunciato il duello! Siete pronti a sfidare la Legione d'Acciaio Suprema sul campo del Colosseo?»", [
              {
                label: "⚔️ Fischio d'Inizio: La Finale Suprema di Norzelia!",
                cls: "hot",
                fn: () => startFinalMatch()
              },
              { label: "Un attimo per studiare la formazione", fn: done }
            ]);
            return;
          }
          say([["fe_avlora", "«Un tiro imparabile... Riconosco con onore la vostra superiorità sul campo, Lord Custode.»", "feudi_colosseo"]], done);
        },
        fe_benedict: () => {
          const s = S();
          if (s === 0) {
            say([["fe_benedict", "«Andate da Avlora al centro dell'arena per accettare la sfida imperiale.»", "feudi_colosseo"]], done);
            return;
          }
          if (s === 1) {
            ask("fe_benedict", "«Tutte le casate attendono il fischio d'inizio. Scendiamo in campo per la Gloria dei Wolffort?»", [
              {
                label: "⚽ Inizia la Partita Finale contro Avlora!",
                cls: "hot",
                fn: () => startFinalMatch()
              },
              { label: "Rivedi le tattiche", fn: done }
            ]);
            return;
          }
          handleFinalDestiny();
        },
        fe_roland: () => {
          say([
            ["fe_roland", "«Non ho mai sentito il mio cuore battere così forte, amico mio. Qualunque finale scriveremo oggi, sarò orgoglioso di aver giocato accanto a te!»", "feudi_colosseo"]
          ], done);
        },
        fe_frederica: () => {
          say([
            ["fe_frederica", "«La luce dell'arena illumina le nostre maglie. Facciamo brillare il Colpo del Falco per tutti i popoli di questa terra!»", "feudi_colosseo"]
          ], done);
        },
        fe_erador: () => {
          say([
            ["fe_erador", "«Muro d'acciaio pronto a respingere qualsiasi contrattacco della legione, Lord Custode!»", "feudi_colosseo"]
          ], done);
        }
      },
      obj: {
        "feudi_colosseo_ch4:B": () => {
          say([["voce", "La Tribuna dei Sovrani di Norzelia è gremita di consoli, ambasciatori e dignitari con le bandiere araldiche spiegate.", "feudi_colosseo"]], done);
        },
        "feudi_colosseo_ch4:18,3": () => {
          say([["voce", "La Tribuna dei Sovrani di Norzelia è gremita di consoli, ambasciatori e dignitari con le bandiere araldiche spiegate.", "feudi_colosseo"]], done);
        },
        "feudi_colosseo_ch4:X": () => handleFinalDestiny(),
        "feudi_colosseo_ch4:18,5": () => handleFinalDestiny(),
        "feudi_colosseo_ch4:H": () => {
          say([["voce", "La forgia cerimoniale dove i maestri cesellatori incidono i nomi dei campioni sulla coppa del Gran Giudizio.", "feudi_colosseo"]], done);
        },
        "feudi_colosseo_ch4:6,4": () => {
          say([["voce", "La forgia cerimoniale dove i maestri cesellatori incidono i nomi dei campioni sulla coppa del Gran Giudizio.", "feudi_colosseo"]], done);
        },
        "feudi_colosseo_ch4:29,4": () => {
          say([["voce", "La forgia cerimoniale dove i maestri cesellatori incidono i nomi dei campioni sulla coppa del Gran Giudizio.", "feudi_colosseo"]], done);
        },
        "feudi_colosseo_ch4:S": () => handleSpaltiPopolari(),
        "feudi_colosseo_ch4:12,5": () => handleSpaltiPopolari(),
        "feudi_colosseo_ch4:G": () => handlePalcoSenatori(),
        "feudi_colosseo_ch4:24,5": () => handlePalcoSenatori(),
        "feudi_colosseo_ch4:P": () => handlePortaGladiatori(),
        "feudi_colosseo_ch4:6,17": () => handlePortaGladiatori(),
        "feudi_colosseo_ch4:C": () => handleCarroTrionfale(),
        "feudi_colosseo_ch4:29,17": () => handleCarroTrionfale()
      }
    };

    function handleSpaltiPopolari() {
      say([
        ["voce", "Migliaia di cittadini da ogni angolo di Norzelia sventolano stendardi e fazzoletti: «Casa Wolffort! Guidateci verso una nuova era di pace!»", "feudi_colosseo"]
      ], done);
    }

    function handlePalcoSenatori() {
      say([
        ["voce", "I senatori imperiali di Aesfrost e i consoli di Glenbrook discutono a bassa voce osservando la Bilancia: la vittoria sul campo piegherà le loro convinzioni.", "feudi_colosseo"]
      ], done);
    }

    function handlePortaGladiatori() {
      say([
        ["voce", "Il monumentale arco in pietra da cui fanno il loro ingresso nell'arena i campioni e i gladiatori più forti della storia dei feudi.", "feudi_colosseo"]
      ], done);
    }

    function handleCarroTrionfale() {
      say([
        ["voce", "Il carro cerimoniale foderato di velluto scarlatto e decorato in lamine d'oro: attende di condurre il vincitore del torneo all'incoronazione.", "feudi_colosseo"]
      ], done);
    }

    function startFinalMatch() {
      X.sfxFeudalFanfare();
      X.playMatch({
        title: "La Finale Suprema delle Tre Corone di Norzelia",
        intro: "La temibile Generale Avlora guida i Campioni d'Acciaio! Il destino del continente è nelle tue gambe: scatena «{tiro}»!",
        teamName: "Legione d'Acciaio Suprema di Avlora",
        teamCol: "#450a0a",
        oppNames: ["Generale Avlora", "Alfiere d'Acciaio 1", "Alfiere d'Acciaio 2", "Paladino Inespugnabile", "Colosso dei Feudi"],
        done: (r) => {
          if (r.win) {
            X.sfxScalesBalance();
            setStep(N, 2);
            note("SAGA COMPLETATA! Trionfo assoluto nell'Anfiteatro del Gran Giudizio!");
            const rewMsg = reward("feudi_ch4_win", {
              coins: 100,
              cos: "feudi_corona_norzelia",
              note: "Completata l'intera Saga della Bilancia delle Tre Corone!"
            });

            say([
              ["voce", `RETEEE AL 93° MINUTO! Con una traiettoria divina trafitto da polvere d'oro e sabbia, il tuo tiro «{tiro}» piega le mani del portiere imperiale! Fischio finale: Casa Wolffort trionfa nel torneo supremo!`, "feudi_colosseo"],
              ["fe_avlora", `«Non ho rimpianti. Siete stati più forti, più uniti e più giusti. Inchino la mia spada al nuovo sovrano di Norzelia.»`, "feudi_colosseo"],
              ["voce", `<b>🏆 VITTORIA SUPREMA NELL'ANFITEATRO DEI FEUDI!</b><br><span style="color:#fbbf24">${rewMsg}</span><br>Avvicinati all'Altare della Bilancia per proclamare il destino di Norzelia!`, "feudi_colosseo"]
            ], () => {
              handleFinalDestiny();
            });
          } else {
            say([
              ["fe_benedict", "«La Legione d'Acciaio ha respinto l'ultimo affondo al 90°! Ma la partita non è perduta, Lord Custode: riorganizziamo i raddoppi di Roland ed Erador e scendiamo di nuovo in campo!»", "feudi_colosseo"]
            ], done);
          }
        }
      });
    }

    function handleFinalDestiny() {
      const m = mem();
      const hasAllClues = m.clues.some((c) => c.id === "prova_dazi_pane") &&
                          m.clues.some((c) => c.id === "prova_chiuse_segrete") &&
                          m.clues.some((c) => c.id === "prova_contrabbando_sorsley");

      const isGoldenAvailable = hasAllClues && (m.tokens >= 4);

      const opts = [
        {
          label: "⚖️ [FINALE 1 · LA PACE DEI GIUSTI]: Proclama il Trattato di Verità e Trasparenza!",
          sub: "Moralità dominante · Roland sul trono di Glenbrook, amicizia leale e giustizia",
          cls: "hot",
          fn: () => triggerEpilogue("moralita")
        },
        {
          label: "📜 [FINALE 2 · IL DOMINIO D'ACCIAIO]: Riorganizza i feudi sotto la guida commerciale dei Wolffort!",
          sub: "Utilità dominante · Pragmatismo supremo con Benedict, capitale economica continentale",
          cls: "hot",
          fn: () => triggerEpilogue("utilita")
        },
        {
          label: "🕊️ [FINALE 3 · IL VENTO DEI ROSELIANI]: Abbatti ogni frontiera e dichiara la Libertà universale!",
          sub: "Libertà dominante · Con Frederica, salvezza dei Roselliani e lega libera dei popoli",
          cls: "hot",
          fn: () => triggerEpilogue("liberta")
        }
      ];

      if (isGoldenAvailable) {
        opts.unshift({
          label: "🌟 [FINALE D'ORO · LA CORONA UNITA DI NORZELIA]: La Via Segreta del Vero Sovrano!",
          sub: "UNANIMITÀ DEL CONSIGLIO · Tutte le 3 prove raccolte! Federazione democratica eterna",
          cls: "hot",
          fn: () => triggerEpilogue("golden")
        });
      }

      ask("hero", "Le tue scelte e le indagini condotte hanno plasmato il continente. Quale destino scegli per Norzelia?", opts);
    }

    function triggerEpilogue(key) {
      X.sfxScalesBalance();
      F.set("finale_feudi", key);
      finishChapter(N, "epilogo_" + key);

      const h = hero();
      const nm = h ? h.name : "Lord Custode";

      const onEndEpilogue = () => {
        ask("hero", "La saga de «La Bilancia delle Tre Corone» si conclude qui. Cosa desideri fare adesso?", [
          { label: "⚖️ Consulta le Statistiche della Bilancia del Consiglio", cls: "hot", fn: openCouncilModal },
          { label: "⚽ Torna al Borgo Marino e alle altre modalità", fn: leave }
        ]);
      };

      if (key === "golden") {
        X.sfxFeudalFanfare();
        say([
          ["voce", `<b>👑 EPILOGO SEGRETO D'ORO: LA CORONA UNITA DI NORZELIA!</b><br>Grazie a tutte le prove raccolte (Dazi del Pane, Chiuse Segrete, Libro Mastro di Sorsley) esponi la cospirazione davanti a tutti i popoli!`, "feudi_colosseo"],
          ["fe_benedict", `«Incredibile... Nessun compromesso al ribasso, nessuna violenza ingiustificata. Avete convinto tutti i tre feudi ad unirsi in una federazione democratica con la sola forza della verità.»`, "feudi_colosseo"],
          ["fe_roland", `«Il calcio non sarà mai più un rito di divisione, ma la festa che unisce le nostre genti ogni anno in questo Colosseo.»`, "feudi_colosseo"],
          ["fe_frederica", `«I Roselliani, gli abitanti di Glenbrook e i minatori di Glacefort sono finalmente cittadini liberi con gli stessi diritti. Grazie, ${nm}... sei il vero sovrano di Norzelia!»`, "feudi_colosseo"],
          ["hero", `«La Bilancia ha pesato la giustizia, e il cuore dei feudi ha risposto. Torniamo a casa al Borgo da leggende assolute!»`, "feudi_colosseo"],
          ["voce", `Hai sbloccato il <b>Vero Finale d'Oro</b> e l'esclusivo manufatto <b>Corona Unita di Norzelia</b>!`, "feudi_colosseo"]
        ], onEndEpilogue);
      } else if (key === "moralita") {
        say([
          ["voce", `<b>⚖️ EPILOGO 1: LA PACE DEI GIUSTI RAGGIUNTO!</b><br>La sovranità delle leggi antiche e la moralità trionfano sul cinismo dei mercanti!`, "feudi_colosseo"],
          ["fe_roland", `«Glenbrook e Casa Wolffort ristabiliscono la dinastia legittima. La lealtà tra noi sarà il faro di pace per i secoli a venire.»`, "feudi_colosseo"],
          ["hero", `«La rettitudine ha vinto. Un trionfo che onora la memoria di mio padre Symon!»`, "feudi_colosseo"]
        ], onEndEpilogue);
      } else if (key === "utilita") {
        say([
          ["voce", `<b>📜 EPILOGO 2: IL DOMINIO D'ACCIAIO RAGGIUNTO!</b><br>Casa Wolffort diventa l'ago della bilancia economico e militare assoluto del continente!`, "feudi_colosseo"],
          ["fe_benedict", `«Il calcolo era perfetto, Lord ${nm}. Il sale, il ferro e le dighe sono sotto la nostra amministrazione fiduciaria. Norzelia ha trovato la stabilità nell'ordine.»`, "feudi_colosseo"],
          ["hero", `«Abbiamo garantito la sopravvivenza e la prosperità del nostro popolo per generazioni.»`, "feudi_colosseo"]
        ], onEndEpilogue);
      } else {
        say([
          ["voce", `<b>🕊️ EPILOGO 3: IL VENTO DEI ROSELIANI RAGGIUNTO!</b><br>La rivoluzione della libertà cancella ogni dogma e fa crollare le mura del monopolio!`, "feudi_colosseo"],
          ["fe_frederica", `«Le catene sono spezzate per sempre! Abbiamo donato il sale e la dignità a ogni famiglia oppressa.»`, "feudi_colosseo"],
          ["hero", `«Dove c'era oppressione, oggi soffia il vento della rinascita.»`, "feudi_colosseo"]
        ], onEndEpilogue);
      }
    }
  });

  // Esportazione Globale dell'API
  window.__bilanciaFeudi = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "⚖️ La Bilancia delle Tre Corone",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Saga Tattica dei Feudi (Triangle Strategy)"}`
          : "Crea prima il tuo campione · Saga tattica medievale con Bilancia del Consiglio e Gettoni d'Oro"
      };
    },
    info() {
      const m = mem();
      return {
        ch: m.ch,
        step: Object.assign({}, m.step),
        done: Object.assign({}, m.done),
        convictions: Object.assign({}, m.convictions),
        clues: m.clues.length,
        tokens: m.tokens
      };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
