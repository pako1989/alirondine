// ================= SAGA 2: GAME OF THRONES · LA GUERRA DEI CINQUE TRABUCCHI (MATCH REALE + NARRATIVA DARK) =================
// Combina:
// 1. VERO GAMEPLAY PARTITA: Partite reali in tempo reale con Calcio d'Azione contro le Casate rivali e l'Esercito del Re della Notte
// 2. GESTIONE TATTICA & MAPPA: Conquista dei 5 feudi, rifornimenti di pesto, oro delle decime e avanzata dell'Inverno
// 3. NARRATIVA MARTINIANA: Corvi messaggeri, alleanze treacherous, monologhi di potere e il Trono di Focaccia
(function () {
  const K_GOT = "ali-di-rondine.thrones-v3";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_GOT));
      if (d && typeof d === "object") {
        return {
          conquered: Array.isArray(d.conquered) ? d.conquered : ["rondine"],
          gold: typeof d.gold === "number" ? d.gold : 150,
          pesto: typeof d.pesto === "number" ? d.pesto : 100,
          morale: typeof d.morale === "number" ? d.morale : 90,
          winterMeter: typeof d.winterMeter === "number" ? d.winterMeter : 10,
          wonIronFocaccia: !!d.wonIronFocaccia
        };
      }
    } catch (e) {}
    return {
      conquered: ["rondine"],
      gold: 150,
      pesto: 100,
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
      id: "lanterna",
      name: "Casata Ruggeri",
      seat: "Fortezza della Lanterna",
      sigil: "🏮 Faro nella Tempesta",
      motto: "Noi Non Passiamo",
      teamKey: "lanterna_got",
      pitch: "molo",
      leader: "Ser Ruggeri il Mastino",
      rewardGold: 60,
      introLore: `«Lord Leo! I Ruggeri custodiscono la roccia della Lanterna da nove generazioni. I loro difensori giocano con corazze pesanti di cuoio bollito e non lasciano un solo centimetro sul molo.<br>
      Ser Ruggeri ha arruolato i balestrieri della falesia: chiunque provi a crossare al centro viene intercettato da una selva di gambe d'acciaio!»`,
      dialoguePre: `«Vedo che la Rondine osa spingersi fin sotto i miei bastioni. Qui non siamo in campionato: il mare sbatte contro gli scogli e se sbagli un passaggio finisci nell'abisso! Vediamo se i tuoi ricami reggono il ferro di Ser Ruggeri!»`
    },
    {
      id: "ferri",
      name: "Casata Ferri",
      seat: "Castel Forno",
      sigil: "🥖 Teglia d'Oro",
      motto: "Caldi e Croccanti",
      teamKey: "ferri_got",
      pitch: "campo",
      leader: "Lady Nonna Ferri",
      rewardGold: 75,
      introLore: `«Castel Forno è la cassaforte del regno: qui riposano i sacchi di grano saraceno e le giare dell'olio nobile.<br>
      Lady Nonna governa con il mestolo di ferro e il sorriso accogliente: "Un uomo a pancia piena non pensa a farsi ammazzare... ma se tocca la mia farina, gli scaglio addosso cento teglie roventi!"»`,
      dialoguePre: `«Leo, amore di nonna! Lo sai che ti voglio bene, ma gli affari della Casata vengono prima dei sentimenti! I miei attaccanti sono cresciuti a panissa e pesto concentrato: corrono il doppio dei tuoi!»`
    },
    {
      id: "baciccia",
      name: "Casata Baciccia",
      seat: "Porto Trabucco",
      sigil: "⚓ Rete di Cuoio",
      motto: "Reti e Tempesta",
      teamKey: "baciccia_got",
      pitch: "sabbia",
      leader: "Sire Baciccia il Vecchio",
      rewardGold: 90,
      introLore: `«Porto Trabucco sorge su mille palafitte di rovere piantate nel fondale marino. Sire Baciccia ha novant'anni e non ha mai piegato la schiena davanti a nessun duca.<br>
      La loro squadra gioca con il vento in poppa: scivolate rasoterra tra la battigia e tiri a effetto che sfruttano le raffiche del libeccio!»`,
      dialoguePre: `«Ragazzetto di paese! Ho visto imperi crollare e mari prosciugarsi. Il Trabucco appartiene ai Baciccia da quando il mare era solo pioggia! Se vuoi il mio rispetto, devi strapparmelo con tre gol sul bagnasciuga!»`
    },
    {
      id: "night_king",
      name: "L'Armata della Notte",
      seat: "La Barriera di Ghiaccio",
      sigil: "❄️ Teschio Gelido",
      motto: "L'Inverno è Qui",
      teamKey: "night_king",
      pitch: "erba",
      leader: "Il Re della Notte",
      rewardGold: 150,
      introLore: `«I corvi neri tacciono, l'acqua del porto si è tramutata in una lastra di ghiaccio perenne. Il Re della Notte scende dalle montagne con i non-morti della bufera.<br>
      Non sentono il dolore, non si stancano mai e il loro sguardo azzurro gela la palla ad ogni tocco. È la battaglia finale per il Trono di Focaccia e per la vita stessa di Borgo Marino!»`,
      dialoguePre: `«<i>...Il gelo consuma ogni speranza. Non esistono tattiche o passaggi di prima nella tomba del ghiaccio eterno. Il vostro regno si spegnerà qui.</i>»`
    }
  ];

  let onExitCallback = null;

  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#590d22; color:#ffb703; font-weight:800; border:1px solid #ffb703; letter-spacing:0.5px;">${who}</span><span class="t">${html}</span>`;
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

  // ================= 1. HUB CONSIGLIO DI GUERRA =================
  function openThronesWarMenu(onBack) {
    onExitCallback = onBack;
    showWarCouncil();
  }

  function showWarCouncil() {
    if (window.closeAltStage) window.closeAltStage();
    if (window.setChapter) window.setChapter("Westeros Ligure · La Guerra dei Cinque Trabucchi");
    const prog = getProgress();

    const unscaled = HOUSES.filter(h => !prog.conquered.includes(h.id));

    if (unscaled.length === 0 && !prog.wonIronFocaccia) {
      // Re della Notte pronto
      const boss = HOUSES.find(h => h.id === "night_king");
      showText(
        "Maestro del Consiglio",
        `«Lord Leo! Tutte le fortezze della costa hanno piegato il ginocchio alla Casata Moretti! Ma dalle vette innevate scende l'Inverno Eterno: il <b>Re della Notte</b> marcia con l'armata dei Trabucchi Spettrali!<br>
        La partita della vita si gioca sul ghiaccio della Barriera: se vinciamo, il <b>Trono di Focaccia</b> sarà nostro per sempre!»`
      );
      showButtons([
        {
          label: "👑 SCENDI IN CAMPO CONTRO IL RE DELLA NOTTE (PARTITA FINALE)",
          sub: "Partita decisiva per il destino di Westeros e del Golfo!",
          cls: "hot",
          fn: () => startSiegeMatchBriefing(boss)
        },
        {
          label: "◂ Torna al Menu Principale",
          fn: () => { if (onExitCallback) onExitCallback(); else if (window.title) window.title(); }
        }
      ], true);
      return;
    }

    if (prog.wonIronFocaccia) {
      showText(
        "Lord Leo Moretti (Re del Golfo)",
        `«La costa è pacificata, l'inverno è stato scacciato dal calore del nostro gioco e il Trono di Focaccia è saldamente nelle mani della Rondine FC!»`
      );
    } else {
      showText(
        "Primo Cavaliere del Porto",
        `«Mio Signore, controlliamo ${prog.conquered.length}/5 feudi. Abbiamo ${prog.gold} monete d'oro e ${prog.pesto} barili di pesto nelle dispense.<br>
        Le casate rivali non cederanno i loro trabucchi con le buone parole: dobbiamo sfidarle in campo aperto in una <b>Vera Partita in Tempo Reale</b> (Calcio d'Azione Pro con passaggi, scivolate, tiro caricato e finta)!»`
      );
    }

    const b = [];
    unscaled.forEach(h => {
      b.push({
        label: `⚔️ Scendi in Campo contro ${h.name} (${h.seat})`,
        sub: `Partita reale sul ${h.pitch} · Comandante: ${h.leader} · Premio: +${h.rewardGold} oro`,
        cls: "hot",
        fn: () => startSiegeMatchBriefing(h)
      });
    });

    b.push(
      {
        label: "🥖 Distribuisci Focaccia alle Truppe (-30 Oro -> +40 Pesto, +20 Morale)",
        sub: "Evita carestie e malcontento nella guarnigione",
        disabled: prog.gold < 30,
        fn: () => {
          prog.gold -= 30;
          prog.pesto += 40;
          prog.morale = Math.min(100, prog.morale + 20);
          saveProgress(prog);
          playSynth(520, "sine", 0.25, 0.25);
          if (window.toast) window.toast("Viveri distribuiti alle truppe!", "success", "🥖");
          showWarCouncil();
        }
      },
      {
        label: "📜 Lettere dei Corvi & Motti delle Casate",
        sub: "Leggi i segreti e le minacce intercettate",
        fn: showLore
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

  function showLore() {
    showText(
      "Archivio dei Corvi",
      `«<b>I MOTTI E GLI STEMMI DELLE GRANDI CASATE:</b><br>
      • <b>Casata Moretti</b>: <i>"Il Calcio sta Arrivando"</i> (Rondine Alata)<br>
      • <b>Casata Ruggeri</b>: <i>"Noi Non Passiamo"</i> (Faro nella Tempesta)<br>
      • <b>Casata Ferri</b>: <i>"Caldi e Croccanti"</i> (Teglia d'Oro)<br>
      • <b>Casata Baciccia</b>: <i>"Reti e Tempesta"</i> (Rete di Cuoio)<br>
      • <b>Casata dei Corsari</b>: <i>"Ciò che affonda non muore"</i> (Sciabola di Mare)»`
    );
    showButtons([{ label: "◂ Torna al Consiglio di Guerra", fn: showWarCouncil }]);
  }

  // ================= 2. BRIEFING NARRATIVO PRE-PARTITA =================
  function startSiegeMatchBriefing(house) {
    showText(
      house.leader,
      `<i>«${house.dialoguePre}»</i><br><br>
      <b>DOSSIER DELLA FORTEZZA:</b><br>
      ${house.introLore}`
    );
    showButtons([
      {
        label: `Schiera la Rondine FC sul campo di ${house.seat}! (FISCHIA L'ARBITRO) ▸`,
        cls: "hot",
        fn: () => launchSiegeMatch(house)
      },
      {
        label: "◂ Torna al Consiglio di Guerra",
        fn: showWarCouncil
      }
    ], true);
  }

  // ================= 3. PARTITA REALE IN TEMPO REALE SUL CAMPO =================
  function launchSiegeMatch(house) {
    if (!window.azStartSagaMatch) {
      if (window.toast) window.toast("Motore di gioco non pronto!", "error", "⚠️");
      showWarCouncil();
      return;
    }

    if (window.toast) window.toast(`⚔️ ASSEDIO SUL CAMPO: RONDINE FC vs ${house.name.toUpperCase()}!`, "success", "🏰");

    window.azStartSagaMatch(
      house.teamKey,
      {
        mode: "amic",
        pitch: house.pitch,
        diff: "norm",
        pu: true,
        roles: ["nico", "sandro", "dario"]
      },
      (myGoals, rivalGoals) => {
        handleSiegeResult(house, myGoals, rivalGoals);
      }
    );
  }

  // ================= 4. POST-PARTITA & CONQUISTA DEL FEUDO =================
  function handleSiegeResult(house, myGoals, rivalGoals) {
    const won = myGoals > rivalGoals;
    const prog = getProgress();

    if (won) {
      if (!prog.conquered.includes(house.id)) prog.conquered.push(house.id);
      prog.gold += house.rewardGold;
      prog.winterMeter = Math.min(100, prog.winterMeter + 18);
      prog.morale = Math.min(100, prog.morale + 15);

      if (house.id === "night_king") {
        prog.wonIronFocaccia = true;
      }
      saveProgress(prog);
      if (window.addCoins) window.addCoins(50);

      playSynth(950, "sine", 0.45, 0.4);
      if (window.toast) window.toast(`👑 ${house.seat.toUpperCase()} È CADUTO! (${myGoals} – ${rivalGoals})`, "success", "🏆");

      if (house.id === "night_king") {
        showText(
          "Il Re della Notte",
          `<b style="color:var(--gold); font-size:14px;">TRIPLICE FISCHIO! LA NOTTE ETERNA È SCONFITTA! ${myGoals} – ${rivalGoals}!</b><br><br>
          «<i>Il gelo si frantuma... il fuoco della focaccia e la passione del popolo ligure hanno sciolto la Barriera!</i> Il Trono di Focaccia è vostro, Lord Leo!»`
        );
        showButtons([
          {
            label: "🏆 SALI SUL TRONO DI FOCACCIA DELLE CINQUE CASATE!",
            cls: "hot",
            fn: showWarCouncil
          }
        ], true);
      } else {
        showText(
          house.leader,
          `<b style="color:var(--gold); font-size:14px;">VITTORIA TOTALE! ${myGoals} – ${rivalGoals}! ${house.seat.toUpperCase()} È VOSTRO!</b><br><br>
          «Ammainate i nostri stendardi! I vostri attaccanti hanno spaccato la nostra difesa come burro caldo!<br>
          Lord Leo Moretti, vi consegniamo le chiavi del feudo e ${house.rewardGold} monete d'oro. I nostri guerrieri giurano fedeltà alla Rondine Alata!»`
        );
        showButtons([
          {
            label: "Ritorna trionfante al Consiglio di Guerra ▸",
            cls: "hot",
            fn: showWarCouncil
          }
        ], true);
      }
    } else if (myGoals === rivalGoals) {
      showText(
        house.leader,
        `<b style="color:#4cc9f0;">PAREGGIO! ${myGoals} – ${rivalGoals}!</b><br><br>
        «I nostri bastioni hanno retto l'assalto, ma avete dimostrato valore eccezionale! L'assedio continua: riorganizzate le truppe e tornate a sfidarci se ne avete il coraggio!»`
      );
      showButtons([
        { label: "Ripeti l'Assalto sul Campo ▸", cls: "hot", fn: () => launchSiegeMatch(house) },
        { label: "◂ Torna al Consiglio", fn: showWarCouncil }
      ], true);
    } else {
      showText(
        house.leader,
        `<b style="color:#ff0054;">DISFATTA SUL CAMPO! ${myGoals} – ${rivalGoals}!</b><br><br>
        «La vostra armata è stata respinta con perdite pesanti! Tornate a leccarvi le ferite al Trabucco prima che la marea vi sommerga!»`
      );
      showButtons([
        { label: "Riprova l'Assalto ▸", cls: "hot", fn: () => launchSiegeMatch(house) },
        { label: "◂ Ritirata al Consiglio", fn: showWarCouncil }
      ], true);
    }
  }

  window.openThronesWarMenu = openThronesWarMenu;
})();
