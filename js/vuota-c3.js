// js/vuota-c3.js - «OPERAZIONE SCATOLA VUOTA» · Capitolo 3: L'Archivio Freddo
// Le Celle del Freddo (telecamere che ruotano), l'Archivio a mano (tre cartelle da trovare), Lastra e la scoperta del Rapporto Zero.
(function () {
  "use strict";
  function boot() {
    const E = window.__vuotaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const H = window.__vuotaH, { setStep, quest, F } = K;
    const N = 3, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    K.cos("vs_c3", { kind: "shirt", label: "Maglia del Freddo", val: "#475569", from: "Capitolo 3 di Operazione Scatola Vuota" });
    K.lore("l_rapporto", { t: "Il Rapporto Zero", d: "Un dossier di due parti: la prima elenca chi ha pagato e chi ha eseguito, la seconda come è stato deciso. Una persona, in particolare, ci ha messo la firma." });
    const FOLD = ["vs_cart1", "vs_cart2", "vs_cart3"], found = () => FOLD.filter((k) => F.is(k)).length;
    const goal = (s) => ({
      0: "Attraversa le Celle del Freddo evitando le telecamere e usa la tessera sulla porta a nord-est.",
      1: "Archivio: trova le tre cartelle (scaffali con una luce verde) per aprire la cella di Lastra.",
      2: "Parla con Lastra, nella cella frigorifera in fondo all'archivio.",
      3: "Hai la prima parte del Rapporto: decidi come usare l'informazione, poi vai al tetto."
    }[s] || "Il capitolo 3 è concluso. Il tetto, sotto la pioggia, ti aspetta.");
    const shelf = (n, txt) => () => {
      if (S() < 1) setStep(N, 1);
      const k = FOLD[n - 1]; if (F.is(k)) { say("voce", "Già presa. Le altre sono su altri scaffali."); return done(); }
      F.set(k, true); say("voce", txt); const c = found();
      if (c >= 3) { say("voce", "Tre cartelle. Un clic lontano, in fondo all'Archivio: la cella di Lastra si è aperta."); setStep(N, 2); quest("vs_c3b", "Lastra", "Parla con Lastra, in fondo all'Archivio."); } else say("voce", `Cartelle trovate: ${c}/3.`);
      done();
    };
    function fin(how) {
      F.set("vs_c3_done", true);
      if (K.alert.get() === 0) K.bond("silenzio", 1);
      K.reward("vs_c3", { coins: 90, cos: "vs_c3" });
      K.finishChapter(N, how || "ok");
      K.scene([["vs_vulpe", "[pensa] Ti ho sentito respirare per tre minuti senza dire niente. Non è da te. Va tutto bene?"], ["vs_vulpe", "Il tetto, adesso. Sotto, Eco e il Campo Zero. Sopra, la pioggia e i fari. Non è una bella combinazione, ma almeno è chiara."], ["voce", `<b>FINE DEL CAPITOLO 3.</b> Silenzio ${K.stat("silenzio")} · Fiducia ${K.stat("fiducia")} · Scatole ${K.stat("scatole")}.`], ["voce", "Il Capitolo 4, «Rapporto Zero», ti aspetta."]], () => K.openMain(), "vs_tetto");
    }
    const talk = {
      vs_lastra() {
        if (K.rel.scene("vs_lastra")) return;
        const s = S();
        if (s < 2) { say("vs_lastra", "[serio] Chi cerca nel mio archivio trova solo quello che ha già in mente."); return done(); }
        if (s === 2) {
          say("vs_lastra", "Sapevo che prima o poi sarebbe arrivato qualcuno con tre cartelle e un'espressione sbagliata. Siediti. Qui il freddo parla più piano.");
          say("vs_lastra", "Ero il portiere quella sera. Ho preso due gol in sei minuti, due tiri facili, e ho capito in diretta che non erano facili per caso.");
          say("vs_lastra", "Ho conservato tutto al freddo: le registrazioni, le liste, i bonifici. Per dodici anni sono stata la tomba di una cosa che volevo urlare.");
          return ask("Lastra apre una cassaforte con una tessera appesa al collo.", [
            { label: "Provi a prenderle la parte uno (Infiltrazione, 6 e 7)", sub: "Scopri il suo giro con la tessera", big: true, cls: "hot", fn: () => { QL = []; K.infiltra([6, 7], (r) => { if (r.win) { say("vs_lastra", "[sorpreso] Non ti ho sentita nemmeno stavolta. Mi ricordi qualcuno."); F.set("vs_parte1", true); K.rel.add("vs_lastra", 4, true); K.bond("silenzio", 1); setStep(N, 3); quest("vs_c3c", "Il Rapporto", "Decidi cosa fare con la prima parte del Rapporto Zero."); K.learnLore("l_rapporto"); return rivela(); } say("vs_lastra", "Riprova. Ho tempo: qui il tempo si conserva."); done(); }); } },
            { label: "Le chiedi di darti la parte uno", sub: "Fiducia +1 · Rapporto +2", fn: () => { K.rel.add("vs_lastra", 3, true); say("vs_lastra", "Non è mia da darti. Ma posso non vederti prenderla. È diverso."); F.set("vs_parte1", true); K.bond("fiducia", 1); setStep(N, 3); quest("vs_c3c", "Il Rapporto", "Decidi cosa fare con la prima parte del Rapporto Zero."); K.learnLore("l_rapporto"); rivela(); } },
            { label: "Le mostri la foto degli Aironi", sub: "Se ce l'hai", fn: () => { if (!K.inv.has("vs_foto")) { say("voce", "Non hai nessuna foto."); return done(); } K.inv.take("vs_foto"); K.rel.add("vs_lastra", 8, true); K.bond("fiducia", 2); F.set("vs_parte1", true); say("vs_lastra", "[triste] Il giorno prima. Eravamo undici ragazzi in posa. Prendi tutto: è l'unico gol che ho voglia di segnare."); setStep(N, 3); quest("vs_c3c", "Il Rapporto", "Decidi cosa fare con la prima parte del Rapporto Zero."); K.learnLore("l_rapporto"); rivela(); } }
          ]);
        }
        say("vs_lastra", "Il freddo ha una sola qualità: conserva. Non giudica."); done();
      },
      vs_mira() {
        if (K.rel.scene("vs_mira")) return;
        say("vs_mira", S() === 0 ? "Camera 1 gira a sinistra ogni due secondi. Camera 2 è un'anima semplice: guarda sempre dritto. Non fidarti di nessuna delle due." : "Dietro gli scaffali c'è un cavo che non dovrebbe esserci. Lo lascio dov'è. Alle volte il guasto è l'amico migliore."); done();
      },
      vs_camera() { say("voce", "La telecamera ti guarda senza giudicare. Questo, in fondo, è il suo problema."); done(); },
      vs_guardia() { say("vs_guardia", "[serio] Zona fredda. Si entra con il giubbotto e si esce con la ricevuta."); done(); }
    };
    function rivela() {
      say("voce", "Nella parte uno, una pagina di appunti a mano: date, cifre, nomi. In fondo, una firma che conosci benissimo.");
      say("vs_vulpe", "[triste] ...Ottone. La firma è la sua. Non è un falso: ho confrontato i tratti con le sue lettere. Mi dispiace.");
      ask("Hai tra le mani la firma del tuo maestro.", [
        { label: "Lo affronti subito via radio", sub: "Ottone dovrà parlare", big: true, cls: "hot", fn: () => { F.set("vs_ott_conf", true); say("vs_ottone", "[triste] Non ti ho mentito per cattiveria. Ti ho mentito per vigliaccheria, che è peggio e più comune. Dodici anni di scatole per non dire una frase."); say("vs_ottone", "Sono stato io a mettere la firma. Mi avevano detto che era l'unico modo per salvare la squadra. Non salvai nessuno."); K.rel.add("vs_ottone", 6, true); K.bond("fiducia", 1); fin("conf"); } },
        { label: "Aspetti e ti tieni la cosa", sub: "Silenzio +1", fn: () => { K.bond("silenzio", 1); F.set("vs_ott_conf", false); say("vs_vulpe", "Scelta tua. Io non gli dico niente. Il silenzio, per una volta, è solidarietà."); fin("ok"); } },
        { label: "Chiedi a Lastra cosa ne pensa", sub: "Rapporto +2", fn: () => { K.rel.add("vs_lastra", 3, true); say("vs_lastra", "[pensa] Penso che chi firma ha già pagato. A modo suo. Ma io non sono un giudice: sono un archivio."); F.set("vs_ott_conf", false); fin("ok"); } }
      ]);
    }
    const zones = {
      vs_celle: {
        region: "archivio", name: "Bastione Nove · Le Celle del Freddo", short: "Celle", sub: "Container refrigerati, ghiaccio e telecamere", bg: "vs_archivio", time: "notte", w: 30, h: 22, base: "i", start: [2, 18], sneakStart: [2, 18],
        items: [[4, 4], [26, 18], [14, 12]], hide: "x",
        areas: [[0, 0, 29, 21, "Le Celle del Freddo, sotto zero"]],
        npcs: () => [{ id: "vs_mira", at: [4, 16] }, { id: "vs_camera", at: [8, 8], face: "right", guard: { range: 5, cone: 0.25, turn: 70 } }, { id: "vs_camera", at: [20, 12], face: "left", guard: { range: 5, cone: 0.25, turn: 90 } }, { id: "vs_camera", at: [14, 4], face: "down", guard: { range: 5, cone: 0.25, turn: 110 } }, H.guard([[6, 11], [16, 11]], { speed: 0.5 })].concat(K.alert.get() >= 2 ? [H.guard([[22, 18], [27, 18]], { speed: 0.6 })] : []),
        doors: { "29,3": { to: "vs_archivio", at: [2, 17], locked: () => (F.is("vs_tessera") ? false : "La porta ha un lettore. Serve la Tessera di Lastra (la prese Pio, nel capitolo 2).") }, "0,18": { to: "vs_cortile", at: [30, 12] } },
        build(L) {
          const { lay, put } = L;
          H.border(L, 30, 22, "E"); lay(2, 5, 7, 6, "E"); lay(10, 2, 12, 3, "E"); lay(16, 6, 21, 7, "E"); lay(24, 9, 28, 10, "E"); lay(3, 13, 8, 14, "E"); lay(12, 14, 17, 15, "E"); lay(22, 14, 27, 15, "E"); lay(8, 18, 12, 19, "E");
          lay(18, 17, 20, 20, "K"); lay(1, 9, 3, 10, "K"); put(29, 3, "q"); put(0, 18, "q"); lay(14, 17, 17, 21, "m"); lay(23, 3, 27, 6, "u");
          [[9, 10], [18, 9], [13, 7], [21, 16], [7, 17], [26, 12], [5, 8], [24, 7]].forEach(([x, y]) => put(x, y, "x")); [[2, 3], [28, 20]].forEach(([x, y]) => put(x, y, "Q")); put(1, 17, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CELLE · −18°", d.X(10) + 8, d.Y(4) - 4, "#93c5fd"); H.plaque(g, "ARCHIVIO ▸", d.X(28) - 8, d.Y(2) + 4, "#facc15"); },
        intro: [["voce", "Le Celle del Freddo. Container refrigerati allineati come lapidi, ghiaccio che scricchiola e tre telecamere che girano a ritmi diversi."], ["voce", "Le telecamere guardano in linea retta e ruotano. Cerca il momento in cui guardano altrove."]]
      },
      vs_archivio: {
        interior: true, region: "archivio", name: "Bastione Nove · L'Archivio", short: "Archivio", sub: "Scaffali alti fino al soffitto, luci bianche e un silenzio a venti gradi sotto zero", bg: "vs_archivio", w: 30, h: 20, start: [2, 17], outside: ["vs_celle", 28, 3], hud: true, hide: "x",
        npcs: () => [{ id: "vs_lastra", at: [26, 4] }, { id: "vs_camera", at: [13, 3], face: "down", guard: { range: 5, cone: 0.25, turn: 80 } }, { id: "vs_camera", at: [20, 12], face: "left", guard: { range: 5, cone: 0.25, turn: 100 } }, H.guard([[4, 12], [16, 12]], { speed: 0.5 })].concat(K.alert.get() >= 2 ? [H.guard([[6, 6], [12, 6]], { speed: 0.6 })] : []),
        loot: { "27,5": { id: "vs_foto", text: "Nell'ultimo scaffale della cella: una foto incorniciata. Undici ragazzi in posa, una coppa al centro. Qualcuno ha tagliato un angolo.", empty: "Lo scaffale è vuoto. Resta il segno della cornice." } },
        objects: { "7,4": shelf(1, "Cartella 1: «Bonifici Valdoro». Righe di cifre con una parola ripetuta: «Sipario»."), "18,8": shelf(2, "Cartella 2: «Turni arbitrali». Un nome sbarrato a penna, e una data: il giorno della finale."), "24,14": shelf(3, "Cartella 3: «Riflettori». Una sola riga: «90 secondi. Dimenticare.»") },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 19, "o"); lay(0, 0, 29, 1, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a"); lay(0, 19, 29, 19, "a"); put(1, 19, "v");
          lay(1, 8, 8, 8, "Y"); lay(11, 8, 16, 8, "Y"); lay(19, 8, 27, 8, "Y"); lay(4, 3, 9, 3, "Y"); lay(15, 3, 20, 3, "Y"); lay(2, 14, 8, 14, "Y"); lay(11, 15, 16, 15, "Y"); lay(20, 15, 27, 15, "Y");
          lay(22, 2, 28, 5, "i"); lay(21, 2, 21, 5, "F"); put(21, 4, "i"); lay(23, 1, 27, 1, "Z"); put(7, 4, "Y"); put(18, 8, "Y"); put(24, 14, "Y"); put(27, 5, "Y");
          [[10, 12], [18, 5], [26, 10], [3, 6], [12, 17], [24, 17]].forEach(([x, y]) => put(x, y, "x"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "ARCHIVIO CENTRALE", d.X(15) + 8, d.Y(1) + 6, "#93c5fd"); H.plaque(g, "CELLA DI LASTRA", d.X(25) + 8, d.Y(2) - 2, "#f87171"); }
      }
    };
    return {
      n: N, title: "L'Archivio Freddo", sub: "Telecamere, scaffali e una firma",
      goal, start: "vs_celle", introBg: "vs_archivio", zones, talk, obj: {},
      intro: [["voce", "Le Celle del Freddo. Una nuvoletta di vapore a ogni respiro."], ["vs_mira", "Mi sono portata un thermos. Tu hai la scatola. Direi che siamo pari."]]
    };
  }
  boot();
})();
