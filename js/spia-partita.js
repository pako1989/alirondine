// js/spia-partita.js - «TAVOLO DA GIOCO & TIRI A EFFETTO»
// Motore di partita originale per «Operazione Doppio Zero · Licenza di Cross».
// Sfida d'azzardo e carambole sul panno verde del Casinò Royale di Montegol:
//  - PANNO VERDE & SPONDE D'ORO: la sfera rimbalza sui bordi di mogano e ottone dorato.
//  - DIFENSORI-FICHES: fiches giganti (fiches smeraldo, rubino, onice) che contrastano e deviano la sfera.
//  - RAGGI LASER MOBILI: un reticolo di sicurezza laser mobile oscilla; toccarlo devia o smorza il tiro!
//  - TIRO A EFFETTO & CARAMBOLA: regola l'angolo di mira e carica l'effetto ad arco (spin) per aggirare le fiches.
//  - COMANDI: tocco/trascinamento del mirino su smartphone, barra di caricamento effetto, tastiera frecce/WASD + Spazio.
(function () {
  "use strict";
  if (window.__spiaMatch) return;

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
      if (type === "chip") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(3200, t + 0.04);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      } else if (type === "cushion") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.13);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.14);
      } else if (type === "laser") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.linearRampToValueAtTime(220, t + 0.15);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.17);
      } else if (type === "kick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.11);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (type === "whistle") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(2400, t);
        osc.frequency.setValueAtTime(2800, t + 0.07);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      } else if (type === "goal") {
        [523, 659, 784, 1046].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, t + i * 0.09);
          gain.gain.setValueAtTime(0.2, t + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.005, t + i * 0.09 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.09);
          osc.stop(t + i * 0.09 + 0.5);
        });
      }
    } catch (_) {}
  }

  let curMatch = null;
  const dly = (st, ms) => (st.opts && st.opts.fast ? 4 : ms);

  function start(opts) {
    opts = opts || {};
    const wrap = document.createElement("div");
    wrap.className = "dzOv";
    wrap.style.cssText = "position:fixed;inset:0;z-index:9999;background:radial-gradient(circle at 50% 40%,#064e3b 0%,#022c22 65%,#01140f 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none;touch-action:none;font-family:'Segoe UI',sans-serif;color:#f8fafc;";

    const title = opts.title || "Tavolo Royale · Sfida sul Panno Verde";
    const teamA = opts.us || opts.teamA || "Agenti 00";
    const teamB = (opts.opp && opts.opp.name) || (typeof opts.opp === "string" && opts.opp) || opts.awayTeam || "I Croupier di Montegol";
    const colA = opts.usColor || opts.colA || "#10b981";
    const colB = (opts.opp && opts.opp.color) || opts.colB || "#e11d48";
    const totalShots = opts.turns || opts.shots || 6;
    const targetGoals = opts.targetGoals || 2;

    const st = {
      wrap,
      opts,
      teamB,
      running: false,
      a: 0,
      b: 0,
      targetGoals,
      shotsLeft: totalShots,
      aimAngle: 0, // radianti: -0.85 a +0.85
      spinVal: 0,  // da -1 (curva a sinistra) a +1 (curva a destra)
      ballState: "ready", // ready, flying, scored, saved
      ball: { x: 70, y: 105, vx: 0, vy: 0, spin: 0, r: 5 },
      hero: { x: 50, y: 105, name: (opts.heroLook && opts.heroLook.name) || "Campione 00" },
      gk: { x: 330, y: 105, vy: 1.8, minX: 326, maxX: 336, minY: 65, maxY: 145, h: 26, name: "Croupier d'Oro" },
      fiches: [
        { id: 1, x: 190, y: 65, vy: 1.2, r: 12, minY: 40, maxY: 170, col: "#e11d48", label: "500" },
        { id: 2, x: 235, y: 140, vy: -1.4, r: 13, minY: 40, maxY: 170, col: "#0f172a", label: "1000" },
        { id: 3, x: 275, y: 95, vy: 1.6, r: 11, minY: 45, maxY: 165, col: "#2563eb", label: "250" }
      ],
      laser: { x: 155, y1: 25, y2: 185, phase: 0, spd: 0.04, active: true },
      animId: null,
      msg: "",
      msgTimer: 0,
      frame: 0,
      finish(forceWin) {
        if (forceWin !== undefined) {
          st.a = forceWin ? 3 : 0;
          st.b = forceWin ? 1 : 2;
        }
        endGame(st);
      }
    };

    // Bonus Squadra dei Sogni
    const bn = opts.bonus || {};
    if (bn.at) st.shotsLeft += Math.floor(bn.at / 2);
    if (bn.df) st.fiches.forEach((f) => { f.r = Math.max(8, f.r - 2); });
    if (bn.te) st.gk.vy = Math.max(1.1, st.gk.vy - 0.3);

    curMatch = st;
    window.__spiaMatch.state = st;

    // Schermata di presentazione
    wrap.innerHTML = `
      <div style="max-width:390px;width:92%;background:#064e3b;border:2px solid #ffd23f;border-radius:14px;padding:18px;box-shadow:0 12px 32px rgba(0,0,0,0.85);text-align:center;">
        <div style="font-size:24px;margin-bottom:6px;color:#ffd23f;font-weight:900;">🎲 TAVOLO DA GIOCO 🍸</div>
        <div style="font-size:13px;color:#a7f3d0;margin-bottom:12px;font-weight:600;">${esc(title)}</div>
        <div style="background:#022c22;border:1px solid #10b981;border-radius:10px;padding:12px;font-size:12px;line-height:1.55;text-align:left;margin-bottom:14px;color:#e2e8f0;">
          • <b>Panno Verde & Sponde:</b> tira con rimbalzo calcolato sulle sponde dorate in alto e in basso.<br>
          • <b>Difensori-Fiches & Laser:</b> le fiches rotanti bloccano e respingono la sfera; il raggio laser di sicurezza ne smorza la velocità.<br>
          • <b>Effetto a Giro (Spin):</b> regola la mira e usa il cursore <em>Effetto</em> per aggirare la difesa d'azzardo!<br>
          • <b>Comandi:</b> Trascina o usa le frecce/slider per mirare l'angolo e la curva, poi tocca <b>TIRA A EFFETTO</b> (o Spazio).
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-weight:bold;font-size:14px;background:#01140f;padding:8px 12px;border-radius:8px;">
          <span style="color:${colA}">${esc(teamA)}</span>
          <span style="color:#ffd23f">VS</span>
          <span style="color:${colB}">${esc(teamB)}</span>
        </div>
        <button type="button" id="dzStartBtn" style="width:100%;padding:13px;font-size:16px;font-weight:900;background:linear-gradient(180deg,#ffd23f,#eab308);color:#0f172a;border:none;border-radius:10px;cursor:pointer;box-shadow:0 4px 14px rgba(234,179,8,0.45);">
          PUNTA E TIRA SUL PANNO ▸
        </button>
      </div>
    `;

    document.body.appendChild(wrap);
    const q = document.createElement("button");
    q.type = "button"; q.textContent = "✕ Esci"; q.id = "dzQuit";
    q.style.cssText = "position:absolute;top:8px;right:8px;z-index:1100;padding:6px 10px;font-size:12px;font-weight:bold;background:#7f1d1d;color:#fff;border:1px solid #ef4444;border-radius:8px;cursor:pointer;";
    q.onclick = () => {
      if (st.running && st.cleanupEvents) st.cleanupEvents();
      st.running = false;
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (window.__sagaCore && window.__sagaCore.endMatch) window.__sagaCore.endMatch();
      if (opts.onDone) opts.onDone({ a: st.a, b: st.b, win: false, quit: true });
    };
    wrap.appendChild(q);

    const startBtn = wrap.querySelector("#dzStartBtn");
    if (opts.auto) setTimeout(() => startBtn && startBtn.click(), 20);
    if (startBtn) {
      startBtn.onclick = () => {
        snd("chip");
        launchGame(st);
      };
    }

    return st;
  }

  function launchGame(st) {
    const wrap = st.wrap;
    const qkeep = wrap.querySelector("#dzQuit");
    wrap.innerHTML = `
      <div style="width:100%;max-width:440px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px;">
        <!-- HUD superiore -->
        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;background:#022c22;border:1.5px solid #10b981;border-radius:10px;padding:6px 14px;font-size:13px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.5);">
          <div style="color:#34d399">${esc(st.opts.us || "Agenti 00")} <span id="dzScoreA" style="font-size:19px;margin-left:4px;color:#ffd23f;">0</span></div>
          <div style="background:#064e3b;border:1px solid #ffd23f;padding:2px 10px;border-radius:8px;color:#fef08a;">
            🎲 Fiches: <span id="dzShots">${st.shotsLeft}</span>
          </div>
          <div style="color:#f87171"><span id="dzScoreB" style="font-size:19px;margin-right:4px;color:#ffd23f;">0</span> ${esc(st.teamB)}</div>
        </div>

        <!-- Tavolo da Gioco (Canvas) -->
        <div style="position:relative;width:360px;height:210px;border:3px solid #b45309;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.9);background:#064e3b;">
          <canvas id="spiaCv" width="360" height="210" style="width:360px;height:auto;flex:none;display:block;image-rendering:pixelated;"></canvas>
          <div id="dzBanner" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(2,44,34,0.85);font-size:22px;font-weight:900;color:#ffd23f;text-shadow:0 2px 6px #000;pointer-events:none;">
            GOL ALL'INCROCIO!
          </div>
        </div>

        <!-- Controlli interattivi Touch / Mobile -->
        <div style="width:100%;max-width:360px;background:#022c22;border:1px solid #065f46;border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#a7f3d0;font-weight:700;">
            <span>Angolo: <b id="dzAngleLbl" style="color:#ffd23f;">0°</b></span>
            <span>Effetto Spin: <b id="dzSpinLbl" style="color:#ffd23f;">Dritto</b></span>
          </div>

          <!-- Pulsanti mira rapida -->
          <div style="display:flex;gap:6px;justify-content:center;">
            <button type="button" id="dzAimUp" style="flex:1;padding:8px 0;background:#065f46;border:1px solid #10b981;border-radius:8px;color:#fff;font-weight:bold;cursor:pointer;">▲ Mira Alto</button>
            <button type="button" id="dzAimMid" style="flex:1;padding:8px 0;background:#065f46;border:1px solid #10b981;border-radius:8px;color:#fff;font-weight:bold;cursor:pointer;">◆ Centro</button>
            <button type="button" id="dzAimDown" style="flex:1;padding:8px 0;background:#065f46;border:1px solid #10b981;border-radius:8px;color:#fff;font-weight:bold;cursor:pointer;">▼ Mira Basso</button>
          </div>

          <!-- Slider Effetto Spin -->
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:11px;color:#cbd5e1;">Spin:</span>
            <button type="button" id="dzSpinL" style="padding:4px 8px;background:#0f172a;border:1px solid #64748b;border-radius:6px;color:#38bdf8;font-weight:bold;cursor:pointer;">↺ Giro SX</button>
            <input type="range" id="dzSpinRange" min="-10" max="10" value="0" style="flex:1;accent-color:#ffd23f;cursor:pointer;">
            <button type="button" id="dzSpinR" style="padding:4px 8px;background:#0f172a;border:1px solid #64748b;border-radius:6px;color:#f43f5e;font-weight:bold;cursor:pointer;">↻ Giro DX</button>
          </div>

          <!-- Pulsante di tiro grande -->
          <button type="button" id="dzShootBtn" style="width:100%;padding:12px;font-size:16px;font-weight:900;background:linear-gradient(180deg,#10b981,#059669);color:#ffffff;border:2px solid #34d399;border-radius:10px;cursor:pointer;box-shadow:0 4px 12px rgba(16,185,129,0.4);">
            🎯 TIRA A EFFETTO SUL PANNO
          </button>
        </div>
      </div>
    `;

    const qb = qkeep;
    const canvas = wrap.querySelector("#spiaCv");
    const ctx = canvas.getContext("2d");
    st.running = true;
    if (qb) wrap.appendChild(qb);

    // Gestione mira touch sul canvas
    let touching = false;
    canvas.addEventListener("pointerdown", (e) => {
      touching = true;
      updateAimFromPointer(e, canvas, st);
    });
    window.addEventListener("pointermove", (e) => {
      if (touching) updateAimFromPointer(e, canvas, st);
    });
    window.addEventListener("pointerup", () => { touching = false; });

    // Slider spin
    const spinRange = wrap.querySelector("#dzSpinRange");
    const spinLbl = wrap.querySelector("#dzSpinLbl");
    const updateSpinLbl = () => {
      const v = st.spinVal;
      if (Math.abs(v) < 0.1) spinLbl.textContent = "Dritto";
      else if (v < 0) spinLbl.textContent = `Arco Superiore (${Math.round(Math.abs(v) * 100)}%)`;
      else spinLbl.textContent = `Arco Inferiore (${Math.round(v * 100)}%)`;
    };

    spinRange.oninput = (e) => {
      st.spinVal = parseFloat(e.target.value) / 10;
      updateSpinLbl();
    };

    wrap.querySelector("#dzSpinL").onclick = () => {
      st.spinVal = -0.7;
      spinRange.value = "-7";
      updateSpinLbl();
      snd("chip");
    };
    wrap.querySelector("#dzSpinR").onclick = () => {
      st.spinVal = 0.7;
      spinRange.value = "7";
      updateSpinLbl();
      snd("chip");
    };

    // Pulsanti mira
    const angleLbl = wrap.querySelector("#dzAngleLbl");
    const setAngle = (deg) => {
      st.aimAngle = (deg * Math.PI) / 180;
      angleLbl.textContent = `${deg > 0 ? "+" : ""}${deg}°`;
    };
    wrap.querySelector("#dzAimUp").onclick = () => { setAngle(-30); snd("chip"); };
    wrap.querySelector("#dzAimMid").onclick = () => { setAngle(0); snd("chip"); };
    wrap.querySelector("#dzAimDown").onclick = () => { setAngle(30); snd("chip"); };

    // Tasto tiro
    const shootBtn = wrap.querySelector("#dzShootBtn");
    shootBtn.onclick = () => {
      doShoot(st);
    };

    // Gestione tastiera
    const onKey = (e) => {
      if (!st.running) return;
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        st.aimAngle = Math.max(-0.85, st.aimAngle - 0.1);
        angleLbl.textContent = `${Math.round((st.aimAngle * 180) / Math.PI)}°`;
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        st.aimAngle = Math.min(0.85, st.aimAngle + 0.1);
        angleLbl.textContent = `${Math.round((st.aimAngle * 180) / Math.PI)}°`;
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        st.spinVal = Math.max(-1, st.spinVal - 0.2);
        spinRange.value = String(Math.round(st.spinVal * 10));
        updateSpinLbl();
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        st.spinVal = Math.min(1, st.spinVal + 0.2);
        spinRange.value = String(Math.round(st.spinVal * 10));
        updateSpinLbl();
      } else if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        doShoot(st);
      }
    };
    window.addEventListener("keydown", onKey);
    st.cleanupEvents = () => {
      window.removeEventListener("keydown", onKey);
      if (st.animId) cancelAnimationFrame(st.animId);
    };

    // Loop principale
    function loop() {
      if (!st.running) return;
      st.frame++;
      for (let k = st.opts.fast ? 12 : 1; k > 0 && st.running; k--) {
        if (st.opts.auto && st.ballState === "ready") {
          st.aimAngle = (Math.random() - 0.5) * 1.1;
          st.spinVal = (Math.random() - 0.5) * 1.2;
          doShoot(st);
        }
        update(st);
      }
      draw(ctx, st);
      st.animId = requestAnimationFrame(loop);
    }
    st.animId = requestAnimationFrame(loop);
  }

  function updateAimFromPointer(e, canvas, st) {
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    const dx = px - st.ball.x;
    const dy = py - st.ball.y;
    if (dx > 10) {
      st.aimAngle = Math.max(-0.85, Math.min(0.85, Math.atan2(dy, dx)));
      const deg = Math.round((st.aimAngle * 180) / Math.PI);
      const lbl = st.wrap.querySelector("#dzAngleLbl");
      if (lbl) lbl.textContent = `${deg > 0 ? "+" : ""}${deg}°`;
    }
  }

  function doShoot(st) {
    if (st.ballState !== "ready" || st.shotsLeft <= 0) return;
    st.shotsLeft--;
    const shLbl = st.wrap.querySelector("#dzShots");
    if (shLbl) shLbl.textContent = String(st.shotsLeft);

    const speed = 7.2;
    st.ball.vx = Math.cos(st.aimAngle) * speed;
    st.ball.vy = Math.sin(st.aimAngle) * speed;
    st.ball.spin = st.spinVal * 0.16; // forza di curvatura laterale
    st.ballState = "flying";
    snd("kick");
  }

  function update(st) {
    // Aggiornamento portiere avversario
    const gk = st.gk;
    gk.y += gk.vy;
    if (gk.y < gk.minY) { gk.y = gk.minY; gk.vy = Math.abs(gk.vy); }
    if (gk.y > gk.maxY) { gk.y = gk.maxY; gk.vy = -Math.abs(gk.vy); }

    // Aggiornamento fiches mobili
    st.fiches.forEach((f) => {
      f.y += f.vy;
      if (f.y < f.minY) { f.y = f.minY; f.vy = Math.abs(f.vy); }
      if (f.y > f.maxY) { f.y = f.maxY; f.vy = -Math.abs(f.vy); }
    });

    // Aggiornamento laser di sicurezza
    st.laser.phase += st.laser.spd;
    st.laser.x = 150 + Math.sin(st.laser.phase) * 25;

    // Aggiornamento palla
    const b = st.ball;
    if (st.ballState === "flying") {
      // Effetto spin che incurva la traiettoria
      b.vy += b.spin;
      b.x += b.vx;
      b.y += b.vy;

      // Rimbalzo sponde dorate superiore e inferiore
      if (b.y - b.r < 18) {
        b.y = 18 + b.r;
        b.vy = -b.vy * 0.88;
        snd("cushion");
      }
      if (b.y + b.r > H - 18) {
        b.y = H - 18 - b.r;
        b.vy = -b.vy * 0.88;
        snd("cushion");
      }

      // Rimbalzo sponda posteriore sinistra
      if (b.x - b.r < 18) {
        b.x = 18 + b.r;
        b.vx = Math.abs(b.vx) * 0.8;
        snd("cushion");
      }

      // Collisione con Raggio Laser
      if (b.laserCd > 0) b.laserCd--;
      if (!b.laserCd && Math.abs(b.x - st.laser.x) < 5 && b.y >= st.laser.y1 && b.y <= st.laser.y2) {
        b.vx = Math.max(2.4, b.vx * 0.65); // il raggio rallenta, non ferma
        b.vy += (Math.random() - 0.5) * 3;
        b.laserCd = 40;
        snd("laser");
      }
      // palla ferma troppo a lungo: fuori gioco (evita stalli)
      st.stall = (Math.hypot(b.vx, b.vy) < 1.2) ? (st.stall || 0) + 1 : 0;
      if (st.stall > 240) { b.x = W - 10; }

      // Collisione con Fiches
      st.fiches.forEach((f) => {
        const dx = b.x - f.x;
        const dy = b.y - f.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < b.r + f.r) {
          // Rimbalzo elastico
          const angle = Math.atan2(dy, dx);
          const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy) * 0.92;
          b.vx = Math.cos(angle) * spd;
          b.vy = Math.sin(angle) * spd;
          b.x = f.x + Math.cos(angle) * (b.r + f.r + 1);
          b.y = f.y + Math.sin(angle) * (b.r + f.r + 1);
          snd("chip");
        }
      });

      // Collisione con Portiere Croupier
      if (b.x + b.r >= gk.x - 6 && b.x - b.r <= gk.x + 6 && b.y >= gk.y - gk.h / 2 && b.y <= gk.y + gk.h / 2) {
        b.vx = -Math.abs(b.vx) * 0.75;
        b.vy += (Math.random() - 0.5) * 2;
        snd("cushion");
        st.ballState = "saved";
        showBanner(st, "PARATA DEL CROUPIER! 🧤");
        setTimeout(() => { if (st.shotsLeft <= 0) endGame(st); else resetBall(st); }, dly(st, 900));
      }

      // GOL nella porta di destra
      if (b.x >= 338 && b.y >= 70 && b.y <= 140) {
        st.a++;
        st.ballState = "scored";
        snd("goal");
        const scA = st.wrap.querySelector("#dzScoreA");
        if (scA) scA.textContent = String(st.a);
        showBanner(st, "GOOOL AL CASINÒ! 🏆");
        setTimeout(() => {
          if (st.a >= st.targetGoals || st.shotsLeft <= 0) {
            endGame(st);
          } else {
            resetBall(st);
          }
        }, dly(st, 1100));
      }

      // Palla fuori a destra (sopra o sotto la porta)
      if (b.x > W - 14 && st.ballState === "flying") {
        st.ballState = "saved";
        snd("whistle");
        showBanner(st, "FUORI! 🎲");
        setTimeout(() => {
          if (st.shotsLeft <= 0) {
            endGame(st);
          } else {
            resetBall(st);
          }
        }, dly(st, 900));
      }
    }
  }

  function resetBall(st) {
    st.ball.x = 70;
    st.ball.y = 105;
    st.ball.vx = 0;
    st.ball.vy = 0;
    st.ball.spin = 0;
    st.ball.laserCd = 0;
    st.stall = 0;
    st.ballState = "ready";
  }

  function showBanner(st, text) {
    const banner = st.wrap.querySelector("#dzBanner");
    if (banner) {
      banner.textContent = text;
      banner.style.display = "flex";
      setTimeout(() => { banner.style.display = "none"; }, 800);
    }
  }

  function draw(ctx, st) {
    ctx.clearRect(0, 0, W, H);

    // 1. Panno verde del tavolo con trama sottile
    ctx.fillStyle = "#047857";
    ctx.fillRect(0, 0, W, H);

    // Bordo in mogano e modanatura dorata
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, W - 14, H - 14);

    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(15, 15, W - 30, H - 30);

    // Linee bianche da casinò / campo sul panno
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.2;

    // Centrocampo e cerchio roulette
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W / 2, 16);
    ctx.lineTo(W / 2, H - 16);
    ctx.stroke();

    // Area di porta destra
    ctx.strokeRect(290, 60, 54, 90);
    // Porta
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(336, 70, 8, 70);
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 2;
    ctx.strokeRect(336, 70, 8, 70);

    // 2. Raggio Laser di Sicurezza Mobile
    ctx.save();
    ctx.strokeStyle = "rgba(239,68,68,0.75)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(st.laser.x, st.laser.y1);
    ctx.lineTo(st.laser.x, st.laser.y2);
    ctx.stroke();
    // Emettitori laser in cima e fondo
    ctx.fillStyle = "#991b1b";
    ctx.fillRect(st.laser.x - 3, st.laser.y1 - 6, 6, 6);
    ctx.fillRect(st.laser.x - 3, st.laser.y2, 6, 6);
    ctx.restore();

    // 3. Fiches difensive
    st.fiches.forEach((f) => {
      ctx.save();
      // Ombra fiche
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.arc(f.x + 2, f.y + 3, f.r, 0, Math.PI * 2);
      ctx.fill();

      // Corpo fiche
      ctx.fillStyle = f.col;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();

      // Corona dorata a spicchi
      ctx.strokeStyle = "#ffd23f";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Scritta valore
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(f.label, f.x, f.y);
      ctx.restore();
    });

    // 4. Portiere Croupier
    const gk = st.gk;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(gk.x - 4, gk.y - gk.h / 2 + 2, 8, gk.h);

    ctx.fillStyle = "#ffd23f"; // Gilet dorato del croupier
    ctx.fillRect(gk.x - 5, gk.y - gk.h / 2, 10, gk.h);
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1;
    ctx.strokeRect(gk.x - 5, gk.y - gk.h / 2, 10, gk.h);

    // Farfallino e testa
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(gk.x - 3, gk.y - 3, 6, 6);
    ctx.fillStyle = "#f5d0b0";
    ctx.beginPath();
    ctx.arc(gk.x, gk.y - gk.h / 2 - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Campione in Smoking (a sinistra)
    const h = st.hero;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.arc(h.x, h.y + 7, 7, 0, Math.PI * 2);
    ctx.fill();

    // Giacca smoking nera
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(h.x, h.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Camicia bianca e papillon
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(h.x, h.y - 3);
    ctx.lineTo(h.x + 3, h.y + 4);
    ctx.lineTo(h.x - 3, h.y + 4);
    ctx.closePath();
    ctx.fill();

    // Testa
    ctx.fillStyle = "#f5d0b0";
    ctx.beginPath();
    ctx.arc(h.x, h.y - 9, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Indicatore freccia sopra la testa
    ctx.fillStyle = "#ffd23f";
    ctx.beginPath();
    ctx.moveTo(h.x, h.y - 17);
    ctx.lineTo(h.x - 3, h.y - 21);
    ctx.lineTo(h.x + 3, h.y - 21);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 6. Traiettoria di mira prevista (se pronto)
    if (st.ballState === "ready") {
      ctx.save();
      ctx.strokeStyle = "rgba(255,210,63,0.7)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(st.ball.x, st.ball.y);
      // Arco curvato dall'effetto spin
      const cpX = st.ball.x + Math.cos(st.aimAngle) * 55;
      const cpY = st.ball.y + Math.sin(st.aimAngle) * 55 + st.spinVal * 25;
      const endX = st.ball.x + Math.cos(st.aimAngle) * 110;
      const endY = st.ball.y + Math.sin(st.aimAngle) * 110 + st.spinVal * 50;
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.stroke();

      // Mirino dorato in fondo
      ctx.setLineDash([]);
      ctx.strokeStyle = "#ffd23f";
      ctx.beginPath();
      ctx.arc(endX, endY, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Palla da Calcio d'Oro Royale
    const b = st.ball;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(b.x + 1, b.y + 2, b.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Pentagons sulla palla
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(b.x, b.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function endGame(st) {
    if (!st.running) return;
    st.running = false;
    if (st.cleanupEvents) st.cleanupEvents();
    snd("whistle");

    const win = st.a >= st.targetGoals;
    const ov = document.createElement("div");
    ov.style.cssText = "position:absolute;inset:0;background:rgba(2,44,34,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f8fafc;text-align:center;padding:20px;z-index:1000;";
    ov.innerHTML = `
      <div style="font-size:26px;font-weight:900;margin-bottom:8px;color:${win ? "#ffd23f" : "#f87171"}">
        ${win ? "🏆 BANCO SALTATO AL CASINÒ! 🏆" : "🚨 TRIPLICE FISCHIO DELLA CASSA"}
      </div>
      <div style="font-size:34px;font-weight:900;margin-bottom:12px;color:#ffffff;">
        ${st.a} - ${st.b}
      </div>
      <div style="font-size:13px;color:#a7f3d0;max-width:320px;margin-bottom:18px;line-height:1.5;">
        ${win ? "Le tue carambole di precisione hanno superato le fiches e disorientato il croupier! La sala VIP ti acclama in smoking." : "I difensori-fiches e il croupier hanno tenuto la cassa, ma la tua licenza di tiro resta intatta."}
      </div>
      <button type="button" id="dzDoneBtn" style="padding:13px 28px;font-size:16px;font-weight:900;background:linear-gradient(180deg,#ffd23f,#eab308);color:#0f172a;border:none;border-radius:10px;cursor:pointer;box-shadow:0 4px 14px rgba(234,179,8,0.45);">
        CONTINUA ▸
      </button>
    `;
    st.wrap.appendChild(ov);

    const btn = ov.querySelector("#dzDoneBtn");
    if (st.opts.auto) setTimeout(() => btn.click(), 20);
    btn.onclick = () => {
      if (st.wrap && st.wrap.parentNode) st.wrap.parentNode.removeChild(st.wrap);
      if (window.__sagaCore && window.__sagaCore.endMatch) window.__sagaCore.endMatch();
      if (st.opts && st.opts.onDone) {
        st.opts.onDone({ a: st.a, b: st.b, win, quit: false });
      }
    };
  }

  window.__spiaMatch = {
    start,
    state: null
  };
})();
