// js/tempo-c1.js - RONDINE 1938-2038 · Capitolo 1 «Le 22:04»
// 2038, la vigilia del centenario dello Stadio delle Rondini. La vetrina dei trofei sbiadisce, la Torre dell'Orologio è ferma alle 22:04.
// Il Professor Quarzo, nell'Officina fuori dal tempo, manda il Campione nel 1938 con la Palla del Tempo: una partita sola, in due epoche.
// Il seme del platano, la foto della carrozzina, il primo gol del Club. Poi il ritorno, e una persona che non ama i gol annullati a metà.
(function () {
  "use strict";
  function boot() { const D = window.__tempo; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);
    const BGS = { rt_piazzale: { 2038: "rt_piazza", 1978: "rt_piazza78", 1938: "rt_piazza38" }, rt_campo: { 2038: "rt_campo", 1978: "rt_campo78", 1938: "rt_campo38" } };

    K.cast("rt_quarzo", { beard: "incolta", acc: ["occhiali"], name: "Prof. Ottavio Quarzo", tag: "", hair: "#f2f2f2", style: "messy", skin: "#e8c4a0", eye: "#4a6a8a", bg: ["#2a1e32", "#ffb347"], shirt: "#e8e0d0" },
      "Orologiaio del Club da sessant'anni, o da cent'anni: nell'Officina il tempo non lo tocca. Capelli bianchi dritti come una scarica, occhiali di ottone, entusiasmo da ragazzino. Ha costruito il Pullman Rondine e la Palla del Tempo, e ammette di non aver letto bene le istruzioni.");
    K.cast("rt_tilly", { streak: "#ec4899", acc: ["cuffie"], name: "Tilly Verdi", tag: "", hair: "#ff46c8", style: "twintails", skin: "#c68642", eye: "#2a2a4a", bg: ["#101434", "#46f0ff"], shirt: "#1a2a7a" },
      "Diciannove anni, tecnica del tabellone dello stadio. Parla a velocità di fibra ottica e prega le macchine come si prega un nonno. Ha capito prima di tutti che il VAR Totale non guarda le partite: le riscrive.");
    K.cast("rt_nonna", { acc: ["occhiali"], name: "Nonna Ines", tag: "gray", hair: "#eeeef4", style: "bun", skin: "#e8cdb0", eye: "#5a6a7a", bg: ["#101434", "#ffb347"], shirt: "#7a4a6a" },
      "Cent'anni compiuti in autunno, e una memoria che non perde un colpo, soprattutto quelli che non può aver visto. Siede sempre sulla stessa panchina della piazza. Dice di aver fatto la prima foto della sua vita a sei mesi.");
    K.cast("rt_tosta", { shape: "tostapane", name: "Tostino", tag: "", skin: "#c8c8d0", shirt: "#ff46c8", eye: "#46f0ff", hair: "#c8c8d0", bg: ["#101434", "#ff46c8"] },
      "Chiosco automatico a forma di tostapane, nato per vendere toast al neon e diventato, col tempo, il confessore della piazza. Non dimentica niente, e non giudica, e il toast è buono.");
    K.cast("rt_dorino", { acc: ["fascia"], name: "Dorino Rondi", tag: "", hair: "#2a1a10", style: "slick", skin: "#e0b890", eye: "#3a3a2a", bg: ["#3a342c", "#d8d0bc"], shirt: "#d8d0bc" },
      "Diciannove anni e una squadra fondata con undici lire e una bugia. Capitano, presidente, magazziniere e raccogli-palloni del Rondinara. Parla con le mani, perde la voce all'intervallo e non ha mai, in vita sua, rinunciato a una partita.");
    K.cast("rt_madre38", { acc: ["grembiule"], name: "Rosa Fornaro", tag: "", hair: "#3a2418", style: "bun", skin: "#e8c4a0", eye: "#4a3a2a", bg: ["#3a342c", "#a8a090"], shirt: "#6a5a4a" },
      "Fruttivendola in piazza, mamma di una neonata, proprietaria di una macchinetta fotografica «di un cognato inventore». Si fida delle persone a prima vista, anche di quelle con le scarpe strane.");
    K.cast("rt_baldo", { beard: "incolta", name: "Baldo Molinari", tag: "", hair: "#7a5a2a", style: "buzz", skin: "#d9a679", eye: "#3a3a2a", bg: ["#3a342c", "#c8782a"], shirt: "#c8782a" },
      "Capitano del Mulino, la squadra dei mugnai: spalle da sacco di farina, voce da porta di ferro. Dice che il campo è un prato con le righe. In fondo ci vorrebbe giocare anche lui.");

    K.cast("rt_ines78", { acc: ["occhiali"], name: "Ines del Bar", tag: "", hair: "#2a1a10", style: "bun", skin: "#e8cdb0", eye: "#5a6a7a", bg: ["#3a2a18", "#e8a030"], shirt: "#c8602a" },
      "Quarant'anni nel 1978, il bar suo da quando ne aveva venti. Grembiule arancione, mano ferma sul flipper. Una bambina del 1938, passata dai tavolini a dare ordini a tutti.");
    K.cast("rt_rino", { name: "Rino Sabbioni", tag: "", hair: "#5a3a1a", style: "curly", skin: "#d9a679", eye: "#3a3a2a", bg: ["#3a2a18", "#e8a030"], shirt: "#e8a030" },
      "Ala sinistra del Rondinara '78, basette lunghe e pantaloncini corti. Quando non gioca fa il ragazzo di bottega e dice che il pallone e la bottega sono lo stesso mestiere.");
    K.cast("rt_mister", { beard: "baffi", acc: ["fascia"], name: "Il Mister", tag: "", hair: "#aaaaaa", style: "slick", skin: "#d8b090", eye: "#3a3a2a", bg: ["#3a2a18", "#e8a030"], shirt: "#7a4a2a" },
      "Allena il Rondinara dal Settanta. Impermeabile beige, sigaretta spenta in bocca, tre frasi in tutto: la prima è sempre «ragazzi».");
    K.cast("rt_vera", { acc: ["occhiali"], name: "Vera Revisori", tag: "", hair: "#e8e8f0", style: "bob", skin: "#e8d0c0", eye: "#46f0ff", bg: ["#101434", "#46f0ff"], shirt: "#20204a" },
      "Direttrice del VAR Totale. Parla piano, corregge i verbali con la penna e le persone con lo sguardo. Crede che il passato sia un documento e che il futuro sia un'abitudine.");

    K.cos("rt_c1", { kind: "shirt", label: "Maglia del Forestiero", val: "#d8d0bc", from: "Completa il Capitolo 1 di Rondine 1938-2038" });
    K.cos("rt_lancette", { kind: "hairc", label: "Capelli Ottone", val: "#c8a040", from: "Raccogli tutte le lancette d'ottone della piazza" });
    K.cos("rt_suola", { kind: "acc", label: "Fascia del Rondinara 1938", val: "fascia", from: "L'inaugurazione dello stadio" });
    K.lore("l_vetrina", { t: "La foto che sbiadisce", d: "Nella vetrina dei trofei, la foto di squadra del 1938. I volti diventano macchie, uno dopo l'altro, a partire dal fondo. Il VAR Totale rivede il passato, e il passato, dopo la revisione, ha meno gente." });
    K.lore("l_pullman", { t: "Il Pullman Rondine", d: "Un pullman blu con una targa a tre date. Parte a trentotto chilometri all'ora, non un chilometro di più. Il Professor Quarzo giura che a trentanove succede una cosa brutta, ma non ricorda quale." });
    K.lore("l_palla", { t: "La Palla del Tempo", d: "Una palla sola, una partita sola, tre epoche. Quello che fai in un tempo cambia il campo del tempo dopo: i segni che attivi col pallone diventano alberi, statue, varchi, guasti." });
    K.lore("l_seme", { t: "Il seme del platano", d: "Nonna Ines lo tiene in un taschino da cent'anni. «Mia madre disse che un forestiero lo piantò, e che io avrei dovuto restituirlo.» Piantato nel 1938, in piazza, cresce fino al 2038." });
    K.lore("l_foto", { t: "La foto della carrozzina", d: "Una fotografia a sviluppo istantaneo, nel 1938, con un anacronismo di troppo: un uomo con le scarpe strane che tiene in braccio una neonata. La neonata ride. L'uomo no: sta cercando di non muoversi." });
    K.lore("l_forestiero", { t: "Il Forestiero", d: "Il primo gol del Rondinara fu segnato da un forestiero con le scarpe strane, che nessuno ricordò di nome. Sui giornali del giorno dopo: «da uno che non era di qui». Il Club lo ha festeggiato per cent'anni senza sapere chi fosse." });

    const goal = (s) => ({
      0: "Rondinara, 2038, la sera prima del centenario. Tilly, la tecnica del tabellone, ti aspetta in piazzale.",
      1: "Guarda la vetrina dei trofei (a destra, vicino al cancello) e vai dal Professor Quarzo nella Torre dell'Orologio, in alto a sinistra.",
      2: "Nell'Officina il Pullman Rondine aspetta. Sali e scegli il 1938.",
      3: "È il 1938. Dorino, il capitano, è in piazza. Alle tre si inaugura il campo, a est. Se hai il seme, l'aiuola al centro della piazza lo aspetta.",
      4: "Sei tornato nel 2038. La vetrina dei trofei, vicino al cancello, ha qualcosa da dirti.",
    }[s] || "Capitolo concluso. Il prossimo anno ti aspetta nell'Officina.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y, col) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(22,18,34,.88)"); R(g, x - w / 2, y + 2, w, 1, col || "#ffb347"); g.fillStyle = "#f6efe0"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    const houseCol = () => { const e = K.ZX.eraName; return e === "1938" ? { roof: "#5a4a3a", wall: "#9a9486" } : e === "1978" ? { roof: "#a8522a", wall: "#e8c89a" } : { roof: "#2a1a6a", wall: "#3a3a8a" }; };

    const zones = {
      rt_piazzale: {
        region: "neon", name: "Rondine 1938-2038 · Piazzale dello Stadio", short: "Piazzale dello Stadio", sub: "Rondinara, davanti ai cancelli", time: "notte", w: 30, h: 22, start: [12, 11], itemCos: "rt_lancette", items: [[3, 13], [27, 17], [17, 18]],
        get bg() { return BGS.rt_piazzale[K.ep()]; },
        areas: [[2, 1, 7, 6, "La Torre dell'Orologio"], [20, 1, 26, 5, "Bar"], [8, 7, 22, 17, "La piazza"], [0, 0, 29, 21, "Piazzale dello Stadio"]],
        act: { n: "Leggi il cartello", l: "Guarda il lampione", b: "Siediti", t: "Guarda l'albero", w: "Guarda la fontana", u: "Guarda il chiosco", ">": "Vai ai cancelli", q: "Entra" },
        flavor: {
          n: ["Un cartello: «STADIO DELLE RONDINI · FONDATO NEL 1938 · CENTENARIO DOMANI». Qualcuno ha aggiunto con il pennarello: «(se il Sistema vuole)».", "Un cartello con le regole del piazzale. La regola 4 dice: «Vietato fermare il tempo». La regola 5: «Vietato anche rallentarlo»."],
          l: "Un lampione. L'epoca cambia, e lui è sempre lì, con una luce diversa e lo stesso tremito di chi sta per dire una cosa.",
          b: "Ti siedi. Cinque minuti dopo, qualcuno al neon sopra di te sospira. Sembra la panchina.",
          t: "Un albero di contorno. Non è il platano: lui è un figurante, e lo sa.",
          w: "La fontana. L'acqua scorre in tre colori a seconda dell'ora, e adesso è di un rosa che non c'entra con niente.",
          u: "Un chiosco. Di notte, di giorno, di ieri: c'è sempre qualcuno che vende qualcosa da mangiare.",
        },
        intro: [["voce", "Rondinara, 14 ottobre 2038, un po' prima delle dieci di sera. L'insegna «STADIO DELLE RONDINI» ha un tremito rosa, come chi sta per dire una cosa difficile."], ["voce", "Domani il Club compie cent'anni. Stasera, a quanto pare, rischia di non averli mai compiuti."]],
        npcs: (s) => [{ id: "rt_tilly", at: [24, 9] }, { id: "rt_nonna", at: [20, 12] }, { id: "rt_tosta", at: [10, 15] }],
        build(L) {
          const { lay, put, house } = L, C = houseCol(), era = K.ZX.eraName;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 9, "t"); lay(29, 12, 29, 21, "t");
          lay(8, 7, 22, 17, "+"); lay(1, 10, 28, 11, ":"); lay(5, 7, 5, 9, ":"); lay(23, 6, 23, 9, ":");
          house(2, 1, 6, 6, { door: [5, 6], roof: C.roof, wall: C.wall, rr: 3, lit: true, enter: { to: "rt_officina", at: [8, 9] } });
          house(20, 1, 7, 5, { door: [23, 5], roof: C.roof, wall: C.wall, rr: 3, lit: true, flowers: era !== "1938", enter: era === "1938" ? "L'osteria del Moro. Dentro, voci e fumo: parlano tutti insieme dell'inaugurazione. La porta è chiusa a chiave: «torniamo subito»."
            : era === "1978" ? "Il Bar da Ines. Dal vetro si vede un flipper che lampeggia da solo. Sulla porta: «CHIUSO PER FINALE. APERTO DOPO LA FINALE»." : "Il Bar Orbitale. Sulla porta, un avviso: «CHIUSO PER CENTENARIO»; sotto, a penna: «e per revisione»." });
          lay(14, 8, 15, 9, "w"); put(14, 14, "P"); put(25, 9, "A"); put(9, 15, "u");
          [[10, 13], [19, 13]].forEach(([x, y]) => put(x, y, "b")); [[8, 8], [22, 8], [8, 16], [22, 16]].forEach(([x, y]) => put(x, y, "l")); put(26, 12, "n"); put(12, 9, "n");
          [[10, 2], [12, 3], [18, 3], [2, 12], [2, 16], [27, 15], [26, 19], [4, 19], [16, 19]].forEach(([x, y]) => put(x, y, "t")); put(11, 18, "s");
          put(29, 10, ">"); put(29, 11, ">");
        },
        decor(g, cx, cy, d) { plaque(g, "TORRE DELL'OROLOGIO", d.X(5) + 8, d.Y(1) - 2); plaque(g, K.ep() === 1938 ? "OSTERIA DEL MORO" : K.ep() === 1978 ? "BAR DA INES" : "BAR ORBITALE", d.X(23) + 8, d.Y(1) - 2); plaque(g, "AI CANCELLI →", d.X(26) + 8, d.Y(12) - 4); },
        eras: {
          1978: { label: "Piazzale dello Stadio · 1978", region: "settanta", filter: "anni70", time: "tramonto", npcs: () => [{ id: "rt_ines78", at: [22, 7] }, { id: "rt_rino", at: [16, 15] }, { id: "rt_mister", at: [26, 9] }] },
          1938: { label: "Piazzale dello Stadio · 1938", region: "trenta", filter: "bn", time: "giorno", npcs: () => [{ id: "rt_madre38", at: [10, 15] }, { id: "rt_dorino", at: [26, 9] }, { id: "rt_baldo", at: [17, 7] }] },
        },
      },
      rt_campo: {
        region: "neon", name: "Rondine 1938-2038 · Il Campo", short: "Lo Stadio delle Rondini", sub: "Il prato più vecchio di Rondinara", time: "notte", w: 30, h: 22, start: [3, 11], items: [[3, 19], [27, 19]],
        get bg() { return BGS.rt_campo[K.ep()]; },
        areas: [[8, 6, 26, 16, "Il campo"], [8, 2, 26, 4, "Tribuna nord"], [0, 0, 29, 21, "Lo Stadio delle Rondini"]],
        act: { g: "Guarda la porta", f: "Guarda la staccionata", j: "Guarda la tribuna", U: "Guarda il tabellone", "<": "Torna in piazzale", ";": "Guarda l'erba alta" },
        flavor: { g: "Una porta. Cambia faccia a ogni epoca, ma ha sempre lo stesso difetto: il palo sinistro è un po' più vicino di quello destro.", f: "Una staccionata. Nel 1938 è di legno, nel 1978 di tubi, nel 2038 di luce: tiene lontani tutti, tranne il tempo.", j: "La tribuna. Qualcuno ha lasciato sul sedile un cappello, un ombrello e un ologramma di un ombrello." },
        intro: [["voce", "Lo Stadio delle Rondini di notte è un prato di luce con tre scritte: «DOMANI ESSERCI», «CENT'ANNI» e, in piccolo, «ABBIAMO PAURA»."]],
        npcs: () => [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(29, 0, 29, 21, "t"); lay(0, 0, 0, 9, "t"); lay(0, 12, 0, 21, "t"); put(0, 10, "<"); put(0, 11, "<"); lay(1, 10, 7, 11, ":");
          lay(8, 6, 26, 16, "-"); put(7, 10, "g"); put(7, 11, "g"); put(27, 10, "g"); put(27, 11, "g");
          lay(8, 2, 26, 4, "j"); lay(8, 18, 26, 20, "j"); lay(8, 5, 26, 5, "f"); lay(8, 17, 26, 17, "f");
          put(28, 8, "U"); put(3, 14, "s"); [[2, 4], [4, 3], [28, 4], [2, 18]].forEach(([x, y]) => put(x, y, "t"));
        },
        eras: {
          1978: { label: "Lo Stadio delle Rondini · 1978", region: "settanta", filter: "anni70", time: "tramonto", npcs: () => [] },
          1938: { label: "Lo Stadio delle Rondini · 1938", region: "trenta", filter: "bn", time: "giorno", npcs: () => [{ id: "rt_dorino", at: [12, 8] }, { id: "rt_baldo", at: [22, 13] }] },
        },
      },
      rt_officina: {
        interior: true, region: "officina", name: "Rondine 1938-2038 · L'Officina del Professor Quarzo", short: "L'Officina fuori dal tempo", sub: "Ingranaggi, tè e un pullman", bg: "rt_officina", w: 16, h: 12, start: [8, 9], outside: ["rt_piazzale", 5, 7], items: [[13, 8]],
        act: { O: "Sali sul Pullman", M: "Guarda il banco", L: "Guarda gli scaffali", v: "Esci", W: "Guarda dalla finestra", x: "Apri la cassetta" },
        intro: [["voce", "L'Officina del Professor Quarzo: la base della Torre dell'Orologio. Qui dentro, dice la targa, «il tempo non passa»: infatti sullo scaffale ci sono tre sveglie, tutte ferme, tutte con l'aria di aspettare qualcuno."]],
        npcs: () => [{ id: "rt_quarzo", at: [5, 7] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          lay(6, 3, 9, 4, "O"); put(2, 3, "M"); put(3, 3, "M"); put(12, 3, "M"); put(11, 2, "L"); put(13, 2, "L"); put(3, 1, "W"); put(7, 1, "W"); put(2, 9, "x");
        },
      },
    };

    // ------------------------------------------------------------ il Quadrante del Pullman
    const ARRIVO = {
      1938: [["voce", "Il Pullman parte a trentotto all'ora. Le luci si stirano, il neon diventa gas, il gas diventa buio. Poi un campanile, un odore di pane e di legna. Il colore se ne va piano, come l'acqua da una vasca."], ["voce", "Sul muro di fronte, un manifesto: «INAUGURAZIONE DEL CAMPO · RONDINARA – MULINO · DOMENICA 14 OTTOBRE 1938». Lo stesso giorno. Cent'anni prima."]],
      1978: [["voce", "Il Pullman tossisce, scarta, sbanda in una curva che non c'è. Le luci diventano arancioni, la musica di un jukebox entra dal finestrino e la polvere si mette a brillare nel sole."], ["voce", "Un motorino ti sorpassa a passo d'uomo. Sul muro di fronte, un manifesto: «FINALE DELLA COPPA DELLE RONDINI · OGGI POMERIGGIO · TUTTI AL CAMPO»."]],
      2038: [["voce", "Il Pullman riprende fiato, e il neon torna come un messaggio non letto. Il piazzale è lì, rosa e azzurro, con il tremito di prima. Sono passate poche ore, per lui; per tutti gli altri, cent'anni o quaranta, dipende."]],
    };
    K.viaggio = K.viaggio || []; K.viaggio.push((ep) => { if (K.mem().ch === 1 && S() === 2 && ep === 1938) setStep(N, 3); });
    K.arrivo = (ep, then) => say(ARRIVO[ep] || ARRIVO[2038], then || done);
    K.quadrante = () => {
      const ch = K.mem().ch, now = K.ep();
      const ok = { 2038: true, 1938: S() >= 2 || ch >= 2, 1978: ch >= 2 };
      const go2 = (ep) => { if (ep === now) return say([["voce", `Siete già nel ${ep}. Il Pullman fa «ding» e basta.`]]); K.viaggia(ep); (K.viaggio || []).forEach((f) => f(ep)); K.go("rt_piazzale", 5, 7); K.arrivo(ep); };
      ask("voce", `<b>Il Quadrante del Pullman</b><br>Tre ghiere, un'ora fissa: le 22:04. Adesso siete nel <b>${now}</b>. Dove vuoi andare?`, [
        { label: "2038 · Oggi", sub: "Il neon, il VAR Totale, il centenario", cls: now === 2038 ? "" : "hot", disabled: !ok[2038], fn: () => go2(2038) },
        { label: ok[1978] ? "1978 · L'anno della Coppa" : "1978 · …", sub: ok[1978] ? "Gli anni '70, la finale, il Bar da Ines" : "La ghiera è bloccata: non ancora tarata", disabled: !ok[1978], fn: () => go2(1978) },
        { label: ok[1938] ? "1938 · L'anno dell'inizio" : "1938 · …", sub: ok[1938] ? "Bianco e nero, un campo di terra, il primo gol" : "Parla prima con il Professore", cls: S() === 2 ? "hot" : "", disabled: !ok[1938], fn: () => go2(1938) },
        { label: "Non adesso", fn: done },
      ], "rt_officina");
    };

    // ------------------------------------------------------------ la partita: Palla del Tempo · l'inaugurazione
    function partita1() {
      K.palla({
        title: "Palla del Tempo · L'inaugurazione", eras: [1938, 2038], bg: "rt_campo38", oppStyle: "difensiva",
        opp: { name: "Mulino", color: "#c8782a", players: [{ name: "Baldo" }, { name: "Macina" }], keeper: { name: "Il Setaccio" } },
        mate: { name: "Dorino", skin: "#e0b890", hair: "#2a1a10" },
        intro: "<p>L'inaugurazione del campo, nel 1938. La Palla del Tempo la fa durare più di un pomeriggio: finito il primo tempo, la partita <b>salta nel 2038</b>, sullo stesso prato. Il pallone è lo stesso.</p>",
        done: (r) => {
          if (r.quit) return say([["voce", "Lasci il campo. Dorino ti guarda, con il pallone sotto il braccio. «Quando vuoi. Il pomeriggio è lungo.»"]]);
          F.set("rt_m1", r.win ? "vinta" : "persa"); K.learnLore("l_palla", true);
          if (!r.win) return K.scene([["voce", "Il fischio finale arriva come uno schiaffo. Il Pullman ti riporta all'inizio del pomeriggio, con un ronzio di scuse."], ["rt_dorino", "[pensa] Ehi, forestiero. Ancora una volta? Il Mulino ha vinto, ma non ha ancora mangiato."]], () => K.enterZone("rt_campo"), "rt_campo38");
          F.set("rt_foto_ok", true); K.learnLore("l_forestiero", true);
          K.scene([
            ["voce", "Fischio finale. L'ultimo pallone rimbalza in un anno e finisce in un altro: dalla terra battuta al prato di luce. Il pubblico in cappello e il pubblico d'ologramma applaudono nello stesso istante."],
            ["rt_dorino", "[felice] Forestiero! Il primo gol del Club! Il primo di una lunga serie. Dobbiamo scriverlo da qualche parte. Come ti chiami?"],
            ["voce", "Fai per rispondere. Il Pullman, dal parcheggio, suona due volte, secco. Dorino ride: «Hai un autobus che ti chiama! Vai, vai. Il nome lo scrivo io: Il Forestiero»."],
          ], () => { K.viaggia(2038); setStep(N, 4); K.go("rt_piazzale", 24, 10); say([["voce", "Il piazzale, il neon, le 22:04. La vetrina dei trofei, in fondo, ha un colore diverso."]]); }, "rt_campo38");
        },
      });
    }
    function sfida2038() {
      ask("rt_tosta", "BIP. Calcetto di piazza? Perdi: un toast. Vinci: due toast. Il sistema dice che è un buon cambio.", [
        { label: "La Palla del Tempo", sub: "La partita originale, 2 epoche", cls: "hot", fn: () => K.palla({ title: "Calcetto di piazza · Palla del Tempo", eras: [1978, 2038], oppStyle: "equilibrata", opp: { name: "I Toast", color: "#e8a43a", players: [{ name: "Crosta" }, { name: "Mollica" }], keeper: { name: "Il Tostapane" } }, bg: "rt_piazza", done: (r) => { if (r.quit) return done(); say([["rt_tosta", r.win ? "BIP. Due toast. E un complimento che non so fare." : "BIP. Un toast. Con tanta marmellata, che consola."]], done); } }) },
        { label: "Un'altra modalità", sub: "3 contro 3, 2D HD o La Gabbia", fn: () => K.playMatch({ alt: "az,cage,hd", force: false, id: "rt_toast", chap: "Rondine 1938-2038", oppNames: ["Crosta", "Mollica", "Il Tostapane"], intro: "Calcetto di piazza al neon con Tostino.", done: (r) => say([["rt_tosta", r.win ? "BIP. Due toast." : "BIP. Un toast."]], done) }) },
        { label: "Più tardi", fn: done },
      ], "rt_piazza");
    }

    // ------------------------------------------------------------ finale del capitolo
    function end1(kind) {
      if (kind === "freno") bond("vera", 1); else if (kind === "campo") bond("club", 2); else bond("vera", -1);
      F.set("rt_titolo", true); const msg = K.reward("ch:rt_c1", { coins: 80, cos: ["rt_c1", "rt_suola"] });
      finishChapter(N); setStep(N, 5); questDone("rt_gol38");
      K.scene([
        ["rt_vera", kind === "freno" ? "Un uomo di buon senso. Ce ne sono pochi, e lavorano tutti per il mio ufficio, dopo un po'." : kind === "campo" ? "Il passato come unico campo. Una bella frase. Da stampare, e da archiviare." : "Fiducia, ironia. Mi ricorda qualcuno. Qualcuno che ha perso."],
        ["voce", "Vera Revisori si ferma, e per un secondo sembra più anziana di cinquantatré anni. Poi i droni rimettono la sua faccia in ordine, e il tono è di nuovo quello di un verbale."],
        ["rt_vera", "Il 1938 è chiuso. Il 1978, invece, ha un'anomalia più grande: la finale della Coppa delle Rondini. Un gol che non c'è mai stato. Mi occuperò io di quella."],
        ["voce", `<b>Fine del Capitolo 1 · Le 22:04.</b> ${msg.join(" · ")}<br><span style="color:var(--dim)">Il Professor Quarzo ti aspetta nell'Officina: il Quadrante ha una ghiera nuova.</span>`],
      ], () => K.openMain(), "rt_piazza");
    }
    function veraScena() {
      K.scene([
        ["voce", "Una luce rossa scende sulla piazza, sottile, come un puntatore laser. Poi un'altra, e un'altra. Tre droni a forma di fischietto si mettono in fila, e dietro di loro, a passo di verbale, arriva una donna in tailleur argento."],
        ["rt_vera", "Vera Revisori, direttrice del VAR Totale. Lei è il Campione. L'ospite d'onore. L'anacronismo."],
        ["rt_vera", "[pensa] Ho visto la revisione del gol del 1938, tre minuti fa. Prima era annullato. Adesso è convalidato, e l'autore è un forestiero. Tutti i nostri sistemi hanno fatto «hm»."],
        ["rt_vera", "Non mi piacciono gli anacronismi. Il passato non è un campo da gioco, signor Campione: è un verbale. Lo si controlla, non lo si ritocca."],
      ], () => ask("rt_vera", "Mi dica: lei si fermerà qui?", [
        { label: "«Il passato è l'unico campo che abbiamo»", sub: "Rispondere a tono", cls: "hot", big: true, fn: () => end1("campo") },
        { label: "«Ha ragione, ma non basta»", sub: "Darle un po' di ragione", big: true, fn: () => end1("freno") },
        { label: "«Un verbale, eh. Anche lei ha un nome sul bavero»", sub: "Pungerla, con garbo", big: true, fn: () => end1("sfida") },
      ], "rt_piazza"), "rt_piazza");
    }

    const talk = {
      rt_tilly() {
        const s = S();
        if (s >= 5) return say([["rt_tilly", "Sul tabellone, adesso, c'è scritto «1–0 · il Forestiero». Per la prima volta dopo cent'anni c'è un nome. E non ho capito perché mi viene da piangere."]]);
        if (s >= 4) return say([["rt_tilly", "[sorpreso] È tornato! Guardi la vetrina: la foto è nitida. Ma c'è qualcosa… vada a vedere."]]);
        if (s >= 1) return say([["rt_tilly", s === 1 ? "La vetrina è accanto al cancello. Poi il Professore, nella Torre. Lui ha una macchina, e un'idea. Una delle due funziona." : "Il Professore le ha dato il pullman? Mi raccomando: lo restituisca. È l'unico che ho."]]);
        say([
          ["rt_tilly", "[sorpreso] Lei è il Campione! L'ospite d'onore! Io sono Tilly, il tabellone sono io. Cioè, lo tengo io. Cioè, lo prego."],
          ["rt_tilly", "Da stamattina il Club è in mano a un sistema nuovo: il VAR Totale. Rivede i gol. Anche quelli di prima che nascessi. Soprattutto quelli."],
          ["rt_tilly", "Guardi la vetrina dei trofei, qui accanto: la foto del 1938 sta sbiadendo. Poi parli con il Professor Quarzo, nella Torre. Lui sa."],
        ], () => { setStep(N, 1); quest("rt_gol38", "Il gol del '38", "Il VAR Totale sta annullando il primo gol della storia del Club. Parla con il Professor Quarzo, nella Torre dell'Orologio."); done(); });
      },
      rt_nonna() {
        const s = S();
        if (s >= 4) return say([["rt_nonna", "Guardala bene, la foto. Quel forestiero che mi tiene in braccio… ha la faccia di uno che ha fretta di tornare. Come te."], ["rt_nonna", "Ti aspettavo da ottant'anni, caro. Cioè: da quando ho imparato a parlare."]]);
        if (F.is("rt_nonna1")) return say([["rt_nonna", s >= 3 ? "Il seme, nel 1938, in piazza. Nel posto dove ora c'è il platano. Mia madre lo ha visto fare, e non ha mai voluto dire da chi." : "Il seme tienilo caldo. È un platano piccolissimo che ha ancora tutto da decidere."]]);
        F.set("rt_nonna1", true); bond("club", 1);
        say([
          ["rt_nonna", "Mi chiamo Ines, e ho cent'anni, e tutti qui mi chiamano Nonna. Guardi, signor Campione: lei ha le scarpe di uno che sta per partire."],
          ["rt_nonna", "Il platano della piazza è mio coetaneo, e sta male. Se andrai 'là', pianta questo. Me lo diede mia madre. Disse: «Un forestiero lo piantò, e tu devi restituirlo»."],
          ["voce", "Ti mette in mano un seme piccolo, scuro, caldo come un sasso al sole. Lo metti nel taschino con più cura di un portafoglio."],
        ], () => { F.set("rt_seme", true); K.learnLore("l_seme"); done(); });
      },
      rt_tosta() { if (S() >= 4) return sfida2038(); return say([["rt_tosta", K.pick(["BIP. Toast al prosciutto, al formaggio, al paradosso. Quest'ultimo costa di più, ma l'hai già mangiato ieri.", "BIP. Se non riesci a fermare il tempo, posso fermarti una pausa: due minuti, con la crosta croccante."])]]); },
      rt_quarzo() {
        const s = S();
        if (s >= 5) return say([["rt_quarzo", "Un gol nel '38, un seme che cresce, una foto che si fa da sola. Sono quarant'anni che cerco un'equazione bella come questa. Ora mi manca solo il tè."]]);
        if (s >= 2) return say([["rt_quarzo", s === 2 ? "Il Pullman è quello blu, con la targa a tre date. Scegli il 1938: le altre ghiere sono ancora sotto garanzia." : "Eri laggiù e già mi ricordi come uno che parla. Tornerai: il Quadrante è fatto apposta."]]);
        say([
          ["rt_quarzo", "[sorpreso] Un ospite! Entri, entri, non tocchi niente. Quello che fuma è il tè, quello che brilla è il futuro: non li confonda."],
          ["rt_quarzo", "Sono Ottavio Quarzo, orologiaio del Club. Qui dentro il tempo non passa: per questo sono ancora in forma. Fuori dalla porta, invece, mi sbriciolerei in un minuto."],
          ["rt_quarzo", "Ho sentito Tilly. Il VAR Totale non rivede più le partite: rivede la storia. E ha cominciato dal principio: il gol del '38. Un gol annullato nel '38 significa niente Club, niente stadio, niente centenario."],
          ["rt_quarzo", "[pensa] Il Pullman Rondine, quello blu: parte a trentotto all'ora. Non a ottantotto. I miei calcoli sono più modesti, e anche i miei guasti."],
          ["rt_quarzo", "E questa è la Palla del Tempo. Una palla sola, una partita sola, giocata in più anni. Quello che fai nel passato lo ritrovi nel futuro: un seme diventa un albero, un tiro sbagliato diventa un guaio."],
          ["rt_quarzo", "Dunque: nel 1938 si gioca la prima partita. Fai segnare il gol, torna. E non dire a nessuno da dove vieni. Anzi: dillo a chi vuoi. Tanto non fa mai bene a nessuno."],
        ], () => { setStep(N, 2); F.set("rt_palla", true); K.learnLore("l_pullman", true); K.learnLore("l_vetrina", true); quest("rt_gol38", "Il gol del '38", "Sali sul Pullman, nell'Officina, e scegli il 1938. Aiuta Dorino a inaugurare il campo."); done(); });
      },
      rt_madre38() {
        if (F.is("rt_foto")) return say([["rt_madre38", "Le mele sono fresche e la bimba è calma. Due miracoli, e non ho ancora preso il caffè."]]);
        if (S() < 3) return say([["rt_madre38", "Mele! Mele di Rondinara!"]]);
        say([
          ["rt_madre38", "[sorpreso] Madonna, che scarpe! Di dove viene, signore? …Mi tenga un minuto la carrozzina: devo portare queste mele a Baldo, che le ha già mangiate."],
          ["voce", "Nella carrozzina una neonata dorme con un pugno chiuso e l'altro aperto, come chi ha già deciso tutto e non ha ancora detto niente."],
          ["rt_madre38", "(Torna.) Grazie! Aspetti: una fotografia. La macchinetta è di mio cognato, è un inventore. Un forestiero con una bambina: capita una volta."],
          ["voce", "Un lampo bianco, un clic. La stampa esce dalla macchinetta già asciutta, in barba al 1938. «Brevetto di famiglia», dice Rosa. «Non lo dica in giro.»"],
          ["rt_madre38", "Si chiama Ines, la bambina. Come la nonna. Tenga la foto: ai forestieri porta fortuna."],
        ], () => { F.set("rt_foto", true); K.learnLore("l_foto"); bond("club", 1); done(); });
      },
      rt_dorino() {
        const s = S(), here = K.api.trZone();
        if (here === "rt_campo") {
          if (K.ep() !== 1938) return done();
          return ask("rt_dorino", F.is("rt_m1") ? "Ci riproviamo? Il Mulino ha ancora fame." : "Ci siamo. Il pallone, il campo, il Mulino. Io ho paura. Tu?", [
            { label: "Gioca l'inaugurazione", sub: "Palla del Tempo · 1938 e 2038", cls: "hot", fn: partita1 },
            { label: "Ancora un momento", fn: done },
          ], "rt_campo38");
        }
        if (F.is("rt_dorino1")) return say([["rt_dorino", s >= 3 ? "Alle tre, al campo. A est, dietro il cancello. Non mancare: io mi fido di quelli che arrivano da lontano." : "Il campo è a est."]]);
        F.set("rt_dorino1", true);
        say([
          ["rt_dorino", "Tu! Quello con le scarpe strane! Sai giocare? Sì? Meno male. Alle tre inauguriamo il campo e ho dieci uomini e un cane."],
          ["rt_dorino", "Mi chiamo Dorino. Ho fondato questa squadra con undici lire e una bugia. Il Mulino ci ha sfidati: Baldo dice che il campo non c'è. Il campo c'è. Mancano i giocatori."],
        ], () => ask("rt_dorino", "Da dove vieni, forestiero?", [
          { label: "«Dal futuro. Tra cent'anni lo stadio c'è ancora»", sub: "Dirgli la verità", cls: "hot", big: true, fn: () => { F.set("rt_detto", true); bond("club", 2); say([["rt_dorino", "[ride] Cent'anni! Allora dobbiamo vincere per forza: non sarebbe da te fare tanta strada per vederci perdere."], ["rt_dorino", "…Non lo dirò a nessuno. Anche perché non mi crederebbero. Anche perché io ti credo, e non so perché."]], () => { F.set("rt_scarpini", true); done(); }); } },
          { label: "«Da lontano. Molto lontano»", sub: "Restare sul vago", big: true, fn: () => { F.set("rt_detto", false); say([["rt_dorino", "Lontano basta. A noi serve uno che sappia correre, non uno che sappia la strada."]], () => { F.set("rt_scarpini", true); done(); }); } },
          { label: "«Non importa: passiamo il pallone»", sub: "Cambiare discorso", big: true, fn: () => { bond("club", 1); say([["rt_dorino", "[felice] Questa è la risposta che piace a un capitano!"]], () => { F.set("rt_scarpini", true); done(); }); } },
        ], "rt_piazza38"));
      },
      rt_baldo() { return say([[("rt_baldo"), K.pick(["Il campo? Un prato con le righe. Noi del Mulino abbiamo anche il fornaio.", "Il Rondinara! Una squadra che si allena con una carrozzina di mele. Sono tutti pazzi, qui.", "Se giochi per loro, sei un coraggioso. Se giochi per noi, sei un mugnaio. Scegli, forestiero."])]]); },
    };
    const obj = {
      "rt_piazzale:>": () => (S() >= 3 || K.ep() !== 1938 || S() >= 4 ? go("rt_campo", 1, 10) : say([["voce", "Prima fermati a parlare con Dorino, in fondo alla piazza: il campo è suo, e ti aspetta."]])),
      "rt_campo:<": () => go("rt_piazzale", 28, 10),
      "rt_piazzale:A": () => {
        const s = S(), era = K.ep();
        if (era !== 2038) return say([["voce", era === 1978 ? "La vetrina dei trofei: una coppa di latta, una di cartone dorato, e uno spazio vuoto con un cartellino: «PER IL 1978»." : "Una bacheca di legno con una sola foto: l'inaugurazione di un campo che sarà inaugurato oggi pomeriggio. Qualcuno l'ha già messa, con troppo anticipo."]]);
        if (s >= 4 && F.is("rt_foto_ok") && !F.is("rt_vetrina_vista")) { F.set("rt_vetrina_vista", true); return K.scene([
          ["voce", "La foto in vetrina è nitida. Tutti i volti: Dorino con la fascia, Baldo che sbircia, Rosa con le mele. E, in terza fila, uno con le scarpe strane e lo sguardo di chi non sa dove mettere le mani."],
          ["voce", "Sotto, a stampa: «IL FORESTIERO · autore del primo gol del Club». Quel forestiero ha la tua faccia."],
          ["rt_tilly", "[sorpreso] Ehi… ehi! Quello sei tu! Sei sempre stato tu! Sei il Forestiero! Sei… sei un anacronismo, ma di quelli belli!"],
        ], veraScena, "rt_piazza"); }
        if (s >= 5) return say([["voce", "La foto del 1938, nitida. In terza fila, il Forestiero guarda l'obiettivo. Sulla targa, adesso, c'è anche il tuo nome."]]);
        if (s >= 4) return talk.rt_tilly();
        say([["voce", s < 1 ? "La vetrina dei trofei: un ologramma di coppe, una foto di squadra del 1938. I volti sono macchie, una dopo l'altra, partendo dal fondo." : "La foto del 1938: i volti sbiadiscono uno dopo l'altro. A destra, il tabellino dice «Rondinara 1 – Mulino 0», poi un numero negativo, poi «in revisione»."]], () => { K.learnLore("l_vetrina", true); done(); });
      },
      "rt_piazzale:P": () => {
        const era = K.ep(), plant = F.is("rt_pianta");
        if (era === 1938) {
          if (F.is("rt_seme") && !plant) return ask("voce", "Un'aiuola vuota, con un bordo di pietre. La terra è soffice. Nel taschino, il seme di Nonna Ines è caldo.", [
            { label: "Pianta il seme", sub: "Lascia una traccia: un albero in piazza, nel 1978 e nel 2038", cls: "hot", big: true, fn: () => { F.set("rt_pianta", true); F.set("rt_seme", false); bond("club", 1); K.note("Hai piantato il seme del platano, nel 1938."); say([["voce", "Scavi un dito di terra, metti il seme, lo ricopri con due sassi. Senti, da qualche parte, il rumore di un orologio che fa un passo in più."], ["voce", "Nessuno ti ha visto, a parte una bambina nella carrozzina, che ha aperto un occhio e l'ha richiuso."]], done); } },
            { label: "Tienilo ancora", fn: done },
          ], "rt_piazza38");
          return say([["voce", plant ? "Il germoglio del platano, con due foglie e un tutore di canna. Sembra poco. Tra cent'anni, sarà un gigante." : "Un'aiuola vuota, con un bordo di pietre. «Ci metteremo qualcosa», dice il giardiniere. «Un giorno.»"]]);
        }
        if (era === 1978) return say([["voce", plant ? "Un platano giovane, già più alto di un uomo. Un cartellino: «Piantato nel 1938 da ignoto. Annaffiare con costanza e con un po' di fede»." : "Un'aiuola con erbacce e una canna storta. Il giardiniere ha lasciato un biglietto: «Qui ci va un albero. Ogni anno lo dico»."]]);
        say([["voce", plant ? "Un platano immenso, con la chioma di luce, a metà tra un albero e un'idea. Cent'anni, e sembra più giovane di te." : "Il platano di piazza: cent'anni di ombra e, adesso, il fiato corto. Alcune foglie sono già cadute, e non fanno rumore."]]);
      },
      "rt_officina:O": () => (S() < 2 ? say([["voce", "Il Pullman Rondine, blu e bianco. Il Professore ti guarda: «Non ancora. Prima ti spiego»."]]) : K.quadrante()),
      "rt_campo:U": () => say([["voce", K.ep() === 2038 ? "La console del tabellone: tasti luminosi, una levetta e una tazza di tè al neon. Un messaggio scorre: «PUNTEGGIO IN REVISIONE»." : "Qui, nel 1938, c'è solo una lavagna: ma la console, per qualche motivo, resta."]]),
    };
    const patch = {};
    return { n: N, title: "Le 22:04", sub: "La vigilia del centenario, la Torre, il 1938", goal, start: "rt_piazzale", introBg: "rt_piazza", zones, talk, obj, patch,
      intro: () => [["voce", "Rondinara, 14 ottobre 2038. Domani lo Stadio delle Rondini compie cent'anni, e stasera ha il fiato corto: i tabelloni sfarfallano, i neon tossiscono, la Torre dell'Orologio è ferma alle 22:04 da quando ne ha memoria."], ["voce", "Tu sei qui perché ti hanno invitato come ospite d'onore: sarai tu a dare il primo calcio, domani. Ti hanno chiesto di portare scarpe comode e pazienza."]] };
  }
  boot();
})();
