// js/milano-c1.js - OPERAZIONE FUORIGIOCO NOIR · Capitolo 1 «La Nebbia sui Bastioni»
// Novembre 1954. Il Campione arriva ai Bastioni di Porta Ticinese per giocare nei Ferrovieri. Il Commissario De Santis lo
// recluta per un'indagine sulle partite comprate: l'Osteria del Tram, il Deposito del 19, Peppino il Guercio, la prima scelta.
(function () {
  "use strict";
  function boot() {
    const D = window.__milano;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const N = 1, S = () => K.stepOf(N), F = K.F;
    const say = (ls, then) => K.say(ls, then || K.done);

    K.cos("mn_c1", { kind: "shirt", label: "Trench investigativo grigio antracite", val: "#334155", from: "Capitolo 1 di Operazione Fuorigioco Noir" });
    K.lore("l_milano54", { t: "Milano 1954", d: "La ricostruzione: cantieri ovunque, tram arancioni e verdi, la Fiera Campionaria, e la domenica cinquantamila persone sotto la pioggia per novanta minuti di pallone." });
    K.lore("l_bastioni", { t: "I Bastioni di Porta Ticinese", d: "Rotaie, osterie, bische nei retrobottega e un campetto di terra battuta dove i Ferrovieri si allenano con la luce dei lampioni." });
    K.lore("l_ferrovieri", { t: "I Ferrovieri di Porta Ticinese", d: "Polisportiva dei ferrovieri: scambisti, frenatori, un capostazione in pensione come presidente. Giocano in maglia granata con le toppe sui gomiti." });

    const goal = (s) => ({
      0: "Sei ai Bastioni di Porta Ticinese. Qualcuno ti aspetta sotto il lampione davanti all'Osteria del Tram.",
      1: "Entra nell'Osteria del Tram e fai due chiacchiere con Battista l'Oste.",
      2: "Il Deposito del 19, in fondo al piazzale: cerca Peppino il Guercio tra le carrozze ferme.",
      3: "La Banda dei Bastioni ha occupato il campetto. Raggiungi Nando sul campo di terra e gioca!",
    }[s] || "Il primo capitolo è concluso. Continua nel Capitolo 2.");

    const fin = () => {
      const msg = K.reward("mn_c1", { coins: 80, cos: "mn_c1" });
      K.finishChapter(N, F.is("mn_pep_info") ? "informatore" : "arresto");
      K.scene([
        ["mn_desantis", "[guarda la nebbia che si richiude sul campetto] Bella partita. Ora ti dico una cosa che non ti piacerà: i ragazzi della Banda erano pagati per menarti, non per batterti."],
        ["mn_desantis", "Qualcuno vuole che tu stia lontano dal derby. E quando qualcuno a Milano vuole una cosa, di solito la ottiene in una sala con le tende di velluto."],
        ["mn_desantis", "Domani sera andiamo alla Lucciola. Mettiti una cravatta. Se non ce l'hai, te la presta Scotti: ne ha una sola, ma la presta volentieri."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «La Lucciola e il Doppiogioco».`],
      ], () => K.openMain(), "mn_club");
    };

    const zones = {
      mn_bastioni: {
        region: "bastioni", name: "I Bastioni di Porta Ticinese", short: "Bastioni Ticinese", sub: "Rotaie del tram, nebbia fitta e lampioni a gas", bg: "mn_titolo", time: "notte", travel: [6, 12],
        w: 34, h: 24, start: [6, 12], items: [[3, 21], [30, 21], [17, 3 + 9], [32, 9], [13, 21]],
        areas: [[8, 14, 21, 21, "Il campetto di terra dei Ferrovieri"], [24, 13, 31, 19, "Porta Ticinese"], [0, 0, 33, 23, "Il piazzale dei Bastioni nella nebbia"]],
        flavor: {
          K: ["Il Corriere d'Informazione: «DERBY, CRESCE L'ATTESA». Sotto, piccolo: «Ritrovato un cane parlante a Lambrate. Smentita».", "La Gazzetta rosa, la Notte, la Domenica del Corriere con la copertina di Walter Molino: un tram che vola in un canale."],
          A: ["Manifesti: «FIERA CAMPIONARIA», «GRANDE DERBY ALL'ARENA», e uno strappato a metà: «…RESTARE A CASA». Il resto, la pioggia se l'è preso.", "Un manifesto delle Acciaierie Balestrini: un uomo sorridente con un tondino di ferro in mano. «L'ACCIAIO CHE TIENE IN PIEDI MILANO»."],
          O: "Il braciere di Gaspare. Le caldarroste scoppiano come piccoli colpi di pistola. Nessuno si spaventa: a Milano si spaventano per altro.",
          C: "Una carrozza del 19 in sosta. Sul vetro qualcuno ha scritto col dito: «FORZA FERROVIERI». E sotto, con un altro dito: «MAGARI».",
          l: "Un lampione a gas. Celestino lo accende alle cinque e mezza, lo spegne alle sei. Dice che la luce, a Milano, si consuma in fretta.",
          b: "Una panchina bagnata. C'è inciso un cuore con due iniziali, e qualcuno ci ha disegnato sopra un pallone.",
          g: "Due pali e una traversa di legno, la rete fatta coi sacchi delle Ferrovie. È la porta dei Ferrovieri. Nando la chiama «la mia finestra».",
          p: "Una colonna di Porta Ticinese. Ha visto passare Napoleone, gli Austriaci, i Savoia e il 19. Il più puntuale è stato Napoleone.",
        },
        intro: [
          ["voce", "Milano, novembre 1954. Una nebbia spessa come panna sale dalla Darsena e si mangia i profili delle case. Il 19 passa sferragliando, col trolley che sputa scintille."],
          ["voce", "Sei arrivato col treno delle sei per giocare nei Ferrovieri di Porta Ticinese. Una valigia, un paio di scarpe coi tacchetti e un indirizzo scritto a matita."],
          ["voce", "Sotto il lampione davanti all'Osteria, un uomo in impermeabile chiaro accende una sigaretta. Non la fuma. La guarda."],
        ],
        npcs: (s) => [
          { id: "mn_desantis", at: s === 0 ? [9, 11] : [14, 11] },
          { id: "mn_scotti", at: [16, 11], route: [[16, 11], [20, 11], [20, 12], [16, 12]] },
          { id: "mn_gaspare", at: [28, 21] },
          { id: "mn_celestino", at: [3, 17], route: [[3, 17], [3, 20], [6, 20], [6, 17]] },
          { id: "mn_brogio", at: [31, 11] },
          { id: "mn_ines", at: [24, 10] },
          ...(s >= 3 ? [{ id: "mn_nando", at: [14, 17] }] : [{ id: "mn_nando", at: [18, 19] }]),
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 23, "+"); lay(0, 0, 33, 0, "a"); lay(0, 23, 33, 23, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a");
          // la fila di case milanesi a nord: Osteria, Deposito, Cabina elettrica, la casa di Celestino
          house(1, 1, 8, 7, { door: [5, 7], roof: "#3f3f46", wall: "#c8b89a", rr: 3, lit: true, timber: "#7c2d12", enter: { to: "mn_osteria", at: [8, 10] } });
          house(10, 1, 11, 7, { door: [15, 7], roof: "#1f2937", wall: "#7a8494", rr: 3, lit: false, enter: { to: "mn_deposito", at: [9, 11] } });
          house(22, 1, 6, 7, { door: [24, 7], roof: "#44403c", wall: "#9ca3af", rr: 3, lit: true, enter: "La Cabina Elettrica del Tram: un ronzio di trasformatori e un cartello «CHI TOCCA MUORE». Sotto, a matita: «E CHI NON TOCCA?»." });
          house(29, 1, 4, 7, { door: [30, 7], roof: "#57534e", wall: "#b0a08a", rr: 3, lit: true, enter: { room: "casa", name: "La casa di Celestino", flavor: { L: "Quaderni di poesie scritte sul retro delle bollette del gas. Una dice: «Nebbia, città che si vergogna»." } } });
          // marciapiede e binari del 19 (si attraversano)
          lay(1, 10, 32, 11, "Y");
          // il campetto di terra battuta con le porte
          lay(8, 14, 21, 21, ":"); lay(8, 14, 21, 14, "f"); put(14, 14, ":"); put(15, 14, ":"); put(8, 17, "g"); put(8, 18, "g"); put(21, 17, "g"); put(21, 18, "g");
          // Porta Ticinese: colonne e l'arco
          lay(24, 13, 31, 13, "y"); [[24, 14], [26, 14], [29, 14], [31, 14]].forEach(([x, y]) => put(x, y, "p")); lay(27, 13, 28, 13, ":");
          // arredo: lampioni, panchine, edicola, colonnina, braciere, alberi spogli
          [[4, 9], [12, 13], [23, 9], [32, 13], [7, 21], [22, 21]].forEach(([x, y]) => put(x, y, "l"));
          put(2, 13, "b"); put(3, 13, "b"); put(23, 16, "b"); put(25, 9, "K"); put(11, 9, "A"); put(29, 21, "O"); put(30, 21 - 1, "t");
          [[2, 15], [1, 19], [23, 19], [32, 16], [32, 18], [25, 22 - 1]].forEach(([x, y]) => put(x, y, "t"));
          put(6, 9, "s");
        },
        decor(g, cx, cy, d) {
          K.plaque(g, "OSTERIA DEL TRAM", d.X(5) + 8, d.Y(1) - 2, "#fbbf24"); K.plaque(g, "DEPOSITO ATM 19", d.X(15) + 8, d.Y(1) - 2, "#93c5fd");
          K.plaque(g, "CABINA", d.X(24) + 8, d.Y(1) - 2); K.plaque(g, "FERROVIERI", d.X(14) + 8, d.Y(14) - 4, "#fca5a5"); K.plaque(g, "PORTA TICINESE", d.X(27) + 16, d.Y(13) - 4, "#e5e7eb");
          // il tram 19 che passa lungo i binari, ogni tanto
          const t = (d.fr % 900) / 900, tx0 = -6 * 16 + t * 46 * 16, ty0 = d.Y(10) - 6;
          if (t < 0.92) { K.P(tx0 - cx * 0 + d.X(0), ty0, 80, 22, "#365314"); for (let i = 0; i < 5; i++) K.P(tx0 + d.X(0) + 5 + i * 15, ty0 + 3, 10, 8, "#fcd34d"); K.P(tx0 + d.X(0), ty0 + 14, 80, 8, "#e7dcc0"); K.light(tx0 + d.X(0) + 82, ty0 + 12, 30, "255,240,180", 0.6); }
        },
      },

      mn_osteria: {
        interior: true, region: "lucciola", name: "Osteria del Tram", short: "Osteria del Tram", sub: "Rosso novello, minestrone d'orzo e la radio a valvole", bg: "mn_titolo", time: "notte",
        w: 18, h: 13, start: [8, 10], outside: ["mn_bastioni", 5, 8],
        flavor: {
          E: "Il bancone di zinco. Bottiglie di grappa, un fiasco di Barbera, e la radio Phonola che gracchia la Domenica Sportiva anche il martedì.",
          T: ["Un tavolo con le carte da scopa. Il sette bello ha un angolo piegato. Lo sanno tutti chi l'ha piegato.", "Un tavolo con un giornale aperto sulle formazioni del derby. Qualcuno ha cerchiato un nome a matita: il portiere dei Ferrovieri."],
          H: "La stufa di ghisa. Ci si asciugano i guanti dei tranvieri e le scarpe dei Ferrovieri dopo l'allenamento.",
          L: "Una mensola con le foto: i Ferrovieri del '38, del '47, del '52. Sempre la stessa maglia, sempre meno capelli.",
          W: "La vetrata appannata. Fuori passa il 19 e per un attimo l'osteria si illumina di giallo.",
          D: "La credenza col salame appeso e un barattolo con scritto «MANCE». Dentro, tre bottoni e una moneta austriaca.",
        },
        intro: [["voce", "L'Osteria del Tram: fumo di pipa, profumo di minestrone, due che litigano di calcio al tavolo d'angolo come se ne andasse della vita. Dietro il bancone, Battista asciuga un bicchiere già asciutto."]],
        npcs: (s) => [
          { id: "mn_oste", at: [8, 3] },
          { id: "mn_carlo", at: [3, 7] },
          { id: "mn_tino", at: [13, 6] },
          { id: "mn_pinin", at: [15, 6] },
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 12, "="); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 12, "a"); lay(17, 0, 17, 12, "a"); lay(0, 12, 17, 12, "a"); put(8, 12, "v");
          put(4, 1, "W"); put(12, 1, "W"); lay(5, 2, 11, 2, "E"); put(1, 2, "L"); put(2, 2, "L"); put(16, 2, "D"); put(15, 2, "D"); put(16, 9, "H");
          put(3, 6, "T"); put(4, 6, "T"); put(14, 5, "T"); put(14, 7, "T"); put(5, 9, "T"); put(11, 9, "T"); put(2, 6, "b"); put(13, 9, "b");
        },
        decor(g, cx, cy, d) { K.plaque(g, "VINO SFUSO · LIRE 60", d.X(8) + 8, d.Y(1) + 6, "#fbbf24"); },
      },

      mn_deposito: {
        interior: true, region: "bastioni", name: "Deposito del Tram n° 19", short: "Deposito del 19", sub: "Carrozze verdi, scintille e un binario morto", bg: "mn_titolo", time: "notte",
        w: 20, h: 14, start: [9, 11], outside: ["mn_bastioni", 15, 8],
        flavor: {
          C: ["Una carrozza del 19 in riparazione. Sul sedile in fondo, un mozzicone ancora caldo.", "Carrozza 1503: sul pavimento, una manciata di biglietti punzonati due volte. Il secondo foro è a forma di stella."],
          T: "Il banco degli attrezzi: chiavi, morsetti, e una pinza da controllore con la punta a stella. Non è quella dell'ATM.",
          D: "Un armadietto di lamiera con le divise di ricambio. In una tasca, una schedina del Totocalcio con tredici risultati già scritti. A matita. In anticipo.",
          x: "Una cassetta del controllore. Dentro: matrici di biglietti, un pacco di banconote legate con lo spago, e un santino di San Cristoforo.",
          Y: "Il binario morto. Finisce contro un muro con su scritto a vernice: «QUI SI SCENDE». Qualcuno ha aggiunto: «TUTTI».",
        },
        intro: [["voce", "Il Deposito del 19: carrozze verdi ferme nel buio, l'odore di olio e di ferro bagnato. In fondo, su un binario morto, una lampadina accesa e un uomo che conta qualcosa ad alta voce."]],
        npcs: () => [{ id: "mn_peppino", at: [14, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 13, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 13, "a"); lay(19, 0, 19, 13, "a"); lay(0, 13, 19, 13, "a"); put(9, 13, "v");
          lay(2, 3, 2, 9, "C"); lay(3, 3, 3, 9, "C"); lay(6, 3, 6, 9, "C"); lay(7, 3, 7, 9, "C"); lay(10, 2, 17, 2, "Y"); lay(16, 3, 17, 3, "Y");
          put(12, 3, "T"); put(15, 6, "x"); put(13, 8, "l"); put(17, 10, "D");
        },
        decor(g, cx, cy, d) { K.light(d.X(14) + 8, d.Y(3), 50, "255,220,140", 0.4); },
      },
    };

    const pepScelta = (then) => K.weight.ask("mn_peppino", "Peppino suda freddo. Ha sputato i nomi di Mara e di Don Carmine. Cosa ne fai?", [
      { label: "🔒 Lo porto da De Santis in manette", sub: "La legge è la legge, anche alle due di notte", w: { legge: 1 }, fn: () => { F.set("mn_pep_arresto", true); say([
        ["hero", "Peppino, alzati. Questa notte la passi in una cella calda. Più calda di quella che ti aspetta dai tuoi amici, almeno."],
        ["mn_peppino", "[ride senza allegria] Calda? A San Vittore? Ragazzo, tu non sei di Milano."],
        ["voce", "Lo accompagni fuori. Scotti gli mette le manette con la delicatezza di chi impacchetta un regalo. De Santis guarda e non dice niente."]], then); } },
      { label: "🌫️ Lo lascio andare: lavorerà per me", sub: "Un allibratore libero sente più cose di un allibratore in cella", w: { ombra: 1 }, fn: () => { F.set("mn_pep_info", true); K.rel && K.rel.add("mn_peppino", 6); say([
        ["hero", "Facciamo così, Peppino. Tu torni al tuo banco, conti i soldi come sempre, e quando qualcuno punta troppo su una partita, me lo dici."],
        ["mn_peppino", "[ti fissa con l'occhio buono per un tempo lunghissimo] Un ragazzo che fa affari. Milano ti piacerà. Tu, a Milano, un po' meno."],
        ["mn_peppino", "Affare fatto. Ma se mi scoprono, nel Naviglio ci finisco io, non tu. Ricordatelo quando dormi."]], then); } },
    ]);

    const talk = {
      mn_desantis(K) {
        const s = S();
        if (s === 0) return say([
          ["mn_desantis", "[accende la sigaretta, la guarda bruciare] Tu sei il ragazzo dei Ferrovieri. Quello che ha fatto tre gol al Lambrate col naso rotto."],
          ["hero", "Due. Il terzo era autogol. Lei chi è?"],
          ["mn_desantis", "De Santis, Squadra Mobile. Onesto: mi piace la gente che corregge i numeri a proprio sfavore. Ce n'è poca."],
          ["mn_desantis", "Ascolta. Quest'autunno a Milano ci sono portieri che scivolano al novantesimo, terzini che si fermano a guardare il cielo e arbitri che vedono fuorigioco dove c'è solo nebbia."],
          ["mn_desantis", "Tra tre domeniche c'è il derby all'Arena Civica. Ci giocano anche i Ferrovieri, nel pomeriggio, come apertura. E qualcuno ha già deciso il risultato di tutte e due."],
          ["hero", "E io cosa c'entro?"],
          ["mn_desantis", "Tu sei nuovo. Nessuno ti conosce, nessuno ti ha ancora comprato. Sei l'unico in tutta la Lombardia che può entrare in uno spogliatoio senza che smettano di parlare."],
          ["mn_desantis", "Comincia dall'Osteria. Battista ascolta tutto. Se gli piaci, qualcosa ti dirà. Se non gli piaci, ti dirà che il minestrone è finito."],
        ], () => { K.bond("fiuto", 10); K.setStep(N, 1); K.quest("mn1_osteria", "All'Osteria del Tram", "Entra nell'Osteria del Tram e parla con Battista l'Oste."); K.done(); });
        if (s === 1) return say([["mn_desantis", "Battista è dentro. Ordina un rosso: chi ordina acqua all'Osteria del Tram viene guardato come un questurino. Anche se è un questurino."]]);
        if (s === 2) return say([["mn_desantis", "Peppino il Guercio, al Deposito. Ha una pinza a stella e dieci anni di puntate in testa. Fallo parlare. Le mani tienile in tasca: è un consiglio, non un ordine."]]);
        if (s === 3) return say([["mn_desantis", F.is("mn_pep_info") ? "Hai lasciato andare Peppino. Non ti chiedo perché. Ti chiedo solo di ricordarti che l'hai fatto tu." : "Peppino stanotte dorme a San Vittore. Scotti ha già scritto tre pagine di verbale. Due sono sul tempo atmosferico."], ["mn_desantis", "Ora va' al campetto. La Banda dei Bastioni ti aspetta, e non per chiederti l'autografo."]]);
        return say([["mn_desantis", "La nebbia nasconde tante cose, figliolo. Ma non il rumore di un rigore comprato."]]);
      },
      mn_oste(K) {
        const s = S();
        if (s === 1) return say([
          ["mn_oste", "[pulisce un bicchiere già pulito] Buonasera. Fuori si taglia col coltello, eh? Cosa ti porto?"],
          ["hero", "Un rosso. E un nome: chi tiene il banco delle scommesse qui al capolinea?"],
          ["mn_oste", "[versa il rosso, lentamente] Il rosso è sessanta lire. Il nome non è in vendita. Però…"],
          ["mn_oste", "Però se uno passasse dal Deposito del 19 a quest'ora, troverebbe uno che conta i soldi ad alta voce perché ha paura che i soldi non lo sentano. Uno con un occhio solo."],
          ["mn_oste", "Paga i vincitori in biglietti del tram, punzonati due volte. Chi vince va da lui, chi perde va dal Naviglio. Bevi, che si raffredda."],
          ["mn_oste", "E salutami Nando, quando lo vedi. Mi deve un conto da maggio, ma è un bravo ragazzo. I bravi ragazzi hanno sempre un conto aperto da qualche parte."],
        ], () => { K.bond("biglietti", 30); K.bond("fiuto", 10); K.questDone("mn1_osteria"); K.setStep(N, 2); K.quest("mn1_deposito", "Il Deposito del 19", "Raggiungi il Deposito del Tram in fondo al piazzale e affronta Peppino il Guercio."); K.done(); });
        if (s === 2) return say([["mn_oste", "Il Deposito è la porta grande col tetto scuro. Se senti qualcuno che conta, sei arrivato."]]);
        return say([["mn_oste", ["Il minestrone oggi è d'orzo. Ieri era d'orzo. Domani, sorpresa: d'orzo.", "Io non ho sentito niente. Lo dico prima, così risparmiamo tempo tutti e due.", "Tino e Pinin litigano dal '38. Se uno dei due smettesse, l'altro morirebbe di noia."][(K.frNow() >> 6) % 3]]]);
      },
      mn_peppino(K) {
        const s = S();
        if (s === 2) return say([
          ["mn_peppino", "…trentasette, trentotto, quaranta. [alza l'occhio buono] Il trentanove l'ho saltato, ma tanto tu non hai visto niente. Chi sei? Uno che vuole puntare sul derby?"],
          ["hero", "Uno che vuole sapere chi punzona i biglietti a stella."],
          ["mn_peppino", "[la pinza gli cade di mano. La raccoglie con calma esagerata] Biglietti? Io faccio il controllore in pensione. Colleziono biglietti. È un hobby. Come i francobolli."],
          ["hero", "De Santis della Squadra Mobile è qui fuori. Lui colleziona allibratori."],
          ["mn_peppino", "[si siede su un predellino] De Santis. Quel mastino. Va bene, va bene. Io sono una pedina, ragazzo. I soldi arrivano da La Lucciola, il night di via Torino. Li manda Mara, la cantante. Ma chi li dà a Mara… quello si chiama Don Carmine."],
          ["mn_peppino", "Tieni. Questo è un biglietto della corsa delle 22:45. Doppia punzonatura. Con questo, chi ha puntato giusto ritira i soldi. Fallo vedere a De Santis e lasciami in pace."],
        ], () => K.interroga("biglietto", { biglietti: 45, fiuto: 20, sospetto: 10 }, () => pepScelta(() => say([
          ["voce", "Fuori, dal piazzale, arrivano fischi e risate. Qualcuno ha acceso le luci del campetto e batte un pallone contro la rete di sacchi dei Ferrovieri."],
          ["mn_peppino", F.is("mn_pep_info") ? "Senti? La Banda dei Bastioni. Hanno visto che parlavi con me. Vogliono farti la festa, ma a pallone, che fa meno rumore." : "[dalla porta, in manette] Senti? La Banda dei Bastioni. Mi sa che volevano me. Adesso vogliono te."],
        ], () => { K.questDone("mn1_deposito"); K.setStep(N, 3); K.quest("mn1_banda", "La Banda dei Bastioni", "Raggiungi Nando al campetto e gioca contro la Banda dei Bastioni a Pedinamento Tattico."); K.done(); }))));
        return say([["mn_peppino", "Trentotto, quaranta… Non ho niente da dirti. Ho già detto troppo. Lo diceva anche mia madre: «Peppino, parli troppo». Poi è morta. Di chiacchiere, credo."]]);
      },
      mn_nando(K) {
        const s = S();
        if (s === 3) return K.ask("mn_nando", "Nando si infila i guanti di lana bucati sulle punte. «Sono in sei, noi due. Più quello lì in porta per loro, che ha le mani come badili. Giochiamo?»", [
          { label: "⚽ Gioca contro la Banda dei Bastioni", big: true, fn: () => K.ownMatch(window.__pedinamento.start, { opp: { name: "Banda dei Bastioni", kit: "#475569", names: ["Il Ciccio Piccolo", "Lo Sfregiato"] }, mate: { name: "Nando", skin: "#e8c39e", hair: "#2a1d14", shirt: "#7f1d1d" }, rain: true, mud: true, fog: 0.6, lights: 2, half: 35,
            halftime: "Intervallo. Lo Sfregiato si accende una sigaretta. Nando si soffia sulle mani e dice: «Non sono forti. Sono pagati. È diverso».",
            done: (r) => r.win ? say([
              ["mn_nando", "[ti salta addosso, fangoso fino alle orecchie] Hai visto?! Si fermavano al fischio lungo! Uno ha alzato il braccio per il fuorigioco mentre io avevo la palla in mano!"],
              ["mn_scotti", "Ho preso nota di tutto, Commissario. Anche dell'autogol, che non c'è stato, ma per sicurezza."],
            ], fin) : say([["mn_nando", "Ci hanno menato più di quanto ci hanno battuto. Rialzati: quelli come loro si stancano prima di quelli come noi."]]) }) },
          { label: "Un momento: prima mi preparo", fn: () => say([["mn_nando", "Fai pure. Io intanto riscaldo le mani. Le mani d'inverno sono la prima cosa che ti tradisce."]]) },
        ]);
        if (s < 3) return say([
          ["mn_nando", "Tu sei il nuovo! Nando Colombo, porta dei Ferrovieri. Di giorno scambista allo scalo Farini, di sera porta. La notte dormo, quando mi lasciano."],
          ["mn_nando", "Il sabato alleno i bambini qui al campetto. Hanno le scarpe di cartone e il cuore di cuoio. Vieni a vederli, una volta."],
          ["mn_nando", "[abbassa la voce] E se senti qualcuno che parla di me all'Osteria… non ci badare. Ho un piccolo conto da sistemare. Lo sistemo."],
        ], () => { K.rel && K.rel.add("mn_nando", 4); K.done(); });
        return say([["mn_nando", "Domenica giochiamo. Tu davanti, io dietro. In mezzo, la nebbia."]]);
      },
      // — le comparse dei Bastioni
      mn_scotti(K) {
        if (!F.is("mn_sc1")) { F.set("mn_sc1", true); return say([
          ["mn_scotti", "Brigadiere Scotti, Squadra Mobile. Lei è il giovane del Commissario? Ho preparato un fascicolo su di lei. Titolo: «Il giovane del Commissario»."],
          ["mn_scotti", "Domanda: il fuorigioco è un reato contro la persona o contro il patrimonio? Sto aggiornando il codice. Per conto mio."],
          ["hero", "È una regola del calcio, brigadiere."],
          ["mn_scotti", "[scrive] «È… una… regola». Interessante. Quindi niente arresto. Peccato: ne avevo già pronti tre."]], () => { K.bond("fiuto", 2); K.done(); }); }
        return say([["mn_scotti", ["Ho annotato il numero di targa del 19. È 19.", "Il Commissario non fuma, sa? Accende e basta. Io ho annotato anche questo. Pagina quattordici.", "Se vede movimenti sospetti, me lo dica. Se vede movimenti normali, me lo dica lo stesso: non so ancora distinguerli."][(K.frNow() >> 6) % 3]]]);
      },
      mn_brogio(K) {
        if (!F.is("mn_br1")) { F.set("mn_br1", true); return say([
          ["mn_brogio", "Ohè, giovanotto! Ambrogio, ma tutti mi chiamano el Brogio. Guido il 19 da ventidue anni. Lei sale?"],
          ["hero", "Cerco chi punzona i biglietti due volte."],
          ["mn_brogio", "[sputa di lato, con rispetto] Quelli lì. La pinza a stella non è dell'Azienda: l'Azienda punzona tondo. La stella la fa uno che il tram non lo guida: lo usa."],
          ["mn_brogio", "La corsa delle 22:45 è sempre piena di gente che non va da nessuna parte. Salgono al capolinea, scendono alla Darsena e tornano a piedi. Chi va alla Darsena a piedi alle undici di sera, d'inverno? Gente che ha vinto. O che deve pagare."],
          ["mn_brogio", "Tenga, un biglietto vero. Tondo. Per confronto. E se le chiedono chi gliel'ha dato, gliel'ha dato el tram."]], () => { K.bond("biglietti", 25); K.bond("fiuto", 6); K.done(); }); }
        return say([["mn_brogio", ["Il 19 non è mai in ritardo. È il resto di Milano che è in anticipo.", "Mia moglie dice che parlo più col tram che con lei. Ha ragione: il tram risponde meno.", "Ultima corsa alle 23:40. Dopo, Milano è di chi cammina."][(K.frNow() >> 6) % 3]]]);
      },
      mn_ines(K) {
        if (!F.is("mn_in1")) { F.set("mn_in1", true); return say([
          ["mn_ines", "[non alza gli occhi dal taccuino] Se è un'intervista, sono io che faccio le domande. Se è un appuntamento, ho già cenato. Se è un'informazione, dipende."],
          ["hero", "Sono il nuovo dei Ferrovieri."],
          ["mn_ines", "[alza gli occhi] Ah. Allora è un'informazione. Ines Ferrario, Corriere d'Informazione, pagina undici, quella dopo i necrologi."],
          ["mn_ines", "Ti dico una cosa gratis: ho i tabellini di trenta partite di quest'autunno. In nove, il portiere che ha preso gol al novantesimo ha comprato una lavatrice la settimana dopo. Nove lavatrici. Milano non è mai stata così pulita."],
          ["mn_ines", "Nessuno in redazione mi dà retta. Se scopri qualcosa, io scrivo. E se lo scrivo io, almeno qualcuno lo legge per sbaglio."]], () => { K.rel && K.rel.add("mn_ines", 5); K.bond("fiuto", 5); K.quest("mn_ines_pezzo", "Il pezzo di Ines", "Ines Ferrario vuole scrivere delle partite comprate. Portale le prove, quando le avrai."); K.done(); }); }
        return say([["mn_ines", ["Pagina undici. Sopra i necrologi. Diciamo che sono in buona compagnia.", "Il caporedattore dice che il calcio femminile non esiste. Io gli ho detto che nemmeno il calcio onesto, a Milano. Mi ha dato due settimane di Promozione.", "Hai visto Nando Colombo parare? Para come uno che ha paura di qualcos'altro."][(K.frNow() >> 6) % 3]]]);
      },
      mn_gaspare(K) {
        if (!F.is("mn_ga1")) { F.set("mn_ga1", true); return say([
          ["mn_gaspare", "Caldarroste! Calde, croccanti, e solo un po' bruciate, che è il segreto! Dieci lire il cartoccio, per lei cinque, ché ha la faccia di uno che non ha cenato."],
          ["hero", "Grazie. [scotta]"],
          ["mn_gaspare", "Le soffi, le soffi. Sa chi è il mio miglior cliente? Il Commissario. Ne compra un cartoccio ogni sera e non ne mangia una. Le dà ai bambini del campetto. Uomo strano. Buono, ma strano."]], () => { K.bond("biglietti", 10); K.rel && K.rel.add("mn_desantis", 3); K.done(); }); }
        return say([["mn_gaspare", ["Caldarroste! Le uniche cose a Milano che scottano e non sono scandali!", "D'estate? D'estate faccio il gelato a Rimini. Mi chiamano Gaspare dei Sorbetti. Sono un uomo stagionale.", "Quel Peppino lì mi ha chiesto se volevo puntare sul derby. Gli ho detto: io punto sulle castagne. Non perdono mai."][(K.frNow() >> 6) % 3]]]);
      },
      mn_celestino(K) {
        if (!F.is("mn_ce1")) { F.set("mn_ce1", true); return say([
          ["mn_celestino", "[alza la pertica, il lampione si accende con un soffio] Ecco. Un'altra luce che nessuno guarderà. Buonasera, forestiero."],
          ["mn_celestino", "Sa cos'è la nebbia? È la città che si vergogna di farsi vedere. Io le accendo le luci e lei si vergogna di più. È un rapporto difficile."],
          ["mn_celestino", "Ieri notte, alla stessa ora, ho visto due uomini portare una valigia dal Deposito verso via Torino. Pesava. Si fermavano ogni dieci lampioni. Io li conto, i lampioni."]], () => { K.bond("fiuto", 6); K.done(); }); }
        return say([["mn_celestino", ["«Nebbia: la città / che si vergogna. / Io le accendo la luce / e lei arrossisce.» Bolletta del gas, ottobre.", "Novantaquattro lampioni ai Bastioni. Dodici sono spenti. Uno è spento perché non vuole.", "Lei gioca a pallone? Io da giovane giocavo in porta. Poi ho capito che preferivo accendere le cose invece di fermarle."][(K.frNow() >> 6) % 3]]]);
      },
      mn_carlo(K) {
        if (!F.is("mn_ca1")) { F.set("mn_ca1", true); return say([
          ["mn_carlo", "[cala un sette bello con l'angolo piegato] Scopa. Giovanotto, lei gioca a scopa? No? Meglio. Chi gioca a scopa con me perde la camicia e la fiducia nel genere umano."],
          ["mn_carlo", "Ero capostazione a Porta Genova. Quarant'anni di fischietto. Il fischietto, sa, si riconosce dal suono come una voce. Ce ne sono di onesti e di bugiardi."],
          ["mn_carlo", "All'ultima partita dei Ferrovieri l'arbitro aveva un fischietto bugiardo. Basso, lungo. Come un treno merci che non vuole fermarsi. Me lo ricordo perché mi ha fatto venire nostalgia."]], () => { K.bond("fiuto", 8); K.done(); }); }
        return say([["mn_carlo", ["Scopa! [nessuno sta giocando con lui]", "Ai miei tempi i treni arrivavano in orario e gli arbitri fischiavano quello che vedevano. Ai miei tempi ero anche più alto.", "Il sette bello piegato? Si è piegato da solo. Nel '31."][(K.frNow() >> 6) % 3]]]);
      },
      mn_tino(K) {
        return say(F.is("mn_tp1") ? [["mn_tino", ["Il derby lo vinciamo noi. Lo dice la storia, lo dice la classifica, lo dice mia zia che ha il terzo occhio.", "Pinin ha il cervello a righe come la maglia. Rosso e nero: confuso.", "Se il derby è comprato, l'hanno comprato loro. Noi siamo troppo eleganti per comprare. Noi ereditiamo."][(K.frNow() >> 6) % 3]]] : [
          ["mn_tino", "Lei è dei Ferrovieri? Bravo. Squadra onesta, maglia brutta. Io sono nerazzurro dal '29, ragioniere al catasto, e non ho mai sbagliato un pronostico."],
          ["mn_pinin", "Mai sbagliato? Ha detto che la guerra finiva nel '41!"],
          ["mn_tino", "Era un pronostico politico, non sportivo. Non conta."],
          ["mn_pinin", "Giovanotto, non gli dia retta. Il derby lo vinciamo noi, che siamo gente che lavora. Loro sono gente che timbra."],
          ["mn_tino", "Timbrare È lavorare!"]], () => { F.set("mn_tp1", true); K.bond("biglietti", 5); K.done(); });
      },
      mn_pinin(K) {
        return say(F.is("mn_tp1") ? [["mn_pinin", ["Tino lo conosco dal '38. Litighiamo ogni sera. Se lui si ammala, io non bevo. È amicizia, ma non glielo dica.", "Alla Pirelli facciamo le gomme. Io faccio quelle che durano. Lui fa i timbri che durano. Siamo pari.", "Il derby? Se è comprato, allora non lo guardo. Lo ascolto alla radio: alla radio non si vede chi si vende."][(K.frNow() >> 6) % 3]]] : [
          ["mn_pinin", "Pinin, Pirelli, rossonero dalla nascita. Mia madre mi ha battezzato in Duomo con la sciarpa."],
          ["mn_tino", "E il prete ha chiesto il rimborso."],
          ["mn_pinin", "Giovanotto, una cosa seria: al campetto dei Ferrovieri girano facce nuove. Facce che non tifano. Chi non tifa, a una partita, è lì per lavoro."]], () => { F.set("mn_tp1", true); K.bond("fiuto", 4); K.done(); });
      },
    };

    return { n: N, title: "La Nebbia sui Bastioni", sub: "Porta Ticinese, l'allibratore del tram e la prima scelta", goal, start: "mn_bastioni", introBg: "mn_titolo", zones, talk,
      intro: () => [["voce", "Milano, novembre 1954. Una fitta nebbia d'autunno copre i Bastioni di Porta Ticinese."], ["voce", "I tram cigolano sulle rotaie umide. Nei retrobottega si decide il calcio della domenica. E tu sei appena sceso dal treno."]] };
  }

  boot();
})();
