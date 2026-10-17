// js/quaderno.js - TACTICS NOTE · Motore di partita originale per «Tactics Note · Il Quaderno del Giudizio»
// Sfida calcistica e psicologica a mente aperta ispirata a Death Note:
// - Lavagna di deduzione in tempo reale con le mosse tattiche dell'avversario
// - Finestra di 40 decimi per "scrivere" la contromossa esatta sul Quaderno
// - Contrattacco immediato con parabola a scavalcare la difesa
// Comandi: Tasti 1, 2, 3 / Frecce o Tocco sui pulsanti tattici a schermo
(function () {
  "use strict";
  if (window.__quaderno) return;

  let state = null;
  let animId = null;

  function start(opts) {
    opts = opts || {};
    const onDone = opts.onDone || opts.done || function () {};
    const core = window.__sagaCore;
    const oppName = opts.opp || (core && core.cur && core.cur.title) || (opts.hero && opts.hero.name ? "Undici di Kira" : "Undici di Kira");
    const teamTitle = typeof oppName === "object" ? (oppName.name || "Undici di Kira") : String(oppName);

    const old = document.getElementById("quadernoWrap");
    if (old) old.remove();

    const wrap = document.createElement("div");
    wrap.id = "quadernoWrap";
    wrap.style.cssText = "position:fixed;inset:0;z-index:99999;background:#050508;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Courier New',Courier,monospace;color:#f8fafc;touch-action:none;user-select:none;overflow:hidden;";

    wrap.innerHTML = `
      <div style="width:100%;max-width:480px;padding:8px 14px;background:#0f172a;border-bottom:2px solid #ef4444;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;">
        <div>
          <span style="font-weight:bold;color:#f8fafc;font-size:15px;letter-spacing:1px;">📓 TACTICS NOTE</span>
          <div style="font-size:11px;color:#94a3b8;" id="qdVs">VS ${teamTitle}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="text-align:right;">
            <span id="qdScore" style="font-size:18px;font-weight:bold;color:#ef4444;">0 - 0</span>
            <div id="qdTime" style="font-size:11px;color:#cbd5e1;">Mossa 1/6</div>
          </div>
          <button type="button" id="qdQuitBtn" style="background:#334155;color:#f8fafc;border:1px solid #64748b;padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;">✕ Esci</button>
        </div>
      </div>
      <div style="position:relative;width:100%;max-width:480px;aspect-ratio:4/3;max-height:60vh;background:#090d16;border:2px solid #334155;overflow:hidden;box-sizing:border-box;">
        <canvas id="qdCanvas" width="400" height="300" style="display:block;width:100%;height:100%;image-rendering:pixelated;"></canvas>
        <div id="qdCountdown" style="position:absolute;top:10px;right:14px;background:rgba(239,68,68,0.25);border:1px solid #ef4444;padding:4px 8px;border-radius:4px;font-weight:bold;font-size:14px;color:#f87171;">12s</div>
        <div id="qdToast" style="position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,0.95);padding:5px 12px;border-radius:4px;border:1px solid #94a3b8;font-size:12px;color:#f8fafc;pointer-events:none;opacity:0;transition:opacity 0.2s;text-align:center;max-width:90%;"></div>
      </div>
      <div style="width:100%;max-width:480px;padding:8px 12px;background:#020617;display:flex;flex-direction:column;gap:6px;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
          <span>Mossa Avversaria: <b id="qdMossa" style="color:#f87171;">Pressing Asfissiante</b></span>
          <span>Intuito: <b id="qdIntuito" style="color:#38bdf8;">100%</b></span>
        </div>
        <div id="qdHint" style="font-size:12px;color:#fbbf24;min-height:15px;">Ti saltano addosso: gioca d'anticipo.</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
          <button type="button" id="qdBtn1" style="background:#1e293b;color:#f8fafc;border:1px solid #475569;padding:9px 4px;border-radius:6px;font-weight:bold;font-size:12px;cursor:pointer;">1. ANTICIPO ⚡</button>
          <button type="button" id="qdBtn2" style="background:#1e293b;color:#f8fafc;border:1px solid #475569;padding:9px 4px;border-radius:6px;font-weight:bold;font-size:12px;cursor:pointer;">2. TRAPPOLA 📐</button>
          <button type="button" id="qdBtn3" style="background:#1e293b;color:#f8fafc;border:1px solid #475569;padding:9px 4px;border-radius:6px;font-weight:bold;font-size:12px;cursor:pointer;">3. LANCIO 🚀</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    // Spiegazione prima di iniziare: il tempo resta fermo finché non premi il pulsante
    const tut = document.createElement("div");
    tut.style.cssText = "position:absolute;inset:0;z-index:5;background:rgba(2,6,23,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:18px;text-align:left;font-size:13px;line-height:1.45;overflow:auto;";
    tut.innerHTML = `<div style="max-width:420px;">
      <div style="font-size:17px;font-weight:bold;color:#f87171;margin-bottom:6px;">📓 Come si gioca</div>
      <div>Sfida a <b>${teamTitle}</b> in <b>6 mosse</b>. Ogni mossa l'avversario prepara una giocata: leggi il nome e l'indizio in giallo, poi scegli la <b>contromossa giusta</b> prima che scada il tempo (12 secondi, con calma).</div>
      <div style="margin:8px 0;border-left:3px solid #ef4444;padding-left:8px;">
        <b>1. ANTICIPO ⚡</b> contro Pressing e Gabbia (ti saltano addosso)<br>
        <b>2. TRAPPOLA 📐</b> contro Incursione e Finta (qualcuno scatta alle spalle)<br>
        <b>3. LANCIO 🚀</b> contro Catenaccio e Muro (sono tutti dietro)
      </div>
      <div>Giusta = <b>gol tuo</b> e Intuito su. Sbagliata o tempo scaduto = <b>gol loro</b>. Vinci se segni più di loro. Tasti 1, 2, 3 o tocca i pulsanti.</div>
      <button type="button" id="qdGo" style="margin-top:12px;width:100%;background:#ef4444;color:#fff;border:0;padding:12px;border-radius:6px;font-weight:bold;font-size:14px;cursor:pointer;">Ho capito, inizia ▸</button>
    </div>`;
    wrap.appendChild(tut);
    wrap.style.position = "fixed";
    tut.querySelector("#qdGo").onclick = () => { tut.remove(); locked = false; lastT = performance.now(); };

    const canvas = document.getElementById("qdCanvas");
    const ctx = canvas.getContext("2d");

    const MOVES = [
      { name: "Pressing Asfissiante", correct: 1, resp: "ANTICIPO TATTICO!", hint: "Ti saltano addosso: gioca d'anticipo." },
      { name: "Incursione a Sorpresa", correct: 2, resp: "TRAPPOLA DEL FUORIGIOCO!", hint: "Uno scatta alle spalle: tendi la trappola." },
      { name: "Catenaccio Difensivo", correct: 3, resp: "LANCIO LUNGO!", hint: "Sono tutti dietro: scavalca con un lancio." },
      { name: "Trappola della Gabbia", correct: 1, resp: "ANTICIPO RAPIDO!", hint: "Ti chiudono in gabbia: anticipa prima." },
      { name: "Finta dell'Ala", correct: 2, resp: "TRAPPOLA DEL FUORIGIOCO!", hint: "L'ala finge e scatta: tendi la trappola." },
      { name: "Muro Alto", correct: 3, resp: "LANCIO LUNGO!", hint: "Linea alta e compatta: scavalca con un lancio." }
    ];
    const ROUNDS = 6, TIME = 12, LOCK = 1.5;
    let round = 1, locked = true, lastT = 0, lockLeft = 0;

    let currentMoveIdx = 0;
    let moveCountdown = TIME;
    let scorePlayer = 0, scoreOpp = 0;
    let matchTime = 10;
    let intuito = 100;
    let isGameOver = false;
    let frame = 0;

    let heroX = 140, heroY = 220;
    let oppX = 260, oppY = 120;
    let ballX = 200, ballY = 160;
    let ballTargetX = 200, ballTargetY = 160;

    function toast(msg) {
      const el = document.getElementById("qdToast");
      if (!el) return;
      el.textContent = msg;
      el.style.opacity = "1";
      setTimeout(() => { if (el) el.style.opacity = "0"; }, 1900);
    }

    function chooseCounter(choice) {
      if (isGameOver || locked) return;
      const cur = MOVES[currentMoveIdx];
      if (choice === cur.correct) {
        scorePlayer++;
        toast(`✨ ESATTO! ${cur.resp} GOL AL VOLO!`);
        ballTargetX = 350; ballTargetY = 60;
        intuito = Math.min(100, intuito + 10);
      } else {
        scoreOpp++;
        toast(`❌ Deduzione errata! L'avversario va in rete!`);
        ballTargetX = 50; ballTargetY = 240;
        intuito = Math.max(0, intuito - 20);
      }
      endRound();
      updateHud();
    }

    // Dopo ogni mossa: pausa per leggere l'esito, poi la prossima o il fischio finale
    function endRound() {
      locked = true; lockLeft = LOCK;
    }

    function nextMove() {
      if (round >= ROUNDS) { finish(scorePlayer > scoreOpp || (scorePlayer === scoreOpp && intuito >= 50)); return; }
      round++;
      let n; do { n = Math.floor(Math.random() * MOVES.length); } while (n === currentMoveIdx);
      currentMoveIdx = n;
      moveCountdown = TIME; locked = false;
      const mEl = document.getElementById("qdMossa"), hEl = document.getElementById("qdHint");
      if (mEl) mEl.textContent = MOVES[currentMoveIdx].name;
      if (hEl) hEl.textContent = MOVES[currentMoveIdx].hint;
    }

    function updateHud() {
      const sEl = document.getElementById("qdScore");
      const tEl = document.getElementById("qdTime");
      const cEl = document.getElementById("qdCountdown");
      const iEl = document.getElementById("qdIntuito");
      if (sEl) sEl.textContent = `${scorePlayer} - ${scoreOpp}`;
      if (tEl) tEl.textContent = `Mossa ${round}/${ROUNDS}`;
      if (cEl) cEl.textContent = `${Math.max(0, Math.ceil(moveCountdown))}s`;
      if (iEl) iEl.textContent = `${intuito}%`;
    }

    const b1 = document.getElementById("qdBtn1");
    const b2 = document.getElementById("qdBtn2");
    const b3 = document.getElementById("qdBtn3");
    const bQuit = document.getElementById("qdQuitBtn");
    if (b1) b1.onclick = () => chooseCounter(1);
    if (b2) b2.onclick = () => chooseCounter(2);
    if (b3) b3.onclick = () => chooseCounter(3);
    if (bQuit) bQuit.onclick = () => finish(false, true);

    const keyHandler = (e) => {
      if (e.key === "1") chooseCounter(1);
      else if (e.key === "2") chooseCounter(2);
      else if (e.key === "3") chooseCounter(3);
      else if (e.key === "Escape") finish(false, true);
    };
    window.addEventListener("keydown", keyHandler);

    function finish(win, quit = false) {
      if (isGameOver) return;
      isGameOver = true;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("keydown", keyHandler);
      if (win === undefined) win = scorePlayer >= scoreOpp;
      if (wrap) wrap.remove();
      if (core && core.endMatch) core.endMatch();
      onDone({ a: scorePlayer, b: scoreOpp, win: !!win, quit: !!quit, data: { intuito } });
    }

    state = {
      finish,
      setScore(a, b) { scorePlayer = a; scoreOpp = b; updateHud(); },
      getState() { return { scorePlayer, scoreOpp, matchTime, intuito }; }
    };
    window.__quaderno.state = state;

    function loop() {
      frame++;
      const now = performance.now(), dt = Math.min(0.1, (now - (lastT || now)) / 1000); lastT = now;
      if (locked && lockLeft > 0) {
        lockLeft -= dt;
        if (lockLeft <= 0) { lockLeft = 0; nextMove(); updateHud(); }
      } else if (!locked) {
        moveCountdown -= dt;
        if (moveCountdown <= 0) {
          scoreOpp++;
          toast("Tempo scaduto! L'avversario va in rete!");
          ballTargetX = 50; ballTargetY = 240;
          endRound();
        }
        updateHud();
      }

      // Ball physics
      ballX += (ballTargetX - ballX) * 0.15;
      ballY += (ballTargetY - ballY) * 0.15;

      // Draw game
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, 400, 300);

      // Field lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 20, 340, 260);
      ctx.beginPath();
      ctx.moveTo(200, 20); ctx.lineTo(200, 280);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(200, 150, 40, 0, Math.PI * 2);
      ctx.stroke();

      // Atmospheric dark aura & Ryuk's presence
      const auraAlpha = 0.12 + 0.08 * Math.sin(frame * 0.05);
      ctx.fillStyle = `rgba(239, 68, 68, ${auraAlpha})`;
      ctx.fillRect(0, 0, 400, 300);

      // Opponent (Red Aura - Light/Kira)
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(oppX, oppY, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 9px monospace";
      ctx.fillText("KIRA XI", oppX - 16, oppY - 16);

      // Player (Blue/White Aura - Campione/L)
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(heroX, heroY, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 9px monospace";
      ctx.fillText("CAMPIONE", heroX - 22, heroY + 24);

      // Ball
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Shinigami Apple icon in corner
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(360, 45, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(359, 34, 2, 4);

      animId = requestAnimationFrame(loop);
    }

    updateHud();
    animId = requestAnimationFrame(loop);
    return true;
  }

  window.__quaderno = {
    start,
    state: null
  };
})();
