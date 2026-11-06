// js/trono-c4.js - IL TRONO DI CUOIO · Capitolo 4 «Il Sorriso della Reggente» (DOSSIER INCOMPIUTO)
// Punto di vista ribaltato: giochi la reggente Ottavia Ferroquercia, la notte prima del Torneo. Quella che «tradisce ogni
// patto» scopre perché: qualcuno riscrive le sue firme. Si apre con l'opzione Dossier e 2 finali trovati.
(function () {
  "use strict";
  function boot() { const D = window.__trono; if (!D || !D.addChapter || !D._has(3)) return setTimeout(boot, 120); D.addChapter(chapter4); }
  function chapter4(K) {
    const { F, say, ask, done, setStep, bond, finishChapter } = K;
    const N = 4, S = () => K.stepOf(N);
    K.cast("tc_ostrico", { acc: ["occhiali"], name: "Il Cancelliere Ostrico", tag: "", hair: "#6a6a6a", style: "ordinato", skin: "#e0c8b0", eye: "#2a2a2a", bg: ["#2a1a0c", "#9a8ac8"], shirt: "#3a2a4a" },
      "Cancelliere di Casa Ferroquercia da trent'anni. Voce di velluto, calamaio sempre pieno, e un'abitudine: «sistemare» le carte prima che la reggente le rilegga.");
    K.lore("l_ottavia_firme", { t: "Le firme della reggente", d: "A Valdoro tutti sanno che Ottavia Ferroquercia tradisce ogni patto che firma. Nessuno si è chiesto chi, la sera, rilegge le carte prima della cera." });
    const goal = (s) => ({
      0: "Il Cancelliere Ostrico ti aspetta in giardino con i patti di domani.",
      1: "Lo studio della Casata, la casa in alto: guarda l'archivio dei patti.",
      2: "Lady Ysolde è in giardino. Parlale, e decidi cosa farne della verità.",
    }[s] || "Il Dossier continua: puoi aprire il Capitolo 5.");
    const zones = {
      tc_giardino: {
        region: "capitale", name: "Dossier Trono · Il giardino dei corvi", short: "Il giardino dei corvi", sub: "Palazzo Ferroquercia, la notte prima del Torneo", bg: "tc_capitale", time: "notte", travel: [14, 18],
        w: 30, h: 20, start: [14, 18], items: [],
        banners: { "6,5": "ferroquercia", "22,5": "ferroquercia", "6,13": "ferroquercia", "22,13": "ferroquercia", def: "ferroquercia" },
        areas: [[0, 0, 29, 19, "Il giardino dei corvi"]],
        flavor: { t: "Un tasso potato a forma di corona. Qualcuno ci ha appeso un nastro nero: i corvi di Ysolde marcano il territorio." },
        intro: [["voce", "Palazzo Ferroquercia, notte. Lanterne tra i salici, corvi sui muri, e in fondo al giardino lo studio della Casata: una finestra accesa. Domani comincia il Torneo del Trono. Tutti dicono che la reggente tradirà ogni patto. Tu, per la prima volta, vuoi sapere perché."]],
        npcs: (s) => [{ id: "tc_ostrico", at: [14, 10] }, { id: "tc_ysolde", at: [8, 14] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 19, 29, 19, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a");
          lay(13, 4, 15, 18, ":"); lay(4, 9, 25, 10, ":");
          house(11, 1, 8, 3, { door: [15, 3], roof: "#8a6a1a", wall: "#d8c8a8", rr: 2, enter: { to: "tc_studio", at: [10, 10] } });
          [[6, 5], [22, 5], [6, 13], [22, 13]].forEach(([x, y]) => put(x, y, "Q"));
          [[2, 4], [27, 4], [2, 15], [27, 15], [9, 6], [19, 6], [9, 16], [19, 16]].forEach(([x, y]) => put(x, y, "t")); put(11, 14, "s");
        },
      },
      tc_studio: {
        interior: true, region: "casa", name: "Dossier Trono · Lo studio della Casata", short: "Lo studio della Casata", sub: "Dove si rilegge ciò che si firma", bg: "tc_trono", w: 20, h: 13, start: [10, 10], outside: ["tc_giardino", 15, 4],
        banners: { "3,1": "ferroquercia", "17,1": "ferroquercia", def: "ferroquercia" },
        act: { L: "Guarda l'archivio dei patti", v: "Esci" },
        flavor: { L: "Un armadio di patti rilegati, uno per anno. Tutti con la tua firma. Tutti con una clausola che non ricordi di aver scritto." },
        intro: [["voce", "Lo studio. Scaffali di patti, un calamaio d'argento, una candela che non vuole spegnersi. Qui si rilegge tutto, prima della cera."]],
        npcs: () => [],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(8, 5, 12, 6, "T"); lay(2, 3, 4, 3, "L"); lay(15, 3, 17, 3, "L"); [4, 15].forEach((x) => put(x, 1, "Q")); },
      },
    };
    const talk = {
      tc_ostrico() {
        if (S() === 0) return ask("tc_ostrico", "Lady Ottavia. Tre patti per domani: Corvonero, Salmastra, Rovoardente. Voi firmate, io rilego, la cera la mette il fuoco. Come sempre. (Sorride.) Ormai potreste firmare a occhi chiusi.", [{ label: "Firma i tre patti", sub: "La penna è la tua, la clausola no", cls: "hot", fn: () => say([["tc_ottavia", "[pensa] (La penna scorre. L'inchiostro, sotto la luce della lanterna, per un attimo è viola. Poi torna nero.)"], ["tc_ostrico", "Ottimo. Domani sarà una grande giornata per la Casata. Come ogni sette anni."], ["voce", "Qualcosa non quadra. Nello studio, in alto, c'è l'archivio dei patti degli anni passati."]], () => { setStep(N, 1); K.quest("tc_firme", "L'inchiostro viola", "Guarda l'archivio nello studio della Casata."); done(); }) }]);
        return say([["tc_ostrico", S() === 1 ? "Lo studio è chiuso fino all'alba, Lady. Ma per voi… naturalmente." : "Il Torneo non aspetta, Lady. Nemmeno io."]]);
      },
      tc_ysolde() {
        if (S() < 2) return say([["tc_ysolde", "[furbo] Ottavia. Stanotte sei più pallida del solito. I miei corvi dicono che hai letto troppo. Fa male, sai? Alla reputazione."]]);
        if (S() === 2) return ask("tc_ysolde", "[pensa] Hai trovato qualcosa. Lo vedo. (Abbassa la voce.) Ogni sette anni, Ostrico cambia le clausole con l'inchiostro del tramonto: scrive nero, a mezzanotte diventa viola, e il patto si rovescia. Io lo so da sempre. Cosa fai, reggente?", [
          { label: "«Domani lo dirò a tutto il Consiglio»", sub: "La verità in pubblico", cls: "hot", big: true, fn: () => closeChapter("pubblico") },
          { label: "«Tienilo per te. Domani tradirò io, ma davvero»", sub: "Il silenzio, e una trappola", big: true, fn: () => closeChapter("silenzio") },
        ]);
        return say([["tc_ysolde", "Ci vediamo in tribuna, reggente."]]);
      },
    };
    function closeChapter(kind) {
      F.set(kind === "pubblico" ? "oF_pubblico" : "oF_silenzio", true); setStep(N, 3); bond("onore", kind === "pubblico" ? 3 : 0);
      finishChapter(N, "dossier_c4_" + kind); const msg = K.reward("tc_c4_dossier", { coins: 180 });
      K.scene([["tc_ottavia", kind === "pubblico" ? "[arrabbiato] Sette anni di sorrisi finti, e il burattino ero io. Domani il Consiglio saprà tutto." : "[furbo] Sorriderò ancora. Ma stavolta il sorriso è il mio, e la trappola pure."], ["voce", `<b>CAPITOLO 4 DEL DOSSIER CONCLUSO</b> ${msg.join(" · ")}`]], () => K.openMain(), "tc_giardino");
    }
    const obj = {
      "tc_studio:L": () => {
        if (S() === 1) return say([["voce", "Prendi un patto del 4° anno e lo avvicini alla candela. Sotto il calore, una riga nera sbiadisce e affiora una riga viola: la clausola che ti ha fatto tradire. Settanta patti, settanta righe viola. Non erano tradimenti tuoi."], ["tc_ottavia", "[arrabbiato] Settant'anni di reputazione. Costruiti con inchiostro che sbiadisce."]], () => { setStep(N, 2); K.quest("tc_firme", "L'inchiostro viola", "Lady Ysolde è in giardino: parlale."); done(); });
        return say([["voce", S() >= 2 ? "L'archivio dei patti. Ogni riga viola è una bugia con il tuo nome sopra." : "Patti rilegati, uno per anno. Per ora sembrano solo carta."]]);
      },
    };
    return { n: N, title: "Il Sorriso della Reggente", sub: "Dossier Incompiuto: la notte prima del Torneo, dal punto di vista di Ottavia", dossier: true,
      avatar: { name: "Ottavia Ferroquercia", num: 7, cast: { name: "Ottavia Ferroquercia", sub: "La reggente", style: "bun", hair: "#e8c84a", eye: "#3a5a3a", skin: "#f0d8c0", shirt: "#8a6a1a", acc: ["corona"] } },
      goal, start: "tc_giardino", introBg: "tc_capitale", zones, talk, obj,
      intro: () => [["tc_ottavia", "Tutta Valdoro dice che tradisco ogni patto. Strano: io ricordo di averli firmati con cura."]] };
  }
  boot();
})();
