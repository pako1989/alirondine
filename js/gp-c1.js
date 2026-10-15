// js/gp-c1.js - GRAN PREMIO DEL PALLONE · Capitolo 1 «La Griglia di Partenza»
// Palladoro, il paddock. Un telecronista che urla, un meccanico con una macchinina e un biglietto, un Commissario fatto di nuvola.
// La prima tappa: Giro e Gol contro la campionessa in carica. Dopo, un dubbio sulla frizione che fumava.
(function () {
  "use strict";
  function boot() { const D = window.__gp; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N), CH = () => K.mem().ch;

    K.cast("gp_bullone", { beard: "baffi", acc: ["chiave"], name: "Tonino Bullone", tag: "", hair: "#c8c8d0", style: "buzz", skin: "#d9a679", eye: "#3a3a2a", bg: ["#1c2040", "#2a6adf"], shirt: "#2a6adf" },
      "Sessant'anni di bulloni. Capo, meccanico, cuoco e unico dipendente dell'Officina Bullone. Parla alle macchine come ai nipoti e ai nipoti come alle macchine. Il suo motto: «Si stringe a mano.»");
    K.cast("gp_rosalba", { streak: "#ff4d5a", acc: ["visiera"], name: "Rosalba Turbo", tag: "", hair: "#d8302a", style: "ponytail", skin: "#e8c4a0", eye: "#3a2a2a", bg: ["#2a1010", "#d8302a"], shirt: "#d8302a" },
      "La campionessa in carica del Gran Premio, tre coppe di fila. Tuta rossa, coda alta, sorriso che dà il tempo. Gareggia per la Scuderia Fiamma e dice sempre la verità, anche quando le costa un sorpasso.");
    K.cast("gp_gridoni", { acc: ["cuffie"], name: "Cesare Gridoni", tag: "", hair: "#2a1a10", style: "slick", skin: "#e0b890", eye: "#3a3a2a", bg: ["#2a1a3a", "#ffd23f"], shirt: "#ffd23f" },
      "Il telecronista del Gran Premio. Ha la voce di uno che sta cadendo da un palazzo con molta soddisfazione. Ogni gara per lui è la più bella della storia: la sera prima, quella di ieri.");
    K.cast("gp_nembo", { shape: "nuvola", name: "Commissario Nembo", tag: "", skin: "#eef2fa", shirt: "#8ab0d8", eye: "#2a2a4a", hair: "#eef2fa", bg: ["#1c2040", "#8ab0d8"] },
      "Il commissario di gara: una nuvola con un fischietto, una canna da pesca e un regolamento. Sventola le bandiere dall'alto e le multe dal basso. Non sbaglia mai e non ha mai ragione fino in fondo.");
    K.cast("gp_gommino", { acc: ["occhiali"], name: "Signor Gommino", tag: "", hair: "#c8c8d0", style: "bald", skin: "#e8c4a0", eye: "#3a3a2a", bg: ["#2a1a0a", "#c8a040"], shirt: "#c8a040" },
      "Lo sponsor: Gommalux, «la gomma che ti ricorda». Rotondo, lucido, sempre in giacca d'oro. Compra tutto quello che si muove, e anche quello che sta fermo se ha il logo.");

    K.cos("gp_c1", { kind: "shirt", label: "Tuta dell'Officina Bullone", val: "#2a6adf", from: "Completa il Capitolo 1 di Gran Premio del Pallone" });
    K.cos("gp_bulloni", { kind: "hairc", label: "Capelli d'Oro", val: "#e8b83a", from: "Raccogli tutti i bulloni d'oro del paddock" });
    K.cos("gp_casco", { kind: "acc", label: "Casco del Gran Premio", val: "casco", from: "Vinci la prima tappa" });
    K.lore("l_regola", { t: "Il Regolamento Pallone", d: "Art. 1: ogni giro si chiude in area con un tiro. Art. 2: la velocità d'ingresso decide la potenza. Art. 3: chi supera il rivale lo tiene a bada anche nel contropiede. Art. 4: tutto il resto, chiedere al Commissario." });
    K.lore("l_rondinella", { t: "La Rondinella", d: "Una macchinina blu con le strisce gialle, costruita da Tonino con tre vecchie auto e una lavatrice. In pista la guidi col dito. Nel paddock la guidi col menu: salta i fossi e lascia una scia." });
    K.lore("l_giroegol", { t: "Giro e Gol", d: "La gara del Gran Premio. Corri, raccogli turbo e mirini, supera il rivale e arriva in area: la velocità con cui entri è la potenza del tuo tiro. Poi il contropiede, e il giro dopo." });
    K.lore("l_coppa", { t: "La Coppa Rotonda", d: "Il trofeo del Gran Premio: una coppa a forma di pallone, con due manici. Nessuno ha mai capito perché due. Il custode dice: «Perché sì»." });

    K.lore("l_giardino", { t: "Il Giardino dei Trofei", d: "Una casetta con il tetto d'oro, sopra un'isola. Dentro, un giardino che non si vede dalla strada, e una Coppa Rotonda piccola come un pallone vero. Sotto, una targhetta: «Per chi arriva con le sue mani»." });
    const goal = (s) => ({
      0: "Palladoro, il paddock. Il telecronista Gridoni è accanto al tabellone dei tempi: parlaci.",
      1: "Il box dell'Officina Bullone è la porta in alto a sinistra. Parla con Tonino.",
      2: "Tonino ti ha dato la Rondinella. Nel box scegli le gomme (pila di gomme), poi vai in pista (est) dal Commissario Nembo.",
      3: "Via libera dal Commissario. Rosalba ti aspetta in pista, sulla griglia.",
      4: "Tappa vinta. Rosalba ti aspetta alla fine della griglia.",
    }[s] || "Capitolo concluso. Il Giro Lungo ti aspetta in paddock.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y, col) { g.font = "bold 7px Trebuchet MS, sans-serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(18,20,36,.88)"); R(g, x - w / 2, y + 2, w, 1, col || "#ffb02a"); g.fillStyle = "#fff6e0"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }

    const zones = {
      gp_paddock: {
        region: "pista", name: "Gran Premio del Pallone · Il Paddock", short: "Il Paddock", sub: "Palladoro, dove si prepara il Gran Premio", time: "giorno", w: 30, h: 22, start: [14, 12], itemCos: "gp_bulloni", items: [[3, 17], [26, 19], [12, 19]],
        bg: "gp_paddock",
        areas: [[2, 1, 10, 7, "Il Box Bullone"], [11, 1, 17, 6, "Gommalux Hospitality"], [20, 1, 27, 7, "La Torre di Controllo"], [0, 0, 29, 21, "Il Paddock"]],
        act: { n: "Leggi il cartello", b: "Siediti", t: "Guarda l'albero", l: "Guarda il lampione", O: "Guarda le gomme", A: "Guarda il tabellone dei tempi", P: "Guarda il podio", Y: "Guarda la pompa", U: "Guarda il maxischermo", K: "Guarda il cartellone", ">": "Vai in pista", q: "Entra" },
        flavor: {
          n: ["Un cartello: «PADDOCK · VELOCITÀ MASSIMA 20 · PER I CARRELLI. PER I PILOTI, NESSUNA: DEVONO SOLO STARE ATTENTI A NON INVESTIRE IL TELECRONISTA».", "Un avviso: «Vietato lasciare gomme in giro. Ammesso lasciare bulloni, per scaramanzia»."],
          b: "Ti siedi. Dalla panchina si vede tutto il paddock e, in lontananza, un ragazzo che prova lo stesso sorpasso da tre ore.",
          t: "Un albero ben tenuto. È il solo in tutto il circuito che non abbia mai preso un cono in testa.",
          l: "Un lampione con un adesivo: «SORRIDI, SEI IN DIRETTA». Non c'è nessuna telecamera. Probabilmente.",
          O: "Gomme impilate con il marchio Gommalux. Odorano di gomma nuova e di un po' di destino.",
          A: "Il tabellone dei tempi: i numeri scorrono più veloci delle macchine. Quello in cima dice «CAMPIONESSA: ROSALBA T.».",
          P: "Il podio: tre gradini, il più alto è lucido come un'ostrica. I due lati hanno qualche graffio da champagne.",
          Y: "Una pompa rossa. Accanto, un cartello: «Il pieno si paga. Il vuoto, di più».",
          U: "Il maxischermo mostra la ripetizione di un sorpasso. La ripetizione è più lunga del sorpasso.",
          K: ["«GOMMALUX · LA GOMMA CHE TI RICORDA». Chi la compra, se la ricorda.", "«VROOM BANK · PRESTITI A GIRO LANCIATO». Il tasso è in piccolo, anzi, in minuscolo.", "«PIZZA GIRO · LA PIZZA CHE NON ASPETTA». Soprattutto i semafori."],
        },
        intro: [["voce", "Palladoro, la città che corre. Il paddock profuma di benzina, di zucchero filato e di cambiamento d'idea."], ["voce", "Altoparlanti: «ATTENZIONE: IL GRAN PREMIO DEL PALLONE COMINCIA TRA POCO! PER CHI HA FRETTA: È GIÀ COMINCIATO!»"]],
        npcs: () => {
          const c = CH(), s = K.stepOf(c), fin = (c === 2 && s >= 3) || c >= 3;
          return [{ id: "gp_gridoni", at: [13, 10] }].concat(fin ? [{ id: "gp_nembo", at: [20, 12] }, { id: "gp_rosalba", at: [16, 12] }] : [], c >= 3 ? [{ id: "gp_gommino", at: [24, 13] }] : []);
        },
        build(L) {
          const { lay, put, house } = L, c = CH();
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 9, "t"); lay(29, 12, 29, 21, "t");
          lay(1, 8, 28, 15, "+"); lay(12, 7, 17, 8, "+"); lay(1, 10, 28, 11, ":");
          house(2, 1, 8, 6, { door: [5, 6], roof: "#2a3a8a", wall: "#d8dce8", rr: 3, lit: true, enter: { to: "gp_box", at: [8, 9] } });
          house(11, 1, 7, 6, { door: [14, 6], roof: "#8a6a1a", wall: "#e8d8a8", rr: 3, lit: true, enter: c >= 2 ? { to: "gp_salotto", at: [7, 7] } : "Gommalux Hospitality. Sulla porta: «SOLO SU INVITO». Dall'interno arriva il rumore di un tappo che salta. È un salotto, quindi: champagne." });
          house(20, 1, 8, 6, { door: [23, 6], roof: "#8a2a2a", wall: "#d8d0d8", rr: 3, lit: true, enter: c >= 2 ? { to: "gp_cabina", at: [7, 7] } : "La Torre di Controllo e di Telecronaca. Dalla finestra sporge un microfono che sembra ascoltarti. La porta è chiusa: «TELECRONACA IN CORSO»." });
          put(25, 9, "A"); put(10, 13, "O"); put(11, 13, "O"); put(22, 14, "Y"); put(3, 9, "U"); put(16, 18, "P"); put(15, 18, "P");
          put(7, 12, "b"); put(21, 9, "b"); put(8, 16, "n"); put(18, 9, "l"); put(2, 16, "t"); [[26, 17], [4, 19], [13, 17], [27, 12]].forEach(([x, y]) => put(x, y, "t"));
          [[1, 15], [28, 8], [6, 7], [26, 15]].forEach(([x, y]) => put(x, y, "K")); put(18, 14, "s");
          put(29, 10, ">"); put(29, 11, ">");
        },
        decor(g, cx, cy, d) { plaque(g, "BOX BULLONE", d.X(6) + 8, d.Y(1) - 2); plaque(g, "GOMMALUX", d.X(14) + 8, d.Y(1) - 2, "#ffd23f"); plaque(g, "TORRE", d.X(23) + 8, d.Y(1) - 2, "#d8302a"); plaque(g, "IN PISTA →", d.X(26) + 8, d.Y(12) - 4); },
      },
      gp_pista: {
        region: "pista", name: "Gran Premio del Pallone · La Pista Prove", short: "La Pista Prove", sub: "Un anello d'asfalto, fossi e cordoli", time: "giorno", w: 30, h: 22, start: [4, 10], items: [[10, 7], [16, 12], [20, 15]],
        bg: "gp_pista",
        areas: [[3, 3, 26, 18, "L'anello"], [18, 8, 23, 13, "L'isola"], [0, 0, 29, 21, "La Pista Prove"]],
        act: { n: "Leggi il cartello", t: "Guarda l'albero", K: "Guarda il cartellone", O: "Guarda le gomme", F: "Guarda la griglia", q: "Entra", "<": "Torna al paddock", l: "Guarda il lampione", b: "Siediti" },
        flavor: {
          n: ["Un cartello: «CURVA DEL TIFOSO · CHI TAGLIA, TAGLIA. CHI NON TAGLIA, SORPASSATO»", "Un cartello: «FOSSATO · ATTRAVERSAMENTO RISERVATO A CHI SA SALTARE. E A CHI HA UNA MACCHINA»."],
          t: "Un albero spettatore. Ha visto diecimila sorpassi e nessuno gli ha mai detto bravo.",
          K: ["«OLIO BULLONE · SE SCIVOLI, È COLPA NOSTRA»", "«TURBO-LATTE · LA COLAZIONE CHE SCATTA»"],
          O: "Gomme usate come paraurti. Una porta il segno di un sorpasso rimasto in sospeso.",
          F: "La griglia di partenza: due righe bianche, una scritta «QUI», e il resto è speranza.",
          l: "Un lampione a forma di bandiera a scacchi. Di notte fa pensare a una partita a dama in volo.",
          b: "Una panchina con una scritta: «PRENDI IL TEMPO». Qualcuno ha aggiunto: «ANCHE LA PANCHINA».",
        },
        intro: [["voce", "La Pista Prove: un anello d'asfalto con l'erba al centro, i cordoli rossi e bianchi e un fosso largo come un'idea. Dall'altra parte del fosso, un'isoletta con una casetta. Come ci si arriva? In macchina, è chiaro."]],
        npcs: () => {
          const c = CH(), s = K.stepOf(c);
          return (c === 1 && s >= 2 ? [{ id: "gp_nembo", at: [9, 4] }] : []).concat(c === 1 && s >= 3 ? [{ id: "gp_rosalba", at: [5, 15] }] : [], c === 2 ? [{ id: "gp_smeraldo", at: [20, 4] }] : []);
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 9, "t"); lay(29, 12, 29, 21, "t");
          lay(3, 3, 26, 5, ":"); lay(3, 16, 26, 18, ":"); lay(3, 3, 5, 18, ":"); lay(24, 3, 26, 18, ":"); lay(0, 10, 3, 11, ":");
          lay(12, 7, 14, 14, "w"); lay(17, 7, 23, 14, "w"); lay(18, 8, 22, 13, ":");
          house(19, 8, 3, 3, { door: [20, 10], roof: "#c8a040", wall: "#f0e8c8", rr: 2, lit: true, enter: { to: "gp_giardino", at: [7, 8] } });
          put(20, 11, ":"); put(4, 9, "F"); put(5, 9, "F");
          put(9, 9, "O"); put(10, 9, "O"); put(16, 4, "K"); put(8, 17, "K"); put(25, 7, "n"); put(4, 5, "n"); put(4, 14, "b");
          [[8, 12], [15, 16], [22, 6], [9, 14], [11, 6]].forEach(([x, y]) => put(x, y, "t")); put(23, 15, "l"); put(7, 7, "s");
          put(0, 10, "<"); put(0, 11, "<");
        },
        decor(g, cx, cy, d) { plaque(g, "GRIGLIA", d.X(4) + 12, d.Y(8) - 2); plaque(g, "ISOLA", d.X(20) + 8, d.Y(7) - 2, "#ffd23f"); plaque(g, "← AL PADDOCK", d.X(1) + 8, d.Y(9) - 2); },
      },
      gp_giardino: {
        interior: true, region: "oasi", name: "Gran Premio del Pallone · Il Giardino dei Trofei", short: "Il Giardino dei Trofei", sub: "Un giardino segreto sopra un fosso", bg: "gp_giardino", w: 14, h: 10, start: [7, 8], outside: ["gp_pista", 20, 11], items: [[3, 6]],
        act: { P: "Guarda la Coppa", v: "Esci", t: "Guarda l'albero", b: "Siediti" },
        flavor: { t: "Un albero con i frutti rotondi. Non sono arance: sono bulloni d'oro, ancora acerbi.", b: "Una panchina di sassi. Da qui si sente solo il silenzio, e il motore del cuore." },
        intro: [["voce", "Il Giardino dei Trofei: un prato perfetto, un albero con i frutti dorati e un altare di sassi. Si sente solo il silenzio, e il motore del cuore."]],
        npcs: () => [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v"); put(6, 2, "P"); put(7, 2, "P"); put(2, 3, "t"); put(11, 3, "t"); put(2, 7, "b");
        },
      },
      gp_box: {
        interior: true, region: "box", name: "Gran Premio del Pallone · Il Box Bullone", short: "Il Box Bullone", sub: "Olio, chiavi inglesi, una radio", bg: "gp_box", w: 16, h: 12, start: [8, 9], outside: ["gp_paddock", 5, 7], items: [[13, 8]],
        act: { O: "Guarda le gomme", M: "Guarda il banco attrezzi", F: "Guarda la Rondinella", v: "Esci", Y: "Guarda la pompa", W: "Guarda la finestra", L: "Guarda gli scaffali", x: "Apri la cassetta" },
        flavor: { Y: "Una pompa dell'olio. Qualcuno ha scritto sopra «NON È CAFFÈ», e di sotto «ANCHE SE NE HA L'ARIA».", W: "Dalla finestra si vede il paddock e un cartello che dice «PREGO, ASPETTARE LA PROPRIA CURVA».", L: "Scaffali di pezzi di ricambio, ognuno con un'etichetta scritta a mano. L'etichetta «VARIE» è più grande di tutte le altre messe insieme." },
        intro: [["voce", "Il Box Bullone: tre pareti, un tetto e un'insegna. Non c'è nessuno da quattro anni a parte Tonino, una radio e un gatto di nome Dado."]],
        npcs: () => [{ id: "gp_bullone", at: [5, 7] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          lay(6, 3, 9, 4, "F"); put(2, 3, "M"); put(3, 3, "M"); put(12, 3, "O"); put(13, 3, "O"); put(11, 2, "L"); put(3, 1, "W"); put(7, 1, "W"); put(2, 9, "Y");
        },
      },
    };

    // ------------------------------------------------------------ le gomme (box) e la gara (Rosalba)
    function gomme() {
      const g = K.gomme();
      ask("gp_bullone", `Le gomme, caro. Adesso hai le <b>${g === "grip" ? "gomme di grip" : g === "speed" ? "gomme veloci" : "gomme miste"}</b>. Che facciamo?`, [
        { label: "Grip", sub: "Sterzano di più, perdonano l'erba", cls: g === "grip" ? "hot" : "", fn: () => { F.set("gp_gomme", "grip"); K.note("Gomme: grip."); say([["gp_bullone", "Grip. Per chi ama le curve più degli sprint."]], () => { if (S() === 2) F.set("gp_gomme_set", true); done(); }); } },
        { label: "Veloci", sub: "Più velocità, curve più larghe", cls: g === "speed" ? "hot" : "", fn: () => { F.set("gp_gomme", "speed"); K.note("Gomme: veloci."); say([["gp_bullone", "Veloci. Ricordati di sterzare un po' prima: la strada non lo fa per te."]], () => { if (S() === 2) F.set("gp_gomme_set", true); done(); }); } },
        { label: "Miste", sub: "Di tutto un po'", cls: g === "mix" ? "hot" : "", fn: () => { F.set("gp_gomme", "mix"); K.note("Gomme: miste."); say([["gp_bullone", "Miste. Non vincono tutto, ma non perdono mai tutto."]], () => { if (S() === 2) F.set("gp_gomme_set", true); done(); }); } },
        { label: "Lascia stare", fn: done },
      ], "gp_box");
    }
    const OPP1 = { name: "Scuderia Fiamma", color: "#d8302a", players: [{ name: "Rosalba" }, { name: "Fiammetta" }], keeper: { name: "Il Palo Bionico" } };
    function gara1() {
      K.gara({
        title: "Tappa 1 · Gran Premio di Palladoro", laps: 3, bg: "gp_pista", oppStyle: "equilibrata", opp: OPP1,
        intro: "<p>La prima tappa. <b>Tre giri</b> sulla Pista Prove, un tiro per giro. Il rivale è Rosalba, in rosso: se la superi, il suo contropiede è debole. Le gomme che hai scelto si sentono in curva.</p>",
        done: (r) => {
          if (r.quit) return say([["gp_rosalba", "Ti ritiri? Non è un reato. Ma io, ad aspettare, ci metto la benzina."]]);
          F.set("gp_m1", r.win ? "vinta" : "persa"); K.learnLore("l_giroegol", true);
          if (!r.win) return K.scene([["voce", "Bandiera a scacchi. Per te, la bandiera è un fazzoletto."], ["gp_gridoni", "[sorpreso] E ROSALBA VINCE! DI NUOVO! COME OGNI VOLTA CHE NON VINCE NESSUN ALTRO!"], ["gp_rosalba", "[felice] Hai preso bene le curve. Riprova: ti aspetto sulla griglia."]], () => K.enterZone("gp_pista"), "gp_pista");
          setStep(N, 4);
          K.scene([
            ["voce", "Bandiera a scacchi! La Rondinella taglia il traguardo con l'orgoglio di una lavatrice che ha vinto un concorso di bellezza."],
            ["gp_gridoni", "[felice] E IL CAMPIONE VINCE! CHE GIRO! CHE TIRO! CHE… CHE… SCUSATE, MI È ENTRATA UNA MOSCA NEL MICROFONO!"],
            ["gp_rosalba", "[ride] Bel lavoro. Davvero. Ma prima di salire sul podio: la tua frizione fumava, in curva tre. Strano. La mia macchina fuma solo per scena."],
          ], () => end1Choice(), "gp_podio");
        },
      });
    }
    function end1Choice() {
      ask("gp_rosalba", "Dunque: la prima tappa è tua. Ti fa piacere, o hai già in testa la prossima?", [
        { label: "Stringerle la mano", sub: "Rispetto, da pilota a pilota", cls: "hot", big: true, fn: () => end1("mano") },
        { label: "«Rivincita quando vuoi, campionessa»", sub: "Sfida sorridente", big: true, fn: () => end1("sfida") },
        { label: "«La frizione fumava? Chi c'era vicino alla macchina?»", sub: "Cominciare a farsi domande", big: true, fn: () => end1("dubbio") },
      ], "gp_podio");
    }
    function end1(kind) {
      if (kind === "mano") { bond("rosa", 2); bond("team", 1); } else if (kind === "sfida") { bond("rosa", 1); bond("team", 2); } else { bond("rosa", 0); bond("team", 1); F.set("gp_dubbio", true); }
      F.set("gp_titolo", true); F.set("gp_tuta", true);
      const msg = K.reward("ch:gp_c1", { coins: 80, cos: ["gp_c1", "gp_casco"] });
      finishChapter(N); setStep(N, 5); questDone("gp_prima");
      const L = {
        mano: [["gp_rosalba", "Una mano ferma. Mi piace. Nel prossimo giro non ti faccio sconti, però: a me i sorpassi vengono in sconto solo per Natale."]],
        sfida: [["gp_rosalba", "[ride] «Quando vuoi». L'hai detto tu. Ti prendo in parola, e in curva."]],
        dubbio: [["gp_rosalba", "[pensa] Tutti. Qui tutti vedono tutto, e nessuno ha visto niente. Se ti serve una mano a guardare meglio, il mio box è aperto. A modo mio."]],
      }[kind];
      K.scene([...L,
        ["gp_nembo", "[furbo] Fischio, sventolo, verbalizzo. La prossima tappa è il Giro Lungo: un circuito vero, in città, con curve che nessuno ha ancora provato. Passate dal paddock."],
        ["voce", `<b>Fine del Capitolo 1 · La Griglia di Partenza.</b> ${msg.join(" · ")}<br><span style="color:var(--dim)">Il Giro Lungo ti aspetta: nel paddock, fai due chiacchiere con il telecronista.</span>`],
      ], () => K.openMain(), "gp_podio");
    }

    const talk = {
      gp_gridoni() {
        const s = S(), here = K.api.trZone();
        if (s >= 5) return say([["gp_gridoni", K.pick(["[felice] SIGNORE E SIGNORI! UN CAMPIONE CHE CORRE! UN PALLONE CHE ARRIVA! UN TELECRONISTA CHE NON HA PIÙ VOCE! (Non è vero: ne ho di scorta.)", "In questo momento, a Palladoro, il paddock è il posto più bello del mondo. Dopodomani lo dirò di un altro."])]]);
        if (s >= 1) return say([["gp_gridoni", s === 1 ? "Tonino! Box Bullone! In alto a sinistra! Se non ti sbrighi, lo dico io al microfono!" : K.pick(["AMICI! Rosalba è là in pista che si scalda. Io mi scaldo qui, ad alta voce.", "Gomme, benzina e nervi: il Gran Premio si fa con tre cose, e la terza è la mia."])]]);
        say([
          ["gp_gridoni", "[felice] AMICI! Un forestiero! Un pilota! Un biglietto di Tonino Bullone nel taschino! Io sono Gridoni, la voce del Gran Premio!"],
          ["gp_gridoni", "Qui a Palladoro il campionato è una gara E una partita: ogni giro si chiude con un tiro in area. Sembra una follia. Lo è. Per questo ci piace."],
          ["gp_gridoni", "Il box di Tonino è in alto a sinistra: porta blu. Ha la macchina. Non ha il pilota. Non ha, onestamente, molto altro."],
        ], () => { setStep(N, 1); quest("gp_prima", "La prima tappa", "Il box Bullone è la porta blu in alto a sinistra. Parla con Tonino."); K.learnLore("l_regola", true); done(); });
      },
      gp_bullone() {
        const s = S();
        if (s >= 5) return K.PASS;
        if (s >= 3) return say([["gp_bullone", K.pick(["La Rondinella ha tutti i bulloni al loro posto. Quasi tutti. Uno lo tengo per la fortuna.", "Vai, vai. Io resto qui a stringere. E a pregare, ma con la chiave inglese in mano."])]]);
        if (s === 2) return F.is("gp_gomme_set") ? say([["gp_bullone", "Gomme scelte. Ora in pista, dal Commissario Nembo: cancello a est, nel paddock. Ti dà il via libera."]]) : say([["gp_bullone", "Prima le gomme: la pila a destra. Poi il Commissario."]], gomme);
        say([
          ["gp_bullone", "[felice] Il pilota! Hai letto il biglietto? «Compenso: panino»? Il panino c'è. Lo ha mangiato Dado, il gatto, ma c'è stato."],
          ["gp_bullone", "L'Officina Bullone ha una macchina e nessuno che la guidi. Il mio pilota è andato via. Ha dato le dimissioni a un cartello stradale, non a me: ci sono rimasto male."],
          ["gp_bullone", "Questa è la Rondinella. Tre auto e una lavatrice. Si guida col dito, e a me piace: è sempre stata più sincera di un volante."],
        ], () => { F.set("gp_auto", true); K.learnLore("l_rondinella", true); setStep(N, 2); quest("gp_prima", "La prima tappa", "Scegli le gomme nel box, poi vai in pista dal Commissario Nembo."); K.note("Hai la Rondinella: dal menu «Sali sulla Rondinella»."); say([["voce", "La Rondinella è tua. Dal menu della zona puoi salirci: in macchina salti i fossi e lasci la scia. Per scendere, serve la riva."]], done); });
      },
      gp_nembo() {
        const s = S(), c = CH();
        if (c === 1 && s === 2) {
          return say([
            ["gp_nembo", "[furbo] Commissario Nembo. Vigilo dall'alto, così nessuno dice che ho preso parte."],
            ["gp_nembo", "Regola uno: ogni giro finisce con un tiro. Regola due: la velocità d'ingresso è la potenza. Regola tre: chi supera il rivale lo tiene a bada. Regola quattro: non sgridare la nuvola."],
            ["gp_nembo", "Hai le gomme, hai la macchina, hai la faccia. Via libera. Rosalba è sulla griglia. Buona fortuna, e occhio ai coni: a me piacciono, ma non nel mio campo visivo."],
          ], () => { setStep(N, 3); K.learnLore("l_regola", true); done(); });
        }
        if (c === 1 && s >= 3) return say([["gp_nembo", "Vai a prendere la tua partita. Io fischio, tu corri."]]);
        return K.PASS;
      },
      gp_rosalba() {
        const c = CH(), s = S();
        if (c === 1 && s === 3) return ask("gp_rosalba", F.get("gp_m1") === "persa" ? "Ancora? Mi piace chi non ha paura di un secondo posto." : "Sei il pilota di Tonino? Rosalba Turbo. Qui si fa un giro sull'anello, un tiro a giro, e chi vince ha l'ultima parola. Pronto?", [
          { label: "Gioca la prima tappa", sub: "Giro e Gol · 3 giri · gara forzata", cls: "hot", fn: gara1 },
          { label: "Ancora un momento", fn: done },
        ], "gp_pista");
        if (c === 1 && s === 4) return end1Choice();
        return K.PASS;
      },
    };
    const obj = {
      "gp_paddock:>": () => (S() >= 2 || CH() > 1 ? go("gp_pista", 1, 10) : say([["voce", "Un cancello d'asfalto che dà sulla pista. Prima trova Tonino Bullone, al box: ti serve almeno una macchina."]])),
      "gp_pista:<": () => go("gp_paddock", 28, 10),
      "gp_giardino:P": () => {
        if (!F.is("gp_giardino")) { F.set("gp_giardino", true); F.set("gp_mirino", true); K.learnLore("l_giardino", true); K.note("Il Giardino dei Trofei: trovato."); return say([["voce", "Sull'altare di sassi, una Coppa Rotonda piccola come un pallone vero, con due manici. Sotto, una targhetta: «Per chi arriva con le sue mani»."], ["voce", "La sollevi. Pesa quanto un'idea. In giro per il giardino, qualcosa luccica: la sensazione, strana, di avere un po' di mira in più. (Mirino del fondatore: solo nelle gare di questa saga.)"]], done); }
        say([["voce", "La Coppa del Giardino: piccola, due manici, tutta tua."]]);
      },
      "gp_box:O": () => gomme(),
      "gp_box:F": () => say([["voce", F.is("gp_auto") ? "La Rondinella: blu con le strisce gialle, un fanale che guarda a sinistra e uno che guarda un po' più in là. È tua." : "Una macchinina blu con le strisce gialle e una bottiglia di vernice sul cofano. Tonino la guarda come un figlio."]], () => { K.learnLore("l_rondinella", F.is("gp_auto")); done(); }),
      "gp_box:M": () => {
        if (CH() === 1 && S() < 3) return say([["voce", "Il banco attrezzi: una chiave da dodici, una da tredici, una a forma di nuvola. Tutte sporche d'olio e di principio."]]);
        if (!F.is("gp_c2")) { F.set("gp_c2", true); K.note("Indizio: un bullone allentato e la cartina di una caramella alla menta."); return say([["voce", "Sul banco, accanto alla chiave a nuvola, un bullone di ricambio con il filetto limato. E, incastrata nella morsa, la cartina di una caramella alla <b>menta forte</b>."], ["voce", "Tonino non mangia menta: dice che gli ricorda il dentista. Annoti la cosa, a modo tuo."]], done); }
        say([["voce", "Il banco: chiavi, olio e una cartina di menta che sai già a chi puntare. O quasi."]]);
      },
    };
    return { n: N, title: "La Griglia di Partenza", sub: "Il paddock, il box, la prima tappa", goal, start: "gp_paddock", introBg: "gp_paddock", zones, talk, obj, patch: {},
      intro: () => [["voce", "Palladoro, la città che corre. Il Gran Premio del Pallone dura un anno e ogni gara è anche una partita: ogni giro finisce con un tiro in area."], ["voce", "Tu sei arrivato con un biglietto di Tonino Bullone: «Cercasi pilota. Requisiti: due mani, due piedi, nessuna paura delle curve. Compenso: panino.»"]] };
  }
  boot();
})();
