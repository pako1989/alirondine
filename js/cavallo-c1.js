// js/cavallo-c1.js - IL CAVALLO STAR · Capitolo 1 «Il provino»
// Lustrino: la collina delle star, le lettere giganti, il marciapiede con le stelle, la villa di Baldo Criniera con la piscina
// a forma di ferro di cavallo. L'agente Lucilla Bassotto ti porta al provino: Baldo cerca una spalla per il reboot di
// «Zoccoli d'Oro». Il provino si gira come una partita. Poi, al cancello, la prima giornalista.
(function () {
  "use strict";
  function boot() { const D = window.__cavallo; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("cs_baldo", { shape: "cavallo", acc: ["occhiali"], name: "Baldo Criniera", tag: "", hair: "#4a2a1a", skin: "#b07a4a", eye: "#3a2a1a", bg: ["#fff4f8", "#ff7aa8"], shirt: "#f0b8c8" },
      "Cavallo, cinquantadue anni. Negli anni '90 era il protagonista di «Zoccoli d'Oro», la sitcom sul calcio più vista del paese: il suo «Che zoccolata!» lo ripetevano tutti. Poi la serie è finita e lui no. Vanitoso, spaventato, a volte molto simpatico. Vuole tornare in onda per dimostrare che vale ancora qualcosa. A chi, non lo sa.");
    K.cast("cs_lucilla", { shape: "cane", acc: ["borsa"], name: "Lucilla Bassotto, agente", tag: "", hair: "#6a3a2a", skin: "#c8884a", eye: "#2a1a1a", bg: ["#fff4f8", "#a8d8f0"], shirt: "#a8d8f0" },
      "Bassotta, agente delle star di Lustrino. Ha quattro telefoni, due agende e nessuna pausa pranzo dal 2009. Rappresenta Baldo da trent'anni: dice che è il suo cliente peggiore e il suo preferito. Le due cose, dice, sono collegate.");
    K.cast("cs_ugo", { acc: ["cappellino"], name: "Ugo Divano", tag: "", hair: "#1a1a1a", style: "messy", skin: "#e8c4a0", eye: "#3a3a3a", bg: ["#fff4f8", "#ffe08a"], shirt: "#ffe08a" },
      "Vive sul divano di Baldo da quattro anni. Era venuto per una festa. Ha mille idee al giorno: un ristorante dove si mangia solo col cucchiaio, una lega di calcio per tartarughe, un musical sui parcheggi. Nessuna funziona. Lui è felice lo stesso.");
    K.cast("cs_nina", { acc: ["cappellino", "taccuino"], name: "Nina Flash, giornalista", tag: "", hair: "#c83a5a", style: "bob", skin: "#f0d0b0", eye: "#3a3a5a", bg: ["#fff4f8", "#f0c84a"], shirt: "#f0c84a" },
      "Giornalista della Gazzetta di Lustrino. Scrive i titoli prima di fare le domande: poi sceglie quello che va meglio. Non è cattiva: è solo velocissima.");
    K.cos("cs_c1", { kind: "shirt", label: "Giacca da set color confetto", val: "#f0b8c8", from: "Capitolo 1 di Il Cavallo Star" });
    K.cos("cs_vhs", { kind: "acc", label: "Occhiali da star", val: "occhiali", from: "Trova le cassette perdute di «Zoccoli d'Oro»" });
    K.lore("l_ciak", { t: "Ciak! Si Gioca", d: "La partita si gira a scene. Per ogni scena c'è il copione: puoi seguirlo, o improvvisare (più rischio, più applausi). Poi tocca CIAK! quando il segno è nella zona colorata. Le papere si rifanno finché hai dei ciak. Il regista dà le stelle: sono la reputazione. Vince chi segna di più." });
    K.lore("l_stampa", { t: "La Rassegna Stampa", d: "A Lustrino ogni cosa che dici finisce sul giornale, il giorno dopo. Fama e verità sono due cose diverse: a volte vanno insieme, quasi mai. I titoli si rileggono nel diario." });
    const goal = (s) => ({
      0: "Lustrino. L'agente Lucilla Bassotto ti aspetta sul marciapiede delle stelle.",
      1: "Il provino: la villa di Baldo Criniera, sulla collina, vicino alla piscina.",
      2: "Il provino è andato. Al cancello c'è una giornalista che vuole sapere tutto.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      cs_colle: {
        region: "lustrino", name: "Il Cavallo Star · La collina di Lustrino", short: "Lustrino", sub: "Le lettere giganti, il marciapiede delle stelle, la villa di Baldo", bg: "cs_colle", time: "giorno", travel: [4, 19],
        w: 32, h: 22, start: [4, 19], itemCos: "cs_vhs", items: [[2, 6], [29, 9], [13, 20]],
        areas: [[6, 1, 25, 4, "Le lettere di LUSTRINO"], [17, 7, 26, 16, "La villa di Baldo"], [0, 0, 31, 21, "Lustrino"]],
        flavor: { t: "Un albero potato a forma di statuetta d'oro. Il giardiniere si chiama Oscar. Coincidenze.", l: "Un lampione con un cartello: «Vietato fotografare il lampione». Tutti lo fotografano." },
        intro: [["voce", "Lustrino: una collina color confetto, le lettere giganti in cima, le ville con la piscina, un marciapiede di stelle dorate col nome di chi è stato famoso. Alcuni nomi sono stati grattati via."], ["voce", "Qui animali e persone lavorano insieme nella televisione da sempre. Il cavallo più famoso di tutti abita in cima alla collina. Da trent'anni aspetta che squilli il telefono."]],
        npcs: (s) => [{ id: "cs_lucilla", at: s === 0 ? [6, 19] : [15, 18] }, { id: "cs_ugo", at: [12, 12] }, ...(s === 2 ? [{ id: "cs_nina", at: [26, 18] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(6, 2, 13, 2, "Z"); lay(1, 18, 30, 19, "*"); lay(21, 12, 21, 17, ":"); lay(3, 9, 16, 9, ":"); lay(3, 9, 3, 17, ":");
          house(18, 8, 7, 4, { door: [21, 11], roof: "#ff9ec0", wall: "#fff4f8", rr: 2, enter: { to: "cs_villa", at: [7, 9] } });
          house(2, 12, 5, 3, { door: [4, 14], roof: "#a8d8f0", wall: "#fff8e8", rr: 1, enter: "La villa del vicino: un attore di pubblicità di dentifricio. Ha il sorriso più bianco di Lustrino e un cane che ride solo a comando." });
          house(26, 4, 4, 3, { door: [27, 6], roof: "#ffe08a", wall: "#f4e8f8", rr: 1, enter: "Lo chalet dei fotografi: dentro, quaranta macchine fotografiche e un divano. Nessuno ci dorme: si fotografano a vicenda mentre fingono di dormire." });
          lay(10, 13, 15, 15, "w"); put(9, 14, "s");
          [[1, 3], [16, 4], [28, 13], [7, 7], [30, 16], [24, 15]].forEach(([x, y]) => put(x, y, "P")); [[17, 17], [8, 16], [28, 10]].forEach(([x, y]) => put(x, y, "t")); [[19, 16], [11, 17]].forEach(([x, y]) => put(x, y, "l"));
        },
      },
      cs_villa: {
        interior: true, region: "interno", name: "Il Cavallo Star · La villa di Baldo", short: "La villa di Baldo", sub: "Trofei, foto, un divano con Ugo sopra", bg: "cs_villa", w: 16, h: 12, start: [7, 9], outside: ["cs_colle", 21, 12],
        act: { L: "Guarda i trofei", T: "Guarda il tavolino", A: "Guarda la foto", v: "Esci" },
        flavor: { L: "Trofei: «Miglior cavallo in una sitcom, 1994», «Miglior cavallo in una sitcom, 1995», «Miglior cavallo, 1996» (era l'unico candidato).", T: "Un tavolino di vetro con sopra un copione del reboot: «ZOCCOLI D'ORO - IL RITORNO. Episodio 1. Bozza 47»." },
        intro: [["voce", "La villa di Baldo: tutto rosa, tutto oro, tutto un po' polveroso. Alle pareti, foto di Baldo con tutti: con il sindaco, con un'astronauta, con un altro cavallo più famoso di lui (quella la tiene girata)."]],
        npcs: () => [{ id: "cs_baldo", at: [7, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(1, 1, 6, 1, "L"); lay(9, 1, 14, 1, "L"); lay(5, 7, 9, 7, "T"); put(13, 5, "A"); put(2, 5, "A"); },
      },
    };
    function provino() {
      K.ciakMatch({ title: "Ciak! Si Gioca · Il provino", minutes: 45, takes: 3, opp: { name: "Le Comparse", color: "#a8c8e8", players: [{ name: "Comparsa 1" }, { name: "Comparsa 2" }] },
        script: [{ k: "pari", t: "Baldo entra in scena e saluta un pubblico che non c'è. Tu lo guardi ammirato." }, { k: "noi", t: "Baldo ti passa la palla con lo zoccolo: tu tiri al volo. Gol." }, { k: "loro", t: "Le comparse ripartono e segnano. Baldo dice la sua battuta: «Che zoccolata!»" }, { k: "noi", t: "Ultima azione: tacco di Baldo, tuo tiro all'incrocio. Gol. Applausi registrati." }],
        intro: "<p>Il provino si gira nel giardino della villa. È una prova: tre <b>ciak</b> per rifare le papere. Prova a seguire il copione e, se te la senti, a <b>improvvisare</b>.</p>", winTitle: "PRESO! SEI LA NUOVA SPALLA!" }, (r) => {
        if (!r.win) return K.scene([["cs_baldo", "[pensa] Mmh. (Si guarda allo specchio da giardino.) Il problema non sei tu. Sono io che sono troppo bravo, e chi mi sta vicino sparisce. Rifacciamolo. Io resto bravo, tu prova a sparire meno."]], () => K.enterZone("cs_villa"), "cs_villa");
        setStep(N, 2); K.learnLore("l_ciak"); bond("baldo", 2);
        K.scene([["cs_baldo", "[felice] (Fa un giro su se stesso, come negli anni '90.) Sei preso! Sei la mia spalla. Cioè: io sono la star e tu sei… il resto. È un ruolo bellissimo. L'ho fatto anch'io, una volta, per due giorni."], ["cs_lucilla", "[furbo] (Entra con tre telefoni in mano.) Contratto firmato, conferenza stampa prenotata, foto già vendute. Ah: al cancello c'è Nina Flash della Gazzetta. Ti farà una domanda. Una sola. Pensaci bene."]], () => K.enterZone("cs_villa"), "cs_villa");
      });
    }
    function piscina() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["cs_ugo", r && r.win ? "[felice] Vinto! Idea: una lega di calcio in piscina. Si chiama «Calcio Bagnato». (Pausa.) Esiste già? Allora «Calcio Umido»." : "[ride] Perso, ma ho avuto un'idea: le porte gonfiabili. Così, quando perdi, le sgonfi e nessuno sa che hai perso."]], () => K.enterZone("cs_colle"), "cs_colle");
      ask("cs_ugo", "(Dal materassino gonfiabile.) Ehi! Sei quello del provino? Partitella a bordo piscina con i camerieri del catering? Ho già fatto le squadre: io e te contro tutti. Come la giochiamo?", [
        { label: "A Ciak! Si Gioca", sub: "La partita della saga, a scene", cls: "hot", fn: () => K.ciakMatch({ title: "Ciak! Si Gioca · La partitella in piscina", minutes: 30, takes: 2, mates: [{ name: "Ugo" }], opp: { name: "Il Catering", color: "#e8d8a8", players: [{ name: "Tartina" }, { name: "Vol-au-vent" }] },
          script: [{ k: "pari", t: "Ugo spiega le regole: sono diverse ogni minuto." }, { k: "noi", t: "Ugo lancia, tu calci in piscina. Il pallone rimbalza sul materassino ed entra: gol." }, { k: "loro", t: "Il catering contrattacca con un vassoio di tartine. Gol loro." }] }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "cs_piscina", alt: "az,cage,hd", force: false, oppTeam: "Il Catering", oppColor: "#e8d8a8", us: "Zoccoli d'Oro", homeKit: ["#f0b8c8", "#ffe08a"], mate: "Ugo", squad: ["Ugo", "Baldo", "Lucilla"], chap: "Il Cavallo Star · La partitella in piscina", bg: "cs_colle", oppNames: ["Tartina", "Vol-au-vent", "Bignè", "Canapè", "Il Maître"], intro: "A bordo piscina, sulla collina di Lustrino.", done: after }) },
        { label: "Dopo", fn: done },
      ], "cs_colle");
    }
    const talk = {
      cs_lucilla() {
        const s = S();
        if (s === 0) return K.scene([["cs_lucilla", "[furbo] (Parla con due telefoni insieme.) Sì, è qui. No, non è famoso. Sì, sa giocare. (Ti guarda.) Tu sei quello che sa giocare davvero, vero? Bene. Baldo Criniera cerca una spalla per il reboot di «Zoccoli d'Oro». La sitcom sul calcio. Quella del «Che zoccolata!»."], ["cs_lucilla", "Il provino è adesso, nella villa in cima alla collina. Consiglio: lui deve sembrare il più bravo. Tu devi essere il più bravo. È un equilibrio delicato. Come tutto a Lustrino."]], () => { setStep(N, 1); quest("cs_provino", "Il provino", "La villa di Baldo Criniera, in cima alla collina."); done(); }, "cs_colle");
        return say([["cs_lucilla", s >= 2 ? "Una domanda sola, al cancello. Le domande sole sono le più pericolose." : "Vai, vai. Io intanto vendo i diritti della tua biografia. Non l'hai ancora scritta? Meglio: costa meno."]]);
      },
      cs_baldo() {
        const s = S();
        if (s === 1) return ask("cs_baldo", "(Si gira lentamente, come in una scena girata al rallentatore.) Ah. La spalla. (Ti squadra.) Hai il physique du rôle. Ce l'avevo anch'io. Ce l'ho ancora, eh. (Si guarda allo specchio.) Il provino si gira in giardino, come una partita vera: io leggo il copione, tu giochi. Pronto?", [{ label: "Gira il provino", sub: "Ciak! Si Gioca · partita importante", cls: "hot", fn: provino }, { label: "Non ancora", fn: done }], "cs_villa");
        return say([["cs_baldo", s >= 2 ? "[pensa] Cosa dirai alla giornalista? (Finge di non essere interessato. È interessatissimo.)" : "Che zoccolata. (Lo dice piano, per allenarsi.)"]]);
      },
      cs_ugo() {
        if (S() >= 1) return piscina();
        return say([["cs_ugo", "Ciao! Abito sul divano di Baldo. Sì, il divano è dentro. Io adesso sono fuori. È complicato."]]);
      },
      cs_nina() {
        if (S() === 2) return ask("cs_nina", "(Il taccuino è già pieno di titoli. Ne ha scritti tre, aspetta di sapere quale usare.) Nina Flash, Gazzetta di Lustrino. Una domanda sola: Baldo Criniera è ancora bravo, o è finito?", [
          { label: "«È bravo. E ha paura. Le due cose insieme»", sub: "La verità", big: true, fn: () => fine1("onesto") },
          { label: "«È il più grande di sempre!»", sub: "Quello che vogliono sentire", big: true, fn: () => fine1("lodi") },
        ], "cs_colle");
        return say([["cs_nina", "Titolo pronto. Mi manca solo la notizia."]]);
      },
    };
    function fine1(kind) {
      F.set(kind === "onesto" ? "cs_onesto" : "cs_lodi", true); questDone("cs_provino");
      const msg = K.reward("c1:cs", { coins: 70, cos: ["cs_c1"] }); finishChapter(N, kind); setStep(N, 5); K.learnLore("l_stampa");
      K.stampa(kind, kind === "onesto" ? { verita: 3, fama: 1 } : { fama: 3 }, () => K.scene(kind === "onesto" ? [["cs_baldo", "[triste] (Ha il giornale in mano. Lo legge tre volte.) «Ha paura». (Pausa lunghissima.) È vero. Nessuno l'aveva mai scritto. (Lo piega e lo mette nella tasca della giacca, vicino al cuore. Poi lo tira fuori e lo incornicia.)"], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il set».`]]
        : [["cs_baldo", "[felice] (Incornicia il giornale. Poi ne compra altre cento copie.) «Il più grande di sempre». Lo sapevo. Lo sapevo! (Pausa.) Lo pensi davvero? (Non aspetta la risposta.)"], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il set».`]], () => K.openMain(), "cs_villa"));
    }
    return { n: N, title: "Il provino", sub: "Lustrino, l'agente Lucilla, il provino in giardino, la prima domanda", goal, start: "cs_colle", introBg: "cs_titolo", zones, talk,
      intro: () => [["voce", "<b>IL CAVALLO STAR</b>. Episodio 1. «Zoccoli d'Oro» è stata la sitcom sul calcio più vista degli anni '90. Il protagonista era un cavallo. La serie è finita nel 1998. Il cavallo no."]] };
  }
  boot();
})();
