// js/mondi-c3.js - IL TORNEO DEI MONDI · Capitolo 3 «La staffetta dei mondi»
// L'Eclisse, la squadra che vive nel buio tra i mondi, sfida la squadra mista a una FINALE A STAFFETTA: tre frazioni,
// ognuna nel motore di un mondo diverso (quelli che hai aperto), e un punteggio solo. I compagni danno il loro vantaggio
// nella frazione del loro mondo. Finali: IL RITORNO · I PONTI TRA I MONDI · LA SQUADRA MISTA · (segreto) TUTTI I MONDI.
(function () {
  "use strict";
  function boot() { const D = window.__mondi; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cos("tm_c3", { kind: "acc", label: "Corona dei tredici mondi", val: "corona", from: "Completa Il Torneo dei Mondi" });
    K.cos("tm_ritorno", { kind: "shirt", label: "Maglia del ritorno", val: "#ffd23f", from: "Finale «Il ritorno»" });
    K.cos("tm_ponte", { kind: "acc", label: "Chiave dei ponti", val: "chiave", from: "Finale «I ponti tra i mondi»" });
    K.cos("tm_squadra", { kind: "acc", label: "Fascia della squadra mista", val: "fascia", from: "Finale «La squadra mista»" });
    K.cos("tm_tutti", { kind: "hairc", label: "Capelli Tredici Mondi", val: "#ffe8a0", from: "Finale segreto «Tutti i mondi»" });
    const goal = (s) => ({ 0: "L'Eclisse vi aspetta al centro dell'Atrio. Parla con il Custode per cominciare la staffetta.", 1: "La staffetta è vinta. Parla con il Custode." }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    // le tre frazioni: i motori dei mondi aperti (senza ripetere), poi il campo classico
    function legs() { const out = [], seen = new Set(); K.openWorlds().forEach((w) => { if (w.eng !== "kit" && !seen.has(w.eng) && out.length < 3) { seen.add(w.eng); out.push(w); } }); while (out.length < 3) out.push({ id: "eclisse" + out.length, t: "Il campo tra i mondi", e: "🌒", eng: "kit", col: "#2a1a4a", bg: "tm_eclisse", ally: "" }); return out; }
    const ECL = { name: "L'Eclisse", color: "#2a1a4a", style: "pressing", players: [{ name: "Ombra d'oro", skin: "#2a1a4a", hair: "#ffd23f" }, { name: "Corona", skin: "#2a1a4a", hair: "#ffe8a0" }, { name: "Penombra", skin: "#3a2a5a", hair: "#ffd23f" }, { name: "Anello", skin: "#2a1a4a", hair: "#c8a040" }] };
    function staffetta() {
      const L = legs(), tot = { a: 0, b: 0 }; let i = 0;
      const next = () => {
        if (i >= L.length) return fineStaffetta(tot);
        const w = L[i];
        say([["voce", `<b>Frazione ${i + 1} di 3</b> · ${w.e} ${w.t}. Punteggio della staffetta: ${tot.a} – ${tot.b}.`]], () => K.playIn(w, { opp: ECL, oppName: "L'Eclisse", oppColor: "#2a1a4a", title: `Staffetta ${i + 1}/3 · ${w.e} contro l'Eclisse`, intro: `<p>Frazione ${i + 1} di 3 della staffetta dei mondi. Punteggio finora: <b>${tot.a} – ${tot.b}</b>.</p>`, done: (r) => { tot.a += r.a || 0; tot.b += r.b || 0; i++; next(); } }));
      };
      next();
    }
    function fineStaffetta(tot) {
      if (tot.a <= tot.b) return say([["voce", `Fine della staffetta: <b>${tot.a} – ${tot.b}</b>. L'Eclisse ride, un riso d'oro: «Ancora! Ancora! Non giocavamo da secoli».`], ["tm_custode", "Riprova quando vuoi. L'Eclisse non si stanca mai: è fatta di buio, e il buio ha tempo."]]);
      setStep(N, 1); bond("legami", 2);
      K.scene([["voce", `Fine della staffetta: <b>${tot.a} – ${tot.b}</b>. Avete vinto in tre mondi diversi, uno dopo l'altro.`], ["tm_eclisse", "[felice] (Le undici sagome si inchinano insieme, e gli occhi d'oro diventano lucciole.) …Grazie. Nessuno passava di qui da secoli. Credevamo che il buio tra i mondi fosse vuoto. Invece era solo in attesa di una partita."]], () => K.enterZone("tm_atrio"), "tm_eclisse");
    }
    function endingAsk() {
      const open = K.openWorlds(), sealedAll = open.length >= 5 && open.every((w) => F.is("sig_" + w.id)), team = K.WORLDS.filter((w) => F.is("ally_" + w.ally)).length >= 3, everything = open.length === 13 && K.sealCount() === 13;
      const opts = [{ label: "«È ora di tornare a casa»", sub: "Il ritorno", big: true, fn: () => ending("ritorno") }];
      if (sealedAll) opts.push({ label: "«Non chiudere le porte. Lasciale aperte»", sub: "I ponti tra i mondi", big: true, fn: () => ending("ponte") });
      if (team) opts.push({ label: "«La squadra mista resta insieme»", sub: "La squadra mista", big: true, fn: () => ending("squadra") });
      if (everything) opts.unshift({ label: "Il Custode si porta le mani al cappuccio…", sub: "Segreto: tutti e tredici i mondi", cls: "hot", big: true, fn: () => ending("tutti") });
      ask("tm_custode", "L'eclissi sta finendo. Le porte cominciano a tremare: tra poco si chiudono, come ogni volta. A meno che…\n\nDimmi tu, Campione dei Mondi.", opts, "tm_eclisse");
    }
    function ending(kind) {
      const R2 = { ritorno: { coins: 120, cos: ["tm_c3", "tm_ritorno"] }, ponte: { coins: 140, cos: ["tm_c3", "tm_ponte"] }, squadra: { coins: 140, cos: ["tm_c3", "tm_squadra"] }, tutti: { coins: 250, cos: ["tm_c3", "tm_tutti"] } }[kind];
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        ritorno: [["voce", "Il sole torna intero. L'Atrio sbiadisce, e sei di nuovo al Borgo Marino, in piazza, con un pallone sotto il braccio. Ti sembra di aver sognato."], ["voce", "Poi, dalla tasca, un frammento d'eclissi: d'oro, tiepido. Non era un sogno.<br><b>FINALE · IL RITORNO.</b>"]],
        ponte: [["tm_custode", "[felice] Aperte? Tutte? (Le porte smettono di tremare, una dopo l'altra, e diventano archi di pietra.) Allora non sono più porte. Sono ponti."], ["voce", "<b>FINALE · I PONTI TRA I MONDI.</b> Il Borgo Marino diventa la piazza di tutti i mondi. La domenica, al campetto, c'è sempre qualcuno nuovo: un robot-tostapane, un'ombra con il numero nove, un re che esulta per le parate."]],
        squadra: [["voce", "I tuoi tre compagni si guardano. Vengono da tre mondi diversi, e hanno vinto insieme in tre motori diversi. Nessuno vuole tornare a casa da solo."], ["voce", "<b>FINALE · LA SQUADRA MISTA.</b> La prima squadra interdimensionale della storia: si allena il giovedì, ogni settimana in un mondo diverso. Il Custode fa da guardalinee. Sbaglia sempre, ma con eleganza."]],
        tutti: [["voce", "Il Custode delle Porte si porta le mani al cappuccio, piano, e lo abbassa."], ["tm_custode", "[ride] Sorpresa. (Sotto il cappuccio c'è un volto che conosci benissimo: il tuo. Più vecchio, più stanco, più felice.) Sono te, dopo tutte le saghe. Ti aspettavo qui per dirti una cosa sola."], ["tm_custode", "Ne è valsa la pena. Ogni mondo. Ogni finale. Ogni partita persa."], ["voce", "<b>FINALE SEGRETO · TUTTI I MONDI.</b> Tredici sigilli, tredici mondi, una sola eclissi. E un Campione che, finalmente, si è incontrato."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "tm_eclisse");
    }
    const talk = {
      tm_custode() {
        if (S() === 0) return ask("tm_custode", `L'Eclisse vuole una staffetta: tre frazioni, tre mondi. Le vostre frazioni: ${legs().map((w) => w.e + " " + w.t).join(" · ")}. Un punteggio solo, alla fine. Pronti?`, [{ label: "Gioca la staffetta dei mondi", sub: "Tre partite, tre motori, un punteggio", cls: "hot", fn: staffetta }, { label: "Non ancora", fn: done }], "tm_eclisse");
        if (S() === 1) return endingAsk();
        return say([["tm_custode", "Le porte ricordano tutto. Anche te."]]);
      },
    };
    const patch = { tm_atrio: { npcs: (st, list) => list.concat(S() === 0 ? [{ id: "tm_eclisse", at: [14, 8] }] : []) } };
    talk.tm_eclisse = () => say([["tm_eclisse", "(Undici sagome con gli occhi d'oro, che parlano tutte insieme, piano.) …Giocate con noi? Con tutte le regole di tutti i mondi? Chiedetelo al Custode."]]);
    return { n: N, title: "La staffetta dei mondi", sub: "L'Eclisse, tre frazioni, un punteggio", goal, start: "tm_atrio", introBg: "tm_eclisse", talk, patch,
      intro: () => [["voce", "<b>IL TORNEO DEI MONDI</b>, capitolo 3. Al centro dell'Atrio, dove c'era il disegno dell'eclissi, adesso c'è una squadra: undici sagome scure, con gli occhi d'oro."]] };
  }
  boot();
})();
