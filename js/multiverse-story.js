// ================= v25 · LA FENDITURA QUANTISTICA DELLA PANDA 30 =================
// Saga demenziale e multiversale (Ispirata a Rick & Morty, Futurama e Game of Thrones).
// Con VERO gameplay profondo, controlli su #choices sempre visibili e reattivi,
// animazioni su Canvas e tutte le 4 dimensioni sbloccate e giocabili subito!
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
  let activeAnimId = null;
  let activeIntervalId = null;

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

  function clearLoops() {
    if (activeAnimId) {
      cancelAnimationFrame(activeAnimId);
      activeAnimId = null;
    }
    if (activeIntervalId) {
      clearInterval(activeIntervalId);
      activeIntervalId = null;
    }
  }

  function closeMultiStage() {
    clearLoops();
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
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,5,40,0.25) 0%, rgba(14,4,30,0.92) 85%);"></div>
        <div style="position:relative; z-index:2; padding:10px 12px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <div style="font-family:var(--display); font-size:15px; color:#e1bee7; text-shadow:0 0 10px rgba(225,190,231,0.8);">LA PANDA 30 QUANTISTICA</div>
            <div style="font-size:11px; color:#f3e5f5;">Warp Iperspaziale · Fritto Subatomico ad Alta Densità</div>
          </div>
          <div style="background:rgba(225,190,231,0.18); border:1.5px solid #ba68c8; border-radius:6px; padding:4px 8px; font-size:11px; color:#fff; text-align:right;">
            <div>Dimensioni vinte: <b>${prog.portals.length}/3</b></div>
            <div style="color:var(--gold); font-size:10px;">Record Tunnel: <b>${prog.highScoreFlight} pt</b></div>
          </div>
        </div>
      `;
    }

    showText(
      "Nonna Ferri",
      `«Leo, chiudi lo sportello con decisione che sennò prende aria! Ho fritto quaranta chili di panissa con l'olio della trattoria e quando ho ingranato la quarta la Panda ha aperto uno squarcio spaziotemporale a 88 miglia orarie!<br>
      Davanti al parabrezza vedo teste giganti nel cielo stile <b>Rick & Morty</b>, una metropoli futuristica con robot alcolizzati stile <b>Futurama</b> e una bufera di ghiaccio su Westeros stile <b>Game of Thrones</b>!<br>
      Scegli quale dimensione affrontare oppure vola nel tunnel a fare rifornimento!»`
    );

    showButtons([
      {
        label: "🚀 1. Pilota la Panda nel Tunnel Iperspaziale",
        sub: "Minigioco arcade a scorrimento: schiva i meteoriti e raccogli l'olio!",
        cls: "hot",
        fn: startHyperspaceFlight
      },
      {
        label: "🧪 2. Dimensione C-137: Il Torneo dei Cromulon (Rick & Morty)",
        sub: "Calcio dei Portali: piega la traiettoria coi varchi verde e arancione!",
        cls: "hot",
        fn: startRickDimension
      },
      {
        label: "🤖 3. Dimensione 3000: Il Derby del Futuro (Futurama)",
        sub: "Sfida Bender e i suoi deflettori EMP prima che la focaccia si raffreddi!",
        cls: "hot",
        fn: startBenderDimension
      },
      {
        label: "⚔️ 4. Westeros Ligure: Il Trono di Focaccia (Game of Thrones)",
        sub: "Dracarys Shot infuocato contro gli Estranei e la Barriera di Pesto!",
        cls: "hot",
        fn: startThronesDimension
      },
      {
        label: "📖 La Teoria del Fritto Quantico di Nonna",
        sub: "Perché la frittura di acciughe piega la relatività generale",
        fn: showTheory
      },
      {
        label: "◂ Torna al Menu Principale",
        cls: "pick",
        fn: () => {
          closeMultiStage();
          if (onExitCallback) onExitCallback();
        }
      }
    ], true);
  }

  function showTheory() {
    showText(
      "Nonna Ferri",
      `«Einstein conosceva la fisica, ma non sapeva mantecare il pesto! Quando l'olio d'oliva tocca i 192 gradi e incontra la pastella di farina di ceci, la densità molecolare genera particelle di <i>Frittoni Subatomici</i> con spin invertito.<br>
      La Panda 30 dell'82 non ha la centralina elettronica a frenarla: vibra alla frequenza dell'universo e fora il tessuto della realtà. Semplice, no?»`
    );
    showButtons([
      {
        label: "Saliamo a bordo e andiamo! ▸",
        cls: "hot",
        fn: startHyperspaceFlight
      },
      {
        label: "◂ Torna al Cruscotto della Panda",
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
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(18,6,36,0.85); border:1px solid #ba68c8; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#e1bee7; font-weight:bold;">🚗 PANDA 30: WARP</span>
        <span id="warpFuel" style="color:var(--gold);">Olio: <b>100%</b></span>
        <span id="warpScore" style="color:#00e5ff;">Punti: <b>0</b></span>
      </div>
    `;

    const canvas = document.getElementById("warpCanvas");
    const ctx = canvas.getContext("2d");

    let pandaX = 160;
    let pandaY = 160;
    let speed = 3.2;
    let fuel = 100;
    let score = 0;
    let stars = [];
    let items = []; // { x, y, type: 'oil' | 'rock' | 'portal', r: 8 }
    let frameCount = 0;
    let isGameOver = false;

    for (let i = 0; i < 45; i++) {
      stars.push({
        x: Math.random() * 320,
        y: Math.random() * 200,
        z: Math.random() * 2 + 1,
        c: i % 3 === 0 ? "#ba68c8" : i % 3 === 1 ? "#00e5ff" : "#ffd23f"
      });
    }

    function steer(delta) {
      if (isGameOver) return;
      pandaX = Math.max(30, Math.min(290, pandaX + delta));
      playSynth(440, "sine", 0.06, 0.1);
      if (window.haptic) window.haptic(10);
    }

    function turbo() {
      if (isGameOver || fuel <= 8) return;
      fuel = Math.max(0, fuel - 10);
      score += 25;
      playSynth(680, "sawtooth", 0.2, 0.25);
      if (window.haptic) window.haptic(25);
      if (window.toast) window.toast("⚡ SCATTO TURBO PANISSA!", "info", "🚀");
    }

    // Comandi da tastiera opzionali
    const onKey = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") steer(-25);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") steer(25);
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") turbo();
    };
    window.addEventListener("keydown", onKey);

    function updateFlightUi() {
      showText(
        "Nonna",
        `«Schiva i sassi spaziali e raccogli le fiasche d'<b>Olio Tachionico</b> (⚡) per mantenere il reattore carico! Usa i pulsanti qui sotto o le <b>frecce della tastiera</b>!»`
      );
      showButtons([
        {
          label: "◂ Sterza a Sinistra",
          sub: "Sposta la Panda a sinistra",
          fn: () => steer(-30)
        },
        {
          label: "⚡ Turbo Panissa (+25 pt)",
          sub: "Brucia olio per scattare avanti",
          cls: "hot",
          fn: turbo
        },
        {
          label: "Sterza a Destra ▸",
          sub: "Sposta la Panda a destra",
          fn: () => steer(30)
        },
        {
          label: "🛑 Rientra al Cruscotto della Panda",
          sub: "Esci dal tunnel",
          fn: () => {
            window.removeEventListener("keydown", onKey);
            showHub();
          }
        }
      ]);
    }
    updateFlightUi();

    function flightLoop() {
      if (isGameOver) return;
      frameCount++;
      score += 1;

      // Spawna oggetti cosmici
      if (frameCount % 24 === 0) {
        const rnd = Math.random();
        if (rnd < 0.45) {
          items.push({ x: 35 + Math.random() * 250, y: -10, type: "oil", r: 9 });
        } else if (rnd < 0.82) {
          items.push({ x: 30 + Math.random() * 260, y: -10, type: "rock", r: 11 });
        } else {
          items.push({ x: 45 + Math.random() * 230, y: -10, type: "portal", r: 14 });
        }
      }

      // Aggiorna oggetti
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += speed;

        // Collisione con la Panda
        const dist = Math.hypot(it.x - pandaX, it.y - pandaY);
        if (dist < it.r + 14) {
          if (it.type === "oil") {
            fuel = Math.min(100, fuel + 22);
            score += 35;
            playSynth(880, "sine", 0.18, 0.22);
            if (window.toast) window.toast("+Olio Tachionico! (+35 pt)", "success", "⚡");
            items.splice(i, 1);
            continue;
          } else if (it.type === "rock") {
            fuel = Math.max(0, fuel - 25);
            playSynth(150, "sawtooth", 0.25, 0.3);
            if (window.toast) window.toast("BOOM! Impatto meteorite! (-25% olio)", "error", "💥");
            items.splice(i, 1);
            continue;
          } else if (it.type === "portal") {
            // Varco dimensionale raggiunto!
            isGameOver = true;
            window.removeEventListener("keydown", onKey);
            finishFlight(true, score);
            return;
          }
        }

        if (it.y > 215) items.splice(i, 1);
      }

      // Render
      ctx.fillStyle = "#0c051a";
      ctx.fillRect(0, 0, 320, 200);

      // Stelle
      stars.forEach((s) => {
        s.y += speed * s.z * 0.9;
        if (s.y > 200) { s.y = 0; s.x = Math.random() * 320; }
        ctx.fillStyle = s.c;
        ctx.fillRect(s.x, s.y, s.z, s.z * 2.2);
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
          ctx.fillStyle = "#000";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText("⚡", it.x - 4, it.y + 3);
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
          ctx.fillStyle = "rgba(0, 229, 255, 0.4)";
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
      // Carrozzeria Rossa
      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(-16, -10, 32, 20);
      // Lunotto blu notte
      ctx.fillStyle = "#1a237e";
      ctx.fillRect(-12, -8, 24, 9);
      // Fari e targa
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

      // Se carburante esaurito
      if (fuel <= 0) {
        isGameOver = true;
        window.removeEventListener("keydown", onKey);
        finishFlight(false, score);
        return;
      }

      // Se superati 250 punti, traguardo varco raggiunto!
      if (score >= 250) {
        isGameOver = true;
        window.removeEventListener("keydown", onKey);
        finishFlight(true, score);
        return;
      }

      activeAnimId = requestAnimationFrame(flightLoop);
    }

    function finishFlight(success, finalScore) {
      clearLoops();
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
          «La Panda ruggisce alimentata a panissa! Abbiamo agganciato il tunnel quantico. Scegli in quale realtà vuoi catapultarti per giocare!»`
        );
        showButtons([
          {
            label: "🧪 1. Dimensione C-137: Torneo dei Cromulon (Rick & Morty)",
            sub: "Calcio dei Portali: piega le traiettorie coi varchi!",
            cls: "hot",
            fn: startRickDimension
          },
          {
            label: "🤖 2. Dimensione 3000: Il Derby del Futuro (Futurama)",
            sub: "Sfida Bender e i suoi deflettori EMP prima dello scadere del timer!",
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
            sub: "Batti il tuo record personale",
            fn: startHyperspaceFlight
          },
          {
            label: "◂ Torna al Cruscotto della Panda",
            fn: showHub
          }
        ], true);
      } else {
        showText(
          "Nonna Ferri",
          `<b style="color:#ff4d5a;">OLIO TACHIONICO ESAURITO!</b><br>
          «Mannaggia alla frittura! Abbiamo urtato troppi sassi cosmici e il motore si è spento! Ricarica la caffettiera e ripartiamo subito!»`
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
        ], true);
      }
    }

    activeAnimId = requestAnimationFrame(flightLoop);
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
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(20,5,40,0.85); border:1px solid #76ff03; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#76ff03; font-weight:bold;">🧪 TORNEO DEI CROMULON</span>
        <span id="rickScoreEl" style="color:var(--gold);">Gol: <b>0 / 2</b></span>
        <span id="rickShotsEl" style="color:#00e5ff;">Tiri rimasti: <b>5</b></span>
      </div>
    `;

    const canvas = document.getElementById("rickCanvas");
    const ctx = canvas.getContext("2d");

    let goals = 0;
    let shotsLeft = 5;
    let aimAngle = -0.32; // radianti
    let power = 7.2;
    let ball = { x: 50, y: 155, vx: 0, vy: 0, flying: false };
    let gk = { y: 90, vy: 1.8, h: 34 };
    let p1 = { x: 125, y: 130, r: 16 }; // Portale Verde
    let p2 = { x: 205, y: 65, r: 16 };  // Portale Arancione
    let portalCooldown = 0;
    let stars = [];

    for (let i = 0; i < 30; i++) {
      stars.push({ x: Math.random() * 320, y: Math.random() * 200, c: i % 2 === 0 ? "#76ff03" : "#00e5ff" });
    }

    function shoot(anglePreset) {
      if (ball.flying || shotsLeft <= 0) return;
      aimAngle = anglePreset;
      ball.flying = true;
      ball.vx = Math.cos(aimAngle) * power;
      ball.vy = Math.sin(aimAngle) * power;
      shotsLeft--;
      playSynth(520, "triangle", 0.15, 0.25);
      if (window.haptic) window.haptic(20);
      updateRickUi();
    }

    function updateRickUi() {
      showText(
        "Testa Cromulon Gigante",
        `«<b>MOSTRATECI COSA SAPETE FARE!</b><br>
        Segnate almeno 2 gol a Glapflap usando i portali quantici di Nonna, altrimenti disintegreremo la Terra per farci un campo di bocce intergalattico!»`
      );
      showButtons([
        {
          label: "🌀 1. Tiro a Mezza Altezza nel Portale Verde",
          sub: "La palla entra nel varco verde ed esce dall'arancione!",
          cls: "hot",
          disabled: ball.flying || shotsLeft <= 0,
          fn: () => shoot(-0.35)
        },
        {
          label: "📐 2. Parabola Alta all'Incrocio",
          sub: "Tiro a spiovere sopra il portiere alieno",
          disabled: ball.flying || shotsLeft <= 0,
          fn: () => shoot(-0.65)
        },
        {
          label: "⚡ 3. Rasoterra Veloce a Effetto",
          sub: "Tiro teso sul palo lontano",
          disabled: ball.flying || shotsLeft <= 0,
          fn: () => shoot(-0.08)
        },
        {
          label: "◂ Torna al Cruscotto della Panda",
          fn: () => { clearLoops(); showHub(); }
        }
      ]);
    }
    updateRickUi();

    function rickLoop() {
      // Movimento portiere
      gk.y += gk.vy;
      if (gk.y < 35 || gk.y > 140) gk.vy = -gk.vy;

      // Movimento palla
      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vy += 0.08;

        if (portalCooldown > 0) portalCooldown--;

        // Entrata in Portale Verde P1 -> Teletrasporto a P2!
        if (portalCooldown === 0 && Math.hypot(ball.x - p1.x, ball.y - p1.y) < p1.r) {
          ball.x = p2.x + 10;
          ball.y = p2.y;
          ball.vx = Math.abs(ball.vx) * 1.2;
          ball.vy = -1.2;
          portalCooldown = 25;
          playSynth(950, "sine", 0.25, 0.3);
          if (window.toast) window.toast("🌀 TELETRASPORTO QUANTICO NEL PORTALE!", "info", "⚡");
        }

        // Parata del portiere alieno
        if (ball.x >= 280 && ball.x <= 295 && ball.y >= gk.y - 12 && ball.y <= gk.y + gk.h) {
          ball.flying = false;
          ball.x = 50; ball.y = 155;
          playSynth(180, "sawtooth", 0.2, 0.25);
          if (window.toast) window.toast("Parata da Glapflap!", "error", "🧤");
          checkEnd();
          updateRickUi();
        }
        // GOL!
        else if (ball.x > 300 && ball.y >= 30 && ball.y <= 165) {
          ball.flying = false;
          ball.x = 50; ball.y = 155;
          goals++;
          playSynth(880, "sine", 0.3, 0.3);
          if (window.toast) window.toast("⚽ GOOOL QUANTICO DEI CROMULON!", "success", "🌟");
          checkEnd();
          updateRickUi();
        }
        // Fuori campo
        else if (ball.x > 325 || ball.y > 205 || ball.y < -15) {
          ball.flying = false;
          ball.x = 50; ball.y = 155;
          checkEnd();
          updateRickUi();
        }
      }

      // Render
      ctx.fillStyle = "#120024";
      ctx.fillRect(0, 0, 320, 200);

      // Stelle
      stars.forEach(s => { ctx.fillStyle = s.c; ctx.fillRect(s.x, s.y, 1.5, 1.5); });

      // Testa Cromulon nel cielo
      ctx.fillStyle = "#ffb74d";
      ctx.beginPath();
      ctx.ellipse(160, 35, 28, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.fillRect(151, 28, 5, 5); ctx.fillRect(165, 28, 5, 5);
      ctx.fillRect(153, 44, 14, 4);

      // Porta aliena a destra
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 3;
      ctx.strokeRect(290, 30, 25, 140);

      // Portiere Glapflap
      ctx.fillStyle = "#e91e63";
      ctx.fillRect(282, gk.y, 10, gk.h);
      ctx.fillStyle = "#fff";
      ctx.fillRect(280, gk.y + 4, 3, 3);
      ctx.fillRect(280, gk.y + 14, 3, 3);

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

      // Giocatore Leo
      ctx.fillStyle = "#3fa7ff";
      ctx.fillRect(36, 142, 14, 24);
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(40, 134, 8, 8);

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
      if (sc) sc.innerHTML = `Gol: <b>${goals} / 2</b>`;
      if (sh) sh.innerHTML = `Tiri rimasti: <b>${shotsLeft}</b>`;

      activeAnimId = requestAnimationFrame(rickLoop);
    }

    function checkEnd() {
      if (goals >= 2) {
        clearLoops();
        const prog = getProgress();
        if (!prog.portals.includes("rick")) prog.portals.push("rick");
        prog.rickScore = Math.max(prog.rickScore, goals);
        saveProgress(prog);
        if (window.addCoins) window.addCoins(25);
        if (window.triggerAnimeCutin) {
          window.triggerAnimeCutin({ who: "Leo & Nonna", shotName: "GOL QUANTICO CROMULON!", sfxWord: "I LIKE WHAT YOU GOT!" });
        }
        showText(
          "Cromulon Gigante",
          `«<b>MI PIACE QUELLO CHE AVETE FATTO! BUON LAVORO!</b><br>
          La Terra è salva per un'altra settimana! Vi concedo 25 monete d'oro cosmiche e l'approvazione del Consiglio Galattico!»`
        );
        showButtons([
          { label: "Esplora un'altra dimensione ▸", cls: "hot", fn: showHub },
          { label: "Torna al Menu Principale 🏠", fn: () => { closeMultiStage(); if (onExitCallback) onExitCallback(); } }
        ], true);
      } else if (shotsLeft <= 0) {
        clearLoops();
        showText(
          "Cromulon",
          `«<b>NON ABBASTANZA TALENTO!</b><br>
          Avete segnato ${goals} gol su 2 richiesti! Glapflap ha parato le vostre speranze. Ricaricate i portali e riprovateci!»`
        );
        showButtons([
          { label: "Riprova la Sfida dei Cromulon ▸", cls: "hot", fn: startRickDimension },
          { label: "◂ Torna al Cruscotto della Panda", fn: showHub }
        ], true);
      }
    }

    activeAnimId = requestAnimationFrame(rickLoop);
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
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(0,53,102,0.85); border:1px solid #00b4d8; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#00b4d8; font-weight:bold;">🤖 BENDER DEFLECTOR 3000</span>
        <span id="futTimerEl" style="color:var(--gold);">Timer Focaccia: <b>35s</b></span>
        <span id="futScoreEl" style="color:#90e0ef;">Gol: <b>0 / 2</b></span>
      </div>
    `;

    const canvas = document.getElementById("futCanvas");
    const ctx = canvas.getContext("2d");

    let goals = 0;
    let timerSec = 35;
    let benderY = 90;
    let benderVy = 2.0;
    let shieldOn = true;
    let shieldTimer = 0;
    let ball = { x: 60, y: 150, vx: 0, vy: 0, flying: false };

    activeIntervalId = setInterval(() => {
      timerSec--;
      const el = document.getElementById("futTimerEl");
      if (el) el.innerHTML = `Timer Focaccia: <b>${timerSec}s</b>`;
      if (timerSec <= 0) {
        checkFutEnd();
      }
    }, 1000);

    function feint() {
      shieldOn = false;
      shieldTimer = 150;
      playSynth(700, "square", 0.12, 0.2);
      if (window.toast) window.toast("⚡ SCUDO DI BENDER SOVRACCARICATO PER 3 SECONDI!", "info", "🔧");
      updateBenderUi();
    }

    function shoot() {
      if (ball.flying) return;
      ball.flying = true;
      ball.vx = 8.5;
      ball.vy = -1.6;
      playSynth(600, "sawtooth", 0.15, 0.25);
      if (window.haptic) window.haptic(20);
      updateBenderUi();
    }

    function updateBenderUi() {
      showText(
        "Bender Bending Rodríguez",
        `«Mettetevi comodi e ammirate il mio lucido telaio d'acciaio! Con il mio scudo deflettore a birra e titanio non farete mai gol alla Planet Express! E se la focaccia si raffredda me la mangio io!»`
      );
      showButtons([
        {
          label: "🎭 1. Esegui la Finta Anti-EMP (Disattiva lo Scudo!)",
          sub: "Manda in tilt il generatore di Bender per qualche secondo",
          cls: shieldOn ? "hot" : "",
          fn: feint
        },
        {
          label: "⚡ 2. Scaglia il Tiro Magnetico in Porta!",
          sub: shieldOn ? "⚠️ Attenzione: lo scudo di Bender è ancora attivo!" : "🔥 ORA! Lo scudo è a terra!",
          cls: !shieldOn ? "hot" : "",
          disabled: ball.flying,
          fn: shoot
        },
        {
          label: "◂ Torna al Cruscotto della Panda",
          fn: () => { clearLoops(); showHub(); }
        }
      ]);
    }
    updateBenderUi();

    function futLoop() {
      benderY += benderVy;
      if (benderY < 40 || benderY > 140) benderVy = -benderVy;

      if (shieldTimer > 0) {
        shieldTimer--;
        if (shieldTimer === 0) {
          shieldOn = true;
          updateBenderUi();
        }
      }

      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Se scudo attivo
        if (shieldOn && ball.x >= 240 && ball.x <= 265 && ball.y >= benderY - 20 && ball.y <= benderY + 45) {
          ball.flying = false;
          ball.x = 60; ball.y = 150;
          playSynth(150, "sawtooth", 0.25, 0.3);
          if (window.toast) window.toast("Scudo Magnetico: TIRO RESPINTO!", "error", "🛡️");
          updateBenderUi();
        }
        // Se scudo a terra -> GOL!
        else if (!shieldOn && ball.x >= 285 && ball.y >= 30 && ball.y <= 165) {
          ball.flying = false;
          ball.x = 60; ball.y = 150;
          goals++;
          shieldOn = true;
          playSynth(880, "sine", 0.35, 0.3);
          if (window.toast) window.toast("⚽ GOL ALLA PLANET EXPRESS!", "success", "🌟");
          const sc = document.getElementById("futScoreEl");
          if (sc) sc.innerHTML = `Gol: <b>${goals} / 2</b>`;
          checkFutEnd();
          updateBenderUi();
        }
        else if (ball.x > 320 || ball.y < 0 || ball.y > 200) {
          ball.flying = false;
          ball.x = 60; ball.y = 150;
          updateBenderUi();
        }
      }

      // Render
      ctx.fillStyle = "#031926";
      ctx.fillRect(0, 0, 320, 200);

      ctx.strokeStyle = "rgba(0, 180, 216, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 175); ctx.lineTo(320, 175);
      ctx.stroke();

      // Bender
      ctx.fillStyle = "#9e9e9e";
      ctx.fillRect(270, benderY, 18, 36);
      ctx.fillStyle = "#fff";
      ctx.fillRect(268, benderY + 6, 8, 6);
      ctx.fillStyle = "#000";
      ctx.fillRect(270, benderY + 8, 2, 2);
      ctx.strokeStyle = "#9e9e9e";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(279, benderY); ctx.lineTo(279, benderY - 8); ctx.stroke();

      // Scudo energetico
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

      activeAnimId = requestAnimationFrame(futLoop);
    }

    function checkFutEnd() {
      if (goals >= 2) {
        clearLoops();
        const prog = getProgress();
        if (!prog.portals.includes("bender")) prog.portals.push("bender");
        prog.benderScore = Math.max(prog.benderScore, goals);
        saveProgress(prog);
        if (window.addCoins) window.addCoins(25);
        showText(
          "Bender",
          `«Maledizione! Mi avete bruciato i diodi con quella finta! Va bene, prendetevi la mancia da 25 monete e portate la teglia calda al Professore prima che mi metta a piangere grasso sintetico!»`
        );
        showButtons([
          { label: "Esplora un'altra dimensione ▸", cls: "hot", fn: showHub },
          { label: "Torna al Menu Principale 🏠", fn: () => { closeMultiStage(); if (onExitCallback) onExitCallback(); } }
        ], true);
      } else if (timerSec <= 0) {
        clearLoops();
        showText(
          "Nonna Ferri",
          `«La focaccia si è raffreddata e Bender se l'è mangiata tutta con una birra da due litri! Ricarichiamo la Panda e riproviamo la consegna!»`
        );
        showButtons([
          { label: "Riprova la Sfida di Bender ▸", cls: "hot", fn: startBenderDimension },
          { label: "◂ Torna al Cruscotto della Panda", fn: showHub }
        ], true);
      }
    }

    activeAnimId = requestAnimationFrame(futLoop);
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
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(11,19,43,0.9); border:1px solid #48cae4; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#48cae4; font-weight:bold;">⚔️ LA BARRIERA DI PESTO</span>
        <span id="gotWindEl" style="color:var(--gold);">Vento del Nord: <b>◄ Medio</b></span>
        <span id="gotGkHp" style="color:#ff4d5a;">Ghiaccio: <b>100%</b></span>
      </div>
    `;

    const canvas = document.getElementById("gotCanvas");
    const ctx = canvas.getContext("2d");

    let gkHp = 100;
    let aimX = 280;
    let wind = -1.2;
    let ball = { x: 50, y: 160, vx: 0, vy: 0, flying: false, onFire: false };
    let snow = [];

    for (let i = 0; i < 40; i++) {
      snow.push({ x: Math.random() * 320, y: Math.random() * 200, sp: Math.random() * 1.5 + 0.8 });
    }

    function fireDracarys(aimPreset) {
      if (ball.flying) return;
      aimX = aimPreset;
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
      updateGotUi();
    }

    function updateGotUi() {
      showText(
        "Re della Notte",
        `«<i>L'Inverno è arrivato sui moli di Borgo Marino.</i> La Barriera di Pesto è congelata per l'eternità. Se la vostra fiamma non è pura, diventerete spettri della banchina per mille inverni!»`
      );
      showButtons([
        {
          label: "🔥 1. Dracarys Shot: All'Incrocio dei Pali!",
          sub: "Fiammata pura per sciogliere la cresta della barriera",
          cls: "hot",
          disabled: ball.flying,
          fn: () => fireDracarys(250)
        },
        {
          label: "🔥 2. Dracarys Shot: Dritto al Cuore del Ghiaccio!",
          sub: "Bordata centrale rovente contro il Re della Notte",
          cls: "hot",
          disabled: ball.flying,
          fn: () => fireDracarys(285)
        },
        {
          label: "🔥 3. Dracarys Shot: Basso controvento!",
          sub: "Compensa la bufera con una traiettoria radente",
          disabled: ball.flying,
          fn: () => fireDracarys(305)
        },
        {
          label: "◂ Torna al Cruscotto della Panda",
          fn: () => { clearLoops(); showHub(); }
        }
      ]);
    }
    updateGotUi();

    function gotLoop() {
      snow.forEach(s => {
        s.y += s.sp;
        s.x += wind * 0.4;
        if (s.y > 200) { s.y = 0; s.x = Math.random() * 320; }
      });

      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy + wind;

        if (ball.x >= 280) {
          ball.flying = false;
          ball.x = 50; ball.y = 160;
          gkHp = Math.max(0, gkHp - 50);
          playSynth(220, "sawtooth", 0.35, 0.35);
          if (window.toast) window.toast("BOOM! Il Fuoco Valyriano scioglie il ghiaccio!", "success", "🔥");
          const el = document.getElementById("gotGkHp");
          if (el) el.innerHTML = `Ghiaccio: <b>${gkHp}%</b>`;
          checkGotEnd();
          updateGotUi();
        }
      }

      ctx.fillStyle = "#0b132b";
      ctx.fillRect(0, 0, 320, 200);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      snow.forEach(s => ctx.fillRect(s.x, s.y, 2, 2));

      // Barriera di Ghiaccio
      ctx.fillStyle = "#48cae4";
      ctx.fillRect(285, 20, 35, 160);
      ctx.fillStyle = "#ade8f4";
      ctx.fillRect(288, 25, 29, 150);

      // Re della Notte
      ctx.fillStyle = "#023e8a";
      ctx.fillRect(275, 75, 14, 30);
      ctx.fillStyle = "#00f5d4";
      ctx.fillRect(274, 80, 3, 3);
      ctx.fillRect(274, 86, 3, 3);

      // Leo in armatura
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(44, 144, 14, 26);
      ctx.fillStyle = "#d00000";
      ctx.fillRect(38, 148, 6, 18);

      // Palla infuocata
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = ball.onFire ? "#ff5400" : "#fff";
      ctx.fill();

      activeAnimId = requestAnimationFrame(gotLoop);
    }

    function checkGotEnd() {
      if (gkHp <= 0) {
        clearLoops();
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

    activeAnimId = requestAnimationFrame(gotLoop);
  }

  window.openMultiverseMenu = openMultiverseMenu;
})();
