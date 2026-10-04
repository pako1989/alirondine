// js/street-cage-hd.js - 3v3 Street Soccer in the Pier Cage with Wall Bounces
(function () {
  let modal = null;
  let canvas = null;
  let ctx = null;
  let animId = null;
  let onExitCallback = null;

  const CAGE_W = 900;
  const CAGE_H = 560;
  const GOAL_H = 120;

  const input = {
    up: false, down: false, left: false, right: false,
    pass: false, shoot: false,
    pointerActive: false,
    pointerTargetX: 0,
    pointerTargetY: 0
  };

  let state = {
    scoreA: 0,
    scoreB: 0,
    grintaMeter: 35,
    grintaMax: 100,
    activeIdx: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    ball: {
      x: CAGE_W / 2,
      y: CAGE_H / 2,
      vx: 0,
      vy: 0,
      trail: []
    },
    teamA: [], // Rondine Street (Leo, Nico, Dario)
    teamB: []  // I Corsari della Banchina (3 Street Rivals)
  };

  function createStreetTeams() {
    return {
      teamA: [
        { name: "Leo", x: 260, y: CAGE_H / 2, vx: 0, vy: 0, speed: 4.8, color: "#2563eb", isPlayer: true },
        { name: "Nico", x: 380, y: CAGE_H * 0.28, vx: 0, vy: 0, speed: 5.2, color: "#38bdf8", isPlayer: true },
        { name: "Dario", x: 180, y: CAGE_H * 0.72, vx: 0, vy: 0, speed: 4.4, color: "#1d4ed8", isPlayer: true }
      ],
      teamB: [
        { name: "Corsaro 1", x: CAGE_W - 260, y: CAGE_H / 2, vx: 0, vy: 0, speed: 4.3, color: "#ea580c", isPlayer: false },
        { name: "Corsaro 2", x: CAGE_W - 380, y: CAGE_H * 0.3, vx: 0, vy: 0, speed: 4.6, color: "#c2410c", isPlayer: false },
        { name: "Corsaro 3", x: CAGE_W - 180, y: CAGE_H * 0.7, vx: 0, vy: 0, speed: 4.0, color: "#9a3412", isPlayer: false }
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

    updateStreetPlayers();
  }

  function updateStreetPlayers() {
    const b = state.ball;

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

      if (input.pointerActive) {
        const pdx = input.pointerTargetX - user.x;
        const pdy = input.pointerTargetY - user.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist > 15) {
          dx = pdx / pdist;
          dy = pdy / pdist;
        }
      }

      if (dx !== 0 && dy !== 0 && !input.pointerActive) {
        dx *= 0.707;
        dy *= 0.707;
      }

      user.x += dx * user.speed;
      user.y += dy * user.speed;
      user.x = Math.max(35, Math.min(CAGE_W - 35, user.x));
      user.y = Math.max(30, Math.min(CAGE_H - 30, user.y));

      const dist = Math.hypot(user.x - b.x, user.y - b.y);
      if (dist < 28) {
        if (input.shoot) {
          const power = state.grintaMeter >= 100 ? 17 : 13;
          const targetY = CAGE_H / 2 + (Math.random() * 60 - 30);
          const angle = Math.atan2(targetY - user.y, (CAGE_W - 30) - user.x);
          b.vx = Math.cos(angle) * power;
          b.vy = Math.sin(angle) * power;
          if (state.grintaMeter >= 100) {
            state.grintaMeter = 0;
            if (window.toast) window.toast("⚡ TIRO DEL TRABUCCO A FUOCO!", "info", "⚡");
          }
          if (window.HD2DAudio) window.HD2DAudio.playKick(1.3);
          input.shoot = false;
        } else if (input.pass) {
          const mate = state.teamA.find(m => m !== user) || state.teamA[0];
          const angle = Math.atan2(mate.y - user.y, mate.x - user.x);
          b.vx = Math.cos(angle) * 11;
          b.vy = Math.sin(angle) * 11;
          state.grintaMeter = Math.min(100, state.grintaMeter + 10);
          if (window.HD2DAudio) window.HD2DAudio.playKick(0.9);
          input.pass = false;
        } else {
          b.vx = dx * 4.2 + (b.vx * 0.7);
          b.vy = dy * 4.2 + (b.vy * 0.7);
        }
      }
    }

    state.teamA.forEach((p, idx) => {
      if (idx !== state.activeIdx) {
        const targetX = 200 + idx * 140 + b.x * 0.2;
        const targetY = CAGE_H * (idx === 1 ? 0.3 : 0.7);
        p.x += (targetX - p.x) * 0.06;
        p.y += (targetY - p.y) * 0.06;
      }
    });

    state.teamB.forEach((p, idx) => {
      const d = Math.hypot(p.x - b.x, p.y - b.y);
      if (d < 26) {
        const angle = Math.atan2(CAGE_H / 2 - p.y, 30 - p.x);
        b.vx = Math.cos(angle) * 11;
        b.vy = Math.sin(angle) * 11;
        if (window.HD2DAudio) window.HD2DAudio.playKick(1.1);
      } else {
        const targetX = idx === 0 ? b.x : CAGE_W - 200 - idx * 60;
        const targetY = idx === 0 ? b.y : CAGE_H * (idx === 1 ? 0.35 : 0.65);
        p.x += (targetX - p.x) * 0.048;
        p.y += (targetY - p.y) * 0.048;
      }
    });
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

    updateStreetPhysics();

    const scale = Math.min((w - 40) / CAGE_W, (h - 80) / CAGE_H);
    const offsetX = (w - CAGE_W * scale) / 2;
    const offsetY = 50 + (h - 80 - CAGE_H * scale) / 2;
    state.scale = scale;
    state.offsetX = offsetX;
    state.offsetY = offsetY;

    ctx.save();
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Concrete
    ctx.fillStyle = "#272e3f";
    ctx.fillRect(0, 0, CAGE_W, CAGE_H);

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < CAGE_W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CAGE_H); ctx.stroke();
    }
    for (let y = 0; y < CAGE_H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CAGE_W, y); ctx.stroke();
    }

    // Heavy Metal Cage Walls
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

    // Goals
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
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }

      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.name, p.x, p.y - 18);
    };

    state.teamA.forEach((p, idx) => drawStreetDude(p, idx === state.activeIdx));
    state.teamB.forEach(p => drawStreetDude(p, false));

    // Ball
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
    ctx.fillRect(0, 0, w, 48);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 48); ctx.lineTo(w, 48); ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("👟 STREET SOCCER · LA GABBIA DEL MOLO (3v3)", 16, 22);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`RONDINE ${state.scoreA} - ${state.scoreB} CORSARI`, 16, 40);

    const barW = Math.min(200, w * 0.28);
    const barX = w - barW - 130;
    ctx.fillStyle = "#334155";
    ctx.fillRect(barX, 14, barW, 20);
    ctx.fillStyle = state.grintaMeter >= 100 ? "#f97316" : "#38bdf8";
    ctx.fillRect(barX, 14, (state.grintaMeter / state.grintaMax) * barW, 20);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, 14, barW, 20);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(state.grintaMeter >= 100 ? "🔥 GRINTA AL MASSIMO!" : `Grinta: ${Math.floor(state.grintaMeter)}%`, barX + barW / 2, 28);
  }

  function handleKeyDown(e) {
    const k = e.key;
    if (k === "ArrowUp" || k === "w" || k === "W") { input.up = true; e.preventDefault(); }
    if (k === "ArrowDown" || k === "s" || k === "S") { input.down = true; e.preventDefault(); }
    if (k === "ArrowLeft" || k === "a" || k === "A") { input.left = true; e.preventDefault(); }
    if (k === "ArrowRight" || k === "d" || k === "D") { input.right = true; e.preventDefault(); }
    if (k === "z" || k === "Z" || k === " ") { input.pass = true; e.preventDefault(); }
    if (k === "x" || k === "X" || k === "Enter") { input.shoot = true; e.preventDefault(); }
  }

  function handleKeyUp(e) {
    const k = e.key;
    if (k === "ArrowUp" || k === "w" || k === "W") input.up = false;
    if (k === "ArrowDown" || k === "s" || k === "S") input.down = false;
    if (k === "ArrowLeft" || k === "a" || k === "A") input.left = false;
    if (k === "ArrowRight" || k === "d" || k === "D") input.right = false;
    if (k === "z" || k === "Z" || k === " ") input.pass = false;
    if (k === "x" || k === "X" || k === "Enter") input.shoot = false;
  }

  function updatePointerTarget(clientX, clientY) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    input.pointerTargetX = (sx - state.offsetX) / state.scale;
    input.pointerTargetY = (sy - state.offsetY) / state.scale;
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

  window.openStreetCageMode = function (onExit) {
    onExitCallback = onExit;
    if (modal) {
      modal.remove();
      modal = null;
    }

    modal = document.createElement("div");
    modal.id = "streetCageModal";
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
          <span style="font-size:20px;">👟</span>
          <div>
            <h2 style="margin:0; font-size:15px; font-weight:bold; color:#f59e0b;">Street Football 2D HD · La Gabbia del Molo</h2>
            <span style="font-size:11px; color:#94a3b8;">Tocca/Trascina sul campo per correre · Frecce/WASD · Sponde sui muri e barra Grinta!</span>
          </div>
        </div>
        <button id="streetCloseBtn" style="background:#e63946; color:#fff; border:none; padding:5px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">Chiudi ✕</button>
      </div>

      <div style="flex:1; position:relative; overflow:hidden;">
        <canvas id="streetCanvas" style="width:100%; height:100%; display:block; touch-action:none;"></canvas>

        <!-- On-Screen D-PAD Controls (bottom-left) -->
        <div id="streetDpad" style="position:absolute; bottom:20px; left:20px; width:130px; height:130px; display:grid; grid-template-columns:repeat(3, 1fr); grid-template-rows:repeat(3, 1fr); gap:4px; z-index:20; touch-action:none; user-select:none;">
          <div></div>
          <button id="sBtnUp" style="background:rgba(30,41,59,0.85); color:#fff; border:2px solid #475569; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▲</button>
          <div></div>
          <button id="sBtnLeft" style="background:rgba(30,41,59,0.85); color:#fff; border:2px solid #475569; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">◀</button>
          <div style="background:rgba(15,23,42,0.6); border-radius:6px; display:flex; align-items:center; justify-content:center; color:#64748b; font-size:11px;">LEVA</div>
          <button id="sBtnRight" style="background:rgba(30,41,59,0.85); color:#fff; border:2px solid #475569; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▶</button>
          <div></div>
          <button id="sBtnDown" style="background:rgba(30,41,59,0.85); color:#fff; border:2px solid #475569; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▼</button>
          <div></div>
        </div>

        <!-- On-Screen Action Buttons (bottom-right) -->
        <div style="position:absolute; bottom:24px; right:20px; display:flex; gap:14px; z-index:20; touch-action:none; user-select:none;">
          <button id="sBtnPass" style="width:68px; height:68px; border-radius:50%; background:#0284c7; color:#fff; font-weight:bold; font-size:12px; border:3px solid #38bdf8; box-shadow:0 6px 15px rgba(0,0,0,0.5); cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <span>SPONDA</span>
            <small style="font-size:10px; opacity:0.8;">[Z]</small>
          </button>
          <button id="sBtnShoot" style="width:72px; height:72px; border-radius:50%; background:#ea580c; color:#fff; font-weight:bold; font-size:13px; border:3px solid #fb923c; box-shadow:0 6px 15px rgba(0,0,0,0.5); cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <span>TIRO</span>
            <small style="font-size:10px; opacity:0.8;">[X]</small>
          </button>
        </div>
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

    const bindHoldBtn = (btnId, keyName) => {
      const b = document.getElementById(btnId);
      if (!b) return;
      const start = (e) => { e.preventDefault(); input[keyName] = true; b.style.background = "#ea580c"; };
      const stop = (e) => { e.preventDefault(); input[keyName] = false; b.style.background = "rgba(30,41,59,0.85)"; };
      b.addEventListener("pointerdown", start);
      b.addEventListener("pointerup", stop);
      b.addEventListener("pointerleave", stop);
      b.addEventListener("pointercancel", stop);
    };

    bindHoldBtn("sBtnUp", "up");
    bindHoldBtn("sBtnDown", "down");
    bindHoldBtn("sBtnLeft", "left");
    bindHoldBtn("sBtnRight", "right");

    const sBtnPass = document.getElementById("sBtnPass");
    sBtnPass.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      input.pass = true;
      sBtnPass.style.transform = "scale(0.92)";
      setTimeout(() => { input.pass = false; sBtnPass.style.transform = "none"; }, 200);
    });

    const sBtnShoot = document.getElementById("sBtnShoot");
    sBtnShoot.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      input.shoot = true;
      sBtnShoot.style.transform = "scale(0.92)";
      setTimeout(() => { input.shoot = false; sBtnShoot.style.transform = "none"; }, 200);
    });

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    window.addEventListener("resize", resizeCanvas);

    modal.focus();
    resetStreetMatch();
    resizeCanvas();
    render();
  };
})();
