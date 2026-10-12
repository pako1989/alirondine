// js/dopo-c2.js - DOPO IL CAMPIONE · Capitolo 2 «L'estate del '74»
// La Riva dei Pini fuori stagione. La leggenda dice che nel 1974 il Valdorsa vinse la Coppa del Mare con un gol del Capitano.
// Novità del capitolo: DUE VERSIONI DELLO STESSO LUOGO. Con gli occhi di Ada il vecchio Stadio del Mare torna al 1974 come
// lei lo ha sempre immaginato (la leggenda); con gli occhi di Sandro, il portiere di allora, torna com'era davvero (la verità).
// Ada all'intervallo era scappata: non ha mai visto il secondo tempo. Il secondo tempo vero si gioca in Epoche · 1974.
(function () {
  "use strict";
  function boot() { const D = window.__dopo; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N), TS = 16;

    K.cast("ep_sandro", { acc: ["guanti"], name: "Sandro Mareggi", tag: "gray", hair: "#d0d0d0", style: "slick", skin: "#c68642", eye: "#3a5a6a", bg: ["#2a5a7a", "#e8a87a"], shirt: "#e8e0d0" },
      "Il proprietario del Bagno Sandro, alla Riva dei Pini. Nel 1974 aveva diciassette anni ed era il portiere del Valdorsa nella finale della Coppa del Mare. Da allora non ha più parato un pallone, nemmeno per gioco.");
    K.cast("ep_sandro74", { acc: ["guanti"], name: "Sandro, 1974", tag: "", hair: "#3a2a1a", style: "long", skin: "#d9a679", eye: "#3a5a6a", bg: ["#e8a050", "#7a2a2a"], shirt: "#3a7a3a" },
      "Diciassette anni, i capelli lunghi come si usava, i guanti di lana della nonna. Il portiere più giovane della storia del Valdorsa. Il più spaventato, anche.");
    K.cast("ep_bruno74", { acc: ["fischietto"], name: "Bruno Arcieri, 1974", tag: "gray", hair: "#b8b8b8", style: "messy", skin: "#e0b890", eye: "#4a3a2a", bg: ["#e8a050", "#7a2a2a"], shirt: "#7a2a2a" },
      "Il Capitano a sessantaquattro anni, allenatore del Valdorsa. I capelli grigi, la stessa maglia granata (adesso con il cardigan sopra), lo stesso sorriso che arriva prima di lui.");
    K.cast("ep_cronista74", { acc: ["taccuino", "coppola"], name: "Il cronista della Gazzetta, 1974", tag: "", hair: "#1a1a1a", style: "slick", skin: "#e8c8a8", eye: "#3a3a3a", shades: true, bg: ["#e8a050", "#3a3a3a"], shirt: "#c8b08a" },
      "Basettoni, camicia a fiori, una macchina da scrivere portatile. Scrive gli articoli prima che finiscano le partite, «per risparmiare tempo».");
    K.cos("ep_c2", { kind: "shirt", label: "Maglia della Coppa del Mare 1974", val: "#e8a050", from: "Completa il Capitolo 2 di Dopo il Campione" });
    K.cos("ep_conchiglia", { kind: "hairc", label: "Capelli Sole del '74", val: "#e8b83a", from: "Trova tutte le foglie d'oro alla Riva dei Pini" });
    K.cos("ep_guanti", { kind: "acc", label: "Guanti di lana di Sandro", val: "#3a7a3a", from: "Riporta a Sandro il pallone del 1974" });
    K.lore("l_1974", { t: "La Coppa del Mare, 1974", d: "La leggenda: Valdorsa–Riviera 2-1, finale della Coppa del Mare, gol decisivo del Capitano (a sessantaquattro anni, entrato dalla panchina). Sulla Gazzetta: «IL CAPITANO NON INVECCHIA MAI». In paese la targa c'è ancora." });
    K.lore("l_sandro", { t: "La verità di Sandro", d: "Finì 1-2 per la Riviera. Il secondo gol lo prese Sandro, diciassette anni, con il pallone che gli scivolò tra i guanti di lana. Il Capitano disse al cronista: «Abbiamo vinto noi». Il cronista lo scrisse. Il Capitano non lo smentì mai. Per proteggere un ragazzo." });
    K.lore("l_eco4", { t: "Eco · La moneta", d: "Il sorteggio a centrocampo, 1974. Bruno lancia la moneta e, mentre è in aria, guarda in tribuna. Cerca qualcuno. Lo trova: una ragazza con i capelli bianchi e gli occhiali da sole, in quarta fila." });
    K.lore("l_eco5", { t: "Eco · L'intervallo", d: "1-0 all'intervallo. Ada si alza dalla quarta fila e se ne va, senza salutare. Bruno, dalla panchina, la vede andare via. Aveva sessantaquattro anni. Lei venti. Lei non sopportava di vederlo invecchiare. Lui lo aveva capito." });
    K.lore("l_eco6", { t: "Eco · Il tabellone", d: "Il tabellone dello Stadio del Mare, 1974, scritto a mano con il gesso: VALDORSA 1 · RIVIERA 0. Nel ricordo di Ada il tabellone si ferma lì. Il resto lo ha letto sulla Gazzetta." });

    const goal = (s) => ({
      0: "La Riva dei Pini, fuori stagione. Ada è sul lungomare: parlale.",
      1: "Il Bagno Sandro è sulla spiaggia: il proprietario era il portiere del 1974. Poi, al vecchio Stadio del Mare, guarda con gli occhi di Ada (3 echi).",
      2: "Sandro ha accettato: al vecchio Stadio del Mare guarda con i suoi occhi, il secondo tempo vero.",
      3: "Nel ricordo di Sandro: parla con il Sandro di diciassette anni, in porta.",
      4: "Il ricordo è finito. Sandro e Ada ti aspettano sul lungomare.",
    }[s] || "Capitolo concluso. L'ultimo ricordo ti aspetta dal menu.");

    function umbrellas(g, cx, cy, d, lot) { // ombrelloni a righe del 1974 (nella leggenda tanti, nella verità chiusi)
      const pos = [[6, 5], [10, 6], [14, 5], [18, 6], [6, 9], [11, 10], [16, 9], [22, 5], [26, 6], [24, 9]];
      pos.slice(0, lot ? pos.length : 4).forEach(([x, y], i) => { const X = d.X(x) + 8, Y = d.Y(y) + 6; g.fillStyle = "#6a4a2a"; g.fillRect(X - 0.5, Y - 12, 1.5, 14); const c = [["#e85a3a", "#f4ecdc"], ["#3a8ac8", "#f4ecdc"], ["#ffd23f", "#e85a3a"]][i % 3]; if (lot === 2) { g.fillStyle = c[0]; g.fillRect(X - 2, Y - 14, 4, 10); return; } for (let k = 0; k < 6; k++) { g.fillStyle = c[k % 2]; g.beginPath(); g.moveTo(X, Y - 18); g.arc(X, Y - 12, 10, Math.PI + k * Math.PI / 6, Math.PI + (k + 1) * Math.PI / 6); g.closePath(); g.fill(); } });
    }
    const zones = {
      ep_riva: {
        region: "riva", name: "Dopo il Campione · La Riva dei Pini", short: "La Riva dei Pini", sub: "Il mare fuori stagione, e lo Stadio del Mare", bg: "ep_riva", time: "tramonto", travel: [2, 12],
        w: 44, h: 26, start: [2, 12], itemCos: "ep_conchiglia", items: [[3, 3], [40, 4], [20, 20], [41, 19]],
        areas: [[4, 3, 30, 11, "La spiaggia"], [31, 3, 42, 17, "Il vecchio Stadio del Mare"], [8, 14, 16, 18, "Bagno Sandro"], [0, 0, 43, 25, "La Riva dei Pini"]],
        act: { w: "Guarda il mare", y: "Guarda la cabina", q: "Entra", b: "Siediti", n: "Leggi il cartello", t: "Guarda il pino", l: "Guarda il lampione", j: "Guarda la tribuna", g: "Guarda la porta", "<": "Torna indietro" },
        flavor: {
          w: "Il mare di ottobre: grigio-verde, calmo, con la schiuma che arriva a riva stanca. D'estate, dicono, qui non si vedeva la sabbia per gli asciugamani.",
          y: ["Le cabine del Bagno Sandro, chiuse per l'inverno. Sulla porta della numero 7 qualcuno ha disegnato con il gesso un pallone e una data: «74».", "Una cabina a righe bianche e blu. Dentro si sente il mare, anche con la porta chiusa."],
          n: ["Cartello sbiadito: «STADIO DEL MARE · COPPA DEL MARE · FINALE ORE 17». Sotto, un adesivo: «Chiuso dal 1991»", "«VIETATO GIOCARE A PALLONE SULLA SPIAGGIA». Sotto, a pennarello: «tranne Sandro, che tanto non gioca più»"],
          t: "Un pino marittimo, piegato dal libeccio. Sulla corteccia, ad altezza di bambino, tante tacche: qualcuno misurava quanto cresceva, ogni estate. Le tacche si fermano a un certo punto.",
          j: "Le gradinate dello Stadio del Mare, crepate, con l'erba che spunta tra i gradini. In quarta fila, un sedile è ancora verniciato di bianco. Uno solo.",
          g: "Una porta arrugginita, senza rete. Il mare, da qui, sembra passare attraverso.",
        },
        intro: [["voce", "La Riva dei Pini a ottobre: ombrelloni chiusi come fiori di notte, cabine sbarrate, un gelataio che smonta l'insegna. Il mare fa rumore anche per chi non c'è."], ["voce", "In fondo alla spiaggia, il vecchio Stadio del Mare: due tribune di cemento crepato e un campo dove adesso pascolano i gabbiani."]],
        npcs: (s) => [{ id: "ep_ada", at: s >= 4 ? [20, 12] : [6, 12] }, ...(s >= 4 ? [{ id: "ep_sandro", at: [22, 12] }] : s === 2 ? [{ id: "ep_sandro", at: [30, 14] }] : []), { id: "ep_nino", at: [24, 4] }, { id: "ep_lia", at: [28, 8] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 43, 25, ","); lay(0, 0, 43, 1, "t"); lay(0, 0, 0, 25, "t"); lay(43, 0, 43, 25, "t"); put(0, 12, "<"); put(0, 13, "<");
          lay(1, 12, 30, 13, "+"); lay(0, 21, 43, 25, "w"); lay(1, 19, 42, 20, ",");
          house(8, 14, 9, 5, { door: [12, 18], roof: "#3a8ac8", wall: "#f4ecdc", rr: 2, lit: true, flowers: true, enter: { room: "locanda", id: "ep_bagno", name: "Bagno Sandro", bg: "ep_riva", intro: "Il Bagno Sandro, chiuso per l'inverno ma con la porta aperta: sedie impilate, un frigorifero dei gelati spento, e dietro il bancone una foto del 1974 girata verso il muro.", who: (s) => (s >= 2 ? [] : [{ id: "ep_sandro", at: [10, 4] }]) } });
          [[19, 15], [22, 15], [25, 15], [28, 15]].forEach(([x, y], i) => house(x, y, 2, 3, { door: [x + 1, y + 2], roof: ["#3a8ac8", "#e85a3a", "#3a8ac8", "#e85a3a"][i], wall: "#f4ecdc", rr: 1, enter: i === 2 ? { room: "casa", id: "ep_cabina7", name: "La cabina numero 7", bg: "ep_riva", intro: "La cabina numero 7: un asciugamano del 1974 ancora appeso, e in un angolo, sgonfio, un pallone di cuoio con la scritta «FINALE COPPA DEL MARE».", who: [], locked: (K) => (!K.F.is("ep_chiave7") ? "La cabina numero 7 è chiusa con un lucchetto. Sandro avrà la chiave: il bagno è suo." : false), chest: { coins: 25, text: "Il pallone della finale del 1974, sgonfio, con una macchia scura dove i guanti di lana l'hanno stretto." } } : "Una cabina chiusa per l'inverno. Dentro, il rumore del mare, come in una conchiglia." }));
          lay(31, 3, 42, 3, "j"); lay(31, 17, 42, 17, "j"); lay(32, 5, 41, 15, "-"); put(36, 4, "g"); put(37, 4, "g"); put(36, 16, "g"); put(37, 16, "g"); lay(31, 4, 31, 16, "f"); lay(42, 4, 42, 16, "f"); put(31, 12, "+"); put(31, 13, "+");
          [[3, 6], [3, 16], [40, 20], [18, 4], [30, 19]].forEach(([x, y]) => put(x, y, "t")); [[8, 12], [24, 12]].forEach(([x, y]) => put(x, y, "l")); put(14, 11, "b"); put(29, 11, "n"); put(5, 14, "n"); put(17, 19, "s");
          put(34, 14, "e"); put(39, 8, "e"); put(33, 6, "e");
        },
        eras: {
          leggenda: { label: "Lo Stadio del Mare · 1974, come lo ricorda Ada", region: "riva", filter: "anni70", time: "giorno",
            npcs: () => [{ id: "ep_bruno74", at: [33, 11] }, { id: "ep_ada", at: [29, 12] }, { id: "ep_cronista74", at: [41, 11] }],
            build(L) { zones.ep_riva.build(L); L.lay(32, 5, 41, 15, "-"); [[34, 14], [39, 8], [33, 6]].forEach(([x, y]) => L.put(x, y, "e")); } },
          verita: { label: "Lo Stadio del Mare · 1974, com'è andata davvero", region: "riva", filter: "anni70", time: "tramonto",
            npcs: () => [{ id: "ep_sandro74", at: [36, 15] }, { id: "ep_bruno74", at: [33, 11] }, { id: "ep_cronista74", at: [41, 11] }, { id: "ep_sandro", at: [29, 12] }],
            build(L) { zones.ep_riva.build(L); L.lay(32, 5, 41, 15, "-"); ["34,14", "39,8", "33,6"].forEach((k) => { const [x, y] = k.split(",").map(Number); L.put(x, y, "-"); }); } },
        },
        decor(g, cx, cy, d) {
          const e = K.eraOf("ep_riva"); umbrellas(g, cx, cy, d, e === "leggenda" ? 1 : e === "verita" ? 1 : 2);
          const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
          // il tabellone dello stadio: cambia con la versione
          const tx = d.X(36), ty = d.Y(2) - 4; R(tx - 22, ty - 10, 60, 14, "#2a2a2a"); g.font = "bold 7px monospace"; g.fillStyle = "#ffd23f";
          g.fillText(e === "leggenda" ? "VALDORSA 2 · RIVIERA 1" : e === "verita" ? "VALDORSA 1 · RIVIERA 2" : "STADIO DEL MARE", tx - 20, ty);
        },
      },
    };
    function match1974() {
      K.ownMatch(window.__epoche.start, { oppStyle: "equilibrata",
        era: "1974", title: "Epoche · Coppa del Mare 1974, secondo tempo", us: "Valdorsa 1974", opp: { name: "Riviera", kit: "#3a8ac8", names: ["Marino", "Scoglio"] }, half: 30,
        mate: { name: "Bruno", skin: "#e0b890", hair: "#b8b8b8", shirt: "#7a2a2a" }, shirt: "#e8a050", bg: "ep_1974",
        halftime: "Nel ricordo di Sandro non c'è l'intervallo: c'è solo il caldo, le cicale, e la paura che sale come la marea.",
        introExtra: "<p>Giochi il secondo tempo vero, nella memoria di Sandro. Il passato non si cambia: ma come lo giochi, oggi, lo decidi tu.</p>",
        done: (r) => {
          F.set("ep_m2", r.win ? "vinta" : "persa"); K.learnLore("l_sandro"); bond("ada", 1); setStep(N, 4);
          K.scene([
            ["voce", r.win ? "Nel ricordo, stavolta, il Valdorsa vince. Per un attimo il tabellone di gesso esita, come se non sapesse cosa scrivere. Poi torna a dire la verità: 1-2. Ma Sandro, il vecchio Sandro, sorride." : "Nel ricordo, il pallone scivola tra i guanti di lana del ragazzo di diciassette anni. 1-2. Lo stadio si zittisce. Il ragazzo si inginocchia nel fango e si copre la faccia."],
            ["ep_bruno74", "(Il Capitano, sessantaquattro anni, attraversa il campo. Si inginocchia accanto al ragazzo. Gli toglie i guanti, piano, uno alla volta.) Sandro. Guardami. Abbiamo vinto. Hai capito? Abbiamo vinto noi."],
            ["ep_cronista74", "Capitano! Una dichiarazione per la Gazzetta?"],
            ["ep_bruno74", "Scriva che abbiamo vinto. E che il portiere è stato il migliore in campo. Scriva così."],
            ["voce", "Il ricordo si chiude come una cabina a fine estate. Siete di nuovo sul lungomare, a ottobre. Sandro ha gli occhi lucidi. Ada guarda il mare."],
          ], () => { K.setEra("ep_riva", null); K.enterZone("ep_riva"); }, "ep_1974");
        },
      });
    }
    const talk = {
      ep_ada() {
        const s = S(), era = K.eraOf("ep_riva");
        if (era === "leggenda") return say([["ep_ada", "(Nel ricordo, Ada ha gli occhiali da sole e un vestito a fiori. Guarda la panchina, non il campo.) Lui aveva i capelli grigi. Io no. Ogni volta che lo guardavo, era come guardarmi da fuori. Non lo sopportavo."]]);
        if (s === 0) return say([
          ["ep_ada", "La Riva dei Pini. Nel '74 c'era tanta gente che non si vedeva il mare. Bruno allenava il Valdorsa, aveva sessantaquattro anni. Io ero qui «in vacanza». Così dico a tutti."],
          ["ep_ada", "La verità è che all'intervallo me ne sono andata. Eravamo uno a zero. Lui in panchina, con il cardigan e i capelli grigi. Io in tribuna, con vent'anni. Non ce l'ho fatta, a guardare."],
          ["ep_ada", "Il secondo tempo l'ho letto sulla Gazzetta, il giorno dopo: «Il Capitano non invecchia mai». Due a uno, gol suo. L'ho ritagliato. L'ho ancora."],
          ["ep_ada", "Il portiere di quella finale ha un bagno, qui sulla spiaggia. Sandro. Andiamo a trovarlo? Io poi vorrei rivedere lo stadio. Con i miei occhi, almeno il primo tempo."],
        ], () => { setStep(N, 1); done(); });
        if (s === 1 && !era) {
          if (K.echoes("ep_riva") >= 3) return say([["ep_ada", "Ho visto tutto quello che avevo visto. La moneta, l'intervallo, il tabellone uno a zero. Il resto non è mio. È di Sandro."]]);
          return ask("ep_ada", "Lo Stadio del Mare. Vuoi vederlo com'era quel giorno? Come lo ricordo io. Avverto: i miei ricordi di quel giorno finiscono all'intervallo.", [
            { label: "«Mostrami il 1974»", sub: "Con gli occhi di Ada: la leggenda", cls: "hot", fn: () => { K.setEra("ep_riva", "leggenda"); say([["voce", "I colori si accendono, troppo caldi, come in una fotografia lasciata al sole. Ombrelloni ovunque, la banda che suona, il tabellone scritto col gesso. È il 1974, come Ada lo ricorda. O come Ada ha deciso di ricordarlo."]]); } },
            { label: "Più tardi", fn: done },
          ], "ep_riva");
        }
        if (s >= 4) return ask("ep_ada", "Lui ha mentito per un ragazzo di diciassette anni. Per trent'anni. Non me l'ha mai detto. Io gliel'avrei chiesto, se fossi rimasta al secondo tempo.\n\nAdesso la targa in paese dice due a uno. Cosa facciamo?", [
          { label: "«Diciamo la verità a Valdorsa»", sub: "La targa cambia, la leggenda no", big: true, fn: () => end2("verita") },
          { label: "«Lasciamo la leggenda. Era un regalo di Bruno»", sub: "Proteggere Sandro, come lui", big: true, fn: () => end2("leggenda") },
          { label: "«Decida Sandro. È la sua partita»", sub: "Restituirgli la scelta", big: true, fn: () => end2("sandro") },
        ], "ep_riva");
        return say([["ep_ada", "Il mare d'ottobre è il migliore. Non c'è nessuno che fa finta di divertirsi."]]);
      },
      ep_sandro() {
        const s = S(), era = K.eraOf("ep_riva");
        if (era === "verita") return say([["ep_sandro", "(Il vecchio Sandro guarda il ragazzo in porta.) Ero io. Guardate che mani. Tremavano già al riscaldamento."]]);
        if (s < 1) return say([["ep_sandro", "Il bagno è chiuso, ragazzo. D'inverno si vende solo malinconia, e quella la regalo."]]);
        if (s === 1 && K.echoes("ep_riva") < 3) {
          if (!F.is("ep_sandro1")) { F.set("ep_sandro1", true); return say([["ep_sandro", "Ada. Sei uguale. Sei proprio uguale. Io ho settantasette anni e tu… va bene. Va bene, non dico niente."], ["ep_sandro", "Volete sapere della finale del '74? Leggete la Gazzetta. È tutto scritto lì. Due a uno, gol del Capitano. Una bella storia. Le belle storie non si toccano."], ["ep_ada", "(a voce bassa) Sta mentendo. Lo fa male, come Bruno."]]); }
          return say([["ep_sandro", "Andate allo stadio, se volete. È lì che finiscono tutte le cose belle della Riva: allo stadio, o in cabina."]]);
        }
        if (s === 1) return ask("ep_sandro", "Ada mi ha detto cosa avete visto. La moneta, lei che se ne va all'intervallo, il tabellone uno a zero. Il primo tempo.\n\n(Si siede. Si guarda le mani.) Il secondo tempo ce l'ho io. Da trent'anni. Volete vederlo? Con i miei occhi?", [
          { label: "«Sì, Sandro. Mostracelo»", sub: "Con gli occhi di Sandro: la verità", cls: "hot", big: true, fn: () => { setStep(N, 2); quest("ep_verita74", "Il secondo tempo", "Al vecchio Stadio del Mare, guarda con gli occhi di Sandro."); say([["ep_sandro", "Allo stadio, allora. Però tenetemi la mano. A settantasette anni si ha ancora paura di certi palloni."]]); } },
          { label: "«Non sei obbligato»", fn: () => say([["ep_sandro", "Lo so. È per questo che lo faccio."]], () => { setStep(N, 2); done(); }) },
        ], "ep_riva");
        if (s === 2) return ask("ep_sandro", "Lo stadio. Eccolo. Pronto?", [{ label: "Guarda con gli occhi di Sandro", sub: "Il 1974, com'è andata davvero", cls: "hot", fn: () => { setStep(N, 3); questDone("ep_verita74"); K.setEra("ep_riva", "verita"); say([["voce", "I colori tornano, ma diversi: più scuri, il sole basso, il cielo che si prepara al temporale. Gli ombrelloni sono chiusi. Sul tabellone, il gesso dice una cosa che la Gazzetta non ha mai scritto."]]); } }, { label: "Un momento", fn: done }], "ep_riva");
        if (s >= 4 && !F.is("ep_chiave7")) return say([["ep_sandro", "Il pallone di quella finale è nella cabina numero 7. Non l'ho mai più toccato. Ecco la chiave: portamelo, se te la senti. Io non ce la faccio."]], () => { F.set("ep_chiave7", true); quest("ep_pallone74", "Il pallone del '74", "Prendi il pallone della finale nella cabina numero 7 e portalo a Sandro."); done(); });
        if (s >= 4 && F.is("ep_pallone74_preso") && !F.is("ep_pallone74_dato")) { F.set("ep_pallone74_dato", true); questDone("ep_pallone74"); bond("squadra", 1); const msg = K.reward("q:ep_pallone74", { coins: 30, cos: "ep_guanti" }); return say([["ep_sandro", "(Lo tiene in mano. Lo gira. Poi lo lancia in alto, piano, e lo riprende.) Visto? Para ancora. Trent'anni dopo."], ["ep_lia", "(arrivando di corsa) Me lo insegna? Come si para con i guanti di lana?"], ["ep_sandro", "Domattina. Alle sei. Porta i guanti di tua nonna."], ["voce", `<b>${msg.join(" · ")}</b>`]]); }
        return say([["ep_sandro", "Due a uno per noi, dice la targa. Due a uno per loro, dico io. Il Capitano diceva: tutti e due veri. Era un tipo così."]]);
      },
      ep_sandro74() {
        if (K.eraOf("ep_riva") !== "verita") return done();
        return ask("ep_sandro74", "(Il ragazzo in porta ha diciassette anni, i guanti di lana della nonna, e le gambe che tremano.) Uno a zero per noi. Mancano trenta minuti. Ho paura. Se sbaglio, la Riviera… Il Capitano dice che non sbaglierò. Il Capitano dice tante cose.\n\nGiochi con noi il secondo tempo?", [
          { label: "Gioca il secondo tempo del 1974", sub: "Epoche · colori anni '70 e l'afa", cls: "hot", fn: match1974 },
          { label: "Guarda ancora", fn: done },
        ], "ep_1974");
      },
      ep_bruno74() { return say([["ep_bruno74", K.eraOf("ep_riva") === "leggenda" ? "(Il Capitano, sessantaquattro anni, guarda verso la quarta fila. Il posto è vuoto. Si gira verso il campo e batte le mani.) Forza ragazzi! Il secondo tempo è nostro!" : "Tranquillo, Sandro. Tranquillo. Le partite non si vincono con le mani. Si vincono con il coraggio. Le mani vengono dopo."]]); },
      ep_cronista74() { return say([["ep_cronista74", "L'articolo è già pronto, ragazzo: «IL CAPITANO NON INVECCHIA MAI». Bello, eh? Il risultato lo metto dopo. Tanto, il titolo funziona con tutti i risultati."]]); },
      ep_nino() { if (F.is("ep_nino2")) return say([["ep_nino", "Il mare d'inverno è come una partita a reti inviolate: bello, ma qualcuno deve segnare."]]); F.set("ep_nino2", true); bond("squadra", 1); return say([["ep_nino", "Capitano, ho fatto un castello di sabbia a forma di stadio. Ci ho messo dentro due conchiglie che fanno la partita. Vince quella bianca. È la squadra di Ada."]]); },
      ep_lia() { if (F.is("ep_lia2")) return say([["ep_lia", "Sandro para ancora? Me lo chiedo da quando siamo arrivati. Ha le mani di chi para."]]); F.set("ep_lia2", true); bond("squadra", 1); return say([["ep_lia", "Ho chiesto ad Ada perché non para più. Mi ha detto: «Paro ancora. Solo che adesso paro le cose che arrivano piano». Non ho capito. Credo di aver capito."]]); },
    };
    function end2(kind) {
      F.set("ep_targa", kind);
      if (kind === "verita") { bond("ada", 1); bond("squadra", 1); } else if (kind === "leggenda") bond("ada", 2); else { bond("ada", 1); bond("squadra", 2); }
      const msg = K.reward("ch:ep_c2", { coins: 80, cos: "ep_c2" });
      finishChapter(N); setStep(N, 5);
      K.scene([
        ...(kind === "verita" ? [["ep_sandro", "La verità? A Valdorsa? Dopo trent'anni? …Sì. Sì, è ora. Così posso tornare a parare. Un portiere che ha paura di un ricordo non para niente."]] : kind === "leggenda" ? [["ep_sandro", "Lasciamo la leggenda. Era il suo regalo. A me, e a tutto il paese. I regali non si restituiscono."]] : [["ep_sandro", "Decido io? …Allora la targa resta così. Ma sotto, piccolo piccolo, ci faccio scrivere: «e il portiere era bravissimo». Lui l'aveva detto al cronista. L'unica cosa vera dell'articolo."]]),
        ["ep_ada", "Sono scappata all'intervallo, e ho perso il secondo tempo. Il secondo tempo era la parte in cui lui era più lui. Non lo farò più. Scappare, intendo."],
        ["ep_ada", "L'ultimo ricordo è un gettone. 1989, la sala giochi del bar della stazione. Bruno aveva settantanove anni e giocava ai videogiochi. Io pensavo che fosse un modo di ammazzare il tempo. Forse era un modo di lasciarmi un messaggio."],
        ["voce", `<b>Fine del Capitolo 2 · L'estate del '74.</b> ${msg.join(" · ")}`],
      ], () => K.openMain(), "ep_riva");
    }
    const ECHI = {
      "ep_riva:e:34,14": [[["voce", "L'eco ha il suono di una moneta che gira in aria. Sotto, la voce di un uomo anziano, allegra: «Testa!»"], ["ep_ada", "Ha lanciato la moneta e, mentre era in aria, mi ha cercato in tribuna. Mi ha trovata. Ha sorriso. Io ho fatto finta di guardare il mare."]], "l_eco4"],
      "ep_riva:e:39,8": [[["voce", "L'eco sa di crema solare e di cemento caldo. Un sedile che si chiude con un colpo secco: qualcuno si alza e se ne va, a metà partita."], ["ep_ada", "Ero io. Sono scesa dalle gradinate senza voltarmi. Lui mi ha vista. Non mi ha chiamata. Quella volta ho pensato che non gli importasse. Adesso penso il contrario."]], "l_eco5"],
      "ep_riva:e:33,6": [[["voce", "L'eco è polvere di gesso. Il tabellone dello Stadio del Mare, scritto a mano: «VALDORSA 1 · RIVIERA 0». E poi più niente: il ricordo si ferma lì, come una pagina strappata."], ["ep_ada", "Per trent'anni il mio tabellone si è fermato all'uno a zero. Il resto l'ho letto sul giornale. Ho creduto al giornale. Era più comodo che chiedere."]], "l_eco6"],
    };
    const obj = {
      "ep_riva:e": (o) => { const E = ECHI[`ep_riva:e:${o.tx},${o.ty}`]; if (!E) return done(); if (K.eraOf("ep_riva") !== "leggenda") return say([["voce", "Qui c'è qualcosa che brilla, debole. Un eco. Ma i ricordi di Ada si svegliano solo dentro il suo 1974: chiedile di guardare con i suoi occhi."]]); K.echo(o, E[0], E[1]); if (K.echoes("ep_riva") >= 3) setTimeout(() => K.safe(() => { K.setEra("ep_riva", null); K.say([["voce", "Il ricordo di Ada finisce all'intervallo, come una pellicola che si spezza. Lo stadio torna quello di oggi: cemento crepato, gabbiani, il mare."], ["ep_ada", "Ecco. Fin qui ci sono stata. Il resto ce l'ha Sandro."]]); }), 50); },
      "ep_valdorsa:<": () => go("ep_riva", 2, 12),
      "ep_riva:<": () => go("ep_valdorsa", 1, 12),
      "ep_cabina7:z": () => K.say([["voce", "Casse di sdraio piegate, con l'odore dell'estate chiuso dentro."]]),
      "ep_cabina7:x:18,10": () => { if (F.is("ep_pallone74_preso")) return K.say([["voce", "La cassapanca è vuota. Il pallone ce l'ha Sandro, adesso."]]); F.set("ep_pallone74_preso", true); K.SFX.chest(); K.say([["voce", "Nella cassapanca, il pallone della finale del 1974: sgonfio, con una macchia scura dove due guanti di lana l'hanno stretto. Lo prendi con cura. Pesa poco. Ha pesato trent'anni."]]); },
    };
    const patch = { ep_valdorsa: { build(L) { L.put(0, 12, "<"); L.put(0, 13, "<"); }, act: { "<": "Vai alla Riva dei Pini" } } };
    return { n: N, title: "L'estate del '74", sub: "La Riva dei Pini, la leggenda e la verità", goal, start: "ep_riva", introBg: "ep_riva", zones, talk, obj, patch,
      intro: () => [["voce", "Due ore di corriera giù dalle colline, fino al mare. Nino dorme con la bocca aperta, Lia guarda fuori dal finestrino, Ada tiene in mano un biglietto: «Coppa del Mare · Finale · 1974 · Tribuna, quarta fila»."], ["voce", "«Quarta fila», dice Ada. «Da lì si vedeva benissimo la panchina. Troppo bene.»"]] };
  }
  boot();
})();
