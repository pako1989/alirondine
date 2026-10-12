// js/torneo-c2.js - IL TORNEO DELLE CENTO SCUOLE · Capitolo 2 «La semifinale»
// Il mercato (venditori che girano tra le bancarelle), il campo dell'Accademia sotto il faro (Ettore che si allena da solo).
// Due tecniche nuove: il Muro Umano (dai gemelli) e la Finta dell'Ombra (da Alba, tra i vicoli del mercato).
// Una scelta che cambia il Tabellone: prestare o no l'orario di allenamento ai Ragazzi del Mercato decide chi passa l'altro
// quarto, e quindi chi incontri in semifinale. Amichevole facoltativa con l'Accademia (partita a scelta), semifinale a Vignette.
(function () {
  "use strict";
  function boot() { const D = window.__torneo; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("ts_nadia", { name: "Nadia Spillo, giornalista", tag: "", hair: "#2a1a3a", style: "bob", skin: "#e8c4a0", eye: "#3a2a5a", glasses: true, bg: ["#2a1a18", "#e8e8e8"], shirt: "#5a3a6a" },
      "Giornalista dell'Eco di Portolungo, l'unico giornale della città (quattro pagine, due di necrologi e due di calcio). Scrive del torneo da vent'anni e non ha mai visto vincere nessuno tranne l'Accademia.");
    K.cast("ts_bruna", { acc: ["grembiule"], name: "Bruna del Mercato", tag: "", hair: "#5a2a1a", style: "codino", skin: "#d9a679", eye: "#2a2a2a", bg: ["#3a2a18", "#7ac84a"], shirt: "#7ac84a" },
      "Capitana dei Ragazzi del Mercato: i figli dei venditori, che si allenano tra una cassetta di pesche e l'altra. Grida come al banco della frutta, e in campo si sente da tutta la città.");
    K.cast("ts_lume", { name: "Lume, capitano delle Lanterne", tag: "", hair: "#e8c84a", style: "slick", skin: "#f0d0b0", eye: "#3a3a2a", bg: ["#1a1a2a", "#e8c84a"], shirt: "#e8883a" },
      "Capitano delle Lanterne, la scuola calcio della zona del porto vecchio. Gioca bene e sorride poco. Dicono che le Lanterne vincano le partite prima di giocarle, a forza di chiacchiere in tribuna.");
    K.cast("ts_venditore", { acc: ["paglia"], name: "Sor Fulvio, venditore di angurie", tag: "gray", hair: "#d8d8d8", style: "buzz", skin: "#c68642", eye: "#3a3a3a", bg: ["#3a2a18", "#e85a3a"], shirt: "#f4ecdc" },
      "Vende angurie da cinquant'anni, sempre camminando con la carriola tra le bancarelle. Dice che un'anguria ferma non la compra nessuno.");
    K.cast("ts_fioraia", { name: "Mirella, la fioraia", tag: "", hair: "#c8642a", style: "long", skin: "#f2c9a0", eye: "#2a5a3a", bg: ["#3a2a18", "#e8a8c8"], shirt: "#e8a8c8" },
      "La fioraia del mercato. Gira con un secchio di fiori e ne regala uno a chi ha l'aria triste. A fine giornata il secchio è sempre vuoto.");
    K.cos("ts_c2", { kind: "acc", label: "Fascia della Via Lunga", val: "#e83a3a", from: "Capitolo 2 del Torneo delle Cento Scuole" });
    K.cos("ts_mercato", { kind: "hairc", label: "Capelli Pesca Matura", val: "#f0a070", from: "Trova tutti i fischietti di latta del mercato" });
    K.lore("l_muro", { t: "Tecnica · Il Muro Umano", d: "Dei gemelli Sabbia: tutta la squadra in fila davanti all'attaccante, ognuno un passo dietro l'altro. L'attaccante vede un solo giocatore. Poi due. Poi capisce. Troppo tardi." });
    K.lore("l_ombra", { t: "Tecnica · La Finta dell'Ombra", d: "Di Alba la postina: corri dove c'è l'ombra, così il difensore guarda il sole. Funziona solo di pomeriggio. In partita, quando lo Spirito è pieno, salti tutti i difensori in un colpo solo." });
    K.lore("l_vela", { t: "Ettore Vela", d: "Suo padre ha fondato l'Accademia del Faro trent'anni fa. Ettore non ha mai perso una partita di torneo, e non ha mai riso in campo. Sono due record. Uno solo gli piace." });

    const goal = (s) => ({
      0: "Il mattino della semifinale. Nadia, la giornalista, ti cerca in piazza.",
      1: "Impara le tecniche nuove: il Muro Umano (dai gemelli, in spiaggia) e la Finta dell'Ombra (da Alba, al mercato: a est della piazza).",
      2: "I Ragazzi del Mercato hanno perso il loro orario di allenamento. Bruna è al mercato.",
      3: "La semifinale si gioca al Campo dei Cento. (Al faro, giù in spiaggia verso est, Ettore si allena da solo.)",
      4: "Siete in finale! Ettore Vela è al faro, al tramonto.",
    }[s] || "Capitolo concluso. Dal menu prosegui con il Capitolo 3.");
    const techOk = () => F.is("ts_tec_muro") && F.is("ts_tec_ombra");
    const semiOpp = () => F.get("tb_q1", "Le Lanterne");
    const letters2 = () => ["ts_l2_venditore", "ts_l2_fioraia"].filter((k) => F.is(k)).length;

    const zones = {
      ts_mercato: {
        region: "citta", name: "Il Torneo delle Cento Scuole · Il mercato", short: "Il mercato", sub: "Bancarelle, vicoli e gente che cammina", bg: "ts_mercato", time: "giorno", travel: [2, 9],
        w: 36, h: 18, start: [2, 9], itemCos: "ts_mercato", items: [[34, 2], [34, 15], [18, 2], [10, 15]],
        areas: [[0, 0, 35, 17, "Il mercato"]], act: { "<": "Torna in piazza" },
        flavor: { K: ["Una bancarella di pesche. Il cartello: «Pesche della Via Lunga: chi le mangia corre». Il venditore giura che è vero.", "Pesce fresco, ghiaccio, gabbiani in attesa. Il pesce ti guarda. Tu guardi il pesce. Nessuno dei due vince.", "Sciarpe del torneo. C'è anche quella rossa della Via Lunga, nuova: l'ha cucita il venditore stanotte, «per scaramanzia»."] },
        intro: [["voce", "Il mercato di Portolungo: una strada stretta tra due file di bancarelle, tende colorate, voci che si sovrappongono. La gente cammina, si ferma, assaggia, riparte."], ["voce", "Tra la folla passa una bicicletta gialla. È Alba, che fa slalom tra i clienti senza toccarne nessuno."]],
        npcs: (s) => [
          ...(s >= 1 && s <= 1 && !F.is("ts_tec_ombra") ? [{ id: "ts_alba", at: [8, 9], route: [[8, 9], [28, 9], [28, 8], [8, 8]], speed: 0.7, pause: 20 }] : []),
          ...(s <= 3 ? [{ id: "ts_bruna", at: [20, 4] }] : []),
          { id: "ts_venditore", at: [6, 13], route: [[6, 13], [30, 13]], speed: 0.3, pause: 90 },
          { id: "ts_fioraia", at: [30, 5], route: [[30, 5], [12, 5]], speed: 0.35, pause: 70 },
        ],
        build(L) {
          const { lay, put } = L;
          lay(1, 1, 34, 16, "+"); lay(0, 0, 35, 0, "t"); lay(0, 17, 35, 17, "t"); lay(0, 0, 0, 17, "t"); lay(35, 0, 35, 17, "t"); put(0, 8, "<"); put(0, 9, "<");
          lay(1, 7, 34, 10, ":"); for (let x = 3; x < 34; x += 3) { put(x, 3, "K"); put(x, 14, "K"); } put(17, 1, "s");
        },
        decor(g, cx, cy, d) { // le tende colorate sopra le bancarelle
          for (let x = 3; x < 34; x += 3) [3, 14].forEach((y, k) => { const X = d.X(x) - 4, Y = d.Y(y) - 10 + (k ? 0 : 0); for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#f4ecdc" : ["#e83a3a", "#3a8ac8", "#7ac84a", "#e8c84a"][(x / 3 + k) % 4]; g.fillRect(X + i * 6, Y, 6, 6); } g.fillStyle = "rgba(0,0,0,.15)"; g.fillRect(X, Y + 6, 24, 2); });
        },
      },
      ts_faro: {
        region: "campo", name: "Il Torneo delle Cento Scuole · Il campo del Faro", short: "Il campo del Faro", sub: "L'Accademia, sotto il faro", bg: "ts_faro", time: (s) => (s >= 4 ? "tramonto" : "giorno"), travel: [2, 10],
        w: 30, h: 20, start: [2, 10], items: [[27, 2], [27, 17]],
        areas: [[0, 0, 29, 19, "Il campo del Faro"]], act: { "<": "Torna in spiaggia" },
        flavor: { K: "La bacheca dell'Accademia: orari, regolamento interno (articolo 4: «in campo non si ride»), e una foto del fondatore, Vela senior, con la coppa in mano e senza sorridere." },
        intro: [["voce", "Il campo dell'Accademia del Faro: erba tagliata col righello, linee tirate di fresco, e in fondo il faro, bianco e blu, che guarda il mare e il campo con la stessa serietà."], ["voce", "In mezzo al campo, da solo, un ragazzo corre avanti e indietro lungo la linea di fondo. Avanti e indietro. Avanti e indietro."]],
        // NOVITÀ: Ettore si allena correndo lungo la linea di fondo (personaggio che cammina)
        npcs: (s) => [{ id: "ts_ettore", at: [6, 4], ...(s < 4 ? { route: [[6, 4], [24, 4]], speed: 0.8, pause: 10 } : { at: [24, 15] }) }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 19, 29, 19, "t"); lay(0, 0, 0, 19, "t"); lay(29, 0, 29, 19, "t"); put(0, 9, "<"); put(0, 10, "<");
          lay(4, 3, 26, 16, "-"); put(27, 9, "K"); lay(1, 9, 3, 10, ":");
        },
        decor(g, cx, cy, d) { // le linee col righello e il faro dell'Accademia
          g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1.2; g.strokeRect(d.X(4) + 2, d.Y(3) + 2, 23 * 16 - 4, 14 * 16 - 4); g.beginPath(); g.moveTo(d.X(15) + 8, d.Y(3) + 2); g.lineTo(d.X(15) + 8, d.Y(17) - 2); g.stroke();
          const x = d.X(27) + 4, y = d.Y(2); g.fillStyle = "#f4ecdc"; g.fillRect(x, y - 40, 14, 60); for (let k = 0; k < 4; k++) { g.fillStyle = "#1a2a5a"; g.fillRect(x, y - 34 + k * 14, 14, 5); } g.fillStyle = "#1a2a5a"; g.fillRect(x - 3, y - 48, 20, 9); if (Math.floor(d.fr / 30) % 2) K.light(x + 7, y - 44, 30, "255,240,180", 0.5);
        },
      },
    };
    function semi() {
      const opp = semiOpp(), mer = opp === "Ragazzi del Mercato";
      K.ownMatch(window.__vignette.start, {
        oppStyle: mer ? "equilibrata" : "contropiede", title: `Semifinale · La Via Lunga – ${opp}`, us: "La Via Lunga", actions: 8,
        opp: mer ? { name: opp, color: "#4a9a3a", players: [{ id: "ts_bruna", name: "Bruna", skin: "#d9a679", hair: "#5a2a1a" }, { name: "Tonio", skin: "#e0b890", hair: "#2a1a1a" }, { name: "Rosa", skin: "#c68642", hair: "#3a2a1a" }] }
          : { name: opp, color: "#e8883a", players: [{ id: "ts_lume", name: "Lume", skin: "#f0d0b0", hair: "#e8c84a" }, { name: "Fiamma", skin: "#e8c4a0", hair: "#b8452a" }, { name: "Stoppino", skin: "#d9a679", hair: "#1a1a1a" }] },
        mates: [{ id: "ts_alba", name: "Alba", skin: "#f0d0b0", hair: "#c8642a" }, { id: "ts_rocco", name: "Rocco", skin: "#c68642", hair: "#e8c870" }], shirt: "#e83a3a", techniques: K.techs(), bg: "ts_campo",
        intro: mer ? "<p>I Ragazzi del Mercato gridano come al banco della frutta: «Pesche! Pesche!». Nessuno sa perché. Giocano onesti e ridono anche loro. Sarà una bella semifinale.</p>" : "<p>Le Lanterne ripartono veloci come una voce di paese. Hanno vinto il quarto senza che nessuno li vedesse allenarsi. Attenti al contropiede.</p>",
        done: (r) => {
          if (!r.win) return K.scene([["ts_iole", "(fischia) Rivincita. Il regolamento del torneo la concede, una volta, se l'altra squadra è d'accordo."], [mer ? "ts_bruna" : "ts_lume", mer ? "D'accordo? Certo! Una partita in più è una partita in più! PESCHE!" : "…D'accordo. Ma stavolta vi battiamo meglio."]], () => K.enterZone("ts_campo"), "ts_campo");
          F.set("tb_s0", "La Via Lunga"); F.set("tb_s1", "Accademia del Faro"); F.set("ts_m2", r.a + "-" + r.b); setStep(N, 4); questDone("ts_semi"); bond("squadra", 2);
          K.scene([["voce", "La Via Lunga è in finale. In tribuna, la maestra Iole non applaude: tiene il fischietto stretto in mano, come un biglietto vincente."], ["ts_nadia", "(scrive in fretta) «La squadra senza scuola in finale contro l'Accademia». Il direttore non ci crederà. Domani prima pagina. Anzi, tutte e quattro."], ["voce", "Dall'altra semifinale arriva la notizia: l'Accademia del Faro ha battuto il Collegio San Biagio 5 a 0. Ettore ha segnato tre gol. Senza esultare."]], () => K.enterZone("ts_campo"), "ts_campo");
        },
      });
    }
    function amichevole() {
      K.playMatch({
        id: "ts_amichevole", alt: "az,cage,hd", force: false, oppTeam: "Accademia del Faro", oppVs: "l'Accademia", oppColor: "#1a2a5a", mate: "Alba Corsi, postina", squad: ["Tito Fornaretti"], us: "La Via Lunga", homeKit: ["#e83a3a", "#f4ecdc"], azPitch: "erba", cageField: 1,
        chap: "Il Torneo delle Cento Scuole · Amichevole al Faro", bg: "ts_faro", intro: "Un'amichevole di allenamento sotto il faro: {n}, Alba e Tito contro Ettore e due dell'Accademia. Non conta niente. Per Ettore, conta tutto.",
        oppNames: ["Ettore Vela", "Marino", "Scotti", "Bassani", "Ferretti"],
        done: (r) => { F.set("ts_amichevole", r.win ? "vinta" : "persa"); bond("rivale", 1); const msg = K.reward("m:ts_amichevole", { coins: r.win ? 40 : 20 }); say([["ts_ettore", r.win ? "…Avete vinto un'amichevole contro l'Accademia. Non succedeva dal 1998. (Si asciuga il sudore.) Non lo dirò a mio padre." : "Abbiamo vinto noi. Come sempre. (Pausa.) Però a un certo punto Alba ha fatto una cosa che non avevo mai visto. Me la rifate, in finale?"], ["voce", `<b>${msg.join(" · ")}</b>`]]); },
      });
    }
    const talk = {
      ts_nadia() {
        const s = S();
        if (s === 0) return say([
          ["ts_nadia", "Eccoti! Nadia Spillo, l'Eco di Portolungo. Domanda per l'articolo: come si sente la squadra senza scuola alla vigilia della semifinale? No, aspetta, prima la notizia."],
          ["ts_nadia", "Domani si gioca l'altro quarto: Ragazzi del Mercato contro Le Lanterne. Il vincente lo incontrate voi. Ma il Mercato ha perso il suo orario di allenamento al Campo: l'avevano prenotato due volte, e le Lanterne hanno protestato. Bruna è disperata."],
          ["ts_iole", "(arrivando, col fischietto) Prima le tecniche, poi le notizie. I gemelli hanno una cosa da mostrarvi. E Alba un'altra. Andate."],
        ], () => { setStep(N, 1); quest("ts_tecniche", "Due tecniche nuove", "Il Muro Umano (dai gemelli, in spiaggia) e la Finta dell'Ombra (da Alba, al mercato)."); done(); });
        return say([["ts_nadia", K.pick(["Titolo di domani: «La Via Lunga sogna». Troppo poetico? Il direttore dice che la poesia non vende. Io dico che non vende perché non la scriviamo.", "Vent'anni di torneo, vent'anni di Accademia. Se vincete voi, devo comprare un'altra macchina da scrivere: questa sa scrivere solo «Accademia»."])]]);
      },
      ts_rocco() { return gemelli(); }, ts_remo() { return gemelli(); },
      ts_alba() {
        if (S() === 1 && !F.is("ts_tec_ombra")) return ask("ts_alba", "(frena la bicicletta di colpo) Eccoti! La Finta dell'Ombra: la uso tutti i giorni per seminare i cani. Corri dove c'è ombra, così chi ti insegue guarda il sole e non ti vede. Te la insegno, ma prima mi aiuti: ho due lettere per il mercato. Sor Fulvio e Mirella. Vanno in giro anche loro.", [
          { label: "«Insegnamela, e le lettere le porto io»", sub: "Impara la Finta dell'Ombra", cls: "hot", fn: () => { F.set("ts_tec_ombra", true); F.set("ts_lettere2", true); K.learnLore("l_ombra"); bond("squadra", 1); say([["voce", "Alba ti porta tra i vicoli dietro le bancarelle, dove il sole e l'ombra si alternano a strisce. Corri, ti fermi, cambi lato. Alla fine anche il gatto del pescivendolo perde le tue tracce."], ["ts_alba", "Ecco. In partita, con lo Spirito pieno: salti tutti, uno dopo l'altro. E le lettere, mi raccomando: sono per Sor Fulvio e per Mirella. Non le hanno mai lette in vita loro, una lettera. Sono emozionati."]], () => { if (techOk()) { setStep(N, 2); questDone("ts_tecniche"); quest("ts_mercato", "Il Mercato senza campo", "Bruna dei Ragazzi del Mercato è disperata. Parlale, al mercato."); } done(); }); } },
          { label: "Dopo", fn: done },
        ], "ts_mercato");
        return say([["ts_alba", K.pick(["Corro, consegno, corro. Domani in finale faccio lo stesso: consegno il pallone in porta.", "La posta può aspettare. Ah no, quella no. Ma io sì."])]]);
      },
      ts_venditore() { return letter2("ts_l2_venditore", "ts_venditore", "Una lettera? Per me? Mai ricevuta una in vita mia! (La apre con le mani che tremano.) È… è il mio nipote, da Torino. Dice che ha assaggiato un'anguria lassù e che non era buona come la mia. Che bello. Che bello.", "Angurie! Angurie fresche! Un'anguria ferma non la compra nessuno, per questo cammino."); },
      ts_fioraia() { return letter2("ts_l2_fioraia", "ts_fioraia", "Per me? (Legge.) È… dal signore della terza bancarella. Mi chiede se una sera voglio vedere il tramonto al faro. Da dieci anni compra un fiore al giorno. Ah. Ecco perché. (Ti regala un fiore. Il secchio, per la prima volta, è ancora pieno.)", "Un fiore per te? Sembri contento. Allora non te lo do: li do solo a chi è triste. Torna quando hai perso una partita."); },
      ts_bruna() {
        const s = S();
        if (s === 2) return ask("ts_bruna", "(seduta su una cassetta di pesche, la testa tra le mani) Il nostro orario al Campo l'hanno dato alle Lanterne. Domani giochiamo il quarto senza esserci allenati sull'erba: solo tra le bancarelle. Voi… voi avete il campo oggi pomeriggio, vero? La maestra Iole l'ha prenotato.\n\nSe ce lo prestaste… Lo so, è la vostra semifinale. Se vinciamo, poi incontriamo voi. E saremmo più forti.", [
          { label: "«Prendetelo. Il campo è di tutti»", sub: "Il Mercato si allena e probabilmente vince il quarto", big: true, fn: () => mercato(true) },
          { label: "«Mi dispiace, ci serve. È la semifinale»", sub: "La Via Lunga si allena: il quarto lo vincono le Lanterne", big: true, fn: () => mercato(false) },
        ], "ts_mercato");
        if (s < 2) return say([["ts_bruna", "PESCHE! PESCHE DELLA VIA LUNGA! Ah, scusa, è l'abitudine. Ciao! Domani giochiamo il quarto. Speriamo."]]);
        return say([["ts_bruna", F.is("ts_prestito") ? "Ci siamo allenati sull'erba! L'erba! Sembrava un materasso! Grazie, Via Lunga. Ci vediamo in semifinale: non vi faremo sconti, ma vi porteremo le pesche." : "Va bene così. È il torneo. Ci alleniamo tra le bancarelle: le cassette sono avversari che non si stancano mai."]]);
      },
      ts_lume() { return say([["ts_lume", "Lume, Lanterne. Domani vinciamo noi. Poi vinciamo anche contro di voi. Poi in finale perdiamo contro l'Accademia, come sempre. Ma intanto ci divertiamo."]]); },
      ts_iole() {
        const s = S();
        if (s === 3) return ask("ts_iole", `La semifinale. Contro ${semiOpp()}. (Si sistema il fischietto.) Ricordatevi le tecniche: Tiro a Tre, Muro Umano, Finta dell'Ombra. Lo Spirito le carica, le belle giocate caricano lo Spirito. E ridete. Ridete tanto: l'avversario non capisce mai perché.`, [{ label: "Gioca la semifinale", sub: "Vignette, con le tecniche nuove", cls: "hot", fn: semi }, { label: "Un momento", fn: done }], "ts_campo");
        return say([["ts_iole", "Arrivo, arrivo. Sono lenta, ma arrivo."]]);
      },
      ts_ettore() {
        const s = S();
        if (s === 4) return ask("ts_ettore", "(Ettore è seduto sotto il faro. Il sole va giù nel mare.) Vi ho visti giocare la semifinale. Di nuovo ridevate. Io stamattina ho segnato tre gol e mio padre mi ha detto: «Il terzo era sbilenco».\n\nDomani è la finale. Che cosa volete da me?", [
          { label: "«Domani gioca per divertirti. Anche tu»", sub: "Un invito, non una sfida", big: true, fn: () => endCh("diverti") },
          { label: "«Domani ti battiamo. Preparati»", sub: "La Via Lunga si carica", big: true, fn: () => endCh("sfida") },
          { label: "«Stasera vieni a cena da Tito, con noi»", sub: "Prima della finale, la pizza", big: true, fn: () => endCh("cena") },
        ], "ts_faro");
        if (F.is("ts_amichevole")) return say([["ts_ettore", "Un'altra amichevole? No. Domani c'è la semifinale. Le amichevoli si giocano quando non conta niente. Per me conta sempre tutto."]]);
        return ask("ts_ettore", "(si ferma, con il fiato corto) Che ci fate al campo dell'Accademia? Volete vedere come ci si allena davvero? Facciamo così: un'amichevole. Tre contro tre. Non conta niente. Ma vediamo chi siete.", [{ label: "Gioca l'amichevole", sub: "Partita a scelta: 3 contro 3, Gabbia o 2D HD", cls: "hot", fn: amichevole }, { label: "Un'altra volta", fn: done }], "ts_faro");
      },
    };
    function gemelli() {
      if (F.is("ts_tec_muro")) return say([["ts_rocco", "Muro Umano: io davanti…"], ["ts_remo", "…io dietro. No, io davanti."], ["ts_rocco", "Va bene, tu davanti. Tanto siamo uguali."]]);
      if (S() !== 1) return say([["ts_remo", "In finale ci mettiamo in fila…"], ["ts_rocco", "…e nessuno passa. Neanche l'onda."]]);
      return ask("ts_rocco", "(in coro) IL MURO UMANO! L'abbiamo inventato da bambini: ci mettevamo in fila davanti alle onde e l'onda, vedendo due bambini uguali, si confondeva. Ora: Tito davanti, noi due in mezzo, Alba dietro. L'attaccante vede uno, poi due… Proviamo?", [
        { label: "«In fila, al mio fischio!»", sub: "Impara il Muro Umano", cls: "hot", fn: () => { F.set("ts_tec_muro", true); K.learnLore("l_muro"); bond("squadra", 1); say([["voce", "Sulla battigia, la Via Lunga si mette in fila. La prima onda passa. La seconda passa. Alla decima, un bambino che passa col pallone si ferma davanti al muro, ci pensa, e torna indietro."], ["ts_remo", "Funziona! Sui bambini, almeno."], ["ts_rocco", "In partita, con lo Spirito pieno, l'attaccante si ferma e la palla è nostra. Garantito. Quasi."]], () => { if (techOk()) { setStep(N, 2); questDone("ts_tecniche"); quest("ts_mercato", "Il Mercato senza campo", "Bruna dei Ragazzi del Mercato è disperata. Parlale, al mercato."); } done(); }); } },
        { label: "Dopo", fn: done },
      ], "ts_spiaggia");
    }
    function letter2(flag, who, ok, idle) {
      if (F.is("ts_lettere2") && !F.is(flag)) { F.set(flag, true); K.SFX.ding(); bond("squadra", 0); return say([[who, ok], ["voce", `Lettere del mercato consegnate: ${letters2()} su 2.`]]); }
      return say([[who, idle]]);
    }
    function mercato(lend) {
      F.set("ts_prestito", lend); F.set("tb_q1", lend ? "Ragazzi del Mercato" : "Le Lanterne"); setStep(N, 3); questDone("ts_mercato"); quest("ts_semi", "La semifinale", `Al Campo dei Cento, contro ${lend ? "i Ragazzi del Mercato" : "le Lanterne"}. Parla con la maestra Iole.`);
      if (lend) { bond("squadra", 1); bond("rivale", 1); }
      say(lend ? [["ts_bruna", "Davvero? DAVVERO? (Ti abbraccia. Odora di pesca.) PESCHE GRATIS PER LA VIA LUNGA, PER SEMPRE!"], ["voce", "Il giorno dopo, sul Tabellone, qualcuno scrive col gesso: Ragazzi del Mercato 2, Lanterne 1. In semifinale ci sarà il Mercato. Ettore Vela, che ha saputo tutto, scrive sul suo quaderno: «Via Lunga: presta il campo. Perché?»."]]
        : [["ts_bruna", "Capisco. È la semifinale. Lo farei anch'io. (Si alza, si pulisce le mani sul grembiule.) Ci alleniamo tra le bancarelle."], ["voce", "Il giorno dopo, sul Tabellone: Le Lanterne 3, Ragazzi del Mercato 1. In semifinale ci saranno le Lanterne, quelle del contropiede."]]);
    }
    function endCh(kind) {
      if (kind === "diverti") bond("rivale", 2); if (kind === "sfida") { bond("squadra", 2); bond("rivale", -1); } if (kind === "cena") { bond("rivale", 1); bond("squadra", 1); }
      K.learnLore("l_vela"); const msg = K.reward("ch2", { coins: 80, cos: ["ts_c2"] }); finishChapter(N, kind); setStep(N, 7);
      const lines = {
        diverti: [["ts_ettore", "Divertirmi. (Guarda il faro.) Mio padre dice che il divertimento è quello che resta dopo aver vinto. Io non l'ho mai trovato, quello che resta. …Domani provo a guardare dove guardate voi."]],
        sfida: [["ts_ettore", "Preparati tu. (Ma lo dice piano, e quasi sorride.)"], ["ts_tito", "Ha quasi sorriso! L'avete visto? Ha quasi sorriso! Segniamolo sul Tabellone!"]],
        cena: [["voce", "Quella sera, nella panetteria di Tito, Ettore Vela mangia tre pizze. Al terzo pezzo ride per una battuta di Remo (o di Rocco). Se ne accorge, si ferma, poi ride di nuovo."], ["ts_ettore", "Non ditelo a mio padre. Né della pizza, né della risata."]],
      }[kind];
      K.scene([...lines, ["voce", `Sul Tabellone, in piazza, adesso ci sono due nomi soli nella linea della finale: LA VIA LUNGA e ACCADEMIA DEL FARO. <b>Fine del Capitolo 2.</b> ${msg.join(" · ")}`]], () => K.openMain(), "ts_faro");
    }
    const obj = {
      "ts_piazza:>": () => go("ts_mercato", 1, 9), "ts_mercato:<": () => go("ts_piazza", 38, 12),
      "ts_spiaggia:>": () => go("ts_faro", 2, 10), "ts_faro:<": () => go("ts_spiaggia", 38, 10),
    };
    const patch = {
      ts_piazza: { build(L) { L.put(39, 12, ">"); L.put(39, 13, ">"); }, act: { ">": "Vai al mercato" }, npcs: (s, list) => [...list.filter((n) => n.id !== "ts_iole"), ...(s === 0 ? [{ id: "ts_nadia", at: [24, 13] }] : [])] },
      ts_spiaggia: { build(L) { L.put(39, 9, ">"); L.put(39, 10, ">"); }, act: { ">": "Vai al faro" }, npcs: (s, list) => (s === 1 && !F.is("ts_tec_muro") ? [{ id: "ts_rocco", at: [14, 14] }, { id: "ts_remo", at: [16, 14] }] : []) },
      ts_campo: { npcs: (s) => (s === 3 ? [{ id: "ts_iole", at: [18, 9] }] : s >= 4 ? [{ id: "ts_nadia", at: [22, 12] }] : []) },
    };
    return { n: N, title: "La semifinale", sub: "Il mercato, il campo del Faro, due tecniche nuove", goal, start: "ts_piazza", introBg: "ts_mercato", zones, talk, obj, patch,
      intro: () => [["voce", "Il giorno dopo il quarto di finale, Portolungo parla solo della Via Lunga. Al bar, al mercato, sotto gli ombrelloni: «Il panettiere in difesa. La postina all'ala. I gemelli che non sanno chi sono»."], ["voce", "La maestra Iole, stamattina, si è alzata alle cinque. Non lo faceva da trent'anni. Ha lucidato il fischietto e ha preparato tre fogli: tre tecniche. Ne avete imparata una. Ne mancano due."]] };
  }
  boot();
})();
