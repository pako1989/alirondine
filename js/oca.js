// js/oca.js - «IL GIOCO DELL'OCA DEL CONTE» · configurazione della saga sul motore comune (js/saga-core.js). Commedia alla «Signori, il delitto è servito», coi dadi.
// Il Conte Ugolino Pastrocchi, ultimo nobile di Valcortese, muore e lascia la villa a chi vince la sua ultima partita: un gioco dell'oca di 63 caselle dipinto sul viale del parco.
// Sei eredi improbabili (un cugino notaio radiato, una cuoca, una medium, un ex terzino, due gemelli che non si parlano da vent'anni) e tu, chiamato come «giocatore neutrale».
// Tono: farsa di base (il notaio bara, la medium sbaglia le previsioni, i gemelli litigano su un rigore del 2004); un capitolo serio nella Prigione (casella 52), il passato del Conte.
// Dal core: Rapporti (eredi), Inventario (carte-imprevisto e regali), Peso morale (Cuore e Astuzia), dialoghi a scelta, K.minigame, finali multipli, ospite al Borgo, Registro.
// Novità del core portata da questa saga: IL TABELLONE (cfg.board): una tirata del gioco dell'oca come capitolo di storia (K.board.play), con caselle-storia, carte dall'Inventario
// e risultati che restano (vittorie, notaio beccato, minigiochi). Motore: js/tabellone.js (anche cabinato «Oca Express» in Sala Giochi).
// Tessere proprie: S siepe · V facciata della villa · R tetto · Y cipresso · N statua · P pozzo · F fontana · J vaso di limoni · X botte · E vetrata della serra
//   Z parete incisa · U tavolo col tabellone · I inferriata · O altare · Q ritratto del Conte · pavimenti K casella del tabellone · C ghiaia · A marmo
(function () {
  "use strict";
  if (window.__oca || !window.__sagaCore) return;
  const RIV = {
    arrigo: { id: "oc_arrigo", n: "Arrigo", icon: "🎩", col: "#1e293b", ai: "notaio" }, ofelia: { id: "oc_ofelia", n: "Ofelia", icon: "🔮", col: "#7c3aed", ai: "medium" },
    tonio: { id: "oc_tonio", n: "Tonio", icon: "🦵", col: "#b91c1c", ai: "terzino" }, ernestina: { id: "oc_ernestina", n: "Ernestina", icon: "🍳", col: "#f5f5f4", ai: "cuoca" },
    cosimo: { id: "oc_cosimo", n: "Cosimo", icon: "🧤", col: "#0369a1", ai: "gemello" }, damiano: { id: "oc_damiano", n: "Damiano", icon: "👟", col: "#15803d", ai: "gemello" }
  };
  const E = window.__sagaCore.create({
    id: "oca", key: "ali-di-rondine.oca", title: "Il Gioco dell'Oca del Conte", icon: "🪿", bg: "oc_titolo", chapters: 4, travel: true,
    menuSub: "Il Conte Pastrocchi lascia la villa a chi vince la sua ultima partita: sessantatré caselle dipinte sul viale del parco, sei eredi improbabili e tu, giocatore neutrale.",
    theme: { accent: "#fbbf24", ink: "#1c1917", paper: "rgba(254,249,231,.97)", font: "Georgia, serif", chipBg: "#fde68a", chipBorder: "#92400e" },
    stats: { cuore: [0, 12, 0, "Cuore"], astuzia: [0, 12, 0, "Astuzia"] },
    weight: { name: "Il Carattere", axes: { cuore: ["Cuore", "❤️"], astuzia: ["Astuzia", "🦊"] } },
    item: ["Piuma d'oca", "Piume d'oca"],
    drawItem(g, x, y, i, f) {
      g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.5); g.rotate(-0.5 + Math.sin(f / 20 + i) * 0.2); g.fillStyle = "#f8fafc"; g.beginPath(); g.ellipse(0, 0, 2.4, 6, 0, 0, 7); g.fill();
      g.strokeStyle = "#94a3b8"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(0, -6); g.lineTo(0, 7); g.stroke(); g.globalAlpha = 0.25 + 0.2 * Math.sin(f / 9 + i); g.fillStyle = "#fde68a"; g.beginPath(); g.arc(0, 0, 8, 0, 7); g.fill(); g.restore();
    },
    regions: {
      parco: { grass: ["#4d8a3c", "#559442", "#4a8439"], path: ["#d6c7a1", "#cdbd95"], stone: ["#d6cfc0", "#ccc4b4"], wall: ["#e8c27a", "#ddb46c"], water: ["#3b82a6", "#357a9c"], tall: "#3f7a33", tree: ["#1f4d24", "#2b6230", "#3b7a3a"], tint: "255,236,180", tintA: 0.06, fx: "", dark: 0 },
      sera: { grass: ["#3f7334", "#46803a", "#3c6e32"], path: ["#c9b38a", "#bfa880"], stone: ["#c9bfae", "#bfb5a4"], wall: ["#d9a866", "#cf9d5c"], water: ["#2f6d8f", "#2a6483"], tall: "#356a2c", tree: ["#1a4220", "#245a2a", "#336e34"], tint: "251,146,60", tintA: 0.14, fx: "", dark: 0.12 },
      notte: { grass: ["#22402a", "#264830", "#203c28"], path: ["#6b6658", "#625d50"], stone: ["#6f6a60", "#666158"], wall: ["#8a7a5a", "#807050"], water: ["#1e3a5f", "#1b3456"], tall: "#1f3a24", tree: ["#0f2414", "#14301a", "#1a3a20"], tint: "147,197,253", tintA: 0.12, fx: "", dark: 0.42 },
      alba: { grass: ["#5a9447", "#62a04d", "#558c43"], path: ["#e2d4ae", "#d8c9a2"], stone: ["#e0d8c8", "#d6cebe"], wall: ["#f0cc8a", "#e6c07c"], water: ["#5b9cc0", "#5291b4"], tall: "#4c8a3c", tree: ["#26592a", "#326e34", "#428842"], tint: "253,186,116", tintA: 0.12, fx: "", dark: 0 },
      interno: { grass: ["#7c5a3a", "#74533a", "#7a5838"], path: ["#9a7a52", "#92724a"], stone: ["#c8bca8", "#beb29e"], wall: ["#8a5a3a", "#7e5034"], water: ["#1e3a5f", "#1b3456"], tall: "#7c5a3a", tint: "255,230,170", tintA: 0.08, fx: "dust", dark: 0.08 },
      cantina: { grass: ["#3a3028", "#352b24", "#3d332a"], path: ["#57493a", "#4f4234"], stone: ["#5a5048", "#524840"], wall: ["#3a3028", "#2e2620"], water: ["#1e3a5f", "#1b3456"], tall: "#3a3028", tint: "251,191,36", tintA: 0.08, fx: "dust", dark: 0.38 },
      cappella: { grass: ["#44403c", "#3d3936", "#48443f"], path: ["#78716c", "#6f6863"], stone: ["#a8a29e", "#9c968f"], wall: ["#57534e", "#4b4743"], water: ["#1e3a5f", "#1b3456"], tall: "#44403c", tint: "196,181,253", tintA: 0.1, fx: "dust", dark: 0.3 }
    },
    floors: "KCA", solid: "SVRYNPFJXEZUIOQ",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g;
      if (f === "C") { g.fillStyle = (tx * 7 + ty * 3) % 5 ? "#d6c7a1" : "#cdbd95"; g.fillRect(sx, sy, 16, 16); for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? "rgba(120,100,70,.35)" : "rgba(255,255,255,.35)"; g.fillRect(sx + ((tx * 11 + i * 5) % 15), sy + ((ty * 7 + i * 3) % 15), 1.5, 1); } return true; }
      if (f === "K") { const sp = window.__tabellone && window.__tabellone.SPI, z = window.__ocaBoardAt || [0, 0], n = sp ? sp[(tx - z[0]) + "," + (ty - z[1])] : 0, k = n && window.__tabellone.BASE[n] ? window.__tabellone.BASE[n].k : "";
        g.fillStyle = "#b8a77e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = k === "morte" ? "#78716c" : k === "fine" ? "#fde68a" : k === "oca" ? "#f5efdc" : n % 2 ? "#eadcbc" : "#e0d0ac"; g.fillRect(sx + 1, sy + 1, 14, 14); g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(sx + 1, sy + 13, 14, 2); return true; }
      if (f === "A") { g.fillStyle = (tx + ty) % 2 ? "#e7e5e4" : "#57534e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(sx + 2, sy + 2, 5, 1); g.fillStyle = "rgba(0,0,0,.15)"; g.fillRect(sx, sy + 15, 16, 1); return true; }
      return false;
    },
    paint: {
      // siepe di bosso potata
      S(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = "#1f5a26"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#2a7032"; g.fillRect(sx + 1, sy, 14, 11); g.fillStyle = "#3b8a3f"; for (let i = 0; i < 5; i++) g.fillRect(sx + 2 + ((tx * 5 + i * 3) % 12), sy + 1 + ((ty * 3 + i * 5) % 8), 2, 2); g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 13, 16, 3); if ((tx * 13 + ty * 7) % 11 === 0) { g.fillStyle = "#f472b6"; g.fillRect(sx + 6, sy + 4, 2, 2); g.fillStyle = "#fde68a"; g.fillRect(sx + 10, sy + 7, 2, 2); } },
      // facciata della villa: intonaco ocra, finestre con persiane verdi, cornicione, balcone al centro
      V(K, sx, sy, tx, ty, fr) { const g = K.g, top = (ty % 3) === 0; g.fillStyle = (tx + ty) % 2 ? "#e8c27a" : "#e3bc72"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(sx, sy, 16, 1); g.fillStyle = "#c79a52"; g.fillRect(sx, sy + 15, 16, 1);
        if (tx % 2 === 0) { const lit = (tx * 3 + ty) % 4 === 0; g.fillStyle = "#14532d"; g.fillRect(sx + 2, sy + 3, 3, 10); g.fillRect(sx + 11, sy + 3, 3, 10); g.fillStyle = "#3a2a1a"; g.fillRect(sx + 5, sy + 3, 6, 10); g.fillStyle = lit ? "#ffd98a" : "#9cc4dc"; g.fillRect(sx + 6, sy + 4, 4, 8); g.fillStyle = "#3a2a1a"; g.fillRect(sx + 7.5, sy + 4, 1, 8); g.fillStyle = "#f5f0e6"; g.fillRect(sx + 4, sy + 2, 8, 1); if (lit) K.light(sx + 8, sy + 8, 12, "255,210,130", 0.25); }
        else { g.fillStyle = "rgba(0,0,0,.06)"; g.fillRect(sx + 7, sy, 2, 16); } if (top) { g.fillStyle = "#f5f0e6"; g.fillRect(sx, sy, 16, 2); } },
      // tetto a coppi
      R(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = "#b45309"; g.fillRect(sx, sy, 16, 16); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = (r + c + tx) % 2 ? "#c2410c" : "#9a3412"; g.beginPath(); g.ellipse(sx + c * 4 + 2 + (r % 2) * 2, sy + r * 4 + 3, 2, 2.4, 0, 0, 7); g.fill(); } g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 14, 16, 2); },
      // cipresso
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, sw = Math.sin(fr / 70 + tx) * 0.6; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 9, sy + 14, 6, 2.4, 0, 0, 7); g.fill(); g.fillStyle = "#5a3e24"; g.fillRect(sx + 7, sy + 10, 2, 5); g.fillStyle = "#14401c"; g.beginPath(); g.moveTo(sx + 8 + sw, sy - 14); g.quadraticCurveTo(sx + 15, sy + 2, sx + 8, sy + 12); g.quadraticCurveTo(sx + 1, sy + 2, sx + 8 + sw, sy - 14); g.fill(); g.fillStyle = "#1f5a28"; g.beginPath(); g.moveTo(sx + 7 + sw, sy - 10); g.quadraticCurveTo(sx + 3, sy, sx + 7, sy + 9); g.lineTo(sx + 8, sy - 2); g.fill(); },
      // statua di marmo su piedistallo
      N(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 2, sy + 13, 14, 3); g.fillStyle = "#a8a29e"; g.fillRect(sx + 3, sy + 7, 10, 8); g.fillStyle = "#d6d3d1"; g.fillRect(sx + 3, sy + 7, 10, 2); g.fillStyle = "#e7e5e4"; g.fillRect(sx + 6, sy - 6, 4, 13); g.beginPath(); g.arc(sx + 8, sy - 8, 2.6, 0, 7); g.fill(); g.fillRect(sx + 3, sy - 4, 3, 2); g.fillRect(sx + 10, sy - 6, 3, 2); g.fillStyle = "#fafaf9"; g.beginPath(); g.arc(sx + 13, sy - 7, 2, 0, 7); g.fill(); },
      // pozzo con la carrucola
      P(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 13, 8, 3, 0, 0, 7); g.fill(); g.fillStyle = "#8a8378"; g.fillRect(sx + 1, sy + 5, 14, 9); g.fillStyle = "#a8a29e"; for (let i = 0; i < 3; i++) g.fillRect(sx + 1 + i * 5, sy + 7 + (i % 2) * 3, 4, 2); g.fillStyle = "#0c2a3e"; g.fillRect(sx + 3, sy + 4, 10, 3); g.fillStyle = "#5a3e24"; g.fillRect(sx + 2, sy - 6, 2, 11); g.fillRect(sx + 12, sy - 6, 2, 11); g.fillRect(sx + 1, sy - 7, 14, 2); g.fillStyle = "#d6d3d1"; g.fillRect(sx + 7.5, sy - 5, 1, 6 + Math.sin(fr / 25) * 1.5); g.fillStyle = "#78350f"; g.fillRect(sx + 6, sy + 1 + Math.sin(fr / 25) * 1.5, 4, 3); },
      // fontana (quattro tessere: la vasca; lo zampillo lo disegna la zona)
      F(K, sx, sy, tx, ty, fr) { const g = K.g, L = K.zone && window.__ocaFontAt ? window.__ocaFontAt : null, qx = L ? tx - L[0] : 0, qy = L ? ty - L[1] : 0; g.fillStyle = "#d6c7a1"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#a8a29e"; g.beginPath(); g.arc(sx + (qx ? 0 : 16), sy + (qy ? 0 : 16), 15, 0, 7); g.fill(); g.fillStyle = "#3b82a6"; g.beginPath(); g.arc(sx + (qx ? 0 : 16), sy + (qy ? 0 : 16), 12, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(sx + 4 + ((fr / 4 + tx * 3) % 8), sy + 6 + qy * 2, 4, 1); },
      // vaso di limoni
      J(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 6, 2, 0, 0, 7); g.fill(); g.fillStyle = "#c2410c"; g.fillRect(sx + 4, sy + 8, 8, 7); g.fillStyle = "#9a3412"; g.fillRect(sx + 3, sy + 7, 10, 2); g.fillStyle = "#2f6a2c"; g.beginPath(); g.arc(sx + 8, sy + 2, 6.5, 0, 7); g.fill(); g.fillStyle = "#facc15"; [[5, 1], [10, 3], [8, -2], [6, 5]].forEach(([a, b]) => { g.beginPath(); g.arc(sx + a, sy + b, 1.4, 0, 7); g.fill(); }); },
      // botte di vino
      X(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = "#3a3028"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#7c4a24"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 7.5, 7, 0, 0, 7); g.fill(); g.fillStyle = "#5a3418"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 5, 4.6, 0, 0, 7); g.fill(); g.strokeStyle = "#a8a29e"; g.lineWidth = 1; g.beginPath(); g.ellipse(sx + 8, sy + 8, 7, 6.5, 0, 0, 7); g.stroke(); g.fillStyle = "#e7e5e4"; g.font = "700 4px Georgia"; g.textAlign = "center"; g.fillText("'" + (60 + (tx * 3 + ty) % 30), sx + 8, sy + 10); g.fillStyle = "#1c1917"; g.fillRect(sx + 7, sy + 13, 2, 3); },
      // vetrata della serra
      E(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#1f5a26"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(186,230,253,.55)"; g.fillRect(sx + 1, sy + 1, 14, 14); g.fillStyle = "#e7e5e4"; g.fillRect(sx, sy, 16, 1); g.fillRect(sx, sy + 7, 16, 1); g.fillRect(sx, sy, 1, 16); g.fillRect(sx + 8, sy, 1, 16); g.fillStyle = "#3b8a3f"; g.fillRect(sx + 2, sy + 9, 4, 5); g.fillRect(sx + 10, sy + 10, 3, 4); g.fillStyle = "#f472b6"; g.fillRect(sx + 3, sy + 9, 1, 1); g.fillStyle = "rgba(255,255,255,.4)"; g.fillRect(sx + 2 + ((fr / 9 + tx * 4) % 12), sy + 2, 1, 4); },
      // la parete della cella con la spirale incisa
      Z(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = "#6b6560"; g.fillRect(sx, sy, 16, 16); g.strokeStyle = "rgba(231,229,228,.55)"; g.lineWidth = 0.7; g.beginPath(); for (let a = 0; a < 18; a += 0.4) { const r = 7 - a * 0.36, x = sx + 8 + Math.cos(a + tx) * r, y = sy + 8 + Math.sin(a + tx) * r; if (a === 0) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); g.fillStyle = "rgba(231,229,228,.5)"; for (let i = 0; i < 6; i++) g.fillRect(sx + 1 + i * 2.5, sy + 14 - (i % 2), 0.8, 2); },
      // tavolo col tabellone
      U(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 12, 15, 4); g.fillStyle = "#7c4a24"; g.fillRect(sx, sy + 2, 16, 11); g.fillStyle = "#fef3c7"; g.fillRect(sx + 2, sy + 3, 12, 8); g.strokeStyle = "#b45309"; g.lineWidth = 0.6; g.beginPath(); for (let a = 0; a < 14; a += 0.5) { const r = 5 - a * 0.33; g.lineTo(sx + 8 + Math.cos(a) * r * 1.2, sy + 7 + Math.sin(a) * r * 0.7); } g.stroke(); g.fillStyle = "#b91c1c"; g.fillRect(sx + 4, sy + 5, 1.5, 1.5); g.fillStyle = "#1d4ed8"; g.fillRect(sx + 10, sy + 8, 1.5, 1.5); },
      // inferriata
      I(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; for (let i = 1; i < 16; i += 3) { g.fillStyle = "#44403c"; g.fillRect(sx + i, sy, 1.5, 16); } g.fillRect(sx, sy + 3, 16, 1.5); g.fillRect(sx, sy + 12, 16, 1.5); },
      // altare
      O(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#57534e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#e7e5e4"; g.fillRect(sx + 1, sy + 5, 14, 10); g.fillStyle = "#b45309"; g.fillRect(sx + 1, sy + 5, 14, 2); g.fillStyle = "#facc15"; g.fillRect(sx + 7, sy - 4, 2, 8); g.fillRect(sx + 5, sy - 2, 6, 1.5); [3, 13].forEach((x) => { g.fillStyle = "#f5f5f4"; g.fillRect(sx + x - 1, sy + 1, 2, 4); g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(sx + x, sy + Math.sin(fr / 7 + x) * 0.6, 1.4, 0, 7); g.fill(); K.light(sx + x, sy, 14, "251,191,36", 0.3); }); },
      // ritratto del Conte sulla parete
      Q(K, sx, sy, tx, ty) { const g = K.g, R = "#8a5a3a"; g.fillStyle = R; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#b45309"; g.fillRect(sx + 2, sy + 1, 12, 14); g.fillStyle = "#3f2a1a"; g.fillRect(sx + 3, sy + 2, 10, 12); g.fillStyle = "#e0b48a"; g.beginPath(); g.arc(sx + 8, sy + 6, 2.6, 0, 7); g.fill(); g.fillStyle = "#f5f5f4"; g.fillRect(sx + 6, sy + 3, 4, 1.4); g.fillRect(sx + 6.5, sy + 7, 3, 1); g.fillStyle = "#7f1d1d"; g.fillRect(sx + 5, sy + 9, 6, 5); }
    },
    act: { P: "Guarda nel pozzo", N: "Guarda la statua", U: "Guarda il tabellone", Z: "Leggi la parete", Q: "Guarda il ritratto", O: "Guarda l'altare", X: "Guarda le botti", F: "Guarda la fontana" },
    flavor: {
      S: "Siepe di bosso, potata al centimetro. Teo dice che il Conte la misurava col righello e protestava per un millimetro.", V: "La facciata della villa. L'intonaco è color zabaione, le persiane verdi. Da una finestra al primo piano qualcuno ti osserva. Poi tira la tenda.",
      R: "Il tetto. Mancano tre coppi dal 1987: il Conte diceva che servivano «a far entrare l'aria buona».", Y: "Un cipresso. Ce ne sono sessantatré, uno per casella. Qualcuno li ha contati, e ha avuto ragione.",
      N: "Una statua di marmo: un uomo in mutande che regge un pallone. La targhetta dice «IL PODISTA». Teo dice che è il Conte da giovane. Il Conte diceva che era Garibaldi.", P: "Il pozzo. Nel buio, una monetina luccica. Si dice che porti fortuna buttarne una. Si dice anche che il Conte le ripescasse il lunedì.",
      F: "La fontana. Al centro, un'oca di bronzo sputa acqua con aria offesa.", J: "Un vaso di limoni. Ogni limone ha un'etichetta con un nome: «Arrigo», «Ofelia», «Tonio». Il più grosso si chiama «Io».",
      X: "Botti di rovere, numerate col gesso. Su una, la scritta «NON APRIRE PRIMA DEL '71». Il '71 è passato da un pezzo. Nessuno l'ha aperta lo stesso.", E: "La vetrata della serra. Dentro, palme, felci e una sedia a dondolo che dondola da sola. Probabilmente per la corrente.",
      Z: "La parete della cella. Una spirale di sessantatré caselle incisa col chiodo, ogni casella un segno. Vicino al centro, piccolissimo: «L.».", U: "Il tabellone del Conte, dipinto a mano su un'asse di noce. Le pedine sono tappi di bottiglia.",
      I: "Un'inferriata. Il ferro è nuovo, ma i cardini sono vecchi.", O: "L'altare della cappella. Due candele accese. Qualcuno le cambia ogni sera, e non è il prete.", Q: "Il ritratto del Conte Ugolino Pastrocchi: baffi bianchi, sguardo da baro, un dado d'avorio tra le dita. Il pittore ha dato al dado un sei. Il Conte, si dice, insistette."
    },
    rest: { ch: "s", label: "Siediti su una panchina", text: "Ti siedi. Un'oca ti guarda come se avessi preso il suo posto. Il gioco salva da solo; dal menu puoi rileggere il Registro del Conte." },
    texts: { nothing: "Niente di speciale. Un'oca, in lontananza, ti giudica.", noHero: "Villa Pastrocchi non apre a uno senza nome. Crea prima il tuo Campione.", chestOpen: "Apri la cassetta.", chestEmpty: "La cassetta è vuota. Dentro c'è solo un biglietto: «Ritenta.»" },
    journal: { name: "Il Registro del Conte", sub: "Le tirate, gli eredi, i segreti della villa" },
    bonds: {
      per: 4, talk: 2, max: 5, names: ["Sconosciuti", "Avversari di tavolo", "Compagni di dado", "Alleati", "Amici di villa", "Famiglia"],
      scenes: {
        oc_ernestina: [
          { lv: 2, id: "ern2", prize: "+1 Cuore", lines: [["oc_ernestina", "[pensa] Trentun anni in questa cucina. Il Conte mangiava la minestra alle sette e un quarto, mai alle sette. Diceva che alle sette mangiano i borghesi."], ["oc_ernestina", "[ride] E il martedì voleva il budino, ma diceva che non lo voleva. Io glielo facevo lo stesso. Non l'ha mai lasciato nel piatto."]], reward: (K) => K.bond("cuore", 1) },
          { lv: 4, id: "ern4", prize: "Oca di carta", lines: [["oc_ernestina", "[serio] Mia madre faceva la cuoca qui prima di me. Si chiamava Lucia. È morta che avevo vent'anni. Il Conte venne al funerale, in fondo, col cappello in mano. Non entrò."], ["oc_ernestina", "Tieni. L'ha piegata uno dei gemelli quando erano piccoli, la tengo nel cassetto dei mestoli. Porta fortuna. Credo."]], reward: (K) => K.inv.give("oc_ocacarta") }
        ],
        oc_arrigo: [
          { lv: 2, id: "arr2", prize: "+1 Astuzia", lines: [["oc_arrigo", "[furbo] Mi hanno radiato per una sciocchezza. Un testamento firmato da un uomo già morto. Ma era morto da poco! Un'ora, massimo. Si poteva ancora considerare presente."], ["oc_arrigo", "Il diritto, caro mio, è come il gioco dell'oca: conta dove arrivi, non come."]], reward: (K) => K.bond("astuzia", 1) },
          { lv: 4, id: "arr4", prize: "Lente del notaio", lines: [["oc_arrigo", "[serio] Mio padre diceva che lo zio Ugolino era la vergogna della famiglia. Galera, giornali, tutto. Io ci ho creduto per cinquant'anni. Ho fatto il notaio per essere quello serio."], ["oc_arrigo", "[triste] Guarda come è finita. Tieni la mia lente. Con questa leggevo le clausole piccole. Adesso leggi tu le mie mani, quando tiro i dadi. È più onesto così."]], reward: (K) => K.inv.give("oc_lente") }
        ],
        oc_ofelia: [
          { lv: 2, id: "ofe2", prize: "+1 Cuore", lines: [["oc_ofelia", "[sorpreso] Lo vuoi sapere davvero? Non vedo niente. Mai visto niente. Ma la gente ha bisogno di sentirsi dire che qualcuno, di là, li aspetta. Io glielo dico."], ["oc_ofelia", "Il Conte veniva da me ogni giovedì. Chiedeva sempre della stessa persona. Io gli dicevo che stava bene. Lui pagava il doppio."]], reward: (K) => K.bond("cuore", 1) }
        ],
        oc_tonio: [
          { lv: 2, id: "ton2", prize: "+1 Astuzia", lines: [["oc_tonio", "[ride] Rondinese, stagione '84. Ventotto ammonizioni, un'espulsione per aver detto «buongiorno» all'arbitro con troppa enfasi."], ["oc_tonio", "Il Conte mi pagava le trasferte di nascosto. Tutte. Diceva che uno che entra in scivolata così merita di vedere il mare."]], reward: (K) => K.bond("astuzia", 1) },
          { lv: 4, id: "ton4", prize: "Corda del ponte", lines: [["oc_tonio", "[serio] Nell'86 mi sono rotto il ginocchio, e fine. Ho fatto il magazziniere al mercato per trent'anni. Il Conte mi mandava un pacco a Natale: un pallone e una bottiglia. Mai un biglietto."], ["oc_tonio", "Tieni la corda. Al ponte del parco c'è un passaggio che conosciamo in due. Ora in tre."]], reward: (K) => K.inv.give("oc_corda") }
        ],
        oc_cosimo: [
          { lv: 2, id: "cos2", prize: "+1 Cuore", lines: [["oc_cosimo", "[pensa] Damiano ha tirato il rigore alto. Juniores, 2004, finale provinciale. Io ero in porta dall'altra parte. L'ho parato… cioè, è andato alto. Ma io mi sono tuffato bene."], ["oc_cosimo", "Vent'anni senza parlarci per un rigore. Detto ad alta voce sembra una cretinata. Infatti non lo dico mai ad alta voce."]], reward: (K) => K.bond("cuore", 1) }
        ],
        oc_damiano: [
          { lv: 2, id: "dam2", prize: "+1 Astuzia", lines: [["oc_damiano", "[arrabbiato] Cosimo si è mosso prima. Sui rigori il portiere non si muove prima. Lo dice il regolamento. Lo dice la logica. Lo dice anche il Signore, credo."], ["oc_damiano", "[pensa] …poi l'ho tirato alto lo stesso. Ma si era mosso prima."]], reward: (K) => K.bond("astuzia", 1) }
        ]
      }
    },
    inv: {
      items: {
        oc_dado: { n: "Dado d'avorio", icon: "🎲", d: "Un dado d'avorio ingiallito, con un sei consumato dalle dita. Il Conte ne aveva sette. Sono nascosti per la villa." },
        oc_lente: { n: "Lente del notaio", icon: "🔍", d: "Una lente da clausole piccole. Nel Tabellone, se la tieni in mano, quando Arrigo gira il dado lo becchi e torna indietro di 3." },
        oc_santino: { n: "Santino del Conte", icon: "🕯️", d: "Un santino con la faccia del Conte al posto di quella del santo. Nel Tabellone ti salva da una casella cattiva (Locanda, Pozzo, Buca, Labirinto, Prigione, Morte)." },
        oc_biscotto: { n: "Biscotti di Ernestina", icon: "🍪", d: "Biscotti al burro nel tovagliolo. Nel Tabellone: +1 a un tiro. Fuori dal Tabellone: un regalo che nessuno rifiuta.", gift: { oc_tonio: 5, oc_cosimo: 4, oc_damiano: 4, oc_ofelia: 3, oc_arrigo: 3 }, giftAny: 2, react: { oc_tonio: "[felice] Burro e scorza di limone. Come nell'84 in ritiro. Ernestina li faceva per tutta la squadra, di nascosto." } },
        oc_ocacarta: { n: "Oca di carta", icon: "🪿", d: "Un'oca di carta piegata a mano. Nel Tabellone: dopo la mossa rilanci i dadi." },
        oc_corda: { n: "Corda del ponte", icon: "🪢", d: "Un pezzo di corda di canapa. Nel Tabellone: scambi il posto con chi è primo." },
        oc_barolo: { n: "Bottiglia del '71", icon: "🍷", d: "Una bottiglia della cantina, annata 1971, con l'etichetta scritta a mano: «per quando torno».", gift: { oc_arrigo: 6, oc_tonio: 4, oc_ernestina: 2 }, giftAny: 1, react: { oc_arrigo: "[sorpreso] Il '71! Lo zio non la apriva mai. Diceva che era «per quando torno». Tornare da dove, non l'ha mai spiegato." } },
        oc_tarocco: { n: "Carta dei tarocchi", icon: "🃏", d: "L'Arcano XVI, la Torre, trovato tra le felci della serra. Qualcuno l'ha persa. O nascosta.", gift: { oc_ofelia: 8 }, giftAny: 0, react: { oc_ofelia: "[felice] La mia Torre! La cercavo da martedì. Senza la Torre le previsioni vengono troppo buone, e nessuno ci crede." } },
        oc_rosmarino: { n: "Rametto di rosmarino", icon: "🌿", d: "Rosmarino dell'orto della villa, colto al mattino.", gift: { oc_ernestina: 6 }, giftAny: 1, react: { oc_ernestina: "[felice] Dal cespuglio vicino al pozzo! È il più buono, l'ha piantato mia madre. Stasera arrosto." } },
        oc_figurina: { n: "Figurina del 1984", icon: "🧷", d: "Una figurina Panini un po' unta: «SGAMBETTI · Rondinese · terzino». Dietro, a penna: «il mio preferito. U.»", gift: { oc_tonio: 9 }, giftAny: 0, react: { oc_tonio: "[sorpreso] Io… sono io. Con il baffo del '84. E dietro c'è scritto… «il mio preferito». U. Ugolino. Il vecchio mi seguiva davvero." } },
        oc_gessetto: { n: "Gessetto del campo", icon: "🖍️", d: "Un gessetto bianco per segnare il dischetto del rigore. Mezzo consumato.", gift: { oc_cosimo: 5, oc_damiano: 5 }, giftAny: 0, react: { oc_cosimo: "[pensa] Il dischetto. Undici metri. A volte mi sembrano di più.", oc_damiano: "[arrabbiato] Undici metri. Li ho misurati io, quella volta. Erano undici e venti. Lo sapevo." } },
        oc_lettera: { n: "Lettera a Lucia", icon: "✉️", d: "Una lettera mai spedita, scritta in carcere nel 1972. Indirizzo: «Lucia Bove, cucina di Villa Pastrocchi»." },
        oc_busta: { n: "Busta 63", icon: "📨", d: "Una busta sigillata con la ceralacca e un'oca stampata. Sopra: «Da aprire alla casella 63. Non prima. Ti vedo, Arrigo.»" }
      }
    },
    endings: {
      vivi: ["La Villa ai Vivi", "Arrivi alla 63 e scegli di non scegliere: la villa a tutti, a patto che ci vivano insieme. Ernestina in cucina, Tonio al campetto, Ofelia nella serra, i gemelli che litigano a voce, Arrigo all'amministrazione (sorvegliato). Al primo pranzo della domenica nessuno si ammazza. È un inizio.", "Arriva primo all'ultima tirata, con almeno tre eredi amici (Rapporti 2) o tanto Cuore."],
      notaio: ["Tutto al Notaio", "Arrigo arriva alla 63 un tiro prima di te, con un dado che gira sempre dalla parte giusta. Firma, vende, e al posto del parco sorge «Residenza Le Oche». Sessantatré bilocali. Le oche, almeno, restano: sono nel logo.", "Perdi l'ultima tirata contro Arrigo, o lascialo vincere."],
      casella: ["Casella 63", "Apri la Busta 63 davanti a tutti e leggi ad alta voce la verità: il Conte non era un ladro, e Ernestina è sua figlia. La villa va a lei. Lei mette il ritratto del Conte in cucina, accanto a quello di sua madre, e per la prima volta li guarda insieme.", "Scopri la verità nella cappella, dilla a Ernestina, e arriva primo alla 63."],
      bara: ["Il Conte Bara Ancora", "Segreto: alla 63, Teo il giardiniere si toglie il cappello, si stacca la barba e chiede un caffè. Il Conte Ugolino Pastrocchi, vivo, ha finto la morte per vedere chi gli voleva bene. Ora lo sa. Ernestina gli tira il mestolo. Poi lo abbraccia.", "Segreto: i sette dadi d'avorio, e Arrigo beccato almeno due volte con la Lente."]
    },
    heroLook: () => ({ bg: ["#92400e", "#fde68a"], shirt: "#1f5fbf" }),
    heroTitle: () => "il giocatore neutrale",
    board: { eng: "__tabellone", name: "Il Tabellone", icon: "🪿", rivals: RIV, wins: "oc_vinte", caught: "oc_beccato", cards: { oc_biscotto: "biscotto", oc_ocacarta: "ocacarta", oc_santino: "santino", oc_lente: "lente", oc_corda: "corda" },
      quit: "Ti alzi dal tabellone. Gli eredi si guardano, Gilda segna la tua casella sul registro. «La tirata riprende quando vuole lei, giocatore.»" },
    musicMain: "oca",
    music: { oca: { bpm: 118, chords: ["C", "Am", "F", "G", "C", "E", "Am", "G"], lres: 2, lw: "triangle", lv: 0.03,
      lead: "C5 - E5 - G5 - E5 - | F5 - E5 - D5 - - - | C5 - E5 - G5 - A5 - | G5 - - - - - - - | A5 - G5 - F5 - E5 - | D5 - E5 - F5 - - - | E5 - D5 - C5 - B4 - | C5 - - - - - - -",
      bass: "R . 5 . R . 5 . R . 5 . 3 . 5 .", bv: 0.09, arp: "1 3 5 3 1 3 5 8", aw: "square", av: 0.008, drum: "k . h . s . h . k k h . s . h h", dv: 0.07 } },
    guide: () => [["🪿 Il Tabellone", "Ogni capitolo ha la sua tirata: un pezzo delle 63 caselle. Tocca Lancia, poi Ferma: se il cursore è nel verde correggi il tiro di uno. Le oche ti fanno avanzare ancora, Ponte salta, Locanda/Pozzo/Prigione fermano, Labirinto e Morte rimandano indietro."], ["🃏 Le carte", "Le carte-imprevisto dello Zaino si giocano nel Tabellone prima di tirare: Biscotti (+1), Oca di carta (rilancio), Corda (scambio col primo). Lente e Santino lavorano da soli, se li hai."], ["🎲 Gli eredi", "Il notaio bara (con la Lente lo becchi), la medium prevede il tuo tiro (smentiscila), il terzino entra in scivolata, la cuoca ti regala un biscotto, i gemelli litigano."]],
    cameos: [],
    guest: { id: "oc_ernestina", lines: ["Ernestina, cuoca di Villa Pastrocchi. Sì, quella del gioco dell'oca. Ho portato il tabellone al bar: si gioca il giovedì, chi perde lava i bicchieri.", "Il Conte diceva che a tavola e al gioco si vede chi sei. Io aggiungo: anche a chi lava i piatti."] },
    onReady(K) { window.__ocaH(K).people(); }
  });
  // --------------------------------------------------------------------------------------------------------------- aiuti comuni dei capitoli
  window.__ocaH = (K) => {
    let QL = [];
    const F = K.F;
    const H = {
      RIV,
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1c1917", skin: "#e0b48a" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "800 6px Georgia, serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(41,24,8,.86)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#fbbf24"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = "#fef3c7"; g.textAlign = "center"; g.fillText(txt, x, y + 2.5); g.restore(); },
      dadi: () => K.inv.count("oc_dado"),
      beccato: () => F.get("oc_beccato", 0) | 0,
      vinte: () => F.get("oc_vinte", 0) | 0,
      amici: () => ["oc_ernestina", "oc_arrigo", "oc_ofelia", "oc_tonio", "oc_cosimo", "oc_damiano"].filter((id) => K.rel.lv(id) >= 2).length,
      stato: () => `❤️ Cuore ${K.stat("cuore")} · 🦊 Astuzia ${K.stat("astuzia")} · 🏁 Tirate vinte ${H.vinte()} · 🔍 Notaio beccato ${H.beccato()} · 🎲 Dadi d'avorio ${H.dadi()}/7`,
      // una tirata del Tabellone: rivali, carte dallo Zaino, caselle-storia. cb(r) col risultato (anche se non arrivi primo: la storia va avanti)
      tirata(o, cb) { const l = H.flush(), go = () => K.board.play(Object.assign({ bg: "oc_parco" }, o), cb); if (l.length) K.say(l, go); else go(); },
      esito: (r) => (r.win ? "Arrivi <b>primo</b>." : `Arrivi <b>${r.rank || 2}°</b>.`) + (r.caught ? ` 🔍 Arrigo beccato ${r.caught} ${r.caught > 1 ? "volte" : "volta"}.` : "") + (r.sfide && r.sfide.ok + r.sfide.ko ? ` ⚽ Caselle-campo ${r.sfide.ok}/${r.sfide.ok + r.sfide.ko}.` : ""),
      people() {
        H.cast("oc_gilda", "Gilda Ferraris", "Esecutrice testamentaria", { style: "bob", hair: "#a8a29e", shirt: "#334155", skin: "#f1d1b0", eye: "#1e3a8a", acc: ["occhiali"], bg: ["#1e293b", "#cbd5e1"] }, "Esecutrice testamentaria del Conte, quarant'anni di carte bollate. Fa rispettare le regole del gioco dell'oca come fossero il codice civile. Sotto la giacca, si dice, tifa Rondinese.");
        H.cast("oc_arrigo", "Arrigo Pastrocchi", "Il cugino notaio (radiato)", { style: "slick", hair: "#1c1917", shirt: "#1e293b", skin: "#f1c9a5", eye: "#44403c", beard: "baffi", acc: ["occhiali"], bg: ["#0f172a", "#94a3b8"] }, "Nipote del Conte, notaio radiato dall'albo per «un testamento firmato con eccessivo ritardo». Bara a tutto: dadi, carte, bocce, anche al solitario.");
        H.cast("oc_ernestina", "Ernestina Bove", "La cuoca della villa", { style: "messybun", hair: "#78716c", shirt: "#f8fafc", skin: "#e0ac7e", eye: "#3f2a1a", acc: ["grembiule"], bg: ["#92400e", "#fde68a"] }, "Trentun anni nella cucina di Villa Pastrocchi, come sua madre Lucia prima di lei. Sa come prendeva il caffè il Conte, e altre cose che non dice.");
        H.cast("oc_ofelia", "Madame Ofelia", "Medium (sedicente)", { style: "long", hair: "#1c1917", shirt: "#7c3aed", skin: "#efcfb0", eye: "#581c87", acc: ["sciarpa"], bg: ["#3b0764", "#e9d5ff"] }, "Ofelia Lunardi, in arte Madame Ofelia: medium, cartomante, consulente spirituale del Conte ogni giovedì. Le sue previsioni sono sicure al cinquanta per cento.");
        H.cast("oc_tonio", "Tonio Sgambetti", "Ex terzino della Rondinese", { style: "buzz", hair: "#a8a29e", shirt: "#b91c1c", skin: "#c8956a", eye: "#1c1917", beard: "folta", bg: ["#7f1d1d", "#fecaca"] }, "Terzino della Rondinese nella stagione '84: ventotto ammonizioni, un'espulsione per un «buongiorno» troppo enfatico. Entra in scivolata anche nelle conversazioni.");
        H.cast("oc_cosimo", "Cosimo Pastrocchi", "Gemello (ex portiere)", { style: "curly", hair: "#57534e", shirt: "#0369a1", skin: "#f1c9a5", eye: "#1c1917", bg: ["#0c4a6e", "#bae6fd"] }, "Gemello di Damiano, quarantun anni, geometra. Nel 2004 era in porta nella finale provinciale juniores. Il rigore di suo fratello andò alto. Da allora non si parlano.");
        H.cast("oc_damiano", "Damiano Pastrocchi", "Gemello (ex centravanti)", { style: "side", hair: "#57534e", shirt: "#15803d", skin: "#f1c9a5", eye: "#1c1917", bg: ["#14532d", "#bbf7d0"] }, "Gemello di Cosimo, quarantun anni, ragioniere. Nel 2004 tirò il rigore della finale. Alto. Sostiene ancora che il fratello si fosse mosso prima.");
        H.cast("oc_teo", "Teo", "Il giardiniere", { style: "bald", hair: "#e7e5e4", shirt: "#4d7c0f", skin: "#d9a679", eye: "#3f2a1a", beard: "folta", acc: ["cappellino"], bg: ["#365314", "#d9f99d"] }, "Il giardiniere di Villa Pastrocchi. Pota le siepi col righello, parla alle oche, ha una barba bianca che sembra finta. Nessuno ricorda quando è arrivato.");
        H.cast("oc_conte", "Conte Ugolino Pastrocchi", "Il padrone di casa (buonanima)", { style: "ordinato", hair: "#f5f5f4", shirt: "#7f1d1d", skin: "#e8c4a0", eye: "#44403c", beard: "baffi", bg: ["#450a0a", "#fde68a"] }, "L'ultimo Conte di Valcortese. Baro, generoso, testardo. Ha lasciato la villa a chi vince la sua ultima partita al gioco dell'oca. Nel 1972 ha passato tre anni in carcere. Pochi sanno perché.");
      }
    };
    return H;
  };
  window.__oca = E.api; window.__ocaCore = E;
})();
