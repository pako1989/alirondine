// ================= CAPTAIN TSUBASA (NES/SNES TECMO STYLE) MATCH ENGINE =================
// Motore di partita a duelli cinematografici ispirato ai classici Tecmo per Famicom e Super Famicom.
// Visualizza radar tattico dinamico, duelli split-screen e sequenze animate sul campo d'azione (Tiri, Dribbling, Scivolate, Parate).
(function () {
  const K_TSUBASA = "ali-di-rondine.tsubasa-opt";

  function isTsubasaEnabled() {
    try {
      const set = JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni")) || {};
      return !!set.tsubasa;
    } catch {
      return false;
    }
  }

  let isExecutingAnim = false;
  let animReqId = null;

  function getStageAlt() {
    return document.getElementById("stageAlt");
  }

  // Costruisce la schermata duello Tecmo (split-screen con radar tattico e griglia comandi)
  function renderTsubasaTurn(opts) {
    const {
      isAttack,
      carrierName = "Leo Moretti",
      carrierNum = 10,
      oppName = "Toro Galli",
      oppNum = 9,
      zone = 3,
      guts = 80,
      maxGuts = 100,
      score = [0, 0],
      min = 25,
      oppColor = "#ff4d5a",
      usColor = "#ffd23f",
      actions = [],
      onAction = null
    } = opts;

    const alt = getStageAlt();
    if (!alt) return;

    if (animReqId) {
      cancelAnimationFrame(animReqId);
      animReqId = null;
    }

    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.style.overflow = "hidden";
    alt.style.background = "#070c18";

    const gutsPercent = Math.min(100, Math.max(0, (guts / maxGuts) * 100));

    alt.innerHTML = `
      <!-- Tecmo Upper Duel Screen -->
      <div style="height:116px; position:relative; background:linear-gradient(180deg, #091326 0%, #132448 100%); border-bottom:2px solid #ffd23f; display:flex; overflow:hidden;">
        <!-- Background Speedlines -->
        <div style="position:absolute; inset:0; opacity:0.18; background:repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 18px); pointer-events:none;"></div>

        <!-- Left Player: Leo / Us -->
        <div style="flex:1; padding:8px; display:flex; flex-direction:column; justify-content:space-between; position:relative; z-index:2; border-right:1px solid rgba(255,210,63,0.3);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span style="background:${usColor}; color:#0e1424; font-weight:900; font-size:11px; padding:1px 6px; border-radius:3px;">#${carrierNum}</span>
              <span style="color:#fff; font-weight:bold; font-size:13px; margin-left:4px; font-family:var(--display, sans-serif);">${carrierName.toUpperCase()}</span>
            </div>
          </div>
          <!-- Player Stance Sprite / Card -->
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:40px; height:40px; border-radius:6px; background:#182b4d; border:2px solid #ffd23f; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 10px rgba(255,210,63,0.3);">
              ${isAttack ? "⚽" : "🛡️"}
            </div>
            <div style="font-size:11px; color:#ced9eb;">
              <div>Grinta: <b style="color:#ffd23f;">${Math.round(guts)}</b>/${maxGuts}</div>
              <div style="width:65px; height:6px; background:#0a1020; border-radius:3px; overflow:hidden; border:1px solid #3c5480; margin-top:2px;">
                <div style="height:100%; width:${gutsPercent}%; background:linear-gradient(90deg, #ffd23f, #00e5ff);"></div>
              </div>
            </div>
          </div>
          <div style="font-size:10px; color:#8ba0c4; font-style:italic;">
            ${isAttack ? "«Adesso salto il blocco!»" : "«Copri l'interno e aspetta!»"}
          </div>
        </div>

        <!-- Middle Confrontation VS Badge -->
        <div style="width:36px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0b162c; border-left:1px solid rgba(255,255,255,0.15); border-right:1px solid rgba(255,255,255,0.15); z-index:3;">
          <div style="font-size:12px; font-weight:900; color:#ffd23f; font-family:var(--display, sans-serif); text-shadow:0 0 6px #ffd23f;">VS</div>
          <div style="font-size:9px; color:#fff; font-weight:bold; margin-top:2px;">Z${zone}</div>
        </div>

        <!-- Right Opponent Player -->
        <div style="flex:1; padding:8px; display:flex; flex-direction:column; justify-content:space-between; position:relative; z-index:2; text-align:right;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-direction:row-reverse;">
            <div>
              <span style="color:#fff; font-weight:bold; font-size:13px; margin-right:4px; font-family:var(--display, sans-serif);">${oppName.toUpperCase()}</span>
              <span style="background:${oppColor}; color:#fff; font-weight:900; font-size:11px; padding:1px 6px; border-radius:3px;">#${oppNum}</span>
            </div>
          </div>
          <!-- Opponent Stance Card -->
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px;">
            <div style="font-size:11px; color:#ced9eb; text-align:right;">
              <div style="color:#ff8088; font-weight:bold;">${isAttack ? "In Marcatura" : "Incursione"}</div>
              <div style="font-size:10px; color:var(--dim);">Riflessi: Elevati</div>
            </div>
            <div style="width:40px; height:40px; border-radius:6px; background:#2a1218; border:2px solid ${oppColor}; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 10px rgba(255,77,90,0.3);">
              ${isAttack ? "🧤" : "⚡"}
            </div>
          </div>
          <div style="font-size:10px; color:#ff8088; font-style:italic;">
            «Di qui non passa nessuno!»
          </div>
        </div>
      </div>

      <!-- Middle Radar Pitch (Authentic Tecmo Mini-Pitch) -->
      <div style="height:84px; background:#1b5e20; position:relative; border-bottom:2px solid #ffd23f; overflow:hidden;">
        <!-- Pitch Markings -->
        <div style="position:absolute; inset:6px; border:1.5px solid rgba(255,255,255,0.7); pointer-events:none;">
          <div style="position:absolute; top:0; bottom:0; left:50%; width:1.5px; background:rgba(255,255,255,0.7);"></div>
          <div style="position:absolute; top:50%; left:50%; width:30px; height:30px; border:1.5px solid rgba(255,255,255,0.7); border-radius:50%; transform:translate(-50%, -50%);"></div>
          <div style="position:absolute; top:20%; bottom:20%; left:0; width:18px; border:1.5px solid rgba(255,255,255,0.7); border-left:none;"></div>
          <div style="position:absolute; top:20%; bottom:20%; right:0; width:18px; border:1.5px solid rgba(255,255,255,0.7); border-right:none;"></div>
        </div>

        <!-- Zone Highlight (1..5) -->
        <div style="position:absolute; top:6px; bottom:6px; left:${(zone - 1) * 20}%; width:20%; background:rgba(255,210,63,0.25); border:1px dashed #ffd23f; pointer-events:none;"></div>

        <!-- Moving Player Dots (SNES Style) -->
        <!-- Ball Carrier (Flashing) -->
        <div style="position:absolute; top:50%; left:${(zone - 1) * 20 + 10}%; transform:translate(-50%, -50%); z-index:10; animation:pulseCarrier 0.8s infinite alternate;">
          <div style="width:18px; height:18px; background:#ffd23f; color:#0e1424; border:1.5px solid #fff; border-radius:50%; font-size:10px; font-weight:900; display:flex; align-items:center; justify-content:center; box-shadow:0 0 8px #ffd23f;">
            ${carrierNum}
          </div>
        </div>

        <!-- Teammate 1 (Tommy / Wing) -->
        <div style="position:absolute; top:22%; left:${Math.min(90, (zone) * 20 + 8)}%; transform:translate(-50%, -50%);">
          <div style="width:14px; height:14px; background:#3fa7ff; color:#fff; border:1px solid #fff; border-radius:50%; font-size:8px; font-weight:bold; display:flex; align-items:center; justify-content:center;">
            9
          </div>
        </div>

        <!-- Teammate 2 (Gigi / Support) -->
        <div style="position:absolute; top:78%; left:${Math.max(10, (zone - 1) * 20 - 10)}%; transform:translate(-50%, -50%);">
          <div style="width:14px; height:14px; background:#3fa7ff; color:#fff; border:1px solid #fff; border-radius:50%; font-size:8px; font-weight:bold; display:flex; align-items:center; justify-content:center;">
            7
          </div>
        </div>

        <!-- Goalkeeper Nico -->
        <div style="position:absolute; top:50%; left:4%; transform:translate(-50%, -50%);">
          <div style="width:14px; height:14px; background:#4caf50; color:#fff; border:1px solid #fff; border-radius:50%; font-size:8px; font-weight:bold; display:flex; align-items:center; justify-content:center;">
            1
          </div>
        </div>

        <!-- Opponent Defender Dot -->
        <div style="position:absolute; top:50%; left:${Math.min(92, (zone - 1) * 20 + 20)}%; transform:translate(-50%, -50%);">
          <div style="width:16px; height:16px; background:${oppColor}; color:#fff; border:1.5px solid #fff; border-radius:50%; font-size:9px; font-weight:bold; display:flex; align-items:center; justify-content:center; box-shadow:0 0 6px ${oppColor};">
            ${oppNum}
          </div>
        </div>

        <!-- Match Clock & Score Badge in Radar -->
        <div style="position:absolute; top:8px; right:10px; background:rgba(6,11,24,0.85); border:1px solid rgba(255,255,255,0.3); border-radius:4px; padding:2px 6px; font-size:10px; color:#fff; display:flex; gap:6px; z-index:12;">
          <span>⏱️ <b>${min}'</b></span>
          <span style="color:#ffd23f; font-weight:bold;">${score[0]} – ${score[1]}</span>
        </div>
      </div>
    `;

    // Render the Tecmo Action Menu in the #choices container
    renderTecmoCommandWindow(actions, onAction);
  }

  // Costruisce la croce/griglia dei comandi Tecmo Captain Tsubasa
  function renderTecmoCommandWindow(actions, onAction) {
    const choices = document.getElementById("choices");
    if (!choices) return;

    choices.innerHTML = "";
    choices.className = "choices";
    choices.style.display = "grid";
    choices.style.gridTemplateColumns = "repeat(2, 1fr)";
    choices.style.gap = "8px";
    choices.style.padding = "8px 0";

    actions.forEach((act) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn" + (act.cls ? " " + act.cls : "");
      btn.disabled = !!act.disabled;
      btn.style.display = "flex";
      btn.style.flexDirection = "column";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.padding = "10px 6px";
      btn.style.minHeight = "52px";

      btn.innerHTML = `
        <div style="font-weight:900; font-size:13px; font-family:var(--display, sans-serif);">${act.icon ? act.icon + " " : ""}${act.label}</div>
        ${act.sub ? `<small style="font-size:10px; opacity:0.85; margin-top:2px;">${act.sub}</small>` : ""}
      `;

      btn.onclick = () => {
        choices.innerHTML = "";
        if (typeof onAction === "function") {
          onAction(act);
        } else if (typeof act.fn === "function") {
          act.fn();
        }
      };

      choices.appendChild(btn);
    });
  }

  // ================= MOTORE VISIVO ANIMATO AZIONI (60 FPS SU CANVAS RETRÒ 320x200) =================
  // Disegna in tempo reale le azioni come nei giochi Tecmo su NES e Super Famicom
  function playTecmoAnimation(animType, detail, onDone) {
    isExecutingAnim = true;
    const alt = getStageAlt();
    if (!alt) {
      if (onDone) onDone();
      return;
    }

    if (animReqId) {
      cancelAnimationFrame(animReqId);
      animReqId = null;
    }

    const {
      title = "TIRO DELLA RONDINE",
      sub = "Leo Moretti calcia col collo destro!",
      color = "#ffd23f",
      soundWord = "BAAAAAM!"
    } = detail || {};

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.zIndex = "100";
    overlay.style.background = "#050a14";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.overflow = "hidden";

    const cv = document.createElement("canvas");
    cv.width = 320;
    cv.height = 200;
    cv.style.width = "100%";
    cv.style.height = "100%";
    cv.style.imageRendering = "pixelated";
    overlay.appendChild(cv);

    // Title banner on top
    const banner = document.createElement("div");
    banner.style.position = "absolute";
    banner.style.top = "6px";
    banner.style.left = "8px";
    banner.style.right = "8px";
    banner.style.zIndex = "110";
    banner.style.display = "flex";
    banner.style.justifyContent = "space-between";
    banner.style.alignItems = "center";
    banner.style.background = "rgba(6,11,24,0.85)";
    banner.style.border = `1.5px solid ${color}`;
    banner.style.borderRadius = "6px";
    banner.style.padding = "4px 10px";
    banner.innerHTML = `
      <div style="font-weight:900; font-size:12px; color:${color}; font-family:var(--display); text-shadow:0 0 8px ${color};">${title}</div>
      <div style="font-size:10px; color:#fff;">${sub}</div>
    `;
    overlay.appendChild(banner);

    alt.appendChild(overlay);

    const ctx = cv.getContext("2d");
    let frame = 0;
    const maxFrames = animType === "shot" ? 95 : 75;

    // Riproduce audio retro
    if (window.sfx) {
      if (animType === "shot") window.sfx("special");
      else if (animType === "drib" || animType === "tackle") window.sfx("kick");
      else window.sfx("kick");
    }

    function drawPixelMan(cx, cy, bodyCol, skinCol = "#f6d0a8", pose = "run", dir = 1) {
      ctx.save();
      ctx.translate(cx, cy);
      if (dir === -1) ctx.scale(-1, 1);

      // Head
      ctx.fillStyle = skinCol;
      ctx.beginPath();
      ctx.arc(0, -18, 6, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = "#3e2723";
      ctx.fillRect(-6, -24, 12, 5);

      // Body (Jersey)
      ctx.fillStyle = bodyCol;
      ctx.fillRect(-6, -12, 12, 14);

      // Number #10
      ctx.fillStyle = "#fff";
      ctx.fillRect(-2, -9, 4, 6);

      // Legs / Pose
      ctx.fillStyle = "#fff";
      if (pose === "run") {
        const legShift = Math.sin(frame * 0.4) * 6;
        ctx.fillRect(-5, 2, 4, 10 + legShift);
        ctx.fillRect(1, 2, 4, 10 - legShift);
      } else if (pose === "slide") {
        ctx.fillRect(-10, 4, 18, 4);
        ctx.fillRect(2, 6, 8, 4);
      } else if (pose === "jump") {
        ctx.fillRect(-6, 2, 4, 6);
        ctx.fillRect(2, 4, 5, 8);
      } else if (pose === "kick") {
        ctx.fillRect(-5, 2, 4, 11);
        ctx.fillRect(1, 0, 9, 4); // leg kicked out
      }
      ctx.restore();
    }

    function drawBall(bx, by, radius = 6) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(bx, by, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pentagons
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(bx, by, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    function renderLoop() {
      frame++;
      ctx.clearRect(0, 0, 320, 200);

      if (animType === "shot") {
        renderShotScene();
      } else if (animType === "drib") {
        renderDribbleScene();
      } else if (animType === "tackle") {
        renderTackleScene();
      } else {
        renderPassScene();
      }

      if (frame < maxFrames) {
        animReqId = requestAnimationFrame(renderLoop);
      } else {
        overlay.remove();
        isExecutingAnim = false;
        animReqId = null;
        if (onDone) onDone();
      }
    }

    // SCENA 1: TIRO / TIRO DELLA RONDINE
    function renderShotScene() {
      if (frame < 30) {
        // Fase 1: Caricamento del tiro e stacco aereo
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 200);
        skyGrad.addColorStop(0, "#081432");
        skyGrad.addColorStop(1, "#c23a1a");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 320, 200);

        // Speedlines diagonali
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 15; i++) {
          const sx = (i * 25 + frame * 18) % 350 - 30;
          ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx - 80, 200); ctx.stroke();
        }

        // Leo leaps up
        const jumpY = 130 - frame * 1.8;
        drawPixelMan(130, jumpY, "#ffd23f", "#f6d0a8", "kick", 1);
        drawBall(148, jumpY + 2, 7);

        // Impact flash rings
        if (frame > 20) {
          ctx.strokeStyle = "#ffd23f";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(148, jumpY + 2, (frame - 20) * 4, 0, Math.PI * 2);
          ctx.stroke();
        }

      } else if (frame < 60) {
        // Fase 2: Palla in prospettiva supersonica
        ctx.fillStyle = "#050814";
        ctx.fillRect(0, 0, 320, 200);

        // Tunnel cosmico / scia delle ali di rondine
        const progress = (frame - 30) / 30;
        ctx.fillStyle = "rgba(255, 210, 63, 0.25)";
        ctx.beginPath();
        ctx.moveTo(160, 100);
        ctx.lineTo(0, 20);
        ctx.lineTo(0, 180);
        ctx.fill();

        ctx.fillStyle = "rgba(0, 229, 255, 0.25)";
        ctx.beginPath();
        ctx.moveTo(160, 100);
        ctx.lineTo(320, 20);
        ctx.lineTo(320, 180);
        ctx.fill();

        // Big fiery ball zooming in
        const ballSize = 8 + progress * 24;
        const bX = 160 + Math.sin(frame * 0.5) * 8;
        const bY = 100 + Math.cos(frame * 0.5) * 4;

        // Golden fiery aura particles
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = i % 2 === 0 ? "#ffd23f" : "#ff4d5a";
          ctx.beginPath();
          ctx.arc(bX - 25 - i * 8, bY + Math.sin(frame + i) * 6, 6 - i * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        drawBall(bX, bY, ballSize);

      } else {
        // Fase 3: Porta, Tuffo del Portiere e Rete che si gonfia
        ctx.fillStyle = "#1e3a1e";
        ctx.fillRect(0, 120, 320, 80); // erba
        ctx.fillStyle = "#0c152a";
        ctx.fillRect(0, 0, 320, 120); // cielo

        // Goal frame
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.strokeRect(60, 45, 200, 95);

        // Goal net pattern
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1;
        for (let x = 60; x <= 260; x += 12) {
          ctx.beginPath(); ctx.moveTo(x, 45); ctx.lineTo(x, 140); ctx.stroke();
        }

        const netT = (frame - 60) / 35;
        // Goalkeeper dive (from left to right)
        const gkX = 90 + netT * 70;
        const gkY = 105 - Math.sin(netT * Math.PI) * 20;
        drawPixelMan(gkX, gkY, "#2196f3", "#f6d0a8", "slide", 1);

        // Ball blasts into top corner
        const goalBallX = 225;
        const goalBallY = 65;
        drawBall(goalBallX, goalBallY, 9);

        // Screen Shake
        const shake = (Math.random() - 0.5) * 6;
        ctx.save();
        ctx.translate(shake, shake);

        // Net bulge
        ctx.strokeStyle = "#ffd23f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(goalBallX, goalBallY, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Arcade Flash Banner
        ctx.fillStyle = "#ffd23f";
        ctx.font = "900 24px 'Dela Gothic One', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("⚽ GOOOOOOOL!", 160, 35);
        ctx.fillStyle = "#fff";
        ctx.fillText("⚽ GOOOOOOOL!", 158, 33);
        ctx.restore();
      }
    }

    // SCENA 2: DRIBBLING
    function renderDribbleScene() {
      // Scrolling pitch
      ctx.fillStyle = "#2e7d32";
      ctx.fillRect(0, 0, 320, 200);

      // Pitch lines moving left
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      const scrollX = (frame * 12) % 60;
      for (let x = -60; x <= 360; x += 60) {
        ctx.beginPath(); ctx.moveTo(x - scrollX, 0); ctx.lineTo(x - scrollX, 200); ctx.stroke();
      }

      // Attacker sprinting with ball
      const atkX = 110;
      const atkY = 120;
      const isLeaping = frame > 25 && frame < 55;
      const jumpY = isLeaping ? atkY - Math.sin(((frame - 25) / 30) * Math.PI) * 32 : atkY;

      drawPixelMan(atkX, jumpY, "#ffd23f", "#f6d0a8", isLeaping ? "jump" : "run", 1);
      drawBall(atkX + 16, jumpY + 8, 6);

      // Defender sliding in from right
      const defX = 280 - (frame * 3.6);
      if (defX > 60) {
        drawPixelMan(defX, 130, "#ff4d5a", "#f6d0a8", "slide", -1);
        // Dust clouds
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(defX + 12, 134, 6 + Math.sin(frame) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Banner text
      if (frame > 40) {
        ctx.fillStyle = "#00e5ff";
        ctx.font = "900 18px 'Dela Gothic One', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("DRIBBLING SUPERATO!", 160, 45);
        ctx.fillStyle = "#fff";
        ctx.fillText("DRIBBLING SUPERATO!", 158, 43);
      }
    }

    // SCENA 3: TACKLE / SCIVOLATA
    function renderTackleScene() {
      ctx.fillStyle = "#1b5e20";
      ctx.fillRect(0, 0, 320, 200);

      // Running lines
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      for (let y = 30; y < 190; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(320, y); ctx.stroke();
      }

      // Opponent with ball
      drawPixelMan(180, 115, "#ff4d5a", "#f6d0a8", "run", -1);
      drawBall(165, 122, 6);

      // Defender sliding in fast from left
      const defSlideX = 40 + frame * 3.2;
      drawPixelMan(defSlideX, 124, "#ffd23f", "#f6d0a8", "slide", 1);

      // Impact starburst at collision point
      if (frame > 28 && frame < 50) {
        ctx.fillStyle = "#ffd23f";
        ctx.beginPath();
        ctx.arc(165, 122, (frame - 28) * 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(165, 122, (frame - 28) * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      if (frame > 35) {
        ctx.fillStyle = "#ffd23f";
        ctx.font = "900 18px 'Dela Gothic One', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TACKLE DECISIVO!", 160, 45);
      }
    }

    // SCENA 4: PASSAGGIO / UNO-DUE
    function renderPassScene() {
      ctx.fillStyle = "#2e7d32";
      ctx.fillRect(0, 0, 320, 200);

      // Grass stripes
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 === 0 ? "rgba(0,0,0,0.06)" : "transparent";
        ctx.fillRect(0, i * 40, 320, 40);
      }

      // Passer (Leo)
      drawPixelMan(70, 110, "#ffd23f", "#f6d0a8", frame < 20 ? "kick" : "run", 1);

      // Receiver (Tommy)
      drawPixelMan(240, 105, "#ffd23f", "#f6d0a8", "run", 1);

      // Ball flying between players
      const passT = Math.min(1, Math.max(0, (frame - 15) / 35));
      const ballX = 85 + passT * 145;
      const ballY = 112 - Math.sin(passT * Math.PI) * 16;
      drawBall(ballX, ballY, 6);

      if (frame > 35) {
        ctx.fillStyle = "#ffd23f";
        ctx.font = "900 18px 'Dela Gothic One', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PASSAGGIO SUI PIEDI!", 160, 40);
      }
    }

    animReqId = requestAnimationFrame(renderLoop);
  }

  // Esibizione Rapida standalone in stile Captain Tsubasa (per provarla subito!)
  function openTsubasaExhibition(onBack) {
    let tScore = [0, 0];
    let tMin = 0;
    let tZone = 3;
    let tGuts = 100;
    let tCarrier = "Leo Moretti";

    const RIVALS = [
      { name: "Toro Galli", team: "Tori di Torino", color: "#ff4d5a", gk: "Mura d'Acciaio" },
      { name: "Kenji Arata", team: "Aquile di Milano", color: "#00e5ff", gk: "Wagner" },
      { name: "Bruno Sabatini", team: "Corvi del Tigullio", color: "#ba68c8", gk: "Orsini" }
    ];
    let currentRival = RIVALS[0];

    function step() {
      if (tMin >= 90) {
        // Fine partita esibizione
        const alt = getStageAlt();
        if (alt) {
          alt.hidden = true;
          alt.style.display = "none";
          alt.innerHTML = "";
        }
        const textEl = document.getElementById("text");
        if (textEl) {
          textEl.innerHTML = `<span class="who" style="background:#ffd23f; color:#0e1424; font-weight:bold;">Triplice Fischio</span><span class="t"><b>FINALE ESIBIZIONE TECMO</b>: Rondine FC ${tScore[0]} – ${tScore[1]} ${currentRival.team}!</span>`;
        }
        const ch = document.getElementById("choices");
        if (ch) {
          ch.style.display = "flex";
          ch.style.flexDirection = "column";
          ch.innerHTML = `
            <button type="button" class="choice-btn hot" onclick="window.openTsubasaExhibition(${onBack ? 'window.__tsuBack' : ''})">Gioca un'altra esibizione 🔄</button>
            <button type="button" class="choice-btn" onclick="if(window.title) window.title();">Torna al Menu Principale 🏠</button>
          `;
        }
        window.__tsuBack = onBack;
        return;
      }

      tMin += Math.floor(Math.random() * 8) + 6;
      tGuts = Math.min(100, tGuts + 6);

      const isAttack = Math.random() < 0.6 || tZone >= 3;

      const actions = isAttack ? [
        {
          label: "TIRO RONDINE",
          icon: "🔥",
          sub: "Collo destro a giro (-35 Grinta)",
          cls: "hot",
          disabled: tGuts < 35,
          fn: () => {
            tGuts -= 35;
            playTecmoAnimation("shot", {
              title: "TIRO DELLA RONDINE!",
              sub: "Leo Moretti scarica un missile teleguidato!",
              color: "#ffd23f",
              soundWord: "BOOOOOOM!"
            }, () => {
              if (Math.random() < 0.75) {
                tScore[0]++;
                if (window.toast) window.toast("⚽ GOOOL TECMO! RETE GONFIATA!", "goal", "🔥");
              } else {
                if (window.toast) window.toast("PARATA PRODIGIOSA!", "warn", "🧤");
              }
              tZone = 2;
              step();
            });
          }
        },
        {
          label: "DRIBBLING",
          icon: "💨",
          sub: "Finta di corpo su " + currentRival.name + " (-8 Grinta)",
          disabled: tGuts < 8,
          fn: () => {
            tGuts -= 8;
            playTecmoAnimation("drib", {
              title: "DRIBBLING AGILITÀ!",
              sub: "Doppio passo veloce su " + currentRival.name,
              color: "#00e5ff",
              soundWord: "SWOOOOOSH!"
            }, () => {
              tZone = Math.min(5, tZone + 1);
              if (window.toast) window.toast("Dribbling riuscito! Avanzi in zona " + tZone, "info", "💨");
              step();
            });
          }
        },
        {
          label: "PASSA",
          icon: "👟",
          sub: "Assist a Tommy al limite (-5 Grinta)",
          disabled: tGuts < 5,
          fn: () => {
            tGuts -= 5;
            playTecmoAnimation("pass", {
              title: "PASSAGGIO FILTRANTE!",
              sub: "Servizio perfetto sui piedi di Tommy!",
              color: "#ffd23f",
              soundWord: "ZUUUUM!"
            }, () => {
              tZone = Math.min(5, tZone + 1);
              if (window.toast) window.toast("Passaggio filtrante completato!", "info", "👟");
              step();
            });
          }
        },
        {
          label: "UNO-DUE",
          icon: "🔄",
          sub: "Triangolazione di prima (-12 Grinta)",
          disabled: tGuts < 12,
          fn: () => {
            tGuts -= 12;
            playTecmoAnimation("pass", {
              title: "UNO-DUE RAPIDO!",
              sub: "Dai e vai fulmineo tra Leo e Tommy!",
              color: "#00e5ff",
              soundWord: "TAC-TAC!"
            }, () => {
              tZone = Math.min(5, tZone + 2);
              if (window.toast) window.toast("Uno-due fulmineo! Sei davanti alla porta!", "goal", "⚡");
              step();
            });
          }
        }
      ] : [
        {
          label: "SCIVOLATA",
          icon: "🦵",
          sub: "Tackle deciso sul portatore (-10 Grinta)",
          cls: "hot",
          disabled: tGuts < 10,
          fn: () => {
            tGuts -= 10;
            playTecmoAnimation("tackle", {
              title: "TACKLE IN SCIVOLATA!",
              sub: "Intervento pulito sul pallone!",
              color: "#ff4d5a",
              soundWord: "STAAACK!"
            }, () => {
              if (Math.random() < 0.65) {
                tZone = 3;
                if (window.toast) window.toast("Palla recuperata da Leo!", "info", "🛡️");
              } else {
                tScore[1]++;
                if (window.toast) window.toast("Gol subito!", "warn", "⚽");
              }
              step();
            });
          }
        },
        {
          label: "INTERCETTA",
          icon: "✋",
          sub: "Taglia la linea di passaggio (-6 Grinta)",
          disabled: tGuts < 6,
          fn: () => {
            tGuts -= 6;
            playTecmoAnimation("tackle", {
              title: "INTERCETTAZIONE!",
              sub: "Anticipo perfetto sul passaggio!",
              color: "#3fa7ff",
              soundWord: "BLOOOCK!"
            }, () => {
              tZone = 2;
              if (window.toast) window.toast("Passaggio avversario intercettato!", "info", "✋");
              step();
            });
          }
        },
        {
          label: "PRESSING",
          icon: "🛡️",
          sub: "Accompagna verso la linea laterale",
          fn: () => {
            tZone = Math.max(1, tZone - 1);
            step();
          }
        },
        {
          label: "COPRI & RIFIATA",
          icon: "⏳",
          sub: "Recupera +18 Grinta",
          fn: () => {
            tGuts = Math.min(100, tGuts + 18);
            step();
          }
        }
      ];

      renderTsubasaTurn({
        isAttack,
        carrierName: tCarrier,
        carrierNum: 10,
        oppName: currentRival.name,
        oppNum: 9,
        zone: tZone,
        guts: tGuts,
        maxGuts: 100,
        score: tScore,
        min: tMin,
        oppColor: currentRival.color,
        usColor: "#ffd23f",
        actions
      });
    }

    step();
  }

  // Hook globale per integrarsi nel motore di game.js
  window.isTsubasaEnabled = isTsubasaEnabled;
  window.renderTsubasaTurn = renderTsubasaTurn;
  window.playTecmoAnimation = playTecmoAnimation;
  window.openTsubasaExhibition = openTsubasaExhibition;
})();
