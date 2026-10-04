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

  function showHub() {
    if (window.closeAltStage) window.closeAltStage();
    if (window.setChapter) window.setChapter("Rick & Morty · La Cittadella dei Leo");
    const prog = getProgress();

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

  // ================= 2. BRIEFING PRE-PARTITA =================
  function startBriefing(s) {
    showText(
      s.captain,
      `<i>«${s.dialoguePre}»</i><br><br>
      <b>ANALISI TATTICA DIMENSIONALE:</b><br>
      ${s.introLore}`
    );
    showButtons([
      {
        label: `Scendi in Campo contro ${s.rival}! (FISCHIA L'ARBITRO MULTIVERSALE) ▸`,
        cls: "hot",
        fn: () => launchActualMatch(s)
      },
      {
        label: "◂ Torna al Menu",
        fn: showHub
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
