// js/fischietto-c3.js - «IL FISCHIETTO» · Capitolo 3: L'Esposto (finale)
// Una lettera anonima, un presidente, una cronista e la finale. Dossier «finale» (5 voci, 3 contraddizioni), il verdetto su di te e
// tre decisioni in campo. 4 finali: argento, silenzio, riscatto, spento.
(function () {
  "use strict";
  function boot() {
    const E = window.__fischiettoCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K;
    const N = 3, S = () => K.stepOf(N), DS = K.dossier, PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const got = (i, txt) => { if (DS.add("finale", i)) say("voce", `<b>Nel dossier:</b> ${K.esc(DS.cases.finale.items[i].t)} (${DS.list("finale").length}/5)`); if (txt) say("voce", txt); };
    K.cast("fi_quarto", { name: "Quarto Uomo", sub: "Dirigente di gara", eye: "#2a2a2a", skin: "#d9a679", style: "buzz", hair: "#3a2a1a", acc: ["fischietto"], shirt: "#111827", bg: ["#1c1917", "#facc15"] }, "Controlla il cartellone dei cambi con la pazienza di chi sa che nessuno lo guarda, finché sbagli.");
    K.cos("fi_c3", { kind: "shirt", label: "Divisa della Finale", val: "#facc15", from: "Capitolo 3 di Il Fischietto" });

    const took = () => F.is("fi_busta");
    const goal = (s) => ({
      0: "Parla con Edvige nella sede (Ponterosso): è arrivata una lettera.",
      1: `Allo Stadio (a sud del Campo comunale): Livia, Gualtiero nel palco, Edvige in segreteria. Dossier ${DS.list("finale").length}/5. Verdetto da Edvige in segreteria.`,
      2: "Nello spogliatoio arbitri, dal Quarto Uomo: la finale ti aspetta."
    }[s] || "La storia è conclusa. Rivivi i finali dal Registro.");

    function whistle() {
      F.set("fi_final", 1);
      say("fi_quarto", "[serio] Trentesimo minuto. Il Ponterosso contro il Borgo Alto, finale di Coppa. Duemila persone e un solo fischietto.");
      ask("Dante entra in scivolata su Sirio, il pallone è lontano. Che cosa fai?", [
        { label: "Cartellino giallo", sub: "Integrità +1", fn: () => { K.bond("integrita", 1); next2(); } },
        { label: "Lasci correre", sub: "Integrità -1", fn: () => { K.bond("integrita", -1); next2(); } },
        { label: "Parli con Dante", sub: "Rapporto +1, Integrità 0", fn: () => { K.rel.add("fi_dante", 4, true); say("fi_dante", "[serio] Capito. Nessuno si fa male, nessuno si offende."); next2(); } }
      ]);
    }
    function next2() {
      say("fi_quarto", "Settantesimo. Dalla tribuna, Gualtiero ti fa un cenno con il dito. Lo vedono tutti.");
      ask("Gualtiero ti fa segno di «aiutare» il Ponterosso.", [
        { label: "Ignori il segno", sub: "Integrità +1", fn: () => { K.bond("integrita", 1); next3(); } },
        { label: "Fischi un fallo inventato per loro", sub: "Integrità -2", fn: () => { K.bond("integrita", -2); next3(); } },
        { label: "Gli sorridi", sub: "Integrità 0", fn: () => { next3(); } }
      ]);
    }
    function next3() {
      say("fi_quarto", "Ottantanovesimo. Contatto in area del Borgo Alto. Il Ponterosso chiede rigore, tutti in piedi.");
      ask("Rigore o no?", [
        { label: "Fischi il rigore", sub: took() ? "Il fischietto lo sai già: Integrità -1" : "Il contatto c'era: Integrità 0", fn: () => { K.bond("integrita", took() ? -1 : 0); fin(); } },
        { label: "Lasci correre", sub: took() ? "Integrità -1" : "Integrità +1", fn: () => { K.bond("integrita", took() ? -1 : 1); fin(); } },
        { label: "Consulti Pino", sub: "Rapporto +1", fn: () => { K.rel.add("fi_pino", 3, true); say("fi_pino", "[serio] Contatto lieve, un normale braccio al corpo. Io non lo dò."); K.bond("integrita", 1); fin(); } }
      ]);
    }
    function fin(skip) {
      const v = F.is("fi_g3_denuncia") ? "denuncia" : F.is("fi_g3_ritira") ? "ritira" : "silenzio", iz = K.stat("integrita"), t = took();
      let end = "silenzio";
      if (v === "denuncia") end = t ? "riscatto" : iz >= 6 ? "argento" : "silenzio";
      else if (v === "silenzio") end = t ? "spento" : iz >= 7 ? "argento" : "silenzio";
      else end = t ? "spento" : "silenzio";
      const txt = {
        argento: [["voce", "Il triplice fischio. Lo stadio resta un istante in silenzio, poi applaude: non te, ma la partita. Ed è la stessa cosa."], ["fi_edvige", "[felice] Il Fischietto d'Argento. Lo dico io, che non do medaglie. Le do in segreteria."]],
        silenzio: [["voce", "Fine della partita. Nessuno ti ferma, nessuno ti applaude. Per un arbitro, è il miglior risultato possibile."], ["fi_livia", "[pensa] Non scrivo niente di te. Non perché non ci sia da scrivere: perché non c'è da correggere."]],
        riscatto: [["voce", "La busta è sul tavolo del Giurì. L'hai portata tu. Hai sbagliato, e l'hai detto: è la parte che conta."], ["fi_edvige", "[serio] Un errore dichiarato vale più di un'innocenza mai provata. Starai fermo qualche turno. Poi torni."]],
        spento: [["voce", "Fischi la finale. Il fischietto funziona. Il rumore è quello di sempre, ma tu senti un silenzio sotto."], ["fi_livia", "[serio] Se un giorno vuoi parlare, io ci sono. Non ti obbligo, ma ci sono."]]
      }[end];
      K.reward("fi_c3" + end, { coins: end === "argento" ? 250 : end === "silenzio" ? 150 : 120, cos: "fi_c3" });
      setStep(N, 3); K.finishChapter(N, end); K.end(end);
      K.scene(txt.concat([["voce", `<b>FINE DELLA STORIA · ${end === "argento" ? "Il Fischietto d'Argento" : end === "silenzio" ? "Il Silenzio" : end === "riscatto" ? "Il Riscatto" : "Il Fischietto Spento"}</b><br>Integrità ${K.stat("integrita")} · Reputazione ${K.stat("fama")}. Altri finali sono nel Registro.`]]), () => K.openMain(), "fi_titolo");
    }
    function verdict(id, solid) {
      const hi = solid >= 0.66; F.set("fi_g3_" + id, true);
      const lines = [];
      if (id === "denuncia") { if (hi) { K.bond("fama", 2); lines.push(["fi_edvige", "[serio] Con la firma, la lettera e la cronista: Gualtiero ha una settimana per dimettersi. Il Ponterosso sopravvive, la lega no."]); } else { K.bond("fama", -1); lines.push(["fi_edvige", "[pensa] Denuncia senza prove solide. Qualcuno ti accuserà di aver inventato. Io ti difendo, ma non ti salvo."]); } }
      else if (id === "silenzio") lines.push(["fi_edvige", "Silenzio. Tutti l'abbiamo fatto, qualche volta. Non è una colpa. È un debito."]);
      else lines.push(["fi_edvige", "Ti ritiri. Un altro fischierà. E tutti sapranno che ci sei mancato."]);
      if (id === "ritira") { fin(true); return; }
      K.scene(lines, () => { setStep(N, 2); quest("fi_c3", "La Finale", "Nello spogliatoio arbitri, dal Quarto Uomo."); K.enterZone("fi_stadio"); }, "fi_sede");
    }

    const talk = {
      fi_edvige() {
        const s = S();
        if (K.stepOf(2) < 2) return PASS;
        if (K.inZone("fi_stadio") || K.inZone("fi_stadio_i1")) {
          if (s < 1) return PASS;
          if (!DS.has("finale", "f_edv")) { say("fi_edvige", "[serio] La lettera è arrivata prima in Federazione, lunedì. Prima che al giornale, martedì. Se qualcuno lo chiedesse, io l'ho detto."); got("f_edv"); return done(); }
          if (s >= 2) { say("fi_edvige", "Vai dal Quarto Uomo. La finale non aspetta."); return done(); }
          say("fi_edvige", `Nel dossier ${DS.list("finale").length}/5 voci, ${DS.found("finale")}/3 contraddizioni.`);
          return ask("Edvige attende.", [
            { label: "🗂️ Apri il Dossier", sub: "Confronta due voci", fn: () => DS.open("finale", K.done, true) },
            { label: "⚖️ Decidi cosa fare", sub: "Denuncio, silenzio o mi ritiro", big: true, fn: () => DS.verdict("finale", K.done, true, (id, solid) => verdict(id, solid)) },
            { label: "Non ancora", fn: K.done }
          ]);
        }
        if (s === 0) {
          say("fi_edvige", "[serio] Una lettera anonima. «L'arbitro della finale ha già accettato.» È di una settimana fa. Non so se è vera: so che qualcuno l'ha spedita.");
          say("fi_edvige", "Lo Stadio è a sud del Campo comunale. Livia, il presidente, e io in segreteria: parlaci, confronta, e poi decidi.");
          setStep(N, 1);
          quest("fi_c3", "L'Esposto", "Allo Stadio (sud del Campo): Livia, Gualtiero, Edvige. Poi decidi cosa fare.");
          return done();
        }
        say("fi_edvige", "Lo Stadio è a sud del Campo. Ti aspetto in segreteria."); done();
      },
      fi_livia() {
        if (S() < 1 || !K.inZone("fi_stadio")) return PASS;
        if (DS.has("finale", "f_lettera")) { say("fi_livia", "Ti ho già detto tutto. Fai la tua parte, io faccio la mia."); return done(); }
        say("fi_livia", "[pensa] Questa è la lettera. L'ho ricevuta martedì, a mano, al giornale. La «t» a gancio: ci hai fatto caso?");
        got("f_lettera"); got("f_cron", "«L'ho ricevuta martedì, a mano.»");
        if (K.rel.lv("fi_livia") >= 1) { say("fi_livia", "[serio] E questo è il blocchetto di assegni del Ponterosso, in fotocopia. La firma è la stessa. Non l'ho mai pubblicata, e non so se lo farò."); got("f_firma"); }
        else say("fi_livia", "Se mi fai un favore, ti do anche altro. Intanto, fidati.");
        done();
      },
      fi_gualtiero() {
        if (S() < 1 || !K.inZone("fi_stadio_i0")) return PASS;
        if (!DS.has("finale", "f_pres")) { say("fi_gualtiero", "[ride] Signor arbitro! Sono tranquillo. Io non c'entro. Non scrivo nemmeno gli assegni, ho una segretaria."); got("f_pres"); return done(); }
        say("fi_gualtiero", took() ? "[serio] Abbiamo un accordo. Non dimenticarlo." : "[ride] Ci vediamo in campo, signor arbitro. Con il sorriso.");
        done();
      },
      fi_quarto() {
        if (S() < 2) { say("fi_quarto", "Non è ancora il momento. Quando decidi cosa fare, torna."); return done(); }
        if (F.is("fi_final")) { say("fi_quarto", "La partita è finita. Il referto lo scrivo io."); return done(); }
        say("fi_quarto", "[serio] Pronto, signor arbitro?");
        ask("La finale.", [{ label: "Entra in campo", big: true, fn: () => whistle() }, { label: "Un momento", fn: K.done }]);
      }
    };
    const zones = {
      fi_stadio: {
        region: "campo", name: "Stadio Comunale · La Finale", short: "Stadio", sub: "Palco, segreteria, spogliatoio arbitri e duemila voci", bg: "fi_campo", time: "giorno",
        w: 34, h: 22, start: [15, 2], items: [[5, 16], [29, 15]],
        areas: [[0, 0, 33, 21, "Lo Stadio Comunale il giorno della finale"]],
        npcs: () => [{ id: "fi_livia", at: [12, 13] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(0, 21, 33, 21, "t"); lay(0, 0, 0, 21, "t"); lay(33, 0, 33, 21, "t");
          lay(1, 10, 32, 12, ":"); lay(15, 1, 17, 20, ":"); put(8, 15, "b"); put(9, 15, "b"); put(25, 15, "b"); [[4, 4], [28, 4], [4, 19], [29, 19]].forEach(([x, y]) => put(x, y, "t"));
          house(5, 3, 6, 4, { door: [7, 6], roof: "#7f1d1d", enter: { room: "ufficio", name: "Palco del Presidente", who: ["fi_gualtiero"] } });
          house(14, 3, 6, 4, { door: [16, 6], roof: "#44403c", enter: { room: "ufficio", name: "Segreteria del Torneo", who: ["fi_edvige"] } });
          house(24, 3, 6, 4, { door: [26, 6], roof: "#111827", enter: { room: "spogliatoio", name: "Spogliatoio arbitri", who: ["fi_quarto"] } });
          house(15, 21, 3, 1, { door: [16, 21], enter: { to: "fi_campo", at: [15, 17] } });
        }
      }
    };
    return {
      n: N, title: "L'Esposto", sub: "Una lettera, un presidente e la finale",
      goal, start: "fi_citta", introBg: "fi_titolo", zones, talk, obj: {},
      patch: { fi_campo: { build(L) { L.house(14, 19, 3, 1, { door: [15, 19], enter: { to: "fi_stadio", at: [16, 1] } }); } } },
      intro: [["voce", "Giovedì. La finale di Coppa è domenica. Il giornale ha un titolo già pronto, e nessuno sa quale."], ["voce", "Edvige ha una busta in mano. Non è la tua."]]
    };
  }
  boot();
})();
