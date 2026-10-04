// ================= v20 · BLUE LOCK: L'ALCHIMIA DELL'EGO =================
// Modalità Torneo Sopravvivenza nella Gabbia dei Predatori di Punta Nera.
// Grafica visuale su Stage (Asset arena della Gabbia, mirino di tiro, aura fiamme nere e boss animati).
(function () {
  const K_BL = "ali-di-rondine.bluelock-record";

  function getBLRecord() {
    try {
      return JSON.parse(localStorage.getItem(K_BL)) || { won: 0, highStage: 0, bestEgo: 50 };
    } catch {
      return { won: 0, highStage: 0, bestEgo: 50 };
    }
  }

  function saveBLRecord(rec) {
    try {
      localStorage.setItem(K_BL, JSON.stringify(rec));
    } catch {}
  }

  const BOSSES = [
    {
      id: "toro",
      name: "Toro Galli",
      title: "Il Demolitore del Nord",
      quote: "«Il campo è un'arena, Moretti. Chi esita finisce schiacciato contro le reti metalliche!»",
      color: "#ff4d5a",
      gkName: "Mura d'Acciaio",
      gkSpeed: 2.2,
      special: "CARICA DEL TORO DISTRUTTIVA",
      gkZone: "basso"
    },
    {
      id: "kenji",
      name: "Kenji Arata",
      title: "L'Imperatore Aereo",
      quote: "«Dall'alto vedo tutte le tue scelte prima che tu muova il piede. Non puoi nasconderti.»",
      color: "#00e5ff",
      gkName: "Wagner il Falco",
      gkSpeed: 2.8,
      special: "VOLO DELL'AQUILA REALE",
      gkZone: "alto"
    },
    {
      id: "sho",
      name: "Sho Arata",
      title: "Il Cecchino Invisibile",
      quote: "«Non guardare me. Guarda la palla che sta già gonfiando l'incrocio dei pali.»",
      color: "#b9a6ff",
      gkName: "Ishikawa Riflesso",
      gkSpeed: 3.4,
      special: "LAMPO FANTASMA",
      gkZone: "destra"
    },
    {
      id: "bruno",
      name: "Bruno Sabatini",
      title: "Il Corvo d'Acciaio",
      quote: "«I sentimenti fanno perdere le finali. Il cinismo vince i campionati.»",
      color: "#ffd23f",
      gkName: "Orsini la Roccia",
      gkSpeed: 3.8,
      special: "BECCO DEL CORVO FEROCE",
      gkZone: "sinistra"
    },
    {
      id: "alter",
      name: "L'Ombra di Leo (Alter Ego)",
      title: "La Rondine Oscura",
      quote: "«Sei davvero disposto a divorare tutto pur di diventare il numero uno al mondo?»",
      color: "#00f0ff",
      gkName: "Riflesso Oscuro",
      gkSpeed: 4.4,
      special: "EGO VOLANTE SUPREMO",
      gkZone: "centro"
    }
  ];

  let currentStage = 0;
  let egoMeter = 50; // 0..100
  let matchGuts = 100;
  let myScore = 0;
  let oppScore = 0;
  let matchTurn = 0;
  let onExitCallback = null;
  let animId = null;
  let targetAim = { x: 50, y: 50 }; // % in porta
  let isShooting = false;
  let ballAnim = null;

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
      el.innerHTML = `<span class="who" style="background:#00e5ff; color:#0e1424; font-weight:800;">${who}</span><span class="t">${html}</span>`;
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
        if (o.fn) o.fn();
      };
      c.appendChild(b);
    });
  }

  function openBlueLockMode(onBack) {
    onExitCallback = onBack;
    currentStage = 0;
    egoMeter = 50;
    showHub();
  }

  function closeArenaStage() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
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
    const egoBox = document.getElementById("egoHudPanel");
    if (egoBox) egoBox.remove();
  }

  function showHub() {
    closeArenaStage();
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "bluelock" });
    }
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = true;
    setChap("Blue Lock · La Gabbia dell'Ego");
    const rec = getBLRecord();
    const boss = BOSSES[currentStage];

    // Render hub visual banner in stageAlt
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
      alt.innerHTML = `
        <img src="img/blue_lock_cage.jpg" alt="La Gabbia" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.15) brightness(0.9);">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(6,11,24,0.3) 0%, rgba(6,11,24,0.85) 90%);"></div>
        <div style="position:relative; z-index:2; padding:12px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <div style="font-family:var(--display); font-size:16px; color:#00e5ff; text-shadow:0 0 10px rgba(0,229,255,0.8);">LA GABBIA DI PUNTA NERA</div>
            <div style="font-size:12px; color:#ced9eb;">Torneo Sopravvivenza Predatori · Sfida ${currentStage + 1}/5</div>
          </div>
          <div style="background:rgba(0,229,255,0.15); border:1px solid #00e5ff; border-radius:6px; padding:4px 8px; font-size:11px; color:#fff; text-align:right;">
            Avversario: <b style="color:${boss.color};">${boss.name}</b>
          </div>
        </div>
      `;
    }

    showText(
      "voce",
      `<b>BENVENUTO NELLA GABBIA DEI PREDATORI</b><br>
      Un'arena d'asfalto e catene d'acciaio scavata nella roccia della scogliera. Qui non conta il possesso palla o l'accademia: conta chi ha la fame di divorare la porta avversaria.<br>
      <i>Trofeo: ${rec.won > 0 ? "Vinto " + rec.won + " volte 🏆" : "Non ancora conquistato"} · Massimo raggiunto: Round ${rec.highStage + 1}/5</i>`
    );

    showButtons([
      {
        label: `⚽ Sfida ${boss.name} nella Gabbia`,
        sub: `Portiere ${boss.gkName} · Sfida a bersagli & riflessi`,
        cls: "hot",
        fn: () => startStageMatch()
      },
      {
        label: "📜 Filosofia: Ego vs Altruismo",
        sub: "Come scatenare il Tiro delle Fiamme Nere",
        fn: () => showPhilosophy()
      },
      {
        label: "◂ Torna al Menu",
        fn: () => {
          closeArenaStage();
          if (onExitCallback) onExitCallback();
        }
      }
    ], true);
  }

  function showPhilosophy() {
    showText(
      "Sara",
      `«Leo, ogni tuo tiro nella Gabbia influenza la tua <b>Aura</b>:<br>
      - <b>Tiro Egoista (Fiamme Nere)</b>: Mirando agli angoli impossibili e sfidando il portiere da solo aumenti l'<b>EGO</b>. Sopra il 75%, Leo rilascia l'aura ciano/oscura e il tiro travolge qualsiasi barriera!<br>
      - <b>Azione d'Intesa</b>: Appoggiando ai compagni ricarichi la <b>Grinta</b> per non esaurire il fiato negli ultimi round.<br>
      Trova il tuo istinto e abbatti tutti i 5 predatori!»`
    );

    showButtons([
      {
        label: "Ho capito, andiamo in campo!",
        cls: "hot",
        fn: () => showHub()
      }
    ], true);
  }

  function startStageMatch() {
    myScore = 0;
    oppScore = 0;
    matchTurn = 1;
    matchGuts = 100;
    isShooting = false;
    ballAnim = null;
    const boss = BOSSES[currentStage];
    setChap(`Gabbia · ${boss.name}`);
    renderArenaVisual();
  }

  function renderArenaVisual() {
    const alt = getStageAlt();
    if (!alt) return;
    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.style.overflow = "hidden";

    const boss = BOSSES[currentStage];
    const egoPercent = Math.min(100, Math.max(0, egoMeter));
    const isEgoActive = egoPercent >= 75;

    alt.innerHTML = `
      <div id="arenaBgWrap" style="position:absolute; inset:0; pointer-events:none;">
        <img src="img/blue_lock_cage.jpg" style="width:100%; height:100%; object-fit:cover; filter:contrast(1.2) brightness(0.85);">
        <div style="position:absolute; inset:0; background:radial-gradient(circle at center, transparent 40%, rgba(6,11,24,0.7) 90%);"></div>
        ${isEgoActive ? '<div style="position:absolute; inset:0; box-shadow:inset 0 0 40px #00e5ff; mix-blend-mode:screen; animation:pulseEgo 1.5s infinite alternate;"></div>' : ''}
      </div>

      <!-- Top Cage HUD -->
      <div style="position:absolute; top:6px; left:8px; right:8px; z-index:10; display:flex; justify-content:space-between; align-items:center; background:rgba(10,16,32,0.85); border:1px solid rgba(0,229,255,0.4); border-radius:8px; padding:4px 10px; font-size:11px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="color:#00e5ff; font-weight:bold;">VS ${boss.name.toUpperCase()}</span>
          <span style="color:var(--dim);">Turno ${matchTurn}/6</span>
        </div>
        <div style="font-size:14px; font-weight:bold; color:var(--gold); font-family:var(--display);">
          LEO ${myScore} – ${oppScore} ${boss.name.split(" ")[0].toUpperCase()}
        </div>
        <div style="color:${isEgoActive ? '#00e5ff' : '#ffd23f'}; font-weight:bold;">
          ${isEgoActive ? '🔥 EGO MASSIMO' : '⚡ GRINTA ' + Math.round(matchGuts)}
        </div>
      </div>

      <!-- Interactive Goal Stage with Keeper and Target Crosshair -->
      <div id="cagePitchView" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding-top:24px;">
        <canvas id="cageCv" width="320" height="200" style="width:100%; height:100%; cursor:crosshair;"></canvas>
      </div>

      <!-- Ego Flame Meter Overlay -->
      <div style="position:absolute; bottom:6px; left:12px; right:12px; z-index:10; background:rgba(6,11,24,0.8); border:1px solid #1a2744; border-radius:6px; padding:4px 8px; display:flex; align-items:center; gap:8px;">
        <span style="font-size:10px; color:#81d4fa; font-weight:bold;">INTESA</span>
        <div style="flex:1; height:8px; background:#0e1424; border-radius:4px; overflow:hidden; position:relative; border:1px solid rgba(0,229,255,0.3);">
          <div style="height:100%; width:${egoPercent}%; background:linear-gradient(90deg, #ffd23f 0%, #00e5ff 70%, #ff4d5a 100%); transition:width 0.3s ease;"></div>
        </div>
        <span style="font-size:10px; color:#ff4d5a; font-weight:bold;">EGO</span>
      </div>
    `;

    setupCageCanvas();
    startTurnPrompt();
  }

  let keeperX = 160;
  let keeperDir = 1;

  function setupCageCanvas() {
    const cv = document.getElementById("cageCv");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const boss = BOSSES[currentStage];

    // Click to aim on cage
    cv.onclick = (e) => {
      if (isShooting) return;
      const rect = cv.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 320;
      const clickY = ((e.clientY - rect.top) / rect.height) * 200;
      // Target area inside goal (x: 60..260, y: 50..150)
      targetAim.x = Math.max(70, Math.min(250, clickX));
      targetAim.y = Math.max(55, Math.min(145, clickY));
    };

    function loop() {
      if (!document.getElementById("cageCv")) return;
      ctx.clearRect(0, 0, 320, 200);

      // 1. Draw goal perspective
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 50, 200, 100);

      // Goal nets pattern
      ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
      ctx.lineWidth = 1;
      for (let x = 60; x <= 260; x += 15) {
        ctx.beginPath(); ctx.moveTo(x, 50); ctx.lineTo(x, 150); ctx.stroke();
      }
      for (let y = 50; y <= 150; y += 15) {
        ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(260, y); ctx.stroke();
      }

      // 2. Animate Keeper
      if (!isShooting) {
        keeperX += boss.gkSpeed * keeperDir;
        if (keeperX > 225) keeperDir = -1;
        if (keeperX < 95) keeperDir = 1;
      }

      // Draw Keeper sprite
      ctx.fillStyle = boss.color;
      ctx.beginPath();
      ctx.arc(keeperX, 105, 14, 0, Math.PI * 2);
      ctx.fill();
      // Keeper body
      ctx.fillRect(keeperX - 12, 118, 24, 28);
      // Keeper eyes
      ctx.fillStyle = "#fff";
      ctx.fillRect(keeperX - 6, 100, 4, 4);
      ctx.fillRect(keeperX + 2, 100, 4, 4);
      // Keeper label
      ctx.font = "bold 8px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(boss.gkName, keeperX, 90);

      // 3. Draw Target Crosshair
      ctx.strokeStyle = egoMeter >= 75 ? "#00e5ff" : "#ffd23f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetAim.x, targetAim.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(targetAim.x - 14, targetAim.y);
      ctx.lineTo(targetAim.x + 14, targetAim.y);
      ctx.moveTo(targetAim.x, targetAim.y - 14);
      ctx.lineTo(targetAim.x, targetAim.y + 14);
      ctx.stroke();

      // 4. Ball animation if shooting
      if (ballAnim) {
        ctx.fillStyle = ballAnim.flame ? "#00e5ff" : "#fff";
        ctx.beginPath();
        ctx.arc(ballAnim.x, ballAnim.y, ballAnim.r, 0, Math.PI * 2);
        ctx.fill();
        if (ballAnim.flame) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ballAnim.x, ballAnim.y, ballAnim.r + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(loop);
    }

    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(loop);
  }

  function startTurnPrompt() {
    const boss = BOSSES[currentStage];
    const isEgoActive = egoMeter >= 75;

    showText(
      "Leo",
      `<b>TURNO ${matchTurn}/6</b> · Tocca la porta sullo schermo per mirare, poi scegli l'azione:<br>
      ${isEgoActive ? '<span style="color:#00e5ff; font-weight:bold;">⚡ L\'EGO È AL MASSIMO: Tiro delle Fiamme Nere sbloccato!</span>' : 'Decidi se rischiare da solo o giocare di sponda coi compagni.'}`
    );

    const btns = [
      {
        label: isEgoActive ? "🔥 SCATENA IL TIRO DELLE FIAMME NERE!" : "⚡ Conclusione Personale Aggressiva",
        sub: isEgoActive ? "Trafigge qualunque guardia (+Ego)" : "Mira all'angolino selezionato (+15 Ego)",
        cls: "hot",
        fn: () => executeShot(isEgoActive ? "ego_special" : "solo")
      },
      {
        label: "🤝 Triangolazione & Spallata d'Intesa",
        sub: "Sponda con Tommy: spiazza il portiere (+Grinta, -Ego)",
        fn: () => executeShot("team")
      },
      {
        label: "🎯 Cambia bersaglio: Incrocio Alto",
        sub: "Mira all'angolo superiore sinistro",
        fn: () => {
          targetAim = { x: 80, y: 65 };
          startTurnPrompt();
        }
      },
      {
        label: "🎯 Cambia bersaglio: Rasoterra a Fil di Palo",
        sub: "Mira all'angolino basso destro",
        fn: () => {
          targetAim = { x: 240, y: 135 };
          startTurnPrompt();
        }
      }
    ];

    showButtons(btns);
  }

  function executeShot(type) {
    if (isShooting) return;
    isShooting = true;

    // Trigger Anime Cut-in if special or high ego
    if (type === "ego_special" && window.triggerAnimeCutin) {
      window.triggerAnimeCutin({
        who: "Leo Moretti",
        shotName: "TIRO DELL'EGO · FIAMME NERE",
        isEgo: true,
        sfxWord: "DOOOM!"
      });
    }

    // Ball flight animation
    ballAnim = {
      x: 160,
      y: 190,
      r: 12,
      flame: type === "ego_special"
    };

    const targetX = targetAim.x;
    const targetY = targetAim.y;
    const boss = BOSSES[currentStage];

    let step = 0;
    const totalSteps = 24;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      ballAnim.x = 160 + (targetX - 160) * progress;
      ballAnim.y = 190 + (targetY - 190) * progress;
      ballAnim.r = Math.max(6, 12 - 6 * progress);

      if (step >= totalSteps) {
        clearInterval(timer);
        resolveShotOutcome(type);
      }
    }, 20);
  }

  function resolveShotOutcome(type) {
    const boss = BOSSES[currentStage];
    const distToKeeper = Math.abs(targetAim.x - keeperX);
    let goal = false;

    if (type === "ego_special") {
      goal = true; // Special is unstoppable
      egoMeter = Math.max(40, egoMeter - 20); // Consumes some ego
    } else if (type === "team") {
      // Team pass displaces keeper
      goal = Math.random() > 0.3;
      egoMeter = Math.max(0, egoMeter - 15);
      matchGuts = Math.min(100, matchGuts + 20);
    } else {
      // Solo: success if far enough from keeper
      goal = distToKeeper > 35;
      egoMeter = Math.min(100, egoMeter + 20);
      matchGuts = Math.max(0, matchGuts - 15);
    }

    if (goal) {
      myScore++;
      if (window.toast) window.toast("⚽ GOOOL NELLA GABBIA!", "goal", "🔥");
      showText("arbitro", `<b style="color:#00e5ff; font-size:16px;">GOOOL!</b> La palla scuote la rete metallica! Leo esulta nella gabbia!`);
    } else {
      if (window.toast) window.toast("PARATA! Il portiere respinge!", "warn", "🧤");
      showText("arbitro", `<b>PARATO!</b> ${boss.gkName} si allunga con un balzo felino e toglie il pallone dal sacco!`);
    }

    // Opponent counter-attack turn
    setTimeout(() => {
      resolveCounterAttack();
    }, 1800);
  }

  function resolveCounterAttack() {
    const boss = BOSSES[currentStage];
    matchTurn++;

    // Boss attack chance
    const bossScores = Math.random() < 0.45;
    if (bossScores) {
      oppScore++;
      if (window.toast) window.toast(`GOL DI ${boss.name.toUpperCase()}!`, "warn", "⚡");
      showText(
        boss.name,
        `«${boss.special}!»<br>${boss.name} schianta un siluro contro la traversa che rimbalza oltre la linea! Nico non ci arriva!`
      );
    } else {
      showText(
        "Nico",
        `«Col cavolo che passa! Questa gabbia è mia!»<br>Nico devia a pugni chiusi l'attacco di ${boss.name}!`
      );
    }

    setTimeout(() => {
      isShooting = false;
      ballAnim = null;
      renderArenaVisual();

      if (matchTurn > 6) {
        endStageMatch();
      } else {
        startTurnPrompt();
      }
    }, 1800);
  }

  function endStageMatch() {
    const boss = BOSSES[currentStage];
    const rec = getBLRecord();

    if (myScore > oppScore) {
      rec.highStage = Math.max(rec.highStage, currentStage + 1);
      saveBLRecord(rec);

      if (currentStage >= BOSSES.length - 1) {
        // Tournament victory
        rec.won++;
        saveBLRecord(rec);
        showText(
          "voce",
          `<b style="color:var(--gold); font-size:18px;">👑 RE DELLA GABBIA DEI PREDATORI!</b><br>
          Hai battuto anche il tuo Alter Ego oscuro! Hai dominato la gabbia di Punta Nera. L'Ego e il Cuore di Borgo Marino ti appartengono!`
        );
        showButtons([
          {
            label: "Trionfo & Ritorna al Menu",
            cls: "hot",
            fn: () => {
              closeArenaStage();
              if (onExitCallback) onExitCallback();
            }
          }
        ], true);
      } else {
        showText(
          boss.name,
          `«Sei forte, Moretti... La gabbia ha scelto il suo predatore. Ma la prossima sfida ti distruggerà.»<br>
          <b>VITTORIA ${myScore} – ${oppScore}! Avanzi al Round ${currentStage + 2}!</b>`
        );
        showButtons([
          {
            label: `Avanza al Round ${currentStage + 2} ▸`,
            cls: "hot",
            fn: () => {
              currentStage++;
              startStageMatch();
            }
          }
        ], true);
      }
    } else {
      showText(
        boss.name,
        `«Questa gabbia non perdona chi esita. Torna ad allenarti coi gabbiani, Moretti!»<br>
        <b>SCONFITTA ${myScore} – ${oppScore}. Fine della corsa.</b>`
      );
      showButtons([
        {
          label: "Riprova la Sfida 🔄",
          cls: "hot",
          fn: () => startStageMatch()
        },
        {
          label: "Torna al Menu",
          fn: () => {
            closeArenaStage();
            if (onExitCallback) onExitCallback();
          }
        }
      ], true);
    }
  }

  window.openBlueLockMode = openBlueLockMode;
})();
