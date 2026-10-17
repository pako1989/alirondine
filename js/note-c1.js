// js/note-c1.js - TACTICS NOTE · Capitolo 1 «La Mela e il Quaderno Nero»
// Il ritrovamento del taccuino misterioso sotto i ciliegi del Liceo Daikoku,
// l'incontro con il demone Ryu e il primo duello concettuale con Raito Yagami.
(function () {
  "use strict";
  function boot() {
    const D = window.__note;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("qd_ryu", { shape: "ombra", name: "Ryu il Demone", tag: "dark", hair: "#0f172a", style: "spiky", skin: "#cbd5e1", eye: "#ef4444", bg: ["#020617", "#ef4444"], shirt: "#000000" },
      "Spirito del cuoio sceso nel mondo dei mortali solo per noia e per gustare mele succose: «Il calciatore il cui nome viene scritto su questo quaderno subirà un fallo tattico entro 40 secondi. Gli umani sono davvero spassosi!».");

    K.cast("qd_raito", { acc: ["taccuino"], name: "Raito Yagami", tag: "red", hair: "#b45309", style: "slick", skin: "#fed7aa", eye: "#78350f", bg: ["#1e293b", "#ef4444"], shirt: "#1e293b" },
      "Capitano e regista del Liceo Daikoku. Voti perfetti, senso della posizione geometrico e un'ambizione smisurata: «Io sarò la giustizia del campionato. Nessun arbitro corrotto potrà sfuggire alle mie deduzioni».");

    K.cast("qd_soichiro", { beard: "baffi", acc: ["fischietto"], name: "Sovrintendente Yagami", tag: "blue", hair: "#64748b", style: "buzz", skin: "#cbd5e1", eye: "#1e293b", bg: ["#0f172a", "#38bdf8"], shirt: "#334155" },
      "Presidente del comitato etico sportivo e padre di Raito. Uomo d'onore incorruttibile: «Finché sarò in questa commissione, il calcio resterà leale, anche se dovesse costarmi la reputazione».");

    K.cos("qd_c1", { kind: "shirt", label: "Divisa Scolastica Daikoku con colletto scuro", val: "#1e293b", from: "Capitolo 1 di Tactics Note" });
    K.lore("l_note_rules", { t: "Le Regole del Quaderno", d: "«Il mediano il cui nome viene scritto su queste pagine subirà una contromossa geometrica entro 40 secondi»." });
    K.lore("l_daikoku", { t: "Liceo Daikoku", d: "Prestigioso istituto studentesco noto per i suoi successi accademici e l'implacabile squadra di calcio diretta da Raito." });

    const goal = (s) => ({
      0: "Qualcuno ti osserva dai rami dei ciliegi: è Ryu, vicino all'ingresso in basso a sinistra, accanto al cartello. Avvicinati e premi Parla.",
      1: "Entra nel Liceo Daikoku e raggiungi l'Aula del Club di Tattica per parlare con Raito Yagami.",
      2: "Parla di nuovo con Raito (Aula del Club, dentro il Liceo) e scegli «Inizia la sfida a Tactics Note». Vinci contro i Rivali di Shibuya.",
      3: "Il primo capitolo è concluso. Continua con il Capitolo 2."
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      qd_cortile: {
        region: "daikoku", name: "Cortile dei Ciliegi", short: "Liceo Daikoku", sub: "Petali rosa nell'aria, viali in ciottoli e l'ingresso dell'istituto", bg: "qd_cortile", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[3, 8], [28, 8], [15, 18]],
        areas: [[10, 8, 22, 14, "Il campo d'allenamento in erba sintetica"], [0, 0, 31, 21, "Il viale d'accesso principale al Liceo Daikoku"]],
        act: { q: "Entra nel Liceo" },
        flavor: {
          B: "Le rastrelliere delle biciclette degli studenti del club sportivo.",
          P: "Un lampione del viale che proietta lunghe ombre sui petali caduti.",
          T: "Un tavolo in cemento per studiare le formazioni prima dell'allenamento.",
          K: "Una cassetta di legno con mele rosse profumate lasciata all'ombra."
        },
        intro: [
          ["voce", "Liceo Daikoku, una sera d'autunno. Il vento scuote i rami dei ciliegi spargendo petali sul terreno sintetico."],
          ["voce", "Ai piedi di un tronco secolare giace un taccuino nero con lettere d'argento: «Tactics Note». Sopra il ramo, due occhi rossi e luminosi ti fissano sgranocchiando una mela."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "qd_ryu", at: [8, 17] }] : [{ id: "qd_ryu", at: [21, 14] }]),
          ...(s >= 2 ? [{ id: "qd_soichiro", at: [14, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          // Perimetro e recinzione
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Viali principali
          lay(1, 16, 30, 19, ":"); lay(15, 7, 15, 16, ":"); lay(4, 7, 27, 7, ":");
          // Edificio del Liceo Daikoku (centro-sinistra)
          house(11, 2, 10, 5, { door: [16, 6], roof: "#0f172a", wall: "#334155", rr: 2, enter: { to: "qd_aula", at: [7, 9] } });
          // Palestra annessa (destra)
          house(22, 2, 8, 5, { door: [25, 6], roof: "#1e293b", wall: "#475569", rr: 1, enter: "La Palestra del Liceo: parquet lucidato e risuonare di scarpe da gioco." });
          // Elementi del cortile
          put(16, 9, "T"); put(26, 17, "K"); put(6, 17, "B");
          [[9, 7], [21, 7], [12, 14]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
          // ciliegi in fiore lungo il viale e ai lati del campo
          [[2, 9], [2, 14], [29, 9], [29, 14], [7, 10], [24, 10], [7, 14], [24, 14], [12, 17], [19, 17], [3, 3], [8, 3]].forEach(([x, y]) => put(x, y, "t"));
        }
      },
      qd_aula: {
        interior: true, region: "interno", name: "Aula del Club di Tattica", short: "Club Tattica", sub: "Lavagne stracolme di schemi, monitor CRT e profumo di gesso", bg: "qd_aula", w: 16, h: 12, start: [7, 9], outside: ["qd_cortile", 16, 7],
        act: { L: "Esamina la lavagna", T: "Analizza i dati al computer", B: "Siediti al banco", v: "Esci nel cortile" },
        flavor: {
          L: "La grande lavagna verde su cui Raito traccia le diagonali difensive con precisione algebrica.",
          T: "Un monitor CRT che elabora statistiche di intercettazione sui mediani avversari.",
          B: "Un banco da studio ordinatissimo con quaderni rilegati e matite affilate."
        },
        intro: [["voce", "L'Aula del Club di Tattica: silenzio assoluto, interrotto solo dal ticchettio di una tastiera. Raito Yagami ti osserva senza voltarsi del tutto, come se avesse previsto il tuo arrivo al secondo esatto."]],
        npcs: () => [
          { id: "qd_raito", at: [8, 4] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "L");
          put(3, 4, "T"); put(12, 4, "T");
          put(4, 7, "B"); put(11, 7, "B");
        }
      }
    };

    const chDone = () => { try { const i = window.__note && window.__note.info && window.__note.info(); return !!(i && i.done && i.done[1]); } catch (e) { return true; } };

    const talk = {
      qd_ryu(K) {
        const s = S();
        if (s === 0) {
          say([
            ["qd_ryu", "[ride] Eh eh eh... L'hai raccolto, vero? La maggior parte degli umani avrebbe avuto paura di toccare quel quaderno nero."],
            ["hero", "Chi sei tu? E che scherzo è questo taccuino?"],
            ["qd_ryu", "Io sono Ryu, uno spirito del cuoio e del campo. Mi annoiavo lassù nel vuoto, così ho lasciato cadere il Tactics Note sul vostro prato."],
            ["qd_ryu", "Chi possiede quel quaderno può prevedere e neutralizzare qualsiasi trama avversaria in 40 secondi. Ma a me non interessa chi vince... mi interessano solo le mele rosse! Ne hai una con te?"],
            ["hero", "Ne ho trovate un paio nel cortile."],
            ["qd_ryu", "[felice] Meraviglioso! Croccanti e succose! Tieni pure il quaderno. Ma fai attenzione: Raito Yagami nell'aula del club cerca proprio uno strumento per ripulire il campionato."]
          ], () => {
            bond("intuito", 15);
            bond("mele", 2);
            setStep(1);
            quest("qd1_aula", "Il Club di Tattica", "Entra nel Liceo Daikoku e confrontati con Raito Yagami nell'Aula del Club.");
            done();
          });
        } else if (s === 1) {
          say([
            ["qd_ryu", "Raito ti aspetta nell'Aula di Tattica. Vediamo come reagirà quando capirà cosa puoi fare."]
          ], done);
        } else {
          say([
            ["qd_ryu", "[sgranocchia una mela] Eh eh eh... Le cose si fanno interessanti. Guarda come tremano i tuoi avversari quando apri quel taccuino!"]
          ], done);
        }
      },

      qd_raito(K) {
        const s = S();
        if (s === 1) {
          say([
            ["qd_raito", "[socchiude gli occhi e poggia il mento sulle mani giunte] Ti stavo osservando dalla finestra del secondo piano. Hai un passo insolito."],
            ["hero", "Raito Yagami? Dicono che tu sia il miglior regista della prefettura."],
            ["qd_raito", "Non si tratta di essere i migliori: si tratta di avere il controllo totale del gioco. Questo campionato è marcio. Arbitri che tollerano falli da macellai, squadre che comprano i guardalinee."],
            ["qd_raito", "Il calcio ha bisogno di un giudizio supremo. Una mente capace di anticipare ogni nefandezza e punirla all'istante con un gol infallibile."],
            ["hero", "E credi che una lavagna basti per cambiare le cose?"],
            ["qd_raito", "[sorride con freddezza] Una lavagna ordinaria no. Ma la mia teoria della contromossa istantanea sì. Dimostrami che sai leggere la traiettoria prima del fischio: affronta i Rivali di Shibuya al Tactics Note!"]
          ], () => {
            setStep(2);
            questDone("qd1_aula");
            quest("qd1_match", "Simulazione al Tactics Note", "Vinci la sfida tattica a Tactics Note contro i Rivali di Shibuya!");
            K.deduci("quaderno", { intuito: 10, giustizia: 5 });
            done();
          });
        } else if (s === 2 || (s >= 3 && !chDone())) {
          ask("qd_raito", "I Rivali di Shibuya sono schierati per il test. Sei pronto a dedurre le loro mosse con il Tactics Note?", [
            {
              label: "Inizia la sfida a Tactics Note ▸",
              sub: "Deduzione in 40 secondi: Anticipo, Trappola, Lancio",
              big: true,
              fn: () => {
                if (window.__quaderno && window.__quaderno.start) {
                  window.__quaderno.start({
                    opp: "I Rivali di Shibuya",
                    onDone: (res) => {
                      if (res.win) {
                        setStep(3);
                        questDone("qd1_match");
                        bond("intuito", 20);
                        bond("giustizia", 10);
                        K.reward("qd_c1", 35);
                        say([
                          ["qd_raito", "[i suoi occhi brillano di una strana luce] Straordinario. 3 contromosse perfette senza esitazione. Le tue deduzioni superano persino i miei modelli statistici."],
                          ["hero", "Il campo risponde sempre a chi sa leggere il tempo di gioco."],
                          ["qd_raito", "Questo è solo l'inizio. Insieme riscriveremo la storia di questo torneo. Nessuno potrà fermare il nostro nuovo ordine calcistico!"]
                        ], () => {
                          finishChapter(1, "Il Tactics Note ha superato il primo test. Ma a Tokyo una mente altrettanto geniale sta già indagando...");
                        });
                      } else {
                        say([
                          ["qd_raito", "Hai esitato sulla contromossa. Nel nostro gioco un errore di calcolo equivale alla sconfitta. Riprova quando hai la mente lucida."]
                        ], done);
                      }
                    }
                  });
                } else {
                  setStep(3);
                  finishChapter(1, "Il Tactics Note ha superato il primo test. Ma a Tokyo una mente altrettanto geniale sta già indagando...");
                }
              }
            },
            {
              label: "Dammi ancora un minuto",
              sub: "Rivedi gli schemi prima del fischio d'inizio",
              fn: done
            }
          ]);
        } else {
          say([
            ["qd_raito", "Il primo passo è compiuto. Presto la federazione si accorgerà che qualcosa di nuovo e inarrestabile sta dominando il campo."]
          ], done);
        }
      },

      qd_soichiro(K) {
        say([
          ["qd_soichiro", "Ragazzi, ho saputo del test. Ricordatevi sempre che la vittoria non conta nulla se non è ottenuta con onore e rispetto per l'avversario."],
          ["qd_soichiro", "Circolano strane voci su anomalie tattiche nel girone. La commissione etica vigilerà su ogni singolo incontro."]
        ], done);
      }
    };

    return {
      n: N,
      title: "La Mela e il Quaderno Nero",
      sub: "L'arrivo al Liceo Daikoku e il primo test intellettuale con Raito",
      goal,
      start: "qd_cortile",
      introBg: "qd_titolo",
      zones,
      talk
    };
  }

  boot();
})();
