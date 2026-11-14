// js/conte-c4.js - «IL CONTE DI MONTECALCIO» · Capitolo 4: La Finale delle Buste
// L'ultimo ballo in maschera di Palazzo Vanni. Il Valzer dei nomi (minigioco), l'anello di Brandolini, l'accusa davanti al paese con le prove giuste e la partita che decide chi resta padrone del Montecalcio.
// Tre finali: verità (serve l'accusa e la vittoria), conto (la vendetta silenziosa), custode (segreto: tre maschere, poco Sospetto, la verità solo a Nina).
(function () {
  "use strict";
  function boot() {
    const E = window.__conteCore;
    if (!E || !E.api || !E.api.addChapter || !window.__conteH || !window.__conteZ) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__conteH(K), Z = window.__conteZ, { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N), here = () => K.api.trZone();
    K.cos("ct_c4", { kind: "shirt", label: "Frac del Conte, ultimo ballo", val: "#111827", from: "Capitolo 4 di Il Conte di Montecalcio" });
    K.lore("l_anello", { t: "L'anello del Sindaco", d: "Un sigillo d'oro con le iniziali A. B. Brandolini lo porta da quando era segretario comunale: chiude le lettere con la ceralacca e, dicono, le coscienze con la cera." });
    K.evidence("ct_timbro", { t: "Il sigillo di ceralacca", d: "La ricevuta del «Fondo speciale» di quindici anni fa, chiusa con un sigillo in ceralacca rossa: un'impronta d'anello, «A. B.». La stessa dell'anello del Sindaco.", icon: "🔴", short: "Impronta dell'anello A. B." });

    const goal = (s) => ({
      0: "Giardino di Palazzo Vanni (cancello a ovest della piazza): Ettore ti aspetta all'ingresso. Stasera c'è il ballo in maschera.",
      1: "Nella sala da ballo (la porta in cima al giardino): la Contessa ha un'ultima cosa da darti.",
      2: `Il Sindaco Brandolini è nella sala da ballo. Prove: ${H.clues()}/5. Decidi cosa fare.`,
      3: "Il capitolo si chiude."
    }[s] || "Il capitolo 4 è concluso. Dal menu puoi rigiocarlo per gli altri finali.");

    const ENDS = {
      verita: { coins: 300, need: () => H.clues() >= 4, why: "Servono almeno 4 prove su 5", lines: () => [
        ["voce", "La sala da ballo si ferma a metà valzer. Il violinista abbassa l'archetto. Alvise Brandolini guarda le tue carte, poi la sala, poi i tuoi baffi di scena."],
        ["ct_brandolini", "[sorpreso] Un nove non è mai un'accusa. È un numero. Un numero che ho messo in una busta quindici anni fa, quando credevo che a Montecalcio servisse un colpevole più di una squadra."],
        ["hero", "[serio] Alza la maschera, e stavolta senza il cerone: «Quindici anni fa mi avete dato la colpa. Oggi vi do le prove.»"],
        ["ct_ersilia", "[sorpreso] Ettore, la porta. Chiudi la porta, e che nessuno esca. Voglio vedere ogni faccia mentre capisce."],
        ["ct_nina", "[triste] Mio padre aveva ragione. Il nove sarebbe tornato. E non con i soldi in tasca."],
        ["ct_gino", "[pensa] L'ho sempre saputo. Non l'ho mai detto, perché non me l'avevano chiesto. Scusa, nove."],
        ["voce", "Il Sindaco si dimette la mattina dopo. La squalifica a vita viene cancellata con un timbro. Lo stadio riapre a nome di Ferrante, e qualcuno corregge l'insegna: stavolta c'è lo spazio per la «e»."]] },
      conto: { coins: 220, need: () => H.clues() >= 2, why: "Servono almeno 2 prove", lines: () => [
        ["voce", "Non c'è un ballo che si ferma, né un'accusa. Il Conte Aurelio stringe la mano al Sindaco, ordina una cosa sola: il Libro delle Offerte, e la fascetta, in un unico plico, alla Cassa Rurale e alla Procura."],
        ["voce", "Una settimana dopo, il Sindaco scopre che i suoi conti sono tutti in una rete. Un pezzo alla volta, tutto cade. Nessuno sa chi ha tirato il filo."],
        ["ct_brandolini", "[arrabbiato] Il Conte. Il Conte, il Mercante, il Custode. Chi ci ha tradito è un'accozzaglia di facce. Non una persona!"],
        ["hero", "[serio] (Avrei voluto dirlo ad alta voce. Ma una vendetta detta ad alta voce è un comizio. La mia è un conto: saldato.)"],
        ["voce", "Il Montecalcio non sa mai chi è stato. Sa solo che, una domenica, c'è la Curva piena e lo stadio col nome giusto."]] },
      custode: { coins: 420, need: () => K.mask.count() === 3 && K.stat("sospetto") <= 3 && F.is("ct_nina_truth") && H.clues() >= 3, why: "Segreto", lines: () => [
        ["voce", "Fai una cosa che nessun Conte ha mai fatto: lasci le prove sul tavolo del Sindaco e te ne vai. Non per codardia. Per la sera dopo, quando suona la sirena dello stadio."],
        ["voce", "Nina trova le prove, e anche un mazzo di chiavi sul suo tavolo, con un biglietto: «Per chi sa dove va ogni porta». Il Sindaco si dimette da solo, senza che nessuno glielo chieda."],
        ["ct_nina", "[felice] Il custode sarà sempre al suo posto, la domenica. Non gli chiederò il nome: non l'ho mai fatto. Lo so già."],
        ["voce", "Il campo, la domenica, è pieno. Beppe tira di sinistro, la Curva canta, e nessuno chiede chi sia l'uomo con le chiavi. Basta questo."]] }
    };

    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 3); F.set("ct_c4_done", true); F.set("ct_fine_" + id, true);
      K.reward("ct_c4" + id, { coins: E2.coins, cos: "ct_c4" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines()).concat([
        ["voce", `<b>FINE DI IL CONTE DI MONTECALCIO.</b><br>🎩 ${K.stat("salotti")} · 🧢 ${K.stat("strada")} · 🔑 ${K.stat("campo")} · 👁️ Sospetto ${K.stat("sospetto")} · Prove ${H.clues()}/5`],
        ["voce", "Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «Il Ballo in Maschera». E a Palazzo Vanni, da oggi, c'è sempre un baule di costumi aperto."]
      ]), () => K.openMain(), "ct_ballo");
    }

    // ------------------------------------------------------------------ l'accusa a round (Presenta la prova)
    function accuse() {
      let r = 0;
      const R = [
        { q: "«Chi ha messo la busta nell'armadietto del nove?»", ok: ["ct_timbro", "ct_busta"], t: "[arrabbiato] Quel timbro non prova niente. Chiunque può comprare ceralacca." },
        { q: "«E perché? Che cosa voleva da Ferrante?»", ok: ["ct_lettera", "ct_registro"], t: "[pensa] Ferrante era vecchio e stanco. Le lettere non dimostrano nulla." },
        { q: "«E come è morto Mister Ferrante?»", ok: ["ct_referto"], t: "[arrabbiato] Una nota a margine di un prete! Non vale nemmeno come pettegolezzo." }
      ];
      const next = () => {
        if (r >= R.length) return final();
        const R0 = R[r];
        say("hero", `[serio] ${R0.q}`);
        K.say(H.flush(), () => K.present({
          who: "ct_brandolini", prompt: R0.q, ok: R0.ok, bg: "ct_ballo",
          right: () => { say("ct_brandolini", ["[sorpreso] …Non può averlo. Non lo ha. Dove l'ha preso?", "[sorpreso] Chi gliel'ha dato? Era chiuso a chiave.", "[triste] …Va bene. Va bene. Basta."][r]); r++; K.say(H.flush(), next); },
          wrong: () => { K.bond("sospetto", 1); say("ct_brandolini", R0.t); say("voce", "<b>Sospetto +1.</b> La sala ride, piano. Rilancia con la prova giusta."); K.say(H.flush(), next); },
          back: () => { K.say(H.flush(), () => menu()); }
        }));
      };
      next();
    }
    function final() {
      say("ct_brandolini", "[arrabbiato] Va bene. Se la partita è l'unico tribunale che il borgo capisce: il Montecalcio contro la Valdorcia. Se perdete, vi compro il vessillo, la panchina e la Curva. Se vincete, la società è vostra.");
      say("ct_remo", "[felice] Io gioco per la Valdorcia, ma stasera tifo per la verità. Quarantacinque minuti. Senza buste.");
      K.say(H.flush(), () => K.playMatch({
        id: "ct_finale", alt: "az", force: false, oppTeam: "Valdorcia", oppColor: "#1e3a8a", us: "Montecalcio", homeKit: ["#7f1d1d", "#fde68a"], bg: "ct_stadio",
        oppNames: ["Il Mediano", "Sacchi Jr.", "Il Libero", "La Punta", "Remo"],
        intro: "La Finale delle Buste: il Montecalcio contro la Valdorcia per il futuro della società. In porta c'è Beppe. Al centro, per una volta, il Campione senza maschera.",
        done: (r) => { if (r.win) { F.set("ct_finale_win", true); ending("verita"); } else { say("ct_brandolini", "[ride] Una partita sola, caro Conte. E l'ha persa. Ora, se vuole, riprovi: mi piacciono i sogni degli altri."); K.say(H.flush(), () => menu()); } }
      }));
    }
    function menu() {
      const opts = ["verita", "conto", "custode"].map((id) => {
        const E2 = ENDS[id], ok = E2.need(), t = K.ENDINGS && K.ENDINGS[id] ? K.ENDINGS[id][0] : id;
        if (id === "custode" && !ok) return null;
        return { label: (id === "verita" ? "🎩 " : id === "conto" ? "🕯️ " : "🔑 ") + t, sub: ok ? (K.ENDINGS && K.ENDINGS[id] ? K.ENDINGS[id][2] : "") : "🔒 " + E2.why, disabled: !ok, fn: () => (ok ? (id === "verita" ? accuse() : ending(id)) : K.done()) };
      }).filter(Boolean);
      say("voce", "Alvise Brandolini ti guarda dalla fine della sala, con l'anello al dito e un bicchiere in mano. Tu hai le prove, tre maschere e una sera.");
      return H.ask("Che cosa fai del Sindaco?", opts.concat([{ label: "◂ Non ancora", sub: "Puoi ancora cercare prove e giocare al Ballo", fn: () => K.done() }]));
    }
    function ballo() {
      H.flush();
      K.ownMatch(window.__ballo.start, { title: "Il Valzer dei nomi", bg: "ct_ballo", diff: 1, intro: "Il Valzer dei nomi: ogni invitato ti conosce con una faccia. Saluta con quella giusta.", done: (r) => {
        if (r && r.win) { say("ct_ettore", "Certamente. Un ballo riuscito. La Contessa ha detto che è stato il primo in sette anni."); setStep(N, 1); K.questDone("ct_c4a"); quest("ct_c4b", "La Contessa", "Nella sala da ballo: Ersilia ha qualcosa per te."); }
        else say("ct_ettore", "Certamente. Un ballo che non è riuscito. Ma gli invitati sono ancora tutti qui: ne facciamo un altro?");
        H.done();
      } });
    }

    const talk = {
      ct_ettore() {
        if (here() !== "ct_giardino") return K.PASS;
        const s = S();
        if (s === 0) {
          say("ct_ettore", "Certamente. Il ballo in maschera della Contessa: l'ultimo, dice, ma lo dice dal '88. Bastano due minuti: gli invitati sfilano, e ognuno vuole la sua faccia.");
          say("ct_ettore", "[furbo] Qui, stasera, ognuno ti conosce con una sola maschera. Una per ogni circolo del borgo. Tu ne hai tre: sarà divertente.");
          return ask("Entri nel ballo?", [{ label: "🎭 Il Valzer dei nomi", sub: "Saluta gli invitati con la faccia giusta", big: true, fn: ballo }, { label: "Più tardi", fn: () => { say("ct_ettore", "Il ballo non scappa. Le candele sì."); H.done(); } }]);
        }
        if (s === 1) { say("ct_ettore", "La Contessa la attende nella sala, in cima al giardino. Ha detto: «Che non si perda un'altra volta»."); return H.done(); }
        say("ct_ettore", "Certamente. Il Sindaco è in sala. Se vuole rivedere il valzer, mi dica: lo rifacciamo."); H.done();
      },
      ct_ersilia() {
        if (here() !== "ct_sala") return K.PASS;
        const s = S();
        if (s === 1) {
          say("ct_ersilia", "Il Conte! O il Mercante, o chi vuole lei. Ho ottant'anni e un registro: so riconoscere una faccia da un'intenzione.");
          say("ct_ersilia", "[furbo] Quindici anni fa, il «Fondo speciale» A. B. mi arrivò con una ricevuta, chiusa con la ceralacca. L'impronta è di un anello. Ho visto quell'anello su tre lettere, due testamenti e una proposta di matrimonio.");
          K.learnLore("l_anello"); K.giveClue("ct_timbro"); K.bond("salotti", 1);
          say("voce", "Ersilia ti porge la ricevuta: la ceralacca porta l'impronta di un sigillo, «A. B.». <b>Nuova prova: Il sigillo di ceralacca.</b>");
          say("ct_ersilia", "[serio] Il Sindaco è in sala. Io non intervengo: ho promesso a mio marito di non guardare più nessuno in faccia. Ma stasera guarderò.");
          setStep(N, 2); K.questDone("ct_c4b"); quest("ct_c4c", "Il Sindaco", "Nella sala da ballo: decidi cosa fare di Brandolini.");
          return H.done();
        }
        say("ct_ersilia", s < 1 ? "Torna quando il valzer sarà finito, caro: nessuno parla durante." : "Il Sindaco ha l'anello al dito sinistro. Si distingue dai molti anelli del destro: quello con le iniziali."); H.done();
      },
      ct_brandolini() {
        if (here() !== "ct_sala") return K.PASS;
        const s = S();
        if (s >= 2) { say("ct_brandolini", "Conte Aurelio. Ballo splendido, vero? Se poi mi vuole dire una cosa, la dica ora: tra un valzer e l'altro ho la memoria corta."); return H.ask ? menu() : H.done(); }
        say("ct_brandolini", "Conte! Non la vedo ballare. A Montecalcio si balla prima di decidere: poi, nessuno decide più nulla."); H.done();
      }
    };

    const zones = {
      ct_giardino: Z.giardino({
        itemCos: "ct_c4",
        npcs: (s) => [{ id: "ct_ettore", at: [14, 17] }, { id: "ct_gino", at: [5, 17] }, { id: "ct_tullio", at: [22, 11] }, { id: "ct_ottavia", at: [10, 14] }, { id: "ct_nina", at: [18, 15] }],
        intro: [["voce", "Il giardino di Palazzo Vanni, di notte. Lanterne di carta sui rami, un violino lontano, tre cani in smoking. Tutti sono qualcun altro, e per una volta anche tu."]]
      }),
      ct_sala: Z.sala({ npcs: () => [{ id: "ct_ersilia", at: [8, 4] }, { id: "ct_brandolini", at: [10, 6] }] })
    };
    return {
      n: N, title: "La Finale delle Buste", sub: "Il ballo, l'anello e un nove che torna",
      goal, start: "ct_giardino", introBg: "ct_ballo", zones, talk, obj: {},
      intro: [["voce", "Quindici anni dopo, una sola sera. La Contessa dà il suo ultimo ballo in maschera, e il Sindaco ci sarà: non perde mai una festa dove può tagliare un nastro."], ["voce", "Tu hai tre facce, cinque prove e una busta gialla da riportare al mittente."]]
    };
  }
  boot();
})();
