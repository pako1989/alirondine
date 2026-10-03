// ================= v18 · IL GOZZO DI BACICCIA: DERBY DEL GOLFO =================
// Minigioco nautico tra le onde del Golfo di Borgo Marino:
// - Navigazione con il tipico gozzo ligure in legno e motore entrobordo
// - Onde marine dinamiche con schiuma, scogli a picco e gabbiani in volo
// - Sfida 1: "Recupero Palloni Perduti" (raccogli i palloni storici finiti in mare)
// - Sfida 2: "Regata di San Pietro" (gara di velocità a tempo tra le boe fino al Faro)
(function () {
  const K_SAVE = "ali-di-rondine.gozzo";
  let modalEl = null, canvas = null, ctx = null, animFrame = null;
  let isPlaying = false, returnCallback = null;

  function loadRec() {
    try {
      const d = JSON.parse(localStorage.getItem(K_SAVE));
      if (d && typeof d === "object") return d;
    } catch (e) {}
    return { ballsCollected: 0, regattaBestTime: 0, cups: 0 };
  }
  function saveRec(r) {
    try { localStorage.setItem(K_SAVE, JSON.stringify(r)); } catch (e) {}
  }

  function playBoatEngineSound() {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(65, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, actx.currentTime + 0.1);
      g.gain.setValueAtTime(0.12, actx.currentTime);
      g.gain.linearRampToValueAtTime(0.001, actx.currentTime + 0.1);
      osc.connect(g);
      g.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.11);
    } catch (e) {}
  }

  function playHornSound() {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, actx.currentTime);
      osc.frequency.setValueAtTime(175, actx.currentTime + 0.3);
      g.gain.setValueAtTime(0.2, actx.currentTime);
      g.gain.linearRampToValueAtTime(0.001, actx.currentTime + 0.6);
      osc.connect(g);
      g.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.65);
    } catch (e) {}
  }

  const GW = 440, GH = 280;
  let BOAT_STATE = null;

  function initGozzoGame(mode = "recupero") {
    BOAT_STATE = {
      mode, // "recupero" o "regata"
      x: 100,
      y: 180,
      angle: 0,
      speed: 0,
      rudder: 0,
      throttle: 0,
      engineTicker: 0,
      waveTimer: 0,
      gulls: [
        { x: 50, y: 40, vx: 0.8, vy: 0.1 },
        { x: 220, y: 30, vx: -0.6, vy: 0.15 },
        { x: 340, y: 55, vx: 0.5, vy: -0.1 }
      ],
      rocks: [
        { x: 80, y: 70, r: 18 },
        { x: 240, y: 110, r: 24 },
        { x: 360, y: 80, r: 20 },
        { x: 170, y: 220, r: 16 }
      ],
      balls: [
        { x: 70, y: 120, name: "Pallone del 1982", got: false },
        { x: 280, y: 60, name: "Super Santos di Tina", got: false },
        { x: 330, y: 210, name: "Tango della Rondine", got: false },
        { x: 190, y: 60, name: "Cuoio di Papà", got: false },
        { x: 390, y: 140, name: "Pallone dorato", got: false }
      ],
      buoys: [
        { x: 140, y: 180, r: 12, passed: false },
        { x: 220, y: 120, r: 12, passed: false },
        { x: 310, y: 70, r: 12, passed: false },
        { x: 380, y: 160, r: 12, passed: false }
      ],
      time: 0,
      collected: 0,
      over: false
    };
  }

  function tick() {
    if (!BOAT_STATE || BOAT_STATE.over) return;
    const s = BOAT_STATE;
    s.waveTimer += 0.05;
    s.time++;

    // Engine sound tick
    s.engineTicker++;
    if (s.throttle > 0 && s.engineTicker % (s.throttle > 1 ? 9 : 14) === 0) {
      playBoatEngineSound();
    }

    // Steering
    s.angle += s.rudder * 0.035 * (s.speed !== 0 ? 1 : 0);

    // Forward physics
    const targetSp = s.throttle * 1.5;
    s.speed += (targetSp - s.speed) * 0.06;

    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;

    // Constrain to water boundaries
    s.x = Math.max(25, Math.min(GW - 25, s.x));
    s.y = Math.max(35, Math.min(GH - 35, s.y));

    // Gull movements
    s.gulls.forEach((g) => {
      g.x += g.vx;
      g.y += g.vy;
      if (g.x < -20) g.x = GW + 20;
      if (g.x > GW + 20) g.x = -20;
    });

    // Rock collisions
    s.rocks.forEach((r) => {
      if (Math.hypot(s.x - r.x, s.y - r.y) < r.r + 14) {
        s.speed = -0.8; // Bounce off rock
        if (window.haptic) window.haptic(30);
      }
    });

    // Mode: Recupero Palloni
    if (s.mode === "recupero") {
      s.balls.forEach((b) => {
        if (!b.got && Math.hypot(s.x - b.x, s.y - b.y) < 22) {
          b.got = true;
          s.collected++;
          if (window.sfx) window.sfx("goal");
          if (window.toast) window.toast(`Recuperato: ${b.name}! (+3 monete)`, "success", "🌊");
          if (window.addCoins) window.addCoins(3);
          const r = loadRec();
          r.ballsCollected++;
          saveRec(r);

          if (s.collected >= s.balls.length) {
            s.over = true;
            if (window.toast) window.toast("Hai recuperato tutti i palloni del Golfo! 🏆", "success", "⚓");
            if (window.addCoins) window.addCoins(15);
          }
        }
      });
    }

    // Mode: Regata di San Pietro
    if (s.mode === "regata") {
      s.buoys.forEach((b) => {
        if (!b.passed && Math.hypot(s.x - b.x, s.y - b.y) < 26) {
          b.passed = true;
          s.collected++;
          playHornSound();
          if (window.toast) window.toast(`Boa ${s.collected}/${s.buoys.length} superata!`, "info", "🚩");

          if (s.collected >= s.buoys.length) {
            s.over = true;
            const seconds = (s.time / 60).toFixed(1);
            if (window.toast) window.toast(`Traguardo al Faro in ${seconds}s! +20 monete!`, "success", "🏆");
            if (window.addCoins) window.addCoins(20);
            const r = loadRec();
            r.cups++;
            if (!r.regattaBestTime || s.time < r.regattaBestTime) r.regattaBestTime = s.time;
            saveRec(r);
          }
        }
      });
    }
  }

  function draw() {
    if (!ctx || !BOAT_STATE) return;
    const g = ctx;
    const s = BOAT_STATE;

    // Mare ligure profondo
    const seaGrad = g.createLinearGradient(0, 0, 0, GH);
    seaGrad.addColorStop(0, "#194a7a");
    seaGrad.addColorStop(0.5, "#143e68");
    seaGrad.addColorStop(1, "#0d2b4a");
    g.fillStyle = seaGrad;
    g.fillRect(0, 0, GW, GH);

    // Onde e riflessi di luce
    for (let y = 30; y < GH; y += 22) {
      for (let x = 0; x < GW; x += 48) {
        const offX = Math.sin(s.waveTimer + y * 0.1) * 8;
        g.strokeStyle = "rgba(100, 200, 255, 0.22)";
        g.lineWidth = 1.2;
        g.beginPath();
        g.arc(x + offX, y, 14, 0, Math.PI);
        g.stroke();
      }
    }

    // Costa rocciosa a nord
    g.fillStyle = "#3e424a";
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(GW, 0);
    g.lineTo(GW, 28);
    g.lineTo(360, 22);
    g.lineTo(260, 36);
    g.lineTo(140, 20);
    g.lineTo(0, 32);
    g.closePath();
    g.fill();

    // Faro di Punta Nera a nord-est
    g.fillStyle = "#ffffff";
    g.fillRect(390, 6, 12, 28);
    g.fillStyle = "#b3202c";
    g.fillRect(390, 14, 12, 6);
    g.fillStyle = "#ffd23f";
    g.beginPath();
    g.arc(396, 6, 5, 0, Math.PI * 2);
    g.fill();

    // Scogli affioranti nel golfo
    s.rocks.forEach((r) => {
      g.fillStyle = "#2c2f36";
      g.beginPath();
      g.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#4d535e";
      g.lineWidth = 3;
      g.stroke();
      // Schiuma attorno allo scoglio
      g.strokeStyle = "rgba(255,255,255,0.45)";
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(r.x, r.y, r.r + 4 + Math.sin(s.waveTimer * 2) * 2, 0, Math.PI * 2);
      g.stroke();
    });

    // Boe da regata
    if (s.mode === "regata") {
      s.buoys.forEach((b, i) => {
        g.fillStyle = b.passed ? "#57d68d" : "#ff4d5a";
        g.beginPath();
        g.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = "#ffffff";
        g.lineWidth = 2;
        g.stroke();
        g.fillStyle = "#ffffff";
        g.font = "bold 9px sans-serif";
        g.textAlign = "center";
        g.fillText(String(i + 1), b.x, b.y + 3);
      });
    }

    // Palloni galleggianti in mare
    if (s.mode === "recupero") {
      s.balls.forEach((b) => {
        if (b.got) return;
        const bob = Math.sin(s.waveTimer * 3 + b.x) * 2.5;
        g.fillStyle = "#ffffff";
        g.beginPath();
        g.arc(b.x, b.y + bob, 6.5, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = "#1b1b1b";
        g.lineWidth = 1.5;
        g.stroke();
        // Disegno esagono/pallone
        g.fillStyle = "#b3202c";
        g.beginPath();
        g.arc(b.x, b.y + bob, 2.5, 0, Math.PI * 2);
        g.fill();
      });
    }

    // Scia di schiuma bianca del gozzo
    if (s.speed > 0.2) {
      const wakeX = s.x - Math.cos(s.angle) * 16;
      const wakeY = s.y - Math.sin(s.angle) * 16;
      g.strokeStyle = "rgba(255, 255, 255, 0.45)";
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(wakeX, wakeY);
      g.lineTo(wakeX - Math.cos(s.angle + 0.4) * 14, wakeY - Math.sin(s.angle + 0.4) * 14);
      g.moveTo(wakeX, wakeY);
      g.lineTo(wakeX - Math.cos(s.angle - 0.4) * 14, wakeY - Math.sin(s.angle - 0.4) * 14);
      g.stroke();
    }

    // Disegno del Gozzo Ligure
    g.save();
    g.translate(s.x, s.y);
    g.rotate(s.angle);

    // Scafo in legno chiaro con bordo blu
    g.fillStyle = "#c9823e"; // Legno gozzo
    g.beginPath();
    g.ellipse(0, 0, 18, 9, 0, 0, Math.PI * 2);
    g.fill();

    // Fascia blu tipica dei gozzi liguri
    g.strokeStyle = "#164478";
    g.lineWidth = 2.5;
    g.stroke();

    // Coperta interna e panche
    g.fillStyle = "#e0ad70";
    g.fillRect(-10, -5, 20, 10);
    g.fillStyle = "#804820";
    g.fillRect(-3, -7, 6, 14); // Panca centrale

    // Baciccia al timone con la coppola
    g.fillStyle = "#19365c";
    g.beginPath();
    g.arc(-9, 0, 4, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#2b2b2b"; // Coppola
    g.fillRect(-12, -3, 6, 6);

    g.restore();

    // Gabbiani in cielo
    s.gulls.forEach((gull) => {
      g.strokeStyle = "#ffffff";
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(gull.x - 4, gull.y, 4, Math.PI, 0);
      g.arc(gull.x + 4, gull.y, 4, Math.PI, 0);
      g.stroke();
    });

    // HUD in alto
    g.fillStyle = "rgba(5, 12, 24, 0.75)";
    g.fillRect(8, 6, GW - 16, 22);
    g.fillStyle = "#ffd23f";
    g.font = "bold 11px sans-serif";
    g.fillText(s.mode === "recupero" ? `PALLONI RECUPERATI: ${s.collected}/${s.balls.length}` : `BOE SUPERATE: ${s.collected}/${s.buoys.length} · TEMPO: ${(s.time / 60).toFixed(1)}s`, 16, 21);

    // Schermata di vittoria
    if (s.over) {
      g.fillStyle = "rgba(8, 16, 32, 0.85)";
      g.fillRect(0, 0, GW, GH);
      g.fillStyle = "#ffd23f";
      g.font = "bold 18px sans-serif";
      g.textAlign = "center";
      g.fillText("MISSIONE COMPIUTA SUL MARE! ⚓", GW / 2, GH / 2 - 12);
      g.fillStyle = "#ffffff";
      g.font = "12px sans-serif";
      g.fillText(s.mode === "recupero" ? "Baciccia annuisce: «Il mare restituisce sempre tutto». +15 Monete!" : "La Regata è tua! Festeggiamenti al molo con +20 Monete!", GW / 2, GH / 2 + 16);
      g.textAlign = "left";
    }
  }

  function loop() {
    if (!isPlaying) return;
    tick();
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  function createModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.id = "gozzoModal";
    modalEl.style.cssText = `
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(6, 12, 24, 0.95); backdrop-filter: blur(8px);
      display: none; flex-direction: column; align-items: center; justify-content: center;
      padding: 12px; user-select: none; -webkit-user-select: none;
    `;

    modalEl.innerHTML = `
      <div style="width: 100%; max-width: 460px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="color:var(--gold, #ffd23f); font-family:var(--display, sans-serif); font-size:15px; font-weight:bold;">
          🌊 IL GOZZO DI BACICCIA: DERBY DEL GOLFO
        </span>
        <button type="button" id="gozCloseBtn" style="background:#b3202c; color:#fff; border:1px solid #ff4d5a; border-radius:6px; padding:4px 10px; font-weight:bold; cursor:pointer; font-size:12px;">✕ Esci</button>
      </div>

      <div style="width:100%; max-width:460px; text-align:center; color:#9cbcd8; font-size:11px; margin-bottom:6px;" id="gozDesc">
        Usa il timone e la manetta del gas per guidare il gozzo ligure tra gli scogli del golfo!
      </div>

      <div style="position:relative; border-radius:10px; overflow:hidden; box-shadow:0 12px 30px rgba(0,0,0,0.8); border:3px solid #194a7a; width:100%; max-width:440px; aspect-ratio:440/280;">
        <canvas id="gozCanvas" width="440" height="280" style="width:100%; height:100%; display:block; touch-action:none;"></canvas>
      </div>

      <!-- Controlli marini touch -->
      <div style="width:100%; max-width:440px; display:flex; gap:8px; margin-top:8px;">
        <button type="button" id="gozLeft" style="flex:1; background:#1b385e; color:#fff; border:1.5px solid #4a82b8; border-radius:8px; padding:12px; font-size:18px; cursor:pointer;">◀ Timone</button>
        <button type="button" id="gozGas" style="flex:1.5; background:linear-gradient(135deg, #2b7a4b, #44a86b); color:#fff; border:2px solid #ffd23f; border-radius:8px; padding:12px; font-weight:bold; font-size:15px; cursor:pointer;">⚓ GAS AVANTI</button>
        <button type="button" id="gozRight" style="flex:1; background:#1b385e; color:#fff; border:1.5px solid #4a82b8; border-radius:8px; padding:12px; font-size:18px; cursor:pointer;">Timone ▶</button>
        <button type="button" id="gozSwitch" style="flex:1; background:#3d2454; color:#ffd23f; border:1px solid #7a4bb8; border-radius:8px; padding:8px; font-size:11px; font-weight:bold; cursor:pointer;">Modalità</button>
      </div>
    `;

    document.body.appendChild(modalEl);

    canvas = modalEl.querySelector("#gozCanvas");
    ctx = canvas.getContext("2d");

    const btnL = modalEl.querySelector("#gozLeft");
    const btnR = modalEl.querySelector("#gozRight");
    const btnGas = modalEl.querySelector("#gozGas");
    const btnSwitch = modalEl.querySelector("#gozSwitch");

    const hold = (el, on, off) => {
      el.addEventListener("pointerdown", (e) => { e.preventDefault(); on(); });
      ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => el.addEventListener(ev, off));
    };

    hold(btnL, () => { if (BOAT_STATE) BOAT_STATE.rudder = -1; }, () => { if (BOAT_STATE) BOAT_STATE.rudder = 0; });
    hold(btnR, () => { if (BOAT_STATE) BOAT_STATE.rudder = 1; }, () => { if (BOAT_STATE) BOAT_STATE.rudder = 0; });
    hold(btnGas, () => { if (BOAT_STATE) BOAT_STATE.throttle = 1.6; }, () => { if (BOAT_STATE) BOAT_STATE.throttle = 0; });

    btnSwitch.onclick = () => {
      if (!BOAT_STATE) return;
      const nextMode = BOAT_STATE.mode === "recupero" ? "regata" : "recupero";
      initGozzoGame(nextMode);
      if (window.toast) window.toast(nextMode === "regata" ? "Modalità: Regata di San Pietro!" : "Modalità: Recupero Palloni Perduti!", "info", "⛵");
    };

    modalEl.querySelector("#gozCloseBtn").onclick = window.closeGozzoGame;

    return modalEl;
  }

  window.openGozzoGame = function (mode = "recupero", onDone = null) {
    returnCallback = onDone;
    createModal();
    initGozzoGame(mode);
    modalEl.style.display = "flex";
    isPlaying = true;
    if (animFrame) cancelAnimationFrame(animFrame);
    loop();
    playHornSound();
    if (window.toast) window.toast("Sei a bordo del Gozzo di Baciccia!", "info", "⚓");
  };

  window.closeGozzoGame = function () {
    isPlaying = false;
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    if (modalEl) modalEl.style.display = "none";
    if (typeof returnCallback === "function") {
      const cb = returnCallback;
      returnCallback = null;
      cb();
    }
  };
})();
