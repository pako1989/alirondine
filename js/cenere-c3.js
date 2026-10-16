// js/cenere-c3.js - CENERE E GLORIA · Capitolo 3 «Il Cratere dei Fuochi»
// Sotto il Cratere c'è il vecchio campo. Sul bordo, la Torre del Predicatore. Una sola partita, quattro modi di chiudere la storia.
(function () {
  "use strict";
  function boot() {
    const D = window.__cenere;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    if (!D._has || !D._has(2)) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { setStep, quest } = K;
    const N = 3, S = () => K.stepOf(N);
    const WHO = { "Brace": "ce_brace", "Tamburo": "ce_tamburo", "Selce": "ce_selce", "Predicatore": "ce_predicatore", "Dente": "ce_dente", "Cenere": "ce_cenere" };
    let QL = [];
    const say = (who, txt) => { QL.push([WHO[who] || who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => { const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn }))); if (l.length) K.say(l, go); else go(); };
    const questDone = (id) => K.questDone(id), stat = (k, v) => K.bond(k, v);
    const fin = (ending) => {
      const msg = K.reward("ce_c" + N, { coins: 70 + N * 20, cos: "ce_c" + N }), lines = flush();
      K.finishChapter(N, ending || "ok"); if (ending) K.end(ending);
      lines.push(["voce", `<b>${N < 3 ? "FINE DEL CAPITOLO " + N : "FINE DELLA STORIA"}.</b> ${msg.join(" · ")}${N < 3 ? "<br>Continua nel capitolo " + (N + 1) + "." : "<br>Gli altri finali ti aspettano nel Diario."}`]);
      K.scene(lines, () => K.openMain(), "ce_cratere");
    };

    K.cos("ce_c3", { kind: "shirt", label: "Mantello di cenere e brace", val: "#5a5f66", from: "Capitolo 3 di Cenere e Gloria" });
    K.lore("l_cratere", { t: "Il Cratere dei Fuochi", d: "Un cratere che fuma da prima che qualcuno si ricordi. Sul fondo, sotto la cenere, i vecchi dicono ci sia un campo con le righe ancora dipinte." });

    const goal = (s) => ({
      0: "Sei al Cratere dei Fuochi. Parla con la Dottoressa Selce vicino al bordo.",
      1: "Tamburo ha qualcosa da dire. Trovalo tra le braci.",
      2: "Sali alla Torre del Predicatore e ascolta la sua versione.",
      3: "L'ultima partita al Campo di Rottami. Il Predicatore ti aspetta.",
      4: "La Torre ha aperto una porta sul passato. Scegli come chiudere la storia."
    }[s] || "La saga di Cenere e Gloria è conclusa.");

    const frame = (L, w, h) => {
      const { lay } = L;
      lay(0, 0, w - 1, 0, "a"); lay(0, 0, 0, h - 1, "a"); lay(w - 1, 0, w - 1, h - 1, "a"); lay(0, h - 1, w - 1, h - 1, "a");
      lay(1, 1, w - 2, h - 2, ".");
    };

    const zones = {
      ce_cratere: {
        region: "cratere", name: "Il Cratere dei Fuochi", short: "Cratere", sub: "Cenere calda, rocce nere e il bagliore delle braci sul fondo", bg: "ce_cratere", time: "sera",
        w: 32, h: 22, start: [3, 11], items: [[8, 6], [22, 16], [27, 7]],
        areas: [[0, 0, 31, 21, "Il bordo del Cratere: cenere sotto i piedi, un cielo che sembra respirare"]],
        flavor: {
          M: "Rocce nere spezzate, ancora tiepide al tatto.",
          K: "Una vecchia ruspa mezza sepolta. Qualcuno ha cercato di scavare, e ha smesso a metà.",
          B: "Un barile di fuoco. Qui il fuoco non serve a scaldare: serve a farsi trovare.",
          U: "Una tenda dei Fedeli, con un'incisione sul palo: «NON ABBANDONARE IL BORDO»."
        },
        intro: [
          ["voce", "Il Cratere dei Fuochi. Il bordo scotta, il vento porta cenere invece di sabbia."],
          ["voce", "Da qui si vede la Torre del Predicatore, e sotto di essa, sul fondo, una macchia scura che potrebbe essere un campo."]
        ],
        npcs: (s) => [
          { id: "ce_selce", at: [10, 11] },
          { id: "ce_tamburo", at: [22, 12] },
          ...(s >= 2 ? [{ id: "ce_brace", at: [16, 14] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          frame(L, 32, 22);
          lay(2, 11, 30, 11, ":"); lay(16, 6, 16, 16, ":");
          lay(12, 4, 15, 5, "M"); lay(22, 4, 25, 5, "K"); lay(4, 16, 7, 18, "U"); lay(24, 16, 27, 18, "M");
          lay(18, 9, 18, 9, "B");
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "ce_torre", at: [2, 11] } });
        }
      },

      ce_torre: {
        region: "cratere", name: "La Torre del Predicatore", short: "Torre", sub: "Una torre di lamiera e pietra, con una campana sempre appesa", bg: "ce_torre", time: "sera",
        w: 32, h: 22, start: [3, 11], items: [[8, 7], [24, 6], [14, 17]],
        areas: [[0, 0, 31, 21, "Il salone della Torre, dove i Fedeli pregano e fanno i conti con il passato"]],
        flavor: {
          M: "Casse di offerte: piccoli oggetti di villaggi che non ci sono più.",
          B: "Il braciere della Torre. Qui il fuoco non si spegne mai.",
          N: "L'antenna sopra la Torre. Ha trasmesso, per anni, lo stesso messaggio: «ASCOLTATE».",
          U: "Una tenda dei Fedeli, con una coperta ricamata a mano."
        },
        npcs: (s) => [
          { id: "ce_predicatore", at: [22, 11] },
          { id: "ce_cenere", at: [10, 13] }
        ],
        build(L) {
          const { lay, house } = L;
          frame(L, 32, 22);
          lay(2, 11, 30, 11, ":"); lay(15, 5, 15, 17, ":");
          lay(6, 4, 9, 5, "M"); lay(22, 4, 26, 5, "U"); lay(6, 16, 9, 18, "M"); lay(22, 16, 26, 18, "M");
          lay(28, 8, 28, 8, "N"); lay(12, 9, 12, 9, "B");
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "ce_cratere", at: [29, 11] } });
        }
      }
    };

    const endChoices = () => {
      const opts = [
        { t: "Dividi il pallone tra i villaggi (Pace dei Villaggi)", big: true, fn: () => { say("Brace", "Un campo per ogni villaggio, un pallone per ogni stagione. Va bene così."); fin("pace"); } },
        { t: "Riprendi la strada da solo (Strada Solitaria)", big: true, fn: () => { say("Selce", "Ti disegnerò una mappa fino all'orizzonte. Il resto lo scoprirai tu."); fin("solitaria"); } },
        { t: "Lascia il pallone nella Torre (La Reliquia)", big: true, fn: () => { say("Predicatore", "Lo custodirò. Non è una vittoria, è un patto."); fin("reliquia"); } }
      ];
      if (K.stat("legami") >= 50 && K.stat("speranza") >= 50 && K.stat("borraccia") >= 3) {
        opts.push({ t: "Fidati di tutti, fino in fondo (Finale segreto)", big: true, fn: () => { say("Tamburo", "Scendiamo. Tutti. Insieme."); say("Predicatore", "(Il Predicatore abbassa lo sguardo e annuisce.) Allora scendiamo."); fin("segreto"); } });
      }
      return opts;
    };

    const talk = {
      ce_selce(K) {
        const s = S();
        if (s === 0) {
          say("Selce", "Il Cratere. L'ho disegnato dieci volte, e ogni volta le curve sono diverse.");
          say("Selce", "Ho trovato questo: una mappa del fondo, con le righe di un campo. Il Crollo non l'ha cancellato, l'ha solo coperto.");
          say("Selce", "Il Predicatore non vuole che nessuno scenda. Dice che è terra sacra. Io penso che abbia paura di quello che troveremo.");
          stat("speranza", 6); stat("legami", 5);
          setStep(N, 1);
          quest("ce_q7", "Il segreto del Cratere", "Parla con Tamburo, ha qualcosa da dirti.");
          done();
        } else if (s === 1) {
          say("Selce", "Tamburo è inquieto. Parlagli: ha un peso sullo stomaco, e non è colpa delle razioni.");
          done();
        } else {
          say("Selce", "Sali alla Torre. Io resto qui con la mappa. E se ti sentissi perso, guarda sempre in basso, dove le righe sono ancora bianche.");
          done();
        }
      },

      ce_tamburo(K) {
        const s = S();
        if (s === 1) {
          say("Tamburo", "Devo dirti una cosa che non ho mai detto a Brace. Quando ero con Dente, abbiamo preso la pompa del pozzo di Rottame.");
          say("Tamburo", "Non sapevamo cosa fosse. Ora lo so: era l'unica cosa che teneva il pozzo vivo. Per questo l'acqua è peggiorata.");
          ask("Cosa consigli a Tamburo?", [
            { t: "Dirglielo a Brace, ora", big: true, fn: () => { stat("legami", 12); stat("speranza", 5); say("Tamburo", "(Tamburo respira a fondo.) Lo farò. Anche se Brace non mi perdonerà."); questDone("ce_q7"); setStep(N, 2); quest("ce_q8", "La Torre", "Sali alla Torre del Predicatore."); done(); } },
            { t: "Aiutarlo a riparare la pompa", big: true, fn: () => { stat("legami", 8); stat("speranza", 10); say("Tamburo", "Con un tecnico e un cacciavite, forse. Ma devo avere il permesso."); questDone("ce_q7"); setStep(N, 2); quest("ce_q8", "La Torre", "Sali alla Torre del Predicatore."); done(); } },
            { t: "Tenere il segreto", big: true, fn: () => { stat("legami", -8); say("Tamburo", "(Annuisce a malincuore.) Forse è meglio. Ma non so quanto potrò reggere."); questDone("ce_q7"); setStep(N, 2); quest("ce_q8", "La Torre", "Sali alla Torre del Predicatore."); done(); } }
          ]);
        } else if (s < 1) {
          say("Tamburo", "Parla con Selce, prima. Ha letto qualcosa che mi fa sentire un po' in colpa.");
          done();
        } else {
          say("Tamburo", "Io resto qui. Se devi scendere nel Cratere, ti seguo.");
          done();
        }
      },

      ce_brace(K) {
        say("Brace", "Sono venuta a piedi. Alla mia età sono ancora in grado. Dimmi solo se il pallone è intero.");
        say("Brace", "Qualunque cosa scegli, ricorda: l'acqua è di chi la divide.");
        done();
      },

      ce_cenere(K) {
        K.say([["ce_cenere", "(Cenere si arrampica sul braciere, poi scende e ti punta con gli occhi gialli. Sa che stai per scegliere.)"]], K.done);
      },

      ce_predicatore(K) {
        const s = S();
        if (s === 2) {
          say("Predicatore", "Sei salito. Allora lo racconto.");
          say("Predicatore", "Venti anni fa, un villaggio giù nel Cratere giocava con questo pallone. Io ero lì. Poi sono arrivati i saccheggiatori, e non è rimasto niente.");
          say("Predicatore", "Da allora ho deciso che il pallone non deve più far litigare nessuno. Per questo lo tengo in alto: nessuno può rubare quello che non si tocca.");
          say("Predicatore", "Ma tu dici che il gioco può essere un modo di non uccidersi. Ti sfido a mostrarmelo.");
          stat("speranza", 5);
          questDone("ce_q8");
          setStep(N, 3);
          quest("ce_q9", "L'ultima partita", "Gioca al Campo di Rottami contro il Predicatore.");
          done();
        } else if (s === 3) {
          say("Predicatore", "Il campo è pronto. Il vento di cenere spinge verso il basso: usalo.");
          ask("Inizi l'ultima partita?", [
            {
              t: "Gioca al Campo di Rottami (Partita)", big: true,
              fn: () => {
                K.ownMatch(window.__rottami.start, {
                  title: "Campo di Rottami · la partita del Cratere",
                  oppNames: ["Predicatore", "Fedeli del Cratere"],
                  mate: "Selce",
                  done: (res) => {
                    if (res.win) {
                      say("Predicatore", "(Il Predicatore lascia cadere il bastone.) Ho visto, finalmente, quello che temevo di dimenticare.");
                      say("Predicatore", "Il pallone non è un dono né una condanna. È una promessa che si rinnova ogni volta.");
                      stat("speranza", 15); stat("legami", 10);
                      questDone("ce_q9");
                      setStep(N, 4);
                      done();
                    } else {
                      say("Predicatore", "Non ancora. Riprova quando il tuo tiro sarà più calmo.");
                      done();
                    }
                  }
                });
              }
            },
            { t: "Chiedi un momento", fn: () => { say("Selce", "Pensa alle lamiere: si muovono sempre allo stesso ritmo."); done(); } }
          ]);
        } else if (s === 4) {
          say("Predicatore", "È il momento della scelta. Qualunque cosa decidi, la tua storia resterà in queste lamiere.");
          ask("Come chiudi la storia del pallone?", endChoices());
        } else {
          say("Predicatore", "Torna, quando vuoi. La Torre ha sempre una brace accesa.");
          done();
        }
      }
    };

    return {
      n: N,
      title: "Il Cratere dei Fuochi",
      sub: "Il bordo del Cratere, la Torre del Predicatore e l'ultima partita.",
      start: "ce_cratere",
      introBg: "ce_cratere",
      zones,
      talk,
      goal,
      intro: () => [
        ["voce", "Il bordo del Cratere dei Fuochi. Da qui si vede tutto, compreso quello che sarebbe meglio non vedere."],
        ["voce", "La storia del pallone finisce dove è cominciata: nella cenere. Ma a te la scelta di come."]
      ]
    };
  }

  boot();
})();
