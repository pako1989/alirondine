// js/mondiale-c3.js - «MONDIALE GIOVANILE» · Capitolo 3: Ghiaccio e Acciaio
// Il Nord sotto la neve: la stazione, l'officina di Lukas, l'hotel di Mara, il campo di allenamento tedesco con le guardie di ronda (furtività: cumuli di neve per nascondersi) e lo stadio.
(function () {
  "use strict";
  function boot() {
    const E = window.__mgCore;
    if (!E || !E.api || !E.api.addChapter || !window.__mgH || !window.__catena) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__mgH(K), { say, done } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    H.cast("mg_wolff", "Trainer Wolff", "CT della Germania", { style: "short", hair: "#9ca3af", beard: "baffi", shirt: "#111827", skin: "#f1c8a0", bg: ["#111827", "#d1d5db"] }, "Il CT della Germania U16. Parla poco, annota tutto e dice «gut» quando qualcosa gli piace davvero.");
    ["mg_wache1", "mg_wache2", "mg_wache3"].forEach((id, i) => H.cast(id, "Addetto", "Del campo tedesco", { style: "buzz", hair: "#6b7280", shirt: "#111827", skin: "#f1c8a0", bg: ["#111827", "#9ca3af"] }, "Un addetto alla sicurezza del campo. Ha un fischietto e un orario."));
    K.cos("mg_c3", { kind: "shirt", label: "Maglia del Nord", val: "#e5e7eb", from: "Capitolo 3 di Mondiale Giovanile" });
    K.lore("l_nord", { t: "Il calcio del Nord", d: "Qui il calcio è un lavoro di squadra come una fabbrica: ogni pezzo al suo posto, ogni errore una vite stretta male." });
    const goal = (s) => ({
      0: "Parla con la Dottoressa Mara, alla stazione: qualcosa è sparito.",
      1: "Trova Lukas all'officina (a ovest, casa con le biciclette).",
      2: "Il tablet è nel campo di allenamento tedesco, a est. Recuperalo di nascosto (armadietto a nord-est) o sfida Herr Falk.",
      3: "Porta il tablet alla Dottoressa Mara, all'hotel.",
      4: "Lo stadio è aperto (a est del campo di allenamento): parla con Trainer Wolff."
    }[s] || "Il capitolo 3 è concluso.");
    const names = () => K.crew.field().map((id) => K.crew.members[id].n.split(" ")[0]);
    function fin(win) {
      F.set("mg_c3_done", true);
      K.reward("mg_c3", { coins: win ? 150 : 90, cos: "mg_c3" }); setStep(N, 5);
      K.finishChapter(N, win ? "ok" : "ko");
      K.scene(H.flush().concat([["voce", `<b>FINE DEL CAPITOLO 3.</b><br>🔥 Grinta ${K.stat("grinta")} · 🤝 Intesa ${K.stat("intesa")} · Squadra ${K.crew.count()}/${K.crew.total} · Catene perfette ${K.chain.perfect()}`], ["voce", "Il Capitolo 4, «La Finale di Tokyo», vi aspetta."]]), () => K.openMain(), "mg_neve");
    }
    const lost = () => K.ask("voce", "Partita persa (o abbandonata). La storia non va avanti con una sconfitta: vuoi riprovare?", [{ label: "Riprova la partita", cls: "hot", fn: () => match() }, { label: "Più tardi", fn: K.done }]);
    function match() {
      K.say(H.flush(), () => K.playMatch({
        id: "mg_nord", alt: "az,cage,hd", force: false, squad: names().slice(0, 3), mate: names()[0] || "Elio", us: "Italia U16", oppTeam: "Germania U16", oppColor: "#111827", homeKit: ["#1d4ed8", "#f8fafc"],
        oppNames: ["Jonas", "Felix", "Max", "Moritz"], intro: "Stadio del Nord · Semifinale: Italia contro Germania. Neve sul campo, vapore dalle bocche.", done: (r) => (r.win ? fin(true) : lost())
      }));
    }
    function recover(how) {
      if (K.inv.has("mg_tablet")) { say("voce", "Hai già il tablet."); return done(); }
      K.inv.give("mg_tablet"); F.set("mg_tablet_how", how); setStep(N, 3); quest("mg_c3", "Mondiale Giovanile", "Porta il tablet alla Dottoressa Mara, all'hotel.");
      say("voce", "Ottieni il <b>Tablet tattico</b>."); return done();
    }
    const guards = (a, b) => S() === 2 && !F.is("mg_c3_calm") ? [{ id: "mg_wache1", at: [4, 5], route: [[4, 5], [4, 18]], speed: 0.5, guard: { range: 5, cone: 0.55 } }, { id: "mg_wache2", at: [3, 20], route: [[3, 20], [30, 20]], speed: 0.5, guard: { range: 5, cone: 0.55 } }, { id: "mg_wache3", at: [6, 4], route: [[6, 4], [27, 4]], speed: 0.45, guard: { range: 5, cone: 0.55 } }] : [];
    const zones = {
      mg_stazione: {
        region: "neve", name: "La stazione del Nord", short: "Stazione", sub: "Neve che cade piano, una pensilina e un treno puntualissimo", bg: "mg_neve", time: "giorno", w: 34, h: 22, base: "n", start: [2, 11], sneakStart: [2, 11],
        itemCos: "mg_c3", items: [[5, 9], [22, 13], [10, 14], [29, 9]],
        areas: [[2, 2, 31, 5, "Le case del centro"], [0, 16, 33, 19, "I binari"], [0, 0, 33, 21, "La stazione del Nord"]],
        act: { W: "Guarda la casa", A: "Guarda il pino", C: "Leggi il cartellone", L: "Guarda il lampione", M: "Guarda il muretto", V: "Guarda il treno", R: "Guarda il pupazzo di neve", B: "Siediti in panchina", N: "Guarda la valigia" },
        flavor: { W: "Una casa a graticcio con un tetto così carico di neve che sembra un panettone.", A: "Un pino con più ghiaccioli che aghi.", C: "«Treni puntuali, speranze no.»", L: "Un lampione col cappello di neve.", M: "Un muretto che divide la piazza dal marciapiede e le conversazioni dai silenzi.", V: "Un treno a due piani: blu, perfetto, con una locomotiva che sembra ridere.", R: "Un pupazzo di neve con una sciarpa dell'Italia (qualcuno è arrivato prima di noi).", B: "Una panchina con un cuscino di neve fresca.", N: "Una valigia con l'etichetta di un albergo del Nord." },
        objects: {},
        doors: { "5,5": { to: "mg_officina", at: [8, 8] }, "15,5": { to: "mg_hotel", at: [9, 9] }, "33,11": { to: "mg_allenamento", at: [1, 11] } },
        npcs: () => (S() < 3 ? [{ id: "mg_mara", at: [14, 9], face: "down" }] : []).concat([{ id: "mg_gallo", at: [17, 9], face: "left" }]),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 21, "n"); lay(0, 0, 33, 1, "A"); lay(2, 2, 9, 5, "W"); lay(12, 2, 19, 5, "W"); lay(24, 2, 31, 5, "W"); put(5, 5, "q"); put(15, 5, "q"); lay(4, 6, 6, 7, "g"); lay(14, 6, 16, 7, "g");
          lay(0, 8, 33, 8, "g"); lay(0, 15, 33, 15, "g"); lay(0, 16, 33, 19, "g"); lay(4, 17, 28, 18, "V"); lay(0, 20, 33, 21, "A");
          put(10, 7, "L"); put(21, 7, "L"); put(7, 14, "L"); put(25, 14, "L"); put(12, 11, "C"); lay(26, 11, 28, 11, "M"); put(20, 12, "R"); put(3, 14, "B"); put(31, 14, "B"); put(8, 13, "N");
          [[1, 6], [32, 7], [1, 13], [32, 13], [22, 10], [10, 10], [30, 12]].forEach(([x, y]) => put(x, y, "A")); put(33, 11, "q"); lay(32, 10, 32, 12, "g");
        },
        decor(g, cx, cy, d) { H.plaque(g, "OFFICINA BRANDT", d.X(5) + 8, d.Y(5) + 4, "#fde68a"); H.plaque(g, "HOTEL AURORA", d.X(15) + 8, d.Y(5) + 4, "#bfdbfe"); H.plaque(g, "HAUPTBAHNHOF", d.X(16) + 8, d.Y(16) + 4, "#fde047"); }
      },
      mg_allenamento: {
        region: "neve", name: "Il campo di allenamento tedesco", short: "Allenamento", sub: "Un prato ripulito dalla neve, addetti di ronda e un capanno con gli armadietti", bg: "mg_neve", time: "giorno", w: 34, h: 22, base: "n", start: [2, 11], sneakStart: [2, 11], hide: "h",
        itemCos: "mg_c3", items: [[4, 7], [10, 19], [24, 19], [31, 15]],
        areas: [[6, 6, 27, 16, "Il campo"], [27, 2, 33, 7, "Il capanno"], [0, 0, 33, 21, "Il campo di allenamento tedesco"]],
        act: { W: "Guarda il capanno", A: "Guarda il pino", G: "Guarda la porta", B: "Siediti in panchina", C: "Leggi il cartellone", L: "Guarda il riflettore", M: "Guarda la recinzione", K: "Apri l'armadietto", N: "Guarda il borsone" },
        flavor: { W: "Un capanno di legno e ferro: dentro, gli attrezzi; fuori, un cartello «Betreten verboten» (che vuol dire: non entrare).", A: "Un pino dritto come una guardia.", G: "Una porta con la rete tesa al millimetro.", B: "Una panchina di ferro con scaldino elettrico: ma il Nord è tutta un'altra cosa.", C: "«Disciplina, tempismo, pausa caffè.»", L: "Un riflettore che illumina ogni zolla.", M: "Una recinzione con un lucchetto e un cartello.", N: "Un borsone con tuta, guanti e due panini. Non si tocca." },
        objects: {
          "30,6": () => recover("furtivo")
        },
        doors: { "0,11": { to: "mg_stazione", at: [32, 11] }, "33,11": { to: "mg_stadio_nord", at: [1, 11], locked: () => (S() >= 4 ? false : "Lo stadio è chiuso fino alla fine di questa faccenda.") } },
        npcs: () => [{ id: "mg_falk", at: [27, 8], face: "left" }].concat(guards()),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 21, "n"); lay(0, 0, 33, 1, "A"); lay(6, 6, 27, 16, "e"); lay(6, 6, 27, 6, "l"); lay(6, 16, 27, 16, "l"); lay(6, 7, 6, 15, "j"); lay(27, 7, 27, 15, "j"); lay(16, 7, 16, 15, "j"); put(6, 6, "x"); put(27, 6, "x"); put(6, 16, "x"); put(27, 16, "x");
          put(5, 11, "G"); put(5, 12, "G"); put(28, 11, "G"); put(28, 12, "G"); lay(28, 2, 32, 5, "W"); put(30, 6, "K"); put(31, 6, "N"); lay(29, 8, 31, 8, "M"); put(33, 11, "q"); put(0, 11, "q"); lay(1, 10, 3, 12, "g"); lay(30, 10, 32, 12, "g");
          [[3, 9], [8, 18], [20, 18], [28, 18], [2, 14], [13, 4], [24, 4], [31, 17]].forEach(([x, y]) => put(x, y, "h"));
          put(8, 5, "L"); put(25, 5, "L"); put(8, 17, "L"); put(25, 17, "L"); put(12, 17, "B"); put(14, 17, "B"); lay(18, 5, 22, 5, "C");
          [[2, 5], [32, 14], [2, 19], [33, 20], [1, 15]].forEach(([x, y]) => put(x, y, "A"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "TRAININGSPLATZ", d.X(16) + 8, d.Y(5) + 4, "#e5e7eb"); H.plaque(g, "GERÄTE", d.X(30) + 8, d.Y(2) + 4, "#fde047"); }
      },
      mg_stadio_nord: {
        region: "neve", name: "Lo stadio del Nord", short: "Stadio", sub: "Spalti coperti di brina, vapore e un tabellone che non sbaglia mai", bg: "mg_stadio", time: "giorno", w: 32, h: 22, base: "n", start: [2, 11], sneakStart: [2, 11],
        itemCos: "mg_c3", items: [[3, 7], [29, 10], [15, 20], [2, 18]],
        areas: [[2, 2, 29, 5, "Le tribune"], [6, 8, 26, 18, "Il campo"], [0, 0, 31, 21, "Lo stadio del Nord"]],
        act: { T: "Guarda la tribuna", G: "Guarda la porta", B: "Siediti in panchina", C: "Leggi il cartellone", L: "Guarda il riflettore", A: "Guarda il pino", N: "Guarda il borsone", M: "Guarda la recinzione" },
        flavor: { T: "Una tribuna coperta di brina: ogni gradino ha un cuscino per i fedelissimi.", G: "Una porta con rete d'acciaio: dicono che la neve non ci passi.", B: "Una panchina riscaldata con la scritta «Ordine».", C: "«Disziplin. Zusammenhalt. Sieg.»", L: "Un riflettore che trasforma ogni fiocco in una stella.", A: "Un pino innevato, con un nido vuoto.", N: "Un borsone con una sciarpa e un thermos.", M: "Una recinzione di ferro nero, con la brina sopra." },
        objects: {},
        doors: { "0,11": { to: "mg_allenamento", at: [32, 11] } },
        npcs: () => [{ id: "mg_wolff", at: [16, 6], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "n"); lay(2, 2, 29, 5, "T"); lay(0, 0, 31, 1, "A");
          lay(6, 8, 26, 18, "e"); lay(6, 8, 26, 8, "l"); lay(6, 18, 26, 18, "l"); lay(6, 9, 6, 17, "j"); lay(26, 9, 26, 17, "j"); lay(16, 9, 16, 17, "j"); put(6, 8, "x"); put(26, 8, "x"); put(6, 18, "x"); put(26, 18, "x");
          put(5, 12, "G"); put(5, 13, "G"); put(27, 12, "G"); put(27, 13, "G"); lay(8, 7, 13, 7, "C"); lay(19, 7, 24, 7, "C"); put(3, 12, "B"); put(3, 13, "B"); put(29, 12, "B"); put(29, 13, "B");
          put(5, 6, "L"); put(26, 6, "L"); put(5, 19, "L"); put(26, 19, "L"); put(3, 19, "N"); put(0, 11, "q"); lay(1, 10, 3, 12, "g");
        },
        decor(g, cx, cy, d) { H.plaque(g, "NORDSTADION", d.X(16) + 8, d.Y(2) + 4, "#e5e7eb"); }
      },
      mg_officina: {
        interior: true, region: "interno", name: "L'officina di Lukas", short: "Officina", sub: "Biciclette appese, olio e radio con musica industriale", bg: "mg_hotel", w: 16, h: 11, start: [8, 8], outside: ["mg_stazione", 5, 6],
        act: { K: "Guarda gli attrezzi", D: "Guarda il banco", N: "Guarda la bici", S: "Guarda il trofeo", V: "Guarda la vetrata" },
        flavor: { K: "Una parete di attrezzi: la chiave dieci non c'è mai quando serve.", D: "Un banco con una bici smontata: ogni pezzo ha il suo posto, ogni posto la sua etichetta.", N: "Una bicicletta appesa a testa in giù, come un pipistrello arrugginito.", S: "Una coppa: «Miglior meccanico della provincia 2035».", V: "Una vetrina appannata di gelo." },
        objects: {}, doors: {},
        npcs: () => [{ id: "mg_lukas", at: [8, 4], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "w"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(2, 2, 5, 2, "K"); lay(10, 2, 13, 2, "K"); lay(3, 6, 5, 6, "D"); lay(10, 6, 12, 6, "D"); put(2, 8, "N"); put(13, 8, "N"); put(7, 2, "S"); put(9, 2, "V");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BRANDT & FIGLIO", d.X(8) + 8, d.Y(1) + 4, "#fde68a"); }
      },
      mg_hotel: {
        interior: true, region: "interno", name: "L'Hotel Aurora", short: "Hotel", sub: "Vetrate, moquette e un bancone con la campanella", bg: "mg_hotel", w: 18, h: 12, start: [9, 9], outside: ["mg_stazione", 15, 6],
        act: { D: "Siediti sul divano", V: "Guarda la vetrata", S: "Guarda il trofeo", K: "Guarda lo scaffale", N: "Guarda la valigia" },
        flavor: { D: "Un divano blu con il numero di camera ricamato.", V: "Una vetrata con vista sulla piazza innevata.", S: "Un trofeo di vetro: «Hotel dell'anno 2036».", K: "Uno scaffale con guide, mappe e un orario dei treni in tedesco.", N: "Una valigia di un cliente che non è mai tornato a prenderla." },
        objects: {}, doors: {},
        npcs: () => [{ id: "mg_mara", at: [9, 4], face: "down" }].filter(() => S() >= 3),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 11, "m"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 11, "a"); lay(17, 0, 17, 11, "a"); lay(0, 11, 17, 11, "a"); put(9, 11, "v");
          lay(2, 2, 4, 2, "V"); lay(13, 2, 15, 2, "V"); put(7, 2, "K"); put(10, 2, "S"); lay(3, 7, 5, 7, "D"); lay(12, 7, 14, 7, "D"); put(2, 9, "N"); put(15, 9, "N");
        },
        decor(g, cx, cy, d) { H.plaque(g, "HOTEL AURORA", d.X(9) + 8, d.Y(1) + 4, "#bfdbfe"); }
      }
    };
    const talk = {
      mg_mara() {
        if (K.rel.scene("mg_mara")) return;
        const s = S();
        if (s === 0) {
          say("mg_mara", "[triste] Il tablet con le analisi dei tedeschi è sparito. L'ho lasciato un minuto sulla panchina: un uomo con gli occhiali mi ha detto «per caso» e se l'è portato via.");
          say("mg_mara", "Herr Falk, l'assistente di Wolff. Non l'ha rubato: l'ha «preso in prestito». Il tablet è nel loro campo di allenamento, a est. Ma prima serve qualcuno del posto: cerca Lukas Brandt, all'officina (a ovest).");
          K.rel.add("mg_mara", 1, true); setStep(N, 1); quest("mg_c3", "Mondiale Giovanile", "Trova Lukas all'officina."); return done();
        }
        if (s === 3) {
          say("mg_mara", "[felice] Il tablet! Dammi un attimo… sì: i tedeschi giocano a quadrati. Chi sfonda la fascia destra, vince. E il portiere ha paura dei tiri da fuori.");
          if (F.get("mg_tablet_how", "") === "furtivo") say("mg_mara", "E complimenti per il furto: pulito, silenzioso. Io non ho visto niente. Io ho sempre visto tutto."); else say("mg_mara", "E complimenti per aver convinto Falk: il «per caso» è una religione, qui.");
          K.bond("intesa", 3); K.rel.add("mg_mara", 2, true); setStep(N, 4); quest("mg_c3", "Mondiale Giovanile", "Lo stadio è aperto: parla con Wolff.");
          say("voce", "Mara studia gli schemi con Elio. <b>Intesa +3</b>. Lo stadio, a est del campo di allenamento, è aperto."); return done();
        }
        say("mg_mara", s === 4 ? "[serio] Lo stadio è aperto. Wolff vi aspetta." : s === 5 ? "[felice] Semifinale fatta. Ora il Giappone." : "[serio] Vai da Lukas, all'officina. Poi il campo di allenamento."); done();
      },
      mg_gallo() {
        if (K.rel.scene("mg_gallo")) return;
        const s = S();
        say("mg_gallo", s === 0 ? "[serio] Al Nord le cose si fanno con ordine. Parla con Mara: dice che manca qualcosa." : s >= 4 ? "[serio] Nord e neve: tutto perfetto. Pensate solo alla partita." : "[serio] Procedi con calma. L'ordine vince le battaglie, non le fretta."); done();
      },
      mg_lukas() {
        if (K.rel.scene("mg_lukas")) return;
        const s = S();
        if (s === 1) {
          if (!K.crew.has("mg_lukas")) return H.recruit("mg_lukas", { level: 2, opp: "Lukas Brandt", title: "Catena · Contro Lukas", helpLabel: "Aiutalo a riparare una bicicletta", intro: "[serio] Italiani. Qui facciamo biciclette e anticipiamo attaccanti. Ho due mani e non ho tempo di giocare. Se mi convinci, forse.", win: "[sorpreso] Una catena, tre passaggi e un tiro. Non male. Ok, vengo: ma a patto di portare gli attrezzi.", help: "Passi un'ora a tenere ferma una ruota mentre lui stringe un bullone. Alla fine ti dà una chiave inglese: «È tua. Non la perdere».", helpWin: "[felice] Pochi mi hanno aiutato senza dire una parola. Vengo con voi." });
          say("mg_lukas", "[serio] Il tablet è nel campo di allenamento. Là ci sono tre addetti di ronda, con un fischietto e un orario. Usa i cumuli di neve per nascondere le tue scarpe. L'armadietto che cerchi è nel capanno, a nord-est.");
          say("mg_lukas", "[triste] Mio padre aggiustava le biciclette di mezza città. La fabbrica ha chiuso, la città si è svuotata, e il calcio è l'unica cosa rimasta. Io gioco per quelli che sono rimasti.");
          K.bond("intesa", 2); K.rel.add("mg_lukas", 2, true); setStep(N, 2); quest("mg_c3", "Mondiale Giovanile", "Recupera il tablet nel campo di allenamento (nascosto) o sfida Falk."); return done();
        }
        say("mg_lukas", s === 0 ? "[serio] Non ti conosco ancora. Parla con la dottoressa." : "[serio] Vai e sii silenzioso. Il Nord non perdona le scarpe rumorose."); done();
      },
      mg_falk() {
        if (K.rel.scene("mg_falk")) return;
        const s = S();
        if (s === 2) {
          say("mg_falk", "[furbo] Per caso, un tablet. Per caso, nella mia tasca. Per caso, pieno di analisi molto utili.");
          say("mg_falk", "Possiamo risolvere come persone civili: una Catena. Se vinci, il tablet torna a casa. Se perdi, resta una curiosità.");
          return H.chain(2, "Herr Falk", "Catena · Contro Falk", (r) => {
            if (r && r.win) { F.set("mg_c3_calm", true); say("mg_falk", "[sorpreso] Per caso, hai vinto. Ecco il tablet. Per caso, l'ho cancellato di metà. Scherzo: è intero."); recover("catena"); }
            else { say("mg_falk", "[furbo] Per caso, hai perso. Torna quando avrai migliorato la mira, o i piedi."); done(); }
          });
        }
        say("mg_falk", "[furbo] Per caso, sono qui."); done();
      },
      mg_wolff() {
        if (K.rel.scene("mg_wolff")) return;
        const s = S();
        if (s === 4) {
          say("mg_wolff", "[serio] Ho sentito del tablet. Non mi interessa. Mi interessa che voi sappiate giocare con le mani in tasca e le teste alte.");
          say("mg_wolff", "Qui si vince con precisione. Non c'è la samba, non ci sono i tamburi. Ci sono quarantacinque minuti e un fischio. Gut. Giochiamo.");
          return match();
        }
        say("mg_wolff", s < 4 ? "[serio] Lo stadio non è ancora aperto, ragazzo." : "[serio] Gut. Ci vediamo in finale."); done();
      }
    };
    return {
      n: N, title: "Ghiaccio e Acciaio", sub: "Il Nord, un tablet e una semifinale",
      goal, start: "mg_stazione", introBg: "mg_neve", zones, talk, obj: {},
      intro: [["voce", "Dal Brasile al Nord. Il treno è blu, puntuale, e fuori dal finestrino la neve cade piano come una promessa."], ["mg_mara", "[serio] Qui l'ordine è una religione. Dovremo essere ordinati anche noi: o almeno non lasciare in giro il tablet."]]
    };
  }
  boot();
})();
