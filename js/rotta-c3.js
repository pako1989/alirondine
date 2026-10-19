// js/rotta-c3.js - «ROTTA 66» · Capitolo 3: La Finale di Valcampo (finale)
// Valcampo, il capitano rivale, lo stadio e la partita. 4 finali in base a risultato e umore.
(function () {
  "use strict";
  function boot() {
    const E = window.__rottaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K;
    const N = 3, S = () => K.stepOf(N), PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    K.cast("ro_ciro", { name: "Ciro", sub: "Capitano del Valcampo United", eye: "#2a2a2a", skin: "#d9a679", style: "slick", hair: "#1a1a1a", shirt: "#111827", acc: ["fascia"], bg: ["#111827", "#fca5a5"] }, "Ha una stretta di mano da bancomat: mette e toglie con precisione.");
    K.cos("ro_c3", { kind: "shirt", label: "Maglia della Finale", val: "#1d4ed8", from: "Capitolo 3 di Rotta 66" });

    const goal = (s) => ({
      0: "A Valcampo: parla con Ciro, il capitano rivale. Poi apri la Rotta verso lo Stadio.",
      1: "Apri la Rotta con Osvaldo e vai allo Stadio della Finale.",
      2: "Nello spogliatoio, da Mister Bartolo: la finale ti aspetta."
    }[s] || "La storia è conclusa. Rivivi i finali dal Registro.");

    const osv = () => () => {
      if (S() === 0 && K.inZone("ro_valle")) { say("ro_osvaldo", "Prima parla con Ciro. Poi lo Stadio."); return done(); }
      say("ro_osvaldo", "Il Gigante è arrivato. Ha già fatto più di quanto dovesse.");
      ask(`Benzina ${K.stat("benza")} · Umore ${K.stat("umore")} · Cassa ${K.stat("cassa")}`, [
        { label: "🗺️ Guarda la Rotta", sub: "Verso lo Stadio", cls: "hot", big: true, fn: () => K.route.open(K.done, true) },
        { label: "Restiamo un po'", fn: K.done }
      ]);
    };
    function match() {
      const um = K.stat("umore");
      K.say(flush(), () => K.playMatch({
        id: "ro_finale", alt: "az,cage,hd", force: false, squad: ["Tino", "Gedeone", "Osvaldo"], mate: "Fiamma", us: "FC Sant'Anselmo", oppTeam: "Valcampo United", oppColor: "#111827", homeKit: ["#1d4ed8", "#f4f0e4"],
        oppNames: ["Ciro", "Marco", "Dario", "Ettore"], intro: "Stadio di Valcampo · Finale della Coppa dei Borghi. Duecento chilometri per novanta minuti.",
        done: (r) => finish(!!r.win, um)
      }));
    }
    function finish(win, um) {
      const end = win ? (um >= 7 ? "coppa" : "stanca") : (um >= 6 ? "onore" : "strada");
      const txt = {
        coppa: [["voce", "Il fischio finale. Fiamma alza la coppa come se fosse una parata. Tino piange. Gedeone prende nota di tutti i muscoli da curare."], ["ro_bartolo", "[felice] Trent'anni ad aspettare. Ne è valsa la pena, soprattutto per il pullman."], ["ro_osvaldo", "[ride] Il Gigante ha portato la coppa. Se la merita lui."]],
        stanca: [["voce", "Avete vinto. Il pullman, il serbatoio e gli umori sono a pezzi. Qualcuno festeggia piano, qualcun altro dorme."], ["ro_bartolo", "[pensa] Una coppa è una coppa. Ma non era questa la strada che volevo."]],
        onore: [["voce", "Battuti, ma il pullman torna cantando. Il Gigante ha cantato per ultimo."], ["ro_fiamma", "[felice] Una partita normale. Mi andava bene lo stesso."]],
        strada: [["voce", "Silenzio sul pullman. Il Gigante ha il motore più rumoroso, per una volta."], ["ro_bartolo", "[serio] Ci riproviamo l'anno prossimo. O quello dopo. O quando il pullman lo permette."]]
      }[end];
      K.reward("ro_c3" + end, { coins: win ? 250 : 120, cos: "ro_c3" });
      setStep(N, 3); K.finishChapter(N, end); K.end(end);
      K.scene(txt.concat([["voce", `<b>FINE DELLA STORIA · ${{ coppa: "La Coppa sul Pullman", stanca: "La Vittoria Stanca", onore: "Sconfitti, Insieme", strada: "Il Ritorno in Silenzio" }[end]}</b><br>Benzina ${K.stat("benza")} · Umore ${um} · Cassa ${K.stat("cassa")}. Altri finali sono nel Registro.`]]), () => K.openMain(), "ro_titolo");
    }
    const talk = {
      ro_osvaldo: osv(),
      ro_ciro() {
        if (!K.inZone("ro_valle")) return PASS;
        if (S() === 0) {
          say("ro_ciro", "[ride] Eccovi, finalmente. Pensavo avreste mandato una cartolina. Il pullman è vivo? Mi dicono che era un dinosauro.");
          return ask("Ciro ti tende la mano. Sembra un contratto.", [
            { label: "Gli stringi la mano", sub: "Umore +1", fn: () => { K.bond("umore", 1); say("ro_ciro", "[serio] Buona partita. Davvero, eh."); setStep(N, 1); quest("ro_c3a", "Lo Stadio", "Apri la Rotta con Osvaldo e vai allo Stadio."); done(); } },
            { label: "Lo sfidi con lo sguardo", sub: "Umore +2", big: true, fn: () => { K.bond("umore", 2); say("ro_ciro", "[ride] Mi piace. Ci vediamo in campo."); setStep(N, 1); quest("ro_c3a", "Lo Stadio", "Apri la Rotta con Osvaldo e vai allo Stadio."); done(); } }
          ]);
        }
        say("ro_ciro", "Ci vediamo in campo."); done();
      },
      ro_bartolo() {
        if (!K.inZone("ro_stadio_i0") && !K.inZone("ro_stadio")) return PASS;
        const s = S();
        if (s === 1) {
          say("ro_bartolo", "[serio] Ragazzi, trent'anni di allenamenti, duecento chilometri di strada. Il resto è novanta minuti.");
          if (K.rel.lv("ro_ersilia") >= 2) say("ro_ersilia", "[felice] Mio marito è qui, in prima fila, in un bagaglio. Fate bella figura.");
          setStep(N, 2);
          return ask(`Umore ${K.stat("umore")}. Il fischio sta per arrivare.`, [{ label: "Entra in campo", big: true, fn: match }]);
        }
        if (s === 2) { say("ro_bartolo", "Pronti?"); return ask("Rientri in campo?", [{ label: "Sì", big: true, fn: match }, { label: "Un attimo", fn: K.done }]); }
        done();
      },
      ro_fiamma() { if (K.inZone("ro_stadio_i0") || K.inZone("ro_stadio")) { say("ro_fiamma", "[serio] Se vinciamo, tutti festeggiano. Se perdiamo, almeno siamo qui."); return done(); } return PASS; }
    };
    const zones = {
      ro_valle: {
        region: "stadio", name: "Valcampo", short: "Valcampo", sub: "Una cittadina col campo più grande e i cartelli più piccoli", bg: "ro_stadio", time: "giorno",
        w: 28, h: 16, start: [3, 8], items: [[5, 12], [22, 4]],
        areas: [[0, 0, 27, 15, "Valcampo: strade larghe, bandiere e ansia"]],
        npcs: () => [{ id: "ro_ciro", at: [14, 9] }, { id: "ro_osvaldo", at: [8, 9] }, { id: "ro_ersilia", at: [18, 9] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 15, 27, 15, "t"); lay(0, 0, 0, 15, "t"); lay(27, 0, 27, 15, "t");
          lay(1, 7, 26, 9, "+"); put(6, 12, "b"); put(21, 12, "b"); [[3, 3], [24, 3], [5, 13], [22, 13]].forEach(([x, y]) => put(x, y, "t"));
        }
      },
      ro_stadio: {
        region: "stadio", name: "Stadio della Finale", short: "Stadio", sub: "Spalti, spogliatoi e una coppa che aspetta", bg: "ro_stadio", time: "sera",
        w: 28, h: 18, start: [3, 9], items: [[4, 14], [23, 14]],
        areas: [[0, 0, 27, 17, "Lo Stadio di Valcampo: tribune, tabellone e una platea impaziente"]],
        npcs: () => [{ id: "ro_osvaldo", at: [8, 9] }, { id: "ro_fiamma", at: [22, 11] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(7, 14, "b"); put(20, 14, "b"); [[3, 3], [24, 3], [4, 15], [22, 15]].forEach(([x, y]) => put(x, y, "t"));
          house(11, 2, 6, 4, { door: [13, 5], roof: "#374151", enter: { room: "spogliatoio", name: "Spogliatoio", who: ["ro_bartolo", "ro_tino"] } });
        }
      }
    };
    return {
      n: N, title: "La Finale di Valcampo", sub: "Duecento chilometri e novanta minuti",
      goal, start: "ro_borgo", introBg: "ro_titolo", zones, talk, obj: {},
      intro: [["voce", "Valcampo. Il Gigante si ferma, sbuffa e decide che per oggi può bastare."], ["voce", "Mister Bartolo guarda il campo come si guarda una promessa mantenuta a metà."]]
    };
  }
  boot();
})();
