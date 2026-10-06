// ================= CAPTAIN TSUBASA (NES/SNES TECMO STYLE) MATCH ENGINE =================
// Disegna sul canvas principale di gioco (320x200 a 60 FPS) la schermata duello Tecmo,
// il radar tattico a pallini numerati e le sequenze animate d'azione (Tiro, Dribbling, Tackle, Passaggio).
// Include Log di Debug Visivo in tempo reale sopra il canvas (Azione, Palla, Giocatore, Grinta, Tempo).
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

  // Stato animazione d'azione attiva sul canvas
  let activeAction = null;
  let actionFrame = 0;
  let actionDoneCb = null;

  // Stato esibizione standalone
  window.tsubasaExhibState = null;

  // Avvia una sequenza animata sul canvas principale
  function startTsubasaAction(type, detail, onDone) {
    activeAction = {
      type: type || "shot",
      title: (detail && detail.title) || "AZIONE SUL CAMPO",
      sub: (detail && detail.sub) || "",
      color: (detail && detail.color) || "#ffd23f",
      soundWord: (detail && detail.soundWord) || "BOOOOM!",
      maxFrames: type === "shot" ? 85 : 65
    };
    actionFrame = 0;
    actionDoneCb = onDone;

    if (window.sfx) {
      if (type === "shot") window.sfx("special");
      else window.sfx("kick");
    }

    // Aggiorna subito il box testo con la notifica dell'azione in corso
    const textEl = document.getElementById("text");
    if (textEl && detail) {
      textEl.innerHTML = `<span class="who" style="background:${activeAction.color}; color:#0e1424; font-weight:bold;">⚡ ${activeAction.type.toUpperCase()}</span><span class="t"><b>${esc(activeAction.title)}</b>: ${esc(activeAction.sub || "Azione sul campo in corso...")}</span>`;
    }
  }

  function esc(s) {
    return String(s || "").replace(/[&<>]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));
  }

  // ================= LOG DI DEBUG VISIVO (SOLO CON ?debug=1) =================
  // Mostra lo stato del motore solo se debug attivo nell URL
  function drawDebugStatusBar(ctx, m, act, f) {
    if (!/[?&]debug/.test(location.search)) return; // Rispetta Clean UI nelle partite normali
    ctx.save();
    const isAtk = m ? m.poss === "us" : true;
    const carrier = (m && (m.carrier || "Leo Moretti")) || "Leo Moretti";
    const curOpp = (m && m.cur && m.cur.name) || (m && m.opp && m.opp.name) || "Toro Galli";
    const z = (m && m.zone) || 3;
    const guts = m && m.guts != null ? Math.round(m.guts) : 75;
    const score = (m && m.score) || [0, 0];
    const min = m && m.min != null ? m.min : 15;

    // Fascia nera retro semi-trasparente
    ctx.fillStyle = "rgba(4, 9, 22, 0.95)";
    ctx.fillRect(0, 0, 320, 16);
    ctx.strokeStyle = act ? "#00e5ff" : "#ffd23f";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 320, 16);

    // Indicatore LED di elaborazione eventi (verde = idle / ciano = azione attiva)
    const blink = Math.sin(Date.now() * 0.015) > 0;
    ctx.fillStyle = act ? (blink ? "#00e5ff" : "#0284c7") : (blink ? "#22c55e" : "#15803d");
    ctx.beginPath();
    ctx.arc(8, 8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Testo di stato compatto e leggibile
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 6.5px monospace";
    ctx.textAlign = "left";

    const actTxt = act ? `[AZIONE: ${act.title.slice(0, 12)} F:${f}/${act.maxFrames}]` : `[IDLE: ATTESA SCELTA]`;
    const ballTxt = `PALLA: ${isAtk ? "RONDINE" : "RIVALI"} (Z${z})`;
    const playerTxt = isAtk ? `PORT: ${carrier.slice(0, 11)}` : `MARC: ${curOpp.slice(0, 11)}`;
    const statsTxt = `⏱ ${min}' | ⚽ ${score[0]}-${score[1]} | G:${guts}`;

    ctx.fillText(`${actTxt} | ${ballTxt} | ${playerTxt} | ${statsTxt}`, 16, 11);
    ctx.restore();
  }

  // Disegna l'omino pixel art in varie pose
  function drawPixelPlayer(ctx, cx, cy, bodyCol, skinCol = "#f6d0a8", pose = "run", dir = 1, frame = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    if (dir === -1) ctx.scale(-1, 1);

    // Testa
    ctx.fillStyle = skinCol;
    ctx.beginPath();
    ctx.arc(0, -18, 6, 0, Math.PI * 2);
    ctx.fill();

    // Capelli
    ctx.fillStyle = "#2c1810";
    ctx.fillRect(-6, -24, 12, 5);

    // Maglia
    ctx.fillStyle = bodyCol;
    ctx.fillRect(-6, -12, 12, 14);

    // Numero
    ctx.fillStyle = "#fff";
    ctx.fillRect(-2, -9, 4, 6);

    // Gambe / Posa
    ctx.fillStyle = "#fff";
    if (pose === "run") {
      const legShift = Math.sin(frame * 0.4) * 5;
      ctx.fillRect(-5, 2, 4, 10 + legShift);
      ctx.fillRect(1, 2, 4, 10 - legShift);
    } else if (pose === "slide") {
      ctx.fillRect(-12, 4, 18, 4);
      ctx.fillRect(0, 6, 8, 4);
    } else if (pose === "jump") {
      ctx.fillRect(-6, 2, 4, 6);
      ctx.fillRect(2, 4, 5, 8);
    } else if (pose === "kick") {
      ctx.fillRect(-5, 2, 4, 11);
      ctx.fillRect(1, 0, 9, 4);
    }
    ctx.restore();
  }

  // Disegna il pallone rotante con pentagoni
  function drawRetroBall(ctx, bx, by, radius = 6, rot = 0) {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(bx, by, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#111111";
    ctx.beginPath();
    ctx.arc(bx, by, radius * 0.38, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + rot;
      ctx.beginPath();
      ctx.arc(bx + Math.cos(a) * radius * 0.65, by + Math.sin(a) * radius * 0.65, radius * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ================= DISEGNA IL MATCH TSUBASA SU #cv =================
  // Chiamato ogni frame dal ciclo render() in game.js
  function drawTsubasaMatch(ctx, matchObj) {
    const W = 320;
    const H = 200;

    const m = matchObj || window.tsubasaExhibState || {};

    // Se c'è un'azione in corso, disegna la sequenza animata 60 FPS
    if (activeAction) {
      actionFrame++;
      drawActionScene(ctx, activeAction, actionFrame);

      // Disegna sempre la barra di debug visivo richiesta in alto
      drawDebugStatusBar(ctx, m, activeAction, actionFrame);

      if (actionFrame >= activeAction.maxFrames) {
        const cb = actionDoneCb;
        activeAction = null;
        actionDoneCb = null;
        if (typeof cb === "function") cb();
      }
      return;
    }

    // Altrimenti disegna la schermata Tecmo Duello + Radar Tattico
    const isAtk = m.poss === "us";
    const zone = m.zone || 3;
    const score = m.score || [0, 0];
    const min = m.min != null ? m.min : 20;
    const guts = m.guts != null ? m.guts : 60;
    const maxGuts = (window.S && window.S.st && window.S.st.grinta) || 100;
    const oppTeam = (m.team && window.TEAMS && window.TEAMS[m.team]) || (m.opp ? m.opp : { name: "Rivali", color: "#ff4d5a", vs: "Tori di Torino" });
    const oppColor = oppTeam.color || "#ff4d5a";
    const curOpp = (m.cur && m.cur.name) || (m.opp && m.opp.name) || oppTeam.vs || "Toro Galli";
    const carrierName = m.carrier || (typeof window.heroName === "function" ? window.heroName() : "Leo Moretti");

    // Sfondo generale
    ctx.fillStyle = "#070c18";
    ctx.fillRect(0, 0, W, H);

    // ================= 1. PARTE SUPERIORE: SPLIT-SCREEN DUELLO (16..106 px) =================
    // Lato Sinistro (Leo / Rondine)
    const grdL = ctx.createLinearGradient(0, 16, 160, 106);
    grdL.addColorStop(0, "#0b1730");
    grdL.addColorStop(1, "#182c55");
    ctx.fillStyle = grdL;
    ctx.fillRect(0, 16, 160, 90);

    // Lato Destro (Rivali)
    const grdR = ctx.createLinearGradient(160, 16, 320, 106);
    grdR.addColorStop(0, "#241016");
    grdR.addColorStop(1, "#3d141e");
    ctx.fillStyle = grdR;
    ctx.fillRect(160, 16, 160, 90);

    // Speedlines di sfondo
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 16; i++) {
      const x = (i * 24 + Date.now() * 0.05) % 360 - 20;
      ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x - 30, 106); ctx.stroke();
    }

    // Linea divisoria oro inclinata
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(164, 16);
    ctx.lineTo(156, 106);
    ctx.stroke();

    // Giocatore Sinistro (Leo)
    ctx.fillStyle = "#ffd23f";
    ctx.fillRect(10, 20, 22, 12);
    ctx.fillStyle = "#0e1424";
    ctx.font = "bold 8px sans-serif";
    ctx.fillText("#10", 14, 29);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px 'Dela Gothic One', Impact, sans-serif";
    ctx.fillText(carrierName.toUpperCase().slice(0, 14), 36, 30);

    drawPixelPlayer(ctx, 35, 76, "#ffd23f", "#f6d0a8", isAtk ? "run" : "jump", 1, Date.now() * 0.01);

    // Barra Grinta
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(60, 52, 75, 9);
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 52, 75, 9);

    const gutsW = Math.max(0, Math.min(73, (guts / maxGuts) * 73));
    ctx.fillStyle = "#ffd23f";
    ctx.fillRect(61, 53, gutsW, 7);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 7.5px sans-serif";
    ctx.fillText(`GRINTA ${Math.round(guts)}/${maxGuts}`, 64, 73);

    ctx.fillStyle = "#8ba0c4";
    ctx.font = "italic 7.5px sans-serif";
    ctx.fillText(isAtk ? "«Vedo lo spazio!»" : "«Copri la linea!»", 64, 86);

    // Giocatore Destro (Avversario)
    ctx.fillStyle = oppColor;
    ctx.fillRect(288, 20, 22, 12);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px sans-serif";
    ctx.fillText("#9", 294, 29);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px 'Dela Gothic One', Impact, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(curOpp.toUpperCase().slice(0, 14), 284, 30);

    drawPixelPlayer(ctx, 285, 76, oppColor, "#f6d0a8", isAtk ? "slide" : "run", -1, Date.now() * 0.01);

    ctx.fillStyle = "#ff8088";
    ctx.font = "bold 7.5px sans-serif";
    ctx.fillText(isAtk ? "MARCATURA STRETTA" : "AFFONDO IN AREA", 255, 60);
    ctx.fillStyle = "#e0a0a8";
    ctx.font = "italic 7.5px sans-serif";
    ctx.fillText("«Non mi superi!»", 255, 75);
    ctx.textAlign = "left";

    // Badge VS Arcade al centro
    ctx.fillStyle = "#0a1324";
    ctx.beginPath();
    ctx.arc(160, 60, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#ffd23f";
    ctx.font = "bold 9px 'Dela Gothic One', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VS", 160, 58);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 6.5px sans-serif";
    ctx.fillText(`Z${zone}`, 160, 68);
    ctx.textAlign = "left";

    // Separatore orizzontale radar
    ctx.fillStyle = "#ffd23f";
    ctx.fillRect(0, 106, W, 2);

    // ================= 2. PARTE INFERIORE: RADAR PITCH TATTICO (108..200 px) =================
    ctx.fillStyle = "#1b5e20";
    ctx.fillRect(0, 108, W, 92);

    // Erba a fasce alternate
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 108 + i * 15, W, 15);
      }
    }

    // Linee campo regolamentari
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 114, 300, 78);

    // Linea di metà campo
    ctx.beginPath();
    ctx.moveTo(160, 114);
    ctx.lineTo(160, 192);
    ctx.stroke();

    // Cerchio di centrocampo
    ctx.beginPath();
    ctx.arc(160, 153, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Aree di rigore
    ctx.strokeRect(10, 131, 26, 44);
    ctx.strokeRect(284, 131, 26, 44);

    // Evidenziazione Zona attiva (1..5)
    const zLeft = 10 + (zone - 1) * 60;
    ctx.fillStyle = "rgba(255, 210, 63, 0.22)";
    ctx.fillRect(zLeft, 114, 60, 78);
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 1;
    ctx.strokeRect(zLeft, 114, 60, 78);

    // Pallini Giocatori Tsubasa SNES sul Radar
    // 1. Portatore di Palla (Leo #10) che pulsa
    const ballCarrierX = zLeft + 30;
    const ballCarrierY = 153 + Math.sin(Date.now() * 0.005) * 3;
    const pulse = Math.sin(Date.now() * 0.008) * 2;

    ctx.fillStyle = "rgba(255, 210, 63, 0.4)";
    ctx.beginPath();
    ctx.arc(ballCarrierX, ballCarrierY, 10 + pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffd23f";
    ctx.beginPath();
    ctx.arc(ballCarrierX, ballCarrierY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0e1424";
    ctx.font = "bold 7px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("10", ballCarrierX, ballCarrierY + 2.5);

    // 2. Compagni di squadra
    // Nico (#1 in porta)
    drawRadarDot(ctx, 18, 153, "#4caf50", "1");
    // Tommy (#9 sulla fascia)
    drawRadarDot(ctx, Math.min(290, zLeft + 55), 126, "#3fa7ff", "9");
    // Gigi (#7 a supporto)
    drawRadarDot(ctx, Math.max(30, zLeft - 25), 178, "#3fa7ff", "7");

    // 3. Difensori avversari
    drawRadarDot(ctx, Math.min(295, zLeft + 42), 153, oppColor, "4");
    drawRadarDot(ctx, 298, 153, "#ff9800", "1"); // Portiere rivale

    // 4. Timer e Punteggio sul radar in alto a destra
    ctx.fillStyle = "rgba(6, 12, 24, 0.85)";
    ctx.fillRect(195, 117, 110, 16);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.strokeRect(195, 117, 110, 16);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`⏱ ${min}'  ⚽ ${score[0]} – ${score[1]}`, 250, 128);
    ctx.textAlign = "left";

    // Disegna la barra di debug sempre in cima al canvas
    drawDebugStatusBar(ctx, m, null, 0);
  }

  function drawRadarDot(ctx, x, y, col, label) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 6px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 2);
    ctx.textAlign = "left";
  }

  // ================= SCENE ANIMATE AZIONI A 60 FPS =================
  function drawActionScene(ctx, act, f) {
    const W = 320;
    const H = 200;

    if (act.type === "shot") {
      // SEQUENZA TIRO
      if (f < 26) {
        // Fase 1: Salto e stacco aereo
        const skyGrd = ctx.createLinearGradient(0, 16, 0, H);
        skyGrd.addColorStop(0, "#081534");
        skyGrd.addColorStop(1, "#d84315");
        ctx.fillStyle = skyGrd;
        ctx.fillRect(0, 16, W, H - 16);

        // Speedlines
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const sx = (i * 30 + f * 16) % 360 - 20;
          ctx.beginPath(); ctx.moveTo(sx, 16); ctx.lineTo(sx - 70, H); ctx.stroke();
        }

        const jumpY = 135 - f * 2.2;
        drawPixelPlayer(ctx, 130, jumpY, "#ffd23f", "#f6d0a8", "kick", 1, f);
        drawRetroBall(ctx, 148, jumpY + 2, 7, f * 0.3);

        if (f > 16) {
          ctx.strokeStyle = "#ffd23f";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(148, jumpY + 2, (f - 16) * 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (f < 54) {
        // Fase 2: Palla in prospettiva supersonica
        ctx.fillStyle = "#050914";
        ctx.fillRect(0, 16, W, H - 16);

        const prog = (f - 26) / 28;
        // Aura ad ali di rondine
        ctx.fillStyle = "rgba(255, 210, 63, 0.25)";
        ctx.beginPath();
        ctx.moveTo(160, 105);
        ctx.lineTo(0, 35);
        ctx.lineTo(0, 175);
        ctx.fill();

        ctx.fillStyle = "rgba(0, 229, 255, 0.25)";
        ctx.beginPath();
        ctx.moveTo(160, 105);
        ctx.lineTo(320, 35);
        ctx.lineTo(320, 175);
        ctx.fill();

        // Pallone che ingrandisce a cannone
        const bRadius = 8 + prog * 28;
        const bx = 160 + Math.sin(f * 0.6) * 6;
        const by = 105 + Math.cos(f * 0.6) * 4;

        // Fiamme indietro
        for (let i = 0; i < 7; i++) {
          ctx.fillStyle = i % 2 === 0 ? "#ffd23f" : "#ff4d5a";
          ctx.beginPath();
          ctx.arc(bx - 30 - i * 10, by + Math.sin(f + i) * 8, 8 - i * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }

        drawRetroBall(ctx, bx, by, bRadius, f * 0.4);
      } else {
        // Fase 3: Rete, Tuffo e Gol!
        ctx.fillStyle = "#1e3a1e";
        ctx.fillRect(0, 120, W, 80);
        ctx.fillStyle = "#0c152a";
        ctx.fillRect(0, 16, W, 104);

        // Porta
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.strokeRect(60, 48, 200, 92);

        // Maglie della rete
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        for (let x = 60; x <= 260; x += 14) {
          ctx.beginPath(); ctx.moveTo(x, 48); ctx.lineTo(x, 140); ctx.stroke();
        }

        const netT = (f - 54) / 31;
        const gkX = 90 + netT * 70;
        const gkY = 108 - Math.sin(netT * Math.PI) * 20;
        drawPixelPlayer(ctx, gkX, gkY, "#2196f3", "#f6d0a8", "slide", 1, f);

        const goalBallX = 225;
        const goalBallY = 68;
        drawRetroBall(ctx, goalBallX, goalBallY, 9, f * 0.5);

        // Screen shake
        const shake = (Math.random() - 0.5) * 5;
        ctx.save();
        ctx.translate(shake, shake);

        ctx.strokeStyle = "#ffd23f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(goalBallX, goalBallY, 18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#ffd23f";
        ctx.font = "900 24px 'Dela Gothic One', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("⚽ GOOOOOOOL!", 160, 40);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("⚽ GOOOOOOOL!", 158, 38);
        ctx.restore();
      }
    } else if (act.type === "drib") {
      // SEQUENZA DRIBBLING
      ctx.fillStyle = "#2e7d32";
      ctx.fillRect(0, 16, W, H - 16);

      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      const scrollX = (f * 14) % 60;
      for (let x = -60; x <= 360; x += 60) {
        ctx.beginPath(); ctx.moveTo(x - scrollX, 16); ctx.lineTo(x - scrollX, H); ctx.stroke();
      }

      const atkX = 110;
      const isLeaping = f > 22 && f < 50;
      const jumpY = isLeaping ? 120 - Math.sin(((f - 22) / 28) * Math.PI) * 35 : 120;

      drawPixelPlayer(ctx, atkX, jumpY, "#ffd23f", "#f6d0a8", isLeaping ? "jump" : "run", 1, f);
      drawRetroBall(ctx, atkX + 16, jumpY + 8, 6, f * 0.3);

      const defX = 280 - (f * 4.2);
      if (defX > 50) {
        drawPixelPlayer(ctx, defX, 130, "#ff4d5a", "#f6d0a8", "slide", -1, f);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(defX + 12, 134, 6 + Math.sin(f) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (f > 30) {
        ctx.fillStyle = "#00e5ff";
        ctx.font = "900 18px 'Dela Gothic One', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("DRIBBLING SUPERATO!", 160, 48);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("DRIBBLING SUPERATO!", 158, 46);
      }
    } else if (act.type === "tackle") {
      // SEQUENZA TACKLE
      ctx.fillStyle = "#1b5e20";
      ctx.fillRect(0, 16, W, H - 16);

      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      for (let y = 30; y < H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      drawPixelPlayer(ctx, 180, 115, "#ff4d5a", "#f6d0a8", "run", -1, f);
      drawRetroBall(ctx, 165, 122, 6, f * 0.2);

      const defSlideX = 40 + f * 3.6;
      drawPixelPlayer(ctx, defSlideX, 124, "#ffd23f", "#f6d0a8", "slide", 1, f);

      if (f > 24 && f < 45) {
        ctx.fillStyle = "#ffd23f";
        ctx.beginPath();
        ctx.arc(165, 122, (f - 24) * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(165, 122, (f - 24) * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      if (f > 30) {
        ctx.fillStyle = "#ffd23f";
        ctx.font = "900 18px 'Dela Gothic One', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TACKLE DECISIVO!", 160, 48);
      }
    } else {
      // SEQUENZA PASSAGGIO
      ctx.fillStyle = "#2e7d32";
      ctx.fillRect(0, 16, W, H - 16);

      for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) {
          ctx.fillStyle = "rgba(0,0,0,0.06)";
          ctx.fillRect(0, 16 + i * 37, W, 37);
        }
      }

      drawPixelPlayer(ctx, 70, 110, "#ffd23f", "#f6d0a8", f < 18 ? "kick" : "run", 1, f);
      drawPixelPlayer(ctx, 240, 105, "#ffd23f", "#f6d0a8", "run", 1, f);

      const passT = Math.min(1, Math.max(0, (f - 12) / 30));
      const bX = 85 + passT * 145;
      const bY = 112 - Math.sin(passT * Math.PI) * 16;
      drawRetroBall(ctx, bX, bY, 6, f * 0.4);

      if (f > 25) {
        ctx.fillStyle = "#ffd23f";
        ctx.font = "900 18px 'Dela Gothic One', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PASSAGGIO SUI PIEDI!", 160, 44);
      }
    }

    // Banner d'azione superiore (sotto la barra di debug)
    ctx.fillStyle = "rgba(6, 11, 24, 0.88)";
    ctx.fillRect(10, 20, 300, 18);
    ctx.strokeStyle = act.color || "#ffd23f";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 20, 300, 18);

    ctx.fillStyle = act.color || "#ffd23f";
    ctx.font = "bold 8.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${act.title} · «${act.soundWord}»`, 160, 32);
    ctx.textAlign = "left";
  }

  // ================= ESIBIZIONE RAPIDA STANDALONE =================
  function openTsubasaExhibition(onBack) {
    if (typeof window.closeAltStage === "function") window.closeAltStage();

    window.tsubasaExhibState = {
      score: [0, 0],
      min: 10,
      zone: 3,
      guts: 95,
      poss: "us",
      opp: { name: "Toro Galli", team: "Tori di Torino", color: "#ff4d5a" }
    };

    if (typeof window.setView === "function") window.setView({ kind: "tsubasa" });
    else if (window.gameEngine && window.gameEngine.setView) window.gameEngine.setView({ kind: "tsubasa" });

    if (typeof window.setChapter === "function") window.setChapter("Esibizione Captain Tsubasa (NES/SNES)");
    if (typeof window.renderText === "function") {
      window.renderText("voce", "Partita d'esibizione a duelli 1v1 contro i <b>Tori di Torino</b>! In alto vedi il duello e il radar tattico dinamico con la barra di debug. Quando scegli un'azione, il campo si anima a 60 FPS!");
    }

    function updateMatchHudUI(s) {
      const hud = document.getElementById("matchHud");
      if (hud) {
        hud.hidden = false;
        const hMin = document.getElementById("hMin");
        const hScore = document.getElementById("hScore");
        const hZone = document.getElementById("hZone");
        const hPoss = document.getElementById("hPoss");
        const hGuts = document.getElementById("hGuts");
        if (hMin) hMin.textContent = s.min + "'";
        if (hScore) hScore.textContent = `${s.score[0]}–${s.score[1]}`;
        if (hZone) hZone.textContent = "Z" + s.zone;
        if (hPoss) hPoss.textContent = s.poss === "us" ? "Rondine" : s.opp.team.split(" ")[0];
        if (hGuts) hGuts.style.width = Math.min(100, Math.max(0, s.guts)) + "%";
      }
    }

    const textEl = document.getElementById("text");

    function renderChoices() {
      const s = window.tsubasaExhibState;
      if (!s) return;

      updateMatchHudUI(s);

      if (s.min >= 90) {
        // Fine partita
        if (textEl) {
          textEl.innerHTML = `<span class="who" style="background:#ffd23f; color:#0e1424; font-weight:bold;">Triplice Fischio</span><span class="t"><b>FINALE PARTITA TECMO</b>: Rondine FC ${s.score[0]} – ${s.score[1]} Tori di Torino!</span>`;
        }
        const choices = document.getElementById("choices");
        if (choices) {
          choices.style.display = "flex";
          choices.style.flexDirection = "column";
          choices.innerHTML = `
            <button type="button" class="choice-btn hot" onclick="window.openTsubasaExhibition()">Gioca un'altra esibizione 🔄</button>
            <button type="button" class="choice-btn" onclick="if(window.setView) window.setView({ kind: 'scene', bg: 'title' }); if(window.title) window.title();">Torna al Menu Principale 🏠</button>
          `;
        }
        return;
      }

      const choices = document.getElementById("choices");
      if (!choices) return;

      choices.innerHTML = "";
      choices.className = "choices";
      choices.style.display = "grid";
      choices.style.gridTemplateColumns = "repeat(2, 1fr)";
      choices.style.gap = "8px";

      const isAtk = s.poss === "us";

      const actions = isAtk ? [
        {
          label: "TIRO RONDINE",
          icon: "🔥",
          sub: "Destro a giro (-35 Grinta)",
          cls: "hot",
          disabled: s.guts < 35,
          fn: () => {
            s.guts -= 35;
            startTsubasaAction("shot", {
              title: "TIRO DELLA RONDINE!",
              sub: "Leo Moretti calcia col collo destro!",
              color: "#ffd23f",
              soundWord: "BOOOOOOM!"
            }, () => {
              const isGoal = Math.random() < 0.75;
              if (isGoal) {
                s.score[0]++;
                if (window.toast) window.toast("⚽ GOOOL TECMO! RETE GONFIATA!", "goal", "🔥");
                if (textEl) textEl.innerHTML = `<span class="who" style="background:#ffd23f; color:#0e1424; font-weight:bold;">⚽ GOOOL!</span><span class="t">Leo Moretti calcia un missile teleguidato che sfonda la rete! <b>Rondine FC in vantaggio!</b></span>`;
              } else {
                if (window.toast) window.toast("PARATA PRODIGIOSA!", "warn", "🧤");
                if (textEl) textEl.innerHTML = `<span class="who" style="background:#ff4d5a; color:#fff; font-weight:bold;">PARATA</span><span class="t">Il portiere rivale vola e toglie la sfera dal sette con un miracolo felino!</span>`;
              }
              s.min += 8;
              s.zone = 2;
              s.poss = "them";
              renderChoices();
            });
          }
        },
        {
          label: "DRIBBLING",
          icon: "💨",
          sub: "Finta di corpo (-8 Grinta)",
          disabled: s.guts < 8,
          fn: () => {
            s.guts -= 8;
            startTsubasaAction("drib", {
              title: "DRIBBLING AGILITÀ!",
              sub: "Doppio passo su Toro Galli!",
              color: "#00e5ff",
              soundWord: "SWOOOOOSH!"
            }, () => {
              s.zone = Math.min(5, s.zone + 1);
              s.min += 5;
              if (window.toast) window.toast("Dribbling riuscito! Avanzi in zona " + s.zone, "info", "💨");
              if (textEl) textEl.innerHTML = `<span class="who" style="background:#00e5ff; color:#0e1424; font-weight:bold;">💨 Dribbling</span><span class="t">Leo supera in slalom Toro Galli e guadagna metri preziosi verso l'area avversaria!</span>`;
              renderChoices();
            });
          }
        },
        {
          label: "PASSA",
          icon: "👟",
          sub: "Assist a Tommy (-5 Grinta)",
          disabled: s.guts < 5,
          fn: () => {
            s.guts -= 5;
            startTsubasaAction("pass", {
              title: "PASSAGGIO FILTRANTE!",
              sub: "Palla sui piedi di Tommy!",
              color: "#ffd23f",
              soundWord: "ZUUUUM!"
            }, () => {
              s.zone = Math.min(5, s.zone + 1);
              s.min += 4;
              if (window.toast) window.toast("Passaggio filtrante completato!", "info", "👟");
              if (textEl) textEl.innerHTML = `<span class="who" style="background:#ffd23f; color:#0e1424; font-weight:bold;">👟 Assist</span><span class="t">Servizio millimetrico rasoterra: Tommy controlla e punta la porta!</span>`;
              renderChoices();
            });
          }
        },
        {
          label: "UNO-DUE",
          icon: "🔄",
          sub: "Dai e vai rapido (-12 Grinta)",
          disabled: s.guts < 12,
          fn: () => {
            s.guts -= 12;
            startTsubasaAction("pass", {
              title: "UNO-DUE RAPIDO!",
              sub: "Triangolazione di prima!",
              color: "#00e5ff",
              soundWord: "TAC-TAC!"
            }, () => {
              s.zone = Math.min(5, s.zone + 2);
              s.min += 6;
              if (window.toast) window.toast("Uno-due fulmineo! Sei davanti alla porta!", "goal", "⚡");
              if (textEl) textEl.innerHTML = `<span class="who" style="background:#00e5ff; color:#0e1424; font-weight:bold;">⚡ Uno-Due</span><span class="t">Scambio di prima intenzione! La difesa avversaria è tagliata fuori!</span>`;
              renderChoices();
            });
          }
        }
      ] : [
        {
          label: "SCIVOLATA",
          icon: "🦵",
          sub: "Tackle deciso (-10 Grinta)",
          cls: "hot",
          disabled: s.guts < 10,
          fn: () => {
            s.guts -= 10;
            startTsubasaAction("tackle", {
              title: "TACKLE IN SCIVOLATA!",
              sub: "Intervento pulito sul pallone!",
              color: "#ff4d5a",
              soundWord: "STAAACK!"
            }, () => {
              const won = Math.random() < 0.65;
              if (won) {
                s.zone = 3;
                s.poss = "us";
                if (window.toast) window.toast("Palla recuperata da Leo!", "info", "🛡️");
                if (textEl) textEl.innerHTML = `<span class="who" style="background:#22c55e; color:#fff; font-weight:bold;">🛡️ Recupero</span><span class="t">Intervento perfetto sulla sfera! Leo riparte a testa alta!</span>`;
              } else {
                s.score[1]++;
                s.poss = "us";
                s.zone = 2;
                if (window.toast) window.toast("Gol subito!", "warn", "⚽");
                if (textEl) textEl.innerHTML = `<span class="who" style="background:#ff4d5a; color:#fff; font-weight:bold;">⚽ Gol Avversario</span><span class="t">L'attaccante dei Tori trova lo specchio della porta e segna!</span>`;
              }
              s.min += 7;
              renderChoices();
            });
          }
        },
        {
          label: "INTERCETTA",
          icon: "✋",
          sub: "Anticipa la linea (-6 Grinta)",
          disabled: s.guts < 6,
          fn: () => {
            s.guts -= 6;
            startTsubasaAction("tackle", {
              title: "INTERCETTAZIONE!",
              sub: "Anticipo perfetto sul passaggio!",
              color: "#3fa7ff",
              soundWord: "BLOOOCK!"
            }, () => {
              s.zone = 2;
              s.poss = "us";
              s.min += 5;
              if (window.toast) window.toast("Passaggio avversario intercettato!", "info", "✋");
              if (textEl) textEl.innerHTML = `<span class="who" style="background:#3fa7ff; color:#fff; font-weight:bold;">✋ Intercetto</span><span class="t">Lettura tattica impeccabile: traiettoria del passaggio sventata!</span>`;
              renderChoices();
            });
          }
        },
        {
          label: "PRESSING",
          icon: "🛡️",
          sub: "Accompagna all'esterno",
          fn: () => {
            s.zone = Math.max(1, s.zone - 1);
            s.min += 4;
            if (textEl) textEl.innerHTML = `<span class="who" style="background:#94a3b8; color:#0e1424; font-weight:bold;">🛡️ Pressing</span><span class="t">Accompagni l'incursore verso il fallo laterale rallentando la manovra.</span>`;
            renderChoices();
          }
        },
        {
          label: "COPRI & RIFIATA",
          icon: "⏳",
          sub: "Recupera +18 Grinta",
          fn: () => {
            s.guts = Math.min(100, s.guts + 18);
            s.min += 3;
            if (textEl) textEl.innerHTML = `<span class="who" style="background:#22c55e; color:#fff; font-weight:bold;">⏳ Fiato</span><span class="t">Fase di studio: i giocatori rifiatano e recuperano Grinta per il finale.</span>`;
            renderChoices();
          }
        }
      ];

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
          choices.innerHTML = `
            <div style="grid-column: 1 / -1; background:#0c1a30; border:1.5px solid #00e5ff; border-radius:8px; padding:12px; text-align:center; color:#00e5ff; font-weight:bold; font-size:13px; font-family:var(--display, sans-serif);">
              ⚡ AZIONE IN CORSO: ${act.label} · ${act.sub}
            </div>
          `;
          act.fn();
        };

        choices.appendChild(btn);
      });
    }

    renderChoices();
  }

  // Hook globali
  window.isTsubasaEnabled = isTsubasaEnabled;
  window.drawTsubasaMatch = drawTsubasaMatch;
  window.startTsubasaAction = startTsubasaAction;
  window.openTsubasaExhibition = openTsubasaExhibition;
})();
