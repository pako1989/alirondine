// js/treno-c3.js - L'ESPRESSO DELLE OMBRE · Capitolo 3 «La Notte sul Viadotto & Il Trionfo a Mezzanotte»
// Il bivio prima del viadotto ghiacciato, il vagone panoramico di coda in bilico sulla gola,
// la finalissima forzata a «Il Corridoio d'Acciaio» contro l'élite delle spie di frontiera,
// e lo sblocco dei quattro finali (Diplomazia, Verità, Ombre, Gran Maestro Segreto).
(function () {
  "use strict";
  function boot() {
    const D = window.__treno;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cos("te_c3", { kind: "shirt", label: "Trench elegante da comandante delle ombre", val: "#0f172a", from: "Capitolo 3 de L'Espresso delle Ombre" });
    K.lore("l_viadotto", { t: "Il Viadotto dell'Aquila", d: "Ponte in ghisa a strapiombo su un abisso ghiacciato a duemila metri di quota: l'ultimo ostacolo prima della Svizzera." });

    const goal = (s) => ({
      0: "Il convoglio sta transitando sul viadotto ghiacciato! Raggiungi il Tetto della Carrozza.",
      1: "Hai recuperato lo Schema dello Sgancio. Raggiungi il Vagone Panoramico di Coda.",
      2: "Confronto finale con la Contessa Elena: difendi i documenti e la sicurezza del convoglio!",
      3: "Finalissima a Il Corridoio d'Acciaio nel Vagone Panoramico contro La Rete delle Ombre!"
    }[s] || "La saga de L'Espresso delle Ombre è completata!");

    const zones = {
      te_tetto: {
        region: "stazione", name: "Tetto della Carrozza sul Viadotto", short: "Tetto sul Viadotto", sub: "Gelo alpino, bufere di neve e la vertigine del ponte sospeso", bg: "te_tetto", time: "notte",
        w: 32, h: 22, start: [6, 11], items: [[4, 6], [28, 6], [16, 16]],
        areas: [[0, 0, 31, 21, "Il tetto curvato in lamiera del treno che attraversa il viadotto ghiacciato nella tormenta"]],
        flavor: {
          V: "Il vuoto della gola innevata: a centinaia di metri sotto i binari, le acque del torrente sono lastre di ghiaccio azzurro.",
          F: "I comignoli e gli sfiatatoi della caldaia che soffiano vapore candido nella notte.",
          P: "La scaletta in ferro che ridiscende verso l'interno del convoglio.",
          s: "La botola di sicurezza che porta al vagone panoramico di coda."
        },
        intro: [
          ["voce", "Sul tetto del convoglio il vento toglie il respiro: la neve cade orizzontale come aghi di vetro."],
          ["voce", "Sotto le rotaie cigolano le travature d'acciaio del viadotto dell'Aquila. Una figura col bavero rialzato cerca di forzare la manichetta dello sgancio."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "te_klaus", at: [18, 11] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Struttura del tetto metallico
          lay(1, 8, 30, 14, ":");
          for (let x = 4; x <= 28; x += 5) {
            put(x, 7, "F"); put(x, 15, "F");
          }
          put(5, 11, "P");
          // Botola di discesa al vagone panoramico (est)
          house(27, 9, 3, 4, { door: [28, 11], roof: "#0f172a", wall: "#334155", rr: 1, enter: { to: "te_panoramico", at: [4, 11] } });
        }
      },
      te_panoramico: {
        region: "vagone", name: "Vagone Panoramico di Coda", short: "Vagone Panoramico", sub: "Vetrate a cupola, divani circolari, bufera a 360° e la leva dello sgancio", bg: "te_corridoio", w: 32, h: 22, start: [4, 11], outside: ["te_tetto", 26, 11],
        act: { V: "Guarda le vette alpine", P: "Siediti sul divano circolare", K: "Ispeziona la leva dello sgancio", s: "Torna alla botola del tetto" },
        flavor: {
          V: "La cupola trasparente della carrozza: la luna piena illumina le vette aguzze delle Alpi.",
          P: "I divanetti in pelle trapuntata dove la Contessa Elena attende la mezzanotte.",
          K: "La leva d'emergenza del carrello di coda: collegata ai tiranti dello sgancio."
        },
        intro: [["voce", "Il salone panoramico di coda: il culmine del lusso del Nord-Sud Star. Le vetrate semicircolari offrono uno spettacolo maestoso e terribile della bufera."]],
        npcs: (s) => [
          ...(s >= 1 ? [{ id: "te_elena", at: [22, 11] }] : []),
          ...(s >= 2 ? [{ id: "te_valenti", at: [12, 11] }] : [])
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "+");
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Finestrini a tutto tondo sul fondo est
          for (let y = 3; y <= 18; y += 3) put(30, y, "V");
          for (let x = 4; x <= 26; x += 4) { put(x, 1, "V"); put(x, 20, "V"); }
          // Pavimento in parquet e moquette blu
          lay(1, 9, 29, 13, ":");
          put(20, 6, "P"); put(24, 6, "P"); put(20, 16, "P"); put(24, 16, "P");
          put(28, 11, "K");
          put(2, 11, "s");
        }
      },
      te_stazione: {
        region: "stazione", name: "Stazione di Frontiera di San Bernardo", short: "San Bernardo", sub: "Banchine innevate, fari a gas, tricolori e arrivo trionfale", bg: "te_stazione", time: "notte",
        w: 32, h: 22, start: [6, 14], items: [[2, 6], [29, 6], [16, 17]],
        areas: [[0, 0, 31, 21, "La stazione alpina di confine illuminata a giorno per la cerimonia diplomatica"]],
        flavor: {
          V: "Le banchine spazzate dalla neve dove le guardie d'onore attendono a sciabola sguainata.",
          F: "Il grande orologio della stazione che segna esattamente la mezzanotte.",
          P: "La tribuna d'onore addobbata per la firma dell'accordo sportivo."
        },
        intro: [["voce", "Stazione di San Bernardo: il convoglio entra maestoso sotto le arcate di ferro e vetro soffiando vapore trionfale sulla neve fresca."]],
        npcs: () => [
          { id: "te_valenti", at: [14, 14] },
          { id: "te_klaus", at: [18, 14] },
          { id: "te_boris", at: [22, 14] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 12, 30, 16, ":");
          // Pensiline
          for (let x = 4; x <= 28; x += 6) { put(x, 8, "V"); put(x, 18, "V"); }
          put(16, 5, "F");
        }
      }
    };

    const talk = {
      te_klaus: (K) => {
        const s = S();
        if (s === 0) {
          return say([
            ["te_klaus", "[reggendosi ai corrimano metallici mentre la neve gli sferza il viso] Sei salito fin quassù! Un minuto in più e il carrello di coda sarebbe volato nell'abisso!"],
            ["hero", "Ho visto qualcuno armeggiare con i raccordi pneumatici!"],
            ["te_klaus", "[ti consegna un foglio spiegazzato strappato alla tormenta] Ecco: ho strappato questo schema di sgancio dalla tasca del sabotatore prima che scivolasse nella botola. Riguarda l'ultimo vagone panoramico. Scendi subito lì dentro!"]
          ], () => {
            K.dossier("spartito", { microfilm: 1, freddezza: 10 }, () => {
              setStep(1);
              quest("te_q7", "La Resa dei Conti nel Panoramico", "Entra nel Vagone Panoramico di Coda e affronta la Contessa Elena.");
              done();
            });
          });
        }
        say([["te_klaus", "Il viadotto è alle nostre spalle. Siamo salvi se vinciamo nel salone!"]], done);
      },

      te_elena: (K) => {
        const s = S();
        if (s === 1 || s === 2) {
          return say([
            ["te_elena", "[in piedi davanti alle grandi vetrate notturne, con un sorriso amaro e fiero] Sei arrivato fin qui, campione di Borgo Marino. Hai superato le carrozze, i bauli e la tempesta."],
            ["hero", "La recita è finita, Contessa. Abbiamo la micro-cinepresa, il cifrario e lo schema dello sgancio."],
            ["te_elena", "[allarga le braccia avvolte nella pelliccia] Tu credi che si tratti solo di una valigetta di cuoio? Quei documenti contengono le tattiche e le formazioni che avrebbero sottomesso il calcio della nostra nazione a un trattato truccato!"],
            ["te_elena", "Se proprio vuoi consegnare quei fogli alla diplomazia ufficiale, dovrai battere la mia squadra d'élite sul parquet di questo vagone. A mezzanotte, il treno tocca la frontiera: o vinci tu, o il carrello si sgancia!"]
          ], () => {
            setStep(3);
            quest("te_q8", "La Finalissima sul Viadotto", "Vinci la finale a Il Corridoio d'Acciaio contro La Rete delle Ombre nel Vagone Panoramico.");
            done();
          });
        }
        say([["te_elena", "[guarda le lancette dell'orologio] La mezzanotte non aspetta nessuno."]], done);
      },

      te_valenti: (K) => {
        const s = S();
        if (s === 3) {
          return say([
            ["te_valenti", "[fa il suo ingresso nella carrozza panoramica con il pallone d'acciaio tra le mani] Sono qui al tuo fianco, ragazzo. L'intera federazione e i ministri di Ginevra attendono l'esito di questa notte."],
            ["hero", "Nessuno sgancerà questo vagone. Facciamo valere la legge del campo!"]
          ], () => {
            ask("Inizia la Finalissima a Il Corridoio d'Acciaio?", [
              {
                label: "Fischio d'inizio della Battaglia sul Viadotto! ▸",
                fn: () => {
                  K.corridoioMatch({
                    homeTeam: "Agenti del Nord-Sud Star",
                    awayTeam: "La Rete delle Ombre",
                    targetGoals: 3
                  }, (r) => {
                    if (r && r.win) {
                      const cleanSheet = r.b === 0;
                      const allMicro = K.stat("microfilm") >= 4;

                      say([
                        ["te_valenti", "[solleva il braccio al cielo mentre le ruote frenano rumorosamente sui binari di frontiera] GOL DECISIVO! Palla nell'incrocio del vagone panoramico al centesimo metro dal confine!"],
                        ["te_elena", "[abbassa il capo con nobiltà d'altri tempi] Una traiettoria di pura precisione matematica. Il vostro talento ha sconfitto la nostra rete."]
                      ], () => {
                        // Bivio finale
                        ask("Quale destino scegli per i documenti e l'onore del Nord-Sud Star?", [
                          {
                            label: "«Consegno la valigetta alla diplomazia: la partita ufficiale di Ginevra si giocherà!»",
                            big: true,
                            fn: () => {
                              K.end("diplomazia");
                              done();
                            }
                          },
                          {
                            label: "«Rendo pubbliche le prove: la verità sui sabotatori scuoterà tutta Europa!»",
                            big: true,
                            fn: () => {
                              K.end("verita");
                              done();
                            }
                          },
                          {
                            label: "«Trattengo i dossier: creeremo una lega segreta che proteggerà i giovani talenti.»",
                            big: true,
                            fn: () => {
                              K.end("ombre");
                              done();
                            }
                          },
                          ...(allMicro && cleanSheet ? [{
                            label: "👑 «Rivendico il titolo di Gran Maestro delle Ombre!» (Segreto)",
                            big: true,
                            fn: () => {
                              K.end("maestro");
                              done();
                            }
                          }] : [])
                        ]);
                      });
                    } else {
                      say([["te_valenti", "Hanno bloccato l'ultimo tiro sulla linea! Riprendiamo fiato e riproviamo prima della stazione."]], done);
                    }
                  });
                }
              }
            ]);
          });
        }
        say([["te_valenti", "La stazione di San Bernardo è a vista d'occhio."]], done);
      },

      te_boris: (K) => {
        say([["te_boris", "[appoggiato alla motrice con un sorriso da gigante] La pressione è al massimo, i binari sono sgombri e il vapore canta vittoria!"]], done);
      }
    };

    return {
      n: N,
      title: "Capitolo 3 · La Notte sul Viadotto & Il Trionfo a Mezzanotte",
      sub: "Il tetto nella tormenta, il vagone panoramico e la finalissima a Il Corridoio d'Acciaio",
      goal,
      start: "te_tetto",
      introBg: "te_tetto",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [
          ["voce", "Il Nord-Sud Star affronta l'ardita campata del viadotto dell'Aquila. Sotto le rotaie, un precipizio di roccia e neve."],
          ["voce", "Nel vagone panoramico di coda, la Contessa Elena attende la mezzanotte per la mossa finale dell'intrigo."]
        ];
      }
    };
  }

  boot();
})();
