// ============================================================================
// I PIRATI DELLA TEMPESTA CELESTE · L'ARCIPELAGO SOSPESO
// Saga Pirata, Aerea & Tattica per il Tuo Campione
// Ispirata a One Piece, Il Pianeta del Tesoro e Skies of Arcadia
// Motore 2D Camminabile HD con Gancio di Vento, Rotte Celesti e Partite nel Vuoto
// ============================================================================
(function () {
  "use strict";

  if (window.__piratiStoryLoaded) return;
  window.__piratiStoryLoaded = true;

  const KEY = "ali-di-rondine.pirati-story";
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

  // ------------------------------------------------------------------ Audio Synthesizer (Vento, Onde d'Aria & Cannoni)
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  function sfxWindBurst() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Sibilo del vento ascendente
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);
      g.gain.setValueAtTime(0.01, now);
      g.gain.linearRampToValueAtTime(0.35, now + 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.7);
    } catch (e) {}
  }

  function sfxGrappleHook() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Lancio a scatto del rampino
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.15);

      // Aggancio metallico risonante
      const osc2 = ctx.createOscillator(), g2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(659.25, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.28);
      g2.gain.setValueAtTime(0.3, now + 0.14);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(g2); g2.connect(ctx.destination);
      osc2.start(now + 0.14); osc2.stop(now + 0.45);
    } catch (e) {}
  }

  function sfxPirateCannon() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.45);
      g.gain.setValueAtTime(0.8, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.5);
    } catch (e) {}
  }

  function sfxTreasureFound() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.25, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.08 + 0.35);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Salvataggio normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;

  function norm(o) {
    o = obj(o);
    const m = {
      v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {},
      zone: "", routes: [], log: [], intro: {}, wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0)
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
    m.routes = [...new Set(arr(o.routes).filter((x) => typeof x === "string"))].slice(0, 50);
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

  const addRoute = (id, name, desc) => {
    const m = mem();
    const key = `${id}:::${name}:::${desc}`;
    if (!m.routes.some((c) => c.startsWith(id + ":::"))) {
      m.routes.push(key); save();
      sfxTreasureFound();
      if (api && api.trToast) api.trToast(`🧭 Rotta Registrata: ${name}`);
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
    saetta: "una folgore d'alta quota che squarcia le correnti d'aria",
    serpentina: "un tifone a spirale che manda fuori rotta il portiere avversario",
    parabola: "un arco maestoso che scavalca le vele come un gabbiano solare",
    martello: "una cannonata di vento compresso pesante come piombo fuso",
    traversa: "un colpo di rimbalzo calcolato millimetricamente tra le sartie",
    saudade: "un fendente malinconico che vola leggero sopra il mare di nuvole",
    muro: "un turbine d'aria che arresta sul nascere ogni contropiede"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 10, shotName: "IL TIRO DEL TIFONE", shot: "saetta" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "IL TIRO DEL TIFONE")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un tiro leggendario che domina i cieli");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "corsaro", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye || "#38bdf8",
      bg: ["#0369a1", "#0284c7"], shirt: "#0284c7", num: String(h.num), acc: h.acc,
      cap: h.acc === "cappellino" ? "#0369a1" : h.acc === "berretto" ? "#075985" : undefined
    };
  }

  const coinsGive = (n) => {
    if (n > 0 && typeof window.addCoins === "function") {
      try { window.addCoins(n); return n; } catch (e) { return 0; }
    }
    return 0;
  };
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

  // ------------------------------------------------------------------ Effetto Gancio di Vento Visivo
  let windFxActive = false;
  let windFxAlpha = 0;

  function triggerWindHookVisualFx(onFinish) {
    windFxActive = true;
    windFxAlpha = 1.0;
    sfxWindBurst();
    setTimeout(() => { sfxGrappleHook(); }, 180);
    const checkInterval = setInterval(() => {
      windFxAlpha -= 0.05;
      if (windFxAlpha <= 0) {
        windFxAlpha = 0;
        windFxActive = false;
        clearInterval(checkInterval);
        if (typeof onFinish === "function") onFinish();
      }
    }, 30);
  }

  function drawWindOverlay(g, W, H) {
    if (!windFxActive && windFxAlpha <= 0) return;
    g.save();
    // Bagliore di tempesta celeste
    const gr = g.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, Math.max(W, H));
    gr.addColorStop(0, `rgba(56, 189, 248, ${windFxAlpha * 0.45})`);
    gr.addColorStop(0.5, `rgba(14, 165, 233, ${windFxAlpha * 0.6})`);
    gr.addColorStop(1, `rgba(3, 105, 161, ${windFxAlpha * 0.75})`);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);

    // Spirali del vento ascendente
    const cx = W / 2, cy = H / 2;
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(224, 242, 254, ${windFxAlpha * 0.9})`;
    g.lineWidth = 2.5;

    for (let i = 0; i < 4; i++) {
      const off = (i * Math.PI) / 2;
      g.beginPath();
      g.arc(cx, cy, 25 + i * 14, off, off + Math.PI * 0.85);
      g.stroke();
    }

    // Bussola / Rosa dei Venti al centro
    g.fillStyle = `rgba(254, 240, 138, ${windFxAlpha * 0.95})`;
    g.beginPath();
    g.moveTo(cx, cy - 28); g.lineTo(cx + 6, cy - 8); g.lineTo(cx + 28, cy);
    g.lineTo(cx + 6, cy + 8); g.lineTo(cx, cy + 28); g.lineTo(cx - 6, cy + 8);
    g.lineTo(cx - 28, cy); g.lineTo(cx - 6, cy - 8);
    g.closePath();
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

  // Sfondo 1: Porto di Nembocroce & I Moli Celesti
  function bgPortoCeleste(g, W, H, f) {
    // Cielo turchese dell'alta atmosfera
    grad(g, 0, 0, W, H, ["#0284c7", "#38bdf8", "#bae6fd"]);
    // Sole accecante tra le nubi
    glow(g, 250, 40, 50, "254,240,138", 0.7);
    g.fillStyle = "#fef08a"; g.beginPath(); g.arc(250, 40, 14, 0, 7); g.fill();

    // Isole galleggianti lontane nel cielo
    [[30, 70, 40, 12], [140, 50, 55, 14], [270, 80, 45, 10]].forEach(([ix, iy, iw, ih]) => {
      g.fillStyle = "#0369a1";
      g.beginPath();
      g.moveTo(ix, iy); g.lineTo(ix + iw, iy); g.lineTo(ix + iw * 0.75, iy + ih); g.lineTo(ix + iw * 0.25, iy + ih);
      g.closePath(); g.fill();
      // Vegetazione dorata in cima
      R(g, ix, iy - 2, iw, 3, "#ca8a04");
    });

    // Galeone a vele solari in lontananza
    const gx = (60 + f * 0.2) % (W + 80) - 40;
    R(g, gx, 85, 26, 8, "#78350f");
    R(g, gx + 11, 68, 3, 17, "#92400e");
    g.fillStyle = "rgba(254, 240, 138, 0.85)";
    g.beginPath(); g.moveTo(gx + 12, 70); g.lineTo(gx + 24, 76); g.lineTo(gx + 12, 82); g.fill();

    // Mare di nubi spumeggianti
    g.fillStyle = "rgba(255, 255, 255, 0.85)";
    for (let i = 0; i < 9; i++) {
      const cx = (i * 42 + f * 0.4) % (W + 60) - 30;
      g.beginPath(); g.arc(cx, 135 + Math.sin(f * 0.05 + i) * 4, 30, 0, Math.PI * 2); g.fill();
    }

    // Molo di legno in primo piano con bitte e gomene
    R(g, 0, 148, W, 52, "#451a03");
    for (let x = 0; x < W; x += 24) {
      R(g, x, 148, 1, 52, "#291305");
      R(g, 0, 170, W, 1, "#291305");
    }
    // Lanterna di banchina a prua
    [40, 270].forEach((bx) => {
      R(g, bx - 2, 135, 4, 16, "#78350f");
      glow(g, bx, 132, 18, "56,189,248", 0.65);
      R(g, bx - 1, 130, 3, 4, "#bae6fd");
    });
  }

  // Sfondo 2: La Taverna della Rosa dei Venti
  function bgTavernaVento(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#1c1007", "#2e1a0c", "#180d06"]);
    // Oblò gigante centrale con vista sulle nubi solari
    g.fillStyle = "#0284c7";
    g.beginPath(); g.arc(160, 55, 42, 0, Math.PI * 2); g.fill();
    // Telaio in ottone
    g.strokeStyle = "#d97706"; g.lineWidth = 4;
    g.beginPath(); g.arc(160, 55, 42, 0, Math.PI * 2); g.stroke();
    // Raggi sole nell'oblò
    g.fillStyle = "#fef08a"; g.beginPath(); g.arc(175, 45, 12, 0, 7); g.fill();
    g.fillStyle = "rgba(255,255,255,0.75)";
    g.beginPath(); g.arc(150, 75, 18, 0, 7); g.arc(170, 78, 16, 0, 7); g.fill();

    // Mappe delle rotte e timoni appesi alle pareti di quercia
    [30, W - 60].forEach((wx) => {
      // Timone
      g.strokeStyle = "#92400e"; g.lineWidth = 2.5;
      g.beginPath(); g.arc(wx + 15, 50, 16, 0, Math.PI * 2); g.stroke();
      // Raggi
      for (let a = 0; a < 4; a++) {
        const ang = (a * Math.PI) / 4;
        g.beginPath(); g.moveTo(wx + 15 - Math.cos(ang) * 16, 50 - Math.sin(ang) * 16);
        g.lineTo(wx + 15 + Math.cos(ang) * 16, 50 + Math.sin(ang) * 16); g.stroke();
      }
    });

    // Bancone di quercia massiccia
    R(g, 60, 115, 200, 35, "#3e2417");
    R(g, 55, 112, 210, 4, "#5c3824");
    // Boccali di sidro spumeggianti
    [85, 120, 190, 225].forEach((bx) => {
      R(g, bx, 102, 6, 10, "#d97706");
      R(g, bx - 1, 99, 8, 3, "#fef3c7"); // Schiuma
    });

    // Pavimento in parquet navale
    R(g, 0, 150, W, 50, "#27170e");
    for (let x = 0; x < W; x += 18) {
      R(g, x, 150, 1, 50, "#170e08");
      R(g, 0, 172, W, 1, "#170e08");
    }
  }

  // Sfondo 3: L'Arena della Rosa dei Venti (Il Campo Sospeso)
  function bgArenaVento(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#0369a1", "#0284c7", "#38bdf8"]);
    // Catene titaniche che reggono l'arena tra le isole
    g.strokeStyle = "#475569"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, 40); g.lineTo(W, 110); g.stroke();
    g.beginPath(); g.moveTo(0, 110); g.lineTo(W, 40); g.stroke();

    // Bandiere dei pirati che sventolano
    const fl = Math.sin(f * 0.18) * 3;
    [50, 160, 270].forEach((fx, fi) => {
      R(g, fx, 30, 3, 30, "#78350f");
      g.fillStyle = fi % 2 === 0 ? "#dc2626" : "#0284c7";
      g.beginPath();
      g.moveTo(fx + 3, 32); g.lineTo(fx + 22 + fl, 38); g.lineTo(fx + 3, 46);
      g.fill();
    });

    // Il campo d'erba e nubi galleggiante
    R(g, 15, 80, W - 30, 110, "#15803d");
    g.strokeStyle = "rgba(255, 255, 255, 0.75)";
    g.lineWidth = 1.5;
    g.strokeRect(25, 90, W - 50, 92);
    // Cerchio di centrocampo
    g.beginPath(); g.arc(W / 2, 136, 26, 0, Math.PI * 2); g.stroke();

    // Nubi vorticose attorno all'arena
    g.fillStyle = "rgba(255, 255, 255, 0.65)";
    for (let i = 0; i < 7; i++) {
      const cx = (i * 54 + f * 0.5) % (W + 60) - 30;
      g.beginPath(); g.arc(cx, 185, 24, 0, Math.PI * 2); g.fill();
    }
  }

  const BGS = {
    pi_porto_celeste: bgPortoCeleste,
    pi_taverna_vento: bgTavernaVento,
    pi_arena_sospesa: bgArenaVento
  };

  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) {
      safe(() => BGS[kind](g, W || 320, H || 200, frame || 0));
      if (windFxActive || windFxAlpha > 0) {
        drawWindOverlay(g, W || 320, H || 200);
      }
      return true;
    }
    const res = typeof prevBg === "function" ? prevBg.apply(this, arguments) : false;
    if (windFxActive || windFxAlpha > 0) {
      drawWindOverlay(g, W || 320, H || 200);
    }
    return res;
  };

  // ------------------------------------------------------------------ Tessere 16x16 (Pixel Art Pirata Celeste)
  // Pavimenti:
  //   _ = assi di legno di coperta
  //   ~ = banco di nubi basse galleggiante
  //   . = erba dorata dell'isola volante
  //   ^ = lastre di corallo celeste
  //   y = manto del campo da gioco
  // Solidi:
  //   A = parapetto di poppa / scogliera fluttuante
  //   M = albero maestro con sartie
  //   K = timone dorato
  //   C = cannone ad aria compressa
  //   B = lanterna di prua celeste
  //   X = forziere dei corsari
  //   T = grande tavolo con mappa
  //   b = botte di polvere da sparo
  //   F = faro delle correnti
  //   > < d = passerelle e ponti sospesi
  const FLOORS = '_~.^y';
  const SOLID = 'AMKCBTXbF><d';
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);

  const ZX = { map: null, under: null, id: "", cvs: null };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "A";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || "_";

  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const frNow = () => Math.floor(performance.now() / 16);

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 1);
    if (f === "_") {
      // Legno di coperta
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#78350f" : "#92400e");
      P(sx, sy + 7, 16, 1, "#451a03");
      P(sx + (ty % 2 ? 4 : 12), sy, 1, 7, "#451a03");
      P(sx + (ty % 2 ? 12 : 4), sy + 8, 1, 8, "#451a03");
      if (r < 0.15) P(sx + 5, sy + 3, 2, 2, "#d97706");
    } else if (f === "~") {
      // Banco di nubi basse
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#e0f2fe" : "#f0f9ff");
      P(sx + 4, sy + 6, 8, 4, "#bae6fd");
      if (r < 0.2) P(sx + 7, sy + 8, 4, 3, "#ffffff");
    } else if (f === ".") {
      // Erba dorata dell'isola volante
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#65a30d" : "#84cc16");
      P(sx + 4, sy + 5, 2, 3, "#4d7c0f");
      if (r < 0.2) P(sx + 8, sy + 11, 2, 2, "#facc15");
    } else if (f === "^") {
      // Pietra corallina azzurra
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#0284c7" : "#0369a1");
      P(sx + 5, sy + 5, 3, 3, "#38bdf8");
    } else if (f === "y") {
      // Campo dell'arena
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#16a34a" : "#22c55e");
      if (tx % 6 === 0) P(sx, sy, 1, 16, "rgba(255, 255, 255, 0.4)");
      if (ty % 6 === 0) P(sx, sy, 16, 1, "rgba(255, 255, 255, 0.4)");
    }
  }

  const PAINT = {
    A(sx, sy, tx, ty) {
      // Parapetto di legno e scogliera fluttuante
      P(sx, sy, 16, 16, "#451a03");
      P(sx, sy + 4, 16, 3, "#78350f");
      P(sx + 3, sy, 3, 16, "#291305");
      P(sx + 10, sy, 3, 16, "#291305");
    },
    M(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Albero maestro
      P(sx + 5, sy, 6, 16, "#78350f");
      P(sx + 6, sy, 4, 16, "#92400e");
      // Sartia di corda
      P(sx + 1, sy + 4, 14, 2, "#d97706");
    },
    K(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Timone dorato
      P(sx + 4, sy + 3, 8, 8, "#d97706");
      P(sx + 6, sy + 5, 4, 4, "#facc15");
      P(sx + 7, sy + 1, 2, 14, "#b45309");
      P(sx + 1, sy + 7, 14, 2, "#b45309");
    },
    C(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Cannone ad aria compressa
      P(sx + 2, sy + 6, 12, 6, "#334155");
      P(sx + 4, sy + 8, 10, 4, "#1e293b");
      P(sx + 1, sy + 9, 4, 5, "#78350f"); // Ruota affusto
      P(sx + 11, sy + 9, 4, 5, "#78350f");
    },
    B(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Lanterna di prua celeste
      P(sx + 6, sy + 6, 4, 8, "#78350f");
      const fl = Math.sin(fr / 8 + tx * 2) * 1.5;
      GP.fillStyle = "#38bdf8";
      GP.beginPath(); GP.arc(sx + 8, sy + 5, 4 + fl * 0.3, 0, 7); GP.fill();
      GP.fillStyle = "#e0f2fe"; P(sx + 7, sy + 4, 2, 2, "#ffffff");
    },
    X(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Forziere dei corsari
      P(sx + 2, sy + 5, 12, 9, "#78350f");
      P(sx + 2, sy + 3, 12, 4, "#92400e");
      P(sx + 2, sy + 8, 12, 2, "#d97706"); // Cerchiatura oro
      P(sx + 7, sy + 7, 2, 3, "#fde047"); // Serratura
    },
    T(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Tavolo grande con mappa
      P(sx + 1, sy + 3, 14, 10, "#451a03");
      P(sx + 3, sy + 5, 10, 6, "#fef3c7"); // Mappa
      P(sx + 6, sy + 7, 4, 2, "#0284c7"); // Rotte blu
    },
    b(sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Botte
      P(sx + 3, sy + 2, 10, 12, "#78350f");
      P(sx + 2, sy + 4, 12, 8, "#92400e");
      P(sx + 2, sy + 6, 12, 1, "#1e293b"); // Cerchio di ferro
      P(sx + 2, sy + 10, 12, 1, "#1e293b");
    },
    F(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      // Faro delle correnti
      P(sx + 3, sy + 5, 10, 10, "#0284c7");
      P(sx + 5, sy + 2, 6, 5, "#38bdf8");
      const fl = Math.sin(fr / 10 + tx) * 2;
      GP.fillStyle = "#fef08a";
      GP.beginPath(); GP.arc(sx + 8, sy + 4, 3 + fl * 0.2, 0, 7); GP.fill();
    },
    ">": (sx, sy, tx, ty) => passTile(sx, sy, ">"),
    "<": (sx, sy, tx, ty) => passTile(sx, sy, "<"),
    "d": (sx, sy, tx, ty) => passTile(sx, sy, "d")
  };

  function passTile(sx, sy, dir) {
    P(sx + 2, sy + 2, 12, 12, "#78350f");
    P(sx + 3, sy + 4, 10, 8, "#92400e");
    GP.fillStyle = "#38bdf8";
    GP.beginPath();
    if (dir === ">") { GP.moveTo(sx + 6, sy + 5); GP.lineTo(sx + 11, sy + 8); GP.lineTo(sx + 6, sy + 11); }
    else if (dir === "<") { GP.moveTo(sx + 10, sy + 5); GP.lineTo(sx + 5, sy + 8); GP.lineTo(sx + 10, sy + 11); }
    else { GP.moveTo(sx + 5, sy + 5); GP.lineTo(sx + 8, sy + 11); GP.lineTo(sx + 11, sy + 5); }
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
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "pi_porto_celeste";

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
      if (o.coins) { const n = coinsGive(o.coins); if (n) msg.push(`+${n} doppiette d'oro`); }
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
      bus: "cancello", busLabel: "Esci dall'Arcipelago",
      item: spec.item || ["Doppietta Celeste", "Doppiette"], itemCos: spec.itemCos, items: spec.items || [],
      bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({}, spec.act || {}), intro: [],
      me: () => {
        const c = api.CAST.hero || api.CAST.leo;
        return Object.assign({}, c, { shirt: "#0284c7", eye: "#38bdf8" });
      },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d");
        g.save(); g.globalCompositeOperation = "lighter";
        glow(g, x, y, 12, "56,189,248", 0.6 + 0.2 * Math.sin(frNow() / 10 + i));
        g.restore();
        g.fillStyle = "#facc15";
        g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#ffffff"; g.fillRect(x - 1, y - 1, 2, 2);
      }
    };

    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: Log Pose dei Corsari ed Esci." });

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
      if (windFxActive || windFxAlpha > 0) {
        const cv = document.getElementById("cv");
        if (cv) drawWindOverlay(cv.getContext("2d"), cv.width, cv.height);
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

  // ------------------------------------------------------------------ Menu & Log Pose dei Corsari
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
      `<b>I Pirati della Tempesta Celeste</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Doppiette ${bal()} · Rotte Segnate ${mem().routes.length}${h ? " · " + esc(h.name) : ""}</span>`,
      [
        { label: "Log Pose & Diario di Bordo", sub: "Mappe celesti, rotte magnetiche e frammenti dell'Isola Fantasma", cls: "hot", fn: () => notebook(zoneMenu, true) },
        { label: "Esci dall'Arcipelago", sub: "La rotta e i progressi restano salvati", cls: "hot", fn: leave }
      ],
      bgNow()
    );
  }

  function notebook(back, inZone) {
    const m = mem(), h = hero() || { name: "Campione", num: 10, shotName: "", shot: "saetta" };
    const routeRows = m.routes.map((c) => {
      const parts = c.split(":::");
      return `• <b>${esc(parts[1] || "Rotta")}</b>: <span style="color:var(--dim)">${esc(parts[2] || "")}</span>`;
    }).join("<br>") || "<span style='color:var(--dim)'>Nessuna rotta ancora tracciata. Esplora le isole volanti col Gancio di Vento.</span>";

    const cTact = F.get("tattica_corsara") === "arrembaggio"
      ? "Arrembaggio Frontale Audace (Sfida a viso aperto alla Flotta di Ferro)"
      : F.get("tattica_corsara") === "occhio_tempesta"
        ? "Rotta dell'Occhio del Ciclone (Manovra furtiva tra le correnti magnetiche)"
        : "In corso di navigazione";

    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} (Cannoniere del Gabbiano d'Oro)<br><span style="color:var(--dim)">Tiro delle Correnti: «${esc(h.shotName || "Il Tiro del Tifone")}»</span><br><br><b>Log Pose & Rotte Celesti</b><br>${routeRows}<br><br><b>Scelte Tattiche & Codice dei Corsari</b><br>• <b>Strategia della Rotta (Cap. 1):</b> <span style="color:var(--dim)">${cTact}</span><br><br><span style="color:var(--dim)">Vittorie nei Cieli: ${m.wins} · Sconfitte: ${m.losses}</span>`;

    if (inZone) {
      api.trAsk("voce", html, [{ label: "◂ Torna al Galeone", fn: done }], bgNow());
    } else {
      api.scene(bgNow(), "voce", html, [{ label: "◂ Indietro", fn: back }], "Log Pose dei Corsari");
    }
  }

  // ------------------------------------------------------------------ Partita Tattica tra le Nubi
  let inMatch = false;
  function playMatch(o) {
    castHero(); inMatch = true;
    api.match({
      id: o.id, chap: o.chap, intro: T(o.intro), mate: o.mate || "Morgana", mateGeneric: true,
      us: o.us || "I Bucanieri del Vento", min: o.min || 45, team: o.team, hero: undefined,
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
    addRoute, triggerWindHookVisualFx, sfxWindBurst, sfxGrappleHook, sfxPirateCannon, sfxTreasureFound,
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
  // CAPITOLO 1 · IL PORTO DELLE NUVOLE & IL PATTO DELLA ROSA DEI VENTI
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addRoute, triggerWindHookVisualFx, sfxWindBurst, sfxPirateCannon } = X;
    const N = 1, S = () => X.stepOf(N);

    // Personaggi dei Cieli
    X.cast("pi_morgana", {
      name: "Cap. Morgana", tag: "capitano", hair: "#ef4444", style: "long", skin: "#fed7aa", eye: "#0284c7",
      bg: ["#7f1d1d", "#f87171"], shirt: "#991b1b"
    }, "Capitana del galeone volante 'Gabbiano d'Oro'. Tricorno scarlatto con piuma azzurra, risata fiera e una passione sfrenata per il vento libero: «Nel cielo non ci sono bandiere a cui obbedire, solo compagni fidati che sanno come calciare una cannonata tra le nuvole!»");

    X.cast("pi_kidd", {
      name: "Kidd il Nostromo", tag: "ingegnere", hair: "#f59e0b", style: "messy", skin: "#fde047", eye: "#15803d",
      glasses: true, bg: ["#78350f", "#facc15"], shirt: "#451a03"
    }, "Geniale artigiano e nostromo di bordo. Ha brevettato il Gancio di Vento pneumatico per attraversare i burroni d'alta quota senza ali.");

    X.cast("pi_drake", {
      name: "Amm. Drake", tag: "marina", hair: "#0f172a", style: "slick", skin: "#e2e8f0", eye: "#1e3a8a",
      bg: ["#1e3a8a", "#60a5fa"], shirt: "#1e40af"
    }, "Comandante supremo della Flotta di Ferro dell'Impero Celeste. Crede nel rigido controllo delle rotte: «I pirati sono solo parassiti del vento. La flotta imperiale schiaccerà chiunque violi i confini delle nubi!»");

    X.cast("pi_anemona", {
      name: "Anemona", tag: "vedetta", hair: "#06b6d4", style: "ponytail", skin: "#ecfeff", eye: "#0891b2",
      bg: ["#0e7490", "#67e8f9"], shirt: "#155e75"
    }, "Giovane vedetta dell'alta coffa. Legge le aurore boreali e il cambio delle maree atmosferiche con uno sguardo infallibile.");

    // Accessorio cosmetico ricompensa Capitolo 1
    X.cos("pi_tricorno_corsaro", { kind: "acc", label: "Tricorno del Corsaro delle Tempeste", val: "#0284c7", from: "Completa il Capitolo 1 dei Pirati della Tempesta Celeste" });

    const goal = (s) => ({
      0: "Parla con Kidd il Nostromo al molo di Nembocroce per collaudare il Gancio di Vento.",
      1: "Usa il Gancio di Vento per superare la passerella crollata verso la Taverna della Rosa dei Venti.",
      2: "Entra nella Taverna ed incontra la Capitana Morgana per unirti alla ciurma.",
      3: "Affronta l'Ammiraglio Drake della Flotta di Ferro che irrompe nella taverna.",
      4: "Scegli la strategia d'arrembaggio per la flotta: assalto a viso aperto o rotta nell'occhio del ciclone.",
      5: "Scendi sull'Arena Sospesa della Rosa dei Venti e sconfiggi la Flotta di Ferro di Drake!",
      6: "Capitolo 1 completato! Parla con la Capitana Morgana per fare rotta verso l'Arcipelago Sospeso."
    }[s] || "Capitolo 1 concluso. Esplora liberamente i moli e raccogli le doppiette celesti.");

    const zones = {
      // 1. Porto di Nembocroce & I Moli Celesti
      pi_porto: {
        name: "Arcipelago Celeste · Porto di Nembocroce", short: "Moli di Nembocroce", sub: "Isole galleggianti, banchine e navi solari",
        w: 40, h: 26, start: [19, 21], theme: "torino", bg: "pi_porto_celeste",
        item: ["Doppietta Celeste", "Doppiette"], itemCos: "pi_tricorno_corsaro",
        items: [[3, 9], [36, 9], [10, 17], [29, 17]],
        areas: [
          [2, 2, 14, 10, "Il Molo delle Scialuppe"],
          [26, 2, 38, 10, "La Passerella Interrotta"],
          [14, 1, 23, 6, "La Porta della Taverna"],
          [12, 12, 28, 23, "Il Pontile Centrale"]
        ],
        hints: () => ({
          "Il Molo delle Scialuppe": "Scialuppe con vele di seta solare ormeggiate a colonne di corallo azzurro.",
          "La Passerella Interrotta": "Il ponte di corda verso la taverna è spezzato: solo un Gancio di Vento può farti superare l'abisso.",
          "La Porta della Taverna": "Una massiccia porta di quercia con l'insegna di una rosa dei venti in ottone.",
          "Il Pontile Centrale": "Botti di sidro e casse di viveri impilate sotto il sole d'alta quota."
        }),
        act: {
          C: "Ispeziona il cannone ad aria", B: "Guarda la lanterna di prua",
          X: "Apri il forziere dei marinai", b: "Esamina la botte di sidro",
          "^": "Entra nella Taverna", ">": "Scendi all'Arena Sospesa"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(38, 0, 39, 25, "A");
          Ls.lay(0, 24, 39, 25, "A");
          // Pavimento in assi di legno
          Ls.lay(2, 2, 37, 23, "_");
          // Banchi di nubi basse ai bordi
          Ls.lay(2, 2, 6, 8, "~");
          Ls.lay(33, 2, 37, 8, "~");
          // Alberi maestri e sartie
          Ls.put(8, 6, "M"); Ls.put(31, 6, "M");
          // Cannoni ad aria compressa sui bordi
          Ls.put(4, 12, "C"); Ls.put(35, 12, "C");
          // Forziere
          Ls.put(10, 18, "X");
          // Botti
          Ls.put(14, 18, "b"); Ls.put(25, 18, "b");
          // Lanterne di prua
          Ls.put(16, 6, "B"); Ls.put(23, 6, "B");
          // Porta della Taverna a nord
          Ls.put(19, 1, "^"); Ls.put(20, 1, "^");
          // Passaggio verso l'Arena a sud est
          Ls.put(35, 23, ">");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "pi_kidd", at: [18, 16] });
          if (s >= 0) list.push({ id: "pi_anemona", at: [6, 8] });
          return list;
        }
      },
      // 2. La Taverna della Rosa dei Venti
      pi_taverna: {
        name: "Nembocroce · Taverna della Rosa dei Venti", short: "La Rosa dei Venti", sub: "Boccali di sidro, mappe stellari e pirati",
        w: 38, h: 26, start: [18, 22], theme: "torino", bg: "pi_taverna_vento",
        item: ["Doppietta Celeste", "Doppiette"],
        items: [[4, 4], [33, 4], [8, 18], [29, 18]],
        areas: [
          [12, 2, 25, 8, "Il Banco della Capitana"],
          [2, 6, 12, 18, "I Tavoli dei Cartografi"],
          [26, 6, 35, 18, "Il Salone degli Ufficiali"],
          [14, 16, 23, 23, "L'Oblò Panoramico"]
        ],
        hints: () => ({
          "Il Banco della Capitana": "La Capitana Morgana consulta la carta dell'Isola Fantasma mentre assapora sidro di mele d'oro.",
          "I Tavoli dei Cartografi": "Mappe e bussole magnetiche sparse tra boccali spumeggianti.",
          "Il Salone degli Ufficiali": "L'Ammiraglio Drake osserva con disprezzo l'equipaggio pirata.",
          "L'Oblò Panoramico": "Un cerchio di vetro e ottone affacciato sul vuoto e sulle nuvole."
        }),
        act: {
          T: "Esamina la mappa celeste", K: "Gira il timone dorato da parete",
          b: "Brinda con la botte di sidro", d: "Torna ai Moli di Nembocroce"
        },
        build(Ls) {
          Ls.lay(0, 0, 37, 1, "A");
          Ls.lay(0, 0, 1, 25, "A");
          Ls.lay(36, 0, 37, 25, "A");
          Ls.lay(0, 24, 37, 25, "A");
          // Pavimento in parquet navale
          Ls.lay(2, 2, 35, 23, "_");
          // Timone dorato a parete
          Ls.put(18, 2, "K"); Ls.put(19, 2, "K");
          // Tavoli grandi
          Ls.put(8, 10, "T"); Ls.put(29, 10, "T");
          Ls.put(8, 15, "T"); Ls.put(29, 15, "T");
          // Botti
          Ls.put(14, 8, "b"); Ls.put(23, 8, "b");
          // Uscita sud
          Ls.put(18, 24, "d"); Ls.put(19, 24, "d");
        },
        npcs(s) {
          const list = [];
          list.push({ id: "pi_morgana", at: [18, 6] });
          if (s >= 3) list.push({ id: "pi_drake", at: [28, 12] });
          return list;
        }
      },
      // 3. L'Arena della Rosa dei Venti (Il Campo Sospeso)
      pi_arena: {
        name: "Nembocroce · Arena della Rosa dei Venti", short: "Arena Sospesa", sub: "Campo di gioco sospeso nel vuoto tra le nubi",
        w: 40, h: 28, start: [20, 25], theme: "torino", bg: "pi_arena_sospesa",
        item: ["Doppietta Celeste", "Doppiette"],
        items: [[4, 6], [35, 6], [10, 20], [29, 20]],
        areas: [
          [4, 4, 35, 22, "Il Campo Sospeso"],
          [16, 2, 23, 6, "La Loggia dei Corsari"]
        ],
        hints: () => ({
          "Il Campo Sospeso": "Un rettangolo d'erba e coralli d'aria sorretto da catene titaniche. Nessun muro di cinta: se la sfera esce, vola nell'abisso!",
          "La Loggia dei Corsari": "La Capitana Morgana e l'equipaggio incoraggiano il Campione a suon di fischi e tamburi."
        }),
        act: {
          d: "Torna ai Moli di Nembocroce"
        },
        build(Ls) {
          Ls.lay(0, 0, 39, 1, "A");
          Ls.lay(0, 0, 1, 27, "A");
          Ls.lay(38, 0, 39, 27, "A");
          Ls.lay(0, 26, 39, 27, "A");
          // Campo di gioco verde smeraldo
          Ls.lay(3, 4, 36, 22, "y");
          // Uscita sud
          Ls.put(19, 26, "d"); Ls.put(20, 26, "d");
        },
        npcs(s) {
          const list = [];
          if (s >= 5) {
            list.push({ id: "pi_morgana", at: [16, 3] });
            list.push({ id: "pi_drake", at: [23, 3] });
          }
          return list;
        }
      }
    };

    // Dialoghi Capitolo 1
    function kiddTalk() {
      const s = S();
      if (s === 0) {
        return say([
          ["pi_kidd", "Ehilà, pivello delle correnti! Da dove sbuchi con quella maglia numero {num}?"],
          ["hero", "Sono {n}. La mia scialuppa a vela solare ha perso quota sopra le scogliere di Nembocroce."],
          ["pi_kidd", "Sei atterrato nel posto giusto! Sei capitato all'Arcipelago Sospeso, la culla dei pirati del cielo. Ma se vuoi raggiungere la Taverna della Rosa dei Venti lassù, la passerella di corda è crollata stamattina dopo il temporale."],
          ["hero", "C'è un'altra via per salire?"],
          ["pi_kidd", "Altroché! Tieni questo: è il mio brevetto, il «Gancio di Vento Pneumatico». Si allaccia all'avambraccio e spara un dardo a gas compresso che si aggancia alle sartie più alte. Vuoi provarlo subito?"],
        ], () => {
          ask("pi_kidd", "«Premi il pulsante di sgancio del Gancio di Vento, {n}!»", [
            {
              label: "🪝 [ATTIVA IL GANCIO DI VENTO]: Salta il baratro e agganciati al pontile della taverna!",
              cls: "hot",
              fn: () => {
                triggerWindHookVisualFx(() => {
                  setStep(N, 1);
                  addRoute("gancio_vento", "Il Gancio di Vento", "Dispositivo pneumatico per librarsi tra le isole volanti e superare qualsiasi abisso.");
                  note("Collaudato con successo il Gancio di Vento: via libera per la Taverna!");
                  say([
                    ["voce", "SBLAM! Un cavo d'acciaio sottilissimo fende l'aria con un fischio acuto. Il rampino artiglia l'albero maestro della taverna e ti trascina in volo sopra le nuvole, depositandoti sul pontile!"],
                    ["pi_kidd", "Per mille albatros! Una manovra perfetta! Ora entra nella taverna: la Capitana Morgana sta arruolando il miglior cannoniere dell'arcipelago."],
                  ], done);
                });
              }
            }
          ]);
        });
      }
      return say([
        ["pi_kidd", "Quel gancio non ti lascerà mai cadere nel vuoto. Ricordati di calibrare la pressione quando c'è vento contro!"],
      ], done);
    }

    function morganaTalk() {
      const s = S();
      if (s < 2) return say([["pi_morgana", "Non ho tempo per i marinai d'acqua dolce. Se vuoi parlare con me, dimostra di saper volare."]], done);
      if (s === 2) {
        return say([
          ["pi_morgana", "Ho visto quel salto col gancio dalla finestra, ragazzo. Niente male per un forestiero con il numero {num} sul petto."],
          ["hero", "Capitana Morgana. Dicono che il tuo galeone 'Gabbiano d'Oro' stia cercando la rotta per l'Isola Fantasma."],
          ["pi_morgana", "Non è una leggenda per ubriachi, {n}. L'Isola Fantasma galleggia al centro del Grande Ciclone. Custodisce il Tesoro dei Cieli e la Coppa delle Tempeste. Ma per arrivarci mi serve un cannoniere capace di calciare la sfera nei nodi magnetici per deviare le correnti... e dicono che il tuo tiro «{tiro}» sia il più potente dell'emisfero."],
          ["hero", "Non sbaglio un colpo, capitana."],
        ], () => {
          setStep(N, 3);
          note("Incontrata la Capitana Morgana: l'alleanza dei corsari è suggellata.");
          say([
            ["voce", "Un boato sordo fa tremare i boccali sui tavoli. La porta della taverna si spalanca e decine di fanti in corazza candida circondano il salone!"],
          ], done);
        });
      }
      if (s === 4) {
        return ask("pi_morgana", "«Quale tattica scegli per affrontare Drake e la Flotta di Ferro sull'Arena Sospesa, {n}?»", [
          {
            label: "⚓ [L'ARREMBAGGIO AUDACE]: Sfida frontale e carica a viso aperto contro la Marina!",
            cls: "hot",
            fn: () => {
              sfxPirateCannon();
              F.set("tattica_corsara", "arrembaggio");
              setStep(N, 5);
              addRoute("tattica_arrembaggio", "Arrembaggio Audace", "Hai scelto l'assalto diretto senza timore contro i campioni dell'Impero Celeste.");
              note("Tattica scelta: Arrembaggio Audace a tutto campo!");
              say([
                ["pi_morgana", "Così mi piaci! Niente trucchi da codardi: scendiamo sull'Arena della Rosa dei Venti e affondiamo la Flotta di Ferro con il tuo tiro «{tiro}»!"],
              ], done);
            }
          },
          {
            label: "🌪️ [LA ROTTA DEL CICLONE]: Sfrutta i vortici laterali del vento per prenderli di sorpresa!",
            fn: () => {
              sfxWindBurst();
              F.set("tattica_corsara", "occhio_tempesta");
              setStep(N, 5);
              addRoute("tattica_ciclone", "La Rotta del Ciclone", "Hai calcolato le correnti per aggirare la rigida formazione difensiva imperiale.");
              note("Tattica scelta: Manovra del Ciclone a sorpresa!");
              say([
                ["pi_morgana", "Astuto come una volpe dei cieli. Useremo le folate laterali per scavalcare il loro muro difensivo. Andiamo all'Arena!"],
              ], done);
            }
          }
        ]);
      }
      if (s === 6) {
        return say([
          ["pi_morgana", "Abbiamo spezzato l'assedio di Drake! Il Gabbiano d'Oro ha spiegato le vele solari: la rotta verso l'Arcipelago Centrale è spalancata per noi!"],
        ], done);
      }
      return say([
        ["pi_morgana", "L'Arena Sospesa ci attende a sud-est. Drake non sa cosa lo aspetta!"],
      ], done);
    }

    function drakeTalk() {
      const s = S();
      if (s < 3) return say([["pi_drake", "La Marina Celeste non tollera insolenti nei porti imperiali."]], done);
      if (s === 3) {
        return say([
          ["pi_drake", "Morgana del Gabbiano d'Oro. E tu... lo straniero col numero {num}. Il vostro piccolo covo di ribelli chiude i battenti oggi stesso."],
          ["hero", "Ammiraglio Drake. Il cielo è di chi ha il coraggio di navigarlo, non di chi vorrebbe mettergli le catene."],
          ["pi_drake", "Parole arroganti da fuorilegge. Se credete che il vostro tiro sportivo valga più della disciplina imperiale, dimostratelo sull'Arena Sospesa. Se perdete, salirete a bordo delle mie navi-prigione."],
          ["pi_morgana", "E se vinciamo noi, Ammiraglio, ordinerai alla tua flotta di levare l'ancora e lasciarci la rotta aperta per il Grande Ciclone!"],
          ["pi_drake", "Accetto la scommessa. Ci vediamo sul campo sospeso."],
        ], () => {
          setStep(N, 4);
          note("Sfida ufficiale lanciata dall'Ammiraglio Drake sull'Arena Sospesa.");
          done();
        });
      }
      return say([
        ["pi_drake", "La mia Flotta di Ferro vi aspetta sull'Arena Sospesa. Preparatevi alla sconfitta."],
      ], done);
    }

    function startMatchPirate1() {
      X.playMatch({
        id: "pi_match_1",
        chap: "I Pirati Celesti · Il Derby delle Nuvole",
        us: "I Bucanieri del Vento",
        mate: "Morgana",
        min: 45,
        intro: "Partita mozzafiato sul campo sospeso sopra il vuoto! Il tuo Campione {n} sfida la Flotta di Ferro dell'Ammiraglio Drake!",
        team: (t, st) => ({
          name: "Flotta di Ferro di Drake",
          col: "#1e40af",
          style: "Schieramento Blindato & Bordata d'Acciaio",
          atk: t(st.atk * 1.05),
          def: t(st.def * 1.25),
          vel: t(st.vel * 0.95),
          specials: ["Barriera della Marina", "Bordata di Ferro"]
        }),
        done: (r) => {
          if (r.win) {
            setStep(N, 6);
            finishChapter(N, "trionfo_nembocroce");
            note("Trionfo epico sull'Arena Sospesa: la Flotta di Ferro è battuta!");
            const rewMsg = reward("pi_ch1_win", {
              coins: 450,
              cos: "pi_tricorno_corsaro"
            });
            say([
              ["voce", "GOOOOOL TRAVOLGENTE! Agganciandoti al vento col tuo tiro «{tiro}», la sfera fende le correnti come una saetta celeste e squarcia la porta sospesa nel vuoto!"],
              ["voce", "I corsari della taverna esplodono in un coro di acclamazioni mentre l'Ammiraglio Drake ordina il ripiegamento delle sue cannoniere!"],
              ["pi_drake", "Incredibile... Un tiro di tale potenza non si era mai visto nei registri dell'impero. Manterrò la parola: il passaggio è vostro."],
              ["pi_morgana", "(Ti dà una pacca sulla spalla ridendo a crepapelle) Benvenuto a bordo, {n}! Da oggi sei ufficialmente il Cannoniere Leggendario del Gabbiano d'Oro!"],
              ["voce", `CAPITOLO 1 CONCLUSO CON SUCCESSO! ${rewMsg.join(" · ")}`],
            ], () => {
              go("pi_porto", 19, 15);
            });
          } else {
            say([
              ["pi_drake", "La formazione della Marina non si piega alle vostre bravate. Riorganizzatevi e riprovate se ne avete il fegato!"],
            ], done);
          }
        }
      });
    }

    const obj = {
      "pi_porto:^": () => {
        if (S() < 1) {
          say([["voce", "La passerella di corda verso la taverna è spezzata e penzola nel vuoto delle nuvole. Parla prima con Kidd al molo per trovare una soluzione."]], done);
        } else {
          go("pi_taverna", 18, 22);
        }
      },
      "pi_porto:>": () => {
        go("pi_arena", 20, 25);
      },
      "pi_taverna:d": () => {
        go("pi_porto", 19, 4);
      },
      "pi_arena:d": () => {
        go("pi_porto", 33, 22);
      },
      "pi_porto:C": () => say([["voce", "Cannone navale ad aria compressa. Spara dardi arpionanti per ormeggiare i galeoni alle scogliere fluttuanti."]], done),
      "pi_porto:B": () => say([["voce", "Lanterna di prua alimentata da olio di balena celeste. La fiamma azzurra pulsa al ritmo delle brezze d'alta quota."]], done),
      "pi_porto:X": () => {
        say([["voce", "Un forziere dei corsari foderato di cuoio. All'interno trovi pergamene con le rotte dell'arcipelago e doppiette lucenti."]], done);
      },
      "pi_taverna:T": () => say([["voce", "La carta nautica dell'Arcipelago Sospeso. Al centro è disegnato il Grande Ciclone con la scritta: «Qui risiede l'Isola Fantasma»."]], done),
      "pi_taverna:K": () => say([["voce", "Un timone dorato smontato da una leggendaria ammiraglia corsara. Gira dolcemente con un ronzio armonico."]], done)
    };

    const talk = {
      pi_kidd: kiddTalk,
      pi_morgana: morganaTalk,
      pi_drake: drakeTalk,
      pi_anemona: () => say([["pi_anemona", "Il barometro sta salendo! I venti da ovest promettono burrasca e avventura per chi non ha paura di spiegare le vele solari."]], done)
    };

    return {
      n: N,
      title: "Il Porto delle Nuvole",
      sub: "Il risveglio del Gancio di Vento e il patto del Gabbiano d'Oro",
      start: "pi_porto",
      zones,
      talk,
      obj,
      goal,
      intro: () => [
        ["voce", "I PIRATI DELLA TEMPESTA CELESTE · CAPITOLO 1", "pi_porto_celeste"],
        ["voce", "Al di sopra delle nubi, dove l'aria è pura e il sole risplende eterno, fluttua l'Arcipelago Sospeso: un regno di isole galleggianti senza re né confini.", "pi_porto_celeste"],
        ["voce", "Sei sbarcato al Porto di Nembocroce con la maglia numero {num} e la fama del tuo tiro speciale «{tiro}». Ma l'aria è carica di elettricità: la Flotta di Ferro imperiale ha iniziato a dare la caccia a tutte le vele libere.", "pi_porto_celeste"],
        ["voce", "Al molo, un giovane inventore con occhialoni da aviatore ti osserva incuriosito mentre traffica con un congegno a molla pneumatica...", "pi_porto_celeste"]
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
        "pi_porto_celeste", "voce",
        "<b>I Pirati della Tempesta Celeste</b><br>Questa saga piratesca ad alta quota richiede il tuo Campione: nome, aspetto, numero e tiro speciale sono protagonisti assoluti.<br><br>Prima crea il tuo campione nel menu!",
        [
          { label: "Crea il tuo Campione", sub: "Nome, look e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
          { label: "◂ Torna alle Modalità", fn: leaveToModes }
        ],
        "Pirati Celesti"
      );
    }

    castHero();
    const c = activeChapter(), m = mem(), curDone = c && m.done[c.n];

    api.scene(
      "pi_porto_celeste", "voce",
      `<b>⚓ I Pirati della Tempesta Celeste</b><br>${esc(h.name)} · n. ${esc(h.num)} (Cannoniere del Gabbiano d'Oro)<br><span style="color:var(--dim)">«${esc(h.shotName || "Il Tiro del Tifone")}»</span><br><br><span style="color:#38bdf8">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}</span><br><span style="color:var(--dim)">${curDone ? "Capitolo 1 completato con successo! Il Gabbiano d'Oro veleggia verso le prossime isole." : esc(goalNow())}</span>`,
      [
        {
          label: curDone ? "Esplora Nembocroce" : c && !m.intro["ch" + c.n] ? `Inizia il Capitolo ${c.n}` : "Continua la Rotta",
          sub: c ? `Capitolo ${c.n} · ${c.title}` : "",
          cls: "hot",
          fn: continueStory
        },
        { label: "Log Pose & Diario di Bordo", sub: `Rotte ${m.routes.length} · Navigazione di ${h.name}`, fn: () => notebook(openMain, false) },
        { label: "Rotte dell'Arcipelago", sub: "Stato dei capitoli e delle isole sbloccate", fn: chaptersList },
        { label: "◂ Torna alle Modalità", fn: leaveToModes }
      ],
      "Pirati Celesti"
    );
  }

  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    const isNew = !m.intro["ch" + c.n];
    if (isNew) {
      m.intro["ch" + c.n] = 1; save();
      if (c.intro) {
        return say(c.intro(), () => {
          go(c.start || "pi_porto", 19, 21);
        });
      }
    }
    const tr = api.trRec();
    const curZ = (m.zone && ZONES[m.zone]) ? m.zone : (c.start || "pi_porto");
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
        rows.push(`<span style="color:var(--dim)">• Capitolo ${n} · Rotta inesplorata</span>`);
      }
    }
    api.scene(
      "pi_taverna_vento", "voce",
      `<b>Le Rotte dell'Arcipelago Sospeso</b><br>${rows.join("<br>")}<br><br><span style="color:var(--dim)">Le tue decisioni al timone e l'uso del Gancio di Vento guidano il destino della flotta pirata.</span>`,
      [
        { label: "Ricomincia la Rotta", sub: "Azzera progressi del diario (monete e oggetti restano salvati)", fn: resetConfirm },
        { label: "◂ Indietro", fn: openMain }
      ],
      "Pirati Celesti · Rotte"
    );
  }

  function resetConfirm() {
    api.scene(
      "pi_porto_celeste", "voce",
      "<b>Ricominciare la Saga dei Pirati Celesti?</b><br>I progressi del capitolo 1 e le rotte nel Log Pose verranno azzerati. Le doppiette e gli accessori sbloccati rimarranno nel tuo guardaroba.",
      [
        { label: "Sì, azzera e ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
        { label: "◂ Annulla", fn: chaptersList }
      ],
      "Pirati Celesti"
    );
  }

  // ------------------------------------------------------------------ Pulsante Esci e Avvio
  function setupExitButton() {
    const existing = document.getElementById("piExit");
    if (existing) return;
    const st = document.createElement("style");
    st.textContent = `
      #piExit {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 36px; padding: 6px 14px; border-radius: 10px;
        border: 1px solid rgba(56, 189, 248, 0.7); background: rgba(3, 105, 161, 0.88);
        color: #e0f2fe; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6); cursor: pointer;
      }
      #piExit.on { display: block; }
      #piExit:active { transform: translateY(1px); }
    `;
    document.head.appendChild(st);

    const btn = document.createElement("button");
    btn.id = "piExit"; btn.type = "button";
    btn.textContent = "✕ Esci dai Pirati Celesti";
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
  window.__piratiStory = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "⚓ I Pirati della Tempesta Celeste",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Gancio di Vento e galeoni solari"}`
          : "Crea prima il tuo campione · Saga pirata ad alta quota con Gancio di Vento"
      };
    },
    info() {
      const m = mem();
      return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), routes: m.routes.length };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
