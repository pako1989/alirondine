// js/moviola-arcade.js - Minigioco Moviola '84 (CRT) e Banco Moviola U-matic
(function () {
  "use strict";

  // =========================================================================
  // 1. Minigioco Arcade «Moviola '84» per Salone delle Saghe e Capitoli
  // =========================================================================
  function startMoviolaArcade(opts) {
    opts = opts || {};
    const onDone = opts.onDone || opts.done || function () {};
    const diff = opts.diff || opts.level || 1; // 1: Primavera, 2: Derby, 3: Campioni

    // Rimuovi eventuale overlay precedente
    const old = document.getElementById("moviolaOverlay");
    if (old) old.remove();

    const ov = document.createElement("div");
    ov.id = "moviolaOverlay";
    ov.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(5,10,18,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;touch-action:none;";

    ov.innerHTML = `
      <div style="width:95%;max-width:440px;background:#0d1522;border:2px solid #ca8a04;border-radius:12px;box-shadow:0 0 25px rgba(234,179,8,0.3);overflow:hidden;display:flex;flex-direction:column;">
        <!-- Header TV '84 -->
        <div style="background:#1e293b;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
          <div style="font-weight:900;color:#facc15;font-size:0.95rem;letter-spacing:1px;display:flex;align-items:center;gap:6px;">
            <span>📼 MOVIOLA '84</span>
            <span style="font-size:0.7rem;background:#854d0e;color:#fef08a;padding:2px 6px;border-radius:4px;">DIFF. ${diff}</span>
          </div>
          <div id="movTimer" style="font-family:monospace;font-weight:900;color:#ef4444;font-size:1.1rem;">45.0s</div>
        </div>

        <!-- Monitor CRT Raster -->
        <div style="position:relative;width:100%;height:220px;background:#05080e;overflow:hidden;">
          <canvas id="movCanvas" width="360" height="220" style="width:100%;height:100%;display:block;image-rendering:pixelated;"></canvas>
          <!-- Scanlines & Curved Screen Effect -->
          <div style="position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.35) 3px, rgba(0,0,0,0.35) 4px);box-shadow:inset 0 0 40px rgba(0,0,0,0.8);"></div>
        </div>

        <!-- Quesito Regolamentare -->
        <div id="movQuestionBox" style="padding:10px 14px;background:#0f172a;border-top:1px solid #1e293b;border-bottom:1px solid #1e293b;">
          <div style="font-size:0.72rem;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">CASO DA GIUDICARE:</div>
          <div id="movQuestion" style="font-size:0.92rem;font-weight:800;color:#fff;">Caricamento bobina...</div>
        </div>

        <!-- Controlli Banco Montaggio -->
        <div style="padding:10px 14px;background:#0a0f18;display:flex;flex-direction:column;gap:8px;">
          <!-- Slider Temporale / Scrubbing -->
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:0.75rem;color:#94a3b8;font-weight:700;">FRAME:</span>
            <input id="movSlider" type="range" min="0" max="100" value="0" style="flex:1;accent-color:#eab308;cursor:pointer;">
            <span id="movFrameNum" style="font-family:monospace;font-size:0.8rem;color:#fde047;width:34px;text-align:right;">000</span>
          </div>

          <!-- Pulsanti Jog & Velocità -->
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <div style="display:flex;gap:4px;">
              <button id="btnMovRev" style="background:#1e293b;color:#fff;border:1px solid #475569;border-radius:6px;padding:6px 10px;font-size:0.75rem;cursor:pointer;">◀ -1</button>
              <button id="btnMovPlay" style="background:#1e293b;color:#facc15;border:1px solid #475569;border-radius:6px;padding:6px 12px;font-size:0.75rem;font-weight:700;cursor:pointer;">▶ PLAY</button>
              <button id="btnMovFwd" style="background:#1e293b;color:#fff;border:1px solid #475569;border-radius:6px;padding:6px 10px;font-size:0.75rem;cursor:pointer;">+1 ▶</button>
            </div>
            <button id="btnMovDecision" style="flex:1;max-width:170px;background:linear-gradient(180deg,#eab308 0%,#a16207 100%);color:#000;border:1px solid #fef08a;border-radius:8px;padding:8px 12px;font-weight:900;font-size:0.85rem;cursor:pointer;box-shadow:0 2px 0 #713f12;">STOP & FISCHIA</button>
          </div>
        </div>

        <!-- Footer / Punteggio -->
        <div style="padding:6px 14px;background:#05080e;display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;">
          <div>PUNTEGGIO: <b id="movScore" style="color:#22c55e;">0</b> / 1000</div>
          <div>ERRORI: <b id="movErrors" style="color:#ef4444;">0</b> / 2</div>
          <button id="btnMovClose" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:0.75rem;">✕ Abbandona</button>
        </div>
      </div>
    `;

    document.body.appendChild(ov);

    const canvas = ov.querySelector("#movCanvas");
    const ctx = canvas.getContext("2d");
    const slider = ov.querySelector("#movSlider");
    const frameNum = ov.querySelector("#movFrameNum");
    const timerEl = ov.querySelector("#movTimer");
    const qEl = ov.querySelector("#movQuestion");
    const scoreEl = ov.querySelector("#movScore");
    const errorsEl = ov.querySelector("#movErrors");
    const btnPlay = ov.querySelector("#btnMovPlay");
    const btnRev = ov.querySelector("#btnMovRev");
    const btnFwd = ov.querySelector("#btnMovFwd");
    const btnDecision = ov.querySelector("#btnMovDecision");
    const btnClose = ov.querySelector("#btnMovClose");

    // Dati dei 3 casi
    const CASES_DATA = [
      {
        q: "L'attaccante del Rondine tocca con il braccio o col petto?",
        optA: "FALLO DI MANO (RIGORE ANNULLATO)",
        optB: "CONTROLLO DI PETTO REGOLARE",
        correctIsA: true,
        impactFrame: 54,
        desc: "Al minuto 94', l'attaccante tocca la sfera con il polso sinistro proteso."
      },
      {
        q: "Il pallone ha varcato completamente la linea prima del rinvio del portiere?",
        optA: "GOL VALIDO (PALLA OLTRE LA LINEA)",
        optB: "SALVATAGGIO SULLA LINEA (NO GOL)",
        correctIsA: true,
        impactFrame: 68,
        desc: "La telecamera sulla linea bianca mostra un dito di luce tra cuoio e gesso."
      },
      {
        q: "C'è fuorigioco sul colpo di testa del centravanti avversario?",
        optA: "FUORIGIOCO NETTO",
        optB: "IN POSIZIONE REGOLARE",
        correctIsA: false,
        impactFrame: 42,
        desc: "Il terzino Banti teneva in gioco l'attaccante con lo scarpino destro arretrato."
      }
    ];

    let currentCaseIdx = 0;
    let score = 0;
    let errors = 0;
    let frame = 0;
    let isPlaying = false;
    let timer = 45.0;
    let timerInterval = null;
    let animId = null;

    function renderFrame() {
      const curCase = CASES_DATA[currentCaseIdx];
      const w = canvas.width, h = canvas.height;
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, w, h);

      // Erba del campo d'epoca sgranata
      ctx.fillStyle = "#1e3a5f";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.45, 0); ctx.lineTo(w * 0.45, h);
      ctx.stroke();

      // Linea di porta o area
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 3;
      ctx.strokeRect(w * 0.65, 30, w * 0.3, h - 60);

      // Rumore video VHS/U-matic (interferenze orizzontali)
      const noiseLines = Math.floor(Math.random() * 4);
      for (let i = 0; i < noiseLines; i++) {
        const ny = Math.floor(Math.random() * h);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(0, ny, w, 2);
      }

      // Giocatori sagomati in pixel art animata
      const prog = frame / 100;
      const attackerX = 100 + prog * 110;
      const attackerY = 110 + Math.sin(prog * 12) * 8;
      const defenderX = 180 + Math.cos(prog * 8) * 15;
      const defenderY = 115;

      // Difensore
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(defenderX, defenderY - 26, 12, 18);
      ctx.fillStyle = "#fde047";
      ctx.beginPath(); ctx.arc(defenderX + 6, defenderY - 32, 6, 0, Math.PI * 2); ctx.fill();

      // Attaccante
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(attackerX, attackerY - 26, 12, 18);
      ctx.fillStyle = "#fde047";
      ctx.beginPath(); ctx.arc(attackerX + 6, attackerY - 32, 6, 0, Math.PI * 2); ctx.fill();

      // Palla da calcio
      const ballX = 120 + prog * 120;
      const ballY = 105 - Math.sin(prog * Math.PI) * 45;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(ballX, ballY, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.beginPath(); ctx.arc(ballX - 1, ballY - 1, 2, 0, Math.PI * 2); ctx.fill();

      // Timecode televisivo sovraimpresso
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(10, 10, 110, 20);
      ctx.fillStyle = "#22c55e";
      ctx.font = "900 11px monospace";
      const tc = `REC 00:93:${String(Math.floor(frame * 0.6)).padStart(2, "0")}`;
      ctx.fillText(tc, 16, 24);

      // Tracciamento cursore impatto
      if (Math.abs(frame - curCase.impactFrame) <= 3) {
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 2;
        ctx.strokeRect(ballX - 16, ballY - 16, 32, 32);
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("IMPATTO", ballX - 18, ballY - 20);
      }

      frameNum.textContent = String(frame).padStart(3, "0");
      slider.value = frame;
    }

    function loop() {
      if (isPlaying) {
        frame = (frame + 1) % 101;
        renderFrame();
      }
      animId = requestAnimationFrame(loop);
    }

    function loadCase(idx) {
      currentCaseIdx = idx;
      frame = 0;
      isPlaying = true;
      btnPlay.textContent = "⏸ PAUSA";
      const c = CASES_DATA[idx];
      qEl.textContent = `(${idx + 1}/3) ${c.q}`;
      renderFrame();
    }

    // Eventi Slider e Tasti Jog
    slider.addEventListener("input", (e) => {
      isPlaying = false;
      btnPlay.textContent = "▶ PLAY";
      frame = parseInt(e.target.value, 10);
      renderFrame();
    });

    btnPlay.addEventListener("click", () => {
      isPlaying = !isPlaying;
      btnPlay.textContent = isPlaying ? "⏸ PAUSA" : "▶ PLAY";
    });

    btnRev.addEventListener("click", () => {
      isPlaying = false;
      btnPlay.textContent = "▶ PLAY";
      frame = Math.max(0, frame - 1);
      renderFrame();
    });

    btnFwd.addEventListener("click", () => {
      isPlaying = false;
      btnPlay.textContent = "▶ PLAY";
      frame = Math.min(100, frame + 1);
      renderFrame();
    });

    // Decisione STOP & FISCHIA
    btnDecision.addEventListener("click", () => {
      isPlaying = false;
      btnPlay.textContent = "▶ PLAY";
      const curCase = CASES_DATA[currentCaseIdx];
      const delta = Math.abs(frame - curCase.impactFrame);

      // Finestra di tolleranza
      const maxDelta = diff === 1 ? 8 : (diff === 2 ? 5 : 3);

      if (delta <= maxDelta) {
        const gained = Math.round(350 - delta * 20);
        score += gained;
        scoreEl.textContent = score;
        if (window.toast) window.toast(`FERMO IMMAGINE ESATTO! +${gained} pt`, "ok", "📼");
      } else {
        errors++;
        errorsEl.textContent = errors;
        if (window.toast) window.toast(`FERMO IMMAGINE IMPRECISO (scarto: ${delta} frame)`, "error", "⚠️");
      }

      if (errors >= 2) {
        finishGame(false, "Troppi errori di valutazione. Il processo mediatico ti ha travolto.");
        return;
      }

      if (currentCaseIdx + 1 < CASES_DATA.length) {
        loadCase(currentCaseIdx + 1);
      } else {
        const win = score >= (diff === 1 ? 650 : (diff === 2 ? 800 : 950));
        finishGame(win, win ? "Hai inchiodato i colpevoli con la moviola!" : "Punteggio insufficiente per dimostrare il complotto.");
      }
    });

    function finishGame(win, msg) {
      clearInterval(timerInterval);
      cancelAnimationFrame(animId);
      ov.remove();
      if (window.toast) window.toast(msg, win ? "ok" : "warn", "📼");
      onDone({ win, score });
    }

    btnClose.addEventListener("click", () => {
      clearInterval(timerInterval);
      cancelAnimationFrame(animId);
      ov.remove();
      onDone({ win: false, score });
    });

    // Timer countdown
    timerInterval = setInterval(() => {
      timer -= 0.1;
      if (timer <= 0) {
        timer = 0;
        finishGame(score >= 800, "Tempo scaduto per la trasmissione!");
      }
      timerEl.textContent = timer.toFixed(1) + "s";
    }, 100);

    loadCase(0);
    animId = requestAnimationFrame(loop);
  }

  // =========================================================================
  // 2. Banco Moviola U-matic per la Storia (Keyframe & Tracking analogico)
  // =========================================================================
  function openBancoMoviola(opts) {
    opts = opts || {};
    const title = opts.title || "BANCO MONTAGGIO U-MATIC '84";
    const onKeyframe = opts.onKeyframe || function () {};
    const onDone = opts.onDone || function () {};

    const old = document.getElementById("bancoMoviolaOverlay");
    if (old) old.remove();

    const ov = document.createElement("div");
    ov.id = "bancoMoviolaOverlay";
    ov.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(8,12,20,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;";

    ov.innerHTML = `
      <div style="width:95%;max-width:440px;background:#0d1522;border:2px solid #ca8a04;border-radius:12px;padding:14px;box-shadow:0 0 30px rgba(234,179,8,0.35);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h3 style="font-size:1rem;color:#facc15;font-weight:900;margin:0;">📼 ${title}</h3>
          <button id="btnBancoClose" style="background:#1e293b;border:1px solid #475569;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer;">✕</button>
        </div>

        <!-- Schermo CRT con Noise e Tracking -->
        <div style="position:relative;width:100%;height:180px;background:#05080e;border:1px solid #334155;border-radius:8px;overflow:hidden;margin-bottom:12px;">
          <canvas id="bancoCanvas" width="340" height="180" style="width:100%;height:100%;display:block;image-rendering:pixelated;"></canvas>
          <div id="bancoNoiseOverlay" style="position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 3px, rgba(255,255,255,0.18) 4px, rgba(255,255,255,0.18) 5px);"></div>
        </div>

        <!-- Manopola Tracking & Canali Audio -->
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px;">
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px;">
              <span style="color:#94a3b8;font-weight:700;">REGOLAZIONE TRACKING ANALOGICO:</span>
              <span id="bancoTrackingVal" style="color:#fde047;font-family:monospace;">0%</span>
            </div>
            <input id="bancoTracking" type="range" min="0" max="100" value="20" style="width:100%;accent-color:#eab308;cursor:pointer;">
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:0.75rem;color:#94a3b8;font-weight:700;">CANALE AUDIO:</div>
            <div style="display:flex;gap:6px;">
              <button id="btnAudioCh1" style="background:#ca8a04;color:#000;border:1px solid #fef08a;border-radius:6px;padding:4px 10px;font-size:0.75rem;font-weight:700;cursor:pointer;">CH 1: CRONACA</button>
              <button id="btnAudioCh2" style="background:#1e293b;color:#cbd5e1;border:1px solid #475569;border-radius:6px;padding:4px 10px;font-size:0.75rem;cursor:pointer;">CH 2: CAMPO</button>
            </div>
          </div>
        </div>

        <button id="btnBancoCapture" style="width:100%;background:linear-gradient(180deg,#eab308 0%,#a16207 100%);color:#000;border:1px solid #fef08a;border-radius:8px;padding:12px;font-weight:900;font-size:0.95rem;cursor:pointer;box-shadow:0 3px 0 #713f12;">
          📸 CATTURA FERMO IMMAGINE NEL DOSSIER
        </button>
      </div>
    `;

    document.body.appendChild(ov);

    const canvas = ov.querySelector("#bancoCanvas");
    const ctx = canvas.getContext("2d");
    const trackingInput = ov.querySelector("#bancoTracking");
    const trackingVal = ov.querySelector("#bancoTrackingVal");
    const noiseOverlay = ov.querySelector("#bancoNoiseOverlay");
    const btnCh1 = ov.querySelector("#btnAudioCh1");
    const btnCh2 = ov.querySelector("#btnAudioCh2");
    const btnCapture = ov.querySelector("#btnBancoCapture");
    const btnClose = ov.querySelector("#btnBancoClose");

    let tracking = 20;
    let selectedCh = 1;

    function renderBanco() {
      const w = canvas.width, h = canvas.height;
      ctx.fillStyle = "#0c172b";
      ctx.fillRect(0, 0, w, h);

      // Scena della moviola
      ctx.fillStyle = "#1e3a5f";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 20, w - 80, h - 40);

      // L'arbitro che fischia con anticipo sospetto
      ctx.fillStyle = "#334155";
      ctx.fillRect(160, 70, 16, 26);
      ctx.fillStyle = "#fde047";
      ctx.beginPath(); ctx.arc(168, 62, 8, 0, Math.PI * 2); ctx.fill();
      // Braccio alzato col fischietto
      ctx.strokeStyle = "#fde047"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(168, 72); ctx.lineTo(190, 52); ctx.stroke();
      ctx.fillStyle = "#e2e8f0"; ctx.fillRect(188, 50, 4, 3);

      // Se il tracking è vicino a 80%, l'immagine diventa limpidissima
      const clarity = Math.max(0, 1 - Math.abs(tracking - 80) / 40);
      noiseOverlay.style.opacity = String(1 - clarity * 0.85);

      trackingVal.textContent = Math.round(clarity * 100) + "% NITIDEZZA";
    }

    trackingInput.addEventListener("input", (e) => {
      tracking = parseInt(e.target.value, 10);
      renderBanco();
    });

    btnCh1.addEventListener("click", () => {
      selectedCh = 1;
      btnCh1.style.background = "#ca8a04"; btnCh1.style.color = "#000";
      btnCh2.style.background = "#1e293b"; btnCh2.style.color = "#cbd5e1";
    });

    btnCh2.addEventListener("click", () => {
      selectedCh = 2;
      btnCh2.style.background = "#ca8a04"; btnCh2.style.color = "#000";
      btnCh1.style.background = "#1e293b"; btnCh1.style.color = "#cbd5e1";
    });

    btnCapture.addEventListener("click", () => {
      const clarity = Math.max(0, 1 - Math.abs(tracking - 80) / 40);
      ov.remove();
      const res = { evidence: true, clarity: Math.round(clarity * 100), channel: selectedCh };
      onKeyframe(res);
      onDone(res);
    });

    btnClose.addEventListener("click", () => {
      ov.remove();
      onDone({ evidence: false });
    });

    renderBanco();
  }

  // Esportazione globale
  window.__moviolaArcade = {
    start: startMoviolaArcade,
    startMoviolaArcade: startMoviolaArcade,
    openBanco: openBancoMoviola,
    openBancoMoviola: openBancoMoviola
  };
})();
