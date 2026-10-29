// js/alcatraz2-c2.js - FUGA DA ALCATRAZ FC 2 · Capitolo 2 «I Sotterranei della Fonderia»
// Tra fango, zolfo e specchi di vapore nel Livello -2.
(function () {
  "use strict";

  function boot() {
    const D = window.__alcatraz2;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { say, done, setStep, bond, finishChapter, quest } = K;
    const ask = (prompt, opts) => K.ask("voce", prompt, opts), questDone = (id) => K.questDone(id);
    const N = 2, S = () => K.stepOf(N);

    K.cast("alc2_bruno", {
      beard: "pizzetto",
      acc: ["grembiule"],
      name: "Bruno il Barbiere",
      tag: "blue",
      hair: "#64748b",
      style: "spiky",
      skin: "#fcd34d",
      eye: "#1e3a8a",
      bg: ["#0284c7", "#0f172a"],
      shirt: "#334155"
    }, "Capitano morale dei detenuti. Continua a tagliare capelli clandestinamente tra i tubi del vapore e a dispensare saggezza tattica.");

    K.cast("alc2_gaetano", {
      beard: "baffi",
      acc: ["occhiali"],
      name: "Don Gaetano",
      tag: "gray",
      hair: "#94a3b8",
      style: "slick",
      skin: "#fed7aa",
      eye: "#451a03",
      bg: ["#78350f", "#1e293b"],
      shirt: "#451a03"
    }, "Anziano contabile dell'isola e mediano metodista. Conosce i condotti spagnoli del 1890 pietra per pietra.");

    K.cast("alc2_tonelli", {
      beard: "incolta",
      acc: ["fischietto"],
      name: "Guardia Tonelli",
      tag: "blue",
      hair: "#64748b",
      style: "slick",
      skin: "#f1f5f9",
      eye: "#1e293b",
      bg: ["#38bdf8", "#1e293b"],
      shirt: "#475569"
    }, "Ex carceriere degradato dal Consorzio per essersi rifiutato di allagare i sotterranei. Cerca redenzione aiutando i vecchi 'nemici'.");

    K.cos("alc2_c2", {
      kind: "shirt",
      label: "Gilet da manovratore idraulico con tasche rinforzate",
      val: "#334155",
      from: "Capitolo 2 di Fuga da Alcatraz FC 2"
    });

    K.lore("l_fonderia", {
      t: "I Sotterranei della Fonderia",
      d: "Livello -2 del penitenziario: caldaie a carbone dismesse, tubature in ghisa e cisterne d'acqua salmastra."
    });

    const goal = (s) => ({
      0: "Esplora il Dormitorio delle Cisterne e trova la bottega clandestina di Bruno il Barbiere.",
      1: "Parla con Don Gaetano per decifrare lo schema idraulico delle tre leve di compensazione.",
      2: "Decidi la sorte della Guardia Tonelli rinchiusa nella cella d'isolamento numero 4.",
      3: "Sfida i Sorveglianti Interni a Calcio a Parete per conquistare la chiave delle paratie."
    }[s] || "Capitolo 2 completato. Continua nel Capitolo 3.");

    const zones = {
      alc2_dormitorio: {
        region: "carcere_sommerso",
        name: "Dormitorio delle Cisterne",
        short: "Dormitorio Cisterne",
        sub: "Volte di tufo, stufa a nafta e la bottega da barbiere improvvisata",
        bg: "alc2_dormitorio",
        time: "notte",
        travel: [4, 12],
        w: 28,
        h: 20,
        start: [4, 12],
        items: [[6, 6], [22, 6], [14, 14]],
        areas: [
          [2, 2, 25, 17, "I sotterranei industriali del Livello -2"]
        ],
        flavor: {
          V: "Valvola d'intercettazione del vapore bollente.",
          R: "Gabbie d'acciaio usate come alloggi provvisori per i lavoratori forzati.",
          P: "Porta stagna verso la grande cisterna centrale."
        },
        intro: [
          ["voce", "L'odore di salmastro si mescola al profumo pungente di lavanda e brillantina."],
          ["voce", "In mezzo al fango e al vapore, Bruno ha ricreato un piccolo angolo di dignità."]
        ]
      }
    };

    const talk = {
      alc2_bruno: (K) => {
        const s = S();
        if (s === 0) {
          say([
            ["alc2_bruno", "Campione! Allora il mare non ti ha inghiottito. Sapevo che avresti risposto al messaggio."],
            ["alc2_bruno", "Guardati intorno: Alcatraz non è più quella di prima. Il Consorzio Cerbero ha militarizzato ogni angolo."],
            ["alc2_bruno", "La Comandante Vane vuole inondare il Livello -3 per cancellare le prove degli scavi clandestini e incolpare noi di una finta falla."],
            ["alc2_bruno", "Se non apriamo la valvola maestra della grande cisterna spagnola, trenta uomini annegheranno come topi nelle loro celle."]
          ], () => {
            setStep(1);
            quest("alc2_q4", "Lo Schema di Don Gaetano", "Parla con Don Gaetano vicino al quadro idraulico.");
            say([
              ["alc2_bruno", "Parla con Don Gaetano: lui ha lavorato alle pompe della Regia Marina e conosce ogni singola saracinesca di questo inferno."]
            ], done);
          });
        } else {
          say([
            ["alc2_bruno", "Il calcio è geometria del rimbalzo e sangue freddo. Quando scendiamo in campo, ricordati che giochiamo per la vita di tutti."]
          ], done);
        }
      },

      alc2_gaetano: (K) => {
        const s = S();
        if (s === 1) {
          say([
            ["alc2_gaetano", "Ti aspettavamo, ragazzo. La Cisterna Spagnola fu costruita nel 1890 per resistere all'alta marea."],
            ["alc2_gaetano", "Per abbassare il livello dell'acqua dobbiamo calibrare la pressione a 60 bar esatti. Se sbagliamo, la paratia si blocca per sempre."],
            ["alc2_gaetano", "Ma c'è un problema: la chiave del quadro di comando è nella cella 4... insieme alla Guardia Tonelli."]
          ], () => {
            setStep(2);
            questDone("alc2_q4");
            quest("alc2_q5", "La Cella di Tonelli", "Raggiungi la cella d'isolamento e decidi come trattare Tonelli.");
            say([
              ["alc2_gaetano", "Tonelli era una guardia severa, ma quando ha capito cosa voleva fare Vane, si è rifiutato di girare la valvola. Per questo lo hanno gettato in cella."]
            ], done);
          });
        } else {
          say([
            ["alc2_gaetano", "Mantieni la pressione bilanciata: troppa acqua sul campo spegne il contropiede, poca fa volare la palla sopra le traverse."]
          ], done);
        }
      },

      alc2_tonelli: (K) => {
        const s = S();
        if (s === 2) {
          say([
            ["alc2_tonelli", "Campione... sei tu? Non posso crederci. Chi l'avrebbe mai detto che sarei stato io a guardare il mondo da dietro queste sbarre."],
            ["alc2_tonelli", "Ho sbagliato tante cose tre anni fa. Ma non potevo permettere che Vane annegasse decine di persone innocenti."],
            ["alc2_tonelli", "La chiave delle paratie è nel taschino della mia giacca. Tiratemi fuori e giocherò in difesa con voi. Conosco le mosse di Cerbero."]
          ], () => {
            ask("Come decidi di gestire la Guardia Tonelli?", [
              {
                label: "🤝 Libera Tonelli e accoglilo in squadra (riscatto morale)",
                fn: () => {
                  K.bond("chiavi", 1);
                  say([
                    ["alc2_tonelli", "Grazie, Campione. Non te ne pentirai. Sui calci piazzati metterò la testa dove gli altri tirano indietro il piede."],
                    ["alc2_bruno", "Un fischietto fa sempre comodo in campo. Benvenuto nel Braccio Ovest, guardia!"]
                  ], () => {
                    setStep(3);
                    questDone("alc2_q5");
                    quest("alc2_q6", "Scontro nella Fonderia", "Sconfiggi i Sorveglianti Interni a Calcio a Parete.");
                    done();
                  });
                }
              },
              {
                label: "🗝️ Prendi solo la chiave e lascialo in cella (prudenza cinica)",
                fn: () => {
                  K.bond("chiavi", 1);
                  K.allarme(10, "Rancore tra le vecchie guardie!");
                  say([
                    ["alc2_tonelli", "Capisco... ho meritato la vostra sfiducia. Ma vi prego, salvate i ragazzi al Livello -3."],
                    ["alc2_rebecca", "Abbiamo la chiave del quadro. Ora togliamoci di mezzo i sorveglianti di pattuglia."]
                  ], () => {
                    setStep(3);
                    questDone("alc2_q5");
                    quest("alc2_q6", "Scontro nella Fonderia", "Sconfiggi i Sorveglianti Interni a Calcio a Parete.");
                    done();
                  });
                }
              }
            ]);
          });
        } else {
          say([
            ["alc2_tonelli", "Vane gioca con il fuorigioco artificiale e i contrasti sul bagnato. Non dategli punti di riferimento!"]
          ], done);
        }
      },

      alc2_sorvegliante: (K) => {
        say([
          ["alc2_sorvegliante", "Allarme intrusione! I galeotti hanno manomesso i condotti di calce!"],
          ["alc2_sorvegliante", "Fermate quel pallone o le turbine salteranno tutte!"]
        ], () => {
          ask("Sfidi la pattuglia interna a Calcio a Parete?", [
            {
              label: "⚽ Partita a Calcio a Parete (3v3)",
              fn: () => {
                K.ownMatch(window.__alcatraz2Match.start, {
                  title: "Capitolo 2 · Fonderia e Condotti di Calce",
                  teamA: "Detenuti Riuniti",
                  opp: "Sorveglianza Cerbero",
                  waterLevel: 1,
                  done: (res) => {
                    say([
                      ["alc2_bruno", res.win ? "Trionfo totale sulle lamiere incandescenti! Le guardie ripiegano verso la cisterna." : "Partita dura sul fango, ma abbiamo sfondato la linea."],
                      ["alc2_rebecca", "Attenzione! Sentite questo rombo? L'alta marea sta forzando le chiuse esterne!"],
                      ["voce", "L'acqua sale rapidamente sul pavimento: è ora di raggiungere la grande cisterna spagnola!"]
                    ], () => {
                      questDone("alc2_q6");
                      const msg = K.reward("alc2_c2", { coins: 90, cos: "alc2_c2" });
                      finishChapter(2, "alleato");
                      K.scene([["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La Partita nel Bastione Sommerso».`]], () => K.openMain(), "alc2_dormitorio");
                    });
                  }
                });
              }
            },
            {
              label: "↩️ Aspetta un momento",
              fn: () => { done(); }
            }
          ]);
        });
      }
    };

    return {
      n: N,
      title: "I Sotterranei della Fonderia",
      sub: "Tra fango, zolfo e specchi di vapore nel Livello -2",
      goal,
      start: "alc2_dormitorio",
      introBg: "alc2_dormitorio",
      zones,
      talk,
      intro: () => [
        ["voce", "Nei sotterranei umidi di Alcatraz il tempo sembra essersi fermato, ma l'odio è aumentato."],
        ["voce", "Bruno il Barbiere e Don Gaetano mantengono viva la speranza con una bottega di fortuna tra i tubi del vapore."],
        ["voce", "La vecchia guardia Tonelli è imprigionata per essersi opposta alla strage progettata dal Consorzio."]
      ]
    };
  }

  boot();
})();
