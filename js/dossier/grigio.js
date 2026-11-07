// js/dossier/grigio.js - DOSSIER INCOMPIUTI di «Il Cavaliere della Notte»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Ottavio Brume, presidente della Lega del Porto e del Nebbia Athletic, cinquant'anni, baffi grigi, sciarpa di seta e soprabito scuro, l'antagonista che svela i suoi motivi per mantenere l'ordine nella nebbia.
// Cap. 4 «I Libri Mastri della Nebbia» (l'ispezione notturna alla Vecchia Dogana, il tradimento nel consiglio e la decifrazione del caveau).
// Cap. 5 «L'Ultimo Salotto sul Molo» (il confronto al Circolo Nautico, l'audit contabile della Lega e il bivio tra il patto del silenzio e l'esilio solitario).
// Minigiochi: «La Decifrazione del Caveau della Dogana» (prova a tempo a scelte, cap. 4) e «L'Audit Notturno della Lega del Porto» (prova a tempo a scelte, cap. 5).
(function () {
  "use strict";

  const LOOK_BRUME = {
    name: "Ottavio Brume",
    style: "slick",
    hair: "#9a9a9a",
    beard: "baffi",
    eye: "#5a5a6a",
    skin: "#f0d8c8",
    acc: ["sciarpa"]
  };

  const BRUME_C4 = {
    name: "Ottavio Brume",
    num: 1,
    cast: Object.assign(
      { sub: "Presidente della Lega del Porto", shirt: "#3a3a4a", bg: ["#0c101a", "#8a8a9a"] },
      LOOK_BRUME
    )
  };

  const BRUME_C5 = {
    name: "Ottavio Brume",
    num: 1,
    cast: Object.assign(
      { sub: "Il Mercante di Nebbia", shirt: "#2a2a34", bg: ["#0c101a", "#5a5a6a"] },
      LOOK_BRUME
    )
  };

  const BORDER = (w, h, c) => [
    ["lay", 0, 0, w - 1, 0, c || "a"],
    ["lay", 0, h - 1, w - 1, h - 1, c || "a"],
    ["lay", 0, 0, 0, h - 1, c || "a"],
    ["lay", w - 1, 0, w - 1, h - 1, c || "a"]
  ];

  const ROOM = (w, h, exitX) => [
    ["lay", 0, 0, w - 1, h - 1, "+"],
    ...BORDER(w, h),
    ["put", exitX, h - 1, "v"]
  ];

  const CAST = {
    gr_brume: {
      name: "Ottavio Brume",
      desc: "Presidente della Lega del Porto e del Nebbia Athletic. Baffi grigi d'ordinanza, sciarpa di seta e soprabito di lana pesante che sembra respingere la pioggia: «La nebbia non cancella il fallo: decide solo chi ha il diritto di vederlo.»",
      look: {
        style: "slick",
        hair: "#9a9a9a",
        beard: "baffi",
        eye: "#5a5a6a",
        skin: "#f0d8c8",
        shirt: "#3a3a4a",
        acc: ["sciarpa"],
        bg: ["#0c101a", "#8a8a9a"]
      }
    },
    gr_dora: {
      name: "Commissaria Dora Valli",
      desc: "Commissaria capo della polizia portuale di Porto Scuro. Trench scuro e taccuino d'ordinanza sempre asciutto sotto l'impermeabile: «Finché piove su Porto Scuro, nessuna bugia resta asciutta abbastanza a lungo.»",
      look: {
        style: "bob",
        hair: "#5a3a2a",
        eye: "#2a4a3a",
        skin: "#f0d0b0",
        shirt: "#4a4a3a",
        acc: ["cappellino"],
        bg: ["#0c101a", "#3a4a3a"]
      }
    }
  };

  const ENDS = ["brume_patto_silenzio", "brume_scacco_ombra"];

  window.__dossierDati.add({
    saga: "grigio",
    after: 3,
    guest: {
      id: "gr_brume",
      saga: "Il Cavaliere della Notte · Il Dossier di Brume",
      ends: ENDS,
      lines: [
        [
          "gr_brume",
          "[sorseggia un caffè amaro guardando il mare quieto] Che bizzarra sensazione, {n}. Niente pioggia battente, niente sirene di piroscafi e nessuno che cerchi di truccare il calendario dei tornei. Forse mi sto ammorbidendo, o forse il sole del Borgo costa meno della nebbia."
        ]
      ]
    },
    deck: {
      id: "grb",
      t: "Il Dossier di Brume",
      e: "🌫️",
      ends: ENDS,
      lock: "Trova un finale del Dossier di Il Cavaliere della Notte",
      d: "I registri segreti della Nebbia S.p.A., casseforti della dogana, accordi d'onore e il cinismo lucido di chi governa Porto Scuro.",
      pg: {
        id: "gr_dora",
        n: "Commissaria Dora Valli",
        i: "🕵️",
        tr: "furbizia",
        d: "Commissaria della polizia portuale. Conosce ogni ruggine della banchina e non firma mai un verbale senza aver visto la prova.",
        greet: "Una partita pulita a {a}? Falla cominciare in orario: ho tre testimoni che aspettano al molo.",
        win: "Caso chiuso. Tre punti puliti e niente appello.",
        lose: "La pista si è raffreddata sotto la pioggia."
      },
      ev: {
        n: "Il Registro dalle Pagine Sigillate",
        i: "📖",
        d: "Il libro mastro della Nebbia S.p.A. con le quote cifrate delle partite del porto.",
        setup: [
          "Nel cassetto segreto del tavolo doganale trovi un registro con la copertina di cuoio bagnata.",
          "I nomi dei marcatori sono coperti da sigilli in ceralacca grigia. Che facciamo?"
        ],
        ch: [
          [
            "Sciogli la ceralacca con la fiamma del sigaro",
            "furbizia",
            "La pazienza scopre ogni combinazione.",
            "I sigilli si aprono rivelando le prove di ventimila lire di fondi neri che incameri immediatamente.",
            "La cera prende fuoco e brucia le pagine del registro lasciando solo cenere umida."
          ],
          [
            "Consegna il volume intonso alla polizia portuale",
            "cuore",
            "La trasparenza paga sempre sul lungo periodo.",
            "La commissaria Valli elogia l'integrità e ti ricompensa con venticinque monete e la stima del molo.",
            "Il verbale finisce insabbiato tra le carte burocratiche della questura."
          ],
          [
            "Usa il registro come leva per ricattare i clan rivali",
            "audacia",
            "A Porto Scuro la paura è una moneta spendibile.",
            "I boss del carbone abbassano la cresta e ti versano quaranta monete per riavere i fogli compromettenti.",
            "Due guardie ti inseguono lungo i binari costringendoti a gettare il libro nel canale."
          ]
        ]
      },
      tw: {
        n: "Cortina di Nebbia",
        i: "🌫️",
        d: "L'umidità del porto confonde arbitri e guardalinee.",
        win: "Fuorigioco invisibile convalidato: il premio della partita sale.",
        lose: "La nebbia nasconde la palla all'attaccante: perdi parte della posta in gioco.",
        mulWin: 1.3,
        mulLose: 0.85
      }
    },
    chapters: [
      {
        n: 4,
        title: "I Libri Mastri della Nebbia",
        sub: "Dossier Incompiuto: i segreti della Dogana, dal punto di vista di Ottavio Brume",
        avatar: BRUME_C4,
        start: "gr_b_moli",
        introBg: "gr_piazza",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · IL CAVALIERE DELLA NOTTE</b> Porto Scuro, banchine della vecchia Dogana. La pioggia cade obliqua sui battelli d'ormeggio e sui binari arrugginiti."
          ],
          [
            "gr_brume",
            "[serio] (Stringe il pomo d'argento dell'ombrello bagnato.) A Porto Scuro tutti credono che io sia un mostro senza scrupoli. La verità è più complessa: io non compro le partite per vanità, ma per evitare che i clan del carbone incendino le gradinate ogni domenica. Ma stanotte un socio occulto del consiglio ha alterato i libri mastri della Nebbia S.p.A. e trafugato la matrice dei pagamenti. Se quel registro finisce nelle mani sbagliate, la città sprofonderà in una guerra civile tra moli. Gancio mi aspetta davanti alla Vecchia Dogana: devo recuperare la combinazione del caveau prima che scatti l'alba."
          ]
        ],
        goal: {
          0: "Raggiungi il lampione d'ormeggio (in basso a destra sul molo) per recuperare il messaggio cifrato.",
          1: "Entra nella Palazzina della Dogana (in alto a sinistra) e parla con Gancio.",
          2: "Esamina la cassaforte a combinazione (tessera M) ed esegui la decifrazione dei registri.",
          3: "Affronta la commissaria Dora Valli giunta a perlustrare il molo nella notte."
        },
        goalDone: "Il Capitolo 4 è completato. Il confronto finale ti attende nel Capitolo 5.",
        cast: { ...CAST },
        cos: {
          gr_b_sciarpa: {
            kind: "acc",
            label: "Sciarpa di Seta Grigia",
            val: "sciarpa",
            from: "Dossier Il Cavaliere della Notte · Capitolo 4"
          }
        },
        lore: {
          l_caveau_dogana: {
            t: "Il Caveau Cifrato della Dogana",
            d: "Una camera blindata a doppia serratura a dischi numerati nei sotterranei del Molo Tre. Custodisce le ricevute contabili e i salvacondotti di tutti i commerci marittimi della città."
          }
        },
        zones: {
          gr_b_moli: {
            region: "porto",
            name: "Dossier Grigio · Banchine della Vecchia Dogana",
            short: "Banchine Dogana",
            sub: "Gru addormentate, binari bagnati e la pioggia battente sui moli",
            bg: "gr_piazza",
            time: "notte",
            w: 32,
            h: 22,
            start: [15, 15],
            areas: [
              [3, 2, 11, 7, "La Palazzina della Dogana"],
              [1, 8, 30, 19, "Le Banchine del Porto"]
            ],
            act: {
              n: "Leggi l'ordinanza doganale",
              l: "Esamina il lampione d'ormeggio",
              b: "Siediti sulla bitta",
              x: "Apri la cassa degli ormeggiatori",
              K: "Guarda le casse di legname",
              E: "Guarda il container rugginoso",
              s: "Riposa"
            },
            flavor: {
              n: "Un'ordinanza della Capitaneria sbiadita dall'acqua: «DIVIETO DI SCARICO MERCI NON AUTORIZZATE DOPO LE ORE VENTIDUE». Sotto, a matita: «La nebbia autorizza tutto».",
              l: "Un lampione di ghisa con la lente protetta da una gabbia metallica. La luce dorata trema tra le gocce di pioggia.",
              b: "Una bitta d'acciaio massiccio lucidata dalle gomene dei pescherecci.",
              x: "Una cassa di legno rinforzata con cerchiature di ferro, usata per i cavi d'acciaio.",
              K: "Casse marchiate «NEBBIA S.P.A.». Odore di legno marcio, catrame e vecchi registri.",
              E: "Un container rosso cupo con la sigla della Lega Portuale verniciata a stencil."
            },
            intro: [
              [
                "voce",
                "Porto Scuro, Molo Tre. L'acqua nera del bacino riflette i bagliori opachi delle navi alla fonda."
              ]
            ],
            npcs: [
              { id: "gr_sg2", at: [20, 12], when: { step: [0, 2] } },
              { id: "gr_dora", at: [15, 13], when: { step: [3, 9] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 8, 30, 9, ":"],
              ["lay", 7, 8, 7, 14, ":"],
              ["lay", 15, 8, 15, 18, ":"],
              ["lay", 1, 10, 30, 16, "+"],
              ["lay", 0, 20, 31, 21, "w"],
              ["house", 3, 2, 9, 6, { door: [7, 7], roof: "#2a2e3a", wall: "#4a4e58", rr: 2, lit: true, enter: { to: "gr_b_ufficio", at: [8, 9] } }],
              ["put", 16, 2, "E"],
              ["put", 22, 14, "K"],
              ["put", 4, 18, "K"],
              ["put", 27, 18, "K"],
              ["put", 6, 10, "l"],
              ["put", 24, 10, "l"],
              ["put", 26, 12, "l"],
              ["put", 6, 17, "l"],
              ["put", 24, 17, "l"],
              ["put", 12, 12, "b"],
              ["put", 18, 12, "b"],
              ["put", 15, 10, "n"],
              ["put", 26, 16, "x"],
              ["put", 10, 18, "s"]
            ]
          },
          gr_b_ufficio: {
            interior: true,
            region: "casa",
            name: "Dossier Grigio · Ufficio Blindato della Dogana",
            short: "Ufficio Dogana",
            sub: "Scaffali carichi di faldoni, odore di sigaro e la cassaforte a muro",
            bg: "gr_officina",
            w: 16,
            h: 12,
            start: [8, 9],
            outside: ["gr_b_moli", 7, 8],
            act: {
              M: "Esamina la cassaforte a combinazione",
              T: "Guarda il tavolo delle ricevute",
              L: "Ispeziona i faldoni archiviati",
              v: "Esci sul molo"
            },
            flavor: {
              M: "La cassaforte a combinazione numerica della Nebbia S.p.A.: un blocco d'acciaio al tungsteno con manopola a sei posizioni.",
              T: "Il massiccio tavolo di rovere con timbri a ceralacca, calamaio di peltro e un sigaro spento nel posacenere.",
              L: "Scaffalature metalliche ricolme di bolle di carico, manifesti di navigazione e ricevute della Lega."
            },
            intro: [
              [
                "voce",
                "L'Ufficio Blindato della Dogana: silenzio ovattato, il ticchettio di un orologio a pendolo e l'odore penetrante di carta invecchiata."
              ]
            ],
            npcs: [
              { id: "gr_gancio", at: [8, 4], when: { step: [1, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 8),
              ["put", 4, 4, "M"],
              ["put", 11, 4, "T"],
              ["put", 2, 2, "L"],
              ["put", 13, 2, "L"],
              ["put", 2, 9, "l"],
              ["put", 13, 9, "l"]
            ]
          }
        },
        talk: {
          gr_gancio: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    [
                      "gr_gancio",
                      "[voce roca stringendo le mani callose] Presidente Brume. Non pensavo venisse di persona con questo diluvio."
                    ],
                    [
                      "gr_brume",
                      "[asciutto] Quando i miei soci perdono il senso della misura, Gancio, preferisco non delegare. Chi ha toccato la cassaforte?"
                    ],
                    [
                      "gr_gancio",
                      "[abbassa lo sguardo] Due uomini del Molo Cinque. Hanno sfilato la matrice contabile e riprogrammato il tamburo a dischi per bloccare l'accesso. La cassaforte è lì dietro la morsa (tessera M): se qualcuno può decifrarla, quello è lei."
                    ]
                  ]
                },
                { step: 2 },
                {
                  quest: [
                    "gr_c4_caveau",
                    "Il Caveau della Dogana",
                    "Esamina la cassaforte a combinazione (M) nell'ufficio doganale e decifra la combinazione."
                  ]
                },
                { done: true }
              ]
            },
            {
              when: { step: 2 },
              do: [
                {
                  say: [
                    [
                      "gr_gancio",
                      "[fa la guardia alla porta] Si sbrighi col disco cifrato, presidente. Sento passi pesanti all'esterno sulla banchina."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              when: { step: [3, 9] },
              do: [
                {
                  say: [
                    [
                      "gr_gancio",
                      "[annuisce sollevato] I conti sono al sicuro. Ma la commissaria Valli è appena scesa dall'auto pattuglia davanti al cancello."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_gancio",
                      "[serio] Io proteggo i portuali, presidente. Il resto lo lascio ai suoi registri."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gr_dora: [
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    [
                      "gr_dora",
                      "[serio sollevando il bavero dell'impermeabile bagnato] Buonasera, presidente Brume. Mezzanotte passata, una palazzina doganale sigillata e la cassaforte aperta. Mi dica una sola buona ragione per non portarla in questura prima che smetta di piovere."
                    ]
                  ]
                },
                {
                  ask: {
                    who: "gr_dora",
                    prompt: "Come rispondi alla commissaria della polizia portuale?",
                    options: [
                      {
                        label: "Mostra le prove del tradimento interno",
                        sub: "Consegna a Dora la matrice contabile coi nomi dei veri sabotatori del porto",
                        cls: "hot",
                        big: true,
                        do: [
                          {
                            say: [
                              [
                                "gr_brume",
                                "[calmo estrae il foglio cifrato dalla tasca interna] Non stavo rubando, commissaria. Stavo impedendo che una cricca di usurai del Molo Cinque affamasse le famiglie dei portuali. Legga qui: nomi, conti e partite alterate alle mie spalle."
                              ],
                              [
                                "gr_dora",
                                "[legge attentamente socchiudendo gli occhi sotto la pioggia] Cifre inoppugnabili... Dunque anche il Mercante di Nebbia ha dei nemici nel buio. Per stanotte lascio il taccuino chiuso, Brume. Ma domani esigo chiarezza assoluta."
                              ]
                            ]
                          },
                          { flag: { gr_b_collabora_dora: true } },
                          { call: "concludi_c4" }
                        ]
                      },
                      {
                        label: "Rivendica il tuo ruolo di garante della pace",
                        sub: "Spiega che senza la tua fermezza Porto Scuro cadrebbe nel sangue",
                        big: true,
                        do: [
                          {
                            say: [
                              [
                                "gr_brume",
                                "[sguardo fermo e voce d'acciaio] Lei vede reati dove io vedo sopravvivenza, commissaria. Se la Lega del Porto non regolasse le tensioni tra le banchine, domani contereste i feriti nei canali. Ho sistemato i conti. La città dorme tranquilla."
                              ],
                              [
                                "gr_dora",
                                "[un mezzo sorriso amaro] Il suo cinismo è impeccabile, presidente. Ma non confonda la pazienza della legge con la debolezza. Ci rivedremo presto."
                              ]
                            ]
                          },
                          { flag: { gr_b_freddo_dora: true } },
                          { call: "concludi_c4" }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            {
              when: { step: [4, 9] },
              do: [
                {
                  say: [
                    [
                      "gr_dora",
                      "[seria sotto l'ombrello] La notte è quasi finita, Brume. Domani al Circolo Nautico tireremo le somme definitive."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_dora",
                      "[osserva i moli] Nessuna ombra dura per sempre a Porto Scuro."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gr_sg2: [
            {
              when: { step: [0, 2] },
              do: [
                {
                  say: [
                    [
                      "gr_sg2",
                      "[torcia alla mano fa un cenno rispettoso col cappellino] Buonasera, presidente Brume. Gancio la aspetta dentro l'ufficio della dogana. La zona è deserta, solo gabbiani e pozzanghere."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              when: { step: [3, 9] },
              do: [
                {
                  say: [
                    [
                      "gr_sg2",
                      "[nervoso] È arrivata la commissaria, presidente... Io faccio finta di guardare le gomene degli ormeggi."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_sg2",
                      "[guarda la pioggia] Piove sempre sul bagnato da queste parti."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "gr_b_moli:l": [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "gr_brume",
                      "[svita la base metallica del lampione d'ormeggio ed estrae un cilindro d'ottone] Ecco il messaggio di Gancio: «La matrice cifrata è ancora nel caveau, ma i traditori hanno resettato i tamburi numerici». Devo entrare subito nell'ufficio della Dogana a sinistra."
                    ]
                  ]
                },
                { step: 1 },
                {
                  quest: [
                    "gr_c4_gancio",
                    "All'Ufficio Dogana",
                    "Entra nella Palazzina della Dogana (in alto a sinistra) e parla con Gancio."
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_brume",
                      "[pensa] Il lampione d'ormeggio diffonde una luce giallastra sulle pozzanghere scure."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "gr_b_ufficio:M": [
            {
              when: { step: 2 },
              do: [
                {
                  trial: {
                    title: "Decifrazione Caveau",
                    bg: "gr_officina",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        who: "gr_brume",
                        prompt: "Il primo disco della cassaforte è incrostato di salsedine: come individui il primo numero della combinazione segreta?",
                        options: [
                          { label: "Ascoltare lo scatto interno della camma con lo stetoscopio d'ordinanza!", ok: true },
                          { label: "Prendere a calci la maniglia blindata d'acciaio" },
                          { label: "Versare caffè bollente nel foro della chiave" }
                        ],
                        good: "Clac metallico pulitissimo! Il primo perno si allinea sul numero diciotto!",
                        bad: "Falso scatto! Il disco slitta a vuoto facendoti perdere preziosi secondi!"
                      },
                      {
                        who: "gr_brume",
                        prompt: "Il secondo anello richiede la chiave di registro della celebre partita del '72 tra Molo Nove e Arsenal: quale codice inserisci?",
                        options: [
                          { label: "La cifra corrispondente ai tre gol segnati nel recupero sotto la tempesta!", ok: true },
                          { label: "La data di nascita del gatto del guardiano del faro" },
                          { label: "Un numero a caso compreso tra uno e cento" }
                        ],
                        good: "Risonanza perfetta! La serratura secondaria ruota rilasciando la barra d'acciaio!",
                        bad: "Cifra errata: il meccanismo emette un sibilo d'allarme sordo!"
                      },
                      {
                        who: "gr_brume",
                        prompt: "La leva di blocco idraulico è sotto pressione d'olio minerale: quale manovra esegui per sbloccarla?",
                        options: [
                          { label: "Aprire il rubinetto a farfalla sul condotto secondario di sfiato!", ok: true },
                          { label: "Tranciare il tubo col seghetto da ferro arrugginito" },
                          { label: "Chiudere gli occhi e tirare con entrambe le braccia" }
                        ],
                        good: "Pressione scaricata! Il liquido defluisce senza intoppi e la leva cede dolcemente!",
                        bad: "Getto d'olio a pressione! Macchi la manica e perdi aderenza sulla manovella!"
                      },
                      {
                        who: "gr_brume",
                        prompt: "Ultimo passaggio: allineamento delle piastre cifrate del libro mastro della Nebbia S.p.A.!",
                        options: [
                          { label: "Sovrapporre la griglia forata di cartoncino nero sui conti del trimestre!", ok: true },
                          { label: "Bruciare l'angolo della pagina per leggere in controluce" },
                          { label: "Cancellare tutti i numeri con una gomma pane consumata" }
                        ],
                        good: "I nomi dei traditori appaiono nitidi in filigrana! La cassaforte è spalancata!",
                        bad: "Griglia capovolta: i numeri restano una sequenza confusa e disordinata!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "gr_brume",
                            "[richiude il registro con un colpo secco e lo infila sotto il braccio] Perfetto. La contabilità è integra e i traditori sono smascherati."
                          ],
                          [
                            "gr_gancio",
                            "[ammirato] Non ha perso lo smalto di una volta, presidente. Ma fuori sul molo c'è qualcuno con l'impermeabile."
                          ]
                        ]
                      },
                      { flag: { gr_b_caveau_vinto: true } },
                      { step: 3 },
                      {
                        quest: [
                          "gr_c4_dora",
                          "Sul Molo nella Notte",
                          "Esci dall'ufficio della dogana e affronta la commissaria Dora Valli sulla banchina."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "gr_brume",
                            "[pulisce i polsini macchiati d'olio con un fazzoletto di lino] Serratura forzata a fatica, ma il registro è finalmente nelle mie mani."
                          ],
                          [
                            "gr_gancio",
                            "[preoccupato] Abbiamo fatto troppo rumore, presidente. La commissaria Valli è già scesa sul molo."
                          ]
                        ]
                      },
                      { flag: { gr_b_caveau_perso: true } },
                      { step: 3 },
                      {
                        quest: [
                          "gr_c4_dora",
                          "Sul Molo nella Notte",
                          "Esci dall'ufficio della dogana e affronta la commissaria Dora Valli sulla banchina."
                        ]
                      },
                      { done: true }
                    ]
                  }
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_brume",
                      "[pensa] La cassaforte è chiusa. Il metallo è freddo come il ghiaccio del porto."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "gr_b_moli:x": [
            {
              when: { notFlag: "gr_b_baule_c4" },
              do: [
                { flag: { gr_b_baule_c4: true } },
                { cred: 40 },
                {
                  say: [
                    [
                      "gr_brume",
                      "[trova una scatola di sigari avana sigillati e quaranta monete d'oro] Un piccolo fondo d'emergenza che torna sempre utile."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_brume",
                      "[pensa] La cassa è vuota. Solo segatura umida e l'odore della pioggia."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        blocks: {
          concludi_c4: [
            { step: 4 },
            { finish: "dossier_gr_c4" },
            {
              reward: {
                key: "dossier_gr_c4_premio",
                give: { coins: 180, cos: ["gr_b_sciarpa"] }
              }
            },
            {
              scene: [
                [
                  "gr_brume",
                  "[fiero sistema la sciarpa al collo] La notte della dogana è conclusa. Nessuno potrà più ricattare il presidente della Lega del Porto."
                ],
                [
                  "gr_dora",
                  "[seria osserva la sagoma dei mercantili] Domani al Circolo Nautico, Brume. La città esige una risposta definitiva."
                ],
                [
                  "voce",
                  "<b>CAPITOLO 4 DEL DOSSIER CONCLUSO</b> {reward}<br>Ottavio Brume ha recuperato i registri segreti della Nebbia S.p.A. Nel Capitolo 5 lo attende il confronto decisivo al Circolo Nautico!"
                ]
              ],
              openMain: true,
              bg: "gr_piazza"
            }
          ]
        }
      },
      {
        n: 5,
        title: "L'Ultimo Salotto sul Molo",
        sub: "Dossier Incompiuto: il destino di Porto Scuro, dal punto di vista di Ottavio Brume",
        avatar: BRUME_C5,
        start: "gr_b_porto",
        introBg: "gr_stadio",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · IL CAVALIERE DELLA NOTTE</b> Il Terrazzino del Circolo Nautico dei Mercanti. Dai grandi finestroni si scorge il profilo scuro dello Stadio della Gru sotto i lampioni."
          ],
          [
            "gr_brume",
            "[pensa] (Versa un goccio di sherry nel cristallo.) La finale tra Porto Scuro e Nebbia Athletic ha cambiato ogni equilibrio. La città non appartiene più a chi comanda nell'ombra, ma a chi ha il coraggio di camminare alla luce del giorno. Ho convocato qui la commissaria Dora Valli e la capitana Marisa Onda per l'ultimo bilancio dei conti. Nessun segreto può durare per sempre nella nebbia."
          ]
        ],
        goal: {
          0: "Parla con Marisa Onda sul molo davanti al Circolo Nautico (in basso a sinistra).",
          1: "Entra nel Salotto dei Mercanti (in alto a destra) e parla con la commissaria Dora Valli.",
          2: "Esamina il tavolo di corrispondenza (tessera U) ed esegui la verifica dei conti della Lega.",
          3: "Affronta il bivio decisivo tra il Patto del Silenzio e la fuga solitaria del Mercante."
        },
        goalDone: "Dossier Incompiuto completato. Il destino di Ottavio Brume è sigillato.",
        cast: { ...CAST },
        cos: {
          gr_b_cappotto: {
            kind: "shirt",
            label: "Soprabito di Panno Scuro",
            val: "#2a2a34",
            from: "Dossier Il Cavaliere della Notte · Capitolo 5"
          }
        },
        lore: {
          l_circolo_mercanti: {
            t: "Il Circolo Nautico dei Mercanti",
            d: "Un salotto con boiserie di mogano, poltrone di cuoio consumate e quadri di velieri dell'Ottocento affacciato sul bacino portuale. Per trent'anni qui si sono decisi i destini del campionato e del commercio della città."
          }
        },
        endings: {
          brume_patto_silenzio: [
            "IL PATTO DEL SILENZIO",
            "Ottavio Brume consegna alla commissaria Valli i registri completi e rinuncia a ogni carica, donando la cassa della Lega per ricostruire lo Stadio della Gru e garantire campionati liberi.",
            "Scegli il Patto del Silenzio con la Polizia Portuale nel finale del Capitolo 5."
          ],
          brume_scacco_ombra: [
            "L'ULTIMO MERCANTE",
            "Brume non si piega a giudizi: sale sulla sua lancia a vapore e scompare per sempre nella nebbia del largo, lasciando a Porto Scuro una cassa anonima con i fondi per i giovani del porto.",
            "Scegli la via dell'esilio solitario nel finale del Capitolo 5."
          ]
        },
        zones: {
          gr_b_porto: {
            region: "porto",
            name: "Dossier Grigio · Banchina del Circolo Nautico",
            short: "Banchina Circolo",
            sub: "Lampioni a gas, onde scure contro i frangiflutti e il profilo dei cantieri",
            bg: "gr_stadio",
            time: "tramonto",
            w: 32,
            h: 22,
            start: [16, 14],
            areas: [
              [20, 2, 28, 7, "Il Circolo Nautico dei Mercanti"],
              [1, 8, 30, 19, "La Banchina dei Cantieri"]
            ],
            act: {
              n: "Leggi la targa d'ottone del Circolo",
              l: "Guarda il lampione dorato",
              b: "Siediti sulla panchina riparata",
              x: "Apri il forziere della banchina",
              K: "Guarda le botti di rovere",
              A: "Guarda l'insegna del Circolo",
              s: "Riposa"
            },
            flavor: {
              n: "Una targa d'ottone lucido: «CIRCOLO NAUTICO DEI MERCANTI · FONDATO NEL 1898 · IN MARE E SUI CAMPI, ONORE E COMMERCIO».",
              l: "Un lampione in stile Liberty con vetro smerigliato che illumina la scalinata del Circolo.",
              b: "Panchina di ferro battuto dipinta di verde scuro, asciugata dalla tettoia in rame.",
              x: "Un forziere d'ormeggio con borchie d'ottone e chiusura a lucchetto.",
              K: "Botti di rovere destinate alle cambuse dei piroscafi transatlantici.",
              A: "L'insegna luminosa al neon azzurro del Circolo che riflette sulle pozzanghere della banchina."
            },
            intro: [
              [
                "voce",
                "Porto Scuro, la banchina nobile davanti al Circolo Nautico. L'odore di tabacco e legno pregiato filtra dalle porte a vetri."
              ]
            ],
            npcs: [
              { id: "gr_marisa", at: [12, 14], when: { step: 0 } },
              { id: "gr_gancio", at: [8, 13], when: { step: [0, 3] } },
              { id: "gr_alfio", at: [16, 12], when: { step: [0, 3] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 10, 30, 11, ":"],
              ["lay", 24, 8, 24, 11, ":"],
              ["lay", 1, 12, 30, 17, "+"],
              ["lay", 0, 20, 31, 21, "w"],
              ["house", 20, 2, 9, 6, { door: [24, 7], roof: "#1a1e28", wall: "#5a5e68", rr: 2, lit: true, enter: { to: "gr_b_salotto", at: [8, 9] } }],
              ["put", 4, 2, "K"],
              ["put", 10, 2, "K"],
              ["put", 15, 2, "A"],
              ["put", 5, 10, "l"],
              ["put", 27, 10, "l"],
              ["put", 5, 18, "l"],
              ["put", 27, 18, "l"],
              ["put", 10, 13, "b"],
              ["put", 22, 13, "b"],
              ["put", 16, 9, "n"],
              ["put", 28, 18, "x"],
              ["put", 14, 18, "s"]
            ]
          },
          gr_b_salotto: {
            interior: true,
            region: "casa",
            name: "Dossier Grigio · Il Salotto dei Mercanti",
            short: "Salotto Mercanti",
            sub: "Boiserie di mogano, camino acceso e quadri di antichi velieri",
            bg: "gr_officina",
            w: 16,
            h: 12,
            start: [8, 9],
            outside: ["gr_b_porto", 24, 8],
            act: {
              U: "Esamina il tavolo di corrispondenza",
              T: "Guarda lo scrittoio presidenziale",
              W: "Osserva la pioggia dalla vetrata",
              L: "Ispeziona la biblioteca storica",
              b: "Siediti sulla poltrona di cuoio",
              v: "Esci sulla banchina"
            },
            flavor: {
              U: "Il grande tavolo di noce dove sono allineati i registri contabili della Lega, le ricevute bancarie e i contratti dei giocatori.",
              T: "Lo scrittoio presidenziale di Brume con calamaio di cristallo, tagliacarte d'avorio e una copia del regolamento della Lega.",
              W: "Un'imponente vetrata ad arco che si affaccia sul canale d'uscita del porto verso il mare aperto.",
              L: "Scaffali con annuari del calcio portuale dal 1930 ad oggi rilegati in pelle verde bosco.",
              b: "Poltrona in cuoio capitonné color bordeaux, comodissima e profumata di cera d'api."
            },
            intro: [
              [
                "voce",
                "Il Salotto dei Mercanti: il crepitio del camino diffonde un calore asciutto e rassicurante, in netto contrasto con la pioggia che sferza i vetri."
              ]
            ],
            npcs: [
              { id: "gr_dora", at: [8, 4], when: { step: [1, 9] } },
              { id: "gr_marisa", at: [11, 6], when: { step: [1, 9] } },
              { id: "gr_gancio", at: [4, 6], when: { step: [3, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 8),
              ["put", 4, 4, "U"],
              ["put", 11, 4, "T"],
              ["put", 7, 2, "W"],
              ["put", 2, 2, "L"],
              ["put", 13, 2, "L"],
              ["put", 2, 7, "b"],
              ["put", 13, 7, "b"],
              ["put", 2, 9, "l"],
              ["put", 13, 9, "l"]
            ]
          }
        },
        talk: {
          gr_marisa: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "gr_marisa",
                      "[fascia di capitano al braccio e sguardo limpido] Buonasera, presidente Brume. Mi hanno detto che voleva parlarmi prima della riunione al Circolo."
                    ],
                    [
                      "gr_brume",
                      "[voce pacata e rispettosa] Buonasera, capitana Onda. Volevo dirle che domenica la sua squadra ha giocato con una dignità che non vedevo a Porto Scuro da trent'anni. Senza paure e senza trucchi."
                    ],
                    [
                      "gr_marisa",
                      "[sorride con orgoglio] Abbiamo giocato a calcio, presidente. Solo a calcio. La commissaria Valli la aspetta su nel Salotto dei Mercanti (la porta a destra). Vada: oggi si decide che aria respirerà la nostra città."
                    ]
                  ]
                },
                { step: 1 },
                {
                  quest: [
                    "gr_c5_dora",
                    "Nel Salotto dei Mercanti",
                    "Entra nel Salotto del Circolo Nautico (in alto a destra) e parla con la commissaria Dora Valli."
                  ]
                },
                { done: true }
              ]
            },
            {
              when: { step: [1, 2] },
              do: [
                {
                  say: [
                    [
                      "gr_marisa",
                      "[osserva le carte sul tavolo] I conti della Lega devono tornare puliti, presidente. Il Porto Scuro Calcio è pronto a fare la sua parte."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    [
                      "gr_marisa",
                      "[seria e fiera] Qualunque sia la sua scelta, presidente Brume, da domenica prossima a Porto Scuro vincerà solo chi segna un gol in più sul campo."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_marisa",
                      "[guarda verso lo stadio] Il calcio a Porto Scuro ha di nuovo un futuro."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gr_dora: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    [
                      "gr_dora",
                      "[in piedi davanti al camino con una cartella sottobraccio] È arrivato, Brume. Ha portato i libri mastri della Nebbia S.p.A. e le contabili della Lega?"
                    ],
                    [
                      "gr_brume",
                      "[appoggia i faldoni rilegati sul tavolo U] Ogni singola transazione, commissaria. Dalle forniture di carbone ai premi partita degli ultimi dieci campionati."
                    ],
                    [
                      "gr_dora",
                      "[determinata] Allora procediamo all'audit immediato. Mettiamoci al tavolo di corrispondenza (tessera U): dobbiamo verificare gli ammanchi della cassa mutua e isolare le quote truccate. Dimostri che sa ancora distinguere la contabilità dall'inganno."
                    ]
                  ]
                },
                { step: 2 },
                {
                  quest: [
                    "gr_c5_audit",
                    "Audit della Lega",
                    "Usa il tavolo di corrispondenza (U) nel Salotto dei Mercanti per completare la verifica contabile."
                  ]
                },
                { done: true }
              ]
            },
            {
              when: { step: 2 },
              do: [
                {
                  say: [
                    [
                      "gr_dora",
                      "[controlla i faldoni con una lente d'ingrandimento] Si metta al tavolo (U), Brume. C'è una discrepanza evidente sui biglietti dello Stadio della Gru da chiarire."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    [
                      "gr_dora",
                      "[chiude la cartella con solennità] L'audit è impeccabile, Brume. Non c'è più nebbia tra queste carte. Ora la decisione è solo sua: può firmare il Patto del Silenzio consegnando i registri alla giustizia e garantendo la rinascita del porto, oppure può salpare da uomo libero e solitario verso il largo lasciando i fondi anonimi alla città. Cosa decide?"
                    ]
                  ]
                },
                {
                  ask: {
                    who: "gr_dora",
                    prompt: "Quale destino sceglie Ottavio Brume per la sua uscita di scena?",
                    options: [
                      {
                        label: "Patto del Silenzio: consegno i registri alla Polizia Portuale",
                        sub: "Finale: Il Patto del Silenzio · Riscossa trasparente per Porto Scuro",
                        cls: "hot",
                        big: true,
                        do: [{ call: "finale_patto_silenzio" }]
                      },
                      {
                        label: "L'Ultimo Mercante: salpo verso il largo e svanisco nella nebbia",
                        sub: "Finale: L'Ultimo Mercante · Esilio solitario con donazione anonima",
                        big: true,
                        do: [{ call: "finale_scacco_ombra" }]
                      }
                    ]
                  }
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_dora",
                      "[ripone la stilografica] La legge ha fatto il suo corso a Porto Scuro."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gr_gancio: [
            {
              when: { step: [0, 3] },
              do: [
                {
                  say: [
                    [
                      "gr_gancio",
                      "[berretto in mano e sguardo grato] Presidente, qualunque cosa decida lassù, i portuali del Molo Nove non dimenticheranno che ha salvato la cassa mutua dalle mani degli usurai."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_gancio",
                      "[fiero] Il porto è duro, ma riconosce chi mantiene la parola data."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gr_alfio: [
            {
              when: { step: [0, 3] },
              do: [
                {
                  say: [
                    [
                      "gr_alfio",
                      "[grembiule da magazziniere e sorriso quieto] Ti guardo da quarant'anni, Ottavio. Credevi che il mantello dell'Airone fosse una favola per spaventare i trafficanti. Invece l'Airone è sempre stato il riflesso della coscienza di questa città."
                    ],
                    [
                      "gr_brume",
                      "[accenna un sorriso malinconico] Forse avevi ragione tu, vecchio Alfio. Ma qualcuno doveva pur pagare le bollette della luce allo stadio."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_alfio",
                      "[pensa] Le reti dello stadio sono riparate. Domenica si gioca sul serio."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "gr_b_salotto:U": [
            {
              when: { step: 2 },
              do: [
                {
                  trial: {
                    title: "Audit della Lega",
                    bg: "gr_officina",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        who: "gr_dora",
                        prompt: "Discrepanza tra gli incassi del botteghino dello Stadio della Gru e i versamenti alla federazione: dove si nasconde l'ammanco?",
                        options: [
                          { label: "Nei blocchetti doppi stampati clandestinamente dalla tipografia del Molo Cinque!", ok: true },
                          { label: "Nel cassetto delle caramelle all'anice della biglietteria" },
                          { label: "Sotto la gradinata dove nidificano i gabbiani" }
                        ],
                        good: "Centrato! La matrice ricalcata svela trentamila biglietti fantasma!",
                        bad: "Falsa pista: perdi tempo tra ricevute fiscali perfettamente regolari!"
                      },
                      {
                        who: "gr_dora",
                        prompt: "Un bonifico estero porta la causale fittizia «Fornitura corde di canapa»: a chi era realmente destinato?",
                        options: [
                          { label: "Ai mediatori delle scommesse clandestine per condizionare l'arbitraggio della semifinale!", ok: true },
                          { label: "Al pescatore di triglie del canale ovest" },
                          { label: "Alla ditta di vernici per ridipingere le traverse" }
                        ],
                        good: "Fattura smascherata! I conti neri della corruzione arbitrale crollano come birilli!",
                        bad: "Causale confusa: la contabilità estera sembra lecita a una prima occhiata!"
                      },
                      {
                        who: "gr_dora",
                        prompt: "La voce «Manutenzione riflettori»: chi firmava le perizie gonfiate senza aver mai acceso una lampada?",
                        options: [
                          { label: "L'ispettore corrotto della commissione vigilanza municipale!", ok: true },
                          { label: "Il custode del faro in pensione da dieci anni" },
                          { label: "Un venditore ambulante di ombrelli rotti" }
                        ],
                        good: "Firma inchiodata! La perizia truffaldina è annullata con un tratto di penna rossa!",
                        bad: "Documento scambiato: hai contestato una regolare fornitura di cavi elettrici!"
                      },
                      {
                        who: "gr_dora",
                        prompt: "Chiusura del bilancio: come si garantisce la totale trasparenza dei fondi residui della cassa mutua?",
                        options: [
                          { label: "Depositare l'intero patrimonio in un conto fiduciario intestato ai lavoratori del porto!", ok: true },
                          { label: "Distribuire monete dal balcone durante la tempesta notturna" },
                          { label: "Nascondere i contanti dentro un vecchio pallone di cuoio" }
                        ],
                        good: "Chiusura impeccabile! Nessuna banca e nessun clan potrà più toccare i fondi del porto!",
                        bad: "Mancanza di sigilli: il fondo resta vulnerabile a contestazioni legali!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "gr_dora",
                            "[annuisce con profondo rispetto] Revisione perfetta, Brume. Ha dimostrato una lucidità chirurgica. I fondi dei lavoratori sono salvi."
                          ],
                          [
                            "gr_brume",
                            "[chiude il calamaio d'argento] I numeri non mentono mai, commissaria. Erano gli uomini a piegarli."
                          ]
                        ]
                      },
                      { flag: { gr_b_audit_vinto: true } },
                      { step: 3 },
                      {
                        quest: [
                          "gr_c5_scelta",
                          "La Resa dei Conti",
                          "Parla con la commissaria Dora Valli nel Salotto dei Mercanti per compiere la scelta finale."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "gr_dora",
                            "[riordina i fogli sparsi] Qualche contestazione formale sui registri del '72, ma la sostanza è solida e l'ammanco è azzerato."
                          ],
                          [
                            "gr_brume",
                            "[asciutto] Ciò che conta è che la cassa mutua sia blindata. Ora affrontiamo l'ultimo bivio."
                          ]
                        ]
                      },
                      { flag: { gr_b_audit_perso: true } },
                      { step: 3 },
                      {
                        quest: [
                          "gr_c5_scelta",
                          "La Resa dei Conti",
                          "Parla con la commissaria Dora Valli nel Salotto dei Mercanti per compiere la scelta finale."
                        ]
                      },
                      { done: true }
                    ]
                  }
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_brume",
                      "[pensa] I registri contabili sono aperti sul tavolo di noce. Le cifre scorrono ordinate in inchiostro nero."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "gr_b_porto:x": [
            {
              when: { notFlag: "gr_b_baule_c5" },
              do: [
                { flag: { gr_b_baule_c5: true } },
                { cred: 50 },
                {
                  say: [
                    [
                      "gr_brume",
                      "[trova una medaglia ricordo del primo campionato del porto e cinquanta monete d'oro] Un pezzo di storia che merita di essere custodito."
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    [
                      "gr_brume",
                      "[pensa] Il forziere della banchina è vuoto. Resta solo l'odore della salsedine."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        blocks: {
          finale_patto_silenzio: [
            {
              say: [
                [
                  "gr_brume",
                  "[posa la stilografica d'oro sul tavolo di mogano e fa scivolare il registro rilegato nelle mani di Dora] Il mio tempo come presidente della Lega del Porto finisce qui, commissaria. Consegno alla giustizia ogni nome, ogni conto e ogni segreto. La cassa della Lega andrà a ristrutturare lo Stadio della Gru e a finanziare le scuole calcio dei moli."
                ],
                [
                  "gr_dora",
                  "[commossa stringe con calore la mano di Brume] La legge non dimentica gli errori del passato, Ottavio, ma sa riconoscere chi sa fermarsi in tempo e restituire ciò che appartiene alla città. Ha la mia parola: il porto tornerà a respirare."
                ],
                [
                  "gr_marisa",
                  "[sorride fiera] Domenica scenderemo in campo sapendo che ogni gol sarà vero. Grazie, presidente."
                ]
              ]
            },
            { end: "brume_patto_silenzio" },
            { unlock: ["gr_brume", "gr_dora"] },
            { finish: "brume_patto_silenzio" },
            { step: 9 },
            {
              reward: {
                key: "end:brume_patto_silenzio",
                give: { coins: 300, cos: ["gr_b_cappotto"] }
              }
            },
            {
              scene: [
                [
                  "voce",
                  "Ottavio Brume chiude per sempre la porta del Circolo Nautico dei Mercanti. Nelle strade di Porto Scuro la notizia della caduta del Sindacato corre veloce tra i moli, accolta dalle sirene gioiose dei piroscafi."
                ],
                [
                  "gr_brume",
                  "[serio con un lieve sorriso tra i baffi] Non sono mai stato un santo. Ma a volte, per fare giustizia, serviva chi sapesse muoversi nel buio."
                ],
                [
                  "voce",
                  "<b>DOSSIER CONCLUSO: IL PATTO DEL SILENZIO!</b> {reward}<br>Hai sbloccato le carte <b>«Ottavio Brume»</b> e <b>«Commissaria Dora Valli»</b> nella Squadra dei Sogni! Brume ora ti fa visita al Borgo Marino, e nelle Carte del Destino è disponibile il mazzo «Il Dossier di Brume»."
                ]
              ],
              openMain: true,
              bg: "gr_stadio"
            }
          ],
          finale_scacco_ombra: [
            {
              say: [
                [
                  "gr_brume",
                  "[solleva il suo ombrello d'ebano con impeccabile eleganza] Non mi piegherò a tribunali né a processi pubblici, commissaria. Ma non lascio Porto Scuro a mani vuote: sul tavolo c'è una lettera di credito anonima per un milione di lire intestata ai giovani del porto. Usatela per rifare il manto erboso dello stadio."
                ],
                [
                  "gr_dora",
                  "[lo fissa intensamente, poi annuisce lentamente] Se ne va da mercante fino alla fine, Brume. Ha dieci minuti prima che io ordini alle vedette di accendere i riflettori. Li sfrutti bene."
                ],
                [
                  "gr_gancio",
                  "[fa un cenno col capo dal pontile] La lancia è pronta con la caldaia in pressione, presidente. Buona rotta verso il mare aperto."
                ]
              ]
            },
            { end: "brume_scacco_ombra" },
            { unlock: ["gr_brume", "gr_dora"] },
            { finish: "brume_scacco_ombra" },
            { step: 9 },
            {
              reward: {
                key: "end:brume_scacco_ombra",
                give: { coins: 300, cos: ["gr_b_cappotto"] }
              }
            },
            {
              scene: [
                [
                  "voce",
                  "La lancia a vapore di Ottavio Brume taglia le onde scure del canale e si dissolve nella nebbia fitta del largo. Sul tavolo del Circolo resta solo un bicchiere vuoto e la donazione che cambierà per sempre il destino del calcio portuale."
                ],
                [
                  "gr_brume",
                  "[dal ponte della barca guarda affievolirsi le luci dei moli] Addio, Porto Scuro. Impara a vincere con le tue sole forze."
                ],
                [
                  "voce",
                  "<b>DOSSIER CONCLUSO: L'ULTIMO MERCANTE!</b> {reward}<br>Hai sbloccato le carte <b>«Ottavio Brume»</b> e <b>«Commissaria Dora Valli»</b> nella Squadra dei Sogni! Brume ora ti fa visita al Borgo Marino, e nelle Carte del Destino è disponibile il mazzo «Il Dossier di Brume»."
                ]
              ],
              openMain: true,
              bg: "gr_stadio"
            }
          ]
        }
      }
    ]
  });
})();
