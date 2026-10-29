// js/alcatraz2-c1.js - FUGA DA ALCATRAZ FC 2 · Capitolo 1 «La Notte del Rientro»
// Dalla nebbia di Marsiglia ai canali di scarico della Falesia Nord.
(function () {
  "use strict";

  function boot() {
    const D = window.__alcatraz2;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { say, done, setStep, bond, finishChapter, quest } = K;
    const ask = (prompt, opts) => K.ask("voce", prompt, opts), questDone = (id) => K.questDone(id);
    const N = 1, S = () => K.stepOf(N);

    // Cast dei personaggi
    K.cast("alc2_campione", {
      name: "Il Campione",
      tag: "blue",
      hair: "#475569",
      style: "slick",
      skin: "#fcd34d",
      eye: "#0369a1",
      bg: ["#0c4a6e", "#020617"],
      shirt: "#0c4a6e"
    }, "Protagonista e regista furtivo. Rientra ad Alcatraz per compiere l'ultima promessa: non lasciare nessun compagno indietro.");

    K.cast("alc2_rebecca", {
      name: "Rebecca Bullone",
      tag: "green",
      hair: "#059669",
      style: "spiky",
      skin: "#fed7aa",
      eye: "#065f46",
      bg: ["#047857", "#064e3b"],
      shirt: "#0f172a"
    }, "Sommozzatrice ribelle e tornante micidiale. Conosce le correnti della baia e le valvole sottomarine a memoria.");

    K.cast("alc2_dario", {
      beard: "incolta",
      name: "Dario degli Aironi",
      tag: "blue",
      hair: "#1e293b",
      style: "slick",
      skin: "#f59e0b",
      eye: "#1e3a8a",
      bg: ["#0284c7", "#0f172a"],
      shirt: "#1e3a8a"
    }, "Meccanico navale e pilota del battello clandestino. Fornisce supporto radio ed estrazione veloce al largo della scogliera.");

    K.cast("alc2_sam", {
      name: "Smilzo Sam",
      tag: "gold",
      hair: "#d97706",
      style: "buzz",
      skin: "#fde68a",
      eye: "#78350f",
      bg: ["#f59e0b", "#78350f"],
      shirt: "#334155"
    }, "Scassinatore ansioso e maestro di rimpalli. Ha sostituito le lime con grimaldelli in titanio ultra-flessibili.");

    K.cast("alc2_sentinella", {
      name: "Guardia Cerbero",
      tag: "red",
      hair: "#0f172a",
      style: "buzz",
      skin: "#cbd5e1",
      eye: "#dc2626",
      bg: ["#991b1b", "#450a0a"],
      shirt: "#1e293b"
    }, "Mercenario corazzato del Consorzio Privato Cerbero. Sorveglia le banchine con sensori infrarossi e marcatura a uomo spietata.");

    K.cos("alc2_c1", {
      kind: "shirt",
      label: "Muta in neoprene da infiltrazione notturna con maniche rinforzate",
      val: "#0c4a6e",
      from: "Capitolo 1 di Fuga da Alcatraz FC 2"
    });

    K.lore("l_rientro", {
      t: "L'Ultimo Rientro",
      d: "A differenza della prima fuga verso il mare aperto, questa missione richiede di nuotare controcorrente per penetrare all'interno del penitenziario."
    });

    K.lore("l_falesia", {
      t: "Falesia Nord di Alcatraz",
      d: "Scogliera a picco battuta dalla risacca. Qui sfociano i tubi delle caldaie borboniche del 1918."
    });

    const goal = (s) => ({
      0: "Porto di Marsiglia: parla con Dario e Rebecca per imbarcare l'attrezzatura da sub.",
      1: "Navigazione a luci spente: eludi i sonar delle motovedette Cerbero e sbarca alla Falesia Nord.",
      2: "Esplora la Falesia Nord: individua la Grata Divelta e prepara l'infiltrazione.",
      3: "Affronta le Sentinelle Cerbero sul pontile nella sfida a Calcio a Parete per forzare il blocco d'ingresso."
    }[s] || "Capitolo 1 concluso. Procedi nel Capitolo 2.");

    const zones = {
      alc2_falesia: {
        region: "carcere_sommerso",
        name: "Falesia Nord & Canali di Scarico",
        short: "Falesia Nord",
        sub: "Scogli neri, risacca spumeggiante e scarichi industriali delle caldaie",
        bg: "alc2_falesia",
        time: "notte",
        travel: [4, 18],
        w: 32,
        h: 24,
        start: [4, 18],
        items: [[6, 8], [24, 6], [18, 16], [28, 14]],
        areas: [
          [2, 2, 29, 21, "La scogliera della fortezza carceraria"]
        ],
        flavor: {
          F: "Riflettore ultravioletto rotante puntato sulle onde nere.",
          G: "La grata d'acciaio divelta dalla ruggine e dalle vecchie fughe.",
          B: "La banchina bagnata con le bitte d'ormeggio delle vedette.",
          P: "La porta stagna con il logo minaccioso a tre teste del Consorzio Cerbero."
        },
        intro: [
          ["voce", "La notte è gelida e il mare schiaffeggia la chiglia del battello."],
          ["voce", "La sagoma della fortezza si staglia come un gigante addormentato nel buio."],
          ["voce", "Sei tornato sull'isola da cui tutti volevano solo fuggire."]
        ]
      }
    };

    const talk = {
      alc2_dario: (K) => {
        const s = S();
        if (s === 0) {
          const her = K.getHeritage ? K.getHeritage() : "nessuno";
          let herMsg = "La Scatola Vuota ci ha salvato la pelle una volta: questa volta la riempiamo noi di galeotti liberi!";
          if (her === "evasione") {
            herMsg = "Tre anni passati con la taglia sul capo tra i porti del sud. È ora di chiudere i conti una volta per tutte con Alcatraz.";
          } else if (her === "patto") {
            herMsg = "L'ex Direttore Cardenas è stato arrestato anche lui dal Consorzio. Non abbiamo più amici lassù, solo compagni da tirare fuori.";
          } else if (her === "barbiere") {
            herMsg = "Al porto parlano ancora dei tagli di barba di Bruno. Portiamolo a casa!";
          }

          say([
            ["alc2_dario", "Motori al minimo, fari schermati. Siamo pronti a mollare gli ormeggi."],
            ["alc2_dario", herMsg],
            ["alc2_rebecca", "Le mute sono stagne, i respiratori carichi a 200 atmosfere. L'acqua è a 12 gradi, ma il vapore delle caldaie riscalderà il condotto."],
            ["alc2_sam", "Io ho preparato due serie di grimaldelli al titanio. Se mi tremano le mani sott'acqua, ricordatemi che preferisco il mare a una cella d'isolamento!"]
          ], () => {
            ask("Sei pronto a salpare per l'isola?", [
              {
                label: "🌊 Salpa nella tempesta verso la Falesia Nord",
                fn: () => {
                  setStep(1);
                  quest("alc2_q1", "Avvicinamento Furtivo", "Eludi le boe sonar e raggiungi la base della falesia rocciosa.");
                  say([
                    ["voce", "Il motoscafo scivola tra i cavalloni. Rebecca calibra l'idrometro per evitare il cono delle boe sonar."],
                    ["alc2_rebecca", "Attenzione: se tocchiamo le boe, l'allerta Cerbero salirà subito a quota 30!"]
                  ], () => {
                    setStep(2);
                    questDone("alc2_q1");
                    quest("alc2_q2", "La Grata dei Condotti", "Raggiungi la Grata Divelta vicino al condotto di scarico nord.");
                    K.scene([["voce", "Sbarco riuscito sugli scogli della Falesia Nord! La breccia è a portata di mano."]], () => K.openMain(), "alc2_falesia");
                  });
                }
              },
              {
                label: "⏳ Controlla ancora l'equipaggiamento",
                fn: () => { done(); }
              }
            ]);
          });
        } else {
          say([
            ["alc2_dario", "Io resto qui al timone a trecento metri dalla scogliera. Quando avete i compagni, fate tre fischi con la sirena e arrivo a manetta!"]
          ], done);
        }
      },

      alc2_rebecca: (K) => {
        const s = S();
        if (s === 2) {
          say([
            ["alc2_rebecca", "Guarda lassù: la grata del condotto di scarico è arrugginita, ma Cerbero ha montato una chiusa d'acciaio a pressione."],
            ["alc2_rebecca", "Abbiamo due modi per aprirla prima che la ronda del molo se ne accorga:"]
          ], () => {
            ask("Come affronti l'infiltrazione nel settore nord?", [
              {
                label: "⚡ Taglia l'alimentazione del settore (blackout immediato)",
                fn: () => {
                  K.allarme(10, "Breve calo di tensione nei circuiti secondari!");
                  say([
                    ["alc2_rebecca", "Le luci delle sentinelle tremano e si spengono. L'infiltrazione è facilitata, ma l'allarme ha destato sospetti."],
                    ["alc2_sam", "Ottimo! I cancelli elettrici si sono sbloccati. Andiamo al pontile!"]
                  ], () => {
                    setStep(3);
                    questDone("alc2_q2");
                    quest("alc2_q3", "Sfida sul Pontile", "Batti le Sentinelle Cerbero a Calcio a Parete per conquistare l'ingresso.");
                    done();
                  });
                }
              },
              {
                label: "🚰 Forzatura manuale della valvola con Rebecca (silenziosa)",
                fn: () => {
                  K.valvola(15);
                  say([
                    ["alc2_rebecca", "Una... due... spingi con la spalla! <i>*CLAC!*</i> L'acqua defluisce e la paratia sale dolcemente senza allarmi."],
                    ["alc2_rebecca", "Passaggio pulito! Ma sul pontile d'attracco ci aspettano le sentinelle della guardia privata."]
                  ], () => {
                    setStep(3);
                    questDone("alc2_q2");
                    quest("alc2_q3", "Sfida sul Pontile", "Batti le Sentinelle Cerbero a Calcio a Parete per conquistare l'ingresso.");
                    done();
                  });
                }
              }
            ]);
          });
        } else {
          say([
            ["alc2_rebecca", "Ricordati la mia Parabola Idraulica: sul bagnato il pallone schizza via a pelo d'acqua senza perdere giri!"]
          ], done);
        }
      },

      alc2_sam: (K) => {
        say([
          ["alc2_sam", "Il metallo di Alcatraz ha sempre lo stesso sapore di ruggine e sale."],
          ["alc2_sam", "Tieni sempre almeno due grimaldelli in tasca: i lucchetti Cerbero sono a doppia mandata!"]
        ], done);
      },

      alc2_sentinella: (K) => {
        say([
          ["alc2_sentinella", "Chi va là?! Settore Nord sotto giurisdizione della Sicurezza Privata Cerbero!"],
          ["alc2_sentinella", "Nessuno sbarca su quest'isola senza autorizzazione della Comandante Vane! Se volete passare, dovrete superarci sulle sponde d'acciaio!"]
        ], () => {
          ask("Inizi la sfida a Calcio a Parete contro le sentinelle?", [
            {
              label: "⚽ Sfida a Calcio a Parete (3v3)",
              fn: () => {
                K.ownMatch(window.__alcatraz2Match.start, {
                  title: "Capitolo 1 · Il Pontile della Falesia Nord",
                  teamA: "I Ripescati",
                  opp: "Sentinelle Cerbero",
                  waterLevel: 1,
                  done: (res) => {
                    say([
                      ["alc2_sentinella", res.win ? "Maledizione! Quei rimbalzi a quarantaquattro gradi hanno bucato la linea difensiva!" : "Resistenza dura, ma abbiamo tenuto la banchina!"],
                      ["alc2_rebecca", "Varco conquistato! La paratia stagna si sta aprendo, presto, dentro prima che arrivino i rinforzi!"],
                      ["voce", "Hai aperto il varco nei condotti e conquistato la Muta da Infiltrazione!"]
                    ], () => {
                      questDone("alc2_q3");
                      const msg = K.reward("alc2_c1", { coins: 80, cos: "alc2_c1" });
                      finishChapter(1, "infiltrato");
                      K.scene([["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «I Sotterranei della Fonderia».`]], () => K.openMain(), "alc2_falesia");
                    });
                  }
                });
              }
            },
            {
              label: "↩️ Prendi tempo",
              fn: () => { done(); }
            }
          ]);
        });
      }
    };

    return {
      n: N,
      title: "La Notte del Rientro",
      sub: "Dalla nebbia di Marsiglia ai canali di scarico della Falesia Nord",
      goal,
      start: "alc2_falesia",
      introBg: "alc2_titolo",
      zones,
      talk,
      intro: () => [
        ["voce", "Marsiglia, tre anni dopo la grande fuga. Un messaggio su carta oleata firmato da Bruno il Barbiere ha riaperto una ferita mai rimarginata."],
        ["voce", "Il penitenziario è ora nelle mani della spietata compagnia privata Cerbero, e i vecchi compagni sono intrappolati nei livelli sommersi."],
        ["voce", "Per salvarli non devi più fuggire: devi compiere l'ultimo rientro nelle viscere dell'isola!"]
      ]
    };
  }

  boot();
})();
