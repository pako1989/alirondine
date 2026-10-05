/**
 * Ali di Rondine - Quest Board del Borgo (Piazza Centrale)
 * Sistema dinamico di missioni secondarie per sviluppo personaggi e reclutamento Rondine FC.
 */
(() => {
  "use strict";

  const STORAGE_KEY = "ali-di-rondine.questboard";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

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
      desc: "Nico si allena sulla scogliera tra gli scogli aguzzi: ha paura delle uscite basse sui ciottoli bagnati. Parlagli al campo o affrontalo sul molo per fargli ritrovare il coraggio da saracinesca.",
      objective: "Parla con Nico al campetto o fai una sessione di tiri.",
      coins: 20,
      rewardText: "+20 Monete · Affinità Nico +10 · Talento «Presa d'Acciaio»",
      checkReady: (prog, B) => {
        // Ready se il guanto è stato riconsegnato o se ha parlato con Nico
        return (B && B.q && B.q.glove >= 2) || (B && B.seen && B.seen.nico);
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
      objective: "Parla con Tommy al porto o vinci una partitella con Tommy in squadra.",
      coins: 20,
      rewardText: "+20 Monete · Intesa Squadra +5 · Carta Speciale Tommy nell'Album",
      checkReady: (prog, B) => {
        return (B && B.q && (B.q.kids || 0) >= 1) || (B && B.seen && B.seen.tommy);
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
      desc: "Mattia mangia focaccia tra un palo e l'altro, ma quando parte il tiro non fa passare uno spillo. Se batti i Ragazzini del Borgo nella partitella al campo, accetterà di entrare nella Primavera della Rondine!",
      objective: "Vinci almeno una partitella contro i Ragazzini del Borgo al campetto.",
      coins: 25,
      recruitId: "mattia",
      recruitName: "Mattia la Saracinesca (Portiere)",
      rewardText: "Recluta Mattia nel Roster Rondine FC · +25 Monete",
      checkReady: (prog, B) => {
        return B && B.q && (B.q.kids || 0) >= 1;
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
      objective: "Esplora la Trattoria Moretti e parla con Rita.",
      coins: 20,
      rewardText: "+2 Focacce Calde per la squadra · +20 Monete",
      checkReady: (prog, B) => {
        return B && B.seen && (B.seen.trattoria || B.seen.rita);
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
      desc: "Kevin corre a piedi nudi sulla battigia più veloce del vento e si allena trainando i pedalò. Dimostragli che il Rondine FC sa dominare anche sulla sabbia battendo i Bagnini dello Scoglio!",
      objective: "Vinci la sfida di Beach Soccer contro i Bagnini dello Scoglio.",
      coins: 30,
      recruitId: "kevin",
      recruitName: "Kevin del Pedalò (Ala Destra)",
      rewardText: "Recluta Kevin nel Rondine FC · +30 Monete",
      checkReady: (prog, B) => {
        return B && B.q && (B.q.beach || 0) >= 1;
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
      desc: "Sara sta mappando i movimenti delle ali avversarie. Per completare il suo dossier ha bisogno che Leo visiti l'Edicola di Pina e sfogli l'archivio delle figurine storiche.",
      objective: "Visita l'Edicola di Pina ed esamina l'Album delle Figurine.",
      coins: 25,
      rewardText: "+25 Monete · Report Tattico Pre-Partita potenziato",
      checkReady: (prog, B) => {
        return B && B.seen && (B.seen.edicola || B.seen.pina);
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
      objective: "Trova la sciarpa di Gigi sulla spiaggia o parlaci al chiosco.",
      coins: 25,
      rewardText: "+25 Monete · Grinta Iniziale Squadra +1",
      checkReady: (prog, B) => {
        return (B && B.seen && B.seen.gigi) || (B && B.shells && B.shells.length >= 2);
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
      desc: "Saverio Cozza è stanco delle scorrettezze di Scafati. Cerca un club vero dove si giochi duro ma con onore. Se batti gli Squali di Punta Nera, Saverio vestirà il biancoblù della Rondine!",
      objective: "Vinci la sfida contro gli Squali di Punta Nera di Rocco Scafati.",
      coins: 35,
      recruitId: "saverio",
      recruitName: "Saverio Cozza (Difensore Centrale)",
      rewardText: "Recluta Saverio Cozza nel Rondine FC · +35 Monete",
      checkReady: (prog, B) => {
        return B && B.q && (B.q.rocco || 0) >= 1;
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
      targetChar: "mastro_tonio",
      title: "La Prova dei Trabucchi",
      sub: "Domina la gabbia in ferro battuto di Mastro Tonio",
      desc: "Sulla scogliera alta, Mastro Tonio ha terminato la nuova Gabbia 3v3 da strada. Vuole vedere se Leo sa far rimbalzare il pallone sui montanti di quercia come faceva papà Enzo negli anni '70.",
      objective: "Visita i Trabucchi e gioca una partita nella Gabbia Street 3v3.",
      coins: 40,
      rewardText: "+40 Monete · Maglia Storica Trabucchi '74",
      checkReady: (prog, B) => {
        return (B && B.seen && B.seen.trabucchi) || (window.openStreetCageMode !== undefined);
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
      objective: "Incontra Pietrino in Piazza durante la Stagione 3 o successiva.",
      coins: 35,
      recruitId: "pietrino",
      recruitName: "Pietrino (Trequartista Fantasista)",
      rewardText: "Recluta Pietrino nel Rondine FC · +35 Monete",
      checkReady: (prog, B) => {
        return (prog && prog.n >= 3) || (B && B.seen && B.seen.pietrino);
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
      objective: "Parla con Dario nel Borgo o esegui la Doppia Rondine.",
      coins: 50,
      rewardText: "+50 Monete · Mossa «Doppia Rondine dei Fratelli» potenziata al massimo!",
      checkReady: (prog, B) => {
        return (prog && prog.n >= 3) || (B && B.seen && B.seen.dario);
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
      targetChar: "mirko",
      title: "Reclutamento: Mirko dei Caruggi",
      sub: "Ingaggia il fantasista di Genova con la coppola del nonno",
      desc: "Mirko ha incantato i vicoli di Genova con i suoi tiri d'esterno sulle serrande. Vuole misurarsi nel grande calcio al fianco di Leo Moretti e Nico Ferri.",
      objective: "Raggiungi Genova o vinci la sfida contro i Topi dei Caruggi.",
      coins: 45,
      recruitId: "mirko",
      recruitName: "Mirko dei Caruggi (Mezzala Dribblatore)",
      rewardText: "Recluta Mirko nel Rondine FC · +45 Monete",
      checkReady: (prog, B) => {
        return (prog && prog.n >= 4) || (B && B.seen && B.seen.mirko);
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
      targetChar: "arbitro",
      title: "L'Eco del Borgo Storto",
      sub: "Sconfiggi l'Arbitro del Paradosso e ferma il tempo",
      desc: "Un rintocco strano risuona dalla cima dell'Orologio del Campanile: il Borgo Storto chiede di nuovo l'intervento dei campioni della Rondine. Varca la crepa ed espugna la torre!",
      objective: "Visita il Borgo Storto e affronta l'Arbitro del Paradosso.",
      coins: 80,
      rewardText: "+80 Monete · Pallone Ossidiana Fluttuante · Trofeo Cosmico",
      checkReady: (prog, B) => {
        try {
          const bs = JSON.parse(localStorage.getItem("ali-di-rondine.borgostorto") || "{}");
          return bs && bs.done && bs.done.includes("n10");
        } catch {
          return false;
        }
      },
      onComplete: () => {
        if (window.toast) window.toast("🏆 Paradosso fermato! Trofeo Multiversale ottenuto!", "success", "🌀");
      }
    }
  ];

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

  // Verifica se ci sono quest nuove o completabili
  function questBoardHasNews() {
    const curSeason = getCurrentSeason();
    const state = loadQuestState();
    const B = typeof window.borgoLoad === "function" ? window.borgoLoad() : (window.B || null);
    const p = typeof window.prog === "function" ? window.prog() : null;

    for (const q of QUEST_DEFS) {
      if (q.season > curSeason) continue;
      // Se già completata, salta
      if (state.completed[q.id]) continue;

      // Se attiva e pronta per la riscossione
      if (state.active[q.id]) {
        if (q.checkReady && q.checkReady(p, B)) return true;
      } else {
        // Nuova quest disponibile da accettare
        return true;
      }
    }
    return false;
  }

  window.questBoardHasNews = questBoardHasNews;

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
            const isReady = !isDone && isActive && q.checkReady && q.checkReady(p, B);

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
