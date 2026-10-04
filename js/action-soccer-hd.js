// js/action-soccer-hd.js - Top-Down Action Soccer 2D HD (Sensible / Kick-Off Style)
(function () {
  let modal = null;
  let canvas = null;
  let ctx = null;
  let animId = null;
  let onExitCallback = null;

  // Virtual Gamepad
  const input = {
    up: false, down: false, left: false, right: false,
    pass: false, shoot: false, tackle: false,
    aftertouchX: 0, aftertouchY: 0
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
    matchDuration: 180, // 3 minutes simulated as 90 min
    state: "kickoff", // 'kickoff', 'play', 'goal', 'halftime', 'fulltime'
    activePlayerId: 0,
    radarScale: 0.15,
    camera: { x: 0, y: 0, zoom: 1 },
    ball: {
      x: FIELD_W / 2,
      y: FIELD_H / 2,
      vx: 0,
      vy: 0,
      vz: 0,
      z: 0,
      spinX: 0,
      spinY: 0,
      carrier: null
    },
    teamA: [], // Rondine (Player)
    teamB: []  // Rivals (AI)
  };

  function createTeam(isPlayer) {
    const prefix = isPlayer ? "R" : "A";
    const color = isPlayer ? "#1e3a8a" : "#dc2626";
    const secColor = isPlayer ? "#38bdf8" : "#f87171";

    const basePositions = isPlayer ? [
      { role: "GK", x: 90, y: FIELD_H / 2, isGK: true, speed: 2.8, name: "Sandro" },
      { role: "DEF", x: 280, y: FIELD_H * 0.3, speed: 3.4, name: "Chicco" },
      { role: "DEF", x: 280, y: FIELD_H * 0.7, speed: 3.4, name: "Baciccia Jr" },
      { role: "MID", x: 480, y: FIELD_H / 2, speed: 3.8, name: "Leo (C)" },
      { role: "FWD", x: 580, y: FIELD_H * 0.45, speed: 4.1, name: "Nico" }
    ] : [
      { role: "GK", x: FIELD_W - 90, y: FIELD_H / 2, isGK: true, speed: 2.8, name: "Portiere" },
      { role: "DEF", x: FIELD_W - 280, y: FIELD_H * 0.3, speed: 3.3, name: "Difensore 1" },
      { role: "DEF", x: FIELD_W - 280, y: FIELD_H * 0.7, speed: 3.3, name: "Difensore 2" },
      { role: "MID", x: FIELD_W - 480, y: FIELD_H / 2, speed: 3.6, name: "Regista" },
      { role: "FWD", x: FIELD_W - 580, y: FIELD_H * 0.55, speed: 3.9, name: "Punta" }
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
      isTackling: false,
      tackleTimer: 0,
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
      spinY: 0,
      carrier: null
    };
    match.activePlayerId = 3; // Start controlling Leo
    if (window.HD2DAudio) window.HD2DAudio.playWhistle(true);
  }

  // Physics & Game Loop
  function updatePhysics() {
    if (match.state === "goal" || match.state === "fulltime") return;

    match.time += 1 / 60;
    const b = match.ball;

    // Apply friction and air resistance
    b.vx *= 0.982;
    b.vy *= 0.982;

    // Apply aftertouch curve spin
    if (Math.abs(b.spinX) > 0.05) {
      b.vx += b.spinX * 0.08;
      b.spinX *= 0.94;
    }
    if (Math.abs(b.spinY) > 0.05) {
      b.vy += b.spinY * 0.08;
      b.spinY *= 0.94;
    }

    // Vertical physics (ball height)
    if (b.z > 0 || b.vz > 0) {
      b.z += b.vz;
      b.vz -= 0.35; // Gravity
      if (b.z <= 0) {
        b.z = 0;
        b.vz = -b.vz * 0.6; // Bounce
        if (Math.abs(b.vz) > 1 && window.HD2DAudio) window.HD2DAudio.playBounce();
      }
    }

    b.x += b.vx;
    b.y += b.vy;

    // Boundary Collisions & Goals
    const goalTop = (FIELD_H - GOAL_H) / 2;
    const goalBottom = goalTop + GOAL_H;

    // Left Goal (Team B scores on Team A)
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

    // Right Goal (Team A scores on Team B)
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
    if (b.y <= 30) {
      b.y = 30;
      b.vy = -b.vy * 0.6;
    }
    if (b.y >= FIELD_H - 30) {
      b.y = FIELD_H - 30;
      b.vy = -b.vy * 0.6;
    }

    // Update Player & AI
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
    }, 2400);
  }

  function updatePlayers() {
    const b = match.ball;

    // Find closest player to ball for user control
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
      if (input.up) dy -= 1;
      if (input.down) dy += 1;
      if (input.left) dx -= 1;
      if (input.right) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      userP.vx = dx * userP.speed;
      userP.vy = dy * userP.speed;
      userP.x += userP.vx;
      userP.y += userP.vy;

      // Handle user actions
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

    // Touch / Dribble ball
    if (dist < 26 && b.z < 25 && p.kickCooldown === 0) {
      if (isUser) {
        if (input.shoot) {
          // Shoot towards enemy goal
          const targetX = FIELD_W - 40;
          const targetY = FIELD_H / 2 + (Math.random() * 80 - 40);
          const angle = Math.atan2(targetY - p.y, targetX - p.x);
          const power = 13.5;
          b.vx = Math.cos(angle) * power;
          b.vy = Math.sin(angle) * power;
          b.vz = 4.2;
          // Apply aftertouch spin
          b.spinY = input.up ? -1.5 : (input.down ? 1.5 : 0);
          p.kickCooldown = 25;
          if (window.HD2DAudio) window.HD2DAudio.playKick(1.2);
        } else if (input.pass) {
          // Pass to forward teammate
          const teammate = match.teamA.find(t => t !== p && !t.isGK && t.x > p.x - 50) || match.teamA[4];
          const angle = Math.atan2(teammate.y - p.y, teammate.x - p.x);
          const power = 9.5;
          b.vx = Math.cos(angle) * power;
          b.vy = Math.sin(angle) * power;
          b.vz = 1.5;
          p.kickCooldown = 20;
          if (window.HD2DAudio) window.HD2DAudio.playKick(0.9);
        } else {
          // Dribble
          b.vx = p.vx * 1.1 + (Math.cos(Math.atan2(p.vy, p.vx || 0.1)) * 1.8);
          b.vy = p.vy * 1.1 + (Math.sin(Math.atan2(p.vy, p.vx || 0.1)) * 1.8);
        }
      }
    }
  }

  function updateTeammateAI(p) {
    const b = match.ball;
    let targetX = p.role === "DEF" ? 250 + (b.x * 0.25) : (p.role === "MID" ? 450 + (b.x * 0.3) : 600 + (b.x * 0.35));
    let targetY = p.targetY + (b.y - FIELD_H / 2) * 0.35;

    const angle = Math.atan2(targetY - p.y, targetX - p.x);
    p.vx = Math.cos(angle) * (p.speed * 0.65);
    p.vy = Math.sin(angle) * (p.speed * 0.65);
    p.x += p.vx;
    p.y += p.vy;
  }

  function updateEnemyAI(p) {
    const b = match.ball;
    const distToBall = Math.hypot(p.x - b.x, p.y - b.y);

    if (distToBall < 25 && b.z < 25) {
      // Enemy shoots or passes
      if (p.x < FIELD_W * 0.4) {
        // Shoot at player goal
        const angle = Math.atan2(FIELD_H / 2 - p.y, 40 - p.x);
        b.vx = Math.cos(angle) * 11;
        b.vy = Math.sin(angle) * 11;
        b.vz = 3.5;
        p.kickCooldown = 25;
        if (window.HD2DAudio) window.HD2DAudio.playKick(1.1);
      } else {
        // Advance / Dribble
        b.vx = -p.speed * 1.2;
        b.vy = (Math.random() - 0.5) * 2;
      }
    } else {
      // Move towards ball if near or maintain tactical line
      let targetX = distToBall < 260 ? b.x : p.targetX;
      let targetY = distToBall < 260 ? b.y : p.targetY;
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
    const goalRange = GOAL_H * 0.42;

    // Player GK (Left)
    if (gkA) {
      const targetY = Math.max(goalMidY - goalRange, Math.min(goalMidY + goalRange, b.y));
      gkA.y += (targetY - gkA.y) * 0.08;
      // Parata
      if (Math.hypot(gkA.x - b.x, gkA.y - b.y) < 38 && b.x < 120) {
        b.vx = Math.abs(b.vx) * 0.7 + 3;
        b.vy = (b.y - gkA.y) * 0.2;
        if (window.HD2DAudio) window.HD2DAudio.playBounce();
      }
    }

    // Enemy GK (Right)
    if (gkB) {
      const targetY = Math.max(goalMidY - goalRange, Math.min(goalMidY + goalRange, b.y));
      gkB.y += (targetY - gkB.y) * 0.08;
      // Parata
      if (Math.hypot(gkB.x - b.x, gkB.y - b.y) < 38 && b.x > FIELD_W - 120) {
        b.vx = -Math.abs(b.vx) * 0.7 - 3;
        b.vy = (b.y - gkB.y) * 0.2;
        if (window.HD2DAudio) window.HD2DAudio.playBounce();
      }
    }
  }

  // Rendering
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

    // Camera follows ball smoothly
    const b = match.ball;
    const scale = Math.min(w / (FIELD_W * 0.75), h / (FIELD_H * 0.75));
    const camX = w / 2 - b.x * scale;
    const camY = h / 2 - b.y * scale;

    ctx.save();
    ctx.fillStyle = "#0c1523";
    ctx.fillRect(0, 0, w, h);

    // Apply Camera Transform
    ctx.translate(camX, camY);
    ctx.scale(scale, scale);

    // Pitch Background
    ctx.fillStyle = "#1e7e34";
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);

    // Mown Stripes
    const stripeW = 80;
    for (let x = 0; x < FIELD_W; x += stripeW * 2) {
      ctx.fillStyle = "#28a745";
      ctx.fillRect(x, 0, stripeW, FIELD_H);
    }

    // Field Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 30, FIELD_W - 80, FIELD_H - 60);

    // Halfway Line & Center Circle
    ctx.beginPath();
    ctx.moveTo(FIELD_W / 2, 30);
    ctx.lineTo(FIELD_W / 2, FIELD_H - 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(FIELD_W / 2, FIELD_H / 2, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty Areas & Goals
    const goalTop = (FIELD_H - GOAL_H) / 2;
    // Left Box
    ctx.strokeRect(40, FIELD_H / 2 - 160, 160, 320);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(10, goalTop, 30, GOAL_H);
    ctx.strokeRect(10, goalTop, 30, GOAL_H);

    // Right Box
    ctx.strokeRect(FIELD_W - 200, FIELD_H / 2 - 160, 160, 320);
    ctx.fillRect(FIELD_W - 40, goalTop, 30, GOAL_H);
    ctx.strokeRect(FIELD_W - 40, goalTop, 30, GOAL_H);

    // Draw Players
    const drawPlayer = (p, isActive) => {
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 12, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body / Kit
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
      ctx.fill();

      // Trim / Details
      ctx.strokeStyle = p.secColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Active Ring for User
      if (isActive) {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 19, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Name Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.name, p.x, p.y - 18);
    };

    match.teamA.forEach((p, idx) => drawPlayer(p, idx === match.activePlayerId));
    match.teamB.forEach(p => drawPlayer(p, false));

    // Draw Ball
    // Ball Shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, Math.max(3, 8 - b.z * 0.1), Math.max(2, 4 - b.z * 0.05), 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball Sphere
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(b.x, b.y - b.z, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();

    // Draw HUD & Controls
    drawHUD(w, h);

    animId = requestAnimationFrame(render);
  }

  function drawHUD(w, h) {
    // Scoreboard Banner
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.fillRect(w / 2 - 160, 10, 320, 48);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.strokeRect(w / 2 - 160, 10, 320, 48);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("RONDINE", w / 2 - 140, 38);

    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "right";
    ctx.fillText("RIVALI", w / 2 + 140, 38);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${match.scoreA} - ${match.scoreB}`, w / 2, 42);

    // Touch Virtual Buttons for Mobile
    drawTouchButtons(w, h);
  }

  function drawTouchButtons(w, h) {
    const isMobile = window.innerWidth <= 800 || "ontouchstart" in window;
    if (!isMobile) return;

    // D-PAD on Left
    const dpadX = 80;
    const dpadY = h - 90;
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.arc(dpadX, dpadY, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Leva 🕹️", dpadX, dpadY + 5);

    // Pass / Shoot Buttons on Right
    const btnPassX = w - 120;
    const btnPassY = h - 70;
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(btnPassX, btnPassY, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("PASS", btnPassX, btnPassY + 5);

    const btnShootX = w - 50;
    const btnShootY = h - 120;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(btnShootX, btnShootY, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("TIRO", btnShootX, btnShootY + 5);
  }

  // Keyboard Listeners
  function handleKeyDown(e) {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") input.up = true;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") input.down = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") input.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") input.right = true;
    if (e.key === "z" || e.key === "Z" || e.key === " ") input.pass = true;
    if (e.key === "x" || e.key === "X" || e.key === "Enter") input.shoot = true;
  }

  function handleKeyUp(e) {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") input.up = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") input.down = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") input.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") input.right = false;
    if (e.key === "z" || e.key === "Z" || e.key === " ") input.pass = false;
    if (e.key === "x" || e.key === "X" || e.key === "Enter") input.shoot = false;
  }

  // Touch Pointer Listeners
  function handlePointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    // Check virtual buttons
    if (px > w - 160 && py > h - 160) {
      if (Math.hypot(px - (w - 120), py - (h - 70)) < 38) {
        input.pass = true;
        setTimeout(() => { input.pass = false; }, 180);
      } else if (Math.hypot(px - (w - 50), py - (h - 120)) < 40) {
        input.shoot = true;
        setTimeout(() => { input.shoot = false; }, 180);
      }
    } else if (px < 160 && py > h - 160) {
      // D-Pad Touch
      const dpadX = 80;
      const dpadY = h - 90;
      const dx = px - dpadX;
      const dy = py - dpadY;
      input.left = dx < -15;
      input.right = dx > 15;
      input.up = dy < -15;
      input.down = dy > 15;
    }
  }

  function handlePointerUp() {
    input.left = false;
    input.right = false;
    input.up = false;
    input.down = false;
    input.pass = false;
    input.shoot = false;
  }

  // Open Modal
  window.openActionSoccerHD = function (onExit) {
    onExitCallback = onExit;
    if (modal) {
      modal.remove();
      modal = null;
    }

    modal = document.createElement("div");
    modal.id = "actionSoccerModal";
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
          <span style="font-size:22px;">⚽</span>
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:bold; color:#22c55e;">Top-Down Action Football 2D HD</h2>
            <span style="font-size:11px; color:#94a3b8;">Sensible / Kick-Off Style · Fisica 60fps · Comandi: WASD/Frecce + Z (Passaggio), X (Tiro)</span>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="actionResetBtn" style="background:#0284c7; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold;">Ricomincia 🔄</button>
          <button id="actionCloseBtn" style="background:#e63946; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:bold;">Chiudi ✕</button>
        </div>
      </div>
      <div style="flex:1; position:relative; overflow:hidden;">
        <canvas id="actionCanvas" style="width:100%; height:100%; display:block; touch-action:none;"></canvas>
      </div>
    `;

    document.body.appendChild(modal);

    canvas = document.getElementById("actionCanvas");
    ctx = canvas.getContext("2d");

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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("resize", resizeCanvas);

    resetMatch(true);
    resizeCanvas();
    render();
  };
})();
