// js/anello.js - «L'ANELLO DI PIETRA · POK-TA-POK» · Motore di partita originale di «La Piramide del Sole»
// Partita rituale mesoamericana 2v2 nel sacro campo cerimoniale di Pok-ta-pok:
//  - Palla pesante in caucciù naturale con rimbalzi elastici su lastre e muri inclinati
//  - Bersaglio speciale: gli antichi anelli di pietra verticali posti in quota sulle pareti
//  - Tecniche rituali:
//      * Colpo d'Anca: bordata radente ad alta velocità senza rotazione
//      * Volée di Ginocchio: parabola alta e precisa per centrare l'anello sacro
//      * Balzo del Giaguaro: carica acrobatica a mezz'aria per intercettare al volo
//      * Trappola dei Dardi: toccare il suolo oltre il limite attiva folate di sabbia e dardi rituali
(function () {
  "use strict";
  if (window.__anello) return;

  const W = 360, H = 210;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function snd(type) {
    const ctx = getAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    try {
      if (type === "drum") {
        // Tamburo tribale da guerra / tambor ceremonial
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.23);
      } else if (type === "rubber") {
        // Impatto gommoso e pesante della palla di caucciù
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === "stone") {
        // Rimbalzo sonoro contro la pietra intagliata
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (type === "ring") {
        // Palla che attraversa l'anello di pietra sacro (campanella dorata/gong)
        [392, 523, 659, 784].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t + idx * 0.07);
          gain.gain.setValueAtTime(0.2, t + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + idx * 0.07);
          osc.stop(t + idx * 0.07 + 0.38);
        });
      } else if (type === "trap") {
        // Scatto della trappola con sibilo di dardi
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.18);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      }
    } catch (e) {}
  }

  const S = {
    active: false,
    opts: null,
    onDone: null,
    raf: null,
    frame: 0,
    timeSec: 60,
    scoreA: 0,
    scoreB: 0,
    phase: "ready", // ready, play, goal, trap, over
    phaseTimer: 0,
    banner: "POK-TA-POK · IL RITO DEL SOLE",
    subBanner: "Premi SPAZIO o tocca per dare il calcio d'inizio!",
    groundBounces: 0,
    trapAlert: 0,

    // Fisica campo e palla
    ball: {
      x: W / 2,
      y: H / 2,
      z: 0, // altezza da terra per volée
      vx: 0,
      vy: 0,
      vz: 0,
      r: 6,
      holder: null,
      trail: []
    },

    // Anelli verticali di pietra (porte sacre)
    // Posti sulle pareti laterali alle due estremità
    ringA: { x: 38, y: 72, r: 14, label: "ANELLO NORD" },
    ringB: { x: W - 38, y: 72, r: 14, label: "ANELLO SUD" },

    // Giocatori 2v2 (A: Squadra Archeologi / Campione; B: Guardiani o Rivali)
    pA1: { id: "hero", x: 100, y: 130, vx: 0, vy: 0, r: 10, name: "Campione", team: "A", speed: 2.2, cd: 0, power: 100 },
    pA2: { id: "ixchel", x: 70, y: 165, vx: 0, vy: 0, r: 9, name: "Ixchel", team: "A", speed: 2.3, cd: 0, ai: "wing" },
    pB1: { id: "rival1", x: 260, y: 130, vx: 0, vy: 0, r: 10, name: "Guardiano", team: "B", speed: 2.1, cd: 0, ai: "mark" },
    pB2: { id: "rival2", x: 290, y: 165, vx: 0, vy: 0, r: 9, name: "Sacerdote", team: "B", speed: 2.0, cd: 0, ai: "support" },

    keys: { u: false, d: false, l: false, r: false, hip: false, knee: false, roar: false },
    touchTarget: null,
    sunPower: 0, // 0..100 carica rituale
    quakex: 0,
    quakey: 0
  };

  function startMatch(opts) {
    S.active = true;
    S.opts = opts || {};
    S.onDone = opts.onDone || function () {};
    S.scoreA = 0;
    S.scoreB = 0;
    S.timeSec = 65;
    S.frame = 0;
    S.phase = "ready";
    S.phaseTimer = 90;
    S.banner = "POK-TA-POK · IL RITO DEL SOLE";
    S.subBanner = "Colpisci d'anca o al volo per centrare l'Anello Sacro!";
    S.sunPower = 40;
    S.groundBounces = 0;
    S.trapAlert = 0;

    // Reset giocatori
    resetFieldPositions();
    S.pA1.speed = 2.2 + 0.06 * ((S.opts.bonus && S.opts.bonus.te) || 0); // Squadra dei Sogni (TEC)
    if (S.opts.mate) S.pA2.name = S.opts.mate;

    mountUI();
    bindEvents();
    snd("drum");

    if (S.raf) cancelAnimationFrame(S.raf);
    loop();
  }

  function resetFieldPositions() {
    S.ball.x = W / 2;
    S.ball.y = 135;
    S.ball.z = 10;
    S.ball.vx = 0;
    S.ball.vy = 0;
    S.ball.vz = 0;
    S.ball.holder = null;
    S.ball.trail = [];

    S.pA1.x = 110; S.pA1.y = 135; S.pA1.vx = 0; S.pA1.vy = 0;
    S.pA2.x = 65;  S.pA2.y = 160; S.pA2.vx = 0; S.pA2.vy = 0;
    S.pB1.x = 250; S.pB1.y = 135; S.pB1.vx = 0; S.pB1.vy = 0;
    S.pB2.x = 295; S.pB2.y = 160; S.pB2.vx = 0; S.pB2.vy = 0;

    if (S.opts.oppNames && S.opts.oppNames[0]) S.pB1.name = S.opts.oppNames[0];
    if (S.opts.oppNames && S.opts.oppNames[1]) S.pB2.name = S.opts.oppNames[1];
    if (S.opts.mate) S.pA2.name = S.opts.mate;
  }

  function finishMatch(win) {
    if (!S.active) return;
    S.active = false;
    if (S.raf) {
      cancelAnimationFrame(S.raf);
      S.raf = null;
    }
    unbindEvents();
    unmountUI();
    if (window.__sagaCore && typeof window.__sagaCore.endMatch === "function") {
      try { window.__sagaCore.endMatch(); } catch (e) {}
    }
    if (typeof S.onDone === "function") {
      S.onDone({
        a: S.scoreA,
        b: S.scoreB,
        win: win !== undefined ? !!win : S.scoreA > S.scoreB,
        quit: false,
        data: { a: S.scoreA, b: S.scoreB }
      });
    }
  }

  // --- LOGICA DI GIOCO ---
  function update() {
    S.frame++;

    if (S.trapAlert > 0) S.trapAlert--;
    if (S.quakex !== 0 || S.quakey !== 0) {
      S.quakex *= -0.7;
      S.quakey *= -0.7;
      if (Math.abs(S.quakex) < 0.2) S.quakex = 0;
      if (Math.abs(S.quakey) < 0.2) S.quakey = 0;
    }

    if (S.phase === "ready") {
      S.phaseTimer--;
      if (S.phaseTimer <= 0) {
        S.phase = "play";
        S.banner = "";
        S.subBanner = "";
        snd("drum");
      }
      return;
    }

    if (S.phase === "goal" || S.phase === "trap") {
      S.phaseTimer--;
      if (S.phaseTimer <= 0) {
        if (S.timeSec <= 0) {
          S.phase = "over";
          S.phaseTimer = 120;
          S.banner = S.scoreA > S.scoreB ? "VITTORIA SACRA!" : "SCONFITTA NEL TEMPIO";
          S.subBanner = `Punteggio finale: ${S.scoreA} - ${S.scoreB}`;
          snd(S.scoreA > S.scoreB ? "ring" : "drum");
        } else {
          S.phase = "play";
          S.banner = "";
          S.subBanner = "";
          resetFieldPositions();
        }
      }
      return;
    }

    if (S.phase === "over") {
      S.phaseTimer--;
      if (S.phaseTimer <= 0) {
        finishMatch(S.scoreA > S.scoreB);
      }
      return;
    }

    // Modalità "play": countdown timer
    if (S.frame % 60 === 0 && S.timeSec > 0) {
      S.timeSec--;
      if (S.timeSec <= 0) {
        S.phase = "over";
        S.phaseTimer = 90;
        S.banner = S.scoreA > S.scoreB ? "VITTORIA NEL POK-TA-POK!" : S.scoreA === S.scoreB ? "PAREGGIO: SI RIPROVA" : "SCONFITTA AL TRAMONTO";
        S.subBanner = `Punteggio finale: ${S.scoreA} - ${S.scoreB}`;
        return;
      }
    }

    // Ricarica costante energia solare
    if (S.sunPower < 100) S.sunPower = Math.min(100, S.sunPower + 0.12);

    // pilota automatico (prove automatiche): il Campione si muove come il compagno
    if (S.opts.auto) {
      // il Campione insegue la palla e calcia
      const h = S.pA1, dx = S.ball.x - 12 - h.x, dy = S.ball.y - h.y, d = Math.hypot(dx, dy) || 1;
      if (d > 5) { h.vx = (dx / d) * h.speed; h.vy = (dy / d) * h.speed; } else { h.vx *= 0.6; h.vy *= 0.6; }
      h.x += h.vx; h.y += h.vy; clampPlayer(h);
      if (Math.hypot(S.ball.x - h.x, S.ball.y - h.y) < 20 && Math.random() < 0.1) tryAction(Math.random() < 0.7 ? "knee" : "hip", h);
    } else {
    // Controlli Campione (pA1)
    let mx = 0, my = 0;
    if (S.keys.l) mx -= 1;
    if (S.keys.r) mx += 1;
    if (S.keys.u) my -= 1;
    if (S.keys.d) my += 1;

    if (S.touchTarget) {
      const dx = S.touchTarget.x - S.pA1.x;
      const dy = S.touchTarget.y - S.pA1.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 8) {
        mx = dx / dist;
        my = dy / dist;
      }
    }

    const spd = S.pA1.speed;
    if (mx !== 0 || my !== 0) {
      const len = Math.hypot(mx, my) || 1;
      S.pA1.vx = (mx / len) * spd;
      S.pA1.vy = (my / len) * spd;
    } else {
      S.pA1.vx *= 0.7;
      S.pA1.vy *= 0.7;
    }

    S.pA1.x += S.pA1.vx;
    S.pA1.y += S.pA1.vy;
    clampPlayer(S.pA1);

    // Azioni Campione
    if (S.keys.hip) {
      tryAction("hip", S.pA1);
      S.keys.hip = false;
    }
    if (S.keys.knee) {
      tryAction("knee", S.pA1);
      S.keys.knee = false;
    }
    if (S.keys.roar) {
      tryAction("roar", S.pA1);
      S.keys.roar = false;
    }

    }

    // AI Compagno (pA2 - Ixchel)
    updateTeammateAI(S.pA2);

    // AI Avversari (pB1, pB2)
    updateRivalAI(S.pB1, 1);
    updateRivalAI(S.pB2, 2);

    // Fisica Palla
    updateBall();

    // Controllo Gol nell'Anello Nord (porta A) o Anello Sud (porta B)
    checkRingGoal();
  }

  function clampPlayer(p) {
    // Area di gioco: x tra 45 e W - 45, y tra 105 e H - 20 (campo rialzato cerimoniale)
    if (p.x < 45) p.x = 45;
    if (p.x > W - 45) p.x = W - 45;
    if (p.y < 105) p.y = 105;
    if (p.y > H - 18) p.y = H - 18;
  }

  function updateTeammateAI(p) {
    // Segue la palla se è vicina, altrimenti mantiene la diagonale di supporto
    const dBall = Math.hypot(S.ball.x - p.x, S.ball.y - p.y);
    let tx = S.ball.x - 30;
    let ty = S.ball.y > 150 ? 125 : 170;

    if (dBall < 40 && Math.hypot(S.pA1.x - S.ball.x, S.pA1.y - S.ball.y) > 35) {
      tx = S.ball.x;
      ty = S.ball.y;
    }

    const dx = tx - p.x;
    const dy = ty - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 6) {
      p.vx = (dx / dist) * p.speed * 0.9;
      p.vy = (dy / dist) * p.speed * 0.9;
    } else {
      p.vx *= 0.6;
      p.vy *= 0.6;
    }
    p.x += p.vx;
    p.y += p.vy;
    clampPlayer(p);

    // Se vicina, calcia verso l'anello B (Sud)
    if (dBall < 16 && Math.random() < 0.08) {
      tryAction(Math.random() < 0.6 ? "knee" : "hip", p);
    }
  }

  function updateRivalAI(p, role) {
    const dBall = Math.hypot(S.ball.x - p.x, S.ball.y - p.y);
    let tx = W / 2, ty = 140;

    if (role === 1) {
      // Aggressore principale: punta alla palla
      tx = S.ball.x;
      ty = S.ball.y;
    } else {
      // Secondo difensore: copre la traiettoria verso l'anello B
      tx = (S.ringB.x + S.ball.x) / 2;
      ty = S.ball.y > 140 ? 125 : 165;
    }

    const dx = tx - p.x;
    const dy = ty - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 6) {
      p.vx = (dx / dist) * p.speed;
      p.vy = (dy / dist) * p.speed;
    } else {
      p.vx *= 0.6;
      p.vy *= 0.6;
    }
    p.x += p.vx;
    p.y += p.vy;
    clampPlayer(p);

    if (dBall < 16 && Math.random() < 0.09) {
      tryAction(Math.random() < 0.65 ? "knee" : "hip", p);
    }
  }

  // Cerca il fattore di forza che porta la palla più vicino all'anello (stessa fisica di updateBall, senza sponde)
  function aimKnee(ring, vx0, vy0, vz0) {
    let best = 1, bd = 1e9;
    for (let k = 0.5; k <= 2.6; k += 0.05) {
      let x = S.ball.x, y = S.ball.y, z = S.ball.z, vx = vx0 * k, vy = vy0 * k, vz = vz0;
      for (let t = 0; t < 140; t++) {
        x += vx; y += vy; z += vz; vz -= 0.22;
        if (z <= 0) break;
        vx *= 0.985; vy *= 0.985;
        if (vz < 1) {
          const d = Math.hypot(x - ring.x, y - z - ring.y);
          if (d < bd) { bd = d; best = k; }
        }
      }
    }
    return best;
  }

  function tryAction(type, player) {
    const dist = Math.hypot(S.ball.x - player.x, S.ball.y - player.y);
    if (dist > 26) return false;

    // Bersaglio: se squadra A mira verso anello B (destra in quota), altrimenti anello A (sinistra)
    const targetRing = player.team === "A" ? S.ringB : S.ringA;
    const dx = targetRing.x - player.x;
    const dy = (targetRing.y + 10) - player.y;
    const len = Math.hypot(dx, dy) || 1;

    if (type === "hip") {
      // Colpo d'Anca radente e violento
      S.ball.vx = (dx / len) * 5.2 + (Math.random() - 0.5) * 0.8;
      S.ball.vy = (dy / len) * 2.8;
      S.ball.vz = 2.2;
      snd("rubber");
      spawnTrail(player.team === "A" ? "#f59e0b" : "#ef4444");
      return true;
    } else if (type === "knee") {
      // Volée di Ginocchio in parabola alta verso l'anello: la forza si regola sulla distanza (come un tiro mirato),
      // con un errore di mira: piccolo per il Campione e Ixchel, più ampio per i sacerdoti
      let bx = (dx / len) * 4.4, by = (dy / len) * 1.8;
      const sc = aimKnee(targetRing, bx, by, 5.8);
      const bn = S.opts.bonus || {};
      const err = player.team === "A" ? 0.4 - 0.05 * (bn.at || 0) : 0.4 + 0.05 * (bn.df || 0);
      const k = sc * (1 + (Math.random() - 0.5) * 2 * err);
      S.ball.vx = bx * k;
      S.ball.vy = by * k;
      S.ball.vz = 5.8; // quota elevata per centrare l'anello
      snd("stone");
      spawnTrail("#38bdf8");
      return true;
    } else if (type === "roar" && player.team === "A" && S.sunPower >= 60) {
      // Balzo Solare del Giaguaro
      S.sunPower = 0;
      S.ball.vx = (dx / len) * 6.8;
      S.ball.vy = (dy / len) * 3.4;
      S.ball.vz = 4.2;
      S.quakex = 6;
      S.quakey = 4;
      snd("trap");
      snd("drum");
      spawnTrail("#fbbf24");
      return true;
    }
    return false;
  }

  function spawnTrail(col) {
    for (let i = 0; i < 4; i++) {
      S.ball.trail.push({
        x: S.ball.x + (Math.random() - 0.5) * 8,
        y: S.ball.y - S.ball.z + (Math.random() - 0.5) * 8,
        r: 5,
        col: col,
        life: 14
      });
    }
  }

  function updateBall() {
    S.ball.x += S.ball.vx;
    S.ball.y += S.ball.vy;
    S.ball.z += S.ball.vz;

    // Gravità sulla quota z
    S.ball.vz -= 0.22;
    if (S.ball.z <= 0) {
      S.ball.z = 0;
      if (Math.abs(S.ball.vz) > 0.8) {
        S.ball.vz = -S.ball.vz * 0.65;
        snd("rubber");
        S.groundBounces++;
        if (S.groundBounces >= 4) {
          triggerTrap();
        }
      } else {
        S.ball.vz = 0;
      }
    }

    // Attrito orizzontale
    S.ball.vx *= 0.985;
    S.ball.vy *= 0.985;

    // Sponde laterali con rimbalzo su rampe inclinate
    if (S.ball.x < 36) {
      S.ball.x = 36;
      S.ball.vx = -S.ball.vx * 0.85;
      S.ball.vz += 1.2; // rampa che solleva
      snd("stone");
    } else if (S.ball.x > W - 36) {
      S.ball.x = W - 36;
      S.ball.vx = -S.ball.vx * 0.85;
      S.ball.vz += 1.2;
      snd("stone");
    }

    // Bordo superiore e inferiore campo
    if (S.ball.y < 105) {
      S.ball.y = 105;
      S.ball.vy = -S.ball.vy * 0.85;
      snd("stone");
    } else if (S.ball.y > H - 15) {
      S.ball.y = H - 15;
      S.ball.vy = -S.ball.vy * 0.85;
      snd("stone");
    }

    // Trail particellare
    for (let i = S.ball.trail.length - 1; i >= 0; i--) {
      const p = S.ball.trail[i];
      p.life--;
      p.r *= 0.9;
      if (p.life <= 0) S.ball.trail.splice(i, 1);
    }
  }

  function triggerTrap() {
    S.groundBounces = 0;
    S.trapAlert = 45;
    S.quakex = 8;
    S.quakey = 5;
    snd("trap");
    // Folata di sabbia che sposta i giocatori e rallenta chi non è in volo
    [S.pA1, S.pA2, S.pB1, S.pB2].forEach((p) => {
      p.vx += (Math.random() - 0.5) * 6;
      p.vy += (Math.random() - 0.5) * 4;
    });
  }

  function checkRingGoal() {
    // Verifica attraversamento anello
    // L'anello Sud (B) premia la squadra A
    const bDistB = Math.hypot(S.ball.x - S.ringB.x, (S.ball.y - S.ball.z) - S.ringB.y);
    if (bDistB < S.ringB.r && S.ball.vz < 1 && S.phase === "play") {
      S.scoreA++;
      S.phase = "goal";
      S.phaseTimer = 75;
      S.banner = "GOL NELL'ANELLO SACRO!";
      S.subBanner = `Punto rituale per il Campione! (${S.scoreA} - ${S.scoreB})`;
      S.quakex = 10;
      S.quakey = 6;
      snd("ring");
      return;
    }

    // L'anello Nord (A) premia la squadra B
    const bDistA = Math.hypot(S.ball.x - S.ringA.x, (S.ball.y - S.ball.z) - S.ringA.y);
    if (bDistA < S.ringA.r && S.ball.vz < 1 && S.phase === "play") {
      S.scoreB++;
      S.phase = "goal";
      S.phaseTimer = 75;
      S.banner = "GOL DEI GUARDIANI!";
      S.subBanner = `Il tempio acclama i sacerdoti! (${S.scoreA} - ${S.scoreB})`;
      S.quakex = 10;
      S.quakey = 6;
      snd("drum");
      return;
    }
  }

  // --- RENDERING CANVAS ---
  function render(ctx) {
    ctx.save();
    ctx.translate(S.quakex, S.quakey);

    // Sfondo: parete cerimoniale maya con bassorilievi e bracieri
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, W, H);

    // Gradoni e murature maya in pietra dorata/arenaria
    const stoneGrad = ctx.createLinearGradient(0, 0, 0, 105);
    stoneGrad.addColorStop(0, "#292524");
    stoneGrad.addColorStop(0.5, "#44403c");
    stoneGrad.addColorStop(1, "#78350f");
    ctx.fillStyle = stoneGrad;
    ctx.fillRect(0, 0, W, 105);

    // Dettaglio bassorilievo e colonne a serpente piumato
    ctx.strokeStyle = "rgba(245,158,11,.25)";
    ctx.lineWidth = 1.5;
    for (let x = 20; x < W; x += 40) {
      ctx.strokeRect(x, 15, 30, 70);
      ctx.beginPath();
      ctx.arc(x + 15, 35, 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Bracieri ardenti in quota
    [70, W / 2, W - 70].forEach((bx, idx) => {
      ctx.fillStyle = "#78350f";
      ctx.fillRect(bx - 12, 75, 24, 18);
      // Fiamme animate
      const flW = Math.sin(S.frame * 0.15 + idx) * 3;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(bx + flW, 72, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(bx + flW * 0.6, 70, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Anelli verticali di pietra scolpita (le mete sacre)
    [S.ringA, S.ringB].forEach((ring, idx) => {
      ctx.save();
      ctx.translate(ring.x, ring.y);
      // Supporto d'ancoraggio alla parete
      ctx.fillStyle = "#292524";
      ctx.fillRect(idx === 0 ? -12 : 2, -6, 10, 12);
      // Anello esterno in pietra
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.stroke();
      // Foro centrale aperto
      ctx.fillStyle = "rgba(15,23,42,.85)";
      ctx.beginPath();
      ctx.arc(0, 0, ring.r - 4, 0, Math.PI * 2);
      ctx.fill();
      // Glifo maya dorato
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-4, -4, 8, 8);
      ctx.restore();
    });

    // Pavimento del campo in terra battuta e lastre rosse sacre
    const floorGrad = ctx.createLinearGradient(0, 105, 0, H);
    floorGrad.addColorStop(0, "#92400e");
    floorGrad.addColorStop(0.5, "#78350f");
    floorGrad.addColorStop(1, "#451a03");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, 105, W, H - 105);

    // Linee rituali in calce e gradinate inclinate ai lati
    ctx.strokeStyle = "rgba(254,243,199,.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 108, W - 72, H - 124);
    // Linea centrale
    ctx.beginPath();
    ctx.moveTo(W / 2, 108);
    ctx.lineTo(W / 2, H - 16);
    ctx.stroke();
    // Cerchio del sole sacro
    ctx.beginPath();
    ctx.arc(W / 2, 150, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Rampe inclinate laterali (spioventi di rimbalzo)
    ctx.fillStyle = "rgba(41,37,36,.75)";
    ctx.beginPath();
    ctx.moveTo(0, 105); ctx.lineTo(36, 120); ctx.lineTo(36, H); ctx.lineTo(0, H);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W, 105); ctx.lineTo(W - 36, 120); ctx.lineTo(W - 36, H); ctx.lineTo(W, H);
    ctx.fill();

    // Allerta dardi/trappola
    if (S.trapAlert > 0) {
      ctx.fillStyle = `rgba(239,68,68,${(S.trapAlert / 45) * 0.35})`;
      ctx.fillRect(0, 0, W, H);
      // Dardi sibilanti
      ctx.fillStyle = "#fef08a";
      for (let d = 0; d < 8; d++) {
        const dx = (S.frame * 8 + d * 45) % W;
        ctx.fillRect(dx, 120 + d * 8, 12, 2);
      }
    }

    // Disegno ombre
    [S.pA1, S.pA2, S.pB1, S.pB2].forEach((p) => {
      ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 4, p.r, p.r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    // Ombra palla
    const ballShadowR = Math.max(2, S.ball.r - S.ball.z * 0.15);
    ctx.fillStyle = "rgba(0,0,0,.4)";
    ctx.beginPath();
    ctx.ellipse(S.ball.x, S.ball.y + 4, ballShadowR * 1.2, ballShadowR * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Disegno particelle trail
    S.ball.trail.forEach((t) => {
      ctx.fillStyle = t.col;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Disegno Giocatori
    drawPlayer(ctx, S.pA1, "#38bdf8", "#0284c7");
    drawPlayer(ctx, S.pA2, "#06b6d4", "#0891b2");
    drawPlayer(ctx, S.pB1, "#ef4444", "#b91c1c");
    drawPlayer(ctx, S.pB2, "#f97316", "#c2410c");

    // Disegno Palla di caucciù in quota
    const bScreenY = S.ball.y - S.ball.z;
    ctx.save();
    ctx.translate(S.ball.x, bScreenY);
    // Palla gommosa marrone scuro con nervature
    ctx.fillStyle = "#27272a";
    ctx.beginPath();
    ctx.arc(0, 0, S.ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#a1a1aa";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Lucentezza gomma
    ctx.fillStyle = "rgba(255,255,255,.45)";
    ctx.beginPath();
    ctx.arc(-2, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // HUD Superiore
    ctx.fillStyle = "rgba(15,23,42,.85)";
    ctx.fillRect(8, 6, W - 16, 22);
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 6, W - 16, 22);

    ctx.fillStyle = "#fef3c7";
    ctx.font = "bold 10px monospace, system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`ARCHEOLOGI ${S.scoreA} - ${S.scoreB} GUARDIANI`, 16, 21);

    ctx.textAlign = "right";
    ctx.fillStyle = S.timeSec <= 10 ? "#ef4444" : "#fef3c7";
    ctx.fillText(`⏱️ ${S.timeSec}s`, W - 16, 21);

    // Barra Energia Solare
    ctx.fillStyle = "rgba(0,0,0,.5)";
    ctx.fillRect(16, 32, 80, 5);
    ctx.fillStyle = S.sunPower >= 60 ? "#fbbf24" : "#eab308";
    ctx.fillRect(16, 32, (S.sunPower / 100) * 80, 5);

    // Banner centrale
    if (S.banner) {
      ctx.fillStyle = "rgba(15,23,42,.92)";
      ctx.fillRect(20, H / 2 - 28, W - 40, 54);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, H / 2 - 28, W - 40, 54);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(S.banner, W / 2, H / 2 - 6);

      ctx.fillStyle = "#fef3c7";
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText(S.subBanner, W / 2, H / 2 + 14);
    }

    ctx.restore();
  }

  function drawPlayer(ctx, p, colBody, colHead) {
    ctx.save();
    ctx.translate(p.x, p.y);

    // Corpo
    ctx.fillStyle = colBody;
    ctx.beginPath();
    ctx.arc(0, -4, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Fascia o copricapo piumato
    ctx.fillStyle = colHead;
    ctx.fillRect(-p.r + 2, -10, p.r * 2 - 4, 4);

    // Lettera identificativa
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText(p.name[0], 0, -2);

    // Etichetta nome sopra il capo (non copre la testa)
    ctx.fillStyle = "rgba(15,23,42,.8)";
    ctx.fillRect(-22, -24, 44, 11);
    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 7px system-ui";
    ctx.fillText(p.name, 0, -15);

    ctx.restore();
  }

  // --- MONTAGGIO DOM E CONTROLLI ---
  let rootEl = null, canvasEl = null;

  function mountUI() {
    unmountUI();
    rootEl = document.createElement("div");
    rootEl.id = "pok-ta-pok-overlay";
    rootEl.style.cssText = "position:fixed;inset:0;z-index:99999;background:#0c0a09;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;font-family:system-ui,sans-serif;-webkit-user-select:none;user-select:none;";

    rootEl.innerHTML = `
      <div style="width:100%;max-width:480px;display:flex;flex-direction:column;align-items:center;padding:4px;">
        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:2px 8px;color:#fef3c7;font-size:12px;font-weight:bold;">
          <span>☀️ L'Anello di Pietra · Pok-ta-pok</span>
          <button id="anello-btn-close" style="background:#dc2626;color:#fff;border:none;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">Esci</button>
        </div>
        <div style="position:relative;width:100%;aspect-ratio:360/210;max-height:60vh;background:#000;border:2px solid #ca8a04;border-radius:6px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,.7);">
          <canvas id="anello-canvas" width="${W}" height="${H}" style="width:100%;height:auto;flex:none;display:block;"></canvas>
        </div>
        <!-- Barra comandi mobile -->
        <div style="width:100%;display:flex;gap:6px;margin-top:6px;justify-content:center;">
          <button id="anello-act-hip" style="flex:1;background:#78350f;color:#fef3c7;border:1px solid #ca8a04;padding:10px 4px;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">💥 Anca (Z)</button>
          <button id="anello-act-knee" style="flex:1;background:#0284c7;color:#f0f9ff;border:1px solid #38bdf8;padding:10px 4px;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">⚡ Volée (X)</button>
          <button id="anello-act-roar" style="flex:1;background:#d97706;color:#fef3c7;border:1px solid #fef08a;padding:10px 4px;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">☀️ Sole (C)</button>
        </div>
      </div>
    `;

    document.body.appendChild(rootEl);
    canvasEl = rootEl.querySelector("#anello-canvas");

    rootEl.querySelector("#anello-btn-close").onclick = () => finishMatch(false);
    rootEl.querySelector("#anello-act-hip").onclick = () => { S.keys.hip = true; };
    rootEl.querySelector("#anello-act-knee").onclick = () => { S.keys.knee = true; };
    rootEl.querySelector("#anello-act-roar").onclick = () => { S.keys.roar = true; };
  }

  function unmountUI() {
    const el = document.getElementById("pok-ta-pok-overlay");
    if (el && el.parentNode) el.parentNode.removeChild(el);
    rootEl = null;
    canvasEl = null;
  }

  function handleKeyDown(e) {
    if (!S.active) return;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") S.keys.u = true;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") S.keys.d = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") S.keys.l = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") S.keys.r = true;
    if (e.key === "z" || e.key === "Z" || e.key === " ") S.keys.hip = true;
    if (e.key === "x" || e.key === "X") S.keys.knee = true;
    if (e.key === "c" || e.key === "C") S.keys.roar = true;
  }

  function handleKeyUp(e) {
    if (!S.active) return;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") S.keys.u = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") S.keys.d = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") S.keys.l = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") S.keys.r = false;
  }

  function handleTouch(e) {
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const t = e.touches[0] || e.changedTouches[0];
    if (!t) return;
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    S.touchTarget = {
      x: (t.clientX - rect.left) * scaleX,
      y: (t.clientY - rect.top) * scaleY
    };
  }

  function bindEvents() {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    if (canvasEl) {
      canvasEl.addEventListener("touchstart", (e) => { e.preventDefault(); handleTouch(e); }, { passive: false });
      canvasEl.addEventListener("touchmove", (e) => { e.preventDefault(); handleTouch(e); }, { passive: false });
      canvasEl.addEventListener("touchend", () => { S.touchTarget = null; });
      canvasEl.addEventListener("mousedown", (e) => {
        const rect = canvasEl.getBoundingClientRect();
        S.touchTarget = {
          x: (e.clientX - rect.left) * (W / rect.width),
          y: (e.clientY - rect.top) * (H / rect.height)
        };
      });
      window.addEventListener("mouseup", () => { S.touchTarget = null; });
    }
  }

  function unbindEvents() {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  }

  function loop() {
    if (!S.active) return;
    for (let k = S.opts.fast ? 24 : 1; k > 0 && S.active; k--) update();
    if (canvasEl) {
      const ctx = canvasEl.getContext("2d");
      if (ctx) render(ctx);
    }
    S.raf = requestAnimationFrame(loop);
  }

  // API PUBBLICA
  window.__anello = {
    start: startMatch,
    state: {
      get active() { return S.active; },
      get raw() { return S; },
      get scoreA() { return S.scoreA; },
      get scoreB() { return S.scoreB; },
      finish: function (a, b) {
        if (a !== undefined) S.scoreA = a;
        if (b !== undefined) S.scoreB = b;
        finishMatch(S.scoreA > S.scoreB);
      }
    }
  };
})();
