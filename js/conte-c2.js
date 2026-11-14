// js/conte-c2.js - «IL CONTE DI MONTECALCIO» · Capitolo 2: Il Mercante
// Con la faccia del Conte la strada tace. Berto il Mercante, invece, la fa parlare: Pina al banco, Tullio nella sede della Curva, un'amichevole contro la Valdorcia di Remo.
// In palio: la fascetta della banca che chiudeva la busta di quindici anni fa. E Tullio, che con un occhio solo guarda i passi, comincia a sommare le facce.
(function () {
  "use strict";
  function boot() {
    const E = window.__conteCore;
    if (!E || !E.api || !E.api.addChapter || !window.__conteH || !window.__conteZ) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__conteH(K), Z = window.__conteZ, { say, done, ask } = H;
    const N = 2, S = () => K.stepOf(N), here = () => K.api.trZone();
    H.cast("ct_pina", "Pina «la Fiamma»", "Fruttivendola del Basso", { style: "bun", hair: "#b45309", shirt: "#15803d", skin: "#e0b890", eye: "#78350f", acc: ["grembiule"], bg: ["#14532d", "#bbf7d0"] }, "Pina vende arance dal '79 e informazioni dal '80. Le prime sono a peso, le seconde a fiducia. Con i vestiti buoni non parla: «Mi sporcano il banco».");
    K.cos("ct_c2", { kind: "shirt", label: "Maglia della Curva Nord", val: "#92400e", from: "Capitolo 2 di Il Conte di Montecalcio" });
    K.lore("l_curva", { t: "La Curva Nord", d: "Duecento persone nelle giornate buone, dodici nelle altre. Nel '98 cantò l'inno al contrario per tutta la partita perché il capocuratore aveva sbagliato lo striscione. Il Montecalcio vinse. Non è mai stato spiegato." });
    K.evidence("ct_busta", { t: "La fascetta della Cassa Rurale", d: "Una fascetta di carta gialla, di quelle che chiudono i mazzi di banconote, con il timbro «Cassa Rurale · Filiale Montecalcio». Qualcuno l'ha conservata quindici anni dentro uno striscione.", icon: "🟨", short: "Timbro della filiale: prelievo di quel giorno" });

    const goal = (s) => ({
      0: "Mercato del Basso (porta a est della piazza). La strada parla solo con una faccia di strada: dal menu, 🎭 Cambia maschera. Cerca Pina, al banco della frutta.",
      1: "Tullio il Pilastro è nella sede della Curva Nord (la casa rossa in alto a destra, nel Mercato).",
      2: "Remo Sacchi aspetta sul campetto del Mercato: se vuole la fascetta, Tullio vuole prima una vittoria sulla Valdorcia.",
      3: "Torna da Tullio, nella sede della Curva: ha promesso una cosa.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      setStep(N, 4); F.set("ct_c2_done", true); F.set("ct_open3", true);
      K.reward("ct_c2", { coins: 110, cos: "ct_c2" }); K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>🎩 Salotti ${K.stat("salotti")} · 🧢 Strada ${K.stat("strada")} · 🔑 Campo ${K.stat("campo")} · 👁️ Sospetto ${K.stat("sospetto")} · Prove ${H.clues()}/5`],
        ["voce", "Il Capitolo 3 ti aspetta allo stadio Ferrante: il catenaccio, stasera, è stato aperto da qualcuno."]
      ]), () => K.openMain(), "ct_piazza");
    }

    const talk = {
      ct_pina() {
        if (K.rel.scene("ct_pina")) return;
        const s = S(), m = K.mask.cur();
        if (s === 0 && m !== "mercante") {
          say("ct_pina", "[serio] Un Conte, qui? Quelle scarpe non reggono il bagnato. Vada a prendere il tè, signore: a me servono clienti, non fiocchi.");
          say("hero", "[pensa] (Qui il velluto non apre le porte, le chiude. Serve una faccia da mercato: Berto.)");
          return H.done();
        }
        if (s === 0) {
          K.mask.meet("ct_pina", false); H.rep("ct_pina", "strada");
          say("ct_pina", "[felice] Berto! Ti avevo scambiato per un tipo che fa il sindacalista. Prendi un'arancia: è un anticipo, non un'offerta.");
          say("ct_pina", "Chiedi di quindici anni fa? Tutti lo chiedono quando la sera è lunga. Una cosa ti dico: Tullio, il Pilastro, non ha mai buttato niente. Nemmeno uno striscione che aveva dentro una cosa. Per averla gli devi qualcosa.");
          say("ct_pina", "[furbo] Lui non vuole soldi. Vuole una partita con la Valdorcia, e che sia vinta. Chiedi a Remo, sul campetto.");
          K.learnLore("l_curva"); setStep(N, 1); quest("ct_c2a", "Il Pilastro", "Nella sede della Curva Nord, il Mercato del Basso: parla con Tullio.");
          return H.done();
        }
        say("ct_pina", s < 4 ? "Hai la faccia giusta per questa piazza, Berto. Tienila." : "Arance? Quattro al chilo, una gratis se non fai domande."); H.done();
      },
      ct_tullio() {
        if (here() !== "ct_sede") return K.PASS;
        if (K.rel.scene("ct_tullio")) return;
        const s = S(), m = K.mask.cur();
        const r = H.notice("ct_tullio", true, [["ct_tullio", "[pensa] Aspetta. Berto. Il Conte. Hanno la stessa andatura, e non si sono mai visti nella stessa stanza. Mi sbaglio, vero?"]]);
        if (r) return;
        if (m === "conte") { say("ct_tullio", "[serio] Un Conte nella sede della Curva. Qui si parla solo con facce di strada, signore: la porta è dall'altra parte."); return H.done(); }
        if (s === 1) {
          say("ct_tullio", "Berto il Mercante. Pina dice che sai portare roba e portarla via senza che ci sia rumore. Sai anche perdere bene?");
          say("ct_tullio", "[serio] Quindici anni fa aprirono l'armadietto del nove, davanti a tutti, davanti a Ferrante. La busta aveva una fascetta. Io me la tenni: una cosa piccola, gialla, con un timbro. Non dissi niente, perché non me l'avevano chiesto.");
          say("ct_tullio", "[pensa] È nello striscione «NON SI VENDE». Ma la Curva non regala. Batti la Valdorcia sul campetto: Remo ha promesso a tutta la valle che non perdiamo mai a casa nostra. Io ho solo una vita per smentirlo.");
          setStep(N, 2); quest("ct_c2b", "L'amichevole", "Sul campetto del Mercato, Remo Sacchi: gioca contro la Valdorcia.");
          return H.done();
        }
        if (s === 3) {
          say("ct_tullio", "[ride] Remo ha una faccia che vorrei fotografare. Per una volta, a casa nostra, hanno perso loro.");
          say("ct_tullio", "[serio] Tieni. La fascetta. «Cassa Rurale, Filiale Montecalcio». Se un giorno chiedi chi l'ha ritirata, la filiale ha un registro. Ma questa è un'altra storia: e non è una storia da Mercante.");
          K.giveClue("ct_busta"); K.rel.add("ct_tullio", 2); K.bond("strada", 1);
          say("voce", "Nello striscione c'era una fascetta di carta gialla, con il timbro della Cassa Rurale. <b>Nuova prova: La fascetta della Cassa Rurale.</b>");
          say("ct_tullio", "[pensa] Un'ultima cosa. Non so chi sei. Ma ho cantato due volte in un giorno, oggi. Non succedeva dal '98.");
          return fin();
        }
        say("ct_tullio", s < 3 ? "Va' a battere Remo. Io intanto mi preparo a non crederci." : "La Curva non dimentica. Né i debiti, né i favori."); H.done();
      },
      ct_remo() {
        if (K.rel.scene("ct_remo")) return;
        const s = S();
        if (s === 2) {
          if (K.mask.cur() === "conte") { say("ct_remo", "[serio] Un Conte sul mio campetto. Il giorno che mi paga lo stadio, discutiamo di tattica. Fino ad allora, i vestiti buoni stanno a bordo campo."); return H.done(); }
          say("ct_remo", "Berto. Pina mi ha raccontato che vuoi una partita. Quarantacinque minuti, mille scuse, e quando perdete decidiamo chi paga il vino.");
          say("ct_remo", "[felice] Gioco con il mio modulo. Non ne ho altri. È un 4-4-2 che ha resistito a due allenatori e a un matrimonio.");
          return ask("Giochi l'amichevole contro la Valdorcia?", [
            { label: "⚽ Si gioca", fn: () => { H.flush(); K.say([["ct_remo", "Fischio. Palla in campo."]], () => K.playMatch({
              id: "ct_valdorcia", alt: "az", force: false, oppTeam: "Valdorcia", oppColor: "#1e3a8a", us: "Curva Nord", homeKit: ["#92400e", "#fde68a"], bg: "ct_stadio", oppNames: ["Il Mediano", "Sacchi Jr.", "Il Libero", "La Punta", "Remo"],
              intro: "Il campetto del Mercato: la Curva Nord contro la Valdorcia di Remo. Vincere significa che la Curva parla.",
              done: (r) => { if (r.win) { say("ct_remo", "[sorpreso] Hai vinto, e a casa vostra. Il vino lo pago io: non succedeva dal '03."); K.bond("strada", 1); setStep(N, 3); K.questDone("ct_c2b"); quest("ct_c2c", "La fascetta", "Torna da Tullio, nella sede della Curva."); H.done(); } else { say("ct_remo", "[ride] Riprova! Una sconfitta è una vittoria che non sa ancora di esserlo."); H.done(); } }
            })); } },
            { label: "Più tardi", fn: () => { say("ct_remo", "Quando sei pronto. Il campetto non scappa."); H.done(); } }
          ]);
        }
        say("ct_remo", s < 2 ? "Il Basso è casa vostra. Però il campetto è anche un po' mio." : "Un'amichevole ogni tanto aiuta. A perdere, soprattutto."); H.done();
      }
    };

    const zones = {
      ct_mercato: Z.mercato({
        itemCos: "ct_c2",
        npcs: (s) => [{ id: "ct_pina", at: [15, 5] }].concat(s >= 2 ? [{ id: "ct_remo", at: [19, 16] }] : []),
        intro: [["voce", "Il Mercato del Basso. Qui i banchi si aprono prima del sole e si chiudono con le parole. A chi porta il velluto, gli sguardi si fanno di cera."]]
      }),
      ct_sede: Z.sede({ npcs: () => [{ id: "ct_tullio", at: [7, 5] }] })
    };
    return {
      n: N, title: "Il Mercante", sub: "Un banco di frutta, uno striscione e un'amichevole",
      goal, start: "ct_mercato", introBg: "ct_piazza", zones, talk, obj: {},
      intro: [["voce", "Il Conte apre i salotti, ma la strada guarda altrove. Per entrare nel Basso serve un'altra faccia, e un nome che nessuno conosce: Berto il Mercante."], ["voce", "Pina vende le arance. Tullio custodisce una cosa. Remo difende il suo modulo."]]
    };
  }
  boot();
})();
