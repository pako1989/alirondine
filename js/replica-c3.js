// js/replica-c3.js - «EROI IN REPLICA» · Capitolo 3: Il Peso della Verità
// L'Archivio della Lega: Teodora e Ottone custodiscono le prove, il Dossier le mette a confronto, poi il confronto con Zenit e il verdetto.
(function () {
  "use strict";
  function boot() {
    const E = window.__replicaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__replicaH) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__replicaH(K), { say, done, ask } = H, W = K.weight, DS = K.dossier;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("rp_c3", { kind: "shirt", label: "Maglia dell'Archivio", val: "#334155", from: "Capitolo 3 di Eroi in Replica" });
    K.lore("l_verita", { t: "La Verità", d: "Le «invasioni» sono messinscene: alieni pagati a cottimo, copioni numerati e un applauso già concordato. Zenit lo sa? Questo è il Peso." });
    const items = () => DS.list("verita").length;

    const goal = (s) => ({
      0: "Parla con Brezza: ti porta all'Archivio.",
      1: `Raccogli le prove: Teodora (registro) e Ottone (fatture) (${items()}/3).`,
      2: "Confronta le prove nel Dossier con Brezza, poi parla con Zenit.",
      3: "Il verdetto: cosa farai della verità?",
      4: "Il capitolo si chiude con la notte."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      F.set("rp_c3_done", true);
      K.reward("rp_c3", { coins: 120, cos: "rp_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", "Notte. La Lega dorme, con la sola luce dell'Archivio ancora accesa. Dentro, un fascicolo è stato spostato di un centimetro."], ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>${W.bar()} · Potere ${K.stat("potere")} · Dossier ${items()}/3 · ${DS.found("verita")}/2 contraddizioni.`], ["voce", "Il Capitolo 4, «Il Cielo di Casa», ti aspetta."]]), () => K.openMain(), "rp_archivio");
    }
    function check() { if (S() === 1 && items() >= 3) { setStep(N, 2); say("voce", "Hai tutto. Brezza ti aspetta: il Dossier va messo in ordine."); quest("rp_c3b", "Il confronto", "Con Brezza, poi da Zenit."); } }
    function verdict(id, solid) {
      F.set("rp_verdict", id);
      if (id === "tutto") { say("rp_brezza", "[serio] Dire tutto. In pubblico. Allora prepariamoci: sarà una settimana lunga."); W.add("rabbia", 1); }
      else { say("rp_brezza", "[pensa] Da dentro. Con chi comanda. Lento, ma magari esce qualcosa che regge."); W.add("fiducia", 1); }
      if (solid >= 1) say("voce", "Il Dossier regge: due contraddizioni, nessuna scappatoia.");
      setStep(N, 4); fin();
    }
    const talk = {
      rp_brezza() {
        if (K.rel.scene("rp_brezza")) return;
        const s = S();
        if (s === 0) {
          say("rp_brezza", "[serio] Ti devo parlare. Non qui, non in una stanza con il marmo: qui le pareti hanno orecchie e le orecchie hanno uffici stampa.");
          say("rp_brezza", "L'Archivio. Teodora ha un registro; Ottone, in Cassa, ha le fatture. Se qualcosa non torna, tornerà nei numeri.");
          K.learnLore("l_verita"); setStep(N, 1); quest("rp_c3", "Il Peso della Verità", "Raccogli le prove: Teodora e Ottone."); return done();
        }
        if (s === 1) { say("rp_brezza", `Prove: ${items()}/3. Teodora e Ottone, nell'Archivio.`); return done(); }
        if (s === 2) {
          return ask(`Dossier ${items()}/3 · ${DS.found("verita")}/2 contraddizioni`, [
            { label: "🗂️ Apri il Dossier", sub: "Confronta due voci", big: true, cls: "hot", fn: () => DS.open("verita", K.done, true) },
            { label: "Vai da Zenit", sub: "Confronto finale", fn: K.done },
            { label: "Dopo", fn: K.done }
          ]);
        }
        say("rp_brezza", s === 3 ? "Zenit ti aspetta." : "Dormi. Domani arriva tutto."); done();
      },
      rp_teodora() {
        if (K.rel.scene("rp_teodora")) return;
        if (DS.has("verita", "registro")) { say("rp_teodora", "Il registro è tuo. Gli archivi non mentono: è il personale che ha la memoria corta."); return done(); }
        if (S() < 1) { say("rp_teodora", "L'Archivio è chiuso ai figli di nessuno."); return done(); }
        say("rp_teodora", "[serio] Il registro degli allarmi. Ogni allarme parte dopo il primo servizio televisivo. Fa pensare, no?");
        H.wask("Come chiedi il registro?", [
          { label: "🤝 «Mi fido di lei»", sub: "Chiedilo con garbo", big: true, cls: "hot", w: { fiducia: 1 }, fn: () => { DS.add("verita", "registro"); if (!DS.has("verita", "copione")) DS.add("verita", "copione"); say("rp_teodora", "[felice] Tieni. E tieni anche il copione, che Ilario mi ha lasciato: non lo ritira mai nessuno."); check(); done(); } },
          { label: "🔥 «Lo prendo e basta»", sub: "Prendilo", w: { rabbia: 1 }, fn: () => { DS.add("verita", "registro"); if (!DS.has("verita", "copione")) DS.add("verita", "copione"); say("rp_teodora", "[triste] Va bene. Tanto lo avrei dato comunque, a qualcuno che sapeva cosa farci."); check(); done(); } }
        ]);
      },
      rp_ottone() {
        if (K.rel.scene("rp_ottone")) return;
        if (DS.has("verita", "fatture")) { say("rp_ottone", "Le fatture sono tue. Conto i silenzi, e anche questo è stato un silenzio."); return done(); }
        if (S() < 1) { say("rp_ottone", "La Cassa è chiusa. Come la coscienza."); return done(); }
        say("rp_ottone", "[serio] Pagamenti a una compagnia teatrale: costumi da invasore, trentadue. Mica male per una ditta di sartoria.");
        H.wask("Che fai con Ottone?", [
          { label: "🤝 «Parlami»", sub: "Ascolta", w: { fiducia: 1 }, fn: () => { DS.add("verita", "fatture"); say("rp_ottone", "[triste] Prendile. Io le conto da vent'anni. Mi serviva solo qualcuno che chiedesse."); check(); done(); } },
          { label: "🕯️ «Non voglio saperlo»", sub: "Il peso di sapere", w: { colpa: 1 }, fn: () => { DS.add("verita", "fatture"); say("rp_ottone", "[pensa] Non sapere è un lusso. Le tengo qui dentro, per te."); check(); done(); } }
        ]);
      },
      rp_zenit() {
        if (K.rel.scene("rp_zenit")) return;
        const s = S();
        if (s === 2 || s === 3) {
          if (s === 2) setStep(N, 3);
          say("rp_zenit", "[sorpreso] Sei venuto a trovarmi in Archivio? Ho una conferenza stampa fra venti minuti. Ma per te, dieci minuti e un caffè.");
          if (!DS.has("verita", "copione") || items() < 3) { say("rp_zenit", "[pensa] Hai la faccia di chi ha letto qualcosa che non gli piace. Torna con le prove, così ne parliamo bene."); return done(); }
          return H.wask("Cosa dici a tuo padre?", [
            { label: "🤝 «Voglio capire»", sub: "Chiedi, senza accusare", big: true, cls: "hot", w: { fiducia: 1 }, fn: () => { say("rp_zenit", "[triste] ...Ho firmato io la prima. Pensavo di proteggere la gente. Poi ho smesso di chiedermelo."); confirm(); } },
            { label: "🔥 «Hai mentito a tutti»", sub: "Accusa", w: { rabbia: 1 }, fn: () => { say("rp_zenit", "[arrabbiato] Ho salvato undici volte il mondo. Una finta in più non lo cambia."); confirm(); } },
            { label: "🕯️ «E io? Ero parte del copione?»", sub: "Il peso di una vita", w: { colpa: 1 }, need: { colpa: 1 }, fn: () => { say("rp_zenit", "[triste] No. Tu sei l'unica cosa non scritta."); confirm(); } }
          ]);
        }
        say("rp_zenit", s < 2 ? "Più tardi. Ho le conferenze stampa." : "Notte buona. Sono fiero di te, anche se non lo dimostro bene."); done();
      }
    };
    function confirm() {
      say("voce", "Quel che hai in mano tiene. Ora devi decidere cosa farne.");
      ask("Il verdetto", [
        { label: "⚖️ Decidi cosa fare", sub: "Tutto in pubblico, o dall'interno", big: true, cls: "hot", fn: () => DS.verdict("verita", K.done, true, verdict) },
        { label: "Non ancora", fn: K.done }
      ]);
    }
    const zones = {
      rp_archivio: {
        region: "archivio", name: "L'Archivio della Lega", short: "Archivio", sub: "Scaffali, candele e verbali che nessuno vuole aprire", bg: "rp_archivio", time: "sera",
        w: 28, h: 18, start: [4, 9], items: [[2, 13], [24, 14]],
        areas: [[0, 0, 27, 17, "L'Archivio: polvere, ordine e una candela per i segreti"]],
        npcs: (step) => [{ id: "rp_brezza", at: [10, 9] }, { id: "rp_teodora", at: [20, 9] }].concat(step >= 2 ? [{ id: "rp_zenit", at: [15, 12] }] : []),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(8, 14, "b"); put(19, 14, "b"); [[3, 3], [24, 3], [5, 15], [22, 15]].forEach(([x, y]) => put(x, y, "t"));
          house(5, 2, 6, 4, { door: [7, 5], roof: "#334155", enter: { room: "cassa", name: "La Cassa", who: ["rp_ottone"] } });
        }
      }
    };
    return {
      n: N, title: "Il Peso della Verità", sub: "Tre prove, due contraddizioni e un padre",
      goal, start: "rp_archivio", introBg: "rp_archivio", zones, talk, obj: {},
      intro: [["voce", "L'Archivio della Lega, ore piccole. Un posto che sa tutto e preferirebbe dimenticare."], ["voce", "Se le «invasioni» sono una messinscena, qualcuno deve averla messa per iscritto."]]
    };
  }
  boot();
})();
