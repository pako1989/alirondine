// js/spia-c3.js - «OPERAZIONE DOPPIO ZERO · LICENZA DI CROSS» · Capitolo 3
// Capitolo 3: Operazione Thunderball · Il Gelo Finale
// Infiltrazione finale nel covo sottomarino del vulcano di Monte Tuono.
// Raggi laser di sicurezza, conto alla rovescia del Cannone Criogenico e i quattro finali di saga.
(function () {
  "use strict";
  function boot() {
    const D = window.__spia;
    if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 100);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { setStep, quest } = K;
    const N = 3, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => { const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn }))); if (l.length) K.say(l, go); else go(); };
    const fin = (ending) => {
      const msg = K.reward("dz_c" + N, { coins: 70 + N * 20, cos: "dz_c" + N }), lines = flush();
      K.finishChapter(N, ending || "diplomatico"); if (ending) K.end(ending);
      lines.push(["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Gli altri finali ti aspettano nel Diario delle Saghe.`]);
      K.scene(lines, () => K.openMain(), "dz_casino");
    };

    K.cos("dz_c3", { kind: "shirt", label: "Smoking nero dell'Agente 00", val: "#0f172a", from: "Capitolo 3 di Operazione Doppio Zero" });
    K.lore("l_vulcano", { t: "Il Covo del Vulcano", d: "Base segreta del Barone von Kalt, scavata nel cono vulcanico di Monte Tuono: turbine a lava e paratie di titanio." });

    const goal = (s) => ({
      0: "Sei sul Pontile del Magma. Parla con Eva Vesper per bypassare la barriera laser.",
      1: "Convinci la Sentinella Corazzata, con la tuta da tecnico, a farti passare.",
      2: "Entra nella Sala Master 00 e affronta il Barone von Kalt.",
      3: "Scegli come concludere la missione."
    }[s] || "La storia è compiuta! Puoi rivivere le scelte dal Diario.");

    const zones = {
      dz_base: {
        region: "bunker", name: "Covo del Vulcano · Pontile del Magma", short: "Base Vulcanica", sub: "Paratie blindate in titanio, vapori sulfurei e fotocellule laser", bg: "dz_base", time: "notte",
        w: 32, h: 22, start: [6, 11], items: [[9, 6], [24, 8], [16, 17]],
        areas: [[0, 0, 31, 21, "Il pontile d'acciaio sospeso sul magma, sorvegliato da generatori laser"]],
        flavor: {
          G: "Magma ribollente a pochi passi: il calore sale a ondate.",
          L: "Un generatore laser: la fotocellula rossa segue ogni movimento.",
          T: "Il terminale di disattivazione della griglia di sicurezza.",
          M: "Un quadro elettrico in titanio con spie lampeggianti."
        },
        intro: [
          ["voce", "Isola di Monte Tuono. Nascosto nel cono vulcanico sorge il covo iper-tecnologico del Barone von Kalt."],
          ["voce", "Fiumi di magma scorrono sotto le paratie d'acciaio mentre le turbine geotermiche ronzano a piena potenza."]
        ],
        npcs: (s) => [
          { id: "dz_eva", at: s === 0 ? [10, 12] : [12, 9] },
          { id: "dz_guard_base", at: [20, 8] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(1, 2, 2, 19, "G");
          lay(3, 11, 30, 11, ":"); lay(10, 8, 10, 16, ":"); lay(20, 9, 20, 14, ":");
          lay(5, 4, 8, 5, "L"); lay(14, 4, 18, 5, "T"); lay(22, 4, 26, 6, "M");
          lay(5, 15, 8, 18, "L"); lay(22, 15, 26, 18, "M");
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "dz_bunker", at: [3, 11] } });
        }
      },

      dz_bunker: {
        region: "bunker", name: "Sala Master 00 · Covo di von Kalt", short: "Sala Master", sub: "Schermi giganti a fosfori verdi, cannone criogenico e panno del boss", bg: "dz_bunker", time: "notte",
        w: 32, h: 22, start: [3, 11], items: [[11, 5], [20, 16], [26, 7]],
        areas: [[0, 0, 31, 21, "La sala di comando, dominata dallo schermo del Cannone Criogenico"]],
        flavor: {
          T: "Una console del Cannone Criogenico: conto alla rovescia a tre cifre.",
          L: "Un generatore energetico che ronza a pieno regime.",
          r: "Il tavolo imperiale della sfida finale, panno nero e fiches di onice."
        },
        npcs: (s) => [{ id: "dz_kalt", at: [16, 11] }],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(2, 11, 29, 11, ":"); lay(16, 6, 16, 16, ":");
          lay(5, 4, 8, 6, "T"); lay(22, 4, 26, 6, "L"); lay(5, 15, 8, 17, "L"); lay(23, 15, 26, 17, "r");
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "dz_base", at: [29, 11] } });
        }
      }
    };

    const finalizeSaga = () => {
      const bugs = K.F.get("dz_bug_count") || 0;
      say("dz_kalt", "[arrabbiato] No! Il raggio criogenico... l'invertitore di polarità ha fatto esplodere i generatori!");
      say("dz_sterling", "[felice] Il mondo del calcio è salvo! Il Cannone si è liquefatto in vapore inoffensivo.");
      say("dz_eva", "Grande Campione! Sei riuscito a neutralizzare la minaccia con classe assoluta!");
      const options = [];
      if (bugs >= 6) {
        options.push({
          t: "Attiva il Protocollo Segreto 00-Rondine (Finale Segreto) 🌟",
          big: true,
          fn: () => {
            say("hero", "Inserisco la microspia master nel terminale: codice 00-Rondine confermato.");
            say("dz_eva", "Incredibile! Hai scaricato l'intero archivio segreto senza lasciare traccia nei log di sicurezza!");
            say("dz_sterling", "Una prestazione leggendaria. Sei il miglior agente della storia dei Servizi.");
            fin("segreto");
          }
        });
      }
      options.push({
        t: "Consegna il dossier al Ministero (Finale Diplomatico) 🎖️",
        big: true,
        fn: () => {
          say("hero", "Consegniamo von Kalt e i suoi dossier al tribunale della federazione sportiva.");
          say("dz_sterling", "Giustizia è fatta alla luce del sole. Riceverai la medaglia d'oro al valore spionistico.");
          fin("diplomatico");
        }
      });
      options.push({
        t: "Svanisci nella notte di Montegol senza testimoni (Finale Ombra) 🕶️",
        big: true,
        fn: () => {
          say("hero", "La mia missione finisce qui. Non cerco medaglie: il mio posto è in campo con gli scarpini.");
          say("dz_eva", "Un vero agente segreto fino all'ultimo secondo. Il tuo nome resterà una leggenda sussurrata.");
          fin("ombra");
        }
      });
      options.push({
        t: "Fai saltare il banco in diretta al Casinò Royale (Finale Spettacolo) 🍸",
        big: true,
        fn: () => {
          say("hero", "Stasera si festeggia al Casinò Royale: Martini per tutti e roulette libera!");
          say("dz_sterling", "Champagne ghiacciato e parata in smoking sulla riviera: brindiamo al Campione!");
          fin("spettacolo");
        }
      });
      ask("Come vuoi concludere la missione dell'Agente 00?", options);
    };

    const talk = {
      dz_eva(K) {
        const s = S();
        if (s === 0) {
          say("dz_eva", "La barriera laser d'ingresso è attiva: un raggio rosso a fotocellule blocca il ponte.");
          say("dz_eva", "Indossa questa tuta da elettricista dei laser: bypassi la console senza far scattare nulla.");
          say("hero", "[furbo] Lascia fare a me: riprogrammo i contatti con un tocco d'effetto.");
          K.spiaDisguise("tecnico");
          K.bond("gadget", 15);
          setStep(N, 1);
          quest("laser", "Bypass Laser", "Parla con la Sentinella Corazzata travestito da tecnico.");
          done();
        } else {
          say("dz_eva", "La porta della Sala Master è aperta! Il Barone è dentro: vai, 00!");
          done();
        }
      },

      dz_guard_base(K) {
        const s = S();
        const dis = K.F.get("dz_disguise");
        if (dis === "tecnico" && s === 1) {
          say("dz_guard_base", "Ah, la manutenzione delle turbine. Sbrigati: il Barone non tollera ritardi sul conto alla rovescia!");
          say("hero", "(Mentre firma il registro, gli lascio una microspia nel cinturone.)");
          K.spiaBug("guardia_base", "Sentinella Corazzata");
          setStep(N, 2);
          K.questDone("laser");
          quest("boss", "La Sfida Finale", "Entra nella Sala Master 00 e affronta il Barone von Kalt.");
          done();
        } else if (s >= 2) {
          say("dz_guard_base", "Passa, tecnico. La Sala Master è oltre quella porta.");
          done();
        } else {
          say("dz_guard_base", "[arrabbiato] Allarme intrusione! Nessuno accede senza divisa da tecnico!");
          done();
        }
      },

      dz_kalt(K) {
        const s = S();
        if (s === 2) {
          say("dz_kalt", "[ride] Ah ah ah! Finalmente ci incontriamo, signor... o dovrei dire Agente 00?");
          say("dz_kalt", "Guarda quel monitor: il Cannone Criogenico è puntato sul cerchio di centrocampo dello stadio più glorioso del mondo.");
          say("dz_kalt", "Un solo colpo e novantamila spettatori vedranno congelarsi il pallone a mezz'aria!");
          say("hero", "[furbo] Sei solo un cattivo da film di spionaggio con una mira pessima, Barone.");
          say("dz_kalt", "Pessima? Te lo dimostro subito! I miei Sicari d'Élite sono schierati su questo tavolo: se perdi, il mondo gelerà per sempre!");
          ask("Scegli come affrontare il Barone von Kalt nella resa dei conti finale:", [
            {
              t: "Sfida al Tavolo Royale contro i Sicari 🎲",
              big: true,
              fn: () => {
                K.ownMatch(window.__spiaMatch.start, {
                  title: "Sfida Finale · Il Gelo di von Kalt",
                  us: "Campione 00",
                  usColor: "#ffd23f",
                  opp: { name: "I Sicari del Barone von Kalt", color: "#e11d48", style: "pressing" },
                  targetGoals: 3,
                  turns: 7,
                  done: (res) => {
                    if (res.win) {
                      K.questDone("boss");
                      setStep(N, 3);
                      finalizeSaga();
                    } else {
                      say("dz_kalt", "[ride] Il freddo ti annebbia la vista, 00! Ricarico il cannone mentre cerchi il tiro giusto!");
                      done();
                    }
                  }
                });
              }
            },
            { t: "Un attimo, il conto alla rovescia può aspettare.", fn: () => { say("dz_kalt", "[ride] Il tempo è il mio miglior alleato, Agente."); done(); } }
          ]);
        } else if (s < 2) {
          say("dz_kalt", "[arrabbiato] Come è entrato qui?! Guardie!");
          done();
        } else {
          K.say([["dz_kalt", "Il Cannone è disinnescato... La Blizzard Syndicate dichiara bancarotta..."]], K.done);
        }
      }
    };

    // a missione conclusa (step 3): il Barone ripropone la scelta finale se non completata
    const origKalt = talk.dz_kalt;
    talk.dz_kalt = (K2) => { if (S() === 3 && !K.stepOf(4)) { finalizeSaga(); } else origKalt(K2); };

    return {
      n: N,
      title: "Operazione Thunderball · Il Gelo Finale",
      sub: "Covo del Vulcano: turbine a lava, conto alla rovescia e i quattro finali",
      start: "dz_base",
      introBg: "dz_bunker",
      zones,
      talk,
      goal,
      intro: () => [
        ["voce", "Isola di Monte Tuono. Nel cono vulcanico sorge il covo iper-tecnologico del Barone von Kalt."],
        ["dz_sterling", "«Ci siamo, 00. Il conto alla rovescia del Cannone Criogenico è iniziato: mancano solo tre minuti all'allineamento orbitale!»"],
        ["hero", "[furbo] Non accadrà. Uno zero a zero non mi è mai piaciuto: figuriamoci un doppio zero sotto zero!"]
      ]
    };
  }

  boot();
})();
