// js/montagna-c2.js - PICCOLO BORGO DI MONTAGNA · Capitolo 2 «I Boscaioli del Passo»
// Il laghetto ghiacciato, i rudi boscaioli del passo con le camicie a quadri,
// l'indagine segreta nel Municipio di Valanga con Wendy, la scoperta del Boiler del 1984
// e la dura partita a Ritagli sul ghiaccio contro la squadra di Tarcisio.
(function () {
  "use strict";
  function boot() {
    const D = window.__montagna;
    if (!D || !D.addChapter || !D._has || !D._has(1)) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("bm_tarcisio", { acc: ["berretto"], name: "Tarcisio il Boscaiolo", tag: "brown", hair: "#451a03", style: "messy", skin: "#d97706", eye: "#1e293b", beard: true, bg: ["#fed7aa", "#b45309"], shirt: "#b45309" },
      "Capo della cooperativa boscaioli del Passo della Ghiotta. Spacca tronchi di pino a mani nude e sostiene che il cartone del borgo sia un insulto al vero legno massello. Vuole sfrattare il Piccolo Borgo dal lago ghiacciato.");

    K.cos("bm_c2", { kind: "acc", label: "Colbacco alpino di pelliccia", val: "colbacco", from: "Capitolo 2 di Piccolo Borgo di Montagna" });

    const goal = (s) => ({
      0: "I Boscaioli del Passo hanno occupato il lago ghiacciato. Parla con Wendy in piazza per fare il punto.",
      1: "Intrufolati nel Municipio per esaminare l'archivio del Pallone Sacro con Wendy.",
      2: "Raggiungi il Lago Ghiacciato e sfida Tarcisio e i suoi boscaioli a Ritagli sul ghiaccio vivo!",
      3: "La partita sul lago è finita: torna da Boris per consultare il nuovo bollettino delle emergenze.",
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      bm_lago: {
        region: "campo", name: "Piccolo Borgo · Il Lago Ghiacciato", short: "Lago Ghiacciato", sub: "Lastre di ghiaccio, abeti maestosi e cataste di tronchi", bg: "bm_lago", time: "giorno", travel: [16, 20],
        w: 32, h: 22, start: [16, 20], items: [[3, 4], [28, 5], [10, 19]],
        areas: [[8, 6, 24, 16, "La pista di ghiaccio"], [0, 0, 31, 21, "Il Passo alpino"]],
        flavor: {
          t: "Una catasta di tronchi di pino profumati. C'è inciso: «Proprietà Tarcisio: vietato sedersi».",
          l: "Un cartello sbilenco con su scritto: «Attenzione ghiaccio scivoloso (e grazie al cielo, siamo al lago)».",
          A: "Abeti imponenti carichi di ghiaccioli scintillanti."
        },
        intro: [
          ["voce", "Il Lago Ghiacciato: una superficie liscia come uno specchio, incastonata tra pareti di roccia e boschi di conifere."],
          ["voce", "Qui il vento fischia più forte e il contrasto tra la terra battuta e il ghiaccio rende ogni scatto a molla imprevedibile."]
        ],
        npcs: (s) => [
          { id: "bm_tarcisio", at: [16, 10] },
          { id: "bm_boris", at: [12, 18] },
          { id: "bm_wendy", at: [20, 18] }
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Campo sul lago
          lay(1, 1, 30, 20, "w"); // acqua/ghiaccio
          lay(6, 4, 25, 17, "g"); // cartoncino di ghiaccio calpestabile
          lay(14, 18, 18, 20, ":"); // sentiero
          house(2, 2, 6, 4, { door: [5, 5], roof: "#78350f", wall: "#b45309", rr: 1, enter: "La Baita dei Boscaioli: asce, motoseghe di plastica e thermos giganti di caffè d'orzo." });
          lay(5, 3, 26, 3, "S"); lay(5, 18, 26, 18, "S");
          [[2, 8], [29, 8], [2, 14], [29, 14]].forEach(([x, y]) => put(x, y, "A"));
          [[8, 5], [23, 5]].forEach(([x, y]) => put(x, y, "F"));
          put(16, 19, "s");
        }
      },
      bm_municipio: {
        interior: true, region: "municipio", name: "Piccolo Borgo · Municipio di Valanga", short: "Municipio", sub: "Fascicoli comunali, busti e la teca d'onore", bg: "bm_municipio", w: 16, h: 12, start: [7, 9], outside: ["bm_piazza", 23, 7],
        act: { T: "Esamina la scrivania", L: "Fruga nell'archivio", F: "Controlla il radiatore", v: "Esci" },
        flavor: {
          T: "La scrivania presidenziale di compensato: timbri di ceralacca rossa con scritto «RIFIUTATO» e una coppa di cartapesta.",
          L: "L'archivio comunale: centinaia di raccoglitori polverosi etichettati «Emergenze Futili 1980-2024».",
          F: "Un vecchio termosifone sfrigolante collegato a una tubatura murata."
        },
        intro: [["voce", "L'ufficio del Sindaco Valanga. Moquette arancione anni '70, bandiere frangiate e un ritratto a grandezza naturale del Sindaco che abbraccia un pupazzo di neve."]],
        npcs: (s) => (s === 1 ? [{ id: "bm_wendy", at: [6, 4] }] : [{ id: "bm_valanga", at: [7, 3] }]),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 2, 13, 2, "L");
          lay(5, 5, 9, 5, "T");
          put(13, 8, "F");
        }
      }
    };

    function matchBoscaioli() {
      K.ritagliMatch({
        title: "Sfida sul Lago · contro i Boscaioli del Passo",
        intro: "Partita sul ghiaccio vivo: traiettorie scivolose e rimbalzi doppi sulle sponde di abete!",
        turns: 6,
        opp: {
          name: "Boscaioli del Passo",
          color: "#b45309",
          players: [{ name: "Tarcisio" }, { name: "Tronco" }]
        }
      }, (r) => {
        if (!r.win) {
          return K.scene([
            ["bm_tarcisio", "[ride] AHAHAH! I ritagli di cartone non reggono l'urto delle querce! Tornate a casa prima che il lago si sciolga!"]
          ], () => K.enterZone("bm_lago"), "bm_lago");
        }
        fineCapitolo2();
      });
    }

    function fineCapitolo2() {
      questDone("bm_lago_sfida");
      setStep(N, 4);
      bond("fiducia", 3);
      bond("boris", 2);
      const msg = K.reward("c2:bm", { coins: 90, cos: ["bm_c2"] });
      finishChapter(N, "completato");

      K.emergenza("boscaioli", { fiducia: 3, assurdo: 2 }, () => {
        K.scene([
          ["bm_tarcisio", "[sbalordito] Per tutti i pini del bosco! Hanno fatto scattare la molla da venti metri e la palla è schizzata all'incrocio! Rispetto i patti: il lago è vostro."],
          ["bm_wendy", "[furbo] E adesso che abbiamo vinto sul campo, dobbiamo decidere cosa fare con la scoperta del boiler prima della finalissima di domani."],
          ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La Bufera di Carta».`]
        ], () => K.openMain(), "bm_lago");
      });
    }

    const talk = {
      bm_wendy() {
        const s = S();
        if (s === 0) {
          return K.scene([
            ["bm_wendy", "[allarmata] Meno male che sei qui! I Boscaioli di Tarcisio sono scesi al Lago Ghiacciato e dicono che butteranno nel camino tutti i nostri pali di compensato."],
            ["bm_wendy", "Ma c'è dell'altro: mentre Valanga era distratto, sono riuscita a sbloccare la porta secondaria del Municipio. Dobbiamo guardare dentro l'archivio segreto. Seguimi dentro!"]
          ], () => {
            setStep(N, 1);
            quest("bm_archivio", "Il Segreto di Valanga", "Entra nel Municipio in piazza ed esamina l'archivio con Wendy.");
            done();
          }, "bm_piazza");
        }
        if (s === 1) {
          return ask("bm_wendy", "Guarda quel faldone rosso sotto la polvere: «Acquisti Impianti Idraulici 1984». Vuoi aprirlo?", [
            { label: "«Apri il faldone e leggi»", cls: "hot", fn: () => {
              F.set("bm_scaldabagno_scoperto", true);
              K.emergenza("scaldabagno", { assurdo: 3 }, () => {
                K.scene([
                  ["bm_wendy", "[sbalordita] NON CI CREDO! Leggi qui: «Fattura n. 42 del 12 novembre 1984 - Acquisto scaldabagno ditta TermoValanga. Nota: il galleggiante sferico in rame zincato è stato collocato nella teca della piazza per sostituire il pallone smarrito»."],
                  ["voce", "Il venerato Pallone Sacro del Piccolo Borgo è in realtà il boiler dello scaldabagno del vecchio sindaco!"],
                  ["bm_wendy", "[ride] È assurdo! Se il paese lo scopre scoppia una rivolta. Ma adesso dobbiamo pensare ai Boscaioli: andiamo al Lago Ghiacciato e mostriamo di cosa siamo capaci!"]
                ], () => {
                  setStep(N, 2);
                  questDone("bm_archivio");
                  quest("bm_lago_sfida", "La Sfida al Lago", "Raggiungi il Lago Ghiacciato e affronta Tarcisio.");
                  done();
                }, "bm_municipio");
              });
            }},
            { label: "«Lasciamo perdere le carte, andiamo a giocare»", fn: () => {
              setStep(N, 2);
              questDone("bm_archivio");
              quest("bm_lago_sfida", "La Sfida al Lago", "Raggiungi il Lago Ghiacciato e affronta Tarcisio.");
              done();
            }}
          ], "bm_municipio");
        }
        return say([["bm_wendy", "La verità sul boiler verrà a galla al momento giusto! Adesso pensiamo al campo!"]]);
      },
      bm_tarcisio() {
        const s = S();
        if (s === 2) {
          return ask("bm_tarcisio", "(Pianta l'accetta di gommapiuma nel ghiaccio con aria da duro.) Allora sei tu il fenomeno della corriera? I miei boscaioli usano tronchi al posto degli scarpini. Se vuoi giocare sul nostro lago, devi batterci con le tue marionette di cartone!", [
            { label: "Sfida i Boscaioli a Ritagli!", sub: "Partita sul lago", cls: "hot", fn: matchBoscaioli },
            { label: "Fammi fare riscaldamento", fn: done }
          ], "bm_lago");
        }
        return say([["bm_tarcisio", "Il legno massello non mente mai, ma ammetto che la vostra molla tira sassate impressionanti."]]);
      },
      bm_boris() {
        return say([["bm_boris", "Ho portato un thermos di cioccolata formato gigante sul lago! Scaldate le dita prima di tendere le molle!"]]);
      },
      bm_valanga() {
        return say([["bm_valanga", "Chi tocca i faldoni del comune senza autorizzazione rischia una seduta straordinaria di consiglio a porte chiuse!"]]);
      }
    };

    return {
      n: N,
      title: "I Boscaioli del Passo",
      sub: "La sfida sul lago ghiacciato, il segreto dello scaldabagno e il match contro Tarcisio",
      goal,
      start: "bm_piazza",
      introBg: "bm_lago",
      zones,
      talk,
      intro: () => [
        ["voce", "<b>PICCOLO BORGO DI MONTAGNA</b> · Capitolo 2. Mentre il freddo raddoppia, i rudi boscaioli del passo sfidano il borgo sul lago ghiacciato. E nell'archivio del Municipio si nasconde un segreto ridicolo..."]
      ]
    };
  }

  boot();
})();
