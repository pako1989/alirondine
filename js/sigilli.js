// js/sigilli.js - «L'ACCADEMIA DEI SIGILLI · ESAMI DI MAGIA DEL PALLONE»
// Configurazione saga su js/saga-core.js.
// Studio balistico e sortilegi nel leggendario collegio arcano del Monte Rondine:
// tra biblioteche sospese, cortili di pietra antica, aule di alchimia e la Torre dei Quattro Sigilli.
(function () {
  "use strict";
  if (window.__sigilli || !window.__sagaCore) return;

  const E = window.__sagaCore.create({
    id: "sigilli",
    key: "ali-di-rondine.sigilli",
    title: "L'Accademia dei Sigilli · Esami di Magia del Pallone",
    icon: "📜",
    bg: "sg_titolo",
    chapters: 3,
    menuSub: "Supera gli esami di ammissione dell'antica Accademia Arcana, svela le rune segrete celate nella Biblioteca Proibita e padroneggia i Quattro Sigilli nella notte della Grande Congiunzione.",
    theme: {
      accent: "#6366f1",
      ink: "#0f172a",
      paper: "rgba(245,243,255,.96)",
      font: "'Trebuchet MS', 'Segoe UI', system-ui",
      chipBg: "#ede9fe",
      chipBorder: "#6366f1"
    },
    stats: {
      mana: [0, 99, 20, "Mana Arcano"],
      sapienza: [0, 99, 15, "Sapienza Balistica"],
      fiducia: [0, 99, 25, "Fiducia Accademica"]
    },
    regions: {
      accademia: {
        grass: ["#1e1b4b", "#312e81", "#0f172a"],
        path: ["#475569", "#334155"],
        stone: ["#312e81", "#1e1b4b"],
        wall: ["#09090b", "#18181b"],
        water: ["#6366f1", "#4f46e5"],
        tree: "#a855f7",
        tint: "99,102,241",
        tintA: 0.08,
        fx: "sparks"
      },
      biblioteca: {
        grass: ["#0f172a", "#1e293b", "#020617"],
        path: ["#334155", "#1e293b"],
        stone: ["#1e293b", "#0f172a"],
        wall: ["#020617", "#090d16"],
        water: ["#38bdf8", "#0284c7"],
        tree: "#38bdf8",
        tint: "56,189,248",
        tintA: 0.08,
        fx: "dust"
      },
      osservatorio: {
        grass: ["#030712", "#0f172a", "#1e1b4b"],
        path: ["#334155", "#475569"],
        stone: ["#312e81", "#0f172a"],
        wall: ["#020617", "#0f172a"],
        water: ["#fbbf24", "#d97706"],
        tree: "#fbbf24",
        tint: "251,191,36",
        tintA: 0.1,
        fx: "fireflies"
      }
    },
    solid: "LBSA",
    paint: {
      R(K, sx, sy) {
        // Runa sul pavimento (calpestabile)
        const g = K.g;
        g.strokeStyle = "rgba(168,85,247,.6)";
        g.lineWidth = 1.5;
        g.beginPath();
        g.arc(sx + 8, sy + 8, 6, 0, 7);
        g.stroke();
        g.fillStyle = "#fbbf24";
        g.fillRect(sx + 7, sy + 7, 2, 2);
      },
      L(K, sx, sy) {
        // Libreria gotica in mogano
        const g = K.g;
        g.fillStyle = "#3b1e10";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#200e06";
        g.fillRect(sx + 1, sy + 3, 14, 4);
        g.fillRect(sx + 1, sy + 9, 14, 5);
        // Dorso libri
        const cols = ["#dc2626", "#2563eb", "#ca8a04", "#16a34a", "#9333ea"];
        for (let i = 0; i < 5; i++) {
          g.fillStyle = cols[i];
          g.fillRect(sx + 2 + i * 2.5, sy + 3, 2, 4);
          g.fillStyle = cols[(i + 2) % 5];
          g.fillRect(sx + 2 + i * 2.5, sy + 9, 2, 5);
        }
      },
      B(K, sx, sy) {
        // Banco di alchimia
        const g = K.g;
        g.fillStyle = "#451a03";
        g.fillRect(sx + 1, sy + 4, 14, 10);
        g.fillStyle = "#78350f";
        g.fillRect(sx + 2, sy + 3, 12, 3);
        // Provetta / Alambicco
        g.fillStyle = "#38bdf8";
        g.beginPath();
        g.arc(sx + 8, sy + 6, 3, 0, 7);
        g.fill();
        g.fillStyle = "#fbbf24";
        g.fillRect(sx + 7.5, sy + 2, 1, 2);
      },
      S(K, sx, sy) {
        // Statua Fondatore con sfera dorata
        const g = K.g;
        g.fillStyle = "#475569";
        g.fillRect(sx + 2, sy + 8, 12, 8);
        g.fillStyle = "#64748b";
        g.fillRect(sx + 4, sy + 2, 8, 7);
        g.fillStyle = "#fbbf24";
        g.beginPath();
        g.arc(sx + 8, sy + 4, 2.5, 0, 7);
        g.fill();
      },
      A(K, sx, sy) {
        // Astrolabio astronomico
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx + 4, sy + 10, 8, 6);
        g.strokeStyle = "#ca8a04";
        g.lineWidth = 1.2;
        g.beginPath();
        g.arc(sx + 8, sy + 6, 5, 0, 7);
        g.stroke();
        g.beginPath();
        g.ellipse(sx + 8, sy + 6, 5, 2, 0.5, 0, 7);
        g.stroke();
      }
    },
    act: {
      q: "Entra",
      R: "Esamina la runa incisa",
      L: "Sfoglia il tomo arcano",
      B: "Osserva l'alambicco balistico",
      S: "Leggi l'epigrafe del Fondatore",
      A: "Allinea gli anelli dell'astrolabio"
    },
    travel: true,
    item: ["Frammento di Pergamena", "Frammenti di Pergamena"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.fillStyle = "#fef08a";
      g.fillRect(-4, -5, 8, 10);
      g.strokeStyle = "#ca8a04";
      g.lineWidth = 1;
      g.strokeRect(-4, -5, 8, 10);
      g.fillStyle = "#6366f1";
      g.fillRect(-5, -1, 10, 2);
      g.restore();
    },
    stadium: {
      azPitch: "lizza",
      cageField: 3,
      cageMut: "turbo",
      weather: "clear",
      venue: {
        ads: [
          ["ACCADEMIA DEI SIGILLI · AULA MAGNA", "#818cf8"],
          ["MAGIA BALISTICA · LEGA DEI QUATTRO ELEMENTI", "#fbbf24"],
          ["ALCHIMIA DEL PALLONE · ANNO ACCADEMICO 1492", "#a855f7"],
          ["NON CALCIARE CONTRO I GOLEM DI PIETRA", "#f87171"]
        ],
        crowd: ["#1e1b4b", "#6366f1", "#fbbf24", "#f8fafc", "#4f46e5"],
        ground: ["#1e1b4b", "#312e81"],
        wall: ["#0f172a", "#1e1b4b"],
        line: "rgba(165,180,252,.75)",
        sky: ["#090d16", "#1e1b4b"],
        fx: { fr: 0.99, spd: 1.05, wind: 0.1 }
      }
    },
    guest: {
      id: "sg_preside",
      lines: [
        "Benvenuto al Borgo, nobile Campione! Le onde d'etere del mare mi ricordavano i flussi runici dell'Accademia.",
        "Miriel ha superato brillantemente il secondo anno e Tobia ha persino inventato una punizione a curva di vento tutta sua.",
        "Ricorda: il vero talento non è piegare la magia alla propria volontà, ma giocare all'unisono con le forze invisibili del campo.",
        "Se mai un giorno le tue traiettorie avessero bisogno di un pizzico di polvere di stelle... sai su quale colle bussare!"
      ]
    },
    endings: {
      luce: [
        "Il Sigillo dell'Aura",
        "Hai consacrato la runa per la difesa del collegio. Una barriera dorata protegge per sempre gli studenti e la magia balistica resta al servizio di tutti.",
        "Attiva la barriera difensiva dell'Aura Pura."
      ],
      tempesta: [
        "Il Tuono del Campione",
        "Hai canalizzato l'energia della tempesta nel tuo tiro vincente. L'Accademia trionfa nel torneo intercollegiale con un record ineguagliabile.",
        "Scatena la Runa del Tuono Balistico."
      ],
      specchio: [
        "L'Armonia delle Case",
        "Hai unito le due fazioni rivali dell'Accademia condividendo i segreti della Runa del Doppio: nasce una nuova era di cooperazione magica.",
        "Fondi i sigilli rivali nello Specchio d'Accordo."
      ],
      arcano: [
        "Il Quinto Sigillo Perduto",
        "Finale segreto: con tutti i 6 frammenti di pergamena raccolti, risvegli l'antico Sigillo della Rondine d'Oro del 1492, la magia calcistica originaria.",
        "Allinea l'astrolabio e incidi il Quinto Sigillo."
      ]
    }
  });

  const K = E.K;

  K.sgMana = function (delta) {
    const cur = K.stat("mana");
    const next = Math.max(0, Math.min(99, cur + delta));
    K.bond("mana", delta);
    if (delta > 0 && window.toast) window.toast(`✨ Mana Arcano +${delta} (totale ${next})`, "success", "🔮");
  };

  K.sgFrammento = function (targetId, nome) {
    const k = "sg_frag_" + targetId;
    if (K.F.get(k)) return false;
    K.F.set(k, true);
    const count = (K.F.get("sg_frag_count") || 0) + 1;
    K.F.set("sg_frag_count", count);
    K.bond("sapienza", 10);
    if (window.toast) window.toast(`Pergamena antica trovata: ${nome} (${count}/6)`, "success", "📜");
    return true;
  };

  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);

    K.cast("sg_preside", {
      name: "Preside Alistair",
      sub: "Gran Maestro dell'Accademia",
      style: "slick",
      hair: "#e2e8f0",
      eye: "#38bdf8",
      skin: "#e0ac7e",
      shirt: "#312e81",
      beard: "folta",
      acc: ["occhiali", "corona"],
      bg: ["#4338ca", "#0f172a"]
    }, "Decano secolare dell'Accademia dei Sigilli. Custodisce le pergamene dei primi fondatori ed è capace di leggere la traiettoria di un pallone prima ancora che sia calciato.");

    K.cast("sg_miriel", {
      name: "Miriel la Saetta",
      sub: "Studentessa Prodigio",
      style: "twintails",
      hair: "#a855f7",
      eye: "#fbbf24",
      skin: "#f5d6b8",
      shirt: "#4338ca",
      acc: ["fascia"],
      bg: ["#7c3aed", "#1e1b4b"]
    }, "La miglior tiratrice del secondo anno: le sue traiettorie a spirale curvano nell'aria lasciando una scia di faville di vento.");

    K.cast("sg_tobia", {
      name: "Tobia il Novizio",
      sub: "Apprendista Alchimista",
      style: "messy",
      hair: "#b45309",
      eye: "#22c55e",
      skin: "#f2c9a0",
      shirt: "#4338ca",
      acc: ["cappellino"],
      bg: ["#1e293b", "#0f172a"]
    }, "Compagno di studi timido ma ingegnoso: passa le notti a miscelare inchiostri runici e ad allenare la parata perfetta.");

    K.cast("sg_balthazar", {
      name: "Mastro Balthazar",
      sub: "Docente di Balistica Elementale",
      style: "pompadour",
      hair: "#111827",
      eye: "#ef4444",
      skin: "#b9804f",
      shirt: "#1e1b4b",
      beard: "pizzetto",
      acc: ["visiera", "fischietto"],
      bg: ["#312e81", "#18181b"]
    }, "Severo ma giusto: fischia i falli con un fischietto intagliato nell'ossidiana e non ammette tiri sbilanciati.");

    K.cast("sg_archimede", {
      name: "Archimede il Gufo",
      sub: "Spirito della Biblioteca",
      shape: "nuvola",
      skin: "#93c5fd",
      eye: "#fbbf24",
      hair: "#3b82f6",
      shirt: "#1d4ed8",
      acc: ["occhiali"],
      bg: ["#1e1b4b", "#0f172a"]
    }, "Spirito guardiano degli archivi magici: si sposta fluttuando tra le scansie e sussurra indizi solo a chi rispetta il silenzio.");

    K.cast("sg_golem", {
      name: "Golem di Difesa",
      sub: "Guardiano di Granito Runic",
      shape: "robot",
      skin: "#64748b",
      eye: "#38bdf8",
      hair: "#334155",
      shirt: "#475569",
      bg: ["#0f172a", "#1e293b"]
    }, "Costrutto animato dalla Runa della Terra. Fa da barriera impenetrabile durante le esercitazioni dei calci di punizione.");

    K.cast("sg_valerian", {
      name: "Valerian d'Ombra",
      sub: "Capitano dei Grifoni Neri",
      style: "slick",
      hair: "#0f172a",
      eye: "#c084fc",
      skin: "#e0ac7e",
      shirt: "#18181b",
      streak: "#a855f7",
      bg: ["#3b0764", "#090d16"]
    }, "Rivale accademico ambizioso: convinto che la magia balistica debba servire solo a schiacciare gli avversari.");
  }
  casts();

  window.__sigilli = E.api;
})();
