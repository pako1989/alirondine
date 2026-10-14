// js/galletta-c3.js - S.O.S. GALLETTA · Capitolo 3 «La Notte del Gran Forno e il Kraken Croccante»
// L'approdo all'Atollo del Biscotto Spezzato, il tempio megalitico del Santuario del Gran Forno,
// l'antico rito di Mastro Lievito e la grandiosa sfida finale d'arrembaggio tra i flutti tempestosi
// con 4 finali ramificati in base alle scelte e alle statistiche della ciurma.
(function () {
  "use strict";
  function boot() {
    const D = window.__galletta;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cast("gl_lievito", { acc: ["cappellino"], name: "Mastro Lievito", tag: "gold", hair: "#ffffff", style: "wavy", skin: "#fed7aa", eye: "#15803d", beard: true, bg: ["#ea580c", "#fef3c7"], shirt: "#ea580c" },
      "L'antico eremita e custode del Santuario del Gran Forno. Custodisce la brace primordiale da quattro generazioni: «Qui il tempo non si misura in ore, ma in tempi di doratura della crosta!»");

    K.cos("gl_c3", { kind: "shirt", label: "Mantello da Gran Cerimoniere del Forno", val: "#ea580c", from: "Capitolo 3 di S.O.S. Galletta" });
    K.lore("l_kraken", { t: "Il Biscotto del Kraken", d: "La ricetta proibita del Grande Forno: calma i marosi e richiama il leviatano a protezione delle coste." });
    K.lore("l_forno", { t: "Il Santuario Primordiale", d: "Un tempio millenario scavato nel basalto dove i primi navigatori cuocevano il pane dei campioni." });

    const goal = (s) => ({
      0: "Sei sbarcato all'Atollo del Biscotto Spezzato. Parla con Capitan Barbabiscotto sulla spiaggia.",
      1: "Risali le scogliere coralline ed entra nel Santuario del Gran Forno a nord.",
      2: "Parla con l'eremita Mastro Lievito e accendi il Forno Primordiale.",
      3: "La finale dei sette mari! Disputa la partita decisiva all'Arrembaggio sul Ponte!"
    }[s] || "La saga di S.O.S. Galletta: I Bucanieri del Biscotto è conclusa con successo.");

    const zones = {
      gl_isola: {
        region: "isola", name: "Atollo del Biscotto Spezzato", short: "Atollo Spezzato", sub: "Spiaggia dorata, palme di zucchero e scogliere coralline", bg: "gl_arcipelago", time: "giorno", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[3, 6], [29, 6], [16, 19]],
        areas: [[10, 8, 22, 14, "Il sentiero tra le palme da zucchero"], [0, 0, 31, 21, "L'Atollo del Biscotto Spezzato"]],
        flavor: {
          B: "Un barile di miele vergine dell'atollo lasciato dai corsari del secolo scorso.",
          F: "Piccole fornaci scavate nel corallo che emanano calore vulcanico profumato.",
          A: "Antiche ancore cerimoniali piantate nella sabbia dorata.",
          K: "Cannoni di bronzo fiorito eretti a difesa dell'approdo sacro."
        },
        intro: [
          ["voce", "L'Atollo del Biscotto Spezzato: le onde dell'oceano si infrangono su scogliere che sembrano frollini dorati appena sfornati."],
          ["voce", "Al centro dell'isola, un cratere di basalto scuro emette colonne di vapore alla cannella. Barbabiscotto pianta lo stendardo corsaro nella sabbia."]
        ],
        npcs: (s) => [
          { id: "gl_barbabiscotto", at: [8, 18] },
          { id: "gl_calipso", at: [14, 12] }
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 17, 30, 19, ":"); lay(15, 6, 15, 17, ":"); lay(4, 6, 27, 6, ":");
          // Ingresso al tempio del forno
          house(11, 1, 10, 5, { door: [16, 5], roof: "#ea580c", wall: "#451a03", rr: 2, enter: { to: "gl_forno", at: [8, 10] } });
          // Elementi dell'isola
          put(16, 8, "A"); put(25, 17, "K"); put(6, 17, "F");
          [[9, 6], [21, 6], [12, 13]].forEach(([x, y]) => put(x, y, "B"));
          put(5, 17, "s");
        }
      },
      gl_forno: {
        interior: true, region: "isola", name: "Santuario del Gran Forno", short: "Gran Forno", sub: "Braci vulcaniche, colonne di basalto e la teglia dei campioni", bg: "gl_arcipelago", w: 18, h: 14, start: [8, 10], outside: ["gl_isola", 16, 6],
        act: { F: "Venera il forno", B: "Esamina i lieviti", K: "Ammira l'altare", v: "Esci" },
        flavor: {
          F: "Il Forno Primordiale: una gigantesca cupola vulcanica accesa dall'inizio dei tempi sportivi.",
          B: "Giare di terracotta contenenti il Sacro Lievito Madre dei marinai.",
          K: "Un altare di marmo scuro dove viene appoggiato il primo biscotto di ogni vittoria navale."
        },
        intro: [["voce", "Il Santuario del Gran Forno: una cupola monumentale illuminata da fiamme ambrate e riflessi dorati. L'aria vibra di un calore sacro e aromatico."]],
        npcs: () => [
          { id: "gl_lievito", at: [8, 5] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 13, "+"); lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 13, "a"); lay(17, 0, 17, 13, "a"); lay(0, 13, 17, 13, "a");
          put(8, 12, "v");
          lay(3, 3, 14, 3, "F");
          put(4, 6, "B"); put(13, 6, "B");
          put(8, 6, "K");
        }
      }
    };

    const talk = {
      gl_barbabiscotto(K) {
        say([
          ["gl_barbabiscotto", "[respira a pieni polmoni il profumo della spiaggia] Ci siamo, ragazzo! L'Atollo del Biscotto Spezzato! Entra nel tempio lassù ed incontra Mastro Lievito!"]
        ], done);
      },

      gl_calipso(K) {
        say([
          ["gl_calipso", "[indica il cielo limpido] Le correnti sono perfette. Se accendi la fiamma del forno, il mare riconoscerà la tua ciurma per sempre!"]
        ], done);
      },

      gl_lievito(K) {
        const s = S();
        if (s < 2) {
          say([
            ["gl_lievito", "[si accarezza la barba candida e ti scruta con occhi saggi] Sei giunto fin qui, centravanti delle onde. Il profumo del tuo pallone racconta mille arrembaggi."],
            ["hero", "Mastro Lievito, siamo qui per completare il Ricettario Corsaro e unire l'Oceano della Melassa."],
            ["gl_lievito", "Parole degne di un vero capitano! Prendi quest'ultima pergamena: il Biscotto del Kraken. Se saprai infornarlo con fede, nessuna tempesta potrà più farti affondare!"]
          ], () => {
            K.ricetta("kraken", { gallette: 150, spezie: 40, pirateria: 20 }, () => {
              say([
                ["gl_lievito", "Le acque ribollono: le migliori ciurme dell'arcipelago sono radunate per disputare la Coppa del Gran Forno! Scendi in campo e dimostra di che pasta sei fatto!"],
                ["hero", "Pronto a calciare, maestro! Per la gloria della Biscottiera!"]
              ], () => {
                setStep(3);
                quest("Sfida la squadra dei Campioni del Kraken alla Finale dell'Arrembaggio sul Ponte!");
                done();
              });
            });
          });
        } else {
          say([
            ["gl_lievito", "Il campo galleggiante del Gran Forno è pronto! Sfida i Campioni dell'Oceano per decidere il destino dei sette mari!"]
          ], () => {
            ask("Inizia la Finale dell'Arrembaggio sul Ponte?", [
              ["Scendi in Campo per la Finale (Arrembaggio sul Ponte)", () => {
                K.arrembaggioMatch({
                  turns: 7,
                  us: "I Bucanieri",
                  opp: {
                    name: "I Campioni del Kraken",
                    color: "#dc2626",
                    style: "pressing",
                    players: [{ name: "Tentacolo d'Oro" }, { name: "Marea Nera" }],
                    keeper: { name: "Il Grande Masticatore" }
                  }
                }, (res) => {
                  if (res && res.win) {
                    say([
                      ["gl_lievito", "[solleva le braccia al cielo mentre dal mare erompe un getto di spuma dorata] Il Gran Forno ha parlato! Il gol della vittoria ha scaldato il cuore dell'antico Kraken!"],
                      ["gl_barbabiscotto", "[esulta abbracciando Calipso e tutta la ciurma] ABBIAMO VINTO LA COPPA DEI SETTE MARI!"]
                    ], () => {
                      questDone();
                      // Calcolo finale ramificato
                      const p = K.stat("pirateria");
                      const sp = K.stat("spezie");
                      const allItems = (K.inventory && K.inventory().length >= 3);
                      const sceltaReale = K.F.is("gl_scelta_reale");
                      const sceltaCorsara = K.F.is("gl_scelta_corsara");

                      let finaleId = "cuoco";
                      if (allItems && sp >= 60) {
                        finaleId = "segreto";
                      } else if (sceltaReale) {
                        finaleId = "reale";
                      } else if (sceltaCorsara && p >= 50) {
                        finaleId = "bucaniere";
                      }

                      finishChapter(3, finaleId);
                    });
                  } else {
                    say([
                      ["gl_lievito", "La marea era contro di te, marinaio. Il Gran Forno richiede un'altra cottura! Riprova la finale!"]
                    ], done);
                  }
                });
              }],
              ["Prenditi ancora un momento per respirare l'aroma del forno", done]
            ]);
          });
        }
      }
    };

    return {
      n: N,
      title: "La Notte del Gran Forno e il Kraken Croccante",
      desc: "L'approdo all'Atollo del Biscotto Spezzato, il Santuario del Gran Forno, l'impasto primordiale e la finale decisiva con 4 destini per la ciurma.",
      goal: () => goal(S()),
      start: "gl_isola",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [["voce", "<b>S.O.S. GALLETTA</b> · Capitolo 3. L'Atollo del Biscotto Spezzato e il Santuario del Gran Forno! È giunta l'ora della grande finale tra i flutti."]];
      }
    };
  }

  boot();
})();
