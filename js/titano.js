// js/titano.js - IL FIGLIO DEL TITANO · configurazione della saga sul motore comune (js/saga-core.js)
// Saga EPICA, nello spirito dei fumetti e delle serie animate di supereroi «di famiglia» (tutto inventato, niente violenza
// mostrata: qui ci si sfida in cielo, a calcio). Il Campione scopre di avere i poteri del padre, Atlante Varo, leggenda del
// calcio venuto da Elyon, il pianeta dei Titani del cielo. Poi scopre perché il padre è venuto sulla Terra.
// Novità di questa saga (oltre a quelle del motore comune):
//  - VOLO A TUTTO CAMPO (js/volo.js): la partita originale, con un motore suo. A tempo fermo disegni col dito la traiettoria
//    del volo; poi si vola, e gli avversari provano a tagliarti la strada. In difesa incroci la loro traiettoria al momento giusto.
//  - LE SCELTE A TEMPO (motore comune, ask con { secs, def }): nei momenti forti la risposta va data subito. Se esiti,
//    risponde il silenzio, e anche il silenzio cambia la storia.
//  - ANIMAZIONE AMERICANA: sfondi a contorni neri spessi, colori piatti, «impact frame» in negativo nei colpi di scena.
// Salvataggio proprio: ali-di-rondine.titano. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__titano || !window.__sagaCore) return;
  const E = window.__sagaCore.create({
    id: "titano", key: "ali-di-rondine.titano", title: "Il Figlio del Titano", icon: "🌠", bg: "ft_titolo", chapters: 3,
    menuSub: "I poteri di tuo padre, un pianeta di Titani, e la partita che decide se la Terra resta della Terra",
    theme: { accent: "#ffd23f", ink: "#ffffff", paper: "rgba(20,24,48,.94)", font: "system-ui, sans-serif", chipBg: "#14183aee", chipBorder: "#c83a2a" },
    stats: { famiglia: [0, 99, 0, "Il legame con la famiglia"], cielo: [0, 99, 0, "Il richiamo del cielo"] },
    travel: true,
    item: ["Anello di nuvola", "Anelli di nuvola"],
    stadium: { azPitch: "campo", cageField: 3, cageMut: "turbo", venue: { ads: [["ALTAMIRA FC", "#c83a2a"], ["AGENZIA CELESTE", "#3a6ac8"], ["IL TITANO È TORNATO", "#ffd23f"], ["ELYON", "#7a5ad8"]], crowd: ["#c83a2a", "#ffd23f", "#3a6ac8", "#ffffff", "#7a5ad8"], ground: ["#3aa04a", "#36984a"], line: "#ffffffdd", grid: "rgba(255,255,255,.05)", tint: "rgba(120,170,255,.08)", glow: "200,220,255", sky: ["#2a5ac8", "#a8d8ff"], wall: ["#e8eef8", "#c8d4e8"], fx: { spd: 1.08, wind: 0.01 } } },
    regions: {
      citta: { grass: ["#4aa04a", "#46984a", "#4ea84e"], path: ["#b8b0a8", "#b0a8a0"], stone: ["#a8a8b0", "#a0a0a8"], wall: ["#e8dcc8", "#dcd0bc"], water: ["#3a7ac8", "#4686d4"], tall: "#3a8a3a", tree: ["#2a7a3a", "#327e40", "#2c7c3c"], tint: "255,240,210", tintA: 0.06, fx: "", dark: 0.03 },
      cielo: { grass: ["#e8f2ff", "#e0ecfc", "#f0f6ff"], path: ["#ffffff", "#f4f8ff"], stone: ["#c8d8f0", "#c0d0e8"], wall: ["#b8cce8", "#b0c4e0"], water: ["#4a8ad8", "#5696e0"], tall: "#d8e8ff", tint: "200,220,255", tintA: 0.1, fx: "float", dark: 0 },
      porto: { grass: ["#3a5a4a", "#365646", "#3e5e4e"], path: ["#6a6a72", "#64646c"], stone: ["#7a7a82", "#74747c"], wall: ["#4a4a5a", "#444454"], water: ["#1a3a6a", "#204070"], tall: "#3a5a3a", tree: ["#2a4a3a", "#2e4e3e", "#2c4c3c"], tint: "120,150,230", tintA: 0.16, fx: "", dark: 0.18 },
      arena: { grass: ["#2a2a5a", "#282858", "#2c2c5c"], path: ["#8a7ad8", "#8474d0"], stone: ["#5a5a8a", "#565686"], wall: ["#3a3a6a", "#363666"], water: ["#0a0a2a", "#0e0e30"], tall: "#4a4a8a", tint: "180,150,255", tintA: 0.14, fx: "float", dark: 0.08 },
      casa: { grass: ["#8a7a5a", "#847454", "#8e7e5e"], path: ["#a89878", "#a09070"], stone: ["#c8c0b0", "#c0b8a8"], wall: ["#6a5a8a", "#645484"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,220,170", tintA: 0.1, fx: "dust", dark: 0.05 },
    },
    floors: "&", solid: "CU",
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi. Senti ancora il vento in faccia, anche se sei fermo. (Il gioco salva da solo: qui puoi rileggere il Fumetto del Titano.)" },
    texts: { chestOpen: "Apri la cassetta.", chestEmpty: "La cassetta è vuota.", nothing: "Niente. Solo un aereo, lontano, molto più lento di te.", noHero: "Altamira aspetta il suo Titano. Crea prima il tuo Campione." },
    journal: { name: "Il Fumetto del Titano", sub: "Poteri, famiglia, Elyon, finali" },
    endings: {
      padre: ["IL TITANO RESTA", "Atlante Varo si toglie il mantello di Elyon e lo piega con cura, come una maglia vecchia. «Ho girato cento pianeti», dice. «Questo è l'unico dove qualcuno mi aspetta a cena.»", "Serve che tuo padre abbia scelto di giocare con te."],
      agenzia: ["IL GUARDIANO DEL CIELO", "L'Agenzia Celeste ti dà un distintivo, un numero di telefono e un pallone ufficiale. Da oggi, quando qualcosa cade dal cielo, la chiamano «una faccenda tua».", "Sempre possibile, alla fine."],
      stelle: ["VERSO LE STELLE", "Parti con Vega verso Elyon, per cambiare le regole del Torneo Eterno da dentro. La Terra ti saluta dal campo di Altamira: tua madre ha cucito il tuo nome sulla bandiera.", "Serve la fiducia di Vega."],
      titani: ["I DUE TITANI", "Padre e figlio, fianco a fianco, nella partita del cielo. Orione guarda il punteggio a lungo, poi abbassa la bandiera di Elyon. «Due Titani che giocano per amore», dice. «Non avevamo una regola, per questo.»", "Segreto: tutti gli anelli di nuvola, tuo padre e Vega dalla tua parte, e nessuna partita lasciata a metà."],
    },
    heroLook: (h, K) => ({ bg: ["#14183a", "#c83a2a"], shirt: K.F.is("ft_tuta") ? "#c83a2a" : h.shirt }),
    heroTitle: (K) => (K.F.is("ft_tuta") ? "il Figlio del Titano" : "il numero dieci dell'Altamira"),
    heroFx: (K, zid) => (K.F.is("ft_tuta") && /cielo|arena/.test(zid) ? { dy: -4, cape: "#ffd23f", aura: "255,210,63" } : null),
    act: { q: "Entra", U: "Guarda la console", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = { C: "Una nuvola così fitta che ci si potrebbe sedere sopra. (Ci provi. Ci riesci. Poi ci cadi dentro.)", U: "Una console dell'Agenzia Celeste: mappe del cielo, puntini che si muovono, un pulsante rosso con scritto «NON PREMERE». Non lo premi." }[ch];
        if (!t) return false; K.say([["voce", t]]); return true;
      },
    }],
    musicMain: "titano",
    music: {
      // un tema da sigla di supereroi: ottoni (quadra), basso pieno, rullante marziale
      titano: { bpm: 138, chords: ["C", "Ab", "Bb", "C", "F", "Ab", "G", "G"], lres: 2, lw: "square", lv: 0.04,
        lead: "C5 - G5 - - - C6 - | Ab5 - - - Eb5 - - - | Bb5 - - F5 - Bb5 - D6 | C6 - - - - - - - | F5 - A5 - C6 - F6 - | Eb6 - - C6 - Ab5 - - | G5 - B5 - D6 - G6 - | G6 - - - - - - -",
        bass: "R . R . 5 . R . R . R . 5 . 8 .", bv: 0.1, arp: "1 5 8 5 1 5 8 5 1 5 8 5 1 5 8 5", aw: "triangle", av: 0.012, drum: "k . s . k k s . k . s . k k s s", dv: 0.17 },
    },
    paint: {
      // nuvola calpestabile (pavimento): soffice, con i riflessi
      "&"(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = (tx + ty) % 2 ? "#f4f8ff" : "#eaf2ff"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.arc(sx + 5 + Math.sin(fr / 40 + tx) * 1.5, sy + 6, 4, 0, 7); g.arc(sx + 11, sy + 10, 3.5, 0, 7); g.fill(); g.fillStyle = "rgba(160,190,230,.35)"; g.fillRect(sx, sy + 14, 16, 2); },
      // banco di nuvole (solido)
      C(K, sx, sy, tx, ty, fr) { const g = K.g, o = Math.sin(fr / 50 + tx * 0.7) * 1; g.fillStyle = "#c8d8f0"; g.fillRect(sx, sy + 8, 16, 8); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(sx + 4, sy + 9 + o, 6, 0, 7); g.arc(sx + 11, sy + 7 - o, 7, 0, 7); g.arc(sx + 8, sy + 3, 5, 0, 7); g.fill(); g.strokeStyle = "rgba(20,24,58,.25)"; g.lineWidth = 1; g.stroke(); },
      // console dell'Agenzia Celeste
      U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2a2e4a"; g.fillRect(sx + 1, sy + 4, 14, 11); g.fillStyle = "#14183a"; g.fillRect(sx + 3, sy + 6, 10, 6); g.fillStyle = "#3aa0ff"; for (let i = 0; i < 3; i++) g.fillRect(sx + 4 + ((fr / 5 + i * 3 + tx) % 8), sy + 7 + i * 2, 2, 1); g.fillStyle = (fr / 20 + tx) % 2 < 1 ? "#ff3a3a" : "#5a1a1a"; g.fillRect(sx + 12, sy + 13, 2, 2); K.light(sx + 8, sy + 9, 14, "80,160,255", 0.25); },
    },
    guest: { id: "ft_sam", lines: [["ft_sam", "[ride] {n}! Il Borgo Marino! Si vede da lassù, sai? È quello con le case colorate e il campetto storto. (Si guarda le mani.) Io non volo. Però corro forte. Una partita?"]] },
    cameos: [
      { id: "mg_bullone", zone: "ft_citta", at: [5, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.mantello") || {}).done?.[1], lines: [["mg_bullone", "BIP. Un umano che vola senza mantello? (Ricalcola.) Il mantello, a Metropolenta, è facoltativo? Devo dirlo alla Capitana."]] },
      { id: "so_zorgo", zone: "ft_cielo", at: [6, 4], when: (K) => !!(K.otherSaga("ali-di-rondine.spazio") || {}).done?.[1], lines: [["so_zorgo", "[felice] Tre occhi e nessuna ala, io. Tu due occhi e nessuna ala, ma voli. L'universo è ingiusto. Partita?"]] },
    ],
  });
  const K = E.K;
  // la partita originale della saga: Volo a Tutto Campo
  K.volo = (o, done) => K.ownMatch(window.__volo.start, Object.assign({ hero: null, usColor: "#c83a2a", us: "Altamira" }, o, { done: (r) => { if (r.quit) K.F.set("ft_lasciato", true); done(r); } }));
  window.__titano = E.api;
})();
