// js/banda-c5.js - «BANDA DI PIAZZA» · Capitolo 5: Venezia
// Il concorso nazionale delle bande. Il Maestro Leandro Doge (Filarmonica Serenissima), vecchio compagno di conservatorio di Ferrante, racconta una storia che
// Ferrante non ha mai raccontato. Notte in locanda, poi il teatro: Gran Concerto (brano «Ritmo», quota 68%) oppure, se la marcia è intera e la banda è in pace,
// la Marcia della Rondine (quota 70%). Quattro finali: Il Trofeo del Maestro, La Banda del Borgo, L'Altoparlante, La Marcia della Rondine (segreto).
// Zone: Venezia (34x24: campo, canale con ponte e gondole, teatro, locanda, imbarcadero), la locanda (12x9), il retropalco del teatro (16x11).
(function () {
  "use strict";
  function boot() {
    const E = window.__bandaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__bandaH || !E.api._has(4)) return setTimeout(boot, 100);
    E.api.addChapter(chapter5);
  }
  function chapter5(K) {
    const { setStep, quest, F } = K, H = window.__bandaH(K), { say, done, ask, wask } = H;
    const N = 5, S = () => K.stepOf(N);
    H.people();
    K.cos("bp_c5", { kind: "acc", label: "Medaglia di Venezia", val: "medaglia", from: "Capitolo 5 di Banda di Piazza" });
    K.lore("l_sardi", { t: "Marco Sardi", d: "Il miglior allievo di Ferrante al conservatorio. Diciannove anni, violino. Al saggio finale, dopo tre mesi di «di nuovo», le mani gli tremarono così forte che lasciò il palco. Non suonò più. Oggi insegna ai bambini, e scrive al suo vecchio maestro ogni Natale." });
    K.lore("l_doge", { t: "Leandro Doge", d: "Direttore della Filarmonica Serenissima, campione nazionale da sei anni. Compagno di banco di Ferrante al conservatorio: uno contava, l'altro improvvisava. Si odiano con grande affetto." });

    const secret = () => K.stat("fogli") >= 4 && F.is("bp_pace_ciro") && F.is("bp_pace_ferrante");
    const goal = (s) => ({
      0: "All'imbarcadero (in basso): il Maestro Ferrante ha il programma della giornata. Undici pagine.",
      1: "Nel campo a nord del ponte: qualcuno della Filarmonica Serenissima vuole conoscere la banda di Borgo Marino.",
      2: "Sera: alla locanda «Al Gondoliere» (in basso a sinistra), il Maestro è alla finestra.",
      3: "Mattina del concorso: al teatro (il palazzo grande a nord). Nel retropalco, parla col Maestro quando sei pronto.",
      4: "Il concorso è finito."
    }[s] || "Banda di Piazza è conclusa.");

    const ENDS = {
      trofeo: { coins: 380, lines: [["voce", "«Primo premio: Banda Città di Borgo Marino. Esecuzione impeccabile.» La giuria che non sorride dal 1987 annuisce. Una volta."], ["bp_ferrante", "[felice] Impeccabile. L'hanno detto. Impeccabile."], ["voce", "Una settimana dopo arriva una lettera dal conservatorio di Milano: cattedra di direzione per il Maestro Ferrante. Accetta. La banda resta, lo stadio resta, la piazza è salva."], ["voce", "Alle prove del martedì, alle sette meno cinque, qualcuno lascia un leggio vuoto in prima fila. Nessuno lo sposta."]] },
      borgo: { coins: 400, lines: [["voce", "La giuria tecnica dà il primo premio alla Serenissima. Ma alla fine del vostro brano il teatro si alza in piedi, tutto, anche i palchi. Premio del pubblico: Borgo Marino."], ["bp_bracco", "[sorpreso] Il pubblico. Mille persone. In piedi. ...Va bene. Va bene! La cassa la mettiamo al parcheggio, per annunciare i posti liberi."], ["bp_nana", "[felice] Domenica ragù per tutti! Anche per l'Assessore! Seduto, però."], ["voce", "La domenica dopo, allo stadio, l'altoparlante resta spento. In curva c'è una grancassa con la rondine, e qualcuno che le dà il tempo."]] },
      cassa: { coins: 200, lines: [["voce", "Il verdetto arriva per posta, una settimana dopo: nessun premio. L'Assessore firma il contratto con SuonoSmart la mattina stessa."], ["voce", "Allo stadio arriva la cassa nuova: lucida, perfetta, senza errori. La curva la ascolta in silenzio."], ["bp_rocco", "[serio] Non importa. Domenica, alle sette meno cinque, in piazza. Senza leggii, senza permesso. Ci sei?"], ["voce", "Ogni domenica mattina, in Piazza della Rondine, una banda suona lo stesso. La gente scende in pigiama. Dopo un mese, anche Gigi viene col registratore."]] },
      rondine: { coins: 500, lines: [["voce", "La banda attacca la Marcia della Rondine. L'attacco, il trio di Tonino, il ritornello col lapis da falegname. Arrivati a metà, nessuno si ferma."], ["voce", "Al finale, dal fondo della sala, entra una tromba da sola. Zio Ciro la tiene al contrario. Sul palco, per la prima volta in trent'anni, il Maestro Ferrante abbassa la bacchetta e ascolta."], ["bp_doge", "[sorpreso] (In piedi, in terza fila, il Maestro Doge è il primo ad applaudire. Poi tutto il teatro.)"], ["bp_ciro", "[felice] L'abbiamo finita, Tonino. L'abbiamo scritta noi."], ["voce", "Primo premio e premio del pubblico. La partitura completa della Marcia della Rondine viene appesa nella sala prove, sotto la foto del '72. In fondo, a matita: «il finale lo fa chi resta»."]] }
    };
    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 4); F.set("bp_c5_done", true); F.set("bp_fine_" + id, true);
      K.reward("bp_c5" + id, { coins: E2.coins, cos: "bp_c5" });
      K.finishChapter(N, id); K.end(id);
      const tt = K.rhythm.total();
      K.scene(H.flush().concat(E2.lines).concat([
        ["voce", `<b>FINE DI BANDA DI PIAZZA.</b><br>${H.stato()} · 🥁 Repertorio ${tt[0]}/${tt[1]} stelle`],
        ["voce", "Dal menu, 🎼 Il Quaderno della Banda: il Repertorio rigioca tutti i brani. Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «Ritmo»."]
      ]), () => K.openMain(), id === "cassa" ? "bp_piazza" : "bp_teatro");
    }
    function verdict(r, song) {
      if (r.win) {
        if (song === "rondine") return ending("rondine");
        return ending(K.stat("rigore") > K.stat("cuore") ? "trofeo" : "borgo");
      }
      say("voce", "L'ultimo accordo si spegne. Applausi educati. In giuria qualcuno scrive qualcosa, e non sembra un complimento.");
      return ask("Il regolamento concede una seconda esecuzione, una volta sola, se il direttore la chiede.", [
        { label: "🎺 Chiedi la seconda esecuzione", sub: F.is("bp_ripetuto") ? "L'hai già chiesta" : "Si risuona da capo", big: true, cls: "hot", disabled: F.is("bp_ripetuto"), fn: () => { F.set("bp_ripetuto", true); say("bp_ferrante", "[serio] Signori, di nuovo. Ma stavolta... stavolta non contate. Ascoltatevi."); concerto(song); } },
        { label: "🏳️ Accetta il verdetto", sub: "Il finale «L'Altoparlante»", fn: () => ending("cassa") }
      ]);
    }
    function concerto(song) {
      const S0 = song === "rondine" ? { title: "La Marcia della Rondine · intera", venue: "venezia" } : { title: "Gran Concerto di Venezia", venue: "venezia" };
      H.play(song, S0, (r) => verdict(r, song));
    }

    const talk = {
      bp_ferrante() {
        if (K.rel.scene("bp_ferrante")) return;
        const s = S();
        if (s === 0) {
          say("bp_ferrante", "[serio] Venezia. Pagina uno: arrivo, ore 16:40. Siamo arrivati alle 16:52. Il vaporetto ha un problema di disciplina.");
          say("bp_ferrante", "Pagina due: locanda «Al Gondoliere», cena, a letto alle nove. Pagina tre: domani, il teatro. Da pagina quattro a undici: cose che possono andare storte, in ordine di probabilità.");
          say("bp_rocco", "[ride] Pagina sette: «Rocco cade in un canale». L'ho letta. Ha messo una probabilità del quaranta per cento. Mi sono offeso. È almeno il sessanta.");
          setStep(N, 1); quest("bp_c5", "Venezia", "Attraversa il ponte: nel campo a nord, la Filarmonica Serenissima fa le prove all'aperto.");
          return done();
        }
        if (s === 2 && K.inZone("bp_locanda")) {
          say("bp_ferrante", "[triste] Il Doge le ha parlato di Marco. Lo so. Lo capisco da come mi guarda: come si guarda un metronomo rotto.");
          say("bp_ferrante", "Marco Sardi. Diciannove anni, violino. Il migliore. L'ho fatto suonare la stessa pagina per tre mesi. Al saggio finale gli tremavano le mani. È uscito dal palco a metà e non ci è più salito.");
          say("bp_ferrante", "Mi scrive ogni Natale. Insegna ai bambini. Dice che lo fa «piano, senza contare». Ogni Natale leggo quella frase e non dormo.");
          K.learnLore("l_sardi");
          const hold = F.is("bp_fer_tiene");
          return wask("Il Maestro guarda il canale dalla finestra. «Domani. Cosa devo fare, domani?»", [
            { label: "❤️ «Domani non conti. Ascolti.»", big: true, w: { cuore: 2 }, fn: () => {
              F.set("bp_notte_cuore", true); K.rel.add("bp_ferrante", 3);
              say("bp_ferrante", "[pensa] Non contare. Trent'anni che conto. Va bene. Proverò ad ascoltare. Se sbaglio, lei mi dia un colpo di grancassa.");
              if (hold) { F.set("bp_fer_tiene", false); F.set("bp_pace_ferrante", true); F.set("bp_f4", true); K.bond("fogli", 1); say("voce", "Il Maestro tira fuori dal registro il foglio piegato in quattro. L'ultima pagina della Marcia. Te la mette in mano senza dire niente.<br><b>📜 Foglio della Marcia: 4/4</b>"); say("bp_ferrante", "Il finale lo fa chi resta. Rondi lo sapeva. Io l'ho capito adesso, a Venezia, in una locanda che puzza di canale."); }
              next();
            } },
            { label: "🎼 «Domani conti per tutti. È quello che sa fare.»", big: true, w: { rigore: 2 }, fn: () => { F.set("bp_notte_rigore", true); K.rel.add("bp_ferrante", 2); say("bp_ferrante", "[serio] Conto per tutti. Sì. Qualcuno deve farlo. Grazie: era la risposta facile, e a volte la risposta facile è giusta."); next(); } }
          ]);
        }
        if (s === 3 && K.inZone("bp_teatro")) {
          say("bp_ferrante", "[serio] Tocca a noi fra dieci minuti. Il brano d'obbligo è fatto. Resta il terzo: «della tradizione del paese».");
          if (secret()) say("bp_ferrante", "[pensa] Abbiamo quattro fogli. La marcia intera. Ciro ha la tromba. Io ho... io ho le mani che tremano. Come Marco. Decida lei.");
          else say("bp_ferrante", K.stat("fogli") >= 4 ? "La marcia è intera, sulla carta. Ma una banda non suona la carta: suona la gente. E la gente, qui, non è ancora in pace." : "La marcia si ferma a metà, come sempre. Suoniamo il Gran Concerto: è il pezzo che abbiamo provato di più.");
          return ask("Il presentatore annuncia: «Banda Città di Borgo Marino». Le quinte di velluto si aprono.", [
            { label: "🐦 La Marcia della Rondine, intera", sub: secret() ? "Segreto · quota 70%" : `Serve la marcia intera (${K.stat("fogli")}/4) e la pace con Ciro e col Maestro`, big: true, cls: secret() ? "hot" : "", disabled: !secret(), fn: () => concerto("rondine") },
            { label: "🎭 Il Gran Concerto", sub: "Il pezzo provato di più · quota 68%", big: true, cls: secret() ? "" : "hot", fn: () => concerto("venezia") },
            { label: "🎒 Prima controlla lo zaino", sub: "Gli oggetti con «tempo» allargano un po' le finestre", fn: () => { say("voce", K.inv.bonus("te") ? "Qualcosa nello zaino ticchetta. Le note sembrano un po' più larghe." : "Nello zaino niente che ticchetti. Ma la banda è dietro di te."); done(); } },
            { label: "◂ Un momento", fn: done }
          ]);
        }
        say("bp_ferrante", s === 1 ? "La Serenissima prova all'aperto, nel campo. Ascolti pure. Non applauda." : s === 2 ? "Locanda. A letto alle nove. Io resto sveglio: qualcuno deve controllare che il canale non straripi." : s === 3 ? "Nel retropalco. Prima si scaldi le mani." : "Si suona. A tempo."); done();
        function next() { setStep(N, 3); quest("bp_c5c", "Il concorso", "Mattina: al teatro, nel retropalco."); K.clock && K.clock.set && K.clock.set(K.clock.day() + 1, 0); done(); }
      },
      bp_doge() {
        if (K.rel.scene("bp_doge")) return;
        const s = S();
        if (s === 1) {
          say("bp_doge", "[ride] Borgo Marino! La banda dello stadio! Quella che si ferma a metà marcia. Nel '72 vi hanno dato il premio perché la giuria pensava fosse avanguardia.");
          say("bp_doge", "Io sono Leandro Doge. Filarmonica Serenissima, campioni da sei anni. E il suo Maestro... Ferrante. Il metronomo. Compagni di banco. Lui contava, io suonavo.");
          say("bp_doge", "[serio] Gli chieda di Marco Sardi, stasera. Gli chieda perché ha lasciato il conservatorio. Non per cattiveria: perché domani, sul palco, è meglio che lei sappia chi ha davanti.");
          setStep(N, 2); quest("bp_c5b", "Marco Sardi", "Sera: alla locanda «Al Gondoliere», in basso a sinistra.");
          if (K.clock && K.clock.set) K.clock.set(K.clock.day(), 2);
          return wask("Il Doge sorride, ma gli occhi no.", [
            { label: "❤️ «Grazie. Lo chiederò. Con gentilezza.»", w: { cuore: 1 }, fn: () => { say("bp_doge", "[sorpreso] Gentilezza. A Ferrante. Ah. Allora forse domani perdo davvero."); done(); } },
            { label: "🎼 «Domani ci sentirà. Contati, uno per uno.»", w: { rigore: 1 }, fn: () => { say("bp_doge", "[ride] Contati! Ecco un allievo di Ferrante. Ci vediamo a teatro, grancassa."); done(); } }
          ]);
        }
        say("bp_doge", s <= 2 ? "Le prove della Serenissima sono aperte al pubblico. Non per generosità: per intimidazione." : s === 3 ? "[serio] In bocca al lupo. Davvero. Ferrante merita di vincere una volta, prima di morire. Non domani, però." : "[felice] Ci vediamo l'anno prossimo. Portate la marcia, quella intera."); done();
      },
      bp_ciro() {
        if (K.rel.scene("bp_ciro")) return;
        const s = S();
        say("bp_ciro", s <= 1 ? "[felice] Venezia! Nel '72 ho perso il cappello in Canal Grande. Lo cercano ancora." : s === 2 ? "[pensa] Sto lucidando la tromba. Terza volta. Come prima delle processioni. Come la sera che è uscita la barca di Tonino." : s === 3 ? (F.is("bp_assolo_ciro") ? "L'assolo è mio. Otto battute. Le ho contate tutta la notte, e poi ho smesso di contarle." : "L'assolo è di Lilli. Bene così. Io sto dietro: da dietro si sente meglio.") : "[felice] Se me lo dicevano tre anni fa, che suonavo a Venezia, li mandavo a pescare."); done();
      },
      bp_lilli() {
        if (K.rel.scene("bp_lilli")) return;
        const s = S();
        say("bp_lilli", s <= 1 ? "Venezia! Ci sono più ponti che note in una marcia. E ognuno ha un gradino storto, come la diciassette." : s === 2 ? "[pensa] Il conservatorio mi ha risposto. Non l'ho ancora aperta, la lettera. Dopo il concorso. Prima voglio sapere se sono brava qui." : s === 3 ? (F.is("bp_assolo_lilli") ? "[furbo] L'assolo. Otto battute scritte, più quattro che scrivo io lì per lì. Se la giuria sviene, è un successo." : "Faccio il controcanto a Ciro. Non è scritto. Il Maestro lo sa. Ha detto «mh». Il suo «mh» è un sì.") : "[felice] Ho aperto la lettera. Ti dico dopo. Prima abbracciami, che sto tremando."); done();
      },
      bp_rocco() {
        if (K.rel.scene("bp_rocco")) return;
        const s = S();
        say("bp_rocco", s <= 1 ? "Il ponte è laggiù. Stai attento ai gradini: io li conto, perché a Venezia i gradini sono come le battute, se ne salti uno finisci in acqua." : s === 2 ? "[ride] Il letto è corto. Ho i piedi fuori dalla finestra. Un gondoliere mi ha chiesto se ero una decorazione." : s === 3 ? "[serio] Campione. Comunque vada, grazie. Quarantadue anni di banda e non mi ero mai divertito così. Neanche alla rotonda." : "[felice] Non sono caduto nel canale! Sessanta per cento, il Maestro. Sessanta! E invece niente!"); done();
      },
      bp_abele() {
        if (K.rel.scene("bp_abele")) return;
        say("bp_abele", S() <= 2 ? "Ho acceso una candela a San Marco per il concorso. Due, in realtà: una per noi e una per la giuria, che ne ha bisogno." : "Figliolo, i piatti sono pronti. E anche io. Il Signore ci guarda. Spero dalla platea, che si sente meglio."); done();
      },
      bp_bracco() {
        if (K.rel.scene("bp_bracco")) return;
        say("bp_bracco", S() <= 2 ? "[serio] Ho il contratto con SuonoSmart in valigia. Non firmato. Non ancora. Dipende da domani. Io sono un uomo di parola, e soprattutto di numeri." : "Mille persone in sala. Se si alzano in piedi, è un numero. I numeri li rispetto."); done();
      },
      bp_gigi() {
        if (K.rel.scene("bp_gigi")) return;
        say("bp_gigi", F.is("bp_sabotaggio") ? "[triste] L'Assessore ha scoperto il cavo. Mi ha spostato alle sagre del cinghiale. Sono venuto a Venezia lo stesso, a mie spese. Volevo sentirvi dal vivo, senza cavi." : F.is("bp_leale") ? "[felice] Ho portato il registratore. Settanta decibel di gente vera, il derby, ricordi? Stasera ne registro mille." : "Sono qui per lavoro: SuonoSmart sponsorizza il concorso. Il palco ha le nostre casse. Le ho abbassate. Non dirlo a nessuno."); done();
      },
      bp_nana() {
        if (K.rel.scene("bp_nana")) return;
        say("bp_nana", S() <= 2 ? "Il vestito del '72 mi sta! Con due spille da balia. Ho portato il ragù sottovuoto: la cucina veneziana è buona, ma non ha l'anima." : "Prima fila! Ho le caramelle per la tosse, il fazzoletto e le mani pronte. Se la giuria non applaude, applaudo io per otto."); done();
      }
    };

    const zones = {
      bp_venezia: {
        region: "venezia", name: "Venezia", short: "Venezia", sub: "Calli, un canale, un ponte di pietra e il teatro del concorso", bg: "bp_venezia", time: "tramonto", w: 34, h: 24, base: "Z", start: [16, 21], travel: [16, 21],
        onEnter(K) { if (S() === 0 && K.clock && K.clock.slot && K.clock.slot() < 1) K.clock.set(K.clock.day(), 1); },
        items: [[2, 9], [31, 8], [9, 20], [29, 21]], itemCos: "bp_c5",
        areas: [[12, 1, 21, 7, "Il teatro del concorso"], [1, 7, 11, 10, "Il campo della Serenissima"], [14, 11, 19, 13, "Il ponte di pietra"], [2, 15, 8, 20, "Locanda «Al Gondoliere»"], [12, 20, 21, 22, "L'imbarcadero"], [0, 0, 33, 23, "Venezia"]],
        act: { O: "Siediti al tavolino", G: "Guarda la gondola", V: "Guarda il palo", F: "Guarda il pozzo", l: "Guarda il lampione", n: "Leggi il manifesto", u: "Guarda la bancarella", s: "Aspetta il vaporetto", w: "Guarda il canale", b: "Siediti", t: "Guarda l'albero" },
        flavor: { O: "Un tavolino da caffè con l'ombrellone. Uno spritz costa quanto una tromba usata.", G: "Una gondola nera ormeggiata. Il gondoliere canta un'aria d'opera, stonato in modo molto veneziano.", V: "Un palo da gondola a strisce. Ci si è appoggiato sopra un gabbiano con l'aria di chi giudica.", F: "La vera da pozzo del campo, in pietra d'Istria. Sopra, scolpito, un leone con un libro. Il libro è chiuso, come la giuria.", l: "Un lampione di ferro. La luce trema sull'acqua del canale.", n: "Il manifesto: «CONCORSO NAZIONALE DELLE BANDE · Teatro della Serenissima». Sotto, in piccolo: «Sponsor tecnico: SuonoSmart».", u: "Una bancarella di maschere. Una ha la faccia di un maestro arrabbiato: Rocco vuole comprarla per Ferrante.", s: "L'imbarcadero del vaporetto. Il cartello dice: «Prossima corsa: quando arriva».", w: "Il canale: acqua verde, gondole, riflessi di palazzi rosa.", b: "Una panchina di pietra, fredda anche d'estate.", t: "Un albero in un cortile, l'unico verde nel raggio di un ponte." },
        npcs: (s) => {
          const L = [{ id: "bp_ferrante", at: s === 0 ? [16, 20] : [14, 18] }, { id: "bp_rocco", at: [18, 20] }, { id: "bp_nana", at: [5, 9] }];
          if (s <= 1) L.push({ id: "bp_doge", at: [8, 8] });
          if (s <= 1) L.push({ id: "bp_abele", at: [20, 18] });
          if (s === 3) L.push({ id: "bp_gigi", at: [22, 9] });
          return L;
        },
        doors: {},
        intro: [["voce", "Venezia. Il vaporetto vi scarica all'imbarcadero con le custodie, le valigie e un bombardino che non entrava dalla porta."], ["voce", "Di là dal ponte, dietro un campo pieno di tavolini, il teatro del concorso. Sulla facciata, uno striscione: «Concorso nazionale delle bande»."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 23, 33, 23, "w"); lay(0, 0, 0, 22, "a"); lay(33, 0, 33, 22, "a");
          lay(0, 11, 33, 13, "w"); lay(15, 11, 18, 13, ":"); lay(0, 11, 0, 13, "a"); lay(33, 11, 33, 13, "a");
          house(12, 1, 10, 6, { door: [16, 6], roof: "#7f1d1d", wall: "#f1dcc0", chimney: false, enter: { to: "bp_teatro", at: [8, 9] } });
          house(1, 1, 5, 5, { door: [3, 5], roof: "#9a3412", wall: "#c2693b", enter: "Una bottega di maschere. Dietro il banco, una signora dipinge un naso lungo a una maschera e un sorriso lungo a te." });
          house(7, 1, 4, 4, { door: [9, 4], roof: "#7c2d12", wall: "#e8b98a", enter: "Un bacaro: cicchetti, ombre di vino e un vecchio che canta. «La banda di Borgo Marino? Nel '72 eravate qui. Uno è caduto nel canale. Suonava ancora.»" });
          house(23, 1, 5, 5, { door: [25, 5], roof: "#57534e", wall: "#d9a77a", enter: "Il palazzo della Filarmonica Serenissima. Il portiere ti guarda la divisa e dice: «Le bande di provincia dall'ingresso di servizio»." });
          house(29, 1, 4, 5, { door: [31, 5], roof: "#1e3a8a", wall: "#e5e7eb", enter: "Una chiesa piccola, dorata. Don Abele ci ha già acceso due candele." });
          house(2, 15, 6, 5, { door: [4, 19], roof: "#9a3412", wall: "#f0d9b5", enter: { to: "bp_locanda", at: [6, 7] } });
          house(24, 15, 7, 4, { door: [27, 18], roof: "#7f1d1d", wall: "#c98a5c", enter: "L'Hotel della Filarmonica. Nella hall, i musicisti della Serenissima provano in calzini. Uno ti fa l'occhiolino: «Siete quelli della marcia a metà?»" });
          // il campo: tavolini, pozzo, lampioni
          [[3, 8], [5, 7], [7, 9], [2, 10]].forEach(([x, y]) => put(x, y, "O")); put(10, 8, "F"); [[1, 7], [11, 7], [14, 9], [19, 9], [23, 8], [30, 9]].forEach(([x, y]) => put(x, y, "l")); put(13, 8, "n");
          // canale: gondole e pali
          [[4, 11], [5, 11], [25, 13], [26, 13]].forEach(([x, y]) => put(x, y, "G")); [[8, 11], [21, 13], [30, 11], [11, 13]].forEach(([x, y]) => put(x, y, "V"));
          // riva sud e imbarcadero
          [[10, 16], [11, 16]].forEach(([x, y]) => put(x, y, "u")); put(13, 22, "s"); put(20, 22, "s"); put(21, 16, "b"); put(22, 16, "b"); put(32, 21, "t"); put(1, 21, "t");
          [[9, 14], [20, 14], [32, 15]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow();
          // striscione del concorso sul teatro, riflessi sull'acqua
          g.save(); const X = d.X(13), Y = d.Y(1) + 6; g.fillStyle = "#facc15"; g.fillRect(X, Y, 128, 7); g.fillStyle = "#7f1d1d"; g.font = "700 6px 'Trebuchet MS', sans-serif"; g.textAlign = "center"; g.fillText("CONCORSO NAZIONALE DELLE BANDE", X + 64, Y + 5.5);
          for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(255,220,170,${0.12 + 0.1 * Math.sin(f / 12 + i)})`; g.fillRect(d.X(1 + i * 2) + ((f / 4 + i * 7) % 12), d.Y(11) + 6 + (i % 3) * 14, 6, 1); }
          g.restore();
          H.plaque(g, "TEATRO DELLA SERENISSIMA", d.X(16) + 8, d.Y(1) - 4, "#fde68a"); H.plaque(g, "LOCANDA AL GONDOLIERE", d.X(4) + 8, d.Y(15) - 4, "#fca5a5"); H.plaque(g, "IMBARCADERO", d.X(16) + 8, d.Y(22) + 2, "#93c5fd");
        }
      },
      bp_locanda: {
        interior: true, region: "casa", name: "Locanda «Al Gondoliere»", short: "Locanda", sub: "Letti corti, una finestra sul canale e un maestro che non dorme", bg: "bp_locanda", w: 12, h: 9, start: [6, 7], outside: ["bp_venezia", 4, 20], base: "=",
        items: [[10, 2]], itemCos: "bp_c5",
        act: { B: "Guarda il letto", W: "Guarda dalla finestra", T: "Guarda il tavolo", D: "Guarda il comò", C: "Guarda la custodia", L: "Guarda la mensola" },
        flavor: { B: "Un letto troppo corto per Rocco e troppo morbido per il Maestro.", W: "Venezia di notte: le luci sull'acqua sembrano note su un pentagramma.", T: "Sul tavolo, il programma di undici pagine. Qualcuno ha disegnato a matita un gabbiano a pagina sette.", D: "Il comò. Sopra, un posto vuoto, spolverato con cura, dove andrebbe una coppa.", C: "La custodia della tromba di Ciro. Chiusa, ma con le cerniere oliate.", L: "Una mensola con una gondola di vetro e un'etichetta: «Ricordo di Venezia, fatto a Murano (forse)»." },
        npcs: (s) => s === 2 ? [{ id: "bp_ferrante", at: [6, 2] }, { id: "bp_ciro", at: [2, 5] }, { id: "bp_lilli", at: [9, 5] }] : s >= 3 ? [] : [{ id: "bp_ciro", at: [2, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 11, 8, "="); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 8, "a"); lay(11, 0, 11, 8, "a"); lay(0, 8, 11, 8, "a"); put(6, 8, "v");
          put(5, 0, "W"); put(6, 0, "W"); put(7, 0, "W"); put(1, 2, "B"); put(1, 3, "B"); put(10, 6, "B"); put(10, 7, "B"); put(4, 4, "T"); put(9, 1, "D"); put(2, 7, "C"); put(3, 0, "L");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); g.fillStyle = `rgba(147,197,253,${0.08 + 0.04 * Math.sin(f / 25)})`; g.fillRect(d.X(5), d.Y(1), 48, 40); g.restore(); H.plaque(g, "AL GONDOLIERE", d.X(6), d.Y(0) + 6, "#fca5a5"); }
      },
      bp_teatro: {
        interior: true, region: "teatro", name: "Il retropalco del teatro", short: "Retropalco", sub: "Quinte di velluto, casse degli strumenti e mille persone di là", bg: "bp_teatro", w: 16, h: 11, start: [8, 9], outside: ["bp_venezia", 16, 7], base: "Y",
        act: { M: "Guarda il leggio", E: "Guarda i tamburi", z: "Guarda le casse", A: "Guarda la cassa spia", T: "Guarda il tavolo", D: "Guarda lo specchio", C: "Guarda la custodia", n: "Leggi la scaletta" },
        flavor: { M: "I leggii della banda di Borgo Marino, numerati col pennarello. Il numero sette dice «Ciro».", E: "La grancassa con la rondine, appoggiata al muro come un pugile prima del match.", z: "Casse di legno: «FRAGILE · BANDA · NON CAPOVOLGERE (il bombardino si offende)».", A: "Una cassa spia SuonoSmart. Il led è spento. Qualcuno ci ha attaccato un post-it: «stasera no».", T: "Un tavolo con bottigliette d'acqua e un vassoio di caramelle per la tosse. Nanà le ha già contate.", D: "Uno specchio con le lampadine intorno. Ti guardi: divisa rossa, bacchette in mano, ginocchio fasciato. Sembri un campione. Di un'altra cosa.", C: "La custodia della tromba di Ciro, aperta. L'ottone è lucido come la prima volta.", n: "La scaletta: «1. Filarmonica Serenissima · 2. Banda di Borgo Marino · 3. ...». La tua riga ha un'impronta di ragù." },
        npcs: (s) => s === 3 ? [{ id: "bp_ferrante", at: [8, 4] }, { id: "bp_ciro", at: [4, 6] }, { id: "bp_lilli", at: [11, 6] }, { id: "bp_doge", at: [13, 2] }, { id: "bp_bracco", at: [2, 8] }, { id: "bp_abele", at: [12, 8] }] : [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          [[5, 3], [7, 3], [9, 3], [11, 3]].forEach(([x, y]) => put(x, y, "M")); put(2, 2, "E"); put(3, 2, "E"); lay(13, 7, 14, 7, "z"); put(1, 5, "A"); put(6, 7, "T"); put(14, 4, "D"); put(4, 8, "C"); put(10, 1, "n");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow();
          // le quinte e il cono di luce che filtra dal palco
          g.save(); g.fillStyle = "#7f1d1d"; for (let i = 0; i < 3; i++) { g.fillRect(d.X(1) + i * 6, d.Y(0) + 4, 4, 60); g.fillRect(d.X(14) - i * 6, d.Y(0) + 4, 4, 60); }
          g.fillStyle = `rgba(254,240,138,${0.1 + 0.04 * Math.sin(f / 10)})`; g.beginPath(); g.moveTo(d.X(7), d.Y(0)); g.lineTo(d.X(9), d.Y(0)); g.lineTo(d.X(11), d.Y(6)); g.lineTo(d.X(5), d.Y(6)); g.fill(); g.restore();
          H.plaque(g, "PALCO ▲", d.X(8), d.Y(0) + 6, "#fde68a");
        }
      }
    };
    return {
      n: N, title: "Venezia", sub: "Un concorso, una giuria che non sorride e una marcia da finire",
      goal, start: "bp_venezia", introBg: "bp_venezia", zones, talk, obj: {},
      intro: [["voce", "Sei ore di autobus. Il Maestro ha letto il programma ad alta voce due volte, Rocco ha dormito sul bombardino e Nanà ha distribuito panini a tutta l'autostrada."], ["voce", "Venezia. Domani il concorso nazionale. Stasera, una locanda, un canale e qualcuno che ha una storia da raccontare."]]
    };
  }
  boot();
})();
