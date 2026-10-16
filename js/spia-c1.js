// js/spia-c1.js - «OPERAZIONE DOPPIO ZERO · LICENZA DI CROSS» · Capitolo 1
// Capitolo 1: Al Servizio di Sua Maestà del Gol
// Il Campione arriva a Montegol per un torneo di gala ma viene scambiato per l'Agente 00.
// Bisogna travestirsi da croupier, piazzare le microspie e sfidare la squadra della sala VIP.
(function () {
  "use strict";
  function boot() {
    const D = window.__spia;
    if (!D || !D.addChapter) return setTimeout(boot, 100);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { setStep, quest } = K;
    const N = 1, S = () => K.stepOf(N);
    // adattatori al kit di saga-core: le battute si accumulano e partono insieme
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => { const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn }))); if (l.length) K.say(l, go); else go(); };
    const fin = (ending) => {
      const msg = K.reward("dz_c" + N, { coins: 70 + N * 20, cos: "dz_c" + N }), lines = flush();
      K.finishChapter(N, ending || "ok"); if (ending) K.end(ending);
      lines.push(["voce", `<b>FINE DEL CAPITOLO ${N}.</b> ${msg.join(" · ")}<br>Continua nel Capitolo ${N + 1}: si sale in quota.`]);
      K.scene(lines, () => K.openMain(), "dz_neve");
    };

    K.cos("dz_c1", { kind: "shirt", label: "Gilet da croupier di Montegol", val: "#047857", from: "Capitolo 1 di Operazione Doppio Zero" });
    K.lore("l_montegol", { t: "Montegol", d: "Riviera di lusso con casinò, yacht e scogliere: qui si gioca d'azzardo e si fa spionaggio con lo stesso sorriso." });
    K.lore("l_blizzard", { t: "La Blizzard Syndicate", d: "Consorzio del Barone von Kalt: vuole obbligare le federazioni a giocare solo sui suoi campi ghiacciati." });

    const goal = (s) => ({
      0: "Sei nel Salone del Casinò Royale. Parla con l'Agente Sterling vicino alla roulette.",
      1: "Cerca Felix il Croupier al tavolo verde: ti serve un travestimento.",
      2: "Entra nella Sala VIP (porta a est) e incontra Eva Vesper.",
      3: "Missione compiuta."
    }[s] || "Il primo capitolo è completato. Continua con il Capitolo 2.");

    const zones = {
      dz_casino: {
        region: "montegol", name: "Casinò Royale · Salone della Roulette", short: "Salone Casinò", sub: "Velluto verde, tavoli da gioco e croupier in alta uniforme", bg: "dz_casino", time: "notte",
        w: 32, h: 22, start: [6, 11], items: [[9, 6], [24, 8], [16, 17]],
        areas: [[0, 0, 31, 21, "Il salone del casinò, con lampadari di cristallo e il ticchettio delle fiches"]],
        flavor: {
          r: "Un tavolo della roulette: panno smeraldo e numero 7 rosso.",
          B: "Il bancone del barman: Martini shakerato, non mescolato.",
          V: "Vetrate blindate che danno sulla baia illuminata.",
          T: "Un terminale di sicurezza con la schermata cifrata."
        },
        intro: [
          ["voce", "Montegol, Riviera delle Palme. Luci dorate sulla scogliera e yacht ancorati nella baia."],
          ["voce", "Sei arrivato per un torneo di gala con scarpini lucidati e borsone sportivo."],
          ["voce", "All'ingresso del Casinò Royale, un uomo in smoking ti afferra per il braccio e sussurra: «Ben arrivato, Agente 00. Ti stavamo aspettando.»"]
        ],
        npcs: (s) => [
          { id: "dz_sterling", at: s === 0 ? [10, 12] : [12, 9] },
          { id: "dz_croupier", at: [20, 8] },
          { id: "dz_guard1", at: [28, 9] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(3, 11, 30, 11, ":"); lay(10, 8, 10, 16, ":"); lay(20, 9, 20, 14, ":");
          lay(4, 4, 7, 6, "r"); lay(14, 4, 18, 5, "B"); lay(22, 4, 26, 6, "V");
          lay(4, 15, 8, 18, "r"); lay(22, 15, 26, 18, "T");
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "dz_salavip", at: [3, 11] } });
        }
      },

      dz_salavip: {
        region: "montegol", name: "Casinò Royale · Sala VIP Privata", short: "Sala VIP", sub: "Panno verde deluxe, monitor radar e dossier segreti", bg: "dz_salavip", time: "notte",
        w: 32, h: 22, start: [3, 11], items: [[11, 5], [20, 16], [26, 7]],
        areas: [[0, 0, 31, 21, "La sala riservata ai membri d'oro del Club"]],
        flavor: {
          r: "Il tavolo speciale della sala VIP: fiches d'oro e panno nero.",
          T: "Il terminale satellitare della sezione tecnologica.",
          M: "Una cassaforte a muro: blindata, col quadrante dorato."
        },
        npcs: (s) => [{ id: "dz_eva", at: [16, 11] }],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(2, 11, 29, 11, ":"); lay(16, 6, 16, 16, ":");
          lay(5, 4, 8, 6, "r"); lay(22, 4, 26, 6, "T"); lay(5, 15, 8, 17, "M"); lay(23, 15, 26, 17, "r");
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "dz_casino", at: [29, 11] } });
        }
      }
    };

    const talk = {
      dz_sterling(K) {
        const s = S();
        if (s === 0) {
          say("dz_sterling", "Ascoltami bene, 00. Il Barone von Kalt è il presidente della Blizzard Syndicate.");
          say("dz_sterling", "Ha sviluppato un Cannone Criogenico orbitale per congelare gli stadi di tutto il continente.");
          say("dz_sterling", "Vuole costringere le federazioni a giocare solo sui suoi campi al polo nord.");
          say("hero", "[furbo] Sembra un piano folle. E perché proprio io?");
          say("dz_sterling", "Perché hai il miglior tiro a effetto del pianeta! Prendi questo dossier e parla con Felix il Croupier al tavolo verde.");
          say("dz_sterling", "Ti darà un travestimento per superare i bodyguard ed entrare nella Sala VIP segreta.");
          K.spiaBug("sterling", "Agente Sterling");
          K.bond("freddezza", 10);
          setStep(N, 1);
          quest("croupier", "Infiltrazione", "Parla con Felix il Croupier al tavolo verde per ottenere una copertura.");
          done();
        } else {
          say("dz_sterling", "Ricorda: eleganza e precisione. Un vero agente segreto mette sempre la sfera all'incrocio.");
          done();
        }
      },

      dz_croupier(K) {
        const s = S();
        if (s === 1) {
          say("dz_croupier", "[furbo] Rien ne va plus, signore. La parola d'ordine è: Martini shakerato.");
          say("hero", "Non mescolato. Sterling mi manda per il passe-partout della Sala VIP.");
          say("dz_croupier", "Eccolo. Indossa questo gilet da croupier ufficiale. I buttafuori ti lasceranno passare alla porta est.");
          say("dz_croupier", "E tieni d'occhio il Barone: ha scommesso un milione sulla vittoria dei suoi sicari!");
          K.spiaDisguise("croupier");
          K.spiaBug("croupier", "Felix il Croupier");
          K.bond("fascino", 15);
          setStep(N, 2);
          K.questDone("croupier");
          quest("salavip", "Sala VIP", "Entra nella Sala VIP e incontra l'esperta tecnologica Eva Vesper.");
          done();
        } else if (s === 0) {
          say("dz_croupier", "Il signore desidera puntare? Prima parli con quel tipo in smoking vicino alla roulette.");
          done();
        } else {
          say("dz_croupier", "Il numero 7 rosso porta sempre fortuna al Casinò Royale.");
          done();
        }
      },

      dz_guard1(K) {
        const dis = K.F.get("dz_disguise");
        if (dis === "croupier") {
          say("dz_guard1", "Buon turno di servizio, Felix. Puoi passare nella Sala VIP per il cambio fiches.");
          if (!K.F.get("dz_bug_guard1")) {
            say("hero", "(Mentre annuisce, gli infilo una microspia nel taschino del gilet.)");
            K.spiaBug("guard1", "Guardaspalle in Smoking");
          }
        } else {
          say("dz_guard1", "[arrabbiato] Alt! Questa porta è riservata solo al personale e ai membri d'oro del Club.");
        }
        done();
      },

      dz_eva(K) {
        const s = S();
        if (s === 2) {
          say("dz_eva", "Finalmente! Sono Eva Vesper, capo della sezione tecnologica.");
          say("dz_eva", "Ho intercettato la planimetria del rifugio alpino del Barone von Kalt.");
          say("dz_eva", "Ma la cricca dei croupier fedeli al Barone non ci lascerà uscire vivi con questi dati!");
          say("hero", "[furbo] Allora risolviamola alla vecchia maniera: una sfida a effetto sul panno verde.");
          say("dz_eva", "Ottima idea! Sfida la squadra del Casinò al Tavolo da Gioco. Se fai saltare il banco, avremo via libera!");
          ask("Vuoi iniziare la sfida contro i Croupier di Montegol?", [
            {
              t: "Sfida al Tavolo Royale 🎲",
              big: true,
              fn: () => {
                K.ownMatch(window.__spiaMatch.start, {
                  title: "Sfida al Casinò Royale · Salone VIP",
                  us: "Campione 00",
                  usColor: "#10b981",
                  opp: { name: "I Croupier di Montegol", color: "#e11d48", style: "equilibrata" },
                  targetGoals: 2,
                  turns: 6,
                  done: (res) => {
                    if (res.win) {
                      K.bond("freddezza", 20);
                      K.bond("gadget", 15);
                      K.questDone("salavip");
                      setStep(N, 3);
                      say("dz_eva", "[felice] Banco saltato! Hai messo all'incrocio un tiro a carambola straordinario.");
                      say("dz_eva", "I Croupier sono sbaragliati e abbiamo la rotta aerea del Barone: è fuggito verso le Alpi Svizzere sul suo treno-funivia.");
                      say("dz_sterling", "Ottimo lavoro, 00. Prepariamo gli sci e il passaporto diplomatico: si sale in quota!");
                      fin("");
                    } else {
                      say("dz_eva", "[triste] Le fiches hanno deviato il tiro... Riprova a calcolare la traiettoria e la carambola!");
                      done();
                    }
                  }
                });
              }
            },
            { t: "Un momento: devo riflettere.", fn: () => { say("dz_eva", "Fai con calma, 00. Il banco non scappa."); done(); } }
          ]);
        } else if (s < 2) {
          say("dz_eva", "[freddo] Siete sprovvisto di copertura. Torni quando avrà il gilet da croupier: la sala VIP ha occhi ovunque.");
          done();
        } else {
          say("dz_eva", "Tutto pronto per la partenza. Le vette svizzere ci attendono!");
          done();
        }
      }
    };

    return {
      n: N,
      title: "Al Servizio di Sua Maestà del Gol",
      sub: "Casinò Royale di Montegol: smoking, roulette e minaccia criogenica",
      start: "dz_casino",
      introBg: "dz_titolo",
      zones,
      talk,
      goal,
      intro: () => [
        ["voce", "Montegol, Riviera delle Palme. Sei arrivato per un torneo di gala con scarpini lucidati e borsone sportivo."],
        ["voce", "All'ingresso del Casinò Royale un uomo in smoking ti afferra per il braccio: «Ben arrivato, Agente 00. Ti stavamo aspettando.»"],
        ["hero", "[sorpreso] Agente 00? Veramente io gioco centravanti..."]
      ]
    };
  }

  boot();
})();
