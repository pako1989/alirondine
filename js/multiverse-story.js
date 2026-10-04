// ================= v24 · LA FENDITURA QUANTISTICA DELLA PANDA 30 =================
// Saga demenziale e multiversale (Ispirata a Rick & Morty, Futurama e Game of Thrones).
// Con VERO gameplay profondo interattivo:
// 1. Minigioco di volo/navigazione in tempo reale nel Tunnel Spaziotemporale
// 2. Dimensione C-137 (Rick & Morty): Calcio dei Portali con fisica balistica e teletrasporto
// 3. Dimensione 3000 (Futurama): Sfida a Bender con scudi magnetici, curve EMP e timer consegna focaccia
// 4. Dimensione Westeros (Game of Thrones): Battaglia alla Barriera di Pesto con Dracarys Shot contro il Re della Notte
(function () {
  const K_MULTI = "ali-di-rondine.multiverse-progress";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_MULTI));
      if (d && typeof d === "object") {
        return {
          portals: Array.isArray(d.portals) ? d.portals : [],
          won: d.won || 0,
          highScoreFlight: d.highScoreFlight || 0,
          rickScore: d.rickScore || 0,
          benderScore: d.benderScore || 0,
          gotScore: d.gotScore || 0
        };
      }
    } catch (e) {}
    return { portals: [], won: 0, highScoreFlight: 0, rickScore: 0, benderScore: 0, gotScore: 0 };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_MULTI, JSON.stringify(p));
    } catch (e) {}
  }

  let onExitCallback = null;
  let animLoopId = null;

  function getStageAlt() {
    return document.getElementById("stageAlt");
  }

  function setChap(t) {
    const el = document.getElementById("chap");
    if (el) el.textContent = t;
  }

  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#8e24aa; color:#fff; font-weight:bold;">${who}</span><span class="t">${html}</span>`;
    }
    if (window.addDialogueLog) {
      window.addDialogueLog(who, html);
    }
  }

  function showButtons(list, one) {
    const c = document.getElementById("choices");
    if (!c) return;
    c.innerHTML = "";
    c.className = "choices" + (one ? " one" : "");
    list.forEach((o) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      if (o.cls) b.className = o.cls;
      if (o.disabled) b.disabled = true;
      if (o.sub) {
        const s = document.createElement("small");
        s.textContent = o.sub;
        b.appendChild(s);
      }
      b.onclick = () => {
        c.innerHTML = "";
        if (window.haptic) window.haptic(15);
        if (o.fn) o.fn();
      };
      c.appendChild(b);
    });
  }

  function playSynth(freq, type = "sine", dur = 0.12, vol = 0.15) {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(vol, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + dur);
    } catch (e) {}
  }

  function closeMultiStage() {
    if (animLoopId) {
      cancelAnimationFrame(animLoopId);
      animLoopId = null;
    }
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = true;
      alt.style.display = "none";
      alt.innerHTML = "";
    }
  }

  // ================= 1. HUB CENTRALE DELLA PANDA QUANTISTICA =================
  function openMultiverseMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function showHub() {
    closeMultiStage();
    setChap("Multiverso · La Panda Quantistica");
    const prog = getProgress();

    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.innerHTML = `
        <img src="img/multiverse_panda.jpg" alt="Panda Quantistica" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.25) brightness(0.9);">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,5,40,0.3) 0%, rgba(14,4,30,0.92) 85%);"></div>
        <div style="position:relative; z-index:2; padding:12px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <div style="font-family:var(--display); font-size:16px; color:#e1bee7; text-shadow:0 0 10px rgba(225,190,231,0.8);">LA PANDA 30 QUANTISTICA</div>
            <div style="font-size:12px; color:#f3e5f5;">Warp Iperspaziale · Fritto Subatomico ad Alta Densità</div>
          </div>
          <div style="background:rgba(225,190,231,0.18); border:1.5px solid #ba68c8; border-radius:6px; padding:4px 9px; font-size:11px; color:#fff; text-align:right;">
            <div>Dimensioni sbloccate: <b>${prog.portals.length}/3</b></div>
            <div style="color:var(--gold); font-size:10px;">Record Tunnel: <b>${prog.highScoreFlight} pt</b></div>
          </div>
        </div>
      `;
    }

    showText(
      "Nonna Ferri",
      `«Leo, chiudi lo sportello con decisione che sennò prende aria! Ho fritto quaranta chili di panissa con l'olio della trattoria e quando ho ingranato la quarta la Panda ha aperto uno squarcio spaziotemporale a 88 miglia orarie!<br>
      Davanti al parabrezza vedo teste giganti nel cielo stile <b>Rick & Morty</b>, una metropoli futuristica con robot alcolizzati stile <b>Futurama</b> e una bufera di ghiaccio su Westeros stile <b>Game of Thrones</b>!<br>
      Allacciati la cintura: dobbiamo pilotare la Panda nel tunnel e riportare la focaccia a casa!»`
    );

    const b = [
      {
        label: "🚀 Pilota la Panda 30 nel Tunnel Iperspaziale",
        sub: "Schiva asteroidi di focaccia, raccogli olio tachionico e apri i varchi!",
        cls: "hot",
        fn: startHyperspaceFlight
      }
    ];

    if (prog.portals.includes("rick") || prog.highScoreFlight >= 100) {
      b.push({
        label: "🧪 Dimensione C-137: Il Torneo dei Cromulon (Rick & Morty)",
        sub: "Calcio dei Portali: sfrutta i varchi dimensionali per segnare!",
        cls: "hot",
        fn: () => startRickDimension()
      });
    }

    if (prog.portals.includes("bender") || prog.highScoreFlight >= 100) {
      b.push({
        label: "🤖 Dimensione 3000: Il Derby del Futuro (Futurama)",
        sub: "Sfida Bender e i suoi scudi elettromagnetici prima del timer!",
        cls: "hot",
        fn: () => startBenderDimension()
      });
    }

    if (prog.portals.includes("got") || prog.highScoreFlight >= 100) {
      b.push({
        label: "⚔️ Westeros Ligure: Il Trono di Focaccia (Game of Thrones)",
        sub: "Dracarys Shot infuocato contro gli Estranei e la Barriera di Pesto!",
        cls: "hot",
        fn: () => startThronesDimension()
      });
    }

    b.push(
      {
        label: "📖 La Teoria del Fritto Quantico di Nonna",
        sub: "Perché la frittura di acciughe piega la relatività generale",
        fn: showTheory
      },
      {
        label: "◂ Torna al Menu",
        cls: "pick",
        fn: () => {
          closeMultiStage();
          if (onExitCallback) onExitCallback();
        }
      }
    );

    showButtons(b, true);
  }

  function showTheory() {
    showText(
      "Nonna Ferri",
      `«Einstein conosceva la fisica, ma non sapeva mantecare il pesto! Quando l'olio d'oliva ligure tocca i 192 gradi e incontra la pastella fredda di farina di ceci, la densità molecolare genera particelle di <i>Frittoni Subatomici</i> con spin invertito.<br>
      La Panda 30 dell'82 non ha la centralina elettronica a frenarla: vibra alla frequenza dell'universo e fora il tessuto della realtà. Semplice, no?»`
    );
    showButtons([
      {
        label: "Saliamo a bordo e andiamo! ▸",
        cls: "hot",
        fn: startHyperspaceFlight
      },
      {
        label: "◂ Torna al Cruscotto",
        fn: showHub
      }
    ]);
  }

  // ================= 2. MINIGIOCO: PILOTAGGIO NEL TUNNEL IPERSPAZIALE =================
  function startHyperspaceFlight() {
    closeMultiStage();
    setChap("Tunnel Iperspaziale · Volo Tachionico");
    const alt = getStageAlt();
    if (!alt) return;

    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.innerHTML = `
      <canvas id="warpCanvas" width="320" height="200" style="display:block; width:100%; height:100%; background:#0a0416;"></canvas>
      <div id="warpUi" style="position:absolute; top:6px; left:8px; right:8px; display:flex; justify-content:space-between; align-items:center; background:rgba(18,6,36,0.85); border:1px solid #ba68c8; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#e1bee7; font-weight:bold;">🚗 PANDA 30: WARP</span>
        <span id="warpFuel" style="color:var(--gold);">Olio: <b>100%</b></span>
        <span id="warpScore" style="color:#00e5ff;">Punti: <b>0</b></span>
      </div>
      <div style="position:absolute; bottom:6px; left:6px; right:6px; display:flex; justify-content:space-between; gap:6px; z-index:15;">
        <button type="button" id="btnSteerL" class="mute" style="flex:1; padding:6px; background:rgba(186,104,200,0.3); border:1.5px solid #ba68c8; color:#fff; font-weight:bold; font-size:13px; border-radius:6px;">◂ STERZA SX</button>
        <button type="button" id="btnTurbo" class="mute" style="flex:1.2; padding:6px; background:rgba(255,77,90,0.4); border:1.5px solid #ff4d5a; color:#fff; font-weight:bold; font-size:12px; border-radius:6px;">⚡ TURBO PANISSA</button>
        <button type="button" id="btnSteerR" class="mute" style="flex:1; padding:6px; background:rgba(186,104,200,0.3); border:1.5px solid #ba68c8; color:#fff; font-weight:bold; font-size:13px; border-radius:6px;">STERZA DX ▸</button>
      </div>
    `;

    showText(
      "Nonna",
      `«Usa i pulsanti dello sterzo o le <b>frecce della tastiera (A / D)</b>! Schiva i meteoriti cosmici e i buchi neri, raccogli le fiasche d'olio tachionico per caricare il reattore al 100%!»`
    );

    const canvas = document.getElementById("warpCanvas");
    const ctx = canvas.getContext("2d");

    let pandaX = 160;
    let pandaY = 160;
    let speed = 3.5;
    let fuel = 100;
    let score = 0;
    let keys = { l: false, r: false, turbo: false };
    let stars = [];
    let items = []; // { x, y, type: 'oil' | 'rock' | 'wormhole', r: 8 }
    let gameActive = true;
    let frameCount = 0;

    for (let i = 0; i < 45; i++) {
      stars.push({
        x: Math.random() * 320,
        y: Math.random() * 200,
        z: Math.random() * 2 + 1,
        c: i % 3 === 0 ? "#ba68c8" : i % 3 === 1 ? "#00e5ff" : "#ffd23f"
      });
    }

    const btnL = document.getElementById("btnSteerL");
    const btnR = document.getElementById("btnSteerR");
    const btnT = document.getElementById("btnTurbo");

    const pressL = (on) => { keys.l = on; if (on && window.haptic) window.haptic(10); };
    const pressR = (on) => { keys.r = on; if (on && window.haptic) window.haptic(10); };
    const pressT = (on) => { keys.turbo = on; if (on) { playSynth(620, "sawtooth", 0.15, 0.18); if (window.haptic) window.haptic(25); } };

    btnL.onpointerdown = () => pressL(true);
    btnL.onpointerup = () => pressL(false);
    btnL.onpointerleave = () => pressL(false);

    btnR.onpointerdown = () => pressR(true);
    btnR.onpointerup = () => pressR(false);
    btnR.onpointerleave = () => pressR(false);

    btnT.onpointerdown = () => pressT(true);
    btnT.onpointerup = () => pressT(false);
    btnT.onpointerleave = () => pressT(false);

    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") pressL(true);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") pressR(true);
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") pressT(true);
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") pressL(false);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") pressR(false);
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") pressT(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    function step() {
      if (!gameActive) return;
      frameCount++;

      // Movimento Panda
      const curSpeed = keys.turbo && fuel > 5 ? speed * 1.7 : speed;
      if (keys.turbo && fuel > 5) {
        fuel -= 0.25;
        score += 2;
      } else {
        score += 1;
      }

      if (keys.l) pandaX -= curSpeed * 1.1;
      if (keys.r) pandaX += curSpeed * 1.1;
      pandaX = Math.max(30, Math.min(290, pandaX));

      // Spawna oggetti cosmici
      if (frameCount % 30 === 0) {
        const rnd = Math.random();
        if (rnd < 0.45) {
          items.push({ x: 40 + Math.random() * 240, y: -10, type: "oil", r: 9 });
        } else if (rnd < 0.85) {
          items.push({ x: 30 + Math.random() * 260, y: -10, type: "rock", r: 12 });
        } else {
          items.push({ x: 40 + Math.random() * 240, y: -10, type: "portal", r: 15 });
        }
      }

      // Aggiorna oggetti
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += curSpeed;

        // Collisione con Panda
        const dist = Math.hypot(it.x - pandaX, it.y - pandaY);
        if (dist < it.r + 14) {
          if (it.type === "oil") {
            fuel = Math.min(100, fuel + 22);
            score += 40;
            playSynth(880, "sine", 0.18, 0.22);
            if (window.toast) window.toast("+Olio Tachionico! (+40 pt)", "success", "⚡");
            items.splice(i, 1);
            continue;
          } else if (it.type === "rock") {
            fuel = Math.max(0, fuel - 25);
            playSynth(150, "sawtooth", 0.25, 0.3);
            if (window.toast) window.toast("BOOM! Impatto meteorite!", "error", "💥");
            items.splice(i, 1);
            continue;
          } else if (it.type === "portal") {
            // Varco dimensionale raggiunto!
            gameActive = false;
            finishFlight(true, score);
            return;
          }
        }

        if (it.y > 215) items.splice(i, 1);
      }

      // Render
      ctx.fillStyle = "#0c051a";
      ctx.fillRect(0, 0, 320, 200);

      // Stelle iper-spazio
      stars.forEach((s) => {
        s.y += curSpeed * s.z * 0.8;
        if (s.y > 200) { s.y = 0; s.x = Math.random() * 320; }
        ctx.fillStyle = s.c;
        ctx.fillRect(s.x, s.y, s.z, s.z * (keys.turbo ? 4 : 2));
      });

      // Disegna oggetti
      items.forEach((it) => {
        if (it.type === "oil") {
          ctx.beginPath();
          ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
          ctx.fillStyle = "#ffd23f";
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.stroke();
          ctx.font = "10px sans-serif";
          ctx.fillText("⚡", it.x - 4, it.y + 4);
        } else if (it.type === "rock") {
          ctx.beginPath();
          ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
          ctx.fillStyle = "#5c4033";
          ctx.fill();
          ctx.strokeStyle = "#a1887f";
          ctx.stroke();
        } else if (it.type === "portal") {
          ctx.beginPath();
          ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 229, 255, 0.35)";
          ctx.fill();
          ctx.strokeStyle = "#00e5ff";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.font = "12px sans-serif";
          ctx.fillText("🌀", it.x - 6, it.y + 4);
        }
      });

      // Disegna la Panda 30 vista da dietro
      ctx.save();
      ctx.translate(pandaX, pandaY);
      // Fumo marmitta se turbo
      if (keys.turbo) {
        ctx.fillStyle = "rgba(255,77,90,0.6)";
        ctx.beginPath();
        ctx.arc(-8, 12, 6, 0, Math.PI * 2);
        ctx.arc(8, 12, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Sagoma carrozzeria
      ctx.fillStyle = "#d32f2f"; // Rosso Panda
      ctx.fillRect(-16, -10, 32, 20);
      // Lunotto posteriore
      ctx.fillStyle = "#1a237e";
      ctx.fillRect(-12, -8, 24, 9);
      // Targa e luci
      ctx.fillStyle = "#fff";
      ctx.fillRect(-7, 4, 14, 5);
      ctx.fillStyle = "#ffeb3b";
      ctx.fillRect(-14, 2, 5, 4);
      ctx.fillRect(9, 2, 5, 4);
      ctx.restore();

      // UI update
      const elFuel = document.getElementById("warpFuel");
      const elScore = document.getElementById("warpScore");
      if (elFuel) elFuel.innerHTML = `Olio: <b>${Math.round(fuel)}%</b>`;
      if (elScore) elScore.innerHTML = `Punti: <b>${score}</b>`;

      // Game Over se esaurito carburante
      if (fuel <= 0) {
        gameActive = false;
        finishFlight(false, score);
        return;
      }

      // Se superati 250 punti senza portale, sblocca la scelta dei varchi
      if (score >= 260) {
        gameActive = false;
        finishFlight(true, score);
        return;
      }

      animLoopId = requestAnimationFrame(step);
    }

    function finishFlight(success, finalScore) {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      const prog = getProgress();
      if (finalScore > prog.highScoreFlight) {
        prog.highScoreFlight = finalScore;
        saveProgress(prog);
      }

      if (success) {
        if (window.toast) window.toast("✨ SQUARCIO SPAZIOTEMPORALE AGGANCIATO!", "success", "🌀");
        playSynth(523.2, "sine", 0.3, 0.25);
        showText(
          "Nonna Ferri",
          `<b style="color:var(--gold);">SALTO RIUSCITO! PUNTEGGIO: ${finalScore} PT!</b><br>
          «La Panda ruggisce come una tigre del Bengala alimentata a panissa! Abbiamo agganciato i tre segnali dimensionali principali: scegli dove vuoi fiondarti per sfidare i campioni delle altre realtà!»`
        );
        showButtons([
          {
            label: "🧪 1. Dimensione C-137: Torneo dei Cromulon (Rick & Morty)",
            sub: "Calcio dei Portali: piega le traiettorie coi varchi verdi!",
            cls: "hot",
            fn: startRickDimension
          },
          {
            label: "🤖 2. Dimensione 3000: Il Derby del Futuro (Futurama)",
            sub: "Sfida Bender e i suoi deflettori EMP prima che la focaccia si raffreddi!",
            cls: "hot",
            fn: startBenderDimension
          },
          {
            label: "⚔️ 3. Westeros Ligure: Il Trono di Focaccia (Game of Thrones)",
            sub: "Dracarys Shot contro il Re della Notte e la Barriera di Pesto!",
            cls: "hot",
            fn: startThronesDimension
          },
          {
            label: "🔄 Vola ancora nel Tunnel Iperspaziale",
            sub: "Batti il tuo record di punti",
            fn: startHyperspaceFlight
          }
        ], true);
      } else {
        showText(
          "Nonna Ferri",
          `<b style="color:#ff4d5a;">OLIO TACHIONICO ESAURITO!</b><br>
          «Mannaggia alla frittura! Abbiamo urtato troppi sassi cosmici e la Panda ha tossito! Dobbiamo ricaricare la caffettiera e ripartire prima che si chiuda la finestra temporale!»`
        );
        showButtons([
          {
            label: "Riprova il Tunnel Iperspaziale ▸",
            cls: "hot",
            fn: startHyperspaceFlight
          },
          {
            label: "◂ Torna al Cruscotto della Panda",
            fn: showHub
          }
        ]);
      }
    }

    animLoopId = requestAnimationFrame(step);
  }

  // ================= 3. DIMENSIONE C-137: CALCIO DEI PORTALI (RICK & MORTY) =================
  function startRickDimension() {
    closeMultiStage();
    setChap("Dimensione C-137 · Torneo dei Cromulon");
    const alt = getStageAlt();
    if (!alt) return;

    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.innerHTML = `
      <canvas id="rickCanvas" width="320" height="200" style="display:block; width:100%; height:100%; background:#10002b;"></canvas>
      <div style="position:absolute; top:4px; left:8px; right:8px; display:flex; justify-content:space-between; align-items:center; background:rgba(20,5,40,0.85); border:1px solid #76ff03; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#76ff03; font-weight:bold;">🧪 TORNEO DEI CROMULON</span>
        <span id="rickScoreEl" style="color:var(--gold);">Gol: <b>0 / 3</b></span>
        <span id="rickShotsEl" style="color:#00e5ff;">Tiri rimasti: <b>5</b></span>
      </div>
      <div style="position:absolute; bottom:6px; left:8px; right:8px; display:flex; gap:6px; z-index:15;">
        <button type="button" id="btnRickAimUp" class="mute" style="flex:1; padding:5px; background:rgba(118,255,3,0.25); border:1.5px solid #76ff03; color:#fff; font-weight:bold; font-size:12px; border-radius:6px;">▲ ALZA MIRA</button>
        <button type="button" id="btnRickAimDown" class="mute" style="flex:1; padding:5px; background:rgba(118,255,3,0.25); border:1.5px solid #76ff03; color:#fff; font-weight:bold; font-size:12px; border-radius:6px;">▼ ABBASSA</button>
        <button type="button" id="btnRickShoot" class="mute" style="flex:1.5; padding:5px; background:#76ff03; color:#000; font-weight:bold; font-size:12px; border-radius:6px;">⚽ TIRA NEL PORTALE!</button>
      </div>
    `;

    showText(
      "Testa Cromulon Gigante",
      `«<b>MOSTRATECI COSA SAPETE FARE!</b><br>
      Se non segnate almeno 3 gol al portiere alieno Glapflap sfruttando i portali quantici di Nonna, disintegreremo la Terra con un raggio al plasma per farci un campo di calcetto intergalattico!»`
    );

    const canvas = document.getElementById("rickCanvas");
    const ctx = canvas.getContext("2d");

    let goals = 0;
    let shotsLeft = 5;
    let aimAngle = -0.35; // radianti
    let power = 7.5;
    let ball = { x: 50, y: 155, vx: 0, vy: 0, flying: false };
    let gk = { y: 90, vy: 1.8, h: 32 };
    // Due portali quantici: Green P1 e Orange P2
    let p1 = { x: 120, y: 130, r: 16 };
    let p2 = { x: 200, y: 65, r: 16 };
    let portalCooldown = 0;
    let stars = [];

    for (let i = 0; i < 30; i++) {
      stars.push({ x: Math.random() * 320, y: Math.random() * 200, c: i % 2 === 0 ? "#76ff03" : "#00e5ff" });
    }

    const btnUp = document.getElementById("btnRickAimUp");
    const btnDown = document.getElementById("btnRickAimDown");
    const btnShoot = document.getElementById("btnRickShoot");

    btnUp.onclick = () => { aimAngle = Math.max(-0.85, aimAngle - 0.1); playSynth(440, "sine", 0.08); };
    btnDown.onclick = () => { aimAngle = Math.min(0.05, aimAngle + 0.1); playSynth(350, "sine", 0.08); };
    btnShoot.onclick = () => {
      if (ball.flying || shotsLeft <= 0) return;
      ball.flying = true;
      ball.vx = Math.cos(aimAngle) * power;
      ball.vy = Math.sin(aimAngle) * power;
      shotsLeft--;
      playSynth(520, "triangle", 0.15, 0.25);
      if (window.haptic) window.haptic(20);
    };

    function loop() {
      // Aggiorna portiere
      gk.y += gk.vy;
      if (gk.y < 35 || gk.y > 145) gk.vy = -gk.vy;

      // Aggiorna palla
      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vy += 0.08; // gravità leggera dello spazio alieno

        if (portalCooldown > 0) portalCooldown--;

        // Collisione con Portale Verde P1 -> Teletrasporto a P2!
        if (portalCooldown === 0 && Math.hypot(ball.x - p1.x, ball.y - p1.y) < p1.r) {
          ball.x = p2.x + 8;
          ball.y = p2.y;
          ball.vx = Math.abs(ball.vx) * 1.15; // accelerazione quantica
          ball.vy = -1.2;
          portalCooldown = 25;
          playSynth(950, "sine", 0.25, 0.3);
          if (window.toast) window.toast("🌀 TELETRASPORTO QUANTICO!", "info", "⚡");
        }

        // Parata del portiere alieno
        if (ball.x >= 280 && ball.x <= 295 && ball.y >= gk.y - 16 && ball.y <= gk.y + gk.h) {
          ball.flying = false;
          ball.x = 50; ball.y = 155;
          playSynth(180, "sawtooth", 0.2, 0.25);
          if (window.toast) window.toast("Parata da Glapflap!", "error", "🧤");
          checkEnd();
        }
        // GOL!
        else if (ball.x > 300 && ball.y >= 30 && ball.y <= 165) {
          ball.flying = false;
          ball.x = 50; ball.y = 155;
          goals++;
          playSynth(880, "sine", 0.3, 0.3);
          if (window.toast) window.toast("⚽ GOOOL QUANTICO DEI CROMULON!", "success", "🌟");
          checkEnd();
        }
        // Fuori campo
        else if (ball.x > 325 || ball.y > 205 || ball.y < -15) {
          ball.flying = false;
          ball.x = 50; ball.y = 155;
          checkEnd();
        }
      }

      // Render
      ctx.fillStyle = "#120024";
      ctx.fillRect(0, 0, 320, 200);

      // Stelle
      stars.forEach(s => { ctx.fillStyle = s.c; ctx.fillRect(s.x, s.y, 1.5, 1.5); });

      // Testa Cromulon nel cielo di sfondo
      ctx.fillStyle = "#ffb74d";
      ctx.beginPath();
      ctx.ellipse(160, 35, 30, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.fillRect(150, 28, 5, 5); ctx.fillRect(165, 28, 5, 5);
      ctx.fillRect(152, 44, 16, 4);

      // Porta aliena a destra
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 3;
      ctx.strokeRect(290, 30, 25, 140);

      // Portiere Glapflap
      ctx.fillStyle = "#e91e63";
      ctx.fillRect(282, gk.y, 10, gk.h);
      ctx.fillStyle = "#fff";
      ctx.fillRect(280, gk.y + 4, 3, 3);
      ctx.fillRect(280, gk.y + 12, 3, 3);

      // Portale P1 (Verde)
      ctx.save();
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(118, 255, 3, 0.35)";
      ctx.fill();
      ctx.strokeStyle = "#76ff03";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Portale P2 (Arancione)
      ctx.save();
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, p2.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 152, 0, 0.35)";
      ctx.fill();
      ctx.strokeStyle = "#ff9800";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Linea di mira di Leo
      if (!ball.flying) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x + Math.cos(aimAngle) * 45, ball.y + Math.sin(aimAngle) * 45);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Giocatore Leo
      ctx.fillStyle = "#3fa7ff";
      ctx.fillRect(36, 142, 14, 24);
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(40, 134, 8, 8); // Testa

      // Pallone
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Aggiorna UI testo
      const sc = document.getElementById("rickScoreEl");
      const sh = document.getElementById("rickShotsEl");
      if (sc) sc.innerHTML = `Gol: <b>${goals} / 3</b>`;
      if (sh) sh.innerHTML = `Tiri rimasti: <b>${shotsLeft}</b>`;

      animLoopId = requestAnimationFrame(loop);
    }

    function checkEnd() {
      if (goals >= 3) {
        cancelAnimationFrame(animLoopId);
        const prog = getProgress();
        if (!prog.portals.includes("rick")) prog.portals.push("rick");
        prog.rickScore = Math.max(prog.rickScore, goals);
        saveProgress(prog);
        if (window.addCoins) window.addCoins(20);
        if (window.triggerAnimeCutin) {
          window.triggerAnimeCutin({ who: "Leo & Nonna", shotName: "GOL QUANTICO CROMULON!", sfxWord: "DISQUALIFIED!" });
        }
        showText(
          "Cromulon Gigante",
          `«<b>MI PIACE QUELLO CHE AVETE FATTO! BUON LAVORO!</b><br>
          La Terra è salva per un'altra settimana! Vi concedo 20 monete d'oro cosmiche e l'approvazione del Consiglio Galattico!»`
        );
        showButtons([
          { label: "Esplora un'altra dimensione ▸", cls: "hot", fn: showHub },
          { label: "Torna al Menu Principale 🏠", fn: () => { closeMultiStage(); if (onExitCallback) onExitCallback(); } }
        ], true);
      } else if (shotsLeft <= 0) {
        cancelAnimationFrame(animLoopId);
        showText(
          "Cromulon",
          `«<b>NON ABBASTANZA TALENTO!</b><br>
          Avete fatto solo ${goals} gol su 3! Glapflap ha parato le vostre speranze. Ricaricate i portali e riprovateci!»`
        );
        showButtons([
          { label: "Riprova la Sfida dei Cromulon ▸", cls: "hot", fn: startRickDimension },
          { label: "◂ Torna al Cruscotto della Panda", fn: showHub }
        ], true);
      }
    }

    animLoopId = requestAnimationFrame(loop);
  }

  // ================= 4. DIMENSIONE 3000: IL DERBY DEL FUTURO (FUTURAMA) =================
  function startBenderDimension() {
    closeMultiStage();
    setChap("Dimensione 3000 · Il Derby del Molo");
    const alt = getStageAlt();
    if (!alt) return;

    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.innerHTML = `
      <canvas id="futCanvas" width="320" height="200" style="display:block; width:100%; height:100%; background:#051923;"></canvas>
      <div style="position:absolute; top:4px; left:8px; right:8px; display:flex; justify-content:space-between; align-items:center; background:rgba(0,53,102,0.85); border:1px solid #00b4d8; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#00b4d8; font-weight:bold;">🤖 BENDER DEFLECTOR 3000</span>
        <span id="futTimerEl" style="color:var(--gold);">Timer Focaccia: <b>35s</b></span>
        <span id="futScoreEl" style="color:#90e0ef;">Gol: <b>0 / 2</b></span>
      </div>
      <div style="position:absolute; bottom:6px; left:8px; right:8px; display:flex; gap:6px; z-index:15;">
        <button type="button" id="btnFutFeint" class="mute" style="flex:1; padding:5px; background:rgba(255,210,63,0.3); border:1.5px solid #ffd23f; color:#fff; font-weight:bold; font-size:12px; border-radius:6px;">🎭 FINTA ANTI-EMP</button>
        <button type="button" id="btnFutShoot" class="mute" style="flex:1.5; padding:5px; background:#00b4d8; color:#000; font-weight:bold; font-size:12px; border-radius:6px;">⚡ TIRO MAGNETICO!</button>
      </div>
    `;

    showText(
      "Bender Bending Rodríguez",
      `«Mettetevi comodi e ammirate il mio lucido telaio d'acciaio! Con il mio scudo deflettore a birra e titanio non farete mai gol alla Planet Express! E se la focaccia si raffredda me la mangio io!»`
    );

    const canvas = document.getElementById("futCanvas");
    const ctx = canvas.getContext("2d");

    let goals = 0;
    let timerSec = 35;
    let benderY = 90;
    let benderVy = 2.2;
    let shieldOn = true;
    let shieldTimer = 0;
    let ball = { x: 60, y: 150, vx: 0, vy: 0, flying: false };
    let countdownInterval = setInterval(() => {
      timerSec--;
      const el = document.getElementById("futTimerEl");
      if (el) el.innerHTML = `Timer Focaccia: <b>${timerSec}s</b>`;
      if (timerSec <= 0) {
        clearInterval(countdownInterval);
        checkFutEnd();
      }
    }, 1000);

    const btnFeint = document.getElementById("btnFutFeint");
    const btnShoot = document.getElementById("btnFutShoot");

    btnFeint.onclick = () => {
      // La finta disattiva temporaneamente lo scudo di Bender per 2.5 secondi
      shieldOn = false;
      shieldTimer = 140;
      playSynth(700, "square", 0.12, 0.2);
      if (window.toast) window.toast("⚡ SCUDO DI BENDER SOVRACCARICATO!", "info", "🔧");
    };

    btnShoot.onclick = () => {
      if (ball.flying) return;
      ball.flying = true;
      ball.vx = 8.5;
      ball.vy = -1.8;
      playSynth(600, "sawtooth", 0.15, 0.25);
    };

    function futLoop() {
      // Movimento Bender
      benderY += benderVy;
      if (benderY < 40 || benderY > 140) benderVy = -benderVy;

      // Gestione scudo
      if (shieldTimer > 0) {
        shieldTimer--;
        if (shieldTimer === 0) shieldOn = true;
      }

      // Aggiorna palla
      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Se scudo attivo, respinge la palla!
        if (shieldOn && ball.x >= 240 && ball.x <= 265 && ball.y >= benderY - 20 && ball.y <= benderY + 45) {
          ball.flying = false;
          ball.x = 60; ball.y = 150;
          playSynth(150, "sawtooth", 0.25, 0.3);
          if (window.toast) window.toast("Scudo Magnetico: TIRO RESPINTO!", "error", "🛡️");
        }
        // Se scudo disattivato e colpisce la porta -> GOL!
        else if (!shieldOn && ball.x >= 285 && ball.y >= 30 && ball.y <= 165) {
          ball.flying = false;
          ball.x = 60; ball.y = 150;
          goals++;
          shieldOn = true; // reset
          playSynth(880, "sine", 0.35, 0.3);
          if (window.toast) window.toast("⚽ GOL ALLA PLANET EXPRESS!", "success", "🌟");
          const sc = document.getElementById("futScoreEl");
          if (sc) sc.innerHTML = `Gol: <b>${goals} / 2</b>`;
          checkFutEnd();
        }
        else if (ball.x > 320 || ball.y < 0 || ball.y > 200) {
          ball.flying = false;
          ball.x = 60; ball.y = 150;
        }
      }

      // Render
      ctx.fillStyle = "#031926";
      ctx.fillRect(0, 0, 320, 200);

      // Linee cyber del campo
      ctx.strokeStyle = "rgba(0, 180, 216, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 175); ctx.lineTo(320, 175);
      ctx.stroke();

      // Bender
      ctx.fillStyle = "#9e9e9e"; // Metallo Bender
      ctx.fillRect(270, benderY, 18, 36);
      // Occhi visore
      ctx.fillStyle = "#fff";
      ctx.fillRect(268, benderY + 6, 8, 6);
      ctx.fillStyle = "#000";
      ctx.fillRect(270, benderY + 8, 2, 2);
      // Antenna
      ctx.strokeStyle = "#9e9e9e";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(279, benderY); ctx.lineTo(279, benderY - 8); ctx.stroke();

      // Scudo energetico attorno a Bender
      if (shieldOn) {
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(265, benderY + 18, 28, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }

      // Leo
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(52, 138, 14, 26);

      // Palla
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      animLoopId = requestAnimationFrame(futLoop);
    }

    function checkFutEnd() {
      if (goals >= 2) {
        clearInterval(countdownInterval);
        cancelAnimationFrame(animLoopId);
        const prog = getProgress();
        if (!prog.portals.includes("bender")) prog.portals.push("bender");
        prog.benderScore = Math.max(prog.benderScore, goals);
        saveProgress(prog);
        if (window.addCoins) window.addCoins(25);
        showText(
          "Bender",
          `«Maledizione! Mi avete bruciato i diodi con quella finta! Va bene, prendetevi la mancia da 25 monete e portate la teglia calda a Farnsworth prima che mi metta a piangere grasso sintetico!»`
        );
        showButtons([
          { label: "Esplora un'altra dimensione ▸", cls: "hot", fn: showHub },
          { label: "Torna al Menu Principale 🏠", fn: () => { closeMultiStage(); if (onExitCallback) onExitCallback(); } }
        ], true);
      } else if (timerSec <= 0) {
        clearInterval(countdownInterval);
        cancelAnimationFrame(animLoopId);
        showText(
          "Nonna Ferri",
          `«La focaccia si è raffreddata e Bender se l'è mangiata tutta con una birra da due litri! Dobbiamo rimettere in moto la Panda e riprovare la consegna!»`
        );
        showButtons([
          { label: "Riprova la Sfida di Bender ▸", cls: "hot", fn: startBenderDimension },
          { label: "◂ Torna al Cruscotto della Panda", fn: showHub }
        ], true);
      }
    }

    animLoopId = requestAnimationFrame(futLoop);
  }

  // ================= 5. DIMENSIONE WESTEROS: DRACARYS SHOT (GAME OF THRONES) =================
  function startThronesDimension() {
    closeMultiStage();
    setChap("Westeros Ligure · La Battaglia della Barriera");
    const alt = getStageAlt();
    if (!alt) return;

    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.innerHTML = `
      <canvas id="gotCanvas" width="320" height="200" style="display:block; width:100%; height:100%; background:#0b132b;"></canvas>
      <div style="position:absolute; top:4px; left:8px; right:8px; display:flex; justify-content:space-between; align-items:center; background:rgba(11,19,43,0.9); border:1px solid #48cae4; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#48cae4; font-weight:bold;">⚔️ LA BARRIERA DI PESTO</span>
        <span id="gotWindEl" style="color:var(--gold);">Vento del Nord: <b>◄ Medio</b></span>
        <span id="gotGkHp" style="color:#ff4d5a;">Ghiaccio Re della Notte: <b>100%</b></span>
      </div>
      <div style="position:absolute; bottom:6px; left:8px; right:8px; display:flex; gap:6px; z-index:15;">
        <button type="button" id="btnGotAimL" class="mute" style="flex:1; padding:5px; background:rgba(72,202,228,0.25); border:1.5px solid #48cae4; color:#fff; font-weight:bold; font-size:12px; border-radius:6px;">◄ ANGOLA SX</button>
        <button type="button" id="btnGotAimR" class="mute" style="flex:1; padding:5px; background:rgba(72,202,228,0.25); border:1.5px solid #48cae4; color:#fff; font-weight:bold; font-size:12px; border-radius:6px;">ANGOLA DX ►</button>
        <button type="button" id="btnGotDracarys" class="mute" style="flex:1.5; padding:5px; background:#ff5400; color:#fff; font-weight:bold; font-size:12px; border-radius:6px;">🔥 DRACARYS SHOT!</button>
      </div>
    `;

    showText(
      "Re della Notte",
      `«<i>L'Inverno è arrivato sui moli di Borgo Marino.</i> La Barriera di Pesto è congelata per l'eternità. Se la vostra fiamma non è pura, diventerete spettri della banchina per mille inverni!»`
    );

    const canvas = document.getElementById("gotCanvas");
    const ctx = canvas.getContext("2d");

    let gkHp = 100;
    let aimX = 280;
    let wind = -1.2; // Spinge verso sinistra
    let ball = { x: 50, y: 160, vx: 0, vy: 0, flying: false, onFire: false };
    let snow = [];

    for (let i = 0; i < 40; i++) {
      snow.push({ x: Math.random() * 320, y: Math.random() * 200, sp: Math.random() * 1.5 + 0.8 });
    }

    const btnL = document.getElementById("btnGotAimL");
    const btnR = document.getElementById("btnGotAimR");
    const btnFire = document.getElementById("btnGotDracarys");

    btnL.onclick = () => { aimX = Math.max(240, aimX - 12); playSynth(400, "sine", 0.08); };
    btnR.onclick = () => { aimX = Math.min(310, aimX + 12); playSynth(460, "sine", 0.08); };

    btnFire.onclick = () => {
      if (ball.flying) return;
      ball.flying = true;
      ball.onFire = true;
      ball.vx = 7.8;
      ball.vy = (aimX - ball.x) * 0.018;
      playSynth(850, "sawtooth", 0.3, 0.35);
      if (window.haptic) window.haptic(35);
      if (window.triggerAnimeCutin) {
        window.triggerAnimeCutin({
          who: "Leo Moretti",
          shotName: "TIRO DRACARYS DEL FUOCO VALYRIANO!",
          isEgo: true,
          sfxWord: "FUOCO E SANGUE!"
        });
      }
    };

    function gotLoop() {
      // Neve
      snow.forEach(s => {
        s.y += s.sp;
        s.x += wind * 0.5;
        if (s.y > 200) { s.y = 0; s.x = Math.random() * 320; }
      });

      // Palla
      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy + wind;

        // Impatto con la porta/Re della Notte
        if (ball.x >= 280) {
          ball.flying = false;
          ball.x = 50; ball.y = 160;
          gkHp = Math.max(0, gkHp - 50);
          playSynth(220, "sawtooth", 0.35, 0.35);
          if (window.toast) window.toast("BOOM! Il Fuoco Valyriano scioglie il ghiaccio!", "success", "🔥");
          const el = document.getElementById("gotGkHp");
          if (el) el.innerHTML = `Ghiaccio Re della Notte: <b>${gkHp}%</b>`;
          checkGotEnd();
        }
      }

      // Render
      ctx.fillStyle = "#0b132b";
      ctx.fillRect(0, 0, 320, 200);

      // Neve
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      snow.forEach(s => ctx.fillRect(s.x, s.y, 2, 2));

      // Barriera di Ghiaccio (Game of Thrones Wall)
      ctx.fillStyle = "#48cae4";
      ctx.fillRect(285, 20, 35, 160);
      ctx.fillStyle = "#ade8f4";
      ctx.fillRect(288, 25, 29, 150);

      // Re della Notte (Night King)
      ctx.fillStyle = "#023e8a";
      ctx.fillRect(275, 75, 14, 30);
      // Occhi azzurri glaciali
      ctx.fillStyle = "#00f5d4";
      ctx.fillRect(274, 80, 3, 3);
      ctx.fillRect(274, 86, 3, 3);

      // Leo in armatura con mantello
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(44, 144, 14, 26);
      ctx.fillStyle = "#d00000"; // Mantello rosso
      ctx.fillRect(38, 148, 6, 18);

      // Palla infuocata
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = ball.onFire ? "#ff5400" : "#fff";
      ctx.fill();

      // Scia di fiamme
      if (ball.flying) {
        ctx.fillStyle = "rgba(255, 183, 3, 0.6)";
        ctx.beginPath();
        ctx.arc(ball.x - 8, ball.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animLoopId = requestAnimationFrame(gotLoop);
    }

    function checkGotEnd() {
      if (gkHp <= 0) {
        cancelAnimationFrame(animLoopId);
        const prog = getProgress();
        if (!prog.portals.includes("got")) prog.portals.push("got");
        prog.gotScore = 100;
        prog.won++;
        saveProgress(prog);
        if (window.addCoins) window.addCoins(30);

        showText(
          "Re della Notte",
          `«<i>La Barriera è caduta... il fuoco della Rondine arde più dell'inverno eterno.</i> Vi consegno il Trono di Focaccia delle Tre Riviere e 30 monete d'oro valyriane!»`
        );
        showButtons([
          {
            label: "🏆 Rientra a Borgo Marino da Campione del Multiverso! ▸",
            cls: "hot",
            fn: () => {
              if (window.toast) window.toast("👑 TRONO DI FOCACCIA CONQUISTATO!", "success", "🏆");
              showHub();
            }
          },
          {
            label: "Torna al Menu Principale 🏠",
            fn: () => {
              closeMultiStage();
              if (onExitCallback) onExitCallback();
            }
          }
        ], true);
      }
    }

    animLoopId = requestAnimationFrame(gotLoop);
  }

  window.openMultiverseMenu = openMultiverseMenu;
})();
