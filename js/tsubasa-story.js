// ================= SAGA 1: CAPITAN TSUBASA · IL TIRO COMBINATO DELLA SCOGLIERA =================
// Tributo a Holly e Benji, Mark Lenders, Ed Warner e Roberto Sedinho.
// Con vero gameplay shonen:
// 1. Minigioco Dual-Timing Twin Shot con sweet spot balistico e cerchio di convergenza
// 2. Traiettoria a doppia elica e rete che si allunga a cono
// 3. Parata Acrobatica dal palo (Ken Wakashimazu style) nelle fasi difensive
// 4. Campagna longeva in 4 tappe con potenziamenti intesa e trofeo leggendario
(function () {
  const K_TSU = "ali-di-rondine.tsubasa-progress";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_TSU));
      if (d && typeof d === "object") {
        return {
          stage: d.stage || 0, // 0..3
          cleared: Array.isArray(d.cleared) ? d.cleared : [],
          syncLevel: d.syncLevel || 1, // 1..5
          guts: d.guts || 100,
          bestTwinScore: d.bestTwinScore || 0
        };
      }
    } catch (e) {}
    return { stage: 0, cleared: [], syncLevel: 1, guts: 100, bestTwinScore: 0 };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_TSU, JSON.stringify(p));
    } catch (e) {}
  }

  const TEAMS = [
    {
      id: "muppet",
      name: "La Muppet della Riviera",
      captain: "Brando 'Il Tigre' De Marchi",
      gk: "Gino 'Il Muro' Baroni",
      desc: "Calcio violento e aggressivo. Attaccano come felini e spaccano le zolle.",
      color: "#d90429",
      targetGoals: 2,
      rivalShot: "Tiro della Tigre Selvaggia"
    },
    {
      id: "gemelli",
      name: "I Gemelli della Falesia",
      captain: "Dario & Mirko Trabucco",
      gk: "Sandro Reattivo",
      desc: "Calcio acrobatico aereo. Saltano sui pali e tirano al volo a catapulta.",
      color: "#7209b7",
      targetGoals: 2,
      rivalShot: "Catapulta Infernale del Golfo"
    },
    {
      id: "flynet",
      name: "La Flynet del Monte Turchino",
      captain: "Matteo Neve",
      gk: "Walter Ghiaccio",
      desc: "Lavoro di squadra perfetto nel fango e nella bufera. Resistenza infinita.",
      color: "#0077b6",
      targetGoals: 3,
      rivalShot: "Tiro a Valanga dei Caruggi"
    },
    {
      id: "sanfrancis",
      name: "Il San Francis del Molo Vecchio",
      captain: "Julian Riva",
      gk: "Beniamino 'Benji' Costantini",
      desc: "La leggenda della scogliera. Il portiere Benji non subisce mai gol da fuori area.",
      color: "#ffb703",
      targetGoals: 3,
      rivalShot: "Tiro a Trivela del Principe"
    }
  ];

  let onExitCallback = null;
  let activeAnimId = null;

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
      el.innerHTML = `<span class="who" style="background:#ff0054; color:#fff; font-weight:800; text-transform:uppercase;">${who}</span><span class="t">${html}</span>`;
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
  }

  function activateTsubasaView() {
    clearLoops();
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "tsubasa" });
    }
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = true;
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = "block";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
    }
    return alt;
  }

  function closeTsubasaStage() {
    clearLoops();
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = true;
      alt.style.display = "none";
      alt.innerHTML = "";
    }
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = false;
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "scene", bg: "title" });
    }
  }

  // ================= 1. HUB DELLA SAGA TSUBASA =================
  function openTsubasaMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function showHub() {
    setChap("Tsubasa · Il Tiro Combinato della Scogliera");
    const prog = getProgress();
    const alt = activateTsubasaView();

    if (alt) {
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0429 0%, #3a0ca3 50%, #f72585 100%);"></div>
        <div style="position:absolute; inset:0; background:radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%);"></div>
        
        <!-- Anime Speedlines Overlay -->
        <svg style="position:absolute; inset:0; width:100%; height:100%; opacity:0.25; pointer-events:none;" viewBox="0 0 320 200">
          <line x1="0" y1="0" x2="320" y2="200" stroke="#fff" stroke-width="1.5" stroke-dasharray="10 20" />
          <line x1="320" y1="0" x2="0" y2="200" stroke="#fff" stroke-width="1.5" stroke-dasharray="15 25" />
          <line x1="160" y1="0" x2="160" y2="200" stroke="#ffd23f" stroke-width="2" stroke-dasharray="8 16" />
        </svg>

        <div style="position:relative; z-index:2; height:100%; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <div style="font-family:var(--display); font-size:16px; color:#ffd23f; text-shadow:2px 2px 0 #d90429, 0 0 12px rgba(255,210,63,0.8);">
                ⚡ IL TIRO COMBINATO
              </div>
              <div style="font-size:11px; color:#f3e5f5; font-weight:bold;">
                Saga Anime Shonen · Campionato della Scogliera
              </div>
            </div>
            <div style="background:rgba(0,0,0,0.5); border:1.5px solid #f72585; border-radius:6px; padding:4px 8px; font-size:11px; color:#fff; text-align:right;">
              <div>Vinte: <b>${prog.cleared.length}/4</b></div>
              <div style="color:#ffd23f; font-size:10px;">Sintonia Leo & Nico: <b>Liv.${prog.syncLevel}</b></div>
            </div>
          </div>

          <div style="background:rgba(10,5,30,0.75); border:1.5px solid rgba(255,255,255,0.3); border-radius:8px; padding:8px 10px; font-size:11px; color:#fff;">
            <div style="color:#4cc9f0; font-weight:bold; font-size:12px; margin-bottom:2px;">
              ⚽ Prossimo Avversario: ${TEAMS[prog.stage % 4].name}
            </div>
            <div style="color:#e0e0e0; font-size:10.5px;">
              Capitano rivale: <b>${TEAMS[prog.stage % 4].captain}</b> · ${TEAMS[prog.stage % 4].rivalShot}
            </div>
          </div>
        </div>
      `;
    }

    const curTeam = TEAMS[prog.stage % 4];

    showText(
      "Mister Sedinho (Ex Marinaio)",
      `«Leo, ascoltami bene! I campioni non si costruiscono con i passaggi di sicurezza. Brando "Il Tigre" spacca le reti dei porti da Ventimiglia a La Spezia con tiri feroci!<br>
      Per superare ${curTeam.name}, tu e Nico dovete colpire la palla all'unisono a mezz'aria. Se il vostro tempismo è millimetrico, scatenerete il <b>Twin Shot ad Elica</b> che perfora qualsiasi guanto!»`
    );

    const b = [
      {
        label: `⚽ Sfida ${curTeam.name} (${prog.stage + 1}/4)`,
        sub: `Capitano: ${curTeam.captain} · Segna ${curTeam.targetGoals} gol con il Twin Shot`,
        cls: "hot",
        fn: () => startTsubasaMatch(prog.stage % 4)
      },
      {
        label: "🔥 Allenamento di Sintonia (Leo & Nico)",
        sub: "Allena il Dual-Timing per allargare lo sweet spot del tiro",
        fn: startTrainingSession
      }
    ];

    if (prog.cleared.length > 0) {
      b.push({
        label: "🏆 Rivincita con le squadre già sconfitte",
        sub: "Rigioca le tappe precedenti e migliora il record",
        fn: showRematchMenu
      });
    }

    b.push({
      label: "◂ Torna al Menu Principale",
      cls: "pick",
      fn: () => {
        closeTsubasaStage();
        if (onExitCallback) onExitCallback();
      }
    });

    showButtons(b, true);
  }

  function showRematchMenu() {
    const prog = getProgress();
    const b = prog.cleared.map((teamId) => {
      const t = TEAMS.find(x => x.id === teamId) || TEAMS[0];
      return {
        label: `Rivincita contro ${t.name}`,
        sub: `Capitano: ${t.captain}`,
        fn: () => startTsubasaMatch(TEAMS.indexOf(t))
      };
    });
    b.push({ label: "◂ Torna al Centro Sportivo", fn: showHub });
    showButtons(b, true);
  }

  // ================= 2. ALLENAMENTO DI SINTONIA =================
  function startTrainingSession() {
    const prog = getProgress();
    setChap("Allenamento · Sincronizzazione Scarpini");
    const alt = activateTsubasaView();
    if (!alt) return;

    alt.innerHTML = `
      <canvas id="trainCanvas" width="320" height="200" style="display:block; width:100%; height:100%; background:#0d1b2a;"></canvas>
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.7); border:1px solid #4cc9f0; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#4cc9f0; font-weight:bold;">SINTONIA LEO & NICO</span>
        <span id="trainScoreEl" style="color:var(--gold);">Sintonia: <b>${prog.syncLevel}/5</b></span>
      </div>
    `;

    const canvas = document.getElementById("trainCanvas");
    const ctx = canvas.getContext("2d");

    let circleRadius = 70;
    let targetRadius = 25;
    let speed = 1.6 + prog.syncLevel * 0.3;
    let expanding = false;
    let hits = 0;

    function tapTiming() {
      const diff = Math.abs(circleRadius - targetRadius);
      if (diff <= 10) {
        // Perfetto!
        hits++;
        playSynth(880, "sine", 0.2, 0.3);
        if (window.toast) window.toast("✨ INTESA PERFETTA! (SWEET SPOT CENTRATO!)", "success", "⚡");
        if (hits >= 3 && prog.syncLevel < 5) {
          prog.syncLevel++;
          saveProgress(prog);
          if (window.toast) window.toast(`🎉 Sintonia aumentata al Livello ${prog.syncLevel}!`, "success", "🌟");
        }
      } else {
        playSynth(220, "sawtooth", 0.2, 0.25);
        if (window.toast) window.toast("Tempismo non sincronizzato! Riprova quando i cerchi coincidono!", "error", "⚠️");
      }
      circleRadius = 70;
      updateTrainUi();
    }

    function updateTrainUi() {
      showText(
        "Nico Ferri",
        `«Leo, guarda il cerchio dorato: si restringe verso il punto d'impatto! Premi <b>CALCIA ORA!</b> nel momento esatto in cui il cerchio esterno coincide con il cerchio centrale!»`
      );
      showButtons([
        {
          label: "⚡ CALCIA ORA! (SINCRONIZZA)",
          sub: "Colpisci nell'istante di sovrapposizione perfetta",
          cls: "hot",
          fn: tapTiming
        },
        {
          label: "✓ Concludi Allenamento e Torna al Menu",
          fn: () => { clearLoops(); showHub(); }
        }
      ]);
    }
    updateTrainUi();

    function trainLoop() {
      circleRadius -= speed;
      if (circleRadius <= 5) circleRadius = 75;

      ctx.fillStyle = "#0d1b2a";
      ctx.fillRect(0, 0, 320, 200);

      // Sfondo campo al tramonto
      ctx.fillStyle = "#1b4332";
      ctx.fillRect(0, 140, 320, 60);

      // Sagome Leo e Nico
      ctx.fillStyle = "#3fa7ff";
      ctx.fillRect(110, 120, 18, 40); // Leo
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(190, 120, 18, 40); // Nico

      // Pallone al centro
      ctx.beginPath();
      ctx.arc(160, 130, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.stroke();

      // Cerchio fisso Sweet Spot (Oro)
      ctx.beginPath();
      ctx.arc(160, 130, targetRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffd23f";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cerchio mobile sincronizzatore (Ciano / Rosa)
      ctx.beginPath();
      ctx.arc(160, 130, Math.max(5, circleRadius), 0, Math.PI * 2);
      ctx.strokeStyle = Math.abs(circleRadius - targetRadius) <= 10 ? "#00f5d4" : "#f72585";
      ctx.lineWidth = 3.5;
      ctx.stroke();

      activeAnimId = requestAnimationFrame(trainLoop);
    }
    activeAnimId = requestAnimationFrame(trainLoop);
  }

  // ================= 3. PARTITA SHONEN: IL TIRO COMBINATO =================
  function startTsubasaMatch(stageIdx) {
    const team = TEAMS[stageIdx];
    const prog = getProgress();
    setChap(`Tsubasa · VS ${team.name}`);
    const alt = activateTsubasaView();
    if (!alt) return;

    alt.innerHTML = `
      <canvas id="matchCv" width="320" height="200" style="display:block; width:100%; height:100%; background:#0b092b;"></canvas>
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.8); border:1px solid ${team.color}; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#ffd23f; font-weight:bold;">RONDINE FC vs ${team.name.toUpperCase()}</span>
        <span id="tsuScoreEl" style="color:#fff; font-weight:bold; font-size:13px;">0 – 0</span>
        <span id="tsuTurnsEl" style="color:#4cc9f0;">Turno: <b>1 / 5</b></span>
      </div>
    `;

    const canvas = document.getElementById("matchCv");
    const ctx = canvas.getContext("2d");

    let myGoals = 0;
    let rivalGoals = 0;
    let turn = 1;
    let phase = "attack"; // "attack" | "defense" | "cutin"
    let ball = { x: 80, y: 140, vx: 0, vy: 0, helix: 0, flying: false };
    let gk = { x: 285, y: 100, vy: 1.8, h: 36 };
    let circleR = 65;
    let targetR = 25;
    let sweetSpotWindow = 8 + prog.syncLevel * 2; // Più alto è il livello, più facile lo sweet spot

    function shootTwin(type) {
      if (ball.flying) return;
      phase = "attack_anim";
      ball.flying = true;
      ball.helix = 0;
      ball.vx = 7.5;
      ball.vy = type === "high" ? -2.2 : type === "low" ? -0.4 : -1.3;

      // Calcola precisione
      const diff = Math.abs(circleR - targetR);
      const isPerfect = diff <= sweetSpotWindow;

      playSynth(850, "triangle", 0.3, 0.3);
      if (window.haptic) window.haptic(isPerfect ? 40 : 15);

      if (isPerfect) {
        if (window.triggerAnimeCutin) {
          window.triggerAnimeCutin({
            who: "Leo & Nico",
            shotName: "DOPPIA ELICA DELLA SCOGLIERA!",
            isEgo: true,
            sfxWord: "TWIN SHOT!"
          });
        }
        if (window.toast) window.toast("🔥 TIRO A DOPPIA ELICA SCATENATO!", "success", "⚡");
      }

      setTimeout(() => {
        ball.flying = false;
        ball.x = 80; ball.y = 140;

        // Se perfetto, il portiere non può nulla!
        if (isPerfect || Math.random() < 0.65) {
          myGoals++;
          playSynth(950, "sine", 0.4, 0.35);
          if (window.toast) window.toast("⚽ GOOOL! LA RETE SI STRAPPA A CONO!", "success", "🌟");
        } else {
          playSynth(180, "sawtooth", 0.25, 0.3);
          if (window.toast) window.toast(`${team.gk} intercetta il tiro!`, "error", "🧤");
        }
        nextTurn();
      }, 1400);
    }

    function defendGoal(action) {
      phase = "defense_anim";
      playSynth(300, "sawtooth", 0.2, 0.25);
      setTimeout(() => {
        // Balzo dal palo parata acrobatica
        if (action === "pole_jump") {
          playSynth(880, "sine", 0.3, 0.3);
          if (window.toast) window.toast("🧤 PARATA ACROBATICA DAL PALO DI BORGO MARINO!", "success", "🛡️");
        } else {
          if (Math.random() < 0.5) {
            rivalGoals++;
            playSynth(150, "sawtooth", 0.3, 0.3);
            if (window.toast) window.toast(`Gol di ${team.captain}! (${team.rivalShot})`, "error", "💥");
          } else {
            playSynth(520, "sine", 0.25, 0.25);
            if (window.toast) window.toast("Tiro rivale sul palo!", "info", "⚽");
          }
        }
        nextTurn();
      }, 1000);
    }

    function nextTurn() {
      turn++;
      const sc = document.getElementById("tsuScoreEl");
      const tu = document.getElementById("tsuTurnsEl");
      if (sc) sc.innerHTML = `${myGoals} – ${rivalGoals}`;
      if (tu) tu.innerHTML = `Turno: <b>${Math.min(5, turn)} / 5</b>`;

      if (turn > 5) {
        endMatch();
        return;
      }

      // Alterna fase
      phase = phase.startsWith("attack") ? "defense" : "attack";
      circleR = 65;
      updateMatchUi();
    }

    function updateMatchUi() {
      if (phase === "attack") {
        showText(
          "Leo & Nico",
          `«Il cross spiove a mezza altezza! Scegli l'angolo del <b>Twin Shot</b>: guarda il cerchio ciano coincidere con l'oro per scatenare la Doppia Elica!»`
        );
        showButtons([
          {
            label: "⚡ Twin Shot all'Incrocio dei Pali",
            sub: "Traiettoria alta e potente contro l'angolo cieco",
            cls: "hot",
            fn: () => shootTwin("high")
          },
          {
            label: "⚡ Twin Shot Radente ad Effetto",
            sub: "Palla a fil di palo a rimbalzo ingannevole",
            cls: "hot",
            fn: () => shootTwin("low")
          },
          {
            label: "⚽ Bordata Centrale dell'Elica",
            sub: "Tiro a sfondare la difesa di pura potenza",
            fn: () => shootTwin("mid")
          },
          {
            label: "◂ Ritirati dalla Partita",
            fn: () => { clearLoops(); showHub(); }
          }
        ]);
      } else {
        showText(
          team.captain,
          `«Adesso tocca a me! Nessun portiere del golfo può fermare il mio <b>${team.rivalShot}</b>!»`
        );
        showButtons([
          {
            label: "🧤 Balzo Acrobatico dal Palo (Stile Ed Warner)",
            sub: "Spingi sul palo per intercettare il bolide aereo!",
            cls: "hot",
            fn: () => defendGoal("pole_jump")
          },
          {
            label: "🛡️ Tuffo d'Intuito a Mezz'Aria",
            sub: "Copri lo specchio col corpo",
            fn: () => defendGoal("dive")
          }
        ]);
      }
    }
    updateMatchUi();

    function matchLoop() {
      // Movimento cerchio sincronizzazione
      circleR -= 1.8;
      if (circleR <= 5) circleR = 65;

      // Movimento portiere avversario
      gk.y += gk.vy;
      if (gk.y < 35 || gk.y > 145) gk.vy = -gk.vy;

      // Movimento palla se in volo
      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.helix += 0.35;
      }

      ctx.fillStyle = "#090826";
      ctx.fillRect(0, 0, 320, 200);

      // Campo e linee prospettiche alla Capitan Tsubasa (curvatura della terra)
      ctx.fillStyle = "#1b4332";
      ctx.beginPath();
      ctx.ellipse(160, 230, 220, 100, 0, Math.PI, 0);
      ctx.fill();

      // Porta avversaria
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.strokeRect(280, 40, 35, 120);

      // Portiere avversario
      ctx.fillStyle = team.color;
      ctx.fillRect(278, gk.y, 10, gk.h);
      ctx.fillStyle = "#fff";
      ctx.fillRect(276, gk.y + 4, 4, 4);

      // Giocatori Leo & Nico pronti a tirare
      ctx.fillStyle = "#3fa7ff"; // Leo
      ctx.fillRect(65, 125, 14, 28);
      ctx.fillStyle = "#ffd23f"; // Nico
      ctx.fillRect(85, 125, 14, 28);

      // Cerchio Sweet Spot durante la fase di attacco
      if (phase === "attack") {
        ctx.beginPath();
        ctx.arc(75, 138, targetR, 0, Math.PI * 2);
        ctx.strokeStyle = "#ffd23f";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(75, 138, Math.max(5, circleR), 0, Math.PI * 2);
        ctx.strokeStyle = Math.abs(circleR - targetR) <= sweetSpotWindow ? "#00f5d4" : "#f72585";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Palla con scia a doppia elica se in volo
      if (ball.flying) {
        const hOffset = Math.sin(ball.helix) * 8;
        // Scia elica 1 (Ciano)
        ctx.fillStyle = "#00f5d4";
        ctx.beginPath();
        ctx.arc(ball.x - 10, ball.y + hOffset, 4, 0, Math.PI * 2);
        ctx.fill();

        // Scia elica 2 (Fucsia)
        ctx.fillStyle = "#f72585";
        ctx.beginPath();
        ctx.arc(ball.x - 10, ball.y - hOffset, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pallone
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.stroke();
      }

      activeAnimId = requestAnimationFrame(matchLoop);
    }

    function endMatch() {
      clearLoops();
      const won = myGoals > rivalGoals;
      const prog = getProgress();

      if (won) {
        if (!prog.cleared.includes(team.id)) prog.cleared.push(team.id);
        if (prog.stage === stageIdx) prog.stage++;
        prog.bestTwinScore = Math.max(prog.bestTwinScore, myGoals);
        saveProgress(prog);
        if (window.addCoins) window.addCoins(30);

        showText(
          "Mister Sedinho",
          `<b style="color:#ffd23f;">VITTORIA EPICA! ${myGoals} – ${rivalGoals}!</b><br>
          «Avete piegato ${team.name} con un Twin Shot che rimarrà nella storia della Riviera! Avete guadagnato 30 monete d'oro e il rispetto eterno di ${team.captain}!»`
        );

        showButtons([
          {
            label: prog.stage < 4 ? "Avanza alla Prossima Sfida ▸" : "🏆 Solleva il Trofeo della Scogliera!",
            cls: "hot",
            fn: showHub
          },
          {
            label: "Torna al Menu Principale 🏠",
            fn: () => { closeTsubasaStage(); if (onExitCallback) onExitCallback(); }
          }
        ], true);
      } else {
        showText(
          team.captain,
          `«È finita ${myGoals} – ${rivalGoals}! Avete cuore, ma per battere la mia squadra vi serve ancora più intesa! Tornate ad allenare il Twin Shot alla scogliera!»`
        );
        showButtons([
          {
            label: "Riprova la Partita ▸",
            cls: "hot",
            fn: () => startTsubasaMatch(stageIdx)
          },
          {
            label: "◂ Torna al Menu",
            fn: showHub
          }
        ], true);
      }
    }

    activeAnimId = requestAnimationFrame(matchLoop);
  }

  window.openTsubasaMenu = openTsubasaMenu;
})();
