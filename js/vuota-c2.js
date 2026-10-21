// js/vuota-c2.js - «OPERAZIONE SCATOLA VUOTA» · Capitolo 2: Le Luci del Bastione
// Cortile illuminato da fari che girano (buio + luci), Brace e la sua scommessa (Infiltrazione), officine a mano con Pio e la Tessera di Lastra.
(function () {
  "use strict";
  function boot() {
    const E = window.__vuotaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const H = window.__vuotaH, { setStep, quest, F } = K;
    const N = 2, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    K.cos("vs_c2", { kind: "shirt", label: "Maglia dei Riflettori", val: "#b45309", from: "Capitolo 2 di Operazione Scatola Vuota" });
    K.lore("l_blackout", { t: "Il blackout di Valdoro", d: "Alla finale della Coppa dei Continenti, a dodici minuti dalla fine, i riflettori si spensero per novanta secondi. Quando tornarono, il risultato era già un altro." });
    K.lore("l_fondazione", { t: "La Fondazione Sipario", d: "Una fondazione «per il bene del gioco». Possiede il Bastione, l'isola, e (dicono) molti arbitri." });

    const goal = (s) => ({
      0: "Il cortile: attraversalo evitando i fari (zone luminose) e raggiungi Brace, alla torre dei quadri a nord.",
      1: "Brace propone una scommessa: due livelli di Infiltrazione. Parla con lui.",
      2: "Entra nelle officine (porta est) e parla con Pio.",
      3: "Hai la Tessera di Lastra? Torna da Brace per l'ultimo discorso, poi sali al piano di sopra."
    }[s] || "Il capitolo 2 è concluso. L'Archivio ti aspetta.");

    function fin() {
      F.set("vs_c2_done", true);
      if (K.alert.get() === 0) K.bond("silenzio", 1);
      K.reward("vs_c2", { coins: 80, cos: "vs_c2" });
      K.finishChapter(N, "ok");
      K.scene([["vs_brace", "[triste] Va'. Prima che accenda qualcosa."], ["vs_vulpe", "[pensa] Hai la Tessera di Lastra. L'Archivio è al piano sotto: freddo, silenzioso e pieno di cose che non vogliono essere trovate."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> Silenzio ${K.stat("silenzio")} · Fiducia ${K.stat("fiducia")} · Scatole ${K.stat("scatole")}.`], ["voce", "Il Capitolo 3, «L'Archivio Freddo», ti aspetta."]], () => K.openMain(), "vs_archivio");
    }
    const bet = () => K.infiltra([4, 5], (r) => {
      if (r.win) {
        say("vs_brace", "[sorpreso] Le luci non ti hanno preso. Né la scatola, né i passi. Sei fortunata o sei brava?");
        say("vs_brace", "Ho giurato di non aprire quella porta. Ho giurato anche di non spegnere mai più una lampada. Per fortuna ho una memoria selettiva.");
        K.rel.add("vs_brace", 4, true); K.bond("silenzio", 1); F.set("vs_brace_bet", true); setStep(N, 2); quest("vs_c2a", "Le officine", "Entra nelle officine (porta est del cortile) e parla con Pio.");
        return done();
      }
      say("vs_brace", "[ride] Quasi. Ritenta quando vuoi: il cortile non scappa."); done();
    });
    const talk = {
      vs_brace() {
        if (K.rel.scene("vs_brace")) return;
        const s = S();
        if (s === 0) {
          say("vs_brace", "[furbo] Una scatola che cammina. In dodici anni ne ho viste di cose, ma una scatola con le gambe ancora no.");
          say("vs_brace", "Brace. Capo delle Luci. Ero ala, una volta. Ora corro dietro ai riflettori invece che ai palloni.");
          say("vs_brace", "Ti propongo una scommessa: passa i miei due piani di luce senza che ti vedano. Se ci riesci, non ti ho visto, e ti apro la porta est. Se no, il cortile ti rimanda a casa.");
          setStep(N, 1); K.learnLore("l_fondazione");
          return ask("Brace ti tende la mano, con un sorriso che non arriva agli occhi.", [
            { label: "Accetti la scommessa", sub: "Infiltrazione, livelli 4 e 5", big: true, cls: "hot", fn: () => { QL = []; bet(); } },
            { label: "Chiedi perché lo fa", sub: "Rapporto +2", fn: () => { K.rel.add("vs_brace", 3, true); say("vs_brace", "Perché a volte l'unica cosa che puoi fare è scegliere chi guarda. Io decido dove guarda il faro. È poco. È tutto."); done(); } }
          ]);
        }
        if (s === 1) { say("vs_brace", "[ride] Allora, la scommessa?"); return ask("Brace attende.", [{ label: "Accetti la scommessa", sub: "Infiltrazione, livelli 4 e 5", big: true, cls: "hot", fn: () => { QL = []; bet(); } }, { label: "Non ancora", fn: K.done }]); }
        if (s === 3 && F.is("vs_tessera")) {
          say("vs_brace", "Hai la tessera. Allora lo sai: la finale non l'ha decisa il pallone. L'ha decisa un interruttore.");
          say("vs_brace", "Quel giorno ero io, di turno ai riflettori. Mi hanno detto: «Novanta secondi. Poi dimentichiamo». Ho eseguito. Ho dimenticato per dodici anni.");
          setStep(N, 4);
          return ask("Brace guarda il pannello dei quadri, immobile.", [
            { label: "«Non è stata colpa tua»", sub: "Fiducia +1", big: true, fn: () => { K.bond("fiducia", 1); K.rel.add("vs_brace", 6, true); say("vs_brace", "[triste] Non è una frase che può essere vera. Ma grazie per averla scelta."); fin(); } },
            { label: "«Aiutaci a farla finire»", sub: "Rapporto +4", fn: () => { K.rel.add("vs_brace", 4, true); say("vs_brace", "[pensa] Eco ha la parte finale. Sta in fondo, nel Campo Zero. Passa dal tetto. Io non ho visto niente."); fin(); } },
            { label: "Mostri la foto degli Aironi", sub: "Se ce l'hai", fn: () => { if (!K.inv.has("vs_foto")) { say("voce", "Non hai nessuna foto."); return done(); } K.inv.take("vs_foto"); K.rel.add("vs_brace", 8, true); K.bond("fiducia", 2); say("vs_brace", "[triste] Abbiamo riso quel giorno. Tienila: io non saprei dove metterla."); fin(); } }
          ]);
        }
        say("vs_brace", s >= 2 ? "Dai, vai. E non farti vedere da nessuno: il mio turno non finisce." : "Torna quando sei pronto."); done();
      },
      vs_pio() {
        const s = S();
        if (s < 2) { say("vs_pio", "[pensa] Zzz... non ho visto niente. Non sono neanche qui."); return done(); }
        if (F.is("vs_tessera")) { say("vs_pio", "Hai preso la tessera. Non dire che sono stato io: ho un sonno da difendere."); return done(); }
        say("vs_pio", "[pensa] Mmh? Un'ombra... no, una scatola. Con una persona dentro. Eh, ogni lunedì è lo stesso.");
        say("vs_pio", "La tessera di Lastra è nell'armadietto grigio. La chiave la tengo io. Se vuoi, te la presto, ma ho una condizione: niente rumori. E un po' di fagioli.");
        ask("Pio si stropiccia gli occhi.", [
          { label: "Gli dai una razione", sub: "Se ne hai una", big: true, cls: "hot", fn: () => { if (!K.inv.has("vs_razione")) { say("voce", "Non hai razioni. Ghiro ne ha."); return done(); } K.inv.take("vs_razione"); F.set("vs_tessera", true); K.rel.add("vs_pio", 6, true); say("vs_pio", "[felice] Fagioli! Prendi pure. Non so quando tornerò in servizio, ma ti avrò dimenticato."); setStep(N, 3); quest("vs_c2b", "Il discorso di Brace", "Torna da Brace, nel cortile, con la tessera in tasca."); say("voce", "Ottieni la Tessera di Lastra."); done(); } },
          { label: "Gli prendi la chiave dalla tasca", sub: "Infiltrazione, livello 2", fn: () => { QL = []; K.infiltra([2], (r) => { if (r.win) { F.set("vs_tessera", true); K.bond("silenzio", 1); setStep(N, 3); quest("vs_c2b", "Il discorso di Brace", "Torna da Brace, nel cortile, con la tessera in tasca."); say("vs_pio", "...mh? Non ho sentito niente. Meglio così."); say("voce", "Ottieni la Tessera di Lastra."); done(); } else { say("vs_pio", "[arrabbiato] Ehi! ...ah no, russavo io. Ritenta, ma piano."); done(); } }); } },
          { label: "Gli chiedi di farti passare", sub: "Rapporto +1", fn: () => { K.rel.add("vs_pio", 2, true); say("vs_pio", "Se riesci a convincermi con qualcosa da mettere sotto i denti, ne parliamo."); done(); } }
        ]);
      },
      vs_guardia() { say("vs_guardia", "[serio] Non mi interessa chi sei. Mi interessa il turno."); done(); },
      vs_mira() {
        if (K.rel.scene("vs_mira")) return;
        say("vs_mira", "Il mio vecchio banco di lavoro è lì in fondo. L'ho venduto a una fondazione per quindici anni di caffè. Oggi lo riconosco dal bullone storto."); done();
      }
    };
    const zones = {
      vs_cortile: {
        region: "bastione", name: "Bastione Nove · Il Cortile", short: "Cortile", sub: "Fari che girano, casse e una torre dei quadri", bg: "vs_bastione", time: "notte", w: 32, h: 22, base: "c", start: [2, 17], sneakStart: [2, 17],
        items: [[3, 5], [28, 19], [20, 18]], hide: "x", buio: 0.62, heroLight: 2,
        luci(K2) { const t = performance.now() / 1000; return [[Math.round(10 + 6 * Math.sin(t / 3)), Math.round(12 + 4 * Math.cos(t / 3)), 4], [Math.round(22 + 5 * Math.cos(t / 4)), Math.round(8 + 3 * Math.sin(t / 4)), 4], [16, 3, 3]]; },
        areas: [[0, 0, 31, 21, "Il cortile del Bastione Nove, sotto i fari"]],
        npcs: () => [{ id: "vs_brace", at: [16, 5] }, H.guard([[4, 12], [12, 12]], { speed: 0.5 }), H.guard([[20, 15], [28, 15]], { speed: 0.5 }), H.post([14, 9], "down", { turn: 130 }), H.post([27, 6], "left", { turn: 170 })].concat(K.alert.get() >= 2 ? [H.guard([[6, 18], [14, 18]], { speed: 0.6 })] : []),
        doors: { "31,12": { to: "vs_officine", at: [2, 12], locked: () => (S() >= 2 ? false : "La porta est è sbarrata. Brace tiene la chiave... o la scommessa.") }, "0,17": { to: "vs_scogliera", at: [28, 5] } },
        build(L) {
          const { lay, put } = L;
          H.border(L, 32, 22, "F"); lay(14, 0, 18, 2, "Z"); lay(13, 2, 19, 2, "Z"); put(13, 1, "Z"); put(16, 4, "J"); lay(1, 1, 12, 3, "E"); lay(21, 1, 30, 3, "E"); lay(1, 4, 3, 4, "K");
          lay(8, 7, 11, 8, "K"); lay(18, 11, 20, 12, "K"); lay(24, 17, 28, 18, "K"); lay(2, 14, 6, 15, "E");
          lay(0, 11, 31, 13, "h"); lay(14, 14, 18, 20, "m"); put(31, 12, "q"); put(0, 17, "q"); [[7, 10], [13, 14], [21, 14], [26, 8], [10, 19], [29, 13], [4, 8]].forEach(([x, y]) => put(x, y, "x")); [[11, 5], [22, 5], [8, 16]].forEach(([x, y]) => put(x, y, "Q"));
          put(31, 18, "V"); put(2, 18, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "QUADRO LUCI", d.X(16) + 8, d.Y(4) - 4, "#facc15"); H.plaque(g, "OFFICINE ▸", d.X(30) - 8, d.Y(11) + 4, "#a3e635"); H.plaque(g, "◂ SCOGLIERA", d.X(2) + 8, d.Y(16) - 4, "#94a3b8"); },
        intro: [["voce", "Il cortile del Bastione di notte. I fari girano su binari, a velocità diverse, e dove passano la luce è nitida come un tribunale."], ["voce", "Fuori dalla luce le guardie ti vedono solo da vicino. Dentro, da lontano. La regola è semplice: stai nell'ombra."]]
      },
      vs_officine: {
        interior: true, region: "officina", name: "Bastione Nove · Le Officine", short: "Officine", sub: "Banchi, casse e una luce che odora di olio", bg: "vs_bastione", w: 24, h: 14, start: [2, 12], outside: ["vs_cortile", 30, 12], hud: true,
        act: { h: "Guarda il pavimento a strisce" },
        npcs: () => [{ id: "vs_pio", at: [12, 6] }, { id: "vs_mira", at: [4, 9] }],
        loot: { "20,3": { id: "vs_razione", text: "Su un banco, accanto a una chiave inglese: una razione di campo. Non è tua, ma Pio non protesterà.", empty: "Sul banco restano briciole e una chiave inglese." } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 13, "m"); lay(8, 3, 16, 9, "h"); lay(9, 4, 15, 8, "m"); lay(0, 0, 23, 1, "a"); lay(0, 0, 0, 13, "a"); lay(23, 0, 23, 13, "a"); lay(0, 13, 23, 13, "a"); put(1, 13, "v");
          lay(2, 2, 6, 2, "Y"); lay(18, 2, 21, 2, "Y"); lay(19, 3, 21, 3, "K"); lay(17, 8, 21, 10, "E"); lay(2, 6, 3, 7, "K"); lay(11, 2, 12, 2, "Z"); put(15, 6, "J"); put(20, 3, "k");
        },
        decor(g, cx, cy, d) { H.plaque(g, "OFFICINE · NON ENTRARE", d.X(12) + 8, d.Y(1) + 6, "#a3e635"); }
      }
    };
    return {
      n: N, title: "Le Luci del Bastione", sub: "Fari, una scommessa e una tessera",
      goal, start: "vs_cortile", introBg: "vs_bastione", zones, talk, obj: {},
      intro: [["voce", "Il cancello scivola alle tue spalle. Dentro il Bastione, il cielo ha un colore che non esiste: bianco di faro e blu di cemento."], ["vs_vulpe", "[pensa] Ti vedo. Un puntino che fa il vago. Ricorda: scatola, ombra, pazienza."]]
    };
  }
  boot();
})();
