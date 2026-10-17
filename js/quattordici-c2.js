// js/quattordici-c2.js - IL TORNEO DEI QUATTORDICI · Capitolo 2 «La Notte delle Valigie» (Giorno 2)
// Il posto di Teo a colazione è vuoto. L'archivista Luce ha un registro, il Banditore ha un orario e la notte porta un conto.
(function () {
  "use strict";
  function boot() {
    const D = window.__quattordici;
    if (!D || !D.addChapter || !window.__qtH) return setTimeout(boot, 120);
    if (!D._has || !D._has(1)) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const H = window.__qtH, N = 2, k = H.kit(K, N), { say } = k, S = k.S;
    const F = K.F, stat = (a, v) => K.bond(a, v), luce = () => F.get("qt2_luce", 0) | 0;

    K.cos("qt_c2", { kind: "shirt", label: "Maglia del Meridiana, Giorno 2", val: "#7f1d1d", from: "Capitolo 2 di Il Torneo dei Quattordici" });
    K.lore("l_valigie", { t: "Le valigie", d: "Gli eliminati vanno all'Ala Nord con le valigie già pronte. Nessuno li ha visti salutare. Nessuno ha ricevuto una cartolina." });
    K.lore("l_registro", { t: "Il registro dell'archivio", d: "Luce Ferrante annota ogni arrivo e ogni partenza. Accanto a ogni squadra eliminata, una colonna dice «valore»: non è un punteggio." });

    const goal = (s) => {
      const cl = K.clock;
      if (s === 0) return "Sei nel Giardino. Parla con Ilse: ha chiesto del furgone.";
      if (s === 1 && cl.is("Mattina")) return "Mattina libera: scegli UNA attività con Ilse o con Luce (nell'Archivio, porta a est). Alle quattro si gioca.";
      if (s === 1) return "È ora della partita. Parla con il Banditore, nel Giardino.";
      if (s === 2 && cl.is("Sera")) return "Sera libera: scegli UNA attività. Poi arriva la notte.";
      return "Il secondo giorno è concluso. Continua con il Capitolo 3.";
    };

    const zones = {
      qt_giardino: {
        region: "giardino", name: "Il Giardino del Meridiana", short: "Giardino", sub: "Siepi a sfera, una fontana e armadietti per le squadre sotto un porticato", bg: "qt_giardino", time: "giorno",
        w: 28, h: 16, start: [4, 8], items: [[7, 5], [16, 10], [22, 13]],
        areas: [[0, 0, 27, 15, "Il giardino dell'albergo: curato come un campo da golf, silenzioso come un funerale"]],
        flavor: {
          P: "Una siepe potata a forma di pallone. Qualcuno ci ha messo una cura inquietante.",
          U: "Un tavolino di ferro battuto. Su un lato, una tazzina ancora tiepida.",
          X: "Gli armadietti delle squadre. Alcuni hanno già il lucchetto aperto e la targa grattata via."
        },
        intro: [
          ["voce", "Il giardino è bellissimo e mezzo vuoto. Al tavolo di Teo, la colazione è apparecchiata per una persona che non verrà."]
        ],
        npcs: () => [{ id: "qt_ilse", at: [8, 9] }, { id: "qt_banditore", at: [19, 7] }],
        build(L) {
          const { lay, house } = L;
          H.frame(L, 28, 16);
          lay(2, 8, 26, 8, ":");
          lay(8, 3, 10, 3, "P"); lay(18, 12, 20, 12, "P"); lay(12, 5, 13, 6, "U"); lay(22, 2, 25, 2, "X"); lay(3, 13, 4, 13, "P");
          house(27, 7, 1, 3, { door: [27, 8], enter: { to: "qt_archivio", at: [2, 8] } });
        }
      },

      qt_archivio: {
        region: "archivio", name: "L'Archivio del Meridiana", short: "Archivio", sub: "Scaffali alti, polvere dorata e una lampada sempre accesa", bg: "qt_archivio", time: "giorno",
        w: 28, h: 16, start: [3, 8], items: [[8, 4], [20, 4], [8, 13]],
        areas: [[0, 0, 27, 15, "L'archivio: trent'anni di arrivi e partenze, ordinati con maniacale gentilezza"]],
        flavor: {
          B: "Scaffali di registri. Ogni costola ha un anno e una lettera: i volumi del Torneo sono tutti qui, e tutti tranne uno sono stati aperti.",
          K: "Una scrivania con una lente d'ingrandimento e un blocco di appunti a grafia minuscola.",
          U: "Un tavolino con due tazze. Una ha il rossetto sul bordo.",
          P: "Una felce stanca che sopravvive per ostinazione."
        },
        intro: [
          ["voce", "L'archivio ha il silenzio di una biblioteca e l'ordine di un'officina. Una lampada verde illumina un'unica scrivania."]
        ],
        npcs: () => [{ id: "qt_luce", at: [14, 8] }],
        build(L) {
          const { lay, house } = L;
          H.frame(L, 28, 16);
          lay(2, 8, 26, 8, ":");
          lay(3, 2, 24, 2, "B"); lay(3, 6, 10, 6, "B"); lay(17, 6, 24, 6, "B"); lay(12, 11, 15, 11, "K"); lay(4, 11, 5, 12, "U"); lay(22, 12, 22, 12, "P");
          house(0, 7, 1, 3, { door: [0, 8], enter: { to: "qt_giardino", at: [25, 8] } });
        }
      }
    };

    // ------------------------------------------------------------------ notte del giorno 2
    k.night = () => {
      stat("squadre", -5);
      say("voce", "A mezzanotte un urlo breve, tagliato a metà. Poi nulla. Poi i passi di chi corre senza sembrare in fretta.");
      say("Banditore", "(Dall'altoparlante.) Gentili ospiti, un incidente all'archivio. L'archivista Ferrante ci ha lasciati e il Meridiana la ricorderà con affetto. Per ragioni organizzative, cinque squadre escono dal Torneo. Restate nelle camere.");
      say("Ilse", "Non è stato un incidente. Ha parlato con te, e adesso non parla più. Ricordatelo quando ti offrono un biscotto.");
      if (luce() >= 1) {
        F.set("qt_chiave", true);
        say("voce", "Nella tasca della giacca trovi una chiave di ottone che prima non c'era. Un biglietto, con grafia minuscola: «Dietro il quadro dell'Ala Nord. Non fidarti dei corvi che sorridono. L.»");
        stat("verita", 6);
      } else {
        say("voce", "Nessuna chiave, nessun biglietto. Luce non ha avuto il tempo di fidarsi di te. Forse, a conti fatti, nessuno ha avuto il tempo di niente.");
      }
      k.fin();
    };

    const talk = {
      qt_ilse: H.npc(K, k, N, {
        who: "Ilse",
        brief() {
          say("Ilse", "Teo non c'è. Il suo letto è fatto, la valigia sparita. Ho chiesto del furgone: «trasferimento volontario». Ho provato a entrare all'Ala Nord: sigillata.");
          say("Ilse", "Luce Ferrante, l'archivista, ha un registro. Dice che chi lo legge impara cose. Io da sola non lo faccio parlare; tu forse sì.");
          say("Ilse", "Mattina libera, partita alle quattro, poi sera. Scegli bene dove metterti: due ore a testa non bastano per tutto.");
          stat("alleanze", 3);
        },
        early: "Teo non c'è, hai notato? Parlami: ho cose da dirti.",
        acts: [
          {
            t: "Allenarsi con Ilse (+Forma)", cond: () => K.stat("forma") < 3,
            run() {
              say("voce", "Un'ora di tiri e rimbalzi sulle siepi. Ilse ti insegna a leggere la fascia rossa prima che arrivi: un passo avanti, uno di lato, mai fermo.");
              say("Ilse", "Meglio. Ho paura che ti servirà.");
              stat("forma", 1); stat("alleanze", 6);
            }
          },
          {
            t: "Aprire l'armadietto di Teo (+Verità)", cond: () => !F.get("qt2_teo"),
            run() {
              F.set("qt2_teo", true);
              say("voce", "L'armadietto di Teo ha il lucchetto aperto e la targa grattata via. Dentro, una lettera piegata in quattro e il suo braccialetto da capitano.");
              say("Ilse", "(Legge.) «Ilse, se leggi questo non mi hanno portato in vacanza. Il furgone aveva i sedili con le cinghie. Non fidarti di chi ti offre da bere. Salutami il Campione, digli che il gol di Rimini era suo.»");
              stat("verita", 8); stat("alleanze", 4);
            }
          }
        ],
        idle: ["Ho il braccialetto di Teo in tasca. Lo restituirò a chi di dovere.", "Luce sta nell'archivio, a est. Se la vedi, salutala."],
        pm: "Alle quattro si gioca. Il Banditore è qui nel giardino.",
        skip: "Va bene. Ma non aspettarti che l'albergo ci aspetti."
      }),

      qt_luce: H.npc(K, k, N, {
        who: "Luce",
        early: "Prima parli con la signorina Varga, poi vieni da me. Il Torneo ha un ordine, e io lo rispetto.",
        acts: [
          {
            t: "Leggere il registro con Luce (+Verità)", cond: () => luce() < 2,
            run() {
              const n = luce() + 1; F.set("qt2_luce", n);
              if (n === 1) {
                say("Luce", "Venga, venga. Trent'anni di annotazioni, nessuno che le abbia mai lette. Guardi qui: dieci anni fa, quattordici squadre. Colonna «uscenti»: tutte. Colonna «valore»: una cifra.");
                say("Luce", "Non è un punteggio, signor Campione. È un prezzo. Ogni squadra che esce dal Torneo viene «ceduta» a un contratto. Non so a chi, non so per quanto.");
                stat("verita", 15);
              } else {
                say("Luce", "Oggi ho trovato la sua squadra nel registro, alla riga di domani. Colonna «valore»: ancora vuota. Significa che il Meridiana non ha ancora deciso quanto valete.");
                say("Luce", "Se mi succede qualcosa, la chiave è dove ho sempre detto. Non me lo chieda adesso. Le basta sapere che non sono stata io a nasconderla male.");
                stat("verita", 15); stat("alleanze", 4);
              }
            }
          }
        ],
        idle: ["Con calma. L'archivio non scappa, a differenza degli ospiti.", "Un tè? No, meglio di no. È una vecchia abitudine: non bevo più quello che non ho preparato io."],
        pm: "Alle quattro c'è la partita, signor Campione. Vada, io tengo il fuoco acceso.",
        skip: "Come vuole. Il registro è paziente. Io un po' meno."
      }),

      qt_banditore() {
        const s = S(), cl = K.clock;
        if (s === 0) { say("Banditore", "Buongiorno! Per la sua partita di oggi, prima parli con la sua compagna: ha dormito poco e lo si vede."); return k.done(); }
        if (s < 2 && cl.is("Pomeriggio")) {
          say("Banditore", "Le quattro! I Gufi di Tesla le aspettano. Un'ottima squadra, cinque trofei in bacheca. A volte ritirare la bacheca è un sollievo.");
          return k.ask("Vuoi giocare ora?", [
            {
              t: "Gioca contro i Gufi di Tesla (Zona Rossa)", big: true,
              fn: () => H.match(K, k, {
                title: "Zona Rossa · contro i Gufi di Tesla", opp: "Tesla e Mara",
                win() {
                  say("Banditore", "Fischio finale! I Gufi di Tesla lasciano il Torneo. Stasera il Meridiana offre il tè d'addio.");
                  say("Ilse", "(Piano.) Il tè d'addio. Come lo chiamerebbero se ci fosse un funerale?");
                  stat("alleanze", 3); K.setStep(N, 2); k.spend();
                },
                lose() { say("Banditore", "Un peccato! Ma i regolamenti sono generosi: una seconda occasione, signor Campione. Il Meridiana è paziente."); k.done(); }
              })
            },
            { t: "Chiedi dove vanno gli eliminati", fn: () => { say("Banditore", "In un luogo che le piacerebbe: l'Ala Nord. Con le valigie, i bagagli e un contratto di riposo. Nessuno si lamenta. Mi creda."); stat("verita", 2); k.done(); } }
          ]);
        }
        if (s < 2) { say("Banditore", "Alle quattro, signor Campione. Il giardino è suo: non calpesti le siepi a forma di pallone, ci tengono."); return k.done(); }
        say("Banditore", "Partita archiviata. Buona serata. E buona notte: dormire bene è una questione di sopravvivenza."); k.done();
      }
    };

    return {
      n: N,
      title: "La Notte delle Valigie",
      sub: "Il posto di Teo a colazione è vuoto, l'archivio ha un registro e la notte ha un prezzo.",
      start: "qt_giardino",
      introBg: "qt_giardino",
      zones,
      talk,
      goal,
      intro: () => {
        K.clock.set(2, 0);
        return [
          ["voce", "Secondo giorno. A colazione il posto di Teo è apparecchiato per una persona che non verrà."],
          ["qt_ilse", "Ho dormito poco. Il furgone è tornato alle quattro. Vuoto."],
          ["voce", "Oggi giocate di nuovo. E il Meridiana ha ancora un conto da chiudere."]
        ];
      }
    };
  }

  boot();
})();
