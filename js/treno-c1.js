// js/treno-c1.js - L'ESPRESSO DELLE OMBRE · Capitolo 1 «Il Treno delle 23:15 · La Valigetta d'Acciaio»
// Partenza del Nord-Sud Star nella tormenta alpina, la scoperta della valigetta diplomatica violata
// nella carrozza letti, il primo interrogatorio tra i velluti del vagone ristorante
// e il primo scontro forzato a «Il Corridoio d'Acciaio» contro gli agenti d'infiltrazione.
(function () {
  "use strict";
  function boot() {
    const D = window.__treno;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("te_valenti", { beard: "incolta", acc: ["berretto", "sciarpa"], name: "Ispettore Valenti", tag: "blue", hair: "#334155", style: "slick", skin: "#cbd5e1", eye: "#0f172a", bg: ["#1e293b", "#0f172a"], shirt: "#1e293b" },
      "Agente anziano dei servizi di sicurezza alpini. Veste un pesante cappotto di panno grigio fumo, parla con voce misurata e scruta ogni passeggero come un potenziale bersaglio: «Sul Nord-Sud Star nessuno viaggia mai solo per piacere, ragazzo.».");

    K.cast("te_klaus", { beard: "baffi", acc: ["berretto", "fischietto"], name: "Klaus il Capotreno", tag: "", hair: "#e2e8f0", style: "buzz", skin: "#fed7aa", eye: "#1e3a8a", bg: ["#1e3a8a", "#0f172a"], shirt: "#1e3a8a" },
      "Responsabile del convoglio transalpino da quarant'anni. Conosce ogni giunto dei binari, ogni scompartimento e tiene il mazzo di chiavi passe-partout assicurato alla cintura: «Orario e disciplina prima di tutto, bufera o non bufera!».");

    K.cast("te_elena", { acc: ["occhiali", "foulard"], name: "Contessa Elena Von Kroll", tag: "gold", hair: "#b45309", style: "wavy", skin: "#f8d7b0", eye: "#047857", bg: ["#451a03", "#78350f"], shirt: "#831843" },
      "Fascinosa ereditiera e mecenate sportiva di Vienna. Viaggia in prima classe avvolta in stole di visone e cela un taccuino di cifre dietro il velo del cappellino.");

    K.cos("te_c1", { kind: "shirt", label: "Giacca di lana pesante da viaggiatore alpino", val: "#1e293b", from: "Capitolo 1 de L'Espresso delle Ombre" });
    K.lore("l_nordstar", { t: "Il Nord-Sud Star", d: "Il treno espresso d'epoca che attraversa le Alpi tra foreste innevate, saloni in mogano e cabine private." });
    K.lore("l_corridoio", { t: "Il Corridoio d'Acciaio", d: "Nei vagoni stretti la pendenza delle curve devia le traiettorie e le porte creano sponde perfette." });

    const goal = (s) => ({
      0: "Sei a bordo del Nord-Sud Star. Parla con il Capotreno Klaus nel Vagone Ristorante.",
      1: "Allarme nella carrozza letti! Raggiungi lo Scompartimento Diplomatico e parla con l'Ispettore Valenti.",
      2: "Ritorna al Vagone Ristorante e interroga la Contessa Elena sui movimenti sospetti.",
      3: "Agenti rivali bloccano il passaggio! Affrontali a Il Corridoio d'Acciaio nel corridoio della carrozza."
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      te_ristorante: {
        region: "vagone", name: "Vagone Ristorante", short: "Ristorante", sub: "Tavolini in noce, lampade d'ottone e bufera fuori dai finestrini", bg: "te_ristorante", time: "notte",
        w: 32, h: 22, start: [6, 11], items: [[4, 8], [28, 8], [16, 17]],
        areas: [[0, 0, 31, 21, "Il lussuoso vagone ristorante del Nord-Sud Star in corsa nella notte"]],
        flavor: {
          V: "Il finestrino panoramico: fiocchi di bufera si infrangono sul vetro mentre le sagome degli abeti sfilano nere.",
          P: "Le poltrone in velluto cardinale dove i diplomatici sorseggiano liquori d'erbe.",
          T: "I tavoli imbanditi con candelabri e tovagliato bianco impeccabile.",
          s: "La porta a soffietto che conduce al corridoio delle carrozze passeggeri."
        },
        intro: [
          ["voce", "Nord-Sud Star, ore 23:15. Il convoglio transalpino sferraglia tra le gole montane mentre una bufera di neve cancella i segnali di linea."],
          ["voce", "Convocato per una cruciale amichevole diplomatica oltrefrontiera, sei appena salito a bordo quando le luci delle carrozze hanno un brusco sfarfallio."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "te_klaus", at: [12, 11] }] : [{ id: "te_klaus", at: [26, 11] }]),
          ...(s >= 2 ? [{ id: "te_elena", at: [8, 6] }] : []),
          ...(s >= 3 ? [{ id: "te_valenti", at: [18, 11] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          // Perimetro e pareti in legno scuro della carrozza
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Finestrini panoramici superiori e inferiori
          for (let x = 3; x <= 28; x += 4) { put(x, 1, "V"); put(x, 20, "V"); }
          // Corridoio centrale con tappeto
          lay(1, 10, 30, 12, ":");
          // Tavoli con poltroncine
          for (let tx = 4; tx <= 26; tx += 6) {
            put(tx, 6, "T"); put(tx, 5, "P"); put(tx, 7, "P");
            put(tx, 15, "T"); put(tx, 14, "P"); put(tx, 16, "P");
          }
          // Uscita verso la carrozza letti (porta a est)
          house(28, 9, 3, 4, { door: [29, 11], roof: "#451a03", wall: "#78350f", rr: 1, enter: { to: "te_corridoio", at: [3, 11] } });
          put(5, 11, "s");
        }
      },
      te_corridoio: {
        region: "vagone", name: "Corridoio Carrozza Letti", short: "Carrozza Letti", sub: "Mogano laccato, porte delle cuccette e scossoni sui binari", bg: "te_corridoio", w: 32, h: 22, start: [3, 11], outside: ["te_ristorante", 27, 11],
        act: { V: "Guarda fuori", q: "Entra nello scompartimento", s: "Esci verso il ristorante" },
        flavor: {
          V: "La bufera infuria sui vetri appannati: le ruote d'acciaio urlano sui raccordi del valico.",
          P: "La guida d'ottone lungo le pareti a cui reggersi durante le curve strette.",
          s: "La porta a soffietto che riporta al vagone ristorante."
        },
        intro: [["voce", "Il corridoio della carrozza letti: il legno scuro vibra a ogni curva. Un sussurro concitato giunge dallo scompartimento diplomatico in fondo a destra."]],
        npcs: (s) => [
          ...(s === 1 ? [{ id: "te_valenti", at: [24, 11] }] : []),
          ...(s === 3 ? [{ id: "te_klaus", at: [10, 11] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 21, "+");
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Finestrini lungo tutto il lato sud del corridoio
          for (let x = 2; x <= 29; x += 3) put(x, 20, "V");
          // Corridoio di passaggio
          lay(1, 10, 30, 12, ":");
          // Porte degli scompartimenti sul lato nord (A, B, C, D)
          house(4, 2, 6, 7, { door: [7, 8], roof: "#451a03", wall: "#92400e", rr: 1, enter: "Scompartimento N° 1: bagagli di viaggiatori addormentati e cappotti appesi." });
          house(12, 2, 6, 7, { door: [15, 8], roof: "#451a03", wall: "#92400e", rr: 1, enter: "Scompartimento N° 2: una valigia di cuoio chiusa e il sonno pesante di un delegato." });
          // Scompartimento Diplomatico (ingresso)
          house(20, 2, 8, 7, { door: [24, 8], roof: "#1e293b", wall: "#334155", rr: 2, enter: { to: "te_scompartimento", at: [8, 9] } });
          put(2, 11, "s");
        }
      },
      te_scompartimento: {
        interior: true, region: "vagone", name: "Scompartimento Diplomatico", short: "Cabina Diplomatica", sub: "Cuccetta privata, valigetta piombata e sigilli spezzati", bg: "te_bagagliaio", w: 16, h: 12, start: [8, 9], outside: ["te_corridoio", 24, 9],
        act: { B: "Ispeziona la valigetta", V: "Guarda fuori", P: "Siediti sulla cuccetta", v: "Torna al corridoio" },
        flavor: {
          B: "La valigetta diplomatica metallica: le cerniere sono intatte, ma la combinazione è stata allineata con precisione millimetrica.",
          V: "Il finestrino smerigliato della cabina, con la neve che turbina nella gola sottostante.",
          P: "La cuccetta in velluto cardinale con una coperta di lana spiegazzata."
        },
        intro: [["voce", "La cabina diplomatica: l'aria sa di tabacco inglese e cera vergine. Sul tavolino d'angolo, la valigetta piombata è aperta a metà."]],
        npcs: (s) => [
          ...(s <= 2 ? [{ id: "te_valenti", at: [8, 5] }] : [])
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(8, 11, "v");
          put(4, 1, "V"); put(11, 1, "V");
          put(3, 4, "P"); put(12, 4, "P");
          put(8, 4, "B"); put(5, 7, "P");
        }
      }
    };

    const talk = {
      te_klaus: (K) => {
        const s = S();
        if (s === 0) {
          return say([
            ["te_klaus", "[controlla il cronometro d'argento con fare severo] Benvenuto sul Nord-Sud Star, ragazzo. Il treno ha già venti minuti di ritardo sul valico alpino."],
            ["hero", "La bufera sembra peggiorare a ogni miglio. Riusciremo ad arrivare a Ginevra per il calcio d'inizio del match diplomatico?"],
            ["te_klaus", "[abbassa la voce e guarda verso il corridoio] Non è la neve a preoccuparmi. Poco fa le luci della Carrozza Letti sono saltate per due minuti esatti. E l'Ispettore Valenti si è precipitato lì con aria tutt'altro che serena. Faresti bene a raggiungerlo."]
          ], () => {
            setStep(1);
            quest("te_q1", "Allarme Carrozza Letti", "Raggiungi l'Ispettore Valenti nello Scompartimento Diplomatico della carrozza passeggeri.");
            done();
          });
        }
        if (s === 3) {
          return say([
            ["te_klaus", "[impugna la lanterna di coda] Due uomini con passamontagna e divise contraffatte hanno bloccato il passaggio tra le carrozze! Pretendono che gli consegniamo il ragazzo e la valigetta!"],
            ["hero", "Non sul nostro treno. È il momento di far parlare il campo nel corridoio!"]
          ], done);
        }
        say([["te_klaus", "[pulisce gli occhiali appannati] Mantenere il sangue freddo. Il Nord-Sud Star ha superato le tempeste del cinquantasei, supererà anche stanotte."]], done);
      },

      te_valenti: (K) => {
        const s = S();
        if (s === 1) {
          return say([
            ["te_valenti", "[si volta con scatto felino tenendo la mano sul bavero del cappotto] Fermo lì! Non toccate nulla. Chi vi ha autorizzato ad entrare?"],
            ["hero", "Il Capotreno Klaus. Sono il capitano della delegazione convocata per il match oltrefrontiera."],
            ["te_valenti", "[esamina attentamente il tuo viso prima di allentare la presa] Ah, il talento di Borgo Marino. Allora siete testimone di un fatto gravissimo. Guardate la valigetta: i sigilli diplomatici sono intatti, ma il rocchetto dei microfilm è stato sostituito con un peso di piombo!"]
          ], () => {
            ask("Come affronti la scoperta del furto con l'Ispettore?", [
              {
                label: "«Mettiamoci subito a caccia: un treno in corsa non offre vie di fuga.»",
                big: true,
                fn: () => {
                  bond("freddezza", 10);
                  say([
                    ["te_valenti", "[un sorriso d'approvazione illumina il volto severo] Risoluto e lucido. Mi piace. Ecco il primo reperto: una nota cifrata rinvenuta sotto il tappeto del compartimento."],
                    ["te_valenti", "Andate al Vagone Ristorante. C'è una donna che finge di non guardare l'orologio da quando siamo partiti: la Contessa Von Kroll. Interrogatela."]
                  ], () => {
                    K.dossier("microfilm1", { microfilm: 1, freddezza: 5 }, () => {
                      setStep(2);
                      quest("te_q2", "La Contessa del Ristorante", "Interroga la Contessa Elena Von Kroll sui movimenti nel Vagone Ristorante.");
                      done();
                    });
                  });
                }
              },
              {
                label: "«Potrebbe trattarsi di un sabotaggio interno per annullare la partita.»",
                big: true,
                fn: () => {
                  bond("sospetto", 10);
                  say([
                    ["te_valenti", "[annuisce lentamente picchiettando sul bocchino della pipa] Una supposizione acuta. C'è chi teme che quel match suggelli una pace sportiva sgradita a molti potenti."],
                    ["te_valenti", "Prendete nota di questo primo microfilm che ho recuperato dalla scatola di sigari prima che sparisse tutto. Poi parlate con la Contessa Elena: le sue reazioni ci diranno molto."]
                  ], () => {
                    K.dossier("microfilm1", { microfilm: 1, freddezza: 5 }, () => {
                      setStep(2);
                      quest("te_q2", "La Contessa del Ristorante", "Interroga la Contessa Elena Von Kroll sui movimenti nel Vagone Ristorante.");
                      done();
                    });
                  });
                }
              }
            ]);
          });
        }
        if (s === 3) {
          return say([
            ["te_valenti", "[stringe i pugni osservando la fine del corridoio] Eccoli. Hanno tentato di staccare la condotta del freno e ora avanzano tra i sedili. Vogliono chiuderci in gabbia prima del valico."],
            ["hero", "Nel corridoio non c'è spazio per le armi da fuoco. Ci giochiamo il passaggio col pallone d'acciaio!"]
          ], () => {
            ask("Pronto per la sfida a Il Corridoio d'Acciaio?", [
              {
                label: "Scendi in campo nel vagone passeggeri! ▸",
                fn: () => {
                  K.corridoioMatch({
                    homeTeam: "Squadra delle Ombre",
                    awayTeam: "Infiltrati del Valico",
                    targetGoals: 2
                  }, (r) => {
                    if (r && r.win) {
                      say([
                        ["te_valenti", "[esulta con un cenno asciutto] Magistrale rimbalzo sulla porta dello scompartimento! Gli infiltrati sono finiti contro la paratia di coda e si sono ritirati verso il vagone merci."],
                        ["te_valenti", "La prima imboscata è sventata, ma la vera tela dell'intrigo si addentra nella notte del valico."]
                      ], () => {
                        questDone("te_q1");
                        questDone("te_q2");
                        finishChapter({
                          next: 2,
                          title: "Capitolo 1 Concluso",
                          text: "Hai difeso il vagone passeggeri e acquisito il primo microfilm cifrato. Il convoglio s'inerpica verso il gelo del Capitolo 2."
                        });
                      });
                    } else {
                      say([["te_valenti", "Gli infiltrati ci hanno respinti! Riprendiamo fiato e riproviamo prima che blocchino le uscite."]], done);
                    }
                  });
                }
              }
            ]);
          });
        }
        say([["te_valenti", "[guarda fuori dal finestrino] Occhi aperti. Il gelo delle Alpi non perdona le distrazioni."]], done);
      },

      te_elena: (K) => {
        const s = S();
        if (s === 2) {
          return say([
            ["te_elena", "[sorseggia un calice di champagne osservandoti sopra gli occhiali scuri] Siete voi il giovane fuoriclasse di cui tutti parlano nel salone. Quale insolito vento vi porta al mio tavolino?"]
          ], () => {
            ask("Cosa chiedi alla Contessa?", [
              {
                label: "«Qualcuno è passato verso la carrozza diplomatica durante il black-out?»",
                big: true,
                fn: () => {
                  bond("freddezza", 10);
                  say([
                    ["te_elena", "[appoggia delicatamente il calice con gesto misurato] Un black-out? Ero così assorta nella lettura della partitura viennese che ho notato a malapena il calo di tensione."],
                    ["te_elena", "Tuttavia... ho visto il Dottor Morozov affrettarsi verso il vagone bagagli con una borsa termica di cuoio scuro. Se cercate segreti, guardate dove il ghiaccio non si scioglie mai."],
                    ["hero", "[Ispettore Valenti ti raggiunge a passi svelti dal corridoio] Ragazzo! Gli infiltrati stanno circondando il passaggio! Hanno le insegne della polizia di frontiera, ma sono mercenari!"]
                  ], () => {
                    setStep(3);
                    quest("te_q3", "Scontro nel Corridoio", "Affronta gli infiltrati nel corridoio passeggeri a Il Corridoio d'Acciaio.");
                    done();
                  });
                }
              },
              {
                label: "«La vostra borsa di visone nasconde più di un semplice specchietto.»",
                big: true,
                fn: () => {
                  bond("sospetto", 15);
                  say([
                    ["te_elena", "[gli occhi le brillano di un lampo metallico prima di sorridere] Un'accusa audace per un atleta. L'audacia è una virtù rara... ma pericolosa."],
                    ["te_elena", "Se proprio dovete sapere, qualcuno a bordo non vuole che quel pallone varchi la frontiera. E non sono certo io a sporcarmi i guanti di seta."],
                    ["hero", "[Dal fondo della carrozza risuona un colpo sordo e le urla del personale ferroviario!]"]
                  ], () => {
                    setStep(3);
                    quest("te_q3", "Scontro nel Corridoio", "Affronta gli infiltrati nel corridoio passeggeri a Il Corridoio d'Acciaio.");
                    done();
                  });
                }
              }
            ]);
          });
        }
        say([["te_elena", "[osserva le bollicine del calice] La diplomazia è l'arte di far scivolare il pallone esattamente dove l'avversario non guarda."]], done);
      }
    };

    return {
      n: N,
      title: "Capitolo 1 · Il Treno delle 23:15 · La Valigetta d'Acciaio",
      sub: "Partenza nella tormenta, scompartimenti violati e prima sfida nel corridoio",
      goal,
      start: "te_ristorante",
      introBg: "te_titolo",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [
          ["voce", "Nord-Sud Star, ore 23:15. Il convoglio transalpino affronta il valico delle Alpi mentre la bufera cancella le rotaie."],
          ["voce", "Nel silenzio ovattato delle carrozze in mogano, una valigetta diplomatica con documenti segreti scompare nel nulla."]
        ];
      }
    };
  }

  boot();
})();
