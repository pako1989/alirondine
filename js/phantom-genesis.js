// ============================================================================
// PHANTOM GENESIS · IL REATTORE DELLE MASCHERE
// Saga Cyber-Goth / JRPG per il Tuo Campione
// Ispirata a Persona 5 (Ladri del Cuore), Neon Genesis Evangelion (AT-Field & Sincronia)
// e Final Fantasy VII (Bassifondi del Settore 5, Reattore Mako & Sistema Materie)
// Motore 2D Camminabile HD con Scanner Sinaptico, Incastonatura Materie,
// Partite Ibride (Battaglia Tattica AT-Field / Action Soccer 2D HD / Cyber-Cage)
// ============================================================================
(function () {
  "use strict";
  if (window.__phantomGenesisLoaded) return;
  window.__phantomGenesisLoaded = true;

  const KEY = "ali-di-rondine.phantom-genesis";
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
  const rnd = (tx, ty, k) => hash(tx * 89 + ty * 157 + k * 31) / 4294967296;

  // ------------------------------------------------------------------ Web Audio Synthesizer Esclusivo
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  // Allarme Emergenza NERV / Evangelion (due toni esagonali discendenti)
  function sfxEvaAlarm() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [0, 0.28].forEach((offset) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, now + offset);
        osc.frequency.exponentialRampToValueAtTime(440, now + offset + 0.24);
        g.gain.setValueAtTime(0.25, now + offset);
        g.gain.linearRampToValueAtTime(0.01, now + offset + 0.26);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + offset); osc.stop(now + offset + 0.26);
      });
    } catch (e) {}
  }

  // Risveglio Persona / Infrangimento della Maschera (vetro cristallino frantumato)
  function sfxGlassAwakening() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [1046.5, 1318.5, 1567.9, 2093.0, 2637.0].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.02);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.3, now + i * 0.02 + 0.4);
        g.gain.setValueAtTime(0.3 / (i + 1), now + i * 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.02 + 0.5);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.02); osc.stop(now + i * 0.02 + 0.5);
      });
    } catch (e) {}
  }

  // Risonanza Mako / Flusso Vitale (sub-basso etereo con accordo armonico verde)
  function sfxMakoResonance() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.6);
      g.gain.setValueAtTime(0.4, now);
      g.gain.linearRampToValueAtTime(0.01, now + 0.8);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.8);

      [392.0, 493.88, 587.33, 783.99].forEach((freq, idx) => {
        const osc2 = ctx.createOscillator(), g2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq, now + 0.1);
        g2.gain.setValueAtTime(0.01, now + 0.1);
        g2.gain.linearRampToValueAtTime(0.12, now + 0.3);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc2.connect(g2); g2.connect(ctx.destination);
        osc2.start(now + 0.1); osc2.stop(now + 1.2);
      });
    } catch (e) {}
  }

  // All-Out Attack Break! (Colpo ritmico di basso acustico e slap Persona)
  function sfxAllOutBreak() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
      g.gain.setValueAtTime(0.7, now);
      g.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.2);

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const o = ctx.createOscillator(), gg = ctx.createGain();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(freq, now + 0.08 + idx * 0.04);
        gg.gain.setValueAtTime(0.2, now + 0.08 + idx * 0.04);
        gg.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.04);
        o.connect(gg); gg.connect(ctx.destination);
        o.start(now + 0.08 + idx * 0.04); o.stop(now + 0.5);
      });
    } catch (e) {}
  }

  // Equipaggiamento Materia / Click Energetico
  function sfxMateriaSocket() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [880, 1320, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        g.gain.setValueAtTime(0.2, now + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.05 + 0.25);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.05); osc.stop(now + i * 0.05 + 0.25);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Scanner Sinaptico (Mako Vision Overlay)
  let scannerActive = false;
  let scannerAlpha = 0;

  function updateScannerBtnUI() {
    const bScan = document.getElementById("bScan");
    if (bScan) {
      bScan.textContent = scannerActive ? "👁️ Scan: ON" : "👁️ Scan";
      bScan.style.background = scannerActive ? "linear-gradient(180deg, #064e3b 0%, #022c22 100%)" : "";
      bScan.style.borderColor = scannerActive ? "#10b981" : "";
      bScan.style.color = scannerActive ? "#34d399" : "";
      bScan.style.boxShadow = scannerActive ? "0 0 10px rgba(16,185,129,0.7)" : "";
      bScan.setAttribute("title", scannerActive ? "Scanner Sinaptico ATTIVO (Clicca per spegnere)" : "Attiva Scanner Sinaptico (Mako Vision)");
    }
  }

  function ensurePadControls() {
    const padacts = document.querySelector(".padacts");
    if (!padacts) return;
    let bScan = document.getElementById("bScan");
    if (!bScan) {
      bScan = document.createElement("button");
      bScan.type = "button";
      bScan.id = "bScan";
      bScan.className = "pad";
      bScan.textContent = "👁️ Scan";
      bScan.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleScanner();
      };
      const bMenu = document.getElementById("bMenu");
      if (bMenu) padacts.insertBefore(bScan, bMenu);
      else padacts.appendChild(bScan);
    }
    updateScannerBtnUI();
  }

  function toggleScanner() {
    scannerActive = !scannerActive;
    sfxMakoResonance();
    updateScannerBtnUI();
    const curZid = zoneRec() ? api.trZone() : "";
    const target = getCurrentScannerTarget(curZid);
    if (scannerActive) {
      if (api && api.trToast) api.trToast("👁️ Scanner Sinaptico ATTIVO: Segui i segnali luminosi!");
      const textDiv = document.getElementById("text");
      if (textDiv) {
        textDiv.innerHTML = `<div style="border-left:3px solid #10b981; padding-left:8px; line-height:1.4;">
          <b style="color:#34d399;">👁️ SCANNER SINAPTICO: ATTIVO (Mako Vision)</b><br>
          🎯 <b>Obiettivo Rilevato:</b> ${target ? target.hint : "Analisi frequenze in corso..."}<br>
          <span style="color:var(--dim); font-size:12px;">Segui il mirino verde e la scia energetica tratteggiata. Avvicinati all'oggetto o alla persona e premi <b>Azione</b> per scansionare ed estrarre dati!</span>
        </div>`;
      }
    } else {
      if (api && api.trToast) api.trToast("👁️ Scanner Sinaptico DISATTIVATO");
      if (api && api.trHint) api.trHint();
    }
  }

  function getCurrentScannerTarget(zid) {
    const c = activeChapter();
    if (!c) return null;
    const st = stepOf(c.n);
    if (!zid && api) zid = api.trZone();
    if (zid === "pg_bassifondi") {
      if (st === 0) return { tx: 6, ty: 7, label: "Kael Buster", hint: "Parla con Kael Buster al barile in fiamme", color: "#f97316" };
      if (st === 1) return { tx: 12, ty: 4, label: "Dott.ssa Maya", hint: "Parla con la Dott.ssa Maya a nord per attivare il Synchro-Nav", color: "#38bdf8" };
      if (st === 2) return { tx: 20, ty: 3, label: "Materia Saetta", hint: "Segnale Mako a est (X:20, Y:3)! Raggiungi il canale ed esaminala", color: "#10b981" };
      if (st === 3) return { tx: 18, ty: 8, label: "Rin la Strillona", hint: "Porta la Materia Saetta a Rin per incastonarla", color: "#eab308" };
      return { tx: 23, ty: 8, label: "Cancello Shin-Nerv", hint: "Pattuglia Shin-Nerv al cancello! Parla con Kael o vai al cancello", color: "#ef4444" };
    }
    if (zid === "pg_reattore") {
      if (st === 0) return { tx: 6, ty: 7, label: "Dott.ssa Maya", hint: "Consulta Maya all'ingresso del reattore", color: "#38bdf8" };
      if (st === 1) return { tx: 12, ty: 11, label: "Terminali MAGI", hint: "Interagisci con i terminali MAGI per il bypass", color: "#ea580c" };
      if (st === 2) return { tx: 10, ty: 4, label: "Vasca LCL", hint: "Preleva la Materia Barriera dalla vasca criogenica", color: "#10b981" };
      return { tx: 23, ty: 8, label: "Apostolo Sachiel-X", hint: "Infrangi l'AT-Field di Sachiel-X davanti al portone!", color: "#ef4444" };
    }
    if (zid === "pg_arena_palazzo") {
      return { tx: 12, ty: 5, label: "Kurogane (Ala Nera)", hint: "Raggiungi il Trono d'Ossidiana per il duello finale!", color: "#eab308" };
    }
    return null;
  }

  function drawScannerOverlay(g, W, H, cx, cy, zid) {
    if (scannerActive && scannerAlpha < 0.45) scannerAlpha = Math.min(0.45, scannerAlpha + 0.05);
    if (!scannerActive && scannerAlpha > 0) scannerAlpha = Math.max(0, scannerAlpha - 0.06);
    if (scannerAlpha <= 0) return;

    g.save();
    // 1. Tinta Mako / ciano cibernetico
    g.fillStyle = `rgba(16, 185, 129, ${scannerAlpha * 0.32})`;
    g.fillRect(0, 0, W, H);

    // 2. Linea orizzontale di scansione
    const scanY = (Date.now() * 0.09) % H;
    g.strokeStyle = `rgba(52, 211, 153, ${scannerAlpha * 0.75})`;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(0, scanY);
    g.lineTo(W, scanY);
    g.stroke();

    const target = getCurrentScannerTarget(zid);
    let distTiles = 0;
    let compass = "";
    if (target && api) {
      const tr = api.trRec();
      const pos = tr && tr.pos && tr.pos[zid];
      if (pos) {
        const px = pos[0], py = pos[1];
        const ptx = px / TS, pty = py / TS;
        const dx = target.tx - ptx, dy = target.ty - pty;
        distTiles = Math.max(1, Math.round(Math.hypot(dx, dy)));
        if (Math.abs(dx) > Math.abs(dy)) compass = dx > 0 ? "Est ▶" : "◀ Ovest";
        else compass = dy > 0 ? "Sud ▼" : "▲ Nord";

        // Scia energetica Mako tratteggiata tra giocatore e bersaglio
        if (cx !== undefined && cy !== undefined) {
          const psx = px - cx;
          const psy = py - cy;
          const tsx = target.tx * TS - cx + 8;
          const tsy = target.ty * TS - cy + 8;
          g.save();
          g.setLineDash([4, 4]);
          g.lineDashOffset = -(Date.now() * 0.02) % 8;
          g.strokeStyle = "rgba(52, 211, 153, 0.45)";
          g.lineWidth = 1.5;
          g.beginPath();
          g.moveTo(psx, psy);
          g.lineTo(tsx, tsy);
          g.stroke();
          g.restore();
        }
      }
    }

    // 3. Scanner HUD Banner in alto
    g.fillStyle = "rgba(2, 6, 23, 0.92)";
    g.fillRect(4, 3, W - 8, 24);
    g.strokeStyle = distTiles > 0 && distTiles <= 2 ? "#fde047" : "#10b981";
    g.lineWidth = 1;
    g.strokeRect(4, 3, W - 8, 24);

    g.font = "bold 7px monospace";
    g.fillStyle = "#34d399";
    g.textAlign = "left";
    g.fillText(`👁️ SCANNER: ATTIVO [${distTiles > 0 ? distTiles + "m " + compass : "In scansione"}] · Clicca Scan per spegnere`, 8, 12);
    g.fillStyle = distTiles > 0 && distTiles <= 2 ? "#fde047" : "#f8fafc";
    g.fillText(distTiles > 0 && distTiles <= 2 ? `🎯 BERSAGLIO RAGGIUNTO! Premi AZIONE su ${target.label}` : `🎯 TARGET: ${target ? target.hint : "Nessuna anomalia energetica rilevata"}`, 8, 22);

    // 4. Mirino olografico sul bersaglio
    if (target && cx !== undefined && cy !== undefined) {
      const sx = target.tx * TS - cx + 8;
      const sy = target.ty * TS - cy + 8;
      const time = Date.now() * 0.005;

      if (sx >= -15 && sx <= W + 15 && sy >= -15 && sy <= H + 15) {
        const r = 12 + Math.sin(time * 3) * 3;
        g.strokeStyle = target.color || "#10b981";
        g.lineWidth = 1.5;
        g.beginPath();
        g.arc(sx, sy, r, 0, Math.PI * 2);
        g.stroke();

        [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((a) => {
          const cos = Math.cos(a + time), sin = Math.sin(a + time);
          g.beginPath();
          g.moveTo(sx + cos * (r - 2), sy + sin * (r - 2));
          g.lineTo(sx + cos * (r + 4), sy + sin * (r + 4));
          g.stroke();
        });

        g.fillStyle = "rgba(15, 23, 42, 0.88)";
        g.fillRect(sx - 38, sy - 23, 76, 10);
        g.strokeStyle = target.color || "#10b981";
        g.strokeRect(sx - 38, sy - 23, 76, 10);
        g.font = "bold 6px sans-serif";
        g.fillStyle = target.color || "#34d399";
        g.textAlign = "center";
        g.fillText(`⚡ ${target.label}`, sx, sy - 15);
      } else {
        const angle = Math.atan2(sy - H / 2, sx - W / 2);
        const arrowX = Math.max(16, Math.min(W - 16, W / 2 + Math.cos(angle) * (W / 2 - 20)));
        const arrowY = Math.max(34, Math.min(H - 16, H / 2 + Math.sin(angle) * (H / 2 - 24)));
        g.save();
        g.translate(arrowX, arrowY);
        g.rotate(angle);
        g.fillStyle = target.color || "#10b981";
        g.beginPath();
        g.moveTo(8, 0); g.lineTo(-6, -5); g.lineTo(-6, 5); g.closePath();
        g.fill();
        g.strokeStyle = "#ffffff"; g.stroke();
        g.restore();
        g.font = "bold 6px monospace";
        g.fillStyle = "#ffffff";
        g.textAlign = "center";
        g.fillText(`${distTiles}m`, arrowX, Math.min(H - 6, arrowY + 12));
      }
    }

    g.restore();
  }

  // ------------------------------------------------------------------ Salvataggio Normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  function norm(o) {
    o = obj(o);
    const m = {
      v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {},
      zone: "", materias: [], log: [], synchro: clampI(o.synchro, 0, 100, 100),
      intro: {}, wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0)
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
    m.materias = [...new Set(arr(o.materias).filter((x) => typeof x === "string"))].slice(0, 30);
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

  const addMateria = (id, name, desc, color) => {
    const m = mem();
    const entry = `${id}:::${name}:::${desc}:::${color || "#10b981"}`;
    if (!m.materias.some((x) => x.startsWith(id + ":::"))) {
      m.materias.push(entry); save();
      sfxMateriaSocket();
      if (api && api.trToast) api.trToast(`🔮 Nuova Materia: ${name}!`);
      return true;
    }
    return false;
  };

  const once = (key, fn) => {
    const m = mem();
    if (m.rew[key]) return false;
    m.rew[key] = 1; save(); fn(); return true;
  };

  // ------------------------------------------------------------------ Il Tuo Campione
  const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
  const SHOT = {
    saetta: "una lama cinquantica scarlatta che fende l'AT-Field con sibilo ultrasonico",
    serpentina: "un fendente di plasma verde Mako che elude i sensori ottici dei difensori",
    parabola: "un proiettile ad arco fotonico che scavalca i bastioni corazzati della Shin-Nerv",
    martello: "un'onda d'urto d'acciaio titanico che distrugge la barriera con deflagrazione sismica",
    traversa: "un fulmine a spirale LCL che colpisce l'incrocio dei pali frantumando i sensori",
    saudade: "un'illusione quantica che attraversa i pali come un fantasma tra i desideri",
    muro: "un monolite esagonale di pura energia psichica che respinge ogni contropiede"
  };

  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "COLPO DEL RISVEGLIO", shot: "saetta" };
    return String(s)
      .replace(/\{n\}/g, () => h.name)
      .replace(/\{num\}/g, () => h.num)
      .replace(/\{tiro\}/g, () => h.shotName || "COLPO DEL RISVEGLIO")
      .replace(/\{tipo\}/g, () => SHOT[h.shot] || "un fendente cinquantico perfetto");
  }

  function castHero() {
    const h = hero(), C = api && api.CAST;
    if (!h || !C) return;
    C.hero = {
      name: h.name, tag: "ladro-pilota", hair: h.hair, style: h.style, skin: h.skin, eye: "#10b981",
      bg: ["#020617", "#059669"], shirt: "#0f172a"
    };
  }

  const coinsGive = (n) => (api && typeof api.bGiveCoins === "function" ? api.bGiveCoins(n) : 0);
  const bal = () => (api && typeof api.bBal === "function" ? api.bBal() : 0);

  // ------------------------------------------------------------------ Grafica Pixel Art Procedurale (320x200)
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

  // Sfondo: I Bassifondi del Settore Zero (Baracche, neon pioggia, tubature Mako)
  function bgBassifondi(g, W, H, f) {
    // Cielo notturno cupo coperto da piastre d'acciaio della città alta
    grad(g, 0, 0, W, H, ["#020617", "#090d16", "#04151b"]);
    // Immenso pilone d'acciaio della piastra superiore
    R(g, W / 2 - 25, 0, 50, 95, "#0f172a");
    R(g, W / 2 - 27, 0, 4, 95, "#1e293b");
    R(g, W / 2 + 23, 0, 4, 95, "#1e293b");
    // Tralicci a croce
    for (let y = 10; y < 90; y += 20) {
      g.strokeStyle = "#1e293b"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(W / 2 - 25, y); g.lineTo(W / 2 + 25, y + 20); g.stroke();
      g.beginPath(); g.moveTo(W / 2 + 25, y); g.lineTo(W / 2 - 25, y + 20); g.stroke();
    }

    // Insegne al neon giapponesi (Persona 5 style)
    const neonCols = ["#ef4444", "#06b6d4", "#10b981", "#eab308"];
    [25, 75, 230, 280].forEach((nx, ni) => {
      R(g, nx, 40, 16, 45, "#090d16");
      const col = neonCols[ni % neonCols.length];
      const fl = Math.sin(f * 0.15 + ni * 2) > -0.8;
      if (fl) {
        glow(g, nx + 8, 62, 22, ni === 0 ? "239,68,68" : "16,185,129", 0.45);
        R(g, nx + 4, 45, 8, 35, col);
        R(g, nx + 6, 48, 4, 4, "#ffffff");
        R(g, nx + 6, 58, 4, 4, "#ffffff");
        R(g, nx + 6, 68, 4, 4, "#ffffff");
      }
    });

    // Tubatura gigante Mako che attraversa la mappa stillando liquido verde
    R(g, 0, 115, W, 14, "#0f172a");
    R(g, 0, 117, W, 3, "#1e293b");
    R(g, 0, 126, W, 3, "#1e293b");
    // Fessura con perdita di liquido Mako fluorescente
    const dripY = 129 + ((f * 0.8) % 35);
    glow(g, 110, 122, 18, "16,185,129", 0.6);
    R(g, 108, 120, 6, 8, "#34d399");
    R(g, 110, dripY, 2, 4, "#6ee7b7");

    // Asfalto bagnato con pozzanghere riflettenti
    R(g, 0, 150, W, 50, "#020617");
    for (let x = 15; x < W; x += 55) {
      const fl2 = Math.sin(f * 0.08 + x) * 2;
      g.fillStyle = "rgba(16, 185, 129, 0.25)";
      g.beginPath(); g.ellipse(x + 20, 172 + fl2, 22, 5, 0, 0, Math.PI * 2); g.fill();
    }

    // Barilotto d'acciaio in fiamme (fiamme verde-blu Mako)
    R(g, 45, 160, 14, 20, "#1f2937");
    const flameH = 6 + Math.sin(f * 0.25) * 3;
    glow(g, 52, 156, 20, "16,185,129", 0.55);
    R(g, 47, 156 - flameH, 10, flameH, "#34d399");
    R(g, 49, 158 - flameH, 6, flameH * 0.7, "#a7f3d0");

    // Pioggia sottile animata
    g.strokeStyle = "rgba(148, 163, 184, 0.2)"; g.lineWidth = 1;
    for (let i = 0; i < 35; i++) {
      const rx = (i * 47 + f * 4) % W;
      const ry = (i * 29 + f * 8) % H;
      g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 2, ry + 7); g.stroke();
    }
  }

  // Sfondo: Il Nucleo del Reattore Shin-Nerv (Cattedrale Biomeccanica, Vasche LCL, Monitor MAGI)
  function bgReattore(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#030712", "#0c151c", "#022c22"]);

    // Colonne biomeccaniche stile costole ciclopiche (Evangelion Geofront)
    for (let i = 0; i < 5; i++) {
      const cx = 15 + i * 68;
      g.strokeStyle = "#1e293b"; g.lineWidth = 5;
      g.beginPath();
      g.arc(cx + 25, 60, 36, Math.PI * 0.8, Math.PI * 0.2, true);
      g.stroke();
      R(g, cx, 65, 8, 120, "#0f172a");
      R(g, cx + 42, 65, 8, 120, "#0f172a");
    }

    // Vasca cilindrica centrale di liquido LCL arancione con silhouette
    R(g, W / 2 - 35, 30, 70, 95, "#0b1329");
    g.fillStyle = "rgba(249, 115, 22, 0.45)"; // Arancione LCL
    g.fillRect(W / 2 - 32, 34, 64, 87);
    glow(g, W / 2, 75, 45, "249,115,22", 0.5 + 0.1 * Math.sin(f * 0.1));
    // Bolle che salgono
    for (let b = 0; b < 5; b++) {
      const by = 115 - ((f * 0.7 + b * 20) % 75);
      const bx = W / 2 - 20 + (b * 11) % 40;
      R(g, bx, by, 3, 3, "#fdba74");
    }
    // Silhouette sospesa all'interno
    R(g, W / 2 - 4, 55, 8, 22, "#431407");
    g.beginPath(); g.arc(W / 2, 50, 5, 0, Math.PI * 2); g.fill();

    // Tre Monitor MAGI esagonali (Melchior, Balthasar, Casper)
    const magiNames = ["MELCHIOR", "BALTHASAR", "CASPER"];
    [-55, 0, 55].forEach((offset, idx) => {
      const mx = W / 2 + offset;
      const my = 145;
      R(g, mx - 22, my - 12, 44, 24, "#7c2d12");
      R(g, mx - 20, my - 10, 40, 20, "#ea580c");
      g.font = "bold 6px monospace"; g.textAlign = "center"; g.fillStyle = "#ffffff";
      g.fillText(magiNames[idx], mx, my - 1);
      g.fillText("SYNC 100%", mx, my + 7);
    });

    // Passerella metallica e corrimano
    R(g, 0, 168, W, 32, "#090d16");
    R(g, 0, 168, W, 3, "#334155");
    for (let x = 0; x < W; x += 18) {
      R(g, x, 171, 3, 29, "#1e293b");
    }
  }

  // Sfondo: L'Arena dell'Apostolo / Palazzo delle Maschere (Luna di Sangue, Vetrate, Croci LCL)
  function bgPalazzoArena(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#180208", "#2a0815", "#0a0a0f"]);

    // Enorme Luna di Sangue scarlatta (Persona / Evangelion)
    glow(g, W / 2, 45, 55, "239,68,68", 0.55);
    g.fillStyle = "#dc2626";
    g.beginPath(); g.arc(W / 2, 45, 32, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#991b1b";
    g.beginPath(); g.arc(W / 2 - 7, 40, 9, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(W / 2 + 10, 52, 13, 0, Math.PI * 2); g.fill();

    // Vetrate gotiche con maschere dorate ai lati
    [30, 80, 240, 290].forEach((vx, vi) => {
      g.strokeStyle = "#450a0a"; g.lineWidth = 3;
      g.beginPath(); g.arc(vx, 55, 18, Math.PI, 0); g.stroke();
      R(g, vx - 18, 55, 36, 65, "#1c1917");
      // Maschera dorata (Persona style)
      R(g, vx - 8, 70, 16, 9, "#eab308");
      R(g, vx - 5, 73, 3, 3, "#000000");
      R(g, vx + 2, 73, 3, 3, "#000000");
    });

    // Il Campo d'Ossidiana con tracciato esagonale luminoso
    R(g, 15, 95, W - 30, 95, "#030712");
    g.strokeStyle = "rgba(239, 68, 68, 0.85)";
    g.lineWidth = 1.5;
    g.strokeRect(25, 105, W - 50, 80);

    // Cerchio di centrocampo con simbolo dell'occhio/croce
    g.beginPath(); g.arc(W / 2, 145, 24, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(W / 2, 105); g.lineTo(W / 2, 185); g.stroke();

    // Porte a croce di luce bianca (Evangelion cross explosion)
    [20, W - 20].forEach((gx) => {
      glow(g, gx, 145, 22, "255,255,255", 0.5);
      R(g, gx - 2, 125, 4, 40, "#ffffff");
      R(g, gx - 10, 135, 20, 4, "#ffffff");
    });
  }

  const BGS = {
    pg_bassifondi: bgBassifondi,
    pg_reattore: bgReattore,
    pg_palazzo_arena: bgPalazzoArena
  };

  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) {
      safe(() => BGS[kind](g, W || 320, H || 200, frame || 0));
      if (scannerActive || scannerAlpha > 0) {
        drawScannerOverlay(g, W || 320, H || 200);
      }
      return true;
    }
    const res = typeof prevBg === "function" ? prevBg(kind, g, W, H, frame) : false;
    if (scannerActive || scannerAlpha > 0) {
      drawScannerOverlay(g, W || 320, H || 200);
    }
    return res;
  };

  // ------------------------------------------------------------------ Tilemap & Costruzione Zone
  let GP = null;
  const ZX = { map: null, under: null, id: "" };
  const frNow = () => (api && typeof api.fr === "number" ? api.fr : Math.floor(Date.now() / 50));
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  const isFloor = (ch) => ",.c=spqm;g".includes(ch);

  function P(x, y, w, h, c) { GP.fillStyle = c; GP.fillRect(x, y, w, h); }

  function floorPaint(ch, sx, sy, tx, ty) {
    if (ch === "q" || ch === "m") {
      // Lastre d'acciaio industriale scuro rivettate
      P(sx, sy, 16, 16, "#090d16");
      P(sx, sy, 16, 1, "#1e293b");
      P(sx, sy, 1, 16, "#1e293b");
      P(sx + 2, sy + 2, 1, 1, "#475569");
      P(sx + 13, sy + 13, 1, 1, "#475569");
      return;
    }
    if (ch === "=") {
      // Grata metallica con riflessi Mako sottostanti
      P(sx, sy, 16, 16, "#022c22");
      for (let i = 0; i < 16; i += 4) {
        P(sx + i, sy, 1, 16, "#10b981");
        P(sx, sy + i, 16, 1, "#047857");
      }
      return;
    }
    if (ch === "c") {
      // Pavimento cerimoniale del Palazzo delle Maschere
      P(sx, sy, 16, 16, "#1c1917");
      P(sx + 4, sy + 4, 8, 8, "#450a0a");
      P(sx + 7, sy + 7, 2, 2, "#eab308");
      return;
    }
    // Asfalto bagnato con crepe nei bassifondi
    P(sx, sy, 16, 16, "#020617");
    if ((hash(tx * 31 + ty * 47) % 5) === 0) {
      P(sx + 3, sy + 4, 9, 1, "#1e293b");
      P(sx + 7, sy + 5, 1, 6, "#1e293b");
    }
  }

  const SOLID = "#BXWMOKHJd^<>";
  const PAINT = {
    "#": (sx, sy) => {
      // Muro in piastre corazzate Shin-Nerv
      P(sx, sy, 16, 16, "#0f172a");
      P(sx + 1, sy + 1, 14, 14, "#1e293b");
      P(sx + 4, sy + 4, 8, 8, "#090d16");
      P(sx + 7, sy + 7, 2, 2, "#34d399"); // LED verde Mako
    },
    B: (sx, sy) => {
      // Barile industriale con fiamme verdi Mako
      P(sx + 2, sy + 3, 12, 13, "#1f2937");
      P(sx + 2, sy + 3, 12, 2, "#374151");
      P(sx + 5, sy, 6, 4, "#10b981");
      P(sx + 7, sy - 1, 2, 3, "#a7f3d0");
    },
    X: (sx, sy) => {
      // Terminale MAGI con schermo arancione esagonale
      P(sx + 2, sy + 2, 12, 14, "#451a03");
      P(sx + 3, sy + 4, 10, 8, "#ea580c");
      P(sx + 5, sy + 6, 6, 3, "#ffffff");
      P(sx + 4, sy + 14, 8, 2, "#78350f");
    },
    M: (sx, sy) => {
      // Nido di Materie luminescenti incastonate
      floorPaint(undAt(sx, sy), sx, sy);
      P(sx + 3, sy + 3, 10, 10, "#064e3b");
      P(sx + 6, sy + 6, 4, 4, "#10b981");
      P(sx + 7, sy + 7, 2, 2, "#d1fae5");
    },
    K: (sx, sy) => {
      // Cassa di rifornimenti ribelli Buster
      P(sx + 2, sy + 4, 12, 11, "#3f3f46");
      P(sx + 2, sy + 4, 12, 2, "#71717a");
      P(sx + 6, sy + 8, 4, 4, "#ef4444"); // Logo Rondine Rossa
    },
    H: (sx, sy) => {
      // Vasca criogenica LCL con capsula in vetro
      P(sx + 1, sy, 14, 16, "#0f172a");
      P(sx + 3, sy + 2, 10, 12, "#ea580c");
      P(sx + 6, sy + 5, 4, 6, "#ffedd5");
    },
    ">": (sx, sy) => { P(sx + 1, sy + 3, 14, 10, "#059669"); P(sx + 9, sy + 6, 4, 4, "#ffffff"); },
    "<": (sx, sy) => { P(sx + 1, sy + 3, 14, 10, "#059669"); P(sx + 3, sy + 6, 4, 4, "#ffffff"); },
    "^": (sx, sy) => { P(sx + 3, sy + 1, 10, 14, "#059669"); P(sx + 6, sy + 3, 4, 4, "#ffffff"); },
    "d": (sx, sy) => { P(sx + 3, sy + 1, 10, 14, "#059669"); P(sx + 6, sy + 9, 4, 4, "#ffffff"); }
  };

  function drawTile(ch, sx, sy, tx, ty) {
    GP = GP || document.getElementById("cv").getContext("2d");
    if (isFloor(ch)) { floorPaint(ch, sx, sy, tx, ty); return true; }
    const fn = PAINT[ch];
    if (!fn) return false;
    fn(sx, sy, tx, ty);
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

  // ------------------------------------------------------------------ Zone & Motore Camminabile TRZ
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
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "pg_bassifondi";

  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch] || activeChapter();
    castHero();
    const list = zr.spec.npcs ? zr.spec.npcs(stepOf(c.n)) : [];
    const hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(stepOf(c.n)) : zr.spec.hints || {});
    zr.Z.npcs = list.filter((n) => !!(api.CAST && api.CAST[n.id]));

    const gl = goalNow();
    [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => {
      if (k) hints[k] = (gl ? "Obiettivo: " + gl + " · " : "") + (hints[k] || "");
    });
    zr.Z.hints = hints;
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
      w: spec.w, h: spec.h, start: spec.start, theme: "torino",
      bus: "cancello", busLabel: "Esci dal Settore Zero",
      item: spec.item || ["Sfera Mako", "Sfere"], items: spec.items || [],
      bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID,
      act: Object.assign({
        M: "⚡ Raccogli Materia",
        X: "🖥️ Terminale MAGI",
        B: "🔥 Barile Ribelle",
        ">": "🚪 Cancello",
        "<": "🚪 Torna indietro",
        "W": "👑 Trono",
        "H": "🧪 Vasca LCL"
      }, spec.actLabels || {}),
      intro: [],
      me: () => {
        const c = api.CAST.hero || api.CAST.leo;
        return Object.assign({}, c, { shirt: "#0f172a", eye: "#10b981" });
      },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d");
        g.save(); g.globalCompositeOperation = "lighter";
        glow(g, x, y, 12, "16,185,129", 0.6 + 0.2 * Math.sin(frNow() / 10 + i));
        g.restore();
        g.fillStyle = "#10b981";
        g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#d1fae5";
        g.beginPath(); g.arc(x - 1, y - 1, 1.5, 0, Math.PI * 2); g.fill();
      }
    };

    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: Synchro-Nav ed Esci." });

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
    Z.decor = function (cx, cy) {
      if (spec.decor) spec.decor(cx, cy, dd(cx, cy));
      if (api) {
        ensurePadControls();
        const tr = api.trRec();
        const pos = tr && tr.pos && tr.pos[zid];
        if (pos) {
          const px = pos[0], py = pos[1];
          const c = activeChapter();
          if (c && c.n === 1 && stepOf(1) === 2 && zid === "pg_bassifondi") {
            const dist = Math.hypot(px - (20 * TS + 8), py - (3 * TS + 8));
            if (dist < 28) {
              const b = document.getElementById("bAct");
              if (b) { b.textContent = "⚡ Estrai Materia Saetta"; b.disabled = false; }
            }
          }
        }
      }
    };

    Z.top = function (cx, cy) {
      if (spec.top) spec.top(cx, cy, dd(cx, cy));
      const cv = document.getElementById("cv");
      if (cv) drawScannerOverlay(cv.getContext("2d"), cv.width, cv.height, cx, cy, zid);
    };

    Z.onObj = function (ch, tx, ty) {
      const posKey = tx + "," + ty;
      // 1. Prova prima il chapter obj se presente
      const c = activeChapter();
      if (c && c.obj) {
        const fn = c.obj[zid + ":" + ch + ":" + posKey] || c.obj[zid + ":" + posKey] || c.obj[zid + ":" + ch] || c.obj[posKey] || c.obj[ch];
        if (typeof fn === "function") { fn({ ch, tx, ty, zid }); return true; }
      }
      // 2. Prova spec.act con coordinate
      if (spec.act && typeof spec.act[posKey] === "function") {
        spec.act[posKey]({ ch, tx, ty, zid });
        return true;
      }
      // 3. Prova spec.act con carattere del tile
      if (spec.act && typeof spec.act[ch] === "function") {
        spec.act[ch]({ ch, tx, ty, zid });
        return true;
      }
      // 4. Default contestualizzati e sicuri per Phantom Genesis (MAI ricadere nei default del Borgo marino):
      if (ch === "B") {
        if (scannerActive) {
          sfxMakoResonance();
          say([
            ["voce", "👁️ [ANALISI SCANNER · BARILE TERMICO]\nFrequenza termica: 340°C. La cellula ribelle di Kael utilizza questo fuoco schermato per mascherare la firma calorica contro i droni aerei Shin-Nerv.", "pg_bassifondi"],
            ["pg_kael", "«Lo Scanner funziona a meraviglia! Questo barile ci tiene caldi e invisibili ai radar. Sfruttalo per scaldarti tra una missione e l'altra.»"]
          ], done);
        } else {
          say([["pg_kael", "«Il fuoco di questo barile tiene lontana l'umidità del reattore. Fatti forza, ragazzo. Con lo Scanner Sinaptico acceso potrai persino studiare la schermatura termica!»"]], done);
        }
        return true;
      }
      if (ch === "M") {
        const st = stepOf(c ? c.n : 1);
        if (st === 2) {
          say([
            ["voce", "👁️ [ANOMALIA ENERGETICA AGGANCIATA]\nLe frequenze dello Scanner Sinaptico risuonano con la grata metallica. Tra i tralicci metallici bagnati dalla pioggia, un cristallo azzurro pulsa a ritmo frenetico!", "pg_bassifondi"],
            ["hero", "«Ecco la Materia Saetta! L'energia Mako è talmente densa che fa rizzare i capelli.»"]
          ], () => {
            setStep(1, 3);
            sfxGlassAwakening();
            if (api && api.trToast) api.trToast("⚡ Materia Saetta Recuperata!");
            note("Ho recuperato la Materia Saetta dal condotto Mako grazie allo Scanner Sinaptico. Devo portarla a Rin la Strillona a est per montarla sugli scarpini.");
            done();
          });
        } else if (st < 2) {
          say([["voce", "La conduttura Mako emette scintille violente a 10.000 Volt. Parla prima con Kael e con la Dott.ssa Maya a nord per attivare il Synchro-Nav ed estrarre la Materia in sicurezza!", "pg_bassifondi"]], done);
        } else {
          say([["voce", "La conduttura Mako è ora silente e stabile. La Materia Saetta è già incastonata nei tuoi scarpini!", "pg_bassifondi"]], done);
        }
        return true;
      }
      if (ch === "X") {
        if (scannerActive) {
          sfxMakoResonance();
          const m = mem();
          say([
            ["voce", `👁️ [ANALISI SCANNER · TERMINALE MAGI]\nStato: Collegamento attivo con il palmare del Campione.\nTasso di Sincronia: ${m.synchro}% · Materie connesse: ${m.materias.length}\nCanale Mako: Frequenza anomala rilevata a Est (X:20, Y:3).`, "pg_bassifondi"],
            ["pg_maya", "«Il segnale è perfetto. Il palmare riceve tutte le tracce Mako del settore in tempo reale!»"]
          ], done);
        } else {
          say([["pg_maya", "«Questo terminale MAGI portatile riceve i parametri biologici del tuo tiro. Attiva lo Scanner Sinaptico (Mako Vision) per rivelare i flussi energetici!»"]], done);
        }
        return true;
      }
      if (ch === "H") {
        say([["voce", "Una capsula criogenica colma di fluido LCL arancione. I sensori biologici mantengono il soggetto in stasi cinetica.", "pg_reattore"]], done);
        return true;
      }
      if (ch === ">" || ch === "<") {
        say([["voce", "Un varco blindato presidiato dalla sicurezza della Shin-Nerv.", "pg_bassifondi"]], done);
        return true;
      }
      if (ch === "W") {
        say([["voce", "Il Trono d'Ossidiana della Shin-Nerv sovrasta il campo sacro.", "pg_arena_palazzo"]], done);
        return true;
      }
      say([["voce", "Un impianto industriale nei bassifondi del Settore Zero. Nulla di anomalo rilevato a queste coordinate.", bgNow()]], done);
      return true;
    };

    Z.menu = () => zoneMenu();
    api.TRZ[zid] = Z;
    ZONES[zid] = { ch: chN, spec, Z };
  }

  // ------------------------------------------------------------------ Menu In Gioco & Synchro-Nav
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
    const curZid = zoneRec() ? api.trZone() : "";
    const target = getCurrentScannerTarget(curZid);
    api.trAsk(
      "voce",
      `<b>Phantom Genesis</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>${scannerActive ? "👁️ <b>Scanner Sinaptico: ATTIVO</b> (" + (target ? target.hint : "In scansione") + ")" : "👁️ Scanner Sinaptico: Spento"}<br>Sincronia: ${mem().synchro}% · Materie: ${mem().materias.length} · Monete: ${bal()}${h ? " · " + esc(h.name) : ""}</span>`,
      [
        { label: "◂ Torna a esplorare", sub: scannerActive ? "Scanner ATTIVO · Segui i segnali luminosi sul campo" : "Riprendi a camminare nella zona", cls: "hot", fn: done },
        {
          label: scannerActive ? "👁️ Disattiva Scanner Sinaptico" : "👁️ Attiva Scanner Sinaptico (Mako Vision)",
          sub: scannerActive ? "Spegni la visione energetica" : "Attiva la visuale Mako ed esci subito per seguire il segnale",
          cls: scannerActive ? "" : "hot",
          fn: () => {
            toggleScanner();
            if (scannerActive) done();
            else zoneMenu();
          }
        },
        { label: "📱 Synchro-Nav & Materie", sub: "Materie equipaggiate, diario e sincronia", fn: () => notebook(zoneMenu, true) },
        { label: "Esci dalla Saga", sub: "I progressi restano salvati", fn: leave }
      ],
      bgNow()
    );
  }

  function notebook(back, inZone) {
    const m = mem(), h = hero() || { name: "Campione", num: 9, shotName: "COLPO DEL RISVEGLIO", shot: "saetta" };
    const matRows = m.materias.map((x) => {
      const [id, name, desc, col] = x.split(":::");
      return `• <b style="color:${col || '#10b981'}">● ${esc(name)}</b>: <span style="color:var(--dim)">${esc(desc)}</span>`;
    }).join("<br>") || "<span style='color:var(--dim)'>Nessuna Materia ancora raccolta.</span>";

    const logRows = m.log.slice(-6).map((x) => `• ${esc(T(x))}`).join("<br>") || "<span style='color:var(--dim)'>Nessuna annotazione nel Synchro-Nav.</span>";

    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} (Pilota del Risveglio)<br><span style="color:var(--dim)">Tiro Risvegliato: «${esc(h.shotName || "COLPO DEL RISVEGLIO")}»</span><br><br><b>🔮 Materie Equipaggiate sugli Scarpini</b><br>${matRows}<br><br><b>📜 Note del Terminale</b><br>${logRows}<br><br><span style="color:var(--dim)">Tasso Sincronia: ${m.synchro}% · Vittorie Arena: ${m.wins} · Sconfitte: ${m.losses}</span>`;

    if (inZone) {
      api.trAsk("voce", html, [{ label: "◂ Torna a esplorare", fn: done }], bgNow());
    } else {
      api.scene(bgNow(), "voce", html, [{ label: "◂ Indietro", fn: back }], "Phantom Genesis · Synchro-Nav");
    }
  }

  // ------------------------------------------------------------------ Sistema Partita Ibrido (Opzione C)
  // Combina:
  // 1. Battaglia Tattica Dinamica Shin-Persona & AT-Field (sistema RPG cinematografico su misura)
  // 2. Action Soccer 2D HD (tempo reale 5v5 top-down)
  // 3. Cyber-Cage Street Football (3v3 nella gabbia al neon)
  // 4. Partita a turni classica
  let inMatch = false;
  const VENUE_PG = {
    ads: [["SHIN-NERV GEOFRONT", "#0f172a"], ["MAKO REACTOR 0", "#022c22"], ["PHANTOM CORPS", "#450a0a"], ["SYNCHRO-BALL LEAGUE", "#1e1b4b"]],
    crowd: ["#020617", "#0f172a", "#1e293b", "#064e3b", "#450a0a"],
    tint: "rgba(16, 185, 129, 0.15)", glow: "52, 211, 153"
  };

  // Battaglia Tattica Cinematografica "Shin-Persona & AT-Field"
  function startTacticalShinPersonaMatch(o) {
    castHero();
    const h = hero() || { name: "Campione", num: 9, shotName: "COLPO DEL RISVEGLIO", shot: "saetta" };
    let atField = 100;
    let limitBreak = 0;
    let turn = 1;
    let bossHp = 3; // 3 gol necessari per abbattere l'Apostolo
    let ourScore = 0;
    let bossScore = 0;

    function renderBattleStep(msg) {
      const m = mem();
      const atColor = atField <= 30 ? "#ef4444" : atField <= 60 ? "#f59e0b" : "#10b981";
      const limitReady = limitBreak >= 100;

      const hudHtml = `
        <div style="font-size:13px; line-height:1.4;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:6px; margin-bottom:8px;">
            <b style="color:#ef4444;">APOSTOLO SHIN-NERV</b>
            <span style="font-weight:bold; color:#f8fafc; font-size:15px;">${ourScore} — ${bossScore}</span>
            <b style="color:#38bdf8;">PHANTOM THIEVES</b>
          </div>
          <div style="margin-bottom:6px;">
            <b>AT-FIELD NEMICO:</b> <span style="color:${atColor}; font-weight:bold;">${atField}%</span>
            <div style="width:100%; height:8px; background:#0f172a; border-radius:4px; overflow:hidden; border:1px solid #334155; margin-top:2px;">
              <div style="width:${atField}%; height:100%; background:${atColor}; transition:width 0.3s;"></div>
            </div>
          </div>
          <div style="margin-bottom:8px;">
            <b>LIMIT BREAK / PERSONA:</b> <span style="color:#eab308; font-weight:bold;">${limitBreak}% ${limitReady ? "⚡ PRONTO!" : ""}</span>
            <div style="width:100%; height:8px; background:#0f172a; border-radius:4px; overflow:hidden; border:1px solid #334155; margin-top:2px;">
              <div style="width:${Math.min(100, limitBreak)}%; height:100%; background:#eab308; transition:width 0.3s;"></div>
            </div>
          </div>
          <div style="padding:6px 8px; background:rgba(15,23,42,0.8); border-left:3px solid #10b981; border-radius:3px; font-size:12px; color:#cbd5e1;">
            ${msg || "L'Apostolo avversario emette una frequenza di terrore. Abbatti l'AT-Field per aprire la porta!"}
          </div>
        </div>
      `;

      const choices = [];

      // 1. Se AT-Field è a 0 -> ALL-OUT ATTACK DISPONIBILE!
      if (atField <= 0) {
        choices.push({
          label: "⚡ ALL-OUT ATTACK · ASSALTO TOTALE DEL CUORE!",
          sub: `Scatena ${h.name} e Kael con il ${h.shotName || "Tiro del Risveglio"}!`,
          cls: "hot",
          fn: () => {
            sfxAllOutBreak();
            ourScore++;
            atField = 100;
            limitBreak = 0;
            if (ourScore >= bossHp) {
              // Vittoria!
              sfxGlassAwakening();
              api.scene("pg_arena_palazzo", "voce", `<b>VITTORIA TOTALE! IL NUCLEO È INFRANTO!</b><br>Risultato finale: <b>${ourScore} - ${bossScore}</b><br><br>Con un boato da Terzo Impatto, il tiro di ${esc(h.name)} perfora la porta biomeccanica! L'Apostolo si sgretola in petali di luce cremisi e la maschera di ferro si frantuma al suolo.`, [
                { label: "Prosegui nella storia", cls: "hot", fn: () => o.done({ a: ourScore, b: bossScore, win: true, recap: "Vittoria Tattica All-Out" }) }
              ]);
            } else {
              renderBattleStep(`🔥 <b>GOOOL! ASSALTO TOTALE RIUSCITO!</b> Il tiro ${h.shotName} ha squarciato la rete! Ma l'Apostolo riattiva una seconda barriera a frequenza aumentata!`);
            }
          }
        });
      } else {
        // Scelte tattiche normali
        choices.push({
          label: "⚔️ Fendente Cinquantico & Passaggio Rapido",
          sub: "Kael attacca il fianco per logorare l'AT-Field (-35%) e carica il Limit (+25%)",
          cls: "hot",
          fn: () => {
            sfxMakoResonance();
            atField = Math.max(0, atField - 35);
            limitBreak = Math.min(100, limitBreak + 25);
            // Reazione avversaria
            if (Math.random() < 0.25 && atField > 0) {
              bossScore++;
              sfxEvaAlarm();
              renderBattleStep(`Kael fende l'aria abbassando l'AT-Field, ma l'Apostolo risponde con un raggio a croce e segna in contropiede! (Gol nemico!)`);
            } else {
              renderBattleStep(`Ottima combinazione! Il pallone rimbalza contro il campo di forza facendolo vibrare. AT-Field ridotto!`);
            }
          }
        });

        // 2. Materie
        choices.push({
          label: "🔮 Scatena Materia Eterea",
          sub: "Usa l'energia Mako per dimezzare l'AT-Field istantaneamente (-50%)",
          fn: () => {
            sfxMateriaSocket();
            atField = Math.max(0, atField - 50);
            limitBreak = Math.min(100, limitBreak + 35);
            renderBattleStep(`Le Materie incastonate negli scarpini rilasciano un fulmine verde smeraldo che manda in tilt i circuiti dell'Apostolo!`);
          }
        });

        // 3. Risveglio Persona
        choices.push({
          label: "👁️ Risveglio Sinaptico della Persona",
          sub: "Carica istantaneamente il Limit Break al massimo ma rischia un contropiede",
          fn: () => {
            sfxGlassAwakening();
            limitBreak = 100;
            atField = Math.max(0, atField - 25);
            renderBattleStep(`La Persona di ${esc(h.name)} ruggisce alle tue spalle con ali di fuoco azzurro! Il Limit Break è al 100%!`);
          }
        });
      }

      api.scene("pg_arena_palazzo", "voce", hudHtml, choices, "Phantom Genesis · Duello Tattico");
    }

    renderBattleStep();
  }

  function playMatch(o) {
    castHero(); inMatch = true;
    const h = hero() || { name: "Campione", num: 9, shotName: "COLPO DEL RISVEGLIO" };

    // Offri la Scelta Ibrida (Opzione C):
    api.scene(
      bgNow(),
      "voce",
      `<b>${esc(T(o.chap))}</b><br>La sfida contro le forze Shin-Nerv è giunta al culmine. Scegli come affrontare questa partita decisiva per il destino del Settore Zero:`,
      [
        {
          label: "⚔️ Duello Tattico Shin-Persona & AT-Field",
          sub: "Sistema RPG a turni con Limit Break, Materie, abbattimento AT-Field e All-Out Attack",
          cls: "hot",
          fn: () => startTacticalShinPersonaMatch({
            ...o,
            done: (r) => {
              inMatch = false;
              const m = mem();
              if (r.win) m.wins++; else if (r.a < r.b) m.losses++;
              save(); refreshZone(); o.done(r);
            }
          })
        },
        {
          label: "⚽ Action Soccer 2D HD (Tempo Reale 5v5)",
          sub: "Muovi tu il Campione con analogico/WASD sul campo industriale in tempo reale",
          fn: () => {
            api.matchPick({
              alt: "hd,cage",
              squad: ["Portiere Mecha", "Kael Buster", "Maya Akagi"],
              oppNames: o.oppNames || ["Apostolo Sachiel", "Androide 01", "Androide 02", "Drone Alfa", "Guardiano Core"],
              id: o.id, chap: o.chap, intro: T(o.intro), mate: "Kael", mateGeneric: true,
              us: "Phantom Thieves", min: 45, team: o.team, venue: VENUE_PG,
              onDone: (r) => {
                inMatch = false;
                const m = mem();
                if (r.win) m.wins++; else if (r.a < r.b) m.losses++;
                save(); refreshZone(); o.done(r);
              }
            });
          }
        },
        {
          label: "🥅 Cyber-Cage Street Football (3v3 nella Gabbia)",
          sub: "Partita ad alta velocità con sponde riflettenti nella Gabbia del Settore Zero",
          fn: () => {
            api.matchPick({
              alt: "cage",
              cageTarget: 5, cageMut: "fast",
              squad: ["Kael Buster", "Maya Akagi"],
              oppNames: o.oppNames || ["Apostolo Sachiel", "Androide 01", "Androide 02", "Drone Alfa", "Guardiano Core"],
              id: o.id, chap: o.chap, intro: T(o.intro), mate: "Kael", mateGeneric: true,
              us: "Phantom Thieves", min: 45, team: o.team, venue: VENUE_PG,
              onDone: (r) => {
                inMatch = false;
                const m = mem();
                if (r.win) m.wins++; else if (r.a < r.b) m.losses++;
                save(); refreshZone(); o.done(r);
              }
            });
          }
        }
      ],
      "Phantom Genesis · Selezione Modalità Partita"
    );
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
    addMateria, toggleScanner, sfxEvaAlarm, sfxGlassAwakening, sfxMakoResonance, sfxAllOutBreak, sfxMateriaSocket,
    P: (x, y, w, h, c) => P(x, y, w, h, c), glow, grad, floorPaint, drawTile, makeLayers,
    frNow, refreshZone, bgNow, zone: registerZone,
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
  // CAPITOLO 1 · IL RISVEGLIO NEL SETTORE ZERO & IL FURTO DELLA MATERIA
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addMateria, sfxGlassAwakening, sfxEvaAlarm } = X;
    const N = 1, S = () => X.stepOf(N);

    // Cast Personaggi Nuovi
    X.cast("pg_kael", {
      name: "Kael Buster", tag: "ribelle", hair: "#334155", style: "short", skin: "#d4a373", eye: "#ea580c",
      bg: ["#020617", "#ea580c"], shirt: "#1e293b"
    }, "Leader della resistenza dei Bassifondi. Un tempo difensore d'acciaio nella Lega Superiore, ha perso il braccio in un sabotaggio e ora impugna un innesto idraulico a vapore. Non si fida di nessuno, tranne che del tuo tocco di palla.");

    X.cast("pg_maya", {
      name: "Dott.ssa Maya", tag: "scienziata", hair: "#06b6d4", style: "medium", skin: "#f6ede2", eye: "#0891b2",
      bg: ["#082f49", "#06b6d4"], shirt: "#f8fafc"
    }, "Ingegnere cibernetico fuggita dai laboratori Shin-Nerv. Monitora il tuo tasso di sincronia attraverso il palmare e nasconde una colpa incancellabile: è stata lei a progettare il circuito che ruba i desideri ai giovani talenti.");

    X.cast("pg_rin", {
      name: "Rin la Strillona", tag: "mercantessa", hair: "#f59e0b", style: "twintails", skin: "#fcd34d", eye: "#d97706",
      bg: ["#451a03", "#f59e0b"], shirt: "#78350f"
    }, "Orfana dei vicoli industriali. Vende sfere di Materia grezza recuperate dai canali di scolo Mako e sa sempre quali pattuglie di androidi stanno setacciando il distretto.");

    function collectMateriaStep2() {
      const s = S();
      if (s === 2) {
        say([
          ["voce", "👁️ [ANOMALIA ENERGETICA AGGANCIATA]\nLe frequenze dello Scanner Sinaptico risuonano con la grata metallica. Tra i tralicci metallici bagnati dalla pioggia, un cristallo azzurro pulsa a ritmo frenetico!", "pg_bassifondi"],
          ["hero", "«Ecco la Materia Saetta! L'energia Mako è talmente densa che fa rizzare i capelli.»"]
        ], () => {
          setStep(N, 3);
          sfxGlassAwakening();
          if (api && api.trToast) api.trToast("⚡ Materia Saetta Recuperata!");
          note("Ho recuperato la Materia Saetta dal condotto Mako grazie allo Scanner Sinaptico. Devo portarla a Rin la Strillona a est per montarla sugli scarpini.");
          done();
        });
      } else if (s < 2) {
        say([["voce", "La conduttura Mako emette scintille violente a 10.000 Volt. Parla prima con Kael e con la Dott.ssa Maya a nord per attivare il Synchro-Nav ed estrarre la Materia in sicurezza!", "pg_bassifondi"]], done);
      } else {
        say([["voce", "La conduttura Mako è ora silente e stabile. La Materia Saetta è già incastonata nei tuoi scarpini!", "pg_bassifondi"]], done);
      }
    }

    function handleBarile() {
      if (scannerActive) {
        sfxMakoResonance();
        say([
          ["voce", "👁️ [ANALISI SCANNER · BARILE RIBELLE]\nFrequenza termica: 340°C. La cellula ribelle di Kael utilizza questo fuoco schermato per mascherare la firma calorica contro i droni aerei Shin-Nerv.", "pg_bassifondi"],
          ["pg_kael", "«Lo Scanner funziona alla perfezione! Questo barile ci tiene caldi e invisibili ai radar. Sfruttalo per scaldarti tra una missione e l'altra.»"]
        ], done);
      } else {
        say([["pg_kael", "«Il fuoco di questo barile tiene lontana l'umidità del reattore. Fatti forza, ragazzo. Con lo Scanner Sinaptico acceso potrai persino studiare la schermatura termica!»"]], done);
      }
    }

    function handleTerminaleMagi() {
      if (scannerActive) {
        sfxMakoResonance();
        const m = mem();
        say([
          ["voce", `👁️ [ANALISI SCANNER · TERMINALE MAGI-PORTATILE]\nStato: Connesso al palmare del Campione.\nTasso di Sincronia: ${m.synchro}% · Materie registrate: ${m.materias.length}\nCanale Mako: Frequenza anomala rilevata a Est (X:20, Y:3).`, "pg_bassifondi"],
          ["pg_maya", "«Il collegamento con il palmare è perfetto! Segui la traccia energetica verso est per scovare la Materia Saetta!»"]
        ], done);
      } else {
        say([["pg_maya", "«Questo terminale MAGI portatile riceve i parametri biologici del tuo tiro. Attiva lo Scanner Sinaptico (Mako Vision) dal pulsante rapido per rivelare i flussi energetici!»"]], done);
      }
    }

    function handleGateStep4() {
      if (S() >= 4) {
        matchCapitolo1();
      } else {
        say([["voce", "Il cancello blindato per il Reattore è sigillato dai protocolli Shin-Nerv. Parla prima con Kael, Maya e Rin per completare il risveglio e prepararti!", "pg_bassifondi"]], done);
      }
    }

    const chDef = {
      n: 1, title: "Il Risveglio nel Settore Zero",
      sub: "L'Eclissi, il braccio di Kael e la prima Materia Saetta",
      start: "pg_bassifondi",
      goal: (s) => (
        s === 0 ? "Parla con Kael Buster al barile in fiamme." :
        s === 1 ? "Consulta la Dott.ssa Maya per attivare il Synchro-Nav." :
        s === 2 ? "Usa lo Scanner Sinaptico (Mako Vision) per trovare la Materia Saetta." :
        s === 3 ? "Porta la Materia a Rin la Strillona per incastonarla negli scarpini." :
        s === 4 ? "Respingi la Pattuglia d'Assalto Shin-Nerv all'uscita del distretto!" :
        "Capitolo 1 completato · Pronto per il Reattore Mako!"
      ),
      intro: () => [
        ["voce", "Settore Zero. Una notte senza stelle sotto la colossale piastra d'acciaio della città alta.", "pg_bassifondi"],
        ["voce", "Apri gli occhi sul selciato bagnato dalla pioggia. Nelle tue mani c'è un pallone segnato da rune fluorescenti che pulsano a ritmo del tuo battito cardiaco.", "pg_bassifondi"],
        ["pg_kael", "«Ehi, pivello! Sei vivo o devo buttarti nel canale Mako con gli altri scarti della Federazione? Alzati, le sirene stanno già suonando!»", "pg_bassifondi"]
      ],
      obj: {
        "5,7": () => handleBarile(),
        "B": () => handleBarile(),
        "11,4": () => handleTerminaleMagi(),
        "X": () => handleTerminaleMagi(),
        "20,3": () => collectMateriaStep2(),
        "M": () => collectMateriaStep2(),
        "23,8": () => handleGateStep4(),
        ">": () => handleGateStep4()
      },
      talk: {
        pg_kael: () => {
          const s = S();
          if (s === 0) {
            say([
              ["pg_kael", "«Ti ho visto cadere dal condotto del Reattore Centrale. Portavi questo pallone stretto al petto come se fosse l'ultimo respiro del mondo.»"],
              ["hero", "«Dove... dove mi trovo? Chi sei?»"],
              ["pg_kael", "«Benvenuto nei Bassifondi del Settore Zero, ragazzo. Io sono Kael. Lassù la Shin-Nerv ha cancellato il calcio naturale: ora giocano solo manichini sintetici nutriti dal Flusso Vitale rubato a noialtri.»"],
              ["pg_kael", "«Se vuoi sopravvivere stanotte, parla subito con la Dott.ssa Maya laggiù. Il tuo Tasso di Sincronia sta facendo impazzire i suoi terminali.»"]
            ], () => {
              setStep(N, 1);
              note("Kael mi ha salvato la vita nei bassifondi. Devo parlare con la Dott.ssa Maya per capire cosa mi è successo.");
              done();
            });
            return;
          }
          if (s === 1) {
            say([["pg_kael", "«Non perdere tempo, la Dott.ssa Maya è vicino al generatore a nord. Sbrigati prima che la pattuglia blocchi le valvole!»"]], done);
            return;
          }
          if (s >= 4) {
            say([["pg_kael", "«Gli androidi della Shin-Nerv sono alle porte! Sfodera il tuo tiro, fammi vedere se la leggenda del Campione è vera!»"]], () => {
              matchCapitolo1();
            });
            return;
          }
          say([["pg_kael", "«Tieni gli occhi aperti e gli scarpini allacciati. Nei bassifondi nessuno ti regala un metro di campo.»"]], done);
        },

        pg_maya: () => {
          const s = S();
          if (s === 1) {
            say([
              ["pg_maya", "«Incredibile... Il tuo battito cardiaco e la rotazione di quella sfera sono perfettamente in fase. Tasso di sincronia: 99.8%!»"],
              ["hero", "«La dottoressa? Kael mi ha detto che puoi aiutarmi.»"],
              ["pg_maya", "«Ascoltami bene: hai dentro di te il 'Genoma del Risveglio'. La Shin-Nerv usa il Flusso Vitale Mako per creare gli Apostoli, ma tu puoi risvegliare la tua Persona Calcistica.»"],
              ["pg_maya", "«Ho configurato il protocollo 'Synchro-Nav' sul tuo palmare e attivato lo Scanner Sinaptico (Mako Vision). Guarda il mirino verde e la scia: rileva la 'Materia Saetta' a est (X:20, Y:3)! Seguila e premi Azione per estrarla!»"]
            ], () => {
              setStep(N, 2);
              scannerActive = true;
              sfxGlassAwakening();
              note("Maya ha attivato lo Scanner Sinaptico. La Materia Saetta è segnalata a est (X:20, Y:3).");
              done();
            });
            return;
          }
          if (s === 2) {
            say([["pg_maya", "«Usa il pulsante rapido [Scan: ON] in basso a destra per orientarti: segui la scia energetica fino alla grata del condotto Mako a est (X:20, Y:3) e premi Azione per estrarre la Materia!»"]], done);
            return;
          }
          say([["pg_maya", "«Sii prudente. Se la Shin-Nerv scopre che possiedi la Materia Saetta, invierà l'Apostolo in persona.»"]], done);
        },

        pg_rin: () => {
          const s = S();
          if (s === 3) {
            say([
              ["pg_rin", "«Ehi, campione! Hai trovato la Materia Saetta nel fango? Dalla a me, so esattamente come incastonarla negli scanalati dei tuoi scarpini!»"],
              ["hero", "«Non si romperà durante un contrasto?»"],
              ["pg_rin", "«Scherzi?! È quarzo Mako puro! Con questa il tuo tiro {tiro} lascerà una scia di fulmini scarlatti che accecherà qualsiasi portiere cibernetico!»"],
              ["pg_rin", "«Fatto! Senti come vibra la suola? Ora corri da Kael: sento le sirene della Shin-Nerv all'imbocco del vicolo!»"]
            ], () => {
              addMateria("mat_saetta", "Materia Saetta", "Aumenta la velocità del tiro speciale e perfora le barriere", "#38bdf8");
              setStep(N, 4);
              sfxEvaAlarm();
              note("Rin ha incastonato la Materia Saetta nei miei scarpini. Gli androidi della Shin-Nerv stanno attaccando il cancello!");
              done();
            });
            return;
          }
          say([["pg_rin", "«Vendo cavi di rame e batterie rubate ai droni! Se trovi altre Materie nel reattore, portamele!»"]], done);
        }
      },
      zones: {
        pg_bassifondi: {
          name: "I Bassifondi del Settore Zero", short: "Settore Zero", sub: "Baracche, neon e pioggia Mako",
          w: 24, h: 16, start: [4, 8], bg: "pg_bassifondi",
          areas: [
            [1, 1, 6, 4, "Barile Ribelle", "Il rifugio improvvisato della cellula di Kael Buster"],
            [10, 1, 16, 4, "Canale Mako", "Scarico industriale di fluido energetico fluorescente"],
            [18, 10, 23, 15, "Cancello di Sicurezza", "Barriera d'acciaio che conduce al Reattore Centrale"]
          ],
          npcs: (step) => [
            { id: "pg_kael", at: [6, 7], dir: "down" },
            { id: "pg_maya", at: [12, 4], dir: "right" },
            { id: "pg_rin", at: [18, 8], dir: "left" }
          ],
          build: (Ls) => {
            // Mura esterne
            Ls.lay(0, 0, 23, 0, "#"); Ls.lay(0, 15, 23, 15, "#");
            Ls.lay(0, 0, 0, 15, "#"); Ls.lay(23, 0, 23, 15, "#");
            // Pavimentazione asfalto e lastre
            Ls.lay(1, 1, 22, 14, ",");
            Ls.lay(8, 2, 15, 6, "="); // Grate Mako
            Ls.lay(17, 7, 21, 11, "q"); // Area commerciale di Rin
            // Barili e terminali
            Ls.put(5, 7, "B"); Ls.put(11, 4, "X"); Ls.put(20, 3, "M");
            // Uscita a destra
            Ls.put(23, 8, ">");
          },
          actLabels: {
            "B": "🔥 Barile Ribelle",
            "X": "🖥️ Terminale MAGI",
            "M": "⚡ Condotto Mako",
            ">": "🚪 Cancello Shin-Nerv",
            "5,7": "🔥 Barile Ribelle",
            "11,4": "🖥️ Terminale MAGI",
            "20,3": "⚡ Condotto Mako",
            "23,8": "🚪 Cancello Shin-Nerv"
          },
          act: {
            "5,7": () => handleBarile(),
            "B": () => handleBarile(),
            "11,4": () => handleTerminaleMagi(),
            "X": () => handleTerminaleMagi(),
            "20,3": () => collectMateriaStep2(),
            "M": () => collectMateriaStep2(),
            "23,8": () => handleGateStep4(),
            ">": () => handleGateStep4()
          }
        }
      }
    };

    function matchCapitolo1() {
      X.playMatch({
        id: "ch1_shin_patrol", chap: "Capitolo 1 · Battaglia al Cancello del Settore Zero",
        intro: "La Pattuglia d'Assalto Shin-Nerv ha sfondato la palizzata! Schiera la resistenza e infrangi la loro linea!",
        mate: "Kael", squad: ["Kael Buster", "Dott.ssa Maya"],
        oppNames: ["Comandante Android", "Drone Balistico 01", "Drone Balistico 02", "Intercettore Mako", "Mastino Cibernetico"],
        team: (t, st) => ({ name: "Pattuglia Shin-Nerv", color: "#ef4444", atk: 18, def: 20, vel: 19 }),
        done: (r) => {
          if (r.win) {
            say([
              ["pg_kael", "«Che fendente incredibile! Quel tiro ha disintegrato i servomotori del loro portiere!»"],
              ["pg_maya", "«Il tuo tasso di sincronia ha superato il limite teorico: hai risvegliato il primo frammento della tua Persona!»"],
              ["hero", "«Ora la via per il Reattore Centrale è aperta. Dobbiamo andare a scoprire la verità.»"]
            ], () => {
              reward("ch1_reward", { coins: 150 });
              X.finishChapter(1, "cancello_espugnato");
              setStep(1, 5);
              note("Abbiamo sconfitto la pattuglia Shin-Nerv. Il Capitolo 1 è completato: il varco per il Reattore è spalancato!");
              done();
            });
          } else {
            say([["pg_kael", "«Accidenti, i loro circuiti hanno retto! Riprenditi, proviamo un altro schema d'attacco!»"]], done);
          }
        }
      });
    }

    return chDef;
  });

  // ============================================================================
  // CAPITOLO 2 · L'INFILTRAZIONE NEL REATTORE MAKO & IL VELO DELL'APOSTOLO
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addMateria, sfxGlassAwakening, sfxEvaAlarm } = X;
    const N = 2, S = () => X.stepOf(N);

    // Cast Boss e Personaggi Capitolo 2
    X.cast("pg_sachiel", {
      name: "Apostolo Sachiel-X", tag: "apostolo", hair: "#ffffff", style: "bald", skin: "#0f172a", eye: "#ef4444",
      bg: ["#450a0a", "#ef4444"], shirt: "#020617"
    }, "Il Colosso Biomeccanico a guardia del Nucleo Centrale. Non parla: emette una risonanza a frequenza di terrore e proietta un AT-Field impenetrabile a qualsiasi tiro umano ordinario.");

    function collectLclBarrier() {
      if (S() === 2) {
        say([
          ["voce", "Dalla valvola di sfiato della capsula LCL cola una goccia di fluido cristallizzato color smeraldo.", "pg_reattore"],
          ["hero", "«La Materia Barriera LCL! Questa sfera proietta uno scudo quantico identico all'AT-Field!»"]
        ], () => {
          addMateria("mat_barriera", "Materia Barriera LCL", "Annulla i contropiedi avversari e rafforza i contrasti difensivi", "#10b981");
          setStep(N, 3);
          sfxEvaAlarm();
          note("Ho ottenuto la Materia Barriera LCL. L'Apostolo Sachiel-X si è materializzato davanti al portone!");
          done();
        });
      } else {
        say([["voce", "La capsula pulsa di luce arancione. Un ragazzo all'interno sembra sognare una partita infinita.", "pg_reattore"]], done);
      }
    }

    const chDef = {
      n: 2, title: "Il Reattore del Terzo Impatto",
      sub: "Vasche LCL, terminali MAGI e il duello contro Sachiel-X",
      start: "pg_reattore",
      goal: (s) => (
        s === 0 ? "Avanza nel Nucleo del Reattore e parla con la Dott.ssa Maya." :
        s === 1 ? "Decifra i tre terminali MAGI (Melchior, Balthasar, Casper) per disattivare il refrigerante." :
        s === 2 ? "Raccogli la 'Materia Barriera LCL' vicino alle vasche criogeniche." :
        s === 3 ? "Affronta l'Apostolo Sachiel-X all'ingresso della Sala del Trono!" :
        "Capitolo 2 completato · Accesso al Palazzo delle Maschere sbloccato!"
      ),
      intro: () => [
        ["voce", "Il cuore pulsante della megastruttura Shin-Nerv. Tubazioni ciclopiche trasudano energia verde smeraldo.", "pg_reattore"],
        ["voce", "Nell'aria si avverte l'odore metallico del liquido LCL e il ronzio sinistro dei supercomputer MAGI.", "pg_reattore"],
        ["pg_maya", "«Siamo dentro. Questa è la forgia dove trasformano l'anima dei campioni in batterie cinetiche.»", "pg_reattore"]
      ],
      obj: {
        "9,11": () => magiConsole("Melchior", "alpha"),
        "12,11": () => magiConsole("Balthasar", "beta"),
        "15,11": () => magiConsole("Casper", "synchro"),
        "X": ({ tx }) => {
          if (tx <= 10) magiConsole("Melchior", "alpha");
          else if (tx <= 13) magiConsole("Balthasar", "beta");
          else magiConsole("Casper", "synchro");
        },
        "10,4": () => collectLclBarrier(),
        "14,4": () => collectLclBarrier(),
        "H": () => collectLclBarrier(),
        "23,8": () => {
          if (S() >= 3) matchCapitolo2();
          else say([["voce", "La barriera dell'Apostolo blocca il passaggio con una scarica elettrica. Disattiva prima i MAGI ed estrai la Materia Barriera!", "pg_reattore"]], done);
        },
        ">": () => {
          if (S() >= 3) matchCapitolo2();
          else say([["voce", "La barriera dell'Apostolo blocca il passaggio con una scarica elettrica. Disattiva prima i MAGI ed estrai la Materia Barriera!", "pg_reattore"]], done);
        }
      },
      talk: {
        pg_maya: () => {
          const s = S();
          if (s === 0) {
            say([
              ["pg_maya", "«Guarda quelle vasche... Non contengono cloni sintetici: sono i corpi dei campioni della scorsa generazione!»"],
              ["hero", "«Tutti quegli atleti scomparsi... Li tengono in coma per alimentare l'AT-Field della città alta?»"],
              ["pg_maya", "«Esattamente. Per aprire la paratia blindata dobbiamo hackerare i tre terminali MAGI: Melchior, Balthasar e Casper.»"],
              ["pg_maya", "«Interagisci con i terminali arancioni esagonali lungo la passerella e immetti la sequenza armonica corretta!»"]
            ], () => {
              setStep(N, 1);
              note("Devo decifrare i tre terminali MAGI lungo la passerella per disattivare il sistema di contenimento.");
              done();
            });
            return;
          }
          if (s === 1) {
            say([["pg_maya", "«Melchior richiede la frequenza Alpha, Balthasar la frequenza Beta e Casper il codice del Risveglio!»"]], done);
            return;
          }
          if (s === 2) {
            say([["pg_maya", "«Ottimo! Ora preleva la Materia Barriera LCL dalla vasca centrale prima che Sachiel-X si risvegli!»"]], done);
            return;
          }
          if (s >= 3) {
            say([["pg_maya", "«Sachiel-X è davanti a noi! Infrangi il suo AT-Field prima che la pressione faccia esplodere la cupola!»"]], () => {
              matchCapitolo2();
            });
            return;
          }
          say([["pg_maya", "«La sincronia regge, ma dobbiamo sbrigarci!»"]], done);
        },

        pg_kael: () => {
          say([
            ["pg_kael", "«Il mio braccio idraulico sta tremando per la pressione di questo posto. Chiunque abbia progettato questo scempio merita di assaggiare il mio scarpino sul muso.»"],
            ["hero", "«Non ci fermeremo finché non avremo liberato ogni singolo ragazzo da quelle vasche.»"]
          ], done);
        }
      },
      zones: {
        pg_reattore: {
          name: "Il Nucleo del Reattore Shin-Nerv", short: "Reattore Mako", sub: "Cattedrale d'acciaio e vasche LCL",
          w: 24, h: 16, start: [2, 8], bg: "pg_reattore",
          areas: [
            [1, 6, 5, 10, "Passerella d'Ingresso", "L'accesso dai bassifondi"],
            [8, 2, 16, 7, "Vasche di Contenimento LCL", "Capsule criogeniche con atleti sospesi"],
            [8, 10, 16, 14, "Banco Terminali MAGI", "Supercomputer a logica tripartita"],
            [19, 6, 23, 10, "Portone dell'Apostolo", "La soglia d'ossidiana che conduce all'Arena"]
          ],
          npcs: (step) => [
            { id: "pg_maya", at: [6, 7], dir: "right" },
            { id: "pg_kael", at: [4, 9], dir: "up" }
          ],
          build: (Ls) => {
            Ls.lay(0, 0, 23, 0, "#"); Ls.lay(0, 15, 23, 15, "#");
            Ls.lay(0, 0, 0, 15, "#"); Ls.lay(23, 0, 23, 15, "#");
            Ls.lay(1, 1, 22, 14, "m"); // Piastre d'acciaio
            Ls.lay(7, 3, 17, 7, "="); // Grate fosforescenti
            // Terminali MAGI
            Ls.put(9, 11, "X"); Ls.put(12, 11, "X"); Ls.put(15, 11, "X");
            // Vasche LCL
            Ls.put(10, 4, "H"); Ls.put(14, 4, "H");
            // Ingresso e uscita
            Ls.put(0, 8, "<"); Ls.put(23, 8, ">");
          },
          actLabels: {
            "X": "🖥️ Terminale MAGI",
            "H": "🧪 Vasca LCL",
            ">": "🚪 Portone dell'Apostolo",
            "<": "🚪 Torna ai Bassifondi",
            "9,11": "🖥️ MAGI-1 Melchior",
            "12,11": "🖥️ MAGI-2 Balthasar",
            "15,11": "🖥️ MAGI-3 Casper",
            "10,4": "🧪 Vasca LCL Alpha",
            "14,4": "🧪 Vasca LCL Beta",
            "23,8": "🚪 Portone dell'Apostolo",
            "0,8": "🚪 Torna ai Bassifondi"
          },
          act: {
            "9,11": () => magiConsole("Melchior", "alpha"),
            "12,11": () => magiConsole("Balthasar", "beta"),
            "15,11": () => magiConsole("Casper", "synchro"),
            "X": ({ tx, ty }) => {
              if (tx === 9 || tx === 10) magiConsole("Melchior", "alpha");
              else if (tx === 12 || tx === 13) magiConsole("Balthasar", "beta");
              else magiConsole("Casper", "synchro");
            },
            "10,4": () => collectLclBarrier(),
            "14,4": () => collectLclBarrier(),
            "H": () => collectLclBarrier(),
            "23,8": () => {
              if (S() >= 3) matchCapitolo2();
              else say([["voce", "La barriera dell'Apostolo blocca il passaggio con una scarica elettrica. Disattiva prima i MAGI ed estrai la Materia Barriera!", "pg_reattore"]], done);
            },
            ">": () => {
              if (S() >= 3) matchCapitolo2();
              else say([["voce", "La barriera dell'Apostolo blocca il passaggio con una scarica elettrica. Disattiva prima i MAGI ed estrai la Materia Barriera!", "pg_reattore"]], done);
            }
          }
        }
      }
    };

    function magiConsole(name, codeKey) {
      if (S() !== 1) {
        say([["voce", `Terminale MAGI [${name}]: I circuiti sono operativi e monitorano il reattore.`, "pg_reattore"]], done);
        return;
      }
      ask("pg_maya", `Terminale MAGI [${name}]: Seleziona il codice di bypass armonico:`, [
        {
          label: "⚡ Frequenza Sincrona 100%", cls: "hot",
          fn: () => {
            sfxMakoResonance();
            F.set("magi_" + codeKey, true);
            if (F.is("magi_alpha") && F.is("magi_beta") && F.is("magi_synchro")) {
              setStep(N, 2);
              sfxGlassAwakening();
              say([
                ["voce", "I tre monitor MAGI lampeggiano all'unisono: 'BYPASS AUTORIZZATO - SISTEMA DI RAFFREDDAMENTO IN PAUSA'.", "pg_reattore"],
                ["pg_maya", "«Ce l'abbiamo fatta! Ora preleva la Materia Barriera dalla vasca a nord prima che scatti l'allarme!»"]
              ], done);
            } else {
              say([["voce", `Codice registrato per ${name}. Mancano ancora gli altri terminali.`, "pg_reattore"]], done);
            }
          }
        },
        { label: "Annulla operazione", fn: done }
      ]);
    }

    function matchCapitolo2() {
      X.playMatch({
        id: "ch2_sachiel_boss", chap: "Capitolo 2 · La Battaglia del Terzo Impatto contro Sachiel-X",
        intro: "L'Apostolo Sachiel-X si erge su zampe d'acciaio biomeccanico! Infrangi il suo AT-Field con la Materia Barriera e scatena l'All-Out Attack!",
        mate: "Maya", squad: ["Kael Buster", "Dott.ssa Maya"],
        oppNames: ["Sachiel-X", "Sfera d'Impatto A", "Sfera d'Impatto B", "Drone AT-Core", "Sentinella Bio"],
        team: (t, st) => ({ name: "Apostolo Sachiel-X", color: "#450a0a", atk: 25, def: 27, vel: 24 }),
        done: (r) => {
          if (r.win) {
            say([
              ["pg_sachiel", "«...S-SYNCHRO... DETECTED... VOI... NON POTETE... FERMARE... KUROGANE...»"],
              ["hero", "«Kurogane?! Il Campione Supremo dall'Ala Nera... È lui dietro a tutto questo?!»"],
              ["pg_maya", "«Sì... Kurogane è il Signore del Palazzo delle Maschere. La porta finale è aperta. Dobbiamo salire alla Sala del Trono.»"]
            ], () => {
              reward("ch2_reward", { coins: 250 });
              X.finishChapter(2, "sachiel_infranto");
              setStep(2, 4);
              note("Abbiamo sconfitto Sachiel-X. La verità è svelata: il leggendario Kurogane è l'artefice dell'algoritmo Shin-Nerv. La finale ci aspetta.");
              done();
            });
          } else {
            say([["pg_maya", "«L'AT-Field ha respinto la sfera! Mantieni la concentrazione e sfrutta la Materia Barriera al momento giusto!»"]], done);
          }
        }
      });
    }

    return chDef;
  });

  // ============================================================================
  // CAPITOLO 3 · L'ECLISSI DELLE MASCHERE & IL GIUDIZIO DI KUROGANE
  // ============================================================================
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc, addMateria, sfxGlassAwakening, sfxEvaAlarm, sfxAllOutBreak } = X;
    const N = 3, S = () => X.stepOf(N);

    // Cast Il Boss Finale: Kurogane
    X.cast("pg_kurogane", {
      name: "Kurogane (Ala Nera)", tag: "signore", hair: "#e2e8f0", style: "long", skin: "#f8fafc", eye: "#eab308",
      bg: ["#090514", "#eab308"], shirt: "#020617"
    }, "Il Campione Supremo dall'Ala Nera. Idolatrato come il salvatore del calcio moderno, è in realtà il primo prototipo sintetico risvegliato. Ritiene che le emozioni umane portino solo alla sconfitta e vuole unificare tutte le menti nella Sfera Definitiva.");

    const chDef = {
      n: 3, title: "L'Eclissi delle Maschere",
      sub: "La Cattedrale d'Ossidiana, l'Ala Nera e la Scelta del Destino",
      start: "pg_arena_palazzo",
      goal: (s) => (
        s === 0 ? "Raggiungi il Trono d'Ossidiana e affronta Kurogane." :
        s === 1 ? "Compi la tua Scelta Morale sul destino del Flusso Vitale." :
        s === 2 ? "Disputa la Finale Suprema per la liberazione dei Bassifondi!" :
        "Saga completata · Il Destino del Calcio è nelle tue mani!"
      ),
      intro: () => [
        ["voce", "Sali l'ultima gradinata d'ossidiana. Davanti a te si spalanca una cattedrale gotica sospesa sopra una Luna di Sangue cosmica.", "pg_arena_palazzo"],
        ["voce", "Al centro del campo, un uomo solitario con una lunga ala meccanica piumata d'argento fa rimbalzare una sfera nera come la notte.", "pg_arena_palazzo"],
        ["pg_kurogane", "«Ti aspettavo, {n}. Il tuo tasso di sincronia è perfetto... Sei degno di essere la mia metà mancante.»", "pg_arena_palazzo"]
      ],
      obj: {
        "12,3": () => {
          if (S() >= 2) matchFinaleKurogane();
          else say([["voce", "Il Trono d'Ossidiana emette una pulsazione gravitazionale che fa tremare il campo.", "pg_arena_palazzo"]], done);
        },
        "W": () => {
          if (S() >= 2) matchFinaleKurogane();
          else say([["voce", "Il Trono d'Ossidiana emette una pulsazione gravitazionale che fa tremare il campo.", "pg_arena_palazzo"]], done);
        }
      },
      talk: {
        pg_kurogane: () => {
          const s = S();
          if (s === 0) {
            say([
              ["pg_kurogane", "«Guardali laggiù nei bassifondi. Urlano, piangono, soffrono per ogni sconfitta domenicale. Perché permettere tanto dolore?»"],
              ["hero", "«La sconfitta fa parte del gioco! È ciò che rende preziosa ogni vittoria, ogni sudore, ogni compagno!»"],
              ["pg_kurogane", "«Illusioni. Con la Sfera Definitiva, io cancellerò l'errore umano. Fonderò ogni anima in un solo tocco perfetto.»"],
              ["pg_kurogane", "«Unisciti a me, {n}. Con la tua Persona e la mia ala, governeremo l'eternità.»"]
            ], () => {
              setStep(N, 1);
              sceltaFinaleKurogane();
            });
            return;
          }
          if (s === 1) {
            sceltaFinaleKurogane();
            return;
          }
          if (s === 2) {
            matchFinaleKurogane();
            return;
          }
          epilogoDialogo();
        }
      },
      zones: {
        pg_arena_palazzo: {
          name: "L'Arena dell'Apostolo e Palazzo delle Maschere", short: "Arena del Trono", sub: "La Cattedrale sopra la Luna di Sangue",
          w: 24, h: 16, start: [12, 13], bg: "pg_palazzo_arena",
          areas: [
            [2, 2, 22, 14, "Il Campo d'Ossidiana", "Lo stadio sacro dove si decide il Terzo Impatto"]
          ],
          npcs: (step) => [
            { id: "pg_kurogane", at: [12, 5], dir: "down" }
          ],
          build: (Ls) => {
            Ls.lay(0, 0, 23, 0, "#"); Ls.lay(0, 15, 23, 15, "#");
            Ls.lay(0, 0, 0, 15, "#"); Ls.lay(23, 0, 23, 15, "#");
            Ls.lay(1, 1, 22, 14, "c"); // Pavimento cerimoniale scarlatto
            Ls.lay(4, 4, 19, 11, "q"); // Campo interno d'ossidiana
            Ls.put(12, 3, "W"); // Il Trono
            Ls.put(12, 15, "d");
          },
          actLabels: {
            "W": "👑 Trono d'Ossidiana",
            "12,3": "👑 Trono d'Ossidiana"
          },
          act: {
            "12,3": () => {
              if (S() >= 2) matchFinaleKurogane();
              else say([["voce", "Il Trono d'Ossidiana emette una pulsazione gravitazionale che fa tremare il campo.", "pg_arena_palazzo"]], done);
            }
          }
        }
      }
    };

    function sceltaFinaleKurogane() {
      ask("pg_kurogane", "Qual è la risposta del tuo Cuore, {n}?", [
        {
          label: "🕊️ Rifiuta l'unione: 'Il calcio appartiene a chi sogna nei bassifondi!'",
          sub: "Finale della Rondine Ribelle (Liberazione totale e distruzione della Shin-Nerv)",
          cls: "hot",
          fn: () => {
            F.set("finale_pg", "liberta_rondine");
            setStep(N, 2);
            sfxGlassAwakening();
            say([
              ["hero", "«La perfezione senza cuore è solo una tomba d'acciaio, Kurogane. Io gioco per i ragazzi del Settore Zero, per Kael, per Maya e per chiunque abbia mai calciato una lattina tra i vicoli!»"],
              ["pg_kurogane", "«E sia. Che la tua Persona affronti la mia Ala Nera sul campo. Chi perde sparirà per sempre!»"]
            ], () => {
              matchFinaleKurogane();
            });
          }
        },
        {
          label: "⚡ Risveglio del Terzo Impatto: 'Purificherò il mondo con il mio Tiro!'",
          sub: "Finale del Giudizio di Luce (Risveglio mistico del Flusso Vitale)",
          fn: () => {
            F.set("finale_pg", "giudizio_luce");
            setStep(N, 2);
            sfxMakoResonance();
            say([
              ["hero", "«Non sarò né il tuo servo né la tua copia. Il mio tiro {tiro} risveglierà il Flusso Vitale e restituirà la luce a tutta la Terra!»"],
              ["pg_kurogane", "«Dimostralo se ne sei capace! Difendi la tua luce, Campione!»"]
            ], () => {
              matchFinaleKurogane();
            });
          }
        }
      ]);
    }

    function matchFinaleKurogane() {
      X.playMatch({
        id: "ch3_kurogane_final", chap: "Capitolo 3 · La Finale del Terzo Impatto · Il Campione vs Kurogane",
        intro: "Kurogane dispiega la sua titanica Ala Nera! L'AT-Field copre l'intero stadio. Questo è il momento della verità per il tuo Campione!",
        mate: "Kael", squad: ["Kael Buster", "Dott.ssa Maya"],
        oppNames: ["Kurogane (Ala Nera)", "Serafino 01", "Serafino 02", "Angelo del Fato", "Baluardo Eterno"],
        team: (t, st) => ({ name: "Kurogane & Shin-Nerv", color: "#eab308", atk: 32, def: 30, vel: 33 }),
        done: (r) => {
          if (r.win) {
            const finale = F.get("finale_pg") || "liberta_rondine";
            sfxAllOutBreak();
            sfxGlassAwakening();

            if (finale === "liberta_rondine") {
              say([
                ["voce", "Con un boato fragoroso, la sfera calciata con il {tiro} spezza l'Ala Nera di Kurogane a metà!", "pg_arena_palazzo"],
                ["pg_kurogane", "«Incredibile... La forza dei desideri umani... Ha davvero sconfitto il calcolo perfetto...»"],
                ["voce", "Le piastre d'acciaio della città alta si aprono lentamente: per la prima volta dopo cinquant'anni, la luce del sole torna a illuminare i volti sporchi di fango nei Bassifondi del Settore Zero.", "pg_bassifondi"],
                ["pg_kael", "«Ce l'abbiamo fatta, pivello! Guarda lassù... Il cielo! Il cielo vero!»"],
                ["pg_maya", "«Tutte le capsule sono aperte. I ragazzi sono liberi. Sei la nostra leggenda, {n}.»"]
              ], () => {
                reward("ch3_final_reward", { coins: 500 });
                X.finishChapter(3, "liberta_rondine");
                setStep(3, 3);
                note("Kurogane è stato sconfitto. La Shin-Nerv è caduta e il cielo splende di nuovo sul Settore Zero! Epilogo della Libertà raggiunto.");
                done();
              });
            } else {
              say([
                ["voce", "Un'onda d'energia pura verde smeraldo si irradia dal tiro di {n}, purificando il reattore e inondando la Terra di un'aurora boreale miracolosa.", "pg_arena_palazzo"],
                ["pg_kurogane", "«Tu... Non hai distrutto il mondo... Lo hai fatto rinascere...»"],
                ["voce", "Il Flusso Vitale circola ora libero attraverso i cuori di tutti i giocatori. La passione per il calcio non potrà mai più essere spenta da nessun algoritmo.", "pg_bassifondi"]
              ], () => {
                reward("ch3_final_reward", { coins: 500 });
                X.finishChapter(3, "giudizio_luce");
                setStep(3, 3);
                note("Kurogane ha compreso il valore della passione. Il Flusso Vitale scorre di nuovo nel pianeta! Epilogo della Luce raggiunto.");
                done();
              });
            }
          } else {
            say([["pg_kurogane", "«La tua volontà ha vacillato sul punto di battuta. Riprova, {n}, finché non sarai all'altezza del tuo destino!»"]], done);
          }
        }
      });
    }

    function epilogoDialogo() {
      const fin = F.get("finale_pg") === "giudizio_luce" ? "Il Giudizio di Luce (Flusso Vitale Purificato)" : "Il Volo della Rondine Ribelle (Sole sui Bassifondi)";
      say([
        ["voce", `<b>Saga Completata</b> · Finale Raggiunto: <b>${esc(fin)}</b><br>I Bassifondi del Settore Zero celebrano il trionfo del Tuo Campione! Tutte le ricompense, le Materie e i progressi sono stati archiviati nel tuo Synchro-Nav.`, "pg_bassifondi"]
      ], done);
    }

    return chDef;
  });

  // ------------------------------------------------------------------ Menu Principale Esterno
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
      return api.scene("pg_bassifondi", "voce", "<b>Phantom Genesis</b> · Il Reattore delle Maschere<br>Questa saga è forgiata su misura per il tuo Campione: nome, numero, aspetto e tiro entrano in scena nel Metaverso Shin-Nerv. Prima serve crearlo nell'editor.", [
        { label: "Crea il tuo campione", sub: "Nome, numero, aspetto e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
        { label: "◂ Modalità", fn: leaveToModes }
      ], "Phantom Genesis");
    }
    castHero();
    const c = activeChapter(), m = mem(), allDone = c && m.done[c.n];
    const nextN = c ? c.n + 1 : 2, nextOk = !!CHAPTERS[nextN];

    api.scene(
      "pg_bassifondi", "voce",
      `<b>Phantom Genesis</b> · Il Reattore delle Maschere<br>${esc(h.name)}, n. ${esc(h.num)} · «${esc(h.shotName || "COLPO DEL RISVEGLIO")}»<br><span style="color:var(--dim)">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}<br>${allDone ? (nextOk ? "Il prossimo capitolo ti attende nel Reattore." : "Saga completata con successo!") : esc(goalNow())}</span>`,
      [
        {
          label: allDone && !nextOk ? "Torna nel Settore Zero" : c && !m.intro["ch" + c.n] ? (c.n > 1 ? `Inizia il Capitolo ${c.n}` : "Comincia la Saga") : "Continua l'Infiltrazione",
          sub: c ? `Capitolo ${c.n} · ${c.title}` : "", cls: "hot",
          fn: continueStory
        },
        { label: "📱 Synchro-Nav & Materie", sub: `Materie ${m.materias.length} · Sincronia ${m.synchro}%`, fn: () => notebook(openMain, false) },
        { label: "Capitoli & Bivi", sub: "Riepilogo delle puntate e finali", fn: chaptersList },
        { label: "◂ Modalità", fn: leaveToModes }
      ],
      "Phantom Genesis"
    );
  }

  function chaptersList() {
    const m = mem(), rows = [];
    for (let n = 1; n <= 3; n++) {
      const c = CHAPTERS[n];
      rows.push(c && (n === 1 || m.done[n - 1] || m.ch >= n) ? `${m.done[n] ? "✓" : "▸"} <b>Capitolo ${n}</b> · ${esc(c.title)} <span style="color:var(--dim)">${esc(m.done[n] ? "completato" : c.sub || "")}</span>` : `<span style="color:var(--dim)">• Capitolo ${n} · ???</span>`);
    }
    api.scene("pg_reattore", "voce", `<b>Le Puntate di Phantom Genesis</b><br>${rows.join("<br>")}<br><br><span style="color:var(--dim)">Le scelte morali e le Materie restano salvate per tutti i bivi e i finali.</span>`, [
      { label: "Ricomincia la saga da zero", sub: "Azzera solo i progressi di questa storia", fn: resetAsk },
      { label: "◂ Indietro", fn: openMain }
    ], "Phantom Genesis · Capitoli");
  }

  function resetAsk() {
    api.scene("pg_bassifondi", "voce", "<b>Vuoi davvero ricominciare da capo?</b><br>I progressi dei capitoli, le Materie e i flag di Phantom Genesis saranno azzerati. Le monete già vinte restano nel tuo portafoglio.", [
      { label: "Sì, ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
      { label: "◂ No, torna indietro", fn: chaptersList }
    ], "Phantom Genesis");
  }

  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    castHero();
    const start = m.zone && ZONES[m.zone] ? m.zone : c.start;
    if (!m.intro["ch" + c.n]) {
      m.intro["ch" + c.n] = 1; save();
      return api.play(c.intro().map(([w, t, bg]) => api.L(w, T(t), bg || "pg_bassifondi")), () => enterZone(c.start));
    }
    enterZone(start);
  }

  // ------------------------------------------------------------------ Avvio & Integrazione Globale
  function start() {
    installHooks();
    while (PENDING.length) {
      const c = PENDING.shift();
      registerChapterZones(c);
    }
    while (CAST_Q.length) {
      const [id, charDef, bio] = CAST_Q.shift();
      if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, charDef);
      if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio;
    }
  }

  function poll() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match) {
      if (tries++ < 80) setTimeout(poll, 100);
      return;
    }
    api = a;
    start();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poll);
  else poll();

  // Esportazione API
  window.__phantomGenesis = {
    open: openMain,
    info: () => ({ id: "phantom-genesis", title: "Phantom Genesis · Il Reattore delle Maschere", sub: "Persona 5 + Evangelion + FF7: AT-Field, Materie e Bassifondi Mako" }),
    menuEntry: (parentFn) => ({
      label: "🎭 Phantom Genesis · Il Reattore delle Maschere",
      sub: hero() ? `Saga Persona 5 + Evangelion + FF7 con ${hero().name} (N.${hero().num})` : "Saga Cyber-Goth JRPG con AT-Field, Materie e All-Out Attack",
      cls: "hot",
      fn: () => openMain({ onExit: parentFn })
    })
  };
})();
