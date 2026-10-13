// js/ducati-c2.js - LA GUERRA DEI TRE DUCATI · Capitolo 2 «Il ponte di vetro»
// Vetrara, la città dei canali e delle serre di vetro. La semifinale contro la squadra della Marchesa Cristallina.
// E una sera, nel giardino del palazzo, l'erede di Vetrara chiede aiuto alla squadra che dovrebbe essere sua nemica.
(function () {
  "use strict";
  function boot() { const D = window.__ducati; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("td_isotta", { acc: ["fiore"], name: "Isotta, erede di Vetrara", tag: "", hair: "#e8d08a", style: "braids", skin: "#f4dcc8", eye: "#3a8a7a", bg: ["#2a1e14", "#2a8a6a"], shirt: "#2a8a6a" },
      "La figlia della Marchesa Cristallina, erede del ducato di Vetrara. Gioca da regista nella squadra della madre, e ha scoperto che la Coppa, quest'anno, sua madre la vuole comprare. Lei vuole vincerla.");
    K.cast("td_marchesa", { acc: ["corona", "sciarpa"], name: "La Marchesa Cristallina", tag: "", hair: "#c8c8d8", style: "bun", skin: "#f4e4d8", eye: "#5a7a8a", bg: ["#2a1e14", "#2a8a6a"], shirt: "#c8d8d0" },
      "La signora di Vetrara. Parla piano, sorride sempre, e non ha mai pagato il prezzo pieno di niente. Dice che ogni cosa al mondo ha un prezzo. Anche una coppa.");
    K.cast("td_vetraio", { acc: ["grembiule", "guanti"], name: "Mastro Soffio, il vetraio", tag: "", hair: "#5a3a2a", style: "curly", skin: "#c68642", eye: "#3a2a1a", beard: true, bg: ["#2a1e14", "#3a6a9a"], shirt: "#3a6a9a" },
      "Il più grande soffiatore di vetro della città. Soffia bicchieri, lampadari e, una volta, una coppa intera, che si è rotta alla prima vittoria. Odia le guerre: rompono i vetri.");
    K.cast("td_barcaiolo", { acc: ["paglia"], name: "Remo, il barcaiolo", tag: "", hair: "#2a2a2a", style: "messy", skin: "#d9a679", eye: "#2a2a2a", bg: ["#2a1e14", "#3a8aa0"], shirt: "#e8e8e8" },
      "Porta la gente da un ponte all'altro, cantando. Ha visto passare duchi, ladri e innamorati. Non giudica nessuno: li porta tutti dall'altra parte.");
    K.cos("td_c2", { kind: "acc", label: "Fiore di vetro di Vetrara", val: "fiore", from: "Capitolo 2 di La Guerra dei Tre Ducati" });
    K.cos("td_sigilli2", { kind: "acc", label: "Sigillo di sale e vetro", val: "medaglia", from: "Trova i sigilli di sale del Capitolo 2" });
    const goal = (s) => ({
      0: "Vetrara. Qualcuno ti ha lasciato un biglietto: «Al tramonto, nel giardino del palazzo». Il palazzo è a nord.",
      1: "La semifinale contro Vetrara. La Marchesa Cristallina ti aspetta sul ponte grande.",
      2: "Che fare di Isotta? Cerca argomenti (il vetraio, il barcaiolo, l'archivio del palazzo), poi da Corrado.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      td_vetrara: {
        region: "vetrara", name: "La Guerra dei Tre Ducati · Vetrara", short: "Vetrara", sub: "Canali, ponti e serre di vetro", bg: "td_vetrara", time: (K, s) => (s === 0 ? "tramonto" : "giorno"), travel: [16, 21],
        w: 34, h: 24, start: [16, 21], itemCos: "td_sigilli2", items: [[1, 5], [31, 12]],
        areas: [[12, 1, 21, 6, "Il palazzo della Marchesa"], [0, 0, 33, 23, "Vetrara"]],
        flavor: { s: "Una panchina di ferro battuto, davanti al canale." },
        intro: [["voce", "Vetrara: una città di canali, ponti di pietra bianca e serre di vetro colorato. Di giorno brilla come un gioiello; al tramonto, ogni finestra si accende di un colore diverso."]],
        npcs: (s) => [{ id: "td_corrado", at: [14, 20] }, { id: "td_lia", at: [20, 21] }, { id: "td_ottone", at: [10, 21] }, { id: "td_anselmo", at: [24, 20] }, { id: "td_vetraio", at: [5, 14] }, { id: "td_barcaiolo", at: [27, 15] }, ...(s === 1 ? [{ id: "td_marchesa", at: [16, 11] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a"); lay(0, 23, 33, 23, "a");
          lay(1, 8, 32, 9, "w"); lay(1, 17, 32, 17, "w"); lay(10, 1, 10, 7, "w"); lay(23, 10, 23, 16, "w");
          put(16, 8, ":"); put(16, 9, ":"); put(5, 8, ":"); put(5, 9, ":"); put(28, 8, ":"); put(28, 9, ":"); put(16, 17, ":"); put(8, 17, ":"); put(27, 17, ":"); put(23, 13, ":"); put(10, 4, ":");
          lay(1, 18, 32, 22, ":"); lay(12, 10, 20, 12, ":");
          house(13, 2, 7, 4, { door: [16, 5], roof: "#2a8a6a", wall: "#e8e4d8", rr: 2, enter: { to: "td_palazzo", at: [9, 10] } });
          lay(2, 11, 8, 12, "X"); lay(25, 2, 31, 3, "X"); lay(24, 19, 26, 19, "X"); lay(2, 2, 7, 3, "X");
          [[12, 14], [20, 14], [30, 20], [3, 20]].forEach(([x, y]) => put(x, y, "t")); put(18, 21, "s");
        },
      },
      td_palazzo: {
        interior: true, region: "casa", name: "La Guerra dei Tre Ducati · Il palazzo di Vetrara", short: "Il palazzo", sub: "Il giardino d'inverno e l'archivio", bg: "td_palazzo", w: 18, h: 13, start: [9, 10], outside: ["td_vetrara", 16, 6],
        act: { L: "Guarda l'archivio", T: "Guarda il tavolo", X: "Guarda la vetrata", v: "Esci" },
        flavor: { T: "Un tavolo di cristallo. Sopra, un modellino di Vetrara fatto di vetro: ogni ponte, ogni serra. Manca solo lo stadio.", X: "Le vetrate del giardino d'inverno: limoni, aranci, una fontana che suona come un carillon." },
        objects: { "3,1": () => { if (S() >= 2 && K.arg("citta")) return say([["voce", "Nell'archivio, fra i contratti della Marchesa, una mappa vecchia: oltre il lago, le Città Libere. «Qui non ci sono duchi: si decide in piazza.» <b>Nuovo argomento: Le Città Libere (Libertà).</b>"]]); say([["voce", "L'archivio di Vetrara: contratti, ricevute, conti. Ogni cosa al mondo ha un prezzo, dice la Marchesa, e qui ci sono tutti i prezzi."]]); } },
        intro: [["voce", "Il palazzo della Marchesa: un giardino d'inverno sotto una cupola di vetro, pieno di limoni. Dietro una porta, l'archivio."]],
        npcs: (s) => (s === 0 || s === 2 ? [{ id: "td_isotta", at: [12, 6] }] : []),
        build(L) { const { lay, put } = L; lay(0, 0, 17, 12, "+"); lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 12, "a"); lay(17, 0, 17, 12, "a"); lay(0, 12, 17, 12, "a"); put(9, 12, "v"); lay(1, 1, 5, 1, "L"); lay(7, 4, 10, 5, "T"); lay(13, 1, 16, 1, "X"); [[2, 9], [15, 9], [14, 4]].forEach(([x, y]) => put(x, y, "t")); },
      },
    };
    function semifinale() {
      K.campo({ title: "Calcio Tattico · Semifinale a Vetrara, sulle terrazze di vetro", terrain: "vetro", oppStyle: "difensiva", minutes: 60,
        mates: [{ name: "Corrado", skin: "#e0b890", hair: "#a8a8a8" }, { name: "Lia", skin: "#e8c4a0", hair: "#c87a3a" }], opp: { name: "Vetrara", color: "#2a8a6a", players: [{ name: "Isotta", skin: "#f4dcc8", hair: "#e8d08a" }, { name: "Cristallo", skin: "#e8c4a0", hair: "#3a2a1a" }, { name: "Smeriglio", skin: "#d9a679", hair: "#1a1a1a" }], keeper: { name: "Vetrocemento" } },
        intro: "<p>Il campo di Vetrara è fatto di terrazze, alte e basse: <b>tenete le terrazze</b> e tirate dall'alto. Vetrara gioca <b>chiusa</b>, aspetta e riparte. Isotta è la loro regista: prendetela alle spalle.</p>", winTitle: "SALINELLA IN FINALE!" }, (r) => {
        if (!r.win) return K.scene([["td_marchesa", "[furbo] Peccato. (Sorride.) Il regolamento della Coppa concede la ripetizione in caso di… disturbo del pubblico. Il pubblico, oggi, era molto disturbante. Ci rivediamo."]], () => K.enterZone("td_vetrara"), "td_vetrara");
        setStep(N, 2); bond("morale", 1);
        K.scene([["voce", "Fischio finale: Salinella è in finale. La Marchesa Cristallina applaude, piano, con due dita."], ["td_marchesa", "[pensa] Brava squadra. (Si volta verso Isotta.) E tu, figlia mia, hai giocato contro casa tua. Ne parleremo."], ["td_isotta", "[triste] (A voce bassa, passandoti accanto.) Mi riporterà a palazzo e non uscirò più. Non lasciarmi lì, capitano. O lasciami. Decidete voi. Alla vostra Bilancia."]], () => { quest("td_voto2", "La Bilancia: Isotta", "Cerca argomenti (il vetraio, il barcaiolo, l'archivio del palazzo), poi da Corrado."); K.enterZone("td_vetrara"); }, "td_vetrara");
      });
    }
    function ponti() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["td_barcaiolo", r && r.win ? "[ride] Bravi! Avete giocato sui ponti senza cadere nel canale. Quasi nessuno ci riesce." : "[ride] Il canale vi ha preso il pallone due volte. Succede a tutti."]], () => K.enterZone("td_vetrara"), "td_vetrara");
      ask("td_barcaiolo", "La sera, i barcaioli giocano sul ponte grande: si perde il pallone nel canale, ma è bello. Una partita?", [
        { label: "Calcio tattico", sub: "La partita della saga, sulle terrazze di vetro", cls: "hot", fn: () => K.campo({ title: "Calcio Tattico · I barcaioli del ponte grande", terrain: "vetro", oppStyle: "contropiede", minutes: 45, mates: [{ name: "Lia" }, { name: "Ottone" }], opp: { name: "I barcaioli", color: "#3a8aa0", players: [{ name: "Remo" }, { name: "Gondola" }, { name: "Forcola" }], keeper: { name: "Pontile" } } }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "td_ponti", alt: "az,cage,hd", force: false, oppTeam: "I barcaioli", oppColor: "#3a8aa0", us: "Salinella", homeKit: ["#2a6ab8", "#ece8dc"], mate: "Lia della Cava", squad: ["Lia della Cava", "Ottone Berilli", "Corrado Salvi"], chap: "La Guerra dei Tre Ducati · La partita sul ponte", bg: "td_vetrara", oppNames: ["Remo", "Gondola", "Forcola", "Pontile", "Canale"], intro: "Sul ponte grande di Vetrara, la sera: i barcaioli giocano veloce e cantano.", done: after }) },
        { label: "Dopo", fn: done },
      ], "td_vetrara");
    }
    function voto() {
      K.bilancia({ id: "v2", title: "La Bilancia · Isotta", q: "Isotta chiede di non tornare dalla madre. Riconsegnarla porta la pace con Vetrara. Proteggerla è giusto, ma è guerra. Oppure aiutarla a partire per le Città Libere, dove deciderà lei.",
        opts: [{ id: "consegna", label: "Riconsegnarla alla madre", conv: "utile" }, { id: "proteggi", label: "Proteggerla a Salinella", conv: "morale" }, { id: "fuga", label: "Aiutarla a partire", conv: "liberta" }],
        voters: ["td_corrado", "td_lia", "td_ottone", "td_anselmo"], done: (w) => fine2(w) });
    }
    const talk = {
      td_isotta() {
        if (S() === 0) return K.scene([["td_isotta", "[pensa] (Fra i limoni del giardino d'inverno, con la maglia verde di Vetrara.) Sei venuto. Bene. Ascolta: mia madre non vuole vincere la Coppa. Vuole comprarla. Ha già pagato l'arbitro della finale, chiunque arrivi in finale."], ["td_isotta", "Io gioco per vincere, non per comprare. Domani, in semifinale, giocherò contro di voi al massimo. (Ti guarda.) E dopo, se vincete voi, avrò bisogno di un posto dove andare."]], () => { setStep(N, 1); F.set("td_arbitro", true); done(); }, "td_palazzo");
        return say([["td_isotta", S() >= 2 ? "[triste] Non chiedo niente. Ho solo detto la verità. Adesso decide la vostra Bilancia." : "Domani giocherò contro di voi. Al massimo."]]);
      },
      td_marchesa() {
        if (S() === 1) return ask("td_marchesa", "(Sul ponte grande, con un ombrellino di vetro colorato.) Il capitano di Salinella. Avete rifiutato la mia offerta, o forse no, non ricordo. Non importa. Oggi giochiamo. (Sorride.) Ogni cosa ha un prezzo: oggi vediamo il vostro.", [{ label: "Gioca la semifinale", sub: "Calcio tattico · partita importante", cls: "hot", fn: semifinale }, { label: "Non ancora", fn: done }], "td_vetrara");
        return say([["td_marchesa", "Ogni cosa ha un prezzo."]]);
      },
      td_corrado() {
        if (S() === 2) return ask("td_corrado", `(Sul ponte, guardando il palazzo.) Isotta. Una ragazza che ha detto la verità a sua madre e ai suoi nemici. Si decide alla Bilancia, come sempre. Argomenti che hai: ${K.args().length}.`, [{ label: "Alla Bilancia", sub: "Il voto su Isotta", cls: "hot", big: true, fn: voto }, { label: "Prima cerco argomenti", fn: done }], "td_bilancia");
        return say([["td_corrado", S() === 0 ? "Un biglietto senza firma? Vai, ma stai attento. A Vetrara anche i giardini hanno le orecchie." : "Semifinale. Tenete le terrazze."]]);
      },
      td_vetraio() {
        if (S() >= 2 && !F.is("td_arg_tregua")) return say([["td_vetraio", "[pensa] (Soffia in un tubo; nasce una bolla di vetro azzurro.) Sai quanti vetri si rompono in una guerra? Tutti. Una tregua con Vetrara, ragazzo, vale dieci partite vinte. Dillo alla tua Bilancia."]], () => { K.arg("tregua"); say([["voce", "<b>Nuovo argomento: La tregua del vetro (Utile).</b>"]]); });
        return say([["td_vetraio", "Il vetro è come una squadra: fragile, finché non lo scaldi abbastanza."]]);
      },
      td_barcaiolo() {
        const opts = [{ label: "La partita sul ponte", sub: "Partita secondaria · scegli tu la modalità", fn: ponti }, { label: "Dopo", fn: done }];
        if (S() >= 2 && !F.is("td_arg_parola")) return say([["td_barcaiolo", "[pensa] (Smette di cantare.) La ragazza della Marchesa? Ho portato dall'altra parte del canale gente di ogni tipo. Una regola sola: chi bussa alla tua barca chiedendo aiuto, si aiuta. Sempre. Poi si vede."]], () => { K.arg("parola"); say([["voce", "<b>Nuovo argomento: La parola data (Morale).</b>"]]); });
        return ask("td_barcaiolo", "(Canta, remando nel vuoto, anche se la barca è ferma.) Dall'altra parte, signore?", opts, "td_vetrara");
      },
      td_lia() { return say([["td_lia", S() >= 2 ? "[furbo] Le Città Libere esistono davvero, sai? Nell'archivio del palazzo c'è una mappa. Me l'ha detto Isotta." : "Vetrara è bella. Troppo. Come una vetrina."]]); },
      td_ottone() { return say([["td_ottone", "[pensa] Una tregua con Vetrara vorrebbe dire sale venduto a prezzo giusto. Per dieci anni. (Fa due conti.) Interessante."]]); },
      td_anselmo() { return say([["td_anselmo", "Scrivo: «Vetrara, semifinale». Il resto lo scriverò dopo la Bilancia."]]); },
    };
    function fine2(w) {
      questDone("td_voto2"); if (w !== "consegna") F.set("td_isotta_con", true);
      const msg = K.reward("c2:td", { coins: 90, cos: ["td_c2"] }); finishChapter(N, w); setStep(N, 5);
      const l = {
        consegna: [["td_isotta", "[triste] (Prende la mano della madre senza guardarti.) Avete deciso bene, forse. Per Salinella."], ["td_marchesa", "[felice] Una scelta saggia, capitano. Vetrara se ne ricorderà. (Firma una tregua su un foglio di carta di vetro.)"]],
        proteggi: [["td_isotta", "[sorpreso] Mi… tenete con voi? (Si toglie la maglia verde: sotto ha già quella bianca e blu di Salinella.) L'avevo cucita stanotte. Speravo."], ["td_marchesa", "[arrabbiato] (Il sorriso, per la prima volta, si rompe.) Allora è guerra, Salinella. In finale, e dopo."]],
        fuga: [["td_barcaiolo", "(La barca scivola sul canale, nella notte.) Dall'altra parte, signorina."], ["td_isotta", "[felice] Le Città Libere. (Ti stringe la mano.) Tornerò per la finale. Ma tornerò da libera, e giocherò per chi voglio io."]],
      }[w];
      K.scene([...l, ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La finale sulle saline».`]], () => K.openMain(), "td_bilancia");
    }
    return { n: N, title: "Il ponte di vetro", sub: "Vetrara, la semifinale, la seconda Bilancia", goal, start: "td_vetrara", introBg: "td_vetrara", zones, talk,
      intro: () => [["voce", "<b>LA GUERRA DEI TRE DUCATI.</b> Capitolo 2. La semifinale si gioca a Vetrara, la città di vetro. Sotto il cuscino della tua stanza, la prima sera, trovi un biglietto senza firma: «Al tramonto, nel giardino del palazzo»."]] };
  }
  boot();
})();
