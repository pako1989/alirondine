// js/milano-c2.js - OPERAZIONE FUORIGIOCO NOIR · Capitolo 2 «La Lucciola e il Doppiogioco»
// Via Torino di notte, il night club La Lucciola, il camerino di Mara con la valigia delle scommesse, il vicolo delle bische.
// Due scelte: il nome di Nando nella lista dei comprati, e la busta di Mara.
(function () {
  "use strict";
  function boot() {
    const D = window.__milano;
    if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const N = 2, S = () => K.stepOf(N), F = K.F;
    const say = (ls, then) => K.say(ls, then || K.done);
    const rot = (a) => a[(K.frNow() >> 6) % a.length];

    K.cos("mn_c2", { kind: "shirt", label: "Giacca gessata da sera e cravatta di seta", val: "#581c87", from: "Capitolo 2 di Operazione Fuorigioco Noir" });
    K.lore("l_lucciola", { t: "La Lucciola", d: "Night club di via Torino, aperto nel '47 in un ex magazzino di stoffe. Velluto, jazz, vermouth. Nel retro, il banco delle scommesse più grande di Milano." });

    const goal = (s) => ({
      0: "Via Torino, di notte. De Santis ti aspetta davanti all'insegna della Lucciola.",
      1: "Dentro la Lucciola: cerca Mara vicino al palco. Intanto, guardati intorno: qui tutti sanno qualcosa.",
      2: "Il camerino di Mara, dietro le quinte (porta a destra del palco): apri la valigia.",
      3: "Il vicolo delle bische, dietro il club: Don Carmine ti aspetta. Esci e prendi il passaggio a sinistra dell'insegna.",
    }[s] || "Il secondo capitolo è concluso. Continua nel Capitolo 3.");

    const fin = () => {
      const msg = K.reward("mn_c2", { coins: 100, cos: "mn_c2" });
      K.finishChapter(N, F.is("mn_nando_strappato") ? "strappato" : "intera");
      K.scene([
        ["mn_carmine", "[si pulisce il fango dalle scarpe con un fazzoletto di seta] Va bene. Domenica non ci saranno trucchi miei. Te lo prometto sul nome di mia madre, che era una santa e faceva la pettinatrice."],
        ["mn_carmine", "Ma ascoltami, ragazzo, perché te lo dico una volta sola: io sono il cane. Il guinzaglio ce l'ha un altro. E quello non perde mai, perché non gioca. Compra."],
        ["mn_desantis", "[dal fondo del vicolo, nell'ombra] Chi?"],
        ["mn_carmine", "[sorride, mette il cappello] Commissario. Lei è un uomo intelligente. Guardi chi paga il campo nuovo dei Ferrovieri. E poi si chieda perché nessuno ha mai pagato il suo."],
        ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Il Derby dell'Ombra».`],
      ], () => K.openMain(), "mn_stadio");
    };

    const zones = {
      mn_viatorino: {
        region: "bastioni", name: "Via Torino di notte", short: "Via Torino", sub: "Insegne al neon, il tram, la Lucciola", bg: "mn_club", time: "notte", travel: [3, 11],
        w: 32, h: 20, start: [3, 11], items: [[30, 12], [16, 17], [6, 17], [24, 17]],
        areas: [[11, 1, 21, 8, "La facciata della Lucciola"], [0, 0, 31, 19, "Via Torino"]],
        flavor: {
          K: "L'edicola chiude alle due. Il giornalaio dorme seduto, con un occhio aperto sulla cassetta delle monete e l'altro sulla Lucciola.",
          A: ["Un manifesto: «STASERA ALLA LUCCIOLA · MARA · LA VOCE DELLA NEBBIA». Qualcuno ha disegnato i baffi alla nebbia.", "«ACCIAIERIE BALESTRINI · ASSUMONO». Sotto, a penna: «ANCHE PORTIERI?»."],
          l: "Un lampione elettrico, nuovo. Qui in via Torino il gas non si usa più. Celestino, quando passa, gli fa le corna.",
          t: "Un platano spoglio. Ci hanno inchiodato un cartello: «VIETATO SCOMMETTERE». Il chiodo è d'oro.",
        },
        intro: [["voce", "Via Torino, mezzanotte meno un quarto. Le insegne al neon colorano la pioggia: rosso il cinema, verde la farmacia, viola la Lucciola. Davanti alla porta, un omone in doppiopetto conta le persone che entrano. Le conta male, apposta."]],
        npcs: (s) => [
          { id: "mn_desantis", at: s === 0 ? [8, 11] : [3, 14] },
          { id: "mn_ciccio", at: [17, 10] },
          { id: "mn_scotti", at: [26, 14], route: [[26, 14], [29, 14], [29, 16], [26, 16]] },
          { id: "mn_celestino", at: [5, 16] },
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 19, "+"); lay(0, 0, 31, 0, "a"); lay(0, 19, 31, 19, "a"); lay(0, 0, 0, 19, "a"); lay(31, 0, 31, 19, "a");
          house(1, 1, 8, 8, { door: [4, 8], roof: "#3f3f46", wall: "#8a7a6a", rr: 3, lit: true, enter: "Il Cinema Arlecchino: danno «Pane, amore e fantasia». Ultimo spettacolo cominciato. In sala ridono tutti tranne uno, che dorme." });
          house(11, 1, 11, 8, { door: [16, 8], roof: "#3b0764", wall: "#2d1b2e", rr: 3, lit: true, enter: { to: "mn_lucciola", at: [10, 13] } });
          house(23, 1, 8, 8, { door: [26, 8], roof: "#44403c", wall: "#9ca3af", rr: 3, lit: true, enter: { room: "bottega", name: "Farmacia Notturna", flavor: { L: "Barattoli di vetro: «CANFORA», «CHININO», «SCIROPPO PER LA TOSSE DEI PORTIERI». L'ultimo è un'etichetta scritta a mano." } } });
          // il passaggio verso il vicolo, tra il cinema e la Lucciola
          house(10, 1, 1, 7, { roof: "#1f2937", wall: "#1f2937", rr: 1 }); put(10, 8, "q");
          lay(1, 10, 30, 11, "Y");
          [[3, 9], [22, 9], [30, 9], [9, 17], [21, 17]].forEach(([x, y]) => put(x, y, "l"));
          put(14, 9, "A"); put(28, 13, "K"); [[1, 13], [1, 17], [30, 17], [13, 17], [19, 14]].forEach(([x, y]) => put(x, y, "t")); put(11, 15, "b"); put(12, 15, "b");
        },
        doors: { "10,8": { to: "mn_vicolo", at: [6, 9], locked: (K) => (K.stepOf(2) < 3 ? "Un passaggio buio tra il cinema e la Lucciola. Un gatto ti guarda come a dire: «Non ancora»." : false) } },
        decor(g, cx, cy, d) {
          const on = Math.sin(d.fr / 9) > -0.85 && d.fr % 97 > 4;
          K.plaque(g, "★ LA LUCCIOLA ★", d.X(16) + 8, d.Y(1) - 2, on ? "#f0abfc" : "#6b2a6b"); if (on) K.light(d.X(16) + 8, d.Y(1), 70, "240,170,250", 0.4);
          K.plaque(g, "CINEMA ARLECCHINO", d.X(5) + 8, d.Y(1) - 2, "#fca5a5"); K.plaque(g, "FARMACIA", d.X(26) + 8, d.Y(1) - 2, "#86efac"); K.light(d.X(26) + 8, d.Y(2), 40, "120,255,160", 0.25);
        },
      },

      mn_lucciola: {
        interior: true, region: "lucciola", name: "Night Club La Lucciola", short: "La Lucciola", sub: "Velluto, jazz, vermouth e il banco delle scommesse", bg: "mn_club", time: "notte",
        w: 22, h: 16, start: [10, 13], outside: ["mn_viatorino", 16, 9],
        flavor: {
          R: "Il sipario di velluto bordeaux. Odora di naftalina, di sigarette e di applausi vecchi.",
          E: "Il banco di Ugo. Specchi, bottiglie francesi, un registratore di cassa che suona come un campanello da bicicletta.",
          T: ["Un tavolino riservato: candela, due bicchieri, un tovagliolo con sotto una mazzetta. Non è per te.", "Un tavolino con una fiche d'avorio dimenticata. Sopra, inciso: «B.»."],
          D: "Il guardaroba di Wanda. Trench, pellicce, un cappotto di cammello con all'occhiello un distintivo d'acciaio: una B dentro un ingranaggio.",
          L: "Una mensola con le foto dei clienti illustri: un ministro, un tenore, un centravanti. E tre facce col viso cancellato dalla foto con le forbici.",
        },
        intro: [["voce", "La Lucciola dentro è più grande che fuori, come certi segreti. Fumo azzurro, il pianoforte che suona da solo un blues lentissimo, e sul palco una donna bionda che non canta ancora: aspetta che tutti smettano di parlare. Ci mettono un attimo."]],
        npcs: (s) => [
          { id: "mn_mara", at: s <= 1 ? [10, 3] : [16, 6] },
          { id: "mn_tullio", at: [5, 4] },
          { id: "mn_ugo", at: [18, 10] },
          { id: "mn_contessa", at: [4, 9] },
          { id: "mn_wanda", at: [2, 13] },
          { id: "mn_balestrini", at: [14, 8] },
          { id: "mn_ines", at: [8, 10] },
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 21, 15, '"'); lay(0, 0, 21, 1, "a"); lay(0, 0, 0, 15, "a"); lay(21, 0, 21, 15, "a"); lay(0, 15, 21, 15, "a"); put(10, 15, "v");
          lay(6, 1, 15, 1, "R"); lay(7, 2, 14, 3, "="); put(3, 2, "T"); put(4, 3, "T"); // il palco col piano
          lay(17, 8, 20, 8, "E"); lay(17, 9, 17, 11, "E"); put(20, 2, "L"); put(1, 2, "L");
          lay(1, 12, 1, 14, "D");
          [[4, 7], [7, 7], [12, 7], [15, 9], [5, 11], [12, 11], [14, 12]].forEach(([x, y]) => put(x, y, "T"));
          [[6, 7], [11, 7], [4, 11], [13, 11]].forEach(([x, y]) => put(x, y, "b"));
          put(16, 1, "a"); put(16, 2, "q");
        },
        doors: { "16,2": { to: "mn_camerino", at: [6, 8], locked: (K) => (K.stepOf(2) < 2 ? "La porta del camerino. Un cartello: «MARA · NON DISTURBARE». Sotto, più piccolo: «DAVVERO»." : false) } },
        decor(g, cx, cy, d) { K.light(d.X(10) + 8, d.Y(3), 60, "255,230,180", 0.35); K.plaque(g, "CAMERINO", d.X(16) + 8, d.Y(2) - 6, "#f0abfc"); [[4, 7], [12, 7], [5, 11], [12, 11]].forEach(([x, y], i) => K.light(d.X(x) + 8, d.Y(y) + 4, 18, "255,200,120", 0.3 + 0.05 * Math.sin(d.fr / 6 + i))); },
      },

      mn_camerino: {
        interior: true, region: "lucciola", name: "Il Camerino di Mara", short: "Camerino di Mara", sub: "Specchiera con le lampadine, cipria, una valigia", bg: "mn_club", time: "notte",
        w: 13, h: 10, start: [6, 8], outside: ["mn_lucciola", 16, 3],
        flavor: {
          W: "La specchiera con le lampadine tonde. Infilate nella cornice: biglietti d'ammiratori, una cartolina di Parigi, una foto di Mara bambina con le trecce, scalza su un'aia.",
          D: "Un baule colmo di stole e scarpe col tacco. In fondo, una valigia di cartone vecchia, vuota. Non l'ha buttata, allora.",
          x: "La valigia in fibra marrone con le chiusure d'ottone. Socchiusa. Come se qualcuno volesse che la trovassi.",
          B: "Un divanetto di velluto. Un cuscino ricamato: «A MARA, DAL SUO PUBBLICO». Il ricamo è di una mano sola.",
        },
        intro: [["voce", "Il camerino di Mara: talco, profumo francese e un silenzio che arriva dopo l'applauso. Sotto la specchiera, una valigia marrone con le fibbie d'ottone."]],
        npcs: (s) => (s >= 2 ? [{ id: "mn_mara", at: [3, 5] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 12, 9, "="); lay(0, 0, 12, 1, "a"); lay(0, 0, 0, 9, "a"); lay(12, 0, 12, 9, "a"); lay(0, 9, 12, 9, "a"); put(6, 9, "v");
          put(4, 1, "W"); put(5, 1, "W"); put(6, 1, "W"); put(9, 2, "x"); put(10, 2, "D"); put(11, 2, "D"); put(1, 4, "B"); put(1, 5, "B"); put(9, 6, "T");
        },
        decor(g, cx, cy, d) { for (let i = 0; i < 3; i++) K.light(d.X(4 + i) + 8, d.Y(1) + 4, 14, "255,230,170", 0.4); },
      },

      mn_vicolo: {
        interior: true, region: "bastioni", name: "Il Vicolo delle Bische", short: "Vicolo delle Bische", sub: "Pozzanghere nere, barili, un portone di ferro", bg: "mn_titolo", time: "notte",
        w: 16, h: 12, start: [6, 9], outside: ["mn_viatorino", 10, 9],
        flavor: {
          z: "Cassette di frutta vuote. Sotto una, un mazzo di fiches legate con l'elastico.",
          u: "Barili di catrame. Uno ha la scritta «BALESTRINI» stampata a fuoco sul fondo.",
          W: "Una finestra con l'inferriata. Dietro, la bisca: tavoli verdi, fumo, e una voce che ripete «rien ne va plus» con l'accento di Lodi.",
        },
        intro: [["voce", "Il vicolo delle bische: l'acqua cola dalle grondaie, i barili gocciolano catrame, una lampadina nuda dondola sopra un portone di ferro. Sotto la lampadina, Don Carmine. Bastone d'ebano, scarpe lucide, l'aria di chi ti aspettava da sempre."]],
        npcs: () => [{ id: "mn_carmine", at: [8, 4] }, { id: "mn_ciccio", at: [11, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(6, 11, "v");
          put(3, 1, "W"); put(12, 1, "W"); [[2, 4], [2, 5], [13, 7], [13, 8]].forEach(([x, y]) => put(x, y, "u")); [[3, 8], [4, 8], [12, 3]].forEach(([x, y]) => put(x, y, "z")); put(8, 2, "l");
        },
        decor(g, cx, cy, d) { const sw = Math.sin(d.fr / 30) * 3; K.light(d.X(8) + 8 + sw, d.Y(2) + 8, 40, "255,230,160", 0.5); },
      },
    };

    const valigia = () => K.interroga("valigia", { biglietti: 40, fiuto: 20, sospetto: 10 }, () => say([
      ["voce", "Nella lista, a metà pagina, scritto con una calligrafia da ragioniere: «COLOMBO F. (Ferrovieri) · portiere · 200.000 · al 90°». Nando."],
      ["voce", "E sotto le mazzette, una busta color crema: dentro, un biglietto di prima classe Milano-Parigi a nome di «Maria Brambati», e quattrocentomila lire in biglietti nuovi."],
    ], () => K.weight.ask("voce", "Il nome di Nando, nella lista dei comprati. Domani questa lista finisce sul tavolo della Questura.", [
      { label: "✂️ Strappo il nome di Nando", sub: "Gli parlerò io. Ha diritto a una possibilità", w: { pieta: 1 }, fn: () => { F.set("mn_nando_strappato", true); say([["voce", "Strappi la riga con cura. Il pezzetto di carta ti finisce in tasca, accanto al biglietto del tram. Pesa più del biglietto."]], busta); } },
      { label: "📋 Lascio la lista intera", sub: "Se ha preso i soldi, deve risponderne. Come tutti", w: { legge: 1 }, fn: () => { F.set("mn_nando_lista", true); say([["voce", "Lasci la lista com'è. Il nome di Nando resta lì, a metà pagina, tra un terzino del Legnano e un mediano della Pro Sesto."]], busta); } },
    ])));
    const busta = () => K.weight.ask("mn_mara", "Mara è sulla porta. Guarda la busta color crema nelle tue mani. Non dice niente. Non serve.", [
      { label: "🕯️ Le lascio la busta", sub: "Il suo biglietto per Parigi non è un reato", w: { pieta: 1 }, fn: () => { F.set("mn_mara_busta", true); K.rel && K.rel.add("mn_mara", 10); say([
        ["mn_mara", "[prende la busta, la stringe al petto, poi ride piano] Maria Brambati. Non mi chiamavano così da otto anni. Grazie, ragazzo."],
        ["mn_mara", "Ti dico una cosa, allora. Don Carmine stasera è nel vicolo, dietro. Ma i soldi non sono suoi. Il giovedì viene un signore coi capelli bianchi e la B all'occhiello. Porta la valigia piena e la riporta vuota."]], dopo); } },
      { label: "⚖️ La metto nel dossier", sub: "Sono soldi delle scommesse, come gli altri", w: { legge: 1 }, fn: () => { F.set("mn_mara_dossier", true); say([
        ["mn_mara", "[non abbassa gli occhi] Giusto. Sono soldi sporchi. Li ho sporcati cantando, otto anni, sei sere a settimana. Prendili."],
        ["mn_mara", "Don Carmine ti aspetta nel vicolo. Vai pure. Io ho uno spettacolo alle due."]], dopo); } },
    ]);
    const dopo = () => { K.questDone("mn2_camerino"); K.setStep(N, 3); K.quest("mn2_vicolo", "Il vicolo delle bische", "Esci dalla Lucciola e prendi il passaggio a sinistra dell'insegna: Don Carmine ti aspetta nel vicolo."); K.done(); };

    const talk = {
      mn_desantis(K) {
        const s = S();
        if (s === 0) return say([
          ["mn_desantis", "[ti sistema il nodo della cravatta di Scotti] Così. Sembri un nipote di buona famiglia venuto a perdere l'eredità."],
          ["mn_desantis", "Il biglietto di Peppino porta qui. La Lucciola: si canta davanti, si scommette dietro. Io dentro non posso entrare: mi conoscono anche le sedie."],
          ["mn_desantis", "Cerca Mara. Ascolta più di quanto parli. E se ti offrono da bere, bevi: chi non beve alla Lucciola è un poliziotto o un astemio, e gli astemi non esistono."],
        ], () => { K.setStep(N, 1); K.quest("mn2_lucciola", "Dentro la Lucciola", "Entra nella Lucciola e cerca Mara vicino al palco."); K.done(); });
        if (s === 3) return say([["mn_desantis", "Il vicolo è lì, tra il cinema e la Lucciola. Io sarò dietro di te. Non mi vedrai. È il mio unico talento."]]);
        return say([["mn_desantis", rot(["Mara. Palco. Ascolta. Non innamorarti: lo fanno tutti, ed è il modo più costoso di entrare in un'indagine.", "Quell'omone sulla porta si chiama Ciccio Ferro. Piange ai film di De Sica. Non farlo piangere tu."])]]);
      },
      mn_mara(K) {
        const s = S();
        if (s === 1) return say([
          ["mn_mara", "[si siede sul bordo del palco, le gambe nel vuoto, il microfono spento in mano] Tu sei il ragazzo dei Ferrovieri. Quello che ha battuto la Banda nel fango. Peppino mi ha mandato un biglietto: «attenta, è uno che non si vende». Pensa che complimento."],
          ["hero", "Cerco chi compra le partite, Mara."],
          ["mn_mara", "Tutti, tesoro. Il calcio è come il jazz: se non conosci il ritmo dei soldi, steccano tutti. I soldi qui arrivano il giovedì, in una valigia. La valigia sta nel mio camerino. La chiave non c'è: la serratura è rotta da anni."],
          ["mn_mara", "Vai a guardare. Poi decidi se vuoi fare l'eroe o il cliente. Ma decidi in fretta: Don Carmine non ama i ragazzi che leggono."],
        ], () => { K.questDone("mn2_lucciola"); K.setStep(N, 2); K.quest("mn2_camerino", "La valigia di Mara", "Entra nel camerino dietro il palco (porta a destra) e apri la valigia."); K.done(); });
        if (s === 2 && K.inZone("mn_camerino")) return valigia();
        if (s === 2) return say([["mn_mara", "Il camerino è la porta a destra del palco. Io vengo tra un minuto. Il tempo di farmi applaudire."]]);
        return say([["mn_mara", rot(F.is("mn_mara_busta") ? ["Parigi. Ci pensi? Una città dove la nebbia la chiamano «brouillard» e sembra un complimento.", "Grazie. Non lo ripeterò, quindi ascoltalo bene stavolta: grazie."] : ["Io canto. Tu indaghi. Ognuno vende quello che ha.", "La prossima canzone è per te. S'intitola «Nustalgia». Non te la dedico: te la faccio pagare."])]]);
      },
      mn_carmine(K) {
        const s = S();
        if (s === 3) return say([
          ["mn_carmine", "[fa oscillare un orologio d'oro da taschino] Tu sei il centravanti che legge le valigie degli altri. Siediti. No, non c'è una sedia. Era un modo di dire."],
          ["hero", "Abbiamo i biglietti, la lista, la valigia. Lei è finito, Don Carmine."],
          ["mn_carmine", "Finito? Ragazzo, io sono un commerciante. Compro risultati come altri comprano stoffa. Un pareggio concordato, e cinquantamila persone tornano a casa contente, nessuno si fa male, gli operai lunedì timbrano. Io porto pace."],
          ["mn_carmine", "[tira fuori un fischietto d'ottone brunito, lo lancia] Questo è per te. Così vedi come suona la pace. Lo usa un arbitro, domenica. Non ti dico quale: sarebbe sleale."],
        ], () => K.interroga("fischietto", { biglietti: 50, fiuto: 20, sospetto: 10 }, () => K.ask("mn_carmine", "«Ma i miei ragazzi non sono d'accordo con te. Ciccio, chiama gli altri. Ragazzo: se vinci, domenica niente trucchi miei. Se perdi, prendi il treno delle sei. In senso opposto.»", [
          { label: "⚽ Gioca contro i Tirapiedi della Lucciola", big: true, fn: () => K.ownMatch(window.__pedinamento.start, { opp: { name: "Tirapiedi della Lucciola", kit: "#581c87", names: ["Ciccio Ferro", "Il Lodigiano"] }, mate: { name: "Nando", skin: "#e8c39e", hair: "#2a1d14", shirt: "#7f1d1d" }, rain: true, fog: 0.7, lights: 3, half: 38,
            halftime: "Intervallo nel vicolo. Ciccio Ferro si siede su un barile e si soffia il naso: «Scusate, mi è venuto in mente un film».",
            done: (r) => r.win ? fin() : say([["mn_carmine", "L'organizzazione batte sempre l'estro, ragazzo. Ma te lo concedo: l'estro ci mette di più a capirlo. Riprova."]]) }) },
          { label: "Prima mi preparo", fn: () => say([["mn_carmine", "Prego. Il vicolo non scappa. Io nemmeno: ho le scarpe nuove."]]) },
        ])));
        return say([["mn_carmine", "Il vicolo è mio solo di notte. Di giorno è dei gatti. Ci siamo divisi Milano con lealtà."]]);
      },
      mn_ciccio(K) {
        if (K.inZone("mn_vicolo")) return say([["mn_ciccio", rot(["[si scrocchia le dita] Niente di personale, eh. Io meno per contratto. Il cuore, fuori orario.", "Ha visto «Umberto D.»? Il cane. Il cane! [si asciuga una lacrima con la manica]"])]]);
        if (!F.is("mn_ci1")) { F.set("mn_ci1", true); return say([
          ["mn_ciccio", "Alt. Nome, cognome e motivo della visita. Il motivo dev'essere divertimento. Gli altri motivi sono vietati."],
          ["hero", "Divertimento."],
          ["mn_ciccio", "[ti squadra] Lei non ha la faccia del divertimento. Ha la faccia di uno che guarda i film di De Sica. Li guarda?"],
          ["hero", "«Ladri di biciclette»."],
          ["mn_ciccio", "[gli trema il labbro] Il bambino… quando il padre… [si ricompone] Entri, entri. Ma non lo dica a nessuno, che ho pianto. Ho una reputazione."]], () => { K.bond("biglietti", 10); K.done(); }); }
        return say([["mn_ciccio", rot(["Undici volte, l'ho visto. L'ultima ho portato due fazzoletti. Non bastavano.", "Dentro c'è il Commendatore. Quando c'è lui, Don Carmine diventa piccolo. Io resto grande: è il mio lavoro."])]]);
      },
      mn_tullio(K) {
        if (!F.is("mn_tu1")) { F.set("mn_tu1", true); return say([
          ["mn_tullio", "[le dita continuano a suonare, lente] Passo nuovo. Scarpe coi tacchetti tolti da poco: ancora il segno nel tacco. Lei è un calciatore."],
          ["hero", "Come lo sa?"],
          ["mn_tullio", "Sono cieco dal '43, signore. Da allora vedo benissimo. Il giovedì, per esempio, sento entrare un passo pesante e lento: scarpe inglesi, un bastone col puntale d'argento. E sento il fruscio di una valigia che entra piena ed esce vuota."],
          ["mn_tullio", "E sento come cambia la voce di Mara, il giovedì. Si fa più alta di mezzo tono. Come chi ha paura e non lo vuole far sapere al pianista."]], () => { K.bond("fiuto", 10); K.rel && K.rel.add("mn_mara", 3); K.done(); }); }
        return say([["mn_tullio", rot(["Ogni banconota ha un suono diverso. Quelle nuove fanno «tac». Quelle vecchie sospirano.", "Le suono «Nustalgia»? È l'unica canzone che qui fa stare zitti tutti. Anche quelli che contano i soldi.", "Il Commendatore, stasera, è a tre tavoli da lei. Respira come chi ha appena mangiato bene."])]]);
      },
      mn_ugo(K) {
        if (!F.is("mn_ug1")) { F.set("mn_ug1", true); return K.ask("mn_ugo", "«Cosa le servo? Il ‹Meazza›: forte, va giù di colpo. Il ‹Fuorigioco›: sembra acqua, non lo è. Il ‹Pareggio›: metà e metà, non fa male a nessuno, non piace a nessuno.»", [
          { label: "Un «Fuorigioco»", fn: () => say([["mn_ugo", "[versa qualcosa di trasparente] Salute. Non chieda cosa c'è dentro: c'è quello che il signore al tavolo otto ha pagato perché ci fosse."], ["voce", "Sa di acqua. Poi, tre secondi dopo, sa di fuoco. Poi ti senti molto più intelligente. Poi meno."]], () => { K.bond("fiuto", 5); K.done(); }) },
          { label: "Un «Pareggio»", fn: () => say([["mn_ugo", "Il preferito della Contessa. E di chi ha già deciso come finisce la domenica."], ["mn_ugo", "[a bassa voce, asciugando il bancone] Il Commendatore ne beve tre, il giovedì. Poi va in fondo, nella saletta. Poi Don Carmine esce col colletto sudato."]], () => { K.bond("fiuto", 8); K.done(); }) },
        ]); }
        return say([["mn_ugo", rot(["Io non faccio domande. Le risposte, però, le vendo. A prezzi popolari.", "Qui dentro c'è più gente onesta di quanto pensa. Il problema è che nessuno di loro è venuto per esserlo."])]]);
      },
      mn_contessa(K) {
        if (!F.is("mn_co1")) { F.set("mn_co1", true); return say([
          ["mn_contessa", "Giovanotto, si sieda, mi fa ombra in piedi. Contessa Bice Lanzi. Il feudo non c'è più, la contessa sì, nessuno sa bene perché."],
          ["mn_contessa", "Io punto solo sul pareggio. È l'unico risultato educato: nessuno umilia nessuno. Perdo da trent'anni con grande stile."],
          ["mn_contessa", "Quest'autunno, però, vinco sempre. Sempre! È una cosa molto volgare, mi creda. Mi sono chiesta chi stia barando a mio favore. Mi offende."]], () => { K.bond("biglietti", 15); K.done(); }); }
        return say([["mn_contessa", rot(["Il derby finirà uno a uno. Me l'ha detto l'uccellino. L'uccellino ha i capelli bianchi e paga il conto di tutti.", "Ai miei tempi si truccavano le carte, non le partite. C'era più rispetto per lo sport."])]]);
      },
      mn_wanda(K) {
        if (!F.is("mn_wa1")) { F.set("mn_wa1", true); return say([
          ["mn_wanda", "Il soprabito, signore? Ah, non ce l'ha. Allora le do un consiglio gratis, che è quello che do a chi non ha soprabito."],
          ["mn_wanda", "Io riconosco la gente dai cappotti. Quello lì, di cammello, col distintivo a ingranaggio: viene ogni giovedì, paga la mancia in banconote nuove e il cappotto sa di ferro. Ferro caldo, di fonderia."],
          ["mn_wanda", "Quello del Commissario, invece, sa di caldarroste e di pioggia. Non entra mai, ma il cappotto lo lascerebbe volentieri: si vede che pesa."]], () => { K.bond("fiuto", 8); K.done(); }); }
        return say([["mn_wanda", rot(["Trench, pelliccia, cammello. Trench, trench, pelliccia. Milano è una città di trench.", "Una volta un tenore ha dimenticato qui la voce. Era nel cappotto. Gliel'ho restituita la sera dopo."])]]);
      },
      mn_balestrini(K) {
        if (!F.is("mn_ba1")) { F.set("mn_ba1", true); return say([
          ["mn_balestrini", "[si alza, ti stringe la mano: presa d'acciaio, pelle morbida] Il nuovo dei Ferrovieri! Ho visto la partita contro il Lambrate. Balestrini, Acciaierie Balestrini. Il tondino di ferro, ragazzo: metà di questa città sta in piedi sul mio acciaio."],
          ["mn_balestrini", "Sono presidente onorario dei Ferrovieri, lo sapeva? No? Si fa, si fa, senza dirlo in giro. L'anno prossimo vi regalo una tribuna coperta. I giocatori devono stare all'asciutto: un portiere bagnato è un portiere che sbaglia."],
          ["mn_balestrini", "[ti mette in mano una bottiglia di champagne] Per la squadra. Dopo il derby, eh. Non prima. Prima si suda, dopo si brinda. È l'ordine naturale delle cose."]], () => { K.bond("biglietti", 20); K.done(); }); }
        return say([["mn_balestrini", rot(["Ragazzo, se ha bisogno di qualcosa, qualsiasi cosa, chieda. Io a Milano ho molti amici. Gli amici sono come l'acciaio: costano, ma reggono.", "Mara canta bene, vero? L'ho scoperta io. In un'osteria di Lodi, nel '46. Le devo molto. Lei deve molto a me. Si chiama gratitudine."])]]);
      },
      mn_ines(K) {
        if (!F.is("mn_in2")) { F.set("mn_in2", true); return say([
          ["mn_ines", "[in abito da sera prestato, troppo largo sulle spalle] Non dire niente. L'ho rubato a mia sorella. Le donne sole qui dentro sono o cantanti o contesse. Io faccio la contessa con l'abito di mia sorella."],
          ["mn_ines", "Vedi quello coi capelli bianchi? Balestrini. Ha pagato le spese a tre squadre di Promozione quest'anno. Tutte e tre hanno perso le partite che non dovevano perdere. Tutte e tre hanno una tribuna nuova."],
          ["mn_ines", "Il caporedattore, quando gliel'ho detto, mi ha risposto che Balestrini compra due pagine di pubblicità al mese. Fine della conversazione."]], () => { K.rel && K.rel.add("mn_ines", 5); K.bond("fiuto", 8); K.done(); }); }
        return say([["mn_ines", rot(["Mi sto annotando chi beve con chi. È più utile di una lista di scommesse: dice chi ha paura di chi.", "Se mi chiede di ballare, quello col cappotto di cammello, dico di sì. Per lavoro. Poi mi lavo le mani per una settimana."])]]);
      },
      mn_scotti(K) { return say([["mn_scotti", rot(["Faccio la ronda. Ho contato le persone che entrano alla Lucciola: centoquattro. Quelle che escono: novantasette. Sette sono ancora dentro. O sono state mangiate.", "Il Commissario mi ha detto di stare qui a far finta di niente. Sto facendo finta di niente da un'ora. Mi riesce benissimo.", "Una domanda: lo champagne è sequestrabile come prova? Chiedo per un amico. L'amico sono io."])]]); },
      mn_celestino(K) { return say([["mn_celestino", rot(["Qui in via Torino hanno messo i lampioni elettrici. Non li devo accendere io. Si accendono da soli, senza poesia.", "«Neon: la luce / che non ha bisogno / di nessuno». Bolletta della luce, novembre. Non mi è venuta bene.", "Le valigie, il giovedì, arrivano da via Manzoni. Lo so perché passano davanti al mio ultimo lampione."])]]); },
    };

    return { n: N, title: "La Lucciola e il Doppiogioco", sub: "Via Torino, il night club, la valigia e le prime due scelte", goal, start: "mn_viatorino", introBg: "mn_club", zones, talk,
      intro: () => [["voce", "La sera dopo. Pioggia fine, il 19 che passa vuoto, e una cravatta prestata che stringe come una domanda."], ["voce", "La Lucciola apre a mezzanotte. Chi conta, entra dalla porta davanti. Chi conta i soldi, da quella dietro."]] };
  }

  boot();
})();
