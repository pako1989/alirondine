// js/quartiere-c2.js - GLI STRAORDINARI DI QUARTIERE · Capitolo 2 «Il Dottor Cemento»
// Il cantiere del Dottor Cemento, al confine di Ponterotto: blocchi di ghiaccio, cassoni di ferro, cancelli con tre lucchetti.
// Per arrivare all'ufficio del Dottore servono tutti i poteri. E un pizzaiolo che non sapeva di essere un supereroe.
(function () {
  "use strict";
  function boot() { const D = window.__quartiere; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("sq_scintilla", { acc: ["grembiule"], name: "Scintilla, il pizzaiolo", tag: "", hair: "#8a2a1a", style: "curly", skin: "#d9a679", eye: "#3a2a1a", beard: true, bg: ["#1e1432", "#ff8a3a"], shirt: "#ffffff" },
      "Il pizzaiolo di Ponterotto. Non ha bisogno del forno: le sue mani sono il forno. Cuoce una margherita in quattro secondi. Una volta ha starnutito e ha acceso le candeline di un compleanno dall'altra parte della strada.");
    K.cast("sq_cemento", { acc: ["casco", "occhiali"], name: "Il Dottor Cemento", tag: "", hair: "#8a8a8a", style: "slick", skin: "#e8d0c0", eye: "#5a5a6a", bg: ["#1e1432", "#7a7a8a"], shirt: "#7a7a8a" },
      "Ingegnere, costruttore, inventore della Macchina Congelastrade. Vuole fare un parcheggio sul campetto di Ponterotto. Parla sempre di metri cubi. Non sorride mai, tranne quando parla di sua madre.");
    K.cos("sq_c2", { kind: "acc", label: "Maschera degli Straordinari", val: "bandana", from: "Capitolo 2 di Gli Straordinari di Quartiere" });
    K.cos("sq_fumetti2", { kind: "acc", label: "Fumetto spiegazzato", val: "taccuino", from: "Trova i fumetti perduti del cantiere" });
    const goal = (s) => ({
      0: "Il cantiere del Dottor Cemento. All'ingresso c'è una pizzeria con il forno spento. E un pizzaiolo che fuma, letteralmente.",
      1: "L'ufficio del Dottor Cemento è in fondo al cantiere: ghiaccio, ferro e cancelli. Cambia potere per passare.",
      2: "Avete battuto le Ruspe. Il Dottor Cemento ha una proposta.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      sq_cantiere: {
        region: "cantiere", name: "Gli Straordinari di Quartiere · Il cantiere", short: "Il cantiere", sub: "Ghiaccio, ferro e cancelli del Dottor Cemento", bg: "sq_cantiere", time: "giorno", travel: [2, 12],
        w: 34, h: 24, start: [2, 12], itemCos: "sq_fumetti2", items: [[3, 21], [12, 4], [20, 20]],
        areas: [[25, 1, 32, 22, "L'ufficio del Dottor Cemento"], [0, 0, 33, 23, "Il cantiere"]],
        flavor: { n: "Un cartello: «CANTIERE CEMENTO · Qui sorgerà il PARCHEGGIO PIÙ BELLO DEL MONDO (480 posti)»." },
        intro: [["voce", "Il cantiere del Dottor Cemento: ruspe ferme, sacchi di cemento, e una macchina strana che sputa ghiaccio sulle strade per chiuderle. In fondo, una baracca con scritto «UFFICIO». Davanti all'ingresso, una pizzeria col forno spento."]],
        npcs: (s) => [{ id: "sq_scintilla", at: F.is("sq_in_fuoco") ? [4, 14] : [5, 8] }, { id: "sq_ines", at: [3, 14] }, ...(s <= 2 ? [{ id: "sq_cemento", at: [28, 11] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a"); lay(0, 23, 33, 23, "a");
          lay(1, 11, 32, 13, ":");
          lay(9, 1, 9, 22, "I"); lay(16, 1, 16, 22, "K"); lay(23, 1, 23, 22, "X");
          house(2, 2, 6, 4, { door: [4, 5], roof: "#ff8a3a", wall: "#f4f0e4", rr: 2, enter: "La pizzeria di Scintilla: un forno a legna spento da anni («non serve», dice lui), farina ovunque, e una foto della prima pizza cotta con le mani. Sembra un po' bruciata." });
          house(26, 3, 6, 4, { door: [28, 6], roof: "#7a7a8a", wall: "#a8a8b0", rr: 2, enter: "L'ufficio del Dottor Cemento: plastici di parcheggi, righelli, una foto incorniciata di una signora anziana con una macchina rossa. Sotto, scritto a penna: «Mamma, un giorno avrai il tuo posto»." });
          put(3, 9, "n"); [[12, 18], [19, 6], [29, 17], [6, 19]].forEach(([x, y]) => put(x, y, "r")); put(2, 15, "s");
        },
      },
    };
    function matchRuspe() {
      K.combo({ title: "Combo di Squadra · Nel cantiere contro le Ruspe", oppStyle: "pressing", minutes: 60, heroes: K.squadra(["scatto", "fuoco", "calamita", "elastico"]),
        opp: { name: "Le Ruspe", color: "#ffd23f", players: [{ name: "Il Dottor Cemento", skin: "#e8d0c0", hair: "#8a8a8a" }, { name: "Betoniera" }, { name: "Gru" }], keeper: { name: "Il Pilastro" } },
        intro: "<p>Le Ruspe fanno <b>pressing</b>: da soli si perde palla. Scintilla è in squadra: prova il fuoco in coppia. I tiri di fuoco battono anche le trappole.</p>", winTitle: "IL CANTIERE SI FERMA!" }, (r) => {
        if (!r.win) return K.scene([["sq_cemento", "[pensa] (Prende appunti con un righello.) Squadra interessante. Fondamenta deboli. Riprovate."]], () => K.enterZone("sq_cantiere"), "sq_cantiere");
        setStep(N, 2); bond("squadra", 2);
        K.scene([["sq_cemento", "[sorpreso] (La Macchina Congelastrade fa un rumore triste e si spegne.) Avete… vinto. (Si toglie il casco.) Va bene. Vi faccio una proposta. Da ingegnere."]], () => K.enterZone("sq_cantiere"), "sq_cantiere");
      });
    }
    function pizza() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["sq_scintilla", r && r.win ? "[felice] Pizza per tutti! (Cuoce dieci margherite con un battito di mani.)" : "[ride] Perso? Pizza lo stesso. La pizza non giudica."]], () => K.enterZone("sq_cantiere"), "sq_cantiere");
      ask("sq_scintilla", "Una partita contro i muratori del turno di pranzo, per una teglia di pizza? Come la giochiamo?", [
        { label: "A combo", sub: "Combo di Squadra · la partita della saga", cls: "hot", fn: () => K.combo({ title: "Combo di Squadra · La partita della pizza", oppStyle: "equilibrata", minutes: 45, heroes: K.squadra(["scatto", "fuoco", "ghiaccio", "vento"]), opp: { name: "I muratori", color: "#a87a4a", players: [{ name: "Cazzuola" }, { name: "Mattone" }], keeper: { name: "Il Capomastro" } } }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "sq_pizza", alt: "az,cage,hd", force: false, oppTeam: "I muratori", oppColor: "#a87a4a", us: "Gli Straordinari", homeKit: ["#ff5a8a", "#ffd23f"], mate: "Scintilla", squad: ["Scintilla", "Brina", "Gommo"], chap: "Gli Straordinari di Quartiere · La partita della pizza", bg: "sq_cantiere", oppNames: ["Cazzuola", "Mattone", "Calce", "Trapano", "Il Capomastro"], intro: "Nel piazzale del cantiere, fra i sacchi di cemento.", done: after }) },
        { label: "Dopo", fn: done },
      ], "sq_cantiere");
    }
    const talk = {
      sq_scintilla() {
        if (S() === 0) return K.scene([["sq_scintilla", "[arrabbiato] (Fuma dalle orecchie, letteralmente.) Il Dottor Cemento mi ha chiuso la strada col ghiaccio. Nessuno arriva più in pizzeria! (Ti vede.) Tu sei quello che copia i poteri? Bene. Copia il mio. (Ti stringe la mano: scotta.) Sciogli quel ghiaccio. E già che ci sei, sciogli anche il Dottore."]], () => { K.recluta("fuoco"); setStep(N, 1); quest("sq_cemento", "L'ufficio del Dottor Cemento", "In fondo al cantiere: ghiaccio (fuoco), cassoni (calamita), cancelli (elastico)."); K.cambia("fuoco"); }, "sq_cantiere");
        return ask("sq_scintilla", "[felice] Il forno sono io. Intanto: una partita per una teglia di pizza?", [{ label: "La partita della pizza", sub: "Partita secondaria · scegli tu la modalità", fn: pizza }, { label: "Dopo", fn: done }], "sq_cantiere");
      },
      sq_ines() { return say([["sq_ines", S() === 1 ? "Ghiaccio, ferro, cancelli. Fuoco, calamita, elastico. (Un sacco di chiodi le vola in tasca.) Cambia potere dal menu, ragazzo. E fai attenzione a dove sei quando cambi." : "Il ferro di questo cantiere mi saluta. È un buon segno."]]); },
      sq_cemento() {
        const s = S();
        if (s === 1) return ask("sq_cemento", "(Seduto dietro una scrivania di cemento, con un righello in mano.) Il ragazzo che copia. Interessante. (Misura la scrivania, anche se l'ha già misurata.) Il parcheggio si farà. Ponterotto ha bisogno di posti macchina, non di un campetto di terra. Volete discutere, o volete giocare?", [
          { label: "«Perché proprio un parcheggio?»", sub: "Ascolta la sua storia", fn: () => { F.set("sq_cemento_ascoltato", true); bond("quartiere", 1); K.scene([["sq_cemento", "[pensa] (Guarda la foto sulla scrivania.) Mia madre ha novantun anni e una macchina rossa del 1974. Ogni domenica viene a trovarmi, e ogni domenica gira un'ora per parcheggiare. Un'ora. A novantun anni. (Si schiarisce la voce.) Quattrocentottanta posti. Uno, almeno, sarà il suo."], ["sq_cemento", "[arrabbiato] Ma i sentimenti non si costruiscono. Il cemento sì. Giochiamo: le Ruspe vi aspettano."]], matchRuspe, "sq_cantiere"); } },
          { label: "«Basta chiacchiere: giochiamo»", sub: "Combo di Squadra · partita importante", cls: "hot", fn: matchRuspe },
        ], "sq_cantiere");
        if (s === 2) return ask("sq_cemento", "(Stende un progetto sul tavolo.) Proposta: vi costruisco un campo nuovo, con l'erba vera e le tribune, fuori dal quartiere, vicino all'autostrada. In cambio, il campetto diventa parcheggio. È un buon affare. (Pausa.) Davvero.", [
          { label: "«Accettiamo lo scambio»", sub: "Un campo nuovo, ma lontano", big: true, fn: () => fine2("scambio") },
          { label: "«Il campetto resta dov'è»", sub: "Si decide in campo", big: true, fn: () => fine2("rifiuto") },
        ], "sq_cantiere");
        return say([["sq_cemento", "Metri cubi. Tutto è metri cubi."]]);
      },
    };
    function fine2(kind) {
      F.set(kind === "scambio" ? "sq_scambio" : "sq_rifiuto", true); bond("quartiere", kind === "rifiuto" ? 2 : 0);
      questDone("sq_cemento");
      const msg = K.reward("c2:sq", { coins: 90, cos: ["sq_c2"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "scambio" ? [["sq_cemento", "[felice] Affare fatto. (Vi stringe la mano a uno a uno; a Scintilla si brucia un po'.) Ma il quartiere deve firmare. Tutto il quartiere. Domenica, al campetto."], ["sq_ines", "[pensa] Il quartiere deve firmare. (Ti guarda.) E il quartiere, domenica, vorrà vedere una partita. Lo conosco."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La partita del campetto».`]]
        : [["sq_cemento", "[arrabbiato] Il campetto resta dov'è. (Arrotola il progetto.) Allora lo decidiamo come lo decidete voi: in campo. Domenica. La Squadra Calcestruzzo contro gli Straordinari. Chi vince, decide."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La partita del campetto».`]], () => K.openMain(), "sq_cantiere");
    }
    return { n: N, title: "Il Dottor Cemento", sub: "Scintilla, il cantiere, le Ruspe, la proposta", goal, start: "sq_cantiere", introBg: "sq_cantiere", zones, talk,
      intro: () => [["voce", "<b>GLI STRAORDINARI DI QUARTIERE</b> · numero 2. Il Dottor Cemento ha chiuso le strade col ghiaccio, i cassoni e i cancelli. Per arrivare da lui servono cinque poteri. Gli Straordinari ne hanno quattro."]] };
  }
  boot();
})();
