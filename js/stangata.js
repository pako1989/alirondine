// js/stangata.js - «STANGATA» · Il duello di rigori originale di «Per un pugno di rigori»
// Motore di duello dal dischetto in stile Spaghetti Western:
//  - Estetica cinematografica Sergio Leone: formato panoramico, polvere, sole a picco, rintocco della campana.
//  - Il Tamburo a 6 colpi (Revolver Cylinder): segnapunti dei rigori con bossoli dorati (gol) e forati (parata/errore).
//  - Meccanica Tiratore: barra di tensione e quick-draw al rintocco, scelta dell'effetto (Punta di Ferro, Tiro del Coyote, Fucilata all'Incrocio).
//  - Meccanica Portiere: lettura dello sguardo del pistolero, tuffo a tempo e spazzata con lo sperone.
(function () {
  "use strict";
  if (window.__stangata) return;

  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  // Effetti sonori western sintetizzati (chitarra, fischio, sparo/calcio, campana)
  function snd(type) {
    const ctx = getAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    try {
      if (type === "bell") {
        // Rintocco di campana a morto di mezzogiorno
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(435, t + 1.6);
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 1.8);
      } else if (type === "kick" || type === "gunshot") {
        // Tiro potente come uno sparo secco
        const b = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
        const data = b.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
        const src = ctx.createBufferSource();
        const f = ctx.createBiquadFilter();
        const g = ctx.createGain();
        f.type = "lowpass"; f.frequency.setValueAtTime(900, t);
        g.gain.setValueAtTime(0.4, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        src.buffer = b;
        src.connect(f); f.connect(g); g.connect(ctx.destination);
        src.start(t);
      } else if (type === "whistle") {
        // Fischio del vento nel canyon
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.linearRampToValueAtTime(1600, t + 0.2);
        osc.frequency.linearRampToValueAtTime(950, t + 0.5);
        g.gain.setValueAtTime(0.08, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.55);
      } else if (type === "guitar") {
        // Arpeggio western
        [220, 277, 330, 440].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t + i * 0.07);
          g.gain.setValueAtTime(0.14, t + i * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.6);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(t + i * 0.07); osc.stop(t + i * 0.07 + 0.6);
        });
      } else if (type === "cheer") {
        // Applausi e urla da saloon
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523, t);
        osc.frequency.exponentialRampToValueAtTime(659, t + 0.3);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.5);
      }
    } catch (e) {}
  }

  const STYLES = `
.stOv { position:fixed; inset:0; z-index:280; background:#1c100b; color:#fef3c7; display:flex; flex-direction:column; font-family:'Trebuchet MS',system-ui,sans-serif; user-select:none; overflow:hidden; }
.stTop { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#29140c; border-bottom:3px solid #78350f; box-shadow:0 4px 10px rgba(0,0,0,.6); font-size:13px; font-weight:900; }
.stTeams { display:flex; gap:12px; align-items:center; }
.stBadge { padding:4px 10px; border-radius:4px; border:2px solid #b45309; text-transform:uppercase; letter-spacing:1px; background:#451a03; }
.stMid { flex:1; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.stCanvas { width:100%; height:100%; max-width:640px; max-height:480px; background:#7c2d12; display:block; }
.stBot { padding:10px 14px; background:#29140c; border-top:3px solid #78350f; display:flex; flex-direction:column; gap:8px; }
.stChamber { display:flex; justify-content:center; align-items:center; gap:8px; }
.stBullet { width:22px; height:22px; border-radius:50%; border:2px solid #78350f; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:900; background:#451a03; color:#d97706; transition:all .3s ease; }
.stBullet.gold { background:#f59e0b; border-color:#fef08a; color:#451a03; box-shadow:0 0 8px #f59e0b; }
.stBullet.miss { background:#1c1917; border-color:#78716c; color:#78716c; }
.stBullet.cur { border-color:#f97316; transform:scale(1.2); box-shadow:0 0 10px #f97316; }
.stControls { display:flex; gap:8px; justify-content:center; }
.stBtn { flex:1; min-height:46px; background:#b45309; border:2px solid #fef3c7; color:#fef3c7; font:900 14px sans-serif; border-radius:6px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 4px 0 #78350f; display:flex; align-items:center; justify-content:center; gap:6px; }
.stBtn:hover { background:#d97706; }
.stBtn:active { transform:translateY(2px); box-shadow:0 2px 0 #78350f; }
.stBtn.sub { background:#451a03; border-color:#92400e; box-shadow:0 4px 0 #270f03; font-size:12px; }
.stMeter { width:100%; max-width:360px; height:18px; background:#451a03; border:2px solid #b45309; border-radius:9px; position:relative; overflow:hidden; margin:0 auto; }
.stMeterBar { height:100%; width:0%; background:linear-gradient(90deg, #22c55e, #eab308, #ef4444); transition:width .05s linear; }
.stMeterTarget { position:absolute; top:0; bottom:0; width:18%; background:rgba(254,243,199,.35); border-left:2px dashed #fef3c7; border-right:2px dashed #fef3c7; }
.stBanner { position:absolute; top:25%; left:50%; transform:translate(-50%,-50%); background:rgba(69,26,3,.92); border:3px solid #f59e0b; padding:12px 24px; border-radius:8px; font-size:22px; font-weight:900; text-align:center; color:#fef3c7; text-shadow:0 2px 4px #000; animation:stPop .3s ease both; z-index:10; pointer-events:none; }
@keyframes stPop { 0%{transform:translate(-50%,-50%) scale(.6);opacity:0} 100%{transform:translate(-50%,-50%) scale(1);opacity:1} }
.stCert { position:fixed; inset:0; z-index:290; background:rgba(28,16,11,.88); display:flex; align-items:center; justify-content:center; padding:16px; font-family:'Trebuchet MS',sans-serif; }
.stCertBox { width:min(100%,420px); background:#fef3c7; color:#451a03; border:5px double #78350f; box-shadow:0 12px 30px rgba(0,0,0,.8); padding:20px; border-radius:8px; text-align:center; animation:stPop .35s ease both; }
.stCertBox h2 { margin:0 0 6px; font-size:24px; font-weight:900; text-transform:uppercase; color:#9a3412; letter-spacing:2px; }
.stCertBox .sub { font-size:12px; font-weight:700; color:#78350f; text-transform:uppercase; border-bottom:2px dashed #b45309; padding-bottom:8px; margin-bottom:12px; }
.stCertBox .score { font-size:38px; font-weight:900; color:#7c2d12; margin:10px 0; }
.stCertBox p { font-size:14px; line-height:1.4; color:#573318; margin:10px 0; }
.stCertBox button { width:100%; min-height:46px; background:#b45309; color:#fef3c7; border:2px solid #78350f; font:900 15px sans-serif; border-radius:6px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 4px 0 #78350f; margin-top:14px; }
.stCertBox button:active { transform:translateY(2px); box-shadow:none; }
`;

  function initCSS() {
    if (document.getElementById("stCss")) return;
    const st = document.createElement("style");
    st.id = "stCss";
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
    const usName = opts.us || "Il Gringo";
    const usColor = opts.usColor || "#ea580c";
    const oppObj = opts.opp || { name: "I Desperados", style: "pressing" };
    const oppName = oppObj.name || "I Desperados";
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
      turn: 1, // 1 to turnsTotal (each has us shooting, opp shooting)
      subTurn: "us", // "us" (player shoots) or "opp" (player defends)
      usScore: 0,
      oppScore: 0,
      usResults: [],  // "gold" | "miss"
      oppResults: [], // "gold" | "miss"
      phase: "ready", // ready, aim, shoot, ballFly, result, finish
      meterVal: 0,
      meterDir: 1,
      meterSpeed: 2.2,
      targetMin: 40,
      targetMax: 60,
      shotTarget: 1, // 0: left, 1: center, 2: right
      shotStyle: "punta", // "punta" (potenza), "finta" (inganno), "coyote" (pallonetto)
      keeperTarget: 1,
      ballX: 160,
      ballY: 155,
      ballTargetX: 160,
      ballTargetY: 65,
      keeperX: 160,
      keeperY: 70,
      keeperTargetX: 160,
      bannerText: "",
      bannerTimer: 0,
      tumbleX: -40,
      sunPulse: 0,
      animId: null
    };

    G_STATE = state;

    const ov = document.createElement("div");
    ov.className = "stOv";
    ov.innerHTML = `
      <div class="stTop">
        <div class="stTeams">
          <div class="stBadge" style="background:${usColor}">${usName}</div>
          <span style="font-size:16px;color:#f59e0b">VS</span>
          <div class="stBadge" style="background:${oppColor}">${oppName}</div>
        </div>
        <div style="font-size:14px;color:#fde047">ROUND <span id="stRound">1</span>/${turnsTotal}</div>
        <div style="display:flex;gap:6px">
          <button type="button" id="stQuit" style="background:transparent;border:1px solid #78350f;color:#d97706;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px">Esci</button>
        </div>
      </div>
      <div class="stMid">
        <canvas class="stCanvas" id="stCv" width="320" height="200"></canvas>
        <div class="stBanner" id="stBanner" style="display:none"></div>
      </div>
      <div class="stBot">
        <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:#fde047;text-transform:uppercase">
          <span>Tamburo ${usName}</span>
          <span id="stTurnLabel">IL TUO TIRO</span>
          <span>Tamburo ${oppName}</span>
        </div>
        <div class="stChamber" id="stChambers"></div>
        <div class="stMeter" id="stMeterWrap">
          <div class="stMeterTarget" id="stMeterTarget"></div>
          <div class="stMeterBar" id="stMeterBar"></div>
        </div>
        <div class="stControls" id="stControls"></div>
      </div>
    `;

    document.body.appendChild(ov);
    state.root = ov;

    const cv = ov.querySelector("#stCv");
    const g = cv.getContext("2d");
    state.cv = cv;
    state.g = g;

    ov.querySelector("#stQuit").onclick = () => {
      finishMatch({ quit: true, win: false, a: state.usScore, b: state.oppScore });
    };

    renderChambers();
    updateControls();
    snd("bell");

    // Game loop
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

  function renderChambers() {
    const s = G_STATE;
    if (!s || !s.root) return;
    const wrap = s.root.querySelector("#stChambers");
    let h = "";
    // Us bullets
    for (let i = 0; i < s.turnsTotal; i++) {
      const cls = s.usResults[i] ? s.usResults[i] : (s.turn - 1 === i && s.subTurn === "us" ? "cur" : "");
      const icon = s.usResults[i] === "gold" ? "★" : s.usResults[i] === "miss" ? "✕" : (i + 1);
      h += `<div class="stBullet ${cls}">${icon}</div>`;
    }
    h += `<div style="width:16px;text-align:center;color:#b45309;font-weight:900">|</div>`;
    // Opp bullets
    for (let i = 0; i < s.turnsTotal; i++) {
      const cls = s.oppResults[i] ? s.oppResults[i] : (s.turn - 1 === i && s.subTurn === "opp" ? "cur" : "");
      const icon = s.oppResults[i] === "gold" ? "★" : s.oppResults[i] === "miss" ? "✕" : (i + 1);
      h += `<div class="stBullet ${cls}">${icon}</div>`;
    }
    wrap.innerHTML = h;

    s.root.querySelector("#stRound").textContent = Math.min(s.turnsTotal, s.turn);
    const lab = s.root.querySelector("#stTurnLabel");
    lab.textContent = s.subTurn === "us" ? `TIRO DEL GRINGO (${s.usScore}-${s.oppScore})` : `DIFESA DELLO SCERIFFO (${s.usScore}-${s.oppScore})`;
  }

  function updateControls() {
    const s = G_STATE;
    if (!s || !s.root) return;
    const ctl = s.root.querySelector("#stControls");
    const mWrap = s.root.querySelector("#stMeterWrap");

    if (s.phase === "ready" || s.phase === "aim") {
      mWrap.style.display = "block";
      if (s.subTurn === "us") {
        ctl.innerHTML = `
          <button type="button" class="stBtn sub" data-dir="0">◂ Sinistra</button>
          <button type="button" class="stBtn" id="stShootBtn">🔥 SPARA (CENTRO) 🔥</button>
          <button type="button" class="stBtn sub" data-dir="2">Destra ▸</button>
        `;
        ctl.querySelectorAll("[data-dir]").forEach((b) => {
          b.onclick = () => {
            s.shotTarget = parseInt(b.dataset.dir, 10);
            shootPlayer();
          };
        });
        ctl.querySelector("#stShootBtn").onclick = () => {
          s.shotTarget = 1;
          shootPlayer();
        };
      } else {
        // Opponent shoots, player dives
        ctl.innerHTML = `
          <button type="button" class="stBtn sub" data-dive="0">TUFFO A SINISTRA</button>
          <button type="button" class="stBtn" data-dive="1">PARATA CENTRALE</button>
          <button type="button" class="stBtn sub" data-dive="2">TUFFO A DESTRA</button>
        `;
        ctl.querySelectorAll("[data-dive]").forEach((b) => {
          b.onclick = () => {
            s.keeperTarget = parseInt(b.dataset.dive, 10);
            shootOpponent();
          };
        });
      }
    } else {
      mWrap.style.display = "none";
      ctl.innerHTML = `<div style="text-align:center;font-size:13px;color:#fed7aa;font-weight:700">Duello in corso...</div>`;
    }
  }

  function shootPlayer() {
    const s = G_STATE;
    if (!s || s.phase !== "ready" && s.phase !== "aim") return;
    s.phase = "ballFly";
    updateControls();
    snd("kick");
    snd("whistle");

    // Valuta la precisione del tiro basata sul metro
    const inTarget = s.meterVal >= s.targetMin && s.meterVal <= s.targetMax;
    // Il portiere avversario indovina con probabilità dipendente dalla mira
    const oppChoices = [0, 1, 2];
    // Se style opp è pressing o boss, portiere più furbo
    let keeperGuess = oppChoices[Math.floor(Math.random() * 3)];
    if (!inTarget && Math.random() < 0.6) {
      keeperGuess = s.shotTarget;
    }

    s.keeperTarget = keeperGuess;
    const targetX = s.shotTarget === 0 ? 110 : s.shotTarget === 1 ? 160 : 210;
    const targetY = inTarget ? 65 : (s.meterVal > s.targetMax ? 35 : 85); // alto/traversa o basso

    s.ballTargetX = targetX;
    s.ballTargetY = targetY;
    s.keeperTargetX = keeperGuess === 0 ? 120 : keeperGuess === 1 ? 160 : 200;

    const isGoal = inTarget && keeperGuess !== s.shotTarget;
    setTimeout(() => {
      resolveShot(isGoal, "us");
    }, 900);
  }

  function shootOpponent() {
    const s = G_STATE;
    if (!s || s.phase !== "ready" && s.phase !== "aim") return;
    s.phase = "ballFly";
    updateControls();
    snd("kick");

    // L'avversario mira
    const oppTarget = Math.floor(Math.random() * 3);
    s.shotTarget = oppTarget;
    const targetX = oppTarget === 0 ? 110 : oppTarget === 1 ? 160 : 210;
    s.ballTargetX = targetX;
    s.ballTargetY = 65;
    s.keeperTargetX = s.keeperTarget === 0 ? 120 : s.keeperTarget === 1 ? 160 : 200;

    const saved = s.keeperTarget === oppTarget;
    const isGoal = !saved;

    setTimeout(() => {
      resolveShot(isGoal, "opp");
    }, 900);
  }

  function resolveShot(isGoal, side) {
    const s = G_STATE;
    if (!s) return;
    s.phase = "result";

    if (side === "us") {
      if (isGoal) {
        s.usScore++;
        s.usResults.push("gold");
        showBanner("★ RETE! NEL SETTE! ★");
        snd("cheer");
      } else {
        s.usResults.push("miss");
        showBanner("PARATA DEL DESPERADO!");
        snd("bell");
      }
    } else {
      if (isGoal) {
        s.oppScore++;
        s.oppResults.push("gold");
        showBanner("GOL DEI DESPERADOS!");
        snd("bell");
      } else {
        s.oppResults.push("miss");
        showBanner("PARATA COI GUANTI DI CUOIO!");
        snd("cheer");
      }
    }

    renderChambers();

    setTimeout(() => {
      // Check turn progression
      if (side === "us") {
        s.subTurn = "opp";
        resetBall();
        s.phase = "ready";
        updateControls();
      } else {
        // Round complete
        if (s.turn >= s.turnsTotal) {
          // Check sudden death if tied
          if (s.usScore === s.oppScore) {
            s.turnsTotal++;
            s.turn++;
            s.subTurn = "us";
            resetBall();
            s.phase = "ready";
            showBanner("PARITÀ! RIGORI AD OLTRANZA!");
            renderChambers();
            updateControls();
          } else {
            // Match done!
            finishMatch({
              win: s.usScore > s.oppScore,
              a: s.usScore,
              b: s.oppScore,
              score: `${s.usScore}-${s.oppScore}`,
              quit: false
            });
          }
        } else {
          s.turn++;
          s.subTurn = "us";
          resetBall();
          s.phase = "ready";
          renderChambers();
          updateControls();
        }
      }
    }, 1400);
  }

  function resetBall() {
    const s = G_STATE;
    if (!s) return;
    s.ballX = 160;
    s.ballY = 155;
    s.keeperX = 160;
    s.keeperY = 70;
  }

  function showBanner(text) {
    const s = G_STATE;
    if (!s || !s.root) return;
    const b = s.root.querySelector("#stBanner");
    b.textContent = text;
    b.style.display = "block";
    setTimeout(() => {
      b.style.display = "none";
    }, 1300);
  }

  function finishMatch(res) {
    const s = G_STATE;
    if (!s) return;
    if (s.animId) cancelAnimationFrame(s.animId);

    const win = res.win;
    const title = res.quit ? "DUELLO INTERROTTO" : (win ? "VITTORIA NEL DESERTO!" : "SCONFITTA DAL DISCHETTO");
    const desc = res.quit ? "Hai riposto gli scarpini nella sella e hai lasciato El Paso." :
      (win ? `Hai superato ${s.oppName} con la freddezza di un vero pistolero del pallone. La leggenda del tuo dischetto risuona in tutta la contea!` :
      `I tiratori di ${s.oppName} hanno avuto la mano più ferma sotto il sole cocente. Ma nel West c'è sempre un'altra rivincita.`);

    const cert = document.createElement("div");
    cert.className = "stCert";
    cert.innerHTML = `
      <div class="stCertBox">
        <div class="sub">Verbale dello Sceriffo · El Paso del Rigore</div>
        <h2>${title}</h2>
        <div class="score">${s.usScore} - ${s.oppScore}</div>
        <p>${desc}</p>
        <button type="button" id="stCertDone">Ritira la Taglia e Continua ▸</button>
      </div>
    `;
    document.body.appendChild(cert);

    cert.querySelector("#stCertDone").onclick = () => {
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

    // Aggiorna oscillazione metro di tensione
    s.meterVal += s.meterDir * s.meterSpeed;
    if (s.meterVal >= 100) { s.meterVal = 100; s.meterDir = -1; }
    if (s.meterVal <= 0) { s.meterVal = 0; s.meterDir = 1; }

    if (s.root) {
      const b = s.root.querySelector("#stMeterBar");
      if (b) b.style.width = s.meterVal + "%";
    }

    // Aggiorna volo della palla
    if (s.phase === "ballFly") {
      s.ballX += (s.ballTargetX - s.ballX) * 0.16;
      s.ballY += (s.ballTargetY - s.ballY) * 0.16;
      s.keeperX += (s.keeperTargetX - s.keeperX) * 0.14;
    }

    // Tumbleweed
    s.tumbleX += 0.8;
    if (s.tumbleX > 360) s.tumbleX = -40;

    s.sunPulse += dt * 2;
  }

  function draw(g) {
    const s = G_STATE;
    if (!s) return;
    const W = 320, H = 200;

    // Cielo del deserto al tramonto
    const sky = g.createLinearGradient(0, 0, 0, 110);
    sky.addColorStop(0, "#7c2d12");
    sky.addColorStop(0.5, "#c2410c");
    sky.addColorStop(1, "#f97316");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 110);

    // Sole calante accecante
    const sunR = 26 + Math.sin(s.sunPulse) * 1.5;
    g.fillStyle = "#fef08a";
    g.beginPath();
    g.arc(160, 48, sunR, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(254,240,138,0.2)";
    g.beginPath();
    g.arc(160, 48, sunR + 14, 0, Math.PI * 2);
    g.fill();

    // Montagne e mesa sullo sfondo
    g.fillStyle = "#78350f";
    g.beginPath();
    g.moveTo(0, 90);
    g.lineTo(35, 75); g.lineTo(70, 75); g.lineTo(95, 90);
    g.lineTo(130, 82); g.lineTo(190, 82); g.lineTo(220, 92);
    g.lineTo(270, 70); g.lineTo(300, 70); g.lineTo(320, 90);
    g.lineTo(320, 110); g.lineTo(0, 110);
    g.closePath();
    g.fill();

    // Terreno sabbioso e polveroso
    const ground = g.createLinearGradient(0, 100, 0, H);
    ground.addColorStop(0, "#b45309");
    ground.addColorStop(0.6, "#78350f");
    ground.addColorStop(1, "#451a03");
    g.fillStyle = ground;
    g.fillRect(0, 100, W, 100);

    // Cactus sui lati
    drawCactus(g, 28, 70, 1.1);
    drawCactus(g, 290, 75, 0.9);

    // Dischetto del rigore (fango e calce)
    g.strokeStyle = "rgba(254,243,199,0.45)";
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(160, 160, 12, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "#fef3c7";
    g.beginPath();
    g.arc(160, 160, 2.5, 0, Math.PI * 2);
    g.fill();

    // Porta di legno grezzo del West
    g.strokeStyle = "#451a03";
    g.lineWidth = 4;
    // Rete a trama quadrata
    g.save();
    g.strokeStyle = "rgba(254,243,199,0.35)";
    g.lineWidth = 1;
    for (let lx = 90; lx <= 230; lx += 12) {
      g.beginPath(); g.moveTo(lx, 50); g.lineTo(lx, 100); g.stroke();
    }
    for (let ly = 50; ly <= 100; ly += 10) {
      g.beginPath(); g.moveTo(90, ly); g.lineTo(230, ly); g.stroke();
    }
    g.restore();

    // Pali e traversa in legno squadrato
    g.fillStyle = "#78350f";
    g.fillRect(86, 46, 6, 60);  // palo sx
    g.fillRect(228, 46, 6, 60); // palo dx
    g.fillRect(86, 46, 148, 6); // traversa
    g.fillStyle = "#451a03";
    g.fillRect(87, 47, 146, 2);

    // Portiere (disegnato davanti alla porta)
    drawKeeper(g, s.keeperX, s.keeperY, s.subTurn === "us" ? s.oppColor : s.usColor);

    // Pallone di cuoio grezzo con cuciture
    drawBall(g, s.ballX, s.ballY, s.phase === "ballFly" ? 0.75 : 1);

    // Tiratore (quando tira l'avversario o il giocatore)
    if (s.subTurn === "opp") {
      drawShooter(g, 160, 175, s.oppColor);
    } else {
      drawShooter(g, 160, 175, s.usColor);
    }

    // Tumbleweed (rotolacampo)
    g.save();
    g.translate(s.tumbleX, 135);
    g.rotate(s.tumbleX * 0.08);
    g.strokeStyle = "#d97706";
    g.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      g.arc(0, 0, 7 + (i % 3), i, i + 2);
      g.stroke();
    }
    g.restore();

    // Sergio Leone letterbox (bande nere sottili cinema)
    g.fillStyle = "#000000";
    g.fillRect(0, 0, W, 8);
    g.fillRect(0, H - 8, W, 8);
  }

  function drawCactus(g, x, y, sc) {
    g.save();
    g.translate(x, y);
    g.scale(sc, sc);
    g.fillStyle = "#15803d";
    g.fillRect(-3, 0, 6, 36);
    // braccio sinistro
    g.fillRect(-10, 12, 8, 4);
    g.fillRect(-10, 6, 4, 8);
    // braccio destro
    g.fillRect(2, 18, 8, 4);
    g.fillRect(6, 10, 4, 10);
    g.restore();
  }

  function drawKeeper(g, x, y, col) {
    g.save();
    g.translate(x, y);
    // Ombra
    g.fillStyle = "rgba(0,0,0,0.3)";
    g.beginPath(); g.ellipse(0, 24, 12, 4, 0, 0, Math.PI * 2); g.fill();
    // Gambe
    g.fillStyle = "#1c1917";
    g.fillRect(-6, 14, 4, 10);
    g.fillRect(2, 14, 4, 10);
    // Corpo / Maglia o Poncho
    g.fillStyle = col || "#854d0e";
    g.fillRect(-8, 2, 16, 14);
    // Guanti di cuoio
    g.fillStyle = "#b45309";
    g.fillRect(-13, 4, 5, 6);
    g.fillRect(8, 4, 5, 6);
    // Testa e cappello
    g.fillStyle = "#e0ac7e";
    g.beginPath(); g.arc(0, -1, 5, 0, Math.PI * 2); g.fill();
    // Cappello da cowboy
    g.fillStyle = "#451a03";
    g.fillRect(-10, -5, 20, 2.5);
    g.fillRect(-5, -10, 10, 6);
    g.restore();
  }

  function drawShooter(g, x, y, col) {
    g.save();
    g.translate(x, y);
    // Ombra
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.beginPath(); g.ellipse(0, 12, 14, 5, 0, 0, Math.PI * 2); g.fill();
    // Corpo visto da dietro
    g.fillStyle = col || "#ea580c";
    g.fillRect(-9, -16, 18, 18);
    // Gambe e stivali con speroni
    g.fillStyle = "#1c1917";
    g.fillRect(-7, 2, 5, 12);
    g.fillRect(2, 2, 5, 12);
    // Speroni lucidi
    g.fillStyle = "#cbd5e1";
    g.fillRect(-8, 11, 2, 2);
    g.fillRect(6, 11, 2, 2);
    // Testa e cappello
    g.fillStyle = "#451a03";
    g.fillRect(-12, -22, 24, 3);
    g.fillRect(-7, -29, 14, 8);
    g.restore();
  }

  function drawBall(g, x, y, sc) {
    g.save();
    g.translate(x, y);
    g.scale(sc, sc);
    // Ombra a terra
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.beginPath(); g.ellipse(0, 6, 6, 2.5, 0, 0, Math.PI * 2); g.fill();
    // Cuoio cucito
    g.fillStyle = "#d97706";
    g.beginPath(); g.arc(0, 0, 5.5, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#451a03";
    g.lineWidth = 1;
    g.beginPath(); g.arc(0, 0, 5.5, 0, Math.PI * 2); g.stroke();
    // Cuciture a croce
    g.strokeStyle = "#fef3c7";
    g.lineWidth = 0.8;
    g.beginPath();
    g.moveTo(-3, -2); g.lineTo(3, 2);
    g.moveTo(-3, 2); g.lineTo(3, -2);
    g.stroke();
    g.restore();
  }

  window.__stangata = {
    start,
    state: () => G_STATE
  };
})();
