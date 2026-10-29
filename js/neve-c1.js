// js/neve-c1.js - «IL GUARDIANO DI NEVE» · Capitolo 1: La vetrina vuota
// Valdigelo, la vigilia della Partita della Neve. Dalla vetrina del Bar Stambecco è sparita la Coppa delle Vette del 1979; orme enormi salgono nel bosco.
// Olmo Brina, il portiere della parata del '79, ha le ginocchia finite e ti presta i guanti: prima salita a scorrimento (Il bosco degli abeti)
// e primo capo (il Grande Raccattapalle, uno yeti che tira palle di neve: si batte RESPINGENDOLE).
(function () {
  "use strict";
  function boot() {
    const E = window.__neveCore;
    if (!E || !E.api || !E.api.addChapter || !window.__neveH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__neveH(K), { say, done, ask, wask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("gn_c1", { kind: "shirt", label: "Maglione degli Stambecchi", val: "#2f6b3a", from: "Capitolo 1 del Guardiano di Neve" });
    K.lore("l_coppa", { t: "La Coppa delle Vette", d: "Trofeo dei paesi di montagna, giocato sulla neve battuta. Valdigelo l'ha vinta una volta sola, nel 1979, ai rigori. Da allora sta nella vetrina del Bar Stambecco, sotto una foto in cui un ragazzo ha la faccia grattata via." });
    K.lore("l_parata", { t: "La parata del '79", d: "Ultimo rigore della finale. Olmo Brina si butta a destra, la palla prende il palo ed esce. Valdigelo vince. Nessuno ricorda chi tirò quel rigore, o fa finta di non ricordarlo." });
    K.lore("l_raccattapalle", { t: "Il Raccattapalle del bosco", d: "Per i bambini di Valdigelo è una favola: i palloni che finiscono nel bosco li prende uno yeti e li porta a qualcuno, in cima alla montagna. Per i grandi è una scusa per non andarli a cercare." });

    const goal = (s) => ({
      0: "Valdigelo, vigilia della Partita della Neve. Entra nel Bar Stambecco (a ovest) e parla con Tecla. (🌡️ Fuori fa freddo: il Calore scende, risale al braciere e al chiuso.)",
      1: "Vai a casa di Olmo Brina (la baita a est): il vecchio portiere conosce la montagna.",
      2: "▶ LIVELLO A SCORRIMENTO: il cancello del sentiero (a nord, scritta SENTIERO ▲). Coi guanti di Olmo si PARA. Lilli e Don Fulvio, in piazza, sanno qualcosa.",
      3: "Nella radura ti aspetta il Grande Raccattapalle: torna al cancello del sentiero.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      setStep(N, 4); F.set("gn_c1_done", true);
      K.inv.give("gn_sciarpa"); K.inv.give("gn_berretto");
      K.reward("gn_c1", { coins: 80, cos: "gn_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Torni giù col buio. Il braciere della piazza è l'unica luce accesa, e accanto, seduto su una sedia del bar, c'è Olmo. È sceso da solo. Col bastone, sulla neve."],
        ["voce", "Gli metti in mano la sciarpa piccola, quella con la A. Olmo la guarda a lungo. Poi la piega, con la stessa cura con cui l'aveva piegata lo yeti."],
        ["gn_olmo", "[serio] Domani ti racconto. Stasera no. Stasera ho freddo, e non è il freddo della neve."],
        ["voce", "Nella tana del Raccattapalle c'era anche un berretto degli Stambecchi: nelle salite vale un colpo in più."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>🕯️ Verità ${K.stat("verita")} · ⭐ Leggenda ${K.stat("leggenda")} · ❄️ Stelle alpine ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Il Capitolo 2 ti aspetta: il canalone delle valanghe."]
      ]), () => K.openMain(), "gn_titolo");
    }
    function finale() {
      K.learnLore("l_raccattapalle");
      say("voce", "Il Grande Raccattapalle si siede nella neve, sbuffa una nuvola grande come un comignolo e alza le mani. Le mani sono più grandi della tua testa.");
      say("gn_fiocco", "[triste] Fiocco si arrende. Fiocco para male. Fiocco raccoglie bene. Ognuno ha il suo ruolo, dice sempre la Regina.");
      say("gn_fiocco", "La coppa non è qui. La coppa luccica, e le cose che luccicano Fiocco le porta su, alla Regina. La Regina ha detto: «Portami quella che luccica, nella vetrina del bar». Fiocco ha portato.");
      say("voce", "Intorno alla tana, centinaia di palloni bucati, impilati per colore. In cima alla pila, piegata con cura, una sciarpa degli Stambecchi da ragazzo. Su un angolo, ricamata, una A.");
      say("gn_olmo", "[serio] <em>(dalla radiolina)</em> ...Campione. Ripeti. Cosa c'è ricamato sulla sciarpa?");
      return wask("Il Raccattapalle aspetta, con le mani alzate e un berretto in testa troppo piccolo.", [
        { label: "🕯️ «Chi è la Regina? E chi è A?»", w: { verita: 2 }, fn: () => { F.set("gn_a_chiesto", true); say("gn_fiocco", "[pensa] La Regina abita in cima, dove la neve non si scioglie mai. A... A è il nome che la Regina dice quando nevica forte. Fiocco non sa altro. Fiocco non chiede: chiedere è un altro ruolo."); say("gn_olmo", "[serio] <em>(radiolina)</em> ...Torna giù. Adesso."); fin(); } },
        { label: "⭐ «Torna nel bosco. Della Coppa ci occupiamo noi.»", w: { leggenda: 1 }, fn: () => { F.set("gn_fiocco_bosco", true); say("gn_fiocco", "[felice] Fiocco torna. Fiocco tiene i palloni. Se ne perdete uno, Fiocco lo trova. Non lo ridà, ma lo trova."); fin(); } },
        { label: "«Vieni giù a fare il raccattapalle alla Partita della Neve.»", w: { verita: 1, leggenda: 1 }, fn: () => { F.set("gn_fiocco_paese", true); say("gn_fiocco", "[sorpreso] Una partita vera? Coi palloni che vanno fuori, e Fiocco che li riporta indietro? ...Fiocco non ha mai riportato indietro niente. Fiocco può provare."); fin(); } }
      ]);
    }
    function bosco() {
      H.level("bosco", "Mi senti? È la radiolina della baita. Ti parlo da qui. Ricordati: una palla di neve non si schiva. Si para. E quando c'è un buco nella neve, buttati e vola.", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          say("gn_olmo", "[felice] <em>(radiolina)</em> Hai parato come si deve. Sentivo gli yeti bestemmiare fino a qui. In yeti, ma si capiva.");
          if (r.ban) say("gn_lilli", `[felice] <em>(radiolina, rubata al nonno)</em> Hai trovato ${r.ban} stelle alpine! Me ne porti una? Il nonno dice che non si colgono. Il nonno dice tante cose.`);
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Mancano delle stelle alpine: dal menu, 🏔️ Livelli a scorrimento, puoi rigiocare la salita quando vuoi.");
          say("voce", "Oltre il rifugio, il bosco si apre in una radura bianca. Dal fondo arriva un rumore di palloni che rimbalzano, e un ruggito che sembra uno sbadiglio.");
          quest("gn_c1c", "La radura", "Torna al cancello del sentiero e sali alla radura del Raccattapalle.");
          return done();
        }
        say("gn_olmo", r.quit ? "<em>(radiolina)</em> Torna giù, va bene. La montagna aspetta. È la cosa che le riesce meglio." : "<em>(radiolina)</em> Ti hanno preso. Succede. Il portiere è l'unico che, se sbaglia, lo vedono tutti. Riprova."); done();
      });
    }
    function radura() {
      H.level("radura", "Il Raccattapalle tira palle grosse come angurie. Non scappare: PARALE, e tornano a lui. Quando salta e atterra, la terra trema: stacca i piedi da terra. Poi si siede stanco: saltagli in testa.", (r) => {
        if (r.win) return finale();
        say("gn_olmo", "<em>(radiolina)</em> Ti ha sommerso. Nel '79 nevicava così, il giorno della finale. Respira. Riprova."); done();
      });
    }
    // il cancello del sentiero (tessera X): avvia le salite
    function gate() {
      const s = S();
      if (s < 2) { say("voce", s === 0 ? "Il cancello del sentiero del bosco. Un cartello: «CHIUSO PER NEVE. E PER YETI». Qualcuno ha aggiunto la seconda parte a pennarello." : "Il sentiero sale nel bosco, ripido e bianco. Senza qualcuno che conosce la montagna, non è il caso."); return done(); }
      if (s === 2) return ask("Il cancello si apre con un cigolio gelato. Di là, abeti, orme enormi e il rumore lontano di un pallone che rimbalza.", [
        { label: "🌲 Sali nel bosco", sub: "Livello a scorrimento · Il bosco degli abeti", big: true, cls: "hot", fn: bosco },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Dal bosco arriva un ruggito, poi un tonfo, poi un pallone che rotola fino al cancello.", [
        { label: "🦍 Sali alla radura", sub: "Capo · Il Grande Raccattapalle", big: true, cls: "hot", fn: radura },
        { label: "🌲 Rigioca il bosco", sub: "Per le stelle alpine mancanti", fn: bosco },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "Il cancello è aperto. Dal menu, 🏔️ Livelli a scorrimento, rigiochi le salite superate."); done();
    }

    const talk = {
      gn_tecla() {
        if (K.rel.scene("gn_tecla")) return;
        const s = S();
        if (s === 0) {
          say("gn_tecla", "[arrabbiata] Sei il calciatore della Partita della Neve? Benvenuto a Valdigelo. Hai scelto la settimana sbagliata.");
          say("gn_tecla", "Guarda la vetrina. Vuota. Stanotte qualcuno ha preso la Coppa delle Vette. Quarantacinque anni lì dentro, e me la rubano la vigilia della partita. Con la tv regionale che viene a fare il servizio.");
          say("gn_tecla", "Niente impronte di scarpe. Solo orme grandi come un tagliere, che escono dalla porta e salgono verso il bosco. E un ciuffo di pelo bianchissimo sul vetro. Tu dirai: uno yeti. Io dico: non ho dormito.");
          say("gn_tecla", "L'unico che conosce la montagna sopra il bosco è Olmo Brina. Il portiere della Coppa. La baita a est. Non sale più da anni, ma la montagna se la ricorda tutta.");
          K.learnLore("l_coppa"); setStep(N, 1); quest("gn_c1", "La vetrina vuota", "Vai alla baita di Olmo Brina, a est della piazza.");
          if (!K.inv.has("gn_brule")) { K.inv.give("gn_brule"); say("voce", "Tecla ti mette in mano una borraccia di vin brulè (🎒 Zaino): «Per Olmo. Se arrivi a mani vuote, non apre»."); }
          return done();
        }
        say("gn_tecla", s === 1 ? "La baita di Olmo, a est. Bussa forte: è sordo da un orecchio. Da quello che gli conviene." : s < 4 ? "Sali, campione. Io intanto preparo il brulè per quando torni. Se torni con la Coppa, è gratis. Se torni senza, è gratis lo stesso: non sono un mostro." : "La vetrina è ancora vuota. Ma stasera, al bar, la gente parla d'altro. Parla di te."); done();
      },
      gn_olmo() {
        if (K.rel.scene("gn_olmo")) return;
        const s = S();
        if (s === 1) {
          say("gn_olmo", "[serio] Tecla ti manda. Lo sento dal brulè. Entra, chiudi, che il caldo costa.");
          say("gn_olmo", "La Coppa. Lo so. Lo sa tutto il paese, e tutto il paese stamattina è passato a guardarmi. Come se fossi io a doverla riportare indietro. Con queste ginocchia non arrivo neanche al cancello.");
          say("gn_olmo", "[pensa] Ma tu hai le gambe buone. E forse le mani. Tieni. I miei guanti del '79. Non li ho mai lavati: porta sfortuna. Lassù non si calcia, si para. Le palle di neve tornano a chi le tira, se le prendi nel momento giusto.");
          say("gn_olmo", "Ti do anche la radiolina della baita: ti parlo io, mentre sali. Così almeno qualcosa di me torna in montagna.");
          say("voce", "Ottieni i Guanti di Olmo (🎒 Zaino). Nelle salite, 🧤 PARA.");
          F.set("gn_guanti", true); K.inv.give("gn_guanti"); K.learnLore("l_parata"); setStep(N, 2); K.questDone && K.questDone("gn_c1");
          quest("gn_c1b", "Il sentiero del bosco", "Prendi il sentiero dal cancello a nord della piazza e segui le orme.");
          return wask("Olmo ti stringe le mani dentro i guanti. Le sue tremano un poco.", [
            { label: "🕯️ «Perché non vuole che vada su?»", w: { verita: 1 }, fn: () => { say("gn_olmo", "[serio] Chi ha detto che non voglio? Voglio. È la montagna che non vuole me. Abbiamo un conto aperto. Io e lei. Vai, prima che cambi idea."); done(); } },
            { label: "⭐ «Salgo per il Guardiano di Valdigelo.»", w: { leggenda: 1 }, fn: () => { say("gn_olmo", "[pensa] Il Guardiano. Bel nome. L'ha inventato un giornalista nel '79, che non aveva mai visto una partita sulla neve. Va bene, vai per lui. Io resto qui per me."); done(); } },
            { label: "«Prendo i guanti. E il brulè lo lascio a lei.»", fn: () => { if (K.inv.has("gn_brule")) { K.inv.take("gn_brule"); K.rel.add("gn_olmo", 4); } say("gn_olmo", "[felice] Quello di Tecla! Allora sei uno che capisce. Vai. E torna: i guanti me li riporti, non sono un regalo. Sono un prestito di fiducia."); done(); } }
          ]);
        }
        say("gn_olmo", s < 1 ? "[serio] Chi è? Il calciatore della partita? Prima vai da Tecla. Dopo, se vuoi, torna. Il caffè non lo faccio, la porta sì: la apro." : s < 4 ? "La radiolina è accesa. Io sono qui, sulla poltrona. Sali. Para. E non guardare giù: è un consiglio da portiere, vale anche per la vita." : "[serio] Domani ti racconto. Stasera, lasciami alla stufa."); done();
      },
      gn_lilli() {
        if (K.rel.scene("gn_lilli")) return;
        const s = S();
        if (s >= 2 && !F.is("gn_lil1")) {
          F.set("gn_lil1", true);
          say("gn_lilli", "[felice] Hai i guanti del nonno! Allora ci credi anche tu! Io l'ho visto, stanotte. Lo yeti. Dalla finestra.");
          say("gn_lilli", "Era grande come la chiesa. Va bene, come metà chiesa. Aveva la sciarpa degli Stambecchi e camminava piano, per non svegliare nessuno. Portava una cosa che luccicava.");
          say("gn_lilli", "[pensa] Il nonno dice che non esiste. Ma quando l'ho detto, ha tirato la tenda dalla parte della montagna. Lui la tenda la tira sempre, da quella parte.");
          return done();
        }
        say("gn_lilli", s < 2 ? "Sei quello della partita? Io faccio il tifo per chi perde. Così almeno qualcuno è contento della sconfitta." : "Quando torni mi racconti com'è lo yeti da vicino? Il nonno non vuole. Allora me lo racconti tu."); done();
      },
      gn_fulvio() {
        if (K.rel.scene("gn_fulvio")) return;
        const s = S();
        if (s >= 2 && !F.is("gn_ful1")) {
          F.set("gn_ful1", true);
          say("gn_fulvio", "[serio] Vai su con i guanti di Olmo. Sant'Antonio abate, protettore degli animali, proteggi anche lo yeti. E il calciatore. In quest'ordine, che lo yeti è più grosso.");
          say("gn_fulvio", "Nel '79 ero in campo, sai. Terzino. Il rigore di Olmo l'ho visto da tre metri. Tutti dicono che è stata una parata impossibile.");
          say("gn_fulvio", "[pensa] Le parate impossibili, figliolo, di solito hanno una spiegazione. Solo che nessuno la vuole sentire.");
          return wask("Don Fulvio si sistema la sciarpa e guarda verso la Vetta.", [
            { label: "🕯️ «Che spiegazione?»", w: { verita: 1 }, fn: () => { say("gn_fulvio", "[serio] Quella che deve dare Olmo, non io. Io ho già i miei peccati da confessare. Tutti al mio confessore, che è sordo. Comodo."); done(); } },
            { label: "⭐ «Le parate impossibili esistono.»", w: { leggenda: 1 }, fn: () => { say("gn_fulvio", "[felice] Esistono. Anche i miracoli. Ma i miracoli, almeno, non li hanno mai ripresi in tv."); done(); } }
          ]);
        }
        say("gn_fulvio", s < 2 ? "Benvenuto a Valdigelo. Messa alle otto, Partita della Neve alle due, rissa al bar alle quattro. Tradizioni." : "Prego per te. Gratis, ma accetto offerte in vin brulè."); done();
      }
    };

    const zones = {
      gn_paese: {
        region: "valdigelo", name: "Valdigelo", short: "Valdigelo", sub: "Il paese sopra il Borgo, la settimana di Santa Lucia", bg: "gn_paese", time: "tramonto", w: 30, h: 22, base: "Q", start: [15, 19],
        cold: true, warm: [[14, 11, 2.6], [15, 11, 2.6]],
        itemCos: "gn_c1", items: [[1, 5], [28, 9], [11, 20], [26, 20]],
        areas: [[2, 4, 9, 9, "Il Bar Stambecco"], [20, 4, 27, 9, "La baita di Olmo"], [11, 9, 18, 13, "Il braciere"], [12, 0, 17, 3, "Il cancello del sentiero"], [1, 14, 7, 19, "La chiesa"], [0, 0, 29, 21, "Valdigelo"]],
        act: { X: "Prendi il sentiero", M: "Scaldati al braciere", F: "Guarda la fontana", J: "Guarda la legna", P: "Guarda gli sci", C: "Leggi il cippo", n: "Leggi il cartello", s: "Riposa un momento", l: "Guarda la lanterna", b: "Siediti", q: "Entra" },
        flavor: {
          I: "Muretti di sassi coperti da un cuscino di neve. Ci camminano i gatti, in fila, come se fosse una strada.",
          K: "Un abete carico di neve. Ogni tanto si scrolla un ramo e un pezzo di inverno ti cade sul collo.",
          M: "Il braciere della piazza: ferro nero e fuoco vivo. Ci si scaldano le mani e si fanno pettegolezzi. Il calore risale.",
          F: "La fontana del paese, ghiacciata. Le stalattiti fanno un rumore di campanelli quando tira vento.",
          J: "Una catasta di legna di larice. Profuma di resina e di estate passata.",
          P: "Sci di legno e slitte appoggiati al muro. Uno sci ha inciso un cuore e due iniziali, una grattata via.",
          C: "Un cippo con la croce: «SENTIERO DEL BOSCO · RIFUGIO 1 ORA · VETTA: CHI LO SA». Qualcuno ha aggiunto: «non andateci».",
          n: "Il cartello: «PARTITA DELLA NEVE · domenica ore 14 · campo sportivo (spalato) · in palio la Coppa delle Vette». Sotto, a pennarello rosso: «(se la ritroviamo)».",
          s: "Una panca sotto il portico della chiesa, asciutta. Si vede tutta la valle, bianca fino al Borgo.",
          l: "Una lanterna con la candela. Il vetro è appannato dal respiro di chi ci si è fermato davanti.",
          b: "Una panchina coperta di neve fresca. Ci sederesti, se non fosse una panchina coperta di neve fresca."
        },
        npcs: (s) => [{ id: "gn_lilli", at: [8, 16] }, { id: "gn_fulvio", at: [5, 13] }],
        intro: [["voce", "Valdigelo, la settimana di Santa Lucia. La corriera ti lascia in piazza col borsone e se ne va in retromarcia: la strada più su non c'è."], ["voce", "A ovest il Bar Stambecco, a est la baita di Olmo Brina, a nord il cancello del sentiero del bosco. In mezzo, un braciere acceso. Fa un freddo che si sente nei denti."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 2, "I"); put(14, 2, "X"); put(15, 2, "X");
          lay(0, 3, 0, 21, "K"); lay(29, 3, 29, 21, "K"); lay(1, 21, 28, 21, "K"); put(14, 21, "Q"); put(15, 21, "Q");
          house(2, 4, 7, 5, { door: [5, 8], roof: "#7f1d1d", wall: "#d6b48c", chimney: true, enter: { to: "gn_bar", at: [8, 9] } });
          house(21, 4, 6, 5, { door: [23, 8], roof: "#3f2a20", wall: "#a07850", chimney: true, enter: { to: "gn_casa", at: [8, 9] } });
          house(2, 14, 5, 5, { door: [4, 18], roof: "#475569", wall: "#e2dcd0", enter: "La chiesa di Sant'Antonio abate. Dentro, un presepe con le pecore di lana e un pastore che somiglia molto a Olmo da giovane." });
          house(22, 15, 5, 4, { door: [24, 18], roof: "#334155", wall: "#e5e7eb", enter: "La scuola di Valdigelo: una classe sola, undici bambini, una maestra e una stufa. Sulla lavagna: «domani niente compiti: partita»." });
          house(10, 15, 4, 4, { door: [11, 18], roof: "#5a2a20", wall: "#c8a07a", chimney: true, enter: "La latteria. Chiusa. Sulla porta: «torno quando la Coppa torna»." });
          put(14, 11, "M"); put(15, 11, "M"); put(19, 12, "F");
          [[10, 4], [11, 4], [18, 4], [19, 4]].forEach(([x, y]) => put(x, y, "K"));
          [[8, 10], [20, 10]].forEach(([x, y]) => put(x, y, "J")); put(27, 11, "P"); put(12, 6, "C");
          [[12, 3], [17, 3], [11, 13], [18, 13], [7, 19], [21, 19]].forEach(([x, y]) => put(x, y, "l"));
          put(16, 9, "n"); put(3, 12, "b"); put(9, 20, "s"); [[26, 13], [6, 11], [24, 11]].forEach(([x, y]) => put(x, y, "K"));
        },
        decor(g, cx, cy, d) { const s = S(), on = s >= 2 && s <= 3, bl = on && Math.floor(Date.now() / 450) % 2; H.plaque(g, on ? "▶ LIVELLO: SENTIERO ▲" : "SENTIERO ▲", d.X(14) + 16, d.Y(3) + 2, bl ? "#fef08a" : "#e0f2fe"); if (on) { g.save(); g.globalAlpha = 0.35 + 0.35 * Math.abs(Math.sin(Date.now() / 300)); g.strokeStyle = "#fde047"; g.lineWidth = 2; g.strokeRect(d.X(14) - 2, d.Y(2) - 2, 36, 20); g.restore(); } H.plaque(g, "BAR STAMBECCO", d.X(5) + 8, d.Y(4) - 6, s === 0 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#bbf7d0"); H.plaque(g, "BAITA BRINA", d.X(23) + 8, d.Y(4) - 6, s === 1 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#fed7aa"); H.plaque(g, "CHIESA", d.X(4) + 8, d.Y(14) - 6, "#e2e8f0"); H.plaque(g, "🔥 BRACIERE", d.X(15), d.Y(11) - 10, "#fdba74"); }
      },
      gn_bar: {
        interior: true, region: "bar", name: "Il Bar Stambecco", short: "Bar", sub: "Vin brulè, foto vecchie e una vetrina vuota", bg: "gn_bar", w: 16, h: 11, start: [8, 9], outside: ["gn_paese", 5, 9], base: "Y",
        act: { A: "Guarda la vetrina", N: "Guarda il bancone", R: "Guarda le foto", O: "Scaldati alla stufa", T: "Guarda il tavolo", b: "Siediti", W: "Guarda la finestra" },
        flavor: { A: "La vetrina vuota. Il vetro è incrinato, la targhetta intatta: «COPPA DELLE VETTE 1979». Sul fondo, un ciuffo di pelo bianco, morbidissimo.", N: "Il bancone del bar: macchina del caffè che sbuffa, pentola del brulè, e un barattolo con scritto «MANCE PER LA NUOVA COPPA».", R: "Foto e gagliardetti degli Stambecchi. Nella foto del '79, un ragazzo in fondo ha la faccia grattata via. Qualcuno l'ha fatto con l'unghia, tanto tempo fa.", O: "Una stufa di ghisa rossa di fuoco. Ci si asciugano i guanti e le opinioni.", T: "Un tavolo con le carte da briscola lasciate a metà. Chi stava vincendo è uscito a cercare la Coppa.", b: "Una panca di larice consumata da tre generazioni di pantaloni da sci.", W: "Dalla finestra, la piazza col braciere e il bosco. Sopra il bosco, la Vetta, che stasera fuma come una pentola." },
        npcs: () => [{ id: "gn_tecla", at: [4, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(2, 2, 7, 2, "N"); [[9, 0], [10, 0], [11, 0], [13, 0]].forEach(([x, y]) => put(x, y, "R")); put(12, 3, "A"); put(1, 6, "O"); put(6, 0, "W");
          put(10, 6, "T"); put(10, 7, "T"); put(4, 7, "T"); [[9, 7], [11, 7], [3, 8], [5, 8]].forEach(([x, y]) => put(x, y, "b"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "BAR STAMBECCO", d.X(8) + 8, d.Y(0) + 6, "#bbf7d0"); H.plaque(g, "1979", d.X(12) + 8, d.Y(3) - 12, "#fde68a"); }
      },
      gn_casa: {
        interior: true, region: "casa", name: "La baita di Olmo", short: "Baita Brina", sub: "Stube calda, tende tirate, una radiolina", bg: "gn_casa", w: 16, h: 11, start: [8, 9], outside: ["gn_paese", 23, 9], base: "Y",
        act: { O: "Scaldati alla stufa", R: "Guarda le foto", B: "Guarda il letto", L: "Guarda la libreria", T: "Guarda il tavolo", W: "Guarda la finestra", x: "Apri il baule", b: "Siediti" },
        flavor: { O: "La stufa a olle verdi, la stube. Ci dorme sopra un gatto che si chiama Portiere, perché non si muove mai.", R: "Il rigore del '79 incorniciato: Olmo in volo, la palla sul palo. Sotto, a matita, una parola: «quasi».", B: "Un letto con la coperta a quadri e, sotto, un paio di scarpe da calcio coi tacchetti di ferro.", L: "Libri di montagna, almanacchi del calcio e una Bibbia che fa da fermaporta.", T: "Il tavolo con la radiolina, una tazza e un mazzo di carte. Il solitario è a metà: Olmo non lo finisce mai.", W: "La finestra verso la Vetta. La tenda è tirata. Sempre.", b: "La poltrona di Olmo. Non ci si siede nessuno. Neanche il gatto." },
        npcs: () => [{ id: "gn_olmo", at: [6, 5] }],
        loot: { "13,2": { id: "gn_cassetta", text: "Nel baule, sotto una coperta di lana e la naftalina: una videocassetta. «FINALE COPPA DELLE VETTE · 1979 · NON CANCELLARE». Il nastro è mangiato a metà.", empty: "Il baule è vuoto. Solo naftalina e un guanto spaiato." } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(4, 4, 9, 7, "U"); put(13, 4, "O"); put(13, 5, "O"); [[3, 0], [4, 0]].forEach(([x, y]) => put(x, y, "R")); put(9, 0, "W"); put(1, 2, "B"); put(1, 3, "B"); put(11, 1, "L"); put(12, 1, "L");
          put(5, 8, "T"); put(13, 2, "x"); put(7, 5, "b");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BAITA BRINA", d.X(8) + 8, d.Y(0) + 6, "#fed7aa"); }
      }
    };
    return {
      n: N, title: "La vetrina vuota", sub: "Una coppa sparita, orme enormi nella neve e i guanti di un vecchio portiere",
      goal, start: "gn_paese", introBg: "gn_titolo", zones, talk,
      obj: {
        "gn_paese:X": () => gate(),
        "gn_paese:M": () => { K.cold.set(K.cold.max); say("voce", "Tendi le mani sul braciere. Il fuoco ti morde le dita, poi le perdona. Il Calore torna pieno."); done(); },
        "gn_bar:O": () => { K.cold.set(K.cold.max); say("voce", "Ti appoggi alla stufa finché il maglione non sa di fumo. Calore pieno."); done(); },
        "gn_casa:O": () => { K.cold.set(K.cold.max); say("voce", "Il gatto Portiere ti fa posto sulla stube. Non è vero: non si muove. Ti scaldi lo stesso."); done(); },
        "gn_bar:A": () => { say("voce", S() < 1 ? "La vetrina della Coppa. Vuota. Il vetro incrinato e un ciuffo di pelo bianco sul fondo. Parla con Tecla." : "La vetrina vuota. Il ciuffo di pelo bianco, alla luce della stufa, sembra quasi argento."); done(); }
      },
      intro: [["voce", "Valdigelo, sopra il Borgo, a un'ora di tornanti. D'inverno ci arriva una corriera al giorno, e la neve resta fino a marzo."], ["voce", "Ti hanno invitato alla Partita della Neve: il paese contro la valle, con la Coppa delle Vette del 1979 in palio, come ogni anno. Solo che stamattina, la Coppa, non c'è più."]]
    };
  }
  boot();
})();
