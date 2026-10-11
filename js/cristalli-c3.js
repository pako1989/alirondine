// js/cristalli-c3.js - CRISTALLI DEL CAMPO · Capitolo 3 «La Partita dei Cristalli»
// Il Santuario dell'Acqua (enigma dei tre cristalli, la Porta delle Maree), la capitale Aldebaria (la Partita dei Cristalli:
// 2D HD, forzata), la Sala del Trono (Re Aldeberto: Battaglia ATB da boss). Colpo di scena: il re è il nemico.
// Finali: la Luce ritorna · la Terra ferma (serve l'amicizia di Ferrogrigio) · il Nuovo Re (serve la sete di Corona)
// · segreto: il Quinto Campo (serve la piena fiducia di Aira e quasi tutto il Diario).
(function () {
  "use strict";
  function boot() { const CR = window.__cristalli; if (!CR || !CR.addChapter || !CR._has(2)) return setTimeout(boot, 120); CR.addChapter(chapter3); }
  function chapter3(X) {
    const { T, F, say, ask, done, go, note, setStep, reward, bond, learnLore, finishChapter } = X;
    const N = 3, S = () => X.stepOf(N), M = () => X.mem();
    const ally = () => F.is("kael_alleato") || M().ferro >= 3;

    // ---------------------------------------------------------------- personaggi
    X.cast("cr_aldeberto", { name: "Re Aldeberto", tag: "", hair: "#f2f2f2", style: "long", skin: "#f2d8c0", eye: "#c9a227", cap: "#c9a227", bg: ["#2a1a3a", "#c9a227"], shirt: "#6a1a3a", beard: true },
      "Re di Calcistea da ottant'anni. Sulle monete ha sempre la stessa faccia, e anche allo specchio. Sorride come un nonno buono. Non guarda una partita da trent'anni: dice che lo annoiano. Le partite. Non la luce che producono.");
    X.cast("cr_ondina", { name: "Custode Ondina", tag: "", hair: "#3fa7c8", style: "bun", skin: "#e0b48a", eye: "#1e6a9a", bg: ["#0e4a6a", "#bfeefc"], shirt: "#1e6a9a" },
      "La custode del Santuario dell'Acqua. Parla con le onde e le onde rispondono, di solito per lamentarsi. Era il portiere di riserva della nazionale delle isole: non è mai entrata, ma ha parato tutto in allenamento.");
    X.cast("cr_gilda", { name: "Fornaia Gilda", tag: "", hair: "#8a5a2a", style: "codino", skin: "#f0c8a0", eye: "#3a2a1a", bg: ["#5a3a2a", "#ffd36b"], shirt: "#e8d6b0" },
      "La fornaia di Aldebaria. Fa il pane da quarant'anni con la stessa ricetta di sua nonna, che lo faceva per lo stesso re. Il re, dice lei, ha sempre avuto la stessa faccia. Anche sua nonna lo diceva.");
    X.cast("cr_pennino", { name: "Cronista Pennino", tag: "", hair: "#2a2a33", style: "messy", skin: "#e0b48a", eye: "#2a2a2a", glasses: true, bg: ["#2a1a3a", "#e8e0d0"], shirt: "#5a5a62" },
      "Cronista sportivo della Gazzetta di Aldebaria. Da trent'anni scrive solo dei tornei del re, che vince sempre il re. Ha un cassetto pieno di articoli veri, mai pubblicati.");
    X.cos("cr_c3", { kind: "shirt", label: "Manto della Luce", val: "#fff6c8", from: "Completa il Capitolo 3 di Cristalli del Campo" });
    X.cos("cr_onda", { kind: "hairc", label: "Capelli d'Onda", val: "#3fa7c8", from: "Raccogli tutti i frammenti di luce al Santuario dell'Acqua" });
    X.cos("cr_oro", { kind: "shirt", label: "Maglia d'Oro", val: "#c9a227", from: "Raccogli tutti i frammenti di luce ad Aldebaria" });
    X.cos("cr_cristallo", { kind: "hairc", label: "Capelli di Cristallo", val: "#bfeefc", from: "Finale «La Luce ritorna»" });
    X.cos("cr_mare", { kind: "shirt", label: "Maglia del Mare", val: "#1e6a9a", from: "Finale «La Terra ferma»" });
    X.cos("cr_reale", { kind: "shirt", label: "Manto Reale", val: "#6a1a3a", from: "Finale «Il Nuovo Re»" });
    X.cos("cr_arcobaleno", { kind: "hairc", label: "Capelli d'Aurora", val: "#ff8aa8", from: "Finale segreto «Il Quinto Campo»" });
    X.cos("cr_corallo", { kind: "shirt", label: "Maglia Corallo", val: "#ff7a6a", from: "Un forziere al Santuario dell'Acqua" });

    // ---------------------------------------------------------------- frammenti di storia
    X.lore("l_maree", { t: "La Porta delle Maree", d: "Sotto la capitale c'è un tunnel che si apre solo quando il Cristallo dell'Acqua lo vuole. Lo costruirono i primi giocatori, per entrare in città senza passare dal re. Già allora." });
    X.lore("l_re", { t: "Il re che non invecchia", d: "Ottant'anni fa Aldeberto trovò il Cristallo del Campo in una ragazza e capì: la sua luce non finisce mai, perché ogni partita la rinnova. Da allora la beve. E non invecchia." });
    X.lore("l_cupola", { t: "La Cupola d'Oro", d: "Sopra Aldebaria c'è una cupola di luce rubata. Quando le altre isole cadranno, la capitale resterà su. Il re lo sa. Il popolo no." });
    X.lore("l_sala", { t: "La Sala Bianca", d: "Una stanza bianca, una sedia, una finestra su un campo dove non gioca nessuno. Sul muro, graffiati con un'unghia, centinaia di piccoli palloni. Aira li contava per non dimenticare cosa fosse." });

    // ---------------------------------------------------------------- mappa del mondo
    X.place("acqua", { name: "Santuario dell'Acqua", x: 170, y: 420, col: "#3fc8ff", zone: "cr_acqua", r: 48, hidden: () => M().ch < 3, land: () => { if (S() < 2) setStep(N, 2); go("cr_acqua", 6, 19); } });
    X.place("capitale", { name: "Aldebaria, la capitale", x: 440, y: 190, col: "#c9a227", zone: "cr_capitale", r: 56, hidden: () => M().ch < 3, locked: () => S() < 4, land: () => { if (S() < 5) setStep(N, 5); go("cr_capitale", 6, 21); } });

    const goal = (s) => ({
      0: "Sul ponte: parla con la Capitana Vela. Bisogna andare a prendere Aira.",
      1: "Prendi il timone e vola al Santuario dell'Acqua, a sud-ovest sulla mappa.",
      2: "Santuario dell'Acqua: parla con la Custode Ondina, accanto al murale.",
      3: "Tocca i tre cristalli nell'ordine del murale per abbassare le acque, poi raggiungi il Cristallo dell'Acqua.",
      4: "Torna all'aeronave e vola ad Aldebaria, la capitale (a est, dorata).",
      5: "Aldebaria: raggiungi lo Stadio della Corona (in alto) e parla con Ser Lumio al cancello.",
      6: "Nella Sala del Trono: affronta Re Aldeberto.",
      7: "Aira è libera. Parlale: è il momento di decidere cosa fare dei Cristalli.",
    }[s] || "Storia conclusa. Dal menu puoi rigiocare i capitoli e cercare gli altri finali.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(10,20,64,.85)"); R(g, x - w / 2, y + 2, w, 1, "#c9a227"); g.fillStyle = "#ffe9b0"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    function gem(g, x, y, col, fr, on) { g.save(); g.globalCompositeOperation = "lighter"; X.glow(g, x, y, on ? 20 : 12, col, on ? 0.7 : 0.35 + 0.1 * Math.sin(fr / 15)); g.restore(); }
    // l'enigma dei tre cristalli: Terra, Vento, Fuoco (l'ordine è sul murale)
    const PUZ = { "6,14": ["terra", "232,160,64", "il cristallo color ambra"], "25,14": ["vento", "159,224,255", "il cristallo color cielo"], "15,19": ["fuoco", "255,90,58", "il cristallo color brace"] };
    const ORDER = ["terra", "vento", "fuoco"];
    const zones = {
      cr_acqua: {
        region: "acqua", name: "Cristalli del Campo · Santuario dell'Acqua", short: "Santuario dell'Acqua", sub: "Un tempio tra le onde", bg: "cr_acqua", dock: true, crystal: "#3fc8ff", cluster: "#7ae0ff",
        dim: (s) => s < 4,
        w: 32, h: 24, start: [6, 19], itemCos: "cr_onda", items: [[2, 13], [29, 16], [20, 22], [12, 4]],
        areas: [[9, 1, 22, 8, "Il tempio dell'Acqua"], [1, 9, 30, 11, "Il canale delle maree"], [1, 17, 9, 22, "L'approdo"], [0, 0, 31, 23, "Santuario dell'Acqua"]],
        chests: { "28,20": { coins: 40, cos: "cr_corallo", text: "Una maglia color corallo, asciutta per miracolo. Ondina: «Era mia. Stava meglio a me. Tienila»." }, "3,3": { coins: 45, lore: "l_maree", text: "Una mappa incisa su una conchiglia: un tunnel sotto la capitale." } },
        act: { n: "Guarda il murale", m: "Tocca il cristallo", c: "Il Cristallo dell'Acqua", w: "Guarda l'acqua", p: "Guarda la colonna", t: "Guarda l'albero", r: "Guarda lo scoglio", o: "Guarda la statua", l: "Guarda la lanterna", e: "Guarda il mare" },
        flavor: {
          w: ["L'acqua del santuario è così limpida che vedi i pesci pensare.", "Un'onda ti bagna le scarpe. Ondina, da lontano: «Ha detto ciao»."],
          p: "Una colonna coperta di conchiglie. Se ci appoggi l'orecchio senti il mare, e sotto il mare, una partita.",
          t: "Una palma del cielo. Le noci di cocco sono azzurre e, dice Ondina, sanno di temporale.",
          r: "Uno scoglio con sopra un granchio che fa il portiere: muove le chele a destra e sinistra. Para tutto. Anche il vento.",
          o: "Una statua di una portiera con le mani tese. Sulla base: «Parò il mare. Il mare non se la prese»",
          l: "Una lanterna con dentro acqua che brilla. Quando la scuoti, le stelle dentro si mescolano.",
          e: "Il mare di Calcistea, laggiù, lontanissimo. Le isole si specchiano nell'acqua come se avessero paura di guardarlo.",
        },
        intro: [["voce", "Il Santuario dell'Acqua. Un tempio di pietra azzurra mezzo sommerso, palme del cielo, onde che arrivano da nessun mare e tornano in nessun mare."], ["cr_bram", "Senza Aira è tutto più silenzioso. Non mi piace il silenzio. Lo dico io, che non parlo mai."]],
        npcs: (s) => [{ id: "cr_ondina", at: s >= 4 ? [16, 7] : [17, 15] }, ...(s >= 4 && ally() ? [{ id: "cr_kael", at: [13, 7] }] : []), ...(s >= 4 && !ally() && F.is("c1_pim_talk") ? [{ id: "cr_pim", at: [13, 7] }] : [])],
        build(L) {
          const { lay, put, ship } = L;
          lay(0, 0, 31, 0, "w"); lay(0, 23, 31, 23, "w"); lay(0, 0, 0, 23, "w"); lay(31, 0, 31, 23, "w");
          lay(1, 17, 9, 22, "+"); ship(2, 18); lay(9, 18, 16, 18, ":"); lay(15, 12, 16, 18, ":");
          // il canale delle maree: si attraversa solo quando le acque si abbassano
          lay(1, 9, 30, 11, "w"); if (F.is("c3_acque")) lay(15, 9, 16, 11, "=");
          // il tempio
          lay(9, 1, 22, 1, "a"); lay(9, 1, 9, 7, "a"); lay(22, 1, 22, 7, "a"); lay(10, 2, 21, 8, "+"); put(15, 3, "c"); [[11, 3], [11, 7], [20, 3], [20, 7]].forEach(([x, y]) => put(x, y, "p")); lay(12, 5, 13, 5, "w"); lay(18, 5, 19, 5, "w");
          // il murale e i tre cristalli dell'enigma
          put(14, 14, "n"); Object.keys(PUZ).forEach((k) => { const [x, y] = k.split(",").map(Number); put(x, y, "m"); });
          [[3, 15], [27, 13], [24, 20], [11, 21], [4, 6], [27, 5]].forEach(([x, y]) => put(x, y, "t")); [[20, 15], [8, 13], [26, 3]].forEach(([x, y]) => put(x, y, "r")); put(23, 17, "o"); [[13, 17], [18, 16], [10, 4]].forEach(([x, y]) => put(x, y, "l"));
          put(5, 21, "s"); put(28, 20, "x"); put(3, 3, "x");
        },
        decor(g, cx, cy, d) {
          Object.keys(PUZ).forEach((k) => { const [x, y] = k.split(",").map(Number), p = PUZ[k], on = F.is("c3_acque") || (F.get("c3_seq", "").split(",").includes(p[0])); gem(g, d.X(x) + 8, d.Y(y) + 8, p[1], d.fr, on); });
          plaque(g, "MURALE", d.X(14) + 8, d.Y(13) + 6);
          if (!F.is("c3_acque")) plaque(g, "IL CANALE DELLE MAREE", d.X(16), d.Y(9) + 6);
        },
      },
      cr_capitale: {
        region: "trono", name: "Cristalli del Campo · Aldebaria, la capitale", short: "Aldebaria", sub: "La capitale dorata sotto la cupola", bg: "cr_capitale", dock: true, stands: ["#c9a227", "#6a1a3a", "#ffffff"],
        w: 36, h: 28, start: [6, 21], itemCos: "cr_oro", items: [[2, 13], [33, 20], [12, 25], [30, 6]], pitch: [10, 3, 16, 8],
        areas: [[9, 1, 26, 12, "Lo Stadio della Corona"], [26, 14, 33, 19, "La Sala Bianca"], [1, 20, 9, 26, "Il Porto Reale"], [0, 0, 35, 27, "Aldebaria"]],
        chests: { "33,24": { coins: 50, text: "Monete d'oro tutte uguali, con la stessa faccia del re. Ottant'anni di monete, la stessa faccia." }, "2,3": { coins: 40, text: "Un ritratto del re da giovane. È identico al re di oggi. Sotto, una data: ottant'anni fa." } },
        act: { o: "Guarda la statua del re", t: "Guarda l'albero", n: "Leggi il cartello", j: "Guarda la tribuna", g: "Guarda la porta", p: "Guarda la colonna", l: "Guarda la lanterna", w: "Guarda la fontana", q: "Entra nella Sala Bianca", u: "Guarda la bancarella", b: "Siediti", z: "Guarda le casse" },
        flavor: {
          o: ["Una statua d'oro del re. Sorride. Sulla base: «ALDEBERTO, IL RE CHE NON TRAMONTA».", "Un'altra statua del re. Uguale. Proprio uguale. Anche nelle rughe che non ha."],
          t: "Un albero d'oro. Vero oro: le foglie tintinnano. Nessun uccello ci si posa.",
          n: ["Cartello: «ALDEBARIA · La città che non cadrà mai». Qualcuno ha aggiunto a matita: «perché?».", "Cartello: «STADIO DELLA CORONA · Oggi: La Partita dei Cristalli · Ingresso riservato»."],
          j: "Le tribune dello stadio, piene di gente in oro e porpora. Applaudono a comando: c'è un uomo con un cartello che dice «APPLAUSI».",
          g: "Una porta d'oro con le reti di filo d'oro. Pesa troppo per esultare, ci si appende uno e cade tutto.",
          p: "Una colonna dorata. Ci passi la mano: è tiepida. Dentro pulsa luce. Luce del Vento, ne sei sicuro: profuma di bucato.",
          l: "Un lampione d'oro con dentro un pezzetto di Cristallo del Fuoco. La sua luce è rossa e triste.",
          w: "Una fontana con al centro… il re, ovviamente. L'acqua gli esce dalle mani. Non è simbolico per niente.",
          u: "Una bancarella di souvenir: tazze del re, cuscini del re, palloni con la faccia del re. Nessuno li calcia.",
          b: "Ti siedi su una panca d'oro. È scomodissima. Il lusso, a volte, è solo un modo di stare scomodi con stile.",
          z: "Casse con il sigillo reale: «LUCE · DECIMA · ANNO 80». Sono vuote. La luce è già stata bevuta.",
        },
        intro: [["voce", "Aldebaria, la capitale. Tutto è d'oro: le strade, gli alberi, le statue del re. Sopra la città una cupola di luce trasparente ronza come un alveare."], ["cr_vela", "Ecco. Ci sono atterrata. Di muso. Non applaudite."]],
        npcs: (s) => [{ id: "cr_gilda", at: [12, 17] }, { id: "cr_pennino", at: [23, 20] }, ...(s <= 5 ? [{ id: "cr_lumio", at: [19, 13] }] : []), ...(ally() ? [{ id: "cr_kael", at: [9, 21] }] : [])],
        build(L) {
          const { lay, put, house, ship } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 27, 35, 27, "a"); lay(0, 0, 0, 27, "a"); lay(35, 0, 35, 27, "a");
          lay(1, 20, 9, 26, "+"); ship(2, 22); lay(9, 21, 18, 21, ":"); lay(17, 12, 18, 21, ":"); lay(10, 16, 30, 16, ":");
          // lo Stadio della Corona
          lay(10, 3, 25, 10, "-"); lay(9, 2, 26, 2, "j"); lay(9, 11, 26, 11, "j"); lay(9, 2, 9, 11, "j"); lay(26, 2, 26, 11, "j"); put(17, 11, ":"); put(18, 11, ":"); put(10, 6, "g"); put(10, 7, "g"); put(25, 6, "g"); put(25, 7, "g");
          // case dorate, la Sala Bianca, statue e fontane del re
          house(2, 5, 5, 4, { door: [4, 8], roof: "#c9a227", wall: "#f2e6c8" }); house(28, 2, 6, 4, { door: [30, 5], roof: "#c9a227", wall: "#f2e6c8" }); house(2, 14, 5, 4, { door: [4, 17], roof: "#6a1a3a", wall: "#f2e6c8" });
          house(27, 14, 6, 4, { door: [29, 17], roof: "#ffffff", wall: "#ffffff" });
          [[14, 14], [21, 14], [7, 11]].forEach(([x, y]) => put(x, y, "o")); lay(20, 23, 22, 24, "w"); put(21, 23, "o");
          [[12, 19], [24, 18], [31, 9], [6, 24], [14, 25], [28, 24]].forEach(([x, y]) => put(x, y, "t")); [[16, 13], [19, 18], [11, 21], [25, 21], [8, 14]].forEach(([x, y]) => put(x, y, "l"));
          put(13, 22, "u"); put(26, 22, "b"); put(27, 22, "b"); [[31, 25], [32, 25]].forEach(([x, y]) => put(x, y, "z")); put(8, 19, "n"); put(15, 13, "n"); put(5, 25, "s"); put(33, 24, "x"); put(2, 3, "x");
        },
        decor(g, cx, cy, d) { plaque(g, "STADIO DELLA CORONA", d.X(17) + 8, d.Y(2) + 4); plaque(g, "SALA BIANCA", d.X(30), d.Y(14) + 4); },
        top(g, cx, cy, d) { // la cupola d'oro: un velo che ronza sopra la città
          const crack = F.is("c3_cupola_rotta"); g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,220,120,${crack ? 0.1 : 0.18})`; g.lineWidth = 1;
          for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(160, 360, 240 + i * 26 + Math.sin(d.fr / 30 + i) * 2, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); } g.restore();
          if (crack) { g.strokeStyle = "rgba(255,255,255,.5)"; g.beginPath(); g.moveTo(40, 0); g.lineTo(70, 30); g.lineTo(60, 50); g.moveTo(70, 30); g.lineTo(100, 36); g.stroke(); }
        },
      },
      cr_trono: {
        region: "trono", name: "Cristalli del Campo · La Sala del Trono", short: "La Sala del Trono", sub: "Il cuore della capitale", bg: "cr_trono", crystal: "#fff6c8",
        w: 26, h: 18, start: [12, 15], items: [],
        areas: [[0, 0, 25, 17, "La Sala del Trono"]],
        act: { c: "Guarda il Cristallo", p: "Guarda la colonna", o: "Il trono", l: "Guarda la lanterna", "^": "Torna in città" },
        flavor: { p: "Una colonna di cristallo nero. Dentro, come in un acquario, galleggia luce di tutti i colori. Rubata a tutte le isole.", l: "Una lanterna d'oro. Senza fiamma. Brilla di luce presa in prestito." },
        intro: [["voce", "La Sala del Trono. Un tappeto porpora lungo come un campo, colonne di cristallo nero, e in fondo il trono. Intorno al trono, quattro piedistalli con quattro frammenti: Terra, Vento, Fuoco, Acqua. E al centro, in una gabbia di luce, Aira."]],
        npcs: (s) => [...(s === 6 ? [{ id: "cr_aldeberto", at: [12, 6] }] : []), ...(s >= 7 ? [{ id: "cr_aira", at: [12, 5] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 0, "a"); lay(0, 17, 25, 17, "a"); lay(0, 0, 0, 17, "a"); lay(25, 0, 25, 17, "a"); lay(1, 1, 24, 16, "+");
          lay(11, 3, 13, 16, '"'); put(12, 2, "o"); put(12, 17, "^");
          [[8, 3], [16, 3], [8, 8], [16, 8]].forEach(([x, y]) => put(x, y, "c"));
          [[4, 4], [20, 4], [4, 10], [20, 10], [4, 14], [20, 14]].forEach(([x, y]) => put(x, y, "p")); [[2, 2], [22, 2], [2, 15], [22, 15]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          // il trono
          const x = d.X(12), y = d.Y(2); R(g, x - 4, y - 14, 24, 30, "#6a1a3a"); R(g, x - 4, y - 14, 24, 3, "#c9a227"); R(g, x - 6, y + 4, 28, 10, "#c9a227"); R(g, x + 2, y - 10, 12, 14, "#8a2a4a");
          // i quattro frammenti, ognuno col suo colore
          [[8, 3, "232,160,64"], [16, 3, "159,224,255"], [8, 8, "255,90,58"], [16, 8, "63,200,255"]].forEach(([tx, ty, col]) => gem(g, d.X(tx) + 8, d.Y(ty) + 2, col, d.fr, S() >= 7));
          // la gabbia di luce di Aira
          if (S() < 7) { const cx2 = d.X(12) + 8, cy2 = d.Y(5) + 6; g.strokeStyle = `rgba(255,240,180,${0.5 + 0.2 * Math.sin(d.fr / 10)})`; g.lineWidth = 1.5; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(cx2 - 10 + i * 4, cy2 - 18); g.lineTo(cx2 - 10 + i * 4, cy2 + 8); g.stroke(); } g.beginPath(); g.ellipse(cx2, cy2 - 18, 11, 3, 0, 0, 7); g.stroke();
            if (S() < 6 || S() === 6) { const c = X.api.CAST.cr_aira; R(g, cx2 - 4, cy2 - 8, 8, 8, c.shirt); R(g, cx2 - 3, cy2 - 15, 6, 6, c.skin); R(g, cx2 - 4, cy2 - 16, 8, 3, c.hair); } }
        },
      },
    };

    // ---------------------------------------------------------------- dialoghi
    const talk = {
      cr_vela() {
        const s = S();
        if (s === 0) return say([
          ["cr_vela", "Ascoltatemi. La capitale ha una cupola d'oro: luce rubata, tanta. Con la Rondine non si passa. Ci sbattiamo contro e diventiamo una frittata volante."],
          ["cr_vela", "Ma c'è un vecchio racconto dei contrabbandieri: la Porta delle Maree. Un tunnel sotto la capitale, che si apre solo se lo vuole il Cristallo dell'Acqua. Il Santuario è a sud-ovest."],
          ["cr_bram", "Allora andiamo a chiedere per favore al Cristallo dell'Acqua. Con gentilezza. E con il martello, se non capisce."],
          ["cr_trillo", "Trillo ha lucidato il cristallo azzurro di bordo. Per Aira. Così quando torna lo trova bello, frrr."],
        ], () => { setStep(N, 1); done(); });
        if (s >= 8) return say([["cr_vela", "Che storia, eh? Me la racconterò da vecchia. Esagerando."]]);
        return say([["cr_vela", pick2(["Il timone è lì. Vai a prenderla, Guerriero.", "Sai qual è la cosa più difficile del volare? Atterrare quando sei arrabbiata. Ci provo comunque."])]]);
      },
      cr_bram() { return say([["cr_bram", pick2(["Il martello grande è pronto. L'ho chiamato «Udienza Reale».", "Quella ragazza mi ha fatto sorridere tre volte. Tre. In vent'anni. Il re me le deve restituire."])]]); },
      cr_trillo() { return say([["cr_trillo", pick2(["Trillo ha paura del re. Ma Trillo ha più paura di un mondo senza partite. Frrr!", "Quando Aira torna, Trillo le regala una mela. La più rossa. Ce l'ha da giorni. Non l'ha mangiata. Quasi."])]]); },
      cr_ondina() {
        const s = S();
        if (s === 2) return say([
          ["cr_ondina", "Guerriero della Luce. Le onde parlavano di te da giorni. Sono pettegole. Vuoi la Porta delle Maree? Allora vuoi il Cristallo dell'Acqua. E per arrivarci devi attraversare il canale."],
          ["cr_ondina", "Il canale si abbassa solo se tocchi i tre cristalli nell'ordine giusto. L'ordine è sul murale, qui accanto. Sbaglia e l'acqua ti ride dietro. Letteralmente: gorgoglia."],
        ], () => { setStep(N, 3); done(); });
        if (s === 3 && !F.is("c3_acque")) return say([["cr_ondina", "Il murale, Guerriero. Leggilo con calma. Le onde aspettano: è l'unica cosa che sanno fare bene, oltre a bagnare."]]);
        if (s === 3) return say([["cr_ondina", "Il Cristallo è in fondo al tempio. Vai. Ti aspetta da quando la ragazza è passata di qui, ottant'anni fa, in catene."]]);
        return say([["cr_ondina", "Il Cristallo dell'Acqua ti ha aperto la Porta delle Maree. Usala. E riporta la ragazza al cielo."]]);
      },
      cr_kael() {
        const s = S();
        if (X.api.trZone() === "cr_acqua") return say([["cr_kael", "Le mie navi sono qui sopra, Guerriero. Tutte. Quando entrerai nella capitale dal basso, noi colpiremo la cupola dall'alto. Il re avrà due problemi. Uno dei due è il mio."]]);
        return say([["cr_kael", F.is("c3_cupola_rotta") ? "La cupola è incrinata. Le mie navi tengono occupate le guardie. Vai allo stadio, Guerriero. Ti copro le spalle." : "Pronto?"]]);
      },
      cr_pim() { return say([["cr_pim", "Il Generale non è venuto. Ma mi ha mandato a dirvi una cosa: «Se il Guerriero sceglie bene, Ferrogrigio sarà con lui alla fine». Ha detto proprio così. Io l'ho scritto sulla mano per non dimenticarlo. Guardate."]]); },
      cr_gilda() {
        if (!F.is("c3_gilda")) { F.set("c3_gilda", true); learnLore("l_re", true); return say([
          ["cr_gilda", "Pane? Ho pane alla Decima, pane al Sorriso del Re, pane Corona. Sono lo stesso pane. Cambia solo il nome. Come tutto, qui."],
          ["cr_gilda", "Mia nonna faceva il pane per il re. Mia madre faceva il pane per il re. Io faccio il pane per il re. Lo stesso re. Con la stessa faccia. Nessuno lo trova strano. Io sì. Ma lo dico solo al forno."],
        ]); }
        return say([["cr_gilda", pick2(["Se lo fermate, vi faccio un pane a forma di pallone. Ripieno. Di più pane.", "Il re non mangia il mio pane. Non mangia niente. Beve solo luce, dicono. Io dico: che spreco."])]]);
      },
      cr_pennino() {
        if (!F.is("c3_pennino")) { F.set("c3_pennino", true); learnLore("l_cupola", true); return say([
          ["cr_pennino", "Cronista Pennino, Gazzetta di Aldebaria. Trent'anni di articoli sui tornei del re. Il re vince sempre. Che noia, eh? Però guarda: questo cassetto. Articoli veri. Mai pubblicati."],
          ["cr_pennino", "La cupola sopra di noi è luce rubata alle isole. Quando le isole cadranno, la capitale resterà su. Il re lo chiama «piano di emergenza». Io lo chiamo con un'altra parola, ma la Gazzetta non me la fa scrivere."],
        ]); }
        return say([["cr_pennino", F.is("c3_cupola_rotta") ? "La cupola si è crepata! Scrivo tutto! Stavolta lo pubblico! Su un muro, se serve!" : "Se vincete, scrivo l'articolo della mia vita. Se perdete, scrivo il necrologio della mia carriera. Nessuna pressione."]]);
      },
      cr_lumio() { return S() === 5 ? stadium() : say([["cr_lumio", "Sua Maestà vi attende."]]); },
      cr_aldeberto() { return S() === 6 ? kingScene() : say([["cr_aldeberto", "…"]]); },
      cr_aira() { return S() >= 7 ? finale() : say([["cr_aira", "{n}…"]]); },
    };
    function pick2(a) { return a[Math.floor(Math.random() * a.length)]; }
    function puzzle(k) {
      const p = PUZ[k]; if (!p) return done();
      if (F.is("c3_acque")) return say([["voce", `Tocchi ${p[2]}. Canta una nota, contento. Il canale è già aperto.`]]);
      if (S() < 3) return say([["voce", `${p[2][0].toUpperCase() + p[2].slice(1)}. È tiepido. Forse prima conviene parlare con la custode.`]]);
      const seq = F.get("c3_seq", "").split(",").filter(Boolean);
      if (seq.includes(p[0])) return say([["voce", "Questo cristallo brilla già. Tocca gli altri."]]);
      seq.push(p[0]);
      if (ORDER[seq.length - 1] !== p[0]) { F.set("c3_seq", ""); X.SFX.bad(); X.refreshZone(); return say([["voce", `Tocchi ${p[2]}. Si accende… e si spegne, con tutti gli altri. Dal canale arriva un gorgoglio che sembra proprio una risata. L'ordine era sbagliato: ricomincia, e rileggi il murale.`]]); }
      F.set("c3_seq", seq.join(",")); X.SFX.job();
      if (seq.length < 3) return say([["voce", `Tocchi ${p[2]}. Si accende e resta acceso. Nel canale, l'acqua trema.`]]);
      F.set("c3_acque", true); X.setTiles(15, 9, 16, 11, "="); X.SFX.crystal(); X.refreshZone();
      return say([["voce", "Il terzo cristallo si accende. Le acque del canale si ritirano con un sospiro lunghissimo, e dal fondo emerge un passaggio di assi antiche: un ponte."], ["cr_ondina", "Terra che sorregge, Vento che solleva, Fuoco che scalda. L'hai letto bene. Il Cristallo ti aspetta."]]);
    }
    function waterCrystal() {
      if (S() < 3 || !F.is("c3_acque")) return say([["voce", "Il Cristallo dell'Acqua, pallido."]]);
      if (S() >= 4) return say([["voce", "Il Cristallo dell'Acqua scorre su se stesso come una cascata ferma. Ti mostra, se lo guardi, la Porta delle Maree sotto la capitale."]]);
      X.api.play(X.lines([
        ["voce", "Tocchi il Cristallo dell'Acqua. È freddo come una notte di mare. Poi ti mostra una cosa: una visione."],
        ["voce", "Ottant'anni fa. Una ragazza dai capelli d'argento gioca a calcio con dei bambini, su un prato. Un uomo giovane, con una corona troppo grande, la guarda. E capisce. La fa prendere."],
        ["voce", "Poi la sala bianca. L'uomo beve la luce della ragazza, e i suoi capelli non diventano mai bianchi. Gli anni passano su tutti, tranne che su di lui. È Aldeberto."],
        ["cr_ondina", "Ora sai. Il re non protegge la luce: la beve. E la ragazza è la sua fonte. Senza di lei, invecchierebbe in un giorno. Per questo non la lascerà andare."],
        ["voce", "Il Cristallo dell'Acqua apre la Porta delle Maree: un tunnel sotto la capitale. La mappa del mondo ora mostra Aldebaria."],
      ], "cr_acqua"), () => {
        learnLore("l_re", true); learnLore("l_maree", true); setStep(N, 4); X.refreshZone();
        say(ally() ? [["cr_kael", "Ho visto anch'io. Ottant'anni. E noi gli abbiamo comprato la luce. Andiamo, Guerriero: le mie navi colpiranno la cupola."]] : F.is("c1_pim_talk") ? [["cr_pim", "Il Generale mi ha detto: «Se il Guerriero sceglie bene, Ferrogrigio sarà con lui alla fine». Non so se è una promessa o una minaccia. Con lui è difficile."]] : [["cr_bram", "Ottant'anni. Andiamo a riprenderla. Prima che ne passino ottantuno."]]);
      });
    }
    function stadium() {
      ask("cr_lumio", "Il Guerriero della Luce! Sua Maestà vi aspettava. Siete venuti per la ragazza, naturalmente. Sua Maestà propone un gioco: la Partita dei Cristalli, qui, nello Stadio della Corona. Vincete e potrete parlare con lui. Perdete e… be'. Le tribune hanno sempre fame di spettacolo.", [
        { label: "⚽ Gioca la Partita dei Cristalli", sub: "Action Soccer 2D HD · contro la Guardia Reale", cls: "hot", fn: hdMatch },
        { label: "Non ancora", sub: "Preparati prima (mestieri, cristallo azzurro)", fn: done },
      ], "cr_capitale");
    }
    function hdMatch() {
      const k = ally();
      X.playMatch({
        id: "cr_cristalli", alt: "hd", mate: "Bram", squad: k ? ["Capitana Vela Ruggine", "Gen. Kael Ferrogrigio"] : ["Capitana Vela Ruggine", "Trillo"], us: "Guerrieri della Luce", homeKit: ["#3f5fbf", "#fff6c8"],
        chap: "Cristalli del Campo · La Partita dei Cristalli", bg: "cr_capitale", intro: k ? "Nello Stadio della Corona, sotto la cupola incrinata: {n}, Bram, Vela e il Generale Kael contro la Guardia Reale. In tribuna, il re." : "Nello Stadio della Corona, sotto la cupola d'oro: {n}, Bram, Vela e Trillo contro la Guardia Reale. In tribuna, il re.",
        oppNames: ["Guardia d'Oro", "Guardia d'Argento", "Guardia di Bronzo", "Capitano della Guardia", "Ser Lumio"],
        venue: { ads: [["STADIO DELLA CORONA", "#c9a227"], ["VIVA IL RE", "#6a1a3a"], ["ALDEBARIA", "#c9a227"], ["DECIMA DI LUCE", "#6a1a3a"]], crowd: ["#c9a227", "#6a1a3a", "#ffffff", "#c9a227", "#8a2a4a"], ground: ["#3f7a3a", "#468440"], line: "#ffe9b0cc", grid: "rgba(255,220,150,.06)", tint: "rgba(200,150,255,.10)", glow: "255,220,150" },
        team: (t, s) => ({ name: "Guardia Reale", vs: "la Guardia Reale", color: "#c9a227", atk: t(s.tiro * (k ? 0.95 : 1.02)), def: t(s.drib * 1.0), vel: t(s.tiro * 1.0), names: ["Guardia d'Oro", "Guardia d'Argento", "Guardia di Bronzo", "Capitano della Guardia", "Ser Lumio"] }),
        done: (r) => {
          if (!r.win) return ask("cr_lumio", `${r.a} a ${r.b}. Peccato, Guerriero. Sua Maestà però è magnanimo: vi concede un'altra partita. Le tribune adorano le rivincite.`, [
            { label: "⚽ Rivincita", sub: "Action Soccer 2D HD", cls: "hot", fn: hdMatch },
            { label: "Ritirati per ora", sub: "Torna da Lumio quando vuoi", fn: done },
          ], "cr_capitale");
          const msg = X.reward("cr_c3_cristalli", { coins: 50 });
          X.api.play(X.lines([
            ["voce", `${r.a} a ${r.b}. Lo stadio resta in silenzio. Poi un bambino, in alto, applaude. Poi un altro. Poi l'uomo con il cartello «APPLAUSI» butta via il cartello e applaude davvero. ${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}`],
            ["voce", "Sopra la cupola, la luce trema. Le partite vere fanno luce vera: e questa ha appena illuminato tutta la capitale."],
            ["cr_lumio", "Sua Maestà… vi riceverà nella Sala del Trono. (Per la prima volta, Ser Lumio sembra stanco. Sudato. Umano.)"],
          ], "cr_capitale"), () => { setStep(N, 6); go("cr_trono", 12, 15); });
        },
      });
    }
    function kingScene() {
      const signed = F.is("c2_vento_al_re");
      X.api.play(X.lines([
        ["cr_aldeberto", "Il Guerriero della Luce. Che bel nome. L'ho inventato io, sai? Settant'anni fa. Serviva qualcuno che riaccendesse i Cristalli quando io li avevo bevuti troppo."],
        ["cr_aldeberto", "Funziona sempre così: io prendo la luce, i Cristalli si spengono, arriva un eroe, gioca, li riaccende. E io prendo la nuova luce. Tu hai lavorato per me, ragazzo. Bene. Grazie."],
        ...(signed ? [["cr_aldeberto", "E grazie anche per la firma, alla Città Sospesa. La luce del Vento era deliziosa. Mi sento giovane come un ragazzo."]] : []),
        ["cr_aldeberto", "La ragazza è la mia fonte. La luce che non finisce, perché ogni partita la rinnova. Il popolo gioca, lei brilla, io bevo. Un sistema perfetto. Perché romperlo?"],
        ["cr_aira", "(dalla gabbia) Perché è mio, il gioco. È nostro. Non tuo. {n}… battilo. A modo nostro."],
        ["cr_aldeberto", "A modo vostro? Va bene. Giochiamo una Battaglia. Io sarò il vostro portiere avversario: il Re. Vediamo se il Guerriero sa rompere la Guardia di chi ha ottant'anni di luce in corpo."],
      ], "cr_trono"), () => {
        if (ally() && !F.is("c3_cupola_rotta")) F.set("c3_cupola_rotta", true);
        ask("voce", `La Battaglia ATB contro Re Aldeberto. ${signed ? "Con la luce del Vento che gli hai dato, la sua Guardia è più forte. " : ""}${ally() ? "Le navi di Kael bombardano la cupola: i suoi soldati sono distratti." : ""}`, [
          { label: "⚔ Battaglia contro il Re", sub: "Primo a 3 gol · ATB da boss", cls: "hot", fn: boss },
          { label: "✦ Mestieri e formazione", sub: "Prepara la squadra", fn: () => X.jobsMenu(boss) },
        ], "cr_trono");
      });
    }
    function boss() {
      const signed = F.is("c2_vento_al_re");
      X.battle({ title: "Re Aldeberto, il re che non tramonta", bg: "trono", us: "Guerrieri della Luce", oppName: "La Corona", bg2: "cr_trono", extraName: "Trillo",
        foes: [{ name: "Ser Lumio" }, { name: "Guardia d'Oro" }, { name: "Guardia d'Argento" }], keeper: { name: "Re Aldeberto", guard: signed ? 160 : 135 }, foeCol: "#c9a227", boss: true, target: 3, minutes: 2.5, diff: ally() ? 0.92 : 1.05,
        intro: "Il re si mette tra i pali. Le sue mani brillano della luce di Aira.",
        done: (r) => {
          if (!r.win) return ask("cr_aldeberto", "Ottant'anni di luce, ragazzo. Pensavi bastasse un pallone? …Ma riprova, riprova pure. Ogni volta che giochi, la ragazza brilla, e io bevo.", [
            { label: "⚔ Riprova la Battaglia", cls: "hot", fn: boss },
            { label: "✦ Cambia i mestieri e riprova", fn: () => X.jobsMenu(boss) },
            { label: "Ritirati per ora", sub: "Torna dal re quando vuoi", fn: done },
          ], "cr_trono");
          X.SFX.crystal(); const msg = X.reward("cr_c3_re", { coins: 80 });
          X.api.play(X.lines([
            ["voce", `${r.a} a ${r.b}. L'ultimo tiro rompe la Guardia del re e la gabbia di luce insieme. ${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}`],
            ["voce", "La luce di Aira torna a lei. E il re… il re invecchia. Non tutto in una volta: un anno a battito di ciglia. I capelli gli si fanno bianchi davvero, la schiena si piega. Si siede sul trono, piano."],
            ["cr_aldeberto", "Ottant'anni. Li sento tutti. Che… che stanchezza. (Ti guarda, e per la prima volta sembra solo un vecchio.) Avevo paura di invecchiare, ragazzo. Tutto qui. Avevo paura."],
            ["cr_aira", "{n}! (Aira ti corre incontro e ti abbraccia così forte che Bram, da dietro, finge di avere qualcosa in un occhio.)"],
          ], "cr_trono"), () => { setStep(N, 7); X.refreshZone(); finale(); });
        } });
    }
    // ---------------------------------------------------------------- i finali
    function finale() {
      const m = M(), secret = m.trust >= 5 && m.lore.length >= 10 && F.get("c2_cattura", "") !== "tratta";
      const opts = [{ label: "💎 Ridai la luce ai Cristalli", sub: "Calcistea torna a volare, e ogni anno si gioca", cls: "hot", fn: () => ending("luce") }];
      if (ally()) opts.push({ label: "🌊 Spezza i Cristalli", sub: "Le isole scendano piano sul mare. Le navi di Kael le accompagnano.", fn: () => ending("terra") });
      if (m.corona >= 4) opts.push({ label: "👑 Prendi la corona", sub: "Qualcuno deve regnare. Perché non tu?", fn: () => ending("corona") });
      if (secret) opts.push({ label: "✨ Il Quinto Campo", sub: "Un'idea di Aira. E tua.", cls: "hot", fn: () => ending("campo") });
      opts.push({ label: "Non ancora", sub: "Pensaci con calma", fn: done });
      ask("cr_aira", `Il re è solo un vecchio, adesso. La luce rubata è qui, in questa sala: tantissima. E i quattro Cristalli aspettano.\nCosa facciamo, {n}? Decidi tu. Io ti seguo, come un passaggio filtrante: so già dove andrai.${S() >= 8 ? "\n(Hai già visto un finale: puoi sceglierne un altro, se le tue scelte lo permettono.)" : ""}`, opts, "cr_trono");
    }
    const ENDS = {
      luce: { cos: "cr_cristallo", lines: [
        ["voce", "Apri le colonne di cristallo nero. La luce rubata esce come uno stormo e torna da dove era venuta: alla Terra, al Vento, al Fuoco, all'Acqua. Per tutta Calcistea le isole si sollevano di un palmo, come se respirassero."],
        ["cr_aira", "E io torno al mio posto. Non in una gabbia: nei prati. In ogni partita giocata per gioia, ci sarò. Mi vedrai di sfuggita, nel pallone che fa una curva strana. Quella sono io."],
        ["voce", "Aira ti bacia la fronte, e diventa luce, e la luce scende dalla finestra fino al campo più vicino, dove dei bambini stanno giocando. Il loro pallone, per un attimo, brilla."],
        ["cr_ortensia", "(Qualche mese dopo, a Borgo Radice) La Partita del Cristallo! Sessantun anni che arbitro! E la Lampada del Campo non è mai stata così luminosa. Chissà perché, ogni tanto, il pallone fa delle curve strane…"],
      ] },
      terra: { cos: "cr_mare", lines: [
        ["voce", "Guardi i quattro Cristalli, e poi guardi Kael. «Basta» dici. «Basta un regno che deve giocare per non cadere.»"],
        ["cr_kael", "Le mie navi sono pronte. Accompagneremo ogni isola giù, piano, fino al mare. Ferrogrigio lo sa fare: siamo già caduti una volta. Stavolta, insieme, sarà un atterraggio."],
        ["voce", "Tocchi i Cristalli, uno alla volta, e li ringrazi. Si spengono con dolcezza. Per tre giorni le isole scendono, accompagnate dalle corazzate di ferro, finché toccano il mare con un bacio d'onda."],
        ["cr_aira", "Senza Cristalli da tenere accesi, io posso restare così, con voi. Una ragazza normale con i capelli d'argento. Una regista. Mi prendete in squadra?"],
        ["voce", "Calcistea è un arcipelago, ora. Si gioca sulle spiagge, si gioca nei porti, si gioca perché è bello e basta. È la cosa più leggera che sia mai successa a un regno che volava."],
      ] },
      corona: { cos: "cr_reale", lines: [
        ["voce", "La corona del re è a terra, ai tuoi piedi. La raccogli. Pesa poco. Molto meno di quanto pensassi."],
        ["cr_aira", "{n}…? Sei sicuro?"],
        ["voce", "Ti siedi sul trono. La luce rubata ti gira intorno come un cane fedele. Con questa luce potresti tenere su tutte le isole, per sempre, senza che nessuno debba più giocare."],
        ["cr_bram", "Hmpf. Re {n}. Suona bene. Suonava bene anche Re Aldeberto, all'inizio, immagino."],
        ["voce", "Regni con giustizia, dicono gli storici. Le isole volano, la luce non manca. Ma nessuno gioca più la Partita del Cristallo: non serve. E ogni tanto, la sera, ti sorprendi a guardare il tuo riflesso, per vedere se sei invecchiato. Non lo sei."],
      ] },
      campo: { cos: "cr_arcobaleno", lines: [
        ["cr_aira", "Ho un'idea. Te la dico come la direbbe una regista: e se la luce non la tenesse nessuno? Né il re, né i Cristalli, né io. Se la facessimo tutti, ogni giorno, giocando?"],
        ["voce", "Insieme, aprite le colonne di cristallo nero. La luce rubata non torna ai Cristalli: si sparge su tutti i prati del regno. Su ogni campetto, ogni cortile, ogni spiaggia, ogni strada dove qualcuno abbia mai calciato un pallone."],
        ["voce", "Da quel giorno ogni partita, ovunque, tiene su un pezzetto di cielo. Non c'è più un santuario: c'è il mondo intero. Il quinto Campo."],
        ["cr_aira", "E io posso restare. Perché la luce non dipende più da me sola: dipende da tutti. Sono libera, {n}. Per la prima volta in ottant'anni. Andiamo a giocare?"],
        ["cr_aldeberto", "(da un angolo, vecchio, con un pallone tra le mani tremanti) Posso… posso giocare anch'io? Non lo faccio da tanto. Avevo dimenticato che fosse… bello."],
        ["voce", "Il finale segreto. Su Calcistea, adesso, si gioca dappertutto. E i più bravi di tutti, alla Partita di Tutti, sono un fabbro brontolone, una pilota funambola, un mufflo con le ali, un vecchio re, una ragazza d'argento e il Guerriero della Luce. Numero {num}."],
      ] },
    };
    function ending(id) {
      const e = ENDS[id];
      X.api.play(X.lines(e.lines, "cr_finale"), () => {
        X.end(id); finishChapter(N, id); setStep(N, 8);
        const msg = [...X.reward("cr_c3_fine", { coins: 120, cos: "cr_c3" }), ...X.reward("cr_fin_" + id, { coins: 40, cos: e.cos })];
        const E2 = X.ENDINGS[id], m = M();
        X.scene([["voce", `<b>FINE · ${E2[0]}</b><br>${E2[1]}<br><br>Finali trovati: ${m.ends.length} su ${Object.keys(X.ENDINGS).length}.${m.ends.length < 4 ? " Altre scelte, altri finali: rigioca i capitoli dal menu." : " Li hai trovati tutti. Il Cristallo del Campo ti saluta."}${msg.length ? "<br>" + msg.join(" · ") : ""}`]], done, "cr_finale");
      });
    }

    // ---------------------------------------------------------------- oggetti e uscite
    const obj = {
      "cr_acqua:n": () => say([["voce", "Il murale: tre figure giocano a calcio su un'isola. La prima tiene in piedi l'isola con le spalle, color ambra. La seconda la solleva soffiando, color cielo. La terza accende un fuoco perché nessuno abbia freddo, color brace."], ["voce", "Sotto, inciso: «Prima ciò che ci sorregge, poi ciò che ci solleva, poi ciò che ci scalda»."]]),
      "cr_acqua:m": (o) => puzzle(o.tx + "," + o.ty),
      "cr_acqua:c": () => waterCrystal(),
      "cr_capitale:q": (o) => (o.tx === 29 && o.ty === 17 ? (learnLore("l_sala", true), say([["voce", "La Sala Bianca. Una sedia, una finestra su un campo dove non gioca nessuno. Sul muro, graffiati con un'unghia, centinaia di piccoli palloni."], ["cr_bram", "…Ottant'anni a contare palloni sul muro. (Bram si gira. Non vuole che lo vediate.)"]])) : say([["voce", "Bussi. Da dentro: «Viva il re!». Poi, più piano: «…per modo di dire»."]])),
      "cr_trono:^": () => go("cr_capitale", 17, 13),
      "cr_trono:o": () => say([["voce", S() >= 7 ? "Il trono, vuoto. È solo una sedia molto scomoda, a guardarla bene." : "Il trono. Ci siede il re che non tramonta."]]),
      "cr_trono:c": () => say([["voce", S() >= 7 ? "Un frammento di Cristallo, libero, che pulsa come se respirasse di sollievo." : "Un frammento di Cristallo, imprigionato in un piedistallo d'oro. La sua luce scorre verso il trono."]]),
    };
    const def = {
      n: N, title: "La Partita dei Cristalli", sub: "Il Santuario dell'Acqua, la capitale, la Sala del Trono", start: "cr_nave", goal, zones, talk, obj, introBg: "cr_cielo",
      news: (id, s) => (id === "cr_vela" && s === 0) || (id === "cr_ondina" && s === 2) || (id === "cr_lumio" && s === 5) || (id === "cr_aldeberto" && s === 6) || (id === "cr_aira" && s === 7) || (id === "cr_gilda" && !F.is("c3_gilda")) || (id === "cr_pennino" && !F.is("c3_pennino")),
      intro: () => [
        ["voce", "La Rondine Grigia vola nella notte. Nessuno parla. Il cristallo azzurro di bordo gira piano, e Trillo ci dorme accanto, abbracciato a una mela."],
        ["voce", "Sul ponte, nel posto dove Aira guardava le nuvole, c'è un nastro d'argento legato al parapetto. L'ha lasciato lei."],
        ["cr_vela", "Allora. Si va a prendere una ragazza in un castello. Classico. Mi piacciono le cose classiche, quando le rovino io."],
      ],
    };
    return def;
  }
  boot();
})();
