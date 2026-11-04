// js/milano-c4.js - OPERAZIONE FUORIGIOCO NOIR · Capitolo 4 «Il Naviglio d'Inverno» (nuovo, 4 nov 2026)
// Mercoledì 17 novembre 1954, all'alba. Nando Colombo è stato ripescato nel Naviglio Grande. Il lavatoio, la casa di ringhiera,
// il medico legale, la Questura e il Questore che vuole chiudere il caso. Le scelte dei capitoli 1-2 cambiano chi ti aiuta.
(function () {
  "use strict";
  function boot() {
    const D = window.__milano;
    if (!D || !D.addChapter || !D._has(3)) return setTimeout(boot, 120);
    D.addChapter(chapter4);
  }

  function chapter4(K) {
    const N = 4, S = () => K.stepOf(N), F = K.F;
    const say = (ls, then) => K.say(ls, then || K.done);
    const rot = (a) => a[(K.frNow() >> 6) % a.length];

    K.cos("mn_c4", { kind: "shirt", label: "Cappotto nero da funerale, colletto alzato", val: "#111827", from: "Capitolo 4 di Operazione Fuorigioco Noir" });
    K.lore("l_navigli", { t: "I Navigli", d: "I canali di Milano: ci arrivano la sabbia del Ticino e il marmo del Duomo. D'inverno l'acqua è ferma e verde, e la nebbia ci si sdraia sopra come un cane." });
    K.lore("l_ringhiera", { t: "Le case di ringhiera", d: "Ballatoi lunghi su un cortile, una latrina per piano, le porte sempre aperte. Nessun segreto dura più di un pomeriggio. Tranne quelli che contano." });
    K.evidence("referto", { t: "Il referto di Sangalli", d: "Colpo alla nuca con un oggetto pesante e liscio. Poca acqua nei polmoni: era già svenuto quando è finito nel Naviglio. Non è annegato da ubriaco.", icon: "🩺", short: "Non è un incidente" });
    K.evidence("bottone", { t: "Il bottone d'acciaio", d: "Ripescato da Teresa nel lavatoio, impigliato in un lenzuolo. Un bottone da cappotto in acciaio brunito, con una B dentro un ingranaggio.", icon: "🔘", short: "Una B in un ingranaggio" });
    K.evidence("assegno", { t: "L'assegno nel guanto", d: "Duecentomila lire, banca di via Manzoni, non incassato. Nando l'aveva tenuto come prova.", icon: "🧤", short: "Il prezzo di un portiere" });

    const goal = (s) => ({
      0: "L'alzaia del Naviglio Grande, all'alba. De Santis è accanto al telo bianco, vicino al ponte.",
      1: `Due persone hanno visto qualcosa: Teresa al lavatoio${F.is("mn_c4_teresa") ? " ✓" : ""} e Rosetta, la moglie di Nando, nella casa di ringhiera${F.is("mn_c4_rosetta") ? " ✓" : ""}.`,
      2: "La Questura: il Questore Vitali vuole chiudere il caso come «incidente». Presentagli la prova giusta.",
      3: "In Questura qualcuno annota tutto. Parla con il brigadiere Scotti.",
      4: "La Darsena, al tramonto: gli uomini del Commendatore sono arrivati da Remo. Raggiungi il barcone.",
    }[s] || "Il quarto capitolo è concluso. Continua nel Capitolo 5.");

    const fin = () => {
      const msg = K.reward("mn_c4", { coins: 140, cos: "mn_c4" });
      K.finishChapter(N, F.is("mn_libro") ? "libro" : "senza_libro");
      K.scene([
        ["voce", "La sera, sull'alzaia, qualcuno ha acceso dei lumini lungo la ringhiera. Sono decine. Nessuno sa chi abbia cominciato."],
        ["mn_desantis", "[accanto a te, il cappello in mano] Il 7 dicembre c'è la prima alla Scala. Sant'Ambrogio. Balestrini ha un palco di proprietà, il quarto di prima fila. Ci va ogni anno, con il Questore."],
        ["mn_desantis", "Io sono sospeso. Tu sei un calciatore. Ines è una giornalista di pagina undici. Peppino è un allibratore. Sembra una barzelletta."],
        ["mn_desantis", "[rimette il cappello] Andiamo all'opera, figliolo. Mettiti la cravatta di Scotti. L'ultima volta."],
        ["voce", `<b>FINE DEL CAPITOLO 4.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 5: «La Prima di Sant'Ambrogio».`],
      ], () => K.openMain(), "mn_scala");
    };

    const zones = {
      mn_alzaia: {
        region: "naviglio", name: "L'Alzaia del Naviglio Grande", short: "Naviglio Grande", sub: "Acqua ferma, nebbia, case di ringhiera e un telo bianco", bg: "mn_naviglio", time: (s) => (s >= 4 ? "tramonto" : "alba"), travel: [3, 8],
        w: 34, h: 22, start: [3, 8], items: [[30, 8], [12, 15], [26, 15], [6, 19], [21, 19]],
        areas: [[1, 9, 32, 13, "Il Naviglio Grande"], [1, 16, 32, 20, "La Darsena"], [0, 0, 33, 21, "L'alzaia"]],
        flavor: {
          w: ["L'acqua del Naviglio: verde, ferma, fredda. In superficie, foglie di platano e un guanto di lana, uno solo, che nessuno ha il coraggio di ripescare.", "Il Naviglio. D'estate ci fanno il bagno i ragazzi. D'inverno, nessuno guarda dentro."],
          t: "Un platano dell'alzaia. Sulla corteccia, inciso col temperino: «N + R 1949». Le lettere sono state ripassate di recente.",
          l: "Un lampione a gas. Stanotte era spento. Il lampionaio di zona giura di averlo acceso. Qualcuno l'ha spento.",
          u: "Sacchi di sabbia del Ticino, pronti per i cantieri. Su ognuno, il timbro di chi li compra: ACCIAIERIE BALESTRINI · CANTIERI.",
          z: "Casse di legno sulla banchina. In una, chiodi. In un'altra, pane. In un'altra, niente: ci dorme il gatto della Darsena.",
          b: "Una panchina sull'alzaia. Nando ci si sedeva il sabato, dopo l'allenamento dei bambini, a mangiare pane e mortadella guardando l'acqua.",
          A: "Un manifesto mezzo strappato: «FERROVIERI–DIAVOLI DELL'OMBRA». Sopra, qualcuno ha appiccicato un ritaglio: la foto di Nando che para il rigore. Sotto, a matita: «CIAO PORTIERE».",
        },
        intro: [
          ["voce", "Mercoledì 17 novembre, alba. La nebbia sul Naviglio Grande è così fitta che le case di ringhiera sembrano galleggiare."],
          ["voce", "Sull'alzaia, vicino al ponte di ferro, due guardie tengono lontani i curiosi. Per terra, sotto un telo bianco, una forma lunga. Spuntano due scarpe coi tacchetti, ancora sporche del fango dell'Arena."],
          ["voce", "Nessuno parla. Una lavandaia, sulla porta del lavatoio, ha smesso di cantare."],
        ],
        npcs: (s) => [
          { id: "mn_desantis", at: s === 0 ? [14, 7] : [9, 7] },
          { id: "mn_sangalli", at: [17, 7] },
          { id: "mn_ines", at: [21, 8] },
          { id: "mn_tino", at: [28, 7] }, { id: "mn_pinin", at: [29, 7] },
          { id: "mn_remo", at: [20, 17] },
          ...(F.is("mn_pep_info") ? [{ id: "mn_peppino", at: [24, 18] }] : []),
          ...(s >= 4 ? [{ id: "mn_ciccio", at: [14, 17] }] : []),
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 21, "+"); lay(0, 0, 33, 0, "a"); lay(0, 21, 33, 21, "a"); lay(0, 0, 0, 21, "a"); lay(33, 0, 33, 21, "a");
          // le case di ringhiera, il lavatoio coperto, la fermata del tram per il centro
          house(1, 1, 11, 6, { door: [6, 6], roof: "#7c2d12", wall: "#b08050", rr: 2, lit: true, timber: "#5a3a22", enter: { to: "mn_ringhiera", at: [8, 9] } });
          house(13, 1, 7, 6, { door: [16, 6], roof: "#57534e", wall: "#a8a29e", rr: 2, lit: false, enter: { to: "mn_lavatoio", at: [7, 8] } });
          house(21, 1, 6, 6, { door: [23, 6], roof: "#44403c", wall: "#c8b89a", rr: 2, lit: true, enter: { room: "locanda", name: "Trattoria della Darsena", flavor: { T: "Un tavolo con un bicchiere pieno e nessuno seduto. Il bicchiere di Nando: lo tengono lì per una settimana, è l'usanza." } } });
          house(28, 1, 5, 6, { door: [30, 6], roof: "#1f2937", wall: "#64748b", rr: 2, lit: true, enter: { to: "mn_questura", at: [8, 9], locked: (K) => (K.stepOf(4) < 2 ? "La fermata del 19 per il centro. Il tram per la Questura passa ogni dodici minuti. Prima, però, c'è da capire cosa è successo qui." : false) } });
          lay(1, 7, 32, 8, ":");
          // il Naviglio con il ponte di ferro
          lay(1, 9, 32, 13, "w"); lay(15, 9, 17, 13, "=");
          lay(1, 14, 32, 15, ":");
          // la Darsena: sabbia, casse, il barcone di Remo all'ormeggio (in acqua, a destra)
          lay(1, 16, 32, 20, "+"); lay(27, 16, 32, 20, "w"); lay(27, 17, 31, 19, "="); lay(26, 18, 26, 18, "=");
          [[3, 17], [4, 17], [3, 18], [9, 19], [10, 19]].forEach(([x, y]) => put(x, y, "u")); [[13, 19], [14, 19], [6, 16]].forEach(([x, y]) => put(x, y, "z"));
          // platani, lampioni, panchine, il telo bianco
          [[2, 14], [8, 14], [22, 14], [32, 15]].forEach(([x, y]) => put(x, y, "t")); [[12, 7], [26, 7], [11, 15], [23, 15]].forEach(([x, y]) => put(x, y, "l"));
          put(19, 14, "b"); put(20, 14, "b"); put(25, 7, "A");
          house(18, 7, 2, 1, { roof: "#e5e7eb", wall: "#e5e7eb", rr: 1, enter: "Il telo bianco. Non lo sollevi. Hai visto le scarpe: basta." });
        },
        decor(g, cx, cy, d) {
          K.plaque(g, "CASA DI RINGHIERA", d.X(6) + 8, d.Y(1) - 2, "#fde68a"); K.plaque(g, "LAVATOIO", d.X(16) + 8, d.Y(1) - 2, "#e5e7eb"); K.plaque(g, "TRAM 19 · QUESTURA", d.X(30) + 8, d.Y(1) - 2, "#93c5fd"); K.plaque(g, "DARSENA", d.X(20) + 8, d.Y(16) - 4, "#a7f3d0");
          if (d.step >= 4) for (let i = 0; i < 12; i++) { const x = d.X(2 + i * 2.6) + 8, y = d.Y(9) - 2; K.P(x - 1, y - 3, 3, 4, "#fef3c7"); K.light(x, y - 3, 10, "255,200,110", 0.5 + 0.15 * Math.sin(d.fr / 7 + i)); }
        },
      },

      mn_ringhiera: {
        interior: true, region: "naviglio", name: "La casa di Nando e Rosetta", short: "Casa di ringhiera", sub: "Due stanze, una macchina da cucire, un lumino", bg: "mn_ringhiera", time: "alba",
        w: 15, h: 11, start: [8, 9], outside: ["mn_alzaia", 6, 7],
        flavor: {
          T: "Il tavolo della cucina. Due tazze. Una lavata, una no. Rosetta non ha avuto il coraggio di lavare quella di Nando.",
          D: "Il comò con la foto del matrimonio: Nando in giacca presa a prestito, Rosetta in un vestito che si è cucita da sola. Ridono tutti e due. Nella foto non sapevano niente.",
          B: "Il letto rifatto con cura. Sul cuscino di Nando, i guanti di lana bucati sulle punte. Uno solo. L'altro è nel Naviglio.",
          W: "La finestra sul ballatoio. Da qui si vede l'alzaia, il ponte, il telo bianco. Rosetta ha tirato la tenda. Poi l'ha riaperta.",
          H: "La stufa a legna, spenta. Accanto, il secchio del carbone vuoto. Nando doveva portarlo su ieri sera.",
        },
        intro: [["voce", "Due stanze al secondo piano, sul ballatoio. Una macchina da cucire, quaranta camicie piegate, un lumino davanti a una foto. Rosetta cuce. Non si ferma. Se si ferma, dice, non riparte più."]],
        npcs: () => [{ id: "mn_rosetta", at: [9, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 14, 10, "="); lay(0, 0, 14, 1, "a"); lay(0, 0, 0, 10, "a"); lay(14, 0, 14, 10, "a"); lay(0, 10, 14, 10, "a"); put(8, 10, "v");
          put(4, 1, "W"); put(10, 1, "W"); put(1, 3, "B"); put(1, 4, "B"); put(13, 2, "H"); put(6, 5, "T"); put(7, 5, "T"); put(12, 6, "D"); put(12, 7, "D"); put(10, 4, "T");
        },
        decor(g, cx, cy, d) { K.light(d.X(12) + 8, d.Y(6), 22, "255,190,90", 0.45 + 0.1 * Math.sin(d.fr / 6)); },
      },

      mn_lavatoio: {
        interior: true, region: "naviglio", name: "Il lavatoio coperto del Vicolo", short: "Lavatoio", sub: "Vasche di pietra, acqua del Naviglio, lenzuola", bg: "mn_naviglio", time: "alba",
        w: 14, h: 10, start: [7, 8], outside: ["mn_alzaia", 16, 7],
        flavor: {
          w: "La vasca del lavatoio: acqua del Naviglio che entra da una grata e esce da un'altra. Stamattina è entrato qualcos'altro.",
          z: "Ceste di vimini con le lenzuola delle famiglie del Vicolo. Ognuna ha un nastro di colore diverso. Il nastro granata è dei Colombo.",
          n: "Un cartello: «VIETATO LAVARE I PANNI DEI MORTI DI TIFO». È del 1911. Nessuno l'ha mai tolto.",
        },
        intro: [["voce", "Il lavatoio coperto: vasche di pietra in fila, l'acqua fredda del Naviglio che scorre sotto le lenzuola sbattute. Oggi le lenzuola sono ferme. Teresa è seduta sul bordo di una vasca, le mani rosse, gli occhi asciutti."]],
        npcs: () => [{ id: "mn_teresa", at: [4, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(2, 2, 11, 3, "w"); lay(2, 5, 3, 5, "z"); put(11, 6, "z"); put(12, 5, "z"); put(1, 7, "n");
        },
      },

      mn_questura: {
        interior: true, region: "bastioni", name: "La Questura centrale", short: "Questura", sub: "Corridoi, fascicoli, la lampada verde, la penna d'oro", bg: "mn_questura", time: "notte",
        w: 18, h: 12, start: [8, 10], outside: ["mn_alzaia", 30, 7],
        flavor: {
          E: "La scrivania del Questore: vuota, lucida, una penna stilografica d'oro posata di traverso come una sbarra.",
          T: "La scrivania della Squadra Mobile: fascicoli, mozziconi, una tazza con scritto «AL MIGLIOR PAPÀ». De Santis non ha figli. Era di sua moglie.",
          L: "L'archivio: scaffali di fascicoli in ordine alfabetico. Alla B, un vuoto lungo un palmo.",
          D: "L'armadio di Scotti: diciassette quaderni, uno per mese. Sul dorso dell'ultimo: «NOVEMBRE · TUTTO».",
          W: "La finestra su via Fatebenefratelli. Di notte, alle 23:10, si vede bene chi entra dal portone principale.",
        },
        intro: [["voce", "La Questura di via Fatebenefratelli: corridoi verdi, odore di carta e di cera, una radio che trasmette il Giornale Radio a volume bassissimo. In fondo al corridoio, la porta a vetri smerigliati con scritto QUESTORE."]],
        npcs: (s) => [
          { id: "mn_vitali", at: [13, 3] },
          { id: "mn_desantis", at: [4, 4] },
          { id: "mn_scotti", at: [3, 8] },
          ...(F.is("mn_pep_arresto") ? [{ id: "mn_peppino", at: [15, 8] }] : []),
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 11, "="); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 11, "a"); lay(17, 0, 17, 11, "a"); lay(0, 11, 17, 11, "a"); put(8, 11, "v");
          lay(11, 2, 15, 2, "E"); put(4, 1, "W"); put(14, 1, "W"); lay(2, 3, 5, 3, "T"); lay(1, 5, 1, 9, "L"); put(16, 4, "D"); put(16, 5, "D");
          lay(13, 6, 16, 6, "a"); lay(13, 7, 13, 7, "a"); lay(13, 9, 13, 10, "a"); // la camera di sicurezza (si parla dalle sbarre)
        },
        decor(g, cx, cy, d) { K.light(d.X(4) + 8, d.Y(3), 30, "200,255,190", 0.35); K.plaque(g, "QUESTORE", d.X(13) + 8, d.Y(1) + 4, "#fde68a"); },
      },
    };

    const both = () => { if (F.is("mn_c4_teresa") && F.is("mn_c4_rosetta") && S() === 1) { K.setStep(N, 2); K.quest("mn4_questura", "La Questura", "Prendi il 19 alla fermata in fondo all'alzaia: il Questore Vitali vuole chiudere il caso."); } };

    const talk = {
      mn_desantis(K) {
        const s = S();
        if (s === 0) return say([
          ["mn_desantis", "[non si volta. Guarda l'acqua] Due barcaioli l'hanno visto all'alba, impigliato nella catena del ponte. Aveva ancora la maglia dei Ferrovieri sotto il cappotto."],
          ["mn_desantis", F.is("mn_nando_lista") ? "La lista della valigia è arrivata in Questura venerdì. È passata dalla scrivania del Questore prima che dalla mia. Ventiquattro ore. Ventiquattro ore bastano." : "Il suo nome non era nella lista che mi hai portato. Ma lui lunedì è andato al Corriere d'Informazione. A cercare Ines. Qualcuno l'ha visto entrare. Qualcuno l'ha visto uscire."],
          ["mn_desantis", "Il Questore ha già telefonato. «Un ubriaco, scivolato sull'alzaia». Il caso si chiude stasera, dice. Non si chiude stasera."],
          ["mn_desantis", "Teresa, al lavatoio, l'ha trovato lei. E Rosetta… Rosetta è su, nella casa di ringhiera. Io non ci riesco, a salire. Vai tu. Per favore."],
        ], () => { K.setStep(N, 1); K.quest("mn4_testimoni", "Chi ha visto", "Parla con Teresa al lavatoio e con Rosetta nella casa di ringhiera."); K.done(); });
        if (s === 1) return say([["mn_desantis", "Teresa e Rosetta. Una ha visto la notte. L'altra ha visto Nando, prima. Servono tutte e due."]]);
        if (s === 2) return say([["mn_desantis", "In Questura. Il Questore ti riceverà perché è curioso. È l'unica sua debolezza: vuole sapere quanto sai."]]);
        if (s === 4) return say([["mn_desantis", "La Darsena. Gli uomini di Balestrini sono da Remo. Vanno a cercare chi ha parlato. Andiamo."]]);
        return say([["mn_desantis", "Sono sospeso, figliolo. Ma nessuno ha detto che non posso stare in piedi su un'alzaia a guardare l'acqua."]]);
      },
      mn_sangalli(K) {
        if (!K.hasClue("referto")) return say([
          ["mn_sangalli", "[si toglie i guanti di gomma, fischietta due note della Traviata, si ferma] Dottor Sangalli, medico legale. Lei è il compagno di squadra? Mi dispiace. Lo dico sempre, a volte lo penso. Oggi lo penso."],
          ["mn_sangalli", "Il Questore vuole «annegamento accidentale in stato di ebbrezza». Io ho trovato un colpo alla nuca, oggetto pesante e liscio, e pochissima acqua nei polmoni. Era svenuto quando è entrato nel Naviglio. E di alcol, nel sangue, non ce n'era. Era un portiere, non un poeta."],
          ["mn_sangalli", "Ho scritto il referto in due copie. Una va al Questore. L'altra… [te la mette in mano] l'altra si è persa. Capita. Sono un uomo distratto."],
        ], () => { K.giveClue("referto"); K.bond("fiuto", 12); K.done(); });
        return say([["mn_sangalli", rot(["Faccio questo mestiere da ventidue anni. I morti non mentono mai. Sono i vivi che mi danno lavoro.", "«Addio del passato…» [smette di fischiettare] Scusi. È un'abitudine. Fischietto per non sentire."])]]);
      },
      mn_teresa(K) {
        if (!F.is("mn_c4_teresa")) return say([
          ["mn_teresa", "[non alza gli occhi dalla vasca] Canto sempre, la mattina. Alle cinque comincio. Stamattina ho cominciato, e poi ho visto la maglia. Granata. E ho smesso."],
          ["mn_teresa", "Ieri notte, verso le undici e mezza, ho sentito un'automobile sull'alzaia. Qui le automobili non vengono mai: c'è il fango. Era nera, lunga, coi fari spenti. Due uomini. Uno grosso, uno coi capelli bianchi che non è sceso."],
          ["mn_teresa", "E stamattina, nel lenzuolo dei Colombo… [apre la mano] questo. Era impigliato nell'orlo. Un bottone. Di quelli che porta la gente che non lava i panni da sé."],
        ], () => { F.set("mn_c4_teresa", true); K.giveClue("bottone"); K.bond("fiuto", 10); K.weight.add("pieta", 0); both(); K.done(); });
        return say([["mn_teresa", rot(["Domani ricomincio a cantare. Per lui. Una canzone sola, poi basta.", "Nando mi portava i secchi pesanti. Senza che glielo chiedessi. Diceva che i portieri hanno le braccia per quello."])]]);
      },
      mn_rosetta(K) {
        if (!F.is("mn_c4_rosetta")) return say([
          ["mn_rosetta", "[la macchina da cucire va avanti, regolare] Siediti. No, non ti alzare quando parlo. Non sono una signora. Sono una sarta a cottimo, e devo finire quaranta camicie per venerdì."],
          ["mn_rosetta", "Lunedì sera è tornato tardi. Mi ha detto: «Rosè, domani vado a dire tutto a quella del giornale. Poi siamo puliti». Ha dormito come un bambino. Era da luglio che non dormiva."],
          ["mn_rosetta", "Ieri sera è uscito a prendere il carbone. Il secchio è ancora lì, vuoto. [la macchina si ferma. Riparte] Ha lasciato i guanti. Uno l'hanno trovato. L'altro è nel Naviglio."],
          ["mn_rosetta", "Dentro il guanto c'era questo. Lui diceva che era la sua assicurazione. Prendilo. Io non so che farmene, di un'assicurazione su un morto."],
        ], () => K.interroga("assegno", { biglietti: 40, fiuto: 25 }, () => { F.set("mn_c4_rosetta", true); K.giveClue("assegno"); K.rel && K.rel.add("mn_nando", 8); both(); say([["mn_rosetta", "Trovalo, chi è stato. Ma non portarmelo qui. Non voglio vedere la sua faccia. Voglio solo sapere che c'è qualcuno che lo sa."]]); }));
        return say([["mn_rosetta", rot(["Quaranta camicie. Ne mancano ventidue. Poi piango. Venerdì sera, dalle otto alle nove. Ho già deciso.", "Elvira, la sarta della Scala, mi ha insegnato a cucire quando avevo quindici anni. Volevo fare i costumi delle regine. Faccio camicie per i ragionieri. Va bene lo stesso."])]]);
      },
      mn_vitali(K) {
        const s = S();
        if (s === 2) return say([
          ["mn_vitali", "[non si alza, fa girare la penna d'oro tra le dita] Il giovanotto dei Ferrovieri. Il portiere era suo amico, mi dicono. Condoglianze. Un ubriaco, purtroppo: l'alzaia, di notte, è scivolosa."],
          ["mn_vitali", "Il Commissario De Santis è sospeso da stamattina per eccesso di zelo. Lei, invece, è un calciatore. Torni a giocare a pallone, che è una cosa bellissima. Ci pensi, prima di insistere."],
        ], () => K.present({ who: "mn_vitali", prompt: "«Un ubriaco scivolato sull'alzaia», dice il Questore. Cosa gli metti sulla scrivania?", ok: ["referto"],
          right: () => say([
            ["voce", "Posi il referto di Sangalli sulla scrivania lucida. Il Questore lo legge. Tutto. Due volte. La penna d'oro smette di girare."],
            ["mn_vitali", "Colpo alla nuca. Niente alcol. [piega il foglio in quattro, con cura] Il dottor Sangalli è un uomo distratto, lo sanno tutti. Perde le copie."],
            ["mn_vitali", "Facciamo così: il caso resta aperto. Lo seguo io, personalmente. Lei torni ai suoi allenamenti, e il Commissario resta a casa. È la soluzione più… elegante."],
            ["hero", "E se il caso lo seguisse un giudice?"],
            ["mn_vitali", "[sorride, per la prima volta] I giudici, a Milano, vanno tutti alla Scala il 7 dicembre. Lo sapeva? Si siedono in platea. Io in palco. Arrivederci."],
          ], () => { K.weight.add("legge", 1); K.setStep(N, 3); K.questDone("mn4_questura"); K.quest("mn4_scotti", "Chi annota tutto", "Parla con il brigadiere Scotti, in Questura."); K.done(); }),
          wrong: (id) => say([["mn_vitali", id === "bottone" ? "Un bottone. Mezza Milano porta il cappotto di cammello, giovanotto. Anch'io. Vuole il mio?" : id === "assegno" ? "Un assegno non incassato. Un ragazzo pieno di debiti e d'orgoglio: ecco perché beveva. Lei mi sta dando ragione." : "Interessante. Ma non mi dice come è morto. Mi dice come è vissuto, al massimo."]], () => K.done()),
          back: () => K.done() }));
        if (s >= 3) return say([["mn_vitali", rot(["Ancora qui? Il calcio ha bisogno di lei. La Questura no.", "[firma un foglio con la penna d'oro, senza guardarlo] Regalo di un amico. Gli amici fanno regali così, quando sei utile."])]]);
        return say([["mn_vitali", "Ho da fare, giovanotto. Il Questore ha sempre da fare. È per questo che lo pagano."]]);
      },
      mn_scotti(K) {
        const s = S();
        if (s === 3) return say([
          ["mn_scotti", "[apre il quaderno «NOVEMBRE · TUTTO» con le mani che tremano] Commissario mi ha detto di non fare niente. Io ho fatto niente. Però, mentre facevo niente, ho annotato."],
          ["mn_scotti", "Io annoto tutto. Lei lo sa. Anche le cose che non servono. Soprattutto quelle. Il registro delle visite notturne lo tiene l'appuntato Musso, ma l'appuntato Musso si addormenta alle undici. Alle undici lo tengo io. Per hobby."],
          ["mn_scotti", "Ho ricopiato la pagina del 16 novembre. A mano. Con la mia calligrafia, che è brutta ma è onesta."],
        ], () => K.interroga("registro", { fiuto: 30, sospetto: 20 }, () => say([
          ["mn_scotti", "Ho fatto bene? [pausa] Ho fatto bene. Lo vedo dalla sua faccia. Ho annotato anche la sua faccia."],
          ["mn_desantis", "[dalla scrivania, senza alzare la testa] Scotti. Sei il miglior poliziotto di Milano. Non dirlo a nessuno."],
        ], () => desantisConfessa())));
        return say([["mn_scotti", rot(["Diciassette quaderni. Uno al mese. Il primo comincia: «Il Commissario non fuma, accende». È ancora vero.", "Il fuorigioco non è un reato, ho scoperto. L'omicidio sì. Questo lo sapevo già, ma l'ho annotato lo stesso."])]]);
      },
      mn_peppino(K) {
        const s = S();
        if (F.is("mn_pep_arresto")) return say(F.is("mn_pep4") ? [["mn_peppino", rot(["Qui dentro le pareti hanno orecchie. Le orecchie hanno uno stipendio. Lo paga il Questore.", "Nando… Nando giocava da me a luglio. Una sera sola. Io gliel'ho detto: «Non sei capace, lascia stare». Non ha lasciato stare."])]] : [
          ["mn_peppino", "[dalle sbarre della camera di sicurezza] Ragazzo. Hai sentito di Nando? Io l'ho saputo dalla guardia. Qui le notizie arrivano prima che fuori."],
          ["mn_peppino", "C'era un libro. Un libro mastro, con tutte le puntate, tutti i pagamenti, tutti i nomi. Io lo tenevo a casa, sotto il pavimento. Ieri sono venuti a perquisire. Ordine del Questore. Il libro non c'è più."],
          ["mn_peppino", "Se fossi stato fuori, l'avrei portato via in tempo. [sputa] Ma ero dentro. Grazie a te."]], () => { F.set("mn_pep4", true); K.weight.add("ombra", 0); K.done(); });
        if (s === 4 && !F.is("mn_libro")) return say([
          ["mn_peppino", "[sbuca dalla stiva del barcone, pallido] Ragazzo! Sono tre giorni che dormo qui sotto, con la sabbia. Remo mi tiene nascosto. Dopo Nando ho capito che il prossimo ero io."],
          ["mn_peppino", "Ti ho promesso informazioni, al Deposito. Eccole: c'è un libro mastro. Tutte le puntate, tutti i pagamenti, tutti i nomi, e la sigla di chi pagava: una B in un ingranaggio. L'ho portato via da casa due ore prima che venissero a perquisire."],
          ["mn_peppino", "[ti dà un registro con la copertina di tela cerata] Prendilo. Io ho un occhio solo, ma ci vedo bene: questo libro è più pericoloso di una pistola. Tienilo lontano dall'acqua. Qui a Milano l'acqua si prende tutto."],
        ], () => { F.set("mn_libro", true); K.rel && K.rel.add("mn_peppino", 10); K.bond("biglietti", 60); K.done(); });
        return say([["mn_peppino", rot(["Dormo con la sabbia del Ticino. È più comoda di certi letti di via Torino.", "Remo dice che la Darsena protegge chi ci dorme. La Darsena dice niente: è acqua."])]]);
      },
      mn_remo(K) {
        const s = S();
        if (s === 4) return K.ask("mn_remo", "Remo si toglie il berretto. Sulla banchina, cinque uomini in cappotto scuro con il distintivo a ingranaggio. Uno è Ciccio Ferro, che guarda per terra. «Vogliono salire sul barcone a cercare uno. Alla Darsena le liti si fanno a pallone sulla sabbia, da cent'anni. Se vincete voi, se ne vanno.»", [
          { label: "⚽ La partita della Darsena", big: true, fn: () => K.ownMatch(window.__pedinamento.start, { opp: { name: "Gli Uomini del Tondino", kit: "#78350f", names: ["Ciccio Ferro", "Il Fonditore"] }, mate: { name: "Remo", skin: "#c69468", hair: "#44403c", shirt: "#1e3a8a" }, clean: true, fog: 0.85, lights: 1, mud: true, half: 40,
            halftime: "Intervallo. Ciccio Ferro si siede su un sacco di sabbia e dice a nessuno: «Io il portiere non l'ho toccato. Io ero in macchina. Ero in macchina»",
            done: (r) => r.win ? say([
              ["mn_ciccio", "[resta indietro mentre gli altri se ne vanno, la voce rotta] Io ero in macchina. Lo giuro. Ho visto il Fonditore scendere col tubo di ferro. Il Commendatore è rimasto seduto. Ha detto solo: «Pulito, mi raccomando»."],
              ["mn_ciccio", "Undici volte ho visto Ladri di biciclette. Undici. E stanotte ho guidato la macchina. [se ne va nella nebbia, senza voltarsi]"],
              ["mn_remo", "Hai sentito? L'ha detto. L'ha detto davanti a tre barcaioli e a un gatto. Alla Darsena vale come davanti a un notaio."],
            ], () => { F.set("mn_ciccio_test", true); fin(); }) : say([["mn_remo", "La sabbia è traditora: prima ti regge, poi ti mangia i piedi. Rifiatiamo e riproviamo. Quelli lì non hanno fretta, ma nemmeno pazienza."]]) }) },
          { label: "Un momento", fn: () => say([["mn_remo", "Il Naviglio aspetta. È l'unica cosa che sa fare bene."]]) },
        ]);
        if (!F.is("mn_re1")) { F.set("mn_re1", true); return say([
          ["mn_remo", "Remo, barcaiolo. Porto la sabbia del Ticino ai cantieri. Trent'anni sul Naviglio. Conosco le correnti come le rughe di mia madre: di notte l'acqua va verso la Darsena, piano piano, e porta tutto lì."],
          ["mn_remo", "Nando l'abbiamo trovato noi, io e mio cognato. Impigliato nella catena del ponte. Se fosse caduto dall'alzaia davanti alla Darsena, come dice la Questura, la corrente l'avrebbe portato via, non su. È caduto più a monte. Vicino alla fermata del tram. Dove arrivano le automobili."]], () => { K.bond("fiuto", 12); K.done(); }); }
        return say([["mn_remo", rot(["La sabbia che porto finisce nel cemento. Il cemento finisce nei palazzi. I palazzi stanno in piedi col tondino di Balestrini. È tutta una catena, ragazzo.", "Mio padre portava il marmo per il Duomo. Io porto la sabbia per le case dei ricchi. Mio figlio, spero, farà il portiere."])]]);
      },
      mn_ines(K) {
        if (!F.is("mn_in4")) { F.set("mn_in4", true); return say([
          ["mn_ines", "[col taccuino chiuso, per la prima volta] È venuto lunedì in redazione. Mi ha aspettato due ore all'ingresso, coi guanti in mano. Io ero dal caporedattore a farmi dire che il calcio di Promozione non interessa a nessuno."],
          ["mn_ines", "Quando sono scesa, se n'era andato. Ha lasciato detto al portiere: «Torno domani, ho una storia per la signorina dello sport». La signorina dello sport."],
          ["mn_ines", "[apre il taccuino] Adesso la scrivo io, la sua storia. In prima pagina. Mi devono licenziare per impedirmelo. Mi licenzino."]], () => { K.rel && K.rel.add("mn_ines", 10); K.weight.add("pieta", 1); K.done(); }); }
        return say([["mn_ines", rot(["Il caporedattore ha detto: «Niente nomi». Io ho detto: «Allora niente articolo». Lui ha detto: «Allora niente stipendio». Siamo in trattativa.", "Nando Colombo, ventisei anni, portiere. Ha parato un rigore al novantesimo. Due giorni dopo era nel Naviglio. Questo non è un tabellino."])]]);
      },
      mn_tino(K) { return say([["mn_tino", "[senza brillantina, il cappello in mano] Oggi non litighiamo. Oggi no."], ["mn_pinin", "Oggi no. [pausa] Era un portiere, Tino. Uno dei nostri, anche se giocava coi Ferrovieri."], ["mn_tino", "Uno dei nostri."]]); },
      mn_pinin(K) { return say([["mn_pinin", "Abbiamo fatto la colletta all'Osteria. Battista ha messo il doppio di tutti. Sciur Carlo ha messo il sette bello, quello piegato: dice che è tutto quello che ha di prezioso. Lo diamo a Rosetta."]]); },
      mn_ciccio(K) { return say([["mn_ciccio", "[guarda per terra] Non mi guardi così. Io non ho fatto niente. Io guidavo. [si asciuga il naso con la manica] Guidavo."]]); },
    };

    const desantisConfessa = () => say([
      ["mn_desantis", "[accende una sigaretta. Stavolta la fuma] Ti devo il resto di una storia. Quella di mia moglie. Inverno del '48."],
      ["mn_desantis", "Indagavo sul mercato nero del ferro. Ferro rubato ai cantieri della ricostruzione, rivenduto a peso d'oro. Le tracce portavano a una piccola fonderia di Sesto. Si chiamava Balestrini & Figli."],
      ["mn_desantis", "Mia moglie aveva bisogno della penicillina. Al mercato nero costava un anno di stipendio. Un signore coi capelli ancora neri mi ha fatto arrivare dieci fiale. Io ho perso un fascicolo. Lei è morta lo stesso, a febbraio."],
      ["mn_desantis", "Vitali era il mio capo, allora. Ha trovato il fascicolo perso. L'ha tenuto. Da sei anni mi tiene al guinzaglio con quello. Per questo non ho mai guardato in via Manzoni. Fino a Nando."],
      ["mn_desantis", "[spegne la sigaretta] Adesso guardo. E se serve, il fascicolo lo porto io al giudice. Con la mia firma sopra. Ho finito di avere paura di una cosa che è già successa."],
    ], () => { K.rel && K.rel.add("mn_desantis", 12); K.questDone("mn4_scotti"); K.setStep(N, 4); K.quest("mn4_darsena", "La Darsena", "Torna all'alzaia e raggiungi Remo al barcone della Darsena: gli uomini del Commendatore sono lì."); K.done(); });

    return { n: N, title: "Il Naviglio d'Inverno", sub: "Un portiere nel Naviglio, la casa di ringhiera, la Questura e la Darsena", goal, start: "mn_alzaia", introBg: "mn_naviglio", zones, talk,
      intro: () => [["voce", "Tre giorni dopo il derby."], ["voce", "Il Corriere d'Informazione, pagina undici, sotto i necrologi: «Ritrovato nel Naviglio Grande il portiere dei Ferrovieri Ferdinando Colombo, 26 anni. Si ipotizza una disgrazia»."]] };
  }

  boot();
})();
