// js/compagnia-c1.js - «LA COMPAGNIA DEL PALLONE SPEZZATO» · Capitolo 1: Il Guado del Mulino
// Il campo della Compagnia, la tenda della Capitana, il Borgo dei Mulini con la Locanda del Gallo Zoppo. Reclutamento di Ludovico e Fiamma, prima battaglia a griglia contro il Gabelliere.
(function () {
  "use strict";
  function boot() {
    const E = window.__compagniaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__compagniaH || !window.__tattica) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  const GUADO = {
    name: "Il Guado del Mulino",
    rows: ["..f.=.h..", ".f..=...f", "....=....", "..h.=....", ".f..=..f.", "....=....", "..f.=.h.."].map((r) => r.replace(/=/g, "w")).map((r, y) => (y === 2 || y === 5 ? r.slice(0, 4) + "=" + r.slice(5) : r)),
    ps: [[1, 2], [0, 3], [1, 4], [0, 1], [1, 5]], es: [[7, 3], [6, 2], [6, 4], [8, 2], [8, 4]]
  };
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__compagniaH(K), { say, done, ask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("cp_c1", { kind: "shirt", label: "Giubba della Compagnia", val: "#9a3412", from: "Capitolo 1 de La Compagnia del Pallone Spezzato" });
    K.lore("l_campi", { t: "I Campi di Guerra", d: "A Spezzaterra le liti tra Borghi si decidono su un campo recintato, con i ruoli del pallone: chi tira da lontano, chi blocca, chi para, chi sposta i compagni. Perde chi resta senza comandante." });
    K.lore("l_compagnia", { t: "La Compagnia del Pallone Spezzato", d: "Quaranta mercenari, ex calciatori, e un pallone crepato come stemma. Non vengono pagati da quattro mesi e non lo dicono in giro, tranne a tutti." });
    K.lore("l_guado", { t: "Il Guado del Mulino", d: "Un ponte, un fiume e un Gabelliere. Il Marchese di Roccafredda lo ha chiuso finché la Compagnia non salda un pedaggio che nessuno ricorda di aver contratto." });

    const goal = (s) => ({
      0: "Entra nella tenda della Capitana Dorotea, al centro del campo.",
      1: "Parla con Frate Ludovico, vicino al falò.",
      2: "Alla Locanda del Gallo Zoppo, nel Borgo dei Mulini (a est): cerca Fiamma.",
      3: "Al Guado, oltre il ponte: il Gabelliere Brando. Scegli la Compagnia e combatti.",
      4: "Il capitolo si chiude al Guado."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      F.set("cp_c1_done", true);
      K.reward("cp_c1", { coins: 90, cos: "cp_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["cp_dorotea", "[felice] Il Guado è aperto, il Gabelliere sta ricontando i suoi errori e tu hai un nome sul registro. Per tre monete di rame, ti darei anche un grado."], ["cp_ludovico", "[pensa] Registro: «una battaglia, zero perdite, un debito ancora aperto». Per la Compagnia è un risultato commovente."], ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>💪 Grinta ${K.stat("grinta")} · 🎖️ Onore ${K.stat("onore")} · 🧠 Astuzia ${K.stat("astuzia")} · Compagnia ${K.crew.count()}/${K.crew.total}`], ["voce", "Il Capitolo 2, «La Strada del Marchese», ti aspetta a est."]]), () => K.openMain(), "cp_titolo");
    }
    const dorotea = { id: "cp_dorotea", name: "Capitana Dorotea", role: "D", at: 68, df: 74, te: 66, saga: "compagnia", col: "#7f1d1d" };
    const FOES = [
      { id: "cp_brando", name: "Brando il Gabelliere", role: "D", at: 72, df: 74, te: 60, boss: true },
      { id: "cp_sold1", name: "Soldato del Marchese", role: "D", at: 60, df: 64, te: 55 },
      { id: "cp_sold2", name: "Soldato del Marchese", role: "D", at: 58, df: 62, te: 55 },
      { id: "cp_bal1", name: "Balestriere", role: "A", at: 64, df: 46, te: 60 },
      { id: "cp_fur", name: "Furiere", role: "C", at: 48, df: 54, te: 60 }
    ];
    function fight() {
      H.battle({ map: GUADO, foes: FOES, turns: 12, title: "Il Guado del Mulino", units: K.tactics.team().concat([dorotea]) }, (r) => {
        if (r && r.win) {
          setStep(N, 4); K.bond("onore", 1); K.bond("grinta", 1);
          say("cp_brando", "[sorpreso] Il comandante a terra, il ponte libero e la mia puntualità in frantumi. Annoto: «imprevisto».");
          say("cp_dorotea", "[felice] Cinque contro quattro e hai tenuto il fianco col bosco. Non male, per un nome nuovo.");
          fin();
        } else {
          say("cp_brando", "[freddo] Riprovate quando avrete un piano. Io resto qui: sono puntuale.");
          if (r && r.lost >= 2) say("cp_fiamma", "[pensa] Facciamo meglio: bosco a sinistra, Ludovico dietro e io sulla collina.");
          done();
        }
      });
    }
    const talk = {
      cp_dorotea() {
        if (K.rel.scene("cp_dorotea")) return;
        const s = S();
        if (s === 0) {
          say("cp_dorotea", "[serio] Recluta. Benvenuto nella Compagnia del Pallone Spezzato: quaranta mercenari, un pallone crepato e quattro mesi di paga arretrata.");
          say("cp_dorotea", "Il Marchese di Roccafredda ha sbarrato il Guado del Mulino. Il suo Gabelliere, Brando, chiede un pedaggio che non abbiamo ed è puntuale come una tassa.");
          say("cp_dorotea", "Qui le liti tra Borghi si risolvono sui Campi di Guerra, con i ruoli del pallone: chi tira, chi para, chi sposta. Serve una squadra. Parti da Frate Ludovico, al falò: fa i conti, e senza di lui non si muove nemmeno il pane.");
          K.learnLore("l_campi"); K.learnLore("l_compagnia"); K.learnLore("l_guado"); setStep(N, 1);
          quest("cp_c1", "Il Guado del Mulino", "Parla con Frate Ludovico, vicino al falò.");
          ask("Come rispondi alla Capitana?", [
            { label: "🎖️ «Agli ordini, Capitana»", sub: "Onore +1", fn: () => { K.bond("onore", 1); say("cp_dorotea", "[felice] Bene. Gli ordini sono l'unica cosa che qui non finisce."); done(); } },
            { label: "🪙 «E la paga?»", sub: "Astuzia +1", fn: () => { K.bond("astuzia", 1); say("cp_dorotea", "[furbo] Dopo. La paga è come la vittoria: arriva sempre dopo."); done(); } },
            { label: "💪 «Sono pronto a combattere»", sub: "Grinta +1", fn: () => { K.bond("grinta", 1); say("cp_dorotea", "[serio] Buon segno. Le ferite si pagano a parte."); done(); } }
          ]); return;
        }
        say("cp_dorotea", s === 1 ? "Ludovico sta al falò. Se ti perdi, segui il rumore di qualcuno che contesta una spesa." : s === 2 ? "La Locanda del Gallo Zoppo, nel Borgo a est. Fiamma beve il suo stipendio in anticipo, quindi ha già bevuto tutto." : s === 3 ? "Il Guado è a est, oltre il ponte. Schiera la Compagnia dal menu e fai attenzione al bosco: ripara e rallenta." : "Domani, la strada del Marchese. Stanotte, zuppa."); done();
      },
      cp_ludovico() {
        if (K.rel.scene("cp_ludovico")) return;
        const s = S();
        if (s === 1) {
          say("cp_ludovico", "[pensa] Recluta nuovo. Registro: «un nome, una spada, zero denari». Il mio mestiere è far sembrare tutto questo un bilancio.");
          say("cp_ludovico", "Per passare il Guado serve qualcuno che tiri da lontano. Fiamma, la miglior mira di Spezzaterra, sta alla Locanda del Gallo Zoppo, nel Borgo. Lavora solo a paga anticipata, noi solo a paga posticipata: è un problema di geometria.");
          K.crew.recruit("cp_ludovico"); setStep(N, 2);
          quest("cp_c1b", "Fiamma, la mira", "Alla Locanda del Gallo Zoppo, nel Borgo dei Mulini (a est).");
          say("voce", "Frate Ludovico si unisce alla Compagnia: regista della squadra, cura i compagni e ridà il turno a chi ha già agito."); return done();
        }
        say("cp_ludovico", s < 1 ? "Prima la Capitana, in tenda. Io non parlo con chi non ha un grado." : s === 2 ? "Fiamma, alla Locanda. Porta anche un po' di diplomazia: ne abbiamo in cassa." : "Schiera bene la squadra: io sto dietro, grazie."); done();
      },
      cp_sandro() {
        if (K.rel.scene("cp_sandro")) return;
        say("cp_sandro", "[serio] Fermo. Mostrami le mani. ...Dieci dita. Le mie sono otto, quindi sei più fortunato di me, ma io ho la pensione.");
        say("cp_sandro", "Se ti serve un portiere, un giorno, io non sono qui. Sto controllando una cosa. È sempre una cosa.");
        done();
      },
      cp_oste() {
        if (K.rel.scene("cp_oste")) return;
        say("cp_oste", "[furbo] Il Gallo Zoppo: birra onesta, clienti meno. La stanza al piano di sopra è pulita. La pulisce un debitore.");
        ask("L'Oste Melchiorre ti guarda.", [
          { label: "🛏️ Dormi qualche ora", sub: "Passa una fascia del giorno", fn: () => { say("cp_oste", "Chi dorme non beve, ma non perde nemmeno."); K.clock.advance(1, done); } },
          { label: "🍺 Chiedi di Fiamma", fn: () => { say("cp_oste", S() === 2 ? "[ride] Al tavolo in fondo. Ha un conto lungo come la strada e una mira da fiera." : "Fiamma? Non ricordo. Lei però mi ricorda sempre."); done(); } },
          { label: "Niente", fn: done }
        ]);
      },
      cp_fiamma() {
        if (K.rel.scene("cp_fiamma")) return;
        const s = S();
        if (s === 2) {
          say("cp_fiamma", "[furbo] Mercenario nuovo? Siediti. Se mi porti un'offerta, falla breve: ho un boccale da finire e una reputazione da peggiorare.");
          say("cp_fiamma", "Mi manda la Compagnia, vero? Il frate vuole tirarmi fuori dai debiti per metterci dentro lei. Matematicamente affascinante.");
          const join = (how, tag) => { F.set("cp_fiamma_how", tag); K.crew.recruit("cp_fiamma"); setStep(N, 3); quest("cp_c1c", "Il Guado", "Oltre il ponte, a est: Brando il Gabelliere. Schiera la Compagnia dal menu."); say("voce", "Fiamma si unisce alla Compagnia: tiratrice, colpisce da due o tre caselle di distanza."); done(); };
          ask("Come la convinci?", [
            { label: "🍺 Offri di pagare il suo conto", sub: "Astuzia +1", fn: () => { K.bond("astuzia", 1); say("cp_fiamma", "[sorpreso] Nessuno ha mai pagato il mio conto senza chiedermi qualcosa di peggio in cambio."); say("cp_fiamma", "[ride] Va bene. Il Gallo Zoppo ti ringrazia. Io no, ma ti seguo."); join("conto", "conto"); } },
            { label: "🎯 Sfidala a colpire il barile", sub: "Grinta +1", fn: () => { K.bond("grinta", 1); say("cp_fiamma", "Barile, quattro passi, una freccia. Guarda."); say("voce", "Fiamma colpisce il barile al primo colpo. Tu provi: manchi il barile e svegli il gatto dell'oste."); say("cp_fiamma", "[ride] Mi hai fatto ridere. Vale più di una paga. Un poco meno di due."); join("sfida", "sfida"); } },
            { label: "🤝 Prometti la parte del bottino", sub: "Onore +1", fn: () => { K.bond("onore", 1); say("cp_fiamma", "[pensa] Parola di mercenario? È un'espressione che mi piace a metà."); say("cp_fiamma", "Va bene: se mi imbrogli ti tiro dietro una freccia. Una sola. Mi basta."); join("parola", "parola"); } }
          ]); return;
        }
        say("cp_fiamma", s < 2 ? "Chi sei? Il tavolo è occupato dalla mia pazienza." : s === 3 ? "Al Guado, il bosco a sinistra ripara: io mi metto sulla collina e tiro dall'alto." : "Quando vuoi. Ho la mira, voi avete la fretta."); done();
      },
      cp_teresina() {
        if (K.rel.scene("cp_teresina")) return;
        if (!F.is("cp_pane")) { F.set("cp_pane", true); K.inv.give("cp_pagnotta"); say("cp_teresina", "[felice] Pane appena sfornato, e la farina è del Borgo, non del Marchese. Se lo dai a Fiamma, ti perdona un debito."); say("voce", "Ottieni la Pagnotta del Mulino."); return done(); }
        say("cp_teresina", "[pensa] Al Guado, il Gabelliere ha rubato il sonno a tutto il villaggio. Il fiume, per fortuna, non paga pedaggio."); done();
      },
      cp_brando() {
        if (K.rel.scene("cp_brando")) return;
        const s = S();
        if (s < 3) { say("cp_brando", "[freddo] Il passaggio è chiuso. Pedaggio: quaranta monete d'argento. Tornate quando le avrete, o quando avrete perso la voglia."); return done(); }
        if (s === 3) {
          say("cp_brando", "[freddo] Dunque la Compagnia del Pallone Spezzato. Quaranta uomini, zero monete. Matematicamente, il debito vi sta battendo.");
          return ask("Brando ha chiuso il Guado con quattro uomini e un registro.", [
            { label: "⚔️ Combatti", sub: "Battaglia a griglia · bosco a sinistra, collina a destra", big: true, cls: "hot", fn: () => fight() },
            { label: "👥 Schiera la Compagnia", sub: "Controlla chi combatte", fn: () => K.crew.pick(() => talk.cp_brando(), true) },
            { label: "↩ Non ancora", fn: done }
          ]);
        }
        say("cp_brando", "[freddo] Il ponte è libero. Io annoto: «pedaggio non riscosso». Mi fa male scriverlo."); done();
      }
    };
    const zones = {
      cp_campo: {
        region: "campo", name: "L'Accampamento della Compagnia", short: "Accampamento", sub: "Tende, un falò e uno stendardo sbiadito", bg: "cp_campo", time: "sera", w: 30, h: 22, base: ",", start: [4, 10],
        itemCos: "cp_c1", items: [[3, 8], [26, 7], [11, 17], [24, 14]],
        areas: [[9, 5, 20, 14, "La piazza del campo"], [3, 15, 12, 19, "Il campo d'addestramento"], [12, 1, 17, 4, "La tenda della Capitana"], [0, 0, 29, 21, "Spezzaterra · Accampamento"]],
        act: { A: "Guarda la tenda", F: "Scaldati al falò", K: "Guarda la rastrelliera", E: "Guarda lo stendardo", C: "Guarda la botte", n: "Leggi il cartello", x: "Apri la cassa", s: "Riposa un momento" },
        flavor: { A: "Una tenda rattoppata: tre toppe di colori diversi, perché i debiti si pagano con quello che c'è.", F: "Il falò scoppietta. Sopra bolle una zuppa che sperava di diventare carne, e non ci è riuscita.", K: "Una rastrelliera: lance, alabarde e un pallone appeso con la scritta «NON TOCCARE: è l'unico».", E: "Lo stendardo della Compagnia: un pallone con una crepa dorata. Sotto, cucito a mano: «Spezzato, ma rotola».", C: "Una botte con la scritta «ACQUA». Sul retro, a matita: «forse». ", n: "Il cartello: «BORGO DEI MULINI ▸ 1 ora a piedi, 3 se si porta la cassa paga».", s: "Un tronco morbido quasi quanto una promessa." },
        loot: { "26,13": { id: "cp_spilla", text: "Nella cassa, sotto una coperta: una spilla con un pallone crepato dorato. Qualcuno l'ha dimenticata. O nascosta.", empty: "La cassa è vuota. Solo coperte e rimpianti." } },
        doors: { "29,10": { to: "cp_mulini", at: [1, 10] }, "29,11": { to: "cp_mulini", at: [1, 11] } },
        npcs: () => [{ id: "cp_ludovico", at: [11, 12] }, { id: "cp_sandro", at: [22, 10] }],
        intro: [["voce", "Spezzaterra, sera. Il campo della Compagnia puzza di zuppa, di cuoio e di speranza usata."], ["voce", "Al centro, la tenda della Capitana. Intorno, tende rattoppate, un falò e uno stendardo che ha visto giorni migliori."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(1, 20, 28, 20, "t"); lay(1, 1, 11, 2, "t"); lay(18, 1, 28, 3, "t"); lay(22, 4, 28, 5, "t"); lay(14, 17, 27, 19, "t"); lay(1, 12, 2, 19, "t");
          lay(1, 10, 28, 11, ":"); lay(9, 5, 19, 14, ":"); lay(13, 4, 14, 5, ":"); lay(3, 15, 12, 19, "-");
          put(3, 17, "g"); put(12, 17, "g"); [[3, 15], [12, 15], [3, 19], [12, 19]].forEach(([x, y]) => put(x, y, "f"));
          lay(7, 6, 8, 6, "A"); lay(20, 6, 21, 6, "A"); lay(7, 14, 8, 14, "A"); lay(20, 14, 21, 14, "A");
          put(14, 9, "F"); [[12, 9], [16, 9], [14, 12]].forEach(([x, y]) => put(x, y, "b")); put(15, 12, "s");
          put(11, 6, "E"); put(17, 6, "E"); put(22, 8, "K"); put(22, 13, "K"); [[5, 8], [6, 8], [5, 13]].forEach(([x, y]) => put(x, y, "C"));
          put(9, 9, "l"); put(19, 9, "l"); put(27, 9, "n"); put(26, 13, "x");
          lay(23, 16, 26, 18, "w"); [[24, 15], [25, 15]].forEach(([x, y]) => put(x, y, ";")); lay(1, 3, 3, 7, ";"); [[5, 3], [8, 4], [4, 6]].forEach(([x, y]) => put(x, y, "r"));
          house(12, 1, 6, 4, { door: [14, 4], roof: "#7f1d1d", wall: "#d8c8a8", enter: { to: "cp_tenda", at: [7, 8] } });
          put(29, 10, "q"); put(29, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "TENDA DELLA CAPITANA", d.X(14) + 8, d.Y(1) - 6, "#fbbf24"); H.plaque(g, "CAMPO DI ADDESTRAMENTO", d.X(8) + 8, d.Y(15) - 6, "#86efac"); H.plaque(g, "MULINI ▸", d.X(27) + 8, d.Y(9) - 6, "#fde68a"); }
      },
      cp_tenda: {
        interior: true, region: "tenda", name: "La Tenda della Capitana", short: "Tenda", sub: "Mappe, un tavolo di guerra e un brodo ancora tiepido", bg: "cp_tenda", w: 14, h: 10, start: [7, 8], outside: ["cp_campo", 14, 5],
        act: { u: "Guarda il tavolo di guerra", K: "Guarda la rastrelliera", n: "Leggi la mappa", x: "Apri il baule", b: "Guarda la branda", l: "Guarda la lanterna" },
        flavor: { u: "Un tavolo di guerra: la mappa di Spezzaterra, tre pedine e una tazza che segna l'ovest.", K: "Spade, un'alabarda e un pallone di cuoio rattoppato: la Capitana lo chiama «il consigliere».", n: "Una mappa dei Borghi con tanti segni rossi: debiti, ponti, nemici. I segni verdi sono due. Uno è un errore.", b: "Una branda da campo, sempre fatta. La Capitana la rifà ogni mattina, perché l'ordine è l'ultima cosa che le resta.", l: "Una lanterna che oscilla piano. Fa luce al tavolo e ombra a tutto il resto." },
        loot: { "11,2": { id: "cp_mappa", text: "Nel baule, sotto una coperta: un foglio unto con il fiume, due ponti e una X. In margine: «bosco a sinistra, pietraia a destra».", empty: "Il baule è vuoto. Solo la coperta, e l'odore della Capitana." } },
        npcs: () => [{ id: "cp_dorotea", at: [7, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, '"'); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(5, 3, 9, 3, "u"); put(6, 1, "n"); put(7, 1, "n"); put(2, 2, "b"); put(3, 2, "b"); put(11, 2, "x"); put(11, 6, "K"); put(11, 7, "K"); put(2, 6, "l"); put(10, 8, "C"); put(2, 8, "C");
        },
        decor(g, cx, cy, d) { H.plaque(g, "TENDA DELLA CAPITANA", d.X(7) + 8, d.Y(1) + 4, "#fbbf24"); }
      },
      cp_mulini: {
        region: "mulini", name: "Il Borgo dei Mulini", short: "Borgo dei Mulini", sub: "Un fiume, un mulino e un ponte chiuso", bg: "cp_mulini", time: "giorno", w: 30, h: 22, base: ",", start: [1, 10],
        itemCos: "cp_c1", items: [[3, 9], [14, 19], [27, 8], [25, 12]],
        areas: [[6, 8, 12, 13, "La piazza della fontana"], [16, 8, 19, 13, "Il Guado e il ponte"], [20, 1, 28, 7, "Il casello del Gabelliere"], [0, 0, 29, 21, "Borgo dei Mulini"]],
        act: { H: "Guarda la fontana", W: "Guarda la ruota", n: "Leggi il cartello", u: "Guarda la bancarella", E: "Guarda lo stendardo", z: "Guarda le casse", b: "Siediti", s: "Riposa un momento", l: "Guarda il lampione" },
        flavor: { H: "La fontana della piazza: un pesce di pietra che sputa acqua da trecento anni. Nessuno ha mai chiesto perché.", W: "La ruota del mulino gira lenta sul fiume. Ogni giro macina farina e un pezzettino di pazienza.", n: "Un cartello: «PEDAGGIO AL GUADO: 40 MONETE · PAGAMENTO IN ANTICIPO · NIENTE SCONTI PER MERCENARI».", u: "Una bancarella di mele, pane e un cartello: «Il Gabelliere non compra qui».", E: "Lo stendardo del Marchese: un leone che morde un registro dei conti.", z: "Casse con il timbro del Marchese: grano confiscato, forse. O solo confuso.", b: "Una panca al sole. Chi si siede qui di solito ha già pagato qualcosa.", s: "Un posto tranquillo, con il rumore dell'acqua.", l: "Un lampione di ferro battuto. Non è mai stato acceso: troppo caro." },
        doors: { "0,10": { to: "cp_campo", at: [28, 10] }, "0,11": { to: "cp_campo", at: [28, 11] }, "29,10": { to: "cp_strada", at: [1, 10], locked: () => (F.is("cp_c1_done") ? false : "La strada del Marchese prosegue a est. Prima, il Guado: il Gabelliere ha ancora il ponte.") }, "29,11": { to: "cp_strada", at: [1, 11], locked: () => (F.is("cp_c1_done") ? false : "La strada del Marchese prosegue a est. Prima, il Guado: il Gabelliere ha ancora il ponte.") } },
        npcs: () => [{ id: "cp_brando", at: [21, 10] }],
        intro: [["voce", "Borgo dei Mulini, mattina. Un fiume taglia il paese in due, e un ponte lo rimette insieme solo a pagamento."], ["voce", "A est, oltre il Guado, il casello del Gabelliere. A ovest, la piazza, il mulino e la Locanda del Gallo Zoppo."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(16, 1, 17, 20, "w"); lay(16, 10, 17, 11, "="); lay(1, 10, 28, 11, ":"); lay(8, 3, 9, 18, ":"); lay(6, 8, 12, 13, "+"); lay(19, 10, 28, 11, ":");
          lay(19, 14, 27, 19, "t"); lay(1, 19, 7, 20, "t"); lay(20, 8, 28, 9, ",");
          put(9, 9, "H"); [[6, 9], [12, 12]].forEach(([x, y]) => put(x, y, "b")); put(7, 12, "s"); put(6, 7, "u"); put(11, 7, "u"); [[6, 10], [12, 10], [19, 12]].forEach(([x, y]) => put(x, y, "l"));
          put(15, 5, "W"); put(15, 6, "W"); put(15, 7, "W");
          [[21, 8], [21, 13], [22, 13]].forEach(([x, y]) => put(x, y, "z")); put(20, 9, "E"); put(20, 12, "E"); put(19, 9, "n"); put(4, 10, "n");
          [[3, 15], [11, 17], [13, 8], [14, 13], [2, 13]].forEach(([x, y]) => put(x, y, "r"));
          house(2, 3, 7, 4, { door: [5, 6], roof: "#7c2d12", wall: "#e0cfa8", timber: "#5a3a20", flowers: true, enter: { to: "cp_locanda", at: [8, 10] } });
          house(10, 2, 5, 4, { door: [12, 5], roof: "#6b4a2a", wall: "#d8c8a8", chimney: true, enter: "Il mulino è chiuso: la farina dorme, il mugnaio sogna." });
          house(2, 14, 6, 4, { door: [4, 17], roof: "#8a4a3a", wall: "#d8c8a8", enter: "Il forno: spento. Il pane è tutto dalla Mugnaia." });
          house(11, 14, 5, 4, { door: [13, 17], roof: "#4a6a3a", wall: "#e0d0b0", enter: { room: "casa", name: "La casa di Teresina", who: ["cp_teresina"] } });
          house(22, 2, 6, 4, { door: [24, 5], roof: "#334155", wall: "#b8b0a0", enter: "Il casello: porta sbarrata. Sopra c'è scritto: «Pagamento anticipato»." });
          put(0, 10, "q"); put(0, 11, "q"); put(29, 10, "q"); put(29, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "LOCANDA DEL GALLO ZOPPO", d.X(5) + 8, d.Y(3) - 6, "#fbbf24"); H.plaque(g, "MULINO", d.X(12) + 8, d.Y(2) - 6, "#d6bc8a"); H.plaque(g, "CASELLO · PEDAGGIO 40", d.X(24) + 8, d.Y(2) - 6, "#fca5a5"); H.plaque(g, "GUADO ▸", d.X(16) + 16, d.Y(9) - 6, "#7dd3fc"); }
      },
      cp_locanda: {
        interior: true, region: "locanda", name: "La Locanda del Gallo Zoppo", short: "Gallo Zoppo", sub: "Travi basse, un camino e una mira da fiera", bg: "cp_locanda", w: 16, h: 12, start: [8, 10], outside: ["cp_mulini", 5, 7],
        act: { u: "Guarda il bancone", C: "Guarda la botte", F: "Scaldati al camino", b: "Siediti", x: "Apri la cassa", n: "Leggi la lavagna", l: "Guarda la lanterna" },
        flavor: { u: "Un bancone di legno consumato: ogni segno è un debito, e ogni debito ha un nome.", C: "Una botte di birra scura. Il cartello dice «una scodella, un ricordo».", F: "Il camino crepita. Sopra, un gallo di legno con una zampa più corta delle altre: l'insegna.", b: "Una panca dura. Fiamma dice che è fatta apposta per far parlare.", n: "La lavagna dei conti: la riga di Fiamma è lunga fino al pavimento. Qualcuno ha aggiunto «ma si è difesa».", l: "Una lanterna appesa: luce calda, e un'ombra di gallo sulla parete." },
        loot: { "2,9": { id: "cp_pagnotta", text: "Sotto un panno, nella cassa: una pagnotta tiepida e un biglietto «per chi paga il mio conto».", empty: "La cassa è vuota: solo briciole e un biglietto di scuse." } },
        npcs: () => [{ id: "cp_oste", at: [6, 2] }, { id: "cp_fiamma", at: [9, 7] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "="); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          lay(3, 3, 8, 3, "u"); put(1, 2, "C"); put(2, 2, "C"); put(1, 3, "C"); put(13, 2, "F"); put(14, 2, "F"); put(2, 9, "x"); put(9, 1, "n"); put(11, 1, "l");
          [[4, 6], [5, 6], [10, 6], [11, 6]].forEach(([x, y]) => put(x, y, "u")); [[3, 6], [6, 6], [9, 6], [12, 6], [4, 8], [11, 8]].forEach(([x, y]) => put(x, y, "b"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "GALLO ZOPPO", d.X(8) + 8, d.Y(1) + 4, "#fbbf24"); }
      }
    };
    return {
      n: N, title: "Il Guado del Mulino", sub: "Una Compagnia senza paga e un ponte con il pedaggio",
      goal, start: "cp_campo", introBg: "cp_titolo", zones, talk, obj: {},
      intro: [["voce", "Spezzaterra, un regno diviso in Borghi che litigano da generazioni. Le liti non si decidono con i tribunali: si giocano sui Campi di Guerra, con i ruoli del pallone."], ["voce", "Tu ti sei arruolato nella Compagnia del Pallone Spezzato: quaranta mercenari, ex calciatori, e quattro mesi di paga che non è mai arrivata."]]
    };
  }
  boot();
})();
