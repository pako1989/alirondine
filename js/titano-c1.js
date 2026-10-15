// js/titano-c1.js - IL FIGLIO DEL TITANO · Capitolo 1 «Il primo volo»
// Altamira, una città normale con una squadra normale. Poi, in una partita normale, il Campione salta per un colpo di testa
// e non torna giù. Suo padre, Atlante Varo, ex leggenda del calcio, sorride come chi aspettava questo giorno da sempre.
(function () {
  "use strict";
  function boot() { const D = window.__titano; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("ft_atlante", { beard: "incolta", acc: [], name: "Atlante Varo, il Titano", tag: "", hair: "#2a1a14", style: "slick", skin: "#d9a679", eye: "#3a6ac8", bg: ["#14183a", "#c83a2a"], shirt: "#c83a2a" },
      "Tuo padre. Vent'anni fa era il calciatore più forte del mondo: lo chiamavano il Titano, perché saltava più in alto della traversa. Poi si è ritirato, ha aperto un negozio di articoli sportivi e ha smesso di saltare. Dice.");
    K.cast("ft_nora", { acc: ["fischietto"], name: "Nora Varo", tag: "", hair: "#8a3a2a", style: "bob", skin: "#f0d0b0", eye: "#3a5a3a", bg: ["#14183a", "#3a8a5a"], shirt: "#3a8a5a" },
      "Tua madre. Allena la squadra femminile di Altamira, fa i conti del negozio e risolve le cose prima che diventino problemi. Ha sposato un Titano: niente la sorprende. Quasi niente.");
    K.cast("ft_sam", { acc: ["cuffie"], name: "Sam Okoro", tag: "", hair: "#1a1a1a", style: "curly", skin: "#8a5a3a", eye: "#2a1a0a", bg: ["#14183a", "#3a6ac8"], shirt: "#3a6ac8" },
      "Il tuo migliore amico e il terzino dell'Altamira. Non vola, non ha poteri, e non gli importa: dice che qualcuno, in squadra, deve restare con i piedi per terra. Letteralmente.");
    K.cast("ft_cecile", { acc: ["occhiali"], name: "Cecile Arden, direttrice dell'Agenzia Celeste", tag: "gray", hair: "#c8c8d0", style: "ordinato", skin: "#f4dcc8", eye: "#4a4a6a", bg: ["#14183a", "#3a6ac8"], shirt: "#2a2e4a" },
      "Dirige l'Agenzia Celeste, quella che si occupa delle cose che cadono dal cielo. Parla poco, prende appunti su un tablet, e sa di tuo padre più di quanto dica.");
    K.cast("ft_fulmine", { streak: "#f2c14e", acc: ["visiera"], name: "Capitan Fulmine dell'Agenzia", tag: "", hair: "#e8d08a", style: "spiky", skin: "#e8c4a0", eye: "#3a6ac8", bg: ["#14183a", "#3a6ac8"], shirt: "#3a6ac8" },
      "Il capitano della squadra dell'Agenzia, i Fulmini. Corre veloce come il suo nome e non lo dimentica mai, nemmeno quando dorme.");
    K.cos("ft_c1", { kind: "shirt", label: "Tuta rossa del Titano", val: "#c83a2a", from: "Capitolo 1 di Il Figlio del Titano" });
    K.cos("ft_anelli1", { kind: "acc", label: "Anello di nuvola", val: "medaglia", from: "Trova gli anelli di nuvola del cielo di Altamira" });
    K.lore("l_volo", { t: "Volo a Tutto Campo", d: "In cielo si gioca a tempo fermo: disegni col dito la traiettoria, poi si vola. Più è lunga, più energia costa; se è lunghissima diventa supersonica e sfonda un contrasto. Le linee rosse dicono dove ti taglieranno la strada. In difesa, incrocia la loro traiettoria nello stesso attimo." });
    K.lore("l_elyon", { t: "Elyon", d: "Il pianeta da cui viene tuo padre. Un mondo di Titani del cielo, dove il calcio si gioca fra le nuvole e una partita può durare un anno. Sulla Terra non lo conosce nessuno. Quasi nessuno." });
    const goal = (s) => ({
      0: "Il Campo Sud di Altamira, dopo la partita. Tutti parlano del tuo colpo di testa. Anche Sam.",
      1: "Tuo padre ti aspetta a casa. Dice che deve dirti una cosa «di famiglia».",
      2: "Il primo volo, sopra Altamira: segui tuo padre fra le nuvole (la scala a nord del parco).",
      3: "Una donna con un tablet ti aspetta al Campo Sud. Dice di chiamarsi Cecile Arden.",
      4: "Hai battuto i Fulmini. Cecile vuole una risposta.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      ft_citta: {
        region: "citta", name: "Il Figlio del Titano · Altamira", short: "Altamira", sub: "Il Campo Sud, il negozio dei Varo, l'Agenzia Celeste", bg: "ft_citta", time: "giorno", travel: [16, 19],
        w: 34, h: 24, start: [16, 19],
        areas: [[4, 13, 15, 21, "Il Campo Sud"], [0, 0, 33, 23, "Altamira"]],
        flavor: { l: "Un lampione con un adesivo: «IL TITANO VIVE». Qualcuno ci ha disegnato due baffi." },
        intro: [["voce", "Altamira: palazzi bassi, un parco, il Campo Sud con le tribune di legno. Una città normale. Oggi, però, tutti guardano il cielo."], ["voce", "Al novantesimo, su un calcio d'angolo, sei saltato per un colpo di testa. E sei rimasto lassù. Tre secondi. Davanti a duecento persone e a una telecamera del telegiornale locale."]],
        npcs: (s) => [{ id: "ft_sam", at: [10, 17] }, ...(s >= 3 ? [{ id: "ft_cecile", at: [14, 12] }, { id: "ft_fulmine", at: [8, 12] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(0, 0, 0, 23, "t"); lay(33, 0, 33, 23, "t"); lay(0, 23, 33, 23, "a");
          lay(1, 22, 32, 22, ":"); lay(16, 1, 16, 21, ":"); lay(1, 11, 32, 12, ":"); put(16, 0, "^");
          lay(4, 13, 15, 21, ","); [[4, 17], [15, 17]].forEach(([x, y]) => put(x, y, "f"));
          house(20, 14, 7, 4, { door: [23, 17], roof: "#c83a2a", wall: "#e8dcc8", rr: 2, enter: { to: "ft_casa", at: [7, 9] } });
          house(20, 3, 9, 5, { door: [24, 7], roof: "#3a6ac8", wall: "#d8dce8", rr: 2, enter: "L'Agenzia Celeste: vetri a specchio, una portineria vuota, un cartello «Si riceve solo su appuntamento. O se cadete dal cielo»." });
          house(3, 3, 6, 4, { door: [5, 6], roof: "#8a6a3a", wall: "#e8dcc8", rr: 2, enter: "«Varo Sport», il negozio di tuo padre: palloni, scarpe, e in vetrina una maglia con il numero 1, firmata «Il Titano». Non è in vendita." });
          [[11, 3], [13, 6], [30, 9], [29, 16], [2, 9], [31, 20], [18, 20]].forEach(([x, y]) => put(x, y, "t")); [[12, 11], [27, 12]].forEach(([x, y]) => put(x, y, "l")); put(18, 18, "s");
        },
      },
      ft_casa: {
        interior: true, region: "casa", name: "Il Figlio del Titano · Casa Varo", short: "Casa Varo", sub: "La cucina, il divano, una foto che non hai mai capito", bg: "ft_casa", w: 16, h: 12, start: [7, 9], outside: ["ft_citta", 23, 18],
        act: { T: "Guarda il tavolo", B: "Guarda il divano", W: "Guarda la finestra", v: "Esci" },
        flavor: { T: "La tavola è apparecchiata per tre. Al posto di tuo padre, un piatto enorme: mangia per quattro, da sempre.", W: "Dalla finestra si vede il cielo. Tuo padre ci guarda spesso, la sera, come chi aspetta una lettera." },
        intro: [["voce", "Casa Varo: odore di sugo, la radio accesa, una foto sulla mensola che hai visto mille volte. Tuo padre giovane, in mezzo a un cielo stranissimo, con due soli."]],
        npcs: (s) => [{ id: "ft_atlante", at: [5, 4] }, { id: "ft_nora", at: [11, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(6, 6, 9, 6, "T"); lay(2, 1, 4, 1, "B"); put(12, 0, "W"); },
      },
      ft_cielo: {
        region: "cielo", name: "Il Figlio del Titano · Il cielo di Altamira", short: "Il cielo", sub: "Nuvole, vento, e la città piccola piccola laggiù", bg: "ft_cielo", time: "giorno", travel: [16, 20],
        w: 34, h: 23, start: [16, 20], itemCos: "ft_anelli1", items: [[3, 3], [30, 4], [5, 17], [28, 18]],
        intro: [["voce", "Il cielo sopra Altamira. Le nuvole, da vicino, sono più grandi delle case. Il vento ti spinge, ti gira, ti solleva. Non hai paura. Quasi."]],
        npcs: (s) => (s === 2 ? [{ id: "ft_atlante", at: [16, 9] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 22, "&"); lay(0, 0, 33, 0, "C"); lay(0, 0, 0, 22, "C"); lay(33, 0, 33, 22, "C"); lay(0, 22, 33, 22, "C"); put(16, 22, "v");
          [[6, 6, 9, 8], [22, 5, 26, 7], [10, 13, 13, 15], [21, 14, 24, 16], [2, 10, 3, 12], [29, 10, 31, 11]].forEach(([a, b, c, d]) => lay(a, b, c, d, "C"));
        },
      },
    };
    function primoVolo() {
      // la prima scelta a tempo: se esiti, risponde il silenzio
      ask("ft_atlante", "(Sospeso in aria accanto a te, a braccia conserte, come se fosse seduto su una sedia invisibile.) Ecco. Adesso lo sai. Sei un Titano, come me. I Titani non hanno paura dell'altezza. Tu hai paura?", [
        { label: "«No. Neanche un po'.»", fn: () => risposta("coraggio") },
        { label: "«Sì. Tanta.»", fn: () => risposta("paura") },
        { label: "(…stai zitto, guardi giù)", sub: "Se non rispondi in tempo, rispondi così", fn: () => risposta("silenzio") },
      ], "ft_cielo", { secs: 8, def: 2 });
      function risposta(k) {
        F.set("ft_primo", k); if (k === "paura") bond("famiglia", 2); else if (k === "coraggio") bond("cielo", 2); else bond("famiglia", 1);
        const l = { coraggio: "[ride] Bugiardo. Anch'io avevo una paura terribile, la prima volta. Ma va bene così: il coraggio si finge, finché non arriva.", paura: "[felice] (Ti mette una mano sulla spalla.) Bene. Chi ha paura sta attento. Chi sta attento, vola meglio di chi non ha paura.", silenzio: "[pensa] (Aspetta. Non dice niente nemmeno lui. Poi, piano:) Il silenzio è una risposta onesta. Il cielo è grande. Lo si guarda prima di parlarne." }[k];
        setStep(N, 3); K.learnLore("l_elyon"); F.set("ft_tuta", true);
        K.scene([["ft_atlante", l], ["ft_atlante", "Un'ultima cosa. (Ti lancia una tuta rossa, ripiegata.) Tua madre l'ha cucita sedici anni fa, «per quando servirà». Adesso serve. Torna giù: ti aspetta qualcuno, al Campo Sud. Una che fa troppe domande."]], () => go("ft_citta", 16, 13), "ft_cielo");
      }
    }
    function matchFulmini() {
      K.volo({ title: "Volo a Tutto Campo · Il test dell'Agenzia contro i Fulmini", oppStyle: "pressing", minutes: 60,
        mates: [{ name: "Sam" }], opp: { name: "I Fulmini dell'Agenzia", color: "#3a6ac8", players: [{ name: "Capitan Fulmine", skin: "#e8c4a0", hair: "#e8d08a" }, { name: "Tuono", skin: "#c68642", hair: "#1a1a1a" }], keeper: { name: "Parafulmine" } },
        intro: "<p>Un test in cielo, sopra il Campo Sud. I Fulmini volano con i jetpack dell'Agenzia e fanno <b>pressing</b>: guarda le linee rosse prima di partire, e finisci il volo lontano dal portiere.</p>", winTitle: "IL TITANO SUPERA IL TEST!" }, (r) => {
        if (!r.win) return K.scene([["ft_cecile", "[pensa] (Scrive sul tablet.) Promettente. Non ancora pronto. Ripetiamo il test quando vuole."]], () => K.enterZone("ft_citta"), "ft_citta");
        setStep(N, 4); K.learnLore("l_volo"); bond("cielo", 1);
        K.scene([["ft_fulmine", "[sorpreso] (Atterra con il jetpack fumante.) Ha… ha girato intorno a me. Due volte. Senza motore."], ["ft_cecile", "[pensa] (Chiude il tablet.) Interessante. Esattamente come suo padre, vent'anni fa. (Ti guarda.) Vorrei farle una proposta."]], () => K.enterZone("ft_citta"), "ft_citta");
      });
    }
    function partitella() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["ft_sam", r && r.win ? "[ride] Con i piedi per terra o in volo, vinciamo uguale. Bello." : "[ride] Anche i Titani perdono, eh? Mi sento meglio."]], () => K.enterZone("ft_citta"), "ft_citta");
      ask("ft_sam", "Una partitella al Campo Sud, come prima che tu diventassi un aeroplano? Come la giochiamo?", [
        { label: "In volo", sub: "Volo a Tutto Campo · la partita della saga", cls: "hot", fn: () => K.volo({ title: "Volo a Tutto Campo · Partitella sopra il Campo Sud", oppStyle: "equilibrata", minutes: 45, mates: [{ name: "Sam" }], opp: { name: "Le riserve dell'Altamira", color: "#3a8a5a", players: [{ name: "Pino" }, { name: "Gina" }], keeper: { name: "Baffo" } } }, after) },
        { label: "Con i piedi per terra", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "ft_partitella", alt: "az,cage,hd", force: false, oppTeam: "Le riserve", oppColor: "#3a8a5a", us: "Altamira", homeKit: ["#c83a2a", "#ffd23f"], mate: "Sam Okoro", squad: ["Sam Okoro", "Pino", "Gina"], chap: "Il Figlio del Titano · Partitella al Campo Sud", bg: "ft_citta", oppNames: ["Baffo", "Ruota", "Treno", "Sasso", "Lampo"], intro: "Al Campo Sud, come una volta: niente voli, solo calcio.", done: after }) },
        { label: "Dopo", fn: done },
      ], "ft_citta");
    }
    const talk = {
      ft_sam() {
        const s = S();
        if (s === 0) return K.scene([["ft_sam", "[sorpreso] Tre secondi. Sei rimasto lassù TRE SECONDI. Ho contato. (Si tocca la fronte.) Il telegiornale ha detto «un salto eccezionale». Io dico che hai VOLATO."], ["ft_sam", "[pensa] Tuo padre era in tribuna. Non ha detto niente. Ha solo sorriso, come chi aspettava questo giorno da sempre. Vai a casa, dai. Io aspetto qui: se scopri di essere un alieno, me lo dici per primo."]], () => { setStep(N, 1); quest("ft_casa", "Una cosa di famiglia", "Tuo padre ti aspetta a casa, la casa col tetto rosso."); done(); }, "ft_citta");
        return ask("ft_sam", s >= 3 ? "[furbo] Un'agenzia segreta! Al Campo Sud! Ti avevo detto che eri un alieno. (Ti guarda.) Una partitella, intanto?" : "Allora? Alieno o no?", [{ label: "Partitella al Campo Sud", sub: "Partita secondaria · scegli tu la modalità", fn: partitella }, { label: "Dopo", fn: done }], "ft_citta");
      },
      ft_atlante() {
        const s = S();
        if (s === 1) return K.scene([["ft_atlante", "[pensa] (Spegne la radio.) Siediti. (Si siede anche lui; la sedia scricchiola.) Quel salto, oggi. Non era un salto."], ["ft_atlante", "Vengo da un posto che si chiama Elyon. Un pianeta lontano, dove la gente vola e il calcio si gioca fra le nuvole. Sono arrivato qui vent'anni fa. Ho conosciuto tua madre a una partita. Sono rimasto."], ["ft_nora", "[ride] (Dalla cucina.) È rimasto perché perdeva sempre a carte con me e voleva la rivincita."], ["ft_atlante", "[felice] Anche. (Si alza.) Domani mattina, prima di colazione, ti porto su. Sopra le nuvole. La scala d'emergenza del parco, quella che non usa nessuno. Si comincia da lì."]], () => { setStep(N, 2); questDone("ft_casa"); quest("ft_volo", "Il primo volo", "Sopra le nuvole, con tuo padre: la scala a nord del parco."); bond("famiglia", 1); done(); }, "ft_casa");
        if (s === 2 && K.api.trZone() === "ft_cielo") return primoVolo();
        return say([["ft_atlante", s === 2 ? "La scala a nord del parco. Ti aspetto lassù." : "[ride] Il cielo è grande, figliolo. Ma la cena è alle otto."]]);
      },
      ft_nora() { return say([["ft_nora", S() >= 3 ? "[pensa] (Ti guarda la tuta rossa.) Sedici anni fa ho preso le misure a occhio. (Sorride.) Ti sta perfetta. Lo sapevo." : "Tuo padre deve dirti una cosa. Io la so già. Ascoltalo fino in fondo, anche quando ti sembra matto."]]); },
      ft_cecile() {
        const s = S();
        if (s === 3) return ask("ft_cecile", "(Tablet in mano, occhiali sulla punta del naso.) Cecile Arden, Agenzia Celeste. Ci occupiamo di cose che cadono dal cielo. E, da oggi, di cose che ci salgono. Le propongo un test: una partita in volo contro la nostra squadra, i Fulmini.", [{ label: "Accetta il test", sub: "Volo a Tutto Campo · partita importante", cls: "hot", fn: matchFulmini }, { label: "Non ancora", fn: done }], "ft_citta");
        if (s === 4) return ask("ft_cecile", "L'Agenzia vorrebbe lavorare con lei. Addestramento, un tesserino, una squadra. Suo padre, vent'anni fa, ha detto di no. (Pausa.) Lei?", [
          { label: "«Entro nell'Agenzia»", sub: "Una squadra, delle regole, un tesserino", big: true, fn: () => fine1("agenzia") },
          { label: "«Mi allena mio padre»", sub: "La famiglia prima di tutto", big: true, fn: () => fine1("padre") },
        ], "ft_citta");
        return say([["ft_cecile", "(Scrive. Non alza gli occhi.)"]]);
      },
      ft_fulmine() { return say([["ft_fulmine", S() >= 4 ? "[ride] La prossima volta ti batto. Ho un jetpack nuovo. Più rosso." : "Pronto per il test, Titano junior?"]]); },
    };
    function fine1(kind) {
      if (kind === "agenzia") { F.set("ft_agenzia", true); bond("cielo", 2); } else { F.set("ft_con_padre", true); bond("famiglia", 2); }
      const msg = K.reward("c1:ft", { coins: 70, cos: ["ft_c1"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "agenzia" ? [["ft_cecile", "[felice] (Ti porge un tesserino.) Benvenuto nell'Agenzia Celeste. (Abbassa la voce.) E un consiglio: chieda a suo padre perché è venuto sulla Terra. Glielo abbiamo chiesto per vent'anni. Non ha mai risposto."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il segreto del Titano».`]]
        : [["ft_atlante", "[felice] (Dalla tribuna, ha sentito tutto.) Mi allena mio padre. (Si schiarisce la voce.) Bene. Domani alle sei. Sopra le nuvole fa freddo: mettiti la maglia della salute."], ["ft_cecile", "[pensa] Come vuole. (Se ne va, poi si volta.) Chieda a suo padre perché è venuto sulla Terra. Noi non l'abbiamo mai saputo."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il segreto del Titano».`]], () => K.openMain(), "ft_citta");
    }
    const obj = {
      "ft_citta:^": () => (S() >= 2 ? go("ft_cielo", 16, 20) : say([["voce", "La scala d'emergenza del parco: sale, sale, e finisce nel vuoto. Nessuno la usa. Per ora non hai motivo di salire."]])),
      "ft_cielo:v": () => go("ft_citta", 16, 1),
    };
    return { n: N, title: "Il primo volo", sub: "Il colpo di testa, il segreto di famiglia, il test dell'Agenzia", goal, start: "ft_citta", introBg: "ft_titolo", zones, talk, obj,
      intro: () => [["voce", "<b>IL FIGLIO DEL TITANO.</b> Episodio 1. Ogni supereroe ha un primo giorno. Il tuo comincia con un calcio d'angolo al novantesimo."]] };
  }
  boot();
})();
