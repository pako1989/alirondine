// js/detective-c1.js - DETECTIVE DI CAMPO · Capitolo 1 «La moviola»
// Portagrigia, di notte, sotto la pioggia. L'ispettrice Agata Brina, la Questura (si entra), il Caffè Fuorigioco (si entra),
// lo Stadio Comunale con la Sala Moviola e lo spogliatoio degli arbitri (si entra). Il caso: Portagrigia–Valfonda 0-3.
// Moviola con tre dettagli da trovare, interrogatorio con «Presenta la prova», e l'azione chiave da rigiocare.
(function () {
  "use strict";
  function boot() { const D = window.__detective; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("dc_agata", { name: "Ispettrice Agata Brina", tag: "", hair: "#5a2a2a", style: "long", skin: "#f0d0b0", eye: "#3a5a4a", bg: ["#2a2622", "#d8b46a"], shirt: "#6a5a4a" },
      "Ispettrice della Questura di Portagrigia, sezione «cose strane». Impermeabile sempre bagnato, una fisarmonica sotto il braccio, caramelle alla liquirizia in tasca. Risolve i casi pensando ad altro. Con la Lega delle Città ha un conto aperto, ma non ne parla.");
    K.cast("dc_tonio", { name: "Tonio Borraccia", tag: "gray", hair: "#d8d8d8", style: "buzz", skin: "#c68642", eye: "#3a3a2a", bg: ["#3a2a1e", "#c8a888"], shirt: "#3a4a6a", beard: true },
      "Magazziniere del Portagrigia da trentadue anni, adesso in pensione al bancone del Caffè Fuorigioco. Riconosce un pallone dal rumore che fa quando rimbalza.");
    K.cast("dc_ugo", { name: "Ugo Nastro", tag: "", hair: "#3a3a3a", style: "slick", skin: "#e8c8a8", eye: "#4a4a5a", glasses: true, bg: ["#1e1a18", "#b89a5a"], shirt: "#4a4a52" },
      "Custode della Sala Moviola dello stadio. Conserva ogni partita dal 1971 su nastri etichettati a mano. Parla ai proiettori come ad animali domestici.");
    K.cast("dc_sereno", { name: "Guardalinee Sereno Pace", tag: "", hair: "#8a6a4a", style: "messy", skin: "#f2d8c0", eye: "#5a6a7a", bg: ["#1a1a1a", "#ffd23f"], shirt: "#1a1a1a" },
      "Guardalinee della Lega da sei stagioni, mai una protesta, mai una polemica. Da qualche settimana dorme poco e si mangia le unghie.");
    K.cast("dc_nina", { name: "Nina Rotativa", tag: "", hair: "#2a1a3a", style: "bun", skin: "#d9a679", eye: "#3a2a1a", bg: ["#2a2a3a", "#e8e2d4"], shirt: "#5a3a5a" },
      "Cronista della Gazzetta di Portagrigia. Scrive di calcio e di misteri, a volte nello stesso articolo. Ha più fonti che amici, e le tratta meglio.");

    K.evidence("cucitura", { t: "Il pallone con la cucitura rossa", d: "Tonio Borraccia: i palloni del Portagrigia hanno tutti una cucitura rossa, fatta a mano da lui. «Quello del secondo tempo non ce l'aveva»", icon: "⚽", short: "Dalla memoria di Tonio" });
    K.evidence("guardalinee", { t: "Il guardalinee distratto", d: "In moviola: sul fuorigioco del 7, il guardalinee guarda la tribuna, non il campo.", icon: "🚩", short: "Dalla moviola" });
    K.evidence("pallone", { t: "Il pallone sostituito", d: "In moviola: dopo la rimessa entra un pallone diverso, più chiaro. Più leggero, forse.", icon: "⚪", short: "Dalla moviola" });
    K.evidence("numeri", { t: "I numeri scambiati", d: "In moviola: il 7 e il 9 di Valfonda si incrociano e si scambiano la maglia. Il gol lo segna il «7», che però corre come il 9.", icon: "🔢", short: "Dalla moviola" });
    K.evidence("ombrello", { t: "L'ombrello rosso in tribuna", d: "Sereno Pace: quando in tribuna si apriva un ombrello rosso, doveva «non vedere». Non sa chi lo tenesse.", icon: "☂️", short: "Dall'interrogatorio" });
    K.evidence("biglietto", { t: "Il biglietto col timbro della Lega", d: "Il biglietto ricevuto da Sereno: due righe a macchina e, in basso, mezzo timbro della Lega delle Città.", icon: "✉️", short: "Dallo spogliatoio degli arbitri" });
    K.cos("dc_c1", { kind: "shirt", label: "Impermeabile da ispettore", val: "#6a5a4a", from: "Completa il Capitolo 1 di Detective di Campo" });
    K.cos("dc_lente", { kind: "acc", label: "Stemma della Lente d'ottone", val: "#d8b46a", from: "Risolvi la prima moviola senza errori" });
    K.cos("dc_neon", { kind: "hairc", label: "Capelli Neon", val: "#d87ac8", from: "Trova tutti i bottoni d'ottone in città" });
    K.lore("l_lega", { t: "La Lega delle Città", d: "Dodici città, una coppa, un consiglio di cinque presidenti che si riunisce in un hotel di lusso. La Lega è nata per «riportare il calcio nelle piazze». Le piazze, adesso, guardano le partite in televisione." });
    K.lore("l_caso1", { t: "Portagrigia–Valfonda 0-3", d: "Tre gol in diciotto minuti, tutti nel secondo tempo, tutti dopo una rimessa. Il pubblico di casa ha fischiato per un'ora. Il giorno dopo, sulla Gazzetta, un titolo piccolo: «Valfonda, la favola continua»." });

    const goal = (s) => ({
      0: "Sei a Portagrigia. L'ispettrice Brina ti aspetta in Questura (il palazzo grigio a nord-ovest).",
      1: "Vai allo Stadio Comunale (verso est) e trova la Sala Moviola. Se vuoi, prima ascolta Tonio al Caffè Fuorigioco.",
      2: "Nella Sala Moviola: Ugo Nastro ha il nastro della partita.",
      3: "Interroga il guardalinee Sereno Pace nello spogliatoio degli arbitri (allo stadio, a est).",
      4: "Agata ti aspetta fuori dallo spogliatoio: rigioca l'azione chiave.",
      5: "Agata deve decidere cosa fare di Sereno Pace. Parlale.",
    }[s] || "Capitolo concluso. Il prossimo caso ti aspetta dal menu.");

    // ---------------------------------------------------------------- il filmato: Portagrigia (rosso) – Valfonda (verde), secondo tempo
    const red = "#a8322a", green = "#2a7a4a";
    const CLIP = {
      frames: 360,
      ball: [[0, 120, 84, 0], [60, 150, 80, 0], [120, 196, 74, 0], [150, 228, 72, 0], [160, 232, 74, 0], [185, 252, 192, 10], [200, 252, 190, 0], [215, 252, 186, 14], [235, 262, 128, 0], [262, 286, 100, 0], [270, 290, 99, 0], [285, 314, 100, 6], [300, 316, 102, 0], [360, 316, 102, 0]],
      ballCol: (f) => (f >= 200 ? "#f2e8c4" : "#ffffff"),
      actors: [
        { id: "v7", shirt: green, num: (f) => (f < 240 ? "7" : "9"), path: [[0, 114, 82], [60, 146, 78], [120, 192, 72], [150, 226, 70], [200, 238, 90], [240, 262, 116], [262, 248, 110], [360, 240, 112]] },
        { id: "v9", shirt: green, num: (f) => (f < 240 ? "9" : "7"), path: [[0, 96, 130], [100, 170, 130], [150, 214, 126], [215, 252, 132], [240, 262, 120], [262, 284, 102], [275, 292, 100], [360, 300, 92]] },
        { id: "v4", shirt: green, num: "4", path: [[0, 70, 100], [200, 160, 100], [360, 190, 104]] },
        { id: "p3", shirt: red, num: "3", path: [[0, 200, 90], [150, 236, 84], [240, 266, 112], [270, 280, 108], [360, 280, 108]] },
        { id: "p5", shirt: red, num: "5", path: [[0, 210, 130], [150, 240, 128], [262, 276, 122], [360, 282, 120]] },
        { id: "p1", shirt: "#e8c46a", num: "1", path: [[0, 300, 100], [262, 298, 104], [278, 304, 90], [360, 300, 96]] },
        { id: "arb", shirt: "#1a1a1a", num: "", path: [[0, 150, 110], [200, 220, 110], [360, 250, 116]] },
        { id: "gl", shirt: "#ffd23f", num: "", skin: "#f2d8c0", path: [[0, 160, 12], [120, 198, 12], [200, 228, 12], [360, 270, 12]],
          extra: (g, p, f) => { const away = f >= 100 && f <= 190; g.fillStyle = "#1a1a1a"; g.fillRect(p[0] + (away ? -1 : 0), p[1] - 7, 2, 1); g.fillStyle = "#c0392b"; g.fillRect(p[0] + 4, p[1] - 6 - (f > 300 ? 4 : 0), 4, 3); g.fillStyle = "#222"; g.fillRect(p[0] + 4, p[1] - 6, 1, 7); if (away) { g.strokeStyle = "rgba(255,255,255,.5)"; g.setLineDash([2, 2]); g.beginPath(); g.moveTo(p[0], p[1] - 8); g.lineTo(200, 4); g.stroke(); g.setLineDash([]); } } },
        { id: "boy", shirt: "#3a5a8a", num: "", when: [186, 214], path: [[186, 262, 196], [200, 254, 194], [214, 262, 196]], extra: (g, p, f) => { if (f < 200) { g.fillStyle = "#f2e8c4"; g.beginPath(); g.arc(p[0] + 4, p[1] - 2, 2.4, 0, 7); g.fill(); } } },
      ],
      draw(g, f) { if (f >= 90 && f <= 200) { g.fillStyle = "#c0392b"; g.beginPath(); g.arc(200, 6, 5, Math.PI, 0); g.fill(); g.fillStyle = "#222"; g.fillRect(200, 6, 1, 4); } if (f > 285) { g.font = "bold 10px Georgia, serif"; g.fillStyle = "#ffd36b"; g.fillText("GOL · 0-3", 140, 196); } },
    };
    const ANOM = [
      { id: "guardalinee", label: "Il guardalinee distratto", on: "gl", frames: [100, 190], r: 14, text: "Il 7 è in fuorigioco di due metri. E il guardalinee… guarda in tribuna.", hint: "Il guardalinee sembra a posto, adesso. Ma in certi fotogrammi guarda da un'altra parte." },
      { id: "pallone", label: "Il pallone sostituito", ball: true, frames: [200, 300], r: 12, text: "Dopo la rimessa il pallone è più chiaro. Non è quello di prima.", hint: "Il pallone. Confrontalo prima e dopo la rimessa." },
      { id: "numeri", label: "I numeri scambiati", on: "v9", frames: [240, 290], r: 12, text: "Il 9 e il 7 si incrociano e… si scambiano i numeri. Il gol lo segna il «7». Ma è il 9.", hint: "Guarda i numeri sulla schiena. Prima e dopo che si incrociano." },
    ];
    function moviola() {
      setStep(N, Math.max(S(), 2));
      K.setInMatch(true);
      window.__moviola.start({
        title: "Portagrigia–Valfonda · 2° tempo, 18'", clip: CLIP, anomalies: ANOM, need: 3,
        intro: "Il nastro gira. Metti in pausa, vai avanti e indietro di un fotogramma, e <b>tocca il dettaglio</b> che non torna: la lente lo ingrandisce. Tre cose non tornano.",
        miss: ["Niente di strano, qui. Riguarda con calma.", "Ugo, alle tue spalle: «Il proiettore dice che non è lì»", "Agata, senza alzare gli occhi: «Guarda dove guardano gli altri»"],
        outro: "Ugo spegne il proiettore. «Tre cose, in diciotto secondi. Nel '71 ci volevano tre settimane».",
        onDone: (r) => {
          K.setInMatch(false);
          r.found.forEach((id) => K.giveClue(id, true)); bond("fiuto", r.found.length - Math.floor(r.misses / 3));
          if (r.found.length >= 3) { if (r.misses === 0) K.reward("m:dc_lente", { cos: "dc_lente" }); F.set("dc_m1", r.misses); setStep(N, 3); K.learnLore("l_caso1"); K.note("Moviola del caso 1 risolta: guardalinee, pallone, numeri."); quest("dc_sereno", "Il guardalinee", "Interroga Sereno Pace nello spogliatoio degli arbitri."); }
          K.scene(r.found.length >= 3 ? [["dc_ugo", "Tre dettagli. Il guardalinee, il pallone e i numeri. Il proiettore ha fatto le fusa. Lo fa solo con chi guarda bene."], ["dc_agata", "(arrivando, scrollandosi l'acqua dall'impermeabile) Il guardalinee si chiama Sereno Pace. È nello spogliatoio degli arbitri, adesso. Va' tu: io gli metto paura, tu no."]] : [["dc_ugo", "Il nastro è ancora lì. Quando vuoi, lo riguardiamo. I nastri hanno pazienza."]], () => K.enterZone(K.api.trZone() || "dc_moviola_in"), "dc_moviola");
        },
      });
    }
    function rigioca() {
      const known = K.hasClue("guardalinee") && K.hasClue("ombrello");
      K.ownMatch(window.__moviola.rigioca, {
        title: "Rigioca l'azione chiave", twist: "guardalinee", known, us: "Portagrigia", opp: { name: "Valfonda", kit: green, names: ["7", "9"] }, half: 25,
        mate: { name: "Agata", skin: "#f0d0b0", hair: "#5a2a2a", shirt: "#6a5a4a" }, bg: "dc_stadio",
        intro: "Ricostruzione mentale dell'azione chiave: il ginocchio non fa male, nella testa. Attacchi verso l'alto. Il guardalinee è lì, a destra, con la bandierina.",
        knownTxt: "il guardalinee alza la bandierina solo quando si apre l'ombrello rosso. Adesso che lo sai, lui non lo alza più.",
        done: (r) => { F.set("dc_rig1", r.win ? "ok" : "ko"); bond("fiuto", r.win ? 2 : 0); setStep(N, 5); K.scene([["dc_agata", r.win ? "Visto? Senza la bandierina truccata, il Portagrigia segna. La partita era nostra. Era di tutti, a dire il vero: anche di Valfonda." : "Non importa il risultato. Importa che ora sappiamo come si trucca una partita: una bandierina, un pallone, due maglie. E un ombrello rosso."]], () => K.enterZone("dc_stadio"), "dc_stadio"); },
      });
    }

    const zones = {
      dc_citta: {
        region: "citta", name: "Detective di Campo · Portagrigia", short: "Portagrigia, il Centro", sub: "Pioggia, neon e partite truccate", bg: "dc_citta", time: "notte", travel: [2, 12],
        w: 40, h: 26, start: [2, 12], itemCos: "dc_neon", items: [[2, 22], [38, 2], [21, 22], [12, 15]],
        areas: [[3, 4, 11, 9, "La Questura"], [22, 4, 28, 9, "Caffè Fuorigioco"], [30, 4, 37, 9, "Grand Hotel Portagrigia"], [0, 0, 39, 25, "Portagrigia"]],
        act: { n: "Leggi il manifesto", l: "Guarda il lampione", b: "Siediti", t: "Guarda l'albero", q: "Entra", ">": "Vai allo Stadio Comunale" },
        flavor: {
          n: ["Manifesto: «LEGA DELLE CITTÀ · IL CALCIO TORNA NELLE PIAZZE». Sotto, qualcuno ha scritto a pennarello: «e le piazze tornano a casa con il cappotto bagnato»", "Manifesto strappato: «VALFONDA, LA FAVOLA CONTINUA». La pioggia ha sciolto la parola «favola»."],
          l: "Un lampione di ghisa. La luce fa cerchi gialli nella pioggia. Sotto, un gatto aspetta che smetta. Ha l'aria di chi aspetta da anni.",
          b: "Ti siedi, e il ginocchio ringrazia. La pioggia tamburella sul cappello di qualcuno che non c'è.",
          t: "Un platano in un'aiuola. Sulla corteccia: «G. + Agata, 1998». Chissà.",
          k: "L'edicola. Prima pagina della Gazzetta: «PORTAGRIGIA, TRE GOL IN DICIOTTO MINUTI. L'ALLENATORE: NON HO PAROLE». In fondo, piccolo: «Valfonda, la favola continua».",
          c: "Un'auto parcheggiata, i tergicristalli fermi. Sul cruscotto, un biglietto per la finale della Lega. In prima fila.",
        },
        intro: [["voce", "Portagrigia, ore ventuno. Piove dal lunedì, e oggi è venerdì. Le insegne al neon si riflettono sull'asfalto come quadri sciolti."], ["voce", "Il ginocchio fa male a ogni passo, la stampella ticchetta sul marciapiede. Una stagione intera senza giocare. Il medico ha detto: «Riposo». L'ispettrice Brina ha detto: «Venga in Questura»."]],
        npcs: (s) => [...(s >= 1 ? [{ id: "dc_nina", at: [18, 15] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 25, "+"); lay(0, 12, 39, 13, ":"); lay(19, 0, 20, 25, ":"); lay(14, 12, 14, 13, "_"); lay(25, 12, 25, 13, "_"); lay(19, 7, 20, 7, "_"); lay(19, 18, 20, 18, "_");
          lay(0, 0, 39, 1, "a"); lay(0, 24, 39, 25, "a"); lay(0, 0, 0, 25, "a"); lay(39, 0, 39, 25, "a"); put(0, 12, ":"); put(0, 13, ":");
          house(3, 3, 9, 7, { door: [7, 9], roof: "#3a3a44", wall: "#8a8a8e", rr: 3, lit: true, enter: { room: "ufficio", id: "dc_questura", name: "La Questura", bg: "dc_questura", intro: "La Questura di Portagrigia, sezione «cose strane»: tre scrivanie, un termosifone che fischia, una lavagna piena di fili rossi. Odore di caffè e di liquirizia.", who: (s) => [{ id: "dc_agata", at: [10, 5] }] } });
          house(22, 3, 7, 7, { door: [25, 9], roof: "#5a2a2a", wall: "#c8a888", rr: 3, lit: true, flowers: true, enter: { room: "locanda", id: "dc_caffe", name: "Caffè Fuorigioco", bg: "dc_citta", intro: "Il Caffè Fuorigioco: foto di squadre in bianco e nero, un juke-box che suona solo canzoni tristi, e un bancone dove si commentano partite di quarant'anni fa come se fossero di ieri.", who: [{ id: "dc_tonio", at: [10, 4] }] } });
          house(30, 3, 8, 7, { door: [33, 9], roof: "#4a2a3a", wall: "#d8c8b8", rr: 3, lit: true, enter: "Grand Hotel Portagrigia. Il portiere in livrea ti squadra dalla stampella alle scarpe: «I signori della Lega non ricevono. Nemmeno gli infortunati. Soprattutto gli infortunati»" });
          house(3, 16, 7, 5, { door: [6, 20], roof: "#3a3a3a", wall: "#a8988a", enter: "La Gazzetta di Portagrigia. La tipografia è chiusa, ma dalle finestre esce il rumore della rotativa: stanno già stampando domani." });
          house(23, 16, 6, 5, { door: [25, 20], roof: "#5a3a2a", wall: "#c8b098", flowers: true, enter: "Pasticceria Rigore. Vetrina piena di paste a forma di pallone. Cartello: «Chiuso per lutto sportivo». Sotto, più piccolo: «Riapre se vince il Portagrigia»." });
          house(31, 16, 7, 5, { door: [34, 20], roof: "#2a3a4a", wall: "#8a98a8", enter: "Un portone con le targhette: un notaio, un dentista, e «Comitato Tifosi Grigi». Il campanello del Comitato è stato premuto così tante volte che è consumato." });
          lay(1, 21, 38, 21, "+");
          put(16, 10, "k"); put(15, 10, "s"); [[4, 13], [5, 13]].forEach(([x, y]) => put(x, y, "c")); [[30, 12], [31, 12]].forEach(([x, y]) => put(x, y, "c")); [[10, 14], [11, 14]].forEach(([x, y]) => put(x, y, "c"));
          [[13, 10], [27, 10], [13, 15], [27, 15], [37, 10]].forEach(([x, y]) => put(x, y, "l")); put(17, 15, "b"); put(22, 10, "n"); put(9, 15, "n");
          [[2, 10], [37, 15], [16, 22]].forEach(([x, y]) => put(x, y, "t"));
          put(39, 12, ">"); put(39, 13, ">");
        },
        decor(g, cx, cy, d) { K.neon(g, "QUESTURA", d.X(7) + 8, d.Y(3) + 4, "120,180,255", 0); K.neon(g, "CAFFÈ FUORIGIOCO", d.X(25) + 8, d.Y(3) + 4, "255,110,150", 1); K.neon(g, "GRAND HOTEL", d.X(33) + 8, d.Y(3) + 4, "255,210,120", 2); K.neon(g, "GAZZETTA", d.X(6) + 8, d.Y(16) + 4, "200,255,200", 3); },
      },
      dc_stadio: {
        region: "stadio", name: "Detective di Campo · Lo Stadio Comunale", short: "Lo Stadio Comunale", sub: "Di notte, vuoto, sotto la pioggia", bg: "dc_stadio", time: "notte", travel: [2, 12],
        w: 40, h: 26, start: [2, 12], items: [[38, 15], [20, 4], [2, 20], [30, 20]],
        areas: [[2, 4, 7, 9, "La Sala Moviola"], [32, 4, 38, 9, "Lo spogliatoio degli arbitri"], [9, 6, 30, 19, "Il campo"], [0, 0, 39, 25, "Lo Stadio Comunale"]],
        act: { j: "Guarda la tribuna", g: "Guarda la porta", q: "Entra", "<": "Torna in città", l: "Guarda il faro" },
        flavor: {
          j: ["Le gradinate vuote. Su un seggiolino, una sciarpa grigia dimenticata, fradicia. Qualcuno se n'è andato prima del fischio finale.", "In tribuna centrale, al posto 14 della fila B, c'è un segno di vernice rossa. Come la punta di un ombrello appoggiato lì, per un'ora."],
          g: "La porta di sinistra. La rete ha ancora il buco del terzo gol: il pallone l'ha bucata come se pesasse niente.",
          l: "Un faro dello stadio, spento. Le gocce ci scivolano sopra come su una lavagna.",
        },
        intro: [["voce", "Lo Stadio Comunale di Portagrigia, di notte. Le tribune vuote gocciolano. Il campo è un lago con le linee bianche."], ["voce", "In fondo a ovest c'è la palazzina della Sala Moviola, con una sola finestra accesa. A est, lo spogliatoio degli arbitri."]],
        npcs: (s) => [...(s >= 4 ? [{ id: "dc_agata", at: [35, 11] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 25, "+"); lay(0, 0, 39, 1, "j"); lay(0, 23, 39, 25, "j"); lay(0, 0, 0, 25, "a"); lay(39, 0, 39, 25, "a");
          lay(9, 6, 30, 19, "-"); put(8, 12, "g"); put(8, 13, "g"); put(31, 12, "g"); put(31, 13, "g");
          lay(10, 2, 29, 3, "j"); lay(10, 21, 29, 22, "j");
          put(0, 12, "<"); put(0, 13, "<"); lay(1, 12, 7, 13, ":"); lay(32, 12, 38, 13, ":");
          house(2, 4, 6, 6, { door: [4, 9], roof: "#3a3a44", wall: "#9a9a9e", rr: 2, lit: true, enter: { room: "ufficio", id: "dc_moviola_in", name: "La Sala Moviola", bg: "dc_moviola", intro: "La Sala Moviola: scaffali di nastri fino al soffitto, un proiettore che ronza come un frigorifero vecchio, uno schermo bianco con una macchia a forma di Sardegna.", who: [{ id: "dc_ugo", at: [10, 4] }] } });
          house(32, 4, 7, 6, { door: [35, 9], roof: "#2a2a2a", wall: "#7a7a82", rr: 2, enter: { room: "spogliatoio", id: "dc_spogliatoio", name: "Lo spogliatoio degli arbitri", bg: "dc_stadio", intro: "Lo spogliatoio degli arbitri: armadietti grigi, una panca, un fischietto appeso a un chiodo. Gocciola un rubinetto, a tempo, come un cronometro.", locked: (K) => (K.stepOf(1) < 3 ? "Lo spogliatoio degli arbitri è chiuso. Prima, dice Agata, guarda la moviola." : false), who: (s) => [{ id: "dc_sereno", at: [10, 8] }], chest: { coins: 25, text: "Nell'armadietto di Sereno, sotto la divisa piegata, un foglio stropicciato." } } });
          [[8, 5], [31, 5], [8, 20], [31, 20]].forEach(([x, y]) => put(x, y, "l")); put(36, 15, "s");
        },
        decor(g, cx, cy, d) { K.neon(g, "SALA MOVIOLA", d.X(4) + 8, d.Y(4) + 2, "255,200,120", 0); K.neon(g, "ARBITRI", d.X(35) + 8, d.Y(4) + 2, "255,255,255", 1); },
      },
    };

    const talk = {
      dc_agata() {
        const s = S();
        if (s === 0) return say([
          ["dc_agata", "Ah, eccola. La stampella fa un rumore simpatico, sa? Tic, tic. Come un detective che pensa. Io sono Agata Brina. Liquirizia?"],
          ["hero", "Sono {n}. Il medico dice che per una stagione non gioco."],
          ["dc_agata", "Per una stagione non corre. Gli occhi, però, funzionano. E io ho bisogno di occhi che sappiano cosa guardare in una partita. I miei sanno solo cosa guardare in un delitto."],
          ["dc_agata", "Portagrigia–Valfonda, tre a zero per Valfonda. Tre gol in diciotto minuti, tutti dopo una rimessa. Qualcuno ha truccato quella partita, e non era la prima. Lo sento. Lo sento qui. (Si tocca la tasca della liquirizia.)"],
          ["dc_agata", "Allo stadio c'è la Sala Moviola. Ugo Nastro ha il filmato. Lei guarda, io penso. Le do anche questo: un distintivo da assistente. Non serve a niente, ma fa scena."],
        ], () => { setStep(N, 1); F.set("dc_distintivo", true); K.learnLore("l_lega"); K.note("L'ispettrice Brina ti ha preso come assistente."); done(); });
        if (s === 4) return ask("dc_agata", "Sereno ha parlato. Bene. Adesso facciamo una cosa che a Scotland Yard non fanno: rigiochiamo l'azione. Nella sua testa, il ginocchio non fa male. Chiuda gli occhi. Anzi, li apra: si gioca.", [
          { label: "Rigioca l'azione chiave", sub: "Ricostruzione (partita «Moviola»)", cls: "hot", fn: rigioca },
          { label: "Un momento", fn: done },
        ], "dc_stadio");
        if (s === 5) return ask("dc_agata", "Sereno Pace. Sei stagioni senza una polemica, e poi un biglietto, un ombrello rosso, e la paura. Ha truccato una partita, sì. Ma qualcuno lo ricattava: aveva un debito, e una figlia all'università.\n\nAssistente: lei cosa farebbe?", [
          { label: "«Proteggiamolo: è una vittima, non il colpevole»", sub: "Compassione", big: true, fn: () => end1("protetto") },
          { label: "«La legge è uguale per tutti: lo denunciamo»", sub: "Rigore", big: true, fn: () => end1("denunciato") },
          { label: "«Usiamolo come esca per arrivare più in alto»", sub: "Astuzia, con qualche rischio", big: true, fn: () => end1("esca") },
        ], "dc_stadio");
        return say([["dc_agata", K.pick(["Pensi alla rimessa. Tutto comincia da una rimessa. Come il matrimonio dei miei.", "Liquirizia? Aiuta a pensare. O almeno a masticare mentre si pensa.", "Non guardi me. Guardi i dettagli. Io sono un dettaglio molto grande."])]]);
      },
      dc_tonio() {
        if (K.hasClue("cucitura")) return say([["dc_tonio", "Trentadue anni di palloni. Li riconosco al rimbalzo: il nostro fa «tum», quello nuovo fa «tic». Come la sua stampella."]]);
        return say([
          ["dc_tonio", "Lei è quello del ginocchio. Ho letto. Brutta cosa. Si sieda, il caffè è corretto. Cioè, è giusto: non c'è niente dentro."],
          ["dc_tonio", "Vuole sapere della partita? Le dico solo questo: i palloni del Portagrigia li cucio io, da trentadue anni. Hanno tutti una cucitura rossa, sul fianco. Per fortuna, dicevo."],
          ["dc_tonio", "Il pallone del secondo tempo non ce l'aveva. Era più chiaro. Rimbalzava come una caramella. Nessuno mi ha chiesto niente. Nessuno chiede mai niente al magazziniere."],
        ], () => { K.giveClue("cucitura"); bond("fiuto", 1); done(); });
      },
      dc_ugo() {
        const s = S();
        if (s < 1) return say([["dc_ugo", "La Sala Moviola apre solo per la Questura. E per i fantasmi, la notte. Lei non mi sembra un fantasma."]]);
        if (s >= 3) return say([["dc_ugo", "Il nastro l'ho messo al sicuro. Al sicuro vuol dire sotto il mio cuscino. Non lo dica a nessuno."]]);
        return ask("dc_ugo", s === 1 ? "La manda l'ispettrice? Allora siediti. Il nastro di Portagrigia–Valfonda è già sul proiettore: lo aspettava. I nastri sanno quando qualcuno li vuole guardare.\n\nSecondo tempo, diciottesimo minuto. Il terzo gol." : "Lo riguardiamo? Il proiettore è caldo.", [
          { label: "Avvia la moviola", sub: "Trova i tre dettagli che non tornano", cls: "hot", fn: moviola },
          { label: "Più tardi", fn: done },
        ], "dc_moviola");
      },
      dc_sereno() {
        const s = S();
        if (s !== 3) return say([["dc_sereno", s > 3 ? "Grazie per… non lo so. Per avermi guardato come una persona. È la prima volta da un mese." : "Non posso parlare. Non con chi non ha un distintivo."]]);
        return interrogate();
      },
      dc_nina() {
        if (F.is("dc_nina1")) return say([["dc_nina", "Se trova qualcosa, mi chiami. La Gazzetta paga in caffè e in silenzio, a seconda di cosa serve."]]);
        F.set("dc_nina1", true);
        return say([["dc_nina", "Nina Rotativa, Gazzetta di Portagrigia. Lei è l'assistente della Brina. Lo so perché so tutto, ed è un problema."], ["dc_nina", "Un consiglio gratis: il titolo «Valfonda, la favola continua» non l'ho scelto io. È arrivato in redazione con una busta della Lega. Le favole, di solito, non arrivano in busta."]], () => { bond("fiuto", 1); done(); });
      },
    };
    // ---------------------------------------------------------------- l'interrogatorio (Presenta la prova)
    function interrogate() {
      K.present({
        who: "dc_sereno", bg: "dc_stadio", ok: ["guardalinee"],
        prompt: "«Io ho fatto il mio lavoro. Ero concentrato sulla linea, come sempre. Il 7 era in gioco, l'ho visto benissimo. Non ho niente da nascondere.»",
        right: () => { bond("fiuto", 1); K.scene([["hero", "Concentrato sulla linea? In moviola, sul fuorigioco del 7, lei guarda la tribuna. Fotogramma centoventi. Lo vuole vedere?"], ["dc_sereno", "…"], ["dc_sereno", "Un ombrello rosso. In tribuna centrale, fila B. Quando si apriva, io non dovevo vedere. Solo per qualche minuto. Mi avevano detto che nessuno se ne sarebbe accorto."], ["dc_sereno", "Chi? Non lo so. Un biglietto, nell'armadietto. Due righe a macchina. Il resto… non posso."]], () => { K.giveClue("ombrello"); askMore(); }, "dc_stadio"); },
        wrong: (id) => { bond("fiuto", -1); F.add("dc_wrong", 1); say([["dc_sereno", id === "pallone" ? "Il pallone? E io che c'entro col pallone? Io ho una bandierina, non un magazzino." : id === "numeri" ? "I numeri sulle maglie? Le maglie non le guardo, guardo le gambe. È il mio lavoro." : "Non capisco cosa vuole dire. Davvero."], ["voce", "Non era la prova giusta. Ripensa a cosa ha detto: «concentrato sulla linea»."]], interrogate); },
        back: done,
      });
    }
    function askMore() {
      ask("dc_sereno", "«Il biglietto ce l'ho ancora. Nell'armadietto. Ma se lo prendete… sapranno che ho parlato.»", [
        { label: "«Lo prendo io. Nessuno saprà da dove viene»", sub: "Una promessa", fn: () => { K.giveClue("biglietto"); bond("agata", 1); questDone("dc_sereno"); setStep(N, 4); say([["dc_sereno", "Va bene. Armadietto 3. Sotto la divisa piegata. Ha mezzo timbro, in fondo: della Lega."]]); } },
        { label: "«Lo prenda lei e me lo dia. Adesso.»", sub: "Più duro", fn: () => { K.giveClue("biglietto"); bond("fiuto", 1); questDone("dc_sereno"); setStep(N, 4); say([["dc_sereno", "(Trema, apre l'armadietto, ti mette il foglio in mano senza guardarti.) Ecco. Adesso sono in due a odiarmi: loro e io."]]); } },
      ], "dc_stadio");
    }
    function end1(kind) {
      F.set("dc_sereno", kind);
      if (kind === "protetto") { bond("agata", 2); bond("lega", 1); } else if (kind === "denunciato") { bond("lega", 2); } else { bond("fiuto", 2); bond("agata", 1); bond("lega", 1); }
      const msg = K.reward("ch:dc_c1", { coins: 70, cos: "dc_c1" }); F.set("dc_impermeabile", true);
      finishChapter(N); setStep(N, 6);
      K.scene([
        ["dc_agata", kind === "protetto" ? "Bene. Allora lo nascondiamo in bella vista: torna a fare il guardalinee, e noi guardiamo chi gli si avvicina. Mi piace, lei. Ha un cuore e lo usa." : kind === "denunciato" ? "La legge è uguale per tutti. Sì. Lo dicono anche quelli della Lega, sa? Con una voce diversa, però." : "Un'esca. Lei è più cattivo di me, assistente. Mi piace. Mi preoccupa, ma mi piace."],
        ["voce", "Uscendo dallo stadio, sotto la pioggia, vedi un ombrello rosso. Lontano, all'angolo della via. Si chiude, e sparisce dentro un'auto nera che parte senza fari."],
        ["dc_agata", "L'ha visto anche lei? Bene. Allora non sono pazza. Non del tutto."],
        ["voce", `<b>Fine del Capitolo 1 · La moviola.</b> ${msg.join(" · ")}`],
      ], () => K.openMain(), "dc_citta");
    }
    const obj = {
      "dc_citta:>": () => (S() >= 1 ? go("dc_stadio", 2, 12) : say([["voce", "Lo stadio è da quella parte. Ma prima la Questura: l'ispettrice ti aspetta."]])),
      "dc_stadio:<": () => go("dc_citta", 37, 12),
    };
    return { n: N, title: "La moviola", sub: "Portagrigia–Valfonda, tre gol in diciotto minuti", goal, start: "dc_citta", introBg: "dc_citta", zones, talk, obj,
      intro: () => [["voce", "Lega delle Città, giornata undici. Portagrigia–Valfonda 0-3. Il pubblico di casa fischia per un'ora."], ["voce", "Tu, quella partita, l'hai vista dalla tribuna, con la gamba fasciata e una stampella nuova. Qualcosa non tornava. Non sapevi cosa."]] };
  }
  boot();
})();
