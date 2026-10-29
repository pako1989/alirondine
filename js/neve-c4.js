// js/neve-c4.js - «IL GUARDIANO DI NEVE» · Capitolo 4: La Regina del Gelo
// La morena delle sei sciarpe e la grotta di Fiocco (il pallone della finale del '79). La slitta di Fiocco fino alla vetta.
// In cima, accanto alla croce, Ilde Rovere: la Regina del Gelo. Vuole una cosa sola, da quarantacinque anni: tirare un rigore a Olmo.
// Capo finale: la Regina (rigori a tre altezze, tempesta). Quattro finali: verità, leggenda, vetta, neve (segreto: tutte le stelle alpine).
(function () {
  "use strict";
  function boot() {
    const E = window.__neveCore;
    if (!E || !E.api || !E.api.addChapter || !window.__neveH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__neveH(K), { say, done, ask, wask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("gn_c4", { kind: "shirt", label: "Maglia bianca della Regina", val: "#e0f2fe", from: "Finale del Guardiano di Neve" });
    K.lore("l_pallone79", { t: "Il pallone della finale", d: "Il pallone dell'ultimo rigore del 1979. Aurelio lo respinse in tuffo, e finì nel bosco. Fiocco lo raccolse: è stato il primo pallone della sua collezione. Non l'ha mai restituito, perché nessuno è mai venuto a chiederlo." });
    K.lore("l_ilde", { t: "Ilde Rovere, la Regina del Gelo", d: "La sorella di Aurelio. Dopo il 1979 è salita alla capanna di vetta e non è più scesa, se non per comprare il pane e spedire lettere che riportava indietro. In paese la chiamano la Regina del Gelo; lei si chiama da sola «la portinaia della montagna»." });
    K.lore("l_rigore", { t: "Il rigore di Ilde", d: "Da quarantacinque anni Ilde si allena a tirare rigori contro una porta di ghiaccio. Non vuole vendetta. Vuole che Olmo, almeno una volta, stia in porta davanti a lei e scelga da che parte buttarsi." });

    const goal = (s) => ({
      0: "La morena delle sei sciarpe. Fiocco ti aspetta accanto alla sua slitta: parlagli. (🌡️ La grotta di Fiocco, a ovest, è riparata.)",
      1: "▶ LIVELLO A SCORRIMENTO: il cancello della morena (a nord, scritta VETTA ▲). Fiocco ti porta su in slitta: la slitta va da sola.",
      2: "La vetta. Accanto alla croce ti aspetta qualcuno con una corona di ghiaccio. Parlale.",
      3: "Capo finale: la Regina ti aspetta alla croce di vetta. Para i suoi rigori: basso, a mezza altezza, alto.",
      4: "La saga è conclusa. Grazie, guardiano."
    }[s] || "La saga è conclusa.");

    const olmoUp = () => F.is("gn_olmo_invito");
    const ENDS = {
      verita: { coins: 300, bg: "gn_campo", lines: [
        ["voce", "Domenica, ore 14. Il campo della Partita, spalato a mano. La tv regionale, il sindaco, il parroco, mezzo Valdigelo e Tecla con il thermos del brulè."],
        ["gn_olmo", "[serio] Prima della partita devo dire una cosa. La parata del '79 non l'ho fatta io. Io ero nello spogliatoio, col ginocchio rotto. In porta c'era Aurelio Rovere, col mio numero sopra il suo. Ha parato lui. Ha vinto lui. Io ho solo tenuto la Coppa in mano quando è entrato il fotografo."],
        ["voce", "Silenzio. Il thermos di Tecla cade nella neve e nessuno lo raccoglie. Il giornalista della tv abbassa la telecamera, poi la rialza, poi non sa cosa fare."],
        ["gn_lilli", "[felice] ...Io lo sapevo che la cassetta diceva la verità! Il nonno si butta dalla parte giusta solo quando non è lui!"],
        ["voce", "Lilli applaude per prima. Poi Don Fulvio. Poi tutti. In prima fila, per la prima volta in quarantacinque anni scesa in paese, Ilde Rovere non applaude: tiene le mani in tasca e piange, piano, come si piange quando una cosa finisce bene."],
        ["gn_fulvio", "[commosso] Suono le campane. Non è domenica di festa, lo so. Ma il Signore capirà: è il primo rigore che parano in questa parrocchia dal 1979."],
        ["voce", "La Coppa delle Vette torna in vetrina al Bar Stambecco. Sulla targhetta, sotto «OLMO BRINA», c'è un nome nuovo inciso a mano: «AURELIO ROVERE · 12 · HA PARATO LUI»."]
      ] },
      leggenda: { coins: 260, bg: "gn_bar", lines: [
        ["voce", "La Coppa torna in vetrina al Bar Stambecco, lucidata. Tecla offre il brulè a tutto il paese. La tv regionale riprende Olmo che la solleva: «Il Guardiano di Valdigelo, quarantacinque anni dopo»."],
        ["gn_olmo", "[pensa] Grazie. ...No, dico davvero. A volte una storia serve più a chi la ascolta che a chi l'ha vissuta. Il paese ha bisogno di un eroe vivo. Io ho bisogno di non deluderlo, ancora un po'."],
        ["gn_tecla", "[felice] Alla Coppa! E al Guardiano! E alla mia assicurazione, che non dovrà pagare niente!"],
        ["voce", "Quella notte, nella stazione ferma della funivia, una lettera nuova sul tavolo della biglietteria. Questa volta, timbrata e spedita davvero."],
        ["gn_ilde", "[serio] <em>(lettera)</em> Olmo. Va bene così. Le leggende servono a chi resta giù. Io resto su. Lui, ormai, sta con me. Buon inverno. I."]
      ] },
      vetta: { coins: 280, bg: "gn_cima", lines: [
        ["voce", "La Coppa delle Vette resta sul cippo, sotto la croce, accanto alla sciarpa piccola con la A. Il vento la lucida meglio di Tecla."],
        ["gn_ilde", "[commosso] Resta qui? ...Resta qui. Allora resto anche io. Ma la capanna ha due tazze, da stasera. Una la tengo per chi sale."],
        ["voce", "A Valdigelo il fabbro ne fa una nuova, di latta, con due manici storti. Sulla targhetta c'è scritto «LA COPPA DI AURELIO». La Partita della Neve si gioca per quella, da allora."],
        ["voce", olmoUp() ? "E ogni 13 dicembre la funivia riparte, per una corsa sola. Dentro c'è un vecchio con le ginocchia di cristallo e un thermos di brulè. Sale fino in vetta, e non scende prima del tramonto." : "E ogni 13 dicembre qualcuno rimette in moto la funivia, per una corsa sola. Il primo anno Olmo non sale. Il secondo sì."]
      ] },
      neve: { coins: 500, bg: "gn_cima", lines: [
        ["voce", "Al tramonto, sulla neve di vetta, si sente un rumore che non c'era da quarantacinque anni: la slitta di Fiocco che arriva in salita, a strattoni, con un vecchio sopra che si tiene il berretto."],
        ["gn_fiocco", "[felice] Fiocco ha tirato il Guardiano! Il Guardiano pesa meno di un frigorifero. Fiocco è un po' deluso."],
        ["gn_olmo", "[serio] Ilde."],
        ["gn_ilde", "[serio] Olmo. Sei ingrassato. Lui no."],
        ["voce", "Senza dire altro, Olmo si mette tra due bastoni da sci piantati nella neve. Si toglie il berretto. Si mette i guanti, quelli arancioni, cuciti e ricuciti. Ilde posa il pallone del '79 sul dischetto di neve."],
        ["voce", "Lei prende la rincorsa. Tira. Basso, a sinistra. Olmo si butta. A destra. Apposta. Il pallone entra piano, rotola, si ferma contro la croce."],
        ["gn_ilde", "[commosso] ...Ti sei buttato dall'altra parte. Apposta. Quarantacinque anni per farti sbagliare un rigore, vecchio testardo. Era tutto quello che volevo. Che stavolta la parata non fosse tua."],
        ["gn_olmo", "[commosso] Era sua. È sempre stata sua. Gol, Ilde. Gol per Aurelio."],
        ["voce", "Fiocco raccoglie il pallone. Stavolta lo restituisce. Lassù, sopra il mare di nuvole, due vecchi ridono e piangono insieme, e uno yeti applaude con le zampe enormi. Il rumore arriva fino a Valdigelo. Lilli giura che era un tuono."],
        ["voce", "La domenica dopo, la Coppa delle Vette torna in vetrina con due nomi sulla targhetta. E il libro del rifugio ha una riga nuova, scritta da due mani vecchie: «13 dicembre. Abbiamo detto tutto a tutti. O. e I.»"]
      ] }
    };
    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 4); F.set("gn_c4_done", true); F.set("gn_fine_" + id, true);
      K.reward("gn_c4" + id, { coins: E2.coins, cos: "gn_c4" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines).concat([
        ["voce", `<b>FINE DEL GUARDIANO DI NEVE.</b><br>🕯️ Verità ${K.stat("verita")} · ⭐ Leggenda ${K.stat("leggenda")} · ❄️ Stelle alpine ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Dal menu, 🏔️ Livelli a scorrimento, puoi rigiocare tutte le salite. Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «Il Guardiano di Neve»."]
      ]), () => K.openMain(), E2.bg);
    }
    function finale() {
      K.learnLore("l_rigore"); K.inv.give("gn_coppa");
      say("voce", "L'ultimo rigore della Regina ti finisce tra i guanti e ci resta. La tempesta si ferma di colpo, come quando l'arbitro fischia la fine. La corona di ghiaccio di Ilde scivola nella neve.");
      say("gn_ilde", "[commosso] Parato. ...Parato davvero. Aurelio diceva che il portiere vero è quello che resta in piedi quando tutti scappano. Tu non sei scappato.");
      say("voce", "Dal cippo sotto la croce, Ilde prende la Coppa delle Vette e te la mette in mano. Pesa meno di quanto pensavi. Pesa quanto quarantacinque inverni divisi per due.");
      if (olmoUp()) {
        say("voce", "Poi, dal fondo della valle, un rumore che nessuno sentiva dal 1979: la ruota della funivia che gira. La cabina rossa sale, a scatti, sopra il vuoto. Il cerotto «NON RIPARTIRE» non c'è più.");
        say("gn_olmo", "[serio] ...Ciao, Ilde. Ho le ginocchia di cristallo e ho rotto un cerotto. Non dire niente. Ho sentito tutto dalla radiolina."); F.set("gn_olmo_vetta", true);
      } else say("gn_olmo", "[serio] <em>(radiolina)</em> ...Ho sentito tutto. Ilde, se mi senti: sono io. Sono sempre stato io, quello che non è salito.");
      say("gn_ilde", "[serio] Allora, guardiano. È tua, adesso. Decidi tu dove va.");
      const tt = K.scroll.total(), all = tt[0] >= tt[1], ver = K.stat("verita") >= 6 || F.is("gn_olmo_dire");
      return ask("Il sole tocca il mare di nuvole. La Coppa ti pesa tra le mani. Dove la porti, alla fine di tutto?", [
        { label: "🕯️ Giù in paese, con tutta la verità", sub: ver ? "La Parata Vera" : "Serve più Verità (6) o la promessa di Olmo al rifugio", disabled: !ver, big: true, fn: () => ending("verita") },
        { label: "⭐ In vetrina, e la storia resta quella", sub: "La Leggenda di Valdigelo", fn: () => ending("leggenda") },
        { label: "✝️ La lasci qui, sotto la croce", sub: "La Coppa sulla Vetta", fn: () => ending("vetta") },
        { label: "❄️ Il rigore di Ilde", sub: all ? "Segreto: hai trovato tutte le stelle alpine" : `Segreto: trova tutte le stelle alpine (${tt[0]}/${tt[1]})`, disabled: !all, cls: all ? "hot" : "", fn: () => ending("neve") }
      ]);
    }
    function slitta() {
      H.level("slitta", "<em>(radiolina)</em> Sei in slitta con lo yeti? Lo sapevo che finiva così. Tieniti: la slitta va da sola, tu salta, para e plana. E di' a Fiocco di non frenare con la faccia.", (r) => {
        if (r.win) {
          if (S() === 1) setStep(N, 2);
          say("gn_fiocco", "[felice] Vetta! Fiocco ha tirato. Fiocco non ha frenato con la faccia. Quasi.");
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Mancano delle stelle alpine: dal menu, 🏔️ Livelli a scorrimento, puoi rigiocare la salita. Contano per un finale segreto.");
          say("voce", "La slitta si ferma sul pianoro di vetta. Il sole è basso sul mare di nuvole. Accanto alla croce, una figura con un cappotto bianco e una corona di ghiaccio ti aspetta, le mani in tasca.");
          quest("gn_c4b", "La vetta", "Parla con la figura accanto alla croce di vetta.");
          const l = H.flush(); return K.say(l, () => K.go("gn_cima", 15, 17));
        }
        say("gn_fiocco", r.quit ? "Fiocco aspetta. Fiocco è bravo ad aspettare: è un raccattapalle." : "[triste] Slitta ribaltata. Fiocco chiede scusa. Fiocco riprova. Fiocco non frena con la faccia, stavolta."); done();
      });
    }
    function vetta() {
      H.level("vetta", "<em>(radiolina)</em> Ilde tira come tirava suo fratello: guarda la freccia, ti dice dove va. Basso, a mezza altezza, alto. E quando alza la tempesta, salta le onde. Non scappare. Mai.", (r) => {
        if (r.win) return finale();
        say("gn_ilde", "[pensa] Gol. Ma non vale: tu non sei lui. E nemmeno l'altro. Rimettiti in piedi, guardiano. Aspetto. Sono brava ad aspettare."); done();
      });
    }
    function gate() {
      const s = S();
      if (s < 1) { say("voce", "Il cancello della morena: due paletti, una catena e una freccia di legno, «VETTA ▲». A piedi sono tre ore. Fiocco, accanto alla slitta, ha un'idea migliore."); return done(); }
      return ask(s === 1 ? "Fiocco si mette alle stanghe della slitta e gonfia il petto. «Fiocco è pronto. Sali?»" : "La slitta rossa di Fiocco, pronta. La vetta è lassù.", [
        { label: "🛷 Sali sulla slitta", sub: "Livello a scorrimento · La slitta di Fiocco", big: true, cls: s === 1 ? "hot" : "", fn: slitta },
        ...(s >= 2 ? [{ label: "🏔️ Vai in vetta", sub: "Senza rigiocare la salita", fn: () => { K.say(H.flush(), () => K.go("gn_cima", 15, 17)); } }] : []),
        { label: "↩ Non ancora", fn: done }
      ]);
    }
    function cross() {
      const s = S();
      if (s < 3) { say("voce", s < 2 ? "La croce di vetta." : "La croce di vetta, di ferro, piegata dal vento. Sul cippo, sotto, la Coppa delle Vette. Lucidata. Prima, parla con chi la custodisce."); return done(); }
      if (s === 3) return ask("Ilde si toglie il cappotto bianco. Sotto ha una maglia degli Stambecchi, numero 9. Piazza il pallone del '79 sulla neve. «In porta, guardiano.»", [
        { label: "👑 Para i rigori della Regina", sub: "Capo finale · La Regina del Gelo", big: true, cls: "hot", fn: vetta },
        { label: "↩ Non ancora", fn: done }
      ]);
      return ask("La croce di vetta. Il pallone del '79 è ancora lì, nella neve. La scelta, se vuoi, si può rifare.", [
        { label: "🏆 Torna alla Coppa", sub: "Scegli di nuovo il finale", fn: () => { say("voce", "Il sole è di nuovo basso. Ilde ti rimette la Coppa in mano, senza dire niente."); finale(); } },
        { label: "↩ Lascia stare", fn: done }
      ]);
    }
    function chest() {
      if (S() > 0) { say("voce", "La cassa della finale è vuota. Sul fondo, scritto col gessetto da una mano enorme e storta: «PALONE N. 1»."); return done(); }
      if (!F.is("gn_fiocco4")) { say("voce", "Una cassa di legno con un lucchetto fatto di ghiaccio. Sopra, una zampa disegnata col gessetto. È di Fiocco: meglio chiedere a lui."); return done(); }
      K.inv.give("gn_pallone79"); K.learnLore("l_pallone79"); setStep(N, 1); K.questDone && K.questDone("gn_c4");
      say("voce", "Il lucchetto di ghiaccio si scioglie sotto il tuo guanto. Dentro, su un cuscino di sciarpe, un pallone di cuoio vecchio, a pannelli cuciti. C'è scritto a penna: «FINALE 13-12-1979 · ULTIMO RIGORE».");
      say("gn_fiocco", "[serio] Il primo pallone di Fiocco. È caduto nel bosco quella sera, nella bufera. Fiocco l'ha preso. Fiocco aspettava che qualcuno venisse a chiederlo. Nessuno è venuto. Quarantacinque anni.");
      say("gn_olmo", "[triste] <em>(radiolina)</em> ...Il pallone di Aurelio. L'ho cercato tutta la notte, sai? Col ginocchio rotto. Non per la parata. Perché era suo.");
      quest("gn_c4a", "La slitta di Fiocco", "Torna al cancello della morena: Fiocco ti porta in vetta.");
      return wask("Il pallone ti pesa tra le mani più di quanto dovrebbe.", [
        { label: "🕯️ «Lo porto a Ilde. È di suo fratello.»", w: { verita: 1 }, fn: () => { F.set("gn_pallone_ilde", true); say("gn_fiocco", "[felice] Fiocco è d'accordo. Fiocco porta la slitta. Tu porti il pallone. La Regina porta la corona. Tutti portano qualcosa."); done(); } },
        { label: "⭐ «Lo porto a Olmo. È la sua finale.»", w: { leggenda: 1 }, fn: () => { F.set("gn_pallone_olmo", true); say("gn_olmo", "[pensa] <em>(radiolina)</em> La mia finale. Sì. ...Anche se l'ho giocata per settanta minuti su novanta. E i rigori dallo spogliatoio."); done(); } }
      ]);
    }
    function clippings() {
      if (F.is("gn_ritagli")) { say("voce", "Quarantacinque anni di ritagli. Su tutti, a matita, la stessa correzione: «12»."); return done(); }
      F.set("gn_ritagli", true); K.bond && K.bond("verita", 1);
      say("voce", "Le pareti della capanna sono tappezzate di ritagli di giornale. «Brina para nella bufera» (1979). «Il Guardiano compie cinquant'anni» (1985). «Olmo, l'uomo che fermò il destino» (2004). Su ogni foto di Olmo in porta, a matita, una correzione piccola e ostinata: «12».");
      say("voce", "In un angolo, l'unico ritaglio senza correzioni: un trafiletto di sei righe. «Disperso sulla montagna il giovane Aurelio Rovere, 19 anni, riserva degli Stambecchi». Sei righe. La parata ne aveva avute sessanta."); done();
    }

    const talk = {
      gn_fiocco() {
        if (K.rel.scene("gn_fiocco")) return;
        const s = S();
        if (s === 0 && !F.is("gn_fiocco4")) {
          F.set("gn_fiocco4", true); quest("gn_c4", "La grotta di Fiocco", "Nella grotta di Fiocco (a ovest della morena) c'è una cassa con un lucchetto di ghiaccio.");
          say("gn_fiocco", "[felice] Ciao! Fiocco ha preparato la slitta. Fiocco l'ha lucidata con la lingua. Non chiedere.");
          say("gn_fiocco", "[serio] Ma la Regina ha detto: prima il pallone. Il pallone numero uno. È nella grotta di Fiocco, nella cassa col lucchetto. Il lucchetto si apre solo coi guanti giusti. Tu hai i guanti giusti.");
          return done();
        }
        say("gn_fiocco", s === 0 ? "La grotta è là, a ovest. La cassa ha un lucchetto di ghiaccio. Fiocco l'ha fatto da solo. Fiocco è fiero." : s === 1 ? "[felice] Il pallone numero uno! Adesso slitta. Il cancello, a nord. Fiocco è pronto. Fiocco è nato pronto." : s < 4 ? "La Regina è brava a tirare. Fiocco ha preso tantissimi suoi palloni. Tutti nel bosco. Fiocco li conta la sera." : "[felice] Fiocco ha restituito un pallone! Il primo. Fiocco si sente leggero. Fiocco forse restituisce anche gli altri. Forse."); done();
      },
      gn_ilde() {
        if (K.rel.scene("gn_ilde")) return;
        const s = S();
        if (s === 2) {
          K.learnLore("l_ilde");
          say("gn_ilde", "[serio] Sei arrivato. Con lo yeti, i guanti di Olmo e la radiolina accesa. Lui ti sente, vero? Bene. Che senta.");
          say("gn_ilde", "Io sono Ilde Rovere. In paese mi chiamano la Regina del Gelo, perché non scendo e non saluto. La corona l'ho fatta io, col ghiaccio della grondaia. Se mi chiamano regina, almeno che si veda.");
          say("gn_ilde", "[pensa] La Coppa l'ho presa io, sì. Dalla vetrina, di notte, con la chiave che Tecla lascia sotto lo zerbino da quarant'anni. Non per rubarla. Per farla salire. Le cose che salgono fin qui, prima o poi, si portano dietro qualcuno.");
          say("gn_ilde", "[triste] Mio fratello aveva diciannove anni e le mani enormi. Ha parato l'ultimo rigore con la maglia di un altro sopra la sua. Quella notte è salito al rifugio a scriverlo sul libro. Poi la bufera. La montagna l'ha tenuto. A me ha lasciato solo una sciarpa con la A e un trafiletto di sei righe.");
          say("gn_ilde", "[serio] Non voglio la Coppa. Non voglio vendetta. Voglio una cosa sola, da quarantacinque anni: tirare un rigore. A lui. Che stia in porta davanti a me, e che scelga da che parte buttarsi.");
          if (F.is("gn_lettere_olmo")) say("voce", "Le lettere legate con lo spago, nel tuo zaino, sembrano pesare di più.");
          return wask("La Regina ti guarda. Il vento le muove i capelli bianchi sotto la corona.", [
            { label: "🕯️ «Olmo lo sa. Gliel'ho fatto dire, ieri notte.»", w: { verita: 2 }, fn: () => { F.set("gn_ilde_sa", true); say("gn_ilde", "[commosso] L'ha detto? A voce? ...Quarantacinque lettere e bastava un ragazzo con una radiolina. Gli uomini di questa valle. Va bene. Allora tira tu, prima. Cioè: para tu."); next(); } },
            { label: "⭐ «Valdigelo ha bisogno della sua leggenda.»", w: { leggenda: 2 }, fn: () => { say("gn_ilde", "[pensa] Valdigelo ha bisogno di un portiere che para nella bufera. Ce l'aveva. Si chiamava Aurelio. Ma va bene: le leggende sono come la neve, coprono tutto e sembrano pulite. Vediamo se pari come lui."); next(); } },
            { label: "«Perché proprio un rigore?»", w: { verita: 1 }, fn: () => { say("gn_ilde", "[serio] Perché al rigore non puoi mentire. Il portiere sceglie un lato e si butta, davanti a tutti. Olmo ha sempre scelto il lato comodo. Voglio vederlo scegliere. Una volta."); next(); } }
          ]);
        }
        say("gn_ilde", s === 3 ? "[serio] La croce. Il dischetto è lì davanti. Quando sei pronto, guardiano." : s >= 4 ? "[felice] Sai cosa diceva Aurelio? Che i portieri sono gli unici che possono usare le mani. Per questo devono stare attenti a cosa ci tengono dentro." : "Più tardi."); done();
      }
    };
    function next() {
      setStep(N, 3); K.questDone && K.questDone("gn_c4b");
      quest("gn_c4c", "La Regina del Gelo", "Alla croce di vetta: para i rigori della Regina.");
      done();
    }

    const zones = {
      gn_morena: {
        region: "quota", name: "La morena delle sciarpe", short: "Morena", sub: "Sassi, neve e sei sciarpe degli Stambecchi che sbattono nel vento", bg: "gn_morena", time: "tramonto", w: 30, h: 22, base: "Q", start: [15, 19],
        cold: 1.6, warm: [[21, 13, 2.4]],
        itemCos: "gn_c4", items: [[2, 12], [27, 3], [9, 20], [27, 19]],
        areas: [[2, 2, 9, 7, "La grotta di Fiocco"], [9, 8, 21, 9, "I pali delle sciarpe"], [12, 0, 17, 2, "Il cancello della vetta"], [0, 0, 29, 21, "La morena"]],
        act: { X: "Apri il cancello", M: "Scaldati alla brace", p: "Guarda la sciarpa", P: "Guarda la slitta", r: "Guarda il masso", S: "Guarda l'ometto", n: "Leggi il cartello", l: "Guarda la lanterna", J: "Guarda la legna" },
        flavor: {
          K: "Un larice nano, piegato a terra dal vento. Quassù gli alberi crescono sdraiati, come chi ha imparato a non dare fastidio alla bufera.",
          I: "Un muretto di sassi a secco, mezzo sepolto. Qualcuno lo ricostruisce ogni estate. Lo stesso qualcuno che lucida le lanterne.",
          r: "Un masso grande come un'auto, portato giù dal ghiacciaio mille anni fa. Sopra, a vernice: «FORZA STAMBECCHI · 1979». Rinfrescata quest'anno.",
          p: "Un palo con una sciarpa degli Stambecchi, verde e bianca, sfilacciata dal vento. Sei pali, sei sciarpe: una ogni sette inverni. Qualcuno sale a cambiarle.",
          P: "La slitta rossa di Fiocco: legno di frassino, pattini di ferro, il sedile imbottito con una maglia verde numero 12. Sulla stanga, i segni dei denti di uno yeti.",
          S: "Un ometto di sassi, alto come un bambino. In cima, un guanto da portiere di lana, ghiacciato. Uno solo.",
          M: "Una brace dentro un paiolo di rame, sotto un riparo di sassi. Accanto, una tazza di latta con scritto «I.».",
          n: "Il cartello del sentiero: «VETTA DELLA REGINA 3420 m · ore 3». Sotto, aggiunto a mano: «in slitta: 4 minuti, se lo yeti è di buonumore».",
          l: "Una lanterna a petrolio su un bastone da sci. Accesa. Quassù tutte le lanterne sono accese, sempre.",
          J: "Legna di pino mugo, tagliata e accatastata. Profuma di resina anche sotto la neve."
        },
        npcs: () => [{ id: "gn_fiocco", at: [23, 16] }],
        intro: [["voce", "La mattina dopo, lo Stambecco Nero ti accompagna fino al limite della conca. Poi si gira e se ne va, senza salutare: è uno stambecco."], ["voce", "Sopra, la morena: un mare di sassi e neve, sei pali con sei sciarpe che sbattono nel vento, una grotta che respira vapore. E una slitta rossa, con uno yeti alle stanghe."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I"); put(14, 1, "X"); put(15, 1, "X");
          lay(0, 2, 0, 21, "r"); lay(29, 2, 29, 21, "r"); lay(1, 21, 28, 21, "r"); put(0, 21, "I"); put(29, 21, "I"); put(14, 21, "Q"); put(15, 21, "Q");
          house(2, 3, 7, 4, { door: [5, 6], roof: "#e8eef6", wall: "#5a6474", enter: { to: "gn_grotta", at: [8, 9] } });
          [10, 12, 14, 16, 18, 20].forEach((x) => put(x, 8, "p"));
          put(21, 13, "M"); put(22, 12, "J"); put(24, 17, "P"); put(25, 17, "P");
          [[4, 10], [7, 15], [26, 8], [19, 19], [11, 17], [3, 18]].forEach(([x, y]) => put(x, y, "r"));
          [[24, 4], [6, 12]].forEach(([x, y]) => put(x, y, "S")); [[11, 3], [18, 3], [9, 12], [20, 16]].forEach(([x, y]) => put(x, y, "l"));
          put(16, 4, "n"); [[26, 12], [2, 15], [13, 13]].forEach(([x, y]) => put(x, y, "K"));
        },
        decor(g, cx, cy, d) { const s = S(), on = s >= 1, bl = s === 1 && Math.floor(Date.now() / 450) % 2; H.plaque(g, on ? "▶ LIVELLO: VETTA ▲" : "VETTA ▲", d.X(14) + 16, d.Y(2) + 4, bl ? "#fef08a" : "#e0f2fe"); if (s === 1) { g.save(); g.globalAlpha = 0.35 + 0.35 * Math.abs(Math.sin(Date.now() / 300)); g.strokeStyle = "#fde047"; g.lineWidth = 2; g.strokeRect(d.X(14) - 2, d.Y(1) - 2, 36, 20); g.restore(); } H.plaque(g, "GROTTA DI FIOCCO", d.X(5) + 8, d.Y(3) - 6, s === 0 && F.is("gn_fiocco4") && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#bae6fd"); }
      },
      gn_grotta: {
        interior: true, region: "casa", name: "La grotta di Fiocco", short: "Grotta", sub: "Ghiaccio azzurro, stalattiti e quarantacinque anni di palloni", bg: "gn_grotta", w: 16, h: 11, start: [8, 9], outside: ["gn_morena", 5, 7], base: "Q",
        act: { z: "Guarda i palloni", x: "Apri la cassa", Z: "Guarda la porta di ghiaccio", B: "Guarda il giaciglio", L: "Guarda gli scaffali", O: "Scaldati" },
        flavor: { z: "Palloni. Centinaia. Impilati per colore e per decennio: cuoio marrone, poi bianco e nero, poi colorati, poi quelli di plastica dei bambini. Su un cartellino: «DA RESTITUIRE (FORSE)».", Z: "Una porta da calcio scavata nel ghiaccio, con la rete di corda. Il ghiaccio davanti è consumato in un punto preciso: il dischetto. Qualcuno ci tira da tanto tempo.", B: "Il giaciglio di Fiocco: paglia, coperte, una sciarpa degli Stambecchi come cuscino e un orsacchiotto di peluche più grande di te.", L: "Scaffali di ghiaccio con dentro scarpe spaiate, berretti, un fischietto da arbitro e un trofeo della sagra del 1988, «MIGLIOR POLENTA».", O: "Una stufetta che Fiocco non accende mai: si scioglierebbe. È per gli ospiti. Calore pieno." },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Q"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          [[1, 2], [2, 2], [3, 2], [1, 4], [1, 5], [12, 6], [13, 6], [14, 6]].forEach(([x, y]) => put(x, y, "z")); put(8, 1, "Z"); put(12, 2, "x"); lay(13, 2, 14, 3, "B"); put(5, 1, "L"); put(6, 1, "L"); put(2, 8, "O");
        },
        decor(g, cx, cy, d) { H.plaque(g, "PALONI · NON TOCARE", d.X(8), d.Y(0) + 6, "#bae6fd"); H.plaque(g, "N.1", d.X(12) + 8, d.Y(2) - 8, S() === 0 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#e2e8f0"); }
      },
      gn_cima: {
        region: "vetta", name: "La vetta della Regina", short: "Vetta", sub: "3420 metri, il mare di nuvole, la croce e la Coppa", bg: "gn_cima", time: "tramonto", w: 30, h: 22, base: "Q", start: [15, 17],
        cold: 1.8, warm: [[8, 13, 2.4]],
        items: [[2, 3], [27, 6], [3, 19], [26, 19]], itemCos: "gn_c4",
        areas: [[12, 2, 18, 6, "La croce di vetta"], [3, 8, 10, 12, "La capanna della Regina"], [20, 8, 27, 12, "L'arrivo della funivia"], [13, 20, 16, 21, "Il sentiero della morena"], [0, 0, 29, 21, "La vetta"]],
        act: { C: "Vai alla croce", X: "Scendi alla morena", M: "Scaldati alla brace", r: "Guarda la roccia", S: "Guarda l'ometto", Z: "Guarda la porta di ghiaccio", l: "Guarda la lanterna", n: "Leggi il cartello", b: "Siediti" },
        flavor: {
          r: "Roccia nuda, rosa al tramonto. Sotto, il mare di nuvole, e sotto il mare di nuvole, Valdigelo con il braciere acceso. Da quassù sembra una candela.",
          S: "Un ometto di sassi con una bandierina di stoffa: «13-12». Ce ne sono quarantacinque, tutti in fila verso il precipizio.",
          Z: "Una porta da calcio fatta di blocchi di ghiaccio, con due bastoni da sci per pali. Davanti, un dischetto di neve battuta, consumato. Dietro, il vuoto e le nuvole.",
          M: "Una brace in un bidone, riparata dal vento. Accanto, due tazze di latta. Una ha la polvere dentro.",
          l: "Una lanterna appesa a un palo della funivia. La luce si vede da Valdigelo, la sera: in paese dicono che è la Regina che conta i peccati.",
          n: "Il cartello di vetta: «VETTA DELLA REGINA · 3420 m». Sotto, inciso col temperino: «e del suo portiere».",
          b: "Una panca di legno davanti al precipizio. Ci si siede in due, stretti. Ci si siede in uno, larghi.",
          I: "Il muretto della capanna, coperto di neve e di ritagli di giornale incollati con la colla di farina, sbiaditi dal sole."
        },
        npcs: () => S() >= 2 ? [{ id: "gn_ilde", at: [15, 7] }, { id: "gn_fiocco", at: [19, 16] }].concat(F.is("gn_olmo_vetta") ? [{ id: "gn_olmo", at: [17, 8] }] : []) : [],
        intro: [["voce", "La vetta della Regina, 3420 metri. Il sole basso, rosso, sopra un mare di nuvole che va fino al Borgo e oltre."], ["voce", "Davanti alla croce, sulla neve battuta, un dischetto del rigore. Accanto, una porta fatta di ghiaccio. Qualcuno, quassù, si allena da molto tempo."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I"); lay(0, 2, 0, 21, "r"); lay(29, 2, 29, 21, "r"); lay(1, 21, 28, 21, "r"); put(0, 21, "I"); put(29, 21, "I"); put(14, 21, "X"); put(15, 21, "X");
          lay(12, 2, 18, 2, "r"); put(15, 4, "C"); put(15, 11, "Z");
          house(3, 8, 7, 4, { door: [6, 11], roof: "#e8eef6", wall: "#6a4a3a", chimney: true, enter: { to: "gn_capanna", at: [8, 9] } });
          house(21, 8, 6, 4, { door: [23, 11], roof: "#6a1a1a", wall: "#7a7a86" });
          put(8, 13, "M"); put(13, 14, "b"); put(17, 14, "b");
          [[3, 4], [6, 5], [24, 4], [26, 15], [4, 16], [10, 19], [21, 19]].forEach(([x, y]) => put(x, y, "r"));
          [[10, 3], [20, 3], [11, 6], [19, 6], [2, 7], [27, 10]].forEach(([x, y]) => put(x, y, "S")); [[12, 8], [18, 8], [20, 13]].forEach(([x, y]) => put(x, y, "l")); put(17, 19, "n");
          [[22, 15], [23, 16], [24, 17], [25, 18], [6, 15], [5, 17]].forEach(([x, y]) => put(x, y, "S")); [[8, 17], [12, 16], [19, 18], [23, 14]].forEach(([x, y]) => put(x, y, "r"));
        },
        decor(g, cx, cy, d) { const s = S(), bl = (s === 3) && Math.floor(Date.now() / 450) % 2; H.plaque(g, s === 3 ? "▶ CAPO: LA REGINA" : "CROCE DI VETTA", d.X(15) + 8, d.Y(4) - 22, bl ? "#fef08a" : "#fecaca"); H.plaque(g, "↓ MORENA", d.X(14) + 16, d.Y(21) - 4, "#e0f2fe"); H.plaque(g, "FUNIVIA · ARRIVO", d.X(24), d.Y(8) - 6, F.is("gn_olmo_vetta") ? "#fef08a" : "#94a3b8"); H.plaque(g, "CAPANNA", d.X(6) + 8, d.Y(8) - 6, "#fed7aa"); }
      },
      gn_capanna: {
        interior: true, region: "casa", name: "La capanna della Regina", short: "Capanna", sub: "Ritagli di giornale, una tazza sola e una stufa sempre accesa", bg: "gn_capanna", w: 16, h: 11, start: [8, 9], outside: ["gn_cima", 6, 12], base: "Y",
        act: { L: "Leggi i ritagli", R: "Guarda la foto", T: "Guarda il tavolo", O: "Scaldati alla stufa", B: "Guarda la branda", W: "Guarda dalla finestra", b: "Siediti" },
        flavor: { R: "Un ragazzo in maglia verde, numero 12, i guanti troppo grandi, che ride. Sotto, a matita: «Aurelio, 19 anni, il giorno della finale». Accanto, un chiodo vuoto: lì c'era un'altra foto. Ilde l'ha tolta.", T: "Il tavolo: una tazza sola, un pezzo di pane, un quaderno di rigori («basso sx: 812 · alto dx: 640 · centrale: 3, perché i centrali sono da vigliacchi»). E un'impronta tonda nella polvere, della forma della Coppa.", O: "La stufa di Ilde, sempre accesa. Sopra, un pentolino di latte e una corona di ghiaccio che si sta sciogliendo piano in una scodella. Calore pieno.", B: "Una branda militare con una coperta a quadri. Sotto, una valigia pronta, con la polvere sopra. Pronta da quanto?", W: "La finestra guarda giù, verso Valdigelo. Sul davanzale, un binocolo puntato sempre nello stesso punto: la finestra della baita di Olmo.", b: "Una sedia sola. L'altra, appesa al muro, come un quadro." },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(1, 1, 6, 1, "L"); put(9, 1, "R"); put(10, 1, "R"); put(12, 1, "W"); lay(6, 5, 8, 5, "T"); put(9, 6, "b"); put(13, 3, "O"); put(13, 4, "O"); lay(1, 6, 1, 8, "B");
        },
        decor(g, cx, cy, d) { H.plaque(g, "12", d.X(9) + 16, d.Y(1) + 2, "#e2e8f0"); }
      }
    };
    return {
      n: N, title: "La Regina del Gelo", sub: "Una grotta di palloni, una slitta, una croce e l'ultimo rigore",
      goal, start: "gn_morena", introBg: "gn_morena", zones, talk,
      obj: {
        "gn_morena:X": () => gate(),
        "gn_morena:M": () => { K.cold.set(K.cold.max); say("voce", "Ti accucci davanti alla brace della Regina. Le mani tornano tue. Nella tazza di latta, un fondo di tè ancora tiepido."); done(); },
        "gn_grotta:x": () => chest(),
        "gn_grotta:O": () => { K.cold.set(K.cold.max); say("voce", "La stufetta degli ospiti. Fiocco si tiene a due metri, per sicurezza. Calore pieno."); done(); },
        "gn_cima:C": () => cross(),
        "gn_cima:X": () => { say("voce", "Scendi verso la morena, nella neve fonda fino al ginocchio."); K.say(H.flush(), () => K.go("gn_morena", 15, 3)); },
        "gn_cima:M": () => { K.cold.set(K.cold.max); say("voce", "La brace della vetta. Due tazze di latta accanto. Una ha la polvere dentro. Calore pieno."); done(); },
        "gn_capanna:L": () => clippings(),
        "gn_capanna:O": () => { K.cold.set(K.cold.max); say("voce", "La stufa di Ilde. Il latte nel pentolino, la corona di ghiaccio che si scioglie in una scodella. Calore pieno."); done(); }
      },
      intro: [["voce", "Ultimo giorno. Domani, a Valdigelo, si gioca la Partita della Neve, con o senza Coppa."], ["gn_olmo", "[serio] <em>(radiolina)</em> Lassù c'è lei. Lo so da quarantacinque anni e faccio finta di no. Vai. Io... io ci penso."]]
    };
  }
  boot();
})();
