// js/burattini.js - LA GIOSTRA DEI BURATTINI · configurazione della saga sul motore comune (js/saga-core.js)
// Teatrino a fili, botteghe rinascimentali, l'odore di colla e pioppo, e un arbitro fatto di paglia.
// Nella città delle Sette Corporazioni, il calcio non si gioca sull'erba ma su palcoscenici di legno d'acero e noce:
// marionette intagliate a mano, bilancini in frassino e refe di canapa cerata.
// Il Campione diventa apprendista nella bottega del leggendario Maestro Taddeo, scoprendo gli ingranaggi
// e i segreti dell'«Arbitro di Paglia», un fantoccio che fischia da solo senza che nessuno ammetta di muoverlo.
// Novità di questa saga:
//  - CALCIO A FILI (js/burattini-partita.js): fisica pendolare a bilancino, tiro radente con A, stacco d'incornata con B,
//    gestione dell'aggrovigliamento dei fili se le marionette si sovrappongono.
//  - BOTTEGHE E PALCOSCENICI A MANO: interni disegnati a mano con banchi di lavoro, quinte teatrali e capriate.
//  - STATISTICHE: Spirito Popolare/Ducale (morale), Stima di Taddeo, Perizia del Bilancino (arte).
//  - QUATTRO FINALI: Popolare, Accademia Ducale, Carovana Nomade e il segreto L'Anima di Pioppo.
(function () {
  "use strict";
  if (window.__burattini || !window.__sagaCore) return;
  const TS = 16;
  const E = window.__sagaCore.create({
    stadium: {
      azPitch: "cortile", cageField: 2, cageMut: "narrow", weather: "sereno",
      venue: {
        ads: [["TEATRO DEI BURATTINI", "#b45309"], ["BOTTEGA DI TADDEO · PIOPPO & REFE", "#78350f"], ["L'ARBITRO DI PAGLIA NON PERDONA", "#d97706"], ["SI RECITANO GOL A SOGGETTO", "#92400e"]],
        crowd: ["#78350f", "#b45309", "#d97706", "#fef08a", "#451a03"],
        ground: ["#451a03", "#3a1502"], line: "#fde68a66", grid: "rgba(254,240,138,.04)",
        tint: "rgba(180,83,9,.18)", glow: "254,240,138", sky: ["#1a0f0a", "#2b1810"], fx: { fr: 0.98 }
      }
    },
    id: "burattini", key: "ali-di-rondine.burattini", title: "La Giostra dei Burattini", icon: "🎭", bg: "bur_titolo", chapters: 4,
    menuSub: "marionette, bilancini, l'arbitro di paglia e il teatrino ducale",
    theme: { accent: "#d97706", ink: "#fef08a", paper: "rgba(35,18,10,.94)", font: "Georgia, serif", chipBg: "#2b1810ee", chipBorder: "#b45309" },
    stats: { morale: [-10, 10, 0, "Spirito Popolare / Ducale"], stima: [0, 99, 10, "Stima di Taddeo"], arte: [0, 99, 15, "Perizia del Bilancino"] },
    travel: true,
    item: ["Tassello di pioppo", "Tasselli"],
    musicMain: "burattini",
    music: {
      burattini: {
        bpm: 104, spb: 12, chords: ["Dm", "A", "Bb", "F", "Gm", "Dm", "A", "Dm"], lres: 2, lw: "triangle", lv: 0.035,
        lead: "D5 - F5 E5 D5 C#5 | D5 - - A4 - . | F5 - G5 A5 Bb5 A5 | F5 - - - - . | G5 - Bb5 A5 G5 F5 | D5 - F5 E5 D5 . | E5 - - C#5 - . | D5 - - - - -",
        bass: "R . . 5 . . 3 . . 8 . .", bv: 0.12, arp: "1 . 3 . 5 . 8 . 5 . 3 .", aw: "sine", av: 0.025, drum: "k . . h . h k . . h s h", dv: 0.24
      },
      burattini_giostra: {
        bpm: 128, chords: ["Dm", "Gm", "A", "Dm"], lres: 2, lw: "sawtooth", lv: 0.03,
        lead: "A5 . F5 . D5 . F5 . | G5 . E5 . C#5 . E5 . | F5 . D5 . Bb4 . D5 . | E5 - - - A4 - - -",
        bass: "R . R . R . R .", bv: 0.1, arp: "1 . 5 . 8 . 5 .", aw: "triangle", av: 0.02, drum: "k . h . k h s .", dv: 0.28
      }
    },
    guest: {
      id: "bur_taddeo",
      lines: [
        ["bur_taddeo", "{n}! Maestro Taddeo della Giostra. Sono sceso quaggiù al Borgo Marino per respirare un po' di salmastro."],
        ["bur_taddeo", "La brezza del golfo distende le fibre del pioppo meglio di qualunque cera d'api. E poi quel portiere del campetto... scatta con una molla che par fatta da me!"]
      ]
    },
    cameos: [
      {
        id: "lt_ferro", zone: "bur_vicolo", at: [6, 8],
        when: (K) => !!(K.otherSaga("ali-di-rondine.latta") || {}).done?.[1],
        lines: [
          ["lt_ferro", "CLANG! Ma guarda un po'. Questi manichini di pioppo pesano un decimo della mia corazza del 1527."],
          ["lt_ferro", "Taddeo mi ha proposto una verniciatura a fuoco. Gli ho risposto che le mie ammaccature sono medaglie, mica difetti d'intaglio!"]
        ]
      },
      {
        id: "dc_agata", zone: "bur_palco", at: [18, 14],
        when: (K) => !!(K.otherSaga("ali-di-rondine.detective") || {}).done?.[1],
        lines: [
          ["dc_agata", "{n}! Sono quassù dietro le quinte. Qualcuno dice che i fili delle marionette cadano da soli..."],
          ["dc_agata", "Ma guardando al microscopio, le fibre di canapa mostrano un taglio netto da cesoia da sarto. C'è sempre un movente dietro ogni marionetta!"]
        ]
      },
      {
        id: "ve_selva", zone: "bur_bottega", at: [4, 7],
        when: (K) => !!(K.otherSaga("ali-di-rondine.vento") || {}).done?.[1],
        lines: [
          ["ve_selva", "Che profumo di trucioli! Nelle valli usiamo il faggio per le pale dei mulini, ma questo pioppo stagionato è una piuma."],
          ["ve_selva", "Se Taddeo mi presta due bilancini, domani faccio volare un aquilone a forma di centravanti!"]
        ]
      }
    ],
    musicBg: { bur_palco: "burattini_giostra", bur_cantiere: "burattini_giostra" },
    regions: {
      vicolo: { grass: ["#4a3324", "#543b2a", "#422d1e"], path: ["#382417", "#2f1e13"], stone: ["#6b4b35", "#5c402c"], wall: ["#78350f", "#5b2609"], water: ["#1e293b", "#0f172a"], tall: "#5a3a22", tree: ["#2d1d12", "#3b2618", "#4a301e"], column: "#b45309", tint: "254,240,138", tintA: 0.08, fx: "dust", dark: 0.15 },
      bottega: { grass: ["#3b2214", "#432717", "#331c0f"], path: ["#543621", "#4a2f1c"], stone: ["#784c2e", "#6b4328"], wall: ["#633311", "#4d260c"], water: ["#16202c", "#0d131a"], tall: "#4a2d18", tint: "253,230,138", tintA: 0.12, fx: "dust", dark: 0.12 },
      palco: { grass: ["#451a03", "#522004", "#381402"], path: ["#78350f", "#6b2f0c"], stone: ["#92400e", "#7c360b"], wall: ["#881337", "#6b0f2b"], water: ["#0f172a", "#020617"], tall: "#9a3412", tint: "254,205,211", tintA: 0.1, fx: "dust", dark: 0.18 },
      cantiere: { grass: ["#332014", "#3b2618", "#2c1a0f"], path: ["#422919", "#382214"], stone: ["#523623", "#472e1e"], wall: ["#422006", "#321703"], water: ["#0e2a3a", "#091b26"], tall: "#3a2414", tint: "186,230,253", tintA: 0.09, fx: "fog", dark: 0.22 }
    },
    floors: "_", solid: "wp",
    rest: { ch: "s", label: "Posa il bilancino", text: "Riponi i bilancini sulla rastrelliera di cuoio. Il profumo di pece ti rasserena. (Il gioco salva da solo: qui puoi sfogliare il Canovaccio)." },
    texts: {
      chestOpen: "Apri la cassapanca d'olmo.", chestEmpty: "La cassapanca è vuota: solo qualche truciolo dorato sul fondo.",
      nothing: "Niente da intagliare qui. Ma un buon artigiano sa osservare.",
      noHero: "Maestro Taddeo cerca un apprendista con mani salde e cuore sincero. Prima crea il tuo Campione.",
      chapters: "Quattro atti, una ribalta. I fili che intrecci decideranno la recita finale."
    },
    journal: { name: "Il Canovaccio di Bottega", sub: "Attori, burattini, trame e finali" },
    endings: {
      popolare: ["TEATRO DEL POPOLO", "Rifiuti le monete del Duca e apri le porte del teatrino a tutti i popolani del vicolo: il calcio a fili appartiene a chiunque sappia sognare.", "Scegli sempre la piazza, la fiera del popolo e la libertà."],
      accademia: ["IL TEATRO DUCALE", "Diventi il primo maestro del Gran Teatro di Corte: marionette d'ebano, velluto scarlatto e applausi dei nobili.", "Accetta i patti ducali e perfeziona l'alta tecnica."],
      carovana: ["LA CAROVANA NOMADE", "Rinnovi la carovana di Gervaso e parti per i borghi di tutta Italia portando la Giostra ovunque.", "Resta fedele all'amico Gervaso e all'avventura errante."],
      segreto: ["L'ANIMA DI PIOPPO", "Senza arbitri né fili: marionette che danzano per vero incanto sul proscenio e festa infinita tra popolo e corte.", "Segreto: raccogli tutti i tasselli di pioppo, alta perizia e svela il cuore dell'Arbitro di Paglia."]
    },
    heroLook: (h, K) => ({ bg: ["#2b1810", "#d97706"], shirt: K.F.is("bur_velluto") ? "#881337" : h.shirt }),
    heroTitle: (K) => (K.F.is("bur_maestro") ? "maestro burattinaio" : "apprendista del bilancino"),
    act: { w: "Esamina il banco", p: "Osserva la marionetta" },
    paint: {
      w(K, sx, sy, tx, ty) { // banco da falegname con pialla e trucioli
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 8); const g = K.g;
        g.fillStyle = "#78350f"; g.fillRect(sx + 1, sy + 3, 14, 10);
        g.fillStyle = "#451a03"; g.fillRect(sx + 2, sy + 13, 3, 3); g.fillRect(sx + 11, sy + 13, 3, 3);
        // pialla in legno chiaro e lama d'argento
        g.fillStyle = "#b45309"; g.fillRect(sx + 4, sy + 5, 6, 4);
        g.fillStyle = "#e2e8f0"; g.fillRect(sx + 8, sy + 4, 2, 3);
        // truciolo arricciato
        g.strokeStyle = "#fef08a"; g.lineWidth = 1.2;
        g.beginPath(); g.arc(sx + 11, sy + 7, 2, 0, 5); g.stroke();
        K.light(sx + 8, sy + 6, 12, "254,240,138", 0.2);
      },
      p(K, sx, sy, tx, ty) { // marionetta di pioppo su piedistallo
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 6); const g = K.g;
        g.fillStyle = "#451a03"; g.fillRect(sx + 4, sy + 13, 8, 3); // base
        g.fillStyle = "#78350f"; g.fillRect(sx + 7, sy + 8, 2, 5); // asta
        // testa e busto manichino
        g.fillStyle = "#fef08a"; g.fillRect(sx + 6, sy + 2, 4, 4);
        g.fillStyle = "#d97706"; g.fillRect(sx + 5, sy + 6, 6, 5);
        // filo teso che sale verso l'alto
        g.strokeStyle = "rgba(254,240,138,.6)"; g.lineWidth = 0.8;
        g.beginPath(); g.moveTo(sx + 8, sy + 2); g.lineTo(sx + 8, sy - 4); g.stroke();
        K.light(sx + 8, sy + 4, 10, "254,240,138", 0.25);
      }
    },
    floorPaint(K, f, sx, sy, tx, ty) {
      if (f === "_") { // assi di legno del proscenio / bottega
        K.P(sx, sy, 16, 16, (tx + ty) % 2 === 0 ? "#54331d" : "#4a2c17");
        const g = K.g;
        g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx, sy + 15, 16, 1);
        g.fillStyle = "#271408"; g.fillRect(sx + 2, sy + 2, 1, 1); g.fillRect(sx + 13, sy + 2, 1, 1);
        // venatura del legno
        g.strokeStyle = "rgba(180,83,9,.25)"; g.lineWidth = 1;
        g.beginPath(); g.moveTo(sx + 4, sy + 8); g.lineTo(sx + 12, sy + 8); g.stroke();
        return true;
      }
      if (f === ":" && K.ZX.rk !== "palco") { // lastricato del vicolo con trucioli
        K.P(sx, sy, 16, 16, K.ZX.rg.path[(tx + ty) % 2]);
        const r = K.rnd(tx, ty, 5);
        if (r < 0.2) {
          const g = K.g;
          g.fillStyle = "#fef08a"; g.fillRect(sx + 5, sy + 6, 3, 1.5);
        }
        return true;
      }
      return false;
    },
    drawItem(g, x, y, i, f) { // tassello di pioppo intagliato con stella a quattro punte
      const b = Math.sin(f / 12 + i) * 1.5;
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x, y + 4, 4, 1.5, 0, 0, 7); g.fill();
      g.fillStyle = "#d97706"; g.fillRect(x - 3.5, y - b - 3.5, 7, 7);
      g.fillStyle = "#fef08a"; g.fillRect(x - 2, y - b - 2, 4, 4);
      g.fillStyle = "#fff"; g.fillRect(x - 1, y - b - 1, 2, 2);
    }
  });
  const K = E.K;
  window.__burattini = E.api;
  // Effetto drappo di velluto per le quinte sceniche
  K.drappo = (g, x, y, w, h, col) => {
    const fr = K.frNow();
    g.save();
    g.fillStyle = col || "#881337";
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + w, y);
    for (let dy = 0; dy <= h; dy += 4) {
      const off = Math.sin(fr / 20 + dy / 10) * 2;
      g.lineTo(x + w + off, y + dy);
    }
    g.lineTo(x, y + h);
    g.closePath();
    g.fill();
    g.strokeStyle = "#fbbf24"; g.lineWidth = 1.5;
    g.stroke();
    g.restore();
  };
})();
