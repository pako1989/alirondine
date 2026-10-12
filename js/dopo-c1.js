// js/dopo-c1.js - DOPO IL CAMPIONE · Capitolo 1 «Il campo di terra»
// Valdorsa, il giorno dopo il funerale del Capitano. La casa di Bruno (si entra), il Bar Sport (si entra), la scatola di latta
// con tre ricordi. Il vecchio campo di terra: tre echi da toccare, poi «con gli occhi di Ada» il campo torna al 1928
// e si rigioca la prima partita della storia di Valdorsa, in bianco e nero (Epoche · 1928).
(function () {
  "use strict";
  function boot() { const D = window.__dopo; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("ep_ada", { name: "Ada Lunetta", tag: "", hair: "#d8d8e8", style: "codino", skin: "#f2e2d4", eye: "#5a7aa8", bg: ["#2a2a3a", "#e8b86a"], shirt: "#3a5a3a" },
      "Portiera del Valdorsa nel 1928. Ha ancora vent'anni, da quasi ottanta. Nessuno sa perché, nemmeno lei: un giorno ha smesso di invecchiare, e il mondo ha continuato senza aspettarla. Parla poco, ricorda tutto e capisce tardi.");
    K.cast("ep_bruno", { name: "Bruno Arcieri, 1928", tag: "", hair: "#3a2a1a", style: "messy", skin: "#e8c4a0", eye: "#4a3a2a", bg: ["#3a2a20", "#7a2a2a"], shirt: "#7a2a2a" },
      "Il Capitano a diciott'anni: le scarpe del padre, la maglia granata cucita dalla madre, un sorriso che arriva prima di lui. Ancora non sa che diventerà una leggenda. Sa solo che vuole giocare.");
    K.cast("ep_tecla", { name: "Tecla Arcieri", tag: "", hair: "#6a3a2a", style: "bun", skin: "#e8c8a8", eye: "#4a3a2a", glasses: true, bg: ["#3a2a20", "#e8b86a"], shirt: "#5a4a6a" },
      "La nipote del Capitano. Fa la bibliotecaria a Bologna, è tornata per il funerale. Ha trovato in soffitta una scatola di latta con scritto «per Ada». Non l'ha aperta.");
    K.cast("ep_carlo", { name: "Carlo del Bar Sport", tag: "gray", hair: "#e0e0e0", style: "buzz", skin: "#d9a679", eye: "#3a3a2a", bg: ["#3a2a20", "#c8a87a"], shirt: "#6a5a4a", beard: true },
      "Gestisce il Bar Sport di Valdorsa da sessant'anni. Ha visto giocare il Capitano dal 1952 in poi. Il suo caffè è terribile, le sue storie no.");
    K.cast("ep_nino", { name: "Nino Fava", tag: "", hair: "#e8a040", style: "spiky", skin: "#f0d0b0", eye: "#3a6a8a", bg: ["#7a2a2a", "#f4ecdc"], shirt: "#7a2a2a" },
      "Attaccante della nuova squadra di Valdorsa. Parla più veloce di quanto corra, e corre veloce. Crede che Ada sia un fantasma. Lo spera, un po'.");
    K.cast("ep_lia", { name: "Lia Sereni", tag: "", hair: "#1a1a2a", style: "long", skin: "#d9a679", eye: "#2a4a3a", bg: ["#7a2a2a", "#f4ecdc"], shirt: "#7a2a2a" },
      "Portiera della nuova squadra di Valdorsa. Seria, precisa, si allena da sola all'alba. Vuole parare come Ada. Non vuole che Ada lo sappia.");
    K.cast("ep_gelindo", { name: "Gelindo delle Fornaci, 1928", tag: "", hair: "#1a1a1a", style: "buzz", skin: "#c68642", eye: "#2a2a2a", bg: ["#3a2a20", "#5a5a62"], shirt: "#5a5a62", beard: true },
      "Capitano delle Fornaci, la squadra dei mattonai. Spalle larghe come un forno, mani piene di calce. Il primo avversario della storia del Valdorsa.");

    K.cos("ep_c1", { kind: "shirt", label: "Maglia granata del 1928", val: "#7a2a2a", from: "Completa il Capitolo 1 di Dopo il Campione" });
    K.cos("ep_foglia", { kind: "hairc", label: "Capelli Foglia d'autunno", val: "#c8742a", from: "Trova tutte le foglie d'oro di Valdorsa" });
    K.cos("ep_berretto28", { kind: "acc", label: "Stemma del Valdorsa 1928", val: "#e8b86a", from: "Il campo di terra, la sera" });
    K.lore("l_scatola", { t: "La scatola di latta", d: "In soffitta, una scatola di latta di biscotti con scritto a matita «per Ada». Dentro: una foto del 1928, un biglietto della Coppa del Mare 1974, un gettone da sala giochi del 1989. Nient'altro. Tre luoghi, tre epoche." });
    K.lore("l_1928", { t: "Valdorsa–Fornaci, 1928", d: "La prima partita ufficiale del Valdorsa, il 14 ottobre 1928, sul campo di terra dietro la chiesa. Pioveva. Il pallone di cuoio pesava come un sasso. Finì con un gol di Bruno da metà campo, dicono. Dicono tante cose." });
    K.lore("l_eco1", { t: "Eco · «Allora gioco da ragazzo»", d: "Bruno, diciott'anni: «Ci manca il portiere. Le ragazze non giocano, lo sanno tutti». Ada: «Allora gioco da ragazzo». Lui ride per un minuto intero. Poi le dà la sua maglia." });
    K.lore("l_eco2", { t: "Eco · Il pallone bagnato", d: "Il pallone di cuoio, inzuppato di pioggia, pesa il doppio. Bruno lo calcia e si fa male al piede. Non lo dice a nessuno. Ada se ne accorge. Non lo dice a nessuno neanche lei." });
    K.lore("l_eco3", { t: "Eco · Il coltello e la quercia", d: "Dopo la partita, al buio, Bruno incide qualcosa sulla corteccia della quercia con un coltellino. Ada lo vede da lontano. Non va a guardare. Per ottant'anni." });

    const goal = (s) => ({
      0: "Valdorsa, il giorno dopo il funerale. Ada ti aspetta in piazza, vicino alla fontana.",
      1: "Tecla, la nipote del Capitano, è nella casa di Bruno (in alto a sinistra). Ha qualcosa per Ada.",
      2: "Il vecchio campo di terra è a est del paese. Cerca gli echi (punti luminosi) e parla con Ada sotto la quercia.",
      3: "Con gli occhi di Ada è di nuovo il 1928. Il giovane Bruno è a centrocampo.",
      4: "Il campo è tornato quello di oggi. Ada è sotto la quercia.",
    }[s] || "Capitolo concluso. Il prossimo ricordo ti aspetta dal menu.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(34,26,20,.85)"); R(g, x - w / 2, y + 2, w, 1, "#e8b86a"); g.fillStyle = "#f4ecdc"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }

    const zones = {
      ep_valdorsa: {
        region: "valdorsa", name: "Dopo il Campione · Valdorsa", short: "Valdorsa", sub: "Un paese di collina, in autunno", bg: "ep_valdorsa", time: "tramonto", travel: [2, 12],
        w: 40, h: 26, start: [2, 12], itemCos: "ep_foglia", items: [[2, 22], [37, 3], [20, 22], [33, 20]],
        areas: [[4, 3, 11, 8, "La casa del Capitano"], [26, 3, 34, 8, "Bar Sport"], [14, 9, 26, 17, "La piazza"], [0, 0, 39, 25, "Valdorsa"]],
        act: { n: "Leggi il manifesto", l: "Guarda il lampione", b: "Siediti", t: "Guarda l'albero", w: "Guarda la fontana", p: "Guarda il campanile", q: "Entra", ">": "Vai al vecchio campo" },
        flavor: {
          n: ["Manifesto funebre, già un po' scolorito dalla pioggia: «BRUNO ARCIERI · IL CAPITANO · 1910–2004 · Valdorsa ringrazia». Sotto, qualcuno ha attaccato un biglietto del tram: «per l'ultima trasferta».", "Bacheca del Valdorsa: «Cercasi portiere per la squadra giovanile. Rivolgersi a Lia Sereni (la portiera c'è già, ma ne serve un'altra per allenarsi)»."],
          l: "Un lampione di ferro battuto. Ci hanno legato una sciarpa granata, nodo stretto, come si fa con le cose che non si vogliono perdere.",
          b: "Ti siedi. Le foglie cadono piano. Una ti finisce in mano, gialla, perfetta. Sembra messa lì apposta.",
          t: "Un castagno. Sotto, i ricci aperti. Qualcuno ha raccolto le castagne e lasciato i ricci a fare la guardia.",
          w: "La fontana della piazza. Sul bordo, inciso nella pietra: «1928 · VALDORSA 1 FORNACI 0». La pietra è consumata dove la gente appoggia le mani.",
          p: "Il campanile. L'orologio è fermo alle quattro e un quarto da quando ci sono i telefoni. Nessuno l'ha più aggiustato. Tanto, dice Carlo, l'ora la sanno tutti.",
        },
        intro: [["voce", "Valdorsa, il giorno dopo il funerale. Il paese è in silenzio come dopo una partita persa. Le foglie dei castagni cadono una alla volta, senza fretta."], ["voce", "In piazza, seduta sul bordo della fontana, c'è una ragazza con i capelli bianchi e una maglia da portiere di lana verde. Ha vent'anni. Li ha da ottanta."]],
        npcs: (s) => [{ id: "ep_ada", at: s <= 1 ? [20, 12] : [20, 12] }, { id: "ep_nino", at: [16, 15] }, { id: "ep_lia", at: [23, 15] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 0, "t"); lay(0, 25, 39, 25, "t"); lay(0, 0, 0, 25, "t"); lay(39, 0, 39, 25, "t");
          lay(1, 12, 38, 13, ":"); lay(19, 1, 20, 24, ":"); lay(14, 9, 26, 17, "+"); put(20, 11, "w"); put(21, 11, "w");
          house(4, 3, 7, 6, { door: [7, 8], roof: "#8a3a2a", wall: "#d8c0a0", rr: 3, chimney: true, flowers: true, lit: true, enter: { room: "casa", id: "ep_casa_bruno", name: "La casa del Capitano", bg: "ep_casa", intro: "La casa del Capitano: il soggiorno con la stufa, la poltrona con la forma di chi ci si è seduto per sessant'anni, e su ogni parete fotografie di squadre in maglia granata.", who: [{ id: "ep_tecla", at: [10, 5] }], chest: { coins: 20, text: "In un cassetto, sotto le bollette, una medaglietta del 1928 e qualche moneta." } } });
          lay(7, 9, 7, 11, ":");
          house(26, 3, 9, 6, { door: [30, 8], roof: "#6a3a2a", wall: "#e8d8b8", rr: 3, lit: true, enter: { room: "locanda", id: "ep_bar", name: "Bar Sport", bg: "ep_valdorsa", intro: "Il Bar Sport: tre tavolini, un biliardino senza un omino, e dietro il bancone una foto incorniciata del Capitano con la Coppa del Mare del 1974.", who: [{ id: "ep_carlo", at: [10, 4] }] } });
          lay(30, 9, 30, 11, ":");
          house(4, 16, 6, 5, { door: [6, 20], roof: "#8a3a2a", wall: "#d8c8a8", enter: "Casa della maestra Gemma. Sulla porta, un fiocco granata. Dalla finestra si sente un vecchio disco: una canzone degli anni '30 che parla di un campo di terra e di una ragazza con i guanti." });
          house(26, 16, 7, 5, { door: [29, 20], roof: "#6a4a3a", wall: "#c8b898", flowers: true, enter: "La sartoria Bellini. Nella vetrina, una maglia granata di lana, cucita a mano: «come quella del '28». Il cartellino dice «Non in vendita»." });
          house(12, 3, 5, 5, { door: [14, 7], roof: "#7a5a4a", wall: "#e0d0b8", enter: "Il municipio. La porta è chiusa per lutto cittadino. Un foglio dice: «Riapre lunedì. Il Capitano avrebbe voluto così: prima la partita, poi le carte»." });
          lay(14, 8, 14, 11, ":");
          put(24, 4, "p"); [[13, 12], [26, 12], [20, 18]].forEach(([x, y]) => put(x, y, "l")); [[15, 16], [25, 16]].forEach(([x, y]) => put(x, y, "b")); put(17, 10, "n"); put(36, 11, "n");
          [[2, 3], [12, 20], [36, 6], [37, 18], [2, 17], [22, 21]].forEach(([x, y]) => put(x, y, "t")); put(18, 16, "s");
          put(39, 12, ">"); put(39, 13, ">");
        },
        decor(g, cx, cy, d) { plaque(g, "CASA ARCIERI", d.X(7) + 8, d.Y(3) - 1); plaque(g, "BAR SPORT", d.X(30) + 8, d.Y(3) - 1); plaque(g, "AL VECCHIO CAMPO →", d.X(36) + 8, d.Y(11) - 2); },
      },
      ep_campo: {
        region: "campo", name: "Dopo il Campione · Il vecchio campo di terra", short: "Il vecchio campo di terra", sub: "Dietro la chiesa, dove tutto cominciò", bg: "ep_campo", time: "tramonto", travel: [2, 11],
        w: 36, h: 24, start: [2, 11], items: [[34, 2], [3, 21], [20, 21], [34, 21]],
        areas: [[8, 6, 27, 17, "Il campo"], [1, 8, 7, 16, "La quercia"], [0, 0, 35, 23, "Il vecchio campo"]],
        act: { g: "Guarda la porta", f: "Guarda la staccionata", "<": "Torna in paese", ";": "Guarda l'erba alta", j: "Guarda la tribuna" },
        flavor: { g: "Una porta di legno, storta, con la vernice bianca scrostata. La traversa è stata rinforzata con il fil di ferro, più volte, da mani diverse.", f: "La staccionata del vecchio campo. Qualcuno ci ha appeso una sciarpa granata. Il vento non riesce a portarla via." },
        intro: [["voce", "Il vecchio campo di terra, dietro la chiesa. Oggi è un prato con l'erba alta e due porte di legno storte. Sul lato ovest, una quercia enorme che ha visto tutto."], ["voce", "Ada si ferma all'ingresso. Non entra subito. Guarda il campo come si guarda una persona che non si vede da tanto tempo, e che è cambiata."]],
        npcs: (s) => [{ id: "ep_ada", at: [6, 13] }, ...(s >= 2 ? [{ id: "ep_nino", at: [17, 19] }, { id: "ep_lia", at: [26, 19] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "t"); lay(0, 23, 35, 23, "t"); lay(35, 0, 35, 23, "t"); lay(0, 0, 0, 9, "t"); lay(0, 14, 0, 23, "t"); put(0, 11, "<"); put(0, 12, "<"); lay(1, 11, 7, 12, ":");
          lay(8, 6, 27, 17, "-"); put(7, 11, "g"); put(7, 12, "g"); put(28, 11, "g"); put(28, 12, "g");
          [[10, 7, 13, 9], [20, 14, 25, 16], [14, 15, 16, 17], [22, 6, 26, 8]].forEach(([a, b, c, d]) => lay(a, b, c, d, ";"));
          lay(9, 3, 26, 3, "f"); lay(9, 20, 26, 20, "f");
          put(5, 11, "O"); put(14, 8, "e"); put(22, 15, "e"); put(4, 16, "e"); put(31, 12, "s");
          [[30, 4], [32, 18], [3, 4], [12, 21]].forEach(([x, y]) => put(x, y, "t"));
        },
        eras: {
          1928: {
            label: "Il campo di terra · 1928", region: "terra", filter: "seppia", time: "giorno",
            npcs: () => [{ id: "ep_bruno", at: [18, 11] }, { id: "ep_gelindo", at: [22, 11] }, { id: "ep_ada", at: [9, 12] }],
            build(L) {
              const { lay, put } = L;
              lay(0, 0, 35, 0, "t"); lay(0, 23, 35, 23, "t"); lay(35, 0, 35, 23, "t"); lay(0, 0, 0, 9, "t"); lay(0, 14, 0, 23, "t"); put(0, 11, "<"); put(0, 12, "<"); lay(1, 11, 7, 12, ":");
              lay(8, 6, 27, 17, ","); put(7, 11, "g"); put(7, 12, "g"); put(28, 11, "g"); put(28, 12, "g");
              lay(9, 2, 26, 4, "j"); lay(9, 19, 26, 21, "j");
              put(5, 11, "O"); put(31, 12, "s");
            },
          },
        },
        decor(g, cx, cy, d) { if (K.eraOf("ep_campo")) plaque(g, "14 OTTOBRE 1928 · VALDORSA – FORNACI", d.X(18), d.Y(5) + 4); },
      },
    };

    function match1928() {
      K.ownMatch(window.__epoche.start, { oppStyle: "pressing",
        era: "1928", title: "Epoche · Valdorsa–Fornaci, 1928", us: "Valdorsa 1928", opp: { name: "Fornaci", kit: "#5a5a62", names: ["Gelindo", "Mattone"] }, half: 35,
        mate: { name: "Bruno", skin: "#e8c4a0", hair: "#3a2a1a", shirt: "#7a2a2a" }, shirt: "#7a2a2a", bg: "ep_1928",
        halftime: "Intervallo. Bruno si toglie la scarpa e si massaggia il piede, di nascosto. Ada lo vede dalla porta. Non dice niente.",
        introExtra: "<p>Giochi nella memoria di Ada, accanto al Capitano a diciott'anni. Il pallone pesa come un sasso: passalo corto, e tira da vicino.</p>",
        done: (r) => {
          F.set("ep_m1", r.win ? "vinta" : "persa"); bond("ada", 1); K.learnLore("l_1928");
          K.scene([
            ["voce", r.win ? "Fischio finale, in bianco e nero. Il pubblico lancia i cappelli in aria. Bruno corre verso la porta, abbraccia Ada, e lei per un attimo non sa dove mettere le mani." : "Fischio finale, in bianco e nero. Le Fornaci hanno vinto, ma il pubblico applaude lo stesso: è la prima partita del Valdorsa, e c'è stata. Bruno ride, sporco di fango fino ai capelli."],
            ["ep_bruno", r.win ? "Hai visto, Ada? Una squadra! Abbiamo una squadra! Domani ci compriamo un pallone nuovo. Questo pesa come mio nonno." : "Abbiamo perso, e allora? Abbiamo giocato! Domenica prossima li battiamo. E quella dopo. Ada, tu ci sarai, vero? Tutte le domeniche?"],
            ["voce", "Poi il ricordo si sfila, come un sogno al risveglio. Il campo torna quello di oggi: l'erba alta, le porte storte, il tramonto. Ada è sotto la quercia, ferma."],
          ], () => { K.setEra("ep_campo", null); setStep(N, 4); K.enterZone("ep_campo"); }, "ep_1928");
        },
      });
    }

    const talk = {
      ep_ada() {
        const s = S(), era = K.eraOf("ep_campo");
        if (era) return say([["ep_ada", "(Ada, nel ricordo, ha le guance rosse di freddo e i guanti di lana del padre.) Non guardarmi così. Guarda Bruno. Era lui la partita."]]);
        if (s === 0) return say([
          ["ep_ada", "Tu sei {n}. Il nuovo capitano di Valdorsa. Bruno parlava di te, nelle lettere. Diceva: «Ha i piedi buoni e la testa ancora meglio»."],
          ["ep_ada", "Io sono Ada. Giocavo in porta con lui, nel 1928. Lo so: non sembra. Il tempo con me si è distratto, tanti anni fa. Non ha più ripreso."],
          ["ep_ada", "Ieri, al funerale, ho capito una cosa. Ho passato ottant'anni accanto a Bruno, e non l'ho mai conosciuto davvero. Pensavo che ci sarebbe sempre stato tempo. Io ne ho, di tempo. Lui no."],
          ["ep_ada", "Voglio ripercorrere i luoghi delle nostre vittorie. Per capire chi era. Mi accompagni? Sua nipote Tecla dice che ha qualcosa per me. È a casa di Bruno."],
        ], () => { setStep(N, 1); quest("ep_luoghi", "I luoghi del Capitano", "Accompagna Ada nei luoghi delle vittorie di Bruno: il campo di terra, la Riva dei Pini, la sala giochi."); done(); });
        if (s === 2) {
          if (K.echoes("ep_campo") < 3) return say([["ep_ada", "Lo senti? Il campo ricorda. Ci sono dei punti, qua e là, dove un momento è rimasto impigliato. Li chiamo echi. Toccali, e io ricordo."], ["voce", `Echi trovati: ${K.echoes("ep_campo")}/3. Brillano come lucciole ferme.`]]);
          return ask("ep_ada", "Tre echi. Adesso ricordo tutto: la pioggia, il pallone pesante, il coltellino. Ma ricordare non basta, vero? Bisogna esserci.\n\nVuoi vedere il campo con i miei occhi? Com'era nel 1928?", [
            { label: "«Sì. Mostrami il 1928»", sub: "Con gli occhi di Ada: il campo torna al passato", cls: "hot", big: true, fn: () => { setStep(N, 3); K.setEra("ep_campo", "1928"); say([["voce", "Ada ti prende la mano. Il colore si scioglie, come un acquerello sotto la pioggia. Quando riapri gli occhi, il campo è di terra battuta, le tribune sono piene di cappelli, e a centrocampo un ragazzo con la maglia granata ti fa segno di sbrigarti."]]); } },
            { label: "Ancora un momento", fn: done },
          ], "ep_campo");
        }
        if (s === 4) return ask("ep_ada", "(Ada passa le dita sulla corteccia. Sotto il muschio c'è un'incisione: «per Ada, che para tutto». Accanto, più piccolo: «anche me».)\n\nOttant'anni. Mi è bastato fare dieci passi, per leggerla. Non li ho mai fatti.", [
          { label: "«Lui ti guardava sempre. Anche in campo»", sub: "Dirle quello che hai visto", big: true, fn: () => end1("guardava") },
          { label: "«Raccontami di lui. Da capo»", sub: "Ascoltarla", big: true, fn: () => end1("racconta") },
          { label: "«Il passato non si cambia, Ada»", sub: "Una verità dura", big: true, fn: () => end1("passato") },
        ], "ep_campo");
        return say([["ep_ada", s === 1 ? "Tecla è a casa di Bruno. La casa con la stufa e le fotografie. Io resto qui ancora un po': le foglie della piazza le ho viste cadere per ottant'anni, e ogni volta sono diverse." : "Il campo è a est. Dietro la chiesa. Era sempre dietro qualcosa, quel campo: dietro la chiesa, dietro la guerra, dietro la nebbia."]]);
      },
      ep_tecla() {
        if (S() !== 1) return say([["ep_tecla", "Il nonno parlava sempre di Ada. Da bambina pensavo fosse una favola. Poi a dieci anni l'ho vista: identica alla foto del 1928. Ho smesso di fare domande e ho cominciato a portarle i biscotti."]]);
        return say([
          ["ep_tecla", "Lei è il capitano nuovo. Il nonno ne sarebbe contento. Ho trovato questa in soffitta: una scatola di latta, con scritto «per Ada». Non l'ho aperta. Non era mia."],
          ["voce", "La porti in piazza ad Ada. Lei la apre con due dita, come si apre una porta di notte. Dentro: una fotografia del 1928, un biglietto della Coppa del Mare del 1974, un gettone da sala giochi del 1989."],
          ["ep_ada", "Tre luoghi. Il campo di terra. La Riva dei Pini. La sala giochi del bar della stazione. Tre volte in cui abbiamo vinto. …No. Tre volte in cui lui ha vinto, e io c'ero."],
          ["ep_ada", "Cominciamo dal primo. Il campo di terra, a est del paese. Non ci torno da sessant'anni."],
        ], () => { setStep(N, 2); K.learnLore("l_scatola"); done(); });
      },
      ep_carlo() {
        if (F.is("ep_carlo1")) return say([["ep_carlo", "Un altro caffè? È gratis per chi ha conosciuto il Capitano. Cioè per tutti. Cioè lo pago io da sessant'anni."]]);
        F.set("ep_carlo1", true);
        return say([["ep_carlo", "Il Capitano. Io l'ho visto giocare dal '52, aveva già quarant'anni e correva più di noi ragazzi. Diceva sempre: «Il primo gol non l'ho segnato io. L'ha parato Ada»."], ["ep_carlo", "Il primo gol del Valdorsa, nel '28: da metà campo, col pallone bagnato. Così dice la storia. Il Capitano, quando gliela raccontavano, sorrideva e non diceva niente. Uno che sorride e non dice niente, di solito, sa un'altra versione."]], () => { K.learnLore("l_1928", true); bond("squadra", 0); done(); });
      },
      ep_nino() {
        if (F.is("ep_nino1")) return say([["ep_nino", K.pick(["Capitano! Allenamento domani? Porto io i coni. Cioè le bottiglie di plastica. Cioè i coni.", "Lia dice che Ada non è un fantasma. Io dico: hai mai visto un fantasma in carne e ossa? Ecco. Non si può dire."])]]);
        F.set("ep_nino1", true); bond("squadra", 1);
        return say([["ep_nino", "Sei il nuovo capitano! Io sono Nino, attaccante, segno sempre, tranne quando tiro. Posso chiederti una cosa? Ada… è un fantasma? Perché se è un fantasma io le chiedo un autografo. Dei fantasmi non si sa mai quanto restano."]]);
      },
      ep_lia() {
        if (F.is("ep_lia1")) return say([["ep_lia", K.pick(["Mi alleno all'alba. Da sola. Non dirlo ad Ada.", "Ho studiato le foto del '28. Ada si buttava sempre a sinistra. Io a destra. Così siamo pari."])]]);
        F.set("ep_lia1", true); bond("squadra", 1);
        return say([["ep_lia", "Lia, portiera. Quella vera, adesso. Non che Ada non lo sia. Solo che… lei ha già parato tutto. A me resta poco."], ["ep_lia", "(Abbassa la voce.) Se ti chiede di me, dille che sono brava. Non che la ammiro. Brava e basta."]]);
      },
      ep_bruno() {
        if (!K.eraOf("ep_campo")) return done();
        return ask("ep_bruno", "Ehi! Tu! Sei quello nuovo? Ci manca un uomo, le Fornaci sono in undici e noi in dieci, più Ada. Ada conta per due, ma l'arbitro non lo sa.\n\nGiochi? Il pallone pesa come mio nonno, ti avviso.", [
          { label: "Gioca la partita del 1928", sub: "Epoche · film muto, pallone pesante", cls: "hot", fn: match1928 },
          { label: "Guarda ancora un po' il campo", fn: done },
        ], "ep_1928");
      },
      ep_gelindo() { return say([["ep_gelindo", "Le Fornaci fanno mattoni, ragazzo. Noi i muri li costruiamo. Voi provate a passarci in mezzo."]]); },
    };
    function end1(kind) {
      if (kind === "guardava") bond("ada", 2); else if (kind === "racconta") { bond("ada", 1); F.set("ep_racconta", true); } else { bond("ada", -1); F.set("ep_duro", true); }
      const msg = K.reward("ch:ep_c1", { coins: 70, cos: ["ep_c1", "ep_berretto28"] });
      finishChapter(N); setStep(N, 5);
      K.scene([
        ["ep_ada", kind === "guardava" ? "Mi guardava. Sì. Lo sapevo, credo. Lo sapevo e facevo finta di guardare il pallone. Sono una portiera: guardare il pallone mi veniva facile." : kind === "racconta" ? "Da capo? Allora: c'era una volta un ragazzo con le scarpe del padre, troppo grandi. Le riempiva di giornali. …Sarà una storia lunga. Ho tempo. Tu hai pazienza?" : "Lo so. Il passato non si cambia. Ma si può guardare meglio. È l'unica cosa che ho sempre saputo fare: guardare. Pensavo bastasse."],
        ["voce", "Tornate in paese al buio. Nino racconta la partita del '28 come se l'avesse giocata lui. Lia cammina accanto ad Ada senza dire niente, e ogni tanto la guarda di nascosto."],
        ["ep_ada", "Il prossimo ricordo è al mare. La Riva dei Pini, 1974. Bruno allenava, io ero lì in vacanza. Così dico a tutti. Non era vero."],
        ["voce", `<b>Fine del Capitolo 1 · Il campo di terra.</b> ${msg.join(" · ")}`],
      ], () => K.openMain(), "ep_campo");
    }
    const ECHI = {
      "ep_campo:e:14,8": [[["voce", "Tocchi l'eco. Per un istante senti la voce di un ragazzo, lontana, sotto la pioggia del 1928."], ["voce", "«Ci manca il portiere. Le ragazze non giocano, lo sanno tutti.» E un'altra voce, ferma: «Allora gioco da ragazzo»."], ["ep_ada", "…Ha riso per un minuto intero. Poi mi ha dato la sua maglia. Era troppo grande. L'ho tenuta per quarant'anni."]], "l_eco1"],
      "ep_campo:e:22,15": [[["voce", "L'eco sa di pioggia e di cuoio bagnato. Un tonfo sordo: un pallone che pesa il doppio, calciato con rabbia."], ["ep_ada", "Si è fatto male al piede, quel giorno. Ha giocato zoppicando tutto il secondo tempo, e non l'ha detto a nessuno. Io l'ho visto. Non l'ho detto a nessuno neanche io. Eravamo bravi, a non dirci le cose."]], "l_eco2"],
      "ep_campo:e:4,16": [[["voce", "L'eco è quasi buio. Un clic metallico, un coltellino che si apre. Un ragazzo davanti a una quercia, che incide qualcosa, piano, per non far rumore."], ["ep_ada", "L'ho visto da lontano. Ho pensato: domani vado a vedere cosa ha scritto. Domani. Sono passati ottant'anni di domani."]], "l_eco3"],
    };
    const obj = {
      "ep_valdorsa:>": () => (S() >= 2 ? go("ep_campo", 2, 11) : say([["voce", S() === 0 ? "La strada per il vecchio campo. Prima, però, Ada ti aspetta in piazza." : "Prima passa dalla casa di Bruno: Tecla ha qualcosa per Ada."]])),
      "ep_campo:<": () => (K.eraOf("ep_campo") ? say([["voce", "Nel ricordo, la strada per il paese è piena di gente che arriva per la partita. Non si torna indietro, adesso: si gioca."]]) : go("ep_valdorsa", 37, 12)),
      "ep_campo:O": () => say([["voce", S() >= 4 ? "La quercia. Sulla corteccia, sotto il muschio: «per Ada, che para tutto». E più piccolo: «anche me»." : "La quercia del campo. Enorme, storta, con i rami che si allungano verso la porta di sinistra come per pararla. La corteccia, in un punto, è coperta di muschio."]]),
      "ep_campo:e": (o) => { const E = ECHI[`ep_campo:e:${o.tx},${o.ty}`]; if (E) K.echo(o, E[0], E[1]); },
    };
    return { n: N, title: "Il campo di terra", sub: "Valdorsa, la scatola di latta, il 1928", goal, start: "ep_valdorsa", introBg: "ep_valdorsa", zones, talk, obj,
      intro: () => [["voce", "Bruno Arcieri, il Capitano di Valdorsa, è morto a novantaquattro anni, una domenica di ottobre, durante il secondo tempo della partita alla radio. Il Valdorsa vinceva."], ["voce", "Al funerale c'era tutto il paese. In fondo alla chiesa, in piedi, una ragazza con i capelli bianchi e una maglia da portiere di lana verde, che nessuno dei giovani conosceva e tutti i vecchi salutavano."]] };
  }
  boot();
})();
