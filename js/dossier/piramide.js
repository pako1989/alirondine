// js/dossier/piramide.js - DOSSIER INCOMPIUTI di «La Piramide del Sole · Il Segreto dei Maya del Pallone»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Diego, il radiotelegrafista della spedizione del 1936 tra cuffie, onde corte e caucciù sacro.
// Cap. 4 «L'Eco delle Onde Corte nella Giungla» (segnali cifrati nella calura pluviale, batterie scariche e il telegrafo a risonanza di giada).
// Cap. 5 «Il Tempio Sommergibile del Cenote» (le acque sacre sotterranee, la sfida idraulica all'Anello di Pietra e il destino delle frequenze ancestrali).
// Minigiochi: «La Decifrazione del Segnale a Onde Corte» (prova a tempo a scelte, cap. 4) e «La Prova delle Paratie d'Acqua Sacra» (prova a tempo a scelte, cap. 5).
(function () {
  "use strict";

  const LOOK_DIEGO = {
    name: "Diego",
    style: "messy",
    hair: "#78350f",
    eye: "#1e293b",
    skin: "#fed7aa",
    acc: ["cuffie"]
  };

  const DIEGO_C4 = {
    name: "Diego",
    num: 1,
    cast: Object.assign({ sub: "Radiotelegrafista della Spedizione", shirt: "#0284c7", bg: ["#0369a1", "#082f49"] }, LOOK_DIEGO)
  };

  const DIEGO_C5 = {
    name: "Diego",
    num: 1,
    cast: Object.assign({ sub: "Esploratore delle Onde Corte", shirt: "#f59e0b", bg: ["#f59e0b", "#78350f"] }, LOOK_DIEGO)
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
    my_xavier: {
      name: "Xavier il Pilota",
      desc: "Pilota dell'idrovolante anfibio della spedizione di Merida. Vola radente sulle ceibe giganti e calcola le parabole della palla di caucciù col tachimetro di bordo: «Se il vento di scirocco piega le ali, basta anticipare la volée di tre gradi!»",
      look: {
        style: "messy",
        hair: "#334155",
        beard: "baffi",
        eye: "#0f172a",
        skin: "#e2e8f0",
        shirt: "#78350f",
        acc: ["occhiali"],
        bg: ["#1e293b", "#f59e0b"]
      }
    },
    my_balam: {
      name: "Balam il Custode",
      desc: "Mastro intagliatore e tuffatore del Cenote Sacro. Conosce i cunicoli sommersi dove la gomma naturale viene temprata nell'acqua minerale: «Il caucciù puro risponde al cuore dell'atleta, non alla forza bruta!»",
      look: {
        style: "topknot",
        hair: "#09090b",
        eye: "#059669",
        skin: "#b45309",
        shirt: "#059669",
        acc: ["bandana"],
        streak: "#10b981",
        bg: ["#064e3b", "#059669"]
      }
    }
  };

  const ENDS = ["diego_ponte_radio", "diego_archivio_segreto"];

  window.__dossierDati.add({
    saga: "piramide",
    after: 3,
    guest: {
      id: "my_diego",
      saga: "La Piramide del Sole · Il Dossier di Diego",
      ends: ENDS,
      lines: [
        [
          "my_diego",
          "[aggiusta le cuffie e batte un tasto Morse sul tavolo] CQ, CQ, da Borgo Marino! Qui il segnale è limpido come l'acqua del Cenote, {n}! Ma spiegami una cosa: com'è che quando fate gol non colpite mai di anca o di ginocchio? Con una sfera in caucciù puro fareste faville in campionato!"
        ]
      ]
    },
    deck: {
      id: "myd",
      t: "Il Dossier di Diego",
      e: "📻",
      ends: ENDS,
      lock: "Trova un finale del Dossier della Piramide del Sole",
      d: "Onde corte nella giungla dello Yucatán, codici Morse ancestrali e palloni di caucciù sacro.",
      pg: {
        id: "my_xavier",
        n: "Xavier il Pilota",
        i: "🛩️",
        tr: "furbizia",
        d: "Pilota d'idrovolante sui cieli dello Yucatán. Vola a pelo d'albero e serve cross tesi calcolando le raffiche di scirocco.",
        greet: "Un volo sopra {a}? Tienti forte: se il vento gira facciamo un atterraggio d'emergenza in area di rigore!",
        win: "Atterraggio perfetto e gol al volo! La fisica dell'aria vince sempre.",
        lose: "Vuoto d'aria sul più bello: siamo finiti dritti tra le fronde delle ceibe."
      },
      ev: {
        n: "Il Telegrafo a Risonanza di Giada",
        i: "📻",
        d: "Un apparato radio a valvole collegato per errore a una stele maya vibrante.",
        setup: [
          "Tra le liane trovi una cassa del generatore con un trasmettitore a bobina collegato a una placca di giada verde.",
          "La cuffia emette una sequenza ritmica di toni acuti che risponde al rimbalzo dei palloni nell'atrio. Che facciamo?"
        ],
        ch: [
          [
            "Trascrivi il segnale in codice Morse",
            "furbizia",
            "Ogni impulso ha un significato.",
            "Decifri la frequenza del campo cerimoniale e scopri un passaggio segreto: trovi quaranta monete e note tattiche.",
            "I toni si sovrappongono in una cacofonia stridente che ti intorpidisce le orecchie."
          ],
          [
            "Aumenta la potenza delle valvole",
            "audacia",
            "La scarica apre ogni canale.",
            "L'antenna emette una scintilla azzurrina che rischiara la cripta rivelando una cassetta di reperti preziosi.",
            "Una valvola scoppia con uno sbuffo di fumo acre e perdi venti minuti a riparare i contatti."
          ],
          [
            "Condividi la frequenza con la spedizione",
            "cuore",
            "La conoscenza va messa a sistema.",
            "Il Professor Alvarez e Ixchel ti ringraziano commossi, regalandoti una mappa dettagliata delle correnti sotterranee.",
            "La frequenza viene intercettata da una stazione commerciale che trasmette solo musica da ballo."
          ]
        ]
      },
      tw: {
        n: "Rimbalzo di Caucciù d'Anca",
        i: "⚡",
        d: "Colpo rituale maya ad effetto verso l'anello alto.",
        win: "La traiettoria bacia la pietra ed entra netta: il bottino si moltiplica.",
        lose: "La gomma colpisce lo spigolo e rimbalza indietro sul terzino: perdi una fetta del premio.",
        mulWin: 1.35,
        mulLose: 0.85
      }
    },
    chapters: [
      {
        n: 4,
        title: "L'Eco delle Onde Corte nella Giungla",
        sub: "Dossier Incompiuto: le trasmissioni d'emergenza nello Yucatán, dal punto di vista di Diego",
        avatar: DIEGO_C4,
        start: "my_d_radura",
        introBg: "my_campobase",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · LA PIRAMIDE DEL SOLE</b> Yucatán, 1936. La radura fluviale sotto la fitta volta pluviale delle ceibe."
          ],
          [
            "my_diego",
            "[serio] (Aggiusta l'archetto delle cuffie mentre il ricevitore gracchia scariche di fulmini lontani.) Alvarez e Ixchel sono saliti sui gradoni della piramide, convinti che il pericolo sia solo tra le trappole di pietra. Ma sulla frequenza dei 7 mega-hertz ho appena intercettato un messaggio in chiaro: una flottiglia di mercenari sta risalendo il fiume per fare man bassa di reperti! Se non sistemo l'antenna e non carico le batterie, saremo isolati dal mondo!"
          ]
        ],
        goal: {
          0: "Ispeziona il baule degli accumulatori vicino al pontile a est (in basso a destra).",
          1: "Entra nella Baracca del Telegrafo (in alto a sinistra) e parla con Xavier il Pilota.",
          2: "Ispeziona il banco del telegrafo (tessera T) ed esegui la prova di decifrazione del segnale.",
          3: "Affronta il Capitano Vargas apparso sul sentiero della radura prima dell'imbrunire."
        },
        goalDone: "Il Capitolo 4 è completato. Puoi proseguire con il Capitolo 5.",
        cast: { ...CAST },
        cos: {
          my_d_cuffie: {
            kind: "style",
            label: "Cuffie Radio da Esploratore 1936",
            val: "cuffie",
            from: "Dossier de La Piramide del Sole · Capitolo 4"
          }
        },
        lore: {
          l_radio_maya: {
            t: "Il Telegrafo a Onde Corte del 1936",
            d: "Gli apparati radio a valvole termoioniche usati nelle spedizioni archeologiche per comunicare oltre la fitta vegetazione pluviale e allertare i battelli costieri."
          }
        },
        zones: {
          my_d_radura: {
            region: "giungla",
            name: "Dossier Piramide · Radura del Fiume delle Ceibe",
            short: "Radura del Fiume",
            sub: "Pontili di canapa, ceibe giganti e idrovolante anfibio all'ormeggio",
            bg: "my_campobase",
            time: "giorno",
            travel: [6, 18],
            w: 32,
            h: 22,
            start: [6, 18],
            areas: [
              [2, 2, 12, 8, "La Baracca del Telegrafo"],
              [16, 2, 30, 10, "L'Ormeggio dell'Idrovolante"],
              [2, 12, 30, 20, "La Radura del Fiume"],
              [0, 0, 31, 21, "La Foresta Pluviale"]
            ],
            act: {
              T: "Guarda la tenda",
              C: "Esamina la cassa da scavo",
              x: "Apri il baule degli accumulatori",
              S: "Leggi la stele del fiume",
              F: "Osserva le felci giganti",
              B: "Scaldati al braciere",
              b: "Siediti sulla panca",
              n: "Leggi il taccuino di campo",
              p: "Guarda il palo d'ormeggio",
              s: "Riposa"
            },
            flavor: {
              T: "Una grande tenda militare color cachi con gli schemi dei generatori e un tavolo da campo.",
              C: "Casse in legno di cedro marchiate 'SPEDIZIONE MERIDA 1936' con picconi e corde di canapa.",
              x: "Un baule di ferro con guarnizioni in gomma per proteggere le valvole radio dall'umidità tropicale.",
              S: "Una stele erosa dal muschio: mostra un atleta con una fascia in fronte che lancia una palla verso il sole.",
              F: "Enormi felci a ventaglio che stillano gocce tiepide nella calura del pomeriggio.",
              B: "Un braciere di pietra acceso con resina di copale per allontanare gli insetti del fiume.",
              b: "Una panca intagliata in un tronco di ceiba levigato dal tempo.",
              n: "Un taccuino di campo aperto alla pagina delle frequenze radio a onde corte.",
              p: "Un solido palo d'ormeggio a cui è legato il cavo dell'idrovolante di Xavier."
            },
            intro: [
              [
                "voce",
                "La Radura del Fiume delle Ceibe: l'aria sa di linfa vegetale, benzina avio e pioggia imminente. La corrente del fiume mormora sotto le radici secolari."
              ]
            ],
            npcs: [
              { id: "my_alvarez", at: [22, 16], when: { step: 0 } },
              { id: "my_xavier", at: [10, 18], when: { step: [0, 1] } },
              { id: "my_vargas", at: [21, 7], when: { step: [3, 9] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 17, 30, 19, ":"],
              ["lay", 15, 6, 15, 17, ":"],
              ["lay", 4, 8, 27, 8, ":"],
              ["house", 3, 3, 8, 5, { door: [6, 7], roof: "#78350f", wall: "#451a03", rr: 1, enter: { to: "my_d_baracca", at: [7, 9] } }],
              ["lay", 17, 3, 29, 5, "a"],
              ["put", 16, 9, "S"],
              ["put", 27, 18, "F"],
              ["put", 12, 18, "F"],
              ["put", 28, 18, "x"],
              ["put", 14, 8, "n"],
              ["put", 14, 14, "C"],
              ["put", 24, 14, "C"],
              ["put", 18, 6, "T"],
              ["put", 26, 6, "T"],
              ["put", 12, 14, "b"],
              ["put", 20, 14, "b"],
              ["put", 5, 18, "s"],
              ["put", 8, 18, "p"],
              ["put", 15, 18, "p"],
              ["put", 23, 18, "p"]
            ],
            trees: [[2, 10], [30, 10], [15, 4], [28, 4]]
          },
          my_d_baracca: {
            interior: true,
            region: "giungla",
            name: "Dossier Piramide · Baracca del Telegrafo",
            short: "Baracca Telegrafo",
            sub: "Bobine di rame, manipolatori Morse, valvole termoioniche e mappe",
            bg: "my_campobase",
            w: 16,
            h: 12,
            start: [7, 9],
            outside: ["my_d_radura", 6, 8],
            act: {
              T: "Esamina il banco del telegrafo",
              L: "Controlla le mensole",
              C: "Guarda la cassa delle bobine",
              x: "Esamina la scatola dei ricambi",
              v: "Esci"
            },
            flavor: {
              T: "Il banco da lavoro del telegrafista: oscillatori a valvole, manipolatore Morse d'ottone e accumulatori al piombo.",
              L: "Mensole colme di rotoli di nastro forato, barattoli di grasso isolante e registri di trasmissione.",
              C: "Una cassa rinforzata con rocchetti di filo di rame e antenne a dipolo pieghevoli.",
              x: "Una cassetta di bachelite contenente valvole di ricambio e condensatori ad aria."
            },
            intro: [
              [
                "voce",
                "La Baracca del Telegrafo: l'odore di bachelite calda e saldatura a stagno riempie la stanza. Le valvole emettono una calda luminescenza arancione."
              ]
            ],
            npcs: [
              { id: "my_xavier", at: [8, 4], when: { step: [1, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 7),
              ["lay", 2, 2, 13, 2, "L"],
              ["put", 5, 4, "T"],
              ["put", 10, 4, "C"],
              ["put", 12, 4, "C"],
              ["put", 3, 7, "C"],
              ["put", 12, 7, "C"],
              ["put", 3, 4, "x"],
              ["put", 2, 9, "l"],
              ["put", 13, 9, "l"]
            ]
          }
        },
        talk: {
          my_alvarez: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "my_alvarez",
                      "[affannato] Diego, ragazzo mio! Abbiamo trovato iscrizioni sensazionali nell'Atrio Superiore! Ma c'è una forte interferenza magnetica che perturba le bussole."
                    ],
                    [
                      "my_diego",
                      "Non è magnetismo naturale, Professore: sono le trasmissioni clandestine dei mercenari! Ho bisogno dei pezzi di ricambio per sintonizzare la frequenza esatta. Vado a controllare il baule sul pontile."
                    ],
                    [
                      "my_alvarez",
                      "[serio] Fai presto, Diego! Se perdiamo il contatto con Merida rischiamo di rimanere intrappolati se il Cenote dovesse straripare!"
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
                      "my_alvarez",
                      "[fiducioso] Confidiamo nelle tue onde radio, Diego! Tieni sempre sintonizzata la linea d'emergenza."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          my_xavier: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "my_xavier",
                      "[asciuga una macchia d'olio con uno straccio] Saluti dal pontile, Diego! L'idrovolante ha i serbatoi pieni, ma finché la radio gracchia non possiamo decollare nella nebbia. Trova quella valvola di ricambio!"
                    ]
                  ]
                },
                { done: true }
              ]
            },
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    [
                      "my_xavier",
                      "[sorpreso] Ottimo lavoro, hai recuperato la valvola termoionica al quarzo! Ora possiamo accendere il trasmettitore principale."
                    ],
                    [
                      "my_diego",
                      "La frequenza maya è instabile: dobbiamo tarare la bobina sul banco di lavoro prima che le onde corte si disperdano nella giungla."
                    ],
                    [
                      "my_xavier",
                      "Mettiti alle manopole (tessera T) e decifra i segnali! Io tengo sotto controllo la tensione degli accumulatori."
                    ]
                  ]
                },
                { step: 2 },
                {
                  quest: [
                    "my_c4_decifrazione",
                    "La Frequenza del Pok-ta-pok",
                    "Esamina il banco del telegrafo (T) nella baracca ed esegui la prova di decifrazione."
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
                      "my_xavier",
                      "[serio] Avvicinati al banco (tessera T), indossa le cuffie e trova la frequenza dei guardiani prima che il segnale svanisca!"
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
                      "my_xavier",
                      "[felice] Il segnale è pulito e l'idrovolante è pronto! Qualunque cosa accada, abbiamo una via di fuga nei cieli."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          my_vargas: [
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    [
                      "my_vargas",
                      "[sorride sornione con la cicatrice in vista e si appoggia a un tronco] Guarda un po' chi abbiamo qui: il piccolo telegrafista di Alvarez. So che hai intercettato i messaggi dei miei committenti."
                    ],
                    [
                      "my_diego",
                      "Capitano Vargas! Sapevo che c'era il tuo zampino dietro le frequenze clandestine sul fiume!"
                    ],
                    [
                      "my_vargas",
                      "Sii ragionevole, ragazzo. Quei reperti marciranno nei musei. Chiudi un occhio sulla radio, dammi le coordinate delle cripte d'oro e ci spartiremo un patrimonio a New York. Che ne dici?"
                    ]
                  ]
                },
                {
                  ask: {
                    who: "my_diego",
                    prompt: "Come rispondi al ricatto del Capitano Vargas?",
                    options: [
                      {
                        label: "Rifiuta la mazzetta e trasmetti l'allarme alla polizia fluviale",
                        sub: "Dovere e scienza: la spedizione e il patrimonio maya non si vendono",
                        do: [
                          { flag: { my_d_allarme_inviato: true } },
                          { bond: ["coraggio", 20] },
                          {
                            say: [
                              [
                                "my_diego",
                                "[fiero] Neanche per sogno, Vargas! Ho già trasmesso il nostro bollettino cifrato al distaccamento navale di Campeche. Tra mezz'ora questo fiume sarà presidiato!"
                              ],
                              [
                                "my_vargas",
                                "[stringe i pugni, rabbioso] Maledetto telegrafista! Ci rivedremo nelle caverne del Cenote, e lì non ci saranno frequenze a salvarti!"
                              ]
                            ]
                          },
                          { call: "concludi_capitolo_4" }
                        ]
                      },
                      {
                        label: "Inganna Vargas trasmettendo coordinate errate verso le paludi",
                        sub: "Astuzia da telegrafista: depista i mercenari facendoli impantanare",
                        do: [
                          { flag: { my_d_trappola_palude: true } },
                          { bond: ["sintonia", 20] },
                          {
                            say: [
                              [
                                "my_diego",
                                "[furbo] D'accordo, Vargas. La cripta è tre leghe a sud, oltre la Secca delle Zangole... basta seguire il canale poco profondo."
                              ],
                              [
                                "my_vargas",
                                "[ride soddisfatto] Sapevo che eri un ragazzo sveglio! Vado ad avvisare i miei uomini!"
                              ],
                              [
                                "my_diego",
                                "[a bassa voce] Perfetto... ora resteranno impantanati nel fango per due giorni interi!"
                              ]
                            ]
                          },
                          { call: "concludi_capitolo_4" }
                        ]
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
                      "my_vargas",
                      "[minaccioso] La giungla inghiotte chi fa troppe domande, Diego. Ricordalo!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "my_d_radura:x": [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "my_diego",
                      "[serio] (Solleva il coperchio del baule metallico ed estrae un tubo catodico e due bobine di rame isolate.)"
                    ],
                    [
                      "my_diego",
                      "Ecco la valvola al quarzo e i condensatori al piombo! Con questi componenti posso potenziare l'oscillatore e sintonizzare l'eco della piramide."
                    ],
                    [
                      "my_diego",
                      "[felice] Devo correre alla baracca prima che l'umidità serale ossidi i contatti d'argento!"
                    ]
                  ]
                },
                { bond: ["coraggio", 10] },
                { bond: ["sintonia", 10] },
                { flag: { my_d_valvola_trovata: true } },
                { step: 1 },
                {
                  quest: [
                    "my_c4_baracca",
                    "La Baracca del Telegrafo",
                    "Raggiungi la Baracca del Telegrafo a nord-ovest e parla con Xavier il Pilota."
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
                      "my_diego",
                      "[pensa] Il baule dei ricambi è in ordine. Non c'è altro da recuperare qui."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "my_d_baracca:T": [
            {
              when: { step: 2 },
              do: [
                {
                  trial: {
                    title: "La Decifrazione del Segnale a Onde Corte",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        prompt: "L'antenna riceve scariche statiche dai fulmini tropicali: come pulisci il segnale?",
                        options: [
                          { label: "Attivare il filtro a cristallo di quarzo e calibrare la terra marina!", ok: true },
                          { label: "Alzare il volume al massimo" },
                          { label: "Bagnare i fili con acqua distillata" }
                        ],
                        good: "Filtro perfetto: il fruscio si dissipa e i toni Morse emergono limpidi!",
                        bad: "Fischio assordante: le valvole stridono e perdi il contatto per diversi secondi!"
                      },
                      {
                        prompt: "Un messaggio cifrato a onde corte viene trasmesso a 24 parole al minuto: cosa intercetti?",
                        options: [
                          { label: "Tre punti, tre linee, tre punti: richiesta d'ormeggio clandestino al Cenote!", ok: true },
                          { label: "Una ricetta per la paella" },
                          { label: "La sigla musicale del notiziario di Merida" }
                        ],
                        good: "Decifrazione magistrale: hai scoperto il punto esatto di sbarco dei mercenari!",
                        bad: "Traduzione errata: interpreti male le lettere e perdi tempo prezioso!"
                      },
                      {
                        prompt: "La valvola termoionica del trasmettitore si surriscalda pericolosamente: rimedio immediato?",
                        options: [
                          { label: "Sostituire la valvola con quella di scorta e isolare la bobina con lamine di rame!", ok: true },
                          { label: "Soffiarci sopra con forza a pieni polmoni" },
                          { label: "Gettare la valvola incandescente nel fiume" }
                        ],
                        good: "Manovra tecnica impeccabile: il circuito si raffredda e la trasmissione resta stabile!",
                        bad: "Cortocircuito: la valvola fuma e devi riavviare l'alimentatore a nafta!"
                      },
                      {
                        prompt: "La stele maya collegata all'antenna entra in risonanza col rimbalzo della palla: frequenza esatta?",
                        options: [
                          { label: "Sintonizzare la frequenza di 432 Hertz coincidente con l'eco dell'Anello di Pietra!", ok: true },
                          { label: "Azzerare la manopola a zero" },
                          { label: "Staccare l'altoparlante della radio" }
                        ],
                        good: "Risonanza armonica sacra: il battito del Pok-ta-pok illumina la scala graduata!",
                        bad: "Fuori scala: il segnale rimbalza senza trovare sintonia con la piramide!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "my_xavier",
                            "[esulta stringendo la mano a Diego] Eureka! Il segnale è nitido come il cielo all'alba! Abbiamo intercettato la rotta di Vargas!"
                          ],
                          [
                            "my_diego",
                            "[ride soddisfatto] Te l'avevo detto che il codice Morse non mente mai! Ora usciamo alla radura: Vargas si sta avvicinando dal sentiero delle ceibe."
                          ]
                        ]
                      },
                      { flag: { my_d_segnale_pulito: true } },
                      { bond: ["coraggio", 15] },
                      { bond: ["sintonia", 15] },
                      { step: 3 },
                      {
                        quest: [
                          "my_c4_vargas",
                          "La Resa dei Conti alla Radura",
                          "Esci dalla baracca e affronta il Capitano Vargas apparso sul sentiero a est."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "my_xavier",
                            "[tossisce tra lo sbuffo di fumo della valvola] Abbiamo perso qualche frammento di codice, Diego, ma il messaggio generale è chiaro: Vargas è qui vicino!"
                          ],
                          [
                            "my_diego",
                            "[serio] Non c'è tempo da perdere. Usciamo prima che circondino la radura!"
                          ]
                        ]
                      },
                      { flag: { my_d_segnale_disturbato: true } },
                      { bond: ["coraggio", 5] },
                      { step: 3 },
                      {
                        quest: [
                          "my_c4_vargas",
                          "La Resa dei Conti alla Radura",
                          "Esci dalla baracca e affronta il Capitano Vargas apparso sul sentiero a est."
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
                      "my_diego",
                      "[pensa] Il banco del telegrafo emette un ronzio regolare. Le onde corte sono stabili."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        blocks: {
          concludi_capitolo_4: [
            {
              reward: {
                key: "dossier_my_c4",
                give: { coins: 180, cos: ["my_d_cuffie"] }
              }
            },
            { finish: "c4_ok" },
            { step: 9 },
            {
              scene: [
                [
                  "my_diego",
                  "<b>DOSSIER LA PIRAMIDE DEL SOLE · CAPITOLO 4 CONCLUSO</b><br>La linea d'emergenza è ristabilita e i mercenari sono stati depistati. Diego raduna le provviste e sale a bordo della zattera verso il Cenote Sacro per l'ultimo decisivo confronto sotterraneo!"
                ],
                "{reward}"
              ],
              openMain: true
            }
          ]
        }
      },
      {
        n: 5,
        title: "Il Tempio Sommergibile del Cenote",
        sub: "Dossier Incompiuto: l'antica sfida delle acque carsiche e il destino del segreto maya",
        avatar: DIEGO_C5,
        start: "my_d_cenote",
        introBg: "my_cenote",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · LA PIRAMIDE DEL SOLE</b> Il Cenote Sacro delle Acque Chiare. Un lago sotterraneo turchese racchiuso tra colonne di stalattiti calcaree."
          ],
          [
            "my_diego",
            "[serio] (Osserva le stalattiti che gocciolano ritmicamente nel silenzio maestoso della caverna.) Siamo nel ventre della terra maya. L'acqua limpida del Cenote nasconde le paratie idrauliche che regolano il battito della piramide intera. Se i mercenari forzano i sigilli, l'inondazione sommergerà per sempre millenni di storia dello sport! Balam mi ha mostrato l'Anello Sommerso: tocca a me far rimbalzare la sfera di caucciù per ripristinare l'equilibrio!"
          ]
        ],
        goal: {
          0: "Parla con Balam il Custode sulla banchina di balsa del Cenote (in basso a sinistra).",
          1: "Entra nella Grotta dell'Anello Sommerso (in alto al centro) per riallineare le paratie.",
          2: "Ispeziona l'altare delle paratie (tessera T) ed esegui la prova idraulica dell'Anello.",
          3: "Parla con il Guardiano Kukulkan e con il Professor Alvarez per decidere il futuro della scoperta."
        },
        goalDone: "Il Dossier de La Piramide del Sole è concluso con successo. Hai salvato la memoria ancestrale!",
        cast: { ...CAST },
        cos: {
          my_d_giubba: {
            kind: "shirt",
            label: "Giubba da Campo delle Onde Corte",
            val: "#f59e0b",
            from: "Dossier de La Piramide del Sole · Capitolo 5"
          },
          my_d_fascia_cenote: {
            kind: "style",
            label: "Fascia Sacra del Tuffatore",
            val: "bandana",
            from: "Dossier de La Piramide del Sole · Capitolo 5"
          }
        },
        lore: {
          l_cenote_sacro: {
            t: "L'Anello Sommerso del Cenote",
            d: "Il campo cerimoniale anfibio scavato nelle caverne d'acqua dolce: le paratie di pietra regolavano i flussi del lago grazie al rintocco della sfera di caucciù vulcanizzato."
          }
        },
        endings: {
          diego_ponte_radio: [
            "IL PONTE RADIO DI KUKULKAN",
            "Diego sincronizza il trasmettitore ad onde corte con l'eco d'ambra dell'Anello di Pietra. Il rito del Pok-ta-pok viene trasmesso in diretta a tutte le accademie e agli amatori del mondo, trasformando il gioco sacro dei Maya in un patrimonio universale di fratellanza sportiva.",
            "Scegli la via della condivisione universale al cospetto del Guardiano nel Capitolo 5."
          ],
          diego_archivio_segreto: [
            "IL PATTO DEL SILENZIO ETERNO",
            "Diego disconnette le antenne e sigilla i registri della spedizione con ceralacca e linfa di caucciù. Le coordinate della piramide restano un segreto inviolabile, custodito per sempre dal silenzio della giungla e dalle acque limpide del Cenote.",
            "Scegli la via della protezione segreta al cospetto del Guardiano nel Capitolo 5."
          ]
        },
        zones: {
          my_d_cenote: {
            region: "giungla",
            name: "Dossier Piramide · Bacino Superiore del Cenote",
            short: "Bacino del Cenote",
            sub: "Acqua turchese, stalattiti calcaree e zattera di balsa all'ormeggio",
            bg: "my_cenote",
            time: "notte",
            travel: [15, 19],
            w: 32,
            h: 22,
            start: [15, 19],
            areas: [
              [11, 2, 21, 8, "La Grotta dell'Anello Sommerso"],
              [2, 10, 30, 20, "La Banchina di Balsa"],
              [0, 0, 31, 21, "Il Cenote Sacro"]
            ],
            act: {
              Z: "Ispeziona la zattera",
              A: "Guarda l'anello cerimoniale",
              B: "Osserva il braciere",
              W: "Ammira l'acqua sorgiva",
              b: "Panca di balsa",
              p: "Pilone calcareo",
              s: "Riposa"
            },
            flavor: {
              Z: "Una solida zattera in tronchi di balsa e liane intrecciate, pronta a scivolare sulle correnti.",
              A: "Un antico anello di pietra forato sospeso sopra il livello dell'acqua del lago sotterraneo.",
              B: "Un braciere votivo maya ricavato da un unico blocco di pietra lavica.",
              W: "Le acque turchesi del Cenote, limpidissime e fresche come cristallo fuso.",
              b: "Panca di legno galleggiante ancorata con corde di iuta.",
              p: "Un pilone calcareo naturale che sorregge la volta carsica del Cenote."
            },
            intro: [
              [
                "voce",
                "Il Cenote Sacro delle Acque Chiare: fasci di luce lunare filtrano dalle aperture della volta rocciosa, accendendo bagliori smeraldini sulle acque profonde."
              ]
            ],
            npcs: [
              { id: "my_balam", at: [10, 18], when: { step: [0, 1] } },
              { id: "my_ixchel", at: [20, 18], when: { step: [0, 1] } },
              { id: "my_alvarez", at: [25, 18], when: { step: [2, 9] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 2, 17, 29, 19, "+"],
              ["lay", 15, 6, 15, 17, ":"],
              ["lay", 4, 6, 27, 6, ":"],
              ["house", 11, 2, 9, 5, { door: [15, 6], roof: "#059669", wall: "#064e3b", rr: 1, enter: { to: "my_d_grotta", at: [8, 10] } }],
              ["put", 4, 11, "A"],
              ["put", 9, 11, "A"],
              ["put", 22, 11, "A"],
              ["put", 27, 11, "A"],
              ["put", 14, 13, "Z"],
              ["put", 18, 13, "Z"],
              ["put", 6, 17, "B"],
              ["put", 25, 17, "B"],
              ["put", 8, 13, "W"],
              ["put", 23, 13, "W"],
              ["put", 16, 8, "W"],
              ["put", 5, 19, "s"],
              ["put", 12, 19, "p"],
              ["put", 18, 19, "p"]
            ],
            trees: [[2, 5], [29, 5], [2, 16], [29, 16]]
          },
          my_d_grotta: {
            interior: true,
            region: "rovine",
            name: "Dossier Piramide · Camera dell'Anello Sommerso",
            short: "Camera Sommersa",
            sub: "Colonne d'ambra, echi cristallini e l'altare cerimoniale delle paratie",
            bg: "my_cenote",
            w: 16,
            h: 12,
            start: [8, 10],
            outside: ["my_d_cenote", 15, 7],
            act: {
              T: "Esamina l'altare delle paratie",
              A: "Ammira l'Anello Sommerso",
              L: "Osserva le iscrizioni murali",
              x: "Guarda l'urna cerimoniale",
              v: "Esci"
            },
            flavor: {
              T: "L'antico altare di comando idraulico: fessure per lastre di giada e perni di bronzo per regolare il livello del lago.",
              A: "L'Anello Sommerso di Kukulkan: la pietra verde vibra di una risonanza profonda ad ogni rintocco.",
              L: "Lastre di calcare finemente scolpite con i simboli dei guardiani della pioggia e del sole.",
              x: "Un'urna votiva in terracotta con offerte di copale e sfere di caucciù vulcanizzato."
            },
            intro: [
              [
                "voce",
                "La Camera dell'Anello Sommerso: le pareti riflettono bagliori ambrati sull'acqua immobile. Al centro, la sacra figura del Guardiano Kukulkan veglia sul meato delle acque."
              ]
            ],
            npcs: [
              { id: "my_kukulkan", at: [8, 3], when: { step: [1, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 8),
              ["lay", 2, 2, 13, 2, "L"],
              ["put", 8, 4, "T"],
              ["put", 4, 5, "B"],
              ["put", 12, 5, "B"],
              ["put", 3, 8, "B"],
              ["put", 13, 8, "B"],
              ["put", 3, 4, "x"],
              ["put", 2, 9, "l"],
              ["put", 13, 9, "l"]
            ]
          }
        },
        talk: {
          my_balam: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "my_balam",
                      "[asciuga l'acqua dalle spalle muscolose] Benvenuto nel Cenote Sacro, Diego! Ho sentito il ronzio delle tue onde corte fin quaggiù."
                    ],
                    [
                      "my_diego",
                      "I mercenari hanno cercato di manomettere le condutture superiori. Dobbiamo stabilizzare le paratie prima che la falda sommerga l'atrio!"
                    ],
                    [
                      "my_balam",
                      "La chiave è nella Camera dell'Anello Sommerso lassù a nord. Il Guardiano Kukulkan aspetta chi sappia sincronizzare il battito dell'uomo con la voce dell'acqua!"
                    ]
                  ]
                },
                { step: 1 },
                {
                  quest: [
                    "my_c5_grotta",
                    "La Camera dell'Anello Sommerso",
                    "Entra nella Camera a nord ed esamina l'altare delle paratie (T)."
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
                      "my_balam",
                      "[felice] L'acqua è calma e la pietra ha risposto: hai onorato le nostre radici, Diego!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          my_ixchel: [
            {
              when: { step: [0, 1] },
              do: [
                {
                  say: [
                    [
                      "my_ixchel",
                      "[stringe la fascia smeraldo] Diego, il tuo telegrafo ci ha salvato dai predoni. Ma ora la prova più grande è all'interno della grotta: colpisci la sfera col fianco destro e ascolta l'eco dell'Anello!"
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
                      "my_ixchel",
                      "[sorride con occhi lucenti] Il Serpente Piumato ha ascoltato la tua voce: la piramide è salva!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          my_alvarez: [
            {
              when: { step: [2, 9] },
              do: [
                {
                  say: [
                    [
                      "my_alvarez",
                      "[commosso, si toglie gli occhiali per pulirli] Straordinario, Diego! Assolutamente straordinario! Hai salvato la spedizione e dimostrato che la scienza moderna e il culto ancestrale possono dialogare in perfetta armonia!"
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
                      "my_alvarez",
                      "[felice] Il mondo dello sport e dell'archeologia non dimenticherà mai il tuo coraggio!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          my_kukulkan: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    [
                      "my_kukulkan",
                      "[solenne, gli occhi d'ambra risplendono nella penombra] Uomo delle voci invisibili. Hai portato le tue scintille di rame nel silenzio del tempio. Ora avvicinati all'altare (tessera T) e dimostra che il tuo cuore sa guidare il moto dell'Anello Sommerso!"
                    ]
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
                      "my_kukulkan",
                      "[china il capo con solenne rispetto] Le acque sono placate e il rintocco dell'Anello ha sigillato la piramide. Ora spetta a te, custode delle onde corte, decidere come tramandare questo prodigio alle generazioni future."
                    ],
                    [
                      "my_diego",
                      "[serio] È arrivato il momento di scegliere quale messaggio trasmettere al mondo."
                    ]
                  ]
                },
                {
                  ask: {
                    who: "my_diego",
                    prompt: "Quale destino scegli per la Piramide del Sole e il suo antico rito?",
                    options: [
                      {
                        label: "Il Ponte Radio di Kukulkan: condividi il rito con tutte le genti",
                        sub: "Fratellanza universale: trasmetti il segnale e apri la cultura maya al mondo",
                        do: [{ call: "finale_ponte" }]
                      },
                      {
                        label: "Il Patto del Silenzio Eterno: proteggi il segreto nella giungla",
                        sub: "Custodia sacra: stacca le antenne e preserva la piramide da ogni cupidigia",
                        do: [{ call: "finale_segreto" }]
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
                      "my_kukulkan",
                      "[solenne] La luce del Sole e la quiete delle Acque benedicono il tuo cammino."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "my_d_grotta:T": [
            {
              when: { step: 1 },
              do: [
                {
                  trial: {
                    title: "La Prova delle Paratie d'Acqua Sacra",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        prompt: "La paratia sotterranea rischia di cedere sotto la pressione del lago: quale leva idraulica azioni?",
                        options: [
                          { label: "Innestare il contrappeso di basalto e convogliare l'acqua nel canale d'irrigazione!", ok: true },
                          { label: "Bloccare lo scarico con stracci" },
                          { label: "Martellare le pietre finché non si spaccano" }
                        ],
                        good: "Mossa perfetta: il contrappeso scivola nei binari e il livello del lago si stabilizza!",
                        bad: "Pressione pericolosa: le fughe d'acqua allagano la passerella e rischi di cadere!"
                      },
                      {
                        prompt: "La palla rituale di caucciù rimbalza sulle stalattiti con un'angolazione cieca: come indirizzi il tiro?",
                        options: [
                          { label: "Colpo d'anca secco a palombella sfruttando la pendenza della roccia calcarea!", ok: true },
                          { label: "Calcio di punta a occhi chiusi" },
                          { label: "Tiro rasoterra verso il fondo del lago" }
                        ],
                        good: "Traiettoria impeccabile: la sfera accarezza il calcare e punta dritta al cerchio sacro!",
                        bad: "Rimbalzo impazzito: la gomma schizza fuoribordo e si perde tra le correnti!"
                      },
                      {
                        prompt: "Il livello del Cenote sale e le fiaccole rischiano di spegnersi nel fumo: come mantieni la visibilità?",
                        options: [
                          { label: "Orientare lo specchio d'ambra verso l'apertura della volta per riflettere la luna!", ok: true },
                          { label: "Accendere un falò di gomma" },
                          { label: "Chiudere gli occhi e affidarsi al caso" }
                        ],
                        good: "Riflesso dorato abbagliante: l'antro si illumina a giorno mostrando la fessura d'innesto!",
                        bad: "Fumo denso: tossisci nell'oscurità e perdi l'allineamento con l'Anello!"
                      },
                      {
                        prompt: "Ultima spinta dell'Anello Sommerso: serve un rintocco perfetto per sigillare il meato!",
                        options: [
                          { label: "Volée di ginocchio precisa al centro esatto dell'anello di giada!", ok: true },
                          { label: "Lanciare la palla con le mani oltre la linea" },
                          { label: "Spingere l'anello col piede" }
                        ],
                        good: "Rintocco monumentale: il suono di campana fa vibrare le stalattiti e le paratie si chiudono!",
                        bad: "Colpo debole: la palla sfiora l'orlo senza entrare e l'acqua continua a salire!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "my_kukulkan",
                            "[ammirato, solleva lo scettro di piume] La sfera ha cantato nell'Anello! Le acque sacre riconoscono la tua fermezza, Diego."
                          ],
                          [
                            "my_diego",
                            "[respira a pieni polmoni, asciugandosi la fronte] Ce l'abbiamo fatta! Le paratie tengono e la piramide è salva!"
                          ]
                        ]
                      },
                      { flag: { my_d_cenote_salvo: true } },
                      { bond: ["coraggio", 20] },
                      { bond: ["sintonia", 20] },
                      { step: 2 },
                      {
                        quest: [
                          "my_c5_verdetto",
                          "Il Verdetto della Piramide",
                          "Parla con il Guardiano Kukulkan per decidere il futuro della scoperta."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "my_kukulkan",
                            "[grave] La prova è stata ardua e l'acqua ha lambito i tuoi piedi, ma il tuo spirito non ha ceduto allo sconforto."
                          ],
                          [
                            "my_diego",
                            "[stringe i denti] Ho faticato sui rimbalzi, ma la linea è salva. Non lascerò che questo tempio venga distrutto!"
                          ]
                        ]
                      },
                      { flag: { my_d_cenote_faticoso: true } },
                      { bond: ["coraggio", 10] },
                      { step: 2 },
                      {
                        quest: [
                          "my_c5_verdetto",
                          "Il Verdetto della Piramide",
                          "Parla con il Guardiano Kukulkan per decidere il futuro della scoperta."
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
                      "my_diego",
                      "[pensa] L'altare delle paratie è bloccato in posizione sicura. Le acque defluiscono regolarmente."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        blocks: {
          finale_ponte: [
            {
              say: [
                [
                  "my_diego",
                  "[entusiasta, aziona la leva del trasmettitore] Uniremo il passato e il futuro! Collegherò la frequenza armonica di Kukulkan alla rete radiofonica di Merida e di Città del Messico. Tutto il mondo ascolterà la voce del Pok-ta-pok e imparerà il rispetto per il gioco sacro!"
                ],
                [
                  "my_alvarez",
                  "[esulta abbracciando Diego e Ixchel] Il trionfo della scienza e dell'unione dei popoli! Diego, sei l'eroe di questa spedizione!"
                ],
                [
                  "my_kukulkan",
                  "[solenne] La voce del Serpente Piumato viaggerà nell'etere attraverso i continenti, portando pace e vigore a tutti i cuori sportivi."
                ]
              ]
            },
            { end: "diego_ponte_radio" },
            { unlock: ["my_xavier", "my_balam"] },
            { finish: "diego_ponte_radio" },
            { step: 9 },
            {
              reward: {
                key: "dossier_my_c5_ponte",
                give: { coins: 300, cos: ["my_d_giubba"] }
              }
            },
            {
              scene: [
                [
                  "my_diego",
                  "<b>FINALE I · IL PONTE RADIO DI KUKULKAN</b><br>Dalla sommità della piramide e dalle acque del Cenote, le onde corte di Diego trasmettono in tutto il globo il ritmo ancestrale del Pok-ta-pok. Le accademie sportive celebrano la scoperta e una nuova fratellanza tra i popoli risplende sotto la luce del Sole!"
                ],
                "{reward}"
              ],
              openMain: true
            }
          ],
          finale_segreto: [
            {
              say: [
                [
                  "my_diego",
                  "[deciso, stacca le valvole dall'apparato e le ripone nella borsa di cuoio] Niente coordinate, niente riflettori. Questo tempio è sopravvissuto mille anni perché la giungla lo ha custodito. Se trasmettiamo la posizione, mercenari e cacciatori di souvenir devasteranno ogni stele. Il segreto deve restare sacro."
                ],
                [
                  "my_ixchel",
                  "[fiera e commossa] Hai scelto con il cuore, fratello. Le antiche stirpi ti ringraziano."
                ],
                [
                  "my_balam",
                  "[annuisce solenne] Le correnti del Cenote scivoleranno mute verso il mare, e nessun profanatore troverà mai la via per queste acque."
                ]
              ]
            },
            { end: "diego_archivio_segreto" },
            { unlock: ["my_xavier", "my_balam"] },
            { finish: "diego_archivio_segreto" },
            { step: 9 },
            {
              reward: {
                key: "dossier_my_c5_segreto",
                give: { coins: 300, cos: ["my_d_fascia_cenote"] }
              }
            },
            {
              scene: [
                [
                  "my_diego",
                  "<b>FINALE II · IL PATTO DEL SILENZIO ETERNO</b><br>Diego sigilla con ceralacca le carte nautiche e rimuove ogni traccia telegrafica. La Piramide del Sole e il Cenote Sacro tornano all'abbraccio protettivo della giungla dello Yucatán, custodi eterni di una leggenda incorruttibile!"
                ],
                "{reward}"
              ],
              openMain: true
            }
          ]
        }
      }
    ]
  });
})();
