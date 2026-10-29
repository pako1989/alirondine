// js/alcatraz2-c4.js - FUGA DA ALCATRAZ FC 2 · Capitolo 4 «L'Ultima Marea»
// Corsa contro il tempo verso il molo sotto i riflettori della Torre Faro.
(function () {
  "use strict";

  function boot() {
    const D = window.__alcatraz2;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter4);
  }

  function chapter4(K) {
    const { say, done, setStep, bond, finishChapter, quest } = K;
    const ask = (prompt, opts) => K.ask("voce", prompt, opts), questDone = (id) => K.questDone(id);
    const N = 4, S = () => K.stepOf(N);

    K.cast("alc2_corvo", {
      beard: "baffi",
      acc: ["occhiali"],
      name: "Ex Direttore Corvo",
      tag: "gray",
      hair: "#475569",
      style: "slick",
      skin: "#e2e8f0",
      eye: "#0f172a",
      bg: ["#1e293b", "#0f172a"],
      shirt: "#334155"
    }, "L'ex reggente statale spodestato dal consorzio privato. Possiede le chiavi di registro e i timbri ministeriali necessari per incriminare Cerbero.");

    K.cos("alc2_c4", {
      kind: "shirt",
      label: "Giaccone cerato da timoniere di tempesta con stemmi d'ottone",
      val: "#0c4a6e",
      from: "Capitolo 4 di Fuga da Alcatraz FC 2"
    });

    K.lore("l_faro", {
      t: "La Torre Faro di Alcatraz",
      d: "Edificata nel 1909 a quaranta metri sul livello del mare. La sua lanterna di Fresnel domina la baia e segna il confine tra la prigione e la libertà."
    });

    const goal = (s) => ({
      0: "Risali le scale a chiocciola della Torre Faro mentre l'acqua allaga i livelli inferiori.",
      1: "Disattiva il proiettore ultravioletto sulla balconata della lanterna.",
      2: "Raggiungi la terrazza battuta dalla pioggia e decidi la sorte dell'Ex Direttore Corvo.",
      3: "Esegui il 'Tiro della Salvezza' per agganciare la cima d'ormeggio al motoscafo di Dario tra i flutti!"
    }[s] || "Saga conclusa.");

    const zones = {
      alc2_faro: {
        region: "carcere_sommerso",
        name: "La Balconata della Torre Faro",
        short: "Torre Faro",
        sub: "Vento di tramontana, fari di ronda e il mare aperto a perdita d'occhio",
        bg: "alc2_faro",
        time: "notte",
        travel: [6, 14],
        w: 28,
        h: 20,
        start: [6, 14],
        items: [[4, 4], [22, 4], [14, 16]],
        areas: [
          [2, 2, 25, 17, "La cima della rocca di Alcatraz"]
        ],
        flavor: {
          F: "La lente rotante di Fresnel che spazza il mare nero.",
          B: "La ringhiera di ghisa affacciata sulla scogliera a strapiombo.",
          P: "La botola di sicurezza della sala macchine del faro."
        },
        intro: [
          ["voce", "Il vento ulula a cinquanta nodi, strappando gocce d'acqua e schiuma salmastra."],
          ["voce", "Quaranta metri più sotto, tra i flutti della baia, si intravedono le luci di navigazione verdi e rosse del battello di Dario."]
        ]
      }
    };

    const talk = {
      alc2_bruno: (K) => {
        const s = S();
        if (s === 0) {
          say([
            ["alc2_bruno", "Siamo in cima alla torre! L'acqua ha sommerso completamente il Livello -3, ma tutti i compagni sono salvi sui camminamenti alti."],
            ["alc2_bruno", "Per permettere a Dario di accostare alla bitta senza farsi distruggere dai cannoni d'acqua Cerbero, dobbiamo spegnere il proiettore principale."]
          ], () => {
            setStep(1);
            quest("alc2_q10", "Spegni la Lanterna", "Interagisci con il quadro elettrico del faro per staccare il riflettore.");
            done();
          });
        } else if (s === 1) {
          say([
            ["alc2_bruno", "La leva del generatore è accanto alla lente di Fresnel. Taglia i cavi o stacca l'interruttore!"]
          ], done);
        } else if (s === 2) {
          say([
            ["alc2_bruno", "Il motoscafo è in posizione sotto la scogliera. Resta solo l'ultimo atto: calciare la cima d'ormeggio con precisione millimetrica."]
          ], done);
        } else {
          say([
            ["alc2_bruno", "È stato un onore giocare con te, Campione. Qualunque cosa accada stanotte, abbiamo ridato un'anima a questa roccia."]
          ], done);
        }
      },

      alc2_rebecca: (K) => {
        const s = S();
        if (s === 1) {
          say([
            ["alc2_rebecca", "Ci penso io alla lente! Un colpo di chiave inglese e il circuito di puntamento va in corto."]
          ], () => {
            say([
              ["voce", "<i>*ZAP!*</i> Il potente fascio di luce ultravioletta si spegne con uno scoppiettio. Il buio avvolge la baia, offrendo una copertura perfetta."],
              ["alc2_rebecca", "Guarda lassù: l'ex Direttore Corvo è uscito dall'ufficio d'archivio stringendo una valigetta di cuoio."]
            ], () => {
              setStep(2);
              questDone("alc2_q10");
              quest("alc2_q11", "Il Destino di Corvo", "Parla con l'Ex Direttore Corvo sulla balconata.");
              done();
            });
          });
        } else {
          say([
            ["alc2_rebecca", "Se decidi di trasformare quest'isola in un porto franco, io resto qui a rimettere in sesto i motori sottomarini!"]
          ], done);
        }
      },

      alc2_corvo: (K) => {
        const s = S();
        if (s === 2) {
          say([
            ["alc2_corvo", "Ragazzi... vi chiedo solo un minuto prima che saltiate su quella barca."],
            ["alc2_corvo", "In questa valigetta ci sono i contratti originali del Consorzio Cerbero e le registrazioni audio degli ordini impartiti dalla Vane."],
            ["alc2_corvo", "Se mi portate con voi a Marsiglia, testimonierò davanti al Tribunale Marittimo Internazionale. Se mi lasciate qui, Cerbero mi farà sparire nel fondo della baia."]
          ], () => {
            ask("Cosa decidi di fare con l'Ex Direttore Corvo?", [
              {
                label: "🚢 Imbarca Corvo (testimonianza per la grazia presidenziale)",
                fn: () => {
                  K.bond("chiavi", 1);
                  say([
                    ["alc2_corvo", "Grazie. Non dimenticherò questa clemenza. Avrete la piena riabilitazione legale."],
                    ["alc2_bruno", "Bene! Ora tutti pronti per il tiro decisivo."]
                  ], () => {
                    setStep(3);
                    questDone("alc2_q11");
                    quest("alc2_q12", "Il Tiro della Salvezza", "Parla con il Campione per eseguire il tiro finale sulla bitta.");
                    done();
                  });
                }
              },
              {
                label: "🏝️ Prendi solo la valigetta e lascialo sull'isola (giustizia sommaria)",
                fn: () => {
                  K.allarme(10, "Rabbia tra i vertici decaduti!");
                  say([
                    ["alc2_corvo", "Prendete le carte, allora... ma la burocrazia non vi perdonerà mai."],
                    ["alc2_rebecca", "Noi non abbiamo bisogno del perdono dei giudici: abbiamo il mare aperto!"]
                  ], () => {
                    setStep(3);
                    questDone("alc2_q11");
                    quest("alc2_q12", "Il Tiro della Salvezza", "Parla con il Campione per eseguire il tiro finale sulla bitta.");
                    done();
                  });
                }
              }
            ]);
          });
        } else {
          say([
            ["alc2_corvo", "I documenti sono intatti e protetti dal sigillo di ceralacca."]
          ], done);
        }
      },

      alc2_gaetano: (K) => {
        say([
          ["alc2_gaetano", "Io non salirò su quel barchino, figliolo. Ho ottantadue anni e le mie radici sono ormai in queste pietre del 1890."],
          ["alc2_gaetano", "Resterò qui come custode volontario del faro. Da stanotte questa luce non servirà più a dare la caccia agli evasi, ma a guidare i pescatori nella tempesta."]
        ], done);
      },

      alc2_campione: (K) => {
        const s = S();
        if (s === 3) {
          say([
            ["voce", "Quaranta metri più sotto, il motoscafo di Dario rolla tra le onde scure."],
            ["voce", "La pesante cima di canapa rinforzata è legata con un nodo scorsoio al pallone in titanio."],
            ["voce", "Un solo tiro d'interno collo deve scendere a spirale nel cono d'ombra e incastrarsi esattamente nella bitta di prua!"]
          ], () => {
            ask("Come affronti il Tiro della Salvezza?", [
              {
                label: "⚽ Calcia la Parabola Idraulica a spirale (Precisione)",
                fn: () => resolveEnding("precisione")
              },
              {
                label: "💥 Calcia di collo pieno contro la burrasca (Potenza)",
                fn: () => resolveEnding("potenza")
              }
            ]);
          });
        } else {
          say([["voce", "Preparati all'ultimo salto verso la salvezza."]], done);
        }
      }
    };

    function resolveEnding(shotType) {
      const allerta = K.stat("allerta");
      const chiavi = K.stat("chiavi");
      const her = K.getHeritage ? K.getHeritage() : "nessuno";

      // Verifica finale segreto
      if (allerta <= 35 && chiavi >= 3) {
        // Finale Segreto: Il Faro di Rondine
        finishChapter(4, "segreto");
        K.scene([
          ["voce", "<i>*SWOOSH!*</i> La sfera taglia la tempesta con una parabola perfetta: la cima si avvolge tre volte attorno alla bitta d'acciaio!"],
          ["alc2_dario", "Presa! Cima assicurata! Saltate sul cavo d'evacuazione!"],
          ["voce", "<b>FINALE SEGRETO: IL FARO DI RONDINE</b>"],
          ["voce", "Grazie alle prove schiaccianti fornite da Corvo, all'assenza di violenza e al coraggio dei detenuti, il Presidente firma la grazia plenaria per tutta la squadra del Braccio Ovest."],
          ["voce", "Don Gaetano accende la luce d'oro del faro, che da oggi splende libera."],
          ["voce", "Bruno, Sam, Rebecca e Tonelli sbarcano festanti al molo di Borgo di Rondine per una storica partita estiva davanti a tutto il paese!"]
        ], () => K.openMain(), "alc2_faro");
      } else if (shotType === "precisione" && allerta < 60) {
        // Finale 2: La Nuova Guardia
        finishChapter(4, "guardia");
        K.scene([
          ["voce", "Il tiro aggancia con successo la prua! L'evacuazione avviene con ordine e disciplina."],
          ["voce", "<b>FINALE 2: LA NUOVA GUARDIA</b>"],
          ["voce", "L'alleanza tra detenuti ed ex guardie trionfa: il penitenziario viene de-privatizzato ed entra nel patrimonio sportivo federale."],
          ["voce", "L'isola diventa una scuola calcio comunitaria gestita da Bruno e Tonelli, dove il rispetto delle regole e il rimbalzo a parete insegnano a vivere."],
          ["voce", "Il Campione riprende il largo, sapendo di aver lasciato un porto sicuro a chi non aveva futuro."]
        ], () => K.openMain(), "alc2_faro");
      } else if (allerta >= 60) {
        // Finale 3: Il Bastione Libero
        finishChapter(4, "porto_franco");
        K.scene([
          ["voce", "La cima si incastra con uno strattone violento. Le turbine idrauliche della fonderia esplodono in lontananza!"],
          ["voce", "<b>FINALE 3: IL BASTIONE LIBERO</b>"],
          ["voce", "Rebecca e gli anarchici del porto tagliano i ponti radio con il continente: Alcatraz diventa un'isola autonoma fuori dalle rotte doganali."],
          ["voce", "Un rifugio inespugnabile per battellieri, marinai e ribelli del pallone, governato solo dalla legge del calcio a parete."],
          ["voce", "Nessuna guardia oserà più sbarcare su queste scogliere."]
        ], () => K.openMain(), "alc2_faro");
      } else {
        // Finale 1: La Rotta di Marsiglia
        finishChapter(4, "marsiglia");
        K.scene([
          ["voce", "Il pallone centra la bitta. Tutti i compagni scivolano rapidi a bordo del battello di Dario."],
          ["voce", "<b>FINALE 1: LA ROTTA DI MARSIGLIA</b>"],
          ["voce", "I motori ruggiscono a pieni giri mentre la sagoma scura di Alcatraz scompare tra i banchi di nebbia marina."],
          ["voce", "Il Consorzio Cerbero viene travolto dallo scandalo mediatico internazionale."],
          ["voce", "Poche settimane dopo, sul porto vecchio di Marsiglia, Bruno apre la sua celebre bottega da barbiere: taglio, barba e racconti di rimbalzi impossibili per tutti i marinai del Mediterraneo."]
        ], () => K.openMain(), "alc2_faro");
      }
    }

    return {
      n: N,
      title: "L'Ultima Marea",
      sub: "Corsa contro il tempo verso il molo sotto i riflettori della Torre Faro",
      goal,
      start: "alc2_faro",
      introBg: "alc2_faro",
      zones,
      talk,
      intro: () => [
        ["voce", "Mentre il mare invade i sotterranei, la squadra raggiunge la sommità della Torre Faro."],
        ["voce", "Quaranta metri sopra le onde infuriate, il vento sferza i volti stanchi ma determinati dei compagni."],
        ["voce", "Solo un tiro perfetto potrà unire per sempre la rocca d'Alcatraz alla libertà!"]
      ]
    };
  }

  boot();
})();
