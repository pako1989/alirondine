// ================= SAGA 3: FUTURAMA · LA LEGA GALATTICA DEL PIANETA EXPRESS =================
// Tributo ufficiale all'universo di Futurama, Bender, Fry, Leela e Professor Farnsworth.
// Con vero gameplay profondo:
// 1. Torneo planetario a gravità variabile: Bassa Gravità, Alta Densità, Gravità Invertita
// 2. Moduli cibernetici equipaggiabili: Braccio Idraulico Bender, Materia Oscura Nibbler, Visore Leela
// 3. Boss fight contro Lrrr di Omicron Persei 8 e l'All-Star Mecha di Bender
// 4. Dialoghi demenziali e 40 crediti stellari a partita
(function () {
  const K_FUT = "ali-di-rondine.futurama-league";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_FUT));
      if (d && typeof d === "object") {
        return {
          planetsCleared: Array.isArray(d.planetsCleared) ? d.planetsCleared : [],
          cyberCredits: typeof d.cyberCredits === "number" ? d.cyberCredits : 60,
          equippedMod: d.equippedMod || "none",
          trophyPlanetExpress: !!d.trophyPlanetExpress
        };
      }
    } catch (e) {}
    return {
      planetsCleared: [],
      cyberCredits: 60,
      equippedMod: "none",
      trophyPlanetExpress: false
    };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_FUT, JSON.stringify(p));
    } catch (e) {}
  }

  const PLANETS = [
    {
      id: "vergon",
      name: "Vergon 6 (Bassa Gravità)",
      gravity: "low",
      rival: "Nibbloniani Selvaggi",
      gk: "Lord Morso",
      desc: "Gravità al 30%. I pallonetti volano per 80 metri e i tiri restano sospesi a mezz'aria.",
      color: "#9b5de5",
      reward: 35
    },
    {
      id: "omicron",
      name: "Omicron Persei 8 (Alta Densità)",
      gravity: "heavy",
      rival: "Giganti di Omicron Persei 8",
      gk: "Lrrr ('SOVRANO DI OMICRON PERSEI 8!')",
      desc: "Gravità al 300%. Il pallone pesa 40 chili. Serve potenza tellurica per sfondare la terra.",
      color: "#f15bb5",
      reward: 45
    },
    {
      id: "donbot",
      name: "Stazione Spaziale Don Bot (Gravità Invertita)",
      gravity: "inverted",
      rival: "La Mafia Robot",
      gk: "Pinza & Don Bot",
      desc: "I campi magnetici sono rovesciati: si gioca sul soffitto con raggi laser polarizzati.",
      color: "#00bbf9",
      reward: 55
    },
    {
      id: "nny3000",
      name: "New New York Arena 3000 (Gran Finale)",
      gravity: "cyber",
      rival: "All-Star Mecha di Bender",
      gk: "Bender Titanio Lucido",
      desc: "La finale galattica davanti a milioni di teste sotto vetro! Il match supremo del 31° secolo.",
      color: "#fee440",
      reward: 70
    }
  ];

  const CYBER_MODS = [
    {
      id: "none",
      name: "Scarpini Standard del Molo",
      desc: "Nessun innesto bionico.",
      cost: 0
    },
    {
      id: "bender_arm",
      name: "Braccio Idraulico di Bender",
      desc: "Rimesse laterali a gittata supersonica e contrasti d'acciaio.",
      cost: 40
    },
    {
      id: "dark_matter",
      name: "Pillole di Materia Oscura (Nibbler)",
      desc: "Scatti alla velocità della luce che travolgono i difensori alieni.",
      cost: 65
    },
    {
      id: "leela_visor",
      name: "Visore Olografico di Leela",
      desc: "Mostra in anticipo il cono di tuffo del portiere.",
      cost: 80
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
      el.innerHTML = `<span class="who" style="background:#00f5d4; color:#0b092b; font-weight:900;">${who}</span><span class="t">${html}</span>`;
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

  function activateFuturamaView() {
    clearLoops();
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "futurama" });
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

  function closeFuturamaStage() {
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

  // ================= 1. HUB PLANET EXPRESS =================
  function openFuturamaMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function showHub() {
    setChap("Futurama 3000 · Champions Galattica");
    const prog = getProgress();
    const alt = activateFuturamaView();

    if (alt) {
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #0b092b 0%, #0077b6 60%, #00f5d4 100%);"></div>
        
        <!-- Navetta Planet Express sullo sfondo -->
        <div style="position:absolute; top:20px; right:20px; width:100px; height:50px; background:#2ec4b6; border-radius:30px 60px 10px 30px; border:2px solid #fff; transform:rotate(-15deg); box-shadow:0 0 15px #00f5d4;">
          <div style="position:absolute; top:12px; left:20px; width:25px; height:12px; background:#ff9f1c; border-radius:50%;"></div>
        </div>

        <div style="position:relative; z-index:2; height:100%; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <div style="font-family:var(--display); font-size:16px; color:#ffd23f; text-shadow:2px 2px 0 #000;">
                🛸 CHAMPIONS GALATTICA 3000
              </div>
              <div style="font-size:11px; color:#e0fbfc;">
                Pianeta Express Inc. · Torneo Interplanetario
              </div>
            </div>
            <div style="background:rgba(0,0,0,0.6); border:1.5px solid #00f5d4; border-radius:6px; padding:4px 8px; font-size:11px; color:#fff; text-align:right;">
              <div>Crediti: <b>${prog.cyberCredits} ⍟</b></div>
              <div style="color:var(--gold); font-size:10px;">Pianeti vinti: <b>${prog.planetsCleared.length}/4</b></div>
            </div>
          </div>

          <div style="background:rgba(10,15,40,0.8); border:1px solid #00f5d4; border-radius:8px; padding:6px 10px; font-size:11px; color:#fff;">
            Innesto attivo: <b>${CYBER_MODS.find(m => m.id === prog.equippedMod)?.name || "Nessuno"}</b>
          </div>
        </div>
      `;
    }

    showText(
      "Prof. Farnsworth",
      `«<b>Buone notizie, ciurma!</b> Ho iscritto la Rondine FC al Torneo di Calcio Spaziale per pagare la bolletta del generatore di materia oscura!<br>
      Viaggerete sui mondi più pericolosi della galassia: cambieranno gravità, atmosfera e avversari alieni! Se vincete, vi ricoprirò di crediti cosmici... altrimenti le vostre ossa concimeranno i campi di Marte!»`
    );

    const b = [];

    PLANETS.forEach((p, idx) => {
      const isWon = prog.planetsCleared.includes(p.id);
      b.push({
        label: `${isWon ? "✓" : "🚀"} ${idx + 1}. ${p.name}`,
        sub: `Gravità: ${p.gravity.toUpperCase()} · Avversario: ${p.rival} · Premio: +${p.reward} ⍟`,
        cls: isWon ? "" : "hot",
        fn: () => startPlanetMatch(p)
      });
    });

    b.push(
      {
        label: "🤖 Officina Cibernetica di Bender",
        sub: "Spendi i crediti stellari per comprare innesti e trucchi tecnologici",
        fn: showCyberShop
      },
      {
        label: "◂ Torna al Menu Principale",
        cls: "pick",
        fn: () => {
          closeFuturamaStage();
          if (onExitCallback) onExitCallback();
        }
      }
    );

    showButtons(b, true);
  }

  // ================= 2. OFFICINA CIBERNETICA =================
  function showCyberShop() {
    const prog = getProgress();
    showText(
      "Bender",
      `«Benvenuti nella mia bottega clandestina! Lasciate i vostri crediti e prendetevi il miglior hardware bionico che ho rubato negli spogliatoi della lega marziana!»`
    );

    const b = CYBER_MODS.map(m => {
      const isEquipped = prog.equippedMod === m.id;
      return {
        label: `${isEquipped ? "★ ATTIVO: " : ""}${m.name} (${m.cost} ⍟)`,
        sub: m.desc,
        cls: isEquipped ? "hot" : "",
        disabled: !isEquipped && prog.cyberCredits < m.cost,
        fn: () => {
          if (!isEquipped) {
            prog.cyberCredits -= m.cost;
            prog.equippedMod = m.id;
            saveProgress(prog);
            playSynth(880, "sine", 0.2, 0.25);
            if (window.toast) window.toast(`Equipaggiato: ${m.name}!`, "success", "🔧");
          }
          showCyberShop();
        }
      };
    });

    b.push({ label: "◂ Torna all'Hangar della Navetta", fn: showHub });
    showButtons(b, true);
  }

  // ================= 3. PARTITA A GRAVITÀ VARIABILE =================
  function startPlanetMatch(planet) {
    const prog = getProgress();
    setChap(`Futurama · ${planet.name}`);
    const alt = activateFuturamaView();
    if (!alt) return;

    alt.innerHTML = `
      <canvas id="futMatchCv" width="320" height="200" style="display:block; width:100%; height:100%; background:#001219;"></canvas>
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(0,18,25,0.9); border:1px solid ${planet.color}; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#00f5d4; font-weight:bold;">${planet.name.toUpperCase()}</span>
        <span id="futMatchScore" style="color:var(--gold); font-size:13px; font-weight:bold;">0 – 0</span>
        <span id="futMatchTurns" style="color:#94d2bd;">Turno: <b>1 / 4</b></span>
      </div>
    `;

    const canvas = document.getElementById("futMatchCv");
    const ctx = canvas.getContext("2d");

    let myGoals = 0;
    let rivalGoals = 0;
    let turn = 1;
    let ball = { x: 60, y: 140, vx: 0, vy: 0, flying: false };
    let gk = { y: 80, vy: 2.0, h: planet.gravity === "heavy" ? 50 : 32 };

    function shootBall(shotType) {
      if (ball.flying) return;
      ball.flying = true;

      // Fisica differenziata per pianeta
      if (planet.gravity === "low") {
        ball.vx = 6.0;
        ball.vy = shotType === "high" ? -4.5 : -2.0; // Salto lunghissimo
      } else if (planet.gravity === "heavy") {
        ball.vx = 8.5;
        ball.vy = -0.5; // Palla pesante come piombo
      } else if (planet.gravity === "inverted") {
        ball.vx = 7.0;
        ball.vy = shotType === "high" ? 3.0 : 1.0; // Rimbalza sul soffitto
      } else {
        ball.vx = 8.0;
        ball.vy = -2.0;
      }

      // Bonus mod cibernetica
      if (prog.equippedMod === "dark_matter") ball.vx *= 1.35;

      playSynth(640, "sawtooth", 0.2, 0.25);
      if (window.haptic) window.haptic(25);

      setTimeout(() => {
        ball.flying = false;
        ball.x = 60; ball.y = 140;

        // Verifica gol
        const isGoal = Math.random() < (prog.equippedMod === "leela_visor" ? 0.8 : 0.6);
        if (isGoal) {
          myGoals++;
          playSynth(950, "sine", 0.35, 0.3);
          if (window.toast) window.toast("⚽ GOOOL SPAZIALE NEL PIANETA!", "success", "🌟");
        } else {
          playSynth(180, "sawtooth", 0.2, 0.25);
          if (window.toast) window.toast(`Parata del portiere alieno (${planet.gk})!`, "error", "🧤");
        }

        // Il rivale contrattacca
        if (Math.random() < 0.35) {
          rivalGoals++;
          if (window.toast) window.toast(`Gol di ${planet.rival}!`, "info", "🛸");
        }

        turn++;
        const elSc = document.getElementById("futMatchScore");
        const elTu = document.getElementById("futMatchTurns");
        if (elSc) elSc.innerHTML = `${myGoals} – ${rivalGoals}`;
        if (elTu) elTu.innerHTML = `Turno: <b>${Math.min(4, turn)} / 4</b>`;

        if (turn > 4) {
          endMatch();
        } else {
          updateUi();
        }
      }, 1200);
    }

    function updateUi() {
      showText(
        planet.gk,
        `«Sei sul campo di <b>${planet.name}</b>! ${planet.desc}<br>
        Adatta la tua traiettoria alle leggi fisiche di questo pianeta!»`
      );
      showButtons([
        {
          label: planet.gravity === "low" ? "🚀 Pallonetto Lunghissimo a Bassa Gravità" : "⚡ Tiro Teso ad Alta Pressione",
          sub: "Sfrutta la gravità atmosferica per beffare il portiere",
          cls: "hot",
          fn: () => shootBall("high")
        },
        {
          label: planet.gravity === "inverted" ? "🌀 Tiro Rimbalzante dal Soffitto" : "💥 Bordata di Potenza Tellurica",
          sub: "Tiro a sfondare la zolla aliena",
          cls: "hot",
          fn: () => shootBall("low")
        },
        {
          label: "◂ Ritirati sulla Navetta",
          fn: () => { clearLoops(); showHub(); }
        }
      ]);
    }
    updateUi();

    function futMatchLoop() {
      gk.y += gk.vy;
      if (gk.y < 30 || gk.y > 140) gk.vy = -gk.vy;

      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Gravità applicata in volo
        if (planet.gravity === "low") ball.vy += 0.04;
        else if (planet.gravity === "heavy") ball.vy += 0.22;
        else if (planet.gravity === "inverted") ball.vy -= 0.12;
        else ball.vy += 0.1;
      }

      ctx.fillStyle = "#001219";
      ctx.fillRect(0, 0, 320, 200);

      // Terreno alieno
      ctx.fillStyle = planet.color;
      if (planet.gravity === "inverted") {
        ctx.fillRect(0, 0, 320, 40); // Soffitto
      } else {
        ctx.fillRect(0, 160, 320, 40); // Pavimento
      }

      // Porta aliena
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(280, 40, 30, 120);

      // Portiere alieno
      ctx.fillStyle = "#e76f51";
      ctx.fillRect(278, gk.y, 14, gk.h);

      // Giocatore Leo in tuta spaziale
      ctx.fillStyle = "#3fa7ff";
      ctx.fillRect(50, 130, 16, 30);
      ctx.fillStyle = "#ffd23f";
      ctx.beginPath();
      ctx.arc(58, 124, 7, 0, Math.PI * 2); // Casco
      ctx.fill();

      // Palla
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      activeAnimId = requestAnimationFrame(futMatchLoop);
    }

    function endMatch() {
      clearLoops();
      const won = myGoals > rivalGoals;
      if (won) {
        if (!prog.planetsCleared.includes(planet.id)) prog.planetsCleared.push(planet.id);
        prog.cyberCredits += planet.reward;
        saveProgress(prog);
        if (window.addCoins) window.addCoins(30);

        showText(
          "Fry & Leela",
          `<b style="color:var(--gold);">VITTORIA GALATTICA! ${myGoals} – ${rivalGoals}!</b><br>
          «Ce l'abbiamo fatta! Abbiamo battuto ${planet.rival} e intascato ${planet.reward} crediti stellari!»`
        );
        showButtons([
          { label: "Ritorna all'Hangar della Navetta ▸", cls: "hot", fn: showHub }
        ], true);
      } else {
        showText(
          "Lrrr",
          `«AVETE PERSO! QUESTO CONCETTO DI SCONFITTA CI DELIZIA! Tornate a mangiare la vostra focaccia terrestre!»`
        );
        showButtons([
          { label: "Riprova il Pianeta ▸", cls: "hot", fn: () => startPlanetMatch(planet) },
          { label: "◂ Torna all'Hangar", fn: showHub }
        ], true);
      }
    }

    activeAnimId = requestAnimationFrame(futMatchLoop);
  }

  window.openFuturamaLeagueMenu = openFuturamaMenu;
})();
