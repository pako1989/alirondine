// js/fiume.js - «LA CAROVANA DEL FIUME D'ARGENTO» · Configurazione saga su js/saga-core.js
// Grande avventura fluviale corale in stile JRPG classico (Suikoden fluviale),
// tra battelli a vapore, chiuse ad arcate monumentali, mercanti del dazio e risacche di corrente.
(function () {
  "use strict";
  if (window.__fiume || !window.__sagaCore) return;

  const E = window.__sagaCore.create({
    id: "fiume",
    key: "ali-di-rondine.fiume",
    title: "La Carovana del Fiume d'Argento",
    icon: "⛵",
    bg: "fa_titolo",
    chapters: 3,
    menuSub: "Naviga il Grande Fiume a bordo del Nautilus di Latta, recluta i maestri del timone e sfida la dogana a Corrente & Rinvio.",
    theme: {
      accent: "#0284c7",
      ink: "#082f49",
      paper: "rgba(240,249,255,.96)",
      font: "'Georgia', 'Trebuchet MS', serif, system-ui",
      chipBg: "#e0f2fe",
      chipBorder: "#0284c7"
    },
    stats: {
      idrologia: [0, 99, 20, "Idrologia del Fiume"],
      intesa: [0, 99, 25, "Intesa dei Battellieri"],
      reputazione: [0, 99, 15, "Reputazione nei Porti"]
    },
    regions: {
      porto: { grass: ["#0284c7", "#0369a1", "#075985"], path: ["#d97706", "#b45309"], stone: ["#64748b", "#475569"], wall: ["#0f172a", "#1e293b"], water: ["#0284c7", "#38bdf8"], tree: "#047857", tint: "56,189,248", tintA: 0.08, fx: "fireflies" },
      chiuse: { grass: ["#475569", "#334155", "#1e293b"], path: ["#cbd5e1", "#94a3b8"], stone: ["#334155", "#1e293b"], wall: ["#0f172a", "#020617"], water: ["#0369a1", "#0284c7"], tree: "#15803d", tint: "14,165,233", tintA: 0.1, fx: "rain" },
      delta: { grass: ["#15803d", "#166534", "#14532d"], path: ["#ca8a04", "#a16207"], stone: ["#94a3b8", "#64748b"], wall: ["#14532d", "#052e16"], water: ["#0ea5e9", "#38bdf8"], tree: "#14532d", tint: "254,240,138", tintA: 0.07, fx: "dust" }
    },
    solid: "aBCSMFW",
    paint: {
      a(K, sx, sy) { const g = K.g; g.fillStyle = "#0c4a6e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#075985"; g.fillRect(sx + 1, sy + 1, 14, 14); },
      B(K, sx, sy) { const g = K.g; g.fillStyle = "#78350f"; g.fillRect(sx + 3, sy + 6, 10, 10); g.fillStyle = "#fef08a"; g.beginPath(); g.arc(sx + 8, sy + 5, 4, 0, 7); g.fill(); },
      C(K, sx, sy) { const g = K.g; g.fillStyle = "#9a3412"; g.fillRect(sx + 1, sy + 2, 14, 13); g.strokeStyle = "#431407"; g.strokeRect(sx + 1.5, sy + 2.5, 13, 12); },
      S(K, sx, sy) { const g = K.g; g.fillStyle = "#78350f"; g.fillRect(sx + 2, sy + 2, 3, 14); g.fillRect(sx + 11, sy + 2, 3, 14); g.fillStyle = "#b45309"; g.fillRect(sx, sy + 5, 16, 3); g.fillRect(sx, sy + 11, 16, 3); },
      M(K, sx, sy) { const g = K.g; g.fillStyle = "#334155"; g.fillRect(sx + 1, sy + 1, 14, 14); g.fillStyle = "#38bdf8"; g.fillRect(sx + 6, sy + 6, 4, 4); },
      F(K, sx, sy) { const g = K.g; g.fillStyle = "#0284c7"; g.fillRect(sx + 4, sy + 4, 8, 12); g.fillStyle = "#fef08a"; g.beginPath(); g.arc(sx + 8, sy + 3, 3, 0, 7); g.fill(); },
      W(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#0284c7"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(sx + 1 + Math.sin(fr / 8 + tx) * 2, sy + 6, 8, 2); }
    },
    act: { q: "Entra", B: "Esamina la bitta", C: "Ispeziona le merci", M: "Guarda la pala idraulica", F: "Controlla il faro fluviale" },
    travel: true,
    item: ["Bussola d'Argento", "Bussole d'Argento"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.fillStyle = "#0284c7";
      g.beginPath();
      g.arc(0, 0, 6, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#fef08a";
      g.lineWidth = 1.3;
      g.stroke();
      g.fillStyle = "#ef4444";
      g.beginPath();
      g.moveTo(0, -4);
      g.lineTo(2, 0);
      g.lineTo(-2, 0);
      g.closePath();
      g.fill();
      g.restore();
    },
    stadium: {
      azPitch: "lago",
      cageField: 2,
      cageMut: "wet",
      weather: "rain",
      venue: {
        ads: [
          ["CAROVANA DEL FIUME ARGENTEO", "#38bdf8"],
          ["DOGANA FLUVIALE · PORTO FRANCO", "#ef4444"],
          ["TIMONIERI DI ROCCABRUNA", "#f59e0b"],
          ["CHIUSE REALI DEL DELTA", "#10b981"]
        ],
        crowd: ["#38bdf8", "#0284c7", "#f59e0b", "#64748b", "#0f172a"],
        ground: ["#075985", "#0369a1"],
        wall: ["#0c4a6e", "#082f49"],
        line: "rgba(224,242,254,.7)",
        sky: ["#0c4a6e", "#082f49"],
        fx: { fr: 0.94, spd: 1.05, wind: 0.8 }
      }
    },
    guest: {
      id: "fa_roderico",
      lines: [
        "Ahoy, Campione! La salsedine di questo borgo mi ricorda i tramonti sul Fiume Argenteo!",
        "Il Nautilus di Latta ha gettato l'ancora qui vicino e la ciurma ti acclama ancora.",
        "Ricorda la nostra regola d'oro: controcorrente si gioca di sponda, a favore di corrente si mira all'incrocio!",
        "Che il vento fluviale gonfi sempre le tue vele!"
      ]
    },
    endings: {
      mercantile: ["La Grande Rotta Mercantile", "Hai stretto accordi con i mercanti delle Chiuse: il Fiume Argenteo fiorisce di scambi e il porto franco vive la sua epoca d'oro.", "Apri la via dei commerci."],
      franca: ["La Bandiera della Fratellanza", "Rifiuti ogni dazio ingiusto e proclami il fiume libero per ogni battelliere e pescatore. La Carovana diventa leggenda.", "Issa la bandiera franca."],
      sentinella: ["La Sentinella delle Chiuse", "Sigilli un patto d'onore con il Doganiere Malacarne per difendere i mulini e le chiuse dai corsari di palude.", "Custodisci le chiuse."],
      segreto: ["Il Mistero del Delta d'Oro", "Finale segreto: con tutte le chiuse allineate e l'equipaggio al completo, ritrovi l'antica coppa fluviale custodita nel vortice del delta.", "Rivela il segreto del Delta."]
    }
  });

  const K = E.K;

  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);

    K.cast("fa_roderico", {
      name: "Capitan Roderico",
      sub: "Timoniere del Nautilus",
      style: "wavy",
      hair: "#d1d5db",
      eye: "#0284c7",
      skin: "#fed7aa",
      shirt: "#0284c7",
      beard: "folta",
      acc: ["berretto"],
      bg: ["#0369a1", "#082f49"]
    });

    K.cast("fa_mirella", {
      name: "Mirella la Cartografa",
      sub: "Idrologa Fluviale",
      style: "sidebraid",
      hair: "#38bdf8",
      eye: "#0369a1",
      skin: "#fcd34d",
      shirt: "#0369a1",
      streak: "#0284c7",
      acc: ["occhiali", "taccuino"],
      bg: ["#0284c7", "#0c4a6e"]
    });

    K.cast("fa_vanni", {
      name: "Burlone Vanni",
      sub: "Pescatore di Sponda",
      style: "bandana",
      hair: "#78350f",
      eye: "#15803d",
      skin: "#fbcfe8",
      shirt: "#d97706",
      beard: "pizzetto",
      acc: ["fascia"],
      bg: ["#b45309", "#451a03"]
    });

    K.cast("fa_malacarne", {
      name: "Doganiere Malacarne",
      sub: "Capitano del Dazio",
      style: "pompadour",
      hair: "#1c1917",
      eye: "#dc2626",
      skin: "#fed7aa",
      shirt: "#dc2626",
      beard: "baffi",
      acc: ["medaglia"],
      bg: ["#991b1b", "#450a0a"]
    });

    K.cast("fa_silvia", {
      name: "Silvia dei Mulini",
      sub: "Ingegnera Idraulica",
      style: "ponytail",
      hair: "#f59e0b",
      eye: "#047857",
      skin: "#fed7aa",
      shirt: "#047857",
      acc: ["visiera", "grembiule"],
      bg: ["#065f46", "#022c22"]
    });
  }
  casts();

  window.__fiume = E.api;
})();
