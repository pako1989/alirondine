// js/dossier/gp.js - DOSSIER INCOMPIUTI di «Gran Premio del Pallone»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Smeraldo Lime, capitano dei Bolidi Verdi, tuta verde smeraldo, colazione al frullato di menta, paladino della traiettoria pulita e delle corse ecologiche.
// Cap. 4 «La Notte dei Box Verdi» (l'ispezione notturna ai box, il sabotaggio delle valvole e il pit stop d'emergenza).
// Cap. 5 «Il Gran Premio della Pista Smeraldo» (il collaudo sul Circuito Panoramico dei Mulini, la telemetria di staccata e il bivio tra alleanza e indipendenza).
// Minigiochi: «Il Pit Stop d'Emergenza dei Bolidi Verdi» (prova a tempo a scelte, cap. 4) e «La Telemetria della Staccata al Limite» (prova a tempo a scelte, cap. 5).
(function () {
  "use strict";

  const LOOK_SMERALDO = {
    name: "Smeraldo Lime",
    style: "spiky",
    hair: "#2a2a1a",
    eye: "#2a4a2a",
    skin: "#d9a679",
    acc: ["cappellino"]
  };

  const SMERALDO_C4 = {
    name: "Smeraldo Lime",
    num: 1,
    cast: Object.assign(
      { sub: "Capitano dei Bolidi Verdi", shirt: "#1a8a4a", band: "#22c55e", bg: ["#0a2a14", "#1a8a4a"] },
      LOOK_SMERALDO
    )
  };

  const SMERALDO_C5 = {
    name: "Smeraldo Lime",
    num: 1,
    cast: Object.assign(
      { sub: "Asso dei Bolidi Ecologici", shirt: "#22c55e", band: "#4ade80", bg: ["#14532d", "#22c55e"] },
      LOOK_SMERALDO
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
    gp_smeraldo: {
      name: "Smeraldo Lime",
      desc: "Capitano e primo pilota dei Bolidi Verdi. Tuta verde mela, frullato alla menta sempre a portata di mano e fede incrollabile nella trazione pulita: «Il verde non frena, non sbanda e non perde: la traiettoria pulita batte sempre la foga cieca!»",
      look: {
        style: "spiky",
        hair: "#2a2a1a",
        eye: "#2a4a2a",
        skin: "#d9a679",
        shirt: "#1a8a4a",
        band: "#22c55e",
        acc: ["cappellino"],
        bg: ["#0a2a14", "#1a8a4a"]
      }
    },
    gp_clotilde: {
      name: "Clotilde la Meccanica",
      desc: "Capo ingegnere dei box dell'Officina Verde dei Bolidi. Chiave dinamometrica da ventiquattro sempre in mano e cronometro al collo: «Tre secondi netti per quattro gomme e mezzo giro di vite: il Gran Premio si vince nella piazzola di sosta!»",
      look: {
        style: "ponytail",
        hair: "#3a2a1a",
        eye: "#2a4a2a",
        skin: "#e0b890",
        shirt: "#22c55e",
        acc: ["chiave"],
        bg: ["#0a2a14", "#22c55e"]
      }
    }
  };

  const ENDS = ["smeraldo_verde_oro", "smeraldo_solitario"];

  window.__dossierDati.add({
    saga: "gp",
    after: 3,
    guest: {
      id: "gp_smeraldo",
      saga: "Gran Premio del Pallone · Il Dossier di Smeraldo",
      ends: ENDS,
      lines: [
        [
          "gp_smeraldo",
          "[si aggiusta il cappellino verde e beve un sorso di frullato] Che aria salubre qui al Borgo Marino! Niente fumi di scappamento né residui di gomma bruciata. Sai, {n}, stavo giusto pensando di convertire tutte le barche del porto a biocarburante di menta piperita. Verde, veloce ed ecologico! Chi arriva ultimo al molo offre il frullato a tutti!"
        ]
      ]
    },
    deck: {
      id: "gpg",
      t: "Il Dossier di Smeraldo",
      e: "🟢",
      ends: ENDS,
      lock: "Trova un finale del Dossier di Gran Premio del Pallone",
      d: "L'Officina Verde dei Bolidi, chiavi dinamometriche, biocarburanti alla menta e la traiettoria pulita che non teme il cronometro.",
      pg: {
        id: "gp_clotilde",
        n: "Clotilde la Meccanica",
        i: "🔧",
        tr: "furbizia",
        d: "Capo ingegnere dei box dei Bolidi Verdi. Conosce ogni singolo filetto di vite e non sbaglia mai una regolazione.",
        greet: "Gara di collaudo a {a}? Dammi tre secondi per cambiare assetto e ti mostro come si disegna una traiettoria millimetrica!",
        win: "Giro record! La telemetria conferma: staccata perfetta e contropiede imprendibile!",
        lose: "Pressione gomme troppo bassa: abbiamo perso aderenza all'uscita dal tornante."
      },
      ev: {
        n: "La Miscela al Succo di Menta",
        i: "🧪",
        d: "Una tanica di biocarburante sperimentale a zero emissioni ideata da Smeraldo.",
        setup: [
          "Nell'angolo più pulito del box verde trovi una tanica scintillante di biocarburante color smeraldo.",
          "Profuma di menta piperita ed emette un leggero sfrigolio frizzante. Che facciamo?"
        ],
        ch: [
          [
            "Versala nel serbatoio per la prova turbo",
            "audacia",
            "La potenza pulita non teme il banco di prova.",
            "Il motore ruggisce con un suono limpido e dolcissimo, regalando un'accelerazione fulminea e trenta monete di premio collaudo.",
            "La miscela è troppo concentrata: il carburatore starnutisce bolle verdi e tocca spurgare i condotti."
          ],
          [
            "Analizza la purezza col densimetro",
            "furbizia",
            "La chimica dei motori esige precisione assoluta.",
            "La gradazione ottano-mentolo è perfetta: Clotilde approva la formula e ti ricompensa con venti monete e una valvola d'ottone.",
            "Un residuo di polpa di menta ostruisce il tubicino del tester facendoti perdere tempo prezioso."
          ],
          [
            "Offrine un bicchierino rinfrescante ai meccanici",
            "cuore",
            "Il lavoro di squadra va sempre idratato a dovere.",
            "I meccanici rinvigoriti lavorano al doppio della velocità e completano il cambio gomme in tempo record tra applausi e risate.",
            "Il gusto è troppo balsamico: i meccanici tossiscono per dieci minuti cercando una bottiglia d'acqua minerale."
          ]
        ]
      },
      tw: {
        n: "Scia Smeraldo",
        i: "🟢",
        d: "Traiettoria ideale senza fumo né sprechi.",
        win: "Staccata chirurgica sul cordolo: il premio della corsa sale.",
        lose: "Finisci largo sulla ghiaia ecologica: perdi parte del montepremi.",
        mulWin: 1.3,
        mulLose: 0.85
      }
    },
    chapters: [
      {
        n: 4,
        title: "La Notte dei Box Verdi",
        sub: "Dossier Incompiuto: il segreto dei Bolidi Verdi, dal punto di vista di Smeraldo Lime",
        avatar: SMERALDO_C4,
        start: "gp_s_paddock",
        introBg: "gp_paddock",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · GRAN PREMIO DEL PALLONE</b> Palladoro, la notte dopo le gare ufficiali. I riflettori del paddock proiettano ombre lunghe sull'asfalto ancora tiepido."
          ],
          [
            "gp_smeraldo",
            "[serio] (Stringe il volante sagomato con finiture in radica verde.) Il Gran Premio ufficiale si è chiuso, ma per me la vera gara comincia adesso. La mia monoposto ecologica a biocarburante di menta aveva tre decimi di vantaggio nel secondo settore, ma sul rettilineo dei mulini il contagiri è crollato. Qualcuno ha manomesso i distributori del paddock per far sembrare i motori puliti inaffidabili. Clotilde mi aspetta al box per scoprire la verità!"
          ]
        ],
        goal: {
          0: "Controlla la colonnina dei rifornimenti sigillata accanto alla pista (a destra nel paddock).",
          1: "Entra nel Box dei Bolidi Verdi (in alto a sinistra) e parla con Clotilde la meccanica.",
          2: "Ispeziona il banco di lavoro (tessera M) ed esegui il pit stop d'emergenza.",
          3: "Affronta il Commissario Nembo giunto in ispezione notturna nel paddock."
        },
        goalDone: "Il Capitolo 4 è completato. Il collaudo finale ti aspetta nel Capitolo 5.",
        cast: { ...CAST },
        cos: {
          gp_s_visiera: {
            kind: "acc",
            label: "Visiera Verde Smeraldo",
            val: "visiera",
            from: "Dossier Gran Premio del Pallone · Capitolo 4"
          }
        },
        lore: {
          l_motore_verde: {
            t: "Il Propulsore Ecologico Smeraldo",
            d: "Un motore a quattro cilindri progettato per correre a miscela di bioetanolo e menta piperita: zero fumi neri, zero scorie e un'accelerazione fulminea che non inquina le valli di Palladoro."
          }
        },
        zones: {
          gp_s_paddock: {
            region: "pista",
            name: "Dossier GP · Paddock Notturno dei Bolidi",
            short: "Paddock Notturno",
            sub: "Riflettori accesi, asfalto silenzioso e profumo di gomma e menta",
            bg: "gp_paddock",
            time: "notte",
            w: 32,
            h: 22,
            start: [15, 14],
            areas: [
              [3, 2, 11, 7, "Il Box dei Bolidi Verdi"],
              [1, 8, 30, 20, "Il Paddock"]
            ],
            act: {
              n: "Leggi il cartello dei box",
              l: "Guarda il lampione a ioduri",
              b: "Siediti sul cordolo",
              x: "Apri la cassetta dei ricambi",
              Y: "Esamina la colonnina del carburante",
              O: "Guarda le gomme impilate",
              P: "Guarda il podio al buio",
              U: "Guarda il maxischermo in stand-by",
              s: "Riposa"
            },
            flavor: {
              n: "Un cartello con vernice catarifrangente: «PADDOCK NOTTURNO · VELOCITÀ A PASSO D'UOMO · I MOTORI ECOLOGICI NON FANNO RUMORE, MA GUARDATEVI ATTORNO!».",
              l: "Un lampione a ioduri metallici che diffonde una luce bianchissima su tutta la corsia box.",
              b: "Un tratto di cordolo bicolore verde e bianco, ancora caldo dopo le prove libere pomeridiane.",
              x: "Una robusta cassetta metallica verde usata per stivare bulloni di scorta e valvole calibrate.",
              Y: "La colonnina dei rifornimenti del circuito: il contatore dei litri è bloccato e c'è uno strano sigillo di ceralacca.",
              O: "Pneumatici da pioggia impilati con cura: il battistrada è intagliato per evacuare l'acqua all'istante.",
              P: "Il podio silenzioso sotto le stelle: il gradino più alto aspetta chi sa vincere rispettando la pista.",
              U: "Il maxischermo proietta il logo rotante del Gran Premio con la scritta «TEST NOTTURNI IN CORSO»."
            },
            intro: [
              [
                "voce",
                "Palladoro, corsia box nella notte. Il silenzio dell'autodromo è interrotto soltanto dal sibilo del compressore nell'Officina Verde."
              ]
            ],
            npcs: [
              { id: "gp_gridoni", at: [22, 12], when: { step: [0, 2] } },
              { id: "gp_nembo", at: [15, 13], when: { step: [3, 9] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 8, 30, 9, ":"],
              ["lay", 7, 8, 7, 14, ":"],
              ["lay", 15, 8, 15, 18, ":"],
              ["lay", 1, 10, 30, 16, "+"],
              ["house", 3, 2, 9, 6, { door: [7, 7], roof: "#0a2a14", wall: "#22c55e", rr: 2, lit: true, enter: { to: "gp_s_boxverde", at: [8, 9] } }],
              ["put", 26, 12, "Y"],
              ["put", 16, 2, "U"],
              ["put", 22, 14, "O"],
              ["put", 20, 4, "P"],
              ["put", 6, 10, "l"],
              ["put", 24, 10, "l"],
              ["put", 6, 17, "l"],
              ["put", 24, 17, "l"],
              ["put", 12, 12, "b"],
              ["put", 18, 12, "b"],
              ["put", 15, 10, "n"],
              ["put", 26, 16, "x"],
              ["put", 10, 18, "s"]
            ]
          },
          gp_s_boxverde: {
            interior: true,
            region: "box",
            name: "Dossier GP · Officina Verde dei Bolidi",
            short: "Box dei Bolidi",
            sub: "Banco attrezzi ordinatissimo, monoposto verde sui cavalletti e taniche di menta",
            bg: "gp_box",
            w: 16,
            h: 12,
            start: [8, 9],
            outside: ["gp_s_paddock", 7, 8],
            act: {
              M: "Ispeziona il banco attrezzi",
              F: "Ammira la monoposto verde",
              O: "Controlla le gomme di scorta",
              L: "Guarda le mensole dei ricambi",
              v: "Esci nel paddock"
            },
            flavor: {
              M: "Il banco da lavoro di Clotilde: chiavi inglesi ordinate per millimetro, manometri di precisione e un contagiri digitale.",
              F: "La monoposto verde dei Bolidi: carenatura affusolata, telaio alleggerito e serbatoio trasparente al succo di menta.",
              O: "Gomme slick da qualifica: la mescola morbida rilascia un piacevole profumo di caucciù naturale.",
              L: "Mensole con filtri dell'aria in cotone biologico e flaconi di lubrificante vegetale biodegradabile."
            },
            intro: [
              [
                "voce",
                "L'Officina Verde dei Bolidi: pavimentazione in resina epossidica impeccabile, luci a LED smeraldo e ordine chirurgico."
              ]
            ],
            npcs: [
              { id: "gp_clotilde", at: [8, 4], when: { step: [1, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 8),
              ["put", 4, 4, "M"],
              ["put", 11, 4, "F"],
              ["put", 3, 7, "O"],
              ["put", 12, 7, "O"],
              ["put", 2, 2, "L"],
              ["put", 13, 2, "L"],
              ["put", 2, 9, "l"],
              ["put", 13, 9, "l"]
            ]
          }
        },
        talk: {
          gp_clotilde: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    [
                      "gp_clotilde",
                      "[serio] Smeraldo, meno male che sei arrivato! Ho analizzato i dati della pompa esterna: qualcuno ha introdotto paraffina nei condotti della benzina normale per far credere che le miscele ecologiche intasino i filtri!"
                    ],
                    [
                      "gp_smeraldo",
                      "[furbo] Lo sapevo! La lobby del petrolio sporco non sopporta che una monoposto a menta piperita svernici le loro vecchie carrette fumanti."
                    ],
                    [
                      "gp_clotilde",
                      "[decisa] Dobbiamo effettuare subito un pit stop d'emergenza al banco di prova: smontare i quattro dadi ruota, pulire gli iniettori, ricalibrare l'alettone e montare le gomme preriscaldate! Mettiti al banco attrezzi (tessera M): cronometro alla mano!"
                    ]
                  ]
                },
                { step: 2 },
                {
                  quest: [
                    "gp_c4_pit",
                    "Il Pit Stop d'Emergenza",
                    "Usa il banco attrezzi (M) nell'officina verde per completare il pit stop a tempo."
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
                      "gp_clotilde",
                      "[agitata col cronometro] Forza Smeraldo! Il banco attrezzi è pronto: vai alla morsa e iniziamo il cambio assetto!"
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
                      "gp_clotilde",
                      "[soddisfatta] Il motore è un orologio svizzero a zero emissioni! Vai fuori nel paddock: ho visto il Commissario Nembo avvicinarsi con fare sospetto."
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
                      "gp_clotilde",
                      "[pensa] Bulloni serrati a quaranta Newton-metro. Nessuno fermerà i Bolidi Verdi!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gp_nembo: [
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    [
                      "gp_nembo",
                      "[serio sventolando il taccuino d'ordinanza] Smeraldo Lime! Ho ricevuto una segnalazione anonima secondo cui la tua scuderia userebbe carburanti clandestini al sapore di mentolo non omologati dall'Ufficio Gare. Io vigilo, verbalizzo e controllo i sigilli. Cos'hai da dichiarare?"
                    ]
                  ]
                },
                {
                  ask: {
                    who: "gp_nembo",
                    prompt: "Cosa dichiari al Commissario di Gara per fugare ogni dubbio?",
                    options: [
                      {
                        label: "Mostra la certificazione verde",
                        sub: "Esibisci il certificato di emissioni zero e l'encomio ecologico",
                        cls: "hot",
                        big: true,
                        do: [
                          {
                            say: [
                              [
                                "gp_smeraldo",
                                "[fiero] Ecco qui il timbro del Ministero dell'Ambiente di Palladoro: bioetanolo da barbabietola e distillato di menta selvatica. Zero particolato, cento per cento biodegradabile!"
                              ],
                              [
                                "gp_nembo",
                                "[sorpreso controllando col binocolo] Per tutte le nubi temporalesche! È più limpido dell'acqua di sorgente. Non solo è regolare, ma il regolamento prevede tre punti di bonus per il rispetto del paesaggio! Verbale chiuso con lode."
                              ]
                            ]
                          },
                          { flag: { gp_s_certificato_mostrato: true } },
                          { call: "concludi_c4" }
                        ]
                      },
                      {
                        label: "Sfida Nembo alla prova dei fumi",
                        sub: "Invita il commissario ad annusare direttamente il tubo di scarico",
                        big: true,
                        do: [
                          {
                            say: [
                              [
                                "gp_smeraldo",
                                "[ride] Accenda pure la sonda dei fumi, Commissario! Dal nostro scarico esce solo aria fresca che profuma di caramella balsamica!"
                              ],
                              [
                                "gp_nembo",
                                "[inspira profondamente tossicchiando di gioia] Mmm... menta e brezza alpina! Mi ha persino stappato il naso! Nessuna irregolarità, pilota. La pista è tua."
                              ]
                            ]
                          },
                          { flag: { gp_s_prova_fumi_fatta: true } },
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
                      "gp_nembo",
                      "[felice] Il verde è promosso a pieni voti. Domani sul circuito panoramico voglio vedere traiettorie impeccabili!"
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
                      "gp_nembo",
                      "[serio] Vigilo sui cordoli e sulle marmitte. Chi inquina, viene ammonito."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gp_gridoni: [
            {
              when: { step: [0, 2] },
              do: [
                {
                  say: [
                    [
                      "gp_gridoni",
                      "[cuffie al collo e microfono a tracolla] AMICI DELLA NOTTE! Smeraldo Lime prepara il colpo di scena ecologico! Ma dimmi, Smeraldo: se vinci a menta piperita, offri il gelato al pistacchio a tutta la curva?"
                    ],
                    [
                      "gp_smeraldo",
                      "[ride] Solo frullati di verdura fresca e centrifugati d'ortica, Cesare! Danno più cavalli di un motore a otto cilindri!"
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
                      "gp_gridoni",
                      "[esulta] DOMANI CI SARÀ IL BOTTO! O IL GOL! O IL FRULLATO! QUALUNQUE COSA SIA, LO URLERÒ A CENTODIECI DECIBEL!"
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
                      "gp_gridoni",
                      "[urla nel microfono spento] PROVA MICROFONO! UNO, DUE, TRE... SORPASSO ESTERNO SULLA COLLINA!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "gp_s_paddock:Y": [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "gp_smeraldo",
                      "[ispeziona la pompa con una lente d'ingrandimento] Guarda qui... La ghiera di miscelazione è stata manomessa con cera pesante per simulare depositi fangosi nel motore verde! Devo parlarne subito con Clotilde nel nostro box a sinistra!"
                    ]
                  ],
                },
                { step: 1 },
                {
                  quest: [
                    "gp_c4_clotilde",
                    "Rapporto ai Box",
                    "Entra nell'Officina Verde dei Bolidi (in alto a sinistra) e parla con Clotilde."
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
                      "gp_smeraldo",
                      "[pensa] La colonnina del carburante è ora sotto osservazione. I condotti sono puliti."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "gp_s_boxverde:M": [
            {
              when: { step: 2 },
              do: [
                {
                  trial: {
                    title: "Pit Stop dei Bolidi",
                    bg: "gp_box",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        who: "gp_clotilde",
                        prompt: "I quattro bulloni della ruota anteriore sinistra sono serrati forte: quale chiave dinamometrica usi per lo smontaggio rapido?",
                        options: [
                          { label: "Bussola d'acciaio al cromo da ventiquattro con sgancio a cricchetto rapido!", ok: true },
                          { label: "Pinza da cucina a becco lungo" },
                          { label: "Battere forte col martello da fabbro sul cerchione" }
                        ],
                        good: "Clac perfetto! I quattro dadi scattano all'unisono in meno di un secondo!",
                        bad: "Slitta la presa! Perdiamo due decimi preziosi per riposizionare la chiave!"
                      },
                      {
                        who: "gp_clotilde",
                        prompt: "La valvola di aspirazione del biocarburante ha pescato una bolla d'aria: come ripristini la pressione ottimale?",
                        options: [
                          { label: "Spurgare il condotto di ritorno e ricalibrare l'ugello dell'essenza di menta!", ok: true },
                          { label: "Versare acqua minerale gassata nel serbatoio" },
                          { label: "Tappare il tubo di scarico con uno straccio bagnato" }
                        ],
                        good: "Pressione a regime! Il manometro sale a quattro bar netti e profuma di menta freschissima!",
                        bad: "Ritorno di fiamma verde! Dobbiamo ventilare la camera di scoppio col soffiatore!"
                      },
                      {
                        who: "gp_clotilde",
                        prompt: "L'inclinazione dell'alettone posteriore produce troppo attrito in rettilineo: quale regolazione imposti sul flap?",
                        options: [
                          { label: "Scaricare l'incidenza di tre gradi per favorire la velocità di punta sul dritto!", ok: true },
                          { label: "Raddrizzare l'ala a novanta gradi controvento" },
                          { label: "Smontare l'alettone e lasciarlo appoggiato a terra" }
                        ],
                        good: "Flusso aerodinamico pulitissimo! Il profilo alare fende l'aria senza la minima turbolenza!",
                        bad: "Assetto sbilanciato! Il retrotreno scodinzola paurosamente sul banco rulli!"
                      },
                      {
                        who: "gp_clotilde",
                        prompt: "Scelta finale dei pneumatici prima di ripartire: quale mescola montiamo per l'asfalto notturno raffreddato?",
                        options: [
                          { label: "Mescola verde a grip progressivo preriscaldata sulle termocoperte!", ok: true },
                          { label: "Gomme tassellate da fango per trattori agricoli" },
                          { label: "Ruote piene di legno levigato" }
                        ],
                        good: "Aderenza totale! I pneumatici mordono l'asfalto come artigli vellutati!",
                        bad: "Gomme gelide! La monoposto pattina sui rulli costringendo a una seconda regolazione!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "gp_clotilde",
                            "[esulta saltando in aria con la chiave inglese] Due secondi e otto decimi netti! È il pit stop più veloce nella storia di Palladoro! Il motore verde canta come un usignolo!"
                          ],
                          [
                            "gp_smeraldo",
                            "[ride a braccia alzate] Fantastico lavoro, Clotilde! Ora la macchina è pronta a divorare i cordoli! Andiamo a mostrare le nostre carte a Nembo fuori nel paddock."
                          ]
                        ]
                      },
                      { flag: { gp_s_pit_vinto: true } },
                      { step: 3 },
                      {
                        quest: [
                          "gp_c4_nembo",
                          "L'Ispezione della Notte",
                          "Esci dal box verde e affronta il Commissario Nembo nel paddock."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "gp_clotilde",
                            "[asciuga la fronte con uno straccio] Tre secondi e sei decimi... Qualche incertezza sui dadi, ma la vettura è comunque solidissima e la pressione è stabile!"
                          ],
                          [
                            "gp_smeraldo",
                            "[serio e incoraggiante] Nessun dramma: la precisione conta più della fretta. Andiamo a sentire cosa vuole la giuria fuori nel paddock."
                          ]
                        ]
                      },
                      { flag: { gp_s_pit_perso: true } },
                      { step: 3 },
                      {
                        quest: [
                          "gp_c4_nembo",
                          "L'Ispezione della Notte",
                          "Esci dal box verde e affronta il Commissario Nembo nel paddock."
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
                      "gp_smeraldo",
                      "[pensa] Il banco attrezzi di Clotilde è tirato a lucido. Ogni chiave ha la sua ombra disegnata sul pannello."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "gp_s_paddock:x": [
            {
              when: { notFlag: "gp_s_baule_c4" },
              do: [
                { flag: { gp_s_baule_c4: true } },
                { cred: 40 },
                {
                  say: [
                    [
                      "gp_smeraldo",
                      "[trova una scatola di rondelle in titanio verde e quaranta monete d'oro] Ottimo! Materiale di prima qualità per il nostro telaio."
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
                      "gp_smeraldo",
                      "[pensa] La cassetta dei ricambi è vuota. Resta un profumo gradevole di grasso al silicone."
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
            { finish: "dossier_gp_c4" },
            {
              reward: {
                key: "dossier_gp_c4_premio",
                give: { coins: 180, cos: ["gp_s_visiera"] }
              }
            },
            {
              scene: [
                [
                  "gp_smeraldo",
                  "[felice] La notte dei box è vinta. Abbiamo dimostrato che l'ingegno pulito e la dedizione artigianale valgono più di qualunque tranello."
                ],
                [
                  "gp_clotilde",
                  "[ride] Domani mattina sul Circuito Panoramico dei Mulini dimostreremo a tutti di che pasta sono fatti i nostri pistoni!"
                ],
                [
                  "voce",
                  "<b>CAPITOLO 4 DEL DOSSIER CONCLUSO</b> {reward}<br>Smeraldo Lime ha ristabilito la verità e preparato il suo bolide. Nel Capitolo 5 lo attende il collaudo decisivo sul circuito panoramico!"
                ]
              ],
              openMain: true,
              bg: "gp_paddock"
            }
          ]
        }
      },
      {
        n: 5,
        title: "Il Gran Premio della Pista Smeraldo",
        sub: "Dossier Incompiuto: la rivincita ecologica e il bivio delle due scuderie",
        avatar: SMERALDO_C5,
        start: "gp_s_circuito",
        introBg: "gp_pista",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · GRAN PREMIO DEL PALLONE</b> Il Circuito Panoramico dei Mulini, mattino radioso. Le pale dei vecchi mulini a vento girano lente nella brezza estiva."
          ],
          [
            "gp_smeraldo",
            "[felice] (In tuta verde smeraldo ad alta visibilità.) Che splendore di giornata per impostare le traiettorie! Oggi non corriamo per una coppa di latta comprata dagli sponsor: corriamo per riscrivere la storia delle corse a Palladoro. Tonino Bullone e la campionessa Rosalba sono venuti ad assistere alla prova di collaudo. È il momento di far cantare il motore verde!"
          ]
        ],
        goal: {
          0: "Parla con Tonino Bullone sulla terrazza dei box (in alto a sinistra sul circuito).",
          1: "Entra nella Torre di Controllo dei Giudici (in alto a destra) e parla con Rosalba Turbo.",
          2: "Esamina il banco di telemetria (tessera U) ed esegui la prova di staccata al limite.",
          3: "Affronta il bivio decisivo parlando con Tonino e Rosalba nella Torre di Controllo."
        },
        goalDone: "Dossier Incompiuto concluso con successo. I nuovi orizzonti del Gran Premio sono aperti!",
        cast: { ...CAST },
        cos: {
          gp_s_tuta_eco: {
            kind: "shirt",
            label: "Tuta Verde Ecologica",
            val: "#22c55e",
            from: "Dossier Gran Premio del Pallone · Capitolo 5"
          }
        },
        lore: {
          l_circuito_smeraldo: {
            t: "Il Circuito Panoramico dei Mulini",
            d: "Tracciato collinare che si snoda tra i mulini a vento e le sponde del lago. Famoso per la curva-cancello del quarto miglio, dove la decelerazione richiede un piede vellutato e una precisione chirurgica sul pallone."
          }
        },
        endings: {
          smeraldo_verde_oro: [
            "IL TRIONFO VERDE-ORO",
            "Smeraldo Lime e Tonino Bullone uniscono le scuderie: la Rondinella e i Bolidi Verdi adottano la propulsione a biocarburanti, inaugurando l'era del Gran Premio ecologico.",
            "Scegli l'alleanza tecnologica con l'Officina Bullone nel finale del Capitolo 5."
          ],
          smeraldo_solitario: [
            "LA SCUDERIA INDIPENDENTE",
            "Smeraldo rifiuta ogni compromesso: i Bolidi Verdi corrono come scuderia autonoma, dimostrando che la passione artigianale e il rispetto per l'ambiente possono battere qualsiasi colosso industriale.",
            "Scegli la via della scuderia indipendente nel finale del Capitolo 5."
          ]
        },
        zones: {
          gp_s_circuito: {
            region: "pista",
            name: "Dossier GP · Circuito Panoramico dei Mulini",
            short: "Circuito dei Mulini",
            sub: "Mulini a vento all'orizzonte, cordoli tirati a lucido e brezza dal lago",
            bg: "gp_pista",
            time: "giorno",
            w: 32,
            h: 22,
            start: [16, 14],
            areas: [
              [20, 2, 28, 7, "La Torre di Controllo"],
              [1, 8, 30, 20, "Il Circuito Panoramico"]
            ],
            act: {
              n: "Leggi il cartello del circuito",
              l: "Guarda il lampione a specchio",
              b: "Siediti sulla panchina panoramica",
              x: "Apri la cassa del comitato",
              O: "Ispeziona le pile di gomme",
              A: "Guarda il tabellone dei record",
              P: "Guarda il podio d'onore",
              K: "Leggi i cartelloni storici",
              s: "Riposa"
            },
            flavor: {
              n: "Un cartello con il profilo del tracciato: «CIRCUITO DEI MULINI · 4.2 KM DI PURA TRAIETTORIA · CURVA QUATTRO ADERENZA CRITICA».",
              l: "Un elegante palo con riflettore orientabile verso la linea del traguardo.",
              b: "Panchina in legno di pino affacciata sulla vallata dove si vedono girare le pale bianche dei mulini.",
              x: "Una cassa sigillata con il marchio in rilievo della Federazione Automobilistica di Palladoro.",
              O: "Gomme a mescola morbida con banda verde laterale per segnalare la mescola ecologica.",
              A: "Il grande tabellone a display luminoso: «RECORD DELLA PISTA IN PALIO OGGI».",
              P: "Il podio panoramico allestito sul prato con la Coppa delle Valli che scintilla al sole.",
              K: "Cartelloni storici: «OFFICINA BULLONE · DAL 1960» e «BOLIDI VERDI · CORRERE SENZA INQUINARE»."
            },
            intro: [
              [
                "voce",
                "Il Circuito Panoramico dei Mulini: l'aria frizzante profuma d'erba tagliata e le colline di Palladoro accolgono il rombo armonioso del motore a menta."
              ]
            ],
            npcs: [
              { id: "gp_bullone", at: [12, 14], when: { step: 0 } },
              { id: "gp_gridoni", at: [8, 13], when: { step: [0, 3] } },
              { id: "gp_clotilde", at: [16, 12], when: { step: [0, 3] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 10, 30, 11, ":"],
              ["lay", 24, 8, 24, 11, ":"],
              ["lay", 1, 12, 30, 17, "+"],
              ["house", 20, 2, 9, 6, { door: [24, 7], roof: "#2a1a3a", wall: "#8ab0d8", rr: 2, lit: true, enter: { to: "gp_s_torre", at: [8, 9] } }],
              ["put", 4, 2, "K"],
              ["put", 10, 2, "K"],
              ["put", 15, 2, "A"],
              ["put", 16, 6, "P"],
              ["put", 3, 14, "O"],
              ["put", 28, 14, "O"],
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
          gp_s_torre: {
            interior: true,
            region: "cabina",
            name: "Dossier GP · Torre di Controllo dei Giudici",
            short: "Torre di Controllo",
            sub: "Schermi di telemetria, vetrata a trecentosessanta gradi e microfoni di pista",
            bg: "gp_cabina",
            w: 16,
            h: 12,
            start: [8, 9],
            outside: ["gp_s_circuito", 24, 8],
            act: {
              U: "Esamina la consolle di telemetria",
              M: "Guarda il banco della giuria",
              Y: "Ispeziona il microfono ufficiale",
              W: "Ammira la vista dalla vetrata",
              b: "Siediti sulla poltrona dei giudici",
              v: "Esci sul circuito"
            },
            flavor: {
              U: "Il sistema di telemetria computerizzato: grafici di accelerazione laterale, velocità in curva e potenza di tiro in area.",
              M: "Il banco di quercia dove i giudici federali appoggiano registri, cronometri d'oro e bandiere a scacchi.",
              Y: "Il microfono centrale collegato a tutti gli altoparlanti del comprensorio dei mulini.",
              W: "Una vetrata panoramica curva che abbraccia l'intero tracciato, dal lago alle vette collinari.",
              b: "Comoda poltrona girevole in pelle con il logo ricamato del Gran Premio."
            },
            intro: [
              [
                "voce",
                "La Torre di Controllo: aria condizionata silenziosa, moquette blu notte e i monitor che mostrano la monoposto verde pronta sulla linea di partenza."
              ]
            ],
            npcs: [
              { id: "gp_rosalba", at: [8, 4], when: { step: [1, 9] } },
              { id: "gp_bullone", at: [11, 6], when: { step: [1, 9] } },
              { id: "gp_nembo", at: [4, 6], when: { step: [3, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 8),
              ["put", 4, 4, "U"],
              ["put", 11, 4, "M"],
              ["put", 7, 2, "Y"],
              ["put", 2, 2, "W"],
              ["put", 13, 2, "W"],
              ["put", 2, 7, "b"],
              ["put", 13, 7, "b"],
              ["put", 2, 9, "l"],
              ["put", 13, 9, "l"]
            ]
          }
        },
        talk: {
          gp_bullone: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "gp_bullone",
                      "[felice agitando una chiave inglese da trentadue] Smeraldo, ragazzo mio! Ho saputo della notte ai box. Quella faccenda della paraffina era una vigliaccata: l'onestà in pista viene prima di tutto!"
                    ],
                    [
                      "gp_smeraldo",
                      "[sorride] Grazie, Tonino. La tua stima vale più di dieci trofei."
                    ],
                    [
                      "gp_bullone",
                      "[serio e fiero] Rosalba ti aspetta su nella Torre di Controllo (la porta in alto a destra). Vuole calibrare insieme a te la telemetria di staccata sulla curva-cancello dei mulini. Sali su: oggi si fa la storia!"
                    ]
                  ]
                },
                { step: 1 },
                {
                  quest: [
                    "gp_c5_torre",
                    "Nella Torre di Controllo",
                    "Entra nella Torre di Controllo (in alto a destra) e parla con Rosalba Turbo."
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
                      "gp_bullone",
                      "[osserva i monitor con le braccia conserte] Vai alla consolle con Rosalba, Smeraldo. La staccata al tornante deciderà l'assetto perfetto."
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
                      "gp_bullone",
                      "[commosso si toglie il cappello da lavoro] Smeraldo, ragazzo mio. La mia Officina ha sessant'anni di esperienza e telai indistruttibili, ma tu hai il motore del futuro: pulito, veloce, nobile. Se uniamo i progetti, la Rondinella e i Bolidi Verdi correranno insieme sotto una sola bandiera Verde-Oro! Ma se preferisci difendere la tua autonomia artigianale, avrai per sempre il mio rispetto. Cosa decidi?"
                    ]
                  ]
                },
                {
                  ask: {
                    who: "gp_bullone",
                    prompt: "Quale strada scegli per il futuro dei Bolidi Verdi?",
                    options: [
                      {
                        label: "Alleanza Verde-Oro con l'Officina Bullone",
                        sub: "Finale: Il Trionfo Verde-Oro · Fusione ecologica con Tonino",
                        cls: "hot",
                        big: true,
                        do: [{ call: "finale_verde_oro" }]
                      },
                      {
                        label: "Resta indipendente: la Scuderia Verde correrà da sola",
                        sub: "Finale: La Scuderia Indipendente · Autonomia pura senza compromessi",
                        big: true,
                        do: [{ call: "finale_solitario" }]
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
                      "gp_bullone",
                      "[ride] I bulloni si stringono a mano. E le alleanze si stringono col cuore."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gp_rosalba: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    [
                      "gp_rosalba",
                      "[ammirata stringendogli la mano] Ciao Smeraldo! Ieri hai fatto un miracolo ai box. Io gareggio in rosso, ma riconosco un fuoriclasse quando ne vedo uno. Quel motore ecologico ha una curva di coppia impressionante."
                    ],
                    [
                      "gp_smeraldo",
                      "[sorpreso e fiero] Detto dalla campionessa in carica è un onore enorme, Rosalba."
                    ],
                    [
                      "gp_rosalba",
                      "[determinata] Ora dimostramelo sui dati reali. Vai alla consolle della telemetria (tessera U): dobbiamo impostare il punto di staccata al limite e la traiettoria di tiro per la curva-cancello dei mulini. Fammi vedere come guidi!"
                    ]
                  ]
                },
                { step: 2 },
                {
                  quest: [
                    "gp_c5_telemetria",
                    "Telemetria al Limite",
                    "Usa la consolle di telemetria (U) nella Torre di Controllo per superare la prova di staccata."
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
                      "gp_rosalba",
                      "[guarda i monitor] I sensori sulla curva quattro sono attivi. Mettiti alla consolle (U), Smeraldo: mostraci il tuo giro ideale!"
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
                      "gp_rosalba",
                      "[sorride con calore] Una prova magistrale, Smeraldo! Parla con Tonino: siamo tutti ansiosi di conoscere il destino della tua scuderia."
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
                      "gp_rosalba",
                      "[felice] Il rosso accende la passione, ma il verde custodisce il futuro!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gp_clotilde: [
            {
              when: { step: [0, 3] },
              do: [
                {
                  say: [
                    [
                      "gp_clotilde",
                      "[controlla la temperatura delle gomme con un termometro laser] Pressione ottimale e zero sbalzi termici! Smeraldo, qualunque decisione prenderai lassù nella torre, tutta la squadra dei meccanici è con te al cento per cento!"
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
                      "gp_clotilde",
                      "[soddisfatta] Abbiamo dimostrato che l'ecologia vince anche contro il cronometro!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gp_gridoni: [
            {
              when: { step: [0, 3] },
              do: [
                {
                  say: [
                    [
                      "gp_gridoni",
                      "[urla esagitato saltellando sul cordolo] I NUMERI PARLANO CHIARO! ZERO FUMI, VELOCITÀ DI PUNTA STRATOSFERICA E IL TIRO IN PORTA PIÙ PRECISO DEL SECOLO! CHI L'AVREBBE MAI DETTO CHE UN FRULLATO ALLA MENTA POTESSE FARE MIRACOLI?!"
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
                      "gp_gridoni",
                      "[asciuga il sudore] Che giornata per Palladoro! Una telecronaca che rimarrà negli annali!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gp_nembo: [
            {
              when: { step: [3, 9] },
              do: [
                {
                  say: [
                    [
                      "gp_nembo",
                      "[annuisce solenne fluttuando sopra la ringhiera] Il regolamento del Gran Premio del Pallone riconosce la validità di ogni patto leale siglato nella Torre. Che vinca lo sport e l'aria pulita!"
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
                      "gp_nembo",
                      "[serio] Vigilo e confermo: la corsa è stata esemplare."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "gp_s_torre:U": [
            {
              when: { step: 2 },
              do: [
                {
                  trial: {
                    title: "Telemetria di Staccata",
                    bg: "gp_cabina",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        who: "gp_rosalba",
                        prompt: "Curva uno dopo il lungo rettilineo: la velocità tocca i centottanta all'ora. Qual è il punto di staccata ideale?",
                        options: [
                          { label: "Ai cinquanta metri dal cordolo interno, rilasciando il gas in ingresso per caricare l'avantreno!", ok: true },
                          { label: "Frenare dentro l'area di rigore a occhi chiusi" },
                          { label: "Non frenare affatto e confidare nella rete di protezione" }
                        ],
                        good: "Staccata millimetrica! La monoposto si inserisce in corda con un angolo perfetto!",
                        bad: "Bloccaggio delle anteriori! Hai spiattellato la gomma verde sul cordolo esterno!"
                      },
                      {
                        who: "gp_rosalba",
                        prompt: "La curva-cancello del quarto miglio si stringe a compasso: come imposti la traiettoria per il tiro in porta?",
                        options: [
                          { label: "Allargare al massimo in ingresso per tagliare il vertice e accelerare dritti verso l'incrocio dei pali!", ok: true },
                          { label: "Tagliare dritto sull'erba falciando i cartelli pubblicitari" },
                          { label: "Tirare il freno a mano girando il volante all'indietro" }
                        ],
                        good: "Traiettoria da manuale! Il raggio di curvatura proietta il bolide a velocità massima sul pallone!",
                        bad: "Traiettoria troppo stretta! Il tiro perde potenza e sfiora appena il palo esterno!"
                      },
                      {
                        who: "gp_rosalba",
                        prompt: "Raffica di vento improvviso dal lago durante la chicane veloce dei mulini: come correggi l'assetto?",
                        options: [
                          { label: "Parzializzare l'acceleratore e controsterzare di pochi gradi con mano fermissima sul volante!", ok: true },
                          { label: "Mollare il volante e coprirsi la visiera con entrambe le mani" },
                          { label: "Scalare in prima marcia facendo urlare i pistoni fuorigiri" }
                        ],
                        good: "Controllo magistrale! Il bolide fende la raffica mantenendo la linea ideale!",
                        bad: "Sbandata sul cordolo! La scia perde stabilità facendoti oscillare vistosamente!"
                      },
                      {
                        who: "gp_rosalba",
                        prompt: "Rettilineo finale in discesa: come sfrutti l'effetto suolo della scuderia verde per massimizzare il tempo sul giro?",
                        options: [
                          { label: "Attivare il diffusore ecologico a flusso guidato per incollare il telaio all'asfalto!", ok: true },
                          { label: "Aprire il cofano motore per fare vela controvento" },
                          { label: "Spegnere il quadro elettrico per risparmiare energia" }
                        ],
                        good: "Effetto suolo devastante! Il cronometro segna il nuovo record assoluto della pista!",
                        bad: "Flusso d'aria sporcato: l'attrito frena l'allungo finale di due decimi!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "gp_rosalba",
                            "[ammirata battendo le mani con entusiasmo] Che pulizia di guida, Smeraldo! Non ho mai visto una macchina divorare le curve con tanta grazia e senza lasciare un filo di fumo nero!"
                          ],
                          [
                            "gp_bullone",
                            "[commosso battendosi la mano sul petto] Ha ragione la ragazza: quel motore a menta è un capolavoro di ingegneria pura! Vieni qui, Smeraldo: dobbiamo fare un discorso importante."
                          ]
                        ]
                      },
                      { flag: { gp_s_telemetria_vinta: true } },
                      { step: 3 },
                      {
                        quest: [
                          "gp_c5_patto",
                          "Il Patto dei Motori",
                          "Parla con Tonino e Rosalba nella Torre di Controllo per decidere il futuro della scuderia."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "gp_rosalba",
                            "[sorride incoraggiante dandoti il cinque] Qualche sbavatura sulla chicane del vento, ma il potenziale del tuo motore ecologico è straordinario!"
                          ],
                          [
                            "gp_bullone",
                            "[annuisce battendoti una pacca affettuosa sulla spalla] La sostanza c'è tutta, ragazzo. Ora dobbiamo decidere come portare questa rivoluzione a tutta Palladoro."
                          ]
                        ]
                      },
                      { flag: { gp_s_telemetria_persa: true } },
                      { step: 3 },
                      {
                        quest: [
                          "gp_c5_patto",
                          "Il Patto dei Motori",
                          "Parla con Tonino e Rosalba nella Torre di Controllo per decidere il futuro della scuderia."
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
                      "gp_smeraldo",
                      "[pensa] I monitor mostrano la mappa del circuito con le traiettorie colorate in verde brillante."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "gp_s_circuito:x": [
            {
              when: { notFlag: "gp_s_baule_c5" },
              do: [
                { flag: { gp_s_baule_c5: true } },
                { cred: 50 },
                {
                  say: [
                    [
                      "gp_smeraldo",
                      "[trova una medaglia ricordo del circuito e cinquanta monete d'oro] Un bel ricordo per celebrare questa splendida giornata di collaudo!"
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
                      "gp_smeraldo",
                      "[pensa] La cassa della Federazione è vuota. Resta un nastro di seta con la bandiera a scacchi."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        blocks: {
          finale_verde_oro: [
            {
              say: [
                [
                  "gp_smeraldo",
                  "[entusiasta stringe con calore la mano di Tonino] Affare fatto, Tonino! Da oggi l'Officina Bullone e i Bolidi Verdi sono una sola grande famiglia. Uniremo i tuoi telai d'acciaio indistruttibili con i miei propulsori ecologici a zero emissioni!"
                ],
                [
                  "gp_bullone",
                  "[felice con gli occhi lucidi] Si stringe a mano, ragazzo! E con le mani pulite di chi rispetta l'aria e la terra!"
                ],
                [
                  "gp_rosalba",
                  "[ride battendo il pugno sul palmo] Sarà un onore sfidarvi in pista. Con voi due insieme, il Gran Premio sarà uno spettacolo mai visto!"
                ]
              ]
            },
            { end: "smeraldo_verde_oro" },
            { unlock: ["gp_smeraldo", "gp_clotilde"] },
            { finish: "smeraldo_verde_oro" },
            { step: 9 },
            {
              reward: {
                key: "end:smeraldo_verde_oro",
                give: { coins: 300, cos: ["gp_s_tuta_eco"] }
              }
            },
            {
              scene: [
                [
                  "voce",
                  "I due capitani si stringono la mano al centro della Torre di Controllo. Sui tabelloni di Palladoro compare il nuovo stemma unificato: un bullone d'oro circondato da una corona d'alloro verde brillante."
                ],
                [
                  "gp_smeraldo",
                  "[felice] Il futuro non aspetta: corre a testa alta e a pieni polmoni!"
                ],
                [
                  "voce",
                  "<b>DOSSIER CONCLUSO: IL TRIONFO VERDE-ORO!</b> {reward}<br>Hai sbloccato le carte <b>«Smeraldo Lime»</b> e <b>«Clotilde la Meccanica»</b> nella Squadra dei Sogni! Smeraldo ora ti fa visita al Borgo Marino, e nelle Carte del Destino è disponibile il mazzo «Il Dossier di Smeraldo»."
                ]
              ],
              openMain: true,
              bg: "gp_pista"
            }
          ],
          finale_solitario: [
            {
              say: [
                [
                  "gp_smeraldo",
                  "[fiero con sguardo limpido verso la pista] Rispetto profondamente la tua officina, Tonino, e ammiro la tua grinta, Rosalba. Ma i Bolidi Verdi sono nati come sogno indipendente, e tali devono rimanere. Gareggeremo lealmente contro tutti voi per dimostrare che una scuderia autonoma e pulita può trionfare con le proprie sole forze!"
                ],
                [
                  "gp_bullone",
                  "[annuisce con stima profonda] Rispetto la tua schiena dritta, Smeraldo. Chi sa stare in piedi da solo merita il massimo rispetto in pista e fuori."
                ],
                [
                  "gp_rosalba",
                  "[sorride stringendogli la mano con vigore] Preparati allora, Smeraldo: la Scuderia Fiamma non ti regalerà un solo centimetro! Sarà una battaglia epica!"
                ]
              ]
            },
            { end: "smeraldo_solitario" },
            { unlock: ["gp_smeraldo", "gp_clotilde"] },
            { finish: "smeraldo_solitario" },
            { step: 9 },
            {
              reward: {
                key: "end:smeraldo_solitario",
                give: { coins: 300, cos: ["gp_s_tuta_eco"] }
              }
            },
            {
              scene: [
                [
                  "voce",
                  "Smeraldo scende dalla Torre di Controllo a testa alta. Sotto gli applausi del pubblico e dei meccanici di tutte le scuderie, la monoposto verde sfreccia solitaria sul rettilineo dei mulini lasciando dietro di sé una scia brillante e profumata di menta."
                ],
                [
                  "gp_smeraldo",
                  "[ride] Niente padroni, niente scorciatoie: solo traiettorie pulite e la libertà di correre!"
                ],
                [
                  "voce",
                  "<b>DOSSIER CONCLUSO: LA SCUDERIA INDIPENDENTE!</b> {reward}<br>Hai sbloccato le carte <b>«Smeraldo Lime»</b> e <b>«Clotilde la Meccanica»</b> nella Squadra dei Sogni! Smeraldo ora ti fa visita al Borgo Marino, e nelle Carte del Destino è disponibile il mazzo «Il Dossier di Smeraldo»."
                ]
              ],
              openMain: true,
              bg: "gp_pista"
            }
          ]
        }
      }
    ]
  });
})();
