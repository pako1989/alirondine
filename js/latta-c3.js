// js/latta-c3.js - «IL PALLONE DI LATTA» · Capitolo 3: La cripta delle campane
// Sotto il convento di Santa Chiara le campane suonano da sole. L'archivio della Badessa racconta l'estate del 1527: la peste, la cripta usata come lazzaretto,
// il cavaliere del Palio che ci portò il garzone Nino e restò coi malati, la porta murata per ordine del Conestabile. Terzo livello a scorrimento (La cripta delle
// campane: buio, il pallone di latta che fa luce, campane che aprono le grate, monaci fantasma) e terzo capo (il Custode di Pietra). Capitolo serio.
(function () {
  "use strict";
  function boot() {
    const E = window.__lattaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__lattaH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__lattaH(K), { say, done, ask, wask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("lt_c3", { kind: "shirt", label: "Maglia della Cripta", val: "#3a3850", from: "Capitolo 3 del Pallone di Latta" });
    K.lore("l_peste", { t: "L'estate del 1527", d: "La peste arrivò a Castelrondine a fine agosto, la settimana del Palio. Il convento di Santa Chiara trasformò la cripta delle campane in lazzaretto. Il Palio si corse lo stesso, per ordine del Conestabile." });
    K.lore("l_nino", { t: "Nino di Stagnini", d: "Garzone di Mastro Stagnini, quattordici anni nel 1527. Ammalato la sera del Palio, portato nella cripta dal cavaliere. Guarito. Diventò lattoniere e, nel 1561, scrisse una lettera a chi non poteva leggerla." });
    K.lore("l_conestabile", { t: "Il Conestabile", d: "Signore del castello nel 1527. Fece murare la porta della cripta la notte del Palio «per salvare il Borgo». Nei registri il suo nome è scritto grande. Quello del cavaliere, raschiato." });

    const goal = (s) => ({
      0: "All'alba, nel chiostro di Santa Chiara: sotto i piedi suonano campane che nessuno vede. Parla con la Badessa, vicino al pozzo.",
      1: "Nell'archivio (la porta a nord-ovest del chiostro) cerca il Libro del 1527, sul leggio. Ottavia è già lì.",
      2: "▶ LIVELLO A SCORRIMENTO: in cappella (a nord-est), la porta della cripta. Scendi.",
      3: "In fondo alla cripta ti aspetta il Custode di Pietra: torna alla porta della cripta, in cappella.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    function fin(how) {
      setStep(N, 4); F.set("lt_c3_done", true);
      K.reward("lt_c3", { coins: 100, cos: "lt_c3" });
      K.finishChapter(N, how);
      K.scene(H.flush().concat([
        ["voce", "Esci dalla cripta all'alba. Le campane, là sotto, hanno smesso di suonare. Nel chiostro, la Badessa ha acceso una candela per ogni nome del Libro."],
        ["lt_ferro", "[serio] Cric. <em>(«Mi ricordo tutto, adesso. Quasi tutto. La porta che si chiude. Nino che piange. Io che gli dico: tu esci dal pozzo delle campane, io tengo la porta.»)</em>"],
        ["lt_ferro", "[pensa] Criiic. <em>(«Il mio nome. Mi manca solo il mio nome. Il Conestabile se l'è portato in cima alla sua torre, insieme a tutto il resto.»)</em>"],
        ["lt_benedetta", "[serio] La torre del Conestabile è chiusa da quattro secoli. Stanotte arriva il temporale. Se devi salire, cavaliere, sali con il vento contro."],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>🛡️ Onore ${K.stat("onore")} · 🪙 Affari ${K.stat("affari")} · 🚩 Stendardi ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Il Capitolo 4 ti aspetta: la torre del Conestabile, nella tempesta. L'ultimo."]
      ]), () => K.openMain(), "lt_chiostro");
    }
    function letter() {
      K.inv.give("lt_lettera");
      say("voce", "Il Custode di Pietra si sgretola. Dietro, nel muro, una nicchia con una scatola di latta. Dentro, una lettera piegata in quattro.");
      say("voce", "«Al cavaliere che rimase. Ti ho aspettato sul tetto per tre estati. Poi ho capito. Il pallone l'ho rimesso nel tuo petto, così torni a giocare. Io ho imparato a battere la latta. Tu impara ad aspettare. Nino, 1561.»");
      say("lt_ferro", "[commosso] ...Cric. <em>(«È guarito. È cresciuto. Ha battuto la latta. Mi ha messo il pallone nel petto. Io non lo sapevo. Ho aspettato anch'io, cinquecento anni, e non sapevo di aspettare lui.»)</em>");
      if (F.is("lt_patto") || F.is("lt_foto")) say("lt_mattonaro", "[furbo] Una lettera autografa del Cinquecento! Commovente. Incorniciata, nella hall, varrebbe più del batacchio.");
      return wask("La lettera di Nino. Ferro tace. Ognuno nel chiostro aspetta cosa farai.", [
        { label: "🛡️ «A Zeno. È la sua famiglia.»", sub: "La lettera torna agli Stagnini", w: { onore: 2 }, fn: () => { K.inv.take("lt_lettera"); K.rel.add("lt_zeno", 4); F.set("lt_lettera_zeno", true); say("lt_zeno", "[commosso] Il nostro capostipite. Un ragazzo guarito dalla peste che ha imparato il mestiere. Cinque secoli, e la bottega è ancora accesa per lui."); fin("zeno"); } },
        { label: "📜 «Al museo, accanto all'armatura.»", sub: "Ottavia la espone", w: { onore: 1 }, fn: () => { K.inv.take("lt_lettera"); K.rel.add("lt_ottavia", 4); F.set("lt_lettera_museo", true); say("lt_ottavia", "[commosso] Accanto all'armatura. Con un cartellino nuovo: non più «ignoto». «Il cavaliere che rimase»."); fin("museo"); } },
        { label: "🪙 Vendila a Mattonaro", sub: "+250 monete", w: { affari: 2 }, fn: () => { K.inv.take("lt_lettera"); K.coinsGive && K.coinsGive(250); F.set("lt_lettera_venduta", true); say("lt_mattonaro", "[ride] Andrà nella hall, sopra il bancone. I clienti piangeranno, e chi piange ordina champagne."); say("lt_ferro", "Cric. <em>(«...»)</em>"); say("voce", "Per la prima volta, Ferro non dice niente."); fin("mattonaro"); } }
      ]);
    }
    function cripta() {
      H.level("cripta", "Criiic... <em>(«Qui sotto è buio. Ma il pallone brilla: calcialo avanti e guarda dove va. Nel 1527 facevamo così, con le lanterne.»)</em>", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          say("voce", "Le grate si aprono una dopo l'altra, al suono delle campane. In fondo alla cripta, davanti all'ultima porta, una statua di cavaliere si volta verso di te.");
          say("lt_ferro", "[serio] Cric. <em>(«Il Custode. L'ha messo il Conestabile. Non per tenere fuori la peste: per tenere dentro noi.»)</em>");
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Mancano degli stendardi: dal menu, 🏰 Livelli a scorrimento, puoi rigiocare il livello.");
          quest("lt_c3c", "Il Custode di Pietra", "Torna alla porta della cripta, in cappella, e affronta il Custode.");
          return done();
        }
        say("lt_ferro", r.quit ? "Cric. <em>(«Torniamo su. Il buio aspetta, è l'unica cosa che sa fare.»)</em>" : "Criiic... <em>(«I monaci. Non sono cattivi. Hanno solo paura di essere guardati. Come tutti, qui sotto.»)</em>"); done();
      });
    }
    function custode() {
      H.level("custode", "Crac. <em>(«Quando alza il pallone di marmo, salta: l'onda corre per terra. Dopo due colpi si stanca e gli si spengono gli occhi. Allora tocca a noi.»)</em>", (r) => {
        if (r.win) return letter();
        say("lt_ferro", "Criiic. <em>(«Pietra contro latta. Vince la pietra, di solito. Di solito.»)</em>"); done();
      });
    }
    function door() {
      const s = S();
      if (s < 2) { say("voce", s === 0 ? "Una porta di ferro con sette catenacci e un cartello: «NON APRIRE · 1527». Da sotto, un rintocco lontano." : "La porta della cripta. Serve la chiave, e la chiave ce l'ha la Badessa."); return done(); }
      if (s === 2) return ask("La chiave gira con un rumore di ossa. Dal buio sale aria fredda e il suono di cento campane piccole.", [
        { label: "🕯️ Scendi nella cripta", sub: "Livello a scorrimento · La cripta delle campane", big: true, cls: "hot", fn: cripta },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("In fondo alla cripta, la statua aspetta.", [
        { label: "🗿 Affronta il Custode", sub: "Capo · Il Custode di Pietra", big: true, cls: "hot", fn: custode },
        { label: "🕯️ Rigioca la cripta", sub: "Per gli stendardi mancanti", fn: cripta },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "La cripta è silenziosa. Dal menu, 🏰 Livelli a scorrimento, rigiochi i livelli superati."); done();
    }
    function book() {
      const s = S();
      if (s !== 1) { say("voce", s < 1 ? "Un leggio con un libro chiuso da una cinghia. La Badessa ti guarda: non ancora." : "Il Libro del 1527, aperto alla pagina di fine agosto. Una candela accesa accanto."); return done(); }
      if (!F.is("lt_ott3")) { say("voce", "Il Libro è chiuso con una cinghia di cuoio. Ottavia, accanto, ti fa segno: prima parla con lei."); return done(); }
      K.learnLore("l_peste"); K.learnLore("l_nino");
      say("voce", "Ottavia slaccia la cinghia coi guanti bianchi. La pagina di fine agosto 1527 è scritta fitta, con un inchiostro che si è fatto marrone.");
      say("voce", "«Ricoverati nella cripta delle campane: Agnese del forno. Bartolo il cardatore. Nino di Stagnini, garzone, anni quattordici, portato dal cavaliere del Palio con la febbre addosso.»");
      say("voce", "«Il cavaliere del Palio [nome raschiato] rimase coi malati. La notte del Palio la porta fu murata per ordine del Conestabile. Nino di Stagnini, guarito, uscito dal pozzo delle campane. Gli altri, no.»");
      say("lt_ferro", "[serio] ...Cric. <em>(«Agnese. Bartolo. Mi ricordo le facce. Non mi ricordo la mia.»)</em>");
      say("lt_ottavia", "[commossa] Una fonte che parla di lui. La prima. Non era un cavaliere ignoto. Era uno che è rimasto.");
      return wask("Ottavia ti tende la pagina perché tu la legga ancora. Il telefono, in tasca, vibra: un messaggio di Mattonaro.", [
        { label: "🛡️ Leggila ad alta voce, per Ferro", w: { onore: 2 }, fn: () => { K.rel.add("lt_ottavia", 3); say("hero", "Agnese del forno. Bartolo il cardatore. Nino di Stagnini. E un cavaliere che è rimasto."); say("lt_ferro", "[commosso] Criiic. <em>(«Grazie. Detti da un altro, i nomi pesano meno. O di più. Non lo so.»)</em>"); key(); } },
        { label: "🪙 Fotografala per Mattonaro", sub: "+50 monete", w: { affari: 2 }, fn: () => { F.set("lt_foto", true); K.coinsGive && K.coinsGive(50); say("lt_ottavia", "[arrabbiata] Una foto? A lui? Questa pagina ha aspettato cinquecento anni per essere letta, non per essere venduta."); say("lt_ferro", "Cric. <em>(«Ha ragione lei. Ma ormai l'hai fatta.»)</em>"); key(); } }
      ]);
    }
    function key() {
      setStep(N, 2); K.inv.give("lt_chiave"); K.questDone && K.questDone("lt_c3");
      say("lt_benedetta", "[serio] Adesso sai cosa c'è là sotto. Allora puoi avere la chiave. La porta è in cappella, a nord-est. Io prego. Non per te: per chi è rimasto lì.");
      say("voce", "Ottieni la Chiave della cripta.");
      quest("lt_c3b", "La cripta delle campane", "In cappella, apri la porta della cripta e scendi.");
      done();
    }
    window.__lattaFerroC3 = () => {
      const s = S();
      say("lt_ferro", s === 0 ? "Cric. <em>(«Questo chiostro. Ci passavo coi piedi nudi d'estate, perché la pietra era fresca. Prima.»)</em>" : s === 1 ? "Criiic. <em>(«Un libro coi nomi. Non so se voglio leggerlo. So che devo.»)</em>" : s === 2 ? "[serio] Cric. <em>(«La cripta. Non ci volevo tornare. Ci torno con te, che è diverso.»)</em>" : s === 3 ? "Crac. <em>(«Il Custode non è cattivo. È di pietra. La pietra fa quello che le dicono.»)</em>" : "Cric. <em>(«Nino ha battuto la latta per tutta la vita. Ogni colpo, un po' per me.»)</em>");
      done();
    };

    const talk = {
      lt_benedetta() {
        if (K.rel.scene("lt_benedetta")) return;
        const s = S();
        if (s === 0) {
          say("lt_benedetta", "[sorpreso] L'armatura del museo, viva e cigolante, nel mio chiostro alle sei del mattino. Bene. Le suore ne parleranno per un secolo. Abbiamo tempo.");
          say("lt_benedetta", "Le senti? Sotto i piedi. Campane. Piccole, tante. Suonano da quando ti sei messo quella corazza. Là sotto c'è la cripta delle campane, murata dal 1527.");
          say("lt_benedetta", "La chiave la tengo io. Ma non la do a chi non sa cosa c'è sotto. Prima leggi il Libro del 1527, in archivio. Poi ne riparliamo.");
          setStep(N, 1); K.learnLore("l_conestabile"); quest("lt_c3", "Il Libro del 1527", "Nell'archivio del convento, leggi il Libro sul leggio.");
          return done();
        }
        say("lt_benedetta", s === 1 ? "L'archivio è a nord-ovest. Il Libro è sul leggio. La curatrice è arrivata alle cinque con i guanti bianchi: credo che dorma lì." : s === 2 ? "La porta della cripta è in cappella. Scendi piano. Là sotto la gente ha avuto paura per mesi: un po' di paura è rimasta nei muri." : s === 3 ? "Il Custode di Pietra. Lo mise il Conestabile. Le nostre consorelle di allora lo chiamavano «il cane del signore»." : "Una candela per ogni nome. Anche per il tuo, cavaliere, quando lo troveremo."); done();
      },
      lt_ottavia() {
        if (K.rel.scene("lt_ottavia")) return;
        const s = S();
        if (s === 1 && !F.is("lt_ott3")) {
          F.set("lt_ott3", true);
          say("lt_ottavia", "[felice] Sei qui! Questo archivio è... è... ho pianto due volte e non sono neanche le sette. Registri del Palio, della peste, del Conestabile. Tutto.");
          say("lt_ottavia", "Il Libro del 1527 è sul leggio, in fondo. Non l'ho aperto. Volevo che ci fossi anche tu. E lui. Ferro. È la sua storia, non la mia.");
          say("lt_ferro", "Cric. <em>(«Questa curatrice mi piace sempre di più. Non dirglielo, si monta la testa.»)</em>");
          return done();
        }
        say("lt_ottavia", s < 1 ? "Buongiorno. Non ho dormito. Non importa." : s === 1 ? "Il Libro. Sul leggio. Io tengo la lente." : s >= 4 ? "Ho riscritto il cartellino tre volte. Ogni volta è più corto. Alla fine resterà solo: «rimase»." : "Scendi. Io aspetto qui. Catalogo le cose per non pensare."); done();
      },
      lt_gelsa() {
        if (K.rel.scene("lt_gelsa")) return;
        if (!F.is("lt_gel3")) {
          F.set("lt_gel3", true);
          say("lt_gelsa", "[pensa] Mia nonna diceva una filastrocca, da bambina. «Campana di sotto, chi suona sei tu? Il cavaliere che non torna più.» La cantavamo saltando la corda.");
          say("lt_gelsa", "[triste] Non pensavo fosse una storia vera. Le filastrocche, di solito, sono storie vere a cui hanno tolto il dolore per farle cantare ai bambini.");
          return done();
        }
        say("lt_gelsa", S() >= 4 ? "Ho ricamato un gonfalone nuovo. Un cavaliere di latta con un ragazzino sulle spalle. Il Palio prossimo lo porto io." : "Vai, giovanotto. Io ricamo. Ognuno ha il suo modo di aspettare."); done();
      },
      lt_mattonaro() {
        if (K.rel.scene("lt_mattonaro")) return;
        if (!F.is("lt_mat3")) {
          F.set("lt_mat3", true);
          say("lt_mattonaro", "[furbo] Anche il convento! Sai quanti metri quadri ha questo chiostro? «Monastero Wellness». Silenzio a pagamento. La gente lo compra, sai, il silenzio.");
          say("lt_mattonaro", "Se là sotto trovi qualcosa di antico e di commovente, pensa a me. Il commovente si vende benissimo.");
          return done();
        }
        say("lt_mattonaro", "Le suore dicono di no. Dicono sempre di no. Poi arriva l'inverno, e il tetto perde."); done();
      }
    };

    const zones = {
      lt_chiostro: {
        region: "chiostro", name: "Il chiostro di Santa Chiara", short: "Chiostro", sub: "Castelrondine, all'alba", bg: "lt_chiostro", time: "alba", w: 30, h: 22, base: "Q", start: [14, 19],
        itemCos: "lt_c3", items: [[13, 3], [16, 3], [3, 19], [26, 19]],
        areas: [[2, 2, 9, 8, "L'archivio"], [20, 2, 27, 8, "La cappella"], [9, 9, 20, 16, "Il giardino del chiostro"], [0, 0, 29, 21, "Il convento di Santa Chiara"]],
        act: { C: "Guarda la colonna", M: "Guarda il pozzo", n: "Leggi la lapide", l: "Guarda la lanterna", b: "Siediti", t: "Guarda l'albero", s: "Riposa un momento", q: "Entra" },
        flavor: {
          I: "Il muro del castello, attaccato al convento. Le suore dicono che il castello si appoggia a loro, non il contrario.",
          C: "Una colonna del chiostro, bianca e liscia, con l'edera che sale piano. Ogni colonna ha un capitello diverso: questo ha un pallone. Questo ha un pallone?",
          M: "Il pozzo del chiostro. Dal fondo, se ascolti, arriva un rintocco. Il pozzo comunica con la cripta, dicono. Nessuno ha mai controllato.",
          n: "Una lapide: «A chi rimase. 1527». Nient'altro. Le suore ci mettono un fiore ogni mattina e non sanno perché: si è sempre fatto.",
          l: "Una lanterna ancora accesa dalla notte. La candela è quasi finita.",
          b: "Una panca di pietra. Ci si siede la Badessa a leggere, quando l'archivio è troppo pieno di voci.",
          t: "Un cipresso. Lo piantarono nel 1528, dice il registro. Lo piantarono per qualcuno.",
          s: "Un angolo di sole sul gradino. Il primo sole del giorno, tiepido come una mano."
        },
        npcs: (s) => [{ id: "lt_benedetta", at: [15, 9] }, { id: "lt_gelsa", at: [6, 15] }].concat(s >= 1 ? [{ id: "lt_mattonaro", at: [21, 13] }] : []),
        intro: [["voce", "Il convento di Santa Chiara, all'alba. Un chiostro quadrato, colonne bianche, un pozzo in mezzo. E, sotto i piedi, un suono di campane piccole che nessuno vede."], ["voce", "A nord-ovest l'archivio. A nord-est la cappella. Accanto al pozzo, una suora con le chiavi alla cintura ti guarda come si guarda un problema interessante."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I");
          lay(0, 2, 0, 21, "t"); lay(29, 2, 29, 21, "t"); lay(1, 21, 28, 21, "t");
          house(2, 3, 7, 5, { door: [5, 7], roof: "#7c2d12", wall: "#e8dcc8", enter: { to: "lt_archivio", at: [8, 9] } });
          house(20, 3, 7, 5, { door: [23, 7], roof: "#3a2a4a", wall: "#d6d0e0", enter: { to: "lt_cappella", at: [8, 9] } });
          house(2, 13, 4, 4, { door: [4, 16], roof: "#57534e", wall: "#f5f5f4", enter: "Le celle delle suore. Dalla porta socchiusa: un letto stretto, un crocifisso, e una radiolina accesa sulla partita di ieri." });
          house(23, 14, 5, 4, { door: [25, 17], roof: "#7c2d12", wall: "#fde68a", enter: "Il refettorio. Odore di pane e di caffè d'orzo. Una suora giovane ti offre una fetta di torta, poi si ricorda che sei di latta." });
          for (let x = 10; x <= 19; x += 3) { put(x, 10, "C"); put(x, 16, "C"); } put(10, 13, "C"); put(19, 13, "C");
          put(14, 13, "M"); put(15, 13, "M");
          put(12, 19, "n"); [[11, 5], [18, 5], [8, 11], [21, 11], [14, 18]].forEach(([x, y]) => put(x, y, "l"));
          put(16, 19, "b"); put(8, 19, "s"); [[1, 10], [28, 10], [12, 12], [17, 14]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "ARCHIVIO", d.X(5) + 8, d.Y(3) - 6, "#fde68a"); const s = S(); H.plaque(g, s === 2 ? "▶ CAPPELLA · CRIPTA" : "CAPPELLA", d.X(23) + 8, d.Y(3) - 6, s === 2 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#c4b5fd"); H.plaque(g, "REFETTORIO", d.X(25) + 8, d.Y(14) - 6, "#fed7aa");
        }
      },
      lt_archivio: {
        interior: true, region: "archivio", name: "L'archivio di Santa Chiara", short: "Archivio", sub: "Cinquecento anni di gente che scrive", bg: "lt_archivio", w: 16, h: 11, start: [8, 9], outside: ["lt_chiostro", 5, 8], base: "Y",
        act: { L: "Guarda gli scaffali", T: "Leggi il Libro del 1527", W: "Guarda la finestra", l: "Guarda la lampada", b: "Siediti" },
        flavor: { L: "Registri, registri, registri. Battesimi, matrimoni, morti, raccolti, liti per i confini. Sui dorsi, gli anni scritti a mano: 1490, 1502, 1527.", T: "Il tavolo della Badessa: una lente, una tazza di camomilla fredda, una pila di fogli con le note a matita.", W: "Dalla finestra, il chiostro e il pozzo. Il pozzo, da qui, sembra un occhio che guarda in su.", l: "Una lampada da lettura col paralume verde. Fa una luce che rende tutti più seri.", b: "Uno sgabello. Ottavia ci ha lasciato il cappotto." },
        npcs: () => [{ id: "lt_ottavia", at: [10, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          [[2, 1], [3, 1], [4, 1], [11, 1], [12, 1], [13, 1], [1, 4], [1, 5], [14, 4], [14, 5]].forEach(([x, y]) => put(x, y, "L")); put(7, 1, "W"); put(8, 1, "W");
          put(7, 4, "T"); [[3, 8], [12, 8]].forEach(([x, y]) => put(x, y, "l")); put(5, 7, "b");
        },
        decor(g, cx, cy, d) { const s = S(); H.plaque(g, s === 1 ? "▶ LIBRO DEL 1527" : "LIBRO DEL 1527", d.X(7) + 8, d.Y(4) - 10, s === 1 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#fde68a"); }
      },
      lt_cappella: {
        interior: true, region: "cappella", name: "La cappella di Santa Chiara", short: "Cappella", sub: "Vetrate, candele e una porta con sette catenacci", bg: "lt_cappella", w: 16, h: 11, start: [8, 9], outside: ["lt_chiostro", 23, 8], base: "U",
        act: { G: "Scendi nella cripta", W: "Guarda la vetrata", T: "Guarda l'altare", b: "Siediti", l: "Guarda la candela" },
        flavor: { W: "La vetrata: un cavaliere che porta un ragazzo in braccio, e sotto la scritta consumata «QUI MANSIT». Rimase qui.", T: "L'altare, semplice, con una tovaglia ricamata. Sul bordo, ricamato piccolo, un pallone. Opera di Gelsa? No: è vecchia di secoli.", b: "Una panca di legno scuro. Lucida dove si appoggiano le mani di chi aspetta.", l: "Candele accese. Una, più grande, ha il cartellino «1527»." },
        npcs: () => [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "U"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          put(13, 2, "G"); put(7, 1, "W"); put(8, 1, "W"); put(7, 3, "T"); put(8, 3, "T"); [[4, 6], [5, 6], [10, 6], [11, 6]].forEach(([x, y]) => put(x, y, "b")); [[2, 2], [2, 8], [12, 8]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) { const s = S(); H.plaque(g, s === 2 || s === 3 ? "▶ CRIPTA" : "CRIPTA", d.X(13) + 8, d.Y(2) - 8, (s === 2 || s === 3) && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#c4b5fd"); }
      }
    };
    return {
      n: N, title: "La cripta delle campane", sub: "Un archivio, un libro con i nomi e una porta murata nel 1527",
      goal, start: "lt_chiostro", introBg: "lt_chiostro", zones, talk,
      obj: {
        "lt_archivio:T": () => book(),
        "lt_cappella:G": () => door()
      },
      intro: [["voce", "La campana di San Rocco ha suonato mezzanotte, poi l'una, poi le due. Alle cinque, invece, hanno cominciato a suonare altre campane. Sotto terra."], ["lt_ferro", "[serio] Cric. <em>(«Le conosco. Le ho sentite per tre settimane, cinquecento anni fa. Non volevo sentirle più.»)</em>"], ["voce", "Il suono viene dal convento di Santa Chiara, attaccato al castello. Questo capitolo è più serio degli altri. Ferro te lo dice prima, perché è educato."]]
    };
  }
  boot();
})();
