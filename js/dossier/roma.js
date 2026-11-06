// js/dossier/roma.js - DOSSIER INCOMPIUTI di «Ave Calcio! · I Gladiatori del Pallone»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Centurione Gannico, l'arbitro imperiale con il corno di bronzo.
// Cap. 4 «Il Corno Spezzato della Suburra» (la notte dopo la lizza: cera nel boccaglio, sandali truccati e scommesse clandestine).
// Cap. 5 «L'Editto dei Sesterzi d'Oro» (l'alba al Colosseo prima della finale imperiale: il bivio tra la borsa del Senato e la legge della sabbia).
// Minigiochi: «L'Ispezione dei Sandali e del Pallone» (prova a tempo a scelte, cap. 4) e «La Disputa dell'Editto» (prova a tempo a scelte, cap. 5).
(function () {
  "use strict";

  const LOOK_GANNICO = { name: "Centurione Gannico", style: "short", hair: "#451a03", eye: "#2a1a1a", skin: "#e0ac7e", acc: ["casco"] };
  const GANNICO_C4 = { name: "Centurione Gannico", num: 1, cast: Object.assign({ sub: "Arbitro imperiale della Suburra", shirt: "#78350f" }, LOOK_GANNICO) };
  const GANNICO_C5 = { name: "Centurione Gannico", num: 1, cast: Object.assign({ sub: "Giudice della Lizza al Colosseo", shirt: "#b91c1c" }, LOOK_GANNICO) };

  const BORDER = (w, h, c) => [["lay", 0, 0, w - 1, 0, c || "a"], ["lay", 0, h - 1, w - 1, h - 1, c || "a"], ["lay", 0, 0, 0, h - 1, c || "a"], ["lay", w - 1, 0, w - 1, h - 1, c || "a"]];
  const ROOM = (w, h, exitX) => [["lay", 0, 0, w - 1, h - 1, "+"], ...BORDER(w, h), ["put", exitX, h - 1, "v"]];

  const CAST = {
    rm_tullio: {
      name: "Tullio il Calzolaio",
      desc: "Il ciabattino più abile dell'Aventino: risuola sandali da lizza con strisce di cuoio di bue e pece greca. Riconosce una simulazione dall'angolo di consumo del tacco.",
      look: { style: "buzz", hair: "#78350f", beard: "baffi", eye: "#1a1a1a", skin: "#d9a679", shirt: "#92400e", bg: ["#451a03", "#fed7aa"] }
    },
    rm_corvo: {
      name: "Corvo lo Scommettitore",
      desc: "Ex marinaio di Ostia diventato allibratore clandestino nei vicoli della Suburra. Ha una tavoletta di cera per ogni centravanti dell'Urbe e non sbaglia mai una quota.",
      look: { style: "slick", hair: "#1c1917", eye: "#78350f", skin: "#e8c9a0", shirt: "#451a03", bg: ["#1c1917", "#fef3c7"] }
    }
  };

  const ENDS = ["gannico_plebe", "gannico_imperiale"];

  window.__dossierDati.add({
    saga: "roma",
    after: 3,
    guest: {
      id: "rm_gannico",
      saga: "Ave Calcio! · Il Dossier di Gannico",
      ends: ENDS,
      lines: [
        ["rm_gannico", "[soffia una nota roboante nel corno] Borgo Marino! Per Giove, niente bighe sui piedi e niente cariche con gomiti alti! Qui si gioca con disciplina o fischio dieci sesterzi di ammenda a tutto il molo!"]
      ]
    },
    deck: {
      id: "rmg",
      t: "Il Dossier di Gannico",
      e: "📯",
      ends: ENDS,
      lock: "Trova un finale del Dossier di Ave Calcio",
      d: "Un centurione arbitro incorruttibile, un corno di bronzo intasato e le leggi del pallone romano.",
      pg: {
        id: "rm_tullio",
        n: "Tullio il Calzolaio",
        i: "👡",
        tr: "furbizia",
        d: "Risuola sandali chiodati per i gladiatori della Suburra. Sa riconoscere una simulazione dall'angolo del tacco.",
        greet: "Un match a {a}? Guarda che se scivoli sul fango ti cambio i chiodi al volo!",
        win: "Gol con punta di cuoio di bue! Te l'avevo detto che la suola tiene.",
        lose: "Peccato. Mi sa che il cuoio era troppo morbido: te lo risuolo per domani."
      },
      ev: {
        n: "Il Corno Otturato di Pece",
        i: "📯",
        d: "Un corno imperiale da segnalazione trovato dietro la taverna, con la campana piena di cera.",
        setup: [
          "Dietro l'Osteria del Falerno trovi un corno da arbitro. La campana è sigillata con cera e pece.",
          "Qualcuno non voleva che si fischiasse il fuorigioco alla finale. Che facciamo?"
        ],
        ch: [
          [
            "Scalda la cera sul braciere",
            "audacia",
            "La fiamma scioglie ogni imbroglio.",
            "La cera cola nel braciere e il corno torna a squillare con un boato che fa tremare le anfore. Trovi dentro una moneta d'oro nascosta.",
            "La cera prende fuoco e annerisce il bronzo. Ne esce solo una zaffata di fumo acre."
          ],
          [
            "Ispeziona il boccaglio",
            "furbizia",
            "C'è sempre una matricola incisa.",
            "Trovi la sigla del Senatore Furbio incisa sull'ottone. Una prova schiacciante che ti vale venti sesterzi di ricompensa.",
            "La pece ti incolla le dita. Passi mezz'ora a pulirti col vino caldo."
          ],
          [
            "Portalo ai giudici della lizza",
            "cuore",
            "La legge è legge anche nella polvere.",
            "I magistrati ti ringraziano solennemente e ti regalano una corona d'alloro per la lodevole onestà.",
            "I giudici dicono che è un vecchio corno da caccia e lo buttano nel Tevere."
          ]
        ]
      },
      tw: {
        n: "Fallo Tattico Imperiale",
        i: "🚩",
        d: "Spallata su sabbia con segnalazione del giudice.",
        win: "Fallo fischiato in tuo favore: il premio sale.",
        lose: "Ammonizione per proteste verso l'arbitro: perdi una fetta del premio.",
        mulWin: 1.3,
        mulLose: 0.85
      }
    },
    chapters: [
      {
        n: 4,
        title: "Il Corno Spezzato della Suburra",
        sub: "Dossier Incompiuto: la notte dopo la lizza, dal punto di vista del Centurione Gannico",
        avatar: GANNICO_C4,
        start: "rm_g_suburra",
        introBg: "rm_suburra",
        intro: [
          ["voce", "<b>DOSSIER INCOMPIUTO · AVE CALCIO!</b> La Suburra, la notte dopo il torneo di qualificazione."],
          ["rm_gannico", "[serio] (Stringe il corno d'ottone.) Quindici anni nella legione e otto sui campi di sabbia. Ho visto gladiatori fermarsi al fischio e leoni rispettare la linea del fallo laterale. Ma stanotte qualcuno ha versato pece nella campana del mio corno. Se l'arbitro non può fischiare, a Roma comanda il caos."]
        ],
        goal: {
          0: "Controlla il forziere delle pergamene davanti all'Osteria (in basso a destra).",
          1: "Porta i reperti a Tullio il Calzolaio nella Bottega (in basso a sinistra).",
          2: "Ispeziona i sandali e il pallone sul banco da lavoro di Tullio.",
          3: "Affronta il Senatore Furbio nei vicoli della Suburra prima dell'alba."
        },
        goalDone: "Il Dossier continua: puoi aprire il Capitolo 5.",
        cast: { ...CAST },
        cos: {
          rm_g_tunica: {
            kind: "shirt",
            label: "Tunica del Giudice di Lizza",
            val: "#78350f",
            from: "Dossier di Ave Calcio · Capitolo 4"
          }
        },
        lore: {
          l_regolamento: {
            t: "Il Codice delle Dodici Lame",
            d: "Nell'Urbe del 75 d.C. le regole del pallone erano scolpite su tavole di bronzo: fuorigioco segnalato col corno, divieto di sabbia negli occhi e tre sesterzi di multa per chi trattiene la tunica avversaria."
          }
        },
        zones: {
          rm_g_suburra: {
            region: "suburra",
            name: "Dossier Roma · Vicoli Notturni della Suburra",
            short: "Suburra di Notte",
            sub: "Torce tremolanti, anfore rovesciate e odore di mosto e pece",
            bg: "rm_suburra",
            time: "notte",
            travel: [15, 19],
            w: 32,
            h: 22,
            start: [15, 19],
            areas: [
              [1, 12, 10, 18, "La Bottega di Tullio"],
              [20, 12, 30, 20, "L'Osteria del Falerno"],
              [12, 1, 20, 8, "L'Arco dei Trionfi"],
              [0, 0, 31, 21, "I Vicoli della Suburra"]
            ],
            act: {
              p: "Guarda la colonna",
              B: "Scaldati al braciere",
              S: "Ammira la statua",
              A: "Ispeziona l'anfora",
              E: "Esamina lo scudo",
              b: "Guarda la panca",
              n: "Leggi l'editto",
              x: "Apri il forziere",
              T: "Guarda il banco"
            },
            flavor: {
              p: "Una colonna scanalata in travertino. Qualcuno ha inciso con un chiodo: «Spartaco segna, Furbio paga».",
              B: "Un braciere di bronzo con brace ardente. Riscalda le mani gelide della ronda notturna.",
              S: "Statua di Mercurio con il pallone di cuoio tra i piedi alati. Il naso è scheggiato da una pallonata antica.",
              A: "Anfore vinarie accatastate. Una è ancora gocciolante di vino rosso scuro.",
              E: "Scudo da parata con l'aquila romana. Lucido come uno specchio, senza graffi: appartiene a chi non gioca mai.",
              b: "Panca di pietra liscia dove siedono i gladiatori feriti a fine lizza.",
              n: "Un editto affisso: «SEVERAMENTE VIETATO ENTRARE IN SCIVOLATA CON ENTRAMBI I PIEDI». Sotto c'è il sigillo di Gannico.",
              x: "Un forziere militare in ferro battuto con doppia serratura a scatto.",
              T: "Un tavolaccio di taverna macchiato di mosto e dadi d'osso sparsi."
            },
            intro: [
              ["voce", "La Suburra a mezzanotte: i vicoli stretti risuonano di risate lontane e passi pesanti di pattuglie. Tra i muri di tufo, l'odore di calce fresca e salsiccia affumicata si mescola alla polvere della sabbia dell'arena."]
            ],
            npcs: [
              { id: "rm_spartaco", at: [8, 19], when: { step: [0, 1] } },
              { id: "rm_corvo", at: [25, 17], when: { step: [0, 2] } },
              { id: "rm_furbio", at: [18, 5], when: { step: [3, 9] } }
            ],
            layout: [
              ...BORDER(32, 22),
              ["lay", 14, 1, 16, 20, ":"],
              ["lay", 1, 11, 30, 11, ":"],
              ["lay", 17, 19, 30, 19, ":"],
              ["lay", 2, 2, 12, 2, "a"],
              ["lay", 18, 2, 29, 2, "a"],
              ["put", 14, 4, "C"],
              ["put", 16, 4, "C"],
              ["put", 14, 8, "C"],
              ["put", 16, 8, "C"],
              ["put", 15, 6, "S"],
              ["put", 13, 2, "B"],
              ["put", 17, 2, "B"],
              ["house", 2, 13, 7, 5, { door: [5, 17], roof: "#78350f", wall: "#451a03", rr: 1, enter: { to: "rm_g_armeria", at: [7, 9] } }],
              ["lay", 22, 13, 29, 15, "a"],
              ["put", 26, 16, "n"],
              ["put", 23, 17, "A"],
              ["put", 24, 17, "A"],
              ["put", 29, 20, "x"],
              ["put", 27, 20, "b"],
              ["put", 22, 20, "b"],
              ["lay", 9, 19, 10, 19, "T"],
              ["put", 3, 19, "E"],
              ["put", 13, 20, "p"],
              ["put", 17, 20, "p"],
              ["put", 1, 6, "B"],
              ["put", 30, 6, "B"]
            ],
            trees: [[3, 8], [28, 8], [7, 5], [24, 5]]
          },
          rm_g_armeria: {
            interior: true,
            region: "suburra",
            name: "Dossier Roma · Bottega di Tullio il Calzolaio",
            short: "Bottega di Tullio",
            sub: "Pelli tese, lesine, forme di legno e chiodi di bronzo",
            bg: "rm_suburra",
            w: 16,
            h: 12,
            start: [7, 9],
            outside: ["rm_g_suburra", 5, 18],
            act: {
              T: "Esamina il banco di lavoro",
              L: "Guarda le pelli di cuoio",
              D: "Guarda l'armadio delle forme",
              A: "Guarda l'anfora della pece",
              b: "Siediti sullo sgabello",
              v: "Esci nella Suburra"
            },
            flavor: {
              T: "Un banco da ciabattino intriso d'olio e pece. Ci sono dieci paia di sandali da lizza in riparazione.",
              L: "Pelli di vacca e cuoio di toro appese a seccare. Profumo acre di conciatura all'antica.",
              D: "Forme di legno di tutte le misure: dal piede leggero dei centrocampisti alla zampa enorme dei difensori.",
              A: "Un'anfora di pece bollente tenuta tiepida da carboni spenti.",
              b: "Uno sgabello basso a tre zampe, consumato da quarant'anni di lavoro artigiano."
            },
            intro: [
              ["voce", "La bottega di Tullio: il martello batte sul cuoio con ritmo regolare. Qui ogni scarpa racconta una scivolata o un gol all'incrocio dei pali."]
            ],
            npcs: [
              { id: "rm_tullio", at: [7, 4] }
            ],
            layout: [
              ...ROOM(16, 12, 7),
              ["lay", 4, 3, 11, 3, "T"],
              ["lay", 1, 1, 5, 1, "L"],
              ["lay", 10, 1, 14, 1, "L"],
              ["put", 14, 5, "D"],
              ["put", 2, 6, "b"],
              ["put", 1, 8, "A"],
              ["put", 14, 8, "A"]
            ]
          }
        },
        talk: {
          rm_spartaco: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    ["rm_spartaco", "[serio] Gannico. Hai la faccia scura come la pece del porto. Che succede al tuo corno d'ottone?"],
                    ["rm_gannico", "[rabbia] Qualcuno ha versato cera d'api nella canna. Se domani non fischio il fuorigioco, i Pretoriani di Furbio si piazzano sulla linea di porta prima ancora che parta il rinvio!"],
                    ["rm_spartaco", "[ride] Quei patrizi non sanno calciare nemmeno un'anguria matura! Vai a vedere nel forziere della taverna: Corvo ha nascosto lì le pergamene con le quote delle scommesse."]
                  ]
                }
              ]
            },
            {
              when: { step: [1, 9] },
              do: [
                {
                  say: [
                    ["rm_spartaco", "Noi della Plebe giochiamo con il cuore e i muscoli. Ma se l'arbitro è cieco, il campo diventa una trincea. Fai rispettare la legge di Roma, Centurione."]
                  ]
                }
              ]
            }
          ],
          rm_corvo: [
            {
              when: { step: [0, 1] },
              do: [
                {
                  say: [
                    ["rm_corvo", "[furbo] Salve, Centurione! Vuoi scommettere sul derby di domani? I Pretoriani sono dati a tre contro uno. Una quota golosa, se l'arbitro si dimentica il corno a casa..."],
                    ["rm_gannico", "[serio] Corvo, se trovo la tua cera nel mio boccaglio ti mando a remare fino a Cartagine. Chi ti ha pagato per intasare il segnale?"],
                    ["rm_corvo", "[sorpreso] Ehi, piano con le accuse! Io prendo solo scommesse. Ma se cerchi il cuoio truccato, chiedi a Tullio. Gli hanno portato certi sandali che sembrano ricci di mare!"]
                  ]
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["rm_corvo", "[pensa] Se Furbio vince, io perdo il banco. Se vince Spartaco, Furbio mi fa crocifiggere sul Gianicolo. Questo mestiere sta diventando troppo pericoloso per un marinaio."]
                  ]
                }
              ]
            }
          ],
          rm_tullio: [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    ["rm_tullio", "[felice] Gannico! Guarda qua. Mi hanno chiesto di risuolare questi calzari dei Pretoriani. (Batte la lesina.) Hanno inserito lamine di piombo nella suola per pestare i piedi e punte di ferro illegali!"],
                    ["rm_gannico", "[serio] È una violazione dell'Articolo IV della Lizza. Fammi ispezionare il materiale sul banco da lavoro."]
                  ]
                },
                { quest: ["rm_g_dossier", "L'Ispezione dei Sandali", "Esamina il banco da lavoro nella bottega di Tullio."] },
                { step: 2 },
                { done: true }
              ]
            },
            {
              when: { step: 2 },
              do: [
                {
                  say: [
                    ["rm_tullio", "Usa il banco, Gannico. Verifica i pesi e il diametro del pallone prima che sorga il sole!"]
                  ]
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["rm_tullio", "Un buon sandalo ti fa correre dritto. Un cattivo arbitro ti fa perdere la testa. Meno male che ci sei tu, Centurione."]
                  ]
                }
              ]
            }
          ],
          rm_furbio: [
            {
              when: { step: 3 },
              do: [
                {
                  say: [
                    ["rm_furbio", "[felice] (In toga bianca con bordo di porpora, scortato da due schiavi con torce.) Centurione Gannico! Che passeggiate notturne... Ti cercavo proprio."],
                    ["rm_furbio", "[furbo] Ho saputo che il tuo corno di bronzo è un po' affaticato. Non ti preoccupare: ho già preparato un decreto senatorio che affida la direzione di gara al mio liberto Porcio. Tu potresti ritirarti con una villa a Baia e trecento sesterzi d'argento."]
                  ]
                },
                {
                  ask: {
                    who: "rm_furbio",
                    prompt: "(Furbio ti porge un sacchetto di cuoio pesante che tintinna. Lo guardi negli occhi.) Allora, Centurione: prendi la villa o vuoi fare l'eroe della sabbia?",
                    secs: 10,
                    def: 1,
                    options: [
                      {
                        label: "«Il corno di Roma non si compra»",
                        sub: "Rifiuta sdegnosamente la corruzione",
                        big: true,
                        do: [
                          { flag: { rm_g_rifiuto: true } },
                          { bond: ["cesare", 5] },
                          { say: [["rm_furbio", "[rabbia] Sei un soldataccio ignorante, Gannico! Domani al Colosseo Cesare vedrà chi comanda davvero tra il Senato e i tuoi stracci della plebe!"]] },
                          { call: "conclude_c4" }
                        ]
                      },
                      {
                        label: "«Accetto l'oro, ma le regole le scrivo io»",
                        sub: "Prendi la borsa come prova del misfatto",
                        big: true,
                        do: [
                          { flag: { rm_g_prova_oro: true } },
                          { bond: ["sesterzi", 50] },
                          { say: [["rm_furbio", "[felice] Sapevo che avevi buon senso. Domani ricordati: nessun fuorigioco contro i Pretoriani e la gloria sarà nostra!"]] },
                          { call: "conclude_c4" }
                        ]
                      },
                      {
                        label: "«Deciderò sul cerchio di centrocampo»",
                        sub: "Prendi tempo senza esporti",
                        do: [
                          { flag: { rm_g_neutrale: true } },
                          { say: [["rm_furbio", "[pensa] Prudente, eh? La prudenza a Roma fa campare cent'anni. Ci vediamo all'arena."]] },
                          { call: "conclude_c4" }
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
                    ["rm_furbio", "[furbo] La notte porta consiglio, Centurione. Ricordati chi firma gli editti dell'Urbe."]
                  ]
                }
              ]
            }
          ]
        },
        obj: {
          "rm_g_suburra:x": [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    ["voce", "Apri il forziere nascosto dietro l'Osteria. Dentro ci sono tavolette di cera incise: «Pretoriani favoriti dal decreto 12: lamine di piombo nei calzari consentite per ordine del Senatore Furbio»."],
                    ["rm_gannico", "[sorpreso] Furbio ha legalizzato le lamine di piombo sotto banco! Devo correre da Tullio a verificare i campioni."]
                  ]
                },
                { quest: ["rm_g_dossier", "La bottega di Tullio", "Raggiungi Tullio il calzolaio nella sua bottega."] },
                { step: 1 },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["voce", "Il forziere militare. Le pergamene scottanti sono al sicuro sotto la tua corazza."]
                  ]
                }
              ]
            }
          ],
          "rm_g_armeria:T": [
            {
              when: { step: 2 },
              do: [
                {
                  say: [
                    ["voce", "Sul banco di Tullio ci sono i sandali sospetti, tre bilance di bronzo e la sfera di cuoio cucita per la finale."],
                    ["rm_gannico", "[serio] Selezioniamo le irregolarità prima che Furbio mandi le sue guardie a sequestrare il banco!"]
                  ]
                },
                {
                  trial: {
                    title: "L'Ispezione dei Sandali e del Pallone",
                    bg: "rm_suburra",
                    secs: 7,
                    need: 3,
                    rounds: [
                      {
                        prompt: "I sandali del centravanti pretoriano hanno chiodi di 4 centimetri. Il limite dell'Editto è 2. Cosa fai?",
                        options: [
                          { label: "Tronchi i chiodi con la tenaglia e applichi sigillo di conformità", ok: true },
                          { label: "Li lasci passare: l'erba del Colosseo è scivolosa" },
                          { label: "Aggiungi altri chiodi per bilanciare" }
                        ],
                        good: "Chiodi regolamentati a filo di suola. Non ci saranno caviglie spezzate.",
                        bad: "Chiodi irregolari: pericolo mortale per gli avversari!"
                      },
                      {
                        prompt: "La palla di cuoio è zavorrata con sabbia vulcanica da un lato per deviare le traiettorie. Come verifichi?",
                        options: [
                          { label: "La immergi nell'anfora d'acqua per osservare se galleggia dritta", ok: true },
                          { label: "Le dai un calcio contro il muro" },
                          { label: "La soppesi a occhio chiuso" }
                        ],
                        good: "La palla ruota storta nell'acqua: trovi il piombino cucito e lo rimuovi!",
                        bad: "La palla resta sbilanciata: le traiettorie saranno imprevedibili."
                      },
                      {
                        prompt: "Il boccaglio del corno di bronzo è ostruito da un tappo di cera d'api. Come lo liberi?",
                        options: [
                          { label: "Passi la canna sulla fiamma del braciere e soffi forte", ok: true },
                          { label: "Ci infili una lancia da legionario" },
                          { label: "Lo riempi di vino caldo" }
                        ],
                        good: "La cera si scioglie e il corno emette uno squillo puro e possente!",
                        bad: "Il boccaglio resta intasato: il suono è un rantolo sordo."
                      },
                      {
                        prompt: "Sulla linguetta del sandalo c'è il timbro segreto del Senatore Furbio. Che fai?",
                        options: [
                          { label: "Requisirai il reperto come prova materiale di frode", ok: true },
                          { label: "Cancellalo con la saliva" },
                          { label: "Fai finta di non aver letto" }
                        ],
                        good: "La prova è sigillata nella tua borsa da centurione.",
                        bad: "Il marchio resta incustodito e perde valore legale."
                      }
                    ],
                    win: [{ flag: { rm_g_ispezione_vinta: true } }, { call: "dopo_ispezione" }],
                    lose: [{ flag: { rm_g_ispezione_vinta: false } }, { call: "dopo_ispezione" }]
                  }
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["voce", "Il banco di Tullio è sgombro. I sandali manomessi sono stati messi a norma."]
                  ]
                }
              ]
            }
          ]
        },
        blocks: {
          dopo_ispezione: [
            {
              say: [
                ["rm_tullio", "[felice] Per tutti gli dei dell'Olimpo, Gannico! Hai salvato la regolarità del torneo. Guarda fuori dalla finestra: il Senatore Furbio sta scendendo dal colle scortato dai suoi pretoriani."],
                ["rm_gannico", "[serio] È arrivato il momento di fargli sentire il peso della legge romana. Esco ad affrontarlo."]
              ]
            },
            { step: 3 },
            { quest: ["rm_g_dossier", "Confronto con Furbio", "Esci nei vicoli e affronta il Senatore Furbio."] },
            { done: true }
          ],
          conclude_c4: [
            {
              say: [
                ["rm_gannico", "[serio] Domani all'alba si aprono i cancelli del Colosseo. Chiunque scenda su quella sabbia dovrà fare i conti con il mio corno."],
                ["voce", "Furbio si allontana nella nebbia della Suburra imprecando sottovoce. La notte volge al termine: sull'Aventino spunta la prima luce dorata del giorno della finale."]
              ]
            },
            { step: 4 },
            { finish: "dossier_c4" },
            { reward: { key: "rm_c4_dossier", give: { coins: 180, cos: ["rm_g_tunica"] } } },
            {
              scene: [
                ["rm_gannico", "[pensa] (Pulisce il boccaglio del corno con la tunica.) Domani c'è Cesare sulle gradinate. E Cesare ascolta solo chi non trema."],
                ["voce", "<b>CAPITOLO 4 DEL DOSSIER CONCLUSO</b> {reward}<br>Mentre la Suburra si sveglia per la grande sfida, il Centurione Gannico prepara il fischio più difficile della sua carriera."]
              ],
              openMain: true,
              bg: "rm_suburra"
            }
          ]
        }
      },
      {
        n: 5,
        title: "L'Editto dei Sesterzi d'Oro",
        sub: "Dossier Incompiuto: l'alba al Colosseo prima dell'apertura dei cancelli",
        avatar: GANNICO_C5,
        start: "rm_g_colosseo",
        introBg: "rm_colosseo",
        intro: [
          ["voce", "<b>DOSSIER INCOMPIUTO · AVE CALCIO!</b> L'Anfiteatro Flavio (Colosseo), un'ora prima che la folla invada le gradinate."],
          ["rm_gannico", "[serio] (In piedi sulla sabbia dorata, la tunica rossa dei giudici di gara.) Il sole illumina la spina monumentale. Cinquantamila cittadini stanno per riempire queste gradinate di travertino. Nel sacrario dei magistrati, Cesare attende il mio verdetto sui regolamenti della finale."]
        ],
        goal: {
          0: "Parla con Augusta la Sibilla presso il grande braciere (in alto a sinistra).",
          1: "Sali alla Loggia dei Magistrati (edificio al centro dell'arena).",
          2: "Disputa la validità dell'editto sulla cattedra dei giudici.",
          3: "Affronta il Senatore Furbio e Cesare per il giudizio definitivo."
        },
        goalDone: "Il Dossier di Ave Calcio è concluso.",
        cast: { ...CAST },
        lore: {
          l_corno_oro: {
            t: "Il Corno d'Ottone di Cesare",
            d: "Fuso nelle fucine imperiali, il suo suono rimbomba fino al Tevere. Chi soffia in questo corno ha l'autorità insindacabile sul risultato di ogni lizza."
          }
        },
        zones: {
          rm_g_colosseo: {
            region: "colosseo",
            name: "Dossier Roma · L'Arena del Colosseo all'Alba",
            short: "Arena Colosseo",
            sub: "Sabbia rastrellata, fiamme dei bracieri e travertino dorato",
            bg: "rm_colosseo",
            time: "giorno",
            travel: [4, 18],
            w: 32,
            h: 22,
            start: [4, 18],
            areas: [
              [11, 6, 21, 14, "La Loggia dei Magistrati"],
              [1, 1, 30, 4, "Le Gradinate dell'Anfiteatro"],
              [22, 14, 30, 20, "L'Uscita dei Gladiatori"],
              [0, 0, 31, 21, "La Sabbia della Lizza"]
            ],
            act: {
              j: "Guarda le gradinate",
              p: "Guarda la colonna d'alloro",
              B: "Scaldati al grande braciere",
              S: "Ammira la statua di Cesare",
              n: "Leggi l'editto della finale",
              b: "Guarda la panca dei giudici",
              E: "Guarda gli scudi dei pretoriani",
              T: "Guarda il tavolo delle coppe"
            },
            flavor: {
              j: "Cinquantamila posti di travertino ancora vuoti. Tra poco qui risuonerà il boato più rumoroso del mondo antico.",
              p: "Una colonna monumentale cinta da rami d'alloro fresco intrecciati con nastri cremisi.",
              B: "Il grande braciere dell'Urbe. Le ceneri rilasciano fumo bianco profumato di mirto.",
              S: "La statua di Cesare incoronato d'alloro mentre indica il dischetto di rigore.",
              n: "L'Editto della Finale: «Chi vince riceve dieci anfore e la corona d'oro. I falli saranno puniti dal corno di Gannico».",
              b: "Panca di marmo dove siederanno i consoli.",
              E: "Scudi d'oro dei Pretoriani accatastati prima della sfilata.",
              T: "Tavolo di cedro dove splende la Coppa d'Alloro destinata alla squadra trionfatrice."
            },
            intro: [
              ["voce", "L'Arena del Colosseo deserta: la sabbia è stata tirata con i rastrelli di bronzo. Nell'aria frizzante dell'alba romana, le aquile volano alte sopra la corona dell'anfiteatro."]
            ],
            npcs: [
              { id: "rm_augusta", at: [8, 7], when: { step: [0, 1] } },
              { id: "rm_spartaco", at: [6, 17], when: { step: [0, 2] } },
              { id: "rm_furbio", at: [25, 17], when: { step: [0, 2] } }
            ],
            layout: [
              ...BORDER(32, 22, "a"),
              ["lay", 1, 1, 30, 2, "j"],
              ["lay", 1, 3, 30, 3, ":"],
              ["house", 12, 7, 8, 6, { door: [15, 12], roof: "#b91c1c", wall: "#fef3c7", rr: 2, enter: { to: "rm_g_tribunale", at: [7, 9] } }],
              ["lay", 15, 13, 15, 20, ":"],
              ["lay", 3, 18, 28, 18, ":"],
              ["put", 8, 6, "B"],
              ["put", 23, 6, "B"],
              ["put", 11, 12, "n"],
              ["put", 10, 6, "p"],
              ["put", 21, 6, "p"],
              ["put", 3, 16, "b"],
              ["put", 28, 16, "b"],
              ["put", 4, 12, "S"],
              ["put", 27, 12, "S"],
              ["put", 24, 17, "E"],
              ["put", 25, 17, "E"]
            ],
            trees: [[2, 8], [29, 8], [7, 4], [24, 4]]
          },
          rm_g_tribunale: {
            interior: true,
            region: "colosseo",
            name: "Dossier Roma · La Loggia dei Magistrati",
            short: "Loggia Magistrati",
            sub: "Cattedra d'avorio, rotoli senatori, drappi purpurei e corone",
            bg: "rm_colosseo",
            w: 16,
            h: 12,
            start: [7, 9],
            outside: ["rm_g_colosseo", 15, 13],
            act: {
              T: "Esamina la cattedra dei giudici",
              W: "Guarda dalle vetrate verso l'arena",
              L: "Consulta i rotoli imperiali",
              D: "Guarda l'armadio delle corone",
              v: "Esci sull'arena"
            },
            flavor: {
              T: "La cattedra in legno di noce e avorio dove siede il Gran Magistrato dei Giochi. C'è appoggiato il sigillo di Cesare.",
              W: "La vista panoramica sulla sabbia del Colosseo. Da qui si controlla ogni metro di campo senza perdere un centimetro.",
              L: "Rotoli di papiro con gli statuti dei giochi dei tempi di Augusto.",
              D: "L'armadio delle toghe da parata e dei rami d'alloro consacrati."
            },
            intro: [
              ["voce", "La Loggia dei Magistrati: silenzio sacro, drappi di velluto rosso porpora e il trono riservato a Cesare per le sentenze inappellabili."]
            ],
            npcs: [
              { id: "rm_cesare", at: [8, 4], when: { step: [2, 9] } },
              { id: "rm_furbio", at: [12, 5], when: { step: [2, 9] } }
            ],
            layout: [
              ...ROOM(16, 12, 7),
              ["lay", 4, 3, 11, 3, "T"],
              ["put", 8, 2, "S"],
              ["put", 2, 4, "B"],
              ["put", 13, 4, "B"],
              ["lay", 1, 1, 4, 1, "L"],
              ["lay", 11, 1, 14, 1, "L"],
              ["put", 14, 6, "D"],
              ["put", 1, 6, "D"]
            ]
          }
        },
        talk: {
          rm_augusta: [
            {
              when: { step: 0 },
              do: [
                {
                  say: [
                    ["rm_augusta", "[pensa] (Getta foglie d'alloro nel braciere: la fiamma crepita azzurra.) Gannico. Gli dei hanno parlato nel fumo: vedo due corni, non uno solo."],
                    ["rm_augusta", "[misterioso] Un corno d'oro che suona per il Senato, carico di sesterzi ma sordo alla giustizia. E un corno di bronzo arrugginito che risveglia la Plebe della Suburra. Cesare ti aspetta nella Loggia. Ricorda: chi soffia per paura perde il fiato; chi soffia per la verità accende Roma."],
                    ["rm_gannico", "[serio] La mia canna d'ottone è pulita, Sibilla. Saprò cosa suonare."]
                  ]
                },
                { quest: ["rm_g_finale", "La Loggia dei Magistrati", "Entra nella Loggia imperiale al centro dell'arena."] },
                { step: 1 },
                { done: true }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["rm_augusta", "I presagi sono compiuti. Ora tocca alla volontà degli uomini."]
                  ]
                }
              ]
            }
          ],
          rm_spartaco: [
            {
              when: { step: [0, 1] },
              do: [
                {
                  say: [
                    ["rm_spartaco", "[felice] Gannico! I miei compagni hanno i sandali regolari, senza piombo e senza trucchi. Se oggi l'arbitro è leale, vincerà chi ama davvero questo gioco!"]
                  ]
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["rm_spartaco", "Siamo pronti. Facci sentire il suono di quel corno!"]
                  ]
                }
              ]
            }
          ],
          rm_cesare: [
            {
              when: { step: 2 },
              do: [
                {
                  say: [
                    ["rm_cesare", "[serio] (In piedi accanto alla cattedra con la corona d'alloro splendente.) Centurione Gannico. Sei il soldato più anziano della lizza. Il Senatore Furbio afferma che la Plebe ha minacciato i guardalinee e chiede l'assegnazione della coppa a tavolino."],
                    ["rm_furbio", "[furbo] È la legge dell'ordine patrizio, Cesare! I gladiatori non possono pretendere la parità sulla sabbia!"],
                    ["rm_cesare", "Taci, Furbio! Voglio ascoltare il mio Centurione. Gannico: hai ispezionato il campo e i calzari. Qual è il tuo verdetto di giudice imperiale?"]
                  ]
                },
                { call: "scelta_finale" }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["rm_cesare", "[felice] Cesare ha parlato. La legge dell'arena è sovrana."]
                  ]
                }
              ]
            }
          ],
          rm_furbio: [
            {
              when: { step: [0, 1] },
              do: [
                {
                  say: [
                    ["rm_furbio", "[furbo] Centurione, l'offerta di stanotte è ancora valida. Cento sesterzi in più se Cesare sente il tuo corno squillare in favore dei Pretoriani!"]
                  ]
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["rm_furbio", "[triste] Gli dei non hanno rispetto per il patriziato d'affari..."]
                  ]
                }
              ]
            }
          ]
        },
        obj: {
          "rm_g_colosseo:B": [
            {
              do: [
                {
                  say: [
                    ["voce", "Il grande braciere dell'arena diffonde incenso e calore sulla sabbia dorata prima della battaglia."]
                  ]
                }
              ]
            }
          ],
          "rm_g_tribunale:T": [
            {
              when: { step: 1 },
              do: [
                {
                  say: [
                    ["voce", "Sulla cattedra dei magistrati c'è la bilancia imperiale e la bozza dell'editto finale."],
                    ["rm_gannico", "[serio] Cesare sta entrando nella loggia. È il momento di presentare le prove."]
                  ]
                },
                {
                  trial: {
                    title: "La Disputa dell'Editto", bg: "rm_colosseo", secs: 7, need: 2,
                    rounds: [
                      { who: "rm_furbio", prompt: "Furbio sventola una pergamena: «L'editto dice che il pallone d'oro del Senato è il pallone ufficiale». Cosa rispondi?", options: [{ label: "«Il Codice delle Dodici Lame vuole un pallone uguale per tutti»", ok: true }, { label: "«Ha ragione, Senatore»" }, { label: "Soffi nel corno per zittirlo" }], good: "Il cancelliere annuisce e cancella una riga.", bad: "La riga resta. Furbio sorride sotto i baffi." },
                      { who: "rm_furbio", prompt: "«E chi lo dice che i sandali chiodati sono vietati? Nessuna tavola di bronzo!»", options: [{ label: "Mostri i chiodi requisiti nella bottega di Tullio", ok: true }, { label: "«Lo dico io, e basta»" }, { label: "Cambi argomento" }], good: "I chiodi tintinnano sulla cattedra. Silenzio in loggia.", bad: "Senza prove, la tua parola pesa come una piuma." },
                      { who: "rm_furbio", prompt: "«L'arbitro deve stare dove lo mette il Senato: in tribuna, all'ombra!»", options: [{ label: "«L'arbitro sta sulla sabbia, dove si gioca»", ok: true }, { label: "«All'ombra, volentieri»" }, { label: "«Decida Cesare»" }], good: "Dagli spalti della plebe arriva un applauso.", bad: "Il cancelliere scrive «in tribuna». Gannico stringe il corno." }
                    ],
                    win: [{ flag: { rm_g_editto: true } }, { say: [["rm_gannico", "[felice] Tre righe cancellate, una sabbia pulita. Ora Cesare può ascoltare."]] }, { step: 2 }, { quest: ["rm_g_finale", "Il Verdetto davanti a Cesare", "Parla con Cesare nella Loggia dei Magistrati."] }, { done: true }],
                    lose: [{ say: [["rm_gannico", "[serio] Le parole di Furbio pesano più dell'oro. Ma la verità la porto lo stesso davanti a Cesare."]] }, { step: 2 }, { quest: ["rm_g_finale", "Il Verdetto davanti a Cesare", "Parla con Cesare nella Loggia dei Magistrati."] }, { done: true }]
                  }
                }
              ]
            },
            {
              do: [
                {
                  say: [
                    ["voce", "La cattedra dei giudici imperiali. Gli editti sono stati proclamati."]
                  ]
                }
              ]
            }
          ]
        },
        endings: {
          gannico_plebe: [
            "IL CORNO DEL POPOLO",
            "Dossier Incompiuto: Gannico svela davanti a Cesare le lamine di piombo di Furbio e suona il corno di bronzo a pieni polmoni. Cesare annulla i privilegi del Senato e ordina che la finale si giochi alla pari. La Plebe trionfa e porta Gannico in trionfo attraverso l'Arco di Trionfo: nasce la leggenda dell'arbitro del popolo.",
            "Nel Dossier, rifiuta la corruzione e dichiara la lizza aperta alla Plebe."
          ],
          gannico_imperiale: [
            "IL PRIMO MAGISTRATO DELLA LIZZA",
            "Dossier Incompiuto: Gannico presenta a Cesare il Codice delle Regole Scritte dell'Urbe. Cesare, ammirato dal rigore marziale del Centurione, revoca ogni potere al corrotto Furbio e nomina Gannico Gran Magistrato Arbitrale Perpetuo di tutte le ludi dell'Impero Romano.",
            "Nel Dossier, consegna a Cesare il Codice delle Regole della Lizza."
          ]
        },
        blocks: {
          scelta_finale: [
            {
              ask: {
                who: "rm_gannico",
                prompt: "Tutti gli sguardi sono su di te. Cesare attende. Il tuo corno di bronzo è stretto nel pugno. Come giudichi?",
                options: [
                  {
                    label: "«Furbio ha truccato la lizza! Giustizia per la Plebe!»",
                    sub: "Finale: Il Corno del Popolo",
                    cls: "hot",
                    big: true,
                    do: [{ call: "finale_plebe" }]
                  },
                  {
                    label: "«Ecco il Codice delle Regole: la legge sia sopra tutti»",
                    sub: "Finale: Il Primo Magistrato della Lizza",
                    big: true,
                    do: [{ call: "finale_imperiale" }]
                  }
                ]
              }
            }
          ],
          finale_plebe: [
            { end: "gannico_plebe" },
            { unlock: ["rm_gannico", "rm_tullio"] },
            { finish: "gannico_plebe" },
            { step: 9 },
            { bond: ["gloria", 25] },
            { reward: { key: "end:gannico_plebe", give: { coins: 300 } } },
            {
              scene: [
                ["rm_gannico", "[soffia con tutta la forza nel corno] ROOO-BAAAAH! Il segnale rimbomba nel Colosseo come un tuono!"],
                ["rm_gannico", "[serio] Cesare! Le lamine di piombo del Senatore Furbio sono false e disonorevoli! La lizza appartiene alla sabbia e al sudore, non ai contratti di bottega!"],
                ["rm_cesare", "[sorpreso] Per tutti i numi! Furbio, via dalla mia vista prima che ti faccia gettare ai coccodrilli del Nilo!"],
                ["rm_spartaco", "[felice] (Dall'arena, solleva Gannico sulle spalle assieme a tutta la squadra della Suburra.) Viva il Centurione! Viva l'arbitro che non si piega!"],
                ["voce", "<b>DOSSIER CONCLUSO: IL CORNO DEL POPOLO!</b> {reward}<br>Hai sbloccato le carte <b>«Centurione Gannico»</b> e <b>«Tullio il Calzolaio»</b> nella Squadra dei Sogni! Gannico ora visita anche il Borgo Marino e nelle Carte del Destino è disponibile il mazzo «Il Dossier di Gannico»!"]
              ],
              openMain: true,
              bg: "rm_colosseo"
            }
          ],
          finale_imperiale: [
            { end: "gannico_imperiale" },
            { unlock: ["rm_gannico", "rm_tullio"] },
            { finish: "gannico_imperiale" },
            { step: 9 },
            { bond: ["cesare", 30] },
            { reward: { key: "end:gannico_imperiale", give: { coins: 300 } } },
            {
              scene: [
                ["rm_gannico", "[serio] (Posa sulla cattedra d'avorio la tavoletta di bronzo.) Cesare. Roma ha conquistato il mondo con la legione e il diritto. Anche il pallone deve avere il suo codice. Ecco le dodici regole incrollabili della Lizza."],
                ["rm_cesare", "[felice] (Prende la tavola, la legge e sorride con orgoglio imperiale.) Questa è la grandezza di Roma! Niente sotterfugi da bottegai: una legge uguale per ogni atleta dell'Impero!"],
                ["rm_cesare", "Furbio è destituito da ogni carica circense. E tu, Centurione Gannico, da oggi sei il Gran Magistrato delle Ludi di Cesare, con corona d'alloro imperiale!"],
                ["rm_tullio", "[felice] (Dalla tribuna sventola una bandiera giallorossa.) Grande Gannico! Ora i sandali li facciamo a regola d'arte per tutto l'Impero!"],
                ["voce", "<b>DOSSIER CONCLUSO: IL PRIMO MAGISTRATO DELLA LIZZA!</b> {reward}<br>Hai sbloccato le carte <b>«Centurione Gannico»</b> e <b>«Tullio il Calzolaio»</b> nella Squadra dei Sogni! Gannico ora visita anche il Borgo Marino e nelle Carte del Destino è disponibile il mazzo «Il Dossier di Gannico»!"]
              ],
              openMain: true,
              bg: "rm_colosseo"
            }
          ]
        }
      }
    ]
  });
})();
