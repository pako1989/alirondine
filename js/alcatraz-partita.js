// js/alcatraz-partita.js - «CALCIO A PARETE · REBOUND HEIST»
// Motore di partita originale per «Fuga da Alcatraz FC · La Grande Evasione».
// Partita 3 contro 3 nel cortile recintato del penitenziario:
//  - SPONDE ELASTICHE IN METALLO: le pareti laterali riflettono la palla con accelerazione e rimbalzo a 45°.
//  - FARI DEI RIFLETTORI: un fascio di luce mobile scandaglia il campo; passare o trattenere palla nel cono
//    allarma le torrette e rischia di far intercettare la palla dalle guardie!
//  - MOSSE SPECIALI:
//      * Tiro a Scasso: rasoiata radente a rimbalzo controllato.
//      * Sponda Cieca: cross diagonale ad alta velocità sfruttando la parete superiore o inferiore.
//      * Blocco di Ferro: contrasto di spalla che arresta lo scatto dell'avversario.
(function () {
  "use strict";
  if (window.__alcatrazMatch) return;

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
      if (type === "siren") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.linearRampToValueAtTime(540, t + 0.35);
        osc.frequency.linearRampToValueAtTime(320, t + 0.7);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.75);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.8);
      } else if (type === "bounce") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(380, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.12);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.14);
      } else if (type === "kick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      } else if (type === "whistle") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1900, t);
        osc.frequency.setValueAtTime(2300, t + 0.08);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      } else if (type === "goal") {
        [440, 554, 659, 880].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, t + i * 0.08);
          gain.gain.setValueAtTime(0.18, t + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.005, t + i * 0.08 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.55);
        });
      }
    } catch (_) {}
  }

  let curMatch = null;

  function start(opts) {
    opts = opts || {};
    const wrap = document.createElement("div");
    wrap.className = "alcOv";
    wrap.style.cssText = "position:fixed;inset:0;z-index:9999;background:#090d16;display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none;touch-action:none;font-family:sans-serif;color:#f1f5f9;";

    const title = opts.title || "Partita nel Cortile di Massima Sicurezza";
    const teamA = opts.teamA || "Rondine Galeotti";
    const teamB = opts.opp || opts.teamB || "Guardie del Blocco C";
    const colA = opts.colA || "#38bdf8";
    const colB = opts.colB || "#f59e0b";

    const st = {
      wrap,
      opts,
      running: false,
      a: 0,
      b: 0,
      timer: 50,
      searchlightX: 180,
      searchlightDir: 1.2,
      alertMeter: 0,
      ball: { x: 180, y: 105, vx: 0, vy: 0, holder: null },
      players: [
        // Squadra A (blu/galeotti - sinistra)
        { team: "A", id: "hero", name: "Campione", x: 130, y: 105, vx: 0, vy: 0, speed: 2.3, col: colA, role: "atk" },
        { team: "A", id: "mate", name: "Bruno", x: 80, y: 65, vx: 0, vy: 0, speed: 2.1, col: colA, role: "mid" },
        { team: "A", id: "gk", name: "Malick", x: 35, y: 105, vx: 0, vy: 0, speed: 1.7, col: colA, role: "gk" },
        // Squadra B (destra)
        { team: "B", id: "opp1", name: "Cardenas", x: 230, y: 105, vx: 0, vy: 0, speed: 2.2, col: colB, role: "atk" },
        { team: "B", id: "opp2", name: "Tonelli", x: 280, y: 145, vx: 0, vy: 0, speed: 2.0, col: colB, role: "mid" },
        { team: "B", id: "oppGk", name: "Guardia GK", x: 325, y: 105, vx: 0, vy: 0, speed: 1.7, col: colB, role: "gk" }
      ],
      keys: {},
      frame: 0,
      finish() {
        endGame(st);
      }
    };

    // Squadra dei Sogni: ATT = tiri più veloci, DIF = portiere più reattivo, TEC = compagni e Campione più rapidi; i compagni prendono i nomi delle carte
    const bn = opts.bonus || {};
    st.shotPow = 7.5 + (bn.at | 0) * 0.45;
    st.players[2].speed += (bn.df | 0) * 0.12;
    st.players[0].speed += (bn.te | 0) * 0.06; st.players[1].speed += (bn.te | 0) * 0.06;
    if (opts.mates && opts.mates[0]) { st.players[1].name = opts.mates[0].name || st.players[1].name; if (opts.mates[1]) st.players[2].name = opts.mates[1].name || st.players[2].name; }

    curMatch = st;
    window.__alcatrazMatch.state = st;

    // Schermata di presentazione
    wrap.innerHTML = `
      <div style="max-width:380px;width:92%;background:#1e293b;border:2px solid #38bdf8;border-radius:12px;padding:16px;box-shadow:0 10px 25px rgba(0,0,0,0.7);text-align:center;">
        <div style="font-size:24px;margin-bottom:6px;">⛓️ <b>CALCIO A PARETE</b> 🚨</div>
        <div style="font-size:13px;color:#94a3b8;margin-bottom:12px;">${esc(title)}</div>
        <div style="background:#0f172a;border-radius:8px;padding:10px;font-size:12px;line-height:1.5;text-align:left;margin-bottom:14px;color:#cbd5e1;">
          • <b>Sponde Metalliche:</b> usa le pareti in alto e in basso per far rimbalzare la sfera e scavalcare i difensori.<br>
          • <b>Riflettori di Ronda:</b> il faro giallo oscilla sul campo. Non farti sorprendere con la sfera nel cono di luce o scatterà l'allarme!<br>
          • <b>Controlli:</b> Joypad a sinistra, tasti <b>Sponda</b>, <b>Tiro Scasso</b> e <b>Contrasto</b> a destra. Da tastiera: Frecce / WASD + Spazio / Invio.
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-weight:bold;font-size:14px;">
          <span style="color:${colA}">${esc(teamA)}</span>
          <span style="color:#64748b">VS</span>
          <span style="color:${colB}">${esc(teamB)}</span>
        </div>
        <button type="button" id="alcStartBtn" style="width:100%;padding:12px;font-size:16px;font-weight:bold;background:#0284c7;color:#fff;border:none;border-radius:8px;cursor:pointer;box-shadow:0 4px 10px rgba(2,132,199,0.4);">
          INIZIA LA PARTITA ⚽
        </button>
      </div>
    `;

    document.body.appendChild(wrap);

    const startBtn = wrap.querySelector("#alcStartBtn");
    if (startBtn) {
      startBtn.onclick = () => {
        launchGame(st);
      };
    }

    return st;
  }

  function launchGame(st) {
    const wrap = st.wrap;
    wrap.innerHTML = `
      <div style="width:100%;max-width:440px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px;">
        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;background:#0f172a;border:1px solid #334155;border-radius:8px;padding:6px 12px;font-size:13px;font-weight:bold;">
          <div style="color:#38bdf8">${esc(st.opts.teamA || "Galeotti")} <span id="alcScoreA" style="font-size:18px;margin-left:4px;">0</span></div>
          <div style="background:#1e293b;padding:2px 8px;border-radius:6px;color:#facc15;">⏱️ <span id="alcTimer">50"</span></div>
          <div style="color:#f59e0b"><span id="alcScoreB" style="font-size:18px;margin-right:4px;">0</span> ${esc(st.opts.opp || "Guardie")}</div>
        </div>
        <div style="position:relative;width:360px;height:210px;border:2px solid #475569;border-radius:8px;overflow:hidden;box-shadow:0 6px 16px rgba(0,0,0,0.8);background:#1e293b;">
          <canvas id="alcatrazCv" width="360" height="210" style="width:360px;height:210px;display:block;image-rendering:pixelated;"></canvas>
          <div id="alcMsg" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.8);font-size:20px;font-weight:bold;color:#facc15;display:none;pointer-events:none;">GOOOL!</div>
        </div>
        <div style="width:100%;max-width:360px;display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
          <!-- D-Pad -->
          <div style="display:grid;grid-template-columns:repeat(3,38px);grid-template-rows:repeat(3,38px);gap:3px;">
            <div></div>
            <button type="button" class="alcKey" data-k="ArrowUp" style="background:#334155;border:1px solid #64748b;border-radius:6px;color:#fff;font-size:16px;">▲</button>
            <div></div>
            <button type="button" class="alcKey" data-k="ArrowLeft" style="background:#334155;border:1px solid #64748b;border-radius:6px;color:#fff;font-size:16px;">◀</button>
            <div style="background:#1e293b;border-radius:4px;"></div>
            <button type="button" class="alcKey" data-k="ArrowRight" style="background:#334155;border:1px solid #64748b;border-radius:6px;color:#fff;font-size:16px;">▶</button>
            <div></div>
            <button type="button" class="alcKey" data-k="ArrowDown" style="background:#334155;border:1px solid #64748b;border-radius:6px;color:#fff;font-size:16px;">▼</button>
            <div></div>
          </div>
          <!-- Action Buttons -->
          <div style="display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;gap:5px;">
              <button type="button" id="alcBtnPass" style="padding:10px 14px;background:#0369a1;border:2px solid #38bdf8;border-radius:8px;color:#fff;font-size:13px;font-weight:bold;cursor:pointer;">
                🔄 SPONDA
              </button>
              <button type="button" id="alcBtnTackle" style="padding:10px 14px;background:#b45309;border:2px solid #f59e0b;border-radius:8px;color:#fff;font-size:13px;font-weight:bold;cursor:pointer;">
                🛡️ BLOCCO
              </button>
            </div>
            <button type="button" id="alcBtnShoot" style="width:100%;padding:10px;background:#b91c1c;border:2px solid #f87171;border-radius:8px;color:#fff;font-size:14px;font-weight:bold;cursor:pointer;">
              ⚡ TIRO A SCASSO
            </button>
          </div>
        </div>
      </div>
    `;

    const cv = wrap.querySelector("#alcatrazCv");
    const ctx = cv.getContext("2d");
    st.cv = cv;
    st.ctx = ctx;
    st.running = true;

    // Controls setup
    const bindBtn = (btn, key) => {
      if (!btn) return;
      const onDown = (e) => { e.preventDefault(); st.keys[key] = true; };
      const onUp = (e) => { e.preventDefault(); st.keys[key] = false; };
      btn.addEventListener("pointerdown", onDown);
      btn.addEventListener("pointerup", onUp);
      btn.addEventListener("pointerleave", onUp);
    };

    wrap.querySelectorAll(".alcKey").forEach((b) => {
      bindBtn(b, b.dataset.k);
    });

    const passBtn = wrap.querySelector("#alcBtnPass");
    const shootBtn = wrap.querySelector("#alcBtnShoot");
    const tackleBtn = wrap.querySelector("#alcBtnTackle");

    if (passBtn) passBtn.onclick = () => doPass(st);
    if (shootBtn) shootBtn.onclick = () => doShoot(st);
    if (tackleBtn) tackleBtn.onclick = () => doTackle(st);

    const onKeyDown = (e) => {
      st.keys[e.key] = true;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        doShoot(st);
      } else if (e.key === "x" || e.key === "X") {
        e.preventDefault();
        doPass(st);
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        doTackle(st);
      }
    };
    const onKeyUp = (e) => {
      st.keys[e.key] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    st.cleanupEvents = () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };

    // Timer loop
    st.timerInterval = setInterval(() => {
      if (!st.running) return;
      st.timer--;
      const el = wrap.querySelector("#alcTimer");
      if (el) el.textContent = st.timer + '"';
      if (st.timer <= 0) {
        endGame(st);
      }
    }, 1000);

    snd("whistle");
    requestAnimationFrame(() => gameLoop(st));
  }

  function doPass(st) {
    const hero = st.players[0];
    const mate = st.players[1];
    snd("bounce");
    // Passaggio con rimbalzo a parete
    const bounceY = hero.y < 105 ? 15 : 195;
    const midX = (hero.x + mate.x) / 2;
    st.ball.x = hero.x;
    st.ball.y = hero.y;
    st.ball.vx = (mate.x - hero.x) * 0.12;
    st.ball.vy = (bounceY - hero.y) * 0.2;
    st.ball.holder = null;
  }

  function doShoot(st) {
    const hero = st.players[0];
    snd("kick");
    st.ball.x = hero.x;
    st.ball.y = hero.y;
    // Rasoiata verso la porta avversaria (x=335, y=105) con deviazione d'effetto
    const targetY = 90 + Math.random() * 30;
    const dx = 340 - hero.x;
    const dy = targetY - hero.y;
    const dist = Math.hypot(dx, dy) || 1;
    st.ball.vx = (dx / dist) * (st.shotPow || 7.5);
    st.ball.vy = (dy / dist) * (st.shotPow || 7.5);
    st.ball.holder = null;
  }

  function doTackle(st) {
    const hero = st.players[0];
    snd("kick");
    hero.vx *= 1.8;
    hero.vy *= 1.8;
    // Se vicino alla palla o ad avversario, ruba la sfera
    st.players.filter((p) => p.team === "B").forEach((opp) => {
      if (Math.hypot(opp.x - hero.x, opp.y - hero.y) < 28) {
        opp.vx = -1.5;
        if (st.ball.holder === opp) {
          st.ball.holder = hero;
          snd("bounce");
        }
      }
    });
  }

  function gameLoop(st) {
    if (!st.running) return;
    update(st);
    render(st);
    st.frame++;
    requestAnimationFrame(() => gameLoop(st));
  }

  function update(st) {
    const { keys, players, ball } = st;
    const hero = players[0];

    // Searchlight sweep
    st.searchlightX += st.searchlightDir;
    if (st.searchlightX > 300) {
      st.searchlightX = 300;
      st.searchlightDir = -1.2;
    } else if (st.searchlightX < 60) {
      st.searchlightX = 60;
      st.searchlightDir = 1.2;
    }

    // Hero movement
    let dx = 0, dy = 0;
    if (keys.ArrowUp || keys.w || keys.W) dy -= 1;
    if (keys.ArrowDown || keys.s || keys.S) dy += 1;
    if (keys.ArrowLeft || keys.a || keys.A) dx -= 1;
    if (keys.ArrowRight || keys.d || keys.D) dx += 1;

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      hero.vx = (dx / len) * hero.speed;
      hero.vy = (dy / len) * hero.speed;
    } else {
      hero.vx *= 0.8;
      hero.vy *= 0.8;
    }

    // AI compagno (Bruno)
    const mate = players[1];
    const targetMateX = ball.x < 180 ? 110 : 200;
    mate.vx = (targetMateX - mate.x) * 0.05;
    mate.vy = (ball.y - mate.y) * 0.06;

    // AI avversari
    const oppAtk = players[3];
    oppAtk.vx = (ball.x - oppAtk.x) * 0.04;
    oppAtk.vy = (ball.y - oppAtk.y) * 0.04;

    const oppGk = players[5];
    oppGk.vx = (325 - oppGk.x) * 0.1;
    oppGk.vy = Math.max(-1.8, Math.min(1.8, (ball.y - oppGk.y) * 0.1));

    // Update player positions with boundaries
    players.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.x = Math.max(20, Math.min(340, p.x));
      p.y = Math.max(24, Math.min(186, p.y));

      // Ball pickup
      if (!ball.holder && Math.hypot(ball.x - p.x, ball.y - p.y) < 12) {
        ball.holder = p;
      }
    });

    // Ball physics & rebound
    if (ball.holder) {
      ball.x = ball.holder.x + (ball.holder.team === "A" ? 8 : -8);
      ball.y = ball.holder.y;
      ball.vx = 0;
      ball.vy = 0;

      // Opponent AI kicks when holding
      if (ball.holder.team === "B" && Math.random() < 0.05) {
        snd("kick");
        ball.vx = -5.5;
        ball.vy = (Math.random() - 0.5) * 4;
        ball.holder = null;
      }
    } else {
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= 0.98;
      ball.vy *= 0.98;

      // Sponda Superiore e Inferiore
      if (ball.y <= 18 || ball.y >= 192) {
        ball.vy = -ball.vy * 1.05; // rimbalzo elastico accelerato
        ball.y = ball.y <= 18 ? 19 : 191;
        snd("bounce");
      }

      // Sponde laterali fuori dai pali
      if ((ball.x <= 16 || ball.x >= 344) && (ball.y < 80 || ball.y > 130)) {
        ball.vx = -ball.vx * 1.05;
        ball.x = ball.x <= 16 ? 17 : 343;
        snd("bounce");
      }

      // Gol Squadra A (destra)
      if (ball.x >= 345 && ball.y >= 80 && ball.y <= 130) {
        scoreGoal(st, "A");
      }
      // Gol Squadra B (sinistra)
      else if (ball.x <= 15 && ball.y >= 80 && ball.y <= 130) {
        scoreGoal(st, "B");
      }
    }

    // Effetto Riflettore di Guardia
    if (Math.abs(ball.x - st.searchlightX) < 28) {
      if (ball.holder && ball.holder.team === "A") {
        st.alertMeter += 0.8;
        if (st.alertMeter > 100) {
          st.alertMeter = 0;
          snd("siren");
          // Scatta l'intercettazione delle guardie
          ball.holder = null;
          ball.vx = -3;
          ball.vy = (Math.random() - 0.5) * 2;
        }
      }
    } else {
      st.alertMeter = Math.max(0, st.alertMeter - 0.2);
    }
  }

  function scoreGoal(st, team) {
    if (team === "A") st.a++;
    else st.b++;
    snd("goal");

    const scA = st.wrap.querySelector("#alcScoreA");
    const scB = st.wrap.querySelector("#alcScoreB");
    if (scA) scA.textContent = st.a;
    if (scB) scB.textContent = st.b;

    const msg = st.wrap.querySelector("#alcMsg");
    if (msg) {
      msg.textContent = team === "A" ? "⚽ GOOOL DELLA RONDINE! ⚽" : "🚨 GOL DELLE GUARDIE! 🚨";
      msg.style.display = "flex";
      setTimeout(() => { if (msg) msg.style.display = "none"; }, 1400);
    }

    // Reset ball to center
    st.ball.x = 180;
    st.ball.y = 105;
    st.ball.vx = 0;
    st.ball.vy = 0;
    st.ball.holder = null;

    if (st.a >= 3 || st.b >= 3) {
      setTimeout(() => endGame(st), 1000);
    }
  }

  function render(st) {
    const { ctx, searchlightX, players, ball } = st;

    // Asfalto del cortile
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, W, H);

    // Mura di cinta e griglia metallica
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, 14);
    ctx.fillRect(0, H - 14, W, 14);
    ctx.fillRect(0, 0, 14, H);
    ctx.fillRect(W - 14, 0, 14, H);

    // Linee delle sponde metalliche (righe diagonali d'acciaio)
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    for (let x = 14; x < W - 14; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 10, 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, H - 14);
      ctx.lineTo(x + 10, H);
      ctx.stroke();
    }

    // Linee di campo (gesso scrostato)
    ctx.strokeStyle = "rgba(148,163,184,0.4)";
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.beginPath();
    ctx.moveTo(W / 2, 20);
    ctx.lineTo(W / 2, H - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 28, 0, Math.PI * 2);
    ctx.stroke();

    // Porte (sinistra e destra)
    ctx.fillStyle = "rgba(56,189,248,0.2)";
    ctx.fillRect(6, 80, 12, 50);
    ctx.fillStyle = "rgba(245,158,11,0.2)";
    ctx.fillRect(W - 18, 80, 12, 50);
    ctx.strokeStyle = "#94a3b8";
    ctx.strokeRect(6, 80, 12, 50);
    ctx.strokeRect(W - 18, 80, 12, 50);

    // Fascio del Riflettore Mobile (Giallo/Azzurro trasparente)
    ctx.save();
    const beamGrad = ctx.createLinearGradient(searchlightX, 0, searchlightX, H);
    beamGrad.addColorStop(0, "rgba(250,204,21,0.45)");
    beamGrad.addColorStop(0.3, "rgba(250,204,21,0.25)");
    beamGrad.addColorStop(1, "rgba(250,204,21,0.08)");
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(searchlightX - 8, 0);
    ctx.lineTo(searchlightX + 8, 0);
    ctx.lineTo(searchlightX + 38, H);
    ctx.lineTo(searchlightX - 38, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Giocatori
    players.forEach((p) => {
      ctx.save();
      // Ombra
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 7, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo / maglia
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.team === "A" ? "#e0f2fe" : "#fef3c7";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Indicatore Campione
      if (p.id === "hero") {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 11);
        ctx.lineTo(p.x - 3, p.y - 15);
        ctx.lineTo(p.x + 3, p.y - 15);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });

    // Palla
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(ball.x, ball.y + 4, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function endGame(st) {
    if (!st.running) return;
    st.running = false;
    clearInterval(st.timerInterval);
    if (st.cleanupEvents) st.cleanupEvents();
    snd("whistle");

    const win = st.a > st.b;
    const ov = document.createElement("div");
    ov.style.cssText = "position:absolute;inset:0;background:rgba(15,23,42,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f1f5f9;text-align:center;padding:20px;z-index:1000;";
    ov.innerHTML = `
      <div style="font-size:26px;font-weight:bold;margin-bottom:8px;color:${win ? "#38bdf8" : "#f59e0b"}">
        ${win ? "🏆 VITTORIA NEL CORTILE! 🏆" : "🚨 TRIPLICE FISCHIO DEL DIRETTORE"}
      </div>
      <div style="font-size:32px;font-weight:bold;margin-bottom:12px;">
        ${st.a} - ${st.b}
      </div>
      <div style="font-size:13px;color:#94a3b8;max-width:320px;margin-bottom:16px;">
        ${win ? "I rimbalzi a parete hanno disorientato le guardie! I detenuti del Braccio Ovest festeggiano battendo le scodelle di latta." : "Le guardie hanno serrato i ranghi, ma la squadra ha dimostrato il proprio valore sulle sponde."}
      </div>
      <button type="button" id="alcDoneBtn" style="padding:12px 24px;font-size:16px;font-weight:bold;background:#0284c7;color:#fff;border:none;border-radius:8px;cursor:pointer;">
        CONTINUA ▸
      </button>
    `;
    st.wrap.appendChild(ov);

    const btn = ov.querySelector("#alcDoneBtn");
    btn.onclick = () => {
      if (st.wrap && st.wrap.parentNode) st.wrap.parentNode.removeChild(st.wrap);
      if (window.__sagaCore && window.__sagaCore.endMatch) window.__sagaCore.endMatch();
      if (st.opts && st.opts.onDone) {
        st.opts.onDone({ a: st.a, b: st.b, win, quit: false });
      }
    };
  }

  window.__alcatrazMatch = {
    start,
    state: null
  };
})();
