// js/milano-c2.js - OPERAZIONE FUORIGIOCO NOIR · Capitolo 2 «La Lucciola e il Doppiogioco»
// Nel cuore di Milano, dietro l'insegna viola del night club «La Lucciola».
// Tra fumo di sigaretta, canzoni al pianoforte e tavoli da gioco clandestini,
// il Campione affronta "La Bionda" Mara e svela il piano di Don Carmine per comprare il derby.
(function () {
  "use strict";
  function boot() {
    const D = window.__milano;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    if (!D._has(1)) return setTimeout(boot, 150);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("mn_mara", { acc: ["fiore"], name: "«La Bionda» Mara", tag: "gold", hair: "#e8d08a", style: "wavy", skin: "#fdf2f8", eye: "#2563eb", bg: ["#581c87", "#fef08a"], shirt: "#581c87" },
      "La regina della notte milanese. Voce vellutata al microfono della Lucciola e mente lucidissima nelle trattative sottobanco: «Il calcio è come il jazz, tesoro: se non conosci il ritmo dei soldi, steccano tutti».");

    K.cast("mn_carmine", { beard: "baffi", acc: ["occhiali", "berretto"], name: "Don Carmine", tag: "gray", hair: "#94a3b8", style: "slick", skin: "#e2e8f0", eye: "#0f172a", bg: ["#0f172a", "#334155"], shirt: "#0f172a" },
      "Il 'Presidente Ombra' dei Bastioni. Elegante, impassibile, muove capitali e influenza arbitri dall'angolo più riservato del club senza mai sporcarsi le scarpe lucide.");

    K.cos("mn_c2", { kind: "shirt", label: "Cravatta di seta e giacca gessata da sera", val: "#581c87", from: "Capitolo 2 di Operazione Fuorigioco Noir" });

    const goal = (s) => ({
      0: "Sei entrato al night club La Lucciola. Parla con Mara vicino al pianoforte.",
      1: "Trova la valigia delle scommesse nel Camerino di Mara dietro le quinte.",
      2: "Raggiungi il Vicolo delle Bische e affronta Don Carmine.",
      3: "I Tirapiedi di Don Carmine bloccano l'uscita! Battili a Pedinamento Tattico!"
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      mn_lucciola: {
        region: "lucciola", name: "Night Club La Lucciola", short: "Club La Lucciola", sub: "Velluto bordeaux, profumo di lavanda, pianoforte e segreti", bg: "mn_club", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[3, 8], [28, 8], [15, 18]],
        areas: [[10, 8, 22, 14, "La pista da ballo circondata da tavoli riservati"], [0, 0, 31, 21, "Il salone principale della Lucciola"]],
        flavor: {
          B: "Il pianoforte a coda nero con le note della canzone 'Nustalgia de Milan'.",
          K: "La vetrina dei liquori francesi e dei boccali di cristallo molato.",
          A: "Il microfono a nastro d'argento con il rossetto ancora impresso sulla griglia.",
          P: "Una poltroncina in velluto rosso damascato riservata ai clienti di riguardo."
        },
        intro: [
          ["voce", "Night Club La Lucciola. Tra le volute di fumo azzurrino e le note ovattate del pianoforte, Mara canta mentre gli allibratori contano mazzette nel semibuio."],
          ["voce", "Il Commissario De Santis ti ha aperto la porta sul retro: è qui che si gioca la vera partita prima del derby."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "mn_mara", at: [8, 17] }] : [{ id: "mn_mara", at: [20, 14] }]),
          ...(s >= 2 ? [{ id: "mn_carmine", at: [15, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 16, 30, 19, ":"); lay(15, 7, 15, 16, ":"); lay(4, 7, 27, 7, ":");
          // Camerino di Mara (sinistra)
          house(2, 2, 8, 5, { door: [6, 6], roof: "#581c87", wall: "#fbcfe8", rr: 1, enter: { to: "mn_camerino", at: [7, 9] } });
          // Vicolo delle Bische (centro)
          house(11, 2, 10, 5, { door: [16, 6], roof: "#1e1b4b", wall: "#cbd5e1", rr: 2, enter: { to: "mn_vicolo", at: [6, 10] } });
          // Saletta Privata Don Carmine (destra)
          house(22, 2, 8, 5, { door: [25, 6], roof: "#0f172a", wall: "#334155", rr: 1, enter: "La Saletta Privata: un tavolo da poker verde con posaceneri d'argento e fiche d'avorio." });
          put(16, 9, "A"); put(26, 17, "K"); put(6, 17, "B");
          [[9, 7], [21, 7], [12, 14]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      },
      mn_camerino: {
        interior: true, region: "lucciola", name: "Camerino di Mara", short: "Camerino Segreto", sub: "Specchiere con lampadine calde, cipria, pellicce e una valigia chiusa", bg: "mn_club", w: 16, h: 12, start: [7, 9], outside: ["mn_lucciola", 6, 7],
        act: { F: "Fruga nello specchio", B: "Apri la valigia in fibra", T: "Esamina il baule", v: "Torna nel club" },
        flavor: {
          F: "Una specchiera con lampadine tonde e biglietti d'ammiratori della Milano bene.",
          B: "Una valigia in fibra marrone con bordi d'ottone e mazzette di denaro delle scommesse.",
          T: "Un baule da viaggio colmo di stole di volpe e scarpe col tacco per il cabaret."
        },
        intro: [["voce", "Il Camerino di Mara: l'aria profuma di talco, cipria e profumo francese. Sotto il divano spicca una valigia marrone con la fibbia d'ottone socchiusa."]],
        npcs: () => [
          { id: "mn_mara", at: [8, 4] }
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
      mn_vicolo: {
        interior: true, region: "bastioni", name: "Vicolo delle Bische", short: "Vicolo Cieco", sub: "Pozzanghere nere, muri di mattoni sbrecciati e guardaspalle", bg: "mn_titolo", w: 16, h: 12, start: [6, 10], outside: ["mn_lucciola", 16, 7],
        act: { G: "Controlla le cassette", K: "Guarda il portone", T: "Esamina i barili", v: "Rientra nel club" },
        flavor: {
          G: "Cassette d'orto vuote utilizzate per nascondere le fiches clandestine.",
          K: "Un pesante portone di ferro sprangato con uno spioncino a scorrimento.",
          T: "Barili di catrame che stillano gocce nere nelle pozzanghere di pioggia."
        },
        intro: [["voce", "Il Vicolo delle Bische: l'umidità cola lungo i muri scrostati. Sotto il gocciolio della grondaia, Don Carmine ti attende a braccia conserte con fare da gentiluomo."]],
        npcs: () => [
          { id: "mn_carmine", at: [8, 5] }
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
      mn_mara(K) {
        const s = S();
        if (s === 0) {
          say([
            ["mn_mara", "[aggiusta il bocchino d'avorio e soffia un anello di fumo con un sorriso enigmatico] Ti sei fatto strada fino a me, ragazzo del campetto. De Santis ti manda a fare il lavoro sporco?"],
            ["hero", "Sono qui per salvare il derby, Mara. I tifosi pagano il biglietto per vedere una sfida vera, non una recita comprata a tavolino."],
            ["mn_mara", "Che idealista ingenuo... Pensi che chi corre nel fango a novembre lo faccia per la gloria? Il pallone muove fabbriche e cuori, ma sono i quattrini a pagare la legna d'inverno."],
            ["mn_mara", "Se vuoi davvero capire la partita di domenica, vai nel mio camerino. Guarda dentro la valigia in fibra sotto lo specchio."],
            ["mn_mara", "Troverai i nomi di chi ha firmato per perdere. Poi decidi se vuoi essere complice o fare l'eroe solitario."]
          ], () => {
            bond("biglietti", 20);
            bond("fiuto", 15);
            setStep(1);
            quest("mn2_camerino", "Il camerino di Mara", "Entra nel Camerino di Mara ed esamina la valigia delle scommesse.");
            done();
          });
        } else if (s === 1) {
          say([
            ["mn_mara", "[indica il divanetto di velluto con lo sguardo] La valigia è lì, ragazzo. Apri la fibbia d'ottone e leggi il verbale."]
          ], () => {
            K.interroga("valigia", { biglietti: 40, fiuto: 20, sospetto: 20 }, () => {
              say([
                ["hero", "C'è la firma di Don Carmine su ogni ricevuta di pagamento. È lui il burattinaio!"],
                ["mn_mara", "Don Carmine è nel vicolo sul retro della bisca. Sta distribuendo gli ultimi anticipi. Se vai da lui, vacci a testa alta."]
              ], () => {
                setStep(2);
                quest("mn2_vicolo", "Il Vicolo delle Bische", "Raggiungi il Vicolo delle Bische e parla con Don Carmine.");
                done();
              });
            });
          });
        } else {
          say([
            ["mn_mara", "La partita dell'Arena Civica deciderà il destino di tutti noi. Gioca pulito se ne hai il coraggio."]
          ], done);
        }
      },

      mn_carmine(K) {
        const s = S();
        if (s === 2) {
          say([
            ["mn_carmine", "[fa oscillare un orologio da taschino d'oro battuto con voce calma e profonda] Tu devi essere il centravanti che mette il naso dove volano solo i corvi."],
            ["hero", "Don Carmine. Abbiamo i biglietti falsi, i registri delle quote e la valigia con le mazzette."],
            ["mn_carmine", "Pensi che a me importi dei soldi? Questa città ha bisogno d'ordine. Se il derby finisce in pareggio concordato, nessuno scende in piazza, gli operai tornano alle fabbriche e tutti sono contenti."],
            ["hero", "Il calcio è passione e lealtà, Don Carmine. La gente sugli spalti merita una partita vera."],
            ["mn_carmine", "[stringe la presa sul bastone d'ebano] Belle parole da oratorio. Ma i miei ragazzi dell'Arena Civica non sono d'accordo. Se vuoi che il derby si giochi regolarmente, dovrai superare i miei difensori!"]
          ], () => {
            K.interroga("fischietto", { biglietti: 50, fiuto: 25, sospetto: 20 }, () => {
              setStep(3);
              quest("mn2_tirapiedi", "I Tirapiedi di Don Carmine", "Sconfiggi i Tirapiedi di Don Carmine a Pedinamento Tattico!");
              done();
            });
          });
        } else if (s === 3) {
          say([
            ["mn_carmine", "I miei uomini sono pronti nel fango. Vediamo se la tua classe vale più della mia organizzazione!"]
          ], () => {
            ask("Affronti i Tirapiedi di Don Carmine nella sfida tattica?", [
              {
                label: "⚽ Sfida a Pedinamento Tattico!",
                fn: () => {
                  K.ownMatch(window.__pedinamento.start, {
                    opp: "Tirapiedi di Don Carmine",
                    onDone: (res) => {
                      if (res.win) {
                        say([
                          ["mn_carmine", "[accenna un inchino rispettoso] Impressionante. Hai anticipato i miei uomini leggendo ogni linea di passaggio come una scacchiera."],
                          ["mn_carmine", "Va bene, giovanotto. Domenica all'Arena Civica non ci saranno trucchi. Sarà il campo a decidere chi merita la gloria nella nebbia."],
                          ["hero", "Ci vediamo all'Arena Civica, Don Carmine!"]
                        ], () => {
                          finishChapter("Capitolo 2 completato! È il momento del gran finale all'Arena Civica!");
                        });
                      } else {
                        say([
                          ["mn_carmine", "Te l'avevo detto. L'organizzazione batte sempre l'estro individuale. Riprova se vuoi avere voce in capitolo!"]
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
            ["mn_carmine", "Parleremo dopo la finale dell'Arena Civica, se ne uscirai tutto intero."]
          ], done);
        }
      }
    };

    return {
      n: N,
      title: "La Lucciola e il Doppiogioco",
      sub: "Il night club, la valigia delle scommesse e il patto con Don Carmine",
      goal: () => goal(S()),
      start: "mn_lucciola",
      introBg: "mn_club",
      zones,
      talk,
      intro: [
        ["voce", "Milano, notte inoltrata. Dietro le vetrate appannate del night club La Lucciola risuonano le note sinuose di un pianoforte a coda."],
        ["voce", "Mentre la nebbia si addensa fuori, all'interno si muovono le fila della più grande combine calcistica dell'autunno 1954."]
      ]
    };
  }

  boot();
})();
