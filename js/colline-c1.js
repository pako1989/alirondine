// js/colline-c1.js - MASTER LEAGUE DELLE COLLINE · Capitolo 1 «L'ultima in classifica»
// Colle Alto: un campanile, una piazza in salita, un bar dello sport e un campo comunale con una porta più alta dell'altra.
// La Contessa Bice, presidentessa da quarant'anni, ti affida la squadra ultima in classifica. Il Mago Pino, il barista che
// nel 1978 portò la Colle Alto in Serie Collina, ti insegna la lavagna. Prima partita: lo Sporting Pietrafitta.
(function () {
  "use strict";
  function boot() { const D = window.__colline; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("ml_bice", { acc: ["occhiali", "fiore"], name: "La Contessa Bice", tag: "gray", hair: "#e8e8e8", style: "bun", skin: "#f0d8c0", eye: "#3a3a5a", bg: ["#1e3a2a", "#c8a050"], shirt: "#5a2a4a" },
      "Presidentessa dell'U.S. Colle Alto da quarant'anni. Possiede metà delle vigne delle colline e tutta la pazienza del mondo, tranne la domenica pomeriggio. Non ha mai licenziato un allenatore: li ha sempre convinti ad andarsene da soli.");
    K.cast("ml_pino", { beard: "baffi", acc: ["grembiule"], name: "Il Mago Pino", tag: "gray", hair: "#8a8a8a", style: "slick", skin: "#d9a679", eye: "#2a2a2a", bg: ["#1e3a2a", "#2a5a8a"], shirt: "#f4f0e4" },
      "Il barista del Bar dello Sport. Nel 1978 allenava la Colle Alto e la portò in Serie Collina con una tattica disegnata su un tovagliolo. Poi una sera si arrabbiò con un arbitro, appese il fischietto e aprì il bar. Disegna ancora tattiche, sui tovaglioli.");
    K.cast("ml_marta", { acc: ["fascia"], name: "Marta Fiore, la capitana", tag: "", hair: "#c8642a", style: "ponytail", skin: "#f0d0b0", eye: "#3a5a3a", bg: ["#1e3a2a", "#2a6a3a"], shirt: "#2a6a3a", num: "8" },
      "La fiorista di Colle Alto e la capitana della squadra. Organizza il centrocampo come un mazzo di fiori: ogni cosa al suo posto, e qualcosa di colorato davanti.");
    K.cast("ml_rino", { acc: ["coppola"], name: "Rino Corriera", tag: "", hair: "#3a2a1a", style: "buzz", skin: "#c68642", eye: "#2a2a2a", bg: ["#1e3a2a", "#2a6a3a"], shirt: "#2a6a3a", num: "9" },
      "L'autista della corriera delle colline e il centravanti della Colle Alto. Segna solo di testa: i piedi, dice, li tiene per la frizione.");
    K.cos("ml_c1", { kind: "shirt", label: "Tuta del Mister di Colle Alto", val: "#2a6a3a", from: "Capitolo 1 di Master League delle Colline" });
    K.cos("ml_fig1", { kind: "acc", label: "Fischietto del Mago Pino", val: "fischietto", from: "Trova tutte le figurine rare di Colle Alto" });
    K.lore("l_lavagna", { t: "La Lavagna Tattica", d: "Il Mago Pino: «Il calcio si vince alla lavagna, il resto è sudore». Modulo, caselle, mentalità, istruzione. Pressing batte possesso, possesso batte contropiede, contropiede batte pressing, palla lunga punisce il pressing alto." });
    K.lore("l_mercato", { t: "Il Mercato", d: "Nella bacheca di sughero del Bar dello Sport ci sono le figurine dei giocatori liberi. Si comprano con i crediti della società, si cedono a metà prezzo. Chi è del paese, però, non si vende." });
    const goal = (s) => ({
      0: "La Contessa Bice, presidentessa dell'U.S. Colle Alto, ti aspetta in piazza, sotto il campanile.",
      1: "Il Mago Pino, al Bar dello Sport (la porta verde in piazza), sa tutto di calcio e di mercato.",
      2: "La prima partita: lo Sporting Pietrafitta. La capitana Marta aspetta al campo comunale.",
      3: "Hai vinto la prima! La Contessa vuole parlarti.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      ml_colle: {
        region: "colle", name: "Master League delle Colline · Colle Alto", short: "Colle Alto", sub: "La piazza, il campanile, il campo comunale in salita", bg: "ml_colle", time: "giorno", travel: [15, 19],
        w: 32, h: 22, start: [15, 19], itemCos: "ml_fig1", items: [[2, 2], [29, 2], [2, 19]],
        areas: [[19, 10, 29, 18, "Il campo comunale"], [0, 0, 31, 21, "Colle Alto"]],
        flavor: { t: "Un cipresso. Sotto, una panchina con una targa: «Al Mago Pino, 1978. La Colle Alto riconoscente»." },
        intro: [["voce", "Colle Alto: case color miele, vigne fino all'orizzonte, un campanile che suona anche le mezz'ore. In fondo al paese, il campo comunale: in salita, con una porta più alta dell'altra."], ["voce", "La Colle Alto è ultima nella Lega delle Colline. Un punto in cinque partite. E da oggi l'allenatore sei tu."]],
        npcs: (s) => [{ id: "ml_bice", at: [12, 7] }, { id: "ml_marta", at: [21, 14] }, { id: "ml_rino", at: [25, 12] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 21, 31, 21, "t"); lay(0, 0, 0, 21, "t"); lay(31, 0, 31, 21, "t");
          lay(6, 6, 16, 10, "+"); lay(15, 11, 15, 20, ":"); lay(1, 19, 30, 20, ":"); lay(17, 8, 18, 8, ":");
          house(4, 1, 5, 4, { door: [6, 4], roof: "#a85a2a", wall: "#e8d8b0", rr: 2, enter: "Il campanile: centoquattro gradini. In cima, il campanaro ti mostra il paese e dice: «Da qui si vede il campo della Valfonda. Quando vincono, suonano. Noi non suoniamo dal 1978»." });
          house(10, 1, 7, 4, { door: [13, 4], roof: "#2a6a3a", wall: "#f4ecd8", rr: 2, enter: { to: "ml_bar", at: [10, 10] } });
          lay(19, 10, 29, 18, ":"); put(19, 14, "Q"); put(29, 14, "Q"); lay(19, 10, 29, 10, "+");
          [[3, 12], [8, 15], [28, 6], [24, 3], [2, 7]].forEach(([x, y]) => put(x, y, "t")); put(10, 12, "s");
        },
      },
      ml_bar: {
        interior: true, region: "casa", name: "Master League delle Colline · Il Bar dello Sport", short: "Il Bar dello Sport", sub: "Caffè, tovaglioli e tattiche", bg: "ml_bar", w: 20, h: 13, start: [10, 10], outside: ["ml_colle", 13, 5],
        act: { T: "Guarda il bancone", L: "Guarda la bacheca", W: "Guarda la finestra", v: "Esci" },
        flavor: { T: "Il bancone del Mago Pino. Sotto il vetro, decine di tovaglioli disegnati: tre-due-uno, due-tre-uno, frecce, cerchi. Uno ha una macchia di caffè a forma di Coppa.", L: "La bacheca di sughero del mercato: le figurine dei giocatori liberi, appuntate con le puntine. Il Mago Pino le aggiorna ogni lunedì.", W: "Dalla finestra si vede il campo comunale, in salita. Il Mago Pino lo guarda ogni domenica. Non ci va mai." },
        intro: [["voce", "Il Bar dello Sport: sei tavolini, una macchina del caffè che fischia come un arbitro, una televisione accesa sul calcio. Dietro il bancone, un signore con la barba disegna su un tovagliolo."]],
        npcs: () => [{ id: "ml_pino", at: [10, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(6, 5, 14, 5, "T"); lay(2, 1, 5, 1, "L"); put(16, 1, "W"); put(3, 8, "T"); put(16, 8, "T"); put(2, 11, "s"); },
      },
    };
    function match() {
      K.lavagna({ title: "Lavagna Tattica · Colle Alto contro Sporting Pietrafitta", oppId: "pietrafitta", opp: { name: K.TEAMS.pietrafitta.n, color: K.TEAMS.pietrafitta.c, ovr: K.TEAMS.pietrafitta.o, instr: "possesso", style: "equilibrata" }, scout: true,
        intro: "<p>Il Mago Pino ha già scritto sul tovagliolo: «La Pietrafitta tiene palla. Pressing alto». Ma la lavagna è tua.</p>", winTitle: "LA PRIMA VITTORIA!" }, (r) => {
        if (!r.win) return K.scene([["ml_marta", r.a === r.b ? "[pensa] Un punto. È già qualcosa: sono due, adesso. La Lega ci concede la ripetizione per il campo allagato. Riproviamo, Mister." : "[triste] Abbiamo perso. Come sempre. (Si stringe la fascia.) Ma la lavagna era giusta, Mister. Rigiochiamola: il campo era fradicio, la Lega ci dà ragione."]], () => K.enterZone("ml_colle"), "ml_colle");
        setStep(N, 3); bond("paese", 2); F.set("ml_giornata", 6); K.learnLore("l_lavagna");
        K.scene([["voce", `Fischio finale: ${r.a} a ${r.b}. Il campanile di Colle Alto, per la prima volta dal 1978, suona a festa. Dal bar, il Mago Pino alza la tazzina verso la finestra.`], ["ml_marta", `[felice] Abbiamo vinto! Mister, il migliore in campo è stato ${r.data && r.data.mvp ? r.data.mvp : "tutto il paese"}! (Lo abbraccia, poi abbraccia anche il palo della porta più alta.)`]], () => K.classifica("La Lega delle Colline · 6ª giornata", () => K.enterZone("ml_colle")), "ml_colle");
      });
    }
    const talk = {
      ml_bice() {
        const s = S();
        if (s === 0) return say([["ml_bice", "[pensa] (Ti guarda dall'alto in basso, con il ventaglio.) Lei è il nuovo allenatore. Il quindicesimo da quando sono presidentessa. Gli altri quattordici sono andati via da soli. (Sorride.) Io non licenzio nessuno."], ["ml_bice", "[furbo] La società le mette a disposizione trecento crediti per il mercato. Spenda bene. E vada al Bar dello Sport: il Mago Pino ha qualcosa da dirle. Lo dice a tutti gli allenatori. Nessuno lo ascolta mai."]], () => { setStep(N, 1); F.set("ml_crediti", 300); quest("ml_stagione", "La stagione della Colle Alto", "Il Mago Pino, il mercato, poi la prima partita."); done(); });
        if (s === 3) return ask("ml_bice", "(Chiude il ventaglio.) Una vittoria. Il campanile ha suonato. (Pausa.) Adesso mi dica, Mister: con quale idea finiamo la stagione?", [
          { label: "«Con i ragazzi del paese»", sub: "Il paese con te, niente spese folli", big: true, fn: () => fine1("paese") },
          { label: "«Comprando i migliori delle colline»", sub: "+200 crediti per il mercato d'inverno", big: true, fn: () => fine1("mercato") },
        ], "ml_colle");
        return say([["ml_bice", s >= 4 ? "[felice] Il campanile ha suonato. Non lo dimenticherò." : "Il Bar dello Sport è la porta verde, Mister. Il caffè è pessimo, i consigli no."]]);
      },
      ml_pino() {
        const s = S();
        if (s === 1) return ask("ml_pino", "(Non alza gli occhi dal tovagliolo.) Il quindicesimo. (Disegna una freccia.) Ascolta, Mister: il calcio si vince alla lavagna. Il resto è sudore. Tre cose: il modulo, la gente giusta al posto giusto, e l'istruzione che batte la loro.\n\nE per il mercato… nella bacheca c'è Nonno Ermes, il mio portiere del '78. È gratis. Para ancora.", [
          { label: "Apri il mercato", sub: "La bacheca delle figurine", cls: "hot", fn: () => K.mercato({ title: "Il Mercato · la bacheca del Bar", pool: ["ermes", "ines", "lucia", "ottavio"] }, () => { K.learnLore("l_mercato"); setStep(N, 2); F.set("ml_pino_ascoltato", true); K.scene([["ml_pino", `[furbo] (Guarda la rosa sul taccuino.) ${K.comprati() ? "Bene. Adesso li devi mettere al posto giusto." : "Nessun acquisto? Il paese ti vorrà bene. Le partite, vedremo."} La prima è contro la Pietrafitta: tengono palla. Sai cosa batte il possesso.`]], done, "ml_bar"); }) },
          { label: "Non ancora", fn: done },
        ], "ml_bar");
        return say([["ml_pino", s >= 3 ? "[felice] Ho sentito il campanile. (Si asciuga una tazzina che è già asciutta.) Bravo, Mister." : "Pressing batte possesso. Possesso batte contropiede. Contropiede batte pressing. E la palla lunga… quella la usa chi ha fretta."]]);
      },
      ml_marta() {
        const s = S();
        if (s === 2) return ask("ml_marta", "Capitana Marta Fiore, Mister. La squadra è pronta: un fornaio, un sacrestano, un meccanico, una fiorista… (sorride) …e un autista di corriera. Contro la Pietrafitta. Prima un allenamento, o subito in campo?", [
          { label: "Scendi in campo", sub: "Lavagna Tattica · la prima partita", cls: "hot", fn: match },
          { label: F.is("ml_all_1") ? "Allenamento già fatto" : "Allenamento al campo", sub: "+1 ai tre più deboli della rosa", disabled: F.is("ml_all_1"), fn: () => { const n = K.allenamento(1); F.set("ml_all_1", true); say([["ml_marta", `[felice] Allenamento in salita: ${n.join(", ")} migliorano di un punto. Domani avranno le gambe di legno, ma oggi vanno forte.`]]); } },
          { label: "Non ancora", fn: done },
        ], "ml_colle");
        return say([["ml_marta", s >= 3 ? "[ride] Un punto in cinque partite, e adesso tre in una. La matematica delle colline." : "La porta di sinistra è più alta. Noi la usiamo nel secondo tempo, quando gli avversari sono stanchi di saltare."]]);
      },
      ml_rino() { return say([["ml_rino", S() >= 3 ? "[ride] Gol di testa! Il pallone mi è arrivato come la corriera in curva: all'ultimo momento." : "Io segno di testa, Mister. I piedi li tengo per la frizione. Mettimi davanti e crossa."]]); },
    };
    function fine1(kind) {
      if (kind === "paese") { F.set("ml_scelta_paese", true); bond("paese", 2); } else { F.set("ml_crediti", K.crediti() + 200); bond("fiducia", 1); }
      const msg = K.reward("c1:ml", { coins: 60, cos: ["ml_c1"] }); finishChapter(N, kind); setStep(N, 5); questDone("ml_stagione");
      K.scene(kind === "paese" ? [["ml_bice", "[sorpreso] Con i ragazzi del paese. (Riapre il ventaglio, lentamente.) Il Mago Pino disse la stessa cosa, nel 1978. (Si volta.) Vada, Mister. Il paese la seguirà."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il mercato d'inverno».`]]
        : [["ml_bice", "[furbo] I migliori delle colline. Duecento crediti in più: alla fiera di Borgofiera, a gennaio, c'è il mercato d'inverno. E il Cavalier Ottone della Valfonda, che compra tutto. Lo batta sul tempo."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il mercato d'inverno».`]], () => K.openMain(), "ml_colle");
    }
    return { n: N, title: "L'ultima in classifica", sub: "La Contessa, il Mago Pino, la prima partita alla lavagna", goal, start: "ml_colle", introBg: "ml_titolo", zones, talk,
      intro: () => [["voce", "<b>MASTER LEAGUE DELLE COLLINE.</b> Valfiorita: vigne, campanili e una Lega di sei squadre che si odiano con affetto da cent'anni. L'U.S. Colle Alto è ultima. Ha bisogno di un allenatore. Ha trovato te."]] };
  }
  boot();
})();
