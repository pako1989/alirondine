// js/conte-c1.js - «IL CONTE DI MONTECALCIO» · Capitolo 1: Il Conte arriva
// Il Campione torna a Montecalcio con la faccia del Conte Aurelio. Piazza, Bar Sport, Palazzo Vanni: il Sindaco, il Moro, la Contessa, la dottoressa Serra, Nina. In fondo, il camerino
// dei costumi: da lì in poi le facce sono tre.
(function () {
  "use strict";
  function boot() {
    const E = window.__conteCore;
    if (!E || !E.api || !E.api.addChapter || !window.__conteH || !window.__conteZ || !(window.__lbBg && window.__lbBg.register)) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__conteH(K), Z = window.__conteZ, { say, done, ask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("ct_c1", { kind: "shirt", label: "Divisa del Montecalcio, 1907", val: "#7f1d1d", from: "Capitolo 1 di Il Conte di Montecalcio" });
    K.lore("l_busta", { t: "La busta gialla", d: "Quindici anni fa, nell'armadietto numero 9 dello spogliatoio, trovarono una busta gialla piena di soldi. Il numero 9 era il tuo. Nessuno ti chiese niente: ti avevano già giudicato." });
    K.lore("l_ferrante", { t: "Mister Ferrante", d: "Allenò il Montecalcio per ventidue anni. Morì tre settimane dopo la busta, di crepacuore, dicono. Lo stadio porta il suo nome da sette anni, scritto storto: non c'era spazio per la «e»." });
    K.lore("l_montecalcio", { t: "Montecalcio", d: "Borgo di colline, di cinquemila anime e di una squadra che da cent'anni fallisce con dignità. Nel Palazzo si mangia bene, in piazza si parla piano, allo stadio si perde con onore." });
    K.evidence("ct_registro", { t: "Il Libro delle Offerte", d: "Il registro dei contributi al Montecalcio, tenuto dalla Contessa. L'ultimo versamento di quell'anno è «Fondo speciale», firmato solo con le iniziali «A. B.»: tre giorni prima della busta.", icon: "📖", short: "Versamento «A. B.», tre giorni prima" });

    const goal = (s) => ({
      0: "In piazza, parla con il Sindaco Brandolini: ti aspetta davanti al Municipio.",
      1: "Entra al Bar Sport (la porta della casa a sinistra della chiesa) e parla con Gino il Moro.",
      2: "Palazzo Vanni (in basso a sinistra, sulla piazza): la Contessa ti attende nel salotto.",
      3: "Nel salotto, parla con la dottoressa Ottavia Serra.",
      4: "Torna in piazza: Nina Ferrante, l'allenatrice dei ragazzi, vuole parlarti.",
      5: "Ettore, il maggiordomo, ti aspetta in piazza vicino a Palazzo Vanni.",
      6: "Nel camerino del teatrino (salotto, porta a destra): apri il baule dei costumi.",
      7: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      setStep(N, 7); F.set("ct_c1_done", true); F.set("ct_open2", true);
      K.reward("ct_c1", { coins: 90, cos: "ct_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["ct_ettore", "Certamente. La contessa dice che, con una faccia sola, sarebbe stato un peccato non usarne altre due."],
        ["hero", "[serio] Tre facce. Una per ogni porta che a Montecalcio si apre in modo diverso: i salotti, la strada, il campo."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>🎩 Salotti ${K.stat("salotti")} · 🧢 Strada ${K.stat("strada")} · 🔑 Campo ${K.stat("campo")} · 👁️ Sospetto ${K.stat("sospetto")} · Prove ${H.clues()}/5`],
        ["voce", "Il Capitolo 2 ti aspetta al Mercato del Basso, dove una faccia nuova apre le porte della strada."]
      ]), () => K.openMain(), "ct_titolo");
    }

    const talk = {
      ct_brandolini() {
        if (K.rel.scene("ct_brandolini")) return;
        const s = S(), m = K.mask.cur();
        if (s === 0) {
          say("ct_brandolini", "Conte Aurelio! Benvenuto a Montecalcio. Alvise Brandolini, sindaco, presidente onorario, e, nelle ore libere, il suo più sincero ammiratore.");
          say("ct_brandolini", "[felice] Ho letto che cerca un investimento in provincia. Montecalcio è una provincia con tutti i vantaggi di una provincia: poco traffico, pochi concorrenti, e una squadra che ha bisogno di un salvatore.");
          say("hero", "[serio] (Quindici anni, e la voce non è cambiata. Ha ancora quel modo di dire «comunità» come se avesse un prezzo.)");
          say("ct_brandolini", "Prima di parlare d'affari, un caffè al Bar Sport dal Moro: il miglior caffè del borgo, e l'unico. Poi Palazzo Vanni: la Contessa è curiosa.");
          K.learnLore("l_montecalcio"); setStep(N, 1);
          quest("ct_c1", "Il Conte arriva", "Prendi un caffè al Bar Sport, poi Palazzo Vanni.");
          return ask("Come rispondi al Sindaco?", [
            { label: "🎩 «Il piacere è mio. Ho sentito parlare molto bene di lei.»", fn: () => { K.bond("salotti", 1); say("ct_brandolini", "[felice] Le voci a Montecalcio sono tutte vere, quando le diffondo io."); H.done(); } },
            { label: "«E della squadra, cosa ne ha sentito?»", fn: () => { say("ct_brandolini", "[pensa] Che ha una storia nobile, un presente difficile e un futuro, grazie a lei, molto interessante."); H.done(); } },
            { label: "«Preferisco prima guardarmi intorno.»", fn: () => { say("ct_brandolini", "Prudente. Mi piacciono gli investitori prudenti: sono quelli che restano."); H.done(); } }
          ]);
        }
        if (s < 7) { say("ct_brandolini", s < 3 ? "Il Bar Sport e Palazzo Vanni. In quest'ordine, mi raccomando: la contessa si offende se si arriva dopo il caffè di Gino." : "Montecalcio ha una squadra e un sindaco. Non ho mai capito chi dei due sia più difficile da governare."); return H.done(); }
        say("ct_brandolini", "Conte! Come va con le facce nuove? Intendo dire: con i volti nuovi, in paese."); H.done();
      },
      ct_gino() {
        if (K.rel.scene("ct_gino")) return;
        const s = S();
        if (s === 1) {
          say("ct_gino", "Il Conte. Lo ha mandato il Sindaco. Il Sindaco manda sempre qualcuno, di solito con in tasca la parola «sviluppo».");
          say("ct_gino", "Caffè? Lo faccio col polso. Lei lo beve con la mano, spero.");
          say("hero", "[pensa] (Gino. Il capitano, quel pomeriggio. Ha i capelli più corti e la stessa abitudine di guardare la porta.)");
          say("ct_gino", "Se vuole sapere della squadra: ha un allenatore che non c'è più, un presidente che c'è troppo, e una Curva che ha capito prima di tutti che la partita non si gioca in campo.");
          say("ct_gino", "[serio] Quindici anni fa c'era un ragazzo, un nove. Una busta nel suo armadietto. Dicono che l'abbiano trovata in un minuto. A me ne sono servite tre ore per capire.");
          say("ct_gino", "[pensa] Che cosa, non lo dico. Ma stia attento: a Montecalcio le cose che sembrano finite, si riaprono quando le dimentichi.");
          F.set("ct_gino_busta", true); K.learnLore("l_busta"); K.learnLore("l_ferrante"); K.rel.add("ct_gino", 1); setStep(N, 2);
          quest("ct_c1b", "Palazzo Vanni", "La Contessa ti attende nel salotto.");
          return ask("Come rispondi?", [
            { label: "🎩 «Mi dica solo se il caffè lo offre la casa.»", fn: () => { K.bond("salotti", 1); say("ct_gino", "[ride] Il caffè è sempre offerto dalla casa. Il resto, se vuole sapere, lo paga lei."); H.done(); } },
            { label: "«Quella busta, di chi era?»", fn: () => { say("ct_gino", "[serio] Se lo sapessi, non avrei il bar. Avrei un avvocato."); say("hero", "[pensa] (Non mente. Ma non dice tutto: si vede dalle mani.)"); H.done(); } },
            { label: "«Lei parla poco, Gino.»", fn: () => { say("ct_gino", "[sorpreso] Mi chiamo Gino? Non ricordo di averglielo detto."); say("hero", "[serio] (Errore. Un piccolo errore, che nessuno nota. Quasi nessuno.)"); K.bond("sospetto", 1); H.done(); } }
          ]);
        }
        if (s >= 2) { say("ct_gino", s === 2 ? "Palazzo Vanni, prima del tramonto. La contessa non aspetta: i suoi tè si raffreddano da soli." : "Se un giorno vuole davvero capire Montecalcio, non venga da Conte. Venga da dove c'è il fango."); return H.done(); }
        say("ct_gino", "Un caffè? Lo faccio col polso."); H.done();
      },
      ct_tullio() {
        if (K.rel.scene("ct_tullio")) return;
        K.mask.meet("ct_tullio", false);
        say("ct_tullio", "[serio] Un Conte. In un bar dove l'ultimo titolo è stato quello di «tifoso dell'anno» del 1988. Lei sa dove sta entrando?");
        say("ct_tullio", "Tullio, detto Pilastro. Panettiere e capo della Curva. Sorrido poco, ma l'ho fatto una volta nel '94. Fu un errore.");
        say("ct_tullio", "[pensa] Se vuole salvarci, ci salvi. Ma non ci chieda di ringraziarla: è maleducazione ringraziare chi non ti ha ancora fatto un favore.");
        H.done();
      },
      ct_ersilia() {
        if (K.rel.scene("ct_ersilia")) return;
        const s = S();
        if (s === 2) {
          say("ct_ersilia", "Il Conte Aurelio! Si sieda: Ettore le porterà qualcosa. Tre tazze sono ancora tiepide, e non per caso.");
          say("ct_ersilia", "Ho ottant'anni, Conte. Ho visto cadere un re, una repubblica e tre allenatori. Montecalcio, con la sua squadra, ha resistito a tutti e a tutto.");
          say("ct_ersilia", "[furbo] Ne è nipote, questa squadra: è mia, ma non mi somiglia. Mi dica: che cosa vuole davvero, da noi?");
          say("hero", "[serio] (Vuole una risposta. Non una vera: una che le piaccia.)");
          return ask("Che cosa dici alla Contessa?", [
            { label: "🎩 «Voglio vedere i conti. Un investitore serio comincia dai libri.»", fn: () => { K.bond("salotti", 1); K.giveClue("ct_registro"); say("ct_ersilia", "[felice] Un investitore che legge! Ettore, il Libro delle Offerte. Il Conte ha ragione: una squadra si capisce da chi le dà i soldi, non da chi li spende."); say("voce", "Sfogli il Libro delle Offerte. I contributi della Contessa, quelli del Sindaco, della Cassa Rurale. E, tre giorni prima della busta, un «Fondo speciale» firmato solo «A. B.».<br><b>Nuova prova: Il Libro delle Offerte.</b>"); setStep(N, 3); quest("ct_c1c", "La dottoressa Serra", "Nel salotto, parla con la dottoressa Ottavia Serra."); H.done(); } },
            { label: "«Voglio solo il bene del Montecalcio.»", fn: () => { say("ct_ersilia", "[pensa] Frase da primo turno. Ma siamo qui per il secondo: Ettore, i libri. Mi faccia vedere se sa leggere."); K.giveClue("ct_registro"); say("voce", "Ettore ti porge il Libro delle Offerte. Un «Fondo speciale» di quindici anni fa, firmato «A. B.», cattura il tuo sguardo.<br><b>Nuova prova: Il Libro delle Offerte.</b>"); setStep(N, 3); quest("ct_c1c", "La dottoressa Serra", "Nel salotto, parla con la dottoressa Ottavia Serra."); H.done(); } }
          ]);
        }
        if (s < 2) { say("ct_ersilia", "Non è ancora l'ora del tè, Conte. A Montecalcio ogni cosa ha la sua ora: anche l'ipocrisia."); return H.done(); }
        say("ct_ersilia", "I cani le hanno già dato un voto. Non lo dica: sono ingiusti, ma raramente sbagliano."); H.done();
      },
      ct_ottavia() {
        if (K.rel.scene("ct_ottavia")) return;
        const s = S(), r = H.notice("ct_ottavia", true, [["ct_ottavia", "[pensa] Strano. Lei mi ricorda… no, scusi. Quando si fa il medico da vent'anni si impara a vedere tutti con la stessa faccia."]]);
        if (r) return;
        if (s === 3) {
          say("ct_ottavia", "Dottoressa Ottavia Serra, medico sociale. Respiri, Conte: ha l'aria di chi trattiene un'opinione.");
          say("ct_ottavia", "[serio] Quindici anni fa ho firmato un referto. Il mister aveva il cuore stanco. Non l'ho detto a nessuno perché nessuno l'ha chiesto. Ora, a una faccia nuova, mi viene voglia di dirlo.");
          say("ct_ottavia", "[pensa] Ferrante non è morto di dispiacere: è morto di pressione. E la pressione, a Montecalcio, ha sempre un nome e un cognome.");
          say("ct_ottavia", "Se vuole capire la squadra, parli con sua figlia, Nina: allena i ragazzi. Poi, se vuole, ne parliamo ancora. Non qui: qui le pareti sono troppo foderate.");
          K.bond("campo", 1); K.rel.add("ct_ottavia", 1); setStep(N, 4); quest("ct_c1d", "Nina Ferrante", "Torna in piazza: l'allenatrice dei ragazzi vuole parlarti.");
          return H.done();
        }
        say("ct_ottavia", s < 3 ? "Si accomodi, Conte. La Contessa tra poco la invita alla seconda tazza: è un grande onore e un grande rischio." : "Respiri. Ha l'aria di uno che ha già deciso cosa fare e non ha ancora deciso se dirlo."); H.done();
      },
      ct_nina() {
        if (K.rel.scene("ct_nina")) return;
        K.mask.meet("ct_nina", false);
        const s = S();
        if (s === 4) {
          say("ct_nina", "Il Conte. Mi hanno detto che compra la squadra. Gli investitori di solito passano da me solo per dirmi che sono «ottimisti».");
          say("ct_nina", "[serio] Io sono Nina Ferrante. Allenavo i ragazzi con un pallone sgonfio, prima di avere uno stadio che non è mio. Mio padre faceva lo stesso: con un fischietto e una radio.");
          say("ct_nina", "[pensa] Le dico una cosa e se la dimentica: gli investitori mi preoccupano meno dei silenzi. Il paese ne ha uno, di quindici anni fa. Qualcuno lo conosce. Nessuno lo dice.");
          say("hero", "[serio] (Il padre. La figlia. Hai la voce, il modo di tenere le braccia incrociate. Se potessi dirglielo, lo diresti. Per ora, no.)");
          return ask("Che cosa rispondi a Nina?", [
            { label: "🔑 «Vorrei vedere i ragazzi, un giorno. Senza sigari e senza microfoni.»", fn: () => { K.bond("campo", 1); K.rel.add("ct_nina", 1); say("ct_nina", "[sorpreso] Senza microfoni. Che strano Conte: non chiede una foto."); F.set("ct_nina_ok", true); fin5(); } },
            { label: "«Il silenzio di cui parla… è antico?»", fn: () => { say("ct_nina", "[serio] Quindici anni. Se lo conosce, non ha l'aspetto di uno che lo sia venuto a cercare per caso."); K.bond("sospetto", 1); fin5(); } },
            { label: "«Ho scelto Montecalcio perché non ho niente da perdere.»", fn: () => { say("ct_nina", "[pensa] Strano, di solito chi non ha niente da perdere è quello che chiede più garanzie."); fin5(); } }
          ]);
        }
        say("ct_nina", s < 4 ? "Ho un allenamento. Torni quando avrà visto la piazza e il Palazzo: è più facile giudicare un borgo da fuori che da dentro." : "Mio padre diceva: «Non si conta mai il denaro davanti a un ragazzo». Un Conte lo conterebbe?"); H.done();
      },
      ct_ettore() {
        if (K.rel.scene("ct_ettore")) return;
        const s = S();
        if (s === 5) {
          say("ct_ettore", "Conte. Certamente. La contessa chiede se vuole vedere il camerino del teatrino di famiglia: sala di tre generazioni di maschere, molto istruttiva per chi ama le facce.");
          say("ct_ettore", "[furbo] Dice che un investitore con una faccia sola è un investitore a metà. Io non ho capito cosa intendesse. Questa è la mia risposta più sincera.");
          say("hero", "[serio] (Il maggiordomo che «non ha visto niente». Forse ha visto tutto. Forse la Contessa sa più di quanto dica. Vediamo.)");
          setStep(N, 6); quest("ct_c1e", "Il camerino", "Nel salotto di Palazzo Vanni, porta a destra: apri il baule.");
          return H.done();
        }
        say("ct_ettore", s < 5 ? "Certamente. La Contessa mi ha chiesto di non disturbare i suoi ospiti. Io sono uno di quegli ospiti per cui non c'è un tè." : "Il camerino è nel salotto, a destra. Il baule non è chiuso a chiave. Chiude chi lo apre."); H.done();
      },
      ct_beppe() {
        const r = K.mask.meet("ct_beppe", false);
        say("ct_beppe", "Lei è il Conte? Ho visto che ha le scarpe lucide. Qui sporchiamo tutto: le scarpe, il pallone e le scuse.");
        say("ct_beppe", "[felice] Gioco col nove. È il numero più sfortunato, dicono. Io penso sia solo il più difficile da riempire.");
        say("hero", "[pensa] (Il nove. Lo guardi tirare di sinistro contro il muro della chiesa e senti qualcosa che non è nostalgia: è un debito.)");
        H.done();
      }
    };
    function fin5() { setStep(N, 5); quest("ct_c1f", "Il maggiordomo", "Ettore ti aspetta in piazza, vicino a Palazzo Vanni."); H.done(); }

    const zones = {
      ct_piazza: Z.piazza({
        itemCos: "ct_c1",
        npcs: (s) => [{ id: "ct_brandolini", at: [22, 9] }, { id: "ct_beppe", at: [14, 14], route: [[14, 14], [17, 15], [17, 17], [14, 17]], speed: 0.45, pause: 30 }]
          .concat(s >= 4 && s <= 5 ? [{ id: "ct_nina", at: [13, 16] }] : []).concat(s >= 5 && s <= 6 ? [{ id: "ct_ettore", at: [8, 12] }] : []),
        intro: [["voce", "Montecalcio. Il campanile suona le undici, con i suoi sette minuti di ritardo. Qui nessuno ha mai avuto fretta di arrivare in orario: solo di arrivare per primo a dare la colpa."], ["hero", "[serio] Quindici anni. Hanno rifatto la fontana. Non hanno rifatto il resto."]]
      }),
      ct_bar: Z.bar({ npcs: () => [{ id: "ct_gino", at: [6, 2] }, { id: "ct_tullio", at: [11, 5] }] }),
      ct_palazzo: Z.palazzo({ npcs: (s) => [{ id: "ct_ersilia", at: [8, 4] }, { id: "ct_ottavia", at: [12, 6] }, { id: "ct_ettore", at: [6, 8] }].filter((n) => n.id !== "ct_ettore" || s < 5) }),
      ct_camerino: Z.camerino()
    };
    // il baule: sblocca le maschere, spiega il sistema, chiude il capitolo
    const bauleOpen = () => {
      if (S() !== 6) { if (K.F.is("ct_has_mercante")) return K.say([["voce", "Il baule dei costumi: dentro, le tre facce che hai già. Una per ogni porta."]], K.done); return K.say([["voce", "Il baule dei costumi del teatrino. Non è ancora il momento: ci sono altre cose da fare, prima."]], K.done); }
      K.mask.unlock("mercante"); K.mask.unlock("custode"); K.inv && K.inv.give("ct_baffi");
      K.say([
        ["voce", "Nel baule: tre tessere di cartoncino, ognuna con un nome. <b>Il Conte Aurelio</b>, <b>Berto il Mercante</b>, <b>Il Custode</b>. E un paio di baffi di scena, nella carta velina."],
        ["hero", "[pensa] Il Conte apre i salotti. Il Mercante parla con la strada. Il Custode entra dove nessuno guarda."],
        ["voce", "<b>Le Maschere.</b> Dal menu ◂ Cambia maschera: costa una fascia dell'orologio. Ognuno ricorda con quale faccia ti ha conosciuto: se lo reincontri con un'altra, può accorgersene e il Sospetto sale. I <b>Baffi di scena</b> ti salvano una volta."],
        ["hero", "[serio] Tre facce, un nome solo che non dirò: Montecalcio non ha più un Campione. Ha tre sconosciuti."]
      ], fin);
    };
    return {
      n: N, title: "Il Conte arriva", sub: "Piazza, bar, salotto e un baule di facce",
      goal, start: "ct_piazza", introBg: "ct_titolo", zones, talk, obj: { "ct_camerino:x": bauleOpen },
      intro: [["voce", "Quindici anni fa eri il nove del Montecalcio, la promessa di un borgo che non aveva altro. Poi una busta gialla nel tuo armadietto, una squalifica a vita, e un allenatore morto tre settimane dopo."], ["voce", "Oggi torni con una faccia che non è la tua: il Conte Aurelio, investitore. Nessuno ti riconosce. Questo, a Montecalcio, vale più dei soldi."]]
    };
  }
  boot();
})();
