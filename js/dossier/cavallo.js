// js/dossier/cavallo.js - DOSSIER INCOMPIUTI di «Il Cavallo Star»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Max Allegria, il Labrador dorato protagonista di «Cuccioli in Campo».
// Cap. 4 «Il Muso Lungo» (il dietro le quinte del Teatro 2: 22 stagioni di sorrisi a comando, la clausola di rinnovo e il pelo tinto).
// Cap. 5 «La Partita Senza Guinzaglio» (la notte dopo la finale in diretta: fuga al vecchio campetto di terra dietro gli studi con Baldo).
// Minigiochi: «La Toeletta da Prima Serata» (prova a tempo, cap. 4) e «La Tattica Senza Copione» (prova a tempo, cap. 5).
(function () {
  "use strict";

  const LOOK = { shape: "cane", hair: "#d8a040", skin: "#f0c870", eye: "#3a2a1a", shirt: "#7ab8e8", acc: ["fischietto"] };
  const MAX4 = { name: "Max Allegria", num: 10, cast: Object.assign({ sub: "Protagonista di «Cuccioli in Campo»", shirt: "#7ab8e8" }, LOOK) };
  const MAX5 = { name: "Max Allegria", num: 10, cast: Object.assign({ sub: "Senza copione, fuori orario", shirt: "#5a98d8" }, LOOK) };

  const BORDER = (w, h, c) => [
    ["lay", 0, 0, w - 1, 0, c || "a"],
    ["lay", 0, h - 1, w - 1, h - 1, c || "a"],
    ["lay", 0, 0, 0, h - 1, c || "a"],
    ["lay", w - 1, 0, w - 1, h - 1, c || "a"],
  ];
  const ROOM = (w, h, exitX) => [
    ["lay", 0, 0, w - 1, h - 1, "+"],
    ...BORDER(w, h),
    ["put", exitX, h - 1, "v"],
  ];

  const CAST = {
    cs_wanda: {
      name: "Wanda Volpe",
      desc: "Produttrice esecutiva di «Cuccioli in Campo» per Lustrino TV. Tuta d'alta moda, occhiali scuri anche al chiuso, un contratto in mano e un cornetto nell'altra. Regola d'oro: «Un cucciolo triste non vende croccantini».",
      look: { style: "bob", hair: "#d9532f", eye: "#2b2b2b", skin: "#e09060", shirt: "#2d3748", acc: ["occhiali"], bg: ["#1a202c", "#fc8181"] },
    },
    cs_briciola: {
      name: "Briciola il Carlino",
      desc: "Co-star e terzino sinistro di «Cuccioli in Campo». Cinico, sonnolento, dorme sempre sul cuscino degli sponsor. Dice che ventidue stagioni di capriole sul set equivalgono a centocinquantaquattro anni di pensione.",
      look: { shape: "cane", hair: "#d2b48c", skin: "#c4a482", eye: "#1a1a1a", shirt: "#4a5568", acc: ["collare"], bg: ["#2d3748", "#fbd38d"] },
    },
    cs_cesare: {
      name: "Cesare Toeletta",
      desc: "Toelettatore e parrucchiere capo delle star canine di Lustrino. Da vent'anni tinge le zampe di Max con lo spray dorato per nascondere i primi peli bianchi. Parla col phon acceso.",
      look: { style: "afro", hair: "#e2e8f0", eye: "#4a5568", skin: "#cbd5e0", shirt: "#9f7aea", acc: ["forbici"], bg: ["#4a154b", "#e9d8fd"] },
    },
  };

  const ENDS = ["max_amicizia", "max_liberta"];

  window.__dossierDati.add({
    saga: "cavallo",
    after: 3,
    guest: {
      id: "cs_max",
      saga: "Il Cavallo Star · Il Dossier di Max",
      ends: ENDS,
      lines: [
        ["cs_max", "[felice] Borgo Marino! Guarda, ho tolto il collare con lo sponsor! (Salta nell'acqua bassa.) Qui nessuno mi chiede di fare la faccia da cucciolo. Posso fare anche la faccia seria... (Fa una faccia serissima per due secondi, poi scoppia a ridere.) No, non ci riesco. È troppo bello qui!"],
      ],
    },
    deck: {
      id: "csm",
      t: "Il Dossier di Max Allegria",
      e: "🐕",
      ends: ENDS,
      lock: "Trova un finale del Dossier de Il Cavallo Star",
      d: "Un cane dorato, ventidue stagioni di sorrisi e una partita vera giocata nel fango a mezzanotte.",
      pg: {
        id: "cs_briciola",
        n: "Briciola il Carlino",
        i: "🍖",
        tr: "furbizia",
        d: "Il terzino che dorme sul set. Quando si sveglia, intercetta qualsiasi pallone scivolando sul parquet.",
        greet: "Una partita a {a}? (Sbadiglia piano.) Facciamo veloce che tra dieci minuti ho il sonnellino da contratto.",
        win: "Gol. E senza neanche rovinare il cuscino. Ti è piaciuta la finta?",
        lose: "Ho perso? Meno male, così posso andare a dormire prima.",
      },
      ev: {
        n: "Il Collare con lo Sponsor",
        i: "🦴",
        d: "Un collare dorato pieno di marchi di croccantini, dimenticato sulla panca dello spogliatoio.",
        setup: [
          "Sulla panca c'è il collare dorato di Max Allegria. Luccica, ma stringe solo a guardarlo.",
          "C'è ancora inciso il motto della rete: «Sorridi sempre». Che ne facciamo?",
        ],
        ch: [
          [
            "Slaccialo subito",
            "audacia",
            "Nessun cane dovrebbe giocare col guinzaglio.",
            "Slacci il collare con un colpo netto. Il cane abbaia di gioia e scatta per tutto il campo senza fermarsi più.",
            "La fibbia è bloccata da un codice sponsor. Ci perdi dieci minuti mentre il fotografo si avvicina.",
          ],
          [
            "Portalo a Wanda",
            "furbizia",
            "Uno sponsor paga sempre bene.",
            "La produttrice ti firma un assegno solo per la restituzione. A Lustrino la fedeltà commerciale è sacra.",
            "Wanda controlla il registro: il collare risultava già smaltito nel budget. Niente assegno, solo un dépliant.",
          ],
          [
            "Appendilo alla rete",
            "cuore",
            "Come ricordo del giorno in cui è finita la recita.",
            "Lo appendi al palo arrugginito del campetto. Da quel giorno ogni cane che entra ci lascia una zampata di fango per fortuna.",
            "La pioggia della notte lo porta via tra le foglie secche. Forse è meglio così.",
          ],
        ],
      },
      tw: {
        n: "Fuori Copione",
        i: "🎬",
        d: "Quando la scena non è scritta, ogni cosa vale il doppio.",
        win: "L'improvvisazione conquista tutti: applausi e premio aumentato.",
        lose: "Il regista urla «Taglia!» e parte del premio resta in sala montaggio.",
        mulWin: 1.35,
        mulLose: 0.85,
      },
    },
    chapters: [
      {
        n: 4,
        title: "Il Muso Lungo",
        sub: "Dossier Incompiuto: il dietro le quinte di Cuccioli in Campo, dal punto di vista di Max Allegria",
        avatar: MAX4,
        start: "cs_m_canile",
        introBg: "cs_studios",
        intro: [
          ["voce", "<b>DOSSIER INCOMPIUTO · IL CAVALLO STAR</b>. Il retro del Teatro 2, gli studi di «Cuccioli in Campo». Il giorno prima della finale tra Zoccoli d'Oro e Cuccioli."],
          ["cs_max", "[triste] Ventidue stagioni. Ventidue anni a fare il cucciolo, a saltare sul divano finto e a scodinzolare quando il pubblico accende la spia rossa degli applausi. (Si guarda le zampe.) Domani c'è la finale. E Wanda vuole farmi firmare altre cinque stagioni."],
        ],
        goal: {
          0: "Il piazzale del Teatro 2. Briciola ti aspetta vicino alle cucce degli sponsor (in basso a destra).",
          1: "Entra nel Camerino delle Star (in alto a destra) per la toeletta con Cesare.",
          2: "Supera la prova di toeletta e mantieni la calma prima che Wanda arrivi.",
          3: "Wanda Volpe è scesa nel camerino col contratto in mano: decidi il tuo destino.",
        },
        goalDone: "Il Dossier continua: puoi aprire il Capitolo 5.",
        cast: {
          ...CAST,
        },
        cos: {
          cs_m_felpa: { kind: "shirt", label: "Felpa da Backstage di Max", val: "#7ab8e8", from: "Dossier de Il Cavallo Star · Capitolo 4" },
        },
        lore: {
          l_cuccioli_show: {
            t: "Cuccioli in Campo: ventidue stagioni",
            d: "Creata nel 2003 per sostituire «Zoccoli d'Oro», «Cuccioli in Campo» è la sitcom per famiglie più longeva di Lustrino. Max interpreta un cucciolo eterno che non sbaglia mai un passaggio. In ventidue anni ha recitato 4.200 scodinzolii identici.",
          },
        },
        zones: {
          cs_m_canile: {
            region: "studio",
            name: "Dossier Cavallo · Il Retro del Teatro 2",
            short: "Retro Teatro 2",
            sub: "Cucce di scena, carrelli di croccantini, la roulotte della toeletta",
            bg: "cs_studios",
            time: "giorno",
            travel: [4, 19],
            w: 32,
            h: 22,
            start: [4, 19],
            areas: [
              [1, 1, 14, 10, "La zona carico scene"],
              [17, 5, 27, 12, "Il Camerino delle Star"],
              [18, 14, 30, 20, "Le cucce degli sponsor"],
              [0, 0, 31, 21, "Il Retro del Teatro 2"],
            ],
            act: {
              T: "Guarda il tavolo",
              L: "Guarda lo scaffale",
              K: "Guarda la telecamera",
              F: "Guarda il riflettore",
              A: "Guarda la scenografia",
              n: "Leggi il cartello",
              x: "Apri la cassa",
              z: "Guarda le scatole",
              b: "Guarda la panca",
              l: "Guarda il lampione",
              p: "Guarda il pilone",
            },
            flavor: {
              T: "Il banchetto del catering canino: biscotti all'anatra glassata, ciotole d'argento col logo della rete e acqua purificata con gasatura leggera.",
              L: "Scaffali carichi di confezioni promozionali di «Croccantoni Max»: la tua faccia sorridente è stampata su tremila sacchi di cibo.",
              K: "Una telecamera fissa del dietro le quinte. La lucina rossa lampeggia: ti riprendono anche mentre sbadigli.",
              F: "Un riflettore da 5000 watt puntato sulla finta cuccia da esterno. Scalda come un termosifone.",
              A: "Pannelli di compensato dipinti a forma di prato svizzero. Dietro c'è scritto a pennarello: «NON MANGIARE IL CARTONE».",
              n: "Un cartello plastificato: «CIRCOLARE N. 44 · VIETATO RINGHIARE SUL SET. LA GIOIA È UN DOVERE AZIENDALE».",
              x: "Una cassa piena di lettere dei fan. La maggior parte chiede: «Come fai a essere sempre così felice?». Nessuna ha risposta.",
              z: "Scatoloni di palloni di spugna con la faccia di Max. Puzzano di gomma sintetica.",
              b: "Una panca imbottita per comparse canine stanche. C'è un'impronta di zampa lasciata dal carlino.",
              l: "Un lampione di scena con la luce fredda da studio televisivo.",
              p: "Un pilastro di sostegno del Teatro 2, ricoperto di adesivi degli sponsor.",
            },
            intro: [
              ["voce", "Il piazzale posteriore del Teatro 2. Tra le sagome di cartone e i furgoni del catering, regna un silenzio teso. Dentro il capannone stanno montando il set della finale."],
              ["cs_max", "[pensa] Tutti pensano che io sia un cane fortunato. E lo sono, certo. Ma a volte vorrei solo correre dietro a un pallone sgonfio senza che Orazio urli «BUONA LA SECONDA!»."],
            ],
            npcs: [
              { id: "cs_briciola", at: [24, 17], when: { step: [0, 1] } },
              { id: "cs_lucilla", at: [8, 18], when: { step: [3, 9] } },
              { id: "cs_wanda", at: [14, 18], when: { step: 9 } },
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 18, 30, 19, ":"],
              ["lay", 12, 11, 12, 18, ":"],
              ["lay", 22, 11, 22, 18, ":"],
              ["house", 17, 6, 8, 5, { door: [22, 10], roof: "#7ab8e8", wall: "#fff8e8", rr: 2, enter: { to: "cs_m_camerino", at: [7, 9] } }],
              ["house", 2, 5, 8, 5, { door: [6, 9], roof: "#f0b8c8", wall: "#f4f0f8", rr: 1, enter: "Il furgone dei costumi di Cuccioli in Campo: quaranta collari dorati identici, venti papillon rossi e un cartello: «Vietato rotolarsi nell'erba vera»." }],
              ["lay", 18, 14, 28, 14, "A"],
              ["lay", 24, 15, 29, 15, "T"],
              ["put", 14, 8, "K"],
              ["put", 15, 10, "F"],
              ["put", 27, 8, "F"],
              ["put", 3, 15, "b"],
              ["put", 11, 18, "l"],
              ["put", 21, 18, "l"],
              ["put", 30, 16, "x"],
              ["put", 29, 19, "z"],
              ["put", 28, 19, "z"],
              ["put", 1, 11, "n"],
              ["put", 1, 16, "p"],
              ["put", 30, 6, "p"],
            ],
            trees: [
              [9, 14],
              [16, 17],
              [30, 12],
            ],
          },
          cs_m_camerino: {
            interior: true,
            region: "interno",
            name: "Dossier Cavallo · Il Camerino delle Star",
            short: "Camerino delle Star",
            sub: "Specchio con lampadine, spray dorato, profumo di shampoo antipulci di lusso",
            bg: "cs_villa",
            w: 16,
            h: 12,
            start: [7, 9],
            outside: ["cs_m_canile", 22, 11],
            act: {
              T: "Siediti alla toeletta",
              L: "Guarda i premi",
              D: "Guarda l'armadio",
              b: "Guarda la cuccia",
              l: "Guarda la lampada",
              v: "Esci",
            },
            flavor: {
              T: "Il tavolino da toeletta di Cesare: spazzole d'avorio, phon silenziosi per non spaventare le orecchie e quattro flaconi di «Spray Riflessi d'Oro per Eroi Canini».",
              L: "Una bacheca di premi di Lustrino TV: «Miglior cane dell'anno 2012», «Miglior cucciolo 2018», «Collare di Platino 2022». Nessun trofeo di calcio vero.",
              D: "L'armadio dei costumi: pettorine con paillettes, completini da capitano con lo strappo facilitato e un fischietto d'argento mai usato.",
              b: "Un divanetto di velluto azzurro a forma di osso gigante. Comodo, ma Max preferisce il pavimento freddo.",
              l: "La luce da camerino che rende ogni pelo lucido come uno specchio.",
            },
            intro: [
              ["voce", "Il Camerino delle Star: profuma di shampoo alla vaniglia e balsamo districante. Sullo specchio è appesa una vecchia cartolina autografata da Baldo Criniera nel 1995: «A Max, che corre bene». Era prima che diventassero rivali per finta."],
            ],
            npcs: [
              { id: "cs_cesare", at: [8, 4], when: { step: [1, 2] } },
              { id: "cs_wanda", at: [8, 5], when: { step: 3 } },
            ],
            layout: [
              ...ROOM(16, 12, 7),
              ["lay", 5, 2, 9, 2, "T"],
              ["lay", 1, 1, 4, 1, "L"],
              ["lay", 11, 1, 14, 1, "L"],
              ["put", 14, 5, "D"],
              ["put", 2, 6, "b"],
              ["put", 1, 9, "l"],
              ["put", 14, 9, "l"],
            ],
          },
        },
        talk: {
          cs_briciola: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    ["cs_briciola", "[pensa] (Sdraiato su un cuscino marchiato Croccantoni.) Max. Sei in ritardo per la lucidatura del pelo. Cesare è dentro che scalda il phon da mezz'ora."],
                    ["cs_max", "[triste] Briciola, non ne posso più. Wanda ha stampato il contratto nuovo. Altre cinque stagioni. Vuole che continui a fingere di avere sei mesi."],
                    ["cs_briciola", "[ride] Ragazzo mio, a me danno duecento scatolette di salmone al mese solo per sbadigliare quando tu segni. Prendi la chiave ed entra da Cesare. Se Wanda ti vede col pelo opaco ti toglie anche l'osso di gomma."],
                  ],
                },
                { quest: ["cs_m_toeletta", "La Toeletta da Prima Serata", "Entra nel Camerino delle Star e parla con Cesare."] },
                { step: 1 },
                { done: true },
              ],
            },
            {
              when: { step: [1, 9] },
              do: [
                { say: [["cs_briciola", "[pensa] Non guardare me. Io sono un comprimario: la mia clausola prevede sonnellini illimitati."]] },
              ],
            },
          ],
          cs_cesare: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    ["cs_cesare", "[felice] (Impugna due spazzole come fossero bacchette da direttore d'orchestra.) Eccolo! Il muso più redditizio della penisola! Siediti subito, Max, abbiamo dodici minuti prima che arrivi Wanda per il controllo di lucentezza!"],
                    ["cs_max", "[serio] Cesare... vacci piano con la lacca. Mi fa starnutire da tre puntate."],
                    ["cs_cesare", "[furbo] L'arte della televisione richiede sacrifici, tesoro! Pronto per la prova specchio?"],
                  ],
                },
                { step: 2 },
                { call: "toeletta_trial" },
              ],
            },
            {
              when: { step: 2 },
              do: [{ call: "toeletta_trial" }],
            },
            {
              when: { step: [3, 9] },
              do: [
                { say: [["cs_cesare", "[pensa] Pelo sistemato. Qualsiasi cosa tu decida con Wanda, ricordati che il phon non mente mai."]] },
              ],
            },
          ],
          cs_wanda: [
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    ["cs_wanda", "[serio] (Entra nel camerino con una cartella di pelle dorata e gli occhiali scuri.) Max. Bellissimo. Il pelo splende, gli indici di gradimento sono al novantotto per cento."],
                    ["cs_wanda", "Andiamo al sodo. Domani sera, nella diretta della finale contro Zoccoli d'Oro, il copione dice che vinci tu. Tre a zero, abbraccio commosso al vecchio cavallo, e poi annunciamo «Cuccioli in Campo: Il Nuovo Millennio»."],
                    ["cs_wanda", "[furbo] Cinque anni di rinnovo. Clausola 14: sorriso obbligatorio in pubblico, divieto di invecchiare, e niente uscite serali senza scorta. Firma qui."],
                  ],
                },
                {
                  ask: {
                    who: "cs_wanda",
                    prompt: "(Wanda ti allunga la penna d'oro. Il contratto profuma di carta nuova e di gabbia dorata. Cosa fai?)",
                    secs: 12,
                    def: 1,
                    options: [
                      {
                        label: "«Firmo. La fama è il mio lavoro»",
                        sub: "Accetta il contratto e la gloria televisiva",
                        big: true,
                        do: [
                          { flag: { cs_m_patto: "fama" } },
                          { bond: ["fama", 3] },
                          {
                            say: [
                              ["cs_max", "[triste] Firmo, Wanda. Faccio il cucciolo da ventidue anni, saprò farlo per altri cinque."],
                              ["cs_wanda", "[felice] Bravissimo cane! Domani sera stravinciamo. E niente musi lunghi!"],
                            ],
                          },
                          { call: "dopo_wanda" },
                        ],
                      },
                      {
                        label: "«Non firmo. Stasera voglio giocare a calcio vero»",
                        sub: "Rifiuta la gabbia: vuoi libertà",
                        big: true,
                        do: [
                          { flag: { cs_m_patto: "liberta" } },
                          { bond: ["verita", 4] },
                          {
                            say: [
                              ["cs_max", "[serio] Non firmo, Wanda. Ho ventidue anni di carriera. Ho il pelo bianco sulle zampe e voglio poter sbagliare un passaggio senza una penale dello sponsor."],
                              ["cs_wanda", "[sorpreso] Sei impazzito? Senza di me torni a mangiare i croccantini del discount!"],
                            ],
                          },
                          { call: "dopo_wanda" },
                        ],
                      },
                      {
                        label: "«Solo se facciamo uno show insieme a Baldo: Zoccoli & Zampe»",
                        sub: "Proponi un patto paritario col vecchio rivale",
                        big: true,
                        do: [
                          { flag: { cs_m_patto: "coppia" } },
                          { bond: ["baldo", 3] },
                          { bond: ["verita", 2] },
                          {
                            say: [
                              ["cs_max", "[felice] Firmo solo a una condizione: una nuova serie dove io e Baldo giochiamo insieme. Niente rivalità finta. Una squadra sola."],
                              ["cs_wanda", "[pensa] Un cavallo nostalgico e un cane ribelle... (Si toglie gli occhiali.) Potrebbe essere un successo clamoroso. Ci penso."],
                            ],
                          },
                          { call: "dopo_wanda" },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              when: { step: [4, 9] },
              do: [
                { say: [["cs_wanda", "[serio] Ci vediamo domani sera sul set del Teatro 9. E ricordati che tutta Lustrino ti guarda."]] },
              ],
            },
          ],
          cs_lucilla: [
            {
              when: { step: [3, 4] },
              do: [
                {
                  say: [
                    ["cs_lucilla", "[furbo] (Incontra Max vicino al cancello degli studi, con due telefoni all'orecchio.) Max! Ti stavo cercando. Baldo si è barricato nel suo camerino con un fascio di copioni rossi."],
                    ["cs_max", "[sorpreso] Baldo? Perché?"],
                    ["cs_lucilla", "[triste] Perché sa che la rete ha deciso di farlo perdere per lanciare il tuo spin-off. È ferito nell'orgoglio, povero vecchio cavallo. Se c'è uno che può parlargli stasera, senza telecamere, sei tu."],
                  ],
                },
                { step: 4 },
                { call: "chiudi_c4" },
              ],
            },
            {
              do: [{ say: [["cs_lucilla", "Le star sono tutte uguali: tanta criniera e tanta paura. Vai da lui, Max."]] }],
            },
          ],
        },
        obj: {
          "cs_m_canile:x": [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    ["voce", "La cassa della posta dei fan di «Cuccioli in Campo». Tra mille disegni colorati trovi una busta sgualcita del 1996."],
                    ["voce", "Dentro c'è una foto di Baldo Criniera con una dedica: «A quel cagnolino biondo che correva a bordo campo: continua a correre, ma non farti mai mettere il guinzaglio».", ],
                    ["cs_max", "[felice] Me l'aveva scritta Baldo al mio primo provino. L'avevo dimenticata qui dentro."],
                  ],
                },
                { bond: ["baldo", 1] },
                { done: true },
              ],
            },
            {
              do: [{ say: [["voce", "La cassa delle lettere. La vecchia foto del '96 adesso è al sicuro nella tua giacca."]] }],
            },
          ],
          "cs_m_camerino:T": [
            {
              when: { step: 1 },
              do: [
                { say: [["voce", "La poltrona da toeletta. Cesare ti fa cenno di salire: è l'ora della lucidatura da prima serata."]] },
                { step: 2 },
                { call: "toeletta_trial" },
              ],
            },
            {
              do: [{ say: [["voce", "Il bancone dei cosmetici. I flaconi dorati brillano sotto i faretti."]] }],
            },
          ],
        },
        blocks: {
          toeletta_trial: [
            {
              trial: {
                title: "La Toeletta da Prima Serata",
                bg: "cs_villa",
                secs: 7,
                need: 3,
                rounds: [
                  {
                    prompt: "Cesare ti mostra lo specchio: «Max! C'è un ciuffo bianco sulla zampa destra! Quale tonalità uso prima che entri Wanda?»",
                    options: [
                      { label: "Balsamo Dorato Caramello n. 4", ok: true },
                      { label: "Gel glitterato da discoteca" },
                      { label: "Lascia il pelo bianco al naturale" },
                    ],
                    good: "La zampa torna di un biondo impeccabile, come nella prima stagione del 2003.",
                    bad: "La zampa sembra fosforescente! Cesare si mette le mani nei capelli.",
                  },
                  {
                    prompt: "«Le orecchie! Nella scena d'apertura devi sembrare un cucciolo che sente una zoccolata. Come le orienti?»",
                    options: [
                      { label: "Una su e una piegata a quarantacinque gradi", ok: true },
                      { label: "Entrambe all'indietro come se avessi paura" },
                      { label: "Ferme e rigide come due antenne radio" },
                    ],
                    good: "Espressione perfetta! Il regista di seconda unità applaudirebbe commosso.",
                    bad: "Sembri un cane che ha appena visto un gatto alieno.",
                  },
                  {
                    prompt: "«Il sorriso da contratto con gli sponsor di croccantini! Mostrami i canini da prima serata!»",
                    options: [
                      { label: "Sorriso a bocca aperta con lingua a destra e scodinzolio rapido", ok: true },
                      { label: "Ringhio sommesso a denti stretti" },
                      { label: "Sbadiglio totale ad occhi chiusi" },
                    ],
                    good: "Lo sponsor rinnoverebbe all'istante anche per una fornitura decennale.",
                    bad: "Sembrava più una minaccia che una promozione di cibo per cuccioli.",
                  },
                  {
                    prompt: "«Ultimo tocco: la battuta di scena da provare al microfono lavalier. Cosa dici?»",
                    options: [
                      { label: "«Palla a Max, gol per tutti e coccole a fine tempo!»", ok: true },
                      { label: "«Che zoccolata!» (la battuta di Baldo)" },
                      { label: "«Ho fame, quand'è la pausa pranzo?»" },
                    ],
                    good: "Il tono è squillante, innocente e impeccabilmente televisivo.",
                    bad: "Se dici la battuta di Baldo, Wanda ti licenzia prima della messa in onda!",
                  },
                ],
                win: [{ flag: { cs_m_lucido: true } }, { call: "dopo_toeletta" }],
                lose: [{ flag: { cs_m_lucido: false } }, { call: "dopo_toeletta" }],
              },
            },
          ],
          dopo_toeletta: [
            {
              if: { flag: "cs_m_lucido" },
              then: [
                {
                  say: [
                    ["cs_cesare", "[felice] Perfetto! Sembri appena uscito dalla cucciolata! Wanda sta entrando, fatti trovare pronto."],
                  ],
                },
              ],
              else: [
                {
                  say: [
                    ["cs_cesare", "[triste] Mmh, sei un po' arruffato, ma pazienza: diremo che è lo stile «cucciolo ribelle». Wanda è qui!"],
                  ],
                },
              ],
            },
            { step: 3 },
            { quest: ["cs_m_toeletta", "Il Contratto di Wanda", "Wanda Volpe è nel camerino con la cartella."] },
            { done: true },
          ],
          dopo_wanda: [
            {
              say: [
                ["voce", "Wanda ripone i fogli nella borsa di pelle. Fuori dal camerino si sente il clacson di un'utilitaria: è Lucilla Bassotto."],
              ],
            },
            { step: 4 },
            { quest: ["cs_m_toeletta", "La Confessione di Lucilla", "Esci nel piazzale e parla con Lucilla."] },
            { done: true },
          ],
          chiudi_c4: [
            {
              reward: { key: "cs_c4_dossier", give: { coins: 160, cos: ["cs_m_felpa"] } },
            },
            { finish: "dossier_c4" },
            {
              scene: [
                ["cs_max", "[serio] (Si sfila il collare d'oro e lo posa sulla panca.) Lucilla ha ragione. Non posso salire su quel palco e far finta che sia tutto un gioco per bambini."],
                ["cs_max", "[felice] Stasera, dopo la diretta, quando le luci si spengono... vado a cercare Baldo. Sul serio."],
                ["voce", "<b>CAPITOLO 4 DEL DOSSIER CONCLUSO</b> {reward}<br>Mentre gli studi si preparano alla grande diretta, Max Allegria ha deciso di smettere di recitare."],
              ],
              openMain: true,
              bg: "cs_studios",
            },
          ],
        },
      },
      {
        n: 5,
        title: "La Partita Senza Guinzaglio",
        sub: "Dossier Incompiuto: la notte dopo la diretta, sul vecchio campetto di terra",
        avatar: MAX5,
        start: "cs_m_campetto",
        introBg: "cs_colle",
        intro: [
          ["voce", "<b>DOSSIER INCOMPIUTO · IL CAVALLO STAR</b>. Mezzanotte passata. La diretta al Teatro 9 è finita da due ore. Le luci di Lustrino tremano nella nebbia."],
          ["cs_max", "[serio] Mi sono tolto la pettorina da star. Ho corso lungo il sentiero buio dietro gli studi fino a questo vecchio campo di terra battuta. La rete è strappata, le porte non hanno vernice. Eppure c'è una luce accesa."],
        ],
        goal: {
          0: "Il vecchio campetto di terra. Baldo Criniera è da solo vicino alla porta (in alto al centro).",
          1: "Ugo Divano e Briciola sono arrivati allo spogliatoio di lamiera (a sinistra) con un pallone vero.",
          2: "Entra in campo con Baldo e affronta la prova tattica al buio.",
          3: "Nina Flash e Viola Penna sono arrivate a bordo campo con le torce: scegli il finale.",
        },
        goalDone: "Il Dossier de Il Cavallo Star è concluso.",
        cast: {
          ...CAST,
        },
        endings: {
          max_amicizia: [
            "ZOCCOLI E ZAMPE",
            "Max e Baldo stracciano i copioni del network e fondano una squadra vera, aperta a giovani ed ex star. Una nuova serie senza copione, dove chi gioca col cuore vince sempre.",
            "Serve aver scelto l'alleanza con Baldo e superato la prova tattica.",
          ],
          max_liberta: [
            "SENZA COLLARE",
            "Max lascia la televisione e compra il vecchio campetto di terra per donarlo ai cuccioli randagi di Lustrino. Baldo diventa l'allenatore del sabato pomeriggio.",
            "Serve aver scelto la libertà dal contratto della rete.",
          ],
        },
        lore: {
          l_campetto_terra: {
            t: "Il Campetto di Terra del 1994",
            d: "Dietro i teatri scintillanti di Lustrino esiste ancora il campo dove Baldo e i suoi amici giocavano prima del successo di «Zoccoli d'Oro». Non ci sono telecamere né sponsor: solo sassi, linee di gesso tracciate a mano e sogni veri.",
          },
        },
        zones: {
          cs_m_campetto: {
            region: "lustrino",
            name: "Dossier Cavallo · Il Campetto di Terra",
            short: "Campetto di Terra",
            sub: "Terra battuta, porte arrugginite, il profumo d'erba bagnata sotto la luna",
            bg: "cs_colle",
            time: "notte",
            travel: [4, 19],
            w: 32,
            h: 22,
            start: [4, 19],
            areas: [
              [10, 8, 24, 17, "Il campo di terra battuta"],
              [1, 3, 9, 9, "Lo spogliatoio di lamiera"],
              [0, 0, 31, 21, "Il Campetto di Terra"],
            ],
            act: {
              n: "Leggi il cartello",
              T: "Guarda la panchina",
              x: "Apri la cassa",
              p: "Guarda il palo della porta",
              l: "Guarda il faro arrugginito",
              b: "Guarda la sedia",
              z: "Guarda i copertoni",
            },
            flavor: {
              n: "Un cartello sbilenco: «CAMPETTO SAN ROCCO · 1994 · CHI NON GIOCA PASSI LA PALLA». Sotto c'è una foto sbiadita di Baldo giovane che esulta nel fango.",
              T: "Una vecchia panca di legno scortecciato. Ci sono incise le iniziali dei calciatori che hanno fatto la storia delle sitcom prima che inventassero il digitale.",
              x: "Una cassa di legno con vecchi palloni di cuoio marrone cuciti a mano. Puzzano di pioggia e di tiri all'incrocio.",
              p: "Il palo della porta: è di ferro massiccio, pieno di ammaccature. Baldo dice che lì sopra ci ha stampato il suo tiro più bello.",
              l: "Un vecchio faro da cantiere montato su un bidone. Fa una luce calda e gialla, senza riflessi televisivi.",
              b: "Una sedia pieghevole di tela dove Ugo Divano ha già appoggiato una ciotola di pop-corn freddi.",
              z: "Copertoni d'auto usati per allenare la precisione dei passaggi rasoterra.",
            },
            intro: [
              ["voce", "Il vecchio campetto dietro la collina degli studios. Qui l'erba cresce spontanea ai bordi del gesso e non ci sono microfoni nascosti. Solo il vento che scende dai monti di Lustrino."],
            ],
            npcs: [
              { id: "cs_baldo", at: [17, 10], when: { step: [0, 1] } },
              { id: "cs_ugo", at: [8, 16], when: { step: [1, 2] } },
              { id: "cs_briciola", at: [6, 17], when: { step: [1, 2] } },
              { id: "cs_nina", at: [26, 18], when: { step: 3 } },
              { id: "cs_viola", at: [28, 17], when: { step: 3 } },
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 18, 30, 19, ":"],
              ["lay", 5, 9, 5, 18, ":"],
              ["lay", 10, 8, 24, 16, "-"],
              ["house", 2, 4, 7, 5, { door: [5, 8], roof: "#8a9ab0", wall: "#e0d8c8", rr: 1, enter: { to: "cs_m_baracca", at: [7, 9] } }],
              ["put", 10, 12, "p"],
              ["put", 24, 12, "p"],
              ["put", 12, 17, "T"],
              ["put", 22, 17, "T"],
              ["put", 4, 15, "b"],
              ["put", 27, 10, "x"],
              ["put", 28, 14, "z"],
              ["put", 1, 10, "n"],
              ["put", 10, 7, "l"],
              ["put", 24, 7, "l"],
            ],
            trees: [
              [1, 1],
              [7, 2],
              [29, 3],
              [29, 8],
              [2, 16],
              [29, 20],
            ],
          },
          cs_m_baracca: {
            interior: true,
            region: "interno",
            name: "Dossier Cavallo · La Baracca degli Attrezzi",
            short: "Spogliatoio di Lamiera",
            sub: "Odore di canfora, fango secco e vecchie maglie di lana",
            bg: "cs_camerino",
            w: 16,
            h: 12,
            start: [7, 9],
            outside: ["cs_m_campetto", 5, 9],
            act: {
              T: "Guarda la lavagna",
              L: "Guarda le maglie",
              D: "Guarda l'armadietto",
              b: "Guarda la panca",
              v: "Esci",
            },
            flavor: {
              T: "Una lavagna di ardesia con disegnati schemi a gesso del 1994: frecce dritte, triangolazioni e una scritta: «CHI CORRE HA RAGIONE».",
              L: "Vecchie maglie di lana a strisce rosa e bianche, intrise di fango storico mai lavato via.",
              D: "Un armadietto metallico sfondato: dentro c'è un paio di parastinchi di cuoio consumati sul davanti.",
              b: "Una panca di castagno scheggiata. Qui Baldo si sedeva a piangere dopo le sconfitte e a ridere dopo i pareggi.",
            },
            intro: [
              ["voce", "Lo spogliatoio di lamiera. Non ci sono specchi con le lampadine né catering di lusso. Solo una fontanella d'acqua gelida e il silenzio della notte."],
            ],
            npcs: [],
            layout: [
              ...ROOM(16, 12, 7),
              ["lay", 5, 3, 10, 3, "T"],
              ["lay", 1, 1, 4, 1, "L"],
              ["lay", 11, 1, 14, 1, "L"],
              ["put", 14, 5, "D"],
              ["put", 2, 6, "b"],
            ],
          },
        },
        talk: {
          cs_baldo: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    ["cs_baldo", "[sorpreso] (Si volta di scatto col pallone sotto lo zoccolo.) Max? Che ci fai qui a quest'ora? Dovresti essere al party del network a festeggiare il rinnovo."],
                    ["cs_max", "[serio] Non ho firmato, Baldo. O almeno... non come volevano loro."],
                    ["cs_baldo", "[triste] (Guarda per terra, calciando un sassolino.) Io stasera ho recitato la mia parte. Ho detto la battuta. Ho perso come volevano loro. Poi sono venuto qui per ricordarmi che faccia avevo prima di diventare un pupazzo per la tv."],
                    ["cs_max", "[felice] Io la tua faccia me la ricordo, Baldo. Nel '95 avevo due mesi. Sei stato tu a farmi amare questo pallone."],
                    ["cs_baldo", "[pensa] (Resta in silenzio per cinque secondi, poi un mezzo sorriso gli solleva i baffi.) E allora che stiamo aspettando? Ugo e Briciola sono alla baracca con i palloni gonfi. Facciamo vedere a questa notte come si gioca."],
                  ],
                },
                { step: 1 },
                { quest: ["cs_m_notte", "La Notte del Riscatto", "Raggiungi Ugo e Briciola vicino alla baracca di lamiera."] },
                { done: true },
              ],
            },
            {
              when: { step: 1 },
              do: [
                { say: [["cs_baldo", "[felice] Vai da Ugo. Io intanto sistemo i sassi sulla linea di porta."]] },
              ],
            },
            {
              when: { step: 2 },
              do: [{ call: "partita_trial" }],
            },
            {
              when: { step: [3, 9] },
              do: [
                { say: [["cs_baldo", "[felice] Abbiamo sudato per davvero, Max. Non mi sentivo così vivo dal primo ciak del '94."]] },
              ],
            },
          ],
          cs_ugo: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    ["cs_ugo", "[ride] Idea: una partita a calcio al buio dove il pallone fa bip. (Pausa.) Non abbiamo il pallone che fa bip? Allora usiamo questo di cuoio. Pesa quattro chili ma vola benissimo!"],
                    ["cs_briciola", "[pensa] Io faccio l'arbitro dalla sedia. Se correte troppo fischio fallo di sonno."],
                    ["cs_max", "[felice] Baldo è pronto al centro del campo. Giochiamo!"],
                  ],
                },
                { step: 2 },
                { quest: ["cs_m_notte", "Tattica Senza Copione", "Torna al centro del campo con Baldo e affronta la prova."] },
                { done: true },
              ],
            },
            {
              do: [{ say: [["cs_ugo", "[felice] Giocate, giocate! Io intanto penso al titolo del nostro film indipendente."]] }],
            },
          ],
          cs_briciola: [
            {
              when: { step: [1, 2] },
              do: [
                { say: [["cs_briciola", "[furbo] Fischietto pronto. Nessuno sponsor in tribuna. Questa sì che è una bella serata."]] },
              ],
            },
            {
              do: [{ say: [["cs_briciola", "[pensa] Bella giocata, ragazzi. Quasi quasi mi alzo a battere le mani."]] }],
            },
          ],
          cs_viola: [
            {
              when: { step: 3 },
              do: [{ call: "scelta_finale" }],
            },
            {
              do: [{ say: [["cs_viola", "[felice] Ho scritto tutto. Questa pagina rimarrà nella storia di Lustrino."]] }],
            },
          ],
          cs_nina: [
            {
              when: { step: 3 },
              do: [{ call: "scelta_finale" }],
            },
            {
              do: [{ say: [["cs_nina", "[felice] Il titolo per l'edizione speciale di mezzanotte è già pronto!"]] }],
            },
          ],
        },
        obj: {
          "cs_m_campetto:n": [
            {
              do: [
                {
                  say: [
                    ["voce", "Il cartello di legno del 1994. Con la torcia leggi le incisioni: «Baldo, Orazio, Lucilla, San Rocco F.C.». Una storia iniziata trent'anni fa."],
                  ],
                },
                { done: true },
              ],
            },
          ],
          "cs_m_campetto:x": [
            {
              do: [
                {
                  say: [
                    ["voce", "La cassa dei palloni d'epoca. Sono pesanti, veri, segnati dal fango."],
                  ],
                },
                { done: true },
              ],
            },
          ],
        },
        blocks: {
          partita_trial: [
            {
              trial: {
                title: "La Tattica Senza Copione",
                bg: "cs_colle",
                secs: 7,
                need: 3,
                rounds: [
                  {
                    prompt: "Baldo scatta verso l'area nel buio: «Max! C'è una buca sulla trequarti! Come mi passi la sfera?»",
                    options: [
                      { label: "Pallonetto morbido a scavalcare la zolla", ok: true },
                      { label: "Tiro teso rasoterra dritto nel fango" },
                      { label: "Chiami lo stop per chiedere il copione" },
                    ],
                    good: "Il pallone supera la zolla e atterra morbido sullo zoccolo di Baldo!",
                    bad: "La palla rimbalza male su una pietra e finisce tra i cespugli.",
                  },
                  {
                    prompt: "Baldo fa la sua storica finta del '94, ma il terreno è scivoloso: dove ti posizioni per il triangolo?",
                    options: [
                      { label: "Scatto veloce sul palo scoperto a sinistra", ok: true },
                      { label: "Resti fermo a guardare l'azione" },
                      { label: "Torni verso la tua porta" },
                    ],
                    good: "Sincronia perfetta! Ricevi l'assist al volo senza nemmeno dover guardare.",
                    bad: "Baldo passa nel vuoto e inciampa nell'erba alta brontolando.",
                  },
                  {
                    prompt: "Briciola fischia dal bidone: «Ultimi trenta secondi! Fate vedere un gol da antologia!» Cosa provate?",
                    options: [
                      { label: "Sponda di testa di Max e volée d'incrocio di Baldo", ok: true },
                      { label: "Tiro alla cieca da centrocampo verso la nebbia" },
                      { label: "Un balletto concordato per gli sponsor" },
                    ],
                    good: "GOOOL! Il pallone gonfia la rete arrugginita con un tonfo secco e magnifico!",
                    bad: "Tiro altissimo sopra la traversa che spaventa i gufi della collina.",
                  },
                  {
                    prompt: "Dopo l'azione vi abbracciate rotolando nel fango: che grido lanciate insieme?",
                    options: [
                      { label: "«ZOCCOLI E ZAMPE, SENZA REGIA!»", ok: true },
                      { label: "«Acquistate Croccantoni Max!»" },
                      { label: "«Che zoccolata da rifare!»" },
                    ],
                    good: "L'eco risuona per tutta la vallata di Lustrino, limpida e libera.",
                    bad: "Un grido strozzato che fa ridere Ugo dal divano.",
                  },
                ],
                win: [{ flag: { cs_m_tattica_ok: true } }, { call: "arrivo_stampa" }],
                lose: [{ flag: { cs_m_tattica_ok: false } }, { call: "arrivo_stampa" }],
              },
            },
          ],
          arrivo_stampa: [
            {
              say: [
                ["voce", "Due fari fendono la nebbia del campetto. Sono Nina Flash e Viola Penna con un fotografo."],
                ["cs_nina", "[sorpreso] Eccoli! Eravamo sicure di trovarvi qui! Due leggende della televisione coperte di fango a mezzanotte."],
                ["cs_viola", "[felice] (Apre il suo taccuino.) Non è uno spot. È la scena più vera che abbia mai visto a Lustrino."],
              ],
            },
            { step: 3 },
            { quest: ["cs_m_notte", "Il Verdetto della Notte", "Parla con Nina e Viola a bordo campo."] },
            { done: true },
          ],
          scelta_finale: [
            {
              if: { flag: "cs_m_patto", is: "coppia" },
              then: [{ call: "finale_amicizia" }],
              else: [
                {
                  if: { flag: "cs_m_patto", is: "liberta" },
                  then: [{ call: "finale_liberta" }],
                  else: [
                    {
                      ask: {
                        who: "cs_viola",
                        prompt: "«Max, Baldo... tutta Lustrino aspetta di sapere cosa ne sarà di voi. Che messaggio diamo al pubblico?»",
                        options: [
                          {
                            label: "«Annunciamo una nuova squadra insieme: Zoccoli e Zampe!»",
                            sub: "Unitevi contro le regole del network",
                            big: true,
                            do: [{ call: "finale_amicizia" }],
                          },
                          {
                            label: "«Io lascio la tv: questo campetto diventa la casa dei cuccioli»",
                            sub: "La libertà pura dal mondo dello spettacolo",
                            big: true,
                            do: [{ call: "finale_liberta" }],
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
          finale_amicizia: [
            { end: "max_amicizia" },
            { unlock: ["cs_max", "cs_briciola", "cs_wanda"] },
            { finish: "max_amicizia" },
            { step: 9 },
            { reward: { key: "cs_end_amicizia", give: { coins: 250, cos: ["cs_vhs"] } } },
            {
              scene: [
                ["cs_nina", "[felice] TITOLO DI PRIMA PAGINA: «ZOCCOLI E ZAMPE: IL CAVALLO E IL CANE FONDANO LA LORO SQUADRA!»"],
                ["cs_baldo", "[felice] (Abbraccia Max sporcandolo ancora di più di fango.) Niente copione. Da domani insegniamo a Lustrino come si segna sul serio."],
                ["cs_max", "[felice] E io non dovrò mai più fingere di essere un cucciolo! Siamo una squadra!"],
                ["voce", "<b>FINALE DOSSIER · ZOCCOLI E ZAMPE</b> {reward}<br>Max Allegria e Baldo Criniera aprono la prima accademia calcistica indipendente di Lustrino. La loro serie autoprodotta batte tutti gli ascolti del network, ma la domenica mattina li trovi ancora qui, sul campo di terra, a giocare senza copione."],
              ],
              openMain: true,
              bg: "cs_colle",
            },
          ],
          finale_liberta: [
            { end: "max_liberta" },
            { unlock: ["cs_max", "cs_briciola"] },
            { finish: "max_liberta" },
            { step: 9 },
            { reward: { key: "cs_end_liberta", give: { coins: 220, cos: ["cs_c3"] } } },
            {
              scene: [
                ["cs_viola", "[pensa] «SENZA COLLARE»: la biografia di un cane che ha scelto la terra battuta al posto del platino."],
                ["cs_max", "[felice] (Lancia il vecchio collare verso la luna.) Ho donato il cachet alla città: questo campetto resterà aperto per sempre, giorno e notte, per chiunque voglia tirare quattro calci a un pallone."],
                ["cs_baldo", "[serio] E io sarò qui tutti i sabati a fare da mister. Senza megafoni e senza applausi finti."],
                ["voce", "<b>FINALE DOSSIER · SENZA COLLARE</b> {reward}<br>Max Allegria si ritira all'apice del successo. Il campetto San Rocco diventa il punto d'incontro più amato di tutta la collina. Nessuno chiama più Max «il cucciolo del network»: ora è semplicemente Max, il cane libero che gioca a calcio col cuore."],
              ],
              openMain: true,
              bg: "cs_colle",
            },
          ],
        },
      },
    ],
  });
})();
