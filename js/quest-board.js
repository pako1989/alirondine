/**
 * Ali di Rondine - Quest Board del Borgo (Piazza Centrale)
 * Sistema dinamico di missioni secondarie per sviluppo personaggi e reclutamento Rondine FC.
 * Include gameplay vero (partite al campetto, beach soccer, sfide degli squali, muro del porto) e gestione Roster.
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

  // Database delle 5 Reclute Speciali del Rondine FC
  const ROSTER_RECRUITS = [
    {
      id: "mattia",
      name: "Mattia la Saracinesca",
      role: "Portiere (GK)",
      badge: "🧤",
      color: "#ffd23f",
      season: 1,
      source: "Partitella al Campetto contro i Ragazzini",
      questId: "q1_rec_mattia",
      perk: "Presa d'Acciaio (+10% parate sicure nelle partite e in Calcio d'Azione)",
      bio: "Mangia focaccia calda tra un palo e l'altro, ma quando parte il tiro blocca tutto con riflessi insospettabili.",
      quote: "«Finché ci sono io tra i pali, la saracinesca della Rondine è abbassata!»"
    },
    {
      id: "kevin",
      name: "Kevin del Pedalò",
      role: "Ala Destra (AD)",
      badge: "🏖️",
      color: "#ff7a45",
      season: 2,
      source: "Beach Soccer contro i Bagnini dello Scoglio",
      questId: "q2_rec_kevin",
      perk: "Scatto della Battigia (+10% velocità sulle fasce e contropiedi rapidi)",
      bio: "Corre scalzo sulla battigia trascinando i pedalò. Sulla fascia destra brucia qualsiasi terzino della costa.",
      quote: "«Datemi la palla nello spazio: prima della linea di fondo non mi prende nessuno!»"
    },
    {
      id: "saverio",
      name: "Saverio Cozza",
      role: "Difensore Centrale (DC)",
      badge: "🦀",
      color: "#0a3a4a",
      season: 3,
      source: "Sfida Secca contro gli Squali di Punta Nera",
      questId: "q3_rec_saverio",
      perk: "Muro di Pietra Lavica (+10% contrasti vincenti e scivolate pulite)",
      bio: "Stopper roccioso di Punta Nera. Entra in tackle anche sui ciottoli bagnati con determinazione d'acciaio.",
      quote: "«Chi prova a entrare nell'area della Rondine trova me. E io non mi sposto.»"
    },
    {
      id: "pietrino",
      name: "Pietrino il Fantasista",
      role: "Trequartista (COC)",
      badge: "👟",
      color: "#10b981",
      season: 3,
      source: "Promozione dai Caruggi alla Prima Squadra",
      questId: "q3_rec_pietrino",
      perk: "Sombrero dei Caruggi (+10% precisione passaggi filtranti e dribbling)",
      bio: "Cresciuto dribblando tra le panchine di Piazza San Pietro, serve assist al bacio con entrambi i piedi.",
      quote: "«Il calcio è fantasia: un tunnel, un colpo di tacco e palla all'incrocio!»"
    },
    {
      id: "mirko",
      name: "Mirko dei Caruggi",
      role: "Mezzala D'Assalto (CC)",
      badge: "🧢",
      color: "#8b5cf6",
      season: 4,
      source: "Ingaggio da Genova tramite il Corriere di Pina",
      questId: "q4_rec_mirko",
      perk: "Tiro a Giro della Lanterna (+10% ricarica abilità speciali e conclusioni a effetto)",
      bio: "Mezzala genovese con la coppola del nonno. Calcia con l'esterno a giro sulle serrande dei vicoli con classe pura.",
      quote: "«Nei vicoli stretti di Genova ho imparato che lo spazio si inventa, non si aspetta.»"
    }
  ];

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
      sub: "Aiuta Nico con le uscite basse sui sassi",
      desc: "Nico si allena sulla scogliera tra gli scogli aguzzi: ha paura delle uscite basse sui ciottoli bagnati. Parlagli e affronta la sessione al Muro del Porto per fargli ritrovare il coraggio!",
      objective: "Parla con Nico e completa la sfida di 5 tiri al Muro del Porto (minimo 6 punti).",
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
      desc: "Tommy passa ore a tirare col compasso contro la saracinesca del porto, convinto che il calcio sia solo estetica individuale. Scendi in campo con lui al campetto per dimostrargli l'intesa!",
      objective: "Parla con Tommy e gioca la partitella al campo contro i ragazzini.",
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
      desc: "Mattia mangia focaccia tra un palo e l'altro, ma quando parte il tiro non fa passare uno spillo. Se batti la sua squadra al campetto, accetterà di entrare nella Primavera della Rondine!",
      objective: "Parla con Pietrino e vinci la partitella al campetto contro Mattia.",
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
      desc: "Kevin corre a piedi nudi sulla battigia più veloce del vento e si allena trainando i pedalò. Dimostragli che il Rondine FC sa correre e lottare sulla sabbia vincendo a Beach Soccer!",
      objective: "Parla con Gigi allo Scoglio e vinci la partita di Beach Soccer contro i Bagnini.",
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
      desc: "Saverio Cozza cerca un club vero dove si giochi duro ma con onore. Sfida gli Squali di Punta Nera in una partita secca per portare Saverio al Rondine FC!",
      objective: "Parla con Rocco Scafati e vinci la sfida secca contro gli Squali di Punta Nera.",
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
      sub: "Domina le sponde e i rimbalzi di Mastro Tonio",
      desc: "Mastro Tonio ha terminato la nuova Gabbia sui Trabucchi. Vuole vedere se Leo sa far rimbalzare il pallone sui montanti di quercia con almeno 8 punti al Muro del Porto o una partita a Biliardino!",
      objective: "Parla con Tonino ed esegui la prova di precisione al Muro o al Biliardino del Bar.",
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
      desc: "Pietrino è cresciuto: semina il panico tra le panchine della piazza e calcia con entrambi i piedi. Parlagli in piazza per consegnargli la maglia ufficiale del Rondine FC.",
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

  // Hook chiamato automaticamente quando Leo vince una partita nel Borgo
  function onQuestMatchWin(matchId) {
    const state = loadQuestState();
    let updated = false;
    let res = null;

    if (matchId === "ragazzini") {
      if (state.active["q1_tommy_traiettoria"] && !state.active["q1_tommy_traiettoria_done"]) {
        state.active["q1_tommy_traiettoria_done"] = true;
        updated = true;
        res = {
          who: "tommy",
          text: "«…Maledizione, Moretti. Quell'uno-due nello spazio ha tagliato fuori tutti. Il portiere era ancora fermo a guardare il lampione mentre la rete si muoveva già. Avevi ragione tu: l'intesa batte l'individualismo! Incarico completato: va' pure in bacheca a prenderti i meriti!»",
          questCompleted: true
        };
        if (window.toast) window.toast("Intesa con Tommy affinata in partita!", "success", "🎯");
      } else if (state.active["q1_rec_mattia"] && !state.active["q1_rec_mattia_done"]) {
        state.active["q1_rec_mattia_done"] = true;
        updated = true;
        res = {
          who: "pietrino",
          text: "«GOOOOOL! Mattia si è alzato, si è pulito le mani dalla focaccia e ha detto: «Quel tiro non lo prendeva manco Buffon. Ci sto: firmo per le Rondinelle!» Mattia la Saracinesca è una nostra recluta! Passa in bacheca a convalidare il tesseramento!»",
          questCompleted: true
        };
        if (window.toast) window.toast("Mattia battuto al campetto! Reclutamento pronto!", "success", "🛡️");
      } else if (state.active["q3_rec_pietrino"] && !state.active["q3_rec_pietrino_done"]) {
        state.active["q3_rec_pietrino_done"] = true;
        updated = true;
        res = {
          who: "pietrino",
          text: "«GRAZIE CAPITANO! Hai visto che lanci ho fatto? Prometto che non mangerò focaccia durante i supplementari! Pietrino entra ufficialmente nel roster della prima squadra! Fai un salto alla bacheca per completare l'incarico!»",
          questCompleted: true
        };
        if (window.toast) window.toast("Pietrino ha dimostrato la sua stoffa da Prima Squadra!", "success", "👟");
      }
    } else if (matchId === "bagnini") {
      if (state.active["q2_rec_kevin"] && !state.active["q2_rec_kevin_done"]) {
        state.active["q2_rec_kevin_done"] = true;
        updated = true;
        res = {
          who: "gigi",
          text: "«KRAAA! Abbiamo battuto i Bagnini! Kevin del Pedalò è rimasto a bocca aperta e ha gridato: «Chi corre così sulla sabbia merita che giochi con lui!» Kevin ha firmato per il Rondine FC: sulla fascia voleremo! Riscuoti il premio in bacheca!»",
          questCompleted: true
        };
        if (window.toast) window.toast("Bagnini battuti a Beach Soccer! Kevin reclutato!", "success", "🏖️");
      }
    } else if (matchId === "squali") {
      if (state.active["q3_rec_saverio"] && !state.active["q3_rec_saverio_done"]) {
        state.active["q3_rec_saverio_done"] = true;
        updated = true;
        res = {
          who: "rocco",
          text: "«Gli porto il messaggio, Moretti. Da stasera la vostra porta ha un muro di pietra lavica in più. Saverio Cozza veste biancoblù e viene alla Rondine. Va' in bacheca a ufficializzare il nuovo difensore roccioso!»",
          questCompleted: true
        };
        if (window.toast) window.toast("Squali battuti! Saverio Cozza entra nel Rondine FC!", "success", "🦀");
      }
    }

    if (updated) saveQuestState(state);
    return res;
  }
  window.onQuestMatchWin = onQuestMatchWin;

  // Hook chiamato quando si conclude la sessione di 5 tiri al Muro del Porto
  function onQuestMuroEnd(pts) {
    const state = loadQuestState();
    let updated = false;
    let res = null;

    if (state.active["q1_nico_glove"] && !state.active["q1_nico_glove_done"]) {
      if (pts >= 6) {
        state.active["q1_nico_glove_done"] = true;
        updated = true;
        res = {
          who: "nico",
          text: "«ZAMPA DI GATTO! Hai visto come ho tenuto l'equilibrio? La Nonna dice sempre che sono sgraziato, ma sui palloni bassi adesso non passa niente! Incarico superato, capitano! Fai un salto alla bacheca per riscuotere il premio!»",
          questCompleted: true
        };
        if (window.toast) window.toast("Nico ha parato le uscite basse! Allenamento superato!", "success", "🧤");
      }
    }

    if (state.active["q3_tonio_trabucchi"] && !state.active["q3_tonio_trabucchi_done"]) {
      if (pts >= 8) {
        state.active["q3_tonio_trabucchi_done"] = true;
        updated = true;
        res = {
          who: "tonino",
          text: "«Mastro Tonio si è tolto il cappello di paglia e ha battuto le mani! Ha detto: «Tale e quale a suo padre nel '74!» Hai sbloccato la maglia vintage e il rispetto di tutta la scogliera! Corri alla bacheca a riscuotere!»",
          questCompleted: true
        };
        if (window.toast) window.toast("Prova dei Trabucchi superata al Muro del Porto!", "success", "🪵");
      }
    }

    if (updated) saveQuestState(state);
    return res;
  }
  window.onQuestMuroEnd = onQuestMuroEnd;

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

  // Interazione dialoghi ricchi con gameplay reale e dialoghi al superamento
  function questBoardTalk(npcId, bSay, bAsk, BL, borgoResume) {
    const curSeason = getCurrentSeason();
    const state = loadQuestState();
    const activeQuest = QUEST_DEFS.find(q => q.targetChar === npcId && q.season <= curSeason && state.active[q.id] && !state.completed[q.id]);

    if (!activeQuest) return false;

    const isAlreadyDone = !!state.active[activeQuest.id + "_done"];

    // Se l'obiettivo è già stato superato nel gameplay: mostra il dialogo trionfale del personaggio
    if (isAlreadyDone) {
      const victorySpeeches = {
        q1_nico_glove: "«ZAMPA DI GATTO! Hai visto come ho tenuto l'equilibrio? La Nonna dice sempre che sono sgraziato, ma sui palloni bassi adesso non passa niente! Incarico superato, capitano! Fai un salto alla bacheca per riscuotere il premio!»",
        q1_tommy_traiettoria: "«…Maledizione, Moretti. Quell'uno-due nello spazio ha tagliato fuori tutti. Il portiere era ancora fermo a guardare il lampione mentre la rete si muoveva già. Avevi ragione tu! Incarico completato: va' pure in bacheca a prenderti i meriti!»",
        q1_rec_mattia: "«GOOOOOL! Mattia si è alzato, si è pulito le mani dalla focaccia e ha detto: «Quel tiro non lo prendeva manco Buffon. Ci sto: firmo per le Rondinelle!» Mattia la Saracinesca è una nostra recluta! Passa in bacheca a convalidare il tesseramento!»",
        q2_rec_kevin: "«PARI AL CENTESIMO! Kevin è rimasto senza fiato e ha gridato: «Chi corre così sulla sabbia merita che giochi con lui!» Kevin del Pedalò ha firmato per il Rondine FC! Sulla fascia destra voleremo! Riscuoti il premio in bacheca!»",
        q3_rec_saverio: "«Gli porto il messaggio, Moretti. Da stasera la vostra porta ha un muro di pietra lavica in più. Saverio Cozza veste biancoblù. Va' in bacheca a ufficializzare il nuovo difensore roccioso!»",
        q3_tonio_trabucchi: "«Mastro Tonio si è tolto il cappello di paglia e ha battuto le mani! Ha detto: «Tale e quale a suo padre nel '74!» Hai sbloccato la maglia vintage e il rispetto di tutta la scogliera! Corri alla bacheca a riscuotere!»",
        q3_rec_pietrino: "«GRAZIE CAPITANO! Prometto che non mangerò focaccia durante i supplementari! Pietrino entra nel roster della prima squadra! Fai un salto alla bacheca per completare l'incarico!»"
      };

      const speech = victorySpeeches[activeQuest.id] || `«Leo! Abbiamo già vinto la sfida per l'incarico: «${activeQuest.title}»! Corri alla Bacheca in Piazza San Pietro a riscuotere la tua ricompensa!»`;
      const buttonsList = [
        { label: "📋 Apri Bacheca Incarichi", cls: "hot", go: () => openQuestBoard(borgoResume) }
      ];
      if (/^q[123]_rec_/.test(activeQuest.id)) {
        buttonsList.push({ label: "👥 Vedi Roster Squadra", cls: "pick", go: () => openRosterModal(borgoResume) });
      }
      buttonsList.push({ label: "◂ Torna al Borgo", go: borgoResume });

      bAsk(npcId, speech, buttonsList);
      return true;
    }

    // ==========================================
    // 1. NICO FERRI (La Presa del Gatto)
    // ==========================================
    if (activeQuest.id === "q1_nico_glove") {
      bAsk("nico", "«Leo! Meno male che sei qui! Hai visto il mio annuncio in bacheca? Sulle uscite basse ho ancora il terrore di spaccarmi le ginocchia sui ciottoli bagnati. Tirami 5 volte con il Muro del Porto: se fai almeno 6 punti col minigioco, imparo a tuffarmi a occhi aperti!»", [
        {
          label: "⚽ Sfida al Muro del Porto (5 tiri)",
          sub: "Fai almeno 6 punti di tempismo contro il muro",
          cls: "hot",
          go: () => {
            if (typeof window.borgoMuro === "function") window.borgoMuro();
          }
        },
        {
          label: "◂ Ci penso dopo",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 2. TOMMY (La Traiettoria Perfetta)
    // ==========================================
    if (activeQuest.id === "q1_tommy_traiettoria") {
      bAsk("tommy", "«Moretti! Sei venuto per la sfida della bacheca? Sostieni che l'uno-due di squadra sia più efficace delle mie magie individuali? Dimostramelo: giochiamo una partitella vera al campo contro i ragazzi del Borgo!»", [
        {
          label: "⚽ Scendi in campo con Tommy nella Partitella!",
          sub: "Batti i ragazzi del Borgo al campetto",
          cls: "hot",
          go: () => {
            if (typeof window.borgoMatch === "function") window.borgoMatch("ragazzini");
          }
        },
        {
          label: "◂ Ci penso dopo",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 3. PIETRINO & MATTIA LA SARACINESCA
    // ==========================================
    if (activeQuest.id === "q1_rec_mattia") {
      bAsk("pietrino", "«Leo! Sei qui per la bacheca? Mattia fa il difficile: dice che se vuoi che entri nella Primavera del Rondine FC devi battere la sua squadra al campetto! Scendete in campo contro di noi: se battete i Ragazzini del Borgo, Mattia firma il cartellino per la Rondine!»", [
        {
          label: "⚽ Sfida al Campo: Batti Mattia e i Ragazzini!",
          sub: "Partita giocabile contro la difesa di Mattia",
          cls: "hot",
          go: () => {
            if (typeof window.borgoMatch === "function") window.borgoMatch("ragazzini");
          }
        },
        {
          label: "◂ Ci penso dopo",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 4. RITA (La Focaccia della Vigilia)
    // ==========================================
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
        },
        {
          label: "◂ Più tardi",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 5. GIGI & KEVIN DEL PEDALÒ
    // ==========================================
    if (activeQuest.id === "q2_rec_kevin") {
      bAsk("gigi", "«KRAAA! Leo! Kevin del Pedalò ha letto il manifesto in bacheca! Dice che sulle spiagge dello Scoglio non lo batte nessuno! Vuole una partita vera di Beach Soccer sulla sabbia: se battiamo i Bagnini dello Scoglio, Kevin firma per la Rondine!»", [
        {
          label: "🏖️ Gioca a Beach Soccer per reclutare Kevin!",
          sub: "Partita giocabile sulla sabbia dello Scoglio",
          cls: "hot",
          go: () => {
            if (typeof window.borgoMatch === "function") window.borgoMatch("bagnini");
          }
        },
        {
          label: "◂ Ci penso dopo",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 6. SARA (Il Grande Taccuino Tattico)
    // ==========================================
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
        },
        {
          label: "◂ Più tardi",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 7. GIGI (La Sciarpa Benedetta)
    // ==========================================
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
        },
        {
          label: "◂ Più tardi",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 8. ROCCO SCAFATI & SAVERIO COZZA
    // ==========================================
    if (activeQuest.id === "q3_rec_saverio") {
      bAsk("rocco", "«Moretti. Saverio Cozza gioca stopper con noi negli Squali. Dice che viene alla Rondine solo se dimostrate di saper vincere una battaglia vera contro di noi sul campo! Accetti la sfida secca degli Squali di Punta Nera?»", [
        {
          label: "⚔️ Sfida Secca contro gli Squali di Rocco!",
          sub: "Partita giocabile dura sul campo",
          cls: "hot",
          go: () => {
            if (typeof window.borgoMatch === "function") window.borgoMatch("squali");
          }
        },
        {
          label: "◂ Ci penso dopo",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 9. TONINO (La Prova dei Trabucchi)
    // ==========================================
    if (activeQuest.id === "q3_tonio_trabucchi") {
      bAsk("tonino", "«Leo! Mastro Tonio ha visto l'annuncio in bacheca. Vuole vedere se hai il tocco di palla di papà Enzo: fai almeno 8 punti con i 5 tiri al Muro del Porto o sfidaci al Biliardino del Bar!»", [
        {
          label: "🪵 Minigioco: Prova di precisione al Muro del Porto",
          sub: "5 tiri di tempismo al muro (minimo 8 punti)",
          cls: "hot",
          go: () => {
            if (typeof window.borgoMuro === "function") window.borgoMuro();
          }
        },
        {
          label: "⚽ Sfida al Biliardino del Bar del Porto",
          sub: "Gioca al calcio balilla del bar",
          cls: "pick",
          go: () => {
            if (typeof window.openBiliardino === "function") {
              window.openBiliardino(0, () => {
                state.active["q3_tonio_trabucchi_done"] = true;
                saveQuestState(state);
                borgoResume();
              });
            } else {
              state.active["q3_tonio_trabucchi_done"] = true;
              saveQuestState(state);
              borgoResume();
            }
          }
        },
        {
          label: "◂ Ci penso dopo",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 10. PIETRINO (Reclutamento Prima Squadra)
    // ==========================================
    if (activeQuest.id === "q3_rec_pietrino") {
      bAsk("pietrino", "«Leo! Mi hai davvero convocato per la prima squadra del Rondine FC?! Non ci credo... Ho dormito con gli scarpini ai piedi per tutta la settimana!»", [
        {
          label: "⚽ Gioca una partitella amichevole con Pietrino",
          sub: "Verifica sul campo le sue geometrie",
          cls: "hot",
          go: () => {
            if (typeof window.borgoMatch === "function") window.borgoMatch("ragazzini");
          }
        },
        {
          label: "◂ Ci penso dopo",
          go: borgoResume
        }
      ]);
      return true;
    }

    // ==========================================
    // 11. DARIO (Doppia Rondine)
    // ==========================================
    if (activeQuest.id === "q4_dario_doppia") {
      bAsk("dario", "«Leo! Ho visto che hai messo l'avviso in bacheca per noi due. I giornali dicono che in Serie A la Doppia Rondine è prevedibile. Vogliamo fargli vedere cosa significa il sangue dei Moretti?»", [
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

    // ==========================================
    // 12. PINA & MIRKO DEI CARUGGI
    // ==========================================
    if (activeQuest.id === "q4_rec_mirko") {
      bAsk("pina", "«Leo! È arrivata una lettera da Genova via corriere delle figurine: Mirko ha letto il tuo annuncio in bacheca! Dice che è pronto a portare la sua classe nei caruggi del Rondine FC!»", [
        {
          label: "Accetta la richiesta di tesseramento di Mirko",
          sub: "Convalida l'ingaggio per la Serie A",
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

    // ==========================================
    // 13. DON AURELIO (Paradosso dell'Orologio)
    // ==========================================
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

  // Modale del Roster Rondine F.C. & Reclute
  function openRosterModal(onClose) {
    if (window.BW && window.BW.keys) window.BW.keys = {};
    const existing = document.getElementById("rosterModalOverlay");
    if (existing) existing.remove();

    let svRecData = {};
    try {
      if (typeof window.svRec === "function") svRecData = window.svRec().rec || {};
    } catch {}

    const overlay = document.createElement("div");
    overlay.id = "rosterModalOverlay";
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(5, 11, 24, 0.94); backdrop-filter: blur(10px);
      z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 8px;
      font-family: system-ui, -apple-system, sans-serif; color: #f1f5f9; box-sizing: border-box;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      width: 100%; max-width: 640px; max-height: 94vh; height: 94vh; background: #0f172a;
      border: 2px solid #38bdf8; border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.85);
      display: flex; flex-direction: column; overflow: hidden; animation: popIn .2s ease; box-sizing: border-box;
    `;

    const recruitedCount = ROSTER_RECRUITS.filter(r => !!svRecData[r.id]).length;

    box.innerHTML = `
      <!-- Header -->
      <div style="flex-shrink:0; background:linear-gradient(180deg, #0c2d48, #071927); padding:12px 14px; border-bottom:2px solid #38bdf8; display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div style="display:flex; align-items:center; gap:10px; min-width:0;">
          <div style="width:38px; height:38px; background:#0284c7; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 4px 10px rgba(0,0,0,0.4); flex-shrink:0;">
            👥
          </div>
          <div style="min-width:0;">
            <div style="font-size:clamp(13px, 4vw, 16px); font-weight:800; color:#38bdf8; letter-spacing:0.3px; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">ROSTER RONDINE F.C. · RECLUTE</div>
            <div style="font-size:11px; color:#cbd5e1; line-height:1.2; margin-top:2px;">${recruitedCount}/${ROSTER_RECRUITS.length} Reclutati · Attivi in Sede & Azione</div>
          </div>
        </div>
        <button id="rosterCloseBtn" style="background:#1e293b; color:#cbd5e1; border:1px solid #334155; width:32px; height:32px; border-radius:50%; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">✕</button>
      </div>

      <!-- Spiegazione -->
      <div style="flex-shrink:0; padding:8px 12px; background:#0b1329; border-bottom:1px solid #1e293b; font-size:11.5px; color:#94a3b8; line-height:1.35;">
        Le reclute ingaggiate tramite le sfide della bacheca entrano nel club: vivono nel Borgo, popolano la <b>Sede</b> e possono essere schierate come <b>Rinforzi</b> in <em>Calcio d'Azione</em>!
      </div>

      <!-- Lista Reclute -->
      <div style="flex:1 1 auto; min-height:0; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:10px; display:flex; flex-direction:column; gap:8px;">
        ${ROSTER_RECRUITS.map(r => {
          const isRecruited = !!svRecData[r.id];
          return `
            <div style="flex-shrink:0; min-height:fit-content; background:#1e293b; border:1.5px solid ${isRecruited ? "#22c55e" : "#334155"}; border-radius:10px; padding:10px 12px; display:flex; gap:10px; align-items:flex-start; box-sizing:border-box;">
              <div style="width:40px; height:40px; background:${isRecruited ? r.color : "#334155"}; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 3px 8px rgba(0,0,0,0.3); flex-shrink:0; margin-top:2px;">
                ${r.badge}
              </div>
              <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px; flex-wrap:wrap;">
                  <div style="font-weight:bold; font-size:14px; color:${isRecruited ? "#f8fafc" : "#f1f5f9"}; line-height:1.2;">
                    ${esc(r.name)} <span style="font-size:11.5px; color:#38bdf8; font-weight:600;">[${esc(r.role)}]</span>
                  </div>
                  <div>
                    ${isRecruited ? `
                      <span style="font-size:10px; color:#22c55e; font-weight:bold; padding:2px 6px; background:rgba(34,197,94,0.18); border-radius:5px; border:1px solid #22c55e; white-space:nowrap;">IN ROSA ✓</span>
                    ` : `
                      <span style="font-size:10px; color:#f59e0b; font-weight:bold; padding:2px 6px; background:rgba(245,158,11,0.18); border-radius:5px; border:1px solid #f59e0b; white-space:nowrap;">DA RECLUTARE</span>
                    `}
                  </div>
                </div>
                <div style="font-size:11.5px; color:#cbd5e1; line-height:1.35;">
                  ${esc(r.bio)}
                </div>
                <div style="font-size:11px; color:#facc15; font-weight:600; line-height:1.25;">
                  ⚡ <b>Perk:</b> ${esc(r.perk)}
                </div>
                ${!isRecruited ? `
                  <div style="font-size:10.5px; color:#94a3b8; line-height:1.25;">
                    📍 <em>Come reclutare:</em> ${esc(r.source)} (Stagione ${r.season})
                  </div>
                ` : `
                  <div style="font-size:10.5px; color:#67e8f9; line-height:1.25; font-style:italic;">
                    ${esc(r.quote)}
                  </div>
                `}
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <!-- Footer -->
      <div style="flex-shrink:0; padding:10px 14px; background:#0b1329; border-top:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center;">
        <button id="rosterGoHq" style="background:#0284c7; color:#f8fafc; border:none; padding:8px 12px; border-radius:8px; font-size:12.5px; font-weight:bold; cursor:pointer;">Visita Sede del Club ▸</button>
        <button id="rosterCloseFooter" style="background:#1e293b; color:#cbd5e1; border:1px solid #334155; padding:8px 14px; border-radius:8px; font-size:12.5px; cursor:pointer;">Chiudi</button>
      </div>
    `;

    const closeHandler = () => {
      overlay.remove();
      if (typeof onClose === "function") onClose();
    };

    box.querySelector("#rosterCloseBtn").onclick = closeHandler;
    box.querySelector("#rosterCloseFooter").onclick = closeHandler;
    const hqBtn = box.querySelector("#rosterGoHq");
    if (hqBtn) {
      hqBtn.onclick = () => {
        overlay.remove();
        if (typeof window.hqEnter === "function") {
          window.hqEnter(onClose || (() => {}));
        } else if (typeof onClose === "function") {
          onClose();
        }
      };
    }

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.onclick = (e) => {
      if (e.target === overlay) closeHandler();
    };
  }
  window.openRosterModal = openRosterModal;

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
          .qb-card { flex-shrink:0; min-height:fit-content; background:#1e293b; border:2px solid #334155; border-radius:12px; padding:12px 14px; margin-bottom:12px; transition:.15s; position:relative; overflow:visible; box-sizing:border-box; }
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
          <div style="display:flex; align-items:center; gap:8px;">
            <button id="qbRosterBtn" style="background:#0284c7; color:#fff; border:none; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:4px;">👥 Roster Reclute</button>
            <button id="qbCloseBtn" style="background:#334155; color:#cbd5e1; border:none; width:34px; height:34px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
          </div>
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
        <div style="flex:1 1 auto; min-height:0; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:12px;">
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

      // Event listener sul tasto Roster
      const rosterBtn = box.querySelector("#qbRosterBtn");
      if (rosterBtn) {
        rosterBtn.onclick = () => {
          openRosterModal(() => {
            renderContent();
          });
        };
      }

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

            // Se c'è una recluta, aggiungila alla Rosa e alle Stelle del Borgo
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
  window.ROSTER_RECRUITS = ROSTER_RECRUITS;

})();
