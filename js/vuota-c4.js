// js/vuota-c4.js - «OPERAZIONE SCATOLA VUOTA» · Capitolo 4: Rapporto Zero
// Il tetto sotto la pioggia (fari e guardie, livello finale di Infiltrazione), il Campo Zero con Eco e Sipario, la partita e i quattro finali.
(function () {
  "use strict";
  function boot() {
    const E = window.__vuotaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const H = window.__vuotaH, { setStep, quest, F } = K;
    const N = 4, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled })));
      if (l.length) K.say(l, go); else go();
    };
    K.cos("vs_c4", { kind: "shirt", label: "Maglia degli Aironi", val: "#15803d", from: "Fine di Operazione Scatola Vuota" });
    const goal = (s) => ({
      0: "Il tetto: supera il portello con l'aiuto di Mira (Infiltrazione, ultimo livello).",
      1: "Scendi nel Campo Zero (porta al centro del tetto) e parla con Eco.",
      2: "Eco e Aurelia Sipario ti aspettano: la partita decide chi tiene il Rapporto.",
      3: "Scegli cosa farne: il Rapporto Zero è sul tavolo."
    }[s] || "La storia è conclusa. Altri finali sono nel Dossier.");
    function capture() {
      K.end("silenzio"); setStep(N, 4); K.finishChapter(N, "silenzio");
      K.scene([["vs_corvo", "[serio] Fermo. Mani in vista. Non è niente di personale: è solo il turno."], ["voce", "Le luci si accendono tutte insieme. I cani abbaiano, la porta si chiude. L'isola riprende a respirare come se nulla fosse."], ["vs_vulpe", "[triste] Ti ho perso dal radar. Ti aspetto al furgone. Ti aspetterò finché serve."], ["voce", "<b>FINE DELLA STORIA · Il Silenzio</b><br>La scatola, in un angolo, è ancora lì. Altri finali sono nel Dossier."]], () => K.openMain(), "vs_bastione");
    }
    function ending(id, win) {
      const txt = {
        pubblico: [["vs_eco", "[felice] Allora è fatta: il Rapporto Zero fuori. Per la prima volta in dodici anni, il fischio finale arriva davvero."], ["vs_vulpe", "[ride] Ho caricato tutto. In dieci minuti il mondo lo saprà. Ottone, vieni a vedere?"], ["vs_ottone", "[triste] Vengo. Ho smesso di nascondermi: la scatola, ora, è solo cartone."], ["voce", "<b>FINE DELLA STORIA · Il Rapporto Pubblico</b><br>Il gioco, forse, non sarà mai più lo stesso. Meglio così."]],
        fuoco: [["vs_eco", "[triste] Se lo bruci, non resta niente. Né la prova, né il sospetto. Né la libertà."], ["vs_ottone", "[serio] Brucialo. Se è questo il prezzo, lo pago io."], ["voce", "Il Rapporto Zero diventa un filo di fumo che sale tra la pioggia. Nessuno lo ricorderà."], ["voce", "<b>FINE DELLA STORIA · Il Rapporto Bruciato</b><br>Il gioco riparte. Come, nessuno lo sa."]],
        scatola: [["vs_eco", "[sorpreso] Non porti via niente. Lasci il Rapporto sul tavolo, con la scatola. Questo non lo avevo previsto."], ["vs_ottone", "[felice] La scatola vuota. Ho passato dodici anni a riempirne altre. Questa non serve più."], ["voce", "Il Rapporto Zero resta sul tavolo, aperto, con una foto sopra. Chi vuole leggerlo, lo legge. Chi non vuole, passa oltre."], ["voce", "<b>FINE DELLA STORIA · La Scatola Vuota</b><br>Il gioco, per la prima volta, riparte pulito."]]
      }[id];
      K.reward("vs_c4" + id, { coins: win ? 300 : 180, cos: "vs_c4" }); K.end(id); setStep(N, 4); K.finishChapter(N, id);
      K.scene(txt, () => K.openMain(), "vs_titolo");
    }
    function choose() {
      const fi = K.stat("fiducia"), si = K.stat("silenzio"), ph = K.inv.has("vs_foto");
      ask("Sul tavolo, il Rapporto Zero. Due parti, una firma, dodici anni.", [
        { label: "📡 Diffondilo a tutti", sub: fi >= 5 ? "Il mondo saprà" : "Serve Fiducia 5 (ora " + fi + ")", big: true, cls: "hot", disabled: fi < 5, fn: () => ending("pubblico", true) },
        { label: "🔥 Bruciarlo", sub: "Nessuno saprà mai", fn: () => ending("fuoco", true) },
        { label: "📦 Lascialo sul tavolo", sub: fi >= 7 && si >= 6 && ph ? "Segreto: Fiducia 7, Silenzio 6, foto" : "Serve Fiducia 7, Silenzio 6 e la Foto degli Aironi", big: true, disabled: !(fi >= 7 && si >= 6 && ph), fn: () => { K.inv.take("vs_foto"); ending("scatola", true); } }
      ]);
    }
    function match() {
      K.say(flush(), () => K.playMatch({
        id: "vs_finale", alt: "az,cage", force: false, squad: ["Mira", "Vulpe", "Ghiro"], mate: "Ottone", us: "Squadra Nove", oppTeam: "Sipario XI", oppColor: "#581c87", homeKit: ["#15803d", "#f4f0e4"],
        oppNames: ["Corvo", "Brace", "Lastra", "Eco"], intro: "Campo Zero · Bastione Nove. Undici ragazzi, una coppa e una finale rimasta a metà.",
        done: (r) => { F.set("vs_match_win", !!r.win); setStep(N, 3); say("vs_eco", r.win ? "[felice] Hai vinto. E la coppa, stavolta, è tua." : "[triste] Hai perso. Ma io avevo perso prima di cominciare: non cambia."); if (r.win) K.bond("fiducia", 1); QL = QL.concat([["vs_sipario", "[serio] Per il bene del gioco... Fate quello che dovete."]]); choose(); }
      }));
    }
    const talk = {
      vs_mira() {
        if (K.rel.scene("vs_mira")) return;
        const s = S();
        if (s === 0) {
          say("vs_mira", "Il portello del tetto è bloccato da un lucchetto a tre tempi e da una guardia con la testa dura. L'ultimo livello: tutto quello che hai imparato, in una volta.");
          return ask("Mira alza il pollice senza guardarti.", [
            { label: "Affronta il giro (Infiltrazione, livello 8)", sub: "Il Bastione", big: true, cls: "hot", fn: () => { QL = []; K.infiltra([8], (r) => { if (r.win) { F.set("vs_hatch", true); K.bond("silenzio", 1); setStep(N, 1); quest("vs_c4a", "Il Campo Zero", "Scendi dal portello, al centro del tetto, e parla con Eco."); say("vs_mira", "[felice] Ci sei! Il portello è aperto. Dietro, il Campo Zero. Mi fermo qui: nel campo si entra senza fischietto."); } else say("vs_mira", "Riprova. Il tetto aspetta."); done(); }); } },
            { label: "Non ancora", fn: K.done }
          ]);
        }
        say("vs_mira", "Fai attenzione. Io sto qui, a guardare le tue spalle. Se serve, ho una chiave inglese."); done();
      },
      vs_ottone() {
        if (K.rel.scene("vs_ottone")) return;
        say("vs_ottone", F.is("vs_ott_conf") ? "Sono qui. Non perché abbia diritto, ma perché ho smesso di nascondermi." : "Sono qui. Ogni tanto. Come una scatola."); done();
      },
      vs_eco() {
        if (K.rel.scene("vs_eco")) return;
        const s = S();
        if (s < 1) { say("vs_eco", "Non ancora."); return done(); }
        if (s === 1) {
          say("vs_eco", "[serio] Eccoti. Ho aspettato dodici anni. A forza di aspettare, diventa un mestiere.");
          say("vs_eco", "Passavo la palla alla persona giusta. Poi mi hanno chiesto di passare una cosa diversa: un'informazione. L'ho passata alla persona sbagliata.");
          say("vs_eco", "Il Rapporto Zero l'ho scritto io, per assicurazione. Se un giorno avessero provato a far sparire tutto, ci sarebbe stata una copia. Ottone provò a bruciarlo, una volta. Lo fermai. Gli dissi: «La firma è tua, non la mia.»");
          if (F.is("vs_ott_conf")) say("vs_eco", "So che gli hai parlato. Hai fatto bene: meglio un'accusa vera che una carità falsa.");
          K.rel.add("vs_eco", 3, true); setStep(N, 2); quest("vs_c4b", "La partita", "Parla di nuovo con Eco: Sipario sta arrivando.");
          return ask("Eco chiude il libro dei conti e ti guarda negli occhi.", [
            { label: "«Perché ora?»", sub: "Rapporto +2", fn: () => { K.rel.add("vs_eco", 3, true); say("vs_eco", "Perché hai portato una scatola, non una pistola. Ho pensato: forse è una persona che sa aspettare."); done(); } },
            { label: "«Dammi il Rapporto»", sub: "Si chiude il discorso", fn: () => { say("vs_eco", "[pensa] Non è mio da darti. Ma posso metterlo sul tavolo. Poi decidi tu."); done(); } }
          ]);
        }
        if (s === 2) {
          say("vs_sipario", "[serio] Che bella riunione. Signori, il gioco prima di tutto. Facciamo così: una partita, qui, adesso. Se la Squadra Nove vince, il Rapporto è vostro.");
          say("vs_sipario", "Se perde, il Rapporto lo tengo io. Per il bene del gioco. Ovviamente.");
          return ask("La Presidente Sipario sorride come chi ha già deciso il risultato.", [
            { label: "Accetti la partita", sub: "Squadra Nove contro Sipario XI", big: true, cls: "hot", fn: () => { QL = []; match(); } },
            { label: "Rifiuti", sub: "Il Rapporto resta sul tavolo, la scelta sarà tua", fn: () => { setStep(N, 3); say("vs_eco", "[ride] Il Rapporto è sul tavolo. Chi ha il coraggio di toccarlo, lo tocchi."); QL = QL.concat([]); choose(); } }
          ]);
        }
        if (s === 3) { choose(); return; }
        done();
      },
      vs_sipario() { say("vs_sipario", "Per il bene del gioco."); done(); },
      vs_guardia() { say("vs_guardia", "[serio] Tetto. Si sta zitti, si sta fermi, si sta alla larga."); done(); },
      vs_corvo() { say("vs_corvo", "[serio] Non ci siamo visti."); done(); }
    };
    const zones = {
      vs_tetto: {
        region: "torre", name: "Bastione Nove · Il Tetto", short: "Tetto", sub: "Pioggia, un traliccio e un portello", bg: "vs_tetto", time: "notte", w: 30, h: 22, base: "c", start: [2, 18], sneakStart: [2, 18],
        items: [[4, 4], [26, 16], [14, 16]], hide: "x", buio: 0.58,
        luci(K2) { const t = performance.now() / 1000; return [[Math.round(8 + 5 * Math.sin(t / 3.5)), Math.round(14 + 3 * Math.cos(t / 3.5)), 4], [Math.round(21 + 4 * Math.cos(t / 3)), Math.round(7 + 3 * Math.sin(t / 3)), 4]]; },
        areas: [[0, 0, 29, 21, "Il tetto del Bastione Nove"]],
        npcs: () => [{ id: "vs_mira", at: [4, 16] }, H.guard([[5, 10], [14, 10]], { speed: 0.5 }), H.guard([[16, 16], [26, 16]], { speed: 0.5 }), H.post([12, 5], "down", { turn: 110 }), H.post([24, 12], "left", { turn: 160 })].concat(F.is("vs_ott_conf") ? [{ id: "vs_ottone", at: [3, 17] }] : []).concat(K.alert.get() >= 2 ? [H.guard([[18, 4], [26, 4]], { speed: 0.6 })] : []),
        doors: { "15,2": { to: "vs_campo", at: [13, 14], locked: () => (F.is("vs_hatch") ? false : "Il portello è sigillato. Chiedi a Mira.") }, "0,18": { to: "vs_cortile", at: [30, 12] } },
        onSeen: (K2) => { if (K.alert.get() >= 3) return capture(); K.say([["voce", "«Ehi! Là sopra!» Un fascio ti inquadra. Sei di nuovo all'inizio del tetto, e qualcuno comincia a dare ordini."]], K.done); },
        build(L) {
          const { lay, put } = L;
          H.border(L, 30, 22, "F"); lay(14, 1, 16, 1, "Q"); lay(13, 2, 17, 3, "Z"); put(15, 2, "q"); lay(2, 2, 8, 3, "E"); lay(20, 2, 27, 3, "E"); lay(8, 7, 11, 8, "K"); lay(18, 11, 21, 12, "K"); lay(3, 13, 6, 14, "E"); lay(22, 17, 27, 18, "K"); lay(10, 18, 14, 20, "E");
          lay(0, 9, 29, 10, "h"); lay(13, 12, 16, 17, "m"); put(0, 18, "q"); [[7, 10], [13, 8], [21, 13], [8, 16], [25, 6], [11, 16], [2, 7]].forEach(([x, y]) => put(x, y, "x")); [[10, 4], [24, 8]].forEach(([x, y]) => put(x, y, "Q")); put(28, 20, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "PORTELLO ▲ CAMPO ZERO", d.X(15) + 8, d.Y(1) + 4, "#facc15"); H.plaque(g, "◂ CORTILE", d.X(2) + 8, d.Y(17) - 4, "#94a3b8"); },
        intro: [["voce", "Il tetto. Piove da quando sei salito e prima ancora. Il traliccio lampeggia in rosso, i fari girano e le guardie camminano con il bavero alzato."], ["voce", "Qui un avvistamento in più può costarti tutto: se l'Allerta arriva a Caccia, ti prendono."]]
      },
      vs_campo: {
        interior: true, region: "campo", name: "Bastione Nove · Il Campo Zero", short: "Campo Zero", sub: "Un campo a cinque, riflettori spenti e una tribuna vuota", bg: "vs_bastione", w: 26, h: 16, start: [13, 14], outside: ["vs_tetto", 15, 4], hud: true,
        npcs: () => [{ id: "vs_eco", at: [13, 7] }].concat(S() >= 2 ? [{ id: "vs_sipario", at: [16, 7] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 15, "m"); lay(3, 3, 22, 12, "c"); lay(4, 4, 21, 11, "u"); lay(0, 0, 25, 1, "a"); lay(0, 0, 0, 15, "a"); lay(25, 0, 25, 15, "a"); lay(0, 15, 25, 15, "a"); put(13, 15, "v");
          lay(1, 2, 2, 13, "K"); lay(23, 2, 24, 13, "K"); put(13, 3, "P"); lay(10, 1, 15, 1, "Y"); put(6, 13, "Z"); put(19, 13, "Z");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CAMPO ZERO", d.X(13) + 8, d.Y(1) + 6, "#facc15"); }
      }
    };
    return {
      n: N, title: "Rapporto Zero", sub: "Un tetto, un campo e quattro finali",
      goal, start: "vs_tetto", introBg: "vs_tetto", zones, talk, obj: {},
      intro: [["voce", "L'ultimo piano. Sotto di te, il Campo Zero. Sopra, la pioggia."], ["vs_vulpe", "[pensa] Siamo alla fine. Qualunque cosa succeda, hai fatto un buon lavoro. Anche con una scatola."]]
    };
  }
  boot();
})();
