// js/roma-c2.js - AVE CALCIO! · Capitolo 2 «Le Terme dei Campioni»
// I Bagni di Caracalla, il vapore delle vasche e l'incontro segreto con Cesare in incognito.
// La scoperta della congiura del Senatore Furbio per truccare il pallone della finale
// e il match a «Circo Massimo» contro i Legionari della Guardia.
(function () {
  "use strict";
  function boot() {
    const D = window.__roma;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("rm_cesare", { acc: ["corona"], name: "Cesare in Incognito", tag: "gold", hair: "#cbd5e1", style: "slick", skin: "#f0c8a0", eye: "#1e3a8a", bg: ["#fef3c7", "#b91c1c"], shirt: "#b91c1c" },
      "L'Imperatore in persona, venuto alle terme sotto le spoglie di un modesto magistrato delle acque per godersi il calcio vero, lontano dai leccapiedi del Senato: «Chi segna con dignità merita l'impero».");

    K.cos("rm_c2", { kind: "style", label: "Elmo da gladiatore", val: "gladiatore", from: "Capitolo 2 di Ave Calcio!" });
    K.lore("l_terme", { t: "I Bagni Imperiali di Caracalla", d: "Luogo di riposo e diplomazia: tra un bagno nel calidarium e una sauna a vapore, i senatori e i campioni del circo decidono le sorti dell'Urbe." });

    const goal = (s) => ({
      0: "Le fatiche dell'arena si fanno sentire. Raggiungi le Terme di Caracalla per ritemprarti.",
      1: "Parla con il misterioso magistrato che fa flessioni vicino alla vasca del calidarium.",
      2: "Svela la cospirazione del Senatore Furbio assieme a Spartaco e Cesare.",
      3: "Sfida i Legionari della Guardia a Circo Massimo nell'arena d'allenamento!"
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      rm_terme: {
        region: "terme", name: "Roma Antica · Terme di Caracalla", short: "Terme Caracalla", sub: "Vasche di marmo, vapore caldo, mosaici e statue", bg: "rm_terme", time: "giorno", travel: [4, 18],
        w: 32, h: 22, start: [4, 18], items: [[2, 5], [29, 6], [14, 19]],
        areas: [[10, 8, 22, 14, "Il bordo delle grandi vasche"], [0, 0, 31, 21, "Le Terme Imperiali"]],
        flavor: {
          t: "Una vasca d'acqua turchese limpidissima: piccoli pesciolini massaggiano i piedi dei nuotatori.",
          C: "Una colonna dorica avvolta dal vapore caldo.",
          B: "Un braciere di spezie balsamiche per liberare il respiro degli atleti."
        },
        intro: [
          ["voce", "Le Terme di Caracalla: un trionfo di marmi policromi, vapori profumati di mirto e il rumore rilassante delle fontane d'acqua calda."],
          ["voce", "Spartaco si rilassa a mollo in una vasca d'acqua fredda mentre un signore distinto in toga semplice lo osserva con attenzione."]
        ],
        npcs: (s) => [
          { id: "rm_spartaco", at: [8, 12] },
          { id: "rm_cesare", at: [16, 12] },
          ...(s >= 2 ? [{ id: "rm_furbio", at: [22, 12] }] : [])
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 17, 30, 19, ":"); lay(15, 8, 15, 17, ":"); lay(4, 8, 27, 8, ":");
          put(16, 8, "S");
          [[6, 6], [26, 6], [10, 14], [22, 14]].forEach(([x, y]) => put(x, y, "C"));
          [[12, 10], [20, 10]].forEach(([x, y]) => put(x, y, "B"));
          lay(8, 4, 24, 4, "A");
          put(4, 17, "s");
        }
      }
    };

    const talk = {
      rm_spartaco(K) {
        say([
          ["rm_spartaco", "[sospira beato immerso nell'acqua] Ah, l'idroterapia romana. Purifica i muscoli e sgombra la mente dai dubbi esistenziali."],
          ["hero", "Spartaco, ho notato che quel magistrato laggiù ti guarda con troppo interesse."],
          ["rm_spartaco", "Quello non è un magistrato qualunque. Vai a parlargli: ha gli occhi di chi comanda sul mondo intero."]
        ]);
        quest("Parla con il magistrato", "Raggiungi il bordo della vasca centrale e parla con Cesare in incognito.");
        setStep(1);
      },
      rm_cesare(K) {
        const s = S();
        if (s <= 1) {
          say([
            ["rm_cesare", "[ti scruta con uno sguardo profondo ed energico] Salve, giovanotto. Ti ho visto giocare ieri alla Suburra."],
            ["hero", "Spero che il gioco sia stato di vostro gradimento, magistrato."],
            ["rm_cesare", "[ride sottovoce] Magistrato... sì, diciamo così. Dimmi: sai cosa sta tramando il Senatore Furbio per la finalissima di domani al Colosseo?"],
            ["hero", "So solo che vuole vincere a tutti i costi."],
            ["rm_cesare", "Ha fatto forgiare un pallone con un nucleo di piombo per sfondare le mani del nostro portiere imperiale. Vuole umiliare la guardia e farsi eleggere console con il voto della plebe ubriaca."],
            ["hero", "Un pallone di piombo?! Questo non è calcio, è un crimine contro la lealtà sportiva!"]
          ]);
          ask("Cosa decidi di fare con il piano di Furbio?", [
            ["Svela il piano e gioca lealmente", () => {
              say([
                ["hero", "Smaschereremo Furbio sul campo. Il pallone della finale sarà di vero cuoio leggero e deciderà solo il talento."],
                ["rm_cesare", "[annuisce con solenne approvazione] Hai il cuore di un vero romano. Te ne sarò riconoscente davanti a tutto l'impero."]
              ]);
              setStep(3);
              bond("cesare", 35);
              bond("gloria", 25);
              K.editto("terme", { sesterzi: 50, gloria: 30, cesare: 35 });
            }],
            ["Fingi di assecondare Furbio per il denaro", () => {
              say([
                ["hero", "Lasciamo credere a Furbio che siamo con lui, così ci coprirà di sesterzi prima della gara."],
                ["rm_cesare", "[sorride sornione] Furbo come una volpe. Purché domani al Colosseo vinca il migliore!"]
              ]);
              setStep(3);
              bond("sesterzi", 150);
              bond("gloria", 10);
              K.editto("terme", { sesterzi: 150, gloria: 15, cesare: 10 });
            }]
          ]);
        } else if (s === 3) {
          ask("Sfidi i Legionari della Guardia per il test finale delle Terme?", [
            ["Sfida nell'Arena delle Terme", () => {
              say([
                ["rm_cesare", "Mostrami se il tuo piede regge anche la carica dei pretoriani!"],
                ["hero", "Palla al centro!"]
              ]);
              K.circoMatch({
                turns: 5,
                us: "Gladiatori S.P.Q.R.",
                opp: { name: "I Legionari della Guardia", color: "#854d0e", style: "pressing" }
              }, (res) => {
                if (res.win) {
                  say([
                    ["rm_cesare", "[si alza e batte le mani con entusiasmo] Magnifico! Un dribbling sull'acqua che passerà agli annali!"],
                    ["rm_spartaco", "Nemmeno i mirmilloni più addestrati di Capua avrebbero fermato quel tiro!"],
                    ["rm_cesare", "Prendi questo elmo con criniera d'oro: domani al Colosseo l'intera Roma si inchinerà al tuo passaggio!"],
                    ["hero", "A domani al Colosseo, Cesare."]
                  ]);
                  questDone("Parla con il magistrato");
                  bond("gloria", 30);
                  bond("cesare", 40);
                  K.giveCos("rm_c2");
                  finishChapter(N, { title: "IL PATTO DELLE TERME", badge: "⭐ Gladiatore Scelto" });
                } else {
                  say([
                    ["rm_cesare", "Il vapore ha offuscato i tuoi riflessi! Riposa nelle acque tiepide e riprova quando sarai concentrato!"]
                  ]);
                }
              });
            }],
            ["Un momento", () => say([["rm_cesare", "Prenditi il tuo tempo. Roma non è stata costruita in un giorno."]])]
          ]);
        }
      },
      rm_furbio(K) {
        say([["rm_furbio", "[sudando nella sauna] Ragazzo! Mi raccomando per domani: calcia forte e non fare troppe domande sulla pesantezza del cuoio! I sesterzi ti aspettano!"]]);
      }
    };

    return {
      n: N,
      title: "Le Terme dei Campioni",
      desc: "Il relax ai Bagni di Caracalla, l'incontro con Cesare in incognito e la congiura svelata.",
      goal: () => goal(S()),
      zones,
      talk,
      intro: () => {
        setStep(0);
        K.teleport("rm_terme", 4, 18);
      }
    };
  }

  boot();
})();
