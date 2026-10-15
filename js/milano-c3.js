// js/milano-c3.js - OPERAZIONE FUORIGIOCO NOIR · Capitolo 3 «Il Derby dell'Ombra»
// Domenica 14 novembre 1954: all'Arena Civica di Milano piove a dirotto.
// Cinquantamila spettatori stipati sotto gli ombrelli neri, il campo trasformato in una risaia di fango
// e la resa dei conti definitiva tra il calcio pulito e il sindacato delle scommesse clandestine.
(function () {
  "use strict";
  function boot() {
    const D = window.__milano;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    if (!D._has(2)) return setTimeout(boot, 150);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cast("mn_arbitro", { acc: ["fischietto"], name: "Arbitro Brambilla", tag: "", hair: "#334155", style: "buzz", skin: "#cbd5e1", eye: "#0f172a", bg: ["#18181b", "#cbd5e1"], shirt: "#18181b" },
      "Il direttore di gara dell'Arena Civica. Giacca nera pesante d'altri tempi, fischietto d'ottone e sguardo severo che non ammette repliche sui contrasti a gamba tesa nel fango.");

    K.cos("mn_c3", { kind: "shirt", label: "Maglia da gioco del '54 in lana pesante con colletto a lacci", val: "#0f172a", from: "Capitolo 3 di Operazione Fuorigioco Noir" });

    const goal = (s) => ({
      0: "Sei all'Arena Civica nel giorno del Derby. Parla con De Santis vicino agli spogliatoi.",
      1: "Entra nello Spogliatoio Sotterraneo e confrontati con l'Arbitro Brambilla.",
      2: "Sali in Tribuna d'Onore e raccogli l'ultimo indizio da Mara e Don Carmine.",
      3: "Tutto è pronto per il fischio d'inizio! Gioca e vinci il Derby dell'Ombra a Pedinamento Tattico!"
    }[s] || "La saga è completata. Congratulazioni!");

    const zones = {
      mn_arena: {
        region: "arena", name: "L'Arena Civica nel Fango", short: "Arena Civica '54", sub: "Cinquantamila ombrelli, riflettori tra la nebbia e fango fino alle caviglie", bg: "mn_stadio", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[4, 8], [27, 8], [15, 18]],
        areas: [[8, 8, 24, 14, "Il rettangolo verde dell'Arena trasformato in fango battente"], [0, 0, 31, 21, "Il catino storico dell'Arena Civica Napoleonica"]],
        flavor: {
          B: "La porta in legno massiccio con le reti di corda inzuppate di pioggia.",
          K: "La gradinata in pietra con migliaia di tifosi coperti da trench e cappelli borsalino.",
          A: "Il pilone d'acciaio del riflettore che getta fasci giallastri sul prato inzuppato.",
          P: "La linea di fondo tracciata a fatica con gesso fresco che si scioglie nell'acqua."
        },
        intro: [
          ["voce", "Milano, Arena Civica, domenica 14 novembre 1954. Una pioggia gelida scende senza tregua su cinquantamila ombrelli scuri."],
          ["voce", "I tacchetti di cuoio affondano nel fango. Sotto le tribune borboniche, De Santis stringe la cartella delle prove: l'ora della verità è scoccata."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "mn_desantis", at: [8, 17] }] : [{ id: "mn_desantis", at: [20, 14] }]),
          ...(s >= 3 ? [{ id: "mn_arbitro", at: [15, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 16, 30, 19, ":"); lay(15, 7, 15, 16, ":"); lay(4, 7, 27, 7, ":");
          // Spogliatoi Sotterranei (sinistra)
          house(2, 2, 8, 5, { door: [6, 6], roof: "#1e293b", wall: "#94a3b8", rr: 1, enter: { to: "mn_spogliatoio", at: [7, 9] } });
          // Tribuna d'Onore (centro)
          house(11, 2, 10, 5, { door: [16, 6], roof: "#0f172a", wall: "#cbd5e1", rr: 2, enter: { to: "mn_tribuna", at: [6, 10] } });
          // Sala Stampa e Cronisti (destra)
          house(22, 2, 8, 5, { door: [25, 6], roof: "#334155", wall: "#64748b", rr: 1, enter: "La Sala Stampa: macchine da scrivere Remington che battono all'impazzata e telefoni a bachelite." });
          put(16, 9, "A"); put(26, 17, "K"); put(6, 17, "B");
          [[9, 7], [21, 7], [12, 14]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      },
      mn_spogliatoio: {
        interior: true, region: "arena", name: "Spogliatoi Sotterranei", short: "Spogliatoi Arena", sub: "Odore di canfora, fango secco sui tacchetti e cassette di legno", bg: "mn_stadio", w: 16, h: 12, start: [7, 9], outside: ["mn_arena", 6, 7],
        act: { F: "Annusa la canfora", B: "Guarda i tacchetti", T: "Esamina la lavagna tattica", v: "Torna sul campo" },
        flavor: {
          F: "Flaconi di canfora e olio canforato per scaldare i muscoli intirizziti prima del match.",
          B: "Scarpini in cuoio pesante con tacchetti chiodati a mano dagli artigiani milanesi.",
          T: "Una lavagna d'ardesia con le marcature a uomo del Metodo disegnate a gesso bianco."
        },
        intro: [["voce", "Gli Spogliatoi Sotterranei dell'Arena Civica: volte in pietra umida e odore pungente di canfora. L'Arbitro Brambilla controlla i palloni di cuoio con uno sferometro."]],
        npcs: () => [
          { id: "mn_arbitro", at: [8, 4] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "B");
          put(3, 4, "F");
          put(12, 6, "B");
          put(3, 8, "T"); put(11, 8, "T");
        }
      },
      mn_tribuna: {
        interior: true, region: "lucciola", name: "Tribuna d'Onore", short: "Tribuna d'Onore", sub: "Poltrone in cuoio, binocoli da teatro, ombrelli bagnati e Don Carmine", bg: "mn_club", w: 16, h: 12, start: [6, 10], outside: ["mn_arena", 16, 7],
        act: { G: "Guarda dal binocolo", K: "Esamina il magnetofono", T: "Fruga nella cartella", v: "Riscendi sul prato" },
        flavor: {
          G: "Un binocolo d'ottone puntato sulle tribune opposte dove sventolano le sciarpe dei ferrovieri.",
          K: "Un registratore Geloso a nastro che cattura i cori entusiasti della folla milanese.",
          T: "Una cartella di cuoio contenente lo spartito segreto e gli ultimi accordi delle scommesse."
        },
        intro: [["voce", "La Tribuna d'Onore dell'Arena Civica: Don Carmine e Mara osservano il terreno di gioco al riparo della tettoia in ferro battuto. La tensione si taglia con un rasoio."]],
        npcs: () => [
          { id: "mn_mara", at: [8, 5] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(6, 11, "v");
          lay(2, 3, 13, 3, "G");
          put(3, 5, "K"); put(12, 5, "T");
          put(4, 8, "G"); put(11, 8, "G");
        }
      }
    };

    const talk = {
      mn_desantis(K) {
        const s = S();
        if (s === 0) {
          say([
            ["mn_desantis", "[stringe il bavero del trench mentre i goccioloni di pioggia battono sul cappello] È il momento decisivo, figliolo. L'Arena è piena fino al colmo."],
            ["hero", "Le prove raccolte sono sufficienti per fermare la combine, Commissario?"],
            ["mn_desantis", "Abbiamo i verbali dei biglietti, la valigia e i nomi dei corrotti. Ma se fermiamo la partita adesso con la polizia, scoppierà una sommossa tra cinquantamila persone."],
            ["mn_desantis", "L'unico modo per spazzare via il fango delle scommesse è batterli sul campo davanti a tutti, con una prestazione memorabile e pulita."],
            ["hero", "Scendo negli spogliatoi a parlare con l'Arbitro Brambilla!"]
          ], () => {
            bond("biglietti", 25);
            bond("fiuto", 15);
            setStep(1);
            quest("mn3_spogliatoi", "Gli Spogliatoi Sotterranei", "Raggiungi gli Spogliatoi Sotterranei e parla con l'Arbitro Brambilla.");
            done();
          });
        } else if (s === 1) {
          say([
            ["mn_desantis", "Brambilla è negli spogliatoi. Fagli capire che oggi la Questura ha gli occhi puntati su ogni fischio."]
          ], done);
        } else if (s === 2) {
          say([
            ["mn_desantis", "Mara e Don Carmine sono saliti in Tribuna d'Onore. Raccogli l'ultima confessione prima dell'ingresso in campo."]
          ], done);
        } else {
          say([
            ["mn_desantis", "È l'ora del Derby dell'Ombra! Entra in campo e dimostra a tutta Milano cos'è il vero calcio!"]
          ], done);
        }
      },

      mn_arbitro(K) {
        const s = S();
        if (s === 1) {
          say([
            ["mn_arbitro", "[fa ruotare il fischietto tra le dita nodose guardando il Campione con severità] Tu sei il giovane di cui parla tutta Porta Ticinese. Cosa vuoi prima del derby?"],
            ["hero", "Voglio che oggi si fischi secondo le regole del gioco del calcio, signor Brambilla. Niente fischi a comando e niente occhi chiusi sul fango."],
            ["mn_arbitro", "[abbassa lo sguardo per un istante, poi sospira raddrizzando la schiena] Ho arbitrato trecento partite in questa regione, ragazzo. Non permetterò a nessun allibratore di sporcare la mia divisa."],
            ["mn_arbitro", "Oggi all'Arena Civica chi gioca a pallone troverà un arbitro imparziale. Chi cerca scorciatoie troverà il cartellino di espulsione!"]
          ], () => {
            bond("biglietti", 30);
            bond("fiuto", 20);
            setStep(2);
            quest("mn3_tribuna", "La Tribuna d'Onore", "Sali in Tribuna d'Onore e confrontati con Mara e Don Carmine.");
            done();
          });
        } else {
          say([
            ["mn_arbitro", "Pallone al centro e pronti al fischio! Che vinca la squadra migliore!"]
          ], done);
        }
      },

      mn_mara(K) {
        const s = S();
        if (s === 2) {
          say([
            ["mn_mara", "[avvolta in una sciarpa di seta sotto la tettoia] Senti il boato della folla, ragazzo? Oggi Milano non pensa alle fabbriche, pensa solo al derby."],
            ["hero", "Questo boato appartiene alla gente onesta, Mara. Don Carmine ha perso la sua scommessa."],
            ["mn_mara", "[gli porge uno spartito piegato in quattro] Questo è per te. L'ultima partitura con i dettagli dell'accordo segreto."],
            ["mn_mara", "Volevo solo che la mia voce non fosse dimenticata. Ora entra in campo e fa' cantare quel pallone di cuoio."]
          ], () => {
            K.interroga("spartito", { biglietti: 50, fiuto: 30, sospetto: 20 }, () => {
              setStep(3);
              quest("mn3_derby", "Il Derby dell'Ombra", "Scendi sul campo dell'Arena Civica e trionfa nel Derby dell'Ombra!");
              done();
            });
          });
        } else if (s === 3) {
          say([
            ["mn_mara", "Il fischietto dell'arbitro sta per risuonare! Entra in campo!"]
          ], () => {
            ask("È il momento del Derby dell'Ombra '54 all'Arena Civica!", [
              {
                label: "⚽ Gioca la Finale a Pedinamento Tattico!",
                fn: () => {
                  K.ownMatch(window.__pedinamento.start, {
                    opp: "I Diavoli dell'Ombra '54",
                    onDone: (res) => {
                      if (res.win) {
                        say([
                          ["mn_desantis", "[esulta a pugni chiusi mentre l'Arena esplode in un tripudio di applausi e cori] Fischio finale! Trionfo assoluto nel fango di Milano!"],
                          ["mn_desantis", "I cinquantamila dell'Arena Civica urlano il tuo nome! La combine è stata sgominata alla luce del sole!"]
                        ], () => {
                          // Scelta del finale
                          ask("Come si conclude la tua indagine nella Milano del '54?", [
                            {
                              label: "⚖️ La Giustizia dei Bastioni (Consegna il dossier alla Questura)",
                              fn: () => {
                                K.end("legge");
                              }
                            },
                            {
                              label: "🤝 Il Patto della Lucciola (Salva la polisportiva dei ferrovieri)",
                              fn: () => {
                                K.end("riscatto");
                              }
                            },
                            {
                              label: "🌧️ Il Passo nella Nebbia (Allontanati sui binari verso una nuova sfida)",
                              fn: () => {
                                K.end("solitario");
                              }
                            },
                            {
                              label: "🕵️ Il Dossier Segreto del '54 (Svela la verità e ottieni il Borsalino d'Oro!)",
                              fn: () => {
                                K.cos("borsalino", { kind: "style", label: "Cappello Borsalino Noir d'Oro", val: "borsalino", from: "Finale Segreto di Operazione Fuorigioco Noir" });
                                K.end("verita");
                              }
                            }
                          ]);
                        });
                      } else {
                        say([
                          ["mn_desantis", "La nebbia e il fango hanno ingannato la nostra difesa sul filo di lana. Riprova, anticipa le loro traiettorie e chiudi la partita!"]
                        ], done);
                      }
                    }
                  });
                }
              },
              { label: "Preparati ancora", fn: done }
            ]);
          });
        } else {
          say([
            ["mn_mara", "Che partita memorabile... Milano ricorderà questo derby per cinquant'anni."]
          ], done);
        }
      }
    };

    return {
      n: N,
      title: "Il Derby dell'Ombra",
      sub: "L'Arena Civica nel fango, cinquantamila ombrelli e il trionfo nella nebbia",
      goal: () => goal(S()),
      start: "mn_arena",
      introBg: "mn_stadio",
      zones,
      talk,
      intro: [
        ["voce", "Domenica 14 novembre 1954. All'Arena Civica di Milano si respira l'odore acre del fumo dei bracieri e della terra bagnata."],
        ["voce", "Cinquantamila tifosi sfidano la pioggia per il derby più atteso dell'anno. La nebbia cala sui pali, e la partita ha inizio."]
      ]
    };
  }

  boot();
})();
