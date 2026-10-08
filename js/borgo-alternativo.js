// =========================================================================
// CALA TRAMONTANA · IL BORGO MARINO ALTERNATIVO DEL CAMPIONE
// Modalità a piedi con ambientazione integrante, colpi di scena, nuovi personaggi
// =========================================================================
(function () {
  "use strict";

  const K_SAVE = "ali-di-rondine.cala-tramontana";
  const K_HERO = "ali-di-rondine.campione";

  // Helpers
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const sfx = (k) => { try { if (window.sfx) window.sfx(k); } catch (e) {} };

  // ---------- SALVATAGGIO MODALITÀ ----------
  function defaultState() {
    return {
      act: 1, // 1..5
      step: 0,
      tide: "bassa", // "bassa" | "alta"
      weather: "brezza", // "brezza" | "nebbia" | "burrasca"
      shells: [], // indici 0..7
      marinaShellsDelivered: false, // Consegna 4 conchiglie nere a Marina
      shotUpgrade: false, // Potenziamento tiro di Marina
      barrels: [], // indici barili abbattuti
      clues: [], // "catena_ruggine", "carta_nautica", "orma_bagnata"
      beaconsLit: [false, false, false],
      derbyWon: false,
      talked: {},
      heroPos: { x: 280, y: 320, dir: "down" },
      ballPos: { x: 295, y: 320, vx: 0, vy: 0, inAir: 0 },
      coinsEarned: 0,
      bestChallenge: 0,
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(K_SAVE);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && typeof d.act === "number") {
          return Object.assign(defaultState(), d);
        }
      }
    } catch (e) {}
    return defaultState();
  }

  function saveState(st) {
    try {
      localStorage.setItem(K_SAVE, JSON.stringify(st));
    } catch (e) {}
  }

  // ---------- CARICAMENTO CAMPIONE ----------
  function getHero() {
    try {
      if (typeof window.heroLoad === "function") {
        const h = window.heroLoad();
        if (h && h.name) return h;
      }
      const raw = localStorage.getItem(K_HERO);
      if (raw) {
        const h = JSON.parse(raw);
        if (h && h.v === 1 && h.name) return h;
      }
    } catch (e) {}
    return {
      v: 1,
      name: "Marco",
      num: 10,
      style: "spiky",
      hair: "#2b1d14",
      skin: "#f2c9a0",
      shirt: "#1f5fbf",
      acc: "none",
      shot: "saetta",
      shotName: "SAETTA DI MARCO"
    };
  }

  // ---------- PERSONAGGI NUOVI DI CALA TRAMONTANA ----------
  const CHARS = {
    severino: {
      id: "severino",
      name: "Capitan Severino",
      title: "Il Timoniere Cieco",
      bio: "Ex capitano d'altura e tiratore infallibile sui moli. Ha perso la vista quarant'anni fa ma sente il vento del largo.",
      skin: "#e0ac7e",
      hair: "#e0e0e0",
      style: "buzz",
      beard: true,
      pipe: true,
      shirt: "#eab308", // cerata gialla
      accent: "#78350f"
    },
    marina: {
      id: "marina",
      name: "Marina la Calafata",
      title: "Mastra d'Ascia e Balistica",
      bio: "Ventenne con bandana rossa e mani nere di pece. Costruisce barche e palloni di cuoio impregnati di pece marina.",
      skin: "#f5d6b8",
      hair: "#b8452a",
      style: "ponytail",
      bandana: "#ef4444",
      shirt: "#0f766e",
      accent: "#f43f5e"
    },
    don_vindice: {
      id: "don_vindice",
      name: "Don Vindice",
      title: "L'Arbitro delle Maree",
      bio: "Fischietto in osso di balena al collo e cappotto nero battuto dal sale. Fischia i rigori secondo l'altezza delle onde.",
      skin: "#d4a373",
      hair: "#475569",
      style: "slick",
      shirt: "#1e293b",
      whistle: true,
      accent: "#38bdf8"
    },
    sibilla: {
      id: "sibilla",
      name: "Sibilla dei Coralli",
      title: "Veggente delle Scogliere",
      bio: "Vive nella prua rovesciata di un vecchio gozzo. Legge i destini calcistici nelle venature delle conchiglie nere.",
      skin: "#b9804f",
      hair: "#312e81",
      style: "long",
      shirt: "#6366f1",
      corals: true,
      accent: "#c084fc"
    },
    corrado: {
      id: "corrado",
      name: "Corrado «Onda Nera»",
      title: "Capitano dei Corsari",
      bio: "Fisico d'acciaio e tiro a spiovente micidiale. Difende l'onore della Gabbia dei Marosi con orgoglio feroce.",
      skin: "#b9804f",
      hair: "#0f172a",
      style: "messy",
      shirt: "#0284c7",
      accent: "#0ea5e9"
    },
    eneas: {
      id: "eneas",
      name: "Maestro Enea",
      title: "Il Filosofo del Faro",
      bio: "Custode del faro d'ossidiana e ottico navale. Studia le parabole dei tiri come fasci di luce che ingannano il portiere.",
      skin: "#f2c9a0",
      hair: "#cbd5e1",
      style: "bun",
      shirt: "#334155",
      accent: "#10b981"
    },
    ombra: {
      id: "ombra",
      name: "L'Ombra dello Specchio",
      title: "Il Campione del 1979",
      bio: "Una figura velata dalla nebbia che indossa gli stessi colori del tuo campione. Un eco del passato che cerca un degno erede.",
      skin: "#94a3b8",
      hair: "#475569",
      style: "spiky",
      shirt: "#3b82f6",
      ghost: true,
      accent: "#60a5fa"
    },
    zanna: {
      id: "zanna",
      name: "Zanna",
      title: "Il Cane dei Moli",
      bio: "Incrocio tra un pastore e un cane di mare. Ti segue scodinzolando, fiuta i tesori e riporta la palla al piede!",
      isDog: true
    }
  };

  // ---------- MAPPA MATRICIALE & ZONE (48 x 26 TILE) ----------
  const MW = 48;
  const MH = 26;
  const TS = 24; // Pixel dimensione tile per canvas nitido

  // Simboli mappa:
  // '.' = Pietra / Lastricato
  // '#' = Muro / Roccia invalicabile
  // '~' = Mare profondo
  // ',' = Bagnasciuga / Sabbia bagnata (accessibile solo in Bassa Marea)
  // '=' = Pontile di legno
  // 'g' = Campo in terra battuta (Terrazzo dei Marosi)
  // 'L' = Lanterna
  // 'F' = Faro d'Ossidiana
  // 'B' = Barile di catrame
  // 'C' = Campana del faro
  // 'T' = Tavolo / Nassa / Reti da pesca
  // 'D' = Porta locanda

  function createMapMatrix(tide) {
    const m = [];
    for (let y = 0; y < MH; y++) {
      m[y] = [];
      for (let x = 0; x < MW; x++) {
        // Confini nord e pareti rocciose
        if (y === 0 || x === 0 || x === MW - 1) {
          m[y][x] = "#";
        } else if (y >= MH - 4) {
          // Mare a sud
          m[y][x] = tide === "bassa" && y === MH - 4 && (x >= 12 && x <= 32) ? "," : "~";
        } else {
          m[y][x] = ".";
        }
      }
    }

    // Costruisci scogliere a nord e nord-est (Grotta delle Sirene)
    for (let x = 34; x < MW - 1; x++) {
      for (let y = 1; y < 8; y++) {
        // Ingresso e bacino della grotta aperti a y: 4..7, x: 37..41 durante la bassa marea
        if (x >= 37 && x <= 41 && y >= 4 && y <= 7) {
          m[y][x] = tide === "bassa" ? "," : "~";
        } else {
          m[y][x] = "#";
        }
      }
    }

    // Faro d'Ossidiana (Nord-Ovest)
    for (let x = 2; x <= 8; x++) {
      for (let y = 1; y <= 6; y++) {
        m[y][x] = (x >= 4 && x <= 6 && y >= 2 && y <= 5) ? "#" : ".";
      }
    }
    m[6][5] = "C"; // Campana
    m[2][5] = "F"; // Faro

    // Locanda "La Prua Sommersa" (Centro-Nord: x: 16..24, y: 3..7)
    for (let x = 16; x <= 24; x++) {
      for (let y = 3; y <= 7; y++) {
        if (y === 7 && x === 20) m[y][x] = "D"; // Porta
        else m[y][x] = "#";
      }
    }

    // Officina Navale di Marina (x: 27..33, y: 3..7)
    for (let x = 27; x <= 33; x++) {
      for (let y = 3; y <= 7; y++) {
        if (y === 7 && x === 30) m[y][x] = "D";
        else m[y][x] = "#";
      }
    }

    // Il Terrazzo dei Marosi (Campo da gioco: x: 26..42, y: 13..20)
    for (let x = 26; x <= 42; x++) {
      for (let y = 13; y <= 20; y++) {
        m[y][x] = "g";
      }
    }
    // Barriere del terrazzo a strapiombo
    for (let y = 13; y <= 20; y++) m[y][43] = "#";
    for (let x = 26; x <= 43; x++) m[21][x] = tide === "bassa" ? "," : "~";

    // Pontili in legno su palafitte (Sud-Ovest: x: 4..16, y: 14..21)
    for (let x = 4; x <= 16; x++) {
      for (let y = 14; y <= 16; y++) m[y][x] = "=";
    }
    for (let y = 17; y <= 21; y++) {
      m[y][10] = "=";
      m[y][11] = "=";
    }

    // Barili e arredi sparsi
    m[13][8] = "B";
    m[13][18] = "B";
    m[9][25] = "B";
    m[15][38] = "B";
    m[11][5] = "B";

    m[10][14] = "T";
    m[10][22] = "T";
    m[11][32] = "T";

    // Lanterne di bronzo
    m[10][10] = "L";
    m[10][26] = "L";
    m[12][40] = "L";
    m[8][36] = "L";

    return m;
  }

  // Luoghi / Aree del Borgo
  function getAreaName(tx, ty) {
    if (tx >= 26 && tx <= 43 && ty >= 12 && ty <= 21) return "Il Terrazzo dei Marosi (Campo di Scogliera)";
    if (tx <= 16 && ty >= 13) return "La Banchina dei Trabucchi Spezzati";
    if (tx >= 34 && ty <= 8) return "La Grotta delle Sirene Salate";
    if (tx <= 10 && ty <= 8) return "La Torre del Faro d'Ossidiana";
    if (tx >= 15 && tx <= 25 && ty <= 9) return "Locanda «La Prua Sommersa»";
    if (tx >= 26 && tx <= 34 && ty <= 9) return "Cantiere Navale di Marina";
    return "Piazzetta delle Nasse d'Argento";
  }

  // Posizioni Conchiglie Segrete (8 in totale, tutte accessibili e uniche)
  const SHELL_LOCS = [
    { x: 3, y: 7, clue: "Dietro il basamento del Faro d'Ossidiana (Nord-Ovest)" },
    { x: 10, y: 21, clue: "In fondo al pontile di legno bagnato (Sud-Ovest)" },
    { x: 39, y: 5, clue: "Dentro l'anfratto della Grotta delle Sirene (Nord-Est, Bassa Marea)" },
    { x: 40, y: 14, clue: "Vicino alla rete destra del Terrazzo dei Marosi (Est)" },
    { x: 25, y: 6, clue: "Nel vicolo tra la Locanda «La Prua Sommersa» e il Cantiere" },
    { x: 18, y: 15, clue: "Nascosta dietro le nasse di corda lungo i pontili" },
    { x: 22, y: 22, clue: "Sulla secca di sabbia emersa (Sud, Bassa Marea)" },
    { x: 35, y: 18, clue: "Incagliata nello scoglio del guardalinee sul Terrazzo" }
  ];

  // Posizioni NPC sulla Mappa
  function getNPCMapPositions(state) {
    const list = [
      { id: "severino", x: 12 * TS, y: 14 * TS, dir: "right" },
      { id: "marina", x: 29 * TS, y: 9 * TS, dir: "down" },
      { id: "don_vindice", x: 25 * TS, y: 15 * TS, dir: "right" },
      { id: "sibilla", x: 37 * TS, y: 9 * TS, dir: "left" },
      { id: "eneas", x: 6 * TS, y: 8 * TS, dir: "down" }
    ];
    if (state.act >= 2 && state.act < 5) {
      // Ombra nella Grotta delle Sirene (o alla foce se alta marea)
      const oy = state.tide === "bassa" ? 6 * TS : 8 * TS;
      list.push({ id: "ombra", x: 39 * TS, y: oy, dir: "down" });
    }
    if (state.act >= 4) {
      list.push({ id: "corrado", x: 34 * TS, y: 14 * TS, dir: "left" });
    }
    return list;
  }

  // ---------- MODALE / SCHERMATA COMPLETA ----------
  let activeInstance = null;

  function openCalaTramontana(returnCallback) {
    if (activeInstance) activeInstance.destroy();

    const state = loadState();
    const hero = getHero();

    // Sincronizza CAST in game.js se disponibile
    try {
      const api = window.__borgoApi;
      if (api && api.CAST && hero) {
        api.CAST.hero = {
          name: hero.name,
          tag: "",
          hair: hero.hair,
          style: hero.style,
          skin: hero.skin,
          eye: "#2a1a0a",
          bg: [hero.shirt, "#ffd23f"],
          shirt: hero.shirt,
          num: String(hero.num),
          acc: hero.acc
        };
      }
    } catch (e) {}

    // Crea contenitore modale elegante
    const modal = document.createElement("div");
    modal.id = "calaTramontanaModal";
    modal.className = "cala-modal";

    modal.innerHTML = `
      <div class="cala-header">
        <div class="cala-title-box">
          <span class="cala-icon">🌊</span>
          <div>
            <h2 class="cala-title">Cala Tramontana · Il Borgo d'Oltremare</h2>
            <div class="cala-sub">La Saga Costiera di <b>${esc(hero.name)}</b> (N.${esc(hero.num)})</div>
          </div>
        </div>
        <div class="cala-header-actions">
          <button type="button" class="cala-btn-small" id="calaTideBtn" title="Alterna Marea">🌊 Marea: <b id="calaTideLabel">${state.tide.toUpperCase()}</b></button>
          <button type="button" class="cala-btn-small" id="calaQuestsBtn" title="Missioni, Trama e Indizi Conchiglie">📋 Missioni & Indizi</button>
          <button type="button" class="cala-btn-small" id="calaMirrorBtn" title="Specchio della Locanda">🪞 Campione</button>
          <button type="button" class="cala-btn-small" id="calaDiaryBtn" title="Diario dei Colpi di Scena">📜 Atti & Trama</button>
          <button type="button" class="cala-btn-close" id="calaCloseBtn" title="Torna al Gioco">✕ Esci</button>
        </div>
      </div>

      <div class="cala-body">
        <div class="cala-canvas-wrap">
          <canvas id="calaCanvas" width="640" height="400"></canvas>
          <div class="cala-toast" id="calaToast" hidden></div>
          <div class="cala-weather-overlay" id="calaWeatherFx"></div>
          
          <!-- Controlli Touch Mobile Integrati -->
          <div class="cala-touch-controls" id="calaTouchControls">
            <div class="cala-dpad">
              <button type="button" class="cala-pad-btn" data-dir="up">▲</button>
              <div class="cala-pad-mid">
                <button type="button" class="cala-pad-btn" data-dir="left">◀</button>
                <div class="cala-pad-center"></div>
                <button type="button" class="cala-pad-btn" data-dir="right">▶</button>
              </div>
              <button type="button" class="cala-pad-btn" data-dir="down">▼</button>
            </div>
            <div class="cala-actions-pad">
              <button type="button" class="cala-act-btn cala-btn-kick" id="calaTouchKick" title="Calcia il Pallone">⚽ TIRA</button>
              <button type="button" class="cala-act-btn cala-btn-talk" id="calaTouchTalk" title="Parla / Esamina">💬 AZIONE</button>
            </div>
          </div>
        </div>

        <div class="cala-sidebar">
          <div class="cala-act-badge" id="calaActBadge">Atto I · L'Approdo e la Marea</div>
          <div class="cala-location" id="calaLocBadge">Piazzetta delle Nasse d'Argento</div>

          <!-- Scheda Missione & Obiettivi in tempo reale -->
          <div class="cala-quest-card" id="calaQuestCard">
            <div class="cala-quest-title">🎯 MISSIONE ATTUALE</div>
            <div class="cala-quest-main" id="calaQuestMain">Caricamento missione...</div>
            <div class="cala-quest-marina" id="calaQuestMarina">🐚 Marina: 4 Conchiglie Nere per il potenziamento tiro</div>
          </div>

          <div class="cala-dialogue-box" id="calaDialogueBox">
            <div class="cala-speaker-name" id="calaSpeaker">Capitan Severino</div>
            <div class="cala-dialogue-text" id="calaDialogue">«Il vento cambia, ragazzo. La marea si ritira e scopre cose che questo mare ha tenuto nascoste per quarant'anni. Cammina per il molo e tira quella palla: voglio sentire se il tuo piede ha sale o solo parole.»</div>
            <div class="cala-dialogue-choices" id="calaChoices"></div>
          </div>

          <div class="cala-stats-bar">
            <div>🐚 Conchiglie: <b id="calaShells">0/8</b></div>
            <div>💰 Monete: <b id="calaCoins">${state.coinsEarned}</b></div>
            <div>⚡ Tiro: <b id="calaShotBadge">${esc(hero.shotName)}</b></div>
          </div>

          <div class="cala-hints" id="calaHintText">
            💡 <b>Comandi:</b> Frecce o WASD per camminare. Spazio per <b>Calciare</b> la palla. E / Invio per <b>Parlare</b>.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    injectCalaStyles();

    // Inizializza Motore di Gioco
    activeInstance = new CalaTramontanaEngine(modal, state, hero, returnCallback);
  }

  // ---------- STILI CSS INIETTATI ----------
  function injectCalaStyles() {
    if (document.getElementById("calaStyleSheet")) return;
    const st = document.createElement("style");
    st.id = "calaStyleSheet";
    st.textContent = `
      .cala-modal {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: #09111e;
        color: #f1f5f9;
        display: flex;
        flex-direction: column;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        user-select: none;
        -webkit-user-select: none;
        overflow: hidden;
      }
      .cala-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 14px;
        background: #0f1d30;
        border-bottom: 2px solid #0284c7;
        gap: 8px;
        flex-shrink: 0;
      }
      .cala-title-box {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .cala-icon {
        font-size: 26px;
      }
      .cala-title {
        font-size: 16px;
        margin: 0;
        font-weight: 800;
        color: #38bdf8;
        letter-spacing: .5px;
      }
      .cala-sub {
        font-size: 12px;
        color: #94a3b8;
      }
      .cala-sub b {
        color: #f8fafc;
      }
      .cala-header-actions {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .cala-btn-small {
        background: #1e293b;
        color: #e2e8f0;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 5px 9px;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all .15s;
      }
      .cala-btn-small:hover {
        background: #0284c7;
        border-color: #38bdf8;
        color: #fff;
      }
      .cala-btn-close {
        background: #b91c1c;
        color: #fff;
        border: 1px solid #ef4444;
        border-radius: 6px;
        padding: 5px 12px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        transition: all .15s;
      }
      .cala-btn-close:hover {
        background: #dc2626;
      }

      .cala-body {
        flex: 1;
        display: flex;
        overflow: hidden;
        position: relative;
      }
      .cala-canvas-wrap {
        flex: 1;
        position: relative;
        background: #050a12;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      #calaCanvas {
        width: 100%;
        height: 100%;
        object-fit: contain;
        image-rendering: pixelated;
        display: block;
      }
      .cala-toast {
        position: absolute;
        top: 14px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 29, 48, 0.94);
        border: 1px solid #38bdf8;
        border-radius: 20px;
        padding: 6px 18px;
        font-size: 13px;
        font-weight: 700;
        color: #ffd23f;
        box-shadow: 0 4px 16px rgba(0,0,0,0.6);
        pointer-events: none;
        z-index: 20;
        animation: calaFadeIn .2s ease;
      }
      @keyframes calaFadeIn {
        from { opacity: 0; transform: translate(-50%, -10px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      .cala-weather-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 10;
      }

      /* Controlli Touch Mobile */
      .cala-touch-controls {
        position: absolute;
        inset: 0;
        pointer-events: none;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 12px 16px;
        z-index: 15;
      }
      .cala-dpad, .cala-actions-pad {
        pointer-events: auto;
      }
      .cala-dpad {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
      }
      .cala-pad-mid {
        display: flex;
        gap: 3px;
        align-items: center;
      }
      .cala-pad-center {
        width: 36px;
        height: 36px;
        background: rgba(30, 41, 59, 0.4);
        border-radius: 6px;
      }
      .cala-pad-btn {
        width: 44px;
        height: 44px;
        background: rgba(30, 41, 59, 0.85);
        color: #f1f5f9;
        border: 1px solid rgba(56, 189, 248, 0.4);
        border-radius: 8px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        touch-action: manipulation;
        cursor: pointer;
      }
      .cala-pad-btn:active {
        background: #0284c7;
        color: #fff;
      }
      .cala-actions-pad {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .cala-act-btn {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 2px solid #fff;
        font-weight: 800;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        touch-action: manipulation;
      }
      .cala-btn-kick {
        background: linear-gradient(135deg, #0284c7, #0369a1);
        color: #fff;
        border-color: #38bdf8;
      }
      .cala-btn-kick:active {
        transform: scale(0.92);
        background: #0284c7;
      }
      .cala-btn-talk {
        background: linear-gradient(135deg, #d97706, #b45309);
        color: #fff;
        border-color: #fcd34d;
      }
      .cala-btn-talk:active {
        transform: scale(0.92);
        background: #f59e0b;
      }

      /* Sidebar & Dialoghi */
      .cala-sidebar {
        width: 320px;
        background: #0c1524;
        border-left: 2px solid #1e293b;
        display: flex;
        flex-direction: column;
        padding: 12px;
        gap: 10px;
        box-sizing: border-box;
        overflow-y: auto;
      }
      .cala-act-badge {
        background: linear-gradient(90deg, #0284c7, #0f172a);
        color: #fff;
        font-size: 11px;
        font-weight: 800;
        padding: 4px 8px;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: .5px;
      }
      .cala-location {
        color: #ffd23f;
        font-size: 13px;
        font-weight: 700;
      }
      .cala-quest-card {
        background: #0d1e38;
        border: 1px solid #0284c7;
        border-radius: 8px;
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .cala-quest-title {
        font-size: 10px;
        font-weight: 800;
        color: #38bdf8;
        letter-spacing: .5px;
      }
      .cala-quest-main {
        font-size: 12px;
        font-weight: 700;
        color: #f1f5f9;
        line-height: 1.35;
      }
      .cala-quest-marina {
        font-size: 11px;
        color: #fcd34d;
        line-height: 1.3;
        border-top: 1px solid rgba(255,255,255,0.08);
        padding-top: 4px;
        margin-top: 2px;
      }
      .cala-dialogue-box {
        background: #111e33;
        border: 1px solid #1e3a5f;
        border-radius: 10px;
        padding: 10px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .cala-speaker-name {
        font-weight: 800;
        color: #38bdf8;
        font-size: 13px;
        border-bottom: 1px solid #1e293b;
        padding-bottom: 4px;
      }
      .cala-dialogue-text {
        font-size: 13px;
        line-height: 1.45;
        color: #e2e8f0;
        flex: 1;
        overflow-y: auto;
      }
      .cala-dialogue-choices {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .cala-choice-btn {
        background: #1e293b;
        color: #f1f5f9;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 8px 10px;
        text-align: left;
        font-size: 12px;
        cursor: pointer;
        transition: all .15s;
      }
      .cala-choice-btn:hover {
        background: #0284c7;
        border-color: #38bdf8;
      }
      .cala-stats-bar {
        background: #09111e;
        border: 1px solid #1e293b;
        border-radius: 6px;
        padding: 6px 8px;
        font-size: 11px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        color: #cbd5e1;
      }
      .cala-stats-bar b {
        color: #f8fafc;
      }
      .cala-hints {
        font-size: 11px;
        color: #64748b;
        line-height: 1.35;
      }

      @media (max-width: 768px) {
        .cala-body {
          flex-direction: column;
        }
        .cala-sidebar {
          width: 100%;
          height: 190px;
          border-left: none;
          border-top: 2px solid #1e293b;
          padding: 8px;
        }
        .cala-dialogue-text {
          font-size: 12px;
        }
      }
    `;
    document.head.appendChild(st);
  }

  // =========================================================================
  // MOTORE DI GIOCO: RENDERING 2D, FISICA, IA E TRAMA
  // =========================================================================
  class CalaTramontanaEngine {
    constructor(modal, state, hero, returnCallback) {
      this.modal = modal;
      this.state = state;
      this.hero = hero;
      this.returnCallback = returnCallback;

      this.canvas = modal.querySelector("#calaCanvas");
      this.ctx = this.canvas.getContext("2d");

      this.keys = {};
      this.frame = 0;
      this.running = true;
      this.toastTimer = 0;

      // Coordinate telecamera e interpolazione
      this.camX = this.state.heroPos.x - 320;
      this.camY = this.state.heroPos.y - 200;

      // Zanna (il cane)
      this.dog = {
        x: this.state.heroPos.x - 20,
        y: this.state.heroPos.y,
        dir: "down",
        barkTimer: 0,
        fetching: false
      };

      // Particelle onde e spruzzi
      this.particles = [];
      for (let i = 0; i < 40; i++) {
        this.particles.push({
          x: rnd(0, MW * TS),
          y: rnd((MH - 5) * TS, MH * TS),
          sp: rnd(0.2, 0.8),
          size: rnd(1.5, 3.5),
          life: rnd(0, 100)
        });
      }

      // Gabbiani in volo
      this.gulls = [
        { x: 100, y: 40, vx: 1.2, vy: 0.1 },
        { x: 340, y: 60, vx: 0.9, vy: -0.1 },
        { x: 500, y: 30, vx: 1.4, vy: 0.2 }
      ];

      // Mappa corrente
      this.map = createMapMatrix(this.state.tide);

      this.setupDOM();
      this.setupControls();
      this.updateHUD();
      this.startLoop();

      // Incipit automatico se primo avvio
      if (this.state.act === 1 && this.state.step === 0) {
        this.startAct1();
      }
    }

    setupDOM() {
      const q = (s) => this.modal.querySelector(s);

      q("#calaCloseBtn").onclick = () => this.destroy();
      q("#calaTideBtn").onclick = () => this.toggleTide();
      if (q("#calaQuestsBtn")) q("#calaQuestsBtn").onclick = () => this.openQuestLog();
      q("#calaMirrorBtn").onclick = () => this.openMirror();
      q("#calaDiaryBtn").onclick = () => this.openStoryDiary();

      q("#calaTouchKick").onclick = () => this.kickBall();
      q("#calaTouchTalk").onclick = () => this.interactNear();

      // D-Pad touch
      const padBtns = this.modal.querySelectorAll(".cala-pad-btn");
      padBtns.forEach((btn) => {
        const dir = btn.dataset.dir;
        const setDir = (val) => {
          if (dir === "up") this.keys["ArrowUp"] = val;
          if (dir === "down") this.keys["ArrowDown"] = val;
          if (dir === "left") this.keys["ArrowLeft"] = val;
          if (dir === "right") this.keys["ArrowRight"] = val;
        };
        btn.addEventListener("touchstart", (e) => { e.preventDefault(); setDir(true); });
        btn.addEventListener("touchend", (e) => { e.preventDefault(); setDir(false); });
        btn.addEventListener("mousedown", () => setDir(true));
        btn.addEventListener("mouseup", () => setDir(false));
      });
    }

    setupControls() {
      this.onKeyDown = (e) => {
        this.keys[e.key] = true;
        if (e.key === " " || e.key === "k" || e.key === "K") {
          e.preventDefault();
          this.kickBall();
        }
        if (e.key === "e" || e.key === "E" || e.key === "Enter") {
          e.preventDefault();
          this.interactNear();
        }
        if (e.key === "Escape") {
          this.destroy();
        }
      };

      this.onKeyUp = (e) => {
        this.keys[e.key] = false;
      };

      window.addEventListener("keydown", this.onKeyDown);
      window.addEventListener("keyup", this.onKeyUp);
    }

    toast(msg) {
      const el = this.modal.querySelector("#calaToast");
      if (!el) return;
      el.textContent = msg;
      el.hidden = false;
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
    }

    toggleTide() {
      this.state.tide = this.state.tide === "bassa" ? "alta" : "bassa";
      this.map = createMapMatrix(this.state.tide);
      this.modal.querySelector("#calaTideLabel").textContent = this.state.tide.toUpperCase();
      saveState(this.state);
      sfx("whistle");
      this.toast(`La marea è ora ${this.state.tide.toUpperCase()}! ${this.state.tide === "bassa" ? "Le secche e la grotta sono accessibili!" : "L'acqua sale sui pontili!"}`);
    }

    openMirror() {
      // Salva e apri editor del campione
      saveState(this.state);
      this.destroy();
      if (typeof window.heroEditor === "function") {
        window.heroEditor(() => openCalaTramontana(this.returnCallback));
      } else {
        alert("Editor del Campione accessibile dal menu principale.");
      }
    }

    openStoryDiary() {
      const acts = [
        "Atto I: L'Approdo e la Bassa Marea (La scoperta del Terrazzo dei Marosi)",
        "Atto II: L'Ombra dello Specchio (L'apparizione del rivale spettrale)",
        "Atto III: Il Sabotaggio del Faro (L'investigazione sulla campana rubata)",
        "Atto IV: La Tempesta dei Tre Fuochi (La burrasca e i bracieri salvifici)",
        "Atto V: Il Derby della Gabbia dei Marosi (La resa dei conti contro Corrado)"
      ];

      const text = acts.map((a, i) => {
        const done = this.state.act > i + 1 || (this.state.act === i + 1 && this.state.derbyWon);
        const curr = this.state.act === i + 1;
        return `${done ? "✓" : curr ? "▶" : "🔒"} <b>${a}</b>`;
      }).join("<br><br>");

      this.setDialogue("Diario delle Maree", text, [
        { label: "Chiudi diario", fn: () => this.restoreDialogue() }
      ]);
    }

    // ---------- TRAMA, ATTI & COLPI DI SCENA ----------
    startAct1() {
      this.state.act = 1;
      this.state.step = 1;
      saveState(this.state);

      this.setDialogue(
        "Capitan Severino",
        `«Benvenuto a Cala Tramontana, ${esc(this.hero.name)}. Pochi riescono a trovare questo molo tra le nebbie. Vedi quel campetto a strapiombo sul mare? È il <b>Terrazzo dei Marosi</b>. Da quarant'anni nessuno riesce a calciare contro le correnti senza farsi portar via il pallone. Fammi vedere cosa sa fare il tuo tiro <em>«${esc(this.hero.shotName)}»</em>: colpisci uno dei barili galleggianti!»`,
        [
          { label: "«Accetto la sfida, Capitano!»", fn: () => {
            this.toast("Obiettivo: Raggiungi il Terrazzo dei Marosi a est e calcia contro i barili!");
            this.closeDialogue();
          }},
          { label: "«Chi sono gli altri abitanti?»", fn: () => {
            this.explainCharacters();
          }}
        ]
      );
    }

    explainCharacters() {
      this.setDialogue(
        "Capitan Severino",
        `«Lungo la banchina c'è <b>Marina la Calafata</b> che ripara scafi e cuce palloni di cuoio pesante. Verso il Terrazzo vigila <b>Don Vindice</b> col suo fischietto d'avorio. E tra gli scogli della Grotta vive <b>Sibilla</b>, che legge le sorti nei coralli. Non avvicinarti al Faro vecchio dopo il tramonto: Maestro Enea dice che vi aleggiano presenze strane...»`,
        [
          { label: "«Vado a esplorare il borgo!»", fn: () => this.closeDialogue() }
        ]
      );
    }

    triggerAct2PlotTwist() {
      // Colpo di scena 2: Appare l'Ombra dello Specchio
      this.state.act = 2;
      this.state.weather = "nebbia";
      saveState(this.state);
      sfx("whistle");

      this.toast("COLPO DI SCENA! Una densa nebbia avvolge la Grotta delle Sirene!");

      this.setDialogue(
        "Sibilla dei Coralli",
        `«Attento, ${esc(this.hero.name)}! I coralli si tingono d'argento vivo. Guarda verso la Grotta delle Sirene a nord-est: è apparso un calciatore velato dalla nebbia... porta la tua stessa maglia numero ${this.hero.num} e calcia col tuo stesso stile! È l'<b>Ombra del 1979</b>, lo spirito dell'ultimo capitano che tentò di salvare Cala Tramontana prima del grande diluvio!»`,
        [
          { label: "«Vado a confrontarmi con l'Ombra!»", fn: () => {
            this.toast("Obiettivo: Cammina fino alla Grotta delle Sirene a nord-est!");
            this.closeDialogue();
          }}
        ]
      );
    }

    triggerAct3Sabotage() {
      // Colpo di scena 3: Sabotaggio del Faro
      this.state.act = 3;
      saveState(this.state);
      sfx("post");

      this.toast("COLPO DI SCENA! La Campana del Faro è stata incatenata!");

      this.setDialogue(
        "Marina la Calafata",
        `«Hanno incatenato la Campana del Faro e rubato la lente di Maestro Enea! Senza la campana, le barche dei pescatori si schianteranno contro i frangiflutti. Abbiamo trovato tre indizi: un'orma bagnata vicino alla locanda, una catena arrugginita sul pontile e una carta nautica marchiata dai predatori di Punta Nera. Aiutaci a perlustrare il borgo con Zanna!»`,
        [
          { label: "«Zanna, andiamo a cercare le tracce!»", fn: () => {
            this.toast("Obiettivo: Esamina i punti sospetti nel borgo con Zanna!");
            this.closeDialogue();
          }}
        ]
      );
    }

    triggerAct4Storm() {
      // Colpo di scena 4: La Notte della Burrasca
      this.state.act = 4;
      this.state.weather = "burrasca";
      this.state.tide = "alta";
      this.map = createMapMatrix("alta");
      saveState(this.state);
      sfx("goal");

      this.toast("TEMPESTA SUL BORGO! Il mare monta, lampi illuminano le scogliere!");

      this.setDialogue(
        "Don Vindice",
        `«La Burrasca delle Tre Lampare è qui! Il peschereccio di Severino è in balia delle onde al largo e il faro è spento! L'unico modo per salvarlo è accendere i tre bracieri di resina arroccati sopra il Terrazzo dei Marosi. Solo un tiro potente e preciso come la tua <b>${esc(this.hero.shotName)}</b> può raggiungere i bracieri attraverso le folate di vento! Corri al Terrazzo!»`,
        [
          { label: "«Ci penso io, Don Vindice! Al Terrazzo!»", fn: () => {
            this.toast("Obiettivo: Raggiungi il Terrazzo dei Marosi e calcia verso i 3 bracieri!");
            this.closeDialogue();
          }}
        ]
      );
    }

    triggerAct5Derby() {
      // Colpo di scena 5: Il Grande Derby dei Corsari
      this.state.act = 5;
      saveState(this.state);

      this.setDialogue(
        "Corrado «Onda Nera»",
        `«Sei riuscito a guidare il gozzo di Severino in salvo, ${esc(this.hero.name)}. Notevole. Ma questo borgo appartiene a chi domina la <b>Gabbia dei Marosi</b>. Io e il mio equipaggio ti sfidiamo a un duello finale: 3 tiri ciascuno contro la porta delle correnti. Se vinci tu, Cala Tramontana ti consacra Signore delle Maree e ti consegna la leggendaria <em>Maglia d'Oltremare</em>!»`,
        [
          { label: "«Accetto la sfida di Corrado!»", fn: () => {
            this.startDerbyMinigame();
          }}
        ]
      );
    }

    startDerbyMinigame() {
      this.toast("INIZIA IL DERBY DELLA GABBIA DEI MAROSI!");
      let heroGoals = 0;
      let rivalGoals = 0;
      let turn = 1;

      const playTurn = () => {
        if (turn > 3) {
          if (heroGoals >= rivalGoals) {
            this.winDerby(heroGoals, rivalGoals);
          } else {
            this.loseDerby(heroGoals, rivalGoals);
          }
          return;
        }

        this.setDialogue(
          `Derby · Turno ${turn} di 3`,
          `Punteggio: <b>${this.hero.name} ${heroGoals} - ${rivalGoals} Corrado</b>.<br>Le onde si infrangono sui pali di legno! Il vento spira a 25 nodi. Come decidi di calciare il tuo ${esc(this.hero.shotName)}?`,
          [
            { label: "⚡ Tiro teso a mezza altezza controvento", fn: () => {
              const ok = Math.random() > 0.3;
              if (ok) {
                heroGoals++;
                sfx("goal");
                this.toast("RETE! Il pallone gonfia la rete marina!");
              } else {
                sfx("post");
                this.toast("PALO! Il vento ha deviato la sfera!");
              }
              // Risposta di Corrado
              if (Math.random() > 0.45) rivalGoals++;
              turn++;
              setTimeout(playTurn, 1000);
            }},
            { label: "🌀 Parabola a giro sopra la barriera di scogli", fn: () => {
              const ok = Math.random() > 0.25;
              if (ok) {
                heroGoals++;
                sfx("goal");
                this.toast("GOL FANTASTICO! Traiettoria imparabile!");
              } else {
                sfx("kick");
                this.toast("PARATA! Corrado vola sulla linea d'onda!");
              }
              if (Math.random() > 0.5) rivalGoals++;
              turn++;
              setTimeout(playTurn, 1000);
            }}
          ]
        );
      };

      playTurn();
    }

    winDerby(hG, rG) {
      this.state.derbyWon = true;
      this.state.coinsEarned += 200;
      saveState(this.state);
      sfx("goal");

      // Ricompensa monete globali
      try {
        if (typeof window.addCoins === "function") window.addCoins(200);
        const api = window.__borgoApi;
        if (api && typeof api.bCos === "function") api.bCos("oltremare");
      } catch (e) {}

      this.setDialogue(
        "TRIONFO A CALA TRAMONTANA!",
        `<b>RISULTATO FINALE: ${esc(this.hero.name)} ${hG} - ${rG} Corrado</b><br><br>I marinai e le mastre d'ascia scendono sui pontili festeggiando con le lampare accese! Capitan Severino ti cinge con la <b>Fascia del Timoniere</b> e ti consegna la <b>Maglia dei Corsari d'Oltremare</b> e <b>200 monete</b>!<br><br>«Hai domato le tre correnti, ${esc(this.hero.name)}. Questo borgo non sarà mai più dimenticato!»`,
        [
          { label: "🌊 Continua a esplorare Cala Tramontana", fn: () => this.closeDialogue() },
          { label: "🏠 Torna al Menu Principale", fn: () => this.destroy() }
        ]
      );
    }

    loseDerby(hG, rG) {
      this.setDialogue(
        "Corrado «Onda Nera»",
        `«${rG} a ${hG} per i Corsari. Hai fegato, ${esc(this.hero.name)}, ma le correnti oggi erano con noi. Riprova quando hai studiato meglio il rimbalzo sugli scogli!»`,
        [
          { label: "Sfida di nuovo Corrado!", fn: () => this.startDerbyMinigame() },
          { label: "Torna al borgo ad allenarti", fn: () => this.closeDialogue() }
        ]
      );
    }

    // ---------- DIALOGHI & UI ----------
    setDialogue(speaker, text, choices) {
      const q = (s) => this.modal.querySelector(s);
      q("#calaSpeaker").textContent = speaker;
      q("#calaDialogue").innerHTML = text;

      const cBox = q("#calaChoices");
      cBox.innerHTML = "";
      if (choices && choices.length) {
        choices.forEach((ch) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "cala-choice-btn";
          btn.innerHTML = ch.label;
          btn.onclick = () => {
            if (ch.fn) ch.fn();
          };
          cBox.appendChild(btn);
        });
      }
    }

    closeDialogue() {
      this.restoreDialogue();
    }

    getObjectiveInfo() {
      const act = this.state.act;
      const shellsCount = (this.state.shells || []).length;
      const marinaDone = !!(this.state.marinaShellsDelivered || this.state.shotUpgrade);

      let mainObj = "";
      if (act === 1) {
        mainObj = "🎯 Atto I: Colpisci un barile al Terrazzo dei Marosi (a est) con un tiro!";
      } else if (act === 2) {
        mainObj = "🎯 Atto II: Raggiungi la Grotta delle Sirene (a nord-est) e affronta l'Ombra dello Specchio!";
      } else if (act === 3) {
        mainObj = "🎯 Atto III: Calcia con forza contro la Campana del Faro (a nord-ovest) per spezzare le catene!";
      } else if (act === 4) {
        mainObj = "🎯 Atto IV: Raggiungi il Terrazzo e calcia verso i 3 bracieri per salvare il gozzo di Severino!";
      } else if (act === 5) {
        if (this.state.derbyWon) {
          mainObj = "🏆 Campione delle Tre Correnti! Cala Tramontana è consacrata e salva!";
        } else {
          mainObj = "🎯 Atto V: Parla con Corrado «Onda Nera» sul Terrazzo e vinci la Gabbia dei Marosi!";
        }
      }

      let marinaObj = "";
      if (marinaDone) {
        marinaObj = "✅ Missione Marina: COMPLETATA! Pallone di Pece & Ossidiana attivo ⭐";
      } else if (shellsCount >= 4) {
        marinaObj = `⭐ Missione Marina: Hai ${shellsCount}/4 Conchiglie Nere! Parla con Marina al Cantiere per consegnarle!`;
      } else {
        marinaObj = `🐚 Missione Marina: Raccogli ${shellsCount}/4 Conchiglie Nere nel borgo per il potenziamento tiro.`;
      }

      return { mainObj, marinaObj, marinaDone, shellsCount, act };
    }

    getStoryProgressionAdvice() {
      const act = this.state.act;
      if (act === 1) {
        return `<b>Atto I:</b> Vai al <b>Terrazzo dei Marosi</b> (il campo da calcio affacciato sul mare a est). Posiziona la palla e calciala contro uno dei <b>barili di catrame</b> per stupire Capitan Severino!`;
      }
      if (act === 2) {
        return `<b>Atto II:</b> La nebbia avvolge gli scogli. Cammina fino alla <b>Grotta delle Sirene</b> a nord-est e parla con <b>L'Ombra dello Specchio</b>, lo spettro del leggendario capitano del '79! <em>(Se l'accesso è sommerso, premi 'MAREA' in alto per passare a Bassa Marea)</em>.`;
      }
      if (act === 3) {
        return `<b>Atto III:</b> I razziatori hanno incatenato la campana e spento il faro! Vai alla <b>Torre del Faro d'Ossidiana</b> a nord-ovest e scaglia una bordata contro la <b>Campana di bronzo</b> per spezzare le catene col tuo tiro!`;
      }
      if (act === 4) {
        return `<b>Atto IV:</b> La tempesta monta violenta! Corri al <b>Terrazzo dei Marosi</b> e calcia verso i <b>3 bracieri di resina</b> arroccati sopra la scogliera per accenderli e salvare la barca di Severino!`;
      }
      if (act === 5) {
        if (this.state.derbyWon) {
          return `<b>Atto V Completato!</b> Hai sconfitto Corrado nella Gabbia dei Marosi e conquistato la maglia d'Oltremare! Puoi esplorare liberamente e trovare tutte le 8 conchiglie nere.`;
        }
        return `<b>Atto V:</b> Raggiungi Corrado «Onda Nera» sul <b>Terrazzo dei Marosi</b> e battilo nella sfida dei rigori della Gabbia dei Marosi!`;
      }
      return "Esplora liberamente il borgo e dialoga con gli abitanti!";
    }

    showCurrentStoryStep() {
      const advice = this.getStoryProgressionAdvice();
      const info = this.getObjectiveInfo();
      this.setDialogue(
        "Guida per Proseguire",
        `<b>${info.mainObj}</b><br><br>${advice}<br><br><div style="border-top:1px solid #1e3a5f;padding-top:6px;margin-top:6px;color:#fcd34d">${info.marinaObj}</div>`,
        [
          { label: "«Ho capito, torno in azione!»", fn: () => this.closeDialogue() },
          { label: "📋 «Apri Diario Missioni Completo»", fn: () => this.openQuestLog() }
        ]
      );
    }

    showRemainingShellsClues() {
      const uncollected = SHELL_LOCS.map((s, idx) => ({ ...s, idx })).filter((s) => !this.state.shells.includes(s.idx));
      let text = "";
      if (uncollected.length === 0) {
        text = `«Incredibile, ${esc(this.hero.name)}! Hai trovato tutte e 8 le Conchiglie Nere d'Abisso! Sei il vero dominatore delle maree di Cala Tramontana!»`;
      } else {
        text = `«Ecco la mappa degli indizi per trovare le <b>${uncollected.length} conchiglie</b> rimaste:<br><br>` +
          uncollected.map((s) => `• 🐚 <b>${s.clue}</b>`).join("<br>") +
          `<br><br>💡 <em>Consiglio: cammina sopra la conchiglia per raccoglierla automaticamente. Alcune (come la Grotta o la Secca a sud) sono visibili o raggiungibili solo durante la Bassa Marea!</em>»`;
      }

      this.setDialogue("Indizi Conchiglie di Marina", text, [
        { label: "«Grazie Marina, vado a prenderle!»", fn: () => this.closeDialogue() },
        ...(this.state.tide === "alta" ? [{ label: "🌊 «Imposta subito Bassa Marea»", fn: () => { this.toggleTide(); this.showRemainingShellsClues(); } }] : [])
      ]);
    }

    openQuestLog() {
      const info = this.getObjectiveInfo();
      const advice = this.getStoryProgressionAdvice();
      const shellCount = (this.state.shells || []).length;
      const uncollected = SHELL_LOCS.map((s, idx) => ({ ...s, idx })).filter((s) => !this.state.shells.includes(s.idx));

      let content = `<b>OBIETTIVO PRINCIPALE (ATTO ${this.state.act}/5):</b><br>${info.mainObj}<br>${advice}<br><br>` +
        `<b>OFFICINA DI MARINA LA CALAFATA:</b><br>${info.marinaObj}<br><br>` +
        `<b>STATO CONCHIGLIE NERE (${shellCount}/8):</b><br>`;

      if (uncollected.length === 0) {
        content += "✨ Tutte le 8 conchiglie trovate!<br>";
      } else {
        content += uncollected.map((s) => `• 🐚 ${s.clue}`).join("<br>") + "<br>";
      }

      content += `<br><b>MAREA ATTUALE:</b> ${this.state.tide.toUpperCase()} ${this.state.tide === "bassa" ? "(Secche e Grotta scoperte)" : "(Pontili bagnati)"}`;

      const choices = [];
      if (!this.state.marinaShellsDelivered && shellCount >= 4) {
        choices.push({
          label: `⭐ «Consegna 4 Conchiglie a Marina (${shellCount}/4 pronte)»`,
          fn: () => this.deliverShellsToMarina()
        });
      }
      choices.push({
        label: `🌊 «Alterna Marea (Attuale: ${this.state.tide.toUpperCase()})»`,
        fn: () => { this.toggleTide(); this.openQuestLog(); }
      });
      choices.push({
        label: "Chiudi",
        fn: () => this.restoreDialogue()
      });

      this.setDialogue("📋 Missioni, Atti & Indizi", content, choices);
    }

    collectShell(sIdx) {
      if (this.state.shells.includes(sIdx)) return;
      this.state.shells.push(sIdx);
      this.state.coinsEarned += 15;
      saveState(this.state);
      sfx("coin");
      const total = this.state.shells.length;
      if (total >= 4 && !this.state.marinaShellsDelivered) {
        this.toast(`🎉 Hai ${total} Conchiglie Nere! Vai da Marina al Cantiere a consegnarle!`);
      } else {
        this.toast(`Hai trovato una Conchiglia Nera d'Abisso! (${total}/8) +15 Monete`);
      }
      this.updateHUD();
    }

    deliverShellsToMarina() {
      const shellCount = (this.state.shells || []).length;
      if (shellCount < 4) {
        this.toast(`Ti mancano ancora ${4 - shellCount} conchiglie per il potenziamento!`);
        this.speakWithMarina();
        return;
      }

      this.state.marinaShellsDelivered = true;
      this.state.shotUpgrade = true;
      this.state.coinsEarned += 60;
      saveState(this.state);

      try {
        if (typeof window.addCoins === "function") window.addCoins(60);
      } catch (e) {}

      sfx("goal");
      this.toast("⭐ POTENZIAMENTO SBLOCCATO: Pallone di Pece & Ossidiana!");
      this.updateHUD();

      const advice = this.getStoryProgressionAdvice();

      this.setDialogue(
        "Marina la Calafata",
        `«Straordinario lavoro, ${esc(this.hero.name)}! Guarda questi riflessi blu notte... Ho estratto la polvere d'ossidiana purissima dalle 4 conchiglie e l'ho fusa a caldo con la pece liquida sui quarti di cuoio. Il tuo pallone ora è insensibile alle folate di maestrale e la tua <b>${esc(this.hero.shotName)}</b> sprigiona una traiettoria affilata e micidiale!<br><br>🎁 <b>Ricevi il Pallone di Pece & Ossidiana (+potenza, +effetto) e +60 Monete del Cantiere!</b><br><br><b>GUIDA PER PROSEGUIRE NELLA STORIA:</b><br>${advice}»`,
        [
          { label: "«Grazie Marina! Vado subito all'obiettivo!»", fn: () => this.closeDialogue() },
          { label: "🔍 «Indizi per le altre conchiglie segrete rimaste»", fn: () => this.showRemainingShellsClues() },
          { label: "📋 «Apri Diario Missioni Completo»", fn: () => this.openQuestLog() }
        ]
      );
    }

    speakWithMarina() {
      sfx("whistle");
      const shellCount = (this.state.shells || []).length;
      const delivered = !!(this.state.marinaShellsDelivered || this.state.shotUpgrade);

      if (delivered) {
        const advice = this.getStoryProgressionAdvice();
        this.setDialogue(
          "Marina la Calafata",
          `«Bentornato al cantiere, ${esc(this.hero.name)}! Il tuo <b>Pallone di Pece & Ossidiana</b> fende il vento alla perfezione. Hai trovato finora <b>${shellCount}/8 conchiglie d'abisso</b>.<br><br><b>Per proseguire nella storia:</b><br>${advice}»`,
          [
            { label: "🧭 «Come proseguo con l'obiettivo attuale?»", fn: () => this.showCurrentStoryStep() },
            { label: `🔍 «Indizi per le conchiglie rimaste (${shellCount}/8)»`, fn: () => this.showRemainingShellsClues() },
            { label: "«Tutto chiaro Marina, torno in campo!»", fn: () => this.closeDialogue() }
          ]
        );
      } else if (shellCount >= 4) {
        this.setDialogue(
          "Marina la Calafata",
          `«${esc(this.hero.name)}, hai raccolto ben <b>${shellCount} conchiglie nere d'abisso</b>! Te ne chiedevo solo 4 per il mio prototipo. Consegnamela subito e fonderò la polvere d'ossidiana sul tuo pallone per sbloccare il tiro speciale rinforzato!»`,
          [
            { label: `⭐ «Consegna 4 Conchiglie Nere a Marina (${shellCount}/4 pronte)»`, fn: () => this.deliverShellsToMarina() },
            { label: "«Come funziona questo potenziamento?»", fn: () => {
              this.setDialogue(
                "Marina la Calafata",
                `«L'ossidiana equilibra il peso del pallone e la pece sigilla le giunture contro l'umidità salmastra. Il tuo tiro guadagna velocità supersonica e precisione, perfetto per centrare i barili e spezzare le catene del faro!»`,
                [
                  { label: "⭐ «Ho le 4 conchiglie: forgialo subito!»", fn: () => this.deliverShellsToMarina() },
                  { label: "«Torno tra poco»", fn: () => this.closeDialogue() }
                ]
              );
            }},
            { label: "«Cosa devo fare per la storia principale intanto?»", fn: () => this.showCurrentStoryStep() },
            { label: "«Chiudi»", fn: () => this.closeDialogue() }
          ]
        );
      } else {
        const missing = 4 - shellCount;
        this.setDialogue(
          "Marina la Calafata",
          `«Ehi, ${esc(this.hero.name)}! Guarda questo prototipo di palla di cuoio cucita con fil di canapa e pece. Rimbalza dritto anche se il molo è bagnato! Se mi porti <b>4 conchiglie nere</b> ti preparo un potenziamento unico per il tuo tiro.<br><br>Al momento ne hai <b>${shellCount}/4</b> (te ne mancano ancora <b>${missing}</b>).»`,
          [
            { label: `🔍 «Marina, puoi darmi indizi su dove trovarle? (${missing} mancanti)»`, fn: () => this.showRemainingShellsClues() },
            ...(this.state.tide === "alta" ? [{ label: "🌊 «Passa a Bassa Marea per scoprire secche e grotta»", fn: () => { this.toggleTide(); this.speakWithMarina(); } }] : []),
            { label: "🧭 «Cosa posso fare intanto per la storia principale?»", fn: () => this.showCurrentStoryStep() },
            { label: "«Vado a cercarle, ci vediamo dopo!»", fn: () => this.closeDialogue() }
          ]
        );
      }
    }

    restoreDialogue() {
      const tx = Math.floor(this.state.heroPos.x / TS);
      const ty = Math.floor(this.state.heroPos.y / TS);
      const area = getAreaName(tx, ty);
      const info = this.getObjectiveInfo();
      const shellCount = (this.state.shells || []).length;

      const choices = [];
      if (!this.state.marinaShellsDelivered && shellCount >= 4) {
        choices.push({
          label: `⭐ «Hai ${shellCount}/4 conchiglie: Consegna a Marina!»`,
          fn: () => this.deliverShellsToMarina()
        });
      }
      choices.push({
        label: "📋 Missioni, Guida & Indizi Conchiglie",
        fn: () => this.openQuestLog()
      });

      this.setDialogue(
        "Cala Tramontana",
        `Ti trovi a <b>${area}</b>.<br><br><b>${info.mainObj}</b><br><small style="color:#fcd34d">${info.marinaObj}</small>`,
        choices
      );
    }

    updateHUD() {
      const q = (s) => this.modal.querySelector(s);
      if (!q("#calaShells")) return;

      const info = this.getObjectiveInfo();

      q("#calaShells").textContent = `${this.state.shells.length}/8`;
      q("#calaCoins").textContent = `${this.state.coinsEarned}`;

      const tx = Math.floor(this.state.heroPos.x / TS);
      const ty = Math.floor(this.state.heroPos.y / TS);
      const area = getAreaName(tx, ty);
      q("#calaLocBadge").textContent = area;

      const actNames = [
        "Atto I · L'Approdo e la Marea",
        "Atto II · L'Ombra dello Specchio",
        "Atto III · Il Sabotaggio del Faro",
        "Atto IV · La Tempesta dei Tre Fuochi",
        "Atto V · Il Derby dei Corsari"
      ];
      q("#calaActBadge").textContent = actNames[this.state.act - 1] || "Cala Tramontana";

      if (q("#calaQuestMain")) q("#calaQuestMain").textContent = info.mainObj;
      if (q("#calaQuestMarina")) q("#calaQuestMarina").textContent = info.marinaObj;

      if (q("#calaShotBadge")) {
        q("#calaShotBadge").textContent = (this.state.shotUpgrade || this.state.marinaShellsDelivered)
          ? `${this.hero.shotName} ⭐ (Potenziato)`
          : this.hero.shotName;
      }
    }

    // ---------- CALCIO DEL PALLONE & FISICA ----------
    kickBall() {
      const p = this.state.heroPos;
      const b = this.state.ballPos;

      const dist = Math.hypot(p.x - b.x, p.y - b.y);
      if (dist > 35) {
        // Se la palla è lontana, fischia a Zanna che va a prenderla!
        this.dog.fetching = true;
        sfx("whistle");
        this.toast("Zanna corre a recuperare il pallone! 🐕");
        return;
      }

      sfx("kick");
      // Se potenziato da Marina, tiro più veloce e potente!
      const pwr = (this.state.shotUpgrade || this.state.marinaShellsDelivered) ? 18.5 : 14;
      let vx = 0, vy = 0;
      if (p.dir === "up") vy = -pwr;
      if (p.dir === "down") vy = pwr;
      if (p.dir === "left") vx = -pwr;
      if (p.dir === "right") vx = pwr;

      // Influenza vento
      if (this.state.weather === "burrasca") vx += 3.5;

      b.vx = vx;
      b.vy = vy;
      b.inAir = 22;

      const upgradeNote = (this.state.shotUpgrade || this.state.marinaShellsDelivered) ? " (Tiro Potenziato!)" : "";
      this.toast(`Tiro di ${this.hero.name}! ⚽${upgradeNote}`);

      // Verifica se colpisce bersagli speciali
      this.checkBallTargets();
      setTimeout(() => this.checkBallTargets(), 280);
    }

    checkBallTargets() {
      const b = this.state.ballPos;
      const btx = Math.floor(b.x / TS);
      const bty = Math.floor(b.y / TS);

      // 1. Campana del Faro (x: 5, y: 6)
      if (Math.hypot(b.x - (5 * TS + 12), b.y - (6 * TS + 12)) < 32 || (btx === 5 && bty === 6)) {
        sfx("post");
        this.toast("RINTOCCO! La Campana del Faro risuona nel golfo! 🔔");
        if (this.state.act === 3) {
          this.toast("HAI SPEZZATO LA CATENA DEL FARO COL TUO TIRO!");
          setTimeout(() => this.triggerAct4Storm(), 1200);
        }
      }

      // 2. Barili di catrame: controlla coordinate esatte [x, y] e tile mappa
      const barrelCoords = [
        [8, 13],  // m[13][8]
        [18, 13], // m[13][18]
        [25, 9],  // m[9][25]
        [38, 15], // m[15][38] (Terrazzo dei Marosi!)
        [5, 11]   // m[11][5]
      ];
      const isBarrelTile = (this.map[bty] && this.map[bty][btx] === "B") ||
        (this.map[bty] && (this.map[bty][btx - 1] === "B" || this.map[bty][btx + 1] === "B")) ||
        barrelCoords.some(([bx, by]) => Math.hypot(b.x - (bx * TS + 12), b.y - (by * TS + 12)) < 26);

      if (isBarrelTile) {
        sfx("kick");
        this.state.coinsEarned += 10;
        saveState(this.state);
        this.toast("Barile centrato! +10 Monete del Borgo! 🎯");
        this.updateHUD();

        if (this.state.act === 1) {
          this.triggerAct2PlotTwist();
        }
      }

      // 3. Bracieri della burrasca nel capitolo 4
      if (this.state.act === 4 && btx >= 36 && bty >= 13 && bty <= 18) {
        sfx("goal");
        this.state.beaconsLit[0] = true;
        this.state.beaconsLit[1] = true;
        this.state.beaconsLit[2] = true;
        this.toast("BRACIERI ACCESI! Il gozzo di Severino vede il molo ed è salvo! 🔥");
        setTimeout(() => this.triggerAct5Derby(), 1500);
      }
    }

    // ---------- INTERAZIONE CON PERSONAGGI ----------
    interactNear() {
      const p = this.state.heroPos;
      const npcs = getNPCMapPositions(this.state);

      const near = npcs.find((n) => Math.hypot(n.x - p.x, n.y - p.y) < 38);
      if (!near) {
        // Controlla conchiglie vicine
        const ptx = Math.floor(p.x / TS);
        const pty = Math.floor(p.y / TS);
        const sIdx = SHELL_LOCS.findIndex((s, i) => !this.state.shells.includes(i) && Math.abs(s.x - ptx) <= 1 && Math.abs(s.y - pty) <= 1);
        if (sIdx !== -1) {
          this.collectShell(sIdx);
          return;
        }

        // Se è vicino al cantiere di Marina
        const distMarina = Math.hypot(p.x - 29 * TS, p.y - 9 * TS);
        if (distMarina < 52) {
          this.speakWithMarina();
          return;
        }

        this.toast("Nessuno nelle vicinanze. Avvicinati a un abitante per parlare.");
        return;
      }

      sfx("whistle");
      const c = CHARS[near.id];

      if (near.id === "severino") {
        this.setDialogue(
          c.name,
          `«${this.hero.name}, sento l'odore della resina sul tuo pallone. Questo borgo ha una storia antica: prima che la Rondine vincesse i campionati di terra, i veri marinai giocavano qui sulla scogliera. Continua ad allenarti!»`,
          [
            { label: "«Come domare il vento sul Terrazzo?»", fn: () => {
              this.setDialogue(c.name, "«Non calciare mai contro il maestrale frontalmente: dagli un mezzo giro d'effetto a rientrare, sfruttando l'eco della scogliera!»", [
                { label: "🧭 «Cosa devo fare adesso?»", fn: () => this.showCurrentStoryStep() },
                { label: "«Chiudi»", fn: () => this.closeDialogue() }
              ]);
            }},
            { label: "🧭 «Come proseguo nella storia?»", fn: () => this.showCurrentStoryStep() },
            { label: "«Vado a esplorare il molo!»", fn: () => this.closeDialogue() }
          ]
        );
      } else if (near.id === "marina") {
        this.speakWithMarina();
      } else if (near.id === "don_vindice") {
        this.setDialogue(
          c.name,
          `«Regola numero uno di Cala Tramontana: chi tocca il pallone con le mani va a remare per una settimana. Regola numero due: rispetto per le maree. Stai giocando pulito, ragazzo.»`,
          [
            { label: "🧭 «Don Vindice, come proseguo?»", fn: () => this.showCurrentStoryStep() },
            { label: "«Ricevuto, mister!»", fn: () => this.closeDialogue() }
          ]
        );
      } else if (near.id === "sibilla") {
        this.setDialogue(
          c.name,
          `«Le onde portano echi dal passato. Vedo un trofeo dorato con un'ancora spezzata. Appartiene a chi vincerà la Gabbia dei Marosi.»`,
          [
            { label: "🧭 «Cosa consigliano i coralli adesso?»", fn: () => this.showCurrentStoryStep() },
            { label: "«Grazie Sibilla»", fn: () => this.closeDialogue() }
          ]
        );
      } else if (near.id === "ombra") {
        this.setDialogue(
          c.name,
          `«Tu... hai la stessa fiamma negli occhi che avevo io nel '79. Non lasciare che i mercanti spengano la voce del faro. Dimostra che il tuo tiro può salvare Cala Tramontana!»`,
          [
            { label: "«Lo salverò, te lo giuro!»", fn: () => {
              this.triggerAct3Sabotage();
            }},
            { label: "🧭 «Cosa sta accadendo al borgo?»", fn: () => this.showCurrentStoryStep() }
          ]
        );
      } else if (near.id === "corrado") {
        this.setDialogue(
          c.name,
          `«La Gabbia è pronta. Dimostrami che la tua fama non è solo sabbia al vento!»`,
          [
            { label: "«Giochiamo subito il Derby!»", fn: () => this.startDerbyMinigame() },
            { label: "🧭 «Di cosa si tratta questo Derby?»", fn: () => this.showCurrentStoryStep() }
          ]
        );
      } else if (near.id === "eneas") {
        this.setDialogue(
          c.name,
          `«Il faro non illumina solo la rotta dei marinai, ma la geometria dei tiri impossibili. Guarda la luce e capirai la traiettoria.»`,
          [
            { label: "🧭 «Come sbloccare il cammino?»", fn: () => this.showCurrentStoryStep() },
            { label: "«Grazie Maestro Enea»", fn: () => this.closeDialogue() }
          ]
        );
      }
    }

    // ---------- LOOP PRINCIPALE & AGGIORNAMENTO ----------
    startLoop() {
      const step = () => {
        if (!this.running) return;
        this.update();
        this.draw();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    update() {
      this.frame++;

      // Movimento giocatore
      const p = this.state.heroPos;
      let dx = 0, dy = 0;
      if (this.keys["ArrowLeft"] || this.keys["a"] || this.keys["A"]) { dx -= 1; p.dir = "left"; }
      if (this.keys["ArrowRight"] || this.keys["d"] || this.keys["D"]) { dx += 1; p.dir = "right"; }
      if (this.keys["ArrowUp"] || this.keys["w"] || this.keys["W"]) { dy -= 1; p.dir = "up"; }
      if (this.keys["ArrowDown"] || this.keys["s"] || this.keys["S"]) { dy += 1; p.dir = "down"; }

      const spd = 3.2;
      if (dx && dy) { dx *= 0.707; dy *= 0.707; }

      const nx = p.x + dx * spd;
      const ny = p.y + dy * spd;

      // Collisioni con la mappa
      if (this.canWalkAt(nx, p.y)) p.x = nx;
      if (this.canWalkAt(p.x, ny)) p.y = ny;

      // Raccolta automatica conchiglie toccate dal giocatore (raggio 22px)
      SHELL_LOCS.forEach((s, idx) => {
        if (this.state.shells.includes(idx)) return;
        if (s.x > 36 && this.state.tide !== "bassa") return;
        const dist = Math.hypot(p.x - (s.x * TS + 12), p.y - (s.y * TS + 12));
        if (dist < 22) {
          this.collectShell(idx);
        }
      });

      // Aggiorna Zanna
      const dog = this.dog;
      const distHeroDog = Math.hypot(p.x - dog.x, p.y - dog.y);

      if (dog.fetching) {
        // Va a prendere la palla
        const b = this.state.ballPos;
        const ang = Math.atan2(b.y - dog.y, b.x - dog.x);
        dog.x += Math.cos(ang) * 4;
        dog.y += Math.sin(ang) * 4;
        if (Math.hypot(dog.x - b.x, dog.y - b.y) < 15) {
          dog.fetching = false;
          b.x = p.x + 10;
          b.y = p.y + 10;
          b.vx = 0; b.vy = 0;
          this.toast("Zanna ti ha riportato il pallone! 🐕⚽");
        }
      } else if (distHeroDog > 42) {
        // Segue il campione
        const ang = Math.atan2(p.y - dog.y, p.x - dog.x);
        dog.x += Math.cos(ang) * 2.8;
        dog.y += Math.sin(ang) * 2.8;
        dog.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
      }

      // Aggiorna fisica pallone
      const b = this.state.ballPos;
      if (Math.abs(b.vx) > 0.1 || Math.abs(b.vy) > 0.1) {
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.92;
        b.vy *= 0.92;

        // Rimbalzo bordi
        if (!this.canWalkAt(b.x, b.y)) {
          b.vx = -b.vx * 0.6;
          b.vy = -b.vy * 0.6;
          sfx("kick");
        }

        // Se la palla è in moto rapido, controlla bersagli in tempo reale
        if (this.frame % 3 === 0 && (Math.abs(b.vx) > 0.4 || Math.abs(b.vy) > 0.4)) {
          this.checkBallTargets();
        }
      } else {
        // Palla vicino al piede se vicina
        const dist = Math.hypot(p.x - b.x, p.y - b.y);
        if (dist < 24) {
          const ox = p.dir === "right" ? 14 : p.dir === "left" ? -14 : 0;
          const oy = p.dir === "down" ? 14 : p.dir === "up" ? -14 : 0;
          b.x = p.x + ox;
          b.y = p.y + oy;
        }
      }

      // Gabbiani
      this.gulls.forEach((g) => {
        g.x += g.vx;
        g.y += g.vy;
        if (g.x > MW * TS + 40) g.x = -40;
      });

      // Telecamera fluida
      const targetCamX = clamp(p.x - 320, 0, MW * TS - 640);
      const targetCamY = clamp(p.y - 200, 0, MH * TS - 400);
      this.camX += (targetCamX - this.camX) * 0.12;
      this.camY += (targetCamY - this.camY) * 0.12;

      if (this.frame % 30 === 0) {
        this.updateHUD();
      }
    }

    canWalkAt(x, y) {
      const tx = Math.floor(x / TS);
      const ty = Math.floor(y / TS);
      if (tx < 1 || tx >= MW - 1 || ty < 1 || ty >= MH - 1) return false;

      const tile = this.map[ty] && this.map[ty][tx];
      if (tile === "#") return false;
      if (tile === "~") return false; // Mare profondo non calpestabile
      if (tile === "F") return false; // Base faro
      if (tile === "B") return false; // Barile
      return true;
    }

    // ---------- RENDERING CANVAS ----------
    draw() {
      const ctx = this.ctx;
      const cx = Math.floor(this.camX);
      const cy = Math.floor(this.camY);

      ctx.clearRect(0, 0, 640, 400);

      // 1. Disegna Matrice di Piastrelle
      const startTX = Math.max(0, Math.floor(cx / TS));
      const endTX = Math.min(MW - 1, Math.ceil((cx + 640) / TS));
      const startTY = Math.max(0, Math.floor(cy / TS));
      const endTY = Math.min(MH - 1, Math.ceil((cy + 400) / TS));

      for (let ty = startTY; ty <= endTY; ty++) {
        for (let tx = startTX; tx <= endTX; tx++) {
          const tile = this.map[ty][tx];
          const sx = tx * TS - cx;
          const sy = ty * TS - cy;
          this.drawTile(ctx, tile, sx, sy, tx, ty);
        }
      }

      // 2. Linee del Terrazzo dei Marosi (Campo da Calcio)
      this.drawPitchLines(ctx, cx, cy);

      // 3. Edifici e Strutture 2.5D
      this.drawStructures(ctx, cx, cy);

      // 4. Conchiglie e Oggetti Raccolti
      this.drawItems(ctx, cx, cy);

      // 5. Zanna (Il Cane dei Moli)
      this.drawDog(ctx, cx, cy);

      // 6. Personaggi / NPC
      const npcs = getNPCMapPositions(this.state);
      npcs.forEach((n) => {
        this.drawNPC(ctx, n, cx, cy);
      });

      // 7. Il Campione del Giocatore
      this.drawHero(ctx, cx, cy);

      // 8. Il Pallone di Cuoio
      this.drawBall(ctx, cx, cy);

      // 9. Effetti Meteo, Maree, Gabbiani e Illuminazione
      this.drawWeatherFx(ctx, cx, cy);
    }

    drawTile(ctx, tile, sx, sy, tx, ty) {
      if (tile === ".") {
        // Pietra viva / Lastricato ligure
        ctx.fillStyle = (tx + ty) % 2 === 0 ? "#334155" : "#3b4d66";
        ctx.fillRect(sx, sy, TS, TS);
        // Texture ciottoli
        if ((tx * 3 + ty * 7) % 5 === 0) {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(sx + 4, sy + 6, 3, 2);
        }
      } else if (tile === "=") {
        // Pontile in legno
        ctx.fillStyle = (tx + ty) % 2 === 0 ? "#78350f" : "#854d0e";
        ctx.fillRect(sx, sy, TS, TS);
        ctx.fillStyle = "#451a03";
        ctx.fillRect(sx, sy, TS, 1);
        ctx.fillRect(sx + 3, sy + 3, 2, 2);
      } else if (tile === "g") {
        // Terra battuta e sale (Terrazzo dei Marosi)
        ctx.fillStyle = (tx + ty) % 2 === 0 ? "#9a3412" : "#a13e19";
        ctx.fillRect(sx, sy, TS, TS);
        if ((tx + ty * 4) % 7 === 0) {
          ctx.fillStyle = "#e2e8f0"; // grani di sale marino
          ctx.fillRect(sx + 6, sy + 8, 2, 2);
        }
      } else if (tile === "~") {
        // Mare profondo animato
        const wave = Math.sin((this.frame * 0.05) + tx * 0.4 + ty * 0.6);
        ctx.fillStyle = wave > 0.3 ? "#0369a1" : "#0284c7";
        ctx.fillRect(sx, sy, TS, TS);
        if ((tx + ty) % 4 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.fillRect(sx + 2, sy + 4 + wave * 3, 6, 2);
        }
      } else if (tile === ",") {
        // Secca / sabbia bagnata in Bassa Marea
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(sx, sy, TS, TS);
        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        ctx.fillRect(sx + 2, sy + 6, 8, 3);
      } else if (tile === "#") {
        // Scogliera / Muri
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(sx, sy, TS, TS);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(sx + 2, sy + 2, TS - 4, TS - 4);
      } else if (tile === "B") {
        // Barile
        ctx.fillStyle = "#334155";
        ctx.fillRect(sx, sy, TS, TS);
        ctx.fillStyle = "#78350f";
        ctx.fillRect(sx + 4, sy + 4, TS - 8, TS - 8);
        ctx.fillStyle = "#000";
        ctx.fillRect(sx + 3, sy + 7, TS - 6, 2);
      } else if (tile === "C") {
        // Campana di Bronzo
        ctx.fillStyle = "#334155";
        ctx.fillRect(sx, sy, TS, TS);
        ctx.fillStyle = "#d97706";
        ctx.beginPath();
        ctx.arc(sx + 12, sy + 10, 8, Math.PI, 0);
        ctx.fill();
      } else if (tile === "L") {
        // Lanterna di bronzo
        ctx.fillStyle = "#334155";
        ctx.fillRect(sx, sy, TS, TS);
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(sx + 8, sy + 6, 8, 8);
      } else if (tile === "T") {
        // Nasse e reti
        ctx.fillStyle = "#334155";
        ctx.fillRect(sx, sy, TS, TS);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(sx + 4, sy + 6, TS - 8, TS - 10);
      } else {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(sx, sy, TS, TS);
      }
    }

    drawPitchLines(ctx, cx, cy) {
      // Rettangolo del Terrazzo dei Marosi
      const px0 = 26 * TS - cx;
      const py0 = 13 * TS - cy;
      const pw = 17 * TS;
      const ph = 8 * TS;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.strokeRect(px0, py0, pw, ph);

      // Linea di metà campo
      const midX = px0 + pw / 2;
      ctx.beginPath();
      ctx.moveTo(midX, py0);
      ctx.lineTo(midX, py0 + ph);
      ctx.stroke();

      // Cerchio di centrocampo
      ctx.beginPath();
      ctx.arc(midX, py0 + ph / 2, 28, 0, Math.PI * 2);
      ctx.stroke();

      // Porte in tronchi marini
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(px0 - 4, py0 + 20, 4, ph - 40);
      ctx.fillRect(px0 + pw, py0 + 20, 4, ph - 40);
    }

    drawStructures(ctx, cx, cy) {
      // 1. Locanda della Prua Sommersa
      const lx = 16 * TS - cx;
      const ly = 3 * TS - cy;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(lx, ly, 9 * TS, 4 * TS);
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(lx + 6, ly + 6, 9 * TS - 12, 10);
      ctx.fillStyle = "#ffd23f";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("LA PRUA SOMMERSA", lx + 12, ly + 14);

      // 2. Faro d'Ossidiana
      const fx = 3 * TS - cx;
      const fy = 1 * TS - cy;
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(fx + 10, fy, 32, 6 * TS);
      // Strisce nere
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(fx + 10, fy + 24, 32, 16);
      ctx.fillRect(fx + 10, fy + 64, 32, 16);
      // Cupola e raggio verde
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(fx + 26, fy + 8, 14, Math.PI, 0);
      ctx.fill();

      // Fascio di luce rotante
      const beamAngle = (this.frame * 0.03);
      ctx.save();
      ctx.translate(fx + 26, fy + 8);
      ctx.rotate(beamAngle);
      ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(160, -40);
      ctx.lineTo(160, 40);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Cantiere Navale di Marina (x: 27..33, y: 3..7)
      const mx = 27 * TS - cx;
      const my = 3 * TS - cy;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(mx, my, 7 * TS, 4 * TS);
      ctx.fillStyle = "#eab308";
      ctx.fillRect(mx + 4, my + 4, 7 * TS - 8, 12);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("CANTIERE DI MARINA", mx + 8, my + 13);

      // Banco da lavoro e barca in costruzione
      ctx.fillStyle = "#78350f";
      ctx.fillRect(mx + 10, my + 4 * TS - 6, 28, 6);
      ctx.fillStyle = "#b45309";
      ctx.beginPath();
      ctx.arc(mx + 24, my + 4 * TS - 3, 10, 0, Math.PI);
      ctx.fill();
    }

    drawItems(ctx, cx, cy) {
      // Disegna conchiglie non ancora raccolte con luccichio d'abisso
      SHELL_LOCS.forEach((s, idx) => {
        if (this.state.shells.includes(idx)) return;
        if (s.x > 36 && this.state.tide !== "bassa") return; // Nascosta dall'alta marea

        const sx = s.x * TS - cx + 12;
        const sy = s.y * TS - cy + 12;

        const bob = Math.sin(this.frame * 0.12 + idx) * 2.5;
        const sparkle = Math.sin(this.frame * 0.18 + idx * 1.5);

        // Alone luminoso
        ctx.fillStyle = `rgba(56, 189, 248, ${0.25 + sparkle * 0.15})`;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, 8 + sparkle * 2, 0, Math.PI * 2);
        ctx.fill();

        // Guscio conchiglia nera d'ossidiana
        ctx.fillStyle = "#090d16";
        ctx.beginPath();
        ctx.arc(sx, sy + bob, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Spirale madreperla interna
        ctx.fillStyle = sparkle > 0 ? "#ffd23f" : "#38bdf8";
        ctx.beginPath();
        ctx.arc(sx, sy + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    drawHero(ctx, cx, cy) {
      const h = this.hero;
      const p = this.state.heroPos;
      const sx = p.x - cx;
      const sy = p.y - cy;

      // Ombra
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + 14, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo / Maglia del campione
      ctx.fillStyle = h.shirt || "#1f5fbf";
      ctx.fillRect(sx - 7, sy - 4, 14, 16);

      // Numero di maglia
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(h.num || 9), sx, sy + 7);

      // Testa / Pelle
      ctx.fillStyle = h.skin || "#f2c9a0";
      ctx.beginPath();
      ctx.arc(sx, sy - 10, 9, 0, Math.PI * 2);
      ctx.fill();

      // Capelli
      ctx.fillStyle = h.hair || "#2b1d14";
      if (h.style === "spiky") {
        ctx.beginPath();
        ctx.moveTo(sx - 9, sy - 14);
        ctx.lineTo(sx - 4, sy - 22);
        ctx.lineTo(sx, sy - 15);
        ctx.lineTo(sx + 5, sy - 22);
        ctx.lineTo(sx + 9, sy - 14);
        ctx.closePath();
        ctx.fill();
      } else if (h.style === "long") {
        ctx.fillRect(sx - 10, sy - 16, 20, 10);
        ctx.fillRect(sx - 11, sy - 10, 4, 14);
        ctx.fillRect(sx + 7, sy - 10, 4, 14);
      } else {
        ctx.beginPath();
        ctx.arc(sx, sy - 13, 9, Math.PI, 0);
        ctx.fill();
      }

      // Occhi
      ctx.fillStyle = "#1e293b";
      if (p.dir === "right") {
        ctx.fillRect(sx + 2, sy - 11, 2, 2);
      } else if (p.dir === "left") {
        ctx.fillRect(sx - 4, sy - 11, 2, 2);
      } else {
        ctx.fillRect(sx - 3, sy - 11, 2, 2);
        ctx.fillRect(sx + 2, sy - 11, 2, 2);
      }

      // Gambe in camminata
      const walk = (this.keys["ArrowLeft"] || this.keys["ArrowRight"] || this.keys["ArrowUp"] || this.keys["ArrowDown"]) ? Math.sin(this.frame * 0.3) * 4 : 0;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(sx - 6, sy + 12 + walk, 4, 5);
      ctx.fillRect(sx + 2, sy + 12 - walk, 4, 5);
    }

    drawNPC(ctx, n, cx, cy) {
      const c = CHARS[n.id];
      if (!c) return;

      const sx = n.x - cx;
      const sy = n.y - cy;

      // Ombra
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + 14, 9, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      if (c.ghost) {
        ctx.globalAlpha = 0.75 + Math.sin(this.frame * 0.1) * 0.2;
      }

      // Corpo
      ctx.fillStyle = c.shirt || "#64748b";
      ctx.fillRect(sx - 7, sy - 4, 14, 16);

      // Testa
      ctx.fillStyle = c.skin || "#f2c9a0";
      ctx.beginPath();
      ctx.arc(sx, sy - 10, 9, 0, Math.PI * 2);
      ctx.fill();

      // Capelli
      ctx.fillStyle = c.hair || "#334155";
      ctx.beginPath();
      ctx.arc(sx, sy - 13, 9, Math.PI, 0);
      ctx.fill();

      // Accessori unici
      if (c.beard) {
        ctx.fillStyle = "#e0e0e0";
        ctx.fillRect(sx - 4, sy - 5, 8, 4);
      }
      if (c.bandana) {
        ctx.fillStyle = c.bandana;
        ctx.fillRect(sx - 9, sy - 17, 18, 5);
      }
      if (c.pipe) {
        ctx.fillStyle = "#78350f";
        ctx.fillRect(sx + 3, sy - 6, 6, 2);
      }

      // Nome galleggiante
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(c.name, sx, sy - 24);

      ctx.globalAlpha = 1.0;
    }

    drawDog(ctx, cx, cy) {
      const d = this.dog;
      const sx = d.x - cx;
      const sy = d.y - cy;

      // Ombra
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + 8, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo del cane
      ctx.fillStyle = "#b45309";
      ctx.fillRect(sx - 8, sy - 4, 16, 10);

      // Testa
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.arc(sx + (d.dir === "left" ? -8 : 8), sy - 5, 6, 0, Math.PI * 2);
      ctx.fill();

      // Orecchie e coda scodinzolante
      const tail = Math.sin(this.frame * 0.4) * 4;
      ctx.fillStyle = "#78350f";
      ctx.fillRect(sx + (d.dir === "left" ? 6 : -8), sy - 8 + tail, 3, 6);

      // Collare azzurro
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(sx + (d.dir === "left" ? -6 : 4), sy - 4, 3, 4);
    }

    drawBall(ctx, cx, cy) {
      const b = this.state.ballPos;
      const sx = b.x - cx;
      const sy = b.y - cy;

      // Ombra della palla
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + 6, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      const upgraded = !!(this.state.shotUpgrade || this.state.marinaShellsDelivered);

      if (upgraded) {
        // Pallone di Pece & Ossidiana di Marina
        // Glow azzurro abisso
        ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
        ctx.beginPath();
        ctx.arc(sx, sy, 8, 0, Math.PI * 2);
        ctx.fill();

        // Sfera scura ossidiana
        ctx.fillStyle = "#090d16";
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Cuciture oro/pece
        ctx.fillStyle = "#eab308";
        ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3);
      } else {
        // Sfera di cuoio classica
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dettagli pentagoni
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(sx - 2, sy - 2, 4, 4);
      }
    }

    drawWeatherFx(ctx, cx, cy) {
      // 1. Gabbiani
      this.gulls.forEach((g) => {
        const sx = g.x - cx;
        const sy = g.y - cy;
        ctx.fillStyle = "#f8fafc";
        const flap = Math.sin(this.frame * 0.2 + g.x) * 4;
        ctx.beginPath();
        ctx.moveTo(sx - 6, sy + flap);
        ctx.lineTo(sx, sy);
        ctx.lineTo(sx + 6, sy + flap);
        ctx.stroke();
      });

      // 2. Pioggia e Lampi se Burrasca
      if (this.state.weather === "burrasca") {
        ctx.strokeStyle = "rgba(186, 230, 253, 0.4)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 60; i++) {
          const rx = (i * 37 + this.frame * 8) % 640;
          const ry = (i * 23 + this.frame * 18) % 400;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 4, ry + 12);
          ctx.stroke();
        }

        // Lampo improvviso casuale
        if (this.frame % 160 === 0) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
          ctx.fillRect(0, 0, 640, 400);
        }
      } else if (this.state.weather === "nebbia") {
        // Nebbia velata
        ctx.fillStyle = "rgba(148, 163, 184, 0.22)";
        ctx.fillRect(0, 0, 640, 400);
      }
    }

    // ---------- DISTRUZIONE E CHIUSURA PULITA ----------
    destroy() {
      this.running = false;
      window.removeEventListener("keydown", this.onKeyDown);
      window.removeEventListener("keyup", this.onKeyUp);

      if (this.modal && this.modal.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      activeInstance = null;

      if (this.returnCallback) {
        this.returnCallback();
      }
    }
  }

  // Registra globalmente
  window.openCalaTramontana = openCalaTramontana;
  window.openBorgoAlternativo = openCalaTramontana;

  // Aggiungi a window.__borgoApi se presente
  function hookBorgoApi() {
    const api = window.__borgoApi;
    if (api && api.MN_BORGO_BTN && Array.isArray(api.MN_BORGO_BTN)) {
      api.MN_BORGO_BTN.push(() => ({
        label: "🌊 Battello per Cala Tramontana",
        sub: "Il borgo marino alternativo del tuo campione",
        cls: "hot",
        fn: () => openCalaTramontana(() => {
          if (typeof window.borgo === "function") window.borgo();
        })
      }));
    } else {
      setTimeout(hookBorgoApi, 300);
    }
  }
  hookBorgoApi();

})();
