// js/note-c2.js - TACTICS NOTE · Capitolo 2 «Lo Scontro tra due Menti»
// L'indagine di Elle Lawliet, l'incontro furtivo con Misa Amane
// e il dilemma morale sull'utilizzo del Tactics Note.
(function () {
  "use strict";
  function boot() {
    const D = window.__note;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("qd_elle", { acc: ["occhiali"], name: "Elle Lawliet", tag: "blue", hair: "#0f172a", style: "messy", skin: "#f8fafc", eye: "#0f172a", bg: ["#0f172a", "#38bdf8"], shirt: "#f1f5f9" },
      "Misterioso analista e investigatore della federazione studentesca. Postura curva, scalzo sul parquet, consuma zollette di zucchero studiando la lavagna: «La percentuale che Raito sia il sabotatore del campionato è esattamente del 97,4%».");

    K.cast("qd_misa", { acc: ["fiore"], name: "Misa Amane", tag: "pink", hair: "#fde047", style: "twintails", skin: "#fef08a", eye: "#ec4899", bg: ["#831843", "#f472b6"], shirt: "#be185d" },
      "Ala scattante e idol delle tifoserie studentesche. Dotata di un fiuto naturale infallibile, è pronta a qualsiasi sacrificio per supportare la visione tattica di Raito.");

    K.cos("qd_c2", { kind: "shirt", label: "Felpa Bianca da Analista con cappuccio sciolto", val: "#f1f5f9", from: "Capitolo 2 di Tactics Note" });
    K.lore("l_elle_sugar", { t: "Il Metodo di Elle", d: "«Il glucosio alimenta le connessioni neuronali durante le simulazioni di gioco: una zolletta per ogni contromossa prevista»." });
    K.lore("l_misa_eyes", { t: "L'Ala dalle Due Code", d: "Misa riesce a leggere il posizionamento dei terzini con uno sguardo solo: una capacità che Raito sfrutta senza scrupoli." });

    const goal = (s) => ({
      0: "Parla con Misa Amane nel viale di Shinjuku per comprendere chi ti sta sorvegliando.",
      1: "Raggiungi la Suite di Sorveglianza ed affronta l'interrogatorio di Elle Lawliet.",
      2: "Supera la prova sul campo contro la Squadra Speciale Investigativa!",
      3: "Il secondo capitolo è concluso. Continua con il Capitolo 3."
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      qd_quartier: {
        region: "daikoku", name: "Quartier Generale Segreto", short: "Shinjuku Ovest", sub: "Palazzi moderni, riflettori della metropoli e pioggia leggera", bg: "qd_cortile", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[4, 8], [27, 8], [16, 18]],
        areas: [[10, 8, 22, 14, "Il campo recintato tra i grattacieli"], [0, 0, 31, 21, "Il piazzale d'accesso al palazzo di sicurezza"]],
        act: { q: "Entra nella Suite" },
        flavor: {
          B: "Panchine in metallo sotto le pensiline bagnate dalla pioggia.",
          P: "Lampioni moderni a luce bianca che illuminano i marciapiedi lucidi.",
          T: "Furgone di sorveglianza con antenne paraboliche sul tetto.",
          K: "Una cassetta di mele lasciata al riparo sotto un tendone."
        },
        intro: [
          ["voce", "Distretto di Shinjuku, mezzanotte passata. La pioggia cade sottile tra i grattacieli illuminati da giganteschi schermi pubblicitari."],
          ["voce", "Sotto una tettoia, Misa Amane ti aspetta stringendo un ombrello trasparente. Più in alto, all'ultimo piano di un palazzo di vetro, una sola finestra resta accesa."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "qd_misa", at: [8, 17] }] : [{ id: "qd_misa", at: [21, 14] }]),
          ...(s >= 2 ? [{ id: "qd_ryu", at: [14, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 16, 30, 19, ":"); lay(15, 7, 15, 16, ":"); lay(4, 7, 27, 7, ":");
          house(11, 2, 10, 5, { door: [16, 6], roof: "#1e293b", wall: "#475569", rr: 2, enter: { to: "qd_suite", at: [7, 9] } });
          house(22, 2, 8, 5, { door: [25, 6], roof: "#0f172a", wall: "#334155", rr: 1, enter: "Il Centro Comunicazioni: ronzio di nastri magnetici e linee riservate." });
          put(16, 9, "T"); put(26, 17, "K"); put(6, 17, "B");
          [[9, 7], [21, 7], [12, 14]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      },
      qd_suite: {
        interior: true, region: "interno", name: "Suite di Sorveglianza di Elle", short: "Suite di Elle", sub: "Cavi a terra, monitor multi-schermo e piramidi di zucchero", bg: "qd_aula", w: 16, h: 12, start: [7, 9], outside: ["qd_quartier", 16, 7],
        act: { T: "Esamina le piramidi di zucchero", L: "Controlla i monitor di sorveglianza", B: "Siediti sulla poltrona", v: "Esci sul piazzale" },
        flavor: {
          T: "Zollette di zucchero impilate con precisione millimetrica su piattini di porcellana.",
          L: "Nove schermi sincronizzati che mostrano i replay delle diagonali di Raito e del Campione.",
          B: "Una comoda poltrona girevole su cui Elle si accovaccia a piedi nudi."
        },
        intro: [["voce", "La Suite di Sorveglianza: il ronzio soffuso dei server e l'odore dolce del tè nero riempiono la stanza. Un ragazzo dai capelli spettinati e le occhiaie profonde ti fissa senza battere ciglio."]],
        npcs: () => [
          { id: "qd_elle", at: [8, 4] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "L");
          put(3, 4, "T"); put(12, 4, "T");
          put(4, 7, "B"); put(11, 7, "B");
        }
      }
    };

    const talk = {
      qd_misa(K) {
        const s = S();
        if (s === 0) {
          say([
            ["qd_misa", "[sorride agitando le due code bionde] Ti stavo aspettando! Raito mi ha raccontato che hai un talento pazzesco per le ripartenze."],
            ["hero", "Sei Misa, l'ala del club?"],
            ["qd_misa", "Esatto! Io e Raito siamo destinati a guidare il calcio del futuro. Ma c'è un problema serio: quell'investigatore strambo, Elle, ci tiene d'occhio tutti."],
            ["qd_misa", "È convinto che qualcuno stia manipolando i tempi di recupero e i falli da lontano. Vuole metterti alla prova nella sua suite."],
            ["hero", "Cosa vuole esattamente da me?"],
            ["qd_misa", "[sguardo determinato] Vuole capire se sei un alleato di Raito o se può usarti per smascherarlo. Fa' molta attenzione a ciò che dici lassù!"]
          ], () => {
            bond("intuito", 10);
            bond("giustizia", -5);
            setStep(N, 1);
            quest("qd2_elle", "L'Ermita della Lavagna", "Entra nella Suite di Sorveglianza e confrontati con Elle Lawliet.");
            done();
          });
        } else {
          say([
            ["qd_misa", "Qualunque cosa accada, io sarò sempre dalla parte di Raito. Il suo calcio perfetto è l'unica cosa che conta per me!"]
          ], done);
        }
      },

      qd_elle(K) {
        const s = S();
        if (s === 1) {
          say([
            ["qd_elle", "[sgranocchia una zolletta di zucchero tenendola con pollice e indice] Accomodati. Se ti siedi normalmente, le tue capacità deduttive caleranno del 40%."],
            ["hero", "Tu saresti il famoso investigatore Elle?"],
            ["qd_elle", "Chiamami pure Elle. Ho analizzato gli ultimi quaranta minuti del tuo test a Daikoku. Le probabilità che tu preveda le traiettorie per puro istinto sono dell'1,2%."],
            ["qd_elle", "C'è una costante geometrica nascosta nei tuoi contrasti. Esattamente come se conoscessi il secondo esatto in cui l'avversario perderà l'equilibrio."],
            ["hero", "È solo questione di allenamento e colpo d'occhio."],
            ["qd_elle", "[fissa dritto negli occhi] Mente brillante, ma risposta banale. Per verificare la mia ipotesi, ti farò affrontare la Squadra Speciale Investigativa. Se vinci senza trucchi, forse potremo collaborare."]
          ], () => {
            setStep(N, 2);
            questDone("qd2_elle");
            quest("qd2_match", "Il Test di Elle", "Affronta la Squadra Speciale Investigativa a Tactics Note!");
            K.deduci("zolletta", { intuito: 15, giustizia: 10 });
            done();
          });
        } else if (s === 2) {
          ask("qd_elle", "La Squadra Speciale è pronta sul campo coperto. Dimostrami che la tua logica non dipende da artifici occulti.", [
            {
              label: "Affronta la Squadra Speciale ▸",
              sub: "Partita Tactics Note ad alta intensità deduttiva",
              big: true,
              fn: () => {
                if (window.__quaderno && window.__quaderno.start) {
                  window.__quaderno.start({
                    opp: "Squadra Speciale Investigativa",
                    onDone: (res) => {
                      if (res.win) {
                        setStep(N, 3);
                        questDone("qd2_match");
                        bond("intuito", 25);
                        bond("giustizia", 15);
                        K.reward("qd_c2", 45);
                        say([
                          ["qd_elle", "[fa scorrere una zolletta di zucchero tra le dita] Impressionante. Hai anticipato ogni singolo taglio diagonale."],
                          ["qd_elle", "Tuttavia... il mio fiuto mi dice che qualcuno sopra di noi si sta divertendo troppo. E il fumo della finale si avvicina."],
                          ["hero", "Cosa intendi fare con Raito?"],
                          ["qd_elle", "La finale del Torneo Interscolastico sarà la resa dei conti. Se Raito sbaglierà anche una sola mossa, lo smaschererò davanti a tutta la nazione."]
                        ], () => {
                          finishChapter(2, "Elle ha riconosciuto il tuo genio tattico. Ma la finale sarà un campo di battaglia senza esclusione di colpi.");
                        });
                      } else {
                        say([
                          ["qd_elle", "I tuoi tempi di reazione sono stati lenti di 1,4 secondi. La Squadra Speciale ha chiuso ogni varco. Riprova quando hai la mente sgombra."]
                        ], done);
                      }
                    }
                  });
                } else {
                  setStep(N, 3);
                  done();
                }
              }
            },
            {
              label: "Voglio ancora riflettere",
              sub: "Rivedi i registri delle posizioni di Elle",
              fn: done
            }
          ]);
        } else {
          say([
            ["qd_elle", "La finale è vicina. Chi controlla la mente sul rettangolo verde, controlla il destino di tutti noi."]
          ], done);
        }
      },

      qd_ryu(K) {
        say([
          ["qd_ryu", "[fluttua a testa in giù sopra il tetto] Eh eh eh! Raito ed Elle sono come due gatti che si girano attorno senza graffiarsi. Sei tu l'ago della bilancia, campioncino!"]
        ], done);
      }
    };

    return {
      n: N,
      title: "Lo Scontro tra due Menti",
      sub: "L'indagine di Elle e il bivio morale prima della finalissima",
      goal,
      start: "qd_quartier",
      introBg: "qd_titolo",
      zones,
      talk
    };
  }

  boot();
})();
