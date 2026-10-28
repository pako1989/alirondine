// js/latta.js - «IL PALLONE DI LATTA» · configurazione della saga sul motore comune (js/saga-core.js). Ispirata a Shovel Knight e ai platform 16 bit.
// Castelrondine, il borgo sulla collina sopra il mare, la sera del Palio. Il Campione indossa per scherzo l'armatura del «Cavaliere di Latta» (1500, ignoto):
// si chiude e non si apre più. Dentro il petto c'è un pallone di latta ammaccato, e dentro l'armatura una voce che cigola: Ferro.
// Tono: ironico di base (l'armatura perde pezzi, i corvi fischiano falli), capitoli seri sul passato di Ferro. Niente sangue.
// Dal core: livelli A SCORRIMENTO (cfg.scroll, novità portata da questa saga: motore js/scorri.js, record e Mappa dei livelli), Rapporti (cfg.bonds),
// Inventario (cfg.inv), Peso morale (cfg.weight: Onore e Affari), interni a mano, ospite, lore. Minigioco: «A scorrimento» (cabinato in Sala Giochi).
// Tessere proprie: I mura merlate · X portone delle Mura (avvia i livelli) · K tribuna del Palio · E bancarella · F fontana · V vessillo · A armatura in vetrina · P rastrelliera · J botti
//   pavimenti Q acciottolato · Y assi di legno · U pavimento a scacchi del museo · Z sabbia della pista del Palio
(function () {
  "use strict";
  if (window.__latta || !window.__sagaCore) return;
  const LV = {
    mura: { name: "Le Mura al tramonto", icon: "🏰", theme: "mura", d: "Il camminamento delle Mura: elmi che rotolano, corvi che fischiano e un muro crepato.",
      signs: ["Lo scudiero para i tiri dritti. Calcia contro il muro dietro di te: di sponda passa!", "◀ ▶ cammina, ⤒ salta (tienilo premuto per saltare più in alto). Raccogli i gettoni!", "Un muro crepato. Calcialo col pallone ⚽! Poi premi ⚽ di nuovo: il pallone torna da te.", "Troppo alto! Calcia il pallone, poi saltaci sopra: fa da molla."],
      map: [
        ".................................#.......................................................................................................................................#",
        ".................................#.............................................S.........................................................................................#",
        ".................................#...........................................=====.......................................................................................#",
        ".................................#..................................................o.o.o.o.o............................................................................#",
        ".................................#......................................#............................................S...................................................#",
        ".................................#......................................#.i.......s.......C..............................................................................#",
        "..............ooo................#...............ooo..................##########################.........t........o....o................h...c............................#",
        ".............=====...............#..............=====.................##########################........###.....................c.....=====..........########............#",
        ".................................B......====..........................##########################........###.........M...............................##......B............#",
        ".................................B....................................##########################........###........................................###......B............#",
        ".P...i....o.o.o......e.....i.....B...o.o................e.....e...i...##########################...^^^..###..oo.....................e............e.###.S.oo.B...oo..E....#",
        "############################################...#################################################################..........################################################",
        "############################################...#################################################################..........################################################"] },
    torrione: { name: "Il Torrione", icon: "🐦‍⬛", theme: "mura", boss: "corvo", d: "In cima al Torrione, il Corvo Maggiore fischia tutto quello che si muove.",
      map: [
        "#......................#", "#......................#", "#......................#", "#......................#", "#.............Z........#", "#......................#",
        "#....h.................#", "#...====........====...#", "#......................#", "#......................#", "#..P......o.o..........#", "########################", "########################"] },
    tetti: { name: "I tetti del Borgo", icon: "🌙", theme: "tetti", d: "Di notte, sui coppi: comignoli che fumano, tegole smosse e gatti che non sopportano i cavalieri.",
      signs: ["Un comignolo che fuma: entra nel fumo e ti spinge in alto. Anche il pallone ci galleggia.", "Tegole smosse: quando tremano, stanno per cadere. Passa svelto!", "Due comignoli e un buco grande: sali col fumo, poi plana sulla trave.", "Il gatto dei tetti ti salta addosso: saltagli in testa prima tu, o calcialo."],
      map: [
        "...........................................................................................................................................................................#", "...........................................................................................................................................................................#", "......................................................................................................................................S....................................#", "......................o.o.S.o.o......................................................................................................===...................................#", ".....................==========....................................................o..o..o.................................................................................#", ".....................................................................................===.....................................o.o...........................................#", "....................................f...f...f...............t..............................................t................=====........................f..f..............#", "..........................................................######........................................=======............................................................#", "........................................................o.######.o....B....................................................................................................#", "..................................o.......o............############...B...........................................................................h........................#", ".P..i...o.o.o....g.......u.....i......g............################...B.S...C.i....u.....u..........c...........e.......^^........s.....u....C..i.....g.......c.o.o.o..E...#", "#######################..#...##################...##############################...#.....#....#####################...################..#...################################", "#######################..#...##################...##############################...#.....#....#####################...################..#...################################"] },
    campanile: { name: "Il Campanile", icon: "🔔", theme: "tetti", boss: "gatto", d: "Sotto la campana, Sgrinfia il gattone ladro difende il batacchio rubato.",
      map: [
        "#........................#", "#........................#", "#........................#", "#........................#", "#..h.....................#", "#.=====............=====.#", "#........................#", "#........................#", "#........................#", "#............Z...........#", "#...u..P..o.....o....u...#", "##########################", "##########################"] }
  };
  const E = window.__sagaCore.create({
    id: "latta", key: "ali-di-rondine.latta", title: "Il Pallone di Latta", icon: "🛡️", bg: "lt_titolo", chapters: 4,
    menuSub: "La sera del Palio indossi per scherzo un'armatura del Cinquecento. Si chiude. Dentro c'è un pallone di latta e una voce che cigola. Il castello si sveglia: livelli a scorrimento in pixel art.",
    theme: { accent: "#f59e0b", ink: "#fff7ed", paper: "rgba(40,20,36,.94)", font: "'Trebuchet MS', system-ui, sans-serif", chipBg: "#7c2d12", chipBorder: "#f59e0b" },
    stats: { onore: [0, 12, 0, "Onore"], affari: [0, 12, 0, "Affari"] },
    weight: { name: "Il Peso dell'armatura", axes: { onore: ["Onore", "🛡️"], affari: ["Affari", "🪙"] } },
    item: ["Gettone del Palio", "Gettoni del Palio"],
    drawItem(g, x, y, i, f) { const w = [4, 3, 2, 1, 2, 3][Math.floor(f / 6 + i) % 6]; g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.4); g.fillStyle = "#8a5a10"; g.beginPath(); g.ellipse(0, 0, w + 1, 5, 0, 0, 7); g.fill(); g.fillStyle = "#f6c445"; g.beginPath(); g.ellipse(0, 0, w, 4, 0, 0, 7); g.fill(); g.fillStyle = "#8a5a10"; if (w > 2) { g.fillRect(-2, -1, 1, 1); g.fillRect(1, -1, 1, 1); g.fillRect(-2, 1, 4, 1); } g.restore(); },
    regions: {
      palio: { grass: ["#6b8f3a", "#638636", "#739840"], path: ["#c9a36a", "#bf9960"], stone: ["#a08070", "#988070"], wall: ["#8a5a44", "#7e5240"], water: ["#4a8ab8", "#4682b0"], tall: "#5a7a30", tree: ["#3a5a2a", "#4a6e30", "#6a8e3a"], tint: "255,150,110", tintA: 0.14, fx: "leaves", dark: 0.06 },
      museo: { grass: ["#3a2e3e", "#352a39", "#3f3244"], path: ["#5a4a5a", "#544454"], stone: ["#6a5a6a", "#625262"], wall: ["#2a1e2a", "#241a24"], water: ["#2a4a6a", "#264662"], tall: "#3a2e3e", tint: "255,210,150", tintA: 0.1, fx: "", dark: 0.16 },
      notte: { grass: ["#2a3a3a", "#263636", "#2e4040"], path: ["#4a4a5e", "#444458"], stone: ["#5a5a70", "#545468"], wall: ["#2a2440", "#24203a"], water: ["#1a2a4a", "#182644"], tall: "#22322e", tree: ["#1a2a24", "#22342c", "#2e4436"], tint: "120,140,255", tintA: 0.16, fx: "fireflies", dark: 0.3 },
      bottega: { grass: ["#3a2e2e", "#352a2a", "#3f3232"], path: ["#5a4a44", "#544440"], stone: ["#6a5a54", "#625250"], wall: ["#2a1e1e", "#241a1a"], water: ["#2a4a6a", "#264662"], tall: "#3a2e2e", tint: "255,150,70", tintA: 0.16, fx: "", dark: 0.2 },
      sacrestia: { grass: ["#2e2a3c", "#2a2638", "#322e42"], path: ["#46405a", "#403a54"], stone: ["#5a5470", "#544e68"], wall: ["#1e1a2a", "#1a1624"], water: ["#2a4a6a", "#264662"], tall: "#2e2a3c", tint: "180,160,255", tintA: 0.14, fx: "", dark: 0.24 },
      taverna: { grass: ["#4a2e1e", "#452a1b", "#503222"], path: ["#6a4a30", "#64452c"], stone: ["#5a4434", "#544030"], wall: ["#2a180e", "#24140c"], water: ["#2a4a6a", "#264662"], tall: "#4a2e1e", tint: "255,170,80", tintA: 0.16, fx: "", dark: 0.18 }
    },
    floors: "QYUZ", solid: "IXKEFVAPJROGN",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g;
      if (f === "Q") { // acciottolato: sassi tondi con bordo scuro e un filo d'erba nelle fughe
        g.fillStyle = "#7a6458"; g.fillRect(sx, sy, 16, 16);
        const S = [[1, 1, 6, 5], [8, 0, 7, 6], [0, 7, 5, 5], [6, 7, 6, 4], [12, 7, 4, 5], [2, 12, 6, 4], [9, 12, 6, 4]];
        S.forEach(([x, y, w, h], i) => { const v = (tx * 7 + ty * 3 + i) % 3; g.fillStyle = ["#a88a78", "#b49684", "#9c7e6c"][v]; g.fillRect(sx + x, sy + y, w, h); g.fillStyle = "rgba(255,240,220,.22)"; g.fillRect(sx + x, sy + y, w, 1); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(sx + x, sy + y + h - 1, w, 1); });
        if ((tx * 13 + ty * 7) % 9 === 0) { g.fillStyle = "#6b8f3a"; g.fillRect(sx + 6, sy + 5, 1, 2); g.fillRect(sx + 7, sy + 6, 1, 1); }
        return true;
      }
      if (f === "Y") { // assi di legno della taverna
        g.fillStyle = (tx + ty) % 2 ? "#7a5232" : "#82583a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(sx, sy + 7, 16, 1); g.fillRect(sx, sy + 15, 16, 1); g.fillRect(sx + ((ty * 5) % 12) + 2, sy, 1, 7); g.fillRect(sx + ((ty * 3 + 7) % 12) + 2, sy + 8, 1, 7);
        g.fillStyle = "rgba(255,220,170,.1)"; g.fillRect(sx, sy, 16, 1); g.fillStyle = "#4a2e18"; g.fillRect(sx + 4, sy + 3, 1, 1); g.fillRect(sx + 11, sy + 11, 1, 1); return true;
      }
      if (f === "U") { // scacchi del museo, lucidi
        const d = (tx + ty) % 2; g.fillStyle = d ? "#e8dcc8" : "#5a3a4a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = d ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.08)"; g.fillRect(sx + 2, sy + 2, 5, 1); g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(sx, sy + 15, 16, 1); return true;
      }
      if (f === "Z") { // sabbia battuta della pista del Palio, con le impronte dei cavalli
        g.fillStyle = (tx * 3 + ty) % 2 ? "#d8b47a" : "#d2ae74"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(120,80,40,.22)"; if ((tx + ty * 3) % 4 === 0) { g.fillRect(sx + 4, sy + 5, 3, 2); g.fillRect(sx + 9, sy + 10, 3, 2); }
        g.fillStyle = "rgba(255,240,200,.25)"; g.fillRect(sx + (tx * 5) % 13, sy + (ty * 7) % 13, 2, 1); return true;
      }
      return false;
    },
    paint: {
      // mura merlate del castello (viste dall'alto: muro di mattoni con merli e ombra)
      I(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#8a5a44"; g.fillRect(sx, sy, 16, 16);
        for (let r = 0; r < 4; r++) { const off = r % 2 ? 4 : 0; for (let x = -off; x < 16; x += 8) { g.fillStyle = ["#c87a4a", "#b86e42", "#d28552"][(tx + r + x) % 3 & 3] || "#c87a4a"; g.fillRect(sx + Math.max(0, x) + 1, sy + r * 4 + 1, Math.min(7, 16 - Math.max(0, x)) - 1, 3); g.fillStyle = "rgba(255,230,190,.25)"; g.fillRect(sx + Math.max(0, x) + 1, sy + r * 4 + 1, Math.min(7, 16 - Math.max(0, x)) - 1, 1); } }
        if (ty === 0 || !K.at || true) { if (tx % 2 === 0) { g.fillStyle = "#6e4434"; g.fillRect(sx + 2, sy - 4, 12, 5); g.fillStyle = "#d28552"; g.fillRect(sx + 3, sy - 4, 10, 2); } }
        g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 14, 16, 2);
        if ((tx * 5 + ty) % 7 === 0) { g.fillStyle = "#4f9a34"; g.fillRect(sx + 3, sy + 2, 1, 8); g.fillRect(sx + 2, sy + 5, 1, 2); g.fillRect(sx + 4, sy + 8, 1, 2); }
      },
      // portone delle Mura: legno con borchie, arco di pietra, torce che tremano
      X(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#6a6a7a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#3a1e0e"; g.fillRect(sx + 2, sy + 2, 12, 14); g.fillStyle = "#7a4a22"; g.fillRect(sx + 3, sy + 3, 10, 13);
        g.fillStyle = "#4a2a10"; g.fillRect(sx + 6, sy + 3, 1, 13); g.fillRect(sx + 10, sy + 3, 1, 13); g.fillStyle = "#c8c8d0"; [[4, 6], [12, 6], [4, 12], [12, 12]].forEach(([x, y]) => g.fillRect(sx + x, sy + y, 1, 1));
        g.fillStyle = "#f59e0b"; g.fillRect(sx + (tx % 2 ? 1 : 13), sy + 1, 2, 3 + Math.round(Math.abs(Math.sin(fr / 5 + tx)))); K.light(sx + (tx % 2 ? 2 : 14), sy + 2, 30, "255,170,80", 0.5);
      },
      // tribuna di legno del Palio con drappi a strisce
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 13, 16, 3);
        for (let i = 0; i < 3; i++) { g.fillStyle = i % 2 ? "#8a5a32" : "#a06a3a"; g.fillRect(sx, sy + i * 4, 16, 4); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + i * 4 + 3, 16, 1); }
        g.fillStyle = (tx % 2) ? "#c02a3a" : "#f0c040"; g.fillRect(sx, sy + 12, 16, 3); g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(sx, sy + 12, 16, 1);
        if ((tx * 7 + ty) % 3 === 0) { g.fillStyle = ["#2563eb", "#16a34a", "#db2777"][tx % 3]; g.fillRect(sx + 5, sy + 1 - Math.round(Math.abs(Math.sin(fr / 9 + tx))), 4, 4); g.fillStyle = "#e8c0a0"; g.fillRect(sx + 6, sy - 2 - Math.round(Math.abs(Math.sin(fr / 9 + tx))), 2, 2); }
      },
      // bancarella con tendone a righe e merce
      E(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, c = ["#c02a3a", "#2563eb", "#16a34a"][(tx + ty) % 3]; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 13, 15, 3);
        g.fillStyle = "#6a4426"; g.fillRect(sx + 2, sy + 4, 1, 11); g.fillRect(sx + 13, sy + 4, 1, 11); g.fillStyle = "#8a5a32"; g.fillRect(sx + 1, sy + 9, 14, 5);
        for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#f8f4e8" : c; g.fillRect(sx + i * 4, sy, 4, 5); } g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx, sy + 4, 16, 1);
        ["#f6c445", "#e05a2a", "#8bc34a"].forEach((cc, i) => { g.fillStyle = cc; g.fillRect(sx + 3 + i * 4, sy + 8, 3, 2); });
      },
      // fontana di pietra con l'acqua che zampilla
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#9a8a80"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 8, 5, 0, 0, 7); g.fill(); g.fillStyle = "#4a8ab8"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 6, 3.4, 0, 0, 7); g.fill();
        g.fillStyle = "#b8a89c"; g.fillRect(sx + 7, sy + 1, 2, 9); g.fillStyle = "rgba(200,230,255,.85)"; for (let i = 0; i < 4; i++) { const p = ((fr / 4 + i * 3) % 12); g.fillRect(sx + 8 + (i % 2 ? 1 : -2) * p / 4, sy + 1 + p * 0.7, 1, 1); }
        g.fillStyle = "rgba(255,255,255,.4)"; g.fillRect(sx + 4 + ((fr / 6) % 6), sy + 9, 2, 1); K.light(sx + 8, sy + 8, 18, "160,200,255", 0.18);
      },
      // vessillo su palo, che sventola
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 6, sy + 14, 6, 2); g.fillStyle = "#4a2e18"; g.fillRect(sx + 7, sy - 8, 2, 23); g.fillStyle = "#e0b040"; g.fillRect(sx + 6, sy - 9, 4, 2);
        const c1 = (tx % 2) ? "#c02a3a" : "#1d4ed8"; for (let i = 0; i < 10; i++) { const w = 7 - Math.floor(i / 4) + Math.round(Math.sin(fr / 6 + i / 2 + tx)); g.fillStyle = i < 2 ? "#f0c040" : c1; g.fillRect(sx + 9, sy - 7 + i, Math.max(2, w), 1); }
      },
      // armatura in vetrina (museo)
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 3, sy + 13, 10, 3); g.fillStyle = "#3a2a1a"; g.fillRect(sx + 3, sy + 12, 10, 3);
        g.fillStyle = "#16141f"; g.fillRect(sx + 4, sy - 7, 8, 19); g.fillStyle = "#a6afc2"; g.fillRect(sx + 5, sy - 6, 6, 5); g.fillRect(sx + 4, sy, 8, 7); g.fillRect(sx + 5, sy + 7, 2, 5); g.fillRect(sx + 9, sy + 7, 2, 5);
        g.fillStyle = "#0b0b12"; g.fillRect(sx + 6, sy - 4, 4, 1); g.fillStyle = "#e2e8f2"; g.fillRect(sx + 5, sy - 6, 6, 1); g.fillRect(sx + 4, sy, 2, 6);
        g.fillStyle = "rgba(200,230,255,.18)"; g.fillRect(sx + 1, sy - 9, 14, 22); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(sx + 2, sy - 8, 1, 8);
      },
      // rastrelliera di lance e scudi
      P(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a3a20"; g.fillRect(sx + 1, sy + 10, 14, 3); g.fillRect(sx + 1, sy + 2, 14, 2);
        for (let i = 0; i < 3; i++) { g.fillStyle = "#7a5a3a"; g.fillRect(sx + 3 + i * 5, sy - 6, 1, 18); g.fillStyle = "#c8d0de"; g.fillRect(sx + 2 + i * 5, sy - 8, 3, 3); }
        g.fillStyle = (tx % 2) ? "#c02a3a" : "#1d4ed8"; g.beginPath(); g.ellipse(sx + 8, sy + 7, 4, 5, 0, 0, 7); g.fill(); g.fillStyle = "#f0c040"; g.fillRect(sx + 7, sy + 4, 2, 6);
      },
      // botti della taverna
      J(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 7, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#7a4a22"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 7, 7, 0, 0, 7); g.fill(); g.fillStyle = "#9a6232"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 5, 5, 0, 0, 7); g.fill();
        g.strokeStyle = "#3a3440"; g.lineWidth = 1; g.beginPath(); g.ellipse(sx + 8, sy + 8, 6.5, 6.5, 0, 0, 7); g.stroke(); g.fillStyle = "#4a2a10"; g.fillRect(sx + 7, sy + 7, 2, 2);
      },
      // capitolo 2 · scala a pioli appoggiata al muro: porta sui tetti
      R(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#3a3448"; g.fillRect(sx, sy, 16, 16); for (let r = 0; r < 4; r++) { g.fillStyle = r % 2 ? "#46405a" : "#4e4864"; g.fillRect(sx + (r % 2) * 4, sy + r * 4, 16, 3); }
        g.fillStyle = "#16141f"; g.fillRect(sx + 3, sy - 10, 3, 26); g.fillRect(sx + 10, sy - 10, 3, 26); g.fillStyle = "#a0784a"; g.fillRect(sx + 4, sy - 10, 1, 26); g.fillRect(sx + 11, sy - 10, 1, 26);
        g.fillStyle = "#c8945a"; for (let y = -8; y < 16; y += 5) g.fillRect(sx + 4, sy + y, 8, 2); g.fillStyle = "#fde047"; if (Math.floor(fr / 20) % 2) g.fillRect(sx + 7, sy - 14, 2, 2);
      },
      // porta del campanile: arco, ferri battuti e una corda che esce sotto
      G(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#4a4460"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#16141f"; g.fillRect(sx + 2, sy + 2, 12, 14); g.fillStyle = "#3a2a4a"; g.fillRect(sx + 3, sy + 3, 10, 13);
        g.fillStyle = "#6a6080"; g.fillRect(sx + 2, sy + 1, 12, 2); g.fillStyle = "#1a1626"; g.fillRect(sx + 7, sy + 3, 1, 13); g.fillStyle = "#c8a070"; g.fillRect(sx + 9, sy + 13 + Math.round(Math.sin(fr / 9)), 1, 3);
        g.fillStyle = "#e0b040"; g.fillRect(sx + 5, sy + 9, 1, 2); g.fillRect(sx + 10, sy + 9, 1, 2); K.light(sx + 8, sy + 6, 22, "180,160,255", 0.25);
      },
      // banco del lattoniere: incudine, cesoie, un pallone a metà
      O(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 13, 16, 3); g.fillStyle = "#5a3a20"; g.fillRect(sx, sy + 4, 16, 9); g.fillStyle = "#8a5a32"; g.fillRect(sx, sy + 3, 16, 2);
        g.fillStyle = "#3a3a44"; g.fillRect(sx + 2, sy, 6, 3); g.fillRect(sx + 4, sy + 3, 2, 1); g.fillStyle = "#c8a040"; g.beginPath(); g.arc(sx + 12, sy + 1, 3, Math.PI, 0); g.fill(); g.fillStyle = "#fff3c0"; g.fillRect(sx + 11, sy - 1, 1, 1);
        if (Math.floor(fr / 8 + tx) % 6 === 0) { g.fillStyle = "#ffd25a"; g.fillRect(sx + 5, sy - 3, 1, 1); g.fillRect(sx + 7, sy - 2, 1, 1); }
      },
      // scaffale di latte: barattoli, imbuti, lanterne
      N(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3a2416"; g.fillRect(sx + 1, sy - 8, 14, 23); g.fillStyle = "#5a3a20"; [-6, 1, 8].forEach((y) => g.fillRect(sx + 1, sy + y + 5, 14, 1));
        [[3, -6, "#c8d0de"], [8, -6, "#e2e8f2"], [3, 1, "#a6afc2"], [9, 1, "#c8a040"], [4, 8, "#e2e8f2"], [10, 8, "#a6afc2"]].forEach(([x, y, c]) => { g.fillStyle = c; g.fillRect(sx + x, sy + y, 4, 5); g.fillStyle = "rgba(255,255,255,.6)"; g.fillRect(sx + x, sy + y, 1, 2); });
      }
    },
    act: { R: "Sali sui tetti", G: "Entra nel campanile", O: "Guarda il banco", N: "Guarda lo scaffale", X: "Sali sulle Mura", K: "Guarda la tribuna", E: "Guarda la bancarella", F: "Guarda la fontana", V: "Guarda il vessillo", A: "Guarda l'armatura", P: "Guarda la rastrelliera", J: "Guarda le botti", n: "Leggi il cartello", x: "Apri il baule", s: "Riposa un momento", q: "Entra", l: "Guarda la lanterna", b: "Siediti", u: "Guarda il tavolo", z: "Guarda le casse" },
    rest: { ch: "s", label: "Riposa un momento", text: "Ti siedi, e l'armatura cigola come una sedia vecchia. Il gioco salva da solo. Dal menu: 🏰 Livelli a scorrimento per rigiocare quelli superati." },
    texts: { nothing: "Niente di utile. Solo pietra, corvi e odore di frittelle.", noHero: "L'Araldo cerca un cavaliere con un nome. Crea prima il tuo Campione.", chestOpen: "Apri il baule.", chestEmpty: "Il baule è vuoto. Qualcuno ha già fatto il Palio con quello che c'era dentro." },
    journal: { name: "Il Registro del Palio", sub: "Livelli, stendardi, persone e finali" },
    scroll: { eng: "__scorri", name: "🏰 I livelli di Castelrondine", hint: "Nessun livello superato, per ora. I livelli veri partono dal portone delle Mura (a nord della piazza), dopo aver indossato l'armatura del Museo. Intanto: cortile d'allenamento.", levels: LV, bonus: (K) => (K.inv.has("lt_toppa") ? 1 : 0) + (K.inv.has("lt_spallaccio") ? 1 : 0) },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Conoscenti", "Amici", "Fidati", "Famiglia del Palio"],
      scenes: {
        lt_ottavia: [{ lv: 2, id: "ott2", lines: [["lt_ottavia", "Sa perché faccio la curatrice? Da bambina toccavo tutto e mi sgridavano. Ora sgrido io. È un cerchio."], ["lt_ottavia", "[pensa] Però quell'armatura non l'ho mai toccata. Mai. Mi sembrava che respirasse. Adesso so che avevo ragione, ed è peggio."]], reward: (K) => K.bond("onore", 1) }],
        lt_gelsa: [{ lv: 2, id: "gel2", prize: "Una toppa ricamata per l'armatura (+1 pezzo nei livelli)", lines: [["lt_gelsa", "Questa armatura ha un buco sul fianco. Ferro dice che è «di guerra». Io dico che è di trascuratezza."], ["lt_gelsa", "[felice] Ecco: una toppa coi colori del Borgo. Ho ricucito gonfaloni per sessant'anni, una corazza non mi spaventa."]], reward: (K) => K.inv.give("lt_toppa") }],
        lt_bacco: [{ lv: 2, id: "bac2", lines: [["lt_bacco", "Mio nonno diceva che la sera del Palio nel castello si sentiva battere un pallone. Contro i muri. Toc, toc."], ["lt_bacco", "[ride] Io pensavo fosse il vino. Poi stasera l'ho sentito anch'io, e non avevo ancora aperto la botte."]], reward: (K) => K.bond("onore", 1) }],
        lt_zeno: [{ lv: 2, id: "zen2", lines: [["lt_zeno", "Mio padre batteva latta, suo padre pure, e così indietro fino a quando la latta era una cosa nuova. Siamo gente che aggiusta."], ["lt_zeno", "[serio] Mio figlio fa il programmatore a Milano. Aggiusta anche lui, dice. Cose che non si toccano. Io non ho capito, ma sono contento lo stesso."]], reward: (K) => K.bond("onore", 1) }],
        lt_tobia: [{ lv: 2, id: "tob2", lines: [["lt_tobia", "Sai quante volte ho suonato quella campana? Ottantamila, più o meno. Matrimoni, funerali, gol della Nazionale."], ["lt_tobia", "[pensa] Il funerale di mia moglie l'ho suonato io. Piano, piano. Lei diceva che suonavo troppo forte. Quella volta no."]], reward: (K) => K.bond("onore", 1) }],
        lt_araldo: [{ lv: 2, id: "ara2", lines: [["lt_araldo", "Sai qual è il segreto di un buon araldo? Gridare cose vere come se fossero false, e cose false come se fossero vere."], ["lt_araldo", "[furbo] Stasera ho gridato «il castello è sicuro». La gente ci ha creduto. Ora tocca a te farlo diventare vero."]], reward: (K) => K.bond("affari", 1) }]
      }
    },
    inv: {
      items: {
        lt_toppa: { n: "Toppa di Gelsa", icon: "🧵", d: "Una toppa ricamata coi colori del Borgo, cucita sul fianco dell'armatura. Nei livelli vale un pezzo d'armatura in più.", gift: {}, giftAny: 0 },
        lt_spallaccio: { n: "Spallaccio dorato", icon: "🛡️", d: "Uno spallaccio con lo stemma di Castelrondine. Nei livelli vale un pezzo d'armatura in più.", gift: {}, giftAny: 0 },
        lt_torta: { n: "Torta del Palio", icon: "🥧", d: "La torta di Bacco: mandorle, miele e una quantità di burro che il medico non deve sapere.", gift: { lt_gelsa: 8, lt_araldo: 6, lt_ottavia: 4 }, giftAny: 2, react: { lt_gelsa: "La torta di Bacco! La ricetta era di mia madre. Lui dice di no. Mente col burro.", lt_araldo: "Per un araldo il miele è come l'olio per una tromba. Grazie, cavaliere!" } },
        lt_pergamena: { n: "Pergamena del Palio 1527", icon: "📜", d: "L'elenco dei cavalieri del Palio del 1527. Un nome è stato grattato via con cura. Al suo posto, un disegno: un pallone.", gift: { lt_ottavia: 10 }, giftAny: 1, react: { lt_ottavia: "Il 1527! Questa l'avevamo data per persa. Guardi qui: un nome raschiato. Chi raschia un nome, di solito, ha qualcosa da nascondere." } },
        lt_batacchio: { n: "Batacchio di San Rocco", icon: "🔔", d: "Il batacchio della campana grande, rubato da Sgrinfia. Bronzo del 1527. Sopra, inciso piccolo, un ragazzo che corre con un pallone.", gift: {}, giftAny: 0 },
        lt_pagina: { n: "Pagina del registro Stagnini", icon: "📖", d: "«Anno 1527. Fatto un pallone di latta per il cavaliere del Palio. Pagato un fiorino e una promessa. La promessa non l'ha mantenuta: non è tornato a ritirarlo». Firmato: Mastro Stagnini.", gift: { lt_ottavia: 10, lt_gelsa: 6 }, giftAny: 1, react: { lt_ottavia: "Una fonte! Una fonte vera! «Non è tornato a ritirarlo». Allora il pallone nel petto... qualcuno ce l'ha messo dopo.", lt_gelsa: "Mastro Stagnini. I miei nonni compravano le pentole da loro. Allora la storia è vera, cavaliere." } },
        lt_biglietto: { n: "Biglietto da visita d'oro", icon: "💳", d: "«Cav. Gino Mattonaro · Castello Resort & Spa · Il passato ha un prezzo, il futuro uno sconto». Pesa più di quanto dovrebbe.", gift: { lt_bacco: 2 }, giftAny: 0 }
      }
    },
    endings: {
      riposo: ["Il Riposo di Ferro", "Ferro torna nella sua vetrina, finalmente in pace. Il pallone di latta resta a te: ogni tanto, la notte del Palio, lo senti battere contro un muro.", "Lascia che Ferro riposi."],
      custode: ["Il Custode delle Mura", "Tieni l'armatura e la sua voce. Castelrondine ha di nuovo un cavaliere, che cigola e calcia di sponda.", "Diventa il custode delle Mura con Ferro."],
      resort: ["Castello Resort & Spa", "Il castello diventa un albergo a cinque stelle con idromassaggio nella cripta. Ferro tace. Tu hai un abbonamento gratis alla spa. Non ci vai mai.", "Fai l'accordo con Mattonaro fino in fondo."],
      palio: ["L'Ultimo Palio", "Segreto: con tutti gli stendardi ritrovati, Ferro gioca il Palio che nel 1527 non gli fecero giocare. Il Borgo intero lo guarda. Poi la latta smette di cigolare.", "Segreto: ritrova tutti gli stendardi e scegli l'ultimo Palio."]
    },
    heroLook: (h, K) => (K && K.F && K.F.is("lt_armatura") ? { bg: ["#4a2440", "#f59e0b"], shirt: "#9aa3b5" } : { bg: ["#4a2440", "#fdba74"] }),
    heroTitle: () => "cavaliere di latta",
    musicMain: "palio",
    music: { palio: { bpm: 112, chords: ["C", "G", "Am", "F", "C", "G", "F", "G"], lres: 2, lw: "square", lv: 0.026,
      lead: "E5 - G5 - C6 - B5 - | A5 - G5 - E5 - - - | F5 - A5 - C6 - A5 - | G5 - - - - - - - | E5 - G5 - C6 - D6 - | E6 - D6 - C6 - A5 - | F5 - E5 - D5 - B4 - | C5 - - - - - - -",
      bass: "R . 5 . R . 5 . R . 5 . R . 8 .", bv: 0.09, arp: "1 3 5 8 5 3 1 3", aw: "square", av: 0.012, drum: "k . h . s . h . k k h . s . h h", dv: 0.08 } },
    guide: () => [["🏰 Livelli a scorrimento", "Al portone delle Mura parte un livello in pixel art. ◀ ▶ cammini, ⤒ salti, ⚽ calci il pallone di latta: rimbalza sui muri (di sponda fa doppio danno), se è fermo a terra ci salti sopra e fa da molla, ⚽ di nuovo lo richiama. I gonfaloni sono punti di ripartenza."], ["🚩 Stendardi", "Ogni livello nasconde degli stendardi: in alto, sopra i buchi, dietro i mattoni crepati. Dal menu, 🏰 Livelli a scorrimento, rigiochi quelli superati per trovarli tutti. Contano per un finale."], ["🛡️🪙 Onore e Affari", "Le scelte importanti pesano sull'armatura: Onore (fare la cosa giusta) o Affari (fare la cosa che conviene). Alcune risposte si aprono solo con abbastanza punti."]],
    zoneMenuExtra: (K) => (K.F.is("lt_armatura") && window.__lattaFerro ? [{ label: "🗣️ Parla con Ferro", sub: "L'armatura che indossi ha sempre qualcosa da dire", fn: () => window.__lattaFerro(K) }] : []).concat(K.scroll ? [{ label: "🏰 Livelli a scorrimento", sub: Object.keys(LV).some((id) => K.scroll.won(id)) ? "Rigioca i livelli superati (stendardi e record) o allenati nel cortile" : "Allenati subito nel cortile. I livelli veri partono dal portone delle Mura", fn: () => K.scroll.open(() => K.done()) }] : []),
    cameos: [],
    guest: { id: "lt_ferro", lines: ["Criiic. <em>(Traduzione: «Bel posto, il vostro molo. Troppo sale per un'armatura, però.»)</em>", "Cric-crac. <em>(«Se trovate un pallone di latta, è mio. Se è ammaccato, è sicuramente mio.»)</em>"] }
  });
  window.__lattaH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1f2937", skin: "#e0b890" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "700 6px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(40,20,36,.9)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#f59e0b"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = col || "#fde68a"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.restore(); },
      // un livello: cb(r) con r.win; prima una riga di Ferro
      level(id, line, cb) { const go = () => K.scroll.play(id, {}, (r) => cb(r || {})); const l = H.flush().concat(line ? [["lt_ferro", line]] : []); if (l.length) K.say(l, go); else go(); },
      people() {
        H.cast("lt_ferro", "Ferro", "La voce dell'armatura", { shape: "robot", skin: "#a6afc2", shirt: "#626b80", hair: "#d23a3a", eye: "#ffd25a", bg: ["#2a1e2a", "#f59e0b"] }, "L'armatura del «Cavaliere di Latta», Palio del 1527, cavaliere ignoto. Parla a cigolii, ma tu lo capisci lo stesso. Ha un pallone di latta nel petto e un'opinione su tutto, soprattutto sui corvi.");
        H.cast("lt_araldo", "Pippo Trombetti", "Araldo del Palio", { style: "messy", hair: "#7c2d12", shirt: "#c02a3a", skin: "#f1d1b0", acc: ["cappellino"], bg: ["#7c2d12", "#fde68a"] }, "Banditore ufficiale del Palio di Castelrondine da trent'anni. Ha una tromba, una voce più forte della tromba, e la capacità di trasformare ogni guaio in un annuncio.");
        H.cast("lt_ottavia", "Ottavia Spini", "Curatrice del Museo dell'Armeria", { style: "bob", hair: "#1c1917", shirt: "#4c1d95", skin: "#e8c4a0", eye: "#365314", acc: ["occhiali"], bg: ["#2e1065", "#ddd6fe"] }, "Dirige il Museo dell'Armeria con guanti bianchi e pazienza nera. Conosce ogni ammaccatura di ogni elmo. Su una sola armatura non ha mai trovato documenti, ed è quella che ti sei messo addosso.");
        H.cast("lt_gelsa", "Nonna Gelsa", "Ricamatrice dei gonfaloni", { style: "bun", hair: "#e5e7eb", shirt: "#1d4ed8", skin: "#d9a679", acc: ["fiore"], bg: ["#1e3a8a", "#bfdbfe"] }, "Ricama i gonfaloni del Palio da sessant'anni, con gli occhiali sul naso e le storie in bocca. Sa tutte le leggende del castello e ne racconta il doppio.");
        H.cast("lt_bacco", "Bacco", "Oste della Taverna del Gonfalone", { style: "bald", hair: "#57534e", shirt: "#f8fafc", skin: "#c8956a", beard: "folta", acc: ["grembiule"], bg: ["#7c2d12", "#fed7aa"] }, "L'oste più largo e più gentile del Borgo. La sua torta del Palio ha vinto quattro concorsi e causato due liti in famiglia. Ascolta tutto, dimentica a pagamento.");
        H.cast("lt_mattonaro", "Cav. Gino Mattonaro", "Costruttore", { style: "slick", hair: "#1c1917", shirt: "#0f172a", skin: "#e8c4a0", eye: "#78350f", beard: "baffi", acc: ["occhiali", "medaglia"], bg: ["#0f172a", "#fcd34d"] }, "Costruttore di villette, rotonde e promesse. Vuole trasformare il castello nel «Castello Resort & Spa». Sorride sempre, soprattutto quando fa i conti.");
        H.cast("lt_tobia", "Tobia Rintocchi", "Campanaro di San Rocco", { style: "short", hair: "#d6d3d1", shirt: "#334155", skin: "#d9a679", beard: "corta", acc: ["berretto"], bg: ["#1e1b4b", "#c4b5fd"] }, "Campanaro da cinquant'anni, sordo da un orecchio per mestiere. Conosce ogni gatto dei tetti per nome, e nessuno di loro risponde.");
        H.cast("lt_zeno", "Zeno Stagnini", "Lattoniere", { style: "bald", hair: "#a8a29e", shirt: "#57534e", skin: "#c8956a", beard: "baffi", acc: ["grembiule", "occhiali"], bg: ["#44403c", "#fdba74"] }, "Ultimo lattoniere di Castelrondine, bottega di famiglia dal Cinquecento. Aggiusta pentole, grondaie e cuori, in quest'ordine di difficoltà.");
        H.cast("lt_sgrinfia", "Sgrinfia", "Il gattone dei tetti", { shape: "ombra", skin: "#3a3848", shirt: "#c02a3a", eye: "#fde047", hair: "#3a3848", bg: ["#0b1030", "#fde047"] }, "Il gatto più grosso del Borgo. Ruba tutto ciò che luccica e ci dorme sopra. Stavolta ha rubato il batacchio della campana.");
        H.cast("lt_corvo", "Il Corvo Maggiore", "Arbitro del Torrione", { shape: "ombra", skin: "#1c1a26", shirt: "#e8e8e8", eye: "#ffdd55", hair: "#1c1a26", bg: ["#1c1a26", "#fde047"] }, "Un corvo enorme con la maglia a righe e il fischietto al collo. Fischia tutto: i passi, i salti, i pensieri. Per lui nessuno è mai in regola.");
      }
    };
    return H;
  };
  window.__latta = E.api; window.__lattaCore = E;
})();
