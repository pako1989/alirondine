// js/fortino-c3.js - «COLPO AL FORTINO · LA NOTTE DEL TROFEO SCOMPARSO» · Capitolo 3
// Capitolo 3: L'Ultimo Minuto sui Tetti
// 90° minuto. Mentre sul campo scatta il recupero, sui tetti dello stadio
// va in scena la resa dei conti finale con il Presidente Valori e il suo elicottero.
(function () {
  "use strict";
  function boot() {
    const D = window.__fortino;
    if (!D || !D.addChapter) return setTimeout(boot, 100);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { setStep, quest } = K;
    const N = 3, S = () => K.stepOf(N);

    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const fin = (ending) => {
      const msg = K.reward("fo_c3", { coins: 140, cos: "fo_c3" }), lines = flush();
      K.finishChapter(N, ending || "ok");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>COLPO AL FORTINO COMPLETATO!</b> ${msg.join(" · ")}<br>Hai conquistato il finale: <b>${ending ? ending.toUpperCase() : "VITTORIA"}</b>.`]);
      K.scene(lines, () => K.openMain(), "fo_titolo");
    };

    K.cos("fo_c3", { kind: "shirt", label: "Giacca da gran gala dei campioni", val: "#facc15", from: "Capitolo 3 di Colpo al Fortino" });
    K.lore("l_valori", { t: "Presidente Valori", d: "Miliardario spregiudicato, pronto a sacrificare il patrimonio del club per il proprio tornaconto personale." });

    const goal = (s) => ({
      0: "Raggiungi la passerella metallica sopra la Curva Sud e parla con Loris.",
      1: "Raggiungi il Colonnello Rupi per coordinare il blocco dell'eliporto.",
      2: "Entra sull'eliporto (porta a est) e sfida il Presidente Valori.",
      3: "Scegli il destino della Coppa delle Rondini e del tuo Campione."
    }[s] || "La saga è conclusa. Rivivi i capitoli o scopri gli altri finali!");

    const zones = {
      fo_tribuna: {
        region: "tetti", name: "Passerella Sospesa · Curva Sud", short: "Curva Sud",
        sub: "Tralicci a 40 metri d'altezza, bandiere al vento e fumo dei fumogeni", bg: "fo_tribuna", time: "notte",
        w: 32, h: 22, start: [4, 10], items: [[10, 6], [22, 14]],
        areas: [[0, 0, 31, 21, "La passerella di servizio che corre a picco sugli spalti gremiti"]],
        flavor: {
          a: "Travi d'acciaio reticolare che vibrano al ritmo dei cori.",
          T: "Quadro comandi dei fari dello stadio.",
          L: "Cavi di tensione del tetto a sbalzo.",
          F: "Riflettori di sicurezza puntati verso il cielo."
        },
        intro: [
          ["voce", "Aria fresca della notte metropolitana e un boato assordante: sul campo è l'89° minuto."],
          ["voce", "Loris e Daria corrono lungo la passerella metallica: le pale dell'elicottero presidenziale stanno già girando."]
        ],
        npcs: (s) => [
          { id: "fo_lupin", at: [8, 10] },
          { id: "fo_gargoyle", at: [18, 10] },
          { id: "fo_turing", at: [12, 10] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(3, 10, 30, 10, ":"); lay(10, 6, 10, 15, ":"); lay(20, 6, 20, 15, ":");
          lay(4, 4, 7, 5, "F"); lay(14, 4, 17, 5, "T"); lay(22, 4, 25, 5, "a");
          lay(4, 15, 7, 17, "a"); lay(22, 16, 25, 18, "F");
          house(31, 9, 1, 3, { door: [31, 10], enter: { to: "fo_tetti", at: [3, 10] } });
        }
      },

      fo_tetti: {
        region: "tetti", name: "L'Eliporto sui Tetti dello Stadio", short: "Eliporto",
        sub: "Piattaforma H circolare, rotori in rotazione e skyline della metropoli", bg: "fo_tetti", time: "notte",
        w: 28, h: 20, start: [3, 10], items: [[16, 6]],
        areas: [[0, 0, 27, 19, "La sommità dello stadio: l'elicottero presidenziale è pronto al decollo"]],
        flavor: {
          T: "Radiofaro di navigazione aerea.",
          L: "Balise luminose perimetrali dell'eliporto.",
          P: "Prisma di segnalazione ottica della torre di controllo.",
          C: "Valigia metallica rinforzata con i sigilli della lega."
        },
        npcs: (s) => [
          { id: "fo_boss", at: [18, 10] },
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
          house(0, 9, 1, 3, { door: [0, 10], enter: { to: "fo_tribuna", at: [29, 10] } });
        }
      }
    };

    const talk = {
      fo_lupin(K) {
        const s = S();
        if (s === 0) {
          say("fo_lupin", "[furbo] Guarda lassù: il rotore è già in moto! Valori ha la coppa chiusa nella valigia diplomatica.");
          say("fo_lupin", "Il Colonnello Rupi ha tagliato l'alimentazione del carrello di decollo, ma hanno una batteria ausiliaria.");
          ask("Come blocchiamo il Presidente?", [
            {
              label: "Coordinati con Rupi sul traliccio est",
              big: true,
              fn: () => {
                K.bond("grimaldelli", 10);
                say("fo_lupin", "[felice] Ottimo: Rupi ti copre le spalle. Vai da lui prima di salire sull'eliporto.");
                setStep(N, 1);
                quest("fo_c3_rupi", "Patto sul Tetto", "Parla con il Colonnello Rupi sulla passerella.");
                done();
              }
            },
            {
              label: "Scatta subito verso la porta dell'eliporto",
              big: true,
              fn: () => {
                K.foAllarme(12);
                K.bond("furtivita", 5);
                say("fo_lupin", "[pensa] Diretto al bersaglio! Raggiungi comunque Rupi per avere la chiave d'accesso.");
                setStep(N, 1);
                quest("fo_c3_rupi", "Patto sul Tetto", "Parla con il Colonnello Rupi sulla passerella.");
                done();
              }
            }
          ]);
        } else {
          say("fo_lupin", "Non lasciamo decollare quell'elicottero. La storia delle Rondini si decide adesso!");
          done();
        }
      },

      fo_gargoyle(K) {
        const s = S();
        if (s === 1) {
          say("fo_gargoyle", "[arrabbiato] Ho scoperto i bonifici offshore di Valori: voleva incolpare me dell'ammanco!");
          say("fo_gargoyle", "Ho bloccato il portellone dell'eliporto con la mia tessera master. Entra ed esigi la restituzione del trofeo!");
          K.foChip("c3_passerella", "Microchip Master Tetti");
          setStep(N, 2);
          quest("fo_c3_boss", "L'Ultimo Minuto", "Entra nella porta a est ed affronta il Presidente Valori sull'eliporto.");
          done();
        } else {
          say("fo_gargoyle", "L'eliporto è aperto: non farti sfuggire Valori!");
          done();
        }
      },

      fo_turing(K) {
        say("fo_turing", "[felice] Ho intercettato il canale radio dell'arbitro: mancano novanta secondi al fischio finale sul campo!");
        done();
      },

      fo_boss(K) {
        const s = S();
        if (s === 2) {
          say("fo_boss", "[arrabbiato] Maledetti ficcanaso! Come avete fatto a superare la mia sicurezza?!");
          say("fo_boss", "Questo trofeo vale quaranta milioni all'asta di Zurigo. La folla laggiù dimentica tutto in una settimana!");
          say("fo_lupin", "I veri tifosi non dimenticano mai, Valori. E il nostro Campione sta per dimostrartelo.");
          ask("Sfidi il Presidente e i suoi sistemi di fuga?", [
            {
              label: "Sfida Finale a Laser & Rimbalzo",
              fn: () => {
                K.ownMatch(window.__fortinoMatch.start, {
                  targetGoals: 3,
                  turns: 6,
                  opp: { name: "Valori Corp", color: "#facc15" },
                  done: (res) => {
                    if (res && res.win) {
                      K.foChip("c3_eliporto", "Microchip Fondatore 1912");
                      setStep(N, 3);
                      say("fo_boss", "[sorpreso] Il generatore dell'elicottero... è andato in corto circuito! La valigia... è vostra.");
                      say("fo_lupin", "[felice] Colpo perfetto! Abbiamo la Coppa delle Rondini e i registri contabili.");
                      done();
                    } else {
                      say("fo_boss", "[ride] Il rotore prende quota: non potete fermarmi!");
                      done();
                    }
                  }
                });
              }
            },
            {
              label: "Un istante prima del tiro decisivo",
              fn: () => { done(); }
            }
          ]);
        } else if (s === 3) {
          // Bivio a 4 finali
          const chipCount = K.F.get("fo_chip_count") || 0;
          say("fo_lupin", "La valigia è aperta, le prove sono tra le nostre mani e sotto di noi 60.000 persone esplodono per il fischio finale.");
          say("fo_lupin", "Cosa facciamo adesso, Campione? La scelta è soltanto tua.");

          const finalOpts = [
            {
              label: "Consegna il dossier al Procuratore",
              big: true,
              fn: () => fin("incastro")
            },
            {
              label: "Lancia il trofeo tra i cori della curva",
              big: true,
              fn: () => fin("popolo")
            },
            {
              label: "Svanisci nella notte sui tetti",
              big: true,
              fn: () => fin("notte")
            }
          ];

          // Finale segreto sbloccato con tutti e 6 i microchip
          if (chipCount >= 6) {
            finalOpts.push({
              label: "Inserisci la sequenza antica 1912-Rondine",
              big: true,
              fn: () => fin("segreto")
            });
          }

          ask("Quale sarà il tuo finale?", finalOpts);
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
      title: "L'Ultimo Minuto sui Tetti",
      sub: "Resa dei conti sull'eliporto mentre fischia il 90° minuto",
      goal,
      start: "fo_tribuna",
      introBg: "fo_tetti",
      zones,
      talk,
      obj,
      intro: [
        ["voce", "Tetti dello Stadio Metropolitano · 90° minuto."],
        ["voce", "Il vento della notte e il boato della folla fanno tremare l'acciaio: è il momento del tutto per tutto."]
      ]
    };
  }

  boot();
})();
