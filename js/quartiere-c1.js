// js/quartiere-c1.js - GLI STRAORDINARI DI QUARTIERE · Capitolo 1 «Il garage dei supereroi»
// Ponterotto: canali, panni stesi, un campetto di terra in fondo alla via. Un giorno arrivano i Geometri con i loro metri gialli.
// Nel garage di Nonna Ines, fra i ferri da stiro, scopri il tuo potere: copiare quello degli altri. Ti serve una squadra.
(function () {
  "use strict";
  function boot() { const D = window.__quartiere; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("sq_ines", { acc: ["occhiali"], name: "Nonna Ines, la calamita", tag: "gray", hair: "#c8c8c8", style: "bun", skin: "#e0b890", eye: "#3a3a3a", bg: ["#1e1432", "#c83a3a"], shirt: "#c83a3a" },
      "Ottantadue anni, un garage pieno di ferri da stiro e un potere: tutto ciò che è di ferro le corre incontro. Per questo non va mai in ferramenta. Dice che i supereroi, a Ponterotto, ci sono sempre stati: solo che nessuno li aveva mai messi insieme.");
    K.cast("sq_brina", { streak: "#9be2ff", acc: ["grembiule"], name: "Brina, la gelataia", tag: "", hair: "#e8f4ff", style: "twintails", skin: "#f4dcc8", eye: "#3a8ac8", bg: ["#1e1432", "#7ad8ff"], shirt: "#7ad8ff" },
      "Ha la gelateria sul canale e le mani sempre fredde: quello che tocca, gela. D'estate è la persona più amata del quartiere. D'inverno, la più evitata.");
    K.cast("sq_soffio", { acc: ["cuffie"], name: "Soffio, il trombettista", tag: "", hair: "#1a1a1a", style: "afro", skin: "#c68642", eye: "#2a1a0a", bg: ["#1e1432", "#c8f0e0"], shirt: "#3a8a6a" },
      "Suonava la tromba nella banda di Ponterotto finché, un giorno, ha soffiato così forte da far volare il direttore fino al campanile. Adesso suona da solo, sull'isoletta, con la tromba tappata.");
    K.cast("sq_gommo", { beard: "incolta", acc: ["cappellino"], name: "Gommo, l'idraulico elastico", tag: "", hair: "#3a2a1a", style: "messy", skin: "#e8c4a0", eye: "#3a3a3a", bg: ["#1e1432", "#ff8ac8"], shirt: "#3a5aa8" },
      "L'idraulico del quartiere: arriva nei tubi più stretti e sotto i lavandini più storti, perché si allunga come una gomma. Non ha mai perso una chiave inglese. Le recupera tutte, anche dal terzo piano.");
    K.cast("sq_geometra", { acc: ["casco"], name: "Il Capo dei Geometri", tag: "", hair: "#2a2a2a", style: "ordinato", skin: "#f0d0b0", eye: "#3a3a3a", bg: ["#1e1432", "#7a7a8a"], shirt: "#ffd23f" },
      "Gilet giallo, metro giallo, casco giallo. Misura tutto quello che vede e lo scrive su un blocco. Lavora per il Dottor Cemento. Ha misurato anche te: sei «un metro e settanta, inutile».");
    K.cos("sq_c1", { kind: "shirt", label: "Maglia degli Straordinari", val: "#ff5a8a", from: "Capitolo 1 di Gli Straordinari di Quartiere" });
    K.cos("sq_fumetti1", { kind: "acc", label: "Fumetto arrotolato in tasca", val: "taccuino", from: "Trova i fumetti perduti di Ponterotto" });
    K.lore("l_copione", { t: "Il Copione", d: "Il tuo potere: tocchi la spalla di un amico e per un po' fai quello che fa lui. Ghiaccio, vento, elastico, calamita, fuoco. Uno alla volta. Si cambia dal menu, con «Cambia potere»." });
    K.lore("l_combo", { t: "Combo di Squadra", d: "In partita, a ogni turno, scegli uno o due eroi. In coppia i poteri si combinano: le combo si scoprono provandole. Chi agisce resta stanco per un turno. In alto c'è la mossa annunciata dall'avversario: scegli la combo che la batte." });
    const team = () => ["ghiaccio", "vento", "elastico"].filter((p) => F.is("sq_in_" + p)).length;
    const goal = (s) => ({
      0: "Ponterotto. Nel garage col portone rosso c'è una nonna che ti cerca.",
      1: `Una squadra (${team()}/3): Brina alla gelateria, Soffio sull'isoletta oltre il canale, Gommo dietro il muro di foglie. Copia i poteri per arrivarci.`,
      2: "I Geometri sono al campetto. Il loro capo ha un metro giallo e nessuna fretta.",
      3: "Avete battuto i Geometri. Nonna Ines vuole parlare di maschere.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      sq_quartiere: {
        region: "quartiere", name: "Gli Straordinari di Quartiere · Ponterotto", short: "Ponterotto", sub: "Il canale, il garage, la gelateria, l'isoletta", bg: "sq_quartiere", time: "giorno", travel: [5, 19],
        w: 34, h: 24, start: [5, 19], itemCos: "sq_fumetti1", items: [[1, 8], [22, 2], [31, 21]],
        areas: [[14, 1, 23, 22, "L'isoletta"], [25, 1, 32, 22, "Il cortile di Gommo"], [0, 0, 33, 23, "Ponterotto"]],
        flavor: { t: "Un fico. Ci si arrampicano i bambini, i gatti e, una volta, Gommo.", l: "Un lampione con tre adesivi: «NO AL PARCHEGGIO», «SÌ AL CAMPETTO», «BRINA TI AMO»." },
        intro: [["voce", "Ponterotto: un quartiere di canali, panni stesi da una finestra all'altra, una radio che canta sempre la stessa canzone. In fondo alla via c'è il campetto di terra dove tutti, prima o poi, hanno giocato."], ["voce", "Stamattina, al campetto, ci sono uomini col gilet giallo e un metro lunghissimo. Misurano. Scrivono. Sorridono come chi sa una cosa che tu non sai."]],
        npcs: (s) => [{ id: "sq_brina", at: F.is("sq_in_ghiaccio") ? [9, 18] : [8, 14] }, { id: "sq_soffio", at: F.is("sq_in_vento") ? [10, 18] : [19, 10] }, { id: "sq_gommo", at: F.is("sq_in_elastico") ? [8, 19] : [29, 12] }, ...(s >= 2 && s <= 3 ? [{ id: "sq_geometra", at: [6, 9] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a"); lay(0, 23, 33, 23, "a");
          lay(1, 17, 11, 21, ":"); lay(1, 11, 11, 11, ":"); lay(6, 11, 6, 17, ":");
          lay(12, 1, 13, 22, "w"); lay(24, 1, 24, 22, "J");
          lay(15, 9, 22, 11, ":"); lay(26, 11, 32, 13, ":");
          house(2, 2, 6, 4, { door: [4, 5], roof: "#c83a3a", wall: "#e8a87a", rr: 2, enter: { to: "sq_garage", at: [7, 9] } });
          house(2, 13, 5, 3, { door: [4, 15], roof: "#7ad8ff", wall: "#f4f0e4", rr: 1, enter: "La gelateria di Brina: dodici gusti, tutti un po' troppo freddi. Il gusto del giorno è «Canale», azzurro, e sa di menta." });
          house(16, 3, 5, 3, { door: [18, 5], roof: "#3a8a6a", wall: "#e8dcc8", rr: 1, enter: "La casetta di Soffio sull'isoletta: una tromba appesa al muro con un tappo di sughero, spartiti ovunque, una finestra sempre aperta. Fuori, il vento fa girare un mulinello." });
          house(27, 3, 5, 4, { door: [29, 6], roof: "#3a5aa8", wall: "#d8dce8", rr: 2, enter: "L'officina di Gommo: tubi, rubinetti, una vasca da bagno piena di chiavi inglesi. Sul muro una foto: Gommo che si allunga dal primo al terzo piano per salvare un gatto." });
          [[9, 3], [10, 7], [16, 15], [21, 19], [27, 18], [31, 16]].forEach(([x, y]) => put(x, y, "t")); [[8, 13], [20, 14]].forEach(([x, y]) => put(x, y, "l")); put(3, 19, "s");
        },
      },
      sq_garage: {
        interior: true, region: "casa", name: "Gli Straordinari di Quartiere · Il garage di Nonna Ines", short: "Il garage", sub: "Ferri da stiro, una lavagna, il quartier generale", bg: "sq_garage", w: 16, h: 12, start: [7, 9], outside: ["sq_quartiere", 4, 6],
        act: { L: "Guarda gli scaffali", T: "Guarda il tavolo", v: "Esci" },
        flavor: { L: "Ferri da stiro: centoquarantadue, in fila per epoca. Il più vecchio è del 1890. Si muovono un po' quando Nonna Ines passa.", T: "Un tavolo da ping pong diventato quartier generale: una mappa del quartiere, cinque bicchieri, una lavagna con scritto «SQUADRA?»." },
        intro: [["voce", "Il garage di Nonna Ines: odore di olio e di caffè. Cento ferri da stiro appesi ai muri, tutti girati verso di lei, come girasoli."]],
        npcs: () => [{ id: "sq_ines", at: [7, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(1, 1, 14, 1, "L"); lay(5, 6, 10, 6, "T"); },
      },
    };
    function matchGeometri() {
      K.combo({ title: "Combo di Squadra · Al campetto contro i Geometri", oppStyle: "difensiva", minutes: 60, heroes: K.squadra(["scatto", "ghiaccio", "vento", "elastico"]),
        opp: { name: "I Geometri", color: "#ffd23f", players: [{ name: "Il Capo", skin: "#f0d0b0", hair: "#2a2a2a" }, { name: "Squadra", skin: "#d9a679" }, { name: "Livella", skin: "#e8c4a0" }], keeper: { name: "Il Metro" } },
        intro: "<p>I Geometri giocano <b>chiusi</b>: muri e trappole. Prova le coppie: ghiaccio e vento, scatto e vento, elastico e ghiaccio… Le combo nuove finiscono nel Libro.</p>", winTitle: "IL CAMPETTO È ANCORA NOSTRO!" }, (r) => {
        if (!r.win) return K.scene([["sq_geometra", "[furbo] (Scrive sul blocco.) «Squadra: improbabile». Ripassate quando volete. Noi intanto misuriamo."]], () => K.enterZone("sq_quartiere"), "sq_quartiere");
        setStep(N, 3); K.learnLore("l_combo"); bond("quartiere", 2);
        K.scene([["sq_geometra", "[sorpreso] (Il metro gli si riavvolge in faccia.) Una gelataia, un trombettista, un idraulico e… un ragazzo che fa tutto. (Si sistema il casco.) Il Dottor Cemento non sarà contento. Per niente."], ["voce", "I Geometri se ne vanno, lasciando a terra un foglio: «PROGETTO: PARCHEGGIO PONTEROTTO. Firmato: Dott. C.»"]], () => K.enterZone("sq_quartiere"), "sq_quartiere");
      });
    }
    function gelati() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["sq_brina", r && r.win ? "[felice] Gelato gratis per tutti! (Lo congela nelle mani.) Oh. Gelato duro per tutti." : "[ride] Avete perso, ma col gelato si perde meglio."]], () => K.enterZone("sq_quartiere"), "sq_quartiere");
      ask("sq_brina", "La sfida dei gelati: chi perde offre i coni a tutto il quartiere. Contro i ragazzi del bar. Come la giochiamo?", [
        { label: "A combo", sub: "Combo di Squadra · la partita della saga", cls: "hot", fn: () => K.combo({ title: "Combo di Squadra · La sfida dei gelati", oppStyle: "equilibrata", minutes: 45, heroes: K.squadra(["scatto", "ghiaccio", "vento", "elastico"].filter((p) => p === "scatto" || F.is("sq_in_" + p))), opp: { name: "I ragazzi del bar", color: "#8a5a3a", players: [{ name: "Caffè" }, { name: "Cornetto" }], keeper: { name: "Il barista" } } }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "sq_gelati", alt: "az,cage,hd", force: false, oppTeam: "I ragazzi del bar", oppColor: "#8a5a3a", us: "Gli Straordinari", homeKit: ["#ff5a8a", "#ffd23f"], mate: "Brina", squad: ["Brina", "Soffio", "Gommo"], chap: "Gli Straordinari di Quartiere · La sfida dei gelati", bg: "sq_quartiere", oppNames: ["Caffè", "Cornetto", "Ginseng", "Tramezzino", "Il barista"], intro: "Al campetto di Ponterotto, per un cono gelato.", done: after }) },
        { label: "Dopo", fn: done },
      ], "sq_quartiere");
    }
    function check() { if (team() >= 3 && S() === 1) { setStep(N, 2); questDone("sq_squadra"); K.refreshZone(); say([["voce", "La squadra è fatta: una gelataia, un trombettista, un idraulico, una nonna e te. In fondo alla via, il Capo dei Geometri ha piantato un paletto giallo in mezzo al campetto."]]); } else done(); }
    const talk = {
      sq_ines() {
        const s = S();
        if (s === 0) return K.scene([["sq_ines", "[furbo] (Ti guarda da sopra gli occhiali. Un ferro da stiro si stacca dal muro e le vola in mano.) Ti ho visto, ieri, al campetto. Hai fatto un dribbling col ghiaccio sotto le scarpe, dopo aver dato la mano a Brina. Poi hai soffiato via un pallone senza toccarlo, dopo aver salutato Soffio."], ["sq_ines", "Hai il potere più strano di Ponterotto, ragazzo: copi quello degli altri. Io copio solo il ferro. (Ride.) Il Dottor Cemento vuole fare un parcheggio sul campetto. Ci serve una squadra. Brina, Soffio, Gommo. Vai a prenderli."]], () => { setStep(N, 1); K.recluta("calamita"); K.learnLore("l_copione"); quest("sq_squadra", "Una squadra per il campetto", "Brina alla gelateria, Soffio sull'isoletta, Gommo dietro le foglie."); done(); }, "sq_garage");
        if (s === 3) return ask("sq_ines", "(Ha cucito cinque maschere con le tende del salotto.) I Geometri torneranno, e con loro il Dottor Cemento. Domanda: ci mettiamo le maschere, o andiamo in giro con la nostra faccia? A Ponterotto ci conoscono tutti.", [
          { label: "«Maschere. Siamo supereroi»", sub: "Identità segrete", big: true, fn: () => fine1("maschere") },
          { label: "«Faccia scoperta. Siamo il quartiere»", sub: "Tutti sanno chi siete", big: true, fn: () => fine1("volti") },
        ], "sq_garage");
        return say([["sq_ines", s >= 1 ? "Brina, Soffio, Gommo. Per Soffio serve il ghiaccio di Brina, sul canale. Per Gommo, il vento di Soffio, sulle foglie. Si cambia potere dal menu." : "Il ferro mi vuole bene. Le persone, di meno."]]);
      },
      sq_brina() {
        if (S() === 1 && !F.is("sq_in_ghiaccio")) return say([["sq_brina", "[sorpreso] Una squadra di supereroi? Per il campetto? (Le gela il cono in mano.) Ci sto. Ma se la tua mano diventa fredda, non lamentarti: io ci convivo da trentadue anni. Dammi la mano. Ecco. Adesso il canale ti regge."]], () => { K.recluta("ghiaccio"); K.cambia("ghiaccio", check); });
        if (S() >= 2) return ask("sq_brina", "[felice] Gli Straordinari! Il nome l'ho scelto io. Una sfida, intanto?", [{ label: "La sfida dei gelati", sub: "Partita secondaria · scegli tu la modalità", fn: gelati }, { label: "Dopo", fn: done }], "sq_quartiere");
        return say([["sq_brina", "Il gusto del giorno è «Canale». Non chiedermi cosa c'è dentro."]]);
      },
      sq_soffio() {
        if (S() === 1 && !F.is("sq_in_vento")) return say([["sq_soffio", "[ride] Hai attraversato il canale a piedi! (Si toglie il tappo dalla tromba.) Allora sei uno di noi. Il vento è mio, prendine un po'. Attento: le foglie dietro casa di Gommo aspettano solo un soffio."]], () => { K.recluta("vento"); K.cambia("vento", check); });
        return say([["sq_soffio", F.is("sq_in_vento") ? "[felice] Pfffff. (È così che saluta.)" : "(Suona la tromba tappata. Esce un fischio piccolissimo.)"]]);
      },
      sq_gommo() {
        if (S() === 1 && !F.is("sq_in_elastico")) return say([["sq_gommo", "[sorpreso] Hai spazzato via un muro di foglie con un soffio! (Si allunga fino al tetto per vedere meglio.) Una squadra? Io sono un idraulico, non un eroe. (Pausa.) Però il campetto… ci ho segnato il mio primo gol. Va bene. Ecco, allungati anche tu."]], () => { K.recluta("elastico"); check(); });
        return say([["sq_gommo", "Un tubo alla volta. Anche i supereroi perdono acqua."]]);
      },
      sq_geometra() {
        if (S() === 2) return ask("sq_geometra", "(Misura il campetto. Poi misura te.) Un metro e settanta. Inutile. (Scrive.) Questo campo diventa un parcheggio, lo dice il Dottor Cemento. Volete giocare? Giochiamo: se vincete voi, smetto di misurare. Per oggi.", [{ label: "Sfida i Geometri", sub: "Combo di Squadra · partita importante", cls: "hot", fn: matchGeometri }, { label: "Non ancora", fn: done }], "sq_quartiere");
        return say([["sq_geometra", "(Misura il vento. Scrive «troppo».)"]]);
      },
    };
    function fine1(kind) {
      F.set(kind === "maschere" ? "sq_maschere" : "sq_volti", true); bond(kind === "volti" ? "quartiere" : "squadra", 2);
      const msg = K.reward("c1:sq", { coins: 70, cos: ["sq_c1"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "maschere" ? [["sq_ines", "[felice] (Distribuisce le maschere: quella di Gommo è troppo piccola, lui la allunga.) Da oggi, a Ponterotto, ci sono gli Straordinari. E nessuno sa chi siano. (Pausa.) Tranne tutti quelli che ci hanno visti uscire dal garage."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il Dottor Cemento».`]]
        : [["sq_ines", "[felice] (Appende le maschere al muro, accanto ai ferri da stiro.) Faccia scoperta. Siamo la gelataia, il trombettista, l'idraulico, la nonna e il ragazzo che copia. Ponterotto ci conosce: ci aiuterà."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il Dottor Cemento».`]], () => K.openMain(), "sq_garage");
    }
    return { n: N, title: "Il garage dei supereroi", sub: "Nonna Ines, il potere del Copione, la squadra, i Geometri", goal, start: "sq_quartiere", introBg: "sq_titolo", zones, talk,
      intro: () => [["voce", "<b>GLI STRAORDINARI DI QUARTIERE</b> · numero 1. Ogni quartiere ha i suoi supereroi. Quelli di Ponterotto vendono gelati, suonano la tromba, aggiustano i tubi. E non si sono mai parlati."]] };
  }
  boot();
})();
