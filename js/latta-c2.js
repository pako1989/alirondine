// js/latta-c2.js - «IL PALLONE DI LATTA» · Capitolo 2: I tetti del Borgo
// Di notte la campana di San Rocco suona da sola: Sgrinfia, il gattone dei tetti, ha rubato il batacchio. La Bottega Stagnini riconosce il pallone di Ferro
// (lo fecero loro, nel 1527) e presta la scala lunga: secondo livello a scorrimento (I tetti del Borgo: comignoli che spingono in alto, tegole che cadono, gatti)
// e secondo capo (Sgrinfia, nel Campanile). Scelta finale: il batacchio torna al campanaro o finisce nel resort di Mattonaro.
(function () {
  "use strict";
  function boot() {
    const E = window.__lattaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__lattaH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__lattaH(K), { say, done, ask, wask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    H.cast("lt_rina", "Rina", "La gattara dei vicoli", { style: "long", hair: "#9ca3af", shirt: "#7c3aed", skin: "#e8c4a0", acc: ["sciarpa"], bg: ["#2e1065", "#fde047"] }, "Dà da mangiare a tutti i gatti di Castelrondine, anche a quelli che non esistono. Conosce Sgrinfia da quando era un gattino grande come una pagnotta.");
    K.cos("lt_c2", { kind: "shirt", label: "Maglia dei Tetti", val: "#1e1b4b", from: "Capitolo 2 del Pallone di Latta" });
    K.lore("l_stagnini", { t: "La Bottega Stagnini", d: "Lattonieri a Castelrondine dal Cinquecento: pentole, grondaie, lanterne. Nel registro del 1527 c'è un pallone di latta «per il cavaliere del Palio». Mai ritirato." });
    K.lore("l_campana", { t: "La campana di San Rocco", d: "Fusa nel 1527 per il Palio. Suona per i matrimoni, i funerali e i gol della Nazionale. Sul batacchio, inciso piccolo, un ragazzo che corre con un pallone." });
    K.lore("l_sgrinfia", { t: "Sgrinfia", d: "Il gatto più grosso del Borgo. Ruba ciò che luccica e ci dorme sopra. Rina dice che non è cattivo: è solo convinto che tutto sia suo." });

    const goal = (s) => ({
      0: "Notte nei vicoli. La campana di San Rocco suona da sola: parla col campanaro, sotto il campanile.",
      1: "Vai alla Bottega Stagnini (la casa a ovest, col comignolo) e chiedi la scala lunga.",
      2: "▶ LIVELLO A SCORRIMENTO: la scala è appoggiata accanto alla Bottega (scritta TETTI ▲). Sali sui tetti.",
      3: "Sgrinfia è nel Campanile: entra in chiesa e prendi la scala a chiocciola, in fondo alla sacrestia.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin(how) {
      setStep(N, 4); F.set("lt_c2_done", true);
      K.reward("lt_c2", { coins: 90, cos: "lt_c2" });
      K.finishChapter(N, how);
      const tobia = how === "tobia";
      K.scene(H.flush().concat([
        ["voce", tobia ? "Mezzanotte. La campana di San Rocco suona dodici colpi, giusti, col batacchio al suo posto. Nei vicoli si accendono le finestre una per una." : "Mezzanotte. La campana di San Rocco tace. Nella vetrina del Castello Resort, sotto un faretto, brilla un batacchio con l'etichetta del prezzo."],
        ["lt_ferro", "[pensa] Criiic... <em>(«Nino. Si chiamava Nino. Il garzone di Mastro Stagnini. Mi lanciava il pallone dai tetti, la sera del Palio, e io lo ripresi al volo davanti a tutti.»)</em>"],
        ["lt_ferro", "[serio] Cric. <em>(«Gli promisi che sarei tornato a pagarlo. Poi è successa una cosa. Non me la ricordo. So solo che non sono tornato, e che lui mi ha aspettato sul tetto.»)</em>"],
        ["hero", "Lo scopriremo, Ferro. Un tetto alla volta."],
        ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>🛡️ Onore ${K.stat("onore")} · 🪙 Affari ${K.stat("affari")} · 🚩 Stendardi ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Il Capitolo 3 ti aspetta: le cantine del castello, dove il Palio del 1527 è finito davvero."]
      ]), () => K.openMain(), "lt_vicoli");
    }
    function choice() {
      K.inv.give("lt_batacchio");
      say("voce", "Tra le zampe di Sgrinfia, che ora fa le fusa, il batacchio di bronzo. Inciso piccolo, un ragazzo che corre con un pallone.");
      say("lt_mattonaro", "[furbo] Cavaliere! Che coincidenza, passavo dal campanile alle undici e mezza di notte. Quel batacchio è un pezzo unico. Lo metterei alla reception: «suonate per il servizio in camera».");
      say("lt_mattonaro", F.is("lt_patto") ? "Abbiamo un accordo, ricordi? Duecento monete. E l'accordo diventa amicizia." : "Duecento monete. Contanti, subito, e nessuno chiede niente al campanaro.");
      return wask("Tobia ti guarda dalla scala, col berretto in mano. Mattonaro ha già il portafoglio aperto.", [
        { label: "🛡️ «Torna alla campana.»", sub: "Il batacchio a Tobia", w: { onore: 2 }, fn: () => { K.inv.take("lt_batacchio"); K.rel.add("lt_tobia", 4); F.set("lt_campana_ok", true); say("lt_tobia", "[commosso] Cinquant'anni che la suono. Credevo di averla persa nell'unica notte in cui c'era bisogno di lei. Grazie, cavaliere."); say("lt_mattonaro", "[serio] Romantico. I romantici non hanno mai fatto un parcheggio."); fin("tobia"); } },
        { label: "🪙 Vendilo a Mattonaro", sub: "+200 monete", w: { affari: 2 }, fn: () => { K.inv.take("lt_batacchio"); K.coinsGive && K.coinsGive(200); F.set("lt_campana_venduta", true); say("lt_mattonaro", "[ride] Lo sapevo che eri uno pratico! Alla reception farà un figurone."); say("lt_ferro", "Cric. <em>(«Quel ragazzo inciso sul bronzo. Era Nino. Lo hai appena venduto a uno che vende idromassaggi.»)</em>"); say("lt_tobia", "[triste] La compreremo un'altra, dicono. Le campane non si comprano. Si ascoltano."); fin("mattonaro"); } }
      ]);
    }
    function tetti() {
      H.level("tetti", "Criiic! <em>(«I tetti! Di notte! Attento ai comignoli: il fumo ti spinge su. È l'unico ascensore del Cinquecento.»)</em>", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          say("voce", "Dal colmo dell'ultimo tetto vedi Sgrinfia: un gattone grosso come un cane, che si infila nella cella campanaria con il batacchio in bocca.");
          say("voce", "I gatti dei tetti, spaventati dal cavaliere che cigola, scappano tutti insieme. La porta della scala a chiocciola, in sacrestia, ora è libera.");
          if (r.ban) say("lt_ferro", `[felice] Cric! <em>(«${r.ban} stendardi di Gelsa anche lassù. I corvi li hanno sparsi su tutto il Borgo.»)</em>`);
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Mancano degli stendardi: dal menu, 🏰 Livelli a scorrimento, puoi rigiocare il livello.");
          quest("lt_c2c", "Sgrinfia nel Campanile", "Entra nella chiesa di San Rocco e sali dalla scala a chiocciola in sacrestia.");
          return done();
        }
        say("lt_ferro", r.quit ? "Cric. <em>(«Scendiamo. Anche i gatti si riposano, ogni tanto. Raramente.»)</em>" : "Criiic... <em>(«Giù dal tetto. Le tegole erano d'accordo coi gatti, ne sono sicuro.»)</em>"); done();
      });
    }
    function campanile() {
      H.level("campanile", "Crac! <em>(«Sgrinfia corre, si acquatta e salta. Quando atterra resta stordito: è lì che gli salti in testa. Quando si acquatta, scappa sui comignoli.»)</em>", (r) => {
        if (r.win) { say("voce", "Sgrinfia rotola su se stesso, ti guarda offeso e poi, incredibilmente, comincia a fare le fusa. Rina arriva col fiatone e una scatoletta di tonno."); say("lt_rina", "[felice] Non gli hai fatto male! Lo sapevo, che un cavaliere vero non fa male ai gatti. Solo ai corvi, un pochino."); return choice(); }
        say("lt_ferro", "Criiic. <em>(«Nove vite lui, una io. Non è giusto. Riproviamo.»)</em>"); done();
      });
    }
    function ladder() {
      const s = S();
      if (s < 2) { say("voce", s === 0 ? "Una scala corta appoggiata al muro. Arriva al primo davanzale, non ai tetti." : "Questa scala è troppo corta. Zeno, il lattoniere, ha quella lunga per le grondaie."); return done(); }
      if (s === 2) return ask("La scala lunga di Zeno arriva fino alle grondaie. Lassù: comignoli che fumano, tegole smosse, gatti.", [
        { label: "🌙 Sali sui tetti", sub: "Livello a scorrimento · I tetti del Borgo", big: true, cls: "hot", fn: tetti },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Dai tetti si vede la cella campanaria. La strada vera, adesso, è dalla sacrestia.", [
        { label: "🌙 Rigioca i tetti", sub: "Per gli stendardi mancanti", fn: tetti },
        { label: "↩ Scendi", fn: done }
      ]);
      say("voce", "I tetti sono tranquilli. Dal menu, 🏰 Livelli a scorrimento, rigiochi i livelli superati."); done();
    }
    function stairs() {
      const s = S();
      if (s < 3) { say("voce", "La porta della scala a chiocciola è bloccata. Da dietro, un coro di miagolii. Una ventina di gatti ci dorme contro."); return done(); }
      if (s === 3) return ask("Centotré gradini. In cima, due occhi gialli e un batacchio che luccica.", [
        { label: "🔔 Sali nel Campanile", sub: "Capo · Sgrinfia", big: true, cls: "hot", fn: campanile },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", F.is("lt_campana_ok") ? "La scala a chiocciola. In cima, la campana col suo batacchio. Tobia la lucida col gomito." : "La scala a chiocciola. In cima, una campana muta."); done();
    }
    window.__lattaFerroC2 = () => {
      const s = S();
      say("lt_ferro", s === 0 ? "Cric. <em>(«Questa campana la conosco. Suonava il giorno del Palio. Suonava per me. O contro di me, non ricordo.»)</em>" : s === 1 ? "Criiic. <em>(«Stagnini... Stagnini. Il nome mi fa male al petto. Dove c'è il pallone.»)</em>" : s === 2 ? "Cric-crac. <em>(«Sui tetti si correva meglio che per strada. Niente carri, niente preti, niente corvi. Be', quasi niente corvi.»)</em>" : s === 3 ? "Crac. <em>(«Un gatto che ruba un batacchio. Nel 1527 avremmo chiamato un esorcista. O un altro gatto.»)</em>" : "Cric. <em>(«Nino mi aspettava sul tetto. Io lo sento ancora, il tetto, sotto i piedi.»)</em>");
      done();
    };

    const talk = {
      lt_tobia() {
        if (K.rel.scene("lt_tobia")) return;
        const s = S();
        if (s === 0) {
          say("lt_tobia", "[sorpreso] Un'armatura che cammina. Bene. Stanotte non mi stupisco più di niente. Senti? DON. Senti? DON.");
          say("lt_tobia", "La campana suona da sola, e non può: il batacchio non c'è. Me l'ha rubato Sgrinfia, il gattone dei tetti. Lo so perché ha lasciato i peli. Arancioni. Tantissimi.");
          say("lt_tobia", "La scala a chiocciola è piena di gatti che dormono, e non si spostano per un campanaro. Ma dai tetti si arriva alla cella. Serve la scala lunga di Zeno, il lattoniere.");
          K.learnLore("l_campana"); setStep(N, 1); quest("lt_c2", "Il batacchio rubato", "Vai alla Bottega Stagnini e chiedi la scala lunga.");
          return done();
        }
        say("lt_tobia", s === 1 ? "Zeno ha la bottega a ovest, quella col comignolo che fuma sempre. Digli che ti mando io: ti farà lo sconto sul niente." : s === 2 ? "La scala ce l'hai? Allora su. Io ti guardo da qui e prego. Non per te: per le tegole." : s === 3 ? "Dalla sacrestia, cavaliere. I gatti sono scappati, la porta è libera." : F.is("lt_campana_ok") ? "[felice] Senti come suona? Era muta da tre ore e mi sembravano tre anni." : "Le campane non si comprano, cavaliere. Si ascoltano."); done();
      },
      lt_zeno() {
        if (K.rel.scene("lt_zeno")) return;
        const s = S();
        if (s === 1 && !F.is("lt_zen1")) {
          F.set("lt_zen1", true);
          say("lt_zeno", "[sorpreso] Un'armatura in bottega, a quest'ora. Ripari? Ammaccature? Aspetta. Fermo lì. Girati verso la fucina.");
          say("lt_zeno", "Quel pallone nel petto. Le cuciture a punto rovescio, la latta battuta a scaglie. Questo l'abbiamo fatto noi. La mia famiglia. Cinque secoli fa.");
          say("voce", "Zeno sfoglia un registro con la copertina di pelle mangiata dai topi, fino a una pagina gialla come una foglia d'autunno.");
          say("lt_zeno", "«Anno 1527. Fatto un pallone di latta per il cavaliere del Palio. Pagato un fiorino e una promessa. La promessa non l'ha mantenuta: non è tornato a ritirarlo.» Firmato, Mastro Stagnini.");
          say("lt_ferro", "[serio] ...Criiic. <em>(«Non è tornato a ritirarlo. Non sono tornato. Perché non sono tornato?»)</em>");
          K.learnLore("l_stagnini"); K.inv.give("lt_pagina");
          return wask("Zeno ti tende la pagina, e poi la scala lunga.", [
            { label: "🛡️ «Lasciami guardare il pallone, se vuoi.»", sub: "Zeno lo esamina", w: { onore: 1 }, fn: () => { K.rel.add("lt_zeno", 3); say("lt_zeno", "[commosso] Cinque secoli e tiene ancora la forma. Mio nonno diceva: la latta buona dura più di chi la paga. Prendi la scala. E torna intero."); setStep(N, 2); K.questDone && K.questDone("lt_c2"); quest("lt_c2b", "Sui tetti", "La scala è accanto alla Bottega: sali sui tetti."); done(); } },
            { label: "🪙 «Quanto vale un pallone Stagnini del 1527?»", sub: "+40 monete di anticipo", w: { affari: 1 }, fn: () => { K.coinsGive && K.coinsGive(40); say("lt_zeno", "[triste] Valere? Vale una promessa. Ma va bene, tieni quaranta monete per le grondaie che pulirai lassù. La scala è fuori."); setStep(N, 2); K.questDone && K.questDone("lt_c2"); quest("lt_c2b", "Sui tetti", "La scala è accanto alla Bottega: sali sui tetti."); done(); } }
          ]);
        }
        say("lt_zeno", s < 1 ? "Pentole, grondaie, lanterne. Chiuso per Palio, ma la fucina non chiude mai." : s === 1 ? "Il registro, il registro..." : s === 2 ? "La scala è fuori, appoggiata al mio muro. Se rompi una tegola, la rifacciamo. Se rompi te, è più complicato." : "Mastro Stagnini aspettava un cavaliere. Adesso il cavaliere è tornato. Con cinquecento anni di ritardo, ma è tornato."); done();
      },
      lt_rina() {
        if (K.rel.scene("lt_rina")) return;
        const s = S();
        if (!F.is("lt_rin1")) {
          F.set("lt_rin1", true); K.learnLore("l_sgrinfia");
          say("lt_rina", "[furbo] Cerchi Sgrinfia? Non è cattivo. È solo convinto che tutto sia suo. Anche il batacchio. Anche il campanile. Anche te, se luccichi.");
          say("lt_rina", "Quando salta, atterra come un sacco di patate e resta intontito. È lì che lo prendi. Ma senza fargli male, eh. Promettimelo.");
          return wask("Rina ti guarda con trenta gatti dietro di lei.", [
            { label: "🛡️ «Promesso.»", w: { onore: 1 }, fn: () => { K.rel.add("lt_rina", 3); say("lt_rina", "[felice] Lo sapevo. I gatti sentono le persone buone. E le armature buone, a quanto pare."); done(); } },
            { label: "«Dipende da lui.»", fn: () => { say("lt_rina", "Dipende sempre da loro. È il primo segreto dei gatti. Il secondo non te lo dico."); done(); } }
          ]);
        }
        say("lt_rina", s >= 4 ? "Sgrinfia dorme sul mio divano, adesso. Sul batacchio no, purtroppo. Lo cerca ancora, ogni tanto." : "Se vedi un gatto con la sciarpa rossa, salutalo. È educato. Morde, ma è educato."); done();
      },
      lt_mattonaro() {
        if (K.rel.scene("lt_mattonaro")) return;
        const s = S();
        if (s >= 1 && !F.is("lt_mat2")) {
          F.set("lt_mat2", true);
          say("lt_mattonaro", "[furbo] Cavaliere! Anche io faccio due passi di notte. Guardo i tetti, conto i metri quadri. Lo sai che il campanile ha una vista meravigliosa?");
          say("lt_mattonaro", "«Suite Campanaria». Letto a baldacchino, vasca idromassaggio dove ora c'è la corda. Il campanaro? Lo assumo come portiere. Gli darei pure un berretto nuovo.");
          say("lt_ferro", "Cric. <em>(«Quest'uomo vuole mettere una vasca in un campanile. Nel 1527 lo avremmo chiuso in una botte.»)</em>");
          return done();
        }
        say("lt_mattonaro", F.is("lt_patto") ? "Ricorda il nostro accordo, cavaliere. Le cose vecchie e luccicanti, prima a me." : "Il Borgo dorme, e io sogno. In metri quadri, ma sogno."); done();
      }
    };

    const zones = {
      lt_vicoli: {
        region: "notte", name: "I vicoli di San Rocco", short: "Vicoli", sub: "Castelrondine, a mezzanotte meno qualcosa", bg: "lt_vicoli", time: "notte", w: 30, h: 22, base: "Q", start: [14, 19],
        itemCos: "lt_c2", items: [[2, 3], [27, 3], [12, 20], [27, 19]],
        areas: [[3, 4, 10, 9, "La Bottega Stagnini"], [18, 3, 26, 9, "La chiesa di San Rocco"], [12, 10, 17, 13, "La fontanella"], [2, 13, 9, 18, "Il vicolo dei gatti"], [0, 0, 29, 21, "Castelrondine di notte"]],
        act: { R: "Sali sui tetti", F: "Guarda la fontanella", n: "Leggi il cartello", l: "Guarda la lanterna", b: "Siediti", t: "Guarda l'albero", s: "Riposa un momento", q: "Entra" },
        flavor: {
          I: "Le Mura del castello, nere contro il cielo. Lassù, ogni tanto, un fischio. I corvi non dormono mai.",
          F: "Una fontanella di ghisa a forma di leone. L'acqua esce dalla bocca. Di notte sembra che il leone sbadigli.",
          n: "Cartello: «VICOLO DI SAN ROCCO · Vietato dare da mangiare ai gatti · (sotto, a pennarello) Rina, dico a te»",
          l: "Una lanterna a muro. I gatti si siedono sotto, a turno, per scaldarsi.",
          b: "Una panchina. Ci dorme sopra un gatto grigio che finge di non vederti.",
          t: "Un fico sul muro. I gatti ci salgono per arrivare ai tetti. Tu sei troppo pesante. E di latta.",
          s: "Un gradino tiepido davanti a una porta. Ci si siede chi aspetta qualcuno."
        },
        npcs: (s) => (s < 3 ? [{ id: "lt_tobia", at: [20, 10] }] : []).concat([{ id: "lt_rina", at: [8, 16] }]).concat(s >= 1 ? [{ id: "lt_mattonaro", at: [24, 12] }] : []),
        intro: [["voce", "Notte su Castelrondine. Il Palio è finito, le frittelle pure. Nei vicoli restano i gatti, le lanterne e una campana che suona senza batacchio."], ["voce", "A ovest la Bottega Stagnini, col comignolo che fuma sempre. A est la chiesa di San Rocco, col campanile. Sotto il campanile, un uomo col berretto in mano."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I");
          lay(0, 2, 0, 21, "t"); lay(29, 2, 29, 21, "t"); lay(1, 21, 28, 21, "t");
          house(3, 4, 7, 5, { door: [6, 8], roof: "#57534e", wall: "#d6cfc4", chimney: true, enter: { to: "lt_bottega", at: [8, 9] } });
          put(10, 7, "R");
          house(18, 3, 8, 6, { door: [21, 8], roof: "#3a2a4a", wall: "#cfc6e0", enter: { to: "lt_sacrestia", at: [8, 9] } });
          house(3, 13, 5, 4, { door: [5, 16], roof: "#1d4ed8", wall: "#fef3c7", enter: "La casa di Rina. Dalla finestra, ciotole in fila come in una mensa, e un gatto bianco che controlla gli ingressi." });
          house(22, 14, 5, 4, { door: [24, 17], roof: "#7c2d12", wall: "#f5deb3", chimney: true, enter: "Una casa chiusa, con un cartello: «VENDESI · Castello Resort & Spa». Il cartello è nuovo. La porta no." });
          put(14, 11, "F"); put(15, 11, "F");
          [[12, 4], [16, 9], [11, 12], [19, 12], [14, 17]].forEach(([x, y]) => put(x, y, "l"));
          put(13, 15, "b"); put(16, 6, "n"); put(17, 19, "s"); [[2, 11], [27, 11], [9, 19]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) {
          const s = S(), on = s === 2, bl = on && Math.floor(Date.now() / 450) % 2;
          H.plaque(g, on ? "▶ LIVELLO: TETTI ▲" : "TETTI ▲", d.X(10) + 8, d.Y(7) - 18, bl ? "#fef08a" : "#c4b5fd");
          if (on) { g.save(); g.globalAlpha = 0.35 + 0.35 * Math.abs(Math.sin(Date.now() / 300)); g.strokeStyle = "#fde047"; g.lineWidth = 2; g.strokeRect(d.X(10) - 2, d.Y(7) - 12, 20, 30); g.restore(); }
          H.plaque(g, "BOTTEGA STAGNINI", d.X(6) + 8, d.Y(4) - 6, "#fdba74"); H.plaque(g, "SAN ROCCO 🔔", d.X(21) + 8, d.Y(3) - 6, "#c4b5fd"); H.plaque(g, "RINA", d.X(5) + 8, d.Y(13) - 6, "#fde047");
        }
      },
      lt_bottega: {
        interior: true, region: "bottega", name: "La Bottega Stagnini", short: "Bottega", sub: "Latta, fucina e un registro di cinque secoli", bg: "lt_bottega", w: 16, h: 11, start: [8, 9], outside: ["lt_vicoli", 6, 9], base: "Y",
        act: { O: "Guarda il banco", N: "Guarda lo scaffale", H: "Guarda la fucina", L: "Leggi il registro", W: "Guarda la finestra", l: "Guarda la lampada" },
        flavor: { O: "Il banco di Zeno: incudine, cesoie, e mezzo pallone di latta lucido. «Per il museo», dice. «Per me», pensa.", N: "Barattoli, imbuti, lanterne, una caffettiera a forma di gallina. Tutto di latta, tutto fatto qui.", H: "La fucina. Zeno dice che non si è mai spenta dal Cinquecento. Sua moglie dice che l'ha accesa lui stamattina.", L: "Registri di bottega, uno per secolo. Il più vecchio ha la copertina mangiata dai topi e le pagine che sanno di ferro.", W: "Dalla finestra: i tetti del Borgo, uno dopo l'altro come onde. Su uno, due occhi gialli.", l: "Una lanterna di latta traforata: sul muro proietta stelle che tremano." },
        npcs: () => [{ id: "lt_zeno", at: [7, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          put(12, 1, "H"); [[2, 1], [3, 1], [13, 1], [14, 1]].forEach(([x, y]) => put(x, y, "N")); put(6, 1, "W"); put(1, 6, "L");
          put(5, 4, "O"); put(6, 4, "O"); put(11, 6, "O"); [[3, 8], [12, 8]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "STAGNINI · DAL 1500", d.X(8) + 8, d.Y(0) + 6, "#fdba74"); }
      },
      lt_sacrestia: {
        interior: true, region: "sacrestia", name: "La sacrestia di San Rocco", short: "Sacrestia", sub: "Candele, vetrate e una corda che si muove da sola", bg: "lt_sacrestia", w: 16, h: 11, start: [8, 9], outside: ["lt_vicoli", 21, 9], base: "U",
        act: { G: "Sali nel Campanile", W: "Guarda la vetrata", L: "Guarda l'armadio", T: "Guarda il tavolo", b: "Siediti", l: "Guarda la candela" },
        flavor: { W: "La vetrata: un santo con un pallone sotto il braccio. Il parroco giura che è una pagnotta. Ha le cuciture.", L: "L'armadio dei paramenti. Odora di cera, di naftalina e di cinquant'anni di prediche lunghe.", T: "Un tavolo con un registro dei battesimi e una tazza di camomilla fredda. Tobia la dimentica sempre.", b: "Una panca di legno consumata. Tobia ci si siede tra un rintocco e l'altro.", l: "Candele accese davanti a un santo piccolo. Una è per qualcuno di nome Ada." },
        npcs: (s) => (s >= 3 ? [{ id: "lt_tobia", at: [10, 5] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "U"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          put(13, 2, "G"); put(7, 1, "W"); put(8, 1, "W"); put(2, 1, "L"); put(4, 6, "T"); put(5, 6, "T"); put(9, 7, "b"); [[3, 8], [12, 8]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) { const s = S(); H.plaque(g, s === 3 ? "▶ CAMPANILE" : "CAMPANILE", d.X(13) + 8, d.Y(2) - 8, s === 3 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#c4b5fd"); }
      }
    };
    return {
      n: N, title: "I tetti del Borgo", sub: "Una campana senza batacchio, un gattone ladro e una bottega che si ricorda di Ferro",
      goal, start: "lt_vicoli", introBg: "lt_vicoli", zones, talk,
      obj: {
        "lt_vicoli:R": () => ladder(),
        "lt_sacrestia:G": () => stairs()
      },
      intro: [["voce", "La sera del Palio è finita. Il Corvo Maggiore è volato via, le contrade sono tornate a litigare a casa loro. Ma l'armatura non si apre."], ["lt_ferro", "Cric. <em>(«Non guardarmi così. Neanche io so come si apre. Nel 1527 c'era un tizio apposta. Credo.»)</em>"], ["voce", "Poi, a mezzanotte meno un quarto, la campana di San Rocco comincia a suonare. Da sola."]]
    };
  }
  boot();
})();
