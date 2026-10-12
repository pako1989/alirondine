// js/mantello-c1.js - IL MANTELLO GRANATA · Capitolo 1 «Il mantello nell'armadio»
// Metropolenta. I Panchinari rubano la Coppa della Città e scappano oltre il canale (il ponte è alzato da vent'anni).
// Nella sartoria di Nonna Tilde c'è un mantello granata: chi lo indossa VOLA, a un palmo da terra, sopra i canali.
// Sui tetti si recupera Bullone, il robot-tostapane della sarta. Poi la prima partita a Super-Bottoni contro i Panchinari,
// e la prima scelta da supereroe: la foto sul giornale, a volto scoperto o no?
(function () {
  "use strict";
  function boot() { const D = window.__mantello; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("mg_tilde", { acc: ["occhiali", "grembiule"], name: "Nonna Tilde, sarta", tag: "gray", hair: "#e8e8f0", style: "bun", skin: "#f0d0b0", eye: "#3a3a6a", bg: ["#2a1030", "#d82a3a"], shirt: "#8a1a2a" },
      "La sarta di via dei Bottoni. Ha cucito le maglie di tutte le squadre di Metropolenta per cinquant'anni. Tiene gli spilli in bocca anche quando parla, e non ne ha mai ingoiato uno. Dice. Ha un armadio che non apre mai.");
    K.cast("mg_gilda", { acc: ["taccuino"], name: "Gilda Flash, fotoreporter", tag: "", hair: "#2a1a3a", style: "bob", skin: "#e8c4a0", eye: "#2a5a3a", bg: ["#1a1a3a", "#ffd23f"], shirt: "#e8c84a" },
      "Fotoreporter del Corriere di Metropolenta. Ha fotografato tutto: incendi di caldarroste, gatti sindaci, un tram volante (era un tram su un ponte). Le manca solo una foto: quella di un vero supereroe.");
    K.cast("mg_bullone", { shape: "tostapane", acc: ["cuffie"], name: "Bullone, robot-tostapane", tag: "", hair: "#8a9aa8", style: "buzz", skin: "#b8c4d0", eye: "#3a8ac8", bg: ["#2a3a4a", "#9ad8ff"], shirt: "#6a7a8a" },
      "Il robot di Nonna Tilde: un tostapane con le gambe, costruito per stirare le maglie. Stira benissimo. Tosta anche le maglie, ogni tanto. Dice solo «bip» e «bop», ma con un'espressività che commuove.");
    K.cast("mg_tonno", { acc: ["bandana"], name: "Tonno, capo dei Panchinari", tag: "", hair: "#3a2a1a", style: "buzz", skin: "#e0b890", eye: "#3a2a1a", bg: ["#1a2a4a", "#3a6ab8"], shirt: "#3a6ab8", beard: true },
      "Capo dei Panchinari: tre giocatori che non sono mai entrati in campo, in nessuna partita, mai. Si sono offesi. Adesso rubano le coppe, per sapere che effetto fa tenerne una in mano.");
    K.cast("mg_ciuffo", { name: "Ciuffo, panchinaro", tag: "", hair: "#e8c84a", style: "cresta", skin: "#f0c8a0", eye: "#3a3a3a", bg: ["#1a2a4a", "#3a6ab8"], shirt: "#3a6ab8" },
      "Il secondo dei Panchinari. Si pettina il ciuffo durante i colpi. Anche durante le fughe. Per questo li prendono sempre.");
    K.cast("mg_brace", { acc: ["casco"], name: "Capitana Brace, pompiera", tag: "", hair: "#c8642a", style: "ponytail", skin: "#c68642", eye: "#2a2a2a", bg: ["#3a1010", "#ff8a3a"], shirt: "#c8302a" },
      "Capitana dei pompieri di Metropolenta. Spegne incendi, recupera gatti, sfida chiunque a calcio nel cortile della caserma. Perde di rado. Quando perde, offre il caffè della moka da quaranta tazze.");
    K.cos("mg_c1", { kind: "shirt", label: "Maglia granata del Mantello", val: "#8a1a2a", from: "Capitolo 1 del Mantello Granata" });
    K.cos("mg_ritagli1", { kind: "hairc", label: "Capelli Rosso Fumetto", val: "#d82a3a", from: "Trova tutti i ritagli di stoffa della piazza e dei tetti" });
    K.cos("mg_foto", { kind: "acc", label: "Macchina fotografica di Gilda", val: "#ffd23f", from: "Prima pagina del Corriere di Metropolenta" });
    K.lore("l_mantello", { t: "Il Mantello Granata", d: "Cucito con la maglia di una squadra di Metropolenta che non esiste più. Nonna Tilde dice che la stoffa si ricorda di ogni gol segnato con quella maglia: per questo vola. Per questo, a volte, esulta da sola." });
    K.lore("l_volo", { t: "Forma · Volo", d: "Sospeso a un palmo da terra, il mantello che sventola. Si passa sopra i canali di Metropolenta. Non più in alto di un palmo: il mantello soffre di vertigini." });
    K.lore("l_fulmine", { t: "Potere · Fulmine Granata", d: "Nella partita a bottoni: il prossimo tiro parte fortissimo e passa attraverso gli avversari. Tocca solo il pallone. Come un fulmine, ma più educato." });

    const goal = (s) => ({
      0: "Metropolenta è in subbuglio. All'edicola della piazza c'è Gilda Flash, la fotoreporter: lei sa tutto.",
      1: "Vai alla sartoria di Nonna Tilde, la casa con la porta rossa a nord-ovest della piazza.",
      2: "Bullone è scappato sui tetti. Vola sopra il canale (dal menu o in una cabina: forma Volo) e prendi la scala in alto a destra.",
      3: "Bullone è con te. I Panchinari sono davanti al Bar Panchina, oltre il canale: riprendi la Coppa della Città.",
      4: "La Coppa è salva. Gilda vuole la foto dell'eroe: parlale all'edicola.",
    }[s] || "Il primo numero dell'albo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      mg_piazza: {
        region: "citta", name: "Il Mantello Granata · Piazza dei Bottoni", short: "Piazza dei Bottoni", sub: "Canali, edicole e auto in doppia fila", bg: "mg_piazza", time: "giorno", travel: [8, 11], caption: "INTANTO, A METROPOLENTA…",
        w: 36, h: 24, start: [8, 11], itemCos: "mg_ritagli1", items: [[2, 12], [14, 21], [33, 21], [22, 2]],
        areas: [[17, 0, 19, 23, "Il Canale Grande"], [20, 0, 35, 23, "Oltre il canale"], [0, 0, 16, 23, "Piazza dei Bottoni"]],
        act: { "^": "Sali sui tetti" },
        flavor: { E: ["L'edicola di Gilda. Titolo di oggi: «RUBATA LA COPPA DELLA CITTÀ! I PANCHINARI COLPISCONO ANCORA». Sotto, più piccolo: «Previsioni: sole, con possibilità di eroi».", "Fumetti, giornali, figurine. Una rivista si chiama «Eroi in pensione: dove sono adesso?». In copertina, una sagoma con il mantello. Di spalle."], K: ["Un'auto in doppia fila. Sul parabrezza, un biglietto: «Torno subito». È polveroso.", "Un'auto in doppia fila, con le quattro frecce accese da quella che sembra una settimana."] },
        intro: [["voce", "<b>IL MANTELLO GRANATA · NUMERO 1.</b> Metropolenta: una città di canali, tetti rossi, tram che cantano e auto parcheggiate in doppia fila dal 1987."], ["voce", "Stamattina, durante la cerimonia, qualcuno ha rubato la Coppa della Città. Tre tizi in tuta, con le scarpe nuove (mai usate, come si vede dalle suole). Sono scappati oltre il Canale Grande, dove il ponte è alzato da vent'anni."]],
        npcs: (s) => [
          { id: "mg_gilda", at: [13, 6] },
          { id: "mg_brace", at: [8, 20] },
          ...(s <= 3 ? [{ id: "mg_tonno", at: [27, 10] }, { id: "mg_ciuffo", at: [24, 12], route: [[24, 12], [31, 12], [31, 14], [24, 14]], speed: 0.4, pause: 50 }] : []),
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 23, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          lay(17, 0, 19, 23, "w"); put(32, 0, "^"); put(33, 0, "^");
          lay(1, 8, 16, 12, "+"); lay(20, 8, 34, 15, "+");
          house(3, 2, 7, 5, { door: [6, 6], roof: "#c8302a", wall: "#f0d8c8", rr: 3, lit: true, enter: { to: "mg_sartoria", at: [10, 10] } }); lay(6, 7, 6, 7, ":");
          put(12, 4, "E"); put(13, 4, "E"); lay(12, 5, 14, 5, ":"); put(15, 10, "J");
          house(3, 14, 7, 5, { door: [6, 18], roof: "#a82a2a", wall: "#e8c8b0", rr: 3, enter: "La caserma dei pompieri. Dentro, una moka da quaranta tazze sul fuoco e un gatto che dorme nel casco di riserva." }); lay(6, 19, 6, 21, ":"); lay(6, 21, 15, 21, ":");
          house(24, 2, 8, 5, { door: [27, 6], roof: "#3a5a8a", wall: "#d8d0c0", rr: 3, enter: "Il Bar Panchina. Sulle sedie ci sono i cuscini, perché i Panchinari ci stanno seduti tutto il giorno. Il barista dice che pagano sempre, ma con le figurine." }); lay(27, 7, 27, 7, ":");
          lay(32, 1, 33, 7, ":"); lay(28, 7, 32, 7, ":"); lay(21, 16, 21, 21, ":"); lay(21, 21, 34, 21, ":");
          [[11, 14], [12, 14], [13, 14], [10, 16]].forEach(([x, y]) => put(x, y, "K")); put(10, 21, "s");
          [[2, 2], [14, 2], [22, 18], [29, 18], [2, 22], [34, 2]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) { // il ponte alzato, a metà del canale
          const x = d.X(17), y = d.Y(10); g.fillStyle = "#8a5a3a"; g.fillRect(x - 6, y - 10, 10, 26); g.fillRect(x + 42, y - 10, 10, 26); g.strokeStyle = "#5a3a2a"; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 1, y - 10); g.lineTo(x + 8, y - 30); g.moveTo(x + 47, y - 10); g.lineTo(x + 38, y - 30); g.stroke();
          g.fillStyle = "#fff"; g.font = "bold 5px sans-serif"; g.fillText("PONTE ALZATO DAL 2004", x + 2, y + 24);
        },
      },
      mg_sartoria: {
        interior: true, region: "casa", name: "Il Mantello Granata · La sartoria di Nonna Tilde", short: "La sartoria", sub: "Spilli, stoffe e un armadio chiuso", bg: "mg_sartoria", w: 20, h: 13, start: [10, 10], outside: ["mg_piazza", 6, 7], caption: "INTANTO, IN VIA DEI BOTTONI…",
        act: { T: "Guarda il tavolo da sarta", L: "Guarda gli scaffali delle stoffe", D: "Guarda l'armadio", W: "Guarda dalla finestra", v: "Esci" },
        flavor: { T: "Il tavolo da sarta: forbici, gessetti, metri a nastro arrotolati come serpenti addormentati. E un cartamodello con scritto «MANTELLO · taglia: chiunque».", L: ["Stoffe di tutti i colori. Una pila è etichettata «maglie di squadre che non esistono più». Sono tante.", "Un rotolo di stoffa granata, quasi finito. Ne manca un pezzo grande come un mantello."], W: "Dalla finestra si vede il Canale Grande, e oltre il canale il Bar Panchina. Tre sagome passano una coppa di mano in mano, ridendo." },
        intro: [["voce", "La sartoria di Nonna Tilde: macchine da cucire, manichini con le maglie di tutte le squadre di Metropolenta, e un armadio di legno scuro chiuso con tre lucchetti."]],
        npcs: () => [{ id: "mg_tilde", at: [10, 5] }],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(2, 1, 6, 1, "L"); put(14, 1, "D"); put(15, 1, "D"); put(9, 1, "W"); put(4, 7, "T"); put(5, 7, "T"); put(15, 8, "T"); put(2, 10, "s"); },
      },
      mg_tetti: {
        region: "tetti", name: "Il Mantello Granata · I tetti di Metropolenta", short: "I tetti", sub: "Comignoli, antenne e piccioni", bg: "mg_tetti", time: "tramonto", travel: [3, 18], caption: "INTANTO, SUI TETTI…",
        w: 30, h: 20, start: [3, 18], items: [[3, 2], [27, 17]],
        areas: [[0, 0, 29, 19, "I tetti di Metropolenta"]], act: { v: "Scendi in piazza" },
        flavor: { p: "Un comignolo. Esce un fumo che sa di ragù. È domenica, da qualche parte sotto di te.", l: "Un'antenna della televisione. Ci sono appollaiati tre piccioni che guardano la partita. Tifano tutti per squadre diverse." },
        intro: [["voce", "I tetti di Metropolenta, al tramonto: tegole rosse, comignoli, antenne storte e piccioni che ti guardano come si guarda un intruso. Da qualche parte, un «bip» disperato."]],
        npcs: (s) => (s <= 2 ? [{ id: "mg_bullone", at: [24, 5] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 19, 29, 19, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a"); lay(1, 1, 28, 18, "+"); put(3, 19, "v");
          [[6, 4], [12, 3], [18, 8], [9, 12], [22, 13], [15, 16], [26, 9], [5, 9]].forEach(([x, y]) => put(x, y, "p")); [[10, 7], [20, 3], [24, 16]].forEach(([x, y]) => put(x, y, "l")); put(25, 4, "p");
        },
        decor(g, cx, cy, d) { for (let y = 1; y < 19; y += 2) { g.strokeStyle = "rgba(120,40,30,.25)"; g.lineWidth = 1; g.beginPath(); g.moveTo(d.X(1), d.Y(y)); g.lineTo(d.X(29), d.Y(y)); g.stroke(); } },
      },
    };
    function match() {
      K.ownMatch(window.__bottoni.start, {
        oppStyle: "contropiede", title: "Super-Bottoni · contro i Panchinari", us: "Il Mantello e soci", usColor: "#8a1a2a", power: "fulmine", shots: 7,
        mates: [{ name: "Bullone", skin: "#b8c4d0", hair: "#8a9aa8" }, { name: "Brace", skin: "#c68642", hair: "#c8642a" }, { name: "Gilda", skin: "#e8c4a0", hair: "#2a1a3a" }],
        opp: { name: "I Panchinari", color: "#3a6ab8", players: [{ name: "Tonno", skin: "#e0b890", hair: "#3a2a1a" }, { name: "Ciuffo", skin: "#f0c8a0", hair: "#e8c84a" }, { name: "Mezzala", skin: "#d9a679", hair: "#1a1a1a" }, { name: "Riserva", skin: "#e8c4a0", hair: "#5a3a2a" }] },
        intro: "<p>I Panchinari accettano la sfida a bottoni sul tavolo del Bar Panchina: «Se vinci, la Coppa è tua. Se vinciamo noi, ci teniamo la Coppa e il mantello». Non sono mai entrati in campo, ma a bottoni sono allenatissimi: ci giocano tutto il giorno, in panchina.</p>", winTitle: "SBAM! VITTORIA!",
        done: (r) => {
          if (!r.win) return K.scene([["mg_tonno", "Ah-ah! Abbiamo vinto una partita! La prima della nostra vita! (piange) …È bellissimo. Rigiochiamo? Per favore? Vogliamo sentirlo ancora."]], () => K.enterZone("mg_piazza"), "mg_piazza");
          setStep(N, 4); questDone("mg_coppa"); bond("fama", 3); F.set("mg_coppa", true); K.learnLore("l_fulmine");
          K.scene([["voce", "KABOOM! L'ultimo tiro attraversa la difesa come un fulmine granata e il pallone finisce in porta, poi nel bicchiere di Tonno, poi in tasca a Ciuffo."], ["mg_tonno", "(restituisce la Coppa, con due mani, come si fa con una cosa preziosa) …Tienila. Cioè, riportala. Però una cosa: com'è, entrare in campo?"], ["voce", "Gli racconti com'è. Ci metti un po'. Alla fine i Panchinari hanno gli occhi lucidi e la promessa di una partita vera, domenica, al campetto. Da titolari."]], () => K.enterZone("mg_piazza"), "mg_piazza");
        },
      });
    }
    function pompieri() { // partita secondaria: scegli tu la modalità
      ask("mg_brace", "Una sfida nel cortile della caserma? Volentieri! Come giochiamo, Mantello?", [
        { label: "A Super-Bottoni", sub: "Sul tavolo della mensa, con il tuo potere", big: true, fn: () => K.ownMatch(window.__bottoni.start, { title: "Super-Bottoni · contro i Pompieri", us: "Il Mantello e soci", usColor: "#8a1a2a", power: "fulmine", shots: 6, mates: [{ name: "Bullone", skin: "#b8c4d0", hair: "#8a9aa8" }, { name: "Gilda", skin: "#e8c4a0", hair: "#2a1a3a" }, { name: "Tilde", skin: "#f0d0b0", hair: "#e8e8f0" }], opp: { name: "I Pompieri", color: "#c8302a", players: [{ name: "Brace", skin: "#c68642", hair: "#c8642a" }, { name: "Idrante", skin: "#e0b890", hair: "#2a2a2a" }, { name: "Scala", skin: "#f0c8a0", hair: "#8a5a2a" }, { name: "Sirena", skin: "#d9a679", hair: "#1a1a1a" }] }, done: pompDone }) },
        { label: "Un'altra partita", sub: "Scegli tu la modalità", big: true, fn: () => K.playMatch({ id: "mg_pompieri", alt: "az,cage,hd", force: false, oppTeam: "I Pompieri di Metropolenta", oppColor: "#c8302a", mate: "Capitana Brace", us: "Il Mantello e soci", homeKit: ["#8a1a2a", "#ffd23f"], chap: "Il Mantello Granata · Sfida in caserma", bg: "mg_piazza", oppNames: ["Idrante", "Scala", "Sirena", "Manichetta", "Moka"], intro: "Nel cortile della caserma, tra le autopompe: il Mantello Granata contro i Pompieri di Metropolenta.", done: pompDone }) },
        { label: "Un'altra volta", fn: done },
      ], "mg_piazza");
    }
    function pompDone(r) { const msg = K.reward("m:mg_pompieri" + (r.win ? "w" : "p"), { coins: r.win ? 40 : 15 }); F.set("mg_pompieri", true); if (r.win) bond("fama", 1); say([["mg_brace", r.win ? "Battuti dal Mantello Granata! Moka per tutti! (La moka da quaranta tazze fischia come una sirena.)" : "Vinto noi! Ma il caffè lo offro lo stesso: un eroe stanco non salva nessuno."], ["voce", msg.join(" · ") || "Bella partita."]]); }
    const talk = {
      mg_gilda() {
        const s = S();
        if (s === 0) return say([["mg_gilda", "Gilda Flash, Corriere di Metropolenta. Hai visto? I Panchinari hanno rubato la Coppa e sono scappati oltre il canale. Il ponte è alzato da vent'anni, nessuno può seguirli. A meno di non volare."], ["mg_gilda", "(abbassa la macchina fotografica) …Nonna Tilde, la sarta, dice sempre che lei «ha la stoffa giusta per ogni problema». Io ci andrei. La porta rossa, là in alto."]], () => { setStep(N, 1); quest("mg_coppa", "La Coppa della Città", "I Panchinari l'hanno portata oltre il Canale Grande."); done(); });
        if (s === 4) return ask("mg_gilda", "Eccolo! Il primo vero supereroe di Metropolenta! Fermo così, faccio la foto per la prima pagina. Solo… ti togli la maschera? I lettori vogliono sapere chi sei. Io voglio sapere chi sei.", [
          { label: "«Va bene. Sono {n}. Sorridi tu, però»", sub: "Niente identità segreta", big: true, fn: () => photo(true) },
          { label: "(Voli via un attimo prima del flash)", sub: "L'identità resta segreta", big: true, fn: () => photo(false) },
        ], "mg_piazza");
        return say([["mg_gilda", s >= 5 ? (F.is("mg_volto") ? "Prima pagina, foto a colori: «{n}, IL MANTELLO GRANATA». Abbiamo venduto tutte le copie. Anche quelle per incartare il pesce." : "Prima pagina: una foto mossa, un lampo granata e un titolo: «CHI È?». Abbiamo venduto tutte le copie. La gente fa le ipotesi al bar. Una dice che sei il tram.") : "Il ponte è alzato da vent'anni. Lo so perché c'ero, all'ultima volta che l'hanno abbassato. Il cielo era pieno di coriandoli."]]);
      },
      mg_tilde() {
        const s = S();
        if (s <= 1) return say([["mg_tilde", "(con gli spilli in bocca) Mmh. Mmh-mmh. (Se li toglie.) Dicevo: ti aspettavo. Un giorno o l'altro qualcuno doveva entrare da quella porta con la faccia di chi deve attraversare un canale."], ["voce", "Nonna Tilde apre l'armadio. Tre lucchetti, un cigolio da film, e dentro, su una gruccia di legno: un mantello granata, con un bottone d'oro."], ["mg_tilde", "Cucito con la maglia di una squadra di Metropolenta che non c'è più. La stoffa si ricorda di ogni gol: per questo vola. Mettilo. Non troppo in alto, che soffre di vertigini."], ["voce", "<b>Hai il MANTELLO GRANATA.</b> Forma <b>Volo</b>: passi sopra i canali. Si cambia forma dal menu (🦸 Cambia forma) o nelle cabine telefoniche."], ["mg_tilde", "Ah, un'altra cosa. Bullone, il mio robot-tostapane, è scappato sui tetti dietro a un piccione. Riportamelo, che ho sei maglie da stirare. La scala per i tetti è oltre il canale, in alto a destra."]], () => { F.set("mg_mantello", true); F.set("forma_volo", true); setStep(N, 2); K.learnLore("l_mantello"); K.learnLore("l_volo"); quest("mg_bullone", "Bullone sui tetti", "Il robot di Nonna Tilde è scappato sui tetti, oltre il canale."); K.refreshZone(); done(); });
        return say([["mg_tilde", F.is("party_mg_bullone") ? "Bullone! Lo sapevo che tornavi. (Bullone fa «bip» e le stira il grembiule. Addosso.)" : "Il mantello ti sta bene. Non lo dico a tutti. Lo dico a tutti, ma a te lo dico più convinta."]]);
      },
      mg_bullone() {
        if (S() !== 2) return say([["mg_bullone", "Bip. Bop. (Ti stira la maglia, con affetto.)"]]);
        return say([["mg_bullone", "BIP! BIP-BIP! (È incastrato tra un comignolo e un piccione molto deciso. Il piccione ti guarda, poi guarda il mantello, poi se ne va, offeso.)"], ["mg_bullone", "Bop. (Ti abbraccia. Scotta un po': si era acceso da solo per lo spavento.)"], ["voce", "<b>Bullone si unisce a te.</b> Ti seguirà ovunque, a passettini metallici."]], () => { K.joinParty("mg_bullone"); setStep(N, 3); questDone("mg_bullone"); bond("fama", 1); done(); });
      },
      mg_tonno() {
        const s = S();
        if (s < 3) return say([["mg_tonno", s < 2 ? "(dall'altra parte del canale, sventola la Coppa) Ah-ah! Nessuno attraversa il Canale Grande! Il ponte è alzato da vent'anni! Ve l'ha detto nessuno?" : "Un tizio col mantello! Ah-ah! …Aspetta. Sta volando? Ragazzi. RAGAZZI. Sta volando."]]);
        if (s === 3) return ask("mg_tonno", "Un supereroe! Per noi! Siamo così emozionati che quasi ti ridiamo la Coppa. Quasi. Facciamo così: una partita a bottoni. Sul tavolo del bar. Se vinci, la Coppa torna in piazza.", [{ label: "Sfida a Super-Bottoni", sub: "Il tuo primo potere: Fulmine Granata", cls: "hot", fn: match }, { label: "Non ancora", fn: done }], "mg_piazza");
        return say([["mg_tonno", "Domenica giochiamo da titolari! Ci siamo comprati i parastinchi. Ce li mettiamo anche per dormire."]]);
      },
      mg_ciuffo() { return say([["mg_ciuffo", S() <= 3 ? "(si pettina il ciuffo) Non guardarmi. Sono in fuga. Si vede?" : "Domenica titolare! Mi sono fatto il ciuffo apposta. Tre volte."]]); },
      mg_brace() {
        if (!F.is("mg_mantello")) return say([["mg_brace", "Capitana Brace, pompieri. Se il ponte fosse abbassato li avrei già presi, quei tre. Ma l'autopompa non nuota."]]);
        return pompieri();
      },
    };
    function photo(face) {
      if (face) { F.set("mg_volto", true); bond("segreto", -2); bond("fama", 2); } else { F.set("mg_volto", false); bond("segreto", 2); bond("fama", 1); }
      const msg = K.reward("c1:mg", { coins: 60, cos: ["mg_c1", "mg_foto"] });
      K.scene(face ? [["voce", "FLASH! Ti togli la maschera e sorridi. Gilda fa dodici foto, poi una tredicesima perché nella dodicesima Bullone faceva le corna."], ["mg_gilda", "{n}! Sei {n}! Quello che passa sempre davanti all'edicola a guardare i fumetti! …Ha senso. Ha molto senso."]]
        : [["voce", "FLASH! Ma tu sei già in volo: nella foto c'è solo un lampo granata, un bottone d'oro e Bullone che saluta."], ["mg_gilda", "(guarda la foto, poi il cielo) …Ti scoprirò, Mantello. È il mio lavoro. Ma per oggi va bene così: anche il mistero vende."]], () => { finishChapter(N, face ? "volto" : "segreto"); setStep(N, 5); say([["voce", `<b>FINE DEL NUMERO 1.</b> ${msg.join(" · ")}<br>Continua nel prossimo numero: «Madame Colla».`]], () => K.openMain()); }, "mg_piazza");
    }
    const obj = {
      "mg_tetti:v": () => go("mg_piazza", 32, 1), "mg_piazza:^": () => go("mg_tetti", 3, 18),
    };
    return { n: N, title: "Il mantello nell'armadio", sub: "La sartoria, il primo volo, i Panchinari", goal, start: "mg_piazza", introBg: "mg_piazza", zones, talk, obj,
      intro: () => [["voce", "<b>IL MANTELLO GRANATA</b>, numero 1: «Il mantello nell'armadio». Un fumetto a puntate, con te dentro."]] };
  }
  boot();
})();
