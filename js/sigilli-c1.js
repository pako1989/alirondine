// js/sigilli-c1.js - «L'ACCADEMIA DEI SIGILLI» · Capitolo 1
// Capitolo 1: L'Esame di Ammissione
// Il Campione giunge all'Accademia Arcana nel giorno della Prova dei Quattro Elementi:
// apprende la Runa del Vento da Miriel e affronta la prima sfida d'esame contro i costrutti del collegio.
(function () {
  "use strict";
  function boot() {
    const D = window.__sigilli;
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
      const msg = K.reward("sg_c1", { coins: 80, cos: "sg_c1" }), lines = flush();
      K.finishChapter(N, ending || "ok");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>ESAME DI AMMISSIONE SUPERATO.</b> ${msg.join(" · ")}<br>Sei ufficialmente un apprendista dell'Accademia dei Sigilli. Continua nel Capitolo 2: I Sotterranei della Biblioteca.`]);
      K.scene(lines, () => K.openMain(), "sg_biblioteca");
    };

    K.cos("sg_c1", { kind: "shirt", label: "Toga da novizio dell'Accademia", val: "#312e81", from: "Capitolo 1 di Accademia dei Sigilli" });
    K.lore("l_sigilli", { t: "I Quattro Sigilli Balistici", d: "Formule geometriche incise nell'aria che alterano la fisica del pallone: Vento, Tuono, Scudo e Illusione." });
    K.lore("l_alistair", { t: "Il Preside Alistair", d: "Celebre portiere e alchimista del Rinascimento, fondò il collegio per preservare la magia sportiva." });

    const goal = (s) => ({
      0: "Parla con il Preside Alistair nel Cortile dei Sigilli.",
      1: "Ascolta i consigli di Miriel la Saetta per imparare la prima runa.",
      2: "Entra nell'Aula di Balistica Arcana (porta a est nel cortile).",
      3: "Affronta l'Esame di Ammissione contro Mastro Balthazar."
    }[s] || "Il primo capitolo è completato. Continua con il Capitolo 2.");

    const zones = {
      sg_cortile: {
        region: "accademia", name: "Cortile dei Sigilli · Chiostro Maggiore", short: "Cortile",
        sub: "Lastricato antico con il grande cerchio runico centrale", bg: "sg_cortile", time: "tramonto",
        w: 26, h: 20, start: [5, 10], items: [[8, 6], [18, 14]],
        areas: [[0, 0, 25, 19, "Il grande chiostro dove gli studenti si allenano a tracciare le parabole di vento"]],
        flavor: {
          u: "Un cerchio runico inciso nella pietra: emana un calore pulsante.",
          S: "Statua in marmo del Fondatore che tiene un pallone sospeso tra le dita.",
          B: "Un tavolo in pietra dove sono appoggiate coppe di polvere scintillante."
        },
        intro: [
          ["voce", "I cancelli di ferro battuto dell'Accademia dei Sigilli si aprono con un rintocco cupo."],
          ["voce", "Davanti a te si estende il Cortile dei Sigilli, dove palloni luminosi fluttuano nell'aria sopra un gigantesco mandala di pietra."],
          ["voce", "Al centro del chiostro, il Preside Alistair ti attende con un lungo mantello indaco e lo sguardo fiero."]
        ],
        build(L) {
          L.lay(0, 0, 25, 19, ".");
          // Mura esterne
          L.lay(0, 0, 25, 1, "#");
          L.lay(0, 18, 25, 19, "#");
          L.lay(0, 0, 1, 19, "#");
          L.lay(24, 0, 25, 19, "#");

          // Statue decorative agli angoli
          L.put(3, 3, "S");
          L.put(21, 3, "S");
          L.put(3, 16, "S");
          L.put(21, 16, "S");

          // Cerchio runico centrale
          L.lay(10, 8, 15, 12, "u");

          // Porta per l'aula a est
          L.house(22, 9, 3, 3, { door: [22, 10], enter: { to: "sg_aula", at: [5, 8] } });
        },
        npcs(s) {
          return [
            { id: "sg_preside", at: [7, 10] },
            { id: "sg_miriel", at: [12, 10] },
            { id: "sg_tobia", at: [14, 14] }
          ];
        }
      },

      sg_aula: {
        region: "accademia", name: "Aula di Balistica Arcana", short: "Aula", interior: true, outside: ["sg_cortile", 21, 10],
        sub: "Cattedre in mogano, lavagne incise e alambicchi scintillanti", bg: "sg_cortile", time: "giorno",
        w: 22, h: 16, start: [5, 8], items: [[14, 4]],
        areas: [[0, 0, 21, 15, "L'aula dove si apprendono gli incantesimi applicati al calcio"]],
        flavor: {
          L: "Scaffali carichi di pergamene e trattati di geometria balistica.",
          B: "Banchi di legno intarsiati con formule di curvatura del vento."
        },
        build(L) {
          L.lay(0, 0, 21, 15, ".");
          L.lay(0, 0, 21, 1, "#");
          L.lay(0, 14, 21, 15, "#");
          L.lay(0, 0, 1, 15, "#");
          L.lay(20, 0, 21, 15, "#");

          // Librerie a nord
          L.lay(3, 2, 18, 2, "L");

          // Banchi degli studenti
          L.lay(6, 5, 10, 5, "B");
          L.lay(6, 11, 10, 11, "B");
          L.lay(13, 5, 17, 5, "B");
          L.lay(13, 11, 17, 11, "B");

          // Cattedra del docente
          L.put(18, 8, "B");

          // Uscita verso il cortile
          L.house(2, 7, 3, 3, { door: [4, 8], enter: { to: "sg_cortile", at: [21, 10] } });
        },
        npcs(s) {
          return [
            { id: "sg_balthazar", at: [16, 8] },
            { id: "sg_miriel", at: [8, 8] }
          ];
        }
      }
    };

    const talk = {
      sg_preside(K) {
        const s = S();
        if (s === 0) {
          say("sg_preside", "Benvenuto all'Accademia dei Sigilli, Campione. Le tue prodezze nel calcio ordinario hanno fatto risuonare i nostri cristalli divinatori.");
          say("sg_preside", "Qui non insegniamo semplici schemi: insegniamo a imprimere la volontà nell'etere attraverso il pallone.");
          say("sg_preside", "Per essere ammesso dovrai padroneggiare la prima runa elementale. Va' da Miriel al centro del cortile: ti mostrerà il tracciamento.");
          setStep(N, 1);
          K.sgMana(15);
          quest("Runa del Vento", "Impara da Miriel", "Raggiungi Miriel al cerchio runico centrale per apprendere la Runa del Vento.");
          done();
        } else {
          say("sg_preside", "Il vento favorisce chi non esita, Campione. Segui la guida di Miriel.");
          done();
        }
      },

      sg_miriel(K) {
        const s = S();
        if (s <= 1) {
          say("sg_miriel", "Ehi, allora sei tu la nuova promessa! Io sono Miriel. Non farti intimorire dalle cerimonie del Preside.");
          say("sg_miriel", "La prima runa è quella del Vento. È un movimento a spirale fluida: disegnando un cerchio nell'aria, la palla accumula rotazione e aggira qualsiasi barriera.");
          ask("Vuoi provare la concentrazione sulla Runa del Vento?", [
            {
              t: "Concentrati e traccia il cerchio di vento",
              big: true,
              fn() {
                say("hero", "Un cerchio continuo... sento la pressione dell'aria che si addensa attorno al cuoio!");
                say("sg_miriel", "Perfetto al primo tentativo! Hai una sensibilità runica naturale. Ora entra nell'Aula di Balistica a est: Mastro Balthazar ti aspetta per il test pratico.");
                setStep(N, 2);
                K.sgMana(20);
                quest("Esame Pratico", "Aula di Balistica", "Entra nell'Aula a est per sostenere l'Esame di Ammissione con Mastro Balthazar.");
                done();
              }
            },
            {
              t: "Chiedi dettagli sulla storia dell'Accademia",
              fn() {
                say("sg_miriel", "L'Accademia fu fondata quattro secoli fa dopo una leggendaria sfida di mezzanotte sul Monte Rondine. Ogni studente deve legarsi a uno dei Quattro Sigilli.");
                say("sg_miriel", "Ora raggiungiamo Mastro Balthazar nell'Aula: l'esame sta per cominciare!");
                setStep(N, 2);
                quest("Esame Pratico", "Aula di Balistica", "Entra nell'Aula a est per sostenere l'Esame di Ammissione con Mastro Balthazar.");
                done();
              }
            }
          ]);
        } else {
          say("sg_miriel", "Mastro Balthazar non è paziente con i ritardatari. Sbrigati a sostenere l'esame!");
          done();
        }
      },

      sg_tobia(K) {
        say("sg_tobia", "Ciao... io sono Tobia. Studio qui da sei mesi ma il mio tiro a saetta finisce sempre tra i rami del giardino.");
        say("sg_tobia", "Ho trovato questo antico frammento di pergamena vicino alle statue... forse tu saprai decifrarlo.");
        if (K.sgFrammento("tobia_c1", "Frammento del Chiostro")) {
          say("sg_tobia", "Te lo regalo! I grandi maestri dicono che raccogliendo tutti i frammenti si svela un segreto sepolto sotto la torre.");
        }
        done();
      },

      sg_balthazar(K) {
        const s = S();
        if (s < 2) {
          say("sg_balthazar", "Fuori dalla mia aula finché non hai il permesso del Preside!");
          done();
        } else {
          say("sg_balthazar", "Silenzio in aula! Il Campione si presenta alla cattedra per la prova balistica.");
          say("sg_balthazar", "L'esame consiste nel superare la barriera dei nostri automi runici tracciando i simboli corretti prima dello scadere del tempo.");
          ask("Sei pronto a dimostrare la tua arte balistica nel Traccia-Runa?", [
            {
              t: "Inizia l'Esame Pratico (Traccia-Runa)",
              big: true,
              fn() {
                say("sg_balthazar", "In posizione! Che i sigilli abbiano inizio!");
                const l = flush();
                const runMatch = () => {
                  K.ownMatch(window.__runaMatch.start, {
                    opp: { name: "I Guardiani di Gesso", style: "equilibrata" },
                    us: K.hero().name,
                    turns: 5,
                    winTitle: "ESAME SUPERATO A PIENI VOTI!",
                    done(res) {
                      setStep(N, 3);
                      say("sg_balthazar", "Impressionante. La tua parabola ha spazzato via i difensori d'argilla come fossero foglie.");
                      say("sg_preside", "Benvenuto all'Accademia dei Sigilli, Campione. Hai guadagnato la Toga da Apprendista.");
                      fin("ok");
                    }
                  });
                };
                if (l.length) K.say(l, runMatch); else runMatch();
              }
            },
            {
              t: "Sfida alternativa (Partita d'Azione)",
              fn() {
                say("sg_balthazar", "Molto bene, valuteremo la tua destrezza nel duello rapido!");
                const l = flush();
                const runMatch = () => {
                  K.playMatch({
                    alt: "az,cage",
                    oppNames: ["Automa Alfa", "Automa Beta", "Portiere di Gesso"],
                    done(res) {
                      setStep(N, 3);
                      say("sg_balthazar", "Ottima coordinazione sul terreno. Sei promosso con lode.");
                      fin("ok");
                    }
                  });
                };
                if (l.length) K.say(l, runMatch); else runMatch();
              }
            }
          ]);
        }
      }
    };

    return {
      n: N,
      title: "L'Esame di Ammissione",
      sub: "La Prova delle Parabole di Vento",
      goal,
      start: "sg_cortile",
      introBg: "sg_titolo",
      zones,
      talk,
      intro: [
        ["voce", "Anno Accademico 1492. Sulla sommità del colle si stagliano le guglie gotiche dell'Accademia dei Sigilli."],
        ["voce", "Qui le arti magiche e la balistica calcistica si fondono: chi impara a tracciare le antiche rune può piegare le traiettorie dell'impossibile."],
        ["voce", "Varchi il maestoso portone per sostenere il tuo primo esame d'ammissione."]
      ]
    };
  }

  boot();
})();
