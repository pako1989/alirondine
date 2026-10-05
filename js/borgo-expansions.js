// js/borgo-expansions.js - Nuove Mappe: I Trabucchi & Il Borgo Storto nel motore del Borgo
(function () {
  function initExpansions() {
    const api = window.__borgoApi;
    if (!api) {
      setTimeout(initExpansions, 150);
      return;
    }
    const TRZ = api.TRZ, MN_BORGO_BTN = api.MN_BORGO_BTN, trGo = api.trGo, CAST = api.CAST;
    // personaggi delle nuove mappe (servono per disegnarli e farli parlare)
    Object.assign(CAST, {
      mastro_tonio: { name: "Mastro Tonio", tag: "gray", hair: "#8a8a8a", style: "buzz", skin: "#d49a68", eye: "#1f3a63", bg: ["#8a5a2a", "#d4a373"], beard: true, cap: "#8a5a2a", shirt: "#8a5a2a" },
      nico_trabucchi: { ...CAST.nico, shirt: "#3fa7ff" },
      peppino_gabbiano: { name: "Peppino", tag: "", hair: "#f2f2f2", style: "messy", skin: "#f4f4f4", eye: "#222", bg: ["#9be2ff", "#ffffff"], shirt: "#e8e8e8" },
      ombra_nonna: { ...CAST.nonna, name: "Ombra di Nonna", shirt: "#7c3aed", bg: ["#4c1d95", "#a855f7"] },
      arbitro_storto: { name: "Arbitro Storto", tag: "gray", hair: "#222", style: "buzz", skin: "#e9bf96", eye: "#222", bg: ["#3b0764", "#a855f7"], shirt: "#222" },
      dario_storto: { ...CAST.dario, name: "Dario Storto", shirt: "#7c3aed" }
    });

    // ==========================================
    // 1. NUOVA MAPPA: I TRABUCCHI & LA SCOGLIERA ALTA
    // ==========================================
    TRZ.trabucchi = {
      name: "I Trabucchi · La Scogliera Alta",
      short: "I Trabucchi",
      sub: "Scogliere a picco, antiche passerelle di legno sul mare e la Gabbia del Molo",
      need: 1,
      w: 32,
      h: 22,
      start: [3, 17],
      theme: "isola",
      bus: "a piedi",
      item: ["Legno di Trabucco", "Legni"],
      itemCos: "trabucco_amulet",
      items: [[5, 3], [18, 5], [29, 14], [12, 19]],
      bld: [
        { id: "capanno_reti", x: 2, y: 2, w: 5, h: 4, door: [4, 5], roof: "#8a5a2a", wall: "#d4a373", label: "CAPANNO RETI" },
        { id: "faro_antico", x: 24, y: 1, w: 6, h: 6, door: [26, 6], roof: "#334155", wall: "#cbd5e1", label: "FARO VECCHIO" }
      ],
      build(m, fill) {
        // Scogliera rocciosa e mare aperto
        fill(0, 0, 31, 21, ".");
        fill(0, 0, 31, 0, "R");
        fill(0, 0, 0, 16, "R");
        fill(31, 0, 31, 16, "R");

        // Mare mosso in basso
        fill(0, 19, 31, 21, "~");

        // Passerella in legno sospesa sui flutti (I Trabucchi)
        fill(10, 17, 26, 18, "P");
        fill(14, 18, 16, 21, "P");
        fill(22, 18, 24, 21, "P");

        // Sentiero in pietra ciottolata
        fill(0, 16, 31, 17, "=");
        fill(12, 6, 14, 16, "=");

        // La Gabbia d'Acciaio del Molo Est (Street Soccer Court)
        fill(18, 8, 28, 14, "Y");
        fill(19, 9, 27, 13, "g");
        m[11][18] = "G";
        m[11][28] = "G";

        // Panchina panoramica sul promontorio
        m[3][10] = "V";
        m[16][2] = "S"; // Cartello ritorno al Borgo
      },
      npcs: [
        { id: "mastro_tonio", at: [8, 4] },
        { id: "nico_trabucchi", at: [17, 11] },
        { id: "peppino_gabbiano", at: [23, 19] }
      ],
      areas: [
        [0, 16, 31, 21, "Le Passerelle sui Flutti"],
        [16, 7, 30, 15, "La Gabbia del Molo Est"],
        [0, 0, 16, 15, "Il Capanno di Mastro Tonio"],
        [22, 0, 31, 7, "Il Promontorio del Faro Vecchio"]
      ],
      hints: {
        "Le Passerelle sui Flutti": "Travi in legno d'ulivo sospese sull'acqua dove i pescatori calano le reti da secoli.",
        "La Gabbia del Molo Est": "La gabbia d'acciaio con i muretti a rimbalzo dove si giocano i tornei clandestini 3v3!",
        "Il Capanno di Mastro Tonio": "Puzza di pece, resina e cordame antico. Qui si riparano le barche e si costruiscono i sogni.",
        "Il Promontorio del Faro Vecchio": "Da qui il golfo sembra infinito. Il vento di libeccio profuma di salsedine e ginestre."
      },
      intro: [
        ["voce", "Il sentiero sale lungo la scogliera fino ai Trabucchi: le storiche macchine da pesca in legno protese sul mare aperto."],
        ["mastro_tonio", "Ehilà, ragazzo della Rondine! Da lassù si vede tutta la costa fino a Portofino. E in mezzo agli scogli c'è la Gabbia dei ragazzi!"]
      ]
    };

    // ==========================================
    // 2. NUOVA MAPPA: IL BORGO STORTO NEL MOTORE DEL BORGO
    // ==========================================
    TRZ.borgostorto = {
      name: "Il Borgo Storto · Dimensione Parallattica",
      short: "Borgo Storto",
      sub: "Il Borgo Marino distorto e surreale: nebbia viola, fisica impazzita e campioni d'ombra",
      need: 1,
      w: 32,
      h: 22,
      start: [3, 17],
      theme: "puntanera",
      bus: "portale",
      item: ["Frammento di Focaccia Quantica", "Frammenti"],
      itemCos: "aura_viola",
      items: [[4, 4], [28, 5], [16, 12], [24, 18]],
      bld: [
        { id: "trattoria_storta", x: 2, y: 2, w: 6, h: 5, door: [5, 6], roof: "#7c3aed", wall: "#4c1d95", label: "TRATTORIA QUANTICA" },
        { id: "faro_distorto", x: 23, y: 1, w: 7, h: 6, door: [26, 6], roof: "#a855f7", wall: "#3b0764", label: "FARO SOTTOSOPRA" }
      ],
      build(m, fill) {
        // Pavimento viola distorto
        fill(0, 0, 31, 21, ".");
        fill(0, 0, 31, 0, "R");
        fill(0, 0, 0, 16, "R");
        fill(31, 0, 31, 16, "R");

        // Mare di nebulosa viola
        fill(0, 19, 31, 21, "~");

        // Strade di pietra lunare
        fill(0, 16, 31, 17, "=");
        fill(14, 5, 17, 16, "=");

        // Campo di Calcio Storto
        fill(10, 7, 22, 13, "g");
        m[10][10] = "G";
        m[10][22] = "G";

        // Portale di ritorno
        m[16][2] = "S";
      },
      npcs: [
        { id: "ombra_nonna", at: [7, 5] },
        { id: "arbitro_storto", at: [16, 10] },
        { id: "dario_storto", at: [22, 12] }
      ],
      areas: [
        [0, 16, 31, 21, "Il Molo dell'Iperuranio"],
        [8, 6, 24, 15, "Il Rettangolo Fluttuante"],
        [0, 0, 12, 15, "La Trattoria Parallattica"],
        [20, 0, 31, 7, "Il Faro Rovesciato"]
      ],
      hints: {
        "Il Molo dell'Iperuranio": "Le onde brillano di viola e l'acqua scorre al contrario. Il portale risplende di luce azzurra.",
        "Il Rettangolo Fluttuante": "Un campo da calcio dove i palloni lasciano scie di fotoni e i tiri sfidano la gravità!",
        "La Trattoria Parallattica": "Qui Nonna Ferri inforna teglie a dieci dimensioni. Profumano di cipolla cosmica.",
        "Il Faro Rovesciato": "La luce del faro non illumina il mare: illumina i segreti reconditi del Borgo."
      },
      intro: [
        ["voce", "Attraverso il vortice dimensionale approdi nel Borgo Storto: le case sono specchiate, il cielo è indaco e l'aria vibra di energia arcana."],
        ["ombra_nonna", "Nipote mio! Benvenuto nel retrobottega del destino. Qui si gioca per l'anima del Borgo!"]
      ]
    };

    // ==========================================
    // 3. DIALOGHI & INTERAZIONI NPC DELLE NUOVE MAPPE
    // ==========================================
    function expTalk(id) {
      if (id === "mastro_tonio") {
        return api.trAsk(
          "mastro_tonio",
          "«Vedi queste travi di rovere e castagno, Leo? Resistono alle mareggiate del '66. Proprio come la Rondine. Sul molo est i ragazzi hanno allestito la Gabbia con le reti di ferro. Ti va una sfida da strada o preferisci una partitella in campo?»",
          [
            {
              label: "Entra nella Gabbia del Molo (3v3)",
              sub: "Street Football 2D HD con sponde e barra Grinta",
              cls: "hot",
              fn: () => { if (window.openStreetCageMode) window.openStreetCageMode(api.trResume); }
            },
            {
              label: "Partitella d'Azione 2D HD",
              sub: "Top-Down Action Soccer a 60fps con Aftertouch",
              cls: "hot",
              fn: () => { if (window.openActionSoccerHD) window.openActionSoccerHD(api.trResume); }
            },
            {
              label: "Ascolta le leggende dei Trabucchi",
              sub: "Storie di mare e pescatori",
              fn: () => {
                api.trSay([
                  api.L("mastro_tonio", "Nel '58 tuo nonno Dante tirò una botta al volo da questo sperone di roccia: la palla superò il trabucco e cadde dritta nella rete di prua del gozzo di Baciccia. Fu proclamato gol dell'anno tra le risate di tutta la banchina!"),
                  api.L("voce", "Mastro Tonio ti dona un antico ciondolo di legno d'ulivo levigato dal mare. (+10 Monete)")
                ], () => {
                  if (window.addCoins) window.addCoins(10);
                  if (window.toast) window.toast("Ottenuto Ciondolo del Trabucco! (+10 monete)", "success", "🪵");
                  api.trResume();
                });
              }
            }
          ]
        );
      }

      if (id === "nico_trabucchi") {
        return api.trAsk(
          "nico",
          "«Leo! Questa gabbia con i muri a sponda è fantastica: puoi far rimbalzare la palla sui muri per smarcarmi al volo! Oppure organizziamo il torneo tattico del Faro?»",
          [
            {
              label: "Sfida nella Gabbia (Street 3v3)",
              sub: "Street Football 2D HD",
              cls: "hot",
              fn: () => { if (window.openStreetCageMode) window.openStreetCageMode(api.trResume); }
            },
            {
              label: "Rondine Emblem: Torneo Tattico 2D HD",
              sub: "Tactical Soccer RPG stile Fire Emblem",
              cls: "hot",
              fn: () => { if (window.openTacticalEmblemMode) window.openTacticalEmblemMode(api.trResume); }
            },
            {
              label: "Matchday Director 2D HD",
              sub: "Guida la Rondine dalla panchina in tempo reale",
              cls: "hot",
              fn: () => { if (window.openMatchDirectorHD) window.openMatchDirectorHD(api.trResume); }
            }
          ]
        );
      }

      if (id === "peppino_gabbiano") {
        return api.trSay([
          api.L("voce", "Il gabbiano Peppino ti guarda con occhi vispi, fa due salti sulla staccionata di legno e lancia un garrito d'approvazione!"),
          api.L("voce", "Tiri fuori una briciola di focaccia ligure: Peppino l'afferra al volo e lascia cadere una moneta d'argento recuperata dal fondale! (+5 Monete)")
        ], () => {
          if (window.addCoins) window.addCoins(5);
          if (window.toast) window.toast("Peppino ringrazia! (+5 Monete)", "success", "🦅");
          api.trResume();
        });
      }

      // Dialoghi del Borgo Storto in-engine!
      if (id === "ombra_nonna") {
        return api.trAsk(
          "ombra_nonna",
          "«Nel Borgo Storto le leggi della fisica sono solo consigli non vincolanti. Vuoi sferrare il Tiro della Rondine Dimensionale o sfidare i campioni dell'Ombra?»",
          [
            {
              label: "Sfida Tattica Rondine Emblem 2D HD",
              sub: "Triangolo dello stile e duelli cinematografici",
              cls: "hot",
              fn: () => { if (window.openTacticalEmblemMode) window.openTacticalEmblemMode(api.trResume); }
            },
            {
              label: "Partita d'Azione Spaziale 2D HD",
              sub: "Calcio d'azione a 60fps",
              cls: "hot",
              fn: () => { if (window.openActionSoccerHD) window.openActionSoccerHD(api.trResume); }
            },
            {
              label: "Apri lo spin-off completo Il Borgo Storto",
              sub: "Versione classica completa",
              fn: () => { if (window.openBorgoStortoModal) window.openBorgoStortoModal(); else location.href = "borgo-storto.html"; }
            }
          ]
        );
      }

      if (id === "arbitro_storto") {
        return api.trAsk(
          "arbitro_storto",
          "«Cartellino d'ambra per violazione della gravità! Nel Borgo Storto vinci solo se sai dirigere la squadra con mente tattica o dominare l'uno contro uno!»",
          [
            {
              label: "Dirigi la Gara (Matchday Director 2D HD)",
              sub: "Gestionale tattico in tempo reale",
              cls: "hot",
              fn: () => { if (window.openMatchDirectorHD) window.openMatchDirectorHD(api.trResume); }
            },
            {
              label: "Duello Tattico Rondine Emblem",
              sub: "Combattimento RPG stile Fire Emblem",
              cls: "hot",
              fn: () => { if (window.openTacticalEmblemMode) window.openTacticalEmblemMode(api.trResume); }
            }
          ]
        );
      }

      if (id === "dario_storto") {
        return api.trAsk(
          "dario_storto",
          "«Leo! In questa dimensione non c'è rivalità tra fratelli: siamo la coppia d'attacco più forte della galassia. Ti va una gabbia 3v3 con me e Nico, o proviamo la leggendaria Doppia Rondine?»",
          [
            {
              label: "🔥 Doppia Rondine dei Fratelli Moretti",
              sub: "Sferra l'attacco combinato leggendario con Dario!",
              cls: "hot",
              fn: () => {
                api.trSay([
                  api.L("dario_storto", "«Pronto Leo? Tu crossa teso sul secondo palo col compasso, io ci metto la rovesciata d'ossidiana!»"),
                  api.L("voce", "⚡🔥 I due fratelli colpiscono all'unisono: un fulmine azzurro e nero squarcia la nebbia viola del Borgo Storto! (+25 Monete e trofeo sbloccato!)")
                ], () => {
                  if (window.addCoins) window.addCoins(25);
                  if (window.fireConfetti) window.fireConfetti();
                  if (window.toast) window.toast("🔥 Doppia Rondine dei Fratelli Moretti eseguita con successo!", "success", "⚽");
                  api.trResume();
                });
              }
            },
            {
              label: "Gabbia 3v3 dei Trabucchi (Street Soccer)",
              sub: "Gioca con Dario e Nico in 2D HD",
              cls: "hot",
              fn: () => { if (window.openStreetCageMode) window.openStreetCageMode(api.trResume); }
            },
            {
              label: "Partita d'Azione 2D HD",
              sub: "Top-Down Soccer",
              cls: "hot",
              fn: () => { if (window.openActionSoccerHD) window.openActionSoccerHD(api.trResume); }
            }
          ]
        );
      }

    }
    const EXP_NPC = ["mastro_tonio", "nico_trabucchi", "peppino_gabbiano", "ombra_nonna", "arbitro_storto", "dario_storto"];
    window.trTalkHook = function (id) {
      if (!EXP_NPC.includes(id)) return false;
      expTalk(id);
      return true;
    };

    // ==========================================
    // 4. INTEGRAZIONE IN MENU BORGO & TRASFERTE
    // ==========================================
    if (Array.isArray(MN_BORGO_BTN)) {
      MN_BORGO_BTN.unshift(
        () => ({
          label: "🌅 I Trabucchi & La Scogliera Alta",
          sub: "Nuova mappa · scogliere, passerelle sul mare e gabbia da strada",
          cls: "hot",
          fn: () => trGo("trabucchi")
        }),
        () => ({
          label: "🌀 Il Borgo Storto (nel Borgo)",
          sub: "Nuova mappa · il Borgo distorto, da esplorare a piedi",
          cls: "hot",
          fn: () => trGo("borgostorto")
        })
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExpansions);
  } else {
    initExpansions();
  }
})();
