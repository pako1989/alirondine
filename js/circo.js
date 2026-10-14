// js/circo.js - «CIRCO MASSIMO» · Il motore di partita originale di «Ave Calcio! · I Gladiatori del Pallone»
// Calcio gladiatorio nell'arena sabbiosa dell'Antica Roma:
//  - Campo ovale con la monumentale Spina Centrale (obelisco che devia tiri e rimbalzi).
//  - Meccaniche: Scatto a Biga, Muro di Scudi nei contrasti e Tiro a Catapulta sopra l'obelisco.
//  - Il Favore di Cesare: indicatore di gradimento della tribuna imperiale (Pollice Su / Giù).
(function () {
  "use strict";
  if (window.__circo) return;

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
      if (type === "fanfare") {
        // Tromba romana imperiale
        [330, 440, 554, 660].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, t + i * 0.1);
          g.gain.setValueAtTime(0.18, t + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.4);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(t + i * 0.1); osc.stop(t + i * 0.1 + 0.4);
        });
      } else if (type === "shield" || type === "hit") {
        // Scontro di scudi in bronzo
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.2);
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.2);
      } else if (type === "goal") {
        // Boato dell'arena e tifo
        const b = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
        const src = ctx.createBufferSource();
        const f = ctx.createBiquadFilter();
        const g = ctx.createGain();
        f.type = "lowpass"; f.frequency.setValueAtTime(800, t);
        g.gain.setValueAtTime(0.4, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        src.buffer = b; src.connect(f); f.connect(g); g.connect(ctx.destination);
        src.start(t);
      }
    } catch (e) {}
  }

  const STYLES = `
.crOv { position:fixed; inset:0; z-index:280; background:#2a1a08; color:#fef3c7; display:flex; flex-direction:column; font-family:'Trebuchet MS',serif,system-ui,sans-serif; user-select:none; overflow:hidden; }
.crTop { display:flex; justify-content:space-between; align-items:center; padding:8px 14px; background:#451a03; border-bottom:3px solid #b45309; box-shadow:0 4px 10px rgba(0,0,0,.6); font-size:13px; font-weight:900; }
.crBadge { padding:4px 10px; border-radius:4px; border:2px solid #eab308; background:#78350f; text-transform:uppercase; letter-spacing:1px; }
.crMid { flex:1; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.crCanvas { width:100%; height:100%; max-width:640px; max-height:480px; background:#b45309; display:block; }
.crBot { padding:10px 14px; background:#451a03; border-top:3px solid #b45309; display:flex; flex-direction:column; gap:8px; }
.crControls { display:flex; gap:8px; justify-content:center; }
.crBtn { flex:1; min-height:44px; background:#b45309; border:2px solid #fef08a; color:#fef3c7; font:900 13px sans-serif; border-radius:6px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 3px 0 #78350f; display:flex; align-items:center; justify-content:center; gap:6px; }
.crBtn:hover { background:#d97706; }
.crBtn:active { transform:translateY(2px); box-shadow:none; }
.crBtn.sub { background:#78350f; border-color:#d97706; font-size:12px; }
.crFavorWrap { display:flex; align-items:center; justify-content:center; gap:10px; font-size:12px; font-weight:900; color:#fde047; text-transform:uppercase; }
.crFavorBar { width:140px; height:12px; background:#1c1917; border:2px solid #eab308; border-radius:6px; overflow:hidden; position:relative; }
.crFavorFill { height:100%; width:50%; background:linear-gradient(90deg, #ef4444, #eab308, #22c55e); transition:width .2s ease; }
.crBanner { position:absolute; top:25%; left:50%; transform:translate(-50%,-50%); background:rgba(69,26,3,.95); border:3px solid #eab308; padding:12px 24px; border-radius:8px; font-size:20px; font-weight:900; text-align:center; color:#fef08a; animation:crPop .3s ease both; z-index:10; pointer-events:none; }
@keyframes crPop { 0%{transform:translate(-50%,-50%) scale(.6);opacity:0} 100%{transform:translate(-50%,-50%) scale(1);opacity:1} }
.crCert { position:fixed; inset:0; z-index:290; background:rgba(26,14,5,.88); display:flex; align-items:center; justify-content:center; padding:16px; font-family:'Trebuchet MS',serif,sans-serif; }
.crCertBox { width:min(100%,420px); background:#fef3c7; color:#451a03; border:5px double #b45309; box-shadow:0 12px 30px rgba(0,0,0,.8); padding:20px; border-radius:8px; text-align:center; animation:crPop .35s ease both; }
.crCertBox h2 { margin:0 0 6px; font-size:24px; font-weight:900; text-transform:uppercase; color:#9a3412; letter-spacing:2px; }
.crCertBox .sub { font-size:12px; font-weight:700; color:#78350f; text-transform:uppercase; border-bottom:2px dashed #b45309; padding-bottom:8px; margin-bottom:12px; }
.crCertBox .score { font-size:38px; font-weight:900; color:#7c2d12; margin:10px 0; }
.crCertBox p { font-size:14px; line-height:1.4; color:#573318; margin:10px 0; }
.crCertBox button { width:100%; min-height:46px; background:#b45309; color:#fef3c7; border:2px solid #78350f; font:900 15px sans-serif; border-radius:6px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 4px 0 #78350f; margin-top:14px; }
.crCertBox button:active { transform:translateY(2px); box-shadow:none; }
`;

  function initCSS() {
    if (document.getElementById("crCss")) return;
    const st = document.createElement("style");
    st.id = "crCss";
    st.textContent = STYLES;
    document.head.appendChild(st);
  }

  let G_STATE = null;

  function start(opts = {}) {
    initCSS();
    if (G_STATE && G_STATE.root) {
      try { G_STATE.root.remove(); } catch (e) {}
    }

    const turnsTotal = Math.max(3, opts.turns || 5);
    const usName = opts.us || "Gladiatori S.P.Q.R.";
    const usColor = opts.usColor || "#dc2626";
    const oppObj = opts.opp || { name: "I Pretoriani", style: "pressing" };
    const oppName = oppObj.name || "I Pretoriani";
    const oppColor = oppObj.color || "#854d0e";
    const heroName = (opts.hero && opts.hero.name) || "Tu";

    const state = {
      opts,
      usName,
      usColor,
      oppName,
      oppColor,
      heroName,
      turnsTotal,
      turn: 1,
      usScore: 0,
      oppScore: 0,
      phase: "action", // action, anim, result, finish
      favor: 50, // 0 to 100 (Cesare's favor)
      ballX: 160,
      ballY: 150,
      ballVx: 0,
      ballVy: 0,
      ballFlight: 0,
      heroX: 160,
      heroY: 165,
      oppX: 160,
      oppY: 55,
      dustParticles: [],
      animId: null
    };
    state.finish = finishMatch;

    G_STATE = state;

    const ov = document.createElement("div");
    ov.className = "crOv";
    ov.innerHTML = `
      <div class="crTop">
        <div style="display:flex;gap:10px;align-items:center">
          <div class="crBadge" style="background:${usColor}">${usName}</div>
          <span style="font-size:16px;color:#fde047">VS</span>
          <div class="crBadge" style="background:${oppColor}">${oppName}</div>
        </div>
        <div style="font-size:14px;color:#fde047">LUDUS <span id="crTurn">1</span>/${turnsTotal}</div>
        <div>
          <button type="button" id="crQuit" style="background:transparent;border:1px solid #b45309;color:#fde047;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px">Ritirati</button>
        </div>
      </div>
      <div class="crMid">
        <canvas class="crCanvas" id="crCv" width="320" height="200"></canvas>
        <div class="crBanner" id="crBanner" style="display:none"></div>
      </div>
      <div class="crBot">
        <div class="crFavorWrap">
          <span>👎 SFUGGEVOLE</span>
          <div class="crFavorBar"><div class="crFavorFill" id="crFavorFill" style="width:50%"></div></div>
          <span>👍 FAVORE DI CESARE</span>
        </div>
        <div class="crControls" id="crControls">
          <button type="button" class="crBtn sub" id="crBigaBtn">⚡ SCATTO A BIGA</button>
          <button type="button" class="crBtn" id="crCataBtn">🏹 TIRO A CATAPULTA</button>
          <button type="button" class="crBtn sub" id="crScudoBtn">🛡️ MURO DI SCUDI</button>
        </div>
      </div>
    `;

    document.body.appendChild(ov);
    state.root = ov;

    const cv = ov.querySelector("#crCv");
    const g = cv.getContext("2d");
    state.cv = cv;
    state.g = g;

    ov.querySelector("#crQuit").onclick = () => {
      finishMatch({ quit: true, win: false, a: state.usScore, b: state.oppScore });
    };

    ov.querySelector("#crBigaBtn").onclick = () => doAction("biga");
    ov.querySelector("#crCataBtn").onclick = () => doAction("catapulta");
    ov.querySelector("#crScudoBtn").onclick = () => doAction("scudo");

    snd("fanfare");

    let lastT = performance.now();
    function loop(t) {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      update(dt);
      draw(g);
      state.animId = requestAnimationFrame(loop);
    }
    state.animId = requestAnimationFrame(loop);

    return true;
  }

  function doAction(act) {
    const s = G_STATE;
    if (!s || s.phase !== "action") return;
    s.phase = "anim";

    let success = false;
    if (act === "biga") {
      snd("hit");
      // Dribbling veloce attorno all'obelisco
      s.favor = Math.min(100, s.favor + 15);
      success = Math.random() < (0.45 + (s.favor / 200));
      showBanner(success ? "⚡ SCATTO TRAVOLGENTE ATTORNO ALL'OBELISCO!" : "COLLISIONE SULLA SPINA CENTRALE!");
    } else if (act === "catapulta") {
      snd("fanfare");
      // Tiro a parabola altissima
      s.ballFlight = 1;
      s.favor = Math.min(100, s.favor + 20);
      success = Math.random() < (0.50 + (s.favor / 200));
      showBanner(success ? "🏛️ TIRO A CATAPULTA NEL SETTE!" : "PALLA CONTRO LA COLONNA IMPERIALE!");
    } else if (act === "scudo") {
      snd("shield");
      // Contrasto di forza
      s.favor = Math.max(10, s.favor - 5);
      success = Math.random() < 0.65;
      showBanner(success ? "🛡️ MURO DI BRONZO! CONTRASTO VINCENTE!" : "SCUDO SPEZZATO DAL CENTURIONE!");
    }

    // Aggiorna punteggio in base al successo dell'azione
    if (success) {
      s.usScore++;
      snd("goal");
    } else {
      // Opportunità per l'avversario
      if (Math.random() < 0.5) {
        s.oppScore++;
        snd("shield");
      }
    }

    if (s.root) {
      s.root.querySelector("#crFavorFill").style.width = s.favor + "%";
    }

    setTimeout(() => {
      s.turn++;
      if (s.turn > s.turnsTotal) {
        finishMatch({
          win: s.usScore > s.oppScore,
          a: s.usScore,
          b: s.oppScore,
          score: `${s.usScore}-${s.oppScore}`,
          quit: false
        });
      } else {
        if (s.root) s.root.querySelector("#crTurn").textContent = s.turn;
        s.phase = "action";
      }
    }, 1300);
  }

  function showBanner(text) {
    const s = G_STATE;
    if (!s || !s.root) return;
    const b = s.root.querySelector("#crBanner");
    b.textContent = text;
    b.style.display = "block";
    setTimeout(() => {
      b.style.display = "none";
    }, 1100);
  }

  function finishMatch(res) {
    const s = G_STATE;
    if (!s) return;
    if (s.animId) cancelAnimationFrame(s.animId);

    const win = res.win;
    const title = res.quit ? "RITIRO DALL'ARENA" : (win ? "AVE VICTOR! VITTORIA NEI LUDI!" : "SCONFITTA NELL'ARENA");
    const desc = res.quit ? "Hai abbandonato il Circo tra i fischi dei patrizi." :
      (win ? `I gladiatori di ${s.usName} hanno trionfato sulla sabbia! Cesare si alza e volge il pollice verso l'alto: sei il campione indiscusso dell'Urbe!` :
      `I Pretoriani di ${s.oppName} hanno prevalso nei contrasti di scudo. Ma Roma concede sempre una nuova sfida ai valorosi.`);

    const cert = document.createElement("div");
    cert.className = "crCert";
    cert.innerHTML = `
      <div class="crCertBox">
        <div class="sub">Editto dei Ludi Circensi · S.P.Q.R.</div>
        <h2>${title}</h2>
        <div class="score">${s.usScore} - ${s.oppScore}</div>
        <p>${desc}</p>
        <button type="button" id="crCertDone">Ricevi l'Alloro e Continua ▸</button>
      </div>
    `;
    document.body.appendChild(cert);

    cert.querySelector("#crCertDone").onclick = () => {
      cert.remove();
      if (s.root) s.root.remove();
      G_STATE = null;
      const cb = s.opts.onDone || s.opts.done;
      if (typeof cb === "function") cb(res);
    };
  }

  function update(dt) {
    const s = G_STATE;
    if (!s) return;

    if (Math.random() < 0.25) {
      s.dustParticles.push({
        x: 100 + Math.random() * 120,
        y: 130 + Math.random() * 40,
        r: 2 + Math.random() * 4,
        a: 0.6
      });
    }
    s.dustParticles.forEach((p) => {
      p.y -= 0.3;
      p.a -= 0.02;
    });
    s.dustParticles = s.dustParticles.filter((p) => p.a > 0);
  }

  function draw(g) {
    const s = G_STATE;
    if (!s) return;
    const W = 320, H = 200;

    // Gradinate del Colosseo
    g.fillStyle = "#78350f";
    g.fillRect(0, 0, W, 70);
    // Spettatori in toga romana
    for (let row = 0; row < 3; row++) {
      for (let px = 8; px < W; px += 14) {
        g.fillStyle = (px + row) % 2 === 0 ? "#fef3c7" : "#b91c1c";
        g.beginPath(); g.arc(px, 16 + row * 14, 3.5, 0, Math.PI * 2); g.fill();
      }
    }
    // Balaustra di marmo
    g.fillStyle = "#e2e8f0";
    g.fillRect(0, 60, W, 8);
    g.fillStyle = "#94a3b8";
    g.fillRect(0, 66, W, 2);

    // Arena di sabbia dorata
    const sand = g.createLinearGradient(0, 68, 0, H);
    sand.addColorStop(0, "#d97706");
    sand.addColorStop(0.5, "#b45309");
    sand.addColorStop(1, "#78350f");
    g.fillStyle = sand;
    g.fillRect(0, 68, W, 132);

    // Bordo circolare dell'arena
    g.strokeStyle = "rgba(254,243,199,0.3)";
    g.lineWidth = 2;
    g.beginPath();
    g.ellipse(160, 135, 140, 58, 0, 0, Math.PI * 2);
    g.stroke();

    // SPINA CENTRALE (Obelisco e sculture spartitraffico)
    g.fillStyle = "#451a03";
    g.fillRect(110, 126, 100, 16);
    g.fillStyle = "#e2e8f0"; // Obelisco di marmo
    g.beginPath();
    g.moveTo(160, 96);
    g.lineTo(154, 130);
    g.lineTo(166, 130);
    g.closePath();
    g.fill();
    // Bracieri di fuoco accesi sulla spina
    g.fillStyle = "#f59e0b";
    g.beginPath(); g.arc(120, 126, 4, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(200, 126, 4, 0, Math.PI * 2); g.fill();

    // Polvere alzata dai sandali
    s.dustParticles.forEach((p) => {
      g.fillStyle = `rgba(254,243,199,${p.a})`;
      g.beginPath(); g.arc(p.x, p.y, p.r, 0, Math.PI * 2); g.fill();
    });

    // Gladiatore Campione (in basso)
    drawGladiator(g, 160, 170, s.usColor, true);

    // Gladiatore Avversario (in alto)
    drawGladiator(g, 160, 85, s.oppColor, false);

    // Pallone di cuoio cucito
    g.fillStyle = "#fef08a";
    g.beginPath();
    g.arc(160, s.phase === "anim" ? 115 : 148, 5.5, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#78350f";
    g.lineWidth = 1;
    g.stroke();
  }

  function drawGladiator(g, x, y, col, isHero) {
    g.save();
    g.translate(x, y);
    // Ombra
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.beginPath(); g.ellipse(0, 12, 10, 4, 0, 0, Math.PI * 2); g.fill();
    // Gambe con schinieri
    g.fillStyle = "#d97706";
    g.fillRect(-5, 0, 3, 10);
    g.fillRect(2, 0, 3, 10);
    // Tunica romana
    g.fillStyle = col || "#dc2626";
    g.fillRect(-8, -12, 16, 14);
    // Scudo rotondo in bronzo
    g.fillStyle = "#ca8a04";
    g.beginPath(); g.arc(isHero ? -10 : 10, -6, 7, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#451a03"; g.lineWidth = 1; g.stroke();
    // Testa e elmo con criniera
    g.fillStyle = "#e0ac7e";
    g.beginPath(); g.arc(0, -16, 5, 0, Math.PI * 2); g.fill();
    // Elmo
    g.fillStyle = "#eab308";
    g.fillRect(-5, -21, 10, 4);
    g.fillStyle = "#b91c1c"; // Cresta rossa
    g.fillRect(-2, -26, 4, 6);
    g.restore();
  }

  window.__circo = {
    start,
    state: () => G_STATE
  };
})();
