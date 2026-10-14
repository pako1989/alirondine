// js/roma-c3.js - AVE CALCIO! · Capitolo 3 «La Notte del Colosseo»
// La grande finalissima all'Anfiteatro Flavio sotto la luna e i bracieri accesi:
// cinquanta mila spettatori, Cesare in trono, la sfida a «Circo Massimo»
// e i 4 bivi che decreteranno il tuo destino nell'Urbe eterna.
(function () {
  "use strict";
  function boot() {
    const D = window.__roma;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cos("rm_c3", { kind: "shirt", label: "Mantello purpureo dei Ludi", val: "#7f1d1d", from: "Capitolo 3 di Ave Calcio!" });

    const goal = (s) => ({
      0: "La folla ruggisce. Raggiungi il Colosseo per la finale dei Ludi Maximi.",
      1: "Parla con Spartaco e Cesare prima dell'ingresso trionfale sulla sabbia.",
      2: "Scendi nell'arena monumentale e gioca la finale a Circo Massimo!",
      3: "La coppa d'alloro è tua! Cesare e il Senato attendono la tua scelta finale."
    }[s] || "La saga di Ave Calcio! è conclusa.");

    const zones = {
      rm_colosseo: {
        region: "colosseo", name: "Roma Antica · Anfiteatro Flavio (Colosseo)", short: "Colosseo", sub: "Gradinate di travertino, bracieri ardenti e sabbia dorata", bg: "rm_colosseo", time: "notte", travel: [4, 18],
        w: 32, h: 22, start: [4, 18], items: [[2, 6], [29, 6], [16, 19]],
        areas: [[10, 8, 22, 14, "La sabbia dell'arena centrale"], [0, 0, 31, 21, "Il Colosseo"]],
        flavor: {
          t: "La tribuna d'onore di Cesare: velluti porpora, aquile dorate e guardie immobili.",
          C: "Le arcate maestose del Colosseo illuminate dalle torce.",
          B: "Grandi bracieri di rame che proiettano ombre gigantesche sulle mura."
        },
        intro: [
          ["voce", "Il Colosseo nella notte: cinquantamila voci intonano canti di battaglia. I bracieri ardono lungo tutto il perimetro delle gradinate."],
          ["voce", "Al centro dell'arena, l'obelisco di marmo e la Coppa d'Alloro risplendono sotto la luce della luna."]
        ],
        npcs: (s) => [
          { id: "rm_spartaco", at: [8, 14] },
          { id: "rm_cesare", at: [16, 8] },
          { id: "rm_furbio", at: [24, 14] },
          { id: "rm_augusta", at: [12, 9] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 17, 30, 19, ":"); lay(15, 8, 15, 17, ":"); lay(4, 8, 27, 8, ":");
          put(16, 15, "S");
          [[6, 8], [26, 8], [10, 16], [22, 16]].forEach(([x, y]) => put(x, y, "C"));
          [[12, 7], [20, 7]].forEach(([x, y]) => put(x, y, "B"));
          lay(6, 5, 26, 5, "E");
          put(4, 17, "s");
        }
      }
    };

    const talk = {
      rm_spartaco(K) {
        const s = S();
        if (s <= 1) {
          say([
            ["rm_spartaco", "[battendo il pugno sul cuore corazzato] Fratello mio, il momento è giunto. Tutta la plebe di Roma è aggrappata ai parapetti per vedere il nostro gioco."],
            ["rm_spartaco", "Non lottiamo per il sangue, lottiamo per dimostrare che anche chi è partito dal fango della Suburra può toccare le stelle con un pallone."],
            ["hero", "Insieme fino al triplice fischio, Spartaco!"]
          ]);
          setStep(2);
        } else if (s === 2) {
          say([["rm_spartaco", "Il corno di Gannico sta per suonare! All'attacco!"]]);
        } else if (s >= 3) {
          presentChoice(K);
        }
      },
      rm_cesare(K) {
        const s = S();
        if (s <= 1) {
          say([
            ["rm_cesare", "[con corona d'alloro e scettro imperiale] Campione! Roma attende lo spettacolo più grande che la storia ricordi."],
            ["rm_cesare", "Fai trionfare la bellezza del calcio e avrai l'eterna stima dell'impero!"]
          ]);
          setStep(2);
        } else if (s >= 3) {
          presentChoice(K);
        }
      },
      rm_furbio(K) {
        say([["rm_furbio", "[nervoso, giocherellando con una borsa di monete] Ricordati di me quando alzerai la coppa, ragazzo! Il dieci per cento va all'impresario!"]]);
      },
      rm_augusta(K) {
        const s = S();
        if (s === 2) {
          ask("La folla intona il coro: scendi sulla sabbia per la Grande Finale?", [
            ["Inizia la Finale (Circo Massimo)", () => {
              say([
                ["voce", "ROMA! ROMA! AVE VICTOR!"],
                ["voce", "I corni da guerra risuonano nell'anfiteatro. Il pallone di cuoio rotola al centro della sabbia dorata."],
                ["hero", "Per la gloria eterna dell'Urbe!"]
              ]);
              K.circoMatch({
                turns: 6,
                us: "Gladiatori S.P.Q.R.",
                opp: { name: "I Campioni dell'Aquila", color: "#1e3a8a", style: "pressing" }
              }, (res) => {
                if (res.win) {
                  say([
                    ["voce", "GOL! GOL LEGGENDARIO! LA PALLA VOLA OLTRE L'OBELISCO!"],
                    ["voce", "Cinquantamila romani si alzano in piedi agitando le toghe! Una pioggia di foglie d'alloro cade dalle gradinate!"],
                    ["rm_cesare", "[levandosi in piedi col pollice alto] Degno degli dei immortali! Nessun gladiatore ha mai mostrato una simile grandezza!"],
                    ["rm_spartaco", "Ce l'abbiamo fatta! La vittoria appartiene a tutti noi!"],
                    ["rm_augusta", "La profezia si è compiuta! Gloria al Campione!"]
                  ]);
                  bond("gloria", 50);
                  bond("cesare", 60);
                  K.giveCos("rm_c3");
                  setStep(3);
                  presentChoice(K);
                } else {
                  say([
                    ["rm_cesare", "La palla ha baciato il palo! Riprenditi, campione: Roma ti concede una seconda discesa nell'arena!"]
                  ]);
                }
              });
            }],
            ["Un istante", () => say([["rm_augusta", "Gli dei attendono, ma l'ora del trionfo è vicina!"]])]
          ]);
        } else {
          say([["rm_augusta", "Le stelle danzano sopra il Colosseo in tuo onore!"]]);
        }
      }
    };

    function presentChoice(K) {
      const ses = K.stat("sesterzi");
      const glo = K.stat("gloria");
      const ces = K.stat("cesare");
      const items = (K.items && K.items()) || 0;

      const opts = [
        ["Diventa Tribuno della Plebe", () => {
          say([
            ["hero", "Cesare, chiedo solo una cosa: che il calcio sia un diritto di ogni cittadino della Suburra e che i campetti non vengano mai privatizzati dal Senato."],
            ["rm_cesare", "[commosso] Concesso! Da oggi sei il Tribuno Perpetuo dello Sport. Nessun patrizio potrà mai togliere il pallone ai ragazzi della plebe!"],
            ["rm_spartaco", "Una scelta nobile, degna dei più grandi saggi dell'umanità."],
            ["voce", "La plebe di Roma festeggia per sette giorni e sette notti, cantando il nome del leggendario Tribuno dal Piede Alato!"]
          ]);
          finishChapter(N, { ending: "tribuno" });
        }],
        ["Accetta la Toga d'Oro con Furbio", () => {
          say([
            ["hero", "Senatore Furbio, il potere e i sesterzi governano il mondo. Entriamo insieme in Senato a dettare le leggi della Repubblica!"],
            ["rm_furbio", "[esulta abbracciando il sacco di monete] Sapevo che eri un uomo pratico! Compreremo tutte le squadre della penisola italica!"],
            ["voce", "Diventi il Console dell'Arena più ricco e potente di Roma: le tue scommesse e le tue ville ad Ostia entrano nella leggenda del lusso."]
          ]);
          finishChapter(N, { ending: "console" });
        }],
        ["Riparti come Gladiatore Errante", () => {
          say([
            ["hero", "Ho giocato per la gioia della sfida e per la sabbia sotto i sandali. Non voglio scranni in Senato né palazzi di marmo."],
            ["hero", "[appoggi la corona d'alloro sulla spina dell'arena e ti incammini verso la Via Appia con il borsone in spalla]"],
            ["rm_cesare", "Un uomo veramente libero. Che i venti proteggano sempre il tuo cammino, campione."],
            ["voce", "Mentre lasci le mura dell'Urbe, il canto del Colosseo ti accompagna all'orizzonte verso nuove terre da conquistare a colpi di tacco."]
          ]);
          finishChapter(N, { ending: "libero" });
        }]
      ];

      // Finale Segreto: L'Alloro d'Oro degli Dei
      if (items >= 3 || ces >= 50) {
        opts.push(["Svela il Segreto dell'Arco (Segreto)", () => {
          say([
            ["hero", "Fermatevi tutti. La Sibilla aveva ragione: c'è un'iscrizione segreta alla base dell'Arco di Trionfo..."],
            ["hero", "[estrai dal piedistallo l'antico Pallone degli Dei forgiato in oro zecchino e alloro divino]"],
            ["rm_augusta", "L'Oracolo di Vulcano! Il pallone primordiale con cui gli dei giocarono alla creazione del cosmo!"],
            ["rm_cesare", "Questo reperto sacro sarà custodito nel Tempio di Giove Capitolino, testimone eterno dell'unione tra Roma e la grazia dello sport!"],
            ["voce", "Hai svelato il più grande mistero dell'antichità classica, entrando nell'olimpo immortale delle leggende dello sport!"]
          ]);
          finishChapter(N, { ending: "segreto" });
        }]);
      }

      ask("Quale destino imperiale scegli per il tuo Campione?", opts);
    }

    return {
      n: N,
      title: "La Notte del Colosseo",
      desc: "La resa dei conti all'Anfiteatro Flavio e la consacrazione della tua leggenda nell'Urbe.",
      goal: () => goal(S()),
      zones,
      talk,
      intro: () => {
        setStep(0);
        K.teleport("rm_colosseo", 4, 18);
      }
    };
  }

  boot();
})();
