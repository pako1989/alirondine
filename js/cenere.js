// js/cenere.js - «CENERE E GLORIA» · Configurazione saga su js/saga-core.js
// Dopo il crollo i villaggi di rottami si guardano con sospetto. Un pallone ritrovato in un bunker riaccende le sfide
// al posto dei saccheggi. Saga seria, umana, con poche battute ironiche. Ispirata a The Last of Us, Mad Max e Nausicaä.
// Novità: le BORRACCE (acqua da razionare tra le zone), il vento di sabbia in esplorazione e il motore «Campo di Rottami».
(function () {
  "use strict";
  if (window.__cenere || !window.__sagaCore) return;

  const OUTDOOR = { ce_strada: 1, ce_cratere: 1 };

  const HD = window.__hd, FX = HD.F, hs = HD.hs;
  const neigh = (K, tx, ty, ch) => { const m = K.ZX.map || []; return ((m[ty] || [])[tx]) === ch; };
  // pavimenti per ambiente (js/hd.js)
  const FLOORS = {
    villaggio: { ".": (g, sx, sy, tx, ty, fr, K) => FX.sand(g, sx, sy, tx, ty, fr, K, ["#b98c55", "#ad8049"]), ":": (g, sx, sy, tx, ty, fr, K) => ruts(g, sx, sy, tx, ty, ["#8a6a3e", "#7d5f36"]), "+": (g, sx, sy, tx, ty, fr, K) => FX.concrete(g, sx, sy, tx, ty, fr, K, ["#6b6258", "#5c544b"]) },
    bunker: { ".": (g, sx, sy, tx, ty, fr, K) => FX.concrete(g, sx, sy, tx, ty, fr, K, ["#4a4d52", "#42454a"]), ":": (g, sx, sy, tx, ty, fr, K) => FX.grate(g, sx, sy, tx, ty, fr, K, ["#25282c", "#6b6f75"]), "+": (g, sx, sy, tx, ty, fr, K) => FX.concrete(g, sx, sy, tx, ty, fr, K, ["#33363b", "#2a2d31"]) },
    strada: { ".": (g, sx, sy, tx, ty, fr, K) => FX.sand(g, sx, sy, tx, ty, fr, K, ["#c9a265", "#bd9659"]), ":": (g, sx, sy, tx, ty, fr, K) => road(g, sx, sy, tx, ty, K), "+": (g, sx, sy, tx, ty, fr, K) => FX.stone(g, sx, sy, tx, ty, fr, K, ["#7a6a55", "#6c5d4a"]) },
    cratere: { ".": (g, sx, sy, tx, ty, fr, K) => FX.ash(g, sx, sy, tx, ty, fr, K, ["#5a4034", "#4e362c"]), ":": (g, sx, sy, tx, ty, fr, K) => FX.cobble(g, sx, sy, tx, ty, fr, K, ["#6a4a38", "#4e3122"]), "+": (g, sx, sy, tx, ty, fr, K) => FX.stone(g, sx, sy, tx, ty, fr, K, ["#5f5148", "#51443c"]) }
  };
  function ruts(g, sx, sy, tx, ty, p) { // terra battuta con solchi di ruote
    HD.R(g, sx, sy, 16, 16, p[(tx + ty) % 2]); HD.R(g, sx, sy + 3, 16, 2, "rgba(0,0,0,.2)"); HD.R(g, sx, sy + 11, 16, 2, "rgba(0,0,0,.2)"); HD.R(g, sx, sy + 5, 16, 1, "rgba(255,230,180,.1)");
    for (let i = 0; i < 4; i++) HD.R(g, sx + hs(tx, ty, i) * 14, sy + hs(tx, ty, i + 4) * 14, 2, 1, "rgba(255,255,255,.12)");
  }
  function road(g, sx, sy, tx, ty, K) { // asfalto crepato con riga mezza cancellata
    HD.R(g, sx, sy, 16, 16, (tx + ty) % 2 ? "#4a4540" : "#524c46"); for (let i = 0; i < 4; i++) HD.R(g, sx + hs(tx, ty, i) * 14, sy + hs(tx, ty, i + 4) * 14, 3, 1, "rgba(0,0,0,.22)");
    if (hs(tx, ty, 9) < 0.18) { g.strokeStyle = "rgba(0,0,0,.45)"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(sx + 2, sy + 3); g.lineTo(sx + 8, sy + 9); g.lineTo(sx + 11, sy + 15); g.stroke(); }
    if (tx % 3 !== 0) HD.R(g, sx + 2, sy + 7, 8, 2, "rgba(230,200,120,.55)"); HD.R(g, sx, sy + 15, 16, 1, "rgba(255,230,180,.1)");
    if (K.ZX.under && (K.ZX.under[ty - 1] || [])[tx] !== ":") { HD.R(g, sx, sy, 16, 2, "rgba(214,170,100,.5)"); }
  }
  const PLK = (g, t, x, y, c) => HD.D.plaque(g, t, x, y, c);
  const glowL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  // decorazioni sopra la mappa: plachette, bagliori, aloni di calore, luci dei barili
  window.__ceDec = (z) => {
    const D = {
      ce_villaggio(g, cx, cy, d) { PLK(g, "VILLAGGIO DI ROTTAME", d.X(16), d.Y(2) + 4, "#d97706"); PLK(g, "POZZO", d.X(26) + 8, d.Y(10) - 4, "#38bdf8"); PLK(g, "BUNKER →", d.X(30), d.Y(10) - 4, "#9ca3af"); glowL(g, d.X(9) + 8, d.Y(9) + 4, 52, "255,150,50", 0.35); glowL(g, d.X(11) + 8, d.Y(9) + 4, 52, "255,150,50", 0.35); },
      ce_bunker(g, cx, cy, d) { PLK(g, "BUNKER DELLE DUNE", d.X(16), d.Y(2) + 4, "#facc15"); PLK(g, "← VILLAGGIO", d.X(2), d.Y(10) - 4); const on = Math.floor(d.fr / 30) % 2; glowL(g, d.X(28) + 8, d.Y(8) + 2, 36, "239,68,68", on ? 0.4 : 0.15); },
      ce_strada(g, cx, cy, d) { PLK(g, "LA STRADA DI POLVERE", d.X(16), d.Y(2) + 4, "#fbbf24"); PLK(g, "OASI →", d.X(30), d.Y(10) - 4, "#38bdf8"); glowL(g, d.X(18) + 8, d.Y(9) + 4, 50, "255,150,50", 0.35); },
      ce_oasi(g, cx, cy, d) { PLK(g, "L'OASI DEL POZZO", d.X(16), d.Y(2) + 4, "#38bdf8"); PLK(g, "← STRADA", d.X(2), d.Y(10) - 4); glowL(g, d.X(20) + 8, d.Y(6), 70, "160,220,255", 0.16); },
      ce_cratere(g, cx, cy, d) { PLK(g, "CRATERE DEI FUOCHI", d.X(16), d.Y(2) + 4, "#f97316"); PLK(g, "TORRE →", d.X(30), d.Y(10) - 4, "#fca5a5"); glowL(g, d.X(18) + 8, d.Y(9) + 4, 56, "255,110,30", 0.4); for (let i = 0; i < 26; i++) { const x = (i * 71 + d.fr * (0.3 + (i % 3) * 0.2)) % 340, y = 200 - ((d.fr * (0.5 + (i % 4) * 0.3) + i * 40) % 220); g.fillStyle = `rgba(255,${120 + (i % 4) * 30},40,${0.5 + 0.4 * Math.sin(d.fr / 10 + i)})`; g.fillRect(x, y, 1.6, 1.6); } },
      ce_torre(g, cx, cy, d) { PLK(g, "TORRE DEL PREDICATORE", d.X(16), d.Y(2) + 4, "#fca5a5"); PLK(g, "← CRATERE", d.X(2), d.Y(10) - 4); glowL(g, d.X(12) + 8, d.Y(9) + 4, 50, "255,150,50", 0.35); }
    };
    return D[z];
  };
  window.__ceProps = (L, z) => {
    const { lay, put } = L, row = (xs, y, ch) => xs.forEach((x) => put(x, y, ch));
    const base = { ce_villaggio: [[1, 1, 30, 1, 11, 20], [13, 18, 2, 2]], ce_bunker: [], ce_strada: [[1, 1, 30, 1, 10, 20]], ce_oasi: [[1, 1, 30, 1, 11, 20]], ce_cratere: [[1, 1, 30, 1, 10, 20]], ce_torre: [[1, 1, 30, 1, 11, 20]] }[z];
    if (z === "ce_bunker") { row([12, 18], 2, "G"); row([12, 18], 19, "G"); row([2, 3, 29, 30], 2, "J"); row([2, 30], 19, "J"); [[10, 8], [21, 8], [10, 14], [21, 14]].forEach(([x, y]) => put(x, y, "J")); return; }
    const t = base[0]; row([t[0], t[2]], t[1] + 0, "D"); row([t[0], t[2]], 20, "D"); put(t[4], t[5] - 1, "D");
    row([2, 3], 19, "J"); row([29, 30], 19, "J"); row([13, 18], 2, "G");
    row([3, 29], 8, "Y"); row([3, 29], 14, "Y");
    [[5, 9], [28, 9], [4, 13], [28, 14], [19, 19], [8, 19]].forEach(([x, y]) => put(x, y, "D")); [[12, 9], [19, 13], [26, 8], [7, 14]].forEach(([x, y]) => put(x, y, "J"));
  };

  const E = window.__sagaCore.create({
    id: "cenere",
    key: "ali-di-rondine.cenere",
    title: "Cenere e Gloria",
    icon: "🏜️",
    bg: "ce_titolo",
    chapters: 3,
    menuSub: "Dopo il crollo, un pallone ritrovato in un bunker riaccende i villaggi di rottami: razionare l'acqua, attraversare le tempeste di sabbia e scegliere tra saccheggio e speranza.",
    theme: {
      accent: "#d97706",
      ink: "#1c1208",
      paper: "rgba(254,243,214,.96)",
      font: "'Trebuchet MS', 'Segoe UI', system-ui",
      chipBg: "#fde7b8",
      chipBorder: "#b45309"
    },
    stats: {
      borraccia: [0, 9, 5, "Borracce d'acqua"],
      legami: [0, 99, 20, "Legami tra villaggi"],
      speranza: [0, 99, 15, "Speranza"]
    },
    regions: {
      villaggio: {
        grass: ["#b98c55", "#ad8049", "#c39a61"], path: ["#8a6a3e", "#7d5f36"], stone: ["#6b6258", "#5c544b"],
        wall: ["#3a2c1e", "#2e2217"], water: ["#4b6f78", "#3f6068"], tree: "#6b5a3a",
        tint: "217,119,6", tintA: 0.07, fx: "dust"
      },
      bunker: {
        grass: ["#4a4d52", "#42454a", "#52555a"], path: ["#6b6f75", "#5e6268"], stone: ["#33363b", "#2a2d31"],
        wall: ["#1c1e22", "#141619"], water: ["#2a4a52", "#223c43"], tree: "#3a3d42",
        tint: "148,163,184", tintA: 0.1, fx: "dust", dark: true
      },
      strada: {
        grass: ["#c9a265", "#bd9659", "#d3ad72"], path: ["#9b7544", "#8e6a3b"], stone: ["#7a6a55", "#6c5d4a"],
        wall: ["#4a3822", "#3d2e1b"], water: ["#4b6f78", "#3f6068"], tree: "#7a6a3e",
        tint: "234,138,38", tintA: 0.1, fx: "dust"
      },
      cratere: {
        grass: ["#8a5a3a", "#7e5033", "#94643f"], path: ["#5a3a28", "#4e3122"], stone: ["#5f5148", "#51443c"],
        wall: ["#2a1a12", "#20130d"], water: ["#7c2d12", "#9a3412"], tree: "#6b3a1a",
        tint: "220,38,38", tintA: 0.1, fx: "sparks"
      }
    },
    bonds: {
      talk: 4, per: 10, max: 5,
      names: ["Sconosciuti", "Conoscenti", "Compagni di strada", "Fidati", "Famiglia", "Inseparabili"],
      scenes: {
        ce_brace: [
          { lv: 1, id: "brace1", lines: [["ce_brace", "Sai perché conto le borracce ad alta voce? Perché mio marito le contava in silenzio, e un giorno ha smesso. Preferisco il rumore."]], reward: (K) => K.bond("legami", 4) },
          { lv: 3, id: "brace3", lines: [["ce_brace", "Se il pallone arriva intero, le do un nome. Come alle borracce. Così non si perde."]], reward: (K) => K.bond("speranza", 5) }
        ],
        ce_tamburo: [
          { lv: 1, id: "tamburo1", lines: [["ce_tamburo", "Aggiusto generatori perché i generatori non fanno domande. Con le persone è più difficile: non c'è il libretto di istruzioni."]], reward: (K) => K.bond("legami", 4) },
          { lv: 3, id: "tamburo3", lines: [["ce_tamburo", "Un giorno ti dirò quanto pesa una promessa. Ma intanto passami il cacciavite."]], reward: (K) => K.bond("speranza", 5) }
        ],
        ce_selce: [
          { lv: 1, id: "selce1", lines: [["ce_selce", "Disegno mappe perché le strade cambiano e le persone no. Mi sbaglio spesso, ma non su questo."]], reward: (K) => K.bond("legami", 4) },
          { lv: 3, id: "selce3", lines: [["ce_selce", "Ho lasciato una pagina bianca in fondo all'atlante. Se vuoi, la riempi tu."]], reward: (K) => K.bond("speranza", 5) }
        ],
        ce_predicatore: [
          { lv: 1, id: "pred1", lines: [["ce_predicatore", "Non odio il gioco. Odio quello che abbiamo fatto l'ultima volta che ci siamo divertiti. Non ero qui. Ma ci sarei stato."]], reward: (K) => K.bond("speranza", 4) }
        ]
      }
    },
    solid: "aMKUPBNWEDJGY",
    floors: ".",
    floorPaint(K, f, sx, sy, tx, ty) {
      const T = FLOORS[K.ZX.rk] || FLOORS.villaggio, fn = T[f] || T["."]; fn(K.g, sx, sy, tx, ty, Math.floor(performance.now() / 16), K); return true;
    },
    paint: {
      a(K, sx, sy, tx, ty, fr) { // recinto: lamiera ondulata, cemento del bunker o pietra della torre
        const g = K.g, id = K.ZX.id, below = (K.ZX.map[ty + 1] || [])[tx], face = below !== "a" && below !== undefined;
        if (id === "ce_bunker") {
          HD.R(g, sx, sy, 16, 16, "#2b2e33"); HD.R(g, sx, sy, 16, 1, "#4a4d52");
          if (face) { HD.R(g, sx + 1, sy + 2, 14, 12, "#3a3d42"); HD.R(g, sx + 1, sy + 12, 14, 2, "#facc15"); for (let i = 0; i < 4; i++) HD.R(g, sx + 1 + i * 4, sy + 12, 2, 2, "#111"); HD.R(g, sx + 2, sy + 4, 12, 2, "#6b6f75"); HD.R(g, sx + 2, sy + 7, 12, 1, "#1c1e22"); }
          return;
        }
        if (id === "ce_torre") {
          HD.R(g, sx, sy, 16, 16, "#4a3a34"); for (let r = 0; r < 4; r++) { HD.R(g, sx, sy + r * 4, 16, 1, "rgba(0,0,0,.35)"); const o = (r % 2) * 4 + ((tx * 3) % 4); HD.R(g, sx + o, sy + r * 4, 1, 4, "rgba(0,0,0,.3)"); HD.R(g, sx + (o + 8) % 16, sy + r * 4, 1, 4, "rgba(0,0,0,.3)"); }
          HD.R(g, sx, sy, 16, 1, "rgba(255,255,255,.12)"); if (face) HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); return;
        }
        const cols = ["#8a4a2a", "#5a6670", "#6f5a3a", "#7a3a2a"]; HD.R(g, sx, sy, 16, 16, cols[(tx * 5 + ty) % 4]);
        for (let i = 0; i < 16; i += 4) { HD.R(g, sx + i, sy, 2, 16, "rgba(255,255,255,.1)"); HD.R(g, sx + i + 2, sy, 2, 16, "rgba(0,0,0,.16)"); }
        HD.R(g, sx + hs(tx, ty, 1) * 12, sy + 4 + hs(tx, ty, 2) * 6, 4, 3, "rgba(120,50,20,.55)"); HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.28)");
        HD.R(g, sx + 2, sy + 2, 2, 2, "#2a2a2a"); HD.R(g, sx + 12, sy + 2, 2, 2, "#2a2a2a");
        if (face) { g.strokeStyle = "#1c1c1c"; g.lineWidth = 0.7; g.beginPath(); g.moveTo(sx, sy + 1); for (let i = 0; i < 4; i++) { g.lineTo(sx + i * 4 + 2, sy - 1); g.lineTo(sx + i * 4 + 4, sy + 1); } g.stroke(); }
      },
      M(K, sx, sy, tx, ty) { // mucchio di rottami
        K.ground(sx, sy, tx, ty); const g = K.g, up = !neigh(K, tx, ty - 1, "M");
        HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); HD.R(g, sx, sy + (up ? 5 : 0), 16, up ? 10 : 15, "#5c4a38");
        for (let i = 0; i < 6; i++) { const x = sx + hs(tx, ty, i) * 12, y = sy + (up ? 3 : 0) + hs(tx, ty, i + 6) * 9; HD.R(g, x, y, 5, 3, ["#9aa0a6", "#b45309", "#6b7280", "#8a6a4a", "#3a3a3a"][(i + tx) % 5]); HD.R(g, x, y, 5, 1, "rgba(255,255,255,.25)"); }
        if (up && hs(tx, ty, 14) < 0.5) { HD.C(g, sx + 8, sy + 4, 3, "#1c1917"); HD.C(g, sx + 8, sy + 4, 1.2, "#6b7280"); }
      },
      K(K, sx, sy, tx, ty) { // carcassa d'auto
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)");
        const L = !neigh(K, tx - 1, ty, "K"), Rr = !neigh(K, tx + 1, ty, "K"), up = !neigh(K, tx, ty - 1, "K");
        HD.R(g, sx, sy + (up ? 5 : 0), 16, up ? 8 : 13, "#7c3a1f"); HD.R(g, sx, sy + (up ? 5 : 0), 16, 1, "#b4532a");
        if (up) { HD.R(g, sx + 3, sy + 1, 11, 5, "#5a2a15"); HD.R(g, sx + 4, sy + 2, 9, 3, "#2a3a44"); HD.R(g, sx + 8, sy + 2, 1, 3, "#5a2a15"); }
        HD.R(g, sx + 2, sy + 8, 4, 2, "rgba(0,0,0,.25)"); HD.R(g, sx + 9, sy + 9, 5, 2, "rgba(120,60,20,.7)");
        if (!up) { HD.C(g, sx + 4, sy + 13, 2.6, "#1c1917"); HD.C(g, sx + 12, sy + 13, 2.6, "#1c1917"); HD.C(g, sx + 4, sy + 13, 1, "#6b7280"); HD.C(g, sx + 12, sy + 13, 1, "#6b7280"); }
        if (L) HD.R(g, sx, sy, 1, 16, "rgba(0,0,0,.25)"); if (Rr) HD.R(g, sx + 15, sy, 1, 16, "rgba(0,0,0,.25)");
      },
      U(K, sx, sy, tx, ty) { // tenda di tela e lamiera
        K.ground(sx, sy, tx, ty); const g = K.g, up = !neigh(K, tx, ty - 1, "U"), dn = !neigh(K, tx, ty + 1, "U"), l = !neigh(K, tx - 1, ty, "U"), r = !neigh(K, tx + 1, ty, "U");
        const col = [["#b45309", "#f1e2b8"], ["#7a3a2a", "#d9c9a0"], ["#3a5a6a", "#cbd5d0"]][Math.floor(tx / 4) % 3];
        if (up) { for (let i = 0; i < 16; i += 4) { HD.R(g, sx + i, sy + 2, 2, 10, col[0]); HD.R(g, sx + i + 2, sy + 2, 2, 10, col[1]); } HD.R(g, sx, sy + 12, 16, 2, "rgba(0,0,0,.3)"); HD.R(g, sx, sy + 2, 16, 1, "rgba(255,255,255,.3)"); HD.R(g, sx, sy + 14, 16, 2, "#3a2c1e"); }
        else { HD.R(g, sx, sy, 16, 16, "#8b7355"); for (let i = 0; i < 16; i += 5) HD.R(g, sx + i, sy, 1, 16, "rgba(0,0,0,.14)"); HD.R(g, sx + 3, sy + 4, 5, 4, "#a8895a"); HD.R(g, sx + 9, sy + 9, 5, 4, "#7a6240"); }
        if (dn) { HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); if (tx % 4 === 1 || tx % 4 === 2) { HD.R(g, sx + 4, sy + 6, 8, 10, "#2a1f15"); HD.R(g, sx + 4, sy + 6, 8, 1, "#e0b060"); } }
        if (l) HD.R(g, sx, sy, 1, 16, "rgba(0,0,0,.3)"); if (r) HD.R(g, sx + 15, sy, 1, 16, "rgba(0,0,0,.3)");
      },
      D(K, sx, sy, tx, ty) { // albero secco
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 3, sy + 13, 10, 3, "rgba(0,0,0,.25)");
        g.strokeStyle = "#3a2a1c"; g.lineWidth = 3; g.beginPath(); g.moveTo(sx + 8, sy + 15); g.quadraticCurveTo(sx + 6, sy + 8, sx + 8, sy + 2); g.stroke();
        K.later((gg, cx, cy) => { const x = tx * 16 - cx + 8, y = ty * 16 - cy; gg.strokeStyle = "#3a2a1c"; gg.lineWidth = 1.6; [[-9, -10], [8, -12], [-5, -17], [4, -19]].forEach(([dx, dy]) => { gg.beginPath(); gg.moveTo(x, y + 4); gg.quadraticCurveTo(x + dx * 0.4, y + dy * 0.5, x + dx, y + dy); gg.stroke(); gg.beginPath(); gg.moveTo(x + dx * 0.6, y + dy * 0.6); gg.lineTo(x + dx * 0.6 + (dx > 0 ? 4 : -4), y + dy * 0.6 - 4); gg.stroke(); }); });
      },
      J(K, sx, sy, tx, ty) { // casse e taniche
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 1, sy + 13, 14, 2, "rgba(0,0,0,.3)");
        HD.R(g, sx + 1, sy + 6, 9, 8, "#7a5a32"); HD.R(g, sx + 1, sy + 6, 9, 1, "#a8844a"); HD.R(g, sx + 1, sy + 9, 9, 1, "#4a3420"); HD.R(g, sx + 5, sy + 6, 1, 8, "#4a3420");
        HD.R(g, sx + 10, sy + 5, 5, 9, "#b91c1c"); HD.R(g, sx + 11, sy + 3, 2, 2, "#7f1d1d"); HD.R(g, sx + 10, sy + 8, 5, 1, "#7f1d1d"); HD.R(g, sx + 11, sy + 5, 1, 8, "rgba(255,255,255,.22)");
      },
      G(K, sx, sy, tx, ty, fr) { // generatore
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 1, sy + 13, 14, 2, "rgba(0,0,0,.3)");
        HD.R(g, sx + 1, sy + 4, 14, 10, "#4b5563"); HD.R(g, sx + 1, sy + 4, 14, 2, "#6b7280"); HD.R(g, sx + 3, sy + 8, 6, 4, "#1f2937"); for (let i = 0; i < 3; i++) HD.R(g, sx + 3, sy + 8 + i * 1.5, 6, 0.6, "#4b5563");
        HD.R(g, sx + 11, sy + 1, 2, 4, "#374151"); const on = Math.floor(fr / 30 + tx) % 2; HD.C(g, sx + 12, sy + 9, 1.4, on ? "#22c55e" : "#14532d"); if (on) K.light(sx + 12, sy + 9, 16, "34,197,94", 0.35);
        HD.R(g, sx + 11.5, sy - 2 - (fr / 5 % 3), 1.5, 1.5, "rgba(200,200,200,.35)");
      },
      Y(K, sx, sy, tx, ty, fr) { // palo con stendardo strappato
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 4, sy + 14, 8, 2, "rgba(0,0,0,.25)"); HD.R(g, sx + 7, sy + 1, 2, 14, "#5a4630");
        const w = Math.sin(fr / 12 + tx) * 1.5; g.fillStyle = "#b91c1c"; g.beginPath(); g.moveTo(sx + 9, sy + 2); g.lineTo(sx + 16 + w, sy + 4); g.lineTo(sx + 14 + w, sy + 6); g.lineTo(sx + 16 + w, sy + 9); g.lineTo(sx + 9, sy + 8); g.fill(); HD.R(g, sx + 10, sy + 5, 3, 1, "#fde68a");
      },
      P(K, sx, sy, tx, ty, fr) { // pozzo
        const g = K.g;
        g.fillStyle = "#6b6258"; g.fillRect(sx + 2, sy + 4, 12, 11);
        g.fillStyle = "#1e3a44"; g.fillRect(sx + 4, sy + 6, 8, 5);
        g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(sx + 5 + Math.sin(fr / 14 + tx) * 1.5, sy + 7, 3, 1);
        g.fillStyle = "#3a2c1e"; g.fillRect(sx + 2, sy + 1, 12, 2);
      },
      B(K, sx, sy, tx, ty, fr) { // barile di fuoco
        const g = K.g;
        g.fillStyle = "#4b5563"; g.fillRect(sx + 3, sy + 6, 10, 9);
        g.fillStyle = "#f97316"; g.beginPath(); g.arc(sx + 8 + Math.sin(fr / 5 + tx) * 0.8, sy + 5, 3.4, 0, 7); g.fill();
        g.fillStyle = "#fde047"; g.beginPath(); g.arc(sx + 8, sy + 5.5, 1.6, 0, 7); g.fill();
      },
      N(K, sx, sy, tx, ty, fr) { // antenna radio
        const g = K.g;
        g.fillStyle = "#6b7280"; g.fillRect(sx + 7, sy + 2, 2, 13);
        g.fillStyle = "#9ca3af"; g.fillRect(sx + 3, sy + 5, 10, 1); g.fillRect(sx + 4, sy + 9, 8, 1);
        g.fillStyle = Math.floor(fr / 20) % 2 ? "#ef4444" : "#7f1d1d"; g.fillRect(sx + 7, sy + 1, 2, 2);
      },
      W(K, sx, sy, tx, ty, fr) { // pozza d'acqua
        const g = K.g;
        g.fillStyle = "#2f6f86"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(255,255,255,.28)"; g.fillRect(sx + 2 + Math.sin(fr / 18 + tx) * 2, sy + 4, 8, 1); g.fillRect(sx + 6, sy + 10, 8, 1);
      },
      E(K, sx, sy) { // portello del bunker
        const g = K.g;
        g.fillStyle = "#374151"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#6b7280"; g.fillRect(sx + 1, sy + 1, 14, 14);
        g.fillStyle = "#facc15"; for (let i = 0; i < 4; i++) g.fillRect(sx + 1 + i * 4, sy + 12, 2, 3);
        g.fillStyle = "#111827"; g.fillRect(sx + 6, sy + 5, 4, 4);
      }
    },
    act: { D: "Guarda l'albero secco", J: "Guarda le casse", G: "Guarda il generatore", Y: "Guarda lo stendardo", q: "Entra", P: "Guarda il pozzo", B: "Scalda le mani", N: "Ascolta la radio", E: "Esamina il portello", W: "Guarda la pozza" },
    travel: true,
    item: ["Rottame Prezioso", "Rottami Preziosi"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.2);
      g.fillStyle = "#9aa0a6"; g.beginPath(); g.moveTo(-5, 3); g.lineTo(-2, -5); g.lineTo(4, -4); g.lineTo(6, 3); g.closePath(); g.fill();
      g.strokeStyle = "#fbbf24"; g.lineWidth = 1; g.stroke();
      g.fillStyle = "#b45309"; g.fillRect(-2, -1, 4, 3);
      g.restore();
    },
    // acqua da razionare: la prima volta che entri in una zona all'aperto bevi una borraccia
    plugins: [{
      enter(zid, spec, K) {
        if (!OUTDOOR[zid] || K.F.get("ce_paid_" + zid)) return;
        K.F.set("ce_paid_" + zid, true);
        const b = K.stat("borraccia");
        if (b > 0) { K.bond("borraccia", -1); if (window.toast) window.toast(`Borracce: ${b - 1}/9`, "info", "💧"); }
        else if (window.toast) window.toast("Borracce finite. La sete pesa sulle gambe.", "warn", "🏜️");
      }
    }],
    // tempesta di sabbia in esplorazione
    mood(g, fr, K) {
      const z = K.api && K.api.trZone && K.api.trZone();
      if (!OUTDOOR[z]) return;
      const k = 0.5 + 0.5 * Math.sin(fr / 120);
      g.save();
      g.fillStyle = `rgba(214,160,90,${0.06 + k * 0.1})`; g.fillRect(0, 0, 4000, 4000);
      g.strokeStyle = `rgba(240,200,140,${0.2 + k * 0.25})`; g.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        const y = (i * 53 + fr * (1.5 + (i % 5) * 0.4)) % 600, x = (i * 97 + fr * 3.2) % 900;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + 14, y + 1.5); g.stroke();
      }
      g.restore();
    },
    stadium: {
      azPitch: "fondale",
      cageField: 2,
      cageMut: "rubber",
      weather: "clear",
      venue: {
        ads: [
          ["VILLAGGIO DI LAMIERA · CASA", "#d97706"],
          ["ACQUA: UN SORSO A TESTA", "#38bdf8"],
          ["STRADA DI POLVERE · KM 0", "#fbbf24"],
          ["IL PALLONE È DI TUTTI", "#f87171"]
        ],
        crowd: ["#7a5a3a", "#b45309", "#374151", "#9a7b4f", "#4b3621"],
        ground: ["#9b7544", "#8a6636"],
        wall: ["#3a2c1e", "#2a1f15"],
        line: "rgba(254,243,214,.7)",
        sky: ["#3b2a1a", "#c9803a"],
        fx: { fr: 0.93, spd: 1.0, wind: 0.5 }
      }
    },
    guest: {
      id: "ce_tamburo",
      lines: [
        "Ehi, Campione! Ho portato una borraccia. Qui al mare l'acqua c'è, ma vecchie abitudini.",
        "Giù da noi i villaggi si scambiano ancora il pallone. Nessuno saccheggia più il bunker.",
        "Cenere ha messo su peso. Dorme sulla radio e pretende il turno di notte.",
        "Se passi dal Cratere, saluta. E non dimenticare la regola: un sorso a testa."
      ]
    },
    endings: {
      pace: ["La Pace dei Villaggi", "Il pallone passa di mano in mano. Ogni villaggio ha il suo campo, e l'acqua del Pozzo viene divisa a turno.", "Dividi il pallone tra i villaggi."],
      solitaria: ["La Strada Solitaria", "Lasci i villaggi alle loro scelte e riprendi la strada con il pallone sotto il braccio. Qualcuno ti saluta ancora dall'orizzonte.", "Riprendi la strada da solo."],
      reliquia: ["La Reliquia", "Il pallone resta nella Torre, custodito come un oggetto sacro. Il Predicatore ha vinto un'idea, non una partita.", "Lascia il pallone nella Torre."],
      segreto: ["Cenere e Gloria", "Finale segreto: i legami, la speranza e l'acqua risparmiata aprono la strada dell'antico campo sotto il cratere. Dalla cenere spunta il primo prato.", "Fidati di tutti, fino in fondo."]
    }
  });

  const K = E.K;

  // Ritratti
  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);
    K.cast("ce_brace", {
      name: "Vedova Brace", sub: "Capovillaggio di Rottame", style: "bun", hair: "#9ca3af", eye: "#44403c", skin: "#d6a67a", shirt: "#7c2d12",
      acc: ["sciarpa"], bg: ["#7c2d12", "#1c1208"]
    }, "Guida il Villaggio di Rottame da quando il pozzo ha smesso di dare acqua buona. Dura nei modi, equa nelle razioni. Non ha mai perso un compito, e sa che il pallone potrebbe essere l'unico modo di non perdere anche le persone.");
    K.cast("ce_tamburo", {
      name: "Tamburo", sub: "Meccanico, ex saccheggiatore", style: "messy", hair: "#44403c", eye: "#0f172a", skin: "#e0b08a", shirt: "#4b5563",
      acc: ["occhiali"], scar: true, bg: ["#4b5563", "#111827"]
    }, "Ragazzo che aggiusta qualsiasi cosa con due fili e tanta ostinazione. Un tempo faceva parte di una banda di saccheggiatori; ora paga il debito riparando generatori. Parla a voce bassa, ascolta sempre.");
    K.cast("ce_selce", {
      name: "Dottoressa Selce", sub: "Cartografa", style: "bob", hair: "#1c1917", eye: "#047857", skin: "#c68c5b", shirt: "#0f766e",
      acc: ["occhiali", "cuffie"], bg: ["#0f766e", "#022c22"]
    }, "Disegna mappe che nessun altro sa leggere: pozzi, tempeste, strade che esistono solo nella sua testa. Calma, precisa, con un'ironia asciutta che esce solo quando è stanca.");
    K.cast("ce_predicatore", {
      name: "Predicatore delle Dune", sub: "Custode della Torre", style: "long", hair: "#d1d5db", eye: "#b45309", skin: "#b9835a", shirt: "#78350f",
      beard: "folta", acc: ["bandana"], bg: ["#78350f", "#1c1208"]
    }, "Predica da vent'anni che il pallone sia un dono da custodire, non da giocare. Ha una ragione comprensibile per credere quello che crede, e un modo di dirlo che raramente lascia indifferenti.");
    K.cast("ce_dente", {
      name: "Dente", sub: "Capobanda dei Saccheggiatori", style: "cresta", hair: "#7f1d1d", eye: "#111827", skin: "#d49a6a", shirt: "#292524",
      scar: true, acc: ["fascia"], bg: ["#292524", "#7f1d1d"]
    }, "Capo di una banda di saccheggiatori di lamiera. Sorride poco e mostra il dente d'oro che gli ha dato il nome. Vuole il pallone perché crede che valga più di un pozzo.");
    K.cast("ce_cenere", {
      name: "Cenere", sub: "Gatta del bunker", shape: "gatto", skin: "#6b7280", shirt: "#374151", eye: "#fde047", hair: "#4b5563", bg: ["#374151", "#111827"]
    }, "Gatta grigia nata nel bunker. Segue chi ha il pallone, dorme sulla radio e conosce ogni corridoio meglio di chiunque altro.");
  }
  casts();

  window.__cenere = E.api;
  window.__cenereCore = E;

  // Sfondi animati (usati da bg-scenarios.js): villaggio, bunker, strada/oasi, cratere/torre
  const sand = (g, W, H, f, a) => {
    g.strokeStyle = `rgba(240,200,140,${a})`; g.lineWidth = 1;
    for (let i = 0; i < 26; i++) { const y = (i * 41 + f * (1 + (i % 4) * 0.5)) % H, x = (i * 67 + f * 3) % (W + 20); g.beginPath(); g.moveTo(x - 20, y); g.lineTo(x, y + 1); g.stroke(); }
  };
  window.__ceDraw = {
    Villaggio(g, W, H, f) {
      const sky = g.createLinearGradient(0, 0, 0, H * 0.6); sky.addColorStop(0, "#5a3a1f"); sky.addColorStop(1, "#e0a458");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(255,226,160,.7)"; g.beginPath(); g.arc(W * 0.78, 52, 20, 0, 7); g.fill();
      g.fillStyle = "#7a4a26"; g.beginPath(); g.moveTo(0, H * 0.62); for (let x = 0; x <= W; x += 20) g.lineTo(x, H * 0.62 - 12 * Math.sin(x * 0.03 + 1)); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      g.fillStyle = "#b98c55"; g.fillRect(0, H * 0.68, W, H);
      // baracche di lamiera
      [[40, 0.5, 60], [120, 0.55, 48], [220, 0.5, 70], [290, 0.56, 44]].forEach(([x, y, w], i) => {
        const yy = H * y; g.fillStyle = i % 2 ? "#6b5640" : "#8b6a46"; g.fillRect(x, yy, w, H * 0.68 - yy);
        g.fillStyle = "#4a3a2a"; g.fillRect(x - 3, yy - 5, w + 6, 6);
        g.fillStyle = "#facc15"; if (Math.floor(f / 40 + i) % 3) g.fillRect(x + 8, yy + 10, 8, 8);
      });
      // fumo del barile
      g.fillStyle = "#f97316"; g.beginPath(); g.arc(W * 0.5, H * 0.74, 6 + Math.sin(f / 5) * 1.5, 0, 7); g.fill();
      g.fillStyle = "rgba(60,50,40,.35)"; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(W * 0.5 + Math.sin(f / 30 + i) * 6, H * 0.7 - i * 12, 5 + i, 0, 7); g.fill(); }
      sand(g, W, H, f, 0.18);
    },
    Bunker(g, W, H, f) {
      g.fillStyle = "#171a1f"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#2a2f36"; for (let y = 0; y < H; y += 24) g.fillRect(0, y, W, 2);
      g.fillStyle = "#111418"; g.fillRect(0, H * 0.72, W, H);
      // portellone
      g.fillStyle = "#3f4650"; g.fillRect(W * 0.38, H * 0.18, W * 0.24, H * 0.54);
      g.fillStyle = "#6b7280"; g.beginPath(); g.arc(W * 0.5, H * 0.45, 24, 0, 7); g.fill();
      g.fillStyle = "#111827"; g.beginPath(); g.arc(W * 0.5, H * 0.45, 12, 0, 7); g.fill();
      g.fillStyle = "#facc15"; for (let i = 0; i < 6; i++) g.fillRect(W * 0.38 + i * (W * 0.04), H * 0.66, W * 0.02, 8);
      // luce lampeggiante
      g.fillStyle = Math.floor(f / 30) % 2 ? "rgba(239,68,68,.9)" : "rgba(127,29,29,.9)"; g.beginPath(); g.arc(W * 0.12, H * 0.2, 6, 0, 7); g.fill();
      const cone = g.createRadialGradient(W * 0.12, H * 0.2, 2, W * 0.12, H * 0.2, 90); cone.addColorStop(0, "rgba(239,68,68,.25)"); cone.addColorStop(1, "rgba(239,68,68,0)"); g.fillStyle = cone; g.fillRect(0, 0, W, H);
      // pallone sullo scaffale
      g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(W * 0.84, H * 0.58 + Math.sin(f / 30) * 1.5, 9, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 1; g.stroke();
      g.fillStyle = "#3f4650"; g.fillRect(W * 0.76, H * 0.64, 40, 4);
    },
    Strada(g, W, H, f) {
      const sky = g.createLinearGradient(0, 0, 0, H * 0.6); sky.addColorStop(0, "#7a4a22"); sky.addColorStop(1, "#f0c27a");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(255,240,200,.6)"; g.beginPath(); g.arc(W * 0.2, 56, 24, 0, 7); g.fill();
      [0.6, 0.66, 0.72].forEach((y, i) => { g.fillStyle = ["#a97b44", "#c79a5a", "#d9b377"][i]; g.beginPath(); g.moveTo(0, H * y); for (let x = 0; x <= W; x += 20) g.lineTo(x, H * y - (10 + i * 4) * Math.sin(x * 0.02 + i * 2)); g.lineTo(W, H); g.lineTo(0, H); g.fill(); });
      // strada
      g.fillStyle = "#8e6a3b"; g.beginPath(); g.moveTo(W * 0.42, H * 0.62); g.lineTo(W * 0.58, H * 0.62); g.lineTo(W * 0.9, H); g.lineTo(W * 0.1, H); g.fill();
      g.strokeStyle = "#e9d8a6"; g.setLineDash([8, 10]); g.lineWidth = 2; g.beginPath(); g.moveTo(W * 0.5, H * 0.62); g.lineTo(W * 0.5, H); g.stroke(); g.setLineDash([]);
      // cartello e carcassa
      g.fillStyle = "#5c4a38"; g.fillRect(W * 0.18, H * 0.5, 3, 40); g.fillStyle = "#c2410c"; g.fillRect(W * 0.1, H * 0.46, 40, 14);
      g.fillStyle = "#7c3a1f"; g.fillRect(W * 0.72, H * 0.64, 50, 18); g.fillStyle = "#1c1917"; g.beginPath(); g.arc(W * 0.74, H * 0.7, 6, 0, 7); g.arc(W * 0.82, H * 0.7, 6, 0, 7); g.fill();
      sand(g, W, H, f, 0.3);
    },
    Cratere(g, W, H, f) {
      const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#2a0f0a"); sky.addColorStop(0.6, "#7c2d12"); sky.addColorStop(1, "#1c0a06");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = "#2a1a12"; g.beginPath(); g.moveTo(0, H * 0.4); g.lineTo(W * 0.3, H * 0.62); g.lineTo(W * 0.7, H * 0.62); g.lineTo(W, H * 0.4); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      // braci sul fondo
      g.fillStyle = "#b91c1c"; g.beginPath(); g.ellipse(W * 0.5, H * 0.78, 80, 14, 0, 0, 7); g.fill();
      g.fillStyle = "#f97316"; g.beginPath(); g.ellipse(W * 0.5, H * 0.78, 50 + Math.sin(f / 15) * 4, 8, 0, 0, 7); g.fill();
      // torre del Predicatore
      g.fillStyle = "#4a3a2a"; g.fillRect(W * 0.76, H * 0.22, 24, H * 0.46); g.fillStyle = "#6b5640"; g.fillRect(W * 0.74, H * 0.2, 28, 8);
      g.fillStyle = "#facc15"; g.fillRect(W * 0.76 + 8, H * 0.3, 8, 8);
      // scintille
      for (let i = 0; i < 18; i++) { const x = (i * 71 + f * 0.5) % W, y = H - ((i * 37 + f * (0.8 + (i % 3) * 0.4)) % (H * 0.7)); g.fillStyle = `rgba(253,186,116,${0.2 + (i % 4) * 0.12})`; g.fillRect(x, y, 2, 2); }
    }
  };
})();
