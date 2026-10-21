// js/mondiale-c2.js - «MONDIALE GIOVANILE» · Capitolo 2: Samba sulla Sabbia
// Rio: la spiaggia con il campetto di sabbia e il chiosco di Dona Bia, il quartiere con il campo di strada e la casa di Tico, lo stadio e la partita col Brasile.
(function () {
  "use strict";
  function boot() {
    const E = window.__mgCore;
    if (!E || !E.api || !E.api.addChapter || !window.__mgH || !window.__catena) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__mgH(K), { say, done } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    H.cast("mg_zefa", "Vovó Zefa", "Nonna di Tico", { style: "bun", hair: "#d4d4d8", acc: ["grembiule"], shirt: "#be123c", skin: "#a16a3c", bg: ["#831843", "#fbcfe8"] }, "Ha cresciuto un nipote e un'intera strada. Dice che il calcio le piace solo quando è lui a giocare.");
    K.cos("mg_c2", { kind: "shirt", label: "Maglia di Rio", val: "#fde047", from: "Capitolo 2 di Mondiale Giovanile" });
    K.lore("l_rio", { t: "Il calcio di strada di Rio", d: "A Rio il pallone non si prende: si balla. Chi gioca per strada impara a dribblare tra i motorini prima ancora di camminare dritto." });
    const goal = (s) => ({
      0: "Parla con Mister Gallo, sulla spiaggia.",
      1: "Trova Tico al campo di strada, nel quartiere (a est della spiaggia), e convincilo. Poi da Dona Bia, al chiosco.",
      2: "Con l'accredito, entra nello stadio (porta est del quartiere) e parla con il Capitão Duarte.",
      3: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");
    const names = () => K.crew.field().map((id) => K.crew.members[id].n.split(" ")[0]);
    function fin(win) {
      F.set("mg_c2_done", true);
      K.reward("mg_c2", { coins: win ? 130 : 80, cos: "mg_c2" }); setStep(N, 3);
      K.finishChapter(N, win ? "ok" : "ko");
      K.scene(H.flush().concat([["voce", `<b>FINE DEL CAPITOLO 2.</b><br>🔥 Grinta ${K.stat("grinta")} · 🤝 Intesa ${K.stat("intesa")} · Squadra ${K.crew.count()}/${K.crew.total} · Catene perfette ${K.chain.perfect()}`], ["voce", "Il Capitolo 3, «Ghiaccio e Acciaio», vi porta al Nord."]]), () => K.openMain(), "mg_spiaggia");
    }
    const lost = () => K.ask("voce", "Partita persa (o abbandonata). La storia non va avanti con una sconfitta: vuoi riprovare?", [{ label: "Riprova la partita", cls: "hot", fn: () => match() }, { label: "Più tardi", fn: K.done }]);
    function match() {
      K.say(H.flush(), () => K.playMatch({
        id: "mg_rio", alt: "az,cage,hd", force: false, squad: names().slice(0, 3), mate: names()[0] || "Elio", us: "Italia U16", oppTeam: "Brasile U16", oppColor: "#16a34a", homeKit: ["#1d4ed8", "#f8fafc"],
        oppNames: ["Gabriel", "Rafa", "Thiago", "Leo"], intro: "Stadio di Rio · Girone del Mondiale: Italia contro Brasile. Il pubblico balla prima di sedersi.", done: (r) => (r.win ? fin(true) : lost())
      }));
    }
    const mare = "Z";
    const zones = {
      mg_spiaggia: {
        region: "spiaggia", name: "La spiaggia di Rio", short: "Spiaggia", sub: "Sabbia, palme e un campetto con le porte di legno", bg: "mg_spiaggia", time: "giorno", w: 36, h: 22, base: "b", start: [2, 11], sneakStart: [2, 11],
        itemCos: "mg_c2", items: [[5, 9], [20, 15], [30, 10], [15, 19]],
        areas: [[0, 0, 35, 4, "La promenade"], [9, 8, 26, 16, "Il campetto di sabbia"], [0, 17, 35, 21, "Il mare"], [0, 0, 35, 21, "La spiaggia di Rio"]],
        act: { Y: "Guarda la casa", E: "Guarda la palma", C: "Leggi il cartellone", G: "Guarda la porta", U: "Guarda l'ombrellone", L: "Guarda il lampione", Z: "Guarda il mare", N: "Guarda il borsone" },
        flavor: { Y: "Una casa gialla con una veranda e un amaca: dentro, qualcuno ascolta la radio, qualcuno canta.", E: "Una palma carica di cocchi che nessuno ha il coraggio di toccare.", C: "«Caipirinha analcolica: R$ 5. Con consiglio incluso.»", G: "Una porta di legno. Il palo sinistro è un'asta di bandiera, il destro una scopa.", U: "Un ombrellone a righe, sotto cui qualcuno ha dimenticato un paio di ciabatte.", L: "Un lampione con una treccia di lucine colorate.", Z: "L'oceano, grande e blu. Qualcuno, lontano, sta surfando; qualcun altro, vicino, sta perdendo un pallone.", N: "Un borsone con tre palloni da spiaggia e un pacchetto di biscotti al cocco." },
        objects: {},
        doors: { "17,4": { to: "mg_chiosco", at: [8, 8] }, "35,11": { to: "mg_quartiere", at: [1, 11] } },
        npcs: () => [{ id: "mg_gallo", at: [6, 10], face: "right" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 21, "b"); lay(0, 0, 35, 1, "E"); lay(2, 2, 9, 4, "Y"); lay(14, 2, 21, 4, "Y"); lay(26, 2, 33, 4, "Y"); put(17, 4, "q"); lay(16, 5, 18, 5, "g");
          lay(0, 5, 35, 7, "g"); put(4, 6, "C"); put(24, 6, "C"); put(30, 6, "C");
          put(8, 11, "G"); put(8, 12, "G"); put(27, 11, "G"); put(27, 12, "G");
          [[3, 9], [31, 9], [4, 15], [31, 15], [12, 16], [22, 9]].forEach(([x, y]) => put(x, y, "U")); put(24, 15, "N");
          lay(0, 17, 35, 21, "Z"); lay(14, 17, 15, 20, "m"); put(14, 20, "L");
          [[1, 9], [34, 13], [2, 15], [33, 16], [11, 9], [26, 16]].forEach(([x, y]) => put(x, y, "E"));
          put(35, 11, "q"); lay(34, 10, 34, 12, "g");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CHIOSCO BIA", d.X(17) + 8, d.Y(4) + 4, "#fde047"); H.plaque(g, "PRAIA DO RIO", d.X(18) + 8, d.Y(5) + 12, "#bae6fd"); }
      },
      mg_quartiere: {
        region: "quartiere", name: "Il quartiere sul colle", short: "Quartiere", sub: "Case a colori, scalinate e un campo di strada con le porte disegnate col gesso", bg: "mg_quartiere", time: "giorno", w: 32, h: 22, base: "g", start: [2, 11], sneakStart: [2, 11],
        itemCos: "mg_c2", items: [[5, 8], [26, 8], [14, 17], [28, 13]],
        areas: [[11, 9, 21, 14, "Il campo di strada"], [0, 0, 31, 6, "Le case in alto"], [0, 15, 31, 21, "La parte bassa"], [0, 0, 31, 21, "Il quartiere sul colle"]],
        act: { Y: "Guarda la casa", E: "Guarda la palma", C: "Leggi il cartellone", G: "Guarda la porta", L: "Guarda il lampione", M: "Guarda il muretto", B: "Siediti in panchina", N: "Guarda il borsone" },
        flavor: { Y: "Una casa rosa con panni stesi e una radio che suona samba a volume ragionevole, cioè altissimo.", E: "Una palma che cresce in un vaso e ha accettato il suo destino.", C: "«La peña della domenica: ingresso libero, birra no.»", G: "Una porta disegnata col gesso su un muro. Ogni gol, una riga di vernice in più.", L: "Un lampione con un paio di scarpini appesi: un classico.", M: "Un muretto dove i vecchi guardano giocare i giovani, e viceversa.", B: "Una panchina con una scritta: «Qui si perde, ma si perde bene».", N: "Una borsa di tela con una maglia e un paio di scarpini bucati." },
        objects: {},
        doors: { "0,11": { to: "mg_spiaggia", at: [34, 11] }, "15,5": { to: "mg_casa", at: [7, 8] }, "31,11": { to: "mg_stadio", at: [1, 11], locked: () => (K.inv.has("mg_biglietto") ? false : "Il cancello dello stadio è chiuso. Serve un accredito (Dona Bia ne sa qualcosa).") } },
        npcs: () => [{ id: "mg_tico", at: [16, 12], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "g"); lay(0, 0, 31, 1, "E"); lay(2, 2, 9, 5, "Y"); lay(12, 2, 19, 5, "Y"); lay(22, 2, 29, 5, "Y"); put(15, 5, "q"); lay(2, 16, 9, 19, "Y"); lay(22, 16, 29, 19, "Y");
          lay(11, 9, 21, 14, "e"); lay(11, 9, 21, 9, "l"); lay(11, 14, 21, 14, "l"); lay(11, 10, 11, 13, "j"); lay(21, 10, 21, 13, "j"); lay(16, 10, 16, 13, "j"); put(11, 9, "x"); put(21, 9, "x"); put(11, 14, "x"); put(21, 14, "x");
          put(10, 11, "G"); put(10, 12, "G"); put(22, 11, "G"); put(22, 12, "G");
          put(6, 7, "C"); put(26, 7, "C"); put(9, 8, "L"); put(23, 8, "L"); put(9, 15, "L"); put(23, 15, "L"); put(14, 16, "B"); put(17, 16, "B"); put(1, 17, "N");
          [[1, 10], [30, 10], [1, 13], [30, 14], [12, 7], [19, 7]].forEach(([x, y]) => put(x, y, "E")); lay(12, 20, 19, 20, "M");
          put(0, 11, "q"); put(31, 11, "q"); lay(1, 10, 3, 12, "g");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CASA ZEFA", d.X(15) + 8, d.Y(5) + 4, "#fde047"); H.plaque(g, "CAMPO DE RUA", d.X(16) + 8, d.Y(9) + 4, "#bbf7d0"); }
      },
      mg_stadio: {
        region: "stadio", name: "Lo stadio di Rio", short: "Stadio", sub: "Spalti colorati, bandiere e un coro che comincia prima del calcio d'inizio", bg: "mg_stadio", time: "giorno", w: 34, h: 22, base: "g", start: [2, 11], sneakStart: [2, 11],
        itemCos: "mg_c2", items: [[3, 7], [31, 10], [16, 21], [2, 18]],
        areas: [[2, 2, 31, 5, "Le tribune"], [6, 8, 28, 19, "Il campo"], [0, 0, 33, 21, "Lo stadio di Rio"]],
        act: { T: "Guarda la tribuna", G: "Guarda la porta", B: "Siediti in panchina", C: "Leggi il cartellone", L: "Guarda il riflettore", M: "Guarda il muretto", E: "Guarda la palma", N: "Guarda il borsone" },
        flavor: { T: "Una tribuna a gradoni, gialla e verde, con una batteria di tamburi che aspetta il segnale.", G: "Una porta con la rete bianca e perfetta. A Rio, di solito, la rete è un'opinione.", B: "Una panchina di squadra: imbottita, calda, con un nome inciso sotto ogni posto.", C: "«Mondiale Giovanile · Rio · Ingresso a gruppi».", L: "Un riflettore di cinque metri: di sera, il campo diventa un quadro.", M: "Un muretto con i nomi dei campioni locali. Il più antico ha la grafia di un bambino.", E: "Una palma da stadio: curata, potata, finta quasi come un cartone.", N: "Un borsone con tre paia di scarpini e un biglietto: «Fatemi segnare»." },
        objects: {},
        doors: { "0,11": { to: "mg_quartiere", at: [30, 11] } },
        npcs: () => [{ id: "mg_duarte", at: [17, 6], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 21, "g"); lay(2, 2, 31, 5, "T"); lay(0, 0, 33, 1, "E");
          lay(6, 8, 28, 19, "e"); lay(6, 8, 28, 8, "l"); lay(6, 19, 28, 19, "l"); lay(6, 9, 6, 18, "j"); lay(28, 9, 28, 18, "j"); lay(17, 9, 17, 18, "j"); put(6, 8, "x"); put(28, 8, "x"); put(6, 19, "x"); put(28, 19, "x");
          put(5, 13, "G"); put(5, 14, "G"); put(29, 13, "G"); put(29, 14, "G"); lay(8, 7, 14, 7, "C"); lay(20, 7, 26, 7, "C"); put(3, 13, "B"); put(3, 14, "B"); put(31, 13, "B"); put(31, 14, "B");
          put(5, 6, "L"); put(28, 6, "L"); put(5, 20, "L"); put(28, 20, "L"); put(3, 20, "N");
          put(0, 11, "q"); lay(1, 10, 3, 12, "g");
        },
        decor(g, cx, cy, d) { H.plaque(g, "ESTÁDIO DO RIO", d.X(16) + 8, d.Y(2) + 4, "#fde047"); }
      },
      mg_chiosco: {
        interior: true, region: "interno", name: "Il chiosco di Dona Bia", short: "Chiosco", sub: "Cocco, ventilatori e una radio che non si spegne mai", bg: "mg_hotel", w: 16, h: 11, start: [8, 8], outside: ["mg_spiaggia", 17, 5],
        act: { D: "Guarda il tavolo", V: "Guarda la vetrata", S: "Guarda il trofeo", K: "Guarda la dispensa", N: "Guarda la cassa" },
        flavor: { D: "Un tavolino di legno con una tovaglia a fiori e due cocchi con la cannuccia.", V: "Una finestra con la tenda di perline: attraverso si vede il mare, in trasparenza.", S: "Una coppa «Miglior chiosco del litorale 2037» (autoassegnata).", K: "Una dispensa con quattro tipi di cocco e due di fantasia.", N: "Una cassa di frutta tropicale: la metà non ha ancora un nome italiano." },
        objects: {}, doors: {},
        npcs: () => [{ id: "mg_bia", at: [8, 4], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "m"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(2, 2, 3, 2, "V"); lay(12, 2, 13, 2, "V"); lay(5, 2, 6, 2, "K"); lay(10, 2, 11, 2, "K"); lay(3, 6, 5, 6, "D"); lay(10, 6, 12, 6, "D"); put(2, 8, "N"); put(13, 8, "S");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CHIOSCO BIA", d.X(8) + 8, d.Y(1) + 4, "#fde047"); }
      },
      mg_casa: {
        interior: true, region: "interno", name: "La casa di Vovó Zefa", short: "Casa", sub: "Un divano che ha sentito tutte le partite e una foto sul muro", bg: "mg_hotel", w: 14, h: 10, start: [7, 8], outside: ["mg_quartiere", 15, 6],
        act: { D: "Siediti sul divano", S: "Guarda la foto", V: "Guarda la finestra", K: "Guarda la dispensa", N: "Guarda il cesto" },
        flavor: { D: "Un divano coperto da un telo ricamato, con l'impronta di un nipote.", S: "Una foto sul muro: un uomo giovane con una maglia a righe e un pallone tra le mani. Sul retro, a matita: «Mestre Zé».", V: "Una finestra con i vetri colorati: il sole fa tre colori sul pavimento.", K: "Una credenza con piatti dipinti a mano.", N: "Un cesto con filo, uncinetti e un paio di scarpini mai usati." },
        objects: {}, doors: {},
        npcs: () => [{ id: "mg_zefa", at: [7, 4], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "m"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(2, 2, 4, 2, "K"); put(9, 2, "S"); put(11, 2, "V"); lay(2, 5, 3, 5, "D"); put(11, 6, "N"); put(2, 7, "N");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CASA ZEFA", d.X(7) + 8, d.Y(1) + 4, "#fbcfe8"); }
      }
    };
    const talk = {
      mg_gallo() {
        if (K.rel.scene("mg_gallo")) return;
        const s = S();
        if (s === 0) {
          say("mg_gallo", "[serio] Rio. Il Mondiale vero comincia qui: il Brasile non gioca a calcio, lo recita. E noi dobbiamo rispondere senza recitare.");
          say("mg_gallo", "Serve un'ala che dribbli nei vicoli: Tico Valente, quartiere sul colle. Dicono che non porti mai la palla in linea retta. Convincilo. Poi da Dona Bia, al chiosco: lei sa come entrare nello stadio senza vergogna.");
          K.rel.add("mg_gallo", 1, true); setStep(N, 1); quest("mg_c2", "Mondiale Giovanile", "Convinci Tico nel quartiere sul colle."); return done();
        }
        say("mg_gallo", s === 1 ? "[serio] Tico e poi Bia. In quest'ordine, se riesci." : s === 2 ? "[serio] Con l'accredito, allo stadio. Duarte vi aspetta." : "[serio] Brasile fatto. Ora il Nord."); done();
      },
      mg_tico() {
        if (K.rel.scene("mg_tico")) return;
        H.recruit("mg_tico", { level: 2, opp: "Tico Valente", title: "Catena · Contro Tico", helpLabel: "Balla con lui un samba mentre palleggia", intro: "[furbo] Italiano? Troppa tattica, poca ginga. Ti propongo un affare: se mi segui, ti seguo. Se non mi segui, ci vediamo domenica alla peña.", win: "[sorpreso] Hai passato la palla senza guardare! Vengo. E ti insegno a ballare, nel caso.", help: "Balli con lui un samba mentre palleggia. Pesti tre volte il piede sbagliato e lui ride sempre di più. Alla fine ti dà un cinque.", helpWin: "[felice] Almeno hai ritmo, a modo tuo. Vengo con voi!" });
      },
      mg_bia() {
        if (K.rel.scene("mg_bia")) return;
        const s = S();
        if (s === 1) {
          if (!K.crew.has("mg_tico")) { say("mg_bia", "[furbo] Il pass allo stadio lo do a chi ha amici. Hai già parlato con Tico, quello del campo di strada?"); return done(); }
          say("mg_bia", "[felice] Tico viene con voi! Era l'unico del quartiere che non voleva lasciarlo. Ecco: il mio accredito di cuoca ufficiale. Fa entrare anche gli italiani, se sorridono.");
          K.inv.give("mg_biglietto"); K.inv.give("mg_pallone"); K.bond("intesa", 2); K.rel.add("mg_bia", 2, true); setStep(N, 2); quest("mg_c2", "Mondiale Giovanile", "Allo stadio con l'accredito: parla con Duarte.");
          say("voce", "Ottieni l'<b>Accredito allo stadio</b> e il <b>Pallone del Mondiale</b>."); return done();
        }
        say("mg_bia", s === 0 ? "[ride] Benvenuto a Rio. Una cuccagna di cocco e una montagna di consigli, tutto incluso." : "[felice] Vai e vinci. Ma, per l'amor del samba, non rubare il pallone a Tico."); done();
      },
      mg_zefa() {
        if (K.rel.scene("mg_zefa")) return;
        say("mg_zefa", "[triste] Tico non vuole che io lo dica, ma suo padre, Mestre Zé, giocava nella stessa strada. Una caduta, tanti anni fa, e non ha più giocato.");
        say("mg_zefa", "[felice] Tico va al Mondiale per lui. Ma non lo vuole ammettere: dice che lo fa «per i soldi dei tifosi». Dagli una mano, quando può bastare un passaggio.");
        if (!F.is("mg_zefa_gift")) { F.set("mg_zefa_gift", true); K.bond("intesa", 2); say("voce", "Vovó Zefa ti stringe la mano con le due sue. <b>Intesa +2</b>."); }
        K.rel.add("mg_zefa", 1, true); done();
      },
      mg_duarte() {
        if (K.rel.scene("mg_duarte")) return;
        const s = S();
        if (s === 2) {
          say("mg_duarte", "[felice] Gli italiani! Il Brasile ha una regola: nessuna partita è una cosa seria. E una regola più importante: la si vince lo stesso.");
          say("mg_duarte", "Non ci sono schemi, qui: c'è un solo schema, e si chiama divertirsi. Se riuscite a farci smettere di sorridere, vi stringo la mano.");
          return match();
        }
        say("mg_duarte", s < 2 ? "[serio] Il campo è chiuso, ragazzo. Torna con un accredito." : "[felice] Belo jogo. Ci vediamo in finale, se Dio e il samba vogliono."); done();
      }
    };
    return {
      n: N, title: "Samba sulla Sabbia", sub: "Rio, il campo di strada e il Brasile",
      goal, start: "mg_spiaggia", introBg: "mg_spiaggia", zones, talk, obj: {},
      intro: [["voce", "Rio de Janeiro. L'aria sa di cocco e di sale, e il campetto di sabbia è già pieno di bambini che palleggiano con le ciabatte."], ["mg_gallo", "[serio] Se qualcuno vi chiede la Catena, rispondete con un ballo. Ma poi passatevi la palla."]]
    };
  }
  boot();
})();
