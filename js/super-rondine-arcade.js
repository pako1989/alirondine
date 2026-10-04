// ================= v18 · IL CABINATO ARCADE DEL BAR: SUPER RONDINE '94 =================
// Minigioco arcade 16-bit a gettoni nel Bar del Porto:
// - Effetto schermo CRT a tubo catodico con scanline e fosfori anni '90
// - Partite veloci 3v3 stile Neo Geo / Sensible Soccer
// - IA reattiva e viva: avversari che scattano, dribblano e tirano; compagni che tagliano e si smarcano
// - Animazioni di corsa con gambe alternate, tuffi dei portieri e joystick virtuale reattivo
(function () {
  "use strict";

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

  function play8BitBeep(freq = 440, duration = 0.08, type = "square") {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = type;
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

  function getHeroInfo() {
    try {
      if (typeof window.heroLoad === "function") return window.heroLoad();
      const raw = localStorage.getItem("ali-di-rondine.eroe");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function initArcadeMatch() {
    const hero = getHeroInfo();
    ARC_STATE = {
      frame: 0,
      hero: hero,
      heroName: hero && hero.name ? hero.name.toUpperCase() : "RONDINE",
      p1: {
        x: 130, y: 120, vx: 0, vy: 0, speed: 2.6, slide: 0,
        num: hero && hero.num ? hero.num : 10,
        shirt: hero && hero.shirt ? hero.shirt : "#ff3344",
        skin: hero && hero.skin ? hero.skin : "#f5c898",
        hair: hero && hero.hair ? hero.hair : "#241810",
        isMoving: false
      },
      p2: { x: 80, y: 65, vx: 0, vy: 0, speed: 2.2, slide: 0, num: 8, isMoving: false },
      p3: { x: 80, y: 175, vx: 0, vy: 0, speed: 2.2, slide: 0, num: 17, isMoving: false },
      gk1: { x: 26, y: 120, vy: 0, speed: 1.8, isMoving: false },
      // Rivali Bar Sport
      e1: { x: 230, y: 120, vx: 0, vy: 0, speed: 2.3, slide: 0, num: 9, isMoving: false },
      e2: { x: 280, y: 65, vx: 0, vy: 0, speed: 2.1, slide: 0, num: 7, isMoving: false },
      e3: { x: 280, y: 175, vx: 0, vy: 0, speed: 2.1, slide: 0, num: 4, isMoving: false },
      gk2: { x: 334, y: 120, vy: 0, speed: 1.8, isMoving: false },
      ball: { x: 180, y: 120, vx: 0, vy: 0, owner: null, spin: 0 },
      score: [0, 0],
      timer: 90 * 60, // 90 seconds @ 60fps
      particles: [],
      goalBanner: 0,
      over: false,
      joyX: 0,
      joyY: 0,
      touchStick: { active: false, x: 0, y: 0, curX: 0, curY: 0 }
    };
  }

  function resetBallArcade(scorer = null) {
    if (!ARC_STATE) return;
    ARC_STATE.ball.x = 180;
    ARC_STATE.ball.y = 120;
    ARC_STATE.ball.vx = 0;
    ARC_STATE.ball.vy = 0;
    ARC_STATE.ball.owner = null;
    ARC_STATE.p1.x = 130;
    ARC_STATE.p1.y = 120;
    ARC_STATE.p2.x = 80;
    ARC_STATE.p2.y = 65;
    ARC_STATE.p3.x = 80;
    ARC_STATE.p3.y = 175;

    ARC_STATE.e1.x = 230;
    ARC_STATE.e1.y = 120;
    ARC_STATE.e2.x = 280;
    ARC_STATE.e2.y = 65;
    ARC_STATE.e3.x = 280;
    ARC_STATE.e3.y = 175;

    ARC_STATE.goalBanner = 70; // mostra banner gol per 70 frames
  }

  // --- LOGICA DI GIOCO FISICA & IA ---
  function tick() {
    if (!ARC_STATE || ARC_STATE.over) return;
    const s = ARC_STATE;
    s.frame++;

    // Timer partita
    if (s.goalBanner > 0) {
      s.goalBanner--;
      return; // fermo temporaneo durante esultanza gol
    }

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
      play8BitBeep(440, 0.4);
      setTimeout(() => play8BitBeep(330, 0.5), 300);
      return;
    }

    // 1. Movimento Giocatore 1 (Leo Moretti)
    if (s.p1.slide <= 0) {
      const moving = Math.abs(s.joyX) > 0.05 || Math.abs(s.joyY) > 0.05;
      s.p1.isMoving = moving;
      if (moving) {
        s.p1.x += s.joyX * s.p1.speed;
        s.p1.y += s.joyY * s.p1.speed;
      }
    } else {
      s.p1.slide--;
      s.p1.isMoving = true;
      s.p1.x += s.p1.vx;
      s.p1.y += s.p1.vy;
      s.particles.push({ x: s.p1.x, y: s.p1.y + 4, life: 10 });
    }
    s.p1.x = Math.max(26, Math.min(334, s.p1.x));
    s.p1.y = Math.max(24, Math.min(216, s.p1.y));

    // 2. IA Compagni di Squadra (Rondine: Tommy #8 e Gigi #17)
    const mates = [s.p2, s.p3];
    mates.forEach((m, idx) => {
      m.isMoving = true;
      if (s.ball.owner === m) {
        // Il compagno porta palla verso la porta avversaria!
        m.x += m.speed * 0.95;
        m.y += Math.sin(s.frame * 0.08 + idx) * 0.9;
        // Se vicino all'area avversaria, tira in porta!
        if (m.x > 260) {
          s.ball.owner = null;
          s.ball.vx = 5.8;
          s.ball.vy = (120 - m.y) * 0.03 + (Math.random() - 0.5) * 1.5;
          play8BitBeep(520, 0.12);
        }
      } else if (s.ball.owner === s.p1) {
        // Leo ha la palla: i compagni scattano avanti sulle fasce per farsi dare la palla!
        const targetX = Math.min(300, s.p1.x + 80);
        const targetY = idx === 0 ? 60 : 180;
        m.x += (targetX - m.x) * 0.04;
        m.y += (targetY - m.y) * 0.04;
      } else if (s.ball.owner && (s.ball.owner === s.e1 || s.ball.owner === s.e2 || s.ball.owner === s.e3)) {
        // Avversari hanno la palla: i compagni ripiegano e provano il contrasto se vicini
        const d = Math.hypot(s.ball.x - m.x, s.ball.y - m.y);
        if (d < 50) {
          m.x += (s.ball.x - m.x) / d * m.speed;
          m.y += (s.ball.y - m.y) / d * m.speed;
          if (d < 12 && Math.random() < 0.04) {
            s.ball.owner = m;
            play8BitBeep(340, 0.1);
          }
        } else {
          // Mantieni posizione difensiva
          const defX = 110;
          const defY = idx === 0 ? 80 : 160;
          m.x += (defX - m.x) * 0.03;
          m.y += (defY - m.y) * 0.03;
        }
      } else {
        // Palla libera: corri verso la palla se è nella metà campo amica o vicina
        const d = Math.hypot(s.ball.x - m.x, s.ball.y - m.y);
        if (d < 100) {
          m.x += (s.ball.x - m.x) / d * m.speed;
          m.y += (s.ball.y - m.y) / d * m.speed;
        } else {
          const homeX = idx === 0 ? 100 : 120;
          const homeY = idx === 0 ? 70 : 170;
          m.x += (homeX - m.x) * 0.03;
          m.y += (homeY - m.y) * 0.03;
        }
      }
      m.x = Math.max(26, Math.min(334, m.x));
      m.y = Math.max(24, Math.min(216, m.y));
    });

    // 3. IA Avversari (Bar Sport: e1 Striker, e2 Ala, e3 Difensore)
    const enemies = [s.e1, s.e2, s.e3];
    enemies.forEach((e, idx) => {
      e.isMoving = true;
      if (s.ball.owner === e) {
        // L'avversario porta palla e punta la porta di Nico (x: 26, y: 120)!
        e.x -= e.speed * 0.95;
        e.y += Math.sin(s.frame * 0.07 + idx) * 1.1;

        // Se è a tiro (x < 130), calcia in porta!
        if (e.x < 130) {
          s.ball.owner = null;
          s.ball.vx = -5.4;
          s.ball.vy = (120 - e.y) * 0.04 + (Math.random() - 0.5) * 2;
          play8BitBeep(320, 0.12);
        }
      } else if (s.ball.owner === s.p1 || s.ball.owner === s.p2 || s.ball.owner === s.p3) {
        // Rondine ha la palla: pressing aggressivo del rivale più vicino, marcatura degli altri
        const dToBall = Math.hypot(s.ball.x - e.x, s.ball.y - e.y);
        const isClosest = enemies.every((other) => Math.hypot(s.ball.x - other.x, s.ball.y - other.y) >= dToBall);

        if (isClosest || dToBall < 60) {
          // Pressing diretto sulla palla
          e.x += (s.ball.x - e.x) / dToBall * e.speed;
          e.y += (s.ball.y - e.y) / dToBall * e.speed;

          // Tentativo di scivolata/tackle avversario
          if (dToBall < 14 && Math.random() < 0.04) {
            s.ball.owner = e;
            play8BitBeep(220, 0.1);
          }
        } else {
          // Posizionamento tattico di copertura
          const targetX = Math.max(160, s.ball.x + 50);
          const targetY = idx === 1 ? 70 : 170;
          e.x += (targetX - e.x) * 0.03;
          e.y += (targetY - e.y) * 0.03;
        }
      } else {
        // Palla libera: corri verso la palla!
        const d = Math.hypot(s.ball.x - e.x, s.ball.y - e.y);
        if (d > 4) {
          e.x += (s.ball.x - e.x) / d * e.speed;
          e.y += (s.ball.y - e.y) / d * e.speed;
        }
      }
      e.x = Math.max(26, Math.min(334, e.x));
      e.y = Math.max(24, Math.min(216, e.y));
    });

    // 4. Portieri Dinamici
    // Nico Ferri (gk1)
    s.gk1.isMoving = Math.abs(s.ball.y - s.gk1.y) > 2;
    s.gk1.y += (s.ball.y - s.gk1.y) * 0.12;
    s.gk1.y = Math.max(92, Math.min(148, s.gk1.y));

    // Baffone (gk2)
    s.gk2.isMoving = Math.abs(s.ball.y - s.gk2.y) > 2;
    s.gk2.y += (s.ball.y - s.gk2.y) * 0.12;
    s.gk2.y = Math.max(92, Math.min(148, s.gk2.y));

    // 5. Fisica Pallone
    const b = s.ball;
    if (b.owner) {
      const isRondine = (b.owner === s.p1 || b.owner === s.p2 || b.owner === s.p3);
      b.x = b.owner.x + (isRondine ? 7 : -7);
      b.y = b.owner.y;
      b.vx = 0;
      b.vy = 0;
    } else {
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.985;
      b.vy *= 0.985;

      // Rimbalzo sponde laterali (alto e basso)
      if (b.y < 24) {
        b.y = 24;
        b.vy = Math.abs(b.vy) * 0.9;
        play8BitBeep(180, 0.05);
      } else if (b.y > 216) {
        b.y = 216;
        b.vy = -Math.abs(b.vy) * 0.9;
        play8BitBeep(180, 0.05);
      }

      // Parata di Nico (gk1)
      if (b.x < 36 && Math.abs(b.y - s.gk1.y) < 18) {
        b.vx = Math.abs(b.vx) + 2.5;
        b.vy = (Math.random() - 0.5) * 3;
        play8BitBeep(440, 0.1, "triangle");
      }
      // Parata di Baffone (gk2)
      if (b.x > 324 && Math.abs(b.y - s.gk2.y) < 18) {
        b.vx = -Math.abs(b.vx) - 2.5;
        b.vy = (Math.random() - 0.5) * 3;
        play8BitBeep(440, 0.1, "triangle");
      }

      // Rete e Gol!
      if (b.x < 24) {
        if (b.y > 88 && b.y < 152) {
          // Gol Bar Sport!
          s.score[1]++;
          play8BitBeep(120, 0.4);
          resetBallArcade("bar_sport");
        } else {
          b.x = 24;
          b.vx = Math.abs(b.vx);
        }
      }
      if (b.x > 336) {
        if (b.y > 88 && b.y < 152) {
          // Gol Rondine!
          s.score[0]++;
          play8BitBeep(640, 0.3);
          setTimeout(() => play8BitBeep(880, 0.3), 150);
          resetBallArcade("rondine");
        } else {
          b.x = 336;
          b.vx = -Math.abs(b.vx);
        }
      }

      // Raccolta palla da giocatore vicino
      const allPlayers = [s.p1, s.p2, s.p3, s.e1, s.e2, s.e3];
      for (let p of allPlayers) {
        if (Math.hypot(b.x - p.x, b.y - p.y) < 11) {
          b.owner = p;
          play8BitBeep(300, 0.04);
          break;
        }
      }
    }

    // Particelle scivolata
    for (let i = s.particles.length - 1; i >= 0; i--) {
      s.particles[i].life--;
      if (s.particles[i].life <= 0) s.particles.splice(i, 1);
    }
  }

  // --- RENDERING GRAFICA 16-BIT ---
  function draw() {
    if (!ctx || !ARC_STATE) return;
    const g = ctx;
    const s = ARC_STATE;

    // 1. Erba a strisce tipo console 16-bit
    g.fillStyle = "#1e7a34";
    g.fillRect(0, 0, AW, AH);
    for (let x = 0; x < AW; x += 40) {
      g.fillStyle = (x % 80 === 0) ? "#24883c" : "#1e7a34";
      g.fillRect(x, 0, 40, AH);
    }

    // 2. Linee bianche del campo
    g.strokeStyle = "rgba(255, 255, 255, 0.75)";
    g.lineWidth = 2;
    g.strokeRect(24, 20, 312, 200);

    // Linea di metà campo e cerchio
    g.beginPath();
    g.moveTo(180, 20);
    g.lineTo(180, 220);
    g.stroke();

    g.beginPath();
    g.arc(180, 120, 30, 0, Math.PI * 2);
    g.stroke();

    // Aree di rigore
    g.strokeRect(24, 76, 44, 88);
    g.strokeRect(292, 76, 44, 88);

    // Porte da calcio (rete)
    g.fillStyle = "rgba(255, 255, 255, 0.25)";
    g.fillRect(10, 88, 14, 64);
    g.fillRect(336, 88, 14, 64);
    g.strokeStyle = "#ffffff";
    g.strokeRect(10, 88, 14, 64);
    g.strokeRect(336, 88, 14, 64);

    // Particelle di scivolata
    s.particles.forEach((pt) => {
      g.fillStyle = "#0c4018";
      g.fillRect(pt.x - 2, pt.y - 2, 4, 4);
    });

    // 3. Disegno Sprite 16-bit con animazione camminata / corsa
    const drawSprite16 = (x, y, shirt, skin, hair, isGk = false, isMoving = false, isPlayer = false) => {
      const legStep = isMoving ? Math.sin(s.frame * 0.35) * 3 : 0;

      // Ombra
      g.fillStyle = "rgba(0,0,0,0.35)";
      g.fillRect(x - 5, y + 7, 10, 3);

      // Gambe animate (corsa alternata 16-bit)
      g.fillStyle = "#111111"; // scarpini
      g.fillRect(x - 4 + legStep, y + 4, 3, 3);
      g.fillRect(x + 1 - legStep, y + 4, 3, 3);

      // Pantaloncini
      g.fillStyle = isGk ? "#112233" : "#ffffff";
      g.fillRect(x - 4, y + 1, 8, 4);

      // Maglia
      g.fillStyle = shirt;
      g.fillRect(x - 5, y - 5, 10, 6);

      // Braccia e testa
      g.fillStyle = skin;
      g.fillRect(x - 7, y - 4 + (isMoving ? -legStep * 0.5 : 0), 2, 5);
      g.fillRect(x + 5, y - 4 + (isMoving ? legStep * 0.5 : 0), 2, 5);
      g.fillRect(x - 3, y - 10, 6, 5);

      // Capelli
      g.fillStyle = hair;
      g.fillRect(x - 3, y - 12, 6, 3);

      // Freccia indicatore "1P" lampeggiante su Leo
      if (isPlayer) {
        const bounce = Math.sin(s.frame * 0.2) * 2;
        g.fillStyle = "#ffd23f";
        g.beginPath();
        g.moveTo(x, y - 15 + bounce);
        g.lineTo(x - 4, y - 20 + bounce);
        g.lineTo(x + 4, y - 20 + bounce);
        g.fill();

        g.fillStyle = "#ffd23f";
        g.font = "bold 8px monospace";
        g.textAlign = "center";
        g.fillText("1P", x, y - 22 + bounce);
      }
    };

    // Rondine (Maglia Rossa Amaranto o Maglia del Tuo Campione)
    drawSprite16(s.p1.x, s.p1.y, s.p1.shirt, s.p1.skin, s.p1.hair, false, s.p1.isMoving, true);
    drawSprite16(s.p2.x, s.p2.y, "#ff3344", "#f5c898", "#e6be44", false, s.p2.isMoving);
    drawSprite16(s.p3.x, s.p3.y, "#ff3344", "#dfab7e", "#111111", false, s.p3.isMoving);
    drawSprite16(s.gk1.x, s.gk1.y, "#19a0b8", "#f5c898", "#ff7a22", true, s.gk1.isMoving);

    // Bar Sport (Maglia Blu Elettrico)
    drawSprite16(s.e1.x, s.e1.y, "#1d3fa3", "#eec398", "#333333", false, s.e1.isMoving);
    drawSprite16(s.e2.x, s.e2.y, "#1d3fa3", "#eec398", "#543825", false, s.e2.isMoving);
    drawSprite16(s.e3.x, s.e3.y, "#1d3fa3", "#eec398", "#241812", false, s.e3.isMoving);
    drawSprite16(s.gk2.x, s.gk2.y, "#ffcc00", "#eec398", "#222222", true, s.gk2.isMoving);

    // 4. Pallone
    const b = s.ball;
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.arc(b.x, b.y, 4.5, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#111111";
    g.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);

    // 5. Stick Touch Virtuale (feedback visivo sul campo)
    if (s.touchStick && s.touchStick.active) {
      g.strokeStyle = "rgba(255, 210, 63, 0.4)";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(s.touchStick.x, s.touchStick.y, 22, 0, Math.PI * 2);
      g.stroke();

      g.fillStyle = "rgba(255, 210, 63, 0.7)";
      g.beginPath();
      g.arc(s.touchStick.curX, s.touchStick.curY, 10, 0, Math.PI * 2);
      g.fill();
    }

    // 6. Scanlines CRT anni '90
    g.fillStyle = "rgba(0, 0, 0, 0.16)";
    for (let y = 0; y < AH; y += 3) {
      g.fillRect(0, y, AW, 1);
    }

    // 7. HUD Superiore
    g.fillStyle = "rgba(0, 0, 0, 0.85)";
    g.fillRect(0, 0, AW, 18);
    g.fillStyle = "#ffd23f";
    g.font = "bold 11px monospace";
    g.textAlign = "left";
    g.fillText(`1P [${s.heroName}] ${s.score[0]} - ${s.score[1]} [BAR SPORT] 2P`, 10, 13);

    g.fillStyle = "#ff4d5a";
    g.textAlign = "right";
    g.fillText(`TIME ${Math.max(0, Math.ceil(s.timer / 60))}"`, AW - 10, 13);
    g.textAlign = "left";

    // 8. Banner GOAAAL!
    if (s.goalBanner > 0) {
      g.fillStyle = "rgba(0, 0, 0, 0.75)";
      g.fillRect(0, AH / 2 - 24, AW, 48);
      g.fillStyle = "#ffd23f";
      g.font = "900 24px monospace";
      g.textAlign = "center";
      g.fillText("⚽ RETE! GOOOAL! ⚽", AW / 2, AH / 2 + 7);
      g.textAlign = "left";
    }

    // 9. Schermata Finale
    if (s.over) {
      g.fillStyle = "rgba(0, 0, 0, 0.88)";
      g.fillRect(0, 0, AW, AH);
      g.fillStyle = s.score[0] > s.score[1] ? "#ffd23f" : "#ff4d5a";
      g.font = "bold 20px monospace";
      g.textAlign = "center";
      g.fillText(s.score[0] > s.score[1] ? "★ YOU WIN! ★" : "GAME OVER", AW / 2, AH / 2 - 12);
      g.fillStyle = "#ffffff";
      g.font = "12px monospace";
      g.fillText(`RISULTATO FINALE: ${s.score[0]} - ${s.score[1]}`, AW / 2, AH / 2 + 12);
      g.textAlign = "left";
    }
  }

  function loop() {
    if (!isPlaying) return;
    tick();
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  // --- GESTIONE INPUT & CONTROLLI (TOUCH + KEYBOARD) ---
  let keys = {};
  function handleKeyDown(e) {
    if (!isPlaying || !ARC_STATE) return;
    keys[e.code] = true;
    updateKeyMovement();

    if (e.code === "Space" || e.code === "KeyZ") {
      doShoot();
      e.preventDefault();
    } else if (e.code === "KeyX" || e.code === "ShiftLeft") {
      doSlide();
      e.preventDefault();
    }
  }

  function handleKeyUp(e) {
    keys[e.code] = false;
    updateKeyMovement();
  }

  function updateKeyMovement() {
    if (!ARC_STATE) return;
    let dx = 0, dy = 0;
    if (keys["ArrowLeft"] || keys["KeyA"]) dx -= 1;
    if (keys["ArrowRight"] || keys["KeyD"]) dx += 1;
    if (keys["ArrowUp"] || keys["KeyW"]) dy -= 1;
    if (keys["ArrowDown"] || keys["KeyS"]) dy += 1;

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      ARC_STATE.joyX = dx / len;
      ARC_STATE.joyY = dy / len;
    } else if (!ARC_STATE.touchStick.active) {
      ARC_STATE.joyX = 0;
      ARC_STATE.joyY = 0;
    }
  }

  function doShoot() {
    if (!ARC_STATE) return;
    const b = ARC_STATE.ball;
    if (b.owner === ARC_STATE.p1) {
      b.owner = null;
      b.vx = 6.6;
      b.vy = (ARC_STATE.joyY || 0) * 2.2 + (Math.random() - 0.5) * 1.5;
      play8BitBeep(560, 0.12);
      if (window.haptic) window.haptic(30);
      if (ARC_STATE.hero && ARC_STATE.hero.shotName && Math.random() < 0.35) {
        if (window.toast) window.toast(`${ARC_STATE.hero.name}: ${ARC_STATE.hero.shotName}!`, "info", "⚡");
      }
    }
  }

  function doSlide() {
    if (!ARC_STATE || ARC_STATE.p1.slide > 0) return;
    ARC_STATE.p1.slide = 16;
    const dirX = ARC_STATE.joyX !== 0 ? ARC_STATE.joyX : 1;
    const dirY = ARC_STATE.joyY;
    ARC_STATE.p1.vx = dirX * 4.2;
    ARC_STATE.p1.vy = dirY * 4.2;
    play8BitBeep(180, 0.08);
    if (window.haptic) window.haptic(25);
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
      <div style="color:#78869c; font-size:11px; font-family:monospace; margin-top:6px; text-align:center;">
        Trascina sul campo per muovere Leo · Su PC: Frecce/WASD + Spazio (Tiro)
      </div>
    `;

    document.body.appendChild(modalEl);

    canvas = modalEl.querySelector("#arcCanvas");
    ctx = canvas.getContext("2d");

    // Touch controls per il movimento (Virtual Joystick dinamico)
    function getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    canvas.addEventListener("pointerdown", (e) => {
      if (!ARC_STATE) return;
      const pos = getCanvasCoords(e);
      ARC_STATE.touchStick.active = true;
      ARC_STATE.touchStick.x = pos.x;
      ARC_STATE.touchStick.y = pos.y;
      ARC_STATE.touchStick.curX = pos.x;
      ARC_STATE.touchStick.curY = pos.y;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!ARC_STATE || !ARC_STATE.touchStick.active) return;
      const pos = getCanvasCoords(e);
      ARC_STATE.touchStick.curX = pos.x;
      ARC_STATE.touchStick.curY = pos.y;

      const dx = pos.x - ARC_STATE.touchStick.x;
      const dy = pos.y - ARC_STATE.touchStick.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        ARC_STATE.joyX = Math.max(-1, Math.min(1, dx / Math.max(1, dist)));
        ARC_STATE.joyY = Math.max(-1, Math.min(1, dy / Math.max(1, dist)));
      } else {
        ARC_STATE.joyX = 0;
        ARC_STATE.joyY = 0;
      }
    });

    const resetTouch = () => {
      if (ARC_STATE) {
        ARC_STATE.touchStick.active = false;
        ARC_STATE.joyX = 0;
        ARC_STATE.joyY = 0;
      }
    };
    canvas.addEventListener("pointerup", resetTouch);
    canvas.addEventListener("pointercancel", resetTouch);

    // Pulsanti
    modalEl.querySelector("#arcShoot").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      doShoot();
    });

    modalEl.querySelector("#arcSlide").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      doSlide();
    });

    modalEl.querySelector("#arcCloseBtn").onclick = window.closeArcadeMachine;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

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
