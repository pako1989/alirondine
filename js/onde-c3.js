// js/onde-c3.js — CAPITOLO 3 · «L'Ultimo Supplementare di Mezzanotte»
// Zone: Ponte di Prua nella Burrasca (32x24), Sala Macchine e Caldaia Diesel (20x13), Archivio Segreto delle Bobine (20x13).
(function () {
  "use strict";
  function boot() {
    const E = window.__ondeCore;
    if (!E || !E.api || !E.api.addChapter || !window.__ondeH) return setTimeout(boot, 80);
    E.api.addChapter((K) => {
    const N = 3, F = K.F, S = () => K.stepOf(N), { setStep, quest, questDone } = K;
    const H = window.__ondeH(K), { say, done, ask, wask } = H;

    const goal = (s) => ({
      0: "Scendi nella Sala Macchine (boccaporto ovest) e aiuta Tullio a stabilizzare il generatore nella burrasca.",
      1: "Entra nell'Archivio Segreto delle Bobine (boccaporto est) con Nilde.",
      2: "Usa il Sintonizzatore AM/FM (📻) sui 101.8 MHz davanti al banco magnetico dell'Archivio per decifrare l'ultima registrazione.",
      3: "Torna sul Ponte di Prua e affronta la Rappresentativa Guardiacoste sotto i riflettori nella tempesta."
    }[s] || "Capitolo 3 concluso.");

    function fin() {
      F.set("rf_c3_done", true);
      const msg = K.reward("onde_c3", { coins: 95, cos: "rf_cuffie" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["rf_lupo", "Vittoria sul ponte bagnato! I marinai della Guardiacoste ci salutano col fischio di sirena mentre la burrasca si apre verso l'alba!"],
        ["rf_nilde", "Stringi forte la Bobina 000 e il Registro del Geometra, {n}. Domani è domenica: portiamo la Rondine Rossa dritta dentro il porto vecchio, davanti ai cancelli dello Stadio!"],
        ["rf_tullio", "Motori avanti tutta! Cascasse il mondo, Capitan Libeccio farà il suo ultimo ingresso al Molo Vecchio!"],
        ["voce", `<b>FINE DEL CAPITOLO 3 · «L'Ultimo Supplementare di Mezzanotte»</b>${msg.length ? "<br>🎁 " + msg.join(" · ") : ""}<br>🎙️ Verità ${K.stat("verita")} · 📼 Mito ${K.stat("mito")} · Cartoline QSL ${K.radio.tagCount("qsl")}/6`]
      ]), () => K.openMain(), "rf_ponte");
    }

    function playC3() {
      H.playUrto({
        title: "Cap. 3 · Ponte nella Burrasca",
        us: "Equipaggio 99.9",
        opp: "Guardiacoste Golfo",
        oppColor: "#0284c7",
        oppStyle: "contropiede",
        venue: "ponte",
        track: "rock",
        mateName: "Nilde",
        staticCount: 3,
        halfSec: 23
      }, (r) => {
        if (r && r.win) {
          setStep(N, 4);
          K.bond("libero", 1);
          fin();
        } else {
          say("rf_lupo", "Con gli spruzzi sul ponte bisogna far viaggiare la palla di prima sul battito del rullante! Riproviamo subito!");
          done();
        }
      });
    }

    const talk = {
      rf_tullio() {
        const s = S();
        if (s === 0) {
          say("rf_tullio", "Reggiti al corrimano, {n}! Un'onda di traverso ha fatto saltare il giunto della dinamo e ha spalancato la paratia stagna di poppa, quella di cui solo Nilde aveva la chiave!");
          say("rf_tullio", "Ecco fatto: ho stretto i bulloni del cilindro tre e la corrente a 220 volt è tornata stabile. Ma Nilde è scesa pallida come un cencio nell'Archivio Segreto delle Bobine, dal boccaporto est sul ponte: raggiungila subito!");
          setStep(N, 1);
          quest("c3_archivio", "La Cabina Chiusa", "Torna sul Ponte di Prua ed entra nel boccaporto est verso l'Archivio delle Bobine.");
          return done();
        }
        say("rf_tullio", "Per settecento notti ho tenuto oliato il Revox dell'archivio senza fare domande. Adesso Nilde non è più sola a portare quel peso.");
        done();
      },
      rf_wanda() {
        say("rf_wanda", "Sono salita col rimorchiatore di rifornimento un minuto prima che chiudessero la diga foranea! Sul ponte centrale puoi anche captare i 90.4 MHz del Libeccio II per una Cartolina QSL.");
        done();
      },
      rf_lupo() {
        const s = S();
        if (s === 3) {
          say("rf_lupo", "La motovedetta della Guardiacoste si è affiancata sottobordo per controllare le cime… e il loro nostromo ci ha sfidati sul ponte illuminato dai fari! Parla con Nilde per dare il calcio d'inizio!");
          return done();
        }
        say("rf_lupo", "Mille e novantacinque bobine… tre anni di notti incise una per una. Solo un numero dieci come Cesare poteva inventarsi un passaggio lungo nel futuro così.");
        done();
      },
      rf_nilde() {
        const s = S();
        if (s === 0) {
          say("rf_nilde", "Il vento sta strappando i tiranti dell'antenna, {n}! Corri prima in Sala Macchine dal boccaporto a sinistra per dare una mano a Tullio col generatore!");
          return done();
        }
        if (s === 1 && K.inZone("rf_bobine")) {
          say("rf_nilde", "Guarda queste pareti, {n}… mille e novantacinque scatole numerate. Nessuno in città lo sapeva, nemmeno Lupo o Wanda.");
          say("rf_nilde", "Papà — Cesare «Capitan Libeccio» — se n'è andato in silenzio due inverni fa. Negli ultimi mesi, quando il fiato gli bastava appena per un tempo, si chiudeva qui ogni pomeriggio a registrare una puntata per ogni singola mezzanotte futura, perché il Borgo non si sentisse mai solo.");
          say("rf_nilde", "Stanotte finisce l'ultima bobina dello scaffale… ma sotto la sua maglia numero 10 c'è un nastro smagnetizzato dall'acqua salata: «Bobina 000 · Per Aristide». Avvicinati al banco magnetico e sintonizza i 101.8 MHz col Sintonizzatore AM/FM (📻) per filtrare il fruscio!");
          setStep(N, 2);
          quest("c3_bobina", "Banco Magnetico 101.8", "Usa il Sintonizzatore AM/FM (📻) sui 101.8 MHz davanti al banco nell'Archivio delle Bobine.");
          return done();
        }
        if (s === 2 && K.inZone("rf_bobine")) {
          say("rf_nilde", "Apri il Sintonizzatore AM/FM (📻) qui davanti al banco centrale e porta la frequenza su 101.8 MHz per decodificare il nastro umido di papà!");
          return done();
        }
        if (s === 3 && K.inZone("rf_ponte")) {
          say("rf_nilde", "La tempesta sta calando e l'equipaggio della Guardiacoste è salito sul ponte per assicurarsi che lo scafo regga… ma hanno portato un pallone di cuoio ingrassato! Scaldiamoci i muscoli prima dell'alba!");
          return ask("Sfida di mezzanotte sul Ponte della Rondine Rossa:", [
            { label: "💿 Gioca sul Ponte nella Burrasca", sub: "Equipaggio 99.9 vs Guardiacoste del Golfo", big: true, cls: "hot", fn: playC3 },
            { label: "🗂️ Controlla il Dossier completo", sub: "Tutte e 4 le prove sull'Appalto sono pronte da collegare!", fn: () => K.dossier.open("appalto", () => talk.rf_nilde(), true) },
            { label: "◂ Un respiro sul ponte", fn: done }
          ], "rf_ponte");
        }
        say("rf_nilde", "Comunque vada domani mattina ai cancelli dello Stadio, la voce di questa barca non si spegnerà.");
        done();
      }
    };

    function afterBobinaChoice(truth) {
      F.set("rf_c3_verita", truth);
      setStep(N, 3);
      K.questDone("c3_bobina");
      quest("c3_match", "Partita nella Tempesta", "Torna sul Ponte di Prua e parla con Nilde per la sfida contro la Guardiacoste.");
      K.say([
        ["rf_nilde", truth
          ? "Mi tremano le mani sul cursore… ma senti fuori dall'oblò? Tutte le sirene dei pescherecci nel golfo stanno suonando insieme per salutare papà! Grazie di avermi dato il coraggio di dirlo, {n}."
          : "La voce di papà scorre calda sui 99.9 MHz mentre la tempesta batte sulle paratie… diamo al Borgo un'ultima notte senza lacrime prima della battaglia di domani allo Stadio."],
        ["voce", "Hai recuperato anche il <b>Registro Contabile del Geometra</b> col collaudo sano dei piloni! Ora puoi collegare tutte le contraddizioni nel <b>Dossier</b> e salire sul Ponte."]
      ], K.done);
    }

    const zones = {
      rf_ponte: {
        region: "nave",
        name: "Ponte di Prua · Burrasca di Libeccio",
        short: "Ponte nella Burrasca",
        sub: "Onde forza sette, cime tese e il traliccio dei 99.9 MHz nel vento",
        bg: "rf_ponte",
        w: 32,
        h: 24,
        base: ":",
        start: [16, 15],
        travel: [16, 15],
        items: [[10, 14], [22, 14], [16, 9]],
        areas: [
          [5, 4, 12, 9, "Boccaporto Sala Macchine"],
          [19, 4, 26, 9, "Boccaporto Archivio"],
          [4, 10, 27, 19, "Ponte Centrale di Prua"]
        ],
        chests: { "26,8": { coins: 35, text: "Una cassetta stagna di razzi di segnalazione e monete della cassa di bordo." } },
        doors: {
          "8,6": { to: "rf_macchine", at: [10, 10] },
          "23,6": {
            to: "rf_bobine",
            at: [10, 10],
            locked: () => (S() < 1 ? "La serratura elettromagnetica della paratia di poppa è senza tensione: scendi prima in Sala Macchine (boccaporto ovest) da Tullio!" : false)
          }
        },
        signals: [
          {
            id: "qsl_5",
            freq: 90.4,
            at: [16, 6],
            radius: 14,
            tol: 1.2,
            tag: "qsl",
            lore: "qsl_5",
            title: "90.4 MHz · Cartolina QSL #5 (Rimorchiatore Libeccio II)",
            lines: [
              ["voce", "Sui 90.4 MHz risponde nella tempesta il capitano del rimorchiatore gemello Libeccio II: «Tenete la prua al vento ragazzi dei 99.9, Cesare vi guarda dalla plancia!»"]
            ],
            onTune(K2, first) { if (first) K2.bond("sintonia", 1); K2.done(); }
          }
        ],
        flavor: {
          A: "Il pennone maestro della Rondine Rossa vibra come una corda di basso sotto le raffiche.",
          P: "Faro di coperta anti-salsedine puntato sulle tavole bagnate.",
          S: "Bitta di prua con triplo giro di cima catramata."
        },
        npcs(s) {
          const list = [{ id: "rf_lupo", at: [12, 11] }, { id: "rf_wanda", at: [14, 16] }];
          if (s === 0 || s >= 3) list.push({ id: "rf_nilde", at: [19, 11] });
          return list;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 2, "w"); lay(0, 21, 31, 23, "w"); lay(0, 0, 2, 23, "w"); lay(29, 0, 31, 23, "w");
          lay(3, 3, 28, 3, "f"); lay(3, 20, 28, 20, "f"); lay(3, 3, 3, 20, "f"); lay(28, 3, 28, 20, "f");
          lay(7, 5, 9, 6, "a"); put(8, 6, "q");
          lay(22, 5, 24, 6, "a"); put(23, 6, "q");
          put(16, 5, "A");
          put(6, 12, "P"); put(25, 12, "P");
          put(6, 18, "S"); put(25, 18, "S");
          put(16, 18, "s"); put(26, 8, "x");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "▾ SALA MACCHINE", d.X(8) + 8, d.Y(5) - 6, "#fb923c");
          H.plaque(g, "▾ ARCHIVIO BOBINE", d.X(23) + 8, d.Y(5) - 6, "#fde68a");
        }
      },

      rf_macchine: {
        interior: true,
        region: "porto",
        name: "Sala Macchine & Caldaia Diesel",
        short: "Sala Macchine",
        sub: "Pistoni fumanti, manometri d'ottone e profumo di nafta calda",
        bg: "rf_macchine",
        w: 20,
        h: 13,
        base: "+",
        start: [10, 10],
        outside: ["rf_ponte", 8, 7],
        items: [[7, 8], [13, 8]],
        chests: { "17,10": { coins: 25, text: "Una cassetta di guarnizioni in rame e monete conservate da Tullio." } },
        loot: {
          "4,8": {
            id: "rf_chiave",
            text: "Appesa al banco da lavoro trovi la storica Chiave Inglese del Cantiere Vecchio!",
            empty: "Sul banco restano solo stracci puliti e bulloni da sedici."
          }
        },
        flavor: {
          G: "Il grande motore marino a sei cilindri batte regolare come un cuore sotto sforzo.",
          R: "Quadro amperometrico delle valvole: l'ago segna finalmente tensione piena."
        },
        npcs: () => [{ id: "rf_tullio", at: [10, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a"); lay(0, 12, 19, 12, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a");
          put(10, 12, "v");
          [[5, 4], [9, 4], [14, 4]].forEach(([x, y]) => put(x, y, "G"));
          put(4, 8, "T"); put(16, 6, "R"); put(17, 10, "x");
        }
      },

      rf_bobine: {
        interior: true,
        region: "archivio",
        name: "Archivio Segreto delle 1.095 Bobine",
        short: "Archivio Bobine",
        sub: "Tre anni di mezzanotti incise da Capitan Libeccio e una maglia numero 10",
        bg: "rf_bobine",
        w: 20,
        h: 13,
        base: "=",
        start: [10, 10],
        outside: ["rf_ponte", 23, 7],
        items: [[6, 8], [13, 8]],
        loot: {
          "16,7": {
            id: "rf_nastro",
            text: "In un astuccio di bachelite trovi il Nastro Magnetico di Giunzione azzurro di Cesare!",
            empty: "L'astuccio del montatore è vuoto."
          }
        },
        signals: [
          {
            id: "banco_bobine",
            freq: 101.8,
            at: [10, 5],
            radius: 14,
            tol: 1.2,
            flag: "rf_bobina_000",
            dossier: ["appalto", "registro_geometra"],
            title: "101.8 MHz · Decodifica Magnetica «Bobina 000»",
            lines: [
              ["voce", "Allineando l'oscillatore di pulizia sui <b>101.8 MHz</b>, il fruscio svanisce e risuona la voce roca e gentile di Cesare «Capitan Libeccio» Marini:"],
              ["rf_cesare", "«Se state ascoltando questa Bobina Zero, vuol dire che il vecchio numero dieci ha finito i tempi regolamentari. Nella busta qui sotto c'è il Registro di collaudo originale dello Stadio: i piloni di granito sono sani come scogli.»"],
              ["rf_cesare", "«E per te, Aristide Valli… in quello spareggio del '58 non vendetti mai la partita. Giocai col ginocchio rotto per pagare la clinica a mia moglie. Perdonami se per vent'anni non ho avuto il fiato di dirtelo.»"]
            ],
            onTune(K2) {
              if (K2.stepOf(3) >= 3) return K2.done();
              K2.clock.advance(1);
              K2.weight.ask("rf_nilde", "Mancano cinque minuti a mezzanotte, l'ora de «L'Ultimo Supplementare». Cosa trasmetti al Borgo?", [
                {
                  label: "🎙️ Rivela in diretta al Borgo la verità su Capitan Libeccio",
                  sub: "Chiama tutto il quartiere ai cancelli dello Stadio con la voce di Nilde",
                  big: true,
                  cls: "hot",
                  w: { verita: 3, libero: 1 },
                  fn: () => { K2.rel.add("rf_nilde", 3); afterBobinaChoice(true); }
                },
                {
                  label: "📼 Manda in onda la penultima bobina registrata (#1.094)",
                  sub: "Proteggi ancora per stanotte la leggenda immortale di Capitan Libeccio",
                  big: true,
                  w: { mito: 3, prudenza: 1 },
                  fn: () => { K2.rel.add("rf_lupo", 2); afterBobinaChoice(false); }
                }
              ], "rf_bobine");
            }
          }
        ],
        flavor: {
          V: "File ordinate di nastri magnetici numerati a mano da 001 a 1.095 con la grafia inclinata di Cesare.",
          M: "Registratore a bobine Revox collegato a un filtro di pulizia sui 101.8 MHz.",
          n: "La maglia amaranto numero 10 del Molo Vecchio 1958: sul tessuto sono appuntati due numeri di panno bianco, 9 · 9, come la frequenza della radio."
        },
        npcs(s) {
          return s >= 1 && s < 3 ? [{ id: "rf_nilde", at: [8, 6] }] : [];
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a"); lay(0, 12, 19, 12, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a");
          put(10, 12, "v");
          lay(7, 6, 12, 8, '"');
          put(10, 2, "n");
          [[3, 3], [6, 3], [13, 3], [16, 3], [3, 7], [16, 7]].forEach(([x, y]) => put(x, y, "V"));
          put(9, 4, "M"); put(10, 4, "M");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "MAGLIA N° 10 · 1958", d.X(10) + 8, d.Y(2) - 4, "#fde68a");
        }
      }
    };

    return {
      n: N,
      title: "L'Ultimo Supplementare di Mezzanotte",
      sub: "Tempesta sul golfo e il segreto delle 1.095 bobine",
      start: "rf_ponte",
      introBg: "rf_ponte",
      goal,
      intro: () => [
        ["voce", "<b>CAPITOLO 3 · NOTTE DI BURRASCA A DODICI MIGLIA DALLA COSTA</b><br>Onde alte quattro metri spazzano la prua della Rondine Rossa mentre il vento di libeccio fa fischiare i tiranti dell'antenna."],
        ["rf_tullio", "«Tenete duro ragazzi! Un colpo di mare ha fatto saltare il giunto della dinamo e si è aperta la paratia chiusa di poppa!»"],
        ["voce", "Scendi subito nella <b>Sala Macchine</b> dal boccaporto sinistro per aiutare Tullio."]
      ],
      zones,
      talk,
      news: (id, s) => (s === 0 && id === "rf_tullio") || ((s === 1 || s === 2 || s === 3) && id === "rf_nilde")
    };
    });
  }
  boot();
})();
