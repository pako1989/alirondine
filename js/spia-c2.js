// js/spia-c2.js - «OPERAZIONE DOPPIO ZERO · LICENZA DI CROSS» · Capitolo 2
// Capitolo 2: Bersaglio sulle Nevi
// Inseguimento tra le vette alpine svizzere, funivie d'acciaio e piste ghiacciate.
// Bisogna travestirsi da sciatore, piazzare le microspie e scoprire le coordinate del Covo del Vulcano.
(function () {
  "use strict";
  function boot() {
    const D = window.__spia;
    if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 100);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { setStep, quest } = K;
    const N = 2, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => { const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn }))); if (l.length) K.say(l, go); else go(); };
    const fin = (ending) => {
      const msg = K.reward("dz_c" + N, { coins: 70 + N * 20, cos: "dz_c" + N }), lines = flush();
      K.finishChapter(N, ending || "ok"); if (ending) K.end(ending);
      lines.push(["voce", `<b>FINE DEL CAPITOLO ${N}.</b> ${msg.join(" · ")}<br>Continua nel Capitolo ${N + 1}: il covo del vulcano.`]);
      K.scene(lines, () => K.openMain(), "dz_bunker");
    };

    K.cos("dz_c2", { kind: "shirt", label: "Tuta termica da sciatore di Engadina", val: "#0284c7", from: "Capitolo 2 di Operazione Doppio Zero" });
    K.lore("l_engadina", { t: "Le Vette dell'Engadina", d: "Cime svizzere a 2.800 metri: bufere, crepacci e una funivia d'acciaio che sale verso lo Chalet dell'Aquila Nera." });

    const goal = (s) => ({
      0: "Sei allo Chalet delle Vette. Parla con Eva Vesper per ottenere la tuta da sciatore.",
      1: "Avvicina Boris il Guardaspalle accanto alla funivia e pianta una microspia.",
      2: "Entra nella Stazione Radio e raggiungi l'Agente Sterling per intercettare il segnale.",
      3: "Missione compiuta."
    }[s] || "Il secondo capitolo è completato. Continua con il Capitolo 3.");

    const zones = {
      dz_chalet: {
        region: "neve", name: "Chalet delle Vette · Pista della Funivia", short: "Chalet Alpino", sub: "Legno massiccio, abeti innevati e cabina funivia d'acciaio", bg: "dz_chalet", time: "giorno",
        w: 32, h: 22, start: [6, 11], items: [[9, 6], [24, 8], [16, 17]],
        areas: [[0, 0, 31, 21, "La pista innevata ai piedi della funivia, con lo chalet in legno scuro"]],
        flavor: {
          B: "Panche e staccionate in legno, coperte di neve fresca.",
          T: "Il terminale della funivia: una leva e un quadro di comandi gelati.",
          M: "Una stazione meteo con anemometro e barometro.",
          V: "Una vetrata rimpicciolita dal gelo: oltre il vetro, solo bianco."
        },
        intro: [
          ["voce", "Vette dell'Engadina, 2.800 metri di quota. Bufera di neve e crepacci a picco sul ghiacciaio."],
          ["voce", "La funivia del Barone von Kalt sale lenta verso lo Chalet dell'Aquila Nera."],
          ["dz_eva", "«Siamo vicini alla stazione di trasmissione. Il Barone usa l'antenna parabolica per sincronizzare il Cannone Criogenico con il satellite orbitale.»"]
        ],
        npcs: (s) => [
          { id: "dz_eva", at: s === 0 ? [10, 12] : [12, 9] },
          { id: "dz_colbacco", at: [20, 8] },
          { id: "dz_guard_neve", at: [28, 9] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(3, 11, 30, 11, ":"); lay(10, 8, 10, 16, ":"); lay(20, 9, 20, 14, ":");
          lay(4, 4, 8, 5, "B"); lay(14, 4, 18, 5, "T"); lay(22, 4, 26, 6, "M");
          lay(4, 15, 8, 18, "B"); lay(22, 15, 26, 18, "V");
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "dz_neve", at: [3, 11] } });
        }
      },

      dz_neve: {
        region: "neve", name: "Osservatorio delle Vette · Sala Radio", short: "Stazione Radio", sub: "Ricevitori a valvole, mappe polari e antenna parabolica", bg: "dz_neve", time: "giorno",
        w: 32, h: 22, start: [3, 11], items: [[11, 5], [20, 16], [26, 7]],
        areas: [[0, 0, 31, 21, "La sala radio ai piedi dell'antenna parabolica"]],
        flavor: {
          T: "Un terminale satellitare con una schermata di coordinate polari.",
          B: "Un tavolo tattico con mappe e segnapassi.",
          M: "Il quadro radar: puntini verdi sul ghiacciaio."
        },
        npcs: (s) => [{ id: "dz_sterling", at: [16, 11] }],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(2, 11, 29, 11, ":"); lay(16, 6, 16, 16, ":");
          lay(5, 4, 8, 6, "T"); lay(22, 4, 26, 6, "B"); lay(5, 15, 8, 17, "M"); lay(23, 15, 26, 17, "T");
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "dz_chalet", at: [29, 11] } });
        }
      }
    };

    const talk = {
      dz_eva(K) {
        const s = S();
        if (s === 0) {
          say("dz_eva", "Bentornato al gelo, 00! Ho monitorato i movimenti di von Kalt.");
          say("dz_eva", "Il suo braccio destro, Boris il Guardaspalle, è di guardia accanto alla funivia.");
          say("dz_eva", "Prendi questa tuta da sciatore termica: con questo camuffamento Boris non ti riconoscerà.");
          say("hero", "[furbo] Perfetto: fingo di dover riparare gli attacchi dei suoi sci.");
          K.spiaDisguise("sciatore");
          K.bond("gadget", 10);
          setStep(N, 1);
          quest("boris", "Copertura Alpina", "Avvicina Boris alla funivia e piazza una microspia sul suo colbacco.");
          done();
        } else {
          say("dz_eva", "La stazione radio è proprio dietro di noi. Appena hai il codice, raggiungimi dentro!");
          done();
        }
      },

      dz_colbacco(K) {
        const s = S();
        if (s === 1) {
          say("dz_colbacco", "Brrr... chi va là sulla pista? Ah, sei il maestro di sci mandato dal villaggio.");
          say("dz_colbacco", "Il Barone von Kalt è già sceso nei sotterranei con la capsula speciale.");
          say("dz_colbacco", "Dice che domani tutta l'Europa giocherà su piste di pattinaggio invece che sull'erba! Ah ah ah!");
          say("hero", "[furbo] (Mentre ride gli applico la microspia dietro la fibbia del colbacco.) Frequenza agganciata!");
          K.spiaBug("colbacco", "Boris il Guardaspalle");
          K.bond("freddezza", 15);
          setStep(N, 2);
          K.questDone("boris");
          quest("radio", "Frequenza Criogenica", "Entra nell'Osservatorio e raggiungi l'Agente Sterling.");
          done();
        } else if (s === 0) {
          say("dz_colbacco", "[arrabbiato] Largo! Questa è zona riservata. Niente turisti qui.");
          done();
        } else {
          say("dz_colbacco", "Niente batte una tazza di tè bollente a tremila metri d'altitudine.");
          done();
        }
      },

      dz_guard_neve(K) {
        const dis = K.F.get("dz_disguise");
        if (dis === "sciatore") {
          say("dz_guard_neve", "Pista libera per gli sciatori autorizzati. Attenzione al ghiaccio vivo all'uscita.");
          if (!K.F.get("dz_bug_guard_neve")) {
            say("hero", "(Mentre indica la pista, gli aggancio una microspia al bastoncino.)");
            K.spiaBug("guard_neve", "Pattuglia con Sci");
          }
        } else {
          say("dz_guard_neve", "[arrabbiato] Alt! Nessuno può avvicinarsi alla stazione radio senza tuta termica!");
        }
        done();
      },

      dz_sterling(K) {
        const s = S();
        if (s === 2) {
          say("dz_sterling", "Puntuale come sempre, 00. I microfoni di Boris hanno trasmesso il segnale.");
          say("dz_sterling", "Il Barone von Kalt non si trova qui: il suo quartier generale è dentro un antico vulcano sottomarino!");
          say("dz_sterling", "Ma ha lasciato a guardia del trasmettitore i suoi tiratori scelti: i Cecchini delle Nevi.");
          say("hero", "[furbo] Non c'è problema: sui campi ghiacciati le carambole a effetto sono ancora più veloci.");
          say("dz_sterling", "Esatto! Schierati sul tavolo e batti i Cecchini prima che inviino il segnale di lancio!");
          ask("Affronta i Cecchini delle Nevi per bloccare il trasmettitore:", [
            {
              t: "Sfida al Tavolo & Tiri a Effetto 🎲",
              big: true,
              fn: () => {
                K.ownMatch(window.__spiaMatch.start, {
                  title: "Sfida sulle Nevi · Stazione Radar",
                  us: "Campione 00",
                  usColor: "#38bdf8",
                  opp: { name: "I Cecchini delle Nevi", color: "#0284c7", style: "contropiede" },
                  targetGoals: 2,
                  turns: 6,
                  done: (res) => {
                    if (res.win) {
                      K.bond("freddezza", 20);
                      K.bond("gadget", 20);
                      K.questDone("radio");
                      setStep(N, 3);
                      say("dz_sterling", "[felice] Bersaglio centrato! Hai fatto carambolare la sfera oltre il raggio laser di sicurezza.");
                      say("dz_eva", "Il segnale radio è interrotto! E abbiamo le coordinate sottomarine: Monte Tuono, l'isola vulcanica segreta.");
                      say("hero", "Prepariamo il sommergibile. Questa partita si vince fino al novantesimo!");
                      fin("");
                    } else {
                      say("dz_sterling", "[triste] I Cecchini hanno intercettato il tiro sulle sponde... Riprova a dosare l'effetto!");
                      done();
                    }
                  }
                });
              }
            },
            { t: "Un istante di concentrazione.", fn: () => { say("dz_sterling", "Prenditi il tempo che serve, ma il segnale non aspetta."); done(); } }
          ]);
        } else if (s < 2) {
          say("dz_sterling", "Prima raccogli informazioni su Boris, 00: lo trovi alla funivia.");
          done();
        } else {
          say("dz_sterling", "Tutto pronto per la discesa nel cratere del vulcano. Resta concentrato!");
          done();
        }
      }
    };

    return {
      n: N,
      title: "Bersaglio sulle Nevi",
      sub: "Chalet delle Vette: funivia d'acciaio, piste ghiacciate e frequenza radio",
      start: "dz_chalet",
      introBg: "dz_chalet",
      zones,
      talk,
      goal,
      intro: () => [
        ["voce", "Vette dell'Engadina, 2.800 metri di quota. Bufera di neve e crepacci a picco sul ghiacciaio."],
        ["dz_sterling", "«La parola d'ordine è discrezione, 00: indossa la tuta da sci e ascolta le frequenze delle guardie prima di tirare a bersaglio.»"],
        ["hero", "[freddo] Fa un freddo polare qui sopra... Spero che lo smoking abbia la fodera termica."]
      ]
    };
  }

  boot();
})();
