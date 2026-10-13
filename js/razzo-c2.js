// js/razzo-c2.js - RAZZOPACCO · CONSEGNE DAL FUTURO · Capitolo 2 «Il giro dei pianeti»
// Il razzo arancione, la rotta stellare, due pacchi da consegnare: uno sul Pianeta Brodo (oceani di minestra, isole di cracker,
// un tubo pneumatico sopra la zuppa), uno sulla Luna Modulo 7 (uffici, schedari, ispettori). Sulla Luna si scopre chi è davvero
// Orsola Monòpoli. E c'è un terzo pacco, indirizzato a te, con scritto «da non aprire».
(function () {
  "use strict";
  function boot() { const D = window.__razzo; if (!D || !D.addChapter || !D._has || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("rz_minestra", { acc: ["grembiule"], name: "Gran Cuoca Minestra", tag: "", hair: "#ffe8a8", style: "bun", skin: "#b8d88a", eye: "#3a3a1a", bg: ["#1a1030", "#ffc86a"], shirt: "#f4f0e4" },
      "La cuoca più importante del Pianeta Brodo, dove gli oceani sono di minestra e le isole di cracker. Mescola l'oceano con un mestolo lungo trecento metri. Ha ordinato un mestolo nuovo: il vecchio si è sciolto.");
    K.cast("rz_crostino", { acc: ["bandana"], name: "Capitan Crostino", tag: "", hair: "#c8782a", style: "spiky", skin: "#e8c88a", eye: "#3a2a1a", bg: ["#1a1030", "#c8782a"], shirt: "#c8782a" },
      "Capitano della squadra di Consegna a Rete del Pianeta Brodo, I Crostini. Croccante fuori, morbido dentro, come dice lui. Nessuno ha mai capito se è un complimento.");
    K.cast("rz_archivista", { acc: ["occhiali", "taccuino"], name: "L'Archivista Capo", tag: "gray", hair: "#c8c8d0", style: "ordinato", skin: "#d8d8e0", eye: "#3a3a5a", bg: ["#1a1030", "#d8d8e0"], shirt: "#5a5a6a" },
      "Custode di tutti i documenti della galassia, sulla Luna Modulo 7. Ha letto ogni modulo mai compilato. Dice che nessuna storia è vera finché non è archiviata.");
    K.cast("rz_isp1", { acc: ["visiera"], name: "Ispettore del Modulo", tag: "", hair: "#2a2a3a", style: "buzz", skin: "#c8c0d0", eye: "#ff5a5a", bg: ["#1a1030", "#5a5a6a"], shirt: "#3a3a4a" },
      "Ispettore della Luna Modulo 7: controlla che tutti abbiano il Modulo 99-Q. Nessuno sa cosa sia il Modulo 99-Q. Nemmeno gli ispettori. Ma lo controllano lo stesso.");
    K.cast("rz_isp2", { acc: ["visiera"], name: "Ispettrice del Timbro", tag: "", hair: "#5a2a3a", style: "bob", skin: "#d8c8c0", eye: "#ff5a5a", bg: ["#1a1030", "#5a5a6a"], shirt: "#3a3a4a" },
      "Ispettrice della Luna Modulo 7: controlla che i timbri siano dritti. Se un timbro è storto, fa ricominciare tutto da capo. Anche la vita.");
    K.cos("rz_c2", { kind: "acc", label: "Cuffie da pilota della Razzopacco", val: "cuffie", from: "Capitolo 2 di Razzopacco · Consegne dal Futuro" });
    K.lore("l_rotta", { t: "La rotta", d: "Sul razzo c'è la console della rotta: una mappa stellare con i pianeti che conosci. Scegli dove andare e il razzo vola. Per tornare a bordo, entra nel razzo parcheggiato sul pianeta." });
    K.lore("l_dossier", { t: "Il fascicolo di Orsola Monòpoli", d: "«Orsola Monòpoli. Ibernata nel 2025. Scongelata nel 3002. Prima dell'ibernazione: allenatrice di una squadra di quartiere, al campetto accanto a quello del Campione.» Viene dal tuo tempo. Ha costruito la OmniPacco in nove anni, da sola." });
    const goal = (s) => ({
      0: "Sei sul razzo della Razzopacco. La Capitana Borea ha due pacchi e una rotta.",
      1: "Il mestolo per la Gran Cuoca Minestra, sul Pianeta Brodo. Usa la console della rotta.",
      2: "Torna sul razzo: Timbro ha il secondo pacco, per la Luna Modulo 7. E molti moduli.",
      3: "Il pacco per l'Archivista Capo, in fondo agli uffici della Luna Modulo 7. Attento agli ispettori.",
      4: "Sul razzo, la Capitana Borea: c'è la semifinale della Coppa dei Corrieri.",
      5: "Siete in finale. Ferruccio ha in mano il terzo pacco. È indirizzato a te.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    const shipHouse = (L, x, y, door) => L.house(x, y, 5, 3, { door, roof: "#ff8a3a", wall: "#e8d8c0", rr: 1, enter: { to: "rz_razzo", at: [7, 9] } });
    const zones = {
      rz_razzo: {
        region: "interno", name: "Razzopacco · Il razzo arancione", short: "Il razzo", sub: "La cabina, la console della rotta, i pacchi", bg: "rz_razzo", w: 16, h: 12, start: [7, 9],
        act: { R: "Apri la rotta", K: "Guarda i pacchi", L: "Guarda la parete", T: "Guarda il tavolo" },
        flavor: { L: "La parete del razzo: tre toppe, due oblò, una foto della Professoressa da giovane (aveva già centoventi anni).", T: "Il tavolo della cabina: carte stellari, una tazza che galleggia un po', il modulo «Lamentele» di Timbro, già pieno." },
        intro: [["voce", "Il razzo arancione della Razzopacco, dentro: una cabina rotonda, due oblò, una console piena di lucine. Dagli oblò, le stelle. Da sotto il pavimento, un rumore che la Capitana Borea dice di «non guardare»."]],
        npcs: (s) => [{ id: "rz_borea", at: [7, 4] }, { id: "rz_timbro", at: [12, 6] }, { id: "rz_ferruccio", at: [3, 7] }],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); lay(1, 1, 14, 1, "L"); put(5, 2, "R"); put(9, 2, "R"); lay(11, 9, 14, 9, "K"); put(2, 3, "T"); },
      },
      rz_brodo: {
        region: "brodo", name: "Razzopacco · Pianeta Brodo", short: "Pianeta Brodo", sub: "Oceani di minestra, isole di cracker, la Cucina Planetaria", bg: "rz_brodo", time: "giorno", travel: [4, 17],
        w: 30, h: 22, start: [4, 17], items: [[1, 20], [27, 11], [14, 18]], itemCos: "rz_stamps",
        areas: [[19, 2, 28, 12, "La Cucina Planetaria"], [11, 15, 17, 20, "L'isolotto del crostino"], [0, 0, 29, 21, "Pianeta Brodo"]],
        flavor: { t: "Un albero di prezzemolo alto sei metri. Profuma di domenica.", l: "Un lampione a forma di mestolo." },
        intro: [["voce", "Pianeta Brodo: un oceano di minestra che fuma, isole di cracker che galleggiano, un vento che sa di sedano. In lontananza, la Cucina Planetaria: una torre a forma di pentola."], ["voce", "Per arrivarci c'è solo il tubo sopra la zuppa. Nessuno nuota, qui. Si scotterebbe."]],
        tubes: [
          { at: [8, 16], path: [[10, 14], [15, 10], [19, 8]], out: [21, 9] },
          { at: [22, 11], path: [[16, 13], [11, 15]], out: [7, 18] },
          { at: [9, 20], path: [[11, 19.5]], out: [13, 19] },
          { at: [16, 17], path: [[11, 17]], out: [6, 20] },
        ],
        npcs: () => [{ id: "rz_minestra", at: [24, 8] }, { id: "rz_crostino", at: [14, 17] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 21, "w"); lay(1, 12, 9, 21, ","); lay(19, 2, 28, 12, ","); lay(11, 16, 17, 20, ",");
          lay(3, 16, 7, 18, ":"); lay(21, 8, 26, 10, ":"); lay(12, 18, 16, 18, ":");
          shipHouse(L, 2, 13, [4, 15]);
          L.house(22, 3, 5, 4, { door: [24, 6], roof: "#c8782a", wall: "#f4e0b0", rr: 2, enter: "La Cucina Planetaria: pentole grandi come case, un fornello che scalda mezzo pianeta, un ricettario di diecimila pagine scritto a mano. Sulla prima pagina: «Ingredienti: tutto. Tempo: sempre»." });
          put(8, 16, "O"); put(22, 11, "O"); put(9, 20, "O"); put(16, 17, "O");
          [[2, 20], [8, 13], [20, 3], [28, 4], [20, 12]].forEach(([x, y]) => put(x, y, "t")); put(27, 8, "l"); put(5, 20, "s"); put(12, 16, "K");
        },
      },
      rz_luna: {
        region: "luna", name: "Razzopacco · Luna Modulo 7", short: "Luna Modulo 7", sub: "Uffici, schedari, ispettori, l'Archivio Centrale", bg: "rz_luna", time: "notte", travel: [3, 16],
        w: 30, h: 22, start: [3, 16], sneakStart: [3, 16], items: [[1, 1], [14, 11], [28, 20]], itemCos: "rz_stamps", hide: "h", buio: 0.35, heroLight: 4,
        luci: () => [[10, 2, 3], [18, 19, 3], [26, 6, 4, "200,220,255"]],
        areas: [[23, 2, 28, 10, "L'Archivio Centrale"], [0, 0, 29, 21, "Luna Modulo 7"]],
        flavor: { h: "L'ombra degli schedari. Qui gli ispettori non guardano: è fuori dal loro modulo di competenza." },
        intro: [["voce", "La Luna Modulo 7: una luna intera di uffici. Corridoi di schedari, crateri pieni di fogli, un cielo nero con la Terra appesa in alto come un timbro blu."], ["voce", "Gli ispettori camminano su e giù tra gli schedari. Senza Modulo 99-Q, se ti vedono, ti rimandano al razzo. L'ombra degli schedari ti nasconde."]],
        onSeen: (K, who) => K.say([["voce", `«Ehi! Lei! Il Modulo 99-Q!» ${K.esc((K.api.CAST[who && who.id] || {}).name || "Un ispettore")} ti rimanda alla piazzola del razzo. Riprova, nell'ombra degli schedari.`]], K.done),
        npcs: () => [{ id: "rz_archivista", at: [26, 6] },
          { id: "rz_isp1", at: [10, 4], route: [[10, 4], [10, 17]], speed: 0.5, pause: 40, ...(F.is("rz_falso") ? {} : { guard: { range: 4.5, cone: 0.6 } }) },
          { id: "rz_isp2", at: [18, 17], route: [[18, 17], [18, 4]], speed: 0.55, pause: 40, ...(F.is("rz_falso") ? {} : { guard: { range: 4.5, cone: 0.6 } }) }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 0, 0, 21, "a"); lay(29, 0, 29, 21, "a"); lay(0, 21, 29, 21, "a");
          L.house(1, 12, 5, 3, { door: [3, 14], roof: "#ff8a3a", wall: "#e8d8c0", rr: 1, enter: { to: "rz_razzo", at: [7, 9] } });
          lay(1, 15, 6, 16, ":"); lay(1, 17, 5, 17, "U");
          // i corridoi di schedari: le ombre ai lati
          for (const x of [7, 13, 21]) { lay(x, 2, x, 8, "M"); lay(x, 12, x, 19, "M"); lay(x + 1, 2, x + 1, 8, "h"); lay(x + 1, 12, x + 1, 19, "h"); }
          lay(23, 1, 23, 4, "M"); lay(23, 8, 23, 10, "M"); lay(24, 2, 28, 10, "+"); lay(15, 9, 16, 10, "C"); lay(25, 15, 26, 16, "C"); put(4, 3, "C");
          put(11, 20, "Y"); put(27, 13, "K");
        },
      },
    };
    function matchCrostini() { // partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["rz_crostino", r && r.win ? "[ride] Battuti! Croccanti fuori, morbidi dentro. Soprattutto dentro, oggi." : "[felice] Vinto noi! Il brodo porta fortuna. Anche il prezzemolo."]], () => K.enterZone("rz_brodo"), "rz_brodo");
      ask("rz_crostino", "Una sfida sull'isolotto? Noi Crostini non perdiamo mai in casa. Perdiamo sempre fuori. Qui siamo in casa.", [
        { label: "A Consegna a Rete", sub: "La partita della saga, coi razzetti", cls: "hot", fn: () => K.consegnaMatch({ title: "Consegna a Rete · Contro I Crostini", oppStyle: "difensiva", secs: 80, minutes: 45, opp: { name: "I Crostini", color: "#c8782a", players: [{ name: "Capitan Crostino" }, { name: "Grissino" }], keeper: { name: "Il Pane Raffermo" } } }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "rz_crostini", alt: "az,cage,hd", force: false, oppTeam: "I Crostini", oppColor: "#c8782a", us: "Razzopacco", homeKit: ["#ff8a3a", "#c8a040"], mate: "Capitana Borea", squad: ["Capitana Borea", "Ferruccio", "Timbro"], chap: "Razzopacco · Sull'isolotto del crostino", bg: "rz_brodo", oppNames: ["Capitan Crostino", "Grissino", "Tarallo", "Fetta", "Il Pane Raffermo"], intro: "Su un'isola di cracker, in mezzo alla minestra.", done: after }) },
        { label: "Dopo", fn: done },
      ], "rz_brodo");
    }
    function semifinale() {
      K.consegnaMatch({ title: "Consegna a Rete · Semifinale della Coppa dei Corrieri", oppStyle: "contropiede", secs: 100, minutes: 90,
        opp: { name: "Postini dell'Anello", color: "#3ab8c8", players: [{ name: "Postina Saturnina" }, { name: "Corriere Rapido" }], keeper: { name: "Il Portiere Anulare" } },
        intro: "<p>La semifinale. I Postini dell'Anello giocano in <b>contropiede</b>: aspettano e ripartono. Non lanciare troppo presto, e torna a difendere il portellone.</p>", winTitle: "IN FINALE!" }, (r) => {
        if (!r.win) return K.scene([["rz_borea", "[pensa] Eliminati? No: la Coppa dei Corrieri ha il ripescaggio. È nel regolamento. L'ha scritto Timbro. Riproviamo."]], () => K.enterZone("rz_razzo"), "rz_razzo");
        setStep(N, 5); bond("ditta", 2); F.set("rz_arena_ok", true);
        K.scene([["rz_ferruccio", "[felice] FINALE! LA RAZZOPACCO È IN FINALE! Contro chi? (Controlla.) Contro la OmniPacco Galacticos. Di Orsola Monòpoli. (Pausa.) Ah."], ["rz_borea", "[furbo] Bene. Ho sempre voluto parare contro i Galacticos. E perdere contro di loro, mai."]], () => K.enterZone("rz_razzo"), "rz_razzo");
      });
    }
    const talk = {
      rz_borea() {
        const s = S();
        if (s === 0) return K.scene([["rz_borea", "Due consegne. (Indica la console.) Uno: il mestolo nuovo per la Gran Cuoca Minestra, Pianeta Brodo. Due: un pacco per l'Archivista della Luna Modulo 7, ma quello te lo dà Timbro, perché ha bisogno di sei moduli."], ["rz_borea", "[furbo] La rotta la scegli tu, dalla console. Io piloto. Hai due minuti e mezzo dall'atterraggio. Cioè da adesso. Diciamo da adesso."]], () => { setStep(N, 1); K.learnLore("l_rotta"); quest("rz_minestra", "Il mestolo della Gran Cuoca", "Pianeta Brodo, la Cucina Planetaria. Dalla console della rotta."); K.pacco("minestra", { n: "Mestolo per Minestra", secs: 150 }); done(); }, "rz_razzo");
        if (s === 4) return ask("rz_borea", "La semifinale della Coppa dei Corrieri si gioca in orbita, qui fuori. Contro i Postini dell'Anello. (Si stringe i guanti.) Pronta. Pronto?", [{ label: "Gioca la semifinale", sub: "Consegna a Rete · partita importante", cls: "hot", fn: semifinale }, { label: "Non ancora", fn: done }], "rz_razzo");
        return say([["rz_borea", s >= 5 ? "In finale. Contro i Galacticos. Ferruccio vuole parlarti: ha un pacco strano." : "La console della rotta è lì. Io aspetto. Pilotare è aspettare con le mani sul volante."]]);
      },
      rz_timbro() {
        const s = S();
        if (s === 2) return ask("rz_timbro", "(Diventa verde scuro.) Il pacco per l'Archivista. Sulla Luna Modulo 7 serve il Modulo 99-Q per entrare. Non ce l'abbiamo. Nessuno ce l'ha. Ma io… (abbassa la voce) io ho un timbro che gli assomiglia molto.", [
          { label: "«Usa il timbro falso»", sub: "Gli ispettori ti lasceranno passare", big: true, fn: () => luna(true) },
          { label: "«Passo di nascosto»", sub: "Niente trucchi: l'ombra degli schedari", big: true, fn: () => luna(false) },
        ], "rz_razzo");
        return say([["rz_timbro", s >= 4 ? "(Verde più chiaro. Leggermente.) Le consegne vanno bene. Ho compilato il modulo «Soddisfazione». Ho barrato «moderata»." : "Ogni consegna ha il suo modulo. Ogni modulo ha la sua consegna. È il ciclo della vita."]]);
      },
      rz_ferruccio() {
        if (S() === 5) return ask("rz_ferruccio", "(Ha in mano un pacchetto piccolo, avvolto in carta del 2025.) BIP. L'ho trovato in fondo al magazzino. Destinatario: tu. Mittente: la Professoressa. Sopra c'è scritto «Da non aprire finché non serve». (Lo scuote.) Serve?", [
          { label: "«Aprilo adesso»", sub: "Voglio sapere cosa c'è dentro", big: true, fn: () => fine2("aperto") },
          { label: "«Tienilo sigillato»", sub: "Si apre solo quando serve", big: true, fn: () => fine2("sigillato") },
        ], "rz_razzo");
        return say([["rz_ferruccio", "E IL RAZZO DELLA RAZZOPACCO ATTRAVERSA LO SPAZIO… (Si ferma.) Nessuno ascolta? Fa niente. Mi ascolto io."]]);
      },
      rz_minestra() {
        if (S() === 1 && F.get("rz_pk") === "minestra") {
          const ok = K.consegnato("minestra"); setStep(N, 2); questDone("rz_minestra");
          return K.scene([["rz_minestra", ok ? "[felice] Il mestolo! In orario! (Lo immerge nell'oceano e mescola mezzo pianeta.) Ecco la mancia: una scodella di Brodo Primordiale. Da bere, non da nuotarci." : "[pensa] In ritardo. L'oceano si è un po' attaccato al fondo. (Mescola.) Pazienza: la zuppa perdona."], ["rz_minestra", "[pensa] Sapete che la OmniPacco ha comprato tutti i porti del Pianeta Brodo? Tutti tranne il mio. La signora Monòpoli mi ha offerto un mestolo d'oro. Io voglio il mio mestolo di legno. Restate piccoli, voi della Razzopacco. Le cose piccole arrivano dappertutto."]], done, "rz_brodo");
        }
        return say([["rz_minestra", S() >= 2 ? "La zuppa va mescolata in senso orario. In senso antiorario si torna indietro nel tempo. Scherzo. Forse." : "Il mestolo vecchio si è sciolto. Era di cioccolato. Errore mio."]]);
      },
      rz_crostino() { return ask("rz_crostino", "[felice] Capitan Crostino, dei Crostini! Croccante fuori, morbido dentro. Una partita?", [{ label: "Sfida I Crostini", sub: "Partita secondaria · scegli tu la modalità", fn: matchCrostini }, { label: "Dopo", fn: done }], "rz_brodo"); },
      rz_archivista() {
        if (S() === 3 && F.get("rz_pk") === "archivio") {
          const ok = K.consegnato("archivio"); setStep(N, 4); questDone("rz_archivio"); F.set("rz_dossier", true); K.learnLore("l_dossier");
          return K.scene([["rz_archivista", ok ? "[sorpreso] Un pacco in orario. Lo archivio subito: è il primo da centoquarant'anni. (Timbra il pacco. Timbra la ricevuta. Timbra te, per sbaglio.)" : "[pensa] In ritardo di poco. Archivio anche il ritardo. Tutto si archivia."], ["rz_archivista", "[pensa] Siete della Razzopacco? Allora vi interessa questo. (Tira fuori un fascicolo.) «Orsola Monòpoli. Ibernata nel 2025. Scongelata nel 3002. Prima dell'ibernazione: allenatrice di una squadra di quartiere, al campetto accanto al tuo.» (Ti guarda.) Viene dal tuo tempo, ragazzo. Come te."], ["voce", "Il fascicolo ha una foto: un campetto di terra, una ragazza col fischietto, e dietro, sfocato, un altro campetto. Il tuo."]], done, "rz_luna");
        }
        return say([["rz_archivista", "Nessuna storia è vera finché non è archiviata. La tua, per esempio, è ancora in bozza."]]);
      },
      rz_isp1() { return say([["rz_isp1", F.is("rz_falso") ? "(Guarda il timbro. Lo annusa.) Modulo 99-Q. Regolare. Prego. (Non ha mai visto un Modulo 99-Q in vita sua.)" : "Modulo 99-Q?"]]); },
      rz_isp2() { return say([["rz_isp2", F.is("rz_falso") ? "Timbro dritto. Dritto davvero. (Si commuove.) Non ne vedevo uno dritto dal 2990. Passi, passi." : "Il timbro è storto. Ricominci."]]); },
    };
    function luna(falso) {
      F.set(falso ? "rz_falso" : "rz_furtivo", true); setStep(N, 3); quest("rz_archivio", "Il pacco per l'Archivista", "Luna Modulo 7, l'Archivio Centrale in fondo agli uffici."); K.pacco("archivio", { n: "Per l'Archivista", secs: 200 });
      say([["rz_timbro", falso ? "(Timbra un foglio bianco con un colpo secco. Il timbro è perfetto. È dritto.) Ecco il Modulo 99-Q. Se vi chiedono chi l'ha fatto, dite «l'Ufficio». È sempre l'Ufficio." : "[pensa] Niente timbro. (Diventa verde scurissimo.) Coraggioso. Restate nell'ombra degli schedari: gli ispettori guardano solo davanti. È l'unica cosa che guardano."]]);
    }
    function fine2(kind) {
      F.set(kind === "aperto" ? "rz_aperto" : "rz_sigillato", true); bond("ditta", 1);
      const msg = K.reward("c2:rz", { coins: 90, cos: ["rz_c2"] }); finishChapter(N, kind); setStep(N, 9);
      K.scene(kind === "aperto" ? [["voce", "Ferruccio strappa la carta. Dentro c'è una foto del campetto di Borgo Marino, nel 2025, e un biglietto con la calligrafia tremolante della Professoressa: «Per quando vorrai tornare». Sotto, un sigillo rotto. Un piccolo fumo blu. Poi niente."], ["rz_ferruccio", "[sorpreso] BIP. Mi sa che il sigillo era importante. (Lo rigira.) C'era scritto «finché non serve». Adesso non serve più. Credo."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La Coppa dei Corrieri».`]]
        : [["rz_ferruccio", "[pensa] Sigillato. (Lo mette in una tasca del petto, dove tiene le cose importanti: un bullone, un biglietto del 2999, adesso questo.) Lo custodisco io. Un postino non apre mai i pacchi degli altri. È la prima regola. L'unica, in realtà."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La Coppa dei Corrieri».`]], () => K.openMain(), "rz_razzo");
    }
    return { n: N, title: "Il giro dei pianeti", sub: "La rotta, il Pianeta Brodo, la Luna Modulo 7, la semifinale", goal, start: "rz_razzo", introBg: "rz_razzo", zones, talk,
      patch: { rz_citta: { build(L) { L.house(27, 2, 5, 3, { door: [29, 4], roof: "#c8a040", wall: "#5a5a7a", rr: 1, enter: { to: "rz_razzo", at: [7, 9] } }); } } },
      intro: () => [["voce", "<b>RAZZOPACCO · CONSEGNE DAL FUTURO</b>. Episodio 2. Il razzo arancione decolla con un rumore di lavatrice. La Professoressa saluta dalla finestra con un fazzoletto. È un fazzoletto a reazione: le scappa di mano e vi segue fino in orbita."]] };
  }
  boot();
})();
