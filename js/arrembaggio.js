// js/arrembaggio.js - «ARREMBAGGIO SUL PONTE» · Il motore di partita originale di «S.O.S. Galletta: I Bucanieri del Biscotto»
// Partita di mini-calcio corsaro ambientata sul ponte di un galeone in navigazione tra le onde:
//  - Il Beccheggio del Veliero: il galeone rolla e beccheggia ritmicamente sull'onda (rollio/pitch continuo);
//    la gravità dinamica fa scivolare la palla e le casse di gallette secondo l'inclinazione del ponte!
//  - Il Vento Marino: raffiche laterali che deviano i tiri a mezz'aria (Sciabolata di Vento).
//  - Ostacoli di Bordo: barili di melassa scivolosi e casse di biscotti che fungono da respingenti elastici.
//  - Azioni Bucaniere:
//      * Tiro Sciabolato: traiettoria tesa e rotante che taglia la brezza marina.
//      * Bordata di Cannone: sassata rasoterra potentissima che rimbalza sulle murate di quercia.
//      * Scivolo di Burro: pallonetto imprevedibile e rimbalzo morbido.
(function () {
  "use strict";
  if (window.__arrembaggio) return;

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
      if (type === "wave") {
        // Fruscio d'onda marina / rollio
        const b = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((i / d.length) * Math.PI);
        const src = ctx.createBufferSource();
        const f = ctx.createBiquadFilter();
        const g = ctx.createGain();
        f.type = "lowpass"; f.frequency.setValueAtTime(450, t);
        g.gain.setValueAtTime(0.08, t);
        g.gain.linearRampToValueAtTime(0.001, t + 0.48);
        src.buffer = b;
        src.connect(f); f.connect(g); g.connect(ctx.destination);
        src.start(t);
      } else if (type === "cannon") {
        // Boato di cannone a bordo
        const b = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
        const src = ctx.createBufferSource();
        const f = ctx.createBiquadFilter();
        const g = ctx.createGain();
        f.type = "lowpass"; f.frequency.setValueAtTime(320, t);
        f.frequency.exponentialRampToValueAtTime(80, t + 0.35);
        g.gain.setValueAtTime(0.35, t);
        g.gain.exponentialRampToValueAtTime(0.005, t + 0.38);
        src.buffer = b;
        src.connect(f); f.connect(g); g.connect(ctx.destination);
        src.start(t);
      } else if (type === "wood") {
        // Scricchiolio legname / rimbalzo su paratia
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.13);
      } else if (type === "kick") {
        // Calcio sciabolato
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.15);
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.16);
      } else if (type === "goal") {
        // Jingle piratesco trionfale
        [293, 370, 440, 587].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, t + i * 0.09);
          g.gain.setValueAtTime(0.22, t + i * 0.09);
          g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.09 + 0.35);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(t + i * 0.09); osc.stop(t + i * 0.09 + 0.35);
        });
      }
    } catch (e) {}
  }

  function css() {
    if (document.getElementById("arrCss")) return;
    const st = document.createElement("style");
    st.id = "arrCss";
    st.textContent = `
.arrOv{position:fixed;inset:0;z-index:99999;background:#0c192c;color:#fef3c7;font-family:'Trebuchet MS',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:8px 8px 12px;user-select:none;-webkit-user-select:none;box-sizing:border-box}
.arrOv .hud{width:100%;max-width:390px;display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:13px;background:rgba(15,23,42,.9);padding:6px 12px;border-radius:8px;border:2px solid #b45309;box-shadow:0 4px 12px rgba(0,0,0,.5);box-sizing:border-box}
.arrOv .hud .sc{font-size:18px;color:#facc15;letter-spacing:1px;font-family:serif;font-weight:900}
.arrOv .hud .team{display:inline-flex;align-items:center;gap:6px}
.arrOv .hud .dot{width:11px;height:11px;border-radius:2px;display:inline-block;border:1px solid #000}
.arrOv .bar{width:100%;max-width:390px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#cbd5e1;padding:2px 8px}
.arrOv canvas{width:100%;max-width:390px;height:auto;flex:none;background:#78350f;border:3px solid #b45309;border-radius:6px;box-shadow:0 6px 20px rgba(0,0,0,.6);image-rendering:pixelated}
.arrOv .scr{width:100%;max-width:390px;min-height:38px;background:rgba(15,23,42,.85);border-radius:6px;padding:6px 10px;font-size:12px;line-height:1.3;box-sizing:border-box;border-left:4px solid #f59e0b}
.arrOv .scr b{color:#fef08a}
.arrOv .scr small{display:block;color:#94a3b8;font-size:10.5px;margin-top:2px}
.arrOv .pad{width:100%;max-width:390px;display:flex;gap:6px;justify-content:center}
.arrOv .pad button{flex:1;min-height:44px;padding:4px 6px;font-weight:900;font-size:12.5px;border-radius:6px;border:2px solid #78350f;background:#d97706;color:#fef3c7;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 3px 0 #78350f;text-transform:uppercase;letter-spacing:.5px}
.arrOv .pad button small{font-size:9.5px;font-weight:700;color:#fef08a;margin-top:1px;text-transform:none}
.arrOv .pad button:active{transform:translateY(2px);box-shadow:none}
.arrOv .pad button.hot{background:#dc2626;color:#fff;border-color:#7f1d1d;box-shadow:0 3px 0 #7f1d1d}
.arrOv .pad button.hot small{color:#fecaca}
.arrOv .pad button.sea{background:#0284c7;color:#fff;border-color:#0369a1;box-shadow:0 3px 0 #0369a1}
.arrOv .pad button.sea small{color:#bae6fd}
.arrOv .ov{position:absolute;inset:0;background:rgba(15,23,42,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;gap:12px;z-index:2}
.arrOv .ov h2{margin:0;font-size:22px;color:#facc15;font-family:serif;letter-spacing:1px}
.arrOv .ov p{margin:0;font-size:13.5px;line-height:1.45;color:#e2e8f0;max-width:320px}
.arrOv .ov .goB{padding:9px 26px;font-size:15px;font-weight:900;border-radius:8px;border:2px solid #78350f;background:#d97706;color:#fef3c7;cursor:pointer;box-shadow:0 4px 0 #78350f;text-transform:uppercase;letter-spacing:1px}
.arrOv .ov .goB:active{transform:translateY(2px);box-shadow:none}
`;
    document.head.appendChild(st);
  }

  let STATE = null;

  function start(o) {
    if (document.querySelector(".arrOv")) return false;
    o = o || {};
    css();

    const C = window.__sagaCore;
    const cur = (C && C.cur) || { opts: { opp: 1 }, style: "" };
    const DF = cur.opts || { opp: 1 };
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.85 : 1;

    const usCol = o.usColor || "#d97706";
    const opp = Object.assign({ name: "Corsari Sottaceto", color: "#1e3a8a", players: [] }, o.opp || {});
    const hero = Object.assign({ name: "Bucaniere" }, o.hero || o.heroLook || {});
    const mate = (o.mates && o.mates[0]) || { name: "Barbabiscotto" };

    const turnsTotal = o.turns || 6;
    const S = {
      o, a: 0, b: 0, turn: 1, turnsTotal, phase: "intro", over: false,
      // Rollio e beccheggio
      roll: 0, pitch: 0, waveTimer: 0, wind: 0,
      ball: { x: W / 2, y: H / 2, vx: 0, vy: 0 },
      // Ostacoli fissi sul ponte (barili di melassa, casse di biscotti)
      barrels: [
        { x: W * 0.35, y: H * 0.3, r: 12, label: "🍯" },
        { x: W * 0.65, y: H * 0.7, r: 12, label: "🍯" },
        { x: W * 0.5, y: H * 0.5, r: 10, label: "🍪" }
      ],
      // Giocatori in campo
      us: [
        { x: W * 0.28, y: H * 0.5, role: "hero", name: hero.name || "Tu", col: usCol },
        { x: W * 0.16, y: H * 0.35, role: "mate", name: mate.name, col: usCol },
        { x: W * 0.08, y: H * 0.5, role: "keeper", name: "Timoniere", col: "#451a03" }
      ],
      them: [
        { x: W * 0.72, y: H * 0.5, role: "opp1", name: (opp.players && opp.players[0] && opp.players[0].name) || "Sciabola", col: opp.color },
        { x: W * 0.84, y: H * 0.65, role: "opp2", name: (opp.players && opp.players[1] && opp.players[1].name) || "Cannoniere", col: opp.color },
        { x: W * 0.92, y: H * 0.5, role: "keeper", name: opp.keeper ? opp.keeper.name : "Nostromo", col: "#1e293b" }
      ],
      log: "Il galeone scricchiola sulle onde dell'Oceano della Melassa! Ponte pronto all'arrembaggio.",
      sub: "Sfrutta l'inclinazione del ponte e le raffiche di vento marino per spiazzare la ciurma avversaria."
    };
    STATE = S;

    // Crea DOM
    const wrap = document.createElement("div");
    wrap.className = "arrOv";
    wrap.innerHTML = `
      <div class="hud">
        <div class="team"><span class="dot" style="background:${usCol}"></span><span>${esc(o.us || "Bucanieri")}</span></div>
        <div class="sc"><span id="scA">0</span> - <span id="scB">0</span></div>
        <div class="team"><span>${esc(opp.name)}</span><span class="dot" style="background:${opp.color}"></span></div>
      </div>
      <div class="bar">
        <span id="arrTurn">Azione 1 di ${turnsTotal}</span>
        <span id="arrRoll">🌊 Rollio: Calmo</span>
        <span id="arrWind">💨 Vento: Brezza</span>
      </div>
      <canvas id="arrC" width="${W}" height="${H}"></canvas>
      <div class="scr">
        <b id="arrLog">${esc(S.log)}</b>
        <small id="arrSub">${esc(S.sub)}</small>
      </div>
      <div class="pad">
        <button type="button" id="btnSciabola">🗡️ Sciabolata<small>Tiro teso col vento</small></button>
        <button type="button" class="hot" id="btnCannone">💣 Bordata<small>Sparo radente sul legno</small></button>
        <button type="button" class="sea" id="btnBurro">🧈 Burro Scivoloso<small>Pallonetto a rollio</small></button>
      </div>
    `;
    document.body.appendChild(wrap);

    const cv = wrap.querySelector("#arrC");
    const g = cv.getContext("2d");
    const elScA = wrap.querySelector("#scA");
    const elScB = wrap.querySelector("#scB");
    const elTurn = wrap.querySelector("#arrTurn");
    const elRoll = wrap.querySelector("#arrRoll");
    const elWind = wrap.querySelector("#arrWind");
    const elLog = wrap.querySelector("#arrLog");
    const elSub = wrap.querySelector("#arrSub");

    let animId = null;
    let animActive = true;

    function updHUD() {
      elScA.textContent = S.a;
      elScB.textContent = S.b;
      elTurn.textContent = S.turn <= S.turnsTotal ? `Azione ${S.turn} di ${S.turnsTotal}` : "Fischio Finale!";
      const rDeg = Math.round(S.roll * 10);
      elRoll.textContent = `🌊 Rollio: ${rDeg > 0 ? "+" + rDeg + "° a dritta" : rDeg < 0 ? rDeg + "° a sinistra" : "Piatto"}`;
      const wDir = S.wind > 0.3 ? "→ Tramontana" : S.wind < -0.3 ? "← Ponente" : "Brezza Calma";
      elWind.textContent = `💨 Vento: ${wDir}`;
      elLog.textContent = S.log;
      elSub.textContent = S.sub;
    }

    // Loop di rendering animato del veliero che beccheggia
    function loop() {
      if (!animActive) return;
      S.waveTimer += 0.04;
      S.roll = Math.sin(S.waveTimer * 0.8) * 0.08; // inclinazione da circa -4.5° a +4.5°
      S.pitch = Math.cos(S.waveTimer * 0.6) * 0.04;
      S.wind = Math.sin(S.waveTimer * 0.3) * 0.8;

      // Disegna il campo da gioco corsaro
      render();
      animId = requestAnimationFrame(loop);
    }

    function render() {
      g.save();
      // Onde marine ai bordi esterne alla murata
      g.fillStyle = "#0c4a6e";
      g.fillRect(0, 0, W, H);

      // Schiuma marina oscillante
      g.fillStyle = "rgba(186,230,253,.35)";
      for (let y = 0; y < H; y += 24) {
        const off = Math.sin(S.waveTimer + y * 0.1) * 8;
        g.fillRect(0, y, 16 + off, 4);
        g.fillRect(W - 16 + off, y, 16, 4);
      }

      // Ponte del galeone (inclinato leggermente per rollio)
      g.translate(W / 2, H / 2);
      g.rotate(S.roll);
      g.translate(-W / 2, -H / 2);

      const px0 = 24, py0 = 18, pw = W - 48, ph = H - 36;
      // Scafo esterno scuro
      g.fillStyle = "#29140c";
      g.beginPath();
      g.roundRect(px0 - 4, py0 - 4, pw + 8, ph + 8, 14);
      g.fill();

      // Doghe in legno di quercia del ponte
      g.fillStyle = "#78350f";
      g.beginPath();
      g.roundRect(px0, py0, pw, ph, 10);
      g.fill();

      // Righe delle assi inchiodate
      g.strokeStyle = "#451a03";
      g.lineWidth = 1.2;
      for (let y = py0; y <= py0 + ph; y += 14) {
        g.beginPath();
        g.moveTo(px0, y);
        g.lineTo(px0 + pw, y);
        g.stroke();
      }

      // Chiodi di ferro sulle doghe
      g.fillStyle = "#1c1917";
      for (let x = px0 + 10; x < px0 + pw; x += 40) {
        for (let y = py0 + 7; y < py0 + ph; y += 14) {
          g.fillRect(x, y, 1.5, 1.5);
        }
      }

      // Linee del campo tracciate a calce bianca marina
      g.strokeStyle = "rgba(254,243,199,.65)";
      g.lineWidth = 2;
      // Perimetro
      g.strokeRect(px0 + 8, py0 + 8, pw - 16, ph - 16);
      // Metà campo e cerchio
      g.beginPath();
      g.moveTo(W / 2, py0 + 8);
      g.lineTo(W / 2, py0 + ph - 8);
      g.stroke();
      g.beginPath();
      g.arc(W / 2, H / 2, 28, 0, Math.PI * 2);
      g.stroke();

      // Porte con pali in sartie e reti di corda
      // Porta Sinistra (Nostra)
      g.fillStyle = "rgba(217,119,6,.25)";
      g.fillRect(px0 + 8, H / 2 - 28, 16, 56);
      g.strokeStyle = "#fef3c7";
      g.strokeRect(px0 + 8, H / 2 - 28, 16, 56);
      // Porta Destra (Avversari)
      g.fillStyle = "rgba(30,58,138,.25)";
      g.fillRect(px0 + pw - 24, H / 2 - 28, 16, 56);
      g.strokeStyle = "#fef3c7";
      g.strokeRect(px0 + pw - 24, H / 2 - 28, 16, 56);

      // Cannoni sulle murate di sopra e di sotto
      g.fillStyle = "#0f172a";
      for (let x = px0 + 30; x < px0 + pw - 30; x += 60) {
        // cannone superiore puntato a nord
        g.fillRect(x, py0 - 3, 8, 8);
        // cannone inferiore puntato a sud
        g.fillRect(x, py0 + ph - 5, 8, 8);
      }

      // Ostacoli fissi sul ponte: barili e casse
      S.barrels.forEach((b) => {
        g.fillStyle = "#451a03";
        g.beginPath();
        g.arc(b.x, b.y, b.r + 1, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#d97706";
        g.beginPath();
        g.arc(b.x, b.y, b.r - 2, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#fef3c7";
        g.font = "12px sans-serif";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(b.label, b.x, b.y);
      });

      // Disegna Giocatori Nostri
      S.us.forEach((p) => {
        drawPirate(g, p.x, p.y, p.col, true, p.name);
      });

      // Disegna Giocatori Avversari
      S.them.forEach((p) => {
        drawPirate(g, p.x, p.y, p.col, false, p.name);
      });

      // Pallone da calcio a toppe corsare (Biscotto di Cuoio)
      g.save();
      g.translate(S.ball.x, S.ball.y);
      g.fillStyle = "#fef3c7";
      g.beginPath();
      g.arc(0, 0, 6, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#451a03";
      g.lineWidth = 1.5;
      g.stroke();
      // Toppe del pallone
      g.fillStyle = "#d97706";
      g.beginPath();
      g.arc(0, 0, 2.5, 0, Math.PI * 2);
      g.fill();
      g.restore();

      // Indicatore Vento sul pennone centrale
      g.save();
      g.translate(W / 2, py0 + 16);
      g.strokeStyle = "#fef08a";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(S.wind * 18, 0);
      g.stroke();
      g.fillStyle = "#facc15";
      g.beginPath();
      g.arc(S.wind * 18, 0, 3, 0, Math.PI * 2);
      g.fill();
      g.restore();

      g.restore();
    }

    function drawPirate(ctx, x, y, col, isUs, name) {
      ctx.save();
      ctx.translate(x, y);
      // Ombra
      ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.beginPath();
      ctx.ellipse(0, 8, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo / Giacca bucaniera
      ctx.fillStyle = col;
      ctx.fillRect(-6, -4, 12, 10);
      // Cinturone con fibbia dorata
      ctx.fillStyle = "#1c1917";
      ctx.fillRect(-6, 2, 12, 2.5);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-1.5, 2, 3, 2.5);

      // Testa e bandana/tricorno
      ctx.fillStyle = "#fed7aa"; // pelle
      ctx.beginPath();
      ctx.arc(0, -8, 5, 0, Math.PI * 2);
      ctx.fill();

      if (isUs) {
        // Bandana rossa corsara
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-5, -13, 10, 4);
        ctx.fillRect(4, -11, 4, 3); // nodo
      } else {
        // Tricorno scuro da capitano
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.moveTo(-7, -10);
        ctx.lineTo(7, -10);
        ctx.lineTo(0, -15);
        ctx.closePath();
        ctx.fill();
      }

      // Gambe
      ctx.fillStyle = "#451a03";
      ctx.fillRect(-4, 6, 3, 5);
      ctx.fillRect(1, 6, 3, 5);

      // Nome
      ctx.fillStyle = "#fef3c7";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(name.slice(0, 10), 0, -16);
      ctx.restore();
    }

    // Risoluzione azione di gioco con fisica da ponte beccheggiante
    function playAction(moveType) {
      if (S.phase !== "play" && S.phase !== "intro") return;
      S.phase = "resolving";

      // Disabilita tasti temporaneamente
      wrap.querySelectorAll(".pad button").forEach((b) => (b.disabled = true));
      snd(moveType === "cannone" ? "cannon" : moveType === "burro" ? "wave" : "kick");

      const rollEffect = S.roll * 80; // pendenza ponte
      const windEffect = S.wind * 40; // deviazione vento

      // Calcola probabilità di successo in base all'azione e al rollio
      let successRate = 0.55;
      if (moveType === "sciabola") {
        // La sciabolata resiste al vento se è allineata
        successRate = 0.62 + (Math.abs(S.wind) < 0.4 ? 0.15 : -0.1);
      } else if (moveType === "cannone") {
        // Il cannone è potentissimo ma rischia di rimbalzare su un barile se il rollio è forte
        successRate = 0.65 + (Math.abs(S.roll) < 0.04 ? 0.18 : -0.15);
      } else if (moveType === "burro") {
        // Il burro sfrutta il rollio a proprio favore!
        successRate = 0.58 + (Math.abs(S.roll) > 0.04 ? 0.22 : -0.05);
      }

      // Modificatore difficoltà
      successRate /= oppK;

      const isGoal = Math.random() < successRate;

      // Anima il pallone verso la porta avversaria (destra) o respinto (sinistra)
      const targetX = isGoal ? W - 35 : W * 0.75 + (Math.random() * 40 - 20);
      const targetY = H / 2 + (Math.random() * 40 - 20) + rollEffect;

      S.ball.x = targetX;
      S.ball.y = Math.max(30, Math.min(H - 30, targetY));

      setTimeout(() => {
        if (isGoal) {
          S.a++;
          snd("goal");
          S.log = moveType === "cannone"
            ? "💣 BORDATA IN RETE! La cannonata spazza il ponte e sventola la rete della caracca!"
            : moveType === "burro"
            ? "🧈 GOL DEL BURRO! Il pallone scivola sulla doga bagnata e beffa il portiere avversario!"
            : "🗡️ SCIABOLATA VINCENTE! Tiro teso a fil di palo, imparabile per la ciurma nemica!";
          S.sub = `Vantaggio corsaro! ${esc(hero.name || "Tu")} festeggia con un morso alla galletta d'oro.`;
        } else {
          snd("wood");
          S.log = "🪵 RESPINTO DALLA PARATIA! Il tiro sbatte su un barile di melassa e torna in campo!";
          S.sub = "La difesa avversaria spazza il pallone oltre il timone di mezzana.";
        }
        updHUD();

        // Replica avversaria immediata
        setTimeout(() => {
          oppCounter();
        }, 800);
      }, 400);
    }

    function oppCounter() {
      // Controffensiva avversaria
      const oppPower = 0.42 * oppK;
      const oppGoal = Math.random() < oppPower;

      if (oppGoal) {
        S.b++;
        snd("wood");
        S.log = `⚔️ REPLICA DEI CORSARI! ${esc(opp.name)} sfrutta il rollio e infila il timoniere!`;
        S.sub = "Gol subito. Il ponte oscilla minacciosamente sotto i colpi di sciabola!";
      } else {
        S.log = "🛡️ PARATA DEL TIMONIERE! Il nostro portiere blocca la sfera scivolosa a fil di palo!";
        S.sub = "La ciurma bucaniera respinge l'arrembaggio e riconquista la melassa.";
      }

      S.turn++;
      updHUD();

      // Reset posizione pallone al centro
      S.ball.x = W / 2;
      S.ball.y = H / 2;

      if (S.turn > S.turnsTotal) {
        // Fine partita
        endMatch();
      } else {
        // Pronti per la prossima azione
        S.phase = "play";
        wrap.querySelectorAll(".pad button").forEach((b) => (b.disabled = false));
      }
    }

    function endMatch() {
      S.over = true;
      animActive = false;
      if (animId) cancelAnimationFrame(animId);

      const win = S.a > S.b;
      const tie = S.a === S.b;

      const ov = document.createElement("div");
      ov.className = "ov";
      ov.innerHTML = `
        <h2>${win ? "🏆 ARREMBAGGIO VITTORIOSO!" : tie ? "⚓ PAREGGIO TRA LE ONDE!" : "💀 SCONFITTA SUL PONTE!"}</h2>
        <p style="font-size:24px;font-weight:900;color:#facc15;margin:4px 0">${S.a} - ${S.b}</p>
        <p>${win ? "Hai conquistato il galeone avversario e messo le mani sui barili di gallette più preziose dei sette mari!" : tie ? "La tempesta separa i due vascelli: una parità onorevole tra gentiluomini di ventura." : "La ciurma nemica ti ha respinto sulle scialuppe. Ritenta l'abbordaggio con più vento a favore!"}</p>
        <button type="button" class="goB" id="btnArrClose">Concludi Arrembaggio ▸</button>
      `;
      wrap.appendChild(ov);

      ov.querySelector("#btnArrClose").onclick = () => {
        close();
        if (typeof o.done === "function") {
          o.done({ win, a: S.a, b: S.b, tie, quit: false });
        }
        if (typeof o.onDone === "function") {
          o.onDone({ win, a: S.a, b: S.b, tie, quit: false });
        }
      };
    }

    function close() {
      animActive = false;
      if (animId) cancelAnimationFrame(animId);
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      STATE = null;
    }

    // Eventi pulsanti
    wrap.querySelector("#btnSciabola").onclick = () => playAction("sciabola");
    wrap.querySelector("#btnCannone").onclick = () => playAction("cannone");
    wrap.querySelector("#btnBurro").onclick = () => playAction("burro");

    // Inizia ciclo
    S.phase = "play";
    updHUD();
    loop();

    return { close };
  }

  window.__arrembaggio = {
    start,
    state: () => STATE,
    stop: () => {
      const el = document.querySelector(".arrOv");
      if (el) el.remove();
      STATE = null;
    }
  };
})();
