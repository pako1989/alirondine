// js/latta-c4.js - «IL PALLONE DI LATTA» · Capitolo 4: La torre del Conestabile (ultimo)
// Temporale sul castello. Mattonaro ha comprato la rocca all'asta e vuole l'armatura come mascotte. Il sigillo del Conestabile apre la torre:
// quarto livello a scorrimento (La torre nella tempesta: si sale in verticale, raffiche di vento, fulmini annunciati) e capo finale (il Conestabile, sugli spalti).
// In cima, il Registro dei Nomi: Ferro ritrova il suo. Quattro finali (riposo, custode, resort, palio segreto con tutti gli stendardi).
(function () {
  "use strict";
  function boot() {
    const E = window.__lattaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__lattaH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__lattaH(K), { say, done, ask, wask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("lt_c4", { kind: "shirt", label: "Mantello del Cavaliere di Latta", val: "#9aa3b5", from: "Finale del Pallone di Latta" });
    K.lore("l_registro", { t: "Il Registro dei Nomi", d: "Il Conestabile teneva un registro di chi gli aveva disobbedito. Nomi scritti, poi raschiati da tutte le altre carte del Borgo. In cima alla torre, l'unico posto dove sono rimasti interi." });
    K.lore("l_leandro", { t: "Leandro Ferri, detto Ferro", d: "Cavaliere del Palio del 1527. Doveva perdere la corsa per le scommesse del Conestabile: rifiutò. La sera del Palio portò un garzone malato nella cripta e ci rimase coi malati. Per punizione, il suo nome fu raschiato ovunque." });

    const goal = (s) => ({
      0: "Temporale sulla rocca. Ottavia ti aspetta sotto il portico del cortile: ha trovato qualcosa.",
      1: "Nel Salone d'armi (a ovest) c'è l'armatura nera del Conestabile, col sigillo della torre. E c'è Mattonaro.",
      2: "▶ LIVELLO A SCORRIMENTO: nello Studiolo (a est), la porta della scala della torre. Sali nella tempesta.",
      3: "Sugli spalti ti aspetta il Conestabile: torna alla porta della torre, nello Studiolo.",
      4: "La saga è conclusa. Grazie, cavaliere."
    }[s] || "La saga è conclusa.");

    const ENDS = {
      riposo: { coins: 200, lines: [["voce", "Ottavia apre le fibbie, una a una. Stavolta si aprono. L'armatura torna in vetrina, lucidata, con un cartellino nuovo: «LEANDRO FERRI, detto Ferro · 1527 · rimase»."], ["lt_ferro", "[commosso] Criiic. <em>(«Grazie. Il pallone tienilo tu. Se una sera di Palio lo senti battere contro un muro, sono io che saluto.»)</em>"], ["voce", "Il Riposo di Ferro. Il pallone di latta resta a te. Ogni tanto, la notte del Palio, lo senti battere."]] },
      custode: { coins: 220, lines: [["lt_ferro", "[felice] Cric-crac! <em>(«Restiamo? Restiamo. Le Mura hanno bisogno di qualcuno che cigoli. E tu hai bisogno di qualcuno che ti dica quando saltare.»)</em>"], ["lt_araldo", "[felice] Signore e signori: Castelrondine ha un custode! Fa rumore quando cammina, calcia di sponda e non chiede lo stipendio!"], ["voce", "Il Custode delle Mura. Tieni l'armatura e la sua voce. Ogni sera, un giro sulle Mura con Ferro."]] },
      resort: { coins: 400, lines: [["lt_mattonaro", "[ride] Firmato! Il Castello Resort & Spa ha la sua mascotte: un cavaliere vero, che saluta i clienti all'ingresso. Le foto si vendono da sole."], ["lt_ferro", "Cric. <em>(«...»)</em>"], ["voce", "Castello Resort & Spa. Idromassaggio nella cripta, suite nel campanile. Ferro sta all'ingresso e non dice più niente. Tu hai un abbonamento gratis alla spa. Non ci vai mai."]] },
      palio: { coins: 500, lines: [["voce", "Gelsa appende tutti gli stendardi ritrovati intorno alla piazza. Il Borgo intero scende in strada, sotto la pioggia che smette."], ["lt_araldo", "[felice] Signore e signori! Un Palio fuori stagione! Corre un solo cavaliere, e corre per uno che non c'è più!"], ["lt_ferro", "[commosso] Criiiic! <em>(«Il Palio del 1527. Me lo fate correre adesso. Nino, guarda: sto correndo.»)</em>"], ["voce", "Fai il giro della piazza col pallone di latta ai piedi. All'ultimo metro, l'armatura si apre da sola, piano. La latta smette di cigolare."], ["voce", "L'Ultimo Palio. Ferro ha corso. Il drappo dipinto lo appendono nel Museo, accanto alla lettera di Nino. Nessuno lo raschierà più."]] }
    };
    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 4); F.set("lt_c4_done", true); F.set("lt_fine_" + id, true);
      K.reward("lt_c4" + id, { coins: E2.coins, cos: "lt_c4" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines).concat([
        ["voce", `<b>FINE DEL PALLONE DI LATTA.</b><br>🛡️ Onore ${K.stat("onore")} · 🪙 Affari ${K.stat("affari")} · 🚩 Stendardi ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Dal menu, 🏰 Livelli a scorrimento, puoi rigiocare tutti i livelli. Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «A scorrimento»."]
      ]), () => K.openMain(), id === "resort" ? "lt_salone" : "lt_titolo");
    }
    function finale() {
      K.learnLore("l_registro"); K.learnLore("l_leandro");
      say("voce", "Il Conestabile si affloscia: dentro l'armatura nera non c'era nessuno. Solo vento. Dietro di lui, una cassa di ferro con il Registro dei Nomi.");
      say("voce", "Nell'ultima pagina scritta, a lettere grandi: «LEANDRO FERRI, cavaliere. Disobbediente. Non perse il Palio come ordinato. Entrò nella cripta contro l'ordine. Si raschi il nome da ogni carta».");
      say("lt_ferro", "[commosso] ...Leandro. Mi chiamavo Leandro. Mia madre mi chiamava Leo. Nino mi chiamava Ferro, perché ero sempre dentro questa latta.");
      say("lt_ferro", "[serio] Cric. <em>(«E adesso? Non lo so. Decidi tu. Sei tu che mi porti addosso da quattro capitoli.»)</em>");
      const tt = K.scroll.total(), all = tt[0] >= tt[1], aff = K.stat("affari") >= 5 || F.is("lt_patto") || F.is("lt_patto4");
      return ask("Il temporale si apre. Ferro aspetta. Cosa fai, alla fine di tutto?", [
        { label: "🛡️ Lascia che Ferro riposi", sub: "Il Riposo di Ferro", big: true, fn: () => ending("riposo") },
        { label: "🏰 Resta con lui: custode delle Mura", sub: "Il Custode delle Mura", fn: () => ending("custode") },
        { label: "🪙 Firma con Mattonaro", sub: aff ? "Castello Resort & Spa" : "Serve più Affari (5) o l'accordo del capitolo 1", disabled: !aff, fn: () => ending("resort") },
        { label: "🚩 L'Ultimo Palio", sub: all ? "Segreto: hai ritrovato tutti gli stendardi" : `Segreto: ritrova tutti gli stendardi (${tt[0]}/${tt[1]})`, disabled: !all, cls: all ? "hot" : "", fn: () => ending("palio") }
      ]);
    }
    function torre() {
      H.level("torre", "Criiic! <em>(«Si sale! Il vento spinge di lato: salta controvento. I fulmini avvisano: dove vedi giallo, spostati.»)</em>", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          say("voce", "In cima alla scala, una botola. Sopra, gli spalti della torre nella tempesta. E, in piedi tra i merli, un'armatura nera con la lancia in mano.");
          say("lt_ferro", "[serio] Cric. <em>(«Il Conestabile. O quello che ne resta. Non ha mai lasciato la sua torre. Neanche da morto.»)</em>");
          if ((r.ban | 0) < (r.banTot | 0)) say("voce", "Mancano degli stendardi: dal menu, 🏰 Livelli a scorrimento, puoi rigiocare il livello. Contano per un finale segreto.");
          quest("lt_c4c", "Il Conestabile", "Torna alla porta della torre, nello Studiolo, e sali sugli spalti.");
          return done();
        }
        say("lt_ferro", r.quit ? "Cric. <em>(«Scendiamo. Il temporale non scappa.»)</em>" : "Criiic... <em>(«Il vento ci ha preso in contropiede. Riproviamo.»)</em>"); done();
      });
    }
    function spalti() {
      H.level("spalti", "Crac! <em>(«Galleggia e butta decreti: schivali. Poi carica a terra: saltalo. Quando sbatte contro il muro resta stordito: quello è il momento.»)</em>", (r) => {
        if (r.win) return finale();
        say("lt_ferro", "Criiic. <em>(«Mi ha battuto anche cinquecento anni fa. Non vale: allora ero malato. Riproviamo.»)</em>"); done();
      });
    }
    function door() {
      const s = S();
      if (s < 2) { say("voce", "La porta della scala della torre. Al centro, l'impronta di un sigillo con un leone. Senza sigillo non si apre."); return done(); }
      if (s === 2) return ask("Il sigillo entra nell'impronta. CLAC. Dalla scala scende un vento che sa di pioggia e di ferro.", [
        { label: "⛈️ Sali sulla torre", sub: "Livello a scorrimento · La torre nella tempesta", big: true, cls: "hot", fn: torre },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Dagli spalti, tra un tuono e l'altro, un clangore di ferro che cammina.", [
        { label: "🗡️ Affronta il Conestabile", sub: "Capo finale · Il Conestabile", big: true, cls: "hot", fn: spalti },
        { label: "⛈️ Rigioca la torre", sub: "Per gli stendardi mancanti", fn: torre },
        { label: "↩ Non ancora", fn: done }
      ]);
      return ask("La torre è silenziosa. Sugli spalti, il Registro dei Nomi aspetta ancora la tua scelta, se vuoi cambiarla.", [
        { label: "📜 Torna al Registro", sub: "Scegli di nuovo il finale", fn: () => { say("voce", "Sali di nuovo sugli spalti. Il cielo è sereno, adesso."); finale(); } },
        { label: "↩ Scendi", fn: done }
      ]);
    }
    function seal() {
      const s = S();
      if (s !== 1) { say("voce", s < 1 ? "L'armatura nera del Conestabile: più alta di un uomo, con un leone sul petto. Ti guarda. Le armature, qui, guardano." : "L'armatura nera, senza più il sigillo. Sembra offesa."); return done(); }
      if (!F.is("lt_mat4")) { say("voce", "Mattonaro si mette in mezzo, col contratto in mano: «Un momento, cavaliere. Prima parliamo»."); return done(); }
      setStep(N, 2); K.questDone && K.questDone("lt_c4");
      say("voce", "Dal petto dell'armatura nera stacchi un sigillo di bronzo con un leone. Pesa come una promessa non mantenuta.");
      say("lt_ferro", "[serio] Cric. <em>(«Il sigillo del Conestabile. L'ultima volta che l'ho visto, chiudeva la porta della cripta.»)</em>");
      quest("lt_c4b", "La torre nella tempesta", "Nello Studiolo, apri la porta della torre col sigillo e sali.");
      done();
    }
    window.__lattaFerroC4 = () => {
      const s = S();
      say("lt_ferro", s === 0 ? "Cric. <em>(«Questo temporale. Uguale a quella notte. Il cielo, a Castelrondine, ha poca fantasia.»)</em>" : s === 1 ? "Criiic. <em>(«Mattonaro vuole comprarmi. Non sono in vendita. Credo. Sono di latta, i prezzi della latta non li so.»)</em>" : s === 2 ? "[serio] Cric. <em>(«La torre. Lassù c'è il mio nome. Me lo sento come un dente che manca.»)</em>" : s === 3 ? "Crac. <em>(«Il Conestabile. Non ho paura. Ho paura. Andiamo lo stesso.»)</em>" : "Cric. <em>(«Leandro. Suona strano, dopo cinquecento anni. Ferro va bene lo stesso.»)</em>");
      done();
    };

    const talk = {
      lt_ottavia() {
        if (K.rel.scene("lt_ottavia")) return;
        const s = S();
        if (s === 0) {
          say("lt_ottavia", "[serio] Ti cercavo. Due notizie. La prima: nell'archivio della Badessa c'è un inventario della torre. In cima, il Conestabile teneva «il registro di chi disobbedisce». Il tuo nome è lì. Il suo nome. Di Ferro.");
          say("lt_ottavia", "La seconda: Mattonaro ha comprato la rocca all'asta, oggi a mezzogiorno. Tutta. Torre compresa. E dice che l'armatura è «arredo del castello». Quindi sua.");
          say("lt_ferro", "Criiic. <em>(«Arredo. Cinquecento anni per diventare un attaccapanni.»)</em>");
          say("lt_ottavia", "La torre si apre col sigillo del Conestabile. È nel Salone d'armi, sull'armatura nera. Mattonaro è lì che prende le misure per i divani.");
          setStep(N, 1); quest("lt_c4", "Il sigillo del Conestabile", "Nel Salone d'armi, prendi il sigillo dall'armatura nera.");
          return done();
        }
        say("lt_ottavia", s === 1 ? "Il Salone è a ovest. Io resto qui a proteggere i registri dalla pioggia e da Mattonaro, in quest'ordine." : s < 4 ? "Sali. Io aspetto qui col cartellino in tasca. Bianco. Lo scriviamo insieme." : "Ho scritto il cartellino. Una riga sola. È la cosa più bella che abbia mai catalogato."); done();
      },
      lt_mattonaro() {
        if (K.rel.scene("lt_mattonaro")) return;
        const s = S();
        if (s === 1 && !F.is("lt_mat4")) {
          F.set("lt_mat4", true);
          say("lt_mattonaro", "[furbo] Il mio cavaliere preferito! Benvenuto nella mia rocca. Mia da mezzogiorno. Ho il contratto, il timbro e un ombrello d'oro.");
          say("lt_mattonaro", "Facciamo le cose da adulti. L'armatura è arredo del castello: quindi mia. Ma sono generoso. Prendi il sigillo, sali nella torre, fai quello che devi fare. Poi, l'armatura la firmiamo a me.");
          say("lt_mattonaro", "[serio] Non sono il cattivo, cavaliere. Il Borgo si svuota. I ragazzi partono. Un resort porta lavoro. Le leggende non pagano le bollette.");
          return wask("Mattonaro ti tende il contratto e una penna d'oro. Fuori, un tuono.", [
            { label: "🛡️ «Ferro non è arredo. È uno che è rimasto.»", w: { onore: 2 }, fn: () => { F.set("lt_rifiuto4", true); say("lt_mattonaro", "[serio] Bella frase. Te la stampo su una tazza. Il sigillo prendilo, tanto la torre è mia lo stesso."); done(); } },
            { label: "🪙 «Ne riparliamo in cima. Con un prezzo.»", sub: "+80 monete di anticipo", w: { affari: 2 }, fn: () => { F.set("lt_patto4", true); K.coinsGive && K.coinsGive(80); say("lt_mattonaro", "[ride] Così si parla! Ottanta monete di anticipo. Il resto quando scendi. Se scendi."); say("lt_ferro", "Cric. <em>(«Ehi. Ehi.»)</em>"); done(); } },
            { label: "«Hai ragione sul Borgo. Non su di lui.»", w: { onore: 1, affari: 1 }, fn: () => { say("lt_mattonaro", "[pensa] ...Questa non me l'aspettavo. Va bene. Vai. Ne parliamo dopo, senza tuoni."); done(); } }
          ]);
        }
        say("lt_mattonaro", s < 1 ? "[furbo] Bella serata. Pessimo tempo. Ottimo affare." : s >= 4 ? "Comunque vada, cavaliere, il Borgo stasera ha avuto una storia. Le storie, prima o poi, si vendono. O si raccontano." : "Sali, sali. Io intanto misuro il salone. Qui ci va un bar."); done();
      },
      lt_benedetta() {
        if (K.rel.scene("lt_benedetta")) return;
        say("lt_benedetta", S() >= 4 ? "Ho aggiunto un nome al Libro del 1527. A matita, perché la matita si corregge. Ma questo non lo correggerà nessuno." : "Lo Studiolo del Conestabile. Ci ho trovato i suoi conti: scommetteva sul Palio. Contro i suoi stessi cavalieri. Sali, cavaliere. E riportaci un nome."); done();
      },
      lt_araldo() {
        if (K.rel.scene("lt_araldo")) return;
        say("lt_araldo", S() >= 4 ? "[felice] Ho un annuncio nuovo, cavaliere. Il più bello della mia carriera. Lo grido domani, quando smette di piovere." : "[sorpreso] Con questo tempo io non annuncio niente. Le parole si bagnano. Però, se sali sulla torre, ti faccio un applauso dal portico."); done();
      },
      lt_zeno() {
        if (K.rel.scene("lt_zeno")) return;
        say("lt_zeno", F.is("lt_lettera_zeno") ? "[commosso] La lettera di Nino è appesa in bottega, sopra la fucina. Il fuoco la scalda. Mi sembra giusto." : "Sono venuto a vedere. Gli Stagnini hanno aspettato questo cavaliere cinquecento anni: posso aspettare un'altra ora sotto la pioggia."); done();
      },
      lt_gelsa() {
        if (K.rel.scene("lt_gelsa")) return;
        const tt = K.scroll.total();
        say("lt_gelsa", tt[0] >= tt[1] ? "[felice] Tutti! Mi hai riportato tutti gli stendardi! Sessant'anni di ricamo, tutti a casa. Se c'è un Palio da correre, giovanotto, adesso abbiamo i colori." : `Stendardi ritrovati: ${tt[0]} su ${tt[1]}. Gli altri sono ancora sparsi per il castello. Senza fretta, giovanotto. Ma neanche troppo piano.`); done();
      }
    };

    const zones = {
      lt_rocca: {
        region: "tempesta", name: "Il cortile della rocca", short: "Rocca", sub: "Castelrondine, sotto il temporale", bg: "lt_rocca", time: "notte", w: 30, h: 22, base: "Q", start: [14, 19],
        itemCos: "lt_c4", items: [[13, 3], [16, 3], [3, 19], [26, 19]],
        areas: [[2, 3, 9, 8, "Il Salone d'armi"], [20, 3, 27, 8, "Lo Studiolo e la torre"], [10, 9, 19, 15, "Il cortile"], [0, 0, 29, 21, "La rocca di Castelrondine"]],
        act: { C: "Guarda la colonna", V: "Guarda il vessillo", F: "Guarda la fontana", n: "Leggi la lapide", l: "Guarda la lanterna", b: "Siediti", t: "Guarda l'albero", s: "Riposa un momento", q: "Entra" },
        flavor: {
          I: "Le mura della rocca, nere di pioggia. Ogni lampo le disegna per un attimo, poi le ridà al buio.",
          C: "Una colonna del portico. L'acqua le scende addosso a fili, come a una statua che piange senza voglia.",
          V: "Il vessillo del Conestabile: un leone nero su fondo rosso. Il vento lo strattona come se volesse strapparlo.",
          F: "La fontana del cortile. Stanotte trabocca: piove dentro più di quanto esce.",
          n: "Una lapide: «IL CONESTABILE · RESSE LA ROCCA · 1519-1531». Sotto, qualcuno ha inciso a mano, piccolo: «e il Palio lo truccava».",
          l: "Una lanterna che oscilla nel vento. La fiamma si piega ma non si spegne: testarda.",
          b: "Una panca sotto il portico, l'unico posto asciutto. Ci si stringono in tre.",
          t: "Un vecchio pino piegato dal vento di cinquecento temporali.",
          s: "Un angolo sotto il portico, asciutto. Il tuono, da qui, sembra meno vicino."
        },
        npcs: (s) => [{ id: "lt_ottavia", at: [12, 10] }, { id: "lt_araldo", at: [17, 10] }, { id: "lt_gelsa", at: [6, 15] }].concat(s >= 2 ? [{ id: "lt_zeno", at: [22, 13] }] : []),
        intro: [["voce", "La rocca di Castelrondine, sotto il temporale. Il cortile è un lago, il portico l'unico riparo, e la torre del Conestabile si accende di lampi come un faro rotto."], ["voce", "A ovest il Salone d'armi. A est lo Studiolo, con la porta della torre. Sotto il portico, Ottavia stringe una cartella contro il petto per non bagnarla."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I");
          lay(0, 2, 0, 21, "I"); lay(29, 2, 29, 21, "I"); lay(1, 21, 28, 21, "I"); put(14, 21, "Q"); put(15, 21, "Q");
          house(2, 3, 7, 5, { door: [5, 7], roof: "#1f2937", wall: "#9ca3af", enter: { to: "lt_salone", at: [8, 9] } });
          house(20, 3, 7, 5, { door: [23, 7], roof: "#111827", wall: "#6b7280", chimney: true, enter: { to: "lt_studiolo", at: [8, 9] } });
          house(2, 14, 4, 4, { door: [4, 17], roof: "#374151", wall: "#d1d5db", enter: "Le scuderie. Vuote da un secolo. Odore di fieno vecchio e di pioggia nuova." });
          house(23, 15, 5, 4, { door: [25, 18], roof: "#374151", wall: "#e5e7eb", enter: "La cappella della rocca. Chiusa. Dalla serratura esce un filo di luce di candela." });
          for (let x = 10; x <= 19; x += 3) put(x, 9, "C"); put(14, 13, "F"); put(15, 13, "F");
          [[9, 4], [20, 10], [9, 10]].forEach(([x, y]) => put(x, y, "V"));
          put(12, 19, "n"); [[11, 6], [18, 6], [8, 12], [21, 12], [14, 17]].forEach(([x, y]) => put(x, y, "l"));
          put(16, 19, "b"); put(8, 19, "s"); [[12, 15], [18, 15]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) { const s = S(); H.plaque(g, s === 1 ? "▶ SALONE D'ARMI" : "SALONE D'ARMI", d.X(5) + 8, d.Y(3) - 6, s === 1 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#d1d5db"); H.plaque(g, s === 2 || s === 3 ? "▶ STUDIOLO · TORRE" : "STUDIOLO · TORRE", d.X(23) + 8, d.Y(3) - 6, (s === 2 || s === 3) && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#d1d5db"); }
      },
      lt_salone: {
        interior: true, region: "salone", name: "Il Salone d'armi", short: "Salone", sub: "Armature, stendardi e un contratto bagnato", bg: "lt_salone", w: 16, h: 11, start: [8, 9], outside: ["lt_rocca", 5, 8], base: "U",
        act: { A: "Guarda l'armatura", P: "Guarda la rastrelliera", V: "Guarda lo stendardo", H: "Guarda il camino", W: "Guarda la finestra", l: "Guarda il candelabro" },
        flavor: { A: "Armature in fila, lucide, vuote. Nessuna parla. Ferro le guarda come si guardano dei cugini un po' tonti.", P: "Lance e scudi col leone nero. Sui bordi, nessuna tacca: queste armi non hanno mai combattuto, solo fatto paura.", V: "Lo stendardo del Conestabile: leone nero, fondo rosso, e un motto in latino che vuol dire più o meno «ho sempre ragione».", H: "Un camino dove ci starebbe un cavallo. Spento. Mattonaro ci ha già appoggiato un dépliant: «qui: angolo lounge».", W: "Dalla finestra, la torre sotto i lampi. Sulla cima, per un attimo, una sagoma nera che non si muove.", l: "Un candelabro di ferro. Le candele piegate dal vento che entra dalle fessure." },
        npcs: () => [{ id: "lt_mattonaro", at: [10, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "U"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          [[2, 1], [4, 1], [11, 1], [13, 1]].forEach(([x, y]) => put(x, y, "A")); put(8, 3, "A"); [[1, 4], [1, 6], [14, 4], [14, 6]].forEach(([x, y]) => put(x, y, "P")); put(6, 1, "H"); put(9, 1, "W"); [[3, 8], [12, 8]].forEach(([x, y]) => put(x, y, "l")); put(7, 1, "V");
        },
        decor(g, cx, cy, d) { const s = S(); H.plaque(g, s === 1 ? "▶ IL SIGILLO" : "CONESTABILE", d.X(8) + 8, d.Y(3) - 12, s === 1 && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#fca5a5"); }
      },
      lt_studiolo: {
        interior: true, region: "salone", name: "Lo Studiolo del Conestabile", short: "Studiolo", sub: "Conti, scommesse e la porta della torre", bg: "lt_studiolo", w: 16, h: 11, start: [8, 9], outside: ["lt_rocca", 23, 8], base: "Y",
        act: { G: "Sali sulla torre", L: "Guarda gli scaffali", T: "Guarda lo scrittoio", W: "Guarda la finestra", l: "Guarda la candela", b: "Siediti" },
        flavor: { L: "Registri di conti. Scommesse sul Palio, anno per anno. Il Conestabile puntava sempre contro i suoi cavalieri, e vinceva sempre. Strano.", T: "Lo scrittoio: penna d'oca, sabbia per asciugare l'inchiostro, un sigillo di ceralacca col leone. Sotto il piano, un cassetto segreto vuoto.", W: "Dalla finestra stretta: pioggia di traverso e il cortile che si allaga.", l: "Una candela che qualcuno ha acceso. La Badessa, forse. Forse no.", b: "Una sedia col leone intagliato sullo schienale. Scomodissima, apposta." },
        npcs: () => [{ id: "lt_benedetta", at: [5, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          put(13, 2, "G"); [[2, 1], [3, 1], [4, 1], [1, 4], [1, 5]].forEach(([x, y]) => put(x, y, "L")); put(8, 1, "W"); put(7, 4, "T"); put(8, 4, "T"); put(9, 6, "b"); [[3, 8], [12, 8]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) { const s = S(); H.plaque(g, s === 2 || s === 3 ? "▶ TORRE" : "TORRE", d.X(13) + 8, d.Y(2) - 8, (s === 2 || s === 3) && Math.floor(Date.now() / 450) % 2 ? "#fef08a" : "#d1d5db"); }
      }
    };
    return {
      n: N, title: "La torre del Conestabile", sub: "Un temporale, un sigillo, un nome raschiato e l'ultima salita",
      goal, start: "lt_rocca", introBg: "lt_rocca", zones, talk,
      obj: {
        "lt_salone:A:8,3": () => seal(),
        "lt_studiolo:G": () => door()
      },
      intro: [["voce", "Il giorno dopo, verso sera, il cielo sopra Castelrondine diventa verde, poi nero. Il temporale arriva dal mare tutto insieme, come una squadra in contropiede."], ["lt_ferro", "[serio] Cric. <em>(«Ultimo capitolo. Lo sento nelle giunture. Non è l'umidità. Forse anche l'umidità.»)</em>"]]
    };
  }
  boot();
})();
