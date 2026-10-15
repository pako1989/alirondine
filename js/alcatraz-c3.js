// js/alcatraz-c3.js - FUGA DA ALCATRAZ FC · Capitolo 3 «La Notte dei Riflettori · La Grande Sfida Finale»
// La bufera sulla baia, la finalissima contro la squadra delle Guardie del Direttore Cardenas,
// e la scelta del destino: l'evasione in motovedetta, il patto leale di riabilitazione,
// la vita da mister-barbiere o la via segreta del tunnel sottomarino.
(function () {
  "use strict";

  function boot() {
    const D = window.__alcatraz;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { say, done, setStep, bond, finishChapter, quest } = K;
    const ask = (prompt, opts) => K.ask("voce", prompt, opts), questDone = (id) => K.questDone(id);
    const N = 3, S = () => K.stepOf(N);

    K.cos("alc_c3", {
      kind: "shirt",
      label: "Giacca da capitano della fuga in pelle nautica",
      val: "#0284c7",
      from: "Capitolo 3 di Fuga da Alcatraz FC"
    });

    K.lore("l_finale", {
      t: "La Notte dell'Eclissi",
      d: "Durante la finale tutti i riflettori convergono sul campo centrale, lasciando l'approdo nord nella penombra ideale per il compimento del destino."
    });

    const goal = (s) => ({
      0: "La tempesta infuria sul molo. Parla con il Direttore Cardenas prima del fischio d'inizio della finale.",
      1: "Raggiungi i tuoi compagni del Braccio Ovest e dai inizio alla Finalissima a Calcio a Parete!",
      2: "Partita conclusa! Raggiungi la banchina per compiere la scelta che deciderà il tuo destino."
    }[s] || "La saga di Fuga da Alcatraz FC è conclusa!");

    const zones = {
      alc_molo: {
        region: "carcere",
        name: "Molo d'Attracco e Scogliera Nord",
        short: "Molo d'Attracco",
        sub: "Onde schiumose, bitte d'ormeggio e la motovedetta sotto la pioggia",
        bg: "alc_molo",
        time: "notte",
        travel: [5, 8],
        w: 28,
        h: 18,
        start: [5, 8],
        items: [[4, 6], [22, 6], [12, 11]],
        areas: [
          [2, 2, 25, 13, "La banchina d'attracco della fortezza di Alcatraz"]
        ],
        flavor: {
          F: "Il riflettore della torre principale che sferza la pioggia battente.",
          G: "Una botola metallica bagnata da cui esce vapore caldo.",
          P: "La passerella della motovedetta delle guardie con i motori accesi."
        },
        intro: [
          ["voce", "La pioggia scroscia gelida sui lastroni di cemento della banchina."],
          ["voce", "In lontananza, le sirene della fortezza annunciano l'avvio della cerimonia della Coppa del Direttore."],
          ["voce", "Tutti gli occhi sono puntati sul rettangolo di gioco: stasera si decide la libertà."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "alc_cardenas", at: [14, 10] }, { id: "alc_tonelli", at: [18, 10] }] : []),
          ...(s === 1 ? [{ id: "alc_bruno", at: [8, 10] }, { id: "alc_sam", at: [12, 10] }, { id: "alc_malick", at: [16, 10] }] : []),
          ...(s >= 2 ? [{ id: "alc_cardenas", at: [14, 10] }, { id: "alc_bruno", at: [8, 10] }, { id: "alc_sam", at: [18, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 1, "W");
          lay(0, 16, 27, 17, "W");
          lay(0, 0, 1, 17, "W");
          lay(26, 0, 27, 17, "W");

          lay(2, 2, 25, 13, ".");

          // Mare
          lay(2, 14, 25, 15, "~");

          // Bitte d'ormeggio
          put(6, 13, "B");
          put(12, 13, "B");
          put(18, 13, "B");

          // Faro
          put(24, 3, "F");

          // Porta verso il cortile
          house(2, 2, 4, 3, {
            door: [4, 4],
            enter: { to: "alc_cortile3", at: [26, 15] }
          });
        }
      },

      alc_cortile3: {
        region: "carcere",
        name: "Cortile del Blocco Ovest",
        short: "Cortile Ovest",
        sub: "Riflettori accesi a giorno, asfalto luccicante e sponde metalliche per la finale",
        bg: "alc_cortile",
        time: "notte",
        travel: [5, 17],
        w: 32,
        h: 22,
        start: [5, 17],
        items: [[3, 6], [28, 6]],
        areas: [
          [8, 6, 24, 15, "Il campo d'asfalto recintato per la grande finale"],
          [0, 0, 31, 21, "Il Cortile di Massima Sicurezza"]
        ],
        flavor: {
          F: "I potenti riflettori alogeni puntati sul campo di gioco.",
          R: "Le sponde di lamiera zincata pronte a restituire ogni conclusione a rimbalzo.",
          G: "La grata centrale coperta da una tela cerata per non disturbare la sfera.",
          P: "Il varco illuminato verso il molo d'attracco."
        },
        intro: [
          ["voce", "Il boato delle scodelle di latta battute dai detenuti risuona tra le mura ciclopiche."],
          ["voce", "La squadra delle Guardie, schierata in tenuta nera con il Direttore in attacco, ti fissa con rispetto."]
        ],
        npcs: (s) => [
          ...(s <= 1 ? [{ id: "alc_bruno", at: [13, 10] }, { id: "alc_malick", at: [16, 7] }, { id: "alc_cardenas", at: [20, 14] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 2, "W");
          lay(0, 19, 31, 21, "W");
          lay(0, 0, 2, 21, "W");
          lay(29, 0, 31, 21, "W");

          lay(3, 3, 28, 18, ".");

          lay(7, 5, 24, 5, "R");
          lay(7, 15, 24, 15, "R");
          lay(7, 6, 7, 8, "R");
          lay(7, 12, 7, 14, "R");
          lay(24, 6, 24, 8, "R");
          lay(24, 12, 24, 14, "R");

          put(7, 9, ".");
          put(7, 10, ".");
          put(7, 11, ".");
          put(24, 9, ".");
          put(24, 10, ".");
          put(24, 11, ".");

          put(4, 3, "F");
          put(27, 3, "F");
          put(4, 18, "F");
          put(27, 18, "F");

          put(16, 10, "G");

          house(24, 16, 5, 3, {
            door: [26, 16],
            enter: { to: "alc_molo", at: [5, 8] }
          });
        }
      }
    };

    const talk = {
      alc_cardenas: (K) => {
        const s = S();
        if (s === 0) {
          say([
            ["alc_cardenas", "Matricola Moretti! Ho riesaminato la tua cartella carceraria. I tuoi precedenti dicono che sei un'ala dal dribbling devastante, non un falsario di porto."],
            ["alc_cardenas", "Stasera scendo in campo io stesso come centravanti delle Guardie. Chi vince la partita dimostra chi ha davvero il comando della Roccia."],
            ["alc_tonelli", "Tutti gli agenti sono sugli spalti. Quando fischio, si gioca alla morte senza sconti sui rimbalzi!"]
          ], () => {
            setStep(N, 1);
            quest("alc_q6", "La Finalissima della Roccia", "Raggiungi il cortile d'asfalto e sfida la selezione delle Guardie del Direttore Cardenas a Calcio a Parete.");
            done();
          });
        } else if (s === 1) {
          say([
            ["alc_cardenas", "Le sponde sono oliate e il faro centrale è sincronizzato. Che vinca il migliore!"]
          ], () => {
            ask("Iniziare la Finalissima contro le Guardie di Cardenas?", [
              {
                label: "⚽ Gioca la Finale a Calcio a Parete",
                fn: () => {
                  K.ownMatch(window.__alcatrazMatch.start, {
                    title: "Capitolo 3 · La Finalissima di Massima Sicurezza",
                    teamA: "Braccio Ovest",
                    opp: "Custodi del Direttore",
                    colA: "#38bdf8",
                    colB: "#0f172a",
                    done: (res) => {
                      say([
                        ["alc_tonelli", res.win ? "TRIPLICE FISCHIO! Il Braccio Ovest vince la Coppa di Massima Sicurezza!" : "Fischio finale! Una partita che rimarrà nella storia dell'isola!"],
                        ["alc_bruno", "Incredibile! I fari si stanno riposizionando per la premiazione. Questo è il momento che aspettavamo!"],
                        ["voce", "Tutti si stanno radunando sul molo d'attracco sotto la pioggia battente..."]
                      ], () => {
                        setStep(N, 2);
                        questDone("alc_q6");
                        quest("alc_q7", "Il Bivio della Libertà", "Raggiungi la banchina del molo e parla con Bruno e il Direttore per scegliere il tuo finale.");
                        done();
                      });
                    }
                  });
                }
              },
              {
                label: "↩️ Un momento per preparare la tattica",
                fn: () => { done(); }
              }
            ]);
          });
        } else if (s >= 2) {
          const chiavi = K.stat("chiavi");
          const allerta = K.stat("sospetto");
          const segretoDisponibile = chiavi >= 2 && allerta <= 25;

          say([
            ["alc_cardenas", "Ragazzo, non ho mai visto una geometria di tiri a rimbalzo così impeccabile in venticinque anni di servizio."],
            ["alc_bruno", "Campione, la motovedetta ha il motore acceso al minimo e le cime sono mollate. Tocca a te decidere come chiudere questa storia."]
          ], () => {
            const opzioni = [
              {
                label: "🚤 Sali sulla motovedetta con Bruno e Sam ed evadi nella notte!",
                big: true,
                fn: () => {
                  say([
                    ["hero", "La libertà è là fuori, oltre le correnti! Salpiamo!"],
                    ["alc_bruno", "Motori al massimo! Addio Alcatraz!"],
                    ["voce", "La motovedetta taglia i flutti della baia inghiottita dall'oscurità. Il Campione e i suoi compagni hanno compiuto la leggendaria evasione!"]
                  ], () => {
                    K.end("evasione");
                    const msg = K.reward("alc_c3", { coins: 120, cos: "alc_c3" });
                    finishChapter(3, "evasione");
                    questDone("alc_q7");
                    K.scene([["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Hai trovato un finale. Gli altri ti aspettano nel Diario.`]], () => K.openMain(), "alc_molo");
                  });
                }
              },
              {
                label: "📜 Firma l'accordo leale con Cardenas per la grazia presidenziale!",
                big: true,
                fn: () => {
                  say([
                    ["hero", "Direttore, abbiamo vinto con lealtà. Ora pretendo che la giustizia riconosca il mio vero nome."],
                    ["alc_cardenas", "Detto da un fuoriclasse del genere, l'onore vale più di mille sbarre. Ecco il timbro ufficiale di rilascio immediato con scuse dello Stato."],
                    ["voce", "Il Campione lascia Alcatraz da uomo libero a testa alta, con la Coppa della Libertà tra le braccia!"]
                  ], () => {
                    K.end("patto");
                    const msg = K.reward("alc_c3", { coins: 120, cos: "alc_c3" });
                    finishChapter(3, "patto");
                    questDone("alc_q7");
                    K.scene([["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Hai trovato un finale. Gli altri ti aspettano nel Diario.`]], () => K.openMain(), "alc_molo");
                  });
                }
              },
              {
                label: "💈 Resta sull'isola come allenatore ufficiale e barbiere capo!",
                big: true,
                fn: () => {
                  say([
                    ["hero", "Questo penitenziario ha bisogno di disciplina, speranza e di una vera accademia calcistica."],
                    ["alc_bruno", "Allora la bottega è nostra! Io pettino i campioni e tu disegni le traiettorie a parete."],
                    ["voce", "Alcatraz FC diventa una leggenda vivente: nessun detenuto vuole più evadere da quando c'è il torneo permanente!"]
                  ], () => {
                    K.end("barbiere");
                    const msg = K.reward("alc_c3", { coins: 120, cos: "alc_c3" });
                    finishChapter(3, "barbiere");
                    questDone("alc_q7");
                    K.scene([["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Hai trovato un finale. Gli altri ti aspettano nel Diario.`]], () => K.openMain(), "alc_molo");
                  });
                }
              }
            ];

            if (segretoDisponibile) {
              opzioni.unshift({
                label: "✨ (Segreto) Sblocca l'antico cunicolo sottomarino fenicio sotto la roccia!",
                big: true,
                fn: () => {
                  say([
                    ["hero", "Le chiavi d'ottone combaciano con la grata marina! C'è un passaggio scavato a secco che porta dritto a riva!"],
                    ["alc_malick", "Un'opera d'ingegneria millenaria rimasta sepolta per secoli sotto la sala macchine!"],
                    ["voce", "Seguendo il tunnel segreto sotto le acque della baia, il Campione emerge alle prime luci dell'alba sul molo di casa senza che nessuna sirena sia mai suonata!"]
                  ], () => {
                    K.end("segreto");
                    const msg = K.reward("alc_c3", { coins: 120, cos: "alc_c3" });
                    finishChapter(3, "segreto");
                    questDone("alc_q7");
                    K.scene([["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Hai trovato un finale. Gli altri ti aspettano nel Diario.`]], () => K.openMain(), "alc_molo");
                  });
                }
              });
            }

            ask("Quale destino scegli per la conclusione di Fuga da Alcatraz FC?", opzioni);
          });
        }
      },

      alc_bruno: (K) => {
        say([
          ["alc_bruno", "Siamo al momento decisivo. Abbiamo dimostrato che la Rondine non si chiude in gabbia."]
        ], done);
      },

      alc_sam: (K) => {
        say([
          ["alc_sam", "Ho ancora tre chiavi di scorta e una bussola nautica. Qualsiasi cosa decidi, io sono con te!"]
        ], done);
      },

      alc_malick: (K) => {
        say([
          ["alc_malick", "Le rocce di quest'isola ricorderanno per sempre i nostri contrasti puliti."]
        ], done);
      },

      alc_tonelli: (K) => {
        say([
          ["alc_tonelli", "Che partita, ragazzi! Se vi lasciano andare, giuro che vengo a fare l'abbonamento allo stadio della Rondine!"]
        ], done);
      }
    };

    return {
      n: N,
      title: "La Notte dei Riflettori · La Grande Sfida Finale",
      sub: "La tempesta sulla baia, la finale contro le Guardie di Cardenas e la scelta della libertà",
      goal,
      start: "alc_molo",
      introBg: "alc_molo",
      zones,
      talk,
      intro: () => [
        ["voce", "La notte della tempesta è calata su Alcatraz. Onde di tre metri s'infrangono con boati sordi sui muraglioni di granito."],
        ["voce", "I riflettori dell'intero penitenziario sono puntati a giorno sul campo centrale: è l'ora della grande finale tra Galeotti e Guardie."],
        ["voce", "In palio non c'è solo una coppa d'ottone, ma il destino stesso del Campione e dei suoi compagni di fuga!"]
      ]
    };
  }

  boot();
})();
