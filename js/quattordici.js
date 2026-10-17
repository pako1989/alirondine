// js/quattordici.js - «IL TORNEO DEI QUATTORDICI» · Configurazione saga su js/saga-core.js
// Un albergo di lusso su una collina, quattordici squadre, tre giorni. Si gioca a Zona Rossa (motore js/zonarossa.js):
// un 2 contro 2 dove il campo si restringe. Chi perde "lascia il Torneo" e nessuno dice dove va.
// Novità di core: il CALENDARIO A FASCE ORARIE (cfg.clock). Ogni giorno ha Mattina, Pomeriggio (la partita), Sera e Notte:
// la mattina e la sera si spendono scegliendo UNA attività con un personaggio, la notte accade qualcosa.
// Storia seria con ironia nera. Niente sangue, nessun minore. Un'unica morte, fuori scena.
(function () {
  "use strict";
  if (window.__quattordici || !window.__sagaCore) return;

  const HD = window.__hd, FX = HD.F;
  // pareti e pavimenti per ambiente (js/hd.js)
  const WALLS = {
    albergo: { cap: ["#1c0b10", "#3a1a22"], paper: "#5e1f2c", damask: "#7a3040", wain: "#3a1a22", trim: "#c9a24a", sky: "#101a3a", night: true, curtain: "#8a1c34", art: ["#3a5a7a", "#7a5a3a", "#4a6a4a", "#8a3a3a"] },
    stadio: { cap: ["#0b1220", "#1f2a3d"], paper: "#1e293b", damask: "#273449", wain: "#111827", trim: "#64748b", sky: "#0b1226", night: true, curtain: "#374151", art: ["#7f1d1d", "#1e3a5f", "#3f3f46"] },
    giardino: { cap: ["#12281a", "#245a36"], paper: "#2f5a3c", damask: "#3a6e48", wain: "#1d3b27", trim: "#9bbf7a", sky: "#2a5a8a", night: false, curtain: "#2a6a3a", art: ["#5a8a4a", "#8a6a3a"] },
    archivio: { cap: ["#150f0a", "#3a2a1c"], paper: "#4a3524", damask: "#5a432e", wain: "#2c1d12", trim: "#a97c3a", sky: "#1a1226", night: true, curtain: "#5a1f1f", art: ["#6a4a2a", "#3a4a5a", "#5a3a3a"] },
    alanord: { cap: ["#0b1220", "#2a3646"], paper: "#2e3846", damask: "#374253", wain: "#1d2531", trim: "#7a8696", sky: "#0b1226", night: true, curtain: "#3a4252", art: ["#52525b", "#7f1d1d"] },
    sipario: { cap: ["#12050b", "#4a0f22"], paper: "#6a1730", damask: "#82203d", wain: "#3a0b1c", trim: "#e0b84a", sky: "#1a0a2a", night: true, curtain: "#9a1f3f", art: ["#f1e4c3", "#2a2a3a"] }
  };
  const FLOORS = {
    albergo: { p: ["#e4dccb", "#cfc5b0", "#c9a24a"], ".": (g, sx, sy, tx, ty, fr, K, p) => FX.marble(g, sx, sy, tx, ty, fr, K, p), ":": (g, sx, sy, tx, ty, fr, K, p, u, d) => FX.carpet(g, sx, sy, tx, ty, fr, K, ["#8a1c34", "#d4af37"], u, d), "+": (g, sx, sy, tx, ty, fr, K) => FX.planks(g, sx, sy, tx, ty, fr, K, ["#6a4a2c", "#5e4126"]), ",": (g, sx, sy, tx, ty, fr, K) => FX.marble(g, sx, sy, tx, ty, fr, K, ["#e4dccb", "#cfc5b0"]) },
    stadio: { p: ["#1f6b3a", "#2a7d46", "#fff"], ".": (g, sx, sy, tx, ty, fr, K, p) => FX.mown(g, sx, sy, tx, ty, fr, K, ["#1f6b3a", "#277a43"]), ":": (g, sx, sy, tx, ty, fr, K) => FX.gravel(g, sx, sy, tx, ty, fr, K, ["#c9b98a", "#bda97a"]), "+": (g, sx, sy, tx, ty, fr, K) => FX.concrete(g, sx, sy, tx, ty, fr, K, ["#6b7280", "#5f6672"]), ",": (g, sx, sy, tx, ty, fr, K) => FX.mown(g, sx, sy, tx, ty, fr, K, ["#1f6b3a", "#277a43"]) },
    giardino: { p: [], ".": (g, sx, sy, tx, ty, fr, K) => FX.grass(g, sx, sy, tx, ty, fr, K, ["#2f7d46", "#36884d", "#ffe9a0"]), ":": (g, sx, sy, tx, ty, fr, K) => FX.gravel(g, sx, sy, tx, ty, fr, K, ["#d2c49a", "#c4b588"]), "+": (g, sx, sy, tx, ty, fr, K) => FX.stone(g, sx, sy, tx, ty, fr, K, ["#9a9a98", "#8a8a88"]), ",": (g, sx, sy, tx, ty, fr, K) => FX.grass(g, sx, sy, tx, ty, fr, K, ["#2f7d46", "#36884d", "#ffe9a0"]) },
    archivio: { p: [], ".": (g, sx, sy, tx, ty, fr, K) => FX.planks(g, sx, sy, tx, ty, fr, K, ["#5a3f28", "#4e3622"]), ":": (g, sx, sy, tx, ty, fr, K, p, u, d) => FX.carpet(g, sx, sy, tx, ty, fr, K, ["#3a5a3a", "#b8923a"], u, d), "+": (g, sx, sy, tx, ty, fr, K) => FX.stone(g, sx, sy, tx, ty, fr, K, ["#6b5a47", "#5b4c3b"]), ",": (g, sx, sy, tx, ty, fr, K) => FX.planks(g, sx, sy, tx, ty, fr, K, ["#5a3f28", "#4e3622"]) },
    alanord: { p: [], ".": (g, sx, sy, tx, ty, fr, K) => FX.concrete(g, sx, sy, tx, ty, fr, K, ["#3f4a58", "#38424f"]), ":": (g, sx, sy, tx, ty, fr, K) => FX.grate(g, sx, sy, tx, ty, fr, K, ["#2a323d", "#58626f"]), "+": (g, sx, sy, tx, ty, fr, K) => FX.concrete(g, sx, sy, tx, ty, fr, K, ["#4b5563", "#3f4854"]), ",": (g, sx, sy, tx, ty, fr, K) => FX.concrete(g, sx, sy, tx, ty, fr, K, ["#3f4a58", "#38424f"]) },
    sipario: { p: [], ".": (g, sx, sy, tx, ty, fr, K) => FX.planks(g, sx, sy, tx, ty, fr, K, ["#6a1730", "#5a1228"]), ":": (g, sx, sy, tx, ty, fr, K, p, u, d) => FX.carpet(g, sx, sy, tx, ty, fr, K, ["#9a1f3f", "#e0b84a"], u, d), "+": (g, sx, sy, tx, ty, fr, K) => FX.marble(g, sx, sy, tx, ty, fr, K, ["#e4dccb", "#cfc5b0"]), ",": (g, sx, sy, tx, ty, fr, K) => FX.planks(g, sx, sy, tx, ty, fr, K, ["#6a1730", "#5a1228"]) }
  };


  // decorazioni sopra la mappa: lampadari, righe del campo, riflettori, plachette (spec.decor)
  const PL = (g, t, x, y, c) => HD.D.plaque(g, t, x, y, c);
  const rays = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const chand = (g, x, y, fr, i) => { g.fillStyle = "#6b5a2a"; g.fillRect(x - 0.5, y - 40, 1, 36); g.fillStyle = "#d4af37"; g.fillRect(x - 7, y - 4, 14, 2); for (let k = -2; k <= 2; k++) { g.fillStyle = "#fff3c0"; g.fillRect(x + k * 3 - 1, y - 8, 2, 4 + Math.sin(fr / 6 + k + i) * 0.5); } rays(g, x, y - 4, 46, "255,214,130", 0.34 + Math.sin(fr / 40 + i) * 0.04); };
  window.__qtDec = (z) => {
    const D = {
      qt_atrio(g, cx, cy, d) { chand(g, d.X(9) + 8, d.Y(5), d.fr, 0); chand(g, d.X(18) + 8, d.Y(5), d.fr, 1); chand(g, d.X(13) + 8, d.Y(11), d.fr, 2); PL(g, "RECEPTION", d.X(13) + 8, d.Y(3) - 2); PL(g, "AL CAMPO →", d.X(25) + 4, d.Y(6) - 2, "#dc2626"); PL(g, "ATRIO DEL MERIDIANA", d.X(14), d.Y(1) + 4, "#d4af37"); },
      qt_stadio(g, cx, cy, d) { const x0 = d.X(2), y0 = d.Y(3), x1 = d.X(26), y1 = d.Y(13); g.save(); g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.5; g.strokeRect(x0, y0, x1 - x0, y1 - y0); g.beginPath(); g.moveTo((x0 + x1) / 2, y0); g.lineTo((x0 + x1) / 2, y1); g.stroke(); g.beginPath(); g.arc((x0 + x1) / 2, (y0 + y1) / 2, 22, 0, 7); g.stroke(); g.strokeRect(x0, (y0 + y1) / 2 - 22, 26, 44); g.strokeRect(x1 - 26, (y0 + y1) / 2 - 22, 26, 44); const b = 4 + (Math.sin(d.fr / 40) + 1) * 3; g.fillStyle = "rgba(220,38,38,.28)"; g.fillRect(x0, y0, x1 - x0, b); g.fillRect(x0, y1 - b, x1 - x0, b); g.restore(); rays(g, d.X(3), d.Y(2), 70, "255,244,214", 0.3); rays(g, d.X(25), d.Y(2), 70, "255,244,214", 0.3); PL(g, "TABELLONE", d.X(13) + 8, d.Y(1) - 2, "#dc2626"); PL(g, "← ATRIO", d.X(1) + 6, d.Y(6) - 2); PL(g, "ALA NORD", d.X(13) + 12, d.Y(14) + 12, "#9ca3af"); },
      qt_giardino(g, cx, cy, d) { rays(g, d.X(15) + 12, d.Y(12), 50, "160,220,255", 0.18); PL(g, "GIARDINO", d.X(14), d.Y(1) + 4, "#86efac"); PL(g, "← ATRIO", d.X(1) + 6, d.Y(6) - 2); PL(g, "ARCHIVIO →", d.X(25) + 2, d.Y(6) - 2, "#facc15"); },
      qt_archivio(g, cx, cy, d) { HD.D.beam(g, d.X(14) + 8, d.Y(1), 16, 120, "255,226,150", 0.2); rays(g, d.X(2) + 8, d.Y(4), 40, "255,214,130", 0.25); rays(g, d.X(25) + 8, d.Y(4), 40, "255,214,130", 0.25); PL(g, "ARCHIVIO", d.X(14), d.Y(1) + 4, "#facc15"); PL(g, "← GIARDINO", d.X(1) + 10, d.Y(6) - 2); },
      qt_alanord(g, cx, cy, d) { const on = Math.floor(d.fr / 40) % 2; rays(g, d.X(2) + 8, d.Y(6), 50, "220,38,38", on ? 0.32 : 0.12); rays(g, d.X(25) + 8, d.Y(6), 50, "220,38,38", on ? 0.12 : 0.32); g.fillStyle = "rgba(250,204,21,.5)"; for (let i = 0; i < 26; i++) { g.fillRect(d.X(1) + i * 16, d.Y(8) + 14, 8, 2); } PL(g, "ALA NORD · ACCESSO VIETATO", d.X(14), d.Y(1) + 4, "#dc2626"); PL(g, "← GIARDINO", d.X(1) + 10, d.Y(6) - 2); },
      qt_sipario(g, cx, cy, d) { HD.D.beam(g, d.X(14) + 8, d.Y(1), 26, 150, "255,236,190", 0.32); rays(g, d.X(14) + 8, d.Y(8), 60, "255,226,150", 0.22); PL(g, "IL SIPARIO", d.X(14), d.Y(1) + 4, "#e0b84a"); }
    };
    return D[z];
  };

  const E = window.__sagaCore.create({
    id: "quattordici",
    key: "ali-di-rondine.quattordici",
    title: "Il Torneo dei Quattordici",
    icon: "🎭",
    bg: "qt_titolo",
    chapters: 3,
    menuSub: "Tre giorni in un albergo di lusso, quattordici squadre e un Premio: ogni giorno scegli come spendere mattina e sera, il pomeriggio si gioca a Zona Rossa e la notte qualcuno sparisce.",
    theme: {
      accent: "#dc2626",
      ink: "#1a0a0e",
      paper: "rgba(254,242,242,.96)",
      font: "'Georgia', 'Trebuchet MS', system-ui",
      chipBg: "#fecaca",
      chipBorder: "#991b1b"
    },
    stats: {
      squadre: [0, 14, 14, "Squadre in gara"],
      alleanze: [0, 99, 5, "Alleanze"],
      verita: [0, 99, 0, "Verità scoperte"],
      forma: [0, 3, 0, "Forma"]
    },
    bonds: {
      per: 8, max: 5,
      names: ["Estranei", "Conoscenti", "Alleati", "Fidati", "Complici", "Inseparabili"],
      scenes: {
        qt_ilse: [
          { lv: 1, id: "ilse1", lines: [["qt_ilse", "Una cosa che non ti ho detto: mio padre era portiere. Aveva il guanto sinistro con il pollice rotto. Lo porto sempre in tasca."], ["qt_ilse", "Non sono scaramantica. Solo... abituata a non parare da sola."]], reward: (K) => K.bond("alleanze", 3) },
          { lv: 3, id: "ilse3", lines: [["qt_ilse", "Se usciamo di qui, apro una scuola portieri. Quindici ragazzi per classe, niente fasce rosse, merenda obbligatoria."], ["qt_ilse", "Tu vieni a insegnare a tirare. Male, ma con convinzione."]], reward: (K) => K.bond("alleanze", 5) }
        ],
        qt_teo: [
          { lv: 1, id: "teo1", lines: [["qt_teo", "Una cosa seria, per una volta. Da piccolo ho cambiato squadra tre volte perché mi sentivo di troppo. A Rimini con te per la prima volta no."], ["qt_teo", "Quindi grazie. Non ti sto chiedendo di perdere, eh. Solo di ricordarmi."]], reward: (K) => K.bond("alleanze", 3) }
        ],
        qt_luce: [
          { lv: 1, id: "luce1", lines: [["qt_luce", "Una cosa personale, signor Campione. Ho tre nipoti che non sanno cosa faccio. Ho detto loro che catalogo musei."], ["qt_luce", "Se mai li vede, gli dica che i musei erano veri. Almeno quello."]], reward: (K) => K.bond("verita", 4) }
        ],
        qt_corvo: [
          { lv: 1, id: "corvo1", lines: [["qt_corvo", "Tengo una foto di mio fratello nella fascia. La guardo prima di ogni partita. Non per portafortuna: per ricordarmi cosa sto cercando."], ["qt_corvo", "Ora la conosci anche tu. Fai come se non l'avessi vista."]], reward: (K) => K.bond("alleanze", 4) }
        ]
      }
    },
    inv: {
      items: {
        qt_biscotti: { n: "Biscotti del Meridiana", icon: "🍪", d: "Troppo buoni per essere sicuri. Teo ne andrebbe matto.", gift: { qt_teo: 8, qt_ilse: 0 }, refuse: { qt_ilse: "Biscotti offerti da questo albergo? No, grazie. Mangiali tu, io ti guardo." }, react: { qt_teo: "Biscotti! Mi stai viziando. Adesso devo proprio farti perdere... piano." } },
        qt_fascia: { n: "Fascia di riserva", icon: "🎽", d: "Una fascia da capitano lasciata a bordo campo.", match: { te: 1 }, gift: { qt_corvo: 6 }, giftAny: 3 },
        qt_guanti: { n: "Guanti da portiere", icon: "🧤", d: "Vecchi, rattoppati, della taglia di Ilse.", match: { df: 1 }, gift: { qt_ilse: 9 }, react: { qt_ilse: "(Li gira tra le mani.) Sono i miei vecchi. Come hai fatto a trovarli? ...Non importa. Grazie." } },
        qt_braccialetto: { n: "Braccialetto di Teo", icon: "🔗", d: "Il braccialetto da capitano di Teo, dall'armadietto.", gift: { qt_corvo: 8, qt_ilse: 5 }, react: { qt_corvo: "Anche lui aveva un fratello da cercare. Lo terrò io finché non lo ritrovo." } },
        qt_lente: { n: "Lente d'ingrandimento", icon: "🔍", d: "La lente di Luce, dimenticata sulla scrivania.", match: { at: 1 }, gift: { qt_luce: 8 }, react: { qt_luce: "La mia lente! Pensavo di averla persa insieme a tante altre cose. Grazie, signor Campione." } },
        qt_chiave: { n: "Chiave di Luce", icon: "🗝️", d: "Apre il registro dietro il quadro dell'Ala Nord.", giftAny: 0 }
      }
    },
    clock: {
      slots: ["Mattina", "Pomeriggio", "Sera", "Notte"],
      hud: true,
      tint: [null, null, "rgba(251,146,60,.12)", "rgba(15,23,60,.34)"],
      onSlot(K, giorno, fascia, nome) {
        if (nome === "Sera") return [["voce", "Il sole scende dietro la collina. Nell'albergo si accendono i lampadari, uno alla volta, come un conteggio."]];
        if (nome === "Notte") return [["voce", "Cala la notte sul Meridiana. I corridoi si svuotano. Qualcuno, da qualche parte, sposta dei carrelli."]];
        return null;
      }
    },
    regions: {
      albergo: {
        grass: ["#7a2e3a", "#702a35", "#843644"], path: ["#c8a96b", "#bb9d60"], stone: ["#d8d2c4", "#cdc6b6"],
        wall: ["#2a1218", "#1f0d12"], water: ["#2a4a52", "#223c43"], tree: "#14532d", tint: "251,191,36", tintA: 0.05
      },
      stadio: {
        grass: ["#1f6b3a", "#1b6034", "#257443"], path: ["#c9b98a", "#bda97a"], stone: ["#5b6470", "#4f5863"],
        wall: ["#111827", "#0b1220"], water: ["#1e4a6a", "#173b57"], tree: "#14532d", tint: "56,189,248", tintA: 0.06
      },
      giardino: {
        grass: ["#2f7d46", "#2a7440", "#36884d"], path: ["#c9b98a", "#bda97a"], stone: ["#8a8a8a", "#7a7a7a"],
        wall: ["#1c3b26", "#142b1c"], water: ["#3b82a0", "#2f6f86"], tree: "#166534", tint: "253,186,116", tintA: 0.08
      },
      archivio: {
        grass: ["#4a3524", "#42301f", "#523b28"], path: ["#7c5a3a", "#6f5034"], stone: ["#6b5a47", "#5b4c3b"],
        wall: ["#1f1610", "#150f0a"], water: ["#2a4a52", "#223c43"], tree: "#3a2c1e", tint: "250,204,21", tintA: 0.08
      },
      alanord: {
        grass: ["#3f4a58", "#38424f", "#465263"], path: ["#6b7280", "#5f6672"], stone: ["#4b5563", "#3f4854"],
        wall: ["#111827", "#0b1220"], water: ["#1e3a5f", "#172f4d"], tree: "#334155", tint: "148,163,184", tintA: 0.1, dark: true
      },
      sipario: {
        grass: ["#5b1226", "#500f20", "#661530"], path: ["#d4af37", "#c19b2e"], stone: ["#7f1d3a", "#6a1630"],
        wall: ["#1a0710", "#12050b"], water: ["#4c1d3d", "#3b1530"], tree: "#3b0a1c", tint: "239,68,68", tintA: 0.08
      }
    },
    floors: ".",
    floorPaint(K, f, sx, sy, tx, ty) {
      const rk = K.ZX.rk, T = FLOORS[rk] || FLOORS.albergo, fn = T[f] || T["."], g = K.g, hd = window.__hd, un = K.ZX.under || [];
      const up = (un[ty - 1] || [])[tx] !== ":", dn = (un[ty + 1] || [])[tx] !== ":";
      fn(g, sx, sy, tx, ty, Math.floor(performance.now() / 16), K, T.p, up, dn);
      return true;
    },
    mood(g, fr, K) {
      const rk = K.ZX.rk, hd = window.__hd;
      hd.D.vignette(g, rk === "alanord" ? 0.5 : 0.38);
      hd.D.motes(g, fr, rk === "archivio" ? 22 : 12, rk === "alanord" ? "180,200,230" : "255,230,170", 0.45);
    },
    solid: "aMKUPBNEXSVOZFCRQ",
    paint: {
      a(K, sx, sy, tx, ty) { // parete: damasco + boiserie, finestre, quadri e applique (per ambiente)
        const rk = K.ZX.rk, o = WALLS[rk] || WALLS.albergo;
        window.__hd.W.hotel(K, sx, sy, tx, ty, o);
      },
      M(K, sx, sy) { // colonna di marmo
        const g = K.g;
        g.fillStyle = "#e7e5e4"; g.fillRect(sx + 4, sy + 2, 8, 13);
        g.fillStyle = "#a8a29e"; g.fillRect(sx + 10, sy + 2, 2, 13);
        g.fillStyle = "#d6d3d1"; g.fillRect(sx + 2, sy + 1, 12, 3); g.fillRect(sx + 2, sy + 13, 12, 2);
      },
      K(K, sx, sy) { // bancone
        const g = K.g;
        g.fillStyle = "#5a3a22"; g.fillRect(sx, sy + 4, 16, 11);
        g.fillStyle = "#7c5230"; g.fillRect(sx, sy + 3, 16, 3);
        g.fillStyle = "#facc15"; g.beginPath(); g.arc(sx + 8, sy + 2, 2, 0, 7); g.fill();
      },
      U(K, sx, sy) { // tavolino con tovaglia
        const g = K.g;
        g.fillStyle = "#f5f5f4"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 7, 5, 0, 0, 7); g.fill();
        g.fillStyle = "#991b1b"; g.fillRect(sx + 6, sy + 6, 4, 3);
        g.fillStyle = "#57534e"; g.fillRect(sx + 7, sy + 12, 2, 3);
      },
      P(K, sx, sy) { // pianta in vaso
        const g = K.g;
        g.fillStyle = "#78350f"; g.fillRect(sx + 4, sy + 9, 8, 6);
        g.fillStyle = "#15803d"; g.beginPath(); g.arc(sx + 8, sy + 6, 5, 0, 7); g.fill();
        g.fillStyle = "#22c55e"; g.beginPath(); g.arc(sx + 6, sy + 5, 2.5, 0, 7); g.fill();
      },
      B(K, sx, sy) { // scaffale di registri
        const g = K.g;
        g.fillStyle = "#3a2518"; g.fillRect(sx + 1, sy + 1, 14, 14);
        ["#991b1b", "#1d4ed8", "#a16207", "#166534"].forEach((c, i) => { g.fillStyle = c; g.fillRect(sx + 2 + i * 3, sy + 2, 2, 5); g.fillRect(sx + 3 + i * 3, sy + 9, 2, 5); });
      },
      N(K, sx, sy, tx) { // lampada del tabellone: accesa = squadra ancora in gara
        const g = K.g, on = (tx - 7) < K.stat("squadre");
        g.fillStyle = "#111827"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = on ? "#fde047" : "#3f3f46"; g.beginPath(); g.arc(sx + 8, sy + 8, 5, 0, 7); g.fill();
        if (on) { g.fillStyle = "rgba(253,224,71,.3)"; g.beginPath(); g.arc(sx + 8, sy + 8, 7.5, 0, 7); g.fill(); }
      },
      S(K, sx, sy, tx, ty) { // divano di velluto
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 1, sy + 13, 14, 2);
        g.fillStyle = "#6a1226"; g.fillRect(sx, sy + 3, 16, 10); g.fillStyle = "#8a1c34"; g.fillRect(sx + 1, sy + 7, 14, 6); g.fillStyle = "#a82a48"; g.fillRect(sx + 1, sy + 7, 14, 1);
        g.fillStyle = "#4a0c1a"; g.fillRect(sx, sy + 3, 2, 10); g.fillRect(sx + 14, sy + 3, 2, 10); g.fillStyle = "#d4af37"; g.fillRect(sx + 7, sy + 8, 2, 1);
      },
      V(K, sx, sy, tx, ty) { // vaso con fiori
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 3, sy + 13, 10, 2, "rgba(0,0,0,.25)");
        g.fillStyle = "#f1f5f9"; g.fillRect(sx + 5, sy + 8, 6, 6); g.fillStyle = "#38bdf8"; g.fillRect(sx + 5, sy + 10, 6, 1); g.fillStyle = "#cbd5e1"; g.fillRect(sx + 4, sy + 7, 8, 2);
        const c = ["#fb7185", "#fde047", "#f472b6", "#fafafa", "#fb923c"]; for (let i = 0; i < 5; i++) { HD.C(g, sx + 3 + i * 2.4, sy + 4 + (i % 2) * 2, 2, c[(tx + i) % 5]); }
        g.fillStyle = "#166534"; g.fillRect(sx + 7, sy + 6, 2, 2);
      },
      O(K, sx, sy, tx, ty) { // statua su basamento
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 2, sy + 13, 12, 2, "rgba(0,0,0,.28)");
        g.fillStyle = "#a8a29e"; g.fillRect(sx + 3, sy + 10, 10, 5); g.fillStyle = "#d6d3d1"; g.fillRect(sx + 3, sy + 10, 10, 1);
        g.fillStyle = "#e7e5e4"; g.fillRect(sx + 6, sy + 4, 4, 7); HD.C(g, sx + 8, sy + 3, 2.4, "#e7e5e4"); g.fillStyle = "#c7c3be"; g.fillRect(sx + 9, sy + 5, 1, 6);
        K.later((gg, cx, cy) => { gg.fillStyle = "#f5f5f4"; gg.fillRect(tx * 16 - cx + 4, ty * 16 - cy - 3, 8, 1); });
      },
      Z(K, sx, sy, tx, ty) { // gradinata con tifosi
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#374151"; g.fillRect(sx, sy, 16, 16);
        for (let r = 0; r < 3; r++) { g.fillStyle = r % 2 ? "#4b5563" : "#6b7280"; g.fillRect(sx, sy + 1 + r * 5, 16, 4); for (let c = 0; c < 4; c++) { const cols = ["#dc2626", "#fde047", "#f8fafc", "#2563eb", "#f97316"]; HD.C(g, sx + 2 + c * 4, sy + 2 + r * 5, 1.4, cols[(tx * 3 + c + r) % 5]); g.fillStyle = cols[(tx + c * 2 + r) % 5]; g.fillRect(sx + 1 + c * 4, sy + 3 + r * 5, 3, 1.5); } }
        g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 15, 16, 1);
      },
      F(K, sx, sy, tx, ty, fr) { // lampada a stelo con luce
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 4, sy + 14, 8, 1.5, "rgba(0,0,0,.3)");
        g.fillStyle = "#3a3a3a"; g.fillRect(sx + 7, sy + 5, 2, 10); g.fillStyle = "#fcd34d"; g.fillRect(sx + 4, sy + 1, 8, 5); g.fillStyle = "#fff7d1"; g.fillRect(sx + 5, sy + 2, 6, 3);
        K.light(sx + 8, sy + 4, 34, "255,214,130", 0.55 + Math.sin(fr / 30 + tx) * 0.04);
      },
      C(K, sx, sy, tx, ty) { // casse
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 1, sy + 13, 14, 2, "rgba(0,0,0,.3)");
        g.fillStyle = "#5b6472"; g.fillRect(sx + 1, sy + 4, 14, 10); g.fillStyle = "#7b8594"; g.fillRect(sx + 1, sy + 4, 14, 2); g.fillStyle = "#3f4752"; g.fillRect(sx + 1, sy + 9, 14, 1); g.fillRect(sx + 7, sy + 4, 2, 10);
        g.fillStyle = "#dc2626"; g.fillRect(sx + 3, sy + 7, 3, 1);
      },
      R(K, sx, sy, tx, ty, fr) { // tubi e valvole
        const g = K.g; g.fillStyle = "#1d2531"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#64748b"; g.fillRect(sx, sy + 3, 16, 4); g.fillStyle = "#94a3b8"; g.fillRect(sx, sy + 3, 16, 1); g.fillStyle = "#475569"; g.fillRect(sx, sy + 10, 16, 3);
        g.fillStyle = "#dc2626"; HD.C(g, sx + 8, sy + 5, 2, "#dc2626"); if (Math.floor(fr / 40 + tx) % 3 === 0) { g.fillStyle = "rgba(226,232,240,.5)"; g.fillRect(sx + 7, sy + 8 - (fr / 4 % 6), 2, 2); }
      },
      Q(K, sx, sy, tx, ty, fr) { // sipario di velluto
        const g = K.g, sw = Math.sin(fr / 50 + tx) * 0.8; g.fillStyle = "#12050b"; g.fillRect(sx, sy, 16, 16);
        for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#9a1f3f" : "#7a1530"; g.fillRect(sx + i * 4 + sw, sy, 4, 16); g.fillStyle = "rgba(255,255,255,.1)"; g.fillRect(sx + i * 4 + sw, sy, 1, 16); }
        g.fillStyle = "#e0b84a"; g.fillRect(sx, sy, 16, 2);
      },
      E(K, sx, sy) { // cancello sigillato
        const g = K.g;
        g.fillStyle = "#374151"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#9ca3af"; for (let i = 0; i < 4; i++) g.fillRect(sx + 1 + i * 4, sy + 1, 2, 14);
        g.fillStyle = "#dc2626"; g.fillRect(sx, sy + 6, 16, 3);
      },
      X(K, sx, sy) { // armadietto
        const g = K.g;
        g.fillStyle = "#64748b"; g.fillRect(sx + 2, sy + 1, 12, 14);
        g.fillStyle = "#94a3b8"; g.fillRect(sx + 3, sy + 2, 4, 12); g.fillRect(sx + 9, sy + 2, 4, 12);
        g.fillStyle = "#0f172a"; g.fillRect(sx + 6, sy + 7, 1, 2); g.fillRect(sx + 12, sy + 7, 1, 2);
      }
    },
    act: { S: "Guarda il divano", V: "Annusa i fiori", O: "Guarda la statua", Z: "Guarda la gradinata", F: "Guarda la lampada", C: "Guarda le casse", R: "Guarda i tubi", Q: "Guarda il sipario", q: "Entra", U: "Guarda il tavolino", K: "Guarda il bancone", B: "Guarda lo scaffale", N: "Guarda il tabellone", E: "Esamina il cancello", X: "Guarda l'armadietto" },
    travel: true,
    item: ["Biglietto del Torneo", "Biglietti del Torneo"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.2);
      g.fillStyle = "#fef3c7"; g.fillRect(-6, -4, 12, 8);
      g.strokeStyle = "#b91c1c"; g.lineWidth = 1; g.strokeRect(-6, -4, 12, 8);
      g.fillStyle = "#b91c1c"; g.fillRect(-3, -1, 6, 2);
      g.restore();
    },
    // il calendario parte dal giorno del capitolo la prima volta che si entra in una zona
    plugins: [{
      enter(zid, spec, K) { const n = /^qt_(atrio|stadio)$/.test(zid) ? 1 : /^qt_(giardino|archivio)$/.test(zid) ? 2 : 3; if (K.clock && K.F.get("clk_day", 1) < n) K.clock.set(n, 0); }
    }],
    stadium: {
      azPitch: "fondale",
      cageField: 2,
      weather: "clear",
      venue: {
        ads: [
          ["ALBERGO MERIDIANA · SUITE", "#dc2626"],
          ["IL PREMIO: QUALUNQUE COSA", "#facc15"],
          ["ZONA ROSSA · NON RESTARE FUORI", "#f87171"],
          ["QUATTORDICI SQUADRE", "#e5e7eb"]
        ],
        crowd: ["#7f1d1d", "#991b1b", "#111827", "#b45309", "#1f2937"],
        ground: ["#1f6b3a", "#1b6034"],
        wall: ["#1a0710", "#12050b"],
        line: "rgba(255,255,255,.75)",
        sky: ["#0b0b18", "#4c1d3d"],
        fx: { fr: 0.93, spd: 1.0, wind: 0.1 }
      }
    },
    guest: {
      id: "qt_ilse",
      lines: [
        "Ehi, Campione. Ho lasciato la maschera del Banditore appesa fuori, se la vuoi.",
        "Nel Borgo l'unica zona rossa è quella della piazza quando passa il tram. Mi piace.",
        "Ho parato per quattordici squadre. Di nuovo, se serve.",
        "Teo ti saluta. Dice che il furgone ora ha i sedili normali."
      ]
    },
    endings: {
      sipario: ["Il Premio", "Chiedi la tua cosa, qualunque cosa. Ottieni subito quello che desideri. Il Meridiana riapre ogni dieci anni, e nessuno ricorda più chi non è tornato.", "Prendi il Premio per te."],
      rivolta: ["Il Sipario Strappato", "Con la chiave di Luce apri il registro davanti a tutti e togli la maschera al Banditore. Il Torneo chiude per sempre, e il furgone porta indietro chi può essere portato.", "Smaschera il Banditore."],
      patto: ["La Maschera", "Prendi il posto del Banditore. Cambi le regole, ti dici. Il primo anno ci credi, il decimo ti sembra solo un'altra partita.", "Prendi il posto del Banditore."],
      quattordici: ["I Quattordici", "Finale segreto: alleanze, verità e la chiave di Luce ti permettono di usare il Premio per gli altri. Le porte dell'Ala Nord si aprono. Il Torneo diventa una lega vera, con il pubblico fuori e le squadre che tornano a casa.", "Chiedi la libertà di tutti."]
    }
  });

  const K = E.K;

  // ----------------------------------------------------------------- ritratti
  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);
    K.cast("qt_banditore", {
      name: "Il Banditore", sub: "Voce del Torneo", style: "slick", hair: "#0f172a", eye: "#0f172a", skin: "#d6a67a", shirt: "#7f1d1d",
      acc: ["maschera"], bg: ["#7f1d1d", "#0b0b12"]
    }, "Presenta il Torneo con un entusiasmo da circo e una maschera bianca che non si toglie mai. Cortesissimo, preciso, e mai una volta che dica dove vanno gli eliminati.");
    K.cast("qt_ilse", {
      name: "Ilse Varga", sub: "Ex portiere, tua compagna", style: "bun", hair: "#b45309", eye: "#0f766e", skin: "#e0b08a", shirt: "#0e7490",
      acc: ["guanti"], bg: ["#0e7490", "#082f49"]
    }, "34 anni, portiere di una squadra che nessuno ricorda più. Asciutta, ironica, con la rara abitudine di dire la verità anche quando conviene meno. Il sorteggio vi ha messi insieme, lei dice che è stato un errore e continua a restare.");
    K.cast("qt_teo", {
      name: "Teo Marangon", sub: "Rivale e amico", style: "messy", hair: "#92400e", eye: "#1e3a8a", skin: "#e8b98f", shirt: "#db2777",
      acc: ["fascia"], bg: ["#db2777", "#500724"]
    }, "22 anni, ex compagno delle giovanili, capitano dei Fenicotteri di Marina. Chiacchiera troppo, gioca bene e ti ricorda un gol a Rimini ogni volta che può.");
    K.cast("qt_corvo", {
      name: "Corvo", sub: "Capitano dei Corvi di Rigel", style: "slick", hair: "#111827", eye: "#111827", skin: "#c68c5b", shirt: "#18181b",
      scar: true, acc: ["fascia"], bg: ["#27272a", "#09090b"]
    }, "Capitano dei Corvi di Rigel, l'altra squadra rimasta. Parla poco, guarda tutto. Ha una cicatrice sul sopracciglio e una ragione per essere qui che non dice a nessuno.");
    K.cast("qt_luce", {
      name: "Luce Ferrante", sub: "Archivista", style: "bob", hair: "#6b7280", eye: "#44403c", skin: "#e0b48a", shirt: "#6d28d9",
      acc: ["occhiali", "taccuino"], bg: ["#6d28d9", "#1e1b4b"]
    }, "Archivista del Meridiana da trent'anni. Vede ogni arrivo e ogni partenza e li annota con una grafia minuscola. Ha un modo di sorridere di chi sa troppo e non ha ancora deciso a chi dirlo.");
    K.cast("qt_sfinge", {
      name: "Madama Sfinge", sub: "Patrona del Torneo", style: "long", hair: "#e5e7eb", eye: "#581c87", skin: "#d9b99b", shirt: "#581c87",
      acc: ["corona"], bg: ["#581c87", "#1e0a3c"]
    }, "Elegante, gentile, con un sorriso paziente. Ha vinto il Torneo quindici anni fa e da allora non l'ha mai lasciato. Il suo desiderio, dice, era che nessuno la dimenticasse.");
  }
  casts();

  // ----------------------------------------------------------------- aiuti condivisi dai capitoli
  const WHO = { Banditore: "qt_banditore", Ilse: "qt_ilse", Teo: "qt_teo", Corvo: "qt_corvo", Luce: "qt_luce", Sfinge: "qt_sfinge" };
  const H = {
    WHO,
    // dialoghi, scelte, fine capitolo (come negli altri capitoli, con in più la spesa di una fascia oraria)
    kit(K, N) {
      let QL = [];
      const k = { night: null };
      k.S = () => K.stepOf(N);
      k.say = (who, txt) => { QL.push([WHO[who] || who, txt]); };
      k.flush = () => { const l = QL; QL = []; return l; };
      k.done = () => { const l = k.flush(); if (l.length) K.say(l, K.done); else K.done(); };
      k.ask = (prompt, opts) => { const l = k.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn }))); if (l.length) K.say(l, go); else go(); };
      // spende una fascia: se arriva la Notte scatta l'evento notturno del capitolo
      k.spend = () => {
        const l = k.flush(), go = () => K.clock.advance(1, () => (K.clock.is("Notte") && k.night ? k.night() : K.done()));
        if (l.length) K.say(l, go); else go();
      };
      k.fin = (ending) => {
        const msg = K.reward("qt_c" + N, { coins: 70 + N * 20, cos: "qt_c" + N }), lines = k.flush();
        K.finishChapter(N, ending || "ok"); if (ending) K.end(ending);
        lines.push(["voce", `<b>${N < 3 ? "FINE DEL GIORNO " + N : "FINE DEL TORNEO"}.</b> ${msg.join(" · ")}${N < 3 ? "<br>Continua nel capitolo " + (N + 1) + "." : "<br>Gli altri finali ti aspettano nel Diario."}`]);
        K.scene(lines, () => K.openMain(), "qt_sipario");
      };
      return k;
    },
    // la partita a Zona Rossa (la forma di Ilse diventa bonus ATT/DIF/TEC)
    match(K, k, o) {
      const f = K.stat("forma"), iv = (x) => (K.inv ? K.inv.bonus(x) : 0);
      K.ownMatch(window.__zonarossa.start, {
        title: o.title, oppNames: [o.opp, "Rivali"], mate: "Ilse", bonus: { at: Math.min(4, f + iv("at")), df: Math.min(4, f + iv("df")), te: Math.min(4, f + iv("te")) },
        done: (res) => { if (res.win) o.win(); else o.lose(); }
      });
    },
    // un PNG che al calendario reagisce: briefing (passo 0), "alle quattro c'è la partita", attività di mattina/sera
    npc(K, k, N, c) {
      return () => {
        const s = k.S(), cl = K.clock;
        if (s === 0) {
          if (c.brief) { c.brief(); K.setStep(N, 1); } else k.say(c.who, c.early || "Parla prima con la tua compagna. Ha già letto il programma.");
          return k.done();
        }
        if (cl.is("Pomeriggio") && s < 2) { k.say(c.who, c.pm || "Alle quattro si gioca. Il Banditore aspetta nel campo."); return k.done(); }
        if ((cl.is("Mattina") || cl.is("Sera")) && c.acts) {
          const list = c.acts.filter((a) => !a.cond || a.cond());
          if (list.length) {
            return k.ask(c.prompt || (cl.is("Mattina") ? "È mattina. Come la spendi?" : "È sera. Come la spendi?"),
              list.map((a) => ({ t: a.t, big: true, fn: () => { a.run(); if (K.rel) K.rel.add(WHO[c.who], a.rel == null ? 6 : a.rel); k.spend(); } })).concat([{ t: "Lascia stare per ora", fn: () => { k.say(c.who, c.skip || "Come vuoi. Il tempo però non aspetta."); k.done(); } }]));
          }
        }
        const idle = c.idle || ["..."];
        k.say(c.who, idle[cl.slot() % idle.length]);
        k.done();
      };
    },
    // arredi extra per ambiente (lungo i muri, lontano dai percorsi e dai personaggi)
    props(L, z) {
      const { lay, put } = L, P = {
        qt_atrio() { [[1, 1], [26, 1], [1, 14], [26, 14]].forEach(([x, y]) => put(x, y, "V")); lay(8, 13, 9, 13, "S"); lay(17, 13, 18, 13, "S"); put(10, 1, "O"); put(17, 1, "O"); put(5, 6, "F"); put(22, 6, "F"); put(5, 10, "F"); put(22, 10, "F"); },
        qt_stadio() { lay(2, 2, 6, 2, "Z"); lay(21, 2, 25, 2, "Z"); put(1, 13, "F"); put(26, 13, "F"); put(1, 3, "F"); put(26, 3, "F"); },
        qt_giardino() { [[1, 1], [2, 1], [1, 2], [25, 1], [26, 1], [26, 2], [1, 13], [1, 14], [2, 14], [26, 13], [26, 14], [25, 14]].forEach(([x, y]) => put(x, y, "t")); lay(14, 12, 17, 13, "w"); put(6, 11, "b"); put(7, 11, "b"); put(5, 5, "l"); put(22, 6, "l"); put(13, 3, "V"); put(15, 3, "V"); },
        qt_archivio() { put(11, 4, "O"); put(16, 4, "O"); put(2, 4, "F"); put(25, 4, "F"); put(2, 12, "F"); put(25, 12, "F"); put(1, 1, "V"); put(26, 1, "V"); },
        qt_alanord() { lay(1, 1, 5, 1, "R"); lay(22, 1, 26, 1, "R"); lay(1, 13, 2, 14, "C"); lay(25, 13, 26, 14, "C"); put(14, 3, "C"); put(2, 6, "F"); put(25, 6, "F"); },
        qt_sipario() { lay(1, 1, 5, 1, "Q"); lay(22, 1, 26, 1, "Q"); put(1, 14, "O"); put(26, 14, "O"); put(9, 3, "F"); put(18, 3, "F"); put(9, 12, "S"); put(18, 12, "S"); }
      };
      if (P[z]) P[z]();
    },
    frame(L, w, h, z) {
      const { lay } = L;
      lay(0, 0, w - 1, 0, "a"); lay(0, 0, 0, h - 1, "a"); lay(w - 1, 0, w - 1, h - 1, "a"); lay(0, h - 1, w - 1, h - 1, "a");
      lay(1, 1, w - 2, h - 2, ".");
    }
  };
  window.__qtH = H;

  window.__quattordici = E.api;
  window.__quattordiciCore = E;

  // ----------------------------------------------------------------- sfondi animati (bg-scenarios.js)
  const spark = (g, W, H2, f, col, n) => {
    for (let i = 0; i < n; i++) { const x = (i * 71 + f * 0.3) % W, y = (i * 37 + f * (0.2 + (i % 3) * 0.15)) % H2; g.fillStyle = col; g.fillRect(x, y, 2, 2); }
  };
  const lamp = (g, x, y, f, i) => { g.fillStyle = "rgba(253,224,71,.85)"; g.beginPath(); g.arc(x, y, 4 + Math.sin(f / 20 + i) * 0.6, 0, 7); g.fill(); g.fillStyle = "rgba(253,224,71,.14)"; g.beginPath(); g.arc(x, y, 16, 0, 7); g.fill(); };
  window.__qtDraw = {
    Titolo(g, W, H2, f) {
      const sky = g.createLinearGradient(0, 0, 0, H2); sky.addColorStop(0, "#0b0b18"); sky.addColorStop(1, "#4c1d3d"); g.fillStyle = sky; g.fillRect(0, 0, W, H2);
      g.fillStyle = "#1a0710"; g.beginPath(); g.moveTo(0, H2 * 0.78); for (let x = 0; x <= W; x += 20) g.lineTo(x, H2 * 0.78 - 14 * Math.sin(x * 0.02 + 1)); g.lineTo(W, H2); g.lineTo(0, H2); g.fill();
      g.fillStyle = "#2a1218"; g.fillRect(W * 0.3, H2 * 0.34, W * 0.4, H2 * 0.44);
      g.fillStyle = "#3a1a22"; g.fillRect(W * 0.26, H2 * 0.5, W * 0.48, H2 * 0.28);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) if ((c * 5 + r * 3 + Math.floor(f / 50)) % 4) { g.fillStyle = "#fde047"; g.fillRect(W * 0.28 + c * (W * 0.055), H2 * 0.4 + r * 22, 6, 8); }
      for (let i = 0; i < 14; i++) { g.fillStyle = i < 14 - (Math.floor(f / 60) % 3) * 0 ? "rgba(254,202,202,.9)" : "#444"; g.beginPath(); g.arc(W * 0.12 + i * (W * 0.057), H2 * 0.14, 3, 0, 7); g.fill(); }
      spark(g, W, H2, f, "rgba(254,202,202,.4)", 14);
    },
    Atrio(g, W, H2, f) {
      g.fillStyle = "#2a1218"; g.fillRect(0, 0, W, H2); g.fillStyle = "#7a2e3a"; g.fillRect(0, H2 * 0.7, W, H2);
      g.fillStyle = "#b8923a"; g.fillRect(0, H2 * 0.7 - 2, W, 3);
      [0.15, 0.4, 0.62, 0.86].forEach((p, i) => { g.fillStyle = "#e7e5e4"; g.fillRect(W * p - 8, H2 * 0.18, 16, H2 * 0.52); g.fillStyle = "#a8a29e"; g.fillRect(W * p + 4, H2 * 0.18, 4, H2 * 0.52); });
      [0.27, 0.51, 0.74].forEach((p, i) => lamp(g, W * p, H2 * 0.14, f, i));
      g.fillStyle = "#5a3a22"; g.fillRect(W * 0.38, H2 * 0.62, W * 0.24, 20); g.fillStyle = "#facc15"; g.fillRect(W * 0.49, H2 * 0.6, 6, 4);
      spark(g, W, H2, f, "rgba(253,224,71,.3)", 10);
    },
    Stadio(g, W, H2, f) {
      g.fillStyle = "#0b1220"; g.fillRect(0, 0, W, H2); g.fillStyle = "#1f6b3a"; g.fillRect(0, H2 * 0.55, W, H2);
      for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#257443" : "#1b6034"; g.fillRect(i * (W / 8), H2 * 0.55, W / 8, H2 * 0.45); }
      g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 2; g.strokeRect(14, H2 * 0.6, W - 28, H2 * 0.34);
      for (let i = 0; i < 14; i++) { g.fillStyle = i < 14 - Math.floor(f / 400) % 5 ? "#fde047" : "#3f3f46"; g.beginPath(); g.arc(W * 0.08 + i * (W * 0.063), H2 * 0.14, 4, 0, 7); g.fill(); }
      const bt = 6 + (Math.sin(f / 40) + 1) * 8; g.fillStyle = "rgba(220,38,38,.35)"; g.fillRect(14, H2 * 0.6, W - 28, bt); g.fillRect(14, H2 * 0.94 - bt, W - 28, bt);
      g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(W * 0.5, H2 * 0.78, 5, 0, 7); g.fill();
    },
    Giardino(g, W, H2, f) {
      const sky = g.createLinearGradient(0, 0, 0, H2 * 0.6); sky.addColorStop(0, "#1e3a5f"); sky.addColorStop(1, "#fdba74"); g.fillStyle = sky; g.fillRect(0, 0, W, H2);
      g.fillStyle = "#2f7d46"; g.fillRect(0, H2 * 0.55, W, H2);
      [0.1, 0.32, 0.7, 0.9].forEach((p, i) => { g.fillStyle = "#166534"; g.beginPath(); g.arc(W * p, H2 * 0.45, 28 + (i % 2) * 8, 0, 7); g.fill(); g.fillStyle = "#4a3524"; g.fillRect(W * p - 3, H2 * 0.5, 6, 26); });
      g.fillStyle = "#c9b98a"; g.beginPath(); g.moveTo(W * 0.44, H2 * 0.55); g.lineTo(W * 0.56, H2 * 0.55); g.lineTo(W * 0.72, H2); g.lineTo(W * 0.28, H2); g.fill();
      g.fillStyle = "#3b82a0"; g.beginPath(); g.ellipse(W * 0.5, H2 * 0.7, 24, 7 + Math.sin(f / 30), 0, 0, 7); g.fill();
      spark(g, W, H2, f, "rgba(255,255,255,.35)", 12);
    },
    Archivio(g, W, H2, f) {
      g.fillStyle = "#1f1610"; g.fillRect(0, 0, W, H2); g.fillStyle = "#4a3524"; g.fillRect(0, H2 * 0.78, W, H2);
      for (let c = 0; c < 6; c++) { g.fillStyle = "#3a2518"; g.fillRect(8 + c * (W / 6), 12, W / 6 - 12, H2 * 0.66); ["#991b1b", "#1d4ed8", "#a16207", "#166534", "#6d28d9"].forEach((col, i) => { g.fillStyle = col; for (let r = 0; r < 4; r++) g.fillRect(14 + c * (W / 6) + i * 8, 22 + r * 34, 5, 24); }); }
      g.fillStyle = "rgba(253,224,71,.12)"; g.beginPath(); g.moveTo(W * 0.42, 0); g.lineTo(W * 0.58, 0); g.lineTo(W * 0.78, H2); g.lineTo(W * 0.22, H2); g.fill();
      spark(g, W, H2, f, "rgba(253,224,71,.5)", 16);
    },
    Nord(g, W, H2, f) {
      g.fillStyle = "#0b1220"; g.fillRect(0, 0, W, H2); g.fillStyle = "#3f4a58"; g.fillRect(0, H2 * 0.7, W, H2);
      for (let i = 0; i < 6; i++) { g.fillStyle = "#1f2937"; g.fillRect(14 + i * (W / 6), H2 * 0.2, W / 6 - 22, H2 * 0.5); g.fillStyle = "#94a3b8"; g.fillRect(24 + i * (W / 6), H2 * 0.3, W / 6 - 42, 6); }
      g.fillStyle = Math.floor(f / 40) % 2 ? "rgba(220,38,38,.9)" : "rgba(127,29,29,.9)"; g.beginPath(); g.arc(W * 0.5, H2 * 0.1, 6, 0, 7); g.fill();
      const cone = g.createRadialGradient(W * 0.5, H2 * 0.1, 2, W * 0.5, H2 * 0.1, 110); cone.addColorStop(0, "rgba(220,38,38,.25)"); cone.addColorStop(1, "rgba(220,38,38,0)"); g.fillStyle = cone; g.fillRect(0, 0, W, H2);
    },
    Sipario(g, W, H2, f) {
      g.fillStyle = "#12050b"; g.fillRect(0, 0, W, H2); g.fillStyle = "#5b1226"; g.fillRect(0, H2 * 0.74, W, H2);
      const sway = Math.sin(f / 60) * 3;
      g.fillStyle = "#7f1d3a"; g.beginPath(); g.moveTo(0, 0); g.lineTo(W * 0.34 + sway, 0); g.quadraticCurveTo(W * 0.2, H2 * 0.5, W * 0.3 + sway, H2 * 0.74); g.lineTo(0, H2 * 0.74); g.fill();
      g.beginPath(); g.moveTo(W, 0); g.lineTo(W * 0.66 - sway, 0); g.quadraticCurveTo(W * 0.8, H2 * 0.5, W * 0.7 - sway, H2 * 0.74); g.lineTo(W, H2 * 0.74); g.fill();
      g.fillStyle = "#d4af37"; g.fillRect(0, 0, W, 5); g.fillRect(W * 0.46, H2 * 0.28, 22, 30);
      g.fillStyle = "#f5f5f4"; g.beginPath(); g.ellipse(W * 0.5, H2 * 0.4, 18, 24, 0, 0, 7); g.fill(); g.fillStyle = "#111"; g.fillRect(W * 0.5 - 9, H2 * 0.38, 6, 3); g.fillRect(W * 0.5 + 4, H2 * 0.38, 6, 3);
      spark(g, W, H2, f, "rgba(254,202,202,.4)", 12);
    }
  };
})();
