// ================= v18 · IL CABINATO ARCADE DEL BAR: SUPER RONDINE '94 =================
// Minigioco arcade 16-bit a gettoni nel Bar del Porto:
// - Effetto schermo CRT a tubo catodico con scanline e fosfori anni '90
// - Partite veloci 3v3 da 90 secondi stile Neo Geo / Sensible Soccer
// - Tiri ad effetto curvo, scivolate fumanti e gettoniera a monete del Borgo
(function () {
  const K_SAVE = "ali-di-rondine.super-rondine-94";
  let modalEl = null, canvas = null, ctx = null, animFrame = null;
  let isPlaying = false, returnCallback = null;

  function loadRec() {
    try {
      const d = JSON.parse(localStorage.getItem(K_SAVE));
      if (d && typeof d === "object") return d;
    } catch (e) {}
    return { highScore: 0, wins: 0, coinsInserted: 0 };
  }
  function saveRec(r) {
    try { localStorage.setItem(K_SAVE, JSON.stringify(r)); } catch (e) {}
  }

  function play8BitBeep(freq = 440, duration = 0.08) {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      g.gain.setValueAtTime(0.2, actx.currentTime);
      g.gain.linearRampToValueAtTime(0, actx.currentTime + duration);
      osc.connect(g);
      g.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + duration);
    } catch (e) {}
  }

  const AW = 360, AH = 240;
  let ARC_STATE = null;

  function initArcadeMatch() {
    ARC_STATE = {
      p1: { x: 120, y: 120, vx: 0, vy: 0, speed: 2.4, slide: 0, num: 10 },
      p2: { x: 70, y: 70, vx: 0, vy: 0, speed: 2.1, slide: 0, num: 8 },
      p3: { x: 70, y: 170, vx: 0, vy: 0, speed: 2.1, slide: 0, num: 17 },
      gk1: { x: 26, y: 120, vy: 0 },
      // Rivali
      e1: { x: 240, y: 120, vx: 0, vy: 0, speed: 2.2, slide: 0 },
      e2: { x: 290, y: 70, vx: 0, vy: 0, speed: 2.0, slide: 0 },
      e3: { x: 290, y: 170, vx: 0, vy: 0, speed: 2.0, slide: 0 },
      gk2: { x: 334, y: 120, vy: 0 },
      ball: { x: 180, y: 120, vx: 0, vy: 0, owner: null, sp: false },
      score: [0, 0],
      timer: 90 * 60, // 90 seconds
      particles: [],
      over: false,
      joyX: 0,
      joyY: 0
    };
  }

  function tick() {
    if (!ARC_STATE || ARC_STATE.over) return;
    const s = ARC_STATE;
    s.timer--;
    if (s.timer <= 0) {
      s.over = true;
      const rec = loadRec();
      if (s.score[0] > s.score[1]) {
        rec.wins++;
        if (s.score[0] * 100 > rec.highScore) rec.highScore = s.score[0] * 100;
        saveRec(rec);
        if (window.toast) window.toast("VITTORIA A SUPER RONDINE '94! 👾 +15 Monete!", "success", "🎮");
        if (window.addCoins) window.addCoins(15);
      }
      return;
    }

    // Player 1 input
    if (s.p1.slide <= 0) {
      s.p1.x += s.joyX * s.p1.speed;
      s.p1.y += s.joyY * s.p1.speed;
    } else {
      s.p1.slide--;
      s.p1.x += s.p1.vx;
      s.p1.y += s.p1.vy;
      s.particles.push({ x: s.p1.x, y: s.p1.y, life: 8 });
    }
    s.p1.x = Math.max(26, Math.min(334, s.p1.x));
    s.p1.y = Math.max(24, Math.min(216, s.p1.y));

    // Teammates simple AI
    const mates = [s.p2, s.p3];
    mates.forEach((m, idx) => {
      const targetY = idx === 0 ? s.ball.y * 0.6 + 40 : s.ball.y * 0.6 + 140;
      m.y += (targetY - m.y) * 0.05;
      m.x += (s.ball.x * 0.7 + (idx === 0 ? 50 : 70) - m.x) * 0.04;
    });

    // Enemies simple AI
    const enemies = [s.e1, s.e2, s.e3];
    enemies.forEach((e) => {
      const d = Math.hypot(s.ball.x - e.x, s.ball.y - e.y);
      if (d > 6) {
        e.x += (s.ball.x - e.x) / d * 1.6;
        e.y += (s.ball.y - e.y) / d * 1.6;
      }
      // Enemy tackle
      if (d < 14 && s.ball.owner === s.p1 && Math.random() < 0.05) {
        s.ball.owner = e;
        play8BitBeep(220, 0.1);
      }
      // Enemy shoot
      if (s.ball.owner === e && e.x < 120) {
        s.ball.owner = null;
        s.ball.vx = -4.5;
        s.ball.vy = (Math.random() - 0.5) * 3;
        play8BitBeep(320, 0.1);
      }
    });

    // Goalkeepers
    s.gk1.y += (s.ball.y - s.gk1.y) * 0.12;
    s.gk1.y = Math.max(90, Math.min(150, s.gk1.y));
    s.gk2.y += (s.ball.y - s.gk2.y) * 0.12;
    s.gk2.y = Math.max(90, Math.min(150, s.gk2.y));

    // Ball physics
    const b = s.ball;
    if (b.owner) {
      b.x = b.owner.x + (b.owner === s.p1 ? 6 : -6);
      b.y = b.owner.y;
      b.vx = 0;
      b.vy = 0;
    } else {
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.98;
      b.vy *= 0.98;

      // Wall bounces
      if (b.y < 24 || b.y > 216) {
        b.vy = -b.vy;
        play8BitBeep(180, 0.05);
      }

      // Goal detection
      if (b.x < 24) {
        if (b.y > 90 && b.y < 150) {
          // Goal enemy!
          s.score[1]++;
          play8BitBeep(120, 0.4);
          resetBallArcade();
        } else {
          b.vx = Math.abs(b.vx);
        }
      }
      if (b.x > 336) {
        if (b.y > 90 && b.y < 150) {
          // Goal player!
          s.score[0]++;
          play8BitBeep(640, 0.3);
          setTimeout(() => play8BitBeep(880, 0.3), 150);
          resetBallArcade();
        } else {
          b.vx = -Math.abs(b.vx);
        }
      }

      // Pickup
      [s.p1, s.p2, s.p3, s.e1, s.e2, s.e3].forEach((p) => {
        if (Math.hypot(b.x - p.x, b.y - p.y) < 10) {
          b.owner = p;
          play8BitBeep(300, 0.04);
        }
      });
    }

    // Decay particles
    for (let i = s.particles.length - 1; i >= 0; i--) {
      s.particles[i].life--;
      if (s.particles[i].life <= 0) s.particles.splice(i, 1);
    }
  }

  function resetBallArcade() {
    ARC_STATE.ball.x = 180;
    ARC_STATE.ball.y = 120;
    ARC_STATE.ball.vx = 0;
    ARC_STATE.ball.vy = 0;
    ARC_STATE.ball.owner = null;
    ARC_STATE.p1.x = 120;
    ARC_STATE.p1.y = 120;
    ARC_STATE.e1.x = 240;
    ARC_STATE.e1.y = 120;
  }

  function draw() {
    if (!ctx || !ARC_STATE) return;
    const g = ctx;
    const s = ARC_STATE;

    // Sfondo campo pixel 16-bit verde a bande
    g.fillStyle = "#1e7a34";
    g.fillRect(0, 0, AW, AH);
    for (let x = 0; x < AW; x += 40) {
      g.fillStyle = (x % 80 === 0) ? "#24883c" : "#1e7a34";
      g.fillRect(x, 0, 40, AH);
    }

    // Linee bianche del campo
    g.strokeStyle = "#ffffffc0";
    g.lineWidth = 2;
    g.strokeRect(24, 20, 312, 200);

    g.beginPath();
    g.moveTo(180, 20);
    g.lineTo(180, 220);
    g.stroke();

    g.beginPath();
    g.arc(180, 120, 32, 0, Math.PI * 2);
    g.stroke();

    // Aree di rigore e porte
    g.strokeRect(24, 80, 40, 80);
    g.strokeRect(296, 80, 40, 80);

    g.fillStyle = "#ffffff30";
    g.fillRect(10, 92, 14, 56);
    g.fillRect(336, 92, 14, 56);

    // Skid marks
    s.particles.forEach((pt) => {
      g.fillStyle = "#114a1e";
      g.fillRect(pt.x - 2, pt.y - 2, 4, 4);
    });

    // Draw sprite 16-bit
    const drawSprite16 = (x, y, shirt, skin, hair, isGk = false) => {
      // Ombra
      g.fillStyle = "rgba(0,0,0,0.35)";
      g.fillRect(x - 5, y + 6, 10, 4);

      // Pantaloncini
      g.fillStyle = "#ffffff";
      g.fillRect(x - 4, y + 2, 8, 4);

      // Maglia
      g.fillStyle = shirt;
      g.fillRect(x - 5, y - 4, 10, 6);

      // Braccia e testa
      g.fillStyle = skin;
      g.fillRect(x - 7, y - 3, 2, 5);
      g.fillRect(x + 5, y - 3, 2, 5);
      g.fillRect(x - 3, y - 9, 6, 5);

      // Capelli
      g.fillStyle = hair;
      g.fillRect(x - 3, y - 11, 6, 3);
    };

    // Draw players
    drawSprite16(s.p1.x, s.p1.y, "#ff3344", "#f5c898", "#241810");
    drawSprite16(s.p2.x, s.p2.y, "#ff3344", "#f5c898", "#e6be44");
    drawSprite16(s.p3.x, s.p3.y, "#ff3344", "#dfab7e", "#111111");
    drawSprite16(s.gk1.x, s.gk1.y, "#19a0b8", "#f5c898", "#ff7a22", true);

    drawSprite16(s.e1.x, s.e1.y, "#1d3fa3", "#eec398", "#333333");
    drawSprite16(s.e2.x, s.e2.y, "#1d3fa3", "#eec398", "#543825");
    drawSprite16(s.e3.x, s.e3.y, "#1d3fa3", "#eec398", "#241812");
    drawSprite16(s.gk2.x, s.gk2.y, "#ffcc00", "#eec398", "#222222", true);

    // Ball
    const b = s.ball;
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.arc(b.x, b.y, 4.5, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#000000";
    g.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);

    // Scanlines CRT Effect
    g.fillStyle = "rgba(0, 0, 0, 0.18)";
    for (let y = 0; y < AH; y += 3) {
      g.fillRect(0, y, AW, 1);
    }

    // HUD Arcade Score & Time
    g.fillStyle = "#000000d0";
    g.fillRect(0, 0, AW, 18);
    g.fillStyle = "#ffd23f";
    g.font = "bold 11px monospace";
    g.fillText(`1P [RONDINE] ${s.score[0]} - ${s.score[1]} [BAR SPORT] 2P`, 12, 13);
    g.fillStyle = "#ff4d5a";
    g.textAlign = "right";
    g.fillText(`TIME ${Math.max(0, Math.ceil(s.timer / 60))}"`, AW - 12, 13);
    g.textAlign = "left";

    // Game Over
    if (s.over) {
      g.fillStyle = "rgba(0,0,0,0.85)";
      g.fillRect(0, 0, AW, AH);
      g.fillStyle = s.score[0] > s.score[1] ? "#ffd23f" : "#ff4d5a";
      g.font = "bold 18px monospace";
      g.textAlign = "center";
      g.fillText(s.score[0] > s.score[1] ? "★ YOU WIN! ★" : "GAME OVER", AW / 2, AH / 2 - 10);
      g.fillStyle = "#ffffff";
      g.font = "11px monospace";
      g.fillText("INSERT COIN TO CONTINUE", AW / 2, AH / 2 + 15);
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
    modalEl.id = "arcadeModal";
    modalEl.style.cssText = `
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(4, 6, 12, 0.96); backdrop-filter: blur(10px);
      display: none; flex-direction: column; align-items: center; justify-content: center;
      padding: 12px; user-select: none; -webkit-user-select: none;
    `;

    modalEl.innerHTML = `
      <div style="width: 100%; max-width: 420px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="color:#ffd23f; font-family:monospace; font-size:15px; font-weight:bold; text-shadow:0 0 8px #ff9e2e;">
          🕹️ CABINATO: SUPER RONDINE '94
        </span>
        <button type="button" id="arcCloseBtn" style="background:#b3202c; color:#fff; border:1px solid #ff4d5a; border-radius:6px; padding:4px 10px; font-weight:bold; cursor:pointer; font-size:12px;">✕ Esci</button>
      </div>

      <!-- Scocca del cabinato con cornice curva CRT -->
      <div style="position:relative; border-radius:18px; overflow:hidden; box-shadow:0 0 25px rgba(255,210,63,0.3), inset 0 0 15px rgba(0,0,0,0.8); border:4px solid #3a3f4d; width:100%; max-width:360px; aspect-ratio:360/240; background:#000;">
        <canvas id="arcCanvas" width="360" height="240" style="width:100%; height:100%; display:block; touch-action:none;"></canvas>
      </div>

      <!-- Plancia comandi Arcade a gettoni -->
      <div style="width:100%; max-width:360px; display:flex; gap:8px; margin-top:8px;">
        <button type="button" id="arcShoot" style="flex:1.5; background:linear-gradient(135deg, #e62232, #ff4d5a); color:#fff; border:2px solid #ffd23f; border-radius:10px; padding:12px; font-weight:bold; font-size:16px; font-family:monospace; cursor:pointer;">
          🔴 TIRO
        </button>
        <button type="button" id="arcSlide" style="flex:1.5; background:linear-gradient(135deg, #1d3fa3, #3fa7ff); color:#fff; border:2px solid #5cb8ff; border-radius:10px; padding:12px; font-weight:bold; font-size:16px; font-family:monospace; cursor:pointer;">
          🔵 SCIVOLATA
        </button>
      </div>
      <div style="color:#78869c; font-size:10px; font-family:monospace; margin-top:6px;">
        Trascina sul touch per muovere Leo · 1 PARTITA = 1 MONETA DEL BORGO
      </div>
    `;

    document.body.appendChild(modalEl);

    canvas = modalEl.querySelector("#arcCanvas");
    ctx = canvas.getContext("2d");

    // Touch controls for movement
    let pointerOrigin = null;
    canvas.addEventListener("pointerdown", (e) => {
      pointerOrigin = { x: e.clientX, y: e.clientY };
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!pointerOrigin || !ARC_STATE) return;
      const dx = e.clientX - pointerOrigin.x;
      const dy = e.clientY - pointerOrigin.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 8) {
        ARC_STATE.joyX = dx / dist;
        ARC_STATE.joyY = dy / dist;
      } else {
        ARC_STATE.joyX = 0;
        ARC_STATE.joyY = 0;
      }
    });

    const resetPointer = () => {
      pointerOrigin = null;
      if (ARC_STATE) {
        ARC_STATE.joyX = 0;
        ARC_STATE.joyY = 0;
      }
    };
    canvas.addEventListener("pointerup", resetPointer);
    canvas.addEventListener("pointercancel", resetPointer);

    // Buttons
    const shootBtn = modalEl.querySelector("#arcShoot");
    shootBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (!ARC_STATE) return;
      const b = ARC_STATE.ball;
      if (b.owner === ARC_STATE.p1) {
        b.owner = null;
        b.vx = 6.2;
        b.vy = (Math.random() - 0.5) * 2;
        play8BitBeep(520, 0.12);
        if (window.haptic) window.haptic(30);
      }
    });

    const slideBtn = modalEl.querySelector("#arcSlide");
    slideBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (!ARC_STATE || ARC_STATE.p1.slide > 0) return;
      ARC_STATE.p1.slide = 18;
      ARC_STATE.p1.vx = (ARC_STATE.joyX || 1) * 4.2;
      ARC_STATE.p1.vy = (ARC_STATE.joyY || 0) * 4.2;
      play8BitBeep(180, 0.08);
      if (window.haptic) window.haptic(25);
    });

    modalEl.querySelector("#arcCloseBtn").onclick = window.closeArcadeMachine;

    return modalEl;
  }

  window.openArcadeMachine = function (onDone = null) {
    returnCallback = onDone;
    createModal();
    initArcadeMatch();
    modalEl.style.display = "flex";
    isPlaying = true;
    if (animFrame) cancelAnimationFrame(animFrame);
    loop();
    play8BitBeep(440, 0.1);
    setTimeout(() => play8BitBeep(660, 0.15), 120);
    if (window.toast) window.toast("Inserito 1 gettone in Super Rondine '94!", "info", "🕹️");
  };

  window.closeArcadeMachine = function () {
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
