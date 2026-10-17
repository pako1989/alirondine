// js/fortino-c1.js - «COLPO AL FORTINO · LA NOTTE DEL TROFEO SCOMPARSO» · Capitolo 1
// Capitolo 1: Il Piano d'Accesso ai Condotti
// Mentre 60.000 tifosi urlano sugli spalti durante il primo tempo della finale,
// il Campione si cala nei condotti dello stadio guidato da Loris la Volpe e Daria Byte.
(function () {
  "use strict";
  function boot() {
    const D = window.__fortino;
    if (!D || !D.addChapter) return setTimeout(boot, 100);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { setStep, quest } = K;
    const N = 1, S = () => K.stepOf(N);

    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const fin = (ending) => {
      const msg = K.reward("fo_c1", { coins: 90, cos: "fo_c1" }), lines = flush();
      K.finishChapter(N, ending || "ok");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: discesa verso il Caveau Principale.`]);
      K.scene(lines, () => K.openMain(), "fo_caveau");
    };

    K.cos("fo_c1", { kind: "shirt", label: "Tuta da incursione notturna", val: "#0f172a", from: "Capitolo 1 di Colpo al Fortino" });
    K.lore("l_fortino", { t: "Il Fortino Metropolitano", d: "Lo stadio più moderno del paese, dotato di caveau blindato a 15 metri sotto il campo da gioco." });
    K.lore("l_trofeo1912", { t: "La Coppa delle Rondini 1912", d: "Il trofeo d'argento e quarzo forgiato oltre un secolo fa, simbolo intoccabile dei campioni." });

    const goal = (s) => ({
      0: "Raggiungi Loris la Volpe nei condotti di ventilazione del Settore B.",
      1: "Parla con Daria Byte al terminale portatile per decifrare i codici.",
      2: "Supera la sentinella ed entra nella Sala Quadri Elettrici (porta a est).",
      3: "Disattiva i sistemi di ventilazione con la sfida Laser & Rimbalzo."
    }[s] || "Il primo capitolo è completato. Continua con il Capitolo 2.");

    const zones = {
      fo_condotti: {
        region: "condotti", name: "Condotti di Ventilazione · Settore B", short: "Condotti B",
        sub: "Griglie metalliche, correnti d'aria forzata e vibrazioni del pubblico", bg: "fo_condotti", time: "notte",
        w: 32, h: 22, start: [5, 10], items: [[8, 6], [22, 14]],
        areas: [[0, 0, 31, 21, "La rete dei condotti sospesa sopra gli spogliatoi dello stadio"]],
        flavor: {
          a: "Una massiccia condotta in alluminio zincato.",
          T: "Uno snodo di controllo con cavi in fibra ottica.",
          L: "Un raggio laser rosso a bassa intensità per rilevare la polvere.",
          C: "Una cassetta di derivazione dei fari di curva."
        },
        intro: [
          ["voce", "Stadio Metropolitano. 60.000 spettatori cantano all'unisono mentre il cronometro segna il 35° minuto."],
          ["voce", "Mentre tutti guardano il campo, tu ti cali attraverso la botola d'ispezione della tribuna nord."],
          ["voce", "Nei condotti ti aspetta Loris la Volpe con una tuta scura e una piantina millimetrata dei sotterranei."]
        ],
        npcs: (s) => [
          { id: "fo_lupin", at: s === 0 ? [8, 10] : [10, 8] },
          { id: "fo_turing", at: [18, 9] },
          { id: "fo_guard1", at: [27, 10] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(3, 10, 30, 10, ":"); lay(10, 6, 10, 16, ":"); lay(20, 6, 20, 15, ":");
          lay(4, 4, 7, 5, "a"); lay(14, 4, 17, 5, "C"); lay(22, 4, 25, 5, "T");
          lay(4, 15, 7, 17, "a"); lay(22, 16, 25, 18, "L");
          house(31, 9, 1, 3, { door: [31, 10], enter: { to: "fo_quadri", at: [3, 10] } });
        }
      },

      fo_quadri: {
        region: "condotti", name: "Sala Quadri Elettrici & Turbine", short: "Sala Quadri",
        sub: "Pannelli di media tensione, relè e le enormi pale della turbina", bg: "fo_quadri", time: "notte",
        w: 26, h: 18, start: [3, 10], items: [[16, 6]],
        areas: [[0, 0, 25, 17, "La centrale elettrica autonoma che alimenta il sistema di sicurezza"]],
        flavor: {
          T: "Il quadro generale: relè a stato solido e allarmi silenziati.",
          L: "Barriere laser a protezione dei trasformatori di potenza.",
          P: "Un prisma riflettente montato su un basamento di prova.",
          C: "Interruttori magneto-termici sigillati con ceralacca."
        },
        npcs: (s) => [
          { id: "fo_lupin", at: [6, 10] },
          { id: "fo_turing", at: [12, 10] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 25, 0, "a"); lay(0, 0, 0, 17, "a"); lay(25, 0, 25, 17, "a"); lay(0, 17, 25, 17, "a");
          lay(1, 1, 24, 16, ".");
          lay(2, 10, 23, 10, ":"); lay(12, 4, 12, 14, ":");
          lay(4, 3, 8, 4, "T"); lay(15, 3, 20, 4, "C");
          lay(4, 13, 8, 14, "P"); lay(15, 13, 20, 14, "L");
          house(0, 9, 1, 3, { door: [0, 10], enter: { to: "fo_condotti", at: [29, 10] } });
        }
      }
    };

    const talk = {
      fo_lupin(K) {
        const s = S();
        if (K.curZone === "fo_quadri" && s === 2) {
          say("fo_lupin", "[furbo] Ecco il quadro comandi della turbina! Ci sono tre nodi di blocco protetti da laser.");
          say("fo_turing", "Usa la sfera-sonda con i prismi riflettenti: tre centri precisi e il varco per i sotterranei si aprirà!");
          ask("Attivi il simulatore di breccia?", [
            {
              label: "Avvia Sfida Laser & Rimbalzo",
              fn: () => {
                K.ownMatch(window.__fortinoMatch.start, {
                  targetGoals: 3,
                  turns: 6,
                  done: (res) => {
                    if (res && res.win) {
                      K.foChip("c1_turbina", "Microchip Turbina 01");
                      setStep(N, 3);
                      fin();
                    } else {
                      say("fo_turing", "[triste] Segnale interrotto da un laser rosso: riprova la mira sui prismi!");
                      done();
                    }
                  }
                });
              }
            },
            {
              label: "Aspetta un attimo",
              fn: () => { done(); }
            }
          ]);
          return;
        }

        if (s === 0) {
          say("fo_lupin", "[sorpreso] Eccoti, tempismo impeccabile! Lo senti il boato lassù? Il primo tempo è iniziato.");
          say("fo_lupin", "Il Presidente Valori vuole far sparire la Coppa delle Rondini prima del triplice fischio per incassare la polizza Lloyd's.");
          say("fo_lupin", "Dobbiamo arrivare al Caveau Centrale prima che i suoi uomini la portino via in elicottero.");
          ask("Come procediamo con il piano?", [
            {
              label: "Seguiamo i condotti fino alla sala quadri",
              big: true,
              fn: () => {
                K.bond("furtivita", 5);
                say("fo_lupin", "[furbo] Esatto: Daria ti aspetta al terminale radio con la frequenza dei laser.");
                setStep(N, 1);
                quest("fo_c1_turing", "Frequenze di Daria", "Parla con Daria Byte per caricare le chiavi d'accesso.");
                done();
              }
            },
            {
              label: "Forziamo subito il portone principale",
              big: true,
              fn: () => {
                K.foAllarme(10);
                say("fo_lupin", "[pensa] Troppo rischioso, suonerebbero le sirene. Ma mi piace la tua grinta: muoviti verso Daria.");
                setStep(N, 1);
                quest("fo_c1_turing", "Frequenze di Daria", "Parla con Daria Byte per caricare le chiavi d'accesso.");
                done();
              }
            }
          ]);
        } else {
          say("fo_lupin", "Daria ha il sintonizzatore per i prismi. Supera quella sentinella distratta e raggiungici nella Sala Quadri.");
          done();
        }
      },

      fo_turing(K) {
        const s = S();
        if (s === 1) {
          say("fo_turing", "[felice] Ciao, Campione! Ti ho sintonizzato il radar della sfera-sonda sui prismi a specchio.");
          say("fo_turing", "Se calci contro i prismi a 45 gradi, il raggio rimbalza ad angolo retto e spegne i sensori senza allertare la centrale.");
          K.foChip("c1_quadri", "Codice Relay Alpha");
          K.bond("grimaldelli", 10);
          setStep(N, 2);
          quest("fo_c1_sala", "La Sala Quadri", "Entra nella porta a est ed entra nella Sala Quadri.");
          say("fo_turing", "La guardia sulla porta est pensa solo alla radiolina della partita: passagli accanto con passo felpato.");
          done();
        } else if (s === 2) {
          say("fo_turing", "La porta a est è aperta: entra nella Sala Quadri e disattiviamo le turbine.");
          done();
        } else if (s >= 3) {
          say("fo_turing", "[felice] Turbine disattivate! Il condotto verticale verso il Caveau è libero.");
          done();
        }
      },

      fo_guard1(K) {
        say("fo_guard1", "[pensa] (mormora tra sé ascoltando la radiocronaca)... cross teso al centro, traversa clamorosa!");
        say("fo_guard1", "Eh? Chi va là? Ah, uno steward della tribuna... non fare rumore che qui si rischia il pareggio!");
        K.bond("furtivita", 3);
        done();
      }
    };

    // Nella Sala Quadri, terminale T attiva la sfida del motore Laser
    const obj = {
      T(K) {
        if (K.curZone === "fo_quadri" && S() === 2) {
          say("fo_lupin", "[furbo] Ecco il quadro comandi della turbina! Ci sono tre nodi di blocco protetti da laser.");
          say("fo_turing", "Usa la sfera-sonda con i prismi riflettenti: tre centri precisi e il varco per i sotterranei si aprirà!");
          ask("Attivi il simulatore di breccia?", [
            {
              label: "Avvia Sfida Laser & Rimbalzo",
              fn: () => {
                K.ownMatch(window.__fortinoMatch.start, {
                  targetGoals: 3,
                  turns: 6,
                  done: (res) => {
                    if (res && res.win) {
                      K.foChip("c1_turbina", "Microchip Turbina 01");
                      setStep(N, 3);
                      fin();
                    } else {
                      say("fo_turing", "[triste] Segnale interrotto da un laser rosso: riprova la mira sui prismi!");
                      done();
                    }
                  }
                });
              }
            },
            {
              label: "Aspetta un attimo",
              fn: () => { done(); }
            }
          ]);
        } else {
          K.done();
        }
      }
    };

    return {
      n: N,
      title: "Il Piano d'Accesso ai Condotti",
      sub: "Infiltrazione tra ventole, relè e 60.000 spettatori urlanti",
      goal,
      start: "fo_condotti",
      introBg: "fo_titolo",
      zones,
      talk,
      obj,
      intro: [
        ["voce", "Stadio Metropolitano · Ore 21:15."],
        ["voce", "Sotto il fragore dei cori di curva, comincia il colpo al caveau più impenetrabile del paese."]
      ]
    };
  }

  boot();
})();
