// js/doppio-turno-c1.js - DOPPIO TURNO · Capitolo 1 «Primo Turno»
// Dentro: Atrio del Complesso, Reparto Morale, Campo Bianco (Partita in Cuffia, forzata). Fuori: Porto Livido.
// Primo biglietto vero (dal Fuori) e primo biglietto falso (qualcuno che conosce tutte e due le metà).
(function () {
  "use strict";
  function boot() { const DTm = window.__doppioTurno; if (!DTm || !DTm.addChapter) return setTimeout(boot, 120); DTm.addChapter(chapter1); }
  function chapter1(X) {
    const { T, F, say, ask, done, go, note, setStep, reward, knows, learnFact, conf, finishChapter } = X;
    const N = 1, S = () => X.stepOf(N);

    // ---------------------------------------------------------------- personaggi
    X.cast("dt_valtorre", { name: "Dott.ssa Valtorre", tag: "", hair: "#d9d4c8", style: "bun", skin: "#f0d0b8", eye: "#2a9d8f", glasses: true, bg: ["#eef2f1", "#2a9d8f"], shirt: "#ffffff" },
      "Irma Valtorre, direttrice del Valtorre FC e della «Procedura Duale». Sorriso perfetto, voce gentile, un regolamento per ogni respiro. Non alza mai la voce: non ne ha bisogno.");
    X.cast("dt_bruno", { name: "Bruno Tessari", tag: "", hair: "#2b1d14", style: "buzz", skin: "#c68642", eye: "#2b1d14", bg: ["#dfe9e7", "#2a9d8f"], shirt: "#9aa5b1" },
      "Mediano del Valtorre FC e responsabile del Reparto Morale. Ama il club, le regole e i sorrisi, che conta in un registro. È il Dentro più felice del Complesso. Lo dice lui.");
    X.cast("dt_ofelia", { name: "Ofelia Sanz", tag: "", hair: "#3a1a2a", style: "long", skin: "#e8c4a0", eye: "#3a1a2a", glasses: true, bg: ["#dfe9e7", "#3a1a2a"], shirt: "#9aa5b1" },
      "Analista del Valtorre FC. Conta le porte, i passi, i secondi. Ha il vizio di lasciare le cose dove non dovrebbero stare, per vedere chi le sposta.");
    X.cast("dt_nina", { name: "Nina Rocca", tag: "", hair: "#b8452a", style: "codino", skin: "#d9a679", eye: "#2b1d14", bg: ["#2a1a24", "#ffb347"], shirt: "#7a3b2e" },
      "La barista del Bar Marea, a Porto Livido. Ex capitana del Porto Livido FC, prima che il club fallisse e il Valtorre si comprasse lo stadio. Ha un pennarello verde sempre in tasca.");
    X.cast("dt_pio", { name: "Guardiano Pio", tag: "", hair: "#9a9a9a", style: "buzz", skin: "#e0b48a", eye: "#2b1d14", cap: "#2a9d8f", bg: ["#eef2f1", "#2a9d8f"], shirt: "#2a9d8f" },
      "Il guardiano dell'ingresso del personale. Lavora sul confine: metà del suo corpo è sempre fuori dalla porta e metà dentro. Dice che così non si annoia.");
    X.cos("dt_c1", { kind: "shirt", label: "Tuta del Dentro", val: "#9aa5b1", from: "Completa il Capitolo 1 di Doppio Turno" });
    X.cos("dt_acqua", { kind: "hairc", label: "Capelli Verde Acqua", val: "#2a9d8f", from: "Raccogli tutte le graffette d'oro nell'Atrio" });
    X.cos("dt_neon", { kind: "shirt", label: "Camicia Neon", val: "#cfe3df", from: "Raccogli tutte le graffette d'oro al Reparto Morale" });
    X.cos("dt_platino", { kind: "hairc", label: "Capelli Platino", val: "#d9d4c8", from: "Raccogli tutte le graffette d'oro al Campo Bianco" });
    X.cos("dt_marea", { kind: "shirt", label: "Maglia Bar Marea", val: "#7a3b2e", from: "Raccogli tutte le conchiglie a Porto Livido" });

    // ---------------------------------------------------------------- fatti
    X.fact("f_esiste", { t: "Esiste un Fuori", d: "Fuori dal Complesso c'è una città, e una tua vita. A quanto pare, piove." });
    X.fact("d_regole", { t: "Le Regole del Dentro", d: "Uno: si sorride. Due: non si chiede del Fuori. Tre: la Voce ha sempre ragione." });
    X.fact("d_porte", { t: "La porta numero 8", d: "Nella pianta del Reparto Morale le porte sono sette. Nel corridoio ce ne sono otto. L'ottava è chiusa con un codice." });
    X.fact("d_voce", { t: "La Voce nella cuffia", d: "Durante le partite una voce dà ordini nella cuffia. Calma, gentile. Con un accento che ti sembra di conoscere." });
    X.fact("f_nina", { t: "Nina del Bar Marea", d: "Nina, la barista del porto, ti conosce. Dice che eri il capitano del Porto Livido FC." });
    X.fact("f_quattordici", { t: "Il numero 14", d: "Al Porto Livido portavi il 14. Adesso, al Valtorre, porti il {num}." });
    X.fact("f_stadio", { t: "Il vecchio Stadio del Porto", d: "Il Porto Livido FC è fallito tre anni fa. Il Valtorre ha comprato il suo stadio e l'ha chiuso con un recinto." });

    // ---------------------------------------------------------------- biglietti del copione
    X.noteDef("n_benvenuto", { to: "d", ink: "pennarello verde", sign: "{num}", fact: "f_esiste", fake: false,
      text: "Ciao. Sono te: quello di fuori. Non so cosa fai lì dentro, ma fuori piove e il mare è bello. Gioca bene. E fidati della Voce.",
      after: (v) => { if (S() <= 1) setStep(N, 2); say([["voce", v === "vero" ? "Rimetti il biglietto nell'armadietto. Una frase ti resta in testa, come una canzone: «fidati della Voce». Quale voce?" : "Lo rimetti nell'armadietto. Eppure la calligrafia era la tua. Le tue G con il ricciolo. Strano."], ["voce", "Dall'altoparlante: «Benvenuto, {n}. Il Reparto Morale ti aspetta. A est. Sorridi»."]]); } });
    X.noteDef("n_stadio", { to: "f", ink: "penna blu aziendale", sign: "{num}", fake: true, who: "il Complesso",
      text: "Sono il Dentro. Qui va tutto bene, davvero. Ti chiedo una cosa sola: stai lontano dal vecchio stadio del porto. Non serve a niente tornarci.",
      tell: "Il Dentro non sa niente del vecchio stadio del porto: là dentro non ricordi nemmeno che esista il mare. Chi ha scritto questo conosce tutte e due le tue metà.",
      onBelieve: () => { conf(5); F.set("c1_stadio_evitato", true); }, onUnmask: () => F.set("c1_smascherato", true),
      after: () => { if (S() === 6) setStep(N, 7); X.done(); } });

    const goal = (s) => ({
      0: "Apri l'Armadietto 7 (in alto a sinistra dell'atrio).",
      1: "Leggi il biglietto nell'Armadietto 7.",
      2: "Vai al Reparto Morale (uscita a est dell'atrio) e cerca Bruno.",
      3: "Trova Ofelia, in fondo al Reparto Morale.",
      4: "Vai al Campo Bianco (uscita a ovest dell'atrio): la Presentazione sta per cominciare. Parla con la Dott.ssa Valtorre.",
      5: "Fine turno. Prendi l'ascensore nell'atrio. (Prima, se vuoi, lascia un biglietto all'altra metà nell'Armadietto 7.)",
      6: "Sei Fuori. Parla con Nina al Bar Marea, poi apri l'Armadietto 7 all'ingresso del personale.",
      7: "Torna da Nina, al Bar Marea.",
    }[s] || "Primo turno concluso. Il prossimo capitolo ti aspetta dal menu.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y, f) { g.font = "bold 7px system-ui, sans-serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, f ? "rgba(26,16,24,.85)" : "#ffffff"); R(g, x - w / 2, y + 2, w, 1, f ? "#ffb347" : "#2a9d8f"); g.fillStyle = f ? "#ffcf7a" : "#2b3a3a"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    const zones = {
      dt_atrio: {
        half: "d", name: "Doppio Turno · Atrio del Complesso", short: "L'Atrio del Complesso", sub: "Bianco, verde acqua, sorrisi", bg: "dt_atrio",
        w: 30, h: 20, start: [14, 3], itemCos: "dt_acqua", items: [[1, 18], [28, 18], [20, 4], [6, 14]],
        areas: [[1, 1, 8, 4, "Gli armadietti"], [11, 1, 18, 5, "L'ascensore"], [1, 5, 28, 18, "L'Atrio del Complesso"]],
        act: { n: "Leggi il manifesto", p: "Guarda la pianta", F: "Guarda la fontanella", x: "Guarda gli armadietti", Z: "Guarda la colonna", b: "Siediti", ">": "Al Reparto Morale", "<": "Al Campo Bianco" },
        flavor: {
          n: ["Manifesto: «SORRIDI. SEI DENTRO.» Sotto, piccolo: «Il sorriso è parte del contratto (art. 14)».", "Manifesto: «IL FUORI È UN POSTO. IL DENTRO È UNA FAMIGLIA.»"],
          p: "Una pianta perfettamente potata. Sul vaso un cartellino: «Pianta n. 3 di 3. Innaffiata alle 9:00. Felice».",
          F: "La fontanella fa uno zampillo alto esattamente venti centimetri. Ogni volta. Hai controllato due volte.",
          x: "Armadietti grigi, numerati. Il 7 è il tuo. Gli altri hanno lucchetti nuovi e nessun nome.",
          Z: "Una colonna bianca, liscia. Ci appoggi l'orecchio: dentro ronza, come se fosse piena di neon.",
          b: ["Ti siedi su una panchina bianca. È tiepida, come se qualcuno si fosse alzato un secondo fa. Non c'è nessuno.", "La panchina ha un'etichetta: «Seduta n. 4. Durata consigliata: 3 minuti»."],
        },
        intro: [["voce", "Ding. Le porte dell'ascensore si aprono su un atrio bianco, luminoso, silenzioso. Il pavimento è così pulito che ci vedi la tua faccia. È una faccia nuova. O almeno così sembra."], ["voce", "Non ricordi come sei arrivato. Non ricordi ieri. Ricordi solo il tuo nome, {n}, il tuo numero, {num}, e come si calcia un pallone. Tutto il resto è bianco, come il pavimento."]],
        npcs: (s) => (s <= 4 ? [{ id: "dt_valtorre", at: [14, 8] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 19, 29, 19, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a");
          lay(13, 2, 16, 17, ":"); put(14, 1, "e"); put(15, 1, "e");
          [2, 3, 5, 6].forEach((x) => put(x, 2, "x")); put(4, 2, "K");
          put(8, 0, "n"); put(21, 0, "n"); [[2, 17], [27, 17], [27, 2], [11, 17], [18, 17]].forEach(([x, y]) => put(x, y, "p")); put(22, 10, "F");
          [[8, 6], [21, 6], [8, 13], [21, 13]].forEach(([x, y]) => put(x, y, "Z")); [[4, 11], [5, 11], [24, 11], [25, 11]].forEach(([x, y]) => put(x, y, "b")); lay(10, 16, 19, 16, '"');
          put(29, 9, ">"); put(29, 10, ">"); put(0, 9, "<"); put(0, 10, "<");
        },
        decor(g, cx, cy, d) { plaque(g, "REPARTO MORALE →", d.X(27), d.Y(8)); plaque(g, "← CAMPO BIANCO", d.X(3), d.Y(8)); plaque(g, "ARMADIETTO 7", d.X(4) + 8, d.Y(1) + 2); },
      },
      dt_uffici: {
        half: "d", name: "Doppio Turno · Reparto Morale", short: "Il Reparto Morale", sub: "Cubicoli, terminali, moquette verde", bg: "dt_uffici",
        w: 34, h: 22, start: [2, 10], itemCos: "dt_neon", items: [[1, 1], [32, 1], [1, 20], [32, 20]],
        areas: [[1, 1, 32, 3, "La parete delle comunicazioni"], [1, 10, 32, 11, "Il corridoio"], [1, 4, 32, 20, "Il Reparto Morale"]],
        act: { d: "Guarda il terminale", k: "Guarda il divisorio", V: "Prendi un caffè", w: "Bevi un bicchiere d'acqua", x: "Apri lo schedario", Q: "Esamina la porta numero 8", n: "Leggi il manifesto", "<": "Torna all'Atrio" },
        flavor: {
          d: ["Il terminale mostra un foglio di calcolo: «Sorrisi registrati oggi: 1.204. Obiettivo: 1.205». Manchi tu.", "Sul terminale lampeggia: «Ricorda: il Fuori non ti riguarda. Buona giornata!».", "Un terminale spento. Sul vetro, con il dito nella polvere, qualcuno ha scritto: «14»."],
          k: "Un divisorio grigio. Ci sono appese foto di cieli. Tutte dello stesso cielo, dalla stessa angolazione, scattate da una finestra che non esiste.",
          V: ["Il caffè «Conformità»: gusto neutro, temperatura perfetta. Lo bevi. È esattamente come te lo aspettavi.", "La macchina del caffè ti chiede di valutare il servizio da 1 a 5. Ci sono solo i tasti 5."],
          w: "Il distributore fa una bolla. Glu. È l'unico rumore spontaneo del reparto.",
          x: "Uno schedario: «Contratti · Procedura Duale». È chiuso. Sulla maniglia, l'impronta di un pollice sporco di inchiostro verde.",
          Q: "La porta numero 8. Non c'è sulla pianta del piano. Ha una tastiera a codice con quattro cifre. Qualcuno ha consumato di più il tasto 1 e il tasto 4.",
          n: "Manifesto: «LA VOCE HA SEMPRE RAGIONE». Sotto: «(Regola 3)».",
        },
        intro: [["voce", "Il Reparto Morale: file di cubicoli grigi su una moquette verde come un prato senza vento. Ogni terminale ronza la stessa nota. Qualcuno, da qualche parte, ride a comando."]],
        npcs: () => [{ id: "dt_bruno", at: [11, 8] }, { id: "dt_ofelia", at: [25, 17] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 21, 33, 21, "a"); lay(0, 0, 0, 21, "a"); lay(33, 0, 33, 21, "a");
          lay(1, 4, 32, 20, ","); lay(1, 10, 32, 11, ":");
          [3, 13, 23].forEach((x0) => { lay(x0, 5, x0 + 6, 5, "k"); [0, 2, 4, 6].forEach((k) => put(x0 + k, 6, "d")); lay(x0, 15, x0 + 6, 15, "k"); [0, 2, 4, 6].forEach((k) => put(x0 + k, 14, "d")); });
          [2, 3, 4].forEach((x) => put(x, 1, "x")); put(30, 1, "w"); put(31, 1, "V"); put(16, 0, "Q"); put(10, 0, "n"); put(24, 0, "n");
          put(0, 10, "<"); put(0, 11, "<");
        },
        decor(g, cx, cy, d) { plaque(g, "PORTA 8 · RISERVATO", d.X(16) + 8, d.Y(1) + 4); },
      },
      dt_campo: {
        half: "d", name: "Doppio Turno · Il Campo Bianco", short: "Il Campo Bianco", sub: "Lo stadio coperto del Complesso", bg: "dt_campo",
        w: 36, h: 24, start: [33, 11], itemCos: "dt_platino", items: [[1, 22], [34, 22], [1, 5], [34, 5]],
        areas: [[5, 6, 30, 18, "Il Campo Bianco"], [2, 1, 33, 3, "Le tribune"], [1, 19, 34, 22, "La panchina"]],
        act: { j: "Guarda le tribune", g: "Guarda la porta", b: "Siediti in panchina", P: "Guarda il tabellone", ">": "Torna all'Atrio" },
        flavor: {
          j: ["Sulle tribune, sagome di cartone in tuta grigia. Una ha un cartello: «BRAVO!». Sono tutte uguali.", "Una sagoma di cartone è caduta. La rialzi. Ha il tuo numero."],
          g: "Una porta bianchissima. Le reti sono nuove, tese come il sorriso di chi le ha montate.",
          b: "Ti siedi in panchina. Sul legno, inciso con un'unghia: «Non tirare i rigori». Chi l'ha scritto?",
        },
        intro: [["voce", "Il Campo Bianco: uno stadio coperto, senza cielo, con l'erba così verde da sembrare dipinta. Sulle tribune, sagome di cartone. Sul maxischermo, la parola SORRIDI."]],
        npcs: (s) => [{ id: "dt_valtorre", at: [17, 20] }, { id: "dt_bruno", at: [11, 20] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 23, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          lay(2, 1, 33, 3, "j"); lay(5, 6, 30, 18, "-"); [10, 11, 12, 13].forEach((y) => { put(4, y, "g"); put(31, y, "g"); });
          [13, 14, 15].forEach((x) => put(x, 21, "b")); put(24, 4, "P");
          put(35, 11, ">"); put(35, 12, ">");
        },
        decor(g, cx, cy, d) { const x0 = d.X(5), y0 = d.Y(6), w = 26 * 16, h = 13 * 16; g.strokeStyle = "#2a9d8f"; g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, w - 1, h - 1); g.beginPath(); g.moveTo(x0 + w / 2, y0); g.lineTo(x0 + w / 2, y0 + h); g.stroke(); g.beginPath(); g.arc(x0 + w / 2, y0 + h / 2, 22, 0, 7); g.stroke(); },
      },
      dt_porto: {
        half: "f", name: "Doppio Turno · Porto Livido", short: "Porto Livido", sub: "Il porto, la sera, la tua città", bg: "dt_porto",
        w: 40, h: 26, start: [8, 18], itemCos: "dt_marea", items: [[2, 22], [37, 22], [20, 10], [35, 14]],
        areas: [[24, 12, 33, 19, "Il Bar Marea"], [3, 11, 12, 18, "L'ingresso del personale"], [13, 19, 23, 24, "Il recinto dello stadio"], [0, 7, 39, 9, "La banchina"], [1, 10, 38, 24, "Porto Livido"]],
        act: { ">": "Verso il luna park", u: "Siediti al tavolino", l: "Guarda le lucine", i: "Guarda le reti", c: "Guarda la barca", f: "Guarda il recinto", n: "Leggi il cartello", q: "Entra nel Bar Marea", x: "Guarda le casse", Q: "Guarda il cancello dello stadio" },
        flavor: {
          u: ["Un tavolino del Bar Marea. Sotto il bicchiere, un sottobicchiere disegnato a pennarello verde: un campo da calcio e un 14.", "Ti siedi. Il mare fa il suo rumore. Per un attimo ti sembra di essere già stato seduto qui mille volte."],
          l: "Lucine colorate sui fili. Una è fulminata da sempre. Nessuno la cambia: dicono che porta fortuna al porto.",
          i: "Reti da pesca stese ad asciugare. Dentro, impigliato, un vecchio pallone con la scritta «P.L.F.C.».",
          c: ["Una barca da pesca, «La Testarda». Il pescatore ti saluta: «Capitano!». Poi si corregge: «Cioè… buonasera».", "Una barchetta dipinta d'azzurro. Sulla poppa: «Per il 14, che tirava le punizioni come Dio comanda»."],
          f: "Un recinto alto, nuovo, bianco e verde acqua. Oltre il recinto, il vecchio Stadio del Porto, buio. Sul recinto, un graffito verde: una mappa?",
          n: "Cartello: «STADIO DEL PORTO · PROPRIETÀ VALTORRE · VIETATO L'INGRESSO». Sotto, a pennarello verde: «per ora».",
          q: "La porta del Bar Marea: di legno, gonfia d'umido, con la campanella. Dentro, profumo di caffè bruciato e di mare.",
          x: "Casse di pesce vuote. Su una c'è scritto a gesso: «Porto Livido FC – Coppa della Costa – 3 anni fa». E poi una riga che cancella tutto.",
          Q: "Il cancello del vecchio stadio. Un lucchetto nuovo, con il logo del Valtorre. Il lucchetto vecchio, arrugginito, è appeso accanto, come un trofeo.",
        },
        intro: [["voce", "Ti svegli seduto su una panchina della banchina, al tramonto. Hai una borsa sportiva che sa di disinfettante e un tesserino bianco in tasca: «Valtorre FC · Procedura Duale · {num}»."], ["voce", "Non ricordi cosa hai fatto oggi. Ricordi la città, però: Porto Livido. Il mare, le lucine, il bar all'angolo. È casa tua. Lo senti nelle gambe."]],
        npcs: (s) => [{ id: "dt_nina", at: [30, 19] }, { id: "dt_pio", at: [3, 18] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 6, "w"); lay(0, 7, 39, 9, ":"); lay(0, 7, 0, 25, "a"); lay(39, 7, 39, 25, "a"); lay(0, 25, 39, 25, "a");
          [[5, 4], [6, 4], [20, 3], [21, 3], [33, 5], [34, 5]].forEach(([x, y]) => put(x, y, "c"));
          house(24, 12, 10, 5, { roof: "#3a2a2e", wall: "#7a3b2e", door: [28, 16, "q"], lights: true }); [[25, 18], [28, 18], [32, 18]].forEach(([x, y]) => put(x, y, "u"));
          house(4, 12, 8, 5, { roof: "#c9d6d3", wall: "#eef2f1", door: [7, 16, "e"] }); put(11, 17, "K");
          lay(13, 20, 23, 20, "f"); put(16, 19, "n"); put(18, 21, "Q"); lay(13, 21, 17, 24, ","); lay(19, 21, 23, 24, ",");
          [[3, 10], [13, 10], [23, 10], [35, 10]].forEach(([x, y]) => put(x, y, "l")); put(39, 10, ">"); put(39, 11, ">"); put(15, 8, "i"); put(16, 8, "i"); put(37, 12, "x"); put(38, 12, "x");
        },
        decor(g, cx, cy, d) { plaque(g, "BAR MAREA", d.X(29), d.Y(12) - 2, true); plaque(g, "INGRESSO DEL PERSONALE", d.X(8), d.Y(12) - 2, true); plaque(g, "STADIO DEL PORTO ↓", d.X(18) + 8, d.Y(22) + 4, true); },
      },
    };

    // ---------------------------------------------------------------- dialoghi
    function valtorre() {
      const s = S(), z = X.api.trZone();
      if (z === "dt_atrio") {
        if (s === 0) return say([
          ["dt_valtorre", "Buongiorno, {n}. Benvenuto al Valtorre Football Club. Benvenuto Dentro."],
          ["dt_valtorre", "Sono la dottoressa Irma Valtorre. So che adesso ti senti… leggero. È normale. È la Procedura Duale: quando sei qui, non porti con te niente di fuori. Niente pensieri, niente pesi, niente ieri. Solo il calcio."],
          ["hero", "E fuori? Cosa succede, fuori?"],
          ["dt_valtorre", "Fuori hai una vita. Una vita che non ti riguarda, finché sei qui. Ogni sera l'ascensore ti riporta giù, e là sarai un'altra persona. Che non saprà niente di qui. È scritto nel contratto. L'hai firmato tu."],
          ["dt_valtorre", "Nel tuo armadietto, il numero 7, troverai quello che ti serve. Poi vai al Reparto Morale, a est: Bruno ti mostrerà come funziona la felicità qui dentro."],
        ], () => { setStep(N, 1); X.plant("n_benvenuto"); done(); });
        return say([["dt_valtorre", X.pick(["Sorridi, {n}. Non perché devi. Perché qui puoi.", "L'armadietto 7 è il tuo. Gli altri non si aprono. Gli altri non esistono.", "La Presentazione è al Campo Bianco, a ovest. Ti aspettiamo tutti. Anche le sagome."])]]);
      }
      if (s < 4) return say([["dt_valtorre", "Non ancora, {n}. Prima il Reparto Morale. Ogni cosa ha il suo turno."]]);
      if (s === 4) return say([
        ["dt_valtorre", "Eccoti. La Presentazione: una partitella contro il Reparto Contabilità. Niente di serio. Ma qui dentro anche le cose non serie si fanno seriamente."],
        ["dt_valtorre", "Indossa questa. È una cuffia. Durante la partita sentirai una Voce: ti darà qualche consiglio. Seguirla è facoltativo."],
        ["dt_valtorre", "…Naturalmente, seguirla è anche consigliato."],
      ], () => ask("dt_valtorre", "«Pronto per la tua prima partita Dentro?»", [
        { label: "🎧 Indossa la cuffia e gioca", sub: "La Partita in Cuffia · Valtorre FC contro il Reparto Contabilità", cls: "hot", fn: playCuffia },
        { label: "Un momento", sub: "Torna a esplorare", fn: done },
      ]));
      if (s >= 5) return say([["dt_valtorre", X.mem().conf >= 55 ? "Ottimo lavoro, {n}. Hai ascoltato. Ci piace chi ascolta. Ora l'ascensore: il turno è finito." : "Interessante partita, {n}. Hai un modo tutto tuo di… interpretare i consigli. Ne riparleremo. Ora l'ascensore: il turno è finito."]]);
    }
    function bruno() {
      const s = S(), z = X.api.trZone();
      if (z === "dt_campo") return say([["dt_bruno", s >= 5 ? "Che partita! Ho contato i sorrisi in tribuna: zero, perché erano di cartone. Ma li ho contati con affetto." : "Io gioco mediano. Il mio lavoro è stare in mezzo. In mezzo si sta benissimo: non ti tocca mai scegliere."]]);
      if (s < 2) return say([["dt_bruno", "Ciao! Sei nuovo? Siamo tutti nuovi, qui, ogni mattina! Prima passa dall'armadietto, poi torna. Ti preparo un sorriso."]]);
      if (s === 2) return say([
        ["dt_bruno", "Eccolo! Il {num}! Bruno Tessari, mediano e responsabile del Reparto Morale. Ti ho preparato un sorriso. Prego, è tuo."],
        ["dt_bruno", "Qui dentro è facile. Ci sono solo tre regole. Uno: si sorride. Due: non si chiede del Fuori. Tre: la Voce ha sempre ragione."],
        ["hero", "Che Voce?"],
        ["dt_bruno", "Lo scoprirai. Io la adoro. È come avere un amico che sa sempre cosa fare."],
        ["dt_bruno", "Ah, Ofelia ti cercava. È in fondo al reparto, a destra. Lei… conta le cose. Non dirle che te l'ho detto io: conta anche quello."],
      ], () => { learnFact("d_regole"); setStep(N, 3); done(); });
      return say([["dt_bruno", X.pick(["Sorrisi oggi: 1.204. Ne manca uno. Mi aiuti? …Grazie! 1.205!", "Non chiedermi del Fuori. Non perché non posso rispondere. Perché non so niente. È bellissimo.", "La porta numero 8? Quale porta numero 8? Le porte sono sette. Le ho contate. Cioè, Ofelia le ha contate. Io mi fido."])]]);
    }
    function ofelia() {
      const s = S();
      if (s < 3) return say([["dt_ofelia", "Mm. Sei nuovo. Fra un po' ci parliamo. Prima finisci il giro con Bruno: altrimenti si offende, e quando si offende sorride di più."]]);
      if (s === 3) return say([
        ["dt_ofelia", "Ofelia Sanz, analista. Siediti. No, non lì: quella sedia è troppo pulita. Qui."],
        ["dt_ofelia", "Ti dico tre cose, e poi fai finta che non te le abbia dette. Uno: nella pianta del reparto le porte sono sette. Nel corridoio ce ne sono otto. L'ottava, in alto, ha un codice."],
        ["dt_ofelia", "Due: l'armadietto 7 è l'unica cosa che passa tra il Dentro e il Fuori. I biglietti. Il Fuori scrive con un pennarello verde: è l'unico che ha. Noi qui abbiamo solo penne blu aziendali."],
        ["dt_ofelia", "Tre, la più importante: se un biglietto dice qualcosa che chi lo firma non può sapere, non l'ha scritto lui. E controlla sempre la firma. Il numero. Il tuo numero."],
        ["dt_ofelia", "Stasera c'è la Presentazione, al Campo Bianco, a ovest dell'atrio. Ti daranno una cuffia. Ascoltala. E poi chiediti chi ti sta parlando."],
      ], () => { learnFact("d_porte"); setStep(N, 4); note("Ofelia: il Fuori scrive in verde, il Dentro in blu. Se un biglietto dice cose che chi lo firma non può sapere, è falso. E la firma deve essere il mio numero."); done(); });
      return say([["dt_ofelia", X.pick(["Hai notato? La fontanella dell'atrio fa sempre lo stesso zampillo. Niente, qui, è casuale.", "Se scrivi al Fuori, scrivigli le cose che solo tu sai. Così capirà che sei tu.", "La porta 8. Quattro cifre. Il tasto 1 e il tasto 4 sono consumati. Pensaci, quando sarai fuori. Io non posso."])]]);
    }
    function playCuffia() {
      const LS = window.__dtCuffia, h = X.hero() || {}, C = X.api.CAST, b = C.dt_bruno || {};
      if (!LS || !LS.start) return say([["voce", "La Partita in Cuffia non si è caricata. Ricarica la pagina e riprova."]]);
      X.api.scene("dt_campo", "voce", "La Partita in Cuffia è cominciata.", [{ label: "◂ Torna a camminare", fn: done }], "La Partita in Cuffia");
      X.setInMatch(true);
      LS.start({
        title: "La Presentazione · Valtorre FC contro il Reparto Contabilità", voice: "LA VOCE", us: "Valtorre FC",
        hero: { name: h.name || "Campione", skin: h.skin, hair: h.hair, shirt: "#2a9d8f" }, mate: { name: "Bruno", skin: b.skin, hair: b.hair, shirt: "#2a9d8f" },
        opp: { name: "Reparto Contabilità", kit: "#e07a3a" }, script: ["passa", "sinistra", "non_tirare", "tira", "fermo", "cadi", "destra"],
        halftime: "Nella cuffia, un respiro lento. Poi la Voce: «Stai andando bene. Continua ad ascoltarmi». È una voce calma. Ha un accento di porto.",
        onDone: (r) => {
          X.setInMatch(false);
          const m = X.mem(); if (r.win) m.wins++; else m.losses++; X.save();
          conf((r.obey - r.dis) * 4); F.set("c1_obey", r.obey); F.set("c1_dis", r.dis); learnFact("d_voce", "d", true); setStep(N, 5);
          if (r.win) X.reward("dt_c1_match", { coins: 25 });
          say([
            ["voce", `Fischio finale: ${r.a} a ${r.b}. Gli ordini della Voce: ${r.obey} obbediti, ${r.dis} ignorati.`],
            ["voce", "Ti togli la cuffia. Nelle orecchie ti resta un'eco: quella voce aveva un accento di mare. Di porto. Come se venisse da un posto che non ricordi."],
            ["dt_valtorre", r.obey >= r.dis ? "Bravo. Hai ascoltato. Fine turno, {n}: l'ascensore è nell'atrio. A domani." : "Hai giocato… a modo tuo. La Voce prende nota di tutto, lo sai. Fine turno, {n}: l'ascensore è nell'atrio."],
            ["dt_ofelia", "(sottovoce) Prima di scendere, lascia un biglietto al Fuori. Raccontagli della Voce. Lui non sa niente."],
          ]);
        },
      });
    }
    function nina() {
      const s = S();
      if (s < 6) return say([["dt_nina", "Ehi. Il bar è aperto, ma tu hai la faccia di chi deve ancora finire una cosa."]]);
      if (s === 6 && !F.is("c1_nina")) return say([
        ["voce", "Al bancone del Bar Marea una ragazza con i capelli rossi raccolti e un pennarello verde dietro l'orecchio smette di asciugare un bicchiere. Ti guarda come si guarda una barca tornata dopo una tempesta."],
        ["dt_nina", "Allora è vero. Sei tornato. E hai di nuovo quella faccia: la faccia di chi non si ricorda dove ha passato la giornata."],
        ["hero", "Ci conosciamo?"],
        ["dt_nina", "Ci conosciamo da quando avevamo i calzettoni bucati, {n}. Io ero la capitana del Porto Livido FC. Tu il nostro 14. Le punizioni, le tiravi tu."],
        ["dt_nina", "Poi il club è fallito. Il Valtorre si è comprato lo stadio e l'ha chiuso con quel recinto bianco, laggiù. E tu un giorno hai firmato con loro. Non mi hai mai detto perché."],
        ["dt_nina", "Tieni. Il pennarello verde. Era tuo, ce l'hai lasciato tu. Se là dentro c'è un altro te, scrivigli. Qualcuno deve dirgli chi eri."],
        ["dt_nina", "L'armadietto è all'ingresso del personale, quello bianco, a sinistra. Ogni sera ci lasci qualcosa. Ogni mattina sparisce."],
      ], () => { F.set("c1_nina", true); learnFact("f_nina"); learnFact("f_quattordici"); learnFact("f_stadio"); done(); });
      if (s === 6) return say([["dt_nina", "L'armadietto, {n}. All'ingresso del personale. Vai a vedere cosa ti ha lasciato l'altro te."]]);
      if (s === 7) {
        const un = F.is("c1_smascherato");
        return say([
          un ? ["dt_nina", "Un biglietto falso? Scritto con la loro penna blu, e firmato col tuo numero? …Qualcuno là dentro sa tutto di tutte e due le tue metà. E ti vuole lontano dallo stadio."] : ["dt_nina", "Ti ha scritto di stare lontano dallo stadio? Il te di dentro? …Mah. Il te che conoscevo io allo stadio ci dormiva, la notte prima delle partite."],
          ["dt_nina", "Senti. Domani mattina torni dentro. Io non posso seguirti. Ma qui al porto c'è uno che sa entrare dove non si entra. Lo chiamano il Cartografo. Disegna mappe di posti chiusi."],
          ["voce", "Fuori, sul recinto bianco dello stadio, qualcuno ha appena finito di scrivere con la vernice verde, a lettere enormi: «IL 14 NON È MORTO»."],
          ["dt_pio", "(dall'ingresso del personale) {num}! Domani turno alle otto! Puntuale, eh!"],
        ], () => {
          finishChapter(N, un ? "smascherato" : "creduto");
          const msg = reward("dt_c1_done", { coins: 40, cos: "dt_c1" });
          note("Fine del primo turno. Nina dice che ero il 14 del Porto Livido FC.");
          say([["voce", "Fine del Capitolo 1 · «Primo Turno». " + (msg.length ? msg.join(" · ") : "")], ["voce", "Il prossimo turno comincia dal menu di Doppio Turno."]]);
        });
      }
      return say([["dt_nina", X.pick(["Il caffè è bruciato. Come sempre. Ti piaceva così.", "Il 14 tirava le punizioni a giro sul primo palo. Tutti lo sapevano. Nessuno la prendeva.", "Lo stadio non è morto. È solo chiuso. È diverso."])]]);
    }
    function pio() { say([["dt_pio", X.pick(S() >= 7 ? ["Domani alle otto, {num}. Sorriso già pronto, eh!", "Io sto qui, sulla soglia. Metà dentro, metà fuori. È il lavoro più tranquillo del mondo: non devo mai scegliere."] : ["Buonasera, {num}! Turno finito? L'ascensore per domani riapre alle otto. L'armadietto è lì, sempre aperto per te.", "Non chiedermi cosa fai lì dentro. Io vedo solo chi entra e chi esce. Esci sempre più stanco di come entri. E più pulito."])]]); }

    // ---------------------------------------------------------------- oggetti
    const obj = {
      "dt_atrio:K": () => { if (S() === 0) return say([["voce", "L'armadietto 7 è chiuso. Prima, forse, qualcuno deve darti il benvenuto."]]); if (S() === 1 && !X.mem().notes.n_benvenuto) X.plant("n_benvenuto"); X.locker(done); },
      "dt_atrio:e": () => {
        if (S() < 5) return say([["voce", "L'ascensore non scende prima della fine del turno. Sul pannello c'è un solo pulsante, con scritto: «DOPO»."]]);
        if (X.mem().done[N]) return say([["voce", "Il turno di oggi è finito. Il prossimo comincia dal menu: «Continua il turno»."]]);
        say([["voce", "Entri nell'ascensore. Le porte si chiudono. Il pannello dice: «FINE TURNO — PROCEDURA DUALE IN CORSO». Senti un formicolio dietro gli occhi, come quando ti addormenti in treno…"]], () => { if (S() === 5) setStep(N, 6); go("dt_porto", 8, 18); });
      },
      "dt_atrio:>": () => (S() >= 2 ? go("dt_uffici", 2, 10) : say([["dt_valtorre", "Prima l'armadietto, {n}. Ogni cosa ha il suo turno."]])),
      "dt_atrio:<": () => (S() >= 4 ? go("dt_campo", 33, 11) : say([["voce", "La porta del Campo Bianco è chiusa. Un cartello: «Presentazione in preparazione. Sorridere in attesa»."]])),
      "dt_uffici:<": () => go("dt_atrio", 28, 9),
      "dt_campo:>": () => go("dt_atrio", 1, 9),
      "dt_campo:P": () => say([["voce", `Il tabellone: «VALTORRE FC — ${X.mem().done[N] || S() >= 5 ? "presentazione conclusa" : "in attesa"}». Sotto, piccolo: «Conformità della squadra: ${X.mem().conf}%».`]]),
      "dt_porto:K": () => { if (S() < 6) return say([["voce", "L'armadietto 7, dal lato di fuori. È chiuso a chiave."]]); if (S() >= 6) X.plant("n_stadio"); X.locker(() => { if (S() === 6 && X.mem().notes.n_stadio && X.mem().notes.n_stadio.st !== "new") setStep(N, 7); done(); }); },
      "dt_porto:>": () => say([["voce", "Il vicolo che porta al vecchio luna park. Stasera è buio pesto, e Nina ti chiama dal bar. Un'altra sera."]]),
      "dt_porto:e": () => say([["dt_pio", S() >= 6 ? "Turno finito, {num}. Si rientra domani alle otto. Le regole sono regole. Le ho scritte io, cioè: me le hanno scritte." : "Da qui si entra nel Complesso. Ma ci sei appena uscito."]]),
    };
    function news(id, s) {
      const z = X.api.trZone();
      if (id === "dt_valtorre") return (z === "dt_atrio" && s === 0) || (z === "dt_campo" && s === 4);
      if (id === "dt_bruno") return z === "dt_uffici" && s === 2;
      if (id === "dt_ofelia") return s === 3;
      if (id === "dt_nina") return s === 6 || s === 7;
      return false;
    }
    return {
      n: N, title: "Primo Turno", sub: "Il Dentro, il Fuori, il primo biglietto", start: "dt_atrio",
      goal, zones, obj, news,
      talk: { dt_valtorre: valtorre, dt_bruno: bruno, dt_ofelia: ofelia, dt_nina: nina, dt_pio: pio },
      intro: () => [
        ["voce", "Un ufficio bianco. Una penna blu. Un contratto lungo dodici pagine, e in fondo una riga sola in grassetto: «PROCEDURA DUALE».", "dt_atrio"],
        ["dt_valtorre", "Firmi qui, {n}. Da domani giocherai per il club più ricco della costa. E non dovrai più portarti dietro niente. Promesso.", "dt_atrio"],
        ["voce", "Firmi. La penna è fredda. Poi un ronzio, un formicolio dietro gli occhi, e il bianco.", "dt_atrio"],
      ],
    };
  }
  boot();
})();
