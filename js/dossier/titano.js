// js/dossier/titano.js - DOSSIER INCOMPIUTI di «Il Figlio del Titano»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Nora Varo, la madre. Cap. 4 «Vent'anni di silenzio», cap. 5 «La panchina della Terra».
(function () {
  "use strict";
  const NORA = { name: "Nora Varo", num: 5, cast: { name: "Nora Varo", sub: "La moglie del Titano", style: "bob", hair: "#8a3a2a", eye: "#3a5a3a", skin: "#f0d0b0", shirt: "#3a8a5a", acc: ["fischietto"] } };
  const BORDER = (w, h) => [["lay", 0, 0, w - 1, 0, "t"], ["lay", 0, h - 1, w - 1, h - 1, "a"], ["lay", 0, 0, 0, h - 1, "t"], ["lay", w - 1, 0, w - 1, h - 1, "t"]];
  window.__dossierDati.add({
    saga: "titano", after: 3,
    chapters: [
      {
        n: 4, title: "Vent'anni di silenzio", sub: "Dossier Incompiuto: la notte prima della Grande Raccolta, dal punto di vista di Nora",
        avatar: NORA, start: "ft_retro", introBg: "ft_citta",
        intro: [["ft_nora", "Vent'anni che so chi ho sposato. Vent'anni che non lo dico a nessuno. Stasera il cielo si è riacceso, e io ho ancora una torta in forno."]],
        goal: { 0: "Sam ti aspetta nel piazzale dietro Varo Sport.", 1: "Il deposito del negozio, la porta in alto: la cassa di Atlante.", 2: "Atlante è nel piazzale. Digli quello che hai deciso." },
        goalDone: "Il Dossier continua: puoi aprire il Capitolo 5.",
        cast: {},
        zones: {
          ft_retro: {
            region: "citta", name: "Dossier Titano · Il retro di Varo Sport", short: "Il retro del negozio", sub: "Altamira, notte, un cielo che si è riacceso", bg: "ft_citta", time: "notte", travel: [14, 18],
            w: 28, h: 20, start: [14, 18], areas: [[0, 0, 27, 19, "Il retro di Varo Sport"]],
            flavor: { t: "Un albero con un pallone incastrato tra i rami da vent'anni. Atlante dice che lo recupera domani." },
            intro: [["voce", "Il retro di Varo Sport: cassette di palloni, un lampione che balla, e in fondo la porta del deposito. Sopra Altamira, tra le nuvole, c'è una luce che non è una stella."]],
            npcs: [{ id: "ft_sam", at: [10, 14] }, { id: "ft_atlante", at: [18, 8], when: { step: 2 } }],
            layout: [...BORDER(28, 20), ["lay", 13, 4, 15, 18, ":"], ["lay", 3, 12, 24, 13, ":"], ["house", 10, 1, 8, 3, { door: [14, 3], roof: "#8a6a3a", wall: "#e8dcc8", rr: 2, enter: { to: "ft_deposito", at: [8, 9] } }]],
            trees: [[2, 3], [25, 3], [2, 16], [25, 16], [7, 8], [20, 8]],
          },
          ft_deposito: {
            interior: true, region: "casa", name: "Dossier Titano · Il deposito", short: "Il deposito", sub: "Dove sta quello che non è in vetrina", bg: "ft_casa", w: 16, h: 12, start: [8, 9], outside: ["ft_retro", 14, 4],
            act: { L: "Apri la cassa di Atlante", v: "Esci" },
            flavor: { L: "Una cassa di legno chiusa con un lucchetto che non è mai stato chiuso a chiave. Sul coperchio, scritto a pennarello: «NON APRIRE. Ti voglio bene, Nora»." },
            intro: [["voce", "Il deposito: scaffali di scarpe, una pila di maglie con il numero 1 e, in fondo, una cassa di legno scuro."]],
            npcs: [],
            layout: [["lay", 0, 0, 15, 11, "+"], ["lay", 0, 0, 15, 0, "a"], ["lay", 0, 0, 0, 11, "a"], ["lay", 15, 0, 15, 11, "a"], ["lay", 0, 11, 15, 11, "a"], ["put", 8, 11, "v"], ["lay", 6, 3, 8, 3, "L"], ["lay", 2, 5, 4, 5, "T"], ["lay", 11, 5, 13, 5, "T"]],
          },
        },
        talk: {
          ft_sam: [
            { when: { step: 0 }, do: [
              { say: [["ft_sam", "[pensa] Signora Varo, i radar dell'Agenzia sono impazziti. Una nave sopra Altamira, tra tre giorni. Atlante non risponde al telefono."], ["ft_nora", "[felice] Non risponde mai, quando ha paura. (Posa il canovaccio.) Torna in ufficio, Sam. Questa è una faccenda di famiglia."]] },
              { quest: ["ft_nora_cassa", "La cassa di Atlante", "Il deposito di Varo Sport, la porta in alto."] }, { step: 1 }, { done: true },
            ] },
            { when: { step: [1, 3] }, do: [{ say: [["ft_sam", "Io tengo la linea con l'Agenzia. Voi due… beh, voi due parlate. Fa bene."]] }] },
          ],
          ft_atlante: [
            { when: { step: 2 }, do: [
              { ask: { who: "ft_atlante", prompt: "Nora. Lo so che hai aperto la cassa. Il mantello, le lettere di Elyon, la data della Raccolta. Vent'anni che aspetto che tu me lo chieda. Chiedimelo adesso.", secs: 10, def: 2, options: [
                { label: "«Resta. Il cielo può aspettare»", sub: "Non vuoi che parta", big: true, do: [{ flag: { ft_nora_resta: true } }, { call: "chiudi" }] },
                { label: "«Vai. Ma torni a cena»", sub: "Lo lasci andare, con una condizione", big: true, do: [{ flag: { ft_nora_cena: true } }, { call: "chiudi" }] },
                { label: "(Non rispondi. Gli stringi la mano)", sub: "Il silenzio dice tutto", do: [{ flag: { ft_nora_silenzio: true } }, { call: "chiudi" }] },
              ] } },
            ] },
          ],
        },
        obj: {
          "ft_deposito:L": [
            { when: { step: 1 }, do: [
              { say: [["voce", "Il lucchetto non è chiuso. Dentro: un mantello rosso e oro, tre lettere con un francobollo che non esiste, e una foto di te, vent'anni fa, mentre ridi senza sapere di essere guardata dal cielo."], ["ft_nora", "[pensa] Lo sapevo. Lo so da quando mi ha chiesto di sposarlo saltando sul tetto. (Chiude la cassa piano.) Non lo ha mai detto lui. L'ho detto io, senza dirlo."]] },
              { trial: { title: "Le lettere di Elyon", bg: "ft_casa", secs: 8, need: 2, rounds: [
                { prompt: "Prima lettera: Atlante racconta perché è venuto sulla Terra. Cosa dice?", options: [{ label: "«Cercavo una casa»", ok: true }, { label: "«Cercavo un trofeo»" }, { label: "«Mi ero perso»" }], good: "Vero. Lo scrive due volte.", bad: "No. Non era quello." },
                { prompt: "Seconda lettera: cosa ha scritto sul giorno del vostro matrimonio?", options: [{ label: "«Ho saltato troppo in alto»" }, { label: "«Sono atterrato»", ok: true }, { label: "«Non c'ero»" }], good: "Ride ancora, da un pianeta lontano.", bad: "Sbagliato. Ma quasi." },
                { prompt: "Terza lettera: ti chiede di non dire a nostro figlio che…", options: [{ label: "…che il padre vola", ok: true }, { label: "…che c'è una torta" }, { label: "…che è tardi" }], good: "E tu hai tenuto il segreto per entrambi.", bad: "Non è questo." },
              ], win: [{ flag: { ft_nora_lettere: true } }, { say: [["ft_nora", "[felice] Le ricordo tutte. Le ho lette trent'anni fa, di nascosto, e le ho rimesse a posto con la stessa piega."]] }, { step: 2 }, { quest: ["ft_nora_cassa", "La cassa di Atlante", "Atlante è nel piazzale: digli quello che hai deciso."] }, { done: true }],
                lose: [{ say: [["ft_nora", "[pensa] Le lettere sono tante, e il tempo poco. (Le rimette nella cassa.) Va bene lo stesso: lo ricordo meglio di come lo ricordino le lettere."]] }, { step: 2 }, { quest: ["ft_nora_cassa", "La cassa di Atlante", "Atlante è nel piazzale: digli quello che hai deciso."] }, { done: true }] } },
            ] },
            { when: { step: [2, 5] }, do: [{ say: [["voce", "La cassa è chiusa. Sul coperchio, il pennarello: «Ti voglio bene, Nora». Stavolta ti sembra più grande."]] }] },
          ],
        },
        blocks: {
          chiudi: [
            { step: 3 }, { bond: ["famiglia", 3] }, { finish: "dossier_c4" }, { reward: { key: "ft_c4_dossier", give: { coins: 180 } } },
            { scene: [["ft_atlante", "[felice] Ho girato cento pianeti, Nora. La torta è il posto migliore. (Si china, ti bacia la fronte.) Domani, qualunque cosa succeda, torno per cena."], ["voce", "<b>CAPITOLO 4 DEL DOSSIER CONCLUSO</b> {reward}"]], openMain: true, bg: "ft_citta" },
          ],
        },
      },
      {
        n: 5, title: "La panchina della Terra", sub: "Dossier Incompiuto: la Partita del Cielo vista dalla panchina, dal punto di vista di Nora",
        avatar: NORA, start: "ft_panchina", introBg: "ft_arena",
        intro: [["ft_nora", "Ho allenato mille squadre. Mai una in cui il centravanti sapesse volare, il capitano fosse mio marito e l'avversario venisse da un altro pianeta."]],
        goal: { 0: "Il Gran Maestro Orione aspetta al centro del campo di nuvole.", 1: "Parla con Atlante: è ora di mandarlo a volare.", 2: "La Terra ha vinto. Parla con Atlante e scegli come finisce." },
        goalDone: "Il Dossier del Titano è concluso.",
        cast: {},
        zones: {
          ft_panchina: {
            region: "cielo", name: "Dossier Titano · La panchina della Terra", short: "La panchina", sub: "Il campo di nuvole, sopra Altamira", bg: "ft_arena", time: "notte", travel: [14, 16],
            w: 28, h: 18, start: [14, 16], areas: [[0, 0, 27, 17, "La panchina della Terra"]],
            intro: [["voce", "Il campo di nuvole, visto dal bordo: la panchina della Terra è una vecchia cassa di palloni con un cuscino, portata da casa. Dall'altra parte, la delegazione viola di Elyon."]],
            npcs: [{ id: "ft_orione", at: [14, 7] }, { id: "ft_atlante", at: [8, 12] }, { id: "ft_vega", at: [20, 12] }],
            layout: [["lay", 0, 0, 27, 0, "C"], ["lay", 0, 17, 27, 17, "C"], ["lay", 0, 0, 0, 17, "C"], ["lay", 27, 0, 27, 17, "C"], ["lay", 1, 1, 26, 16, "&"], ["lay", 14, 2, 14, 15, "&"]],
          },
        },
        talk: {
          ft_orione: [
            { when: { step: 0 }, do: [
              { ask: { who: "ft_orione", prompt: "[pensa] Signora Varo. Sulla Terra le allenatrici non scendono in campo. Sul mio pianeta, nemmeno. Il regolamento prevede un riscaldamento tra panchine: tre scelte di formazione, otto secondi ciascuna. Giocate?", options: [
                { label: "Fai il riscaldamento tattico", sub: "3 scelte a tempo · premio: Atlante in forma", cls: "hot", big: true, do: [
                  { trial: { title: "Il riscaldamento", bg: "ft_arena", secs: 8, need: 2, rounds: [
                    { prompt: "Elyon preme alto. Come schieri la Terra?", options: [{ label: "Linea bassa, ripartenza", ok: true }, { label: "Tutti avanti" }, { label: "Tutti in difesa" }], good: "Tiene.", bad: "Si scopre." },
                    { prompt: "Vega vola sulla fascia. Chi la marca?", options: [{ label: "Sam, a terra, con la testa", ok: true }, { label: "Nessuno" }, { label: "Atlante, subito" }], good: "Sam capisce i voli prima di vederli.", bad: "Vega ringrazia." },
                    { prompt: "Atlante è stanco. Che fai?", options: [{ label: "Lo cambi" }, { label: "Gli dici «torni a cena»", ok: true }, { label: "Lo ignori" }], good: "Gli torna l'energia di un ventenne.", bad: "Non basta." },
                  ], win: [{ flag: { ft_nora_forma: true } }, { say: [["ft_orione", "[sorpreso] Tre su tre. (Segna qualcosa sul regolamento.) Su Elyon, una panchina così avrebbe un trofeo."]] }, { step: 1 }, { done: true }],
                    lose: [{ say: [["ft_orione", "[pensa] Non male, signora. Ma i voli si leggono meglio dall'alto."]] }, { step: 1 }, { done: true }] } },
                ] },
                { label: "Salta il riscaldamento", sub: "Si va dritti alla fine", do: [{ say: [["ft_nora", "[furbo] Allenatrice da vent'anni: la partita la leggo già dalla panchina."]] }, { step: 1 }, { done: true }] },
              ] } },
            ] },
            { when: { step: [1, 3] }, do: [{ say: [["ft_orione", "[pensa] Elyon non ha mai avuto una panchina così. Né un marito così… a casa. (Si ferma.) Questo non lo scrivo."]] }] },
          ],
          ft_atlante: [
            { when: { step: [0, 1] }, do: [
              { ask: { who: "ft_atlante", prompt: "Nora, lì in panchina sei più forte di me in campo: lo dico da vent'anni. Pronta a mandarmi a volare?", options: [
                { label: "Manda Atlante in campo", sub: "Volo a Tutto Campo · la Partita del Cielo", cls: "hot", big: true, when: { step: 1 }, do: [
                  { engine: { name: "volo", opts: { title: "Volo a Tutto Campo · La panchina di Nora", oppStyle: "pressing", minutes: 90, energy: 120, mates: [{ name: "Atlante" }, { name: "Sam" }],
                    opp: { name: "Elyon", color: "#7a5ad8", players: [{ name: "Orione", skin: "#e8d8f0", hair: "#e8e8f8" }, { name: "Vega", skin: "#d9a679", hair: "#2a1a14" }], keeper: { name: "La Stella Fissa" } },
                    intro: "<p>Nora è in panchina, Atlante vola per lei: le traiettorie le disegna <b>lei</b>, il resto lo fa il Titano. Orione fa <b>pressing</b>.</p>", winTitle: "LA TERRA RESTA DELLA TERRA!" },
                    win: [{ step: 2 }, { say: [["ft_orione", "[sorpreso] La panchina vince la Partita del Cielo. (Abbassa la bandiera viola.) Una cosa che su Elyon non avevamo calcolato."]] }, { done: true }],
                    lose: [{ say: [["ft_orione", "[pensa] Pari. Una partita pari si rigioca. Ma la panchina, signora, è la migliore che abbia visto."]] }, { done: true }] } },
                ] },
                { label: "Prima parla con Orione", sub: "Il Gran Maestro è al centro", when: { step: 0 }, do: [{ say: [["ft_atlante", "Va bene. Ti aspetto qui, con il mantello nella borsa."]] }] },
              ] } },
            ] },
            { when: { step: 2 }, do: [
              { ask: { who: "ft_atlante", prompt: "Nora. Ho giocato come mi hai detto tu. Adesso decidi tu come finisce questa storia.", options: [
                { label: "«La Terra resta nostra. Torniamo a cena»", sub: "Finale: La cena è servita", big: true, do: [{ call: "finale_cena" }] },
                { label: "«Allenerò anche Elyon. Una panchina per due mondi»", sub: "Finale: La panchina dei due mondi", big: true, do: [{ call: "finale_mondi" }] },
              ] } },
            ] },
          ],
          ft_vega: [{ do: [{ say: [["ft_vega", "[ride] Nora Varo: nome più forte del mio pianeta. Dopo il fischio, mi insegni il suo schema?"]] }] }],
        },
        obj: {},
        endings: {
          nora_cena: ["LA CENA È SERVITA", "Dossier Incompiuto: Nora tiene la Terra dalla panchina, e alla fine di tutto c'è ancora una torta sul tavolo, un piatto enorme e un posto per ogni mondo che vuole sedersi.", "Nel Dossier, scegli la cena."],
          nora_mondi: ["LA PANCHINA DEI DUE MONDI", "Dossier Incompiuto: Nora accetta di allenare Elyon e la Terra insieme, con una sola panchina, una sola cassa di palloni e una regola: nessuno vola finché non ha mangiato.", "Nel Dossier, scegli di allenare Elyon."],
        },
        blocks: {
          finale_cena: [
            { end: "nora_cena" }, { unlock: "ft_nora" }, { finish: "nora_cena" }, { step: 3 }, { reward: { key: "end:nora_cena", give: { coins: 300 } } },
            { scene: [["ft_nora", "[felice] La Terra non si lascia a nessuno, Orione. Ma a cena puoi venire anche tu."], ["ft_orione", "[sorpreso] (Posa la bandiera viola, lentamente.) Sul mio pianeta non esiste la cena. Dev'essere una specie di tregua."], ["voce", "<b>DOSSIER CONCLUSO: LA CENA È SERVITA!</b> {reward}<br>Hai sbloccato la carta <b>«Nora Varo»</b> nella Squadra dei Sogni!"]], openMain: true, bg: "ft_arena" },
          ],
          finale_mondi: [
            { end: "nora_mondi" }, { unlock: "ft_nora" }, { finish: "nora_mondi" }, { step: 3 }, { reward: { key: "end:nora_mondi", give: { coins: 300 } } },
            { scene: [["ft_nora", "[furbo] Una panchina, due squadre. E i voli, da oggi, li allenate con me."], ["ft_vega", "[felice] Elyon ha una nuova allenatrice. (Si inchina.) E la Terra ha un nuovo cielo."], ["voce", "<b>DOSSIER CONCLUSO: LA PANCHINA DEI DUE MONDI!</b> {reward}<br>Hai sbloccato la carta <b>«Nora Varo»</b> nella Squadra dei Sogni!"]], openMain: true, bg: "ft_arena" },
          ],
        },
      },
    ],
  });
})();
