// js/onde-c4.js — CAPITOLO 4 · «Frequenza Libera»
// Zone: Stadio Comunale del Molo Vecchio (38x26), Spogliatoio di Calce del '58 (20x13), Torretta del Cronista (20x13).
// Contiene la resa dei conti col Dossier, il confronto con l'Ispettore Valli e tutti e 4 i finali (incluso il finale segreto «bobina1096»).
(function () {
  "use strict";
  function boot() {
    const E = window.__ondeCore;
    if (!E || !E.api || !E.api.addChapter || !window.__ondeH) return setTimeout(boot, 80);
    E.api.addChapter((K) => {
    const N = 4, F = K.F, S = () => K.stepOf(N), { setStep, quest, questDone } = K;
    const H = window.__ondeH(K), { say, done, ask, wask } = H;

    const goal = (s) => ({
      0: "Incrocia le prove nel Dossier e affronta il Commendator Specchio davanti alle tribune dello Stadio.",
      1: "Sali nella Torretta del Cronista (a nord-est) per parlare con l'Ispettore Aristide Valli.",
      2: "Scendi al centro del campo e parla con Nilde per giocare la finalissima contro lo Specchio Sporting Club!",
      3: "Storia conclusa."
    }[s] || "Storia conclusa.");

    function triggerEnding(r) {
      const win = !!(r && r.win);
      const qsl = K.radio.tagCount("qsl");
      const secret = win && r.cleanVinylLap !== false && qsl >= 6 && !F.is("rf_specchio_sponsor") && F.is("rf_bobina_privata") && K.rel.lv("rf_nilde") >= 4 && K.rel.lv("rf_valli") >= 4;
      let endId = "cooperativa";
      if (secret) endId = "bobina1096";
      else if (!win || F.is("rf_resa_prudente") || F.is("rf_specchio_sponsor") || K.stat("prudenza") > K.stat("libero") + 2) endId = "ciclostile";
      else if (F.is("rf_bobina_altoparlanti") || K.stat("libero") >= K.stat("prudenza") + 3) endId = "pirati";

      setStep(N, 3);
      K.end(endId);
      const cosList = endId === "bobina1096" ? ["rf_maglia99", "rf_sciarpa58"] : ["rf_maglia99"];
      const msg = K.reward("onde_c4_" + endId, { coins: endId === "bobina1096" ? 150 : 110, cos: cosList });
      K.finishChapter(N, endId);

      const scenes = {
        cooperativa: [
          ["rf_nilde", "Triplice fischio al Molo Vecchio! Le ruspe spengono i motori e il notaio comunale strappa l'ordinanza falsa davanti a tutta la gradinata!"],
          ["rf_valli", "Visto l'interesse pubblico dimostrato e il vincolo storico sul campo del '58, il Ministero rilascia concessione provvisoria alla «Cooperativa Onde del Golfo» sulla frequenza tonda 100.0 MHz."],
          ["rf_nilde", "«Buonanotte Borgo Marino… stasera niente nastri registrati: qui al microfono è Nilde Marini, e il calcio sul mare è di nuovo libero!»"]
        ],
        pirati: [
          ["rf_lupo", "Che partita leggendaria! La folla ha fatto muro davanti ai cancelli e il Commendator Specchio è scappato sulla sua decapottabile tra i cori della Curva!"],
          ["rf_tullio", "Lo Stadio è salvo, ragazzi, ma l'ingresso non autorizzato in acque territoriali fa scattare l'ordine di sequestro del trasmettitore! Presto, molliamo le cime prima che arrivino i piombi!"],
          ["rf_nilde", "La Rondine Rossa scivola via nella sera salutata da cento torce sugli scogli: oltre le dodici miglia, corsari dell'etere per sempre!"]
        ],
        ciclostile: [
          ["rf_valli", "I novanta minuti sono scaduti. Con rispetto per come avete onorato questo prato, devo applicare i sigilli di piombo al trasmettitore dei 99.9 MHz."],
          ["rf_lupo", "Ci spengono le valvole? E allora noi accendiamo l'inchiostro! Giù nello scantinato della bottega ho già pronto un ciclostile a manovella!"],
          ["rf_wanda", "Lunedì mattina davanti ai cancelli presidiati dal quartiere va a ruba il numero uno di «Fuorigioco Stampato»: una voce libera trova sempre un altro campo!"]
        ],
        bobina1096: [
          ["rf_nilde", "Ultimo giro di vinile senza una sola sbavatura e gol decisivo sotto la gradinata del '58! Il notaio annulla l'appalto e tutta la tribuna canta il coro di Capitan Libeccio!"],
          ["voce", "All'alba di lunedì, mentre sul molo la nebbia si scioglie in oro, un uomo sale sulla passerella della Rondine Rossa senza impermeabile ministeriale: sotto il braccio stringe un nastro vergine e un paio di vecchi scarpini ingrassati."],
          ["rf_valli", "Ho firmato ieri sera la pensione anticipata, ragazzi. Se c'è ancora posto a centrocampo… vorrei incidere insieme a voi la Bobina 1.096 e raccontare finalmente quel terzo tempo con Cesare."],
          ["rf_nilde", "Nilde preme REC sul banco mixer col sorriso pieno di luce: «Qui Radio Fuorigioco, sul mare spunta il sole… a te la linea, Aristide!»"]
        ]
      };

      const infoEnd = E.api.endings().find((x) => x.id === endId) || { title: endId };
      K.scene(H.flush().concat(scenes[endId]).concat([
        ["voce", `<b>FINALE SBLOCCATO · «${K.esc(infoEnd.title)}»</b>${msg.length ? "<br>🎁 " + msg.join(" · ") : ""}<br>📡 Segnale Libero ${K.stat("libero")} · 🔇 Prudenza ${K.stat("prudenza")} · 🎙️ Verità ${K.stat("verita")} · 📼 Mito ${K.stat("mito")}<br>📻 Cartoline QSL: ${qsl}/6 · Finali scoperti: ${K.mem().ends.length}/4`]
      ]), () => K.openMain(), "rf_finale");
    }

    function playFinale() {
      H.playUrto({
        title: "Finale · Stadio del Molo Vecchio",
        us: "Radio Fuorigioco 99.9",
        opp: "Specchio Sporting Club",
        oppColor: "#38bdf8",
        oppStyle: "pressing",
        venue: "stadio",
        track: "finale",
        mateName: "Nilde",
        staticCount: 4,
        halfSec: 24
      }, (r) => {
        if (r && r.quit) {
          say("rf_nilde", "Tutto il Borgo è assiepato sulle gradinate di pietra: quando sei pronto scendiamo in campo fino al novantesimo!");
          return done();
        }
        triggerEnding(r || { win: false });
      });
    }

    const talk = {
      rf_specchio() {
        const s = S();
        if (s === 0) {
          say("rf_specchio", "Ma guardate che carnevalata! Avete perfino ormeggiato quel rottame galleggiante dietro la tribuna mare! Lunedì mattina alle sette le mie ruspe trasformeranno questo prato spelacchiato in centoventi posti barca di lusso.");
          return ask("Il notaio comunale ascolta accanto ai cancelli. Come rispondi al Commendator Specchio?", [
            {
              label: "🗂️ Apri il Dossier per collegare le contraddizioni",
              sub: `Contraddizioni scoperte: ${K.dossier.found("appalto")}/2`,
              cls: "hot",
              fn: () => K.dossier.open("appalto", () => talk.rf_specchio(), true)
            },
            {
              label: "⚖️ Consegna il verdetto delle prove al notaio",
              sub: "Metti agli atti il falso sopralluogo e il collaudo sano",
              big: true,
              cls: "hot",
              fn: () => K.dossier.verdict("appalto", () => talk.rf_specchio(), true, (vid, sol, fnd) => {
                F.set("rf_verdetto", vid);
                if (vid === "annullamento") { K.bond("verita", 2); K.bond("libero", 1); }
                else { K.bond("verita", 1); K.bond("prudenza", 1); }
                if (fnd >= 2) K.bond("sintonia", 1);
                setStep(N, 1);
                quest("c4_torretta", "I Sigilli nella Torretta", "Sali nella Torretta del Cronista (edificio a nord-est) per parlare con l'Ispettore Valli.");
                K.say([
                  ["rf_specchio", fnd >= 1
                    ? "Co-cosa?! Dove avete preso il registro originale del geometra e le bolle delle ruspe?! Notaio, non li ascolti, sono pirati dell'etere!"
                    : "Chiacchiere da bar! Voglio proprio vedere chi fermerà il mio Sporting Club sul campo!"],
                  ["voce", "Il notaio sospende lo sgombero in attesa del confronto sul campo! Ma lassù nella <b>Torretta del Cronista</b> l'Ispettore Valli è appena salito coi sigilli di piombo: raggiungilo subito."]
                ], K.done);
              })
            },
            { label: "◂ Prima raccogli le idee", fn: done }
          ], "rf_stadio");
        }
        say("rf_specchio", "Ho ingaggiato tre professionisti per lo Specchio Sporting Club: vi schiacceremo sul vostro stesso prato!");
        done();
      },
      rf_valli() {
        const s = S();
        if (s === 0) {
          say("rf_valli", "Prima chiarisca la questione legale dell'appalto giù in campo davanti al notaio, giovanotto. Poi faremo i conti con il codice postale.");
          return done();
        }
        if (s === 1) {
          say("rf_valli", "Siete entrati dentro le acque del porto con il trasmettitore acceso a piena potenza, {n}. Non ho più margini: ho qui nella borsa le pinze e i sigilli di piombo.");
          say("voce", "Tiri fuori dalla tasca la <b>Bobina 000</b> recuperata nell'archivio segreto di Capitan Libeccio.");
          K.clock.advance(1);
          wask("rf_valli", "Hai in mano la Bobina 000 con le ultime parole di Cesare per Aristide Valli. Come la usi?", [
            {
              label: "🎧 Porgi le cuffie a Valli in privato, in silenzio",
              sub: "Lascia che quelle parole tra vecchi compagni del '58 restino solo per lui",
              big: true,
              cls: "hot",
              w: { verita: 2, mito: 1 },
              fn: () => {
                F.set("rf_bobina_privata", true);
                K.rel.add("rf_valli", 6);
                setStep(N, 2);
                quest("c4_finale", "La Partita dello Stadio", "Scendi sul prato dello Stadio e parla con Nilde per giocare la finale!");
                say("voce", "Valli indossa le cuffie da studio. Per un minuto intero nella torretta si sente solo il fruscio lieve del nastro che gira.");
                say("rf_valli", "…Quel testardo di un numero dieci. Diciannove anni a credere che mi avesse tradito, e invece si era spaccato il ginocchio in silenzio.");
                say("rf_valli", "Si asciuga gli occhiali col fazzoletto e guarda il quadrante d'argento: «Strano… il mio orologio da taschino oggi è indietro di novanta minuti esatti. Scenda in campo, {n}, e vinca questa partita.»");
                done();
              }
            },
            {
              label: "📢 Diffondi la Bobina 000 dagli altoparlanti dello Stadio",
              sub: "Fai risuonare la voce di Capitan Libeccio su tutta la gradinata!",
              big: true,
              w: { libero: 3 },
              fn: () => {
                F.set("rf_bobina_altoparlanti", true);
                K.rel.add("rf_lupo", 2);
                setStep(N, 2);
                quest("c4_finale", "La Partita dello Stadio", "Scendi sul prato dello Stadio e parla con Nilde per giocare la finale!");
                say("voce", "La voce di Cesare rimbomba dalle trombe di ferro sopra le tribune! Tremila persone si alzano in piedi battendo le mani a tempo, mentre Valli resta immobile coi sigilli abbassati.");
                say("rf_valli", "Non avreste dovuto farlo… ma non sarò io a togliere la corrente mentre parla Cesare. Giocate i vostri novanta minuti!");
                done();
              }
            },
            {
              label: "🔇 Consegna spontaneamente la valvola in cambio dei 90 minuti",
              sub: "Rinuncia subito alla radio per mettere al sicuro la partita dello Stadio",
              big: true,
              w: { prudenza: 3 },
              fn: () => {
                F.set("rf_resa_prudente", true);
                setStep(N, 2);
                quest("c4_finale", "La Partita dello Stadio", "Scendi sul prato dello Stadio e parla con Nilde per giocare la finale!");
                say("rf_valli", "Apprezzo il senso di responsabilità. Prendo in custodia i sigilli fino al fischio finale: ora andate a difendere questo campo.");
                done();
              }
            }
          ], "rf_torretta");
          return;
        }
        say("rf_valli", "Il mio orologio segna ancora novanta minuti prima del tramonto. Non sprechi neanche un passaggio, {n}.");
        done();
      },
      rf_tullio() {
        say("rf_tullio", "Senti che profumo di canfora e calce viva in questo spogliatoio? Sono gli stessi identici ganci a cui appendevamo le maglie di lana nel '58!");
        done();
      },
      rf_valvola() {
        say("rf_valvola", "In alto dietro i gradoni di pietra della Tribuna Mare c'è l'ultima Cartolina QSL sui 103.6 MHz! Se le hai sintonizzate tutte e sei, l'etere del golfo oggi non ha più segreti.");
        done();
      },
      rf_lupo() {
        say("rf_lupo", "La Rondine Rossa è ormeggiata proprio dietro la traversa lato mare col volume a dieci: ogni tuo tiro sul tempo farà tremare anche le boe!");
        done();
      },
      rf_wanda() {
        say("rf_wanda", "Ho chiuso il Bar Eldorado col cartello «TUTTI ALLO STADIO»! Persino i gabbiani fanno il tifo per Radio 99.9!");
        done();
      },
      rf_nilde() {
        const s = S();
        if (s < 2) {
          say("rf_nilde", s === 0 ? "Prima mettiamo con le spalle al muro Specchio davanti al notaio qui fuori dalla tribuna!" : "Corri su nella Torretta del Cronista a nord-est: Valli è salito coi sigilli!");
          return done();
        }
        say("rf_nilde", "Guarda la gradinata di pietra, {n}: non c'è più un centimetro libero, e dietro la porta dondola la prua rossa del nostro rimorchiatore!");
        say("rf_nilde", "Allacciati gli scarpini: giochiamo su tre bande a tutto volume contro lo Specchio Sporting Club!");
        return ask("Finalissima · Stadio Comunale del Molo Vecchio:", [
          { label: "💿 Fischio d'inizio! (Finale Onde d'Urto)", sub: "Radio Fuorigioco 99.9 vs Specchio Sporting Club", big: true, cls: "hot", fn: playFinale },
          { label: "📻 Apri il Sintonizzatore AM/FM", sub: `Cartoline QSL trovate: ${K.radio.tagCount("qsl")}/6`, fn: () => K.radio.open(() => talk.rf_nilde(), true) },
          { label: "◂ Ancora un istante", fn: done }
        ], "rf_stadio");
      }
    };

    const zones = {
      rf_stadio: {
        region: "stadio",
        name: "Stadio Comunale del Molo Vecchio",
        short: "Stadio Molo Vecchio",
        sub: "Gradinate in pietra del '58, ruspe ferme ai cancelli e la Rondine Rossa dietro la rete",
        bg: "rf_stadio",
        w: 38,
        h: 26,
        base: ",",
        start: [6, 13],
        travel: [6, 13],
        items: [[9, 14], [19, 9], [32, 14]],
        areas: [
          [3, 3, 10, 9, "Spogliatoi del '58"],
          [11, 3, 26, 7, "Gradinata Storica Mare"],
          [12, 12, 25, 19, "Prato del Molo Vecchio"],
          [28, 3, 35, 9, "Torretta del Cronista"]
        ],
        chests: { "35,18": { coins: 40, text: "La vecchia cassetta metallica degli incassi domenicali dello stadio." } },
        signals: [
          {
            id: "qsl_6",
            freq: 103.6,
            at: [19, 6],
            radius: 14,
            tol: 1.2,
            tag: "qsl",
            lore: "qsl_6",
            title: "103.6 MHz · Cartolina QSL #6 (Gradinata del '58)",
            lines: [
              ["voce", "Sui 103.6 MHz trenta radioline tascabili sulla gradinata rispondono in coro: «Dal primo all'ultimo scalino di pietra, il Molo Vecchio batte coi 99.9!»"]
            ],
            onTune(K2, first) { if (first) K2.bond("sintonia", 1); K2.done(); }
          }
        ],
        flavor: {
          J: "Una ruspa gialla del Consorzio Costa Nuova parcheggiata davanti ai cancelli: oggi non sposterà nemmeno un sasso.",
          A: "Ponte radio issato fino alla balaustra della Torretta del Cronista.",
          P: "Torre faro storica dello Stadio del Molo Vecchio."
        },
        npcs: () => [
          { id: "rf_specchio", at: [16, 8] },
          { id: "rf_nilde", at: [19, 15] },
          { id: "rf_lupo", at: [13, 10] },
          { id: "rf_wanda", at: [23, 10] }
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 37, 0, "f"); lay(0, 0, 0, 22, "f"); lay(37, 0, 37, 22, "f");
          lay(0, 23, 37, 25, "w");
          lay(11, 3, 26, 4, "j");
          lay(12, 12, 25, 19, "-");
          put(12, 15, "g"); put(25, 15, "g");
          lay(6, 9, 31, 10, ":");
          house(3, 4, 7, 5, { door: [6, 8], roof: "#7f1d1d", wall: "#e2e8f0", enter: { to: "rf_spogliatoio", at: [10, 10] } });
          house(28, 4, 7, 5, { door: [31, 8], roof: "#334155", wall: "#cbd5e1", enter: { to: "rf_torretta", at: [10, 10] } });
          put(4, 18, "J"); put(5, 18, "J");
          put(11, 11, "P"); put(26, 11, "P"); put(11, 20, "P"); put(26, 20, "P");
          put(35, 9, "A"); put(8, 20, "s"); put(35, 18, "x");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "SPOGLIATOI '58", d.X(6) + 8, d.Y(4) - 6, "#fca5a5");
          H.plaque(g, "STADIO DEL MOLO VECCHIO", d.X(18) + 16, d.Y(3) - 6, "#fde68a");
          H.plaque(g, "TORRETTA CRONISTA", d.X(31) + 8, d.Y(4) - 6, "#bae6fd");
        }
      },

      rf_spogliatoio: {
        interior: true,
        region: "studio",
        name: "Spogliatoio di Calce Bianca del '58",
        short: "Spogliatoio '58",
        sub: "Panche di legno, lavagna di ardesia e maglie di lana pesante",
        bg: "rf_spogliatoio",
        w: 20,
        h: 13,
        base: "+",
        start: [10, 10],
        outside: ["rf_stadio", 6, 9],
        items: [[8, 8], [12, 8]],
        chests: { "3,9": { coins: 25, text: "Nell'armadietto del massaggiatore: rotoli di bende pulite e monete portafortuna." } },
        flavor: {
          D: "Armadietti verdi con i numeri dipinti a pennello dal 1 all'11.",
          b: "Panca liscia su cui si sono allacciati gli scarpini tre generazioni del Borgo.",
          n: "Sulla lavagna a gessetto: «Palla rasoterra, orecchio al vinile e cuore oltre i frangiflutti!»",
          R: "Radiolina da campo che ripete in diretta il riscaldamento dagli spalti."
        },
        npcs: () => [{ id: "rf_tullio", at: [8, 5] }, { id: "rf_valvola", at: [12, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a"); lay(0, 12, 19, 12, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a");
          put(10, 12, "v");
          put(5, 1, "W"); put(14, 1, "W");
          put(10, 2, "n");
          [[3, 3], [6, 3], [13, 3], [16, 3]].forEach(([x, y]) => put(x, y, "D"));
          [[5, 6], [6, 6], [13, 6], [14, 6]].forEach(([x, y]) => put(x, y, "b"));
          put(17, 8, "R"); put(3, 9, "x");
        }
      },

      rf_torretta: {
        interior: true,
        region: "porto",
        name: "Torretta del Cronista",
        short: "Torretta Cronista",
        sub: "Vetrata panoramica sul campo e sul mare, microfono a nastro e sigilli",
        bg: "rf_torretta",
        w: 20,
        h: 13,
        base: "=",
        start: [10, 10],
        outside: ["rf_stadio", 31, 9],
        items: [[6, 8], [14, 8]],
        flavor: {
          M: "Postazione storica di radiocronaca: da qui nel '58 raccontavano i gol col rumore delle onde in sottofondo.",
          R: "Lettore portatile a bobina collegato alle cuffie chiuse.",
          K: "Quadro degli altoparlanti a tromba delle gradinate.",
          W: "Dalla vetrata si abbraccia tutto il prato verde e, subito dietro la rete, il fumaiolo rosso della Rondine Rossa."
        },
        npcs: () => [{ id: "rf_valli", at: [10, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a"); lay(0, 12, 19, 12, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a");
          put(10, 12, "v");
          put(5, 1, "W"); put(10, 1, "W"); put(14, 1, "W");
          put(9, 4, "M"); put(10, 4, "M");
          put(6, 4, "R"); put(13, 4, "K");
          put(16, 5, "A"); put(4, 8, "b");
        }
      }
    };

    return {
      n: N,
      title: "Frequenza Libera",
      sub: "La Rondine Rossa entra in porto per l'ultima partita al Molo Vecchio",
      start: "rf_stadio",
      introBg: "rf_stadio",
      goal,
      intro: () => [
        ["voce", "<b>CAPITOLO 4 · DOMENICA POMERIGGIO, STADIO DEL MOLO VECCHIO</b><br>Sfidando ogni divieto, la Rondine Rossa ha attraversato le dodici miglia e ha gettato l'ancora proprio dietro la porta lato mare dello Stadio!"],
        ["rf_specchio", "«È uno scandalo inaudito! Ispettore Valli, sequestri immediatamente quella bagnarola e faccia sgomberare la tribuna!»"],
        ["voce", "Affronta il <b>Commendator Specchio</b> davanti al notaio usando le prove del tuo <b>Dossier</b>."]
      ],
      zones,
      talk,
      news: (id, s) => (s === 0 && id === "rf_specchio") || (s === 1 && id === "rf_valli") || (s === 2 && id === "rf_nilde")
    };
    });
  }
  boot();
})();
