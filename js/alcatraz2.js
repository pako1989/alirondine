// js/alcatraz2.js - «FUGA DA ALCATRAZ FC 2 · L'ULTIMO RIENTRO»
// Configurazione saga su js/saga-core.js
// Heist d'infiltrazione subacquea nel penitenziario privatizzato dal Consorzio Cerbero.
(function () {
  "use strict";
  if (window.__alcatraz2 || !window.__sagaCore) return;

  const INDIZI = {
    progetto: [
      "REPERTO N° 1 · IL PROGETTO IDRAULICO DELLE CISTERNE (1918)",
      "REPERTO: Pianta eliografica su tela cerata bluastra",
      "«LE CONDOTTE DI SCARICO BORBONICHE»",
      "Il livello -3 ospita una rete di canali che convoglia le acque reflue direttamente sotto la Torre Faro. Con una pressione a 60 bar, la chiusa maestra si apre automaticamente."
    ],
    cifrario: [
      "REPERTO N° 2 · IL CIFRARIO NAVALE DEL CONSORZIO CERBERO",
      "REPERTO: Rullino microfilm nascosto nel filtro di un respiratore",
      "«LA ROTTA DELLE MOTOVEDETTE»",
      "Le boe sonar invertono la polarità ogni dieci minuti. C'è una finestra di novanta secondi per attraversare la risacca della Falesia Nord senza generare onde d'allerta."
    ],
    fischietto_ottone: [
      "REPERTO N° 3 · IL FISCHIETTO D'OTTONE DI TONELLI",
      "REPERTO: Fischietto consunto con l'incisione «Matricola 109»",
      "«IL RISCATTO DELLA VECCHIA GUARDIA»",
      "Tonelli conosce le combinazioni delle celle d'isolamento. Restituirgli il fischietto assicura la lealtà dei veterani durante la sommossa."
    ],
    sfera_piombo: [
      "REPERTO N° 4 · LA SFERA EQUILIBRATA IN TITANIO",
      "REPERTO: Pallone da calcetto rinforzato con camere d'aria in neoprene",
      "«IL RIMBALZO DELLA CISTERNA»",
      "Progettata da Rebecca per galleggiare a pelo d'acqua: sui rimbalzi bassi non perde velocità e taglia le pozzanghere come un siluro."
    ]
  };

  const E = window.__sagaCore.create({
    id: "alcatraz2",
    key: "ali-di-rondine.alcatraz2",
    title: "Fuga da Alcatraz FC 2 · L'Ultimo Rientro",
    icon: "🌊",
    bg: "alc2_titolo",
    chapters: 4,
    menuSub: "L'infiltrazione subacquea notturna, il calcio a parete idraulico e la liberazione dei compagni",
    theme: {
      accent: "#38bdf8",
      ink: "#020617",
      paper: "rgba(240,249,255,.96)",
      font: "'Courier New', monospace, system-ui",
      chipBg: "#0c4a6e",
      chipBorder: "#38bdf8"
    },
    stats: {
      allerta: [0, 100, 10, "Livello d'Allerta Cerbero (🚨)"],
      pressione: [0, 100, 30, "Pressione Idraulica Paratie (🚰)"],
      chiavi: [0, 99, 2, "Grimaldelli in Titanio (🗝️)"]
    },
    regions: {
      carcere_sommerso: {
        grass: "#1e293b",
        path: "#334155",
        stone: "#0f172a",
        wall: "#020617",
        water: "#0369a1",
        tree: "#0c4a6e",
        tint: "#0284c7",
        fx: "rain",
        dark: true
      }
    },
    paint: {
      F(K, sx, sy) {
        // Faro / proiettore rotante ultravioletto
        const g = K.g;
        g.fillStyle = "#0f172a";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#38bdf8";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 5, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "rgba(56,189,248,0.3)";
        g.strokeRect(sx + 2, sy + 2, 12, 12);
      },
      R(K, sx, sy) {
        // Sbarre d'acciaio bagnate
        const g = K.g;
        g.fillStyle = "#020617";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#475569";
        for (let i = 2; i < 16; i += 4) {
          g.fillRect(sx + i, sy + 1, 2, 14);
        }
      },
      G(K, sx, sy) {
        // Paratia idraulica semovente
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#0284c7";
        g.fillRect(sx + 2, sy + 4, 12, 8);
        g.fillStyle = "#facc15";
        g.fillRect(sx + 6, sy + 6, 4, 4);
      },
      V(K, sx, sy) {
        // Valvola a timone di ghisa
        const g = K.g;
        g.fillStyle = "#0f172a";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#f59e0b";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 6, 0, Math.PI * 2);
        g.stroke();
        g.fillRect(sx + 7, sy + 4, 2, 8);
        g.fillRect(sx + 4, sy + 7, 8, 2);
      },
      B(K, sx, sy) {
        // Banchina bagnata con bitte
        const g = K.g;
        g.fillStyle = "#334155";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#64748b";
        g.fillRect(sx + 5, sy + 5, 6, 6);
      },
      P(K, sx, sy) {
        // Porta stagna Cerbero
        const g = K.g;
        g.fillStyle = "#0f172a";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#38bdf8";
        g.strokeRect(sx + 2, sy + 2, 12, 12);
        g.fillStyle = "#e2e8f0";
        g.fillRect(sx + 6, sy + 7, 4, 2);
      },
      C(K, sx, sy) {
        // Cisterna con riflessi d'acqua
        const g = K.g;
        g.fillStyle = "#082f49";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(56,189,248,0.4)";
        g.fillRect(sx + 3, sy + 6, 10, 4);
      }
    },
    solid: "WRFGVPBC#~T",
    item: "Grimaldello in titanio",
    drawItem(K, sx, sy) {
      const g = K.g;
      g.fillStyle = "#38bdf8";
      g.fillRect(sx + 3, sy + 7, 10, 2);
      g.fillRect(sx + 11, sy + 9, 2, 4);
      g.fillRect(sx + 8, sy + 9, 2, 3);
      g.beginPath();
      g.arc(sx + 4, sy + 8, 3, 0, Math.PI * 2);
      g.stroke();
    },
    endings: {
      marsiglia: [
        "La Rotta di Marsiglia",
        "Evacuazione sul motoscafo di Dario lasciando l'isola al suo destino.",
        "Sali a bordo verso Marsiglia."
      ],
      guardia: [
        "La Nuova Guardia",
        "Alleanza leale tra detenuti ed ex guardie: l'isola diventa una colonia autogestita e scuola calcio federale.",
        "Fidati del riscatto di Tonelli e delle guardie."
      ],
      porto_franco: [
        "Il Bastione Libero",
        "Sabotaggio delle turbine e fortezza trasformata in porto franco libero autogestito.",
        "Asseconda il piano anarchico di Rebecca."
      ],
      segreto: [
        "Il Faro di Rondine",
        "Senza allarmi, con tutti i grimaldelli in titanio e la fiducia di tutti, grazia plenaria per tutti i detenuti.",
        "Serve furtività assoluta, rispetto totale e tutte le chiavi."
      ]
    },
    guest: {
      id: "alc2_rebecca",
      lines: [
        "Il mare qui a Borgo Marino è troppo calmo... quasi mi manca l'odore di nafta e allarme di Alcatraz.",
        "Se qualcuno cerca una saldatura subacquea per il gozzo di Baciccia, sapete dove trovarmi: dove l'acqua è più profonda."
      ]
    },
    stadium: {
      venue: {
        ads: [["CONSORZIO CERBERO", "#ef4444"], ["SUB-WATER HEIST '95", "#38bdf8"], ["PARATIE AD ALTA PRESSIONE", "#f59e0b"]],
        crowd: false,
        ground: ["#082f49", "#020617"],
        line: "rgba(56,189,248,0.5)",
        tint: "rgba(6,182,212,0.15)",
        glow: "6,182,212",
        sky: ["#020617", "#0c4a6e"],
        wall: ["#0f172a", "#1e293b"],
        fx: { fr: 1.25, spd: 0.95, wind: 0.6 }
      },
      azPitch: "cisterna",
      cageField: 1,
      cageMut: "heavy",
      weather: "pioggia"
    }
  });

  const { K } = E;

  // Funzione d'allarme Cerbero
  K.allarme = (delta, motivo) => {
    const n = K.bond("allerta", delta);
    if (delta > 0) {
      try { if (K.SFX) K.SFX("whistle"); } catch (_) {}
      K.say([["voce", `🚨 <b>ALLERTA CERBERO SALITA A ${n}!</b><br><span style="color:var(--dim)">${motivo || "I sonar delle motovedette hanno rilevato un'anomalia."}</span>`]]);
    }
  };

  // Funzione scasso con grimaldelli in titanio
  K.scasso = (diff, okFn, failFn) => {
    const chiavi = K.stat("chiavi");
    K.ask("voce", `C'è una serratura stagna corazzata (Difficoltà ${diff}). Come procedi?`, [
      {
        label: `🗝️ Usa grimaldello in titanio (${chiavi} disponibili)`,
        fn: () => {
          if (chiavi > 0) {
            K.bond("chiavi", -1);
            K.say([["voce", "<i>*ZAC-CLAC!*</i> Il titanio non flette. I perni scattano all'unisono in perfetto silenzio!"]], okFn);
          } else {
            K.say([["voce", "Non hai grimaldelli! Il metallo stride provocando scintille sott'acqua."]], () => {
              K.allarme(20, "Tentativo di scasso forzato rumoroso!");
              if (failFn) failFn();
            });
          }
        }
      },
      {
        label: "🚰 Sfonda con leva a pressione (rischio rumore)",
        fn: () => {
          K.allarme(25, "Un getto d'acqua compressa fa saltare i rivetti con un boato!");
          K.say([["voce", "La porta cede sotto la spinta idraulica, ma le sentinelle sono in allarme!"]], okFn);
        }
      },
      {
        label: "↩️ Cerca un altro passaggio",
        fn: () => { K.done(); }
      }
    ]);
  };

  // Regolazione idraulica
  K.valvola = (delta) => {
    const p = K.bond("pressione", delta);
    K.say([["voce", `🚰 <b>PRESSIONE PARATIE REGOLATA A ${p} BAR!</b><br><span style="color:var(--dim)">I manometri oscillano mentre l'acqua defluisce nei canali.</span>`]]);
  };

  // Matrice Idraulica / Water-Gate Matrix
  K.waterGate = (level, notify) => {
    K.waterLevel = level;
    if (notify !== false) {
      const names = ["Asciutto (terreno stabile)", "Pelo d'acqua (rimbalzi radenti ultra-rapidi)", "Sommerso fino al ginocchio (forte resistenza)"];
      K.say([["voce", `🌊 <b>MATRICE IDRAULICA ATTIVATA:</b> ${names[level] || "Livello standard"}`]]);
    }
  };

  // Controllo eredità dal primo Alcatraz
  K.getHeritage = () => {
    try {
      const raw = localStorage.getItem("ali-di-rondine.alcatraz");
      if (!raw) return "nessuno";
      const data = JSON.parse(raw);
      if (data && data.endings) {
        if (data.endings.evasione) return "evasione";
        if (data.endings.patto) return "patto";
        if (data.endings.barbiere) return "barbiere";
        if (data.endings.scatola) return "scatola";
      }
    } catch (_) {}
    return "nessuno";
  };

  window.__alcatraz2 = E.api;
  window.__alcatraz2Core = E;
})();
