// js/alcatraz2-arcade.js - Cabinato Arcade «SUB-WATER HEIST '95»
// Minigioco arcade 16-bit a gettoni ambientato nei cunicoli allagati di Alcatraz:
//  - Guida il Campione a nuoto tra paratie metalliche, getti di vapore e sensori laser.
//  - Calcia la sfera galleggiante contro i sensori a parete per disattivare le chiuse.
//  - 3 Valvole colorate (Rosso, Giallo, Blu) da azionare entro 60 secondi.
(function () {
  "use strict";
  if (window.__alcatraz2Arcade) return;

  const W = 320, H = 200;

  function launch(onDone) {
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.98);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:'Courier New', monospace;color:#f8fafc;user-select:none;";

    const box = document.createElement("div");
    box.style.cssText = "width:100%;max-width:680px;background:#0f172a;border:3px solid #0284c7;border-radius:12px;overflow:hidden;box-shadow:0 0 35px rgba(2,132,199,0.5);display:flex;flex-direction:column;";

    const topBar = document.createElement("div");
    topBar.style.cssText = "background:#0284c7;color:#fff;padding:8px 16px;display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:14px;";
    topBar.innerHTML = `
      <span>🕹️ SUB-WATER HEIST '95 · CABINATO ARCADE</span>
      <button id="alc2ArcadeClose" style="background:#0f172a;color:#f8fafc;border:none;border-radius:4px;padding:3px 8px;cursor:pointer;font-weight:bold;">✖ CHIUDI</button>
    `;
    box.appendChild(topBar);

    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    cv.style.cssText = "width:100%;aspect-ratio:320/200;background:#020617;display:block;";
    box.appendChild(cv);

    const botBar = document.createElement("div");
    botBar.style.cssText = "background:#1e293b;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;font-size:12px;";
    botBar.innerHTML = `
      <div style="color:#94a3b8;">Nuota: [WASD / Frecce] · Calcia sfera: [Spazio / Click]</div>
      <div>Tempo: <b id="alc2ArcadeTime" style="color:#facc15;">60</b>s · Valvole: <b id="alc2ArcadeValves" style="color:#38bdf8;">0/3</b></div>
    `;
    box.appendChild(botBar);
    wrap.appendChild(box);
    document.body.appendChild(wrap);

    const ctx = cv.getContext("2d");
    let running = true;
    let timer = 60;
    let valvesDone = 0;
    let score = 0;

    const player = { x: 40, y: 100, vx: 0, vy: 0, r: 7 };
    const ball = { x: 70, y: 100, vx: 0, vy: 0, r: 5 };
    const valves = [
      { x: 120, y: 35, col: "#ef4444", hit: false, label: "R" },
      { x: 200, y: 165, col: "#facc15", hit: false, label: "G" },
      { x: 270, y: 45, col: "#38bdf8", hit: false, label: "B" }
    ];
    const target = { x: 295, y: 100, w: 14, h: 45, open: false };
    const steamJets = [
      { x: 160, y: 0, h: 75, timer: 0 },
      { x: 235, y: 125, h: 75, timer: 20 }
    ];

    const keys = {};
    window.addEventListener("keydown", (e) => {
      keys[e.key.toLowerCase()] = true;
      if (e.code === "Space") kickBall();
    });
    window.addEventListener("keyup", (e) => {
      keys[e.key.toLowerCase()] = false;
    });

    cv.addEventListener("pointerdown", () => kickBall());

    function kickBall() {
      const d = Math.hypot(player.x - ball.x, player.y - ball.y);
      if (d < 24) {
        const ang = Math.atan2(ball.y - player.y, ball.x - player.x);
        ball.vx = Math.cos(ang) * 4.8;
        ball.vy = Math.sin(ang) * 4.8;
      }
    }

    const tInterval = setInterval(() => {
      if (!running) return;
      timer--;
      box.querySelector("#alc2ArcadeTime").textContent = timer;
      if (timer <= 0) {
        endArcade(false);
      }
    }, 1000);

    let reqId = null;
    function loop() {
      if (!running) return;
      // Aggiorna player
      let dx = 0, dy = 0;
      if (keys["w"] || keys["arrowup"]) dy -= 1;
      if (keys["s"] || keys["arrowdown"]) dy += 1;
      if (keys["a"] || keys["arrowleft"]) dx -= 1;
      if (keys["d"] || keys["arrowright"]) dx += 1;
      if (dx !== 0 || dy !== 0) {
        const l = Math.hypot(dx, dy);
        player.vx = (dx / l) * 2.2;
        player.vy = (dy / l) * 2.2;
      } else {
        player.vx *= 0.88;
        player.vy *= 0.88;
      }
      player.x += player.vx;
      player.y += player.vy;
      player.x = Math.max(12, Math.min(W - 12, player.x));
      player.y = Math.max(12, Math.min(H - 12, player.y));

      // Aggiorna palla
      ball.vx *= 0.985;
      ball.vy *= 0.985;
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Rimbalzo pareti
      if (ball.x - ball.r < 10) { ball.x = 10 + ball.r; ball.vx *= -1; }
      if (ball.x + ball.r > W - 10) {
        if (target.open && ball.y > target.y - target.h / 2 && ball.y < target.y + target.h / 2) {
          endArcade(true);
          return;
        }
        ball.x = W - 10 - ball.r; ball.vx *= -1;
      }
      if (ball.y - ball.r < 10) { ball.y = 10 + ball.r; ball.vy *= -1; }
      if (ball.y + ball.r > H - 10) { ball.y = H - 10 - ball.r; ball.vy *= -1; }

      // Interazione player - palla
      const pd = Math.hypot(player.x - ball.x, player.y - ball.y);
      if (pd < player.r + ball.r) {
        const ang = Math.atan2(ball.y - player.y, ball.x - player.x);
        ball.vx = Math.cos(ang) * 2.5;
        ball.vy = Math.sin(ang) * 2.5;
      }

      // Valvole colpite dalla palla
      valves.forEach((v) => {
        if (!v.hit && Math.hypot(ball.x - v.x, ball.y - v.y) < ball.r + 9) {
          v.hit = true;
          valvesDone++;
          box.querySelector("#alc2ArcadeValves").textContent = `${valvesDone}/3`;
          if (valvesDone >= 3) {
            target.open = true;
          }
        }
      });

      // Disegna
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, W, H);

      // Linee griglia metallica
      ctx.strokeStyle = "rgba(12,74,110,0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Vapore bollente
      steamJets.forEach((s) => {
        s.timer = (s.timer + 1) % 60;
        if (s.timer < 35) {
          ctx.fillStyle = "rgba(241,245,249,0.3)";
          ctx.fillRect(s.x - 6, s.y, 12, s.h);
          if (Math.hypot(player.x - s.x, player.y - (s.y + s.h / 2)) < 18) {
            player.x -= 2.5; // repulsione vapore
          }
        }
      });

      // Valvole colorate
      valves.forEach((v) => {
        ctx.fillStyle = v.hit ? "#22c55e" : v.col;
        ctx.beginPath();
        ctx.arc(v.x, v.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(v.label, v.x, v.y + 3);
      });

      // Chiusa finale
      ctx.fillStyle = target.open ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.8)";
      ctx.fillRect(target.x, target.y - target.h / 2, target.w, target.h);
      ctx.strokeStyle = target.open ? "#22c55e" : "#ef4444";
      ctx.strokeRect(target.x, target.y - target.h / 2, target.w, target.h);

      // Palla
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0284c7";
      ctx.stroke();

      // Giocatore
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      reqId = requestAnimationFrame(loop);
    }
    reqId = requestAnimationFrame(loop);

    function endArcade(win) {
      if (!running) return;
      running = false;
      clearInterval(tInterval);
      cancelAnimationFrame(reqId);
      const resDiv = document.createElement("div");
      resDiv.style.cssText = "position:absolute;inset:0;background:rgba(2,6,23,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;";
      resDiv.innerHTML = `
        <div style="font-size:24px;font-weight:900;color:${win ? "#22c55e" : "#ef4444"};margin-bottom:8px;">
          ${win ? "🎉 HEIST COMPLETATO!" : "💥 TEMPO SCADUTO!"}
        </div>
        <div style="font-size:14px;color:#94a3b8;margin-bottom:16px;">
          ${win ? "Hai aperto la chiusa idraulica e raggiunto il settore sicuro!" : "La camera di compensazione è andata in blocco."}
        </div>
        <button id="alc2ArcadeExit" style="padding:10px 24px;background:#0284c7;color:#fff;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">
          CHIUDI CABINATO
        </button>
      `;
      box.appendChild(resDiv);
      resDiv.querySelector("#alc2ArcadeExit").onclick = () => {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (onDone) onDone(win);
      };
    }

    box.querySelector("#alc2ArcadeClose").onclick = () => {
      running = false;
      clearInterval(tInterval);
      cancelAnimationFrame(reqId);
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (onDone) onDone(false);
    };
  }

  window.__alcatraz2Arcade = { launch };
})();
