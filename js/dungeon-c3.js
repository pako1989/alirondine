// js/dungeon-c3.js - DUNGEON DI FINE STAGIONE · Capitolo 3 «La Tribuna d'Oro»
// Il Piano 3: gradoni pieni di sagome grigie, un portale d'oro, Cenere. Qui si scopre di chi è il fischietto (seconda svolta) e si sceglie come
// finisce il Torneo: quattro finali, uno segreto. Dopo il capitolo si può tornare giù e scegliere un altro finale.
(function () {
  "use strict";
  function boot() { const D = window.__dungeon; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), morti = () => F.get("dg_morti", 0) | 0;
    const runes = () => ["dg_campo", "dg_p1", "dg_p2", "dg_p3"].reduce((s, z) => s + ((((K.api.trRec() || {}).got || {})[z]) || []).length, 0);
    K.cast("dg_cenere", { shape: "fiamma", name: "Cenere", tag: "", skin: "#8a8478", eye: "#ff7a1a", bg: ["#0e0a06", "#8a8478"], shirt: "#4a4640", num: "91" },
      "Ciò che resta di un fuoco quando smette di scaldare. Custodisce il novantunesimo minuto e non lo lascia a nessuno. Parla piano, senza rancore, come un guardiano che sa di essere l'ultimo.");
    K.cos("dg_c3", { kind: "shirt", label: "Maglia della Tribuna d'Oro", val: "#c8a040", from: "Capitolo 3 di Dungeon di Fine Stagione" });
    K.cos("dg_e1", { kind: "shirt", label: "Maglia dell'ultimo fischio", val: "#e8e4dc", from: "Finale «L'ultimo fischio»" });
    K.cos("dg_e2", { kind: "shirt", label: "Grembiule del Campo Base", val: "#7a4a2a", from: "Finale «Il Campo Base non chiude mai»" });
    K.cos("dg_e3", { kind: "shirt", label: "Maglia del novantunesimo", val: "#3a6ac8", from: "Finale «Il novantunesimo minuto»" });
    K.cos("dg_e4", { kind: "shirt", label: "Maglia senza numero", val: "#ff7a1a", from: "Finale segreto" });
    K.lore("l_fischietto", { t: "Il Fischietto", d: "Nel Campo Base c'è un fischietto che non suona. Chi lo tiene decide quando finisce una partita. Nel Registro non c'è scritto chi l'ha tenuto per trent'anni." });
    const goal = (s) => ({
      0: "Il Campo Base. Il Mister ti guarda in modo diverso.",
      1: "Scendi al Piano 3, la Tribuna d'Oro, e cerca Ruggine.",
      2: "Piano 3: sciogli i tre sigilli e apri la Porta Grande. Dietro c'è Cenere.",
    }[s] || "La storia è conclusa. Puoi tornare alla Tribuna e scegliere un altro finale.");

    const p3 = K.pianoZone(3, { spec: { itemCos: "dg_runa", items: [[24, 3], [3, 16], [22, 16]], areas: [[1, 1, 26, 17, "La Tribuna d'Oro"]], npcs: (s) => [{ id: "dg_ruggine", at: [12, 12] }, ...(s ? [{ id: "dg_asterio", at: [18, 13] }] : [])],
      intro: [["voce", "La Tribuna d'Oro. Gradoni infiniti, pieni di sagome grigie che battono le mani senza fare rumore. In fondo, un portale con il bordo d'oro. L'aria sa di polvere calda e di fine partita."]] } });

    K.hooks[3] = {
      pre: (go) => S() === 2 ? K.scene([["dg_cenere", "(La figura di cenere ti aspetta in mezzo al campo, immobile. Quando parla, si sentono le sagome grigie trattenere il fiato.) Sei arrivato. Bene. Io tengo il minuto. Non è un lavoro: è una veglia."], ["dg_cenere", "Chi vince qui, ha il diritto di decidere come finisce il Torneo. Io non l'ho mai deciso. Aspetto che qualcuno mi dica quando posso spegnermi."], ["dg_fiamma", "[triste] (Si stringe piccola sulla tua spalla.) Mi fa pena. E mi fa paura. Tutte e due le cose."]], go, "dg_p3") : go(),
      won: (r, d) => S() === 2 ? svolta() : K.scene([["dg_cenere", "(Si ricompone, un po' più piccola.) Di nuovo. Non mi stanco. È il mio difetto."]], () => K.pianoDone(3), "dg_p3"),
      lost: () => [["dg_cenere", "(Tra le sagome grigie, un applauso lento.) Ancora. Il minuto non ha fretta: io nemmeno."]],
    };
    // la seconda svolta: di chi è il fischietto
    function svolta() {
      K.scene([["voce", "Cenere si sfalda come un fuoco in un camino. Sul campo resta soltanto un fischietto, nero, caldo, con una sola incisione: «ARBITRO · FINALE»."], ["dg_mister", "(Entra dall'ombra del portale. Senza occhiali, senza fretta. Si china, raccoglie il fischietto e lo tiene nel palmo.) Trent'anni di silenzio. Ti dovevo una spiegazione, e anche a lui."], ["dg_mister", "Ero io, l'arbitro di quella finale. Il capitano calciò alto. Se avessi fischiato, il suo errore sarebbe diventato la fine di tutto. Avevo il fischietto in bocca. Non ho soffiato."], ["dg_mister", "Il minuto è rimasto aperto. Si è fatto stadio, poi torneo, poi dungeon. Ogni volta che qualcuno scende, la brace vive. Io non potevo spegnerla. Così ho tenuto il Campo Base: perché nessuno scendesse da solo."], ["dg_fiamma", "[triste] Io sono la scintilla di quel fischietto. Lo sapevo, ma non l'avevo mai detto. Se il fischietto suona, io… (Si ferma. Poi, piano:) Io non so cosa succede."], ["dg_mister", "Adesso il fischietto è nelle tue mani. Il Torneo è tuo, Campione. Decidi tu come finisce."]],
        () => { F.set("dg_svolta2", true); K.learnLore("l_fischietto"); finale(); }, "dg_p3");
    }
    // la scelta del finale
    function finale() {
      const opts = [];
      if (runes() >= 12 && morti() >= 3) opts.unshift({ label: "«Nessun fischio. Giocate tutti.»", sub: "Segreto: tutte le rune e almeno tre cadute", cls: "hot", big: true, fn: () => ending("senzafischio") });
      if (K.stat("ruggine") >= 4) opts.unshift({ label: "«Ruggine, ripeti quel rigore»", sub: "Chi scende da più tempo di te si fida di te", cls: "hot", big: true, fn: () => ending("minuto") });
      opts.push({ label: "«Fischia: il Torneo è finito»", sub: "Chiudi il Torneo di Fine Stagione", big: true, fn: () => ending("ultimo") });
      opts.push({ label: "«Il Campo Base resta aperto»", sub: "Rimani a custodire la brace", big: true, fn: () => ending("brace") });
      ask("dg_mister", "(Ti porge il fischietto. Le dita gli tremano appena.) Una sola regola: qualunque cosa decidi, decidila come se fosse l'ultima partita. Perché lo è, per qualcuno.", opts, "dg_p3");
    }
    K.finale = finale;
    function ending(kind) {
      const R = { ultimo: { coins: 150, cos: ["dg_c3", "dg_e1"] }, brace: { coins: 150, cos: ["dg_c3", "dg_e2"] }, minuto: { coins: 170, cos: ["dg_c3", "dg_e3"] }, senzafischio: { coins: 260, cos: ["dg_c3", "dg_e4"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); questDone("dg_c3q"); finishChapter(N, kind); setStep(N, 9); K.runClear();
      const lines = {
        ultimo: [["dg_mister", "(Porta il fischietto alla bocca. Esita. Poi lo dà a te.) Fallo tu. Io l'ho tenuto troppo."], ["voce", "Un solo fischio, lungo, pulito. Le sagome grigie si alzano in piedi e applaudono, questa volta con un suono vero. Le torce si spengono una a una, senza fretta. Fiamma si fa piccola, poi brilla, poi sale: «Era ora», dice. «Grazie per il passaggio.»"], ["voce", "<b>FINALE · L'ULTIMO FISCHIO.</b> L'Ipogeo si svuota di luce e diventa una cantina qualsiasi, con i muri un po' umidi. All'alba, due vecchi escono dallo Stadio Vecchio senza voltarsi. Il Campione porta con sé una cosa sola: il ricordo di ogni stanza."]],
        brace: [["dg_mister", "[pensa] (Si siede sul bordo del campo con il fischietto in grembo.) Lo tengo io, allora. Ma non per paura: per mestiere. È diverso."], ["dg_fiamma", "[felice] Io resto. Ho sempre pensato che il Campo Base avesse bisogno di una che non si spegne."], ["voce", "<b>FINALE · IL CAMPO BASE NON CHIUDE MAI.</b> La brace resta accesa e il Campo Base resta aperto. Per la prima volta il dungeon ha un custode che sa quanto costa scendere. Ogni fine stagione qualcuno bussa: «È aperto?». «Sempre», dice il Campione. «Ma prima, un po' di zuppa.»"]],
        minuto: [["dg_ruggine", "(Ti guarda. Poi guarda il pallone. Poi guarda il Mister.) Ho aspettato trent'anni per tirarlo di nuovo. Non ho mai smesso di allenarmi. Nessuno lo sa, ma ho tirato mille rigori, ogni notte, a una porta senza portiere."], ["dg_mister", "(Con il fischietto in bocca, per la prima volta senza paura.) Quando vuoi, Capitano."], ["voce", "<b>FINALE · IL NOVANTUNESIMO MINUTO.</b> Tre persone giocano su un campo vero, all'alba, la finale di trent'anni fa. Finisce 1 a 1. Nessuno festeggia. Tutti ridono. Il minuto che mancava, finalmente, passa."]],
        senzafischio: [["dg_mister", "[sorpreso] (Guarda il fischietto, poi te.) Nessun fischio? (Un lungo silenzio.) Sai che è la cosa più coraggiosa che qui sotto abbia mai sentito dire?"], ["dg_cenere", "(Dalle ceneri, una voce quasi allegra.) Giocate. Io faccio da pubblico. Sono molto bravo a fare da pubblico."], ["voce", "<b>FINALE SEGRETO · LA PARTITA SENZA FISCHIO.</b> Per una notte non c'è arbitro, non c'è dungeon, non c'è punteggio. Giocano tutti: i mitici, i caduti, un fuoco piccolo piccolo. Nessuno ricorda chi ha vinto. Tutti ricordano il pallone che passava da mano a mano."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "dg_finale");
    }
    function asterio() { // la partita secondaria: il motore si sceglie
      const after = (r) => K.scene([["dg_asterio", r && r.win ? "[ride] Ancora una volta! Domani rifaccio i pilastri. Più larghi, così ti passo in mezzo." : "[felice] Visto? Con la pietà non si segna. Con la carica, sì."]], () => K.enterZone("dg_p3"), "dg_p3");
      ask("dg_asterio", "(Seduto sul gradone più basso con un cuscino sotto.) Sono in pensione. Mi hanno dato il posto in tribuna. Ma ho ancora le gambe: una partita d'onore? Come la giochiamo?", [
        { label: "Nelle Stanze dell'Ipogeo", sub: "La partita della saga: la stanza del Terzino", cls: "hot", fn: () => K.dungeonMatch({ kind: "minotauro", intro: "Una stanza di prova, con Asterio in versione amichevole." }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "dg_onore", alt: "az,cage,hd", force: false, oppTeam: "Il Terzino e i Pilastri", oppColor: "#a8503a", us: "La Tribuna", homeKit: ["#c8a040", "#241810"], mate: "Ruggine", squad: ["Ruggine", "Fiamma", "Meda"], chap: "Dungeon di Fine Stagione · La partita d'onore", bg: "dg_p3", oppNames: ["Asterio", "Pilastro", "Colonna", "Architrave", "Capitello"], intro: "Sulla Tribuna d'Oro, davanti a un pubblico di sagome grigie.", done: after }) },
        { label: "Dopo", fn: done },
      ], "dg_p3");
    }
    const talk = {
      dg_mister() {
        const s = S();
        if (s === 0) return K.scene([["dg_mister", "(Non ti guarda. Guarda il fischietto, appeso a un chiodo, e il chiodo.) Sotto le Cisterne c'è la Tribuna d'Oro. Lì finisce il Torneo. Lì c'è Cenere. (Pausa.) Lì ci sono anch'io, da trent'anni. Ma questo, per ora, non lo dico."], ["dg_fiamma", "[pensa] Mister, hai appena detto «per ora». Lo sa anche il fuoco, che vuol dire «presto»."]], () => { setStep(N, 1); quest("dg_c3q", "La Tribuna d'Oro", "Scendi al Piano 3, trova Ruggine, supera la Porta Grande."); done(); }, "dg_campo");
        if (s === 1 || s === 2) return say([["dg_mister", "Quando scendi, ricorda: non sei obbligato a vincere. Sei obbligato a decidere. Sono due cose diverse. La seconda è più difficile."]]);
        if (s >= 9) {
          const n = K.mem().ends.length;
          return ask("dg_mister", `(Sorride, e il sorriso è nuovo.) La storia è finita, ma il Torneo ricomincia ogni fine stagione. Finali trovati: ${n} su 4. Vuoi tornare alla Tribuna e provare un altro modo di chiudere?`, [
            { label: "Torna alla Tribuna", sub: "Rifai la Porta Grande e scegli un altro finale", cls: "hot", fn: () => { setStep(N, 2); K.scene([["dg_mister", "Il fischietto ti aspetta sul bordo del campo. Scegli con calma. O in fretta. Basta che tu scelga."]], () => done(), "dg_campo"); } },
            { label: "Resta al Campo Base", fn: done },
          ], "dg_campo");
        }
        return K.PASS;
      },
      dg_ruggine() {
        const s = S();
        if (s === 1 && K.inZone("dg_p3")) return K.scene([["dg_ruggine", "(Ti aspettava sul gradone, senza cappellino, con le mani in tasca.) Sono sceso prima di te. Volevo vedere il posto in cui l'ho perso. È più piccolo di come lo ricordavo. Di solito le cose sono più grandi: questa, no."], ["dg_ruggine", "Io non vincerò mai qui. Ma tu sì. Guarda il portale: ci vuole una mano ferma. Ti starò dietro, a una certa distanza, per rispetto. O per le ginocchia."]], () => ask("dg_ruggine", "(Ti allunga il pallone.) Se me lo chiedi, resto con te fino alla porta. Se non me lo chiedi, resto lo stesso. Ma vorrei sentirmelo dire.", [
          { label: "«Resta con me»", sub: "Fiducia", big: true, fn: () => { bond("ruggine", 2); F.set("dg_rugg3", 1); setStep(N, 2); K.scene([["dg_ruggine", "(Annuisce una volta. Una sola, ma vale per dieci.) Allora andiamo. Ti passo i pilastri."]], () => done(), "dg_p3"); } },
          { label: "«Ce la faccio da solo»", sub: "Rispetto", big: true, fn: () => { bond("ruggine", 1); F.set("dg_rugg3", 2); setStep(N, 2); K.scene([["dg_ruggine", "(Annuisce.) Anche io, alla tua età. E guarda dove sono. (Ride, per la prima volta.) Vai."]], () => done(), "dg_p3"); } },
        ], "dg_p3"), "dg_p3");
        if (K.inZone("dg_p3")) return say([["dg_ruggine", s >= 9 ? "(Guarda il campo.) Sai cosa mi manca? Niente. È una sensazione strana. Mi ci sto abituando." : "Non sentire i gradoni: sono sagome. Tifano più forte quando non li guardi."]]);
        return K.PASS;
      },
      dg_asterio() { return asterio(); },
      dg_fiamma() { return K.PASS; },
    };
    const patch = { dg_campo: { npcs: (st, list) => (st >= 1 && st < 9 ? list.filter((n) => n.id !== "dg_ruggine") : list) } };
    return { n: N, patch, title: "La Tribuna d'Oro", sub: "Il Piano 3, il portale, il fischietto e la scelta", goal, start: "dg_campo", introBg: "dg_p3", zones: { dg_p3: p3 }, talk,
      intro: () => [["voce", "<b>CAPITOLO 3</b>. L'ultimo piano non ha scale: ha una rampa. In fondo, un chiarore dorato e un rumore di mani che applaudono piano, da molto tempo. Il Torneo di Fine Stagione sta per decidere come finire."]] };
  }
  boot();
})();
