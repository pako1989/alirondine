// js/corridoio.js - «IL CORRIDOIO D'ACCIAIO» · Motore di partita originale di «L'Espresso delle Ombre»
// Partita di calcio a 2v2 a scorrimento nel corridoio della carrozza di lusso del Nord-Sud Star:
//  - Fisica dinamica del convoglio in corsa: sobbalzi e inclinazioni delle curve alpine che deviano il pallone
//  - Sponde intelligenti: rimbalzi sulle paratie in mogano e sulle porte degli scompartimenti
//  - Azioni tattiche da agente segreto:
//      * Sponda Cieca: rasoiata a effetto calcolato che sfrutta lo stipite della cuccetta
//      * Contrasto in Scossa: tackle tempestivo sincronizzato con lo scossone dei binari
//      * Sfregio di Frontiera: bordata tesa a mezz'aria dritta verso la porta di fondo carrozza
(function () {
  "use strict";
  if (window.__corridoio) return;

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
      if (type === "train") {
        // Sferragliare metallico sui binari (rumore filtrato + doppio impulso)
        [180, 240].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.08, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.13);
        });
      } else if (type === "kick") {
        // Calcio deciso sul cuoio
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === "bounce") {
        // Rimbalzo secco sul mogano del corridoio
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.09);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.11);
      } else if (type === "whistle") {
        // Fischio del treno alpino
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(420, t);
        osc.frequency.exponentialRampToValueAtTime(480, t + 0.35);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.52);
      } else if (type === "goal") {
        // Tonalità di successo d'epoca
        [330, 440, 554, 659].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.2, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.38);
        });
      }
    } catch {}
  }

  let STATE = null;

  function start(o = {}) {
    if (STATE && STATE.close) STATE.close();

    const host = document.body;
    const wrap = document.createElement("div");
    wrap.className = "corOv";
    wrap.style.cssText = "position:fixed;inset:0;z-index:99999;background:#090d16;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Courier New',monospace,sans-serif;color:#f1f5f9;user-select:none;touch-action:none;padding:8px;";

    const cur = (window.__sagaCore && window.__sagaCore.cur) || {};
    const oppOpts = cur.opts || {};
    const diff = cur.diff || "normale";
    const oppStyle = cur.style || "equilibrata";

    // Nomi squadre
    const homeTeam = o.homeTeam || "Agenti di Bordo";
    const awayTeam = o.awayTeam || (cur.opp && cur.opp.name) || (o.oppNames && o.oppNames[0]) || "Ispettorato Alpino";
    const targetGoals = o.targetGoals || 3;

    wrap.innerHTML = `
      <style>
        .corOv * { box-sizing: border-box; }
        .corTop { width:100%; max-width:440px; display:flex; justify-content:space-between; align-items:center; padding:4px 8px; font-size:12px; font-weight:bold; letter-spacing:1px; background:#1e293b; border:1px solid #475569; border-radius:6px; margin-bottom:4px; }
        .corScore { font-size:20px; font-weight:900; color:#38bdf8; text-shadow:0 0 8px rgba(56,189,248,0.5); }
        .corBox { position:relative; width:100%; max-width:440px; background:#0f172a; border:2px solid #64748b; border-radius:8px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.8); }
        .corCvs { display:block; width:100%; height:auto; flex:none; }
        .corScossaBar { height:6px; width:100%; background:#334155; position:relative; }
        .corScossaFill { height:100%; width:50%; background:#f59e0b; transition:width 0.1s linear, background 0.2s; }
        .corLog { width:100%; max-width:440px; height:36px; line-height:18px; font-size:11px; color:#cbd5e1; text-align:center; padding:2px 6px; overflow:hidden; margin:4px 0; background:rgba(15,23,42,0.8); border-radius:4px; border:1px solid #334155; }
        .corBtns { width:100%; max-width:440px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-top:2px; }
        .corBtn { background:#1e293b; color:#f8fafc; border:1px solid #64748b; border-radius:6px; padding:8px 4px; font-size:11px; font-weight:bold; text-align:center; cursor:pointer; touch-action:manipulation; transition:background 0.15s, transform 0.05s; }
        .corBtn:active { background:#334155; transform:scale(0.97); }
        .corBtn small { display:block; font-size:9px; color:#94a3b8; font-weight:normal; margin-top:2px; }
        .corBtn.spec { border-color:#38bdf8; background:#0c4a6e; }
        .corBtn:disabled { opacity:0.4; pointer-events:none; }
        .corModal { position:absolute; inset:0; background:rgba(3,7,18,0.92); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px; text-align:center; z-index:10; }
        .corModal h2 { font-size:16px; color:#38bdf8; margin:0 0 6px 0; text-transform:uppercase; letter-spacing:1px; }
        .corModal p { font-size:12px; line-height:1.4; color:#e2e8f0; margin:0 0 12px 0; max-width:340px; }
        .corGo { background:#38bdf8; color:#0f172a; font-weight:900; font-size:13px; border:none; border-radius:6px; padding:10px 24px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 15px rgba(56,189,248,0.4); }
        .corGo:active { transform:scale(0.96); }
      </style>

      <div class="corTop">
        <span style="color:#94a3b8">${esc(homeTeam)}</span>
        <span class="corScore" id="corScoreTxt">0 - 0</span>
        <span style="color:#ef4444">${esc(awayTeam)}</span>
      </div>

      <div class="corBox">
        <canvas class="corCvs" width="${W}" height="${H}" id="corCanvas"></canvas>
        <div class="corScossaBar">
          <div class="corScossaFill" id="corScossaFill"></div>
        </div>
        <div class="corModal" id="corIntroModal">
          <h2>🚂 IL CORRIDOIO D'ACCIAIO</h2>
          <p>La sfida diplomatica nella carrozza del <b>Nord-Sud Star</b> in corsa tra le Alpi.<br>
          Sfrutta i <b>rimbalzi sulle porte degli scompartimenti</b> e calcola la <b>pendenza delle curve</b> per segnare prima del capolinea!</p>
          <button type="button" class="corGo" id="corBtnStart">Inizia la Sfida ▸</button>
        </div>
      </div>

      <div class="corLog" id="corLogTxt">Il convoglio sferraglia sui binari innevati. Pronto all'ingaggio.</div>

      <div class="corBtns">
        <button type="button" class="corBtn" id="btnSponda">
          🚪 SPONDA CIECA
          <small>Tiro a effetto sui pannelli</small>
        </button>
        <button type="button" class="corBtn" id="btnContrasto">
          ⚡ TACKLE IN SCOSSA
          <small>Anticipo durante i sobbalzi</small>
        </button>
        <button type="button" class="corBtn spec" id="btnFendente">
          🎯 TIRO D'ACCIAIO
          <small>Bordata tesa di rimbalzo</small>
        </button>
      </div>
    `;

    host.appendChild(wrap);

    const cvs = wrap.querySelector("#corCanvas");
    const g = cvs.getContext("2d");
    const scoreTxt = wrap.querySelector("#corScoreTxt");
    const scossaFill = wrap.querySelector("#corScossaFill");
    const logTxt = wrap.querySelector("#corLogTxt");
    const btnSponda = wrap.querySelector("#btnSponda");
    const btnContrasto = wrap.querySelector("#btnContrasto");
    const btnFendente = wrap.querySelector("#btnFendente");

    const S = {
      a: 0,
      b: 0,
      targetGoals,
      curve: 0,        // -1 (curva sx) a +1 (curva dx)
      curveTarget: 0,
      trainOffset: 0,  // scorrimento paesaggio finestrini
      possession: "home", // "home" o "away"
      ball: { x: W * 0.5, y: H * 0.5, vx: 0, vy: 0, z: 0 },
      players: [
        { id: "h1", name: "Campione", team: "home", x: W * 0.35, y: H * 0.52, vx: 0, vy: 0, num: 10 },
        { id: "h2", name: "Agente", team: "home", x: W * 0.22, y: H * 0.46, vx: 0, vy: 0, num: 7 },
        { id: "a1", name: "Spia Alpina", team: "away", x: W * 0.65, y: H * 0.52, vx: 0, vy: 0, num: 9 },
        { id: "a2", name: "Ispettore", team: "away", x: W * 0.78, y: H * 0.46, vx: 0, vy: 0, num: 4 }
      ],
      turn: 1,
      totalTurns: 12,
      busy: false,
      over: false,
      shake: 0,
      shakeTimer: 0
    };

    STATE = {
      S,
      finish: (forceWin) => {
        if (forceWin === false) { S.a = 0; S.b = S.targetGoals; }
        else { S.a = S.targetGoals; S.b = 0; }
        endMatch();
      },
      close: () => {
        animActive = false;
        if (animId) cancelAnimationFrame(animId);
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        STATE = null;
      }
    };

    let animId = null;
    let animActive = true;
    let frame = 0;

    function updHUD() {
      scoreTxt.textContent = `${S.a} - ${S.b}`;
      const fillW = Math.max(5, Math.min(95, 50 + S.curve * 45));
      scossaFill.style.width = fillW + "%";
      if (Math.abs(S.curve) > 0.6) {
        scossaFill.style.background = "#ef4444";
      } else {
        scossaFill.style.background = "#38bdf8";
      }
    }

    function setLog(msg) {
      logTxt.textContent = msg;
    }

    function setButtonsEnabled(en) {
      btnSponda.disabled = !en;
      btnContrasto.disabled = !en;
      btnFendente.disabled = !en;
    }

    // Disegno carrozza e finestrini
    function draw() {
      g.clearRect(0, 0, W, H);

      // Finestrini con paesaggio alpino e neve che scorre veloce
      g.fillStyle = "#020617";
      g.fillRect(0, 0, W, 42);

      // Cime alpine e luna
      g.fillStyle = "#1e293b";
      g.beginPath();
      g.moveTo(0, 36);
      for (let x = 0; x <= W; x += 30) {
        const peakY = 16 + Math.sin((x + S.trainOffset * 0.2) * 0.05) * 12;
        g.lineTo(x, peakY);
      }
      g.lineTo(W, 36);
      g.closePath();
      g.fill();

      // Bufere di neve sui finestrini
      g.fillStyle = "rgba(255,255,255,0.7)";
      for (let i = 0; i < 18; i++) {
        const fx = ((i * 37 + S.trainOffset * 3) % (W + 20)) - 10;
        const fy = 6 + ((i * 19 + frame * 2) % 30);
        g.fillRect(fx, fy, 2, 2);
      }

      // Cornici in mogano dei finestrini e lampade a carburo
      for (let x = 15; x < W; x += 65) {
        g.fillStyle = "#451a03";
        g.fillRect(x, 4, 6, 36);
        // Lampada dorata
        g.fillStyle = "#facc15";
        g.beginPath();
        g.arc(x + 3, 20, 2, 0, Math.PI * 2);
        g.fill();
      }

      // Parquet in legno del corridoio
      const floorGrad = g.createLinearGradient(0, 42, 0, H);
      floorGrad.addColorStop(0, "#78350f");
      floorGrad.addColorStop(0.5, "#92400e");
      floorGrad.addColorStop(1, "#451a03");
      g.fillStyle = floorGrad;
      g.fillRect(0, 42, W, H - 42);

      // Doghe del pavimento inclinate
      g.strokeStyle = "rgba(0,0,0,0.25)";
      g.lineWidth = 1;
      for (let y = 50; y < H; y += 14) {
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(W, y);
        g.stroke();
      }

      // Porte degli scompartimenti e guide d'ottone lungo il corridoio superiore
      g.fillStyle = "#292524";
      g.fillRect(0, 40, W, 4);
      g.fillStyle = "#b45309";
      for (let d = 25; d < W; d += 80) {
        // Maniglia d'ottone
        g.fillStyle = "#fbbf24";
        g.fillRect(d + 40, 48, 3, 5);
        // Porta scorrevole
        g.strokeStyle = "#44403c";
        g.strokeRect(d, 43, 45, 12);
      }

      // Tappeto rosso centrale con passamaneria d'oro
      g.fillStyle = "#881337";
      g.fillRect(15, H * 0.45, W - 30, H * 0.25);
      g.strokeStyle = "#facc15";
      g.lineWidth = 1;
      g.strokeRect(15, H * 0.45, W - 30, H * 0.25);

      // Linea di metà corridoio
      g.strokeStyle = "rgba(250,204,21,0.5)";
      g.setLineDash([4, 4]);
      g.beginPath();
      g.moveTo(W * 0.5, 42);
      g.lineTo(W * 0.5, H);
      g.stroke();
      g.setLineDash([]);

      // Porte dei due vagoni (le porte da calcio alle due estremità)
      // Porta Casa (sinistra)
      g.fillStyle = "rgba(56,189,248,0.2)";
      g.fillRect(2, H * 0.42, 14, H * 0.32);
      g.strokeStyle = "#38bdf8";
      g.lineWidth = 2;
      g.strokeRect(2, H * 0.42, 14, H * 0.32);

      // Porta Ospiti (destra)
      g.fillStyle = "rgba(239,68,68,0.2)";
      g.fillRect(W - 16, H * 0.42, 14, H * 0.32);
      g.strokeStyle = "#ef4444";
      g.lineWidth = 2;
      g.strokeRect(W - 16, H * 0.42, 14, H * 0.32);

      // Disegno Giocatori (Chibi con trench/divisa d'epoca)
      S.players.forEach((p) => {
        const isH = p.team === "home";
        // Ombra sul parquet
        g.fillStyle = "rgba(0,0,0,0.4)";
        g.beginPath();
        g.ellipse(p.x, p.y + 10, 8, 3, 0, 0, Math.PI * 2);
        g.fill();

        // Corpo / Trench
        g.fillStyle = isH ? "#1e293b" : "#7f1d1d";
        g.fillRect(p.x - 6, p.y - 4, 12, 12);

        // Sciarpa / Colletto
        g.fillStyle = isH ? "#38bdf8" : "#f59e0b";
        g.fillRect(p.x - 5, p.y - 6, 10, 3);

        // Volto
        g.fillStyle = "#f5d0b0";
        g.beginPath();
        g.arc(p.x, p.y - 10, 6, 0, Math.PI * 2);
        g.fill();

        // Cappello / Colbacco
        g.fillStyle = isH ? "#0f172a" : "#450a0a";
        g.fillRect(p.x - 7, p.y - 17, 14, 5);

        // Numero / Indicatore
        g.fillStyle = "#ffffff";
        g.font = "bold 8px sans-serif";
        g.textAlign = "center";
        g.fillText(p.num, p.x, p.y + 5);

        // Indicatore possesso
        if ((S.possession === "home" && isH && p.id === "h1") || (S.possession === "away" && !isH && p.id === "a1")) {
          g.fillStyle = isH ? "#38bdf8" : "#ef4444";
          g.beginPath();
          g.moveTo(p.x, p.y - 22);
          g.lineTo(p.x - 4, p.y - 27);
          g.lineTo(p.x + 4, p.y - 27);
          g.closePath();
          g.fill();
        }
      });

      // Disegno Pallone di cuoio cucito a mano
      const b = S.ball;
      // Ombra pallone
      g.fillStyle = "rgba(0,0,0,0.35)";
      g.beginPath();
      g.ellipse(b.x, b.y + 6, 5 + b.z * 0.1, 2.5, 0, 0, Math.PI * 2);
      g.fill();

      // Palla
      g.fillStyle = "#fef08a";
      g.beginPath();
      g.arc(b.x, b.y - b.z, 6, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#854d0e";
      g.lineWidth = 1;
      g.stroke();

      // Dettaglio cuciture pallone
      g.beginPath();
      g.arc(b.x, b.y - b.z, 3, 0, Math.PI);
      g.stroke();

      // Grafica scossone se curva attiva
      if (Math.abs(S.curve) > 0.3) {
        g.fillStyle = S.curve > 0 ? "rgba(245,158,11,0.15)" : "rgba(56,189,248,0.15)";
        g.fillRect(0, 0, W, H);
      }
    }

    function loop() {
      if (!animActive) return;
      frame++;
      S.trainOffset += 3 + Math.abs(S.curve) * 2;

      // Scossone binari ritmico
      if (frame % 70 === 0) {
        snd("train");
        S.curveTarget = (Math.random() - 0.5) * 1.6;
      }
      S.curve += (S.curveTarget - S.curve) * 0.05;

      // Movimento e fisica pallone
      if (S.busy) {
        S.ball.x += S.ball.vx;
        S.ball.y += S.ball.vy + S.curve * 0.6; // influenza della pendenza treno!

        // Rimbalzo pareti corridoio
        if (S.ball.y < 52) {
          S.ball.y = 52;
          S.ball.vy *= -0.85;
          snd("bounce");
        } else if (S.ball.y > H - 12) {
          S.ball.y = H - 12;
          S.ball.vy *= -0.85;
          snd("bounce");
        }
      } else {
        // La palla resta agganciata al giocatore in possesso
        const bearer = S.possession === "home" ? S.players[0] : S.players[2];
        const targetX = bearer.x + (S.possession === "home" ? 8 : -8);
        const targetY = bearer.y + 4;
        S.ball.x += (targetX - S.ball.x) * 0.2;
        S.ball.y += (targetY - S.ball.y) * 0.2;
      }

      draw();
      updHUD();
      animId = requestAnimationFrame(loop);
    }

    function playAction(act) {
      if (S.busy || S.over) return;
      S.busy = true;
      setButtonsEnabled(false);
      snd("kick");

      const h1 = S.players[0];
      const h2 = S.players[1];
      const a1 = S.players[2];
      const a2 = S.players[3];

      let msg = "";
      let goal = false;
      let stolen = false;

      // Calcolo successo in base alla curva e al tipo di azione
      if (act === "sponda") {
        // Sponda cieca sulla porta dello scompartimento
        const curveBonus = S.curve > 0 ? 0.3 : -0.1;
        const success = Math.random() + curveBonus > 0.35;
        if (success) {
          msg = "🚪 SPONDA MAGISTRALE! La palla rimbalza sul montante in mogano e scavalca la retroguardia!";
          S.ball.vx = 7.5;
          S.ball.vy = (Math.random() - 0.5) * 5;
          snd("bounce");
          setTimeout(() => {
            if (Math.random() > 0.25) {
              triggerGoal("home");
            } else {
              setLog("Il portiere d'albergo devia in extremis oltre la banchina!");
              resetPossession("away");
            }
          }, 800);
        } else {
          msg = "La sponda trova la porta chiusa di una cuccetta! Contrattacco degli avversari nel corridoio.";
          S.ball.vx = 4;
          setTimeout(() => resetPossession("away"), 700);
        }
      } else if (act === "contrasto") {
        // Tackle sincronizzato con lo scossone
        const shockSync = Math.abs(S.curve) > 0.4;
        if (shockSync || Math.random() > 0.4) {
          msg = "⚡ CONTRASTO IN SCOSSA! Sfrutti l'inclinazione della curva per sradicare la sfera in scivolata!";
          snd("bounce");
          S.possession = "home";
          h1.x = W * 0.45;
          setTimeout(() => {
            setLog("Possesso riconquistato! Spazio aperto verso il vagone di coda.");
            S.busy = false;
            setButtonsEnabled(true);
          }, 600);
          return;
        } else {
          msg = "Il contrasto va a vuoto: la curva favorisce l'incursione della spia avversaria!";
          setTimeout(() => {
            if (Math.random() > 0.5) {
              triggerGoal("away");
            } else {
              resetPossession("home");
            }
          }, 700);
        }
      } else if (act === "fendente") {
        // Tiro teso d'acciaio
        msg = "🎯 TIRO D'ACCIAIO! Rasoiata micidiale che fende l'aria tra i velluti del vagone!";
        S.ball.vx = 9.5;
        S.ball.vy = S.curve * 1.5;
        setTimeout(() => {
          if (Math.random() > 0.3) {
            triggerGoal("home");
          } else {
            setLog("Palo interno! Il rimbalzo semina il panico tra i passeggeri.");
            resetPossession("away");
          }
        }, 750);
      }

      setLog(msg);
    }

    function triggerGoal(team) {
      snd("goal");
      if (team === "home") {
        S.a++;
        setLog(`⚽ GOL DEGLI AGENTI! ${homeTeam} colpisce nel cuore della carrozza!`);
      } else {
        S.b++;
        setLog(`🚨 GOL SUBITO! ${awayTeam} infila il corridoio tra i bagagli!`);
      }

      setTimeout(() => {
        S.turn++;
        if (S.a >= S.targetGoals || S.b >= S.targetGoals || S.turn > S.totalTurns) {
          endMatch();
        } else {
          resetPositions();
          S.busy = false;
          setButtonsEnabled(true);
        }
      }, 1000);
    }

    function resetPossession(newPoss) {
      S.possession = newPoss;
      resetPositions();
      S.busy = false;
      setButtonsEnabled(true);
    }

    function resetPositions() {
      S.ball.x = W * 0.5;
      S.ball.y = H * 0.5;
      S.ball.vx = 0;
      S.ball.vy = 0;
      S.players[0].x = W * 0.35; S.players[0].y = H * 0.52;
      S.players[1].x = W * 0.22; S.players[1].y = H * 0.46;
      S.players[2].x = W * 0.65; S.players[2].y = H * 0.52;
      S.players[3].x = W * 0.78; S.players[3].y = H * 0.46;
    }

    function endMatch() {
      S.over = true;
      animActive = false;
      if (animId) cancelAnimationFrame(animId);

      const win = S.a > S.b;
      const tie = S.a === S.b;

      if (window.__sagaCore && window.__sagaCore.endMatch) {
        window.__sagaCore.endMatch();
      }

      const ov = document.createElement("div");
      ov.className = "corModal";
      ov.innerHTML = `
        <h2>${win ? "🏆 MISSIONE COMPIUTA SUI BINARI!" : tie ? "⚖️ STALLO SUL VIADOTTO GHIACCIATO!" : "🚨 INTRIGO FALLITO!"}</h2>
        <p style="font-size:24px;font-weight:900;color:#38bdf8;margin:6px 0">${S.a} - ${S.b}</p>
        <p>${win ? "Hai neutralizzato gli agenti rivali tra i vagoni e salvaguardato i documenti riservati del Nord-Sud Star!" : tie ? "Il fischio del capotreno gela il convoglio in perfetto equilibrio. La partita diplomatica resta aperta." : "La spia avversaria ha conquistato il vagone di coda. Occorre riorganizzarsi prima del prossimo valico!"}</p>
        <button type="button" class="corGo" id="btnCorClose">Concludi Partita ▸</button>
      `;
      wrap.appendChild(ov);

      ov.querySelector("#btnCorClose").onclick = () => {
        STATE.close();
        if (typeof o.done === "function") o.done({ win, a: S.a, b: S.b, tie, quit: false });
        if (typeof o.onDone === "function") o.onDone({ win, a: S.a, b: S.b, tie, quit: false });
      };
    }

    // Eventi pulsanti
    wrap.querySelector("#corBtnStart").onclick = () => {
      wrap.querySelector("#corIntroModal").remove();
      snd("whistle");
      setLog("Fischio di partenza! Palla al centro del corridoio.");
    };

    btnSponda.onclick = () => playAction("sponda");
    btnContrasto.onclick = () => playAction("contrasto");
    btnFendente.onclick = () => playAction("fendente");

    // Supporto tastiera (1, 2, 3 o Spazio)
    window.addEventListener("keydown", function onKey(e) {
      if (!STATE || S.over) {
        window.removeEventListener("keydown", onKey);
        return;
      }
      if (e.key === "1") playAction("sponda");
      else if (e.key === "2") playAction("contrasto");
      else if (e.key === "3" || e.key === " ") playAction("fendente");
    });

    updHUD();
    loop();
    return STATE;
  }

  window.__corridoio = {
    start,
    state: () => STATE,
    stop: () => {
      if (STATE && STATE.close) STATE.close();
      const el = document.querySelector(".corOv");
      if (el) el.remove();
      STATE = null;
    }
  };
})();
