// ================= SAGA 3: FUTURAMA · LA LEGA GALATTICA DEL PIANETA EXPRESS (MATCH REALE + NARRATIVA SCI-FI) =================
// Combina:
// 1. VERO GAMEPLAY PARTITA: Partite reali in tempo reale contro gli alieni di Vergon 6, Omicron Persei 8 e l'All-Star Mecha di Bender
// 2. CYBER SHOP DI BENDER: Equipaggiamento e potenziamenti con i Crediti Stellari
// 3. NARRATIVA DI MATT GROENING: Dialoghi demenziali con Professor Farnsworth, Bender, Fry, Leela e Lrrr
(function () {
  const K_FUT = "ali-di-rondine.futurama-v3";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_FUT));
      if (d && typeof d === "object") {
        return {
          planetsCleared: Array.isArray(d.planetsCleared) ? d.planetsCleared : [],
          cyberCredits: typeof d.cyberCredits === "number" ? d.cyberCredits : 80,
          trophyPlanetExpress: !!d.trophyPlanetExpress
        };
      }
    } catch (e) {}
    return {
      planetsCleared: [],
      cyberCredits: 80,
      trophyPlanetExpress: false
    };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_FUT, JSON.stringify(p));
    } catch (e) {}
  }

  const MATCHES = [
    {
      id: "vergon",
      name: "Vergon 6: I Nibbloniani Selvaggi",
      rival: "Nibbloniani di Vergon 6",
      captain: "Lord Nibbler",
      teamKey: "vergon6",
      pitch: "sabbia",
      rewardCredits: 50,
      introLore: `«Vergon 6 è un pianeta sull'orlo del collasso gravitazionale! I Nibbloniani sono alti trenta centimetri ma hanno mascelle capaci di ingoiare un intero capodoglio.<br>
      In campo corrono a zig-zag tra crateri di zolfo: se lasciate la palla incustodita, se la mangiano letteralmente!»`,
      dialoguePre: `«*Goo-goo gaga!* (Traduzione dal visore di Leela: "Terrestri insensati! Credete che il vostro pallone di cuoio possa sfuggire alla nostra fame millenaria? Scendete in campo se volete diventare fertilizzante stellare!")»`
    },
    {
      id: "omicron",
      name: "Omicron Persei 8: L'Ira di Lrrr",
      rival: "Giganti di Omicron Persei 8",
      captain: "Lrrr ('SOVRANO DI OMICRON PERSEI 8!')",
      teamKey: "omicron8",
      pitch: "campo",
      rewardCredits: 70,
      introLore: `«Omicron Persei 8 dista mille anni luce dalla Terra. I suoi abitanti sono alti tre metri, verdi e permanentemente arrabbiati con i palinsesti televisivi terrestri.<br>
      Giocano un calcio brutale a base di cariche telluriche: quando scivolano sull'erba, lasciano solchi profondi mezzo metro!»`,
      dialoguePre: `«IO SONO LRRR, SOVRANO DEL PIANETA OMICRON PERSEI 8! QUESTO VOSTRO CONCETTO DI "CONTRASTO REGOLARE" CI OFFENDE E CI FA ARRABBIARE! PREPARATEVI A ESSERE SCHIACCIATI!»`
    },
    {
      id: "mecha_bender",
      name: "New New York 3000: Bender All-Stars",
      rival: "All-Star Mecha di Bender",
      captain: "Bender 'Titanio Lucido' Rodriguez",
      teamKey: "mecha_bender",
      pitch: "molo",
      rewardCredits: 100,
      introLore: `«La finale della Champions Galattica si gioca nello stadio orbitale di New New York! Bender ha corrotto gli arbitri robot, installato pistoni idraulici illegali e ingaggiato Don Bot della mafia robotica.<br>
      Se vinciamo, portiamo la Coppa del Mondo del 31° secolo a Borgo Marino!»`,
      dialoguePre: `«Ehi, sacchi di carne! Vi siete portati gli scarpini di ricambio? Perché i miei difensori al titanio vi strapperanno le zolle da sotto i piedi! E ricordate: mordete il mio lucido parastinchi metallico!»`
    }
  ];

  let onExitCallback = null;

  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#00f5d4; color:#0b092b; font-weight:900; letter-spacing:0.5px;">${who}</span><span class="t">${html}</span>`;
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

  // ================= 1. HUB DELLA LEGA GALATTICA =================
  function openFuturamaLeagueMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function showHub() {
    if (window.closeAltStage) window.closeAltStage();
    if (window.setChapter) window.setChapter("Futurama 3000 · Champions Galattica");
    const prog = getProgress();

    showText(
      "Prof. Farnsworth",
      `«<b>Buone notizie, ciurma!</b> Ho ipotecato la navetta Planet Express scommettendo sulla vittoria della Rondine FC nella Champions Galattica!<br>
      Vi aspettano tre match infernali: i voraci Nibbloniani di Vergon 6, i giganti incazzosi di Omicron Persei 8 e l'armata robotica illegale di Bender!<br>
      Le partite si giocano sul campo reale in tempo reale (3 contro 3 con passaggi, scivolate, tiro speciale caricato e finta). Se perdete, vi trasformerò in polvere per le mie provette!»`
    );

    const b = [];
    MATCHES.forEach(m => {
      const isWon = prog.planetsCleared.includes(m.id);
      b.push({
        label: `${isWon ? "✓" : "🚀"} Partita Reale: ${m.name}`,
        sub: `Partita vera (3v3 sul ${m.pitch}) · Capitano: ${m.captain} · Premio: +${m.rewardCredits} ⍟`,
        cls: isWon ? "" : "hot",
        fn: () => startSciFiMatchBriefing(m)
      });
    });

    b.push(
      {
        label: "🍺 Lezioni Tattiche di Bender & Fry al Bar Cosmico",
        sub: "Consigli strampalati su come imbrogliare gli arbitri alieni",
        fn: showBenderTactics
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

  function showBenderTactics() {
    showText(
      "Bender & Fry",
      `«Senti qua, Leo: io di calcio ne capisco poco, ma se c'è una cosa che so fare è corrompere i guardalinee con fusti di birra da quaranta litri!<br>
      <b>I SEGRETI DI BENDER:</b><br>
      1. Quando carichi il <b>Tiro</b> al massimo, la palla emette fiamme che arrostiscono i sensori ottici dei difensori.<br>
      2. Usa il tasto <b>Finta</b> quando Lrrr si lancia in scivolata: gli passerai sopra con una finta a sombrero mentre lui ara il prato con la faccia!»`
    );
    showButtons([{ label: "◂ Torna all'Hangar della Navetta", fn: showHub }]);
  }

  // ================= 2. BRIEFING PRE-PARTITA =================
  function startSciFiMatchBriefing(m) {
    showText(
      m.captain,
      `<i>«${m.dialoguePre}»</i><br><br>
      <b>DOSSIER DELLA SQUADRA:</b><br>
      ${m.introLore}`
    );
    showButtons([
      {
        label: `Scendi in Campo contro ${m.rival}! (FISCHIA L'ARBITRO ROBOT) ▸`,
        cls: "hot",
        fn: () => launchActualMatch(m)
      },
      {
        label: "◂ Torna all'Hangar",
        fn: showHub
      }
    ], true);
  }

  // ================= 3. PARTITA REALE IN TEMPO REALE =================
  function launchActualMatch(m) {
    if (!window.azStartSagaMatch) {
      if (window.toast) window.toast("Motore di gioco non pronto!", "error", "⚠️");
      showHub();
      return;
    }

    if (window.toast) window.toast(`🚀 FISCHIO D'INIZIO: RONDINE FC vs ${m.rival.toUpperCase()}!`, "success", "🛸");

    window.azStartSagaMatch(
      m.teamKey,
      {
        mode: "amic",
        pitch: m.pitch,
        diff: "norm",
        pu: true,
        roles: ["nico", "sandro", "dario"]
      },
      (myGoals, rivalGoals) => {
        handleSciFiResult(m, myGoals, rivalGoals);
      }
    );
  }

  // ================= 4. POST-PARTITA & CREDITI GALATTICI =================
  function handleSciFiResult(m, myGoals, rivalGoals) {
    const won = myGoals > rivalGoals;
    const prog = getProgress();

    if (won) {
      if (!prog.planetsCleared.includes(m.id)) prog.planetsCleared.push(m.id);
      prog.cyberCredits += m.rewardCredits;
      if (prog.planetsCleared.length >= MATCHES.length) {
        prog.trophyPlanetExpress = true;
      }
      saveProgress(prog);
      if (window.addCoins) window.addCoins(40);

      playSynth(980, "sine", 0.45, 0.4);
      if (window.toast) window.toast(`🛸 VITTORIA GALATTICA! ${myGoals} – ${rivalGoals}!`, "success", "🌟");

      showText(
        "Prof. Farnsworth",
        `<b style="color:var(--gold); font-size:14px;">TRIPLICE FISCHIO! RONDINE FC ${myGoals} – ${rivalGoals} ${m.rival.toUpperCase()}!</b><br><br>
        «Incredibile! Hanno vinto davvero! Fry, chiudi quel barattolo di materia oscura che non serve più suicidarci!<br>
        Ragazzi di Borgo Marino, avete incassato ${m.rewardCredits} crediti stellari e il rispetto eterno della Federazione Galattica!»`
      );

      showButtons([
        {
          label: prog.planetsCleared.length < MATCHES.length ? "Avanza al Prossimo Pianeta ▸" : "🏆 RITIRA IL TROFEO DEL PIANETA EXPRESS 3000!",
          cls: "hot",
          fn: showHub
        },
        {
          label: "Bevi una birra con Bender al bar di bordo 🍺",
          fn: () => {
            if (window.toast) window.toast("Bender: «Non male per dei bipedi senza titanio!»", "info", "🤖");
            showHub();
          }
        }
      ], true);
    } else if (myGoals === rivalGoals) {
      showText(
        "Leela",
        `<b style="color:#4cc9f0;">PAREGGIO SPAZIALE! ${myGoals} – ${rivalGoals}!</b><br><br>
        «Abbiamo lottato come leoni contro ${m.rival}! Il portiere alieno ha fatto i miracoli, ma se aggiustiamo la mira sul secondo palo ce li mangiamo a colazione! Ricarichiamo gli scarpini e rigiochiamola!»`
      );
      showButtons([
        { label: "Rigoca Subito il Match! ▸", cls: "hot", fn: () => launchActualMatch(m) },
        { label: "◂ Torna all'Hangar", fn: showHub }
      ], true);
    } else {
      showText(
        m.captain,
        `<b style="color:#ff0054;">SCONFITTA SPAZIALE: ${myGoals} – ${rivalGoals}!</b><br><br>
        «AVETE PERSO! QUESTO CONCETTO DI VITTORIA CI DELIZIA E CI FA BALLARE! Tornate sulla Terra a mangiare la vostra focaccia primordiale!»`
      );
      showButtons([
        { label: "Rivincita Immediata sul Campo! ▸", cls: "hot", fn: () => launchActualMatch(m) },
        { label: "◂ Torna all'Hangar", fn: showHub }
      ], true);
    }
  }

  window.openFuturamaLeagueMenu = openFuturamaLeagueMenu;
})();
