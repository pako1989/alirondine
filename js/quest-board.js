/**
 * Ali di Rondine - Quest Board del Borgo (Piazza Centrale)
 * Sistema dinamico di missioni secondarie per sviluppo personaggi e reclutamento Rondine FC.
 */
(() => {
  "use strict";

  const STORAGE_KEY = "ali-di-rondine.questboard";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Gestione stato locale delle quest
  function loadQuestState() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return data && typeof data === "object" ? data : { active: {}, completed: {} };
    } catch {
      return { active: {}, completed: {} };
    }
  }

  function saveQuestState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  // Restituisce la stagione corrente della storia
  function getCurrentSeason() {
    try {
      if (typeof window.prog === "function") {
        const p = window.prog();
        return Math.max(1, p.season || p.n || 1);
      }
    } catch {}
    return 1;
  }

  // Database delle missioni dinamiche suddivise per Stagioni e Categorie
  const QUEST_DEFS = [
    // ==========================================
    // STAGIONE 1: LE RADICI DEL BORGO
    // ==========================================
    {
      id: "q1_nico_glove",
      season: 1,
      cat: "pg",
      catName: "Sviluppo Personaggio",
      icon: "🧤",
      targetChar: "nico",
      title: "La Presa del Gatto di Nico",
      sub: "Aiuta Nico a superare l'esitazione sulle uscite basse",
      desc: "Nico si allena sulla scogliera tra gli scogli aguzzi: ha paura delle uscite basse sui ciottoli bagnati. Parlagli al campetto o sul molo per fargli ritrovare il coraggio da saracinesca.",
      objective: "Parla con Nico al campetto e aiutalo con l'allenamento delle uscite basse.",
      coins: 20,
      rewardText: "+20 Monete · Affinità Nico +10 · Talento «Presa d'Acciaio»",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q1_nico_glove_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Nico ha sbloccato la Presa d'Acciaio!", "success", "🧤");
      }
    },
    {
      id: "q1_tommy_traiettoria",
      season: 1,
      cat: "pg",
      catName: "Sviluppo Personaggio",
      icon: "🎯",
      targetChar: "tommy",
      title: "La Traiettoria Perfetta di Tommy",
      sub: "Insegna a Tommy il valore dell'uno-due col compagno",
      desc: "Tommy passa ore a tirare col compasso contro la saracinesca del porto, convinto che il calcio sia solo estetica individuale. Dimostragli l'intesa con un'azione di squadra!",
      objective: "Parla con Tommy al porto e insegnagli l'azione corale con l'uno-due.",
      coins: 20,
      rewardText: "+20 Monete · Intesa Squadra +5 · Carta Speciale Tommy nell'Album",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q1_tommy_traiettoria_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Intesa Tommy potenziata! Nuova carta nell'Album.", "success", "⚽");
      }
    },
    {
      id: "q1_rec_mattia",
      season: 1,
      cat: "rec",
      catName: "Reclutamento",
      icon: "🛡️",
      targetChar: "pietrino",
      title: "Reclutamento: Mattia la Saracinesca",
      sub: "Ingaggia il portierone dei ragazzini della scuola",
      desc: "Mattia mangia focaccia tra un palo e l'altro, ma quando parte il tiro non fa passare uno spillo. Se batti la sua difesa dal dischetto parlando con Pietrino, accetterà di entrare nella Primavera della Rondine!",
      objective: "Parla con Pietrino al campetto e supera la sfida dal dischetto con Mattia.",
      coins: 25,
      recruitId: "mattia",
      recruitName: "Mattia la Saracinesca (Portiere)",
      rewardText: "Recluta Mattia nel Roster Rondine FC · +25 Monete",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q1_rec_mattia_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Mattia la Saracinesca è entrato nel Rondine FC!", "success", "🧤");
      }
    },
    {
      id: "q1_rita_spezie",
      season: 1,
      cat: "storia",
      catName: "Incarico del Borgo",
      icon: "🥪",
      targetChar: "rita",
      title: "La Focaccia della Vigilia",
      sub: "Recupera il rosmarino selvatico per la teglia di Rita",
      desc: "Rita vuole preparare la focaccia portafortuna prima della prossima sfida della Rondine. Ha bisogno del rosmarino selvatico che cresce sulla scogliera e dell'olio buono di Papà.",
      objective: "Parla con Rita in cucina nella Trattoria Moretti e aiuta con la teglia.",
      coins: 20,
      rewardText: "+2 Focacce Calde per la squadra · +20 Monete",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q1_rita_spezie_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("+2 Focacce Calde aggiunte all'inventario!", "success", "🥪");
      }
    },

    // ==========================================
    // STAGIONE 2: LA RIVIERA & I RIVALI DELLA COSTA
    // ==========================================
    {
      id: "q2_rec_kevin",
      season: 2,
      cat: "rec",
      catName: "Reclutamento",
      icon: "🏖️",
      targetChar: "gigi",
      title: "Reclutamento: Kevin del Pedalò",
      sub: "Ingaggia l'ala velocista delle spiagge dello Scoglio",
      desc: "Kevin corre a piedi nudi sulla battigia più veloce del vento e si allena trainando i pedalò. Dimostragli che il Rondine FC sa correre e lottare sulla sabbia parlando con Gigi allo Scoglio!",
      objective: "Parla con Gigi allo Scoglio e supera il test di velocità sulla sabbia con Kevin.",
      coins: 30,
      recruitId: "kevin",
      recruitName: "Kevin del Pedalò (Ala Destra)",
      rewardText: "Recluta Kevin nel Rondine FC · +30 Monete",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q2_rec_kevin_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Kevin del Pedalò è un nuovo giocatore della Rondine!", "success", "⚡");
      }
    },
    {
      id: "q2_sara_dati",
      season: 2,
      cat: "pg",
      catName: "Sviluppo Personaggio",
      icon: "📓",
      targetChar: "sara",
      title: "Il Grande Taccuino Tattico di Sara",
      sub: "Raccogli informazioni sui punti deboli della Riviera",
      desc: "Sara sta mappando i movimenti delle difese avversarie. Per completare il suo dossier ha bisogno dell'esperienza da attaccante di Leo sui tagli e sui calci piazzati.",
      objective: "Parla con Sara in paese per completare l'analisi dei punti deboli.",
      coins: 25,
      rewardText: "+25 Monete · Report Tattico Pre-Partita potenziato",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q2_sara_dati_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Sara ha completato l'analisi tattica della costa!", "success", "📊");
      }
    },
    {
      id: "q2_gigi_sciarpa",
      season: 2,
      cat: "pg",
      catName: "Sviluppo Personaggio",
      icon: "🧣",
      targetChar: "gigi",
      title: "La Sciarpa Benedetta di Gigi",
      sub: "Recupera i fili di lana portafortuna dispersi dal vento",
      desc: "Una folata di libeccio ha fatto volare la sciarpa storica di Gigi verso la spiaggia dello Scoglio. Senza quella sciarpa, Gigi giura che la Rondine prenderà gol a ogni cross!",
      objective: "Parla con Gigi allo Scoglio per restituirgli la sciarpa recuperata dal molo.",
      coins: 25,
      rewardText: "+25 Monete · Grinta Iniziale Squadra +1",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q2_gigi_sciarpa_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Sciarpa ritrovata! Grinta iniziale aumentata.", "success", "🧣");
      }
    },

    // ==========================================
    // STAGIONE 3: CAMPIONATI REGIONALI & LA ROCCIA
    // ==========================================
    {
      id: "q3_rec_saverio",
      season: 3,
      cat: "rec",
      catName: "Reclutamento",
      icon: "🦀",
      targetChar: "rocco",
      title: "Reclutamento: Saverio Cozza",
      sub: "Convinci lo stopper roccioso di Punta Nera a cambiare maglia",
      desc: "Saverio Cozza è stanco delle scorrettezze di Scafati. Cerca un club vero dove si giochi duro ma con onore. Parla con Rocco Scafati al campo per concordare il passaggio di Saverio al Rondine FC!",
      objective: "Parla con Rocco Scafati al campo e accogli Saverio Cozza nel club.",
      coins: 35,
      recruitId: "saverio",
      recruitName: "Saverio Cozza (Difensore Centrale)",
      rewardText: "Recluta Saverio Cozza nel Rondine FC · +35 Monete",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q3_rec_saverio_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Saverio Cozza firma per la Rondine! Muro difensivo potenziato.", "success", "🧱");
      }
    },
    {
      id: "q3_tonio_trabucchi",
      season: 3,
      cat: "storia",
      catName: "Incarico del Borgo",
      icon: "🪵",
      targetChar: "tonino",
      title: "La Prova dei Trabucchi",
      sub: "Domina la gabbia in ferro battuto di Mastro Tonio",
      desc: "Sulla scogliera alta, Mastro Tonio ha terminato la nuova Gabbia 3v3 da strada. Vuole vedere se Leo sa far rimbalzare il pallone sui montanti di quercia come faceva papà Enzo negli anni '70.",
      objective: "Parla con Tonino al chiosco o affronta una sfida nella gabbia street.",
      coins: 40,
      rewardText: "+40 Monete · Maglia Storica Trabucchi '74",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q3_tonio_trabucchi_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Mastro Tonio approva: Prova dei Trabucchi superata!", "success", "🪵");
      }
    },
    {
      id: "q3_rec_pietrino",
      season: 3,
      cat: "rec",
      catName: "Reclutamento",
      icon: "👟",
      targetChar: "pietrino",
      title: "Reclutamento: Pietrino il Fantasista",
      sub: "Promuovi Pietrino dai caruggi alla prima squadra",
      desc: "Pietrino è cresciuto: ormai semina il panico tra le panchine della piazza e calcia con entrambi i piedi. Parlagli in piazza per consegnargli gli scarpini ufficiali del Rondine FC.",
      objective: "Incontra Pietrino in Piazza e dagli la maglia della Prima Squadra.",
      coins: 35,
      recruitId: "pietrino",
      recruitName: "Pietrino (Trequartista Fantasista)",
      rewardText: "Recluta Pietrino nel Rondine FC · +35 Monete",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q3_rec_pietrino_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Pietrino è un giocatore ufficiale del Rondine FC!", "success", "⭐");
      }
    },

    // ==========================================
    // STAGIONE 4+: SERIE A, FRATELLI MORETTI & MULTIVERSO
    // ==========================================
    {
      id: "q4_dario_doppia",
      season: 4,
      cat: "pg",
      catName: "Sviluppo Personaggio",
      icon: "🔥",
      targetChar: "dario",
      title: "Fratelli d'Attacco: La Doppia Rondine",
      sub: "Perfeziona la mossa combinata leggendaria dei fratelli Moretti",
      desc: "Dario e Leo si ritrovano sul campo della costa al tramonto: l'intesa è nell'aria. Sferra la Doppia Rondine con Dario per sbloccare la versione definitiva della mossa combinata!",
      objective: "Parla con Dario nel Borgo ed esegui la sessione di tiro combinato.",
      coins: 50,
      rewardText: "+50 Monete · Mossa «Doppia Rondine dei Fratelli» potenziata al massimo!",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q4_dario_doppia_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("🔥 Doppia Rondine perfezionata al massimo livello!", "success", "⚡");
      }
    },
    {
      id: "q4_rec_mirko",
      season: 4,
      cat: "rec",
      catName: "Reclutamento",
      icon: "🧢",
      targetChar: "pina",
      title: "Reclutamento: Mirko dei Caruggi",
      sub: "Ingaggia il fantasista di Genova con la coppola del nonno",
      desc: "Mirko ha incantato i vicoli di Genova con i suoi tiri d'esterno sulle serrande. Chiedi a Pina notizie dal Corriere di Genova per contattarlo e tesserarlo nel Rondine FC.",
      objective: "Parla con Pina all'edicola per perfezionare il tesseramento di Mirko.",
      coins: 45,
      recruitId: "mirko",
      recruitName: "Mirko dei Caruggi (Mezzala Dribblatore)",
      rewardText: "Recluta Mirko nel Rondine FC · +45 Monete",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q4_rec_mirko_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("Mirko dei Caruggi entra nel Rondine FC!", "success", "🧢");
      }
    },
    {
      id: "q4_paradosso_orologio",
      season: 4,
      cat: "storia",
      catName: "Incarico Multiverso",
      icon: "🌀",
      targetChar: "aurelio",
      title: "L'Eco del Borgo Storto",
      sub: "Sconfiggi l'Arbitro del Paradosso e ferma il tempo",
      desc: "Un rintocco strano risuona dal campanile: don Aurelio ha avvistato una distorsione temporale tra le campane. Parla con don Aurelio in piazza per sigillare l'orologio cosmico!",
      objective: "Parla con don Aurelio in Piazza San Pietro per sigillare la fenditura.",
      coins: 80,
      rewardText: "+80 Monete · Pallone Ossidiana Fluttuante · Trofeo Cosmico",
      checkReady: (prog, B, state) => {
        return !!(state && state.active && state.active["q4_paradosso_orologio_done"]);
      },
      onComplete: () => {
        if (window.toast) window.toast("🏆 Paradosso fermato! Trofeo Multiversale ottenuto!", "success", "🌀");
      }
    }
  ];

  // Restituisce true se l'NPC ha una missione attiva o da riscuotere
  function questBoardNpcHasNews(npcId) {
    const curSeason = getCurrentSeason();
    const state = loadQuestState();
    const quest = QUEST_DEFS.find(q => q.targetChar === npcId && q.season <= curSeason && state.active[q.id] && !state.completed[q.id]);
    return !!quest;
  }
  window.questBoardNpcHasNews = questBoardNpcHasNews;

  // Verifica se ci sono quest nuove o completabili per la bacheca
  function questBoardHasNews() {
    const curSeason = getCurrentSeason();
    const state = loadQuestState();
    const B = typeof window.borgoLoad === "function" ? window.borgoLoad() : (window.B || null);
    const p = typeof window.prog === "function" ? window.prog() : null;

    for (const q of QUEST_DEFS) {
      if (q.season > curSeason) continue;
      if (state.completed[q.id]) continue;
      if (state.active[q.id]) {
        if (q.checkReady && q.checkReady(p, B, state)) return true;
      } else {
        return true;
      }
    }
    return false;
  }
  window.questBoardHasNews = questBoardHasNews;

  // Interazione dialoghi specifici per NPC legati a missioni attive
  function questBoardTalk(npcId, bSay, bAsk, BL, borgoResume) {
    const curSeason = getCurrentSeason();
    const state = loadQuestState();
    const activeQuest = QUEST_DEFS.find(q => q.targetChar === npcId && q.season <= curSeason && state.active[q.id] && !state.completed[q.id]);

    if (!activeQuest) return false;

    const isAlreadyDone = !!state.active[activeQuest.id + "_done"];

    // Se l'obiettivo è già stato completato nel dialogo precedente ma non ancora riscosso in bacheca
    if (isAlreadyDone) {
      bAsk(npcId, `«Leo! Abbiamo già fatto tutto per l'incarico: «${activeQuest.title}». Corri alla Bacheca in Piazza San Pietro a riscuotere la tua ricompensa!»`, [
        { label: "📋 Apri Bacheca Incarichi", cls: "hot", go: () => openQuestBoard(borgoResume) },
        { label: "◂ Torna a esplorare", go: borgoResume }
      ]);
      return true;
    }

    // Gestione interattiva specifica per ciascun incarico
    if (activeQuest.id === "q1_nico_glove") {
      bAsk("nico", "«Leo! Meno male che sei qui! Hai visto il mio annuncio in bacheca? Sulle uscite basse ho ancora il terrore di spaccarmi le ginocchia sui ciottoli bagnati. Nessuno mi capisce: dicono tutti che un portiere deve buttarsi e basta. Tirami tre volte dal limite, rasoterra, così imparo a non chiudere gli occhi!»", [
        {
          label: "Tiro radente e teso sul palo destro",
          sub: "Colpo da biliardo a pelo d'erba",
          cls: "hot",
          fx: () => {
            state.active["q1_nico_glove_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Nico compie una parata miracolosa in tuffo!", "success", "🧤");
          },
          lines: [
            BL("nico", "TIENI DURO GATTO! (Nico si tuffa a pelo dei sassi bagnati, blocca il pallone al millimetro e rotola ridendo)"),
            BL("nico", "L'HO PRESA! L'HO PRESA! Senti i guanti: fumano! Adesso non ho più paura delle uscite basse! Leo, sei il capitano migliore del mondo!"),
            BL("nico", "Corri alla bacheca in piazza a ritirare la ricompensa e segnare la missione come compiuta!")
          ],
          then: borgoResume
        },
        {
          label: "Finta di tiro e tocco morbido all'angolino",
          sub: "Metti alla prova i riflessi di posizione",
          cls: "pick",
          fx: () => {
            state.active["q1_nico_glove_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Nico intercetta con la punta delle dita!", "success", "🧤");
          },
          lines: [
            BL("nico", "ZAMPA DI GATTO! (Nico allunga la mano sinistra con riflesso felino e devia sul palo esterno)"),
            BL("nico", "Hai visto come ho tenuto l'equilibrio? La Nonna dice sempre che sono sgraziato, ma sui palloni bassi adesso non passa niente!"),
            BL("nico", "Incarico superato, capitano! Fai un salto alla bacheca per riscuotere il premio!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q1_tommy_traiettoria") {
      bAsk("tommy", "«Moretti! Sei venuto per la sfida della bacheca? Guarda: ho calcolato che tirando con una rotazione d'esterno da dietro il lampione, il pallone si curva da solo. Nel calcio vince chi fa il gesto più bello da solo, giusto?»", [
        {
          label: "«Tommy, guarda me: dai la palla di prima e scatta nello spazio!»",
          sub: "L'uno-due rapido della Rondine",
          cls: "hot",
          fx: () => {
            state.active["q1_tommy_traiettoria_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Intesa Tommy affinata con successo!", "success", "🎯");
          },
          lines: [
            BL("tommy", "(Tommy ti appoggia la sfera di prima, scatta bruciando il guardalinee immaginario e riceve il tuo filtrante al volo in porta)"),
            BL("tommy", "…Maledizione, Moretti. Il portiere era ancora fermo a guardare il lampione mentre la rete si muoveva già."),
            BL("tommy", "Avevi ragione tu. Giocare insieme è persino più bello che fare dieci palleggi sul posto. Incarico completato: va' pure in bacheca a prenderti i meriti!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q1_rec_mattia") {
      bAsk("pietrino", "«Leo! Sei qui per la bacheca? Mattia fa il difficile: dice che finché gioca coi ragazzini nessuno gli fa gol, e che se vogliamo che entri nella Primavera del Rondine FC dobbiamo fargli almeno un gol su rigore imparabile!»", [
        {
          label: "Siluro teso a fil di traversa",
          sub: "Tiro di collo pieno dal dischetto",
          cls: "hot",
          fx: () => {
            state.active["q1_rec_mattia_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Gol spettacolare! Mattia accetta il reclutamento!", "success", "🛡️");
          },
          lines: [
            BL("pietrino", "GOOOOOL! La palla ha quasi strappato la maglia che usavamo come palo!"),
            BL("pietrino", "Mattia si è alzato, si è pulito le mani dalla focaccia e ha detto: «Quel tiro non lo prendeva manco Buffon. Ci sto: firmo per le Rondinelle!»"),
            BL("pietrino", "Mattia la Saracinesca è una nostra recluta! Passa in bacheca a convalidare il tesseramento!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q1_rita_spezie") {
      bAsk("rita", "«Leo! Hai visto l'avviso sulla bacheca? Per il derby voglio preparare la teglia speciale con gli aromi della collina e il rosmarino marino. Mi dai una mano a condire la teglia prima che il forno scotti?»", [
        {
          label: "Distribuisci il rosmarino selvatico e l'olio buono a spirale",
          sub: "Il tocco segreto della trattoria Moretti",
          cls: "hot",
          fx: () => {
            state.active["q1_rita_spezie_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Teglia infornata alla perfezione! Focaccia pronta.", "success", "🥪");
          },
          lines: [
            BL("rita", "Ma che profumo! Senti come scoppietta la crosta! Questa focaccia darebbe energia anche alle statue della piazza!"),
            BL("rita", "Tieni, due fette fumanti per te e i compagni. L'incarico è fatto: riscuoti la ricompensa alla bacheca!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q2_rec_kevin") {
      bAsk("gigi", "«KRAAA! Leo! Kevin del Pedalò ha letto il manifesto in bacheca! Dice che corre i cento metri sui ciottoli scalzo e che sulle fasce non lo vede nessuno! Vuole un test di velocità contro di te sulla battigia!»", [
        {
          label: "Scatto bruciante sui 50 metri della spiaggia",
          sub: "Sfida di pura accelerazione sulla sabbia",
          cls: "hot",
          fx: () => {
            state.active["q2_rec_kevin_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Kevin del Pedalò reclutato!", "success", "🏖️");
          },
          lines: [
            BL("gigi", "PARI AL CENTESIMO! Kevin è rimasto senza fiato e ha gridato: «Chi corre così sulla sabbia merita che giochi con lui!»"),
            BL("gigi", "Kevin del Pedalò ha firmato per il Rondine FC! Sulla fascia destra voleremo! Riscuoti il premio in bacheca!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q2_sara_dati") {
      bAsk("sara", "«Leo! Perfetto che sei arrivato. Per il dossier sulla Riviera mi mancavano i dettagli sui terzini avversari e sulle diagonali difensive. Tu che hai giocato in campo aperto, cosa hai notato?»", [
        {
          label: "«I loro centrali soffrono i tagli rapidi alle spalle sui campi bagnati»",
          sub: "Analisi tecnica d'attacco",
          cls: "hot",
          fx: () => {
            state.active["q2_sara_dati_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Dossier tattico completato con successo!", "success", "📓");
          },
          lines: [
            BL("sara", "(Sara annota tutto con la biro rossa a velocità prodigiosa)"),
            BL("sara", "Brillante, Leo! Questo finisce dritto nella lavagna tattica dello spogliatoio. Ora nessun avversario potrà sorprenderci!"),
            BL("sara", "Missione completata con lode: passa in bacheca a riscuotere la ricompensa!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q2_gigi_sciarpa") {
      bAsk("gigi", "«LEO! HAI LETTO IL MIO APPELLO IN BACHECA?! La mia sciarpa! Il vento l'ha trascinata sul molo vecchio! Senza di quella perdiamo tutte le partite fino al 2030!»", [
        {
          label: "«Eccola qui, Gigi! L'ho recuperata prima che finisse tra le reti!»",
          sub: "Restituisci la sciarpa di lana azzurra",
          cls: "hot",
          fx: () => {
            state.active["q2_gigi_sciarpa_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Sciarpa riconsegnata a Gigi!", "success", "🧣");
          },
          lines: [
            BL("gigi", "BENEDETTO! La lana azzurra profuma ancora di salsedine e di miracolo!"),
            BL("gigi", "Domenica urlerò così forte dagli spalti che ci sentiranno fino a Portofino! Grazie capitano, riscuoti subito il premio in bacheca!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q3_rec_saverio") {
      bAsk("rocco", "«Moretti. Saverio Cozza mi ha detto che hai affisso il bando per lui in bacheca. Quell'uomo pesa novanta chili ed entra in scivolata anche sui tombini. Ha detto che viene da voi solo se gli prometti che si lotta su ogni palla senza mai tirare indietro la gamba.»", [
        {
          label: "«Al Rondine FC la grinta è la prima regola: il posto al centro della difesa è suo!»",
          sub: "Patto d'onore tra capitani",
          cls: "hot",
          fx: () => {
            state.active["q3_rec_saverio_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Saverio Cozza entra nel Rondine FC!", "success", "🦀");
          },
          lines: [
            BL("rocco", "Gli porto il messaggio. Da stasera la vostra porta ha un muro di pietra lavica in più."),
            BL("rocco", "Saverio Cozza veste biancoblù. Va' in bacheca a ufficializzare il nuovo difensore roccioso!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q3_tonio_trabucchi") {
      bAsk("tonino", "«Leo! Mastro Tonio ha visto l'annuncio in bacheca. La Gabbia Street 3v3 sui Trabucchi è pronta: sponde di ferro battuto e rimbalzi imprevedibili. Mi ha chiesto se te la senti di fare una dimostrazione tecnica!»", [
        {
          label: "Esegui tre sponde millimetriche con tiro all'incrocio",
          sub: "Stile puro da street soccer",
          cls: "hot",
          fx: () => {
            state.active["q3_tonio_trabucchi_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Prova dei Trabucchi superata!", "success", "🪵");
          },
          lines: [
            BL("tonino", "Mastro Tonio si è tolto il cappello di paglia e ha battuto le mani! Ha detto: «Tale e quale a suo padre nel '74!»"),
            BL("tonino", "Hai sbloccato la maglia vintage e il rispetto di tutta la scogliera! Corri alla bacheca a riscuotere!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q3_rec_pietrino") {
      bAsk("pietrino", "«Leo! Mi hai davvero convocato per la prima squadra del Rondine FC?! Non ci credo... Ho dormito con gli scarpini ai piedi per tutta la settimana!»", [
        {
          label: "«Pietrino, ti sei meritato la maglia numero 10 della Primavera: benvenuto tra noi!»",
          sub: "Consegna la maglia ufficiale",
          cls: "hot",
          fx: () => {
            state.active["q3_rec_pietrino_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Pietrino è ufficialmente un giocatore del Rondine FC!", "success", "👟");
          },
          lines: [
            BL("pietrino", "GRAZIE CAPITANO! Prometto che non mangerò focaccia durante i supplementari!"),
            BL("pietrino", "Pietrino entra nel roster! Fai un salto alla bacheca per completare l'incarico!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q4_dario_doppia") {
      bAsk("dario", "«Leo! Ho visto che hai messo l'avviso in bacheca per noi due. Era ora. I giornali dicono che in Serie A la Doppia Rondine è prevedibile. Vogliamo fargli vedere cosa significa il sangue dei Moretti?»", [
        {
          label: "«Io cross teso a uscire, tu finta di testa e io rovesciata a rimorchio!»",
          sub: "Sincronia pura tra fratelli",
          cls: "hot",
          fx: () => {
            state.active["q4_dario_doppia_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Doppia Rondine perfezionata al massimo!", "success", "🔥");
          },
          lines: [
            BL("dario", "BOOOOOM! (Il pallone spacca l'aria a velocità ultrasonica e fa tremare i montanti della porta)"),
            BL("dario", "PERFETTO! Questo non lo prende nessun portiere al mondo!"),
            BL("dario", "La Doppia Rondine dei fratelli Moretti è leggenda. Va' in bacheca a prenderti il premio!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q4_rec_mirko") {
      bAsk("pina", "«Leo! È arrivata una lettera da Genova via corriere delle figurine: Mirko ha letto il tuo annuncio in bacheca! Dice che è pronto a salire sul pullman della costa e portare la sua classe nei caruggi del Rondine FC!»", [
        {
          label: "Accetta la richiesta di tesseramento di Mirko",
          sub: "Convalida l'ingaggio",
          cls: "hot",
          fx: () => {
            state.active["q4_rec_mirko_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Mirko dei Caruggi tesserato nel Rondine FC!", "success", "🧢");
          },
          lines: [
            BL("pina", "Ho vidimato il cartellino col timbro dell'edicola! Mirko ha già la maglia numero 8 nello spogliatoio!"),
            BL("pina", "Passa alla bacheca della piazza per ritirare il compenso della missione!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    if (activeQuest.id === "q4_paradosso_orologio") {
      bAsk("aurelio", "«Leo! Sento le campane di San Pietro vibrare all'incontrario! La crepa temporale del Borgo Storto si è placata appena hai recitato la preghiera dei marinai. L'Orologio del Paradosso è di nuovo saldo!»", [
        {
          label: "Riponi il frammento quantico nella cripta del campanile",
          sub: "Sigilla il flusso temporale",
          cls: "hot",
          fx: () => {
            state.active["q4_paradosso_orologio_done"] = true;
            saveQuestState(state);
            if (typeof window.sfx === "function") window.sfx("goal");
            if (window.toast) window.toast("Paradosso sigillato con successo!", "success", "🌀");
          },
          lines: [
            BL("aurelio", "Il tempo del Borgo scorre di nuovo dritto! Che Dio benedica i piedi di voi ragazzi!"),
            BL("aurelio", "Va' in bacheca, campione: c'è una ricompensa cosmica che ti attende!")
          ],
          then: borgoResume
        }
      ]);
      return true;
    }

    return false;
  }
  window.questBoardTalk = questBoardTalk;

  // Apre la modale ricca della Quest Board
  function openQuestBoard(onClose) {
    if (window.BW && window.BW.keys) window.BW.keys = {};
    const existing = document.getElementById("questBoardOverlay");
    if (existing) existing.remove();

    const curSeason = getCurrentSeason();
    const state = loadQuestState();
    let curFilter = "all";

    const overlay = document.createElement("div");
    overlay.id = "questBoardOverlay";
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(5, 11, 24, 0.88); backdrop-filter: blur(8px);
      z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 14px;
      font-family: system-ui, -apple-system, sans-serif; color: #f1f5f9; box-sizing: border-box;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      width: 100%; max-width: 640px; max-height: 90vh; background: #0f172a;
      border: 2px solid #b88648; border-radius: 18px; box-shadow: 0 16px 40px rgba(0,0,0,0.7);
      display: flex; flex-direction: column; overflow: hidden; animation: popIn .2s ease;
    `;

    const escListener = (e) => {
      if (e.key === "Escape") {
        if (typeof window.removeEventListener === "function") window.removeEventListener("keydown", escListener);
        overlay.remove();
        if (typeof onClose === "function") onClose();
      }
    };
    if (typeof window.addEventListener === "function") window.addEventListener("keydown", escListener);

    function renderContent() {
      const B = typeof window.borgoLoad === "function" ? window.borgoLoad() : (window.B || null);
      const p = typeof window.prog === "function" ? window.prog() : null;

      // Filtra le quest in base alla stagione e al tab
      const availableQuests = QUEST_DEFS.filter(q => q.season <= curSeason);
      const filtered = availableQuests.filter(q => {
        if (curFilter === "all") return true;
        if (curFilter === "completed") return !!state.completed[q.id];
        return q.cat === curFilter;
      });

      const totalCompleted = QUEST_DEFS.filter(q => state.completed[q.id]).length;

      box.innerHTML = `
        <style>
          @keyframes popIn { 0%{opacity:0; transform:scale(.96)} 100%{opacity:1; transform:scale(1)} }
          .qb-tab { background:#1e293b; color:#94a3b8; border:1px solid #334155; padding:6px 12px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:.15s; white-space:nowrap; }
          .qb-tab.active { background:#b88648; color:#0f172a; border-color:#d4a359; }
          .qb-card { background:#1e293b; border:2px solid #334155; border-radius:12px; padding:12px 14px; margin-bottom:12px; transition:.15s; position:relative; overflow:hidden; }
          .qb-card.ready { border-color:#22c55e; box-shadow:0 0 12px rgba(34,197,94,0.2); }
          .qb-card.done { border-color:#475569; opacity:.75; }
          .qb-btn { background:#b88648; color:#0f172a; border:none; padding:8px 14px; border-radius:8px; font-size:13px; font-weight:bold; cursor:pointer; }
          .qb-btn:hover { background:#d4a359; }
          .qb-btn.claim { background:#22c55e; color:#052e16; animation:pulse 1s infinite alternate; }
          @keyframes pulse { 0%{transform:scale(1)} 100%{transform:scale(1.03)} }
        </style>

        <!-- Header bacheca -->
        <div style="background:linear-gradient(180deg, #2a1a0e, #1a1109); padding:16px 18px; border-bottom:2px solid #b88648; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:42px; height:42px; background:#b88648; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 4px 10px rgba(0,0,0,0.4);">
              📋
            </div>
            <div>
              <div style="font-size:18px; font-weight:bold; color:#facc15; letter-spacing:0.5px;">BACHECA INCARICHI · RONDINE F.C.</div>
              <div style="font-size:12px; color:#cbd5e1;">Piazza San Pietro · Stagione ${curSeason} in corso · ${totalCompleted}/${QUEST_DEFS.length} Completati</div>
            </div>
          </div>
          <button id="qbCloseBtn" style="background:#334155; color:#cbd5e1; border:none; width:34px; height:34px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
        </div>

        <!-- Filtri categorie -->
        <div style="padding:10px 14px; background:#0b1120; border-bottom:1px solid #1e293b; display:flex; gap:6px; overflow-x:auto;">
          <button class="qb-tab ${curFilter === "all" ? "active" : ""}" data-f="all">Tutte (${availableQuests.length})</button>
          <button class="qb-tab ${curFilter === "pg" ? "active" : ""}" data-f="pg">🌟 Sviluppo Personaggi</button>
          <button class="qb-tab ${curFilter === "rec" ? "active" : ""}" data-f="rec">🤝 Reclutamento FC</button>
          <button class="qb-tab ${curFilter === "storia" ? "active" : ""}" data-f="storia">🏆 Borgo & Sfide</button>
          <button class="qb-tab ${curFilter === "completed" ? "active" : ""}" data-f="completed">✅ Completate (${totalCompleted})</button>
        </div>

        <!-- Lista incarichi -->
        <div style="flex:1; overflow-y:auto; padding:14px;">
          ${filtered.length === 0 ? `
            <div style="text-align:center; padding:40px 20px; color:#64748b;">
              <div style="font-size:36px; margin-bottom:8px;">📜</div>
              <div style="font-size:15px; font-weight:bold; color:#94a3b8;">Nessun incarico in questa categoria</div>
              <div style="font-size:13px; margin-top:4px;">Avanza nella storia e nelle stagioni per sbloccare nuove missioni del paese!</div>
            </div>
          ` : filtered.map(q => {
            const isDone = !!state.completed[q.id];
            const isActive = !!state.active[q.id];
            const isReady = !isDone && isActive && q.checkReady && q.checkReady(p, B, state);

            return `
              <div class="qb-card ${isDone ? "done" : isReady ? "ready" : ""}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:22px;">${q.icon}</span>
                    <div>
                      <div style="font-weight:bold; font-size:15px; color:${isDone ? "#94a3b8" : "#f8fafc"}">
                        ${esc(q.title)}
                        ${isDone ? '<span style="color:#22c55e; font-size:12px; margin-left:6px;">✓ COMPLETATA</span>' : ""}
                        ${isReady ? '<span style="color:#facc15; font-size:12px; margin-left:6px;">⚡ PRONTA PER LA RISCOSSIONE!</span>' : ""}
                      </div>
                      <div style="font-size:12px; color:#f59e0b; font-weight:500;">
                        ${esc(q.catName)} · Sblocca da: Stagione ${q.season}
                      </div>
                    </div>
                  </div>
                  <div>
                    ${isDone ? `
                      <span style="font-size:12px; color:#22c55e; font-weight:bold; padding:4px 8px; background:rgba(34,197,94,0.1); border-radius:6px; border:1px solid #22c55e;">RISCOSSO</span>
                    ` : isReady ? `
                      <button class="qb-btn claim" data-act="claim" data-id="${q.id}">Riscuoti Premio 🎁</button>
                    ` : isActive ? `
                      <button class="qb-btn" style="background:#1e3a8a; color:#93c5fd; border:1px solid #3b82f6;" data-act="view" data-id="${q.id}">In Corso ▸</button>
                    ` : `
                      <button class="qb-btn" data-act="accept" data-id="${q.id}">Accetta Incarico</button>
                    `}
                  </div>
                </div>

                <div style="font-size:13px; color:#cbd5e1; margin:8px 0; line-height:1.45;">
                  ${esc(q.desc)}
                </div>

                <div style="background:rgba(0,0,0,0.25); border-radius:8px; padding:8px 10px; font-size:12px; display:flex; flex-direction:column; gap:4px; border:1px solid #334155;">
                  <div><strong style="color:#38bdf8;">Obiettivo:</strong> ${esc(q.objective)}</div>
                  <div><strong style="color:#facc15;">Ricompensa:</strong> ${esc(q.rewardText)}</div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Footer -->
        <div style="padding:10px 16px; background:#0b1120; border-top:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:#64748b;">
          <div>Avvicinati alla bacheca in Piazza San Pietro o aprila dal menu del Borgo.</div>
          <button id="qbCloseFooter" style="background:#1e293b; color:#cbd5e1; border:1px solid #334155; padding:6px 14px; border-radius:8px; font-size:13px; cursor:pointer;">Chiudi</button>
        </div>
      `;

      // Event listener sui filtri
      box.querySelectorAll(".qb-tab").forEach(tab => {
        tab.onclick = () => {
          curFilter = tab.dataset.f;
          renderContent();
        };
      });

      // Event listener per accettazione e riscossione
      box.querySelectorAll("button[data-act]").forEach(btn => {
        btn.onclick = () => {
          const act = btn.dataset.act;
          const qId = btn.dataset.id;
          const quest = QUEST_DEFS.find(q => q.id === qId);
          if (!quest) return;

          if (act === "accept") {
            state.active[qId] = true;
            saveQuestState(state);
            if (window.toast) window.toast(`Incarico accettato: ${quest.title}`, "info", "📜");
            renderContent();
          } else if (act === "claim") {
            // Riscossione ricompensa
            state.completed[qId] = true;
            delete state.active[qId];
            delete state.active[qId + "_done"];
            saveQuestState(state);

            // Aggiungi monete
            if (quest.coins && typeof window.addCoins === "function") {
              window.addCoins(quest.coins);
            }

            // Se c'è una recluta, aggiungila alla Casa delle Stelle
            if (quest.recruitId) {
              try {
                if (typeof window.svRec === "function") {
                  const r = window.svRec();
                  if (r && r.rec) r.rec[quest.recruitId] = true;
                  if (typeof window.svSave === "function") window.svSave(r);
                }
              } catch {}
            }

            // Effetti visivi & audio
            if (window.fireConfetti) window.fireConfetti();
            if (typeof window.sfx === "function") window.sfx("goal");
            if (quest.onComplete) quest.onComplete();

            if (window.toast) window.toast(`Incarico completato! +${quest.coins} Monete`, "success", "🏆");
            renderContent();
          } else if (act === "view") {
            if (window.toast) window.toast(`Obiettivo: ${quest.objective}`, "info", "🔍");
          }
        };
      });

      const closeHandler = () => {
        if (typeof window.removeEventListener === "function") window.removeEventListener("keydown", escListener);
        overlay.remove();
        if (typeof onClose === "function") onClose();
      };
      const closeBtn = box.querySelector("#qbCloseBtn");
      if (closeBtn) closeBtn.onclick = closeHandler;
      const closeFooter = box.querySelector("#qbCloseFooter");
      if (closeFooter) closeFooter.onclick = closeHandler;
    }

    renderContent();
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        if (typeof window.removeEventListener === "function") window.removeEventListener("keydown", escListener);
        overlay.remove();
        if (typeof onClose === "function") onClose();
      }
    };
  }

  // Espone globalmente
  window.openQuestBoard = openQuestBoard;
  window.QUEST_DEFS = QUEST_DEFS;

})();
