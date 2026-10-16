// js/cenere-c2.js - CENERE E GLORIA · Capitolo 2 «La Strada di Polvere»
// La carovana lascia il bunker verso l'Oasi del Pozzo. L'acqua scarseggia, il Predicatore delle Dune guarda da lontano.
(function () {
  "use strict";
  function boot() {
    const D = window.__cenere;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    if (!D._has || !D._has(1)) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { setStep, quest } = K;
    const N = 2, S = () => K.stepOf(N);
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
      K.scene(lines, () => K.openMain(), "ce_oasi");
    };

    K.cos("ce_c2", { kind: "shirt", label: "Sciarpa-mantello da carovana", val: "#a3481f", from: "Capitolo 2 di Cenere e Gloria" });
    K.lore("l_strada", { t: "La Strada di Polvere", d: "Una lingua di terra battuta che collega i villaggi. Nessuno l'ha costruita; è la somma di mille passi." });
    K.lore("l_predicatore", { t: "Il Predicatore delle Dune", d: "Dicono che predichi dalla Torre del Cratere. Chi lo ascolta ne esce o più sicuro o più inquieto." });

    const goal = (s) => ({
      0: "Sei sulla Strada di Polvere. Tamburo ti aspetta vicino alla carovana: ci sono scelte da fare sull'acqua.",
      1: "Raggiungi l'Oasi del Pozzo. La Dottoressa Selce ti aspetta per leggere la mappa.",
      2: "Il Predicatore delle Dune è all'Oasi. Parlagli prima di decidere.",
      3: "Il Predicatore ti ha sfidato al Campo di Rottami. Accetta."
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const frame = (L, w, h) => {
      const { lay } = L;
      lay(0, 0, w - 1, 0, "a"); lay(0, 0, 0, h - 1, "a"); lay(w - 1, 0, w - 1, h - 1, "a"); lay(0, h - 1, w - 1, h - 1, "a");
      lay(1, 1, w - 2, h - 2, ".");
    };

    const zones = {
      ce_strada: {
        region: "strada", name: "La Strada di Polvere", short: "Strada", sub: "Terra battuta, cartelli storti e una carcassa che fa ombra", bg: "ce_strada", time: "giorno",
        w: 32, h: 22, start: [3, 11], items: [[8, 6], [20, 16], [27, 6]],
        areas: [[0, 0, 31, 21, "La strada lunga tra i villaggi, con il vento che porta granelli d'oro e di fastidio"]],
        flavor: {
          M: "Un cumulo di lamiere arrugginite ai bordi della strada. Qualcuno ci ha appeso una borraccia vuota, per scaramanzia.",
          K: "Una carcassa d'auto. Nell'ombra, qualcuno ha lasciato un cartello: «ACQUA 40 PASSI».",
          U: "Una tenda di lamiera lasciata dai viaggiatori. Dentro, ancora, un biglietto con una mappa a matita.",
          B: "Un barile spento, con un po' di cenere che sa ancora di legno."
        },
        intro: [
          ["voce", "Fuori dal bunker la luce è dura e il vento sposta la sabbia come un pensiero fisso."],
          ["voce", "La carovana scende verso l'Oasi. Ogni zona all'aperto costa una borraccia: <b>l'acqua è la valuta del viaggio</b>."]
        ],
        npcs: () => [
          { id: "ce_tamburo", at: [10, 11] },
          { id: "ce_cenere", at: [6, 13] }
        ],
        build(L) {
          const { lay, house } = L;
          frame(L, 32, 22);
          lay(2, 11, 30, 11, ":"); lay(16, 8, 16, 14, ":");
          lay(12, 4, 14, 5, "M"); lay(22, 4, 25, 5, "K"); lay(4, 16, 7, 18, "U"); lay(24, 16, 27, 18, "M");
          lay(18, 9, 18, 9, "B");
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "ce_oasi", at: [2, 11] } });
        }
      },

      ce_oasi: {
        region: "strada", name: "L'Oasi del Pozzo", short: "Oasi", sub: "Una pozza d'acqua limpida, palme storte e un pozzo profondo", bg: "ce_oasi", time: "giorno",
        w: 32, h: 22, start: [3, 11], items: [[7, 7], [24, 6], [15, 17]],
        areas: [[0, 0, 31, 21, "L'Oasi, dove l'acqua vera brilla come una promessa"]],
        flavor: {
          W: "Una pozza d'acqua limpida: non è tanta, ma è vera. Basta a calmare chiunque.",
          P: "Un pozzo profondo con una carrucola di rottami. Il secchio sale pieno e scende vuoto, da vent'anni.",
          M: "Casse e barili dei viandanti. Qualcuno ha scritto «ACQUA = AMICI».",
          U: "Una tenda dei Fedeli della Torre, con una brace sempre accesa dentro."
        },
        npcs: (s) => [
          { id: "ce_selce", at: [12, 11] },
          ...(s >= 2 ? [{ id: "ce_predicatore", at: [24, 11] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          frame(L, 32, 22);
          lay(2, 11, 30, 11, ":"); lay(14, 5, 14, 17, ":");
          lay(18, 4, 22, 7, "W"); lay(18, 15, 21, 17, "W"); lay(27, 8, 27, 8, "P"); lay(5, 4, 8, 5, "M"); lay(5, 16, 9, 18, "U"); lay(25, 16, 28, 18, "M");
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "ce_strada", at: [29, 11] } });
        }
      }
    };

    const talk = {
      ce_tamburo(K) {
        const s = S();
        if (s === 0) {
          say("Tamburo", "La carovana è dietro di noi. Quaranta persone e undici borracce. Dobbiamo decidere come dividerle.");
          say("Tamburo", "C'è un gruppo di profughi che cammina con noi dall'ultimo pozzo. Non hanno quasi niente.");
          ask("Come dividi l'acqua con i profughi?", [
            { t: "Dividi quasi tutto con loro (Borracce -2)", big: true, fn: () => { stat("borraccia", -2); stat("legami", 15); stat("speranza", 5); say("Tamburo", "(Tamburo annuisce piano.) Lo sapevo. Per questo ti ho seguito."); setStep(N, 1); quest("ce_q4", "L'Oasi del Pozzo", "Raggiungi l'Oasi e parla con la Dottoressa Selce."); done(); } },
            { t: "Dividi metà, tieni il resto (Borracce -1)", big: true, fn: () => { stat("borraccia", -1); stat("legami", 7); say("Tamburo", "Onesto. Non è poco, non è tutto. Funziona."); setStep(N, 1); quest("ce_q4", "L'Oasi del Pozzo", "Raggiungi l'Oasi e parla con la Dottoressa Selce."); done(); } },
            { t: "Tieni l'acqua per la carovana", big: true, fn: () => { stat("legami", -5); stat("speranza", -5); say("Tamburo", "(Tamburo scrolla le spalle.) Non è sbagliato. Ma ricordati che un giorno saremo noi a chiedere."); setStep(N, 1); quest("ce_q4", "L'Oasi del Pozzo", "Raggiungi l'Oasi e parla con la Dottoressa Selce."); done(); } }
          ]);
        } else if (s === 1) {
          say("Tamburo", "Selce ci aspetta all'Oasi. Tieniti al riparo dal vento: ti porta sabbia anche nei pensieri.");
          done();
        } else {
          say("Tamburo", "Quel Predicatore mi fa sentire come se mi leggesse i pensieri. Ma tienilo d'occhio: non ha detto una bugia, finora.");
          done();
        }
      },

      ce_cenere(K) {
        K.say([["ce_cenere", "(Cenere fiuta l'aria e punta verso est, dove il vento sembra portare l'odore dell'acqua.)"]], K.done);
      },

      ce_selce(K) {
        const s = S();
        if (s === 1) {
          say("Selce", "Ce l'abbiamo fatta. L'Oasi del Pozzo: l'unico posto dove l'acqua scorre senza essere comprata.");
          say("Selce", "Guarda la mappa: qui c'è il Bunker, qui l'Oasi, e qui, a nord, il Cratere. La Torre del Predicatore sta sul bordo.");
          say("Selce", "Dicono che sotto il Cratere ci sia un vecchio campo. Se vero, il pallone non è un caso. È il resto di un posto che ricordava com'era giocare.");
          ask("Riempi le borracce al pozzo?", [
            { t: "Riempi quanto basta (Borracce +3)", fn: () => { stat("borraccia", 3); say("Selce", "Un sorso a testa, e basta. Non dimenticarlo."); questDone("ce_q4"); setStep(N, 2); quest("ce_q5", "Il Predicatore", "Parla con il Predicatore delle Dune."); done(); } },
            { t: "Lascia l'acqua agli altri viandanti (Legami +5)", fn: () => { stat("legami", 5); stat("speranza", 5); say("Selce", "Scelta rara. Qui nessuno lo dimenticherà."); questDone("ce_q4"); setStep(N, 2); quest("ce_q5", "Il Predicatore", "Parla con il Predicatore delle Dune."); done(); } }
          ]);
        } else if (s < 1) {
          say("Selce", "Ancora un po' di strada. Tieni d'occhio le borracce.");
          done();
        } else {
          say("Selce", "Il Predicatore è all'Oasi. Non ti darà fastidio, se non gli dai ragione. E non ti darà ragione, se non gliene dai.");
          done();
        }
      },

      ce_predicatore(K) {
        const s = S();
        if (s === 2) {
          say("Predicatore", "Il corriere con il pallone. Avevo sentito, e non volevo crederci.");
          say("Predicatore", "Lo sai cos'è, quello? Un dono. Non un gioco. Chi lo usa per vincere ha già perso.");
          say("Predicatore", "Venti anni fa quel pallone apparteneva a un villaggio che non esiste più. Io non l'ho dimenticato.");
          say("Predicatore", "Se credi di avere ragione, giocami. Sul tuo campo di lamiere. Se vinci, ascolterò. Se perdi, il pallone va nella Torre.");
          stat("speranza", 5);
          questDone("ce_q5");
          setStep(N, 3);
          quest("ce_q6", "La sfida del Predicatore", "Accetta la partita al Campo di Rottami.");
          done();
        } else if (s === 3) {
          say("Predicatore", "Allora? Sei venuto a giocare o a discutere?");
          ask("Accetti la sfida del Predicatore?", [
            {
              t: "Gioca al Campo di Rottami (Partita)", big: true,
              fn: () => {
                K.ownMatch(window.__rottami.start, {
                  title: "Campo di Rottami · contro il Predicatore",
                  oppNames: ["Predicatore", "Fedeli della Torre"],
                  mate: "Tamburo",
                  done: (res) => {
                    if (res.win) {
                      say("Predicatore", "(Il Predicatore abbassa il bastone.) Hai giocato come se il pallone non fosse un oggetto. Interessante.");
                      say("Predicatore", "Ascolterò. Ma voglio vedere il Cratere. Là capirai perché io non posso lasciarlo.");
                      stat("legami", 8); stat("speranza", 15);
                      questDone("ce_q6");
                      fin();
                    } else {
                      say("Predicatore", "Troppo presto, corriere. Torna quando saprai perché giochi.");
                      done();
                    }
                  }
                });
              }
            },
            { t: "Chiedi più tempo", fn: () => { say("Selce", "Il campo ha lamiere che si muovono: studia i tempi."); done(); } }
          ]);
        } else {
          say("Predicatore", "Ci vediamo al Cratere.");
          done();
        }
      }
    };

    return {
      n: N,
      title: "La Strada di Polvere",
      sub: "La carovana verso l'Oasi del Pozzo, l'acqua da dividere e il Predicatore delle Dune.",
      start: "ce_strada",
      introBg: "ce_strada",
      zones,
      talk,
      goal,
      intro: () => [
        ["voce", "Il bunker alle spalle, il pallone nello zaino. La strada si srotola verso l'Oasi."],
        ["voce", "Ogni passo all'aperto costa acqua. E ogni scelta sull'acqua costa legami."]
      ]
    };
  }

  boot();
})();
