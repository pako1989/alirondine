// js/grigio-c1.js - IL CAVALIERE DELLA NOTTE · Capitolo 1 «La nebbia sul porto»
// Porto Scuro Calcio perde tutte le partite, e non per caso. La capitana Marisa Onda lo sa, ma ha paura di dirlo.
// Sotto la tribuna, un vecchio magazziniere costruisce attrezzi strani e conserva un mantello che la città credeva una leggenda.
// Stanotte, ai Moli, c'è un registro che qualcuno non vuole far leggere.
(function () {
  "use strict";
  function boot() { const D = window.__grigio; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("gr_marisa", { acc: ["fascia"], name: "Marisa Onda, la capitana", tag: "", hair: "#2a1a14", style: "ponytail", skin: "#d9a679", eye: "#3a2a1a", bg: ["#0c101a", "#5a6a8a"], shirt: "#5a6a8a" },
      "La capitana del Porto Scuro Calcio. Lavora di giorno al mercato del pesce e gioca la sera. Da tre mesi la sua squadra perde sempre, e qualcuno le ha lasciato un biglietto sotto la porta: «Continuate così».");
    K.cast("gr_alfio", { acc: ["occhiali", "grembiule"], name: "Alfio Rames, il magazziniere", tag: "gray", hair: "#c8c8c8", style: "bald", skin: "#e8c4a0", eye: "#3a4a6a", beard: true, bg: ["#0c101a", "#8a6a3a"], shirt: "#6a5a4a" },
      "Il magazziniere dello Stadio della Gru da quarant'anni. Ripara i palloni, cuce le reti, accende i riflettori. Sotto la tribuna ha un'officina dove nessuno entra: trapani, bobine, e un armadio chiuso a chiave.");
    K.cast("gr_dora", { acc: ["cappellino"], name: "Commissaria Dora Valli", tag: "", hair: "#5a3a2a", style: "bob", skin: "#f0d0b0", eye: "#2a4a3a", bg: ["#0c101a", "#3a4a3a"], shirt: "#4a4a3a" },
      "La commissaria della polizia portuale. Onesta in una città dove l'onestà costa cara. Ha un impermeabile che non si toglie mai e un fascicolo sulla Lega del Porto spesso come un mattone, pieno di sospetti e senza una prova.");
    K.cast("gr_gancio", { acc: ["berretto"], name: "Gancio, capo dei portuali", tag: "", hair: "#3a2a1a", style: "buzz", skin: "#c68642", eye: "#2a2a2a", beard: true, bg: ["#0c101a", "#a83a2a"], shirt: "#a83a2a" },
      "Il capo dei portuali del Molo Nove. Grosso come una gru, con le mani piene di cicatrici. Lavora per il Sindacato della Nebbia: dice che è l'unico modo per far mangiare i suoi uomini.");
    ["gr_sg1", "gr_sg2", "gr_sg3"].forEach((id, i) => K.cast(id, { acc: ["cappellino"], name: ["Lo sgherro col fischio", "Lo sgherro con la torcia", "La sentinella del Molo Nove"][i], tag: "", hair: "#1a1a1a", style: "hood", skin: ["#e0b890", "#c68642", "#f0d0b0"][i], eye: "#2a2a2a", bg: ["#0c101a", "#4a4a5a"], shirt: "#4a4a5a" },
      "Uno degli uomini del Sindacato della Nebbia. Fa la ronda con una torcia e poca voglia. Guarda sempre davanti a sé: è lì che di solito arrivano i guai."));
    K.cos("gr_c1", { kind: "shirt", label: "Maglia notturna del Porto Scuro", val: "#2a3040", from: "Capitolo 1 di Il Cavaliere della Notte" });
    K.cos("gr_piume1", { kind: "acc", label: "Piuma d'airone sul bavero", val: "medaglia", from: "Trova le piume d'airone del Capitolo 1" });
    K.lore("l_airone", { t: "La leggenda dell'Airone", d: "Quarant'anni fa, a Porto Scuro, qualcuno con un mantello grigio fermò il primo giro di partite truccate. Nessuno sa chi fosse. Lo chiamavano l'Airone: stava fermo nell'ombra per ore, poi colpiva una volta sola." });
    K.lore("l_gadget", { t: "Ombre e Gadget", d: "Di notte si gioca a turni. I difensori annunciano dove entreranno: evita le caselle rosse, salta chi ha mancato il contrasto, tira dalla sesta colonna. La cintura porta fino a quattro gadget, e ognuno si usa una volta (il Visore due)." });
    K.lore("l_furtivo", { t: "Il furtivo", d: "Le guardie vedono solo davanti a sé, fin dove arriva la torcia, e i muri le fermano. Nell'ombra e dietro le casse non ti vedono; al buio ti vedono solo da vicino. Guarda dove guardano, non la torcia." });
    const goal = (s) => ({
      0: "Piazza della Gru, sotto la pioggia. La capitana del Porto Scuro Calcio ha qualcosa da dirti.",
      1: "Marisa dice di cercare il magazziniere, sotto la tribuna dello Stadio della Gru.",
      2: "Stanotte, ai Moli: il registro del Sindacato è nella cassa dietro i container. Resta nell'ombra.",
      3: "Hai il registro. In piazza ti aspetta qualcuno con un impermeabile.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      gr_piazza: {
        region: "porto", name: "Il Cavaliere della Notte · Piazza della Gru", short: "Piazza della Gru", sub: "Lo stadio, i bar, la pioggia che non smette mai", bg: "gr_piazza", time: "tramonto", travel: [15, 15],
        w: 30, h: 22, start: [15, 15], itemCos: "gr_piume1", items: [[2, 16], [27, 3]],
        areas: [[9, 2, 20, 7, "Lo Stadio della Gru"], [0, 0, 29, 21, "Piazza della Gru"]],
        flavor: { l: "Un lampione con la luce gialla. La pioggia ci gira intorno come le falene.", s: "Una panchina bagnata. Ci si siede lo stesso." },
        intro: [["voce", "Porto Scuro. Gru che sembrano scheletri, insegne al neon con metà delle lettere spente, e una pioggia che non smette da quando sei sceso dal treno."], ["voce", "In fondo alla piazza c'è lo Stadio della Gru: tribune di ferro, riflettori spenti. Sul manifesto della partita di domenica, qualcuno ha scritto col pennarello: «Tanto perdete»."]],
        npcs: (s) => [{ id: "gr_marisa", at: [8, 15] }, ...(s >= 3 ? [{ id: "gr_dora", at: [20, 15] }] : []), ...(s >= 3 && F.is("gr_gancio_visto") ? [] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a"); lay(0, 20, 29, 21, "w");
          lay(1, 13, 28, 18, ":"); lay(14, 7, 15, 12, ":"); put(29, 15, ">"); put(28, 15, ":");
          house(9, 2, 12, 5, { door: [14, 6], roof: "#3a3e4a", wall: "#5a5e68", rr: 2, lit: false, enter: { to: "gr_magazzino", at: [7, 9] } });
          house(2, 8, 5, 4, { door: [4, 11], roof: "#5a2a2a", wall: "#6a6a72", rr: 2, enter: "Il Bar del Molo: sei tavolini, un juke-box rotto, un televisore che trasmette la partita di domenica scorsa. Porto Scuro ha perso 4 a 0. Il barista abbassa il volume quando entri. «Qui non si parla di calcio», dice. «Non più.»" });
          house(22, 8, 6, 4, { door: [24, 11], roof: "#2a3a5a", wall: "#6a6a72", rr: 2, enter: "L'edicola di notte: giornali bagnati, figurine, un cartello «CHIUSO PER PAURA». Sul giornale di oggi: «Lega del Porto, il presidente Brume: tutto regolare». La foto è sfocata, come se nessuno volesse guardarlo bene." });
          put(4, 0, "A"); put(25, 0, "A"); put(8, 7, "A"); put(21, 7, "A");
          [[6, 16], [12, 17], [19, 14], [25, 17], [16, 13]].forEach(([x, y]) => put(x, y, "V"));
          [[5, 13], [24, 13], [11, 18]].forEach(([x, y]) => put(x, y, "l")); put(18, 18, "s");
          lay(1, 19, 3, 19, "K"); put(27, 19, "K"); put(26, 19, "E");
        },
      },
      gr_magazzino: {
        interior: true, region: "casa", name: "Il Cavaliere della Notte · L'officina di Alfio", short: "L'officina di Alfio", sub: "Sotto la tribuna: trapani, bobine e un armadio chiuso", bg: "gr_officina", w: 16, h: 12, start: [7, 9], outside: ["gr_piazza", 14, 7],
        act: { T: "Guarda il banco da lavoro", L: "Guarda gli scaffali", n: "Guarda la foto", v: "Esci" },
        flavor: { T: "Il banco di Alfio: una torcia smontata, tre lenti, un cannocchiale tagliato a metà, una corda con un uncino. Su un foglio, a matita: «Visore — 2 cariche».", L: "Scaffali di palloni da riparare, reti arrotolate, bobine di filo di rame. Un barattolo con scritto «FUMO — NON APRIRE IN CASA»." },
        intro: [["voce", "Sotto la tribuna, dietro una porta di ferro senza maniglia, c'è un'officina. Odore di olio e di cuoio. Una lampadina pende dal soffitto e oscilla, anche se non c'è vento."]],
        npcs: () => [{ id: "gr_alfio", at: [7, 4] }],
        objects: { "12,1": () => { F.set("gr_foto", true); say([["voce", "Una foto in bianco e nero, appesa storta. Lo Stadio della Gru quarant'anni fa, la squadra in posa. In un angolo, mezzo fuori dall'inquadratura, una figura con un mantello grigio. Sotto, a penna: «Grazie, A.»"]]); } },
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(3, 5, 10, 5, "T"); lay(1, 1, 5, 1, "L"); put(12, 1, "n"); put(13, 9, "s"); },
      },
      gr_moli: {
        region: "porto", name: "Il Cavaliere della Notte · I Moli", short: "I Moli", sub: "Container, gru e le ronde del Sindacato", bg: "gr_moli", time: "notte", travel: [2, 21],
        w: 34, h: 24, start: [2, 21], sneakStart: [2, 21], itemCos: "gr_piume1", items: [[16, 2]],
        buio: 0.45, heroLight: 2.8, hide: "%",
        luci: () => [[11, 19, 3, "255,220,140"], [21, 9, 3, "255,220,140"], [29, 13, 3, "255,200,120"], [31, 3, 2.5, "255,180,90"]],
        areas: [[26, 1, 33, 6, "Il deposito del Molo Nove"], [0, 0, 33, 23, "I Moli"]],
        flavor: { l: "Un lampione del porto. Sotto la luce si vede tutto: anche te.", "%": "Un angolo buio fra i container. Qui le torce non arrivano." },
        intro: [["voce", "I Moli, di notte. Container impilati come mattoncini, una gru ferma con il gancio che dondola. Tre torce si muovono fra le file: le ronde del Sindacato."], ["voce", "Il registro è in una cassa di ferro, nel deposito in fondo al Molo Nove. Le zone scure (le macchie nere sul selciato) e le casse ti nascondono. Guarda dove guardano le torce."]],
        npcs: (s) => [
          ...(s === 2 && !F.is("gr_registro") ? [{ id: "gr_sg1", at: [10, 16], route: [[10, 16], [21, 16]], speed: 0.55, pause: 40, guard: { range: 4.5 } }, { id: "gr_sg2", at: [24, 4], route: [[24, 4], [24, 11]], speed: 0.5, pause: 50, guard: { range: 4 } }, { id: "gr_sg3", at: [29, 9], face: "down", guard: { range: 4, turn: 110 } }] : []),
          ...(s === 2 && F.is("gr_registro") ? [{ id: "gr_gancio", at: [28, 8] }] : []),
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 0, "w"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a"); lay(0, 23, 33, 23, "w"); put(0, 21, "<");
          lay(1, 1, 32, 22, ":");
          lay(4, 3, 7, 8, "E"); lay(10, 12, 15, 13, "E"); lay(18, 3, 19, 9, "E"); lay(22, 14, 27, 15, "E"); lay(12, 4, 15, 6, "K"); lay(3, 11, 5, 12, "K");
          lay(26, 1, 26, 6, "f"); lay(26, 6, 32, 6, "f"); put(26, 4, ":"); put(29, 6, ":");
          lay(7, 15, 8, 20, "%"); lay(16, 9, 17, 11, "%"); lay(20, 10, 21, 12, "%"); lay(25, 2, 25, 8, "%"); lay(2, 9, 6, 10, "%"); lay(28, 17, 31, 20, "%");
          put(11, 18, "l"); put(21, 8, "l"); put(29, 12, "l");
          put(31, 3, "x"); [[13, 20], [19, 19], [24, 11], [5, 17]].forEach(([x, y]) => put(x, y, "V"));
        },
      },
    };
    function giveRegistro() {
      if (F.is("gr_registro")) return say([["voce", "La cassa è vuota: il registro ce l'hai tu, avvolto nell'impermeabile."]]);
      F.set("gr_registro", true); K.evidence("registro", { t: "Il registro del Molo Nove", d: "Un quaderno con la copertina di cerata. Dentro: date di partite, nomi di arbitri, cifre. In fondo a ogni pagina la stessa sigla, «O.B.», e un disegno: una nuvola." }); K.giveClue && K.giveClue("registro");
      K.refreshZone();
      K.scene([["voce", "Dentro la cassa di ferro, avvolto nella cerata, c'è un quaderno. Date di partite. Nomi di arbitri. Cifre con tanti zeri. E in fondo a ogni pagina, la stessa sigla: «O.B.»"], ["gr_gancio", "[arrabbiato] (Una voce alle tue spalle, profonda come una sirena di nave.) Bel mantello. Peccato che sia bagnato. (Accende una torcia.) Quel quaderno è mio. E il Molo Nove è mio."]], () => K.enterZone("gr_moli"), "gr_moli");
    }
    function matchGancio() {
      K.notte({ title: "Ombre e Gadget · Sul Molo Nove contro i Portuali di Gancio", oppStyle: "pressing", minutes: 60,
        mates: [{ name: "Marisa" }, { name: "Lo Scaricatore" }], opp: { name: "I Portuali di Gancio", color: "#a83a2a", players: [{ name: "Gancio", skin: "#c68642", hair: "#3a2a1a" }, { name: "Bitta", skin: "#e0b890", hair: "#1a1a1a" }, { name: "Cima", skin: "#f0d0b0", hair: "#5a3a1a" }], keeper: { name: "Saracinesca" } },
        intro: "<p>Gancio non ti lascia andare: «Una partita sul molo, come si fa qui. Vinci, e il quaderno è tuo. Perdi, e il mantello finisce in mare.» Marisa, avvisata da un fischio, arriva di corsa. I Portuali fanno <b>pressing</b>: guarda bene le caselle rosse.</p>", winTitle: "IL MOLO È DELL'AIRONE!" }, (r) => {
        if (!r.win) return K.scene([["gr_gancio", r.a > 0 ? "[sorpreso] Hai segnato. Al Molo Nove. (Si gratta la barba.) Ma il quaderno resta qui finché non vinci. Ritorna quando vuoi: io sono sempre qui." : "[furbo] Il mantello è bello, ma i piedi sono bagnati. Riprova, Airone."]], () => K.enterZone("gr_moli"), "gr_moli");
        setStep(N, 3); bond("leggenda", 2); K.learnLore("l_gadget"); F.set("gr_gancio_visto", true);
        K.scene([["voce", "Fischio finale, se si può chiamare così il verso di una sirena di nave. Gancio resta fermo sotto la pioggia, con il pallone fra le mani."], ["gr_gancio", "[pensa] (Ti guarda a lungo.) I miei uomini lavorano per la Nebbia perché la Nebbia paga. Se un giorno pagherà qualcun altro… (Si gira.) Vattene, prima che ci ripensi."], ["gr_marisa", "[sorpreso] (Sottovoce.) Sei… sei tu? L'Airone delle storie di mio nonno? (Si morde il labbro.) Non lo dico a nessuno. Promesso."]], () => go("gr_piazza", 18, 15), "gr_moli");
      });
    }
    function allenamento() { // la partita secondaria: la modalità la scegli tu
      ask("gr_marisa", "Domenica giochiamo contro il Nebbia Athletic. Stasera ci alleniamo comunque, sotto la pioggia: come vuoi giocarla?", [
        { label: "Di notte, a turni", sub: "Ombre e Gadget · la partita della saga", cls: "hot", fn: () => K.notte({ title: "Ombre e Gadget · Allenamento sotto la pioggia", oppStyle: "equilibrata", minutes: 45, mates: [{ name: "Marisa" }, { name: "Il Terzino" }], opp: { name: "Le riserve del Porto Scuro", color: "#3a6a5a", players: [{ name: "Riserva Uno" }, { name: "Riserva Due" }, { name: "Riserva Tre" }], keeper: { name: "Il Vice" } }, intro: "<p>Partitella d'allenamento: prova la cintura senza pensieri.</p>" }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "gr_allenamento", alt: "az,cage,hd", force: false, oppTeam: "Le riserve", oppColor: "#3a6a5a", us: "Porto Scuro Calcio", homeKit: ["#5a6a8a", "#ffd23f"], mate: "Marisa Onda", squad: ["Marisa Onda", "Il Terzino", "Il Vice"], chap: "Il Cavaliere della Notte · Allenamento sotto la pioggia", bg: "gr_piazza", oppNames: ["Riserva Uno", "Riserva Due", "Riserva Tre", "Il Vice", "La Punta"], intro: "Allenamento sotto la pioggia, allo Stadio della Gru: il pallone scivola, i piedi pure.", done: after }) },
        { label: "Non stasera", fn: done },
      ], "gr_piazza");
      function after(r) { if (r && r.win && !F.is("gr_all1")) { F.set("gr_all1", true); bond("fiducia", 1); K.reward("gr_all1", { coins: 30 }); } K.scene([["gr_marisa", r && r.win ? "[felice] Così! Se giocassimo così anche domenica… (Si ferma.) Se ci lasciassero giocare così." : "[ride] Sotto la pioggia sbagliano tutti. Anche tu, vedo."]], () => K.enterZone("gr_piazza"), "gr_piazza"); }
    }
    const talk = {
      gr_marisa() {
        const s = S();
        if (s === 0) return ask("gr_marisa", "(Ti squadra da sotto il cappuccio.) Sei il nuovo numero dieci? Allora te lo dico subito: qui non si vince. Non si può. L'arbitro fischia rigori che non esistono, i nostri difensori ricevono telefonate di notte. Io ho trovato un biglietto sotto la porta: «Continuate così».\n\nSe vuoi capire, parla con Alfio. Il magazziniere, sotto la tribuna. Lui c'era, quarant'anni fa, l'ultima volta che è successo.", [
          { label: "«Ci vado subito»", fn: () => { setStep(N, 1); quest("gr_alfio", "Il magazziniere", "Alfio, sotto la tribuna dello Stadio della Gru."); bond("fiducia", 1); say([["gr_marisa", "[pensa] Bussa tre volte. E non dirgli che ti mando io: si offende se pensa che parliamo di lui."]]); } },
          { label: "«E tu perché giochi ancora?»", fn: () => { setStep(N, 1); quest("gr_alfio", "Il magazziniere", "Alfio, sotto la tribuna dello Stadio della Gru."); bond("fiducia", 2); say([["gr_marisa", "[triste] Perché se smetto, hanno vinto loro. (Si tira su il cappuccio.) Vai da Alfio. Sotto la tribuna."]]); } },
        ], "gr_piazza");
        if (s >= 1) return ask("gr_marisa", s >= 3 ? "[felice] (Ti fa l'occhiolino.) Non so niente, non ho visto niente. Però domenica gioco meglio, me lo sento." : "Alfio è sotto la tribuna. E stasera, se vuoi, ci alleniamo.", [{ label: "Allenamento sotto la pioggia", sub: "Partita secondaria · scegli tu la modalità", fn: allenamento }, { label: "Dopo", fn: done }], "gr_piazza");
        return done();
      },
      gr_alfio() {
        const s = S();
        if (s === 1) return K.scene([["gr_alfio", "[pensa] (Non alza gli occhi dal pallone che sta cucendo.) Marisa ti manda. Lo so, si sente da come bussi. (Un punto, un altro.) Quarant'anni fa è successa la stessa cosa. Partite comprate, giocatori spaventati, una città che abbassa la testa."], ["gr_alfio", "Poi una notte qualcuno è salito sui tetti con un mantello grigio. L'Airone, lo chiamavano. (Posa l'ago.) Tutti dicono che era una storia per bambini. Io ho le chiavi dell'armadio."], ["voce", "Alfio apre l'armadio. Dentro c'è un mantello grigio, nuovo, con le cuciture ancora lucide, e una cintura con quattro tasche."], ["gr_alfio", "[furbo] L'ho cucito l'anno scorso. Aspettavo qualcuno con le gambe giuste. (Ti mette in mano un cannocchiale tagliato.) Il Visore. Il Fumogeno. Il Mantello rinforzato. Il resto lo costruisco man mano. Stanotte, ai Moli: il Sindacato tiene un registro in una cassa di ferro."]], () => {
          F.set("gr_mantello", true); ["visore", "fumo", "scudo"].forEach((k) => K.newGadget(k)); K.learnLore("l_airone"); K.learnLore("l_furtivo"); questDone("gr_alfio"); quest("gr_registro", "Il registro del Molo Nove", "Nella cassa di ferro in fondo ai Moli. Resta nell'ombra.");
          setStep(N, 2); K.officina(() => say([["gr_alfio", "Buona cintura. Esci dalla piazza verso il porto, a destra. E ricordati: l'Airone sta fermo nell'ombra per ore, poi si muove una volta sola."]]));
        }, "gr_officina");
        if (s >= 2) return ask("gr_alfio", s >= 3 ? "[felice] Il registro! Lo sapevo che avevi le gambe giuste. (Lo sfoglia appena.) O.B. … Non dirmi niente. Non voglio saperlo ancora." : "Vuoi cambiare la cintura? Quattro tasche, non una di più: se le riempi troppo, l'Airone fa rumore.", [{ label: "L'officina", sub: "Scegli i gadget della cintura", fn: () => K.officina(done) }, { label: "Dopo", fn: done }], "gr_officina");
        return say([["gr_alfio", "(Cuce un pallone. Non alza gli occhi.) Il magazzino è chiuso. Per tutti."]]);
      },
      gr_gancio() {
        if (S() === 2 && F.is("gr_registro")) return ask("gr_gancio", "(Si mette fra te e l'uscita.) Una partita sul molo, Airone. Come si fa qui. Vinci, e il quaderno è tuo.", [{ label: "Gioca contro i Portuali", sub: "Ombre e Gadget · partita importante", cls: "hot", fn: matchGancio }, { label: "Non ancora", sub: "Ti nascondi un attimo", fn: done }], "gr_moli");
        return say([["gr_gancio", "Il Molo Nove è mio."]]);
      },
      gr_dora() {
        if (S() === 3) return ask("gr_dora", "(Impermeabile, cappello, una sigaretta spenta che non accende mai.) Commissaria Valli. Stanotte ai Moli c'è stato un gran movimento, e un testimone giura di aver visto un airone. (Ti guarda il fango sulle scarpe.) Se qualcuno avesse trovato un registro, quel qualcuno dovrebbe darlo alla legge. Con un registro posso aprire un'indagine vera. Senza, sono solo una donna con un impermeabile.", [
          { label: "Dalle il registro", sub: "La legge, con i suoi tempi", big: true, fn: () => fine1("dora") },
          { label: "«Non so di cosa parla»", sub: "Lo tieni tu: l'Airone indaga da solo", big: true, fn: () => fine1("ombra") },
        ], "gr_piazza");
        return say([["gr_dora", "Piove sempre, a Porto Scuro. Le prove si bagnano."]]);
      },
      gr_sg1() { return say([["gr_sg1", "(Fischietta. Non ti ha visto. Per ora.)"]]); },
      gr_sg2() { return say([["gr_sg2", "(Punta la torcia dall'altra parte, sbadigliando.)"]]); },
      gr_sg3() { return say([["gr_sg3", "(Si gira piano, a destra, poi a sinistra. Come un faro.)"]]); },
    };
    function fine1(kind) {
      if (kind === "dora") { F.set("gr_registro_dora", true); bond("fiducia", 3); } else { F.set("gr_registro_tuo", true); bond("leggenda", 3); }
      questDone("gr_registro");
      const msg = K.reward("c1:gr", { coins: 70, cos: ["gr_c1"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "dora" ? [["gr_dora", "[sorpreso] (Sfoglia il quaderno sotto la tettoia dell'edicola. Si ferma alla sigla.) O.B. … (Lo chiude.) Non so chi sei. Ma da stasera, a Porto Scuro, la legge ha una prova. Grazie, airone. O come ti chiami."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «I tetti di Porto Scuro».`]]
        : [["gr_dora", "[pensa] (Ti guarda a lungo.) Come vuole. (Si tocca il cappello.) Ma se cambia idea, il mio ufficio è sopra l'edicola. Di notte la luce è sempre accesa."], ["voce", "Quando se ne va, apri l'impermeabile: il registro è asciutto. In fondo all'ultima pagina, sotto la sigla O.B., c'è un indirizzo: «Deposito della Nebbia, oltre i tetti del mercato»."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «I tetti di Porto Scuro».`]], () => K.openMain(), "gr_piazza");
    }
    const obj = {
      "gr_piazza:>": () => (S() >= 2 ? go("gr_moli", 2, 21) : say([["voce", "La strada per i Moli. Di giorno ci sono solo gru ferme e gabbiani. Prima, forse, conviene sapere cosa cercare."]])),
      "gr_moli:<": () => go("gr_piazza", 27, 15),
      "gr_moli:x:31,3": () => giveRegistro(),
    };
    return { n: N, title: "La nebbia sul porto", sub: "La capitana, il magazziniere, il registro del Molo Nove", goal, start: "gr_piazza", introBg: "gr_titolo", zones, talk, obj,
      intro: () => [["voce", "<b>IL CAVALIERE DELLA NOTTE.</b> Capitolo 1. A Porto Scuro piove da trecento giorni. Le partite della Lega del Porto finiscono sempre come qualcuno ha deciso prima. E la città, stanca, ha smesso di guardarle."]] };
  }
  boot();
})();
