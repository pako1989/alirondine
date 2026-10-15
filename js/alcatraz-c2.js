// js/alcatraz-c2.js - FUGA DA ALCATRAZ FC · Capitolo 2 «Il Tunnel sotto la Caldaia e la Seconda Chiave»
// La discesa notturna nei sotterranei della fortezza, lo scasso della botola di ghisa,
// il bivio tra l'evasione nell'ombra e il patto leale con la direzione,
// e la semifinale di Calcio a Parete contro la dura squadra dei Magazzini.
(function () {
  "use strict";

  function boot() {
    const D = window.__alcatraz;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { say, done, setStep, bond, finishChapter, quest } = K;
    const ask = (prompt, opts) => K.ask("voce", prompt, opts), questDone = (id) => K.questDone(id);
    const N = 2, S = () => K.stepOf(N);

    K.cos("alc_c2", {
      kind: "shirt",
      label: "Canotta scura da fochista del locale caldaie",
      val: "#0f172a",
      from: "Capitolo 2 di Fuga da Alcatraz FC"
    });

    K.lore("l_caldaie", {
      t: "I Cunicoli di Calce",
      d: "Antiche condotte di scarico del vapore scavate nella roccia viva di Alcatraz. Sbucano sulla scogliera nord a picco sulla baia."
    });

    const goal = (s) => ({
      0: "Sei nei sotterranei. Parla con Bruno il Barbiere e Smilzo Sam vicino alla caldaia centrale.",
      1: "Aiuta Malick la Roccia a forzare la piastra di ghisa che sigilla il cunicolo.",
      2: "I Detenuti dei Magazzini hanno bloccato il cortile! Preparati alla semifinale a Calcio a Parete.",
      3: "Affronta i Detenuti dei Magazzini a Calcio a Parete per assicurarti la rotta verso la libertà."
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      alc_caldaie: {
        region: "carcere",
        name: "Locale Caldaie e Sotterranei",
        short: "Locale Caldaie",
        sub: "Fornaci ardenti, manometri d'ottone e la botola verso la scogliera",
        bg: "alc_caldaie",
        time: "notte",
        travel: [4, 10],
        w: 26,
        h: 18,
        start: [4, 10],
        items: [[3, 6], [22, 6], [14, 14]],
        areas: [
          [2, 2, 23, 15, "Il sottosuolo del penitenziario"]
        ],
        flavor: {
          F: "La bocca ardente della fornace centrale che riscalda l'intero penitenziario.",
          G: "Una pesante piastra di ghisa incernierata nella roccia con quattro grossi bulloni.",
          P: "La porta d'acciaio che risale verso il corridoio delle celle."
        },
        intro: [
          ["voce", "L'aria nei sotterranei è satura di calore secco, vapore d'acqua dolce e ruggine d'altri tempi."],
          ["voce", "Dietro la grande caldaia in ghisa, Bruno e Sam hanno scostato un cumulo di carbone rivelando una botola segreta."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "alc_bruno", at: [10, 8] }, { id: "alc_sam", at: [6, 8] }] : []),
          ...(s >= 1 ? [{ id: "alc_malick", at: [14, 8] }, { id: "alc_bruno", at: [10, 8] }] : []),
          ...(s >= 2 ? [{ id: "alc_sam", at: [6, 8] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 25, 1, "W");
          lay(0, 16, 25, 17, "W");
          lay(0, 0, 1, 17, "W");
          lay(24, 0, 25, 17, "W");

          // Pavimento sotterraneo
          lay(2, 2, 23, 15, ".");

          // La caldaia centrale monumentale (blocco R)
          lay(11, 4, 15, 6, "R");
          put(13, 5, "F");

          // Botola segreta
          put(5, 5, "G");

          // Porta d'uscita verso il cortile superiore
          house(2, 12, 4, 3, {
            door: [4, 12],
            enter: { to: "alc_cortile2", at: [26, 15] }
          });
        }
      },

      alc_cortile2: {
        region: "carcere",
        name: "Cortile del Blocco Ovest",
        short: "Cortile Ovest",
        sub: "Asfalto bagnato, fari di ronda e riflettori pronti per la semifinale",
        bg: "alc_cortile",
        time: "notte",
        travel: [5, 17],
        w: 32,
        h: 22,
        start: [5, 17],
        items: [[3, 6], [28, 6]],
        areas: [
          [8, 6, 24, 15, "Il campo d'asfalto recintato dalle sponde metalliche"],
          [0, 0, 31, 21, "Il Cortile di Massima Sicurezza"]
        ],
        flavor: {
          F: "La torretta di guardia con il riflettore alogeno puntato sull'asfalto.",
          R: "La recinzione metallica coi cartelli di divieto d'avvicinamento.",
          G: "Una pesante grata di scolo da cui proviene odore di vapore e mare.",
          P: "La porta blindata scorrevole che conduce ai sotterranei."
        },
        intro: [
          ["voce", "Il vento della notte ulula tra le maglie metalliche del cortile."],
          ["voce", "I Detenuti dei Magazzini, massicci e coperti di tatuaggi portuali, ti aspettano a braccia conserte sul dischetto di centrocampo."]
        ],
        npcs: (s) => [
          ...(s <= 1 ? [{ id: "alc_tonelli", at: [7, 17] }] : []),
          ...(s >= 2 ? [{ id: "alc_tonelli", at: [16, 12] }, { id: "alc_cardenas", at: [20, 14] }] : [])
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
            enter: { to: "alc_caldaie", at: [4, 10] }
          });
        }
      }
    };

    const talk = {
      alc_bruno: (K) => {
        const s = S();
        if (s === 0) {
          say([
            ["alc_bruno", "Siamo scesi al momento giusto. Le guardie stanno controllando il refettorio."],
            ["alc_bruno", "Guarda qui sotto: questa piastra di ghisa copre l'imbocco del condotto principale. Sam ha provato a forzarla con un cacciavite, ma è sigillata da quattro perni ossidati."],
            ["alc_sam", "Serve la forza di Malick la Roccia e un grimaldello sottile per allentare i denti di ritegno senza fare un fracasso del diavolo!"]
          ], () => {
            bond("chiavi", 1);
            say([["voce", "Smilzo Sam ti infila in tasca un <b>grimaldello fine</b>. (🗝️ +1)"]], () => {
              setStep(N, 1);
              quest("alc_q4", "Apri la botola segreta", "Parla con Malick la Roccia vicino alla botola per rimuovere la piastra con un grimaldello o facendo leva.");
              done();
            });
          });
        } else if (s === 1) {
          say([
            ["alc_bruno", "Parla con Malick. Quando la botola sarà aperta, vedremo il mare."]
          ], done);
        } else {
          say([
            ["alc_bruno", "I rimbalzi contro le pareti saranno decisivi anche contro i Magazzini. Concentrazione massima!"]
          ], done);
        }
      },

      alc_sam: (K) => {
        say([
          ["alc_sam", "Sento l'odore della marea che sale da quella botola. Altri venti metri di cunicolo e siamo fuori sulla scogliera!"]
        ], done);
      },

      alc_malick: (K) => {
        const s = S();
        if (s === 1) {
          say([
            ["alc_malick", "Mettiti lì e tieni la fune d'acciaio, Campione. Quando conto fino a tre, io faccio leva con la sbarra e tu infili il grimaldello."],
            ["hero", "Pronto, Malick. Al mio tre! Uno... due... TRE!"]
          ], () => {
            K.scasso(2, () => {
              say([
                ["alc_malick", "<i>*SBAM!*</i> La piastra si è sollevata! L'imbocco del cunicolo è spalancato verso la scogliera."],
                ["alc_bruno", "Ci siamo! Ma prima di muoverci dobbiamo decidere la strategia per la finale di domani sera."]
              ], () => {
                ask("Quale via decidi di seguire per il piano finale?", [
                  {
                    label: "🌊 Libertà nell'ombra: useremo la finale come diversivo per evadere!",
                    big: true,
                    fn: () => {
                      K.F.set("alc_scelta_fuga", true);
                      bond("alc_bruno", 3);
                      say([
                        ["alc_bruno", "Intesa perfetta. Domani sera, al novantesimo minuto esatto, il guardalinee volterà le spalle e noi voleremo sul molo."],
                        ["alc_bruno", "Ora saliamo nel cortile: i Detenuti dei Magazzini ci aspettano per la semifinale!"]
                      ], () => {
                        setStep(N, 2);
                        questDone("alc_q4");
                        quest("alc_q5", "Semifinale contro i Magazzini", "Raggiungi il cortile d'asfalto e affronta i Detenuti dei Magazzini a Calcio a Parete.");
                        done();
                      });
                    }
                  },
                  {
                    label: "⚖️ Gioco pulito: vinceremo sul campo e dimostreremo la nostra innocenza!",
                    big: true,
                    fn: () => {
                      K.F.set("alc_scelta_leale", true);
                      bond("alc_malick", 3);
                      say([
                        ["alc_malick", "Parole da vero capitano. Battere le Guardie alla luce del sole costringerà il Direttore a riconoscere l'errore d'immatricolazione."],
                        ["alc_malick", "Andiamo su nel cortile: facciamo vedere ai Magazzini cosa significa giocare con onore!"]
                      ], () => {
                        setStep(N, 2);
                        questDone("alc_q4");
                        quest("alc_q5", "Semifinale contro i Magazzini", "Raggiungi il cortile d'asfalto e affronta i Detenuti dei Magazzini a Calcio a Parete.");
                        done();
                      });
                    }
                  }
                ]);
              });
            });
          });
        } else {
          say([
            ["alc_malick", "I Magazzini sono duri nei contrasti, ma noi abbiamo il rimbalzo dalla nostra parte."]
          ], done);
        }
      },

      alc_tonelli: (K) => {
        const s = S();
        if (s >= 2) {
          say([
            ["alc_tonelli", "Tutti in campo! I Detenuti dei Magazzini sostengono che il vostro gol nel primo turno fosse viziato da un rimbalzo irregolare sulla sponda nord."],
            ["alc_tonelli", "Il Direttore Cardenas vuole vedere chi ha davvero il comando del cortile. Fischietto in bocca e palla al centro!"]
          ], () => {
            ask("Sei pronto per la semifinale contro i Detenuti dei Magazzini?", [
              {
                label: "⚽ Inizia la semifinale a Calcio a Parete",
                fn: () => {
                  K.ownMatch(window.__alcatrazMatch.start, {
                    title: "Capitolo 2 · Semifinale dei Bracci contro i Magazzini",
                    teamA: "Braccio Ovest",
                    opp: "Detenuti dei Magazzini",
                    colA: "#38bdf8",
                    colB: "#64748b",
                    done: (res) => {
                      say([
                        ["alc_tonelli", res.win ? "Trionfo spettacolare del Braccio Ovest! Passaggio del turno assicurato." : "Partita terminata! I Magazzini hanno faticato a contenere i vostri rimbalzi."],
                        ["alc_cardenas", "Notevole prestazione atletica. Domani sera la finale sarà contro la selezione delle Guardie. Preparatevi a sudare."],
                        ["voce", "Hai ottenuto la <b>Mappa della Banchina Nord</b> e la <b>Canotta da Fochista</b>!"]
                      ], () => {
                        questDone("alc_q5");
                        const msg = K.reward("alc_c2", { coins: 80, cos: "alc_c2" });
                        finishChapter(2, "tunnel");
                        K.scene([["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La Notte dei Riflettori».`]], () => K.openMain(), "alc_cortile");
                      });
                    }
                  });
                }
              },
              {
                label: "↩️ Un momento, devo rivedere la formazione",
                fn: () => { done(); }
              }
            ]);
          });
        } else {
          say([
            ["alc_tonelli", "Sento troppi rumori giù dalle caldaie. Non fatemi scendere a controllare col registro in mano."]
          ], done);
        }
      },

      alc_cardenas: (K) => {
        say([
          ["alc_cardenas", "Domani sera la squadra delle Guardie difenderà il titolo dell'istituto. Nessun detenuto ha mai alzato la coppa di questo penitenziario."]
        ], done);
      }
    };

    return {
      n: N,
      title: "Il Tunnel sotto la Caldaia e la Seconda Chiave",
      sub: "Scavo notturno, il condotto di ventilazione e la semifinale contro i Detenuti dei Magazzini",
      goal,
      start: "alc_caldaie",
      introBg: "alc_caldaie",
      zones,
      talk,
      intro: () => [
        ["voce", "Mezzanotte passata ad Alcatraz. Mentre la ronda notturna cambia turno sui camminamenti, scendi nei meandri bui della fortezza."],
        ["voce", "Il locale caldaie è il cuore caldo dell'isola: qui risiede l'unica via d'accesso alla galleria scavata nella roccia viva."],
        ["voce", "Ma per guadagnarsi la finale contro le Guardie, serve prima superare la dura semifinale contro i veterani dei Magazzini!"]
      ]
    };
  }

  boot();
})();
