// js/mondiale-c1.js - «MONDIALE GIOVANILE» · Capitolo 1: Il Raduno
// Il Colle di Rondine (ingresso del Centro Tecnico), il villaggio con il campo, lo spogliatoio e la mensa. Cinque convocati da reclutare (due vie ciascuno), la prima Catena, l'amichevole.
(function () {
  "use strict";
  function boot() {
    const E = window.__mgCore;
    if (!E || !E.api || !E.api.addChapter || !window.__mgH || !window.__catena) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__mgH(K), { say, done, ask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("mg_c1", { kind: "shirt", label: "Maglia del Raduno", val: "#1d4ed8", from: "Capitolo 1 di Mondiale Giovanile" });
    K.lore("l_catena", { t: "La Catena", d: "Tre passaggi puliti e un tiro: la firma dell'Italia U16. Funziona solo se ognuno sa a chi dare la palla, e perché." });
    const goal = (s) => ({
      0: "Parla con Mister Gallo, sul colle.",
      1: "Al villaggio (a est) recluta almeno 3 convocati: Elio, Nina, Bruno al campo, Teo nello spogliatoio, Sandro in mensa. Poi torna da Gallo.",
      2: "Parla con Gallo: c'è l'amichevole.",
      3: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");
    const names = () => K.crew.field().map((id) => K.crew.members[id].n.split(" ")[0]);
    function fin(win) {
      F.set("mg_c1_done", true);
      K.reward("mg_c1", { coins: win ? 110 : 70, cos: "mg_c1" }); setStep(N, 3);
      K.finishChapter(N, win ? "ok" : "ko");
      K.scene(H.flush().concat([["voce", `<b>FINE DEL CAPITOLO 1.</b><br>🔥 Grinta ${K.stat("grinta")} · 🤝 Intesa ${K.stat("intesa")} · Squadra ${K.crew.count()}/${K.crew.total}`], ["voce", "Il Capitolo 2, «Samba sulla Sabbia», ti aspetta a Rio."]]), () => K.openMain(), "mg_colle");
    }
    function match() {
      K.say(H.flush(), () => K.playMatch({
        id: "mg_amichevole", alt: "az,cage,hd", force: false, squad: names().slice(0, 3), mate: names()[0] || "Elio", us: "Italia U16", oppTeam: "Selezione Nord", oppColor: "#7c2d12", homeKit: ["#1d4ed8", "#f8fafc"],
        oppNames: ["Cesare", "Dino", "Ettore", "Fabio"], intro: "Centro Tecnico di Rondine · Amichevole del raduno. Il CT guarda in silenzio.", done: (r) => fin(!!r.win)
      }));
    }
    const zones = {
      mg_colle: {
        region: "colle", name: "Il Colle di Rondine", short: "Colle", sub: "Pini, cicale e il cancello del Centro Tecnico", bg: "mg_colle", time: "giorno", w: 32, h: 22, base: "e", start: [2, 11], sneakStart: [2, 11],
        itemCos: "mg_c1", items: [[5, 9], [17, 17], [27, 15], [8, 4]],
        areas: [[0, 13, 10, 20, "Il parcheggio"], [11, 3, 20, 6, "Il Centro Tecnico"], [22, 3, 31, 20, "Il cancello e il villaggio"], [0, 0, 31, 21, "Il Colle di Rondine"]],
        act: { A: "Guarda il pino", R: "Guarda la roccia", C: "Leggi il cartellone", N: "Guarda il pullman", L: "Guarda il riflettore", M: "Guarda il muretto", B: "Siediti in panchina", P: "Guarda il Centro Tecnico" },
        flavor: { A: "Un pino con più cicale che aghi.", R: "Una roccia dove un ragazzo, dieci anni fa, ha inciso un nome: «Ugo, Mondiale 2038».", C: "«Rondine U16: venti ragazzi, un solo pallone.» Qualcuno ha aggiunto: «Per ora».", N: "Il pullman della Nazionale: azzurro, con un autista che dorme sul volante.", L: "Un riflettore che illumina il parcheggio e le speranze di tutti.", M: "Un muretto con le firme dei convocati degli anni passati.", B: "Una panchina in cima al colle. Da lì si vede il mare, o almeno si immagina.", P: "Il Centro Tecnico: tre piani, due palestre e un'ala che nessuno apre mai." },
        objects: {},
        doors: { "31,11": { to: "mg_villaggio", at: [2, 12] } },
        npcs: () => [{ id: "mg_gallo", at: [14, 11], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "e"); lay(0, 0, 31, 2, "A"); [[3, 1], [9, 2], [17, 1], [25, 2], [29, 0]].forEach(([x, y]) => put(x, y, "R"));
          lay(0, 10, 31, 12, "g"); lay(14, 7, 17, 9, "g"); lay(11, 3, 20, 6, "P"); lay(2, 14, 9, 19, "g"); put(4, 15, "N"); put(6, 15, "N");
          lay(22, 8, 22, 9, "M"); lay(22, 13, 22, 15, "M"); put(3, 8, "C"); put(9, 8, "C"); put(25, 9, "C");
          put(10, 9, "L"); put(21, 9, "L"); put(14, 14, "B"); put(16, 14, "B");
          [[3, 5], [6, 6], [25, 5], [28, 6], [26, 17], [29, 19], [12, 18], [19, 19], [22, 16], [2, 20]].forEach(([x, y]) => put(x, y, "A"));
          put(31, 11, "q"); lay(30, 10, 30, 12, "g");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CENTRO TECNICO", d.X(15) + 8, d.Y(3) + 4, "#fde047"); H.plaque(g, "RONDINE U16", d.X(24) + 8, d.Y(8) + 4, "#bfdbfe"); }
      },
      mg_villaggio: {
        region: "ritiro", name: "Il Villaggio del Raduno", short: "Villaggio", sub: "Casette, un campo a righe e venti ragazzi con le scarpe slacciate", bg: "mg_villaggio", time: "giorno", w: 34, h: 24, base: "e", start: [2, 12], sneakStart: [2, 12],
        itemCos: "mg_c1", items: [[7, 18], [26, 9], [3, 19], [31, 19]],
        areas: [[2, 2, 31, 4, "Le casette"], [5, 7, 28, 20, "Il campo"], [0, 0, 33, 23, "Il Villaggio del Raduno"]],
        act: { P: "Guarda la casetta", G: "Guarda la porta", B: "Siediti in panchina", C: "Leggi il cartellone", A: "Guarda il pino", L: "Guarda il riflettore", M: "Guarda il muretto", N: "Guarda il borsone", T: "Guarda la tribuna" },
        flavor: { P: "Una casetta del raduno: quattro letti, una finestra rotta e un poster di una squadra che non esiste più.", G: "Una porta con la rete rattoppata con lo spago. Il portiere dice che porta fortuna.", B: "Una panchina di legno con venti nomi incisi e una macchia di panino.", C: "«Il gioco di squadra comincia con un buongiorno».", A: "Un pino che ha visto passare dieci Nazionali.", L: "Un riflettore con una lampadina in meno. Si accende solo se lo guardi.", M: "Un muretto di pietra, da cui si vede l'intero campo.", N: "Un borsone con scarpini e un panino che aspetta il suo destino.", T: "Una piccola tribuna di legno: gli spettatori sono ragazzi che non giocano." },
        objects: {},
        doors: { "0,12": { to: "mg_colle", at: [30, 11] }, "6,4": { to: "mg_spogliatoio", at: [9, 9] }, "27,4": { to: "mg_mensa", at: [8, 8] } },
        npcs: () => [{ id: "mg_mara", at: [7, 6], face: "down" }, { id: "mg_elio", at: [11, 5], face: "down" }, { id: "mg_nina", at: [20, 10], face: "left" }, { id: "mg_bruno", at: [24, 15], face: "left" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 23, "e"); lay(0, 0, 33, 1, "A"); lay(0, 21, 33, 23, "A"); lay(3, 2, 9, 4, "P"); lay(24, 2, 30, 4, "P"); put(6, 4, "q"); put(27, 4, "q"); lay(6, 5, 7, 6, "g"); lay(26, 5, 28, 6, "g");
          lay(5, 8, 28, 20, "e"); lay(5, 7, 28, 7, "l"); lay(5, 20, 28, 20, "l"); lay(5, 8, 5, 19, "j"); lay(28, 8, 28, 19, "j"); lay(16, 8, 16, 19, "j"); put(5, 7, "x"); put(28, 7, "x"); put(5, 20, "x"); put(28, 20, "x");
          put(4, 13, "G"); put(4, 14, "G"); put(29, 13, "G"); put(29, 14, "G");
          lay(10, 6, 13, 6, "B"); lay(18, 6, 22, 6, "C"); put(5, 6, "L"); put(28, 6, "L"); put(5, 21, "L"); put(28, 21, "L"); lay(30, 8, 33, 10, "T");
          [[2, 5], [31, 6], [2, 17], [32, 17], [1, 9], [32, 14]].forEach(([x, y]) => put(x, y, "A")); lay(1, 12, 4, 12, "g"); put(0, 12, "q"); put(2, 22, "M"); put(3, 22, "M"); put(20, 4, "N"); put(21, 4, "N");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SPOGLIATOIO", d.X(6) + 8, d.Y(3) + 4, "#bfdbfe"); H.plaque(g, "MENSA", d.X(27) + 8, d.Y(3) + 4, "#fde047"); H.plaque(g, "CAMPO 1", d.X(16) + 8, d.Y(7) + 4, "#bbf7d0"); }
      },
      mg_spogliatoio: {
        interior: true, region: "interno", name: "Lo spogliatoio azzurro", short: "Spogliatoio", sub: "Armadietti, borsoni e una lavagna con un piano illeggibile", bg: "mg_spogliatoio", w: 18, h: 12, start: [9, 9], outside: ["mg_villaggio", 6, 5],
        act: { K: "Guarda l'armadietto", N: "Guarda il borsone", B: "Siediti in panchina", S: "Guarda il trofeo", V: "Guarda la vetrata" },
        flavor: { K: "Un armadietto con un nome scritto col pennarello e un biglietto: «Non mi toccare il panino».", N: "Un borsone aperto: due scarpini, un calzino e un pallone da muro.", B: "Una panchina da spogliatoio, con segni di tacchetti e di preghiere.", S: "Una coppa di latta: «Miglior spogliatoio 2036».", V: "Una vetrata con vista sul campo: i più nervosi guardano qui prima di entrare." },
        objects: {}, doors: {},
        npcs: () => [{ id: "mg_teo", at: [9, 5], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 11, "w"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 11, "a"); lay(17, 0, 17, 11, "a"); lay(0, 11, 17, 11, "a"); put(9, 11, "v");
          lay(2, 2, 7, 2, "K"); lay(10, 2, 15, 2, "K"); put(8, 2, "S"); put(9, 2, "V"); lay(3, 7, 6, 7, "B"); lay(11, 7, 14, 7, "B"); put(2, 9, "N"); put(15, 9, "N");
        },
        decor(g, cx, cy, d) { H.plaque(g, "AZZURRI", d.X(9) + 8, d.Y(1) + 4, "#bfdbfe"); }
      },
      mg_mensa: {
        interior: true, region: "interno", name: "La mensa del raduno", short: "Mensa", sub: "Pasta in bianco, panini e un orologio che segna sempre l'ora di pranzo", bg: "mg_hotel", w: 16, h: 11, start: [8, 8], outside: ["mg_villaggio", 27, 5],
        act: { D: "Guarda il tavolo", V: "Guarda la vetrata", S: "Guarda il trofeo", N: "Guarda la cassa", K: "Guarda la dispensa" },
        flavor: { D: "Un lungo tavolo di legno con una tovaglia a quadri e un cestino di pane che è già a metà.", V: "Una vetrata con la vista sul campo: si mangia guardando chi ha ancora fame.", S: "Una coppa vinta a calcetto dallo staff: «Cuochi FC 2037».", N: "Una cassa di arance che nessuno sa chi ha ordinato.", K: "La dispensa: pasta, pasta e un barattolo di Nutella con il nome del CT." },
        objects: {}, doors: {},
        npcs: () => [{ id: "mg_sandro", at: [8, 5], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "m"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(2, 2, 3, 2, "V"); lay(12, 2, 13, 2, "V"); lay(3, 4, 5, 4, "D"); lay(10, 4, 12, 4, "D"); lay(3, 7, 5, 7, "D"); lay(10, 7, 12, 7, "D"); put(7, 2, "K"); put(8, 2, "K"); put(9, 2, "S"); put(2, 8, "N");
        },
        decor(g, cx, cy, d) { H.plaque(g, "MENSA", d.X(8) + 8, d.Y(1) + 4, "#fde047"); }
      }
    };
    const talk = {
      mg_gallo() {
        if (K.rel.scene("mg_gallo")) return;
        const s = S();
        if (s === 0) {
          say("mg_gallo", "[serio] Voi siete i convocati dell'Italia Under 16. Io sono Mister Gallo. Non dico «bene» finché non lo penso, e lo penso di rado.");
          say("mg_gallo", "La nostra arma si chiama Catena: tre passaggi puliti e un tiro. Non serve il fenomeno: serve che ognuno sappia a chi dare la palla.");
          say("mg_gallo", "Al villaggio, a est, ci sono i convocati. Parla con loro: me ne servono almeno tre in squadra. Ti conviene metterci un po' di gentilezza. O un po' di tempismo.");
          K.rel.add("mg_gallo", 2, true); setStep(N, 1); quest("mg_c1", "Mondiale Giovanile", "Recluta almeno 3 convocati al villaggio."); return done();
        }
        if (s === 1) {
          if (K.crew.count() < 3) { say("mg_gallo", `[serio] Hai ${K.crew.count()} compagni. Me ne servono almeno tre. Il villaggio è a est.`); return done(); }
          say("mg_gallo", "[pensa] Tre, almeno. Bene. Ora una prova: voglio vedere se la Catena la sai anche giocare.");
          return H.chain(1, "Staff del CT", "Catena · Prova del CT", (r) => {
            if (r && r.win) { setStep(N, 2); K.bond("intesa", 3); K.learnLore("l_catena"); quest("mg_c1", "Mondiale Giovanile", "Parla di nuovo con Gallo: amichevole."); say("mg_gallo", "[serio] Passaggi puliti, tiro nell'angolo. Non è un complimento: è una constatazione. Domani c'è l'amichevole."); }
            else say("mg_gallo", "[serio] Intercettato. Capita. La Catena si impara: ritenta quando vuoi.");
            done();
          });
        }
        if (s === 2) { say("mg_gallo", "[serio] L'amichevole contro la Selezione Nord. Gioca come sai e passa la palla. La prima delle due cose è facoltativa."); return match(); }
        say("mg_gallo", s >= 3 ? "Il raduno è finito. Il Mondiale comincia in Brasile." : "Parla con me quando sei pronto."); done();
      },
      mg_mara() {
        if (K.rel.scene("mg_mara")) return;
        say("mg_mara", "[felice] Dottoressa Mara, medico e analista. Misuro i polpacci e leggo le partite come radiografie.");
        say("mg_mara", "La Catena è un'idea semplice: ogni ruolo ha un amico. Il regista passa all'ala, l'ala alla punta. Se metti insieme chi si capisce, la linea tra i difensori è più larga e il tiro più sicuro. Se non si capiscono, ci pensa il caso.");
        if (!K.inv.has("mg_borraccia")) { K.inv.give("mg_borraccia"); say("voce", "Ottieni la <b>Borraccia del raduno</b>: nella Catena perdona un intercetto."); }
        K.rel.add("mg_mara", 1, true); done();
      },
      mg_elio() {
        if (K.rel.scene("mg_elio")) return;
        H.recruit("mg_elio", { level: 1, opp: "Elio Moro", title: "Catena · Contro Elio", helpLabel: "Portagli la palla in panchina e ascoltalo", intro: "[serio] Il novellino. Mi dicono che hai talento. Io penso che il talento sia la scusa di chi non guarda il campo.", win: "[sorpreso] Passaggi puliti e tiro a giro. Accetto. Ma mi tengo il diritto di guardarti storto.", help: "Rimani con lui in panchina e gli passi la palla finché non si rilassa. Ti spiega una cosa: i passaggi si dicono con gli occhi.", helpWin: "[felice] Almeno sai ascoltare. Sono dei vostri, ma niente effusioni." });
      },
      mg_nina() {
        if (K.rel.scene("mg_nina")) return;
        H.recruit("mg_nina", { level: 1, opp: "Nina Salvi", title: "Catena · Contro Nina", helpLabel: "Correte insieme fino a fine campo", intro: "[furbo] Un altro nuovo. Corri, e basta. Se riesci a starmi dietro, ne parliamo.", win: "[sorpresa] Mi hai passato la palla e non la strada. Va bene: ci sto.", help: "Corri con lei: sei sempre dietro, ma almeno dietro non ti perdi. Le chiedi dove vuole la palla e lei risponde: «avanti».", helpWin: "[ride] Hai fatto fatica e non ti sei lamentato. Vieni con noi, dai." });
      },
      mg_bruno() {
        if (K.rel.scene("mg_bruno")) return;
        H.recruit("mg_bruno", { level: 1, opp: "Bruno Costa", title: "Catena · Contro Bruno", helpLabel: "Tienigli la porta mentre calcia dieci rigori", intro: "[serio] Posso tirare in porta o posso parlare. Non entrambe le cose. Scegli tu.", win: "[sorpreso] Il tuo passaggio è finito proprio sul mio piede. Fortuna? No. Va bene: ci sto.", help: "Gli tieni la porta mentre calcia dieci rigori. Ne para uno solo, e lo fai tu per sbaglio. Ridete.", helpWin: "[felice] Almeno hai le mani buone. Ci sono." });
      },
      mg_teo() {
        if (K.rel.scene("mg_teo")) return;
        H.recruit("mg_teo", { level: 1, opp: "Teo Ferri", title: "Catena · Contro Teo", helpLabel: "Riordina con lui l'attrezzatura dello spogliatoio", intro: "[serio] Sono Teo. Sono il difensore. Se non passi non passi. Se passi, passi per me.", win: "[sorpreso] Mi hai superato col pallone. Ho capito. Dove firmo?", help: "Riordini con lui gli scarpini: ogni paio ha un nome, ogni nome una storia. Teo, alla fine, ti guarda con rispetto.", helpWin: "[felice] Poche persone riordinano senza chiedere nulla. Ci sono." });
      },
      mg_sandro() {
        if (K.rel.scene("mg_sandro")) return;
        H.recruit("mg_sandro", { level: 1, opp: "Sandro Greco", title: "Catena · Contro Sandro", helpLabel: "Mangia con lui in silenzio, finché non parla", intro: "[pensa] Parlo con i pali. Con le persone, meno. Che vuoi?", win: "[sorpreso] Sei riuscito a segnarmi, ed è difficile. Ci sto.", help: "Mangi con lui in silenzio. A un certo punto dice: «Gli altri parlano. Io para». Gli rispondi: «Anche io». Basta così.", helpWin: "[felice] Ti sei seduto e non hai chiesto niente. Va bene, vengo." });
      }
    };
    return {
      n: N, title: "Il Raduno", sub: "Il colle, il villaggio e la prima Catena",
      goal, start: "mg_colle", introBg: "mg_colle", zones, talk, obj: {},
      intro: [["voce", "Il pullman azzurro sale lungo il Colle di Rondine, tra i pini e le cicale. Il Centro Tecnico appare in cima, con il tetto rosso e il cancello aperto."], ["mg_gallo", "[serio] Benvenuto. Il Mondiale è tra tre settimane e abbiamo una sola cosa da dire: passatevi la palla."]]
    };
  }
  boot();
})();
