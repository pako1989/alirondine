// js/spia.js - «OPERAZIONE DOPPIO ZERO · LICENZA DI CROSS» · Configurazione saga su js/saga-core.js
// Spy story elegante e ironica: il Campione viene scambiato per il leggendario Agente 00
// tra smoking al Casinò Royale di Montegol, inseguimenti in funivia sulle Alpi e il covo del vulcano.
(function () {
  "use strict";
  if (window.__spia || !window.__sagaCore) return;

  const E = window.__sagaCore.create({
    id: "spia",
    key: "ali-di-rondine.spia",
    title: "Operazione Doppio Zero · Licenza di Cross",
    icon: "🍸",
    bg: "dz_titolo",
    chapters: 3,
    menuSub: "Nei panni dell'Agente 00 tra smoking di Montegol, inseguimenti in funivia e il covo del vulcano: disinnesca il Cannone Ghiacciato a suon di tiri a effetto al Tavolo da Gioco.",
    theme: {
      accent: "#10b981",
      ink: "#0f172a",
      paper: "rgba(240,253,244,.96)",
      font: "'Trebuchet MS', 'Segoe UI', system-ui",
      chipBg: "#d1fae5",
      chipBorder: "#10b981"
    },
    stats: {
      freddezza: [0, 99, 25, "Sangue Freddo 00"],
      gadget: [0, 99, 20, "Arsenale Tecnologico"],
      fascino: [0, 99, 20, "Fascino & Copertura"]
    },
    regions: {
      montegol: {
        grass: ["#047857", "#065f46", "#064e3b"],
        path: ["#f1f5f9", "#e2e8f0"],
        stone: ["#64748b", "#475569"],
        wall: ["#0f172a", "#1e293b"],
        water: ["#0284c7", "#0369a1"],
        tree: "#047857",
        tint: "16,185,129",
        tintA: 0.08,
        fx: "fireflies"
      },
      neve: {
        grass: ["#f8fafc", "#f1f5f9", "#e2e8f0"],
        path: ["#78350f", "#92400e"],
        stone: ["#475569", "#334155"],
        wall: ["#451a03", "#78350f"],
        water: ["#38bdf8", "#0284c7"],
        tree: "#064e3b",
        tint: "224,242,254",
        tintA: 0.12,
        fx: "snow"
      },
      bunker: {
        grass: ["#1e293b", "#0f172a", "#020617"],
        path: ["#475569", "#334155"],
        stone: ["#1e1b4b", "#0f172a"],
        wall: ["#020617", "#0f172a"],
        water: ["#ea580c", "#c2410c"],
        tree: "#dc2626",
        tint: "239,68,68",
        tintA: 0.08,
        fx: "sparks"
      }
    },
    solid: "aGrTLBMV",
    paint: {
      a(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#334155";
        g.fillRect(sx + 1, sy + 1, 14, 6);
        g.fillRect(sx + 1, sy + 9, 14, 6);
        g.fillStyle = "#ffd23f";
        g.fillRect(sx + 1, sy + 7, 14, 1);
      },
      G(K, sx, sy, tx, ty, fr) {
        const g = K.g;
        g.fillStyle = "#b91c1c";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#f97316";
        g.fillRect(sx + 1 + Math.sin(fr / 10 + ty) * 2, sy + 3, 8, 3);
        g.fillStyle = "#fde047";
        g.fillRect(sx + 6 + Math.cos(fr / 12 + tx) * 3, sy + 10, 6, 2);
      },
      r(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#064e3b";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#ffd23f";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 6.5, 0, 7);
        g.fill();
        g.fillStyle = "#e11d48";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 3.5, 0, 7);
        g.fill();
      },
      T(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#0f172a";
        g.fillRect(sx + 1, sy + 2, 14, 13);
        g.fillStyle = "#10b981";
        g.fillRect(sx + 3, sy + 4, 10, 8);
        g.fillStyle = "#34d399";
        g.fillRect(sx + 5, sy + 7, 6, 2);
      },
      L(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx + 3, sy + 3, 10, 10);
        g.fillStyle = "#ef4444";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 3.5, 0, 7);
        g.fill();
      },
      B(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 1, sy + 3, 14, 11);
        g.fillStyle = "#ffd23f";
        g.fillRect(sx + 4, sy + 1, 3, 4);
        g.fillRect(sx + 9, sy + 1, 3, 4);
      },
      M(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#475569";
        g.fillRect(sx + 2, sy + 2, 12, 12);
        g.strokeStyle = "#94a3b8";
        g.strokeRect(sx + 2.5, sy + 2.5, 11, 11);
        g.fillStyle = "#ffd23f";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 2, 0, 7);
        g.fill();
      },
      V(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "rgba(56,189,248,0.35)";
        g.fillRect(sx, sy, 16, 16);
        g.strokeStyle = "rgba(255,255,255,0.7)";
        g.beginPath();
        g.moveTo(sx + 2, sy + 14);
        g.lineTo(sx + 14, sy + 2);
        g.stroke();
      }
    },
    act: {
      q: "Entra",
      G: "Guarda il magma",
      r: "Punta sulla roulette",
      T: "Accedi al terminale cifrato",
      L: "Esamina il circuito laser",
      B: "Ordina un cocktail shakerato",
      M: "Ispeziona la cassaforte",
      V: "Guarda attraverso la vetrata blindata"
    },
    travel: true,
    item: ["Microspia d'Oro", "Microspie d'Oro"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.fillStyle = "#ffd23f";
      g.beginPath();
      g.arc(0, 0, 5, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#b45309";
      g.lineWidth = 1.2;
      g.stroke();
      // Minuscolo led rosso lampeggiante
      g.fillStyle = (f % 20 < 10) ? "#ef4444" : "#991b1b";
      g.beginPath();
      g.arc(0, -1, 1.8, 0, Math.PI * 2);
      g.fill();
      // Antenna
      g.strokeStyle = "#0f172a";
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(0, -5);
      g.lineTo(2, -8);
      g.stroke();
      g.restore();
    },
    stadium: {
      azPitch: "neon",
      cageField: 3,
      cageMut: "turbo",
      weather: "rain",
      venue: {
        ads: [
          ["SERVIZI SEGRETI DEL PALLONE · LICENZA 00", "#10b981"],
          ["CASINÒ ROYALE DI MONTEGOL", "#ffd23f"],
          ["SYNDICATE BLIZZARD · GELO MONDIALE", "#38bdf8"],
          ["MARTINI TATTICO · SHAKERATO NON MESCOLATO", "#ec4899"]
        ],
        crowd: ["#0f172a", "#10b981", "#ffd23f", "#f8fafc", "#e11d48"],
        ground: ["#064e3b", "#047857"],
        wall: ["#0f172a", "#1e293b"],
        line: "rgba(255,210,63,.8)",
        sky: ["#0f172a", "#020617"],
        fx: { fr: 0.96, spd: 1.08, wind: 0.4 }
      }
    },
    guest: {
      id: "dz_sterling",
      lines: [
        "Buona serata, Campione. Lo smoking ti dona ancora, ma vedo che preferisci gli scarpini con i tacchetti.",
        "Al Casinò Royale ricordano ancora la tua carambola sul velluto verde: un tiro d'effetto da antologia.",
        "Il Barone von Kalt è sotto stretta sorveglianza diplomatica. Non tenterà più di congelare la finale di coppa.",
        "Ricorda la prima regola del Servizio: mantieni sempre la calma, mira al palo lontano e non farti mai scoprire!"
      ]
    },
    endings: {
      diplomatico: [
        "Licenza Diplomatica",
        "Hai sventato il sabotaggio e consegnato il Barone alle autorità calcistiche internazionali. Ricevi la medaglia d'oro al valore spionistico.",
        "Consegna il dossier al Ministero."
      ],
      ombra: [
        "L'Ombra Silenziosa",
        "Decidi di non rivelare la tua identità e lasci che la leggenda dell'Agente Segreto svanisca nella notte di Montegol.",
        "Svanisci nella nebbia senza testimoni."
      ],
      spettacolo: [
        "Trionfo al Casinò",
        "Celebri la vittoria con una parata trionfale al Casinò Royale e una partita d'esibizione sui tavoli verdi di tutta la riviera.",
        "Fai saltare il banco in diretta mondiale."
      ],
      segreto: [
        "Protocollo Doppio Zero",
        "Finale segreto: con tutte e 6 le microspie d'oro piazzate, scopri il covo segreto sottomarino e disinneschi il Cannone senza far scattare un solo allarme.",
        "Attiva il codice segreto 00-Rondine."
      ]
    }
  });

  const K = E.K;

  // Funzioni specializzate per la saga di spionaggio
  K.spiaDisguise = function (tipo) {
    K.F.set("dz_disguise", tipo);
    const nomi = {
      smoking: "Smoking Elegante da Gala",
      croupier: "Gilet da Croupier della Roulette",
      sciatore: "Tuta Termica Invernale",
      tecnico: "Tuta da Elettricista dei Laser"
    };
    if (window.toast) window.toast(`Travestimento: ${nomi[tipo] || tipo}`, "info", "🎭");
  };

  K.spiaBug = function (targetId, nome) {
    const k = "dz_bug_" + targetId;
    if (!K.F.get(k)) {
      K.F.set(k, true);
      const total = (K.F.get("dz_bug_count") || 0) + 1;
      K.F.set("dz_bug_count", total);
      K.bond("gadget", 6);
      if (window.toast) window.toast(`Microspia piazzata su ${nome || targetId} (${total}/6)`, "goal", "📡");
    }
  };

  // Cast dei personaggi di Operazione Doppio Zero
  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);
    K.cast("dz_sterling", {
      name: "Agente Sterling",
      sub: "Agente Speciale 00",
      style: "slick",
      hair: "#1c1917",
      eye: "#2563eb",
      skin: "#e0ac7e",
      shirt: "#0f172a",
      acc: ["occhiali"],
      bg: ["#064e3b", "#0f172a"]
    }, "Il più raffinato agente segreto della sezione sportiva. Non perde mai la calma, non sbaglia mai un cross e preferisce le carambole a effetto alle pistole.");

    K.cast("dz_eva", {
      name: "Eva Vesper",
      sub: "Esperta Crittografa",
      style: "bob",
      hair: "#2b1d14",
      eye: "#10b981",
      skin: "#f5d6b8",
      shirt: "#e11d48",
      acc: ["cuffie"],
      bg: ["#10b981", "#022c22"]
    }, "Mente brillante dei servizi tecnologici. Calcola traiettorie paraboliche al millimetro e sa decifrare qualsiasi codice radio prima che scada il tempo.");

    K.cast("dz_croupier", {
      name: "Felix il Croupier",
      sub: "Contatto di Montegol",
      style: "side",
      hair: "#2b1d14",
      eye: "#475569",
      skin: "#fed7aa",
      shirt: "#047857",
      acc: ["fischietto"],
      bg: ["#047857", "#ffd23f"]
    }, "Croupier della roulette al Casinò Royale e informatore fidato. Conosce ogni trucco del panno verde e sa far rimbalzare le fiches con precisione geometrica.");

    K.cast("dz_colbacco", {
      name: "Boris il Guardaspalle",
      sub: "Collaudatore delle Nevi",
      style: "buzz",
      hair: "#9a9a9a",
      eye: "#0f172a",
      skin: "#f2c9a0",
      shirt: "#475569",
      beard: "folta",
      acc: ["berretto"],
      bg: ["#1e293b", "#cbd5e1"]
    }, "Gigante burbero a guardia della funivia delle vette. Adora la cioccolata calda bollente e non sospetta minimamente che il maestro di sci sia una spia infiltrata.");

    K.cast("dz_guard1", { name: "Guardaspalle in Smoking", sub: "Buttafuori del Casinò", style: "buzz", hair: "#1c1917", eye: "#1e293b", skin: "#e0ac7e", shirt: "#0f172a", acc: ["occhiali"], bg: ["#1e293b", "#064e3b"] },
      "Armadio in smoking con l'auricolare. Controlla la porta della Sala VIP con la stessa espressione di un portiere che non sbaglia un'uscita.");
    K.cast("dz_guard_neve", { name: "Pattuglia con Sci", sub: "Guardia dello Chalet", style: "buzz", hair: "#78350f", eye: "#0f172a", skin: "#f2c9a0", shirt: "#0284c7", acc: ["berretto"], bg: ["#cbd5e1", "#1e293b"] },
      "Sorveglia la pista con gli sci in spalla. Giudica tutti dalla tuta: se è quella giusta, passi.");
    K.cast("dz_guard_base", { name: "Sentinella Corazzata", sub: "Guardia del Covo", style: "buzz", hair: "#1c1917", eye: "#dc2626", skin: "#e0ac7e", shirt: "#475569", acc: ["visiera"], bg: ["#7f1d1d", "#020617"] },
      "Armatura di titanio e zero senso dell'umorismo. Controlla ogni badge davanti alla barriera laser.");

    K.cast("dz_kalt", {
      name: "Barone von Kalt",
      sub: "Magnate della Blizzard Syndicate",
      style: "ordinato",
      hair: "#e2e8f0",
      eye: "#38bdf8",
      skin: "#fed7aa",
      shirt: "#1e293b",
      beard: "baffi",
      acc: ["lente"],
      bg: ["#020617", "#ef4444"]
    }, "Megaloma industriale del polo nord col monocolo d'oro. Vuole congelare gli stadi di tutto il continente col suo Cannone Criogenico per far vincere i suoi sicari.");
  }
  casts();

  window.__spia = E.api;
  window.__spiaCore = E;

  // Helpers per gli sfondi di scena animati in bg-scenarios.js
  window.__dzDraw = {
    Casino(g, W, H, f) {
      // Sfondo salone VIP Montegol: panno smeraldo e boiserie mogano
      const grd = g.createRadialGradient(W / 2, H * 0.4, 30, W / 2, H * 0.5, W);
      grd.addColorStop(0, "#065f46");
      grd.addColorStop(0.6, "#022c22");
      grd.addColorStop(1, "#01140f");
      g.fillStyle = grd;
      g.fillRect(0, 0, W, H);

      // Lampadario di cristallo al centro
      g.fillStyle = "rgba(255,210,63,0.18)";
      g.beginPath();
      g.moveTo(W / 2, 0);
      g.lineTo(W / 2 - 80, H);
      g.lineTo(W / 2 + 80, H);
      g.closePath();
      g.fill();

      // Gocce di cristallo
      g.fillStyle = "#ffd23f";
      for (let i = -4; i <= 4; i++) {
        const cx = W / 2 + i * 14;
        const cy = 20 + Math.abs(i) * 6 + Math.sin(f / 15 + i) * 2;
        g.beginPath();
        g.arc(cx, cy, 3, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = "rgba(255,255,255,0.6)";
        g.beginPath();
        g.moveTo(cx, 0);
        g.lineTo(cx, cy);
        g.stroke();
      }

      // Tavolo da roulette in basso
      g.fillStyle = "#047857";
      g.beginPath();
      g.ellipse(W / 2, H - 35, 130, 48, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#ffd23f";
      g.lineWidth = 3;
      g.stroke();

      // Ruota della roulette dorata
      g.fillStyle = "#b45309";
      g.beginPath();
      g.arc(W / 2, H - 38, 22, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#ffd23f";
      g.beginPath();
      g.arc(W / 2, H - 38, 7, 0, Math.PI * 2);
      g.fill();
    },

    Chalet(g, W, H, f) {
      // Cielo notturno alpino con vette innevate
      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0f172a");
      sky.addColorStop(0.7, "#1e293b");
      sky.addColorStop(1, "#f1f5f9");
      g.fillStyle = sky;
      g.fillRect(0, 0, W, H);

      // Cime alpine innevate
      g.fillStyle = "#e2e8f0";
      g.beginPath();
      g.moveTo(0, 120);
      g.lineTo(60, 45);
      g.lineTo(130, 110);
      g.lineTo(210, 35);
      g.lineTo(290, 105);
      g.lineTo(W, 60);
      g.lineTo(W, H);
      g.lineTo(0, H);
      g.closePath();
      g.fill();

      // Cavo della funivia
      g.strokeStyle = "#475569";
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(0, 30);
      g.lineTo(W, 85);
      g.stroke();

      // Cabina funivia mobile
      const cabX = (f * 0.8) % (W + 60) - 30;
      const cabY = 30 + (cabX / W) * 55;
      g.fillStyle = "#e11d48";
      g.fillRect(cabX - 12, cabY + 4, 24, 16);
      g.fillStyle = "#38bdf8";
      g.fillRect(cabX - 9, cabY + 7, 8, 8);
      g.fillRect(cabX + 1, cabY + 7, 8, 8);
      g.strokeStyle = "#1e293b";
      g.beginPath();
      g.moveTo(cabX, cabY);
      g.lineTo(cabX, cabY + 4);
      g.stroke();

      // Chalet in legno in primo piano
      g.fillStyle = "#451a03";
      g.fillRect(20, H - 65, 85, 65);
      g.fillStyle = "#78350f";
      g.beginPath();
      g.moveTo(10, H - 65);
      g.lineTo(62, H - 95);
      g.lineTo(115, H - 65);
      g.closePath();
      g.fill();

      // Finestre calde illuminate
      g.fillStyle = "#fef08a";
      g.fillRect(35, H - 45, 18, 18);
      g.fillRect(68, H - 45, 18, 18);
    },

    Bunker(g, W, H, f) {
      // Covo del vulcano: paratie metalliche e magma
      g.fillStyle = "#020617";
      g.fillRect(0, 0, W, H);

      // Fiume di lava ribollente in basso
      const lava = g.createLinearGradient(0, H - 60, 0, H);
      lava.addColorStop(0, "#ea580c");
      lava.addColorStop(0.5, "#dc2626");
      lava.addColorStop(1, "#7f1d1d");
      g.fillStyle = lava;
      g.fillRect(0, H - 50, W, 50);

      // Bolle di lava
      for (let i = 0; i < 5; i++) {
        const bx = (i * 70 + f * 1.5) % W;
        const by = H - 25 + Math.sin(f / 8 + i) * 8;
        g.fillStyle = "#fef08a";
        g.beginPath();
        g.arc(bx, by, 4, 0, Math.PI * 2);
        g.fill();
      }

      // Paratie corazzate in acciaio
      g.fillStyle = "#1e293b";
      g.fillRect(30, 20, 80, 110);
      g.fillRect(W - 110, 20, 80, 110);
      g.strokeStyle = "#475569";
      g.strokeRect(30.5, 20.5, 79, 109);
      g.strokeRect(W - 109.5, 20.5, 79, 109);

      // Raggi laser rossi verticali
      g.strokeStyle = "rgba(239,68,68,0.8)";
      g.lineWidth = 2;
      for (let x = 135; x <= 225; x += 30) {
        g.beginPath();
        g.moveTo(x + Math.sin(f / 12 + x) * 5, 15);
        g.lineTo(x + Math.sin(f / 12 + x) * 5, H - 55);
        g.stroke();
      }

      // Grande schermo Master 00 centrale
      g.fillStyle = "#0f172a";
      g.fillRect(130, 25, 100, 50);
      g.strokeStyle = "#10b981";
      g.lineWidth = 2;
      g.strokeRect(130, 25, 100, 50);
      g.fillStyle = "#10b981";
      g.font = "bold 9px monospace";
      g.fillText("SYSTEM 00: ONLINE", 136, 42);
      g.fillText("CANNONE: 98%", 136, 56);
    }
  };
})();
