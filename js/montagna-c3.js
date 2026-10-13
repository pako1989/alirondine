// js/montagna-c3.js - PICCOLO BORGO DI MONTAGNA · Capitolo 3 «La Bufera di Carta»
// La grande finale della Coppa di Montagna sotto la tempesta di neve e carta crespa,
// il confronto finale con il Sindaco Valanga, la partita decisiva a «Ritagli»
// contro la Rappresentativa della Valle e i quattro finali della saga.
(function () {
  "use strict";
  function boot() {
    const D = window.__montagna;
    if (!D || !D.addChapter || !D._has || !D._has(2)) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cos("bm_c3", { kind: "shirt", label: "Maglia a scacchi del Piccolo Borgo", val: "#0284c7", from: "Capitolo 3 di Piccolo Borgo di Montagna" });
    K.cos("bm_coppa", { kind: "acc", label: "Coppa di compensato e nastro adesivo", val: "coppa", from: "Finale «Campioni del mondo di carta»" });
    K.cos("bm_boiler", { kind: "acc", label: "Etichetta d'oro del Boiler 1984", val: "medaglia", from: "Finale «Il segreto dello scaldabagno»" });
    K.cos("bm_bandiera", { kind: "acc", label: "Fascia della Polisportiva Libera", val: "fascia", from: "Finale «La rivolta dei cittadini»" });
    K.cos("bm_fiocco", { kind: "acc", label: "Fiocco di neve di carta eterno", val: "fiore", from: "Finale segreto «La palla di neve perfetta»" });

    const ITEMZ = ["bm_piazza", "bm_lago", "bm_campo"];
    function allItems() {
      try {
        const r = K.api.trRec(), Z = K.api.TRZ;
        return ITEMZ.every((z) => {
          const n = ((Z[z] && Z[z].items) || []).length;
          return !n || ((r.got && r.got[z]) || []).length >= n;
        });
      } catch (e) { return false; }
    }

    const goal = (s) => ({
      0: "La bufera infuria sul Piccolo Borgo. Tutti si sono radunati al Campo di Compensato.",
      1: "Nello spogliatoio: il Sindaco Valanga e Wendy discutono sul destino della squadra.",
      2: "Scendi in campo per la Finale contro la Rappresentativa della Valle a Ritagli!",
      3: "La finale è vinta: riunisciti in piazza per proclamare il finale del Piccolo Borgo.",
    }[s] || "La saga del Piccolo Borgo è conclusa. Puoi rigiocarla per sbloccare tutti i finali.");

    const zones = {
      bm_campo: {
        region: "campo", name: "Piccolo Borgo · Il Campo di Compensato", short: "Campo", sub: "Spalti di cartone grezzo, riflettori a lampadina e bufera", bg: "bm_campo", time: "tramonto", travel: [16, 20],
        w: 32, h: 22, start: [16, 20], items: [[2, 4], [29, 4], [16, 1]],
        areas: [[6, 6, 26, 16, "Il rettangolo di gioco"], [0, 0, 31, 21, "Il Campo del Borgo"]],
        flavor: {
          t: "Gli spalti di compensato: gremiti di cittadini imbacuccati con sciarpe di lana e megafoni di carta.",
          l: "I riflettori: vecchie lampadine a incandescenza protette da barattoli di vetro.",
          P: "Uno striscione dipinto a tempera: «FORZA BORGO · IL CARTONE NON CEDE»."
        },
        intro: [
          ["voce", "Il Campo di Compensato del Piccolo Borgo sotto la bufera di neve. Fiocchi grandi come monete cadono a scatti a 12 fotogrammi al secondo."],
          ["voce", "Sugli spalti di cartone non c'è un posto libero: Boris distribuisce cioccolata fumante, Sbruffo controlla che nessuno festeggi oltre i decibel consentiti e Wendy coordina la squadra."]
        ],
        npcs: (s) => [
          { id: "bm_boris", at: [14, 17] },
          { id: "bm_wendy", at: [18, 17] },
          { id: "bm_valanga", at: [10, 17] },
          { id: "bm_sbruffo", at: [22, 17] }
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, "w"); // manto nevoso
          lay(5, 5, 27, 16, "g"); // cartone di gioco
          lay(14, 17, 18, 20, ":"); // accesso spogliatoi
          house(2, 16, 6, 4, { door: [5, 19], roof: "#0284c7", wall: "#f8fafc", rr: 1, enter: "Lo spogliatoio riscaldato: una stufa enorme, panche di pino e la lavagna tattica di Wendy." });
          lay(4, 4, 28, 4, "S"); lay(4, 17, 28, 17, "S");
          [[3, 8], [29, 8], [3, 13], [29, 13]].forEach(([x, y]) => put(x, y, "P"));
          [[1, 2], [30, 2], [15, 2]].forEach(([x, y]) => put(x, y, "A"));
          put(8, 18, "F"); put(24, 18, "F");
          put(16, 19, "s");
        }
      }
    };

    function finalePartita() {
      K.ritagliMatch({
        title: "La Grande Finale · contro la Rappresentativa della Valle",
        intro: "Finale per la Coppa di Cartone! Scatta a molla tra le folate di neve e buca la rete avversaria!",
        turns: 8,
        opp: {
          name: "Rappresentativa della Valle",
          color: "#dc2626",
          players: [{ name: "Capitano Ghiaccio" }, { name: "Valanga Jr." }]
        }
      }, (r) => {
        if (!r.win) {
          return K.scene([
            ["bm_boris", "[incoraggiante] La bufera ha deviato il pallone piatto all'ultimo secondo! Non mollare: pulisci la neve dalle lamine e riproviamo subito!"]
          ], () => K.enterZone("bm_campo"), "bm_campo");
        }
        setStep(N, 3);
        questDone("bm_finale_match");
        K.emergenza("finale", { fiducia: 4, assurdo: 2 }, () => {
          apriConclusione();
        });
      });
    }

    function apriConclusione() {
      const haScaldabagno = F.is("bm_scaldabagno_scoperto");
      const fiducia = K.stat("fiducia");
      const boris = K.stat("boris");
      const allItemsOk = allItems();

      const options = [];

      if (haScaldabagno) {
        options.push({
          label: "«Mostra a tutti l'etichetta del boiler del 1984!»",
          sub: "Finale: Il Segreto dello Scaldabagno",
          cls: "hot",
          fn: () => concludiFinale("scaldabagno")
        });
      }

      if (fiducia >= 5) {
        options.push({
          label: "«Sfiducia il Sindaco e fonda la Polisportiva Libera»",
          sub: "Finale: La Rivolta dei Cittadini",
          fn: () => concludiFinale("politica")
        });
      }

      options.push({
        label: "«Alza la Coppa di Cartone al cielo insieme al borgo!»",
        sub: "Finale: Campioni del Mondo di Carta",
        fn: () => concludiFinale("cartone")
      });

      if (allItemsOk && boris >= 4) {
        options.push({
          label: "«Chiedi a Boris la leggendaria Palla di Neve Perfetta»",
          sub: "Finale Segreto: La Palla di Neve Perfetta",
          cls: "gold",
          fn: () => concludiFinale("segreto")
        });
      }

      ask("bm_wendy", "ABBIAMO VINTO LA COPPA! Il borgo è in festa tra i coriandoli di carta crespa! Cosa facciamo adesso?", options, "bm_campo");
    }

    function concludiFinale(tipo) {
      F.set("bm_fin_" + tipo, true);
      const msg = K.reward("c3:bm", { coins: 150, cos: ["bm_c3", "bm_" + (tipo === "scaldabagno" ? "boiler" : tipo === "politica" ? "bandiera" : tipo === "segreto" ? "fiocco" : "coppa")] });
      finishChapter(N, tipo);
      setStep(N, 5);

      const sceneMap = {
        scaldabagno: [
          ["voce", "Tiri fuori dalla tasca la vecchia targhetta del 1984 e la mostri alla folla."],
          ["bm_valanga", "[sbianca] Il... il galleggiante della caldaia! La mia reputazione è rovinata!"],
          ["bm_boris", "[ride di cuore] Ma che rovinata! Abbiamo vinto la coppa più importante della regione grazie a un boiler! Cittadini, propongo il Boiler di Valanga come mascotte ufficiale del Piccolo Borgo!"],
          ["bm_sbruffo", "[annulla le multe] Approvato all'unanimità! Da oggi niente multe a chi saluta il boiler!"],
          ["voce", `🏆 <b>FINALE 1: IL SEGRETO DELLO SCALDABAGNO.</b> ${msg.join(" · ")}<br>Il borgo elegge il boiler a gloria cittadina tra fiumi di cioccolata calda.`]
        ],
        politica: [
          ["bm_wendy", "[sale sulla panca] Cittadini del Piccolo Borgo! Il calcio non appartiene ai decreti del sindaco né alle sue megalomanie! Oggi nasce la Polisportiva Libera Autogestita di Montagna!"],
          ["bm_valanga", "[protesta debolmente] Ma la mia pelliccia... la mia fascia..."],
          ["bm_boris", "Ti faremo fare il guardalinee d'onore, Valanga! Da oggi giochiamo tutti insieme, senza bandiere politiche e con porte aperte a tutti."],
          ["voce", `🏆 <b>FINALE 2: LA RIVOLTA DEI CITTADINI.</b> ${msg.join(" · ")}<br>Nasce la Polisportiva Libera di Montagna, gestita democraticamente con amore e cartone.`]
        ],
        cartone: [
          ["bm_boris", "[solleva la coppa] ECCOLA! Tagliata a mano con le forbici da sartoria e incollata con nastro adesivo da pacchi! La Coppa di Cartone più bella del mondo!"],
          ["bm_valanga", "[commosso] Una vittoria monumentale! Fuochi d'artificio di carta crespa per tutti!"],
          ["bm_sbruffo", "[fischia felice] Straordinario! Per oggi concedo un'ora di deroga al coprifuoco invernale!"],
          ["voce", `🏆 <b>FINALE 3: CAMPIONI DEL MONDO DI CARTA.</b> ${msg.join(" · ")}<br>Accetti in pieno la gloriosa e assurda tradizione alpina, diventando la leggenda vivente del borgo.`]
        ],
        segreto: [
          ["bm_boris", "[ti prende da parte con un sorriso complice] {n}, hai raccolto ogni singolo ritaglio e hai creduto in noi fin dalla prima tazza di cioccolata."],
          ["bm_boris", "Guarda qui: (prende una manciata di neve fresca e la comprime con un gesto antico). Non è cartone. È la Palla di Neve Perfetta. Densità zero, traiettoria invisibile, calore nel cuore."],
          ["voce", "Tocchi la sfera di neve pura: non si scioglie e pulsa di una luce candida. Nessuna porta al mondo potrà mai fermare il tuo tiro."],
          ["voce", `⭐ <b>FINALE SEGRETO: LA PALLA DI NEVE PERFETTA.</b> ${msg.join(" · ")}<br>Hai scoperto il segreto più intimo e magico delle vette innevate.`]
        ]
      };

      K.scene(sceneMap[tipo] || sceneMap.cartone, () => K.openMain(), "bm_campo");
    }

    const talk = {
      bm_wendy() {
        const s = S();
        if (s === 0) {
          return K.scene([
            ["bm_wendy", "[determinata] È il momento che aspettavamo. Tutta la valle è venuta a vederci. Hanno schierato i loro giocatori migliori, ma noi abbiamo il gioco a molla più rapido."],
            ["bm_wendy", "Entra in campo e parla con Boris quando sei pronto per il fischio d'inizio!"]
          ], () => {
            setStep(N, 1);
            quest("bm_finale_match", "La Grande Finale", "Parla con Boris al Campo di Compensato e dai inizio alla partita.");
            done();
          }, "bm_campo");
        }
        if (s >= 3) {
          return apriConclusione();
        }
        return say([["bm_wendy", "Concentrati sulle sponde di compensato: i loro difensori non sanno calcolare i rimbalzi a forbice!"]]);
      },
      bm_boris() {
        const s = S();
        if (s === 1) {
          return ask("bm_boris", "Le sagome sono cariche, le molle sono tese e la cioccolata negli spogliatoi è pronta per il dopo-partita. Pronto a scendere in campo per la finale?", [
            { label: "Fischio d'inizio! Gioca la Finale a Ritagli", sub: "Partita decisiva per il Borgo", cls: "hot", fn: finalePartita },
            { label: "Un attimo di riscaldamento", fn: done }
          ], "bm_campo");
        }
        if (s === 2) {
          return ask("bm_boris", "La Rappresentativa della Valle ti aspetta sul campo di compensato!", [
            { label: "Entra in campo!", cls: "hot", fn: finalePartita },
            { label: "Aspetta", fn: done }
          ], "bm_campo");
        }
        if (s >= 3) {
          return apriConclusione();
        }
        return say([["bm_boris", "Sento l'odore della vittoria... o forse è la cannella nella cioccolata!"]]);
      },
      bm_valanga() {
        return say([["bm_valanga", "Ho già preparato il discorso trionfale. Dodici pagine di metafore alpine! Non deludetemi!"]]);
      },
      bm_sbruffo() {
        return say([["bm_sbruffo", "Se vincete, giuro che non farò multe a nessuno fino a domani alle 7:59!"]]);
      }
    };

    return {
      n: N,
      title: "La Bufera di Carta",
      sub: "La finalissima della Coppa, la bufera stop-motion, la scelta sul boiler e i 4 finali",
      goal,
      start: "bm_campo",
      introBg: "bm_campo",
      zones,
      talk,
      intro: () => [
        ["voce", "<b>PICCOLO BORGO DI MONTAGNA</b> · Capitolo 3. La nevicata si trasforma in una gloriosa bufera di carta. Sugli spalti di compensato il paese trema dall'emozione. È l'ora della finale!"]
      ]
    };
  }

  boot();
})();
