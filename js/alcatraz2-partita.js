// js/alcatraz2-partita.js - «CALCIO A PARETE · SUB-WATER REBOUND»
// Motore di partita per «Fuga da Alcatraz FC 2 · L'Ultimo Rientro».
// Partita 3v3 nella Cisterna Allagata:
//  - SPONDE ELASTICHE IN METALLO & PARATIE: rimbalzi a 45° con moltiplicatore di velocità.
//  - MATRICE IDRAULICA (waterLevel: 0 asciutto, 1 pelo d'acqua, 2 sommerso): modifica attrito e galleggiamento.
//  - VALVOLE A MURO: colpire con la palla le valvole attive scatena getti d'acqua che spazzano via i difensori.
//  - FASCIO SONAR / RIFLETTORE: cono di luce rotante che aumenta la pressione difensiva.
//  - MOSSE SPECIALI:
//      * Parabola Idraulica: rasoiata a pelo d'acqua a basso attrito.
//      * Sponda a Molla: carambola fulminea a 45° su parete.
//      * Barriera Cerbero / Muro di Spugna: blocco difensivo ad assorbimento d'onda.
(function () {
  "use strict";
  if (window.__alcatraz2Match) return;

  const W = 380, H = 220;

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
      if (type === "splash") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.16);
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      } else if (type === "valve") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.linearRampToValueAtTime(180, t + 0.25);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      } else if (type === "sonar") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(660, t + 0.2);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.24);
      } else if (type === "bounce") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(420, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.1);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.11);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (type === "kick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(170, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);
        gain.gain.setValueAtTime(0.32, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      } else if (type === "whistle") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(2100, t);
        osc.frequency.setValueAtTime(2500, t + 0.08);
        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      } else if (type === "goal") {
        [523, 659, 784, 1046].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t + i * 0.08);
          gain.gain.setValueAtTime(0.2, t + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.005, t + i * 0.08 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.5);
        });
      }
    } catch (_) {}
  }

  function start(opts) {
    opts = opts || {};
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;font-family:'Courier New', monospace;color:#f8fafc;user-select:none;";

    const header = document.createElement("div");
    header.style.cssText = "width:100%;max-width:760px;display:flex;justify-content:space-between;align-items:center;padding:8px 16px;background:#0f172a;border-bottom:2px solid #0284c7;";
    header.innerHTML = `
      <div>
        <span style="font-weight:900;color:#38bdf8;font-size:15px;">⛓️ CALCIO A PARETE · SUB-WATER REBOUND</span>
        <div style="font-size:11px;color:#94a3b8;">${opts.title || "Bastione Sommerso · Cisterna Spagnola"}</div>
      </div>
      <div style="display:flex;gap:12px;align-items:center;">
        <span id="alc2WaterBadge" style="background:#0c4a6e;color:#38bdf8;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;">🚰 ACQUA: LIVELLO 1</span>
        <span id="alc2Timer" style="font-size:18px;font-weight:bold;color:#facc15;">01:30</span>
      </div>
    `;
    wrap.appendChild(header);

    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    cv.style.cssText = "width:100%;max-width:760px;aspect-ratio:380/220;background:#020617;border:2px solid #1e293b;box-shadow:0 10px 25px rgba(0,0,0,0.7);cursor:crosshair;touch-action:none;";
    wrap.appendChild(cv);

    const controls = document.createElement("div");
    controls.style.cssText = "width:100%;max-width:760px;display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#0f172a;border-top:1px solid #1e293b;gap:8px;";
    controls.innerHTML = `
      <div style="display:flex;gap:8px;font-size:12px;">
        <button id="alc2MoveBtn" style="padding:6px 12px;background:#0284c7;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">Tiro Idraulico (Spazio)</button>
        <button id="alc2ValveBtn" style="padding:6px 12px;background:#0d9488;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">Aziona Valvola (V)</button>
      </div>
      <div style="font-size:12px;color:#cbd5e1;">
        Punteggio: <b style="color:#38bdf8;" id="alc2ScoreA">0</b> - <b style="color:#f59e0b;" id="alc2ScoreB">0</b>
      </div>
    `;
    wrap.appendChild(controls);

    document.body.appendChild(wrap);

    const ctx = cv.getContext("2d");
    const waterLevel = typeof opts.waterLevel === "number" ? opts.waterLevel : 1;

    const st = {
      opts,
      wrap,
      cv,
      ctx,
      running: true,
      a: 0,
      b: 0,
      timeLeft: 90,
      waterLevel,
      timerInterval: null,
      keys: {},
      sonarAngle: 0,
      waterRipple: 0,
      waterJets: [],
      particles: [],
      valves: [
        { x: W / 2, y: 12, dir: "down", active: true, timer: 0 },
        { x: W / 2, y: H - 12, dir: "up", active: true, timer: 0 }
      ],
      players: [
        // Squadra A (Campione e compagni)
        { team: "A", x: 60, y: H / 2, vx: 0, vy: 0, speed: 2.3, r: 7, name: "Campione", col: "#38bdf8", isHero: true },
        { team: "A", x: 120, y: H / 3, vx: 0, vy: 0, speed: 2.2, r: 6, name: "Rebecca", col: "#059669" },
        { team: "A", x: 120, y: (H * 2) / 3, vx: 0, vy: 0, speed: 2.0, r: 6, name: "Bruno", col: "#64748b" },
        // Squadra B (Cerbero / Guardie)
        { team: "B", x: W - 40, y: H / 2, vx: 0, vy: 0, speed: 2.1, r: 7, name: "Vane", col: "#f8fafc", isGK: true },
        { team: "B", x: W - 120, y: H / 3, vx: 0, vy: 0, speed: 2.1, r: 6, name: "Corazziere 1", col: "#ef4444" },
        { team: "B", x: W - 120, y: (H * 2) / 3, vx: 0, vy: 0, speed: 2.1, r: 6, name: "Corazziere 2", col: "#ef4444" }
      ],
      ball: {
        x: W / 2,
        y: H / 2,
        vx: (Math.random() > 0.5 ? 1 : -1) * 2.5,
        vy: (Math.random() - 0.5) * 2,
        r: 4.5
      }
    };

    const scoreAEl = wrap.querySelector("#alc2ScoreA");
    const scoreBEl = wrap.querySelector("#alc2ScoreB");
    const timerEl = wrap.querySelector("#alc2Timer");
    const waterEl = wrap.querySelector("#alc2WaterBadge");
    if (waterLevel === 0) waterEl.textContent = "🚰 ACQUA: ASCIUTTO";
    else if (waterLevel === 1) waterEl.textContent = "🚰 ACQUA: PELO D'ACQUA (RIMBALZI VELOCI)";
    else waterEl.textContent = "🚰 ACQUA: SOMMERSO (ONDE E SPINTA)";

    function updateScore() {
      scoreAEl.textContent = st.a;
      scoreBEl.textContent = st.b;
    }

    // Gestione input tastiera e touch
    function onKeyDown(e) {
      st.keys[e.key.toLowerCase()] = true;
      if (e.code === "Space") {
        e.preventDefault();
        specialShot();
      }
      if (e.key.toLowerCase() === "v") {
        triggerValveJet();
      }
    }
    function onKeyUp(e) {
      st.keys[e.key.toLowerCase()] = false;
    }

    function onPointerMove(e) {
      const rect = cv.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      const hero = st.players[0];
      const dx = mx - hero.x;
      const dy = my - hero.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 5) {
        hero.vx = (dx / dist) * hero.speed;
        hero.vy = (dy / dist) * hero.speed;
      }
    }

    function onPointerDown(e) {
      onPointerMove(e);
      specialShot();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerdown", onPointerDown);

    wrap.querySelector("#alc2MoveBtn").onclick = specialShot;
    wrap.querySelector("#alc2ValveBtn").onclick = triggerValveJet;

    function specialShot() {
      const hero = st.players[0];
      const b = st.ball;
      const dist = Math.hypot(hero.x - b.x, hero.y - b.y);
      if (dist < 22) {
        // Tiro Idraulico radente verso la porta avversaria (W - 20)
        const targetX = W - 20;
        const targetY = H / 2 + (Math.random() - 0.5) * 30;
        const dx = targetX - b.x;
        const dy = targetY - b.y;
        const len = Math.hypot(dx, dy);
        const spd = st.waterLevel === 1 ? 5.5 : 4.6;
        b.vx = (dx / len) * spd;
        b.vy = (dy / len) * spd;
        snd("splash");
        addSplashParticles(b.x, b.y, 14, "#38bdf8");
      }
    }

    function triggerValveJet() {
      // Attiva un getto d'acqua orizzontale/verticale dalla valvola
      st.valves.forEach((v) => {
        v.timer = 45;
        snd("valve");
        st.waterJets.push({
          x: v.x,
          y: v.y,
          dir: v.dir,
          timer: 35
        });
      });
    }

    function addSplashParticles(x, y, count, col) {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1 + Math.random() * 3;
        st.particles.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 18 + Math.random() * 10,
          col: col || "#38bdf8"
        });
      }
    }

    // Timer partita
    st.timerInterval = setInterval(() => {
      if (!st.running) return;
      st.timeLeft--;
      const m = Math.floor(st.timeLeft / 60);
      const s = st.timeLeft % 60;
      timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      if (st.timeLeft <= 0) {
        endGame(st);
      }
    }, 1000);

    // Loop fisico e grafico
    let reqId = null;
    function loop() {
      if (!st.running) return;
      update();
      render();
      reqId = requestAnimationFrame(loop);
    }
    reqId = requestAnimationFrame(loop);

    function update() {
      const hero = st.players[0];
      // Input tasti freccia / WASD
      let hx = 0, hy = 0;
      if (st.keys["arrowleft"] || st.keys["a"]) hx -= 1;
      if (st.keys["arrowright"] || st.keys["d"]) hx += 1;
      if (st.keys["arrowup"] || st.keys["w"]) hy -= 1;
      if (st.keys["arrowdown"] || st.keys["s"]) hy += 1;
      if (hx !== 0 || hy !== 0) {
        const len = Math.hypot(hx, hy);
        hero.vx = (hx / len) * hero.speed;
        hero.vy = (hy / len) * hero.speed;
      } else {
        hero.vx *= 0.88;
        hero.vy *= 0.88;
      }

      // Aggiorna giocatori
      st.players.forEach((p, idx) => {
        // AI per gli altri giocatori
        if (idx > 0) {
          updateAI(p, idx);
        }

        // Effetto getti d'acqua
        st.waterJets.forEach((j) => {
          if (Math.abs(p.x - j.x) < 25) {
            if (j.dir === "down" && p.y > j.y && p.y < j.y + 70) p.vy += 0.45;
            if (j.dir === "up" && p.y < j.y && p.y > j.y - 70) p.vy -= 0.45;
          }
        });

        p.x += p.vx;
        p.y += p.vy;

        // Limiti campo
        p.x = Math.max(16, Math.min(W - 16, p.x));
        p.y = Math.max(16, Math.min(H - 16, p.y));

        // Interazione giocatore - palla
        const b = st.ball;
        const dx = b.x - p.x;
        const dy = b.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < p.r + b.r) {
          const push = 2.4 + (p.team === "A" ? 0.3 : 0);
          const angle = Math.atan2(dy, dx);
          b.vx = Math.cos(angle) * push;
          b.vy = Math.sin(angle) * push;
          snd("kick");
          addSplashParticles(b.x, b.y, 4, p.col);
        }
      });

      // Aggiorna palla
      const b = st.ball;
      // Attrito basato su WaterLevel
      const friction = st.waterLevel === 1 ? 0.992 : st.waterLevel === 2 ? 0.978 : 0.985;
      b.vx *= friction;
      b.vy *= friction;
      b.x += b.vx;
      b.y += b.vy;

      // Rimbalzo su pareti orizzontali (Sponde a molla con rimbalzo a 45°)
      if (b.y - b.r < 14) {
        b.y = 14 + b.r;
        b.vy = -b.vy * 1.05; // accelerazione a molla
        snd("bounce");
        addSplashParticles(b.x, b.y, 6, "#64748b");
        checkValveHit(b.x, b.y);
      } else if (b.y + b.r > H - 14) {
        b.y = H - 14 - b.r;
        b.vy = -b.vy * 1.05;
        snd("bounce");
        addSplashParticles(b.x, b.y, 6, "#64748b");
        checkValveHit(b.x, b.y);
      }

      // Goal o rimbalzo su pareti verticali
      const goalY1 = H / 2 - 28;
      const goalY2 = H / 2 + 28;

      if (b.x - b.r < 18) {
        if (b.y >= goalY1 && b.y <= goalY2) {
          // Goal Cerbero (squadra B)
          st.b++;
          snd("goal");
          updateScore();
          resetBall(-1);
        } else {
          b.x = 18 + b.r;
          b.vx = -b.vx * 1.02;
          snd("bounce");
        }
      } else if (b.x + b.r > W - 18) {
        if (b.y >= goalY1 && b.y <= goalY2) {
          // Goal Detenuti (squadra A)
          st.a++;
          snd("goal");
          updateScore();
          resetBall(1);
        } else {
          b.x = W - 18 - b.r;
          b.vx = -b.vx * 1.02;
          snd("bounce");
        }
      }

      // Sonar / Riflettore rotante
      st.sonarAngle += 0.015;
      st.waterRipple = (st.waterRipple + 0.08) % (Math.PI * 2);

      // Particelle
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const pt = st.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) st.particles.splice(i, 1);
      }

      // Getti d'acqua
      for (let i = st.waterJets.length - 1; i >= 0; i--) {
        st.waterJets[i].timer--;
        if (st.waterJets[i].timer <= 0) st.waterJets.splice(i, 1);
      }
    }

    function checkValveHit(bx, by) {
      st.valves.forEach((v) => {
        if (Math.abs(bx - v.x) < 20) {
          triggerValveJet();
        }
      });
    }

    function updateAI(p, idx) {
      const b = st.ball;
      if (p.isGK) {
        // Portiere Vane: si muove sull'asse Y per proteggere la porta
        const targetY = Math.max(H / 2 - 22, Math.min(H / 2 + 22, b.y));
        p.vy = (targetY - p.y) * 0.12;
        p.vx = (W - 32 - p.x) * 0.08;
      } else if (p.team === "B") {
        // Difensori / attaccanti Cerbero
        const targetX = idx === 4 ? b.x + 25 : b.x + 40;
        const targetY = idx === 4 ? b.y : b.y + (idx === 4 ? -20 : 20);
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 8) {
          p.vx = (dx / dist) * p.speed;
          p.vy = (dy / dist) * p.speed;
        }
      } else {
        // Compagni di squadra A (Rebecca e Bruno)
        const targetX = idx === 1 ? Math.min(W - 80, b.x - 30) : Math.max(60, b.x - 50);
        const targetY = idx === 1 ? b.y - 25 : b.y + 25;
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 10) {
          p.vx = (dx / dist) * p.speed;
          p.vy = (dy / dist) * p.speed;
        }
      }
    }

    function resetBall(dir) {
      st.ball.x = W / 2;
      st.ball.y = H / 2;
      st.ball.vx = (dir || 1) * 2.2;
      st.ball.vy = (Math.random() - 0.5) * 2;
    }

    function render() {
      ctx.clearRect(0, 0, W, H);

      // Sfondo cisterna allagata
      const gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, "#082f49");
      gr.addColorStop(1, "#020617");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);

      // Sponde metalliche a 45 gradi
      ctx.fillStyle = "#334155";
      ctx.fillRect(0, 0, W, 14);
      ctx.fillRect(0, H - 14, W, 14);

      // Bulloni e molle sulle sponde
      ctx.fillStyle = "#94a3b8";
      for (let i = 20; i < W; i += 30) {
        ctx.fillRect(i, 4, 6, 6);
        ctx.fillRect(i, H - 10, 6, 6);
      }

      // Valvole a muro interattive
      st.valves.forEach((v) => {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(v.x, v.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(v.x, v.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Getti d'acqua attivi
      st.waterJets.forEach((j) => {
        ctx.save();
        ctx.fillStyle = "rgba(56,189,248,0.35)";
        if (j.dir === "down") {
          ctx.fillRect(j.x - 12, j.y, 24, 65);
        } else {
          ctx.fillRect(j.x - 12, j.y - 65, 24, 65);
        }
        ctx.restore();
      });

      // Linee del campo sotto il pelo d'acqua
      ctx.strokeStyle = "rgba(56,189,248,0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 16, W - 40, H - 32);
      ctx.beginPath();
      ctx.moveTo(W / 2, 16);
      ctx.lineTo(W / 2, H - 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 30, 0, Math.PI * 2);
      ctx.stroke();

      // Porte
      const goalY1 = H / 2 - 28;
      const goalH = 56;
      ctx.fillStyle = "rgba(56,189,248,0.2)";
      ctx.fillRect(4, goalY1, 16, goalH);
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(4, goalY1, 16, goalH);

      ctx.fillStyle = "rgba(239,68,68,0.2)";
      ctx.fillRect(W - 20, goalY1, 16, goalH);
      ctx.strokeStyle = "#ef4444";
      ctx.strokeRect(W - 20, goalY1, 16, goalH);

      // Riflettore / Sonar mobile
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const sx = W / 2 + Math.cos(st.sonarAngle) * 90;
      const sy = H / 2 + Math.sin(st.sonarAngle * 1.2) * 50;
      const sGr = ctx.createRadialGradient(sx, sy, 5, sx, sy, 45);
      sGr.addColorStop(0, "rgba(56,189,248,0.25)");
      sGr.addColorStop(1, "rgba(56,189,248,0)");
      ctx.fillStyle = sGr;
      ctx.beginPath();
      ctx.arc(sx, sy, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Giocatori
      st.players.forEach((p) => {
        ctx.save();
        // Ombra bagnata
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 4, p.r * 1.1, p.r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Corpo
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Lettera / Ruolo
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(p.name[0], p.x, p.y + 3);
        ctx.restore();
      });

      // Particelle d'acqua
      st.particles.forEach((pt) => {
        ctx.fillStyle = pt.col;
        ctx.fillRect(pt.x, pt.y, 2, 2);
      });

      // Pallone da calcio a parete
      const b = st.ball;
      ctx.save();
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Dettaglio cuciture cuoio
      ctx.fillStyle = "#0c4a6e";
      ctx.fillRect(b.x - 1, b.y - 1, 2, 2);
      ctx.restore();
    }

    function cleanup() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerdown", onPointerDown);
      if (reqId) cancelAnimationFrame(reqId);
      if (st.timerInterval) clearInterval(st.timerInterval);
    }
    st.cleanupEvents = cleanup;

    st.wrap = wrap;
    window.__alcatraz2Match.state = st;
  }

  function endGame(st) {
    if (!st.running) return;
    st.running = false;
    if (st.cleanupEvents) st.cleanupEvents();
    snd("whistle");

    const win = st.a > st.b;
    const ov = document.createElement("div");
    ov.style.cssText = "position:absolute;inset:0;background:rgba(2,6,23,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f8fafc;text-align:center;padding:24px;z-index:1000;";
    ov.innerHTML = `
      <div style="font-size:24px;font-weight:900;margin-bottom:8px;color:${win ? "#38bdf8" : "#f59e0b"}">
        ${win ? "🌊 VITTORIA NEL BASTIONE SOMMERSO! 🌊" : "🚨 TRIPLICE FISCHIO DI CERBERO"}
      </div>
      <div style="font-size:36px;font-weight:bold;margin-bottom:12px;color:#facc15;">
        ${st.a} - ${st.b}
      </div>
      <div style="font-size:13px;color:#94a3b8;max-width:380px;margin-bottom:20px;line-height:1.5;">
        ${win ? "Le carambole a 45 gradi e i getti idraulici hanno spezzato la marcatura dei Corazzieri! La via per la valvola maestra è libera." : "La difesa d'acciaio del Consorzio Cerbero ha retto l'urto, ma la squadra ha conquistato comunque la posizione strategica."}
      </div>
      <button type="button" id="alc2DoneBtn" style="padding:12px 28px;font-size:16px;font-weight:900;background:#0284c7;color:#fff;border:none;border-radius:8px;cursor:pointer;box-shadow:0 4px 14px rgba(2,132,199,0.5);">
        CONTINUA ▸
      </button>
    `;
    st.wrap.appendChild(ov);

    ov.querySelector("#alc2DoneBtn").onclick = () => {
      if (st.wrap && st.wrap.parentNode) st.wrap.parentNode.removeChild(st.wrap);
      if (window.__sagaCore && window.__sagaCore.endMatch) window.__sagaCore.endMatch();
      if (st.opts && st.opts.done) {
        st.opts.done({ a: st.a, b: st.b, win, quit: false });
      }
    };
  }

  window.__alcatraz2Match = {
    start,
    state: null
  };
})();
