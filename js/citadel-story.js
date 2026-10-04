// ================= SAGA 4: RICK & MORTY · LA CITTADELLA DEI LEO MORETTI (MATCH REALE + NARRATIVA CYNICAL) =================
// Combina:
// 1. VERO GAMEPLAY PARTITA: Partite reali in tempo reale contro la Milizia dei Cloni e l'Armata di Evil Leo
// 2. DIALOGHI MULTIVERSALI & PORTAL GUN: Teorie quantiche demenziali sulla focaccia e bivi narrativi
// 3. SCONTRO FINALE CON EVIL LEO: Boss match decisivo per liberare tutte le varianti di Leo
(function () {
  const K_CIT = "ali-di-rondine.citadel-v3";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_CIT));
      if (d && typeof d === "object") {
        return {
          stagesCleared: Array.isArray(d.stagesCleared) ? d.stagesCleared : [],
          evilLeoDefeated: !!d.evilLeoDefeated,
          dimensionJumps: d.dimensionJumps || 0
        };
      }
    } catch (e) {}
    return {
      stagesCleared: [],
      evilLeoDefeated: false,
      dimensionJumps: 0
    };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_CIT, JSON.stringify(p));
    } catch (e) {}
  }

  const STAGES = [
    {
      id: "citadel_patrol",
      name: "1. La Milizia dei Cloni della Cittadella",
      rival: "Milizia della Cittadella",
      captain: "Leo Cyborg C-800",
      teamKey: "citadel_army",
      pitch: "campo",
      rewardCoins: 40,
      introLore: `«La Cittadella è una metropoli orbitale costruita su infinite dimensioni. Ogni strada è pattugliata da varianti clonate di te stesso.<br>
      La Milizia dei Cloni gioca con schemi programmati al millimetro da algoritmi quantici: non commettono mai un errore di posizionamento e raddoppiano sempre sul portatore di palla!»`,
      dialoguePre: `«Identificato soggetto: Leo Moretti originale, dimensione Terra C-137. Livello di minaccia: focaccia non autorizzata. Consegnate gli scarpini o verrete vaporizzati sul campo da gioco!»`
    },
    {
      id: "evil_syndicate",
      name: "2. Lo Scontro Finale: Il Sindacato di Evil Leo",
      rival: "Evil Leo Syndicate",
      captain: "Evil Leo (Benda sull'Occhio)",
      teamKey: "evil_leo",
      pitch: "molo",
      rewardCoins: 80,
      introLore: `«Nel cuore della Cittadella siede Evil Leo. Ha una benda sull'occhio, gel quantico nei capelli e un disprezzo assoluto per il calcio pulito.<br>
      Ha potenziato la sua squadra con microchip illegali e portieri a campo magnetico. Se vinciamo, liberiamo tutte le versioni di Leo del multiverso!»`,
      dialoguePre: `«Sei prevedibile, Leo C-137. Corri, sudi, sogni di salvare il tuo paesino sul mare... Che spreco di potenziale multiversale!<br>
      Io domino decine di dimensioni mentre tu friggi le acciughe con Nonna. Questo match decreterà chi di noi due merita di esistere nella linea temporale principale!»`
    }
  ];

  let onExitCallback = null;

  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#76ff03; color:#0d1b2a; font-weight:900; letter-spacing:0.5px;">${who}</span><span class="t">${html}</span>`;
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

  // ================= 1. HUB DELLA CITTADELLA =================
  function openCitadelStoryMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function getStageAlt() {
    return document.getElementById("stageAlt");
  }

  function activateCitadelStage() {
    if (window.setView) window.setView({ kind: "citadel" });
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

  function renderCitadelHubStage(prog) {
    const alt = activateCitadelStage();
    if (!alt) return;

    alt.innerHTML = `
      <div style="position:absolute; inset:0; background:radial-gradient(circle at 50% 45%, #180033 0%, #050010 100%); overflow:hidden;">
        <!-- Stelle quantiche -->
        <div style="position:absolute; width:2px; height:2px; background:#fff; top:20%; left:15%; box-shadow: 40px 60px #fff, 120px 20px #76ff03, 220px 80px #00e5ff, 80px 140px #ff0054, 260px 130px #fff, 180px 160px #76ff03;"></div>
        
        <!-- Portale verde acido rotante -->
        <div style="position:absolute; top:50%; left:50%; width:150px; height:150px; margin:-75px 0 0 -75px; border-radius:50%; background:radial-gradient(circle, #76ff03 25%, #00b300 65%, transparent 75%); box-shadow:0 0 35px #76ff03, inset 0 0 25px #003300; opacity:0.85; animation:spin 12s linear infinite;"></div>

        <!-- Silhouette Cittadella dei Leo -->
        <svg style="position:absolute; bottom:0; left:0; width:100%; height:80px; opacity:0.65; pointer-events:none;" viewBox="0 0 320 80">
          <polygon points="20,80 35,30 50,80" fill="#2d004d" />
          <polygon points="70,80 85,15 100,80" fill="#1f0033" />
          <polygon points="120,80 140,40 160,80" fill="#38006b" />
          <polygon points="180,80 205,10 230,80" fill="#1f0033" />
          <polygon points="250,80 270,35 290,80" fill="#2d004d" />
        </svg>

        <!-- Stile animazione -->
        <style>
          @keyframes spin { 100% { transform:rotate(360deg); } }
        </style>

        <!-- Overlay HUD Multiverso -->
        <div style="position:relative; z-index:5; height:100%; padding:10px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <div style="font-family:var(--display); font-size:16px; color:#76ff03; text-shadow:0 0 12px #76ff03, 2px 2px 0 #000;">
                🧪 LA CITTADELLA DEI LEO
              </div>
              <div style="font-size:11px; color:#e0fbfc; font-weight:bold;">
                Dimensione C-137 · Multiverso dei Calciatori
              </div>
            </div>
            <div style="background:rgba(5,0,20,0.8); border:1.5px solid #76ff03; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; text-align:right;">
              <div>Status: <b style="color:${prog.evilLeoDefeated ? '#76ff03' : '#ff0054'};">${prog.evilLeoDefeated ? 'LIBERA 🏆' : 'OCCUPATA ⚠️'}</b></div>
              <div style="color:var(--gold); font-size:10px;">Partite vinte: <b>${prog.stagesCleared.length}/2</b></div>
            </div>
          </div>

          <div style="background:rgba(10,0,25,0.85); border:1px solid rgba(118,255,3,0.5); border-radius:6px; padding:5px 8px; font-size:11px; color:#fff; display:flex; justify-content:space-between; align-items:center;">
            <span>Boss della Cittadella: <b style="color:#ff0054;">Evil Leo (Benda sull'Occhio)</b></span>
            <span style="color:#76ff03; font-size:10px;">Fluido Portale 100%</span>
          </div>
        </div>
      </div>
    `;
  }

  function showHub() {
    if (window.setChapter) window.setChapter("Rick & Morty · La Cittadella dei Leo");
    const prog = getProgress();
    renderCitadelHubStage(prog);

    if (prog.evilLeoDefeated) {
      showText(
        "Leo Moretti C-137",
        `«Evil Leo è stato sconfitto sul campo ed esiliato nella dimensione dei tuberi parlanti! La Cittadella è libera e tutte le nostre varianti possono giocare senza catene!»`
      );
    } else {
      showText(
        "Rick-Nonna C-137",
        `«*Burp* Leo, ascoltami! Non fare quella faccia da triglia bollita! <b>Evil Leo</b> ha militarizzato la Cittadella e costringe tutti i Leo a giocare partite truccate per vendere i biglietti ai Gromflomiti!<br>
        Devi scendere in campo e giocare una <b>Vera Partita in Tempo Reale</b> (3 contro 3 con passaggi, scivolate, tiro caricato al massimo e finta acrobatiche)!<br>
        Se vinci, liberiamo il multiverso... Se perdi, ti trasformo in un cetriolo per sempre!»`
      );
    }

    const b = [];
    STAGES.forEach((s) => {
      const isWon = prog.stagesCleared.includes(s.id);
      b.push({
        label: `${isWon ? "✓" : "🧪"} Partita Reale: ${s.name}`,
        sub: `Partita vera (3v3 sul ${s.pitch}) · Contro ${s.captain}`,
        cls: isWon ? "" : "hot",
        fn: () => startBriefing(s)
      });
    });

    b.push(
      {
        label: "🌀 Monologo Esistenziale di Rick-Nonna sul Pesto Quantico",
        sub: "Perché il multiverso collasserà prima della fine del primo tempo",
        fn: showRickPhilosophy
      },
      {
        label: "◂ Torna al Menu Principale",
        cls: "pick",
        fn: () => {
          if (onExitCallback) onExitCallback();
          else if (window.title) window.title();
        }
      }
    );

    showButtons(b, true);
  }

  function showRickPhilosophy() {
    showText(
      "Rick-Nonna C-137",
      `«Vuoi la verità, Leo? Ci sono infinite versioni di te che hanno calciato sul palo, infinite versioni che hanno preso gol al 90° e infinite versioni che hanno aperto una pizzeria a Francoforte.<br>
      Nessuno esiste di proposito, nessuno appartiene a nessun posto, tutti giocheremo i tempi supplementari. Ora smettila di farti le pippe mentali, allacciati gli scarpini e vai a bucare la rete!»`
    );
    showButtons([{ label: "◂ Torna al Portale Dimensionale", fn: showHub }]);
  }

  function renderCitadelMatchPreviewStage(s) {
    const alt = activateCitadelStage();
    if (!alt) return;
    alt.innerHTML = `
      <div style="position:absolute; inset:0; background:radial-gradient(circle at 50% 50%, #1a0033 0%, #050010 100%); display:flex; flex-direction:column; justify-content:space-between; padding:10px; box-sizing:border-box;">
        <div style="text-align:center; font-family:var(--display); font-size:13px; color:#76ff03; text-shadow:0 0 8px #76ff03;">
          🧪 SCONTRO MULTIVERSALE DEL RETTANGOLO VERDE
        </div>
        <div style="display:flex; align-items:center; justify-content:space-around;">
          <div style="text-align:center;">
            <div style="font-size:30px;">🦅</div>
            <div style="color:#3fa7ff; font-weight:bold; font-size:12px;">RONDINE FC</div>
            <div style="color:#a2d2ff; font-size:10px;">Leo C-137 & Nico</div>
          </div>
          <div style="font-family:var(--display); font-size:20px; color:#76ff03; text-shadow:0 0 10px #76ff03;">VS</div>
          <div style="text-align:center;">
            <div style="font-size:30px;">🤖</div>
            <div style="color:#ff0054; font-weight:bold; font-size:12px;">${s.rival.toUpperCase()}</div>
            <div style="color:#f8edeb; font-size:10px;">${s.captain}</div>
          </div>
        </div>
        <div style="background:rgba(10,0,25,0.85); border:1px solid #76ff03; border-radius:6px; padding:3px 8px; font-size:10px; color:#fff; text-align:center;">
          Dimensione: <b>${s.pitch.toUpperCase()}</b> · Arbitro con fischietto tachionico!
        </div>
      </div>
    `;
  }

  // ================= 2. BRIEFING PRE-PARTITA =================
  function startBriefing(s) {
    renderCitadelMatchPreviewStage(s);
    showText(
      s.captain,
      `<i>«${s.dialoguePre}»</i><br>
      <b>I cloni della Cittadella sono schierati a centrocampo!</b>`
    );
    showButtons([
      {
        label: `⚽ FISCHIO D'INIZIO: GIOCA ORA! (3v3)`,
        sub: `Partita reale sul ${s.pitch} · Comandi completi`,
        cls: "hot",
        fn: () => launchActualMatch(s)
      },
      {
        label: "📜 Consulta Dossier e Analisi Tattica",
        sub: "Leggi le debolezze algoritmiche prima del fischio",
        fn: () => showCitadelLoreModal(s)
      },
      {
        label: "◂ Torna al Portale",
        fn: showHub
      }
    ], true);
  }

  function showCitadelLoreModal(s) {
    showText(
      s.captain,
      `<b>ANALISI TATTICA DIMENSIONALE: ${s.rival.toUpperCase()}</b><br>
      ${s.introLore}`
    );
    showButtons([
      {
        label: `⚽ Schiera la squadra e gioca subito! ▸`,
        cls: "hot",
        fn: () => launchActualMatch(s)
      },
      {
        label: "◂ Torna al Preview",
        fn: () => startBriefing(s)
      }
    ], true);
  }

  // ================= 3. PARTITA REALE IN TEMPO REALE =================
  function launchActualMatch(s) {
    if (!window.azStartSagaMatch) {
      if (window.toast) window.toast("Motore partita non pronto!", "error", "⚠️");
      showHub();
      return;
    }

    if (window.toast) window.toast(`🧪 FISCHIO D'INIZIO: RONDINE FC vs ${s.rival.toUpperCase()}!`, "success", "🌀");

    window.azStartSagaMatch(
      s.teamKey,
      {
        mode: "amic",
        pitch: s.pitch,
        diff: "norm",
        pu: true,
        roles: ["nico", "sandro", "dario"]
      },
      (myGoals, rivalGoals) => {
        handleCitadelResult(s, myGoals, rivalGoals);
      }
    );
  }

  // ================= 4. POST-PARTITA & LIBERAZIONE CITTADELLA =================
  function handleCitadelResult(s, myGoals, rivalGoals) {
    const won = myGoals > rivalGoals;
    const prog = getProgress();
    renderCitadelHubStage(prog);

    if (won) {
      if (!prog.stagesCleared.includes(s.id)) prog.stagesCleared.push(s.id);
      prog.dimensionJumps++;

      if (s.id === "evil_syndicate") {
        prog.evilLeoDefeated = true;
      }
      saveProgress(prog);
      if (window.addCoins) window.addCoins(50);

      playSynth(950, "sine", 0.45, 0.4);
      if (window.toast) window.toast(`✨ VITTORIA SUL CAMPO! ${myGoals} – ${rivalGoals}!`, "success", "🏆");

      if (s.id === "evil_syndicate") {
        showText(
          "Evil Leo (Benda sull'Occhio)",
          `<b style="color:var(--gold); font-size:14px;">TRIPLICE FISCHIO! EVIL LEO È STATO SCONFITTO! ${myGoals} – ${rivalGoals}!</b><br><br>
          «NOOO! Com'è possibile?! La mia equazione calcistica era matematicamente imbattibile!<br>
          Quel tiro... quell'effetto curvo all'incrocio... non proveniva dalla logica, ma dal cuore!<br>
          <i>La benda gli cade a terra mentre il generatore della Cittadella collassa...</i> Tutte le varianti di Leo Moretti sono finalmente libere!»`
        );
        showButtons([
          {
            label: "🏆 FESTEGGIA IL TRIONFO SUPREMO NEL MULTIVERSO!",
            cls: "hot",
            fn: showHub
          }
        ], true);
      } else {
        showText(
          s.captain,
          `<b style="color:var(--gold); font-size:14px;">VITTORIA PERFETTA! ${myGoals} – ${rivalGoals}!</b><br><br>
          «Errore di sistema... la Milizia è stata aggirata dal dinamismo di Borgo Marino!<br>
          Soggetto Leo C-137 promosso a livello d'allerta Alfa. La strada verso la torre di Evil Leo è spalancata!»`
        );
        showButtons([
          {
            label: "Avanza verso lo Scontro Finale con Evil Leo ▸",
            cls: "hot",
            fn: showHub
          }
        ], true);
      }
    } else if (myGoals === rivalGoals) {
      showText(
        s.captain,
        `<b style="color:#4cc9f0;">PARITÀ QUANTICA! ${myGoals} – ${rivalGoals}!</b><br><br>
        «La linea temporale è in stallo! Nessun vincitore, le probabilità sono al cinquanta per cento. Rientrate in campo per spezzare l'equilibrio!»`
      );
      showButtons([
        { label: "Rigoca il Match Subito! ▸", cls: "hot", fn: () => launchActualMatch(s) },
        { label: "◂ Torna all'Hub", fn: showHub }
      ], true);
    } else {
      showText(
        s.captain,
        `<b style="color:#ff0054;">SCONFITTA MULTIVERSALE: ${myGoals} – ${rivalGoals}!</b><br><br>
        «Liquidati! Non eravate abbastanza veloci per competere con i cloni della Cittadella! Tornate alla vostra dimensione di fritto e ricaricate le batterie!»`
      );
      showButtons([
        { label: "Rivincita Immediata sul Campo! ▸", cls: "hot", fn: () => launchActualMatch(s) },
        { label: "◂ Torna all'Hub", fn: showHub }
      ], true);
    }
  }

  window.openCitadelStoryMenu = openCitadelStoryMenu;
})();
