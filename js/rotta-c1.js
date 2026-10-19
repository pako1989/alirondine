// js/rotta-c1.js - «ROTTA 66» · Capitolo 1: Il Passo del Gigante
// Sant'Anselmo → Passo → Autogrill. Prima tappa della Rotta (risorse benzina/umore/cassa), catene o spinta, un pranzo con Fiamma.
(function () {
  "use strict";
  function boot() {
    const E = window.__rottaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K;
    const N = 1, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const C = (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio);
    C("ro_bartolo", "Mister Bartolo", "Allenatore dell'FC Sant'Anselmo", { style: "bald", hair: "#aaa", beard: "folta", acc: ["fischietto"], shirt: "#1d4ed8", bg: ["#1e3a8a", "#bfdbfe"] }, "Allena da trent'anni la stessa squadra con gli stessi infortuni.");
    C("ro_fiamma", "Fiamma", "Portiere e capitana", { style: "ponytail", hair: "#7a3a1a", acc: ["guanti", "fascia"], shirt: "#b91c1c", bg: ["#7f1d1d", "#fecaca"] }, "Para i tiri, ma soprattutto le discussioni.");
    C("ro_tino", "Tino", "Centravanti", { style: "spiky", hair: "#2a1a10", shirt: "#facc15", skin: "#d9a679", bg: ["#713f12", "#fef08a"] }, "Segna poco e parla molto. Quando segna, parla di più.");
    C("ro_gedeone", "Gedeone", "Massaggiatore", { style: "buzz", hair: "#888", beard: "pizzetto", acc: ["borsa"], shirt: "#0f766e", bg: ["#134e4a", "#99f6e4"] }, "Cura distorsioni, malinconie e polpacci con la stessa crema.");
    C("ro_osvaldo", "Osvaldo", "Autista del Gigante", { style: "short", hair: "#3a3a3a", acc: ["berretto"], shirt: "#d97706", skin: "#c68642", bg: ["#78350f", "#fde68a"] }, "Parla al pullman più che ai passeggeri. Il pullman, in genere, risponde.");
    C("ro_pina", "Pina", "Barista del Bar Anselmo", { style: "bun", hair: "#aaa", acc: ["grembiule"], shirt: "#9d174d", bg: ["#831843", "#fbcfe8"] }, "Conosce i gusti di tutta Sant'Anselmo e i debiti di metà.");
    C("ro_tobia", "Tobia", "Gestore del Rifugio del Passo", { style: "messy", hair: "#4a3a2a", beard: "folta", acc: ["berretto"], shirt: "#475569", bg: ["#334155", "#cbd5e1"] }, "Vive al Passo da quarant'anni. Dice che gli piace il panorama: quando c'è.");
    C("ro_ada", "Ada", "Cassiera dell'Autogrill Il Tordo", { style: "bob", hair: "#2a2a2a", acc: ["occhiali"], shirt: "#166534", bg: ["#14532d", "#bbf7d0"] }, "Dà il resto in modo che sembri un regalo.");
    K.cos("ro_c1", { kind: "shirt", label: "Maglia di viaggio", val: "#1d4ed8", from: "Capitolo 1 di Rotta 66" });
    K.lore("l_gigante", { t: "Il Gigante Stanco", d: "Pullman del 1981, trentadue posti, un portabagagli grande quanto un rimorchio e un carattere ereditato dal padrone." });

    const goal = (s) => ({
      0: "Parla con Mister Bartolo a Sant'Anselmo: il viaggio sta per cominciare.",
      1: "Parla con Osvaldo, vicino al pullman: apri la Rotta e parti verso il Passo del Gigante.",
      2: "Al Passo: la strada è bloccata. Parla con Tobia nel rifugio.",
      3: "Riparti con Osvaldo verso l'Autogrill Il Tordo, e parla con Fiamma."
    }[s] || "Il capitolo 1 è concluso. Segue il Lago.");

    const osv = (zone) => () => {
      const s = S(), here = K.route.here();
      if (s === 0) { say("ro_osvaldo", "Ah, sei tu. Parla con il Mister. Io parlo col pullman: ha le sue ragioni."); return done(); }
      say("ro_osvaldo", s === 1 ? "[serio] Pronti quando vuoi. Il Gigante tossisce, ma è mattiniero." : "Il Gigante respira. Ogni tanto.");
      ask(`Benzina ${K.stat("benza")} · Umore ${K.stat("umore")} · Cassa ${K.stat("cassa")}`, [
        { label: "🗺️ Guarda la Rotta", sub: "Scegli la prossima tappa", cls: "hot", big: true, fn: () => K.route.open(K.done, true) },
        { label: "Restiamo un po'", fn: K.done }
      ]);
    };
    const refuel = (price, qty, who) => ask(`${who}: «Il pieno? ${price} di cassa per ${qty} di benzina.»`, [
      { label: `Pieno (${price})`, sub: `Cassa -${price}, Benzina +${qty}`, fn: () => { if (K.stat("cassa") < price) { say("voce", "Non hai abbastanza cassa."); return done(); } K.bond("cassa", -price); K.bond("benza", qty); say("voce", `Il serbatoio si riempie. Benzina ${K.stat("benza")}.`); done(); } },
      { label: "Per ora no", fn: K.done }
    ]);

    function fin() {
      F.set("ro_c1_done", true);
      K.reward("ro_c1", { coins: 70, cos: "ro_c1" });
      K.finishChapter(N, "ok");
      K.scene([["voce", "Notte all'Autogrill. Il pullman dorme con il muso al cielo."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> Benzina ${K.stat("benza")} · Umore ${K.stat("umore")} · Cassa ${K.stat("cassa")}.`], ["voce", "Il Capitolo 2, «Il Lago che non Pretendeva», ti aspetta."]], () => K.openMain(), "ro_titolo");
    }
    const talk = {
      ro_bartolo() {
        if (S() === 0) {
          say("ro_bartolo", "[serio] Ragazzi, la Coppa dei Borghi si chiude a Valcampo. Duecento chilometri. Il pullman ha settantatré anni, per un pullman sono sessanta e qualcosa.");
          say("ro_bartolo", "Benzina, umore e cassa. Quando una scende a zero, siamo a piedi. Tu fai il tuttofare: tieni insieme squadra e viaggio. Parti quando sei pronto: parla con Osvaldo.");
          K.learnLore("l_gigante"); setStep(N, 1); K.inv.give("ro_cornetto");
          quest("ro_c1", "Verso Valcampo", "Parla con Osvaldo, vicino al pullman, per aprire la Rotta.");
          return done();
        }
        say("ro_bartolo", "Ricorda: se qualcuno vuole ammutinarsi, gli offriamo un cornetto. Funziona sempre."); done();
      },
      ro_fiamma() {
        if (K.rel.scene("ro_fiamma")) return;
        if (K.inZone("ro_autogrill") && S() === 3 && !F.is("ro_c1_done")) {
          say("ro_fiamma", "[serio] Notte all'Autogrill. Mi vieni a sedere? Non per dire cose importanti. Per fare finta di niente, ma con compagnia.");
          return ask("Fiamma guarda le stelle.", [
            { label: "Ti siedi e non parli", sub: "Rapporto +2, Umore +1", fn: () => { K.rel.add("ro_fiamma", 4, true); K.bond("umore", 1); say("ro_fiamma", "[felice] Perfetto. Il silenzio con te non pesa."); fin(); } },
            { label: "Le racconti una storia buffa", sub: "Umore +2", fn: () => { K.rel.add("ro_fiamma", 2, true); K.bond("umore", 2); say("ro_fiamma", "[ride] Questa è la peggiore storia che abbia mai sentito. Raccontamene un'altra."); fin(); } },
            { label: "Le chiedi cosa c'è", sub: "Sincerità", fn: () => { K.rel.add("ro_fiamma", 5, true); say("ro_fiamma", "[pensa] Una cosa che non è ancora il momento di dire. Ma grazie per averlo chiesto."); fin(); } }
          ]);
        }
        say("ro_fiamma", "[felice] Tengo i guanti in tasca per portare fortuna. A volte funziona.");
        done();
      },
      ro_tino() {
        if (K.rel.scene("ro_tino")) return;
        say("ro_tino", "[ride] Ho già fame. Il viaggio è appena iniziato e ho già fame.");
        ask("Tino ti guarda con aria innocente.", [
          { label: "Gli dai il cornetto", sub: "Se lo hai. Rapporto +2", fn: () => { if (!K.inv.has("ro_cornetto")) { say("voce", "Non hai più cornetti."); return done(); } K.inv.take("ro_cornetto"); K.rel.add("ro_tino", 6, true); K.bond("umore", 1); say("ro_tino", "[felice] Un eroe! Prometto che segno. A qualcuno."); done(); } },
          { label: "Lo ignori", fn: K.done }
        ]);
      },
      ro_gedeone() {
        say("ro_gedeone", "[pensa] Crema calda, crema fredda e crema che non so cos'è. Chi vuole un massaggio?");
        ask("Gedeone ti offre le mani.", [
          { label: "Accetti un massaggio", sub: "Umore +1 (una volta al giorno)", fn: () => { if (F.get("ro_mass_" + K.clock.day(), 0)) { say("ro_gedeone", "Oggi hai già dato. Domani, caro."); return done(); } F.set("ro_mass_" + K.clock.day(), 1); K.bond("umore", 1); say("ro_gedeone", "Ecco. Niente nodi, solo qualche ricordo."); done(); } },
          { label: "Declini", fn: K.done }
        ]);
      },
      ro_osvaldo: osv(),
      ro_pina() {
        say("ro_pina", "[felice] Un cornetto per il viaggio? Offre la casa. L'altra casa, quella dei miei debiti.");
        if (!F.is("ro_pina_c")) { F.set("ro_pina_c", true); K.inv.give("ro_cornetto"); K.inv.give("ro_sciarpa"); say("voce", "Pina ti dà anche una sciarpa rossa e blu: «Per la squadra, e per te se hai freddo.»"); }
        done();
      },
      ro_tobia() {
        const s = S();
        if (s < 2 && K.inZone("ro_passo_i0")) {
          say("ro_tobia", "[serio] Il pullman non sale l'ultimo tornante senza catene. Ho catene. Ho anche opinioni sul pullman, ma quelle sono gratis.");
          say("voce", "La salita finale è coperta da un velo di ghiaccio. Che fai?");
          return ask("Il Gigante è fermo davanti al rifugio.", [
            { label: "Compri le catene (15)", sub: "Cassa -15", big: true, fn: () => { if (K.stat("cassa") < 15) { say("voce", "Non hai abbastanza cassa."); return done(); } K.bond("cassa", -15); say("ro_tobia", "[ride] Ecco. Le catene reggono. Con il Gigante, un matrimonio."); setStep(N, 2); quest("ro_c1b", "Il Passo", "Riparti con Osvaldo verso l'Autogrill Il Tordo."); setStep(N, 3); done(); } },
            { label: "Spingete tutti", sub: "Umore -1, nessuna cassa", fn: () => { K.bond("umore", -1); say("ro_tobia", "[ride] Spingete! Spingete! Il Gigante ha il passo lento, ma l'orgoglio grosso."); setStep(N, 3); quest("ro_c1b", "Il Passo", "Riparti con Osvaldo verso l'Autogrill Il Tordo."); done(); } },
            { label: "Aspetti il sole", sub: "Passano 2 fasce, Umore -1", fn: () => { K.bond("umore", -1); K.clock.advance(2); setStep(N, 3); say("ro_tobia", "Il ghiaccio si scioglie, il pullman riparte. Il tempo, al Passo, è l'unico a non essere in ritardo."); quest("ro_c1b", "Il Passo", "Riparti con Osvaldo verso l'Autogrill Il Tordo."); done(); } }
          ]);
        }
        say("ro_tobia", "Qui, al Passo, la benzina costa di più. Ma la vista è gratis, quando c'è.");
        refuel(12, 4, "Tobia");
      },
      ro_ada() { say("ro_ada", "[felice] Benvenuti all'Autogrill Il Tordo! Panini, benzina e una pazienza infinita."); refuel(10, 4, "Ada"); }
    };
    const zones = {
      ro_paese: {
        region: "paese", name: "Sant'Anselmo", short: "Sant'Anselmo", sub: "Il piazzale, il Bar Anselmo e un pullman che non vuole partire", bg: "ro_strada", time: "giorno",
        w: 28, h: 18, start: [4, 9], items: [[3, 5], [24, 14]],
        areas: [[0, 0, 27, 17, "Il piazzale di Sant'Anselmo: tutto comincia (e finisce) qui"]],
        npcs: () => [{ id: "ro_bartolo", at: [12, 9] }, { id: "ro_fiamma", at: [9, 12] }, { id: "ro_gedeone", at: [16, 12] }, { id: "ro_osvaldo", at: [21, 9] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(7, 14, "b"); put(18, 14, "b"); [[3, 3], [24, 3], [4, 15], [22, 15]].forEach(([x, y]) => put(x, y, "t"));
          house(11, 2, 6, 4, { door: [13, 5], roof: "#9b2a2a", enter: { room: "locanda", name: "Bar Anselmo", who: ["ro_pina", "ro_tino"] } });
        }
      },
      ro_passo: {
        region: "monte", name: "Passo del Gigante", short: "Passo", sub: "Nebbia, un rifugio e un tornante di troppo", bg: "ro_strada", time: "giorno",
        w: 26, h: 16, start: [3, 8], items: [[5, 12], [21, 4]],
        areas: [[0, 0, 25, 15, "Il Passo del Gigante, 1.400 metri e nessuna certezza"]],
        npcs: () => [{ id: "ro_osvaldo", at: [10, 8] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 25, 0, "t"); lay(0, 15, 25, 15, "t"); lay(0, 0, 0, 15, "t"); lay(25, 0, 25, 15, "t");
          lay(1, 7, 24, 9, ":"); [[3, 3], [8, 12], [20, 12], [22, 3]].forEach(([x, y]) => put(x, y, "t"));
          house(13, 2, 6, 4, { door: [15, 5], roof: "#475569", enter: { room: "locanda", name: "Rifugio del Passo", who: ["ro_tobia"] } });
        }
      },
      ro_autogrill: {
        region: "paese", name: "Autogrill Il Tordo", short: "Autogrill", sub: "Un distributore, un bar e il sonno del pullman", bg: "ro_strada", time: "sera",
        w: 26, h: 16, start: [3, 8], items: [[4, 12], [22, 4]],
        areas: [[0, 0, 25, 15, "L'Autogrill, dove le notti hanno un neon e i viaggi una pausa"]],
        npcs: () => [{ id: "ro_fiamma", at: [12, 9] }, { id: "ro_osvaldo", at: [8, 9] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 25, 0, "t"); lay(0, 15, 25, 15, "t"); lay(0, 0, 0, 15, "t"); lay(25, 0, 25, 15, "t");
          lay(1, 7, 24, 9, ":"); put(16, 12, "b"); put(17, 12, "b"); [[3, 3], [5, 13], [22, 12]].forEach(([x, y]) => put(x, y, "t"));
          house(13, 2, 6, 4, { door: [15, 5], roof: "#166534", enter: { room: "bottega", name: "Autogrill Il Tordo", who: ["ro_ada"] } });
        }
      }
    };
    return {
      n: N, title: "Il Passo del Gigante", sub: "Un pullman, tre risorse e una salita",
      goal, start: "ro_paese", introBg: "ro_titolo", zones, talk, obj: {},
      intro: [["voce", "Sant'Anselmo, mattina presto. Il Gigante Stanco tossisce al piazzale."], ["voce", "Valcampo è lontana duecento chilometri. Il pullman non lo sa, per fortuna."]]
    };
  }
  boot();
})();
