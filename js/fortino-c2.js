// js/fortino-c2.js - «COLPO AL FORTINO · LA NOTTE DEL TROFEO SCOMPARSO» · Capitolo 2
// Capitolo 2: Allarme Rosso nei Sotterranei
// Il Campione e la squadra scendono al livello -2, dove il caveau è protetto
// da fari di ronda e dal granitico Colonnello Rupi.
(function () {
  "use strict";
  function boot() {
    const D = window.__fortino;
    if (!D || !D.addChapter) return setTimeout(boot, 100);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { setStep, quest } = K;
    const N = 2, S = () => K.stepOf(N);

    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const fin = (ending) => {
      const msg = K.reward("fo_c2", { coins: 110, cos: "fo_c2" }), lines = flush();
      K.finishChapter(N, ending || "ok");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: l'inseguimento sui tetti dello stadio.`]);
      K.scene(lines, () => K.openMain(), "fo_tetti");
    };

    K.cos("fo_c2", { kind: "shirt", label: "Giacca mimetica in kevlar", val: "#1e293b", from: "Capitolo 2 di Colpo al Fortino" });
    K.lore("l_rupi", { t: "Colonnello Rupi", d: "Ex ufficiale della gendarmeria, dirige la sorveglianza dello stadio con disciplina ferrea." });
    K.lore("l_caveau", { t: "Il Cilindro di Titanio", d: "La camera blindata a tenuta stagna che custodisce la Coppa delle Rondini." });

    const goal = (s) => ({
      0: "Attraversa il corridoio sotterraneo ed evita i fari di ronda.",
      1: "Intercetta la sentinella del caveau con l'aiuto di Daria Byte.",
      2: "Entra nella camera blindata (porta a est) e confronta il Colonnello Rupi.",
      3: "Disattiva il cilindro del Caveau con la sfida Laser & Rimbalzo."
    }[s] || "Il secondo capitolo è completato. Continua con il Capitolo 3.");

    const zones = {
      fo_corridoio: {
        region: "caveau", name: "Corridoio Blindato · Livello -2", short: "Corridoio -2",
        sub: "Pareti di cemento armato, telecamere rotanti e sirene silenziose", bg: "fo_corridoio", time: "notte",
        w: 32, h: 22, start: [4, 10], items: [[12, 6], [24, 14]],
        areas: [[0, 0, 31, 21, "Il settore di massima sicurezza sottostante gli spogliatoi"]],
        flavor: {
          a: "Pannelli d'acciaio con guarnizioni ermetiche.",
          T: "Lettore di tessere magnetiche crittografate.",
          L: "Fascio laser di sbarramento a quota ginocchio.",
          F: "Faro alogeno orientabile che illumina a giorno il corridoio."
        },
        intro: [
          ["voce", "Livello -2. Il rumore dei tacchetti dei calciatori sopra le teste rimbomba nel silenzio tombale."],
          ["voce", "Loris la Volpe indica le telecamere a circuito chiuso: «Abbiamo otto minuti prima che cambi il turno delle guardie.»"]
        ],
        npcs: (s) => [
          { id: "fo_lupin", at: [8, 10] },
          { id: "fo_turing", at: [14, 10] },
          { id: "fo_guard2", at: [26, 10] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(3, 10, 30, 10, ":"); lay(10, 6, 10, 15, ":"); lay(20, 6, 20, 15, ":");
          lay(4, 4, 7, 5, "F"); lay(14, 4, 17, 5, "T"); lay(22, 4, 25, 5, "L");
          lay(4, 15, 7, 17, "a"); lay(22, 16, 25, 18, "F");
          house(31, 9, 1, 3, { door: [31, 10], enter: { to: "fo_caveau", at: [3, 10] } });
        }
      },

      fo_caveau: {
        region: "caveau", name: "La Camera Blindata del Trofeo", short: "Caveau",
        sub: "Cilindro di titanio, quarzo blindato e piedistallo ottagonale", bg: "fo_caveau", time: "notte",
        w: 28, h: 20, start: [3, 10], items: [[18, 6]],
        areas: [[0, 0, 27, 19, "Il cuore della sicurezza: qui è custodita la storica Coppa delle Rondini"]],
        flavor: {
          T: "La consolle principale del caveau con i display di pressione.",
          L: "Griglia laser a stella attorno al piedistallo del trofeo.",
          P: "Prismi angolari d'oro per la taratura ottica.",
          C: "Il basamento d'acciaio del cilindro a tenuta stagna."
        },
        npcs: (s) => [
          { id: "fo_gargoyle", at: [18, 10] },
          { id: "fo_lupin", at: [7, 10] },
          { id: "fo_turing", at: [11, 10] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 27, 0, "a"); lay(0, 0, 0, 19, "a"); lay(27, 0, 27, 19, "a"); lay(0, 19, 27, 19, "a");
          lay(1, 1, 26, 18, ".");
          lay(2, 10, 25, 10, ":"); lay(14, 4, 14, 16, ":");
          lay(4, 4, 8, 5, "T"); lay(18, 3, 23, 4, "C");
          lay(4, 14, 8, 15, "P"); lay(18, 14, 23, 15, "L");
          house(0, 9, 1, 3, { door: [0, 10], enter: { to: "fo_corridoio", at: [29, 10] } });
        }
      }
    };

    const talk = {
      fo_lupin(K) {
        const s = S();
        if (s === 0) {
          say("fo_lupin", "[furbo] Ben sceso al -2. Daria ha intercettato un ordine radio del Colonnello Rupi.");
          say("fo_lupin", "I suoi uomini stanno portando le casse di trasporto: vogliono svuotare la teca durante l'intervallo!");
          ask("Come disattiviamo la porta blindata?", [
            {
              label: "Usa il neutralizzatore di Daria",
              big: true,
              fn: () => {
                K.bond("grimaldelli", 10);
                say("fo_lupin", "[felice] Perfetto: Daria invia il pacchetto di dati al lettore magnetico.");
                setStep(N, 1);
                quest("fo_c2_daria", "Bypass Magnetico", "Parla con Daria Byte per sbloccare la porta blindata.");
                done();
              }
            },
            {
              label: "Distrai la sentinella con un rimbalzo",
              big: true,
              fn: () => {
                K.foAllarme(8);
                K.bond("furtivita", 5);
                say("fo_lupin", "[pensa] Un tiro calcolato contro i fari... audace! Procedi da Daria per confermare il segnale.");
                setStep(N, 1);
                quest("fo_c2_daria", "Bypass Magnetico", "Parla con Daria Byte per sbloccare la porta blindata.");
                done();
              }
            }
          ]);
        } else {
          say("fo_lupin", "Il Colonnello Rupi è dentro la camera blindata. Preparati a mostrargli cosa sa fare un vero campione.");
          done();
        }
      },

      fo_turing(K) {
        const s = S();
        if (s === 1) {
          say("fo_turing", "[felice] Fatto! Ho clonato la frequenza della chiave del Colonnello.");
          K.foChip("c2_corridoio", "Microchip Sub-Level 02");
          setStep(N, 2);
          quest("fo_c2_caveau", "Nella Tana del Lupo", "Entra nella porta a est ed entra nel Caveau.");
          say("fo_turing", "La porta a tenuta stagna è sbloccata: entra subito prima che scatti il ciclo di riserva!");
          done();
        } else {
          say("fo_turing", "I display di Rupi sono collegati ai sensori: se colpisci i tre nodi con precisione, il cilindro si solleverà.");
          done();
        }
      },

      fo_guard2(K) {
        say("fo_guard2", "[pensa] I monitor dicono tutto calmo... eppure sento dei passi leggeri tra i condotti.");
        say("fo_guard2", "Meglio fare un altro giro di ronda intorno al settore ovest.");
        done();
      },

      fo_gargoyle(K) {
        const s = S();
        if (s === 2) {
          say("fo_gargoyle", "[arrabbiato] Chi siete voi?! Nessuno ha il permesso di mettere piede nella camera blindata!");
          say("fo_lupin", "Rupi, il tuo Presidente ti sta ingannando! La polizza assicurativa è un falso: vuole far sparire la storia del club!");
          say("fo_gargoyle", "[pensa] Il Presidente Valori mi ha giurato che era una misura di sicurezza... ma se volete toccare quel cilindro, dovrete battere le mie difese!");
          ask("Accetti la sfida dei sistemi di sicurezza?", [
            {
              label: "Disattiva il Caveau con Laser & Rimbalzo",
              fn: () => {
                K.ownMatch(window.__fortinoMatch.start, {
                  targetGoals: 3,
                  turns: 6,
                  opp: { name: "Col. Rupi", color: "#38bdf8" },
                  done: (res) => {
                    if (res && res.win) {
                      K.foChip("c2_caveau", "Microchip Caveau Master");
                      say("fo_gargoyle", "[sorpreso] Incredibile... la traiettoria ha aggirato i miei laser a specchio come se danzasse!");
                      say("fo_turing", "[sorpreso] Allarme! Il Presidente ha prelevato il trofeo un minuto fa con il montacarichi verso il tetto!");
                      say("fo_lupin", "Non è finita: saliamo sulle tribune e fermiamolo sull'eliporto!");
                      setStep(N, 3);
                      fin();
                    } else {
                      say("fo_gargoyle", "[ride] Il Fortino non cede a dilettanti: riprova se ne hai il coraggio!");
                      done();
                    }
                  }
                });
              }
            },
            {
              label: "Un momento di concentrazione",
              fn: () => { done(); }
            }
          ]);
        } else {
          say("fo_gargoyle", "Il montacarichi porta dritto all'eliporto sopra la Curva Sud: presto, fermate Valori!");
          done();
        }
      }
    };

    const obj = {
      T(K) {
        K.done();
      }
    };

    return {
      n: N,
      title: "Allarme Rosso nei Sotterranei",
      sub: "Nel ventre d'acciaio del Fortino contro i fari e il Colonnello Rupi",
      goal,
      start: "fo_corridoio",
      introBg: "fo_corridoio",
      zones,
      talk,
      obj,
      intro: [
        ["voce", "Livello -2 · Sotterranei blindati."],
        ["voce", "La Coppa delle Rondini è chiusa nel cilindro di titanio, ma il complotto corre più veloce dei secondi sul tabellone."]
      ]
    };
  }

  boot();
})();
