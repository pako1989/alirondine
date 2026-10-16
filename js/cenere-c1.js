// js/cenere-c1.js - CENERE E GLORIA · Capitolo 1 «Il Pallone del Bunker»
// Il Villaggio di Rottame ha l'acqua razionata e un ragazzo ex saccheggiatore ha trovato un bunker nelle dune.
// Dentro c'è un pallone. Fuori, qualcuno lo vuole.
(function () {
  "use strict";
  function boot() {
    const D = window.__cenere;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { setStep, quest } = K;
    const N = 1, S = () => K.stepOf(N);
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
      K.scene(lines, () => K.openMain(), "ce_bunker");
    };

    K.cos("ce_c1", { kind: "shirt", label: "Giubba di lamiera del Villaggio di Rottame", val: "#8c5a2b", from: "Capitolo 1 di Cenere e Gloria" });
    K.lore("l_crollo", { t: "Il Crollo", d: "Nessuno ricorda con precisione cosa sia successo. I vecchi dicono «prima», i giovani «adesso». Restano rottami, polvere e qualche regola per non litigare sull'acqua." });
    K.lore("l_borraccia", { t: "Un sorso a testa", d: "La regola dei villaggi: l'acqua si divide, non si accumula. Chi la tiene tutta per sé, prima o poi resta senza amici." });

    const goal = (s) => ({
      0: "Sei al Villaggio di Rottame. Parla con la Vedova Brace vicino ai barili.",
      1: "Brace ti manda da Tamburo, il meccanico. Trovalo tra le baracche.",
      2: "Tamburo ha trovato un bunker nelle dune. Raggiungilo ed entra: la Dottoressa Selce ti aspetta.",
      3: "Nel bunker c'è un pallone. Dente e i suoi saccheggiatori lo vogliono: affrontalo al Campo di Rottami."
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const frame = (L, w, h) => {
      const { lay } = L;
      lay(0, 0, w - 1, 0, "a"); lay(0, 0, 0, h - 1, "a"); lay(w - 1, 0, w - 1, h - 1, "a"); lay(0, h - 1, w - 1, h - 1, "a");
      lay(1, 1, w - 2, h - 2, ".");
    };

    const zones = {
      ce_villaggio: {
        region: "villaggio", name: "Villaggio di Rottame", short: "Villaggio", sub: "Baracche di lamiera, barili di fuoco e un pozzo quasi asciutto", bg: "ce_villaggio", time: "giorno",
        w: 32, h: 22, start: [4, 11], items: [[12, 7], [24, 7], [14, 17]],
        areas: [[0, 0, 31, 21, "Le baracche di Rottame, tenute insieme da fil di ferro e testardaggine"]],
        flavor: {
          M: "Un mucchio di rottami selezionati: qui si ripara tutto, si butta quasi niente.",
          U: "Una tenda di lamiera. Dentro, brande, una radio spenta e una borraccia segnata col nome di qualcuno.",
          K: "Una carcassa d'auto che da vent'anni fa da deposito attrezzi.",
          B: "Il barile di fuoco della piazza: di sera, intorno a lui, si decidono le cose importanti.",
          P: "Il pozzo del villaggio. Dà ancora acqua, ma poca e con un sapore che non convince nessuno."
        },
        intro: [
          ["voce", "Dopo il Crollo, il Villaggio di Rottame è una piazza di lamiera dove l'acqua si conta a sorsi."],
          ["voce", "Sei arrivato come corriere: porti messaggi tra villaggi, sai quando è meglio non fare domande."]
        ],
        npcs: (s) => [
          { id: "ce_brace", at: [10, 11] },
          { id: "ce_tamburo", at: [22, 12] },
          { id: "ce_cenere", at: [16, 14] }
        ],
        build(L) {
          const { lay, house } = L;
          frame(L, 32, 22);
          lay(2, 11, 30, 11, ":"); lay(10, 6, 10, 16, ":"); lay(22, 8, 22, 15, ":");
          lay(4, 4, 7, 6, "U"); lay(14, 4, 17, 5, "M"); lay(20, 4, 23, 5, "U");
          lay(4, 16, 7, 18, "M"); lay(18, 16, 20, 18, "K"); lay(25, 16, 28, 18, "U");
          lay(11, 9, 11, 9, "B"); lay(9, 9, 9, 9, "B"); lay(26, 10, 26, 10, "P");
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "ce_bunker", at: [2, 11] } });
        }
      },

      ce_bunker: {
        region: "bunker", name: "Il Bunker delle Dune", short: "Bunker", sub: "Corridoi di cemento, scaffali pieni di polvere e un portellone mezzo aperto", bg: "ce_bunker", time: "notte",
        w: 32, h: 22, start: [3, 11], items: [[8, 7], [24, 16], [14, 4]],
        areas: [[0, 0, 31, 21, "Il bunker sotto la sabbia: il suo silenzio ha un'eco che sembra sapere cose"]],
        flavor: {
          M: "Casse militari vuote. Su una c'è scritto, con gesso, «NON APRIRE». Qualcuno l'ha aperta.",
          N: "L'antenna radio del bunker. Cenere ci dorme sotto, quando la radio è calda.",
          E: "Il portellone interno. Dietro, secondo la mappa di Selce, c'era una sala che nessuno ha mai usato per il lavoro.",
          B: "Un barile di fuoco che Tamburo ha portato per scaldare l'ingresso."
        },
        npcs: (s) => [
          ...(s >= 2 ? [{ id: "ce_selce", at: [15, 11] }] : []),
          ...(s >= 3 ? [{ id: "ce_dente", at: [26, 11] }] : []),
          { id: "ce_cenere", at: [8, 14] }
        ],
        build(L) {
          const { lay, house } = L;
          frame(L, 32, 22);
          lay(2, 11, 30, 11, ":"); lay(15, 4, 15, 18, ":");
          lay(5, 4, 8, 5, "M"); lay(21, 4, 25, 5, "E"); lay(5, 17, 9, 18, "M"); lay(21, 17, 25, 18, "M");
          lay(28, 8, 28, 8, "N"); lay(3, 9, 3, 9, "B");
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "ce_villaggio", at: [29, 11] } });
        }
      }
    };

    const talk = {
      ce_brace(K) {
        const s = S();
        if (s === 0) {
          say("Brace", "Un corriere. Dalla strada del mare. Hai l'aria di uno che ha visto più posti che pozzi.");
          say("Brace", "Qui l'acqua la contiamo a sorsi. Non chiediamo storie, chiediamo gambe e buon senso.");
          say("Brace", "Tamburo, il ragazzo delle riparazioni, dice di aver trovato qualcosa nelle dune. Vai a sentirlo, prima che lo trovi qualcun altro.");
          setStep(N, 1);
          quest("ce_q1", "Qualcosa nelle dune", "Parla con Tamburo, il meccanico del villaggio.");
          done();
        } else if (s === 1) {
          say("Brace", "Tamburo è vicino alle tende, quando non è sotto un generatore. Fatti dire tutto: ha un modo di parlare che gira intorno.");
          done();
        } else if (s === 2) {
          say("Brace", "Il bunker. Vai con la Dottoressa Selce: lei ha le mappe. Io resto: qualcuno deve contare le borracce.");
          done();
        } else {
          say("Brace", "Quando tornerai, mi racconti. E se il pallone è vero, portalo intero.");
          done();
        }
      },

      ce_tamburo(K) {
        const s = S();
        if (s === 1) {
          say("Tamburo", "Brace ti ha mandato. Immagino che tu non voglia la mia versione, ma ti do comunque la mia versione.");
          say("Tamburo", "Ero con Dente, una volta. Rubavamo lamiere, tubi, quello che capitava. Poi ho trovato un generatore che funzionava e ho smesso.");
          say("Tamburo", "Ieri ho trovato un bunker, a est. Dentro c'è un pallone. Un pallone vero, di quelli che rimbalzano.");
          say("Tamburo", "Dente lo sa già. Se arriva prima di noi, finisce male. Per tutti.");
          stat("legami", 8); stat("speranza", 10);
          questDone("ce_q1");
          setStep(N, 2);
          quest("ce_q2", "Il bunker nelle dune", "Entra nel bunker e parla con la Dottoressa Selce.");
          done();
        } else if (s === 0) {
          say("Tamburo", "Aspetta. Ho le mani sporche e la testa altrove. Parla prima con Brace.");
          done();
        } else {
          say("Tamburo", "Vai, vai. Io finisco il generatore e vi raggiungo. Se mi serve un cacciavite lo sapete.");
          done();
        }
      },

      ce_cenere(K) {
        if (!K.F.get("ce_c1_cenere")) {
          K.F.set("ce_c1_cenere", true);
          stat("borraccia", 1);
          K.say([["ce_cenere", "(Cenere ti segue per un po', poi si ferma accanto a una borraccia dimenticata. Miagola come se lo avesse sempre saputo.)"], ["voce", "Trovi una borraccia piena sotto la lamiera. <b>+1 borraccia</b>."]], K.done);
        } else {
          K.say([["ce_cenere", "(Cenere fa le fusa e cerca la tua mano. Sembra volerti dire che il pallone le piace.)"]], K.done);
        }
      },

      ce_selce(K) {
        const s = S();
        if (s === 2) {
          say("Selce", "Ti aspettavo. Il bunker non è una casa: è un archivio. Un luogo dove qualcuno ha messo da parte quello che non voleva perdere.");
          say("Selce", "Ho disegnato la mappa dei corridoi. Questa sala, oltre il portellone, conteneva il pallone. E altre mappe, che ho copiato per metà.");
          say("Selce", "C'è però un problema: Dente è qui fuori. Con quattro uomini. Dice che il pallone è suo di diritto, perché «le cose abbandonate sono di chi arriva primo».");
          say("Selce", "Hanno una proposta. Una partita, qui, su un campo di rottami. Se vinci, il pallone resta nostro. Se perdi, se lo prende e se ne va.");
          stat("legami", 6);
          questDone("ce_q2");
          setStep(N, 3);
          quest("ce_q3", "Il Campo di Rottami", "Affronta Dente e i suoi Saccheggiatori.");
          done();
        } else if (s < 2) {
          say("Selce", "Non siamo ancora pronti. Vai prima dal ragazzo delle riparazioni: ha visto più di me.");
          done();
        } else if (s === 3) {
          say("Selce", "Sta per arrivare Dente. Respira, scegli la linea, e ricordati: il vento di sabbia spinge anche la palla.");
          done();
        } else {
          say("Selce", "Il pallone è salvo. Ma non finisce qui: ho altre mappe da leggere, e altre strade da disegnare.");
          done();
        }
      },

      ce_dente(K) {
        const s = S();
        if (s === 3) {
          say("Dente", "Eccolo. Il corriere con la faccia onesta. Ti do il pallone, se mi dai una buona ragione.");
          say("Dente", "Non c'è? Allora si gioca. Cinque tiri a testa, il campo è di lamiera, io faccio le regole.");
          say("Dente", "Se vinci, vi lascio in pace. Se perdi, il pallone viene con me. E il bunker anche.");
          ask("Accetti la sfida di Dente?", [
            {
              t: "Gioca al Campo di Rottami (Partita)", big: true,
              fn: () => {
                K.ownMatch(window.__rottami.start, {
                  title: "Campo di Rottami · contro Dente",
                  oppNames: ["Dente", "Saccheggiatori"],
                  mate: "Tamburo",
                  done: (res) => {
                    if (res.win) {
                      say("Dente", "(Dente guarda il pallone, poi te. Annuisce una volta, controvoglia.)");
                      say("Dente", "Non è finita. Ma la prossima volta chiedo le regole a te.");
                      stat("legami", 6); stat("speranza", 10);
                      questDone("ce_q3");
                      fin();
                    } else {
                      say("Dente", "Ti ho dato una possibilità. Torna quando sai dove mettere i piedi.");
                      done();
                    }
                  }
                });
              }
            },
            {
              t: "Chiedi un minuto per prepararti",
              fn: () => { say("Selce", "Ripassa la regola: trascina all'indietro, rilascia, e scegli la linea tra le lamiere."); done(); }
            }
          ]);
        } else {
          say("Dente", "Il pallone resta a voi. Per ora.");
          done();
        }
      }
    };

    return {
      n: N,
      title: "Il Pallone del Bunker",
      sub: "Il Villaggio di Rottame, il bunker sotto le dune e la prima sfida al Campo di Rottami.",
      start: "ce_villaggio",
      introBg: "ce_titolo",
      zones,
      talk,
      goal,
      intro: () => [
        ["voce", "Dopo il Crollo, la polvere ha coperto le strade. Ma i villaggi sono rimasti, tenuti insieme da lamiere e regole sull'acqua."],
        ["voce", "Sei un corriere. Porti messaggi, ascolti più di quanto parli. Oggi qualcuno ti aspetta al Villaggio di Rottame."]
      ]
    };
  }

  boot();
})();
