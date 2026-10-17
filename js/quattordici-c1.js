// js/quattordici-c1.js - IL TORNEO DEI QUATTORDICI · Capitolo 1 «L'Invito» (Giorno 1)
// L'albergo Meridiana, la tua compagna Ilse, un amico che gioca dall'altra parte e il primo fischio.
(function () {
  "use strict";
  function boot() {
    const D = window.__quattordici;
    if (!D || !D.addChapter || !window.__qtH) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const H = window.__qtH, N = 1, k = H.kit(K, N), { say } = k, S = k.S;
    const F = K.F, stat = (a, v) => K.bond(a, v);

    K.cos("qt_c1", { kind: "shirt", label: "Maglia del Meridiana, Giorno 1", val: "#b91c1c", from: "Capitolo 1 di Il Torneo dei Quattordici" });
    K.lore("l_zona", { t: "Zona Rossa", d: "Due contro due su un campo che si restringe: dopo dieci secondi le fasce rosse avanzano dai bordi e chi ci resta dentro perde fiato fino al KO. Vince chi segna di più; il pari è una sconfitta." });
    K.lore("l_meridiana", { t: "L'albergo Meridiana", d: "Una collina, un albergo di lusso, quattordici squadre invitate. Il Premio è «qualunque cosa desideri». Nessuno ricorda chi lo abbia mai ritirato." });

    const goal = (s) => {
      const cl = K.clock;
      if (s === 0) return "Sei nell'atrio del Meridiana. Parla con Ilse Varga, la tua compagna di squadra.";
      if (s === 1 && cl.is("Mattina")) return "Mattina libera: scegli UNA attività con Ilse o con Teo. Alle quattro si gioca.";
      if (s === 1) return "È il momento della partita. Vai nello stadio e parla con il Banditore.";
      if (s === 2 && cl.is("Sera")) return "Sera libera: scegli UNA attività con Ilse. Poi arriva la notte.";
      return "Il primo giorno è concluso. Continua con il Capitolo 2.";
    };

    const zones = {
      qt_atrio: {
        region: "albergo", name: "L'Atrio del Meridiana", short: "Atrio", sub: "Marmo, tappeti rossi e il rumore di chi non vuole sembrare nervoso", bg: "qt_atrio", time: "giorno",
        w: 28, h: 16, start: [4, 8], items: [[9, 6], [18, 10], [13, 13]],
        areas: [[0, 0, 27, 15, "L'atrio del Meridiana: i lampadari costano più della tua squadra"]],
        flavor: {
          M: "Una colonna di marmo con un cartello: «Si prega di non appoggiarsi. Il Torneo non è responsabile».",
          K: "Il bancone della reception. Un registro aperto, una campanella d'ottone e un addetto che non alza mai gli occhi.",
          U: "Un tavolino con la tovaglia rossa e dei biscotti che nessuno osa toccare.",
          P: "Una pianta finta così curata che sembra vera. Il lusso fa questo effetto.",
          B: "Uno scaffale di guide turistiche della collina. Tutte con la pagina dell'Ala Nord strappata."
        },
        intro: [
          ["voce", "L'atrio del Meridiana profuma di lucido da pavimenti e di nervosismo contenuto."],
          ["voce", "Quattordici squadre, tre giorni. Domani, a quest'ora, ne saranno rimaste meno."]
        ],
        loot: { "23,3": { id: "qt_biscotti", text: "Un vassoio di biscotti che nessuno osa toccare. Tu ne prendi un sacchetto.", empty: "Il vassoio è vuoto. Qualcuno ti ha visto." } },
        npcs: (s) => [
          { id: "qt_ilse", at: [8, 9] },
          ...(s < 2 ? [{ id: "qt_teo", at: [18, 7] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          H.frame(L, 28, 16);
          lay(2, 8, 26, 8, ":");
          lay(6, 4, 6, 4, "M"); lay(6, 12, 6, 12, "M"); lay(21, 4, 21, 4, "M"); lay(21, 12, 21, 12, "M");
          lay(11, 4, 15, 4, "K"); lay(3, 3, 4, 4, "U"); lay(23, 3, 24, 4, "U"); lay(22, 1, 24, 1, "B");
          lay(3, 13, 3, 13, "P"); lay(24, 13, 24, 13, "P");
          house(27, 7, 1, 3, { door: [27, 8], enter: { to: "qt_stadio", at: [2, 8] } });
        }
      },

      qt_stadio: {
        region: "stadio", name: "Il Campo del Meridiana", short: "Stadio", sub: "Un prato perfetto, un tabellone con quattordici lampade e un uomo con la maschera", bg: "qt_stadio", time: "giorno",
        w: 28, h: 16, start: [3, 8], items: [[8, 5], [20, 11], [14, 11]],
        areas: [[0, 0, 27, 15, "Il campo di Zona Rossa: il prato è bellissimo, le righe rosse sono ancora spente"]],
        flavor: {
          N: "Il tabellone: quattordici lampade, tutte accese. Una per squadra, finché dura.",
          U: "Panchine rivestite di velluto. Nessuno si siede: sembra un'offesa.",
          E: "Il cancello verso l'Ala Nord. Sigillato con un nastro rosso e una serratura che non sembra voler essere aperta."
        },
        intro: [
          ["voce", "Il campo è un rettangolo di prato perfetto. Sul bordo alto e basso, strisce rosse spente aspettano."]
        ],
        loot: { "4,13": { id: "qt_fascia", text: "Sotto la panchina di velluto c'è una fascia da capitano ripiegata.", empty: "Sotto la panchina non c'è altro." } },
        npcs: () => [{ id: "qt_banditore", at: [14, 6] }],
        build(L) {
          const { lay, house } = L;
          H.frame(L, 28, 16);
          lay(2, 8, 26, 8, ":");
          lay(7, 1, 20, 1, "N"); lay(4, 13, 6, 13, "U"); lay(21, 13, 23, 13, "U"); lay(12, 14, 15, 14, "E");
          house(0, 7, 1, 3, { door: [0, 8], enter: { to: "qt_atrio", at: [25, 8] } });
        }
      }
    };

    // ------------------------------------------------------------------ notte del giorno 1
    k.night = () => {
      stat("squadre", -7);
      say("voce", "Alle undici le luci dell'albergo si abbassano. Nei corridoi passano carrelli, voci basse, un ascensore che non si ferma mai ai piani giusti.");
      say("Banditore", "(Dall'altoparlante.) Gentili ospiti, il Meridiana ringrazia le sette squadre che ci lasciano stanotte. Domani, nuova giornata. Dormite bene.");
      say("Ilse", "Sette. Hai contato anche tu? Sette squadre, un furgone, e nessuno che dica addio.");
      say("Ilse", "Non ho visto nessuno passare dal portone. Eppure le stanze sono vuote.");
      say("voce", "Dalla finestra vedi un furgone senza insegne attraversare il cortile e sparire verso l'Ala Nord. Poi, di nuovo silenzio.");
      k.fin();
    };

    // ------------------------------------------------------------------ dialoghi
    const talk = {
      qt_ilse: H.npc(K, k, N, {
        who: "Ilse",
        brief() {
          say("Ilse", "Ilse Varga. Portiere, finché qualcuno non ha deciso che ero troppo vecchia. Trentaquattro anni: li porto bene, grazie.");
          say("Ilse", "Ci hanno sorteggiati insieme. Io faccio il muro, tu fai il resto. Due contro due, il campo si restringe, chi resta nelle fasce rosse si stanca e basta.");
          say("Ilse", "Regola uno: non restare nelle fasce. Regola due: non fidarti di chi ti offre da bere. Regola tre: il Banditore porta una maschera, quindi non so se sorride. Peggio.");
          say("Ilse", "Mattina libera. Alle quattro, la partita. Poi la sera. Poi la notte. Io intanto mi alleno: se vuoi, vieni.");
          stat("alleanze", 4);
        },
        early: "Ci hanno sorteggiati insieme, ricordi? Parlami, prima.",
        acts: [
          {
            t: "Allenarsi con Ilse (+Forma)", cond: () => K.stat("forma") < 3,
            run() {
              say("voce", "Passate un'ora sul campo di prova. Ilse para tutto con una calma che mette soggezione: dopo un po' smetti di tirare forte e cominci a tirare bene.");
              say("Ilse", "Meglio. Non ti dico bravo, ti dico meno prevedibile.");
              stat("forma", 1); stat("alleanze", 6);
            }
          },
          {
            t: "Chiederle del suo passato", cond: () => !F.get("qt1_past"),
            run() {
              F.set("qt1_past", true);
              say("Ilse", "La mia squadra è fallita tre anni fa. Un giorno ero titolare, il giorno dopo avevo un invito per un torneo di cui nessuno parlava.");
              say("Ilse", "L'invito diceva «il Premio è qualunque cosa desideri». Non ho desideri, ho conti da pagare. Quindi eccomi.");
              stat("alleanze", 8);
            }
          }
        ],
        idle: ["Se ti serve un muro, sai dove sono.", "Mi sto riposando. Il campo mi aspetta alle quattro."],
        pm: "Alle quattro si gioca. Il Banditore è nello stadio, oltre la porta a est. Respira e andiamo.",
        skip: "Va bene. Ma ricorda che la mattina non torna."
      }),

      qt_teo: H.npc(K, k, N, {
        who: "Teo",
        brief: null,
        early: "Ehi, Campione! Parla con la tua compagna: è quella con le braccia incrociate e lo sguardo da portiere.",
        acts: [
          {
            t: "Colazione con Teo (+Alleanze)", rel: 8, cond: () => !F.get("qt1_teo"),
            run() {
              F.set("qt1_teo", true);
              say("Teo", "Teo Marangon! Giovanili, Rimini, tre gol miei e due tuoi, e a me quelli tuoi li ricordo tutti. Non sono rancoroso, solo preciso.");
              say("Teo", "Giochiamo contro oggi, ho visto il tabellone. I Fenicotteri di Marina contro di voi. Ti auguro il meglio. A metà.");
              stat("alleanze", 10);
            }
          },
          {
            t: "Sbirciare il registro con Teo (+Verità)", cond: () => !F.get("qt1_reg"),
            run() {
              F.set("qt1_reg", true);
              say("Teo", "Il registro della reception. Io distraggo il portiere, tu leggi veloce. Pronto? Ehi, scusi, ma la mia stanza ha il bagno in giardino?");
              say("voce", "Riesci a leggere tre righe: «Squadre ospiti: 14. Squadre uscenti: da definire. Destinazione: Ala Nord. Rimborso: non previsto.»");
              stat("verita", 8); stat("alleanze", 4);
            }
          }
        ],
        idle: ["Dopo la partita ti offro un caffè. Se vinci tu, lo offro due volte.", "Non guardarmi così, sono tranquillissimo."],
        pm: "Ci vediamo in campo. Niente rancore: solo gol.",
        skip: "Ok ok, hai da fare. Anch'io. Facciamo finta di essere impegnati."
      }),

      qt_banditore() {
        const s = S(), cl = K.clock;
        if (s === 0) { say("Banditore", "Benvenuti al Meridiana! Prima di tutto vada dalla sua compagna di squadra. Le regole le spiega meglio lei: io le spiego peggio, ma più in fretta."); return k.done(); }
        if (s < 2 && cl.is("Pomeriggio")) {
          say("Banditore", "Signor Campione! Le quattro in punto. Zona Rossa, due contro due, i Fenicotteri di Marina dall'altra parte. Pronto a regalare uno spettacolo?");
          return k.ask("Vuoi giocare ora?", [
            {
              t: "Gioca contro i Fenicotteri (Zona Rossa)", big: true,
              fn: () => H.match(K, k, {
                title: "Zona Rossa · contro i Fenicotteri di Marina", opp: "Teo e Nico",
                win() {
                  say("Banditore", "Fischio finale! I Fenicotteri di Marina lasciano il Torneo con la stima dell'albergo.");
                  say("Teo", "(Teo sorride, un po' storto.) Bel gol, davvero. Ci vediamo domani a colazione? Dove mi portano, di preciso?");
                  say("Banditore", "All'Ala Nord, signor Marangon. Un servizio di cortesia. Le valigie sono già state spostate.");
                  say("Ilse", "(Piano, al tuo orecchio.) Non guardarlo. Guarda la strada che prendono. Ricordatela.");
                  stat("alleanze", 3); K.setStep(N, 2); k.spend();
                },
                lose() {
                  say("Banditore", "Peccato! Per oggi i regolamenti prevedono un'amichevole di recupero. Si ripresenti, a fiato ripreso.");
                  k.done();
                }
              })
            },
            { t: "Chiedi di ripassare le regole", fn: () => { say("Banditore", "Due contro due. Per dieci secondi il campo è intero, poi le fasce rosse si stringono dai bordi. Nella fascia perde fiato, a zero è KO per due secondi e mezzo. Chi segna di più in un minuto vince. Il pari... è una sconfitta. Mi dispiace, ma è il regolamento."); k.done(); } }
          ]);
        }
        if (s < 2) { say("Banditore", "Si gioca alle quattro, signor Campione. Fino ad allora, il Meridiana è a sua completa disposizione. Cioè: l'atrio."); return k.done(); }
        say("Banditore", "La partita è chiusa. Ora cena, riposo, e una buona notte. Le luci le spengo io."); k.done();
      }
    };

    return {
      n: N,
      title: "L'Invito",
      sub: "Il Meridiana, Ilse, un amico dall'altra parte del campo e il primo fischio di Zona Rossa.",
      start: "qt_atrio",
      introBg: "qt_titolo",
      zones,
      talk,
      goal,
      intro: () => {
        K.clock.set(1, 0);
        return [
          ["voce", "Il Torneo dei Quattordici si gioca una volta ogni dieci anni, a porte chiuse, in un albergo di lusso su una collina senza nome."],
          ["voce", "Quattordici squadre. Tre giorni. Un gioco nuovo: Zona Rossa, un due contro due su un campo che si restringe."],
          ["qt_banditore", "Benvenuti al Meridiana! Il vincitore riceve il Premio. Gli altri ricevono... un trattamento. Di riguardo."],
          ["voce", "Hai accettato l'invito perché il Premio è «qualunque cosa desideri». Ed è l'unica cosa che ti manca."]
        ];
      }
    };
  }

  boot();
})();
