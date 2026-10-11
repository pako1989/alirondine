// ============================================================================
// SHOGUN ECLIPSE · IL REGNO DELLE SETTE LAME E DEI DRAGHI
// Nuova Grande Saga Feudale, Mistica & Samurai per il Tuo Campione
// Ispirata a Sekiro, Ghost of Tsushima, Bleach & Inazuma Eleven
// Motore 2D Camminabile HD con Visione dello Spirito (Katana Sense),
// Portali Torii, Templi Zen e Partite Contestualizzate alle Arti Marziali
// ============================================================================
(function () {
  "use strict";
  if (window.__shogunStoryLoaded) return;
  window.__shogunStoryLoaded = true;

  const KEY = "ali-di-rondine.shogun-story";
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
  const rnd = (tx, ty, k) => hash(tx * 97 + ty * 163 + k * 37) / 4294967296;

  // ------------------------------------------------------------------ Web Audio Synthesizer (Taiko, Katana & Tempio Zen)
  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") { actx.resume(); }
    return actx;
  }

  // Tamburo Taiko da Guerra (impatto basso e risonanza di pelle tesa)
  function sfxTaikoDrum() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.35);
      g.gain.setValueAtTime(0.65, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.55);

      // Rumore d'attacco della bacchetta
      const bOsc = ctx.createOscillator(), bG = ctx.createGain();
      bOsc.type = "triangle";
      bOsc.frequency.setValueAtTime(220, now);
      bOsc.frequency.linearRampToValueAtTime(60, now + 0.08);
      bG.gain.setValueAtTime(0.4, now);
      bG.gain.linearRampToValueAtTime(0.01, now + 0.09);
      bOsc.connect(bG); bG.connect(ctx.destination);
      bOsc.start(now); bOsc.stop(now + 0.09);
    } catch (e) {}
  }

  // Scontro di Lame di Katana (squillo d'acciaio tagliente con riverbero metallico)
  function sfxKatanaClash() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [2200, 3100, 4400, 5600].forEach((freq, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.005);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.28);
        g.gain.setValueAtTime(0.28 / (i + 1), now);
        g.gain.exponentialRampToValueAtTime(0.002, now + 0.32);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.32);
      });
    } catch (e) {}
  }

  // Campana Sacra del Tempio Zen (tono puro profondo e meditativo)
  function sfxSpiritBell() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [432, 864, 1296, 1728].forEach((f, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.3 / (i + 1), now);
        g.gain.exponentialRampToValueAtTime(0.0005, now + 1.8);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now); osc.stop(now + 1.8);
      });
    } catch (e) {}
  }

  // Ruggito dello Spirito del Dragone Celeste (scia cosmica ascendente)
  function sfxDragonRoar() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.55);
      g.gain.setValueAtTime(0.35, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.65);
    } catch (e) {}
  }

  // Brezza dei Ciliegi e Scintille Spirituali
  function sfxCherryBlossom() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [587.33, 783.99, 880.0, 1174.66].forEach((f, i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        g.gain.setValueAtTime(0.18, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.45);
      });
    } catch (e) {}
  }

  // ------------------------------------------------------------------ Visione dello Spirito (Katana Sense / Spirit Sight)
  let spiritSenseActive = false;
  let spiritSenseAlpha = 0;

  function updateSpiritSenseUI() {
    const bSense = document.getElementById("bSpirit");
    if (bSense) {
      bSense.textContent = spiritSenseActive ? "⚔️ Spirito: ON" : "⚔️ Spirito";
      bSense.style.background = spiritSenseActive ? "linear-gradient(180deg, #450a0a 0%, #1c0303 100%)" : "";
      bSense.style.borderColor = spiritSenseActive ? "#ef4444" : "";
      bSense.style.color = spiritSenseActive ? "#fca5a5" : "";
      bSense.style.boxShadow = spiritSenseActive ? "0 0 12px rgba(239,68,68,0.75)" : "";
      bSense.setAttribute("title", spiritSenseActive ? "Visione dello Spirito ATTIVA (Clicca per spegnere)" : "Attiva la Visione dello Spirito (Katana Sense)");
    }
  }

  function ensurePadControls() {
    const padacts = document.querySelector(".padacts");
    if (!padacts) return;
    let bSense = document.getElementById("bSpirit");
    if (!bSense) {
      bSense = document.createElement("button");
      bSense.type = "button";
      bSense.id = "bSpirit";
      bSense.className = "pad";
      bSense.textContent = "⚔️ Spirito";
      bSense.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSpiritSense();
      };
      const bMenu = document.getElementById("bMenu");
      if (bMenu) padacts.insertBefore(bSense, bMenu);
      else padacts.appendChild(bSense);
    }
    updateSpiritSenseUI();
  }

  function toggleSpiritSense() {
    spiritSenseActive = !spiritSenseActive;
    if (spiritSenseActive) sfxSpiritBell(); else sfxCherryBlossom();
    updateSpiritSenseUI();
    const curZid = zoneRec() ? api.trZone() : "";
    const target = getCurrentSpiritTarget(curZid);
    if (spiritSenseActive) {
      if (api && api.trToast) api.trToast("⚔️ Visione dello Spirito ATTIVA: Rivelati sigilli e spiriti guida!");
      const textDiv = document.getElementById("text");
      if (textDiv) {
        textDiv.innerHTML = `<div style="border-left:3px solid #ef4444; padding-left:8px; line-height:1.4;">
          <b style="color:#fca5a5;">⚔️ VISIONE DELLO SPIRITO (Katana Sense)</b><br>
          <span style="font-size:13px; color:#fee2e2;">${target ? target.hint : "I venti spirituali non rivelano minacce immediate in questa zona."}</span>
        </div>`;
      }
    } else {
      if (api && api.trToast) api.trToast("⚔️ Visione dello Spirito disattivata.");
    }
  }

  function getCurrentSpiritTarget(zid) {
    const c = activeChapter();
    if (!c) return null;
    const st = stepOf(c.n);
    if (!zid && api) zid = api.trZone();

    if (zid === "sh_giardino") {
      if (st === 0) return { tx: 8, ty: 7, label: "Maestro Hayato", hint: "Parla con il Maestro Hayato sotto il grande ciliegio fiorito", color: "#f59e0b" };
      if (st === 1) return { tx: 18, ty: 4, label: "Lady Tomoe", hint: "Incontra Lady Tomoe al Padiglione del Tè cremisi a nord-est", color: "#ef4444" };
      if (st === 2) return { tx: 12, ty: 12, label: "Altare del Drago", hint: "Scansiona l'Altare di Pietra al centro (X:12, Y:12) per estrarre la Katana del Vento!", color: "#38bdf8" };
      if (st === 3) return { tx: 22, ty: 8, label: "Ronin della Nebbia", hint: "Sfida il caposquadra dei Ronin davanti alla porta del Borgo!", color: "#ef4444" };
      return { tx: 23, ty: 8, label: "Porta del Borgo", hint: "Varca il Torii rosso (X:23, Y:8) verso il Borgo dei Samurai (Capitolo 2)!", color: "#10b981" };
    }
    if (zid === "sh_villaggio") {
      if (st === 0) return { tx: 6, ty: 6, label: "Kunoichi Hanzo", hint: "Trova la spia Hanzo nascosta tra le lanterne della locanda a ovest", color: "#c084fc" };
      if (st === 1) return { tx: 18, ty: 6, label: "Fabbro Muramasa", hint: "Esamina la forgia di Muramasa a est (X:18, Y:6) per spezzare il sigillo Oni", color: "#f97316" };
      if (st === 2) return { tx: 12, ty: 12, label: "Monaco Benkei", hint: "Incontra il possente Benkei sul ponte ad arco del fiume!", color: "#eab308" };
      if (st === 3) return { tx: 21, ty: 12, label: "Guardie dell'Ombra", hint: "Affronta le guardie di Kurogane sotto il temporale notturno!", color: "#ef4444" };
      return { tx: 23, ty: 12, label: "Cancello del Tempio", hint: "Sali la gradinata di pietra verso il Tempio del Loto Nero (Capitolo 3)!", color: "#10b981" };
    }
    if (zid === "sh_tempio") {
      if (st === 0) return { tx: 12, ty: 5, label: "Statua del Buddha d'Ombra", hint: "Esamina la monumentale statua sacra al centro della navata", color: "#eab308" };
      if (st === 1) return { tx: 6, ty: 8, label: "Lettera di Tomoe", hint: "Raccogli la pergamena lasciata da Tomoe vicino alla grande campana bronzea", color: "#f43f5e" };
      if (st === 2) return { tx: 18, ty: 8, label: "Maestro Hayato", hint: "Pianifica con Hayato l'assalto disperato alla Fortezza d'Ossidiana", color: "#38bdf8" };
      if (st === 3) return { tx: 12, ty: 13, label: "Generale delle Ombre", hint: "Infrangi il blocco dei Samurai della Tempesta di Ferro al dojo del tempio!", color: "#ef4444" };
      return { tx: 23, ty: 5, label: "Ponte della Fortezza", hint: "Attraversa il fossato verso la Fortezza di Pietra d'Ossidiana (Capitolo 4)!", color: "#10b981" };
    }
    if (zid === "sh_fortezza") {
      if (st === 0) return { tx: 12, ty: 7, label: "Tomoe Prigioniera", hint: "Raggiungi Tomoe e suo fratello nella cella d'onore della fortezza", color: "#ef4444" };
      if (st === 1) return { tx: 6, ty: 4, label: "Katana del Dragone", hint: "Preleva la leggendaria Lama del Dragone Celestiale dall'armeria sacra", color: "#38bdf8" };
      if (st === 2) return { tx: 18, ty: 4, label: "Shogun Kurogane", hint: "Affronta lo Shogun Kurogane nella Sala del Trono sotto la Luna di Sangue!", color: "#eab308" };
      if (st === 3) return { tx: 12, ty: 12, label: "Arena dell'Eclisse", hint: "Scendi nell'Arena Finale dell'Eclisse Totale per la leggendaria Partita dei Draghi!", color: "#ef4444" };
      return { tx: 12, ty: 12, label: "Trionfo Supremo", hint: "Saga Completata! Il Regno delle Sette Lame è liberato e la Rondine splende eterna!", color: "#10b981" };
    }
    return null;
  }

  function drawSpiritSenseOverlay(g, W, H, cx, cy, zid) {
    if (spiritSenseActive && spiritSenseAlpha < 0.48) spiritSenseAlpha = Math.min(0.48, spiritSenseAlpha + 0.05);
    if (!spiritSenseActive && spiritSenseAlpha > 0) spiritSenseAlpha = Math.max(0, spiritSenseAlpha - 0.06);
    if (spiritSenseAlpha <= 0) return;

    g.save();
    // 1. Tonalità cremisi/spettrale da eclisse
    g.fillStyle = `rgba(185, 28, 28, ${spiritSenseAlpha * 0.28})`;
    g.fillRect(0, 0, W, H);

    // 2. Linea di respiro spirituale
    const breatheY = (Date.now() * 0.07) % H;
    g.strokeStyle = `rgba(248, 113, 113, ${spiritSenseAlpha * 0.75})`;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(0, breatheY);
    g.lineTo(W, breatheY);
    g.stroke();

    const target = getCurrentSpiritTarget(zid);
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

        // Scia dorata/rossa tratteggiata di petali
        if (cx !== undefined && cy !== undefined) {
          const psx = px - cx, psy = py - cy;
          const tsx = target.tx * TS - cx + 8, tsy = target.ty * TS - cy + 8;
          g.save();
          g.setLineDash([4, 4]);
          g.lineDashOffset = -(Date.now() * 0.02) % 8;
          g.strokeStyle = "rgba(252, 165, 165, 0.55)";
          g.lineWidth = 1.5;
          g.beginPath();
          g.moveTo(psx, psy);
          g.lineTo(tsx, tsy);
          g.stroke();
          g.restore();
        }
      }
    }

    // 3. Banner HUD in alto
    g.fillStyle = "rgba(15, 23, 42, 0.94)";
    g.fillRect(4, 3, W - 8, 24);
    g.strokeStyle = distTiles > 0 && distTiles <= 2 ? "#fde047" : "#ef4444";
    g.lineWidth = 1;
    g.strokeRect(4, 3, W - 8, 24);

    g.font = "bold 7px monospace";
    g.fillStyle = "#f87171";
    g.textAlign = "left";
    g.fillText(`⚔️ KATANA SENSE: ATTIVO [${distTiles > 0 ? distTiles + "m " + compass : "In meditazione"}] · Clicca Spirito per spegnere`, 8, 12);
    g.fillStyle = distTiles > 0 && distTiles <= 2 ? "#fde047" : "#ffffff";
    g.fillText(distTiles > 0 && distTiles <= 2 ? `🎯 OBIETTIVO RAGGIUNTO! Premi AZIONE su ${target.label}` : `🎯 SPIRITO: ${target ? target.hint : "Armonia spirituale raggiunta"}`, 8, 22);

    // 4. Mirino runico giapponese
    if (target && cx !== undefined && cy !== undefined) {
      const sx = target.tx * TS - cx + 8;
      const sy = target.ty * TS - cy + 8;
      const time = Date.now() * 0.005;
      if (sx >= -15 && sx <= W + 15 && sy >= -15 && sy <= H + 15) {
        const r = 12 + Math.sin(time * 3) * 3;
        g.strokeStyle = target.color || "#ef4444";
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
        g.fillStyle = "rgba(24, 24, 27, 0.9)";
        g.fillRect(sx - 38, sy - 23, 76, 10);
        g.strokeStyle = target.color || "#ef4444";
        g.strokeRect(sx - 38, sy - 23, 76, 10);
        g.font = "bold 6px sans-serif";
        g.fillStyle = target.color || "#f87171";
        g.textAlign = "center";
        g.fillText(`⚔️ ${target.label}`, sx, sy - 15);
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
      zone: "", blades: [], log: [], honor: clampI(o.honor, 0, 100, 100),
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
    m.blades = [...new Set(arr(o.blades).filter((x) => typeof x === "string"))].slice(0, 30);
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

  const addBlade = (id, name, desc, color) => {
    const m = mem();
    const entry = `${id}:::${name}:::${desc}:::${color || "#ef4444"}`;
    if (!m.blades.some((x) => x.startsWith(id + ":::"))) {
      m.blades.push(entry); save();
      sfxKatanaClash();
      if (api && api.trToast) api.trToast(`🗡️ Lama Sacra Risvegliata: ${name}!`);
      return true;
    }
    return false;
  };

  const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
  const bal = () => (api && typeof api.bal === "function" ? api.bal() : 0);
  const coinsGive = (n) => { if (api && typeof api.coinsGive === "function") api.coinsGive(n); };

  const reward = (id, r) => {
    const m = mem();
    if (m.rew[id]) return false;
    m.rew[id] = 1; save();
    if (r && r.coins) coinsGive(r.coins);
    return true;
  };

  // ------------------------------------------------------------------ Rendering di Sfondi Scenario & Decorazioni
  const BGS = {
    sh_dojo: (g, W, H, fr) => {
      // Dojo tradizionale giapponese con travi scure, paraventi shoji e tatami
      g.fillStyle = "#180d08"; g.fillRect(0, 0, W, H);
      // Pareti shoji in carta di riso illuminata
      g.fillStyle = "#fef3c7"; g.fillRect(10, 20, W - 20, 75);
      g.strokeStyle = "#451a03"; g.lineWidth = 1.5;
      for (let x = 10; x <= W - 10; x += 18) { g.beginPath(); g.moveTo(x, 20); g.lineTo(x, 95); g.stroke(); }
      for (let y = 20; y <= 95; y += 15) { g.beginPath(); g.moveTo(10, y); g.lineTo(W - 10, y); g.stroke(); }
      // Pavimento a tatami
      g.fillStyle = "#d97706"; g.fillRect(0, 95, W, H - 95);
      g.strokeStyle = "#78350f";
      for (let y = 105; y < H; y += 18) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      // Stendardi cerimoniali con kanji dell'Ala e del Vento
      g.fillStyle = "#991b1b"; g.fillRect(16, 25, 24, 60); g.fillRect(W - 40, 25, 24, 60);
      g.fillStyle = "#fde047"; g.font = "bold 10px sans-serif"; g.textAlign = "center";
      g.fillText("風", 28, 55); g.fillText("龍", W - 28, 55);
    },
    sh_tempio: (g, W, H, fr) => {
      // Tempio del Loto Nero con cielo crepuscolare e luna rossa dell'Eclisse
      const grad = g.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#450a0a"); grad.addColorStop(0.5, "#18181b"); grad.addColorStop(1, "#09090b");
      g.fillStyle = grad; g.fillRect(0, 0, W, H);
      // Luna Cremisi dell'Eclisse
      g.fillStyle = "#dc2626"; g.beginPath(); g.arc(W / 2, 42, 22, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#09090b"; g.beginPath(); g.arc(W / 2 + 5, 40, 19, 0, Math.PI * 2); g.fill();
      // Sagoma del tetto a pagoda
      g.fillStyle = "#0f172a";
      g.beginPath();
      g.moveTo(20, 110); g.lineTo(W / 2, 70); g.lineTo(W - 20, 110);
      g.lineTo(W - 40, 115); g.lineTo(W / 2, 85); g.lineTo(40, 115);
      g.closePath(); g.fill();
      // Lanterne di pietra e bracieri
      g.fillStyle = "#f59e0b";
      g.fillRect(32, 125, 8, 12); g.fillRect(W - 40, 125, 8, 12);
    },
    sh_arena_eclisse: (g, W, H, fr) => {
      // Arena monumentale sotto la pioggia di petali cremisi e cielo d'ossidiana
      g.fillStyle = "#09090b"; g.fillRect(0, 0, W, H);
      // Cerchio zen sacro a centrocampo
      g.strokeStyle = "rgba(239, 68, 68, 0.75)"; g.lineWidth = 2;
      g.beginPath(); g.arc(W / 2, H / 2 + 10, 48, 0, Math.PI * 2); g.stroke();
      // Petali fluttuanti
      const time = Date.now() * 0.001;
      g.fillStyle = "rgba(244, 63, 94, 0.75)";
      for (let i = 0; i < 20; i++) {
        const px = (W * 0.1 + i * 27 + Math.sin(time + i) * 16) % W;
        const py = (H * 0.1 + i * 19 + Math.cos(time + i * 0.5) * 22) % H;
        g.fillRect(px, py, 3, 2);
      }
    }
  };

  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) {
      safe(() => BGS[kind](g, W || 320, H || 200, frame || 0));
      if (spiritSenseActive || spiritSenseAlpha > 0) {
        drawSpiritSenseOverlay(g, W || 320, H || 200);
      }
      return true;
    }
    const res = typeof prevBg === "function" ? prevBg(kind, g, W, H, frame) : false;
    if (spiritSenseActive || spiritSenseAlpha > 0) {
      drawSpiritSenseOverlay(g, W || 320, H || 200);
    }
    return res;
  };

  // ------------------------------------------------------------------ Tilemap & Costruzione Zone 2D HD
  let GP = null;
  const ZX = { map: null, under: null, id: "" };
  const frNow = () => (api && typeof api.fr === "number" ? api.fr : Math.floor(Date.now() / 50));
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  const isFloor = (ch) => ",.c=spqm;g".includes(ch);

  function P(x, y, w, h, c) { GP.fillStyle = c; GP.fillRect(x, y, w, h); }

  function floorPaint(ch, sx, sy, tx, ty) {
    if (ch === "g") {
      // Giardino zen con sabbia rastrellata o erba dorata
      P(sx, sy, 16, 16, "#14281d");
      P(sx + 2, sy + 3, 2, 2, "#22c55e");
      P(sx + 8, sy + 10, 2, 2, "#15803d");
      P(sx + 12, sy + 4, 1, 2, "#166534");
      return;
    }
    if (ch === "q" || ch === "m") {
      // Pavimento tatami o legno scuro cerimoniale
      P(sx, sy, 16, 16, "#451a03");
      P(sx + 1, sy + 1, 14, 14, "#78350f");
      P(sx + 2, sy + 2, 12, 12, "#b45309");
      return;
    }
    // Pavimentazione di pietra d'ossidiana levigata con venature dorate
    P(sx, sy, 16, 16, "#18181b");
    P(sx + 1, sy + 1, 14, 14, "#27272a");
    if ((tx + ty) % 2 === 0) {
      P(sx + 3, sy + 3, 2, 2, "#3f3f46");
      P(sx + 11, sy + 11, 2, 2, "#3f3f46");
    }
  }

  function solidPaint(ch, sx, sy, tx, ty) {
    if (ch === "T") {
      // Grande Portale Torii vermiglio sacro
      P(sx, sy, 16, 16, "#991b1b");
      P(sx + 2, sy, 12, 4, "#dc2626");
      P(sx + 4, sy + 4, 8, 12, "#7f1d1d");
      P(sx + 6, sy + 6, 4, 10, "#b91c1c");
      return;
    }
    if (ch === "C") {
      // Albero di Ciliegio Giapponese (Sakura) con chioma rosa fiorita
      P(sx, sy, 16, 16, "#451a03");
      P(sx + 1, sy + 1, 14, 14, "#f43f5e");
      P(sx + 3, sy + 3, 10, 10, "#fb7185");
      P(sx + 6, sy + 6, 4, 4, "#fecdd3");
      return;
    }
    if (ch === "L") {
      // Lanterna di pietra giapponese (Toro) con candela sacra
      P(sx + 3, sy + 2, 10, 14, "#52525b");
      P(sx + 5, sy + 5, 6, 6, "#f59e0b");
      P(sx + 6, sy + 6, 4, 4, "#fef08a");
      return;
    }
    if (ch === "B") {
      // Ponte ad arco di legno laccato rosso
      P(sx, sy, 16, 16, "#991b1b");
      P(sx + 1, sy + 4, 14, 8, "#b91c1c");
      P(sx + 2, sy + 2, 12, 2, "#fca5a5");
      return;
    }
    if (ch === "M") {
      // Statua del Dragone di Giada e Ossidiana
      P(sx + 2, sy + 1, 12, 15, "#065f46");
      P(sx + 4, sy + 3, 8, 11, "#10b981");
      P(sx + 6, sy + 5, 4, 4, "#a7f3d0");
      return;
    }
    // Muro a pagoda di pietra scura del castello feudale
    P(sx, sy, 16, 16, "#09090b");
    P(sx + 1, sy + 1, 14, 14, "#18181b");
    P(sx + 2, sy + 2, 12, 12, "#27272a");
  }

  function dd(cx, cy) {
    return {
      draw(ch, sx, sy, tx, ty) {
        if (isFloor(ch)) floorPaint(ch, sx, sy, tx, ty);
        else solidPaint(ch, sx, sy, tx, ty);
      }
    };
  }

  // ------------------------------------------------------------------ Gestione Capitoli & Zone
  const CHAPTERS = {};
  const ZONES = {};

  function registerZone(chNum, zid, spec) {
    const Z = Object.assign({ id: zid, act: {}, npcs: [] }, spec);
    ZONES[zid] = { ch: chNum, Z, spec };

    Z.build = function (Ls) {
      if (spec.build) spec.build(Ls);
      // Garantisce mappa navigabile e coerente
      const m = mem();
    };

    Z.top = function (cx, cy) {
      if (spec.top) spec.top(cx, cy, dd(cx, cy));
      const cv = document.getElementById("cv");
      if (cv) drawSpiritSenseOverlay(cv.getContext("2d"), cv.width, cv.height, cx, cy, zid);
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
      // 4. Default contestualizzati e sicuri per Shogun Eclipse (MAI ricadere nei default del Borgo marino):
      if (ch === "B") {
        if (spiritSenseActive) {
          sfxSpiritBell();
          say([
            ["voce", "«Il Ponte di Legno Vermiglio risuona dell'eco dei passi dei guerrieri del passato. La via per il tempio è consacrata.»", zid]
          ]);
        } else {
          say([["voce", "Un antico ponte di legno laccato attraversa lo specchio d'acqua. I petali di ciliegio vi galleggiano leggeri.", zid]]);
        }
        return true;
      }
      if (ch === "M") {
        sfxDragonRoar();
        say([
          ["voce", "La monumentale Statua del Dragone di Giada emana un calore sacro. Gli occhi di rubino sembrano osservare la tua traiettoria di tiro.", zid]
        ]);
        return true;
      }
      if (ch === "T") {
        sfxCherryBlossom();
        say([["voce", "Un imponente Torii di legno vermiglio. Separa il regno degli uomini da quello dei draghi celesti.", zid]]);
        return true;
      }
      if (ch === "L") {
        sfxCherryBlossom();
        say([["voce", "Una lanterna di pietra scolpita a mano. La fiamma interna brucia senza fumo grazie agli spiriti del fuoco.", zid]]);
        return true;
      }
      if (ch === "C") {
        sfxCherryBlossom();
        say([["voce", "I rami fioriti del ciliegio centenario lasciano cadere una pioggia di petali rosa al soffio della brezza.", zid]]);
        return true;
      }
      return false;
    };

    if (api && api.TRZ) {
      api.TRZ[zid] = Z;
    }
  }

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

  function castHero() {
    if (!api || !api.CAST) return;
    const h = hero();
    if (h) {
      api.CAST.hero = {
        name: h.name, tag: "samurai", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye || "#ef4444",
        bg: ["#991b1b", "#fde047"], shirt: "#7f1d1d", num: String(h.num)
      };
    }
  }

  function say(dialogs, cb) {
    if (!api || !api.trSay) return cb && cb();
    castHero();
    const h = hero() || { name: "Campione", shotName: "COLPO DEL DRAGO" };
    const processed = (dialogs || []).map(([who, txt, bg]) => {
      const clean = String(txt || "")
        .replace(/\{n\}/g, h.name)
        .replace(/\{tiro\}/g, h.shotName || "COLPO DEL DRAGO");
      return api.L(who, clean, bg);
    });
    api.trSay(processed, cb);
  }

  function ask(who, q, opts) {
    if (!api || !api.trAsk) return;
    castHero();
    const h = hero() || { name: "Campione", shotName: "COLPO DEL DRAGO" };
    const cleanQ = String(q || "")
      .replace(/\{n\}/g, h.name)
      .replace(/\{tiro\}/g, h.shotName || "COLPO DEL DRAGO");
    api.trAsk(who, cleanQ, opts);
  }

  function done() {
    if (api && api.trResume) api.trResume();
  }

  function go(zid, tx, ty) {
    if (!api || !api.trGo) return;
    castHero();
    mem().zone = zid; save();
    api.trGo(zid, tx, ty);
    ensurePadControls();
  }

  function enterZone(zid, tx, ty) {
    go(zid, tx, ty);
  }

  function finishChapter(n, reason) {
    const m = mem();
    m.done[n] = reason || "completato";
    if (m.ch <= n) m.ch = n + 1;
    save();
  }

  // Partite Tematiche Personalizzate per Shogun Eclipse
  function playMatch(cfg) {
    if (!api || !api.match) return;
    const h = hero() || { name: "Campione", num: 9, shotName: "COLPO DEL DRAGO", shot: "saetta" };
    castHero();

    const homeSquad = [
      { name: h.name, skin: h.skin || "#f2c9a0", hair: h.hair || "#2b1d14", spd: 5.2 },
      { name: "Lady Tomoe", skin: "#fed7aa", hair: "#ef4444", spd: 5.4 },
      { name: "Maestro Hayato", skin: "#e2e8f0", hair: "#94a3b8", spd: 4.8 }
    ];

    const matchCfg = {
      id: cfg.id || "sh_match",
      chap: cfg.chap || "Shogun Eclipse · Duello delle Lame",
      intro: cfg.intro || "I Samurai si schierano nel cerchio sacro del dojo! Impugna la lama del calcio!",
      mate: cfg.mate || "Tomoe",
      squad: cfg.squad || ["Tomoe", "Hayato", "Benkei"],
      homeKit: ["#991b1b", "#fde047"],
      alt: "hd,cage", // Disponibile in tutte e tre le modalità (A Turni, Action Soccer HD, Gabbia del Molo)!
      cageTarget: 5,
      cageField: "trabucco",
      oppNames: cfg.oppNames || ["Shogun Kurogane", "Guardia Mascherata 1", "Guardia Mascherata 2", "Arciere d'Ombra", "Colosso d'Ossidiana"],
      team: cfg.team || ((t, st) => ({ name: "Samurai dell'Eclisse", color: "#18181b", atk: 24, def: 25, vel: 23 })),
      onDone: (res) => {
        const win = !!res.win;
        if (win) { mem().wins++; sfxKatanaClash(); sfxTaikoDrum(); }
        else { mem().losses++; sfxSpiritBell(); }
        save();
        if (typeof cfg.done === "function") cfg.done({ ...res, win });
      }
    };

    if (api.matchPick) api.matchPick(matchCfg);
    else api.match(matchCfg);
  }

  const XTOOLS = {
    T: { TS }, F,
    stepOf, setStep, note, addBlade,
    reward, coinsGive, bal, hero, castHero, say, ask, done, go, enterZone, playMatch, finishChapter,
    sfxTaikoDrum, sfxKatanaClash, sfxSpiritBell, sfxDragonRoar, sfxCherryBlossom,
    esc,
    cos: (id, def) => { if (api && api.COSM) api.COSM[id] = def; else COS_Q.push([id, def]); },
    cast: (id, def, bio) => { if (api && api.CAST) { api.CAST[id] = def; if (bio && api.BIO) api.BIO[id] = bio; } else CAST_Q.push([id, def, bio]); },
  };

  // ------------------------------------------------------------------ UI del Menu Principale & Capitoli
  function openMain(opts) {
    EXIT = (opts && opts.onExit) || EXIT || window.title;
    const a = window.__borgoApi;
    if (!a) return;
    api = a;
    castHero();

    const m = mem(), h = hero();
    const c = activeChapter();

    const bladesRows = m.blades.length
      ? m.blades.map((bl) => {
          const parts = bl.split(":::");
          return `• <b style="color:${parts[3] || "#ef4444"}">${esc(parts[1])}</b>: <span style="color:var(--dim)">${esc(parts[2])}</span>`;
        }).join("<br>")
      : `<span style="color:var(--dim)">Nessuna lama risvegliata ancora. Completa le prove dello Shogunato.</span>`;

    const cChoice = F.get("scelta_cap2") ? (F.get("scelta_cap2") === "salva_discepoli" ? "Discepoli Liberati" : "Lama Rubata") : "In attesa";
    const cFinal = F.get("finale_shogun") ? (F.get("finale_shogun") === "purificazione" ? "Purificazione dell'Eclisse" : "Nuovo Guardiano Celeste") : "In attesa";

    const html = `<b>${esc(h ? h.name : "Campione")}</b> · n. ${esc(h ? h.num : 9)} (Maestro delle Sette Lame)<br>
<span style="color:var(--dim)">Tecnica Suprema: «${esc((h && h.shotName) || "COLPO DEL DRAGO")}»</span><br><br>
<b>Lame Sacre dell'Eclisse Acquisite</b><br>${bladesRows}<br><br>
<b>Scelte d'Onore & Destino</b><br>
• <b>Bivio del Fabbro (Cap.2):</b> <span style="color:var(--dim)">${cChoice}</span><br>
• <b>Epilogo Supremo (Cap.4):</b> <span style="color:var(--dim)">${cFinal}</span><br><br>
<span style="color:var(--dim)">Duelli Vinti: ${m.wins} · Duelli Persi: ${m.losses} · Onore: ${m.honor}/100</span>`;

    const btns = [
      {
        label: "⚔️ Entra nel Regno delle Sette Lame",
        sub: c ? `Capitolo ${c.n} · ${c.title}` : "Inizia l'avventura feudale",
        cls: "hot",
        fn: () => continueStory()
      },
      {
        label: "📜 Selezione Capitoli",
        sub: `Rigioca uno dei 4 capitoli dell'Eclisse`,
        fn: () => chaptersList()
      },
      {
        label: "👁️ Spiegazione: Katana Sense",
        sub: "Come usare la Visione dello Spirito e trovare le lame",
        fn: () => explainKatanaSense()
      },
      {
        label: "◂ Torna al Menu",
        fn: () => { if (typeof EXIT === "function") EXIT(); else if (window.title) window.title(); }
      }
    ];

    a.scene("sh_dojo", "hero", html, btns, "Shogun Eclipse · Il Regno delle Sette Lame");
  }

  function explainKatanaSense() {
    api.scene("sh_tempio", "hero", `<b>La Visione dello Spirito (Katana Sense)</b><br><br>
Durante l'esplorazione del Regno delle Sette Lame, tocca il pulsante <b>⚔️ Spirito</b> sui comandi a schermo per attivare la vista spirituale.<br><br>
• Rivela la posizione esatta degli obiettivi di ogni capitolo con bussola e mirino runico.<br>
• Mostra le scie invisibili lasciate dalle katane leggendarie.<br>
• Rende visibili i sigilli antichi sulle statue dei draghi e sulle lanterne di pietra.<br><br>
<span style="color:var(--dim)">Usala ogni volta che ti senti smarrito nelle province feudali!</span>`, [
      { label: "◂ Ho capito", cls: "hot", fn: () => openMain() }
    ], "Guida Katana Sense");
  }

  function continueStory() {
    const c = activeChapter();
    if (!c) return;
    const m = mem();
    const curZ = (m.zone && ZONES[m.zone] && ZONES[m.zone].ch === c.n) ? m.zone : (c.start || "sh_giardino");
    const tr = api.trRec();
    if (!tr.pos[curZ]) {
      tr.pos[curZ] = [8 * TS, 8 * TS];
    }
    go(curZ, tr.pos[curZ][0] / TS, tr.pos[curZ][1] / TS);
  }

  function chaptersList() {
    const m = mem();
    const opts = Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).map((num) => {
      const c = CHAPTERS[num];
      const isDone = !!m.done[num];
      const isCur = m.ch === num;
      return {
        label: `Capitolo ${num} · ${c.title}`,
        sub: isDone ? "✓ Completato (Rigiocabile)" : isCur ? "▶ In corso ora" : "🔒 Da sbloccare",
        cls: isCur ? "hot" : "",
        fn: () => {
          m.ch = num; save();
          go(c.start || "sh_giardino", 8, 8);
        }
      };
    });
    opts.push({ label: "◂ Indietro", fn: () => openMain() });
    api.scene("sh_dojo", "hero", `<b>Selezione Capitoli di Shogun Eclipse</b><br><span style="color:var(--dim)">Scegli quale momento della leggenda vuoi vivere.</span>`, opts, "Capitoli");
  }

  // ------------------------------------------------------------------ Setup Tasto Uscita Rapida
  function setupExitButton() {
    if (document.getElementById("shExit")) return;
    const st = document.createElement("style");
    st.textContent = `
      #shExit {
        position: fixed; left: 8px; bottom: 8px; z-index: 60; display: none;
        min-height: 36px; padding: 6px 14px; border-radius: 10px;
        border: 1px solid rgba(239, 68, 68, 0.7); background: rgba(127, 29, 29, 0.9);
        color: #fef2f2; font: 700 13px/1.1 system-ui, sans-serif; letter-spacing: .2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6); cursor: pointer;
      }
      #shExit.on { display: block; }
      #shExit:active { transform: translateY(1px); }
    `;
    document.head.appendChild(st);
    const btn = document.createElement("button");
    btn.id = "shExit"; btn.type = "button";
    btn.textContent = "✕ Esci da Shogun Eclipse";
    btn.onclick = () => {
      if (zoneRec()) {
        const curZid = api.trZone();
        const tr = api.trRec();
        if (tr && tr.pos) tr.pos[curZid] = [Math.round(api.TW ? api.TW.x : 128), Math.round(api.TW ? api.TW.y : 128)];
        document.body.classList.remove("borgo");
        openMain();
      }
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
    CAST_Q.splice(0).forEach(([id, c, bio]) => { if (a.CAST && !a.CAST[id]) a.CAST[id] = Object.assign({ tag: "", eye: "#ef4444", skin: "#fed7aa" }, c); if (bio && a.BIO && !a.BIO[id]) a.BIO[id] = bio; });
    COS_Q.splice(0).forEach(([id, d]) => { if (a.COSM && !a.COSM[id]) a.COSM[id] = d; });
    installHooks();
    PENDING.splice(0).forEach(registerChapterZones);
    setupExitButton();
  }

  // ==========================================================================
  // CAPITOLO 1 · IL RISVEGLIO SOTTO I CILIEGI CREMISI
  // ==========================================================================
  addChapter(function (X) {
    const { F, say, ask, done, go, note, setStep, reward, hero, addBlade, sfxTaikoDrum, sfxKatanaClash, sfxSpiritBell, sfxCherryBlossom } = X;
    const N = 1, S = () => X.stepOf(N);

    // Cast Personaggi Capitolo 1
    X.cast("sh_tomoe", {
      name: "Lady Tomoe", tag: "spadaccina", hair: "#ef4444", style: "ponytail", skin: "#fed7aa", eye: "#dc2626",
      bg: ["#7f1d1d", "#f87171"], shirt: "#991b1b"
    }, "Maestra spadaccina del Tempio del Loto. Ha consacrato la vita alla protezione del Fuoco Sacro. Dietro la sua maschera d'acciaio nasconde un segreto straziante legato al tiranno Kurogane.");

    X.cast("sh_hayato", {
      name: "Maestro Hayato", tag: "ronin", hair: "#94a3b8", style: "messy", skin: "#f1f5f9", eye: "#0284c7",
      bg: ["#1e293b", "#64748b"], shirt: "#0f172a"
    }, "Antico campione del calcio imperiale ora ritiratosi come ronin errante. Cammina con un bastone di bambù che nasconde una lama d'aria: «Nel calcio feudale, il pallone non mente mai. È l'anima stessa del guerriero.»");

    X.cast("sh_ronin_boss", {
      name: "Kage-Maru", tag: "ronin_ombra", hair: "#18181b", style: "spiky", skin: "#cbd5e1", eye: "#f59e0b",
      bg: ["#09090b", "#d97706"], shirt: "#27272a"
    }, "Caposquadra dei Ronin della Nebbia al soldo dello Shogun. Tira fendenti d'aria compressa che piegano i pali della porta.");

    // Accessorio sbloccabile Capitolo 1
    X.cos("sh_fascia_ciliegio", { kind: "acc", label: "Fascia dei Ciliegi Cremisi", val: "#dc2626", from: "Completa il Capitolo 1 di Shogun Eclipse" });

    return {
      n: 1,
      title: "Il Risveglio sotto i Ciliegi Cremisi",
      sub: "Il Santuario di Kage-no-Mori & Il Dojo dei Ronin",
      start: "sh_giardino",
      zones: {
        sh_giardino: {
          name: "Santuario di Kage-no-Mori · Giardino dei Ciliegi",
          short: "Giardino dei Ciliegi",
          sub: "Torii vermigli, petali cadenti e lo spirito antico del calcio feudale",
          isCustomSaga: true,
          act: {
            "8,7": "Parla con il Maestro Hayato",
            "18,4": "Parla con Lady Tomoe",
            "12,12": "Esamina l'Altare del Drago",
            "22,8": "Sfida Kage-Maru dei Ronin",
            "23,8": "Varca il Torii verso il Borgo dei Samurai",
            T: "Esamina il Torii Sacro",
            C: "Ammira il Ciliegio Centenario",
            L: "Osserva la Lanterna di Pietra",
            B: "Attraversa il Ponte di Legno Rosso",
            M: "Ammira la Statua del Dragone di Giada"
          },
          build(Ls) {
            // Mappa 25x15
            for (let y = 0; y < 15; y++) {
              for (let x = 0; x < 25; x++) {
                if (x === 0 || x === 24 || y === 0 || y === 14) Ls.put(x, y, "w"); // Muro
                else if (y >= 5 && y <= 9 && x >= 10 && x <= 14) Ls.put(x, y, "q"); // Tatami centrale
                else if (x >= 8 && x <= 16 && y >= 2 && y <= 4) Ls.put(x, y, "g"); // Erba zen
                else Ls.put(x, y, ","); // Pietra
              }
            }
            // Torii e decorazioni
            Ls.put(2, 2, "T"); Ls.put(2, 12, "T"); Ls.put(23, 8, "T");
            Ls.put(4, 3, "C"); Ls.put(20, 3, "C"); Ls.put(4, 11, "C"); Ls.put(20, 11, "C");
            Ls.put(10, 4, "L"); Ls.put(14, 4, "L"); Ls.put(10, 10, "L"); Ls.put(14, 10, "L");
            Ls.put(12, 12, "M"); // Statua del Drago
            Ls.put(16, 8, "B"); // Ponte di legno
          },
          npcs: [
            { id: "sh_hayato", x: 8 * TS, y: 7 * TS, name: "Maestro Hayato", dir: "down" },
            { id: "sh_tomoe", x: 18 * TS, y: 4 * TS, name: "Lady Tomoe", dir: "left" },
            { id: "sh_ronin_boss", x: 22 * TS, y: 8 * TS, name: "Kage-Maru", dir: "left" }
          ]
        }
      },
      talk: {
        sh_hayato: () => {
          sfxCherryBlossom();
          if (S() === 0) {
            say([
              ["sh_hayato", "«Apri gli occhi, giovane guerriero. Il profumo dei ciliegi in fiore ti ha richiamato dal sonno profondo.»"],
              ["hero", "«Dove... dove mi trovo? Che ne è stato della mia squadra e della Lanterna?»"],
              ["sh_hayato", "«Sei nel dominio di Kage-no-Mori. Lo Shogun Kurogane ha eclissato il sole e imprigionato la sacra Rondine in un'armatura di metallo nero. Nessuno può più giocare al pallone per gioia... solo per obbedienza.»"],
              ["hero", "«Un calcio senza gioia non è calcio! Devo fermarlo.»"],
              ["sh_hayato", "«Parole degne. Va' da Lady Tomoe al Padiglione del Tè a nord-est. Ella custodisce il segreto della Katana del Vento Lunare.»"]
            ], () => {
              setStep(N, 1);
              note("Ho incontrato il Maestro Hayato. Lo Shogun Kurogane ha sigillato il calcio libero sotto un'eclisse eterna. Devo parlare con Lady Tomoe.");
              done();
            });
          } else {
            say([["sh_hayato", "«Lady Tomoe ti aspetta al Padiglione del Tè a nord-est (X:18, Y:4). Concentra il tuo spirito, Campione.»"]], done);
          }
        },
        sh_tomoe: () => {
          if (S() < 1) {
            say([["sh_tomoe", "«Prima devi purificare la mente con il Maestro Hayato sotto il grande ciliegio.»"]], done);
            return;
          }
          if (S() === 1) {
            sfxKatanaClash();
            say([
              ["sh_tomoe", "«Ti stavo osservando. C'è una fiamma indomita nei tuoi passi, {n}.»"],
              ["hero", "«Lady Tomoe, Hayato mi ha detto che puoi aiutarmi a risvegliare il potere della Rondine contro lo Shogun.»"],
              ["sh_tomoe", "«Lo Shogun ha diecimila guardie e una lama che spezza il metallo. Per superare le sue mura hai bisogno delle Sette Lame Spirituali. La prima giace addormentata nell'Altare del Drago al centro di questo giardino.»"],
              ["sh_tomoe", "«Attiva la tua Visione dello Spirito (Katana Sense), tocca la statua e risveglia la Katana del Vento!»"]
            ], () => {
              setStep(N, 2);
              note("Lady Tomoe mi ha incaricato di esaminare la Statua del Drago (X:12, Y:12) per risvegliare la prima Lama Sacra.");
              done();
            });
          } else {
            say([["sh_tomoe", "«Esamina la Statua del Drago (X:12, Y:12) al centro del santuario.»"]], done);
          }
        },
        sh_ronin_boss: () => {
          if (S() < 3) {
            say([["sh_ronin_boss", "«Nessuno passa da questo Torii senza il consenso dello Shogun! Torna indietro, pivello.»"]], done);
            return;
          }
          if (S() === 3) {
            sfxTaikoDrum();
            ask("sh_ronin_boss", "«Pensi che impugnare una lama ti renda un samurai? Dimostralo sul campo di sabbia del dojo! Sei pronto a essere spazzato via dai Ronin della Nebbia?»", [
              {
                label: "⚔️ Accetta il Duello dei Ronin!",
                cls: "hot",
                fn: () => {
                  X.playMatch({
                    id: "sh_match_ch1",
                    chap: "Capitolo 1 · Il Duello del Dojo dei Ronin",
                    intro: "I Ronin della Nebbia schierano la formazione del Serpente d'Ombra! Guida la squadra con Tomoe e Hayato!",
                    mate: "Tomoe",
                    squad: ["Lady Tomoe", "Maestro Hayato"],
                    oppNames: ["Kage-Maru", "Ronin della Nebbia 1", "Ronin della Nebbia 2", "Sentinella Lancia", "Guardiano Scudo"],
                    team: (t, st) => ({ name: "Ronin della Nebbia", color: "#27272a", atk: 19, def: 20, vel: 21 }),
                    done: (r) => {
                      if (r.win) {
                        sfxKatanaClash();
                        sfxCherryBlossom();
                        say([
                          ["sh_ronin_boss", "«C-cosa?! Quel tiro a fendente rotante... Ha tagliato in due la nostra barriera di fumo!»"],
                          ["sh_tomoe", "«Un gol magistrale, {n}! Il Torii del Borgo è ora spalancato.»"],
                          ["sh_hayato", "«Hai dimostrato il vero valore del guerriero. Avanza verso il Borgo dei Samurai: la tua leggenda è appena iniziata.»"]
                        ], () => {
                          reward("sh_ch1_rew", { coins: 150 });
                          finishChapter(1, "ronin_sconfitti");
                          setStep(N, 4);
                          note("Ho sconfitto Kage-Maru nel dojo! Il Capitolo 1 è completato: il Torii per il Borgo dei Samurai è aperto.");
                          ask("hero", "Il Torii per il Borgo dei Samurai è spalancato! Vuoi avanzare subito al Capitolo 2?", [
                            {
                              label: "🏮 Avanza al Borgo dei Samurai (Capitolo 2)",
                              cls: "hot",
                              fn: () => go("sh_villaggio", 2, 7)
                            },
                            { label: "Rimani nel Giardino", fn: done }
                          ]);
                        });
                      } else {
                        say([["sh_ronin_boss", "«I tuoi fendenti sono ancora troppo deboli! Riposa sotto i ciliegi e riprova quando avrai più concentrazione.»"]], done);
                      }
                    }
                  });
                }
              },
              { label: "Mi preparo ancora un momento", fn: done }
            ]);
          } else {
            say([["sh_ronin_boss", "«Il varco è aperto per te, Campione. Lo Shogun ti attende nelle province superiori.»"]], done);
          }
        }
      },
      obj: {
        "sh_giardino:12,12": () => {
          if (S() === 2) {
            sfxDragonRoar();
            sfxKatanaClash();
            addBlade("lama_vento", "Katana del Vento Lunare", "Lama affilata d'argento che genera raffiche di vento ad ogni dribbling.", "#38bdf8");
            say([
              ["voce", "Dalla bocca della statua del dragone erompe un fascio di luce azzurrina che si condensa in una magnifica katana luminescente!", "sh_giardino"],
              ["hero", "«La Katana del Vento Lunare... Sento la potenza dell'aria che vibra sotto i miei piedi!»"],
              ["sh_tomoe", "«Magnifico! Ora affronta Kage-Maru al Torii a est (X:22, Y:8) e apri la via per il borgo.»"]
            ], () => {
              setStep(N, 3);
              note("Ho risvegliato la Katana del Vento Lunare! Ora posso sfidare Kage-Maru a duello.");
              done();
            });
          } else {
            sfxSpiritBell();
            say([["voce", "La maestosa statua del dragone di giada veglia sul santuario.", "sh_giardino"]], done);
          }
        },
        "sh_giardino:23,8": () => {
          if (S() >= 4 || mem().done[1]) {
            go("sh_villaggio", 2, 7);
          } else {
            say([["voce", "Il grande Torii è presidiato dai Ronin della Nebbia. Devi prima sconfiggere Kage-Maru in partita per passare.", "sh_giardino"]], done);
          }
        }
      }
    };
  });

  // ==========================================================================
  // CAPITOLO 2 · LE MASCHERE ONI & L'INGANNO DEL FABBRO
  // ==========================================================================
  addChapter(function (X) {
    const { F, say, ask, done, go, note, setStep, reward, hero, addBlade, sfxTaikoDrum, sfxKatanaClash, sfxSpiritBell } = X;
    const N = 2, S = () => X.stepOf(N);

    // Cast Personaggi Capitolo 2
    X.cast("sh_hanzo", {
      name: "Kunoichi Hanzo", tag: "kunoichi", hair: "#38bdf8", style: "bob", skin: "#e0f2fe", eye: "#0284c7",
      bg: ["#082f49", "#38bdf8"], shirt: "#0c4a6e"
    }, "Spia leggendaria del clan delle ombre. Si muove silenziosa come un battito d'ali di rondine ed è capace di rubare la palla prima ancora che l'avversario tocchi terra.");

    X.cast("sh_muramasa", {
      name: "Mastro Muramasa", tag: "fabbro", hair: "#78350f", style: "buzz", skin: "#fed7aa", eye: "#d97706",
      bg: ["#451a03", "#f59e0b"], shirt: "#7c2d12"
    }, "Il più abile forgiatore del regno. Lo Shogun lo tiene sotto ricatto per forgiare maschere di ferro che sopprimono la personalità e il talento dei giovani calciatori.");

    X.cast("sh_benkei", {
      name: "Monaco Benkei", tag: "monaco", hair: "#1c1917", style: "bald", skin: "#fcd34d", eye: "#eab308",
      bg: ["#78350f", "#fef08a"], shirt: "#854d0e"
    }, "Guerriero colossale che difende il ponte sul fiume con una naginata cerimoniale. Ha una lealtà incrollabile verso chi dimostra vero onore.");

    return {
      n: 2,
      title: "Le Maschere Oni & L'Inganno del Fabbro",
      sub: "Il Borgo dei Samurai & La Forgia Maledetta",
      start: "sh_villaggio",
      zones: {
        sh_villaggio: {
          name: "Il Borgo dei Samurai · Quartiere delle Lanterne",
          short: "Borgo dei Samurai",
          sub: "Botteghe di fabbri, lanterne di carta rossa, ponti arcuati e guardie d'élite",
          isCustomSaga: true,
          act: {
            "6,6": "Parla con la Kunoichi Hanzo",
            "18,6": "Interroga Mastro Muramasa alla forgia",
            "12,12": "Parla con il Monaco Benkei sul ponte",
            "21,12": "Affronta il Capitano dell'Ombra",
            "23,12": "Sali la gradinata verso il Tempio del Loto Nero",
            "1,7": "Torna al Giardino dei Ciliegi",
            T: "Esamina l'insegna della bottega",
            L: "Osserva la lanterna di carta",
            B: "Attraversa il ponte arcuato",
            M: "Ammira il braciere sacro"
          },
          build(Ls) {
            for (let y = 0; y < 15; y++) {
              for (let x = 0; x < 25; x++) {
                if (x === 0 || x === 24 || y === 0 || y === 14) Ls.put(x, y, "w");
                else if (y === 10 || y === 11) Ls.put(x, y, "g"); // Fiume/canale d'acqua
                else if (x >= 4 && x <= 8 && y >= 3 && y <= 6) Ls.put(x, y, "q"); // Locanda Hanzo
                else if (x >= 16 && x <= 20 && y >= 3 && y <= 6) Ls.put(x, y, "q"); // Forgia Muramasa
                else Ls.put(x, y, ",");
              }
            }
            Ls.put(1, 7, "T"); Ls.put(23, 12, "T");
            Ls.put(12, 10, "B"); Ls.put(12, 11, "B"); // Ponte sul fiume
            Ls.put(5, 7, "L"); Ls.put(9, 7, "L"); Ls.put(15, 7, "L"); Ls.put(19, 7, "L");
            Ls.put(18, 6, "M"); // Braciere della forgia
          },
          npcs: [
            { id: "sh_hanzo", x: 6 * TS, y: 6 * TS, name: "Kunoichi Hanzo", dir: "down" },
            { id: "sh_muramasa", x: 18 * TS, y: 6 * TS, name: "Mastro Muramasa", dir: "down" },
            { id: "sh_benkei", x: 12 * TS, y: 12 * TS, name: "Monaco Benkei", dir: "up" }
          ]
        }
      },
      talk: {
        sh_hanzo: () => {
          sfxCherryBlossom();
          if (S() === 0) {
            say([
              ["sh_hanzo", "«Pst! Abbassa la voce, Campione. Le guardie di Kurogane hanno orecchie in ogni vicolo.»"],
              ["hero", "«Chi sei? E cosa succede in questo villaggio?»"],
              ["sh_hanzo", "«Sono Hanzo. Ho spiato il fabbro Muramasa a est (X:18, Y:6). Sta completando l'armatura d'ebano dello Shogun usando le anime dei ragazzi del borgo. Se spezziamo il suo forno cerimoniale, libereremo la seconda lama: la Katana del Tuono!»"],
              ["hero", "«Vado subito alla forgia a parlargli.»"]
            ], () => {
              setStep(N, 1);
              note("Ho incontrato la Kunoichi Hanzo. Devo confrontarmi con Mastro Muramasa alla forgia per scoprire la verità sulle Maschere Oni.");
              done();
            });
          } else {
            say([["sh_hanzo", "«Raggiungi Mastro Muramasa alla forgia a est (X:18, Y:6). Fai attenzione ai tizzoni ardenti!»"]], done);
          }
        },
        sh_muramasa: () => {
          if (S() < 1) {
            say([["sh_muramasa", "«Non ho tempo per i forestieri! Il ferro dello Shogun attende il martello.»"]], done);
            return;
          }
          if (S() === 1) {
            sfxKatanaClash();
            say([
              ["sh_muramasa", "«Cosa volete da me?! Lo Shogun tiene in ostaggio mia figlia nel Tempio del Loto. Se non forgio le maschere per i suoi attaccanti, non la rivedrò mai più!»"],
              ["hero", "«Muramasa, ti do la mia parola d'onore: salveremo tua figlia. Ma non puoi continuare ad alimentare questa tirannia.»"],
              ["sh_muramasa", "«...Vedo negli occhi il fuoco dei grandi maestri di un tempo. Ecco, prendi questa: è la Katana del Tuono Cremisi, nascosta nella cenere del focolare!»"]
            ], () => {
              addBlade("lama_tuono", "Katana del Tuono Cremisi", "Lama crepitante d'elettricità che conferisce una potenza devastante ai tiri dalla distanza.", "#f59e0b");
              ask("sh_muramasa", "«Come dobbiamo agire ora per salvare il villaggio? Scegli la via d'onore:»", [
                {
                  label: "🛡️ Proteggi e porta in salvo i discepoli del borgo",
                  fn: () => {
                    F.set("scelta_cap2", "salva_discepoli");
                    say([
                      ["sh_muramasa", "«Un cuore nobile! Radunerò i ragazzi e li nasconderò nelle caverne di bambù.»"],
                      ["hero", "«Ora vado al ponte a convincere Benkei a farci passare.»"]
                    ], () => {
                      setStep(N, 2);
                      note("Scelta morale compiuta: ho salvato i discepoli del borgo. Mastro Muramasa mi ha donato la Katana del Tuono.");
                      done();
                    });
                  }
                },
                {
                  label: "⚔️ Concentrati sull'assalto diretto alle guardie dello Shogun",
                  fn: () => {
                    F.set("scelta_cap2", "assalto_guardie");
                    say([
                      ["sh_muramasa", "«La via del guerriero implacabile! Spezza le lance dello Shogun senza pietà!»"],
                      ["hero", "«Ora vado al ponte a sfidare Benkei per il controllo del varco.»"]
                    ], () => {
                      setStep(N, 2);
                      note("Scelta morale compiuta: ho scelto l'assalto diretto per stroncare il potere dello Shogun.");
                      done();
                    });
                  }
                }
              ]);
            });
          } else {
            say([["sh_muramasa", "«Che la Katana del Tuono guidi il tuo tiro, Campione!»"]], done);
          }
        },
        sh_benkei: () => {
          if (S() < 2) {
            say([["sh_benkei", "«Questo ponte è invalicabile per chi non ha il permesso dello Shogunato!»"]], done);
            return;
          }
          if (S() === 2) {
            sfxSpiritBell();
            say([
              ["sh_benkei", "«Ti ho osservato, straniero. Hai la fiamma del Tuono e il rispetto del popolo.»"],
              ["hero", "«Benkei, non vogliamo combattere contro di te. Vogliamo liberare il regno dall'eclisse e ridare il calcio ai giovani.»"],
              ["sh_benkei", "«Un monaco riconosce un animo puro. Ma dall'altra parte del fiume c'è la guarnigione d'élite delle Maschere Oni. Unirò la mia forza alla tua in partita: sconfiggiamoli insieme!»"]
            ], () => {
              setStep(N, 3);
              note("Benkei ha riconosciuto il mio onore e si è unito alla squadra per sfidare le Maschere Oni.");
              done();
            });
          } else if (S() === 3) {
            sfxTaikoDrum();
            ask("sh_benkei", "«La guarnigione delle Maschere Oni ci aspetta sotto la pioggia battente! Scendiamo in campo?»", [
              {
                label: "⚽ Sfida la Guarnigione delle Maschere Oni!",
                cls: "hot",
                fn: () => {
                  X.playMatch({
                    id: "sh_match_ch2",
                    chap: "Capitolo 2 · La Battaglia del Ponte Sotto la Pioggia",
                    intro: "I guerrieri con le Maschere Oni attaccano senza paura né stanchezza! Usa la Katana del Tuono per scardinare la loro difesa!",
                    mate: "Benkei",
                    squad: ["Monaco Benkei", "Lady Tomoe", "Kunoichi Hanzo"],
                    oppNames: ["Comandante Maschera Oni", "Guardia del Tuono", "Samurai d'Assalto", "Ala d'Acciaio", "Baluardo Mascherato"],
                    team: (t, st) => ({ name: "Guarnigione Maschere Oni", color: "#450a0a", atk: 25, def: 26, vel: 24 }),
                    done: (r) => {
                      if (r.win) {
                        sfxKatanaClash();
                        sfxCherryBlossom();
                        say([
                          ["sh_benkei", "«VITTORIA! Le maschere di ferro si sono frantumate sotto i colpi del tuo tiro!»"],
                          ["sh_hanzo", "«I soldati hanno ripreso coscienza e ringraziano in lacrime. Abbiamo spezzato il sortilegio sul borgo!»"],
                          ["hero", "«Ora la strada per la gradinata del Tempio del Loto Nero (Capitolo 3) è libera!»"]
                        ], () => {
                          reward("sh_ch2_rew", { coins: 250 });
                          finishChapter(2, "maschere_spezzate");
                          setStep(N, 4);
                          note("Abbiamo sconfitto le Maschere Oni sul ponte! Capitolo 2 completato: la via per il Tempio del Loto Nero è aperta.");
                          ask("hero", "Il borgo è liberato e la gradinata per il Tempio del Loto è spalancata! Vuoi salire subito al Capitolo 3?", [
                            {
                              label: "⛩️ Sali al Tempio del Loto Nero (Capitolo 3)",
                              cls: "hot",
                              fn: () => go("sh_tempio", 12, 12)
                            },
                            { label: "Rimani nel Borgo", fn: done }
                          ]);
                        });
                      } else {
                        say([["sh_benkei", "«La loro tenacia di ferro ci ha respinto. Riprendiamo fiato vicino al braciere e riproviamo!»"]], done);
                      }
                    }
                  });
                }
              },
              { label: "Un attimo per riflettere", fn: done }
            ]);
          } else {
            say([["sh_benkei", "«La via per il Tempio del Loto a est (X:23, Y:12) è aperta per te!»"]], done);
          }
        }
      },
      obj: {
        "sh_villaggio:1,7": () => {
          go("sh_giardino", 22, 8);
        },
        "sh_villaggio:23,12": () => {
          if (S() >= 4 || mem().done[2]) {
            go("sh_tempio", 2, 7);
          } else {
            say([["voce", "La gradinata del tempio è sbarrata dalle Maschere Oni. Devi sconfiggerle in partita con Benkei prima di poter salire.", "sh_villaggio"]], done);
          }
        }
      }
    };
  });

  // ==========================================================================
  // CAPITOLO 3 · IL TRADIMENTO DI TOMOE & L'ASSEDIO DELLA FORTEZZA
  // ==========================================================================
  addChapter(function (X) {
    const { F, say, ask, done, go, note, setStep, reward, hero, addBlade, sfxTaikoDrum, sfxKatanaClash, sfxSpiritBell } = X;
    const N = 3, S = () => X.stepOf(N);

    // Cast Personaggi Capitolo 3
    X.cast("sh_generale_kuro", {
      name: "Gen. Raiden", tag: "generale", hair: "#18181b", style: "slick", skin: "#e2e8f0", eye: "#ef4444",
      bg: ["#020617", "#ef4444"], shirt: "#0f172a"
    }, "Comandante supremo delle Guardie d'Ossidiana. Implacabile, calcolatore, armato di due katane gemelle capaci di intercettare qualsiasi parabola aerea.");

    return {
      n: 3,
      title: "Il Tradimento di Tomoe & L'Assedio della Fortezza",
      sub: "Il Tempio del Loto Nero & La Porta dell'Ossidiana",
      start: "sh_tempio",
      zones: {
        sh_tempio: {
          name: "Il Tempio del Loto Nero · La Navata Sacra",
          short: "Tempio del Loto",
          sub: "Statua monumentale del Buddha d'ombra, campana bronzea e incenso cerimoniale",
          isCustomSaga: true,
          act: {
            "12,5": "Esamina la Statua del Buddha d'Ombra",
            "6,8": "Raccogli la pergamena lasciata da Tomoe",
            "18,8": "Parla con il Maestro Hayato",
            "12,13": "Affronta il Generale Raiden alla Porta della Fortezza",
            "23,5": "Varca il ponte levatoio verso la Fortezza d'Ossidiana",
            "1,7": "Torna al Borgo dei Samurai",
            T: "Esamina le colonne del tempio",
            L: "Osserva il braciere d'incenso sacro",
            B: "Ammira il basamento della statua",
            M: "Ispeziona la campana bronzea"
          },
          build(Ls) {
            for (let y = 0; y < 15; y++) {
              for (let x = 0; x < 25; x++) {
                if (x === 0 || x === 24 || y === 0 || y === 14) Ls.put(x, y, "w");
                else if (y >= 4 && y <= 6 && x >= 10 && x <= 14) Ls.put(x, y, "q"); // Piedistallo del Buddha
                else Ls.put(x, y, ",");
              }
            }
            Ls.put(1, 7, "T"); Ls.put(23, 5, "T");
            Ls.put(12, 5, "B"); // Statua del Buddha
            Ls.put(6, 8, "M"); // Grande campana bronzea
            Ls.put(4, 4, "L"); Ls.put(20, 4, "L"); Ls.put(4, 11, "L"); Ls.put(20, 11, "L");
          },
          npcs: [
            { id: "sh_hayato", x: 18 * TS, y: 8 * TS, name: "Maestro Hayato", dir: "left" },
            { id: "sh_generale_kuro", x: 12 * TS, y: 13 * TS, name: "Gen. Raiden", dir: "up" }
          ]
        }
      },
      talk: {
        sh_hayato: () => {
          sfxSpiritBell();
          if (S() === 0) {
            say([
              ["sh_hayato", "«{n}... È successa una tragedia. Lady Tomoe... è scomparsa.»"],
              ["hero", "«Come scomparsa?! Eravamo insieme poco fa al villaggio!»"],
              ["sh_hayato", "«Ha preso la Katana del Loto d'Acqua ed è salita da sola alla Fortezza d'Ossidiana. Ha lasciato una pergamena d'addio vicino alla grande campana bronzea a ovest (X:6, Y:8). Leggila, ti prego.»"]
            ], () => {
              setStep(N, 1);
              note("Colpo di scena: Lady Tomoe è scomparsa lasciando una pergamena d'addio alla campana bronzea (X:6, Y:8).");
              done();
            });
          } else if (S() === 2) {
            say([
              ["sh_hayato", "«Ora comprendi il suo dolore. Tomoe ha sacrificato il proprio onore per salvare il fratellino, credendo che lo Shogun avrebbe mantenuto la parola. Ma Kurogane non risparmia nessuno.»"],
              ["hero", "«Non la lasceremo sola nel nido del serpente. Assediamo la Fortezza d'Ossidiana!»"],
              ["sh_hayato", "«Ben detto! Il Generale Raiden presidia il ponte della fortezza a sud (X:12, Y:13). Dobbiamo sconfiggerlo sul campo per sfondare il portone!»"]
            ], () => {
              setStep(N, 3);
              note("Ho deciso di assediare la Fortezza d'Ossidiana per salvare Tomoe. Il Generale Raiden sbarra la porta.");
              done();
            });
          } else {
            say([["sh_hayato", "«Il Generale Raiden ti attende alla porta sud della fortezza (X:12, Y:13). Fai vibrare il tuo tiro!»"]], done);
          }
        },
        sh_generale_kuro: () => {
          if (S() < 3) {
            say([["sh_generale_kuro", "«Nessuno oltrepassa questo portone. La fortezza di Lord Kurogane è inespugnabile.»"]], done);
            return;
          }
          if (S() === 3) {
            sfxTaikoDrum();
            ask("sh_generale_kuro", "«Credi di poter varcare le mura d'ossidiana con due calci a un pallone? Le mie Guardie d'Élite disintegreranno ogni vostra speranza!»", [
              {
                label: "⚔️ Lancia l'Assalto contro il Generale Raiden!",
                cls: "hot",
                fn: () => {
                  X.playMatch({
                    id: "sh_match_ch3",
                    chap: "Capitolo 3 · L'Assalto alla Porta d'Ossidiana",
                    intro: "Le Guardie d'Élite dello Shogunato formano una muraglia di ferro impenetrabile! Guida l'assalto con Hayato e Benkei!",
                    mate: "Hayato",
                    squad: ["Maestro Hayato", "Monaco Benkei", "Kunoichi Hanzo"],
                    oppNames: ["Gen. Raiden", "Guardia d'Ossidiana 1", "Guardia d'Ossidiana 2", "Intercettore Nero", "Portiere della Notte"],
                    team: (t, st) => ({ name: "Legione d'Ossidiana", color: "#09090b", atk: 30, def: 31, vel: 29 }),
                    done: (r) => {
                      if (r.win) {
                        sfxKatanaClash();
                        sfxDragonRoar();
                        say([
                          ["sh_generale_kuro", "«M-maledizione... Le nostre formazioni sono andate in frantumi... Come può un pallone avere una tale forza spirituale?!»"],
                          ["hero", "«Perché dietro a ogni nostro tiro c'è la speranza di liberare i nostri compagni!»"],
                          ["sh_hayato", "«Il portone d'ossidiana è caduto! Tomoe e Kurogane sono lassù nella Sala del Trono (Capitolo 4)!»"]
                        ], () => {
                          reward("sh_ch3_rew", { coins: 350 });
                          finishChapter(3, "porta_espugnata");
                          setStep(N, 4);
                          note("Abbiamo espugnato la Porta d'Ossidiana e sconfitto il Generale Raiden! Capitolo 3 completato: la Sala del Trono ci attende.");
                          ask("hero", "Il ponte della Fortezza d'Ossidiana è aperto! Vuoi salire subito al Capitolo 4: L'Eclisse Totale?", [
                            {
                              label: "👑 Sali alla Sala del Trono (Capitolo 4)",
                              cls: "hot",
                              fn: () => go("sh_fortezza", 12, 12)
                            },
                            { label: "Rimani nel Tempio", fn: done }
                          ]);
                        });
                      } else {
                        say([["sh_generale_kuro", "«Respinte! La fortezza rimane sigillata. Tornate nei vostri campi a coltivare il riso!»"]], done);
                      }
                    }
                  });
                }
              },
              { label: "Riorganizzo le linee", fn: done }
            ]);
          } else {
            say([["sh_generale_kuro", "«Il portone è crollato. Lo Shogun ti attende sul Trono della Notte.»"]], done);
          }
        }
      },
      obj: {
        "sh_tempio:6,8": () => {
          if (S() === 1) {
            sfxCherryBlossom();
            say([
              ["voce", "Raccogli la pergamena sigillata con ceralacca scarlatta.", "sh_tempio"],
              ["sh_tomoe", "«{n}, perdonami. Kurogane mi ha promesso che libererà mio fratello Ren se gli consegnerò la Katana del Loto. So che mi aspetta una trappola, ma non potevo non tentare. Vi prego, non cercatemi... ricordatemi mentre giocavamo sotto i ciliegi.»"],
              ["hero", "«Tomoe si sta sacrificando inutilmente! Dobbiamo correre a salvarla prima che sia troppo tardi!»"]
            ], () => {
              setStep(N, 2);
              note("Ho letto la lettera di Tomoe: è andata nella fortezza per salvare il fratello. Devo parlare con Hayato per assediare le mura.");
              done();
            });
          } else {
            say([["voce", "La monumentale campana bronzea del tempio tace nel silenzio dell'eclisse.", "sh_tempio"]], done);
          }
        },
        "sh_tempio:1,7": () => {
          go("sh_villaggio", 21, 12);
        },
        "sh_tempio:23,5": () => {
          if (S() >= 4 || mem().done[3]) {
            go("sh_fortezza", 2, 7);
          } else {
            say([["voce", "Il ponte levatoio della fortezza è alzato. Devi sconfiggere il Generale Raiden alla porta sud per aprirlo.", "sh_tempio"]], done);
          }
        }
      }
    };
  });

  // ==========================================================================
  // CAPITOLO 4 · L'ECLISSE DELLA LUNA DI SANGUE & IL DUELLO DEL DRAGONE
  // ==========================================================================
  addChapter(function (X) {
    const { F, say, ask, done, go, note, setStep, reward, hero, addBlade, sfxTaikoDrum, sfxKatanaClash, sfxSpiritBell, sfxDragonRoar } = X;
    const N = 4, S = () => X.stepOf(N);

    // Cast Personaggi Capitolo 4
    X.cast("sh_kurogane", {
      name: "Shogun Kurogane", tag: "shogun_ombra", hair: "#09090b", style: "long", skin: "#fed7aa", eye: "#ef4444",
      bg: ["#450a0a", "#f59e0b"], shirt: "#18181b"
    }, "L'usurpatore supremo del trono feudale. Indossa l'Armatura del Dragone Nero d'Ossidiana. Vuole sottomettere ogni provincia attraverso un calcio perfetto, algoritmico e privo di errori.");

    X.cast("sh_drago_celeste", {
      name: "Spirito del Dragone", tag: "entita_divina", hair: "#38bdf8", style: "spiky", skin: "#e0f2fe", eye: "#fde047",
      bg: ["#0369a1", "#fde047"], shirt: "#0284c7"
    }, "L'antico Guardiano delle Sette Lame e dello Spirito della Rondine. Si manifesta quando il cuore di un calciatore gioca con pura passione senza paura.");

    // Cosmetici epici finali
    X.cos("sh_maglia_drago", { kind: "shirt", label: "Kimono dei Sette Draghi", val: "#991b1b", from: "Completa la saga Shogun Eclipse" });
    X.cos("sh_maschera_oni", { kind: "acc", label: "Maschera Cerimoniale del Guardiano", val: "#f59e0b", from: "Epilogo supremo di Shogun Eclipse" });

    function epilogoFinaleTotale() {
      api.scene("sh_arena_eclisse", "hero", `<b>SHOGUN ECLIPSE · COMPLETATO AL 100%!</b><br><br>
Hai trionfato su ogni prova: hai liberato Lady Tomoe, spezzato la maledizione dello Shogunato e risvegliato il Dragone Celeste.<br><br>
• <b>Sbloccato:</b> Kimono dei Sette Draghi & Maschera Cerimoniale del Guardiano!<br>
• <b>Titolo Onorifico:</b> <em>Gran Maestro delle Sette Lame e della Rondine Libera</em>.<br><br>
<span style="color:var(--dim)">Puoi rigiocare tutti i capitoli in qualsiasi momento o sfidare gli amici nelle partite veloci con i kit dei samurai sbloccati.</span>`, [
        { label: "🏆 Trionfo e Gloria (Menu Principale)", cls: "hot", fn: () => openMain() }
      ], "Vittoria Suprema");
    }

    return {
      n: 4,
      title: "L'Eclisse della Luna di Sangue & Il Duello del Dragone",
      sub: "La Sala del Trono d'Ossidiana & L'Arena della Luna Cremisi",
      start: "sh_fortezza",
      zones: {
        sh_fortezza: {
          name: "Fortezza d'Ossidiana · La Sala del Trono Eclissato",
          short: "Sala del Trono",
          sub: "Stendardi imperiali, armatura del dragone nero e il trono di pietra lunare",
          isCustomSaga: true,
          act: {
            "12,7": "Parla con Lady Tomoe liberata",
            "6,4": "Estrai la Katana del Dragone Celeste dall'armeria",
            "18,4": "Sfida lo Shogun Kurogane al Trono",
            "12,12": "Scendi nell'Arena Sacra per la Partita Finale",
            "1,7": "Torna al Tempio del Loto",
            T: "Esamina il Trono d'Ossidiana",
            L: "Osserva la torcia cerimoniale",
            B: "Ammira gli arazzi delle sette province",
            M: "Ispeziona l'Armatura del Dragone Nero"
          },
          build(Ls) {
            for (let y = 0; y < 15; y++) {
              for (let x = 0; x < 25; x++) {
                if (x === 0 || x === 24 || y === 0 || y === 14) Ls.put(x, y, "w");
                else if (x >= 8 && x <= 16 && y >= 3 && y <= 6) Ls.put(x, y, "q"); // Pedana del Trono
                else Ls.put(x, y, ",");
              }
            }
            Ls.put(1, 7, "T");
            Ls.put(12, 3, "T"); // Grande Trono dello Shogun
            Ls.put(6, 4, "M"); // Armeria sacra
            Ls.put(18, 4, "M"); // Altare dell'armatura
            Ls.put(4, 2, "L"); Ls.put(20, 2, "L"); Ls.put(4, 12, "L"); Ls.put(20, 12, "L");
          },
          npcs: [
            { id: "sh_tomoe", x: 12 * TS, y: 7 * TS, name: "Lady Tomoe", dir: "up" },
            { id: "sh_kurogane", x: 12 * TS, y: 4 * TS, name: "Shogun Kurogane", dir: "down" }
          ]
        }
      },
      talk: {
        sh_tomoe: () => {
          sfxCherryBlossom();
          if (S() === 0) {
            say([
              ["sh_tomoe", "«{n}! Siete venuti davvero... Avete espugnato le mura inespugnabili per me!»"],
              ["hero", "«Ti avevamo promesso che non saresti rimasta sola. Dov'è tuo fratello Ren?»"],
              ["sh_tomoe", "«Hanzo e Benkei lo hanno già portato fuori dalla prigione. Ora rimane solo Kurogane. Egli siede sul trono dell'eclisse e attende il nostro ultimo passo.»"],
              ["sh_tomoe", "«Prima di affrontarlo, estrai la Katana del Dragone Celeste dall'armeria a ovest (X:6, Y:4). Solo con quella lama potrai contrastare il suo tiro titanico!»"]
            ], () => {
              setStep(N, 1);
              note("Ho riabbracciato Tomoe. Devo estrarre la leggendaria Katana del Dragone Celeste dall'armeria sacra (X:6, Y:4).");
              done();
            });
          } else {
            say([["sh_tomoe", "«Estrai la Katana del Dragone Celeste (X:6, Y:4) e poi affronta Kurogane sul trono!»"]], done);
          }
        },
        sh_kurogane: () => {
          if (S() < 2) {
            say([["sh_kurogane", "«Insolenti. Non avete ancora il potere per osare rivolgermi la parola.»"]], done);
            return;
          }
          if (S() === 2) {
            sfxKatanaClash();
            sfxTaikoDrum();
            say([
              ["sh_kurogane", "«Dunque sei tu il Campione venuto da oltre le nubi con il tiro della Rondine.»"],
              ["hero", "«Kurogane! Il tuo regno di paura finisce oggi. Il calcio appartiene al popolo, alla passione e alla libertà!»"],
              ["sh_kurogane", "«Utopie infantili! Solo un ordine assoluto, dove ogni passaggio è calcolato e ogni tiro programmato, può cancellare la debolezza umana. Se vuoi liberare questo mondo, dovrai sconfiggermi nella Partita dell'Eclisse Totale!»"]
            ], () => {
              ask("sh_kurogane", "«Dimmi, Campione... se dovessi vincere, cosa farai del mio trono e dell'energia del Dragone?»", [
                {
                  label: "🕊️ Purificherò il regno per restituire il calcio a tutti i popoli",
                  fn: () => {
                    F.set("finale_shogun", "purificazione");
                    say([
                      ["sh_kurogane", "«Un ideale ingenuo... ma ammiro la tua coerenza. Scendiamo nell'Arena della Luna di Sangue!»"]
                    ], () => {
                      setStep(N, 3);
                      note("Ho scelto la via della Purificazione: restituire il calcio libero a tutte le province.");
                      done();
                    });
                  }
                },
                {
                  label: "👑 Diventerò il nuovo Guardiano Celeste per proteggere per sempre le province",
                  fn: () => {
                    F.set("finale_shogun", "guardiano_celeste");
                    say([
                      ["sh_kurogane", "«Allora comprendi il peso della corona! Vediamo se le tue spalle sanno reggere un simile destino!»"]
                    ], () => {
                      setStep(N, 3);
                      note("Ho scelto la via del Guardiano Celeste: assumere la protezione eterna delle province feudali.");
                      done();
                    });
                  }
                }
              ]);
            });
          } else if (S() === 3) {
            sfxTaikoDrum();
            ask("sh_kurogane", "«La Luna di Sangue è al suo zenit! Sei pronto per la Partita Suprema dell'Eclisse Totale?»", [
              {
                label: "⚽ Sfida Shogun Kurogane nella Partita Finale!",
                cls: "hot",
                fn: () => {
                  X.playMatch({
                    id: "sh_match_ch4_final",
                    chap: "Capitolo 4 · La Partita Suprema dell'Eclisse Totale",
                    intro: "Kurogane scatena la titanica Armatura del Dragone Nero! Tutto il destino del regno è nelle tue gambe!",
                    mate: "Tomoe",
                    squad: ["Lady Tomoe", "Maestro Hayato", "Monaco Benkei", "Kunoichi Hanzo"],
                    oppNames: ["Shogun Kurogane", "Campione d'Ossidiana 1", "Campione d'Ossidiana 2", "Custode dell'Eclisse", "Drago Nero Titanico"],
                    team: (t, st) => ({ name: "I Draghi dell'Eclisse", color: "#b91c1c", atk: 35, def: 35, vel: 36 }),
                    done: (r) => {
                      if (r.win) {
                        sfxKatanaClash();
                        sfxDragonRoar();
                        sfxCherryBlossom();
                        const fin = F.get("finale_shogun") || "purificazione";
                        if (fin === "purificazione") {
                          say([
                            ["sh_kurogane", "«I-impossibile... Quel tiro ha frantumato l'Armatura del Dragone Nero in mille frammenti di luce...»"],
                            ["voce", "L'eclisse si dissolve nel cielo! Per la prima volta dopo decenni, il sole dorato risplende sui tetti a pagoda e sui campi del regno!", "sh_fortezza"],
                            ["sh_tomoe", "«Ce l'abbiamo fatta, {n}! Guarda il cielo... Il vento della Rondine soffia libero!»"],
                            ["sh_hayato", "«Sei la leggenda vivente di questo mondo. Il tuo nome sarà scolpito nelle cronache eterne.»"]
                          ], () => {
                            reward("sh_ch4_rew", { coins: 1000 });
                            finishChapter(4, "purificazione_totale");
                            setStep(N, 4);
                            note("Ho trionfato nella Partita Finale dell'Eclisse Totale! La saga di Shogun Eclipse è completata al 100%: il regno è per sempre libero.");
                            epilogoFinaleTotale();
                          });
                        } else {
                          say([
                            ["sh_kurogane", "«Sei davvero il prescelto... Accetta il Trono, Guardiano Celeste... Il regno è nelle tue mani.»"],
                            ["sh_drago_celeste", "«{n}, hai unito la forza della lama con la grazia del pallone. Da oggi veglierai per sempre su ogni giovane calciatore.»"],
                            ["sh_tomoe", "«Saremo sempre al tuo fianco, nostro Signore e Campione!»"]
                          ], () => {
                            reward("sh_ch4_rew", { coins: 1000 });
                            finishChapter(4, "guardiano_eterno");
                            setStep(N, 4);
                            note("Ho conquistato il titolo di Guardiano Celeste Supremo! Shogun Eclipse completato al 100%.");
                            epilogoFinaleTotale();
                          });
                        }
                      } else {
                        say([["sh_kurogane", "«Il tuo spirito ha vacillato! L'Eclisse domina ancora. Raccogli le tue forze e riprova: il destino non aspetta!»"]], done);
                      }
                    }
                  });
                }
              },
              { label: "Riprendo fiato prima dello scontro finale", fn: done }
            ]);
          } else {
            say([["sh_kurogane", "«Hai vinto con pieno onore, Campione. La leggenda è tua.»"]], done);
          }
        }
      },
      obj: {
        "sh_fortezza:6,4": () => {
          if (S() === 1) {
            sfxDragonRoar();
            sfxKatanaClash();
            addBlade("lama_drago", "Katana del Dragone Celeste", "La lama leggendaria suprema forgiata nella luce dell'Aurora. Dona uno scatto divino e precisione millimetrica.", "#38bdf8");
            say([
              ["voce", "Dall'armeria sacra estrai la radiosa Katana del Dragone Celeste! La lama risplende di fulgido azzurro e oro.", "sh_fortezza"],
              ["hero", "«Sento l'energia del drago che scorre nel mio corpo! Ora sono pronto per Kurogane.»"]
            ], () => {
              setStep(N, 2);
              note("Ho estratto la Katana del Dragone Celeste! Ora posso sfidare lo Shogun Kurogane al Trono.");
              done();
            });
          } else {
            say([["voce", "L'armeria sacra è colma di armature cerimoniali intatte.", "sh_fortezza"]], done);
          }
        },
        "sh_fortezza:1,7": () => {
          go("sh_tempio", 21, 5);
        }
      }
    };
  });

  // Esportazione Globale dell'API
  window.__shogunStory = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return {
        label: "⚔️ Shogun Eclipse · Il Regno delle Sette Lame",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "Saga samurai feudale con Katana Sense"}`
          : "Crea prima il tuo campione · Saga feudale epica con spade, templi e draghi"
      };
    },
    info() {
      const m = mem();
      return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), blades: m.blades.length };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
