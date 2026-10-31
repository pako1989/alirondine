// js/tifosi-c4.js - «LA NOTTE DEI TIFOSI MORTI» · Capitolo 4: L'Alba
// Il parcheggio dello stadio, l'ultima ora prima del sole. Il pullman del Borgo ha la batteria a terra e Nello, l'autista, dorme da prima della partita.
// I cavi sono nel furgone della Bellotti Pirotecnica, insieme a dieci casse uguali: in una c'è il fumo blu. Poi arriva Valtortino, la mascotte, con tutto il resto
// della curva. E all'alba si sceglie come finisce.
// Zone: il parcheggio (36x26: file di auto, pullman, lampioni, biglietteria, il furgone), il pullman del Borgo (16x8), il furgone della Bellotti (12x8).
(function () {
  "use strict";
  function boot() {
    const E = window.__tifosiCore;
    if (!E || !E.api || !E.api._has || !E.api._has(3) || !window.__tifosiZ) return setTimeout(boot, 120);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__tifosiH(K), Z = window.__tifosiZ, { say, done, wask, ask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("zt_c4", { kind: "acc", label: "Fumogeno blu (spento)", val: "medaglia", from: "Finale di La Notte dei Tifosi Morti" });
    K.lore("l_zt_lotto8", { t: "Il lotto 8", d: "Fumogeno sperimentale blu della Bellotti Pirotecnica. Doveva «spegnere la carica» del VigorVerde se qualcuno esagerava. Mai provato su nessuno. Sulla cassa, a pennarello: «non si sa mai»." });
    const bossoli = () => K.inv.count("zt_bossolo");
    const segreto = () => bossoli() >= 8 && F.is("zt_blu") && F.is("zt_diretta") && F.is("zt_pippo_attesa");

    const goal = (s) => ({
      0: "Il parcheggio. Gaspare è vicino alla biglietteria: parla con lui.",
      1: "Il pullman del Borgo è in fondo a destra. Sali e sveglia Nello, l'autista.",
      2: "Servono i cavi per la batteria. Il furgone della Bellotti Pirotecnica è in alto a sinistra, vicino alla sbarra.",
      3: "Hai i cavi. Torna da Nello, sul pullman: la batteria deve caricare, e loro stanno arrivando.",
      4: "È l'alba. Parla con Gaspare davanti al pullman: si decide come finisce.",
      5: "Fine."
    }[s] || "La Notte dei Tifosi Morti è conclusa.");

    // i finali
    const ENDS = {
      pullman: { coins: 400, bg: "zt_alba", lines: () => [
        ["voce", "Il pullman del Borgo Marino esce dal parcheggio sfondando la sbarra. Il sole sorge dietro le gru del porto. A bordo siete sporchi di verde, stanchi, vivi."],
        ["zt_mimmo", "[felice] «Borgo Marino alé…» Dai, tutti! Anche lei, Don Ernesto!"],
        ["zt_ernesto", "[ride] Io canto solo in chiesa. …«Borgo Marino alé…»"],
        F.is("zt_pippo_attesa") ? ["voce", "Nello frena davanti al cancello della curva. Gaspare scende, gira la chiave del bugigattolo. Dopo un minuto lungo come un tempo supplementare, risale da solo. Non dice niente. Si siede in fondo, con la radiolina di Franca in mano, accesa."] : ["voce", "Passando davanti alla curva, nessuno guarda dal finestrino. Poi Gaspare sì. Alza la mano, come si fa con un compagno che esce dal campo."],
        ["zt_rebecca", "[serio] «Qui Telegolfo. Lo Stadio Comunale è chiuso. Il paese è salvo. Questa notte ha un responsabile, e domani avrà anche un nome in prima pagina.»"],
        ["zt_nello", "[ride] Chi vomita, vomita fuori. Il pullman l'ho appena lavato."]
      ] },
      magazziniere: { coins: 380, bg: "zt_alba", lines: () => [
        ["voce", "Il pullman è pronto. Il cancello della curva deve chiudersi da dentro, o la curva vi segue fino al paese. Qualcuno deve restare."],
        ["zt_gaspare", "[serio] Trent'anni che chiudo io lo stadio. Spengo le luci, conto i palloni, giro la chiave. Stanotte non cambia niente."],
        ["zt_gaspare", "[ride] E poi qualcuno deve contare i palloni. Ne mancano sempre tre. Da trent'anni. Stavolta li trovo."],
        ["voce", "Il cancello si chiude. Dall'altra parte, Gaspare appoggia la scopa al muro e alza la mano. Il pullman parte. Nessuno canta, per un bel pezzo."],
        ["voce", "Per anni, quelli del Borgo giurano di vedere una luce accesa nel magazzino dello stadio chiuso, ogni domenica alle tre. E di sentire qualcuno che conta: «…ventuno, ventidue, ventitré»."]
      ] },
      coro: { coins: 420, bg: "zt_coro", lines: () => [
        ["voce", "Al centro del parcheggio, col sole che arriva, prendi il megafono di Ringhio. La curva si ferma. Ventimila facce grigie si girano verso di te. Aspettano."],
        ["voce", "Attacchi il coro. Il loro. «Valtorta alé, Valtorta alé…». Ti rispondono. Senza fiato, ma a tempo. E ti seguono, a passo di coro, dentro lo stadio, lontano dal paese."],
        ["zt_mimmo", "[triste] Campione… Vieni via. Il pullman parte."],
        ["voce", "Non vieni via. Qualcuno deve tenere il tempo. Il cancello si chiude con te dentro e la curva intorno, che canta."],
        ["voce", "A Borgo Marino, da allora, ogni notte si sente un coro arrivare dallo stadio fino al porto. I pescatori dicono che porta fortuna. Hanno ragione: in quindici anni, nessuno si è più avvicinato allo stadio di notte."]
      ] },
      fumogeno: { coins: 600, bg: "zt_fumogeno", lines: () => [
        ["voce", "Sali sul tetto del pullman con il fumogeno blu. Rebecca riprende tutto, in diretta. Strappi la linguetta."],
        ["voce", "Il fumo blu sale, si allarga, scende sulla curva come una nebbia di mare. Le facce, una dopo l'altra, tornano rosa. Qualcuno starnutisce. Qualcuno chiede dove ha messo il biglietto."],
        ["voce", "Nel bugigattolo sotto la curva, la porta si apre da sola. Pippo esce, si guarda l'avambraccio pulito, poi guarda il campo."],
        ["zt_pippo", "[sorpreso] Quanto manca?"],
        ["zt_cesaroni", "[serio] Novantesimo più tre. Si riprende con una rimessa laterale. Per il Borgo."],
        ["voce", "La partita si finisce all'alba, davanti a ventimila tifosi che non ricordano niente e a un presidente in manette. Finisce 1-1. Va benissimo a tutti."],
        ["zt_rebecca", "[felice] «Qui Telegolfo. Borgo Marino–Valtorta, 1 a 1. Spettatori: tutti. Morti: nessuno. Per una volta, il calcio di provincia ha fatto notizia per il motivo giusto.»"],
        ["voce", "Pippo torna a casa con la fascia al braccio. Martina gli chiede del gol del 2011. Lui gliela racconta. Meglio di come è stata."]
      ] }
    };
    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 5); F.set("zt_c4_done", true); F.set("zt_fine_" + id, true);
      K.reward("zt_c4" + id, { coins: E2.coins, cos: "zt_c4" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines()).concat([
        ["voce", `<b>FINE DI LA NOTTE DEI TIFOSI MORTI.</b><br>${H.stato()}`],
        ["voce", "Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «Notte in Curva». E da oggi, al Borgo, c'è un ospite che non riesce a smettere di contare i palloni."]
      ]), () => K.openMain(), E2.bg);
    }
    function finale() {
      const o = [];
      if (segreto()) o.push({ label: "💙 Il fumo blu", sub: "Segreto · otto bossoli, il lotto 8, la diretta, Pippo che aspetta", big: true, fn: () => ending("fumogeno") });
      if (K.crew.count() >= 4) o.push({ label: "🚌 Tutti sul pullman", sub: "Si parte, adesso, con chi c'è", big: true, fn: () => ending("pullman") });
      if (F.is("zt_coro")) o.push({ label: "📣 Il coro", sub: "Il megafono di Ringhio. Qualcuno deve tenere il tempo", big: true, fn: () => ending("coro") });
      o.push({ label: "🧹 Il magazziniere resta", sub: "Il cancello si chiude da dentro", big: true, fn: () => ending("magazziniere") });
      if (!segreto()) say("voce", `<span style="color:var(--dim)">(Bossoli verdi: ${bossoli()}/8${F.is("zt_blu") ? " · fumo blu ✓" : ""}. Certe albe si guadagnano.)</span>`);
      K.say(H.flush(), () => ask("Il sole spunta dietro le gru del porto. La curva è ferma sulla rampa, in attesa. Il pullman ha il motore acceso.", o));
    }
    function alba() {
      say("zt_nello", "[serio] Dieci minuti, e la batteria è carica. Ma guardate là, sulla rampa…");
      say("voce", "Dalla rampa della curva scende Valtortino: la mascotte del Valtorta, un rospo di gommapiuma alto due metri e mezzo, viola e giallo. Dentro, chiunque ci fosse, non c'è più. Dietro di lui, tutta la curva.");
      H.run({ title: "L'Alba", arena: "parcheggio", time: 150, mix: ["tifoso", "corridore", "panzone", "tamburino", "lanciatore"], boss: "mascotte" }, (r) => {
        F.set("zt_n4", true);
        say("voce", `Valtortino cade a pancia in su sul cofano di una Panda, e la Panda suona l'allarme. Il sole tocca la prima fila di macchine. Respinti: <b>${r.a || 0}</b>.`);
        say("zt_tonino", "[ride] Ho fatto gol in testa a un rospo. Lo racconto al bar per vent'anni.");
        K.say(H.flush(), () => H.bivio(() => { setStep(N, 4); quest("zt_c4c", "L'alba", "Si decide come finisce."); finale(); }));
      });
    }

    const talk = {
      zt_gaspare() {
        if (K.rel.scene("zt_gaspare")) return;
        const s = S();
        if (s === 0) {
          say("zt_gaspare", "[serio] Il parcheggio. Quaranta macchine, cinque pullman del Valtorta, il nostro in fondo a destra. E un'ora prima che faccia giorno. Forse meno.");
          say("zt_gaspare", "[pensa] Col sole si fermano? Non lo so. Nessuno lo sa. Ma col sole, almeno, li vediamo arrivare.");
          if (F.is("zt_bellotti_con")) say("zt_bellotti", "[triste] Il mio furgone è lì, vicino alla sbarra. Prendete quello che volete. Prendete tutto. Io mi siedo qui e aspetto l'avvocato.");
          setStep(N, 1); quest("zt_c4", "L'Alba", "Il pullman del Borgo è in fondo a destra. Sveglia Nello."); return done();
        }
        if (s === 4) return finale();
        if (s === 3 && F.is("zt_n4")) return H.bivio(() => { setStep(N, 4); finale(); });
        say("zt_gaspare", s >= 5 ? "Ventitré palloni. Ne mancano sempre tre." : s === 3 ? "[serio] Torna da Nello. Io guardo la rampa." : "Il pullman, poi casa. In quest'ordine."); done();
      },
      zt_nello() {
        const s = S();
        if (s === 1) {
          say("voce", "Nello dorme sul sedile di guida, il cappellino sugli occhi e la radio accesa su una stazione di liscio.");
          say("zt_nello", "[sorpreso] Eh? Già finita? Chi ha vinto? …Perché siete tutti verdi?");
          say("zt_gaspare", "[serio] Nello. Ascoltami bene. Lo stadio è pieno di morti che camminano. Dobbiamo andare via. Adesso.");
          say("zt_nello", "[pensa] Ah. Va be'. Peggio della trasferta di Foggia del '91 non può essere. …Il motore non parte. La batteria è a terra: ho tenuto la radio accesa tutta la partita. Servono i cavi.");
          say("zt_nello", "I miei? Prestati al pullman del Valtorta all'andata. Mai restituiti. Quelli della Bellotti, nel furgone dei fuochi, ne hanno di sicuro: girano sempre con le batterie per le centraline.");
          setStep(N, 2); quest("zt_c4b", "I cavi", "Il furgone della Bellotti Pirotecnica, in alto a sinistra."); return done();
        }
        if (s === 3 && F.is("zt_n4")) { say("zt_nello", "Carica. Il motore gira. Quando volete, io sono pronto."); return K.say(H.flush(), () => H.bivio(() => { setStep(N, 4); finale(); })); }
        if (s === 3) {
          say("voce", "Nello attacca i cavi tra il furgone e il pullman. Il cruscotto si accende, tossisce, si spegne, si riaccende.");
          return ask("«Dieci minuti di carica. Dieci.» Sulla rampa della curva, qualcosa di grosso e viola sta scendendo.", [
            { label: "🧟 Si comincia · L'Assedio", sub: "L'ultima notte: il parcheggio", big: true, fn: alba },
            { label: "🧍 Prima sistemo il Gruppo", sub: "Chi corre con te", fn: () => K.crew.pick(() => K.done(), true) },
            { label: "◂ Un momento", fn: done }
          ]);
        }
        say("zt_nello", s === 2 ? "I cavi, ragazzo. Rossi e neri. Il rosso sul più, il nero sul meno. Se li inverti, saltiamo in aria, e stanotte mi sembrerebbe quasi giusto." : s >= 4 ? "[ride] Allacciatevi le cinture. Non ce le ha nessuno, ma allacciatevele lo stesso." : "Zzz… rigore… zzz…"); done();
      }
    };
    function cassaCavi() {
      const s = S();
      if (s < 2) { say("voce", "Una cassa di attrezzi della Bellotti Pirotecnica. Inneschi, nastro, una pinza. E dei cavi, rossi e neri, arrotolati."); return done(); }
      if (s > 2) { say("voce", "La cassa degli attrezzi. I cavi li hai già presi."); return done(); }
      say("voce", "Nella cassa degli attrezzi: inneschi, nastro isolante, una pinza, e due cavi rossi e neri con le pinze a coccodrillo. Li prendi.");
      if (!F.is("zt_blu")) say("zt_rebecca", "[pensa] Dieci casse uguali, là in fondo. In una c'è il lotto 8, quello blu. Ma senza sapere il numero di serie, le apri tutte e ci vuole un'ora.");
      setStep(N, 3); quest("zt_c4b2", "La batteria", "Torna da Nello sul pullman, con i cavi."); done();
    }
    function casseBlu() {
      if (F.is("zt_blu")) { say("voce", "Le dieci casse. Quella giusta è aperta e vuota: il fumogeno blu ce l'hai tu."); return done(); }
      const b = bossoli();
      if (b < 8) { say("voce", `Dieci casse uguali, senza etichetta. Ognuna ha un numero di serie stampigliato sul fianco. I bossoli verdi che hai raccolto hanno numeri vicini, ma ti mancano dei pezzi: con ${b} su 8 non basta a capire quale sia la cassa giusta.`); return done(); }
      say("voce", "Metti in fila gli otto bossoli verdi sul pianale. I numeri di serie salgono, uno dopo l'altro: 7-001, 7-002… 7-008. La cassa dopo l'ultimo bossolo ha il numero 8-001.");
      say("voce", "Dentro, un solo fumogeno, blu, con un'etichetta a pennarello: «LOTTO 8 · ANTIDOTO? · non si sa mai».");
      F.set("zt_blu", true); K.learnLore("l_zt_lotto8");
      say("zt_rebecca", "[sorpreso] «Antidoto», con il punto di domanda. È il punto di domanda più importante della mia carriera.");
      done();
    }

    const zones = {
      zt_parcheggio: {
        region: "parcheggio", name: "Il parcheggio dello stadio", short: "Parcheggio", sub: "Auto, pullman, lampioni gialli e la prima luce", bg: "zt_parcheggio", time: "notte", w: 36, h: 26, base: "Q", start: [5, 24], travel: [5, 24],
        items: [[2, 6], [33, 7], [19, 13], [8, 19]], itemCos: "zt_c4",
        areas: [[1, 0, 9, 4, "Il furgone della Bellotti"], [24, 18, 34, 24, "Il pullman del Borgo"], [13, 21, 19, 25, "La biglietteria"], [0, 0, 35, 25, "Il parcheggio"]],
        act: { n: "Leggi il cartello", s: "Riprendi fiato", z: "Guarda nel bagagliaio", G: "Guarda la sbarra", C: "Guarda la macchina", u: "Guarda il carrello" },
        flavor: { n: "«PARCHEGGIO OSPITI · I pullman del Valtorta in fila, prego». Qualcuno ha aggiunto a pennarello: «E per sempre».", z: "Un bagagliaio aperto: una borsa frigo, una bandiera del Valtorta, una foto di famiglia sul cruscotto. Chiudi piano il portellone.", G: "La sbarra dell'uscita, abbassata. Dall'altra parte, la strada per il paese. Il pullman la può sfondare. Le gambe no.", C: "Una macchina con le portiere aperte e la radio accesa. Il notiziario parla di «strani rumori dallo stadio». È un eufemismo.", u: "Un carrello della spesa pieno di bandiere viola. Qualcuno doveva venderle all'uscita." },
        loot: { "11,9": { id: "zt_bossolo", text: "Un bossolo verde sotto una macchina. Il numero di serie è stampigliato sul fondo: «7-007».", empty: "Il bossolo l'hai già preso." }, "29,12": { id: "zt_bossolo", text: "L'ultimo bossolo, rotolato contro una ruota del pullman del Valtorta. «7-008».", empty: "Qui c'era un bossolo. È rimasto l'alone verde." } },
        npcs: (s) => { const L = []; if (s === 0) L.push({ id: "zt_gaspare", at: [15, 20] }); if (s >= 4) L.push({ id: "zt_gaspare", at: [27, 23] }); if (F.is("zt_bellotti_con") && s < 5) L.push({ id: "zt_bellotti", at: [13, 20] }); return L; },
        intro: [["voce", "La rampa scende nel parcheggio. Lampioni gialli, file di macchine con le portiere aperte, cinque pullman del Valtorta col motore spento. In fondo, il pullman blu del Borgo."], ["voce", "In alto a sinistra, vicino alla sbarra, un furgone bianco con la scritta «BELLOTTI PIROTECNICA · facciamo scintille». Sopra il porto, il cielo comincia a schiarire."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 25, "Q");
          lay(0, 0, 35, 0, "a"); lay(0, 0, 0, 25, "a"); lay(35, 0, 35, 25, "a"); lay(0, 25, 35, 25, "a");
          lay(12, 0, 15, 0, "G"); put(11, 1, "n");
          // file di auto
          [[4, 6], [8, 6], [12, 6], [16, 6]].forEach(([y]) => { for (let x = 6; x <= 31; x++) if (x % 5 && x !== 18 && x !== 17) put(x, y, "C"); });
          lay(17, 4, 18, 18, "Y");
          // pullman del Valtorta (in fila, sul lato destro)
          [[22, 2], [27, 2]].forEach(([x, y], i) => house(x, y, 4, 3, { door: [x + 1, y + 2], roof: "#6d28d9", wall: "#facc15", chimney: false, enter: i ? "Il pullman del Valtorta numero 5. Dentro, sui sedili, ci sono sciarpe piegate e cestini del pranzo. Nessuno è tornato a mangiarli." : "Il pullman del Valtorta numero 4. Sul vetro, a pennarello: «RINGHIO PRESIDENTE»." }));
          // il furgone della Bellotti
          house(2, 1, 5, 3, { door: [4, 3], roof: "#f5f5f4", wall: "#e5e7eb", chimney: false, enter: { to: "zt_furgone", at: [6, 6] } });
          // il pullman del Borgo
          house(25, 19, 8, 4, { door: [28, 22], roof: "#1f5fbf", wall: "#1e3a8a", chimney: false, enter: { to: "zt_pullman", at: [8, 6] } });
          // biglietteria
          house(13, 21, 5, 3, { door: [15, 23], roof: "#78350f", wall: "#3f3f46", chimney: false, enter: "La biglietteria. Sul vetro: «Tutto esaurito». Per una volta, ed era la volta sbagliata." });
          put(11, 9, "V"); put(29, 12, "V");
          [[3, 10], [32, 10], [3, 18], [32, 17], [20, 21], [10, 14]].forEach(([x, y]) => put(x, y, "I"));
          put(7, 22, "s"); put(24, 14, "z"); put(9, 3, "u");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow();
          // strisce dei posti auto, e la prima luce che sale da destra
          g.save(); g.fillStyle = "rgba(250,250,250,.18)"; [4, 8, 12, 16].forEach((y) => { for (let x = 4; x <= 32; x++) g.fillRect(d.X(x), d.Y(y) - 2, 1, 18); }); g.restore();
          const dawn = S() >= 4 ? 0.22 : 0.08 + 0.03 * Math.sin(f / 40); g.fillStyle = `rgba(253,186,116,${dawn})`; g.fillRect(d.X(0), d.Y(0), d.X(36) - d.X(0), d.Y(26) - d.Y(0));
          if (S() >= 3) Z.crowd(g, d, f, 1, 20, 9, 23, 41, ["#6d28d9", "#facc15", "#4c1d95"]);
          H.fog(g, d, f, 36, 26);
          H.plaque(g, "BELLOTTI PIROTECNICA", d.X(4) + 8, d.Y(1) - 2, "#fca5a5"); H.plaque(g, "BORGO MARINO", d.X(29), d.Y(19) - 2, "#93c5fd"); H.plaque(g, "USCITA ▴", d.X(14), d.Y(1) + 4, "#bef264"); H.plaque(g, "VALTORTA", d.X(26), d.Y(2) - 2, "#facc15");
        }
      },
      zt_pullman: {
        interior: true, region: "interno", name: "Il pullman del Borgo", short: "Pullman", sub: "Sedili blu, odore di linimento e di panini", bg: "zt_pullman", w: 16, h: 8, start: [8, 6], outside: ["zt_parcheggio", 28, 23], base: "U",
        act: { b: "Siediti", T: "Guarda il cruscotto", n: "Leggi il cartello", z: "Guarda le borse", L: "Guarda la bacheca" },
        flavor: { b: "Sedili blu col poggiatesta in stoffa. Su uno c'è scritto «PIPPO» col pennarello, da anni. Nessuno ci si siede mai.", T: "Il cruscotto. Una madonnina, un santino di Padre Pio, un portachiavi del Borgo Marino e una spia rossa: BATTERIA.", n: "«È vietato fumare, mangiare e cantare dopo le sconfitte». La terza regola non è mai stata rispettata.", z: "Borse con le divise di ricambio. Domani c'era l'allenamento. Domani.", L: "Foto della squadra in trasferta. Anni diversi, facce diverse, lo stesso pullman." },
        npcs: () => [{ id: "zt_nello", at: [2, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 7, "U"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 7, "a"); lay(15, 0, 15, 7, "a"); lay(0, 7, 15, 7, "a"); put(8, 7, "v");
          put(1, 2, "T"); put(1, 1, "n");
          for (let x = 4; x <= 13; x += 2) { put(x, 2, "b"); put(x, 5, "b"); }
          put(14, 3, "z"); put(14, 1, "L");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BORGO MARINO · TRASFERTE", d.X(8), d.Y(0) + 6, "#93c5fd"); if (S() < 4) { const f = window.__sagaCore.util.frNow(); g.fillStyle = `rgba(239,68,68,${0.5 + 0.4 * Math.sin(f / 5)})`; g.fillRect(d.X(1) + 10, d.Y(2) + 2, 3, 3); } }
      },
      zt_furgone: {
        interior: true, region: "interno", name: "Il furgone della Bellotti", short: "Furgone", sub: "Casse di fumogeni, attrezzi e un odore di zolfo", bg: "zt_magazzino", w: 12, h: 8, start: [6, 6], outside: ["zt_parcheggio", 4, 4], base: "U",
        act: { D: "Apri la cassa degli attrezzi", u: "Guarda le dieci casse", n: "Leggi la bolla", K: "Guarda il fusto" },
        flavor: { n: "Una bolla di consegna: «Lotto 7 · 40 pz · curva ospite». Sotto, firmato: «Bellotti». Accanto, con un'altra penna: «Aldo per primo».", K: "Un fusto di polvere verde, sigillato. «VigorVerde · concentrato · NON INALARE». Lo lasci dov'è, e ti allontani di un passo." },
        npcs: () => [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 11, 7, "U"); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 7, "a"); lay(11, 0, 11, 7, "a"); lay(0, 7, 11, 7, "a"); put(6, 7, "v");
          put(2, 2, "D"); lay(5, 1, 10, 1, "u"); put(10, 4, "K"); put(1, 5, "n");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BELLOTTI PIROTECNICA · facciamo scintille", d.X(6), d.Y(0) + 6, "#fca5a5"); }
      }
    };
    return {
      n: N, title: "L'Alba", sub: "Un pullman senza batteria, un furgone che sa di zolfo e una mascotte alta due metri e mezzo",
      goal, start: "zt_parcheggio", introBg: "zt_parcheggio", zones, talk, obj: { "zt_furgone:D": () => cassaCavi(), "zt_furgone:u": () => casseBlu() },
      intro: [["voce", "La rampa della curva ospite scende nel parcheggio. L'aria fuori sa di salsedine e di benzina. Dopo una notte di fumo verde, sembra profumo."], ["zt_nadia", "[serio] Contiamoci. …Ci siamo quasi tutti. Quasi. Andiamo a prendere quel pullman."]]
    };
  }
  boot();
})();
