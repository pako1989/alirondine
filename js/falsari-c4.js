// js/falsari-c4.js — «I FALSARI DELLA COPPA» · Capitolo 4: Il Giudizio del Maglio
// L'asta sul campo storico del 1934, lo scambio della coppa sul piedistallo allarmato,
// la partita decisiva per fermare le ruspe e i 4 finali ramificati.
(function () {
  "use strict";

  function boot() {
    const E = window.__falsariCore;
    if (!E || !E.api || !E.api.addChapter || !E.api._has || !E.api._has(3) || !window.__falsariH || !window.__falsariBanco) {
      return setTimeout(boot, 100);
    }
    E.api.addChapter(chapter4);
  }

  function chapter4(K) {
    const { setStep, quest, F } = K;
    const H = window.__falsariH(K);
    const { say, done, ask, wask } = H;
    const N = 4;
    const S = () => K.stepOf(N);

    H.people();

    K.cos("fc_c4", {
      kind: "shirt",
      label: "Maglia Rondine 1934 d'Epoca",
      val: "#7f1d1d",
      from: "Capitolo 4 de I Falsari della Coppa"
    });

    K.lore("l_stadio1934", {
      t: "Lo Stadio Comunale del 1934",
      d: "Costruito con il sudore dei lavoratori del porto. Cinquant'anni di domeniche popolari, gradonate in legno e reti cucite a mano."
    });

    const goal = (s) => ({
      0: "Parla con Valerio Ronchi davanti ai cancelli dello Stadio Comunale 1934.",
      1: "Entra nello Spogliatoio Storico per l'ultimo briefing con Arturo e Tullio.",
      2: "Sali sul Palco del Banditore ed esegui lo scambio perfetto sulla bilancia allarmata (1840g).",
      3: "Presenta la pergamena demaniale dell'Olmo Sacro del 1934 al Maresciallo De Santis.",
      4: "Scendi in campo per la partita decisiva contro i Mercenari dell'Immobiliare Morosini.",
      5: "Incontra Arturo e Valerio sul dischetto di centrocampo per il destino finale della Coppa.",
      6: "La saga «I Falsari della Coppa» è conclusa."
    }[s] || "La saga è conclusa.");

    function fin(endId) {
      setStep(N, 6);
      F.set("fa_c4_done", true);
      K.reward("fa_c4", { coins: 200, cos: "fc_c4" });
      K.finishChapter(N, endId || "olmo");
      K.end(endId || "olmo");

      const endScenes = {
        olmo: [
          ["fc_desantis", "[felice] L'atto del 1934 non mente: vincolo perpetuo inalienabile! Le ruspe devono fare marcia indietro."],
          ["fc_valerio", "[felice] Lo stadio è salvo! Resterà dei ragazzi e della città per sempre."],
          ["fc_arturo", "[furbo] E la coppa torna a casa... quella vera o quella nostra? Chi può dirlo ormai."],
          ["voce", "<b>FINALE 1: L'OLMO SACRO</b><br>La memoria storica e il diritto collettivo trionfano sul cemento."]
        ],
        montecarlo: [
          ["fc_arturo", "[ride] La contessa ha comprato la nostra replica a peso d'oro credendola autentica!"],
          ["fc_valerio", "[ride] Con quei trecento milioni abbiamo rifondato la scuola calcio e comprato i riflettori nuovi."],
          ["fc_arturo", "[furbo] E l'originale del trentaquattro? È al sicuro nel doppio fondo della mia bottega."],
          ["voce", "<b>FINALE 2: IL COLPO PERFETTO A MONTECARLO</b><br>La furbizia della banda beffa la speculazione e finanzia il futuro."]
        ],
        rigore: [
          ["fc_desantis", "[serio] La bilancia ha oscillato di trenta grammi: il trucco è venuto a galla, ma il pretore ha capito."],
          ["fc_valerio", "[sorpreso] Condannati a cento ore di manutenzione straordinaria del campo storico!"],
          ["fc_arturo", "[felice] Pennelli in mano, calce e tosaerba. Il miglior verdetto che potessimo sperare."],
          ["voce", "<b>FINALE 3: I MASTRI DI RIGORE</b><br>La giustizia sportiva riconosce la passione e salva il terreno con il lavoro."]
        ],
        segreto: [
          ["fc_arturo", "[furbo] Ragazzo, vieni qui... Svita questo piccolo bullone sotto la base della coppa originale."],
          ["fc_arturo", "[ride] Vedi questo piombo? Nel 1934 mio padre Vanni fece la stessa identica cosa!"],
          ["fc_arturo", "L'oro vero lo vendettero agli operai per comprare il pane durante la grande crisi. Questa coppa è sempre stata un falso d'autore!"],
          ["voce", "<b>FINALE SEGRETO: IL PRIMO FALSO DEL 1934</b><br>La Rondine nacque da un nobile inganno operaio, tramandato di generazione in generazione."]
        ]
      };

      const sc = endScenes[endId] || endScenes.olmo;
      K.scene(sc, () => K.openMain(), "fa_stadio_bg");
    }

    const zones = {
      fa_stadio_curva: {
        region: "stadio",
        name: "Stadio Comunale 1934",
        short: "Stadio 1934",
        sub: "Il Prato Storico & Le Ruspe",
        bg: "fa_stadio_bg",
        w: 32,
        h: 22,
        start: [16, 17],
        act: {
          q: "Entra",
          U: "Guarda il dischetto",
          Z: "Leggi il tabellone dei punteggi",
          E: "Esamina le ruspe"
        },
        flavor: {
          "16,11": "Il manto erboso conserva le zolle e le cicatrici di cinquant'anni di tackle scivolati.",
          "6,16": "I tifosi granata cantano a squarciagola reggendo uno striscione: «LA STORIA NON SI ABBATTE»."
        },
        items: [
          [8, 12, "Frammento di Rame"],
          [24, 12, "Frammento di Rame"]
        ],
        build(L) {
          // Erba del campo da gioco
          L.lay(0, 0, 31, 21, ".");

          // Muro perimetrale gradinate a nord
          L.lay(0, 0, 31, 2, "W");

          // Pista in terra battuta attorno al campo
          L.lay(0, 19, 31, 21, "U");

          // Spogliatoio Storico a nord-ovest
          L.house(7, 3, {
            w: 7, h: 5,
            wall: "W", roof: "#451a03",
            door: [10, 7],
            enter: ["fa_stadio_spogliatoio", 7, 11]
          });

          // Palco del Banditore d'Asta a nord-est
          L.house(19, 3, {
            w: 8, h: 5,
            wall: "W", roof: "#7f1d1d",
            door: [22, 7],
            enter: ["fa_stadio_palco", 8, 12]
          });

          // Porte da calcio in ferro
          L.put(16, 19, "C");
          L.put(16, 3, "C");
        },
        npcs(step, K) {
          const list = [
            { id: "fc_valerio", at: [16, 16] },
            { id: "fc_desantis", at: [19, 16] }
          ];
          if (step >= 4) {
            list.push({ id: "fc_tullio", at: [13, 16] });
          }
          if (step >= 5) {
            list.push({ id: "fc_arturo", at: [14, 16] });
          }
          return list;
        }
      },

      fa_stadio_spogliatoio: {
        interior: true,
        outside: ["fa_stadio_curva", 10, 8],
        region: "bottega",
        name: "Spogliatoio Storico",
        short: "Spogliatoio",
        sub: "Legno, canfora e ricordi",
        bg: "fa_bottega_bg",
        w: 15,
        h: 13,
        start: [7, 11],
        act: {
          q: "Esci in campo",
          Z: "Leggi la lavagna tattica",
          B: "Apri la custodia della coppa"
        },
        build(L) {
          L.lay(0, 0, 14, 0, "W");
          L.lay(0, 0, 0, 12, "W");
          L.lay(14, 0, 14, 12, "W");
          L.lay(0, 12, 14, 12, "W");

          // Pavimento a doghe U
          L.lay(1, 1, 13, 11, "U");

          // Uscita
          L.put(7, 12, ".");

          // Panchine e appendiabiti
          L.lay(3, 4, 11, 4, "B");
          L.put(3, 8, "C");
          L.put(11, 8, "C");

          // Lavagna tattica con gesso
          L.put(7, 2, "Z");
        },
        npcs(step, K) {
          return [
            { id: "fc_arturo", at: [6, 5] },
            { id: "fc_tullio", at: [8, 5] }
          ];
        }
      },

      fa_stadio_palco: {
        interior: true,
        outside: ["fa_stadio_curva", 22, 8],
        region: "villa",
        name: "Palco del Banditore",
        short: "Palco Asta",
        sub: "Il Maglio della Morosini",
        bg: "fa_villa_bg",
        w: 16,
        h: 14,
        start: [8, 12],
        act: {
          q: "Scendi in campo",
          T: "Esegui lo scambio sulla teca",
          E: "Guarda il martelletto del banditore"
        },
        build(L) {
          L.lay(0, 0, 15, 0, "W");
          L.lay(0, 0, 0, 13, "W");
          L.lay(15, 0, 15, 13, "W");
          L.lay(0, 13, 15, 13, "W");

          // Pavimento marmo e velluto V
          L.lay(1, 1, 14, 12, "V");

          // Uscita
          L.put(8, 13, ".");

          // Pedana con la teca originale allarmata
          L.put(7, 4, "T");
          L.put(8, 4, "T");

          // Tavolo del banditore con il maglio
          L.lay(5, 6, 10, 6, "B");
        },
        npcs(step, K) {
          return [
            { id: "fc_morosini", at: [6, 5] },
            { id: "fc_renzi", at: [9, 5] }
          ];
        }
      }
    };

    const talk = {
      fc_valerio() {
        if (K.rel.scene("fc_valerio")) return;
        const s = S();
        if (s === 0) {
          say("fc_valerio", "[serio] Eccoci all'ora della verità. I cancelli sono assediati dai tifosi, ma le ruspe hanno già i motori accesi.");
          say("fc_valerio", "Arturo e Tullio ti aspettano dentro lo Spogliatoio Storico (nord-ovest). Vai da loro per prendere la replica bilanciata.");
          setStep(N, 1);
          quest("fa_c4_briefing", "L'Ultimo Briefing", "Entra nello Spogliatoio Storico e parla con Arturo Silvestri.");
          return done();
        }
        if (s === 3) {
          say("fc_valerio", "[felice] Lo scambio sulla pedana è riuscito! Ora presenta la pergamena notarile a De Santis!");
          return done();
        }
        if (s === 5) {
          say("fc_valerio", "[felice] Abbiamo vinto sul campo e nella legge! Parla con Arturo per decidere cosa fare della Coppa.");
          return done();
        }
        say("fc_valerio", "Teniamo la linea ai cancelli: non faremo passare una sola ruspa!");
        done();
      },

      fc_arturo() {
        const s = S();
        if (s === 1) {
          say("fc_arturo", "[furbo] Ecco la replica, ragazzo: 1.840 grammi spaccati, bronzo dei cantieri navali e patina da cinquant'anni.");
          say("fc_arturo", "Ora vai sul Palco del Banditore (nord-est). Quando Renzi alza il fascicolo per leggere l'offerta, scambia il trofeo sul piedistallo (T)!");
          setStep(N, 2);
          quest("fa_c4_scambio", "Lo Scambio sotto il Maglio", "Sali sul Palco del Banditore ed esamina la teca (T) per posizionare il falso.");
          return done();
        }
        if (s === 5) {
          say("fc_arturo", "[furbo] È il momento di decidere il destino di questa storia, compare.");
          return ask("Quale finale scegli per la Coppa e per lo Stadio?", [
            {
              label: "📜 L'Olmo Sacro (Vittoria di Legge)",
              sub: "Vincolo demaniale pubblico perenne",
              fn: () => fin("olmo")
            },
            {
              label: "🦊 Il Colpo Perfetto a Montecarlo",
              sub: "La replica beffa la vendita miliardaria",
              fn: () => fin("montecarlo")
            },
            {
              label: "⚖️ I Mastri di Rigore (Lavori Sociali)",
              sub: "Ristrutturazione comunitaria dello stadio",
              fn: () => fin("rigore")
            },
            {
              label: "⭐ Il Primo Falso del 1934 (Segreto)",
              sub: "Svela l'inganno originario dei fondatori",
              fn: () => fin("segreto")
            }
          ]);
        }
        say("fc_arturo", "Tutto è nelle tue mani, compare.");
        done();
      },

      fc_tullio() {
        say("fc_tullio", "[ride] Se le ruspe provano a toccare la curva, i miei scaricatori gli smontano i cingoli bullone per bullone!");
        done();
      },

      fc_morosini() {
        say("fc_morosini", "[arrabbiato] Questa farsa non vi salverà! L'asta è valida e il terreno dello stadio sarà mio!");
        done();
      },

      fc_renzi() {
        say("fc_renzi", "[preoccupato] Ma... questo documento del 1934 ha il sigillo regio e la firma dell'intendenza di finanza... Non si può alienare!");
        done();
      },

      fc_desantis() {
        const s = S();
        if (s === 3) {
          say("fc_desantis", "[felice] Mostrami quell'atto, figliolo... Rogito notarile del 14 ottobre 1934, donazione perpetua inalienabile!");
          say("fc_desantis", "[serio] In nome della legge dichiaro sospesa l'asta e sequestro le ruspe della Morosini!");
          say("fc_desantis", "La contessa contesta il provvedimento e ha ingaggiato una squadra di guardie per una sfida d'onore. Battili sul campo e chiudiamo la partita!");
          setStep(N, 4);
          quest("fa_c4_match", "La Partita del Destino", "Scendi sul campo dello stadio e affronta i Mercenari della Morosini.");
          return done();
        }
        if (s === 4) {
          say("fc_desantis", "[serio] È l'ultima partita per la storia della Rondine. Scendete in campo!");
          return ask("Inizi la partita decisiva per lo Stadio?", [
            {
              label: "⚽ Fischio d'Inizio per la Storia",
              sub: "Affronta i Mercenari dell'Immobiliare Morosini",
              fn: () => {
                K.playMatch({
                  id: "fa_match_finale",
                  alt: "az,cage,hd",
                  oppTeam: "Mercenari Morosini",
                  oppColor: "#4c1d95",
                  mate: "fc_valerio",
                  squad: ["fc_valerio", "fc_arturo", "fc_tullio"],
                  us: "Rondine 1934 Popolare",
                  homeKit: ["#7f1d1d", "#fbbf24"],
                  chap: "I Falsari della Coppa · La Partita per lo Stadio",
                  bg: "fa_stadio_bg",
                  oppNames: ["Ruspa 1", "Ruspa 2", "Il Geometra", "L'Ingegnere", "Il Banditore"],
                  intro: "Sullo storico campo del 1934: novanta minuti di orgoglio per salvare la curva, la coppa e le radici della città.",
                  done: () => {
                    setStep(N, 5);
                    say("fc_valerio", "[felice] Abbiamo vinto! Lo stadio storico è salvo! La gente invade il campo!");
                    done();
                  }
                });
              }
            },
            {
              label: "🏆 Convalida la vittoria con il consenso dei tifosi",
              sub: "Usa la voce popolare per vincere a tavolino",
              fn: () => {
                setStep(N, 5);
                say("fc_desantis", "[felice] L'invasione pacifica di mille tifosi decreta la vittoria a tavolino! Lo stadio è salvo!");
                done();
              }
            }
          ]);
        }
        say("fc_desantis", "Oggi ha vinto la parte migliore della città.");
        done();
      }
    };

    const obj = {
      // Scambio sul palco dell'asta
      "fa_stadio_palco:T"() {
        if (S() === 2) {
          window.__falsariBanco.start({
            mode: "bilancia",
            targetPeso: 1840,
            initialPeso: 1840,
            targetPurezza: 85,
            title: "⚖️ Il Palco del Banditore · Lo Scambio Perfetto",
            onDone: ({ win, peso }) => {
              setStep(N, 3);
              quest("fa_c4_olmo", "L'Atto di Donazione", "Parla con il Maresciallo De Santis vicino a centrocampo per fermare l'asta.");
              K.say([
                ["voce", `✓ <b>SCAMBIO RIUSCITO!</b><br>La replica da ${peso}g è posizionata sul piedistallo: i sensori elettronici non hanno rilevato alcuna variazione!`],
                ["fc_arturo", "[furbo] Colpo magistrale! La coppa del trentaquattro è al sicuro con noi."],
                ["fc_valerio", "[felice] Ora corri da De Santis ed esibisci la pergamena dell'Olmo Sacro!"]
              ], () => {
                K.go("fa_stadio_curva", 16, 15);
              });
            }
          });
        } else {
          K.say([["voce", "La teca blindata con il piedistallo d'asta della Contessa Morosini."]], K.done);
        }
      }
    };

    return {
      n: N,
      title: "Il Giudizio del Maglio",
      sub: "L'asta finale, lo scambio della coppa e i quattro destini della Rondine",
      goal,
      start: "fa_stadio_curva",
      introBg: "fa_stadio_bg",
      zones,
      talk,
      obj,
      intro: [
        ["fc_valerio", "Guarda i cancelli: tutta la gente del borgo è venuta a difendere il campo."],
        ["fc_arturo", "La replica è pronta nella sacca di velluto. Oggi o facciamo la storia o finiamo in galera."],
        ["fc_valerio", "Dalla galera si esce, compare. Ma un campo abbattuto non rinasce più."],
        ["voce", "<b>CAPITOLO 4 · IL GIUDIZIO DEL MAGLIO</b><br>L'asta sul terreno di gioco, lo scambio decisivo e l'epilogo finale!"]
      ]
    };
  }

  boot();
})();
