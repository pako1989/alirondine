// js/street-cage-hd.js - 3v3 Street Soccer in the Pier Cage with Wall Bounces
(function () {
  let modal = null;
  let canvas = null;
  let ctx = null;
  let animId = null;
  let onExitCallback = null;

  const CAGE_W = 900;
  const CAGE_H = 560;
  const GOAL_H = 110;

  const input = {
    up: false, down: false, left: false, right: false,
    pass: false, shoot: false, trick: false
  };

  let state = {
    scoreA: 0,
    scoreB: 0,
    grintaMeter: 35, // 0 - 100
    grintaMax: 100,
    grintaActive: false,
    activeIdx: 0,
    ball: {
      x: CAGE_W / 2,
      y: CAGE_H / 2,
      vx: 0,
      vy: 0,
      trail: []
    },
    teamA: [], // Leo, Nico, Dario (Rondine Street)
    teamB: []  // I Corsari della Banchina (3 Street Rivals)
  };

  function createStreetTeams() {
    return {
      teamA: [
        { name: "Leo", x: 260, y: CAGE_H / 2, vx: 0, vy: 0, speed: 4.2, color: "#2563eb", isPlayer: true },
        { name: "Nico", x: 380, y: CAGE_H * 0.28, vx: 0, vy: 0, speed: 4.8, color: "#38bdf8", isPlayer: true },
        { name: "Dario", x: 180, y: CAGE_H * 0.72, vx: 0, vy: 0, speed: 3.9, color: "#1d4ed8", isPlayer: true }
      ],
      teamB: [
        { name: "Corsaro 1", x: CAGE_W - 260, y: CAGE_H / 2, vx: 0, vy: 0, speed: 4.0, color: "#ea580c", isPlayer: false },
        { name: "Corsaro 2", x: CAGE_W - 380, y: CAGE_H * 0.3, vx: 0, vy: 0, speed: 4.4, color: "#c2410c", isPlayer: false },
        { name: "Corsaro 3", x: CAGE_W - 180, y: CAGE_H * 0.7, vx: 0, vy: 0, speed: 3.8, color: "#9a3412", isPlayer: false }
      ]
    };
  }

  function resetStreetMatch() {
    const teams = createStreetTeams();
    state.teamA = teams.teamA;
    state.teamB = teams.teamB;
    state.ball = {
      x: CAGE_W / 2,
      y: CAGE_H / 2,
      vx: 0,
      vy: 0,
      trail: []
    };
    state.grintaMeter = Math.min(100, state.grintaMeter + 20);
    if (window.HD2DAudio) window.HD2DAudio.playWhistle(true);
  }

  function updateStreetPhysics() {
    const b = state.ball;

    // Trail
    b.trail.unshift({ x: b.x, y: b.y });
    if (b.trail.length > 8) b.trail.pop();

    b.vx *= 0.985;
    b.vy *= 0.985;
    b.x += b.vx;
    b.y += b.vy;

    const goalTop = (CAGE_H - GOAL_H) / 2;
    const goalBottom = goalTop + GOAL_H;

    // Wall Bounces (Top & Bottom Walls)
    if (b.y <= 25) {
      b.y = 25;
      b.vy = -b.vy * 0.88;
      state.grintaMeter = Math.min(100, state.grintaMeter + 5);
      if (window.HD2DAudio) window.HD2DAudio.playWall();
    }
    if (b.y >= CAGE_H - 25) {
      b.y = CAGE_H - 25;
      b.vy = -b.vy * 0.88;
      state.grintaMeter = Math.min(100, state.grintaMeter + 5);
      if (window.HD2DAudio) window.HD2DAudio.playWall();
    }

    // Left Goal & Wall
    if (b.x <= 30) {
      if (b.y >= goalTop && b.y <= goalBottom) {
        // Goal Rivals
        state.scoreB++;
        if (window.toast) window.toast("⚽ Gol dei Corsari!", "error", "⚽");
        if (window.HD2DAudio) window.HD2DAudio.playGoal();
        setTimeout(resetStreetMatch, 1800);
        return;
      } else {
        b.x = 30;
        b.vx = -b.vx * 0.88;
        if (window.HD2DAudio) window.HD2DAudio.playWall();
      }
    }

    // Right Goal & Wall
    if (b.x >= CAGE_W - 30) {
      if (b.y >= goalTop && b.y <= goalBottom) {
        // Goal Rondine
        state.scoreA++;
        if (window.toast) window.toast("🔥 GOOOL SPONDA DELLA RONDINE!", "success", "🔥");
        if (window.fireConfetti) window.fireConfetti();
        if (window.HD2DAudio) window.HD2DAudio.playGoal();
        setTimeout(resetStreetMatch, 1800);
        return;
      } else {
        b.x = CAGE_W - 30;
        b.vx = -b.vx * 0.88;
        if (window.HD2DAudio) window.HD2DAudio.playWall();
      }
    }

    // Update Street Players
    updateStreetPlayers();
  }

  function updateStreetPlayers() {
    const b = state.ball;

    // Active user player closest to ball
    let bestDist = 9999;
    let closestIdx = 0;
    state.teamA.forEach((p, idx) => {
      const d = Math.hypot(p.x - b.x, p.y - b.y);
      if (d < bestDist) {
        bestDist = d;
        closestIdx = idx;
      }
    });
    state.activeIdx = closestIdx;

    const user = state.teamA[state.activeIdx];
    if (user) {
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

      user.x += dx * user.speed;
      user.y += dy * user.speed;
      user.x = Math.max(35, Math.min(CAGE_W - 35, user.x));
      user.y = Math.max(30, Math.min(CAGE_H - 30, user.y));

      // Street Ball touch
      const dist = Math.hypot(user.x - b.x, user.y - b.y);
      if (dist < 26) {
        if (input.shoot) {
          const power = state.grintaMeter >= 100 ? 16 : 12;
          const targetY = CAGE_H / 2 + (Math.random() * 60 - 30);
          const angle = Math.atan2(targetY - user.y, (CAGE_W - 30) - user.x);
          b.vx = Math.cos(angle) * power;
          b.vy = Math.sin(angle) * power;
          if (state.grintaMeter >= 100) {
            state.grintaMeter = 0;
            if (window.toast) window.toast("⚡ TIRO DEL TRABUCCO A FUOCO!", "info", "⚡");
          }
          if (window.HD2DAudio) window.HD2DAudio.playKick(1.3);
        } else if (input.pass) {
          // Ricochet Pass to teammate
          const mate = state.teamA.find(m => m !== user) || state.teamA[0];
          const angle = Math.atan2(mate.y - user.y, mate.x - user.x);
          b.vx = Math.cos(angle) * 10;
          b.vy = Math.sin(angle) * 10;
          state.grintaMeter = Math.min(100, state.grintaMeter + 10);
          if (window.HD2DAudio) window.HD2DAudio.playKick(0.9);
        } else {
          // Push ball
          b.vx = dx * 4 + (b.vx * 0.7);
          b.vy = dy * 4 + (b.vy * 0.7);
        }
      }
    }

    // AI Teammates
    state.teamA.forEach((p, idx) => {
      if (idx !== state.activeIdx) {
        const targetX = 200 + idx * 140 + b.x * 0.2;
        const targetY = CAGE_H * (idx === 1 ? 0.3 : 0.7);
        p.x += (targetX - p.x) * 0.05;
        p.y += (targetY - p.y) * 0.05;
      }
    });

    // Street Rival AI
    state.teamB.forEach((p, idx) => {
      const d = Math.hypot(p.x - b.x, p.y - b.y);
      if (d < 24) {
        // Shoot at left goal
        const angle = Math.atan2(CAGE_H / 2 - p.y, 30 - p.x);
        b.vx = Math.cos(angle) * 11;
        b.vy = Math.sin(angle) * 11;
        if (window.HD2DAudio) window.HD2DAudio.playKick(1.1);
      } else {
        const targetX = idx === 0 ? b.x : CAGE_W - 200 - idx * 60;
        const targetY = idx === 0 ? b.y : CAGE_H * (idx === 1 ? 0.35 : 0.65);
        p.x += (targetX - p.x) * 0.045;
        p.y += (targetY - p.y) * 0.045;
      }
    });
  }

  // Canvas Rendering
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

    updateStreetPhysics();

    const scale = Math.min((w - 40) / CAGE_W, (h - 90) / CAGE_H);
    const offsetX = (w - CAGE_W * scale) / 2;
    const offsetY = 50 + (h - 90 - CAGE_H * scale) / 2;

    ctx.save();
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Concrete Street Surface
    ctx.fillStyle = "#272e3f";
    ctx.fillRect(0, 0, CAGE_W, CAGE_H);

    // Street Cage Grid Lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < CAGE_W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CAGE_H); ctx.stroke();
    }
    for (let y = 0; y < CAGE_H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CAGE_W, y); ctx.stroke();
    }

    // Heavy Metal Cage Perimeter Walls
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, CAGE_W - 40, CAGE_H - 40);

    // Center Graffiti Circle
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(CAGE_W / 2, CAGE_H / 2, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GABBIA DEL MOLO", CAGE_W / 2, CAGE_H / 2 + 10);

    // Goals (Small Street Goals)
    const goalTop = (CAGE_H - GOAL_H) / 2;
    ctx.fillStyle = "rgba(59, 130, 246, 0.35)";
    ctx.fillRect(5, goalTop, 20, GOAL_H);
    ctx.strokeRect(5, goalTop, 20, GOAL_H);

    ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
    ctx.fillRect(CAGE_W - 25, goalTop, 20, GOAL_H);
    ctx.strokeRect(CAGE_W - 25, goalTop, 20, GOAL_H);

    // Players
    const drawStreetDude = (p, isActive) => {
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 11, 13, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
      ctx.fill();

      if (isActive) {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.name, p.x, p.y - 18);
    };

    state.teamA.forEach((p, idx) => drawStreetDude(p, idx === state.activeIdx));
    state.teamB.forEach(p => drawStreetDude(p, false));

    // Ball with fiery trail if high Grinta
    const b = state.ball;
    b.trail.forEach((t, i) => {
      ctx.fillStyle = state.grintaMeter >= 100 ? `rgba(249, 115, 22, ${0.7 - i * 0.08})` : `rgba(255, 255, 255, ${0.4 - i * 0.05})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 6 - i * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = state.grintaMeter >= 100 ? "#f97316" : "#ffffff";
    ctx.beginPath();
    ctx.arc(b.x, b.y, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Top HUD
    drawStreetHUD(w, h);

    animId = requestAnimationFrame(render);
  }

  function drawStreetHUD(w, h) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, 52);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 52); ctx.lineTo(w, 52); ctx.stroke();

    // Title
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("👟 STREET SOCCER · LA GABBIA DEL MOLO (3v3)", 16, 25);

    // Score
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px monospace";
    ctx.fillText(`RONDINE ${state.scoreA} - ${state.scoreB} CORSARI`, 16, 45);

    // Grinta Meter
    const barW = Math.min(220, w * 0.28);
    const barX = w - barW - 130;
    ctx.fillStyle = "#334155";
    ctx.fillRect(barX, 16, barW, 20);
    ctx.fillStyle = state.grintaMeter >= 100 ? "#f97316" : "#38bdf8";
    ctx.fillRect(barX, 16, (state.grintaMeter / state.grintaMax) * barW, 20);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, 16, barW, 20);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(state.grintaMeter >= 100 ? "🔥 GRINTA AL MASSIMO!" : `Grinta Molo: ${Math.floor(state.grintaMeter)}%`, barX + barW / 2, 31);
  }

  // Keyboard
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

  window.openStreetCageMode = function (onExit) {
    onExitCallback = onExit;
    if (modal) {
      modal.remove();
      modal = null;
    }

    modal = document.createElement("div");
    modal.id = "streetCageModal";
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
          <span style="font-size:22px;">👟</span>
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:bold; color:#f59e0b;">Street Football 2D HD · La Gabbia del Molo</h2>
            <span style="font-size:11px; color:#94a3b8;">Calcio da Strada 3v3 con sponde sui muri e barra Grinta! Comandi: WASD/Frecce + Z (Passaggio), X (Tiro)</span>
          </div>
        </div>
        <button id="streetCloseBtn" style="background:#e63946; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:bold;">Chiudi ✕</button>
      </div>
      <div style="flex:1; position:relative; overflow:hidden;">
        <canvas id="streetCanvas" style="width:100%; height:100%; display:block;"></canvas>
      </div>
    `;

    document.body.appendChild(modal);

    canvas = document.getElementById("streetCanvas");
    ctx = canvas.getContext("2d");

    document.getElementById("streetCloseBtn").onclick = function () {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      modal.remove();
      modal = null;
      if (typeof onExitCallback === "function") onExitCallback();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", resizeCanvas);

    resetStreetMatch();
    resizeCanvas();
    render();
  };
})();
