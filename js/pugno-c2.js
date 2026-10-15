// js/pugno-c2.js - PER UN PUGNO DI RIGORI · Capitolo 2 «La Notte dei Desperados»
// La notte cala su El Paso: spedizione nel Canyon Rosso di San Silvestro alla luce dei falò,
// l'incontro con Ramon «Sette Tiri», il patto segreto per il Totem d'Oro di Rio Bravo,
// e la sfida a «Stangata» sulle rocce scoscese contro la banda dei Desperados.
(function () {
  "use strict";
  function boot() {
    const D = window.__pugno;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("pr_ramon", { beard: "pizzetto", acc: ["cappellino"], name: "Ramon «Sette Tiri»", tag: "", hair: "#111111", style: "slick", skin: "#b9804f", eye: "#1a1a1a", bg: ["#7c2d12", "#dc2626"], shirt: "#dc2626" },
      "Il temuto capo dei Desperados di Rio Bravo. Si chiama 'Sette Tiri' perché sostiene di poter segnare sette rigori consecutivi con gli occhi bendati. Indossa un poncho rosso scuro e ha un rispetto quasi religioso per il calcio leale.");

    K.cast("pr_chico", { acc: ["bandana"], name: "Chico Mano Lesta", tag: "blue", hair: "#3a2a1a", style: "messy", skin: "#e0ac7e", eye: "#2a1a1a", bg: ["#451a03", "#d97706"], shirt: "#d97706" },
      "Il giovane luogotenente di Ramon. Famoso per le sue finte con lo sguardo che ingannano anche i portieri più esperti. Conosce ogni anfratto e ogni eco delle gole del canyon.");

    K.cos("pr_c2", { kind: "style", label: "Cappello da pistolero", val: "cowboy", from: "Capitolo 2 di Per un pugno di rigori" });
    K.lore("l_canyon", { t: "Il Canyon Rosso di San Silvestro", d: "Una gola rocciosa naturale dove il vento fischia tra le fessure creando un'acustica impressionante: i tiri rimbombano come tuoni contro le pareti di pietra arenaria." });

    const goal = (s) => ({
      0: "La notte è scesa su El Paso. Raggiungi il Saloon per ascoltare il piano dello Sceriffo Cooper.",
      1: "Avventurati nel Canyon Rosso per incontrare Ramon Sette Tiri e i suoi Desperados.",
      2: "Parla con Ramon attorno al falò di bivacco nel Canyon e decidi la tua linea di condotta.",
      3: "Sfida la banda di Ramon a Stangata nel cuore della gola rocciosa!"
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      pr_saloon_notte: {
        interior: true, region: "saloon", name: "El Paso · Saloon El Palo (Notte)", short: "Saloon (Notte)", sub: "Tavolo di guerra, candele e carte nautiche del deserto", bg: "pr_saloon", w: 16, h: 12, start: [7, 9],
        act: { T: "Guarda la mappa", P: "Ascolta il silenzio", v: "Vai al Canyon" },
        intro: [["voce", "La notte ha ammantato El Paso di un silenzio teso. Dentro al Saloon, lo Sceriffo Cooper fuma un sigaro e Carmela controlla le scorte di sarsaparilla."]],
        npcs: () => [{ id: "pr_sceriffo", at: [6, 4] }, { id: "pr_carmela", at: [8, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "B");
          put(12, 5, "P");
          put(3, 8, "T"); put(11, 8, "T");
        }
      },
      pr_canyon: {
        region: "canyon", name: "Canyon Rosso di San Silvestro", short: "Canyon Rosso", sub: "Gole di arenaria, falò dei banditi e dischetto di pietra", bg: "pr_canyon", time: "notte", travel: [4, 18],
        w: 32, h: 22, start: [4, 18], items: [[2, 5], [29, 6], [14, 19]],
        areas: [[10, 8, 22, 14, "Il cerchio dei falò"], [0, 0, 31, 21, "Canyon di San Silvestro"]],
        flavor: {
          t: "Una pietra piatta su cui è inciso un teschio e un pallone: il marchio dei Desperados.",
          C: "Un cactus cresciuto tra le spaccature della roccia rossa.",
          B: "Una cassa di viveri rubata alla diligenza postale."
        },
        intro: [
          ["voce", "Il Canyon Rosso: l'aria notturna è frizzante e le pareti di roccia riflettono la luce danzante dei falò."],
          ["voce", "Dodici banditi con poncho e cappelli a tesa larga ti osservano in silenzio mentre cammini verso il dischetto di calce."]
        ],
        npcs: (s) => [
          { id: "pr_ramon", at: [16, 12] },
          { id: "pr_chico", at: [20, 12] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 17, 30, 19, ":"); lay(15, 8, 15, 17, ":"); lay(4, 8, 27, 8, ":");
          // Dischetto di calce e pali di legno
          put(16, 15, "T");
          [[8, 10], [24, 10], [12, 16], [20, 16]].forEach(([x, y]) => put(x, y, "C"));
          [[10, 8], [22, 8]].forEach(([x, y]) => put(x, y, "B"));
          lay(6, 6, 26, 6, "S");
          put(4, 17, "s");
        }
      }
    };

    const talk = {
      pr_sceriffo(K) {
        say([
          ["pr_sceriffo", "[guarda la mappa sul tavolo] Ramon ha radunato tutti i tiratori di Rio Bravo nel Canyon. Sostiene che il dischetto di El Paso appartenga ai suoi antenati."],
          ["pr_sceriffo", "Se vai laggiù, Gringo, guardati le spalle. Ramon è leale sul campo di rigore, ma fuori dal campo non risponde a nessuna legge eccetto la propria."],
          ["hero", "Vado a parlargli. Due tiratori che si rispettano trovano sempre un accordo."]
        ]);
        quest("Incontra Ramon al Canyon", "Esci dal Saloon e incamminati verso le gole del Canyon Rosso.");
        setStep(1);
        K.go("pr_canyon", 4, 18);
      },
      pr_carmela(K) {
        say([["pr_carmela", "Porta questa fiaschetta di sarsaparilla a Ramon. Digli che gliela manda Carmela: gli addolcirà il carattere prima del tiro."]]);
      },
      pr_ramon(K) {
        const s = S();
        if (s <= 2) {
          say([
            ["pr_ramon", "[ti fissa da sotto la tesa del sombrero, poi accende una sigaretta] Così tu saresti il famoso Gringo venuto a dorso di mulo."],
            ["hero", "E tu sei Ramon Sette Tiri."],
            ["pr_ramon", "[un lampo d'orgoglio negli occhi] Esatto. In questa vallata dicono che la legge la scriva Cooper con la sua stella di latta. Ma la vera giustizia del West si decide a mezzogiorno, quando il sole spacca le pietre e il portiere resta solo contro il tiratore."],
            ["pr_ramon", "Domani al Fortino di Rio Bravo si tiene la finale della Coppa delle Terre Aride. Ti propongo un patto da uomo a uomo: sfidami qui sul mio terreno. Se dimostri di valere, domani giocheremo insieme contro la Rappresentativa dei Ranger!"]
          ]);
          ask("Cosa rispondi alla proposta di Ramon?", [
            ["Accetta l'onore della sfida", () => {
              say([
                ["hero", "Non mi sono mai tirato indietro di fronte a un dischetto. Metti il pallone sulla riga di calce, Ramon."],
                ["pr_ramon", "[scoppia in una risata fragorosa] Questo è parlare chiaro! Chico, prepara i guanti e fai spazio tra le rocce!"]
              ]);
              setStep(3);
              bond("taglia", 100);
              bond("freddezza", 20);
              K.manifesto("patto", { taglia: 150, legge: -5, freddezza: 25 });
            }],
            ["Dichiara fedeltà alla Legge", () => {
              say([
                ["hero", "Lo Sceriffo Cooper mi ha dato la sua fiducia. Non tradirò la contea per un mucchio di dobloni."],
                ["pr_ramon", "[abbassa il sigaro, pensieroso] Rispetto gli uomini che hanno una parola sola. Ma ti batterò ugualmente: qui nel canyon le stelle di latta non parano i tiri a giro!"]
              ]);
              setStep(3);
              bond("legge", 30);
              bond("freddezza", 30);
              K.manifesto("patto", { taglia: 80, legge: 25, freddezza: 20 });
            }]
          ]);
        } else if (s === 3) {
          ask("Inizi il duello notturno a Stangata contro Ramon?", [
            ["Sfida Ramon dal Dischetto", () => {
              say([
                ["pr_ramon", "Quattro tiri a testa sotto la luce delle fiaccole. Che il vento decida chi ha la mira più ferma!"],
                ["hero", "Pronto, Ramon. Fischia l'inizio."]
              ]);
              K.stangataMatch({
                turns: 5,
                us: "Il Gringo",
                opp: { name: "Ramon e i Desperados", color: "#dc2626", style: "pressing" }
              }, (res) => {
                if (res.win) {
                  say([
                    ["pr_ramon", "[lascia cadere il pallone a terra e applaude sinceramente] Per tutti i fulmini di Rio Bravo... Quel tiro al sette con rimbalzo sulla parete rocciosa è stata un'opera d'arte!"],
                    ["pr_chico", "Non ho mai visto il capo spiazzato in quel modo. Questo ragazzo non ha nervi, ha corde di chitarra!"],
                    ["pr_ramon", "Gringo, ti sei guadagnato il rispetto di tutti i Desperados del canyon. Prendi questo cappello da pistolero: ti riparerà dal sole implacabile della grande finale di domani."],
                    ["hero", "Ci vediamo al Fortino, Ramon. A mezzogiorno di fuoco."],
                    ["pr_ramon", "A mezzogiorno spaccato. Chi ha paura resti pure a letto!"]
                  ]);
                  questDone("Incontra Ramon al Canyon");
                  bond("taglia", 250);
                  bond("freddezza", 35);
                  K.giveCos("pr_c2");
                  finishChapter(N, { title: "IL PATTO DEL CANYON", badge: "⭐ Tiratore Scelto" });
                } else {
                  say([
                    ["pr_ramon", "L'eco del canyon ti ha confuso l'udito, ragazzo! Rilassati, bevi un sorso d'acqua e riprova quando ti senti pronto!"]
                  ]);
                }
              });
            }],
            ["Un momento", () => say([["pr_ramon", "Prenditi il tuo tempo. I fuochi del canyon arderanno tutta la notte."]])]
          ]);
        }
      },
      pr_chico(K) {
        say([["pr_chico", "[fa volteggiare un pallone sulla punta delle dita] Il segreto di Ramon è la rincorsa breve. Sembra che tiri piano e invece la palla parte come un proiettile di fucile!"]]);
      }
    };

    return {
      n: N,
      title: "La Notte dei Desperados",
      desc: "L'incursione notturna nel Canyon Rosso, l'incontro con Ramon Sette Tiri e il duello alla luce dei falò.",
      goal: () => goal(S()),
      start: "pr_saloon_notte",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [["voce", "<b>PER UN PUGNO DI RIGORI</b> · Capitolo 2. Il Saloon di notte: pianoforte scordato, carte sul tavolo e occhi addosso."]];
      }
    };
  }

  boot();
})();
