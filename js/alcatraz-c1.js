// js/alcatraz-c1.js - FUGA DA ALCATRAZ FC · Capitolo 1 «L'Arrivo sull'Isola e la Maglia a Strisce»
// L'arrivo in motovedetta nella baia nebbiosa, l'immatricolazione,
// l'incontro nel cortile con Bruno il Barbiere e Smilzo Sam,
// e la prima sfida a «Calcio a Parete» tra i blocchi di massima sicurezza.
(function () {
  "use strict";

  function boot() {
    const D = window.__alcatraz;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    // Cast dei personaggi
    K.cast("alc_cardenas", {
      beard: "baffi",
      acc: ["occhiali"],
      name: "Direttore Cardenas",
      tag: "gray",
      hair: "#334155",
      style: "slick",
      skin: "#e2e8f0",
      eye: "#0f172a",
      bg: ["#1e293b", "#0f172a"],
      shirt: "#0f172a"
    }, "Il granitico direttore di Alcatraz. Crede nella ferrea disciplina carceraria, nella campana del silenzio e nella superiorità tattica della squadra delle guardie.");

    K.cast("alc_bruno", {
      beard: "pizzetto",
      acc: ["grembiule"],
      name: "Bruno il Barbiere",
      tag: "blue",
      hair: "#1e293b",
      style: "spiky",
      skin: "#fcd34d",
      eye: "#1e3a8a",
      bg: ["#0284c7", "#0f172a"],
      shirt: "#334155"
    }, "Barbiere clandestino del Braccio Ovest e regista illuminato della squadra dei detenuti. Taglia le difese avversarie con la stessa precisione chirurgica con cui rifinisce le basette.");

    K.cast("alc_sam", {
      acc: ["chiave"],
      name: "Smilzo Sam",
      tag: "gold",
      hair: "#d97706",
      style: "buzz",
      skin: "#fed7aa",
      eye: "#78350f",
      bg: ["#f59e0b", "#78350f"],
      shirt: "#475569"
    }, "Ala sgusciante e maestro di grimaldelli. Conosce ogni fessura delle mura ed è imbattibile sui rimpalli a quarantaquattro gradi contro le lamiere.");

    K.cast("alc_malick", {
      acc: ["fascia"],
      name: "Malick la Roccia",
      tag: "",
      hair: "#000",
      style: "buzz",
      skin: "#78350f",
      eye: "#1c1917",
      bg: ["#334155", "#020617"],
      shirt: "#1e293b"
    }, "Stopper impenetrabile. Non arretra di un millimetro nei contrasti e legge le poesie dei classici francesi prima di ogni calcio d'inizio.");

    K.cast("alc_tonelli", {
      beard: "incolta",
      acc: ["fischietto"],
      name: "Guardia Tonelli",
      tag: "blue",
      hair: "#64748b",
      style: "slick",
      skin: "#f1f5f9",
      eye: "#1e293b",
      bg: ["#38bdf8", "#1e293b"],
      shirt: "#1e3a8a"
    }, "Guardia giurata con il fischietto facile e un debole per il calcio di provincia. Chiude un occhio sulle partitelle purché non si calpesti l'aiuola del Direttore.");

    K.cos("alc_c1", {
      kind: "shirt",
      label: "Casacca da carcerato a strisce bianche e blu notte",
      val: "#1e293b",
      from: "Capitolo 1 di Fuga da Alcatraz FC"
    });

    K.lore("l_alcatraz", {
      t: "La Roccia d'Alcatraz",
      d: "Forte carcerario eretto su un'isola spazzata da raffiche umide e circondato da riflettori rotanti ad alta intensità."
    });

    K.lore("l_rebound", {
      t: "Calcio a Parete",
      d: "Nel cortile le sponde metalliche permettono passaggi a compasso e tiri a rimbalzo diagonale ad altissima velocità."
    });

    const goal = (s) => ({
      0: "Sei arrivato nel cortile del carcere. Parla con Guardia Tonelli vicino al portone d'ingresso.",
      1: "Raggiungi il campo d'asfalto e parla con Bruno il Barbiere per farti spiegare le regole del cortile.",
      2: "Esamina la grata di scolo e consulta Malick la Roccia in difesa.",
      3: "Tutto è pronto! Sfida i Detenuti del Braccio Est a Calcio a Parete!"
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      alc_cortile: {
        region: "carcere",
        name: "Cortile del Blocco Ovest",
        short: "Cortile Ovest",
        sub: "Asfalto bagnato, fari di ronda e porte di ferro recintate",
        bg: "alc_cortile",
        time: "notte",
        travel: [5, 17],
        w: 32,
        h: 22,
        start: [5, 17],
        items: [[3, 6], [28, 6], [16, 18]],
        areas: [
          [8, 6, 24, 15, "Il campo d'asfalto recintato dalle sponde metalliche"],
          [0, 0, 31, 21, "Il Cortile di Massima Sicurezza"]
        ],
        flavor: {
          F: "La torretta di guardia con il riflettore alogeno puntato sull'asfalto.",
          R: "La recinzione metallica coi cartelli di divieto d'avvicinamento.",
          G: "Una pesante grata di scolo da cui proviene odore di vapore e mare.",
          P: "La porta blindata scorrevole che conduce al blocco celle interne."
        },
        intro: [
          ["voce", "La motovedetta si allontana rapida tra le creste schiumose della baia. Sei sulla banchina d'Alcatraz."],
          ["voce", "Un clamoroso scambio di documenti all'ufficio postale ti ha assegnato il numero di matricola del celebre 'Lupo di Mare'."],
          ["voce", "Ora indossi una casacca a strisce verticali e il rumore degli scarponi risuona sul cemento umido."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "alc_tonelli", at: [7, 17] }] : [{ id: "alc_tonelli", at: [22, 17] }]),
          ...(s >= 1 ? [{ id: "alc_bruno", at: [13, 10] }, { id: "alc_sam", at: [19, 10] }] : []),
          ...(s >= 2 ? [{ id: "alc_malick", at: [16, 7] }] : []),
          ...(s >= 3 ? [{ id: "alc_cardenas", at: [20, 14] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          // Mura perimetrali
          lay(0, 0, 31, 2, "W");
          lay(0, 19, 31, 21, "W");
          lay(0, 0, 2, 21, "W");
          lay(29, 0, 31, 21, "W");

          // Pavimentazione del cortile
          lay(3, 3, 28, 18, ".");

          // Campo di calcio a parete con sponde metalliche (R)
          lay(7, 5, 24, 5, "R");
          lay(7, 15, 24, 15, "R");
          lay(7, 6, 7, 8, "R");
          lay(7, 12, 7, 14, "R");
          lay(24, 6, 24, 8, "R");
          lay(24, 12, 24, 14, "R");

          // Porte (aperte tra 9 e 11)
          put(7, 9, ".");
          put(7, 10, ".");
          put(7, 11, ".");
          put(24, 9, ".");
          put(24, 10, ".");
          put(24, 11, ".");

          // Fari torretta
          put(4, 3, "F");
          put(27, 3, "F");
          put(4, 18, "F");
          put(27, 18, "F");

          // Grata di scolo centrale
          put(16, 10, "G");

          // Ingresso al blocco celle
          house(24, 16, 5, 3, {
            door: [26, 16],
            enter: { to: "alc_celle", at: [6, 10] }
          });
        }
      },

      alc_celle: {
        region: "carcere",
        name: "Braccio Ovest e Barberia",
        short: "Braccio Ovest",
        sub: "Celle con sbarre d'acciaio, passerelle metalliche e la bottega di Bruno",
        bg: "alc_celle",
        time: "notte",
        travel: [6, 10],
        w: 24,
        h: 16,
        start: [6, 10],
        items: [[3, 6], [18, 6]],
        areas: [
          [2, 2, 21, 13, "Il corridoio del Braccio Ovest di Alcatraz"]
        ],
        flavor: {
          R: "Le sbarre metalliche delle celle numerate.",
          P: "La porta di legno e vetro smerigliato con la scritta 'Barberia & Servizi'.",
          G: "Una bocchetta d'aerazione coperta da una griglia svitata a metà."
        },
        intro: [
          ["voce", "L'eco dei passi rimbalza sul pavimento di ghisa del braccio detentivo."],
          ["voce", "L'aria sa di sapone da barba a buon mercato, tabacco trinciato e salsedine della baia."]
        ],
        npcs: (s) => [
          { id: "alc_sam", at: [12, 8] }
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 23, 1, "W");
          lay(0, 14, 23, 15, "W");
          lay(0, 0, 1, 15, "W");
          lay(22, 0, 23, 15, "W");

          // Corridoio centrale aperto
          lay(2, 4, 21, 12, ".");

          // Fila celle superiori (sbarre R a riga 2-3 con aperture)
          lay(2, 2, 21, 3, "R");
          put(6, 3, ".");
          put(12, 3, ".");
          put(18, 3, ".");

          // Uscita verso il cortile
          house(2, 11, 4, 3, {
            door: [4, 11],
            enter: { to: "alc_cortile", at: [22, 17] }
          });
        }
      }
    };

    const talk = {
      alc_tonelli: (K) => {
        const s = S();
        if (s === 0) {
          say([
            ["alc_tonelli", "Ehi tu, matricola 418! Cammina dritto e non guardare le torrette. Il Direttore Cardenas è già nervoso per via della nebbia."],
            ["hero", "C'è un errore nei registri, agente! Io gioco a calcio nel Rondine, non dovrei nemmeno essere qui!"],
            ["alc_tonelli", "(ride) Certo, e io sono il centravanti della Nazionale! Ascolta un consiglio da amico: vai in mezzo al cortile."],
            ["alc_tonelli", "Laggiù c'è Bruno il Barbiere. Se sai davvero dare due calci a una palla, oggi ti conviene farti valere, perché chi non corre nel cortile finisce a pelare patate."]
          ], () => {
            setStep(N, 1);
            quest("alc_q1", "Presentati a Bruno il Barbiere", "Raggiungi il campo recintato al centro del cortile e parla con Bruno per capire come funzionano le partite a rimbalzo.");
            done();
          });
        } else if (s === 3) {
          say([
            ["alc_tonelli", "Il Direttore ha dato l'ok per il match tra Bracci. Ricordati: se la palla va oltre il reticolato, il punto va alle Guardie!"]
          ], done);
        } else {
          say([
            ["alc_tonelli", "Non indugiare sotto il riflettore, matricola. Quando suona la campanella devi stare nel tuo blocco."]
          ], done);
        }
      },

      alc_bruno: (K) => {
        const s = S();
        if (s === 1) {
          say([
            ["alc_bruno", "Guarda un po' chi si vede... scarpe nuove e postura da atleta. Sei tu il famoso 'Lupo di Mare' di cui parla tutto il braccio?"],
            ["hero", "Sono solo un calciatore. Ma qui vedo che avete allestito un campo con le sponde metalliche."],
            ["alc_bruno", "Questo è il <b>Calcio a Parete</b>, ragazzo. Niente falli laterali, rimbalzo secco a quarantacinque gradi e riflessi da gatto."],
            ["alc_bruno", "Le guardie credono che ci stiamo solo sgranchendo le gambe, ma noi usiamo le partite per sincronizzare i tempi del cambio turno."],
            ["alc_bruno", "Accetti di fare da regista alla squadra del Braccio Ovest? Se vinciamo la partita di oggi, ti svelo la mappa del condotto sotterraneo."]
          ], () => {
            ask("Cosa rispondi a Bruno il Barbiere?", [
              {
                label: "⚽ Accetto il ruolo di regista: guiderò la squadra!",
                big: true,
                fn: () => {
                  bond("alc_bruno", 2);
                  say([
                    ["alc_bruno", "Ottimo spirito! Ti presento Smilzo Sam: è lui che fa volare i cross sulle lamiere."],
                    ["alc_bruno", "Prima di giocare, parla con Malick la Roccia là in difesa. Ha trovato qualcosa vicino alla grata di scolo."]
                  ], () => {
                    setStep(N, 2);
                    quest("alc_q2", "Parla con Malick la Roccia", "Raggiungi lo stopper Malick in cima all'area di difesa per verificare lo stato della grata.");
                    done();
                  });
                }
              },
              {
                label: "🤝 Vogliamo solo un accordo leale senza trucchi",
                big: true,
                fn: () => {
                  say([
                    ["alc_bruno", "Lealtà anche dietro le sbarre? Mi piace il tuo stile. Ti metteremo alla prova sul campo."],
                    ["alc_bruno", "Prima però va' a parlare con Malick la Roccia vicino alla porta nord."]
                  ], () => {
                    setStep(N, 2);
                    quest("alc_q2", "Parla con Malick la Roccia", "Raggiungi lo stopper Malick in cima all'area di difesa per verificare lo stato della grata.");
                    done();
                  });
                }
              }
            ]);
          });
        } else if (s === 2) {
          say([
            ["alc_bruno", "Parla con Malick vicino alla grata. Dobbiamo essere tutti compatti prima del fischio d'inizio."]
          ], done);
        } else if (s === 3) {
          say([
            ["alc_bruno", "I Detenuti del Braccio Est sono schierati. Mostragli come rimbalza il pallone della Rondine!"]
          ], done);
        } else {
          say([
            ["alc_bruno", "Un bel tiro a scasso vale più di cento parole, ragazzo."]
          ], done);
        }
      },

      alc_sam: (K) => {
        say([
          ["alc_sam", "Psst! Hai visto le torrette? Il fascio di luce si muove a ritmo costante."],
          ["alc_sam", "Se tiri la palla contro la sponda superiore quando il faro è a destra, la sfera scivola nell'angolo buio dritta verso la rete!"]
        ], done);
      },

      alc_malick: (K) => {
        const s = S();
        if (s === 2) {
          say([
            ["alc_malick", "Benvenuto nel cortile, matricola. Io sono Malick. Copro le spalle a tutti e non lascio passare neanche il fumo delle caldaie."],
            ["alc_malick", "Mentre ripulivo l'asfalto ho trovato questo vecchio grimaldello d'ottone incastrato tra le sbarre della grata. Prendilo tu: chi ha buone gambe ne farà miglior uso."],
            ["voce", "Hai ottenuto un <b>Grimaldello d'ottone</b>! (🗝️ +1)"]
          ], () => {
            K.stat("chiavi", K.stat("chiavi") + 1);
            say([
              ["alc_malick", "Il Direttore Cardenas è sceso sul ballatoio con il fischietto. Il Braccio Est ci sta sfidando! Raggiungi Bruno e diamo inizio alla partita!"]
            ], () => {
              setStep(N, 3);
              questDone();
              quest("alc_q3", "Vinci a Calcio a Parete", "Parla con il Direttore Cardenas o entra nel campo per disputare la sfida 3v3 a Calcio a Parete.");
              done();
            });
          });
        } else {
          say([
            ["alc_malick", "La difesa è poesia d'anticipo e geometria di rimbalzi. Nessuno passa."]
          ], done);
        }
      },

      alc_cardenas: (K) => {
        say([
          ["alc_cardenas", "Attenzione detenuti! Il regolamento d'istituto concede trenta minuti di ricreazione sportiva."],
          ["alc_cardenas", "Se vedo gioco scorretto o tentativi d'avvicinamento al reticolato est, la sirena suonerà immediatamente. Palla al centro!"]
        ], () => {
          ask("Vuoi iniziare subito la partita a Calcio a Parete?", [
            {
              label: "⚽ Inizia la partita a Calcio a Parete (3v3)",
              fn: () => {
                K.ownMatch(window.__alcatrazMatch.start, {
                  title: "Capitolo 1 · Sfida nel Cortile di Massima Sicurezza",
                  teamA: "Braccio Ovest",
                  opp: "Braccio Est",
                  colA: "#38bdf8",
                  colB: "#f59e0b",
                  onDone: (res) => {
                    say([
                      ["alc_cardenas", res.win ? "Fischio finale! Vittoria limpida del Braccio Ovest. Niente da eccepire sulla traiettoria." : "Tempo scaduto! Partita dura e serrata."],
                      ["alc_bruno", "Grande prova di squadra! I rimbalzi sulle lamiere hanno fatto scuola."],
                      ["voce", "Hai conquistato il rispetto dei detenuti del Braccio Ovest e sbloccato la divisa carceraria!"]
                    ], () => {
                      K.reward("alc_c1");
                      finishChapter(1, "evaso", "Capitolo 1 completato! Il Campione ha guidato il Braccio Ovest alla vittoria nel cortile.");
                      done();
                    });
                  }
                });
              }
            },
            {
              label: "↩️ Preparati ancora un attimo",
              fn: () => { done(); }
            }
          ]);
        });
      }
    };

    return {
      n: N,
      title: "L'Arrivo sull'Isola e la Maglia a Strisce",
      sub: "Dall'immatricolazione di Cardenas al cortile del Braccio Ovest con Bruno il Barbiere",
      goal,
      start: "alc_cortile",
      introBg: "alc_titolo",
      zones,
      talk,
      intro: [
        ["voce", "Roccia d'Alcatraz, ore 20:30. Il faro gira nella nebbia marina e illumina le garitte di cemento armato."],
        ["voce", "Uno scambio d'identità ti ha catapultato nel carcere più famoso del mondo con una casacca a strisce."],
        ["voce", "Per trovare una via d'uscita devi guadagnarti il rispetto dei detenuti sul campo d'asfalto!"]
      ]
    };
  }

  boot();
})();
