// js/tifosi-c2.js - «LA NOTTE DEI TIFOSI MORTI» · Capitolo 2: La Tribuna Stampa
// Su in tribuna, fra seggiolini rovesciati e tifosi ospiti seduti al posto dei consiglieri comunali. In sala stampa Rebecca di Telegolfo ha una telecamera
// e niente corrente; al bar dello stadio Franca e Mimmo Sciarpa cantano per farsi coraggio (e qualcuno, fuori, si ferma ad ascoltare). Nel palco VIP, chiuso
// a chiave, il presidente del Valtorta sa da dove viene quel fumogeno. Poi il Megafono della curva ospite sale le scale.
// Zone: la tribuna (34x24: file di seggiolini, corridoi, palco VIP, sala stampa e bar), sala stampa (16x10), bar dello stadio (14x10), più lo stadio con la scala.
(function () {
  "use strict";
  function boot() {
    const E = window.__tifosiCore;
    if (!E || !E.api || !E.api._has || !E.api._has(1) || !window.__tifosiZ) return setTimeout(boot, 120);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__tifosiH(K), Z = window.__tifosiZ, { say, done, wask, ask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("zt_c2", { kind: "acc", label: "Pass stampa di Telegolfo", val: "medaglia", from: "Capitolo 2 di La Notte dei Tifosi Morti" });
    K.lore("l_zt_bellotti", { t: "Bellotti Pirotecnica", d: "La ditta di fuochi d'artificio del Commendator Bellotti, presidente del Valtorta. Fornisce i fumogeni alla curva ospite «a prezzo di favore». Da qualche mese vende anche una linea nuova: VigorVerde, «il fumogeno che dà la carica»." });
    K.lore("l_zt_coro", { t: "Il coro della curva ospite", d: "«Valtorta alé, Valtorta alé, chi non salta un borghigiano è…». I tifosi zombie lo cantano senza fiato, ma a tempo. Se lo canti con loro, si fermano ad ascoltare: per un attimo, sei uno di loro." });

    const goal = (s) => ({
      0: "Qualcuno trasmette dalla tribuna stampa. Sali in cima alla tribuna, a sinistra del palco VIP.",
      1: "Alla telecamera di Rebecca serve corrente. Al bar dello stadio, in cima a destra, c'è chi ha delle pile.",
      2: "Porta le pile a Rebecca, in sala stampa.",
      3: "Il palco VIP, in mezzo alla tribuna, è chiuso a chiave. Bussa al cancelletto: dentro c'è chi sa del fumogeno.",
      4: "Salgono. Parla con Rebecca: è ora dell'Assedio in tribuna.",
      5: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      setStep(N, 5); F.set("zt_c2_done", true);
      const m = K.reward("zt_c2", { coins: 110, cos: "zt_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "La tribuna è vuota, adesso. Seggiolini rovesciati, un megafono che fischia da solo sulla scala centrale."],
        ["zt_gaspare", "[serio] Le uscite si chiudono da fuori. Tutte. Tranne una: il cancello della curva ospite, quello da cui entrano i pullman del Valtorta. Si apre da dentro, con la chiave del loro capo."],
        ["zt_mimmo", "[pensa] Il loro capo è Ringhio. Lo conosco da trent'anni. Ci siamo tirati di tutto, dalle monetine ai cori. La chiave la tiene sotto la curva, nel suo bugigattolo."],
        ["voce", `<b>FINE DEL CAPITOLO 2 · «La Tribuna Stampa»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 3 ti aspetta: la curva ospite, ventimila voci senza fiato, e qualcosa che non si può più aggiustare."]
      ]), () => K.openMain(), "zt_tribuna");
    }
    function notte() {
      say("zt_rebecca", "[serio] Dalla telecamera li vedo salire. Davanti c'è uno grosso col megafono. Urla, e quelli dietro gli vanno dietro.");
      H.run({ title: "La Tribuna", arena: "tribuna", time: 120, mix: ["tifoso", "corridore", "lanciatore", "panzone", "tamburino"], boss: "megafono" }, (r) => {
        F.set("zt_n2", true);
        say("voce", `Il Megafono rotola giù per dodici file di seggiolini e si ferma contro la cabina radio. Il megafono continua a fischiare da solo. Respinti: <b>${r.a || 0}</b>.`);
        say("zt_ernesto", "[sorpreso] Ho benedetto un megafono. Non era nel catechismo. Forse dovrei aggiornarlo.");
        K.say(H.flush(), () => H.bivio(() => fin()));
      });
    }

    const talk = {
      zt_rebecca() {
        if (K.rel.scene("zt_rebecca")) return;
        const s = S();
        if (s === 0) {
          say("zt_rebecca", "[sorpreso] Vivi! Due… cinque… sei! Sei persone vive! Io sono Rebecca Nardi, Telegolfo. Sono qui per un pezzo di colore sul calcio di provincia.");
          say("zt_rebecca", "[serio] La telecamera è collegata al ponte radio del paese. Se riesco a trasmettere, avviso tutti: chiudete le porte, non venite allo stadio. Ma la batteria è morta.");
          say("zt_ernesto", "Io sono Don Ernesto, cappellano. Benedico il campo a inizio stagione. Stasera ho benedetto tre persone, due porte e un estintore. Nessuno ha funzionato.");
          setStep(N, 1); quest("zt_c2", "La Tribuna Stampa", "Pile per la telecamera di Rebecca: prova al bar dello stadio."); return done();
        }
        if (s === 2) {
          say("voce", "Rebecca infila le pile nella telecamera. La spia rossa si accende. Sullo schermo, lo stadio dall'alto: ventimila puntini viola che ondeggiano.");
          say("zt_rebecca", "[serio] Funziona. Prima di andare in onda guarda qui: l'ho trovata sotto la scrivania dell'addetto stampa del Valtorta. Una bolla di consegna.");
          say("voce", "«Bellotti Pirotecnica · Fornitura curva ospite · 40 fumogeni VigorVerde, lotto 7, SPERIMENTALE · omaggio del Presidente».");
          K.learnLore("l_zt_bellotti");
          return wask("Rebecca ha il dito sul pulsante della diretta. «Vado in onda adesso, o aspetto di sapere tutto?»", [
            { label: "🤝 «Adesso. Che il paese chiuda le porte.»", big: true, w: { squadra: 2 }, fn: () => { F.set("zt_diretta", true); say("zt_rebecca", "[serio] «Qui Rebecca Nardi per Telegolfo, in diretta dallo Stadio Comunale. Non venite allo stadio. Chiudete le porte. Questo non è uno scherzo, e non è il derby.»"); say("voce", "Dal paese, lontano, una campana comincia a suonare. Poi un'altra. Qualcuno ha sentito."); dopo(); } },
            { label: "🏃 «Aspetta. Prima scopriamo chi è stato.»", big: true, w: { pelle: 2 }, fn: () => { F.set("zt_aspetta", true); say("zt_rebecca", "[pensa] Va bene. Una notizia senza un colpevole è una paura. Con un colpevole è giornalismo. Ma se arriva gente allo stadio, è colpa nostra."); dopo(); } }
          ]);
        }
        if (s === 4 && F.is("zt_n2")) { say("zt_rebecca", "Prima di scendere: hai imparato qualcosa stanotte. Scrivilo da qualche parte. Io lo faccio sempre."); return K.say(H.flush(), () => H.bivio(() => fin())); }
        if (s === 4) {
          return ask("Sul monitor, un tifoso enorme col megafono guida la salita. Dietro, un fiume viola.", [
            { label: "🧟 Si comincia · L'Assedio", sub: "Seconda notte: la tribuna", big: true, fn: notte },
            { label: "🧍 Prima sistemo il Gruppo", sub: "Chi corre con te", fn: () => K.crew.pick(() => K.done(), true) },
            { label: "◂ Un momento", fn: done }
          ]);
        }
        say("zt_rebecca", s === 1 ? "Pile. Stilo, quelle normali. Al bar ci sono sempre: Franca le usa per la radiolina con la partita." : s === 3 ? "[serio] Il palco VIP è chiuso dall'interno. Bellotti c'è: l'ho visto entrare al novantesimo, con una valigetta e la faccia di chi sa." : "Questa è la notte più lunga della mia carriera. Ed è anche la prima."); done();
        function dopo() {
          H.join("zt_rebecca", "Rebecca si mette la telecamera a tracolla."); H.join("zt_ernesto", "Don Ernesto riempie una bottiglietta d'acqua al lavandino e la benedice, per sicurezza.");
          setStep(N, 3); quest("zt_c2c", "Il palco VIP", "Il cancelletto del palco VIP, in mezzo alla tribuna. Dentro c'è Bellotti."); done();
        }
      },
      zt_ernesto() {
        if (K.rel.scene("zt_ernesto")) return;
        say("zt_ernesto", ["[pensa] Ho chiesto un segno. Mi è arrivato un fumogeno verde. Il Signore ha un senso dell'umorismo che non apprezzo sempre.", "In trent'anni ho visto il Borgo retrocedere quattro volte. Questa è peggio, ma di poco.", "[serio] Quelli là fuori erano tifosi. Avevano mogli, figli, abbonamenti. Ricordiamocelo, anche quando li calciamo."][Math.floor(Math.random() * 3)]); done();
      },
      zt_franca() {
        if (K.rel.scene("zt_franca")) return;
        const s = S();
        if (s === 1 && !F.is("zt_pile")) {
          say("zt_franca", "[arrabbiato] Chiuso! Il bar è chiuso! …Ah, siete vivi. Entrate. Caffè? È tutto quello che ho: il frigo l'ha svuotato la curva al primo tempo.");
          say("zt_franca", "Le pile? Quelle della radiolina. Sono trent'anni che ci sento le partite. Stanotte non c'è niente da sentire. Prendile.");
          F.set("zt_pile", true); K.inv.give("zt_caffe");
          say("voce", "Ricevi le pile della radiolina e un <b>Caffè del bar</b> (🎒 Zaino).");
          if (K.crew.has("zt_mimmo")) { setStep(N, 2); quest("zt_c2b", "Corrente", "Porta le pile a Rebecca, in sala stampa."); }
          else say("zt_franca", "E porta via anche Mimmo, già che ci sei. Se canta un'altra volta «Ma il cielo è sempre più blu» lo do agli zombi io.");
          return done();
        }
        say("zt_franca", "Il caffè si prende in piedi, al banco. Anche alla fine del mondo. Soprattutto alla fine del mondo."); done();
      },
      zt_mimmo() {
        if (K.rel.scene("zt_mimmo")) return;
        const s = S();
        if (K.crew.has("zt_mimmo")) { say("zt_mimmo", ["[ride] Quarantacinque sciarpe! Ne ho una per ogni anno. Questa la metto per stanotte: me la ricorderò.", "Lo sai che il coro della promozione del '98 l'ho scritto io? Sul tovagliolo di Franca. Lo tiene ancora incorniciato."][Math.floor(Math.random() * 2)]); return done(); }
        if (s >= 1) {
          say("zt_mimmo", "[felice] Campione! Il nostro dieci! Siediti, stavamo cantando. Se canti, non pensi. Se non pensi, non hai paura. È la regola della curva.");
          say("zt_mimmo", "[pensa] E guarda che ho notato una cosa. Quando abbiamo cantato il loro coro, quello del Valtorta, per prenderli in giro… quelli fuori dalla vetrata si sono fermati. Ad ascoltare. A tempo.");
          return wask("Mimmo ti porge un tovagliolo con le parole del coro del Valtorta. «Te lo insegno? È un tradimento, ma è anche un'arma.»", [
            { label: "🏃 Impari il coro del Valtorta", sub: "Per salvare la pelle si canta tutto", big: true, w: { pelle: 1 }, fn: () => { F.set("zt_coro", true); K.learnLore("l_zt_coro"); say("voce", "«Valtorta alé, Valtorta alé…». Lo canti male, poi meno male, poi bene. Dietro la vetrata, una fila di facce grigie si gira verso di te. Ascoltano."); say("zt_mimmo", "[ride] Bravo. Adesso lavati la bocca col caffè di Franca."); unisci(); } },
            { label: "🤝 «Il Borgo canta il Borgo.»", sub: "Fedeltà prima di tutto", big: true, w: { squadra: 1 }, fn: () => { F.set("zt_coro_no", true); say("zt_mimmo", "[felice] Questo è un tifoso! Allora cantiamo il nostro, e che ci sentano fino al porto!"); unisci(); } }
          ]);
        }
        say("zt_mimmo", "Si canta. Si canta sempre."); done();
        function unisci() { H.join("zt_mimmo", "Mimmo si avvolge tre sciarpe al collo e ti segue."); if (S() === 1 && F.is("zt_pile")) { setStep(N, 2); quest("zt_c2b", "Corrente", "Porta le pile a Rebecca, in sala stampa."); } done(); }
      },
      zt_bellotti() { say("zt_bellotti", "(Il Commendatore è chiuso nel palco VIP. Si parla solo attraverso il cancelletto.)"); done(); }
    };
    // il cancelletto del palco VIP
    function vip() {
      const s = S();
      if (s < 3) { say("voce", "Il cancelletto del palco VIP. Chiuso. Dall'altra parte, qualcuno trattiene il respiro e una bottiglia di spumante."); return done(); }
      if (s === 3) {
        say("zt_bellotti", "[arrabbiato] Andate via! Chiunque siate! Ho un estintore e un avvocato! …Siete vivi? Siete vivi. Bene. Restate dove siete, io resto qui.");
        say("zt_rebecca", "[serio] Commendator Bellotti. Lotto 7, VigorVerde, sperimentale, omaggio del Presidente. Lo vuole commentare per Telegolfo?");
        say("zt_bellotti", "[sorpreso] …Era un additivo! Energetico! Un fumogeno che dà la carica: la curva canta di più, la squadra corre di più. Lo provavamo sugli ultras da tre partite. Nessuno si era mai… rialzato.");
        say("zt_bellotti", "[triste] Avevo anche il lotto 8, quello di prova. Blu. Doveva togliere l'effetto se qualcuno esagerava. È nel furgone della ditta, nel parcheggio. Ma io di qui non esco.");
        F.set("zt_furgone_saputo", true);
        return wask("Il Commendatore piagnucola dietro il cancelletto. Fuori, dalla scala centrale, un megafono comincia a urlare.", [
          { label: "🤝 Forzi il cancelletto e lo porti con voi", sub: "Anche lui è uno che respira", big: true, w: { squadra: 2 }, fn: () => { F.set("zt_bellotti_con", true); say("voce", "Gaspare infila la scopa tra le sbarre e fa leva. Il cancelletto cede. Il Commendatore esce con l'estintore in braccio, come un neonato."); say("zt_gaspare", "[serio] Lei sta dietro. E se tocca un pallone, glielo faccio pagare a prezzo di favore."); dopo(); } },
          { label: "🏃 «Resti col suo fumo, Commendatore.»", sub: "Lo lasciate al palco VIP", big: true, w: { pelle: 2 }, fn: () => { F.set("zt_bellotti_lasciato", true); say("zt_bellotti", "[triste] Mi lasciate? Io pago lo stipendio a mezza curva! …Pagavo."); say("zt_mimmo", "[arrabbiato] La paghi adesso, la curva. Con gli interessi."); dopo(); } }
        ]);
      }
      say("voce", F.is("zt_bellotti_con") ? "Il palco VIP è vuoto. Sul tavolino, una bottiglia di spumante aperta e un biglietto da visita: «Bellotti Pirotecnica · facciamo scintille»." : "Dal palco VIP, la voce del Commendatore: «Sono ancora qui! Se qualcuno passa, io sono ancora qui!»"); done();
      function dopo() { setStep(N, 4); quest("zt_c2d", "Il Megafono", "Salgono dalla scala centrale. Parla con Rebecca: è ora dell'Assedio."); done(); }
    }

    const zones = {
      zt_stadio: Z.stadio(H, () => [], {
        doors: { "16,0": { to: "zt_tribuna", at: [16, 22] }, "17,0": { to: "zt_tribuna", at: [17, 22] } }, extra: [[16, 0, "q"], [17, 0, "q"]],
        intro: [["voce", "Il campo è vuoto, adesso. Solo nebbia, palloni bucati e un tamburo a pancia in su. La scala della tribuna è in alto, in mezzo."]]
      }),
      zt_tribuna: {
        region: "tribuna", name: "La tribuna centrale", short: "Tribuna", sub: "Seggiolini blu, il palco VIP, la sala stampa e il bar", bg: "zt_tribuna", time: "notte", w: 34, h: 24, base: "Y", start: [16, 22], travel: [16, 22],
        items: [[3, 4], [30, 11], [9, 17], [24, 4]], itemCos: "zt_c2",
        areas: [[4, 0, 11, 3, "La sala stampa"], [14, 0, 19, 3, "Il palco VIP"], [22, 0, 29, 3, "Il bar dello stadio"], [0, 0, 33, 23, "La tribuna centrale"]],
        act: { q: "Scendi in campo", n: "Leggi il cartello", s: "Riprendi fiato", z: "Guarda le borse", G: "Bussa al palco VIP" },
        flavor: { n: "«TRIBUNA CENTRALE · SETTORE B · posti numerati». Sotto, a pennarello: «numerati da chi?».", z: "Borse di tifosi lasciate sui seggiolini. Termos, binocoli, una corona del rosario attorcigliata a una sciarpa." },
        loot: { "6,11": { id: "zt_bossolo", text: "Un bossolo verde, rotolato fino in tribuna. «B.P. · VigorVerde · lotto 7».", empty: "Il bossolo l'hai già preso." }, "27,17": { id: "zt_bossolo", text: "Un altro bossolo, incastrato sotto un seggiolino. Ancora tiepido.", empty: "Qui c'era un bossolo. Adesso c'è solo un seggiolino storto." }, "1,15": { id: "zt_rullino", text: "Una scheda di memoria caduta da una macchina fotografica. Sull'etichetta: «Telegolfo · R.N.».", empty: "Non c'è altro, sotto i seggiolini. Solo semi di girasole." } },
        doors: { "16,23": { to: "zt_stadio", at: [16, 5] }, "17,23": { to: "zt_stadio", at: [17, 5] } },
        npcs: () => [],
        intro: [["voce", "La tribuna centrale. Seggiolini blu e bianchi, rovesciati. Su alcuni sono seduti tifosi grigi, composti, come a una prima teatrale."], ["voce", "In cima: la sala stampa a sinistra, col vetro illuminato; il palco VIP in mezzo, buio; il bar a destra, da cui arriva un coro."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 3, "a");
          house(4, 0, 8, 3, { door: [8, 2], roof: "#1e293b", wall: "#334155", chimney: false, enter: { to: "zt_stampa", at: [8, 8] } });
          house(14, 0, 6, 3, { door: [17, 2], roof: "#4c1d95", wall: "#1f2937", chimney: false, enter: "Il palco VIP. Vetri oscurati, una porta blindata. Il cancelletto qui davanti è l'unico modo per farsi sentire." });
          house(22, 0, 8, 3, { door: [26, 2], roof: "#78350f", wall: "#3b2414", chimney: false, enter: { to: "zt_bar", at: [7, 8] } });
          lay(0, 3, 33, 4, "Y"); put(15, 3, "G"); put(30, 3, "n"); put(2, 3, "s");
          // file di seggiolini, con i corridoi
          [[5, 10], [12, 16], [18, 22]].forEach(([a, b]) => lay(2, a, 31, b, "P"));
          lay(0, 5, 1, 22, "Y"); lay(32, 5, 33, 22, "Y"); lay(15, 5, 18, 22, "Y"); lay(0, 11, 33, 11, "Y"); lay(0, 17, 33, 17, "Y"); lay(0, 23, 33, 23, "Y");
          put(6, 11, "V"); put(27, 17, "V"); put(22, 11, "z");
          put(16, 23, "q"); put(17, 23, "q");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow();
          Z.crowd(g, d, f, 2, 5, 14, 10, 13); Z.crowd(g, d, f, 19, 12, 31, 16, 17); Z.crowd(g, d, f, 2, 18, 14, 22, 19); Z.crowd(g, d, f, 19, 5, 31, 10, 23, ["#6d28d9", "#facc15", "#1f5fbf"]);
          H.fog(g, d, f, 34, 24);
          H.plaque(g, "SALA STAMPA", d.X(8), d.Y(0) + 2, "#93c5fd"); H.plaque(g, "PALCO VIP", d.X(17), d.Y(0) + 2, "#c084fc"); H.plaque(g, "BAR", d.X(26), d.Y(0) + 2, "#fde68a"); H.plaque(g, "▾ CAMPO", d.X(17), d.Y(23), "#bef264");
          const v = Math.sin(f / 7); g.fillStyle = `rgba(147,197,253,${0.15 + 0.08 * v})`; g.fillRect(d.X(5), d.Y(1), d.X(11) - d.X(5), 10);
        }
      },
      zt_stampa: {
        interior: true, region: "interno", name: "La sala stampa", short: "Sala stampa", sub: "Scrivanie, monitor, una telecamera e la vetrata sul campo", bg: "zt_stampa", w: 16, h: 10, start: [8, 8], outside: ["zt_tribuna", 8, 3], base: "U",
        act: { T: "Guarda la scrivania", W: "Guarda dalla vetrata", n: "Guarda la telecamera", D: "Guarda l'archivio", z: "Guarda i cavi", L: "Guarda la bacheca" },
        flavor: { T: "Una scrivania con un monitor acceso. Qualcuno ha scritto «ZOMBI?» in un documento. Il cursore lampeggia dopo il punto di domanda.", W: "Dalla vetrata si vede tutto il campo: ventimila puntini viola che ondeggiano a tempo. Da quassù sembra quasi bello.", n: "La telecamera di Telegolfo, sul cavalletto. La spia rossa si accende e si spegne, come un cuore stanco.", D: "L'archivio delle conferenze stampa. Trent'anni di «abbiamo dato tutto» e «il calcio è strano».", z: "Cavi, prolunghe, un caricabatterie senza batteria. Il giornalismo di provincia è fatto di questo.", L: "La bacheca con i risultati della giornata. L'ultimo, a pennarello: «Borgo - Valtorta 1-1 (sospesa per zombi)»." },
        npcs: (s) => [{ id: "zt_rebecca", at: [10, 4] }, { id: "zt_ernesto", at: [4, 6] }].filter((n) => s <= 2 || !K.crew.has(n.id) || s === 4),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 9, "U"); lay(0, 0, 15, 0, "W"); lay(0, 0, 0, 9, "a"); lay(15, 0, 15, 9, "a"); lay(0, 9, 15, 9, "a"); put(8, 9, "v");
          lay(2, 2, 5, 2, "T"); lay(9, 2, 12, 2, "T"); put(12, 5, "n"); put(1, 8, "D"); put(14, 8, "D"); put(14, 3, "z"); put(1, 3, "L");
        },
        decor(g, cx, cy, d) { H.plaque(g, "TELEGOLFO · SALA STAMPA", d.X(8), d.Y(1) + 4, "#93c5fd"); }
      },
      zt_bar: {
        interior: true, region: "interno", name: "Il bar dello stadio", short: "Bar", sub: "Caffè a un euro, panini a tre, cori gratis", bg: "zt_bar", w: 14, h: 10, start: [7, 8], outside: ["zt_tribuna", 26, 3], base: "Y",
        act: { u: "Guarda il bancone", M: "Guarda la macchina del caffè", T: "Guarda il tavolino", D: "Apri il frigo", n: "Leggi il listino", z: "Guarda le casse", b: "Siediti" },
        flavor: { u: "Il bancone. Un panno, un portacenere che nessuno usa dal 2005, una foto della promozione del '98.", T: "Un tavolino coi segni dei bicchieri di trent'anni di dopopartita.", n: "Il listino: «Caffè 1€ · Panino 3€ · Fede gratis». Il prezzo della fede non è mai cambiato.", z: "Casse di bibite vuote. La curva ospite ha avuto sete, al primo tempo.", b: "Una sedia di plastica. Ci si siede per guardare la partita alla tv del bar, con trenta secondi di ritardo." },
        loot: { "12,2": { id: "zt_panino", text: "Nel frigo, dietro le bottiglie vuote, c'è un panino con la porchetta incartato. Sulla stagnola: «MIMMO · NON TOCCARE».", empty: "Il frigo è vuoto. Rimane solo l'eco della porchetta." } },
        npcs: (s) => { const L = [{ id: "zt_franca", at: [5, 3] }]; if (!K.crew.has("zt_mimmo")) L.push({ id: "zt_mimmo", at: [9, 6] }); return L; },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "Y"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(2, 2, 8, 2, "u"); put(3, 1, "M"); put(12, 2, "D"); put(12, 1, "n"); put(1, 6, "z"); put(1, 7, "z");
          [[4, 6], [10, 4], [11, 7]].forEach(([x, y]) => put(x, y, "T")); put(5, 6, "b"); put(9, 7, "b");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); g.fillStyle = "rgba(191,219,254,.8)"; g.font = "8px serif"; for (let i = 0; i < 3; i++) g.fillText("♪", d.X(8) + i * 10 + Math.sin(f / 9 + i) * 3, d.Y(5) - ((f / 2 + i * 15) % 30)); g.restore(); H.plaque(g, "BAR DELLO STADIO · DAL 1994", d.X(7), d.Y(0) + 6, "#fde68a"); }
      }
    };
    return {
      n: N, title: "La Tribuna Stampa", sub: "Una telecamera senza corrente, un bar che canta e un presidente chiuso a chiave",
      goal, start: "zt_tribuna", introBg: "zt_tribuna", zones, talk, obj: { "zt_tribuna:G": () => vip() },
      intro: [["voce", "«…Qui Telegolfo, tribuna stampa.» La voce si spegne in un fischio. Gaspare indica la scala in mezzo alla tribuna."], ["zt_gaspare", "[serio] Su. Ma piano. In tribuna ci sono gli abbonati. E gli abbonati, anche da morti, non vogliono essere disturbati."]]
    };
  }
  boot();
})();
