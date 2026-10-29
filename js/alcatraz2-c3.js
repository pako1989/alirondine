// js/alcatraz2-c3.js - FUGA DA ALCATRAZ FC 2 · Capitolo 3 «La Partita nel Bastione Sommerso»
// Calcio a pelo d'acqua nella grande cisterna centrale.
(function () {
  "use strict";

  function boot() {
    const D = window.__alcatraz2;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { say, done, setStep, bond, finishChapter, quest } = K;
    const ask = (prompt, opts) => K.ask("voce", prompt, opts), questDone = (id) => K.questDone(id);
    const N = 3, S = () => K.stepOf(N);

    K.cast("alc2_vane", {
      name: "Comandante Vane (Vipera)",
      tag: "red",
      hair: "#0f172a",
      style: "slick",
      skin: "#f8fafc",
      eye: "#0284c7",
      bg: ["#991b1b", "#0f172a"],
      shirt: "#f8fafc"
    }, "Direttrice cinica del Consorzio Cerbero e portiere formidabile. Considera il calcio solo fisica dei fluidi e balistica militare.");

    K.cast("alc2_corazziere", {
      name: "Corazziere Cerbero",
      tag: "red",
      hair: "#0f172a",
      style: "buzz",
      skin: "#e2e8f0",
      eye: "#dc2626",
      bg: ["#7f1d1d", "#1e293b"],
      shirt: "#0f172a"
    }, "Difensore d'élite della scorta di Vane. Usa la stazza e il peso della corazza per bloccare ogni rimbalzo a parete.");

    K.cos("alc2_c3", {
      kind: "shirt",
      label: "Casacca da capitano del Bastione Sommerso con strisce idrorepellenti",
      val: "#0284c7",
      from: "Capitolo 3 di Fuga da Alcatraz FC 2"
    });

    K.lore("l_cisterna", {
      t: "La Cisterna Spagnola",
      d: "Arena ottagonale in pietra vulcanica risalente al 1890. Raccoglieva le acque piovane della fortezza ed è dotata di paratie pneumatiche a 45 gradi."
    });

    const goal = (s) => ({
      0: "Entra nella Cisterna del Bastione Sommerso e attiva la Matrice Idraulica.",
      1: "Calibra le tre valvole a muro con Don Gaetano e Rebecca per raggiungere 60 bar di pressione.",
      2: "Ascolta il discorso tattico di Bruno il Barbiere prima della grande sfida.",
      3: "Affronta la Comandante Vane e i Corazzieri Cerbero nella Partita del Bastione Sommerso."
    }[s] || "Capitolo 3 concluso. Procedi nel Capitolo 4.");

    const zones = {
      alc2_cisterna: {
        region: "carcere_sommerso",
        name: "La Cisterna del Bastione Sommerso",
        short: "Bastione Sommerso",
        sub: "Specchio d'acqua turchese, paratie a molla e getti d'acqua ad alta pressione",
        bg: "alc2_cisterna",
        time: "notte",
        travel: [6, 12],
        w: 30,
        h: 22,
        start: [6, 12],
        items: [[4, 4], [25, 4], [15, 18]],
        areas: [
          [2, 2, 27, 19, "L'arena idraulica del Bastione Sommerso"]
        ],
        flavor: {
          V: "La valvola maestra di fondo: un enorme timone di ghisa con catena di sicurezza.",
          G: "Paratia elastica scanalata montata su molle pneumatiche.",
          C: "Specchio d'acqua salmastra limpido e riflettente alto 20 centimetri."
        },
        intro: [
          ["voce", "L'acqua è fredda e arriva alle caviglie, producendo piccoli cerchi concentrici a ogni passo."],
          ["voce", "Dall'alto della passerella blindata, la Comandante Vane vi osserva con un sorriso gelido."]
        ]
      }
    };

    const talk = {
      alc2_vane: (K) => {
        const s = S();
        if (s === 3) {
          say([
            ["alc2_vane", "Benvenuti nella mia cisterna, signori. Credevate davvero che una muta da sub e un po' di nostalgia carceraria bastassero a fermare il Consorzio Cerbero?"],
            ["alc2_vane", "Questo penitenziario produce milioni grazie ai contratti minerari sottomarini. Non lascerò che un manipolo di galeotti rovini il bilancio trimestrale."],
            ["alc2_vane", "Volete la valvola di scarico per salvare i vostri amici? Dovrete segnarmi un gol da queste sponde allagate. Ma tra i pali della Cerbero, la fisica è una legge immutabile!"]
          ], () => {
            ask("Inizi la Partita del Bastione Sommerso contro la Comandante Vane?", [
              {
                label: "⚽ Sfida Ufficiale: Bastione Sommerso (3v3)",
                fn: () => {
                  K.ownMatch(window.__alcatraz2Match.start, {
                    title: "Capitolo 3 · La Sfida della Cisterna Centrale",
                    teamA: "Detenuti di Rondine",
                    opp: "Corazzieri Cerbero",
                    waterLevel: 1,
                    done: (res) => {
                      say([
                        ["alc2_vane", res.win ? "Impossibile! Come ha fatto quel tiro a curvare a pelo d'acqua senza perdere portanza?!" : "Un pareggio o una sconfitta... ma la marea non aspetta nessuno!"],
                        ["alc2_rebecca", "Ce l'abbiamo fatta! Il rimbalzo a 45 gradi ha beffato la Vipera! La valvola maestra è sotto il nostro controllo!"]
                      ], () => {
                        ask("Come regoli il flusso d'acqua della valvola maestra?", [
                          {
                            label: "💻 Allaga la sala server di Vane (distrugge i contratti e incrimina Cerbero)",
                            fn: () => {
                              K.valvola(30);
                              K.allarme(15, "Sovraccarico nei server blindati di Cerbero!");
                              say([
                                ["voce", "Un torrente d'acqua invade la sala controllo: dischi fissi e documenti d'appalto vanno in cortocircuito con lampi bluastri."],
                                ["alc2_vane", "Pazzi! Avete distrutto dieci anni di archivio societario!"]
                              ], finishC3);
                            }
                          },
                          {
                            label: "🚰 Devia verso lo scarico rapido (evacuazione immediata e pulita)",
                            fn: () => {
                              K.valvola(-20);
                              say([
                                ["voce", "Le paratie si sollevano con un sibilo possente: il livello dell'acqua nei cunicoli scende, liberando tutti i prigionieri del Livello -3."],
                                ["alc2_bruno", "I ragazzi sono salvi! Stanno già risalendo i montacarichi verso la superficie!"]
                              ], finishC3);
                            }
                          }
                        ]);
                      });
                    }
                  });
                }
              },
              {
                label: "⏳ Rivedi lo schema con Bruno",
                fn: () => { done(); }
              }
            ]);
          });
        } else {
          say([
            ["alc2_vane", "Ogni secondo perso è un metro cubo d'acqua marina che sale nelle gallerie inferiori."]
          ], done);
        }
      },

      alc2_bruno: (K) => {
        const s = S();
        if (s === 0) {
          K.waterGate(1);
          say([
            ["alc2_bruno", "Siamo dentro la Cisterna Ottagonale. Sentite come risuonano i passi? Sulle sponde metalliche il pallone acquista una velocità doppia."],
            ["alc2_bruno", "Rebecca, Gaetano: calibrate la pressione. Dobbiamo portare i manometri a 60 bar per stabilizzare il galleggiamento."]
          ], () => {
            setStep(1);
            quest("alc2_q7", "La Pressione di 60 Bar", "Aziona le valvole a muro per impostare la pressione esatta.");
            done();
          });
        } else if (s === 1) {
          say([
            ["alc2_bruno", "Controlla le tre valvole lungo il perimetro. Quando l'ago del manometro centrale è fermo sul verde, siamo pronti."]
          ], done);
        } else if (s === 2) {
          say([
            ["alc2_bruno", "Ascoltatemi tutti: Vane in porta non sbaglia una parata classica. L'unico modo per batterla è usare le sponde metalliche a 45 gradi e colpire le valvole a muro."],
            ["alc2_rebecca", "Io partirò in fascia: appena la palla schizza sulla lamiera, tiro rasoiata tesa!"],
            ["alc2_tonelli", "Io terrò fermi i Corazzieri sui contrasti. Nessuno toccherà il Campione."]
          ], () => {
            setStep(3);
            questDone("alc2_q8");
            quest("alc2_q9", "La Sfida contro Vane", "Parla con la Comandante Vane per disputare la grande partita.");
            done();
          });
        } else {
          say([
            ["alc2_bruno", "Palla a terra, testa alta e nessun timore. Abbiamo giocato contro ben peggio di quattro guardie in uniforme bianca!"]
          ], done);
        }
      },

      alc2_gaetano: (K) => {
        const s = S();
        if (s === 1) {
          say([
            ["alc2_gaetano", "Ecco la valvola della paratia nord. Giriamola in senso orario..."]
          ], () => {
            K.valvola(30);
            say([
              ["alc2_gaetano", "Perfetto! 60 bar esatti. Il livello dell'acqua è stabilizzato a pelo d'erba sintetica."]
            ], () => {
              setStep(2);
              questDone("alc2_q7");
              quest("alc2_q8", "Il Briefing del Barbiere", "Parla con Bruno per definire lo schieramento 3v3.");
              done();
            });
          });
        } else {
          say([
            ["alc2_gaetano", "Sfrutta le correnti generate dai rimbalzi: il pallone galleggia e non affonda."]
          ], done);
        }
      }
    };

    function finishC3() {
      questDone("alc2_q9");
      const msg = K.reward("alc2_c3", { coins: 100, cos: "alc2_c3" });
      K.waterGate(2);
      finishChapter(3, "sommerso");
      K.scene([
        ["voce", "<i>*BOOOM!*</i> Un boato scuote le fondamenta dell'isola: l'alta marea ha sfondato il diaframma esterno."],
        ["voce", "L'acqua comincia a salire fino alle ginocchia. L'unica salvezza è salire alla Torre Faro!"],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 4: «L'Ultima Marea».`]
      ], () => K.openMain(), "alc2_cisterna");
    }

    return {
      n: N,
      title: "La Partita nel Bastione Sommerso",
      sub: "Calcio a pelo d'acqua nella grande cisterna centrale",
      goal,
      start: "alc2_cisterna",
      introBg: "alc2_cisterna",
      zones,
      talk,
      intro: () => [
        ["voce", "La monumentale cisterna spagnola è un'arena ottagonale allagata, dove l'eco amplifica ogni colpo."],
        ["voce", "La Comandante Vane attende tra i pali, convinta che il potere del denaro e della violenza sia imbattibile."],
        ["voce", "È il momento di dimostrare che il calcio dei fuggiaschi sa piegare anche le leggi del Consorzio!"]
      ]
    };
  }

  boot();
})();
