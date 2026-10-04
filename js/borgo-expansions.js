// js/borgo-expansions.js - Nuove Mappe: I Trabucchi & Il Borgo Storto nel motore del Borgo
(function () {
  function initExpansions() {
    if (typeof TRZ === "undefined") {
      setTimeout(initExpansions, 150);
      return;
    }

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
      theme: "trabucchi",
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
      theme: "borgostorto",
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
        m[16][2] = "O";
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
    const origTrTalk = window.trTalk;
    window.trTalk = function (id) {
      if (id === "mastro_tonio") {
        return window.trAsk(
          "mastro_tonio",
          "«Vedi queste travi di rovere e castagno, Leo? Resistono alle mareggiate del '66. Proprio come la Rondine. Sul molo est i ragazzi hanno allestito la Gabbia con le reti di ferro. Ti va una sfida da strada o preferisci una partitella in campo?»",
          [
            {
              label: "Entra nella Gabbia del Molo (3v3)",
              sub: "Street Football 2D HD con sponde e barra Grinta",
              cls: "hot",
              fn: () => { if (window.openStreetCageMode) window.openStreetCageMode(window.trResume); }
            },
            {
              label: "Partitella d'Azione 2D HD",
              sub: "Top-Down Action Soccer a 60fps con Aftertouch",
              cls: "hot",
              fn: () => { if (window.openActionSoccerHD) window.openActionSoccerHD(window.trResume); }
            },
            {
              label: "Ascolta le leggende dei Trabucchi",
              sub: "Storie di mare e pescatori",
              fn: () => {
                window.trSay([
                  window.L("mastro_tonio", "Nel '58 tuo nonno Dante tirò una botta al volo da questo sperone di roccia: la palla superò il trabucco e cadde dritta nella rete di prua del gozzo di Baciccia. Fu proclamato gol dell'anno tra le risate di tutta la banchina!"),
                  window.L("voce", "Mastro Tonio ti dona un antico ciondolo di legno d'ulivo levigato dal mare. (+10 Monete)")
                ], () => {
                  if (window.addCoins) window.addCoins(10);
                  if (window.toast) window.toast("Ottenuto Ciondolo del Trabucco! (+10 monete)", "success", "🪵");
                  window.trResume();
                });
              }
            }
          ]
        );
      }

      if (id === "nico_trabucchi") {
        return window.trAsk(
          "nico",
          "«Leo! Questa gabbia con i muri a sponda è fantastica: puoi far rimbalzare la palla sui muri per smarcarmi al volo! Oppure organizziamo il torneo tattico del Faro?»",
          [
            {
              label: "Sfida nella Gabbia (Street 3v3)",
              sub: "Street Football 2D HD",
              cls: "hot",
              fn: () => { if (window.openStreetCageMode) window.openStreetCageMode(window.trResume); }
            },
            {
              label: "Rondine Emblem: Torneo Tattico 2D HD",
              sub: "Tactical Soccer RPG stile Fire Emblem",
              cls: "hot",
              fn: () => { if (window.openTacticalEmblemMode) window.openTacticalEmblemMode(window.trResume); }
            },
            {
              label: "Matchday Director 2D HD",
              sub: "Guida la Rondine dalla panchina in tempo reale",
              cls: "hot",
              fn: () => { if (window.openMatchDirectorHD) window.openMatchDirectorHD(window.trResume); }
            }
          ]
        );
      }

      if (id === "peppino_gabbiano") {
        return window.trSay([
          window.L("voce", "Il gabbiano Peppino ti guarda con occhi vispi, fa due salti sulla staccionata di legno e lancia un garrito d'approvazione!"),
          window.L("voce", "Tiri fuori una briciola di focaccia ligure: Peppino l'afferra al volo e lascia cadere una moneta d'argento recuperata dal fondale! (+5 Monete)")
        ], () => {
          if (window.addCoins) window.addCoins(5);
          if (window.toast) window.toast("Peppino ringrazia! (+5 Monete)", "success", "🦅");
          window.trResume();
        });
      }

      // Dialoghi del Borgo Storto in-engine!
      if (id === "ombra_nonna") {
        return window.trAsk(
          "nonna",
          "«Nel Borgo Storto le leggi della fisica sono solo consigli non vincolanti. Vuoi sferrare il Tiro della Rondine Dimensionale o sfidare i campioni dell'Ombra?»",
          [
            {
              label: "Sfida Tattica Rondine Emblem 2D HD",
              sub: "Triangolo dello stile e duelli cinematografici",
              cls: "hot",
              fn: () => { if (window.openTacticalEmblemMode) window.openTacticalEmblemMode(window.trResume); }
            },
            {
              label: "Partita d'Azione Spaziale 2D HD",
              sub: "Calcio d'azione a 60fps",
              cls: "hot",
              fn: () => { if (window.openActionSoccerHD) window.openActionSoccerHD(window.trResume); }
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
        return window.trAsk(
          "arbitro",
          "«Cartellino d'ambra per violazione della gravità! Nel Borgo Storto vinci solo se sai dirigere la squadra con mente tattica o dominare l'uno contro uno!»",
          [
            {
              label: "Dirigi la Gara (Matchday Director 2D HD)",
              sub: "Gestionale tattico in tempo reale",
              cls: "hot",
              fn: () => { if (window.openMatchDirectorHD) window.openMatchDirectorHD(window.trResume); }
            },
            {
              label: "Duello Tattico Rondine Emblem",
              sub: "Combattimento RPG stile Fire Emblem",
              cls: "hot",
              fn: () => { if (window.openTacticalEmblemMode) window.openTacticalEmblemMode(window.trResume); }
            }
          ]
        );
      }

      if (id === "dario_storto") {
        return window.trAsk(
          "dario",
          "«Leo! In questa dimensione non c'è rivalità tra fratelli: siamo la coppia d'attacco più forte della galassia. Ti va una gabbia 3v3 con me e Nico contro i campioni dell'Ossidiana?»",
          [
            {
              label: "Gabbia 3v3 dei Trabucchi (Street Soccer)",
              sub: "Gioca con Dario e Nico in 2D HD",
              cls: "hot",
              fn: () => { if (window.openStreetCageMode) window.openStreetCageMode(window.trResume); }
            },
            {
              label: "Partita d'Azione 2D HD",
              sub: "Top-Down Soccer",
              cls: "hot",
              fn: () => { if (window.openActionSoccerHD) window.openActionSoccerHD(window.trResume); }
            }
          ]
        );
      }

      if (typeof origTrTalk === "function") {
        return origTrTalk(id);
      }
    };

    // ==========================================
    // 4. INTEGRAZIONE IN MENU BORGO & TRASFERTE
    // ==========================================
    if (typeof MN_BORGO_BTN !== "undefined" && Array.isArray(MN_BORGO_BTN)) {
      MN_BORGO_BTN.unshift(
        {
          label: "🌅 I Trabucchi & La Scogliera Alta",
          sub: "Nuova Mappa · Scogliere, gabbia da strada e brezza marina",
          cls: "hot",
          fn: () => {
            if (typeof trGo === "function") trGo("trabucchi");
          }
        },
        {
          label: "🌀 Il Borgo Storto (Nel Motore del Borgo)",
          sub: "Nuova Mappa · Esplora il Borgo Storto direttamente con il motore grafico a tessere!",
          cls: "hot",
          fn: () => {
            if (typeof trGo === "function") trGo("borgostorto");
          }
        }
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExpansions);
  } else {
    initExpansions();
  }
})();
