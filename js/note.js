// js/note.js - «TACTICS NOTE · IL QUADERNO DEL GIUDIZIO» · configurazione della saga su js/saga-core.js
// Saga investigativa e psicologica ispirata a Death Note ambientata al Liceo Daikoku.
// Uno strano quaderno nero cade dal cielo del campo di calcio:
// «Il calciatore il cui nome viene scritto su queste pagine subirà un fallo tattico o verrà neutralizzato entro 40 secondi».
// Il Campione si trova al centro del duello intellettuale tra Raito Yagami ed Elle Lawliet.
// Novità di questa saga:
//  - TACTICS NOTE (js/quaderno.js): motore originale a lavagna di deduzione in tempo reale con contromosse a tempo.
//  - LA DEDUZIONE PSICOLOGICA (K.deduci): intuizioni logiche per anticipare le mosse degli avversari.
//  - LE MELE ROSSE DI RYU (item collezionabile): da offrire al demone ombra per ottenere favori tattici.
(function () {
  "use strict";
  if (window.__note || !window.__sagaCore) return;

  const DEDUZIONI = {
    quaderno: [
      "DEDUZIONE N° 1 · LE REGOLE DEL TACTICS NOTE",
      "REPERTO: Taccuino con copertina nera in pelle e caratteri gotici d'argento",
      "«LA REGOLA DEI 40 SECONDI»",
      "Se scrivi il nome di un mediano avversario pensando alla sua casella tattica, entro 40 secondi perderà il tempo di gioco. Ma ogni utilizzo consuma l'intuito del portatore."
    ],
    mela: [
      "DEDUZIONE N° 2 · IL PUNTO DEBOLE DELLO SHINIGAMI",
      "REPERTO: Torsolo di mela Fuji lasciato sul ramo del ciliegio",
      "«IL PREZZO DEL DEMONE»",
      "Ryu non parteggia per nessuno: cerca solo mele croccanti e divertimento. Finché gli offri mele rosse, rivelerà le spie della federazione sugli spalti."
    ],
    lavagna: [
      "DEDUZIONE N° 3 · LO SCHEMA GEOMETRICO DI RAITO",
      "REPERTO: Fogli di appunti con grafici a dispersione e traiettorie balistiche",
      "«L'UNDICI PERFETTO»",
      "Raito non sbaglia un posizionamento: calcola la probabilità di intercettazione al millimetro, costringendo i rivali al fallo sistematico."
    ],
    zolletta: [
      "DEDUZIONE N° 4 · L'ANALISI STATISTICA DI ELLE",
      "REPERTO: Piramide di zollette di zucchero con annotazioni al microscopio",
      "«LA PERCENTUALE DI COLPA»",
      "Elle ha già compreso che le espulsioni nel girone non sono casuali: la correlazione con le partite del Daikoku supera il 98,2%."
    ]
  };

  const E = window.__sagaCore.create({
    id: "note",
    key: "ali-di-rondine.note",
    title: "Tactics Note · Il Quaderno del Giudizio",
    icon: "📓",
    bg: "qd_titolo",
    chapters: 3,
    menuSub: "Liceo Daikoku: duello intellettuale tra Raito ed Elle sul destino del torneo studentesco",
    theme: {
      accent: "#ef4444",
      ink: "#0f172a",
      paper: "rgba(15,23,42,.96)",
      font: "'Courier New', Courier, monospace",
      chipBg: "#1e293b",
      chipBorder: "#475569"
    },
    stats: {
      intuito: [0, 100, 50, "Intuito Investigativo (🧠)"],
      giustizia: [-50, 50, 0, "Bivio Morale (-50 Ombra / +50 Luce)"],
      mele: [0, 99, 3, "Mele Rosse per Ryu (🍎)"]
    },
    regions: {
      daikoku: {
        grass: ["#0f231c", "#16382a"],
        path: ["#334155", "#475569"],
        wall: ["#1e293b", "#0f172a"],
        stone: ["#64748b", "#94a3b8"],
        tree: ["#0f3824", "#1b5938", "#2b7d52"],
        fx: "petals",
        dark: 0.08
      },
      interno: {
        wall: ["#334155", "#1e293b"],
        stone: ["#64748b", "#475569"],
        path: ["#cbd5e1", "#94a3b8"],
        tint: "220,230,255",
        tintA: 0.08,
        fx: "dust",
        dark: 0.05
      }
    },
    solid: "atryqwsxflbgjnpzuBHDTLWKT",
    paint: {
      A(sx, sy, tx, ty) {
        // Mela rossa a terra
        window.__sagaCore.ctx();
        const g = document.getElementById("cv").getContext("2d");
        g.fillStyle = "#ef4444";
        g.beginPath();
        g.arc(sx + 8, sy + 10, 4.5, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#22c55e";
        g.fillRect(sx + 8, sy + 4, 1.5, 3);
      },
      K(sx, sy, tx, ty) {
        // Cassetta di mele
        const g = document.getElementById("cv").getContext("2d");
        g.fillStyle = "#78350f";
        g.fillRect(sx + 2, sy + 4, 12, 10);
        g.fillStyle = "#ef4444";
        g.fillRect(sx + 4, sy + 2, 8, 4);
      },
      T(sx, sy, tx, ty) {
        // Tavolo tattico con monitor CRT
        const g = document.getElementById("cv").getContext("2d");
        g.fillStyle = "#334155";
        g.fillRect(sx + 1, sy + 6, 14, 8);
        g.fillStyle = "#0f172a";
        g.fillRect(sx + 4, sy + 1, 8, 6);
        g.fillStyle = "#38bdf8";
        g.fillRect(sx + 5, sy + 2, 6, 4);
      },
      B(sx, sy, tx, ty) {
        // Banco del liceo
        const g = document.getElementById("cv").getContext("2d");
        g.fillStyle = "#b45309";
        g.fillRect(sx + 2, sy + 5, 12, 8);
        g.fillStyle = "#78350f";
        g.fillRect(sx + 3, sy + 13, 2, 3);
        g.fillRect(sx + 11, sy + 13, 2, 3);
      },
      P(sx, sy, tx, ty) {
        // Lampione o riflettore
        const g = document.getElementById("cv").getContext("2d");
        g.fillStyle = "#475569";
        g.fillRect(sx + 7, sy + 2, 2, 14);
        g.fillStyle = "#fef08a";
        g.beginPath();
        g.arc(sx + 8, sy + 3, 3, 0, Math.PI * 2);
        g.fill();
      },
      L(sx, sy, tx, ty) {
        // Grande lavagna tattica
        const g = document.getElementById("cv").getContext("2d");
        g.fillStyle = "#064e3b";
        g.fillRect(sx + 1, sy + 2, 14, 12);
        g.strokeStyle = "#78350f";
        g.lineWidth = 1;
        g.strokeRect(sx + 1, sy + 2, 14, 12);
        g.fillStyle = "#ffffff";
        g.fillRect(sx + 4, sy + 6, 8, 1);
        g.fillRect(sx + 6, sy + 9, 4, 1);
      }
    },
    item: ["Mela Rossa", "Mele Rosse"],
    drawItem(g, x, y, i, f, K) {
      g.save();
      g.translate(x, y);
      const bob = Math.sin(f / 12 + i) * 2;
      g.fillStyle = "#ef4444";
      g.beginPath();
      g.arc(0, bob, 6, 0, Math.PI * 2);
      g.fill();
      // Picciolo e foglia verde
      g.fillStyle = "#78350f";
      g.fillRect(-0.5, bob - 8, 1.5, 3.5);
      g.fillStyle = "#22c55e";
      g.beginPath();
      g.ellipse(2, bob - 7, 2, 1, 0.4, 0, Math.PI * 2);
      g.fill();
      // Luce riflessa
      g.fillStyle = "rgba(255,255,255,.6)";
      g.beginPath();
      g.arc(-2, bob - 2, 1.5, 0, Math.PI * 2);
      g.fill();
      g.restore();
    },
    stadium: {
      azPitch: "asfalto",
      venue: { name: "Stadio Daikoku · Notte delle Deduzioni" },
      weather: "sereno",
      cageField: "notte"
    },
    journal: {
      name: "Taccuino delle Deduzioni",
      desc: "Trascrizione delle mosse avversarie, indizi raccolti da Elle e favori di Ryu."
    },
    rest: {
      name: "Dormitorio del Liceo Daikoku",
      ch: "s",
      ask: "Vuoi riposare nel dormitorio del Liceo?"
    },
    endings: {
      giustizia_pura: { t: "La Giustizia della Lavagna", d: "Hai collaborato con Elle, dimostrando che il calcio si vince con la tattica pura senza trucchi occulti." },
      nuovo_mondo: { t: "Il Dio del Nuovo Campionato", d: "Ti sei alleato con Raito, riscrivendo le regole del torneo e vincendo ogni contrasto con la precisione glaciale del Quaderno." },
      patto_demone: { t: "Il Patto con Ryu", d: "Hai barattato il destino del torneo con il demone Ryu in cambio di un cesto infinito di mele e un tiro infallibile." },
      calcio_puro: { t: "Senza Nomi né Quaderni (Segreto)", d: "Segreto: Hai bruciato il Tactics Note al centro del campo, costringendo Raito ed Elle a una sfida autentica 1 contro 1 a piedi nudi." }
    },
    guest: {
      id: "qd_ryu",
      lines: [
        "Eh eh eh... I mortali sono davvero divertenti quando corrono dietro a una palla di cuoio.",
        "Hai altre mele succose a Borgo Marino? Quelle liguri sono dolcissime!"
      ]
    }
  });

  const { api, K } = E;

  // Meccanica personalizzata: Deduzione logica con verbale investigativo
  K.deduci = function (idDeduzione, premi, poi) {
    const d = DEDUZIONI[idDeduzione];
    if (!d) { if (poi) poi(); return; }

    if (premi) {
      if (premi.intuito) K.bond("intuito", premi.intuito);
      if (premi.giustizia) K.bond("giustizia", premi.giustizia);
      if (premi.mele) K.bond("mele", premi.mele);
    }

    K.say([
      ["voce", `<b>${d[0]}</b><br><small style="color:#ef4444;">${d[1]}</small>`],
      ["voce", `<em>${d[2]}</em><br>${d[3]}`]
    ], () => {
      if (window.toast) window.toast(`Deduzione acquisita: ${d[0].split("·")[1] || ""}`, "info", "🧠");
      if (poi) poi();
    });
  };

  // Sfondi personalizzati
  window.__qdDraw = {
    Titolo(g, W, H, f) {
      g.fillStyle = "#050508";
      g.fillRect(0, 0, W, H);
      // Luna piena rossa
      g.fillStyle = "#ef4444";
      g.beginPath();
      g.arc(W * 0.75, 45, 26, 0, Math.PI * 2);
      g.fill();
      // Riflettori dello stadio
      g.fillStyle = "rgba(239, 68, 68, 0.15)";
      g.beginPath();
      g.moveTo(40, 20); g.lineTo(0, H); g.lineTo(120, H); g.closePath();
      g.fill();
      g.beginPath();
      g.moveTo(W - 40, 20); g.lineTo(W, H); g.lineTo(W - 120, H); g.closePath();
      g.fill();
      // Silhouette ali di Ryu
      g.fillStyle = "#020617";
      g.beginPath();
      g.moveTo(W * 0.5 - 40, 90);
      g.quadraticCurveTo(W * 0.5 - 90, 50, W * 0.5 - 100, 110);
      g.quadraticCurveTo(W * 0.5 - 50, 110, W * 0.5, 120);
      g.quadraticCurveTo(W * 0.5 + 50, 110, W * 0.5 + 100, 110);
      g.quadraticCurveTo(W * 0.5 + 90, 50, W * 0.5 + 40, 90);
      g.closePath();
      g.fill();
      // Mela rossa brillante tra gli artigli
      g.fillStyle = "#ef4444";
      g.beginPath();
      g.arc(W * 0.5, 130, 8, 0, Math.PI * 2);
      g.fill();
    },
    Cortile(g, W, H, f) {
      g.fillStyle = "#090d16";
      g.fillRect(0, 0, W, H);
      // Facciata del liceo
      g.fillStyle = "#1e293b";
      g.fillRect(30, 30, W - 60, 90);
      // Orologio della torre
      g.fillStyle = "#f8fafc";
      g.beginPath();
      g.arc(W * 0.5, 45, 12, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#0f172a";
      g.fillRect(W * 0.5 - 1, 38, 2, 7);
      g.fillRect(W * 0.5 - 1, 44, 5, 2);
      // Finestre dell'istituto
      for (let y = 65; y < 110; y += 18) {
        for (let x = 45; x < W - 50; x += 28) {
          g.fillStyle = "#38bdf8";
          g.fillRect(x, y, 14, 10);
        }
      }
      // Viale e ciliegi notturni
      g.fillStyle = "#0f231c";
      g.fillRect(0, 120, W, H - 120);
      // Petali fluttuanti
      for (let i = 0; i < 16; i++) {
        const px = (i * 27 + f * 1.5) % W;
        const py = 120 + ((i * 19 + f * 0.8) % (H - 120));
        g.fillStyle = "rgba(244,114,182,.7)";
        g.fillRect(px, py, 2, 2);
      }
    },
    Aula(g, W, H, f) {
      g.fillStyle = "#0f172a";
      g.fillRect(0, 0, W, H);
      // Grande lavagna tattica verde scuro
      g.fillStyle = "#064e3b";
      g.fillRect(30, 20, W - 60, 80);
      g.strokeStyle = "#b45309";
      g.lineWidth = 3;
      g.strokeRect(30, 20, W - 60, 80);
      // Formule e schemi a gesso
      g.fillStyle = "#ffffff";
      g.font = "bold 10px monospace";
      g.fillText("SCHEMI TATTICI · KIRA VS L", 45, 40);
      g.fillText("1. ANTICIPO -> PREVALENZA 82%", 45, 58);
      g.fillText("2. TRAPPOLA -> FUORIGIOCO 94%", 45, 74);
      // Piramide di zollette di zucchero
      g.fillStyle = "#f8fafc";
      g.fillRect(W * 0.75, 120, 24, 16);
      g.fillRect(W * 0.75 + 4, 108, 16, 12);
      g.fillRect(W * 0.75 + 8, 98, 8, 10);
    },
    Stadio(g, W, H, f) {
      g.fillStyle = "#020617";
      g.fillRect(0, 0, W, H);
      // Riflettori potenti
      g.fillStyle = "#ffffff";
      g.fillRect(20, 20, 15, 8);
      g.fillRect(W - 35, 20, 15, 8);
      g.fillStyle = "rgba(255,255,255,.15)";
      g.beginPath();
      g.moveTo(27, 28); g.lineTo(0, H); g.lineTo(120, H); g.closePath();
      g.fill();
      g.beginPath();
      g.moveTo(W - 27, 28); g.lineTo(W, H); g.lineTo(W - 120, H); g.closePath();
      g.fill();
      // Tabellone luminoso
      g.fillStyle = "#0f172a";
      g.fillRect(W * 0.5 - 50, 25, 100, 30);
      g.fillStyle = "#ef4444";
      g.font = "bold 11px monospace";
      g.fillText("FINALE: 0 - 0", W * 0.5 - 42, 44);
      // Campo verde
      g.fillStyle = "#14532d";
      g.fillRect(0, 110, W, H - 110);
    }
  };

  api._dbg = api._dbg || { mem: E.mem, ZONES: E.api.ZONES || {}, CHAPTERS: E.CHAPTERS || {}, K };
  window.__note = api;
})();
