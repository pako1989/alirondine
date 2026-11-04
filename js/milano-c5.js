// js/milano-c5.js - OPERAZIONE FUORIGIOCO NOIR · Capitolo 5 «La Prima di Sant'Ambrogio» (nuovo, 4 nov 2026)
// Martedì 7 dicembre 1954, prima della Scala (La Vestale). Piazza della Scala sotto la neve, la sartoria di Elvira,
// il foyer, il palco n° 4 del Commendatore Balestrini e del Questore Vitali. La partita finale nella neve e i cinque finali
// (bloccati dal Peso e dalle scelte dei capitoli precedenti).
(function () {
  "use strict";
  function boot() {
    const D = window.__milano;
    if (!D || !D.addChapter || !D._has(4)) return setTimeout(boot, 120);
    D.addChapter(chapter5);
  }

  function chapter5(K) {
    const N = 5, S = () => K.stepOf(N), F = K.F;
    const say = (ls, then) => K.say(ls, then || K.done);
    const rot = (a) => a[(K.frNow() >> 6) % a.length];
    const W = (a) => (K.weight ? K.weight.get(a) | 0 : 0);

    K.cos("mn_c5", { kind: "shirt", label: "Frac preso a nolo, una taglia in più, garofano bianco", val: "#0b0f19", from: "Capitolo 5 di Operazione Fuorigioco Noir" });
    K.lore("l_prima", { t: "La Prima di Sant'Ambrogio", d: "Il 7 dicembre, festa del patrono, la Scala apre la stagione. In platea Milano che conta, in loggione Milano che sa. Nel '54 si dà La Vestale: canta la Callas, dirige Votto, la regia è di un certo Visconti." });
    K.lore("l_loggione", { t: "Il loggione", d: "L'ultima galleria, sotto il soffitto. Biglietti da poche lire, code dalla notte prima, e il pubblico più crudele d'Europa: un fischio dal loggione chiude una carriera." });
    K.evidence("livrea", { t: "La livrea da maschera", d: "Giacca rossa coi bottoni dorati, cucita da Elvira in una notte. Con questa addosso nessuno ti guarda in faccia: alla Scala le maschere sono mobili.", icon: "🎭", short: "Invisibile tra i palchi" });

    const goal = (s) => ({
      0: "Piazza della Scala, la sera della Prima. Nevica. De Santis ti aspetta sotto il monumento a Leonardo.",
      1: `Per arrivare al palco n° 4 serve un travestimento e un'ora giusta: Elvira nella sartoria${F.is("mn_c5_elvira") ? " ✓" : ""}, Fausto in coda per il loggione${F.is("mn_c5_fausto") ? " ✓" : ""}.`,
      2: "Il foyer della Scala: convinci Ernesto, la maschera dei palchi, a lasciarti passare.",
      3: "Il palco n° 4, prima fila. Il Commendatore e il Questore. Metti sul velluto la prova che non possono spiegare.",
      4: "La piazza, a mezzanotte, nella neve: i Ferrovieri contro l'XI del Tondino. Mister Pavesi ti aspetta davanti alla Galleria.",
    }[s] || "La storia è conclusa. Si possono cercare gli altri finali rigiocando le scelte.");

    // ---------------------------------------------------------------------------------------------------- I FINALI
    const req = {
      riscatto: () => F.is("mn_mara_busta") && W("pieta") >= 3,
      silenzio: () => W("ombra") >= 2 || F.is("mn_c5_busta"),
      verita: () => F.is("mn_pep_info") && F.is("mn_libro") && F.is("mn_bra_copre") && K.verbali() >= 6,
    };
    const ENDS = {
      legge: { coins: 400, bg: "mn_questura", lines: [
        ["voce", "La mattina dell'8 dicembre, alle nove, entri al Palazzo di Giustizia con un fascicolo sotto il braccio. Non in Questura: in Procura. Il sostituto procuratore è un ragazzo di trentadue anni con la cravatta storta e nessun palco alla Scala."],
        ["mn_desantis", "[seduto in corridoio, il cappello sulle ginocchia] Ho portato anche il mio fascicolo. Quello del '48. Mi hanno chiesto se sapevo cosa rischiavo. Ho detto di sì. Era vero, per una volta."],
        ["mn_ines", "Prima pagina. «LO SCANDALO DEL TONDINO». Il caporedattore ha detto che è un titolo brutto. Io ho detto che è un titolo vero. L'ha messo lo stesso."],
        ["voce", "Il processo dura tre anni. Il Commendatore lo aspetta in corridoio, come tutti, su una panca di legno. Il Questore Vitali va in pensione «per motivi di salute». La salute, a volte, è una cosa che si decide."],
      ] },
      riscatto: { coins: 420, bg: "mn_palco", lines: [
        ["voce", "Una cartolina da Parigi, a gennaio. La Tour Eiffel nella nebbia. Sul retro, una grafia tonda: «Qui la nebbia la chiamano brouillard. Canto in un locale piccolo. Nessuno mi paga per sorridere a nessuno. M.»"],
        ["voce", "I soldi della valigia, quelli che non erano di nessuno, finiscono in una busta senza nome nella cassetta dei Ferrovieri. A marzo lo spogliatoio ha le docce calde. Mister Pavesi piange sotto la prima. Dice che è l'acqua."],
        ["mn_rosetta", "[davanti alla tomba di Nando, con quaranta camicie in meno da cucire] L'hai trovato, chi è stato. Non me l'hai portato qui. Grazie. Era tutto quello che volevo."],
        ["voce", "Il Commendatore non va a processo. Ma non torna più alla Scala: il loggione, la sera di Santo Stefano, lo ha fischiato per sei minuti. Fausto li ha cronometrati."],
      ] },
      solitario: { coins: 300, bg: "mn_titolo", lines: [
        ["voce", "Lasci il fascicolo sul tavolo di De Santis, sotto la tazza con scritto «AL MIGLIOR PAPÀ». Non aspetti che torni."],
        ["voce", "Cammini sui binari del 19 fino al capolinea, nella neve. Ci metti due ore. Al capolinea c'è un campo da calcio di periferia, con le porte senza rete. Ti siedi sulla traversa."],
        ["hero", "Milano non mi deve niente. Io nemmeno."],
        ["voce", "In primavera arriva una lettera di Scotti, dodici pagine. L'ultima riga dice: «Ho annotato che te ne sei andato. Ho annotato anche che avevi ragione»."],
      ] },
      silenzio: { coins: 600, bg: "mn_stadio", lines: [
        ["voce", "Prendi la busta del Commendatore. È più leggera di quanto pensassi. Le cose che pesano davvero non stanno nelle buste."],
        ["voce", "La stagione dopo i Ferrovieri hanno un campo nuovo, erba vera, tribuna coperta. Su una targa d'ottone: «DONO DELLE ACCIAIERIE BALESTRINI · ALLO SPORT PULITO»."],
        ["mn_desantis", "[l'ultima volta che lo vedi, davanti alla targa] Sport pulito. [accende una sigaretta, non la fuma] Ognuno ha il suo fascicolo, figliolo. Adesso hai anche tu il tuo."],
        ["voce", "Ci passi davanti ogni domenica. Ogni domenica leggi la targa. Non ti abitui mai."],
      ] },
      verita: { coins: 800, bg: "mn_scala", lines: [
        ["voce", "Finale segreto. Il 9 dicembre, in Procura, si presentano in fila: un allibratore con un occhio solo e un libro mastro di tela cerata, un arbitro con la giacca ben stirata, un brigadiere con diciassette quaderni."],
        ["mn_peppino", "Tutte le puntate, tutti i nomi, e la sigla: una B in un ingranaggio. Io ho un occhio solo, signor giudice. Ma il libro ce li ha tutti e due."],
        ["mn_arbitro", "Ho fischiato quello che mi dicevano per due anni. Adesso dico quello che ho visto. È più difficile. Mia figlia Lucia dice che sono più alto."],
        ["mn_desantis", "[firma il suo verbale accanto a quello che accusa il Questore] Sei anni. Sei anni con un guinzaglio. [posa la penna] Si respira bene, senza."],
        ["mn_ines", "Prima pagina, otto colonne. «IL DOSSIER SEGRETO DEL '54». Firmato: Ines Ferrario. Non «la signorina dello sport». Ines Ferrario."],
        ["voce", "Sulla tomba di Nando Colombo, al Monumentale, qualcuno lascia un paio di guanti da portiere nuovi. Sono della taglia giusta."],
      ] },
    };
    function ending(id) {
      const E2 = ENDS[id];
      K.setStep(N, 5); F.set("mn_c5_done", true); F.set("mn_fine_" + id, true);
      const msg = K.reward("mn_c5" + id, { coins: E2.coins, cos: "mn_c5" });
      K.finishChapter(N, id); K.end(id);
      const tit = (K.ENDINGS[id] || [id])[0];
      K.scene(E2.lines.concat([
        ["voce", `<b>FINE DI OPERAZIONE FUORIGIOCO NOIR.</b><br>Finale: «${tit}». ${msg.join(" · ")}<br>📁 Verbali ${K.verbali()}/${Object.keys(K.VERBALI).length}. Gli altri finali si cercano dal menu della saga, rigiocando i capitoli.`],
      ]), () => K.openMain(), E2.bg);
    }
    function scegliFinale() {
      const lock = (k, why) => (req[k]() ? { disabled: false } : { disabled: true, sub: "🔒 " + why });
      K.ask("mn_desantis", "La neve ha coperto le righe del campo. Il Commendatore se ne va a piedi, senza cappello, per la prima volta in vita sua. De Santis ti mette in mano il fascicolo: «Tutto quello che abbiamo. Decidi tu dove va. Io ho già deciso troppo, in vita mia».", [
        { label: "⚖️ Alla Procura, non alla Questura", sub: "Il finale «La Giustizia dei Bastioni»", big: true, fn: () => ending("legge") },
        Object.assign({ label: "🕯️ Un biglietto per Parigi e le docce ai Ferrovieri", sub: "Il finale «Il Patto della Lucciola»", fn: () => ending("riscatto") }, lock("riscatto", "Serve Pietà 3 e aver lasciato a Mara la sua busta")),
        { label: "🌫️ Lascio tutto sul tavolo e me ne vado a piedi", sub: "Il finale «Il Passo nella Nebbia»", fn: () => ending("solitario") },
        Object.assign({ label: "💰 Prendo la busta del Commendatore", sub: "Il finale «Il Prezzo del Silenzio»", fn: () => ending("silenzio") }, lock("silenzio", "Serve Ombra 2 (o aver tenuto la busta nel palco)")),
        Object.assign({ label: "📖 Il libro mastro, l'arbitro e tutti i verbali", sub: "Finale segreto «Il Dossier Segreto del '54»", cls: "hot", fn: () => ending("verita") }, lock("verita", `Serve un informatore libero col suo libro, un arbitro che testimonia, sei verbali (${K.verbali()}/6)`)),
      ]);
    }

    const zones = {
      mn_piazza: {
        region: "scala", name: "Piazza della Scala, la sera della Prima", short: "Piazza della Scala", sub: "Neve, carrozze, pellicce, la Galleria accesa e il loggione in coda", bg: "mn_scala", time: (s) => (s >= 4 ? "notte" : "tramonto"), travel: [17, 19],
        w: 36, h: 24, start: [17, 19], items: [[3, 12], [32, 12], [8, 16], [28, 16], [17, 9]],
        areas: [[1, 1, 34, 7, "Il Teatro alla Scala"], [12, 10, 23, 16, "Il monumento a Leonardo"], [1, 17, 13, 22, "La Galleria"], [24, 17, 34, 22, "Palazzo Marino"], [0, 0, 35, 23, "Piazza della Scala"]],
        flavor: {
          A: "Un manifesto: «TEATRO ALLA SCALA · 7 DICEMBRE 1954 · LA VESTALE · MARIA MENEGHINI CALLAS». Sotto, a matita, un loggionista ha scritto: «SE STONA, FISCHIAMO»",
          K: "L'edicola chiusa. Sulla saracinesca, l'ultima locandina del Corriere d'Informazione: «NAVIGLIO: IL PORTIERE NON ERA UBRIACO». Firmato I. F.",
          C: "Il tram 1, fermo per la neve. Il tranviere ha spento il motore e si è messo a guardare le pellicce che scendono dalle automobili. Dice che è meglio del cinema.",
          O: "Un braciere delle caldarroste. Il castagnaro vende anche «posti in coda per il loggione», a cinquanta lire l'ora. È illegale. È anche molto richiesto.",
          l: "Un lampione con il cappello di neve. La luce, sulla neve, sembra d'oro vecchio.",
          b: "Una panchina sepolta. Qualcuno ci ha disegnato sopra col dito un pallone e una porta. La porta è senza portiere.",
          t: "Un albero spoglio, carico di neve. Un passero dentro fa finta di essere una pallina di Natale.",
        },
        intro: [
          ["voce", "Martedì 7 dicembre 1954, Sant'Ambrogio. Nevica su Milano dalle quattro del pomeriggio, fitta, morbida, senza vento."],
          ["voce", "Davanti alla Scala si fermano automobili nere da cui scendono pellicce, frac, gioielli che costano quanto un palazzo di ringhiera. Dall'altra parte della piazza, la coda per il loggione: sciarpe, termos, panini, gente che ha dormito sul marciapiede per sentire la Callas."],
          ["voce", "In mezzo, sotto la statua di Leonardo, un uomo col cappello e senza distintivo. Ti aspetta da un'ora. Ha i piedi bagnati e nessuna voglia di lamentarsene."],
        ],
        npcs: (s) => [
          { id: "mn_desantis", at: s >= 4 ? [14, 17] : [17, 16] },
          { id: "mn_fausto", at: [30, 9] },
          { id: "mn_ines", at: [22, 9] },
          { id: "mn_marietto", at: [6, 15] },
          { id: "mn_scotti", at: [11, 9] },
          ...(F.is("mn_pep_info") ? [{ id: "mn_peppino", at: [3, 15] }] : []),
          ...(F.is("mn_bra_copre") ? [{ id: "mn_arbitro", at: [25, 15] }] : []),
          ...(s >= 4 ? [{ id: "mn_pavesi", at: [20, 17] }, { id: "mn_gioann", at: [21, 17] }] : [{ id: "mn_carmine", at: [33, 15] }]),
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 23, "+"); lay(0, 0, 35, 0, "a"); lay(0, 23, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          // il Teatro alla Scala: facciata neoclassica, portico, ingresso centrale; la sartoria è la porticina di via Filodrammatici
          house(8, 1, 20, 6, { door: [18, 6], roof: "#a8a29e", wall: "#e7dcc8", rr: 2, lit: true, enter: { to: "mn_foyer", at: [10, 11], locked: (K) => (K.stepOf(5) < 2 ? "Le maschere all'ingresso controllano biglietti e cognomi. Il tuo cognome non c'è, e il tuo biglietto nemmeno. Prima serve un travestimento." : false) } });
          house(2, 1, 5, 6, { door: [4, 6], roof: "#57534e", wall: "#c8b89a", rr: 2, lit: true, enter: { to: "mn_sartoria", at: [7, 8] } });
          house(29, 1, 5, 6, { door: [31, 6], roof: "#57534e", wall: "#d6cfc0", rr: 2, lit: false, enter: { room: "locanda", name: "Caffè Biffi Scala", flavor: { T: "Un tavolino col marmo freddo. Il cameriere ti porta un caffè senza che tu lo chieda: «Offre il loggione», dice. Dal vetro si vede la coda." } } });
          lay(1, 7, 34, 8, ":");
          // il monumento a Leonardo, con i quattro allievi, al centro dell'aiuola innevata
          lay(13, 11, 22, 15, "g"); lay(15, 12, 20, 14, "+");
          house(16, 12, 4, 2, { roof: "#78716c", wall: "#a8a29e", rr: 1, enter: "Il monumento a Leonardo da Vinci: lui in alto, pensieroso, e quattro allievi intorno. Sulla testa ha un cappello di neve. Sembra più umano così." });
          // la Galleria e Palazzo Marino
          house(1, 18, 12, 4, { door: [7, 18], roof: "#64748b", wall: "#d6cfc0", rr: 2, lit: true, enter: { room: "locanda", name: "La Galleria Vittorio Emanuele", flavor: { T: "Sotto la cupola di vetro la neve non arriva. Arriva il freddo, e il mosaico del toro. I milanesi ci girano sopra col tallone: porta fortuna. Ci giri anche tu. Due volte, per sicurezza." } } });
          house(24, 18, 11, 4, { door: [29, 18], roof: "#7c2d12", wall: "#d4b896", rr: 2, lit: false, enter: "Palazzo Marino, il Comune. Chiuso. Sulla porta un usciere dorme in piedi col cappotto addosso: è la sua forma di protesta." });
          lay(1, 16, 34, 17, ":");
          // tram fermo, edicola, colonnine, bracieri, lampioni, alberi
          lay(28, 10, 31, 10, "C"); put(7, 10, "K"); put(9, 13, "A"); put(26, 13, "A"); put(4, 10, "O"); put(24, 11, "O");
          [[2, 9], [12, 9], [23, 9], [33, 9], [11, 16], [24, 16]].forEach(([x, y]) => put(x, y, "l"));
          [[1, 12], [34, 12], [1, 14]].forEach(([x, y]) => put(x, y, "t")); put(13, 10, "b"); put(22, 10, "b");
        },
        decor(g, cx, cy, d) {
          K.plaque(g, "TEATRO ALLA SCALA", d.X(18) + 8, d.Y(1) - 2, "#fde68a"); K.plaque(g, "SARTORIA", d.X(4) + 8, d.Y(1) - 2, "#e9d5ff"); K.plaque(g, "CAFFÈ BIFFI", d.X(31) + 8, d.Y(1) - 2, "#fecaca");
          K.plaque(g, "GALLERIA", d.X(7) + 8, d.Y(18) - 2, "#bae6fd"); K.plaque(g, "PALAZZO MARINO", d.X(29) + 8, d.Y(18) - 2, "#e5e7eb");
          K.light(d.X(18) + 8, d.Y(6), 46, "255,220,150", 0.35 + 0.05 * Math.sin(d.fr / 9));
          // la neve che cade (fiocchi lenti, in 3 profondità) e lo strato bianco sui bordi
          for (let i = 0; i < 70; i++) { const s = (i % 3) + 1, x = ((i * 97 + Math.sin(d.fr / 40 + i) * 18) % 420 + 420) % 420 - 50, y = ((i * 53 + d.fr * (0.25 + s * 0.18)) % 260) - 30; K.P(cx + x, cy + y, s > 2 ? 2 : 1, s > 2 ? 2 : 1, `rgba(255,255,255,${0.35 + s * 0.18})`); }
        },
      },

      mn_sartoria: {
        interior: true, region: "scala", name: "La sartoria della Scala", short: "Sartoria", sub: "Manichini, velluto, spilli, e Elvira che non dorme dal '31", bg: "mn_palco", time: "tramonto",
        w: 15, h: 10, start: [7, 8], outside: ["mn_piazza", 4, 7],
        flavor: {
          T: "Il tavolo da taglio: forbici lunghe come spade, gessetti, un costume da Vestale con l'orlo ancora imbastito. Stasera la Callas lo indossa. O lo indossa l'orlo, dipende dal tempo.",
          D: "Un armadio di costumi: Aida, Tosca, Violetta, un Rigoletto con la gobba staccabile. In fondo, una giacca da maschera rossa coi bottoni dorati.",
          L: "Rotoli di stoffa in fila: velluto, raso, lana cotta. Su ognuno un cartellino scritto a mano: «Per la regina», «Per il cattivo», «Per chi muore al terzo atto».",
          W: "La finestra su via Filodrammatici. La neve sul davanzale ha l'impronta di un gatto. Elvira dice che è il fantasma del sarto di Verdi.",
        },
        intro: [["voce", "Una stanza lunga sotto il palcoscenico, piena di manichini senza testa che indossano regine, preti, briganti. Odore di naftalina e di ferro da stiro. Una donna magra, coi capelli bianchi a caschetto, cuce un orlo con la bocca piena di spilli."]],
        npcs: () => [{ id: "mn_elvira", at: [9, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 14, 9, "="); lay(0, 0, 14, 1, "a"); lay(0, 0, 0, 9, "a"); lay(14, 0, 14, 9, "a"); lay(0, 9, 14, 9, "a"); put(7, 9, "v");
          lay(3, 3, 6, 3, "T"); lay(1, 2, 1, 6, "L"); lay(13, 2, 13, 3, "D"); lay(13, 5, 13, 6, "D"); put(4, 1, "W"); put(10, 1, "W");
        },
        decor(g, cx, cy, d) { K.light(d.X(4) + 8, d.Y(3), 26, "255,220,160", 0.4); },
      },

      mn_foyer: {
        interior: true, region: "scala", name: "Il foyer della Scala", short: "Foyer", sub: "Specchi, lampadari, champagne, e la scala per i palchi", bg: "mn_palco", time: "notte",
        w: 21, h: 13, start: [10, 11], outside: ["mn_piazza", 18, 7],
        doors: { "10,1": { to: "mn_palco", at: [7, 7], locked: (K) => (K.stepOf(5) < 3 ? "La scala per i palchi di prima fila. Una catena di velluto rosso, e un cartello d'ottone: «RISERVATO». La catena la sorveglia Ernesto." : false) } },
        flavor: {
          E: "Il bar del foyer. Champagne a cinquecento lire il bicchiere. Il barista ti guarda la livrea e ti dà un vassoio da portare. Lo porti. Nessuno ti ringrazia: funziona.",
          R: "Un divanetto di velluto rosso. Ci si è seduto Verdi, dice una targhetta. Ci si è seduto anche un signore che adesso dorme con la bocca aperta.",
          W: "Uno specchio alto quattro metri. Ti vedi in livrea rossa, coi bottoni dorati. Sembri un altro. È il punto.",
          L: "La bacheca delle foto: Toscanini, la Tebaldi, la Callas. Sotto quella della Callas qualcuno ha attaccato un biglietto: «TEBALDIANI A CASA». Sotto quella della Tebaldi: «CALLASSIANI A CASA».",
        },
        intro: [["voce", "Il foyer: lampadari di cristallo, specchi, champagne, signore che si salutano baciando l'aria a due centimetri dalla guancia. Una campanella annuncia l'inizio. In fondo, la scala per i palchi, chiusa da un cordone rosso."]],
        npcs: (s) => [
          { id: "mn_ernesto", at: [11, 2] },
          { id: "mn_contessa", at: [4, 6] },
          { id: "mn_vitali", at: s < 3 ? [16, 6] : null },
          ...(F.is("mn_mara_dossier") ? [{ id: "mn_mara", at: [16, 9] }] : []),
        ].filter((n) => n.at),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 20, 12, "="); lay(0, 0, 20, 1, "a"); lay(0, 0, 0, 12, "a"); lay(20, 0, 20, 12, "a"); lay(0, 12, 20, 12, "a"); put(10, 12, "v"); put(10, 1, "q");
          lay(15, 3, 18, 3, "E"); put(2, 3, "R"); put(2, 4, "R"); put(18, 9, "R"); put(18, 10, "R"); put(4, 1, "W"); put(16, 1, "W"); lay(1, 8, 1, 10, "L");
        },
        decor(g, cx, cy, d) { [5, 10, 15].forEach((x, i) => K.light(d.X(x) + 8, d.Y(4), 34, "255,230,170", 0.32 + 0.04 * Math.sin(d.fr / 8 + i))); K.plaque(g, "PALCHI · I FILA", d.X(10) + 8, d.Y(1) + 4, "#fde68a"); },
      },

      mn_palco: {
        interior: true, region: "scala", name: "Il palco n° 4, prima fila", short: "Palco n° 4", sub: "Velluto rosso, binocoli d'oro, e la Vestale che canta di sotto", bg: "mn_palco", time: "notte",
        w: 15, h: 9, start: [7, 7], outside: ["mn_foyer", 10, 2],
        flavor: {
          R: "La balaustra di velluto rosso. Sotto, la platea: duemila teste, e in mezzo una donna vestita di bianco che canta come se non esistesse nient'altro. Forse per lei è vero.",
          T: "Un tavolino col secchiello dello champagne. Due bicchieri. Uno col segno del rossetto: c'è stata una signora, e se n'è andata al primo atto.",
          D: "L'attaccapanni del palco: un cappotto di cammello, sciarpa di seta, un cappello grigio. Il cappotto ha i bottoni d'acciaio brunito. Ne manca uno. Il terzo.",
        },
        intro: [["voce", "Il palco n° 4. Dalla balaustra sale la voce della Callas, e per un momento pensi che nessuno, qui, potrebbe fare del male a qualcuno. Poi il Commendatore Balestrini si volta. Ha il binocolo d'oro in una mano. Nell'altra, niente: le mani vuote sono le sue preferite."]],
        npcs: (s) => [{ id: "mn_balestrini", at: [9, 3] }, ...(s >= 3 ? [{ id: "mn_vitali", at: [4, 3] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 14, 8, "="); lay(0, 0, 14, 0, "a"); lay(0, 0, 0, 8, "a"); lay(14, 0, 14, 8, "a"); lay(0, 8, 14, 8, "a"); put(7, 8, "v");
          lay(1, 1, 13, 1, "R"); put(12, 5, "T"); put(1, 6, "D");
        },
        decor(g, cx, cy, d) { K.light(d.X(7) + 8, d.Y(1), 60, "255,235,190", 0.25 + 0.08 * Math.sin(d.fr / 14)); },
      },
    };

    const both = () => { if (F.is("mn_c5_elvira") && F.is("mn_c5_fausto") && S() === 1) { K.setStep(N, 2); K.giveClue("livrea"); K.quest("mn5_foyer", "Il foyer", "Entra alla Scala in livrea e convinci Ernesto, la maschera dei palchi."); } };

    const talk = {
      mn_desantis(K) {
        const s = S();
        if (s === 0) return say([
          ["mn_desantis", "[si scrolla la neve dal cappello] Sei venuto in frac. Bene. Ti sta male, ma bene."],
          ["mn_desantis", "Palco numero quattro, prima fila. Ci sono il Commendatore e il Questore, come ogni anno. Fra il primo e il secondo atto escono a fumare. Al terzo atto la Vestale viene sepolta viva, e loro non se lo perdono mai: dice Vitali che è «istruttivo»."],
          ["mn_desantis", "Io sono sospeso, e mi conoscono tutti. Tu no. Per arrivare a quel palco serve una faccia che nessuno guarda. Alla Scala, l'unica faccia che nessuno guarda è quella di una maschera."],
          ["mn_desantis", "La sartoria è di là, in via Filodrammatici. Chiedi di Elvira. E chiedi a uno del loggione a che ora la Callas attacca l'aria lunga: quando canta lei, alla Scala, nessuno guarda nemmeno le maschere."],
        ], () => { K.setStep(N, 1); K.quest("mn5_travestimento", "Una faccia che nessuno guarda", "La sartoria (Elvira) e la coda del loggione (un loggionista che sa tutto)."); K.done(); });
        if (s === 1) return say([["mn_desantis", "Elvira e il loggione. Una ti veste, l'altro ti dice quando. Io ti aspetto qui. Leonardo mi fa compagnia: anche lui non dice niente."]]);
        if (s === 2 || s === 3) return say([["mn_desantis", "Dentro, figliolo. Io la Scala la guardo da fuori da quarant'anni. Stasera mi va bene così."]]);
        if (s === 4) return say([["mn_desantis", F.is("mn_c5_busta") ? "[guarda la tua tasca, non dice niente. Poi dice] Prima la partita. Poi ognuno fa i conti con quello che ha in tasca." : "La piazza l'ha fatta chiudere lui. Dice che vuole vederla da sotto le sue finestre. Fagli vedere quello che vuole vedere."]]);
        return say([["mn_desantis", rot(["Nevica su Milano. Copre tutto. Domattina si scioglie, e torna tutto come prima. Quasi.", "Mia moglie amava la Scala. Ci siamo stati una volta, in loggione, nel '39. Rigoletto. Ha pianto al terzo atto. Io ho fatto finta di no."])]]);
      },
      mn_elvira(K) {
        if (!F.is("mn_c5_elvira")) return say([
          ["mn_elvira", "[si toglie gli spilli di bocca uno a uno, li conta] Ventitré. Ne avevo ventiquattro. Se lei si siede e ne trova uno, è mio."],
          ["mn_elvira", "Lei è l'amico di Nando. Rosetta mi ha scritto. Rosetta è stata la mia apprendista più brava, a quindici anni: voleva cucire i costumi delle regine. Fa camicie per i ragionieri. Il mondo è sbagliato in tanti piccoli punti, giovanotto. Io li rammendo uno alla volta."],
          ["mn_elvira", "Una livrea da maschera? Ci metto un'ora. [prende le misure senza metro, solo con gli occhi] Spalle da calciatore. Gliela faccio larga: le maschere vere hanno spalle da maschera, che sono spalle stanche."],
          ["voce", "Un'ora dopo, ti guardi allo specchio della sartoria: giacca rossa, bottoni dorati, il colletto inamidato. Sembri uno che ha sempre lavorato qui e non è mai stato notato. È il complimento più grande che ti abbiano fatto."],
          ["mn_elvira", "Una cosa. Il Commendatore ha un cappotto di cammello coi bottoni d'acciaio. Me li ha fatti cambiare io, quest'estate: li voleva con la sua sigla. Una B in un ingranaggio. Ne ha perso uno, a novembre. Me l'ha chiesto uguale. Io gli ho detto che non avevo più acciaio."],
        ], () => { F.set("mn_c5_elvira", true); K.rel && K.rel.add("mn_rosetta", 6); K.weight.add("pieta", 0); both(); K.done(); });
        return say([["mn_elvira", rot(["Ventitré spilli. Il ventiquattresimo lo troverà la Callas, stasera, al secondo atto. Lo troverà con la coscia.", "Ho cucito per la Tebaldi e per la Callas. Non dico chi era più gentile. Dico solo che una delle due mi ha portato i cioccolatini."])]]);
      },
      mn_fausto(K) {
        if (!F.is("mn_c5_fausto")) return K.ask("mn_fausto", "Un uomo con la sciarpa, il termos e un panino di carta oleata. È in coda dalle sei di stamattina. «Fausto, loggione, quarantun anni di Prime. Se lei è qui per passare avanti, la fischio. Se è qui per altro, si sieda: c'è posto sul mio sgabello.»", [
          { label: "🎶 Quando attacca l'aria lunga, la Callas?", big: true, fn: () => say([
            ["mn_fausto", "«Tu che invoco con orrore». Secondo atto, scena seconda. Dura sei minuti e quaranta. Per sei minuti e quaranta, alla Scala, non respira nessuno. Nemmeno il Questore."],
            ["mn_fausto", "Lo so perché il Questore lo vedo, da lassù. Lo vedo sempre. In loggione si vede tutto: le mani dei palchi, chi stringe e chi passa buste. Da quarant'anni guardo le mani più che il palcoscenico."],
            ["mn_fausto", "[abbassa la voce] A novembre, la sera del 16, il Commendatore era qui per un concerto. È uscito all'intervallo e non è tornato. Il cappotto, però, l'aveva lasciato al guardaroba. È tornato a prenderlo a mezzanotte e mezza. Coi pantaloni bagnati fino al ginocchio. Ho annotato. Come quel brigadiere suo amico."],
          ], () => { F.set("mn_c5_fausto", true); K.bond("fiuto", 15); both(); K.done(); }) },
          { label: "Un panino?", fn: () => say([["mn_fausto", "Mortadella. Il pane l'ho fatto io, ieri. È duro come un fischio dal loggione. Prenda pure. Poi però mi deve una domanda vera."]]) },
        ]);
        return say([["mn_fausto", rot(["Sei minuti e quaranta. Si ricordi: quando lei canta, nessuno guarda nient'altro. Neanche i colpevoli.", "Una volta ho fischiato un tenore per un do di petto calante. Ha smesso di cantare. È diventato un ottimo assicuratore. Gli ho fatto un favore, a modo mio."])]]);
      },
      mn_ernesto(K) {
        const s = S();
        if (s === 2) return K.present({ who: "mn_ernesto", prompt: "Ernesto ti guarda la livrea, poi la faccia, poi di nuovo la livrea. «Questa giacca l'ha cucita Elvira. Lo riconosco dall'orlo. Ma lei non è una maschera. Mi dia un motivo per sganciare il cordone, e me lo dia buono.»", ok: ["bottone", "registro", "referto"],
          right: (id) => say([
            ["mn_ernesto", id === "bottone" ? "[prende il bottone, lo gira alla luce del lampadario] Una B in un ingranaggio. Il cappotto del palco quattro. L'ho appeso io, al guardaroba, il 16 novembre. A mezzanotte e mezza l'ho riconsegnato bagnato. Non ho fatto domande. Le maschere non fanno domande." : id === "registro" ? "[legge la pagina copiata da Scotti] Alle 23:10 in Questura. La sera del 16. E io a mezzanotte e mezza gli riconsegnavo il cappotto bagnato. Le maschere non fanno domande. Ma sanno contare." : "[legge il referto, piano] Colpo alla nuca. Un ragazzo di ventisei anni. [si toglie i guanti bianchi] Io ho un nipote di ventisei anni."],
            ["mn_ernesto", "Quarantadue anni che sgancio cordoni. Per Toscanini, per il Re, per gente che non meritava nemmeno il loggione. [sgancia il cordone] Stanotte sgancio per un portiere. Salga. Durante l'aria lunga. E non si faccia vedere a ringraziarmi: le maschere non vengono ringraziate. È la regola che mi piace di più."],
          ], () => { K.setStep(N, 3); K.questDone("mn5_foyer"); K.quest("mn5_palco", "Il palco n° 4", "Sali la scala dei palchi e affronta il Commendatore."); K.done(); }),
          wrong: (id) => say([["mn_ernesto", id === "assegno" ? "Un assegno. Alla Scala tutti hanno un assegno in tasca, giovanotto. Io stesso ne ho uno: quello della tredicesima, che non arriva mai." : id === "livrea" ? "La livrea me la sta già mostrando. È il motivo per cui non la faccio buttare fuori. Non il motivo per farla salire." : "Mi spiace. Questo non mi dice niente che mi faccia rischiare il posto."]], () => K.done()),
          back: () => K.done() });
        if (s >= 3) return say([["mn_ernesto", rot(["[guarda dritto davanti a sé] Non la conosco. Non l'ho mai vista. Salga.", "Quarantadue anni. Stasera è la prima volta che il cordone lo sgancio volentieri."])]]);
        return say([["mn_ernesto", "Biglietto, prego. [lo guarda meglio] Non ha il biglietto. Allora: buonasera e arrivederci, con il massimo rispetto."]]);
      },
      mn_balestrini(K) {
        const s = S();
        if (s === 3) return say([
          ["mn_balestrini", "[non si alza. Dalla platea sale la voce della Callas] Il centravanti dei Ferrovieri. In livrea. Elvira, immagino: nessun altro a Milano cuce un orlo così. Si sieda, giovanotto. È l'aria lunga: parlare adesso è maleducato."],
          ["mn_vitali", "[accanto a lui, senza voltarsi] Gliel'avevo detto, di tornare a giocare a pallone. Lo dico a tutti. Pochi mi ascoltano. Quelli che mi ascoltano, giocano a lungo."],
          ["mn_balestrini", "Io costruisco Milano, giovanotto. Il tondino dentro ogni palazzo nuovo, dal Pirellone che faranno alle case di ringhiera che abbatteranno. Il calcio è un passatempo. Le scommesse, un modo di sapere chi si compra. Lei mi accusa di cosa, esattamente?"],
        ], () => K.present({ who: "mn_balestrini", prompt: "La Callas canta di sotto: «Tu che invoco con orrore». Il Commendatore aspetta, il binocolo d'oro in mano. Cosa metti sul velluto della balaustra?", ok: ["bottone"],
          right: () => say([
            ["voce", "Posi il bottone d'acciaio sul velluto rosso. Una B dentro un ingranaggio. Poi indichi, senza dire niente, il cappotto di cammello appeso all'attaccapanni del palco. Il terzo bottone manca."],
            ["mn_balestrini", "[il binocolo si ferma a metà strada] Elvira. Le avevo chiesto di rifarlo uguale. Mi ha detto che non aveva più acciaio. Una sarta. Mi ha fregato una sarta."],
            ["mn_vitali", "[si alza, si aggiusta il papillon] Commendatore, io avrei un impegno. Il secondo atto lo vedo dal ridotto."],
            ["mn_balestrini", "Si sieda, Vitali. Lei è il mio fascicolo, come De Santis è il suo. [a te, piano] Io non ho toccato nessuno. Io ho detto «pulito». Il Fonditore ha capito male. Sono cose che succedono, quando dai ordini a gente che ha le mani grandi."],
            ["mn_balestrini", "[estrae una busta dalla giacca e la posa accanto al bottone] Facciamo all'antica, come si fa a Milano. Stanotte, a mezzanotte, la piazza è mia: ho chiesto al Comune di chiuderla per la neve. La sua squadra contro i miei uomini, l'XI del Tondino. Se vincete, questa busta vale quanto volete voi. Se perdete, lei lascia Milano e il bottone resta qui."],
          ], () => K.ask("mn_balestrini", "La busta è lì, sul velluto, accanto al bottone. Il Commendatore non la spinge verso di te. Aspetta che sia tu a guardarla.", [
            { label: "⚖️ Riprendo il bottone, lascio la busta", sub: "Ci vediamo a mezzanotte, Commendatore", big: true, w: { legge: 1 }, fn: () => say([["mn_balestrini", "[ripone la busta] Peccato. Era una bella busta. A mezzanotte, allora. Porti dei guanti: la neve fa male alle mani di chi non è abituato."]], sfida) },
            { label: "💰 Prendo la busta, poi vediamo", sub: "Con la busta in tasca, la partita si gioca lo stesso", w: { ombra: 1 }, fn: () => { F.set("mn_c5_busta", true); say([["mn_balestrini", "[sorride per la prima volta] Bravo. Lei impara in fretta. Tenga anche il bottone: è un ricordo. A mezzanotte, comunque. Ai miei uomini piace giocare, e non sanno di questa busta."]], sfida); } },
          ])),
          wrong: (id) => say([["mn_balestrini", id === "assegno" ? "Un assegno della mia banca. La mia banca ne emette diecimila al mese. Non mi dice chi l'ha firmato." : id === "referto" ? "Un referto. Povero ragazzo. Ma un referto dice come si muore, non chi c'era. Lo dica al dottor Sangalli: lui fischietta, io ascolto." : id === "registro" ? "Il Questore riceve visite a ogni ora: è il suo lavoro. Vitali, glielo spieghi lei." : "Interessante. [riprende il binocolo] Ma la Callas è più interessante."]], () => K.done()),
          back: () => K.done() }));
        if (s >= 4) return say([["mn_balestrini", "[guarda la platea] A mezzanotte. Non mi faccia aspettare: non sono abituato."]]);
        return say([["mn_balestrini", "Ci conosciamo? No. Allora non mi parli durante l'aria."]]);
      },
      mn_vitali(K) {
        if (S() >= 3) return say([["mn_vitali", rot(["[fa girare la penna d'oro] Il secondo atto è il più lungo. Mi annoia. Tutto mi annoia, stasera.", "Io sono un funzionario dello Stato, giovanotto. Lo Stato ha molti padroni. Io ne servo uno alla volta."])]]);
        return say([["mn_vitali", "[nel foyer, un calice in mano] Il calciatore. In livrea. Milano è piena di sorprese, e quasi tutte durano poco."]]);
      },
      mn_contessa(K) {
        if (!F.is("mn_co5")) { F.set("mn_co5", true); return say([
          ["mn_contessa", "[ventaglio, perle, un bicchiere vuoto che nessuno le riempie] Ah, il ragazzo della Lucciola. Stasera ho scommesso con la marchesa Visconti che la Callas sbaglia un acuto. Ho perso. Ho perso anche il palco: me l'hanno tolto le banche."],
          ["mn_contessa", "Balestrini è nel quattro. Io ero nel cinque, fino a novembre. Sa cosa si sente, dal palco cinque? Tutto. Anche quando parla a bassa voce. Soprattutto allora."],
          ["mn_contessa", "Gli ho sentito dire, a ottobre: «Il portiere è un problema». Ho pensato che parlasse di calcio. Sono una vecchia stupida, ma ho buon orecchio. [ti tocca il braccio col ventaglio] Lo inchiodi, caro. Poi mi presti cinquemila lire."]], () => { K.bond("fiuto", 10); K.done(); }); }
        return say([["mn_contessa", rot(["Cinquemila lire. Gliele ridò alla prossima Prima. O a quella dopo.", "La marchesa mi ha detto che ho un vestito del '38. Le ho detto che anche il suo marito è del '38. Abbiamo pareggiato."])]]);
      },
      mn_mara(K) {
        return say([["mn_mara", rot(["[in un vestito prestato, al braccio di un industriale tessile] Non mi guardare. Io canto nel coro, adesso. Terza fila, dietro una colonna. È la cosa più vicina a Parigi che mi sia rimasta.", "La busta l'hai messa nel dossier. Avevi ragione tu, credo. Mi fa male lo stesso."])]]);
      },
      mn_fausto2: null,
      mn_ines(K) {
        if (!F.is("mn_in5")) { F.set("mn_in5", true); return say([
          ["mn_ines", "[in cappotto e sciarpa, il taccuino sotto la neve] Mi hanno mandato a fare la cronaca mondana della Prima. Chi indossa cosa. Io stasera scrivo chi esce dal palco quattro, e come."],
          ["mn_ines", "Il pezzo sul Naviglio è uscito. «Il portiere non era ubriaco». Il caporedattore mi ha detto: «Brava, ma è l'ultimo». Io gli ho detto: «Allora facciamo che è il penultimo»."]], () => { K.rel && K.rel.add("mn_ines", 8); K.done(); }); }
        return say([["mn_ines", rot(["Pelliccia di visone, frac, papillon. Pelliccia di visone, frac, papillon. Mi hanno mandato a contare papillon. Io conto bugie.", "Prima pagina, un giorno. Lo vedrai. Anzi, lo leggerai."])]]);
      },
      mn_scotti(K) { return say([["mn_scotti", rot(["[col quaderno «DICEMBRE · TUTTO», il primo pagina scritta] Ho annotato: «Ore 19:40. Nevica. Il Commendatore arriva in Lancia nera. Il Questore nella stessa Lancia». Erano nella stessa macchina. Lo annoto due volte.", "Il Commissario mi ha detto di stare qui e di non fare niente. Io sto qui. E annoto quello che non faccio."])]]); },
      mn_marietto(K) { return say([["mn_marietto", rot(["«Prima della Scala! La Callas regina! Il Commendatore in palco!» [abbassa la voce] Il terzo l'ho inventato io. Ma vende.", "Ho la voce da tenore, signore. Stasera la uso gratis: nessuno compra il giornale alla Prima. Comprano i binocoli."])]]); },
      mn_peppino(K) { return say([["mn_peppino", rot(["[con un cappello calato sull'occhio buono] Il libro è al sicuro. Più al sicuro di me. Remo l'ha messo sotto un barcone di sabbia: per trovarlo devono svuotare il Naviglio.", "Stasera alla Scala ci sono quaranta miei clienti. Trentanove mi devono soldi. Il quarantesimo è il Questore. Lui no: lui è a credito."])]]); },
      mn_arbitro(K) { return say([["mn_arbitro", rot(["[in cappotto, un fischietto nuovo al collo] Se stanotte si gioca, arbitro io. Gratis. Fischio quello che vedo. Mia figlia mi ha regalato questo fischietto. È di plastica. Fischia meglio.", "Lucia è uscita dall'ospedale. Ha detto: «Papà, adesso fischi solo i falli veri?». Ho detto di sì. Ho detto la verità."])]]); },
      mn_carmine(K) { return say([["mn_carmine", "[sotto un ombrello, i baffi pieni di neve] Io sono qui per l'opera. La Vestale. Una donna sepolta viva perché ha lasciato spegnere il fuoco. [ti guarda] Bella storia. Istruttiva. Il Commendatore dice così."]]); },
      mn_gioann(K) { return say([["mn_gioann", "Palloni per la neve: li ho cuciti rossi, che si vedono. Settantun anni, sono magazziniere dal '21, e non ho mai giocato davanti alla Scala. Stanotte sì. Mi sono messo il cappotto della domenica."]]); },
      mn_pavesi(K) {
        if (S() !== 4) return say([["mn_pavesi", "Metodo, ragazzo. Due terzini, tre mediani, e tu davanti con la testa."]]);
        return K.ask("mn_pavesi", `Mister Pavesi ha le scarpe da città e un fischietto in bocca, per abitudine. Davanti alla Galleria, nella neve, gli uomini del Tondino si scaldano: undici cappotti scuri, il distintivo a ingranaggio. ${F.is("mn_bra_copre") ? "Ad arbitrare c'è Brambilla, col fischietto di plastica della figlia." : "Ad arbitrare c'è un uomo del Commendatore. Nessuno sa come si chiami. Nessuno lo chiede."} Dalle finestre del palazzo di fronte, un binocolo d'oro.`, [
          { label: "⚽ Ferrovieri contro l'XI del Tondino", big: true, fn: () => K.ownMatch(window.__pedinamento.start, { opp: { name: "L'XI del Tondino", kit: "#57534e", names: ["Il Fonditore", "Ciccio Ferro"] }, mate: { name: "Pierino", skin: "#f1d5b5", hair: "#78350f", shirt: "#7f1d1d" }, clean: F.is("mn_bra_copre"), fog: 0.3, lights: F.is("mn_bra_copre") ? 1 : 3, snow: true, hard: !F.is("mn_bra_copre"), half: 45,
            halftime: F.is("mn_bra_copre") ? "Intervallo. Brambilla soffia nel fischietto di plastica per scaldarlo. Dalla coda del loggione, che non se n'è andata, parte un applauso. Per l'arbitro. Alla Scala non era mai successo." : "Intervallo. L'arbitro guarda le finestre del palazzo. Il binocolo d'oro si abbassa e si rialza. Il secondo tempo sarà più lungo.",
            done: (r) => r.win ? say([
              ["voce", "Fischio finale. La neve ha coperto le righe del campo, le orme, il sangue di un labbro spaccato. La coda del loggione, che è rimasta tutta a guardare, intona il coro del Nabucco. Stonato. Bellissimo."],
              ["mn_ciccio", "[si toglie il distintivo a ingranaggio e lo lascia cadere nella neve] Io domani vado dal giudice. Coi miei piedi. Ho visto Ladri di biciclette dodici volte, adesso. Alla dodicesima ho capito come finisce."],
              ["voce", "Al palazzo di fronte, la finestra si chiude. Poi il portone si apre, e il Commendatore Balestrini attraversa la piazza a piedi, senza cappello, la neve sui capelli bianchi. Non guarda nessuno. Passa davanti a Leonardo e se ne va verso via Manzoni."],
            ], scegliFinale) : say([["mn_pavesi", "La neve è come il fango, ma più onesta: ti fa cadere e ti fa vedere dove. Rialzatevi. Si rigioca: il Commendatore non ha fretta, e noi neanche."]]) }) },
          { label: "Un momento", fn: () => say([["mn_pavesi", "Scaldati. In questa neve chi parte freddo si rompe."]]) },
        ]);
      },
    };
    delete talk.mn_fausto2;

    const sfida = () => { K.setStep(N, 4); K.questDone("mn5_palco"); K.quest("mn5_partita", "Mezzanotte in piazza", "Esci dalla Scala: Mister Pavesi ti aspetta davanti alla Galleria."); K.done(); };

    return { n: N, title: "La Prima di Sant'Ambrogio", sub: "La neve sulla Scala, la livrea di Elvira, il palco n° 4 e la partita di mezzanotte", goal, start: "mn_piazza", introBg: "mn_scala", zones, talk,
      intro: () => [["voce", "Tre settimane dopo. Il 7 dicembre, Sant'Ambrogio, la Prima della Scala."], ["voce", "Il Commendatore Balestrini e il Questore Vitali hanno un palco in prima fila. Tu hai un frac preso a nolo, un bottone d'acciaio in tasca, e un portiere da non dimenticare."]] };
  }

  boot();
})();
