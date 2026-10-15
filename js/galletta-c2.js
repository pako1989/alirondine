// js/galletta-c2.js - S.O.S. GALLETTA · Capitolo 2 «All'Arrembaggio della Caracca Reale»
// L'inseguimento a vele spiegate tra le onde dell'Oceano della Melassa,
// i pontili basculanti tra il galeone «Masticatore» e l'imponente Caracca Reale,
// l'incontro con la navigatrice Calipso e il rigido Commodoro Cracker.
(function () {
  "use strict";
  function boot() {
    const D = window.__galletta;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("gl_commodoro", { acc: ["parrucca"], name: "Commodoro Cracker", tag: "gold", hair: "#ffffff", style: "curly", skin: "#fed7aa", eye: "#1e3a8a", bg: ["#1e3a8a", "#fef3c7"], shirt: "#1e3a8a" },
      "Ammiraglio della Flotta Reale dei Buongustai. Porta una parrucca candida incipriata di zucchero a velo e una divisa con spalline dorate: «In nome di Sua Maestà Pasticciera, ogni briciola non autorizzata verrà requisita!»");

    K.cast("gl_calipso", { streak: "#22d3ee", acc: ["bandana"], name: "Dama Calipso", tag: "blue", hair: "#451a03", style: "braid", skin: "#d97706", eye: "#15803d", bg: ["#0284c7", "#fef3c7"], shirt: "#0284c7" },
      "La timoniera e navigatrice delle spezie. Conosce le correnti sotterranee dell'oceano e legge il moto delle onde osservando come ribolle il caramello in una fiala di cristallo.");

    K.cos("gl_c2", { kind: "style", label: "Tricorno piumato con biscotto dorato", val: "tricorno", from: "Capitolo 2 di S.O.S. Galletta" });
    K.lore("l_melassa", { t: "La Melassa Imperiale", d: "Le riserve zuccherine del Gran Convoglio Reale: uno sciroppo denso che incolla ogni sfera alle reti." });
    K.lore("l_passerelle", { t: "I Pontili Basculanti", d: "Passerelle di rovere con contrappesi metallici per collegare i velieri affiancati durante l'arrembaggio." });

    const goal = (s) => ({
      0: "Il galeone naviga a vele spiegate. Raggiungi Dama Calipso al timone sul ponte.",
      1: "Aziona i comandi della passerella basculante per agganciare la Caracca Reale.",
      2: "Attraversa il pontile ed entra nella stiva della Caracca Reale per parlamentare.",
      3: "Il Commodoro rifiuta la resa! Sfida i Granatieri di Pasta Sfoglia all'Arrembaggio sul Ponte!"
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      gl_ponte: {
        region: "galeone", name: "Ponte del Galeone «Masticatore»", short: "Ponte Masticatore", sub: "Vele spiegate, timone di quercia e cannoni allineati", bg: "gl_porto", time: "giorno", travel: [6, 18],
        w: 32, h: 22, start: [7, 17], items: [[3, 6], [28, 5], [16, 17]],
        areas: [[10, 8, 22, 14, "Il ponte di comando centrale"], [0, 0, 31, 21, "Il Galeone Masticatore"]],
        flavor: {
          P: "La leva di comando della passerella basculante: azionandola il ponteggio mobile si allinea alla nave vicina.",
          K: "Uno dei sei cannoni di bronzo della fiancata, puntato dritto contro la murata della Caracca.",
          B: "Un barile cerchiato di corda con burro d'alpeggio per le scivolate di bordo.",
          A: "La ruota del grande timone di noce decorata con un biscotto di legno intagliato."
        },
        intro: [
          ["voce", "In pieno oceano! Il vento gonfia le vele del «Masticatore» a velocità vertiginosa, sollevando spruzzi di spuma salata sul ponte di comando."],
          ["voce", "A babordo, l'immensa sagoma dorata della Caracca Reale avanza scortata da stendardi e trombe imperiali. Calipso ti attende al timone."]
        ],
        npcs: (s) => [
          { id: "gl_calipso", at: [16, 6] },
          { id: "gl_barbabiscotto", at: [10, 12] }
        ],
        build(L) {
          const { lay, put } = L;
          // Murate del galeone e mare aperto
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Ponte centrale in legno
          lay(2, 4, 29, 18, "+");
          // Paratie e cordami
          lay(2, 4, 29, 4, "a"); lay(2, 18, 29, 18, "a");
          // Passerella basculante verso la caracca (a est)
          put(28, 11, "P"); put(29, 11, ">");
          // Cannoni allineati sulle murate
          [[6, 5], [12, 5], [20, 5], [24, 5]].forEach(([x, y]) => put(x, y, "K"));
          [[6, 17], [12, 17], [20, 17], [24, 17]].forEach(([x, y]) => put(x, y, "K"));
          // Barili e timone
          put(16, 5, "A"); // timone
          [[8, 10], [22, 10], [14, 14]].forEach(([x, y]) => put(x, y, "B"));
          // Varco di ritorno
          put(6, 18, "s");
        }
      },
      gl_stiva: {
        interior: true, region: "galeone", name: "Stiva della Caracca Reale", short: "Stiva Caracca", sub: "Botti dorate di melassa, sacchi di vaniglia e lampade oscillanti", bg: "gl_caracca", w: 18, h: 14, start: [2, 7], outside: ["gl_ponte", 28, 11],
        act: { B: "Ispeziona le scorte", K: "Guarda il forziere", P: "Controlla l'oblò", "<": "Torna al ponte" },
        flavor: {
          B: "Botti di rovere cerchiate d'oro massiccio colme della leggendaria Melassa Imperiale.",
          K: "Un forziere d'avorio contenente le ricette di corte di Sua Maestà Pasticciera.",
          P: "Un grande oblò di cristallo rotondo da cui si ammira l'infrangersi delle onde spumeggianti."
        },
        intro: [["voce", "La Stiva della Caracca Reale: un tempio dorato della pasticceria imperiale. Travi di legno pregiato, lanterne d'ottone che oscillano col beccheggio e centinaia di sacchi di vaniglia e zucchero finissimo."]],
        npcs: () => [
          { id: "gl_commodoro", at: [14, 7] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 13, "+"); lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 13, "a"); lay(17, 0, 17, 13, "a"); lay(0, 13, 17, 13, "a");
          put(0, 7, "<");
          lay(4, 2, 15, 2, "B"); lay(4, 11, 15, 11, "B");
          put(14, 4, "K"); put(14, 10, "K");
          put(9, 7, "P");
        }
      }
    };

    const talk = {
      gl_calipso(K) {
        const s = S();
        if (s === 0) {
          say([
            ["gl_calipso", "[regge la ruota del timone con sicurezza mentre l'onda solleva la prua] Benvenuto a poppa, cannoniere! Guarda davanti a noi: la Caracca Reale viaggia a vele piene!"],
            ["hero", "La stiamo raggiungendo! Il vento soffia esattamente dove serve."],
            ["gl_calipso", "Merito del Burro Sciabolato! Quando un galeone ha gli scarpini unti di burro e timo, scivola sulle correnti come un gabbiano in picchiata."],
            ["gl_calipso", "Prendi la ricetta corsara numero tre: ti servirà quando saliremo sulla loro coperta a disputare l'arrembaggio!"]
          ], () => {
            K.ricetta("burro", { gallette: 80, spezie: 20, pirateria: 15 }, () => {
              say([
                ["gl_calipso", "Ora corri alla passerella basculante all'estremità est del ponte. Tira la leva d'ormeggio per gettare il ponteggio sulla murata reale!"],
                ["hero", "Vado subito a incastrare i contrappesi!"]
              ], () => {
                setStep(1);
                quest("Aziona la passerella basculante sul ponte (casella P a est) per raggiungere la Caracca.");
                done();
              });
            });
          });
        } else if (s === 1) {
          say([
            ["gl_calipso", "La leva della passerella è laggiù a destra sul ponte. Tira la catena per bloccare i due vascelli!"]
          ], done);
        } else {
          say([
            ["gl_calipso", "[controlla la fiala di caramello] Il mare tiene bene, ma sento una grande corrente provenire dal Gran Forno. Sbrighiamoci col Commodoro!"]
          ], done);
        }
      },

      gl_barbabiscotto(K) {
        say([
          ["gl_barbabiscotto", "[pulisce la sciabola con uno straccio di lino] Cracker non cederà le ricette reali senza una bordata sul campo! Fagli sentire il sapore dei nostri contrasti!"]
        ], done);
      },

      gl_commodoro(K) {
        const s = S();
        if (s < 2) {
          say([
            ["gl_commodoro", "Non avete ancora i permessi doganali per calpestare il mogano imperiale! Allontanatevi!"]
          ], done);
        } else {
          say([
            ["gl_commodoro", "[sistema la parrucca incipriata e sbatte il bastone d'avorio] Corsari della Briciola! Come osate violare la stiva di Sua Maestà senza aver prima timbrato la bolla d'accompagnamento?"],
            ["hero", "Siamo qui per la Melassa Imperiale e per il pallone del Gran Forno, Commodoro. Smettetela di tassare la gioia dei marinai!"],
            ["gl_commodoro", "Insolente ragazzino! La nostra squadra, i Granatieri di Pasta Sfoglia, vanta il cento per cento di tiri all'incrocio e divise inamitate! Vi rispediremo a nuoto al vostro molo!"]
          ], () => {
            ask("Affronta la ciurma della Corona all'Arrembaggio sul Ponte?", [
              ["Accetta la Sfida Reale (Arrembaggio sul Ponte)", () => {
                K.arrembaggioMatch({
                  turns: 6,
                  us: "I Bucanieri",
                  opp: {
                    name: "Granatieri Reali",
                    color: "#1e3a8a",
                    style: "equilibrata",
                    players: [{ name: "Sergente Sfoglia" }, { name: "Alfiere Zucchero" }],
                    keeper: { name: "Commodoro Cracker" }
                  }
                }, (res) => {
                  if (res && res.win) {
                    say([
                      ["gl_commodoro", "[col tricorno ammaccato e la parrucca storta] Incredibile... la nostra formazione a rombo di marzapane è stata spazzata via dal rollio!"],
                      ["gl_barbabiscotto", "[irrompe ridendo con una cassa di melassa sotto il braccio] Vittoria schiacciante! La stiva è nostra!"]
                    ], () => {
                      ask("Quale destino scegli per i rifornimenti della Caracca Reale?", [
                        ["Patto Diplomatico con la Corona (apre via Reale)", () => {
                          K.F.set("gl_scelta_reale", true);
                          bond("pirateria", 10);
                          bond("spezie", 30);
                          say([
                            ["hero", "Commodoro, non siamo barbari. Condivideremo il segreto del Gran Forno con la corte se riconoscerete la libertà dell'Oceano."],
                            ["gl_commodoro", "[si ricompone ammirato] Un gesto da gentiluomo di mare. La Corona saprà ricompensarvi degnamente."]
                          ], () => {
                            questDone();
                            finishChapter(2, "Hai conquistato la Caracca Reale con rispetto e diplomazia, aprendo la strada verso la corte.");
                          });
                        }],
                        ["Bandiera Nera della Briciola (apre via Bucaniere)", () => {
                          K.F.set("gl_scelta_corsara", true);
                          bond("pirateria", 40);
                          bond("gallette", 120);
                          say([
                            ["hero", "Tutta la melassa appartiene ai Bucanieri! Da oggi nessuna nave della Corona viaggerà sicura senza pagare dazio in dolciumi!"],
                            ["gl_barbabiscotto", "[esulta coi marinai] YAAARRR! Questo è lo spirito dei veri lupi di mare!"]
                          ], () => {
                            questDone();
                            finishChapter(2, "Hai umiliato la Flotta Reale e requisito il tesoro di melassa, diventando una leggenda dei bucanieri.");
                          });
                        }]
                      ]);
                    });
                  } else {
                    say([
                      ["gl_commodoro", "[fa un inchino ironico] Come volevasi dimostrare: la disciplina imperiale vince sempre contro l'improvvisazione corsara! Riprova se ne hai il coraggio!"]
                    ], done);
                  }
                });
              }],
              ["Prenditi ancora un momento per studiare la stiva", done]
            ]);
          });
        }
      }
    };

    return {
      n: N,
      title: "All'Arrembaggio della Caracca Reale",
      desc: "L'inseguimento a vele spiegate, la passerella basculante, la stiva della Caracca Reale e la sfida con il Commodoro Cracker.",
      goal: () => goal(S()),
      start: "gl_ponte",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [["voce", "<b>S.O.S. GALLETTA</b> · Capitolo 2. In pieno oceano a vele spiegate! La Caracca Reale è a tiro di passerella: Calipso ti attende al timone."]];
      },
      gate(zid, tx, ty, K) {
        if (zid === "gl_ponte" && tx === 29 && ty === 11) {
          if (S() < 1) {
            say([["voce", "La passerella basculante non è ancora stata estesa. Aziona prima la leva d'ormeggio con Calipso!"]]);
            return true;
          }
          if (S() === 1) {
            say([["voce", "Tiri con forza la catena di bronzo: la passerella basculante cigola e si abbassa con uno schianto perfetto sulla fiancata della Caracca Reale!"]], () => {
              setStep(2);
              quest("Entra nella Stiva della Caracca Reale ed affronta il Commodoro Cracker.");
              K.go("gl_stiva", 2, 7);
            });
            return true;
          }
          K.go("gl_stiva", 2, 7);
          return true;
        }
        return false;
      }
    };
  }

  boot();
})();
