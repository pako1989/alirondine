// js/torneo-c1.js - IL TORNEO DELLE CENTO SCUOLE · Capitolo 1 «L'iscrizione»
// Portolungo d'estate. La piazza del Tabellone (la gente gira per le strade: personaggi che camminano), la panetteria
// di Tito (si entra), l'ufficio postale di Alba (si entra), la spiaggia dei gemelli bagnini. Si forma la Via Lunga,
// la maestra Iole insegna la prima tecnica (il Tiro a Tre) e si gioca l'ottavo… anzi, il quarto di finale a Vignette.
(function () {
  "use strict";
  function boot() { const D = window.__torneo; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("ts_iole", { acc: ["fischietto", "occhiali"], name: "Maestra Iole Bandini", tag: "gray", hair: "#e8e8e8", style: "bun", skin: "#e8c4a0", eye: "#3a3a5a", bg: ["#2a1a18", "#e8c84a"], shirt: "#3a5a8a" },
      "Per quarant'anni ha allenato i bambini di Portolungo sotto i portici, con un pallone di stracci e un fischietto di latta. Poi la scuola calcio ha chiuso. Dice che non allena più. Ha il fischietto al collo da trent'anni.");
    K.cast("ts_tito", { beard: "incolta", acc: ["grembiule"], name: "Tito Fornaretti", tag: "", hair: "#3a2a1a", style: "buzz", skin: "#e8b88a", eye: "#3a2a1a", bg: ["#3a2a18", "#f4ecdc"], shirt: "#f4ecdc", },
      "Il panettiere di via Lunga. Grande come una porta, gentile come la mollica. Si alza alle tre per il pane e dice che per questo non ha paura di nessun attaccante: «Alle tre del mattino ho visto cose peggiori».");
    K.cast("ts_alba", { acc: ["borsa"], name: "Alba Corsi, postina", tag: "", hair: "#c8642a", style: "ponytail", skin: "#f0d0b0", eye: "#2a5a3a", bg: ["#1a2a3a", "#e8c84a"], shirt: "#3a5a8a" },
      "La postina di Portolungo, in bicicletta da quindici anni. Conosce ogni scorciatoia, ogni cane e ogni segreto della città, ma non ne racconta nessuno. Veloce come una lettera urgente.");
    K.cast("ts_rocco", { band: "#ffd23f", acc: ["fischietto"], name: "Rocco Sabbia", tag: "", hair: "#e8c870", style: "spiky", skin: "#c68642", eye: "#2a4a6a", bg: ["#1a3a5a", "#e83a3a"], shirt: "#e83a3a" },
      "Bagnino, gemello di Remo. Finisce le frasi di suo fratello. Il che sarebbe carino, se le finisse in modo giusto.");
    K.cast("ts_remo", { acc: ["fischietto"], name: "Remo Sabbia", tag: "", hair: "#e8c870", style: "spiky", skin: "#c68642", eye: "#2a4a6a", bg: ["#1a3a5a", "#e83a3a"], shirt: "#e83a3a" },
      "Bagnino, gemello di Rocco. Si scambiano i nomi per scherzo da trentadue anni. La loro madre li distingue dal modo di starnutire.");
    K.cast("ts_ettore", { acc: ["fascia"], name: "Ettore Vela", tag: "", hair: "#1a1a2a", style: "slick", skin: "#e0b890", eye: "#2a3a6a", bg: ["#10162e", "#e8e8f0"], shirt: "#1a2a5a" },
      "Capitano dell'Accademia del Faro, la scuola calcio più forte della Riviera. Non ha mai perso una partita di torneo. Si allena anche quando piove, anche a Natale. Non ride mai in campo: dice che distrae.");
    K.cast("ts_gil", { name: "Gil Porto", tag: "", hair: "#2a2a2a", style: "messy", skin: "#d9a679", eye: "#2a2a2a", bg: ["#1a2a4a", "#3a6ab8"], shirt: "#3a6ab8" },
      "Capitano dei Gabbiani del Porto, la scuola calcio dei figli dei portuali. Gioca come scarica le casse: forte, dritto, senza fermarsi a chiedere.");
    K.cast("ts_vigile", { name: "Vigile Ottavio", tag: "", hair: "#5a4a3a", style: "buzz", skin: "#e0b890", eye: "#3a3a3a", bg: ["#2a2a3a", "#e8e8e8"], shirt: "#e8e8f0", cap: "#1a2a4a" },
      "Il vigile di piazza. Gira tutto il giorno intorno al Tabellone e fischia alle biciclette. A tutte. Anche a quelle parcheggiate.");
    K.cast("ts_turista", { acc: ["paglia"], name: "Signora Greta, turista", tag: "", hair: "#e8d08a", style: "bob", skin: "#f2c9a0", eye: "#2a5a8a", bg: ["#3a2a1a", "#e8c84a"], shirt: "#e8a8c8" },
      "In vacanza a Portolungo da trentun estati. Si perde tutti i giorni, sempre nello stesso punto, e ogni volta è felicissima di aver trovato la piazza.");
    K.cast("ts_pescatore", { beard: "folta", name: "Nonno Pino, pescatore", tag: "gray", hair: "#d8d8d8", style: "buzz", skin: "#c68642", eye: "#3a3a3a", bg: ["#1a3a5a", "#d8d8d8"], shirt: "#3a5a7a", },
      "Pescatore in pensione. Passeggia sul lungomare avanti e indietro, come se stesse ancora tirando le reti. Racconta la stessa storia del tonno da sessant'anni, e ogni volta il tonno è più grande.");
    K.cos("ts_c1", { kind: "shirt", label: "Maglia rossa della Via Lunga", val: "#e83a3a", from: "Capitolo 1 del Torneo delle Cento Scuole" });
    K.cos("ts_fischi", { kind: "hairc", label: "Capelli Pane Dorato", val: "#e8b860", from: "Trova tutti i fischietti di latta della piazza" });
    K.lore("l_torneo", { t: "Il Torneo delle Cento Scuole", d: "Ogni estate le scuole calcio della Riviera si sfidano a Portolungo. Le scuole non sono cento: sono otto. Ma una volta, cinquant'anni fa, erano cento davvero, e il nome è rimasto per affetto." });
    K.lore("l_tiro3", { t: "Tecnica · Il Tiro a Tre", d: "La prima tecnica della maestra Iole: tre passaggi di prima, senza guardare, e il terzo tira. «Non è magia. È fidarsi. Se ti fidi, il portiere non sa dove guardare, perché non lo sai nemmeno tu.»" });

    const goal = (s) => ({
      0: "Il Torneo delle Cento Scuole sta per cominciare. In piazza, davanti al Tabellone, c'è una signora con un fischietto al collo.",
      1: "Forma la squadra: Tito (panetteria), Alba (ufficio postale) e i gemelli Rocco e Remo (in spiaggia, giù dalla scalinata).",
      2: "La squadra c'è. Torna dalla maestra Iole, in piazza.",
      3: "Il quarto di finale si gioca al Campo dei Cento (a ovest della piazza), contro I Gabbiani del Porto.",
      4: "Avete passato il turno! Al Campo dei Cento c'è qualcuno che vi guarda.",
    }[s] || "Capitolo concluso. Dal menu prosegui con il Capitolo 2.");
    const team = () => ["ts_tito_ok", "ts_alba_ok", "ts_gemelli_ok"].filter((k) => F.is(k)).length;
    const letters = () => ["ts_l_vigile", "ts_l_turista", "ts_l_pescatore"].filter((k) => F.is(k)).length;
    function checkTeam() { if (S() === 1 && team() >= 3) { setStep(N, 2); questDone("ts_squadra"); return true; } return false; }

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const zones = {
      ts_piazza: {
        region: "citta", name: "Il Torneo delle Cento Scuole · Piazza del Tabellone", short: "Piazza del Tabellone", sub: "Portolungo, d'estate", bg: "ts_piazza", time: "giorno", travel: [20, 14],
        w: 40, h: 26, start: [20, 16], itemCos: "ts_fischi", items: [[2, 23], [37, 23], [12, 18], [27, 18], [37, 10]],
        areas: [[4, 3, 12, 9, "La panetteria Fornaretti"], [27, 3, 35, 9, "L'ufficio postale"], [14, 4, 26, 12, "Il Tabellone"], [0, 0, 39, 25, "Piazza del Tabellone"]],
        act: { "<": "Vai al Campo dei Cento", v: "Scendi in spiaggia" },
        flavor: { K: ["Una bancarella di sciarpe del torneo: ci sono tutte e otto le squadre. Manca la Via Lunga. Il venditore dice che «se arrivate in semifinale, ve la cucio io».", "Frutta e granite. Il granitaio ha un tabellone tutto suo, scritto col gesso: le sue scommesse. La Via Lunga è data 50 a 1."], C: "La cassetta delle lettere rossa. Qualcuno ci ha attaccato un adesivo: «FORZA ACCADEMIA». Qualcun altro ci ha scritto sotto, a penna: «forza tutti»." },
        intro: [["voce", "Portolungo, d'estate. La piazza è piena di bandierine di otto colori diversi, una per ogni scuola calcio del torneo. In mezzo, il Tabellone: una lavagna verde con le linee bianche, dove ogni sera qualcuno scrive chi è passato."], ["voce", "Davanti al Tabellone, una signora anziana con un fischietto di latta al collo lo guarda come si guarda una vecchia fotografia."]],
        npcs: (s) => [
          ...(s <= 2 ? [{ id: "ts_iole", at: [17, 13] }] : []),
          // NOVITÀ: la gente gira per la piazza (route)
          { id: "ts_vigile", at: [14, 15], route: [[14, 15], [26, 15], [26, 19], [14, 19]], speed: 0.4, pause: 40 },
          { id: "ts_turista", at: [8, 20], route: [[8, 20], [8, 12], [2, 12], [2, 20]], speed: 0.3, pause: 80 },
          { id: "ts_pescatore", at: [30, 20], route: [[30, 20], [37, 20], [37, 13]], speed: 0.35, pause: 60 },
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 0, "t"); lay(0, 25, 39, 25, "t"); lay(39, 0, 39, 25, "t"); lay(0, 0, 0, 25, "t"); put(0, 12, "<"); put(0, 13, "<"); put(19, 25, "v"); put(20, 25, "v");
          lay(1, 12, 38, 13, ":"); lay(19, 14, 20, 24, ":"); lay(13, 14, 27, 20, "+");
          house(4, 3, 9, 6, { door: [8, 8], roof: "#c8642a", wall: "#f0d8b0", rr: 3, lit: true, enter: { room: "bottega", id: "ts_forno", name: "La panetteria Fornaretti", who: (s) => (s <= 1 ? ["ts_tito"] : []), flavor: { F: "Il forno a legna di Tito. Dentro, pagnotte a forma di pallone. Fuori, un cartello: «Pane della Via Lunga: chi lo mangia segna»." }, act: { F: "Guarda il forno" }, build(L2) { L2.put(16, 3, "F"); L2.put(17, 3, "F"); } } });
          house(27, 3, 9, 6, { door: [31, 8], roof: "#3a5a8a", wall: "#e8e0c8", rr: 3, enter: { room: "ufficio", id: "ts_posta", name: "L'ufficio postale", who: (s) => (s <= 1 ? ["ts_alba"] : []) } });
          lay(8, 9, 8, 11, ":"); lay(31, 9, 31, 11, ":");
          lay(17, 6, 22, 6, "P"); put(30, 10, "C"); put(10, 10, "C"); [[3, 16], [4, 16], [35, 16], [36, 16]].forEach(([x, y]) => put(x, y, "K"));
          [[2, 3], [37, 3], [2, 8], [37, 8], [12, 22], [27, 22], [6, 23], [33, 23]].forEach(([x, y]) => put(x, y, "t")); [[16, 21], [23, 21]].forEach(([x, y]) => put(x, y, "b")); put(24, 17, "s");
        },
        decor(g, cx, cy, d) { // le bandierine di otto colori tra i lampioni
          const cols = ["#e83a3a", "#3a6ab8", "#e8c84a", "#7ac84a", "#a85ac8", "#3ac8c8", "#e8883a", "#1a2a5a"];
          for (let k = 0; k < 2; k++) { const y0 = d.Y(11 + k * 10) - 2; g.strokeStyle = "rgba(60,40,30,.6)"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(d.X(2), y0); g.quadraticCurveTo(d.X(20), y0 + 10, d.X(38), y0); g.stroke(); for (let i = 0; i < 24; i++) { const t = i / 23, x = d.X(2) + t * (d.X(38) - d.X(2)), y = y0 + Math.sin(t * Math.PI) * 5 + Math.sin(d.fr / 20 + i) * 0.6; g.fillStyle = cols[i % 8]; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + 3, y); g.lineTo(x, y + 6); g.closePath(); g.fill(); } }
        },
      },
      ts_spiaggia: {
        region: "spiaggia", name: "Il Torneo delle Cento Scuole · La spiaggia dei bagnini", short: "La spiaggia", sub: "Ombrelloni, torretta, i gemelli Sabbia", bg: "ts_spiaggia", time: "giorno", travel: [20, 2],
        w: 40, h: 22, start: [20, 2], items: [[2, 14], [37, 3], [28, 12]],
        areas: [[0, 0, 39, 21, "La spiaggia"]], act: { "^": "Risali in piazza" },
        flavor: { Y: ["Un ombrellone rosso e bianco. Sotto, un vecchio che dorme con il giornale sulla faccia. Il titolo: «CENTO SCUOLE, FAVORITA L'ACCADEMIA».", "Un ombrellone vuoto, con un pallone sgonfio sotto. Qualcuno ha scritto sopra a pennarello: «ritorno subito». La data è di tre estati fa."], J: "La torretta dei bagnini. Sul cartello degli orari qualcuno ha aggiunto: «allenamento della Via Lunga: quando Rocco e Remo smettono di litigare»." },
        intro: [["voce", "La spiaggia di Portolungo: ombrelloni a strisce, sabbia che scotta, il mare che arriva e se ne va come un portiere indeciso."], ["voce", "Due bagnini identici camminano lungo la riva, perfettamente in sincronia. Uno fischia. L'altro fischia nello stesso momento. Poi litigano su chi ha fischiato per primo."]],
        npcs: (s) => [
          ...(s <= 1 ? [{ id: "ts_rocco", at: [10, 16], route: [[10, 16], [30, 16]], speed: 0.5, pause: 30 }, { id: "ts_remo", at: [10, 17], route: [[10, 17], [30, 17]], speed: 0.5, pause: 30 }] : []),
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 39, 21, ","); lay(0, 0, 39, 0, "t"); lay(0, 0, 0, 21, "t"); lay(39, 0, 39, 21, "t"); lay(0, 19, 39, 21, "~"); put(19, 0, "^"); put(20, 0, "^");
          lay(19, 1, 20, 4, ":"); [[5, 6], [11, 6], [17, 7], [24, 6], [30, 7], [35, 6], [8, 10], [22, 10], [33, 11]].forEach(([x, y]) => put(x, y, "Y")); put(4, 12, "J"); put(36, 15, "s");
        },
      },
      ts_campo: {
        region: "campo", name: "Il Torneo delle Cento Scuole · Il Campo dei Cento", short: "Il Campo dei Cento", sub: "Il campo del torneo", bg: "ts_campo", time: "giorno", travel: [28, 9],
        w: 30, h: 18, start: [28, 9], items: [[2, 2], [2, 15]],
        areas: [[4, 3, 24, 14, "Il campo"], [0, 0, 29, 17, "Il Campo dei Cento"]], act: { ">": "Torna in piazza" },
        flavor: { K: "La bancarella dei biglietti: «Ingresso libero. Offerta libera. Tifo obbligatorio»." },
        intro: [["voce", "Il Campo dei Cento: erba vera, porte con le reti nuove, una tribunetta di legno dipinta di otto colori. Cinquant'anni fa qui giocavano cento scuole. Oggi otto. Il campo se le ricorda tutte."]],
        npcs: (s) => [...(s === 3 ? [{ id: "ts_gil", at: [18, 9] }] : []), ...(s >= 4 ? [{ id: "ts_ettore", at: [14, 9] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 17, 29, 17, "t"); lay(0, 0, 0, 17, "t"); lay(29, 0, 29, 17, "t"); put(29, 8, ">"); put(29, 9, ">");
          lay(4, 3, 24, 14, "-"); lay(26, 8, 28, 9, ":"); [[6, 1], [12, 1], [18, 1], [24, 1]].forEach(([x, y]) => put(x, y, "b")); put(27, 3, "K");
        },
        decor(g, cx, cy, d) { // le linee del campo e le porte
          g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1.2; g.strokeRect(d.X(4) + 2, d.Y(3) + 2, 21 * 16 - 4, 12 * 16 - 4); g.beginPath(); g.moveTo(d.X(14) + 8, d.Y(3) + 2); g.lineTo(d.X(14) + 8, d.Y(15) - 2); g.stroke(); g.beginPath(); g.arc(d.X(14) + 8, d.Y(9), 20, 0, 7); g.stroke();
          [[d.X(4) - 4, 1], [d.X(25) - 2, -1]].forEach(([x]) => { g.strokeStyle = "#fff"; g.lineWidth = 2; g.strokeRect(x, d.Y(7), 6, 48); g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 0.5; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x, d.Y(7) + i * 8); g.lineTo(x + 6, d.Y(7) + i * 8); g.stroke(); } });
        },
      },
    };
    function match() {
      K.ownMatch(window.__vignette.start, {
        oppStyle: "pressing", title: "Quarti · La Via Lunga – I Gabbiani del Porto", us: "La Via Lunga", actions: 8,
        opp: { name: "I Gabbiani del Porto", color: "#3a6ab8", players: [{ id: "ts_gil", name: "Gil", skin: "#d9a679", hair: "#2a2a2a" }, { name: "Mauro", skin: "#e0b890", hair: "#3a2a1a" }, { name: "Saverio", skin: "#c68642", hair: "#1a1a1a" }] },
        mates: [{ id: "ts_tito", name: "Tito", skin: "#e8b88a", hair: "#3a2a1a" }, { id: "ts_alba", name: "Alba", skin: "#f0d0b0", hair: "#c8642a" }], shirt: "#e83a3a", techniques: K.techs(), bg: "ts_campo",
        intro: "<p>Il primo turno del Torneo delle Cento Scuole. I Gabbiani del Porto pressano alti, come gabbiani su un peschereccio. La Via Lunga ha un panettiere in difesa, una postina all'ala e due gemelli che litigano su chi tira.</p>",
        done: (r) => {
          if (!r.win) return K.scene([["ts_iole", "(fischia) Ci sta. La prima partita la si perde sempre, un po'. Il regolamento del torneo dice che, nei quarti, chi pareggia o perde con onore può chiedere la rivincita. Io la chiedo. Voi?"]], () => K.enterZone("ts_campo"), "ts_campo");
          F.set("tb_q0", "La Via Lunga"); F.set("tb_q2", "Collegio San Biagio"); F.set("tb_q3", "Accademia del Faro"); F.set("ts_m1", r.a + "-" + r.b);
          setStep(N, 4); questDone("ts_quarti"); bond("squadra", 2);
          K.scene([["voce", "Fischio finale. La Via Lunga è in semifinale. Tito solleva Alba, che solleva il pallone, che non solleva nessuno perché è un pallone. I gemelli si abbracciano e poi litigano su chi ha abbracciato per primo."], ["ts_iole", "Il Tiro a Tre. Lo avete fatto. Trent'anni che non lo vedevo. (Si toglie gli occhiali e li pulisce, a lungo.)"], ["voce", "Dall'altra parte del campo, un ragazzo con la fascia da capitano e la maglia blu scuro dell'Accademia del Faro vi ha guardato per tutta la partita. Senza applaudire. Senza sorridere."]], () => K.enterZone("ts_campo"), "ts_campo");
        },
      });
    }
    const talk = {
      ts_iole() {
        const s = S();
        if (s === 0) return say([
          ["ts_iole", "Il Torneo delle Cento Scuole. Lo guardo ogni anno, da qui. Una volta ci portavo i miei ragazzi. Poi la scuola ha chiuso. Poi i ragazzi sono cresciuti. Poi io sono invecchiata. In quest'ordine, più o meno."],
          ["ts_iole", "Tu hai la faccia di uno che vuole giocare. Il torneo è aperto alle scuole calcio, ma il regolamento dice «squadre che rappresentano una scuola». Non dice «scuola calcio». Io ero una maestra. La mia scuola sono io."],
          ["ts_iole", "Ti servono quattro giocatori. Prova con Tito, il panettiere; Alba, la postina; e i gemelli Sabbia, giù in spiaggia. Sono la gente più testarda di Portolungo. Testardi è meglio che bravi."],
        ], () => { setStep(N, 1); K.learnLore("l_torneo"); quest("ts_squadra", "La Via Lunga", "Recluta Tito (panetteria), Alba (ufficio postale) e i gemelli Rocco e Remo (spiaggia)."); done(); });
        if (s === 1) return say([["ts_iole", `Quanti ne hai convinti? ${team()} su 3. Tito si convince col cuore, Alba con i fatti, i gemelli… con la pazienza. Molta.`]]);
        if (s === 2) return ask("ts_iole", "Siete in cinque. Una squadra. (Il fischietto le trema in mano.) Va bene. Va bene. Vi insegno una cosa sola, la più importante: il Tiro a Tre.\n\nTre passaggi di prima, senza guardare, e il terzo tira. Il portiere non sa dove guardare, perché non lo sapete nemmeno voi. Funziona solo se vi fidate. Vi fidate?", [
          { label: "«Ci fidiamo»", sub: "Impara il Tiro a Tre", cls: "hot", fn: () => { F.set("ts_tec_tiro3", true); K.learnLore("l_tiro3"); setStep(N, 3); quest("ts_quarti", "Quarti di finale", "Al Campo dei Cento (a ovest della piazza), contro I Gabbiani del Porto."); bond("squadra", 1); say([["voce", "Per un pomeriggio intero, sotto i portici, la Via Lunga prova il Tiro a Tre. La prima volta Tito passa a un piccione. La decima volta il pallone entra. La ventesima, entra senza che nessuno capisca come."], ["ts_iole", "Ecco. Adesso, in partita, quando lo Spirito della squadra è pieno, lo potete fare. Una volta. Poi bisogna ricaricarlo, come il forno di Tito."]]); } },
          { label: "Un momento", fn: done },
        ], "ts_piazza");
        return say([["ts_iole", "Andate. Il campo è a ovest. Io arrivo. Io arrivo sempre. Sono lenta, ma arrivo."]]);
      },
      ts_tito() {
        if (F.is("ts_tito_ok")) return say([["ts_tito", "Ho sfornato il pane della squadra: pagnotte a forma di pallone. Le ho fatte anche a forma di coppa. Per scaramanzia, quelle le ho mangiate."]]);
        if (S() < 1) return say([["ts_tito", "Buongiorno! Pane, focaccia, pizza? Il pallone no, quello non lo faccio. Per ora."]]);
        return ask("ts_tito", "Giocare? Io? Alla mia età, con questa pancia? (Si guarda la pancia, con affetto.) Però… da ragazzo giocavo in porta. Poi papà mi ha messo al forno. Il forno non perdona: se ti distrai, brucia tutto. In campo succede lo stesso?", [
          { label: "«In campo si brucia solo se si ha paura»", sub: "Convincilo con il cuore", fn: () => { F.set("ts_tito_ok", true); bond("squadra", 2); say([["ts_tito", "…Si brucia solo se si ha paura. (Si toglie il grembiule, ci pensa, se lo rimette.) Il grembiule lo tengo. Ma ci sto. Gioco dietro: lì nessuno passa. Neanche alle tre del mattino."]], () => { checkTeam(); done(); }); } },
          { label: "«Ti porti il pane per l'intervallo»", sub: "Convincilo con la pancia", fn: () => { F.set("ts_tito_ok", true); bond("squadra", 1); say([["ts_tito", "Il pane per l'intervallo. Che idea. Che bella idea! Ci sto, ci sto. Faccio anche la focaccia per gli avversari: così corrono meno."]], () => { checkTeam(); done(); }); } },
        ], "ts_piazza");
      },
      ts_alba() {
        if (F.is("ts_alba_ok")) return say([["ts_alba", "Corro in fascia come in bicicletta: dritta, veloce, e se c'è un cane abbaio prima io."]]);
        if (S() < 1) return say([["ts_alba", "Posta? No, oggi niente per lei. Domani forse. La posta è come il calcio: arriva quando meno te l'aspetti."]]);
        if (!F.is("ts_lettere")) return ask("ts_alba", "Giocare a calcio? Ho tre lettere ancora da consegnare e la bicicletta col copertone a terra. Facciamo così: se le consegni tu, io ho tempo per allenarmi. Sono per il vigile, la signora Greta e nonno Pino. Girano per la piazza: non stanno mai fermi, eh.", [
          { label: "«Dammi le lettere»", sub: "Consegnale ai tre che girano per la piazza", cls: "hot", fn: () => { F.set("ts_lettere", true); quest("ts_posta", "Le lettere di Alba", "Consegna le tre lettere al vigile, alla signora Greta e a nonno Pino (girano per la piazza)."); done(); } },
          { label: "Più tardi", fn: done },
        ], "ts_piazza");
        if (letters() < 3) return say([["ts_alba", `Lettere consegnate: ${letters()} su 3. Sono in giro per la piazza. Il vigile fa il giro del Tabellone, la signora Greta si perde vicino alla panetteria, nonno Pino va su e giù dal lungomare.`]]);
        F.set("ts_alba_ok", true); questDone("ts_posta"); bond("squadra", 1);
        return say([["ts_alba", "Tutte e tre? In mezz'ora? Hai le gambe da postina. Va bene: gioco. Ma all'ala, e nessuno mi dice dove correre. So sempre dove andare: è il mio lavoro."]], () => { checkTeam(); done(); });
      },
      ts_rocco() { return gemelli(); }, ts_remo() { return gemelli(); },
      ts_vigile() { return letter("ts_l_vigile", "ts_vigile", "Una lettera? Per me? (La apre.) È… una multa. Che ho fatto io. A me stesso. Per divieto di sosta. Era parcheggiata storta, la mia bicicletta. Giusto così.", "Fischio alle biciclette, sì. A tutte. Il regolamento dice di fischiare a quelle in divieto. Io fischio a tutte per non fare preferenze."); },
      ts_turista() { return letter("ts_l_turista", "ts_turista", "Per me? Da casa mia! È mio marito: dice che il gatto sta bene e che il basilico è morto. Ogni estate il basilico muore. Ogni estate il gatto sta bene. Grazie, caro!", "Mi sono persa! Che bello. Sono sempre qui, in questo punto, quando mi perdo. È il mio punto preferito di Portolungo."); },
      ts_pescatore() { return letter("ts_l_pescatore", "ts_pescatore", "Una lettera? Per me? (Legge, si commuove.) È mio nipote. Gioca nella Scuola dei Pescatori. Mi chiede se vado a vederlo. Ci vado sì. Ci vado col cappello buono.", "Il tonno, quella volta, era grande così. (Allarga le braccia.) No, così. (Le allarga di più.) Era il '68."); },
      ts_gil() {
        if (S() === 3) return ask("ts_gil", "Siete voi, quelli senza scuola? Bene. I Gabbiani del Porto non perdono contro un panettiere. Senza offesa, Tito. Il tuo pane è il migliore della città. Ma oggi lo mangiamo noi.", [{ label: "Gioca il quarto di finale", sub: "Vignette · tre corsie, finte e tecniche", cls: "hot", fn: match }, { label: "Un momento", fn: done }], "ts_campo");
        return say([["ts_gil", "Bella partita. Il pane di Tito l'abbiamo mangiato lo stesso, dopo. Era ancora caldo."]]);
      },
      ts_ettore() {
        if (S() === 4) return ask("ts_ettore", "Ettore Vela, Accademia del Faro. Ho guardato tutta la partita. Il vostro Tiro a Tre è impreciso, i vostri gemelli non sanno chi sono, e il vostro portiere fa il panettiere.\n\n…Però ridete. In campo. Tutti. Non l'avevo mai visto fare. Perché?", [
          { label: "«Perché ci divertiamo. Prova anche tu»", sub: "Gli tendi la mano", big: true, fn: () => endCh("mano") },
          { label: "«Ci vediamo in finale, capitano»", sub: "Rispetto da rivali", big: true, fn: () => endCh("rivali") },
          { label: "«Perché vinceremo noi»", sub: "La Via Lunga si carica", big: true, fn: () => endCh("sfida") },
        ], "ts_campo");
        return say([["ts_ettore", "Ci vediamo sul campo."]]);
      },
    };
    function letter(flag, who, ok, idle) {
      if (F.is("ts_lettere") && !F.is(flag) && S() === 1) { F.set(flag, true); K.SFX.ding(); return say([[who, ok], ["voce", `Lettere consegnate: ${letters()} su 3.`]]); }
      return say([[who, idle]]);
    }
    function gemelli() {
      if (F.is("ts_gemelli_ok")) return say([["ts_rocco", "Io gioco a destra, lui…"], ["ts_remo", "…a sinistra. No, a destra."], ["ts_rocco", "Sei tu a sinistra."], ["ts_remo", "Sono Rocco, sono a destra."], ["ts_rocco", "Rocco sono io!"]]);
      if (S() < 1) return say([["ts_rocco", "Buongiorno! Bagno vietato oltre…"], ["ts_remo", "…le boe rosse. Gialle. Rosse."]]);
      return ask("ts_rocco", "(Parlano a turno, in perfetta sincronia.) Giocare nella Via Lunga? Ci stiamo, ci stiamo! Ma prima un indovinello: chi di noi due è Rocco? Se indovini, giochiamo. Se sbagli… giochiamo lo stesso, ma ti prendiamo in giro per tutta l'estate.", [
        { label: "«Tu sei Rocco»", sub: "Indica quello che ha parlato per primo", fn: () => { F.set("ts_gemelli_ok", true); bond("squadra", 1); say([["ts_rocco", "…Sbagliato! Io sono Remo."], ["ts_remo", "No, tu sei Rocco. Io sono Remo."], ["ts_rocco", "Ah, già. Giusto! Hai indovinato. Ci stiamo!"]], () => { checkTeam(); done(); }); } },
        { label: "«Non importa. Mi servite tutti e due»", sub: "Lascia perdere l'indovinello", fn: () => { F.set("ts_gemelli_ok", true); bond("squadra", 2); say([["ts_remo", "…Non importa?"], ["ts_rocco", "Non importa! Nessuno ce l'aveva mai detto. Di solito importa tantissimo."], ["ts_remo", "Ci stiamo. Tutti e due. In difesa, uno accanto all'altro: così nessuno capisce chi deve marcare."]], () => { checkTeam(); done(); }); } },
      ], "ts_spiaggia");
    }
    function endCh(kind) {
      if (kind === "mano") bond("rivale", 2); if (kind === "rivali") { bond("rivale", 1); bond("squadra", 1); } if (kind === "sfida") { bond("squadra", 2); bond("rivale", -1); }
      F.set("ts_maglia", true); const msg = K.reward("ch1", { coins: 70, cos: ["ts_c1"] }); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        mano: [["ts_ettore", "(guarda la tua mano, a lungo) Divertirsi. Nell'Accademia è vietato dal regolamento interno, articolo 4. …Ci penserò. Non stringerla ancora: me la ricordo."]],
        rivali: [["ts_ettore", "In finale. (Per la prima volta, un mezzo sorriso.) Ci arrivate? Allora sarà una bella finale."]],
        sfida: [["ts_ettore", "Vincerete voi. (Si gira e se ne va.) È la prima volta che qualcuno me lo dice in faccia. Interessante."], ["ts_tito", "Ho detto io «vinceremo noi»? No, l'hai detto tu. Però mi è piaciuto. Brucio di entusiasmo. Come il pane, ma bene."]],
      }[kind];
      K.scene([...lines, ["voce", `Quella sera, in piazza, qualcuno scrive col gesso sul Tabellone: «LA VIA LUNGA» sopra la linea della semifinale. <b>Fine del Capitolo 1.</b> ${msg.join(" · ")}`]], () => K.openMain(), "ts_piazza");
    }
    const obj = {
      "ts_piazza:P": () => say([["voce", K.bracketHtml()]]),
      "ts_piazza:<": () => go("ts_campo", 28, 9), "ts_campo:>": () => go("ts_piazza", 1, 12),
      "ts_piazza:v": () => go("ts_spiaggia", 20, 2), "ts_spiaggia:^": () => go("ts_piazza", 20, 24),
    };
    return { n: N, title: "L'iscrizione", sub: "La piazza del Tabellone, la Via Lunga, il quarto di finale", goal, start: "ts_piazza", introBg: "ts_porto", zones, talk, obj,
      intro: () => [["voce", "Portolungo, luglio. Il mare è fermo, le cicale no. In piazza montano il Tabellone del Torneo delle Cento Scuole: otto squadre, otto scuole calcio, una coppa d'argento che ogni anno vince l'Accademia del Faro."], ["voce", "Il Campione è in città per l'estate. Nessuna squadra, nessuna scuola calcio. Solo un pallone sotto il braccio e la voglia di iscriversi a qualcosa."]] };
  }
  boot();
})();
