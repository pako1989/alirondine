// js/match-director-hd.js - Matchday Director 2D HD (Live Tactical Manager)
(function () {
  let modal = null;
  let canvas = null;
  let ctx = null;
  let animId = null;
  let onExitCallback = null;

  const PITCH_W = 960;
  const PITCH_H = 600;

  let sim = {
    min: 0,
    speed: 1, // 1x or 2x
    paused: false,
    scoreA: 0,
    scoreB: 0,
    teamAName: "Rondine",
    teamBName: "Virtus Entella",
    formation: "4-3-3",
    tactic: "bilanciata", // 'bilanciata', 'offensiva', 'difensiva', 'pressing', 'contropiede'
    momentum: 50, // 0 (Team B dominance) - 100 (Team A dominance)
    xG_A: 0.0,
    xG_B: 0.0,
    shotsA: 0,
    shotsB: 0,
    possessionA: 52,
    passChannels: [],
    ball: { x: PITCH_W / 2, y: PITCH_H / 2, vx: 0, vy: 0 },
    teamA: [],
    teamB: [],
    matchLog: [
      "Fischio d'inizio! La Rondine sfida l'Entella in un derby caldissimo.",
      "Le squadre prendono posizione sul campo di Borgo Marino."
    ]
  };

  const FORMATIONS = {
    "4-3-3": [
      { role: "POR", x: 80, y: 300, name: "Sandro" },
      { role: "TD", x: 220, y: 120, name: "Gino" },
      { role: "DC", x: 200, y: 240, name: "Chicco" },
      { role: "DC", x: 200, y: 360, name: "Baciccia Jr" },
      { role: "TS", x: 220, y: 480, name: "Mino" },
      { role: "MED", x: 380, y: 300, name: "Don Aurelio Jr" },
      { role: "CC", x: 480, y: 200, name: "Leo (C)" },
      { role: "CC", x: 480, y: 400, name: "Sara" },
      { role: "AD", x: 680, y: 140, name: "Nico" },
      { role: "ATT", x: 740, y: 300, name: "Dario" },
      { role: "AS", x: 680, y: 460, name: "Ricky" }
    ],
    "3-5-2": [
      { role: "POR", x: 80, y: 300, name: "Sandro" },
      { role: "DC", x: 210, y: 180, name: "Chicco" },
      { role: "DC", x: 190, y: 300, name: "Baciccia Jr" },
      { role: "DC", x: 210, y: 420, name: "Mino" },
      { role: "ED", x: 450, y: 100, name: "Gino" },
      { role: "CC", x: 420, y: 220, name: "Leo (C)" },
      { role: "MED", x: 370, y: 300, name: "Don Aurelio Jr" },
      { role: "CC", x: 420, y: 380, name: "Sara" },
      { role: "ES", x: 450, y: 500, name: "Nico" },
      { role: "ATT", x: 720, y: 240, name: "Dario" },
      { role: "ATT", x: 720, y: 360, name: "Ricky" }
    ],
    "4-4-2": [
      { role: "POR", x: 80, y: 300, name: "Sandro" },
      { role: "TD", x: 220, y: 120, name: "Gino" },
      { role: "DC", x: 200, y: 240, name: "Chicco" },
      { role: "DC", x: 200, y: 360, name: "Baciccia Jr" },
      { role: "TS", x: 220, y: 480, name: "Mino" },
      { role: "ED", x: 480, y: 120, name: "Nico" },
      { role: "CC", x: 440, y: 240, name: "Leo (C)" },
      { role: "CC", x: 440, y: 360, name: "Sara" },
      { role: "ES", x: 480, y: 480, name: "Ricky" },
      { role: "ATT", x: 720, y: 240, name: "Dario" },
      { role: "ATT", x: 720, y: 360, name: "Don Aurelio Jr" }
    ]
  };

  function initSim() {
    sim.min = 0;
    sim.scoreA = 0;
    sim.scoreB = 0;
    sim.xG_A = 0.0;
    sim.xG_B = 0.0;
    sim.shotsA = 0;
    sim.shotsB = 0;
    sim.possessionA = 50;
    sim.momentum = 50;
    sim.teamA = FORMATIONS[sim.formation].map(p => ({
      ...p,
      curX: p.x,
      curY: p.y,
      stamina: 100,
      heat: 0
    }));

    // Generate balanced Enemy 4-3-3 mirrored
    sim.teamB = FORMATIONS["4-3-3"].map((p, i) => ({
      role: p.role,
      x: PITCH_W - p.x,
      y: p.y,
      curX: PITCH_W - p.x,
      curY: p.y,
      name: `Rivale ${i + 1}`,
      stamina: 100
    }));

    sim.ball = { x: PITCH_W / 2, y: PITCH_H / 2, vx: 0, vy: 0 };
    if (window.HD2DAudio) window.HD2DAudio.playWhistle(true);
  }

  function updateTacticalSim() {
    if (sim.paused || sim.min >= 90) return;

    sim.min += 0.08 * sim.speed;

    // Tactical adjustments effect on momentum
    if (sim.tactic === "offensiva") {
      sim.momentum = Math.min(95, sim.momentum + 0.06);
    } else if (sim.tactic === "difensiva") {
      sim.momentum = Math.max(25, sim.momentum - 0.04);
    } else if (sim.tactic === "pressing") {
      sim.momentum = Math.min(85, sim.momentum + 0.08);
      // Deplete stamina slightly faster
      sim.teamA.forEach(p => { p.stamina = Math.max(20, p.stamina - 0.03); });
    }

    // Ball movement towards attacking zone based on momentum
    const targetBallX = (sim.momentum / 100) * (PITCH_W - 160) + 80;
    const targetBallY = PITCH_H / 2 + Math.sin(sim.min * 0.4) * 140;

    sim.ball.x += (targetBallX - sim.ball.x) * 0.04;
    sim.ball.y += (targetBallY - sim.ball.y) * 0.04;

    // Move players around their formation anchor + follow ball
    sim.teamA.forEach(p => {
      let targetX = p.x + (sim.ball.x - PITCH_W / 2) * 0.22;
      let targetY = p.y + (sim.ball.y - PITCH_H / 2) * 0.18;
      if (sim.tactic === "offensiva") targetX += 45;
      if (sim.tactic === "difensiva") targetX -= 45;
      p.curX += (targetX - p.curX) * 0.05;
      p.curY += (targetY - p.curY) * 0.05;
      p.heat += 0.01;
    });

    sim.teamB.forEach(p => {
      let targetX = p.x + (sim.ball.x - PITCH_W / 2) * 0.2;
      let targetY = p.y + (sim.ball.y - PITCH_H / 2) * 0.18;
      p.curX += (targetX - p.curX) * 0.05;
      p.curY += (targetY - p.curY) * 0.05;
    });

    // Create dynamic passing channels
    if (Math.random() < 0.05) {
      const p1 = sim.teamA[Math.floor(Math.random() * sim.teamA.length)];
      const p2 = sim.teamA[Math.floor(Math.random() * sim.teamA.length)];
      if (p1 !== p2 && Math.hypot(p1.curX - p2.curX, p1.curY - p2.curY) < 220) {
        sim.passChannels.push({ x1: p1.curX, y1: p1.curY, x2: p2.curX, y2: p2.curY, alpha: 1.0 });
      }
    }
    // Fade passing channels
    sim.passChannels.forEach(c => { c.alpha -= 0.02; });
    sim.passChannels = sim.passChannels.filter(c => c.alpha > 0);

    // Occasion Calculation
    if (Math.random() < 0.008) {
      triggerSimChance();
    }
  }

  function triggerSimChance() {
    const isPlayerChance = Math.random() * 100 < sim.momentum;
    if (isPlayerChance) {
      sim.shotsA++;
      const xG = +(0.15 + Math.random() * 0.45).toFixed(2);
      sim.xG_A = +(sim.xG_A + xG).toFixed(2);

      if (Math.random() < xG) {
        // GOAL RONDINE!
        sim.scoreA++;
        const scorer = ["Leo", "Dario", "Nico", "Chicco"][Math.floor(Math.random() * 4)];
        sim.matchLog.unshift(`${Math.floor(sim.min)}' ⚽ GOOOL RONDINE! ${scorer} scarica un destro perfetto all'incrocio! (xG: ${xG})`);
        if (window.HD2DAudio) window.HD2DAudio.playGoal();
        if (window.toast) window.toast(`⚽ GOL RONDINE! (${scorer})`, "success", "⚽");
      } else {
        sim.matchLog.unshift(`${Math.floor(sim.min)}' 🧤 Occasione Rondine! Grande parata del portiere avversario. (xG: ${xG})`);
        if (window.HD2DAudio) window.HD2DAudio.playBounce();
      }
    } else {
      sim.shotsB++;
      const xG = +(0.12 + Math.random() * 0.38).toFixed(2);
      sim.xG_B = +(sim.xG_B + xG).toFixed(2);

      if (Math.random() < xG) {
        sim.scoreB++;
        sim.matchLog.unshift(`${Math.floor(sim.min)}' ⚽ Gol subito! L'Entella pareggia su contropiede rapido. (xG: ${xG})`);
        if (window.HD2DAudio) window.HD2DAudio.playGoal();
      } else {
        sim.matchLog.unshift(`${Math.floor(sim.min)}' 🛡️ Salvataggio! Chicco mura il tiro sulla linea di porta.`);
        if (window.HD2DAudio) window.HD2DAudio.playTackle();
      }
    }
  }

  function resizeCanvas() {
    if (!canvas || !modal) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  function render() {
    if (!ctx) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    updateTacticalSim();

    // Split View: Left (Pitch 2D HD), Right (Tactics & Live Stats)
    const pitchWidth = Math.min(w * 0.65, PITCH_W);
    const scale = Math.min(pitchWidth / PITCH_W, (h - 70) / PITCH_H);

    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(0, 0, w, h);

    // Draw 2D Pitch
    ctx.save();
    ctx.translate(20, 60);
    ctx.scale(scale, scale);

    // Grass surface
    ctx.fillStyle = "#1e392a";
    ctx.fillRect(0, 0, PITCH_W, PITCH_H);

    // Mown tactical stripes
    for (let x = 0; x < PITCH_W; x += 120) {
      ctx.fillStyle = "#244432";
      ctx.fillRect(x, 0, 60, PITCH_H);
    }

    // Pitch perimeter & zones
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(30, 25, PITCH_W - 60, PITCH_H - 50);

    // Halfway line & center circle
    ctx.beginPath();
    ctx.moveTo(PITCH_W / 2, 25);
    ctx.lineTo(PITCH_W / 2, PITCH_H - 25);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(PITCH_W / 2, PITCH_H / 2, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Passing channels
    sim.passChannels.forEach(c => {
      ctx.strokeStyle = `rgba(56, 189, 248, ${c.alpha * 0.8})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.x1, c.y1);
      ctx.lineTo(c.x2, c.y2);
      ctx.stroke();
    });

    // Players Team A (Blue)
    sim.teamA.forEach(p => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(p.curX, p.curY + 10, 11, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(p.curX, p.curY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.role, p.curX, p.curY + 3);
      ctx.fillText(p.name, p.curX, p.curY - 14);
    });

    // Players Team B (Red)
    sim.teamB.forEach(p => {
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(p.curX, p.curY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.role, p.curX, p.curY + 3);
    });

    // Ball
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(sim.ball.x, sim.ball.y, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Right Panel: Live Stats, Match Log & Orders
    const panelX = 40 + PITCH_W * scale;
    const panelW = w - panelX - 20;

    if (panelW > 160) {
      drawTacticalPanel(panelX, 60, panelW, h - 80);
    }

    // Top Header
    drawDirectorHeader(w);

    animId = requestAnimationFrame(render);
  }

  function drawDirectorHeader(w) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, 52);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, 52);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("📋 MATCHDAY DIRECTOR 2D HD", 16, 25);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.fillText(`Modulo: ${sim.formation} · Tattica: ${sim.tactic.toUpperCase()}`, 16, 42);

    // Score & Minute
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${sim.teamAName} ${sim.scoreA} - ${sim.scoreB} ${sim.teamBName}`, w / 2, 33);

    ctx.fillStyle = "#facc15";
    ctx.font = "bold 14px monospace";
    ctx.fillText(`${Math.floor(sim.min)}'`, w / 2 + 150, 33);
  }

  function drawTacticalPanel(x, y, w, h) {
    ctx.fillStyle = "#111827";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#1f2937";
    ctx.strokeRect(x, y, w, h);

    // Live Momentum Bar
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("⚡ Inerzia Tattica (Momentum)", x + 12, y + 24);

    ctx.fillStyle = "#dc2626";
    ctx.fillRect(x + 12, y + 32, w - 24, 10);
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(x + 12, y + 32, (w - 24) * (sim.momentum / 100), 10);

    // Stats Grid
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px monospace";
    ctx.fillText(`Tiri: ${sim.shotsA} - ${sim.shotsB}`, x + 12, y + 68);
    ctx.fillText(`xG: ${sim.xG_A.toFixed(2)} - ${sim.xG_B.toFixed(2)}`, x + 12, y + 88);
    ctx.fillText(`Possesso: ${sim.possessionA}% - ${100 - sim.possessionA}%`, x + 12, y + 108);

    // Match Log
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("📜 Cronaca dal Campo", x + 12, y + 140);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px sans-serif";
    sim.matchLog.slice(0, 5).forEach((msg, i) => {
      wrapText(ctx, msg, x + 12, y + 165 + i * 36, w - 24, 15);
    });
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  window.openMatchDirectorHD = function (onExit) {
    onExitCallback = onExit;
    if (modal) {
      modal.remove();
      modal = null;
    }

    modal = document.createElement("div");
    modal.id = "matchDirectorModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "#050b14";
    modal.style.zIndex = "999999";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";

    modal.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 16px; background:#0b1320; border-bottom:1px solid #1e293b; color:#fff;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:22px;">📋</span>
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:bold; color:#38bdf8;">Matchday Director 2D HD · Gestionale Tattico</h2>
            <span style="font-size:11px; color:#94a3b8;">Guida la Rondine dalla panchina: cambia modulo, impartisci ordini e osserva la lavagna tattica 2D in tempo reale.</span>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <button id="dirPauseBtn" style="background:#475569; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold;">Pausa ⏸️</button>
          <button id="dirCloseBtn" style="background:#e63946; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:bold;">Chiudi ✕</button>
        </div>
      </div>
      <div style="display:flex; background:#0f172a; padding:6px 16px; gap:8px; border-bottom:1px solid #1e293b; overflow-x:auto;">
        <span style="color:#94a3b8; font-size:12px; align-self:center; font-weight:bold;">Ordini dalla Panchina:</span>
        <button id="tacticBal" class="tactic-btn" style="background:#2563eb; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:12px;">⚖️ Bilanciata</button>
        <button id="tacticOff" class="tactic-btn" style="background:#334155; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:12px;">🔥 Assedio</button>
        <button id="tacticDef" class="tactic-btn" style="background:#334155; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:12px;">🛡️ Catenaccio</button>
        <button id="tacticPress" class="tactic-btn" style="background:#334155; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:12px;">⚡ Pressing Alto</button>
        <select id="formSelect" style="background:#1e293b; color:#fff; border:1px solid #334155; padding:4px 8px; border-radius:4px; font-size:12px; margin-left:auto;">
          <option value="4-3-3">Modulo: 4-3-3</option>
          <option value="3-5-2">Modulo: 3-5-2</option>
          <option value="4-4-2">Modulo: 4-4-2</option>
        </select>
      </div>
      <div style="flex:1; position:relative; overflow:hidden;">
        <canvas id="directorCanvas" style="width:100%; height:100%; display:block;"></canvas>
      </div>
    `;

    document.body.appendChild(modal);

    canvas = document.getElementById("directorCanvas");
    ctx = canvas.getContext("2d");

    // Button Listeners
    document.getElementById("dirCloseBtn").onclick = function () {
      if (animId) cancelAnimationFrame(animId);
      modal.remove();
      modal = null;
      if (typeof onExitCallback === "function") onExitCallback();
    };

    document.getElementById("dirPauseBtn").onclick = function () {
      sim.paused = !sim.paused;
      this.innerText = sim.paused ? "Riprendi ▶️" : "Pausa ⏸️";
    };

    const setTactic = (btnId, tacName) => {
      document.querySelectorAll(".tactic-btn").forEach(b => { b.style.background = "#334155"; });
      document.getElementById(btnId).style.background = "#2563eb";
      sim.tactic = tacName;
      sim.matchLog.unshift(`${Math.floor(sim.min)}' 📢 Il Mister chiama: ${tacName.toUpperCase()}!`);
      if (window.HD2DAudio) window.HD2DAudio.playSelect();
    };

    document.getElementById("tacticBal").onclick = () => setTactic("tacticBal", "bilanciata");
    document.getElementById("tacticOff").onclick = () => setTactic("tacticOff", "offensiva");
    document.getElementById("tacticDef").onclick = () => setTactic("tacticDef", "difensiva");
    document.getElementById("tacticPress").onclick = () => setTactic("tacticPress", "pressing");

    document.getElementById("formSelect").onchange = function () {
      sim.formation = this.value;
      initSim();
      sim.matchLog.unshift(`${Math.floor(sim.min)}' 🔄 Cambio Modulo: si passa al ${sim.formation}!`);
      if (window.HD2DAudio) window.HD2DAudio.playSelect();
    };

    window.addEventListener("resize", resizeCanvas);

    initSim();
    resizeCanvas();
    render();
  };
})();
