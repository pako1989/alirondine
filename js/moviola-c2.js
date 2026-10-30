// js/moviola-c2.js - «L'Ombra della Moviola · Tele-Rondine '84»
// Capitolo 2: «Il Furgone nel Fango: Cavi schermati e intercettazioni sul greto»
(function () {
  "use strict";

  function boot() {
    const E = window.__moviolaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }

  function chapter2(K) {
    const H = window.__moviolaH, { setStep, quest, F } = K;
    const N = 2, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    H.cast(K);
    K.cos("mov_c2", { kind: "shirt", label: "Giacca a Vento da Bordo Campo", val: "#475569", from: "Capitolo 2 di L'Ombra della Moviola" });

    const goal = (s) => ({
      0: "Parla con Silvano Saldatore sull'argine del torrente.",
      1: "Raggiungi il furgone scuro tra i canneti e crea un diversivo.",
      2: "Entra nell'abitacolo del furgone e recupera la bobina Nagra.",
      3: "Raggiungi l'Osteria «Il Traliccio» e affronta Fosco Banti.",
      4: "Prendi la decisione morale sul destino dell'arbitro Banti."
    }[s] || "Il capitolo 2 è concluso.");

    function fin(scelta) {
      F.set("mov_c2_done", true);
      K.reward("mov_c2", { coins: 90, cos: "mov_c2" });
      K.finishChapter(N, scelta || "ok");
      K.scene([
        ["voce", "Mentre lasci l'argine, il furgone mimetizzato salta in aria in una fiammata scarlatta illuminando il viadotto."],
        ["mov_silvano", "[ansimante] Hanno bruciato tutto per cancellare le impronte! Ma la bobina è salva nel tuo zaino."],
        ["voce", `<b>FINE DEL CAPITOLO 2.</b> Chiarezza ${K.stat("chiarezza")} · Etica ${K.stat("etica")} · Ascolti ${K.stat("ascolti")}.`],
        ["voce", "Il Capitolo 3, «La Diretta delle 20:30», ti aspetta."]
      ], () => K.openMain(), "mov_campanile");
    }

    const talk = {
      mov_silvano() {
        if (K.rel.scene("mov_silvano")) return;
        const s = S();
        if (s === 0) {
          say("mov_silvano", "[agitato] Quel segnale non è un'emittente normale: usano frequenze dell'aviazione civile per non farsi agganciare dai periti postali.");
          say("mov_silvano", "Ho intercettato una portante a 148.450 MHz che proviene da quel furgone senza targhe mimetizzato sotto il quarto pilone del viadotto.");
          say("mov_silvano", "C'è una guardia che pattuglia i canneti. Serve un diversivo per entrare nell'abitacolo senza farsi sparare.");
          setStep(N, 1);
          quest("mov_c2_furgone", "Il Covo nel Canneto", "Avvicinati al furgone scuro e neutralizza la sorveglianza.");
          return ask("Silvano ti mostra una scatola di petardi da segnalazione.", [
            {
              label: "Usa i petardi come diversivo",
              sub: "Attira la guardia verso il greto del fiume",
              big: true, cls: "hot",
              fn: () => {
                K.bond("chiarezza", 5);
                say("mov_silvano", "[felice] Lanciati tra i sassi! La guardia corre verso l'acqua: la porta del furgone è spalancata, vai!");
                setStep(N, 2);
                done();
              }
            },
            {
              label: "«E se ci scoprono?»",
              fn: () => {
                say("mov_silvano", "Se ci scoprono, l'unica frequenza che trasmetteremo sarà il silenzio eterno. Muoviti!");
                done();
              }
            }
          ]);
        }
        say("mov_silvano", s < 3 ? "Entra in quel furgone e prendi il magnetofono!" : "Banti è all'Osteria Il Traliccio, dietro la stazione di servizio!");
        done();
      },

      mov_daria() {
        if (K.rel.scene("mov_daria")) return;
        const s = S();
        if (s === 2) {
          say("mov_daria", "[sconvolta] Hanno registrato tutto il canale audio dell'arbitro... ascolta le cuffie.");
          say("mov_daria", "«Fosco, ricordati dei tuoi figli a scuola, fischia al primo contatto». Dio mio, è un ricatto in piena regola!");
          return ask("Prelevi la bobina Nagra dal registratore portatile?", [
            {
              label: "Estrai la bobina audio Nagra",
              sub: "Aggiungi la prova decisiva al Dossier",
              big: true, cls: "hot",
              fn: () => {
                K.dossier.add("tele_rondine", "intercettazione_nagra");
                K.bond("chiarezza", 15);
                setStep(N, 3);
                quest("mov_c2_osteria", "L'Arbitro al Traliccio", "Raggiungi l'Osteria «Il Traliccio» e affronta Fosco Banti.");
                say("mov_daria", "[determinata] Questa bobina vale più dell'oro. Banti è nascosto all'Osteria 'Il Traliccio' a bere grappa. Dobbiamo guardarlo negli occhi.");
                done();
              }
            }
          ]);
        }
        say("mov_daria", "Andiamo all'osteria, prima che Banti scappi!");
        done();
      },

      mov_fosco() {
        if (K.rel.scene("mov_fosco")) return;
        const s = S();
        if (s === 3 || s === 4) {
          say("mov_fosco", "[straziato] Volevo solo uscire da quel campo vivo... non potete capire cosa significa avere gente col cric sotto casa ogni notte.");
          say("mov_fosco", "Mi hanno detto che se Montenero non vinceva lo spareggio, mia figlia non sarebbe mai tornata a casa da scuola.");
          say("mov_fosco", "Hanno messo una busta con cinquanta milioni nella mia borsa nello spogliatoio. Non li ho nemmeno toccati... ma il fischietto era in bocca a me.");
          setStep(N, 4);
          return ask("Come gestire la confessione disperata di Fosco Banti?", [
            {
              label: "Opzione A: Proteggi la Famiglia",
              sub: "+20 Etica, +1 Cuore Banti (Aiutalo a fuggire sul treno notturno)",
              big: true, cls: "hot",
              fn: () => {
                K.bond("etica", 20);
                K.rel.add("mov_fosco", 8);
                say("mov_fosco", "[in lacrime] Grazie... grazie dal profondo del cuore. Prendo il treno delle 23 per la Svizzera con mia figlia. Che Dio vi protegga.");
                fin("proteggi");
              }
            },
            {
              label: "Opzione B: Inchiodalo alle sue Colpe",
              sub: "-15 Etica, +25 Chiarezza (Firma la confessione giurata per il Dossier)",
              big: true, cls: "hot",
              fn: () => {
                K.bond("etica", -15);
                K.bond("chiarezza", 25);
                K.dossier.add("tele_rondine", "confessione_banti");
                say("mov_fosco", "[terrorizzato] Firmo... firmo tutto. Ma se mi succede qualcosa, sapete chi è stato il mandante: il commendator Valeri.");
                fin("inchioda");
              }
            }
          ]);
        }
        say("mov_fosco", "Lasciatemi stare... la mia vita è già distrutta.");
        done();
      }
    };

    const zones = {
      mov_torrente: {
        region: "fango",
        name: "Greto del Torrente Rondinella",
        short: "Torrente",
        sub: "Piloni dell'autostrada, ghiaia umida e canneti nebbiosi",
        bg: "mov_torrente",
        time: "tramonto",
        w: 32, h: 22, base: ",", start: [4, 14],
        itemCos: "mov_c2",
        items: [[3, 6], [28, 16], [15, 18]],
        areas: [[0, 0, 31, 21, "L'argine limaccioso sotto i grandi piloni del viadotto"]],
        npcs: () => [
          { id: "mov_silvano", at: [8, 12] }
        ],
        doors: {
          "22,10": { to: "mov_abitacolo", at: [4, 12] },
          "28,14": { to: "mov_osteria", at: [4, 14] }
        },
        loot: {
          "12,18": {
            id: "mov_fischietto",
            text: "Tra i ciottoli del greto: un vecchio fischietto d'ottone brunito smarrito dall'arbitro.",
            empty: "Tra i ciottoli c'è solo fango e rami secchi."
          }
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 5, "w");
          lay(0, 6, 31, 16, ",");
          lay(0, 17, 31, 21, ";");
          // Furgone mimetizzato
          lay(20, 8, 25, 11, "y");
          put(22, 10, "q");
          // Osteria in fondo al sentiero
          lay(26, 12, 30, 15, "y");
          put(28, 14, "q");
        },
        intro: [
          ["voce", "L'argine del torrente Rondinella è avvolto da una nebbia densa che profuma di nafta e terra bagnata."]
        ]
      },

      mov_abitacolo: {
        region: "fango",
        interior: true,
        name: "Abitacolo Furgone Intercettazioni",
        short: "Abitacolo",
        sub: "Registratore Nagra a bobine, spie a led verdi e fumo di sigaro",
        bg: "mov_abitacolo",
        time: "notte",
        w: 20, h: 16, base: "=", start: [4, 12],
        npcs: () => [
          { id: "mov_daria", at: [10, 8] }
        ],
        exits: { "4,13": { to: "mov_torrente", at: [22, 11] } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a");
          lay(0, 0, 0, 15, "a");
          lay(19, 0, 19, 15, "a");
          lay(0, 15, 19, 15, "a");
          lay(1, 2, 18, 14, "=");
          put(4, 14, "v");
          // Banco con Nagra
          lay(8, 6, 14, 7, "T");
          put(11, 6, "Z");
        }
      },

      mov_osteria: {
        region: "fango",
        interior: true,
        name: "Osteria «Il Traliccio»",
        short: "Osteria",
        sub: "Bancone in formica verde, flipper rumoroso e televisore Mivar",
        bg: "mov_osteria",
        time: "notte",
        w: 24, h: 18, base: "=", start: [4, 14],
        npcs: () => [
          { id: "mov_fosco", at: [14, 10] }
        ],
        exits: { "4,15": { to: "mov_torrente", at: [28, 15] } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 1, "a");
          lay(0, 0, 0, 17, "a");
          lay(23, 0, 23, 17, "a");
          lay(0, 17, 23, 17, "a");
          lay(1, 2, 22, 16, "=");
          put(4, 16, "v");
          // Bancone
          lay(6, 6, 16, 7, "T");
          // Flipper e telefono
          put(18, 5, "Z");
          put(20, 5, "J");
        }
      }
    };

    return {
      n: N,
      title: "Il Furgone nel Fango",
      sub: "Cavi schermati e intercettazioni sul greto",
      goal,
      intro: () => [
        ["voce", "La traccia audio del derby porta sotto i piloni del viadotto. Qualcuno ha intercettato i fischietti."]
      ],
      start: "mov_torrente",
      zones,
      talk
    };
  }

  boot();
})();
