// js/roma-c1.js - AVE CALCIO! · Capitolo 1 «L'Ingaggio alla Suburra»
// Roma, anno 75 d.C.: il mercato degli schiavi della Suburra, il Senatore Furbio Cacasenno,
// l'incontro con Spartaco all'Osteria del Falerno e il primo duello nell'arena a «Circo Massimo».
(function () {
  "use strict";
  function boot() {
    const D = window.__roma;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("rm_furbio", { acc: ["corona"], name: "Senatore Furbio", tag: "gold", hair: "#e2e8f0", style: "bald", skin: "#ffd2a8", eye: "#78350f", bg: ["#fef3c7", "#b91c1c"], shirt: "#b91c1c" },
      "Patrizio decaduto, impresario di gladiatori del pallone e maestro di intrighi. Porta una toga purpurea sempre troppo lunga e una corona d'alloro finto: «Un rigore comprato al momento giusto vale più di tre legioni in Gallia».");

    K.cast("rm_spartaco", { acc: ["fascia"], name: "Spartaco il Ruvido", tag: "", hair: "#1c1917", style: "buzz", skin: "#b9804f", eye: "#1a1a1a", beard: true, bg: ["#78350f", "#dc2626"], shirt: "#dc2626" },
      "Difensore centrale trace. Ha sconfitto quaranta centurioni ma nel tempo libero studia la filosofia stoica. Nei contrasti non usa mezze misure: «Colpisci il pallone come se dovessi liberare la tua anima dal ciclo delle passioni».");

    K.cast("rm_augusta", { acc: ["fiore"], name: "Augusta la Sibilla", tag: "blue", hair: "#ca8a04", style: "bun", skin: "#fce7f3", eye: "#15803d", bg: ["#fef3c7", "#eab308"], shirt: "#eab308" },
      "Sacerdotessa della Dea Vittoria e ultrà della Suburra. Legge gli esiti delle partite nei fondi delle anfore e nelle frattaglie di quaglia. Le sue profezie calcistiche sono infallibili al novanta per cento.");

    K.cast("rm_gannico", { acc: ["casco"], name: "Centurione Gannico", tag: "", hair: "#451a03", style: "short", skin: "#e0ac7e", eye: "#2a1a1a", bg: ["#451a03", "#78350f"], shirt: "#78350f" },
      "Arbitro capo dell'Urbe. Usa un corno di bronzo da battaglia per fischiare i fuorigioco e incide i cartellini gialli direttamente su cocci d'argilla.");

    K.cos("rm_c1", { kind: "shirt", label: "Tunica romana bordata d'oro", val: "#b91c1c", from: "Capitolo 1 di Ave Calcio!" });
    K.lore("l_circo", { t: "Circo Massimo · L'Arena della Spina", d: "Nell'antica Roma si gioca a Circo Massimo: campo ovale con obelisco spartitraffico centrale, accelerazioni con le bighe, muri di scudi e tiri a catapulta." });

    const goal = (s) => ({
      0: "Sei arrivato alla Suburra. Il Senatore Furbio ti osserva dal podio dell'asta.",
      1: "Raggiungi l'Osteria del Falerno per incontrare Spartaco e formare la squadra.",
      2: "Parla con la Sibilla Augusta e il Centurione Gannico per ottenere il benestare al gioco.",
      3: "Scendi sulla sabbia dell'arena e affronta i Gladiatori della Suburra a Circo Massimo!"
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      rm_suburra: {
        region: "suburra", name: "Roma Antica · Rione Suburra", short: "Suburra", sub: "Vicoli stretti, profumo di spezie, anfore e colonne", bg: "rm_suburra", time: "giorno", travel: [4, 18],
        w: 32, h: 22, start: [4, 18], items: [[2, 6], [29, 6], [15, 19]],
        areas: [[10, 8, 22, 14, "Il mercato della Suburra"], [0, 0, 31, 21, "La Suburra"]],
        flavor: {
          t: "Una colonna con l'editto del Senato: chi tocca il pallone con le mani paga un tributo di tre galline.",
          C: "Una splendida colonna corinzia con una lucertola che prende il sole sul capitello.",
          B: "Un braciere di bronzo ardente con fumo odoroso d'alloro."
        },
        intro: [
          ["voce", "Roma, anno 75 d.C.: il sole illumina i tetti di tegole della Suburra. Il rumore dei sandali sulle pietre si mescola alle grida dei mercanti."],
          ["voce", "Sei stato scambiato per una recluta dei ludi gladiatori. Il Senatore Furbio Cacasenno ti squadra dall'alto con aria avida."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "rm_furbio", at: [8, 18] }] : [{ id: "rm_furbio", at: [20, 14] }]),
          ...(s >= 2 ? [{ id: "rm_augusta", at: [14, 9] }, { id: "rm_gannico", at: [18, 9] }] : []),
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 17, 30, 19, ":"); lay(15, 8, 15, 17, ":"); lay(4, 8, 27, 8, ":");
          house(2, 2, 7, 5, { door: [5, 6], roof: "#78350f", wall: "#fef3c7", rr: 1, enter: "La Villa del Senatore Furbio: busti di marmo raffiguranti i suoi antenati, tutti con espressioni colpevoli." });
          house(11, 2, 10, 5, { door: [16, 6], roof: "#b91c1c", wall: "#fed7aa", rr: 2, enter: { to: "rm_osteria", at: [7, 9] } });
          house(23, 2, 7, 5, { door: [26, 6], roof: "#451a03", wall: "#e2e8f0", rr: 1, enter: "Il Tempio della Fortuna Calcistica: Sibille che consultano fegati di pollo e scommesse non rimborsabili." });
          // Elementi scenici romani
          put(16, 9, "S"); put(26, 17, "E");
          [[9, 8], [21, 8]].forEach(([x, y]) => put(x, y, "B"));
          [[11, 14], [25, 12], [8, 14]].forEach(([x, y]) => put(x, y, "C"));
          [[7, 6], [18, 6]].forEach(([x, y]) => put(x, y, "A"));
          put(4, 17, "s");
        }
      },
      rm_osteria: {
        interior: true, region: "suburra", name: "Suburra · Osteria del Falerno", short: "Osteria Falerno", sub: "Tavolacci di quercia, anfore di mosto e gladiatori", bg: "rm_suburra", w: 16, h: 12, start: [7, 9], outside: ["rm_suburra", 16, 7],
        act: { A: "Bevi un sorso di mosto", B: "Scaldati al braciere", v: "Esci nella via" },
        intro: [["voce", "L'Osteria del Falerno: fumo di legna dolce, brusio di legionari e Spartaco seduto al tavolo d'angolo mentre morde una pagnotta d'orzo."]],
        npcs: () => [{ id: "rm_spartaco", at: [7, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "A");
          put(12, 5, "B");
          put(3, 8, "C"); put(11, 8, "C");
        }
      }
    };

    const talk = {
      rm_furbio(K) {
        const s = S();
        if (s === 0) {
          say([
            ["rm_furbio", "[si aggiusta la toga con sussiego] Per Giove Ottimo Massimo! Chi è questo giovanotto con gli scarpini chiodati?"],
            ["hero", "Sono un viaggiatore. E questi non sono scarpini chiodati per combattere, sono scarpini da calcio."],
            ["rm_furbio", "[sgrana gli occhi e sorride con tutti i denti] Calcio?! Il divino gioco del cuoio volante inventato dai Greci e perfezionato dai Romani!"],
            ["rm_furbio", "Oggi è il tuo giorno fortunato, ragazzo. I miei attaccanti della Suburra si sono ammalati di indigestione da fichi d'india. Se indossi la maglia purpurea e vinci per me i Ludi, ti coprirò di sesterzi e gloria imperiale!"],
            ["hero", "Accetto. Ma gioco con le mie regole: palla a terra e rispetto dell'avversario."],
            ["rm_furbio", "Purché entri in rete, chiamala pure etica stoica! Vai all'Osteria del Falerno: là troverai Spartaco, il nostro capitano."]
          ]);
          quest("Incontra Spartaco all'Osteria", "Entra nell'Osteria del Falerno nella Suburra e parla con il trace.");
          setStep(1);
          K.editto("ingaggio", { sesterzi: 50, gloria: 10, cesare: 10 });
        } else if (s === 1) {
          say([["rm_furbio", "Spartaco ti aspetta all'Osteria. Non farlo arrabbiare: piega le anfore di ferro con le mani nude."]]);
        } else if (s >= 3) {
          ask("Scendi nell'arena per il primo match a Circo Massimo?", [
            ["Sfida nell'Arena (Circo Massimo)", () => {
              say([
                ["rm_furbio", "Al suono dei corni! Che la sabbia del Circo testimoni il tuo valore!"],
                ["hero", "Pronto, senatore. Mostriamo all'Urbe come si gioca."]
              ]);
              K.circoMatch({
                turns: 4,
                us: "Gladiatori S.P.Q.R.",
                opp: { name: "I Centurioni della Guardia", color: "#854d0e", style: "equilibrata" }
              }, (res) => {
                if (res.win) {
                  say([
                    ["rm_furbio", "[salta sui gradini della tribuna rovesciando il calice] Vittoria! Triplice vittoria! Per tutti gli dei dell'Olimpo, che parabola all'incrocio!"],
                    ["rm_spartaco", "Un tiro sublime. Epitteto avrebbe apprezzato la purezza geometrica della traiettoria."],
                    ["rm_furbio", "Tieni questa tunica romana ricamata con fili d'oro: ora sei ufficialmente il primo centravanti dei Ludi Circensi!"],
                    ["hero", "Grazie, senatore. Ora dobbiamo prepararci per le Terme."]
                  ]);
                  questDone("Incontra Spartaco all'Osteria");
                  bond("sesterzi", 100);
                  bond("gloria", 25);
                  bond("cesare", 20);
                  K.giveCos("rm_c1");
                  finishChapter(N, { title: "IL PRIMO ALLORO DELL'ARENA", badge: "🏛️ Gladiatore" });
                } else {
                  say([
                    ["rm_furbio", "La polvere dell'arena ti ha annebbiato la vista! Riprendi fiato e riprova: Cesare non tollera la sconfitta!"]
                  ]);
                }
              });
            }],
            ["Un momento", () => say([["rm_furbio", "Prenditi il tuo tempo. I senatori sanno aspettare quando c'è di mezzo una scommessa."]])]
          ]);
        }
      },
      rm_spartaco(K) {
        const s = S();
        if (s === 1) {
          say([
            ["rm_spartaco", "[solleva un'anfora di vino con un braccio solo e beve a canna] Tu devi essere la nuova recluta di Furbio."],
            ["hero", "Mi chiamano Campione. E sono qui per giocare a pallone."],
            ["rm_spartaco", "[appoggia l'anfora sul tavolo con un tonfo secco] Bene. Il calcio è l'unica battaglia in cui il sangue resta dentro le vene e la gloria vola alta nel cielo."],
            ["rm_spartaco", "Ascoltami: la Spina Centrale dell'arena devia i tiri se non calcoli bene l'effetto. Se tiri a catapulta, fallo salire sopra l'obelisco e lascia che il vento di Roma faccia il resto."],
            ["hero", "Capito. Andiamo a parlare con la Sibilla Augusta e Gannico."]
          ]);
          setStep(2);
          bond("gloria", 15);
        } else {
          say([["rm_spartaco", "Tieni lo scudo alto e la testa fredda. Il vero gladiatore sorride anche quando il portiere avversario è alto due metri."]]);
        }
      },
      rm_augusta(K) {
        const s = S();
        if (s === 2) {
          say([
            ["rm_augusta", "[agita un ramo d'alloro spargendo fumo d'incenso] Vedo... vedo una rete che si gonfia come una vela sotto il maestrale!"],
            ["rm_gannico", "[lucidando il suo corno di bronzo] E io vedo un fuorigioco millimetrico che segnalerò senza esitazione, per Giove!"],
            ["rm_augusta", "Taci, Gannico! Il ragazzo ha il favore degli astri. Gli dei del calcio lo proteggono!"]
          ]);
          say([["voce", "Tutto è pronto. Il Senatore Furbio ti aspetta per il fischio d'inizio nell'arena!"]]);
          setStep(3);
        } else {
          say([["rm_augusta", "La vittoria è già scritta nelle costellazioni, ragazzo!"]]);
        }
      },
      rm_gannico(K) {
        say([["rm_gannico", "[soffia una nota roboante nel corno] Ricorda: spallate consentite solo spalla contro spalla! Se usi il gomito scatta la sanzione di cinque sesterzi!"]]);
      }
    };

    return {
      n: N,
      title: "L'Ingaggio alla Suburra",
      desc: "L'arrivo nell'Urbe, l'ingaggio con il Senatore Furbio, l'incontro con Spartaco e il primo trionfo nell'arena.",
      goal: () => goal(S()),
      zones,
      talk,
      start: "rm_suburra",
      intro: () => {
        setStep(0);
        return [["voce", "Roma, 75 d.C. l'Urbe ti aspetta."]];
      }
    };
  }

  boot();
})();
