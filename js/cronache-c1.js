// js/cronache-c1.js - LE CRONACHE DEL PALLONE DI CRISTALLO · Capitolo 1 «Il Cristallo dell'Erba»
// Prato Lungo, il villaggio dove l'erba del campo è diventata grigia. Lyra la cavaliera si unisce al gruppo (e da lì
// cammina dietro al Campione). La mappa del mondo, a piccola scala. La Torre di Fosco, il mago miope che ha perso gli
// occhiali nel Bosco di Rovo. Nel cuore del bosco, il campo del Cristallo dell'Erba e i Guardiani di Rovo: partita ATB.
(function () {
  "use strict";
  function boot() { const D = window.__cronache; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("cc_ermete", { acc: ["occhiali"], name: "Saggio Ermete", tag: "gray", hair: "#e8e8e8", style: "bald", skin: "#e8c4a0", eye: "#3a3a5a", bg: ["#0e1446", "#9ad8ff"], shirt: "#5a4a8a", beard: true },
      "Il più vecchio di Prato Lungo. Ha visto giocare la finale delle Quattro Stagioni, quando i cristalli brillavano tutti. Racconta che allora l'erba del campo cantava a ogni gol. Nessuno gli crede. Lui continua a raccontarlo.");
    K.cast("cc_lyra", { acc: ["fascia"], name: "Lyra del Prato, cavaliera", tag: "", hair: "#c8a040", style: "ponytail", skin: "#f0d0b0", eye: "#2a5a3a", bg: ["#0e1446", "#c8a040"], shirt: "#8a9aaa" },
      "Cavaliera del Castello di Verdemare, mandata a scoprire perché i cristalli si spengono. Para con lo scudo, difende con la spada piatta (non la usa mai di taglio). Ha giurato di non giocare mai più a calcio. Non dice perché.");
    K.cast("cc_fosco", { acc: ["occhiali", "stella"], name: "Fosco, mago miope", tag: "", hair: "#3a2a5a", style: "messy", skin: "#e8c4a0", eye: "#4a3a6a", bg: ["#2a1a4a", "#c88aff"], shirt: "#4a3a8a" },
      "Mago della Torre sul Colle. Conosce trecento incantesimi e non ne ricorda nessuno senza gli occhiali. Senza occhiali ha lanciato «Vento» su una mucca: la mucca adesso vive in cima a un albero, ed è felice.");
    K.cast("cc_contadina", { acc: ["paglia"], name: "Gemma, contadina", tag: "", hair: "#8a4a2a", style: "long", skin: "#e8b88a", eye: "#3a3a2a", bg: ["#0e1446", "#7ab860"], shirt: "#c8584a" },
      "Coltiva i campi intorno a Prato Lungo. Da quando le stagioni si sono fermate, il grano non cresce e non secca: resta lì, a metà, come una domanda.");
    K.cast("cc_rovo", { shape: "rovo", name: "Capo dei Guardiani di Rovo", tag: "", hair: "#2a4a1a", style: "spiky", skin: "#8a6a4a", eye: "#e8c84a", bg: ["#1a2a1a", "#5a8a3a"], shirt: "#5a3a2a" },
      "Il più vecchio dei Guardiani di Rovo, gli spiriti spinosi che proteggono il Cristallo dell'Erba. Da quando il cristallo si spegne non riconoscono più nessuno: difendono il campo da tutti, anche da chi vuole aiutarli.");
    K.cos("cc_c1", { kind: "shirt", label: "Mantello azzurro del viandante", val: "#2a4ab8", from: "Capitolo 1 delle Cronache del Pallone di Cristallo" });
    K.cos("cc_schegge1", { kind: "hairc", label: "Capelli Cristallo d'Erba", val: "#7af0c8", from: "Trova tutte le schegge della mappa del mondo" });
    K.lore("l_cristalli", { t: "I quattro cristalli", d: "Erba, Mare, Stelle, Fuoco. Ognuno riposa sotto un campo da calcio di un regno diverso, e ogni partita giocata bene lo ricarica un po'. Da quando nessuno gioca più per divertirsi, i cristalli si spengono. Con loro, le stagioni." });
    K.lore("l_lyra", { t: "Il giuramento di Lyra", d: "Da ragazza, Lyra sbagliò un rigore nella finale del Castello. Da quel giorno ha giurato di non giocare più: difende, para, protegge, ma non tira. Dice che una cavaliera non può permettersi di sbagliare due volte." });
    K.lore("l_erba", { t: "Il Cristallo dell'Erba", d: "Riaccendendolo, a Prato Lungo l'erba del campo torna verde, e per un istante, a ogni gol, canta. Ermete aveva ragione." });

    const goal = (s) => ({
      0: "Prato Lungo. L'erba del campo è grigia. Il saggio Ermete ti aspetta davanti alla sua casa.",
      1: "Una cavaliera aspetta al cancello del villaggio, a nord.",
      2: "Esci sulla mappa del mondo (a nord) e raggiungi la Torre di Fosco, sul colle a est.",
      3: "Fosco ha perso gli occhiali nel Bosco di Rovo (il bosco scuro a sud-est della mappa). Trovali.",
      4: "Hai gli occhiali di Fosco: riportaglieli alla Torre.",
      5: "Il gruppo è pronto. Nel cuore del Bosco di Rovo c'è il campo del Cristallo dell'Erba.",
      6: "Il cristallo brilla. Torna da Ermete, a Prato Lungo.",
    }[s] || "Capitolo concluso. Dal menu prosegui con il Capitolo 2.");

    const lit = () => F.is("cristallo_cc_bosco");
    const zones = {
      cc_prato: {
        region: "borgo", name: "Le Cronache · Prato Lungo", short: "Prato Lungo", sub: "Il villaggio del campo grigio", bg: "cc_prato", time: "giorno", travel: [17, 12],
        w: 34, h: 22, start: [17, 12], items: [[2, 20], [31, 20]],
        areas: [[11, 12, 23, 19, "Il campo del villaggio"], [0, 0, 33, 21, "Prato Lungo"]], act: { "^": "Esci sulla mappa del mondo" },
        flavor: { X: "Un forziere antico, chiuso con un lucchetto a forma di pallone. Dentro, attraverso la serratura, si vede brillare qualcosa." },
        intro: [["voce", "Prato Lungo: case col tetto di paglia, un mulino fermo, e in mezzo al villaggio un campo da calcio con l'erba grigia, come cenere. Nessuno ci gioca da mesi."], ["voce", "Le stagioni si sono fermate. Non è inverno, non è estate: è un pomeriggio d'autunno lungo un anno intero."]],
        npcs: (s) => [
          { id: "cc_ermete", at: [8, 9] },
          ...(s <= 1 ? [{ id: "cc_lyra", at: [17, 2] }] : []),
          { id: "cc_contadina", at: [4, 15], route: [[4, 15], [4, 19], [9, 19], [9, 15]], speed: 0.35, pause: 60 },
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(0, 21, 33, 21, "t"); lay(0, 0, 0, 21, "t"); lay(33, 0, 33, 21, "t"); put(17, 0, "^"); put(18, 0, "^");
          lay(17, 1, 18, 11, ":"); lay(11, 12, 23, 19, "-");
          house(4, 3, 7, 5, { door: [8, 7], roof: "#c8a050", wall: "#e8d8b0", rr: 3, enter: "La casa di Ermete. Libri ovunque, una mappa del mondo appesa al muro con quattro cristalli disegnati a matita. Tre sono cancellati, a gomma, con cura." });
          house(24, 3, 7, 5, { door: [27, 7], roof: "#a85a3a", wall: "#e8d8b0", rr: 3, lit: true, enter: { room: "locanda", id: "cc_locanda", name: "La locanda del Prato", who: [], flavor: { T: "Un tavolo con un pallone vecchissimo sopra, cucito a mano. Sotto, una targa: «Finale delle Quattro Stagioni»." } } });
          lay(8, 8, 8, 9, ":"); lay(27, 8, 27, 10, ":"); lay(9, 10, 26, 10, ":");
          [[2, 3], [31, 3], [2, 10], [31, 10], [29, 16]].forEach(([x, y]) => put(x, y, "t")); put(30, 13, "X"); put(17, 20, "s");
        },
        decor(g, cx, cy, d) { // il campo del villaggio: grigio, finché il Cristallo dell'Erba è spento
          if (!lit()) { g.fillStyle = "rgba(150,150,150,.6)"; g.fillRect(d.X(11), d.Y(12), 13 * 16, 8 * 16); }
          else for (let i = 0; i < 10; i++) { const x = d.X(11) + ((i * 37 + d.fr) % (13 * 16)), y = d.Y(12) + (i * 29) % (8 * 16); g.fillStyle = ["#ff9ec0", "#ffd23f", "#fff"][i % 3]; g.fillRect(x, y, 2, 2); }
          g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 1; g.strokeRect(d.X(11) + 2, d.Y(12) + 2, 13 * 16 - 4, 8 * 16 - 4); g.beginPath(); g.moveTo(d.X(17) + 8, d.Y(12) + 2); g.lineTo(d.X(17) + 8, d.Y(20) - 2); g.stroke();
        },
      },
      cc_mondo: {
        region: "mondo", name: "Le Cronache · La mappa del mondo", short: "La mappa del mondo", sub: "Il Regno di Verdemare e oltre", bg: "cc_mondo", time: "giorno", travel: [10, 21],
        w: 44, h: 30, start: [10, 21], itemCos: "cc_schegge1", items: [[5, 3], [40, 3], [21, 14], [36, 25], [14, 27]],
        areas: [[0, 0, 43, 29, "La mappa del mondo"]], act: {},
        flavor: { R: ["Le Montagne Grigie. Dicono che dall'altra parte ci sia il mare, e un porto, e una nave che aspetta qualcuno.", "Una vetta più alta delle altre, con la neve in cima. La neve non si scioglie e non cade: è ferma, come tutto."] },
        intro: [["voce", "La mappa del mondo: tutto è piccolo, come visto da un'aquila. I boschi sono ciuffi, le montagne triangoli, i paesi due casette."], ["voce", "A est, su un colle, una torre con una luce viola. A sud-est, un bosco così scuro che sembra un buco nella mappa."]],
        npcs: () => [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 43, 0, "~"); lay(0, 29, 43, 29, "~"); lay(0, 0, 0, 29, "~"); lay(43, 0, 43, 29, "~"); lay(1, 1, 3, 12, "~"); lay(1, 1, 12, 1, "~");
          [[14, 3, 22, 4], [24, 12, 28, 18], [6, 13, 9, 15], [34, 18, 41, 19]].forEach(([a, b, c, d]) => { for (let x = a; x <= c; x++) for (let y = b; y <= d; y++) if ((x + y) % 3) put(x, y, "R"); });
          [[30, 21, 33, 26], [5, 24, 9, 27], [16, 7, 19, 10]].forEach(([a, b, c, d]) => { for (let x = a; x <= c; x++) for (let y = b; y <= d; y++) if ((x * 3 + y) % 4) put(x, y, "t"); });
          lay(10, 15, 10, 21, ":"); lay(10, 15, 30, 15, ":"); lay(30, 9, 30, 15, ":"); lay(30, 15, 36, 15, ":"); lay(36, 15, 36, 22, ":");
          put(10, 22, "P"); put(30, 8, "Q"); put(36, 23, "Z"); put(5, 10, "K");
        },
      },
      cc_torre: {
        interior: true, region: "torre", name: "Le Cronache · La Torre di Fosco", short: "La Torre di Fosco", sub: "Libri, stelle, e un mago che non ci vede", bg: "cc_torre", w: 20, h: 13, start: [10, 10], outside: ["cc_mondo", 30, 9],
        act: { L: "Sfoglia i libri", T: "Guarda il tavolo", W: "Guarda dal cannocchiale", v: "Esci" },
        flavor: { L: ["«Trecento incantesimi per principianti». La pagina di «Vento» ha un'orecchia, e una macchia a forma di mucca.", "«Del calcio e delle stagioni», volume terzo. Una frase sottolineata: «I cristalli si ricaricano con le partite giocate per il piacere di giocarle»."], T: "Il tavolo del mago: pozioni, un pallone di cristallo (finto, è di vetro), e un biglietto: «OCCHIALI?????»", W: "Dal cannocchiale si vede tutto il mondo. Fosco dice che ci vede benissimo, attraverso il cannocchiale. È solo il resto che è sfocato." },
        intro: [["voce", "La Torre di Fosco: libri fino al soffitto, una scala a chiocciola, e un mago con la barba di tre giorni che cammina a tentoni toccando i muri."]],
        npcs: (s) => (s <= 4 ? [{ id: "cc_fosco", at: [10, 5] }] : []),
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(2, 1, 8, 1, "L"); lay(11, 1, 17, 1, "L"); put(4, 7, "T"); put(5, 7, "T"); put(16, 4, "W"); put(2, 10, "s"); },
      },
      cc_bosco: {
        region: "bosco", name: "Le Cronache · Il Bosco di Rovo", short: "Il Bosco di Rovo", sub: "Dove riposa il Cristallo dell'Erba", bg: "cc_bosco", time: "giorno", travel: [18, 22],
        w: 36, h: 24, start: [18, 22], items: [[2, 2], [33, 2], [3, 21]],
        areas: [[11, 4, 25, 12, "Il campo del Cristallo dell'Erba"], [0, 0, 35, 23, "Il Bosco di Rovo"]], act: { v: "Torna sulla mappa del mondo", X: "Apri il nido" },
        intro: [["voce", "Il Bosco di Rovo: alberi così fitti che la luce arriva verde, a fili. Le spine si muovono, piano, come se respirassero. Tra le radici, lucciole."], ["voce", "Nel cuore del bosco, una radura: un campo da calcio d'erba grigia, e in fondo, su un piedistallo di pietra, un cristallo spento."]],
        npcs: (s) => (s >= 5 && !lit() ? [{ id: "cc_rovo", at: [18, 9] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 23, "t"); lay(17, 13, 19, 23, ":"); lay(11, 4, 25, 12, "-"); put(18, 3, "Y"); lay(17, 3, 17, 3, "-"); lay(19, 3, 19, 3, "-");
          lay(2, 15, 16, 16, ":"); lay(2, 17, 3, 21, ":"); put(4, 19, "X"); lay(20, 15, 33, 16, ":"); lay(32, 2, 33, 14, ":"); lay(2, 2, 3, 14, ":"); lay(17, 23, 18, 23, "v");
        },
        decor(g, cx, cy, d) { // il campo del cristallo: grigio finché è spento, poi verde con i fiori
          g.fillStyle = lit() ? "rgba(120,255,160,.12)" : "rgba(150,150,150,.55)"; g.fillRect(d.X(11), d.Y(4), 15 * 16, 9 * 16);
          g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 1; g.strokeRect(d.X(11) + 2, d.Y(4) + 2, 15 * 16 - 4, 9 * 16 - 4);
        },
      },
    };
    function match() {
      K.ownMatch(window.__atb.start, {
        oppStyle: "difensiva", title: "Il Cristallo dell'Erba · contro i Guardiani di Rovo", us: "Il gruppo", half: 70, theme: "prato",
        heroSt: { tiro: 15, pass: 13, dif: 11, vel: 14 }, heroSpells: ["luce"], heroMp: 16,
        party: [{ id: "cc_lyra", name: "Lyra", skin: "#f0d0b0", hair: "#c8a040", st: { tiro: 8, pass: 12, dif: 17, vel: 12 }, spells: ["cura"], mp: 15 }, { id: "cc_fosco", name: "Fosco", skin: "#e8c4a0", hair: "#3a2a5a", st: { tiro: 9, pass: 14, dif: 8, vel: 10 }, spells: ["vento", "gelo", "fuoco"], mp: 30 }],
        opp: { name: "Guardiani di Rovo", color: "#5a3a2a", players: [{ name: "Rovo", skin: "#8a6a4a", hair: "#2a4a1a", st: { tiro: 12, pass: 11, dif: 14, vel: 10 } }, { name: "Spina", skin: "#7a5a3a", hair: "#3a5a1a" }, { name: "Ortica", skin: "#8a7a4a", hair: "#4a6a2a" }, { name: "Cardo", skin: "#6a5a3a", hair: "#5a3a6a" }] },
        intro: "<p>I Guardiani di Rovo difendono il campo da chiunque. Sono lenti ma duri: chiudono gli spazi. Avanza con pazienza, passa la palla, e se serve chiedi a Fosco un po' di <b>Vento</b>.</p>",
        done: (r) => {
          if (!r.win) return K.scene([["cc_rovo", "(le spine si ritirano un poco) …Giocate ancora. Il cristallo vi ha sentiti. Vuole sentirvi di nuovo."], ["cc_lyra", "Ci riproviamo. Una cavaliera non si arrende al primo assalto. Nemmeno al secondo."]], () => K.enterZone("cc_bosco"), "cc_bosco");
          F.set("cristallo_cc_bosco", true); setStep(N, 6); questDone("cc_erba"); bond("gruppo", 2); K.learnLore("l_erba");
          K.scene([["voce", "Fischio finale. Il cristallo sul piedistallo trema, poi si accende: verde, limpido, come una goccia di primavera. L'erba del campo diventa verde a cerchi, dal centro verso i bordi."], ["cc_rovo", "(le spine fioriscono, tutte insieme) …Vi riconosco. Siete giocatori. Avevamo dimenticato che faccia hanno, i giocatori. Grazie."], ["cc_fosco", "Ho visto tutto. TUTTO. Con gli occhiali è un'altra partita. Anche la vita, in generale."]], () => K.enterZone("cc_bosco"), "cc_bosco");
        },
      });
    }
    const talk = {
      cc_ermete() {
        const s = S();
        if (s === 0) return say([
          ["cc_ermete", "Un forestiero! E con un pallone sotto il braccio. Non se ne vedevano da mesi. Siediti, ti racconto una cosa che nessuno mi crede."],
          ["cc_ermete", "Nel mondo ci sono quattro cristalli: Erba, Mare, Stelle, Fuoco. Ognuno riposa sotto un campo da calcio. Le partite giocate bene li tengono accesi, e i cristalli tengono in moto le stagioni. Da quando nessuno gioca più per il piacere di giocare, si spengono. Uno alla volta."],
          ["cc_ermete", "Il primo è il Cristallo dell'Erba, nel Bosco di Rovo. Al cancello del villaggio c'è una cavaliera del castello: è venuta per lo stesso motivo. Parlale. Da solo non ce la fai. Nessuno ce la fa da solo, nel calcio."],
        ], () => { setStep(N, 1); K.learnLore("l_cristalli"); quest("cc_erba", "Il Cristallo dell'Erba", "Riaccendi il cristallo nel Bosco di Rovo. Prima, trova compagni di viaggio."); done(); });
        if (s === 6) return ask("cc_ermete", "L'erba! L'erba canta! L'hai sentita? A ogni passo fa «fff», come un applauso piccolo. Avevo ragione io, per sessant'anni.\n\nIl primo cristallo è acceso. Ne mancano tre. Il prossimo è il Cristallo del Mare, oltre le Montagne Grigie. Prima di partire…", [
          { label: "«Partiamo subito, il mondo aspetta»", sub: "Il gruppo è carico", big: true, fn: () => endCh("subito") },
          { label: "«Prima una festa per la primavera»", sub: "Una notte al villaggio, tutti insieme", big: true, fn: () => endCh("festa") },
          { label: "«Lyra, perché non tiri mai?»", sub: "Chiedi alla cavaliera del suo giuramento", big: true, fn: () => endCh("lyra") },
        ], "cc_prato");
        return say([["cc_ermete", K.pick(["Quattro cristalli, quattro campi. Il mondo è un pallone, a pensarci bene: gira, e se nessuno lo calcia si ferma.", "Al villaggio non gioca più nessuno. I bambini sono cresciuti senza sapere che l'erba può cantare."])]]);
      },
      cc_lyra() {
        const s = S();
        if (s === 1) return ask("cc_lyra", "Lyra del Prato, cavaliera di Verdemare. Il castello mi ha mandato a scoprire perché i cristalli si spengono. Il saggio dice che servono giocatori. Io… ho giurato di non giocare più.\n\nPosso difendere. Posso parare. Posso proteggere chi tira. Basta?", [
          { label: "«Basta e avanza. Vieni con me»", sub: "Lyra si unisce al gruppo", cls: "hot", fn: () => { setStep(N, 2); K.joinParty("cc_lyra"); bond("gruppo", 1); say([["cc_lyra", "Allora andiamo. Io ti copro le spalle. (Si mette dietro di te, a un passo, e da lì non si sposta più.)"], ["voce", "<b>Lyra si unisce al gruppo.</b> Adesso ti segue ovunque: per parlarle, girati verso di lei."]]); } },
          { label: "«Un giuramento si può anche sciogliere»", sub: "Più audace…", fn: () => { setStep(N, 2); K.joinParty("cc_lyra"); bond("luce", 1); say([["cc_lyra", "(ti guarda a lungo) …Forse. Un giorno. Non oggi. Oggi vengo con te, e paro."], ["voce", "<b>Lyra si unisce al gruppo.</b> Adesso ti segue ovunque: per parlarle, girati verso di lei."]]); } },
        ], "cc_prato");
        if (s >= 2) return say([["cc_lyra", K.pick(["Sono dietro di te. Sempre. È il mio posto.", "Lo scudo pesa meno, da quando lo porto per qualcuno.", s >= 5 ? "Fosco ci vede, adesso. Speriamo che ci veda anche in partita." : "Un mago miope… Ermete dice che è il più potente del regno. Quando ci vede."])]]);
        return done();
      },
      cc_fosco() {
        const s = S(), here = K.api.trZone();
        if (here === "cc_torre" && s === 2) return say([
          ["cc_fosco", "Chi è là? Una statua? No, le statue non respirano. Un cavallo? No, troppo basso. Ah, una persona! Benvenuta! Sono Fosco, mago. Trecento incantesimi. Zero occhiali."],
          ["cc_fosco", "Li ho persi nel Bosco di Rovo, scappando dai Guardiani. Senza occhiali non leggo le formule, e se non leggo le formule… l'ultima volta ho lanciato Vento su una mucca. Me li riporti? Poi vengo con voi dove volete. Anche a giocare. Soprattutto a giocare."],
        ], () => { setStep(N, 3); quest("cc_occhiali", "Gli occhiali di Fosco", "Sono nel Bosco di Rovo, a sud-est sulla mappa del mondo."); done(); });
        if (here === "cc_torre" && s === 4) return say([["cc_fosco", "(si mette gli occhiali) …OH. Oh! Che bello il mondo! Siete bellissimi! Anche tu, cavaliera, che mi guardi male. Vengo con voi. Ho Vento, Gelo e Fuoco pronti. E stavolta so dove sono le mucche."], ["voce", "<b>Fosco si unisce al gruppo.</b> Ha le magie Vento, Gelo e Fuoco."]], () => { setStep(N, 5); K.joinParty("cc_fosco"); questDone("cc_occhiali"); bond("gruppo", 1); done(); });
        if (here === "cc_torre" && s === 3) return say([["cc_fosco", "Gli occhiali! Nel Bosco di Rovo! A sud-est! Credo. Era tutto sfocato."]]);
        return say([["cc_fosco", K.pick(["Con gli occhiali vedo tutto: le stelle, le formule, e la faccia di Lyra quando sbaglio un incantesimo.", "Vento, Gelo, Fuoco. E Luce, ce l'hai tu: me l'ha detto il cristallo. Credo. Forse era un albero."])]]);
      },
      cc_contadina() { return say([["cc_contadina", lit() ? "Il grano! È cresciuto in una notte! E l'erba del campo… canta! Ermete aveva ragione. Non glielo diremo mai, eh." : "Il grano non cresce e non secca. Resta lì, a metà, come una domanda. Io sto lì con lui, a metà."]]); },
      cc_rovo() {
        if (S() === 5 && !lit()) return ask("cc_rovo", "(le spine si drizzano) Fermi. Il campo del cristallo non è per i viandanti. Nessuno gioca qui da cento stagioni. Se volete passare, dovete battere i Guardiani. A modo nostro: una partita come una battaglia.", [{ label: "Accetta la sfida", sub: "Partita ATB · battaglia a turni", cls: "hot", fn: match }, { label: "Non ancora", fn: done }], "cc_bosco");
        return say([["cc_rovo", "Il cristallo vi ringrazia. Anche le spine."]]);
      },
    };
    function endCh(kind) {
      if (kind === "subito") bond("gruppo", 1); if (kind === "festa") bond("gruppo", 2); if (kind === "lyra") { bond("luce", 2); K.learnLore("l_lyra"); }
      F.set("cc_mantello", true); const msg = K.reward("ch1", { coins: 70, cos: ["cc_c1"] }); finishChapter(N, kind); setStep(N, 7);
      const lines = {
        subito: [["voce", "Il gruppo parte all'alba. Ermete li saluta dal cancello, e l'erba del campo fa «fff» a ogni loro passo, finché non escono dal villaggio."]],
        festa: [["voce", "Quella notte, a Prato Lungo, si gioca la prima partita da mesi: grandi contro piccoli, sul campo verde. Fosco arbitra con gli occhiali. Lyra para tutto. Non tira mai. Ma ride."]],
        lyra: [["cc_lyra", "(dopo un lungo silenzio) Finale del Castello. Ultimo minuto. Rigore. L'ho tirato alto, sopra la porta, sopra le mura, sopra tutto. Da quel giorno paro. Parare non sbaglia mai: o prendi, o no."], ["cc_lyra", "…Grazie per averlo chiesto. Nessuno lo chiede mai. Tutti pensano che sia per il giuramento. È per paura."]],
      }[kind];
      K.scene([...lines, ["voce", `<b>Fine del Capitolo 1.</b> ${msg.join(" · ")}`]], () => K.openMain(), "cc_prato");
    }
    const obj = {
      "cc_prato:^": () => go("cc_mondo", 10, 21), "cc_mondo:P": () => go("cc_prato", 17, 1),
      "cc_mondo:Q": () => K.enterZone("cc_torre"), "cc_mondo:Z": () => go("cc_bosco", 18, 22), "cc_bosco:v": () => go("cc_mondo", 36, 22),
      "cc_mondo:K": () => say([["voce", "Un porto, oltre le Montagne Grigie. Le barche sono legate, le vele ammainate. Un cartello: «Nave per il Mare del Cristallo: si parte quando torna il vento». Il vento non c'è."]]),
      "cc_prato:X": () => say([["voce", "Il forziere antico ha un lucchetto a forma di pallone. Ermete dice che si apre «quando i quattro cristalli brillano». Per ora resta chiuso."]]),
      "cc_bosco:X": () => {
        if (S() !== 3) return say([["voce", "Un nido di rovi, vuoto. Ci hai già guardato."]]);
        setStep(N, 4); K.SFX.ding(); return say([["voce", "Tra le spine di un nido di rovi brilla qualcosa: un paio di occhiali tondi, con una lente incrinata. Sul bordo, inciso: «F.»"], ["cc_lyra", "Li ha persi scappando. Si vede: c'è anche un pezzo del suo mantello. E una formula scritta sulla corteccia, al contrario."]]);
      },
      "cc_bosco:Y": () => say([["voce", lit() ? "Il Cristallo dell'Erba brilla, verde e limpido. Dentro, se guardi bene, c'è un campo piccolissimo, e qualcuno che ci gioca." : "Il cristallo è spento, grigio come una pietra di fiume. Freddo. Aspetta una partita."]]),
    };
    return { n: N, title: "Il Cristallo dell'Erba", sub: "Prato Lungo, la mappa del mondo, il Bosco di Rovo", goal, start: "cc_prato", introBg: "cc_titolo", zones, talk, obj,
      intro: () => [["voce", "C'era una volta un mondo in cui le stagioni cambiavano a ogni partita. Ogni gol, un fiore. Ogni parata, una nuvola. Ogni finale, un cambio di stagione."], ["voce", "Poi la gente smise di giocare per il piacere di giocare. I quattro cristalli si spensero uno a uno. E il mondo si fermò in un pomeriggio d'autunno lungo un anno."], ["voce", "Il Campione arriva a Prato Lungo con un pallone sotto il braccio. È l'unico pallone del villaggio che si muove."]] };
  }
  boot();
})();
