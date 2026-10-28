// js/missione-c1.js - «MISSIONE SENZA RITORNO» · Capitolo 1: Porto Omega
// La nuova Normanna, il Signor Fumo e l'elenco dei nomi. A Porto Omega si reclutano il Prof. Mordini (laboratorio) e Arcangelo (il ponte assediato, primo scontro «Squadra in Pausa»).
(function () {
  "use strict";
  function boot() {
    const E = window.__missioneCore;
    if (!E || !E.api || !E.api.addChapter || !window.__missioneH || !window.__pausa) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__missioneH(K), { say, done, ask, wask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("ms_c1", { kind: "shirt", label: "Divisa della Normanna", val: "#1e3a5f", from: "Capitolo 1 di Missione Senza Ritorno" });
    K.lore("l_raccoglitori", { t: "I Raccoglitori", d: "Nessuno li ha visti in faccia: maschere scure con due occhi gialli, tute nere, un ronzio da sciame. Arrivano la notte prima di una finale e lasciano uno spogliatoio vuoto, con le scarpe ancora calde." });
    K.lore("l_cerbero", { t: "Cerbero", d: "Un'agenzia che compra squadre, stadi, diritti e segreti. Ha tre teste: quella che firma, quella che paga e quella che non si vede. Il Signor Fumo è la terza." });
    K.lore("l_omega", { t: "Porto Omega", d: "Un porto senza bandiera al confine del Mediterraneo. Si arriva per affari, si resta per debiti. Comanda Aria, dal balcone dell'Aldilà." });
    K.lore("l_normanna", { t: "La Normanna", d: "Nave da trasferta, scafo nuovo e nome vecchio. La prima Normanna è affondata due anni fa, una notte senza luna. Tu eri a bordo. Sei tornato a galla. Lei no." });

    const goal = (s) => ({
      0: "Sul ponte della Normanna: parla con Miranda Lauro.",
      1: "Entra nella Sala Tattica (la porta grande sul ponte) e ascolta il Signor Fumo.",
      2: rec2(),
      3: "Torna alla Normanna e parla con Jolly, in plancia: si parte.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");
    function rec2() { const m = K.crew.has("ms_mordini"), g = K.crew.has("ms_garro"); return `A Porto Omega (scendi dalla passerella a est): ${m ? "✓ Mordini" : "recluta il Prof. Mordini (laboratorio a sud-ovest)"} · ${g ? "✓ Arcangelo" : "trova Arcangelo (il Reclutatore, a est)"}.`; }
    function both() { if (S() === 2 && K.crew.has("ms_mordini") && K.crew.has("ms_garro")) { setStep(N, 3); quest("ms_c1c", "Si parte", "Torna alla Normanna e parla con Jolly, in plancia."); say("voce", "Mordini e Arcangelo sono a bordo. Il Signor Fumo sarà contento. Questo, di solito, è un cattivo segno."); } }

    function fin() {
      setStep(N, 4); F.set("ms_c1_done", true);
      K.reward("ms_c1", { coins: 90, cos: "ms_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["ms_jolly", "[ride] Motori caldi, rotta a sud-est, e a bordo uno scienziato che canta e un cecchino che calibra il frigorifero. Mi sento a casa."],
        ["ms_edi", "Segnalo che il Prof. Mordini ha appena spiegato a Garro come calibrare meglio. Garro sta calibrando la pazienza."],
        ["ms_miranda", "[serio] Abbiamo i primi nomi. Ora servono gli altri, e serve che ci seguano fino in fondo. Il Passo d'Omega non perdona chi esita."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>🔵 Esempio ${K.stat("esempio")} · 🔴 Spregiudicato ${K.stat("spregio")} · 📦 Risorse ${K.stat("risorse")} · Squadra ${K.crew.count()}/${K.crew.total}`],
        ["voce", "Il Capitolo 2 ti aspetta: altri nomi sull'elenco, e una nave nera all'orizzonte."]
      ]), () => K.openMain(), "ms_titolo");
    }

    function bridgeFight() {
      const bonus = K.inv.has("ms_mappa") ? 1 : 0;
      H.fight({ title: "Il ponte di Arcangelo", arena: "ponte", bonus, waves: [[["base", 4]], [["base", 3], ["lesto", 3]], [["scudo", 2], ["base", 3], ["grosso", 1]]] }, (r) => {
        if (r.win) {
          F.set("ms_ponte_vinto", true);
          say("ms_garro", "[sorpreso] Tre bande, un ponte e una squadra che spara dalla parte giusta. Pensavo di aver visto tutto, a Omega.");
          say("ms_garro", "[ride] Comandante! Credevo fossi in fondo al mare. Ti ho cercato, sai. Poi ho smesso e ho iniziato a mirare a chi se lo meritava.");
          say("ms_garro", "Hai una nave e una missione impossibile? Bene. Le missioni possibili mi annoiano. Dammi un minuto: sto calibrando.");
          K.crew.recruit("ms_garro"); K.learnLore("l_omega");
          say("voce", "Garro «Arcangelo» si unisce alla squadra. Potere nella Ruota: 🎯 Tiro di precisione (3 danni, rompe gli scudi).");
          both(); return done();
        }
        say("ms_recluta", "[ride] Ritirata? Capita. Il ponte resta lì, e Arcangelo pure. Le bande, invece, crescono.");
        say("voce", "Schiera una squadra diversa dal menu (⚔️) se serve, poi riprova."); done();
      });
    }

    const talk = {
      ms_miranda() {
        if (K.rel.scene("ms_miranda")) return;
        const s = S();
        if (s === 0) {
          say("ms_miranda", "[serio] Comandante. Ben svegliato. Due anni fa la prima Normanna è affondata con metà della squadra. Tu sei tornato a galla, e Cerbero ha pagato ogni punto di sutura.");
          say("ms_miranda", "Io sono Miranda Lauro. Ti ho rimesso in piedi. Ora tu rimetti in piedi qualcos'altro.");
          say("ms_miranda", "Nel Mediterraneo spariscono squadre intere, la notte prima delle finali. Spogliatoi vuoti, scarpe calde. Il Signor Fumo ti aspetta nella Sala Tattica.");
          K.learnLore("l_normanna"); K.learnLore("l_cerbero"); K.crew.recruit("ms_miranda"); setStep(N, 1);
          quest("ms_c1", "La nuova Normanna", "Entra nella Sala Tattica e ascolta il Signor Fumo.");
          return wask("Come rispondi a Miranda?", [
            { label: "🔵 «Grazie. Davvero.»", w: { esempio: 1 }, fn: () => { say("ms_miranda", "[sorpreso] Prego. Non me lo dice mai nessuno. Di solito mi chiedono il conto."); say("voce", "Miranda si unisce alla squadra. Potere nella Ruota: 🕸️ Rete (ferma un nemico, 2 danni)."); done(); } },
            { label: "🔴 «Lavoro per me stesso, non per Cerbero.»", w: { spregio: 1 }, fn: () => { say("ms_miranda", "[furbo] Allora lavoriamo per la stessa persona, per ora. Va bene così."); say("voce", "Miranda si unisce alla squadra. Potere nella Ruota: 🕸️ Rete (ferma un nemico, 2 danni)."); done(); } },
            { label: "«Quanti punti di sutura?»", fn: () => { say("ms_miranda", "[ride] Quattrocentododici. Ho fatto un grafico. Ti piacerebbe."); say("voce", "Miranda si unisce alla squadra. Potere nella Ruota: 🕸️ Rete (ferma un nemico, 2 danni)."); done(); } }
          ]);
        }
        say("ms_miranda", s === 1 ? "La Sala Tattica, Comandante. La porta grande. Il Signor Fumo non ama aspettare, e fuma di più quando aspetta." : s === 2 ? "Porto Omega è a est, oltre la passerella. Lì le regole sono di Aria. Io preferisco le mie." : s === 3 ? "Jolly è in plancia, a ovest. Se ride, è pronto. Se ride molto, è pronto e ha toccato qualcosa." : "Avanti, Comandante."); done();
      },
      ms_jacopo() {
        if (K.rel.scene("ms_jacopo")) return;
        if (!K.crew.has("ms_jacopo")) {
          say("ms_jacopo", "[serio] Jacopo Tessa. Ex carabiniere, ora con Cerbero. Lo dico subito, così non te lo dicono gli altri alle spalle.");
          say("ms_jacopo", "Non mi fido del Signor Fumo. Mi fido di chi va a riprendersi le persone. Se sei tu, ci sto.");
          return wask("Jacopo aspetta una risposta.", [
            { label: "🔵 «Ci riprendiamo tutti. Uno per uno.»", w: { esempio: 1 }, fn: () => { K.crew.recruit("ms_jacopo"); say("ms_jacopo", "[felice] È la frase che volevo sentire. Ci sto."); say("voce", "Jacopo si unisce alla squadra. Potere nella Ruota: 🛡️ Barricata (ripara la difesa)."); done(); } },
            { label: "🔴 «Ti fidi di chi ti paga. Come tutti.»", w: { spregio: 1 }, fn: () => { K.crew.recruit("ms_jacopo"); say("ms_jacopo", "[pensa] Forse. Ma ti ho detto la verità, almeno. Ci sto lo stesso."); say("voce", "Jacopo si unisce alla squadra. Potere nella Ruota: 🛡️ Barricata (ripara la difesa)."); done(); } },
            { label: "«Ne parliamo dopo.»", fn: () => { say("ms_jacopo", "Dopo, allora. Io sono qui."); done(); } }
          ]);
        }
        say("ms_jacopo", S() === 2 ? "A Omega guardati le spalle. Io ti guardo il resto." : "Pronto quando lo sei tu, Comandante."); done();
      },
      ms_jolly() {
        if (K.rel.scene("ms_jolly")) return;
        const s = S();
        if (s === 3) {
          say("ms_jolly", "[ride] Comandante in plancia! Abbiamo uno scienziato, un cecchino, un'operativa perfetta e un carabiniere che si scusa con le porte. Rotta?");
          return ask("Jolly aspetta la rotta.", [{ label: "🚀 «Si parte.»", sub: "Chiude il capitolo", big: true, cls: "hot", fn: fin }, { label: "↩ «Un momento ancora.»", fn: () => { say("ms_jolly", "Aspetto. Sono bravissimo ad aspettare. Lo dice solo EDI che non è vero."); done(); } }]);
        }
        say("ms_jolly", s < 2 ? "[ride] Benvenuto a bordo, Comandante. La nave è nuova, il pilota è il solito. Il pilota migliore, cioè." : "Porto Omega: il posto più bello del mondo dopo tutti gli altri. Non toccate niente che brilla.");
        say("ms_edi", "Correzione: Jolly è il pilota con più incidenti evitati all'ultimo secondo. È un primato. Non necessariamente un vanto."); done();
      },
      ms_edi() {
        if (K.rel.scene("ms_edi")) return;
        say("ms_edi", "Buongiorno, Comandante. Sono EDI, la voce della Normanna. Ho accesso a sensori, porte e frigorifero. Jolly sostiene che il terzo è un abuso.");
        if (!F.is("ms_edi1")) { F.set("ms_edi1", true); K.bond("risorse", 1); say("ms_edi", "Ho trovato una cassa di materiali dimenticata nella stiva da Cerbero. L'ho dimenticata anch'io, nel registro. Risorse +1."); }
        done();
      },
      ms_fumo() {
        if (K.rel.scene("ms_fumo")) return;
        const s = S();
        if (s === 1) {
          say("ms_fumo", "[furbo] Comandante. Bentornato tra i vivi. Ho investito molto nel tuo ritorno: non deludere il bilancio.");
          say("ms_fumo", "Diciannove squadre sparite in un anno. L'ultima, i Vecchi Gabbiani di Porto Omega: veterani, la notte prima della finale dei veterani. Spariti. Li prendono i Raccoglitori.");
          say("ms_fumo", "Da dove vengono? Oltre il Passo d'Omega. Nessuno che l'abbia attraversato è tornato. Per questo voglio i migliori, e voglio che ti seguano anche lì.");
          say("ms_fumo", "Ti ho mandato un elenco. Primi due nomi: il Professor Mordini, che ha un laboratorio a Porto Omega, e un certo Arcangelo, che a Omega ha fatto arrabbiare tre bande in una settimana.");
          K.learnLore("l_raccoglitori"); setStep(N, 2); quest("ms_c1b", "L'elenco dei nomi", "A Porto Omega: il Prof. Mordini e Arcangelo.");
          return wask("Il Signor Fumo ti guarda attraverso il fumo.", [
            { label: "🔵 «Lo faccio per quelle squadre, non per te.»", w: { esempio: 1 }, fn: () => { say("ms_fumo", "[ride] Motivazione nobile. Costa uguale. Buon viaggio, Comandante."); done(); } },
            { label: "🔴 «E cosa ci guadagna Cerbero?»", w: { spregio: 1 }, fn: () => { say("ms_fumo", "[furbo] Domanda giusta. Risposta: tutto quello che troverai oltre il Passo. Ma tu porta indietro le persone. Il resto lo porto io."); done(); } },
            { label: "«Perché proprio io?»", fn: () => { say("ms_fumo", "[serio] Perché la gente ti segue. È l'unica cosa che non ho mai saputo comprare."); done(); } }
          ]);
        }
        say("ms_fumo", s === 2 ? "Omega, Comandante. Il Professore e Arcangelo. Il tempo, a differenza delle sigarette, non si ricompra." : "Buon lavoro. Ti guardo da cento schermi. Non sentirti osservato."); done();
      },
      ms_aria() {
        if (K.rel.scene("ms_aria")) return;
        if (!F.is("ms_aria1")) {
          F.set("ms_aria1", true); K.learnLore("l_omega");
          say("ms_aria", "[furbo] Il Comandante della Normanna, in persona. Io sono Aria. Questo è Omega. Una sola regola: non fare arrabbiare Aria.");
          say("ms_aria", "Il tuo Professore si è chiuso nel laboratorio, a sud-ovest. I Soli Blu gli hanno rubato il taccuino e lo hanno lasciato in pegno al mio barista. Dice che è il lavoro di una vita. Io dico che è un debito.");
          say("ms_aria", "Arcangelo? Tre bande lo vogliono morto e assumono chiunque. Il Reclutatore sta al banco a est. Firma, e vai sul ponte dalla parte che preferisci.");
          return done();
        }
        if (S() === 2 && !K.inv.has("ms_taccuino") && !K.crew.has("ms_mordini") && !F.is("ms_aria_favore")) {
          return wask("Aria accavalla le gambe sul divano.", [
            { label: "🔵 «Il taccuino serve a salvare persone.»", sub: "Ti dovrà un favore? No: tu lo dovrai a lei", w: { esempio: 1 }, fn: () => { F.set("ms_aria_favore", true); F.set("ms_debito_aria", true); K.inv.give("ms_taccuino"); say("ms_aria", "[pensa] Persone. A Omega è una moneta rara. Prendi il taccuino: un giorno ti chiederò qualcosa, e tu dirai di sì."); say("voce", "Ottieni il Taccuino di Mordini. Hai un debito con Aria."); done(); } },
            { label: "Niente, grazie", fn: () => { say("ms_aria", "Saggio. Le cose gratis, a Omega, sono le più care."); done(); } }
          ]);
        }
        say("ms_aria", "[ride] Ancora qui? Il divano è mio, la vista pure. Le storie, se sono buone, le compro."); done();
      },
      ms_barista() {
        if (K.rel.scene("ms_barista")) return;
        if (S() === 2 && !K.inv.has("ms_taccuino") && !K.crew.has("ms_mordini")) {
          say("ms_barista", "Il taccuino del Professore? Sì, è in pegno. Tre casse di materiali e te lo do. Oppure chiedi ad Aria: lei regala solo debiti.");
          return wask("Il barista asciuga un bicchiere già asciutto.", [
            { label: "📦 Paga 3 Risorse", sub: K.stat("risorse") >= 3 ? "Il prezzo giusto" : "Non hai abbastanza Risorse", disabled: K.stat("risorse") < 3, fn: () => { K.bond("risorse", -3); K.inv.give("ms_taccuino"); say("ms_barista", "Affare fatto. Il Professore mi doveva anche due caffè. Quelli li perdono."); say("voce", "Ottieni il Taccuino di Mordini."); done(); } },
            { label: "🔴 Sbatti la mano sul bancone", w: { spregio: 1 }, fn: () => { K.inv.give("ms_taccuino"); say("ms_barista", "[sorpreso] Calma, calma! Prendilo. Ma Aria lo saprà prima che tu esca."); say("voce", "Ottieni il Taccuino di Mordini."); done(); } },
            { label: "Ci penso", fn: done }
          ]);
        }
        if (!F.is("ms_bottiglia")) { F.set("ms_bottiglia", true); K.inv.give("ms_birra"); say("ms_barista", "Offre la casa. Cioè Aria. Cioè, prima o poi, tu."); say("voce", "Ottieni una Bottiglia dell'Aldilà."); return done(); }
        say("ms_barista", "Il cocktail della casa si chiama «Domani». Lo serviamo solo oggi."); done();
      },
      ms_mordini() {
        if (K.rel.scene("ms_mordini")) return;
        if (K.crew.has("ms_mordini")) { say("ms_mordini", "Pronto. Attrezzi pronti. Operetta quasi pronta. Secondo atto difficile, tenore pigro."); return done(); }
        if (S() < 2) { say("ms_mordini", "[arrabbiato] Chiuso! Laboratorio chiuso. Tornare più tardi. O mai. Mai meglio."); return done(); }
        if (K.inv.has("ms_taccuino")) {
          K.inv.take("ms_taccuino"); F.set("ms_mordini_tac", true);
          say("ms_mordini", "[felice] Taccuino! Mio taccuino! Pagina quaranta: formula. Pagina quarantuno: operetta. Ancora intatte. Ottimo, ottimo, ottimo.");
          say("ms_mordini", "Raccoglitori, sì. Sentito. Studiato. Loro armatura: chitina sintetica, non cuoio. Schiuma collante giusta la blocca. Io ho schiuma giusta. Mancava solo il taccuino. E un motivo.");
          return wask("Mordini ti fissa con gli occhiali storti.", [
            { label: "🔵 «Il motivo sono le squadre sparite.»", w: { esempio: 1 }, fn: () => { K.crew.recruit("ms_mordini"); say("ms_mordini", "Motivo buono. Accetto. Porto schiuma, taccuino e Cinzia resta qui: qualcuno deve finire secondo atto."); say("voce", "Il Prof. Mordini si unisce alla squadra. Potere nella Ruota: 🫧 Schiuma collante (rallenta e logora una zona)."); both(); done(); } },
            { label: "🔴 «Il motivo è che Cerbero paga bene.»", w: { spregio: 1 }, fn: () => { K.crew.recruit("ms_mordini"); say("ms_mordini", "[ride] Motivo onesto. Raro. Accetto anche quello. Pagamento in materiali, grazie: soldi poco scientifici."); say("voce", "Il Prof. Mordini si unisce alla squadra. Potere nella Ruota: 🫧 Schiuma collante (rallenta e logora una zona)."); both(); done(); } }
          ]);
        }
        say("ms_mordini", "[arrabbiato] Taccuino rubato. Soli Blu. Senza taccuino niente formula, senza formula niente Professore. Professore solo parole. Molte parole.");
        say("ms_cinzia", "Il Professore vuole dire che senza il taccuino non parte. L'hanno lasciato in pegno all'Aldilà, al bancone."); done();
      },
      ms_cinzia() {
        if (K.rel.scene("ms_cinzia")) return;
        say("ms_cinzia", K.crew.has("ms_mordini") ? "[ride] Il Professore mi ha lasciato l'operetta da finire. Quarto atto: la soprano muore. Glielo chiedo da anni di cambiarlo." : "Il Professore lavora da tre giorni senza dormire. Dice che dormire è una perdita di dati.");
        done();
      },
      ms_vecchio() {
        if (K.rel.scene("ms_vecchio")) return;
        if (!F.is("ms_pietro")) {
          F.set("ms_pietro", true);
          say("ms_vecchio", "[triste] I Vecchi Gabbiani. Quarant'anni di calcio sul molo. La sera prima della finale, ero rimasto a sistemare le reti. Quando sono tornato, lo spogliatoio era vuoto.");
          say("ms_vecchio", "Le scarpe erano lì, in fila. Ancora calde. La maglia di mio fratello sulla panca, piegata. Lui non piegava mai niente.");
          say("ms_vecchio", "Vuoi andare sul ponte di Arcangelo? Io ho visto dove si mettono le tre bande, dalla barca. Prendi questa. È l'unica cosa che posso fare, adesso.");
          K.inv.give("ms_mappa"); say("voce", "Ottieni la Piantina del ponte: nello scontro sul ponte, la tua squadra parte avvantaggiata.");
          return wask("Nonno Pietro ti guarda.", [
            { label: "🔵 «Lo riporto a casa. Te lo prometto.»", w: { esempio: 1 }, fn: () => { F.set("ms_promessa", true); say("ms_vecchio", "[triste] Non promettere. Le promesse affondano. Ma grazie."); done(); } },
            { label: "«Farò quello che posso.»", fn: () => { say("ms_vecchio", "È più di quello che ha fatto chiunque altro."); done(); } }
          ]);
        }
        say("ms_vecchio", "Il mare dice sempre la verità. Solo che la dice piano."); done();
      },
      ms_recluta() {
        if (K.rel.scene("ms_recluta")) return;
        if (K.crew.has("ms_garro")) { say("ms_recluta", "[arrabbiato] Ti ho arruolato io, e tu hai sparato alle bande. Questo, nel mio mestiere, si chiama «referenza negativa»."); return done(); }
        if (S() < 2) { say("ms_recluta", "Arruolamenti chiusi per ora. Torna quando hai un motivo o un debito."); return done(); }
        const fightMenu = () => ask("Il ponte di Arcangelo: tre bande da un lato, Arcangelo dall'altro.", [
          { label: "⏸ Vai sul ponte", sub: "Scontro «Squadra in Pausa» · 3 ondate", big: true, cls: "hot", fn: bridgeFight },
          { label: "👥 Scegli la squadra", sub: "Porti due compagni", fn: () => K.crew.pick(() => talk.ms_recluta(), true) },
          { label: "↩ Non ancora", fn: done }
        ]);
        if (F.is("ms_firmato")) return fightMenu();
        say("ms_recluta", "Nome? No, non mi interessa. Mani? Due. Bene. Le bande pagano chi elimina Arcangelo, sul ponte. Paga a cottimo, niente anticipi. Firmi?");
        return wask("Il modulo è unto e scritto a mano.", [
          { label: "✍️ Firmi e basta", fn: () => { F.set("ms_firmato", true); fightMenu(); } },
          { label: "🔴 Firmi e pretendi l'anticipo", sub: "+2 Risorse", w: { spregio: 1 }, fn: () => { F.set("ms_firmato", true); F.set("ms_anticipo", true); K.bond("risorse", 2); say("ms_recluta", "[sorpreso] Un anticipo? Nessuno me l'ha mai chiesto con quella faccia. Tieni. Non dirlo agli altri."); fightMenu(); } },
          { label: "🔵 Firmi col tuo nome vero", w: { esempio: 1 }, fn: () => { F.set("ms_firmato", true); say("ms_recluta", "[pensa] Il Comandante della Normanna? Era morto. Va be', i morti lavorano bene: non chiedono il permesso."); fightMenu(); } }
        ]);
      }
    };

    const zones = {
      ms_normanna: {
        region: "nave", name: "Il ponte della Normanna", short: "Normanna", sub: "Scafo nuovo, nome vecchio, mare ovunque", bg: "ms_normanna", time: "giorno", w: 30, h: 22, base: "Q", start: [7, 11],
        itemCos: "ms_c1", items: [[5, 5], [25, 17], [16, 16], [26, 4]],
        areas: [[2, 6, 6, 15, "La plancia di Jolly"], [9, 4, 15, 8, "La Sala Tattica"], [17, 13, 26, 18, "La stiva aperta"], [0, 0, 29, 21, "Normanna · ponte di coperta"]],
        act: { M: "Guarda la console", O: "Guarda il mare", E: "Guarda i container", K: "Guarda la bitta", n: "Leggi il cartello", x: "Apri la cassa", s: "Riposa un momento", l: "Guarda il faro", z: "Guarda le casse", q: "Scendi a Porto Omega" },
        flavor: { M: "Una console di navigazione: rotte, venti, e un'icona che lampeggia sul Passo d'Omega. Nessuno la tocca.", O: "Il mare. Due anni fa ti ha preso e poi ti ha restituito. Non hai ancora deciso se ringraziarlo.", E: "Container di Cerbero: «MATERIALI · NON APRIRE · VALE ANCHE PER TE, JOLLY».", K: "Una bitta con la cima avvolta stretta. Jolly ci ha disegnato sopra una faccina.", n: "Il cartello: «PORTO OMEGA ▸ passerella a est. Lasciare le armi a bordo. Battuta: non le lascia nessuno».", s: "Una panca di metallo. Scalda al sole, gela di notte, come tutto qui.", l: "Il faro di bordo: si accende da solo quando EDI pensa che sia il caso.", z: "Casse di palloni da allenamento. Qualcuno ha scritto «PER QUANDO SARÀ FINITA»." },
        loot: { "24,4": { id: "ms_foto", text: "Nella cassa, avvolta in una maglia: una foto della prima Normanna. La squadra sul ponte, due anni fa. Qualcuno ride. Qualcuno non c'è più.", empty: "La cassa è vuota. Solo una maglia piegata con cura." } },
        doors: { "29,10": { to: "ms_omega", at: [1, 10] }, "29,11": { to: "ms_omega", at: [1, 11] } },
        npcs: (s) => [{ id: "ms_miranda", at: [9, 11] }, { id: "ms_jacopo", at: [16, 10], route: [[16, 10], [20, 10], [20, 11], [16, 11]], speed: 0.4, pause: 60 }, { id: "ms_jolly", at: [4, 10] }, { id: "ms_edi", at: [24, 8] }],
        intro: [["voce", "La nuova Normanna: scafo nuovo, nome vecchio. Il mare è calmo come se non avesse niente da farsi perdonare."], ["voce", "A ovest la plancia, al centro la Sala Tattica, a est la passerella per Porto Omega. Miranda ti aspetta sul ponte."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "w"); lay(0, 20, 29, 21, "w"); lay(0, 0, 0, 21, "w"); lay(29, 0, 29, 21, "w");
          lay(1, 2, 28, 2, "O"); lay(1, 19, 28, 19, "O"); lay(1, 2, 1, 19, "O"); lay(28, 2, 28, 19, "O"); put(28, 10, "Q"); put(28, 11, "Q"); [[1, 2], [28, 2], [1, 19], [28, 19]].forEach(([x, y]) => put(x, y, "w"));
          // plancia: console a semicerchio
          [[3, 7], [3, 8], [3, 9], [3, 12], [3, 13], [3, 14], [4, 6], [4, 15]].forEach(([x, y]) => put(x, y, "M"));
          put(6, 6, "l"); put(6, 15, "l"); put(5, 17, "s");
          house(9, 4, 7, 5, { door: [12, 8], roof: "#1e3a5f", wall: "#94a3b8", enter: { to: "ms_sala", at: [7, 8] } });
          house(18, 4, 5, 4, { door: [20, 7], roof: "#334155", wall: "#cbd5e1", enter: "La tua cabina: un letto, una scrivania e un acquario vuoto. Jolly dice che i pesci arrivano «quando ce li meritiamo»." });
          house(9, 13, 6, 4, { door: [11, 16], roof: "#475569", wall: "#cbd5e1", chimney: true, enter: "La mensa: tavoli avvitati al pavimento e un cuoco che non c'è. Sul frigorifero, un biglietto di EDI: «Il frigorifero ricorda tutto»." });
          lay(18, 14, 21, 15, "E"); lay(23, 14, 24, 17, "E"); [[18, 17], [19, 17], [21, 17]].forEach(([x, y]) => put(x, y, "z"));
          put(24, 4, "x"); put(25, 4, "M"); put(26, 12, "n"); [[7, 4], [24, 7], [7, 17], [26, 16]].forEach(([x, y]) => put(x, y, "K"));
          put(16, 8, "l"); put(26, 14, "l");
          put(29, 10, "q"); put(29, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALA TATTICA", d.X(12) + 8, d.Y(4) - 6, "#7dd3fc"); H.plaque(g, "PLANCIA", d.X(3) + 8, d.Y(5) - 6, "#fde68a"); H.plaque(g, "STIVA", d.X(21) + 8, d.Y(13) - 6, "#cbd5e1"); H.plaque(g, "OMEGA ▸", d.X(27) + 8, d.Y(9) - 6, "#f0abfc"); }
      },
      ms_sala: {
        interior: true, region: "sala", name: "La Sala Tattica", short: "Sala Tattica", sub: "La mappa del Mediterraneo in luce e un ologramma che fuma", bg: "ms_sala", w: 14, h: 10, start: [7, 8], outside: ["ms_normanna", 12, 9], base: "Q",
        act: { M: "Guarda la console", P: "Guarda la mappa", n: "Leggi la lavagna", l: "Guarda la lampada", u: "Guarda il tavolo" },
        flavor: { M: "Una console con l'elenco dei nomi. Accanto a ogni nome, una casella: «reclutato», «leale», «tornato». L'ultima colonna è vuota.", P: "Il Mediterraneo in luce azzurra. Diciannove puntini rossi: le squadre sparite. Uno lampeggia ancora: Porto Omega.", n: "Una lavagna: «PASSO D'OMEGA: ??? · TANA: ??? · RITORNO: ???». Qualcuno ha aggiunto, in piccolo: «pizza venerdì».", l: "Una lampada blu. Fa sembrare tutti più seri di quanto sono.", u: "Un tavolo con tazze di caffè di tre turni diversi." },
        npcs: () => [{ id: "ms_fumo", at: [7, 2] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "Q"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          [[2, 1], [3, 1], [4, 1], [10, 1], [11, 1]].forEach(([x, y]) => put(x, y, "M")); lay(5, 4, 9, 5, "P"); put(1, 4, "n"); put(12, 4, "l"); put(1, 7, "u"); put(12, 7, "u");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALA TATTICA", d.X(7) + 8, d.Y(0) + 6, "#7dd3fc"); }
      },
      ms_omega: {
        region: "omega", name: "Porto Omega", short: "Porto Omega", sub: "Neon, pioggia e nessuna bandiera", bg: "ms_omega", time: "notte", w: 30, h: 22, base: ",", start: [2, 10],
        itemCos: "ms_c1", items: [[12, 7], [27, 13], [11, 19], [20, 18]],
        areas: [[1, 8, 6, 13, "Il molo"], [16, 2, 23, 7, "L'Aldilà"], [3, 14, 10, 18, "Il laboratorio di Mordini"], [24, 8, 28, 13, "Il banco dei mercenari"], [0, 0, 29, 21, "Porto Omega"]],
        act: { N: "Guarda l'insegna", E: "Guarda i container", K: "Guarda la bitta", n: "Leggi il cartello", u: "Guarda la bancarella", z: "Guarda le casse", l: "Guarda il lampione", b: "Siediti", s: "Riposa un momento", x: "Apri la cassa" },
        flavor: { N: "Un'insegna al neon che lampeggia a metà: «ALDI…» e poi niente. Chi entra sa come finisce la parola.", E: "Container senza nome. A Omega, le cose senza nome sono quelle che costano di più.", K: "Una bitta consumata dalle cime e dalle attese.", n: "Il cartello: «PORTO OMEGA · REGOLE: 1) NON FAR ARRABBIARE ARIA. 2) VEDI REGOLA 1».", u: "Una bancarella di pesce fritto e pezzi di ricambio. Non sempre si capisce quale sia quale.", z: "Casse con il simbolo di un sole blu. Meglio non leggere oltre.", l: "Un lampione che ronza sotto la pioggia. Sembra stanco quanto chi ci passa sotto.", b: "Una panchina bagnata. Ci si siede solo chi aspetta qualcuno che non arriverà.", s: "Una tettoia asciutta. Rara come la gentilezza, qui." },
        doors: { "0,10": { to: "ms_normanna", at: [27, 10] }, "0,11": { to: "ms_normanna", at: [27, 11] } },
        npcs: () => [{ id: "ms_vecchio", at: [5, 11] }, { id: "ms_recluta", at: [25, 10] }],
        intro: [["voce", "Porto Omega, notte. La pioggia è al neon, i neon sono a metà, e metà della gente ti guarda come una preda."], ["voce", "Al centro l'Aldilà, il locale di Aria. A sud-ovest il laboratorio di Mordini. A est, il banco dei mercenari e la strada per il ponte."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "E"); lay(0, 21, 29, 21, "E"); lay(29, 0, 29, 21, "a");
          lay(0, 0, 3, 8, "w"); lay(0, 13, 3, 21, "w"); lay(0, 9, 6, 12, ":"); lay(1, 10, 28, 11, "+"); lay(14, 1, 15, 20, "+"); lay(7, 18, 22, 19, "+");
          [[4, 8], [4, 13]].forEach(([x, y]) => put(x, y, "K"));
          house(16, 2, 8, 5, { door: [19, 6], roof: "#4c1d95", wall: "#312e81", enter: { to: "ms_aldila", at: [8, 10] } });
          [[16, 7], [23, 7], [13, 9]].forEach(([x, y]) => put(x, y, "N"));
          house(4, 14, 6, 4, { door: [6, 17], roof: "#14532d", wall: "#a7f3d0", enter: { to: "ms_lab", at: [7, 8] } });
          house(7, 2, 5, 4, { door: [9, 5], roof: "#3f3f46", wall: "#a1a1aa", enter: "Il Banco dei Pegni: chiuso «per inventario». Dentro qualcuno conta. Dalla voce, sta contando male." });
          house(24, 2, 4, 5, { door: [25, 6], roof: "#1e3a8a", wall: "#64748b", enter: "La torre sul ponte: porte sbarrate da dentro. Qualcuno, lassù, ha la pazienza di un cecchino." });
          lay(22, 14, 27, 15, "E"); lay(17, 13, 19, 14, "E"); [[11, 13], [12, 13], [20, 16]].forEach(([x, y]) => put(x, y, "z"));
          [[17, 9], [21, 9]].forEach(([x, y]) => put(x, y, "u")); put(11, 9, "b"); put(12, 15, "s"); put(7, 9, "n"); put(26, 12, "n");
          [[6, 12], [13, 12], [22, 12], [16, 17], [10, 17]].forEach(([x, y]) => put(x, y, "l"));
          put(27, 19, "x"); [[1, 14], [2, 16]].forEach(([x, y]) => put(x, y, "w"));
          put(0, 10, "q"); put(0, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "ALDILÀ", d.X(19) + 8, d.Y(2) - 6, "#f0abfc"); H.plaque(g, "LAB. MORDINI", d.X(6) + 8, d.Y(14) - 6, "#86efac"); H.plaque(g, "BANCO MERCENARI", d.X(25) + 8, d.Y(9) - 6, "#fca5a5"); H.plaque(g, "◂ NORMANNA", d.X(2) + 8, d.Y(9) - 6, "#7dd3fc"); H.plaque(g, "PEGNI", d.X(9) + 8, d.Y(2) - 6, "#d4d4d8"); }
      },
      ms_aldila: {
        interior: true, region: "aldila", name: "L'Aldilà", short: "Aldilà", sub: "Musica forte, luci viola e il divano di Aria", bg: "ms_aldila", w: 16, h: 12, start: [8, 10], outside: ["ms_omega", 19, 7], base: "+",
        act: { u: "Guarda il bancone", N: "Guarda l'insegna", b: "Siediti", x: "Apri la cassa", l: "Guarda la luce", z: "Guarda le casse" },
        flavor: { u: "Il bancone dell'Aldilà: vetro nero, bicchieri blu e un elenco di debiti scritto sotto, dove si appoggiano i gomiti.", N: "Un'insegna al neon: «QUI SI ENTRA VIVI». Sotto, a matita: «di solito».", b: "Un divanetto di velluto. Comodo. Troppo comodo per un posto così.", l: "Un faro da discoteca che gira. Ogni tanto illumina qualcuno che preferirebbe di no.", z: "Casse di bottiglie blu. Il liquore si accende quando lo apri. Il conto, anche." },
        loot: { "1,9": { id: "ms_birra", text: "Dietro il divanetto, in una cassa: una bottiglia blu che si accende quando la stappi.", empty: "La cassa è vuota. Il barista ti guarda: lo sapeva." } },
        npcs: () => [{ id: "ms_aria", at: [13, 3] }, { id: "ms_barista", at: [9, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(4, 5, 11, 8, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          lay(2, 2, 8, 2, "u"); put(3, 1, "N"); put(12, 1, "N"); [[12, 4], [14, 4], [13, 5]].forEach(([x, y]) => put(x, y, "b")); put(1, 9, "x"); [[2, 6], [13, 8]].forEach(([x, y]) => put(x, y, "l")); put(14, 10, "z"); put(1, 4, "b");
        },
        decor(g, cx, cy, d) { H.plaque(g, "ALDILÀ", d.X(8) + 8, d.Y(0) + 6, "#f0abfc"); }
      },
      ms_lab: {
        interior: true, region: "lab", name: "Il laboratorio di Mordini", short: "Laboratorio", sub: "Provette, palloni sezionati e un'operetta a metà", bg: "ms_lab", w: 14, h: 10, start: [7, 8], outside: ["ms_omega", 6, 18], base: "+",
        act: { M: "Guarda la console", u: "Guarda il banco", n: "Leggi la lavagna", z: "Guarda le casse", l: "Guarda la lampada" },
        flavor: { M: "Uno strumento che misura qualcosa. Il Professore dice «tutto». Cinzia dice «la pazienza».", u: "Un banco di lavoro: un pallone tagliato a spicchi, tre colle diverse e un panino mai finito.", n: "La lavagna: formule, una nota musicale e la scritta «NON CANCELLARE, È IMPORTANTE (forse)».", z: "Casse di campioni: «CHITINA · NON TOCCARE · NON ANNUSARE · NON CHIEDERE».", l: "Una lampada verde. Rende tutti un po' più malaticci e un po' più geniali." },
        npcs: () => [{ id: "ms_mordini", at: [7, 4] }, { id: "ms_cinzia", at: [3, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          [[2, 1], [3, 1], [10, 1], [11, 1]].forEach(([x, y]) => put(x, y, "M")); lay(5, 2, 9, 2, "u"); put(6, 1, "n"); [[11, 6], [12, 7]].forEach(([x, y]) => put(x, y, "z")); put(1, 3, "l"); put(12, 3, "l"); put(10, 5, "u");
        },
        decor(g, cx, cy, d) { H.plaque(g, "LABORATORIO", d.X(7) + 8, d.Y(0) + 6, "#86efac"); }
      }
    };
    return {
      n: N, title: "Porto Omega", sub: "Una nave nuova, un elenco di nomi e un porto senza bandiera",
      goal, start: "ms_normanna", introBg: "ms_titolo", zones, talk, obj: {},
      intro: [["voce", "Mediterraneo, oggi. In un anno sono sparite diciannove squadre di paese, sempre la notte prima di una finale. Spogliatoi vuoti, scarpe ancora calde."], ["voce", "Due anni fa la tua nave, la Normanna, è affondata. Tu sei tornato a galla. Ora un uomo che fuma davanti a cento schermi ti ha dato una nave nuova e un elenco di nomi."]]
    };
  }
  boot();
})();
