// js/dossier/razzo.js - DOSSIER INCOMPIUTI di «Razzopacco · Consegne dal Futuro»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Orsola Monòpoli, la padrona della OmniPacco. Cap. 4 «Nove anni fa, in ritardo» (3002: il suo primo giorno
// da corriere, alla Razzopacco), cap. 5 «Il campetto al lato buio» (3011: la notte dopo la finale persa).
// Minigiochi: la prova a tempo «Il colloquio», la CONSEGNA A TEMPO della saga (K.pacco / K.consegnato), la partita CONSEGNA A RETE.
(function () {
  "use strict";
  const LOOK = { name: "Orsola Monòpoli", style: "side", hair: "#c83a2a", eye: "#3a3a5a", skin: "#f0d0b0", acc: ["fischietto"] };
  const ORSOLA_3002 = { name: "Orsola Monòpoli", num: 9, cast: Object.assign({ sub: "Corriere Razzopacco, primo giorno", shirt: "#ff8a3a" }, LOOK) };
  const ORSOLA_3011 = { name: "Orsola Monòpoli", num: 9, cast: Object.assign({ sub: "La padrona della OmniPacco", shirt: "#5a6ad8" }, LOOK) };
  const BORDER = (w, h) => [["lay", 0, 0, w - 1, 0, "a"], ["lay", 0, h - 1, w - 1, h - 1, "a"], ["lay", 0, 0, 0, h - 1, "a"], ["lay", w - 1, 0, w - 1, h - 1, "a"]];
  const ROOM = (w, h, exitX) => [["lay", 0, 0, w - 1, h - 1, "+"], ["lay", 0, 0, w - 1, 0, "a"], ["lay", 0, 0, 0, h - 1, "a"], ["lay", w - 1, 0, w - 1, h - 1, "a"], ["lay", 0, h - 1, w - 1, h - 1, "a"], ["put", exitX, h - 1, "v"]];
  window.__dossierDati.add({
    saga: "razzo", after: 3,
    // ospite al Borgo e mazzo delle Carte del Destino: compaiono quando trovi un finale del Dossier
    guest: { id: "rz_orsola", saga: "Razzopacco · Il Dossier di Orsola", ends: ["orsola_campetto", "orsola_domenica"], lines: [["rz_orsola", "[pensa] Borgo Marino, 2025. Il campetto accanto al vostro. (Soffia nel fischietto di plastica: fa un fischio piccolo.) Nel 3011 l'ho cercato per nove anni. Era qui. E non era in vendita: c'era solo da venirci a giocare."]] },
    deck: {
      id: "rzo", t: "Il Dossier di Orsola", e: "📦", ends: ["orsola_campetto", "orsola_domenica"], lock: "Trova un finale del Dossier di Razzopacco",
      d: "Una padrona della galassia che fischia ancora in un fischietto di plastica.",
      pg: { id: "rz_nina", n: "Nina Sfiato", i: "⚽", tr: "cuore", d: "Da bambina aspettava un pallone in ritardo. Da grande gioca da sola su un campetto che nessuno sa che esiste.", greet: "Un campetto a {a}? (Si lega i capelli.) Tu porta il pallone. Se arrivi in ritardo, ti aspetto lo stesso.", win: "Gol! Come quando avevo nove anni. Solo che stavolta qualcuno ha visto.", lose: "Fa niente. Il campetto resta qui: domani si rigioca." },
      ev: { n: "La Busta Paga in Ritardo", i: "✉️", d: "Nove buste paga mai ritirate, in un cassetto della Razzopacco.", setup: ["Nel cassetto della Professoressa ci sono nove buste paga, una per anno. Tutte intestate a una corriere che si è licenziata nel 3002.", "Le dimissioni non le ha mai timbrate nessuno. Quindi tecnicamente lavora ancora qui. Che facciamo?"],
        ch: [["Consegnale di persona", "audacia", "Anche alla torre più alta.", "Sali in cima alla torre e posi le buste sulla scrivania di vetro. Lei le guarda a lungo, poi ne apre una: dentro c'è anche un biglietto. Sorride.", "La segreteria ti rimbalza sei volte. Alla settima lasci le buste all'ingresso, con un post-it."], ["Leggi il modulo", "furbizia", "C'è sempre una clausola.", "Clausola 12: «Il dipendente può tornare quando vuole, anche in ritardo». Timbro la firma subito, in verde chiarissimo.", "Il modulo è scritto in moduli. Ti arrendi a pagina tre."], ["Lasciale nel cassetto", "cuore", "Certe cose arrivano da sole.", "Una domenica mattina il cassetto è vuoto, e alla Razzopacco c'è una corriere in più, con la tuta stretta e un fischietto al collo.", "Le buste restano lì un altro anno. Diventano dieci. Nessuno se la sente di toccarle."]] },
      tw: { n: "Consegna in Ritardo", i: "⏰", d: "Arriva tardi, ma arriva.", win: "Arriva tardi ma con gli interessi: il premio sale.", lose: "Arriva così tardi che il premio, nel frattempo, si è un po' sgonfiato.", mulWin: 1.3, mulLose: 0.85 },
    },
    chapters: [
      {
        n: 4, title: "Nove anni fa, in ritardo", sub: "Dossier Incompiuto: il 3002, il primo giorno di lavoro di Orsola Monòpoli",
        avatar: ORSOLA_3002, start: "rz_o_molo", introBg: "rz_crio",
        intro: [["voce", "<b>DOSSIER INCOMPIUTO · RAZZOPACCO</b>. Nova Frattaglia, anno 3002. Nove anni prima che tu ti svegliassi."], ["rz_orsola", "[pensa] Mi sono addormentata nel 2025, in una cella frigorifera, dopo un allenamento finito male. Mi hanno scongelata stamattina. Ho un fischietto, una tuta, e nessuno al mondo che si ricordi il mio nome."]],
        goal: { 0: "Un robot postino ti aspetta davanti al Criogenico.", 1: "La Razzopacco, oltre il ponte: «Si assume. Qualsiasi cosa».", 2: "Prima consegna: un pallone per una bambina, al campetto oltre il ponte. In fretta.", 3: "Al campetto c'è un impiegato di banca con un'offerta.", 4: "Torna alla Razzopacco. La Professoressa vuole parlarti." },
        goalDone: "Il Dossier continua: puoi aprire il Capitolo 5.",
        cast: {
          rz_nina: { name: "Nina Sfiato", desc: "Figlia dei Fratelli Sfiato, quelli dei tubi pneumatici. Nel 3002 ha nove anni e aspetta un pallone. Nel 3011 ne ha diciotto e gioca da sola, di notte, su un campetto che non dovrebbe esistere.",
            look: { style: "bob", hair: "#3ae8c8", eye: "#3a2a1a", skin: "#e0ac7e", shirt: "#c8a040", acc: ["cappellino"], bg: ["#1a1030", "#3ae8c8"] } },
        },
        cos: { rz_d_tuta: { kind: "shirt", label: "Tuta Razzopacco del 3002", val: "#e86a2a", from: "Dossier di Razzopacco · Capitolo 4" } },
        lore: { l_orsola_3002: { t: "Il primo giorno di Orsola", d: "Nel 3002 Orsola Monòpoli lavorò alla Razzopacco per un giorno solo. Consegnò un pallone, vide chiudere un campetto e firmò le dimissioni. La Professoressa non le ha mai timbrate." } },
        zones: {
          rz_o_molo: {
            region: "citta", name: "Dossier Razzopacco · Nova Frattaglia, 3002", short: "Nova Frattaglia, 3002", sub: "Il ponte sul canale, la vecchia Razzopacco, il campetto", bg: "rz_citta", time: "tramonto", travel: [4, 7],
            w: 32, h: 22, start: [4, 7], areas: [[19, 13, 30, 20, "Il campetto dei Fratelli Sfiato"], [18, 1, 30, 12, "La vecchia Razzopacco"], [0, 0, 31, 21, "Nova Frattaglia, 3002"]],
            flavor: { t: "Un albero sintetico nuovo di zecca: ha ancora il cartellino del prezzo.", l: "Un lampione che ti saluta per nome. Il tuo nome non lo conosce nessuno, quindi tira a indovinare: «Buonasera, Gertrude».", n: "Un cartello appeso alla rete del campetto: «VENDESI. Rivolgersi alla Banca del Tubo». Sotto, scritto col gesso da una mano piccola: «NO»." },
            intro: [["voce", "Nova Frattaglia, 3002. Il canale di neon c'è già, i tubi pneumatici no: li stanno montando. Per attraversare il canale c'è ancora un ponte di ferro, e la gente cammina. Si lamenta, ma cammina."], ["voce", "Oltre il ponte, la Razzopacco: allora era una ditta di tre persone e un robot. E più in là, un campetto vero, con la rete bucata e le porte storte."]],
            npcs: [{ id: "rz_ferruccio", at: [6, 8], when: { step: [0, 1] } }, { id: "rz_nina", at: [24, 16], when: { step: [2, 3] } }, { id: "rz_zeta", at: [27, 12], when: { step: 3 } }],
            layout: [...BORDER(32, 22), ["lay", 15, 1, 16, 20, "w"], ["lay", 15, 10, 16, 11, "_"],
              ["lay", 4, 6, 4, 12, ":"], ["lay", 4, 10, 14, 11, ":"], ["lay", 17, 10, 30, 11, ":"], ["lay", 21, 6, 21, 9, ":"], ["lay", 24, 12, 24, 13, ":"],
              ["house", 2, 2, 6, 4, { door: [4, 5], roof: "#7ad8ff", wall: "#c8d8f0", rr: 2, enter: "Il Criogenico Municipale. Dentro, la tua cella è ancora aperta, con l'impronta della tua testa nella brina. Un'infermiera robot la sta già affittando a un altro." }],
              ["house", 9, 2, 4, 3, { door: [10, 4], roof: "#ff5aa8", wall: "#3a3a5a", rr: 1, enter: "Un negozio che vende «ricordi del passato»: un telefono a conchiglia, un tostapane, una figurina di un calciatore del 2024. Prezzo della figurina: una casa." }],
              ["house", 19, 2, 6, 4, { door: [21, 5], roof: "#ff8a3a", wall: "#e8d8c0", rr: 2, enter: { to: "rz_o_sede", at: [7, 9] } }],
              ["lay", 19, 14, 29, 19, "-"], ["put", 20, 13, "n"],
              ["put", 25, 7, "K"], ["put", 26, 7, "K"], ["put", 8, 14, "A"], ["put", 29, 8, "Y"], ["put", 3, 12, "s"], ["put", 18, 12, "s"],
              ["put", 6, 10, "l"], ["put", 23, 12, "l"], ["put", 11, 12, "l"]],
            trees: [[7, 17], [11, 19], [12, 15], [9, 7], [30, 13], [2, 16], [27, 3], [6, 19]],
          },
          rz_o_sede: {
            interior: true, region: "interno", name: "Dossier Razzopacco · La sede, 3002", short: "La Razzopacco, 3002", sub: "Tre scrivanie, un robot, una Professoressa", bg: "rz_sede", w: 16, h: 12, start: [7, 9], outside: ["rz_o_molo", 21, 6],
            act: { K: "Guarda i pacchi", T: "Guarda la scrivania", L: "Guarda la bacheca", v: "Esci" },
            flavor: { T: "La scrivania della Professoressa. Un cassetto ha un'etichetta scritta a mano: «MODULI DA NON TIMBRARE». È vuoto. Per ora.", L: "La bacheca: «Dipendente del mese: Ferruccio». «Dipendente del mese scorso: Ferruccio». «Dipendente del mese prossimo: probabilmente Ferruccio»." },
            intro: [["voce", "La sede della Razzopacco, nove anni prima: le stesse pile di pacchi, meno toppe sulle pareti. La Professoressa ha gli stessi occhiali e, a quanto pare, la stessa età."]],
            npcs: [{ id: "rz_ottavia", at: [7, 5] }, { id: "rz_timbro", at: [12, 6] }],
            layout: [...ROOM(16, 12, 7), ["lay", 5, 3, 9, 3, "T"], ["lay", 11, 1, 13, 1, "L"], ["put", 2, 9, "K"], ["put", 13, 9, "K"], ["put", 2, 3, "K"]],
          },
        },
        talk: {
          rz_ferruccio: [
            { when: { step: 0 }, do: [
              { say: [["rz_ferruccio", "[felice] BIP. Benvenuta nel 3002, signora scongelata. Gusto: fragola? (Ti annusa.) No. Gusto: persona. Mi scusi, sono nuovo. Modello FR-11, uscito di fabbrica martedì."], ["rz_orsola", "[pensa] Un robot postino. Nel 2025 avevamo il postino Gino. Anche lui faceva «bip» quando arrivava, ma col campanello della bici."], ["rz_ferruccio", "Lei ha bisogno di un lavoro. Tutti gli scongelati hanno bisogno di un lavoro. Oltre il ponte c'è la Razzopacco: «Si assume. Qualsiasi cosa». Anche lei, che è qualsiasi cosa."]] },
              { quest: ["rz_o_lavoro", "Un lavoro nel 3002", "La Razzopacco, oltre il ponte sul canale."] }, { step: 1 }, { done: true },
            ] },
            { when: { step: 1 }, do: [{ say: [["rz_ferruccio", "Il ponte è di ferro. Fra qualche anno lo tolgono e mettono i tubi. Dicono che la gente cammina troppo. (Pausa.) Io non cammino. Rotolo. Sono avanti."]] }] },
          ],
          rz_ottavia: [
            { when: { step: 1 }, do: [
              { say: [["rz_ottavia", "[felice] Una scongelata! Del 2025! (Si aggiusta gli occhiali.) Il 2025 è un'annata ottima: gente che sa camminare, aspettare, e telefonare senza motivo. Si sieda. Il colloquio è breve: tre domande, otto secondi l'una. Il tempo di una consegna urgente."]] },
              { trial: { title: "Il colloquio alla Razzopacco", bg: "rz_sede", secs: 8, need: 2, rounds: [
                { who: "rz_ottavia", prompt: "Un pacco con scritto «FRAGILE» cade dal razzo. Che fa?", options: [{ label: "Lo prendo al volo, di testa" }, { label: "Lo stoppo di petto e lo rimetto a bordo", ok: true }, { label: "Lo guardo cadere con dignità" }], good: "Di petto! Una calciatrice. Lo sentivo.", bad: "Mh. Il pacco ringrazia lo stesso." },
                { who: "rz_ottavia", prompt: "Il destinatario non è in casa. Cosa fa?", options: [{ label: "Lascio un biglietto e torno domani", ok: true }, { label: "Lo lascio al vicino antipatico" }, { label: "Me lo tengo" }], good: "Domani! Lei capisce la filosofia della ditta.", bad: "No, no. Da noi i pacchi tornano. Tutti. Prima o poi." },
                { who: "rz_ottavia", prompt: "Ultima: perché vuole lavorare qui?", options: [{ label: "«Perché siete i più veloci»" }, { label: "«Perché pagate bene»" }, { label: "«Perché non conosco nessuno, e voi conoscete tutti»", ok: true }], good: "[triste] (Si toglie gli occhiali.) È la risposta giusta. È anche la più triste che abbia sentito quest'anno.", bad: "[ride] Veloci? Noi? Signora, il nostro motto è «prima o poi»." },
              ], win: [{ flag: { rz_o_colloquio: true } }, { call: "assunta" }], lose: [{ call: "assunta" }] } },
            ] },
            { when: { step: [2, 3] }, do: [{ say: [["rz_ottavia", "Il pallone per la piccola Sfiato! Il campetto è oltre il ponte, a sud. Corra! (Pausa.) Cioè: noi non corriamo mai. Ma lei è nuova, può ancora."]] }] },
            { when: { step: 4 }, do: [
              { ask: { who: "rz_ottavia", prompt: "(Ha davanti un foglio: «MODULO DI DIMISSIONI». La tua firma c'è già.) Un giorno solo, signora Monòpoli. Il record della ditta era tre. Me lo spiega, prima che lo dia a Timbro?", secs: 12, def: 1, options: [
                { label: "«Non voglio più arrivare tardi. Mai più»", sub: "Il pallone, il campetto, la cella: tutto in ritardo", big: true, do: [{ flag: { rz_o_motivo: "tardi" } }, { call: "dimissioni" }] },
                { label: "(Non rispondi. Guardi il fischietto)", sub: "Lo sa già", do: [{ flag: { rz_o_motivo: "silenzio" } }, { call: "dimissioni" }] },
              ] } },
            ] },
          ],
          rz_timbro: [{ do: [{ say: [["rz_timbro", "(Verde, ma un verde più giovane.) Benvenuta. Le servono quattro moduli per essere assunta e undici per essere licenziata. (Pausa.) Le consiglio di restare: costa meno carta."]] }] }],
          rz_nina: [
            { when: { step: 2 }, do: [
              { k: ["consegnato", "or_pallone"] },
              { if: { flag: "rz_orario_or_pallone" }, then: [{ call: "nina_puntuale" }], else: [{ call: "nina_tardi" }] },
            ] },
            { when: { step: 3 }, do: [{ say: [["rz_nina", "(Palleggia piano, guardando il cartello.) Il signore con la cravatta dice che domani mettono un magazzino. Gli ho scritto «NO». Non so se vale."]] }] },
          ],
          rz_zeta: [
            { when: { step: 3 }, do: [
              { ask: { who: "rz_zeta", prompt: "(Giacca grigia, cartellino storto: «ZETA · BANCA DEL TUBO · STAGISTA».) Buonasera! Il campetto è in vendita, sì. Il magazzino della OmniBox lo compra domani. (Abbassa la voce.) Però la Banca presta soldi a chiunque abbia un piano. Lei ha un piano, signora?", secs: 12, def: 2, options: [
                { label: "«Compro il campetto. Tutto. Adesso»", sub: "Con un prestito che non potrai mai ripagare", big: true, do: [{ flag: { rz_o_piano: "campetto" } }, { call: "piano" }] },
                { label: "«Compro chi compra i campetti»", sub: "Così nessuno potrà più chiuderne uno. O così dici", big: true, do: [{ flag: { rz_o_piano: "impero" } }, { call: "piano" }] },
                { label: "(Non rispondi. Fischi)", sub: "Il fischietto di plastica, piano", do: [{ flag: { rz_o_piano: "fischio" } }, { call: "piano" }] },
              ] } },
            ] },
          ],
        },
        obj: {},
        blocks: {
          assunta: [
            { say: [["rz_ottavia", "[felice] Assunta! (Timbra qualcosa a caso, forse la scrivania.) Prima consegna: un pallone di cuoio per la piccola Nina Sfiato, al campetto oltre il ponte. Lo aspetta da tre settimane. Per i nostri standard è in anticipo."]] },
            { k: ["pacco", "or_pallone", { n: "Pallone per Nina", secs: 75 }] },
            { quest: ["rz_o_lavoro", "Il pallone di Nina", "Il campetto oltre il ponte, a sud-est. C'è un orologio sopra la tua testa."] }, { step: 2 }, { done: true },
          ],
          nina_puntuale: [
            { flag: { rz_o_puntuale: true } },
            { say: [["rz_nina", "[felice] IL PALLONE! (Lo abbraccia.) Tre settimane e un minuto! La signora con gli occhiali aveva detto «prima o poi». È arrivato PRIMA!"], ["rz_orsola", "[felice] (Ti accorgi che stai sorridendo. Non succedeva dal 2025.) Di cuoio vero. Nel mio secolo li cucivano a mano."]] }, { call: "cartello" },
          ],
          nina_tardi: [
            { say: [["rz_nina", "(Seduta sulla porta storta, le ginocchia al petto.) Ah. È arrivato. (Lo prende.) Gli altri sono andati a casa, aspettavano da un'ora. Fa niente. Ci gioco da sola."], ["rz_orsola", "[triste] (Un minuto. Un minuto di ritardo, e una partita che non si gioca più. Lo conosci, questo minuto: è lo stesso della cella frigorifera.)"]] }, { call: "cartello" },
          ],
          cartello: [
            { say: [["rz_nina", "[pensa] Signora, lei sa leggere il cartello? Dice «VENDESI». Domani arriva un magazzino. Io ci ho scritto «NO» col gesso. (Pausa.) Vale, il gesso?"]] },
            { step: 3 }, { quest: ["rz_o_lavoro", "Il campetto in vendita", "Un impiegato della Banca del Tubo è al campetto."] }, { done: true },
          ],
          piano: [
            { step: 4 }, { bond: ["ditta", 1] },
            { say: [["rz_zeta", "[sorpreso] (Prende appunti, in fretta.) Signora, io… io sono uno stagista. Ma se un giorno lei avrà bisogno di un assistente, uno che sa sorridere davanti a qualsiasi offerta… (Ti porge un biglietto da visita storto.) Mi chiamo Zeta. Solo Zeta. Il cognome costa extra."], ["rz_orsola", "[pensa] Un campetto si chiude in un giorno. Un ritardo dura novecento anni. (Ti metti il biglietto in tasca.) Va bene, Zeta. Domani, se mai, ti chiamo."]] },
            { quest: ["rz_o_lavoro", "Le dimissioni", "Torna alla Razzopacco, dalla Professoressa."] }, { done: true },
          ],
          dimissioni: [
            { step: 5 }, { bond: ["ditta", 2] }, { finish: "dossier_c4" }, { reward: { key: "rz_c4_dossier", give: { coins: 180, cos: ["rz_d_tuta"] } } },
            { scene: [["rz_ottavia", "[pensa] (Prende il modulo. Lo legge. Lo piega in quattro e lo mette nel cassetto «MODULI DA NON TIMBRARE».) Timbro è in ferie. Torna fra… beh, fra parecchio. Finché non lo timbra, lei è ancora una dipendente della Razzopacco."], ["rz_orsola", "[furbo] Professoressa. Fra nove anni comprerò mezza galassia."], ["rz_ottavia", "[felice] E noi consegneremo l'altra metà. In ritardo. (Ti apre la porta.) Vada, signora. Il cassetto resta qui."], ["voce", "<b>CAPITOLO 4 DEL DOSSIER CONCLUSO</b> {reward}<br>Il giorno dopo, sul campetto, mettono la prima pietra del magazzino OmniBox. Nove anni dopo, il magazzino si chiama OmniPacco."]], openMain: true, bg: "rz_sede" },
          ],
        },
      },
      {
        n: 5, title: "Il campetto al lato buio", sub: "Dossier Incompiuto: la notte dopo la finale persa, dal punto di vista di Orsola",
        avatar: ORSOLA_3011, start: "rz_o_spogliatoio", introBg: "rz_finale",
        intro: [["voce", "<b>DOSSIER INCOMPIUTO · RAZZOPACCO</b>. Asteroide Arena, 3011. La finale della Coppa dei Corrieri è finita da un'ora. La OmniPacco Galacticos ha perso."], ["rz_orsola", "[pensa] Nove anni a comprare tutto. Ho perso contro una ditta che consegna in ritardo per principio. (Il fischietto pende al collo.) E la cosa peggiore è che mi sono divertita."]],
        goal: { 0: "Lo spogliatoio dei Galacticos. Zeta ha qualcosa da dirti.", 1: "Il lato buio dell'asteroide: qualcuno è sul tuo campetto segreto.", 2: "Ferruccio ha un pacco per te. Poi la Professoressa vuole una partita.", 3: "La partita è finita. Parla con la Professoressa: decidi come finisce." },
        goalDone: "Il Dossier di Razzopacco è concluso.",
        cast: {},
        zones: {
          rz_o_spogliatoio: {
            interior: true, region: "interno", name: "Dossier Razzopacco · Lo spogliatoio dei Galacticos", short: "Spogliatoio Galacticos", sub: "Specchi, silenzio, una borsa sola aperta", bg: "rz_omni", w: 16, h: 12, start: [7, 9], outside: ["rz_o_buio", 6, 6],
            act: { K: "Guarda i borsoni", T: "Guarda la panca", Y: "Guarda l'ologramma", v: "Esci" },
            flavor: { T: "La panca dei Galacticos: sedici posti, quindici borsoni chiusi. Il sedicesimo è il tuo, aperto: dentro, un pallone di cuoio sgonfio del 2025.", K: "Borsoni con lo stemma OmniPacco. Uno ha un'etichetta: «Proprietà di Orsola Monòpoli». Anche i borsoni li ha comprati lei. Anche i giocatori, quasi.", Y: "L'ologramma dello spogliatoio ripete il risultato della finale, ogni dieci secondi. Nessuno ha il coraggio di spegnerlo." },
            intro: [["voce", "Lo spogliatoio della OmniPacco Galacticos: tutto specchi, tutto vetro. Quindici giocatori se ne sono già andati, in silenzio. È rimasto solo Zeta, con la giacca a specchio in mano."]],
            npcs: [{ id: "rz_zeta", at: [10, 5] }],
            layout: [...ROOM(16, 12, 7), ["lay", 3, 3, 12, 3, "T"], ["put", 2, 6, "Y"], ["put", 13, 6, "Y"], ["put", 1, 9, "K"], ["put", 14, 9, "K"], ["put", 1, 2, "K"], ["put", 14, 2, "K"]],
          },
          rz_o_buio: {
            region: "luna", name: "Dossier Razzopacco · Il lato buio dell'asteroide", short: "Il lato buio", sub: "Crateri, cristalli, un campetto che non dovrebbe esistere", bg: "rz_arena", time: "notte", travel: [6, 7],
            w: 32, h: 22, start: [6, 7], areas: [[12, 6, 25, 15, "Il campetto al lato buio"], [0, 0, 31, 21, "Il lato buio dell'asteroide"]],
            flavor: { t: "Un albero di cristallo. Da questa parte dell'asteroide non passano comete, quindi non suona mai. Tu però ci hai appeso un campanellino.", l: "Un faro da stadio, comprato usato. Illumina un campo piccolo come quello di un quartiere del 2025. Esattamente come quello.", n: "Un cartello: «CAMPETTO DI BORGO MARINO (COPIA). Proprietà privata». Sotto, col gesso: «NO». Qualcuno l'ha scritto di recente." },
            intro: [["voce", "Il lato buio dell'Asteroide Arena: niente spalti, niente tifosi, solo crateri e cristalli. E in mezzo, sotto due fari, un campetto di quartiere: rete bucata, porte storte, linee di gesso. Una copia esatta di uno che non esiste più."], ["rz_orsola", "[pensa] Nove anni per costruirlo. Mai detto a nessuno. Mai giocato. (Si ferma.) C'è una luce accesa. Qualcuno sta palleggiando."]],
            npcs: [{ id: "rz_nina", at: [18, 9], when: { step: [1, 9] } }, { id: "rz_ferruccio", at: [27, 16], when: { step: [1, 9] } }, { id: "rz_ottavia", at: [15, 14], when: { step: [2, 9] } }, { id: "rz_borea", at: [22, 14], when: { step: [2, 9] } }],
            layout: [...BORDER(32, 22), ["house", 3, 2, 7, 4, { door: [6, 5], roof: "#5a6ad8", wall: "#c8d0ff", rr: 2, enter: { to: "rz_o_spogliatoio", at: [7, 9] } }],
              ["lay", 6, 6, 6, 12, ":"], ["lay", 6, 12, 11, 12, ":"], ["lay", 26, 13, 26, 15, ":"],
              ["lay", 12, 6, 25, 15, "-"], ["lay", 14, 4, 23, 4, "u"], ["put", 11, 7, "n"],
              ["lay", 26, 18, 29, 19, "U"], ["put", 12, 5, "l"], ["put", 25, 5, "l"], ["put", 19, 17, "s"],
              ["put", 4, 16, "C"], ["put", 9, 18, "C"], ["put", 28, 4, "C"], ["put", 29, 10, "C"], ["put", 14, 19, "C"]],
            trees: [[2, 10], [30, 15], [11, 3], [2, 19], [22, 19], [30, 2]],
          },
        },
        talk: {
          rz_zeta: [
            { when: { step: 0 }, do: [
              { say: [["rz_zeta", "(Senza giacca. Sotto ha la maglietta «AMO I PACCHI».) Signora. Nove anni che le porto i caffè, e non le ho mai fatto una domanda. Gliene faccio una adesso: il campetto al lato buio, quello della voce «varie» in bilancio… lo sa che c'è qualcuno che ci gioca? Tutte le notti?"], ["rz_orsola", "[sorpreso] Nessuno sa di quel campetto. Neanche tu."], ["rz_zeta", "[ride] Signora, io pago la bolletta dei fari. Duemila crediti al mese, per un campo dove non gioca nessuno. (Pausa.) Solo che adesso qualcuno ci gioca."]] },
              { quest: ["rz_o_buio", "Il campetto al lato buio", "Esci dallo spogliatoio: il campetto è oltre il sentiero."] }, { step: 1 }, { done: true },
            ] },
            { do: [{ say: [["rz_zeta", "Vada, signora. Io resto qui a spegnere l'ologramma. (Non lo spegne.) Fra un po'."]] }] },
          ],
          rz_nina: [
            { when: { step: 1 }, do: [
              { if: { flag: "rz_o_puntuale" },
                then: [{ say: [["rz_nina", "[sorpreso] (Il pallone le cade dal piede.) Lei. La corriere del 3002. Quella del pallone arrivato in anticipo. (Ride.) Ho diciotto anni, adesso. Il pallone ce l'ho ancora."]] }, { call: "nina_campo" }],
                else: [{ say: [["rz_nina", "[sorpreso] (Il pallone le cade dal piede.) Lei. La corriere del 3002. Quella del pallone arrivato in ritardo. (Lo raccoglie.) Ho diciotto anni, adesso. Il pallone ce l'ho ancora. Era il regalo più bello, anche in ritardo."]] }, { call: "nina_campo" }] },
            ] },
            { when: { step: [2, 3] }, do: [{ say: [["rz_nina", "[felice] Due contro due, come ai campetti. Io sto con lei, signora. Ma se perdiamo, la spremuta la paga lei: è lei la ricca."]] }] },
            { do: [{ say: [["rz_nina", "Domani porto i miei amici. Quelli del 3002, quelli che erano andati a casa. Abbiamo nove anni di partite arretrate."]] }] },
          ],
          rz_ferruccio: [
            { when: { step: 1 }, do: [
              { if: { flag: "rz_o_nina" }, then: [
                { say: [["rz_ferruccio", "[felice] BIP. Consegna per Orsola Monòpoli, dipendente della Razzopacco. Mittente: la Professoressa. Ritardo: nove anni, due mesi, quattro giorni. È il secondo record della ditta."], ["voce", "Nel pacco c'è il tuo modulo di dimissioni del 3002, piegato in quattro, mai timbrato. E nove buste paga, una per anno, con il timbro «IN RITARDO». Sopra, un biglietto con la calligrafia della Professoressa: «La sua cella frigorifera l'abbiamo tenuta calda. Venga a giocare. — O.»"], ["rz_orsola", "[triste] (Ti siedi sul bordo della piazzola. Il fischietto ti pesa al collo come una medaglia.) Nove anni. Ho comprato mezza galassia per non arrivare più tardi a niente. E l'unica cosa che mi aspettava era un cassetto."], ["rz_ferruccio", "[felice] La Professoressa sta atterrando. Ha portato la Capitana Borea, un pallone e una tanica di spremuta. Dice: «Come ai campetti»."]] },
                { step: 2 }, { quest: ["rz_o_buio", "Come ai campetti", "La Professoressa e Borea sono in campo."] }, { done: true },
              ], else: [{ say: [["rz_ferruccio", "BIP. Ho un pacco per lei, ma il regolamento dice: prima si saluta chi gioca sul campo. È maleducazione consegnare durante una partita."]] }] },
            ] },
            { do: [{ say: [["rz_ferruccio", "E LA PARTITA AL LATO BUIO È… (Pausa.) Non c'è nessuno da commentare. Commento lo stesso: è bellissima."]] }] },
          ],
          rz_borea: [{ do: [{ say: [["rz_borea", "[ride] Ho parato i suoi Galacticos per novanta minuti. Una partita a due contro due su un campetto storto? È una vacanza. (Si mette i guanti.) Ma non farò sconti."]] }] }],
          rz_ottavia: [
            { when: { step: 2 }, do: [
              { ask: { who: "rz_ottavia", prompt: "[felice] Signora Monòpoli! Dipendente! (Agita una tanica.) Due contro due: lei e la piccola Sfiato contro me, Borea e Ferruccio in porta. Chi perde paga la spremuta. Come nel 2025, no?", options: [
                { label: "Gioca la partita al lato buio", sub: "Consegna a Rete · tu e Nina contro la Razzopacco", cls: "hot", big: true, do: [
                  { engine: { name: "consegnaMatch", opts: { title: "Consegna a Rete · La partita al lato buio", oppStyle: "pressing", secs: 100, minutes: 90, us: "Campetto al Lato Buio", usColor: "#5a6ad8",
                    hero: { name: "Orsola Monòpoli" }, mate: { name: "Nina Sfiato" },
                    opp: { name: "Razzopacco", color: "#ff8a3a", players: [{ name: "Capitana Borea" }, { name: "Prof. Bollicini" }], keeper: { name: "Ferruccio" } },
                    intro: "<p>Sul campetto copiato dal 2025, sotto due fari usati: tu e <b>Nina</b> contro la Razzopacco. La Professoressa <b>corre addosso</b> a tutti, Borea è ovunque. Usa i <b>passaggi</b> e le curve attorno ai pianeti.</p>", winTitle: "IL CAMPETTO AL LATO BUIO VINCE!" },
                    win: [{ flag: { rz_o_vinta: true } }, { step: 3 }, { say: [["rz_ottavia", "[ride] Battuta da una ex dipendente! (Ti passa la tanica.) La spremuta la pago io. Ma la ricetta è segreta: la paga lei."], ["rz_nina", "[felice] Abbiamo vinto! Sul NOSTRO campetto!"]] }, { done: true }],
                    lose: [{ step: 3 }, { say: [["rz_ottavia", "[felice] Vinto io! (Si siede sul prato, senza fiato.) Centosessant'anni e ancora corro. La spremuta la paga lei, Monòpoli. Ma il resto, glielo regalo."], ["rz_nina", "[ride] Abbiamo perso. Ma che partita."]] }, { done: true }] } },
                ] },
                { label: "«Un attimo, Professoressa»", sub: "Non ancora", do: [{ say: [["rz_ottavia", "Il tempo c'è. Noi non abbiamo mai fretta. È il nostro unico lusso."]] }] },
              ] } },
            ] },
            { when: { step: 3 }, do: [
              { ask: { who: "rz_ottavia", prompt: "(Seduta sulla linea di gesso, la tanica vuota.) Bene, dipendente. Ha in mano il suo modulo di dimissioni. Lo posso timbrare, finalmente. Oppure no. Decida lei come finisce questo fascicolo.", options: [
                { label: "«Il campetto è di tutti. Togliete il cartello»", sub: "Finale: Il campetto accanto", big: true, do: [{ call: "finale_campetto" }] },
                { label: "«Stracci il modulo. La domenica consegno io»", sub: "Finale: Dimissioni respinte", big: true, do: [{ call: "finale_domenica" }] },
              ] } },
            ] },
            { do: [{ say: [["rz_ottavia", "Che notte. Nemmeno una cosa ha preso fuoco. Borea è commossa."]] }] },
          ],
        },
        obj: {},
        endings: {
          orsola_campetto: ["IL CAMPETTO ACCANTO", "Dossier Incompiuto: Orsola toglie il cartello «proprietà privata» dal campetto al lato buio. La OmniPacco paga i fari, un tubo pneumatico gratuito e una porta nuova, meno storta. Ogni notte ci gioca qualcuno: Nina, i suoi amici del 3002, e una padrona della galassia con un fischietto di plastica.", "Nel Dossier, regala il campetto a tutti."],
          orsola_domenica: ["DIMISSIONI RESPINTE", "Dossier Incompiuto: la Professoressa straccia il modulo del 3002. Dal lunedì al sabato Orsola Monòpoli compra pianeti. La domenica indossa la tuta arancione della Razzopacco, stretta di nove anni, e consegna palloni ai campetti. Sempre in anticipo. È l'unica regola che la ditta le permette di infrangere.", "Nel Dossier, torna corriere la domenica."],
        },
        blocks: {
          nina_campo: [
              { say: [["rz_nina", "[pensa] Ho trovato questo campetto due anni fa, per caso, con un razzo rubato a mio zio. Una copia esatta del nostro, quello che hanno chiuso. Il cartello diceva «proprietà privata». Ci ho scritto «NO». Come allora."], ["rz_orsola", "[triste] (Il gesso. La stessa calligrafia. Nove anni a costruire un campetto per nessuno, e lei era l'unica che ci giocava.)"], ["rz_nina", "C'è un robot laggiù, vicino alla piazzola. Dice che ha un pacco per lei, e che è in ritardo di nove anni. Ne va molto fiero."]] },
              { flag: { rz_o_nina: true } }, { quest: ["rz_o_buio", "Il pacco in ritardo", "Ferruccio aspetta vicino alla piazzola d'atterraggio."] }, { done: true },
          ],
          finale_campetto: [
            { end: "orsola_campetto" }, { unlock: "rz_nina" }, { finish: "orsola_campetto" }, { step: 9 }, { bond: ["ditta", 2] }, { reward: { key: "end:orsola_campetto", give: { coins: 300 } } },
            { scene: [["rz_orsola", "[felice] (Stacchi il cartello. Sotto, sulla rete, rimane solo il «NO» di gesso.) Nina. Domani porta tutti. Anche quelli che erano andati a casa."], ["rz_nina", "[felice] Anche il signore con la cravatta? Zeta?"], ["rz_orsola", "[ride] Soprattutto Zeta. Gioca in porta: ha la giacca a specchio, abbaglia gli attaccanti."], ["voce", "<b>DOSSIER CONCLUSO: IL CAMPETTO ACCANTO!</b> {reward}<br>Hai sbloccato la carta <b>«Nina Sfiato»</b> nella Squadra dei Sogni! Orsola ora passa anche al Borgo Marino, e nelle Carte del Destino c'è il mazzo «Il Dossier di Orsola»."]], openMain: true, bg: "rz_finale" },
          ],
          finale_domenica: [
            { end: "orsola_domenica" }, { unlock: "rz_nina" }, { finish: "orsola_domenica" }, { step: 9 }, { bond: ["ditta", 3] }, { reward: { key: "end:orsola_domenica", give: { coins: 300 } } },
            { scene: [["rz_ottavia", "[felice] (Straccia il modulo in tanti pezzetti, e li lancia in aria come coriandoli.) Timbro sarà furioso. Undici moduli per un licenziamento, e lei se ne va con zero!"], ["rz_orsola", "[furbo] Domenica alle otto. In anticipo."], ["rz_ottavia", "[ride] In anticipo? Alla Razzopacco? (Si toglie gli occhiali.) Ma sì. Ognuno ha diritto a un difetto."], ["voce", "<b>DOSSIER CONCLUSO: DIMISSIONI RESPINTE!</b> {reward}<br>Hai sbloccato la carta <b>«Nina Sfiato»</b> nella Squadra dei Sogni! Orsola ora passa anche al Borgo Marino, e nelle Carte del Destino c'è il mazzo «Il Dossier di Orsola»."]], openMain: true, bg: "rz_finale" },
          ],
        },
      },
    ],
  });
})();
