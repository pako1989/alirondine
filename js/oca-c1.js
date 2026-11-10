// js/oca-c1.js - «IL GIOCO DELL'OCA DEL CONTE» · Capitolo 1: Il Testamento
// Arrivi a Villa Pastrocchi per la lettura del testamento: la villa va a chi vince l'ultima partita del Conte, un gioco dell'oca di 63 caselle dipinto sul viale.
// Tu sei il «giocatore neutrale». Conosci gli eredi (salone, cucina, serra, fontana, labirinto, pozzo), Teo il giardiniere ti dà un santino; poi la prima tirata, dalla 0 alla Locanda (19).
// Zone: il parco (44x32: villa con facciata e tetto, il tabellone sul viale, fontana, labirinto di siepi, pozzo, serra, ruscello col ponte, capanno, cappella),
// salone (18x11), cucina (14x9), serra (14x10), capanno di Teo (9x7). Espone window.__ocaZ.parco e gli interni comuni, riusati dai capitoli successivi.
(function () {
  "use strict";
  const BOARD = [18, 9], FONT = [21, 21];
  window.__ocaBoardAt = BOARD; window.__ocaFontAt = FONT;
  // il labirinto di siepi (x 32..42, y 9..16): S siepe, . ghiaia, x cassetta
  const MAZE = ["SSSSSSSSSSS", "S...S.....S", "S.S.S.SSS.S", "..S...S...S", "S.SSSSS.S.S", "S.....S.S.S", "SSSS.....xS", "SSSSSSSSSSS"];
  function goose(g, x, y, f, k, flip) {
    g.save(); g.translate(x, y); if (flip) g.scale(-1, 1); const b = Math.sin(f / 6 + k);
    g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(0, 6, 6, 2, 0, 0, 7); g.fill(); g.fillStyle = "#f8fafc"; g.beginPath(); g.ellipse(0, 1, 6, 4.4, 0, 0, 7); g.fill(); g.fillStyle = "#e2e8f0"; g.beginPath(); g.ellipse(-2, 2, 3.4, 2.4, 0.3, 0, 7); g.fill();
    g.strokeStyle = "#f8fafc"; g.lineWidth = 2.2; g.beginPath(); g.moveTo(3, 0); g.quadraticCurveTo(6, -3, 5, -7 + b * 0.6); g.stroke(); g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(5.5, -7 + b * 0.6, 2, 0, 7); g.fill(); g.fillStyle = "#f59e0b"; g.fillRect(7, -7.5 + b * 0.6, 2.6, 1.4); g.fillStyle = "#111"; g.fillRect(5.6, -8.4 + b * 0.6, 1, 1);
    g.fillStyle = "#f59e0b"; g.fillRect(-2, 5, 1, 2 + (f % 12 < 6 ? 1 : 0)); g.fillRect(1, 5, 1, 2 + (f % 12 < 6 ? 0 : 1)); g.restore();
  }
  window.__ocaZ = {
    goose, BOARD, FONT,
    // IL PARCO: o = { region, time, start, items, loot, extra: [[x, y, ch]], doors, act, flavor, intro, decor, cantina, cappella }
    parco(H, npcs, o) {
      o = o || {};
      return {
        region: o.region || "parco", name: "Il parco di Villa Pastrocchi", short: "Il parco", sub: "La villa, il tabellone sul viale, il labirinto e le oche", bg: o.bg || "oc_parco", time: o.time || "giorno", w: 44, h: 32, base: ",", start: o.start || [21, 29], travel: [21, 17],
        itemCos: o.itemCos, items: o.items || [],
        loot: Object.assign({
          "41,15": { id: "oc_dado", text: "Nella cassetta al centro del labirinto, sotto un biglietto («Bravo. Adesso esci, se ci riesci»), c'è un dado d'avorio.", empty: "La cassetta è vuota. Il biglietto dice ancora «Bravo»." },
          "8,12": { id: "oc_dado", text: "Tiri su il secchio del pozzo. Dentro, tra le monetine, c'è un dado d'avorio. Il Conte le ripescava, le monetine. Il dado ce l'ha lasciato.", empty: "Il secchio risale con due monetine e una rana offesa." },
          "6,30": { id: "oc_dado", text: "Nella cassetta degli attrezzi, sotto il ponte, avvolto in uno straccio: un dado d'avorio. Lo straccio ha le iniziali «U.P.».", empty: "Solo attrezzi arrugginiti e lo straccio con le iniziali." },
          "16,6": { id: "oc_rosmarino", text: "Tra i vasi di limoni qualcuno ha piantato un cespuglio di rosmarino. Ne cogli un rametto.", empty: "Il rosmarino ricrescerà. Il Conte diceva che ricresce tutto, tranne i capelli." }
        }, o.loot || {}),
        areas: [[12, 1, 31, 7, "La villa"], [18, 9, 26, 15, "Il tabellone"], [32, 9, 42, 16, "Il labirinto"], [19, 20, 24, 23, "La fontana"], [2, 21, 9, 24, "La serra"], [0, 27, 17, 30, "Il ruscello"], [33, 22, 39, 27, "La cappella"], [5, 10, 11, 14, "Il pozzo"], [0, 0, 43, 31, "Il parco"]],
        act: Object.assign({ J: "Guarda i vasi", x: "Apri la cassetta", n: "Leggi il cartello", s: "Siediti sulla panchina", l: "Guarda il lampione" }, o.act || {}),
        flavor: Object.assign({ n: "Un cartello di legno: «VIETATO CALPESTARE LE CASELLE CON LE SCARPE DA CALCIO. Ordine del Conte.» Sotto, a matita: «tranne il giovedì».", b: "Una panchina di ferro battuto. Sullo schienale qualcuno ha inciso: «U. + L. 1969».", l: "Un lampione a gas convertito a corrente. Il Conte non si è mai fidato della corrente." }, o.flavor || {}),
        doors: Object.assign({
          "14,5": { to: "oc_cucina", at: [7, 7] }, "21,5": { to: "oc_salone", at: [9, 9] }, "22,5": { to: "oc_salone", at: [9, 9] },
          "29,5": o.cantina || { to: "oc_cantina", at: [8, 8], locked: () => "La porta della cantina è chiusa con un lucchetto a combinazione. Sopra, un biglietto: «la combinazione è la casella della Locanda». Ci si torna più avanti.", text: "La cantina è chiusa. Per ora." },
          "5,24": { to: "oc_serra", at: [7, 8] }, "13,24": { to: "oc_capanno", at: [4, 5] },
          "35,26": o.cappella || { to: "oc_cappella", at: [6, 8], locked: () => "La cappella di famiglia. La porta è chiusa da dentro. Dal buco della serratura si vede una candela accesa.", text: "La cappella è chiusa." }
        }, o.doors || {}),
        npcs, intro: o.intro, onEnter: o.onEnter,
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 43, 0, "Y"); lay(0, 1, 0, 30, "S"); lay(43, 1, 43, 30, "S"); lay(0, 31, 43, 31, "S");
          // la villa: tetto, facciata, porte, terrazza con le colonne e i limoni
          lay(12, 1, 31, 2, "R"); lay(12, 3, 31, 5, "V"); put(14, 5, "q"); put(21, 5, "q"); put(22, 5, "q"); put(29, 5, "q");
          lay(11, 6, 32, 6, "+"); lay(19, 7, 24, 7, "+"); put(11, 6, "p"); put(32, 6, "p"); put(16, 6, "J"); put(27, 6, "J"); put(18, 6, "J"); put(25, 6, "J");
          // i viali di ghiaia
          lay(20, 8, 23, 30, "C"); lay(2, 18, 41, 19, "C"); lay(20, 31, 23, 31, "C");
          // il tabellone sul viale (9×7 caselle)
          lay(BOARD[0], BOARD[1], BOARD[0] + 8, BOARD[1] + 6, "K");
          put(17, 8, "l"); put(27, 8, "l"); put(19, 27, "l"); put(24, 27, "l"); put(17, 16, "n");
          // la fontana dell'oca, le statue, le panchine, i cipressi
          lay(19, 20, 24, 23, "C"); lay(FONT[0], FONT[1], FONT[0] + 1, FONT[1] + 1, "F"); put(17, 21, "N"); put(26, 21, "N"); put(19, 25, "b"); put(24, 25, "b");
          [[18, 26], [18, 29], [25, 26], [25, 29], [2, 2], [9, 2], [34, 2], [41, 2], [2, 8], [41, 20], [41, 25], [30, 29], [36, 30]].forEach(([x, y]) => put(x, y, "Y"));
          // il pozzo
          lay(6, 11, 10, 13, "C"); put(8, 12, "P");
          // il labirinto di siepi
          MAZE.forEach((row, j) => row.split("").forEach((c, i) => put(32 + i, 9 + j, c === "S" ? "S" : c === "x" ? "x" : "C")));
          // la serra e il capanno di Teo
          lay(2, 21, 9, 24, "E"); put(5, 24, "q");
          house(11, 22, 5, 3, { door: [13, 24], roof: "#78350f", wall: "#a16207", chimney: true });
          // il ruscello col ponte di legno, e la riva di là
          lay(1, 27, 17, 28, "w"); lay(9, 27, 10, 28, "="); lay(1, 29, 17, 30, ";"); lay(5, 29, 8, 30, ","); put(6, 30, "x");
          // la cappella di famiglia
          house(33, 22, 6, 5, { door: [35, 26], roof: "#57534e", wall: "#d6d3d1" }); lay(34, 27, 37, 27, "C");
          // aiuole
          lay(3, 15, 7, 16, ";"); lay(36, 18, 40, 19, "C"); lay(28, 22, 31, 24, ";"); lay(12, 9, 15, 10, ";");
          (o.extra || []).forEach(([x, y, c]) => put(x, y, c));
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(), T = window.__tabellone;
          // i numeri e i segni delle caselle sul tabellone del viale
          if (T) { g.save(); g.textAlign = "center"; for (let j = 0; j < 7; j++) for (let i = 0; i < 9; i++) { const n = T.SPI[i + "," + j], k = n && T.BASE[n] ? T.BASE[n].k : "", x = d.X(BOARD[0] + i) + 8, y = d.Y(BOARD[1] + j) + 8;
            g.fillStyle = k === "morte" ? "#f5f5f4" : "#57432a"; g.font = "800 6px system-ui"; g.fillText(String(n), x, y + 2);
            if (k === "oca") { g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.arc(x + 5, y + 4, 1.6, 0, 7); g.fill(); } else if (k && k !== "fine") { g.fillStyle = { ponte: "#a16207", locanda: "#b91c1c", pozzo: "#0369a1", labirinto: "#166534", prigione: "#44403c", morte: "#1c1917", rigore: "#16a34a", punizione: "#16a34a", dribbling: "#16a34a", trappola: "#78350f", scambio: "#7c3aed", carta: "#d97706" }[k] || "#57432a"; g.fillRect(x + 3, y + 3, 3, 3); } } g.restore(); }
          // lo zampillo della fontana
          const fx = d.X(FONT[0] + 1), fy = d.Y(FONT[1] + 1); g.fillStyle = "#78716c"; g.fillRect(fx - 2, fy - 8, 4, 8); g.fillStyle = "#f8fafc"; g.beginPath(); g.ellipse(fx, fy - 10, 4, 3, 0, 0, 7); g.fill(); g.fillStyle = "#f59e0b"; g.fillRect(fx + 3, fy - 11, 3, 1.5);
          for (let i = 0; i < 10; i++) { const t = ((f * 1.2 + i * 9) % 50) / 50, a = (i / 10) * 6.28; g.fillStyle = `rgba(186,230,253,${0.9 - t * 0.7})`; g.beginPath(); g.arc(fx + 6 + Math.cos(a) * t * 12, fy - 10 - Math.sin(t * Math.PI) * 10 + t * 8, 1.2, 0, 7); g.fill(); }
          // le oche del parco: una famiglia intorno alla fontana, due sul ruscello, una che attraversa il tabellone
          const fam = [[0, 0], [8, 3], [14, 5], [19, 6]]; fam.forEach(([ox, oy], k) => { const a = f / 140 + k * 0.25, gx = d.X(FONT[0] + 1) + Math.cos(a) * 46 - ox * 0.2, gy = d.Y(FONT[1] + 1) + Math.sin(a) * 34 + oy * 0.2; goose(g, gx, gy, f, k, Math.sin(a) > 0); });
          [0, 1].forEach((k) => { const t = ((f * 0.25 + k * 120) % 300) / 300, gx = d.X(1) + t * 16 * 16, gy = d.Y(27) + 10 + k * 8 + Math.sin(f / 30 + k) * 2; goose(g, gx, gy, f, k + 5, false); g.strokeStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.arc(gx - 6, gy + 5, 4, 0.2, 2.9); g.stroke(); });
          { const t = ((f * 0.3) % 600) / 600, gx = d.X(BOARD[0] - 2) + t * 13 * 16, gy = d.Y(BOARD[1] + 3) + 6 + Math.sin(f / 10) * 2; goose(g, gx, gy, f, 9, false); }
          H.plaque(g, "VILLA PASTROCCHI", d.X(22), d.Y(3) + 4, "#fbbf24"); H.plaque(g, "IL TABELLONE · 63 CASELLE", d.X(22), d.Y(9) - 4, "#fde68a"); H.plaque(g, "LABIRINTO", d.X(37) + 8, d.Y(9) - 4, "#86efac");
          H.plaque(g, "SERRA", d.X(6), d.Y(21) - 4, "#bae6fd"); H.plaque(g, "CAPPELLA", d.X(36), d.Y(22) - 4, "#e9d5ff"); H.plaque(g, "POZZO", d.X(8) + 8, d.Y(11) - 4, "#bae6fd"); H.plaque(g, "CANCELLO ▾", d.X(22), d.Y(31) + 6, "#fde68a");
          if (o.decor) o.decor(g, cx, cy, d, f);
        }
      };
    },
    salone(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "interno", name: "Il salone del testamento", short: "Salone", sub: "Il lungo tavolo, il camino, il ritratto del Conte", bg: o.bg || "oc_salone", w: 18, h: 11, start: [9, 9], outside: ["oc_parco", 21, 6], base: "A",
        act: Object.assign({ T: "Guarda il tavolo", L: "Guarda la libreria", H: "Guarda il camino", W: "Guarda dalla finestra", x: "Apri lo scrigno" }, o.act || {}),
        flavor: Object.assign({ T: "Il tavolo lungo. Davanti a ogni sedia un segnaposto: «Arrigo», «Ofelia», «Tonio»… e uno con scritto solo «Il Giocatore».", L: "Libri di diritto, di cucina e di regolamenti del calcio. Il più consumato: «Il gioco dell'oca e i suoi segreti», 1931, con le orecchie a ogni pagina.", H: "Il camino è acceso anche se è maggio. Il Conte aveva freddo sempre, dicono. Da quando era tornato.", W: "Dalla finestra si vede il viale col tabellone. Le oche ci camminano sopra. Una si ferma sulla 58.", x: "Lo scrigno del Conte. Vuoto, tranne un odore di sigaro." }, o.flavor || {}),
        loot: o.loot || {}, npcs, intro: o.intro,
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 10, "A"); lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 10, "a"); lay(17, 0, 17, 10, "a"); lay(0, 10, 17, 10, "a"); put(9, 10, "v");
          put(3, 0, "W"); put(6, 0, "W"); put(12, 0, "W"); put(14, 0, "W"); put(9, 0, "Q"); put(16, 1, "H"); put(1, 2, "L"); put(1, 3, "L"); put(1, 7, "L");
          lay(6, 4, 11, 4, "T"); lay(4, 9, 7, 9, '"'); lay(11, 9, 14, 9, '"'); put(16, 8, "x"); put(16, 5, "J");
          (o.extra || []).forEach(([x, y, c]) => put(x, y, c));
        },
        decor(g, cx, cy, d) { H.plaque(g, "IL CONTE UGOLINO PASTROCCHI · 1938-20…", d.X(9) + 8, d.Y(1) + 3, "#fbbf24"); if (o.decor) o.decor(g, cx, cy, d); }
      };
    },
    cucina(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "interno", name: "La cucina della villa", short: "Cucina", sub: "Pentole di rame, un tavolo di marmo, odore di brodo", bg: "oc_cucina", w: 14, h: 9, start: [7, 7], outside: ["oc_parco", 14, 6], base: "=",
        act: { H: "Guarda i fornelli", D: "Guarda la credenza", T: "Guarda il tavolo", x: "Apri la madia" },
        flavor: { H: "I fornelli. Una pentola di brodo sobbolle dal mattino. Ernestina dice che non si spegne mai: «come il Conte, che non si spegneva neanche a dormire».", D: "La credenza: tazze spaiate, una per ogni erede. Su quella di Arrigo c'è scritto «NON PRESTARE».", T: "Il tavolo di marmo. Inciso nel bordo, piccolissimo: «L. ♥». Il resto è consumato dal mattarello.", W: "Dalla finestra della cucina si vede l'orto, il pozzo e, più in là, la cappella." },
        loot: Object.assign({ "12,7": { id: "oc_biscotto", text: "Nella madia, una latta di biscotti al burro con un biglietto: «per il giocatore, che è sciupato». È la calligrafia di Ernestina.", empty: "La latta è vuota. Ne è rimasta solo una briciola, e l'odore." } }, o.loot || {}),
        npcs, intro: o.intro,
        build(L) { const { lay, put } = L; lay(0, 0, 13, 8, "="); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 8, "a"); lay(13, 0, 13, 8, "a"); lay(0, 8, 13, 8, "a"); put(7, 8, "v"); put(2, 0, "H"); put(3, 0, "H"); put(10, 0, "W"); put(12, 0, "W"); put(6, 1, "D"); put(7, 1, "D"); lay(5, 4, 8, 4, "T"); put(12, 7, "x"); put(1, 6, "z"); put(1, 7, "z"); },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); for (let i = 0; i < 3; i++) { const t = (f / 2 + i * 14) % 40; g.fillStyle = `rgba(241,245,249,${0.45 - t / 90})`; g.beginPath(); g.arc(d.X(2) + 16 + Math.sin(t / 7 + i) * 4, d.Y(0) + 10 - t * 0.5, 3 + t / 10, 0, 7); g.fill(); } H.plaque(g, "CUCINA · ENTRARE CON LE MANI PULITE", d.X(7), d.Y(0) + 6, "#fde68a"); }
      };
    },
    serra(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "parco", name: "La serra", short: "Serra", sub: "Palme, felci, una sedia a dondolo e un tavolino rotondo", bg: o.bg || "oc_serra", time: o.time || "giorno", w: 14, h: 10, start: [7, 8], outside: ["oc_parco", 5, 25], base: ",",
        act: { J: "Guarda le piante", T: "Guarda il tavolino", t: "Guarda la palma" },
        flavor: { J: "Limoni, gerani e una pianta carnivora con un'etichetta: «ARRIGO». Il Conte aveva un senso dell'umorismo.", T: "Il tavolino rotondo di Madame Ofelia: una tovaglia di velluto, una sfera di vetro con dentro un pesciolino rosso. Lei dice che aiuta la concentrazione.", t: "Una palma. Arriva fino alla vetrata e la spinge un po'. Teo dice che vuole uscire." },
        loot: Object.assign({ "11,6": { id: "oc_tarocco", text: "Tra le foglie del vaso c'è una carta dei tarocchi: l'Arcano XVI, la Torre. Qualcuno l'ha persa. O nascosta.", empty: "Solo foglie. E un ragno che ti guarda con sufficienza." } }, o.loot || {}),
        npcs, intro: o.intro,
        build(L) { const { lay, put } = L; lay(0, 0, 13, 9, ","); lay(0, 0, 13, 0, "E"); lay(0, 0, 0, 9, "E"); lay(13, 0, 13, 9, "E"); lay(0, 9, 13, 9, "E"); put(7, 9, "v"); lay(3, 4, 10, 6, "C"); put(2, 2, "J"); put(11, 2, "J"); put(2, 6, "J"); put(11, 6, "J"); put(6, 5, "T"); put(1, 1, "t"); put(12, 8, "t"); (o.extra || []).forEach(([x, y, c]) => put(x, y, c)); },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.fillStyle = "rgba(255,255,255,.08)"; for (let i = 0; i < 5; i++) g.fillRect(d.X(1) + ((f / 2 + i * 50) % 190), d.Y(1), 6, 140); g.fillStyle = "#e9d5ff"; g.globalAlpha = 0.6 + 0.3 * Math.sin(f / 10); g.beginPath(); g.arc(d.X(6) + 8, d.Y(5) + 2, 3, 0, 7); g.fill(); g.globalAlpha = 1; if (o.decor) o.decor(g, cx, cy, d, f); }
      };
    },
    capanno(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "interno", name: "Il capanno di Teo", short: "Capanno", sub: "Cesoie, semi, una branda e una radio a valvole", bg: "oc_capanno", w: 9, h: 7, start: [4, 5], outside: ["oc_parco", 13, 25], base: "=",
        act: { z: "Guarda le cassette", B: "Guarda la branda", x: "Apri il baule", L: "Guarda lo scaffale" },
        flavor: { z: "Cassette di semi con etichette precise: «Bosso», «Rosmarino di Lucia», «Cipressi (63)».", B: "La branda di Teo. Sotto il cuscino, un mazzo di carte da scopa e un pettine da baffi. Teo non ha i baffi.", L: "Attrezzi da giardino lucidati come argenteria. Su una cesoia, incise, le iniziali «U.P.»." },
        loot: Object.assign({}, o.loot || {}), npcs, intro: o.intro,
        build(L) { const { lay, put } = L; lay(0, 0, 8, 6, "="); lay(0, 0, 8, 0, "a"); lay(0, 0, 0, 6, "a"); lay(8, 0, 8, 6, "a"); lay(0, 6, 8, 6, "a"); put(4, 6, "v"); put(1, 1, "z"); put(2, 1, "z"); put(7, 1, "B"); put(7, 2, "B"); put(1, 4, "x"); put(4, 0, "L"); put(6, 0, "W"); },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.fillStyle = "#fde68a"; g.font = "6px serif"; g.fillText("♪", d.X(2) + 4, d.Y(1) - 2 - (f / 8 % 6)); H.plaque(g, "TEO · GIARDINIERE", d.X(4) + 8, d.Y(0) + 6, "#86efac"); }
      };
    }
  };

  function boot() {
    const E = window.__ocaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__ocaH || !window.__tabellone) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__ocaH(K), Z = window.__ocaZ, { say, done, wask, ask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("oc_c1", { kind: "acc", label: "Coccarda dell'Oca (rossa)", val: "fascia", from: "Capitolo 1 di Il Gioco dell'Oca del Conte" });
    K.lore("l_oc_villa", { t: "Villa Pastrocchi", d: "Villa del Settecento sopra Valcortese, quaranta stanze, sessantatré cipressi e una cucina che non si spegne mai. L'ultimo Conte, Ugolino, ci ha vissuto da solo per cinquant'anni, con una cuoca, un giardiniere e molte oche." });
    K.lore("l_oc_testamento", { t: "Il testamento", d: "«Lascio la villa, il parco e le oche a chi vincerà la mia ultima partita: il gioco dell'oca di 63 caselle dipinto sul viale. Quattro tirate, una per sera. Un giocatore neutrale controllerà che nessuno bari. Se vince lui, sceglie lui.»" });
    K.lore("l_oc_regole", { t: "Le regole del Conte", d: "Oche: avanti ancora. Ponte: alla 12. Locanda: fermo un turno. Pozzo: due. Labirinto: alla 33. Prigione: due. Morte: si ricomincia la tirata. Chi arriva su una casella occupata rimanda indietro chi c'era. Chi bara, viene beccato. Prima o poi." });
    const met = () => ["oc_ernestina", "oc_ofelia", "oc_tonio", "oc_cosimo", "oc_damiano", "oc_arrigo"].filter((id) => F.is("oc_met_" + id)).length;
    const meet = (id) => { if (F.is("oc_met_" + id)) return; F.set("oc_met_" + id, true); if (S() === 2 && met() >= 3 && !F.is("oc_c1_tre")) { F.set("oc_c1_tre", true); say("voce", `<b>Hai conosciuto ${met()} eredi.</b> Gilda aspetta al tabellone, in mezzo al viale: la prima tirata comincia quando vuoi.`); setStep(N, 3); quest("oc_c1c", "La prima tirata", "Gilda ti aspetta al tabellone sul viale."); } };
    const goal = (s) => ({
      0: "Davanti alla villa, sui gradini, una signora in tailleur grigio guarda l'orologio. Ti aspetta.",
      1: "Entra nel salone, dal portone al centro della villa: c'è la lettura del testamento.",
      2: `Conosci gli eredi prima della partita (${met()}/3): salone, cucina, serra, fontana, labirinto, pozzo. Teo il giardiniere è nel capanno, vicino al ruscello.`,
      3: "Gilda ti aspetta al tabellone sul viale: la prima tirata, dalla partenza alla Locanda.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin(r) {
      setStep(N, 4); F.set("oc_c1_done", true);
      const m = K.reward("oc_c1", { coins: 100, cos: "oc_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", `Casella 19, la Locanda. ${H.esito(r)} Gilda segna le posizioni su un registro con la copertina di pelle d'oca. Vera, dice lei.`],
        ["oc_gilda", "[serio] Prima tirata conclusa. Domani sera si riparte dalla Locanda. Chi è in Locanda, per regola, cena in villa. Cioè tutti."],
        ["oc_ernestina", "[felice] Allora metto su il brodo grande. E apro la cantina: il Conte ha lasciato scritto che la bottiglia buona va aperta «quando la partita si fa seria»."],
        ["oc_arrigo", "[furbo] La partita è già seria. Io, per esempio, sono serissimo."],
        ["voce", `<b>FINE DEL CAPITOLO 1 · «Il Testamento»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 2 ti aspetta: la cena alla Locanda, la cantina chiusa da cinquant'anni, una seduta spiritica nella serra e due gemelli che non si parlano da un rigore."]
      ]), () => K.openMain(), "oc_locanda");
    }
    function prima() {
      say("oc_gilda", "[serio] Regole del Conte, articolo uno: si tira con due dadi. Articolo due: il giocatore neutrale tira per primo, così vede tutto. Articolo tre: chi bara viene beccato. Prima o poi.");
      if (!K.inv.has("oc_lente")) say("oc_gilda", "[pensa] E stia attento al cugino Arrigo. Una lente da notaio l'aiuterebbe. Io non posso dargliela: sono imparziale. Ma qualcuno, in questa villa, ne ha una.");
      H.tirata({ title: "Prima tirata · fino alla Locanda", from: 0, to: 19, rivals: ["arrigo", "ernestina", "ofelia"], diff: 0,
        story: {
          10: { who: "oc_arrigo", t: "Il patto del notaio", text: "Arrigo ti affianca sul viale e abbassa la voce: «Senti, giocatore. Se vinco io, il dieci per cento della villa è tuo. Basta che tu guardi dall'altra parte quando tiro.»", opts: [
            { label: "🦊 Fingi di accettare", sub: "Gli dai corda, e lo tieni d'occhio", eff: { flag: "oc_finto" }, after: "Stringi la mano di Arrigo. È umida. Lui sorride. Tu conti le sue dita: cinque. Per ora." },
            { label: "❤️ «No. Sono neutrale.»", sub: "Il Conte ti ha chiamato per questo", eff: { flag: "oc_rifiuto", move: 1 }, after: "Arrigo alza le spalle. «Neutrale. Che parola noiosa.» Gilda, da lontano, ti fa un cenno con la testa. Avanzi di uno, per l'entusiasmo." }] },
          16: { who: "oc_ofelia", t: "La mano di Madame Ofelia", text: "Madame Ofelia ti prende la mano a metà viale. «Vedo… una casella. Vedo un'oca. Vedo un uomo coi baffi che bara.» Arrigo tossisce.", opts: [
            { label: "❤️ «E il Conte? Lo vede?»", sub: "Chiedile di lui", eff: { flag: "oc_ofelia_conte" }, after: "Ofelia si fa seria. «Il Conte veniva da me ogni giovedì. Chiedeva sempre di una donna. Lucia.» Poi riprende il tono da fiera: «Vedo una cena! Abbondante!»" },
            { label: "🦊 «Mi dica il mio prossimo tiro.»", sub: "Mettila alla prova", eff: { flag: "oc_ofelia_prova", give: "biscotto" }, after: "«Sette», dice. Poi ti mette in mano un biscotto: «Per quando sbaglio.» Lo dice come una che sbaglia spesso." }] }
        } }, (r) => {
        if (r.flags.oc_finto) K.bond("astuzia", 1); if (r.flags.oc_rifiuto) K.bond("cuore", 1); if (r.flags.oc_ofelia_conte) { K.bond("cuore", 1); K.rel.add("oc_ofelia", 2); } if (r.flags.oc_ofelia_prova) K.bond("astuzia", 1);
        if (r.caught) say("oc_arrigo", "[arrabbiato] Una lente? Chi le ha dato una lente? È un'aggressione alla presunzione d'innocenza!");
        else say("oc_arrigo", "[furbo] Che serata fortunata. Il dado, stasera, mi voleva bene.");
        fin(r);
      });
    }

    const talk = {
      oc_gilda() {
        const s = S();
        if (s === 0) {
          say("oc_gilda", "[serio] Lei è il Campione. Il giocatore neutrale. Puntuale: bene. Il Conte odiava i ritardatari. Tranne sé stesso.");
          say("oc_gilda", "Sono Gilda Ferraris, esecutrice testamentaria. Gli eredi sono nel salone. Io leggo, lei ascolta, poi si gioca. Prego.");
          K.learnLore("l_oc_villa"); setStep(N, 1); quest("oc_c1", "Il Testamento", "Entra nel salone dal portone della villa."); return done();
        }
        if (s === 1 && K.inZone("oc_salone")) {
          say("voce", "Gilda apre una busta gialla con un tagliacarte a forma di oca. Sei eredi trattengono il fiato. Uno, Arrigo, finge di non trattenerlo.");
          say("oc_gilda", "[serio] «Io, Ugolino Pastrocchi, sano di mente e di dadi, lascio la villa, il parco e le oche a chi vincerà la mia ultima partita: il gioco dell'oca di sessantatré caselle dipinto sul viale.»");
          say("oc_gilda", "«Quattro tirate, una per sera. Un giocatore neutrale controllerà che nessuno bari. L'ho scelto io: è il numero dieci del Borgo. Il motivo lo saprà alla 63.»");
          say("oc_arrigo", "[arrabbiato] Un calciatore? Lo zio lascia una villa del Settecento in mano a un calciatore e a un dado?");
          say("oc_tonio", "[ride] Meglio di un notaio radiato.");
          say("oc_gilda", "[serio] «Se vince il giocatore neutrale, sceglie lui a chi va la villa. P.S.: Arrigo, ti vedo.» Fine.");
          K.learnLore("l_oc_testamento"); K.learnLore("l_oc_regole");
          return wask("Sei teste si girano verso di te. Ernestina ha gli occhi lucidi. Arrigo ha la mano in tasca, su qualcosa che tintinna.", [
            { label: "❤️ «Lo faccio per il Conte. Giocherò pulito.»", big: true, w: { cuore: 1 }, fn: () => { F.set("oc_c1_cuore", true); say("oc_ernestina", "[felice] Pulito. Il Conte avrebbe riso: lui non ha mai giocato pulito in vita sua. Ma voleva che gli altri lo facessero."); avanti(); } },
            { label: "🦊 «Lo faccio per vedere chi bara.»", big: true, w: { astuzia: 1 }, fn: () => { F.set("oc_c1_astuzia", true); say("oc_arrigo", "[sorpreso] Insinuazioni! Sono stato radiato, non condannato. È diverso. Lo dice anche il mio avvocato, che è mio cognato."); avanti(); } }
          ]);
        }
        if (s === 3 && !K.inZone("oc_salone")) {
          say("oc_gilda", "[serio] Gli eredi sono in posizione. Lei tira per primo. Pronto?");
          return ask("Sul viale, sei pedine di legno grandi come cani. La tua ha una stella dipinta sopra. Le oche si spostano dalla casella 1, offese.", [
            { label: "🎲 Si comincia · Prima tirata", sub: "Dalla partenza alla Locanda (19)", big: true, fn: prima },
            { label: "◂ Un momento", sub: "Conosci prima gli altri eredi, o cerca carte utili", fn: done }
          ]);
        }
        say("oc_gilda", s === 2 ? `[serio] Conosca gli eredi, prima di giocare con loro. Ne ha conosciuti ${met()}. Quando ne avrà conosciuti tre, l'aspetto al tabellone.` : s >= 4 ? "Domani sera, alla Locanda. Puntuale." : "Prego, il salone è da quella parte."); done();
        function avanti() { say("oc_gilda", "Bene. Prima della partita, il Conte voleva che il giocatore neutrale conoscesse gli eredi. Li trova sparsi per il parco. Io aspetto al tabellone."); setStep(N, 2); quest("oc_c1b", "Gli eredi", "Conosci almeno tre eredi: salone, cucina, serra, fontana, labirinto, pozzo."); done(); }
      },
      oc_arrigo() {
        if (K.rel.scene("oc_arrigo")) return; const s = S();
        if (s === 2 && !F.is("oc_met_oc_arrigo")) {
          say("oc_arrigo", "[furbo] Arrigo Pastrocchi, notaio. Ex. Diciamo «a riposo forzato». Lei è il neutrale? Bene. Io sono il favorito. Si vede dai baffi.");
          say("oc_arrigo", "[pensa] Lo zio mi ha cresciuto a forza di partite a carte. Mi batteva sempre. Barava, ovvio. È da lui che ho imparato. Da lui e da mio padre, che era peggio.");
          meet("oc_arrigo"); return done();
        }
        say("oc_arrigo", ["[furbo] Le regole sono un'opinione. Lo diceva lo zio. Lo dico io. Lo dirà il giudice, spero.", "Le oche mi odiano. Anche questo l'ho preso dallo zio.", "Se vede il mio dado girare da solo, è il vento. Questa villa è piena di correnti."][Math.floor(Math.random() * 3)]); done();
      },
      oc_ernestina() {
        if (K.rel.scene("oc_ernestina")) return; const s = S();
        if (s === 2 && !F.is("oc_met_oc_ernestina")) {
          say("oc_ernestina", "[felice] Ah, il giocatore! Sieda, sieda. Ha mangiato? Non ha mangiato. Si vede: è sciupato.");
          say("oc_ernestina", "[pensa] Trentun anni qui. Prima di me c'era mia madre, Lucia. Il Conte diceva che la minestra di Lucia era l'unica cosa onesta della villa. Poi rideva. Poi smetteva di ridere.");
          meet("oc_ernestina"); K.rel.add("oc_ernestina", 1); return done();
        }
        say("oc_ernestina", ["Il brodo è sempre sul fuoco. Se vuole, c'è. Se non vuole, c'è lo stesso.", "[ride] Il Conte mi rubava i biscotti dalla madia. Lo sapevo. Ne mettevo tre in più.", "Alla partita gioco anch'io, sì. Non per la villa. Per vedere cosa c'è alla 63. Lui diceva che c'era una sorpresa."][Math.floor(Math.random() * 3)]); done();
      },
      oc_ofelia() {
        if (K.rel.scene("oc_ofelia")) return; const s = S();
        if (s === 2 && !F.is("oc_met_oc_ofelia")) {
          say("oc_ofelia", "[sorpreso] Ti aspettavo. Cioè: le carte ti aspettavano. Io passavo di qui per caso. È tutto un caso, tranne le carte.");
          say("oc_ofelia", "[pensa] Madame Ofelia. Il Conte era mio cliente. Ogni giovedì, alle cinque. Mi chiedeva sempre di parlare con una persona. Io gli dicevo che stava bene. Lui pagava il doppio. Non dirlo a nessuno.");
          meet("oc_ofelia"); return done();
        }
        say("oc_ofelia", ["Vedo un sette nel tuo futuro. O un due. Comunque un numero.", "[pensa] La serra parla, di notte. Scricchiola. Io dico ai clienti che sono gli spiriti. A volte ci credo anch'io.", "Se trovi una carta dei tarocchi in giro, è mia. Specialmente se è la Torre."][Math.floor(Math.random() * 3)]); done();
      },
      oc_tonio() {
        if (K.rel.scene("oc_tonio")) return; const s = S();
        if (s === 2 && !F.is("oc_met_oc_tonio")) {
          say("oc_tonio", "[ride] Il dieci del Borgo! Ti ho visto giocare, sai? Hai un sinistro che sembra una carezza. Io avevo un sinistro che sembrava una multa.");
          say("oc_tonio", "Tonio Sgambetti, terzino, Rondinese '84. Che c'entro col Conte? Mi pagava le trasferte. Di nascosto. Non ho mai capito perché. Adesso mi lascia in un testamento. Capisco ancora meno.");
          meet("oc_tonio"); return done();
        }
        say("oc_tonio", ["Sul tabellone entro in scivolata. Non è cattiveria: è abitudine.", "[ride] Quarant'anni fa con quest'oca qui ci giocavo nelle pause dell'allenamento. Ha morso il mister. Era dalla nostra parte.", "Se trovi una mia figurina dell'84, tienila. Ero bellissimo."][Math.floor(Math.random() * 3)]); done();
      },
      oc_cosimo() {
        if (K.rel.scene("oc_cosimo")) return; const s = S();
        if (s === 2 && !F.is("oc_met_oc_cosimo")) {
          say("oc_cosimo", "[pensa] Cosimo. Il gemello che para. Pronipote del Conte, geometra. Lei sta per chiedermi di mio fratello. Non me lo chieda.");
          say("voce", "Dall'altra parte del parco, vicino al pozzo, un uomo identico a lui finge di non guardarvi.");
          meet("oc_cosimo"); return done();
        }
        say("oc_cosimo", ["Il labirinto lo conosco a memoria. Da bambini ci nascondevamo qui. Insieme. Una volta.", "[arrabbiato] Si era mosso prima? Io? Sui rigori il portiere ha diritto di sperare.", "Mio fratello ha la mia faccia e un carattere sbagliato."][Math.floor(Math.random() * 3)]); done();
      },
      oc_damiano() {
        if (K.rel.scene("oc_damiano")) return; const s = S();
        if (s === 2 && !F.is("oc_met_oc_damiano")) {
          say("oc_damiano", "[arrabbiato] Damiano. Il gemello che tira. Pronipote, ragioniere. Mio fratello le avrà detto che ho sbagliato un rigore. Il rigore non l'ho sbagliato: lui si è mosso prima.");
          say("oc_damiano", "[pensa] Il pozzo. Il Conte ci buttava le monetine per noi, da piccoli, e il lunedì le ripescava. Diceva che i desideri vanno restituiti, se non si avverano.");
          meet("oc_damiano"); return done();
        }
        say("oc_damiano", ["Undici metri e venti. L'ho misurato io.", "[pensa] Se lo vede, gli dica che… niente. Non gli dica niente.", "Il pozzo è profondo dodici metri. Uno più del dischetto. Ci penso spesso."][Math.floor(Math.random() * 3)]); done();
      },
      oc_teo() {
        if (K.rel.scene("oc_teo")) return;
        if (!F.is("oc_santino_preso")) {
          say("oc_teo", "[ride] Il giocatore neutrale! Entra, entra, attento alle cesoie. Io sono Teo. Poto, semino, parlo con le oche. Loro rispondono più del Conte.");
          say("oc_teo", "[furbo] Tieni questo santino. È del Conte: ci ha messo la sua faccia al posto di quella del santo. Diceva che porta fortuna nelle caselle brutte. Dalla Locanda in poi, ce ne sono parecchie.");
          F.set("oc_santino_preso", true); K.inv.give("oc_santino");
          say("voce", "Ricevi il <b>Santino del Conte</b> (🎒 Zaino). Nel Tabellone ti salva da una casella cattiva: Locanda, Pozzo, Buca, Labirinto, Prigione o Morte.");
          say("oc_teo", "[pensa] E se giri il parco con gli occhi aperti… il Conte aveva sette dadi d'avorio. Li nascondeva dappertutto. Chi li trova tutti, dicono, vede la partita com'è davvero.");
          K.learnLore("l_oc_villa"); return done();
        }
        say("oc_teo", [`[pensa] Dadi d'avorio? Ne hai trovati ${H.dadi()}. Il Conte ne aveva sette. Il labirinto, il pozzo, il ruscello… e dentro casa, più avanti.`, "Le oche hanno un capo. Si chiama Teresa. Non toccarla: morde in latino.", "[ride] Il Conte potava le siepi col righello. Io le poto a occhio. Lui diceva che ho l'occhio giusto. Strano, detto da lui."][Math.floor(Math.random() * 3)]); done();
      }
    };

    const zones = {
      oc_parco: Z.parco(H, (s) => {
        const L = [];
        if (s === 0 || s === 3) L.push({ id: "oc_gilda", at: s === 0 ? [22, 8] : [22, 16] });
        if (s === 2 || s === 3) { L.push({ id: "oc_tonio", at: [23, 24] }); L.push({ id: "oc_cosimo", at: [31, 12] }); L.push({ id: "oc_damiano", at: [8, 14] }); }
        return L;
      }, {
        items: [[4, 10], [39, 20], [15, 30], [29, 13]], itemCos: "oc_c1",
        intro: [["voce", "Villa Pastrocchi, maggio. Un viale di ghiaia, sessantatré cipressi e, dipinto sul viale, un tabellone del gioco dell'oca grande come un campo di calcetto."], ["voce", "Sulle caselle passeggiano oche vere. Una si ferma sulla 58, quella col teschio, e ti guarda. Sembra un avvertimento."]]
      }),
      oc_salone: Z.salone(H, (s) => (s === 1 ? [{ id: "oc_gilda", at: [9, 2] }, { id: "oc_arrigo", at: [5, 6] }, { id: "oc_ernestina", at: [13, 6] }, { id: "oc_ofelia", at: [4, 3] }, { id: "oc_tonio", at: [12, 3] }, { id: "oc_cosimo", at: [3, 8] }, { id: "oc_damiano", at: [15, 8] }] : [{ id: "oc_arrigo", at: [5, 6] }]), {
        intro: [["voce", "Il salone: un tavolo lungo come un pullman, un camino acceso a maggio, e il ritratto del Conte che ti guarda con un dado tra le dita."]]
      }),
      oc_cucina: Z.cucina(H, () => [{ id: "oc_ernestina", at: [4, 4] }], {}),
      oc_serra: Z.serra(H, () => [{ id: "oc_ofelia", at: [7, 3] }], {}),
      oc_capanno: Z.capanno(H, () => [{ id: "oc_teo", at: [4, 3] }], {})
    };
    return {
      n: N, title: "Il Testamento", sub: "Sessantatré caselle, sei eredi e un giocatore neutrale",
      goal, start: "oc_parco", introBg: "oc_titolo", zones, talk, obj: {},
      intro: [["voce", "Una lettera su carta intestata, con un'oca in rilievo: «Il Conte Ugolino Pastrocchi la invita, in qualità di giocatore neutrale, alla lettura del suo testamento. Porti scarpe comode.»"], ["voce", "Il Conte Pastrocchi non l'hai mai conosciuto. O almeno, così credi."], ["voce", "Villa Pastrocchi è in cima a Valcortese, oltre una salita di tornanti e un cancello che cigola in do maggiore."]]
    };
  }
  boot();
})();
