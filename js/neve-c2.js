// js/neve-c2.js - «IL GUARDIANO DI NEVE» · Capitolo 2: Il canalone delle valanghe
// La mattina dopo. Olmo racconta di Aurelio Rovere, il suo secondo portiere, sparito nel canalone la notte della finale del '79; la «Regina» è Ilde, la sorella.
// Don Fulvio ha la chiave del cancello del canalone (e un peso sulla coscienza). Due salite: il canalone (palle di valanga, stalattiti) e la valanga che insegue.
// In cima, il Rifugio Stella e il libro delle firme: l'ultima riga del 1979 e una riga nuova, di Ilde.
(function () {
  "use strict";
  function boot() {
    const E = window.__neveCore;
    if (!E || !E.api || !E.api.addChapter || !window.__neveH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__neveH(K), { say, done, ask, wask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("gn_c2", { kind: "shirt", label: "Giacca da soccorso alpino", val: "#c2410c", from: "Capitolo 2 del Guardiano di Neve" });
    K.lore("l_aurelio", { t: "Aurelio Rovere", d: "Secondo portiere degli Stambecchi nel 1979. Diciannove anni, mani grandi, un sorriso storto. La notte della finale salì al Rifugio Stella e non tornò: la valanga del canalone. Sul cimitero di Valdigelo c'è la sua lapide. Sotto, nessuno." });
    K.lore("l_nastro", { t: "Il nastro del '79", d: "La cassetta della finale, mangiata a metà. Al 70' Olmo resta a terra, si tiene il ginocchio. Ai rigori, nella bufera, il portiere ha la maglia numero 1. Ma quando si tuffa, da sotto, spunta un'altra maglia. Si legge un 2." });
    K.lore("l_eco", { t: "L'Eco delle Valli, 14 dicembre 1979", d: "Titolo: «VALDIGELO NELLA LEGGENDA! Brina para l'ultimo rigore nella bufera». Foto: Olmo, sorridente, col ginocchio fasciato. In fondo alla pagina, sei righe: «Disperso un giovane nel canalone»." });
    K.lore("l_rifugio", { t: "Il libro del Rifugio Stella", d: "Ultime firme del 1979, il 13 dicembre: una mano grande, una piccola. «Abbiamo vinto. Domani lo dico a tutti. A.» E sotto, una F. Poi niente, per quarantacinque anni. Poi, la settimana scorsa: «Ho la Coppa. Venga lui a prenderla. I.»" });

    const goal = (s) => ({
      0: "La mattina dopo. Olmo è sceso al campo della Partita, sulla panchina a sinistra: parlagli.",
      1: "Il cancello del canalone (a nord, dietro il campo) è chiuso dal 1979. La chiave ce l'ha Don Fulvio: la chiesa è in alto a sinistra. (Alla Pro Loco, in basso a destra, Lilli ha un videoregistratore.)",
      2: "▶ LIVELLO A SCORRIMENTO: il cancello del canalone (a nord, scritta CANALONE ▲). Palle di valanga e stalattiti.",
      3: "Sopra il canalone, la neve è carica. Torna al cancello: verso il Rifugio Stella.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      setStep(N, 4); F.set("gn_c2_done", true);
      K.reward("gn_c2", { coins: 110, cos: "gn_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Passi la notte nel rifugio, sotto due coperte e il rumore del vento. A mezzanotte la radiolina gracchia."],
        ["gn_olmo", "[serio] Sei vivo? Bene. Allora domani sali al ghiacciaio. Io ti parlo da qui. E stavolta... stavolta ti racconto anche il resto."],
        ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>🕯️ Verità ${K.stat("verita")} · ⭐ Leggenda ${K.stat("leggenda")} · ❄️ Stelle alpine ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Il Capitolo 3 ti aspetta: la notte del '79."]
      ]), () => K.openMain(), "gn_rifugio_in");
    }
    function finale() {
      K.learnLore("l_rifugio"); K.inv.give("gn_pagina");
      say("voce", "La valanga si ferma a dieci metri da te, sbuffando come un cavallo stanco. Davanti, nel buio, una casa di sassi con la scritta RIFUGIO STELLA. La porta è aperta. La stufa è calda.");
      say("voce", "Sul tavolo, il libro delle firme. Le ultime del 1979, del 13 dicembre: una mano grande, una piccola. «Abbiamo vinto. Domani lo dico a tutti. A.» Sotto, una F tremante.");
      say("voce", "Poi quarantacinque anni di pagine bianche. E una riga nuova, a inchiostro fresco, in una calligrafia antica e dritta: «Ho la Coppa. Venga lui a prenderla. I.»");
      say("gn_olmo", "[serio] <em>(radiolina)</em> ...Ci sei? Cosa c'è scritto? Leggimelo.");
      return wask("La radiolina gracchia. Olmo aspetta.", [
        { label: "🕯️ Leggi tutto, anche la riga di Ilde", w: { verita: 2 }, fn: () => { F.set("gn_letto_olmo", true); say("gn_olmo", "[commosso] «Venga lui». ...Quarantacinque anni e la calligrafia è la stessa. Ilde scriveva i biglietti per la squadra, sai. Il menù delle trasferte. «Venga lui.»"); say("gn_olmo", "[serio] Va bene. Vengo. Non so come, con queste ginocchia. Ma vengo."); fin(); } },
        { label: "⭐ «Solo firme vecchie. La Coppa è più su.»", w: { leggenda: 2 }, fn: () => { F.set("gn_taciuto", true); say("gn_olmo", "[pensa] Firme vecchie. Va bene. ...Sai che hai una voce strana, quando dici le bugie? Come i rigoristi prima di tirare. Va bene lo stesso. Dormi."); fin(); } },
        { label: "«Ilde la aspetta. Lei.»", w: { verita: 1, leggenda: 1 }, fn: () => { F.set("gn_letto_olmo", true); say("gn_olmo", "[serio] Me. Lo so. È da quarantacinque anni che mi aspetta. Io ho fatto il portiere: so aspettare. Non so andare incontro."); fin(); } }
      ]);
    }
    function canalone() {
      H.level("canalone", "Il canalone. Tieniti a destra della valle e guarda in alto: le stalattiti tremano prima di cadere. E le palle di valanga crescono mentre rotolano: prendile da piccole.", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          say("gn_olmo", "[felice] <em>(radiolina)</em> Sei passato. Nel '79 il canalone lo facevamo in quaranta minuti, Aurelio in trenta. Correva sempre, quel ragazzo. Anche in porta.");
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Mancano delle stelle alpine: dal menu, 🏔️ Livelli a scorrimento, puoi rigiocare la salita quando vuoi.");
          say("voce", "Sopra il canalone, il pendio è carico di neve fresca. Fa un rumore sordo sotto i piedi, come un tamburo. Olmo dice che è un brutto rumore.");
          quest("gn_c2c", "La valanga", "Torna al cancello del canalone e sali verso il Rifugio Stella.");
          return done();
        }
        say("gn_olmo", r.quit ? "<em>(radiolina)</em> Torna giù. La montagna ti aspetta: è l'unica che non ha mai fretta." : "<em>(radiolina)</em> Il canalone non perdona. Ma riprova. Il canalone non ricorda."); done();
      });
    }
    function valanga() {
      H.level("valanga", "Senti? Quel rumore. Non fermarti per nessun motivo. Quando parte, CORRI. Salta, plana, ma non guardare indietro.", (r) => {
        if (r.win) return finale();
        say("gn_olmo", "<em>(radiolina)</em> Ti ha preso. Ti ha sputato fuori, però: la valanga è come il mister, sbraita ma ti rimanda in campo. Riprova."); done();
      });
    }
    function gate() {
      const s = S();
      if (s < 2) { say("voce", s === 0 ? "Il cancello del canalone. Lucchetto arrugginito, catena, un cartello del Comune: «CHIUSO PER PERICOLO VALANGHE · 14-12-1979». Prima parla con Olmo." : "Lucchetto chiuso. La chiave ce l'ha Don Fulvio, in chiesa."); return done(); }
      if (s === 2) return ask("La chiave di Don Fulvio gira con un rumore di quarantacinque anni. Il cancello si apre su un canalone stretto e ripido, bianco tra due pareti di roccia.", [
        { label: "🏔️ Sali nel canalone", sub: "Livello a scorrimento · Il canalone delle valanghe", big: true, cls: "hot", fn: canalone },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Sopra il canalone la neve fresca è gonfia come una pagnotta. Fa paura anche guardarla.", [
        { label: "🌨️ Sali verso il rifugio", sub: "Livello a scorrimento · La valanga (ti insegue!)", big: true, cls: "hot", fn: valanga },
        { label: "🏔️ Rigioca il canalone", sub: "Per le stelle alpine mancanti", fn: canalone },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "Il cancello resta aperto. Dal menu, 🏔️ Livelli a scorrimento, rigiochi le salite superate."); done();
    }
    function tape() {
      if (F.is("gn_n12")) { say("gn_lilli", "Rivediamola? Tanto si vede solo neve. E il 2. Io il 2 l'ho visto. Il nonno dice che è un 1 storto."); return done(); }
      if (!K.inv.has("gn_cassetta")) { K.inv.give("gn_cassetta"); say("gn_lilli", "[felice] La cassetta del nonno! Ce l'ho io: l'ho presa dal baule stanotte, mentre lui dormiva sulla stube. Non dirglielo. Cioè, diglielo, ma dopo."); }
      F.set("gn_n12", true); K.learnLore("l_nastro"); K.stat && K.bond && K.bond("verita", 1);
      say("voce", "Lilli infila la cassetta nel videoregistratore e riavvolge il nastro con una matita, con la bravura di chi l'ha fatto cento volte. Lo schermo si riempie di neve. Poi, sotto la neve, un campo.");
      say("voce", "Settantesimo minuto. Un portiere enorme resta a terra a centrocampo, si tiene il ginocchio. Gente intorno. Il nastro salta.");
      say("voce", "Rigori. Bufera. Il portiere ha la maglia numero 1, larga. Ultimo rigore: si butta a destra, la palla prende il palo. E mentre è a terra, il vento gli alza la maglia: sotto ce n'è un'altra. Verde. Si legge un 2.");
      say("voce", "Il videoregistratore fa un rumore di pentola, e si mangia il resto del nastro.");
      say("gn_lilli", "[pensa] Visto? Il 2. Il nonno ha l'1. Allora chi è quello col 2? ...Il nonno dice che è un 1 storto. Il nonno, quando dice una cosa due volte, la dice per convincere sé stesso.");
      done();
    }

    const talk = {
      gn_olmo() {
        if (K.rel.scene("gn_olmo")) return;
        const s = S();
        if (s === 0) {
          say("gn_olmo", "[serio] Siediti. Sulla neve no: sulla panchina. Ho spazzato io, con la manica. È l'unica cosa che riesco ancora a spazzare.");
          say("gn_olmo", "La sciarpa con la A. Te lo devo. Aurelio Rovere. Il mio secondo portiere, nel '79. Diciannove anni, mani grandi, rideva sempre storto. La notte della finale salì al Rifugio Stella a festeggiare.");
          say("gn_olmo", "[triste] Il canalone venne giù alle due di notte. Lo cercammo per tre settimane. Al cimitero c'è la sua lapide, dietro il campo. Sotto non c'è nessuno. C'è solo la neve di quell'anno.");
          say("gn_olmo", "La «Regina» di cui parla lo yeti... è Ilde, sua sorella. Vive lassù da allora, sopra il ghiacciaio. Non scende mai. Se la Coppa è da lei, si passa dal canalone. Il cancello l'hanno chiuso il giorno dopo. La chiave ce l'ha Don Fulvio.");
          K.learnLore("l_aurelio"); setStep(N, 1); quest("gn_c2", "Il canalone delle valanghe", "Vai in chiesa da Don Fulvio a chiedere la chiave del cancello del canalone.");
          return wask("Olmo guarda il campo spalato, non te.", [
            { label: "🕯️ «Perché Ilde ha voluto proprio la Coppa?»", w: { verita: 1 }, fn: () => { say("gn_olmo", "[serio] Chiedilo a lei. Io lo so, ma se te lo dico io, è una cosa. Se te lo dice lei, è un'altra. E quella giusta è la seconda."); done(); } },
            { label: "⭐ «Riporto la Coppa per la partita. Il resto è vostro.»", w: { leggenda: 1 }, fn: () => { say("gn_olmo", "[pensa] Bravo. Il portiere para quello che arriva, non quello che è già passato. ...L'ho detto io, questo. Una volta. Non so più se ci credo."); done(); } }
          ]);
        }
        say("gn_olmo", s === 1 ? "Don Fulvio è in chiesa, in alto a sinistra. Digli che ti mando io. Ti darà la chiave. Forse ti darà anche altro: lui ha sempre avuto bisogno di dire le cose a qualcuno." : s < 4 ? "[serio] La radiolina è accesa. Io sono qui, sulla panchina. Il campo mi tiene compagnia: è l'unico posto dove le ginocchia non mi fanno male. Strano, no?" : "Vai. Io resto qui."); done();
      },
      gn_fulvio() {
        if (K.rel.scene("gn_fulvio")) return;
        const s = S();
        if (s === 1) {
          say("gn_fulvio", "[serio] La chiave del canalone. Te l'ha detto Olmo. Ce l'ho qui, nel tabernacolo: è l'unico posto dove nessuno guarda. Nemmeno io.");
          say("gn_fulvio", "Siediti. Prima della chiave ti devo una cosa. La devo a qualcuno da quarantacinque anni, e tu sei qui. Dio mi perdonerà la scorciatoia.");
          say("gn_fulvio", "[triste] Quella notte ero con Aurelio. Avevamo bevuto: grappa, la Coppa piena di grappa. Salimmo al rifugio a festeggiare. Lui voleva scrivere una cosa sul libro delle firme. Una cosa importante, diceva. Io ero troppo ubriaco per chiedere cosa.");
          say("gn_fulvio", "Io scesi prima. Lui restò. Alle due sentii il canalone venire giù, da casa. E non chiamai nessuno. Fino all'alba. Avevo paura di dire che eravamo saliti lassù di notte, ubriachi, con la Coppa. Avevo diciannove anni e paura di mio padre.");
          say("gn_fulvio", "[serio] Sei ore. Forse non sarebbe cambiato niente. Forse sì. Il seminario l'ho cominciato in primavera. Non per vocazione, all'inizio. Te l'ho detto.");
          F.set("gn_chiave", true); K.inv.give("gn_chiave"); setStep(N, 2); K.questDone && K.questDone("gn_c2");
          quest("gn_c2b", "Il canalone", "Apri il cancello del canalone, a nord del campo, e sali.");
          say("voce", "Ottieni la Chiave del cancello (🎒 Zaino).");
          return wask("Don Fulvio ti mette in mano la chiave. Ha le dita gelate, in una chiesa calda.", [
            { label: "🕯️ «Non lo dica a me. Lo dica a Ilde.»", w: { verita: 2 }, fn: () => { F.set("gn_ful_ilde", true); say("gn_fulvio", "[serio] A Ilde. Sì. È lei che ha diritto di sentirlo. ...Se torni giù con la Coppa, salgo io. Con le mie gambe storte. Promesso davanti a Sant'Antonio, che di promesse se ne intende."); done(); } },
            { label: "⭐ «Sono passati quarantacinque anni. Si perdoni.»", w: { leggenda: 1 }, fn: () => { say("gn_fulvio", "[triste] Perdonarsi. Ci provo ogni mattina alle sette, prima della messa. Non mi riesce mai prima delle otto. Grazie, figliolo. Vai."); done(); } },
            { label: "«Ilde lo sa?»", w: { verita: 1 }, fn: () => { say("gn_fulvio", "[pensa] Ilde sa tutto. Ilde sapeva tutto anche nel '79: chi faceva il filo a chi, chi aveva rotto il vetro della latteria. Ma questa... questa forse no. O forse sì, e mi aspetta lassù da quarantacinque anni."); done(); } }
          ]);
        }
        say("gn_fulvio", s < 1 ? "Buongiorno, figliolo. Olmo è al campo? Allora vai da lui: se è sceso fin lì, ha qualcosa da dire. Lo fa una volta ogni dieci anni." : s < 4 ? "Prego per te. E per la neve, che stia ferma. Lei non mi ascolta, ma io insisto: è il mio mestiere." : "La chiave tienila. Io il canalone non lo apro più."); done();
      },
      gn_lilli() {
        if (K.rel.scene("gn_lilli")) return;
        const s = S();
        if (s >= 1) return ask("Lilli è seduta davanti al televisore della Pro Loco, con una matita in mano e l'aria di chi aspetta da ore.", [
          { label: "📼 Guardate la cassetta del '79", sub: F.is("gn_n12") ? "L'avete già vista" : "Il videoregistratore mangia i nastri", fn: tape },
          { label: "↩ Un'altra volta", fn: () => { say("gn_lilli", "Va bene. Io resto qui. La Pro Loco d'inverno è mia: me l'ha data il sindaco in cambio del silenzio su una cosa che ho visto."); done(); } }
        ]);
        say("gn_lilli", "Il nonno è sceso al campo! Da solo! Non scendeva da tre inverni. Vai a parlarci, prima che cambi idea: lui cambia idea come il tempo, ma più spesso."); done();
      },
      gn_tecla() {
        if (K.rel.scene("gn_tecla")) return;
        say("gn_tecla", S() < 2 ? "[arrabbiata] La tv regionale arriva domenica. Se la Coppa non torna, gli faccio inquadrare la pentola del brulè. Almeno quella vince sempre." : S() < 4 ? "Sali nel canalone? Allora tieni il brulè: no, non te lo do, il brulè in montagna è un'idea dei film. Ti do un abbraccio. Quello sì, scalda." : "Hai visto il rifugio? Mia nonna ci faceva la polenta ai soccorritori. L'ultima volta, nel '79. Poi l'hanno chiuso."); done();
      },
      gn_fiocco() {
        if (K.rel.scene("gn_fiocco")) return;
        say("gn_fiocco", S() < 4 ? "[felice] Fiocco fa il raccattapalle! Palla fuori: Fiocco la riporta. Fiocco non l'ha mai fatto prima. Fiocco è bravissimo. Nessuno ha ancora tirato, ma Fiocco è pronto." : "Fiocco tiene caldo il campo. Fiocco ci si siede sopra."); done();
      }
    };

    const zones = {
      gn_campo: {
        region: "valdigelo", name: "Il campo della Partita", short: "Campo", sub: "Il campo spalato, il cimitero piccolo e il cancello del canalone", bg: "gn_campo", time: "giorno", w: 30, h: 22, base: "Q", start: [15, 19],
        cold: true, warm: [[4, 12, 2.6], [5, 12, 2.6]], lines: [8, 6, 22, 15],
        itemCos: "gn_c2", items: [[1, 8], [28, 12], [10, 20], [27, 20]],
        areas: [[8, 6, 22, 15, "Il campo della Partita"], [21, 1, 28, 5, "Il cimitero"], [1, 1, 7, 6, "La chiesa"], [21, 16, 28, 20, "La Pro Loco"], [12, 0, 17, 2, "Il cancello del canalone"], [0, 0, 29, 21, "Il campo della Partita"]],
        act: { X: "Apri il cancello", M: "Scaldati al falò", Z: "Guarda la porta", S: "Guarda la croce", J: "Guarda la legna", n: "Leggi il cartello", l: "Guarda la lanterna", b: "Siediti", s: "Riposa un momento" },
        flavor: {
          K: "Un abete carico di neve. Ci hanno appeso una sciarpa degli Stambecchi, per la partita.",
          I: "Il muretto del cimitero. Sopra la neve, una fila di candele spente e una accesa.",
          Z: "Una porta da calcio di legno, verniciata di verde ogni primavera. La traversa è storta dal '79: dicono che ci abbia sbattuto contro la Coppa, la sera della festa.",
          S: "Croci di ferro e lapidi di pietra, mezze sepolte dalla neve. Su una, con una lanterna accesa: «AURELIO ROVERE · 1960-1979 · LA MONTAGNA LO TIENE». Sotto, fiori di carta. Freschi.",
          J: "Legna per il falò della partita. In cima alla catasta, qualcuno ha messo un pallone sgonfio. Nessuno lo tocca.",
          n: "Il cartello del campo: «PARTITA DELLA NEVE · DOMENICA ORE 14 · VALDIGELO - VALLE». Sotto, a pennarello: «COPPA: IN ARRIVO (forse)».",
          l: "Una lanterna sul palo. Il vetro è appannato di fiato: qualcuno ci si ferma davanti spesso.",
          b: "La panchina di bordo campo. Olmo l'ha spazzata con la manica.",
          M: "Il falò di bordo campo, dentro un bidone. Scalda le mani e le chiacchiere."
        },
        npcs: () => [{ id: "gn_olmo", at: [6, 9] }, { id: "gn_tecla", at: [15, 17] }].concat(F.is("gn_fiocco_paese") ? [{ id: "gn_fiocco", at: [23, 13] }] : []),
        intro: [["voce", "La mattina dopo. Valdigelo si sveglia con un servizio della tv regionale già prenotato e una Coppa in meno."], ["voce", "Al campo della Partita, spalato a mano da mezzo paese, c'è una sola persona seduta in panchina. Ha un bastone, un berretto, e guarda la montagna per la prima volta da anni."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I"); put(14, 1, "X"); put(15, 1, "X");
          lay(0, 2, 0, 21, "K"); lay(29, 2, 29, 21, "K"); lay(1, 21, 28, 21, "K"); put(14, 21, "Q"); put(15, 21, "Q");
          lay(8, 6, 22, 15, "E"); put(8, 10, "Z"); put(22, 10, "Z");
          house(1, 2, 6, 4, { door: [4, 5], roof: "#475569", wall: "#e2dcd0", enter: { to: "gn_chiesa", at: [8, 9] } });
          house(22, 16, 6, 4, { door: [24, 19], roof: "#3f6212", wall: "#e5e7eb", enter: { to: "gn_proloco", at: [8, 9] } });
          lay(21, 2, 28, 2, "I"); lay(21, 2, 21, 4, "I"); [[23, 3], [25, 3], [27, 3], [24, 4], [26, 4]].forEach(([x, y]) => put(x, y, "S"));
          put(4, 12, "M"); put(5, 12, "M"); put(6, 13, "J"); put(5, 9, "b"); put(7, 9, "b");
          [[11, 2], [18, 2], [7, 16], [20, 5]].forEach(([x, y]) => put(x, y, "l")); put(16, 3, "n"); put(9, 20, "s");
          [[3, 16], [12, 18], [18, 18], [26, 14], [2, 9]].forEach(([x, y]) => put(x, y, "K"));
        },
        decor(g, cx, cy, d) { const s = S(), on = s >= 2 && s <= 3, bl = on && Math.floor(Date.now() / 450) % 2; H.plaque(g, on ? "▶ LIVELLO: CANALONE ▲" : "CANALONE ▲", d.X(14) + 16, d.Y(2) + 4, bl ? "#fef08a" : "#e0f2fe"); if (on) { g.save(); g.globalAlpha = 0.35 + 0.35 * Math.abs(Math.sin(Date.now() / 300)); g.strokeStyle = "#fde047"; g.lineWidth = 2; g.strokeRect(d.X(14) - 2, d.Y(1) - 2, 36, 20); g.restore(); } H.plaque(g, "CHIESA", d.X(4) + 8, d.Y(2) - 6, s === 1 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#e2e8f0"); H.plaque(g, "PRO LOCO", d.X(25), d.Y(16) - 6, "#d9f99d"); H.plaque(g, "🔥 FALÒ", d.X(5), d.Y(12) - 10, "#fdba74"); }
      },
      gn_chiesa: {
        interior: true, region: "casa", name: "La chiesa di Sant'Antonio abate", short: "Chiesa", sub: "Panche di larice, candele, una vetrata rifatta coi soldi della Coppa", bg: "gn_chiesa", w: 16, h: 11, start: [8, 9], outside: ["gn_campo", 4, 6], base: "Y",
        act: { T: "Guarda l'altare", R: "Guarda l'ex voto", W: "Guarda la vetrata", b: "Siediti", l: "Guarda le candele", O: "Scaldati alla stufa" },
        flavor: { T: "L'altare di pietra, con una tovaglia ricamata dalle donne del paese. Sotto la tovaglia, un tabernacolo che contiene, oltre al resto, una chiave.", R: "Un ex voto del 1979: la squadra in fila sulla neve, dipinta. Cinque maglie verdi, e una macchia di vernice bianca dove doveva esserci la sesta.", W: "La vetrata di Sant'Antonio abate: il santo, il fuoco e un porcellino. Nel 1979 la pagarono coi soldi della Coppa.", b: "Una panca di larice. Il legno è lucido nel punto dove si appoggiano le mani a pregare. E dove si appoggiano per non cadere.", l: "Candele accese. Una, davanti all'ex voto, non si spegne mai. Don Fulvio la cambia ogni mattina alle sette.", O: "Una piccola stufa in sacrestia. Don Fulvio ci scalda le mani e, d'inverno, il vino della messa." },
        npcs: () => [{ id: "gn_fulvio", at: [8, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(6, 1, 9, 1, "T"); [[5, 1], [10, 1], [4, 2], [11, 2]].forEach(([x, y]) => put(x, y, "l")); put(3, 0, "W"); put(12, 0, "W"); put(1, 3, "R"); put(14, 2, "O");
          [5, 7].forEach((y) => { lay(2, y, 6, y, "b"); lay(10, y, 13, y, "b"); });
        },
        decor(g, cx, cy, d) { H.plaque(g, "SANT'ANTONIO ABATE", d.X(8), d.Y(0) + 6, "#e2e8f0"); }
      },
      gn_proloco: {
        interior: true, region: "bar", name: "La Pro Loco", short: "Pro Loco", sub: "Trofei della sagra, giornali vecchi e un videoregistratore che mangia i nastri", bg: "gn_proloco", w: 16, h: 11, start: [8, 9], outside: ["gn_campo", 24, 20], base: "U",
        act: { V: "Guarda il televisore", R: "Leggi il giornale", T: "Guarda il tavolo", b: "Siediti", N: "Guarda la bacheca", O: "Scaldati alla stufa" },
        flavor: { V: "Il televisore della Pro Loco col videoregistratore. Sulla manopola, a pennarello: «non toccare (Lilli)».", R: "«L'ECO DELLE VALLI», 14 dicembre 1979, appeso in cornice: «VALDIGELO NELLA LEGGENDA! Brina para l'ultimo rigore nella bufera». In fondo alla pagina, sei righe: «Disperso un giovane nel canalone».", T: "Il tavolo delle riunioni. Sopra, il verbale dell'ultima: «Punto 1: la Coppa è sparita. Punto 2: la colpa è dello yeti. Punto 3: lo yeti non esiste. Seduta tolta».", b: "Sedie pieghevoli, tutte diverse. La Pro Loco le ha avute in regalo da sei matrimoni.", N: "La bacheca dei trofei: la coppa della sagra del fungo, quella della gara di slitte del '88. Il posto d'onore è vuoto. Da sempre, dice Lilli.", O: "Una stufetta elettrica che fa il rumore di un'astronave." },
        npcs: () => [{ id: "gn_lilli", at: [5, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(3, 3, 7, 7, "U"); put(5, 1, "V"); put(11, 0, "R"); put(12, 0, "R"); lay(10, 4, 12, 4, "T"); [[10, 5], [12, 5], [3, 6], [7, 6]].forEach(([x, y]) => put(x, y, "b")); lay(13, 7, 14, 7, "N"); put(1, 1, "O");
        },
        decor(g, cx, cy, d) { H.plaque(g, "PRO LOCO VALDIGELO", d.X(8), d.Y(0) + 6, "#d9f99d"); }
      }
    };
    return {
      n: N, title: "Il canalone delle valanghe", sub: "Il nome sulla sciarpa, la chiave di un prete e una montagna che si muove",
      goal, start: "gn_campo", introBg: "gn_campo", zones, talk,
      obj: {
        "gn_campo:X": () => gate(),
        "gn_campo:M": () => { K.cold.set(K.cold.max); say("voce", "Tendi le mani sul bidone del falò. Tecla ci ha buttato dentro una manciata di bucce d'arancia: profuma di Natale e di gomma bruciata. Calore pieno."); done(); },
        "gn_chiesa:O": () => { K.cold.set(K.cold.max); say("voce", "La stufetta della sacrestia. Calore pieno, e un vago odore di vino della messa."); done(); },
        "gn_proloco:O": () => { K.cold.set(K.cold.max); say("voce", "La stufetta elettrica ronza come un'astronave. Funziona, però. Calore pieno."); done(); },
        "gn_proloco:V": () => { if (S() < 1) { say("voce", "Il televisore della Pro Loco. Spento. Sulla manopola: «non toccare (Lilli)»."); return done(); } return tape(); },
        "gn_proloco:R": () => { K.learnLore("l_eco"); say("voce", "«L'ECO DELLE VALLI», 14 dicembre 1979. Titolo enorme: «VALDIGELO NELLA LEGGENDA! Brina para l'ultimo rigore nella bufera». La foto: Olmo che sorride, il ginocchio fasciato, la Coppa in mano. In fondo alla pagina, sei righe: «Disperso un giovane nel canalone. Le ricerche continuano»."); say("voce", "Il ginocchio fasciato. Nella foto della premiazione. Prima dei rigori, o dopo?"); done(); }
      },
      intro: [["voce", "Domenica c'è la Partita della Neve. La tv regionale ha confermato. La Coppa no."], ["voce", "Stanotte hai sognato un rigore nella bufera. Il portiere si buttava, e quando si rialzava aveva una faccia diversa."]]
    };
  }
  boot();
})();
