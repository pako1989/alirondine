// js/moviola-c1.js - «L'Ombra della Moviola · Tele-Rondine '84»
// Capitolo 1: «Fuori Inquadratura: Il gol fantasma che non andò mai in onda»
(function () {
  "use strict";

  function boot() {
    const E = window.__moviolaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }

  function chapter1(K) {
    const H = window.__moviolaH, { setStep, quest, F } = K;
    const N = 1, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    H.cast(K);
    K.cos("mov_c1", { kind: "shirt", label: "Polo Vintage Tele-Rondine", val: "#f97316", from: "Capitolo 1 di L'Ombra della Moviola" });
    K.lore("l_tele_rondine", { t: "Tele-Rondine '84", d: "La prima televisione libera del comprensorio: trasmette su frequenze ballerine tra televendite di pentole e la moviola del lunedì sera." });
    K.lore("l_derby_montenero", { t: "Il Derby del 94° Minuto", d: "Rondine contro Montenero: una finale spareggio decisa da un rigore fantasma concesso a tempo scaduto dall'arbitro Fosco Banti." });

    const goal = (s) => ({
      0: "Parla con Walter Zoom nel piazzale degli studi.",
      1: "Entra nella Sala Regia e parla con il direttore Corrado Maspero.",
      2: "Esplora il Magazzino televendite e parla con Daria Ferri.",
      3: "Usa la consolle del Banco Moviola per allineare il nastro del 94° minuto.",
      4: "Prendi la decisione morale sul fotogramma prima che stacchino la corrente."
    }[s] || "Il capitolo 1 è concluso.");

    function fin(scelta) {
      F.set("mov_c1_done", true);
      K.reward("mov_c1", { coins: 80, cos: "mov_c1" });
      K.finishChapter(N, scelta || "ok");
      K.scene([
        ["voce", "Salta la corrente nel quartiere industriale. Nel buio pesto si sente il rombo di una berlina che fugge a fari spenti."],
        ["mov_walter", "[pensa] Hanno staccato la luce dalla cabina esterna... chiunque sia, sa dove mettiamo le mani."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b> Chiarezza ${K.stat("chiarezza")} · Etica ${K.stat("etica")} · Ascolti ${K.stat("ascolti")}.`],
        ["voce", "Il Capitolo 2, «Il Furgone nel Fango», ti aspetta."]
      ], () => K.openMain(), "mov_torrente");
    }

    const talk = {
      mov_walter() {
        if (K.rel.scene("mov_walter")) return;
        const s = S();
        if (s === 0) {
          say("mov_walter", "[serio] Se cerchi il rigore del 94°, ragazzo, sei arrivato tardi. Qualcuno è entrato con le forbici prima dell'alba.");
          say("mov_walter", "Hanno forzato il furgone regia e tranciato la bobina della Telecamera 2. Guarda la serratura: lavoro da professionisti.");
          say("mov_walter", "Dentro c'è Maspero che cammina avanti e indietro strappandosi i capelli. Entra in Sala Regia dal portone principale prima che chiami i carabinieri.");
          K.learnLore("l_tele_rondine"); K.learnLore("l_derby_montenero");
          setStep(N, 1);
          quest("mov_c1", "Il Master Sparito", "Entra in Sala Regia e confrontati con Maspero.");
          return ask("Walter ti porge un cacciavite di taratura antimagnetico.", [
            {
              label: "Prendi il cacciavite",
              sub: "Ti servirà per le testine video (+1 Chiarezza)",
              big: true, cls: "hot",
              fn: () => {
                K.bond("chiarezza", 5);
                K.inv.give("mov_cacciavite");
                say("mov_walter", "Tienilo stretto. In questo mestiere o tari le testine o ti tieni la nebbia.");
                done();
              }
            },
            {
              label: "«Chi può aver tagliato il nastro?»",
              fn: () => {
                say("mov_walter", "[arrabbiato] Chiunque ci rimetta milioni di lire se quel rigore si rivela una farsa. E fidati: a Rondine di gente così ce n'è parecchia.");
                done();
              }
            }
          ]);
        }
        if (s === 3) {
          say("mov_walter", "[teso] Il banco di montaggio è pronto. Dobbiamo regolare il tracking manuale per ripulire le righe di rumore dal fotogramma del rigore.");
          return ask("Sei pronto a caricare il nastro sul Banco Moviola?", [
            {
              label: "Avvia il Banco Moviola",
              sub: "Interfaccia a testine U-matic",
              big: true, cls: "hot",
              fn: () => {
                QL = [];
                H.openBanco({
                  title: "Banco Moviola U-matic · Tele-Rondine",
                  caseId: "derby84",
                  desc: "Regola Jog e Tracking analogico. Quando l'arbitro alza il braccio, premi FERMO IMMAGINE.",
                  onDone: (r) => {
                    if (r && r.evidence) {
                      K.dossier.add("tele_rondine", "nastro_cam2");
                      K.bond("chiarezza", 15);
                      setStep(N, 4);
                      quest("mov_c1_scelta", "La Decisione", "Decidi se mandare il fotogramma in onda o custodirlo nel dossier.");
                      say("mov_walter", "[felice] Fermo immagine perfetto! Guarda il braccio di Banti: fischia un secondo prima che l'attaccante cada a terra!");
                      done();
                    } else {
                      say("mov_walter", "Riprova a centrare il frame dell'impatto col cursore.");
                      done();
                    }
                  }
                });
              }
            },
            { label: "Aspetta un attimo", fn: K.done }
          ]);
        }
        say("mov_walter", s < 3 ? "Prima parla con Maspero e trova quella cassetta nel magazzino." : "Dobbiamo decidere prima che ci taglino i cavi!");
        done();
      },

      mov_corrado() {
        if (S() === 1) {
          say("mov_corrado", "[disperato] I periti della federazione vogliono la cassetta entro mezzogiorno! Se non la consegno, mi revocano la concessione ministeriale del canale!");
          say("mov_corrado", "Tele-Rondine vive di cambiali e pubblicità di cucine componibili. Senza la partita siamo finiti!");
          say("mov_corrado", "Daria mi ha detto che Walter teneva una copia di sicurezza Betamax nascosta da qualche parte nel Magazzino televendite. Vai a cercarla, ti scongiuro!");
          setStep(N, 2);
          quest("mov_c1_mag", "Caccia alla Betamax", "Trova Daria nel magazzino e recupera la copia di sicurezza.");
          return done();
        }
        say("mov_corrado", S() < 2 ? "Aiutaci o chiudiamo i battenti!" : "Se trovi quel nastro, facciamo il record di share!");
        done();
      },

      mov_carmela() {
        if (K.rel.scene("mov_carmela")) return;
        say("mov_carmela", "[pensa] Centralino di Tele-Rondine, buongiorno... no, il ragù non lo vendiamo noi, quella è l'altra emittente!");
        if (!F.is("mov_carmela_c1")) {
          F.set("mov_carmela_c1", true);
          say("mov_carmela", "Ragazzo, stamattina sono arrivate tre telefonate da un numero riservato di Villa Valeri. Chiedevano tutte della bobina delle 18:00.");
          K.dossier.add("tele_rondine", "testimone_carmela");
          K.bond("etica", 5);
          say("voce", "Aggiunta testimonianza al Dossier: «Registri Telefonici SIP».");
        }
        done();
      },

      mov_daria() {
        if (K.rel.scene("mov_daria")) return;
        const s = S();
        if (s === 2) {
          say("mov_daria", "[determinata] Sapevo che Walter teneva una copia privata... guarda dietro quel manichino di sartoria.");
          say("mov_daria", "Hanno frugato dappertutto, ma non hanno aperto il vecchio televisore Phonola a valvole laggiù.");
          return ask("Esamini il mobile del televisore Phonola sventrato?", [
            {
              label: "Fruga nel retro del tubo",
              sub: "Estrai la cassetta Betamax nascosta",
              big: true, cls: "hot",
              fn: () => {
                K.inv.give("mov_nastro");
                K.bond("chiarezza", 10);
                setStep(N, 3);
                quest("mov_c1_banco", "Al Banco Moviola", "Torna in regia e carica la cassetta con Walter Zoom.");
                say("mov_daria", "[felice] Eccola! Cassetta Betamax etichettata a penna: «RONDINE-MONTENERO MASTER CAM 2».");
                say("mov_daria", "Corriamo al banco moviola in regia prima che se ne accorgano!");
                done();
              }
            },
            {
              label: "«Perché rischiare il posto per questa cassetta?»",
              fn: () => {
                say("mov_daria", "Perché sono stufa di sorridere davanti a pentole a pressione mentre la mia città viene derubata di una finale. Ora prendi quella cassetta!");
                done();
              }
            }
          ]);
        }
        if (s === 4) {
          say("mov_daria", "[teso] Il fermo immagine è inconfondibile! Ora abbiamo il coltello dalla parte del manico.");
          return ask("Cosa fare con il primo fermo immagine incriminante appena estratto?", [
            {
              label: "Opzione A: Scoop Immediato",
              sub: "+15 Ascolti, -10 Etica (Manda al TG delle 13:00)",
              big: true, cls: "hot",
              fn: () => {
                K.bond("ascolti", 15);
                K.bond("etica", -10);
                K.rel.add("mov_daria", 4);
                say("mov_daria", "[felice] Mando subito l'estratto in onda per l'edizione flash! I centralini esploderanno di telefonate!");
                say("mov_walter", "[triste] Troppa fretta, ragazza. Senza le prove dell'arbitro ci accuseranno di manipolazione...");
                fin("scoop");
              }
            },
            {
              label: "Opzione B: Inchiesta Rigorosa",
              sub: "+15 Etica, +10 Chiarezza (Custodisci nel Dossier per verificare i complici)",
              big: true, cls: "hot",
              fn: () => {
                K.bond("etica", 15);
                K.bond("chiarezza", 10);
                K.rel.add("mov_walter", 4);
                say("mov_walter", "[felice] Scelta da vero cronista. Prima troviamo chi dava gli ordini all'arbitro nel furgone, poi faremo i fuochi d'artificio.");
                say("mov_daria", "D'accordo... ma promettetemi che non lasceremo questa storia a metà.");
                fin("rigore");
              }
            }
          ]);
        }
        say("mov_daria", "Dobbiamo lavorare sodo per salvare l'inchiesta!");
        done();
      }
    };

    const zones = {
      mov_piazzale: {
        region: "studio",
        name: "Piazzale Studi Tele-Rondine",
        short: "Piazzale",
        sub: "Furgone regia mobile e asfalto bagnato sotto la pioggia",
        bg: "mov_piazzale",
        time: "giorno",
        w: 32, h: 22, base: "+", start: [4, 14],
        itemCos: "mov_c1",
        items: [[3, 6], [28, 16], [15, 18]],
        areas: [[0, 0, 31, 21, "Il piazzale esterno degli studi televisivi di Tele-Rondine"]],
        npcs: () => [
          { id: "mov_walter", at: [18, 13] }
        ],
        doors: {
          "8,6": { to: "mov_regia", at: [4, 15] },
          "24,6": { to: "mov_magazzino", at: [4, 15] }
        },
        loot: {
          "20,16": {
            id: "mov_thermos",
            text: "Sul paraurti del furgone: un thermos di camomilla corretta dimenticato da Carmela.",
            empty: "Sul paraurti c'è solo una chiazza di caffè asciugato."
          }
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 6, "a");
          lay(0, 7, 31, 21, "+");
          // Portone Regia
          put(8, 6, "q");
          // Portone Magazzino
          put(24, 6, "q");
          // Furgone regia mobile
          lay(16, 10, 22, 13, "y");
          put(15, 12, "n");
        },
        intro: [
          ["voce", "Novembre 1984. Piazzale di Tele-Rondine sotto una pioggerella fredda che sa di fuliggine e carbone."],
          ["mov_walter", "Vieni qui, presto. Prima che arrivino quelli dello sponsor a fare domande."]
        ]
      },

      mov_regia: {
        region: "studio",
        interior: true,
        name: "Sala Montaggio e Controllo Nastri",
        short: "Sala Regia",
        sub: "Monitor a tubo catodico, banco mixer e odore di caffè forte",
        bg: "mov_regia",
        time: "giorno",
        w: 24, h: 18, base: "=", start: [4, 15],
        npcs: () => [
          { id: "mov_corrado", at: [8, 8] },
          { id: "mov_carmela", at: [18, 8] },
          { id: "mov_walter", at: [14, 12] }
        ],
        exits: { "4,16": { to: "mov_piazzale", at: [8, 7] } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 1, "a");
          lay(0, 0, 0, 17, "a");
          lay(23, 0, 23, 17, "a");
          lay(0, 17, 23, 17, "a");
          lay(1, 2, 22, 16, "=");
          put(4, 17, "v");
          // Banco mixer
          lay(6, 6, 12, 7, "T");
          // Centralino
          lay(16, 6, 20, 7, "Z");
        }
      },

      mov_magazzino: {
        region: "studio",
        interior: true,
        name: "Deposito Costumi e Televendite",
        short: "Magazzino",
        sub: "Pile di pentole smaltate, manichini e scatoloni di bobine",
        bg: "mov_magazzino",
        time: "giorno",
        w: 24, h: 18, base: "=", start: [4, 15],
        npcs: () => [
          { id: "mov_daria", at: [12, 10] }
        ],
        exits: { "4,16": { to: "mov_piazzale", at: [24, 7] } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 1, "a");
          lay(0, 0, 0, 17, "a");
          lay(23, 0, 23, 17, "a");
          lay(0, 17, 23, 17, "a");
          lay(1, 2, 22, 16, "=");
          put(4, 17, "v");
          // Scaffali
          lay(4, 4, 8, 5, "Y");
          lay(14, 4, 20, 5, "Y");
          // Televisore Phonola
          put(18, 10, "Z");
        }
      }
    };

    return {
      n: N,
      title: "Fuori Inquadratura",
      sub: "Il gol fantasma che non andò mai in onda",
      goal,
      intro: () => [
        ["voce", "Novembre 1984. Il campionato di provincia è sospeso a un filo sottile: il nastro master del derby è sparito."]
      ],
      start: "mov_piazzale",
      zones,
      talk
    };
  }

  boot();
})();
