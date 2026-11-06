// js/trono-c5.js - IL TRONO DI CUOIO · Capitolo 5 «La Finale alla Rovescia» (DOSSIER INCOMPIUTO)
// Il giorno del Torneo, dal punto di vista di Ottavia: la finale al Concilio contro il figlio senza nome, con un solo
// patto da non tradire. Finali: LA VERITÀ DEL CUOIO · L'UNICO PATTO.
(function () {
  "use strict";
  function boot() { const D = window.__trono; if (!D || !D.addChapter || !D._has(4)) return setTimeout(boot, 120); D.addChapter(chapter5); }
  function chapter5(K) {
    const { F, say, ask, done, setStep, bond, finishChapter } = K;
    const N = 5, S = () => K.stepOf(N), C = K.CASATE;
    K.cos("tc_c5", { kind: "acc", label: "Penna d'argento", val: "medaglia", from: "Completa il Dossier del Trono di Cuoio" });
    const goal = (s) => ({
      0: "La finale. L'araldo, al centro della loggia, aspetta di annunciare il Concilio.",
      1: "Hai vinto la finale. Parla con Lady Ysolde, in loggia, per scegliere il tuo finale.",
    }[s] || "Il Dossier del Trono è concluso.");
    const zones = {
      tc_loggia: {
        region: "arena", name: "Dossier Trono · La loggia dei Ferroquercia", short: "La loggia", sub: "Sopra il campo del Torneo", bg: "tc_arena", time: "giorno", travel: [14, 16],
        w: 28, h: 18, start: [14, 16], items: [],
        banners: { "5,4": "ferroquercia", "22,4": "ferroquercia", "5,12": "tasso", "22,12": "tasso", def: "ferroquercia" },
        areas: [[0, 0, 27, 17, "La loggia dei Ferroquercia"]],
        flavor: { t: "Un olmo antico, fuori dalla loggia. Dicono che il primo re ci appese il primo pallone." },
        intro: [["voce", "La loggia dei Ferroquercia, sopra il campo. Sotto, le tribune piene e il tavolo del Concilio con le candele già accese. Dall'altra parte, in piedi, il figlio senza nome di Casa Tasso."], ["tc_ottavia", "[pensa] Stavolta firmo. E il patto, stavolta, lo scrivo io."]],
        npcs: (s) => [{ id: "tc_araldo", at: [14, 8] }, { id: "tc_ysolde", at: [8, 13] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 27, 0, "a"); lay(0, 17, 27, 17, "a"); lay(0, 0, 0, 17, "a"); lay(27, 0, 27, 17, "a");
          lay(4, 6, 23, 11, ":"); lay(5, 7, 22, 10, "+"); lay(14, 3, 14, 16, ":");
          [[5, 4], [22, 4], [5, 12], [22, 12]].forEach(([x, y]) => put(x, y, "Q"));
          [[2, 3], [25, 3], [2, 14], [25, 14]].forEach(([x, y]) => put(x, y, "t")); put(11, 15, "s");
        },
      },
    };
    function final() {
      K.concilio({ title: "La finale · il Concilio contro Casa Tasso", us: "Casa Ferroquercia", usSigil: C.ferroquercia.s, usColor: C.ferroquercia.c, opp: { name: "Casa Tasso", color: C.tasso.c, sigil: C.tasso.s, honor: 0.8 }, oppStyle: "pressing",
        cards: ["centro", "sinistra", "destra", "tregua", "ostaggio"], ravens: 1 + (F.is("oF_pubblico") ? 0 : 1) + 1, turns: 10, winTitle: "LA FINALE È TUA",
        intro: `<p>Dieci turni. Stavolta giochi tu, reggente: ${F.is("oF_pubblico") ? "il Consiglio sa la verità, e il tuo nome vale di nuovo qualcosa" : "i tuoi corvi sanno dove cadrà ogni tradimento di Ostrico"}. Un patto solo, al tavolo, vale più di dieci.</p>` }, (r) => {
        if (!r.win) return K.scene([["tc_ostrico", "Un peccato, Lady. Ma vi basta firmare di nuovo: ci penserò io alle carte."], ["tc_ottavia", "[arrabbiato] Ne riparliamo. Stavolta rileggo io."]], () => K.enterZone("tc_loggia"), "tc_loggia");
        setStep(N, 1); bond("onore", 2);
        K.scene([["voce", "L'ultimo turno. L'ultimo attacco. La cera cade sul patto, e per la prima volta resta dove l'hai messa."], ["tc_araldo", "(DO!) Casa Ferroquercia vince la finale del Torneo! …E nessun patto è stato tradito. (Do. Do.) Storico."]], () => K.enterZone("tc_loggia"), "tc_loggia");
      });
    }
    function endingAsk() {
      ask("tc_ottavia", "(Il Trono di Cuoio, lassù, ti aspetta. Ostrico è in tribuna, pallido. Tutta Valdoro guarda la reggente che non ha tradito niente. Cosa scrivi?)", [
        { label: "Leggi le firme viola davanti a tutti", sub: "Finale: La verità del cuoio", big: true, fn: () => ending("ottavia_verita") },
        { label: "Firma un patto vero con il figlio senza nome", sub: "Finale: L'unico patto", big: true, fn: () => ending("ottavia_parola") },
      ], "tc_loggia");
    }
    function ending(kind) {
      if (window.__sogni && typeof window.__sogni.unlockCard === "function") window.__sogni.unlockCard("tc_ottavia");
      const msg = K.reward("end:" + kind, { coins: 300, cos: ["tc_c5"] }); K.end(kind); finishChapter(N, kind); setStep(N, 3);
      const L = {
        ottavia_verita: [["voce", "Apri l'archivio davanti al Consiglio, accosti le carte alla candela e le righe viole affiorano una dopo l'altra. Sette casate in silenzio. Ostrico non fugge: si siede."], ["tc_ottavia", "[felice] Settant'anni di bugie con il mio nome. Domani il calamaio d'argento va al museo."], ["tc_ysolde", "[ride] Ci voleva una reggente per scoprire che l'inchiostro mente. Io lo sapevo da sempre, ma non sapevo come dirlo bene."]],
        ottavia_parola: [["voce", "Non leggi niente. Ti siedi al tavolo del Concilio, davanti al figlio senza nome, e scrivi una riga sola con la penna d'argento: «Non tradirò questo patto»."], ["tc_ottavia", "[furbo] Ti avviso: è l'unico che firmo e rispetto. Tienitelo caro. E non dirlo a nessuno."], ["tc_ostrico", "(Fissa la cera. La cera non diventa viola. Per la prima volta in trent'anni, il Cancelliere non ha niente da sistemare.)"]],
      }[kind];
      K.scene([...L, ["voce", `<b>DOSSIER CONCLUSO!</b> ${msg.join(" · ")}<br>Hai sbloccato la carta <b>«Ottavia Ferroquercia»</b> nella Squadra dei Sogni!`]], () => K.openMain(), "tc_loggia");
    }
    const talk = {
      tc_araldo() {
        if (S() === 0) return ask("tc_araldo", "(Do!) Finale del Torneo del Trono: Casa Ferroquercia contro Casa Tasso! Al tavolo del Concilio, come vuole la tradizione.", [{ label: "Siedi al tavolo del Concilio", sub: "Dieci turni · patti e partita", cls: "hot", fn: final }]);
        return say([["tc_araldo", "(Do.) La reggente ha vinto senza tradire niente. Devo scrivere una tromba nuova."]]);
      },
      tc_ysolde() {
        if (S() === 1) return ask("tc_ysolde", "[felice] Non ci ha creduto nessuno. Nemmeno io. (Ti guarda.) E adesso, reggente?", [{ label: "Decidi il finale", sub: "Una scelta, due finali", cls: "hot", fn: endingAsk }]);
        return say([["tc_ysolde", "[furbo] Dopo la finale parlo io. Prima, guardo."]]);
      },
    };
    return { n: N, title: "La Finale alla Rovescia", sub: "Dossier Incompiuto: il Concilio, dal punto di vista di Ottavia", dossier: true,
      avatar: { name: "Ottavia Ferroquercia", num: 7, cast: { name: "Ottavia Ferroquercia", sub: "La reggente", style: "bun", hair: "#e8c84a", eye: "#3a5a3a", skin: "#f0d8c0", shirt: "#8a6a1a", acc: ["corona"] } },
      goal, start: "tc_loggia", introBg: "tc_arena", zones, talk,
      intro: () => [["tc_ottavia", "Oggi non tradisco. Non per bontà: per curiosità. Voglio vedere che faccia hanno, quando un patto regge."]] };
  }
  boot();
})();
