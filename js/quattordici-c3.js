// js/quattordici-c3.js - IL TORNEO DEI QUATTORDICI · Capitolo 3 «Il Sipario» (Giorno 3)
// Due squadre in gara. L'Ala Nord, il capitano dei Corvi, Madama Sfinge e un Premio che si può chiedere in quattro modi.
(function () {
  "use strict";
  function boot() {
    const D = window.__quattordici;
    if (!D || !D.addChapter || !window.__qtH) return setTimeout(boot, 120);
    if (!D._has || !D._has(2)) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const H = window.__qtH, N = 3, k = H.kit(K, N), { say } = k, S = k.S;
    const F = K.F, stat = (a, v) => K.bond(a, v);

    K.cos("qt_c3", { kind: "shirt", label: "Maglia della Finale del Meridiana", val: "#fbbf24", from: "Capitolo 3 di Il Torneo dei Quattordici" });
    K.lore("l_sfinge", { t: "Madama Sfinge", d: "Ha vinto il Torneo quindici anni fa. Il suo desiderio fu che nessuno la dimenticasse. Da allora il Torneo si ripete, e con lui il suo nome." });
    K.lore("l_ala", { t: "L'Ala Nord", d: "Un corridoio di porte numerate. Dietro ognuna una squadra dorme, sveglia ma senza volontà, con un contratto firmato la notte della sconfitta." });

    const goal = (s) => {
      const cl = K.clock;
      if (s === 0) return "Sei nell'Ala Nord. Parla con Ilse: ha trovato la porta.";
      if (s === 1 && cl.is("Mattina")) return "Mattina libera: scegli UNA attività con Ilse o Corvo. Alle quattro la finale, nel Sipario.";
      if (s === 1) return "La finale. Vai nel Sipario (porta a est) e parla con il Banditore.";
      if (s === 2) return "Hai vinto la finale. Parla con Madama Sfinge, nel Sipario: il Premio ti aspetta.";
      return "Il Torneo è concluso.";
    };

    const endChoices = () => {
      const opts = [
        { t: "Prendi il Premio per te (Il Premio)", big: true, fn: () => { say("Sfinge", "Una scelta onesta. Diciamo: la più comune. Chieda, e la sua cosa è sua."); say("Ilse", "(A mezza voce.) Non è una scelta sbagliata. Solo una scelta."); k.fin("sipario"); } },
        { t: "Prendi il posto del Banditore (La Maschera)", big: true, fn: () => { say("Banditore", "(Si toglie la maschera con un sospiro.) Finalmente. Tenga, la mia. Le starà meglio che a me."); say("Sfinge", "Prima o poi ci arrivano tutti. Benvenuto, Banditore."); k.fin("patto"); } }
      ];
      if (F.get("qt_chiave")) opts.splice(1, 0, { t: "Smaschera il Banditore (Il Sipario Strappato)", big: true, fn: () => { say("Ilse", "(Ti passa la chiave.) Dietro il quadro dell'Ala Nord. Facciamo vedere a tutti cosa c'è scritto."); say("Banditore", "(Si lascia togliere la maschera. Sotto, un volto stanco di quarant'anni.) Ero il Dodicesimo, signor Campione. Mi hanno tenuto qui perché sapevo le battute."); k.fin("rivolta"); } });
      if (F.get("qt_chiave") && K.stat("alleanze") >= 35 && K.stat("verita") >= 35) opts.push({ t: "Chiedi la libertà di tutti (I Quattordici)", big: true, fn: () => { say("Sfinge", "(Per la prima volta, senza sorridere.) Nessuno l'ha mai chiesto. Nessuno ci ha mai creduto."); say("Corvo", "Io ci credo. E ho il registro con i nomi."); say("Ilse", K.rel && K.rel.lv("qt_ilse") >= 3 ? "Tutti e quattordici. Fuori, adesso. E poi, finalmente, mi spieghi come si tira come si deve." : "Tutti e quattordici. Fuori, adesso."); k.fin("quattordici"); } });
      return opts;
    };

    const zones = {
      qt_alanord: {
        region: "alanord", name: "L'Ala Nord", short: "Ala Nord", sub: "Un corridoio di porte numerate, un tabellone con due lampade accese", bg: "qt_alanord", time: "notte",
        w: 28, h: 16, start: [4, 8], items: [[7, 5], [19, 5], [14, 13]],
        areas: [[0, 0, 27, 15, "L'Ala Nord: il silenzio qui ha un battito"]],
        flavor: {
          N: "Il tabellone: quattordici lampade, due accese. Le altre sembrano spente da poco, non da sempre.",
          X: "Porte con un numero e un nome su una targhetta. Dietro, respiri regolari e nessuna risposta.",
          K: "Casse di valigie etichettate con i nomi delle squadre. Dentro, vestiti ripiegati con cura."
        },
        intro: [
          ["voce", "L'Ala Nord non è né un carcere né un ospedale. È più ordinata di entrambi: pavimenti lucidi, targhette dorate, una luce rossa in fondo."]
        ],
        npcs: () => [{ id: "qt_ilse", at: [8, 9] }, { id: "qt_corvo", at: [19, 7] }],
        build(L) {
          const { lay, house } = L;
          H.frame(L, 28, 16);
          lay(2, 8, 26, 8, ":");
          lay(7, 1, 20, 1, "N"); lay(3, 3, 6, 3, "X"); lay(21, 3, 24, 3, "X"); lay(10, 12, 12, 12, "K"); lay(17, 12, 19, 12, "K");
          house(27, 7, 1, 3, { door: [27, 8], enter: { to: "qt_sipario", at: [2, 8] } });
        }
      },

      qt_sipario: {
        region: "sipario", name: "Il Sipario", short: "Sipario", sub: "Velluto rosso, una pedana dorata e una poltrona vuota", bg: "qt_sipario", time: "sera",
        w: 28, h: 16, start: [3, 8], items: [[8, 5], [20, 11], [14, 13]],
        areas: [[0, 0, 27, 15, "Il Sipario: il teatro in cui il Torneo finisce, sempre alla stessa ora"]],
        flavor: {
          N: "Il tabellone ripetuto sul fondale: due lampade, e una striscia di velluto dove dovrebbero essere le altre.",
          M: "Una colonna rivestita di velluto. Qualcuno ci ha scritto a matita, in piccolo, un nome.",
          K: "Il leggio dell'annunciatore: un copione con le battute segnate in rosso.",
          P: "Una pianta di plastica, l'unica dell'albergo che sembra finta e lo ammette."
        },
        intro: [
          ["voce", "Il Sipario è il teatro dell'albergo. In scena, una pedana dorata e due poltrone: una per chi vince, l'altra per chi gli parla."]
        ],
        npcs: () => [{ id: "qt_banditore", at: [12, 6] }, { id: "qt_sfinge", at: [19, 6] }],
        build(L) {
          const { lay, house } = L;
          H.frame(L, 28, 16);
          lay(2, 8, 26, 8, ":");
          lay(7, 1, 20, 1, "N"); lay(6, 4, 6, 4, "M"); lay(6, 12, 6, 12, "M"); lay(21, 12, 21, 12, "M"); lay(13, 3, 14, 3, "K"); lay(3, 13, 3, 13, "P"); lay(24, 13, 24, 13, "P");
          house(0, 7, 1, 3, { door: [0, 8], enter: { to: "qt_alanord", at: [25, 8] } });
        }
      }
    };

    // la notte del giorno 3: niente evento, solo la convocazione davanti alla Sfinge
    k.night = () => {
      say("voce", "Cala la notte sul Meridiana, l'ultima. Nel Sipario si accende una sola luce, quella della pedana.");
      say("Sfinge", "(Dal fondo del teatro.) Caro Campione. Quando vuole. Il Premio non scade, ma io sì.");
      k.done();
    };

    const talk = {
      qt_ilse: H.npc(K, k, N, {
        who: "Ilse",
        brief() {
          say("Ilse", "Siamo in due squadre. Noi e i Corvi di Rigel. Le altre sono qui: ho contato le porte, ho contato i letti, ho contato i respiri. Tutti vivi. Nessuno sveglio.");
          say("Ilse", "Oggi la finale. Poi il Premio. Non so cosa chiederai, ma non rispondermi adesso: lo sapremo quando lo sapremo.");
          say("Ilse", "Mattina libera, partita alle quattro, sera libera. Poi... decidi.");
          stat("alleanze", 3);
        },
        early: "Parlami prima di andare in giro. Ho trovato l'Ala Nord.",
        acts: [
          {
            t: "Allenarsi con Ilse (+Forma)", cond: () => K.stat("forma") < 3,
            run() {
              say("voce", "L'ultimo allenamento, in un corridoio di marmo. Ilse para con la stessa calma di sempre, ma stavolta ti guarda mentre tira.");
              say("Ilse", "Se domani non ci vediamo, ti dico che sei stato un buon compagno.");
              stat("forma", 1); stat("alleanze", 6);
            }
          },
          {
            t: "Esplorare l'Ala Nord con Ilse (+Verità)", cond: () => !F.get("qt3_ala"),
            run() {
              F.set("qt3_ala", true);
              say("voce", "Camminate lungo il corridoio. Targhette: Fenicotteri di Marina, Gufi di Tesla, tante altre. Dietro la porta di Teo senti il suo respiro regolare. Non risponde.");
              say("Ilse", "(Sottovoce.) Non sono morti. Sono... depositati. Non so se è meglio.");
              stat("verita", 10); stat("alleanze", 4);
            }
          }
        ],
        idle: ["Se ci fosse una uscita, la conosceremmo.", "Alle quattro il Sipario. Respira."],
        pm: "Alle quattro la finale. Il Banditore ti aspetta nel Sipario, a est.",
        skip: "Va bene. Ma io non ti aspetterò per sempre."
      }),

      qt_corvo: H.npc(K, k, N, {
        who: "Corvo",
        early: "Parla con la tua compagna, prima. Ha visto cose.",
        acts: [
          {
            t: "Parlare con Corvo (+Alleanze, +Verità)", rel: 8, cond: () => !F.get("qt3_corvo"),
            run() {
              F.set("qt3_corvo", true);
              say("Corvo", "Sono qui da tre giorni, e in tre anni di Torneo non ho mai visto nessuno uscire dall'Ala Nord. Ho perso mio fratello al primo. Non l'ho mai ritrovato.");
              say("Corvo", "Non sono nei Corvi per vincere. Sono qui per capire. Quando giochiamo, gioco duro: il Banditore guarda. Ma non ti odio.");
              stat("alleanze", 10); stat("verita", 8);
            }
          },
          {
            t: "Chiedere a Corvo cosa farebbe del Premio", cond: () => F.get("qt3_corvo") && !F.get("qt3_corvo2"),
            run() {
              F.set("qt3_corvo2", true);
              say("Corvo", "Lo chiederei per mio fratello. Poi ci ripenserei, e lo chiederei per tutti. Poi ci ripenserei ancora. Non esiste un Premio che non abbia un conto.");
              stat("alleanze", 6);
            }
          }
        ],
        idle: ["Non siamo nemici. Siamo solo dalla parte opposta di un fischio.", "Alle quattro. Niente rancori."],
        pm: "Ci vediamo in campo. Il Banditore ci osserva.",
        skip: "Come vuoi. Io resto qui."
      }),

      qt_banditore() {
        const s = S(), cl = K.clock;
        if (s === 0) { say("Banditore", "Ultimo giorno! Prima di giocare, parli con la sua compagna. Poi la finale."); return k.done(); }
        if (s < 2 && cl.is("Pomeriggio")) {
          say("Banditore", "Signore e signori, la FINALE! I Corvi di Rigel contro la coppia del Campione e di Ilse Varga! Il Premio aspetta il vincitore dietro il sipario.");
          return k.ask("Vuoi giocare la finale ora?", [
            {
              t: "Gioca contro i Corvi di Rigel (Zona Rossa)", big: true,
              fn: () => H.match(K, k, {
                title: "Zona Rossa · la finale contro i Corvi di Rigel", opp: "Corvo e Lenz",
                win() {
                  say("Banditore", "Fischio finale! Il Torneo dei Quattordici ha il suo vincitore! Madama Sfinge la aspetta in sala.");
                  say("Corvo", "(Sorride, per la prima volta.) Non ti ho lasciato vincere. Ma non ho nemmeno provato troppo a fermarti.");
                  say("Ilse", "Adesso sei quello a cui il Premio può dire sì. Pensaci bene.");
                  stat("alleanze", 3); K.setStep(N, 2); k.spend();
                },
                lose() { say("Banditore", "La finale non si è conclusa, signor Campione! Per regolamento, la seconda occasione è sempre concessa. A patto di pazientare ancora un po'."); k.done(); }
              })
            },
            { t: "Chiedi cosa c'è dietro il sipario", fn: () => { say("Banditore", "Un teatro, signor Campione. E una poltrona. Il resto, mi dispiace, è il Premio."); k.done(); } }
          ]);
        }
        if (s < 2) { say("Banditore", "Alle quattro, signor Campione. Fino ad allora, il Sipario è chiuso."); return k.done(); }
        say("Banditore", "Parli con Madama Sfinge. Io ho il microfono, lei ha il Premio."); k.done();
      },

      qt_sfinge() {
        const s = S(), cl = K.clock;
        if (s < 2) { say("Sfinge", "Caro Campione, prima la partita. Poi le chiacchiere. Il Premio è paziente, io un po' meno."); return k.done(); }
        say("Sfinge", "Complimenti, Campione. Il Torneo è suo. Il Premio: «qualunque cosa desideri», come promesso. Quindici anni fa lo vinsi io. Chiesi che nessuno si dimenticasse di me.");
        say("Sfinge", "Per questo il Torneo si ripete. Per questo il Banditore c'è. Per questo ci sono le valigie. Un desiderio è un contratto, Campione: ha sempre qualcuno che paga.");
        say("Sfinge", "Adesso scelga. E scelga bene: non ci sono rimborsi.");
        k.ask("Qual è il tuo desiderio?", endChoices());
      }
    };

    return {
      n: N,
      title: "Il Sipario",
      sub: "Due squadre, l'Ala Nord e un Premio che si può chiedere in quattro modi.",
      start: "qt_alanord",
      introBg: "qt_alanord",
      zones,
      talk,
      goal,
      intro: () => {
        K.clock.set(3, 0);
        return [
          ["voce", "Terzo giorno. Le lampade del tabellone sono quasi tutte spente. Ne restano due: la tua e quella dei Corvi di Rigel."],
          ["qt_ilse", "Oggi finisce. Una squadra vince, l'altra... lo sai. Ma prima voglio mostrarti una cosa."],
          ["voce", "L'Ala Nord ti aspetta, e con lei il motivo per cui nessuno ha mai raccontato com'è finito il Torneo."]
        ];
      }
    };
  }

  boot();
})();
