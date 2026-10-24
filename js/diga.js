// js/diga.js - «LA DIGA DI VALPIANA» · configurazione della saga sul motore comune (js/saga-core.js)
// Valpiana, un paese di montagna sotto una diga vecchia di quarant'anni. Un torneo di beneficenza per pagarne la riparazione e un lago che sale.
// Tono: mix. Ironia di paese (il barcaiolo, la sindaca con troppe cose da fare, l'idraulico allenatore) e momenti seri (il paese sotto il lago, il custode, una partita mai giocata).
// Usa dal core: orologio a fasce, Rapporti, Inventario, Dossier (cfg.cases), interni a mano, K.playMatch, K.ownMatch (minigioco).
// NOVITÀ nel core (opt-in, js/saga-core.js): ACQUA CHE SALE (cfg.flood + spec.flood): un livello che cresce con l'orologio e per eventi, e allaga davvero le mappe (K.flood.get/add/drain/set).
// NOVITÀ minigioco: «Argine» (js/diga-argine.js), costruito con Phaser 3: l'acqua scivola lungo le file di sacchi che trascini con il dito. Anche in Sala Giochi.
// Diversa da: Naufraghi (marea), Officina (pressione), Scatola Vuota (furtivo). Qui il tempo è l'acqua e la mappa cambia davvero.
(function () {
  "use strict";
  if (window.__diga || !window.__sagaCore) return;
  const rn = (x, y, s) => { const v = Math.sin(x * 127.1 + y * 311.7 + (s || 0) * 74.7) * 43758.5453; return v - Math.floor(v); };
  const H = {
    rn,
    plaque(g, txt, x, y, col) { g.font = "bold 7px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 10; g.fillStyle = "rgba(14,20,30,.88)"; g.fillRect(x - w / 2, y - 8, w, 11); g.fillStyle = col || "#38bdf8"; g.fillRect(x - w / 2, y + 2, w, 1); g.fillStyle = "#f1f5f9"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; },
    border(L, w, h, ch) { L.lay(0, 0, w - 1, 0, ch); L.lay(0, h - 1, w - 1, h - 1, ch); L.lay(0, 0, 0, h - 1, ch); L.lay(w - 1, 0, w - 1, h - 1, ch); },
    scatter(L, seed, x0, y0, x1, y1, ch, n, avoid) { let c = 0; for (let i = 0; i < n * 6 && c < n; i++) { const x = x0 + Math.floor(rn(i, seed, 1) * (x1 - x0 + 1)), y = y0 + Math.floor(rn(i, seed, 2) * (y1 - y0 + 1)); if (avoid && avoid(x, y)) continue; L.put(x, y, ch); c++; } },
    // la stanza interna: pavimento, pareti e uscita in basso
    room(L, w, h, fl, ex) { L.lay(0, 0, w - 1, h - 1, fl || "o"); L.lay(0, 0, w - 1, 1, "a"); L.lay(0, 0, 0, h - 1, "a"); L.lay(w - 1, 0, w - 1, h - 1, "a"); L.lay(0, h - 1, w - 1, h - 1, "a"); L.put(ex == null ? Math.floor(w / 2) : ex, h - 1, "v"); },
    cast(K) {
      const C = (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio);
      C("vp_tilde", "Tilde Barca", "Sindaca di Valpiana", { style: "bun", hair: "#7c2d12", acc: ["occhiali"], shirt: "#be185d", skin: "#e8c4a0", bg: ["#831843", "#fbcfe8"] }, "Ha tre cariche, due telefoni e un solo paio di scarpe asciutte. Dice «ci penso io» come altri dicono buongiorno.");
      C("vp_gino", "Gino Pozzanghera", "Allenatore e idraulico", { style: "messy", hair: "#6b7280", beard: "incolta", acc: ["cappellino"], shirt: "#2563eb", skin: "#d9a679", bg: ["#1e3a8a", "#bfdbfe"] }, "Allena la squadra del paese e ripara i tubi di mezza valle. Dice che il calcio e l'idraulica sono la stessa cosa: la pressione va dosata.");
      C("vp_ermete", "Ermete Sluzzi", "Custode della diga", { style: "bald", hair: "#9ca3af", beard: "baffi", acc: ["casco"], shirt: "#92400e", skin: "#cf9a68", bg: ["#78350f", "#fde68a"] }, "Ex portiere, da quarant'anni vive sopra la diga. Ascolta i suoi muri come altri ascoltano la radio. Non spiega mai quello che sa.");
      C("vp_valvola", "Corrado Valvola", "Ingegnere dell'Ente Acque", { style: "slick", hair: "#1c1917", acc: ["occhiali", "taccuino"], shirt: "#475569", skin: "#e8c4a0", bg: ["#1e293b", "#cbd5e1"] }, "Manda rapporti a un ufficio che non risponde. Ha un cuore migliore del suo stile di comunicazione.");
      C("vp_lorenza", "Lorenza Fango", "Voce di Radio Valpiana", { style: "ponytail", hair: "#1f2937", streak: "#22d3ee", acc: ["cuffie"], shirt: "#0e7490", skin: "#c68642", bg: ["#164e63", "#a5f3fc"] }, "Trasmette dal retro del bar. Ha trecento ascoltatori, tutti parenti, tutti critici.");
      C("vp_zita", "Nonna Zita", "Memoria del vecchio paese", { style: "bun", hair: "#e5e7eb", acc: ["occhiali"], shirt: "#7c3aed", skin: "#efd2bb", bg: ["#4c1d95", "#ddd6fe"] }, "Ha ottantanove anni e una memoria che non ha mai sbagliato una formazione. Viene dal paese che oggi è sotto il lago.");
      C("vp_zattera", "Pietro «Zattera»", "Barcaiolo", { style: "messy", hair: "#6b7280", beard: "folta", acc: ["paglia"], shirt: "#0f766e", skin: "#c99a6a", bg: ["#134e4a", "#99f6e4"] }, "Traghetta persone, sacchi e opinioni. Il lago lo conosce meglio di sé stesso, e si sente.");
      C("vp_paesano", "Abitante di Valpiana", "Volontario", { style: "buzz", hair: "#44403c", shirt: "#65a30d", skin: "#d9a679", bg: ["#365314", "#d9f99d"] }, "Sa dove sono i sacchi, quanti ne mancano e chi doveva portarli.");
      C("vp_capo", "Capitano Bastia", "Veterani della Diga", { style: "slick", hair: "#292524", beard: "pizzetto", shirt: "#7f1d1d", skin: "#c68642", bg: ["#450a0a", "#fecaca"] }, "Capitano di una squadra di vecchie glorie che gioca in difesa anche a tavola.");
    }
  };
  window.__digaH = H;
  const E = window.__sagaCore.create({
    id: "diga", key: "ali-di-rondine.diga", title: "La Diga di Valpiana", icon: "🌊", bg: "dg_titolo", chapters: 4,
    menuSub: "Un paese di montagna, una diga stanca e un lago che sale. Gioca la Coppa della Piena prima che arrivi l'acqua.",
    theme: { accent: "#38bdf8", ink: "#f1f5f9", paper: "rgba(12,26,42,.9)", font: "Georgia, 'Trebuchet MS', serif", chipBg: "#0f2740", chipBorder: "#38bdf8" },
    stats: { acqua: [0, 4, 0, "Livello del lago"], fiducia: [0, 9, 3, "Fiducia"], argine: [0, 9, 2, "Argine"], memoria: [0, 6, 0, "Memoria"] },
    regions: {
      paese: { grass: ["#7f9a58", "#789252", "#88a360"], path: ["#c9b98a", "#bda97a"], stone: ["#8a8a80", "#7e7e74"], wall: ["#d9c8a8", "#cbb999"], water: ["#2f7aa8", "#296f9c"], tree: "#3a6a3a", tint: "255,190,120", tintA: 0.1, fx: "" },
      lago: { grass: ["#6f8f5a", "#678752", "#789a62"], path: ["#cdbd90", "#c0b084"], stone: ["#7e8288", "#72767c"], wall: ["#b6a688", "#a89a7c"], water: ["#2a7aa8", "#256e9a"], tree: "#2f5a3a", tint: "255,170,130", tintA: 0.12, fx: "" },
      diga: { grass: ["#44604a", "#3d5843", "#4b684f"], path: ["#8b929c", "#80878f"], stone: ["#6b7280", "#5f6672"], wall: ["#4b5563", "#414a58"], water: ["#1e4a7a", "#194068"], tree: "#243a2a", tint: "30,50,100", tintA: 0.16, fx: "", dark: 0.18 },
      sala: { grass: ["#4b5563", "#454e5b", "#525c69"], path: ["#6b7280", "#626976"], stone: ["#4a4e56", "#40444c"], wall: ["#2e3b4a", "#253240"], water: ["#1a3a5a", "#163450"], tree: "#243a2a", tint: "254,230,150", tintA: 0.07, fx: "" },
      galleria: { grass: ["#303842", "#2b323c", "#363f4a"], path: ["#4a5565", "#434d5c"], stone: ["#374151", "#2f3948"], wall: ["#1f2937", "#18202d"], water: ["#17406a", "#133a60"], tree: "#14202e", tint: "60,90,140", tintA: 0.14, fx: "", dark: 0.34 },
      sommerso: { grass: ["#7c8a78", "#738070", "#85927f"], path: ["#9a9482", "#8e8876"], stone: ["#7a7f82", "#6e7376"], wall: ["#a79f8c", "#998f7c"], water: ["#6f8f9a", "#648590"], tree: "#4a5a4a", tint: "200,215,220", tintA: 0.16, fx: ["leaves"], dark: 0.05 },
      cresta: { grass: ["#3a4a3a", "#344434", "#405040"], path: ["#6a6f76", "#60656c"], stone: ["#4a4e56", "#40444c"], wall: ["#3a4048", "#30363e"], water: ["#1a4a7a", "#164068"], tree: "#243a2a", tint: "100,130,180", tintA: 0.2, fx: ["rain", "rain"], dark: 0.24 }
    },
    floors: "ekcdhmoiruxsg", solid: "KFAQVJEZYP",
    act: { q: "Entra", v: "Esci", K: "Guarda i sacchi", F: "Guarda la ringhiera", Q: "Guarda il lampione", V: "Gira la ruota", J: "Guarda il pannello", E: "Guarda la barca", Z: "Guarda i quadranti", Y: "Guarda gli scaffali", P: "Leggi il cartello", x: "Guarda il ricordo", s: "Siediti un momento" },
    flavor: {
      K: "Sacchi di sabbia in pile da tre. Qualcuno ha scritto «LAGO» su uno e «PAESE» su un altro, per sicurezza.",
      F: "Una ringhiera di ferro con la vernice che se ne va. Sul corrimano, tante mani e un'unica direzione: avanti.",
      Q: "Un lampione di ghisa. Ha illuminato quarant'anni di passeggiate e tre tentativi di proposta di matrimonio.",
      V: "Una grande ruota di paratoia, rossa di ruggine. Girarla richiede un permesso, due mani e un po' di fede.",
      J: "Un pannello con bottoni dalle etichette scritte a mano: «ACQUA NO», «ACQUA SI», «ACQUA FORSE».",
      E: "Una barca di legno, capovolta o quasi. Dalla chiglia pende un nome dipinto a mano: «L'ULTIMA».",
      Z: "Quadranti di livello, di portata, di pressione. L'ago rosso del livello è nascosto da un nastro adesivo: «NON GUARDARE».",
      Y: "Scaffali con raccoglitori: «PIENE 1962-1989», «PIENE 1990-2010», «PIENE (VARIE)».",
      P: "Un cartello: «NON TOCCARE». Qualcuno ha aggiunto sotto «anche se piove».",
      x: "Una cosa lasciata lì, sotto un velo di fango. Ha una storia. Lo si sente dal modo in cui sta ferma."
    },
    journal: { name: "Il Quaderno della Piena", sub: "Livello, fiducia, argine, ricordi e finali" },
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi. Il lago, lontano, fa il rumore di una persona che respira profondo. (Il gioco salva da solo.)" },
    texts: { nothing: "Niente di utile qui. Solo acqua e silenzio.", noHero: "Serve un Campione per la Coppa della Piena. Crea prima il tuo." },
    flood: { stat: "acqua", names: ["Magra", "Alta", "Piena", "Colma", "Esondata"], per: 6, hud: true,
      onRise: (K, lv) => [["voce", lv >= 4 ? "Il lago ha toccato il livello di guardia. Le sirene non suonano: la voce di Valpiana si è già alzata da sola." : `Il lago sale ancora (${["Magra", "Alta", "Piena", "Colma", "Esondata"][lv]}). Le case più basse hanno i piedi nell'acqua.`]] },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Conoscenti", "Amici", "Fidati", "Famiglia di valle"],
      scenes: {
        vp_gino: [{ lv: 2, id: "gin2", lines: [["vp_gino", "Sai che c'è di strano? Il pallone gonfio non affonda mai. È la prima cosa che si impara in acqua."], ["vp_gino", "Il resto, per sopravvivere, si impara dai sacchi: pesano, e per questo funzionano."]], reward: (K) => K.bond("argine", 1) },
          { lv: 3, id: "gin3", prize: "+1 Argine e il Sacco di Gino", lines: [["vp_gino", "Tieni. È il mio sacco. L'ho riempito dieci anni fa e non l'ho mai usato. Non perché non servisse: perché non volevo che servisse."], ["vp_gino", "Ora serve. Fai di meglio di me."]], reward: (K) => { K.bond("argine", 1); K.inv.give("vp_sacco"); } }],
        vp_tilde: [{ lv: 2, id: "til2", lines: [["vp_tilde", "Ho fatto la sindaca perché nessuno voleva. Poi ho scoperto che nessuno voleva perché è difficile. Ho continuato per dispetto."], ["vp_tilde", "A volte il dispetto regge più della speranza."]], reward: (K) => K.bond("fiducia", 1) },
          { lv: 3, id: "til3", prize: "+1 Fiducia", lines: [["vp_tilde", "Se riusciamo, la targa sulla diga la dedico a te. Se non riusciamo, la dedico a tutti. Lo prometto davanti a questo bicchiere."], ["vp_tilde", "Vuoto. Ma i giuramenti, vuoti o pieni, valgono lo stesso."]], reward: (K) => K.bond("fiducia", 1) }],
        vp_ermete: [{ lv: 2, id: "erm2", lines: [["vp_ermete", "Una volta ho parato un rigore con la faccia. Nessuno lo ricorda. Io sì: mi piaceva il silenzio dopo."], ["vp_ermete", "Per la diga è lo stesso. Il silenzio dopo, è il segnale che ha funzionato."]], reward: (K) => K.bond("fiducia", 1) },
          { lv: 3, id: "erm3", prize: "La Chiave della galleria", lines: [["vp_ermete", "Ho una chiave. È una chiave sola, per una porta sola. Ci sono cose, là sotto, che non ho mai fatto vedere a nessuno."], ["vp_ermete", "Non perché le nascondessi. Perché nessuno chiedeva."]], reward: (K) => { K.inv.give("vp_chiave"); } }],
        vp_zita: [{ lv: 2, id: "zit2", lines: [["vp_zita", "Il mio paese aveva dodici case, una chiesa e un campo. In estate si giocava fino a notte, e il pallone lo prestava il prete."], ["vp_zita", "Era sempre lo stesso pallone. Lo ricordo perché era troppo grande per tutti noi."]], reward: (K) => K.bond("memoria", 1) },
          { lv: 3, id: "zit3", prize: "+1 Memoria e il Termos di Zita", lines: [["vp_zita", "Ti do il mio termos. È calmo, come me: caldo di fuori e di dentro."], ["vp_zita", "E se tu riuscissi a ridare il campo a quelli che verranno... non dirmelo. Fallo e basta."]], reward: (K) => { K.bond("memoria", 1); K.inv.give("vp_termos"); } }],
        vp_lorenza: [{ lv: 2, id: "lor2", lines: [["vp_lorenza", "La radio ha due ascoltatori fissi: mia madre e un signore che chiama sempre per lamentarsi del volume."], ["vp_lorenza", "Ma stanotte, se serve, ho trecento orecchie."]], reward: (K) => K.bond("fiducia", 1) },
          { lv: 3, id: "lor3", prize: "+1 Fiducia", lines: [["vp_lorenza", "Se mi dai una notizia vera, la leggo vera. Se me la dai bella, la leggo vera lo stesso. È una promessa di microfono."], ["vp_lorenza", "Il microfono, quando non mente, pesa."]], reward: (K) => K.bond("fiducia", 1) }]
      }
    },
    inv: {
      items: {
        vp_termos: { n: "Termos di Zita", icon: "🫖", d: "Un termos blu, con un'ammaccatura sul fianco. Dentro, ancora tè caldo. A volte, ancora un ricordo.", gift: { vp_ermete: 8, vp_gino: 5, vp_lorenza: 4 }, giftAny: 2, react: { vp_ermete: "Tè. A quest'ora. Chi è che sa come si sta svegli di notte, qui?" } },
        vp_sacco: { n: "Sacco di Gino", icon: "🧺", d: "Un sacco di tela, pieno e mai usato. Pesa quanto una scelta.", gift: { vp_paesano: 6, vp_tilde: 4 } },
        vp_chiave: { n: "Chiave della galleria", icon: "🗝️", d: "Una chiave lunga, di ferro, calda a forza di essere tenuta in tasca. Apre una sola porta.", gift: {} },
        vp_pallone: { n: "Pallone di Zita", icon: "⚽", d: "Un pallone di cuoio, scucito, con un nome a pennarello sbiadito. Ha dormito sott'acqua per sessant'anni.", gift: { vp_zita: 8 }, react: { vp_zita: "Il mio pallone! Lo riconosco dal nodo. Non l'ho più toccato da quella sera." } },
        vp_foto: { n: "Foto della classe del '61", icon: "🖼️", d: "Dodici ragazzi in posa davanti a una chiesa. In fondo, un pallone più grande di tutti.", gift: { vp_zita: 6, vp_ermete: 6, vp_tilde: 4 } }
      }
    },
    clock: { slots: ["Mattina", "Pomeriggio", "Sera", "Notte"], hud: true, tint: [null, null, "rgba(251,146,60,.12)", "rgba(10,18,50,.30)"] },
    cases: {
      piena: {
        t: "Il Registro delle Piene", q: "Il livello del lago, di notte, era davvero quello scritto sul registro?",
        items: {
          p_reg: { t: "Il registro ufficiale", icon: "📒", kind: "prova", d: "Letture a mano, ogni sera alle 22: «Livello nella norma» per sette notti di fila." },
          p_sen: { t: "Il sensore del pannello", icon: "📈", kind: "prova", d: "La memoria del pannello conserva i picchi: due notti sopra la soglia di guardia." },
          p_lett: { t: "La lettera dell'Ente", icon: "✉️", kind: "prova", d: "«Per mancanza di fondi, le verifiche straordinarie sono rinviate a data da destinarsi.» Firmato a macchina." },
          p_zat: { t: "Pietro Zattera, barcaiolo", icon: "⛵", kind: "testimonianza", d: "«La notte del 14 ho dovuto spostare la barca di tre metri. Il pontile era sott'acqua.»" },
          p_foto: { t: "Foto della fessura", icon: "📷", kind: "prova", d: "Una crepa verticale nel muro della galleria, con un righello a lato: sedici millimetri." },
          p_erm: { t: "Il secondo registro di Ermete", icon: "📓", kind: "prova", d: "Letture vere, con la calligrafia stretta di chi ha paura di essere letto." }
        },
        links: [["p_reg", "p_sen", "Il registro dice «nella norma»; il sensore ricorda due picchi sopra la soglia. Una delle due non dice la verità."], ["p_zat", "p_reg", "Zattera ha spostato la barca perché il pontile era sommerso. Il registro, quella notte, parla di livello normale."], ["p_lett", "p_foto", "L'Ente rinvia le verifiche per mancanza di fondi: ma la crepa è già a sedici millimetri. Non serve una verifica per vederla."]],
        verdicts: [{ id: "ente", label: "Segnala tutto all'Ente", sub: "Un dossier formale, con la via ufficiale" }, { id: "radio", label: "Racconta tutto alla radio", sub: "Il paese saprà, nel bene e nel male" }, { id: "ermete", label: "Parla prima con Ermete", sub: "Lascia a lui scegliere come dirlo" }]
      }
    },
    endings: {
      diga: ["La Diga Tiene", "Tutto il paese, con i sacchi, tiene l'acqua fino all'alba. La diga resiste. La coppa, per una volta, è stata riempita di fatica.", "Argine 6, Fiducia 6 e vinci l'ultima prova dell'Argine."],
      scarichi: ["Gli Scarichi Aperti", "Apri la paratoia verso i prati. L'acqua scende dove non fa vittime. Il raccolto non si salva, la diga sì.", "Apri gli scarichi verso i Prati."],
      sommerso: ["Il Ritorno al Lago", "Lasci che l'acqua torni dov'era. Il vecchio paese scompare un'altra volta, con i suoi pali e il suo campanile. Il nuovo paese vive.", "Lascia andare il vecchio paese."],
      campo: ["Il Campo di Zita", "L'acqua scende piano. Dove prima c'era un lago, ricompare un campo. Con una porta, un campanile e quattro bambini che gridano «fuorigioco».", "Memoria 5, Fiducia 5 e il Pallone di Zita."]
    },
    heroLook: () => ({ bg: ["#0f2740", "#38bdf8"], shirt: "#0369a1" }),
    heroTitle: () => "campione della Coppa della Piena",
    musicMain: "diga",
    music: { diga: { bpm: 84, chords: ["Dm", "Bb", "F", "C", "Dm", "Bb", "Gm", "A"], lres: 2, lw: "sine", lv: 0.045,
      lead: "D5 - - F5 - A5 - - | Bb4 - - D5 - F5 - - | A4 - - C5 - F5 - - | G4 - - C5 - E5 - - | D5 - - F5 - A5 - - | Bb4 - - D5 - G5 - - | G4 - - Bb4 - D5 - - | A4 - - C#5 - E5 - -",
      bass: "R . . . R . . 5 . . . . R . 5 .", bv: 0.1, arp: "1 5 3 5 1 5 3 5", aw: "sine", av: 0.012, drum: "k . . . . . . . s . . . . . k .", dv: 0.08 } },
    cameos: [],
    guest: { id: "vp_ermete", lines: ["Sono Ermete, il custode. Per una volta guardo un'altra acqua: il mare. Fa più rumore e dice meno.", "Se hai una diga che gira storta, chiamami. Anche solo per ascoltarla."] },
    stadium: { azPitch: "campo", cageField: 1, cageMut: "wet", weather: "pioggia", venue: { ads: [["VALPIANA", "#0369a1"], ["COPPA DELLA PIENA", "#0e7490"], ["ACQUA NO", "#1e293b"], ["GINO IDRAULICA", "#2563eb"]], crowd: ["#0e7490", "#1e3a5f", "#f1f5f9"], ground: ["#3a7a48", "#357042"], line: "#f1f5f9", sky: ["#243a5e", "#7aa0c0"], wall: ["#1f2937", "#18202d"], glow: "56,189,248", fx: { fr: 0.985, spd: 0.97 } } },
    // ------------------------------------------------------------ tessere
    floorPaint(K, f, sx, sy, tx, ty) {
      const P = K.P, g = K.g, fr = Math.floor(performance.now() / 16), r = (s) => rn(tx, ty, s);
      if (f === "e") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#cdb98a" : "#c5b182"); for (let i = 0; i < 4; i++) if (r(i) < 0.5) P(sx + Math.floor(r(i + 9) * 14), sy + Math.floor(r(i + 5) * 14), 1, 1, "#a8946a"); if (r(20) < 0.06) P(sx + 4, sy + 8, 5, 2, "#e8dcc0"); return true; }
      if (f === "k") { P(sx, sy, 16, 16, "#a39c8c"); [[0, 0], [8, 0], [4, 5], [12, 5], [0, 10], [8, 10]].forEach(([a, b], i) => { P(sx + a + (i % 2), sy + b, 7, 4, (tx + ty + i) % 3 ? "#b6af9e" : "#aaa392"); P(sx + a + (i % 2), sy + b + 4, 7, 1, "rgba(0,0,0,.22)"); }); if (r(7) < 0.05) P(sx + 6, sy + 6, 3, 2, "rgba(56,189,248,.5)"); return true; }
      if (f === "c") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8b929c" : "#868d97"); P(sx, sy + 15, 16, 1, "rgba(0,0,0,.28)"); P(sx + 15, sy, 1, 16, "rgba(0,0,0,.14)"); if (r(1) < 0.1) P(sx + 3, sy + 6, 9, 1, "rgba(255,255,255,.1)"); if (r(2) < 0.07) { g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 5, 3, 0, 0, 7); g.fill(); } if (ty % 7 === 0 && tx % 2 === 0) P(sx + 2, sy + 7, 12, 1, "#e5e7eb"); return true; }
      if (f === "g") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#4a7a3c" : "#457438"); for (let i = 0; i < 6; i++) { const a = Math.floor(r(i + 30) * 14), b = Math.floor(r(i + 40) * 12); P(sx + a, sy + b + 2, 1, 3, "#6aa650"); P(sx + a + 1, sy + b + 3, 1, 2, "#356230"); } if (r(50) < 0.12) { const a = 3 + Math.floor(r(51) * 9), b = 3 + Math.floor(r(52) * 9); P(sx + a, sy + b, 2, 2, r(53) < 0.5 ? "#fde68a" : "#f9a8d4"); } return true; }
      if (f === "r") { P(sx, sy, 16, 16, "#8a6a42"); for (let i = 0; i < 4; i++) { P(sx, sy + i * 4, 16, 1, "rgba(0,0,0,.28)"); if (r(i + 11) < 0.4) P(sx + Math.floor(r(i) * 14), sy + i * 4 + 2, 1, 1, "#5a4228"); } P(sx + ((tx * 5) % 12), sy, 1, 16, "rgba(0,0,0,.12)"); return true; }
      if (f === "u") { P(sx, sy, 16, 16, "#8a8f94"); for (let i = 0; i < 6; i++) P(sx + Math.floor(r(i) * 14), sy + Math.floor(r(i + 7) * 14), 2, 2, i % 2 ? "#a5aaaf" : "#707479"); return true; }
      if (f === "h") { P(sx, sy, 16, 16, "#1c1c1f"); g.fillStyle = "#facc15"; for (let i = -2; i < 5; i++) { g.beginPath(); g.moveTo(sx + i * 6, sy + 16); g.lineTo(sx + i * 6 + 3, sy + 16); g.lineTo(sx + i * 6 + 11, sy); g.lineTo(sx + i * 6 + 8, sy); g.closePath(); g.fill(); } P(sx, sy, 16, 16, "rgba(0,0,0,.28)"); return true; }
      if (f === "m") { P(sx, sy, 16, 16, "#1d232b"); g.strokeStyle = "#475569"; g.lineWidth = 1; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(sx, sy + i * 4 + 2); g.lineTo(sx + 16, sy + i * 4 + 2); g.stroke(); g.beginPath(); g.moveTo(sx + i * 4 + 2, sy); g.lineTo(sx + i * 4 + 2, sy + 16); g.stroke(); } if (r(3) < 0.08) { P(sx + 3, sy + 5, 10, 6, "rgba(56,189,248,.25)"); } return true; }
      if (f === "o") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#e2e8f0" : "#dbe3ee"); P(sx, sy + 15, 16, 1, "#94a3b8"); P(sx + 15, sy, 1, 16, "#94a3b8"); return true; }
      if (f === "d") { P(sx, sy, 16, 16, "#3b2a44"); P(sx, sy, 16, 1, "rgba(255,255,255,.06)"); if ((tx + ty) % 2 === 0) P(sx + 6, sy + 6, 4, 4, "#563a62"); return true; }
      if (f === "i") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#6f6a58" : "#686350"); for (let i = 0; i < 5; i++) P(sx + Math.floor(r(i + 60) * 14), sy + Math.floor(r(i + 70) * 14), 3, 1, "#8a8470"); if (r(8) < 0.12) { P(sx + 3, sy + 5, 8, 4, "rgba(150,190,210,.45)"); P(sx + 4, sy + 6, 4, 1, "rgba(255,255,255,.35)"); } return true; }
      if (f === "x") { P(sx, sy, 16, 16, "#6f6a58"); P(sx + 3, sy + 7, 10, 6, "#8a6a42"); P(sx + 3, sy + 7, 10, 2, "#a8834f"); K.glow && K.glow(g, sx + 8, sy + 9, 12, "186,230,253", 0.1 + 0.05 * Math.sin(fr / 18)); return true; }
      if (f === "s") { P(sx, sy, 16, 16, "#9a7a52"); P(sx + 2, sy + 5, 12, 3, "#5a4228"); P(sx + 2, sy + 8, 2, 5, "#3a2a18"); P(sx + 12, sy + 8, 2, 5, "#3a2a18"); P(sx + 2, sy + 2, 12, 3, "#7a5a38"); return true; }
      return false;
    },
    paint: {
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(sx + 1, sy + 13, 15, 3); for (let i = 0; i < 3; i++) { g.fillStyle = (tx + ty + i) % 2 ? "#c4a46a" : "#b8985e"; g.fillRect(sx + 1 + i * 5, sy + 6, 5, 8); g.fillStyle = "#8a6a3a"; g.fillRect(sx + 1 + i * 5, sy + 6, 5, 1); } g.fillStyle = "#d7c28e"; g.fillRect(sx + 3, sy + 2, 10, 5); g.fillStyle = "#8a6a3a"; g.fillRect(sx + 3, sy + 2, 10, 1); g.fillRect(sx + 7, sy + 2, 2, 5); },
      F(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.22)"; g.fillRect(sx, sy + 14, 16, 2); g.fillStyle = "#475569"; g.fillRect(sx, sy + 3, 16, 2); g.fillRect(sx, sy + 9, 16, 2); g.fillStyle = "#64748b"; for (let i = 0; i < 16; i += 5) g.fillRect(sx + i, sy + 1, 2, 14); g.fillStyle = "#94a3b8"; g.fillRect(sx, sy + 3, 16, 1); },
      A(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g, c = ["#4b5058", "#434850", "#52575f"]; g.fillStyle = c[(tx * 3 + ty) % 3]; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.1)"; g.fillRect(sx, sy, 16, 2); g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(sx + 3 + (tx % 3) * 3, sy + 6, 7, 1); g.fillRect(sx + 1 + (ty % 3) * 3, sy + 11, 9, 1); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(sx + 12, sy, 4, 16); if (rn(tx, ty, 8) < 0.2) { g.fillStyle = "#3d6a3a"; g.fillRect(sx + 4, sy + 2, 4, 2); } },
      Q(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 4, sy + 14, 8, 2); g.fillStyle = "#1f2937"; g.fillRect(sx + 7, sy + 5, 2, 10); g.fillRect(sx + 5, sy + 2, 6, 4); const a = 0.55 + 0.25 * Math.sin(fr / 14 + tx); g.fillStyle = `rgba(254,240,160,${a})`; g.fillRect(sx + 6, sy + 3, 4, 2); K.light(sx + 8, sy + 4, 46, "254,240,160", 0.26); K.glow(g, sx + 8, sy + 4, 16, "254,240,160", 0.2); },
      V(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 14, 2); g.fillStyle = "#374151"; g.fillRect(sx + 2, sy + 9, 12, 6); g.fillStyle = "#b91c1c"; g.beginPath(); g.arc(sx + 8, sy + 7, 6, 0, 7); g.fill(); g.fillStyle = "#374151"; g.beginPath(); g.arc(sx + 8, sy + 7, 2, 0, 7); g.fill(); g.strokeStyle = "#7f1d1d"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx + 2, sy + 7); g.lineTo(sx + 14, sy + 7); g.moveTo(sx + 8, sy + 1); g.lineTo(sx + 8, sy + 13); g.stroke(); },
      J(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 14, 2); g.fillStyle = "#374151"; g.fillRect(sx + 1, sy + 3, 14, 11); g.fillStyle = "#111827"; g.fillRect(sx + 2, sy + 4, 12, 4); g.fillStyle = `rgba(56,189,248,${0.55 + 0.3 * Math.sin(fr / 11)})`; g.fillRect(sx + 3, sy + 5, 6, 2); for (let i = 0; i < 3; i++) { g.fillStyle = (Math.floor(fr / 20) + i) % 3 ? "#4ade80" : "#fbbf24"; g.fillRect(sx + 3 + i * 4, sy + 10, 2, 2); } K.glow(g, sx + 8, sy + 6, 16, "56,189,248", 0.1); },
      E(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 14, 16, 2); g.fillStyle = "#7a3a1a"; g.beginPath(); g.moveTo(sx, sy + 6); g.lineTo(sx + 16, sy + 6); g.lineTo(sx + 13, sy + 14); g.lineTo(sx + 3, sy + 14); g.closePath(); g.fill(); g.fillStyle = "#9a4a22"; g.fillRect(sx, sy + 6, 16, 2); g.fillStyle = "#e5e7eb"; if (tx % 2 === 0) g.fillRect(sx + 5, sy + 10, 6, 1); },
      Z(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 14, 2); g.fillStyle = "#1f2937"; g.fillRect(sx + 1, sy + 1, 14, 14); g.fillStyle = "#0b1220"; g.fillRect(sx + 2, sy + 2, 12, 12); const h = 4 + 5 * (0.5 + 0.5 * Math.sin(fr / 40 + tx)); g.fillStyle = tx % 3 === 0 ? "#f87171" : "#38bdf8"; g.fillRect(sx + 4, sy + 12 - h, 3, h); g.fillStyle = "#4ade80"; g.fillRect(sx + 9, sy + 8, 3, 4); },
      Y(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 14, 16, 2); g.fillStyle = "#475569"; g.fillRect(sx, sy, 16, 15); g.fillStyle = "#334155"; for (let i = 0; i < 3; i++) g.fillRect(sx, sy + 4 + i * 4, 16, 1); const cols = ["#60a5fa", "#e2e8f0", "#fbbf24", "#a3e635", "#f87171"]; for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) { g.fillStyle = cols[Math.floor(rn(tx + j, ty + i, 12) * 5)]; g.fillRect(sx + 1 + j * 3, sy + 1 + i * 4, 2, 3); } },
      P(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3a2a18"; g.fillRect(sx + 7, sy + 8, 2, 8); g.fillStyle = "#e5e7eb"; g.fillRect(sx + 2, sy + 1, 12, 8); g.fillStyle = "#0369a1"; g.fillRect(sx + 3, sy + 2, 10, 1); g.fillRect(sx + 4, sy + 4, 8, 1); g.fillRect(sx + 5, sy + 6, 6, 1); }
    },
    mood(g, fr, K) { const c = g.canvas, a = 0.04 + 0.02 * Math.sin(fr / 60); g.fillStyle = `rgba(0,0,20,${a})`; g.fillRect(0, 0, c.width, c.height); },
    zoneMenuExtra(K) {
      const h = K.flood.get(), tip = ["Il lago è basso: sembra un giorno qualunque.", "Il pontile ha già i piedi bagnati.", "Le strade basse si riempiono di pozze.", "La riva è sommersa fino ai primi gradini.", "Il lago è dappertutto. Le case alte sono isole."][h];
      return [{ label: `🌊 Livello del lago: ${K.flood.name()}`, sub: tip, cls: "hot", fn: () => K.say([["voce", `${tip} (${K.flood.bar()} ${h}/${K.flood.max()})`]], K.done) }];
    }
  });
  const K0 = E.K;
  // il minigioco Argine dentro la storia: una sequenza di livelli; cb({win}) alla fine
  K0.argine = (lvs, cb) => {
    const arr = [].concat(lvs); let i = 0;
    const next = () => {
      if (i >= arr.length) return cb && cb({ win: true });
      K0.ownMatch(window.__argine.start, { level: arr[i], title: "Argine", done: (r) => { if (!r || !r.win) return cb && cb({ win: false, r }); i++; next(); } });
    };
    next();
  };
  window.__diga = E.api; window.__digaCore = E;
})();
