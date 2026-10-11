// js/libro-finali-c2.js - IL LIBRO CHE MANGIAVA I FINALI · Capitolo 2 «La Regina che non perdeva mai» (xilografia)
// Della fiaba della Regina di Picche è rimasta una riga sola: «E nessuno la batté mai». Se perde, la riga diventa falsa
// e la Regina potrebbe sbiadire. Il Fante di Cuori vuole proteggerla; il Narratore vuole il Gommapane, il presunto colpevole.
// Parole: APERTO (indovinello del Jolly), MURO (labirinto), DRITTO (dal Gommapane). Lettera dell'Autrice n. 2 oltre la diga.
// Partita: a turni, forzata (partita tattica, contro la portiera imbattuta).
(function () {
  "use strict";
  function boot() {
    const LF = window.__libroFinali;
    if (!LF || !LF.addChapter || !LF._has || !LF._has(1)) return setTimeout(boot, 120);
    LF.addChapter(chapter2);
  }
  function chapter2(X) {
    const { T, F, say, ask, narr, margin, done, go, note, setStep, reward, learn, knows, cheat, finishChapter } = X;
    const N = 2, S = () => X.stepOf(N);
    const mateId = () => (F.get("fin1") === "riscritto" ? "lb_lupo" : "lb_mattone");
    const mateName = () => (F.get("fin1") === "riscritto" ? "Lupo" : "Mattone");

    // ---------------------------------------------------------------- personaggi
    X.cast("lb_regina", { name: "Regina di Picche", tag: "", hair: "#1d1a17", style: "bun", skin: "#e8c4a0", eye: "#a8231f", bg: ["#1d1a17", "#a8231f"], shirt: "#1d1a17" },
      "La portiera imbattuta del Torneo delle Fiabe. Della sua fiaba è rimasta una riga sola: «E nessuno la batté mai». Parla poco, para tutto, e da trentanove anni si chiede cosa si prova a perdere.");
    X.cast("lb_fante", { name: "Fante di Cuori", tag: "", hair: "#a8231f", style: "slick", skin: "#d9a679", eye: "#1d1a17", bg: ["#a8231f", "#efe5cf"], shirt: "#a8231f" },
      "Difensore e cavaliere della Regina. Leale fino all'ostinazione. Ha paura di una cosa sola: che lei perda, e che con la sua unica riga sparisca anche lei.");
    X.cast("lb_jolly", { name: "Il Jolly", tag: "", hair: "#a8231f", style: "spiky", skin: "#f2d0b0", eye: "#1d1a17", bg: ["#a8231f", "#1d1a17"], shirt: "#a8231f" },
      "Il buffone di corte e telecronista del Torneo. Può essere qualsiasi carta, e per questo non è mai la carta giusta. Parla per indovinelli: dice che le risposte dirette fanno male ai denti.");
    X.cast("lb_gommapane", { name: "Gommapane", tag: "", hair: "#8a8580", style: "bald", skin: "#b8b0a8", eye: "#1d1a17", bg: ["#3a332c", "#b8b0a8"], shirt: "#9a928a" },
      "Una creaturina grigia, morbida e tonda. Mangia i refusi: le lettere sbagliate, le parole storte, gli errori di stampa. Il Narratore dice che mangia i finali. Lui dice «no». Lo dice piano.");
    X.cast("lb_due", { name: "Due di Picche", tag: "", hair: "#1d1a17", style: "buzz", skin: "#e0b48a", eye: "#1d1a17", cap: "#1d1a17", bg: ["#efe5cf", "#1d1a17"], shirt: "#efe5cf" },
      "Soldato di guardia all'Arena. È la carta più bassa del mazzo e lo sa. Compensa con il regolamento, che conosce a memoria.");
    X.cast("lb_sette", { name: "Sette di Cuori", tag: "", hair: "#5a3a22", style: "messy", skin: "#c68642", eye: "#1d1a17", bg: ["#efe5cf", "#a8231f"], shirt: "#efe5cf" },
      "Giardiniere di corte. Ridipinge le rose di nero, perché il libro è inciso e il rosso «costa». Lo fa da trentanove anni. Le rose non sono contente.");
    X.cos("lb_c2", { kind: "shirt", label: "Maglia Xilografia", val: "#1d1a17", from: "Completa il Capitolo 2 del Libro che Mangiava i Finali" });
    X.cos("lb_rosso", { kind: "hairc", label: "Capelli Rosso Cuori", val: "#a8231f", from: "Raccogli tutte le gocce d'inchiostro alla Corte delle Carte" });
    X.cos("lb_inciso", { kind: "shirt", label: "Maglia Incisa", val: "#efe5cf", from: "Raccogli tutte le gocce d'inchiostro nel Labirinto di Siepi" });
    X.cos("lb_jolly_c", { kind: "shirt", label: "Maglia del Jolly", val: "#a8231f", from: "Raccogli tutte le gocce d'inchiostro all'Arena del Torneo" });

    const goal = (s) => ({
      0: "Parla con Virgola, in fondo al viale della Corte.",
      1: "Parla con il Due di Picche, di guardia all'uscita est (verso l'Arena).",
      2: "Trova il Jolly nel giardino delle rose, a ovest: conosce le parole della Corte.",
      3: "Scrivi APERTO sulla porta chiusa della Sala del Trono (in fondo al tappeto rosso, a nord).",
      4: "Parla con il Fante di Cuori nella Sala del Trono.",
      5: "Trova il Gommapane nel Labirinto di Siepi (uscita ovest della Corte), al centro del labirinto.",
      6: "Torna dal Fante di Cuori nella Sala del Trono.",
      7: "Vai all'Arena del Torneo (uscita est) e parla con la Regina di Picche.",
      8: "Decidi l'ultima riga della fiaba della Regina.",
    }[s] || "Capitolo concluso. Parla con Virgola per voltare pagina.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 8; R(g, x - w / 2, y - 7, w, 10, "#efe5cf"); g.strokeStyle = "#1d1a17"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 6.5, w - 1, 9); g.fillStyle = "#1d1a17"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    function flyingCards(g, fr, n) { for (let i = 0; i < n; i++) { const x = (i * 67 + fr * 0.3) % 340 - 10, y = (i * 41 + Math.sin(fr / 40 + i) * 20 + 200) % 200, rot = fr / 40 + i; g.save(); g.translate(x, y); g.rotate(rot); R(g, -3, -4, 6, 8, "#f8f2e2"); g.strokeStyle = "#1d1a17"; g.strokeRect(-3, -4, 6, 8); R(g, -1, -1, 2, 2, i % 2 ? "#a8231f" : "#1d1a17"); g.restore(); } }

    // ---------------------------------------------------------------- luoghi
    const zones = {
      lb_corte: {
        name: "Il Libro · Corte delle Carte", short: "La Corte delle Carte", sub: "Un castello di carte da gioco, inciso nel legno", style: "xil", bg: "lb_corte",
        w: 36, h: 26, start: [18, 22], itemCos: "lb_rosso", items: [[2, 8], [33, 8], [9, 20], [30, 22]],
        writes: [{ id: "corte_aperto", need: "aperto", area: [17, 8, 18, 8], to: '"', prompt: "La porta della Sala del Trono. Al posto della serratura c'è una riga incisa: «CHIUSO». Cosa scrivi sopra?",
          ok: [["voce", "Scrivi APERTO sopra CHIUSO. La parola vecchia si offende, si sbriciola come segatura, e la porta si scosta da sola. Dentro, una sala a scacchi bianchi e neri."]],
          then: () => { if (S() === 3) setStep(N, 4); done(); } }],
        areas: [[12, 2, 23, 7, "La Sala del Trono"], [2, 10, 9, 21, "Il giardino delle rose"], [26, 9, 34, 16, "La porta dell'Arena"], [11, 9, 24, 24, "Il viale del tappeto rosso"]],
        act: { e: "Prendi l'invito", Y: "Guarda il trono", u: "Guarda la fontana", l: "Guarda il lampione", c: "Guarda il muro di carte", h: "Guarda la siepe", "<": "Verso il Labirinto di Siepi", ">": "Verso l'Arena del Torneo" },
        flavor: {
          Y: "Il trono di Picche. Il cuscino è consumato da una parte sola: la Regina si siede sempre di sbieco, come chi deve scattare.",
          u: ["Nella fontana galleggiano carte bagnate. Un asso, un tre, una carta bianca. La carta bianca ti guarda.", "Butti una moneta nella fontana. Torna su: «Non accettiamo monete. Solo carte»."],
          l: "Un lampione inciso. La luce è fatta di righe parallele, e scalda lo stesso.",
          c: ["Un muro di carte da gioco, incastrate una nell'altra. Se ne togli una crolla tutto. Nessuno ci ha mai provato. Tranne il vento, una volta.", "Una carta del muro è al contrario. Qualcuno ha scritto sopra, a matita: «Io non volevo stare qui»."],
          h: "Una siepe tagliata a forma di cuore. Il cuore è un po' storto. Come quelli veri.",
        },
        intro: [["voce", "Volti pagina e il mondo cambia materiale: adesso tutto è inciso nel legno e stampato in nero, con qualche macchia di rosso. Le ombre sono righe. Anche il cielo ha le righe."], ["lb_virgola", "Benvenuto nella fiaba della Regina. Qui le cose sono o bianche o nere. Il rosso si usa poco, perché si nota."]],
        npcs: (s) => {
          const o = [{ id: "lb_virgola", at: [20, 20] }, { id: "lb_due", at: [31, 11] }, { id: "lb_jolly", at: [6, 14] }, { id: "lb_sette", at: [4, 19] }];
          if (s <= 6) o.push({ id: "lb_fante", at: [15, 5] });
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 25, 35, 25, "a"); lay(0, 0, 0, 25, "a"); lay(35, 0, 35, 25, "a");
          lay(1, 1, 34, 24, "+");
          lay(2, 2, 8, 6, "c"); lay(27, 2, 33, 6, "c");
          lay(11, 1, 24, 1, "c"); lay(11, 1, 11, 8, "c"); lay(24, 1, 24, 8, "c"); lay(11, 8, 24, 8, "c");
          lay(12, 2, 23, 7, "+"); lay(17, 3, 18, 7, '"'); put(17, 2, "Y"); put(18, 2, "Y"); put(21, 4, "e"); put(17, 8, "Q"); put(18, 8, "Q");
          lay(2, 10, 9, 21, ";"); lay(2, 9, 10, 9, "h"); lay(10, 9, 10, 21, "h"); put(10, 15, ";"); [[3, 11], [8, 11], [3, 16], [8, 17]].forEach(([x, y]) => put(x, y, "h"));
          lay(17, 9, 18, 23, '"'); put(21, 15, "u");
          [[14, 12], [22, 12], [14, 19], [22, 19]].forEach(([x, y]) => put(x, y, "l"));
          put(0, 12, "<"); put(0, 13, "<"); put(35, 12, ">"); put(35, 13, ">");
        },
        decor(g, cx, cy, d) { plaque(g, "SALA DEL TRONO", d.X(18), d.Y(1) + 2); plaque(g, "ARENA →", d.X(33) + 8, d.Y(11) - 2); plaque(g, "← LABIRINTO", d.X(2), d.Y(11) - 2); },
        top(g, cx, cy, d) { flyingCards(g, d.fr, 6); },
      },

      lb_labirinto: {
        name: "Il Libro · Labirinto di Siepi", short: "Il Labirinto di Siepi", sub: "Siepi incise e un fiume d'inchiostro", style: "xil", bg: "lb_labirinto",
        w: 36, h: 26, start: [33, 12], itemCos: "lb_inciso", items: [[22, 15], [9, 7], [24, 17], [8, 24]],
        words: { "8,14": "muro", "18,14": "dritto" },
        writes: [{ id: "lab_muro", need: "muro", area: [23, 20, 23, 21], to: "k", extra: [[2, 20, 22, 21, ","]], prompt: "Da qui nasce il fiume d'inchiostro: sgorga da una crepa bianca nella pagina e scorre verso ovest. Cosa scrivi nella crepa?",
          ok: [["voce", "Scrivi MURO. Le lettere si impilano come mattoni incisi e tappano la crepa. Il fiume si ferma, si ritira, e sul fondo rimane un sentiero umido di inchiostro."], ["lb_virgola", "Di là, a sud-ovest, c'è un angolo di pagina che non ricordavo. E io le ricordo tutte."]],
          then: () => done() }],
        letter: { at: [6, 23], n: 2, txt: "La voce con cui leggevo era la parte migliore di me. «Signora Ada, faccia la voce del Narratore!», mi chiedevano. E io la facevo: profonda, calma, un po' teatrale. Credo che quella voce sia rimasta qui, tra le pagine, ad aspettarmi. — A." },
        areas: [[15, 9, 21, 14, "La tana del Gommapane"], [2, 22, 9, 24, "L'angolo dimenticato"], [2, 20, 22, 21, "Il fiume d'inchiostro"], [1, 1, 34, 24, "Il Labirinto di Siepi"]],
        act: { K: "Guarda nella tana", Z: "Guarda la statua", n: "Leggi il cartello", h: "Guarda la siepe", ">": "Torna alla Corte" },
        flavor: {
          K: "La tana del Gommapane: un buco tondo, perfettamente tondo. Dentro, briciole grigie e lettere sbagliate masticate: «Rgeina», «fiable», «sempe».",
          Z: ["Una colonna di carta arrotolata. Dentro c'è scritto un regolamento lunghissimo. Nessuno l'ha mai letto fino in fondo, per forza.", "Sulla colonna, inciso: «Qui si perse il Fante, nel 1987. Fu ritrovato, ma non era più lo stesso: era di Cuori»."],
          n: "Cartello: «Labirinto di Siepi. Tenere la destra. Oppure la sinistra. Insomma: tenere qualcosa».",
          h: ["Una siepe incisa. Se la tocchi, lascia sulle dita un po' di nero.", "Dentro la siepe, una rosa dipinta di nero. Sotto, per un attimo, si vede il rosso."],
        },
        intro: [["voce", "Un labirinto di siepi incise, sotto un cielo a righe. Da qualche parte scorre un fiume, ma non fa rumore d'acqua: fa il rumore di una penna che scrive in fretta."]],
        npcs: (s) => {
          const o = [{ id: "lb_virgola", at: [30, 12] }];
          if (F.get("gomma") !== "consegnato") o.push({ id: "lb_gommapane", at: [18, 12] });
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 25, 35, 25, "a"); lay(0, 0, 0, 25, "a"); lay(35, 0, 35, 25, "a");
          lay(1, 1, 34, 24, "h");
          lay(26, 12, 34, 13, ":"); lay(26, 4, 27, 22, ":"); lay(4, 4, 27, 5, ":"); lay(4, 4, 5, 18, ":"); lay(4, 17, 24, 18, ":");
          lay(15, 9, 21, 14, "+"); lay(11, 6, 12, 12, ":"); lay(13, 11, 14, 12, ":"); put(18, 9, "K"); put(15, 9, "Z"); put(21, 9, "Z");
          lay(8, 6, 9, 14, ":"); lay(22, 6, 23, 15, ":");
          lay(4, 19, 5, 19, ":"); lay(2, 20, 22, 21, "w"); lay(2, 22, 9, 24, ";");
          lay(24, 20, 25, 21, ":"); put(23, 20, "_"); put(23, 21, "_");
          put(25, 12, "n");
          put(35, 12, ">"); put(35, 13, ">");
        },
        after(L) { if (F.get("gomma") !== "consegnato" && !knows("dritto")) L.put(18, 14, "+"); },
        decor(g, cx, cy, d) { plaque(g, "LA TANA", d.X(18) + 8, d.Y(9) - 1); },
        top(g, cx, cy, d) { g.fillStyle = "rgba(29,26,23,.12)"; g.fillRect(0, 0, 320, 200); },
      },

      lb_torneo: {
        name: "Il Libro · Arena del Torneo delle Fiabe", short: "L'Arena del Torneo", sub: "Dove la Regina non ha mai perso", style: "xil", bg: "lb_torneo",
        w: 38, h: 26, start: [2, 14], itemCos: "lb_jolly_c", items: [[2, 2], [36, 22], [18, 22], [34, 9]],
        areas: [[3, 1, 34, 3, "Le tribune"], [6, 8, 31, 19, "Il campo del Torneo"], [16, 4, 21, 6, "Il palco reale"], [1, 20, 36, 24, "Il bordo campo"]],
        act: { P: "Guarda il tabellone", Y: "Guarda il palco reale", j: "Guarda le tribune", g: "Guarda la porta", l: "Guarda il lampione", "<": "Torna alla Corte" },
        flavor: {
          Y: "Il palco reale è vuoto: la Regina non guarda le partite. Le gioca.",
          j: ["Sulle tribune, un mazzo intero. Il Re di Fiori dorme. Il Tre di Quadri fa la ola da solo.", "Uno striscione: «REGINA, PARA ANCHE I NOSTRI DUBBI»."],
          g: "La porta della Regina. Sulla traversa ci sono trentanove tacche: una per ogni anno senza gol.",
          l: "Un lampione con il paralume a forma di picche. Fa una luce appuntita.",
        },
        intro: [["voce", "L'Arena del Torneo delle Fiabe. Un campo inciso nel legno, tribune piene di carte che sbattono le figure. Al centro, ferma come una statua, la Regina di Picche."]],
        npcs: (s) => {
          const o = [{ id: "lb_regina", at: [18, 11] }, { id: "lb_jolly", at: [30, 6] }, { id: "lb_virgola", at: [3, 17] }, { id: mateId(), at: [4, 11] }];
          if (s >= 7) o.push({ id: "lb_fante", at: [12, 6] });
          return o.filter((n, i, a) => a.findIndex((m) => m.id === n.id) === i);
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 37, 0, "a"); lay(0, 25, 37, 25, "a"); lay(0, 0, 0, 25, "a"); lay(37, 0, 37, 25, "a");
          lay(1, 1, 36, 24, "+"); lay(3, 1, 34, 3, "j"); put(18, 4, "Y"); put(19, 4, "Y");
          lay(6, 8, 31, 19, "-"); [12, 13, 14, 15].forEach((y) => { put(5, y, "g"); put(32, y, "g"); });
          put(24, 5, "P"); put(2, 6, "l"); put(35, 6, "l");
          put(0, 14, "<"); put(0, 15, "<");
        },
        decor(g, cx, cy, d) {
          const x0 = d.X(6), y0 = d.Y(8), w = 26 * 16, h = 12 * 16;
          g.strokeStyle = "#1d1a17"; g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, w - 1, h - 1); g.beginPath(); g.moveTo(x0 + w / 2, y0); g.lineTo(x0 + w / 2, y0 + h); g.stroke(); g.beginPath(); g.arc(x0 + w / 2, y0 + h / 2, 22, 0, 7); g.stroke();
          plaque(g, "TORNEO DELLE FIABE", d.X(19), d.Y(4) - 2);
        },
        top(g, cx, cy, d) { flyingCards(g, d.fr, 4); },
      },
    };

    // ---------------------------------------------------------------- Virgola
    function virgola() {
      const s = S();
      if (s === 0) {
        return say([
          ["lb_virgola", "Eccoci. La Corte delle Carte. Senti che silenzio? Una volta qui si sentiva il rumore delle carte mescolate, tutto il giorno. Come una pioggia gentile."],
          ["lb_virgola", "La Regina di Picche gioca in porta nel Torneo delle Fiabe. Non ha mai preso un gol. Mai. La sua fiaba è stata mangiata tutta, tranne l'ultima riga: «E nessuno la batté mai»."],
        ], () => narr("La Corte era in festa: tutte le carte ridevano e danzavano, felici di accogliere il campione {n}.", () => say([
          ["lb_virgola", "Il Due di Picche fa la guardia alla porta dell'Arena, a est. Lui sa come si entra nel Torneo. È la carta più bassa del mazzo, ma conosce il regolamento a memoria."],
        ], () => { setStep(N, 1); done(); }), { id: "corte_paura", say: "Nessuno ride: le carte hanno paura.", note: "Il Narratore ha detto che la Corte era in festa. Le carte tremavano.", reply: [["lb_narratore", "…Tremano di gioia. Le carte sono emotive. Proseguiamo."], ["voce", "Un Cinque di Quadri, dietro una colonna, ti fa segno di sì con la testa. Poi si nasconde."]] }));
      }
      if (s >= 9) {
        return ask("lb_virgola", "«Ho fatto le orecchie a questa pagina, così la ritroviamo. Pronto per la prossima?»", [
          { label: "📖 Volta pagina", sub: "Verso il Capitolo 3", cls: "hot", fn: () => { if (X.hasChapter(3) && X.mem().ch >= 3) X.continueStory(); else say([["lb_virgola", "Il capitolo dopo è ancora in tipografia. Si sentono i torchi lavorare. E qualcuno che urla «BOOM!». Strano."]]); } },
          { label: "Due chiacchiere", sub: "Cosa pensa Virgola", fn: () => say([["lb_virgola", X.pick(["Hai visto il morso, dopo la partita? È apparso mentre guardavamo. Dritto. Con la punta. Qualcuno ha scritto al contrario, sulla pagina.", "Il Gommapane mi è sempre stato simpatico. Mangia gli errori. Pensa che bel lavoro: tutti i giorni rendi il mondo un po' più giusto, una lettera alla volta.", "Il Narratore stanotte non ha detto niente. È la prima volta. Mi fa più paura di quando parla."])]]) },
        ]);
      }
      return ask("lb_virgola", "«Una pausa. Così. Poi ripartiamo.»", [
        { label: "Cosa devo fare?", sub: "Un consiglio", fn: () => say([["lb_virgola", T(goal(S()))]]) },
        { label: "Cosa ne pensi del Gommapane?", sub: "Il presunto colpevole", fn: () => say([["lb_virgola", X.mem().marg.includes("gommapane_c1") ? "Nella fiaba dei Porcellini il Narratore ha detto che era fuggito. Ma non c'era. Io, prima di dare la colpa a qualcuno, voglio vederlo in faccia." : "Il Narratore dice che è un mostro. Io l'ho visto una volta sola, tanti anni fa: era piccolo, e masticava una virgola sbagliata. Non sembrava un mostro. Sembrava uno che lavora."]]) },
      ]);
    }

    // ---------------------------------------------------------------- personaggi della Corte
    function due() {
      const s = S();
      if (s === 1) return say([
        ["lb_due", "Alt! Due di Picche, di guardia. Lo so, lo so: sono un due. Ma un due di guardia vale più di un asso che dorme. Articolo quattro del regolamento."],
        ["lb_due", "Per sfidare la Regina serve l'invito sigillato. Lo custodisce il Fante di Cuori, nella Sala del Trono. Ma la porta della Sala è chiusa da una parola: «CHIUSO». E le parole, qui, sono serrature."],
        ["hero", "E come si apre una parola?"],
        ["lb_due", "Con un'altra parola. Il Jolly, nel giardino delle rose, le conosce tutte. Però non te le dice: te le fa indovinare. Articolo zero: il Jolly è insopportabile."],
      ], () => { setStep(N, 2); done(); });
      if (s >= 7) return say([["lb_due", s >= 9 ? "Ho visto la partita dalla feritoia. Articolo uno: non piangere in servizio. L'ho infranto." : "Hai l'invito? Allora passa. Articolo nove: lo sfidante entra a testa alta. Anche se è più basso di me."]]);
      if (s >= 2) return say([["lb_due", X.pick(["Articolo sei: nessuno corre nella Corte. Tranne i Fanti, che hanno fretta di nascita.", "Non posso farti passare senza invito. Mi dispiace. Articolo undici: il dispiacere non cambia le regole.", "Sai qual è la carta più importante del mazzo? Quella che manca. Lo diceva mio nonno, il Due di Fiori."])]]);
      return say([["lb_due", "Prima parla con la signorina Virgola. Articolo tre: i segnalibri hanno la precedenza."]]);
    }
    function jolly() {
      const s = S();
      if (S() === 2 && !knows("aperto")) {
        return say([["lb_jolly", "Uh! Uno sfidante! Una novità! Le novità qui arrivano ogni trentanove anni, come le comete e i saldi."], ["lb_jolly", "Vuoi la parola che apre la Sala? Te la regalo, se indovini. Pronto? Pronto."]], riddle);
      }
      return say([["lb_jolly", X.pick(s >= 9 ? ["Che partita! Ho finito la voce, la telecronaca e un panino al formaggio.", "La Regina ha riso. L'ho sentita io. Non lo dirò a nessuno. Lo dirò a tutti."] : ["Indovinello gratis: cosa ha un collo e niente testa? Una bottiglia. Ti è servito? No. Era gratis.", "Io posso essere qualsiasi carta. Ma qualsiasi carta, a lungo andare, stanca. Oggi sono un tre.", "La Regina para tutto. Una volta ha parato un raffreddore. L'ho visto io."])]]);
    }
    function riddle() {
      ask("lb_jolly", "«Ho una serratura ma nessuna chiave. Una maniglia, ma nessuna mano. Quando smetto di dire NO, divento…»", [
        { label: "«APERTO»", sub: "", fn: () => { F.set("jolly_ok", true); say([["lb_jolly", "Giusto! Giustissimo! Che noia, avevo preparato altri sei indovinelli."], ["voce", "Il Jolly tira fuori dalla manica una parola incisa, come una carta: APERTO."]], () => learn("aperto", () => { if (S() < 3) setStep(N, 3); done(); })); } },
        { label: "«CHIUSO»", sub: "", fn: () => say([["lb_jolly", "No! Quella è la risposta di chi non ha capito l'indovinello. Ma con stile. Riprova."]], riddle) },
        { label: "«UNA PORTA»", sub: "", fn: () => say([["lb_jolly", "Ma no, la porta sono io! Cioè, è la domanda. Cioè… riprova, mi hai confuso."]], riddle) },
      ]);
    }
    function sette() { say([["lb_sette", X.pick(["Dipingo le rose di nero. Il libro è inciso, capisci? Il rosso costa. Ogni tanto ne lascio una rossa, di nascosto. Non dirlo.", "Una volta la Regina si è fermata a guardare una rosa rossa. Ha detto «peccato». Non ho capito se per la rosa o per lei.", "Il Fante di Cuori viene qui tutte le sere a contare le rose rosse. Sono le sue preferite. Gliene lascio sempre una in più."])]]); }

    // ---------------------------------------------------------------- il Fante di Cuori
    function fante() {
      const say = (ls, then) => X.say(ls.map((l) => (l.length > 2 ? l : [l[0], l[1], "lb_trono"])), then);
      const s = S();
      if (s < 4) return say([["lb_fante", "Chi c'è? …Ah. Uno sfidante. Vattene. Per favore. Te lo chiedo per favore, e un Fante non lo chiede mai."]]);
      if (s === 4) return say([
        ["voce", "Nella Sala del Trono, un ragazzo in armatura rossa sta in piedi accanto a un leggio, con una lettera sigillata stretta al petto."],
        ["lb_fante", "L'invito è qui. E qui resta. Ascoltami bene, campione: la Regina ha una sola riga. «E nessuno la batté mai». Tutto il resto della sua fiaba l'hanno mangiato."],
        ["lb_fante", "Se perde, quella riga diventa falsa. E una fiaba con l'unica riga falsa… non è più niente. Lei sbiadirebbe come inchiostro sotto la pioggia. Capisci, adesso?"],
        ["hero", "E lei cosa vuole?"],
        ["lb_fante", "Lei vuole giocare. Vuole perdere, una volta, per sapere com'è. È testarda. È… la Regina."],
      ], () => narr("Il colpevole di tutto è il Gommapane. Si nasconde al centro del Labirinto di Siepi. Catturatelo, consegnatelo a me, e i finali torneranno.", () => say([
        ["lb_fante", "Il Narratore ha ragione. Se prendi il Gommapane, i finali tornano: la Regina riavrà la sua fiaba intera, e potrà perdere senza sparire. Allora, e solo allora, ti darò l'invito."],
        ["lb_virgola", "Il Labirinto è a ovest della Corte. Io… vengo con te. Voglio vederlo in faccia, questo Gommapane."],
      ], () => { setStep(N, 5); note("Il Fante darà l'invito solo se il Gommapane sarà consegnato."); done(); })));
      if (s === 5) return say([["lb_fante", "Il Labirinto è a ovest. Il Gommapane sta al centro. Portalo qui, o portami una ragione."]]);
      if (s === 6) {
        const saved = F.get("gomma") === "salvato";
        return say(saved ? [
          ["hero", "Il Gommapane non mangia i finali. Mangia i refusi. Ha la bocca tonda, e i morsi sulle pagine sono dritti. Non è stato lui."],
          ["lb_fante", "…Allora nessuno può proteggerla. Nessuno, tranne lei."],
          ["voce", "Il Fante guarda a lungo la lettera sigillata. Poi te la porge, con le mani che tremano appena."],
          ["lb_fante", "Gioca. Ma gioca sul serio. Se proprio deve perdere, che perda contro qualcuno che se lo merita."],
        ] : [
          ["lb_fante", "Il Gommapane non c'è più? Bene. Allora i finali torneranno, e lei è salva."],
          ["voce", "Il Fante ti porge la lettera sigillata. Fuori, una carta del muro della Corte cade, senza motivo. Nessuno la raccoglie."],
          ["lb_fante", "Vai all'Arena. E… grazie."],
        ], () => { setStep(N, 7); F.set("invito", true); note("Ho l'invito sigillato per sfidare la Regina di Picche."); done(); });
      }
      if (s === 7 || s === 8) return say([["lb_fante", "Vado in campo con lei. Difendo, come sempre. Non ti farò sconti. Non me li perdonerebbe."]]);
      return say([["lb_fante", F.get("fin2") === "riscritto" ? "L'hai sentita ridere? Io non l'avevo mai sentita. Ha una risata storta, come una rosa dipinta male. È bellissima." : "Resta imbattuta. Ma l'ho vista, dopo la partita: guardava la porta come si guarda una finestra. Forse le basta sapere che è successo."]]);
    }

    // ---------------------------------------------------------------- il Gommapane
    function gommapane() {
      const s = S();
      if (s < 5) return say([["lb_gommapane", "…"], ["voce", "Una creaturina grigia, tonda, morbida come una gomma da cancellare. Ti guarda e si nasconde dietro una siepe. Poi sporge un occhio."]]);
      if (s === 5 && !F.get("gomma")) {
        return say([
          ["voce", "Al centro del labirinto, davanti a una tana perfettamente tonda, una creaturina grigia sta masticando qualcosa con grande concentrazione."],
          ["lb_gommapane", "Mm. Mm-mm. «Rgeina». Sbagliato. Gnam. «Regina». Giusto."],
          ["voce", "Su un cartello lì accanto, una parola storta si raddrizza da sola mentre lui mastica."],
          ["lb_gommapane", "Io… mangio sbagli. Solo sbagli. Le parole storte. Sono buone. Sanno di matita."],
        ], () => narr("Eccolo, il mostro! Il divoratore di finali! Prendilo, {n}, e portalo al Fante. Così finirà ogni male.", () => ask("voce", "Il Gommapane ti guarda. Ha la bocca tonda. Piccola, tonda, senza denti.", [
          { label: "«Vieni con me. Ti porto dal Fante.»", sub: "Lo consegni al Narratore", fn: consegna },
          { label: "«Tu non hai mangiato nessun finale.»", sub: "Lo proteggi", cls: "hot", fn: proteggi },
        ])));
      }
      if (F.get("gomma") === "salvato") return say([["lb_gommapane", X.pick(["Grazie. Gnam. Era un refuso. Scusa. Mangio quando sono emozionato.", "Tu tondo dentro. Si vede.", "Il Narratore… non mi piace. Lui scrive dritto. Troppo dritto."])]]);
      return say([["lb_gommapane", "…"]]);
    }
    function proteggi() {
      F.set("gomma", "salvato");
      say([
        ["hero", "Il morso sui Porcellini era dritto, con la punta. Tu hai la bocca tonda. Non sei stato tu."],
        ["lb_gommapane", "Io… no. Mai finali. I finali sono buoni. Non si mangiano le cose buone."],
        ["voce", "Il Gommapane trotterella nella tana e torna con un pezzo di pagina strappato. Sul bordo, il segno del morso: una riga dritta, perfetta, con un piccolo uncino in fondo. Il segno di un pennino."],
        ["lb_gommapane", "Questo l'ho trovato io. Non è bocca. È penna. Qualcuno scrive… al contrario. Toglie, invece di mettere."],
        ["lb_virgola", "Chi ha una penna, in questo libro? Io ho il pennino che ti ho prestato. E poi… nessun altro. Tranne chi racconta."],
        ["lb_gommapane", "Tieni. Per te. Io la mangio sempre, ma tu ne hai più bisogno."],
      ], () => margin("taglio_dritto", "Il Gommapane ha la bocca tonda. I morsi sulle pagine sono dritti, come di un pennino.", () => learn("dritto", () => {
        narr("Hai lasciato libero il mostro. Male, {n}. Molto male. Il Narratore se lo ricorderà.", () => { setStep(N, 6); note("Ho protetto il Gommapane. I morsi sui finali sono di un pennino, non di una bocca."); done(); });
      })));
    }
    function consegna() {
      F.set("gomma", "consegnato");
      say([
        ["voce", "Allunghi la mano. Il Gommapane non scappa. Si lascia prendere, leggero come una nuvola di polvere di gomma."],
        ["lb_gommapane", "Va bene. Va bene. Io piccolo. Tu grande."],
      ], () => narr("Il Narratore ringrazia. E cancella.", () => say([
        ["voce", "Una riga d'inchiostro scende dall'alto, dritta come una lama, e passa sopra il Gommapane. Dove c'era lui, adesso c'è soltanto un po' di polvere grigia. E una parola caduta per terra: DRITTO."],
        ["lb_virgola", "…"],
        ["lb_virgola", "Era tondo. Hai visto? Era tutto tondo."],
      ], () => { setStep(N, 6); X.setTiles(18, 14, 18, 14, "*"); note("Ho consegnato il Gommapane al Narratore. Lo ha cancellato con una riga dritta."); done(); })));
    }

    // ---------------------------------------------------------------- la Regina e la partita
    function regina() {
      const s = S();
      if (s < 7) return say([["lb_regina", "Non parlo con chi non ha l'invito. Non per superbia. È che non so di cosa parlare, con chi non gioca."]]);
      if (s === 7) {
        return say([
          ["lb_regina", "L'invito. Sigillato dal Fante. Allora ha deciso di lasciarti venire. Strano: è così protettivo che a volte mi para anche i pensieri."],
          ["lb_regina", "Sai cosa vuol dire non perdere mai, {n}? Vuol dire che ogni partita è uguale all'altra. Che ogni tiro è già parato prima di partire. Non ho mai avuto paura in vita mia. Non ho mai avuto niente."],
          ["lb_regina", "Tirami addosso tutto quello che hai. {tiro}. Fammi vedere com'è, dall'altra parte del pallone."],
        ], () => narr("La Regina sorrise, gelida e sicura, certa di vincere come sempre.", () => ask("lb_regina", "«Allora? Il campo è inciso, le tribune sono piene. Si gioca?»", [
          { label: "🎮 Si gioca", sub: "Partita a turni · tattica contro la portiera imbattuta · con " + mateName(), cls: "hot", fn: playRegina },
          { label: "Un momento", sub: "Torna a esplorare", fn: done },
        ]), { id: "regina_trema", say: "Le tremano le mani.", note: "Il Narratore dice che la Regina era sicura. Le tremavano le mani.", reply: [["lb_narratore", "…È il freddo. Fa freddo, nelle fiabe incise. Proseguiamo."], ["lb_regina", "Grazie. Nessuno se n'era mai accorto. Neanche io."]] }));
      }
      if (s === 8) return chooseEnding();
      return say([["lb_regina", F.get("fin2") === "riscritto" ? "Ho perso. Fa malissimo e fa ridere. Non sapevo che le due cose potessero stare insieme. Ora lo so." : "Resterò imbattuta, per chi legge. Ma io saprò. E basta che lo sappia io."]]);
    }
    function playRegina() {
      X.playMatch({
        id: "lb_regina", mate: mateName(), us: "Gli Sfidanti", chap: "Il Libro · {n} contro la Regina di Picche", bg: "lb_torneo",
        intro: `Torneo delle Fiabe, finale unica. {n} e ${mateName()} contro le Carte di Picche. In porta, la Regina: zero gol subiti dal 1450.`,
        venue: { ads: [["TORNEO DELLE FIABE", "#1d1a17"], ["PICCHE SEMPRE", "#a8231f"], ["CARTE DAL 1450", "#3a332c"], ["IL JOLLY VI SALUTA", "#a8231f"]], crowd: ["#1d1a17", "#a8231f", "#efe5cf", "#3a332c", "#cfc3a6"], ground: ["#e6dac0", "#d9ccaf"], line: "#1d1a17cc", grid: "rgba(29,26,23,.06)", tint: "rgba(239,229,207,.10)", glow: "239,229,207" },
        oppNames: ["Regina di Picche", "Fante di Cuori", "Re di Picche", "Dieci di Picche", "Asso di Picche"],
        team: (t, s) => ({ name: "Le Carte di Picche", vs: "le Carte di Picche", color: "#1d1a17", defs: [["Fante di Cuori", t(s.drib * 0.95)], ["Re di Picche", t(s.drib * 0.85)], ["Dieci di Picche", t(s.drib * 0.8)]], atk: [["Asso di Picche", t(s.tiro * 0.9)], ["Dieci di Picche", t(s.tiro * 0.75)]], gk: ["Regina di Picche", t(s.tiro * 1.2)], power: t(s.tiro * 0.85), special: ["Parata Imbattuta", t(s.tiro * 1.1)] }),
        done: (r) => {
          if (r.win) {
            setStep(N, 8); F.set("tab_lb_torneo", `${r.a}:${r.b}`); X.reward("lb_c2_match", { coins: 25 });
            return say([["voce", `Fischio finale: ${r.a} a ${r.b}. Per un lungo istante, nell'Arena, nessuno respira. Le carte sulle tribune restano a metà di una ola.`], ["voce", "La Regina di Picche è seduta sull'erba incisa, il pallone tra le mani. Si guarda le mani. Sono più chiare. Sbiadiscono."], ["lb_fante", "No. No, no, no. La riga… la sua riga è diventata falsa…"]], chooseEnding);
          }
          say([["voce", `Fischio finale: ${r.a} a ${r.b}. La Regina si rialza senza un graffio. Le tribune applaudono, per abitudine.`], ["lb_regina", "Ancora imbattuta. Che noia. Rigiochiamo, quando vuoi: parlami di nuovo."]]);
        },
      });
    }
    function tabellone() {
      const s = S();
      if (s !== 7) return say([["voce", s >= 8 ? `Il tabellone segna ${F.get("tab_lb_torneo", "?:?")}. Sotto, a mano: «subiti dal 1450: 1». Qualcuno ha disegnato un cuoricino.` : "Il tabellone: «Gol subiti dalla Regina: 0, dal 1450»."]]);
      ask("voce", "Il tabellone dice: «Gol subiti dalla Regina: 0». Il pennino ti prude: potresti scrivere VINTO, e sarebbe finita. La Regina sconfitta, senza una partita.", [
        { label: "✒ Scrivi VINTO", sub: "Salti la partita · il libro se lo ricorderà", fn: () => {
          cheat(); X.SFX.scribble(); F.set("tab_lb_torneo", "1:0"); F.set("c2_vinto", true); setStep(N, 8);
          if (!knows("vinto")) { X.mem().words.push("vinto"); X.save(); }
          say([["voce", "Scrivi VINTO. Sul tabellone appare un 1. La Regina guarda il numero, poi guarda te, poi il pallone che non è mai partito."], ["lb_regina", "…Così? Ho perso così? Senza nemmeno un tiro?"], ["voce", "Le sue mani cominciano a sbiadire lo stesso. Una sconfitta scritta pesa come una vera. Ma non lascia niente."]], chooseEnding);
        } },
        { label: "No: si gioca", sub: "La Regina merita una partita vera", cls: "hot", fn: () => say([["voce", "Rimetti il cappuccio al pennino. Sul tabellone, per un attimo, compare la parola «grazie». Poi torna lo zero."]]) },
      ]);
    }
    function chooseEnding() {
      say([
        ["lb_virgola", "Presto! L'ultima riga della sua fiaba è diventata falsa: dobbiamo riscriverla adesso, o lei sparisce. Scegli tu. Ma presto."],
      ], () => ask("voce", "La Regina sbiadisce. Il pennino è nella tua mano. Cosa scrivi?", [
        { label: "«E un giorno perse, e fu felice.»", sub: "Un finale riscritto: la Regina libera", fn: () => ending("riscritto") },
        { label: "«E nessuno la batté mai.»", sub: "Il finale vero: la tua vittoria non verrà raccontata", fn: () => ending("vero") },
      ]));
    }
    function ending(v) {
      F.set("fin2", v); setStep(N, 9);
      const a = v === "riscritto" ? [
        ["voce", "Scrivi la riga nuova. Le lettere si incidono nel legno da sole, profonde, con un rumore di sgorbia. La Regina smette di sbiadire. Anzi: per la prima volta, nel libro inciso, le sue guance diventano rosse."],
        ["lb_regina", "Perso. Ho perso. Ah! È… orribile. È meraviglioso. Fante! Fante, ho perso!"],
        ["lb_fante", "Lo so, Maestà. C'ero."],
        ["voce", "La Regina ride. È una risata storta, inceppata, come una porta che non si apriva da trentanove anni."],
      ] : [
        ["voce", "Riscrivi la riga vecchia, lettera per lettera: «E nessuno la batté mai». Le lettere tornano vere. La Regina smette di sbiadire. Il tabellone, piano, torna a zero."],
        ["lb_regina", "Hai cancellato la tua vittoria. Per me. Nessuno la racconterà mai."],
        ["hero", "Ma tu lo saprai."],
        ["lb_regina", "Sì. Io lo saprò. Ed è la cosa più bella che mi sia mai successa, in una fiaba di una riga sola."],
      ];
      say(a, () => narr("E finalmente, senza più il Gommapane, i finali del libro furono tutti salvi.", () => say([
        ["voce", "Un rumore secco. Come un pennino che graffia la carta. Tutti si voltano."],
        ["voce", "Sul bordo dell'ultima pagina della fiaba, sotto i vostri occhi, appare un morso nuovo. Dritto. Netto. Con l'uncino in fondo. Lo strappo si mangia due righe della riga appena scritta, e si ferma."],
        F.get("gomma") === "salvato" ? ["lb_gommapane", "Visto? Io qui. Io fermo. Non io."] : ["lb_virgola", "Il Gommapane non c'è più. E i morsi continuano."],
        ["lb_virgola", "Qualcuno scrive al contrario, in questo libro. E sta diventando più veloce."],
        ["voce", "La pagina successiva si gira da sola, con un rumore di carta lucida. È tutta a colori, con contorni spessi e nuvolette. Al centro, enorme, una scritta: BOOM!"],
      ], () => {
        finishChapter(N, v);
        const msg = X.reward("lb_c2_done", { coins: 50, cos: "lb_c2" });
        note(v === "riscritto" ? "Ho riscritto l'ultima riga della Regina: un giorno perse, e fu felice." : "Ho lasciato alla Regina la sua riga: nessuno la batté mai. Io lo so.");
        say([["voce", "Fine del Capitolo 2 · «La Regina che non perdeva mai». " + (msg.length ? msg.join(" · ") : "")], ["lb_virgola", "Quando vuoi voltare pagina, vieni da me."]]);
      }), { id: "finali_ancora", say: "I finali sono ancora mangiati.", note: "Il Narratore ha detto che i finali erano salvi. Non lo erano.", reply: [["lb_narratore", "…Lo saranno. Prima o poi. Un narratore anticipa. Proseguiamo."]] }));
    }

    // ---------------------------------------------------------------- oggetti e passaggi
    const obj = {
      "lb_corte:<": () => go("lb_labirinto", 33, 12),
      "lb_corte:>": () => (S() >= 7 ? go("lb_torneo", 2, 14) : say([["lb_due", S() >= 1 ? "Alt! Senza invito non si passa. Articolo uno, due, tre e anche quattro." : "Alt! Prima parla con me. Cioè: sono qui. Parla con me."]])),
      "lb_corte:e": () => say([["voce", S() < 6 ? "L'invito sigillato del Torneo: una busta nera con la ceralacca rossa. Il Fante ci tiene sopra la mano, senza nemmeno guardarla." : "Il leggio è vuoto. L'invito ce l'hai tu."]]),
      "lb_labirinto:>": () => go("lb_corte", 1, 12),
      "lb_torneo:<": () => go("lb_corte", 34, 12),
      "lb_torneo:P": tabellone,
    };
    function onWord(w) {
      if (w === "muro") return say([["lb_virgola", "MURO. Pesante. Ecco perché il fiume d'inchiostro non si ferma da solo: ci vuole qualcosa di solido, alla sorgente. A sud-est del labirinto, vicino al corridoio grande."]]);
      if (w === "dritto") return say([["lb_virgola", "DRITTO. Raddrizza le cose storte. Strano: era rimasta qui per terra, come una piuma."]]);
      done();
    }
    function news(id, s) {
      if (id === "lb_virgola") return s === 0 || s >= 9;
      if (id === "lb_due") return s === 1;
      if (id === "lb_jolly") return s === 2 && !knows("aperto");
      if (id === "lb_fante") return s === 4 || s === 6;
      if (id === "lb_gommapane") return s === 5 && !F.get("gomma");
      if (id === "lb_regina") return s === 7 || s === 8;
      return false;
    }
    return {
      n: N, title: "La Regina che non perdeva mai", sub: "Xilografia · la portiera imbattuta e il Gommapane", start: "lb_corte",
      goal, zones, obj, news, onWord,
      talk: { lb_virgola: virgola, lb_due: due, lb_jolly: jolly, lb_sette: sette, lb_fante: fante, lb_gommapane: gommapane, lb_regina: regina, lb_lupo: () => say([["lb_lupo", "Sono venuto a fare il tifo. Ho portato il tè. In una fiaba incisa, il tè viene a righe, ma è buono lo stesso."]]), lb_mattone: () => say([["lb_mattone", "Ho misurato il campo: è un pelo storto. Non lo dico alla Regina. Si offende anche il campo."]]) },
      intro: () => [
        ["voce", "Il segnalibro tira, la pagina si gira. Per un attimo il mondo è soltanto il fruscio della carta.", "lb_copertina"],
        ["lb_narratore", "Capitolo secondo. Nel quale il nostro campione {n} conobbe la Regina che non perdeva mai, e il mostro che le aveva rubato la storia.", "lb_corte"],
        ["voce", "Tutto, adesso, è inciso nel legno: case, alberi, nuvole. Le ombre sono fatte di righe sottili. Il rosso c'è, ma si nasconde.", "lb_corte"],
      ],
    };
  }
  boot();
})();
