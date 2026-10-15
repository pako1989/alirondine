// js/alcatraz.js - «FUGA DA ALCATRAZ FC · LA GRANDE EVASIONE» · Configurazione saga su js/saga-core.js
// Heist / Noir Ironico nel celebre penitenziario di massima sicurezza su un'isola spazzata dai fari.
// Il Campione, finito dentro per uno scambio d'identità, deve guidare la squadra dei detenuti del Braccio Ovest,
// organizzare il piano di fuga con Bruno il Barbiere e Smilzo Sam, e giocarsi tutto nella grande partita contro le Guardie.
// Novità di questa saga:
//  - CALCIO A PARETE · REBOUND HEIST (js/alcatraz-partita.js): partita 3v3 con sponde metalliche a rimbalzo elastico e riflettori mobili.
//  - SISTEMA ALLERTA & SCASSO (K.allarme, K.scasso): livello d'allerta delle torrette e serrature da aprire con i grimaldelli.
//  - ESTETICA CARCERARIA RETRÒ: cemento bagnato, fari di ronda nella nebbia marina, grate d'acciaio e maglie a strisce.
(function () {
  "use strict";
  if (window.__alcatraz || !window.__sagaCore) return;

  const INDIZI = {
    mappa: [
      "REPERTO N° 1 · LO SCHIZZO DEL CONDOTTO DI VENTILAZIONE",
      "REPERTO: Foglietto di carta oleata nascosto dentro una saponetta",
      "«LA VIA DELLA BARBERIA»",
      "Il condotto dietro lo specchio di Bruno porta direttamente al locale caldaie sotto il cortile d'asfalto. Richiede una chiave a brugola o tre grimaldelli."
    ],
    fischietto: [
      "REPERTO N° 2 · IL FISCHIETTO D'ACCIAIO DELLA GUARDIA TONELLI",
      "REPERTO: Fischietto regolamentare con cordoncino tricolore",
      "«IL CAMBIO DELLA GUARDIA»",
      "Alle 21:45 le torrette invertono il giro dei riflettori per novanta secondi: è l'unico momento in cui la fascia destra del campo resta nell'ombra totale."
    ],
    lima: [
      "REPERTO N° 3 · LA LIMA A CORDA DI SMILZO SAM",
      "REPERTO: Treccia d'acciaio dentata arrotolata nel calzino",
      "«IL VARCO NEL RETICOLATO»",
      "La recinzione dietro la porta est ha una maglia allentata dalla salsedine. Con due tagli precisi si può passare sul molo senza far scattare i sensori."
    ],
    pallone: [
      "REPERTO N° 4 · IL PALLONE IMBOTTITO DEL BRACCIO OVEST",
      "REPERTO: Cuoio grezzo cucito a mano con fili di canapa rinforzati",
      "«LA TRAIETTORIA DELLA LIBERTÀ»",
      "Il pallone rimbalza il doppio sulle paratie di lamiera. Chi sa calcolare l'angolo di 45 gradi può spedire la sfera oltre il guardalinee."
    ]
  };

  const E = window.__sagaCore.create({
    id: "alcatraz",
    key: "ali-di-rondine.alcatraz",
    title: "Fuga da Alcatraz FC · La Grande Evasione",
    icon: "⛓️",
    bg: "alc_titolo",
    chapters: 3,
    menuSub: "L'isola rocciosa, i riflettori nella notte e la grande evasione durante la partita contro le Guardie",
    theme: {
      accent: "#38bdf8",
      ink: "#0f172a",
      paper: "rgba(241,245,249,.96)",
      font: "'Courier New', monospace, system-ui",
      chipBg: "#e2e8f0",
      chipBorder: "#475569"
    },
    stats: {
      chiavi: [0, 99, 1, "Grimaldelli & Chiavi (🗝️)"],
      sospetto: [0, 99, 10, "Livello d'Allerta Guardie (🚨)"]
    },
    regions: {
      carcere: {
        grass: "#334155",
        path: "#475569",
        stone: "#1e293b",
        wall: "#0f172a",
        water: "#0c4a6e",
        tree: "#1e293b",
        tint: "#0284c7",
        fx: "dust",
        dark: true
      }
    },
    paint: {
      R(K, sx, sy, tx, ty) {
        // Sbarre di ferro verticali
        const g = K.g;
        g.fillStyle = "#0f172a";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#64748b";
        for (let i = 2; i < 16; i += 4) {
          g.fillRect(sx + i, sy, 2, 16);
        }
      },
      G(K, sx, sy, tx, ty) {
        // Grata metallica di scolo
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#475569";
        g.strokeRect(sx + 2, sy + 2, 12, 12);
        for (let i = 4; i < 14; i += 3) {
          g.fillRect(sx + i, sy + 2, 1, 12);
          g.fillRect(sx + 2, sy + i, 12, 1);
        }
      },
      F(K, sx, sy, tx, ty) {
        // Faro / riflettore torretta
        const g = K.g;
        g.fillStyle = "#0f172a";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#facc15";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 5, 0, Math.PI * 2);
        g.fill();
      },
      B(K, sx, sy, tx, ty) {
        // Banchina in cemento con bitte
        const g = K.g;
        g.fillStyle = "#475569";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#94a3b8";
        g.fillRect(sx + 6, sy + 5, 4, 6);
      },
      P(K, sx, sy, tx, ty) {
        // Porta blindata d'acciaio
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#0284c7";
        g.fillRect(sx + 3, sy + 3, 10, 10);
        g.fillStyle = "#f8fafc";
        g.fillRect(sx + 10, sy + 7, 2, 2);
      }
    },
    solid: "WRFPB#~T",
    item: "Grimaldello d'ottone",
    drawItem(K, sx, sy) {
      const g = K.g;
      g.fillStyle = "#facc15";
      g.fillRect(sx + 4, sy + 7, 8, 2);
      g.fillRect(sx + 10, sy + 9, 2, 3);
      g.fillRect(sx + 7, sy + 9, 2, 2);
      g.beginPath();
      g.arc(sx + 4, sy + 8, 3, 0, Math.PI * 2);
      g.stroke();
    },
    endings: {
      evasione: ["La Notte dell'Evasione", "Vittoria in campo e fuga perfetta attraverso il condotto con Bruno e Sam.", "Sali sulla motovedetta."],
      patto: ["Il Patto del Direttore", "Trionfo leale: Cardenas riconosce l'errore d'identità e firma la grazia ufficiale.", "Fidati della parola del Direttore."],
      barbiere: ["La Barberia della Roccia", "Decidi di restare sull'isola come allenatore e barbiere del penitenziario.", "Resta dove sei amato."],
      segreto: ["Il Tunnel Segreto della Roccia", "Grimaldelli raccolti, allarme basso e scoperta del tunnel sottomarino.", "Serve cautela e almeno due grimaldelli."]
    },
    guest: {
      id: "alc_bruno",
      lines: [
        "Il segreto di una bella barba e di un bel cross è lo stesso: mano ferma e nessun tremolio.",
        "Al Borgo l'aria è più profumata che sull'isola, ma qui chi marca sui calci d'angolo?"
      ]
    },
    stadium: {
      venue: {
        ads: [["ALCATRAZ PENITENTIARY", "#38bdf8"], ["TORNEO DEI BRACCI", "#f59e0b"], ["GUARDARE MA NON TOCCARE", "#ef4444"]],
        crowd: false,
        ground: ["#1e293b", "#0f172a"],
        line: "#64748b",
        tint: "rgba(56,189,248,0.12)",
        glow: "56,189,248",
        sky: ["#020617", "#0f172a"],
        wall: ["#0f172a", "#1e293b"],
        fx: { fr: 1.25, spd: 0.95, wind: 0.6 }
      },
      azPitch: "cortile",
      cageField: 1,
      cageMut: "heavy",
      weather: "pioggia"
    }
  });

  const { K } = E;

  // Funzione d'allarme per la saga
  K.allarme = (delta, motivo) => {
    const n = K.bond("sospetto", delta);
    if (delta > 0) {
      try { if (K.SFX) K.SFX("whistle"); } catch (_) {}
      K.say([["voce", `🚨 <b>ALLERTA GUARDIE SALITA A ${n}!</b><br><span style="color:var(--dim)">${motivo || "Passi di scarponi risuonano sui camminamenti."}</span>`]]);
    }
  };

  // Funzione di scasso serrature
  K.scasso = (diff, okFn, failFn) => {
    const chiavi = K.stat("chiavi");
    K.ask("voce", `C'è una serratura blindata (Difficoltà ${diff}). Come procedi?`, [
      {
        label: `🗝️ Usa un grimaldello (${chiavi} disponibili)`,
        fn: () => {
          if (chiavi > 0) {
            K.bond("chiavi", -1);
            K.say([["voce", "<i>*CLAC!*</i> Il pistoncino metallico scatta docilmente. Serratura aperta!"]], okFn);
          } else {
            K.say([["voce", "Non hai grimaldelli! Il meccanismo bloccato stride e attira l'attenzione."]], () => {
              K.allarme(15, "Tentativo di scasso rumoroso!");
              if (failFn) failFn();
            });
          }
        }
      },
      {
        label: "🔨 Forza di spalla (fa rumore)",
        fn: () => {
          K.allarme(20, "Un tonfo sordo rimbomba nel corridoio!");
          K.say([["voce", "I cardini cedono sotto il colpo, ma l'eco ha insospettito le guardie!"]], okFn);
        }
      },
      {
        label: "↩️ Lascia stare per ora",
        fn: () => { K.done(); }
      }
    ]);
  };

  window.__alcatraz = E.api;
})();
