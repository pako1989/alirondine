// js/neve-c3.js - «IL GUARDIANO DI NEVE» · Capitolo 3: La notte del '79
// Il Rifugio Stella sotto l'aurora. Nell'armadietto numero 12 c'è la maglia di Aurelio, con sopra quella di Olmo: alla radiolina, Olmo racconta finalmente
// la finale del 1979 (al 70' il ginocchio, ai rigori Aurelio con la maglia numero 1 sopra la sua; la parata era sua). Nella funivia ferma, le lettere di Ilde.
// Due salite: i seracchi del ghiacciaio (ponti di neve che crollano, pupazzi di guardia) e la conca dello Stambecco Nero (lo fermi solo con una parata).
(function () {
  "use strict";
  function boot() {
    const E = window.__neveCore;
    if (!E || !E.api || !E.api.addChapter || !window.__neveH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__neveH(K), { say, done, ask, wask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("gn_c3", { kind: "shirt", label: "Maglia numero 12", val: "#1f5a30", from: "Capitolo 3 del Guardiano di Neve" });
    K.lore("l_finale79", { t: "La finale del 1979", d: "Valdigelo contro la Valle, sulla neve, nella bufera. Al 70' Olmo Brina si rompe il ginocchio. Ai rigori, in porta, va Aurelio Rovere col numero 1 di Olmo sopra il suo 12: nella bufera nessuno se ne accorge. Para l'ultimo rigore. Il giornale scrive «Brina para nella bufera». Olmo non lo corregge." });
    K.lore("l_lettere", { t: "Le lettere di Ilde", d: "Quarantacinque lettere, una per inverno, tutte per Olmo. Timbrate, mai spedite: Ilde le portava fino all'ufficio postale della funivia, e poi le riportava su. Ogni anno la stessa domanda, scritta in modo diverso." });
    K.lore("l_stambecco", { t: "Lo Stambecco Nero", d: "Il guardiano del ghiacciaio: grande come un mulo, nero come una stufa, corna come una porta da calcio. Ilde dice che non è cattivo: carica chiunque, ma si ferma davanti a chi non scappa." });

    const goal = (s) => ({
      0: "Notte al Rifugio Stella. Dentro (la casa al centro) c'è un armadietto col numero 12. (🌡️ In quota il freddo morde di più: il rifugio scalda.)",
      1: "La vecchia stazione della funivia (in alto a destra): Fiocco dice che la Regina ci lascia qualcosa. Leggi le lettere sul tavolo.",
      2: "▶ LIVELLO A SCORRIMENTO: il cancello del ghiacciaio (a nord, scritta GHIACCIAIO ▲). Ponti di neve che crollano: non fermarti sopra.",
      3: "Lo Stambecco Nero fa la guardia alla conca: torna al cancello del ghiacciaio. Carica a testa bassa: PARALO.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      setStep(N, 4); F.set("gn_c3_done", true);
      K.reward("gn_c3", { coins: 140, cos: "gn_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Oltre la conca, il ghiacciaio finisce in una morena di sassi e neve. In cima alla morena, sei pali con sei sciarpe degli Stambecchi che sbattono nel vento."],
        ["gn_fiocco", "[felice] La Regina dice: domani, al tramonto. Fiocco ti porta su in slitta. Fiocco tira forte. Fiocco ha tirato anche un frigorifero, una volta. Non chiedere perché."],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>🕯️ Verità ${K.stat("verita")} · ⭐ Leggenda ${K.stat("leggenda")} · ❄️ Stelle alpine ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Il Capitolo 4 ti aspetta: la Regina del Gelo."]
      ]), () => K.openMain(), "gn_morena");
    }
    function finale() {
      K.learnLore("l_stambecco");
      say("voce", "Lo Stambecco Nero piega le zampe davanti, piano, e abbassa le corna fino a toccare la neve. Poi si sposta di lato. Dietro di lui, il sentiero sale verso la morena.");
      say("gn_olmo", "[serio] <em>(radiolina)</em> ...Si è inchinato? A me non l'ha mai fatto. Nel '78 mi ha inseguito per mezzo ghiacciaio. Aurelio invece ci giocava. Gli tirava le palle di neve e lui le prendeva con le corna.");
      return wask("Lo Stambecco ti guarda, la testa bassa. Dietro, la morena e il tramonto che non c'è ancora.", [
        { label: "🕯️ «Olmo, domani lei vuole lei. Venga su.»", w: { verita: 2 }, fn: () => { F.set("gn_olmo_invito", true); say("gn_olmo", "[serio] Con queste ginocchia? ...Fiocco ha una slitta, vero? Ho sentito Lilli che lo diceva. ...Vedremo. Ho aspettato quarantacinque anni: posso aspettare fino a domani per decidere."); fin(); } },
        { label: "⭐ «Vado io. Lei resti al caldo.»", w: { leggenda: 2 }, fn: () => { say("gn_olmo", "[pensa] Al caldo. Sì. È quello che ho fatto per quarantacinque anni: stare al caldo. ...Vai tu. Portale i miei saluti. No: portale le mie scuse. No. Portale quello che vuoi."); fin(); } }
      ]);
    }
    function seracchi() {
      H.level("seracchi", "Il ghiacciaio di notte. Vedi l'aurora? Aurelio diceva che porta fortuna ai portieri. Attento ai ponti di neve sui crepacci: reggono un attimo, poi vanno giù. Non fermarti sopra.", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          say("gn_olmo", "[felice] <em>(radiolina)</em> Fuori dai seracchi! Lo sai che hai il passo del portiere? Corto, basso, sempre pronto a buttarsi. Si vede anche dalla radio.");
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Mancano delle stelle alpine: dal menu, 🏔️ Livelli a scorrimento, puoi rigiocare la salita quando vuoi.");
          say("voce", "In fondo al ghiacciaio, una conca di ghiaccio liscio. Nel mezzo, una sagoma nera con due corna enormi. Raspa la neve. Ti ha visto.");
          quest("gn_c3c", "La conca", "Torna al cancello del ghiacciaio e affronta lo Stambecco Nero.");
          return done();
        }
        say("gn_olmo", r.quit ? "<em>(radiolina)</em> Torna al rifugio, scaldati. Il ghiacciaio di notte non scappa." : "<em>(radiolina)</em> Crepaccio. Succede. Nel '79 ci ho lasciato uno scarpone. Riprova."); done();
      });
    }
    function conca() {
      H.level("conca", "Lo Stambecco. Ascoltami bene: NON scappare. Quando raspa, sta per caricare. Aspettalo. Guardalo. E quando arriva, PARA. Con tutte e due le mani. Poi, finché è stordito, saltagli in testa.", (r) => {
        if (r.win) return finale();
        say("gn_olmo", "<em>(radiolina)</em> Ti ha preso in pieno. Il trucco è non scappare: è il trucco del rigore, anche. Chi scappa, si butta prima. Riprova."); done();
      });
    }
    function gate() {
      const s = S();
      if (s < 2) { say("voce", s === 0 ? "Il cancello del ghiacciaio: due paletti con una catena e un cartello del CAI, «PERICOLO CREPACCI». Prima, ripàrati nel rifugio: in quota si gela." : "La catena è appesa al paletto. Prima di salire: Fiocco, vicino alla funivia, dice che la Regina ti ha lasciato qualcosa lì dentro."); return done(); }
      if (s === 2) return ask("Oltre la catena, il ghiacciaio brilla sotto l'aurora: crepacci, ponti di neve, seracchi alti come campanili.", [
        { label: "🧊 Sali sul ghiacciaio", sub: "Livello a scorrimento · I seracchi del ghiacciaio", big: true, cls: "hot", fn: seracchi },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("In fondo al ghiacciaio, nella conca, qualcosa raspa la neve con lo zoccolo.", [
        { label: "🐐 Entra nella conca", sub: "Capo · Lo Stambecco Nero", big: true, cls: "hot", fn: conca },
        { label: "🧊 Rigioca i seracchi", sub: "Per le stelle alpine mancanti", fn: seracchi },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "La catena è aperta. Dal menu, 🏔️ Livelli a scorrimento, rigiochi le salite superate."); done();
    }
    function locker() {
      if (S() > 0) { say("voce", "L'armadietto numero 12 è vuoto. Sull'anta, all'interno, a temperino: «A.R. · 12 · PORTIERE (DI RISERVA, PER ORA)»."); return done(); }
      K.inv.give("gn_maglia12"); K.learnLore("l_finale79");
      say("voce", "L'armadietto numero 12 cigola. Dentro, appese a una gruccia di fil di ferro, due maglie una sopra l'altra. Fuori, larga, la numero 1 degli Stambecchi. Sotto, stretta, la numero 12. Le toppe di cuoio ai gomiti.");
      say("voce", "Sull'anta, all'interno, a temperino: «A.R. · 12 · PORTIERE (DI RISERVA, PER ORA)».");
      say("gn_olmo", "[serio] <em>(radiolina)</em> ...Dimmi cosa vedi. No. Lo so cosa vedi. La 12 sotto la 1.");
      say("gn_olmo", "[triste] Al settantesimo mi sono girato male sulla neve. Il ginocchio è andato, crac, come un ramo. Il mister voleva ritirarsi: non avevamo cambi, solo Aurelio. Diciannove anni, mai giocato una finale.");
      say("gn_olmo", "Aurelio si è messo la mia maglia sopra la sua. «Così non si spaventano», ha detto. Nella bufera non si vedeva niente. L'arbitro non si è accorto di niente. Nessuno. Ha giocato venti minuti e i rigori. E l'ultimo, l'ultimo l'ha parato lui.");
      say("gn_olmo", "[serio] Io ero nello spogliatoio, col ghiaccio sul ginocchio. È entrato il giornalista, ha visto me con la maglia sudata e la Coppa in mano, e ha scritto «Brina para nella bufera». Aurelio rideva. «Domani lo diciamo a tutti», ha detto. Quella notte è salito qui. A scriverlo sul libro, prima di tutti.");
      say("gn_olmo", "[triste] E io, il giorno dopo, non ho detto niente. C'era il funerale senza la bara, c'era il paese che piangeva e aveva bisogno di un eroe vivo. Poi è passata una settimana. Poi un anno. Poi quarantacinque.");
      setStep(N, 1); quest("gn_c3", "La notte del '79", "Vai alla vecchia stazione della funivia (in alto a destra): Fiocco dice che la Regina ci lascia qualcosa.");
      return wask("La radiolina tace. Si sente solo Olmo che respira, e la stufa del rifugio.", [
        { label: "🕯️ «Domenica lo deve dire. A tutti.»", w: { verita: 2 }, fn: () => { F.set("gn_olmo_dire", true); say("gn_olmo", "[serio] Davanti alla tv regionale. Col sindaco, il parroco e Tecla che piange nel brulè. ...Sì. Se mi riporti la Coppa, lo dico. Me lo devo, e glielo devo."); done(); } },
        { label: "⭐ «Era una bugia di un giorno. Poi è diventata la storia del paese.»", w: { leggenda: 2 }, fn: () => { F.set("gn_storia_paese", true); say("gn_olmo", "[pensa] La storia del paese. È così che me la sono raccontata per quarantacinque anni. Funziona, sai? Funziona tutte le sere tranne una all'anno. Il 13 dicembre."); done(); } },
        { label: "«Ilde lo sapeva?»", w: { verita: 1 }, fn: () => { say("gn_olmo", "[triste] Ilde lo sapeva da prima della partita. Aurelio glielo aveva detto, la mattina: «se si fa male Olmo, oggi paro io». Lei era in tribuna. Ha visto le mani. Le mani non si nascondono sotto una maglia."); done(); } }
      ]);
    }
    function letters() {
      if (S() < 1) { say("voce", "Una pila di lettere legate con lo spago, sul tavolo della biglietteria. Prima, dai un'occhiata al rifugio: c'è un armadietto che aspetta."); return done(); }
      if (F.is("gn_lettere_lette")) { say("voce", "Le lettere di Ilde, legate con lo spago. Quarantacinque. Le hai lette tutte, una riga per inverno."); return done(); }
      F.set("gn_lettere_lette", true); K.inv.give("gn_lettere"); K.learnLore("l_lettere");
      say("voce", "Sul tavolo della biglietteria, una pila di lettere legate con lo spago. Tutte indirizzate a «Olmo Brina, Valdigelo». Tutte timbrate. Nessuna spedita. Ne apri qualcuna, a caso.");
      say("gn_ilde", "<em>(1980)</em> Olmo. Tu lo sai. Io lo so. Basterebbe dirlo una volta. Una sola. Poi puoi tornare a fare l'eroe, se ti piace.");
      say("gn_ilde", "<em>(1994)</em> Ho visto la tua foto sul giornale, alla festa per i quindici anni. Sei ingrassato. Lui no. Lui resta sempre a diciannove anni. È l'unico vantaggio.");
      say("gn_ilde", "<em>(2011)</em> Stanotte l'aurora. Lui diceva che porta fortuna ai portieri. A quali portieri, Olmo? A te o a lui?");
      say("gn_ilde", "<em>(2024)</em> Quest'anno vengo a prenderla io, la Coppa. Così sarai tu a dover salire. Ho settantadue anni e non ho più tempo per aspettare che tu scenda dalla tua poltrona.");
      say("gn_fiocco", "[triste] La Regina scrive. Poi porta giù le lettere alla funivia. Poi le riporta su. Fiocco porta la borsa. Fiocco non sa leggere, ma sa che pesano.");
      setStep(N, 2); K.questDone && K.questDone("gn_c3");
      quest("gn_c3b", "Il ghiacciaio", "Prendi il cancello del ghiacciaio, a nord del rifugio.");
      return wask("Le lettere pesano davvero, in mano.", [
        { label: "🕯️ Le porterai a Olmo", w: { verita: 1 }, fn: () => { F.set("gn_lettere_olmo", true); say("voce", "Le metti nello zaino, legate. Quarantacinque inverni pesano come una pagnotta."); done(); } },
        { label: "⭐ Le lasci dove sono: sono di Ilde", w: { leggenda: 1 }, fn: () => { K.inv.take("gn_lettere"); say("voce", "Riannodi lo spago e le rimetti sul tavolo, nel posto esatto dove la polvere non c'è."); done(); } }
      ]);
    }

    const talk = {
      gn_fiocco() {
        if (K.rel.scene("gn_fiocco")) return;
        const s = S();
        if (s === 1) { say("gn_fiocco", "[pensa] Fiocco ti ha seguito. Fiocco segue le orme: è il suo secondo lavoro. Il primo è raccattapalle. La Regina ha lasciato una cosa nella funivia. Una cosa di carta. Tante cose di carta."); return done(); }
        say("gn_fiocco", s === 0 ? "[felice] Fiocco ti ha seguito! Fiocco segue sempre chi para bene. Il rifugio è caldo: entra. Fiocco no, Fiocco si scioglie." : s < 4 ? "Lo Stambecco è amico di Fiocco. Ma quando carica, non è amico di nessuno. Para. La Regina dice sempre: chi para, passa." : "Domani slitta! Fiocco è emozionato. Fiocco si è pettinato."); done();
      }
    };

    const zones = {
      gn_rifugio: {
        region: "quota", name: "Il Rifugio Stella", short: "Rifugio Stella", sub: "2412 metri, sotto l'aurora: il rifugio chiuso dal 1979 e la funivia ferma", bg: "gn_rifugio", time: "notte", w: 30, h: 22, base: "Q", start: [15, 19],
        cold: 1.5, warm: [[19, 13, 2.4]],
        itemCos: "gn_c3", items: [[2, 3], [27, 11], [6, 20], [24, 19]],
        areas: [[10, 5, 19, 10, "Il Rifugio Stella"], [21, 2, 28, 7, "La stazione della funivia"], [2, 12, 8, 17, "Il laghetto ghiacciato"], [12, 0, 17, 2, "Il cancello del ghiacciaio"], [0, 0, 29, 21, "Il Rifugio Stella"]],
        act: { X: "Apri il cancello", M: "Scaldati alla brace", S: "Guarda il cippo", r: "Guarda la roccia", w: "Guarda il laghetto", l: "Guarda la lanterna", n: "Leggi il cartello", s: "Riposa un momento", J: "Guarda la legna" },
        flavor: {
          K: "Un pino cembro, storto dal vento. A questa quota gli alberi crescono di lato, come chi cammina controvento.",
          I: "Il muretto di sassi del rifugio, coperto di neve. Ci hanno inciso, coi chiodi degli scarponi, cent'anni di iniziali.",
          r: "Una roccia nera che spunta dalla neve. Il vento ci ha scolpito sopra una faccia. Lilli direbbe che è uno yeti dormiente. Forse ha ragione.",
          w: "Il laghetto del rifugio, ghiacciato fino al fondo. Sotto il ghiaccio, fermo, un pallone di cuoio. Fermo da quanto?",
          S: "Un cippo di pietra con una targa: «AI DISPERSI DELLA MONTAGNA». Sotto, una lista di nomi. L'ultimo è stato aggiunto con lo smalto per unghie: «AURELIO».",
          M: "Una brace nel bidone davanti al rifugio. Qualcuno l'ha accesa poco fa. Qualcuno che non si è fatto vedere.",
          l: "Una lanterna a petrolio appesa a un palo. Accesa. Il rifugio è chiuso dal 1979, ma la lanterna no.",
          n: "Il cartello del CAI: «RIFUGIO STELLA 2412 m · GHIACCIAIO: SOLO CON GUIDA · VETTA: 3 ORE». Sotto, a mano: «o con uno yeti».",
          J: "Legna secca accatastata sotto la tettoia. Tagliata quest'anno. Chi la taglia?"
        },
        npcs: () => [{ id: "gn_fiocco", at: [21, 14] }],
        intro: [["voce", "Notte al Rifugio Stella, 2412 metri. Sopra di te, l'aurora: verde, viola, che si muove come una tenda tirata da qualcuno di là."], ["voce", "Il rifugio è chiuso dal 1979, ma la lanterna è accesa e la legna è tagliata. Qualcuno, quassù, tiene in ordine le cose."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I"); put(14, 1, "X"); put(15, 1, "X");
          lay(0, 2, 0, 21, "r"); lay(29, 2, 29, 21, "r"); lay(1, 21, 28, 21, "r"); put(14, 21, "Q"); put(15, 21, "Q"); put(0, 21, "I"); put(29, 21, "I");
          house(10, 5, 9, 5, { door: [14, 9], roof: "#2a2a3a", wall: "#5a4a3a", chimney: true, enter: { to: "gn_rifugio_in", at: [8, 9] } });
          house(22, 2, 6, 5, { door: [24, 6], roof: "#6a1a1a", wall: "#7a7a86", enter: { to: "gn_funivia", at: [8, 9] } });
          lay(3, 13, 7, 16, "w"); put(19, 13, "M"); put(20, 12, "J"); put(9, 3, "S");
          [[12, 3], [17, 3], [9, 11], [20, 9], [5, 19], [25, 17]].forEach(([x, y]) => put(x, y, "l")); put(16, 12, "n"); put(12, 19, "s");
          [[3, 4], [6, 8], [25, 11], [22, 18], [9, 17], [18, 17]].forEach(([x, y]) => put(x, y, "r")); [[2, 9], [27, 14], [4, 18]].forEach(([x, y]) => put(x, y, "K"));
        },
        decor(g, cx, cy, d) { const s = S(), on = s >= 2 && s <= 3, bl = on && Math.floor(Date.now() / 450) % 2; H.plaque(g, on ? "▶ LIVELLO: GHIACCIAIO ▲" : "GHIACCIAIO ▲", d.X(14) + 16, d.Y(2) + 4, bl ? "#fef08a" : "#e0f2fe"); if (on) { g.save(); g.globalAlpha = 0.35 + 0.35 * Math.abs(Math.sin(Date.now() / 300)); g.strokeStyle = "#fde047"; g.lineWidth = 2; g.strokeRect(d.X(14) - 2, d.Y(1) - 2, 36, 20); g.restore(); } H.plaque(g, "RIFUGIO STELLA", d.X(14) + 8, d.Y(5) - 6, s === 0 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#fed7aa"); H.plaque(g, "FUNIVIA", d.X(25), d.Y(2) - 6, s === 1 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#fecaca"); }
      },
      gn_rifugio_in: {
        interior: true, region: "casa", name: "Dentro il Rifugio Stella", short: "Rifugio", sub: "Cuccette, una stufa calda e un armadietto col numero 12", bg: "gn_rifugio_in", w: 16, h: 11, start: [8, 9], outside: ["gn_rifugio", 14, 10], base: "Y",
        act: { B: "Guarda le cuccette", O: "Scaldati alla stufa", T: "Leggi il libro del rifugio", x: "Apri l'armadietto", W: "Guarda la finestra", b: "Siediti", R: "Guarda le foto" },
        flavor: { B: "Le cuccette di legno, le coperte di lana grigia piegate al millimetro. Qualcuno ci ha dormito, di recente, e ha rifatto il letto come in caserma.", O: "La stufa del rifugio, calda. Sopra, una pentola d'acqua e un paio di calzettoni ad asciugare. Piccoli. Da donna.", T: "Il libro del rifugio. Le firme del 13 dicembre 1979, una grande e una piccola. E la riga nuova: «Ho la Coppa. Venga lui a prenderla. I.»", W: "La finestra. Fuori, l'aurora, e sotto l'aurora il ghiacciaio che brilla come una scodella di latte.", b: "La panca del rifugio. Sotto, un paio di scarponi del 1979, chiodati, con le stringhe annodate insieme.", R: "Foto di cordate, di guide, di cani da valanga. In una, del '78, due ragazzi ridono con un pallone sul ghiacciaio. Uno ha le mani enormi." },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(1, 2, 1, 5, "B"); put(13, 2, "O"); put(13, 3, "O"); lay(7, 4, 9, 4, "T"); put(5, 8, "x"); put(11, 0, "W"); put(4, 0, "R"); put(5, 0, "R"); [[7, 5], [9, 5], [12, 7]].forEach(([x, y]) => put(x, y, "b"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "RIFUGIO STELLA · 2412", d.X(8), d.Y(0) + 6, "#fed7aa"); H.plaque(g, "12", d.X(5) + 8, d.Y(8) - 8, S() === 0 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#e2e8f0"); }
      },
      gn_funivia: {
        interior: true, region: "casa", name: "La stazione della funivia", short: "Funivia", sub: "La grande ruota ferma, la biglietteria e una pila di lettere", bg: "gn_funivia", w: 16, h: 11, start: [8, 9], outside: ["gn_rifugio", 24, 7], base: "+",
        act: { p: "Guarda la ruota", V: "Guarda il quadro comandi", T: "Guarda le lettere", P: "Guarda gli sci", R: "Guarda la cabina", b: "Siediti", O: "Scaldati alla stufa" },
        flavor: { p: "La grande ruota della funivia, ferma dal 1979. Il cavo è ingrassato. Qualcuno la ingrassa ogni anno, a dicembre, come se un giorno dovesse ripartire.", V: "Il quadro comandi: leve, spie, un orologio fermo alle 2:10. Su una spia, un cerotto: «NON RIPARTIRE».", T: "Le lettere di Ilde sul tavolo della biglietteria.", P: "Sci di legno con le pelli di foca, appesi in ordine di lunghezza. I più corti hanno una A incisa sulla punta.", R: "Dalla finestra si vede la cabina rossa, ferma a mezz'aria sul vuoto. Dentro, un pallone sgonfio.", b: "La panca della sala d'attesa. Sul muro, un orario: «Ultima corsa: 13-12-1979, ore 18:00».", O: "Una stufetta a legna, tiepida. Calore pieno." },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(2, 2, 4, 3, "p"); put(7, 1, "V"); put(8, 1, "V"); lay(10, 5, 12, 5, "T"); lay(14, 2, 14, 5, "P"); put(11, 0, "R"); put(12, 0, "R"); [[3, 7], [4, 7], [5, 7]].forEach(([x, y]) => put(x, y, "b")); put(1, 8, "O");
        },
        decor(g, cx, cy, d) { H.plaque(g, "FUNIVIA DELLA STELLA", d.X(8), d.Y(0) + 6, "#fecaca"); H.plaque(g, "✉", d.X(11) + 8, d.Y(5) - 8, S() === 1 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#e2e8f0"); }
      }
    };
    return {
      n: N, title: "La notte del '79", sub: "Un armadietto col numero 12, lettere mai spedite e uno stambecco che non si sposta",
      goal, start: "gn_rifugio", introBg: "gn_rifugio", zones, talk,
      obj: {
        "gn_rifugio:X": () => gate(),
        "gn_rifugio:M": () => { K.cold.set(K.cold.max); say("voce", "Ti accucci davanti alla brace. Qualcuno l'ha accesa da poco: sulla neve, accanto, impronte di stivali piccoli e di zampe enormi. Calore pieno."); done(); },
        "gn_rifugio_in:O": () => { K.cold.set(K.cold.max); say("voce", "La stufa del rifugio. Calore pieno, e i calzettoni di qualcun altro che fumano sul tubo."); done(); },
        "gn_funivia:O": () => { K.cold.set(K.cold.max); say("voce", "La stufetta della biglietteria. Calore pieno."); done(); },
        "gn_rifugio_in:x": () => locker(),
        "gn_rifugio_in:T": () => { K.learnLore("l_rifugio"); say("voce", "Il libro del rifugio. 13 dicembre 1979: una mano grande, una piccola. «Abbiamo vinto. Domani lo dico a tutti. A.» E sotto, la riga nuova di Ilde: «Ho la Coppa. Venga lui a prenderla.»"); done(); },
        "gn_funivia:T": () => letters()
      },
      intro: [["voce", "La radiolina gracchia nel buio del rifugio. Olmo non dorme: si sente dal respiro."], ["gn_olmo", "[serio] <em>(radiolina)</em> C'è un armadietto, lì dentro. Il numero 12. Aprilo. Poi ti racconto. Tutto. Te l'ho promesso."]]
    };
  }
  boot();
})();
