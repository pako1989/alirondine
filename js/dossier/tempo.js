// js/dossier/tempo.js - DOSSIER INCOMPIUTI di «Rondine 1938-2038»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Ines del Bar (1978), quarant'anni, grembiule arancione, mano ferma sul flipper e memoria di tre generazioni.
// Cap. 4 «La Notte del Flipper Meccanico» (la vigilia della finale del 1978: gettoni d'epoca, anomalie sul tabellone e caffè bollente).
// Cap. 5 «L'Ultima Bobina del Cinema Eden» (la cabina di proiezione, il montaggio della pellicola del 1938 e il bivio tra bacheca e futuro).
// Minigiochi: «Il Riavvolgimento del Flipper Meccanico» (prova a tempo a scelte, cap. 4) e «Il Montaggio della Pellicola del '38» (prova a tempo a scelte, cap. 5).
(function () {
  "use strict";

  const LOOK_INES78 = {
    name: "Ines del Bar",
    style: "bun",
    hair: "#2a1a10",
    eye: "#5a6a7a",
    skin: "#e8cdb0",
    acc: ["occhiali"]
  };

  const INES_C4 = {
    name: "Ines del Bar",
    num: 1,
    cast: Object.assign({ sub: "Ostessa del Bar delle Rondini (1978)", shirt: "#c8602a", bg: ["#3a2a18", "#e8a030"] }, LOOK_INES78)
  };

  const INES_C5 = {
    name: "Ines del Bar",
    num: 1,
    cast: Object.assign({ sub: "Custode delle Memorie Gialloblù", shirt: "#ffb347", bg: ["#ffb347", "#3a2a18"] }, LOOK_INES78)
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
    rt_ines78: {
      name: "Ines del Bar",
      desc: "Quarant'anni nel 1978, il bar suo da quando ne aveva venti. Grembiule arancione, mano ferma sul flipper e un taccuino dove annota chi paga il caffè e chi non segna mai: «Un caffè al vetro, due chiacchiere e niente scuse sui gol subiti: qui si gioca a testa alta!»",
      look: {
        style: "bun",
        hair: "#2a1a10",
        eye: "#5a6a7a",
        skin: "#e8cdb0",
        shirt: "#c8602a",
        acc: ["occhiali"],
        bg: ["#3a2a18", "#e8a030"]
      }
    },
    rt_aldo: {
      name: "Aldo il Proiezionista",
      desc: "Operatore della cabina di proiezione del Cinema Eden nel 1978. Taglia, incolla e riavvolge pellicole a trentasei fotogrammi al secondo: «Taglia la pellicola, incolla il contropiede: al cinema come in campo, il tempo è tutto un montaggio!»",
      look: {
        style: "messy",
        hair: "#4a3a2a",
        beard: "baffi",
        eye: "#2a2a2a",
        skin: "#e0c090",
        shirt: "#8a5a2a",
        acc: ["occhiali"],
        bg: ["#3a2a18", "#c8782a"]
      }
    }
  };

  const ENDS = ["ines_bacheca_bar", "ines_staffetta_tempo"];

  window.__dossierDati.add({
    saga: "tempo",
    after: 3,
    guest: {
      id: "rt_ines78",
      saga: "Rondine 1938-2038 · Il Dossier di Ines",
      ends: ENDS,
      lines: [
        [
          "rt_ines78",
          "[si sistema gli occhiali e passa un panno sul tavolo] Che bella brezza di mare qui al Borgo! Nel '78 avevamo solo il vapore della macchina del caffè e il profumo di polvere del piazzale. Ma dimmi una cosa, {n}: com'è che quando fate gol non offrite mai una gassosa a tutto il bar? Quello sì che faceva squadra!"
        ]
      ]
    },
    deck: {
      id: "rtt",
      t: "Il Dossier di Ines",
      e: "☕",
      ends: ENDS,
      lock: "Trova un finale del Dossier di Rondine 1938-2038",
      d: "Il Bar da Ines nel 1978, gettoni d'ottone, bobine cinematografiche e la memoria del calcio che resiste al tempo.",
      pg: {
        id: "rt_aldo",
        n: "Aldo il Proiezionista",
        i: "📽️",
        tr: "furbizia",
        d: "Proiezionista del Cinema Eden nel 1978. Sa riconoscere un fuorigioco dal rumore della bobina che prende velocità.",
        greet: "Una sfida sul campo di {a}? Attento che monto il contropiede a trentasei fotogrammi al secondo!",
        win: "Gol da cineteca! Taglio perfetto sul primo palo e applausi in sala.",
        lose: "Si è spezzata la pellicola sul più bello: ci tocca rifare il montaggio."
      },
      ev: {
        n: "Il Gettone da Cento Lire Forato",
        i: "🪙",
        d: "Una moneta d'epoca trovata sotto il bancone del bar, legata a un filo di nylon.",
        setup: [
          "Dietro la cassa del Bar da Ines trovi un gettone da cento lire forato con un filo invisibile.",
          "I ragazzi del '78 lo usavano per giocare gratis al flipper prima degli allenamenti. Che facciamo?"
        ],
        ch: [
          [
            "Inserisci il gettone nel flipper",
            "furbizia",
            "La mano ferma vince sempre.",
            "Il flipper rimbomba di campane e regala partita gratis e quaranta monete nel cassetto.",
            "Il filo si spezza e la moneta resta incastrata, facendo scattare l'allarme TILT."
          ],
          [
            "Restituiscilo a Ines dietro al banco",
            "cuore",
            "L'onestà paga sempre al bar.",
            "Ines sorride commossa e ti prepara un panino con la mortadella fumante e venti monete di mancia.",
            "Ines ti rimprovera bonariamente e ti fa pulire tre tavolini prima di farti andare."
          ],
          [
            "Usalo come rondella per il fischietto",
            "audacia",
            "L'inventiva salva ogni partita.",
            "La moneta calibra il fischietto dell'arbitro donandogli un suono argentino che zittisce gli spalti.",
            "Il fischietto emette solo un soffio rauco che fa ridere tutta la curva."
          ]
        ]
      },
      tw: {
        n: "Rallentatore d'Epoca",
        i: "🎞️",
        d: "Moviola manuale che scompone l'azione in mille dettagli.",
        win: "La revisione certifica il gol all'incrocio dei pali: bottino aumentato.",
        lose: "Viene scovato un millimetrico tocco di braccio: annullamento e sanzione.",
        mulWin: 1.35,
        mulLose: 0.85
      }
    },
    chapters: [
      {
        n: 4,
        title: "La Notte del Flipper Meccanico",
        sub: "Dossier Incompiuto: la vigilia della finale del 1978, dal punto di vista di Ines del Bar",
        avatar: INES_C4,
        start: "rt_i_piazza78",
        introBg: "rt_piazza78",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · RONDINE 1938-2038</b> Rondinara, ottobre 1978. Il piazzale dello stadio nel calore arancione del tardo pomeriggio."
          ],
          [
            "rt_ines78",
            "[serio] (Passa uno straccio umido sui tavolini di ferro del bar.) Domani pomeriggio si gioca la finale della Coppa delle Rondini. Il Mister fuma sigarette spente, Rino ha i crampi allo stomaco e mezzo paese ha già ordinato i panini per l'intervallo. Ma stasera il mio flipper ha fatto una cosa strana: ho tirato fuori dalla gettoniera un gettone d'ottone del 1938 con una data incisa... 2038. Chi sta giocando con gli orologi di Rondinara?"
          ]
        ],
        goal: {
          0: "Controlla la cassetta delle consegne del bar vicino alla fontana (in basso a sinistra).",
          1: "Entra nel Bar da Ines (in alto a destra) e parla con Rino l'ala sinistra.",
          2: "Ispeziona il flipper elettromeccanico (tessera Y) ed esegui la prova di riavvolgimento.",
          3: "Affronta Aldo il Proiezionista giunto trafelato in piazza prima del tramonto."
        },
        goalDone: "Il Capitolo 4 è completato. Puoi proseguire con il Capitolo 5.",
        cast: { ...CAST },
        cos: {
          rt_i_sciarpa_78: {
            kind: "style",
            label: "Sciarpa Gialloblù Anni '70",
            val: "fascia",
            from: "Dossier di Rondine 1938-2038 · Capitolo 4"
          }
        },
        lore: {
          l_flipper_78: {
            t: "Il Flipper del Bar da Ines",
            d: "Un apparecchio elettromeccanico a rulli e campanelli del 1978. Quando i gettoni giusti scivolano nella fessura, le luci creano ponti di risonanza tra gli anni dello stadio."
          }
        },
        zones: {
          rt_i_piazza78: {
            region: "settanta",
            name: "Dossier Tempo · Piazzale dello Stadio 1978",
            short: "Piazzale 1978",
            sub: "Vespe parcheggiate, manifesti della finale e sole dorato d'autunno",
            bg: "rt_piazza78",
            time: "tramonto",
            travel: [12, 11],
            w: 32,
            h: 22,
            start: [12, 11],
            areas: [
              [20, 2, 27, 7, "Il Bar da Ines"],
              [8, 7, 22, 17, "La piazza"],
              [0, 0, 31, 21, "Il Piazzale dello Stadio"]
            ],
            act: {
              n: "Leggi il manifesto della finale",
              l: "Guarda il lampione",
              b: "Siediti sulla panchina",
              x: "Apri la cassetta delle consegne",
              w: "Guarda la fontana",
              s: "Riposa"
            },
            flavor: {
              n: "Un manifesto arancione: «FINALE DELLA COPPA DELLE RONDINI · RONDINARA vs AURORA · DOMANI ORE 15:00 · TUTTI AL CAMPO!».",
              l: "Un lampione di ferro battuto che inizia ad accendersi con un ronzio caldo di gas e vetro.",
              b: "Panchina di legno consumata dove i vecchi del paese commentano la formazione da quarant'anni.",
              x: "Una cassetta di legno d'abete usata per le consegne del caffè e delle bibite gassate.",
              w: "La fontana della piazza: l'acqua zampilla fresca nel silenzio della sera prima della partita."
            },
            intro: [
              [
                "voce",
                "Rondinara, ottobre 1978. L'odore di miscela dei motorini si mescola al profumo di caffè tostato e all'erba tagliata del campo sportivo."
              ]
            ],
            npcs: [
              { id: "rt_rino", at: [16, 15], when: { step: [0, 1] } },
              { id: "rt_mister", at: [26, 9], when: { step: [0, 1] } },
              { id: "rt_aldo", at: [18, 12], when: { step: [3, 9] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 10, 30, 11, ":"],
              ["lay", 23, 6, 23, 11, ":"],
              ["lay", 8, 7, 22, 17, "+"],
              ["house", 20, 2, 7, 5, { door: [23, 6], roof: "#a8522a", wall: "#e8c89a", rr: 1, enter: { to: "rt_i_bar78", at: [8, 9] } }],
              ["lay", 2, 2, 7, 6, "a"],
              ["put", 14, 8, "w"],
              ["put", 4, 14, "x"],
              ["put", 26, 12, "n"],
              ["put", 12, 9, "n"],
              ["put", 10, 13, "b"],
              ["put", 19, 13, "b"],
              ["put", 8, 8, "l"],
              ["put", 22, 8, "l"],
              ["put", 8, 16, "l"],
              ["put", 22, 16, "l"],
              ["put", 11, 18, "s"]
            ],
            trees: [[2, 10], [30, 10], [15, 4], [28, 4], [4, 19], [27, 19]]
          },
          rt_i_bar78: {
            interior: true,
            region: "settanta",
            name: "Dossier Tempo · Bar da Ines 1978",
            short: "Bar da Ines",
            sub: "Macchina del caffè Faema a vapore, flipper elettromeccanico e gagliardetti",
            bg: "rt_piazza78",
            w: 16,
            h: 12,
            start: [8, 9],
            outside: ["rt_i_piazza78", 23, 7],
            act: {
              Y: "Esamina il flipper",
              T: "Guarda il bancone",
              L: "Ispeziona le mensole",
              C: "Controlla le cassette di gassose",
              v: "Esci"
            },
            flavor: {
              Y: "Il flipper elettromeccanico del bar: luci colorate che lampeggiano a ritmo e rulli numerati che scattano.",
              T: "Il banco di formica e alluminio dove Ines serve caffè e panini con la mortadella tagliata spessa.",
              L: "Mensole ricolme di bottiglie di bitter, barattoli di caramelle alla menta e bicchieri di vetro spesso.",
              C: "Cassette di legno con le bottiglie di cedrata e chinotto coi tappi a corona."
            },
            intro: [
              [
                "voce",
                "Il Bar da Ines nel 1978: il calore del vapore della macchina del caffè accoglie chi entra, tra risate di tifosi e il ticchettio metallico del flipper."
              ]
            ],
            npcs: [
              { id: "rt_rino", at: [8, 4], when: { step: [1, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 8),
              ["lay", 2, 2, 13, 2, "L"],
              ["put", 4, 4, "Y"],
              ["put", 10, 4, "T"],
              ["put", 2, 7, "C"],
              ["put", 13, 7, "C"],
              ["put", 2, 9, "l"],
              ["put", 13, 9, "l"]
            ]
          }
        },
        talk: {
          rt_mister: [
            {
              when: { step: [0, 1] },
              do: [
                {
                  say: [
                    [
                      "rt_mister",
                      "[impermeabile beige abbottonato, rigira una sigaretta spenta tra le labbra] Ragazzi... Domani non si scherza. L'Aurora gioca con il libero staccato di venti metri. Ines, tieni pronto il caffè amaro per l'intervallo."
                    ],
                    [
                      "rt_ines78",
                      "Il caffè è sempre pronto, Mister. Ma vedi di dire a Rino di non scivolare sul fango della bandierina!"
                    ],
                    [
                      "rt_mister",
                      "[fa un cenno col capo] Rino ha buone gambe. Piuttosto, ho visto una busta lasciata nella cassetta delle consegne a sinistra. Sembrava indirizzata al Club."
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
                      "rt_mister",
                      "[serio] Ragazzi... Concentrazione. Domani ci giochiamo cent'anni di storia in novanta minuti."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          rt_rino: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "rt_rino",
                      "[si asciuga la fronte con la manica] Ciao Ines! Ho appena finito il turno in bottega. Domani gioco con gli scarpini nuovi a sei tacchetti. Guarda nella cassetta delle consegne giù in piazza: il postino ha mollato un plico strano."
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
                      "rt_rino",
                      "[stupito] Ines, quei gettoni hanno la data del 1938! E sopra c'è scritto 'Officina Quarzo'!"
                    ],
                    [
                      "rt_ines78",
                      "Quarzo... il vecchio orologiaio della Torre. Da stamattina il flipper fa i capricci e i rulli dei punteggi girano al contrario."
                    ],
                    [
                      "rt_rino",
                      "Avvicinati al flipper (tessera Y) e prova a sbloccarlo con la levetta d'ottone prima che si incastri la molla!"
                    ]
                  ]
                },
                { step: 2 },
                {
                  quest: [
                    "rt_c4_flipper",
                    "Il Flipper delle Ore",
                    "Esamina il flipper (Y) nel bar ed esegui la prova di riavvolgimento meccanico."
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
                      "rt_rino",
                      "[agitato] Metti le mani sui respingenti (tessera Y) e dai un colpo d'anca pulito prima che vada in tilt!"
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
                      "rt_rino",
                      "[felice] Il flipper è tornato a cantare e la finale ci aspetta! Con una squadra così non abbiamo paura di nessuno!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          rt_aldo: [
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    [
                      "rt_aldo",
                      "[arriva correndo con una scatola di latta sotto il braccio e gli occhiali storti] Ines! Ines! Meno male che sei ancora qui! Abbiamo un problema enorme al Cinema Eden!"
                    ],
                    [
                      "rt_ines78",
                      "Calmati, Aldo. Prendi fiato. Che succede nella cabina di proiezione?"
                    ],
                    [
                      "rt_aldo",
                      "Stavo riordinando le bobine dei cinegiornali per l'intervallo di domani... e dal fondo del proiettore è uscita una scatola sigillata con la data del 14 ottobre 1938! La pellicola del primo gol della storia del Rondinara!"
                    ]
                  ]
                },
                {
                  ask: {
                    who: "rt_ines78",
                    prompt: "Come rispondi alla scoperta di Aldo?",
                    options: [
                      {
                        label: "Andiamo subito alla cabina del Cinema Eden a restaurare la pellicola",
                        sub: "Custodia attiva: salvare il reperto storico prima che la celluloide si rovini",
                        do: [
                          { flag: { rt_i_scelta_restauro: true } },
                          { bond: ["club", 20] },
                          {
                            say: [
                              [
                                "rt_ines78",
                                "[decisa] Chiudo a chiave la porta del bar e vengo con te. Quel gol appartiene alla memoria di tutti noi: nessuno deve permettersi di cancellarlo!"
                              ],
                              [
                                "rt_aldo",
                                "[sollevato] Sapevo di poter contare su di te, Ines! Corriamo al cortile del cinema!"
                              ]
                            ]
                          },
                          { call: "concludi_capitolo_4" }
                        ]
                      },
                      {
                        label: "Chiedi ad Aldo di portare la bobina direttamente al Mister per caricarlo",
                        sub: "Foga sportiva: usare il ricordo del '38 come benzina morale per la finale",
                        do: [
                          { flag: { rt_i_scelta_mister: true } },
                          { bond: ["club", 20] },
                          {
                            say: [
                              [
                                "rt_ines78",
                                "[grintosa] Aldo, questa è la scintilla che serviva ai nostri ragazzi! Mostriamola al Mister e a Rino, poi andiamo a montarla in moviola!"
                              ],
                              [
                                "rt_aldo",
                                "[sorride emozionato] Hai ragione! Quando i ragazzi vedranno Dorino calciare quella sfera, mangeranno l'erba del campo!"
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
                      "rt_aldo",
                      "[emozionato] Ci vediamo al Cinema Eden, Ines! La moviola ci aspetta!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "rt_i_piazza78:x": [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "rt_ines78",
                      "[serio] (Solleva il coperchio della cassetta delle consegne ed estrae una busta di carta paglia ingiallita.)"
                    ],
                    [
                      "rt_ines78",
                      "Dentro ci sono tre gettoni d'ottone forati e una nota a matita: «Per Ines. Il tempo fa giri strani, ma il caffè migliore resta sempre il tuo. Conserva la memoria delle ore 22:04. - Q.»"
                    ],
                    [
                      "rt_ines78",
                      "[pensa] Il professor Quarzo... Non lo vedo da quando ero bambina. Devo entrare al bar e mostrare questi gettoni a Rino."
                    ]
                  ]
                },
                { bond: ["club", 10] },
                { flag: { rt_i_busta_trovata: true } },
                { step: 1 },
                {
                  quest: [
                    "rt_c4_bar",
                    "Ritorno al Bar da Ines",
                    "Entra nel Bar da Ines (in alto a destra) e parla con Rino."
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
                      "rt_ines78",
                      "[pensa] La cassetta delle consegne è vuota. L'odore di caffè tostato è rassicurante."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "rt_i_bar78:Y": [
            {
              when: { step: 2 },
              do: [
                {
                  trial: {
                    title: "Il Riavvolgimento del Flipper Meccanico",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        prompt: "La pallina d'acciaio resta incastrata tra i respingenti elettrici del 1978: come la sblocchi?",
                        options: [
                          { label: "Un colpetto d'anca secco sul fianco sinistro senza far scattare il tilt!", ok: true },
                          { label: "Prendere a calci il vetro" },
                          { label: "Staccare la spina della luce" }
                        ],
                        good: "Mossa da veterana del bar: la sfera schizza libera tra i respingenti accumulando bonus!",
                        bad: "Troppa foga: la levetta scatta e il tabellone suona TILT a tutto volume!"
                      },
                      {
                        prompt: "Il tabellone a rulli si blocca su una combinazione temporale anomala: quale sequenza imposti?",
                        options: [
                          { label: "Allineare i rulli sulle ore 22:04, il minuto esatto della Torre!", ok: true },
                          { label: "Girare le rotelle a caso finché non si rompono" },
                          { label: "Dare colpi di cacciavite sui cardini" }
                        ],
                        good: "Sincronizzazione perfetta: un rintocco argentino sblocca gli ingranaggi!",
                        bad: "I rulli stridono e si bloccano a metà giro, mandando in corto il trasformatore!"
                      },
                      {
                        prompt: "Un gettone d'ottone del 1938 scivola nella fessura da cento lire: come regoli la molla?",
                        options: [
                          { label: "Spingere la levetta di sblocco a bilanciere con una punta sottile!", ok: true },
                          { label: "Forzare con una moneta da cinquecento lire" },
                          { label: "Versare olio d'oliva nel meccanismo" }
                        ],
                        good: "Sensibilità d'orologiaia: il gettone entra nel canale e accende la luce speciale!",
                        bad: "La molla si deforma e la gettoniera si blocca con un rumore sordo!"
                      },
                      {
                        prompt: "La bobina luminosa sul fondo lampeggia impazzita proiettando numeri: come scarichi la tensione?",
                        options: [
                          { label: "Collegare la massa a terra al telaio di ferro posteriore!", ok: true },
                          { label: "Metterci sopra uno straccio bagnato" },
                          { label: "Soffiare sui fusibili accesi" }
                        ],
                        good: "Scarica pulita: le luci tornano a pulsare in un caldo gialloblù da vittoria!",
                        bad: "Scintilla improvvisa: salta il fusibile e devi attendere che si raffreddi!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "rt_rino",
                            "[salta di gioia battendo le mani] Evviva Ines! Hai fatto il record della sala! Guardate come brillano i rulli delle centomila!"
                          ],
                          [
                            "rt_ines78",
                            "[sorride togliendosi gli occhiali per pulirli col grembiule] Te l'ho detto, Rino: a questo flipper non si comanda con la forza, ma col tempo giusto! Ora usciamo, sento Aldo che urla in piazza."
                          ]
                        ]
                      },
                      { flag: { rt_i_flipper_vinto: true } },
                      { bond: ["club", 15] },
                      { step: 3 },
                      {
                        quest: [
                          "rt_c4_aldo",
                          "L'Urgenza del Cinema Eden",
                          "Esci dal bar e parla con Aldo il Proiezionista giunto in piazza."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "rt_rino",
                            "[scuote la testa] Peccato per il tilt finale, Ines! Ma la gettoniera ha sputato comunque un foglio arrotolato."
                          ],
                          [
                            "rt_ines78",
                            "[seria] L'importante è aver liberato il meccanismo. Andiamo a sentire cosa vuole Aldo là fuori."
                          ]
                        ]
                      },
                      { flag: { rt_i_flipper_perso: true } },
                      { bond: ["club", 5] },
                      { step: 3 },
                      {
                        quest: [
                          "rt_c4_aldo",
                          "L'Urgenza del Cinema Eden",
                          "Esci dal bar e parla con Aldo il Proiezionista giunto in piazza."
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
                      "rt_ines78",
                      "[pensa] Il flipper è acceso e pronto per le partite dei ragazzi dopo la finale."
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
                key: "dossier_rt_c4",
                give: { coins: 180, cos: ["rt_i_sciarpa_78"] }
              }
            },
            { finish: "c4_ok" },
            { step: 9 },
            {
              scene: [
                [
                  "rt_ines78",
                  "<b>DOSSIER RONDINE 1938-2038 · CAPITOLO 4 CONCLUSO</b><br>Il mistero del flipper ha svelato l'esistenza della bobina perduta del 1938. Ines ripone il grembiule e si dirige verso il cortile del Cinema Eden per salvare la prima pellicola della storia gialloblù!"
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
        title: "L'Ultima Bobina del Cinema Eden",
        sub: "Dossier Incompiuto: la cabina di proiezione del 1978 e il destino della memoria del Club",
        avatar: INES_C5,
        start: "rt_i_cinema78",
        introBg: "rt_piazza78",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · RONDINE 1938-2038</b> Il cortile del Cinema Eden nel 1978. Ghiaia bianca, manifesti dipinti a mano e l'odore inconfondibile di pizza e popcorn."
          ],
          [
            "rt_ines78",
            "[serio] (Guarda la luce del proiettore che filtra dalla feritoia della cabina.) Il Cinema Eden ha fatto sognare tre generazioni di rondinaresi. Qui dentro si proiettavano i film di Totò, i western all'italiana e i cinegiornali delle vittorie sportive. E ora, tra scatoloni impolverati di pellicola, c'è il primo respiro del nostro stadio: la partita del 14 ottobre 1938. Se la celluloide brucia, quel giorno sarà perduto per sempre!"
          ]
        ],
        goal: {
          0: "Parla con Aldo il Proiezionista nel cortile del Cinema Eden (in basso a sinistra).",
          1: "Entra nella Cabina di Proiezione del Cinema (in alto al centro).",
          2: "Ispeziona il tavolo di montaggio (tessera T) ed esegui la prova di restauro della pellicola.",
          3: "Parla con Aldo al banco di montaggio e decidi il destino finale della bobina storica."
        },
        goalDone: "Il Dossier di Rondine 1938-2038 è concluso con successo. Hai protetto il cuore del tempo!",
        cast: { ...CAST },
        cos: {
          rt_i_grembiule_78: {
            kind: "shirt",
            label: "Grembiule Arancione del Bar da Ines",
            val: "#c8602a",
            from: "Dossier di Rondine 1938-2038 · Capitolo 5"
          },
          rt_i_occhiali_78: {
            kind: "style",
            label: "Occhiali d'Ambra del '78",
            val: "occhiali",
            from: "Dossier di Rondine 1938-2038 · Capitolo 5"
          }
        },
        lore: {
          l_pellicola_38: {
            t: "La Bobina del Primo Gol",
            d: "La pellicola in bianco e nero girata da Rosa Fornaro il 14 ottobre 1938 durante la prima partita del Rondinara: il documento autentico che nessun VAR potrà mai cancellare."
          }
        },
        endings: {
          ines_bacheca_bar: [
            "LA BACHECA DEI RICORDI",
            "Ines decide di custodire la bobina restaurata nella vetrinetta di noce del Bar da Ines, accanto alla Coppa del '78. Per sessant'anni i tifosi sosteranno davanti a quel vetro prima di ogni partita, ritrovando il calore immutabile delle proprie radici.",
            "Scegli di custodire la bobina nel bar al tavolo del montaggio nel Capitolo 5."
          ],
          ines_staffetta_tempo: [
            "LA STAFFETTA DELLE TRE EPOCHE",
            "Ines affida la bobina sigillata al Pullman Rondine perché viaggi verso il futuro. Nel 2038, durante il centenario, il filmato del primo gol viene proiettato sui megaschermi al neon davanti a diecimila spettatori commossi: la memoria non sbiadisce, diventa futuro.",
            "Scegli di inviare la bobina al futuro al tavolo del montaggio nel Capitolo 5."
          ]
        },
        zones: {
          rt_i_cinema78: {
            region: "settanta",
            name: "Dossier Tempo · Cortile del Cinema Eden 1978",
            short: "Cortile Cinema",
            sub: "Locandine dipinte a mano, ghiaia chiara e bobine metalliche all'aperto",
            bg: "rt_piazza78",
            time: "tramonto",
            travel: [15, 19],
            w: 32,
            h: 22,
            start: [15, 19],
            areas: [
              [11, 2, 20, 7, "La Cabina di Proiezione"],
              [2, 16, 29, 20, "Il cortile del cinema"],
              [0, 0, 31, 21, "Il Cinema Eden"]
            ],
            act: {
              n: "Leggi la locandina del film",
              b: "Siediti sulla panca",
              l: "Guarda il lampioncino del cinema",
              A: "Ammira la vetrina delle foto",
              s: "Riposa"
            },
            flavor: {
              n: "Una locandina dipinta a mano: «CINEMA EDEN · QUESTA SERA: GRANDI GOL E GRANDI AMORI · DOMANI CHIUSO PER FINALE».",
              b: "Panca di ferro e doghe di legno smaltate di verde dove gli spettatori aspettano il secondo tempo.",
              l: "Lampioncino a globo con luce calda che rischiara l'ingresso del cinema.",
              A: "Vetrinetta con le fotografie di scena in bianco e nero e i ritratti dei campioni locali.",
              s: "Panchina riparata sotto il glicine del cortile."
            },
            intro: [
              [
                "voce",
                "Il cortile del Cinema Eden nel 1978: un ronzio continuo proviene dalla cabina di proiezione, mentre il tramonto colora di porpora le facciate delle case."
              ]
            ],
            npcs: [
              { id: "rt_aldo", at: [10, 18], when: { step: [0, 1] } },
              { id: "rt_mister", at: [20, 18], when: { step: [0, 1] } },
              { id: "rt_dorino", at: [25, 18], when: { step: [2, 9] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 17, 30, 19, "+"],
              ["lay", 15, 6, 15, 17, ":"],
              ["lay", 4, 8, 27, 8, ":"],
              ["house", 11, 2, 9, 5, { door: [15, 6], roof: "#8a5a2a", wall: "#b0a080", rr: 1, enter: { to: "rt_i_cabina78", at: [8, 10] } }],
              ["put", 16, 12, "A"],
              ["put", 12, 14, "b"],
              ["put", 18, 14, "b"],
              ["put", 14, 8, "l"],
              ["put", 16, 8, "l"],
              ["put", 26, 12, "n"],
              ["put", 5, 18, "s"]
            ],
            trees: [[2, 5], [29, 5], [2, 16], [29, 16]]
          },
          rt_i_cabina78: {
            interior: true,
            region: "settanta",
            name: "Dossier Tempo · Cabina di Proiezione del Cinema Eden",
            short: "Cabina Proiezione",
            sub: "Proiettore Victoria a carboni, moviola a manovella e scatole di latta",
            bg: "rt_officina",
            w: 16,
            h: 12,
            start: [8, 10],
            outside: ["rt_i_cinema78", 15, 7],
            act: {
              T: "Esamina il tavolo di montaggio",
              L: "Ispeziona le mensole delle pellicole",
              B: "Guarda le bobine metalliche",
              x: "Esamina la giuntatrice",
              v: "Esci"
            },
            flavor: {
              T: "Il tavolo di montaggio in legno massiccio con la moviola manuale, la lente d'ingrandimento e la colla per pellicole.",
              L: "Scaffali metallici ricolmi di pizze di celluloide, registri di noleggio e flaconi di trielina.",
              B: "Grandi bobine di alluminio forato con le etichette delle stagioni sportive passate.",
              x: "La giuntatrice a caldo usata per unire i fotogrammi senza lasciare sbavature."
            },
            intro: [
              [
                "voce",
                "La Cabina di Proiezione: l'odore pungente di acetone e celluloide avvolge ogni cosa. Attraverso la feritoia si scorge il grande schermo bianco in attesa della luce."
              ]
            ],
            npcs: [
              { id: "rt_aldo", at: [8, 3], when: { step: [1, 9] } }
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
          rt_mister: [
            {
              when: { step: [0, 1] },
              do: [
                {
                  say: [
                    [
                      "rt_mister",
                      "[guarda verso la cabina con rispetto] Ragazzi... L'Eden è il posto dove siamo cresciuti tutti. Ines, se quella bobina mostra davvero il primo gol del '38, vorrà dire che domani giocheremo con undici anime in più."
                    ],
                    [
                      "rt_ines78",
                      "Lo so, Mister. La celluloide è fragile, ma il cuore di Dorino e dei ragazzi di allora era d'acciaio. Vado subito a dare una mano ad Aldo."
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
                      "rt_mister",
                      "[serio] Ragazzi... Domani portiamo quella Coppa a casa. Per noi e per chi c'era prima di noi."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          rt_dorino: [
            {
              when: { step: [2, 9] },
              do: [
                {
                  say: [
                    [
                      "rt_dorino",
                      "[in tenuta da gioco bianco e nero del '38, sorride come in un sogno nitido] Ciao, Ines. Ti ricordi di me? Ero poco più di un ragazzo quando abbiamo fondato il Club. Tu eri nella carrozzina di tua madre Rosa, e ridevi mentre calciavamo la palla."
                    ],
                    [
                      "rt_ines78",
                      "[commossa, si tocca il cuore] Dorino... Dorino Rondi! Allora è tutto vero! Quel gol... non è stata un'illusione!"
                    ],
                    [
                      "rt_dorino",
                      "[fiero] Nessun gol vero è mai un'illusione, finché qualcuno lo racconta. Fa' la tua scelta, Ines: noi saremo sempre lì a correre sulla fascia."
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
                      "rt_dorino",
                      "[sorride] Undici lire e una bugia. Bastano sempre per ricominciare."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          rt_aldo: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "rt_aldo",
                      "[asciuga le lenti con mano tremante] Ines, sei arrivata! La bobina del '38 è sul tavolo di montaggio lassù nella cabina. È incollata con colla vecchia e se non stiamo attenti si spezza nel proiettore!"
                    ],
                    [
                      "rt_ines78",
                      "Niente panico, Aldo. Ho restaurato decine di registri di bottega ingialliti. Entriamo subito!"
                    ]
                  ]
                },
                { step: 1 },
                {
                  quest: [
                    "rt_c5_cabina",
                    "La Cabina del Cinema Eden",
                    "Entra nella Cabina di Proiezione (in alto al centro) e parla con Aldo."
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
                      "rt_aldo",
                      "[indica la moviola] Eccola qui, Ines! La pellicola originale del 14 ottobre 1938. Avvicinati al tavolo (tessera T) e aiutami a rimettere insieme i fotogrammi prima di accendere la lampada ad arco!"
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
                      "rt_aldo",
                      "[ammirato, guarda il fascio di luce che proietta sullo schermo le immagini nitide del 1938] Incredibile... Si vede tutto! Il prato grezzo, Dorino col megafono, il tiro al volo del Forestiero... e tua madre Rosa che festeggia con la carrozzina!"
                    ],
                    [
                      "rt_ines78",
                      "[commossa] Mamma... guardala come sorride. È tutto vivo, Aldo."
                    ],
                    [
                      "rt_aldo",
                      "Ora dobbiamo decidere cosa fare di questo tesoro, Ines. Vuoi tenerlo nella vetrina del tuo bar come custode della piazza, o vuoi affidarlo al tempo perché arrivi fino ai ragazzi del centenario nel 2038?"
                    ]
                  ]
                },
                {
                  ask: {
                    who: "rt_ines78",
                    prompt: "Quale destino scegli per la bobina del primo gol?",
                    options: [
                      {
                        label: "La Bacheca dei Ricordi: custodisci la bobina nel Bar da Ines",
                        sub: "Radici e tradizione: la memoria resta viva dove la gente si incontra ogni giorno",
                        do: [{ call: "finale_bacheca" }]
                      },
                      {
                        label: "La Staffetta delle Tre Epoche: invia la bobina ai ragazzi del 2038",
                        sub: "Ponte temporale: un passaggio filtrante lungo sessant'anni verso il futuro",
                        do: [{ call: "finale_staffetta" }]
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
                      "rt_aldo",
                      "[felice] Il cinema è magia, Ines, ma il calcio e il tempo sono un miracolo vero."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "rt_i_cabina78:T": [
            {
              when: { step: 1 },
              do: [
                {
                  trial: {
                    title: "Il Montaggio della Pellicola del '38",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        prompt: "La pellicola in celluloide d'epoca è secca e rischia di spezzarsi nel proiettore: cosa usi?",
                        options: [
                          { label: "Inumidire i rulli con una goccia di glicerina e farlo scorrere a mano!", ok: true },
                          { label: "Tirare forte con entrambe le mani" },
                          { label: "Scaldare il nastro sul fornello a gas" }
                        ],
                        good: "Tocco da maestra: la celluloide ritrova elasticità e scorre dolce tra le dita!",
                        bad: "Strappo secco: un dente del rullo salta e devi giuntare di nuovo il nastro!"
                      },
                      {
                        prompt: "I fotogrammi del gol inaugurale del 1938 sono disordinati: come riconosci la volée del Forestiero?",
                        options: [
                          { label: "Cercare il fotogramma col pallone di cuoio a cuciture strette che gonfia la rete!", ok: true },
                          { label: "Prendere il pezzo più scuro" },
                          { label: "Incollare il nastro al contrario" }
                        ],
                        good: "Occhio infallibile: hai isolato il fotogramma storico del primo gol del Club!",
                        bad: "Fotogramma sbagliato: hai montato un replay rovesciato che disorienta lo spettatore!"
                      },
                      {
                        prompt: "La lampada ad arco della cabina sfarfalla minacciando di bruciare la bobina: intervento immediato?",
                        options: [
                          { label: "Regolare la distanza degli elettrodi di carbone per stabilizzare il fascio di luce!", ok: true },
                          { label: "Gettare acqua sulla lente rovente" },
                          { label: "Chiudere gli occhi e sperare" }
                        ],
                        good: "Regolazione magistrale: il fascio di luce bianca si fa terso e brillante come il sole!",
                        bad: "Fumo acre dalla lanterna: devi spegnere l'interruttore e attendere che si dissipi!"
                      },
                      {
                        prompt: "Ultimo stacco: sincronizzare l'audio della tromba di Dorino con l'esultanza della folla!",
                        options: [
                          { label: "Allineare la pista ottica sonora con il movimento del braccio del capitano!", ok: true },
                          { label: "Mandare avanti veloce a caso" },
                          { label: "Tagliare via l'audio con le forbici" }
                        ],
                        good: "Sincronia perfetta: lo squillo della tromba rimbomba in sala insieme al boato del gol!",
                        bad: "Fuori sincrono: il suono arriva in ritardo rispetto all'azione creando confusione!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "rt_aldo",
                            "[esulta commosso battendo i pugni sul tavolo] È fatta! È perfetta! Guarda lo schermo, Ines! Il 1938 è vivo davanti ai nostri occhi!"
                          ],
                          [
                            "rt_ines78",
                            "[trattiene il fiato guardando le immagini in bianco e nero] Che meraviglia... Ora parliamo di cosa farne, Aldo."
                          ]
                        ]
                      },
                      { flag: { rt_i_proiezione_vinta: true } },
                      { bond: ["club", 20] },
                      { step: 2 },
                      {
                        quest: [
                          "rt_c5_decisione",
                          "Il Destino della Pellicola",
                          "Parla con Aldo nella cabina di proiezione per decidere il futuro della bobina."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "rt_aldo",
                            "[asciuga il sudore] Abbiamo perso qualche fotogramma sui titoli di testa, Ines, ma il gol del Forestiero è salvo e risplende sullo schermo!"
                          ],
                          [
                            "rt_ines78",
                            "[annuisce con dolcezza] Basta e avanza, Aldo. Quel gol è scolpito per sempre. Decidiamo il suo destino."
                          ]
                        ]
                      },
                      { flag: { rt_i_proiezione_persa: true } },
                      { bond: ["club", 10] },
                      { step: 2 },
                      {
                        quest: [
                          "rt_c5_decisione",
                          "Il Destino della Pellicola",
                          "Parla con Aldo nella cabina di proiezione per decidere il futuro della bobina."
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
                      "rt_ines78",
                      "[pensa] La moviola ha finito il suo lavoro. Il nastro scorre ordinato sul rocchetto."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        blocks: {
          finale_bacheca: [
            {
              say: [
                [
                  "rt_ines78",
                  "[sorride con orgoglio asciugando una lacrima sotto gli occhiali] Questa pellicola resta qui, nel mio bar. La metterò nella vetrina di noce accanto alla coppa del '78. Chiunque berrà un caffè a Rondinara saprà che ogni gol di oggi viene da quel primo tiro del '38!"
                ],
                [
                  "rt_aldo",
                  "[commosso] Una scelta magnifica, Ines. Il bar è la vera casa di questa squadra."
                ],
                [
                  "rt_mister",
                  "[annuisce con voce roca dall'ingresso] Ben detto, Ines. Ora ragazzi: palla al centro e andiamo a vincere la finale!"
                ]
              ]
            },
            { end: "ines_bacheca_bar" },
            { unlock: ["rt_ines78", "rt_aldo"] },
            { finish: "ines_bacheca_bar" },
            { step: 9 },
            {
              reward: {
                key: "dossier_rt_c5_bacheca",
                give: { coins: 300, cos: ["rt_i_grembiule_78"] }
              }
            },
            {
              scene: [
                [
                  "rt_ines78",
                  "<b>FINALE I · LA BACHECA DEI RICORDI</b><br>Nel Bar da Ines la vetrina del 1978 custodisce per sempre la pellicola del primo gol e il gettone di bronzo. Per sessant'anni i tifosi sosteranno davanti a quel vetro prima di ogni partita, ritrovando il calore immutabile delle proprie radici!"
                ],
                "{reward}"
              ],
              openMain: true
            }
          ],
          finale_staffetta: [
            {
              say: [
                [
                  "rt_ines78",
                  "[decisa, ripone la bobina in una scatola di latta sigillata] Il passato non deve restare chiuso in un cassetto per diventare nostalgia. Questa bobina deve viaggiare: la affiderò al Pullman Rondine, perché nel 2038 Vera e Tilly possano mostrarla a tutto lo stadio del centenario!"
                ],
                [
                  "rt_aldo",
                  "[stupito ed entusiasta] Un passaggio filtrante lungo sessant'anni! Solo tu potevi pensarlo, Ines!"
                ],
                [
                  "rt_mister",
                  "[sorride e accende finalmente la sigaretta] Il tempo passa, ma il Rondinara corre sempre in avanti. Andiamo in campo, ragazzi!"
                ]
              ]
            },
            { end: "ines_staffetta_tempo" },
            { unlock: ["rt_ines78", "rt_aldo"] },
            { finish: "ines_staffetta_tempo" },
            { step: 9 },
            {
              reward: {
                key: "dossier_rt_c5_staffetta",
                give: { coins: 300, cos: ["rt_i_occhiali_78"] }
              }
            },
            {
              scene: [
                [
                  "rt_ines78",
                  "<b>FINALE II · LA STAFFETTA DELLE TRE EPOCHE</b><br>La bobina del 1938 attraversa il tempo sul Pullman Rondine e arriva intatta nel 2038, proiettata sui megaschermi al neon davanti a diecimila spettatori commossi. La memoria non sbiadisce: diventa futuro!"
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
