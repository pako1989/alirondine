// js/gala-c2.js - «IL RAPIMENTO DEL PALLONE D'ORO» · Capitolo 2: La Notte lunga
// Mezzanotte alla villa: biblioteca, studio, cantina, serra, camera di Livia, sala giochi. Interrogatori, avvistamenti, Registro delle Presenze, prove nel Dossier, ping-pong con Zeno.
(function () {
  "use strict";
  // dichiarazioni (alibi) e testimonianze, per persona: [fascia1 Blackout, fascia2 Mezzanotte]
  const CLAIM = {
    pd_delmonte: ["pd_studio", "pd_studio", "Ero nello studio. Solo, a rileggere il discorso del brindisi: l'ho riletto tre volte, e al terzo non convinceva nemmeno me."],
    pd_livia: ["pd_boudoir", "pd_biblioteca", "Salita in camera a mettermi un po' di cipria. Poi, a mezzanotte, ero in biblioteca a leggere: ho gusti noiosi, io."],
    pd_zeno: ["pd_pingpong", "pd_pingpong", "Sala giochi, ovvio: stavo allenando il polso. Quel gioco è l'unico dove vinco senza che mi pagano per perdere."],
    pd_teresa: ["pd_cucina", "pd_cucina", "In cucina, dove sono sempre. Il dolce non si fa da solo, e il Presidente non perdona un cannolo molle."],
    pd_arturo: ["pd_cucina", "pd_cucina", "Ero in cucina, signore, ad aiutare la signora Teresa con i vassoi. Un maggiordomo non lascia la casa quando le luci si spengono."],
    pd_clio: ["pd_serra", "pd_giardino", "In serra, a prendere aria. A mezzanotte in giardino, a prenderne di più: cosa vuole, sono una giornalista inquieta."],
    pd_gualtiero: ["pd_giardino", "pd_biblioteca", "In giardino: ho visto il ponte cedere con questi occhi. Poi mi sono rifugiato in biblioteca a leggere i quotidiani del 1998."],
    pd_ospite: ["pd_giardino", "pd_salone", "In giardino, a prendere aria. Poi, a mezzanotte, nel salone: c'è un pianoforte e sono sentimentale."]
  };
  // testimoni: chi dice di aver visto chi, in quale stanza, in quale fascia (1 = Blackout)
  const REPORT = {
    pd_teresa: [["pd_arturo", 1, "pd_cantina", "Arturo è sceso in cantina con una lanterna: l'ho visto passare davanti al passavivande, e non mi ha neanche salutata."], ["pd_delmonte", 1, "pd_cantina", "E il Presidente? Gli ho visto girare l'angolo verso la cantina, con quella faccia di chi ha dimenticato la password di una banca."]],
    pd_clio: [["pd_zeno", 1, "pd_serra", "Zeno era in serra, con me. Non faccia quella faccia: parlavamo. Più o meno."], ["pd_livia", 1, "pd_biblioteca", "Livia? Ho incrociato un ventaglio che sgusciava in biblioteca, mentre uscivo. Il ventaglio era dietro la porta, la signora dentro."]],
    pd_ospite: [["pd_gualtiero", 1, "pd_studio", "Dal giardino ho visto una luce accesa nello studio del Presidente: un uomo rovistava tra i cassetti. Era il signor Gualtiero, senza dubbio."]]
  };
  const BALL = {
    pd_delmonte: "Il Pallone? Dodici anni di vetrina. Se l'ha preso qualcuno, ha preso la mia reputazione. Non le basta questo, come movente per chiunque?",
    pd_livia: "Mio marito ama quel pallone come altri amano un cane. Io, un cane lo accetterei.",
    pd_zeno: "L'ho vinto io, il Pallone d'Oro. Lui lo tiene sotto vetro per dire che l'ha vinto lui.",
    pd_teresa: "Io il Pallone non l'ho mai toccato. Ho toccato solo il suo dolce, e quello è sparito presto.",
    pd_arturo: "Ho spolverato quella vetrina ogni mattina per dodici anni. Ho sempre avuto l'impressione che il Pallone fosse più leggero di quanto dovrebbe.",
    pd_clio: "Il Pallone d'Oro non vale quanto la storia che gli gira attorno: scrivo il pezzo mentre indago.",
    pd_gualtiero: "Quel pallone l'ho comprato io, con i soldi della società. Lui l'ha messo in vetrina e ha scritto il suo nome sopra.",
    pd_ospite: "Un pallone d'oro. Strano che un oggetto così prezioso sia in una vetrina di vetro e non in una cassaforte."
  };
  function boot() {
    const E = window.__galaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__galaH || !window.__pingpong) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  // l'interrogatorio vale anche nel capitolo 3: lo mettiamo a disposizione
  window.__galaIv = (K, H, extra) => {
    const { say, done, ask } = H, F = K.F, PL = window.__galaPeople;
    return (id) => {
      if (K.rel.scene(id)) return;
      const c = CLAIM[id], rp = REPORT[id], first = !F.is("pd_iv_" + id); F.set("pd_iv_" + id, true);
      if (first) { K.rel.add(id, 2, true); K.bond("garbo", 1); }
      const opts = [{ label: "🕯️ Dov'eri quando si sono spente le luci?", sub: "Registra la sua dichiarazione", big: true, cls: "hot", fn: () => {
        K.alibi.claim(id, 1, c[0]); K.alibi.claim(id, 2, c[1]); say(id, "[serio] " + c[2]); say("voce", "Annotato nel Registro delle Presenze."); done();
      } }];
      if (rp) opts.push({ label: "👁️ Hai visto qualcuno, in quel momento?", sub: id === "pd_ospite" ? "Chiede Intuito 30" : id === "pd_teresa" ? "Chiede Garbo 20" : "Una testimonianza", disabled: (id === "pd_ospite" && K.stat("intuito") < 30) || (id === "pd_teresa" && K.stat("garbo") < 20), fn: () => {
        rp.forEach((r) => { K.alibi.see(r[0], r[2], r[1]); say(id, "[pensa] " + r[3]); }); say("voce", "Annotato nel Registro delle Presenze."); if (!F.is("pd_rp_" + id)) { F.set("pd_rp_" + id, true); K.bond("intuito", 3); } done();
      } });
      opts.push({ label: "🏆 Parlami del Pallone", sub: "Un'impressione", fn: () => { say(id, "[pensa] " + BALL[id]); done(); } });
      (extra && extra[id] ? extra[id](opts) : []).forEach((o) => opts.push(o));
      opts.push({ label: "Basta così", fn: done });
      ask(PL[id] + " ti ascolta, col sopracciglio sospeso.", opts);
    };
  };
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__galaH(K), { say, done, ask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("pd_c2", { kind: "shirt", label: "Giacca da indagatore", val: "#a16207", from: "Capitolo 2 di Il Rapimento del Pallone d'Oro" });
    K.lore("l_cantina", { t: "La Cantina", d: "Scale di pietra, botti, due porte: una dalla cucina e una dalla botola in giardino. Chi ci va lascia orme, e un odore di cera." });
    const found = () => K.alibi.found(), nd = () => K.dossier.list("pallone").length;
    const goal = (s) => K.stepOf(N) >= 9 || F.is("pd_c2_done") ? "Il capitolo 2 è concluso." : `Indaga in tutta la villa. Registro: ${found()} contraddizioni · Dossier: ${nd()}/5 prove. Con quattro contraddizioni e tre prove parla col Presidente, nello studio.`;
    function fin() {
      F.set("pd_c2_done", true);
      K.reward("pd_c2", { coins: 110, cos: "pd_c2" });
      K.finishChapter(N, "ok");
      K.clock.set(K.clock.day(), 3);
      K.scene(H.flush().concat([["voce", `<b>FINE DEL CAPITOLO 2.</b><br>🔎 Intuito ${K.stat("intuito")} · Contraddizioni ${found()} · Prove ${nd()}`], ["voce", "Il Capitolo 3, «L'Alba», ti aspetta: tutti riuniti nel salone."]]), () => K.openMain(), "pd_salone");
    }
    const ext = {
      pd_teresa: (o) => [{ label: "🗝️ Chiedi la chiave della cantina", sub: K.inv.has("pd_chiave") ? "Già con te" : "Chiede Garbo 22", disabled: K.inv.has("pd_chiave") || K.stat("garbo") < 22, fn: () => { K.inv.give("pd_chiave"); K.dossier.add("pallone", "chiave"); K.bond("intuito", 3); K.learnLore("l_cantina"); say("pd_teresa", "[serio] La cantina. Non so cosa cerchi, ma stasera qualcuno l'ha usata più del solito. Prendi, e non farmelo dire due volte."); done(); } }],
      pd_zeno: (o) => [{ label: "🏓 Sfida a ping-pong", sub: F.is("pd_pp_won") ? "Già battuto" : "Livello 2 · il gettone aiuta", disabled: F.is("pd_pp_won"), fn: () => {
        say("pd_zeno", "[ride] Una partita? Con quello stile da campione stanco? D'accordo. Fino a sette. Se vinci, ti dico la verità. Se perdi, ti dico la mia.");
        H.play(2, "Zeno Bassi", "Ping-Pong da Salone", (r) => {
          if (r && r.win) { F.set("pd_pp_won", true); K.bond("intuito", 5); K.rel.add("pd_zeno", 6, true); say("pd_zeno", "[arrabbiato] Va bene, va bene. Ero in serra con Clio: ci stavamo scambiando consigli sul giornalismo sportivo e un po' di fiato corto. Non lo dica al Presidente: ha il senso dell'umorismo di un contratto."); }
          else say("pd_zeno", "[ride] Sette a qualcosa. Vedi, il campione è ancora uno: io. Riprova quando vuoi."); done();
        });
      } }],
      pd_livia: (o) => [{ label: "✉️ Mostra la lettera trovata in biblioteca", sub: K.inv.has("pd_lettera") ? "Una scelta pesante" : "Non l'hai ancora trovata", disabled: !K.inv.has("pd_lettera") || F.is("pd_livia_conf"), fn: () => {
        F.set("pd_livia_conf", true); K.dossier.add("pallone", "ricevuta"); K.bond("intuito", 5); K.rel.add("pd_livia", 8, true);
        say("pd_livia", "[serio] ...L'ha trovata. Va bene. Tre mesi fa mio marito ha venduto il Pallone d'Oro a un collezionista. Il vero. Quello in vetrina è una copia, e nessuno se n'è accorto per tre mesi.");
        say("pd_livia", "Ho trovato la ricevuta nel cassetto. Ho scritto a un avvocato, poi ho strappato la lettera a metà, poi l'ho rimessa nel libro. Se parlo, perdo tutto. Se non parlo, perdo me stessa. Le ho dato la scelta: scelga lei.");
        say("voce", "Hai nel Dossier la <b>ricevuta di vendita</b>. Il Pallone era già venduto prima del blackout."); done();
      } }]
    };
    const iv = window.__galaIv(K, H, ext);
    const talk = {};
    Object.keys(CLAIM).forEach((id) => { talk[id] = () => iv(id); });
    talk.pd_delmonte = () => {
      if (K.rel.scene("pd_delmonte")) return;
      const ok = found() >= 4 && nd() >= 3;
      const o = [
        { label: "🕯️ Dov'eri quando si sono spente le luci?", sub: "Registra la sua dichiarazione", fn: () => { K.alibi.claim("pd_delmonte", 1, CLAIM.pd_delmonte[0]); K.alibi.claim("pd_delmonte", 2, CLAIM.pd_delmonte[1]); say("pd_delmonte", "[serio] " + CLAIM.pd_delmonte[2]); say("voce", "Annotato nel Registro delle Presenze."); done(); } },
        { label: "🏆 Parlami del Pallone", fn: () => { say("pd_delmonte", "[pensa] " + BALL.pd_delmonte); done(); } },
        { label: "📋 «Sono pronto: convoca tutti nel salone»", sub: ok ? "Chiude il capitolo" : `Servono 4 contraddizioni (${found()}) e 3 prove (${nd()})`, disabled: !ok, big: ok, cls: ok ? "hot" : "", fn: () => { say("pd_delmonte", "[serio] Ha tutto, allora. Faccio svegliare la casa: all'alba, nel salone. E mi guardi in faccia, quando parlerà: è il minimo."); fin(); } },
        { label: "Basta così", fn: done }
      ];
      ask("Il Presidente ti guarda dal suo studio, le mani intrecciate sulla scrivania.", o);
    };
    const hackObj = {};
    const zones = {
      pd_biblioteca: {
        interior: true, region: "biblioteca", name: "Villa Delmonte · La Biblioteca", short: "Biblioteca", sub: "Cinquemila libri, una scala a pioli e un camino che non si spegne mai", bg: "pd_biblioteca", w: 18, h: 14, start: [16, 7], outside: ["pd_salone", 1, 8],
        act: { L: "Guarda gli scaffali", H: "Guarda il camino", Z: "Guarda il tavolo", U: "Guarda la poltrona", O: "Guarda la statua", A: "Guarda la pianta", s: "Siediti un momento" },
        flavor: { H: "Il camino scoppietta, con una cenere sottile che sa di carta bruciata. Qualcuno ha fatto un lavoro in fretta e non l'ha fatto bene.", Z: "Un grande tavolo di lettura: libri aperti, un calamaio, un occhiale appoggiato su una pagina.", U: "Una poltrona di cuoio con l'incavo di chi ha passato qui molte ore. Un ventaglio dimenticato sul bracciolo.", O: "Una statua d'erudito: una pergamena in mano, uno sguardo di chi sa di aver ragione.", A: "Una felce in vaso, immobile, più morta che viva." },
        objects: {
          "13,4": () => {
            if (K.inv.has("pd_lettera")) { say("voce", "Lo scaffale dove hai trovato la lettera: adesso c'è solo uno spazio tra due libri, e un'impronta di polvere."); return done(); }
            if (K.stat("intuito") < 25) { say("voce", "Gli scaffali sono troppi, e tutti uguali. Forse, con più occhio, qualche libro stonerebbe. (Serve Intuito 25.)"); return done(); }
            K.inv.give("pd_lettera"); K.dossier.add("pallone", "lettera"); K.bond("intuito", 3);
            say("voce", "Uno dei libri sporge di un dito dagli altri. Dentro, una lettera piegata in quattro, strappata a metà e rimessa insieme con il nastro adesivo: «Egregio avvocato, mio marito ha venduto il Pallone d'Oro...». La firma è di Livia."); done();
          }
        },
        doors: { "17,7": { to: "pd_salone", at: [1, 8] } },
        npcs: () => H.crowd("pd_biblioteca"),
        spots: [[6, 8], [11, 8], [4, 10]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 13, "b"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 13, "a"); lay(17, 0, 17, 13, "a"); lay(0, 13, 17, 13, "a"); put(17, 7, "q");
          lay(1, 2, 8, 2, "L"); lay(10, 2, 16, 2, "L"); put(9, 2, "H"); lay(3, 4, 6, 4, "L"); lay(11, 4, 14, 4, "L"); lay(1, 11, 5, 11, "L");
          lay(8, 6, 10, 6, "Z"); put(7, 6, "U"); put(11, 6, "U"); put(2, 7, "O"); put(15, 11, "A"); put(15, 8, "U"); put(2, 12, "A");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BIBLIOTECA", d.X(9) + 8, d.Y(1) + 4, "#a78bfa"); }
      },
      pd_studio: {
        interior: true, region: "studio", name: "Villa Delmonte · Lo Studio del Presidente", short: "Studio", sub: "Scrivania di quercia, una cassaforte a muro e le foto di dodici anni di trofei", bg: "pd_biblioteca", w: 16, h: 12, start: [8, 9], outside: ["pd_salone", 8, 2],
        act: { Z: "Guarda la scrivania", L: "Guarda la libreria", D: "Guarda la cassaforte", H: "Guarda il camino", W: "Guarda la foto", U: "Guarda la poltrona", A: "Guarda la pianta", s: "Siediti un momento" },
        flavor: { L: "Una libreria con trofei, coppe, medaglie. Ogni oggetto è stato lucidato con lo stesso panno: uno solo è più opaco degli altri.", D: "Una cassaforte a muro. Ha una combinazione a quattro cifre e una scritta incisa: «Mai la data di nascita». Qualcuno ha ignorato il consiglio.", H: "Un camino spento. Nel focolare, polvere di carta bruciata e un fermacarte con le iniziali del Presidente.", W: "Una foto di squadra: il Presidente stringe il Pallone d'Oro. È sorridente ma ha una mano nascosta, come se stringesse altro.", U: "Una poltrona dove si ricevono i contratti. Il bracciolo conserva il ricordo di una penna infilata a tradimento.", A: "Una pianta di limoni, ostinata e potata male." },
        objects: {
          "8,4": () => {
            if (K.inv.has("pd_polizza")) { say("voce", "Il cassetto da cui hai preso la polizza: adesso è semivuoto, con un segno di polvere dove stava la cartellina."); return done(); }
            const present = window.__galaWho("pd_studio", K.clock.slot()).includes("pd_delmonte");
            if (present && K.stat("garbo") < 25) { say("voce", "Il Presidente è lì, a due passi, e guarda ogni tuo movimento. Per frugare nei cassetti servirebbe distrarlo, magari con un po' di garbo. (Serve Garbo 25.)"); return done(); }
            K.inv.give("pd_polizza"); K.dossier.add("pallone", "polizza"); K.bond("intuito", 3);
            say("voce", present ? "Gli chiedi di raccontarti la storia della foto di squadra: lui si volta, gesticola, e tu leggi in fondo al cassetto: «Polizza di assicurazione, Pallone d'Oro, copertura triplicata, trenta giorni fa». Beneficiario: Delmonte." : "Nel cassetto, sotto una pila di contratti, una cartellina: «Polizza di assicurazione, Pallone d'Oro, copertura triplicata, trenta giorni fa». Beneficiario: Delmonte."); done();
          }
        },
        doors: { "8,11": { to: "pd_salone", at: [8, 2] } },
        npcs: () => H.crowd("pd_studio"),
        spots: [[6, 7], [10, 7]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "l"); lay(4, 4, 11, 8, "t"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          lay(1, 2, 5, 2, "L"); lay(10, 2, 14, 2, "L"); put(8, 2, "D"); lay(7, 4, 9, 4, "Z"); put(1, 6, "U"); put(14, 6, "U"); put(2, 9, "A"); put(13, 9, "A"); put(7, 2, "W"); put(9, 2, "W"); put(14, 8, "H");
        },
        decor(g, cx, cy, d) { H.plaque(g, "STUDIO DEL PRESIDENTE", d.X(8) + 8, d.Y(1) + 4, "#fbbf24"); }
      },
      pd_cantina: {
        interior: true, region: "cantina", name: "Villa Delmonte · La Cantina", short: "Cantina", sub: "Botti, volte di pietra e una lanterna ancora tiepida", bg: "pd_cantina", w: 20, h: 12, start: [10, 10], outside: ["pd_giardino", 33, 11],
        act: { R: "Guarda le botti", O: "Guarda la statua", A: "Guarda la pianta", D: "Guarda lo scaffale", s: "Siediti un momento" },
        flavor: { O: "Una statua di cantiniere, un uomo di pietra con un calice in mano: nessuno gliel'ha mai riempito.", D: "Uno scaffale di bottiglie con la polvere in ordine: tranne due, spolverate di recente.", A: "Una pianta senza luce, con un'ostinata speranza." },
        objects: {
          "15,2": () => {
            if (K.inv.has("pd_replica")) { say("voce", "La botte vuota con il doppio fondo: adesso è davvero vuota."); return done(); }
            K.inv.give("pd_replica"); K.dossier.add("pallone", "replica"); K.bond("intuito", 4);
            say("voce", "Una botte con un doppio fondo, appena rimosso: dentro, un Pallone d'Oro. Troppo leggero, cuciture troppo nuove, la scritta «Delmonte» che si stacca a una sfregatina. È una copia."); done();
          }
        },
        doors: { "10,11": { to: "pd_giardino", at: [33, 11] } },
        npcs: () => H.crowd("pd_cantina"),
        spots: [[8, 6], [12, 6]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 11, "w"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 11, "a"); lay(19, 0, 19, 11, "a"); lay(0, 11, 19, 11, "a"); put(10, 11, "v");
          lay(2, 2, 7, 2, "R"); lay(12, 2, 17, 2, "R"); put(15, 2, "R"); lay(2, 4, 3, 4, "R"); lay(16, 4, 17, 4, "R"); lay(2, 8, 4, 8, "R"); lay(15, 8, 17, 8, "R"); put(9, 3, "O"); put(9, 7, "D"); put(10, 7, "D"); put(1, 5, "A");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CANTINA", d.X(10) + 8, d.Y(1) + 4, "#fb923c"); }
      },
      pd_serra: {
        interior: true, region: "serra", name: "Villa Delmonte · La Serra", short: "Serra", sub: "Vetrate sulla tempesta, piante che sudano e due calici ancora pieni", bg: "pd_giardino", w: 18, h: 12, start: [9, 10], outside: ["pd_giardino", 4, 6],
        act: { A: "Guarda le piante", T: "Guarda il tavolino", U: "Guarda la panca", O: "Guarda la statua", F: "Guarda la fontanella", s: "Siediti un momento" },
        flavor: { A: "Piante tropicali in vaso, umide e fiere: una ha una foglia piegata a V, come se qualcuno l'avesse sfiorata passando.", U: "Una panca in ferro battuto, con un cuscino ancora tiepido.", O: "Una statuetta di ninfa: qualcuno le ha appoggiato un cappotto sulla spalla.", F: "Una fontanella a conchiglia: l'acqua scende piano, come una confidenza." },
        objects: {
          "13,6": () => {
            if (F.is("pd_serra_cl")) { say("voce", "Il tavolino con i due calici. Nessun'altra novità."); return done(); }
            F.set("pd_serra_cl", true); K.bond("intuito", 3);
            say("voce", "Sul tavolino, due calici di champagne, uno con un segno di rossetto e uno con un anello d'orologio. Sotto, un biglietto: «Domani lo dico a tutti. — Z.» La scrittura è di Zeno."); done();
          }
        },
        doors: { "9,11": { to: "pd_giardino", at: [4, 6] } },
        npcs: () => H.crowd("pd_serra"),
        spots: [[5, 6], [12, 5]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 11, "v"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 11, "a"); lay(17, 0, 17, 11, "a"); lay(0, 11, 17, 11, "a"); put(9, 11, "v");
          [2, 5, 8, 11, 14].forEach((x) => put(x, 2, "A")); put(1, 4, "A"); put(1, 8, "A"); put(16, 4, "A"); put(16, 8, "A"); put(13, 6, "T"); put(14, 6, "U"); put(12, 6, "U"); put(3, 5, "A"); put(8, 4, "F"); put(5, 9, "O");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SERRA", d.X(9) + 8, d.Y(1) + 4, "#86efac"); }
      },
      pd_boudoir: {
        interior: true, region: "boudoir", name: "Villa Delmonte · La Camera di Livia", short: "Camera di Livia", sub: "Moquette rosa, un letto a baldacchino e un profumo che non si lascia trascurare", bg: "pd_salone", w: 14, h: 11, start: [7, 8], outside: ["pd_salone", 16, 2],
        act: { B: "Guarda il letto", D: "Guarda il comò", W: "Guarda il quadro", U: "Guarda il divano", A: "Guarda la pianta", H: "Guarda il camino", s: "Siediti un momento" },
        flavor: { B: "Un letto a baldacchino con una coperta rosa, perfettamente tesa. Nessuno ci ha dormito, o chi ci ha dormito ha avuto cura di non lasciarlo capire.", D: "Un comò con flaconi di profumo e una scatola di ventagli: manca quello dalla stecca azzurra.", W: "Un quadro di una donna con un ventaglio: il volto è lo stesso di Livia, ma con un'espressione più serena.", U: "Un divano rosa con un cuscino ricamato: «Il sorriso è una pratica quotidiana».", A: "Una pianta di orchidee, miracolosamente viva.", H: "Un caminetto elegante, con la griglia lucida e un ventaglio rotto appoggiato in un vaso." },
        doors: { "7,10": { to: "pd_salone", at: [16, 2] } },
        npcs: () => H.crowd("pd_boudoir"),
        spots: [[4, 6], [9, 6]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 10, "m"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 10, "a"); lay(13, 0, 13, 10, "a"); lay(0, 10, 13, 10, "a"); put(7, 10, "v");
          lay(2, 2, 3, 2, "B"); lay(2, 3, 3, 3, "B"); lay(9, 2, 11, 2, "D"); put(7, 1, "W"); put(12, 6, "U"); put(1, 6, "U"); put(1, 8, "A"); put(12, 8, "A"); put(6, 2, "H");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CAMERA DI LIVIA", d.X(7) + 8, d.Y(1) + 4, "#f9a8d4"); }
      },
      pd_pingpong: {
        interior: true, region: "pingpong", name: "Villa Delmonte · La Sala Giochi", short: "Sala giochi", sub: "Due tavoli da ping-pong, un bersaglio e l'odore di una sconfitta onorevole", bg: "pd_salone", w: 16, h: 11, start: [14, 8], outside: ["pd_salone", 1, 12],
        act: { Y: "Guarda il tavolo da ping-pong", W: "Guarda il bersaglio", U: "Guarda la panca", A: "Guarda la pianta", s: "Siediti un momento" },
        flavor: { Y: "Un tavolo da ping-pong con la rete tesa e una pallina che ha rimbalzato fino a cadere in un angolo. Una racchetta ha un nastro azzurro: è del Presidente.", W: "Un bersaglio per le freccette: la maggior parte dei centri è di Zeno. Uno, molto al limite, è di un'altra mano.", U: "Una panca con un asciugamano, un bicchiere vuoto e una medaglia dimenticata.", A: "Una pianta pallida, in un angolo che non ha mai visto un raggio di sole." },
        doors: { "15,8": { to: "pd_salone", at: [1, 12] } },
        npcs: () => H.crowd("pd_pingpong"),
        spots: [[10, 5], [11, 7]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "l"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(15, 8, "q");
          lay(3, 4, 6, 4, "Y"); lay(3, 7, 6, 7, "Y"); [3, 8, 12].forEach((x) => put(x, 1, "W")); put(1, 3, "U"); put(1, 9, "U"); put(14, 3, "A"); put(8, 1, "W");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALA GIOCHI", d.X(8) + 8, d.Y(1) + 4, "#4ade80"); }
      }
    };
    return {
      n: N, title: "La Notte lunga", sub: "Interrogatori e Registro",
      goal, start: "pd_salone", introBg: "pd_salone", zones, talk, obj: {},
      intro: [["voce", "Mezzanotte. La tempesta si è calmata e la villa è tornata a un silenzio educato, di quelli che nascondono pensieri ad alta voce."], ["pd_delmonte", "[serio] Indaga. Parla con tutti, vai dove vuoi. Io ho un segreto solo, e non è questo."]]
    };
  }
  boot();
})();
