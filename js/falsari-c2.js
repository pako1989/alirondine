// js/falsari-c2.js — «I FALSARI DELLA COPPA» · Capitolo 2: La Lega dei Fonditori
// La ricerca del bronzo pesante navale nei cantieri del molo vecchio.
// Il crogiolo di Mastro Tullio, la colata della replica e la sfida sul pontile.
(function () {
  "use strict";

  function boot() {
    const E = window.__falsariCore;
    if (!E || !E.api || !E.api.addChapter || !E.api._has || !E.api._has(1) || !window.__falsariH || !window.__falsariBanco) {
      return setTimeout(boot, 100);
    }
    E.api.addChapter(chapter2);
  }

  function chapter2(K) {
    const { setStep, quest, F } = K;
    const H = window.__falsariH(K);
    const { say, done, ask, wask } = H;
    const N = 2;
    const S = () => K.stepOf(N);

    H.people();

    K.cos("fc_c2", {
      kind: "shirt",
      label: "Grembiule da Fonditore Navale",
      val: "#b45309",
      from: "Capitolo 2 de I Falsari della Coppa"
    });

    K.lore("l_bronzo", {
      t: "Il Bronzo Navale del 1930",
      d: "Metallo pesante al fosforo ricavato dalle eliche dei dragamine d'anteguerra. Densità esatta (8,8 g/cm³) necessaria per non tradire la replica al tatto."
    });
    K.lore("l_tullio", {
      t: "Mastro Tullio Moriconi",
      d: "Fonditore leggendario dei cantieri navali. Negli anni '50 forgiava ancore per la marina, oggi fonde campane e sculture di contrabbando nel molo vecchio."
    });

    const goal = (s) => ({
      0: "Raggiungi Valerio Ronchi sulla banchina del Molo dei Pescatori.",
      1: "Entra nell'Osteria «La Prua d'Oro» e parla con l'Oste Nino.",
      2: "Entra nella Fonderia Clandestina, parla con Mastro Tullio ed esamina la cassa dei rottami.",
      3: "Attiva il Forno a riverbero per dosare la lega e colare la replica nel crogiolo.",
      4: "Sfida la squadra dei portuali di Mastro Tullio sulla banchina del molo.",
      5: "Mostra la coppa fusa a Mastro Tullio e Valerio per chiudere il piano del Capitolo 2.",
      6: "Il Capitolo 2 è completato."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      setStep(N, 6);
      F.set("fa_c2_done", true);
      K.reward("fa_c2", { coins: 110, cos: "fc_c2" });
      K.finishChapter(N, "ok");
      K.scene([
        ["fc_tullio", "[felice] Guarda che campana! Suona come il bronzo vero di cinquant'anni fa. Pesa esattamente milleottocentoquaranta grammi."],
        ["fc_valerio", "[ride] E con la lezione di calcio che abbiamo dato ai tuoi scaricatori, nessuno al porto aprirà bocca."],
        ["fc_arturo", "[furbo] Ora tocca a me, ragazzi. Questa coppa è ancora cruda: luccica troppo di fonderia fresca. Nel Capitolo 3 dobbiamo invecchiarla."],
        ["fc_arturo", "Acido nitrico, fegato di zolfo e cesello a bulino per riprodurre i graffi della finale del 1934. E poi... dovremo entrare a Villa Morosini."],
        ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>⚖️ Integrità ${K.stat("integrita")} · 🦊 Furbizia ${K.stat("furbizia")} · 🏆 Replica Fusa con Successo!`],
        ["voce", "Il Capitolo 3 ti aspetta: il galà a Villa Morosini e l'arte del falso d'autore."]
      ], () => K.openMain(), "fa_fonderia_bg");
    }

    const zones = {
      fa_molo: {
        region: "molo",
        name: "Molo dei Pescatori",
        short: "Molo",
        sub: "Cantieri Navali Dismessi · 1984",
        bg: "fa_molo_bg",
        w: 32,
        h: 22,
        start: [16, 14],
        act: {
          q: "Entra",
          U: "Guarda le reti",
          Z: "Leggi il bando portuale",
          C: "Fruga tra le bitte"
        },
        flavor: {
          "16,11": "Il faro in lontananza taglia la foschia marina con un fascio d'ambra regolare.",
          "8,14": "Le reti da pesca stese sui cavalletti profumano di sale, canapa e alghe secche."
        },
        items: [
          [6, 15, "Frammento di Rame"],
          [26, 12, "Frammento di Rame"]
        ],
        build(L) {
          // Pavimentazione banchina in pietra
          L.lay(0, 0, 31, 21, ".");

          // Mare a sud e a ovest
          L.lay(0, 18, 31, 21, "~");
          L.lay(0, 0, 4, 17, "~");

          // Banchina in assi grezze K sul ciglio dell'acqua
          L.lay(5, 16, 31, 17, "K");

          // Mura perimetrali dei cantieri a nord
          L.lay(0, 0, 31, 2, "W");

          // Osteria «La Prua d'Oro» a nord-ovest (porte e facciata)
          L.house(8, 3, {
            w: 7, h: 5,
            wall: "W", roof: "#3e2417",
            door: [10, 7],
            enter: ["fa_osteria", 7, 11]
          });

          // Fonderia Clandestina a nord-est (porte e facciata)
          L.house(21, 3, {
            w: 8, h: 5,
            wall: "W", roof: "#180b0b",
            door: [24, 7],
            enter: ["fa_fonderia", 8, 12]
          });

          // Bitte di ormeggio lungo il pontile
          L.put(8, 16, "C");
          L.put(16, 16, "C");
          L.put(24, 16, "C");
        },
        npcs(step, K) {
          const list = [];
          if (step === 0 || step === 5) {
            list.push({ id: "fc_valerio", at: [16, 13] });
          }
          if (step >= 4) {
            list.push({ id: "fc_tullio", at: [18, 13] });
          }
          return list;
        }
      },

      fa_osteria: {
        interior: true,
        outside: ["fa_molo", 10, 8],
        region: "bottega",
        name: "Osteria «La Prua d'Oro»",
        short: "Prua d'Oro",
        sub: "Covo di marinai e fonditori",
        bg: "fa_titolo",
        w: 15,
        h: 13,
        start: [7, 11],
        act: {
          q: "Esci sul molo",
          U: "Esamina il bancone",
          Z: "Leggi la lavagna dei piatti"
        },
        build(L) {
          // Pareti in legno scuro
          L.lay(0, 0, 14, 0, "W");
          L.lay(0, 0, 0, 12, "W");
          L.lay(14, 0, 14, 12, "W");
          L.lay(0, 12, 14, 12, "W");

          // Pavimento a doghe U
          L.lay(1, 1, 13, 11, "U");

          // Uscita a sud
          L.put(7, 12, ".");

          // Bancone in rame
          L.lay(3, 4, 11, 4, "B");
          L.put(3, 3, "B");
          L.put(11, 3, "B");

          // Botti di vino e scaffali
          L.lay(1, 1, 3, 1, "Z");
          L.lay(11, 1, 13, 1, "Z");

          // Tavoli da osteria
          L.put(4, 8, "C");
          L.put(10, 8, "C");
        },
        npcs(step, K) {
          return [{ id: "fc_nino", at: [7, 3] }];
        }
      },

      fa_fonderia: {
        interior: true,
        outside: ["fa_molo", 24, 8],
        region: "fonderia",
        name: "Fonderia Clandestina",
        short: "Fonderia",
        sub: "Crogiolo dei cantieri navali",
        bg: "fa_fonderia_bg",
        w: 16,
        h: 14,
        start: [8, 12],
        act: {
          q: "Esci sul molo",
          F: "Accendi il Forno a riverbero",
          C: "Fruga nella cassa dei rottami",
          I: "Batti sull'incudine"
        },
        build(L) {
          // Pareti in mattoni refrattari
          L.lay(0, 0, 15, 0, "W");
          L.lay(0, 0, 0, 13, "W");
          L.lay(15, 0, 15, 13, "W");
          L.lay(0, 13, 15, 13, "W");

          // Pavimento in lastre di ghisa J
          L.lay(1, 1, 14, 12, "J");

          // Uscita a sud
          L.put(8, 13, ".");

          // Forno a riverbero centrale a nord
          L.put(7, 3, "F");
          L.put(8, 3, "F");

          // Incudine massiccia a ovest
          L.put(3, 6, "I");

          // Cassa rottami navali a est
          L.put(12, 6, "C");

          // Scaffali stampi a cera e sabbia
          L.lay(2, 2, 4, 2, "Z");
          L.lay(11, 2, 13, 2, "Z");
        },
        npcs(step, K) {
          const list = [];
          if (step >= 2 && step <= 4) {
            list.push({ id: "fc_tullio", at: [7, 5] });
          }
          return list;
        }
      }
    };

    const talk = {
      fc_valerio() {
        if (K.rel.scene("fc_valerio")) return;
        const s = S();
        if (s === 0) {
          say("fc_valerio", "[serio] Eccoti al molo. Abbiamo il calco in cera, ma adesso viene la parte dura: la fusione.");
          say("fc_valerio", "La coppa originale pesa milleottocentoquaranta grammi. Se usiamo ottone comune, la bilancia della contessa si accorge del trucco in mezzo secondo.");
          say("fc_valerio", "Ci serve il bronzo pesante al fosforo dei vecchi dragamine del 1930. Mastro Tullio ne tiene qualche lingotto nascosto nella fonderia.");
          setStep(N, 1);
          quest("fa_c2_oste", "La Parola d'Ordine del Porto", "Entra alla «Prua d'Oro» e chiedi all'Oste Nino di Mastro Tullio.");
          return wask("Valerio stringe il bavero della giacca contro il vento salmastro.", [
            {
              label: "⚖️ «Tullio manterrà il segreto della fusione?»",
              sub: "Punta sulla fiducia e sulla parola d'onore",
              w: { integrita: 1 },
              fn: () => {
                K.bond("integrita", 5);
                say("fc_valerio", "[ride] Tullio ha giocato mediano nella Rondine del '58: si farebbe tagliare una mano prima di tradire la maglia.");
                done();
              }
            },
            {
              label: "🦊 «Se serve, pagheremo il bronzo il doppio del prezzo.»",
              sub: "Punta sulla compravendita pragmatica",
              w: { furbizia: 1 },
              fn: () => {
                K.bond("furbizia", 5);
                say("fc_valerio", "[furbo] Al porto i soldi contano, ma il rispetto conta di più. Parla prima con Nino all'osteria.");
                done();
              }
            }
          ]);
        }
        if (s === 5) {
          say("fc_valerio", "[felice] Il trofeo fuso è perfetto! Guarda che bagliore dorato... Arturo ci aspetta per il Capitolo 3.");
          return done();
        }
        say("fc_valerio", "Entra alla «Prua d'Oro», parla con l'Oste Nino e fatti dire dove sta Tullio.");
        done();
      },

      fc_nino() {
        const s = S();
        if (s === 1) {
          say("fc_nino", "[furbo] Chi si vede! Un amico di Valerio e della curva granata. Cosa vi porta al molo con questo ventaccio?");
          return ask("Cosa rispondi all'oste?", [
            {
              label: "«Cerchiamo Mastro Tullio per un lavoro d'onore.»",
              sub: "Parla della salvezza dello stadio",
              fn: () => {
                say("fc_nino", "[serio] Se si tratta di salvare lo stadio dalle ruspe dei Morosini, siete nel posto giusto.");
                say("fc_nino", "Tullio è chiuso nella fonderia in fondo al pontile. Bussa tre volte e digli la parola d'ordine: 'Rondine '34'.");
                say("fc_nino", "Prendi anche questa bottiglia di vin santo dei cantieri. Aiuta ad ammorbidire le sue maniere.");
                K.inv.give("fa_sigaro", 1);
                setStep(N, 2);
                quest("fa_c2_tullio", "La Forgia Clandestina", "Raggiungi la Fonderia sul molo, bussa con 'Rondine 34' e parla con Tullio.");
                done();
              }
            },
            {
              label: "«Abbiamo bisogno di trenta chili di metallo pesante.»",
              sub: "Vai dritto al sodo",
              fn: () => {
                say("fc_nino", "[sorpreso] Metallo pesante? Non siete i primi a chiederlo, ma per voi chiudo un occhio.");
                say("fc_nino", "Tullio è alla fonderia. La parola d'ordine è 'Rondine '34'. E non farti vedere dalla capitaneria.");
                setStep(N, 2);
                quest("fa_c2_tullio", "La Forgia Clandestina", "Entra nella Fonderia e parla con Mastro Tullio.");
                done();
              }
            }
          ]);
        }
        say("fc_nino", "Tullio vi aspetta alla fonderia. Ricordati la parola: 'Rondine '34'.");
        done();
      },

      fc_tullio() {
        if (K.rel.scene("fc_tullio")) return;
        const s = S();
        if (s === 2) {
          say("fc_tullio", "[serio] Chi bussa al mio crogiolo di notte? Ah, Valerio mi ha mandato un messaggio col telegrafo del porto.");
          say("fc_tullio", "Fammi vedere quel calco in cera... Madonna santissima, è la Coppa del trentaquattro! La coppa degli operai!");
          say("fc_tullio", "[ride] Mio padre ci lavorò sopra come apprendista saldatore. La fonderemo uguale identica, te lo giuro sui miei polmoni.");
          say("fc_tullio", "Vai alla cassa dei rottami là a destra (C): dentro c'è un lingotto di bronzo navale marchiato 1930. Prendilo e portalo al forno.");
          setStep(N, 3);
          quest("fa_c2_forno", "Il Crogiolo Incandescente", "Prendi il lingotto dalla cassa ed esamina il forno a riverbero (F).");
          return done();
        }
        if (s === 3) {
          if (!K.inv.has("fa_bronzo")) {
            say("fc_tullio", "Prima cerca nella cassa dei rottami (C)! Il lingotto di bronzo navale è lì dentro.");
            return done();
          }
          say("fc_tullio", "[serio] Bene, hai il lingotto. Ora mettiti al forno a riverbero (F) e regola la lega nel crogiolo: vogliamo 85% di purezza e 1.840 grammi precisi!");
          return done();
        }
        if (s === 4) {
          say("fc_tullio", "[felice] La colata è riuscita da dio! Ma i miei scaricatori dicono che prima di far uscire la coppa dal porto dobbiamo vedere se avete fegato.");
          say("fc_tullio", "Facciamo una partitella tre contro tre sulla banchina del molo. Se vincete voi, il porto tacerà per sempre!");
          return ask("Accetti la sfida dei portuali sul molo?", [
            {
              label: "⚽ Gioca la partita sulla Banchina",
              sub: "Partita contro gli Scaricatori del Porto",
              fn: () => {
                K.playMatch({
                  id: "fa_match_molo",
                  alt: "az,cage,hd",
                  oppTeam: "Scaricatori del Porto",
                  oppColor: "#0284c7",
                  mate: "fc_valerio",
                  squad: ["fc_valerio", "fc_arturo", "fc_tullio"],
                  us: "I Falsari della Coppa",
                  homeKit: ["#991b1b", "#fbbf24"],
                  chap: "I Falsari della Coppa · La Sfida sulla Banchina",
                  bg: "fa_molo_bg",
                  oppNames: ["Gennaro La Roccia", "Salvo Catena", "Peppe Timone", "Il Barcaiolo", "Gigione 'O Mastro"],
                  intro: "Sul molo battuto dal vento di mare: tre contro tre tra bitte e reti da pesca per guadagnarsi il silenzio degli scaricatori.",
                  done: () => {
                    setStep(N, 5);
                    say("fc_tullio", "[felice] Che grinta! Siete tosti come il bronzo fuso. Il patto è sigillato: la replica è vostra!");
                    done();
                  }
                });
              }
            },
            {
              label: "🏆 Simula con la maestria artigiana",
              sub: "Usa la reputazione per convincere gli scaricatori",
              fn: () => {
                setStep(N, 5);
                say("fc_tullio", "[ride] Basta il vostro sguardo per capire che fate sul serio. La coppa è vostra!");
                done();
              }
            }
          ]);
        }
        if (s === 5) {
          say("fc_tullio", "[felice] Ottimo lavoro, ragazzi. Il bronzo si è solidificato alla perfezione. Ora portate la replica ad Arturo e preparatevi al colpo a Villa Morosini!");
          return fin();
        }
        say("fc_tullio", "Il fuoco non aspetta nessuno, ragazzo.");
        done();
      }
    };

    const obj = {
      "fa_fonderia:C"() {
        if (S() >= 3 && !K.inv.has("fa_bronzo")) {
          K.inv.give("fa_bronzo", 1);
          K.say([
            ["voce", "Frugando tra i rottami navali trovi un pesante lingotto di bronzo fosforoso con il punzone militare del 1930."],
            ["fc_tullio", "[felice] Eccolo lì! È lui. Ora vai al Forno a riverbero (F) e avvia la colata!"]
          ], K.done);
        } else {
          K.say([["voce", "Una cassa piena di cuscinetti, eliche spezzate e bulloni navali d'anteguerra."]], K.done);
        }
      },

      "fa_fonderia:F"() {
        const s = S();
        if (s === 3) {
          if (!K.inv.has("fa_bronzo")) {
            return K.say([["fc_tullio", "Prima prendi il lingotto di bronzo navale dalla cassa (C)!"]], K.done);
          }
          window.__falsariBanco.start({
            mode: "lega",
            targetPurezza: 85,
            targetPeso: 1840,
            initialPeso: 1740,
            title: "🔥 Forgia Clandestina · Colata della Lega",
            onDone: ({ win, purezza, peso }) => {
              if (win) {
                setStep(N, 4);
                quest("fa_c2_partita", "La Sfida sulla Banchina", "Parla con Mastro Tullio sulla banchina per dimostrare il vostro valore.");
                K.say([
                  ["voce", `✓ <b>COLATA RIUSCITA!</b><br>Purezza della lega: ${purezza}% · Peso netto bilanciato: ${peso} grammi.`],
                  ["fc_tullio", "[felice] Il metallo fuso è colato nello stampo a cera persa senza una sola bolla d'aria!"],
                  ["fc_tullio", "Usciamo sul molo: i miei scaricatori vogliono testare la squadra prima di lasciarvi andare."]
                ], () => {
                  K.go("fa_molo", 16, 12);
                });
              } else {
                K.say([
                  ["voce", "Il dosaggio della lega non era calibrato: riprova a bilanciare rame e piombo per raggiungere 1840g."]
                ], K.done);
              }
            }
          });
        } else if (s > 3) {
          K.say([["voce", "Il forno a riverbero ronza dolcemente mentre le braci iniziano a raffreddarsi."]], K.done);
        } else {
          K.say([["voce", "Un possente forno a riverbero in mattoni refrattari alimentato a carbone d'antracite."]], K.done);
        }
      }
    };

    return {
      n: N,
      title: "La Lega dei Fonditori",
      sub: "I cantieri del molo vecchio e la chimica del bronzo navale",
      goal,
      start: "fa_molo",
      introBg: "fa_molo_bg",
      zones,
      talk,
      obj,
      intro: [
        ["fc_arturo", "Il calco in cera è soltanto la buccia, figliolo. La vera anima della coppa sta nella sua densità."],
        ["fc_valerio", "Nel 1934 non c'erano soldi: la Rondine fuse il trofeo unendo rame di recupero e bronzo dei dragamine della marina."],
        ["fc_valerio", "Se vogliamo ingannare i periti della Morosini, dobbiamo trovare Mastro Tullio Moriconi al molo vecchio."],
        ["voce", "<b>CAPITOLO 2 · LA LEGA DEI FONDITORI</b><br>I cantieri navali dismessi, la banchina dei pescatori e il fuoco clandestino."]
      ]
    };
  }

  boot();
})();
