// js/falsari-c1.js — «I FALSARI DELLA COPPA» · Capitolo 1: Oro, Piombo e Segatura
// Il ritorno della Lente e la minaccia delle ruspe.
// Infiltrazione notturna nel Palazzo Municipale e rilievo in cera della Coppa del 1934.
(function () {
  "use strict";

  function boot() {
    const E = window.__falsariCore;
    if (!E || !E.api || !E.api.addChapter || !window.__falsariH || !window.__falsariBanco) {
      return setTimeout(boot, 100);
    }
    E.api.addChapter(chapter1);
  }

  function chapter1(K) {
    const { setStep, quest, F } = K;
    const H = window.__falsariH(K);
    const { say, done, ask, wask } = H;
    const N = 1;
    const S = () => K.stepOf(N);

    H.people();

    K.cos("fc_c1", {
      kind: "shirt",
      label: "Gilet da Restauratore d'Epoca",
      val: "#78350f",
      from: "Capitolo 1 de I Falsari della Coppa"
    });

    K.lore("l_coppa1934", {
      t: "La Coppa del 1934",
      d: "Primo trofeo ufficiale vinto dalla Rondine nel campionato regionale d'anteguerra. Fusa fondendo cannoni e medaglie donati dagli operai del porto."
    });
    K.lore("l_morosini", {
      t: "Contessa Morosini",
      d: "Speculatrice immobiliare e collezionista senza scrupoli. Ha acquistato i debiti del vecchio club per radere al suolo lo stadio e costruire un centro commerciale."
    });
    K.lore("l_arturo", {
      t: "La Lente di Arturo",
      d: "Arturo Silvestri lavora l'oro da oltre cinquant'anni. Riconosce una lega dall'odore e una saldatura falsa a occhi chiusi."
    });

    const goal = (s) => ({
      0: "Parla con Valerio Ronchi in Piazza della Stazione vicino alla bacheca.",
      1: "Entra nella Bottega Silvestri, parla con Arturo e solleva l'asse del pavimento.",
      2: "Raggiungi Gina al Bar Centrale per farti consegnare la chiave del Municipio.",
      3: "Entra nel Palazzo Municipale, raggiungi la Sala dei Trofei e prendi il calco in cera.",
      4: "Affronta il Maresciallo De Santis prima di uscire dalla Sala dei Trofei.",
      5: "Riporta il calco in cera ad Arturo nella Bottega Silvestri per chiudere il piano.",
      6: "Il Capitolo 1 è completato."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      setStep(N, 6);
      F.set("fa_c1_done", true);
      K.reward("fa_c1", { coins: 90, cos: "fc_c1" });
      K.finishChapter(N, "ok");
      K.scene([
        ["fc_arturo", "[furbo] Guarda quest'impronta sotto la lente... La rondine ha le ali aperte su una corona d'alloro e la data 1934 cesellata a bulino."],
        ["fc_valerio", "[felice] È perfetta, Arturo! Se riusciamo a fondere una copia identica, lo stadio è salvo."],
        ["fc_arturo", "[serio] Non cantare vittoria, stopper. C'è un problema grosso: la lega non è ottone comune. È bronzo pesante da fonderia navale."],
        ["fc_arturo", "Nel Capitolo 2 dovremo procurarci zolfo, acidi e trenta chili di metallo bellico senza farci pizzicare."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>⚖️ Integrità ${K.stat("integrita")} · 🦊 Furbizia ${K.stat("furbizia")} · 🏆 Calco d'epoca acquisito!`],
        ["voce", "Il Capitolo 2 ti aspetta: fornaci clandestine sul molo e la chimica del falso d'autore."]
      ], () => K.openMain(), "fa_titolo");
    }

    const zones = {
      fa_piazza: {
        region: "piazza",
        name: "Piazza della Stazione",
        short: "Piazza",
        sub: "Borgo di Rondine · 1984",
        bg: "fa_titolo",
        w: 32,
        h: 22,
        start: [16, 14],
        act: {
          q: "Entra",
          U: "Esamina il tavolo",
          Z: "Leggi il manifesto",
          P: "Bacheca avvisi"
        },
        flavor: {
          "16,11": "La bacheca municipale espone il manifesto dell'asta giudiziaria con il sigillo della contessa Morosini.",
          "8,10": "Un tavolino da caffè con una tazzina fumante e il quotidiano sportivo aperto sui risultati di ieri."
        },
        items: [
          [10, 12, "Frammento di Rame"],
          [28, 11, "Frammento di Rame"]
        ],
        build(L) {
          // Fondo in ciottoli di piazza
          L.lay(0, 0, 31, 21, ".");

          // Muro perimetrale a nord con binari e stazione
          L.lay(0, 0, 31, 2, "W");
          L.lay(12, 1, 19, 2, "S"); // Stazione

          // Bottega Silvestri a nord-est
          L.house(20, 3, 7, 4, {
            door: [23, 6],
            enter: { to: "fa_bottega", at: [8, 11] }
          });

          // Bar Centrale a nord-ovest
          L.house(4, 4, 7, 4, {
            door: [7, 7],
            enter: "Bar Centrale: Gina sta asciugando i bicchieri col canovaccio dietro il bancone di rame."
          });

          // Tavolini fuori dal bar
          L.put(7, 9, "."); L.put(8, 9, "."); L.put(7, 10, ".");

          // Palazzo Municipale a sud-est con scalinata
          L.house(18, 13, 9, 6, {
            door: [22, 18],
            enter: (K) => {
              if (K.stepOf(1) < 3 && !K.F.get("fc_chiave")) {
                say("voce", "Il portone in ferro battuto del Municipio è sprangato da una pesante catena. Serve la chiave di servizio.");
                return done();
              }
              K.go("fa_sala_trofei", 7, 11);
            }
          });

          // Aiuole, fontana e panchine
          L.lay(3, 14, 8, 18, "G");
          L.put(5, 16, "F"); // fontanella
          L.lay(11, 14, 11, 18, "T"); // alberi
          L.put(16, 18, "P"); // lampione
          L.put(28, 18, "P");
        },
        npcs(step, K) {
          const list = [];
          // Valerio sempre presente vicino alla bacheca
          list.push({ id: "fc_valerio", at: [16, 12] });
          // Gina fuori dal bar
          list.push({ id: "fc_gina", at: [8, 8] });
          return list;
        }
      },

      fa_bottega: {
        interior: true,
        outside: ["fa_piazza", 23, 7],
        region: "bottega",
        name: "Bottega Silvestri",
        short: "Bottega",
        sub: "Oreficeria & Restauro",
        bg: "fa_bottega_bg",
        w: 16,
        h: 14,
        start: [8, 11],
        act: {
          q: "Esci nella piazza",
          U: "Solleva l'asse",
          B: "Esamina il banco",
          Y: "Usa la bilancia",
          Z: "Scaffale reagenti"
        },
        loot: {
          "4,8": {
            id: "fa_lente",
            text: "Hai sollevato l'asse sconnessa del pavimento: dentro il doppio fondo trovi la Lente d'Argento di Arturo e un Calibro a Corsoio!",
            empty: "Il nascondiglio sotto l'asse è vuoto."
          }
        },
        build(L) {
          // Pareti in legno scuro
          L.lay(0, 0, 15, 0, "W");
          L.lay(0, 0, 0, 13, "W");
          L.lay(15, 0, 15, 13, "W");
          L.lay(0, 13, 15, 13, "W");

          // Pavimento a doghe U
          L.lay(1, 1, 14, 12, "U");

          // Porta di uscita
          L.put(8, 13, ".");

          // Banco da lavoro e bilancia
          L.lay(6, 3, 10, 3, "B");
          L.put(11, 3, "Y"); // bilancia
          L.lay(2, 2, 4, 2, "Z"); // scaffali
          L.lay(12, 5, 14, 5, "Z");

          // Focolare / crogiolo
          L.put(2, 5, "B");
        },
        npcs(step, K) {
          return [{ id: "fc_arturo", at: [8, 4] }];
        }
      },

      fa_sala_trofei: {
        interior: true,
        outside: ["fa_piazza", 22, 19],
        region: "municipio",
        name: "Sala dei Trofei",
        short: "Sala Trofei",
        sub: "Palazzo Civico di Rondine",
        bg: "fa_trofei_bg",
        w: 16,
        h: 14,
        start: [7, 11],
        act: {
          q: "Esci nel piazzale",
          T: "Esamina la Coppa 1934",
          Z: "Consulta il registro"
        },
        build(L) {
          // Pareti in marmo verde Alpi
          L.lay(0, 0, 15, 0, "W");
          L.lay(0, 0, 0, 13, "W");
          L.lay(15, 0, 15, 13, "W");
          L.lay(0, 13, 15, 13, "W");

          // Pavimento a scacchi V
          L.lay(1, 1, 14, 12, "V");

          // Uscita
          L.put(7, 13, ".");

          // Teca monumentale centrale
          L.put(7, 5, "T");
          L.put(8, 5, "T");

          // Scaffali e tomi
          L.lay(2, 2, 4, 2, "Z");
          L.lay(11, 2, 13, 2, "Z");
        },
        npcs(step, K) {
          const list = [];
          if (step >= 4) {
            // De Santis entra a sorpresa e sbarra l'uscita
            list.push({ id: "fc_desantis", at: [7, 10] });
          }
          return list;
        }
      }
    };

    const talk = {
      fc_valerio() {
        if (K.rel.scene("fc_valerio")) return;
        const s = S();
        if (s === 0) {
          say("fc_valerio", "[serio] Ehi, ragazzo. Guarda questo manifesto. La Contessa Morosini ha comprato i debiti della polisportiva all'asta fallimentare.");
          say("fc_valerio", "Dopodomani mette all'asta la Coppa del 1934 e manda le ruspe sul nostro vecchio stadio per costruirci un megastore di scarpe.");
          say("fc_valerio", "[arrabbiato] Quarant'anni di storia cancellati col maglio di un banditore d'asta! Dobbiamo fare qualcosa.");
          return ask("Cosa rispondi a Valerio?", [
            {
              label: "«Cosa possiamo fare noi contro i milioni della contessa?»",
              fn: () => {
                say("fc_valerio", "[furbo] Noi abbiamo qualcosa che lei non ha: Arturo Silvestri. Il miglior orafo della regione.");
                say("fc_valerio", "Arturo ti aspetta nella sua bottega a nord-est della piazza. Vai da lui: ha un'idea folle, ma è l'unica che abbiamo.");
                setStep(N, 1);
                quest("fc_c1_bottega", "La Bottega d'Oro", "Entra nella Bottega Silvestri a nord-est e parla con Arturo.");
                done();
              }
            },
            {
              label: "«Se toccano lo stadio, difendiamo i cancelli!»",
              fn: () => {
                say("fc_valerio", "[felice] Questo è lo spirito granata! Ma la legge è dalla parte dei suoi avvocati. Dobbiamo batterla con l'ingegno.");
                say("fc_valerio", "Arturo ha un piano nella sua bottega a nord-est. Raggiungilo subito.");
                setStep(N, 1);
                quest("fc_c1_bottega", "La Bottega d'Oro", "Entra nella Bottega Silvestri a nord-est e parla con Arturo.");
                done();
              }
            }
          ]);
        }
        if (s === 1) {
          say("fc_valerio", "La bottega di Arturo è la porta col battacchio d'ottone a nord-est. Sbrigati prima che arrivi la vigilanza.");
          return done();
        }
        if (s === 5) {
          say("fc_valerio", "[felice] Avete preso il calco? Che vi dicevo! Arturo non sbaglia un colpo!");
          return done();
        }
        say("fc_valerio", "Occhio al Maresciallo De Santis: pattuglia la piazza a quest'ora.");
        done();
      },

      fc_arturo() {
        if (K.rel.scene("fc_arturo")) return;
        const s = S();
        if (s === 1) {
          say("fc_arturo", "[furbo] Ben arrivato, ragazzo. Valerio ti ha spiegato la tragedia, immagino. La Morosini vuole distruggere l'anima di Rondine per fare soldi.");
          say("fc_arturo", "La coppa del 1934 è custodita nella Sala dei Trofei del Municipio. Una teca di cristallo con allarme a pressione calibrato sui due chili.");
          say("fc_arturo", "Se vogliamo scambiarla all'asta senza far scattare le sirene, serve un calco perfetto dello stemma per riprodurne il calice in fonderia.");
          say("fc_arturo", "Per prima cosa, solleva l'asse del pavimento là vicino alla parete: c'è la mia lente d'argento e il calibro.");
          say("fc_arturo", "Poi vai al Bar Centrale da Gina: ha lei la chiave della porta di servizio del palazzo comunale.");
          setStep(N, 2);
          quest("fc_c1_chiave", "La Chiave del Municipio", "Raccogli gli attrezzi sotto l'asse e fatti dare la chiave da Gina al Bar Centrale.");
          return done();
        }
        if (s === 2) {
          if (!K.inv.has("fa_lente")) {
            say("fc_arturo", "Prendi prima la lente e il calibro sotto l'asse di legno, poi va' da Gina.");
            return done();
          }
          say("fc_arturo", "Gina è al Bar Centrale. Dille che ti manda Arturo della Rondine: capirà al volo.");
          return done();
        }
        if (s === 3 || s === 4) {
          say("fc_arturo", "Entra nel Municipio con la chiave di Gina, vai alla teca e prendi l'impronta dello stemma con la cera vergine!");
          return done();
        }
        if (s === 5) {
          say("fc_arturo", "[felice] Sei tornato intero! Fammi vedere quel calco alla luce della lampada...");
          return ask("Mostra il calco in cera ad Arturo", [
            {
              label: "🔍 «Ecco l'impronta della coppa.»",
              fn: fin
            }
          ]);
        }
        say("fc_arturo", "Abbiamo del lavoro da fare, ragazzo.");
        done();
      },

      fc_gina() {
        const s = S();
        if (s === 2) {
          say("fc_gina", "[sorpreso] Ciao, Campione. Ti manda Arturo? Immaginavo. Ho visto le facce di funerale che fate guardando il manifesto dell'asta.");
          say("fc_gina", "Mio marito ha giocato all'ala destra con Valerio nel 1978. Se buttano giù quel campo, questo bar può pure chiudere i battenti.");
          say("fc_gina", "La chiave della porta di servizio del Municipio è nel barattolo dello zucchero. Te la do, ma a un patto.");
          return wask("Cosa prometti a Gina?", [
            {
              label: "⚖️ «Ti prometto che la coppa vera resterà per sempre alla città.»",
              w: { integrita: 1 },
              fn: () => {
                F.set("fc_chiave", true);
                say("fc_gina", "[felice] Questa è la risposta di un vero capitano. Tieni la chiave d'ottone e non farti beccare.");
                setStep(N, 3);
                quest("fc_c1_calco", "Il Calco Proibito", "Entra nel Municipio a sud-est, raggiungi la teca e prendi il calco in cera.");
                done();
              }
            },
            {
              label: "🦊 «Ti prometto che faremo fare alla contessa la figura più ridicola della sua vita.»",
              w: { furbizia: 1 },
              fn: () => {
                F.set("fc_chiave", true);
                say("fc_gina", "[ride] Mi basta e mi avanza! Quella donna merita una lezione d'onore. Ecco la chiave!");
                setStep(N, 3);
                quest("fc_c1_calco", "Il Calco Proibito", "Entra nel Municipio a sud-est, raggiungi la teca e prendi il calco in cera.");
                done();
              }
            }
          ]);
        }
        say("fc_gina", "Attento quando entri nel Municipio. Il vecchio parquet scricchiola!");
        done();
      },

      fc_desantis() {
        const s = S();
        if (s === 4) {
          say("fc_desantis", "[serio] Ferma lì le mani e voltati piano! Maresciallo De Santis.");
          say("fc_desantis", "Che ci fa un ragazzo nella Sala dei Trofei a quest'ora di notte con una cera da calco in mano?");
          return wask("Come ti giustifichi con il Maresciallo?", [
            {
              label: "🦊 [Furbizia] Mostra il tesserino contraffatto da perito della Sovrintendenza.",
              w: { furbizia: 2 },
              fn: () => {
                say("fc_desantis", "[pensa] 'Perito incaricato della stima beni mobili del demanio...'");
                say("fc_desantis", "[furbo] Il timbro è ancora umido, ragazzo. Credi che sia nato ieri?");
                say("fc_desantis", "Ma so bene cosa vuole fare la Morosini a quel campo... e so cosa significa quella maglia.");
                say("fc_desantis", "Per stavolta mi giro dall'altra parte. Sparisci dal retro prima che chiami la volante!");
                setStep(N, 5);
                quest("fc_c1_ritorno", "Ritorno in Bottega", "Torna da Arturo alla Bottega Silvestri con il calco dello stemma.");
                done();
              }
            },
            {
              label: "⚖️ [Integrità] Confessa la verità e ricordagli che ha giocato da terzino nella Rondine.",
              w: { integrita: 2 },
              fn: () => {
                say("fc_desantis", "[sorpreso] Tu... sai che giocavo da terzino con la Rondine?");
                say("fc_desantis", "[triste] 1968. Finale contro la Sampierdarenese. Una botta al ginocchio e addio carriera.");
                say("fc_desantis", "Se la Morosini distrugge lo stadio, cancella anche i ricordi di chi ha sudato su quell'erba.");
                say("fc_desantis", "[serio] Vattene adesso. E fa' che quel falso sia così perfetto da ingannare persino gli dei dell'antiquariato.");
                setStep(N, 5);
                quest("fc_c1_ritorno", "Ritorno in Bottega", "Torna da Arturo alla Bottega Silvestri con il calco dello stemma.");
                done();
              }
            }
          ]);
        }
        say("fc_desantis", "Buona serata. E non fate sciocchezze nel borgo.");
        done();
      }
    };

    const obj = {
      "fa_sala_trofei:T": () => {
        if (S() !== 3) {
          say("voce", "La Coppa del 1934 risplende nella teca di cristallo. Un'opera d'arte d'altri tempi.");
          return done();
        }
        say("voce", "Ti avvicini alla teca con il panetto di cera d'api ammorbidito dal calore delle mani...");
        window.__falsariBanco.start({
          mode: "calco",
          title: "🔍 Rilievo dello Stemma del 1934",
          onDone: (res) => {
            if (res.win) {
              K.inv.give("fa_calco", 1);
              K.evidence("coppa1934", "impronta");
              say("voce", "Hai ottenuto il 🕯️ Calco in Cera d'Api dello Stemma!");
              say("voce", "Improvvisamente, si sente il cigolio pesante del portone d'ingresso che si apre...");
              setStep(N, 4);
              quest("fc_c1_desantis", "Sorpresi sul Fatto", "Il Maresciallo De Santis è entrato nella Sala Trofei: affrontalo!");
              done();
            } else {
              say("voce", "Il calco è venuto sbavato. Riprova con più calma per non rovinare la cera.");
              done();
            }
          }
        });
      },
      "fa_sala_trofei:Z": () => {
        K.evidence("coppa1934", "lega");
        say("voce", "Il Registro Civico del 1934 riporta: 'Il Trofeo fu forgiato fondendo residuati metallici bellici donati dalle maestranze. Peso netto registrato: 1.840 grammi'.");
        done();
      },
      "fa_piazza:Z": () => {
        K.evidence("coppa1934", "bando");
        say("voce", "Il bando d'asta recita: 'Liquidazione coatta dello Stadio Comunale del 1934 e degli annessi cimeli. Offerta base: 500 milioni di lire'.");
        done();
      }
    };

    return {
      n: N,
      title: "Oro, Piombo e Segatura",
      sub: "Il ritorno della Lente e la minaccia delle ruspe",
      goal,
      start: "fa_piazza",
      introBg: "fa_titolo",
      intro(K) {
        return [
          ["voce", "<b>I FALSARI DELLA COPPA</b><br>Capitolo 1 · Oro, Piombo e Segatura"],
          ["voce", "Borgo di Rondine, novembre. Sulle vetrine dei negozi e sui muri dello stadio compaiono i manifesti gialli dell'asta giudiziaria."],
          ["fc_valerio", "Guarda quel manifesto, Campione. La Contessa Morosini vuole cancellare cinquant'anni di passione per farci un centro commerciale."],
          ["voce", "Raggiungi Valerio Ronchi nella Piazza della Stazione per decidere la prima mossa."]
        ];
      },
      zones,
      talk,
      obj
    };
  }

  boot();
})();
