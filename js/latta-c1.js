// js/latta-c1.js - «IL PALLONE DI LATTA» · Capitolo 1: La sera del Palio
// L'Araldo cerca un cavaliere per il corteo, il Museo presta l'armatura del 1527, l'armatura si chiude e parla. Il castello si sveglia:
// primo livello a scorrimento (Le Mura al tramonto) e primo capo (il Corvo Maggiore, sul Torrione).
(function () {
  "use strict";
  function boot() {
    const E = window.__lattaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__lattaH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__lattaH(K), { say, done, ask, wask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("lt_c1", { kind: "shirt", label: "Maglia del Palio", val: "#c02a3a", from: "Capitolo 1 del Pallone di Latta" });
    K.lore("l_palio", { t: "Il Palio di Castelrondine", d: "Ogni anno, l'ultima sera d'estate, le quattro contrade corrono intorno alla piazza e un cavaliere apre il corteo. Si vince un drappo dipinto e il diritto di vantarsene fino all'anno dopo." });
    K.lore("l_latta", { t: "Il Cavaliere di Latta", d: "Armatura da torneo, 1527, cavaliere ignoto. Nel petto ha un incavo tondo, «forse per un amuleto», dice il cartellino. Dentro c'era un pallone di latta ammaccato. Nessuno l'aveva mai notato." });
    K.lore("l_corvi", { t: "I corvi del castello", d: "Vivono sul Torrione da secoli. La leggenda dice che erano i giudici del Palio: fischiavano i falli dall'alto. Da stasera indossano maglie a righe, e nessuno sa dove le abbiano prese." });
    K.lore("l_resort", { t: "Castello Resort & Spa", d: "Il progetto del Cav. Mattonaro: suite nelle torri, idromassaggio nella cripta, parcheggio al posto della pista del Palio. Il Comune non ha ancora detto sì. Non ha ancora detto no." });

    const goal = (s) => ({
      0: "In piazza: parla con l'Araldo, vicino al portone delle Mura. (Livelli a scorrimento: partono dal portone dopo l'armatura. Prova subito i comandi: menu ☰ › 🏰 Livelli a scorrimento › Cortile.)",
      1: "Entra nel Museo dell'Armeria (la casa grande a ovest) e parla con la curatrice.",
      2: "▶ LIVELLO A SCORRIMENTO: vai al portone delle Mura (a nord, scritta MURA ▲) e sali. Nonna Gelsa e la Taverna aspettano, se vuoi.",
      3: "Sul Torrione ti aspetta il Corvo Maggiore: torna al portone delle Mura.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      setStep(N, 4); F.set("lt_c1_done", true);
      K.inv.give("lt_spallaccio");
      K.reward("lt_c1", { coins: 80, cos: "lt_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["lt_ferro", "Cric. <em>(«Il Corvo Maggiore. Fischiava anche nel 1527. Fischiava soprattutto a me.»)</em>"],
        ["lt_ferro", "[pensa] Criiic... <em>(«Mi ricordo un tetto. Tanti tetti. E una campana che suonava senza nessuno sotto.»)</em>"],
        ["lt_araldo", "[ride] Signore e signori, il castello è sicuro! Per stasera. Forse. Ascoltate le campane: se suonano da sole, non è colpa dell'Araldo."],
        ["voce", "Tra le piume del Corvo, uno spallaccio dorato con lo stemma del Borgo: nei livelli vale un pezzo d'armatura in più."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>🛡️ Onore ${K.stat("onore")} · 🪙 Affari ${K.stat("affari")} · 🚩 Stendardi ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Il Capitolo 2 ti aspetta: i tetti del Borgo, di notte."]
      ]), () => K.openMain(), "lt_titolo");
    }

    function mura() {
      H.level("mura", "Cric-crac! <em>(«Le Mura! Io ci correvo sopra con le scarpe di ferro. Tu prova con le tue. Ah no, sono le mie.»)</em>", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          say("lt_ferro", "[felice] Criiic! <em>(«Hai calciato di sponda come si deve. Nel 1527 lo chiamavano «colpo del matto». Io lo chiamavo «colpo».»)</em>");
          if (r.ban) say("lt_gelsa", `[felice] Hai riportato ${r.ban} dei miei stendardi! Li riattacco stasera stessa, coi punti doppi.`);
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Mancano degli stendardi: dal menu, 🏰 Livelli a scorrimento, puoi rigiocare il livello quando vuoi.");
          say("voce", "In cima al Torrione si sente un fischio lunghissimo. Poi un altro. Il Corvo Maggiore ti ha visto.");
          quest("lt_c1c", "Il Torrione", "Torna al portone delle Mura e sali al Torrione.");
          return done();
        }
        say("lt_ferro", r.quit ? "Cric. <em>(«Ritirata strategica. Nel 1527 la chiamavamo «ho fame».»)</em>" : "Criiic... <em>(«Tutti i miei pezzi per terra. Raccoglili, che riproviamo.»)</em>"); done();
      });
    }
    function torrione() {
      H.level("torrione", "Crac! <em>(«Il Corvo Maggiore scende in picchiata e si pianta nei mattoni. Quando è incastrato, saltagli in testa o calcia. Quando fischia, salta.»)</em>", (r) => {
        if (r.win) { say("voce", "Il Corvo Maggiore si scuote le penne, getta il fischietto e vola via sopra i tetti del Borgo. Qualcosa di dorato gli cade dalle piume."); return fin(); }
        say("lt_ferro", "Criiic. <em>(«Ci ha fischiato fuorigioco. Non era fuorigioco. Riproviamo.»)</em>"); done();
      });
    }
    // il portone delle Mura (tessera X): avvia i livelli
    function gate() {
      const s = S();
      if (s < 2) { say("voce", s === 0 ? "Il portone delle Mura è chiuso. Si apre solo per il corteo del Palio, e il corteo non ha ancora un cavaliere." : "Il portone è chiuso. L'Araldo ha detto: prima il cavaliere, poi il corteo."); return done(); }
      if (s === 2) return ask("Il portone delle Mura cigola da solo. Di là, elmi che rotolano e corvi che fischiano.", [
        { label: "🏰 Sali sulle Mura", sub: "Livello a scorrimento · Le Mura al tramonto", big: true, cls: "hot", fn: mura },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Dal Torrione arriva un fischio che fa tremare le finestre.", [
        { label: "🐦‍⬛ Sali al Torrione", sub: "Capo · Il Corvo Maggiore", big: true, cls: "hot", fn: torrione },
        { label: "🏰 Rigioca le Mura", sub: "Per gli stendardi mancanti", fn: mura },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "Il portone è aperto. Dal menu, 🏰 Livelli a scorrimento, rigiochi i livelli superati."); done();
    }
    // Ferro si parla dal menu della zona (è l'armatura che indossi)
    window.__lattaFerro = (KK) => {
      if (K.mem().ch >= 2 && window.__lattaFerroC2) return window.__lattaFerroC2(KK);
      const s = S();
      say("lt_ferro", s === 2 ? "Cric. <em>(«Il castello si è svegliato perché mi sono svegliato io. Mi dispiace. Un po'. Non tanto: era noioso, nella vetrina.»)</em>" : s === 3 ? "Criiic. <em>(«Il Corvo Maggiore. Ha una memoria lunga e un fischietto più lungo. Non farti trovare coi piedi per terra.»)</em>" : "Cric-cric. <em>(«Sono qui. Sono sempre qui. Sono letteralmente intorno a te.»)</em>");
      if (!F.is("lt_ferro_nome")) { F.set("lt_ferro_nome", true); say("hero", "Come ti chiami, armatura?"); say("lt_ferro", "[pensa] Criii... <em>(«Non me lo ricordo. Chiamami Ferro. È quello che sono, almeno per metà.»)</em>"); }
      done();
    };

    const talk = {
      lt_araldo() {
        if (K.rel.scene("lt_araldo")) return;
        const s = S();
        if (s === 0) {
          say("lt_araldo", "[sorpreso] Tu! Sì, tu, col fisico da calciatore e la faccia da Palio! Ti serve un lavoro? A me serve un cavaliere.");
          say("lt_araldo", "Il nostro cavaliere del corteo è rimasto chiuso in cantina. Da solo. Dice che è stata la porta. Io dico che è stato il vino.");
          say("lt_araldo", "Il Museo dell'Armeria presta un'armatura vera. Tu la indossi, apri il corteo, fai ciao con la mano. Un'ora di gloria. Che ne dici?");
          K.learnLore("l_palio"); setStep(N, 1); quest("lt_c1", "Un cavaliere per il Palio", "Vai al Museo dell'Armeria e fatti prestare l'armatura.");
          return wask("L'Araldo ti tende la tromba come fosse un contratto.", [
            { label: "🛡️ «Per il Palio, volentieri.»", w: { onore: 1 }, fn: () => { say("lt_araldo", "[felice] Parole da cavaliere! Il Museo è a ovest. La curatrice morde, ma solo se tocchi le vetrine."); done(); } },
            { label: "🪙 «Quanto paga, il Palio?»", sub: "+20 monete", w: { affari: 1 }, fn: () => { K.coinsGive && K.coinsGive(20); say("lt_araldo", "[ride] Venti monete e una frittella. Le frittelle le pago io, le monete il Comune. Non dirlo al Comune."); done(); } },
            { label: "«Un'ora sola, vero?»", fn: () => { say("lt_araldo", "[furbo] Un'ora. Al massimo due. Diciamo una sera. Ma è una sera bellissima!"); done(); } }
          ]);
        }
        say("lt_araldo", s === 1 ? "Il Museo, cavaliere! A ovest, la casa con lo stemma. Il corteo non parte senza armatura, e io non grido senza corteo." : s === 2 ? "[sorpreso] Il castello... si muove? Signore e signori, è tutto previsto! Non era previsto. Cavaliere, il portone è tuo." : s === 3 ? "Il Torrione! Sali, cavaliere. Io intanto annuncio che hai già vinto: porta bene." : "[ride] Che Palio, cavaliere. Che Palio!");
        done();
      },
      lt_ottavia() {
        if (K.rel.scene("lt_ottavia")) return;
        const s = S();
        if (s === 1 && !F.is("lt_ott1")) {
          F.set("lt_ott1", true);
          say("lt_ottavia", "[serio] Non toccare la vetrina. Non toccare l'altra vetrina. Non respirare sulla terza. L'Araldo ti manda per l'armatura, lo so.");
          say("lt_ottavia", "Gliela presto perché il Comune insiste. È quella al centro: il «Cavaliere di Latta», 1527, cavaliere ignoto. Nessun documento. Nessun nome. Mai pulita bene, mai aperta del tutto.");
          say("lt_ottavia", "Mettila davanti alla vetrina, piano. E poi riportamela. Intera.");
          K.learnLore("l_latta"); quest("lt_c1b", "L'armatura del 1527", "Guarda l'armatura al centro del Museo e indossala.");
          return done();
        }
        if (s === 2 && !F.is("lt_ott2")) {
          F.set("lt_ott2", true);
          say("lt_ottavia", "[arrabbiato] Si è CHIUSA? Le armature non si chiudono da sole. Le armature non parlano. Le armature non... cosa sta cigolando?");
          say("lt_ottavia", "[pensa] «Ferro», dice. Va bene. Va bene. Sono una professionista. Scrivo tutto. Se esci vivo dal castello, la apriamo insieme. Delicatamente.");
          return wask("La curatrice ha già il taccuino in mano.", [
            { label: "🛡️ «La riporterò intera. Ferro compreso.»", w: { onore: 1 }, fn: () => { K.rel.add("lt_ottavia", 3); say("lt_ottavia", "[felice] Intera. È la parola più bella che conosco. Dopo «catalogata»."); done(); } },
            { label: "🪙 «Quanto vale un'armatura che parla?»", w: { affari: 1 }, fn: () => { say("lt_ottavia", "[arrabbiata] Non ha prezzo. E se lo chiedi a Mattonaro, ne avrà uno. Non chiederlo a Mattonaro."); done(); } }
          ]);
        }
        say("lt_ottavia", s < 2 ? "L'armatura al centro. Piano. Con rispetto." : "Torna intera. Tu e l'armatura. In quest'ordine, se proprio devo scegliere."); done();
      },
      lt_gelsa() {
        if (K.rel.scene("lt_gelsa")) return;
        const s = S();
        if (s >= 2 && !F.is("lt_gel1")) {
          F.set("lt_gel1", true); K.learnLore("l_corvi");
          say("lt_gelsa", "[sorpreso] Uh, ma tu cigoli! Avvicinati. Ah, quell'armatura lì. Mia nonna diceva: «quando la latta torna a battere, il castello si sveglia».");
          say("lt_gelsa", "Nel 1527 il cavaliere del Palio non tornò. Nessuno ha mai detto perché. Il suo nome l'hanno grattato via da tutte le carte. Come se avesse fatto qualcosa di brutto. O qualcosa di troppo bello.");
          say("lt_gelsa", "E adesso i corvi mi hanno rubato gli stendardi del Palio! Li hanno portati sulle Mura. Se li trovi, riportameli: ogni stendardo è un anno della mia vita, ricamato.");
          say("lt_ferro", "[pensa] Criiic... <em>(«Il 1527. Ho un buco, lì. Nella memoria e nel fianco.»)</em>");
          return done();
        }
        say("lt_gelsa", s < 2 ? "Stasera c'è il Palio, giovanotto. Io ricamo, tu corri. Ognuno ha il suo ago." : "Gli stendardi, cavaliere. In alto, sopra i buchi, dietro i mattoni crepati. I corvi sono furbi, ma io sono più vecchia."); done();
      },
      lt_bacco() {
        if (K.rel.scene("lt_bacco")) return;
        if (!F.is("lt_bac1")) {
          F.set("lt_bac1", true); K.inv.give("lt_torta");
          say("lt_bacco", "[ride] Un cavaliere di latta nella mia taverna! Siediti. Anzi no, rompi la sedia. Stai in piedi.");
          say("lt_bacco", "Tieni: una fetta di torta del Palio. Mandorle, miele e burro quanto basta. Dove «quanto basta» è «tutto».");
          say("voce", "Ottieni la Torta del Palio (🎒 Zaino): un regalo che fa piacere a chi la riceve.");
          return done();
        }
        say("lt_bacco", S() >= 2 ? "Senti? Toc, toc, dalle Mura. Mio nonno diceva che era un pallone. Io dicevo che era il vino. Adesso non so più chi aveva ragione." : "Il Palio porta clienti, i clienti portano sete, la sete porta me. È un ciclo virtuoso."); done();
      },
      lt_mattonaro() {
        if (K.rel.scene("lt_mattonaro")) return;
        const s = S();
        if (s >= 2 && !F.is("lt_mat1")) {
          F.set("lt_mat1", true); K.learnLore("l_resort"); K.inv.give("lt_biglietto");
          say("lt_mattonaro", "[furbo] Il famoso cavaliere di latta! Cav. Gino Mattonaro, piacere. Il biglietto, prego. È d'oro. Non tutto. Abbastanza.");
          say("lt_mattonaro", "Il castello si è svegliato proprio la sera della mia presentazione. «Castello Resort & Spa». Corvi che fischiano non fanno bene alle prenotazioni.");
          say("lt_mattonaro", "Facciamo così: tu ripulisci le Mura, io ti pago. E se trovi carte vecchie, documenti, roba con nomi sopra, le porti a me. Prima che alla curatrice.");
          return wask("Mattonaro ti tende una mano con tre anelli.", [
            { label: "🪙 Stringi la mano", sub: "+60 monete · accordo con Mattonaro", w: { affari: 2 }, fn: () => { F.set("lt_patto", true); K.coinsGive && K.coinsGive(60); say("lt_mattonaro", "[ride] Affare fatto! Mi piacciono i cavalieri pratici. Quelli romantici finiscono nelle vetrine."); say("lt_ferro", "Cric. <em>(«Ehi.»)</em>"); done(); } },
            { label: "🛡️ «Il castello non è in vendita.»", w: { onore: 2 }, fn: () => { F.set("lt_rifiuto", true); say("lt_mattonaro", "[serio] Tutto è in vendita, cavaliere. Anche il silenzio delle armature. Ci rivedremo quando avrai fame."); say("lt_ferro", "[felice] Criiic! <em>(«Mi piaci. Mi piaci molto.»)</em>"); done(); } },
            { label: "«Ci penso.»", fn: () => { F.set("lt_mat1", false); say("lt_mattonaro", "Pensa pure. Il tempo è denaro: il tuo, non il mio."); done(); } }
          ]);
        }
        say("lt_mattonaro", s < 2 ? "[furbo] Bella serata per un Palio. Ancora più bella per un investimento." : F.is("lt_patto") ? "Ripulisci, cavaliere. E le carte vecchie, ricordati: prima a me." : "Ancora qui? Il castello è una miniera d'oro. Tu ci vedi i fantasmi, io i bagni turchi."); done();
      }
    };

    const zones = {
      lt_piazza: {
        region: "palio", name: "Piazza del Palio", short: "Piazza del Palio", sub: "Castelrondine, l'ultima sera d'estate", bg: "lt_piazza", time: "tramonto", w: 30, h: 22, base: "Q", start: [14, 19],
        itemCos: "lt_c1", items: [[1, 4], [28, 13], [12, 20], [27, 20]],
        areas: [[2, 5, 8, 9, "Il Museo dell'Armeria"], [18, 4, 28, 10, "La pista del Palio"], [21, 14, 27, 18, "La Taverna del Gonfalone"], [11, 10, 18, 13, "La fontana"], [12, 0, 17, 3, "Il portone delle Mura"], [0, 0, 29, 21, "Castelrondine"]],
        act: { X: "Sali sulle Mura", K: "Guarda la tribuna", E: "Guarda la bancarella", F: "Guarda la fontana", V: "Guarda il vessillo", n: "Leggi il cartello", x: "Apri il baule", s: "Riposa un momento", l: "Guarda la lanterna", b: "Siediti", t: "Guarda l'albero", q: "Entra" },
        flavor: {
          I: "Le Mura di Castelrondine: mattoni arancio, merli spuntati e ciuffi d'erba nelle fughe. Stasera, lassù, qualcosa rotola.",
          K: "La tribuna del Palio: assi di legno, drappi rossi e gialli, e un signore che tiene il posto da stamattina.",
          E: "Una bancarella di frittelle, nastri e spade di legno. Il venditore ti guarda l'armatura e ti propone uno sconto «tra colleghi».",
          F: "La fontana della piazza. Chi ci butta una moneta la sera del Palio vince l'anno dopo. Il fondo è pieno di monete e di sconfitte.",
          V: "Un vessillo delle contrade. Sventola anche senza vento, il che stasera non rassicura.",
          n: "Il cartello: «PALIO DI CASTELRONDINE · ore 20 corteo · ore 21 corsa · ore 23 frittelle · VIETATO SVEGLIARE IL CASTELLO»",
          s: "Una panca di pietra, tiepida di sole. Ci si siede chiunque, anche le armature.",
          l: "Una lanterna di ferro. Dentro, una candela che si piega verso il castello.",
          b: "Una panchina con le iniziali di due innamorati del 1974. Uno dei due, ora, vende frittelle.",
          t: "Un vecchio leccio. I corvi ci si posano e guardano. Guardano te."
        },
        loot: { "27,19": { id: "lt_pergamena", text: "Nel baule, sotto un costume da giullare: una pergamena arrotolata. «Palio del 1527». Un nome è stato grattato via.", empty: "Il baule è vuoto. Solo un costume da giullare che ti guarda storto." } },
        npcs: (s) => [{ id: "lt_araldo", at: [16, 5] }, { id: "lt_gelsa", at: [4, 12] }].concat(s >= 1 ? [] : []),
        intro: [["voce", "Castelrondine, l'ultima sera d'estate. La piazza odora di frittelle, il sole cala dietro le Mura e le contrade litigano per il posto in tribuna."], ["voce", "A nord il portone delle Mura. A ovest il Museo dell'Armeria. A sud-est la Taverna del Gonfalone. L'Araldo, col fiato corto, cerca qualcuno."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 2, "I"); put(14, 2, "X"); put(15, 2, "X");
          lay(0, 3, 0, 21, "t"); lay(29, 3, 29, 21, "t"); lay(1, 21, 28, 21, "t"); put(14, 21, "Q"); put(15, 21, "Q");
          lay(19, 5, 27, 9, "Z"); lay(19, 4, 27, 4, "K"); [[18, 5], [28, 5], [18, 9], [28, 9]].forEach(([x, y]) => put(x, y, "V"));
          house(2, 5, 7, 5, { door: [5, 9], roof: "#4c1d95", wall: "#e8dcc8", enter: { to: "lt_armeria", at: [8, 9] } });
          house(21, 14, 7, 5, { door: [24, 18], roof: "#7c2d12", wall: "#f5deb3", chimney: true, enter: { to: "lt_taverna", at: [8, 9] } });
          house(2, 14, 5, 4, { door: [4, 17], roof: "#1d4ed8", wall: "#fef3c7", enter: "La casa di Nonna Gelsa: dalla finestra, un telaio grande come un letto e trenta gatti che fingono di non vederti." });
          house(9, 15, 4, 4, { door: [10, 18], roof: "#9a3412", wall: "#fde68a", chimney: true, enter: "Il forno di Castelrondine. Chiuso «per Palio». Dal buco della serratura esce un profumo che è quasi un'offerta di lavoro." });
          house(17, 15, 3, 3, { door: [18, 17], roof: "#334155", wall: "#e2e8f0", enter: "Il Municipio. Il sindaco è in tribuna, il vicesindaco è in cantina col cavaliere del corteo. Nessuno firma niente." });
          put(14, 12, "F"); put(15, 12, "F");
          [[9, 11], [10, 11], [19, 12], [20, 12]].forEach(([x, y]) => put(x, y, "E"));
          [[12, 4], [17, 4], [12, 13], [17, 13], [8, 19], [21, 19]].forEach(([x, y]) => put(x, y, "l"));
          put(3, 12, "b"); put(12, 10, "s"); put(16, 9, "n"); put(27, 19, "x"); [[24, 11], [26, 12], [7, 20]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) { const s = S(), on = s >= 2 && s <= 3, bl = on && Math.floor(Date.now() / 450) % 2; H.plaque(g, on ? "▶ LIVELLO: MURA ▲" : "MURA ▲", d.X(14) + 16, d.Y(3) + 2, bl ? "#fef08a" : "#fde68a"); if (on) { g.save(); g.globalAlpha = 0.35 + 0.35 * Math.abs(Math.sin(Date.now() / 300)); g.strokeStyle = "#fde047"; g.lineWidth = 2; g.strokeRect(d.X(14) - 2, d.Y(2) - 2, 36, 20); g.restore(); } H.plaque(g, "MUSEO DELL'ARMERIA", d.X(5) + 8, d.Y(5) - 6, "#ddd6fe"); H.plaque(g, "TAVERNA DEL GONFALONE", d.X(24) + 8, d.Y(14) - 6, "#fed7aa"); H.plaque(g, "PISTA DEL PALIO", d.X(23) + 8, d.Y(10) + 10, "#fca5a5"); H.plaque(g, "GELSA", d.X(4) + 8, d.Y(14) - 6, "#bfdbfe"); }
      },
      lt_armeria: {
        interior: true, region: "museo", name: "Il Museo dell'Armeria", short: "Armeria", sub: "Vetrine, lance e un'armatura che respira", bg: "lt_armeria", w: 16, h: 11, start: [8, 9], outside: ["lt_piazza", 5, 10], base: "U",
        act: { A: "Guarda l'armatura", P: "Guarda la rastrelliera", L: "Guarda la libreria", T: "Guarda il tavolo", W: "Guarda la finestra", n: "Leggi il cartellino", l: "Guarda la lampada" },
        flavor: { A: "Un'armatura da torneo, lucida come il primo giorno. Il cartellino dice: «non toccare». Tu non tocchi. Lei, forse, sì.", P: "Lance da giostra, scudi dipinti, una spada di legno per i bambini del Palio. Sui bordi, le tacche di cento tornei.", L: "Registri del Palio dal 1600 in poi. Prima del 1600, un buco nello scaffale. Qualcuno ha preso i libri e non li ha più riportati.", T: "Il tavolo della curatrice: lente, guanti bianchi, un panino al prosciutto incartato con la stessa cura di un manoscritto.", W: "Dalla finestra si vedono le Mura, rosse di tramonto. Sopra il Torrione, un punto nero che non sembra un uccello normale.", n: "Cartellino: «CAVALIERE DI LATTA · 1527 · ignoto · NON TOCCARE · neanche se ti chiama»", l: "Una lampada a stelo. Fa luce gialla sulle vetrine e ombre lunghe sulle lance." },
        npcs: () => [{ id: "lt_ottavia", at: [5, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "U"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          [[2, 1], [4, 1], [11, 1], [13, 1]].forEach(([x, y]) => put(x, y, "A")); put(8, 3, "A"); put(7, 4, "n");
          [[1, 4], [1, 6], [14, 4], [14, 6]].forEach(([x, y]) => put(x, y, "P")); put(6, 1, "L"); put(9, 1, "W"); put(11, 7, "T"); put(12, 7, "T"); [[3, 8], [12, 4]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "ARMERIA", d.X(8) + 8, d.Y(0) + 6, "#ddd6fe"); H.plaque(g, "1527", d.X(8) + 8, d.Y(3) - 12, "#fde68a"); }
      },
      lt_taverna: {
        interior: true, region: "taverna", name: "La Taverna del Gonfalone", short: "Taverna", sub: "Botti, torte e affari sottovoce", bg: "lt_taverna", w: 16, h: 11, start: [8, 9], outside: ["lt_piazza", 24, 19], base: "Y",
        act: { J: "Guarda le botti", u: "Guarda il bancone", T: "Guarda il tavolo", H: "Guarda il camino", b: "Siediti", W: "Guarda la finestra", z: "Guarda le casse" },
        flavor: { J: "Botti di rosso delle colline. Su una, col gesso: «NON APRIRE PRIMA DEL PALIO». Su un'altra: «NON APRIRE DOPO».", u: "Il bancone di Bacco: legno scuro, tre spillatori e una campanella che lui suona quando qualcuno paga. Suona poco.", T: "Un tavolo con le tacche dei pugni di cento discussioni sul Palio. Le tacche più profonde sono del 1983.", H: "Il camino acceso anche d'estate. Bacco dice che serve alla torta. La torta dice di no.", b: "Una panca lucida di pantaloni. Dall'altra parte del tavolo, qualcuno fa i conti a voce bassa.", W: "Dalla finestra: la piazza, la fontana, e le Mura che stasera sembrano più alte.", z: "Casse di mandorle e miele. La ricetta della torta, a quanto pare, è «tutto»." },
        npcs: () => [{ id: "lt_bacco", at: [5, 3] }, { id: "lt_mattonaro", at: [11, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(2, 2, 8, 2, "u"); lay(11, 1, 14, 1, "J"); put(1, 5, "H"); put(9, 1, "W");
          put(4, 6, "T"); put(4, 7, "T"); put(12, 6, "T"); put(12, 7, "T"); [[3, 6], [5, 7], [13, 7]].forEach(([x, y]) => put(x, y, "b")); [[1, 8], [14, 8]].forEach(([x, y]) => put(x, y, "z"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "TAVERNA", d.X(8) + 8, d.Y(0) + 6, "#fed7aa"); }
      }
    };
    return {
      n: N, title: "La sera del Palio", sub: "Un'armatura in prestito, una voce che cigola e un castello che si sveglia",
      goal, start: "lt_piazza", introBg: "lt_titolo", zones, talk,
      obj: {
        "lt_piazza:X": () => gate(),
        "lt_armeria:A:8,3": () => {
          const s = S();
          if (s === 1 && F.is("lt_ott1")) {
            setStep(N, 2); F.set("lt_armatura", true); K.questDone && K.questDone("lt_c1b");
            say("voce", "Sollevi l'elmo. Dentro il petto dell'armatura, in un incavo tondo, c'è un pallone di latta tutto ammaccato.");
            say("voce", "Infili le braccia, poi le gambe, poi l'elmo. CLANG. Le fibbie si chiudono da sole. Tutte insieme.");
            say("lt_ferro", "[sorpreso] Criiiiic! <em>(«Oh. Oh! Qualcuno. Finalmente. Hai dei piedi buoni, si sente. Io sono... aspetta. Non me lo ricordo.»)</em>");
            say("lt_ottavia", "[sorpreso] Ha... parlato? Toglila. Toglila subito. Perché non te la togli?");
            say("lt_ferro", "Cric-crac. <em>(«Perché non vuole. E se non vuole lei, non voglio neanch'io. Senti fuori: il castello si è svegliato.»)</em>");
            say("voce", "Dalla finestra: le Mura si accendono di torce. Elmi vuoti rotolano sul camminamento, e dal Torrione scende uno stormo di corvi con la maglia a righe.");
            quest("lt_c1c", "Il castello si è svegliato", "Sali sulle Mura dal portone a nord della piazza.");
            return done();
          }
          say("voce", s < 1 ? "Un'armatura del Cinquecento, chiusa in vetrina. Il cartellino dice «non toccare». È un ottimo consiglio." : s === 1 ? "La curatrice ti guarda. Prima parla con lei." : "La vetrina è vuota. L'armatura ce l'hai addosso, e cigola quando respiri."); done();
        }
      },
      intro: [["voce", "Castelrondine, il borgo sulla collina sopra il mare. Stasera c'è il Palio: quattro contrade, una corsa, un drappo dipinto e frittelle per tutti."], ["voce", "Sopra la piazza, le vecchie Mura del castello. Dicono che una volta all'anno, la sera del Palio, lassù si senta battere un pallone. Nessuno ci crede. Ancora."]]
    };
  }
  boot();
})();
