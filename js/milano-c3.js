// js/milano-c3.js - OPERAZIONE FUORIGIOCO NOIR · Capitolo 3 «Il Derby dell'Ombra»
// Domenica 14 novembre 1954, Arena Civica. Gli spogliatoi sotto le tribune, la confessione dell'arbitro Brambilla (terza scelta),
// la tribuna d'onore con Mara e il Commendatore, la sala stampa, e la partita d'apertura dei Ferrovieri contro i Diavoli dell'Ombra.
(function () {
  "use strict";
  function boot() {
    const D = window.__milano;
    if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const N = 3, S = () => K.stepOf(N), F = K.F;
    const say = (ls, then) => K.say(ls, then || K.done);
    const rot = (a) => a[(K.frNow() >> 6) % a.length];

    K.cos("mn_c3", { kind: "shirt", label: "Maglia granata dei Ferrovieri, lana pesante col colletto a lacci", val: "#7f1d1d", from: "Capitolo 3 di Operazione Fuorigioco Noir" });
    K.lore("l_arena", { t: "L'Arena Civica", d: "Costruita sotto Napoleone per le corse dei carri e le battaglie navali finte. Nel '54 ci si gioca a pallone: cinquantamila posti, fango gratis." });

    const goal = (s) => ({
      0: "Arena Civica, domenica. De Santis ti aspetta al cancello delle tribune.",
      1: "Gli spogliatoi, sotto la gradinata a sinistra: l'arbitro Brambilla controlla i palloni.",
      2: "La Tribuna d'Onore, al centro: Mara è lassù, accanto a chi paga.",
      3: "È ora! Raggiungi Mister Pavesi a bordo campo per entrare contro i Diavoli dell'Ombra.",
    }[s] || "Il terzo capitolo è concluso. Continua nel Capitolo 4.");

    const fin = () => {
      const msg = K.reward("mn_c3", { coins: 120, cos: "mn_c3" });
      K.finishChapter(N, F.is("mn_bra_copre") ? "coperto" : "denunciato");
      const strap = F.is("mn_nando_strappato");
      K.scene([
        ["voce", "Novantesimo. Rigore per i Diavoli. Il loro centravanti prende la rincorsa lunga, guarda Nando, guarda la tribuna."],
        ["voce", "Nando non guarda la tribuna. Guarda il pallone. Si tuffa a destra, basso, con tutte e due le mani. Lo tiene. Lo stringe come un bambino."],
        ["mn_nando", strap ? "[nel fango, senza fiato] L'ho parato. Hai visto? L'ho parato. Domani vado da Ines e le racconto tutto, giuro. Tutto. E poi sono libero." : "[nel fango, guardando la tribuna d'onore] L'ho parato. Adesso… adesso lo sanno. Che non mi vendo più."],
        ["mn_desantis", "[a bordo campo, sottovoce] Bravo il portiere. Troppo bravo, per qualcuno. Stanotte non lo perdiamo d'occhio."],
        ["voce", "Lassù, in tribuna d'onore, un uomo coi capelli bianchi applaude piano, tre volte. Poi si alza e se ne va prima del fischio finale."],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 4: «Il Naviglio d'Inverno».`],
      ], () => K.openMain(), "mn_naviglio");
    };

    const zones = {
      mn_arena: {
        region: "arena", name: "L'Arena Civica nel fango", short: "Arena Civica", sub: "Cinquantamila ombrelli, riflettori nella nebbia, fango fino alle caviglie", bg: "mn_stadio", time: "tramonto", travel: [16, 21],
        w: 34, h: 24, start: [16, 21], items: [[3, 17], [30, 17], [16, 17], [8, 21], [26, 21]],
        areas: [[7, 8, 26, 17, "Il campo dell'Arena, inzuppato"], [0, 0, 33, 6, "Le gradinate"], [0, 0, 33, 23, "L'Arena Civica"]],
        flavor: {
          j: ["Le gradinate: ombrelli, cappelli, fiaschi. Uno ha portato la nonna. La nonna urla più di tutti.", "Un tifoso ha srotolato uno striscione: «FERROVIERI, NON SIETE IN VENDITA». Qualcuno ha cancellato il NON. Qualcun altro l'ha riscritto più grande."],
          g: "La porta, con la rete di corda gonfia d'acqua. Il palo sinistro ha una tacca: ci ha battuto la testa un portiere nel 1931 e da allora lo chiamano «il palo del povero Gigi».",
          l: "Un pilone dei riflettori. Quattro lampade. Una fulminata. Una che si accende e si spegne come chi non sa decidersi.",
          A: ["Manifesto: «OGGI · FERROVIERI–DIAVOLI DELL'OMBRA · A SEGUIRE IL DERBY». Il prezzo dei popolari è stato corretto a penna, in su.", "«ACCIAIERIE BALESTRINI · AMICHE DELLO SPORT». Sotto, un ragazzino ha scritto: «E DI CHI?»."],
          K: "L'edicola dell'Arena: Gazzetta, Tuttosport, il Corriere d'Informazione. A pagina undici, un pezzo firmato «I. F.» sulle «strane lavatrici dei portieri di Promozione». Piccolo. Ma c'è.",
          u: "Un banchetto di bibite: gazzosa, chinotto, e un thermos di vin brulé che non risulta da nessuna licenza.",
        },
        intro: [["voce", "Arena Civica, domenica 14 novembre 1954. Una pioggia gelida su cinquantamila ombrelli. Prima del derby si gioca l'apertura: Ferrovieri di Porta Ticinese contro i Diavoli dell'Ombra. Nessuno è venuto per l'apertura. Qualcuno, però, ci ha scommesso sopra un sacco di soldi."]],
        npcs: (s) => [
          { id: "mn_desantis", at: s === 0 ? [16, 19] : [12, 20] },
          { id: "mn_pavesi", at: s >= 3 ? [16, 18] : [5, 18] },
          { id: "mn_boffi", at: [24, 18] },
          { id: "mn_tino", at: [10, 7] }, { id: "mn_pinin", at: [12, 7] },
          { id: "mn_gaspare", at: [29, 20] },
          { id: "mn_scotti", at: [20, 21], route: [[20, 21], [24, 21], [24, 22], [20, 22]] },
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 23, "+"); lay(0, 0, 33, 0, "a"); lay(0, 23, 33, 23, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a");
          lay(1, 1, 32, 5, "j"); lay(1, 6, 32, 6, ":"); lay(1, 1, 3, 5, "a"); lay(30, 1, 32, 5, "a");
          // il campo nel fango con le porte (si guarda, non ci si entra: si gioca)
          lay(7, 8, 26, 16, "-"); lay(7, 8, 26, 8, "f"); lay(7, 16, 26, 16, "f"); lay(7, 9, 7, 15, "f"); lay(26, 9, 26, 15, "f"); put(16, 7, ":"); put(16, 16, "f");
          put(8, 11, "g"); put(8, 12, "g"); put(8, 13, "g"); put(25, 11, "g"); put(25, 12, "g"); put(25, 13, "g");
          // spogliatoi (a sinistra), tribuna d'onore (al centro, sopra le gradinate), sala stampa (a destra)
          house(1, 8, 5, 6, { door: [3, 13], roof: "#3f3f46", wall: "#9ca3af", rr: 2, lit: true, enter: { to: "mn_spogliatoio", at: [8, 10] } });
          house(13, 1, 7, 5, { door: [16, 5], roof: "#1c1917", wall: "#d6d0c4", rr: 2, lit: true, enter: { to: "mn_tribuna", at: [8, 9], locked: (K) => (K.stepOf(3) < 2 ? "Un carabiniere in alta uniforme: «Tribuna d'Onore. Invitati. Lei è invitato? No. Si vede dalle scarpe»." : false) } });
          house(28, 8, 5, 6, { door: [30, 13], roof: "#44403c", wall: "#78716c", rr: 2, lit: true, enter: { to: "mn_stampa", at: [7, 9] } });
          [[2, 7], [31, 7], [6, 17], [27, 17]].forEach(([x, y]) => put(x, y, "l"));
          put(10, 20, "A"); put(22, 20, "A"); put(28, 18, "K"); put(30, 20, "u"); [[1, 21], [32, 21], [1, 16], [32, 16]].forEach(([x, y]) => put(x, y, "t")); put(14, 21, "b"); put(18, 21, "b");
        },
        decor(g, cx, cy, d) {
          K.plaque(g, "SPOGLIATOI", d.X(3) + 8, d.Y(8) - 2, "#e5e7eb"); K.plaque(g, "TRIBUNA D'ONORE", d.X(16) + 8, d.Y(1) - 2, "#fbbf24"); K.plaque(g, "SALA STAMPA", d.X(30) + 8, d.Y(8) - 2, "#93c5fd");
          [[2, 7], [31, 7]].forEach(([x, y]) => K.light(d.X(x) + 8, d.Y(y), 90, "255,245,200", 0.25));
          if (d.fr % 160 < 4) K.light(d.X(29) + 8, d.Y(15), 60, "255,255,255", 0.9); // il magnesio di Rino
        },
      },

      mn_spogliatoio: {
        interior: true, region: "arena", name: "Gli spogliatoi sotto la gradinata", short: "Spogliatoi", sub: "Canfora, fango secco, una lavagna col Metodo", bg: "mn_stadio", time: "notte",
        w: 18, h: 12, start: [8, 10], outside: ["mn_arena", 3, 14],
        flavor: {
          B: "Una panca con le maglie granata appese. Ognuna ha una toppa sul gomito. La numero 1 ne ha tre.",
          L: "Una lavagna d'ardesia col Metodo disegnato a gesso. In un angolo, un'altra mano ha scritto: «AL FISCHIO LUNGO, FERMI». Qualcuno ha cancellato con la manica. Si legge ancora.",
          H: "Una stufa a carbone accesa. Sopra, una pentola di brodo. Sciur Gioann dice che il brodo, a novembre, vale due gol.",
          x: "La cassetta dei palloni. Sette palloni di cuoio, ognuno col nome scritto col gesso: Pierino, Gigetto, la Wanda, il Commendatore. Quest'ultimo è il più gonfio.",
          D: "Gli armadietti di lamiera. In quello di Nando, una foto di Rosetta e un santino di Santa Rita, la santa delle cause impossibili.",
        },
        intro: [["voce", "Gli spogliatoi: volte di pietra umida, odore di canfora e di olio canforato, tacchetti chiodati che grattano sul pavimento. In fondo, accanto alla stufa, l'arbitro Brambilla pesa un pallone di cuoio sulla mano, come se pesasse una coscienza."]],
        npcs: (s) => [{ id: "mn_arbitro", at: [14, 4] }, { id: "mn_nando", at: [4, 7] }, { id: "mn_gioann", at: [9, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 11, "+"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 11, "a"); lay(17, 0, 17, 11, "a"); lay(0, 11, 17, 11, "a"); put(8, 11, "v");
          lay(1, 2, 1, 9, "B"); lay(2, 2, 5, 2, "D"); put(7, 1, "L"); put(16, 2, "H"); put(11, 2, "x"); lay(12, 7, 15, 7, "B");
        },
      },

      mn_tribuna: {
        interior: true, region: "lucciola", name: "La Tribuna d'Onore", short: "Tribuna d'Onore", sub: "Poltrone di cuoio, binocoli da teatro, ombrelli bagnati", bg: "mn_stadio", time: "tramonto",
        w: 16, h: 11, start: [8, 9], outside: ["mn_arena", 16, 6],
        flavor: {
          E: "La balaustra della tribuna. Da qui il campo sembra un tavolo da biliardo sporco, e i giocatori le palle.",
          T: "Un tavolino con un vassoio d'argento: tartine, un binocolo da teatro, e un telegramma ripiegato. «TUTTO COME DA ACCORDI. B.»",
          L: "Una mensola con le coppe dell'Arena. La più grande è vuota: il Trofeo della Ricostruzione, offerto dalle Acciaierie Balestrini.",
        },
        intro: [["voce", "La Tribuna d'Onore: un assessore, un monsignore, due ragionieri del Comune e un uomo coi capelli bianchi seduto in prima fila come a casa sua. Accanto, avvolta in una volpe argentata, Mara guarda il campo e non lo vede."]],
        npcs: () => [{ id: "mn_mara", at: [4, 4] }, { id: "mn_balestrini", at: [10, 3] }, { id: "mn_carmine", at: [13, 6] }, { id: "mn_contessa", at: [2, 7] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, '"'); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(1, 2, 14, 2, "E"); put(7, 5, "T"); put(1, 9, "L"); put(14, 9, "L"); [[3, 5], [5, 5], [9, 5], [11, 5]].forEach(([x, y]) => put(x, y, "b"));
        },
      },

      mn_stampa: {
        interior: true, region: "arena", name: "La Sala Stampa", short: "Sala Stampa", sub: "Macchine da scrivere, telefoni a manovella, fumo", bg: "mn_questura", time: "notte",
        w: 15, h: 11, start: [7, 9], outside: ["mn_arena", 30, 14],
        flavor: {
          T: ["Una Olivetti Lettera 22 con un foglio a metà: «Il calcio milanese, domenica dopo domenica, scopre di avere una coscienza. Ma ha perso le chiavi». Firmato I. F.", "Un telefono a manovella. Sopra, un cartello: «LINEA PER LA REDAZIONE. NON PER LA FIDANZATA, BRAMBATI»."],
          L: "Pile di giornali vecchi. La Gazzetta del '49, col lutto di Superga in prima pagina. Qualcuno l'ha tenuta, piegata con cura.",
        },
        intro: [["voce", "La Sala Stampa: venti macchine da scrivere che battono come grandine, telefoni a manovella, fumo da tagliare. Tutti uomini, tutti col cappello. Tranne una, senza cappello, al tavolo più vicino alla porta."]],
        npcs: () => [{ id: "mn_ines", at: [3, 4] }, { id: "mn_rino", at: [11, 4] }, { id: "mn_marietto", at: [7, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 14, 10, "="); lay(0, 0, 14, 1, "a"); lay(0, 0, 0, 10, "a"); lay(14, 0, 14, 10, "a"); lay(0, 10, 14, 10, "a"); put(7, 10, "v");
          [[2, 3], [4, 3], [10, 3], [12, 3], [2, 6], [12, 6]].forEach(([x, y]) => put(x, y, "T")); put(1, 9, "L"); put(13, 9, "L"); put(7, 1, "W");
        },
      },
    };

    const brambilla = () => say([
      ["mn_arbitro", "[pesa il pallone sulla mano] Tu sei quello dei Ferrovieri. So chi sei. So anche chi ti manda. Siediti."],
      ["hero", "Ho un fischietto d'ottone brunito, signor Brambilla. Suona basso e lungo. Me l'ha dato Don Carmine. Dice che lo usa un arbitro, oggi."],
      ["mn_arbitro", "[apre la mano. Nel palmo, un fischietto uguale] Quello è il gemello. Me ne hanno dati due, nel caso perdessi il primo. Gente previdente."],
      ["mn_arbitro", "Mia figlia, Lucia, ha nove anni. È a Niguarda da agosto, coi polmoni. Le cure costano quanto tre stipendi di arbitro. Un signore molto gentile le paga. Io, in cambio, al novantesimo fischio lungo."],
      ["mn_arbitro", "[guarda il fischietto] Trecento partite, ragazzo. Mai un fischio sbagliato in trent'anni. E adesso, per una bambina che tossisce, sono diventato quello che ho sempre cacciato dal campo."],
    ], () => K.weight.ask("mn_arbitro", "Brambilla ti porge tutti e due i fischietti. «Decidi tu. Io non ce la faccio più a decidere.»", [
      { label: "⚖️ Lo denuncio a De Santis", sub: "Un arbitro comprato è un arbitro comprato. Anche per amore", w: { legge: 1 }, fn: () => { F.set("mn_bra_denuncia", true); say([
        ["hero", "Mi dispiace, signor Brambilla. Lo dico al Commissario. Oggi non arbitra."],
        ["mn_arbitro", "[annuisce piano, si sfila la giacca nera] Giusto. È quello che avrei fatto io. [pausa] Mandano il sostituto, sai? Il sostituto è già qui fuori. L'hanno portato loro, in macchina. Previdenti, te l'ho detto."]], dopo); } },
      { label: "🕯️ Oggi fischia onesto, e poi testimonierà", sub: "Una possibilità, in cambio della verità davanti a un giudice", w: { pieta: 1 }, fn: () => { F.set("mn_bra_copre", true); say([
        ["hero", "Butti i fischietti nella stufa. Arbitri con il suo. E quando sarà il momento, racconterà tutto a un giudice. Non a un questurino: a un giudice."],
        ["mn_arbitro", "[guarda il fuoco della stufa per un tempo lungo, poi ci butta i due fischietti. L'ottone sfrigola] Al giudice. Va bene. Per Lucia avrò pensato a qualcos'altro, entro allora."],
        ["mn_arbitro", "Oggi fischio quello che vedo, ragazzo. Solo quello. Mi era mancato."]], dopo); } },
    ]));
    const dopo = () => { K.setStep(N, 2); K.quest("mn3_tribuna", "La Tribuna d'Onore", "Sali in Tribuna d'Onore, al centro delle gradinate: Mara è lassù."); K.done(); };

    const talk = {
      mn_desantis(K) {
        const s = S();
        if (s === 0) return say([
          ["mn_desantis", "[il cappello gocciola, la sigaretta no: è spenta da un'ora] Cinquantamila persone. Se fermiamo la partita con la polizia, stasera bruciano le tribune."],
          ["mn_desantis", "Abbiamo biglietti, lista, valigia, un fischietto. Ma il fischietto è niente senza l'arbitro che lo usa. Scendi negli spogliatoi. Brambilla. Guardalo in faccia."],
          ["mn_desantis", "Io vado in tribuna d'onore. No, non mi fanno entrare. Ma mi piace stare sotto, a guardare chi applaude e quando."],
        ], () => { K.setStep(N, 1); K.quest("mn3_spogliatoi", "Gli spogliatoi", "Scendi negli spogliatoi sotto la gradinata a sinistra: l'arbitro Brambilla."); K.done(); });
        if (s === 1) return say([["mn_desantis", "Spogliatoi, a sinistra, sotto la gradinata. Brambilla ha trent'anni di onestà e un mese di vergogna. Dipende quale delle due ti apre la porta."]]);
        if (s === 2) return say([["mn_desantis", F.is("mn_bra_denuncia") ? "Brambilla è nel mio ufficio, con Scotti. Il sostituto è un certo Rizzi, di Lodi. Mai sentito. Nessuno l'ha mai sentito. Questo mi preoccupa." : "Brambilla arbitra. Non so se hai fatto bene. So che l'hai fatto guardandolo in faccia, e di questi tempi è già molto."], ["mn_desantis", "Ora sali in tribuna. Mara è lassù, accanto al Commendatore. Guarda chi le porge l'ombrello."]]);
        return say([["mn_desantis", "In campo, figliolo. Il resto lo guardo io."]]);
      },
      mn_arbitro(K) {
        const s = S();
        if (s === 1) return brambilla();
        return say([["mn_arbitro", F.is("mn_bra_copre") ? rot(["Fischio quello che vedo. Solo quello.", "Lucia, se mi senti dalla radio dell'ospedale: papà oggi arbitra bene."]) : "[con la giacca sulle ginocchia] Non arbitro. Guardo. Per la prima volta in trent'anni, dalla panchina. Si vede meglio, sai?"]]);
      },
      mn_mara(K) {
        const s = S();
        if (s === 2) return say([
          ["mn_mara", "[non si volta] Lo vedi, l'uomo coi capelli bianchi? Mi ha appena detto che sono più bella quando sto zitta. Me lo dice da otto anni. Comincio a crederci."],
          ["mn_mara", F.is("mn_mara_busta") ? "Tu mi hai lasciato Parigi. Io ti lascio questo. [ti fa scivolare in mano uno spartito piegato in quattro] Non leggerlo qui. Leggilo dove nessuno guarda." : "Mi hai preso Parigi. Va bene. Ma io non sono una che lascia i conti aperti. [ti fa scivolare in mano uno spartito piegato in quattro] Questo vale più di quattrocentomila lire."],
        ], () => K.interroga("spartito", { biglietti: 50, fiuto: 30, sospetto: 10 }, () => say([
          ["mn_mara", "Via Manzoni. Acciaierie Balestrini. Don Carmine è il suo cane. Io sono la sua gabbia per uccelli. E voi tutti, in campo, siete i suoi pezzi di tondino."],
          ["mn_mara", "Vai a giocare, ragazzo. E di' a Nando di parare. Lui sa perché."],
        ], () => { K.questDone("mn3_tribuna"); K.setStep(N, 3); K.quest("mn3_derby", "La partita", "Raggiungi Mister Pavesi a bordo campo e gioca contro i Diavoli dell'Ombra."); K.done(); })));
        return say([["mn_mara", rot(["Canterò l'inno, prima del derby. Senza microfono. Voglio vedere se mi sentono fino ai popolari.", "Non guardarmi così. Qui sopra ci guardano tutti."])]]);
      },
      mn_pavesi(K) {
        const s = S();
        if (s === 3) return K.ask("mn_pavesi", `Mister Pavesi ti stringe la spalla come una morsa. «Ragazzo, Metodo: due terzini, tre mediani, e tu davanti con la testa. ${F.is("mn_bra_copre") ? "L'arbitro oggi è Brambilla. Dicono che fischia giusto." : "L'arbitro è un sostituto di Lodi. Mai visto. Occhio ai fischi lunghi."} Andiamo?»`, [
          { label: "⚽ Ferrovieri contro Diavoli dell'Ombra", big: true, fn: () => K.ownMatch(window.__pedinamento.start, { opp: { name: "I Diavoli dell'Ombra", kit: "#0f172a", names: ["Il Sergente Boffi", "Mastino"] }, mate: { name: "Nando", skin: "#e8c39e", hair: "#2a1d14", shirt: "#7f1d1d" }, clean: F.is("mn_bra_copre"), rain: true, mud: true, fog: 0.5, lights: 3, half: 42, hard: true,
            halftime: F.is("mn_bra_copre") ? "Intervallo. Brambilla si asciuga la faccia. Non ha fischiato niente che non fosse vero. Sembra più giovane di dieci anni." : "Intervallo. Il sostituto di Lodi guarda la tribuna d'onore ogni trenta secondi, come un orologio.",
            done: (r) => r.win ? fin() : say([["mn_pavesi", "Ci hanno battuto col fango e col fischietto. Non col pallone. Rientriamo: la partita non finisce finché non lo dico io. Neanche se lo dice l'arbitro."]]) }) },
          { label: "Un attimo, Mister", fn: () => say([["mn_pavesi", "Un attimo. Uno solo. Nel calcio gli attimi sono come le sigarette: uno tira l'altro."]]) },
        ]);
        return say([["mn_pavesi", rot(["Il Sistema? Una moda. Il Metodo è eterno, come il fango.", "Ragazzo, se vedi un mio difensore che si ferma al fischio lungo, tu non ti fermare. Tu corri. Poi ne parliamo a cena.", "Ho perso tre finali in vita mia. Tutte e tre col sole. Oggi piove: è un buon segno."])]]);
      },
      mn_nando(K) {
        const s = S();
        if (!F.is("mn_na3")) { F.set("mn_na3", true); return say(F.is("mn_nando_strappato") ? [
          ["hero", "Nando. Ho visto la lista nella valigia. C'era il tuo nome. L'ho strappato."],
          ["mn_nando", "[si siede sulla panca, le mani nei guanti di lana] Duecentomila lire. Mi servivano per il debito: ho perso al banco di Peppino a luglio, una sera stupida. Poi un signore gentile mi ha detto che il debito spariva se al novantesimo scivolavo."],
          ["mn_nando", "Non li ho incassati. L'assegno è ancora qui, nel guanto. Non riuscivo a incassarlo e non riuscivo a buttarlo. Ma adesso… adesso lo so cosa farne."],
          ["mn_nando", "Oggi paro tutto. E domani vado da Ines al giornale e le racconto ogni cosa. Coi nomi. Grazie, amico. Mi hai lasciato la possibilità di essere io a dirlo."]] : [
          ["mn_nando", "[si stringe i lacci delle scarpe, troppo forte] Ehi. Sai… ho sentito che hanno trovato una lista. Alla Lucciola. Con dei nomi."],
          ["hero", "C'era il tuo, Nando."],
          ["mn_nando", "[non alza la testa] Lo so. Lo so. Duecentomila lire, un debito al banco di Peppino, un signore gentile. L'assegno non l'ho incassato. Ce l'ho qui, nel guanto."],
          ["mn_nando", "Oggi paro tutto. Poi ne rispondo. Ma oggi paro tutto, almeno questo lasciamelo."]], () => { K.rel && K.rel.add("mn_nando", 6); K.done(); }); }
        return say([["mn_nando", rot(["Santa Rita, la santa delle cause impossibili. Rosetta me l'ha messa nell'armadietto. Dice che i portieri sono cause impossibili per definizione.", "Le mani. D'inverno le mani sono la prima cosa che ti tradisce. Oggi non mi tradiscono."])]]);
      },
      mn_gioann(K) {
        if (!F.is("mn_gi1")) { F.set("mn_gi1", true); return say([
          ["mn_gioann", "Piano coi tacchetti, che il pavimento è del '21. Io sono Gioann, magazziniere. Questi sono i miei palloni: Pierino, Gigetto, la Wanda…"],
          ["mn_gioann", "E quello lì, gonfio, si chiama il Commendatore. L'hanno portato loro, ieri, con un biglietto: «per il derby». Io l'ho pesato. Pesa venti grammi più degli altri. Un pallone più pesante, nel fango, non si alza: va basso, il portiere lo vede tardi."],
          ["mn_gioann", "Oggi si gioca con Pierino. Il Commendatore resta in cassetta. Ho settantun anni, sono magazziniere dal '21, e i palloni li decido io."]], () => { K.bond("fiuto", 10); K.done(); }); }
        return say([["mn_gioann", rot(["Il sego, ecco il segreto. Il sego di montone, a novembre. Pierino brilla come una castagna.", "Brodo? Prendi una tazza. A novembre il brodo vale due gol. Il terzo lo fai tu."])]]);
      },
      mn_balestrini(K) { return say([["mn_balestrini", F.is("mn_ba3") ? rot(["Tre a zero, scommetto. Scherzo, scherzo: io non scommetto mai. Io investo.", "Mara canterà l'inno. L'ho voluto io. Le voci, come l'acciaio, vanno temprate."]) : "[ti offre il binocolo da teatro] Giovanotto! Venga, guardi: da quassù si vede tutto. Anche quello che in campo non si vede. È il bello della tribuna d'onore. Oggi faccia il suo dovere. Io farò il mio."]], () => { F.set("mn_ba3", true); K.done(); }); },
      mn_carmine(K) { return say([["mn_carmine", rot(["[guarda Balestrini con la coda dell'occhio] Ho mantenuto la parola: niente trucchi miei. Quelli che vedrai oggi non sono miei. Te lo giuro su mia madre, la pettinatrice.", "In tribuna d'onore si sta comodi. Le poltrone sono di cuoio. Le paga lui. Tutto, qui, lo paga lui. Anche me."])]]); },
      mn_contessa(K) { return say([["mn_contessa", rot(["Ho puntato sul pareggio. Per la prima volta in un mese, spero di perdere. È una sensazione nuova, quasi giovanile.", "Il Commendatore mi ha baciato la mano. Ha le labbra fredde come la ringhiera di un ponte."])]]); },
      mn_ines(K) {
        if (!F.is("mn_in3")) { F.set("mn_in3", true); return say([
          ["mn_ines", "[batte sulla Lettera 22 senza guardare i tasti] Mi hanno messo in sala stampa per l'apertura. L'apertura. Quella che nessuno guarda. Sai perché? Perché il caporedattore pensa che qui non succeda niente."],
          ["mn_ines", "Oggi qui succede tutto. Lo sento. E io sono l'unica giornalista d'Italia seduta nel posto giusto. Va' in campo e fammi scrivere qualcosa che non sia un tabellino."]], () => { K.rel && K.rel.add("mn_ines", 6); K.done(); }); }
        return say([["mn_ines", rot(["«Il fango dell'Arena, oggi, ha un sapore diverso». No. Banale. «Cinquantamila ombrelli non bastano a coprire…». Meglio. Vai, vai, che mi distrai.", "Rino ha fotografato il Commendatore che parla col sostituto di Lodi. Se la foto viene, la metto in pagina. Se non viene, la metto lo stesso: la descrivo."])]]);
      },
      mn_rino(K) {
        if (!F.is("mn_ri1")) { F.set("mn_ri1", true); return say([
          ["mn_rino", "Fermo! [lampo di magnesio] Perfetto. Lei ha una faccia da prima pagina: preoccupata ma fotogenica. Rino Flash, fotografo a cottimo. Dieci lire a foto pubblicata, zero a quelle vere."],
          ["mn_rino", "Ho tre gol di Nordahl e il naso rotto di un arbitro. E oggi ho una foto che nessuno vorrà: un signore coi capelli bianchi che dà la mano a un arbitro che non doveva arbitrare. Si chiama giornalismo. O suicidio. Dipende dal giornale."]], () => { K.bond("fiuto", 8); K.done(); }); }
        return say([["mn_rino", rot(["Una foto vale più di cento testimoni. Perché i testimoni cambiano idea. La foto no: al massimo ingiallisce.", "Il magnesio mi ha bruciato le sopracciglia due volte. Adesso le disegno con la matita della mia fidanzata."])]]);
      },
      mn_marietto(K) {
        if (!F.is("mn_mr1")) { F.set("mn_mr1", true); return say([
          ["mn_marietto", "GAZZETTAAA! TUTTOSPORT! IL CORRIERE CON LE FORMAZIONIII! [abbassa la voce di colpo] Lei. Lei è quello dei Ferrovieri. Le do una notizia che non è ancora uscita: è gratis, perché non la posso vendere."],
          ["mn_marietto", "Stamattina, in via Manzoni, ho venduto il giornale a un autista. Mi ha dato mille lire e mi ha detto di tenere il resto. Poi ha detto al suo padrone: «Il portiere dei Ferrovieri, Commendatore, si è pentito». E il padrone ha detto: «I pentiti si sistemano». Io ho la voce da tenore, signore. Ma l'orecchio da sordo, quando serve. Oggi no."]], () => { K.bond("fiuto", 12); K.done(); }); }
        return say([["mn_marietto", rot(["EDIZIONE STRAORDINARIAAA! [non c'è nessuna edizione straordinaria. È per allenarsi]", "Quarant'anni che strillo. Le notizie belle si vendono meno. Le brutte, si vendono da sole."])]]);
      },
      mn_boffi(K) {
        if (!F.is("mn_bo1")) { F.set("mn_bo1", true); return say([
          ["mn_boffi", "Sergente Boffi, capitano dei Diavoli. Ex alpino, Russia, quarantadue. Ho camminato a piedi da Nikolaevka a Udine. Non ho paura di niente, tranne dei preti e delle suocere."],
          ["mn_boffi", "Ti dico una cosa da soldato: metà della mia squadra è pagata per vincere, e io lo so. Io no. Io gioco duro, ma pulito. Se oggi vedi un mio uomo che fa il furbo, buttalo giù. Hai il mio permesso. Il resto me lo sbrigo io negli spogliatoi."]], () => { K.bond("fiuto", 6); K.done(); }); }
        return say([["mn_boffi", rot(["In Russia giocavamo a pallone con un elmetto. Era duro, ma non si bucava.", "Duro e pulito, ragazzo. Come il pane di montagna."])]]);
      },
      mn_tino(K) { return say([["mn_tino", rot(["Oggi tifo Ferrovieri. Per l'apertura. Al derby torno me stesso.", "Se i Ferrovieri vincono, offro io. Se perdono, offre Pinin. Lui non lo sa ancora."])], ["mn_pinin", rot(["Lo sapevo, ci frega anche oggi.", "Per una volta siamo d'accordo. Non ci farci l'abitudine."])]]); },
      mn_pinin(K) { return say([["mn_pinin", "Giovanotto! Abbiamo fatto uno striscione: «FERROVIERI, NON SIETE IN VENDITA». Tino voleva scrivere «non siete in svendita». Ragioniere."], ["mn_tino", "Era più preciso."]]); },
      mn_gaspare(K) { return say([["mn_gaspare", rot(["Caldarroste anche allo stadio! Le uniche cose qui dentro che nessuno ha comprato in anticipo.", "Il Commissario mi ha chiesto un cartoccio e l'ha dato a un bambino in curva. Uomo strano. Glielo dico sempre."])]]); },
      mn_scotti(K) { return say([["mn_scotti", rot(["Ho chiesto all'arbitro sostituto il documento. Ha detto che l'aveva dimenticato. A Lodi. Ho annotato: «Lodi».", "Il fuorigioco, ho scoperto, non è un reato. Ma sembra. Sto scrivendo al Ministero."])]]); },
    };

    return { n: N, title: "Il Derby dell'Ombra", sub: "L'Arena Civica nel fango, l'arbitro, la tribuna d'onore e la partita dei Ferrovieri", goal, start: "mn_arena", introBg: "mn_stadio", zones, talk,
      intro: () => [["voce", "Milano, domenica 14 novembre 1954. Una pioggia gelida su cinquantamila ombrelli scuri."], ["voce", "I tacchetti di cuoio affondano nel fango dell'Arena. Sotto le tribune, De Santis stringe la cartella delle prove. Lassù, qualcuno ha già scritto il risultato."]] };
  }

  boot();
})();
