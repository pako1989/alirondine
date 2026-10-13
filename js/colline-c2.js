// js/colline-c2.js - MASTER LEAGUE DELLE COLLINE · Capitolo 2 «Il mercato d'inverno»
// Gennaio, fiera di Borgofiera: bancarelle di salami, di trattori e di calciatori. Il mercato d'inverno della Lega.
// Il Cavalier Ottone, presidente dell'Atletico Valfonda, compra tutto quello che si muove: anche la tua capitana, se glielo lasci.
(function () {
  "use strict";
  function boot() { const D = window.__colline; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("ml_ottone", { acc: ["garofano"], name: "Il Cavalier Ottone", tag: "", hair: "#2a2a2a", style: "slick", skin: "#e8c4a0", eye: "#3a3a3a", bg: ["#1e3a2a", "#a83a2a"], shirt: "#1a1a2a" },
      "Presidente dell'Atletico Valfonda, la squadra ricca delle colline. Ha fatto i soldi con i trattori, e compra calciatori come compra trattori: i più grossi, i più nuovi, e due per volta. Sorride sempre. Soprattutto quando vince.");
    K.cast("ml_fiera", { acc: ["coppola"], name: "Il capitano del Borgofiera", tag: "", hair: "#8a5a2a", style: "curly", skin: "#d9a679", eye: "#3a2a1a", bg: ["#1e3a2a", "#c88a2a"], shirt: "#c88a2a" },
      "Il capitano degli Amatori Borgofiera, e il macellaio della fiera. Gioca a palla lunga perché, dice, il centrocampo è una perdita di tempo, come i salami tagliati sottili.");
    K.cos("ml_c2", { kind: "acc", label: "Sciarpa della fiera d'inverno", val: "sciarpa", from: "Capitolo 2 di Master League delle Colline" });
    K.cos("ml_fig2", { kind: "hairc", label: "Capelli Vinaccia", val: "#6a1a3a", from: "Trova tutte le figurine rare della fiera" });
    const goal = (s) => ({
      0: "Alla fiera di Borgofiera c'è il mercato d'inverno. Il Mago Pino è venuto con te: è vicino alle bancarelle.",
      1: "Il capitano del Borgofiera vuole un'amichevole: chi vince prende l'incasso della fiera.",
      2: "Il Cavalier Ottone della Valfonda ti cerca. Sorride.",
      3: "La partita di campionato contro l'Atletico Valfonda, i primi in classifica. Al campo della fiera.",
      4: "Hai giocato contro la Valfonda. La Contessa è venuta alla fiera.",
    }[s] || "Il capitolo 2 è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      ml_citta: {
        region: "colle", name: "Master League delle Colline · La fiera di Borgofiera", short: "La fiera di Borgofiera", sub: "Bancarelle, trattori e calciatori", bg: "ml_citta", time: "giorno", travel: [15, 19],
        w: 32, h: 22, start: [15, 19], itemCos: "ml_fig2", items: [[2, 2], [29, 3], [29, 19]],
        areas: [[19, 10, 29, 17, "Il campo della fiera"], [0, 0, 31, 21, "La fiera di Borgofiera"]],
        flavor: { t: "Un platano con appese le locandine: «Fiera d'inverno · salumi, macchine agricole, mercato calciatori». In quest'ordine." },
        intro: [["voce", "La fiera d'inverno di Borgofiera: bancarelle di salami, trattori lucidi, castagne arrosto, e in fondo, sotto un tendone a righe, il mercato dei calciatori della Lega delle Colline."], ["voce", "Davanti al tendone c'è già il Cavalier Ottone, con un garofano all'occhiello e un assegno in mano."]],
        npcs: (s) => [{ id: "ml_pino", at: [12, 9] }, { id: "ml_fiera", at: [22, 12] }, ...(s >= 2 ? [{ id: "ml_ottone", at: [8, 13] }] : []), ...(!F.is("ml_ceduto_marta") ? [{ id: "ml_marta", at: [17, 15] }] : []), ...(s >= 4 ? [{ id: "ml_bice", at: [14, 7] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 21, 31, 21, "t"); lay(0, 0, 0, 21, "t"); lay(31, 0, 31, 21, "t");
          lay(4, 6, 17, 11, "+"); lay(15, 12, 15, 20, ":"); lay(1, 19, 30, 20, ":"); lay(18, 9, 18, 9, ":");
          house(3, 2, 5, 3, { door: [5, 4], roof: "#c83a3a", wall: "#f4ecd8", rr: 2, enter: "La bancarella dei salami. Il salumiere ti fa assaggiare tutto, poi ti chiede: «E la Colle Alto, quest'anno? Si salva?». Prima che tu risponda, ti taglia un'altra fetta. «Mangi, che serve forza.»" });
          house(10, 1, 7, 4, { door: [13, 4], roof: "#2a5a8a", wall: "#e8d8b0", rr: 2, enter: "Il tendone del mercato: figurine appese ai fili come panni stesi, presidenti che contrattano, procuratori con i baffi. Il Mago Pino dice che il mercato vero si fa fuori, alla bancarella del vin brulé." });
          house(23, 2, 6, 3, { door: [26, 4], roof: "#c88a2a", wall: "#f4ecd8", rr: 2, enter: "I trattori del Cavalier Ottone: lucidi, nuovi, rossi come le maglie della Valfonda. Sul più grande c'è scritto «CAMPIONI 2026». È gennaio." });
          lay(19, 10, 29, 17, ":"); put(19, 13, "Q"); put(29, 13, "Q");
          [[2, 9], [2, 15], [30, 8], [22, 19], [8, 17]].forEach(([x, y]) => put(x, y, "t")); put(11, 18, "s");
        },
      },
    };
    function amichevole() { // la partita secondaria: la modalità la scegli tu
      K.playMatch({ id: "ml_fiera", alt: "az,cage,hd", force: false, oppTeam: "Amatori Borgofiera", oppColor: "#c88a2a", mate: "Marta Fiore", squad: ["Bepi Sasso", "Gigio Ruota", "Rino Corriera"], us: "U.S. Colle Alto", homeKit: ["#2a6a3a", "#f4ecd8"], chap: "Master League delle Colline · L'amichevole della fiera", bg: "ml_citta", oppNames: ["Il Salumiere", "Il Trattorista", "La Castagnara", "Il Macellaio", "Il Banditore"], intro: "L'amichevole della fiera: chi vince prende l'incasso. Il Borgofiera gioca a palla lunga, come taglia i salami: grosso.",
        done: (r) => {
          if (!r.win) return K.scene([["ml_fiera", "[ride] L'incasso è nostro! Pagate il vin brulé, e domani si rigioca: alla fiera si rigioca sempre."]], () => K.enterZone("ml_citta"), "ml_citta");
          F.set("ml_crediti", K.crediti() + 150); F.set("ml_battuta_borgofiera", true); F.set("ml_res_borgofiera", "v"); setStep(N, 2); bond("paese", 1); K.refreshZone();
          K.scene([["voce", "L'incasso della fiera è vostro: +150 crediti per il mercato. Il capitano del Borgofiera ti stringe la mano e ti regala un salame. Grosso."], ["voce", "Davanti al tendone, il Cavalier Ottone ha smesso di contrattare. Ti guarda. Sorride."]], () => K.enterZone("ml_citta"), "ml_citta");
        } });
    }
    function valfonda() {
      K.lavagna({ title: "Lavagna Tattica · Colle Alto contro Atletico Valfonda", oppId: "valfonda", opp: { name: K.TEAMS.valfonda.n, color: K.TEAMS.valfonda.c, ovr: K.TEAMS.valfonda.o, instr: "pressing", style: "pressing" }, scout: true,
        intro: "<p>La prima in classifica. Il Cavalier Ottone ha comprato mezze colline. Il Mago Pino ha scritto sul tovagliolo: «Pressing alto, sempre. Si batte con…» (il resto è una macchia di caffè).</p>", winTitle: "LA VALFONDA È CADUTA!" }, (r) => {
        if (!r.win && r.a < r.b) return K.scene([["ml_ottone", "[ride] Bella partita, Mister. Bella e persa. (Si sistema il garofano.) La Lega le concede la rivincita: io adoro vincere due volte."]], () => K.enterZone("ml_citta"), "ml_citta");
        setStep(N, 4); bond("fiducia", r.win ? 2 : 1); F.set("ml_giornata", 9);
        K.scene([["voce", r.win ? `${r.a} a ${r.b}: la Colle Alto batte la prima in classifica. Alla fiera, il salumiere taglia un salame intero, a fette grosse, e lo regala a tutti.` : `${r.a} a ${r.b}: un pareggio contro la prima in classifica. Il Cavalier Ottone, per la prima volta, non sorride.`], ["ml_ottone", r.win ? "[arrabbiato] (Il garofano gli cade dall'occhiello.) …Comprerò anche lei, Mister. Prima o poi." : "[pensa] Un punto a Colle Alto. Mi segno il nome, Mister."]], () => K.classifica("La Lega delle Colline · 9ª giornata", () => K.enterZone("ml_citta")), "ml_citta");
      });
    }
    const talk = {
      ml_pino() {
        if (S() === 0) return ask("ml_pino", "(Ha in mano un vin brulé e un tovagliolo.) Il mercato d'inverno. Lì dentro, sotto il tendone, ti vendono anche tua nonna, se la dipingi di rosso. Ma ci sono un paio di figurine buone: Samba, Gemma, Furio. Costano.", [
          { label: "Apri il mercato d'inverno", sub: `La bacheca · hai ${K.crediti()} crediti`, cls: "hot", fn: () => K.mercato({ title: "Il mercato d'inverno · Borgofiera", pool: ["ermes", "ines", "lucia", "ottavio", "furio", "gemma", "samba"] }, () => { setStep(N, 1); quest("ml_inverno", "Il mercato d'inverno", "L'amichevole della fiera, il Cavalier Ottone, la Valfonda."); done(); }) },
          { label: "Non ancora", fn: done },
        ], "ml_citta");
        if (S() === 3) return ask("ml_pino", "La Valfonda. Pressing alto, sempre, da tre anni. (Ti passa un tovagliolo. C'è disegnata una freccia lunga, dritta, dalla difesa all'attacco.) Capisci da solo. Vuoi rivedere il mercato, prima?", [
          { label: "Riapri il mercato", sub: `Hai ${K.crediti()} crediti`, fn: () => K.mercato({ title: "Il mercato d'inverno · ultime trattative", pool: ["ermes", "ines", "lucia", "ottavio", "furio", "gemma", "samba"] }, done) },
          { label: F.is("ml_all_2") ? "Allenamento già fatto" : "Allenamento sulla neve", sub: "+1 ai tre più deboli della rosa", disabled: F.is("ml_all_2"), fn: () => { const n = K.allenamento(1); F.set("ml_all_2", true); say([["ml_pino", `[ride] Sulla neve si impara a cadere. ${n.join(", ")} migliorano di un punto.`]]); } },
          { label: "Non ora", fn: done },
        ], "ml_citta");
        return say([["ml_pino", "Il mercato vero si fa al vin brulé, Mister."]]);
      },
      ml_fiera() {
        if (S() === 1) return ask("ml_fiera", "[ride] L'amichevole della fiera! Chi vince prende l'incasso, chi perde paga il vin brulé. Alla vecchia maniera: palla lunga e pedalare.", [{ label: "Gioca l'amichevole della fiera", sub: "Partita secondaria · scegli tu la modalità", big: true, fn: amichevole }, { label: "Non ancora", fn: done }], "ml_citta");
        if (S() === 3) return ask("ml_fiera", "Il campo della fiera è pronto per la Valfonda. Abbiamo anche tracciato le righe: dritte, stavolta.", [{ label: "Gioca contro l'Atletico Valfonda", sub: "Lavagna Tattica · la prima in classifica", cls: "hot", fn: valfonda }, { label: "Non ancora", fn: done }], "ml_citta");
        return say([["ml_fiera", "Palla lunga e pedalare, Mister. Il resto è salame tagliato sottile."]]);
      },
      ml_ottone() {
        if (S() === 2) return ask("ml_ottone", "[furbo] (Il garofano, il sorriso, l'assegno.) Mister! Che piacere. Vengo al punto: la sua capitana, Marta Fiore. Trecento crediti, subito. Con trecento crediti lei compra tre giocatori. Io ne compro una. Facciamo tutti un affare.", [
          { label: "«Marta non si vende»", sub: "Il paese con te", big: true, fn: () => ottone(false) },
          { label: "«Trecento crediti? Affare fatto»", sub: "+300 crediti · Marta va alla Valfonda", big: true, fn: () => ottone(true) },
        ], "ml_citta");
        return say([["ml_ottone", F.is("ml_ceduto_marta") ? "[ride] Marta sta benissimo, da noi. Le abbiamo dato un trattore." : "Ci vediamo in campo, Mister. Io porto i trattori."]]);
      },
      ml_marta() { return say([["ml_marta", S() >= 3 && F.is("ml_marta_resta") ? "[felice] Il Mister non mi ha venduta. Il Mister non mi ha venduta! (Lo racconta a tutta la fiera.)" : "Alla fiera ci vengo per i fiori secchi. E per il mercato, quest'anno."]]); },
      ml_bice() {
        if (S() === 4) return ask("ml_bice", "(Ha un sacchetto di castagne.) Ho visto la partita dal trattore del Cavalier Ottone. Lui non sapeva che fossi io. (Ride.) E adesso, Mister? Siamo a metà stagione.", [
          { label: "«Allenamento extra, tutti i giorni»", sub: "+2 ai tre più deboli della rosa", big: true, fn: () => fine2("allenamento") },
          { label: "«Una festa in piazza, per il paese»", sub: "Il paese con te", big: true, fn: () => fine2("festa") },
        ], "ml_citta");
        return say([["ml_bice", "Le castagne di Borgofiera sono le migliori. Non lo dica alla Valfonda."]]);
      },
    };
    function ottone(sell) {
      if (sell) { F.set("ml_ceduto_marta", true); F.set("ml_crediti", K.crediti() + 300); bond("paese", -2); bond("fiducia", 1); } else { F.set("ml_marta_resta", true); bond("paese", 2); bond("fiducia", 1); }
      setStep(N, 3); K.refreshZone();
      K.scene(sell ? [["ml_ottone", "[felice] Affare! (Firma l'assegno con una penna d'oro.) Marta Fiore, Atletico Valfonda. Le daremo un trattore."], ["voce", "Marta si toglie la fascia da capitana e te la consegna. Non dice niente. A Colle Alto, il campanile suona l'ora, e basta."]]
        : [["ml_ottone", "[arrabbiato] Non… si vende? (Il sorriso gli si incrina.) Tutto si vende, Mister. È solo questione di prezzo. (Si allontana verso i trattori.)"], ["ml_marta", "[sorpreso] (Ha sentito tutto, da dietro una bancarella di fiori secchi.) …Grazie, Mister. Contro la Valfonda corro il doppio."]], done, "ml_citta");
    }
    function fine2(kind) {
      if (kind === "allenamento") K.allenamento(2); else bond("paese", 2);
      const msg = K.reward("c2:ml", { coins: 70, cos: ["ml_c2"] }); finishChapter(N, kind); setStep(N, 5); questDone("ml_inverno");
      K.scene(kind === "allenamento" ? [["ml_bice", "[furbo] Allenamento tutti i giorni. In salita. (Ride.) I ragazzi la odieranno, Mister. Poi la ringrazieranno."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Lo spareggio».`]]
        : [["voce", "La sera, in piazza a Colle Alto: lucine, castagne, la banda che suona male e tutti che ballano bene. La squadra balla con il paese. Il Mago Pino, per la prima volta da anni, esce dal bar."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Lo spareggio».`]], () => K.openMain(), "ml_citta");
    }
    return { n: N, title: "Il mercato d'inverno", sub: "La fiera di Borgofiera, il Cavalier Ottone, la prima in classifica", goal, start: "ml_citta", introBg: "ml_citta", zones, talk,
      intro: () => [["voce", "<b>MASTER LEAGUE DELLE COLLINE</b>, capitolo 2. Gennaio. Sulle colline c'è la brina, e a Borgofiera c'è la fiera: salami, trattori e il mercato d'inverno della Lega."]] };
  }
  boot();
})();
