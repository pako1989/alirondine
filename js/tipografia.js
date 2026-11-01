// js/tipografia.js — «LA TIPOGRAFIA DI MEZZANOTTE · L'ULTIMA EDIZIONE»
// Borgo Alta, ottobre 1968. Tra piombo fuso, edicole in ferro battuto verde, Bar Sport e camera oscura,
// Ada Carattere e la piccola redazione de «L'Eco del Pallone» (fondato nel 1921) difendono il giornale e il Campo delle Acacie
// dalla speculazione edilizia del Commendator Ettore Sartori («Stampa Moderna»).
// Meccanica condivisa in saga-core.js: IL BANCONE D'IMPAGINAZIONE / PRIMA PAGINA (cfg.press) + minigioco originale js/flash68.js.
(function () {
  "use strict";
  if (window.__tipografia || !window.__sagaCore) return;

  const E = window.__sagaCore.create({
    id: "tipografia",
    key: "ali-di-rondine.tipografia",
    title: "La Tipografia di Mezzanotte",
    icon: "📰",
    bg: "tp_titolo",
    chapters: 4,
    menuSub: "Borgo Alta, ottobre 1968. L'editore Sartori vuole chiudere «L'Eco del Pallone» e cementificare il Campo delle Acacie: componi la Prima Pagina sul bancone di piombo e scendi in campo con il flash di Clara Luce.",
    theme: {
      accent: "#eab308",
      ink: "#f5ebd6",
      paper: "rgba(26,22,19,.95)",
      font: "Georgia, 'Trebuchet MS', serif",
      chipBg: "#1f6f54",
      chipBorder: "#eab308"
    },
    stats: {
      copie: [0, 32, 3, "Migliaia di copie"],
      verita: [0, 12, 0, "Verità d'Inchiostro"],
      tiratura: [0, 12, 0, "Tiratura Popolare"]
    },
    weight: {
      name: "Linea Editoriale",
      axes: {
        verita: ["Verità d'Inchiostro", "🖋️"],
        tiratura: ["Tiratura Popolare", "📰"]
      }
    },
    item: ["Gettone telefonico", "Gettoni telefonici"],
    drawItem(g, x, y, i, f) {
      const w = [4.2, 3, 1.2, 3][Math.floor(f / 8 + i) % 4];
      g.save();
      g.translate(x, y + Math.sin(f / 11 + i) * 1.3);
      g.fillStyle = "#78350f";
      g.beginPath(); g.ellipse(0, 0, w + 1, 5, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#eab308";
      g.beginPath(); g.ellipse(0, 0, w, 4, 0, 0, Math.PI * 2); g.fill();
      if (w > 2) {
        g.fillStyle = "#78350f";
        g.fillRect(-2, -1.5, 4, 0.9);
        g.fillRect(-2, 0.8, 4, 0.9);
      }
      g.restore();
    },
    clock: {
      slots: ["Mattina", "Pomeriggio", "Notte di Rotativa"],
      hud: true,
      tint: [null, "rgba(234,179,8,.10)", "rgba(15,23,42,.24)"],
      onSlot(K, d, sl, nm) {
        if (nm === "Pomeriggio") return [["voce", "Suona la sirena del turno pomeridiano: dai portici sale profumo di caldarroste e caffè espresso."]];
        if (nm === "Notte di Rotativa") return [["voce", "Cala la Notte di Rotativa su Borgo Alta: i lampioni s'accendono nella bruma e i rulli scaldano il piombo."]];
        return null;
      }
    },
    stadium: {
      ads: ["L'ECO DEL PALLONE · 1921", "BAR SPORT TOTOCALCIO", "EDICOLA ORESTE", "PELLICOLE FERRANIA"],
      adCols: [["#1f6f54", "#f5ebd6"], ["#c83228", "#fffbeb"], ["#eab308", "#1c1917"]],
      crowd: ["#1f6f54", "#f5ebd6", "#c83228", "#eab308"],
      banner: "GIÙ LE MANI DALLE ACACIE",
      turf: ["#3d7a42", "#346b39"]
    },
    cases: {
      acacie: {
        t: "L'Inchiesta delle Acacie",
        q: "Con quale manovra il Commendator Sartori vuole dichiarare inagibile e cementificare il Campo delle Acacie?",
        items: {
          perizia_falsa: {
            t: "Trave segata di fresco",
            icon: "🪚",
            kind: "prova",
            d: "Sotto la tribunetta storica del 1921 la trave portante non è marcia: mostra segatura bionda e un taglio di sega recentissimo."
          },
          negativo_clara: {
            t: "Il negativo notturno di Nando",
            icon: "🎞️",
            kind: "prova",
            d: "Dal rullino dimenticato da Nando affiora un furgone targato «Stampa Moderna» davanti ai cancelli delle Acacie alle due di notte."
          },
          velina_telescrivente: {
            t: "Velina riservata di Sartori",
            icon: "📠",
            kind: "prova",
            d: "La striscia gialla della telescrivente ordina di depositare la perizia d'inagibilità prima di venerdì per avviare il cantiere «Residenza Acacie»."
          },
          atto_1921: {
            t: "Rogito perpetuo del 1921",
            icon: "📜",
            kind: "prova",
            d: "Cucito nella rilegatura del primo numero de L'Eco del Pallone, l'atto notarile vincola in perpetuo il terreno delle Acacie allo sport popolare gratuito."
          }
        },
        links: [
          [
            "perizia_falsa",
            "negativo_clara",
            "Il taglio fresco sulla trave della tribunetta e lo scatto notturno sul rullino di Nando dimostrano che il danno alle Acacie è un sabotaggio, non vetustà."
          ],
          [
            "velina_telescrivente",
            "atto_1921",
            "La velina speculativa di Sartori cade di fronte al rogito perpetuo del 1921: nessun cantiere privato può toccare il prato finché il campo vive."
          ]
        ],
        verdicts: [
          {
            id: "sartori",
            label: "⚖️ Il rogito 1921 e il sabotaggio annullano la variante di Sartori",
            sub: "Presenta prove fotografiche, velina e atto notarile davanti al Consiglio",
            big: true
          },
          {
            id: "compromesso",
            label: "🤝 Chiedi solo un rinvio tecnico di sei mesi",
            sub: "Evita lo scontro frontale con l'impero editoriale di Sartori"
          },
          {
            id: "pavan",
            label: "📋 Accusa il solo geometra Pavan di errore materiale",
            sub: "Scarica la colpa sul funzionario lasciando fuori Stampa Moderna"
          }
        ]
      }
    },
    press: {
      name: "Il Bancone di Piombo",
      icon: "📰",
      masthead: "L'ECO DEL PALLONE",
      copiesStat: "copie",
      defaultHeadline: "L'ECO NON CHIUDE!",
      slots: [
        ["lead", "Titolo di testa", "🖋️"],
        ["photo", "Foto di centro", "📸"],
        ["col", "Spalla sportiva", "⚽"]
      ],
      editions: {
        1: "Numero 1 · L'Allarme delle Edicole",
        2: "Numero 2 · Fango e Magnesio",
        3: "Numero 3 · Le Carte della Notte",
        4: "Numero 4 · Edizione Straordinaria"
      },
      items: {
        lead_v1: {
          slot: "lead", n: "Inchiesta documentata", icon: "🖋️",
          headline: "ACACIE: PERIZIA SENZA SOPRALLUOGO",
          d: "Sobrio e verificato riga per riga: cita il protocollo mancante del geometra Pavan.",
          w: { verita: 2 }, copies: 3, who: "tp_ada", bond: 1
        },
        lead_t1: {
          slot: "lead", n: "Titolo di piazza a 9 colonne", icon: "📢",
          headline: "GIÙ LE MANI DAL NOSTRO CAMPO!",
          d: "Caratteri cubitali in legno di pero che infiammano il Bar Sport e gli strilloni.",
          w: { tiratura: 2 }, copies: 5, who: "tp_tino", bond: 1
        },
        photo_1: {
          slot: "photo", n: "I lucchetti nuovi al cancello", icon: "📸",
          d: "Lo scatto nitido di Clara Luce davanti all'edicola di Oreste.",
          copies: 2, buff: "flash_extra", buffTxt: "Rullino rapido (+ampiezza mirino e ricarica Flash)"
        },
        col_1: {
          slot: "col", n: "Il pronostico del Bar Sport", icon: "☕",
          d: "Il colonnino tattico dettato da Beppe il Tranviere tra due tazzine.",
          copies: 2, buff: "scatto_strilloni", buffTxt: "+corsa e passaggi tesi in partita"
        },

        lead_v2: {
          slot: "lead", n: "Cronaca tecnica della trave", icon: "🖋️",
          headline: "SEGATURA FRESCA SOTTO LA TRIBUNA",
          d: "Pubblica i rilievi sul taglio della trave proteggendo le fonti del quartiere.",
          w: { verita: 2 }, copies: 4, who: "tp_goffredo", bond: 1
        },
        lead_t2: {
          slot: "lead", n: "Strillo sul furgone fantasma", icon: "🔥",
          headline: "OMBRE DI NOTTE ALLE ACACIE!",
          d: "Titolo clamoroso che fa esaurire i pacchi all'edicola in mezz'ora.",
          w: { tiratura: 2 }, copies: 6, who: "tp_oreste", bond: 1
        },
        photo_2: {
          slot: "photo", n: "Il rullino ritrovato di Nando", icon: "🎞️",
          d: "La stampa al bromuro sviluppata in camera oscura sotto la luce rossa.",
          copies: 3, buff: "flash_extra", buffTxt: "Mirino d'oro ampliato per Clara"
        },
        col_2: {
          slot: "col", n: "La diagonale nel fango", icon: "⚽",
          d: "Appunti di spogliatoio per uscire palla al piede dalle pozzanghere.",
          copies: 2, buff: "muro_calce", buffTxt: "Portiere più reattivo tra i pali"
        },

        lead_v3: {
          slot: "lead", n: "Il rogito notarile del 1921", icon: "🖋️",
          headline: "IL LASCITO DEL 1921 È INVIOLABILE",
          d: "Riproduce in prima pagina il documento storico cucito nella legatoria di Livia.",
          w: { verita: 2 }, copies: 5, who: "tp_livia", bond: 1
        },
        lead_t3: {
          slot: "lead", n: "Scandalo in Galleria Umberto", icon: "💥",
          headline: "ECCO LE CARTE SEGRETE DEI CEMENTIERI!",
          d: "Sbatti in vetrina la velina di Sartori facendo tremare i lampadari della Galleria.",
          w: { tiratura: 2 }, copies: 7, who: "tp_clara", bond: 1
        },
        photo_3: {
          slot: "photo", n: "La velina della telescrivente", icon: "📠",
          d: "Macro-fotografia del dispaccio battuto negli uffici di Stampa Moderna.",
          copies: 3, buff: "effetto_piombo", buffTxt: "Tiri a giro con effetto piombo"
        },
        col_3: {
          slot: "col", n: "Contropiede sotto i portici", icon: "🏃",
          d: "Schema rapido per aggirare le marcature strette nei vicoli bagnati.",
          copies: 2, buff: "scatto_strilloni", buffTxt: "+velocità di smistamento palla"
        },

        lead_v4: {
          slot: "lead", n: "Appello civico per le Acacie", icon: "🖋️",
          headline: "LA CITTÀ DIFENDE IL DIRITTO AL GIOCO",
          d: "Editoriale firmato da tutta la redazione sul valore della stampa libera.",
          w: { verita: 2 }, copies: 6, who: "tp_ada", bond: 1
        },
        lead_t4: {
          slot: "lead", n: "Edizione Straordinaria a colori", icon: "📰",
          headline: "SETTANTAMILA VOCI CONTRO IL CEMENTO!",
          d: "Testata bicolore rossa e verde stampata a tutta velocità sulla Marinoni.",
          w: { tiratura: 2 }, copies: 8, who: "tp_tino", bond: 1
        },
        photo_4: {
          slot: "photo", n: "La folla di Largo Municipio", icon: "📸",
          d: "Borgo Alta stretto attorno alle edicole con le sciarpe verdi-avorio.",
          copies: 4, buff: "flash_extra", buffTxt: "+1 carica iniziale di Rotativa"
        },
        col_4: {
          slot: "col", n: "Come bucare gli ombrelli neri", icon: "☂️",
          d: "Tattica anti-Sartori: giro palla laterale prima dello scatto di Clara!",
          copies: 3, buff: "effetto_piombo", buffTxt: "Parabola curva sui tiri in porta"
        }
      }
    },
    regions: {
      edicole: {
        grass: ["#5a7d4c", "#517244", "#638854"],
        path: ["#b8a992", "#ae9f88"],
        stone: ["#84796b", "#7a7062"],
        wall: ["#9e4733", "#8a3c2a"],
        water: ["#3d789e", "#356d90"],
        tall: "#46633b",
        tree: ["#b45309", "#d97706", "#2f6846"],
        tint: "255,210,150",
        tintA: 0.11,
        fx: "leaves",
        dark: 0.03
      },
      linotype: {
        grass: ["#575049", "#4f4842", "#5f5850"],
        path: ["#c9baa0", "#bfb096"],
        stone: ["#64748b", "#58677d"],
        wall: ["#3e2c22", "#33241b"],
        water: ["#334155", "#293548"],
        tall: "#475569",
        tint: "250,204,90",
        tintA: 0.14,
        fx: "",
        dark: 0.07
      },
      barsport: {
        grass: ["#7c3a27", "#703322", "#88412c"],
        path: ["#e7dac2", "#ddd0b8"],
        stone: ["#92400e", "#7c350b"],
        wall: ["#451a03", "#381402"],
        water: ["#0284c7", "#0369a1"],
        tall: "#7c2d12",
        tint: "255,220,150",
        tintA: 0.14,
        fx: "",
        dark: 0.05
      },
      acacie: {
        grass: ["#467c3e", "#3e7037", "#4f8846"],
        path: ["#cfa974", "#c49e69"],
        stone: ["#78716c", "#6d6762"],
        wall: ["#1f6f54", "#185943"],
        water: ["#487ca3", "#3f7095"],
        tall: "#366330",
        tree: ["#ca8a04", "#eab308", "#3f7438"],
        tint: "255,200,120",
        tintA: 0.12,
        fx: "leaves",
        dark: 0.03
      },
      cameraoscura: {
        grass: ["#3b1016", "#320d12", "#45131a"],
        path: ["#6b2029", "#5e1b23"],
        stone: ["#4c1d24", "#3f171d"],
        wall: ["#24080c", "#1b0508"],
        water: ["#991b1b", "#7f1d1d"],
        tall: "#4c1d24",
        tint: "239,68,68",
        tintA: 0.20,
        fx: "",
        dark: 0.14
      },
      galleria: {
        grass: ["#475569", "#3e4c5e", "#516075"],
        path: ["#dfd3bc", "#d5c8b0"],
        stone: ["#94a3b8", "#8595ab"],
        wall: ["#784c2a", "#684123"],
        water: ["#2563eb", "#1d4ed8"],
        tall: "#334155",
        tree: ["#1f6f54", "#15803d", "#b45309"],
        tint: "220,230,255",
        tintA: 0.11,
        fx: "fireflies",
        dark: 0.08
      },
      moderna: {
        grass: ["#64748b", "#5a697f", "#6e7f96"],
        path: ["#e2e8f0", "#cbd5e1"],
        stone: ["#475569", "#3b4758"],
        wall: ["#0f172a", "#1e293b"],
        water: ["#38bdf8", "#0ea5e9"],
        tall: "#334155",
        tint: "186,230,253",
        tintA: 0.10,
        fx: "",
        dark: 0.04
      },
      largo: {
        grass: ["#4b7742", "#426b3a", "#54834b"],
        path: ["#d6c4a8", "#cbb99d"],
        stone: ["#8c7a68", "#806f5e"],
        wall: ["#9a3412", "#7c2d12"],
        water: ["#2b6cb0", "#255e9c"],
        tall: "#3b6134",
        tree: ["#1f6f54", "#d97706", "#b45309"],
        tint: "255,215,130",
        tintA: 0.14,
        fx: "fireflies",
        dark: 0.05
      }
    },
    floors: "QYUZ",
    solid: "IXKEFVAPJROGNCM",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g;
      if (f === "Q") {
        // Lastricato storico a coda di pavone con fughe chiare
        g.fillStyle = (tx + ty) % 2 ? "#8c8173" : "#827769";
        g.fillRect(sx, sy, 16, 16);
        g.strokeStyle = "rgba(245,235,214,.24)";
        g.lineWidth = 1;
        g.beginPath(); g.arc(sx + 8, sy + 14, 7, Math.PI, Math.PI * 2); g.stroke();
        if ((tx * 7 + ty * 5) % 11 === 0) {
          g.fillStyle = "#eab308";
          g.fillRect(sx + 4, sy + 5, 2, 2);
        }
        return true;
      }
      if (f === "Y") {
        // Piastrelle a scacchi avorio/terracotta dei caffè e dei portici '68
        const odd = (tx + ty) % 2 === 1;
        g.fillStyle = odd ? "#d8c3a5" : "#9c4a32";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(255,255,255,.08)";
        g.fillRect(sx + 1, sy + 1, 14, 2);
        return true;
      }
      if (f === "U") {
        // Graniglia di marmo lucido per tipografia, Galleria e Municipio
        g.fillStyle = (tx + ty) % 2 ? "#dfd4be" : "#d3c7b0";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#1f6f54";
        if ((tx + ty) % 4 === 0) g.fillRect(sx + 6, sy + 6, 4, 4);
        g.fillStyle = "rgba(71,85,105,.25)";
        g.fillRect(sx + ((tx * 5) % 13), sy + ((ty * 3) % 13), 2, 2);
        return true;
      }
      if (f === "Z") {
        // Manto erboso delle Acacie con petali dorati d'ottobre
        g.fillStyle = (tx + ty) % 2 ? "#4a8240" : "#417538";
        g.fillRect(sx, sy, 16, 16);
        if ((tx * 3 + ty * 7) % 6 === 0) {
          g.fillStyle = "#fde047";
          g.fillRect(sx + 5, sy + 8, 2, 2);
        }
        return true;
      }
      return false;
    },
    paint: {
      // Balustrada / ringhiera in ferro battuto verde edicola
      I(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#164e3b";
        g.fillRect(sx, sy + 5, 16, 3);
        g.fillRect(sx, sy + 12, 16, 2);
        for (let i = 2; i < 15; i += 4) g.fillRect(sx + i, sy + 4, 2, 10);
        g.fillStyle = "#eab308";
        if (tx % 3 === 0) g.fillRect(sx + 6, sy + 2, 4, 3);
      },
      // Cancello / linea d'ingresso partita Flash & Contropiede '68
      X(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#1f6f54";
        g.fillRect(sx, sy - 6, 16, 22);
        g.fillStyle = "#f5ebd6";
        g.fillRect(sx + 2, sy - 4, 12, 6);
        g.fillStyle = "#c83228";
        g.fillRect(sx + 3, sy - 3, 10, 2);
        g.fillStyle = "#1c1917";
        g.fillRect(sx + 4, sy + 4, 8, 12);
        const a = 0.38 + 0.18 * Math.sin(fr / 6 + tx);
        K.light(sx + 8, sy + 2, 26, "253,224,71", a);
      },
      // Gradinata storica di legno verde con sciarpe che sventolano
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        for (let i = 0; i < 3; i++) {
          g.fillStyle = i % 2 ? "#1f6f54" : "#92400e";
          g.fillRect(sx, sy + i * 5, 16, 5);
        }
        const dy = Math.floor(fr / 10 + tx) % 2;
        g.fillStyle = (tx + ty) % 2 ? "#f5ebd6" : "#c83228";
        g.fillRect(sx + 5, sy + 1 - dy, 6, 3);
      },
      // Chiosco Edicola in ferro battuto verde con testate appese
      E(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#164e3b";
        g.fillRect(sx + 1, sy - 2, 14, 16);
        g.fillStyle = "#1f6f54";
        g.fillRect(sx, sy - 5, 16, 4);
        g.fillStyle = "#c83228";
        g.fillRect(sx + 2, sy - 4, 12, 2);
        g.fillStyle = "#f5ebd6";
        g.fillRect(sx + 3, sy + 2, 4, 6);
        g.fillRect(sx + 9, sy + 2, 4, 6);
      },
      // Il Bancone di Piombo d'impaginazione (apre K.press)
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#5c3a28";
        g.fillRect(sx + 1, sy + 5, 14, 10);
        g.fillStyle = "#475569";
        g.fillRect(sx, sy + 1, 16, 6);
        g.fillStyle = "#f5ebd6";
        g.fillRect(sx + 3, sy + 2, 10, 4);
        g.fillStyle = "#c83228";
        g.fillRect(sx + 4, sy + 2, 8, 1.5);
        K.light(sx + 8, sy + 2, 22, "250,204,21", 0.28 + 0.08 * Math.sin(fr / 8));
      },
      // Fontana in ghisa con zampillo animato
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#475569";
        g.beginPath(); g.arc(sx + 8, sy + 9, 7, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#38bdf8";
        g.beginPath(); g.arc(sx + 8, sy + 9, 5, 0, Math.PI * 2); g.fill();
        const r = 2 + (Math.floor(fr / 6) % 3);
        g.strokeStyle = "#e0f2fe";
        g.lineWidth = 1;
        g.beginPath(); g.arc(sx + 8, sy + 9, r, 0, Math.PI * 2); g.stroke();
      },
      // Braciere delle caldarroste con brace e fumo caldo
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx + 3, sy + 5, 10, 9);
        g.fillStyle = Math.floor(fr / 7) % 2 ? "#ef4444" : "#f59e0b";
        g.fillRect(sx + 5, sy + 4, 6, 3);
        const sm = (Math.floor(fr / 8) + tx) % 5;
        g.fillStyle = "rgba(245,235,214,.55)";
        g.fillRect(sx + 7, sy - sm, 3, 3);
        K.light(sx + 8, sy + 5, 18, "249,115,22", 0.26);
      },
      // Civetta stradale de L'Eco del Pallone su cavalletto
      P(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 3, sy + 2, 10, 13);
        g.fillStyle = "#f5ebd6";
        g.fillRect(sx + 4, sy + 3, 8, 10);
        g.fillStyle = "#c83228";
        g.fillRect(sx + 5, sy + 4, 6, 2);
        g.fillStyle = "#1c1917";
        g.fillRect(sx + 5, sy + 7, 6, 1.5);
        g.fillRect(sx + 5, sy + 10, 5, 1.5);
      },
      // Cilindro Linotype / Rotativa Marinoni con rulli in movimento
      J(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx + 1, sy, 14, 15);
        g.fillStyle = "#eab308";
        g.fillRect(sx + 3, sy - 2, 10, 3);
        const off = Math.floor(fr / 5 + tx) % 3;
        g.fillStyle = "#f5ebd6";
        g.fillRect(sx + 4, sy + 4 + off, 8, 5);
        g.fillStyle = "#94a3b8";
        g.fillRect(sx + 2, sy + 8, 12, 2);
      },
      // Balle di giornali legate con lo spago e bobine di carta
      R(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#e7dcc4";
        g.fillRect(sx + 2, sy + 3, 12, 11);
        g.fillStyle = "#c83228";
        g.fillRect(sx + 3, sy + 4, 10, 2);
        g.fillStyle = "#78350f";
        g.fillRect(sx + 7, sy + 3, 1.5, 11);
        g.fillRect(sx + 2, sy + 8, 12, 1.5);
      },
      // Macchina espresso cromata / Schedina del Bar Sport
      O(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#7c2d12";
        g.fillRect(sx + 1, sy + 7, 14, 8);
        g.fillStyle = "#e2e8f0";
        g.fillRect(sx + 3, sy + 1, 10, 7);
        g.fillStyle = "#eab308";
        g.fillRect(sx + 5, sy - 1, 6, 2);
        if (Math.floor(fr / 9 + tx) % 2) {
          g.fillStyle = "rgba(255,255,255,.6)";
          g.fillRect(sx + 7, sy - 4, 2, 2);
        }
      },
      // Telescrivente automatica con velina gialla che sale
      G(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#475569";
        g.fillRect(sx + 2, sy + 5, 12, 10);
        const h = 3 + (Math.floor(fr / 8) % 4);
        g.fillStyle = "#fef08a";
        g.fillRect(sx + 5, sy + 5 - h, 6, h);
        g.fillStyle = "#0f172a";
        g.fillRect(sx + 4, sy + 8, 8, 3);
      },
      // Lampada rossa e filo dei negativi della Camera Oscura
      N(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#7f1d1d";
        g.fillRect(sx + 1, sy + 6, 14, 8);
        g.fillStyle = "#f5ebd6";
        g.fillRect(sx + 3, sy + 1, 4, 5);
        g.fillRect(sx + 9, sy + 1, 4, 5);
        K.light(sx + 8, sy + 2, 24, "239,68,68", 0.34 + 0.08 * Math.sin(fr / 7));
      },
      // Transenna / Plastico speculativo «Impresa Sartori»
      C(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#f5ebd6";
        g.fillRect(sx + 1, sy + 3, 14, 6);
        g.fillStyle = "#c83228";
        g.fillRect(sx + 2, sy + 4, 4, 4);
        g.fillRect(sx + 9, sy + 4, 4, 4);
        g.fillStyle = "#334155";
        g.fillRect(sx + 3, sy + 9, 2, 6);
        g.fillRect(sx + 11, sy + 9, 2, 6);
      },
      // Torchio d'ottone della Legatoria storica 1921
      M(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#5c3a28";
        g.fillRect(sx + 2, sy + 7, 12, 8);
        g.fillStyle = "#334155";
        g.fillRect(sx + 3, sy + 2, 10, 3);
        g.fillStyle = "#eab308";
        g.fillRect(sx + 7, sy - 2, 2, 9);
        g.fillStyle = "#f5ebd6";
        g.fillRect(sx + 4, sy + 5, 8, 2);
      }
    },
    act: {
      X: "Scendi in campo",
      A: "Apri il Bancone di Piombo",
      E: "Guarda l'edicola",
      I: "Guarda la ringhiera",
      K: "Guarda la tribunetta",
      F: "Guarda la fontana",
      V: "Guarda il braciere",
      P: "Leggi la civetta",
      J: "Esamina i rulli",
      R: "Controlla i pacchi di copie",
      O: "Guarda il bancone del bar",
      G: "Esamina la telescrivente",
      N: "Esamina i negativi",
      C: "Esamina il cartello Sartori",
      M: "Esamina il torchio del 1921",
      n: "Leggi l'avviso",
      x: "Apri la cassetta",
      s: "Siediti sulla panchina",
      q: "Entra",
      v: "Esci",
      l: "Guarda il lampione",
      b: "Siediti",
      T: "Guarda il tavolo",
      D: "Apri lo scaffale",
      L: "Sfoglia le annate",
      W: "Guarda dalla finestra",
      H: "Scaldati",
      z: "Controlla le casse"
    },
    rest: {
      ch: "s",
      label: "Siediti sulla panchina",
      text: "Ti siedi sulla panchina di ghisa sfogliando le bozze ancora tiepide. Il gioco salva da solo; l'ora scorre verso il prossimo turno."
    },
    texts: {
      nothing: "Odore di piombo caldo, castagne arrosto e carta di giornale appena tagliata.",
      noHero: "Ada Carattere cerca una punta con fiuto da cronista per salvare L'Eco del Pallone. Crea prima il tuo Campione.",
      chestOpen: "Apri la cassetta di legno dei caratteri.",
      chestEmpty: "Dentro restano solo spaghi da pacco e due matrici consumate."
    },
    journal: {
      name: "Il Taccuino del Cronista",
      sub: "Prime pagine stampate, Dossier delle Acacie, legami di redazione e finali"
    },
    bonds: {
      per: 4,
      talk: 2,
      max: 4,
      names: ["Lettore", "Praticante", "Cronista di punta", "Firma d'apertura", "Anima dell'Eco"],
      scenes: {
        tp_clara: [
          {
            lv: 2,
            id: "cla2",
            prize: "Lente Contafili d'Ottone (+mirino Flash nelle partite)",
            lines: [
              ["tp_clara", "Mio padre riparava orologi alla stazione, ma a me piaceva solo l'istante in cui l'otturatore congela un pallone a mezz'aria."],
              ["tp_clara", "[felice] Tieni la mia Lente Contafili d'Ottone (🎒 Zaino): serve a controllare il fuoco sui negativi e ci darà un occhio in più a bordo campo!"]
            ],
            reward: (K) => K.inv.give("tp_lente")
          }
        ],
        tp_goffredo: [
          {
            lv: 2,
            id: "gof2",
            lines: [
              ["tp_goffredo", "Quarantadue anni davanti al crogiolo della Linotype. Riconosco un refuso dal rumore che fa la matrice d'ottone quando cade nel canale."],
              ["tp_goffredo", "[commosso] Tuo fratello Nando restava qui fino alle due di notte a correggere le classifiche dei giovanissimi. Rivederti al bancone mi toglie dieci anni dalle spalle."]
            ],
            reward: (K) => K.bond("verita", 1)
          }
        ],
        tp_tino: [
          {
            lv: 2,
            id: "tin2",
            lines: [
              ["tp_tino", "[felice] Quando urlo «Edizione straordinaria!» sotto i portici, le persiane si aprono fino al quarto piano!"],
              ["tp_tino", "Con te in attacco e Clara con la Rollei, il Corriere Veloce di Sartori può incartarci solo il pesce del venerdì!"]
            ],
            reward: (K) => K.bond("copie", 2)
          }
        ],
        tp_ada: [
          {
            lv: 2,
            id: "ada2",
            lines: [
              ["tp_ada", "Mio nonno fondò L'Eco del Pallone nel 1921 con una pedalina a mano e tre risme prese a credito."],
              ["tp_ada", "[serio] Sartori crede che un giornale sia carta da vendere a peso. Invece è la memoria di chi non ha megafoni."]
            ],
            reward: (K) => K.bond("verita", 1)
          }
        ]
      }
    },
    inv: {
      items: {
        tp_piombo_q: {
          n: "Carattere di piombo «Q»",
          icon: "🔤",
          d: "Una lettera Bodoni fusa da Mastro Goffredo ancora tiepida: portafortuna storico dei tipografi di Borgo Alta.",
          gift: { tp_ada: 5, tp_goffredo: 5 },
          giftAny: 2,
          react: {
            tp_ada: "[commosso] La «Q» col ricciolo lungo del 1921! La terrò sul bancone accanto al tipometro.",
            tp_goffredo: "[felice] Lega buona all'antimonio, non si schiaccia nemmeno dopo centomila copie!"
          }
        },
        tp_rullino: {
          n: "Rullino 35mm di Nando",
          icon: "🎞️",
          d: "Pellicola pancromatica 400 ASA dimenticata da tuo fratello Nando nella borsa di cuoio.",
          gift: {},
          giftAny: 0
        },
        tp_matita: {
          n: "Matita copiativa blu-rossa",
          icon: "✏️",
          d: "Lato blu per i tagli di cronaca, lato rosso per i gol della domenica.",
          gift: { tp_beppe: 5, tp_oreste: 5 },
          giftAny: 2,
          react: {
            tp_beppe: "[felice] Con questa sulla schedina del Totocalcio ci scappa il tredici sicuro!",
            tp_oreste: "[felice] Perfetta per segnare le rese dei pacchi all'alba!"
          }
        },
        tp_castagne: {
          n: "Cartoccio di caldarroste",
          icon: "🌰",
          d: "Avvolto in una pagina vecchia del giornale: scalda le mani nella nebbia d'ottobre.",
          gift: { tp_tino: 6, tp_clara: 5 },
          giftAny: 3,
          react: {
            tp_tino: "[felice] Bollenti! Adesso corro fino a Piazza Municipio senza sentire il freddo!",
            tp_clara: "[felice] Ci volevano proprio tra un bagno di sviluppo e l'altro!"
          }
        },
        tp_lente: {
          n: "Lente Contafili d'Ottone",
          icon: "🔍",
          d: "Lente pieghevole da fotolito di Clara: allarga il Riquadro d'Obiettivo nelle partite di Flash & Contropiede '68.",
          gift: {},
          giftAny: 0
        },
        tp_atto21: {
          n: "Rogito del Campo delle Acacie (1921)",
          icon: "📜",
          d: "Atto notarile originale ritrovato nella legatoria di Livia: vincola il prato delle Acacie allo sport popolare gratuito.",
          gift: {},
          giftAny: 0
        }
      }
    },
    endings: {
      cooperativa: [
        "La Cooperativa dei Lettori",
        "Il rogito del 1921 ferma le ruspe e Borgo Alta sottoscrive le quote popolari: «L'Eco del Pallone» diventa una cooperativa libera di tipografi, edicolanti e tifosi.",
        "Fai prevalere la Verità d'Inchiostro, vinci il verdetto del Dossier contro Sartori e scegli l'azionariato popolare."
      ],
      settantamila: [
        "Settantamila Copie",
        "I tuoi titoli travolgenti raddoppiano le vendite in tutta la provincia: la rotativa Marinoni batte il Corriere Veloce sul suo stesso terreno commerciale.",
        "Fai prevalere la Tiratura Popolare con alte vendite in edicola e rilancia la sfida provinciale."
      ],
      riunita: [
        "La Redazione Riunita",
        "Accettate un patto civico che salva il prato delle Acacie ridimensionando il giornale a settimanale del lunedì: meno rotative, ma nessuno perde il posto.",
        "Scegli la mediazione civica o concludi senza tutte le prove del Dossier."
      ],
      nando: [
        "L'Edizione Straordinaria di Nando",
        "Segreto: col rullino di Nando sviluppato, tutte le 4 edizioni stampate, il Dossier perfetto e la rimonta con gli scatti di Clara, un telegramma dall'estero annuncia il ritorno a casa del fratello per firmare insieme il nuovo numero uno.",
        "Segreto: sviluppa il rullino di Nando nel Cap. 2, stampa tutte le 4 edizioni al Bancone, vinci il Dossier contro Sartori, stringi legame con Clara e Goffredo e realizza almeno uno Scatto Perfetto nella finale."
      ]
    },
    heroLook: (h, K) => (K && K.F && K.F.is("tp_divisa")
      ? { bg: ["#1f6f54", "#f5ebd6"], shirt: "#1f6f54" }
      : { bg: ["#475569", "#eab308"] }),
    heroTitle: () => "cronista centravanti",
    musicMain: "tipografia",
    music: {
      tipografia: {
        bpm: 112,
        chords: ["Dm", "Gm", "A7", "Dm", "F", "C", "Gm", "A7"],
        lres: 2,
        lw: "triangle",
        lv: 0.028,
        lead: "D5 - F5 - A5 - G5 - | Bb4 - D5 - G5 - F5 - | E5 - G5 - C#5 - E5 - | D5 - - - A4 - - - | F5 - A5 - C6 - A5 - | G5 - E5 - C5 - - - | Bb4 - D5 - G5 - Bb5 - | A5 - G5 - F5 - E5 -",
        bass: "R . 5 . R . 5 . R . 5 . R . 5 .",
        bv: 0.08,
        arp: "1 3 5 8 5 3 1 5",
        aw: "square",
        av: 0.014,
        drum: "k . h . s . h h k . h . s . h .",
        dv: 0.05
      }
    },
    guide: () => [
      [
        "📰 Il Bancone di Piombo",
        "Tocca il Bancone d'Impaginazione (A) in tipografia o aprilo dal menu per comporre i 3 tagli della Prima Pagina: Titolo di testa (sceglie tra Verità d'Inchiostro e Tiratura Popolare), Foto centrale di Clara e Spalla sportiva coi bonus per il campo."
      ],
      [
        "📸 Flash & Contropiede '68",
        "Nelle partite speciali Clara Luce corre a bordo campo muovendo il Riquadro d'Obiettivo dorato. Premi 📸 FLASH (o X) mentre palla o duello sono nel riquadro per abbagliare i difensori e caricare i 3 segmenti della Rotativa fino al Super-Tiro Edizione Straordinaria!"
      ],
      [
        "🗂️ L'Inchiesta delle Acacie",
        "Raccogli le 4 prove tra il Campo delle Acacie, la Camera Oscura, gli uffici di Stampa Moderna e la Legatoria del 1921, poi collegale a coppie nel Dossier prima della seduta in Municipio."
      ]
    ],
    zoneMenuExtra: (K) => [
      ...(K.press ? [{ label: "📰 Il Bancone di Piombo", sub: K.press.statusTxt(), fn: () => K.press.open(() => K.done(), true) }] : []),
      {
        label: "📸 Allenamento Flash & Contropiede '68",
        sub: "Prova il mirino d'oro di Clara e il Tiro Edizione Straordinaria",
        fn: () => {
          if (!window.__flash68) return K.done();
          K.minigame(window.__flash68.start, {
            title: "Allenamento · Cortile delle Edicole",
            venue: "edicole",
            durSec: 26,
            buffs: K.press ? K.press.activeBuffs() : [],
            opp: "Riserve del Borgo",
            oppColor: "#475569"
          }, () => K.done());
        }
      }
    ],
    cameos: [
      {
        id: "fi_tullio",
        zone: "tp_edicole",
        at: [25, 19],
        when: (K) => !!K.otherSaga("ali-di-rondine.fischietto"),
        lines: [
          ["fi_tullio", "Mastro Tullio soppesa con la lente un carattere Bodoni fuori dall'edicola: «Bella lega piombo-antimonio! Ai miei tempi ci battevamo pure le medaglie commemorative!»"],
          ["fi_tullio", "«Dì a Mastro Goffredo di non vendere mai le matrici d'ottone: il metallo onesto dura più dei palazzinari.»"]
        ]
      }
    ],
    guest: {
      id: "tp_tino",
      lines: [
        "Edizione straordinariaaa! Anche qui al Borgo Marino arrivano i pacchi freschi de L'Eco del Pallone col furgoncino delle cinque!",
        "Se senti odore d'inchiostro e caldarroste, vuol dire che la rotativa Marinoni ha girato tutta la notte!"
      ]
    }
  });

  window.__tipografiaH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => {
        const l = H.flush();
        const go = () => K.ask("voce", prompt, opts.map((o) => ({
          label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn
        })));
        if (l.length) K.say(l, go); else go();
      },
      wask: (prompt, opts) => {
        const l = H.flush();
        const go = () => K.weight.ask("voce", prompt, opts);
        if (l.length) K.say(l, go); else go();
      },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1f2937", skin: "#e8be96" }, o), bio),
      plaque(g, txt, x, y, col) {
        g.save();
        g.font = "700 6px 'Trebuchet MS', sans-serif";
        const w = g.measureText(txt).width + 8;
        g.fillStyle = "rgba(26,22,19,.92)";
        g.fillRect(x - w / 2, y - 4, w, 9);
        g.strokeStyle = col || "#eab308";
        g.lineWidth = 1;
        g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8);
        g.fillStyle = col || "#f5ebd6";
        g.textAlign = "center";
        g.fillText(txt, x, y + 3);
        g.restore();
      },
      flashMatch(opts, who, line, cb) {
        const buffs = (K.press ? K.press.activeBuffs() : []).slice();
        if (K.inv.has("tp_lente") && !buffs.includes("flash_extra")) buffs.push("flash_extra");
        const mOpts = Object.assign({
          us: "U.S. Acacie '68",
          usColor: "#1f6f54",
          buffs,
          mates: [{ name: "Tino" }, { name: "Beppe" }],
          heroLook: { name: (K.hero() && K.hero().name) || "Campione", shirt: "#1f6f54" }
        }, opts || {});
        const go = () => {
          if (!window.__flash68) return cb({ win: true, a: 2, b: 0, perfectShots: 1 });
          K.minigame(window.__flash68.start, mOpts, (r) => cb(r || {}));
        };
        const l = H.flush().concat(line ? [[who || "tp_clara", line]] : []);
        if (l.length) K.say(l, go); else go();
      },
      people() {
        H.cast("tp_ada", "Ada Carattere", "Direttrice responsabile de L'Eco del Pallone", {
          style: "bun", hair: "#451a03", shirt: "#1f6f54", skin: "#f1c8a6", acc: ["occhiali"], bg: ["#164e3b", "#f5ebd6"]
        }, "Trentaquattro anni, grembiule macchiato di blu di Prussia e tipometro nel taschino. Guida il bisettimanale fondato da suo nonno nel 1921 e non piega un titolo nemmeno sotto minaccia di sfratto.");
        H.cast("tp_goffredo", "Mastro Goffredo", "Capo linotipista dal 1936", {
          style: "bald", hair: "#d6d3d1", shirt: "#475569", skin: "#dfb18b", beard: "baffi", acc: ["occhiali"], bg: ["#334155", "#fde68a"]
        }, "Sessantacinque anni, dita temprate dal piombo fuso e orecchio assoluto per il battito della rotativa Marinoni. Ha insegnato il mestiere a tuo fratello Nando.");
        H.cast("tp_clara", "Clara Luce", "Fotoreporter con fotocamera biottica", {
          style: "bob", hair: "#78350f", shirt: "#b45309", skin: "#f5d0b5", eye: "#15803d", acc: ["sciarpa"], bg: ["#7c2d12", "#fde047"]
        }, "Ventiquattro anni, trench color senape e due rullini 400 ASA sempre in tasca. Corre lungo il fallo laterale e trasforma ogni contropiede in una foto da prima pagina.");
        H.cast("tp_tino", "Tino Strillo", "Capo degli strilloni e ala destra", {
          style: "spiky", hair: "#92400e", shirt: "#c83228", skin: "#f3cfb0", acc: ["berretto"], bg: ["#7f1d1d", "#f5ebd6"]
        }, "Diciassette anni, berretto di panno di traverso, borsa di tela piena di copie fresche e uno scatto sulla fascia che brucia il selciato.");
        H.cast("tp_oreste", "Oreste Chiosco", "Decano degli edicolanti di Borgo Alta", {
          style: "side", hair: "#9ca3af", shirt: "#166534", skin: "#e5b890", beard: "baffi", bg: ["#14532d", "#bbf7d0"]
        }, "Apre il chiosco in ferro battuto verde alle cinque del mattino con qualunque tempo. Sa quale titolo funzionerà dal modo in cui i pendolari piegano il giornale.");
        H.cast("tp_beppe", "Beppe il Tranviere", "Barista del Bar Sport e stopper storico", {
          style: "buzz", hair: "#1c1917", shirt: "#1d4ed8", skin: "#d9a679", beard: "incolta", bg: ["#1e3a8a", "#dbeafe"]
        }, "Ex guida del tram numero 4, ora governa la macchina espresso a leva e la difesa dell'Acacie con la stessa calma granitica.");
        H.cast("tp_livia", "Livia Carta", "Maestra legatrice e custode d'archivio", {
          style: "long", hair: "#581c87", shirt: "#92400e", skin: "#ecc49c", acc: ["occhiali"], bg: ["#451a03", "#fde68a"]
        }, "Rilega a filo refe le annate storiche in Galleria Umberto. Conosce il segreto nascosto nel dorso del numero uno del 1921.");
        H.cast("tp_sartori", "Commendator Sartori", "Magnate di Stampa Moderna e costruttore", {
          style: "slick", hair: "#111827", shirt: "#1e293b", skin: "#e2c2a8", beard: "pizzetto", bg: ["#0f172a", "#94a3b8"]
        }, "Editore del quotidiano patinato «Il Corriere Veloce» e padrone dell'Impresa Sartori: vuole comprare le edicole e alzare otto piani di cemento sul Campo delle Acacie.");
        H.cast("tp_pavan", "Geometra Pavan", "Tecnico dell'Ufficio Edilizia e arbitro fiscale", {
          style: "ordinato", hair: "#6b7280", shirt: "#57534e", skin: "#ebd0b8", acc: ["occhiali"], bg: ["#292524", "#d6d3d1"]
        }, "Borsa di pelle rigida, timbro ad inchiostro viola e voce tremante quando il Commendator Sartori alza il sopracciglio.");
      }
    };
    return H;
  };

  E.api.latestHeadline = () => (E.K && E.K.press ? E.K.press.latestHeadline() : "L'ECO NON CHIUDE!");

  window.__tipografia = E.api;
  window.__tipografiaCore = E;
})();
