// js/falsari.js — «I FALSARI DELLA COPPA» · Configurazione della saga sul motore comune (js/saga-core.js).
// Una coppa storica del 1934 all'asta, un vecchio orafo e lo stadio da salvare dalle ruspe.
// Fabbrica la replica perfetta, bilancia la lega al millimetro e inganna la contessa prima del colpo di maglio.
// Tono: commedia all'italiana picaresca con momenti seri e colpi di scena legati alle radici popolari del club.
// Dal core: Rapporti (cfg.bonds), Inventario (cfg.inv), Dossier (cfg.cases), Peso morale (cfg.weight), interni fatti a mano.
// Novità: Il Banco del Falsario & Forgia Artigianale (rilievo cera, composizione lega e bilanciatura peso).
(function () {
  "use strict";
  if (window.__falsari || !window.__sagaCore) return;

  const E = window.__sagaCore.create({
    id: "falsari",
    key: "ali-di-rondine.falsari",
    title: "I Falsari della Coppa",
    icon: "🏆",
    bg: "fa_titolo",
    chapters: 4,
    menuSub: "Una coppa storica del 1934 all'asta, un vecchio orafo e lo stadio da salvare dalle ruspe. Fabbrica la replica perfetta, bilancia la lega al millimetro e inganna la contessa prima del colpo di maglio.",
    theme: {
      accent: "#d97706",
      ink: "#fef3c7",
      paper: "rgba(24,16,8,.94)",
      font: "'Trebuchet MS', system-ui, sans-serif",
      chipBg: "#78350f",
      chipBorder: "#f59e0b"
    },
    stats: {
      integrita: [0, 100, 50, "Integrità"],
      furbizia: [0, 100, 20, "Furbizia"],
      purezza: [0, 100, 10, "Purezza Lega"]
    },
    weight: {
      name: "Codice della Banda",
      axes: {
        integrita: ["Integrità", "⚖️"],
        furbizia: ["Furbizia", "🦊"]
      }
    },
    item: ["Frammento di Rame", "Frammenti di Rame"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.fillStyle = "#b45309";
      g.fillRect(-5, -4, 10, 8);
      g.fillStyle = "#fbbf24";
      g.fillRect(-3, -2, 6, 4);
      g.fillStyle = "rgba(255,255,255,0.4)";
      g.fillRect(-2, -3, 2, 2);
      g.restore();
    },
    regions: {
      piazza: {
        grass: ["#292524", "#242120", "#2f2b2a"],
        path: ["#44403c", "#3d3936"],
        stone: ["#57534e", "#4e4a46"],
        wall: ["#1c1917", "#161412"],
        water: ["#1e3a5f", "#172d4a"],
        tall: "#292524",
        tree: ["#2d4a2a", "#3a5e34", "#476f3d"],
        tint: "251,191,36",
        tintA: 0.08,
        fx: "",
        dark: 0.15
      },
      bottega: {
        grass: ["#3e2417", "#362014", "#45281a"],
        path: ["#57301c", "#4f2b18"],
        stone: ["#6c3b22", "#61341e"],
        wall: ["#1c110a", "#150c07"],
        water: ["#1e3a5f", "#172d4a"],
        tall: "#3e2417",
        tint: "245,158,11",
        tintA: 0.12,
        fx: "",
        dark: 0.12
      },
      municipio: {
        grass: ["#064e3b", "#054434", "#085842"],
        path: ["#fef3c7", "#f5e6b3"],
        stone: ["#d97706", "#c46a05"],
        wall: ["#022c22", "#012019"],
        water: ["#1e3a5f", "#172d4a"],
        tall: "#064e3b",
        tint: "254,243,199",
        tintA: 0.08,
        fx: "",
        dark: 0.08
      },
      molo: {
        grass: ["#0f172a", "#090d16", "#1e293b"],
        path: ["#334155", "#1e293b"],
        stone: ["#475569", "#334155"],
        wall: ["#020617", "#0f172a"],
        water: ["#0284c7", "#0369a1"],
        tall: "#0f172a",
        tint: "147,197,253",
        tintA: 0.1,
        fx: "",
        dark: 0.18
      },
      fonderia: {
        grass: ["#271313", "#1f0d0d", "#2e1616"],
        path: ["#451a03", "#3f1d1d"],
        stone: ["#78350f", "#57301c"],
        wall: ["#180b0b", "#0f0505"],
        water: ["#991b1b", "#7f1d1d"],
        tall: "#271313",
        tint: "249,115,22",
        tintA: 0.15,
        fx: "",
        dark: 0.1
      },
      villa: {
        grass: ["#047857", "#065f46", "#064e3b"],
        path: ["#fef3c7", "#fde68a"],
        stone: ["#fbbf24", "#d97706"],
        wall: ["#312e81", "#1e1b4b"],
        water: ["#06b6d4", "#0891b2"],
        tall: "#047857",
        tint: "253,230,138",
        tintA: 0.08,
        fx: "",
        dark: 0.05
      },
      stadio: {
        grass: ["#15803d", "#166534", "#14532d"],
        path: ["#b45309", "#78350f"],
        stone: ["#57534e", "#44403c"],
        wall: ["#1c1917", "#0c0a09"],
        water: ["#0284c7", "#0369a1"],
        tall: "#15803d",
        tint: "217,119,6",
        tintA: 0.1,
        fx: "",
        dark: 0.12
      }
    },
    floors: "UVKJ",
    solid: "BYTZFCIE",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g;
      if (f === "U") {
        // Pavimento a doghe di noce/rovere
        const c = (tx + ty) % 2 === 0 ? "#452213" : "#3b1c0e";
        g.fillStyle = c;
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(0,0,0,0.3)";
        g.fillRect(sx, sy + 15, 16, 1);
        g.fillStyle = "rgba(255,255,255,0.06)";
        g.fillRect(sx, sy, 16, 1);
        return true;
      }
      if (f === "V") {
        // Scacchiera in marmo lucido del palazzo civico
        const isLight = (tx + ty) % 2 === 0;
        g.fillStyle = isLight ? "#fef3c7" : "#1c1917";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = isLight ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.3)";
        g.fillRect(sx + 1, sy + 1, 14, 1);
        g.fillRect(sx + 1, sy + 1, 1, 14);
        return true;
      }
      if (f === "K") {
        // Assi di legno grezzo del pontile portuale bagnate dal mare
        const c = (tx + ty) % 2 === 0 ? "#334155" : "#1e293b";
        g.fillStyle = c;
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(0,0,0,0.35)";
        g.fillRect(sx, sy + 15, 16, 1);
        g.fillStyle = "rgba(147,197,253,0.12)";
        g.fillRect(sx, sy, 16, 1);
        return true;
      }
      if (f === "J") {
        // Lastre di ghisa industriale con rivetti negli angoli
        g.fillStyle = (tx + ty) % 2 === 0 ? "#27272a" : "#18181b";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(255,255,255,0.08)";
        g.fillRect(sx + 1, sy + 1, 14, 1);
        g.fillStyle = "rgba(0,0,0,0.4)";
        g.fillRect(sx + 1, sy + 15, 14, 1);
        g.fillStyle = "#71717a";
        g.fillRect(sx + 2, sy + 2, 1, 1);
        g.fillRect(sx + 13, sy + 2, 1, 1);
        g.fillRect(sx + 2, sy + 13, 1, 1);
        g.fillRect(sx + 13, sy + 13, 1, 1);
        return true;
      }
      return false;
    },
    paint: {
      // B: Banco d'orefice con morsa e cassettini
      B(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "rgba(0,0,0,0.3)";
        g.fillRect(sx + 1, sy + 14, 14, 2);
        g.fillStyle = "#57301c";
        g.fillRect(sx + 1, sy + 4, 14, 11);
        g.fillStyle = "#783e23";
        g.fillRect(sx + 1, sy + 3, 14, 2);
        // Morsa metallica d'acciaio
        g.fillStyle = "#94a3b8";
        g.fillRect(sx + 3, sy + 1, 4, 4);
        g.fillStyle = "#64748b";
        g.fillRect(sx + 2, sy + 2, 6, 1);
        // Pomelli cassettini
        g.fillStyle = "#fbbf24";
        g.fillRect(sx + 5, sy + 8, 2, 2);
        g.fillRect(sx + 10, sy + 8, 2, 2);
      },
      // Y: Bilancia di precisione a due bracci in ottone
      Y(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "rgba(0,0,0,0.25)";
        g.beginPath();
        g.ellipse(sx + 8, sy + 14, 6, 2, 0, 0, 7);
        g.fill();
        g.fillStyle = "#b45309";
        g.fillRect(sx + 7, sy + 5, 2, 10);
        g.fillStyle = "#f59e0b";
        g.fillRect(sx + 3, sy + 4, 10, 1.5);
        // Catenelle e piattini
        g.fillStyle = "#fbbf24";
        g.fillRect(sx + 3, sy + 6, 1, 4);
        g.fillRect(sx + 12, sy + 6, 1, 4);
        g.fillRect(sx + 1, sy + 10, 5, 1.5);
        g.fillRect(sx + 10, sy + 10, 5, 1.5);
      },
      // T: Teca monumentale con la Coppa del 1934
      T(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        // Piedistallo
        g.fillStyle = "#1e293b";
        g.fillRect(sx + 2, sy + 10, 12, 6);
        g.fillStyle = "#d97706";
        g.fillRect(sx + 2, sy + 9, 12, 1);
        // Cristallo della teca
        g.fillStyle = "rgba(224,242,254,0.35)";
        g.fillRect(sx + 2, sy + 1, 12, 8);
        g.strokeStyle = "#fbbf24";
        g.lineWidth = 1;
        g.strokeRect(sx + 2, sy + 1, 12, 8);
        // Calice dorato all'interno
        g.fillStyle = "#f59e0b";
        g.fillRect(sx + 5, sy + 3, 6, 4);
        g.fillStyle = "#fbbf24";
        g.fillRect(sx + 6, sy + 2, 4, 1);
        g.fillRect(sx + 7, sy + 7, 2, 2);
        K.light(sx + 8, sy + 5, 20, "251,191,36", 0.35);
      },
      // Z: Scaffale d'archivio con tomi storici
      Z(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#292524";
        g.fillRect(sx + 1, sy + 1, 14, 15);
        g.fillStyle = "#44403c";
        g.fillRect(sx + 1, sy + 7, 14, 1.5);
        // Dorso dei libri
        const cols = ["#b91c1c", "#1d4ed8", "#047857", "#b45309", "#78350f"];
        for (let i = 0; i < 4; i++) {
          g.fillStyle = cols[(tx + i) % cols.length];
          g.fillRect(sx + 2 + i * 3, sy + 2, 2.5, 5);
          g.fillStyle = cols[(ty + i) % cols.length];
          g.fillRect(sx + 2 + i * 3, sy + 9, 2.5, 5.5);
        }
      },
      // F: Forno a riverbero e crogiolo della fonderia
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#180b0b";
        g.fillRect(sx + 1, sy + 1, 14, 15);
        g.fillStyle = "#3f1d1d";
        g.fillRect(sx + 2, sy + 2, 12, 13);
        // Bocca ardente con fiamme
        const p = 0.5 + 0.5 * Math.sin(fr * 0.15 + tx);
        g.fillStyle = p > 0.5 ? "#f97316" : "#ef4444";
        g.fillRect(sx + 4, sy + 6, 8, 7);
        g.fillStyle = "#fef08a";
        g.fillRect(sx + 6, sy + 8, 4, 4);
        K.light(sx + 8, sy + 9, 25, "249,115,22", 0.5);
      },
      // C: Cassa o cumulo di rottami navali in bronzo
      C(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "rgba(0,0,0,0.3)";
        g.fillRect(sx + 2, sy + 12, 12, 3);
        g.fillStyle = "#78350f";
        g.fillRect(sx + 2, sy + 4, 12, 9);
        g.fillStyle = "#b45309";
        g.fillRect(sx + 3, sy + 2, 10, 3);
        g.fillStyle = "#fbbf24";
        g.fillRect(sx + 4, sy + 5, 3, 2);
        g.fillRect(sx + 9, sy + 7, 3, 2);
      },
      // I: Incudine su ceppo di quercia
      I(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "rgba(0,0,0,0.3)";
        g.fillRect(sx + 3, sy + 13, 10, 2);
        // Ceppo
        g.fillStyle = "#451a03";
        g.fillRect(sx + 4, sy + 8, 8, 6);
        // Incudine acciaio
        g.fillStyle = "#64748b";
        g.fillRect(sx + 2, sy + 5, 12, 4);
        g.fillStyle = "#94a3b8";
        g.fillRect(sx + 1, sy + 4, 7, 2);
      },
      // E: Statua o piedistallo di marmo aristocratico
      E(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "rgba(0,0,0,0.25)";
        g.fillRect(sx + 3, sy + 13, 10, 2);
        g.fillStyle = "#d1d5db";
        g.fillRect(sx + 3, sy + 7, 10, 7);
        g.fillStyle = "#f3f4f6";
        g.fillRect(sx + 4, sy + 2, 8, 6);
        g.fillStyle = "#fbbf24";
        g.fillRect(sx + 6, sy + 4, 4, 2);
      }
    },
    bonds: {
      talk: 4,
      per: 10,
      max: 5,
      names: ["fc_arturo", "fc_valerio", "fc_gina", "fc_tullio"],
      scenes: {
        fc_arturo: [
          {
            lv: 2,
            id: "sc_arturo_lente",
            lines: [
              ["fc_arturo", "[furbo] Questa lente ha sessant'anni, ragazzo. Ci ho guardato dentro smeraldi, monete papali e contratti di mezzeria."],
              ["fc_arturo", "E sai cosa ho imparato? Che l'oro autentico non ha mai paura del fuoco... ma gli uomini sì."]
            ]
          }
        ],
        fc_valerio: [
          {
            lv: 2,
            id: "sc_valerio_muro",
            lines: [
              ["fc_valerio", "[serio] Quel campo non è solo terra battuta e gradoni scrostati. Lì dentro ho lasciato i miei vent'anni, i menischi e la voce."],
              ["fc_valerio", "Se le ruspe della Morosini toccano la curva nord, giuro che mi lego con una catena ai pali della porta."]
            ]
          }
        ],
        fc_tullio: [
          {
            lv: 2,
            id: "sc_tullio_bronzo",
            lines: [
              ["fc_tullio", "[ride] Il bronzo navale è come i marinai: duro di testa, testardo sul fondo e non fa ruggine neanche sotto le bombe."],
              ["fc_tullio", "Se dobbiamo colare la coppa del trentaquattro, usiamo il bronzo dei sommergibili del '30. Così pesa il giusto e canta come un do di petto."]
            ]
          }
        ]
      }
    },
    inv: {
      items: {
        fa_lente: {
          n: "Lente d'Argento da Orefice",
          icon: "🔍",
          d: "Strumento tascabile a tre ingrandimenti con montatura d'argento tedesco. Rivelatore di punzoni e difetti microscopici.",
          gift: { fc_arturo: 15 }
        },
        fa_calibro: {
          n: "Calibro a Corsoio Millimetrico",
          icon: "📏",
          d: "Calibro in acciaio inox temprato con vite di bloccaggio e precisione al ventesimo di millimetro.",
          gift: { fc_arturo: 10 }
        },
        fa_calco: {
          n: "Calco in Cera d'Api",
          icon: "🕯️",
          d: "Impronta esatta dello stemma araldico della Rondine prelevata direttamente dal calice della Coppa del 1934.",
          gift: { fc_arturo: 10 }
        },
        fa_sigaro: {
          n: "Sigaro Toscano Ammezzato",
          icon: "🍂",
          d: "Sigaro fermentato dal profumo secco e legnoso, molto amato dai vecchi carabinieri del borgo.",
          gift: { fc_desantis: 15 }
        },
        fa_gagliardetto: {
          n: "Gagliardetto Rondine 1934",
          icon: "🚩",
          d: "Riproduzione d'epoca in seta pesante con frange dorate e il primo stemma ricamato a mano.",
          gift: { fc_valerio: 20 }
        },
        fa_bronzo: {
          n: "Lingotto di Bronzo Navale 1930",
          icon: "🧱",
          d: "Metallo bellico recuperato dai cantieri del porto. Ha la densità esatta (8,8 g/cm³) della Coppa del 1934.",
          gift: { fc_tullio: 25 }
        },
        fa_zolfo: {
          n: "Fegato di Zolfo per Patina",
          icon: "🧪",
          d: "Reagente chimico per ossidare e invecchiare artificialmente i metalli dorati, donando la patina dei decenni.",
          gift: { fc_arturo: 15 }
        },
        fa_bulino: {
          n: "Bulino in Acciaio Temprato",
          icon: "✒️",
          d: "Attrezzo da incisore ad altissima precisione per riprodurre le micro-cesellature d'epoca.",
          gift: { fc_arturo: 20 }
        },
        fa_pergamena: {
          n: "Pergamena Demaniale del 1934",
          icon: "📜",
          d: "Atto notarile che istituisce il vincolo d'uso perpetuo per il campo da gioco della Rondine.",
          gift: { fc_valerio: 30 }
        },
        fa_chiave_villa: {
          n: "Chiave Dorata della Limonaia",
          icon: "🗝️",
          d: "Passe-partout per accedere al parco privato e alle sale interne di Villa Morosini."
        }
      }
    },
    cases: {
      coppa1934: {
        t: "La Coppa del 1934 e il Bando Morosini",
        q: "Indaga sulla composizione della lega, sul peso effettivo e sulle clausole di demanio inalienabile.",
        items: {
          impronta: { t: "Impronta dello Stemma", d: "Rondine in volo con spighe e data 1934 cesellata a mano.", icon: "🕯️", kind: "prova" },
          lega: { t: "Lega Pesante Bellica", d: "Il trofeo fu fuso con bronzo navale pesante: peso stimato 1.840 grammi.", icon: "⚖️", kind: "indizio" },
          bando: { t: "Bando d'Asta Morosini", d: "La contessa vuole liquidare il trofeo e lo stadio entro tre giorni.", icon: "📜", kind: "documento" }
        },
        links: [
          ["impronta", "lega", "La densità della lega bellica impedisce l'uso del comune ottone commerciale."]
        ],
        verdicts: [
          { id: "replica", label: "Fabbricare il Falso Perfetto", sub: "Replica la coppa rispettando peso e tonalità." }
        ]
      }
    },
    endings: [
      { id: "olmo", title: "L'Olmo Sacro", desc: "La pergamena prova il vincolo perpetuo del 1934: lo stadio è salvo e le ruspe sono respinte." },
      { id: "montecarlo", title: "Il Colpo Perfetto a Montecarlo", desc: "La replica perfetta inganna l'asta: la banda si gode la pensione dorata in Costa Azzurra." },
      { id: "rigore", title: "I Mastri di Rigore", desc: "Il peso fuori tolleranza fa scattare l'allarme: condanna a servizi socialmente utili per curare il campo." },
      { id: "segreto", title: "Il Primo Falso del 1934", desc: "Scopri che la coppa era già una replica forgiata nel 1934: l'oro vero finanziava la squadra popolare!" }
    ]
  });

  // Helper comune per le persone e dialoghi della saga
  window.__falsariCore = E;
  window.__falsariH = function (K) {
    let QL = [];
    const H = {
      people() {
        K.cast("fc_arturo", {
          name: "Arturo Silvestri",
          style: "slick",
          hair: "#94a3b8",
          skin: "#d5a57a",
          shirt: "#78350f",
          acc: ["occhiali", "lente"],
          beard: "baffi"
        }, "Maestro orafo e restauratore d'antiquariato del Borgo; ha la vista lunga e l'ironia tagliente.");

        K.cast("fc_valerio", {
          name: "Valerio Ronchi",
          style: "buzz",
          hair: "#475569",
          skin: "#c68642",
          shirt: "#991b1b",
          acc: ["sciarpa"],
          beard: "incolta"
        }, "Ex stopper d'acciaio della Rondine anni '80; difende lo stadio storico come difendeva l'area di rigore.");

        K.cast("fc_gina", {
          name: "Gina del Bar",
          style: "bun",
          hair: "#451a03",
          skin: "#f0d0b0",
          shirt: "#b45309",
          acc: ["grembiule"]
        }, "Proprietaria del Bar Centrale e custode della chiave di servizio del Municipio.");

        K.cast("fc_desantis", {
          name: "Maresciallo De Santis",
          style: "ordinato",
          hair: "#334155",
          skin: "#d5a57a",
          shirt: "#1e3a5f",
          acc: ["cappellino"],
          beard: "pizzetto"
        }, "Comandante della stazione locale; severo nei regolamenti, ma ex terzino con un debole per la maglia granata.");

        K.cast("fc_tullio", {
          name: "Mastro Tullio Moriconi",
          style: "buzz",
          hair: "#64748b",
          skin: "#b45309",
          shirt: "#451a03",
          acc: ["grembiule"],
          beard: "folta"
        }, "Mastro fonditore navale dei cantieri vecchi; custode del grande crogiolo e dei segreti delle leghe belliche.");

        K.cast("fc_nino", {
          name: "Oste Nino",
          style: "slick",
          hair: "#334155",
          skin: "#e8c4a0",
          shirt: "#1e3a8a",
          acc: ["sciarpa"],
          beard: "baffi"
        }, "Titolare dell'osteria di porto «La Prua d'Oro», ritrovo fidato di pescatori, scaricatori e tifosi granata.");

        K.cast("fc_morosini", {
          name: "Contessa Morosini",
          style: "bun",
          hair: "#475569",
          skin: "#fde047",
          shirt: "#4c1d95",
          acc: ["occhiali"]
        }, "Erede dell'impero industriale Morosini; collezionista implacabile determinata ad abbattere lo stadio storico.");

        K.cast("fc_renzi", {
          name: "Avvocato Renzi",
          style: "ordinato",
          hair: "#1e293b",
          skin: "#d9a679",
          shirt: "#0f172a",
          acc: ["occhiali"],
          beard: "pizzetto"
        }, "Procuratore legale della contessa, specializzato in aste fallimentari e cavilli demaniali.");
      },
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => {
        const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn })));
        if (l.length) K.say(l, go); else go();
      },
      wask: (prompt, opts) => {
        const l = H.flush(), go = () => K.weight.ask("fc_arturo", prompt, opts);
        if (l.length) K.say(l, go); else go();
      }
    };
    return H;
  };

  window.__falsari = E.api;
})();
