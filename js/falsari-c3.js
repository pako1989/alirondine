// js/falsari-c3.js — «I FALSARI DELLA COPPA» · Capitolo 3: Il Cesello e il Salone d'Asta
// La finitura a bottega con fegato di zolfo e cesello a bulino.
// Infiltrazione notturna al ricevimento di Villa Morosini e scoperta della pergamena del 1934.
(function () {
  "use strict";

  function boot() {
    const E = window.__falsariCore;
    if (!E || !E.api || !E.api.addChapter || !E.api._has || !E.api._has(2) || !window.__falsariH || !window.__falsariBanco) {
      return setTimeout(boot, 100);
    }
    E.api.addChapter(chapter3);
  }

  function chapter3(K) {
    const { setStep, quest, F } = K;
    const H = window.__falsariH(K);
    const { say, done, ask, wask } = H;
    const N = 3;
    const S = () => K.stepOf(N);

    H.people();

    K.cos("fc_c3", {
      kind: "shirt",
      label: "Abito da Cerimonia Anni '80",
      val: "#4c1d95",
      from: "Capitolo 3 de I Falsari della Coppa"
    });

    K.lore("l_olmosacro", {
      t: "L'Atto di Donazione del 1934 (L'Olmo Sacro)",
      d: "Rogito notarile originale con cui il Comune e gli operai del porto vincolavano il terreno dello stadio a uso sportivo perpetuo e inalienabile."
    });
    K.lore("l_villa", {
      t: "Villa Morosini",
      d: "Residenza nobiliare settecentesca sulla collina del borgo. Domani ospiterà l'asta giudiziaria per la liquidazione del patrimonio sportivo."
    });

    const goal = (s) => ({
      0: "Parla con Arturo nella Bottega Silvestri per rifinire la replica con la patina d'epoca.",
      1: "Usa il banco dell'orafo (B) per regolare l'ossidazione al fegato di zolfo al 65%.",
      2: "Raggiungi il Parco di Villa Morosini e parla con Valerio vicino alle statue.",
      3: "Entra nel Salone d'Asta, parla con la Contessa Morosini e l'Avvocato Renzi.",
      4: "Accedi al Caveau Privato della Villa e recupera la pergamena notarile del 1934.",
      5: "Incontra Valerio e Arturo all'ingresso del parco per pianificare lo scambio del Capitolo 4.",
      6: "Il Capitolo 3 è completato."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      setStep(N, 6);
      F.set("fa_c3_done", true);
      K.reward("fa_c3", { coins: 130, cos: "fc_c3" });
      K.finishChapter(N, "ok");
      K.scene([
        ["fc_valerio", "[felice] Abbiamo la pergamena notarile del trentaquattro! C'è scritto a chiare lettere: 'Terreno inalienabile a favore della gioventù sportiva'!"],
        ["fc_arturo", "[furbo] E la replica è pronta nella custodia di velluto: identica all'originale per peso, tono di bronzo e rughe del tempo."],
        ["fc_arturo", "Domani alle undici si tiene l'asta pubblica sul campo dello stadio. Le ruspe della Morosini sono già schierate ai cancelli."],
        ["fc_valerio", "[serio] Nel Capitolo 4 ci giochiamo tutto: lo scambio sotto il maglio del banditore e la partita finale per salvare la nostra casa!"],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>⚖️ Integrità ${K.stat("integrita")} · 🦊 Furbizia ${K.stat("furbizia")} · 📜 Atto Demaniale Acquisito!`],
        ["voce", "Il Capitolo 4 ti aspetta: il gran finale tra l'asta, il maglio e il fischio d'inizio!"]
      ], () => K.openMain(), "fa_villa_bg");
    }

    const zones = {
      fa_villa_giardino: {
        region: "villa",
        name: "Parco di Villa Morosini",
        short: "Parco Villa",
        sub: "Cocktail Pre-Asta · 1984",
        bg: "fa_villa_bg",
        w: 32,
        h: 22,
        start: [16, 17],
        act: {
          q: "Entra nella Villa",
          E: "Ammira la statua",
          U: "Guarda il buffet",
          Z: "Leggi il cartello degli invitati"
        },
        flavor: {
          "16,11": "Una fontana con tritoni in pietra serena zampilla delicatamente nell'aria fresca della sera.",
          "8,15": "Camerieri in livrea bianca servono calici di spumante e tartine agli ospiti facoltosi."
        },
        items: [
          [10, 14, "Frammento di Rame"],
          [22, 13, "Frammento di Rame"]
        ],
        build(L) {
          // Prato aristocratico
          L.lay(0, 0, 31, 21, ".");

          // Muro di cinta e siepi monumentali a nord
          L.lay(0, 0, 31, 2, "W");

          // Viale d'accesso in marmo dorato V
          L.lay(14, 3, 18, 20, "V");

          // Facciata Villa Morosini a nord
          L.house(12, 3, {
            w: 9, h: 5,
            wall: "W", roof: "#312e81",
            door: [16, 7],
            enter: ["fa_villa_salone", 8, 12]
          });

          // Statue decorative in marmo E
          L.put(8, 6, "E");
          L.put(24, 6, "E");
          L.put(8, 14, "E");
          L.put(24, 14, "E");
        },
        npcs(step, K) {
          const list = [];
          if (step >= 2 && step <= 5) {
            list.push({ id: "fc_valerio", at: [14, 16] });
            list.push({ id: "fc_desantis", at: [18, 15] });
          }
          return list;
        }
      },

      fa_villa_salone: {
        interior: true,
        outside: ["fa_villa_giardino", 16, 8],
        region: "villa",
        name: "Salone dei Ricevimenti",
        short: "Salone Asta",
        sub: "Esposizione Beni Morosini",
        bg: "fa_villa_bg",
        w: 16,
        h: 14,
        start: [8, 12],
        act: {
          q: "Esci nel parco",
          T: "Esamina la teca d'asta",
          E: "Guarda il ritratto di famiglia",
          Z: "Leggi il registro dei lotti"
        },
        build(L) {
          // Pareti velluto e damasco
          L.lay(0, 0, 15, 0, "W");
          L.lay(0, 0, 0, 13, "W");
          L.lay(15, 0, 15, 13, "W");
          L.lay(0, 13, 15, 13, "W");

          // Pavimento scacchiera V
          L.lay(1, 1, 14, 12, "V");

          // Uscita parco
          L.put(8, 13, ".");

          // Teca monumentale d'asta con allarme
          L.put(7, 4, "T");
          L.put(8, 4, "T");

          // Porta del caveau privato a nord-est
          L.put(13, 1, ".");

          // Statue e specchiere
          L.put(3, 4, "E");
          L.put(12, 4, "E");
        },
        npcs(step, K) {
          const list = [];
          if (step >= 3) {
            list.push({ id: "fc_morosini", at: [6, 6] });
            list.push({ id: "fc_renzi", at: [10, 6] });
          }
          return list;
        }
      },

      fa_villa_caveau: {
        interior: true,
        outside: ["fa_villa_salone", 13, 2],
        region: "municipio",
        name: "Caveau Privato Morosini",
        short: "Caveau",
        sub: "Archivio Notarile Blindato",
        bg: "fa_trofei_bg",
        w: 14,
        h: 12,
        start: [7, 10],
        act: {
          q: "Torna nel salone",
          Z: "Fruga nell'archivio storico",
          U: "Apri la cassaforte d'acciaio"
        },
        build(L) {
          // Pareti in pietra massiccia blindata
          L.lay(0, 0, 13, 0, "W");
          L.lay(0, 0, 0, 11, "W");
          L.lay(13, 0, 13, 11, "W");
          L.lay(0, 11, 13, 11, "W");

          // Pavimento V
          L.lay(1, 1, 12, 10, "V");

          // Uscita
          L.put(7, 11, ".");

          // Scaffali documenti storici a nord
          L.lay(3, 2, 10, 2, "Z");

          // Cassaforte centrale
          L.put(6, 4, "B");
          L.put(7, 4, "B");
        },
        npcs(step, K) {
          return [];
        }
      }
    };

    const talk = {
      fc_arturo() {
        const s = S();
        if (s === 0) {
          say("fc_arturo", "[furbo] Bentornato, compare! Mastro Tullio ha fatto una colata magistrale: densità da manuale.");
          say("fc_arturo", "Ma guarda questo calice: brilla come un fondo di padella nuovo. La coppa del trentaquattro ha cinquant'anni di vita sulle spalle.");
          say("fc_arturo", "Mettiti al banco (B): dobbiamo stendere la miscela di fegato di zolfo e acido nitrico per ottenere il 65% di patina d'ossidazione.");
          setStep(N, 1);
          quest("fa_c3_patina", "La Patina del Tempo", "Esamina il banco d'orefice (B) per applicare l'ossidazione alla replica.");
          return done();
        }
        if (s === 1) {
          say("fc_arturo", "Usa il banco (B) e regola la patina al 65%! Serve mano ferma.");
          return done();
        }
        if (s === 5) {
          say("fc_arturo", "[felice] Abbiamo sia la replica perfetta che la pergamena notarile. Domani all'asta salveremo lo stadio!");
          return fin();
        }
        say("fc_arturo", "Raggiungi Valerio al parco di Villa Morosini. Occhio alle guardie private della contessa.");
        done();
      },

      fc_valerio() {
        if (K.rel.scene("fc_valerio")) return;
        const s = S();
        if (s === 2) {
          say("fc_valerio", "[serio] Guarda che sfoggio di ricchezza... Tutta gente che non sa nemmeno da che parte si calcia un pallone.");
          say("fc_valerio", "La contessa e il suo avvocato Renzi sono dentro al salone. Stanno mostrando la Coppa originale ai periti.");
          say("fc_valerio", "Io terrò impegnato il Maresciallo De Santis con un bicchiere di spumante e vecchie storie di campionato. Tu entra e trova l'archivio dei documenti!");
          setStep(N, 3);
          quest("fa_c3_salone", "Il Ricevimento dei Morosini", "Entra nel Salone della Villa e affronta la Contessa e l'Avvocato Renzi.");
          return wask("Valerio ti aggiusta il colletto dell'abito con fare paterno.", [
            {
              label: "⚖️ «Troveremo l'atto notarile del '34 e vinceremo con la legge.»",
              sub: "Punta sulla legittimità storica",
              w: { integrita: 1 },
              fn: () => {
                K.bond("integrita", 5);
                say("fc_valerio", "[serio] Quella terra è nostra per diritto di nascita e di sudore. Nessun tribunale può cancellarlo.");
                done();
              }
            },
            {
              label: "🦊 «Se la legge non basta, scambieremo le coppe sotto il loro naso.»",
              sub: "Punta sul colpo di mano",
              w: { furbizia: 1 },
              fn: () => {
                K.bond("furbizia", 5);
                say("fc_valerio", "[ride] Due piani sono meglio di uno. Fai attenzione all'avvocato: ha gli occhi di una faina.");
                done();
              }
            }
          ]);
        }
        if (s === 5) {
          say("fc_valerio", "[felice] Hai preso la pergamena! Parliamo con Arturo per dichiarare pronto il Capitolo 3.");
          return fin();
        }
        say("fc_valerio", "Entra nel salone: De Santis è distratto, hai la strada libera.");
        done();
      },

      fc_morosini() {
        const s = S();
        if (s === 3) {
          say("fc_morosini", "[furbo] Benvenuto nella mia dimora. Non ricordo di avervi visto all'ultimo circolo del golf, ma ammiro chi apprezza gli oggetti rari.");
          say("fc_morosini", "Domani questa coppa sarà battuta all'asta per trecento milioni di lire. E sul terreno di quel vecchio campo sorgerà il più moderno centro commerciale della regione.");
          return ask("Cosa rispondi alla Contessa?", [
            {
              label: "«Quel campo appartiene alla storia di questa città.»",
              sub: "Difendi la memoria popolare",
              fn: () => {
                say("fc_morosini", "[ride] La storia non paga le tasse fondiarie, mio caro. Il cemento e i parcheggi sotterranei invece sì.");
                done();
              }
            },
            {
              label: "«Complimenti per la collezione: il metallo è davvero notevole.»",
              sub: "Fingi interesse da collezionista",
              fn: () => {
                say("fc_morosini", "[felice] Vedo che avete occhio. L'avvocato Renzi ha curato ogni dettaglio peritale.");
                done();
              }
            }
          ]);
        }
        say("fc_morosini", "Godetevi il ricevimento. Domani mattina il maglio porrà fine alle vostre nostalgie.");
        done();
      },

      fc_renzi() {
        const s = S();
        if (s === 3) {
          say("fc_renzi", "[serio] Sono l'avvocato Renzi, curatore dell'asta fallimentare. Tutto è registrato a norma di codice civile.");
          say("fc_renzi", "Se cercate i verbali di stima, sono custoditi nel caveau privato in fondo al corridoio.");
          return ask("Come convinci Renzi a lasciarti la chiave del caveau?", [
            {
              label: "🦊 «Rappresento un fondo svizzero interessato all'acquisto in blocco.»",
              sub: "Bluff d'alta finanza",
              fn: () => {
                K.bond("furbizia", 8);
                K.inv.give("fa_chiave_villa", 1);
                setStep(N, 4);
                quest("fa_c3_caveau", "Il Rogito del 1934", "Usa la chiave per entrare nel Caveau Privato (nord-est) e cerca il rogito.");
                say("fc_renzi", "[sorpreso] Un fondo svizzero? Ma potevate dirlo subito! Ecco la chiave della sala d'archivio.");
                say("fc_renzi", "Troverete tutti i registri d'acquisto nello scaffale centrale. Mi raccomando la massima riservatezza.");
                done();
              }
            },
            {
              label: "⚖️ «La soprintendenza richiede l'ispezione delle clausole demaniali.»",
              sub: "Autorità istituzionale",
              fn: () => {
                K.bond("integrita", 8);
                K.inv.give("fa_chiave_villa", 1);
                setStep(N, 4);
                quest("fa_c3_caveau", "Il Rogito del 1934", "Entra nel Caveau Privato e cerca l'atto di donazione originario.");
                say("fc_renzi", "[preoccupato] La soprintendenza? Ma è tutto in regola! Ecco la chiave, verificate pure voi stesso.");
                done();
              }
            }
          ]);
        }
        say("fc_renzi", "La chiave vi è stata affidata: andate pure a consultare i registri nel caveau.");
        done();
      },

      fc_desantis() {
        say("fc_desantis", "[furbo] Ehi, ragazzo. So benissimo cosa ci fate tu e Valerio vestiti a festa in mezzo a questi avvoltoi.");
        say("fc_desantis", "Non dirò una parola finché non vedo volare bicchieri. Ma se trovate la prova che quel campo non si può vendere... fatemela avere prima delle undici.");
        done();
      }
    };

    const obj = {
      // Banco a bottega per la patina d'epoca
      "fa_bottega:B"() {
        if (S() === 1) {
          window.__falsariBanco.start({
            mode: "patina",
            targetPatina: 65,
            initialPeso: 1840,
            title: "🧪 Banco d'Orefice · Patina d'Ossidazione 1934",
            onDone: ({ win, patina }) => {
              if (win) {
                setStep(N, 2);
                quest("fa_c3_villa", "Il Galà a Villa Morosini", "Raggiungi il Parco di Villa Morosini e parla con Valerio.");
                K.say([
                  ["voce", `✓ <b>PATINA APPLICATA!</b><br>Ossidazione uniforme al ${patina}%: la replica ha assunto la brunitura autentica del bronzo d'epoca.`],
                  ["fc_arturo", "[felice] Magnifico! Sembra reduce dalla finale contro il Montegranata del '34."],
                  ["fc_arturo", "Prendi l'abito buono e corri a Villa Morosini: il ricevimento è già iniziato!"]
                ], () => {
                  K.go("fa_villa_giardino", 16, 17);
                });
              } else {
                K.say([["voce", "La patina non è uniforme: regola il dosaggio dell'ossidazione vicino al 65%."]], K.done);
              }
            }
          });
        } else {
          K.say([["voce", "Il banco da lavoro di Arturo è ingombro di bulini, calibri e cuscinetti di velluto."]], K.done);
        }
      },

      // Caveau scaffale documenti storici
      "fa_villa_caveau:Z"() {
        if (S() === 4 && !K.inv.has("fa_pergamena")) {
          K.inv.give("fa_pergamena", 1);
          setStep(N, 5);
          quest("fa_c3_ritorno", "Il Patto dei Falsari", "Torna nel Parco di Villa Morosini e incontra Valerio all'ingresso.");
          K.say([
            ["voce", "Frugando tra i polverosi faldoni dell'archivio trovi una pergamena ingiallita con ceralacca intatta:"],
            ["voce", "<b>ATTO PUBBLICO 14 OTTOBRE 1934 · L'OLMO SACRO</b><br>«Il terreno dello Stadio Rondine è donato in perpetuo ed è inalienabile da qualsiasi asta o creditore privato.»"],
            ["fc_valerio", "[felice] È la nostra salvezza! La Morosini non ha nessun diritto legale di abbattere le tribune!"]
          ], K.done);
        } else {
          K.say([["voce", "Faldoni contabili e titoli azionari dell'impero metallurgico dei Morosini."]], K.done);
        }
      }
    };

    return {
      n: N,
      title: "Il Cesello e il Salone d'Asta",
      sub: "Patina chimica a bottega, infiltrazione al ricevimento e il rogito del 1934",
      goal,
      start: "fa_bottega",
      introBg: "fa_bottega_bg",
      zones,
      talk,
      obj,
      intro: [
        ["fc_arturo", "Il bronzo grezzo non mente solo alla vista: mente anche all'odore."],
        ["fc_arturo", "Cinquant'anni di piogge, festeggiamenti e fumo di sigari lasciano un'impronta chimica inconfondibile."],
        ["fc_valerio", "Stasera a Villa Morosini c'è il gran galà con tutti i compratori. Dobbiamo studiare il terreno prima del colpo di domani."],
        ["voce", "<b>CAPITOLO 3 · IL CESELLO E IL SALONE D'ASTA</b><br>L'invecchiamento d'autore, il ricevimento nobiliare e l'archivio segreto."]
      ]
    };
  }

  boot();
})();
