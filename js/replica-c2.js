// js/replica-c2.js - «EROI IN REPLICA» · Capitolo 2: L'Allenamento col Campione
// La Lega Celeste, Brezza come guida, due allenamenti (passano le fasce del giorno), il Direttore e lo Sparring con Nube. Ilario, il suggeritore, ha un fascicolo.
(function () {
  "use strict";
  function boot() {
    const E = window.__replicaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__replicaH) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__replicaH(K), { say, done, ask } = H, W = K.weight, DS = K.dossier;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("rp_c2", { kind: "shirt", label: "Divisa della Lega", val: "#1d4ed8", from: "Capitolo 2 di Eroi in Replica" });
    K.lore("l_lega", { t: "La Lega Celeste", d: "L'organizzazione dei grandi eroi. Ha una sede di marmo, una pista d'atterraggio e un ufficio stampa più grande della sala operativa." });
    K.lore("l_invasioni", { t: "Le «invasioni aliene»", d: "Arrivano sempre alle nove, durano esattamente quaranta minuti e finiscono con un applauso. Qualcuno, nella Lega, le chiama «le repliche»." });
    const trn = () => F.get("rp_tr", 0) | 0;

    const goal = (s) => ({
      0: "Parla con Brezza, davanti alla Lega Celeste.",
      1: `Allenati con Brezza: due sessioni (${trn()}/2).`,
      2: "Entra nella Direzione e parla col Direttore Sabbioni.",
      3: "Parla con Nube: lo Sparring d'ingresso.",
      4: "Il capitolo si chiude con la prima notte alla Lega."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      F.set("rp_c2_done", true);
      K.reward("rp_c2", { coins: 90, cos: "rp_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", "Notte alla Lega. Nube dorme con la mascherina e il sorriso: nessuno dei due è finto, ma il secondo ha l'aria professionale."], ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>${W.bar()} · Potere ${K.stat("potere")}.`], ["voce", "Il Capitolo 3, «Il Peso della Verità», ti aspetta."]]), () => K.openMain(), "rp_lega");
    }
    function train() {
      const n = trn();
      say("rp_brezza", n === 0 ? "[felice] Primo esercizio: salita controllata. Non guardare giù, guarda dove vuoi arrivare." : "[pensa] Secondo: virata. Fermati, respira, poi parti. La velocità è l'ultimo dei talenti.");
      F.set("rp_tr", n + 1); K.bond("potere", 1);
      K.clock.advance(1, () => {
        if (trn() >= 2) { setStep(N, 2); say("rp_brezza", "[felice] Basta così. Il Direttore ti aspetta: dice che vuole «conoscere la nuova generazione». Io dico che vuole una foto."); quest("rp_c2b", "Il Direttore", "Entra nella Direzione e parla con Sabbioni."); }
        done();
      });
    }
    function spar() {
      say("rp_nube", "[ride] Il figlio di Zenit! Faremo un duello bellissimo. Prometto di perdere con stile, se proprio devo.");
      H.play(2, "Nube", "Sparring d'ingresso · Lega", (r) => {
        if (r && r.win) { setStep(N, 4); say("rp_nube", "[sorpreso] Hai vinto davvero? Mi tremano i fotografi. Complimenti, e adesso non guardarmi: devo ricompormi."); K.bond("potere", 1); fin(); }
        else { say("rp_nube", "[ride] Quasi! Il tuo problema è che sembri un uomo che pensa. Qui non serve."); done(); }
      });
    }
    const talk = {
      rp_brezza() {
        if (K.rel.scene("rp_brezza")) return;
        const s = S();
        if (s === 0) {
          say("rp_brezza", "[felice] Tu sei il figlio. Io sono Brezza, e se ti chiedo di non chiamarmi «quella della copertina» è perché non lo sono mai stata.");
          say("rp_brezza", "Ti insegno due cose prima che il Direttore ti intrappoli in un fotografo: come volare e come guardare dove stai andando. La seconda è più utile.");
          K.learnLore("l_lega"); setStep(N, 1); K.inv.give("rp_visiera");
          quest("rp_c2", "L'Allenamento", "Allenati con Brezza: due sessioni."); return done();
        }
        if (s === 1) { return ask(`Allenamenti ${trn()}/2 · ${K.clock.name()}`, [{ label: "🛫 Allenati", sub: "+1 Potere, passa una fascia", big: true, cls: "hot", fn: train }, { label: "Dopo", fn: K.done }]); }
        say("rp_brezza", s < 4 ? "Vai. Il Direttore non ama aspettare, ma ama farsi aspettare." : "Brava giornata. Dormi."); done();
      },
      rp_sabbioni() {
        if (K.rel.scene("rp_sabbioni")) return;
        const s = S();
        if (s === 2) {
          say("rp_sabbioni", "[felice] Il figlio di Zenit! La Lega è onorata e lo staff è pronto per le foto. Una di profilo, una di tre quarti, una con l'aria di chi non ci sta pensando.");
          say("rp_sabbioni", "Poi lo Sparring con Nube: un test d'ingresso formale. È più una tradizione che una prova. Vinci con garbo.");
          K.learnLore("l_invasioni"); setStep(N, 3); quest("rp_c2c", "Lo Sparring d'ingresso", "Parla con Nube, nel piazzale."); return done();
        }
        say("rp_sabbioni", s < 2 ? "Torni più tardi. Le agende di marmo non si aprono a caso." : "La Lega è fiera di te. Questo comunicato è già in stampa."); done();
      },
      rp_nube() {
        if (K.rel.scene("rp_nube")) return;
        const s = S();
        if (s === 3) return spar();
        say("rp_nube", s < 3 ? "Eroe, fa' pure il tuo giro. Io sono qui, in posa." : "Ti devo un caffè. Anzi, ti devo un sorriso migliore."); done();
      },
      rp_ilario() {
        if (K.rel.scene("rp_ilario")) return;
        if (DS.has("verita", "copione")) { say("rp_ilario", "[triste] Il copione ce l'hai già. Non dirlo a nessuno. Io non l'ho detto a nessuno, tranne a te."); return done(); }
        if (S() < 1) { say("rp_ilario", "[serio] Non ho nulla da dirti. Ancora."); return done(); }
        say("rp_ilario", "[triste] Sono il suggeritore. Suggerisco le battute agli eroi quando dimenticano. Alcune battute... sono più lunghe delle altre.");
        say("rp_ilario", "Ho una copia del copione di ieri sera. Non l'ho mai letta ad alta voce. Non so se vuoi sentirla.");
        H.wask("Che fai?", [
          { label: "🤝 «Raccontami»", sub: "Ascolta, con calma", big: true, cls: "hot", w: { fiducia: 1 }, fn: () => { DS.add("verita", "copione"); say("rp_ilario", "[triste] «Atterraggio alieno, ore 21:04. Zenit è sorpreso.» Tutte le sere. Sempre la stessa sorpresa."); say("voce", "<b>Nel Dossier:</b> Il Copione dell'Invasione 7."); done(); } },
          { label: "🔥 «Dammelo»", sub: "Pretendi", w: { rabbia: 1 }, fn: () => { DS.add("verita", "copione"); say("rp_ilario", "[triste] Va bene, va bene. Prendilo. Ma non dire che te l'ho dato io."); say("voce", "<b>Nel Dossier:</b> Il Copione dell'Invasione 7."); done(); } },
          { label: "Meglio non sapere", sub: "Per ora", fn: () => { say("rp_ilario", "[serio] Capisco. Quando vorrai, sono qui. Sempre in disparte."); done(); } }
        ]);
      }
    };
    const zones = {
      rp_lega: {
        region: "lega", name: "La Lega Celeste", short: "Lega", sub: "Marmo, colonne e una pista per decollare in posa", bg: "rp_lega", time: "giorno",
        w: 28, h: 18, start: [4, 9], items: [[2, 13], [24, 14]],
        areas: [[0, 0, 27, 17, "Il piazzale della Lega: eroi, fotografi e un tappeto rosso troppo lungo"]],
        npcs: () => [{ id: "rp_brezza", at: [10, 9] }, { id: "rp_nube", at: [20, 9] }, { id: "rp_ilario", at: [6, 13] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(8, 14, "b"); put(19, 14, "b"); [[3, 3], [24, 3], [5, 15], [22, 15]].forEach(([x, y]) => put(x, y, "t"));
          house(17, 2, 6, 4, { door: [19, 5], roof: "#475569", enter: { room: "direzione", name: "Direzione della Lega", who: ["rp_sabbioni"] } });
        }
      }
    };
    return {
      n: N, title: "L'Allenamento col Campione", sub: "Brezza, la Lega e un test d'ingresso",
      goal, start: "rp_lega", introBg: "rp_lega", zones, talk, obj: {},
      intro: [["voce", "La Lega Celeste. Marmo bianco, colonne e un portone con più fotografi che serrature."], ["voce", "Lo sai prima ancora di entrare: da questa parte del cielo, tutti recitano. Non sai ancora cosa."]]
    };
  }
  boot();
})();
