// ================= SAGA 2: GAME OF THRONES · LA GUERRA DEI CINQUE TRABUCCHI =================
// Tributo epico a George R.R. Martin, Westeros, le Casate e la Battaglia della Notte.
// Con vero gameplay profondo:
// 1. Mappa tattica a feudi costieri (Guerra di Conquista)
// 2. Gestione risorse: Oro delle Decime, Barili di Pesto/Viveri, Morale della Guarnigione
// 3. Battaglie d'assedio medievali in armatura (Falange di Scudi, Cavalleria, Balestrieri)
// 4. Minaccia dell'Inverno e scontro finale contro il Re della Notte per il Trono di Focaccia
(function () {
  const K_GOT = "ali-di-rondine.thrones-progress";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_GOT));
      if (d && typeof d === "object") {
        return {
          conquered: Array.isArray(d.conquered) ? d.conquered : ["rondine"],
          gold: typeof d.gold === "number" ? d.gold : 120,
          pesto: typeof d.pesto === "number" ? d.pesto : 80,
          morale: typeof d.morale === "number" ? d.morale : 90,
          winterMeter: typeof d.winterMeter === "number" ? d.winterMeter : 10,
          wonIronFocaccia: !!d.wonIronFocaccia
        };
      }
    } catch (e) {}
    return {
      conquered: ["rondine"],
      gold: 120,
      pesto: 80,
      morale: 90,
      winterMeter: 10,
      wonIronFocaccia: false
    };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_GOT, JSON.stringify(p));
    } catch (e) {}
  }

  const HOUSES = [
    {
      id: "rondine",
      name: "Casata Moretti",
      seat: "Trabucco Rondine",
      sigil: "🦅 Rondine Alata",
      motto: "Il Calcio sta Arrivando",
      color: "#3fa7ff",
      leader: "Lord Leo Moretti",
      defense: 0
    },
    {
      id: "lanterna",
      name: "Casata Ruggeri",
      seat: "Rocca Lanterna",
      sigil: "🏮 Faro nella Tempesta",
      motto: "Noi Non Passiamo",
      color: "#ffb703",
      leader: "Ser Ruggeri il Mastino",
      defense: 65,
      tributeGold: 45
    },
    {
      id: "ferri",
      name: "Casata Ferri",
      seat: "Castel Forno",
      sigil: "🥖 Teglia d'Oro",
      motto: "Caldi e Croccanti",
      color: "#fb8500",
      leader: "Lady Nonna Ferri",
      defense: 75,
      tributeGold: 55
    },
    {
      id: "baciccia",
      name: "Casata Baciccia",
      seat: "Porto Trabucco",
      sigil: "⚓ Rete di Cuoio",
      motto: "Reti e Tempesta",
      color: "#06d6a0",
      leader: "Sire Baciccia il Vecchio",
      defense: 85,
      tributeGold: 65
    },
    {
      id: "corsari",
      name: "Casata dei Corsari",
      seat: "Falesia Nera",
      sigil: "🗡️ Sciabola di Mare",
      motto: "Ciò che affonda non muore",
      color: "#e63946",
      leader: "Barbanera del Tigullio",
      defense: 95,
      tributeGold: 80
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
      el.innerHTML = `<span class="who" style="background:#590d22; color:#ffb703; font-weight:800; border:1px solid #ffb703;">${who}</span><span class="t">${html}</span>`;
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

  function activateThronesView() {
    clearLoops();
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "thrones" });
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

  function closeThronesStage() {
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

  // ================= 1. HUB & MAPPA TATTICA =================
  function openThronesMenu(onBack) {
    onExitCallback = onBack;
    showWarMap();
  }

  function showWarMap() {
    setChap("Westeros Ligure · La Guerra dei Cinque Trabucchi");
    const prog = getProgress();
    const alt = activateThronesView();

    if (alt) {
      alt.innerHTML = `
        <canvas id="mapCv" width="320" height="200" style="display:block; width:100%; height:100%; background:#1c1008;"></canvas>
        <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(30,15,5,0.9); border:1.5px solid #ffb703; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
          <span style="color:#ffd23f;">🪙 Oro: <b>${prog.gold}</b></span>
          <span style="color:#06d6a0;">🫒 Pesto: <b>${prog.pesto}</b></span>
          <span style="color:#ff4d5a;">⚔️ Morale: <b>${prog.morale}%</b></span>
          <span style="color:#a2d2ff;">❄️ Inverno: <b>${prog.winterMeter}%</b></span>
        </div>
      `;

      renderMapCanvas(prog);
    }

    const unscaled = HOUSES.filter(h => !prog.conquered.includes(h.id));

    if (unscaled.length === 0 && !prog.wonIronFocaccia) {
      // Sblocco gran finale contro il Re della Notte
      showText(
        "Maestro del Golfo",
        `«Mio Signore! Tutte le 5 Casate hanno piegato il ginocchio alla Casata Moretti! Ma dalle nebbie del Nord scende l'Inverno Eterno: il <b>Re della Notte</b> marcia con l'armata dei Trabucchi Spettrali per strapparvi il Trono di Focaccia!»`
      );
      showButtons([
        {
          label: "👑 La Grande Battaglia per il Trono di Focaccia!",
          sub: "Affronta il Re della Notte con l'esercito unificato della Costa",
          cls: "hot",
          fn: startFinalBattle
        },
        {
          label: "◂ Torna al Menu Principale",
          fn: () => { closeThronesStage(); if (onExitCallback) onExitCallback(); }
        }
      ], true);
      return;
    }

    if (prog.wonIronFocaccia) {
      showText(
        "Lord Leo Moretti",
        `«La Costa è pacificata, l'Inverno è stato respinto col Fuoco Valyriano e il Trono di Focaccia appartiene per sempre alla Rondine FC!»`
      );
    } else {
      showText(
        "Consigliere di Guerra",
        `«Mio Signore, la Casata Moretti controlla ${prog.conquered.length}/5 feudi. I barili di pesto nutrono gli armigeri, l'oro paga le armature. Scegliete quale fortezza assediare o rinforzate le scorte prima che cali la bufera!»`
      );
    }

    const b = [];

    // Feudi assediabili
    unscaled.forEach(h => {
      b.push({
        label: `⚔️ Assedia ${h.seat} (${h.name})`,
        sub: `Difesa: ${h.defense} · Comandante: ${h.leader} · Ricompensa: +${h.tributeGold} oro`,
        cls: "hot",
        fn: () => startSiegeBattle(h)
      });
    });

    b.push(
      {
        label: "🥖 Rifornisci la Guarnigione (-30 Oro -> +40 Pesto, +15 Morale)",
        sub: "Acquista focaccia e acciughe per sfamare i cavalieri",
        disabled: prog.gold < 30,
        fn: () => {
          prog.gold -= 30;
          prog.pesto += 40;
          prog.morale = Math.min(100, prog.morale + 15);
          saveProgress(prog);
          playSynth(520, "sine", 0.2, 0.2);
          if (window.toast) window.toast("+Rifornimenti distribuiti alle truppe!", "success", "🥖");
          showWarMap();
        }
      },
      {
        label: "📜 La Mappa delle Cinque Casate",
        sub: "Consulta stemmi, motti e alleanze del Golfo",
        fn: showLore
      },
      {
        label: "◂ Torna al Menu Principale",
        cls: "pick",
        fn: () => {
          closeThronesStage();
          if (onExitCallback) onExitCallback();
        }
      }
    );

    showButtons(b, true);
  }

  function renderMapCanvas(prog) {
    const canvas = document.getElementById("mapCv");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Sfondo pergamena antica
    ctx.fillStyle = "#2b1a0e";
    ctx.fillRect(0, 0, 320, 200);

    // Mare del Golfo
    ctx.fillStyle = "#16283b";
    ctx.beginPath();
    ctx.moveTo(0, 70);
    ctx.bezierCurveTo(90, 90, 180, 50, 320, 110);
    ctx.lineTo(320, 200);
    ctx.lineTo(0, 200);
    ctx.fill();

    // Costa e Trabucchi
    const coords = [
      { id: "rondine", x: 45, y: 130 },
      { id: "lanterna", x: 105, y: 95 },
      { id: "ferri", x: 170, y: 125 },
      { id: "baciccia", x: 235, y: 85 },
      { id: "corsari", x: 285, y: 140 }
    ];

    coords.forEach(c => {
      const isConq = prog.conquered.includes(c.id);
      // Cerchio feudo
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = isConq ? "#3fa7ff" : "#590d22";
      ctx.fill();
      ctx.strokeStyle = isConq ? "#ffd23f" : "#a2d2ff";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Icona
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(isConq ? "👑" : "🏰", c.x - 6, c.y + 4);
    });

    // Tempesta di ghiaccio a Nord
    if (prog.winterMeter > 20) {
      ctx.fillStyle = "rgba(162, 210, 255, 0.25)";
      ctx.fillRect(0, 0, 320, (prog.winterMeter / 100) * 80);
    }
  }

  function showLore() {
    showText(
      "Archivi di Borgo",
      `«<b>I MOTTI DELLE CINQUE CASATE:</b><br>
      • <b>Casata Moretti</b>: <i>"Il Calcio sta Arrivando"</i> (Stemma della Rondine)<br>
      • <b>Casata Ruggeri</b>: <i>"Noi Non Passiamo"</i> (Stemma del Faro)<br>
      • <b>Casata Ferri</b>: <i>"Caldi e Croccanti"</i> (Stemma della Teglia d'Oro)<br>
      • <b>Casata Baciccia</b>: <i>"Reti e Tempesta"</i> (Stemma dell'Ancora)<br>
      • <b>Casata dei Corsari</b>: <i>"Ciò che affonda non muore"</i> (Stemma della Sciabola)»`
    );
    showButtons([{ label: "◂ Torna alla Mappa di Guerra", fn: showWarMap }]);
  }

  // ================= 2. BATTAGLIA D'ASSEDIO TATTICA =================
  function startSiegeBattle(targetHouse) {
    const prog = getProgress();
    setChap(`Assedio · ${targetHouse.seat}`);
    const alt = activateThronesView();
    if (!alt) return;

    alt.innerHTML = `
      <canvas id="siegeCv" width="320" height="200" style="display:block; width:100%; height:100%; background:#1c0e0b;"></canvas>
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(20,5,5,0.9); border:1px solid #e63946; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#ffd23f;">ASSEDIO A ${targetHouse.name.toUpperCase()}</span>
        <span id="siegeWallEl" style="color:#ff4d5a;">Mura: <b>${targetHouse.defense} HP</b></span>
        <span id="siegeMoraleEl" style="color:#06d6a0;">Nostro Esercito: <b>${prog.morale}%</b></span>
      </div>
    `;

    let wallHp = targetHouse.defense;
    let myHp = prog.morale;

    function executeAssault(type) {
      let dmg = 0;
      let costPesto = 10;

      if (type === "shield_wall") {
        dmg = 22 + Math.floor(Math.random() * 10);
        myHp -= 5;
        playSynth(420, "triangle", 0.25, 0.25);
        if (window.toast) window.toast("🛡️ Falange di Scudi: Avanzata solida e mura incrinate!", "info", "⚔️");
      } else if (type === "cavalry") {
        dmg = 35 + Math.floor(Math.random() * 15);
        myHp -= 15;
        playSynth(680, "sawtooth", 0.3, 0.3);
        if (window.toast) window.toast("🐎 Carica di Cavalleria: Breccia nelle porte del castello!", "success", "⚡");
      } else if (type === "archers") {
        dmg = 18 + Math.floor(Math.random() * 8);
        myHp -= 2;
        playSynth(800, "sine", 0.15, 0.2);
        if (window.toast) window.toast("🏹 Pioggia di Frecce e Tiri d'Assedio!", "info", "🎯");
      }

      wallHp = Math.max(0, wallHp - dmg);
      prog.pesto = Math.max(0, prog.pesto - costPesto);

      const elWall = document.getElementById("siegeWallEl");
      const elMorale = document.getElementById("siegeMoraleEl");
      if (elWall) elWall.innerHTML = `Mura: <b>${wallHp} HP</b>`;
      if (elMorale) elMorale.innerHTML = `Nostro Esercito: <b>${myHp}%</b>`;

      if (wallHp <= 0) {
        // Conquistato!
        prog.conquered.push(targetHouse.id);
        prog.gold += targetHouse.tributeGold;
        prog.winterMeter = Math.min(100, prog.winterMeter + 18);
        prog.morale = Math.max(40, myHp + 15);
        saveProgress(prog);

        playSynth(950, "sine", 0.4, 0.35);
        if (window.toast) window.toast(`👑 ${targetHouse.seat.toUpperCase()} È CADUTO!`, "success", "🏰");

        showText(
          targetHouse.leader,
          `«Ci arrendiamo, Lord Leo! Le nostre spade e i nostri migliori attaccanti sono al vostro servizio. Vi versiamo ${targetHouse.tributeGold} monete d'oro e giuriamo fedeltà alla Rondine!»`
        );
        showButtons([
          { label: "Ritorna trionfante alla Mappa di Guerra ▸", cls: "hot", fn: showWarMap }
        ], true);
      } else if (myHp <= 0 || prog.pesto <= 0) {
        showText(
          "Generale",
          `«Lord Leo, le nostre truppe sono sfinite e il pesto è finito! Dobbiamo ritirarci al Trabucco Rondine prima della disfatta!»`
        );
        prog.morale = 50;
        saveProgress(prog);
        showButtons([
          { label: "Ritirata strategica ▸", fn: showWarMap }
        ], true);
      } else {
        updateSiegeUi();
      }
    }

    function updateSiegeUi() {
      showText(
        "Tattica d'Assalto",
        `«Scegli l'ordine d'attacco contro le difese di ${targetHouse.seat}:<br>
        - <b>Falange di Scudi</b>: Danni stabili, perdite minime.<br>
        - <b>Carica di Cavalleria</b>: Danni devastanti ma subisce il fuoco nemico.<br>
        - <b>Tiri d'Assedio dei Balestrieri</b>: Bersaglia i difensori a distanza.»`
      );
      showButtons([
        {
          label: "🛡️ 1. Falange di Scudi Avanzata",
          sub: "Assalto coordinato a difesa alta",
          fn: () => executeAssault("shield_wall")
        },
        {
          label: "🐎 2. Carica di Cavalleria sui Fianchi",
          sub: "Bordata rovinosa per spaccare le porte",
          cls: "hot",
          fn: () => executeAssault("cavalry")
        },
        {
          label: "🏹 3. Tiri dei Balestrieri dal Molo",
          sub: "Tiro a spiovere a logoramento",
          fn: () => executeAssault("archers")
        },
        {
          label: "🛑 Ordina la Ritirata al Trabucco",
          fn: showWarMap
        }
      ]);
    }
    updateSiegeUi();

    // Disegno assedio medievale
    const cv = document.getElementById("siegeCv");
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#1e1008";
    ctx.fillRect(0, 0, 320, 200);

    // Mura del castello
    ctx.fillStyle = targetHouse.color;
    ctx.fillRect(230, 40, 80, 140);
    ctx.fillStyle = "#111";
    ctx.fillRect(250, 110, 25, 45); // Portone

    // Armata Rondine
    ctx.fillStyle = "#3fa7ff";
    ctx.fillRect(40, 120, 16, 32); // Leo
    ctx.fillStyle = "#ffd23f";
    ctx.fillRect(20, 128, 14, 24);
    ctx.fillRect(60, 128, 14, 24);
  }

  // ================= 3. GRAN FINALE: IL TRONO DI FOCACCIA =================
  function startFinalBattle() {
    setChap("La Lunga Notte · Il Re della Notte");
    const alt = activateThronesView();
    if (!alt) return;

    alt.innerHTML = `
      <canvas id="finalCv" width="320" height="200" style="display:block; width:100%; height:100%; background:#050c1a;"></canvas>
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(5,15,35,0.9); border:1.5px solid #a2d2ff; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#a2d2ff;">❄️ IL RE DELLA NOTTE</span>
        <span id="finalBossHp" style="color:#ff4d5a;">Gelo Eterno: <b>150 HP</b></span>
      </div>
    `;

    let bossHp = 150;

    function strikeValyrian() {
      bossHp = Math.max(0, bossHp - 50);
      playSynth(880, "sawtooth", 0.35, 0.35);
      if (window.haptic) window.haptic(35);

      if (window.triggerAnimeCutin) {
        window.triggerAnimeCutin({
          who: "Lord Leo Moretti",
          shotName: "COLPO DEL FUOCO VALYRIANO!",
          isEgo: true,
          sfxWord: "DRACARYS!"
        });
      }

      const el = document.getElementById("finalBossHp");
      if (el) el.innerHTML = `Gelo Eterno: <b>${bossHp} HP</b>`;

      if (bossHp <= 0) {
        const prog = getProgress();
        prog.wonIronFocaccia = true;
        saveProgress(prog);
        if (window.addCoins) window.addCoins(50);

        showText(
          "Il Re della Notte",
          `«<i>Il ghiaccio si frantuma... il calore del pesto e della focaccia ha sconfitto la notte perenne.</i> Il Trono di Focaccia è vostro, Lord Leo!»`
        );
        showButtons([
          {
            label: "🏆 Sali sul Trono di Focaccia delle Cinque Casate!",
            cls: "hot",
            fn: () => {
              if (window.toast) window.toast("👑 SIGNORE ASSOLUTO DEL GOLFO E DI WESTEROS!", "success", "🏆");
              showWarMap();
            }
          }
        ], true);
      } else {
        updateFinalUi();
      }
    }

    function updateFinalUi() {
      showText(
        "Re della Notte",
        `«La bufera gela i vostri scarpini! Nessun mortale può resistere all'inverno del profondo mare!»`
      );
      showButtons([
        {
          label: "🔥 TIRO DRACARYS DEL DRAGO DI MARE!",
          sub: "Colpisci il cuore di ghiaccio con fiamme pure",
          cls: "hot",
          fn: strikeValyrian
        },
        {
          label: "🛡️ Resistenza di Pesto e Acciughe",
          sub: "Proteggi i tuoi compagni con gli scudi scaldati dal forno",
          fn: () => {
            playSynth(520, "sine", 0.2, 0.2);
            if (window.toast) window.toast("Gli scudi di rame riflettono la tormenta!", "info", "🛡️");
            strikeValyrian();
          }
        }
      ]);
    }
    updateFinalUi();

    // Disegno scontro epico sul ghiaccio
    const cv = document.getElementById("finalCv");
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#050c1a";
    ctx.fillRect(0, 0, 320, 200);

    // Neve
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = "#a2d2ff";
      ctx.fillRect(Math.random() * 320, Math.random() * 200, 2, 2);
    }

    // Re della Notte
    ctx.fillStyle = "#03045e";
    ctx.fillRect(240, 80, 22, 50);
    ctx.fillStyle = "#00f5d4";
    ctx.fillRect(238, 86, 4, 4); // Occhi azzurro ghiaccio
    ctx.fillRect(238, 94, 4, 4);

    // Leo in armatura con spada infuocata
    ctx.fillStyle = "#3fa7ff";
    ctx.fillRect(60, 110, 20, 40);
    ctx.fillStyle = "#ff5400";
    ctx.fillRect(75, 100, 8, 25); // Fiamma
  }

  window.openThronesWarMenu = openThronesMenu;
})();
