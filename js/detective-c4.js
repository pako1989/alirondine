// js/detective-c4.js - DETECTIVE DI CAMPO · Capitolo 4 «L'udienza»
// Vanni ha parlato, ma il Consiglio della Lega nega tutto. Al Tribunale sportivo c'è l'udienza: il Presidente Tommaso Valli,
// con il garofano all'occhiello, si difende con il sorriso. Le prove raccolte nei tre casi tornano tutte: una per ogni bugia.
// È il capitolo dei volti: ogni prova giusta cambia l'espressione di Valli, finché il sorriso non si spegne.
(function () {
  "use strict";
  function boot() { const D = window.__detective; if (!D || !D.addChapter || !D._has(3)) return setTimeout(boot, 120); D.addChapter(chapter4); }
  function chapter4(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 4, S = () => K.stepOf(N);
    K.cast("dc_giudice", { acc: ["occhiali"], name: "Giudice sportivo Ilaria Marmo", tag: "gray", hair: "#c8c8d0", style: "bun", skin: "#e8c4a0", eye: "#3a3a4a", bg: ["#1a1a1a", "#d8b46a"], shirt: "#1a1a1a" },
      "Giudice del Tribunale sportivo da trent'anni. Non alza mai la voce: abbassa gli occhiali. Quando li abbassa del tutto, nell'aula cala il silenzio.");
    K.cos("dc_c4", { kind: "acc", label: "Martelletto del Tribunale", val: "medaglia", from: "Capitolo 4 di Detective di Campo" });
    K.lore("l_udienza", { t: "L'udienza", d: "Davanti al Tribunale sportivo le prove contano più delle parole. Ogni bugia ha la sua prova, e ogni prova presentata al momento giusto cambia la faccia di chi mente." });
    const goal = (s) => ({
      0: "Il Tribunale sportivo ha fissato l'udienza. Parla con l'ispettrice Agata, nell'aula.",
      1: "Il Presidente Valli è alla sbarra. Ascolta le sue bugie e presenta la prova giusta.",
      2: "Valli ha confessato. La giudice Marmo aspetta la vostra richiesta.",
    }[s] || "Il capitolo 4 è concluso.");
    const zones = {
      dc_tribunale: {
        interior: true, region: "casa", name: "Detective di Campo · Il Tribunale sportivo", short: "Il Tribunale sportivo", sub: "L'udienza del Consiglio della Lega", bg: "dc_tribunale", w: 20, h: 13, start: [10, 10], outside: ["dc_citta", 10, 10],
        act: { T: "Guarda il banco della giudice", L: "Guarda gli archivi", W: "Guarda dalla finestra", v: "Esci" },
        flavor: { T: "Il banco della giudice: un martelletto, una caraffa d'acqua, e il regolamento della Lega aperto alla pagina «Illecito sportivo».", L: "Archivi di cartone, con le date di tutte le finali. Quello del 1987 è più spesso degli altri.", W: "Dalla finestra si vede lo stadio di Portagrigia. Piove, naturalmente." },
        intro: [["voce", "Il Tribunale sportivo: un'aula di legno scuro, le panche lucide, la bilancia dipinta sul muro. In fondo, la giudice Ilaria Marmo. Alla sbarra, con il garofano all'occhiello, il Presidente Tommaso Valli. Sorride."]],
        npcs: (s) => [{ id: "dc_giudice", at: [13, 3] }, { id: "dc_valli", at: [6, 5] }, { id: "dc_agata", at: [14, 7] }],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(8, 1, 12, 1, "T"); lay(2, 1, 5, 1, "L"); lay(15, 1, 17, 1, "W"); lay(3, 8, 8, 8, "b"); lay(12, 9, 17, 9, "b"); put(2, 10, "s"); },
      },
    };
    const ROUNDS = [
      { ok: ["contratto", "ricevute"], prompt: "[furbo] (Valli si sistema il garofano.) «Signora giudice, il Consiglio non ha mai visto un contratto del genere. «Favola garantita»? Sembra il titolo di un film. Noi organizziamo partite, non romanzi.»", react: "[sorpreso] (Il garofano gli scivola dall'occhiello.) …Quella firma. Quella firma è… una firma come tante. Si somigliano tutte, le firme." },
      { ok: ["nastro87"], prompt: "[furbo] «Il 1987? Io nel 1987 ero un ragazzo, signora giudice. Facevo il raccattapalle. Non so niente di quella finale, se non quello che dicono i giornali.»", react: "[arrabbiato] (Batte la mano sul banco.) Il raccattapalle! Sì! E il raccattapalle cambiava i palloni! Me l'avevano chiesto i grandi! Avevo sedici anni!" },
      { ok: ["ombrello", "tribuna"], prompt: "«Va bene, va bene. Ma l'ombrello era di Vanni. Io, in tribuna, ero seduto due posti più in là. Non ho mai aperto un ombrello in vita mia, signora giudice.»", react: "[triste] (Si guarda le mani. Il sorriso non c'è più.) …No. L'ombrello lo apriva Vanni. Ma lo comprava il Consiglio. Rosso. Sempre rosso. Lo sceglievo io." },
    ];
    function round(i) {
      const R = ROUNDS[i];
      K.present({
        who: "dc_valli", bg: "dc_tribunale", ok: R.ok, prompt: R.prompt,
        right: () => { bond("fiuto", 1); say([["dc_valli", R.react]], () => (i + 1 < ROUNDS.length ? round(i + 1) : confessed())); },
        wrong: () => { bond("fiuto", -1); F.add("dc_wrong4", 1); say([["dc_valli", "[ride] (Sorride alla giudice.) Signora giudice, l'assistente ci mostra… questo. Con tutto il rispetto: non dice niente."], ["dc_giudice", "[pensa] (Abbassa gli occhiali di un centimetro.) Assistente. Ascolti bene cosa nega il Presidente, poi presenti la prova."]], () => round(i)); },
        back: done,
      });
    }
    function confessed() { setStep(N, 2); questDone("dc_udienza"); K.learnLore("l_udienza"); say([["dc_giudice", "[pensa] (Abbassa gli occhiali del tutto. Nell'aula non vola una mosca.) Presidente Valli. Lei ha qualcosa da aggiungere?"], ["dc_valli", "[triste] …No, signora giudice. Ho finito i garofani."]]); }
    const talk = {
      dc_agata() {
        if (S() === 0) return say([["dc_agata", "[pensa] Vanni ha parlato, ma il Consiglio dice che Vanni mente. Allora tocca a noi: oggi, in quest'aula, ogni loro bugia avrà la sua prova. Le abbiamo tutte, assistente. Le abbiamo raccolte in tre casi."], ["dc_agata", "[furbo] Valli sorride. Sorride sempre. Vediamo quanto dura."]], () => { setStep(N, 1); quest("dc_udienza", "L'udienza", "Presenta le prove giuste alle bugie di Valli."); done(); });
        return say([["dc_agata", S() >= 2 ? "[felice] (Stringe la fisarmonica, che si è portata anche in tribunale.) Trentacinque anni, assistente. Trentacinque." : "Ascolta cosa nega, e rispondi con la prova. Non con le parole."]]);
      },
      dc_valli() { if (S() === 1) return round(0); return say([["dc_valli", S() >= 2 ? "[triste] (Non sorride più. Si gira il garofano tra le dita.)" : "[furbo] Assistente. Che piacere. Si accomodi pure: oggi sarà una giornata breve."]]); },
      dc_giudice() {
        if (S() === 2) return ask("dc_giudice", "Il Tribunale ha sentito abbastanza. Ispettrice, assistente: cosa chiedete?", [
          { label: "«La radiazione del Consiglio»", sub: "Fuori dal calcio, per sempre", big: true, fn: () => fine4("radiazione") },
          { label: "«Che la finale del 1987 venga rigiocata»", sub: "Con le squadre di allora, ormai vecchie", big: true, fn: () => fine4("rigiocata") },
        ], "dc_tribunale");
        return say([["dc_giudice", "[pensa] L'udienza è aperta. Il Tribunale ascolta: le prove, non le chiacchiere."]]);
      },
    };
    function fine4(kind) {
      const msg = K.reward("c4:dc", { coins: 80, cos: ["dc_c4"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "radiazione" ? [["dc_giudice", "Radiazione. Il Consiglio della Lega delle Città è sciolto. (Il martelletto: TOC.)"], ["dc_agata", "[triste] (Agata non esulta. Si siede, e per un minuto non dice niente. Poi suona tre note sulla fisarmonica: le prime tre dell'inno della sua squadra del 1987.)"]]
        : [["dc_giudice", "[sorpreso] (Si toglie gli occhiali.) Rigiocare il 1987? …Il regolamento non lo vieta. Accolto."], ["voce", "Un mese dopo, allo stadio di Portagrigia, ventidue signori con le ginocchia scricchiolanti rigiocano la finale del 1987. Agata è in porta. Para un rigore. Piange per tutto il secondo tempo."], ["dc_agata", "[ride] Assistente. Il pallone stavolta era quello giusto. Pesante come una promessa."]], () => say([["voce", `<b>FINE DEL CAPITOLO 4.</b> ${msg.join(" · ")}`]], () => K.openMain()), "dc_tribunale");
    }
    return { n: N, title: "L'udienza", sub: "Il Tribunale sportivo, il Presidente Valli, le prove di tre casi", goal, start: "dc_tribunale", introBg: "dc_tribunale", zones, talk,
      intro: () => [["voce", "<b>DETECTIVE DI CAMPO</b>, capitolo 4. Una settimana dopo la finale. Il Consiglio della Lega nega tutto, e il Tribunale sportivo fissa l'udienza. Piove, naturalmente."]] };
  }
  boot();
})();
