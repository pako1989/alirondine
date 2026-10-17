// js/fortino.js - «COLPO AL FORTINO · LA NOTTE DEL TROFEO SCOMPARSO»
// Configurazione saga su js/saga-core.js.
// Heist notturno durante la finalissima allo Stadio Metropolitano:
// Infiltrazione tra condotti, quadri elettrici, caveau blindato e tetti a picco sul campo.
(function () {
  "use strict";
  if (window.__fortino || !window.__sagaCore) return;

  const E = window.__sagaCore.create({
    id: "fortino",
    key: "ali-di-rondine.fortino",
    title: "Colpo al Fortino · La Notte del Trofeo Scomparso",
    icon: "🏦",
    bg: "fo_titolo",
    chapters: 3,
    menuSub: "Infiltrati nei sotterranei blindati dello Stadio Metropolitano durante la finale: disattiva i laser, aggira i fari di ronda e sventa il furto del leggendario Trofeo delle Rondini.",
    theme: {
      accent: "#38bdf8",
      ink: "#0f172a",
      paper: "rgba(240,249,255,.96)",
      font: "'Trebuchet MS', 'Segoe UI', system-ui",
      chipBg: "#e0f2fe",
      chipBorder: "#38bdf8"
    },
    stats: {
      allarme: [0, 99, 15, "Livello Allarme"],
      grimaldelli: [0, 99, 20, "Grimaldelli Elettronici"],
      furtivita: [0, 99, 25, "Furtività & Ombra"]
    },
    regions: {
      condotti: {
        grass: ["#0f172a", "#1e293b", "#020617"],
        path: ["#334155", "#475569"],
        stone: ["#1e293b", "#0f172a"],
        wall: ["#020617", "#0f172a"],
        water: ["#0284c7", "#0369a1"],
        tree: "#0284c7",
        tint: "56,189,248",
        tintA: 0.08,
        fx: "dust"
      },
      caveau: {
        grass: ["#1e1b4b", "#0f172a", "#020617"],
        path: ["#475569", "#334155"],
        stone: ["#312e81", "#1e1b4b"],
        wall: ["#09090b", "#18181b"],
        water: ["#eab308", "#ca8a04"],
        tree: "#ca8a04",
        tint: "250,204,21",
        tintA: 0.08,
        fx: "sparks"
      },
      tetti: {
        grass: ["#090d16", "#0f172a", "#020617"],
        path: ["#334155", "#475569"],
        stone: ["#1e293b", "#0f172a"],
        wall: ["#030712", "#0f172a"],
        water: ["#38bdf8", "#0284c7"],
        tree: "#38bdf8",
        tint: "30,41,59",
        tintA: 0.1,
        fx: "fireflies"
      }
    },
    solid: "aTLCPF",
    paint: {
      a(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#334155";
        g.fillRect(sx + 1, sy + 1, 14, 6);
        g.fillRect(sx + 1, sy + 9, 14, 6);
        g.fillStyle = "#38bdf8";
        g.fillRect(sx + 1, sy + 7, 14, 1);
      },
      T(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#0f172a";
        g.fillRect(sx + 1, sy + 2, 14, 13);
        g.fillStyle = "#38bdf8";
        g.fillRect(sx + 3, sy + 4, 10, 8);
        g.fillStyle = "#facc15";
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
      C(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#475569";
        g.fillRect(sx + 2, sy + 2, 12, 12);
        g.strokeStyle = "#94a3b8";
        g.strokeRect(sx + 2.5, sy + 2.5, 11, 11);
        g.fillStyle = "#facc15";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 2, 0, 7);
        g.fill();
      },
      P(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#0f172a";
        g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#facc15";
        g.fillRect(sx + 3, sy + 6, 10, 4);
        g.fillStyle = "#38bdf8";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 3, 0, 7);
        g.fill();
      },
      F(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx + 2, sy + 4, 12, 10);
        g.fillStyle = "#fef08a";
        g.beginPath();
        g.arc(sx + 8, sy + 6, 4, 0, 7);
        g.fill();
      }
    },
    act: {
      q: "Entra",
      a: "Ispeziona il condotto metallico",
      T: "Accedi al terminale di controllo",
      L: "Esamina il sensore laser",
      C: "Apri la centralina elettrica",
      P: "Verifica l'inclinazione del prisma",
      F: "Osserva il faretto di ronda"
    },
    travel: true,
    item: ["Microchip di Sicurezza", "Microchip di Sicurezza"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.fillStyle = "#0284c7";
      g.fillRect(-5, -4, 10, 8);
      g.fillStyle = "#facc15";
      g.fillRect(-3, -2, 6, 4);
      g.strokeStyle = "#38bdf8";
      g.lineWidth = 1;
      g.strokeRect(-5, -4, 10, 8);
      // Piedini dorati del chip
      g.fillStyle = "#ffd23f";
      for (let p = -4; p <= 4; p += 2) {
        g.fillRect(p - 0.5, -6, 1, 2);
        g.fillRect(p - 0.5, 4, 1, 2);
      }
      g.restore();
    },
    stadium: {
      azPitch: "neon",
      cageField: 2,
      cageMut: "turbo",
      weather: "clear",
      venue: {
        ads: [
          ["STADIO METROPOLITANO · FINALE DI COPPA", "#38bdf8"],
          ["SICUREZZA FORTINO · PROTOCOLLO ZERO", "#f87171"],
          ["TROFEO DELLE RONDINI D'ORO 1912", "#facc15"],
          ["BYTE & LOCK · SISTEMI ANTI-EFFRAZIONE", "#4ade80"]
        ],
        crowd: ["#0f172a", "#38bdf8", "#facc15", "#f8fafc", "#3b82f6"],
        ground: ["#022c22", "#064e3b"],
        wall: ["#0f172a", "#1e293b"],
        line: "rgba(56,189,248,.8)",
        sky: ["#0f172a", "#020617"],
        fx: { fr: 0.98, spd: 1.05, wind: 0.2 }
      }
    },
    guest: {
      id: "fo_lupin",
      lines: [
        "Un saluto da maestro dell'ombra, Campione! I tuoi scatti nei condotti dello Stadio Metropolitano sono già leggenda.",
        "Il Colonnello Rupi sta ancora controllando tutti i fusibili del caveau per capire come hai fatto a deviare quei laser.",
        "Il vero trofeo non è il metallo dorato, ma l'audacia di calciare a effetto anche quando tutti i riflettori sono puntati contro di te.",
        "Se mai avessi bisogno di aprire una cassaforte... o di scavalcare una barriera a cinque uomini, sai dove trovarmi!"
      ]
    },
    endings: {
      incastro: [
        "Incastro Perfetto",
        "Hai consegnato i registri segreti alla giustizia sportiva. Il Presidente Valori viene squalificato e la Coppa delle Rondini torna al suo posto.",
        "Consegna il dossier al Procuratore."
      ],
      popolo: [
        "Il Trofeo al Popolo",
        "Calci la coppa oltre i cancelli direttamente nella Curva Sud dei tifosi in festa: il calcio appartiene a chi lo ama.",
        "Lancia il trofeo tra i cori della curva."
      ],
      notte: [
        "Sparire nella Notte",
        "Svanisci dai tetti dello stadio a bordo di un deltaplano furtivo: la tua identità resta un segreto leggendario.",
        "Lanciati nell'oscurità sopra le tribune."
      ],
      segreto: [
        "Il Codice del Fondatore",
        "Finale segreto: con tutti i 6 microchip raccolti e l'allarme mai al massimo, sblocchi il caveau nascosto del 1912 con il Pallone d'Oro originale.",
        "Inserisci la sequenza antica 1912-Rondine."
      ]
    }
  });

  const K = E.K;

  K.foAllarme = function (delta) {
    const cur = K.stat("allarme");
    const next = Math.max(0, Math.min(99, cur + delta));
    K.bond("allarme", delta);
    if (delta > 0 && window.toast) window.toast(`🚨 Allarme +${delta}% (totale ${next}%)`, "warn", "⚠️");
  };

  K.foChip = function (targetId, nome) {
    const k = "fo_chip_" + targetId;
    if (K.F.get(k)) return false;
    K.F.set(k, true);
    const count = (K.F.get("fo_chip_count") || 0) + 1;
    K.F.set("fo_chip_count", count);
    K.bond("grimaldelli", 10);
    if (window.toast) window.toast(`Microchip raccolto: ${nome} (${count}/6)`, "success", "💾");
    return true;
  };

  // Cast dei personaggi di Colpo al Fortino
  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);
    K.cast("fo_lupin", {
      name: "Loris la Volpe",
      sub: "Ladro Gentiluomo del Pallone",
      style: "slick",
      hair: "#2b1d14",
      eye: "#38bdf8",
      skin: "#e0ac7e",
      shirt: "#0f172a",
      beard: "pizzetto",
      acc: ["cappellino", "fischietto"],
      bg: ["#0284c7", "#0f172a"]
    }, "Mente geniale dell'infiltrazione. Non ruba per denaro, ma per restituire il gioco ai tifosi: calibra rimbalzi a effetto capaci di spegnere qualsiasi sensore d'allarme.");

    K.cast("fo_turing", {
      name: "Daria Byte",
      sub: "Hacker delle Frequenze",
      style: "spacebuns",
      hair: "#06b6d4",
      eye: "#facc15",
      skin: "#f5d6b8",
      shirt: "#1e1b4b",
      acc: ["cuffie", "visiera"],
      bg: ["#38bdf8", "#020617"]
    }, "Maga dell'elettronica e delle trasmissioni radio. Dalla sua consolle portatile decifra i protocolli dei laser dello stadio e sintonizza la sfera-sonda sui prismi ottici.");

    K.cast("fo_gargoyle", {
      name: "Col. Rupi",
      sub: "Capo della Sicurezza",
      style: "buzz",
      hair: "#64748b",
      eye: "#0f172a",
      skin: "#e2e8f0",
      shirt: "#334155",
      beard: "incolta",
      acc: ["berretto", "fischietto"],
      bg: ["#334155", "#0f172a"]
    }, "Ex gendarme dalla disciplina inflessibile. Quando scopre i loschi piani del Presidente Valori, decide di schierarsi a difesa della giustizia sportiva e della coppa.");

    K.cast("fo_boss", {
      name: "Presidente Valori",
      sub: "Miliardario Spregiudicato",
      style: "slick",
      hair: "#94a3b8",
      eye: "#ef4444",
      skin: "#fed7aa",
      shirt: "#18181b",
      beard: "baffi",
      acc: ["occhiali", "sciarpa"],
      bg: ["#0f172a", "#facc15"]
    }, "Dirigente corrotto senza scrupoli. Pronto a inscenare il furto del trofeo centenario delle Rondini per intascare il premio milionario dell'assicurazione e fuggire in Svizzera.");

    K.cast("fo_guard1", {
      name: "Guardia dei Condotti",
      sub: "Vigilante Distratto",
      style: "buzz",
      hair: "#1c1917",
      eye: "#38bdf8",
      skin: "#e0ac7e",
      shirt: "#1e293b",
      acc: ["berretto"],
      bg: ["#0f172a", "#0284c7"]
    }, "Pattuglia i condotti di ventilazione con la radiolina incollata all'orecchio per non perdersi un solo minuto della finalissima.");

    K.cast("fo_guard2", {
      name: "Sentinella del Caveau",
      sub: "Guardia Giurata Livello -2",
      style: "bald",
      hair: "#475569",
      eye: "#f87171",
      skin: "#e0ac7e",
      shirt: "#0f172a",
      acc: ["casco"],
      bg: ["#1e293b", "#ef4444"]
    }, "Sorveglia la porta a tenuta stagna del caveau con passo cadenzato e controlla i monitor della pressione del titanio.");
  }
  casts();

  window.__fortino = E.api;

  // Sfondi di scena per bg-scenarios.js
  window.__foDraw = {
    Titolo(g, W, H, f) {
      // Cielo notturno e profilo dello stadio illuminato
      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#030712");
      sky.addColorStop(0.6, "#0f172a");
      sky.addColorStop(1, "#1e293b");
      g.fillStyle = sky;
      g.fillRect(0, 0, W, H);

      // Fasci di luce dei fari dello stadio
      g.save();
      g.globalAlpha = 0.25;
      for (let i = 0; i < 4; i++) {
        const ang = Math.sin(f / 30 + i * 1.5) * 0.4;
        const x = 50 + i * 80;
        g.fillStyle = "#38bdf8";
        g.beginPath();
        g.moveTo(x, H - 40);
        g.lineTo(x - 40 + Math.tan(ang) * 120, 0);
        g.lineTo(x + 40 + Math.tan(ang) * 120, 0);
        g.closePath();
        g.fill();
      }
      g.restore();

      // Gradinate curve dello stadio
      g.fillStyle = "#1e293b";
      g.beginPath();
      g.moveTo(0, H - 60);
      g.quadraticCurveTo(W / 2, H - 90, W, H - 60);
      g.lineTo(W, H);
      g.lineTo(0, H);
      g.closePath();
      g.fill();

      // Campo verde illuminato al centro
      const pitch = g.createLinearGradient(W / 2 - 70, H - 55, W / 2 + 70, H - 20);
      pitch.addColorStop(0, "#15803d");
      pitch.addColorStop(1, "#166534");
      g.fillStyle = pitch;
      g.beginPath();
      g.ellipse(W / 2, H - 35, 75, 22, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,0.7)";
      g.lineWidth = 1.2;
      g.stroke();

      // Sagoma del trofeo d'oro al centro
      g.save();
      g.fillStyle = "#facc15";
      g.shadowColor = "#facc15";
      g.shadowBlur = 10;
      g.fillRect(W / 2 - 12, H - 85, 24, 28);
      g.beginPath();
      g.arc(W / 2, H - 75, 14, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#ca8a04";
      g.fillRect(W / 2 - 8, H - 57, 16, 6);
      g.fillRect(W / 2 - 14, H - 51, 28, 4);
      g.restore();
    },

    Condotti(g, W, H, f) {
      g.fillStyle = "#020617";
      g.fillRect(0, 0, W, H);

      // Pareti metalliche con rivetti
      g.fillStyle = "#0f172a";
      g.fillRect(20, 15, W - 40, H - 30);
      g.strokeStyle = "#334155";
      g.lineWidth = 2;
      g.strokeRect(20.5, 15.5, W - 41, H - 31);

      // Grande ventola di ventilazione rotante
      const cx = W / 2, cy = H / 2;
      g.save();
      g.translate(cx, cy);
      g.rotate(f * 0.05);
      for (let i = 0; i < 6; i++) {
        g.rotate(Math.PI / 3);
        g.fillStyle = "#475569";
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(-12, -45);
        g.lineTo(12, -45);
        g.closePath();
        g.fill();
        g.strokeStyle = "#64748b";
        g.stroke();
      }
      g.restore();

      // Mozzo centrale ventola
      g.fillStyle = "#1e293b";
      g.beginPath();
      g.arc(cx, cy, 14, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#38bdf8";
      g.lineWidth = 2;
      g.stroke();

      // Cavi e canaline laterali
      g.strokeStyle = "#0284c7";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(20, 30); g.lineTo(cx - 60, 30); g.lineTo(cx - 60, cy);
      g.moveTo(W - 20, 30); g.lineTo(cx + 60, 30); g.lineTo(cx + 60, cy);
      g.stroke();
    },

    Caveau(g, W, H, f) {
      g.fillStyle = "#020617";
      g.fillRect(0, 0, W, H);

      // Pavimento a piastrelle scure riflettenti
      const floor = g.createLinearGradient(0, H - 65, 0, H);
      floor.addColorStop(0, "#0f172a");
      floor.addColorStop(1, "#020617");
      g.fillStyle = floor;
      g.fillRect(0, H - 65, W, 65);

      // Cilindro di titanio centrale
      g.fillStyle = "#1e293b";
      g.fillRect(W / 2 - 35, 25, 70, H - 85);
      g.strokeStyle = "#38bdf8";
      g.lineWidth = 2;
      g.strokeRect(W / 2 - 35, 25, 70, H - 85);

      // Vetrata blindata con riflessi
      g.fillStyle = "rgba(56,189,248,0.18)";
      g.fillRect(W / 2 - 28, 35, 56, H - 105);

      // Coppa dentro il cilindro
      g.save();
      g.fillStyle = "#facc15";
      g.shadowColor = "#facc15";
      g.shadowBlur = 12;
      g.beginPath();
      g.arc(W / 2, H / 2 - 5, 12, 0, Math.PI * 2);
      g.fill();
      g.fillRect(W / 2 - 6, H / 2 + 7, 12, 10);
      g.restore();

      // Raggi laser rossi orizzontali di sicurezza
      g.save();
      g.strokeStyle = "rgba(239,68,68,0.85)";
      g.lineWidth = 1.8;
      g.shadowColor = "#ef4444";
      g.shadowBlur = 6;
      for (let y = 50; y <= H - 80; y += 28) {
        const off = Math.sin(f / 15 + y) * 8;
        g.beginPath();
        g.moveTo(25, y + off);
        g.lineTo(W - 25, y + off);
        g.stroke();
      }
      g.restore();
    },

    Tetti(g, W, H, f) {
      // Cielo notturno urbano con nuvole scure
      const sky = g.createLinearGradient(0, 0, 0, H - 50);
      sky.addColorStop(0, "#020617");
      sky.addColorStop(1, "#0f172a");
      g.fillStyle = sky;
      g.fillRect(0, 0, W, H);

      // Luci skyline della città sullo sfondo
      for (let x = 15; x < W; x += 22) {
        const h = 30 + ((x * 17) % 45);
        g.fillStyle = "#090d16";
        g.fillRect(x, H - 70 - h, 18, h + 20);
        // Finestrelle
        g.fillStyle = ((x + f) % 5 === 0) ? "#fef08a" : "#334155";
        g.fillRect(x + 4, H - 65 - h, 3, 3);
        g.fillRect(x + 10, H - 55 - h, 3, 3);
      }

      // Piattaforma eliporto in primo piano
      g.fillStyle = "#1e293b";
      g.fillRect(30, H - 65, W - 60, 65);
      g.strokeStyle = "#475569";
      g.lineWidth = 2;
      g.strokeRect(30, H - 65, W - 60, 65);

      // Cerchio bianco e H dell'eliporto
      g.strokeStyle = "#f8fafc";
      g.lineWidth = 2.5;
      g.beginPath();
      g.arc(W / 2, H - 35, 26, 0, Math.PI * 2);
      g.stroke();

      g.fillStyle = "#f8fafc";
      g.font = "bold 20px sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("H", W / 2, H - 35);

      // Rotore dell'elicottero rotante sul lato
      g.save();
      g.translate(W / 2 + 70, H - 50);
      g.fillStyle = "#0f172a";
      g.fillRect(-20, -10, 40, 20);
      // Pale
      g.strokeStyle = "rgba(226,232,240,0.6)";
      g.lineWidth = 2;
      const rAng = f * 0.4;
      g.beginPath();
      g.moveTo(Math.cos(rAng) * 35, -12 + Math.sin(rAng) * 4);
      g.lineTo(-Math.cos(rAng) * 35, -12 - Math.sin(rAng) * 4);
      g.stroke();
      g.restore();
    }
  };
})();

