// ================= SAGA 1: CAPITAN TSUBASA · IL TIRO COMBINATO DELLA SCOGLIERA (MATCH REALE + 3D ARENA) =================
// Combina:
// 1. VERO GAMEPLAY PARTITA: Partite reali in tempo reale con Calcio d'Azione Pro (3v3, scivolate, passaggi, tiri caricati, finta e parate)
// 2. SFIDA 3D BALISTICA: Tiro combinato 3D con Three.js, mirino manuale e Sweet Spot ad elica
// 3. NARRATIVA SHONEN PROFONDA: Spogliatoio, Roberto Sedinho, rivalità accesa con Mark Lenders / Brando De Marchi, monologhi interiori
(function () {
  const K_TSU = "ali-di-rondine.tsubasa-v3";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_TSU));
      if (d && typeof d === "object") {
        return {
          stage: typeof d.stage === "number" ? d.stage : 0,
          cleared: Array.isArray(d.cleared) ? d.cleared : [],
          syncLevel: d.syncLevel || 1,
          goals: d.goals || 0
        };
      }
    } catch (e) {}
    return { stage: 0, cleared: [], syncLevel: 1, goals: 0 };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_TSU, JSON.stringify(p));
    } catch (e) {}
  }

  const TEAMS_DATA = [
    {
      id: "muppet",
      name: "La Muppet della Riviera",
      captain: "Brando 'Il Tigre' De Marchi",
      gkName: "Gino Baroni",
      teamKey: "muppet",
      pitch: "molo",
      quote: "«Il calcio è una zuffa per la sopravvivenza. Chi ha paura dell'impatto si sieda in panchina!»",
      lore: "Arrivano con un furgone scassato che puzza di gasolio. Si allenano sui ciottoli della falesia per spaccare le zolle ad ogni scatto.",
      dialogueIntro: `«Leo Moretti! Ti credi un fenomeno perché la gente del borgo ti applaude mentre mangi la focaccia?<br>
      Io mi sveglio alle quattro del mattino a scaricare casse di palamite al molo per pagarmi gli scarpini! In campo non esistono amici: se ti trovi tra me e la porta, ti travolgo insieme alla rete!»`,
      dialogueHalf: `«Nico, hai visto come entrano duro? Brando usa il corpo come un ariete! Ma se anticipiamo il tocco e facciamo girare la palla di prima, la loro foga si trasforma nella nostra arma migliore!»`
    },
    {
      id: "gemelli",
      name: "I Gemelli della Falesia",
      captain: "Dario & Mirko Trabucco",
      gkName: "Balzo Felino",
      teamKey: "gemelli",
      pitch: "sabbia",
      quote: "«Guardate verso l'alto se volete vederci giocare. La nostra catapulta parte dal cielo!»",
      lore: "Due fratelli cresciuti sui trabucchi che hanno sviluppato un'intesa aerea telepatica. Saltano l'uno sulle spalle dell'altro.",
      dialogueIntro: `«Benvenuti sulla spiaggia della Falesia! Qui la palla non rimbalza come sul vostro campetto curato.<br>
      Noi non corriamo sulla sabbia: noi VOLIAMO! Preparatevi a vedere il pallone solo quando si infila sotto l'incrocio!»`,
      dialogueHalf: `«I loro stacchi da terra sono impressionanti, sembrano gabbiani in picchiata! Ma se teniamo palla a terra con passaggi rasoterra tesi, non possono sfruttare il salto!»`
    },
    {
      id: "flynet",
      name: "La Flynet del Monte Turchino",
      captain: "Matteo 'Gelo' Neve",
      gkName: "Walter Muraglia",
      teamKey: "flynet",
      pitch: "campo",
      quote: "«Il vento del nord tempra i muscoli. La vostra focaccia non vi salverà dalla bufera.»",
      lore: "Una squadra di montagna abituata al gelo e al fango. Hanno una ragnatela di passaggi corti che sfianca qualsiasi attaccante.",
      dialogueIntro: `«A quota mille metri l'aria è rarefatta e i polmoni bruciano dopo dieci minuti.<br>
      Voi della costa siete abituati alla brezza marina tiepida. Oggi vi mostreremo cosa significa il sacrificio della Flynet: undici uomini che si muovono come un solo blocco di ghiaccio!»`,
      dialogueHalf: `«Hanno raddoppiato la marcatura su di me e su Nico! Dobbiamo allargare il gioco sulle fasce e sfruttare le sovrapposizioni rapide!»`
    },
    {
      id: "sanfrancis",
      name: "Il San Francis del Molo Vecchio",
      captain: "Julian 'Il Principe' Riva",
      gkName: "Beniamino 'Benji' Costantini",
      teamKey: "sanfrancis",
      pitch: "erba",
      quote: "«Da fuori area non si passa. Non ho mai preso un gol oltre i sedici metri in tutta la mia vita.»",
      lore: "I campioni aristocratici della scogliera. Benji Costantini è il portiere imbattuto per antonomasia.",
      dialogueIntro: `«Ti stavo aspettando, Moretti. Ho analizzato ogni tuo gol in campionato: hai talento, ma ti manca l'impatto decisivo contro un vero portiere.<br>
      Io difendo questa porta come un tempio sacro. Se vuoi segnarmi, devi inventare qualcosa che la fisica del calcio non ha mai visto prima d'ora!»`,
      dialogueHalf: `«Benji para tutto quello che vede partire! L'unica possibilità è il Tiro Combinato all'unisono: due rotazioni opposte che ingannano la traiettoria all'ultimo metro!»`
    }
  ];

  let onExitCallback = null;

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

  function getStageAlt() {
    return document.getElementById("stageAlt");
  }

  function activateTsubasaStage() {
    if (window.setView) window.setView({ kind: "tsubasa" });
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = true;
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = "block";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
      alt.innerHTML = "";
    }
    return alt;
  }

  function renderTsubasaHubStage(prog, curTeam) {
    const alt = activateTsubasaStage();
    if (!alt) return;

    alt.innerHTML = `
      <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0429 0%, #3a0ca3 45%, #ff0054 100%); overflow:hidden;">
        <!-- Anime Speedlines Shonen -->
        <svg style="position:absolute; inset:0; width:100%; height:100%; opacity:0.35; pointer-events:none;" viewBox="0 0 320 200">
          <line x1="0" y1="0" x2="320" y2="200" stroke="#fff" stroke-width="2" stroke-dasharray="14 20" />
          <line x1="320" y1="0" x2="0" y2="200" stroke="#fff" stroke-width="2" stroke-dasharray="16 22" />
          <line x1="160" y1="0" x2="160" y2="200" stroke="#ffd23f" stroke-width="3" stroke-dasharray="8 14" />
        </svg>

        <!-- Sole del tramonto sul mare ligure -->
        <div style="position:absolute; bottom:-40px; left:50%; margin-left:-90px; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle, #ffd23f 30%, #ff5400 70%, transparent 80%); opacity:0.85;"></div>

        <!-- Sagome Leo & Nico scatto shonen verso la porta -->
        <div style="position:absolute; bottom:15px; left:25px; width:34px; height:55px; background:#3fa7ff; border-radius:6px 6px 2px 2px; border:2px solid #fff; box-shadow:0 0 15px #3fa7ff; transform:skewX(-15deg); z-index:3;">
          <div style="position:absolute; top:8px; left:5px; font-weight:bold; font-size:11px; color:#fff;">10</div>
        </div>
        <div style="position:absolute; bottom:15px; left:65px; width:34px; height:55px; background:#ffd23f; border-radius:6px 6px 2px 2px; border:2px solid #fff; box-shadow:0 0 15px #ffd23f; transform:skewX(-15deg); z-index:3;">
          <div style="position:absolute; top:8px; left:5px; font-weight:bold; font-size:11px; color:#000;">11</div>
        </div>

        <!-- Pallone con aureola Twin Shot a mezza altezza -->
        <div style="position:absolute; bottom:55px; left:125px; width:22px; height:22px; background:#fff; border-radius:50%; border:2px solid #000; box-shadow:0 0 20px #00f5d4, 0 0 35px #ff0054; z-index:4;"></div>

        <!-- Overlay HUD Capitan Tsubasa -->
        <div style="position:relative; z-index:5; height:100%; padding:10px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <div style="font-family:var(--display); font-size:16px; color:#ffd23f; text-shadow:2px 2px 0 #900, 0 0 12px #ffd23f;">
                ⚡ IL TORNEO DELLA SCOGLIERA
              </div>
              <div style="font-size:11px; color:#f3e5f5; font-weight:bold;">
                Saga Shonen · Tributo a Capitan Tsubasa
              </div>
            </div>
            <div style="background:rgba(10,5,25,0.85); border:1.5px solid #ff0054; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; text-align:right;">
              <div>Tappe vinte: <b>${prog.cleared.length}/4</b></div>
              <div style="color:#ffd23f; font-size:10px;">Gol segnati: <b>${prog.goals}</b></div>
            </div>
          </div>

          <div style="background:rgba(12,4,28,0.85); border:1.5px solid rgba(255,255,255,0.3); border-radius:6px; padding:4px 8px; font-size:11px; color:#fff; margin-left:110px;">
            ⚽ Prossimo Match: <b style="color:#ffd23f;">${curTeam.name}</b><br>
            <span style="font-size:10px; color:#4cc9f0;">Capitano: ${curTeam.captain}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ================= 1. HUB DELLA SAGA =================
  function openTsubasaMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function showHub() {
    if (window.setChapter) window.setChapter("Capitan Tsubasa · Il Torneo della Scogliera");
    const prog = getProgress();
    const curTeam = TEAMS_DATA[prog.stage % TEAMS_DATA.length];
    renderTsubasaHubStage(prog, curTeam);

    showText(
      "Mister Roberto Sedinho",
      `«Leo, ascoltami bene. Questa non è una partita qualsiasi: <b>${curTeam.name}</b> è sbarcata al molo per sfidarci in campo aperto!<br>
      Puoi scendere sul rettangolo verde e giocare la <b>Vera Partita in Tempo Reale</b> (Calcio d'Azione Pro con comandi completi: passaggi, tackle, finta e tiro caricato), oppure allenare il <b>Twin Shot 3D</b> nell'arena balistica per affinare la precisione negli angoli alti!»`
    );

    const b = [
      {
        label: `⚽ 1. Scendi in Campo: Partita Reale contro ${curTeam.name}`,
        sub: `Partita vera in tempo reale (3v3 sul ${curTeam.pitch}) · Sfida ${curTeam.captain}!`,
        cls: "hot",
        fn: () => startRealMatchBriefing(prog.stage % TEAMS_DATA.length)
      },
      {
        label: "📖 2. Spogliatoio & Discorso Tattico di Roberto Sedinho",
        sub: `Leggi la storia segreta di ${curTeam.captain} e la preparazione psicologica`,
        fn: () => showLockerRoomTalk(curTeam)
      }
    ];

    if (prog.cleared.length > 0) {
      b.push({
        label: "🏆 Rivincita con le squadre già sconfitte",
        sub: "Rigioca le partite storiche del torneo",
        fn: showRematchMenu
      });
    }

    b.push({
      label: "◂ Torna al Menu Principale",
      cls: "pick",
      fn: () => {
        if (onExitCallback) onExitCallback();
        else if (window.title) window.title();
      }
    });

    showButtons(b, true);
  }

  function showLockerRoomTalk(team) {
    showText(
      "Roberto Sedinho",
      `«Guardati attorno nello spogliatoio, Leo. Guarda Nico, guarda i tuoi compagni.<br>
      <i>${team.lore}</i><br><br>
      <b>PAROLE DI ${team.captain.toUpperCase()}:</b><br>
      ${team.dialogueIntro}<br><br>
      <b>IL CONSIGLIO DI SEDINHO:</b><br>
      Non farti intimidire dalla loro stazza. La palla viaggia più veloce di qualsiasi marcatore. Quando sei vicino all'area, tieni premuto il tasto <b>Tiro</b> per caricare la potenza massima, oppure premi <b>Finta</b> se vedi che il difensore si lancia in scivolata!»`
    );
    showButtons([
      {
        label: `Scendi in Campo contro ${team.name} ORA! ▸`,
        cls: "hot",
        fn: () => startRealMatchBriefing(TEAMS_DATA.indexOf(team))
      },
      {
        label: "◂ Torna al Menu del Torneo",
        fn: showHub
      }
    ]);
  }

  function showRematchMenu() {
    const prog = getProgress();
    const b = prog.cleared.map((id) => {
      const t = TEAMS_DATA.find(x => x.id === id) || TEAMS_DATA[0];
      return {
        label: `Rivincita sul campo: ${t.name}`,
        sub: `Capitano: ${t.captain}`,
        fn: () => startRealMatchBriefing(TEAMS_DATA.indexOf(t))
      };
    });
    b.push({ label: "◂ Torna all'Hub", fn: showHub });
    showButtons(b, true);
  }

  function renderTsubasaMatchPreviewStage(team) {
    const alt = activateTsubasaStage();
    if (!alt) return;
    alt.innerHTML = `
      <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0429 0%, #3a0ca3 45%, #ff0054 100%); display:flex; flex-direction:column; justify-content:space-between; padding:10px; box-sizing:border-box;">
        <div style="text-align:center; font-family:var(--display); font-size:13px; color:#ffd23f; text-shadow:0 0 8px #ffd23f;">
          ⚡ SFIDA DEL CAMPIONATO DELLA SCOGLIERA
        </div>
        <div style="display:flex; align-items:center; justify-content:space-around;">
          <div style="text-align:center;">
            <div style="font-size:30px;">🦅</div>
            <div style="color:#3fa7ff; font-weight:bold; font-size:12px;">RONDINE FC</div>
            <div style="color:#a2d2ff; font-size:10px;">Leo & Nico</div>
          </div>
          <div style="font-family:var(--display); font-size:20px; color:#ffd23f; text-shadow:0 0 10px #ff0054;">VS</div>
          <div style="text-align:center;">
            <div style="font-size:30px;">🐯</div>
            <div style="color:#ffd23f; font-weight:bold; font-size:12px;">${team.name.toUpperCase()}</div>
            <div style="color:#f8edeb; font-size:10px;">${team.captain}</div>
          </div>
        </div>
        <div style="background:rgba(12,4,28,0.85); border:1px solid #ffd23f; border-radius:6px; padding:3px 8px; font-size:10px; color:#fff; text-align:center;">
          Campo: <b>${team.pitch.toUpperCase()}</b> · Arbitro con fischietto pronto!
        </div>
      </div>
    `;
  }

  // ================= 2. BRIEFING NARRATIVO PRE-PARTITA REALE =================
  function startRealMatchBriefing(stageIdx) {
    const team = TEAMS_DATA[stageIdx];
    renderTsubasaMatchPreviewStage(team);
    showText(
      team.captain,
      `<i>«${team.dialogueIntro}»</i><br>
      <b>${team.captain} e i suoi compagni ti attendono sul campo!</b>`
    );
    showButtons([
      {
        label: `⚽ FISCHIO D'INIZIO: GIOCA ORA! (3v3)`,
        sub: `Partita reale sul ${team.pitch} · Comandi completi`,
        cls: "hot",
        fn: () => launchActualMatch(stageIdx)
      },
      {
        label: "📜 Consulta Dossier e Consigli di Sedinho",
        sub: "Leggi le debolezze tattiche prima del fischio",
        fn: () => showLockerRoomTalk(team)
      },
      {
        label: "◂ Torna allo Spogliatoio",
        fn: showHub
      }
    ], true);
  }

  // ================= 3. LANCIO VERA PARTITA SUL CAMPO CON IL MATCH ENGINE =================
  function launchActualMatch(stageIdx) {
    const team = TEAMS_DATA[stageIdx];
    if (!window.azStartSagaMatch) {
      if (window.toast) window.toast("Motore di gioco partita non pronto!", "error", "⚠️");
      showHub();
      return;
    }

    if (window.toast) window.toast(`⚽ FISCHIO D'INIZIO: RONDINE FC vs ${team.name.toUpperCase()}!`, "success", "🏟️");

    const curDiff = window.getGlobalAzDiff ? window.getGlobalAzDiff() : "norm";
    // Lancia la VERA partita di Calcio d'Azione Pro contro la squadra rivale
    window.azStartSagaMatch(
      team.teamKey,
      {
        mode: "amic",
        pitch: team.pitch,
        diff: curDiff,
        pu: true,
        roles: ["nico", "sandro", "dario"]
      },
      (myGoals, rivalGoals) => {
        // Callback al fischio finale
        handleMatchResult(stageIdx, myGoals, rivalGoals);
      }
    );
  }

  // ================= 4. POST-PARTITA & NARRATIVA SHONEN =================
  function handleMatchResult(stageIdx, myGoals, rivalGoals) {
    const team = TEAMS_DATA[stageIdx];
    const won = myGoals > rivalGoals;
    const prog = getProgress();
    renderTsubasaHubStage(prog, team);

    if (won) {
      if (!prog.cleared.includes(team.id)) prog.cleared.push(team.id);
      if (prog.stage === stageIdx) prog.stage++;
      prog.goals += myGoals;
      saveProgress(prog);
      if (window.addCoins) window.addCoins(50);

      playSynth(950, "sine", 0.45, 0.4);
      if (window.toast) window.toast(`🏆 TRIONFO! ${myGoals} – ${rivalGoals} contro ${team.name}!`, "success", "🌟");

      showText(
        team.captain,
        `<b style="color:var(--gold); font-size:14px;">TRIPLICE FISCHIO! RONDINE FC ${myGoals} – ${rivalGoals} ${team.name.toUpperCase()}!</b><br><br>
        «Non... non è possibile! Ci avete superato sul ritmo e sul cuore! Quel tiro finale ha piegato le mani del nostro portiere e si è infilato nell'angolo cieco!<br>
        Hai vinto, Leo Moretti. Oggi il golfo ha un nuovo re, ma sappi che ci alleneremo giorno e notte finché non ci sarà la rivincita!»`
      );

      showButtons([
        {
          label: prog.stage < TEAMS_DATA.length ? "Avanza alla Prossima Sfida del Torneo ▸" : "👑 SOLLEVA LA COPPA DELLA SCOGLIERA!",
          cls: "hot",
          fn: showHub
        },
        {
          label: "Festeggia con la squadra al Bar del Porto 🍻",
          fn: () => {
            if (window.toast) window.toast("Tutta Borgo Marino canta il coro della Rondine!", "info", "🎉");
            showHub();
          }
        }
      ], true);
    } else if (myGoals === rivalGoals) {
      showText(
        "Roberto Sedinho",
        `<b style="color:#4cc9f0;">PAREGGIO COMBATTUTISSIMO! ${myGoals} – ${rivalGoals}!</b><br><br>
        «Un match di pura adrenalina shonen, Leo! Entrambe le squadre hanno lottato su ogni zolla. Ci è mancato solo quel pizzico di cattiveria sotto porta. Riorganizziamo le idee e rigiochiamocela subito!»`
      );
      showButtons([
        { label: "Rigoca la Partita e Cerca la Vittoria! ▸", cls: "hot", fn: () => launchActualMatch(stageIdx) },
        { label: "◂ Torna allo Spogliatoio", fn: showHub }
      ], true);
    } else {
      showText(
        team.captain,
        `<b style="color:#ff0054;">SCONFITTA SUL CAMPO: ${myGoals} – ${rivalGoals} per ${team.name}!</b><br><br>
        «Te l'avevo detto, Moretti! Sulle falesie della Riviera vince chi non ha paura di farsi male! Tornate ad allenarvi sulla sabbia!»<br><br>
        <b>ROBERTO SEDINHO:</b> <i>«Rialza la testa, Leo! Un vero bomber impara più da una sconfitta che da dieci vittorie facili. Abbiamo visto i loro punti deboli: andiamo a riprenderci la vittoria!»</i>`
      );
      showButtons([
        { label: "Rivincita Immediata: Scendi di Nuovo in Campo! ▸", cls: "hot", fn: () => launchActualMatch(stageIdx) },
        { label: "◂ Torna al Menu", fn: showHub }
      ], true);
    }
  }

  window.openTsubasaMenu = openTsubasaMenu;
})();
