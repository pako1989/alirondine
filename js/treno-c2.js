// js/treno-c2.js - L'ESPRESSO DELLE OMBRE · Capitolo 2 «L'Intrigo del Vagone Letto & La Tormenta»
// L'incursione nel vagone merci tra bauli diplomatici e casse postali,
// la scoperta della micro-cinepresa Minox e del passe-partout in ottone,
// il confronto con il Dottor Morozov e il gigante Boris nella sala macchine,
// e la semifinale forzata tra i vagoni merci contro i sabotatori della linea alpina.
(function () {
  "use strict";
  function boot() {
    const D = window.__treno;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("te_morozov", { beard: "pizzetto", acc: ["occhiali", "taccuino"], name: "Dottor Morozov", tag: "blue", hair: "#475569", style: "ordinato", skin: "#e2e8f0", eye: "#1e3a8a", bg: ["#0f172a", "#334155"], shirt: "#334155" },
      "Medico di bordo e scacchista di talento. Viaggia con una borsa termica con fiale e siringhe, parla a mezza voce e sembra conoscere i segreti clinici di ogni console d'ambasciata.");

    K.cast("te_boris", { beard: "folta", acc: ["guanti"], name: "Boris il Fuochista", tag: "gold", hair: "#1c1917", style: "bald", skin: "#d97706", eye: "#292524", bg: ["#78350f", "#451a03"], shirt: "#451a03" },
      "Il titanico fuochista della locomotiva a vapore. Pala alla mano, getta carbone nei forni con ritmo d'orologio e difende il motore come un santuario: «Finché c'è vapore, il Nord-Sud Star non si ferma per nessuno!»");

    K.cos("te_c2", { kind: "shirt", label: "Divisa termica in cuoio e velluto alpino", val: "#0369a1", from: "Capitolo 2 de L'Espresso delle Ombre" });
    K.lore("l_minox", { t: "La Micro-Cinepresa Minox", d: "Capolavoro tascabile dello spionaggio anni '60: scatti ad altissima risoluzione celati in un cilindro d'alluminio." });
    K.lore("l_boris", { t: "I Fuochisti delle Alpi", d: "Uomini temprati dal gelo e dalla fiamma, capaci di sentire lo stato dei binari dalle vibrazioni della paratia." });

    const goal = (s) => ({
      0: "Raggiungi il Vagone Bagagli oltre la carrozza passeggeri per verificare il baule diplomatico.",
      1: "Hai trovato il Passe-partout d'ottone. Parla con il Dottor Morozov nel Vagone Cuccette.",
      2: "Raggiungi la Sala Macchine in testa al convoglio e parla con Boris il Fuochista.",
      3: "I sabotatori tentano di bloccare i freni nel Vagone Bagagli! Vinci la sfida a Il Corridoio d'Acciaio!"
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      te_bagagliaio: {
        region: "vagone", name: "Vagone Bagagli & Merci", short: "Vagone Bagagli", sub: "Bauli blindati, sacchi postali, fari d'emergenza e stufa a carbone", bg: "te_bagagliaio", time: "notte",
        w: 32, h: 22, start: [4, 11], items: [[6, 6], [26, 6], [16, 17]],
        areas: [[0, 0, 31, 21, "Il freddo e cavernoso vagone merci con i bauli diplomatici sotto sequestro"]],
        flavor: {
          B: "Un grande baule blindato in lamiera d'acciaio con angolari d'ottone e sigillo di cera.",
          F: "La stufa in ghisa del personale di scorta: diffonde un calore asciutto e riflessi rossastri.",
          P: "Casse di legno marchiate con i simboli doganali di mezza Europa.",
          s: "La porta stagna che conduce alla carrozza cuccette."
        },
        intro: [
          ["voce", "Vagone Bagagli: qui l'aria è gelida e sa di nafta, cuoio vecchio e carbone fossile."],
          ["voce", "I bauli diplomatici sono allineati contro le paratie d'acciaio. Una delle casse presenta il sigillo vistosamente violato."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "te_valenti", at: [14, 11] }] : []),
          ...(s >= 3 ? [{ id: "te_valenti", at: [22, 11] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Finestrini grigliati
          for (let x = 4; x <= 26; x += 6) { put(x, 1, "V"); put(x, 20, "V"); }
          // Pavimento metallico con rotaia interna
          lay(1, 10, 30, 12, ":");
          // Bauli e casse
          put(8, 6, "B"); put(18, 6, "B"); put(10, 15, "F");
          put(14, 6, "P"); put(22, 15, "P"); put(6, 15, "P");
          // Uscita verso le cuccette (ovest)
          put(2, 11, "s");
          // Uscita verso la sala macchine (est)
          house(28, 9, 3, 4, { door: [29, 11], roof: "#1e293b", wall: "#475569", rr: 1, enter: { to: "te_caldaie", at: [4, 11] } });
        }
      },
      te_cuccette: {
        interior: true, region: "vagone", name: "Vagone Cuccette Private", short: "Cuccette", sub: "Mogano scuro, tendaggi di velluto e odore di etere medicinale", bg: "te_corridoio", w: 18, h: 14, start: [3, 7], outside: ["te_bagagliaio", 4, 11],
        act: { V: "Guarda fuori", P: "Siediti sulla cuccetta", T: "Esamina il tavolino", v: "Torna al bagagliaio" },
        flavor: {
          V: "La bufera ulula contro i doppi vetri termici.",
          P: "La cuccetta del Dottor Morozov con una coperta militare ripiegata.",
          T: "Il tavolino con una scacchiera da viaggio e boccette di sali."
        },
        intro: [["voce", "La carrozza cuccette private: silenziosa come un confessionale. Il Dottor Morozov sta disponendo con cura i suoi strumenti."]],
        npcs: (s) => [
          { id: "te_morozov", at: [10, 6] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 13, "+"); lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 13, "a"); lay(17, 0, 17, 13, "a"); lay(0, 13, 17, 13, "a");
          put(1, 7, "v");
          put(6, 1, "V"); put(12, 1, "V");
          put(14, 5, "P"); put(14, 8, "P"); put(10, 8, "T");
        }
      },
      te_caldaie: {
        region: "stazione", name: "Locomotiva & Sala Caldaie", short: "Sala Macchine", sub: "Ruggito del vapore, calore infernale e la sagoma imponente di Boris", bg: "te_stazione", time: "notte",
        w: 22, h: 16, start: [4, 8], outside: ["te_bagagliaio", 27, 11],
        act: { F: "Osserva la fornace", K: "Guarda i manometri del vapore", s: "Torna indietro al bagagliaio" },
        flavor: {
          F: "La bocca di fuoco della caldaia: lingue di fiamma scarlatta divorano tonnellate di antracite.",
          K: "I manometri d'ottone con le lancette che vibrano vicino alla zona rossa della pressione.",
          s: "La porticina blindata che riporta all'interno del vagone bagagli."
        },
        intro: [["voce", "La testa del mostro d'acciaio: il calore della fornace contrasta violentemente col gelo dell'aria che entra dalle prese d'aria. Boris manovra la pala a torso nudo."]],
        npcs: (s) => [
          { id: "te_boris", at: [12, 8] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 21, 15, "+"); lay(0, 0, 21, 0, "a"); lay(0, 0, 0, 15, "a"); lay(21, 0, 21, 15, "a"); lay(0, 15, 21, 15, "a");
          put(2, 8, "s");
          put(14, 4, "K"); put(16, 4, "K");
          put(14, 8, "F"); put(14, 9, "F");
        }
      }
    };

    const talk = {
      te_valenti: (K) => {
        const s = S();
        if (s === 0) {
          return say([
            ["te_valenti", "[esamina con una torcia il pavimento metallico del vagone merci] Guardate qui. Chi ha violato il baule ha perso questo nella fretta: una chiave passe-partout originale delle ferrovie."],
            ["hero", "Quindi l'autore del furto ha accesso a ogni serratura del convoglio."],
            ["te_valenti", "Esatto. Ma non basta: ho trovato traccia di polvere di carbone sulla maniglia. Andate a interrogare il Dottor Morozov nella carrozza cuccette: le sue boccette contengono più segreti di quanto dichiari."]
          ], () => {
            K.dossier("passepartout", { microfilm: 1, freddezza: 10 }, () => {
              setStep(1);
              quest("te_q4", "La Chiave e il Medico", "Interroga il Dottor Morozov nella carrozza cuccette private.");
              done();
            });
          });
        }
        if (s === 3) {
          return say([
            ["te_valenti", "[impugna il pallone d'acciaio e sbarra il passaggio del bagagliaio] Ci siamo. I sabotatori hanno chiuso le porte stagne del convoglio. Vogliono far deragliare la coda del treno prima della galleria!"],
            ["hero", "Nel vagone merci c'è spazio sufficiente per far rimbalzare la palla contro le casse. Vinciamo questa semifinale e liberiamo la via!"]
          ], () => {
            ask("Pronto per la sfida nel Vagone Merci a Il Corridoio d'Acciaio?", [
              {
                label: "Affronta i sabotatori tra i bauli blindati! ▸",
                fn: () => {
                  K.corridoioMatch({
                    homeTeam: "Agenti di Valenti",
                    awayTeam: "Sabotatori del Valico",
                    targetGoals: 3
                  }, (r) => {
                    if (r && r.win) {
                      say([
                        ["te_valenti", "[asciuga la fronte con un fazzoletto scuro] Straordinario! La palla rimbalzata sulla stufa ha mandato fuori tempo il loro difensore migliore. I sabotatori sono fuggiti sul tetto della carrozza!"],
                        ["te_valenti", "Abbiamo recuperato anche la micro-cinepresa Minox con gli scatti del viadotto. Ora resta solo l'atto finale a mezzanotte."]
                      ], () => {
                        K.dossier("cinepresa", { microfilm: 1, freddezza: 10 }, () => {
                          questDone("te_q4");
                          finishChapter({
                            next: 3,
                            title: "Capitolo 2 Concluso",
                            text: "Hai strappato il controllo del vagone merci e svelato i fotogrammi del viadotto. Il treno affronta il ponte ghiacciato nel Capitolo 3!"
                          });
                        });
                      });
                    } else {
                      say([["te_valenti", "Ci hanno respinti contro i sacchi postali! Riorganizziamo il pressing e riproviamo subito."]], done);
                    }
                  });
                }
              }
            ]);
          });
        }
        say([["te_valenti", "Il tempo stringe. Il viadotto del ghiacciaio è a meno di dieci miglia."]], done);
      },

      te_morozov: (K) => {
        const s = S();
        if (s === 1) {
          return say([
            ["te_morozov", "[sistema con mano ferma gli occhiali tondi] Sapevo che sareste venuto. Quando un convoglio di questa importanza trema sui ponti, la diagnosi è sempre la stessa: veleno politico."],
            ["hero", "La chiave passe-partout è stata usata per aprire il baule diplomatico. E voi avete la lista di tutti i passeggeri della prima classe."]
          ], () => {
            ask("Come metti alle strette il Dottor Morozov?", [
              {
                label: "«Dottore, dite la verità: chi vi ha incaricato di fotografare i dispacci?»",
                big: true,
                fn: () => {
                  bond("freddezza", 15);
                  say([
                    ["te_morozov", "[sospira e ripone una provetta nel cofanetto] Non sono una spia d'azione, ragazzo. Sono solo un medico che ha debiti di gioco a Vienna."],
                    ["te_morozov", "La Contessa Elena mi ha pagato per consegnarle la chiave di riserva. Ma ciò che lei vuole non è la valigetta... è sabotare i freni del treno per impedirne l'arrivo a Ginevra!"],
                    ["te_morozov", "Andate subito alla Sala Macchine in testa al convoglio: avvertite Boris il Fuochista prima che sia troppo tardi!"]
                  ], () => {
                    setStep(2);
                    quest("te_q5", "L'Allarme di Boris", "Raggiungi la Sala Macchine in testa e parla con Boris il Fuochista.");
                    done();
                  });
                }
              },
              {
                label: "«Ispeziono la vostra valigetta medica adesso, con o senza il vostro consenso.»",
                big: true,
                fn: () => {
                  bond("sospetto", 15);
                  say([
                    ["te_morozov", "[impallidisce e si scosta dal tavolino] Calma, calma! Non c'è bisogno di modi bruschi. Troverete solo bende e morfina."],
                    ["te_morozov", "Se volete salvare il treno, il pericolo non è qui: Boris nella sala caldaie ha notato un calo di pressione anomalo. Qualcuno ha manomesso le condotte esterne!"]
                  ], () => {
                    setStep(2);
                    quest("te_q5", "L'Allarme di Boris", "Raggiungi la Sala Macchine in testa e parla con Boris il Fuochista.");
                    done();
                  });
                }
              }
            ]);
          });
        }
        say([["te_morozov", "[osserva la scacchiera] Ogni mossa sul treno ha una conseguenza mortale."]], done);
      },

      te_boris: (K) => {
        const s = S();
        if (s === 2) {
          return say([
            ["te_boris", "[sbatte la pala di ferro sul pavimento con rumore d'incudine] Chi diavolo siete?! Qui dentro la temperatura tocca i cinquanta gradi e fuori c'è l'inferno bianco!"],
            ["hero", "Morozov mi manda: c'è un sabotaggio sulle condotte del freno d'emergenza!"],
            ["te_boris", "[gli occhi gli si spalancano di rabbia sincera] Lo sapevo! Sentivo che la motrice trascinava peso morto. Quei farabutti sono tornati nel vagone bagagli per disconnettere la manichetta dell'aria compressa!"],
            ["te_boris", "Prendete questo pezzo di raccordo temprato nel mio forno: vi servirà per tenere unita la mandata. Tornate subito nel bagagliaio e spazzateli via dal convoglio!"]
          ], () => {
            setStep(3);
            quest("te_q6", "Battaglia nel Bagagliaio", "Torna nel Vagone Bagagli e affronta i sabotatori a Il Corridoio d'Acciaio.");
            done();
          });
        }
        say([["te_boris", "[asciuga il sudore col braccio fuligginoso] Il vapore tiene. Voi tenete la porta del bagagliaio!"]], done);
      }
    };

    return {
      n: N,
      title: "Capitolo 2 · L'Intrigo del Vagone Letto & La Tormenta",
      sub: "Il passe-partout in ottone, la micro-cinepresa Minox e la semifinale tra le merci",
      goal,
      start: "te_bagagliaio",
      introBg: "te_bagagliaio",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [
          ["voce", "Il Nord-Sud Star si addentra nella gola del Diavolo. Oltre i doppi vetri delle carrozze, il ghiaccio avvolge le ringhiere dei ballatoi."],
          ["voce", "Nel gelido vagone merci, tra bauli diplomatici e casse postali, l'indagine svela la trama di un complotto internazionale."]
        ];
      }
    };
  }

  boot();
})();
