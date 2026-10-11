// js/muro-c2.js - IL MURO · Capitolo 2 «Fuori»
// La prima ricognizione: ci si cala dal muro nella Terra di Fuori (furtività tra i Colossi, erba alta, Colossi addormentati da disegnare).
// Le Rovine del Campo Vecchio: primo colpo di scena (cosa sono davvero i Colossi). Poi il Torneo della Cinta (a scelta)
// e, nella Città Bassa, la sfida dei Fuorimura di Corvino nella gabbia (La Gabbia, forzata).
(function () {
  "use strict";
  function boot() { const MU = window.__muro; if (!MU || !MU.addChapter || !MU._has(1)) return setTimeout(boot, 120); MU.addChapter(chapter2); }
  function chapter2(X) {
    const { F, say, ask, done, go, setStep, bond, learnLore, finishChapter } = X;
    const N = 2, S = () => X.stepOf(N), M = () => X.mem();

    X.cast("mu_corvino", { name: "Corvino", tag: "", hair: "#1a1a22", style: "long", skin: "#c68642", eye: "#2a2a2a", bg: ["#1a1c20", "#3a3a42"], shirt: "#2a2a30", beard: true },
      "Il capo dei Fuorimura. Un mantello nero, una voce bassa, una pazienza finita da anni. Vuole aprire il muro, con le buone o con le cattive. Ha già provato con le buone.");
    X.cast("mu_orso", { name: "Maestro di Campo Orso", tag: "gray", hair: "#8a7a6a", style: "buzz", skin: "#e0b48a", eye: "#3a3a2a", bg: ["#2a2c34", "#c9a227"], shirt: "#5a4a3a", beard: true },
      "L'arbitro del Torneo della Cinta da trent'anni. Fischia piano e decide forte. Dice che sul muro i falli non esistono: esiste solo il vento.");
    X.cos("mu_c2", { kind: "shirt", label: "Mantello della Ricognizione", val: "#4a5a3a", from: "Completa il Capitolo 2 de Il Muro" });
    X.cos("mu_erba", { kind: "hairc", label: "Capelli d'Erba Alta", val: "#6a8a4a", from: "Raccogli tutte le piume di corvo nella Terra di Fuori" });
    X.cos("mu_muschio", { kind: "shirt", label: "Maglia di Muschio", val: "#4a6a3a", from: "Raccogli tutte le piume di corvo alle Rovine" });
    X.cos("mu_salici", { kind: "shirt", label: "Maglia del Borgo dei Salici", val: "#c9a227", from: "Un baule alle Rovine del Campo Vecchio" });

    X.lore("l_numeri", { t: "I numeri sulla schiena", d: "Ogni Colosso ha un numero inciso sulla schiena, tra le scapole. 7, 9, 14, 1. Come le maglie di una squadra." });
    X.lore("l_tabellone", { t: "Il tabellone di pietra", d: "Alle Rovine del Campo Vecchio c'è un tabellone scolpito: «BORGO DEI SALICI 3 · CINTAVECCHIA 2». Sotto, una data: duecento anni fa. Il giorno prima della costruzione del muro." });
    X.lore("l_salici", { t: "Il Borgo dei Salici", d: "Prima del muro, fuori c'erano dei borghi. Giocavano ogni primavera contro Cintavecchia: la Partita di Primavera. I loro nomi non sono su nessuna mappa della città. Qualcuno li ha cancellati." });
    X.lore("l_razioni", { t: "Le razioni dei Fuorimura", d: "Il Consiglio ha dimezzato le razioni alle famiglie dei Fuorimura. Motivo ufficiale: «disobbedienza al muro». Motivo vero, secondo Corvino: «hanno visto troppo»" });

    const goal = (s) => ({
      0: "Sul Camminamento: parla con la Comandante Ilse, accanto alla torre.",
      1: "Calati fuori dal muro dalla corda (sul parapetto nord, al centro del Camminamento).",
      2: "Terra di Fuori: raggiungi le Rovine a nord, passando nell'erba alta. Se vuoi, disegna i Colossi addormentati.",
      3: "Rovine del Campo Vecchio: cerca Nives, vicino al Colosso inginocchiato.",
      4: "Torna sul Camminamento: il Maestro di Campo Orso ti aspetta per il Torneo della Cinta.",
      5: "Nella Città Bassa, Corvino e i Fuorimura sfidano la Guardia. Vai nel vicolo a est.",
    }[s] || "Capitolo concluso. Il prossimo ti aspetta dal menu.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(15,15,20,.85)"); R(g, x - w / 2, y + 2, w, 1, "#a8322a"); g.fillStyle = "#e8e2d4"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    const zones = {
      mu_fuori: {
        region: "fuori", name: "Il Muro · La Terra di Fuori", short: "La Terra di Fuori", sub: "Erba alta, nebbia e Colossi", bg: "mu_fuori", stealth: true,
        w: 40, h: 30, start: [20, 26], itemCos: "mu_erba", items: [[2, 24], [37, 4], [14, 13], [33, 22]],
        areas: [[16, 24, 24, 27, "Ai piedi del muro"], [0, 0, 39, 29, "La Terra di Fuori"]],
        colossi: [
          { path: [[4, 21], [35, 21]], speed: 1.1, num: "9", sight: 5, fov: 70 },
          { path: [[34, 13], [6, 13]], speed: 1.0, num: "7", sight: 5.5, fov: 70 },
          { path: [[27, 3], [27, 18], [12, 18], [12, 3]], speed: 0.9, num: "1", sight: 5, fov: 65 },
        ],
        sketches: { "5,26": { lore: "l_numeri", text: "Tra le scapole, nascosto dal muschio, c'è un numero inciso: 14. Come una maglia." }, "33,9": { text: "Ha le mani appoggiate sulle ginocchia, come un giocatore in panchina che aspetta di entrare." }, "6,7": { text: "Sul suo petto, a fatica, leggi delle lettere consumate: «…ICI». Come l'ultima parte di un nome." } },
        act: { r: "Guarda le rovine", t: "Guarda l'albero", w: "Guarda lo stagno", n: "Leggi il cartello", "^": "Alle Rovine del Campo Vecchio", k: "Risali la corda" },
        flavor: {
          r: ["Una casa crollata, mangiata dall'erba. Sulla soglia, una scarpa da calcio di cuoio, piccola, consumata in punta.", "Un muretto di pietre a secco. Qualcuno, tanto tempo fa, ci ha disegnato una porta col carbone. Per giocare contro il muro."],
          t: "Un salice enorme. I rami arrivano fino a terra, come una tenda. Dentro, l'erba è schiacciata in un cerchio: qualcuno ci si siede spesso. Qualcuno grande.",
          w: "Uno stagno. Nell'acqua ferma si specchia il muro, lontano, che da qui sembra solo una riga grigia sull'orizzonte.",
          n: "Un vecchio cartello di legno, quasi illeggibile: «← BORGO DEI SALICI · 2 miglia». Non c'è nessun borgo, a ovest. Solo erba.",
        },
        intro: [["voce", "La Terra di Fuori. L'erba ti arriva al petto, la nebbia alle ginocchia. Dietro di te il muro sale fino al cielo, e per la prima volta lo vedi dall'altra parte: senza finestre, senza porte, solo pietra."], ["voce", "Laggiù, nella nebbia, si muovono delle forme enormi. I Colossi. Camminano lenti, e guardano davanti a sé. Nell'erba alta non ti vedono. Allo scoperto, sì."]],
        npcs: (s) => [{ id: "mu_teo", at: [22, 26] }, ...(s === 2 ? [{ id: "mu_nives", at: [17, 8] }] : [])],
        build(L) {
          const { lay, put, colosso } = L;
          lay(0, 28, 39, 29, "a"); lay(0, 0, 0, 27, "t"); lay(39, 0, 39, 27, "t"); lay(0, 0, 39, 0, "t"); put(20, 0, "^"); put(20, 27, "k");
          // grandi macchie d'erba alta, con corridoi per avanzare nascosti
          [[2, 23, 14, 26], [24, 23, 37, 26], [16, 19, 23, 24], [2, 15, 10, 19], [28, 15, 37, 19], [13, 9, 26, 15], [2, 2, 9, 10], [30, 2, 37, 10], [17, 1, 23, 8], [10, 4, 15, 8]].forEach(([a, b, c, d]) => lay(a, b, c, d, ";"));
          lay(18, 1, 22, 3, ";"); lay(16, 15, 23, 19, ";");
          [[12, 25], [27, 16], [8, 12], [31, 12], [15, 3], [25, 6]].forEach(([x, y]) => put(x, y, "r")); [[36, 26], [3, 13], [23, 2], [11, 1]].forEach(([x, y]) => put(x, y, "t")); lay(30, 24, 31, 24, "w"); put(4, 10, "n");
          colosso(5, 25); colosso(33, 8); colosso(6, 6);
        },
        decor(g, cx, cy, d) { plaque(g, "IL MURO", d.X(20) + 8, d.Y(28) + 8); plaque(g, "ROVINE ↑", d.X(20) + 8, d.Y(1)); },
      },
      mu_rovine: {
        region: "fuori", name: "Il Muro · Le Rovine del Campo Vecchio", short: "Le Rovine del Campo Vecchio", sub: "Uno stadio di duecento anni fa", bg: "mu_rovine", stands: "empty",
        w: 30, h: 22, start: [15, 20], itemCos: "mu_muschio", items: [[2, 2], [27, 2], [3, 19], [26, 19]], pitch: [6, 6, 18, 10],
        areas: [[6, 6, 23, 15, "Il Campo Vecchio"], [0, 0, 29, 21, "Le Rovine"]],
        chests: { "27,10": { coins: 40, cos: "mu_salici", text: "Una maglia gialla, scolorita ma intera, con ricamato un salice. Sulla schiena, il numero 14." } },
        act: { j: "Guarda le gradinate", g: "Guarda la porta", r: "Guarda le rovine", n: "Guarda il tabellone di pietra", o: "Il Colosso inginocchiato", t: "Guarda l'albero", v: "Torna verso il muro" },
        flavor: { j: "Gradinate di pietra, crepate, piene di fiori. Ci stavano migliaia di persone. Su un gradino qualcuno ha inciso due nomi e una data: duecento anni fa.", g: "Una porta di pietra senza rete. Nell'erba, davanti, la terra è battuta: qualcuno ci gioca ancora.", r: "Archi crollati. Un tempo qui c'erano gli spogliatoi: si vedono ancora i ganci, a altezza d'uomo.", t: "Un albero cresciuto in mezzo alla tribuna d'onore. Ha spaccato il palco del re in due." },
        intro: [["voce", "Le Rovine del Campo Vecchio. Uno stadio di pietra, mangiato dall'erba e dai fiori. Le gradinate sono crepate, le porte senza reti. E in mezzo al campo, inginocchiato, un Colosso. Fermo. Con un pallone di pietra tra le mani."]],
        npcs: (s) => (s >= 3 && s <= 3 ? [{ id: "mu_nives", at: [17, 13] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t"); put(15, 21, "v");
          lay(3, 3, 26, 4, "j"); lay(3, 17, 26, 18, "j"); lay(3, 5, 4, 16, "j"); lay(25, 5, 26, 16, "j"); [[8, 3], [9, 4], [20, 17], [4, 10], [26, 7]].forEach(([x, y]) => put(x, y, "m")); put(14, 18, ";"); put(15, 18, ";"); put(16, 18, ";"); put(15, 17, ";"); put(14, 17, ";"); put(16, 17, ";");
          lay(5, 5, 24, 16, "-"); put(6, 10, "g"); put(6, 11, "g"); put(23, 10, "g"); put(23, 11, "g");
          L.colosso(14, 11); put(15, 2, "n"); put(14, 2, "n"); put(27, 10, "x"); [[2, 8], [27, 15], [12, 1]].forEach(([x, y]) => put(x, y, "t")); [[2, 13], [27, 5]].forEach(([x, y]) => put(x, y, "r"));
          lay(14, 19, 16, 20, ";");
        },
        decor(g, cx, cy, d) { // il tabellone di pietra in alto
          const x = d.X(14), y = d.Y(1); R(g, x - 10, y - 14, 52, 18, "#6a645a"); R(g, x - 10, y - 14, 52, 2, "#8a8478"); g.fillStyle = "#e8e2d4"; g.font = "bold 6px Georgia, serif"; g.fillText("SALICI 3 · CINTA 2", x - 7, y - 3);
          // il pallone di pietra tra le mani del Colosso
          g.fillStyle = "#9a9488"; g.beginPath(); g.arc(d.X(15), d.Y(11) - 18, 6, 0, 7); g.fill(); g.strokeStyle = "#5a5248"; g.lineWidth = 1; g.stroke(); g.beginPath(); g.moveTo(d.X(15) - 6, d.Y(11) - 18); g.lineTo(d.X(15) + 6, d.Y(11) - 18); g.stroke();
        },
      },
    };

    const talk = {
      mu_ilse() {
        const s = S();
        if (s === 0) return say([
          ["mu_ilse", "Prima ricognizione, {n}. Regole: uno, si scende dalla corda al centro del parapetto nord. Due, si cammina nell'erba alta: i Colossi guardano davanti a sé e nell'erba non ti vedono. Tre, mai passargli sotto i piedi."],
          ["mu_ilse", "Quattro: se ti vedono non scappare. Non serve. Ti… riportano indietro. Nessuno sa perché. Il Consiglio dice che è fortuna. Io dico che è un'altra cosa, ma non so quale."],
          ["mu_ilse", "Obiettivo: le Rovine del Campo Vecchio, a nord. Nessuna ricognizione ci è mai arrivata. Teo ti aspetta alla corda, giù. Se vedi dei Colossi addormentati, disegnali nel Taccuino: ci serve sapere com'è fatto il nemico."],
        ], () => { setStep(N, 1); done(); });
        if (s === 4) return say([["mu_ilse", "Sei tornato. Tutto intero. Bene. Del resto parliamo stanotte. Ora il Torneo: Orso ti cerca."]]);
        return say([["mu_ilse", "La corda è al centro del parapetto nord. Vai piano, recluta. Piano è veloce, fuori."]]);
      },
      mu_teo() {
        if (X.api.trZone() === "mu_fuori") return say([["mu_teo", pick2(["Io resto qui alla corda. Qualcuno deve tenerla. E qualcuno deve avere paura per tutti e due: lo faccio io, tranquillo.", "Hai visto il cielo, da quaggiù? È uguale. Ma sembra più grande lo stesso. Non so spiegarlo."])]]);
        return say([["mu_teo", "Ci vediamo giù, alla corda!"]]);
      },
      mu_nives() {
        const s = S();
        if (s === 2) return say([["mu_nives", "(Sbuca dall'erba alta, senza un rumore.) Non spaventarti. Ti ho visto scendere. Cammini come un bufalo, ma nell'erba giusta. Le Rovine sono qui dietro. Ti aspetto dentro. C'è una cosa che devi vedere con i tuoi occhi."]], () => { setStep(N, 3); done(); });
        if (s === 3) return twist();
        return say([["mu_nives", "Sssh."]]);
      },
      mu_orso() {
        const s = S();
        if (s === 4) return ask("mu_orso", "Recluta {n}! Il Torneo della Cinta: la Guardia contro le squadre dei quartieri. Si gioca qui sul Camminamento, oppure, se preferisci, in un altro modo. Il vento non fa differenze.", [
          { label: "⚽ Gioca il Torneo della Cinta", sub: "Partita a scelta · Guardia del Muro contro i Quartieri", cls: "hot", fn: torneo },
          { label: "Non ancora", fn: done },
        ], "mu_muro");
        return say([["mu_orso", "Sul muro i falli non esistono. Esiste solo il vento. E io."]]);
      },
      mu_corvino() {
        const s = S();
        if (s === 5) return ask("mu_corvino", "Ecco la recluta che è stata alle Rovine. Lo sanno tutti, nel vicolo: Nives non sa tacere quando è felice. Il Consiglio ha dimezzato le razioni alle nostre famiglie. Dice che è perché disobbediamo al muro.\nIo dico: giochiamo. Nella gabbia. Tu, la tua Guardia, contro i miei. Se vinci, ti ascolto. Se perdo, ti racconto cosa nasconde il Consiglio.", [
          { label: "⚽ Accetta: La Gabbia dei Fuorimura", sub: "Partita forzata · nella gabbia sotto la pioggia", cls: "hot", fn: gabbia },
          { label: "Non ora", fn: done },
        ], "mu_bassa");
        return say([["mu_corvino", "…"]]);
      },
    };
    function pick2(a) { return a[Math.floor(Math.random() * a.length)]; }
    function twist() {
      X.api.play(X.lines([
        ["mu_nives", "Guarda. (Ti indica il Colosso inginocchiato in mezzo al campo.) Ti ho portato qui perché non mi crederesti se te lo dicessi. Nessuno mi crede."],
        ["voce", "Nives prende un pallone di cuoio dalla sacca e lo calcia, piano, verso il Colosso. Il pallone rotola nell'erba e si ferma contro il suo ginocchio di pietra."],
        ["voce", "Per un lungo istante non succede niente. Poi il Colosso si muove. Lentissimo. Abbassa una mano, spinge il pallone con un dito, e lo rimanda indietro. Rotola fino ai tuoi piedi. Un passaggio."],
        ["mu_nives", "Ogni Colosso ha un numero sulla schiena. Hai visto il tabellone? Salici 3, Cintavecchia 2. Duecento anni fa, il giorno prima del muro. I Colossi non sono mostri, {n}. Sono loro. I giocatori dei borghi di fuori. Quelli rimasti dall'altra parte quando chiusero il muro."],
        ["mu_nives", "Non so come siano diventati pietra. So che quando sentono una partita si avvicinano. Non per schiacciare: per guardare. Per giocare. Si ricordano."],
      ], "mu_rovine"), () => {
        learnLore("l_tabellone", true); learnLore("l_salici", true);
        ask("mu_nives", "Ora lo sai. E adesso cosa fai, Guardia? Torni su e racconti tutto alla tua comandante? Al Consiglio? O tieni il segreto con noi, finché non sappiamo di più?", [
          { label: "Lo racconterò a Ilse", sub: "La Guardia deve sapere", cls: "hot", fn: () => { bond("guardia", 2); bond("trust", 1); back("guardia", "Ilse. Va bene. Lei ha visto la mano, al tuo esame: ti crederà. Ma fai attenzione: anche le comandanti hanno un Consiglio sopra la testa."); } },
          { label: "Resta tra noi, per ora", sub: "Con i Fuorimura", fn: () => { bond("fuori", 2); bond("trust", 2); back("fuori", "(Nives sorride. È la prima volta.) Grazie. Non tutti avrebbero scelto così. Ti porto io fino alla corda, per una strada che i Colossi non guardano mai."); } },
          { label: "Il Consiglio deve saperlo", sub: "È una scoperta troppo grande", fn: () => { bond("consiglio", 2); bond("trust", -2); back("consiglio", "(Nives si irrigidisce.) Il Consiglio lo sa già, {n}. Da duecento anni. Ma fai come vuoi. Torna da solo: la strada la conosci."); } },
        ], "mu_rovine");
      });
    }
    function back(path, line) {
      F.set("c2_rovine", path); setStep(N, 4);
      say([["mu_nives", line], ["voce", "Torni alla corda, risali il muro. In cima, il vento ti sembra diverso. O forse sei diverso tu."]], () => go("mu_muro", 24, 8));
    }
    function torneo() {
      X.playMatch({
        id: "mu_torneo", alt: "az,cage,hd", force: false, mate: "Teo Pietralunga", squad: ["Comandante Ilse Morra"], us: "Guardia del Muro", homeKit: ["#a8322a", "#e8e2d4"], azPitch: "camminamento", cageField: 2,
        chap: "Il Muro · Torneo della Cinta", bg: "mu_muro", intro: "Torneo della Cinta sul Camminamento: la Guardia del Muro di {n} e Teo contro i Quartieri della Città Bassa. Il vento soffia da nord.",
        oppNames: ["Fornaio Bruno", "Lavandaia Gisa", "Ciabattino Nello", "Portalettere Ada", "Maestro Pietro"],
        venue: { ads: [["TORNEO DELLA CINTA", "#a8322a"], ["CINTAVECCHIA", "#e8e2d4"], ["IL MURO CI PROTEGGE", "#6a1a24"], ["GUARDIA DEL MURO", "#a8322a"]], crowd: ["#a8322a", "#5a5a62", "#e8e2d4", "#6a6458", "#8a3a2a"], ground: ["#8a8478", "#827c70"], line: "#e8e2d4cc", grid: "rgba(0,0,0,.06)", tint: "rgba(255,220,180,.08)", glow: "255,220,170" },
        team: (t, s) => ({ name: "Quartieri", vs: "i Quartieri", color: "#6a6458", atk: t(s.tiro * 0.9), def: t(s.drib * 0.9), vel: t(s.tiro * 0.92), names: ["Fornaio Bruno", "Lavandaia Gisa", "Ciabattino Nello", "Portalettere Ada", "Maestro Pietro"] }),
        done: (r) => {
          if (r.win) X.reward("mu_c2_torneo", { coins: 35 });
          setStep(N, 5);
          say([["voce", `Torneo della Cinta: ${r.a} a ${r.b}.`], ["mu_orso", r.win ? "La Guardia vince! Il vento era con voi. O voi col vento. Non ho mai capito chi segue chi." : "I Quartieri vincono! Il fornaio piange di gioia. Il vento ride. Succede."],
            ["mu_teo", "{n}! Giù in città succede qualcosa. Corvino, il capo dei Fuorimura, ha sfidato la Guardia nella gabbia del vicolo. Dicono che il Consiglio abbia dimezzato le razioni alle loro famiglie. È una brutta cosa. Andiamo?"]], () => { learnLore("l_razioni", true); done(); });
        },
      });
    }
    function gabbia() {
      X.playMatch({
        id: "mu_gabbia", alt: "cage", mate: "Teo Pietralunga", squad: [F.get("c2_rovine") === "fuori" ? "Nives" : "Comandante Ilse Morra"], us: "Guardia del Muro", homeKit: ["#a8322a", "#e8e2d4"], cageField: 2, cageMut: "wet", cageTarget: 5,
        chap: "Il Muro · La Gabbia dei Fuorimura", bg: "mu_bassa", intro: "Nella gabbia del vicolo, sotto la pioggia: {n} e la Guardia contro i Fuorimura di Corvino.",
        oppNames: ["Corvino", "Gazza", "Cardo", "Ruggine", "Selce"],
        team: (t, s) => ({ name: "Fuorimura", vs: "i Fuorimura", color: "#2a2a30", atk: t(s.tiro * 0.97), def: t(s.drib * 0.95), vel: t(s.tiro * 1.0), names: ["Corvino", "Gazza", "Cardo", "Ruggine", "Selce"] }),
        done: (r) => {
          if (!r.win) return ask("mu_corvino", `${r.a} a ${r.b}. La gabbia è nostra. Ma hai giocato pulito, Guardia. Un'altra?`, [
            { label: "⚽ Rigioca nella gabbia", cls: "hot", fn: gabbia },
            { label: "Più tardi", sub: "Torna da Corvino quando vuoi", fn: done },
          ], "mu_bassa");
          const msg = X.reward("mu_c2_gabbia", { coins: 45 });
          X.api.play(X.lines([
            ["voce", `${r.a} a ${r.b}. Corvino si toglie il cappuccio sotto la pioggia, e ti stringe la mano. ${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}`],
            ["mu_corvino", "Patti sono patti. Ti dico cosa nasconde il Consiglio: un archivio. Dentro il muro. Il muro è cavo, recluta: ci sono corridoi, scale, stanze. Ci entra solo il Prevosto Grifo. E un vecchio muratore che fa finta di essere solo un vecchio muratore."],
            ["mu_corvino", "Ugolino. Chiedi a lui. E chiedigli perché il Portone ha le cerniere saldate dalla parte di dentro."],
            ["mu_saverio", "(dalla piazza, con un proclama in mano) Cittadini! Il Prevosto Grifo annuncia che da domani le calate dal muro sono chiuse per sempre. Chiunque esca sarà considerato un Fuorimura. E i Fuorimura… saranno trattati da Colossi."],
            ["mu_ilse", "(arriva di corsa, il mantello bagnato) Ho sentito. Il Consiglio ha paura, {n}. Hanno saputo delle Rovine. Qualcuno ha parlato. Da adesso, stiamo attenti a ogni parola."],
          ], "mu_bassa"), () => {
            finishChapter(N, F.get("c2_rovine", "ok")); setStep(N, 6);
            const msg2 = X.reward("mu_c2_fine", { coins: 70, cos: "mu_c2" });
            X.scene([["voce", `<b>Capitolo 2 concluso · Fuori</b><br>I Colossi sono i giocatori dei borghi rimasti fuori dal muro. E il muro è cavo.${msg2.length ? "<br>" + msg2.join(" · ") : ""}`]], done, "mu_bassa");
          });
        },
      });
    }
    const obj = {
      "mu_muro:k:24,6": () => (S() >= 1 && S() < 4 ? (S() === 1 && setStep(N, 2), go("mu_fuori", 20, 26)) : say([["voce", S() < 1 ? "La corda delle calate. Prima ascolta la Comandante." : "La corda delle calate, arrotolata. Il vento la fa oscillare come un pendolo."]])),
      "mu_fuori:k": () => (S() >= 4 ? go("mu_muro", 24, 8) : say([["mu_teo", "Già torni? Le Rovine sono a nord, {n}. Io tengo la corda. Vai, vai!"]])),
      "mu_fuori:^": () => { if (S() <= 2) return say([["voce", "Le Rovine sono lì davanti. Qualcuno, nell'erba alta poco più indietro, ti sta seguendo. Una ragazza col cappuccio grigio. Parlale."]]); go("mu_rovine", 15, 20); },
      "mu_rovine:v": () => (S() === 3 ? say([["voce", "Nives ti aspetta vicino al Colosso inginocchiato. Non puoi andartene così."]]) : go("mu_fuori", 20, 2)),
      "mu_rovine:n": () => { learnLore("l_tabellone", true); say([["voce", "Il tabellone di pietra, scolpito a mano: «BORGO DEI SALICI 3 · CINTAVECCHIA 2». Sotto, una data. Duecento anni fa. E più sotto ancora, piccolo, come un'aggiunta: «arrivederci a primavera»."]]); },
      "mu_rovine:o": () => (S() === 3 ? twist() : say([["voce", "Il Colosso inginocchiato tiene il pallone di pietra tra le mani. Gli occhi chiusi. Sembra che aspetti il fischio d'inizio da duecento anni."]])),
    };
    return {
      n: N, title: "Fuori", sub: "La Terra di Fuori, le Rovine, il Torneo, la Gabbia", start: "mu_muro", goal, zones, talk, obj, introBg: "mu_muro",
      patch: {
        mu_muro: { act: { "24,6": "Calati fuori dal muro" }, build(L) { L.put(24, 6, "k"); }, npcs: (s, list) => list.filter((n) => n.id !== "mu_teo").concat(s >= 4 ? [{ id: "mu_orso", at: [20, 8] }, { id: "mu_teo", at: [11, 9] }] : []) },
        mu_bassa: { npcs: (s, list) => list.filter((n) => n.id !== "mu_nives" || s < 5).concat(s >= 5 ? [{ id: "mu_corvino", at: [32, 20] }] : []) },
      },
      news: (id, s) => (id === "mu_ilse" && s === 0) || (id === "mu_nives" && (s === 2 || s === 3)) || (id === "mu_orso" && s === 4) || (id === "mu_corvino" && s === 5),
      intro: () => [
        ["voce", "All'alba, sul Camminamento. La nebbia copre la Terra di Fuori come un lenzuolo. Hai dormito poco: ogni volta che chiudevi gli occhi vedevi una mano di pietra che ti restituiva un pallone."],
        ["mu_teo", "Oggi scendiamo. Fuori. Fuori, {n}! Ho preparato la corda tre volte. Tre. Non si sa mai."],
      ],
    };
  }
  boot();
})();
