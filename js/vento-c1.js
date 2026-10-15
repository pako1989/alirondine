// js/vento-c1.js - LA VALLE DEL VENTO GENTILE · Capitolo 1 «Il custode del prato»
// Mulinella, il villaggio dei mulini (con case in cui si entra: il mulino di Gualdo, il laboratorio di Selva, la locanda),
// e il Prato dei Soffi, dove gli spiriti giocano a pallone. Prima partita Col Vento contro i Soffi. Al tramonto, il vento si ferma.
(function () {
  "use strict";
  function boot() { const V = window.__vento; if (!V || !V.addChapter) return setTimeout(boot, 120); V.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, learnLore, finishChapter, quest, questDone, questState } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("ve_gualdo", { beard: "folta", acc: ["paglia"], name: "Mastro Gualdo", tag: "gray", hair: "#e8e4dc", style: "buzz", skin: "#e0b48a", eye: "#4a5a6a", bg: ["#5a3e26", "#ece2c8"], shirt: "#8a6a4a", },
      "Il mugnaio di Mulinella. Brontola con i mulini, con il tempo e con la farina; con le persone, solo il martedì. Ha scritto lui l'annuncio per il nuovo custode del prato, e da allora controlla la strada ogni mattina.");
    K.cast("ve_selva", { band: "#3fa7ff", acc: ["sciarpa"], name: "Selva Ventura", tag: "", hair: "#b0502a", style: "codino", skin: "#f0c8a0", eye: "#3a7a6a", bg: ["#2c4a3c", "#7ab8d8"], shirt: "#3a8a7a" },
      "Costruisce alianti e aquiloni in un laboratorio che sa di colla e di legno di tiglio. Vola sopra la valle con il suo aliante, il Gabbiano, e conosce ogni corrente per nome. Da qualche mese il Gabbiano non si alza più.");
    K.cast("ve_tisi", { acc: ["fiore"], name: "Nonna Tisi", tag: "gray", hair: "#f2f2f2", style: "bun", skin: "#d9a679", eye: "#5a4a3a", bg: ["#6a3a2a", "#f6eedc"], shirt: "#c0543a" },
      "Tiene la locanda «Il Ventaglio». Cucina zuppe che curano tutto tranne la nostalgia, e per quella ha un liquore di more. Dice di aver visto i Soffi da bambina, e di non aver mai smesso di vederli.");
    K.cast("ve_dora", { acc: ["chiave", "taccuino"], name: "Ingegnera Dora Ferraglia", tag: "", hair: "#2a2a2a", style: "slick", skin: "#f2d8c0", eye: "#5a6a7a", glasses: true, bg: ["#2a3040", "#c9a227"], shirt: "#4a5a6a" },
      "Della Compagnia delle Turbine, venuta dalla città con un anemometro d'ottone e una valigia piena di progetti. Misura il vento ovunque vada. È gentile, precisa, e convinta che il vento vada «messo da parte, come il grano».");
    K.cast("ve_sbuffo", { shape: "nuvola", acc: "", name: "Sbuffo", tag: "", hair: "#f6f6fa", style: "buzz", skin: "#f6f6fa", eye: "#2a2a30", bg: ["#8cc764", "#f6f6fa"], shirt: "#e8eef4" },
      "Un Soffio: uno spirito del vento grande come un pallone, fatto di nebbia e di risate. È il capitano dei Soffi del prato. Non parla, ma si capisce benissimo cosa vuole: giocare.");
    K.cast("ve_soffio", { shape: "nuvola", acc: "", name: "Un Soffio", tag: "", hair: "#f6f6fa", style: "buzz", skin: "#f6f6fa", eye: "#2a2a30", bg: ["#8cc764", "#f6f6fa"], shirt: "#e8eef4" },
      "Un piccolo spirito del vento. Profuma di bucato e di erba tagliata. Se lo guardi troppo, diventa trasparente per timidezza.");

    K.cos("ve_c1", { kind: "shirt", label: "Maglia del custode del prato", val: "#5a8a4a", from: "Completa il Capitolo 1 de La Valle del Vento Gentile" });
    K.cos("ve_tarassaco", { kind: "hairc", label: "Capelli Tarassaco", val: "#f4efe0", from: "Trova tutti i Soffi di Mulinella" });
    K.cos("ve_sciarpa", { kind: "acc", label: "Sciarpa del vecchio custode", val: "#c0543a", from: "Il capanno del custode, sul Prato dei Soffi" });
    K.cos("ve_aquilone", { kind: "shirt", label: "Maglia Aquilone", val: "#e85a4a", from: "Trova tutti i Soffi del Prato" });

    K.lore("l_annuncio", { t: "L'annuncio di Gualdo", d: "«Cercasi custode per il Prato dei Soffi. Compiti: tagliare l'erba, segnare le linee, giocare con chi viene. Vitto, alloggio e vento. Astenersi persone serie.» Scritto a mano, con una macchia di farina." });
    K.lore("l_soffi", { t: "Cosa sono i Soffi", d: "Secondo Nonna Tisi i Soffi sono pezzetti di vento che si sono fermati a giocare. Finché c'è qualcuno che gioca con loro, restano. Quando nessuno gioca più, tornano vento e se ne vanno." });
    K.lore("l_custode", { t: "Il vecchio custode", d: "Pietro Lieve, custode del prato per quarant'anni. Una mattina di tanti anni fa ha lasciato il capanno in ordine, la sciarpa sul gancio, e non è più tornato. Nessuno l'ha visto partire. Gualdo dice che «è andato su per il colle». Non dice altro." });
    K.lore("l_mulini", { t: "I mulini di Mulinella", d: "Sette mulini, uno per ogni giorno della settimana. Il mulino della domenica non macina: gira e basta, «per fare compagnia agli altri». Da tre mesi girano tutti più piano." });

    const goal = (s) => ({
      0: "Mastro Gualdo ti aspetta al suo mulino (in alto a sinistra): entra dalla porta.",
      1: "Selva ha le chiavi del capanno: il suo laboratorio è la casa dal tetto verde-azzurro (in alto, a destra del sentiero).",
      2: "Vai al Prato dei Soffi: oltre il ponte, sempre verso est. Cerca il capitano dei Soffi.",
      3: "Il vento si è fermato. Parla con Mastro Gualdo, sul prato.",
    }[s] || "Capitolo concluso. Il prossimo ti aspetta dal menu.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(28,44,38,.85)"); R(g, x - w / 2, y + 2, w, 1, "#8cc76a"); g.fillStyle = "#fbf6e6"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    const sunset = (s) => (s >= 3 ? "tramonto" : "giorno");

    const zones = {
      ve_valle: {
        region: "valle", name: "Il Vento Gentile · Mulinella", short: "Mulinella", sub: "Il villaggio dei sette mulini", bg: "ve_valle", time: sunset, travel: [3, 13],
        wind: { str: (s) => (s >= 3 ? 0.04 : 0.5), every: 15 }, millStop: (s) => s >= 3,
        w: 38, h: 26, start: [2, 13], itemCos: "ve_tarassaco", items: [[2, 10], [35, 9], [9, 23], [27, 24]],
        areas: [[3, 3, 10, 8, "Il mulino di Gualdo"], [21, 3, 28, 8, "Il laboratorio di Selva"], [2, 15, 12, 20, "Locanda «Il Ventaglio»"], [31, 3, 37, 12, "Il grande albero"], [0, 0, 37, 25, "Mulinella"]],
        act: { n: "Leggi il cartello", t: "Guarda l'albero", b: "Siediti", l: "Guarda la lanterna", w: "Guarda il ruscello", q: "Entra", r: "Guarda il sasso", f: "Guarda la staccionata", ">": "Vai al Prato dei Soffi" },
        flavor: {
          n: ["Cartello: «MULINELLA · sette mulini, un prato, nessuna fretta».", "Cartello: «AL PRATO DEI SOFFI → oltre il ponte. Si gioca tutti i giorni. Anche quando piove. Soprattutto quando piove»."],
          t: "Un albero di tiglio. Le foglie si girano tutte dalla stessa parte, come per vedere meglio da dove arriva il vento.",
          b: "Ti siedi. Da qui si sentono i mulini: un cigolio lento, regolare, come il respiro di qualcuno che dorme.",
          l: "Una lanterna di ferro con il vetro colorato. Di giorno è spenta, e sembra aspettare.",
          w: "Il ruscello corre verso valle. Ci galleggia una barchetta di carta. Sopra, a matita: «per il mare».",
          r: "Un sasso liscio, caldo di sole. Qualcuno ci ha disegnato due occhi. Ti guarda con aria saggia.",
          f: "La staccionata dell'orto. Ai pali sono legati nastri colorati: servono a vedere il vento. Pendono quasi immobili.",
        },
        intro: [["voce", "Mulinella. La valle si apre come una mano: sette mulini sulle colline, case bianche con i tetti rossi, un ruscello che chiacchiera da solo."], ["voce", "In tasca hai un annuncio piegato in quattro: «Cercasi custode per il Prato dei Soffi». Il vento ti spettina appena. Ti sembra un benvenuto."]],
        npcs: (s) => [...(s >= 3 ? [] : []), { id: "ve_soffio", at: [16, 11] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 37, 0, "t"); lay(0, 25, 37, 25, "t"); lay(0, 0, 0, 25, "t"); lay(37, 0, 37, 25, "t");
          lay(1, 13, 36, 14, ":"); lay(18, 2, 19, 24, ":"); lay(6, 22, 26, 22, ":");
          lay(29, 1, 30, 24, "w"); lay(29, 13, 30, 14, "=");
          lay(1, 9, 8, 11, "*"); lay(31, 8, 36, 11, "*"); lay(31, 20, 36, 23, "*");
          house(3, 3, 6, 5, { door: [5, 7], roof: "#a04a32", wall: "#ece2c8", chimney: true, enter: { room: "mulino", id: "ve_mulino_in", name: "Il mulino di Gualdo", bg: "ve_mulino", intro: "Dentro il mulino tutto è bianco di farina: le travi, i sacchi, perfino il gatto. La grande ruota dentata gira, cigola, gira.", who: [{ id: "ve_gualdo", at: [10, 5] }], chest: { coins: 20, lore: "l_mulini", text: "In una cassetta, sotto un mucchio di sacchi vuoti, monete e un foglio con i nomi dei sette mulini." } } });
          lay(5, 8, 5, 12, ":"); put(9, 5, "M");
          house(22, 3, 6, 5, { door: [24, 7], roof: "#3a7a8a", wall: "#f2ead8", enter: { room: "bottega", id: "ve_lab", name: "Il laboratorio di Selva", bg: "ve_valle", intro: "Il laboratorio di Selva: aquiloni appesi al soffitto come pipistrelli colorati, ali di tela tese su telai di tiglio, odore di colla e di vernice.", who: (s) => (s <= 1 ? [{ id: "ve_selva", at: [10, 4] }] : []) } });
          lay(24, 8, 24, 12, ":");
          house(11, 3, 5, 4, { door: [13, 6], roof: "#c0543a", wall: "#f6eedc", flowers: true, enter: "Casa Bonvento. Sulla porta un biglietto: «Siamo al prato. Se il prato è chiuso, siamo al prato lo stesso»." });
          lay(13, 7, 13, 12, ":");
          house(3, 15, 8, 5, { door: [6, 19], roof: "#c0543a", wall: "#f6eedc", chimney: true, flowers: true, lit: true, enter: { room: "locanda", id: "ve_locanda", name: "Locanda «Il Ventaglio»", bg: "ve_valle", intro: "La locanda «Il Ventaglio»: tavoli di legno, un camino, e appesi alle travi centinaia di ventagli di carta, uno per ogni ospite che è passato di qui.", who: (s) => [{ id: "ve_tisi", at: [10, 4] }, ...(s >= 2 ? [{ id: "ve_dora", at: [15, 7] }] : [])] } });
          lay(6, 20, 6, 21, ":");
          house(10, 16, 5, 4, { door: [12, 19], roof: "#a04a32", wall: "#ece0c8", enter: "La casa del fornaio. Dalla finestra esce un profumo di pane alle noci. Bussi: «Torna domani, che oggi il forno è di cattivo umore»." });
          lay(12, 20, 12, 21, ":");
          house(21, 16, 6, 4, { door: [24, 19], roof: "#c0543a", wall: "#f2ead8", flowers: true, enter: "Casa Lievito. Una signora alla finestra ti saluta con il mattarello. «Il nuovo custode! Si vede dalle scarpe: sono scarpe da prato»." });
          lay(24, 20, 24, 21, ":");
          [[32, 17], [35, 19], [15, 9], [34, 2]].forEach(([x, y]) => put(x, y, "M"));
          put(33, 5, "O"); put(16, 10, "S");
          [[10, 12], [27, 12], [20, 21]].forEach(([x, y]) => put(x, y, "l")); put(15, 15, "b"); put(21, 12, "n"); put(35, 12, "n");
          [[2, 3], [10, 9], [26, 10], [32, 14], [2, 23], [15, 23], [27, 18], [34, 24]].forEach(([x, y]) => put(x, y, "t")); [[9, 21], [27, 20]].forEach(([x, y]) => put(x, y, "r"));
          lay(1, 16, 1, 21, "f"); put(36, 13, ">"); put(36, 14, ">");
        },
        decor(g, cx, cy, d) { plaque(g, "IL MULINO DI GUALDO", d.X(6), d.Y(3) - 2); plaque(g, "LABORATORIO", d.X(25), d.Y(3) - 2); plaque(g, "IL VENTAGLIO", d.X(7), d.Y(15) - 2); plaque(g, "AL PRATO →", d.X(35) + 8, d.Y(12) - 2); },
      },
      ve_prato: {
        region: "prato", name: "Il Vento Gentile · Il Prato dei Soffi", short: "Il Prato dei Soffi", sub: "Dove gli spiriti giocano a pallone", bg: "ve_prato", time: sunset, travel: [2, 12],
        wind: { str: (s) => (s >= 3 ? 0.03 : 0.6), every: 15 },
        w: 40, h: 24, start: [2, 12], itemCos: "ve_aquilone", items: [[6, 20], [37, 20], [22, 2], [3, 3]], pitch: [12, 6, 20, 12],
        areas: [[12, 6, 31, 17, "Il campo dei Soffi"], [33, 2, 39, 8, "Il capanno del custode"], [0, 0, 39, 23, "Il Prato dei Soffi"]],
        act: { g: "Guarda la porta", t: "Guarda l'albero", n: "Leggi il cartello", q: "Entra", "<": "Torna a Mulinella", ";": "Guarda l'erba alta" },
        flavor: {
          g: "Una porta di rami intrecciati, legati con nastri. La rete è un vecchio telo da aquilone. Ha tre buchi, tutti a forma di pallone.",
          t: "Un albero di gelso. Sui rami bassi, qualcuno ha appeso dei campanelli. Suonano quando arriva il vento. Adesso, quasi mai.",
          n: "Cartello, scritto con il gesso: «REGOLE DEL PRATO: 1. Si gioca. 2. Chi segna offre. 3. Il vento ha sempre ragione».",
        },
        intro: [["voce", "Il Prato dei Soffi. Erba alta fino alle ginocchia, due porte di rami, e su tutto un silenzio strano, pieno di risatine."], ["voce", "Poi li vedi: palline di nebbia bianca, grandi come palloni, che rotolano, saltano e si passano un pallone vero. I Soffi."]],
        npcs: (s) => [{ id: "ve_sbuffo", at: [21, 11] }, { id: "ve_soffio", at: [16, 9] }, ...(s >= 2 ? [{ id: "ve_selva", at: [9, 13] }] : []), ...(s >= 3 ? [{ id: "ve_gualdo", at: [9, 10] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 0, "t"); lay(0, 23, 39, 23, "t"); lay(39, 0, 39, 23, "t"); lay(0, 0, 0, 10, "t"); lay(0, 15, 0, 23, "t");
          lay(1, 12, 11, 13, ":"); put(0, 12, "<"); put(0, 13, "<");
          lay(12, 6, 31, 17, "-"); put(11, 11, "g"); put(11, 12, "g"); put(32, 11, "g"); put(32, 12, "g");
          lay(2, 1, 10, 4, ";"); lay(14, 19, 26, 21, ";"); lay(33, 15, 38, 21, ";"); lay(15, 1, 26, 3, "*");
          house(34, 3, 5, 4, { door: [36, 6], roof: "#6a4a2a", wall: "#d8c8a8", enter: { room: "casa", id: "ve_capanno", name: "Il capanno del custode", bg: "ve_prato", intro: "Il capanno del vecchio custode. Tutto in ordine, come se fosse uscito un minuto fa: gli scarpini allineati, la tazza capovolta, la sciarpa rossa appesa al gancio.", who: [], locked: (K) => (!K.F.is("ve_chiave") ? "Il capanno è chiuso a chiave. Selva ha detto che la chiave ce l'ha lei." : false), chest: { coins: 30, lore: "l_custode", cos: "ve_sciarpa", text: "Nella cassapanca, sotto un pallone sgonfio, la sciarpa rossa del vecchio custode e un quaderno con una sola pagina scritta." } } });
          lay(36, 7, 36, 11, ":"); lay(33, 11, 36, 11, ":");
          put(6, 6, "O"); put(4, 18, "S"); put(10, 8, "n");
          [[3, 8], [30, 3], [10, 20], [28, 21], [37, 13]].forEach(([x, y]) => put(x, y, "t")); [[13, 4], [33, 9]].forEach(([x, y]) => put(x, y, "M"));
        },
        decor(g, cx, cy, d) { plaque(g, "IL CAPANNO DEL CUSTODE", d.X(36) + 8, d.Y(3) - 2); },
      },
    };

    // ---------------------------------------------------------------- la partita: Col Vento contro i Soffi
    function matchSoffi() {
      K.ownMatch(window.__ventoPartita.start, { oppStyle: "equilibrata",
        title: "Col Vento · Contro i Soffi", us: "Il custode e Selva", opp: { name: "I Soffi del prato", kit: "#f0e6ff", names: ["Sbuffo", "Fiato"] }, spiritsOpp: true, calm: true, half: 35, extra: false,
        mate: { name: "Selva", skin: "#f0c8a0", hair: "#b0502a", shirt: "#3a8a7a" }, bg: "ve_prato",
        halftime: "I Soffi si siedono sull'erba a riprendere fiato. Uno si addormenta. Un altro lo sveglia soffiandogli in faccia. Ridono tutti.",
        introExtra: "<p>Per i Soffi non conta chi vince: conta che si giochi. Ma un buon gol li fa ridere più forte.</p>",
        done: (r) => {
          setStep(N, 3); K.note(r.win ? "Hai battuto i Soffi, Col Vento." : "Hai giocato con i Soffi. Hanno vinto loro, e ne erano felicissimi.");
          bond("gioia", r.win ? 3 : 2); if (r.data && r.data.wind && r.data.wind.gustGoals) bond("gioia", 1);
          K.scene([
            ["voce", r.win ? "Fischio finale. I Soffi ti saltano addosso tutti insieme: è come essere abbracciati da una nuvola." : "Fischio finale. I Soffi fanno una specie di girotondo intorno a te. Hanno vinto, e vogliono che tu sia contento per loro. Lo sei."],
            ["ve_selva", "Hai visto? Non importa a nessuno come finisce. Qui si gioca per… per questo. Per la risata dopo."],
            ["voce", "Poi, mentre il sole tocca le colline, succede una cosa strana. I campanelli sul gelso smettono di suonare. L'erba si raddrizza. I semi di tarassaco cadono dritti, come neve senza vento."],
            ["voce", "Il vento si è fermato. Del tutto."],
            ["ve_selva", "…No. No, no, no. Non così. Guarda i mulini."],
            ["voce", "Laggiù, sulle colline, le pale dei sette mulini rallentano, rallentano… e si fermano. Anche quello della domenica."],
          ], () => { K.enterZone("ve_prato"); }, "ve_prato");
        },
      });
    }

    const talk = {
      ve_gualdo() {
        const s = S();
        if (s === 0) return say([
          ["ve_gualdo", "Chi è? Se è per la farina, è finita. Se è per i debiti, sono finiti anche quelli. Se è per…"],
          ["ve_gualdo", "Aspetta. Hai l'annuncio in mano. Sei tu. Sei venuto davvero."],
          ["hero", "Sono {n}. Cercavate un custode per il prato."],
          ["ve_gualdo", "Cercavamo. Da undici anni. Il vecchio Pietro se n'è andato e da allora il prato se lo curano i Soffi da soli. Male, s'intende: l'erba è alta, le linee non ci sono, la porta di sinistra è un'opinione."],
          ["ve_gualdo", "Il lavoro è semplice: tagli l'erba, segni le linee, e giochi con chi viene. Chiunque venga. Anche con quelli che non vedi bene."],
          ["ve_gualdo", "La chiave del capanno ce l'ha Selva, quella degli aquiloni. Il suo laboratorio è dall'altra parte del sentiero. Dille che ti mando io. E dille… dille che il vento torna. Lei ci crede ancora, a quello che dico io."],
        ], () => { setStep(N, 1); K.learnLore("l_annuncio"); K.note("Mastro Gualdo ti ha preso come custode del prato."); done(); });
        if (s === 3) return ask("ve_gualdo", "Sono salito su apposta. Undici anni che faccio il mugnaio con un mulino che gira, e oggi si è fermato. Tutti e sette. Non era mai successo, nemmeno quando se n'è andato Pietro.\n\nTu sei appena arrivato. Non ti chiedo niente. Ma dimmi tu: che si fa?", [
          { label: "«Riporterò il vento. Non so come, ma lo farò»", sub: "Una promessa, a Selva e a tutti", big: true, fn: () => end1("promessa") },
          { label: "«Io resto. Finché serve, il prato ha un custode»", sub: "Restare, anche senza vento", big: true, fn: () => end1("resto") },
          { label: "«Non lo so. Ma domani si gioca lo stesso»", sub: "Un passo alla volta", fn: () => end1("domani") },
        ], "ve_prato");
        return say([["ve_gualdo", s >= 4 ? "Domattina vado su al colle a vedere. Da lì si vede tutta la valle. E, se c'è, anche il vento." : "Il prato è oltre il ponte. Vai pure: i mulini li guardo io."]]);
      },
      ve_selva() {
        const s = S();
        if (s === 1) return say([
          ["ve_selva", "Un custode! Gualdo l'ha detto per anni, e nessuno ci credeva. Nemmeno lui, secondo me."],
          ["ve_selva", "Io sono Selva. Costruisco aquiloni e alianti. Quello lì, sotto il telo, è il Gabbiano: con lui ho attraversato la valle sei volte. Da tre mesi non si alza più. Il vento è… stanco. Debole. Come una persona che ha corso troppo."],
          ["ve_selva", "Ecco la chiave del capanno di Pietro. La tengo io da quando se n'è andato. Ogni tanto ci passo a spolverare. Non so perché. Forse perché lui faceva così con le cose degli altri."],
        ], () => { F.set("ve_chiave", true); K.note("Selva ti ha dato la chiave del capanno del custode."); askSpirits(); });
        if (s === 2) return say([["ve_selva", "I Soffi sono già in campo. Il capitano è quello più grosso, al centro: Sbuffo. Se ti fa un inchino, è una sfida. Se ti fa due inchini, è una sfida e ha anche fame."]]);
        if (s >= 3) return say([["ve_selva", s >= 4 ? "Domani salgo con il Gabbiano. Anche a piedi, se serve. Da qualche parte il vento dev'essere andato." : "Non toccare niente. Ascolta. Senti? Niente. È la prima volta in vita mia che sento il niente."]]);
        return say([["ve_selva", "Gualdo ti aspetta al mulino. È quello che brontola di più: lo trovi facilmente."]]);
      },
      ve_tisi() {
        const q = questState("ve_sciarpa_tisi");
        if (q === 0) { quest("ve_sciarpa_tisi", "La sciarpa di Nonna Tisi", "Una folata l'ha portata sul grande albero, a est del ruscello."); return say([["ve_tisi", "Benvenuto al Ventaglio, custode. Siediti, che la zuppa è calda e il pane è di ieri, cioè perfetto."], ["ve_tisi", "Una cortesia, se hai gambe giovani: stamattina una folata, l'ultima buona da settimane, mi ha portato via la sciarpa di lana. È finita sul grande albero, quello oltre il ruscello. Io ci arrivo solo con lo sguardo."]]); }
        if (q === 1 && F.is("ve_sciarpa_presa")) { questDone("ve_sciarpa_tisi"); const msg = K.reward("q:ve_sciarpa_tisi", { coins: 25 }); bond("gioia", 1); K.learnLore("l_soffi"); return say([["ve_tisi", "La mia sciarpa! Odora ancora di albero. E di vento. Grazie, ragazzo."], ["ve_tisi", "Sai, da bambina vedevo i Soffi tutti i giorni. Dicevano che sono pezzetti di vento che si fermano a giocare. Finché qualcuno gioca con loro, restano."], ["voce", `<b>${msg.join(" · ") || "Nonna Tisi ti regala una fetta di torta di noci."}</b>`]]); }
        if (q === 1) return say([["ve_tisi", "Il grande albero è a est, oltre il ponte del ruscello. Non arrampicarti, eh. Aspetta il vento: lui le cose le prende, e a volte le ridà."]]);
        return say([["ve_tisi", S() >= 3 ? "Il vento si è fermato e i ventagli non si muovono più. Sai che la locanda si chiama così perché qui il vento entrava da tutte le finestre?" : "Se ti serve qualcosa, chiedi. Se non ti serve niente, siediti lo stesso."]]);
      },
      ve_dora() {
        if (F.is("ve_dora1")) return say([["ve_dora", "Ventitré nodi tre mesi fa, quattro nodi oggi. I numeri non mentono, custode. Mentono le persone, a volte, per gentilezza."]]);
        F.set("ve_dora1", true);
        return ask("ve_dora", "Lei è il nuovo custode? Piacere: Dora Ferraglia, Compagnia delle Turbine. Misuro il vento di tutta la regione. Sta calando ovunque, ma qui più che altrove.\n\nLa Compagnia costruisce turbine di ferro che il vento lo conservano: lo raccolgono quando c'è e lo restituiscono quando manca. Come un granaio. Le lascio il mio biglietto, se vuole.", [
          { label: "Prendi il biglietto", sub: "Non costa niente ascoltare", fn: () => { F.set("ve_biglietto", true); bond("turbine", 1); K.note("Dora Ferraglia ti ha lasciato il biglietto della Compagnia delle Turbine."); say([["ve_dora", "Lo tenga. Quando il prato sarà fermo come i mulini, ne riparleremo."]]); } },
          { label: "«Il vento non si mette in un granaio»", sub: "Gentile, ma no", fn: () => say([["ve_dora", "Lo dicevano anche del grano, una volta. Arrivederci, custode."]]) },
        ], "ve_valle");
      },
      ve_sbuffo() {
        const s = S();
        if (s < 2) return say([["voce", "Sbuffo, il capitano dei Soffi, ti gira intorno curioso. Poi guarda verso il villaggio, come per dire: prima passa da chi ti aspetta."]]);
        if (s === 2) return ask("voce", "Sbuffo rotola fino ai tuoi piedi. Si gonfia, si sgonfia, e fa un inchino. Poi un altro. Dietro di lui, i Soffi del prato si mettono in fila con il pallone.\n\nÈ una sfida. (E forse ha anche fame.)", [
          { label: "Accetta: si gioca Col Vento!", sub: "Tu e Selva contro i Soffi", cls: "hot", fn: matchSoffi },
          { label: "Prima fai un giro del prato", fn: done },
        ], "ve_prato");
        return say([["voce", s >= 4 ? "Sbuffo è sgonfio, quasi trasparente. Ti guarda. Poi guarda il colle, a nord. Poi di nuovo te." : "Sbuffo si è rimpicciolito. Senza vento i Soffi non rotolano: restano fermi nell'erba, come neve che non sa sciogliersi."]]);
      },
      ve_soffio() { return say([["voce", K.pick(["Un Soffio ti annusa la mano. Fa il solletico. Poi scappa ridendo, una risata che suona come un campanello di vetro.", "Un Soffio è rimasto impigliato in un filo d'erba. Lo liberi soffiando. Si gonfia di orgoglio, come se ce l'avesse fatta da solo.", "Un Soffio ti segue per un po', tenendosi a mezzo passo di distanza. Quando ti giri, fa finta di essere una nuvola."])]]); },
    };
    function askSpirits() {
      ask("ve_selva", "Gualdo ti ha detto dei Soffi? Gli spiriti del prato. Molti non li vedono. Altri li vedono, ma fanno finta di niente, perché è più comodo.\n\nTu ci credi?", [
        { label: "«Sì. Li ho già visti, arrivando»", sub: "Il primo Soffio, vicino all'altarino", fn: () => { bond("selva", 1); setStep(N, 2); say([["ve_selva", "Allora siamo in due. Anzi, in tre: Gualdo dice di no, ma gli lascia sempre la farina sul davanzale."]]); } },
        { label: "«Non lo so ancora»", sub: "Onestà", fn: () => { setStep(N, 2); say([["ve_selva", "Va bene così. I Soffi preferiscono chi non è sicuro: si possono ancora sorprendere."]]); } },
        { label: "«Sono storie per bambini»", sub: "Un po' brusco", fn: () => { bond("selva", -1); setStep(N, 2); say([["ve_selva", "Ah sì? Allora vai al prato. Poi torniamo a parlarne. (Sorride, come chi sa già come finisce.)"]]); } },
      ], "ve_valle");
    }
    function end1(kind) {
      if (kind === "promessa") { bond("selva", 2); bond("gioia", 1); F.set("ve_promessa", true); }
      else if (kind === "resto") { F.set("ve_resto", true); bond("gioia", 2); }
      else bond("gioia", 1);
      const msg = K.reward("ch:ve_c1", { coins: 60, cos: "ve_c1" });
      finishChapter(N); setStep(N, 4);
      K.scene([
        ["ve_gualdo", kind === "promessa" ? "Riportarlo. Il vento. Detto da uno che è qui da un giorno. …Va bene. Va bene, custode. Ci credo. Non so perché, ma ci credo." : kind === "resto" ? "Restare. Senza vento, senza mulini, senza niente da tagliare perché l'erba non cresce senza vento. …Pietro avrebbe detto la stessa cosa. Con la stessa faccia." : "Domani si gioca lo stesso. Sì. È la cosa più sensata che ho sentito da undici anni."],
        ["ve_selva", "Domattina salgo al colle. Lassù il vento c'è sempre stato, anche d'agosto. Se è andato da qualche parte, dev'essere passato di là."],
        ["voce", "Quella notte, dalla finestra del capanno, vedi una cosa. Lontana, oltre il bosco, una casa cammina. Su quattro zampe di legno, con il comignolo che fuma. Fa un passo. Poi un altro. Poi sparisce tra gli alberi."],
        ["voce", `<b>Fine del Capitolo 1 · Il custode del prato.</b> ${msg.join(" · ")}`],
      ], () => K.openMain(), "ve_prato");
    }
    const obj = {
      "ve_valle:O": () => {
        if (questState("ve_sciarpa_tisi") === 1 && !F.is("ve_sciarpa_presa")) { F.set("ve_sciarpa_presa", true); K.SFX.wind(); return say([["voce", "La sciarpa di Nonna Tisi è impigliata in alto, tra i rami. Non ci arrivi. Aspetti. Poi arriva un filo di vento, debolissimo, quasi un sospiro: la sciarpa si sfila dal ramo e ti cade dritta tra le mani. Come un favore."]]); }
        return say([["voce", "Il grande albero di Mulinella. Intorno al tronco c'è una corda con strisce di carta bianca. Le strisce sono ferme. Di solito, dicono, frusciano tutto il giorno."]]);
      },
      "ve_valle:>": () => (S() >= 2 ? go("ve_prato", 2, 12) : say([["voce", S() === 0 ? "Il sentiero per il prato. Prima, però, passa dal mulino di Gualdo: è lui che ti aspetta." : "Prima prendi la chiave del capanno da Selva, al laboratorio."]])),
      "ve_prato:<": () => go("ve_valle", 35, 13),
      "ve_valle:M": () => say([["voce", S() >= 3 ? "Il mulino è fermo. Le pale pendono, una verso terra, come un braccio stanco." : "Un mulino a vento. Le pale girano piano, con un cigolio che sembra una ninna nanna."]]),
      "ve_prato:M": () => say([["voce", "Un mulino piccolo, con le pale di tela. Serve solo a pompare l'acqua per l'erba del prato. Pietro lo chiamava «il raccattapalle»."]]),
      "ve_prato:O": () => say([["voce", "Un albero enorme, con le radici che escono dalla terra come mani. Tra le radici dormono tre Soffi, uno sopra l'altro."]]),
    };
    return { n: N, title: "Il custode del prato", sub: "Mulinella, i Soffi, il vento che si ferma", goal, start: "ve_valle", introBg: "ve_valle",
      intro: () => [["voce", "Una valle stretta tra le colline. Un treno che ti lascia all'ultima stazione. Un sentiero che scende tra i papaveri."], ["voce", "Davanti a te, sette mulini girano lenti. Lenti davvero: come se ogni giro costasse fatica."]],
      zones, talk, obj };
  }
  boot();
})();
