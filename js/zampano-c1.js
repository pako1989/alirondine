// js/zampano-c1.js - «IL CIRCO ZAMPANÒ» · Capitolo 1: Il Picchetto d'Ottone
// Pian dei Venti, sopra il Borgo Marino. Il ragionier Bacci notifica quarantott'ore di sgombero se la prova generale non riempie le gradinate;
// Maestro Zampanò ti affida la Sfera a spicchi, Lila e Tonio portano i primi due numeri nel Cartellone e il Barone Orloff manda in pista Ercole di Ghisa.
(function () {
  "use strict";
  function boot() {
    const E = window.__zampanoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__zampanoH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__zampanoH(K), { say, done, ask, wask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("ci_c1", { kind: "shirt", label: "Marsina cremisi di Zampanò", val: "#dc2626", from: "Capitolo 1 del Circo Zampanò" });
    K.lore("l_tendone", { t: "Il tendone cremisi del 1924", d: "Cucito a Genova con tela da vela tinta di rosso melograno. Ha resistito a tre libecciate, due guerre di tariffe e quaranta stagioni di pioggia autunnale." });
    K.lore("l_picchetto", { t: "Il picchetto d'ottone", d: "Prima di alzare l'antenna centrale, Zampanò pianta sempre lo stesso picchetto d'ottone consumato: finché resta in terra, la pista è casa di chiunque sappia saltare." });

    const goal = (s) => ({
      0: "Pian dei Venti. Entra nel Tendone cremisi (a nord-ovest) e parla con Maestro Zampanò.",
      1: "Parla con Tonio Pagliaccio nello spiazzo per sbloccare il secondo numero del Cartellone.",
      2: "▶ PISTA ACROBATICA: regola il Cartellone al leggio d'ottone (A) nel tendone, poi varca il sipario (X).",
      3: "Il Barone Orloff ha mandato in pista Ercole di Ghisa: affronta il capo dal sipario (X) nel tendone.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      setStep(N, 4); F.set("ci_c1_done", true);
      K.reward("ci_c1", { coins: 80, cos: "ci_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Quando le luci della ribalta si abbassano, il ragionier Bacci richiude il metro pieghevole con uno scatto secco e firma il permesso provvisorio per il fine settimana."],
        ["ci_orloff", "[serio] Buon salto per una baracca di tela rattoppata, Zampanò. Godetevi la serata: domenica il pubblico sceglierà chi ha i riflettori più forti."],
        ["ci_zampano", "[felice] Lascialo parlare, campione. Hai sentito le gradinate? Quando un tendone ride così, neanche il maestrale lo schioda."],
        ["voce", "Ma fuori, dietro il carro del generatore, qualcuno si allontana nell'erba bagnata lasciando cadere una scintilla azzurra."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>👏 Applausi ${K.stat("applausi")} · 🎪 Cuore ${K.stat("cuore")} · 👑 Prestigio ${K.stat("prestigio")} · 🏵️ Coccarde ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Il Capitolo 2 ti aspetta: «La Corda Tagliata»."]
      ]), () => K.openMain(), "ci_titolo");
    }

    function afterBoss() {
      K.learnLore("l_picchetto"); K.bond("applausi", 3);
      say("voce", "Ercole di Ghisa appoggia il bilanciere nella segatura, si asciuga i baffi col fazzoletto e ti batte una mano sulla spalla che quasi ti pianta fino alle caviglie.");
      say("ci_orloff", "[sorpreso] Interessante. Molto interessante. Ragazzo, nel mio Gran Circo Imperiale avresti uno spogliatoio di velluto invece di un baule che sa di canfora.");
      say("ci_lila", "[arrabbiata] Risparmia il fiato, Barone: qui la segatura ce la dividiamo in parti uguali.");
      return wask("Dal palco centrale il Barone Orloff alza il bastone dal pomo d'argento aspettando la tua risposta.", [
        { label: "🎪 «Resto con chi divide il pane e le funi.»", w: { cuore: 2 }, fn: () => { F.set("ci_rifiuto_c1", true); K.rel.add("ci_lila", 2); say("ci_zampano", "[commosso] Ben detto! Tonio, attacca la marcia dei saluti!"); fin(); } },
        { label: "👑 «Domenica vedremo quale pista vale il biglietto.»", w: { prestigio: 2 }, fn: () => { F.set("ci_sfida_c1", true); K.bond("applausi", 1); say("ci_orloff", "[serio] Accetto la scommessa. A domenica, acrobata."); fin(); } },
        { label: "«Offra un giro di zucchero filato alle gradinate, Barone.»", w: { cuore: 1, prestigio: 1 }, fn: () => { K.rel.add("ci_tonio", 2); say("ci_tonio", "[felice] Ecco una proposta diplomatica che approvo col trombone!"); fin(); } }
      ]);
    }

    function runPista1() {
      H.level("pista1", "ci_lila", "Occhio ai trampolini rossi e gialli! In aria premi 🎪 per la piroetta o per darti lo slancio sugli anelli d'oro!", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          K.bond("applausi", 2);
          say("ci_tonio", "[felice] Che entrata! Le prime tre file hanno rovesciato i lupini per applaudire!");
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Hai lasciato qualche Coccarda d'oro lassù: dal menu puoi rigiocare la pista quando vuoi.");
          say("voce", "Dall'ingresso principale entra una figura in cilindro nero: il Barone Orloff batte due volte il bastone e fa avanzare il suo forzuto in maglia ambra.");
          quest("ci_q1c", "La sfida di Orloff", "Torna al sipario (X) nel tendone e affronta Ercole di Ghisa.");
          return done();
        }
        say("ci_zampano", r.quit ? "Prendi fiato e controlla il Cartellone al leggio (A): i numeri giusti aiutano in pista." : "Niente paura, la segatura serve proprio a rialzarsi. Riprova quando vuoi!");
        done();
      });
    }

    function runErcole() {
      H.level("ercole", "ci_zampano", "Quando sbatte a terra solleva un'onda nella segatura: saltala! Poi riprende fiato sotto il riflettore: saltagli sul cilindro o colpisci col pallone!", (r) => {
        if (r.win) return afterBoss();
        say("ci_lila", "Attento all'onda quando atterra: usa i trampolini ai lati per saltarlo netto!"); done();
      });
    }

    function curtain() {
      const s = S();
      if (s < 2) {
        say("voce", s === 0 ? "Il sipario cremisi della pista centrale. Prima parla con Maestro Zampanò qui in pista." : "Prima di aprire il sipario, parla con Tonio nello spiazzo per avere due numeri pronti in Cartellone.");
        return done();
      }
      if (s === 2) return ask(`Il sipario ondeggia sotto i riflettori. Scaletta attuale: ${K.billboard.statusTxt()}.`, [
        { label: "🎪 Entra in pista · Le prove generali", sub: "Livello a scorrimento · Il tendone delle prove", big: true, cls: "hot", fn: runPista1 },
        { label: "📋 Cambia la Scaletta", sub: "Scegli i numeri e scopri le sinergie", fn: () => K.billboard.open(curtain, true) },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Sulla pedana centrale Ercole di Ghisa fa roteare il bilanciere sotto lo sguardo del Barone Orloff.", [
        { label: "🏋️ Affronta Ercole di Ghisa", sub: "Capo · La pedana dei pesi", big: true, cls: "hot", fn: runErcole },
        { label: "🎪 Rigioca il tendone delle prove", sub: "Per raccogliere le Coccarde d'oro", fn: runPista1 },
        { label: "📋 Cambia la Scaletta", sub: K.billboard.statusTxt(), fn: () => K.billboard.open(curtain, true) },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "La pista riposa dopo gli applausi. Dal menu puoi rigiocare tutte le piste superate."); done();
    }

    const talk = {
      ci_zampano() {
        if (K.rel.scene("ci_zampano")) return;
        const s = S();
        if (s === 0) {
          say("ci_zampano", "[felice] Eccoti qua, campione! Guarda che cupola: quarant'anni di toppe, eppure quando entra il sole sembra un rubino.");
          say("ci_zampano", "[serio] Il ragionier Bacci là fuori dice che ci mancano due timbri e mezzo pubblico per restare a Pian dei Venti. E guarda caso il Barone Orloff ha tappezzato il Borgo coi manifesti del suo Gran Circo Imperiale.");
          say("ci_zampano", "Ci serve un numero nuovo col pallone: corsa, trampolini e trapezi! Tieni la mia Sfera a spicchi (🎒 Zaino) e la giacca da pista.");
          say("ci_lila", "[felice] Io sono già pronta sulla sbarra, Direttore: il mio «Volo di Lila» entra subito nel Cartellone!");
          F.set("ci_divisa", true); K.inv.give("ci_sfera"); K.learnLore("l_tendone");
          K.billboard.unlock("trapezio"); K.billboard.assign(0, "trapezio");
          setStep(N, 1); quest("ci_q1", "La fanfara d'apertura", "Esci nello spiazzo e parla con Tonio Pagliaccio per completare l'apertura.");
          return done();
        }
        say("ci_zampano", s === 1 ? "Vai da Tonio fuori nello spiazzo: senza la sua tromba le gradinate restano fredde." : "Controlla il leggio del Cartellone (A) qui a destra: se abbini Lila e Tonio nella stessa serata nasce il nostro Valzer Sospeso!");
        done();
      },
      ci_lila() {
        if (K.rel.scene("ci_lila")) return;
        say("ci_lila", S() < 2 ? "Lassù tra gli anelli d'oro non guardare le scarpe: premi 🎪 quando sfiori l'anello e la corda ti porta da sola." : "[felice] Se metti sia me sia Tonio nel Cartellone al leggio (A), lui rallenta il valzer proprio sul mio salto!");
        done();
      },
      ci_tonio() {
        if (K.rel.scene("ci_tonio")) return;
        const s = S();
        if (s === 1) {
          say("ci_tonio", "[felice] Po-po-pooom! Stavo giusto oliando i pistoni della tromba col burro di cacao! Zampanò ti ha dato la sfera cremisi?");
          say("ci_tonio", "Allora segna «La Tromba di Tonio» nel Cartellone! Ti porta gettoni freschi all'inizio della pista, e se mi metti in scaletta accanto a Lila vedrai che numero viene fuori!");
          K.billboard.unlock("fanfara"); K.billboard.assign(1, "fanfara");
          setStep(N, 2); K.questDone && K.questDone("ci_q1");
          quest("ci_q1b", "La prova generale", "Torna nel tendone, controlla il leggio del Cartellone (A) e apri il sipario (X).");
          return wask("Tonio ti porge il bocchino d'ottone per un brindisi scaramantico.", [
            { label: "🎪 «Suona per i bambini senza biglietto in collina!»", w: { cuore: 1 }, fn: () => { K.rel.add("ci_tonio", 2); say("ci_tonio", "[felice] Quelli sugli alberi sono sempre i critici più onesti! Corri al tendone!"); done(); } },
            { label: "👑 «Suona forte che ti sentano fino al municipio!»", w: { prestigio: 1 }, fn: () => { K.bond("applausi", 1); say("ci_tonio", "[felice] Farò tremare i vetri dell'ufficio di Bacci! Ci vediamo in pista!"); done(); } }
          ]);
        }
        say("ci_tonio", s === 0 ? "Entra prima nel tendone a salutare Maestro Zampanò, altrimenti s'offende coi baffi!" : "Passa dal leggio d'ottone (A) nel tendone: tocca gli slot per provare le combinazioni del Cartellone!");
        done();
      },
      ci_bacci() {
        if (K.rel.scene("ci_bacci")) return;
        say("ci_bacci", S() < 3 ? "[serio] Articolo 14 comma B: «occupazione temporanea subordinata a decoro artistico e sicurezza cavi». Tradotto: o stasera fate un figurone, o lunedì qui ci parcheggiano i furgoni del mercato." : "[sorpreso] Ehm... quel salto sul trapezio era a norma? Non importa, non voglio saperlo, era bellissimo.");
        done();
      },
      ci_pippo() {
        if (K.rel.scene("ci_pippo")) return;
        if (!F.is("ci_amichevole_c1")) {
          return ask("Pippo palleggia con tre birilli e un pallone di cuoio: «Vuoi scaldare il pubblico nello spiazzo con due tiri tra i carri o provare la pista d'allenamento?»", [
            { label: "⚽ Partitella nello spiazzo (a 2 gol)", sub: "Partita amichevole per scaldare la folla (+2 Applausi)", fn: () => K.playMatch({ id: "ci_am1", oppTeam: "Ragazzi della Fiera", cageTarget: 2, done: (r) => {
              if (r && r.win) { F.set("ci_amichevole_c1", true); K.bond("applausi", 2); K.rel.add("ci_pippo", 2); say("ci_pippo", "[felice] Che diagonale tra i picchetti! Guarda quanta gente si sta avvicinando alla cassa!"); }
              else say("ci_pippo", "Bella sgambata lo stesso! Quando vuoi riprovare sono qui.");
              done();
            } }) },
            { label: "🤸 Pista di prova acrobatica", sub: "Allenati coi comandi del kit circo", fn: () => K.scroll.practice(() => done()) },
            { label: "↩ Più tardi", fn: done }
          ]);
        }
        say("ci_pippo", "[felice] Le gradinate si stanno riempiendo! Nel prossimo capitolo ti insegno anche il mio numero coi birilli!"); done();
      },
      ci_miranda() {
        if (K.rel.scene("ci_miranda")) return;
        if (!F.is("ci_mir_carta1")) {
          F.set("ci_mir_carta1", true); K.inv.give("ci_tarocco");
          say("ci_miranda", "Ho girato tre carte sul velluto prima che tu bussassi: il Carro, la Forza e la Stella.");
          say("ci_miranda", "Tieni la Carta della Stella (🎒 Zaino). Attento agli uomini in mantello viola: sorridono davanti al botteghino e contano i bulloni sul retro.");
          return done();
        }
        say("ci_miranda", "Gli specchi non mentono mai: il Barone Orloff teme questo tendone più di quanto ammetta."); done();
      }
    };

    const zones = {
      ci_spiazzo: {
        region: "spiazzo", name: "Pian dei Venti", short: "Spiazzo", sub: "Il prato dei carri sopra il Borgo Marino", bg: "ci_spiazzo", time: "tramonto", w: 30, h: 22, base: "Z", start: [15, 19],
        itemCos: "ci_c1", items: [[2, 10], [27, 10], [14, 15], [27, 19]],
        areas: [[2, 3, 11, 9, "Il Tendone cremisi"], [19, 3, 27, 9, "Il Carro di Miranda"], [11, 10, 19, 15, "Lo spiazzo centrale"], [0, 0, 29, 21, "Pian dei Venti"]],
        flavor: { I: "Paletti d'ottone e cordone cremisi tirato a piombo da Golia.", C: "Un picchetto d'ottone piantato nel prato: la fune canta col vento del mare.", E: "Il chiosco dello zucchero filato profuma di vaniglia calda.", n: "Manifesto a caratteri rossi: «CIRCO ZAMPANÒ · GRAN DEBUTTO D'AUTUNNO · INGRESSO POPOLARE».", s: "Una cassa dipinta a stelle dorate dove sedersi a riprendere fiato.", l: "Lampione da fiera con tre lampadine color ambra." },
        npcs: () => [{ id: "ci_tonio", at: [13, 12] }, { id: "ci_bacci", at: [18, 12] }, { id: "ci_pippo", at: [11, 16] }],
        intro: [["voce", "Pian dei Venti, ottobre. Sotto di voi i tetti di ardesia del Borgo Marino guardano il mare; quassù il vento gonfia la tela cremisi e avorio del Circo Zampanò."], ["voce", "A nord-ovest svetta l'ingresso del Tendone, a nord-est il carro dipinto di Madame Miranda. In mezzo allo spiazzo il ragionier Bacci agita una cartelletta bollata."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I"); lay(0, 2, 0, 21, "t"); lay(29, 2, 29, 21, "t"); lay(1, 21, 28, 21, "I"); put(14, 21, "Z"); put(15, 21, "Z");
          house(3, 4, 8, 5, { door: [7, 8], roof: "#991b1b", wall: "#fef3c7", enter: { to: "ci_tendone", at: [8, 9] } });
          house(20, 4, 7, 5, { door: [23, 8], roof: "#6d28d9", wall: "#fde68a", enter: { to: "ci_carro", at: [8, 9] } });
          house(3, 14, 6, 4, { door: [5, 17], roof: "#b45309", wall: "#fed7aa", enter: "Il carro-cucina di Golia: sul fornello sobbolle un pentolone di minestrone per tutta la carovana." });
          house(21, 14, 6, 4, { door: [23, 17], roof: "#1e3a8a", wall: "#dbeafe", enter: "Il carro degli attrezzi: odore di pece greca, corde nuove e vernice dorata." });
          put(15, 6, "E"); put(12, 9, "C"); put(18, 9, "C"); put(15, 11, "n"); put(9, 19, "s");
          [[11, 4], [19, 4], [10, 14], [20, 14]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const s = S();
          H.plaque(g, "🎪 TENDONE", d.X(7) + 8, d.Y(4) - 6, (s === 0 || s >= 2) && Math.floor(Date.now() / 450) % 2 ? "#fde047" : "#fecdd3");
          H.plaque(g, "🔮 CARRO MIRANDA", d.X(23) + 8, d.Y(4) - 6, "#e9d5ff");
        }
      },
      ci_tendone: {
        interior: true, region: "tendone", name: "Il Tendone Centrale", short: "Tendone", sub: "Segatura fresca, anelli d'oro e profumo di resina", bg: "ci_tendone", w: 16, h: 11, start: [8, 9], outside: ["ci_spiazzo", 7, 9], base: "Q",
        flavor: { X: "Il sipario di velluto cremisi che dà sulla pista acrobatica.", A: "Il leggio d'ottone con il Cartellone dei numeri della serata.", K: "Gradinate di larice lucidate una per una da Pippo.", P: "Bilancieri, clave dorate e pedane elastiche pronte per il debutto.", l: "Riflettore caldo puntato sul centro della pista." },
        npcs: () => [{ id: "ci_zampano", at: [6, 5] }, { id: "ci_lila", at: [10, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Q"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(5, 3, 10, 7, "U");
          put(7, 1, "X"); put(8, 1, "X"); put(12, 2, "A");
          lay(2, 2, 4, 2, "K"); lay(2, 7, 3, 7, "K"); put(13, 7, "P"); put(4, 1, "l"); put(11, 1, "l");
        },
        decor(g, cx, cy, d) {
          const s = S(), on = s >= 2 && s <= 3;
          H.plaque(g, on ? "▶ PISTA ACROBATICA" : "SIPARIO", d.X(7) + 16, d.Y(1) - 6, on ? "#fde047" : "#fecdd3");
          H.plaque(g, "📋 CARTELLONE", d.X(12) + 8, d.Y(2) - 8, "#fde68a");
        }
      },
      ci_carro: {
        interior: true, region: "carro", name: "Il Carro di Miranda", short: "Carro", sub: "Specchi d'argento, velluti viola e locandine d'epoca", bg: "ci_carro", w: 16, h: 11, start: [8, 9], outside: ["ci_spiazzo", 23, 9], base: "Y",
        flavor: { V: "Una specchiera veneziana che moltiplica per tre le lanterne.", M: "Un costume da funambola del 1952 ricamato di stelle d'argento.", T: "Sul tavolino tondo riposano i tarocchi marsigliesi e un registro di cassa.", b: "Sgabello imbottito di velluto prugna." },
        npcs: () => [{ id: "ci_miranda", at: [6, 5] }],
        loot: { "13,2": { id: "ci_zucchero", text: "Nel bauletto foderato di latta trovi un Cono di zucchero filato ancora fragrante (🎒 Zaino).", empty: "Nel bauletto restano solo nastri di raso e biglietti d'epoca." } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(5, 4, 10, 7, "U");
          put(3, 2, "V"); put(11, 2, "M"); put(7, 4, "T"); put(8, 4, "b"); put(13, 2, "x");
        },
        decor(g, cx, cy, d) { H.plaque(g, "ARCHIVIO & TAROCCHI", d.X(8) + 8, d.Y(0) + 6, "#e9d5ff"); }
      }
    };

    return {
      n: N, title: "Il Picchetto d'Ottone", sub: "Un avviso di sgombero, due numeri in scaletta e il primo salto sotto la cupola",
      goal, start: "ci_spiazzo", introBg: "ci_titolo", zones, talk,
      obj: {
        "ci_tendone:X": () => curtain(),
        "ci_tendone:A": () => K.billboard.open(() => K.done(), true)
      },
      intro: [
        ["voce", "Ottobre, Pian dei Venti. Sopra le scogliere del Borgo Marino è arrivata la carovana dipinta del Circo Zampanò: sette carri, un tendone cremisi e una tromba che si sente fino al porto."],
        ["voce", "Ti avevano chiamato per tirare due calci d'esibizione nella fiera d'autunno, ma davanti ai picchetti d'ottone l'aria profuma già di sfida."]
      ]
    };
  }
  boot();
})();
