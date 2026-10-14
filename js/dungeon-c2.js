// js/dungeon-c2.js - DUNGEON DI FINE STAGIONE · Capitolo 2 «Le Cisterne»
// Il Piano 2: acqua ferma, archi verdi, Meda con gli occhiali da sole, Cerbero in porta. Qui l'Ipogeo comincia a raccontare da dove viene
// (prima svolta), e Ruggine dovrà decidere se ascoltare.
(function () {
  "use strict";
  function boot() { const D = window.__dungeon; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N), morti = () => F.get("dg_morti", 0) | 0;
    K.cast("dg_meda", { shape: "ombra", acc: ["occhiali"], name: "Meda, la Medusa Mediana", tag: "", skin: "#3a8a6a", eye: "#d8fff0", bg: ["#0a1a1a", "#4ab87a"], shirt: "#2a6a5a", num: "8" },
      "Mediana, nel senso che gioca a centrocampo. Porta gli occhiali da sole per non pietrificare gli amici, e ha imparato a passare la palla senza guardare. Gentile, curiosa, molto ordinata: non sopporta le statue fuori posto.");
    K.cast("dg_cerbero", { shape: "cane", name: "Cerbero, il Portiere", tag: "", hair: "#2a1a14", skin: "#8a3a2a", eye: "#ffd23f", bg: ["#0a1a1a", "#c83a2a"], shirt: "#6a1a14", num: "1" },
      "Tre teste, un paio di guanti per testa, una sola porta. Parlano tutte insieme e non sono mai d'accordo su chi ha parato. Quella di mezzo è la più saggia; quella a sinistra, la più affamata.");
    K.cos("dg_c2", { kind: "shirt", label: "Maglia delle Cisterne", val: "#2a7a6a", from: "Capitolo 2 di Dungeon di Fine Stagione" });
    K.lore("l_cisterne", { t: "Le Cisterne del Brindisi", d: "Un tempo qui si portavano i bicchieri della festa dopo la finale. L'acqua è rimasta. I bicchieri anche, sul fondo, tutti pieni." });
    K.lore("l_minuto", { t: "Il minuto che manca", d: "Nel Registro, alla pagina del Torneo, qualcuno ha scritto in piccolo: «Finale: 90 minuti giocati, 91 sospeso». Nessuno sa cosa sia successo al novantunesimo." });
    const goal = (s) => ({
      0: "Il Campo Base. Il Mister ha qualcosa da dire sulle Cisterne.",
      1: "Scendi al Piano 2 e cerca Meda, la Medusa Mediana.",
      2: "Piano 2: sciogli i tre sigilli e supera la Porta Grande.",
      3: "Torna al Campo Base: Ruggine e il Mister vogliono parlarti.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");

    const p2 = K.pianoZone(2, { spec: { itemCos: "dg_runa", items: [[24, 3], [3, 16], [20, 16]], areas: [[1, 1, 26, 17, "Le Cisterne del Brindisi"]], npcs: () => [{ id: "dg_meda", at: [11, 12] }],
      intro: [["voce", "Le Cisterne del Brindisi: grandi volte di pietra con l'acqua ferma, un'acqua così limpida che sembra più profonda del pavimento. Sul fondo, a perdita d'occhio, bicchieri pieni. Nessuno ha mai osato bere."]] } });

    K.hooks[2] = {
      pre: (go) => F.is("dg_cerb") ? go() : K.scene([["dg_cerbero", "(Tre teste, in coro, con tre voci diverse.) «BENVENUTO!» «Benvenuto, benvenuto.» «Ha detto benvenuto?»"], ["dg_meda", "[pensa] (Da dietro un pilastro, con gli occhiali.) Cerbero para tutto. Non per bravura: per vocazione. Le teste litigano su chi ha preso la palla, e intanto la palla è già in rete. Non guardare le sue tre paia di occhi insieme."]], () => { F.set("dg_cerb", true); go(); }, "dg_p2"),
      won: (r, d) => S() >= 3 ? K.scene([["dg_cerbero", "(Le tre teste, a turno.) «Ancora!» «Complimenti.» «Era mia, quella palla.»"]], () => K.pianoDone(2), "dg_p2") : K.scene([["dg_cerbero", "(Le tre teste si guardano, poi guardano il pallone in rete.) «Chi era in porta?» «Io.» «Anch'io.» «Io no, io dormivo.»"], ["dg_meda", "[felice] (Si toglie gli occhiali e li rimette in fretta.) Bravissimo. Hai trovato il punto morto delle tre teste. Adesso, vieni: l'acqua vuole farti vedere una cosa."]], () => cisterna(), "dg_p2"),
      lost: () => [["dg_cerbero", morti() > 1 ? "(Tre teste, un sospiro.) «Eccolo di nuovo.» «Gli teniamo il posto.» «Non è un posto, è una porta.»" : "(Tre teste, un lungo applauso.) «Bella partita.» «Bel tiro.» «Chi ha parato?»"]],
    };
    // la prima svolta: l'acqua ricorda il novantunesimo minuto
    function cisterna() {
      K.scene([["voce", "L'acqua delle Cisterne si fa trasparente, come un vetro. Sul fondo, tra i bicchieri, si vede un campo vero: una finale, un rigore, un pallone fermo sul dischetto."], ["dg_meda", "[triste] Trent'anni fa: ultima azione della finale. Rigore all'ultimo minuto, tirato dal capitano. Lo vedi bene? (Pausa.) Il capitano lo calcia alto. L'arbitro guarda l'orologio. E poi… non fischia."], ["dg_meda", "L'Ipogeo non è un torneo. È quel minuto: il novantunesimo, rimasto aperto. Ogni stanza è un secondo che nessuno ha chiuso. Il capitano è sceso a cercarlo, e non è più risalito."], ["dg_fiamma", "[pensa] Il capitano. Quello con il cappellino. Quello che ci guarda dal tavolo, al Campo Base, e dice che non gli interessa."], ["voce", "Un nome affiora a pelo d'acqua, sul bordo di un bicchiere: RUGGINE."]],
        () => { K.learnLore && K.learnLore("l_minuto"); ask("dg_meda", "(Si rimette gli occhiali.) Tocca a te decidere cosa farne. Glielo dici adesso, o aspetti che sia lui a chiedere?", [
          { label: "«Glielo dico io, domani»", sub: "Aspetta il momento giusto", big: true, fn: () => scelta("attesa") },
          { label: "«Glielo dico subito»", sub: "Ha diritto di saperlo", big: true, fn: () => scelta("subito") },
        ], "dg_p2"); }, "dg_p2");
    }
    function scelta(kind) {
      F.set("dg_verita2", kind); bond("fiamma", 1);
      K.scene(kind === "subito" ? [["dg_meda", "[felice] Allora fai in fretta, prima che l'acqua si ricordi anche questo. (Ti guarda senza guardarti.) Sei coraggioso. O hai fretta di cambiare discorso."], ["dg_fiamma", "[pensa] Io avrei aspettato. Ma sono una fiamma: non so aspettare."]]
        : [["dg_meda", "[pensa] Aspettare è una forma di rispetto. O di paura: dipende da chi lo fa. (Sorride appena.) Io, per sicurezza, scelgo di non decidere. Funziona sempre."], ["dg_fiamma", "[triste] Un'altra notte, allora. Peccato: ho già detto «Ruggine» ad alta voce quattro volte."]],
      () => { setStep(N, 3); questDone("dg_c2q"); K.pianoDone(2); }, "dg_p2");
    }
    function brindisi() { // la partita secondaria: il motore si sceglie
      const after = (r) => K.scene([["dg_meda", r && r.win ? "[ride] Complimenti! Sai che non ti ho mai guardato negli occhi? Vale come cortesia. E come tattica." : "[felice] Pareggio morale! Nessuno si è pietrificato. È già un risultato."]], () => K.enterZone("dg_p2"), "dg_p2");
      ask("dg_meda", "(Da dietro gli occhiali.) Ti va un brindisi di allenamento? Io, te, e un'Idra che dice di essere neutrale. Ti avviso: non si guarda mai negli occhi. Come la giochiamo?", [
        { label: "Nelle Stanze dell'Ipogeo", sub: "La partita della saga: una stanza di prova", cls: "hot", fn: () => K.dungeonMatch({ kind: "idra", intro: "Una stanza di prova, con Meda a bordo campo." }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "dg_brindisi", alt: "az,cage,hd", force: false, oppTeam: "L'Idra e i suoi", oppColor: "#7ac84a", us: "Le Cisterne", homeKit: ["#2a7a6a", "#0a1a1a"], mate: "Meda", squad: ["Meda", "Fiamma", "Ruggine"], chap: "Dungeon di Fine Stagione · Il brindisi", bg: "dg_p2", oppNames: ["Testa Uno", "Testa Due", "Testa Tre", "Testa Quattro", "Testa Cinque"], intro: "Alle Cisterne, con i bicchieri pieni sul fondo.", done: after }) },
        { label: "Dopo", fn: done },
      ], "dg_p2");
    }

    const talk = {
      dg_mister() {
        const s = S();
        if (s === 0) return K.scene([["dg_mister", "(Ti guarda a lungo. Poi guarda Fiamma. Poi di nuovo te.) Hai passato il Primo Piano e hai ancora due gambe. Bene. Sotto ci sono le Cisterne. Lì c'è una che ti aspetta: porta gli occhiali da sole in una grotta. Non fidarti dei suoi consigli di moda: fidati dei passaggi."], ["dg_fiamma", "[felice] Meda! Mi ha insegnato a non bollire l'acqua. Io le ho insegnato a non pietrificare il fuoco. Siamo pari."]], () => { setStep(N, 1); quest("dg_c2q", "Le Cisterne", "Scendi al Piano 2: cerca Meda, poi supera la Porta Grande."); done(); }, "dg_campo");
        if (s === 3 && F.is("dg_rugg2")) return finish();
        if (s === 3) return say([["dg_mister", "(Ha capito tutto dalla tua faccia.) Parla con Ruggine. Io intanto metto una pentola sul fuoco: le cose difficili si dicono meglio a stomaco pieno."]]);
        return K.PASS;
      },
      dg_ruggine() {
        const s = S();
        if (s === 3 && !F.is("dg_rugg2")) {
          const subito = F.get("dg_verita2", "") === "subito";
          return K.scene([["dg_ruggine", subito ? "(Alza gli occhi dal pallone. Per la prima volta.) Hai una faccia da chi ha letto una cosa su di me. Parla." : "(Non alza gli occhi.) Hai un'aria da chi vuole dirmi qualcosa e non sa come. Meglio dirlo in fretta, tanto a me gli anni passano anche se mi fermo."]], () => ask("dg_ruggine", "Cosa dici a Ruggine?", [
            { label: "Gli racconti del rigore", sub: "Con calma, senza giudicare", big: true, fn: () => rug(true) },
            { label: "Gli chiedi del rigore", sub: "Dritto, come un tiro", big: true, fn: () => rug(false) },
          ], "dg_campo"), "dg_campo");
        }
        if (s === 0 || s === 1 || s === 2) return K.PASS;
        return say([["dg_ruggine", "(Ha lasciato il pallone sul tavolo. È già un cambiamento.) Sono ancora qui. Cosa pretendi, i fuochi d'artificio?"]]);
      },
      dg_meda() {
        const s = S();
        if (s <= 1) { if (s === 1) { setStep(N, 2); return K.scene([["dg_meda", "[felice] (Dietro un pilastro, con gli occhiali sul naso.) Sei tu. Fiamma mi ha parlato di te. Sono Meda. Gioco a centrocampo. Non guardarmi negli occhi: è una cortesia. Le Cisterne sono la parte più bella dell'Ipogeo, se non si conta il soffitto."], ["dg_meda", "L'acqua è ferma, ma non per sempre. Fra poco ti mostrerà qualcosa. Prima sciogli i sigilli: le stanze sono più generose se le ascolti."]], () => done(), "dg_p2"); } }
        if (s === 2) return brindisi();
        return say([["dg_meda", "[ride] Ho tolto gli occhiali. Poi li ho rimessi. Sono comunque un passo avanti."]]);
      },
      dg_fiamma() { return K.PASS; },
    };
    function rug(gentle) {
      F.set("dg_rugg2", gentle ? 1 : 2); bond("ruggine", gentle ? 2 : 1);
      K.scene(gentle ? [["dg_ruggine", "(Rimane immobile. Poi si toglie il cappellino e lo tiene fra le mani.) L'ho sempre saputo. Non lo volevo sapere. Il pallone era pesante, quella sera. Sembrava bagnato."], ["dg_ruggine", "(Poi, piano:) Grazie di averlo detto piano. Quando lo racconti piano, fa meno rumore."]]
        : [["dg_ruggine", "(Ti guarda dritto. Poi si siede, pesante.) Sì. L'ho tirato io. Alto, sopra la traversa, sopra lo stadio, sopra tutti. (Pausa lunga.) Una cosa del genere dovrebbe fare più rumore. Invece è stato silenzio. Il peggiore che abbia mai sentito."]],
      () => K.scene([["dg_mister", "(Da lontano, senza girarsi.) Ora sai perché ho tenuto il fischietto. Lo sa anche lui, da sempre. Per questo scende."]], () => done(), "dg_campo"), "dg_campo");
    }
    function finish() {
      questDone("dg_c2q");
      const msg = K.reward("c2:dg", { coins: 80, cos: ["dg_c2"] }); finishChapter(N, F.get("dg_rugg2", 0) === 1 ? "calma" : "dritto"); setStep(N, 5);
      K.scene([["dg_mister", "Il capitano ha ascoltato. Questo, qui sotto, è un piccolo miracolo: non succedeva da trent'anni. Sotto le Cisterne c'è la Tribuna d'Oro, dove il Torneo vero finisce. Ti aspetta qualcuno che non voglio nominare ad alta voce."], ["dg_fiamma", "[pensa] Cenere. L'hai nominato tu, Mister. Ad alta voce. Con la lettera maiuscola."], ["dg_mister", "(Silenzio. Poi, piano:) Appunto."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La Tribuna d'Oro».`]], () => K.openMain(), "dg_campo");
    }
    return { n: N, title: "Le Cisterne", sub: "Il Piano 2, Meda, Cerbero e un minuto sospeso", goal, start: "dg_campo", introBg: "dg_p2", zones: { dg_p2: p2 }, talk,
      intro: () => [["voce", "<b>CAPITOLO 2</b>. Sotto il Primo Piano la pietra diventa umida e l'aria sa di cantina e di cose rimaste a bagno. Le Cisterne non sono sul tabellone. Ma il Mister ha già messo la pentola sul fuoco."]] };
  }
  boot();
})();
