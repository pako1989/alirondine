// js/pedinamento.js - PEDINAMENTO TATTICO · Motore di partita originale noir per «Operazione Fuorigioco Noir · Milano 1954»
// Il Campione gioca una partita tattica sotto i riflettori e la nebbia dell'Arena Civica:
// - Campo a griglia notturna con coni d'ombra proiettati dai piloni della luce
// - Marcatura serrata a uomo sul portatore di palla avversario e anticipo sulle linee di passaggio
// - Intercettazione pulita della sfera senza farsi fischiare fallo dall'arbitro corrotto
// - Ripartenza rapida in contropiede con tiro rasoterra a fil di palo
// Comandi: Tasti Freccia / WASD o Tocco/Swipe a schermo · Barra Spazio per scatto e anticipo
(function () {
  "use strict";
  if (window.__pedinamento) return;

  let state = null;
  let animId = null;

  function start(opts) {
    opts = opts || {};
    const onDone = opts.onDone || function () {};
    const core = window.__sagaCore;
    const curOpts = (core && core.cur && core.cur.opts) || {};
    const oppName = opts.opp || (core && core.cur && core.cur.title) || "Banda dei Bastioni '54";

    // Rimuovi eventuali container precedenti
    const old = document.getElementById("pedinamentoWrap");
    if (old) old.remove();

    const wrap = document.createElement("div");
    wrap.id = "pedinamentoWrap";
    wrap.style.cssText = "position:fixed;inset:0;z-index:99999;background:#090d16;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Courier New',Courier,monospace;color:#e2e8f0;touch-action:none;user-select:none;overflow:hidden;";

    wrap.innerHTML = `
      <div style="width:100%;max-width:480px;padding:8px 12px;background:#111827;border-bottom:2px solid #475569;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;">
        <div>
          <span style="font-weight:bold;color:#f1f5f9;font-size:15px;letter-spacing:1px;">🕵️ PEDINAMENTO TATTICO '54</span>
          <div style="font-size:11px;color:#94a3b8;" id="pedVs">VS ${oppName}</div>
        </div>
        <div style="text-align:right;">
          <span id="pedScore" style="font-size:18px;font-weight:bold;color:#38bdf8;">0 - 0</span>
          <div id="pedTime" style="font-size:11px;color:#cbd5e1;">Min 15'</div>
        </div>
      </div>
      <div style="position:relative;width:100%;max-width:480px;aspect-ratio:4/3;max-height:64vh;background:#1e293b;border:2px solid #334155;overflow:hidden;box-sizing:border-box;">
        <canvas id="pedCanvas" width="400" height="300" style="display:block;width:100%;height:100%;image-rendering:pixelated;"></canvas>
        <div id="pedToast" style="position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,0.9);padding:4px 10px;border-radius:4px;border:1px solid #64748b;font-size:12px;color:#f8fafc;pointer-events:none;opacity:0;transition:opacity 0.2s;"></div>
      </div>
      <div style="width:100%;max-width:480px;padding:8px 12px;background:#0f172a;display:flex;flex-direction:column;gap:6px;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
          <span>Ombra Tattica: <b id="pedShadow">In Ombra</b></span>
          <span>Fiuto: <b id="pedFiuto" style="color:#38bdf8;">100%</b></span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
          <button type="button" id="pedBtnLeft" style="background:#1e293b;color:#f8fafc;border:1px solid #475569;padding:10px;border-radius:6px;font-weight:bold;font-size:16px;">◀</button>
          <button type="button" id="pedBtnAction" style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:10px;border-radius:6px;font-weight:bold;font-size:13px;">ANTICIPO ⚡</button>
          <button type="button" id="pedBtnRight" style="background:#1e293b;color:#f8fafc;border:1px solid #475569;padding:10px;border-radius:6px;font-weight:bold;font-size:16px;">▶</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const canvas = document.getElementById("pedCanvas");
    const ctx = canvas.getContext("2d");

    let heroX = 200, heroY = 240, heroTargetX = 200;
    let ballX = 200, ballY = 120, ballVx = 1.2, ballVy = 1.0;
    let oppX = 200, oppY = 80, oppVx = 1.5;
    let scorePlayer = 0, scoreOpp = 0;
    let matchTime = 15;
    let fiuto = 100;
    let inShadow = true;
    let frame = 0;
    let isGameOver = false;

    function toast(msg) {
      const el = document.getElementById("pedToast");
      if (!el) return;
      el.textContent = msg;
      el.style.opacity = "1";
      setTimeout(() => { if (el) el.style.opacity = "0"; }, 1400);
    }

    function doAnticipo() {
      if (isGameOver) return;
      const dx = Math.abs(heroX - ballX);
      const dy = Math.abs(heroY - ballY);
      if (dx < 35 && dy < 40) {
        // Intercetto riuscito!
        scorePlayer++;
        toast("⚡ GRANDE ANTICIPO SUL PALLONE! GOL DI RIMESSA!");
        ballVy = -4.5;
        ballVx = (Math.random() - 0.5) * 2;
        heroY = 240;
      } else {
        fiuto = Math.max(0, fiuto - 15);
        toast("Fallo mancato! L'arbitro ti tiene d'occhio!");
      }
      updateHud();
    }

    function updateHud() {
      const sEl = document.getElementById("pedScore");
      const tEl = document.getElementById("pedTime");
      const shEl = document.getElementById("pedShadow");
      const fEl = document.getElementById("pedFiuto");
      if (sEl) sEl.textContent = `${scorePlayer} - ${scoreOpp}`;
      if (tEl) tEl.textContent = `Min ${Math.min(90, Math.floor(matchTime))}'`;
      if (shEl) shEl.innerHTML = inShadow ? "<span style='color:#38bdf8;'>In Ombra 🕶️</span>" : "<span style='color:#f87171;'>Sotto il Riflettore 💡</span>";
      if (fEl) fEl.textContent = `${fiuto}%`;
    }

    // Comandi touch
    const btnL = document.getElementById("pedBtnLeft");
    const btnR = document.getElementById("pedBtnRight");
    const btnA = document.getElementById("pedBtnAction");
    if (btnL) btnL.onclick = () => { heroTargetX = Math.max(40, heroTargetX - 45); };
    if (btnR) btnR.onclick = () => { heroTargetX = Math.min(360, heroTargetX + 45); };
    if (btnA) btnA.onclick = doAnticipo;

    // Comandi tastiera
    const keyHandler = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        heroTargetX = Math.max(40, heroTargetX - 40);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        heroTargetX = Math.min(360, heroTargetX + 40);
      } else if (e.key === " " || e.key === "Enter") {
        doAnticipo();
      }
    };
    window.addEventListener("keydown", keyHandler);

    // Gestione touch sul canvas
    canvas.addEventListener("pointerdown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      heroTargetX = Math.max(40, Math.min(360, clickX));
      if (e.clientY - rect.top > rect.height * 0.7) {
        doAnticipo();
      }
    });

    function finish(win) {
      if (isGameOver) return;
      isGameOver = true;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("keydown", keyHandler);
      if (win === undefined) win = scorePlayer >= scoreOpp;
      if (wrap) wrap.remove();
      if (core && core.endMatch) core.endMatch();
      onDone({ a: scorePlayer, b: scoreOpp, win: !!win, quit: false });
    }

    state = {
      finish,
      setScore(a, b) { scorePlayer = a; scoreOpp = b; updateHud(); },
      getState() { return { scorePlayer, scoreOpp, matchTime, fiuto }; }
    };
    window.__pedinamento.state = state;

    function loop() {
      frame++;
      matchTime += 0.08;

      // Movimento fluido del Campione
      heroX += (heroTargetX - heroX) * 0.2;

      // Movimento avversario
      oppX += oppVx;
      if (oppX < 60 || oppX > 340) oppVx = -oppVx;

      // Fisica del pallone
      ballX += ballVx;
      ballY += ballVy;
      if (ballX < 30 || ballX > 370) ballVx = -ballVx;

      // Pallone torna giù se tirato o rimbalza
      if (ballY < 50) {
        ballVy = 1.6;
        ballVx = (Math.random() - 0.5) * 3;
      }
      if (ballY > 260) {
        if (Math.abs(ballX - heroX) > 55) {
          scoreOpp++;
          toast("Gol della Banda dei Bastioni!");
          ballX = 200; ballY = 80; ballVy = 1.2;
        } else {
          ballVy = -2.0;
        }
        updateHud();
      }

      // Coni di luce / riflettori mobili
      const lightBeamX = 200 + Math.sin(frame * 0.03) * 110;
      inShadow = Math.abs(heroX - lightBeamX) > 60;

      if (!inShadow && frame % 45 === 0) {
        fiuto = Math.max(0, fiuto - 2);
        updateHud();
      }

      // Disegno canvas in stile Noir 1954
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, 400, 300);

      // Linee del campo in gesso sbiadite
      ctx.strokeStyle = "rgba(226, 232, 240, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 20, 340, 260);
      ctx.beginPath();
      ctx.moveTo(30, 150); ctx.lineTo(370, 150);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(200, 150, 40, 0, Math.PI * 2);
      ctx.stroke();

      // Fascio di luce del riflettore
      const grad = ctx.createRadialGradient(lightBeamX, 150, 10, lightBeamX, 150, 90);
      grad.addColorStop(0, "rgba(254, 240, 138, 0.35)");
      grad.addColorStop(1, "rgba(254, 240, 138, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lightBeamX, 150, 90, 0, Math.PI * 2);
      ctx.fill();

      // Nebbia volumetrica in movimento
      for (let i = 0; i < 4; i++) {
        const fogX = ((frame * 0.4 + i * 100) % 500) - 50;
        const fogY = 50 + i * 50;
        ctx.fillStyle = "rgba(203, 213, 225, 0.06)";
        ctx.beginPath();
        ctx.arc(fogX, fogY, 65, 0, Math.PI * 2);
        ctx.fill();
      }

      // Avversario (Banda dei Bastioni)
      ctx.fillStyle = "#991b1b";
      ctx.beginPath();
      ctx.arc(oppX, oppY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 9px monospace";
      ctx.fillText("BANDA", oppX - 14, oppY - 14);

      // Campione (In impermeabile e trench)
      ctx.fillStyle = inShadow ? "#0284c7" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(heroX, heroY, 12, 0, Math.PI * 2);
      ctx.fill();
      // Borsalino
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(heroX - 9, heroY - 13, 18, 4);
      ctx.fillRect(heroX - 6, heroY - 19, 12, 7);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 9px monospace";
      ctx.fillText("CAMPIONE", heroX - 20, heroY + 22);

      // Pallone di cuoio '54 con cuciture
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (matchTime >= 90) {
        finish(scorePlayer >= scoreOpp);
        return;
      }

      animId = requestAnimationFrame(loop);
    }

    updateHud();
    animId = requestAnimationFrame(loop);
  }

  window.__pedinamento = {
    start,
    state: null
  };
})();
