// js/corrente.js - «CORRENTE & RINVIO» · Motore di partita originale di «La Carovana del Fiume d'Argento»
// Calcio fluviale d'avventura 2v2 su chiatte d'ormeggio, pontili galleggianti e piattaforme ad asse:
//  - Il Flusso del Fiume: la corrente sotto il pontile trascina il pallone con una spinta vettoriale continua
//  - Il Beccheggio delle Chiatte: quando i giocatori scattano, l'inclinazione dell'asse altera il rimbalzo
//  - Rinvio d'Argine: sponde con gomene elastiche e bitte nautiche per carambole strategiche
//  - Manovra del Battelliere:
//      * Tocco d'Argine (Z / Tap basso): rasoterra controllato che sfrutta la corrente
//      * Rinvio a Vortice (X / Tap alto): parabola liftata che contrasta la spinta dell'acqua
//      * Spinta d'Onda (C / Doppio Tap): scatto con onda di risacca per disorientare il marcatore
(function () {
  "use strict";
  if (window.__corrente) return;

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
      if (type === "water") {
        // Sciabordio d'acqua fluviale
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.2);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      } else if (type === "wood") {
        // Tocco sordo sulle assi di quercia umida
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      } else if (type === "rope") {
        // Carambola elastica sulle gomene d'argine
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (type === "whistle") {
        // Fischio a vapore del battello fluviale
        [523, 659, 784].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, t + idx * 0.05);
          gain.gain.setValueAtTime(0.15, t + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + idx * 0.05);
          osc.stop(t + idx * 0.05 + 0.38);
        });
      } else if (type === "goal") {
        // Campana del porto franco e sirena
        [440, 554, 659, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.28, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.65);
        });
      }
    } catch (e) {}
  }

  // Stato globale della partita
  const S = {
    active: false,
    opts: {},
    time: 60,
    scoreA: 0,
    scoreB: 0,
    frame: 0,
    currentFlow: 0.18, // spinta della corrente verso destra/valle
    swayAngle: 0,      // beccheggio dell'asse del pontile
    swayVel: 0,
    ball: { x: W / 2, y: H / 2, vx: 0, vy: 0, z: 0, vz: 0, r: 5.5, lastKick: null },
    p1: { x: W / 4, y: H / 2, vx: 0, vy: 0, r: 8, speed: 2.1, energy: 100, team: "A", name: "Campione", color: "#38bdf8", role: "captain" },
    p2: { x: W / 5, y: H / 3, vx: 0, vy: 0, r: 8, speed: 1.85, energy: 100, team: "A", name: "Roderico", color: "#0284c7", role: "mate" },
    e1: { x: (W * 3) / 4, y: H / 2, vx: 0, vy: 0, r: 8, speed: 1.95, energy: 100, team: "B", name: "Malacarne", color: "#dc2626", role: "guard" },
    e2: { x: (W * 4) / 5, y: (H * 2) / 3, vx: 0, vy: 0, r: 8, speed: 1.8, energy: 100, team: "B", name: "Doganiere", color: "#b91c1c", role: "guard" },
    keys: { u: false, d: false, l: false, r: false, z: false, x: false, c: false },
    touchTarget: null,
    overlayEl: null,
    goalAnim: 0,
    goalText: "",
    ripples: []
  };

  let canvasEl = null;
  let rafId = null;

  function resetPositions() {
    S.ball.x = W / 2;
    S.ball.y = H / 2;
    S.ball.vx = 0;
    S.ball.vy = 0;
    S.ball.z = 0;
    S.ball.vz = 0;
    S.ball.lastKick = null;

    S.p1.x = W / 4;
    S.p1.y = H / 2;
    S.p1.vx = 0; S.p1.vy = 0;

    S.p2.x = W / 5;
    S.p2.y = H / 3;
    S.p2.vx = 0; S.p2.vy = 0;

    S.e1.x = (W * 3) / 4;
    S.e1.y = H / 2;
    S.e1.vx = 0; S.e1.vy = 0;

    S.e2.x = (W * 4) / 5;
    S.e2.y = (H * 2) / 3;
    S.e2.vx = 0; S.e2.vy = 0;

    S.swayAngle = 0;
    S.swayVel = 0;
  }

  function addRipple(x, y, power) {
    if (S.ripples.length > 20) S.ripples.shift();
    S.ripples.push({ x, y, r: 4, maxR: power ? 22 : 14, alpha: 0.8 });
  }

  function update() {
    if (!S.active) return;
    S.frame++;

    // Timer partita
    if (S.frame % 60 === 0 && S.time > 0 && S.goalAnim === 0) {
      S.time--;
      if (S.time <= 0) {
        finishMatch(S.scoreA > S.scoreB);
        return;
      }
    }

    if (S.goalAnim > 0) {
      S.goalAnim--;
      if (S.goalAnim === 0) resetPositions();
      return;
    }

    // a metà partita la marea gira: la corrente cambia verso
    S.currentFlow = S.time > 25 ? 0.18 : -0.18;

    // Beccheggio del pontile
    S.swayAngle += S.swayVel;
    S.swayVel += -S.swayAngle * 0.05 - S.swayVel * 0.08;

    // Aggiorna onde d'acqua
    for (let i = S.ripples.length - 1; i >= 0; i--) {
      const rip = S.ripples[i];
      rip.r += 0.7;
      rip.alpha -= 0.03;
      if (rip.alpha <= 0) S.ripples.splice(i, 1);
    }

    // pilota automatico (prove): il Campione insegue la palla e la spinge verso la porta
    if (S.opts.auto) {
      const gx = W - 26, gy = H / 2, ux = gx - S.ball.x, uy = gy - S.ball.y, ul = Math.hypot(ux, uy) || 1;
      S.touchTarget = { x: S.ball.x - (ux / ul) * 10, y: S.ball.y - (uy / ul) * 10 };
      const near = Math.hypot(S.ball.x - S.p1.x, S.ball.y - S.p1.y) < 16;
      S.keys.z = near && S.frame % 40 < 20; S.keys.x = near && S.frame % 40 >= 20;
    }
    // Input Campione (P1)
    let moveX = 0, moveY = 0;
    if (S.keys.l) moveX -= 1;
    if (S.keys.r) moveX += 1;
    if (S.keys.u) moveY -= 1;
    if (S.keys.d) moveY += 1;

    // Supporto Touch / Drag
    if (S.touchTarget) {
      const dx = S.touchTarget.x - S.p1.x;
      const dy = S.touchTarget.y - S.p1.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        moveX = dx / dist;
        moveY = dy / dist;
      }
    }

    // Normalizzazione movimento
    const mag = Math.hypot(moveX, moveY);
    if (mag > 0) {
      S.p1.vx = (moveX / mag) * S.p1.speed;
      S.p1.vy = (moveY / mag) * S.p1.speed;
      if (S.frame % 15 === 0) addRipple(S.p1.x, S.p1.y, false);
    } else {
      S.p1.vx *= 0.65;
      S.p1.vy *= 0.65;
    }

    S.p1.x += S.p1.vx;
    S.p1.y += S.p1.vy;

    // Limiti del pontile d'ormeggio
    const minX = 26, maxX = W - 26, minY = 24, maxY = H - 24;
    S.p1.x = Math.max(minX, Math.min(maxX, S.p1.x));
    S.p1.y = Math.max(minY, Math.min(maxY, S.p1.y));

    // IA Compagno (P2)
    const targetP2X = S.ball.x < W / 2 ? S.ball.x - 25 : W / 3;
    const targetP2Y = S.ball.y > H / 2 ? S.ball.y - 30 : S.ball.y + 30;
    S.p2.vx += (targetP2X - S.p2.x) * 0.04;
    S.p2.vy += (targetP2Y - S.p2.y) * 0.04;
    S.p2.vx = Math.max(-S.p2.speed, Math.min(S.p2.speed, S.p2.vx * 0.9));
    S.p2.vy = Math.max(-S.p2.speed, Math.min(S.p2.speed, S.p2.vy * 0.9));
    S.p2.x += S.p2.vx; S.p2.y += S.p2.vy;
    S.p2.x = Math.max(minX, Math.min(maxX, S.p2.x));
    S.p2.y = Math.max(minY, Math.min(maxY, S.p2.y));

    // IA Avversari (E1 ed E2)
    const defE1X = S.ball.x > W / 2 ? S.ball.x : (W * 3) / 4;
    const defE1Y = S.ball.y;
    S.e1.vx += (defE1X - S.e1.x) * 0.045;
    S.e1.vy += (defE1Y - S.e1.y) * 0.045;
    S.e1.vx = Math.max(-S.e1.speed, Math.min(S.e1.speed, S.e1.vx * 0.9));
    S.e1.vy = Math.max(-S.e1.speed, Math.min(S.e1.speed, S.e1.vy * 0.9));
    S.e1.x += S.e1.vx; S.e1.y += S.e1.vy;
    S.e1.x = Math.max(minX, Math.min(maxX, S.e1.x));
    S.e1.y = Math.max(minY, Math.min(maxY, S.e1.y));

    const defE2X = S.ball.x > W / 3 ? (W * 4) / 5 : (W * 2) / 3;
    const defE2Y = H - S.ball.y;
    S.e2.vx += (defE2X - S.e2.x) * 0.035;
    S.e2.vy += (defE2Y - S.e2.y) * 0.035;
    S.e2.vx = Math.max(-S.e2.speed, Math.min(S.e2.speed, S.e2.vx * 0.9));
    S.e2.vy = Math.max(-S.e2.speed, Math.min(S.e2.speed, S.e2.vy * 0.9));
    S.e2.x += S.e2.vx; S.e2.y += S.e2.vy;
    S.e2.x = Math.max(minX, Math.min(maxX, S.e2.x));
    S.e2.y = Math.max(minY, Math.min(maxY, S.e2.y));

    // Fisica Pallone con Corrente Fluviale
    // Spinta costante della corrente laterale
    S.ball.vx += S.currentFlow * (1 + Math.sin(S.frame * 0.05) * 0.2);
    // Beccheggio pontile che devia l'asse verticale
    S.ball.vy += S.swayAngle * 0.35;

    // Attrito legno umido
    S.ball.vx *= 0.975;
    S.ball.vy *= 0.975;

    if (S.ball.z > 0) {
      S.ball.vz -= 0.15; // gravità
      S.ball.z += S.ball.vz;
      if (S.ball.z <= 0) {
        S.ball.z = 0;
        S.ball.vz = -S.ball.vz * 0.6; // rimbalzo
        snd("wood");
        addRipple(S.ball.x, S.ball.y, true);
      }
    }

    S.ball.x += S.ball.vx;
    S.ball.y += S.ball.vy;

    // Contrasti e tocchi P1
    handlePlayerBall(S.p1, true);
    handlePlayerBall(S.p2, false);
    handlePlayerBall(S.e1, false);
    handlePlayerBall(S.e2, false);

    // Rimbalzi su sponde e gomene d'argine
    if (S.ball.y < minY) {
      S.ball.y = minY;
      S.ball.vy = Math.abs(S.ball.vy) * 0.85;
      snd("rope");
      addRipple(S.ball.x, S.ball.y, false);
    }
    if (S.ball.y > maxY) {
      S.ball.y = maxY;
      S.ball.vy = -Math.abs(S.ball.vy) * 0.85;
      snd("rope");
      addRipple(S.ball.x, S.ball.y, false);
    }

    // Porte d'argine (Gol)
    const goalY1 = H / 2 - 26, goalY2 = H / 2 + 26;
    if (S.ball.x < minX) {
      if (S.ball.y >= goalY1 && S.ball.y <= goalY2) {
        // Gol Squadra B (Dogana)
        S.scoreB++;
        snd("goal");
        S.goalAnim = 75;
        S.goalText = "RETE DELLA GUARDIA DOGANALE!";
      } else {
        S.ball.x = minX;
        S.ball.vx = Math.abs(S.ball.vx) * 0.9;
        snd("wood");
      }
    } else if (S.ball.x > maxX) {
      if (S.ball.y >= goalY1 && S.ball.y <= goalY2) {
        // Gol Squadra A (Carovana)
        S.scoreA++;
        snd("goal");
        S.goalAnim = 75;
        S.goalText = "GOL DELLA CAROVANA FLUVIALE!";
      } else {
        S.ball.x = maxX;
        S.ball.vx = -Math.abs(S.ball.vx) * 0.9;
        snd("wood");
      }
    }
  }

  function handlePlayerBall(p, isHero) {
    const dx = S.ball.x - p.x;
    const dy = S.ball.y - p.y;
    const dist = Math.hypot(dx, dy);

    if (dist < p.r + S.ball.r + 2 && S.ball.z < 8) {
      const angle = Math.atan2(dy, dx);
      if (isHero) {
        // Tiro / Tocco Campione
        if (S.keys.x) {
          // Rinvio a Vortice parabolico
          S.ball.vx = Math.cos(angle) * 5.2 + 2.0;
          S.ball.vy = Math.sin(angle) * 4.2;
          S.ball.vz = 3.2;
          S.ball.z = 2;
          S.swayVel += 0.04;
          snd("water");
        } else if (S.keys.z) {
          // Tocco d'argine radente
          S.ball.vx = Math.cos(angle) * 3.8 + 1.2;
          S.ball.vy = Math.sin(angle) * 3.0;
          snd("wood");
        } else {
          // Trascinamento naturale
          S.ball.vx = p.vx * 1.3 + Math.cos(angle) * 1.8;
          S.ball.vy = p.vy * 1.3 + Math.sin(angle) * 1.8;
        }
      } else {
        // Tocco IA
        const dirX = p.team === "A" ? 1 : -1;
        S.ball.vx = dirX * 3.4 + (Math.random() - 0.5) * 1.2;
        S.ball.vy = (Math.random() - 0.5) * 2.8;
        snd("wood");
      }
      S.ball.lastKick = p.team;
      addRipple(S.ball.x, S.ball.y, true);
    }
  }

  function render(ctx) {
    // Sfondo: Acqua del Fiume Argenteo con increspature animate
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0369a1");
    grad.addColorStop(0.5, "#0284c7");
    grad.addColorStop(1, "#075985");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Onde e riflessi di corrente
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1.2;
    for (let y = 10; y < H; y += 18) {
      ctx.beginPath();
      const waveOffset = Math.sin(S.frame * 0.06 + y * 0.1) * 6;
      ctx.moveTo(0, y + waveOffset);
      ctx.bezierCurveTo(W * 0.33, y - 4 + waveOffset, W * 0.66, y + 4 + waveOffset, W, y + waveOffset);
      ctx.stroke();
    }

    // Cerchi di risacca (Ripples)
    for (const rip of S.ripples) {
      ctx.strokeStyle = `rgba(224, 242, 254, ${rip.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Il Pontile Galleggiante Centrale (Assi di legno di quercia)
    const minX = 26, maxX = W - 26, minY = 24, maxY = H - 24;
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(S.swayAngle * 0.05);
    ctx.translate(-W / 2, -H / 2);

    // Ombra del pontile
    ctx.fillStyle = "rgba(12, 74, 110, 0.45)";
    ctx.fillRect(minX - 3, minY - 3, (maxX - minX) + 6, (maxY - minY) + 6);

    // Assi di legno
    ctx.fillStyle = "#78350f";
    ctx.fillRect(minX, minY, maxX - minX, maxY - minY);

    // Dettaglio scanalature delle assi
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 1;
    for (let x = minX + 16; x < maxX; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
      ctx.stroke();
    }

    // Linee di campo (gesso azzurro fluviale)
    ctx.strokeStyle = "rgba(186, 230, 253, 0.65)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(minX + 4, minY + 4, (maxX - minX) - 8, (maxY - minY) - 8);
    // Linea di metà campo
    ctx.beginPath();
    ctx.moveTo(W / 2, minY + 4);
    ctx.lineTo(W / 2, maxY - 4);
    ctx.stroke();
    // Cerchio centrale
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 28, 0, Math.PI * 2);
    ctx.stroke();

    // Gomene e bitte nautiche sulle sponde
    ctx.fillStyle = "#fef08a";
    [minY, maxY].forEach((yPos) => {
      for (let xPos = minX + 20; xPos < maxX; xPos += 50) {
        ctx.beginPath();
        ctx.arc(xPos, yPos, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Porte d'argine
    const goalY1 = H / 2 - 26, goalH = 52;
    // Porta sinistra (Carovana)
    ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
    ctx.fillRect(minX - 10, goalY1, 10, goalH);
    ctx.strokeStyle = "#38bdf8";
    ctx.strokeRect(minX - 10, goalY1, 10, goalH);

    // Porta destra (Dogana)
    ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
    ctx.fillRect(maxX, goalY1, 10, goalH);
    ctx.strokeStyle = "#ef4444";
    ctx.strokeRect(maxX, goalY1, 10, goalH);

    // Disegno Giocatori
    [S.p2, S.e2, S.e1, S.p1].forEach((p) => {
      // Ombra
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 7, p.r, p.r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Etichetta nome
      ctx.font = "9px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(p.name, p.x, p.y - 10);
    });

    // Pallone Fluviale
    const bx = S.ball.x;
    const by = S.ball.y - S.ball.z;
    // Ombra pallone
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(S.ball.x, S.ball.y, S.ball.r, S.ball.r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sfera cuoio impermeabilizzato e oro
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(bx, by, S.ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Dettaglio cuciture
    ctx.beginPath();
    ctx.arc(bx, by, S.ball.r * 0.5, 0, Math.PI);
    ctx.stroke();

    ctx.restore();

    // HUD: Punteggio e Tempo
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(W / 2 - 65, 4, 130, 20);
    ctx.strokeStyle = "#38bdf8";
    ctx.strokeRect(W / 2 - 65, 4, 130, 20);

    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "right";
    ctx.fillText(`CAROVANA ${S.scoreA}`, W / 2 - 12, 18);

    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "left";
    ctx.fillText(`${S.scoreB} DOGANA`, W / 2 + 12, 18);

    ctx.fillStyle = "#fef08a";
    ctx.textAlign = "center";
    ctx.fillText(`:${S.time}s`, W / 2, 18);

    // Animazione Gol
    if (S.goalAnim > 0) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(0, H / 2 - 24, W, 48);
      ctx.font = "bold 15px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "center";
      ctx.fillText(S.goalText, W / 2, H / 2 + 6);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") S.keys.l = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") S.keys.r = true;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") S.keys.u = true;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") S.keys.d = true;
    if (e.key === "z" || e.key === "Z") S.keys.z = true;
    if (e.key === "x" || e.key === "X") S.keys.x = true;
    if (e.key === "c" || e.key === "C") S.keys.c = true;
  }

  function handleKeyUp(e) {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") S.keys.l = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") S.keys.r = false;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") S.keys.u = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") S.keys.d = false;
    if (e.key === "z" || e.key === "Z") S.keys.z = false;
    if (e.key === "x" || e.key === "X") S.keys.x = false;
    if (e.key === "c" || e.key === "C") S.keys.c = false;
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

  function loop() {
    if (!S.active) return;
    for (let k = S.opts.fast ? 24 : 1; k > 0 && S.active; k--) update();
    if (canvasEl) {
      const ctx = canvasEl.getContext("2d");
      if (ctx) render(ctx);
    }
    rafId = requestAnimationFrame(loop);
  }

  function startMatch(opts) {
    S.opts = opts || {};
    S.active = true;
    S.scoreA = 0;
    S.scoreB = 0;
    S.time = 50;
    S.frame = 0;
    resetPositions();
    const bn = S.opts.bonus || {};
    S.p1.speed = 2.1 + 0.06 * (bn.te || 0); // Squadra dei Sogni (TEC)
    S.p2.speed = 1.85 + 0.05 * (bn.at || 0);
    S.e1.speed = 1.95 - 0.04 * (bn.df || 0);
    S.e2.speed = 1.8 - 0.04 * (bn.df || 0);
    const mt = S.opts.mate || (S.opts.mates && S.opts.mates[0]); S.p2.name = (mt && (mt.name || mt)) || "Roderico";

    // Creazione Container DOM a tutto schermo
    const root = document.createElement("div");
    root.id = "corrente-match-container";
    root.style.cssText = "position:fixed;inset:0;z-index:99999;background:#082f49;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,sans-serif;color:#f8fafc;";

    root.innerHTML = `
      <div style="width:100%;max-width:480px;display:flex;flex-direction:column;align-items:center;padding:8px;">
        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-weight:bold;color:#38bdf8;font-size:14px;">🌊 CORRENTE &amp; RINVIO</span>
          <button id="corrente-quit-btn" style="background:#ef4444;color:#fff;border:none;border-radius:4px;padding:3px 8px;font-size:12px;cursor:pointer;">Esci</button>
        </div>
        <canvas id="corrente-canvas" width="${W}" height="${H}" style="width:100%;height:auto;flex:none;border-radius:6px;border:2px solid #0284c7;background:#0369a1;touch-action:none;"></canvas>
        <div style="width:100%;display:flex;justify-content:space-around;margin-top:10px;">
          <button id="corrente-pass-btn" style="background:#0284c7;color:#fff;border:none;border-radius:20px;padding:10px 18px;font-size:13px;font-weight:bold;touch-action:manipulation;">Argine (Z)</button>
          <button id="corrente-shot-btn" style="background:#f59e0b;color:#1e293b;border:none;border-radius:20px;padding:10px 18px;font-size:13px;font-weight:bold;touch-action:manipulation;">Vortice (X)</button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    S.overlayEl = root;
    canvasEl = root.querySelector("#corrente-canvas");

    root.querySelector("#corrente-quit-btn").onclick = () => finishMatch(false, true);

    const passBtn = root.querySelector("#corrente-pass-btn");
    passBtn.onpointerdown = () => { S.keys.z = true; };
    passBtn.onpointerup = () => { S.keys.z = false; };

    const shotBtn = root.querySelector("#corrente-shot-btn");
    shotBtn.onpointerdown = () => { S.keys.x = true; };
    shotBtn.onpointerup = () => { S.keys.x = false; };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

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

    snd("whistle");
    loop();
    return true;
  }

  function finishMatch(win, quit = false) {
    if (!S.active) return;
    S.active = false;
    if (rafId) cancelAnimationFrame(rafId);

    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);

    if (S.overlayEl && S.overlayEl.parentNode) {
      S.overlayEl.parentNode.removeChild(S.overlayEl);
      S.overlayEl = null;
    }

    if (window.__sagaCore && window.__sagaCore.endMatch) {
      window.__sagaCore.endMatch();
    }

    const res = {
      a: S.scoreA,
      b: S.scoreB,
      win: win && !quit,
      quit: !!quit,
      data: { flow: S.currentFlow, goals: S.scoreA }
    };

    if (S.opts.onDone) S.opts.onDone(res);
    else if (S.opts.done) S.opts.done(res);
  }

  // API PUBBLICA
  window.__corrente = {
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
