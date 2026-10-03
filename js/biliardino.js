// ================= v18 · IL BILIARDINO DEL BAR DEL PORTO =================
// Calcio Balilla Fisico & Tattico:
// Tavolo in legno massello con stecche telescopiche in acciaio e ometti in metallo.
// Fisica della pallina con rimbalzi acustici su sponde e ganci delle stecche!
(function () {
  const K_SAVE = "ali-di-rondine.biliardino";
  let modalEl = null, canvas = null, ctx = null, animFrame = null;
  let isPlaying = false, returnCallback = null;

  function loadRec() {
    try {
      const d = JSON.parse(localStorage.getItem(K_SAVE));
      if (d && typeof d === "object") return d;
    } catch (e) {}
    return { played: 0, wins: 0, cups: 0, defeated: {} };
  }
  function saveRec(r) {
    try { localStorage.setItem(K_SAVE, JSON.stringify(r)); } catch (e) {}
  }

  // Audio sintetico del biliardino (TLAC legno/metallo e pallina nel tubo)
  function playWoodSound(pitch = 1) {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140 * pitch, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, actx.currentTime + 0.08);
      g.gain.setValueAtTime(0.3, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.08);
      osc.connect(g);
      g.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.09);
    } catch (e) {}
  }

  function playMetalClack() {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(540, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, actx.currentTime + 0.05);
      g.gain.setValueAtTime(0.25, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.05);
      osc.connect(g);
      g.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.06);
    } catch (e) {}
  }

  // Dimensioni del campo del biliardino
  const TW = 440, TH = 260;
  const PADDING_X = 24, PADDING_Y = 16;
  const FIELD_W = TW - PADDING_X * 2, FIELD_H = TH - PADDING_Y * 2;
  const GOAL_Y0 = TH / 2 - 32, GOAL_Y1 = TH / 2 + 32;

  // Stecche: posizioni x fisse
  // Giocatore (Rossi - Rondine FC):
  // R1: Portiere (x: 50, 1 ometto)
  // R2: Difesa (x: 104, 2 ometti)
  // R3: Centrocampo (x: 212, 5 ometti)
  // R4: Attacco (x: 320, 3 ometti)
  // Avversario (Blu - Punta Nera):
  // B1: Portiere (x: 390, 1 ometto)
  // B2: Difesa (x: 336, 2 ometti)
  // B3: Centrocampo (x: 228, 5 ometti)
  // B4: Attacco (x: 120, 3 ometti)

  let B_GAME = null;

  const OPPONENTS = [
    { id: "gino", name: "Gino il Mozzo", note: "Principiante: muove le stecche a caso ma con entusiasmo.", speed: 1.2, err: 0.28 },
    { id: "baciccia", name: "Baciccia", note: "Veterano della Riviera: esperto di sponde e rullate veloci!", speed: 1.8, err: 0.16 },
    { id: "ruggeri", name: "Mister Ruggeri", note: "Tattico: copre a centrocampo e aspetta il tuo errore.", speed: 2.3, err: 0.08 },
    { id: "papa", name: "Papà Moretti", note: "Il Campione del Bar dal 1985: tiro al volo all'incrocio!", speed: 2.8, err: 0.03 }
  ];

  function resetBall(servingTeam = 0) {
    const b = B_GAME.ball;
    b.x = TW / 2;
    b.y = TH / 2;
    const ang = (servingTeam === 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.8;
    const sp = 2.4;
    b.vx = Math.cos(ang) * sp;
    b.vy = Math.sin(ang) * sp;
    b.inGoal = false;
  }

  function initMatch(oppIdx = 0) {
    const opp = OPPONENTS[oppIdx] || OPPONENTS[0];
    B_GAME = {
      opp,
      oppIdx,
      score: [0, 0],
      maxGoals: 5,
      rods: {
        // Player rods (offset vertical from center)
        rGk: 0,
        rDef: 0,
        rMid: 0,
        rAtk: 0,
        // Opponent rods
        bGk: 0,
        bDef: 0,
        bMid: 0,
        bAtk: 0,
      },
      kickTimes: {
        rGk: 0, rDef: 0, rMid: 0, rAtk: 0,
        bGk: 0, bDef: 0, bMid: 0, bAtk: 0
      },
      ball: { x: TW / 2, y: TH / 2, vx: 2, vy: 1, r: 6.5, inGoal: false },
      pause: 0,
      winner: null,
      activeRod: "rMid",
      dragY: 0
    };
    resetBall(0);
  }

  function getPlayersOnRod(rodKey, offset) {
    const cy = TH / 2 + offset;
    switch (rodKey) {
      case "rGk": return [{ x: PADDING_X + 22, y: cy }];
      case "rDef": return [{ x: PADDING_X + 76, y: cy - 42 }, { x: PADDING_X + 76, y: cy + 42 }];
      case "rMid": return [
        { x: PADDING_X + 184, y: cy - 72 },
        { x: PADDING_X + 184, y: cy - 36 },
        { x: PADDING_X + 184, y: cy },
        { x: PADDING_X + 184, y: cy + 36 },
        { x: PADDING_X + 184, y: cy + 72 }
      ];
      case "rAtk": return [
        { x: PADDING_X + 292, y: cy - 50 },
        { x: PADDING_X + 292, y: cy },
        { x: PADDING_X + 292, y: cy + 50 }
      ];
      case "bGk": return [{ x: TW - PADDING_X - 22, y: cy }];
      case "bDef": return [{ x: TW - PADDING_X - 76, y: cy - 42 }, { x: TW - PADDING_X - 76, y: cy + 42 }];
      case "bMid": return [
        { x: TW - PADDING_X - 184, y: cy - 72 },
        { x: TW - PADDING_X - 184, y: cy - 36 },
        { x: TW - PADDING_X - 184, y: cy },
        { x: TW - PADDING_X - 184, y: cy + 36 },
        { x: TW - PADDING_X - 184, y: cy + 72 }
      ];
      case "bAtk": return [
        { x: TW - PADDING_X - 292, y: cy - 50 },
        { x: TW - PADDING_X - 292, y: cy },
        { x: TW - PADDING_X - 292, y: cy + 50 }
      ];
    }
    return [];
  }

  function tickAI() {
    const opp = B_GAME.opp;
    const b = B_GAME.ball;
    const spd = opp.speed;

    // AI tracks ball y with small error
    const track = (key, mult = 1) => {
      const target = (b.y - TH / 2) + (Math.random() - 0.5) * 35 * opp.err;
      const cur = B_GAME.rods[key];
      const diff = target - cur;
      B_GAME.rods[key] += Math.sign(diff) * Math.min(Math.abs(diff), spd * mult);
      B_GAME.rods[key] = Math.max(-55, Math.min(55, B_GAME.rods[key]));
    };

    track("bGk", 1.2);
    track("bDef", 1.0);
    track("bMid", 1.1);
    track("bAtk", 1.3);

    // AI shoots when ball is close to a player
    ["bGk", "bDef", "bMid", "bAtk"].forEach((rk) => {
      const players = getPlayersOnRod(rk, B_GAME.rods[rk]);
      players.forEach((p) => {
        if (Math.hypot(b.x - p.x, b.y - p.y) < 18 && b.vx > 0) {
          B_GAME.kickTimes[rk] = 12;
          b.vx = -(4.5 + Math.random() * 2);
          b.vy = (Math.random() - 0.5) * 3;
          playMetalClack();
        }
      });
    });
  }

  function tickPhysics() {
    if (!B_GAME || B_GAME.pause > 0) {
      if (B_GAME && B_GAME.pause > 0) B_GAME.pause--;
      return;
    }

    const b = B_GAME.ball;
    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.993; // friction
    b.vy *= 0.993;

    // Minimum rolling speed so it doesn't stop completely
    const curSp = Math.hypot(b.vx, b.vy);
    if (curSp < 1.2 && curSp > 0.05) {
      b.vx *= 1.02;
      b.vy *= 1.02;
    }

    // Top and bottom cushions
    if (b.y < PADDING_Y + b.r) {
      b.y = PADDING_Y + b.r;
      b.vy = Math.abs(b.vy) * 0.92;
      playWoodSound(1.2);
    }
    if (b.y > TH - PADDING_Y - b.r) {
      b.y = TH - PADDING_Y - b.r;
      b.vy = -Math.abs(b.vy) * 0.92;
      playWoodSound(1.2);
    }

    // Left and Right goal detection
    const isGoalY = b.y >= GOAL_Y0 && b.y <= GOAL_Y1;
    if (b.x < PADDING_X + b.r) {
      if (isGoalY) {
        // GOAL FOR BLUE!
        B_GAME.score[1]++;
        playMetalClack();
        if (window.sfx) window.sfx("crowd");
        B_GAME.pause = 50;
        if (B_GAME.score[1] >= B_GAME.maxGoals) {
          B_GAME.winner = 1;
        } else {
          resetBall(0);
        }
        return;
      } else {
        b.x = PADDING_X + b.r;
        b.vx = Math.abs(b.vx) * 0.9;
        playWoodSound(0.9);
      }
    }

    if (b.x > TW - PADDING_X - b.r) {
      if (isGoalY) {
        // GOAL FOR RED (YOU)!
        B_GAME.score[0]++;
        playMetalClack();
        if (window.sfx) window.sfx("goal");
        B_GAME.pause = 50;
        if (B_GAME.score[0] >= B_GAME.maxGoals) {
          B_GAME.winner = 0;
          const rec = loadRec();
          rec.played++;
          rec.wins++;
          rec.defeated[B_GAME.opp.id] = true;
          if (Object.keys(rec.defeated).length >= 4) rec.cups++;
          saveRec(rec);
          if (window.addCoins) window.addCoins(10);
        } else {
          resetBall(1);
        }
        return;
      } else {
        b.x = TW - PADDING_X - b.r;
        b.vx = -Math.abs(b.vx) * 0.9;
        playWoodSound(0.9);
      }
    }

    // Player collisions
    const checkColl = (rk, team) => {
      const players = getPlayersOnRod(rk, B_GAME.rods[rk]);
      const kicking = (B_GAME.kickTimes[rk] || 0) > 0;
      players.forEach((p) => {
        const dx = b.x - p.x;
        const dy = b.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < b.r + 7) {
          // Bounce off player
          const ang = Math.atan2(dy, dx);
          const kickBoost = kicking ? 3.5 : 1.2;
          b.vx = Math.cos(ang) * (Math.abs(b.vx) + 2) * kickBoost;
          b.vy = Math.sin(ang) * (Math.abs(b.vy) + 1.2);
          b.x = p.x + Math.cos(ang) * (b.r + 7.5);
          b.y = p.y + Math.sin(ang) * (b.r + 7.5);
          playWoodSound(1.4);
          if (window.haptic) window.haptic(20);
        }
      });
    };

    ["rGk", "rDef", "rMid", "rAtk"].forEach((k) => checkColl(k, 0));
    ["bGk", "bDef", "bMid", "bAtk"].forEach((k) => checkColl(k, 1));

    // Decay kick timers
    Object.keys(B_GAME.kickTimes).forEach((k) => {
      if (B_GAME.kickTimes[k] > 0) B_GAME.kickTimes[k]--;
    });
  }

  function drawTable() {
    if (!ctx) return;
    const g = ctx;

    // Mobile in legno massello del biliardino
    g.fillStyle = "#5c2a12";
    g.fillRect(0, 0, TW, TH);

    // Bordo interno dorato
    g.strokeStyle = "#9c602a";
    g.lineWidth = 4;
    g.strokeRect(PADDING_X - 4, PADDING_Y - 4, FIELD_W + 8, FIELD_H + 8);

    // Campo in vetro satinato verde
    g.fillStyle = "#1e7238";
    g.fillRect(PADDING_X, PADDING_Y, FIELD_W, FIELD_H);

    // Linee bianche del campo
    g.strokeStyle = "rgba(255,255,255,0.6)";
    g.lineWidth = 1.5;
    g.strokeRect(PADDING_X, PADDING_Y, FIELD_W, FIELD_H);

    // Centrocampo e cerchio
    g.beginPath();
    g.moveTo(TW / 2, PADDING_Y);
    g.lineTo(TW / 2, TH - PADDING_Y);
    g.stroke();

    g.beginPath();
    g.arc(TW / 2, TH / 2, 34, 0, Math.PI * 2);
    g.stroke();

    // Aree di rigore
    g.strokeRect(PADDING_X, TH / 2 - 45, 42, 90);
    g.strokeRect(TW - PADDING_X - 42, TH / 2 - 45, 42, 90);

    // Bocche della porta
    g.fillStyle = "#0c1a12";
    g.fillRect(PADDING_X - 10, GOAL_Y0, 10, GOAL_Y1 - GOAL_Y0);
    g.fillRect(TW - PADDING_X, GOAL_Y0, 10, GOAL_Y1 - GOAL_Y0);

    // Stecche metalliche cromate (aste orizzontali)
    const drawRod = (x, rk, team) => {
      g.strokeStyle = "#d6dbe0";
      g.lineWidth = 3.5;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, TH);
      g.stroke();

      // Ometti sulla stecca
      const players = getPlayersOnRod(rk, B_GAME.rods[rk]);
      const kicking = (B_GAME.kickTimes[rk] || 0) > 0;
      players.forEach((p) => {
        // Ombra dell'ometto
        g.fillStyle = "rgba(0,0,0,0.3)";
        g.beginPath();
        g.ellipse(p.x + 2, p.y + 4, 5, 8, 0, 0, Math.PI * 2);
        g.fill();

        // Corpo ometto
        g.fillStyle = team === 0 ? (kicking ? "#ff3344" : "#b3202c") : (kicking ? "#3388ff" : "#1d3fa3");
        g.fillRect(p.x - 3.5, p.y - 6, 7, 12);

        // Testa ometto
        g.fillStyle = "#f2c9a0";
        g.beginPath();
        g.arc(p.x, p.y - 7, 3.5, 0, Math.PI * 2);
        g.fill();

        // Piedino sagomato
        g.fillStyle = "#ffffff";
        g.fillRect(p.x - 3, p.y + 5, 6, 3);
      });
    };

    // Draw all 8 rods
    drawRod(PADDING_X + 22, "rGk", 0);
    drawRod(PADDING_X + 76, "rDef", 0);
    drawRod(TW - PADDING_X - 292, "bAtk", 1);
    drawRod(PADDING_X + 184, "rMid", 0);
    drawRod(TW - PADDING_X - 184, "bMid", 1);
    drawRod(PADDING_X + 292, "rAtk", 0);
    drawRod(TW - PADDING_X - 76, "bDef", 1);
    drawRod(TW - PADDING_X - 22, "bGk", 1);

    // Pallina in sughero bianco con venature
    const b = B_GAME.ball;
    // Ombra pallina
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.beginPath();
    g.ellipse(b.x + 2, b.y + 2, b.r, b.r * 0.7, 0, 0, Math.PI * 2);
    g.fill();

    // Pallina
    g.fillStyle = "#fdf9ee";
    g.beginPath();
    g.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#c8be9c";
    g.lineWidth = 1;
    g.stroke();

    // Segnapunti / Pallottoliere in legno
    g.fillStyle = "rgba(0,0,0,0.7)";
    g.fillRect(TW / 2 - 60, 4, 120, 18);
    g.fillStyle = "#ffd23f";
    g.font = "bold 12px sans-serif";
    g.textAlign = "center";
    g.fillText(`RONDINE ${B_GAME.score[0]} – ${B_GAME.score[1]} ${B_GAME.opp.name.toUpperCase()}`, TW / 2, 17);

    // Overlay fine partita o gol
    if (B_GAME.winner !== null) {
      g.fillStyle = "rgba(10,18,36,0.85)";
      g.fillRect(0, 0, TW, TH);
      g.fillStyle = B_GAME.winner === 0 ? "#ffd23f" : "#ff4d5a";
      g.font = "bold 20px sans-serif";
      g.fillText(B_GAME.winner === 0 ? "HAI VINTO LA PARTITA! 🏆" : "HA VINTO IL BAR SPORT!", TW / 2, TH / 2 - 12);
      g.fillStyle = "#ffffff";
      g.font = "12px sans-serif";
      g.fillText(B_GAME.winner === 0 ? "+10 Monete del Borgo aggiunte!" : "Baciccia ti allunga una gassosa: «Rigioca, ragazzo».", TW / 2, TH / 2 + 16);
    }
  }

  function loop() {
    if (!isPlaying) return;
    tickAI();
    tickPhysics();
    drawTable();
    animFrame = requestAnimationFrame(loop);
  }

  function createModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.id = "biliardinoModal";
    modalEl.style.cssText = `
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(8, 14, 26, 0.94); backdrop-filter: blur(8px);
      display: none; flex-direction: column; align-items: center; justify-content: center;
      padding: 12px; user-select: none; -webkit-user-select: none;
    `;

    modalEl.innerHTML = `
      <div style="width: 100%; max-width: 480px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="color:var(--gold, #ffd23f); font-family:var(--display, sans-serif); font-size:15px; font-weight:bold;">
          ⚽ IL BILIARDINO DEL BAR DEL PORTO
        </span>
        <button type="button" id="bilCloseBtn" style="background:#b3202c; color:#fff; border:1px solid #ff4d5a; border-radius:6px; padding:4px 10px; font-weight:bold; cursor:pointer; font-size:12px;">✕ Esci</button>
      </div>

      <div style="width:100%; max-width:480px; text-align:center; color:#a2b7d4; font-size:11px; margin-bottom:6px;" id="bilOppDesc">
        Trascina verticalmente per muovere le stecche · Tocca "Tiro" o la barra per il colpo di polso!
      </div>

      <div style="position:relative; border-radius:10px; overflow:hidden; box-shadow:0 12px 30px rgba(0,0,0,0.8); border:3px solid #8a4820; width:100%; max-width:440px; aspect-ratio:440/260;">
        <canvas id="bilCanvas" width="440" height="260" style="width:100%; height:100%; display:block; touch-action:none;"></canvas>
      </div>

      <!-- Barra dei comandi touch -->
      <div style="width:100%; max-width:440px; display:flex; gap:8px; margin-top:8px;">
        <button type="button" id="bilWristKick" style="flex:2; background:linear-gradient(135deg, #b3202c, #ff4d5a); color:#fff; border:2px solid #ffd23f; border-radius:8px; padding:10px; font-weight:bold; font-size:15px; cursor:pointer;">
          ⚡ COLPO DI POLSO / TIRO
        </button>
        <button type="button" id="bilChangeOpp" style="flex:1; background:#1b365d; color:#ffd23f; border:1px solid #4a7ab5; border-radius:8px; padding:10px; font-weight:bold; font-size:12px; cursor:pointer;">
          👥 Avversario
        </button>
      </div>
    `;

    document.body.appendChild(modalEl);

    canvas = modalEl.querySelector("#bilCanvas");
    ctx = canvas.getContext("2d");

    // Touch & pointer handlers for sliding rods
    let lastPointerY = null;
    canvas.addEventListener("pointerdown", (e) => {
      lastPointerY = e.clientY;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });

    canvas.addEventListener("pointermove", (e) => {
      if (lastPointerY === null || !B_GAME) return;
      const dy = (e.clientY - lastPointerY) * 1.2;
      lastPointerY = e.clientY;

      // Move player rods simultaneously
      ["rGk", "rDef", "rMid", "rAtk"].forEach((k) => {
        B_GAME.rods[k] = Math.max(-55, Math.min(55, B_GAME.rods[k] + dy));
      });
    });

    const stopDrag = () => { lastPointerY = null; };
    canvas.addEventListener("pointerup", stopDrag);
    canvas.addEventListener("pointercancel", stopDrag);

    // Wrist kick button
    const kickBtn = modalEl.querySelector("#bilWristKick");
    const doKick = () => {
      if (!B_GAME) return;
      ["rGk", "rDef", "rMid", "rAtk"].forEach((k) => {
        B_GAME.kickTimes[k] = 10;
      });
      playMetalClack();
      if (window.haptic) window.haptic(35);
    };
    kickBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      doKick();
    });

    // Close button
    modalEl.querySelector("#bilCloseBtn").onclick = window.closeBiliardino;

    // Change opponent button
    modalEl.querySelector("#bilChangeOpp").onclick = () => {
      if (!B_GAME) return;
      const nextIdx = (B_GAME.oppIdx + 1) % OPPONENTS.length;
      initMatch(nextIdx);
      updateDesc();
    };

    return modalEl;
  }

  function updateDesc() {
    const d = document.getElementById("bilOppDesc");
    if (d && B_GAME) {
      d.innerHTML = `Avversario: <b>${B_GAME.opp.name}</b> · <em>${B_GAME.opp.note}</em>`;
    }
  }

  window.openBiliardino = function (oppIdx = 0, onDone = null) {
    returnCallback = onDone;
    createModal();
    initMatch(oppIdx);
    updateDesc();
    modalEl.style.display = "flex";
    isPlaying = true;
    if (animFrame) cancelAnimationFrame(animFrame);
    loop();
    if (window.toast) window.toast("Benvenuto al Biliardino del Bar del Porto!", "info", "⚽");
  };

  window.closeBiliardino = function () {
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
