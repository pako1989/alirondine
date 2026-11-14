// js/conte.js - «IL CONTE DI MONTECALCIO» · configurazione della saga sul motore comune (js/saga-core.js). Vendetta in costume, ispirata a Il Conte di Montecristo.
// Quindici anni fa il Campione era la promessa di Montecalcio, borgo di colline e di una squadra sempre sull'orlo del fallimento. Poi una busta gialla nel suo armadietto, la squalifica a vita
// e un mister, Ferrante, morto di crepacuore poco dopo. Oggi torna con tre facce: il Conte Aurelio (investitore, dei salotti), Berto il Mercante (della strada) e il Custode (del campo).
// Tono: ironico di base, capitoli seri, una morte che pesa (fuori scena, niente sangue). Chi ha incastrato il Campione si scopre con le prove, non con la rabbia.
// Dal core: Rapporti (cfg.bonds), Inventario (cfg.inv), Orologio (cfg.clock), Prove (K.evidence/K.present), interni a mano, partite (K.playMatch), cameo, ospite.
// Novità portata da questa saga (nel file della saga, usa K.mask): LE MASCHERE. Tre identità, ognuna con la sua reputazione (Salotti, Strada, Campo); cambiare maschera costa una fascia dell'orologio;
//   ogni PNG ricorda con quale faccia l'hai conosciuto: se lo reincontri con un'altra faccia, può accorgersene e il Sospetto sale.
// Minigioco proprio: «Il Ballo in Maschera» (js/ballo.js, cabinato in Sala Giochi).
// Tessere proprie: F fontana · K candelabro · V vetrina dei trofei · E botte · I stendardo · C armadietto · pavimenti Y (tappeto rosso), m (marmo a scacchi), e (selciato)
(function () {
  "use strict";
  if (window.__conte || !window.__sagaCore) return;
  const KEYS = { conte: "ali-di-rondine.conte" };
  const MASKS = {
    conte: { n: "Il Conte Aurelio", short: "Conte", icon: "🎩", grp: "salotti", title: "il Conte di Montecalcio", look: { shirt: "#7f1d1d", bg: ["#3b0a0a", "#fde68a"] }, d: "Velluto, monocolo e una voce da banca. Apre i salotti e le porte del Municipio." },
    mercante: { n: "Berto il Mercante", short: "Mercante", icon: "🧢", grp: "strada", title: "Berto il Mercante", look: { shirt: "#92400e", bg: ["#451a03", "#fcd34d"] }, d: "Cappello a falde, mani veloci e un'agenda piena di nomi. Parla con la strada e con la Curva." },
    custode: { n: "Il Custode", short: "Custode", icon: "🔑", grp: "campo", title: "il Custode dello stadio", look: { shirt: "#14532d", bg: ["#052e16", "#bbf7d0"] }, d: "Tuta da lavoro, mazzo di chiavi e nessuno che lo guardi. Entra negli spogliatoi, parla con i ragazzi." }
  };
  const GRP = { salotti: "Salotti", strada: "Strada", campo: "Campo" };
  const mem = () => (window.__conteCore && window.__conteCore.K ? window.__conteCore.K : null);

  const E = window.__sagaCore.create({
    id: "conte", key: KEYS.conte, title: "Il Conte di Montecalcio", icon: "🎭", bg: "ct_titolo", chapters: 4,
    menuSub: "Quindici anni fa ti hanno cacciato per una busta che non era tua. Torni a Montecalcio con tre facce: il Conte, il Mercante, il Custode. Ognuno ti conosce con una sola.",
    theme: { accent: "#e0b44a", ink: "#fef3c7", paper: "rgba(28,12,8,.93)", font: "Georgia, 'Times New Roman', serif", chipBg: "#7f1d1d", chipBorder: "#e0b44a" },
    stats: { salotti: [0, 10, 0, "Salotti"], strada: [0, 10, 0, "Strada"], campo: [0, 10, 0, "Campo"], sospetto: [0, 10, 0, "Sospetto"] },
    item: ["Fiocco del Ballo", "Fiocchi del Ballo"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.3); g.fillStyle = "#7f1d1d"; g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, -4); g.lineTo(-6, 4); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0, 0); g.lineTo(6, -4); g.lineTo(6, 4); g.closePath(); g.fill(); g.fillStyle = "#e0b44a"; g.fillRect(-1.5, -1.5, 3, 3); g.globalAlpha = 0.35 + 0.25 * Math.sin(f / 9 + i); g.fillStyle = "#fde68a"; g.beginPath(); g.arc(0, 0, 8, 0, 7); g.fill(); g.restore(); },
    regions: {
      piazza: { grass: ["#8a7a5a", "#84755a", "#8f8160"], path: ["#b8a07a", "#b09a76"], stone: ["#9b8d78", "#948670"], wall: ["#5b4636", "#52402f"], water: ["#4a86a8", "#437d9e"], tall: "#7a6c4c", tree: ["#3d5a2d", "#4a6b36", "#567a3f"], tint: "255,200,130", tintA: 0.08, fx: "", dark: 0.02 },
      bar: { grass: ["#6b4a2e", "#654529", "#714f32"], path: ["#8a6236", "#835c32"], stone: ["#5a3d27", "#533823"], wall: ["#2a1810", "#22130c"], water: ["#4a86a8", "#437d9e"], tall: "#6b4a2e", tint: "255,170,80", tintA: 0.14, fx: "", dark: 0.16 },
      palazzo: { grass: ["#e8dfc9", "#ded5bf", "#efe6d1"], path: ["#9f1239", "#951034"], stone: ["#d8cdb2", "#cfc4a8"], wall: ["#5a1520", "#4a101a"], water: ["#4a86a8", "#437d9e"], tall: "#e8dfc9", tint: "255,210,150", tintA: 0.12, fx: "", dark: 0.1 },
      mercato: { grass: ["#7a8a52", "#74834e", "#80915a"], path: ["#c9b27c", "#c1aa76"], stone: ["#9a8e74", "#92866c"], wall: ["#6b4a30", "#5f4029"], water: ["#4a86a8", "#437d9e"], tall: "#6e7e46", tree: ["#355a2a", "#416a33", "#4d7a3c"], tint: "255,220,150", tintA: 0.06, fx: "", dark: 0 },
      sede: { grass: ["#3a3f4a", "#353a44", "#40454f"], path: ["#52311f", "#4a2b1b"], stone: ["#4b5563", "#434c59"], wall: ["#1c1f26", "#16181e"], water: ["#4a86a8", "#437d9e"], tall: "#3a3f4a", tint: "200,60,60", tintA: 0.1, fx: "", dark: 0.22 },
      stadio: { grass: ["#3f8f4a", "#3a8745", "#44974f"], path: ["#b9a77a", "#b0a074"], stone: ["#8d93a0", "#858b98"], wall: ["#475569", "#3f4c5f"], water: ["#4a86a8", "#437d9e"], tall: "#357a3f", tree: ["#2f5f33", "#3a7040", "#468048"], tint: "255,255,220", tintA: 0.04, fx: "", dark: 0 },
      notte: { grass: ["#1f4a2e", "#1c4429", "#235232"], path: ["#6b6247", "#625a42"], stone: ["#4b5563", "#434c59"], wall: ["#1e293b", "#172033"], water: ["#1a3a5a", "#173452"], tall: "#1b4026", tree: ["#173a22", "#1e4a2b", "#255a34"], tint: "90,120,200", tintA: 0.16, fx: "", dark: 0.3 },
      spogliatoio: { grass: ["#6a6a5a", "#646454", "#707060"], path: ["#8a7a5a", "#837454"], stone: ["#5a5a50", "#52524a"], wall: ["#2a2a22", "#22221c"], water: ["#4a86a8", "#437d9e"], tall: "#6a6a5a", tint: "200,200,140", tintA: 0.1, fx: "", dark: 0.2 },
      giardino: { grass: ["#244a30", "#20432b", "#285234"], path: ["#8f7a52", "#87734e"], stone: ["#6b6b73", "#63636b"], wall: ["#1d2a24", "#17221d"], water: ["#1a3a5a", "#173452"], tall: "#1f4029", tree: ["#173a22", "#1e4a2b", "#255a34"], tint: "255,190,110", tintA: 0.12, fx: "", dark: 0.28 },
      sala: { grass: ["#efe6d1", "#e5dcc6", "#f4ecd8"], path: ["#9f1239", "#951034"], stone: ["#d8cdb2", "#cfc4a8"], wall: ["#3a0e18", "#2e0a13"], water: ["#4a86a8", "#437d9e"], tall: "#efe6d1", tint: "255,200,120", tintA: 0.14, fx: "", dark: 0.14 },
      canonica: { grass: ["#7a6a52", "#74644c", "#807056"], path: ["#9a866a", "#927f64"], stone: ["#8a7c66", "#82745e"], wall: ["#3b2e22", "#33281d"], water: ["#4a86a8", "#437d9e"], tall: "#7a6a52", tint: "255,220,160", tintA: 0.1, fx: "", dark: 0.1 }
    },
    floors: "Yme", solid: "FKVEIC",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g;
      if (f === "Y") { // tappeto rosso con bordo dorato
        g.fillStyle = (tx + ty) % 2 ? "#9f1239" : "#951034"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(sx, sy + 15, 16, 1);
        g.fillStyle = "rgba(224,180,74,.5)"; g.fillRect(sx, sy + 2, 16, 1); g.fillRect(sx, sy + 13, 16, 1); if ((tx + ty) % 3 === 0) { g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(sx + 6, sy + 6, 4, 4); } return true;
      }
      if (f === "m") { // marmo a scacchi
        g.fillStyle = (tx + ty) % 2 ? "#e8dfc9" : "#2a2a30"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(sx, sy, 16, 1); g.fillStyle = "rgba(0,0,0,.15)"; g.fillRect(sx + 15, sy, 1, 16); return true;
      }
      if (f === "e") { // selciato a ciottoli
        g.fillStyle = (tx * 3 + ty) % 2 ? "#a99a7c" : "#a2937a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.16)";
        [[1, 1, 6, 5], [8, 1, 7, 6], [2, 8, 5, 6], [8, 8, 6, 6]].forEach(([x, y, w, h]) => { g.fillRect(sx + x, sy + y + h - 1, w, 1); g.fillRect(sx + x + w - 1, sy + y, 1, h); });
        g.fillStyle = "rgba(255,255,255,.1)"; g.fillRect(sx + 2, sy + 2, 4, 1); g.fillRect(sx + 9, sy + 9, 4, 1); return true;
      }
      return false;
    },
    paint: {
      // fontana a due vasche con getto
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 8, 2.5, 0, 0, 7); g.fill();
        g.fillStyle = "#8d8470"; g.beginPath(); g.ellipse(sx + 8, sy + 11, 8, 4, 0, 0, 7); g.fill(); g.fillStyle = "#4a86a8"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 6.5, 3, 0, 0, 7); g.fill();
        g.fillStyle = "#9b927e"; g.fillRect(sx + 7, sy + 3, 2, 7); g.fillStyle = "#cfe9f5"; for (let i = 0; i < 3; i++) g.fillRect(sx + 7 + (i - 1) * 2, sy + 2 + ((fr / 5 + i * 2) % 4 | 0), 1, 2);
        g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(sx + 4 + ((fr / 6) % 6 | 0), sy + 10, 2, 1);
      },
      // candelabro a cinque bracci
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 5, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#a16207"; g.fillRect(sx + 7, sy + 6, 2, 8); g.fillRect(sx + 4, sy + 13, 8, 2); g.strokeStyle = "#ca8a04"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx + 2, sy + 4); g.quadraticCurveTo(sx + 8, sy + 9, sx + 14, sy + 4); g.stroke();
        [2, 5, 8, 11, 14].forEach((x, i) => { g.fillStyle = "#f4ecd8"; g.fillRect(sx + x - 1, sy + 2 + (i % 4 === 0 ? 1 : 0), 2, 3); g.fillStyle = "#ffb347"; g.fillRect(sx + x - 0.5, sy + 1 + (i % 4 === 0 ? 1 : 0) + Math.sin(fr / 4 + i) * 0.4, 1, 2); });
        K.light(sx + 8, sy + 3, 34, "255,170,70", 0.4);
      },
      // vetrina dei trofei
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3b2a1c"; g.fillRect(sx, sy + 1, 16, 14); g.fillStyle = "#1c1410"; g.fillRect(sx + 1, sy + 2, 14, 12); g.fillStyle = "rgba(180,220,235,.18)"; g.fillRect(sx + 1, sy + 2, 14, 12);
        g.fillStyle = "#ca8a04"; g.fillRect(sx + 3, sy + 9, 3, 4); g.fillRect(sx + 2, sy + 8, 5, 2); g.fillStyle = "#d6d3d1"; g.fillRect(sx + 9, sy + 10, 4, 3); g.fillRect(sx + 10, sy + 7, 2, 3);
        g.fillStyle = `rgba(255,255,255,${0.15 + 0.1 * Math.sin(fr / 20 + tx)})`; g.fillRect(sx + 2, sy + 3, 4, 1);
      },
      // botte di legno
      E(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 7, 2.2, 0, 0, 7); g.fill();
        g.fillStyle = "#7c4a24"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 7, 7, 0, 0, 7); g.fill(); g.fillStyle = "#a0642e"; g.fillRect(sx + 3, sy + 3, 2, 10); g.fillRect(sx + 7, sy + 2, 2, 12); g.fillRect(sx + 11, sy + 3, 2, 10);
        g.fillStyle = "#3b2312"; g.fillRect(sx + 1, sy + 5, 14, 1); g.fillRect(sx + 1, sy + 10, 14, 1);
      },
      // stendardo del club, granata e oro, su asta
      I(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, w = Math.sin(fr / 14 + tx) * 1.2; g.fillStyle = "#6b7280"; g.fillRect(sx + 3, sy, 1, 16);
        g.fillStyle = "#7f1d1d"; g.beginPath(); g.moveTo(sx + 4, sy + 1); g.lineTo(sx + 14 + w, sy + 2); g.lineTo(sx + 14 + w, sy + 9); g.lineTo(sx + 9, sy + 11); g.lineTo(sx + 4, sy + 9); g.closePath(); g.fill();
        g.fillStyle = "#e0b44a"; g.fillRect(sx + 6, sy + 4, 6 + w * 0.4, 1); g.fillRect(sx + 8, sy + 6, 3, 2);
      },
      // armadietto metallico dello spogliatoio
      C(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const g = K.g, c = ["#3f6b55", "#4a5a7a", "#6b5a3f"][(tx + ty) % 3]; g.fillStyle = c; g.fillRect(sx + 1, sy + 1, 14, 14); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 8, sy + 1, 1, 14);
        g.fillStyle = "rgba(255,255,255,.14)"; g.fillRect(sx + 1, sy + 1, 14, 1); g.fillStyle = "#1c1917"; for (let i = 0; i < 3; i++) { g.fillRect(sx + 3, sy + 3 + i * 2, 3, 1); g.fillRect(sx + 10, sy + 3 + i * 2, 3, 1); }
        g.fillStyle = "#d4d4d8"; g.fillRect(sx + 6, sy + 8, 1, 2); g.fillRect(sx + 9, sy + 8, 1, 2); g.fillStyle = "#fde68a"; g.fillRect(sx + 3, sy + 11, 3, 2);
      }
    },
    act: { F: "Guarda la fontana", K: "Guarda i candelabri", V: "Guarda i trofei", E: "Guarda le botti", I: "Guarda lo stendardo", C: "Guarda l'armadietto", n: "Leggi il cartello", x: "Apri la cassa", s: "Riposa un momento", q: "Entra", b: "Siediti" },
    rest: { ch: "s", label: "Riposa un momento", text: "Ti siedi un attimo, tolta la maschera del momento. Il gioco salva da solo. Dal menu puoi cambiare faccia e rileggere il Dossier." },
    texts: { nothing: "Niente di utile. Solo polvere e ricordi che non sono tuoi.", noHero: "Per recitare serve un volto. Crea prima il tuo Campione.", chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota. Qualcuno è passato prima di te." },
    journal: { name: "Il Dossier del Conte", sub: "Prove, maschere e rapporti" },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Conoscenti", "Alleati", "Fidati", "Famiglia"],
      scenes: {
        ct_nina: [{ lv: 2, id: "nin2", lines: [["ct_nina", "Mio padre allenava i ragazzi con un pallone sgonfio. Diceva che se impari con quello, col pallone vero voli."], ["ct_nina", "[pensa] Non l'ho mai sentito parlare di buste. Neanche di soldi. Solo di Montecalcio."]], reward: (K) => K.bond("campo", 1) },
          { lv: 3, id: "nin3", prize: "Le chiavi dell'ufficio di Mister Ferrante", lines: [["ct_nina", "Ho tenuto chiuso l'ufficio di mio padre per quindici anni. Non so cosa cerco, ma so che non è finito tutto lì."], ["ct_nina", "[serio] Tieni. Se trovi qualcosa, dimmelo prima che lo trovi qualcun altro."]], reward: (K) => { K.inv && !K.inv.has("ct_chiavi") && K.inv.give("ct_chiavi"); } }],
        ct_gino: [{ lv: 2, id: "gin2", lines: [["ct_gino", "Ero il capitano, quel pomeriggio. Quando hanno trovato la busta mi hanno chiesto se ero sorpreso. Ho detto di no. Non so ancora perché."], ["ct_gino", "[pensa] Da allora servo caffè e guardo la porta."]], reward: (K) => K.bond("strada", 1) }],
        ct_ersilia: [{ lv: 2, id: "ers2", lines: [["ct_ersilia", "Sa cos'è la beneficenza, Conte? È pagare il conto di qualcuno che non ringrazierà. Io la pratico da quarant'anni, con grande profitto."], ["ct_ersilia", "[furbo] Il profitto, naturalmente, è non dover guardare chi mi sta davanti."]], reward: (K) => K.bond("salotti", 1) }],
        ct_cosimo: [{ lv: 2, id: "cos2", lines: [["ct_cosimo", "In sagrestia si conservano i registri dei battesimi e, per vizio, anche quelli delle partite. Non ne ho mai buttato uno."], ["ct_cosimo", "[pensa] Una sera di quindici anni fa qualcuno ha voluto sfogliarne uno. Poi ha chiesto di dimenticarlo. Io non dimentico: archivio."]], reward: (K) => K.bond("campo", 1) }]
      }
    },
    inv: {
      items: {
        ct_baffi: { n: "Baffi di scena", icon: "🥸", d: "Baffi d'attore, colla di cartoleria. Una volta sola, se qualcuno ti riconosce con un'altra faccia, dici che si sbaglia. E ci crede.", gift: { ct_gino: 4, ct_tullio: 6 }, giftAny: 1, react: { ct_tullio: "Baffi finti?! Ahah, il Mercante ne ha anche di veri, ma questi hanno più carattere. Grazie." } },
        ct_chiavi: { n: "Chiavi dell'ufficio di Ferrante", icon: "🗝️", d: "Un anello con quattro chiavi e un fischietto d'ottone. Una chiave non entra in nessuna serratura nota.", gift: { ct_nina: 0 }, giftAny: 0 },
        ct_caffe: { n: "Caffè del Moro", icon: "☕", d: "Un espresso nero, versato col polso. Gino dice che aiuta a parlare. Gino mente su tante cose, su questa no.", gift: { ct_gino: 4, ct_tullio: 3, ct_cosimo: 3, ct_beppe: 2 }, giftAny: 2, react: { ct_cosimo: "Un caffè dal Moro! Ho peccato un po' di gola, ma questo conta come penitenza." } },
        ct_scarpini: { n: "Scarpini di Beppe", icon: "👟", d: "Scarpini bucati, rattoppati con nastro isolante nero. Dentro, in pennarello, un numero: 9.", gift: { ct_beppe: 10, ct_nina: 5 }, giftAny: 1, react: { ct_beppe: "Sono i miei! L'ho cercato per una settimana. Il nove… si porta bene, vero?" } },
        ct_nastro: { n: "Nastro di Ferrante", icon: "📼", d: "Una cassetta: «Riunione Consiglio, 14 giugno». Etichetta con la calligrafia del Mister.", gift: { ct_nina: 12 }, giftAny: 1, react: { ct_nina: "La voce di papà. Non l'ho ascoltata da quindici anni. Mi serve una sedia." } }
      }
    },
    clock: { slots: ["Mattina", "Pomeriggio", "Sera"], hud: true, tint: [null, "rgba(255,170,90,.05)", "rgba(40,20,70,.18)"], onSlot(K, giorno, fascia, nome) { return nome === "Sera" ? [["voce", "Sera. Le finestre del Palazzo si accendono una alla volta. Nel borgo si dice che sia l'ora in cui le facce si cambiano da sole."]] : null; } },
    endings: {
      verita: ["La Verità del Conte", "Alzi la maschera davanti a tutti, con le prove in mano. Montecalcio ascolta in silenzio, poi qualcuno comincia ad applaudire e non si capisce se per te o per sollievo.", "Accusa il colpevole davanti al paese, con le prove giuste."],
      conto: ["Il Conto Saldato", "Non ci sono tribunali né applausi. Il colpevole perde tutto, un pezzo alla volta, e nessuno sa chi ha tirato il filo. Tu, nel frattempo, ti sei fatto un nuovo nome.", "Scegli la vendetta silenziosa invece della verità."],
      custode: ["Il Custode", "Segreto: tieni la chiave, ti togli il Conte e il Mercante e resti Custode. Solo Nina sa chi sei. Il campo, la domenica, è pieno. Basta questo.", "Segreto: conquista tutte e tre le maschere, resta poco sospetto e racconta la verità solo a Nina."]
    },
    heroLook: (h, K) => { const m = MASKS[(K && K.F ? K.F.get("ct_mask", "conte") : "conte")] || MASKS.conte; return { bg: m.look.bg, shirt: m.look.shirt }; },
    heroTitle: () => { const k = mem(); return (MASKS[k && k.F ? k.F.get("ct_mask", "conte") : "conte"] || MASKS.conte).title; },
    zoneMenuExtra: (K) => (K.F.is("ct_has_mercante") || K.F.is("ct_has_custode") ? [{ label: `🎭 Cambia maschera (${MASKS[K.F.get("ct_mask", "conte")].short})`, sub: "Costa una fascia dell'orologio", fn: () => K.mask.open(() => K.done()) }] : []),
    mainExtra: (K) => (K.F.is("ct_has_mercante") || K.F.is("ct_has_custode") ? [{ label: "🎭 Le Maschere", sub: `Adesso: ${MASKS[K.F.get("ct_mask", "conte")].n}`, fn: () => K.mask.open(() => K.openMain()) }] : []),
    musicMain: "montecalcio",
    music: { montecalcio: { bpm: 84, chords: ["Dm", "Bb", "F", "A", "Dm", "Gm", "A", "Dm"], lres: 2, lw: "triangle", lv: 0.04,
      lead: "D5 - - F5 - - A5 - | G5 - - F5 - - E5 - | F5 - - A5 - - C6 - | A5 - - - - - - - | D5 - - E5 - - F5 - | G5 - - F5 - - E5 - | E5 - - F5 - - E5 - | D5 - - - - - - -",
      bass: "R . . . R . . 5 R . . . R . 5 .", bv: 0.1, arp: "1 5 8 5 1 5 8 5", aw: "triangle", av: 0.012, drum: "k . . . s . . . k . . h s . . .", dv: 0.07 } },
    guide: () => [["🎭 Le Maschere", "Tre facce: Conte (Salotti), Mercante (Strada), Custode (Campo). Cambi maschera dal menu: costa una fascia dell'orologio. Ognuno ricorda con quale faccia l'hai conosciuto: se lo reincontri con un'altra, può accorgersene e il Sospetto sale."], ["🕵️ Le prove", "Parli, cerchi, raccogli indizi nel Dossier. Alla fine li presenti: le prove giuste valgono più dei pugni."], ["🎩 Il Ballo in Maschera", "Un minigioco a tempo: gli invitati ti salutano, tu rispondi con la maschera che conoscono. Lo trovi anche in Sala Giochi."]],
    party: () => [],
    cameos: [],
    stadium: { azPitch: "cortile", venue: { ads: [["MONTECALCIO · DAL 1907", "#7f1d1d"], ["BAR SPORT DEL MORO", "#92400e"], ["CASSA RURALE", "#1e3a5f"]], crowd: "#7f1d1d", ground: ["#3f8f4a", "#3a8745"], line: "#ffffffcc", tint: "255,235,190", sky: ["#7aa7d6", "#e9d9b4"], wall: ["#8a7a5a", "#7a6a4a"] } },
    guest: { id: "ct_ettore", lines: ["Ettore, maggiordomo di Palazzo Vanni. Ho il giorno libero: l'ho dedicato a fare l'unica cosa che so, servire.", "Se avesse bisogno di sapere chi c'era e chi no, a una festa, mi chieda. Io non ho visto niente. Questo è quello che ho visto."] }
  });
  const K0 = E.K;
  window.__conteCore = E;

  // ------------------------------------------------------------ LE MASCHERE (novità della saga)
  const maskCur = (K) => { const m = K.F.get("ct_mask", "conte"); return MASKS[m] ? m : "conte"; };
  function recastHero(K) {
    const C = K.api && K.api.CAST; if (!C || !C.hero) return; const m = MASKS[maskCur(K)];
    C.hero = Object.assign({}, C.hero, { bg: m.look.bg, shirt: m.look.shirt, tag: m.short });
  }
  K0.mask = {
    MASKS, GRP,
    cur: () => maskCur(K0),
    info: (id) => MASKS[id || maskCur(K0)],
    has: (id) => id === "conte" || K0.F.is("ct_has_" + id),
    unlock: (id) => { if (MASKS[id]) K0.F.set("ct_has_" + id, true); },
    rep: (id) => K0.stat(MASKS[id || maskCur(K0)].grp),
    set(id, free) {
      if (!MASKS[id] || !K0.mask.has(id) || id === maskCur(K0)) return false;
      K0.F.set("ct_mask", id); recastHero(K0);
      if (!free && K0.clock) K0.clock.advance(1);
      return true;
    },
    // il PNG ricorda con quale faccia l'hai conosciuto: "new" (prima volta), "same", "diff" (se ne accorge: Sospetto +1, una volta sola per persona; i Baffi di scena evitano il guaio)
    meet(id, perceptive) {
      const m = maskCur(K0), key = "ct_m_" + id, was = K0.F.get(key, "");
      if (!was) { K0.F.set(key, m); return "new"; }
      if (was === m) return "same";
      if (!perceptive || K0.F.is("ct_n_" + id)) return "same";
      K0.F.set("ct_n_" + id, true);
      if (K0.inv && K0.inv.has("ct_baffi") && K0.inv.take) { K0.inv.take("ct_baffi"); return "covered"; }
      K0.bond("sospetto", 1); return "diff";
    },
    was: (id) => K0.F.get("ct_m_" + id, ""),
    count: () => ["conte", "mercante", "custode"].filter((m) => K0.mask.has(m)).length,
    open(back) {
      const cur = maskCur(K0), opts = Object.keys(MASKS).map((id) => {
        const M = MASKS[id], on = id === cur, has = K0.mask.has(id);
        return { label: `${M.icon} ${M.n}${on ? " · addosso" : ""}`, sub: has ? `${M.d} · ${GRP[M.grp]} ${K0.stat(M.grp)}/10` : "Non l'hai ancora (si trova nel baule del camerino).", disabled: on || !has, cls: on ? "hot" : "", fn: () => { K0.mask.set(id); K0.say([["voce", `Ti cambi: ${M.icon} <b>${M.n}</b>. Un trucco, un cappello, una voce nuova. Passa una fascia dell'orologio.`]], () => (back ? back() : K0.done())); } };
      });
      K0.api.trAsk("voce", `🎭 <b>Le Maschere</b><br><span style="color:var(--dim)">Sospetto ${K0.stat("sospetto")}/10 · Salotti ${K0.stat("salotti")} · Strada ${K0.stat("strada")} · Campo ${K0.stat("campo")}</span>`, opts.concat([{ label: "◂ Indietro", fn: back || (() => K0.done()) }]), "ct_titolo");
    }
  };
  // aggiunta al menu di zona
  window.__conteMasks = MASKS;

  // ------------------------------------------------------------ aiutanti per i capitoli
  window.__conteH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1f2937", skin: "#e0b890" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "700 6px Georgia, serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(28,12,8,.9)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#e0b44a"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = col || "#fde68a"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.restore(); },
      // reazione alla faccia: ritorna true se il PNG si accorge e il dialogo è stato preso in carico
      notice(id, perceptive, lines) {
        const r = K.mask.meet(id, perceptive);
        if (r === "diff") { QL.push(...lines); QL.push(["voce", "<b>Sospetto +1.</b> Qualcuno ha cominciato a sommare le facce."]); H.done(); return true; }
        if (r === "covered") { QL.push(["voce", "Per un attimo ti guarda come se ti avesse già visto. I baffi finti tengono: «Mi scusi, mi ricorda qualcuno». Una volta sola."]); return false; }
        return false;
      },
      // gruppo di appartenenza e reputazione: la prima chiacchierata con la maschera giusta dà +1 al gruppo
      rep(id, grp) { if (K.mask.info().grp === grp && !K.F.is("ct_rp_" + id)) { K.F.set("ct_rp_" + id, true); K.bond(grp, 1); return true; } return false; },
      clues: () => ["ct_busta", "ct_registro", "ct_referto", "ct_lettera", "ct_timbro"].filter((c) => K.hasClue(c)).length,
      people() {
        H.cast("ct_brandolini", "Sindaco Brandolini", "Sindaco e presidente onorario", { style: "slick", hair: "#a3a3a3", shirt: "#1e3a5f", skin: "#e8c4a0", eye: "#1e40af", acc: ["occhiali"], bg: ["#1e293b", "#bae6fd"] }, "Alvise Brandolini: da trent'anni sindaco, presidente onorario e uomo che arriva sempre quando c'è un nastro da tagliare. Parla di «comunità» con la stessa convinzione con cui un oste parla di «vino della casa».");
        H.cast("ct_ersilia", "Contessa Ersilia Vanni", "Mecenate di Palazzo Vanni", { style: "bun", hair: "#d4d4d8", shirt: "#4c1d95", skin: "#f1d9c0", eye: "#7c3aed", acc: ["perle"], bg: ["#2e1065", "#e9d5ff"] }, "Ottant'anni, tre cani, un palazzo e la convinzione che il Montecalcio sia un suo nipote difficile. Offre dolci e giudizi a velocità identica.");
        H.cast("ct_gino", "Gino «il Moro»", "Barista, ex capitano", { style: "buzz", hair: "#1c1917", shirt: "#7c2d12", skin: "#b87a4b", eye: "#1c1917", beard: "incolta", acc: ["grembiule"], bg: ["#451a03", "#fcd34d"] }, "Gino Pasqualin, per tutti il Moro. Capitano del Montecalcio ai tempi della busta, oggi ha il Bar Sport e una macchina del caffè con più storia della squadra. Ricorda tutto e dice la metà.");
        H.cast("ct_ottavia", "Dott.ssa Ottavia Serra", "Medico sociale", { style: "bob", hair: "#7c2d12", shirt: "#f8fafc", skin: "#e8c4a0", eye: "#15803d", acc: ["occhiali"], bg: ["#064e3b", "#a7f3d0"] }, "Medico del Montecalcio da vent'anni. Ha visto ginocchia, bugie e un referto che avrebbe preferito non firmare. Dice sempre «respiri» a chi ha ancora qualcosa da dire.");
        H.cast("ct_cosimo", "Don Cosimo", "Parroco e cappellano del club", { style: "bald", hair: "#e5e7eb", shirt: "#111827", skin: "#d9a679", eye: "#4b5563", beard: "folta", acc: ["collare"], bg: ["#1f2937", "#d1d5db"] }, "Parroco di San Cosimo da prima della squadra. Benedice la squadra ogni domenica e, per scrupolo, anche gli arbitri. In sagrestia conserva i registri di battesimi e partite.");
        H.cast("ct_nina", "Nina Ferrante", "Allenatrice dei ragazzi", { style: "long", hair: "#1c1917", shirt: "#7f1d1d", skin: "#e0b890", eye: "#78350f", acc: ["fischietto"], bg: ["#450a0a", "#fecaca"] }, "Figlia di Mister Ferrante. Allena i ragazzi del Montecalcio con un pallone sgonfio e la certezza che il padre non c'entri con nessuna busta. Non ha ancora capito chi sia il Custode, ma lo osserva.");
        H.cast("ct_tullio", "Tullio «Pilastro»", "Capo della Curva Nord", { style: "spiky", hair: "#1c1917", shirt: "#7f1d1d", skin: "#c8956a", eye: "#1c1917", beard: "folta", scar: true, bg: ["#450a0a", "#fca5a5"] }, "Panettiere di giorno, capo della Curva di notte. Alto come una porta e leale come un cane. Il suo striscione più famoso dice: «NON CI AVETE CAPITO, MA CI AVETE SENTITO».");
        H.cast("ct_beppe", "Beppe", "Ragazzo di diciassette anni", { style: "messy", hair: "#7c2d12", shirt: "#7f1d1d", skin: "#f1d1b0", eye: "#1e40af", bg: ["#7f1d1d", "#fde68a"] }, "Diciassette anni, un tiro di sinistro che fa smettere di masticare il pubblico e scarpini bucati. Gioca col numero nove. Ti ricorda qualcuno e non sai chi, ma lo sai.");
        H.cast("ct_ettore", "Ettore", "Maggiordomo di Palazzo Vanni", { style: "slick", hair: "#6b7280", shirt: "#111827", skin: "#e8c4a0", eye: "#1f2937", beard: "pizzetto", acc: ["papillon"], bg: ["#111827", "#e5e7eb"] }, "Maggiordomo di Palazzo Vanni da quarant'anni. Non ha visto niente, non ha sentito niente e ricorda ogni cosa. Dice «certamente» in sei toni diversi, e ognuno vuol dire qualcosa.");
        H.cast("ct_remo", "Remo Sacchi", "Allenatore della Valdorcia", { style: "short", hair: "#475569", shirt: "#1e3a8a", skin: "#d9a679", eye: "#1e3a8a", acc: ["cappellino"], bg: ["#1e3a8a", "#bfdbfe"] }, "Allena la Valdorcia, rivale storica. Conosce un solo modulo, il suo, e lo difende come un testamento. Dopo ogni partita parla con l'arbitro, non sempre con le stesse parole.");
        H.cast("ct_ferrante", "Mister Ferrante", "Ex allenatore del Montecalcio", { style: "bald", hair: "#9ca3af", shirt: "#7f1d1d", skin: "#d9a679", eye: "#1f2937", acc: ["fischietto"], beard: "baffi", bg: ["#450a0a", "#fecaca"] }, "Allenò il Montecalcio per ventidue anni con un pallone sgonfio, una radiolina e una regola: mai contare i soldi davanti a un ragazzo. Morì quindici anni fa, tre settimane dopo la busta.");
      }
    };
    return H;
  };
  window.__conte = E.api;
})();
