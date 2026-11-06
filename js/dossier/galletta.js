// js/dossier/galletta.js - DOSSIER INCOMPIUTI di «S.O.S. Galletta: I Bucanieri del Biscotto»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Capitan Sottaceto, il burbero corsaro delle aringhe salate e delle scogliere basse.
// Cap. 4 «La Rivolta delle Scogliere Salate» (il sabotaggio delle saline: barili di salamoia inquinati da sciroppo, scarpini viscidi e il dilemma del fornaio).
// Cap. 5 «La Battaglia della Crosta Salata» (il gran consiglio alla Rada dei Gabbiani: la disputa delle clausole marittime tra biscotto dolce e salagione).
// Minigiochi: «L'Ispezione delle Botti di Salamoia» (prova a tempo a scelte, cap. 4) e «La Disputa del Trattato Salmastro» (prova a tempo a scelte, cap. 5).
(function () {
  "use strict";

  const LOOK_SOTTACETO = {
    name: "Capitan Sottaceto",
    style: "buzz",
    hair: "#334155",
    beard: "incolta",
    eye: "#0f172a",
    skin: "#cbd5e1",
    acc: ["cappellino"]
  };

  const SOTTACETO_C4 = {
    name: "Capitan Sottaceto",
    num: 1,
    cast: Object.assign({ sub: "Corsaro delle Scogliere Basse", shirt: "#1e3a8a", bg: ["#1e3a8a", "#0284c7"] }, LOOK_SOTTACETO)
  };

  const SOTTACETO_C5 = {
    name: "Capitan Sottaceto",
    num: 1,
    cast: Object.assign({ sub: "Ammiraglio della Flotta Salata", shirt: "#0284c7", bg: ["#0284c7", "#fef3c7"] }, LOOK_SOTTACETO)
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
    gl_zenzero: {
      name: "Nostromo Zenzero",
      desc: "Mastro cannoniere e speziale delle scogliere salate. Macina radici piccanti e salgemma nei mortai di bordo: «Lo zucchero fiacca le gambe, lo zenzero fa volare gli scarpini sui contrasti!»",
      look: {
        style: "curly",
        hair: "#c2410c",
        beard: "baffi",
        eye: "#78350f",
        skin: "#d9a57a",
        shirt: "#b45309",
        bg: ["#c2410c", "#fef3c7"]
      }
    },
    gl_amalia: {
      name: "Amalia la Salatrice",
      desc: "La decana delle Saline della Secca. Custodisce le vasche d'evaporazione e le botti di salgemma vergine: «Il calcio vero si gioca scalzi sul sale bagnato, senza tante moine!»",
      look: {
        style: "braid",
        hair: "#64748b",
        eye: "#0f172a",
        skin: "#e2e8f0",
        shirt: "#334155",
        acc: ["bandana"],
        bg: ["#334155", "#cbd5e1"]
      }
    }
  };

  const ENDS = ["sottaceto_patto", "sottaceto_libero"];

  window.__dossierDati.add({
    saga: "galletta",
    after: 3,
    guest: {
      id: "gl_sottaceto",
      saga: "S.O.S. Galletta · Il Dossier di Sottaceto",
      ends: ENDS,
      lines: [
        [
          "gl_sottaceto",
          "[mastica un pezzo di aringa essiccata e scuote il capo] Per mille scogli aguzzi, {n}! Qui al Borgo il porto è pulito e i gabbiani sono fin troppo educati. Ma dimmi: dove sono i barili di acciughe e la salamoia per bagnare gli scarpini prima di scendere in campo? Troppo zucchero fa male alle caviglie!"
        ]
      ]
    },
    deck: {
      id: "gls",
      t: "Il Dossier di Sottaceto",
      e: "🧂",
      ends: ENDS,
      lock: "Trova un finale del Dossier di S.O.S. Galletta",
      d: "Un corsaro burbero con scarpini d'aceto, botti di salamoia e il calcio delle scogliere basse.",
      pg: {
        id: "gl_zenzero",
        n: "Nostromo Zenzero",
        i: "🫚",
        tr: "audacia",
        d: "Mastro cannoniere e speziale delle scogliere. Macina radici piccanti per dare sprint agli scarpini sui contrasti.",
        greet: "Una partita al largo di {a}? Guarda che se ti lascio scivolare finisci dritto in salamoia!",
        win: "Gol al volo di pura foga corsara! Lo zenzero batte sempre la vaniglia.",
        lose: "Ponte troppo viscido: siamo scivolati proprio mentre caricavo il tiro."
      },
      ev: {
        n: "La Botte di Salamoia Truccata",
        i: "🛢️",
        d: "Un barile cerchiato di ferro trovato tra gli scogli, dal profumo pungente e misterioso.",
        setup: [
          "Tra le secche delle scogliere basse trovi un barile cerchiato di ferro abbandonato dalla marea.",
          "Il tappo di cera emana un miscuglio aromatico di aceto, salgemma e vaniglia di corte. Che facciamo?"
        ],
        ch: [
          [
            "Stappa il barile con la sciabola",
            "audacia",
            "La foga corsara apre ogni mistero.",
            "La sciabola salta il sigillo: dentro ci sono quaranta libbre di sale purissimo e un sacchetto di monete corsare.",
            "Uno spruzzo di salamoia fermentata ti acceca per mezz'ora. Tiri a casaccio contro le onde."
          ],
          [
            "Ispeziona il marchio a fuoco",
            "furbizia",
            "Ogni cambusiere lascia la sua firma.",
            "Riconosci la sigla segreta della Flotta Salata: ricavi una scorciatoia tattica e guadagni venticinque monete.",
            "La salsedine ha cancellato le lettere: perdi tempo a decifrare scarabocchi di ruggine."
          ],
          [
            "Portalo ai marinai della banchina",
            "cuore",
            "La salagione condivisa unisce la ciurma.",
            "I marinai festeggiano distribuendo aringhe e fette di limone a tutti, regalandoti una corona di timo selvatico.",
            "I marinai dicono che la botte appartiene alla dogana reale e te la sequestrano all'istante."
          ]
        ]
      },
      tw: {
        n: "Scivolata in Salamoia",
        i: "🌊",
        d: "Tackle disperato sul ponte bagnato con spruzzi d'aceto e fango marino.",
        win: "Contrasto pulito e pallone sradicato all'avversario: il premio sale vertiginosamente.",
        lose: "L'arbitro giudica l'entrata troppo salata e assegna rigore contro: perdi parte del bottino.",
        mulWin: 1.35,
        mulLose: 0.85
      }
    },
    chapters: [
      {
        n: 4,
        title: "La Rivolta delle Scogliere Salate",
        sub: "Dossier Incompiuto: la protesta dei corsari delle secche, dal punto di vista di Capitan Sottaceto",
        avatar: SOTTACETO_C4,
        start: "gl_s_scogliere",
        introBg: "gl_porto",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · S.O.S. GALLETTA</b> Le Scogliere Basse, l'approdo dei pescatori di salamoia e delle ciurme indipendenti."
          ],
          [
            "gl_sottaceto",
            "[serio] (Mastica un pezzo d'aringa e strizza gli occhi verso il mare aperto.) Pasticcini, crostate, melassa dorata... Da quando Barbabiscotto ha vinto la coppa, su queste isole non si parla d'altro! Ma senza il sale delle mie scogliere, le gallette ammuffiscono e i marinai scivolano sul ponte come trote nel burro. E ora qualcuno ha manomesso le nostre vasche di salamoia! Chi tocca il mio sale si prende un calcio negli stinchi!"
          ]
        ],
        goal: {
          0: "Ispeziona il forziere cerchiato di ferro sulla banchina a est (in basso a destra).",
          1: "Entra nel Magazzino delle Salagioni (in alto a sinistra) e parla con Nostromo Zenzero.",
          2: "Ispeziona le botti di salamoia sul banco da lavoro (tessera T) ed esegui il controllo.",
          3: "Affronta mastro Cannella giunto alla banchina per chiarire il sabotaggio delle spezie."
        },
        goalDone: "Il Capitolo 4 è completato. Puoi proseguire con il Capitolo 5.",
        cast: { ...CAST },
        cos: {
          gl_s_bandana: {
            kind: "style",
            label: "Bandana Salata delle Scogliere",
            val: "bandana",
            from: "Dossier di S.O.S. Galletta · Capitolo 4"
          }
        },
        lore: {
          l_salamoia: {
            t: "La Salamoia delle Scogliere",
            d: "Acqua di mare filtrata, salgemma vergine e aceto di mele: l'elisir dei marinai delle secche che mantiene asciutti i cuoi degli scarpini anche durante le peggiori tempeste."
          }
        },
        zones: {
          gl_s_scogliere: {
            region: "porto",
            name: "Dossier Galletta · Scogliere Basse della Salina",
            short: "Scogliere Basse",
            sub: "Banchine di legno grezzo, vasche di salgemma e odore pungente d'aringhe",
            bg: "gl_porto",
            time: "giorno",
            travel: [6, 18],
            w: 32,
            h: 22,
            start: [6, 18],
            areas: [
              [2, 2, 12, 8, "Il Magazzino delle Salagioni"],
              [16, 2, 30, 10, "Le Vasche di Evaporazione"],
              [2, 12, 30, 20, "La Banchina delle Scogliere"],
              [0, 0, 31, 21, "Le Scogliere Basse"]
            ],
            act: {
              B: "Ispeziona la botte di salamoia",
              K: "Guarda il cannone delle secche",
              A: "Esamina l'ancora rugginosa",
              x: "Apri il forziere",
              n: "Leggi l'avviso delle saline",
              b: "Siediti sulla panca",
              p: "Guarda il palo d'ormeggio",
              s: "Riposa"
            },
            flavor: {
              B: "Un barile cerchiato di corda che trabocca di salamoia d'aringhe e aceto aromatico.",
              K: "Un cannone corto da banchina, caricato a sacchetti di sale grosso per scoraggiare i gabbiani ladri.",
              A: "Una solida ancora di ferro incrostata di sale bianco e alghe essiccate.",
              x: "Un forziere di legno rinforzato con staffe di ghisa e sigilli delle saline.",
              n: "Un manifesto sbiadito: «TUTTE LE SCORTE DI SALE REQUISITE PER LA GLASSATURA IMPERIALE». Firmato: Dogana Reale.",
              b: "Una panca di legno scuro impregnata di salmastro dove riposano i pescatori.",
              p: "Un massiccio palo d'ormeggio in quercia con le cime delle scialuppe attorcigliate."
            },
            intro: [
              [
                "voce",
                "Le Scogliere Basse della Salina: l'odore di aceto, salgemma e alghe spumeggianti schiaffeggia il viso. Qui i corsari non cantano filastrocche dolci: rammendano reti e preparano contrasti ruvidi."
              ]
            ],
            npcs: [
              { id: "gl_amalia", at: [10, 18], when: { step: [0, 1] } },
              { id: "gl_zenzero", at: [18, 14], when: { step: 0 } },
              { id: "gl_cannella", at: [22, 16], when: { step: [3, 9] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 1, 17, 30, 19, ":"],
              ["lay", 15, 6, 15, 17, ":"],
              ["lay", 4, 6, 27, 6, ":"],
              ["house", 3, 2, 8, 5, { door: [6, 7], roof: "#0284c7", wall: "#1e3a8a", rr: 1, enter: { to: "gl_s_magazzino", at: [7, 9] } }],
              ["lay", 17, 3, 29, 5, "a"],
              ["put", 16, 9, "A"],
              ["put", 27, 18, "K"],
              ["put", 12, 18, "K"],
              ["put", 28, 18, "x"],
              ["put", 14, 8, "n"],
              ["put", 14, 14, "B"],
              ["put", 24, 14, "B"],
              ["put", 18, 6, "B"],
              ["put", 26, 6, "B"],
              ["put", 12, 14, "b"],
              ["put", 20, 14, "b"],
              ["put", 5, 18, "s"],
              ["put", 8, 18, "p"],
              ["put", 15, 18, "p"],
              ["put", 23, 18, "p"]
            ],
            trees: [[2, 10], [30, 10], [15, 4], [28, 4]]
          },
          gl_s_magazzino: {
            interior: true,
            region: "porto",
            name: "Dossier Galletta · Magazzino delle Salagioni",
            short: "Magazzino Salagioni",
            sub: "Botti di salamoia, mortai di zenzero, bilance d'ottone e reti tese",
            bg: "gl_porto",
            w: 16,
            h: 12,
            start: [7, 9],
            outside: ["gl_s_scogliere", 6, 8],
            act: {
              T: "Esamina il banco di lavoro",
              B: "Ispeziona le botti",
              L: "Controlla le mensole",
              x: "Guarda la cassa di spezie",
              v: "Esci"
            },
            flavor: {
              T: "Un pesante tavolo di noce ricoperto di mortai, bilance di precisione, barattoli di salgemma e pergamene d'ispezione.",
              B: "Botti di rovere numerate contenenti diverse gradazioni di salamoia pura.",
              L: "Mensole ricolme di vasi con chiodi di garofano, scorze di limone essiccate e sacchetti di zenzero in polvere.",
              x: "Una cassa di spezie piccanti chiusa con lucchetto di bronzo."
            },
            intro: [
              [
                "voce",
                "Il Magazzino delle Salagioni: l'aria pizzica il naso di zenzero fresco e aceto balsamico. Sui tavoli si preparano le miscele che tengono in piedi la ciurma."
              ]
            ],
            npcs: [
              { id: "gl_zenzero", at: [8, 4], when: { step: [1, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 7),
              ["lay", 2, 2, 13, 2, "L"],
              ["put", 5, 4, "T"],
              ["put", 10, 4, "B"],
              ["put", 12, 4, "B"],
              ["put", 3, 7, "B"],
              ["put", 12, 7, "B"],
              ["put", 3, 4, "x"],
              ["put", 2, 9, "l"],
              ["put", 13, 9, "l"]
            ]
          }
        },
        talk: {
          gl_amalia: [
            {
              when: { step: [0, 1] },
              do: [
                {
                  say: [
                    [
                      "gl_amalia",
                      "[serio] Ben arrivato alle saline, Capitano Sottaceto! La dogana reale ha provato a requisire le conche d'evaporazione. Dicono che il nostro sale serve per fare il caramello salato della corte imperiale!"
                    ],
                    [
                      "gl_sottaceto",
                      "Che assurdità! Il sale serve alle aringhe, alla cambusa e alla grinta nei contrasti! Ho visto un forziere militare cerchiato laggiù a est: vado a controllare prima che lo carichino sulle scialuppe."
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
                      "gl_amalia",
                      "[felice] Continua a difendere le nostre saline, Capitano! Finché c'è sale nelle conche, le Scogliere Basse non si piegheranno a nessuno zuccherificio!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gl_zenzero: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "gl_zenzero",
                      "[pensa] Cerca quel forziere sulla banchina a est, Capitano. I marinai della Caracca hanno lasciato cadere documenti durante la fuga."
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
                      "gl_zenzero",
                      "[sorpreso] L'ordine di requisizione reale?! Quei burocrati di corte vogliono lasciarci senza sale per farci scivolare nelle prossime sfide marinare!"
                    ],
                    [
                      "gl_sottaceto",
                      "Esatto! Ma prima di muovere la flotta dobbiamo rimettere in sesto le botti di salamoia e verificare gli scarpini da gara."
                    ],
                    [
                      "gl_zenzero",
                      "Tutto pronto sul banco di lavoro, Capitano. Avvicinati al tavolo (tessera T) e iniziamo subito l'ispezione prima che le miscele perdano forza!"
                    ]
                  ]
                },
                { step: 2 },
                {
                  quest: [
                    "gl_c4_ispezione",
                    "L'Ispezione delle Botti",
                    "Esamina il tavolo di lavoro (T) nel Magazzino delle Salagioni ed esegui il controllo."
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
                      "gl_zenzero",
                      "[serio] Avvicinati al banco da lavoro (tessera T) e controlla le gradazioni di salamoia e gli scarpini prima della partenza!"
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
                      "gl_zenzero",
                      "[felice] Le botti sono pronte e lo zenzero è macinato fine. Siamo pronti a dare battaglia a chiunque pretenda di addolcirci!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gl_cannella: [
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    [
                      "gl_cannella",
                      "[affannato, agita un grembiule bianco] Calma, Capitano Sottaceto! Non sono qui per combattere. Anche noi fornai della Taverna della Briciola siamo allibiti: il Commodoro Cracker ha requisito tutto il sale con la scusa della corona, e ora anche le nostre pagnotte sono scipite!"
                    ],
                    [
                      "gl_sottaceto",
                      "E voi credete che io divida il sale delle mie scogliere coi signorini della pasticceria dolce?"
                    ],
                    [
                      "gl_cannella",
                      "Se uniamo le forze alla Rada dei Gabbiani, possiamo costringere il Commodoro a concedere il porto franco sia al grano che al sale! Che intenzioni hai, vecchio lupo salato?"
                    ]
                  ]
                },
                {
                  ask: {
                    who: "gl_sottaceto",
                    prompt: "Come rispondi alla proposta di mastro Cannella?",
                    options: [
                      {
                        label: "Accetta la tregua e offri mezza botte di sale a Cannella",
                        sub: "Diplomazia salata: alleanza tra fornai e pescatori contro il monopolio",
                        do: [
                          { flag: { gl_s_alleato_cannella: true } },
                          { bond: ["spezie", 20] },
                          {
                            say: [
                              [
                                "gl_sottaceto",
                                "[serio] E va bene, Cannella. Mezza botte di sale per la tua taverna in cambio di sacchi di farina forte per la nostra ciurma. Ma alla Rada dei Gabbiani detterò io le condizioni difensive!"
                              ],
                              [
                                "gl_cannella",
                                "[felice] Affare fatto, Capitano! Ci vediamo alla fonda della Caracca!"
                              ]
                            ]
                          },
                          { call: "concludi_capitolo_4" }
                        ]
                      },
                      {
                        label: "Rifiuta le ciambelle e pretendi la resa incondizionata",
                        sub: "Orgoglio corsaro: le scogliere non fanno sconti a nessuno zuccherificio",
                        do: [
                          { flag: { gl_s_indipendente: true } },
                          { bond: ["pirateria", 20] },
                          {
                            say: [
                              [
                                "gl_sottaceto",
                                "[fiero] Neanche per sogno! Il sale delle scogliere resta alle scogliere. Se volete condire le vostre gallette, venite a sfidarci sul campo di calcio galleggiante!"
                              ],
                              [
                                "gl_cannella",
                                "[sorpreso] Sei duro come una pietra di sale, Sottaceto. Ma rispetto il tuo coraggio: ci misureremo alla Rada!"
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
                      "gl_cannella",
                      "[sorpreso] Ci vediamo alla Rada dei Gabbiani, Sottaceto! Prepariamo le navi!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "gl_s_scogliere:x": [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "gl_sottaceto",
                      "[serio] (Infila la lama nel lucchetto del forziere ed estrae una pergamena arrotolata con nastro dorato.)"
                    ],
                    [
                      "gl_sottaceto",
                      "«Ordine di Requisizione Reale N° 84: tutto il sale dell'atollo è requisito per la preparazione del Caramello Salato della Regina. Chi oppone resistenza verrà squalificato per dieci giornate di campionato.»"
                    ],
                    [
                      "gl_sottaceto",
                      "[furbo] Per tutti i calamari affogati! Il Commodoro vuole lasciarci a secco per farci perdere la partita di rivincita! Zenzero deve vedere subito questo documento!"
                    ]
                  ]
                },
                { bond: ["pirateria", 10] },
                { bond: ["spezie", 10] },
                { flag: { gl_s_ordine_trovato: true } },
                { step: 1 },
                {
                  quest: [
                    "gl_c4_magazzino",
                    "Il Magazzino delle Salagioni",
                    "Entra nel Magazzino a nord-ovest e parla con Nostromo Zenzero."
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
                      "gl_sottaceto",
                      "[pensa] Il forziere è ormai vuoto: ci sono solo granelli di sale grosso sul fondo."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          "gl_s_magazzino:T": [
            {
              when: { step: 2 },
              do: [
                {
                  trial: {
                    title: "L'Ispezione delle Botti di Salamoia",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        prompt: "Un infiltrato ha versato melassa appiccicosa nella botte del sale delle riserve: cosa fai?",
                        options: [
                          { label: "Scolare subito e risciacquare con acqua di mare pura!", ok: true },
                          { label: "Mescolare con zucchero a velo" },
                          { label: "Aspettare che evapori al sole" }
                        ],
                        good: "Ottima mossa: l'acqua di mare lava via lo zucchero e salva il salgemma!",
                        bad: "Pessima idea: la melassa impasta il sale e rovina l'intera riserva!"
                      },
                      {
                        prompt: "La cambusa della ciurma ha bisogno di scorte ad alta energia per i contrasti: cosa prepari?",
                        options: [
                          { label: "Aringhe sotto sale con pepe garofanato e limone!", ok: true },
                          { label: "Bignè alla crema zuccherata" },
                          { label: "Marmellata di fichi e panna montata" }
                        ],
                        good: "Pasto da veri corsari: proteine salate, sprint immediato e fiato da lupi!",
                        bad: "Troppo dolce: la ciurma si appesantisce e collassa dopo tre scatti!"
                      },
                      {
                        prompt: "Il ponte del vascello è scivoloso per via del burro imperiale: come prepari gli scarpini?",
                        options: [
                          { label: "Cospargere la suola con salgemma grosso per creare attrito!", ok: true },
                          { label: "Spalmare miele millefiori sui tacchetti" },
                          { label: "Giocare scalzi sulle bucce di banana" }
                        ],
                        good: "Presa perfetta: i cristalli di sale mordono il legno e bloccano ogni scivolata!",
                        bad: "Si scivola ancora di più: i difensori finiscono dritti fuoribordo!"
                      },
                      {
                        prompt: "Il pallone da calcio galleggiante è troppo leggero e sbanda nel vento: come lo zavorri?",
                        options: [
                          { label: "Camera d'aria inumidita in salamoia concentrata!", ok: true },
                          { label: "Riempirlo di schiuma di vaniglia" },
                          { label: "Gonfiarlo con elio caldo" }
                        ],
                        good: "Balistica impeccabile: la sfera tiene la traiettoria tesa anche col maestrale!",
                        bad: "Il pallone vola via sopra le nuvole e si perde nell'oceano!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "gl_zenzero",
                            "[esulta agitando il mortaio] Centro perfetto, Capitano! Le quattro botti sono purificate e gli scarpini mordono il ponte come chele d'aragosta!"
                          ],
                          [
                            "gl_sottaceto",
                            "[ride] Te l'avevo detto! Il sale vince sempre sullo zucchero filato! Ora andiamo alla banchina: mastro Cannella è appena sbarcato con una bandiera bianca."
                          ]
                        ]
                      },
                      { flag: { gl_s_salina_vinta: true } },
                      { bond: ["pirateria", 15] },
                      { bond: ["spezie", 15] },
                      { step: 3 },
                      {
                        quest: [
                          "gl_c4_cannella",
                          "La Tregua della Banchina",
                          "Esci dal magazzino e affronta mastro Cannella sulla banchina a est."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "gl_zenzero",
                            "[tossisce tra una nuvola di farina e fumo] Abbiamo perso due botti nella fretta, Capitano! Ma la salamoia rimanente basterà a equipaggiare la squadra."
                          ],
                          [
                            "gl_sottaceto",
                            "[serio] Poco male, stringeremo i denti. Nessun corsaro delle secche si è mai arreso per un po' di sale rovesciato. Vediamo cosa vuole Cannella al molo."
                          ]
                        ]
                      },
                      { flag: { gl_s_salina_persa: true } },
                      { bond: ["pirateria", 5] },
                      { step: 3 },
                      {
                        quest: [
                          "gl_c4_cannella",
                          "La Tregua della Banchina",
                          "Esci dal magazzino e affronta mastro Cannella sulla banchina a est."
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
                      "gl_sottaceto",
                      "[pensa] Il banco da lavoro è in ordine. Le bilance e i mortai sono pronti per la prossima miscela."
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
                key: "dossier_gl_c4",
                give: { coins: 180, cos: ["gl_s_bandana"] }
              }
            },
            { finish: "c4_ok" },
            { step: 9 },
            {
              scene: [
                [
                  "gl_sottaceto",
                  "<b>DOSSIER S.O.S. GALLETTA · CAPITOLO 4 CONCLUSO</b><br>Le saline sono salve e la ciurma ha risuolato gli scarpini col salgemma delle secche. La flotta salata scioglie gli ormeggi verso la Rada dei Gabbiani per la resa dei conti finale con la Caracca Reale!"
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
        title: "La Battaglia della Crosta Salata",
        sub: "Dossier Incompiuto: il gran consiglio alla Rada dei Gabbiani e i due destini dell'arcipelago",
        avatar: SOTTACETO_C5,
        start: "gl_s_rada",
        introBg: "gl_caracca",
        intro: [
          [
            "voce",
            "<b>DOSSIER INCOMPIUTO · S.O.S. GALLETTA</b> La Rada dei Gabbiani Sottaceto. Il galeone ammiraglio e la Caracca Reale si fronteggiano all'ancora."
          ],
          [
            "gl_sottaceto",
            "[serio] (Guarda le vele spiegate e le passerelle di legno tra i vascelli.) I migliori capitani dell'Oceano della Melassa sono tutti qui. Da una parte Barbabiscotto e la ciurma dei dolciumi; dall'altra il Commodoro Cracker con le sue parrucche zuccherate. È l'ora di stabilire una volta per tutte chi comanda sulle rotte e come si gioca a calcio su questo mare!"
          ]
        ],
        goal: {
          0: "Parla con Capitan Barbabiscotto sulla passerella della rada (in basso a sinistra).",
          1: "Entra nella Cabina dell'Ammiraglio (in alto al centro) per il Gran Consiglio.",
          2: "Ispeziona il tavolo delle trattative (tessera T) ed esegui la prova marittima delle clausole.",
          3: "Parla con il Commodoro Cracker al banco e decidi il destino finale dell'arcipelago."
        },
        goalDone: "Il Dossier di S.O.S. Galletta è concluso con successo. Hai scritto la storia dei sette mari!",
        cast: { ...CAST },
        cos: {
          gl_s_casacca_ammiraglio: {
            kind: "shirt",
            label: "Giamberga Salmastra d'Ammiraglio",
            val: "#0284c7",
            from: "Dossier di S.O.S. Galletta · Capitolo 5"
          },
          gl_s_tricorno_salato: {
            kind: "style",
            label: "Tricorno Corsaro con Conchiglia",
            val: "tricorno",
            from: "Dossier di S.O.S. Galletta · Capitolo 5"
          }
        },
        lore: {
          l_crosta_salata: {
            t: "La Crosta Salata dei Bucanieri",
            d: "La tecnica calcistica leggendaria nata sulle scogliere: scivolate lunghe dieci metri sull'acqua salata e tiri a giro imparabili che ingannano il rollio del veliero."
          }
        },
        endings: {
          sottaceto_patto: [
            "LA TREGUA DEL CARAMELLO SALATO",
            "Accetti l'alleanza con Barbabiscotto e Cannella: nasce la leggendaria ricetta del caramello salato, fondendo la dolcezza dei bucanieri e la tempra dei pescatori. Diventi il Gran Capitano della Difesa Unificata dell'Oceano.",
            "Scegli la via della concordia al tavolo del Gran Consiglio nel Capitolo 5."
          ],
          sottaceto_libero: [
            "I CORSARI DELLA SALAMOIA PURA",
            "Respingi ogni intesa con i burocrati di corte e i pasticcieri: fondi la Lega Libera delle Scogliere Basse, dove si gioca a calcio solo su banchine bagnate di sale, senza glassa né padroni.",
            "Scegli la via dell'indipendenza salata al tavolo del Gran Consiglio nel Capitolo 5."
          ]
        },
        zones: {
          gl_s_rada: {
            region: "galeone",
            name: "Dossier Galletta · Rada dei Gabbiani Sottaceto",
            short: "Rada dei Gabbiani",
            sub: "Passerelle oscillanti, cannoni cerimoniali e stendardi spiegati al vento",
            bg: "gl_caracca",
            time: "giorno",
            travel: [15, 19],
            w: 32,
            h: 22,
            start: [15, 19],
            areas: [
              [11, 2, 21, 8, "La Cabina dell'Ammiraglio"],
              [2, 10, 30, 20, "Il Ponte della Rada"],
              [0, 0, 31, 21, "La Rada dei Gabbiani"]
            ],
            act: {
              B: "Ispeziona il barile d'alpeggio",
              K: "Guarda il cannone di bronzo",
              P: "Esamina la passerella d'arrembaggio",
              A: "Guarda la ruota del timone",
              b: "Panca di poppa",
              p: "Bitta d'ormeggio",
              s: "Riposa"
            },
            flavor: {
              B: "Un barile cerchiato di bronzo con burro salato e pece per le manovre di coperta.",
              K: "Un monumentale cannone da trentadue libbre, tirato a lucido per le cerimonie d'onore.",
              P: "Una passerella basculante in rovere massiccio che collega il Masticatore alla Caracca Reale.",
              A: "Il grande timone di noce dorato con scolpita l'ancora delle Scogliere Basse.",
              b: "Panca da marinaio piallata dal vento e dal rollio dell'oceano.",
              p: "Una bitta d'acciaio attorno a cui è avvolta una gomena da tre pollici."
            },
            intro: [
              [
                "voce",
                "La Rada dei Gabbiani: una calma tesa avvolge i vascelli ormeggiati spalla a spalla. Le ciurme osservano in silenzio la cabina del consiglio supremo."
              ]
            ],
            npcs: [
              { id: "gl_barbabiscotto", at: [10, 18], when: { step: 0 } },
              { id: "gl_calipso", at: [20, 18], when: { step: [0, 1] } },
              { id: "gl_zenzero", at: [25, 18], when: { step: [0, 2] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 2, 16, 29, 20, "+"],
              ["lay", 14, 6, 17, 16, ":"],
              ["lay", 4, 6, 27, 6, ":"],
              ["house", 11, 2, 9, 5, { door: [15, 6], roof: "#1e3a8a", wall: "#0f172a", rr: 1, enter: { to: "gl_s_cabina", at: [8, 10] } }],
              ["put", 4, 11, "K"],
              ["put", 9, 11, "K"],
              ["put", 22, 11, "K"],
              ["put", 27, 11, "K"],
              ["put", 15, 11, "P"],
              ["put", 15, 14, "P"],
              ["put", 6, 17, "B"],
              ["put", 25, 17, "B"],
              ["put", 8, 13, "B"],
              ["put", 23, 13, "B"],
              ["put", 16, 8, "A"],
              ["put", 5, 19, "s"],
              ["put", 12, 19, "p"],
              ["put", 18, 19, "p"]
            ],
            trees: [[2, 5], [29, 5], [2, 16], [29, 16]]
          },
          gl_s_cabina: {
            interior: true,
            region: "galeone",
            name: "Dossier Galletta · Cabina dell'Ammiraglio",
            short: "Cabina Ammiraglio",
            sub: "Drappi di velluto blu, carte nautiche dorate e fumo di pipa aromatica",
            bg: "gl_caracca",
            w: 16,
            h: 12,
            start: [8, 10],
            outside: ["gl_s_rada", 15, 7],
            act: {
              T: "Esamina il tavolo delle trattative",
              B: "Ispeziona le scorte",
              L: "Guarda le carte nautiche",
              x: "Guarda il forziere imperiale",
              v: "Esci"
            },
            flavor: {
              T: "Un sontuoso tavolo di mogano intarsiato con pergamene marittime, sigilli in ceralacca e una scacchiera di tattiche navali.",
              B: "Barili di rovere decorati con i gigli della Flotta dei Buongustai.",
              L: "Scaffali dorati colmi di trattati di navigazione e regolamenti sportivi imperiali.",
              x: "Un forziere di noce e ottone con le coppe delle passate edizioni dell'Arrembaggio."
            },
            intro: [
              [
                "voce",
                "La Cabina dell'Ammiraglio: travi di quercia dorata e il silenzio solenne dei grandi trattati. Qui si decide il futuro dell'Oceano della Melassa."
              ]
            ],
            npcs: [
              { id: "gl_commodoro", at: [8, 3], when: { step: [1, 9] } }
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
          gl_barbabiscotto: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    [
                      "gl_barbabiscotto",
                      "[accarezza la barba con briciole di zucchero] Sottaceto! Benvenuto alla Rada dei Gabbiani! Il Commodoro Cracker è nella Cabina Ammiraglia lassù. Vuole sentire le tue condizioni prima di firmare il trattato marittimo!"
                    ],
                    [
                      "gl_sottaceto",
                      "Digli di preparare bene le orecchie. Le mie condizioni non saranno morbide come i suoi pan di spagna."
                    ]
                  ]
                },
                { step: 1 },
                {
                  quest: [
                    "gl_c5_cabina",
                    "La Cabina dell'Ammiraglio",
                    "Entra nella Cabina dell'Ammiraglio (in alto al centro) per il Gran Consiglio."
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
                      "gl_barbabiscotto",
                      "[felice] Il consiglio è riunito: fai valere le ragioni dei marinai dell'arcipelago!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gl_calipso: [
            {
              when: { step: [0, 1] },
              do: [
                {
                  say: [
                    [
                      "gl_calipso",
                      "[controlla la fiala di caramello] I flutti sono limpidi, Sottaceto. L'oceano aspetta la tua decisione: diplomazia o indipendenza? Il timone è nelle tue mani."
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
                      "gl_calipso",
                      "[sorride] Buon vento, Ammiraglio! Che il mare ti sia sempre propizio."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gl_zenzero: [
            {
              when: { step: [0, 2] },
              do: [
                {
                  say: [
                    [
                      "gl_zenzero",
                      "[agita la bandiera salata] Siamo tutti con te, Capitano! Mostra a quei nobili di che pasta sono fatte le Scogliere Basse!"
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
                      "gl_zenzero",
                      "[felice] Festeggiamo con una razione doppia di aringhe e sidro frizzante!"
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ],
          gl_commodoro: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    [
                      "gl_commodoro",
                      "[in divisa impeccabile e parrucca candida] Capitano Sottaceto! Prima di discutere il futuro dell'arcipelago, dovete superare la prova marittima al tavolo del consiglio (tessera T). Voglio vedere se conoscete le leggi della navigazione e la balistica navale!"
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
                      "gl_commodoro",
                      "[solenne] Siamo giunti al bivio supremo, Capitano Sottaceto. Barbabiscotto e Cannella sono pronti a firmare un trattato storico. Possiamo fondere l'arte pasticciera con la sapidità delle vostre scogliere, creando la ricetta del Caramello Salato e nominandovi Ammiraglio Supremo della Difesa Unificata... Oppure potete proclamare la totale indipendenza delle Scogliere Basse, escludendo ogni corte e ogni forno dalla vostra lega."
                    ],
                    [
                      "gl_sottaceto",
                      "[serio] È arrivato il momento della scelta."
                    ]
                  ]
                },
                {
                  ask: {
                    who: "gl_sottaceto",
                    prompt: "Quale destino scegli per te e per l'Oceano della Melassa?",
                    options: [
                      {
                        label: "Firma il Trattato: Alleanza del Caramello Salato e Difesa Unificata",
                        sub: "Concordia dei mari: l'unione tra bucanieri e scogliere per la vittoria suprema",
                        do: [{ call: "finale_patto" }]
                      },
                      {
                        label: "Rifiuta la Corte: Indipendenza Assoluta e Lega della Salamoia",
                        sub: "Libertà corsara: le Scogliere Basse restano pure, ruvide e senza padroni",
                        do: [{ call: "finale_libero" }]
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
                      "gl_commodoro",
                      "[solenne] Il destino dell'Oceano della Melassa è ormai scolpito nella storia."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        obj: {
          "gl_s_cabina:T": [
            {
              when: { step: 1 },
              do: [
                {
                  trial: {
                    title: "La Disputa del Trattato Salmastro",
                    secs: 8,
                    need: 3,
                    rounds: [
                      {
                        prompt: "Il Commodoro Cracker esige una tassa imperiale del 60% su ogni sacco di sale per la pasticceria di corte: come rispondi?",
                        options: [
                          { label: "Sventolare la Carta delle Acque Franche e rivendicare il porto franco!", ok: true },
                          { label: "Accettare e pagare in barrette di cioccolato" },
                          { label: "Affondare il proprio veliero per protesta" }
                        ],
                        good: "Clausola respinta: le Acque Franche tutelano le saline da qualunque dazio reale!",
                        bad: "Accordo capestro: la flotta salata finirebbe in bancarotta entro tre lune!"
                      },
                      {
                        prompt: "I Granatieri Reali usano scudi unti di lardo per respingere le ali bucaniere: contromossa?",
                        options: [
                          { label: "Lanciare zenzero polverizzato e tirare parabole a effetto sul palo lontano!", ok: true },
                          { label: "Spalmare marmellata sui guanti del portiere" },
                          { label: "Tirare dritti a occhi chiusi sperando nella sorte" }
                        ],
                        good: "Tattica magistrale: lo zenzero annebbia la vista dei granatieri e la parabola gonfia la rete!",
                        bad: "Contrasto fallito: gli scudi respingono il pallone e subiamo il contropiede!"
                      },
                      {
                        prompt: "Il ponte ondeggia con maestrale improvviso a venticinque nodi: come imposti la manovra offensiva?",
                        options: [
                          { label: "Tiro teso rasoterra di collo pieno sfruttando l'inclinazione della tolda!", ok: true },
                          { label: "Pallonetto altissimo controvento" },
                          { label: "Passaggio all'indietro verso il guardalinee" }
                        ],
                        good: "Geometria marina perfetta: il pallone schizza rasoterra tra le gambe dei difensori!",
                        bad: "La raffica di vento rispedisce la palla nella nostra porta: autogol beffardo!"
                      },
                      {
                        prompt: "Ultimo minuto di recupero: la difesa delle scogliere trema sotto i cross dei veloci attaccanti della Biscottiera!",
                        options: [
                          { label: "Uscita a valanga del portiere coi pugni e rinvio lungo verso la boa d'attacco!", ok: true },
                          { label: "Fermarsi a mangiare una galletta zuccherata" },
                          { label: "Chiedere la sostituzione al terzo arbitro" }
                        ],
                        good: "Parata miracolosa: palla spazzata oltre la linea di metà campo e vittoria sigillata!",
                        bad: "Esitazione fatale: l'attaccante bucaniere insacca di testa all'incrocio!"
                      }
                    ],
                    win: [
                      {
                        say: [
                          [
                            "gl_commodoro",
                            "[sorpreso e ammirato] Per la barba incipriata di Sua Maestà! Devo ammettere che la vostra visione tattica e la vostra padronanza dei venti sono ineccepibili, Sottaceto."
                          ],
                          [
                            "gl_sottaceto",
                            "[ride con una smorfia d'orgoglio] Ve l'avevo detto: chi mastica sale e aringhe sa come gira il mondo e dove rotola il pallone!"
                          ]
                        ]
                      },
                      { flag: { gl_s_disputa_vinta: true } },
                      { bond: ["pirateria", 20] },
                      { bond: ["spezie", 20] },
                      { step: 2 },
                      {
                        quest: [
                          "gl_c5_decisione",
                          "Il Destino dell'Arcipelago",
                          "Parla con il Commodoro Cracker per stipulare il verdetto finale."
                        ]
                      },
                      { done: true }
                    ],
                    lose: [
                      {
                        say: [
                          [
                            "gl_commodoro",
                            "[scuote il capo] Avete faticato su qualche clausola balistica, Sottaceto, ma la vostra determinazione nel difendere i diritti del mare è innegabile."
                          ],
                          [
                            "gl_sottaceto",
                            "[serio] Le parole di corte non fanno per me, Commodoro. Ma sul campo di calcio e sulle onde nessuno può toglierci la parola!"
                          ]
                        ]
                      },
                      { flag: { gl_s_disputa_persa: true } },
                      { bond: ["pirateria", 10] },
                      { step: 2 },
                      {
                        quest: [
                          "gl_c5_decisione",
                          "Il Destino dell'Arcipelago",
                          "Parla con il Commodoro Cracker per stipulare il verdetto finale."
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
                      "gl_sottaceto",
                      "[pensa] I documenti del consiglio sono firmati. Le mappe nautiche testimoniano la rotta tracciata."
                    ]
                  ]
                },
                { done: true }
              ]
            }
          ]
        },
        blocks: {
          finale_patto: [
            {
              say: [
                [
                  "gl_commodoro",
                  "[solenne] In nome della Flotta Reale e dei Bucanieri della Biscottiera, firmo la Carta del Caramello Salato! Da oggi nessun dazio graverà sul sale e le nostre navi solcheranno insieme i mari!"
                ],
                [
                  "gl_barbabiscotto",
                  "[esulta battendo la mano sulla spalla di Sottaceto] Sottaceto, vecchio lupo salato! Con te al comando della difesa e noi all'attacco, nessuna flotta al mondo potrà mai batterci a pallone!"
                ],
                [
                  "gl_sottaceto",
                  "[sorride sornione sistemandosi il tricorno d'ammiraglio] E va bene... Ma sia chiaro: prima della partita tutti mangiano aringhe e niente zucchero prima del fischio d'inizio!"
                ]
              ]
            },
            { end: "sottaceto_patto" },
            { unlock: ["gl_sottaceto", "gl_zenzero"] },
            { finish: "sottaceto_patto" },
            { step: 9 },
            {
              reward: {
                key: "dossier_gl_c5_patto",
                give: { coins: 300, cos: ["gl_s_casacca_ammiraglio"] }
              }
            },
            {
              scene: [
                [
                  "gl_sottaceto",
                  "<b>FINALE I · LA TREGUA DEL CARAMELLO SALATO</b><br>La leggenda del Caramello Salato unisce l'Oceano della Melassa. Capitan Sottaceto guida la linea difensiva unificata con scarpini bagnati d'aceto e tenacia di ferro, conquistando il rispetto dell'arcipelago intero!"
                ],
                "{reward}"
              ],
              openMain: true
            }
          ],
          finale_libero: [
            {
              say: [
                [
                  "gl_sottaceto",
                  "[fiero, getta la penna d'oca e incrocia le braccia] Niente contratti reali, niente zucchero nei nostri cannoni! Le Scogliere Basse appartengono a chi pesca le aringhe e calcia scalzo sulla roccia! Proclamo la Lega Libera della Salamoia!"
                ],
                [
                  "gl_commodoro",
                  "[sospira rispettoso] Una scelta dura come la scogliera, Sottaceto. Ma il mare aperto riconosce il vostro coraggio: non ci saranno interferenze nelle vostre acque."
                ],
                [
                  "gl_zenzero",
                  "[alza il boccale di sidro salato] Viva la Flotta Salata! Viva il calcio delle secche senza padroni!"
                ]
              ]
            },
            { end: "sottaceto_libero" },
            { unlock: ["gl_sottaceto", "gl_zenzero"] },
            { finish: "sottaceto_libero" },
            { step: 9 },
            {
              reward: {
                key: "dossier_gl_c5_libero",
                give: { coins: 300, cos: ["gl_s_tricorno_salato"] }
              }
            },
            {
              scene: [
                [
                  "gl_sottaceto",
                  "<b>FINALE II · I CORSARI DELLA SALAMOIA PURA</b><br>Sottaceto respinge ogni lusinga e fonda la Repubblica Marinara delle Scogliere Basse. Sulle banchine salate il pallone rotola libero, ruvido e incorruttibile, mentre la leggenda del corsaro d'aceto si tramanda di generazione in generazione!"
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
