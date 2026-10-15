// js/piramide-c2.js - LA PIRAMIDE DEL SOLE · Capitolo 2 «Il Cortile dei Serpenti Piumati · Il Cifrario di Giada»
// Esplorazione del maestoso campo di Pok-ta-pok sotterraneo, disattivazione delle trappole nel Labirinto,
// intrusione armata dei mercenari di Vargas e match rituale contro la squadra d'assalto.
(function () {
  "use strict";
  function boot() {
    const D = window.__piramide;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    if (!D._has || !D._has(1)) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { setStep, quest } = K;
    const N = 2, S = () => K.stepOf(N);
    // adattatori al kit di saga-core: le battute si accumulano e partono insieme (nome → id del personaggio)
    const WHO = { "Prof. Alvarez": "my_alvarez", "Ixchel": "my_ixchel", "Diego": "my_diego", "Capitano Vargas": "my_vargas", "Guardiano Kukulkan": "my_kukulkan" };
    let QL = [];
    const say = (who, txt) => { QL.push([WHO[who] || who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => { const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn }))); if (l.length) K.say(l, go); else go(); };
    const questDone = (id) => K.questDone(id), stat = (k, v) => K.bond(k, v);
    const fin = (ending) => {
      const msg = K.reward("my_c" + N, { coins: 70 + N * 20, cos: "my_c" + N }), lines = flush();
      K.finishChapter(N, ending || "ok"); if (ending) K.end(ending);
      lines.push(["voce", `<b>${N < 3 ? "FINE DEL CAPITOLO " + N : "FINE DELLA STORIA"}.</b> ${msg.join(" · ")}${N < 3 ? "<br>Continua nel capitolo " + (N + 1) + "." : "<br>Gli altri finali ti aspettano nel Diario."}`]);
      K.scene(lines, () => K.openMain(), "my_cortile");
    };

    K.cos("my_c2", { kind: "shirt", label: "Fascia rituale con piuma smeraldo dello Yucatán", val: "#059669", from: "Capitolo 2 de La Piramide del Sole" });

    const goal = (s) => ({
      0: "Sei nel maestoso Cortile dei Serpenti Piumati. Parla con il Professor Alvarez vicino all'altare centrale.",
      1: "Le trappole del Labirinto bloccano l'accesso alla Cripta. Parla con Ixchel per trovare il passaggio sicuro.",
      2: "I mercenari di Vargas hanno fatto irruzione! Raggiungi la Cripta e proteggi il Disco di Pietra.",
      3: "Vargas sfida la spedizione sul campo sacro: batti i mercenari a L'Anello di Pietra per salvare i reperti!"
    }[s] || "Il secondo capitolo è completato. Continua con il Capitolo 3.");

    const zones = {
      my_cortile: {
        region: "rovine", name: "Cortile dei Serpenti Piumati", short: "Cortile Sacro", sub: "Il grandioso campo cerimoniale di Pok-ta-pok scavato nella viva roccia", bg: "my_cortile", time: "notte",
        w: 32, h: 22, start: [6, 11], items: [[6, 6], [26, 6], [16, 17]],
        areas: [[0, 0, 31, 21, "Il vasto cortile rituale circondato da pareti inclinate e anelli verticali intagliati"]],
        flavor: {
          R: "Le pareti inclinate a quarantacinque gradi che permettevano ai giocatori di far rimbalzare la palla verso l'anello.",
          A: "I due imponenti anelli in pietra dorata forati a cinque metri d'altezza sulle pareti est e ovest.",
          O: "L'altare circolare con bassorilievi del sole al centro esatto della linea mediana.",
          s: "La galleria che scende verso il Labirinto delle Trappole e la Cripta delle offerte."
        },
        intro: [
          ["voce", "Oltre l'atrio si apre una meraviglia architettonica mozzafiato: il Cortile dei Serpenti Piumati, uno stadio cerimoniale rimasto intatto dal XII secolo."],
          ["voce", "Le fiaccole riflettono le venature d'oro delle pareti oblique. L'aria è densa di profumo di copale e l'eco di ogni passo sembra risvegliare gli spiriti degli antichi atleti."]
        ],
        npcs: (s) => [
          { id: "my_alvarez", at: [10, 11] },
          { id: "my_ixchel", at: [14, 11] },
          ...(s >= 2 ? [{ id: "my_vargas", at: [24, 11] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          // Campo da gioco con pareti inclinate e linea mediana
          lay(4, 11, 27, 11, ":"); lay(16, 5, 16, 17, ":");
          lay(2, 5, 4, 17, "R"); lay(27, 5, 29, 17, "R");
          lay(15, 10, 17, 12, "O");
          // Uscita verso atrio e verso labirinto
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "my_atrio", at: [28, 11] } });
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "my_labirinto", at: [3, 9] } });
        }
      },

      my_labirinto: {
        region: "rovine", name: "Labirinto delle Trappole", short: "Labirinto", sub: "Strette gallerie in pietra con fessure per dardi e lastre a pressione", bg: "my_labirinto", time: "notte",
        w: 24, h: 18, start: [3, 9], items: [[12, 5], [18, 12], [6, 14]],
        areas: [[0, 0, 23, 17, "I corridoi sotterranei protetti da marchingegni meccanici millenari"]],
        flavor: {
          D: "Fessure millimetriche nella parete: un passo falso sulla lastra e decine di dardi avvelenati scattano all'istante.",
          L: "Lastre di calcare finemente bilanciate collegate a contrappesi sotterranei.",
          s: "La porta a volta ad arco maya che si apre sulla Cripta delle offerte."
        },
        npcs: (s) => [
          { id: "my_ixchel", at: [8, 9] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 23, 0, "a"); lay(0, 0, 0, 17, "a"); lay(23, 0, 23, 17, "a"); lay(0, 17, 23, 17, "a");
          lay(1, 1, 22, 16, ".");
          // Corridoi a serpentina con lastre
          lay(2, 9, 21, 9, ":"); lay(10, 3, 10, 14, ":"); lay(17, 3, 17, 14, ":");
          lay(5, 4, 7, 6, "D"); lay(12, 11, 14, 13, "L");
          // Uscite
          house(0, 8, 1, 3, { door: [0, 9], enter: { to: "my_cortile", at: [29, 11] } });
          house(23, 8, 1, 3, { door: [23, 9], enter: { to: "my_cripta", at: [3, 8] } });
        }
      },

      my_cripta: {
        region: "rovine", name: "Cripta delle Offerte", short: "Cripta", sub: "La camera segreta dove riposa il Disco Solare di Kukulkan", bg: "my_cripta", time: "notte",
        w: 22, h: 16, start: [3, 8], items: [[11, 4], [18, 11], [5, 12]],
        areas: [[0, 0, 21, 15, "La silenziosa cripta delle offerte con l'idolo del giaguaro e il disco d'oro"]],
        flavor: {
          I: "L'Idolo del Giaguaro in giada purissima che troneggia sul basamento d'ossidiana.",
          D: "Il Disco Solare intagliato nella pietra verde smeraldo con i glifi dei movimenti atletici.",
          s: "Il passaggio a ritroso verso il Labirinto delle Trappole."
        },
        npcs: (s) => [
          ...(s >= 2 ? [{ id: "my_vargas", at: [12, 8] }] : [{ id: "my_alvarez", at: [10, 8] }])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 21, 0, "a"); lay(0, 0, 0, 15, "a"); lay(21, 0, 21, 15, "a"); lay(0, 15, 21, 15, "a");
          lay(1, 1, 20, 14, ".");
          lay(2, 8, 19, 8, ":"); lay(11, 3, 11, 12, ":");
          lay(10, 6, 12, 7, "I"); lay(15, 4, 17, 6, "D");
          house(0, 7, 1, 3, { door: [0, 8], enter: { to: "my_labirinto", at: [21, 9] } });
        }
      }
    };

    const talk = {
      my_alvarez(K) {
        const s = S();
        if (s === 0) {
          say("Prof. Alvarez", "Osserva queste gradinate, ragazzo mio! Questo è il vero cuore pulsante della civiltà maya.");
          say("Prof. Alvarez", "I capitani non giocavano per denaro o fama, ma per decidere il corso delle stagioni e la fertilità dei raccolti.");
          say("Prof. Alvarez", "Per proseguire dobbiamo raggiungere la <b>Cripta delle Offerte</b>. Ma il passaggio è protetto dal Labirinto delle Trappole. Parla con Ixchel!");
          setStep(N, 1);
          quest("my_q2_1", "Il Passo del Giaguaro", "Parla con Ixchel all'imbocco del Labirinto per superare le trappole.");
          done();
        } else if (s === 1) {
          say("Prof. Alvarez", "Ixchel conosce il ritmo delle lastre basculanti. Segui ogni suo consiglio alla lettera!");
          done();
        } else if (s >= 2 && s < 3) {
          say("Prof. Alvarez", "Vargas e i suoi uomini sono entrati armati! Dobbiamo impedire che profanino la Cripta!");
          done();
        } else {
          say("Prof. Alvarez", "Hai difeso il Disco Solare con una partita leggendaria! Ora ci aspetta la vetta della piramide.");
          done();
        }
      },

      my_ixchel(K) {
        const s = S();
        if (s === 1) {
          say("Ixchel", "Ascolta il respiro della roccia: le lastre a terra non vanno calpestate sui bordi.");
          say("Ixchel", "Bisogna avanzare a balzi diagonali, proprio come il giaguaro quando punta la preda tra i rami.");
          say("Ixchel", "Attraversa il Labirinto tenendo il centro del corridoio. Io ti copro le spalle!");
          questDone("my_q2_1");
          setStep(N, 2);
          quest("my_q2_2", "Intrusione Armata", "Raggiungi la Cripta delle Offerte e affronta Vargas!");
          done();
        } else if (s === 0) {
          say("Ixchel", "Il cortile sacro è magnifico, ma il silenzio è ingannevole... sento passi pesanti avvicinarsi.");
          done();
        } else if (s === 2) {
          say("Ixchel", "Vargas è già nella Cripta! Sbrigati prima che tocchi il Disco di Pietra!");
          done();
        } else {
          say("Ixchel", "Il tuo spirito ha superato l'avidità della polvere da sparo. Sei un vero guerriero solare.");
          done();
        }
      },

      my_vargas(K) {
        const s = S();
        if (s === 2) {
          say("Capitano Vargas", "Ahah! Finalmente! Guarda questo Disco Solare in giada pura... a New York vale una flotta intera di piroscafi!");
          say("Capitano Vargas", "Fate un passo indietro o i miei fucilieri faranno saltare in aria l'intera arcata!");
          say("Capitano Vargas", "Volete risolvere la questione da gentiluomini? Allora sfidatemi sul vostro stupido campo di pietra!");
          say("Capitano Vargas", "Se vincete voi, lascio i reperti e me ne torno alla costa. Se vinco io, mi prendo l'oro e voi restate sepolti qui dentro!");
          questDone("my_q2_2");
          setStep(N, 3);
          quest("my_q2_3", "La Sfida di Vargas", "Batti la squadra dei mercenari all'Anello di Pietra nel Cortile Sacro.");
          done();
        } else if (s === 3) {
          say("Capitano Vargas", "I miei uomini sono pronti. Palla di caucciù o palla di piombo, per me non fa differenza!");
          ask("Accetti la sfida di Vargas sul campo sacro?", [
            {
              t: "Sfida i Mercenari al Pok-ta-pok (Partita)",
              big: true,
              fn: () => {
                K.ownMatch(window.__anello.start, {
                  oppNames: ["Vargas", "Mercenario Scelto"],
                  mate: "Ixchel",
                  done: (res) => {
                    if (res.win) {
                      say("Capitano Vargas", "Maledizione! Come diavolo fai a far curvare quella palla pesante contro il muro in quel modo?!");
                      say("Capitano Vargas", "I miei patti sono patti... ma la partita per la vetta della piramide non è ancora finita!");
                      questDone("my_q2_3");
                      stat("coraggio", 20);
                      stat("reperti", 1);
                      fin();
                    } else {
                      say("Capitano Vargas", "Te l'avevo detto! Siete solo archeologi della domenica. Riprova se hai ancora coraggio!");
                      done();
                    }
                  }
                });
              }
            },
            {
              t: "Prepara la strategia di rimbalzo con Ixchel",
              fn: () => {
                say("Ixchel", "I mercenari sono pesanti e lenti nei cambi di direzione. Sfrutta le pareti inclinate per scavalcarli con la volée!");
                done();
              }
            }
          ]);
        } else {
          say("Capitano Vargas", "Ci rivedremo in cima alla piramide, ragazzo!");
          done();
        }
      }
    };

    return {
      n: N,
      title: "Il Cortile dei Serpenti Piumati · Il Cifrario di Giada",
      sub: "Il maestoso campo di Pok-ta-pok, le trappole del Labirinto e il duello contro Vargas.",
      start: "my_cortile",
      introBg: "my_cortile",
      zones,
      talk,
      goal,
      intro: () => [["voce","Oltre l'atrio si apre il Cortile dei Serpenti Piumati: uno stadio cerimoniale rimasto intatto dal XII secolo."],["voce","Le trappole del Labirinto custodiscono la Cripta. E i passi pesanti dei mercenari si avvicinano."]]
    };
  }

  boot();
})();
