// js/regno-c2.js - CRONACHE DEL REGNO ULTIMO · Capitolo 2 «Il Giro delle Tre Casate»
// La Principessa manda il Campione a conquistare il favore delle Casate: una prova al Forte dei Lupi, una al Porto dei Gabbiani, una al Bosco dei Cervi.
// I cancelli di Casata si aprono solo agli alleati. Al ritorno, a Castelalto, qualcuno ha dato ai Corvi il piano del Duello: e tutti guardano Mirta.
(function () {
  "use strict";
  function boot() { const D = window.__regno; if (!D || !D.addChapter || !D._has || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N), HS = ["lupi", "gabbiani", "cervi"];
    const prove = () => HS.filter((h) => F.is("re_t_" + h)).length;

    K.cast("re_tarsia", { acc: ["casco"], name: "Sergente Tarsia Dente", tag: "gray", hair: "#6a4a3a", style: "braids", skin: "#d8b08a", eye: "#2a2a34", beard: false, bg: ["#4a5266", "#8b95ab"], shirt: "#6a7288" },
      "Quartiermastro del Forte dei Lupi. Conta le lance la mattina e i soldati la sera, e non ha mai sbagliato un conto, il che la rende insopportabile e indispensabile.");
    K.cast("re_scilla", { acc: ["bandana"], name: "Scilla Marenghi, Campionessa dei Gabbiani", tag: "", hair: "#2a6a9a", style: "ponytail", skin: "#f0d0b0", eye: "#2a7aa8", beard: false, bg: ["#2a6a9a", "#e8e0c8"], shirt: "#38a8d8" },
      "La nipote di Dama Perla e la più veloce del Porto. Corre come se la marea la inseguisse, e la marea, a volte, lo fa.");
    K.cast("re_nereo", { beard: "folta", acc: ["cappellino"], name: "Nereo il Pescatore", tag: "", hair: "#c8c8c0", style: "bald", skin: "#c89870", eye: "#3a5a7a", bg: ["#2a5a7a", "#c8d0c0"], shirt: "#6a8a9a" },
      "Il più vecchio pescatore del Porto. Ricorda la nave che non è tornata, e la ricorda con il giorno e con l'ora, perché da allora non ha più smesso di guardare l'orizzonte.");
    K.cast("re_selvano", { beard: "incolta", acc: ["fiore"], name: "Selvano, Campione dei Cervi", tag: "", hair: "#5a3a2a", style: "long", skin: "#e0b890", eye: "#3a6a3a", bg: ["#2a5a3a", "#c8c8a0"], shirt: "#5aa862" },
      "Il campione dei Cervi. Gioca in silenzio, come un bosco. Quando parla, tutti si fermano: succede due volte l'anno.");
    K.cast("re_bruna", { acc: ["borsa"], name: "Bruna la Guardaboschi", tag: "", hair: "#7a5a2a", style: "bun", skin: "#e0b890", eye: "#3a5a3a", beard: false, bg: ["#2a4a2a", "#a8c890"], shirt: "#4a6a3a" },
      "Guardaboschi dei Cervi. Conosce ogni sentiero e ogni cestino della carta di Lord Cedro, perché ha il vizio di vuotarli di nascosto, «per l'ordine del bosco».");

    K.cos("re_c2", { kind: "shirt", label: "Mantello dei Tre Colori", val: "#3a4a8a", from: "Capitolo 2 di Cronache del Regno Ultimo" });
    K.cos("re_lupi", { kind: "shirt", label: "Cotta d'Argento dei Lupi", val: "#8b95ab", from: "Cancello del Forte dei Lupi (Casata alleata)" });
    K.cos("re_gabbiani", { kind: "shirt", label: "Giubba di Mare dei Gabbiani", val: "#2a88b8", from: "Cancello del Porto dei Gabbiani (Casata alleata)" });
    K.cos("re_cervi", { kind: "shirt", label: "Manto di Muschio dei Cervi", val: "#3a8a4a", from: "Cancello del Bosco dei Cervi (Casata alleata)" });
    K.lore("l_palla", { t: K.PAGINE.l_palla[0], d: K.PAGINE.l_palla[1] });

    const goal = (s) => ({
      0: "Parla con la Principessa Oriele, nel Cortile di Castelalto.",
      1: `Visita le tre Casate dalla Strada (il cancello a sud del Cortile): prove superate ${prove()}/3. Il tavolo della mappa ti porta nei luoghi che conosci.`,
      2: "Le tre prove sono finite. Torna a Castelalto: il ciambellano Evaristo ti cerca nel Cortile.",
      3: "Hai deciso su Mirta. Raggiungi la Principessa nella Sala del Trono.",
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    // la prova di una Casata è finita: si conta, e a tre si torna a Castelalto
    const fineProva = (h) => {
      F.set("re_t_" + h, true); K.rimappa();
      if (prove() >= 3 && S() === 1) { setStep(N, 2); questDone("re_giro"); quest("re_nota", "Il biglietto dei Corvi", "Evaristo ti cerca nel Cortile di Castelalto."); return say([["voce", "Le tre prove sono compiute. Dal Cortile arriva un corno: tre note brevi, e una lunga. Il ciambellano non suona mai il corno, a meno che non sia successo qualcosa."]], done); }
      return done();
    };

    const gate = (h) => ({ casa: h });
    const open = (h) => K.liv(h) >= 2;
    const zones = {
      re_strada: {
        region: "piazza", name: "Il Regno · La Strada dei Tre Stendardi", short: "Strada dei Tre Stendardi", sub: "Un crocevia, tre vie e un cartello pieno di opinioni", bg: "re_strada", time: "giorno", travel: [15, 3],
        w: 30, h: 22, start: [15, 2], items: [[6, 5], [24, 6], [14, 17]],
        areas: [[0, 0, 29, 21, "La Strada dei Tre Stendardi"]],
        links: { "15,0": ["re_cortile", 16, 19], "0,10": ["re_forte", 28, 9], "29,10": ["re_porto", 1, 9], "15,21": ["re_bosco", 14, 18] },
        chests: { "5,17": { coins: 25, text: "Sotto un sasso piatto, una borsa con dei soldi e un biglietto: «Per il viaggiatore che guarda sotto i sassi. Si vede che ha una certa età. — N.». Non si sa chi sia N. Si sa che aveva buon senso." } },
        flavor: { n: "Il cartello a tre frecce: «Forte dei Lupi» a ovest, «Porto dei Gabbiani» a est, «Bosco dei Cervi» a sud. Qualcuno ha aggiunto, a matita, «Casa» con una freccia verso nord. Qualcun altro l'ha cancellato, poi l'ha riscritto." },
        intro: [["voce", "La Strada dei Tre Stendardi: un crocevia di terra battuta. A ovest le mura grigie dei Lupi, a est il profumo di sale e catrame dei Gabbiani, a sud il bosco, che comincia senza chiedere il permesso."]],
        npcs: () => [{ id: "re_fiorino", at: [17, 7] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(15, 1, 15, 20, ":"); lay(1, 10, 28, 10, ":"); lay(13, 8, 17, 12, ":");
          put(15, 0, "^"); put(0, 10, "<"); put(29, 10, ">"); put(15, 21, "v");
          put(17, 4, "Z"); put(13, 4, "n"); put(5, 17, "x"); put(21, 16, "s");
          [[3, 3], [8, 2], [4, 7], [25, 3], [22, 7], [26, 14], [3, 14], [10, 18], [20, 19], [24, 18]].forEach(([x, y]) => put(x, y, "t"));
          put(14, 3, "I"); put(16, 3, "I");
        },
        banners: { "14,3": "lupi", "16,3": "gabbiani" },
      },
      re_forte: {
        region: "forte", name: "Il Regno · Il Forte dei Lupi", short: "Forte dei Lupi", sub: "Mura grigie, ordine e un campo di addestramento", bg: "re_forte", time: "giorno", travel: [28, 9],
        w: 30, h: 20, start: [28, 9], items: [[5, 13], [20, 15], [22, 13]],
        banners: { "11,6": "lupi", "17,6": "lupi" },
        areas: [[2, 7, 27, 17, "Il campo d'addestramento"], [8, 1, 21, 4, "La Cella delle Lance"], [0, 0, 29, 19, "Il Forte dei Lupi"]],
        links: { "29,9": ["re_strada", 1, 10] },
        chests: { "14,2": { coins: 60, cos: "re_lupi", text: "Il cancello dei Lupi si apre solo agli amici. Nella Cella delle Lance c'è una cotta d'argento, appesa con cura, con un biglietto di Tarsia: «Taglia unica. Anche per chi non è alto. Soprattutto.»" } },
        flavor: { F: "Una torcia di ferro: nel Forte si accende tutto nell'ordine alfabetico delle torri.", I: "", n: "Cartello del Forte: «Si prega di non ammirare. Si prega di non applaudire. Si prega di non chiedere dov'è il bagno: è dove dovrebbe essere».", y: "" },
        intro: [["voce", "Il Forte dei Lupi: mura di pietra grigia, bandiere ferme e soldati allineati come virgole. Il vento non osa fare rumore."]],
        npcs: () => [{ id: "re_brando", at: [13, 12] }, { id: "re_ulderico", at: [20, 11] }, { id: "re_tarsia", at: [8, 9] }],
        build(L, K) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 19, 29, 19, "t"); lay(0, 0, 0, 19, "t"); lay(29, 0, 29, 19, "t");
          lay(2, 7, 27, 17, ":"); lay(14, 9, 29, 9, ":"); put(29, 9, ">"); lay(8, 1, 21, 4, "+");
          lay(7, 5, 22, 5, "a"); lay(7, 1, 7, 5, "a"); lay(22, 1, 22, 5, "a");
          put(14, 5, open("lupi") ? "+" : "E"); put(14, 2, "x");
          house(2, 1, 4, 4, { door: [3, 4], roof: "#4a4f5e", wall: "#8a8478", rr: 1, enter: "La caserma: ottanta brande, tutte rifatte. Su ognuna, un cuscino. Non sono mai stati usati." });
          house(24, 1, 4, 4, { door: [26, 4], roof: "#4a4f5e", wall: "#8a8478", rr: 1, enter: "L'armeria. Ogni lancia ha un'etichetta con il nome del soldato. Ogni soldato, una pipa. Nessuno fuma." });
          put(11, 6, "I"); put(17, 6, "I"); put(9, 15, "F"); put(24, 15, "F"); put(11, 8, "n"); put(6, 16, "s");
          [[27, 6], [26, 12], [3, 16]].forEach(([x, y]) => put(x, y, "t"));
        },
        gates: { "14,5": gate("lupi") },
      },
      re_porto: {
        region: "porto", name: "Il Regno · Il Porto dei Gabbiani", short: "Porto dei Gabbiani", sub: "Moli, ledger, vele e una settantunesima nave", bg: "re_porto", time: "giorno", travel: [1, 9],
        w: 30, h: 20, start: [1, 9], items: [[10, 15], [23, 14], [11, 4]],
        banners: { "5,8": "gabbiani", "9,8": "gabbiani" },
        areas: [[1, 12, 28, 18, "Il molo grande"], [18, 1, 27, 6, "Il Magazzino dei Conti"], [0, 0, 29, 19, "Il Porto dei Gabbiani"]],
        links: { "0,9": ["re_strada", 28, 10] },
        chests: { "23,2": { coins: 60, cos: "re_gabbiani", text: "Il cancello del Magazzino dei Conti si apre agli amici dei Gabbiani. Tra i registri, una giubba di mare piegata con il nodo di Dama Perla: «Per chi sa leggere un conto, e anche per chi non vuole»." } },
        flavor: { F: "Un fanale da molo. Perla dice che il Porto non dorme mai: è una questione di assicurazione.", n: "Il tabellone dei prezzi: «Pesce: variabile. Sale: variabile. Parere dei Gabbiani: a pagamento».", y: "" },
        intro: [["voce", "Il Porto dei Gabbiani: vele bianche, moli lucidi, casse impilate in ordine di valore e non di peso. Il rumore dell'acqua copre quello dei conti, che qui sono sempre più forti."]],
        npcs: () => [{ id: "re_perla", at: [14, 7] }, { id: "re_scilla", at: [20, 13] }, { id: "re_nereo", at: [6, 16] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 19, 29, 19, "t"); lay(0, 0, 0, 19, "t"); lay(29, 0, 29, 19, "t");
          lay(1, 12, 28, 18, "="); lay(1, 9, 28, 9, ":"); put(0, 9, "<"); lay(12, 5, 16, 11, ":"); lay(18, 1, 27, 6, "+");
          lay(17, 1, 17, 7, "a"); lay(17, 7, 28, 7, "a"); lay(28, 1, 28, 6, "a"); put(23, 7, open("gabbiani") ? "+" : "E"); put(23, 2, "x");
          house(2, 1, 6, 5, { door: [5, 5], roof: "#2a6a9a", wall: "#e8e0c8", rr: 2, lit: 1, enter: "La Locanda del Sale: una sola stanza e quaranta pescatori. Sul bancone, un cartello: «Il pesce di ieri è quello di domani»." });
          put(5, 8, "I"); put(9, 8, "I"); put(20, 15, "F"); put(4, 15, "F"); put(11, 11, "n"); put(22, 16, "s");
          [[25, 4], [3, 17], [27, 17]].forEach(([x, y]) => put(x, y, "t"));
        },
        gates: { "23,7": gate("gabbiani") },
      },
      re_bosco: {
        region: "bosco", name: "Il Regno · Il Bosco dei Cervi", short: "Bosco dei Cervi", sub: "Cortecce, biblioteche e un sentiero con le regole", bg: "re_bosco", time: "giorno", travel: [14, 17],
        w: 30, h: 20, start: [14, 17], items: [[4, 10], [24, 12], [4, 4]],
        banners: { "13,15": "cervi", "17,15": "cervi" },
        areas: [[8, 1, 21, 5, "La Biblioteca nel Bosco"], [0, 0, 29, 19, "Il Bosco dei Cervi"]],
        links: { "14,19": ["re_strada", 15, 20] },
        chests: { "14,2": { coins: 60, cos: "re_cervi", text: "Il cancello di rami si apre agli amici dei Cervi. Nel Silenzio dei Libri, un manto di muschio e un biglietto: «Non è un costume. È un'abitudine»." }, "26,6": { coins: 30, lore: "l_palla", text: "In una cassa di cuoio, tra due scatole di pergamene, un quaderno di spartiti rovinato: la Ballata della Palla, quella vecchia, senza gli ultimi versi. Qualcuno ha annotato a margine, a matita: «Il cuoco non ha nascosto la corona. L'ha cucita. È diverso»." } },
        flavor: { F: "Una lanterna di corteccia: la luce dei Cervi è più verde e più piano.", n: "Il cartello del sentiero: «Articolo 2: chi cammina, ascolta. Articolo 3: chi ascolta, risponde. Articolo 4: chi risponde, paga». Non si capisce a chi.", y: "" },
        intro: [["voce", "Il Bosco dei Cervi: alberi enormi, sentieri con numerazione e una biblioteca costruita tra i rami. Il rumore dei passi viene ripreso dalla terra morbida e conservato per dopo."]],
        npcs: () => [{ id: "re_cedro", at: [16, 8] }, { id: "re_selvano", at: [20, 12] }, { id: "re_bruna", at: [7, 14] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 19, 29, 19, "t"); lay(0, 0, 0, 19, "t"); lay(29, 0, 29, 19, "t");
          lay(14, 6, 14, 18, ":"); lay(4, 9, 25, 9, ":"); lay(8, 1, 21, 5, "+");
          lay(7, 1, 7, 5, "a"); lay(22, 1, 22, 5, "a"); lay(7, 6, 21, 6, "a"); put(14, 6, open("cervi") ? "+" : "E"); put(14, 2, "x"); put(26, 6, "x"); put(14, 19, "v");
          put(13, 15, "I"); put(17, 15, "I"); put(11, 11, "n"); put(5, 15, "F"); put(24, 15, "F"); put(21, 16, "s");
          house(23, 1, 5, 4, { door: [25, 4], roof: "#2a5a3a", wall: "#8a7a5a", rr: 1, enter: "La Casa dei Cervi del Sud: libri, un fuoco, una teiera. Su una sedia, un gatto che dorme come un articolo di legge." });
          [[2, 3], [3, 7], [26, 8], [27, 14], [3, 17], [9, 17], [20, 17], [6, 12], [22, 11]].forEach(([x, y]) => put(x, y, "t"));
        },
        gates: { "14,6": gate("cervi") },
      },
    };
    // un po' di ordine nel Cortile: il cancello a sud conduce alla Strada (lo apre il capitolo 1 concluso)
    const patch = {
      re_cortile: {
        npcs: (s, list) => { const l = list.slice(); if (s === 0 && !l.some((n) => n.id === "re_oriele")) l.push({ id: "re_oriele", at: [16, 17] }); return l; },
      },
      re_trono: { npcs: (s, list) => (s >= 3 ? list : list.filter((n) => n.id !== "re_oriele")) },
    };

    // ------------------------------------------------------------ dialoghi
    const talk = {
      re_oriele() {
        const s = S();
        if (s === 0) return say([
          ["re_oriele", "(Ti viene incontro, con il mantello rosso e il passo di chi ha deciso di non correre.) Campione. Hai superato le Mura: adesso devi superare la gente. È più difficile."],
          ["re_oriele", "Per il Duello ti servono i poteri delle Casate: l'Ariete dei Lupi, la Marea dei Gabbiani, l'Occhio dei Cervi. Le Casate li prestano a chi hanno in simpatia. In pratica: devi andare a farti piacere."],
          ["re_oriele", "Il cancello a sud del Cortile porta alla Strada dei Tre Stendardi. Da lì, tre vie. Il tavolo con la mappa, al crocevia, ti riporterà dove sei già stato. Non prometto che sarà divertente. Prometto che sarà utile."],
          ["re_oriele", "[pensa] Una cosa. Se un giorno ti sembra di non sapere più chi ti sta dicendo la verità, vieni da me. Non sempre avrò ragione, ma ti dirò quello che penso. A corte è il modo più veloce per sembrare strani."],
        ], () => { setStep(N, 1); quest("re_giro", "Il Giro delle Tre Casate", "Supera la prova dei Lupi, dei Gabbiani e dei Cervi (Strada dei Tre Stendardi, a sud del Cortile)."); K.rimappa(); done(); });
        if (s === 1) return say([["re_oriele", `Hai superato ${prove()} prove su tre. (Sorride piano.) Le Casate parlano di te: poco, ma senza alzare la voce. È già qualcosa.`]], done);
        if (s === 2) return say([["re_oriele", "[pensa] Il ciambellano ti cerca. Ha l'aria di uno che ha letto qualcosa che avrebbe preferito non leggere."]], done);
        if (s === 3) {
          const ac = F.get("re_mirta", "");
          return say([
            ["re_oriele", ac === "accusata" ? "[triste] Hai fatto quello che sembrava giusto. Mirta ha lasciato il castello stamattina, senza fare rumore: per una che non ascolta mai niente, è la prima volta che non ha detto niente. (Pausa.) Non ti accuso. Ma ci penserò a lungo." : ac === "difesa" ? "[felice] Hai difeso una cameriera davanti a tre Casate. (Sorride, per un attimo.) Non è una mossa da diplomatico. Credo che mi piaccia." : "[pensa] Hai chiesto tempo. A corte è la mossa più difficile e meno apprezzata. Per questo mi piace."],
            ["re_oriele", "Il Duello è a due notti da qui. Le Casate si riuniranno sulla Piazza d'Armi, con le loro torce e i loro registri. Qualcuno ha dato ai Corvi il nostro piano: lo scopriremo, prima o poi. Per ora, riposa. Domani avremo bisogno di tutta la tua testa."],
          ], () => { K.reward("c2", { coins: 100, cos: ["re_c2"] }); questDone("re_nota"); finishChapter(2, ac === "accusata" ? "mirta_via" : ac === "difesa" ? "mirta_difesa" : "indaga"); setStep(N, 5);
            K.scene([["voce", `<b>CAPITOLO 2 CONCLUSO.</b> Le tre Casate ti conoscono, e ognuna ha una sua opinione. Il Duello è vicino, e qualcuno, a Castelalto, ha un segreto.<br><span style="color:var(--dim)">Ricompensa: monete e il Mantello dei Tre Colori (Guardaroba).</span>`]], () => K.openMain(), "re_trono"); });
        }
        return say([["re_oriele", "Il Duello è vicino. Hai le Casate dalla tua parte, in qualche misura. Quello che manca lo troverai tra le torce, e dentro di te. Cosa che, a corte, è ancora meno comune delle torce."]], done);
      },
      re_evaristo() {
        const s = S();
        if (s < 2) return K.PASS;
        if (s >= 3) return say([["re_evaristo", "Con tutto il rispetto, Campione, abbiamo fatto quello che potevamo. Se c'è una cosa che ho imparato in trentasei anni è che «quello che potevamo» è la formula più onesta della cerimonia."]], done);
        return say([
          ["re_evaristo", "[arrabbiato] Campione. Con tutto il rispetto: abbiamo un problema. (Ti porge un biglietto spiegazzato, con una macchia d'unto.)"],
          ["voce", "Lo ha trovato una sentinella, sul sentiero dei Corvi, sotto un sasso: «Il Campione userà l'Occhio al secondo tempo, da sinistra. Lupi e Gabbiani si fidano, i Cervi no». La calligrafia è bella e controllata. Sul retro, una briciola di fico fuori stagione."],
          ["re_evaristo", "[pensa] Solo una persona, a Castelalto, porta in giro fichi fuori stagione, e ascolta tutto senza che nessuno la veda. Mi dispiace dirlo. Mi dispiace sempre quando ho ragione."],
          ["voce", "Mirta è in fondo al cortile, con un vassoio. Ha sentito. Per la prima volta da quando la conosci, non sta fingendo di non ascoltare."],
        ], () => ask("re_evaristo", "Il ciambellano aspetta una tua parola. Che cosa fai?", [
          { label: "Accusare Mirta", sub: "Favore dei Lupi, ma la Principessa ne soffrirà", fn: () => { F.set("re_mirta", "accusata"); K.dai("lupi", 1); setStep(N, 3); say([["re_evaristo", "[sospira] Provvedo io. Alla sera sarà fuori dalle mura. Per il Regno, e per la burocrazia."], ["re_mirta", "(Posa il vassoio, piano.) Non sono stata io, signore. Ma capisco: è più comodo che sia stata io. (Se ne va senza guardare nessuno. Un fico rotola sul selciato.)"]], done); } },
          { label: "Difendere Mirta", sub: "Fiducia della Principessa, favore dei Cervi", fn: () => { F.set("re_mirta", "difesa"); bond("fiducia", 1); K.dai("cervi", 1); F.set("re_ind_inchiostro", true); setStep(N, 3); say([["re_mirta", "(Con una voce che non le hai mai sentito.) Grazie, signore. Io il biglietto non l'ho scritto: ho visto chi aveva le dita sporche d'inchiostro nero, quello dei giuristi. Non l'ho detto prima perché nessuno chiede mai ai vassoi."], ["re_evaristo", "[sorpreso] Inchiostro dei giuristi. (Annota qualcosa sul taccuino, con aria preoccupata.) Con tutto il rispetto, Campione: spero di non dover chiedere a nessuno di Valverde."]], done); } },
          { label: "Chiedere tempo per indagare", sub: "Fiducia della Principessa; Mirta resta a corte e parla", fn: () => { F.set("re_mirta", "indaga"); bond("fiducia", 1); F.set("re_ind_inchiostro", true); setStep(N, 3); say([["re_evaristo", "[sospira] Tempo. È una parola che a corte si usa quando non si ha il coraggio di dire un'altra. Va bene: due notti. Non una di più."], ["re_mirta", "(A bassa voce, mentre ti sfiora con il vassoio.) Cerchi chi ha le dita nere d'inchiostro dei giuristi, signore. Quello non si lava, e non si indossa a caso."]], done); } },
        ], "re_cortile"));
      },
      re_mirta() {
        const s = S();
        if (s < 2) return K.PASS;
        if (s === 2) return say([["re_mirta", "(Non alza gli occhi.) Un fico, signore? Sono finti. Ma buoni."]], done);
        const a = F.get("re_mirta", "");
        say([["re_mirta", a === "difesa" || a === "indaga" ? "Se serve un orecchio, signore, io ne ho due. Si dice che siano troppi. Il bosco ha un cestino. Il cestino ha una guardaboschi. La guardaboschi è meglio del ciambellano." : "(È già altrove.)"]], done);
      },
      re_brando() {
        if (K.inZone("re_forte")) return forteBrando();
        return K.PASS;
      },
      re_ulderico() { return forteUlderico(); },
      re_tarsia() {
        say([["re_tarsia", K.liv("lupi") >= 2 ? "Siete amici dei Lupi, Campione. Per voi il cancello della Cella è aperto: prendete la cotta, e lasciate le lance dove stanno. Le ho contate." : "(Conta qualcosa a voce bassa.) Ottantaquattro lance, ottantaquattro soldati, nessun ospite. Se volete l'amicizia dei Lupi, parlate con il Generale: io mi limito ai conti."]], done);
      },
      re_perla() { return K.inZone("re_porto") ? portoPerla() : K.PASS; },
      re_scilla() {
        const a = K.liv("gabbiani");
        say([["re_scilla", a >= 2 ? "[felice] Nonna dice che siete un buon investimento. Per noi è il complimento più alto: significa che non vi vendiamo." : "Il Campione senza Stendardo? Corro più di voi. Non è una sfida: è una constatazione. (Sorride.) La sfida arriva dopo."]], done);
      },
      re_nereo() {
        const menu = () => ask("re_nereo", "(Guarda l'orizzonte senza voltarsi.) Sei venuto a chiedere della settantunesima nave. Lo vedo dalla postura.", [
          { label: "Che cosa ricordi?", sub: "Una storia di vent'anni fa", fn: () => { F.set("re_nave", true); say([["re_nereo", "Partì all'alba, con lo sposo di Dama Perla al timone e una cassa sigillata a bordo. Non era un carico: era una cosa del Palazzo, dicevano. Tornò soltanto il suo nome, scritto sul registro del porto da una mano che non era di nessun marinaio."], ["re_nereo", "[triste] Chi scrisse il nome, aveva le dita sporche d'inchiostro nero. L'ho vista io, quella mano: ha lasciato un'impronta sul tavolo. Non lo dico a Perla: lei sa già."]], menu); } },
          { label: "Grazie, Nereo", fn: done },
        ], "re_porto");
        return menu();
      },
      re_cedro() { return K.inZone("re_bosco") ? boscoCedro() : K.PASS; },
      re_selvano() { say([["re_selvano", K.liv("cervi") >= 2 ? "(Tace a lungo, poi.) Amico." : "(Non parla. Ti guarda come un albero guarda una tempesta, senza fretta.)"]], done); },
      re_bruna() {
        const menu = () => ask("re_bruna", "[pensa] Sono la guardaboschi, signore. Raccolgo foglie, rami e, per l'ordine del bosco, la carta dai cestini. Vi interessa la carta?", [
          { label: "Che cosa hai trovato nei cestini?", sub: "Un indizio", fn: () => { F.set("re_ind_lettera", true); say([["re_bruna", "Quattro fogli accartocciati, tutti con la stessa calligrafia: «Se lo sapessero i Lupi, tirerebbero giù le mura. Se lo sapessero i Gabbiani, le comprerebbero. Per questo lo dico solo a te». Nessuna firma. L'inchiostro è nero, quello da giurista: lo riconosco dall'odore."], ["re_bruna", "(Ti dà un foglio piegato in quattro.) Non so a chi fosse scritto, ma la parola «Tullio» c'è tre volte. Non me lo chiedete: io raccolgo la carta, non il motivo."]], menu); } },
          { label: "Torno al sentiero", fn: done },
        ], "re_bosco");
        return menu();
      },
    };

    // ------------------------------------------------------------ le tre prove
    function forteBrando() {
      const s = S();
      if (F.is("re_t_lupi")) return say([["re_brando", K.liv("lupi") >= 2 ? "[felice] Un alleato. (Si schiarisce la voce.) Non sorrido mai, quindi immagina che l'abbia fatto, e che si sia sentito." : "Hai superato la mia prova. Non significa che mi fidi. Significa che per ora non ho motivo di non farlo."]], done);
      const menu = () => ask("re_brando", "[arrabbiato] Campione. Le Casate non regalano niente. Ulderico, il mio campione, ti aspetta sul campo d'addestramento: se lo batti, ti ascolterò. Se parli prima, ti ascolterò lo stesso, ma meno.", [
        { label: "Una casa per i tuoi soldati", sub: F.is("re_info_lupi") ? "Lo sai da Oriele: Brando vuole case, non la Corona" : "Un'idea che non conosci ancora", disabled: !F.is("re_info_lupi"), cls: "hot", fn: () => { F.set("re_giuro", true); K.dai("lupi", 3); say([["voce", "Per un lungo momento il Generale non dice niente. Poi, molto piano:"], ["re_brando", "[triste] Chi te l'ha detto? (Pausa.) Non importa. Sedici mila lance e nessuna terra: tre anni che ci penso, e nessuno l'ha mai detto a voce alta. Se vinci, ti seguirò. Non con la Corona: con il rispetto. È una cosa diversa, e più pesante."]], () => { K.rimappa(); menu(); }); } },
        { label: "Sfido Ulderico sul campo", sub: "Una partita: Duello di Corona o partita normale", fn: () => say([["re_brando", "Sul campo, a destra. Non farti vedere stanco: ha un'opinione sulla stanchezza."]], done) },
        { label: "Non ora", fn: done },
      ], "re_forte");
      return menu();
    }
    function forteUlderico() {
      const win = (r) => { if (r && r.win) { K.dai("lupi", 2); F.set("re_vint_ulderico", true); K.rimappa(); say([["re_ulderico", "[felice] Hai gambe. Sei lento a leggere, ma hai gambe. Vai dal Generale: non ha sorriso, quindi la mia parola vale doppio."]], () => fineProva("lupi")); } else say([["re_ulderico", "Hai perso. È normale: sono io. Riprova, quando vuoi: io sono qui e non ho altro da fare."]], done); };
      if (F.is("re_t_lupi")) return say([["re_ulderico", "(Si allena in silenzio, poi si ferma.) Sei il Campione senza Stendardo. Io sono il Campione dei Lupi. Per fortuna non giochiamo mai contro."]], done);
      if (F.is("re_giuro") && !F.is("re_vint_ulderico")) { /* Brando ha già giurato: la prova resta, ma i Lupi sono contenti */ }
      return ask("re_ulderico", "[felice] Sfida? Bene. Posso fare il Duello di Corona, come vuole il Regno, o una partita normale, come vogliono le gambe. Scegli tu: io corro uguale.", [
        { label: "Duello di Corona", sub: "Il motore del Regno · 2 tempi", cls: "hot", fn: () => K.coronaMatch({ title: "Prova dei Lupi · Campo d'addestramento", us: "Il Campione senza Stendardo", intro: "Il campo del Forte: nessuno tifa, tutti guardano. Due tempi, una carica a testa.", opp: { name: "Le Lance dei Lupi", color: "#8b95ab", style: "pressing" }, tempi: 2, council: [{ q: "Intervallo. Dal bordo del campo Tarsia ti porge una borraccia con l'etichetta «per le gambe» e un biglietto: «per la testa».", opts: [{ label: "La borraccia", sub: "Favore ai Lupi", fav: { lupi: 1 }, say: "Tarsia annuisce: per lei è un'ovazione." }, { label: "Il biglietto", sub: "Favore ai Cervi", fav: { cervi: 1 }, say: "Sul biglietto c'è una sola parola: «Respira». Fa effetto." }, { label: "Entrambi, e un grazie", sub: "Un poco a tutti", fav: { lupi: 1, cervi: 1 }, say: "Il Forte, per un attimo, fa silenzio con calore." }] }] }, win) },
        { label: "Una partita normale", sub: "Calcio d'azione, Gabbia o HD: scegli all'avvio", fn: () => K.playMatch({ alt: "az,cage,hd", force: false, id: "re_forte", chap: "Prova dei Lupi", intro: "Ulderico e i suoi soldati ti sfidano sul campo del Forte. Si gioca anche con le regole di tutti i giorni.", oppTeam: "Le Lance dei Lupi", oppColor: "#8b95ab", oppNames: ["Ulderico", "Tarsia", "Lanciere", "Sentinella"], done: win }) },
        { label: "Non ora", fn: done },
      ], "re_forte");
    }
    function portoPerla() {
      if (F.is("re_t_gabbiani")) return say([["re_perla", K.liv("gabbiani") >= 2 ? "Un amico. Mi costa dirlo: un buon affare, e un buon amico. Di solito non coincidono." : "Hai superato la prova dei conti. Il resto, a credito."]], done);
      const fine = (txt, dai, extra) => () => { K.dai("gabbiani", dai); if (extra) extra(); say([["re_perla", txt]], () => fineProva("gabbiani")); };
      return ask("re_perla", "(Gira il registro verso di te.) Tre libri, tre sommatorie, una differenza di quattromila monete. Dimmi quale dei tre ha sbagliato. Se hai buon occhio, potrei anche fidarmi.", [
        { label: "Il terzo: ha arrotondato a vostro favore", sub: "Dire la verità sui conti", cls: "hot", fn: fine("[sorpreso] (Controlla due volte.) Il terzo. L'ho firmato io, ieri, a letto. Molto bene. Dire la verità sui conti, qui, è un atto di coraggio quasi quanto navigare di notte: ti farò un prezzo d'amico.", 2) },
        { label: "Il primo, signora: è il più bello", sub: "Un errore di giudizio, e di gusto", fn: fine("(Sorride, e non è bello.) Il primo è il più bello, sì. Anche il più falso. Per oggi ti concedo l'errore; per domani, la lezione.", 1) },
        { label: "Non lo so, ma parlami della settantunesima nave", sub: F.is("re_info_gabbiani") ? "Lo sai da Fiorino: è la tua carta migliore" : "Qualcuno al Porto ne sa di più", disabled: !F.is("re_info_gabbiani"), fn: fine("(Posa la penna.) Chi te l'ha detto? Il bardo, certo. (Pausa.) Una cassa del Palazzo, uno sposo, un nome scritto da un'altra mano. Non è un conto che tornerà. Per questo non lo conto più. Tu però l'hai nominata, e hai avuto il rispetto di non chiedermi il prezzo. Sei dei nostri.", 3, () => F.set("re_perla_nave", true)) },
        { label: "Non ora", fn: done },
      ], "re_porto");
    }
    function boscoCedro() {
      if (F.is("re_t_cervi")) return say([["re_cedro", K.liv("cervi") >= 2 ? "Secondo l'articolo undici, un alleato ha diritto a un tè. Mi permetto di anticipare l'articolo: il tè è in arrivo." : "Hai superato la prova dei Cervi. Per ora, con riserva."]], done);
      const fine = (txt, dai, extra) => () => { K.dai("cervi", dai); if (extra) extra(); say([["re_cedro", txt]], () => fineProva("cervi")); };
      return ask("re_cedro", "(Chiude il libro sul dito.) Una domanda sul Patto di Cuoio. Primo articolo: «Nessuno possiede la Palla». Ultimo articolo, il tredicesimo: che cosa dice?", [
        { label: "«Chi vince, regna»", sub: "La risposta che tutti danno", fn: fine("Sbagliato, ma educato. L'articolo tredici non dice chi regna: dice come si gioca. Un errore comune, a corte.", 1) },
        { label: "«Chi gioca, risponde a tutti»", sub: "Una risposta da giurista", cls: "hot", fn: fine("[sorpreso] Secondo l'articolo tredici, esatto, e salvo errori. Chi gioca per la Corona risponde alle tre Casate insieme. Mi complimento.", 2) },
        { label: "Il Patto non dice che cosa succede se i duellanti sono tutti d'accordo", sub: F.is("re_info_cervi") ? "Il buco di legge che ti ha raccontato Evaristo" : "Una cosa che non sai ancora", disabled: !F.is("re_info_cervi"), fn: fine("(Posa il libro. Per la prima volta, il suo viso cambia.) Chi ve l'ha detto? Il ciambellano, certo. (Si siede.) È vero. Da vent'anni lo penso. Un Duello senza vincitore, un Regno senza trono: nessuno ha mai avuto il coraggio di scriverlo. Tu l'hai detto a voce alta, in una biblioteca. È un atto di fede, e un reato di lesa maestà. Sei dei nostri.", 3, () => F.set("re_buco", true)) },
        { label: "Non ora", fn: done },
      ], "re_bosco");
    }

    return {
      n: N, title: "Il Giro delle Tre Casate", sub: "Il Forte, il Porto, il Bosco e un biglietto di troppo", goal: () => goal(S()), start: "re_cortile", introBg: "re_titolo", zones, patch, talk,
      intro: () => { setStep(N, 0); return [["voce", "<b>CRONACHE DEL REGNO ULTIMO</b>, capitolo 2. Dopo le Mura, il Regno ha cominciato a chiamarti per nome. Tutti i nomi che ti danno, però, finiscono con «senza Stendardo»."]]; },
    };
  }
  boot();
})();
