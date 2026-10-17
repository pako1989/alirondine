// js/sigilli-c3.js - «L'ACCADEMIA DEI SIGILLI» · Capitolo 3
// Capitolo 3: La Notte dei Quattro Sigilli
// Sulla cima della Torre dell'Osservatorio le stelle si allineano nella Grande Congiunzione:
// il Campione deve decidere come forgiare il destino della magia balistica tra 4 finali leggendari.
(function () {
  "use strict";
  function boot() {
    const D = window.__sigilli;
    if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 100);
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
      const msg = K.reward("sg_c3", { coins: 150, cos: "sg_c3" }), lines = flush();
      K.finishChapter(N, ending || "luce");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>SAGA DELL'ACCADEMIA DEI SIGILLI CONCLUSA!</b> ${msg.join(" · ")}<br>Hai scoperto uno dei destini della magia calcistica. La cineteca e il Salone delle Saghe custodiranno la tua impresa.`]);
      K.scene(lines, () => K.openMain(), "sg_titolo");
    };

    K.cos("sg_c3", { kind: "shirt", label: "Toga stellata di Gran Maestro", val: "#4338ca", from: "Capitolo 3 di Accademia dei Sigilli" });

    const goal = (s) => ({
      0: "Raggiungi il Preside Alistair nell'Osservatorio Astronomico.",
      1: "Parla con Miriel e Tobia prima di salire alla Torre dei Quattro Sigilli.",
      2: "Accedi alla Torre Sommitale (porta a est) per la Prova della Congiunzione.",
      3: "Affronta la Sfida Finale dei Maestri nel Traccia-Runa e scegli il tuo destino."
    }[s] || "La saga è completata. Puoi rigiocare i capitoli per scoprire tutti i finali.");

    const zones = {
      sg_osservatorio: {
        region: "osservatorio", name: "Osservatorio Astronomico · Volta Celeste", short: "Osservatorio",
        sub: "Telescopi d'ottone, carte del cielo notturno e brezza delle vette", bg: "sg_torre", time: "notte",
        w: 24, h: 18, start: [4, 9], items: [[6, 5], [16, 13]],
        areas: [[0, 0, 23, 17, "La grande terrazza circolare sospesa sopra le nuvole del Monte Rondine"]],
        flavor: {
          A: "Il monumentale astrolabio della torre: gli anelli segnano la convergenza planetaria.",
          S: "Statua del Fondatore con una meridiana stellare incisa ai piedi."
        },
        intro: [
          ["voce", "Sei giunto alla sommità del castello. Davanti a te si apre la cupola spalancata dell'Osservatorio Astronomico."],
          ["voce", "Le comete solcano il cielo violetto proiettando riflessi argentei sull'erba dell'arena sospesa."]
        ],
        build(L) {
          L.lay(0, 0, 23, 17, ".");
          L.lay(0, 0, 23, 1, "#");
          L.lay(0, 16, 23, 17, "#");
          L.lay(0, 0, 1, 17, "#");
          L.lay(22, 0, 23, 17, "#");

          // Astrolabi monumentali
          L.put(5, 4, "A");
          L.put(17, 4, "A");

          // Rune astronomiche
          L.put(11, 8, "R");
          L.put(11, 10, "R");

          // Statue del fondatore
          L.put(5, 13, "S");
          L.put(17, 13, "S");

          // Passaggio alla Torre dei Sigilli a est
          L.house(20, 8, 3, 3, { door: [20, 9], enter: { to: "sg_torre", at: [4, 8] } });
        },
        npcs(s) {
          return [
            { id: "sg_preside", at: [8, 9] },
            { id: "sg_miriel", at: [14, 9] },
            { id: "sg_tobia", at: [11, 13] }
          ];
        }
      },

      sg_torre: {
        region: "osservatorio", name: "La Torre dei Quattro Sigilli · Arena Finale", short: "Torre Sigilli", interior: true, outside: ["sg_osservatorio", 19, 9],
        sub: "Il pinnacolo supremo dove convergono i flussi magici dei quattro elementi", bg: "sg_torre", time: "notte",
        w: 22, h: 16, start: [4, 8], items: [[12, 4]],
        areas: [[0, 0, 21, 15, "L'anello di pietra sospeso nel vuoto dove si decidono i destini dell'Accademia"]],
        flavor: {
          R: "Il Sigillo Supremo risplende di riflessi d'oro e ametista.",
          A: "Il meccanismo di chiusura della grande barriera del cielo."
        },
        build(L) {
          L.lay(0, 0, 21, 15, ".");
          L.lay(0, 0, 21, 1, "#");
          L.lay(0, 14, 21, 15, "#");
          L.lay(0, 0, 1, 15, "#");
          L.lay(20, 0, 21, 15, "#");

          // Grande cerchio dei quattro elementi
          L.lay(9, 6, 13, 10, "R");

          // Pilastri dell'arena
          L.put(6, 4, "S");
          L.put(16, 4, "S");
          L.put(6, 12, "S");
          L.put(16, 12, "S");

          // Uscita verso l'osservatorio
          L.house(2, 7, 3, 3, { door: [3, 8], enter: { to: "sg_osservatorio", at: [19, 9] } });
        },
        npcs(s) {
          return [
            { id: "sg_valerian", at: [14, 8] },
            { id: "sg_archimede", at: [8, 8] }
          ];
        }
      }
    };

    const talk = {
      sg_preside(K) {
        const s = S();
        if (s === 0) {
          say("sg_preside", "Guarda lassù, Campione. Le quattro costellazioni balistiche si stanno allineando sopra l'Accademia: è l'ora della Grande Congiunzione.");
          say("sg_preside", "I Quattro Sigilli - Vento, Tuono, Scudo e Illusione - richiedono una guida salda per essere accordati.");
          say("sg_preside", "Parla con i tuoi compagni e poi sali all'Arena della Torre Sommitale per l'esame finale.");
          setStep(N, 1);
          K.sgMana(25);
          quest("La Grande Congiunzione", "Raggiungi la Torre", "Parla con Miriel e Tobia, poi accedi alla Torre dei Quattro Sigilli.");
          done();
        } else {
          say("sg_preside", "L'intera storia dell'Accademia poggia sulle scelte che farai stanotte.");
          done();
        }
      },

      sg_miriel(K) {
        const s = S();
        if (s <= 1) {
          say("sg_miriel", "Non ho mai visto il cielo così luminoso. Qualunque cosa accada nell'arena, ricorda che la magia è viva solo finché la condividiamo.");
          say("sg_miriel", "Io sarò sempre al tuo fianco a coprire la fascia destra con le raffiche di vento!");
          setStep(N, 2);
          quest("La Prova Finale", "Arena della Torre", "Varchi la porta a est per salire alla Torre dei Quattro Sigilli.");
          done();
        } else {
          say("sg_miriel", "Va' all'Arena della Torre, Campione. Siamo tutti con te!");
          done();
        }
      },

      sg_tobia(K) {
        say("sg_tobia", "Ho unito tutti gli inchiostri che avevo! Se tracci il Sigillo della Protezione, nessuno potrà mai segnare alla nostra scuola.");
        K.sgFrammento("tobia_c3", "Frammento del Gran Maestro");
        done();
      },

      sg_archimede(K) {
        say("sg_archimede", "Uh-uh! Il tempo si restringe come la cruna di un ago. Senti la pressione dell'etere nell'Arena?");
        done();
      },

      sg_valerian(K) {
        const s = S();
        if (s < 2) {
          say("sg_valerian", "Aspetto il mio turno nell'arena sommitale.");
          done();
        } else {
          say("sg_valerian", "Campione. Ho riflettuto su ciò che è accaduto nella Cripta.");
          say("sg_valerian", "Non voglio distruggere l'Accademia, volevo solo che fossimo invincibili. Ma ora tocca a te calciare il rigore dell'Allineamento Astrale.");
          say("sg_valerian", "I Maestri della Congiunzione attendono la tua dimostrazione nel Traccia-Runa!");

          ask("Quale destino sceglierai di imprimere nei Sigilli dell'Accademia?", [
            {
              t: "1. Sigillo dell'Aura (Protezione del Collegio)",
              big: true,
              fn() {
                say("hero", "Consacro la mia magia alla difesa dei deboli e all'insegnamento per tutti.");
                const runMatch = () => {
                  K.ownMatch(window.__runaMatch.start, {
                    opp: { name: "I Maestri della Congiunzione", style: "difensiva" },
                    us: K.hero().name,
                    turns: 6,
                    winTitle: "IL SIGILLO DELL'AURA È CONSACRATO!",
                    onDone(res) {
                      fin("luce");
                    }
                  });
                };
                runMatch();
              }
            },
            {
              t: "2. Sigillo della Tempesta (Il Tuono Balistico)",
              big: true,
              fn() {
                say("hero", "Scelgo la potenza del tuono: trionferemo in ogni torneo con un calcio inarrestabile!");
                const runMatch = () => {
                  K.ownMatch(window.__runaMatch.start, {
                    opp: { name: "I Maestri della Congiunzione", style: "pressing" },
                    us: K.hero().name,
                    turns: 6,
                    winTitle: "IL TUONO ARCANO È SCATENATO!",
                    onDone(res) {
                      fin("tempesta");
                    }
                  });
                };
                runMatch();
              }
            },
            {
              t: "3. Sigillo dello Specchio (Armonia delle Case)",
              big: true,
              fn() {
                say("hero", "Valerian, uniamo le nostre forze. Luce e ombra, vento e tuono: giochiamo insieme.");
                say("sg_valerian", "Un patto di cooperazione tra pari... accetto con onore!");
                const runMatch = () => {
                  K.ownMatch(window.__runaMatch.start, {
                    opp: { name: "I Maestri della Congiunzione", style: "equilibrata" },
                    us: K.hero().name,
                    turns: 6,
                    winTitle: "L'ARMONIA DELLE CASE È RAGGIUNTA!",
                    onDone(res) {
                      fin("specchio");
                    }
                  });
                };
                runMatch();
              }
            },
            {
              t: "4. Il Quinto Sigillo Perduto (Segreto del 1492)",
              big: true,
              fn() {
                const count = K.F.get("sg_frag_count") || 0;
                say("hero", "Unisco tutti i frammenti di pergamena e incido la Runa della Rondine d'Oro!");
                say("sg_preside", "Incredibile... il Quinto Sigillo del Fondatore del 1492! La magia calcistica originaria è rinata!");
                const runMatch = () => {
                  K.ownMatch(window.__runaMatch.start, {
                    opp: { name: "I Maestri della Congiunzione", style: "equilibrata" },
                    us: K.hero().name,
                    turns: 6,
                    winTitle: "IL QUINTO SIGILLO È RISVEGLIATO!",
                    onDone(res) {
                      fin("arcano");
                    }
                  });
                };
                runMatch();
              }
            }
          ]);
        }
      }
    };

    return {
      n: N,
      title: "La Notte dei Quattro Sigilli",
      sub: "Il Giudizio dell'Osservatorio Astrale",
      goal,
      start: "sg_osservatorio",
      introBg: "sg_torre",
      zones,
      talk,
      intro: [
        ["voce", "La Torre dell'Osservatorio si eleva sopra il manto delle nubi, affacciata sull'immensità della volta celeste."],
        ["voce", "Nel punto in cui le costellazioni convergono, i Quattro Sigilli elementali brillano di una luce quasi accecante."],
        ["voce", "Il Preside, i maestri e tutti gli studenti attendono il tuo tiro supremo per scrivere il futuro dell'Accademia."]
      ]
    };
  }

  boot();
})();
