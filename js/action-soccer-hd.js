// js/action-soccer-hd.js - Top-Down Action Soccer 2D HD (Sensible / Kick-Off Style)
(function () {
  let modal = null;
  let canvas = null;
  let ctx = null;
  let animId = null;
  let onExitCallback = null;

  // Active inputs
  const input = {
    up: false, down: false, left: false, right: false,
    pass: false, shoot: false, sprint: false,
    pointerActive: false,
    pointerTargetX: 0,
    pointerTargetY: 0
  };

  // Field dimensions
  const FIELD_W = 1200;
  const FIELD_H = 750;
  const GOAL_H = 140;

  // Game state
  let match = {
    scoreA: 0,
    scoreB: 0,
    time: 0,
    state: "kickoff", // 'kickoff', 'play', 'goal', 'fulltime'
    activePlayerId: 3,
    camX: 0,
    camY: 0,
    scale: 1,
    ball: {
      x: FIELD_W / 2,
      y: FIELD_H / 2,
      vx: 0,
      vy: 0,
      vz: 0,
      z: 0,
      spinX: 0,
      spinY: 0
    },
    teamA: [], // Rondine (Player)
    teamB: []  // Rivals (AI)
  };

  function createTeam(isPlayer) {
    const prefix = isPlayer ? "R" : "A";
    const color = isPlayer ? "#1e3a8a" : "#dc2626";
    const secColor = isPlayer ? "#38bdf8" : "#f87171";

    const basePositions = isPlayer ? [
      { role: "GK", x: 90, y: FIELD_H / 2, isGK: true, speed: 3.2, name: "Sandro" },
      { role: "DEF", x: 280, y: FIELD_H * 0.3, speed: 4.0, name: "Chicco" },
      { role: "DEF", x: 280, y: FIELD_H * 0.7, speed: 4.0, name: "Baciccia Jr" },
      { role: "MID", x: 480, y: FIELD_H / 2, speed: 4.5, name: "Leo (C)" },
      { role: "FWD", x: 580, y: FIELD_H * 0.45, speed: 4.8, name: "Nico" }
    ] : [
      { role: "GK", x: FIELD_W - 90, y: FIELD_H / 2, isGK: true, speed: 3.2, name: "Portiere" },
      { role: "DEF", x: FIELD_W - 280, y: FIELD_H * 0.3, speed: 3.8, name: "Difensore 1" },
      { role: "DEF", x: FIELD_W - 280, y: FIELD_H * 0.7, speed: 3.8, name: "Difensore 2" },
      { role: "MID", x: FIELD_W - 480, y: FIELD_H / 2, speed: 4.0, name: "Regista" },
      { role: "FWD", x: FIELD_W - 580, y: FIELD_H * 0.55, speed: 4.3, name: "Punta" }
    ];

    return basePositions.map((p, idx) => ({
      id: `${prefix}_${idx}`,
      isPlayer,
      name: p.name,
      role: p.role,
      isGK: !!p.isGK,
      x: p.x,
      y: p.y,
      vx: 0,
      vy: 0,
      targetX: p.x,
      targetY: p.y,
      speed: p.speed,
      color,
      secColor,
      kickCooldown: 0
    }));
  }

  function resetMatch(full = true) {
    if (full) {
      match.scoreA = 0;
      match.scoreB = 0;
      match.time = 0;
    }
    match.state = "kickoff";
    match.teamA = createTeam(true);
    match.teamB = createTeam(false);
    match.ball = {
      x: FIELD_W / 2,
      y: FIELD_H / 2,
      vx: 0,
      vy: 0,
      vz: 0,
      z: 0,
      spinX: 0,
      spinY: 0
    };
    match.activePlayerId = 3;
    if (window.HD2DAudio) window.HD2DAudio.playWhistle(true);
  }

  function updatePhysics() {
    if (match.state === "goal") return;

    match.time += 1 / 60;
    const b = match.ball;

    // Apply friction and air resistance
    b.vx *= 0.982;
    b.vy *= 0.982;

    // Spin
    if (Math.abs(b.spinY) > 0.05) {
      b.vy += b.spinY * 0.08;
      b.spinY *= 0.94;
    }

    // Vertical bounce
    if (b.z > 0 || b.vz > 0) {
      b.z += b.vz;
      b.vz -= 0.35;
      if (b.z <= 0) {
        b.z = 0;
        b.vz = -b.vz * 0.6;
        if (Math.abs(b.vz) > 1 && window.HD2DAudio) window.HD2DAudio.playBounce();
      }
    }

    b.x += b.vx;
    b.y += b.vy;

    const goalTop = (FIELD_H - GOAL_H) / 2;
    const goalBottom = goalTop + GOAL_H;

    // Left Goal
    if (b.x <= 40) {
      if (b.y >= goalTop && b.y <= goalBottom && b.z <= 40) {
        handleGoal("B");
        return;
      } else {
        b.x = 40;
        b.vx = -b.vx * 0.6;
        if (window.HD2DAudio) window.HD2DAudio.playPost();
      }
    }

    // Right Goal
    if (b.x >= FIELD_W - 40) {
      if (b.y >= goalTop && b.y <= goalBottom && b.z <= 40) {
        handleGoal("A");
        return;
      } else {
        b.x = FIELD_W - 40;
        b.vx = -b.vx * 0.6;
        if (window.HD2DAudio) window.HD2DAudio.playPost();
      }
    }

    // Top / Bottom Out of bounds
    if (b.y <= 30) { b.y = 30; b.vy = -b.vy * 0.6; }
    if (b.y >= FIELD_H - 30) { b.y = FIELD_H - 30; b.vy = -b.vy * 0.6; }

    updatePlayers();
    updateGoalkeepers();
  }

  function handleGoal(scoringTeam) {
    match.state = "goal";
    if (scoringTeam === "A") {
      match.scoreA++;
      if (window.toast) window.toast("⚽ GOOOOL DELLA RONDINE!", "success", "⚽");
      if (window.fireConfetti) window.fireConfetti();
    } else {
      match.scoreB++;
      if (window.toast) window.toast("⚽ Gol degli avversari!", "error", "⚽");
    }
    if (window.HD2DAudio) window.HD2DAudio.playGoal();

    setTimeout(() => {
      resetMatch(false);
    }, 2200);
  }

  function updatePlayers() {
    const b = match.ball;

    // Automatically switch active player to closest Rondine outfield player
    let bestDist = 9999;
    let closestIdx = match.activePlayerId;
    match.teamA.forEach((p, idx) => {
      if (!p.isGK) {
        const d = Math.hypot(p.x - b.x, p.y - b.y);
        if (d < bestDist) {
          bestDist = d;
          closestIdx = idx;
        }
      }
    });
    match.activePlayerId = closestIdx;

    // User controlled player
    const userP = match.teamA[match.activePlayerId];
    if (userP) {
      let dx = 0;
      let dy = 0;

      // 1. Check Keyboard / D-Pad
      if (input.up) dy -= 1;
      if (input.down) dy += 1;
      if (input.left) dx -= 1;
      if (input.right) dx += 1;

      // 2. Check Pointer / Click / Touch to Move
      if (input.pointerActive) {
        // Convert screen target to field coords
        const pdx = input.pointerTargetX - userP.x;
        const pdy = input.pointerTargetY - userP.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist > 15) {
          dx = pdx / pdist;
          dy = pdy / pdist;
        }
      }

      // Normalize diagonal speed
      if (dx !== 0 && dy !== 0 && !input.pointerActive) {
        dx *= 0.707;
        dy *= 0.707;
      }

      const curSpeed = userP.speed * (input.sprint ? 1.4 : 1.0);
      userP.vx = dx * curSpeed;
      userP.vy = dy * curSpeed;
      userP.x += userP.vx;
      userP.y += userP.vy;

      // Boundary clamp
      userP.x = Math.max(45, Math.min(FIELD_W - 45, userP.x));
      userP.y = Math.max(35, Math.min(FIELD_H - 35, userP.y));

      handlePlayerBallInteraction(userP, true);
    }

    // AI Teammates
    match.teamA.forEach((p, idx) => {
      if (idx !== match.activePlayerId && !p.isGK) {
        updateTeammateAI(p);
      }
    });

    // Enemy AI
    match.teamB.forEach((p) => {
      if (!p.isGK) updateEnemyAI(p);
    });
  }

  function handlePlayerBallInteraction(p, isUser) {
    const b = match.ball;
    const dist = Math.hypot(p.x - b.x, p.y - b.y);

    if (p.kickCooldown > 0) p.kickCooldown--;

    if (dist < 30 && b.z < 28 && p.kickCooldown === 0) {
      if (isUser) {
        if (input.shoot) {
          const targetX = FIELD_W - 40;
          const targetY = FIELD_H / 2 + (Math.random() * 80 - 40);
          const angle = Math.atan2(targetY - p.y, targetX - p.x);
          const power = 14.5;
          b.vx = Math.cos(angle) * power;
          b.vy = Math.sin(angle) * power;
          b.vz = 4.2;
          b.spinY = input.up ? -1.5 : (input.down ? 1.5 : 0);
          p.kickCooldown = 22;
          if (window.HD2DAudio) window.HD2DAudio.playKick(1.2);
          input.shoot = false;
        } else if (input.pass) {
          const teammate = match.teamA.find(t => t !== p && !t.isGK && t.x > p.x - 50) || match.teamA[4];
          const angle = Math.atan2(teammate.y - p.y, teammate.x - p.x);
          const power = 10;
          b.vx = Math.cos(angle) * power;
          b.vy = Math.sin(angle) * power;
          b.vz = 1.2;
          p.kickCooldown = 18;
          if (window.HD2DAudio) window.HD2DAudio.playKick(0.9);
          input.pass = false;
        } else {
          // Dribble
          b.vx = p.vx * 1.08 + (Math.cos(Math.atan2(p.vy || 0.1, p.vx || 0.1)) * 1.5);
          b.vy = p.vy * 1.08 + (Math.sin(Math.atan2(p.vy || 0.1, p.vx || 0.1)) * 1.5);
        }
      }
    }
  }

  function updateTeammateAI(p) {
    const b = match.ball;
    let targetX = p.role === "DEF" ? 250 + (b.x * 0.25) : (p.role === "MID" ? 450 + (b.x * 0.3) : 600 + (b.x * 0.35));
    let targetY = p.targetY + (b.y - FIELD_H / 2) * 0.35;

    const angle = Math.atan2(targetY - p.y, targetX - p.x);
    p.vx = Math.cos(angle) * (p.speed * 0.68);
    p.vy = Math.sin(angle) * (p.speed * 0.68);
    p.x += p.vx;
    p.y += p.vy;
  }

  function updateEnemyAI(p) {
    const b = match.ball;
    const distToBall = Math.hypot(p.x - b.x, p.y - b.y);

    if (distToBall < 26 && b.z < 26) {
      if (p.x < FIELD_W * 0.4) {
        const angle = Math.atan2(FIELD_H / 2 - p.y, 40 - p.x);
        b.vx = Math.cos(angle) * 11.5;
        b.vy = Math.sin(angle) * 11.5;
        b.vz = 3.6;
        p.kickCooldown = 25;
        if (window.HD2DAudio) window.HD2DAudio.playKick(1.1);
      } else {
        b.vx = -p.speed * 1.15;
        b.vy = (Math.random() - 0.5) * 2.2;
      }
    } else {
      let targetX = distToBall < 240 ? b.x : p.targetX;
      let targetY = distToBall < 240 ? b.y : p.targetY;
      const angle = Math.atan2(targetY - p.y, targetX - p.x);
      p.vx = Math.cos(angle) * (p.speed * 0.72);
      p.vy = Math.sin(angle) * (p.speed * 0.72);
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  function updateGoalkeepers() {
    const b = match.ball;
    const gkA = match.teamA[0];
    const gkB = match.teamB[0];
    const goalMidY = FIELD_H / 2;
    const goalRange = GOAL_H * 0.44;

    if (gkA) {
      const targetY = Math.max(goalMidY - goalRange, Math.min(goalMidY + goalRange, b.y));
      gkA.y += (targetY - gkA.y) * 0.09;
      if (Math.hypot(gkA.x - b.x, gkA.y - b.y) < 40 && b.x < 125) {
        b.vx = Math.abs(b.vx) * 0.7 + 3.2;
        b.vy = (b.y - gkA.y) * 0.25;
        if (window.HD2DAudio) window.HD2DAudio.playBounce();
      }
    }

    if (gkB) {
      const targetY = Math.max(goalMidY - goalRange, Math.min(goalMidY + goalRange, b.y));
      gkB.y += (targetY - gkB.y) * 0.09;
      if (Math.hypot(gkB.x - b.x, gkB.y - b.y) < 40 && b.x > FIELD_W - 125) {
        b.vx = -Math.abs(b.vx) * 0.7 - 3.2;
        b.vy = (b.y - gkB.y) * 0.25;
        if (window.HD2DAudio) window.HD2DAudio.playBounce();
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

    updatePhysics();

    const b = match.ball;
    const scale = Math.min(w / (FIELD_W * 0.72), h / (FIELD_H * 0.72));
    const camX = w / 2 - b.x * scale;
    const camY = h / 2 - b.y * scale;
    match.scale = scale;
    match.camX = camX;
    match.camY = camY;

    ctx.save();
    ctx.fillStyle = "#0c1523";
    ctx.fillRect(0, 0, w, h);

    ctx.translate(camX, camY);
    ctx.scale(scale, scale);

    // Pitch Grass
    ctx.fillStyle = "#1e7e34";
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);

    const stripeW = 80;
    for (let x = 0; x < FIELD_W; x += stripeW * 2) {
      ctx.fillStyle = "#28a745";
      ctx.fillRect(x, 0, stripeW, FIELD_H);
    }

    // Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 30, FIELD_W - 80, FIELD_H - 60);

    ctx.beginPath();
    ctx.moveTo(FIELD_W / 2, 30);
    ctx.lineTo(FIELD_W / 2, FIELD_H - 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(FIELD_W / 2, FIELD_H / 2, 90, 0, Math.PI * 2);
    ctx.stroke();

    const goalTop = (FIELD_H - GOAL_H) / 2;
    ctx.strokeRect(40, FIELD_H / 2 - 160, 160, 320);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(10, goalTop, 30, GOAL_H);
    ctx.strokeRect(10, goalTop, 30, GOAL_H);

    ctx.strokeRect(FIELD_W - 200, FIELD_H / 2 - 160, 160, 320);
    ctx.fillRect(FIELD_W - 40, goalTop, 30, GOAL_H);
    ctx.strokeRect(FIELD_W - 40, goalTop, 30, GOAL_H);

    // Draw Players
    const drawPlayer = (p, isActive) => {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 12, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.secColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (isActive) {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.name, p.x, p.y - 18);
    };

    match.teamA.forEach((p, idx) => drawPlayer(p, idx === match.activePlayerId));
    match.teamB.forEach(p => drawPlayer(p, false));

    // Ball
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, Math.max(3, 8 - b.z * 0.1), Math.max(2, 4 - b.z * 0.05), 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(b.x, b.y - b.z, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();

    // Top HUD Score
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.fillRect(w / 2 - 160, 8, 320, 44);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.strokeRect(w / 2 - 160, 8, 320, 44);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("RONDINE", w / 2 - 140, 34);

    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "right";
    ctx.fillText("RIVALI", w / 2 + 140, 34);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${match.scoreA} - ${match.scoreB}`, w / 2, 38);

    animId = requestAnimationFrame(render);
  }

  // Keyboard Event Handlers
  function handleKeyDown(e) {
    const k = e.key;
    if (k === "ArrowUp" || k === "w" || k === "W") { input.up = true; e.preventDefault(); }
    if (k === "ArrowDown" || k === "s" || k === "S") { input.down = true; e.preventDefault(); }
    if (k === "ArrowLeft" || k === "a" || k === "A") { input.left = true; e.preventDefault(); }
    if (k === "ArrowRight" || k === "d" || k === "D") { input.right = true; e.preventDefault(); }
    if (k === "z" || k === "Z" || k === " ") { input.pass = true; e.preventDefault(); }
    if (k === "x" || k === "X" || k === "Enter") { input.shoot = true; e.preventDefault(); }
    if (k === "Shift" || k === "c" || k === "C") { input.sprint = true; }
  }

  function handleKeyUp(e) {
    const k = e.key;
    if (k === "ArrowUp" || k === "w" || k === "W") input.up = false;
    if (k === "ArrowDown" || k === "s" || k === "S") input.down = false;
    if (k === "ArrowLeft" || k === "a" || k === "A") input.left = false;
    if (k === "ArrowRight" || k === "d" || k === "D") input.right = false;
    if (k === "z" || k === "Z" || k === " ") input.pass = false;
    if (k === "x" || k === "X" || k === "Enter") input.shoot = false;
    if (k === "Shift" || k === "c" || k === "C") input.sprint = false;
  }

  // Pointer Click / Touch to Move on Canvas
  function updatePointerTarget(clientX, clientY) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    input.pointerTargetX = (sx - match.camX) / match.scale;
    input.pointerTargetY = (sy - match.camY) / match.scale;
  }

  function handlePointerDown(e) {
    input.pointerActive = true;
    updatePointerTarget(e.clientX, e.clientY);
  }

  function handlePointerMove(e) {
    if (input.pointerActive) {
      updatePointerTarget(e.clientX, e.clientY);
    }
  }

  function handlePointerUp() {
    input.pointerActive = false;
  }

  window.openActionSoccerHD = function (onExit) {
    onExitCallback = onExit;
    if (modal) {
      modal.remove();
      modal = null;
    }

    modal = document.createElement("div");
    modal.id = "actionSoccerModal";
    modal.tabIndex = 0;
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "#050b14";
    modal.style.zIndex = "999999";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.outline = "none";

    modal.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 14px; background:#0b1320; border-bottom:1px solid #1e293b; color:#fff; z-index:10;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:20px;">⚽</span>
          <div>
            <h2 style="margin:0; font-size:15px; font-weight:bold; color:#22c55e;">Top-Down Action Football 2D HD</h2>
            <span style="font-size:11px; color:#94a3b8;">Tocca/Trascina sul campo per correre · Frecce/WASD · Pulsanti a schermo per Passaggio e Tiro</span>
          </div>
        </div>
        <div style="display:flex; gap:6px;">
          <button id="actionResetBtn" style="background:#0284c7; color:#fff; border:none; padding:5px 10px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">Ricomincia 🔄</button>
          <button id="actionCloseBtn" style="background:#e63946; color:#fff; border:none; padding:5px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">Chiudi ✕</button>
        </div>
      </div>

      <div style="flex:1; position:relative; overflow:hidden;">
        <canvas id="actionCanvas" style="width:100%; height:100%; display:block; touch-action:none;"></canvas>

        <!-- Floating On-Screen D-PAD Controls (bottom-left) -->
        <div id="actionDpad" style="position:absolute; bottom:20px; left:20px; width:130px; height:130px; display:grid; grid-template-columns:repeat(3, 1fr); grid-template-rows:repeat(3, 1fr); gap:4px; z-index:20; touch-action:none; user-select:none;">
          <div></div>
          <button id="btnUp" style="background:rgba(30,41,59,0.85); color:#fff; border:2px solid #475569; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▲</button>
          <div></div>
          <button id="btnLeft" style="background:rgba(30,41,59,0.85); color:#fff; border:2px solid #475569; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">◀</button>
          <div style="background:rgba(15,23,42,0.6); border-radius:6px; display:flex; align-items:center; justify-content:center; color:#64748b; font-size:11px;">LEVA</div>
          <button id="btnRight" style="background:rgba(30,41,59,0.85); color:#fff; border:2px solid #475569; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▶</button>
          <div></div>
          <button id="btnDown" style="background:rgba(30,41,59,0.85); color:#fff; border:2px solid #475569; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▼</button>
          <div></div>
        </div>

        <!-- Floating Action Buttons (bottom-right) -->
        <div style="position:absolute; bottom:24px; right:20px; display:flex; gap:14px; z-index:20; touch-action:none; user-select:none;">
          <button id="btnPass" style="width:68px; height:68px; border-radius:50%; background:#2563eb; color:#fff; font-weight:bold; font-size:13px; border:3px solid #60a5fa; box-shadow:0 6px 15px rgba(0,0,0,0.5); cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <span>PASS</span>
            <small style="font-size:10px; opacity:0.8;">[Z]</small>
          </button>
          <button id="btnShoot" style="width:72px; height:72px; border-radius:50%; background:#dc2626; color:#fff; font-weight:bold; font-size:14px; border:3px solid #f87171; box-shadow:0 6px 15px rgba(0,0,0,0.5); cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <span>TIRO</span>
            <small style="font-size:10px; opacity:0.8;">[X]</small>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    canvas = document.getElementById("actionCanvas");
    ctx = canvas.getContext("2d");

    // Close button
    document.getElementById("actionCloseBtn").onclick = function () {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      modal.remove();
      modal = null;
      if (typeof onExitCallback === "function") onExitCallback();
    };

    document.getElementById("actionResetBtn").onclick = function () {
      resetMatch(true);
    };

    // Wire On-Screen D-Pad Buttons
    const bindHoldBtn = (btnId, keyName) => {
      const b = document.getElementById(btnId);
      if (!b) return;
      const start = (e) => { e.preventDefault(); input[keyName] = true; b.style.background = "#2563eb"; };
      const stop = (e) => { e.preventDefault(); input[keyName] = false; b.style.background = "rgba(30,41,59,0.85)"; };
      b.addEventListener("pointerdown", start);
      b.addEventListener("pointerup", stop);
      b.addEventListener("pointerleave", stop);
      b.addEventListener("pointercancel", stop);
    };

    bindHoldBtn("btnUp", "up");
    bindHoldBtn("btnDown", "down");
    bindHoldBtn("btnLeft", "left");
    bindHoldBtn("btnRight", "right");

    // Wire On-Screen Action Buttons
    const btnPass = document.getElementById("btnPass");
    btnPass.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      input.pass = true;
      btnPass.style.transform = "scale(0.92)";
      setTimeout(() => { input.pass = false; btnPass.style.transform = "none"; }, 200);
    });

    const btnShoot = document.getElementById("btnShoot");
    btnShoot.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      input.shoot = true;
      btnShoot.style.transform = "scale(0.92)";
      setTimeout(() => { input.shoot = false; btnShoot.style.transform = "none"; }, 200);
    });

    // Canvas Pointer events for Touch/Click-to-Move
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    // Global and window keyboard events
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    window.addEventListener("resize", resizeCanvas);

    modal.focus();
    resetMatch(true);
    resizeCanvas();
    render();
  };
})();
