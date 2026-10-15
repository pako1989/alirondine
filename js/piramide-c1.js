// js/piramide-c1.js - LA PIRAMIDE DEL SOLE · Capitolo 1 «Nel Cuore dello Yucatán · L'Ingresso Segreto»
// Arrivo all'accampamento nella giungla del 1936, decifrazione del primo codice maya con il Prof. Alvarez,
// allerta per la presenza dei mercenari del Capitano Vargas e prima sfida rituale all'Anello di Pietra.
(function () {
  "use strict";
  function boot() {
    const D = window.__piramide;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { setStep, quest } = K;
    const N = 1, S = () => K.stepOf(N);
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
      K.scene(lines, () => K.openMain(), "my_atrio");
    };

    K.cos("my_c1", { kind: "shirt", label: "Camicia di lino coloniale da esploratore 1936", val: "#d97706", from: "Capitolo 1 de La Piramide del Sole" });
    K.lore("l_yucatan", { t: "La Giungla dello Yucatán", d: "Fitta vegetazione pluviale che nasconde templi millenari, cenotes sacri e campi di Pok-ta-pok." });
    K.lore("l_poktapok", { t: "Il Sacro Pok-ta-pok", d: "Il gioco della palla rituale maya: si colpisce con fianchi e ginocchia per infilare la gomma negli anelli di pietra." });

    const goal = (s) => ({
      0: "Sei all'accampamento della spedizione. Parla con il Professor Alvarez vicino alla tenda principale.",
      1: "La radio emette interferenze misteriose. Parla con Diego il radiotelegrafista.",
      2: "Raggiungi la Guida Ixchel al limitare della Giungla Sacra per farti strada tra le rovine.",
      3: "Raggiungi l'Atrio Monumentale della Piramide del Sole e affronta la prima prova all'Anello di Pietra!"
    }[s] || "Il primo capitolo è completato. Continua con il Capitolo 2.");

    const zones = {
      my_campobase: {
        region: "giungla", name: "Accampamento della Spedizione", short: "Campo Base", sub: "Tende coloniali, casse di reperti e generatori a nafta", bg: "my_campobase", time: "giorno",
        w: 32, h: 22, start: [6, 11], items: [[8, 6], [24, 7], [16, 17]],
        areas: [[0, 0, 31, 21, "La radura dell'accampamento archeologico tra alberi di ceiba secolari"]],
        flavor: {
          T: "Le grandi tende di canapa verde oliva piantate dagli archeologi della spedizione.",
          C: "Casse di legno contrassegnate 'MUSEO DI STORIA - MERIDA 1936' colme di attrezzi da scavo.",
          R: "Il radiotelegrafo a onde corte che gracchia continuamente bollettini atmosferici e segnali Morse.",
          s: "Il sentiero intagliato col machete che conduce nella giungla fitta verso la piramide."
        },
        intro: [
          ["voce", "Yucatán, primavera del 1936. La spedizione archeologica guidata dal celebre Professor Alvarez è finalmente giunta ai piedi dell'inesplorata Piramide del Sole."],
          ["voce", "Invitato come consulente atletico per studiare la biomeccanica dei bassorilievi del Pok-ta-pok, ti ritrovi immerso nell'umidità tropicale mentre sciami di zanzare danzano sulle lanterne a carburo."]
        ],
        npcs: (s) => [
          { id: "my_alvarez", at: s === 0 ? [10, 11] : [6, 8] },
          { id: "my_diego", at: [22, 11] },
          ...(s >= 2 ? [{ id: "my_ixchel", at: [28, 11] }] : [{ id: "my_ixchel", at: [25, 16] }])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          // Sentiero battuto centrale
          lay(3, 11, 30, 11, ":"); lay(10, 8, 10, 16, ":"); lay(22, 9, 22, 14, ":");
          // Tende e casse
          lay(4, 4, 8, 7, "T"); lay(14, 4, 18, 6, "C"); lay(20, 4, 25, 7, "T");
          lay(4, 15, 8, 18, "C"); lay(20, 15, 25, 18, "T");
          // Uscita verso la giungla
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "my_giungla", at: [2, 11] } });
        }
      },

      my_giungla: {
        region: "giungla", name: "La Giungla Sacra", short: "Giungla", sub: "Liane penzolanti, ruscelli limpidi e antiche stele sommerse da felci", bg: "my_giungla", time: "giorno",
        w: 32, h: 22, start: [3, 11], items: [[12, 6], [22, 15], [18, 9]],
        areas: [[0, 0, 31, 21, "Il fitto sottobosco pluviale dove il canto dei quetzal riecheggia tra le radici giganti"]],
        flavor: {
          F: "Gigantesche felci preistoriche che gocciolano rugiada tropicale ad ogni alito di vento.",
          S: "Antiche stele maya coperte di muschio: figure intagliate che stringono sfere di pietra grezza.",
          A: "Un ruscello sotterraneo che sgorga tra le rocce calcaree e si tuffa verso un abisso misterioso.",
          s: "La scalinata monumentale coperta da radici che porta all'atrio della Piramide del Sole."
        },
        npcs: (s) => [
          ...(s >= 2 ? [{ id: "my_ixchel", at: [18, 11] }] : []),
          ...(s >= 3 ? [{ id: "my_vargas", at: [27, 8] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          // Sentiero tortuoso tra le liane
          lay(2, 11, 8, 11, ":"); lay(8, 8, 16, 8, ":"); lay(16, 8, 16, 14, ":"); lay(16, 14, 24, 14, ":"); lay(24, 11, 30, 11, ":");
          // Stele e vegetazione
          lay(4, 4, 7, 6, "S"); lay(11, 14, 14, 17, "F"); lay(22, 4, 26, 7, "S");
          // Uscita verso campo base e verso atrio
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "my_campobase", at: [29, 11] } });
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "my_atrio", at: [3, 11] } });
        }
      },

      my_atrio: {
        region: "rovine", name: "Atrio della Piramide del Sole", short: "Atrio", sub: "Scalinate monumentali, colonne intagliate e il primo anello rituale", bg: "my_atrio", time: "giorno",
        w: 32, h: 22, start: [4, 11], items: [[6, 6], [26, 6], [16, 17]],
        areas: [[0, 0, 31, 21, "L'imponente vestibolo cerimoniale incastonato tra i gradoni della piramide"]],
        flavor: {
          G: "Bassorilievo monumentale del dio Kukulkan con occhi di pirite lucente.",
          B: "Bracieri rituali di pietra lavica in cui ardono resine aromatiche di copale.",
          P: "L'Anello di Pietra solare sospeso sulla parete centrale a quattro metri d'altezza.",
          s: "La soglia oscura che discende verso il grande cortile sacro del Pok-ta-pok."
        },
        npcs: (s) => [
          { id: "my_alvarez", at: [14, 11] },
          { id: "my_ixchel", at: [18, 11] },
          ...(s >= 3 ? [{ id: "my_kukulkan", at: [24, 11] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          // Pavimentazione cerimoniale in lastre
          lay(2, 11, 29, 11, ":"); lay(10, 6, 22, 16, ":");
          // Bracieri e colonne
          lay(8, 5, 10, 6, "B"); lay(22, 5, 24, 6, "B"); lay(8, 16, 10, 17, "B"); lay(22, 16, 24, 17, "B");
          lay(15, 4, 17, 5, "G");
          // Uscita verso la giungla
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "my_giungla", at: [29, 11] } });
        }
      }
    };

    const talk = {
      my_alvarez(K) {
        const s = S();
        if (s === 0) {
          say("Prof. Alvarez", "Splendido vederti in forma, ragazzo mio! Guarda queste coordinate:<br>la Piramide del Sole è rimasta intatta per oltre mille anni grazie alla fitta vegetazione.");
          say("Prof. Alvarez", "Ma non siamo soli: i miei informatori a Merida mi hanno avvertito che il <em>Capitano Vargas</em> e i suoi mercenari stanno risalendo il fiume alla ricerca dell'oro.");
          say("Prof. Alvarez", "Dobbiamo decifrare i codici sacri prima di loro! Vai da <b>Diego</b> al telegrafo: pare ci sia un messaggio urgente.");
          setStep(N, 1);
          quest("my_q1", "Segnali nella Giungla", "Parla con Diego il radiotelegrafista per decifrare il messaggio.");
          done();
        } else if (s === 1) {
          say("Prof. Alvarez", "Diego sta regolando le antenne a onde corte. Sbrigati prima che la tempesta disturbi il segnale!");
          done();
        } else if (s >= 2 && s < 3) {
          say("Prof. Alvarez", "Ixchel conosce ogni passo di queste rovine. Ascolta bene ciò che ha da dirti sulla profezia del Pok-ta-pok!");
          done();
        } else if (s === 3) {
          say("Prof. Alvarez", "Incredibile! Davanti a noi c'è l'ingresso sigillato dell'Atrio. Per aprire il portale monolitico dobbiamo eseguire il tiro cerimoniale nell'Anello di Pietra!");
          done();
        } else {
          say("Prof. Alvarez", "Il primo sigillo è infranto! Prepariamoci a discendere nel grande cortile cerimoniale.");
          done();
        }
      },

      my_diego(K) {
        const s = S();
        if (s === 1) {
          say("Diego", "Professore! Campione! Ho agganciato un messaggio cifrato sul canale 44!");
          say("Diego", "È Vargas! Dice: <em>'Abbiamo superato le rapide, saremo all'ingresso della piramide entro il tramonto'</em>.");
          say("Diego", "La nostra guida <b>Ixchel</b> vi aspetta all'inizio del sentiero nella giungla: dice che solo chi rispetta le antiche regole atletiche del dio sole potrà superare il guardiano.");
          questDone("my_q1");
          setStep(N, 2);
          quest("my_q2", "La Guida dello Yucatán", "Raggiungi Ixchel al limitare della Giungla Sacra.");
          done();
        } else if (s === 0) {
          say("Diego", "Un attimo di pazienza... c'è troppa elettricità statica nell'aria dello Yucatán oggi.");
          done();
        } else {
          say("Diego", "Tengo le frequenze aperte. Se sento il rumore delle imbarcazioni di Vargas vi avverto subito!");
          done();
        }
      },

      my_ixchel(K) {
        const s = S();
        if (s === 2) {
          say("Ixchel", "Benvenuto nella terra dei miei antenati, straniero.");
          say("Ixchel", "Vedo nei tuoi occhi il riflesso di un atleta, non l'avidità dei tombaroli come Vargas.");
          say("Ixchel", "Questo luogo non è una semplice tomba: è il sacro anfiteatro dove i guerrieri offrivano il loro sudore al dio Kukulkan.");
          say("Ixchel", "Il primo sigillo della piramide si aprirà solo se colpirai la palla pesante di caucciù senza toccare il terreno sacro. Vieni, raggiungiamo l'Atrio!");
          questDone("my_q2");
          setStep(N, 3);
          quest("my_q3", "Il Primo Rito del Sole", "Affronta la prova dell'Anello di Pietra nell'Atrio della Piramide.");
          done();
        } else if (s < 2) {
          say("Ixchel", "La foresta ascolta ogni nostro respiro. Parla prima con il Professor Alvarez.");
          done();
        } else if (s === 3) {
          say("Ixchel", "Siamo pronti. Parla con il Guardiano Kukulkan al centro dell'Atrio!");
          done();
        } else {
          say("Ixchel", "Hai il tocco del giaguaro. La piramide ha accettato la tua sfida.");
          done();
        }
      },

      my_vargas(K) {
        say("Capitano Vargas", "Guarda un po' chi c'è... i topi da biblioteca dell'università!");
        say("Capitano Vargas", "State perdendo tempo con le pietre e i giochi dei pagani. Quella piramide nasconde una camera d'oro zecchino, e sarà mia!");
        done();
      },

      my_kukulkan(K) {
        const s = S();
        if (s === 3) {
          say("Guardiano Kukulkan", "Mille primavere hanno atteso questo momento. Chi bussa alla porta del Serpente Piumato deve dimostrare la grazia dell'anca e la potenza della volée!");
          ask("Vuoi iniziare la Prova dell'Anello di Pietra?", [
            {
              t: "Sfida il Guardiano al Pok-ta-pok (Partita)",
              big: true,
              fn: () => {
                K.ownMatch(window.__anello.start, {
                  oppNames: ["Kukulkan", "Sacerdote del Sole"],
                  mate: "Ixchel",
                  done: (res) => {
                    if (res.win) {
                      say("Guardiano Kukulkan", "La palla di caucciù ha volato senza toccare la polvere! Il portale dell'Atrio si spalanca davanti al tuo coraggio!");
                      questDone("my_q3");
                      stat("coraggio", 15);
                      stat("sintonia", 20);
                      fin();
                    } else {
                      say("Guardiano Kukulkan", "I tuoi rimbalzi sono stati incerti e i dardi hanno sibilato! Riprova la cerimonia quando sarai pronto.");
                      done();
                    }
                  }
                });
              }
            },
            {
              t: "Chiedi consigli tattici ad Alvarez prima di giocare",
              fn: () => {
                say("Prof. Alvarez", "Ricorda: usa il colpo d'anca (Z) per le bordate basse e la volée (X) per mirare all'anello alto prima del terzo rimbalzo!");
                done();
              }
            }
          ]);
        } else {
          say("Guardiano Kukulkan", "Il portale è aperto. L'eco dei rimbalzi sacri vi attende nel grande cortile.");
          done();
        }
      }
    };

    return {
      n: N,
      title: "Nel Cuore dello Yucatán · L'Ingresso Segreto",
      sub: "Accampamento della spedizione, bassorilievi e la prima prova rituale del Pok-ta-pok.",
      start: "my_campobase",
      introBg: "my_titolo",
      zones,
      talk,
      goal,
      intro: () => [["voce","Yucatán, primavera del 1936. La spedizione del Professor Alvarez è giunta ai piedi dell'inesplorata Piramide del Sole."],["voce","Sei qui come consulente atletico, per studiare i bassorilievi del Pok-ta-pok. Il Capitano Vargas e i suoi mercenari risalgono il fiume."]]
    };
  }

  boot();
})();
