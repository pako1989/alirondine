// js/figurine-c4.js - «CACCIATORI DI FIGURINE» · Capitolo 4: La Lega delle Figure (finale)
// L'Arena: allenamento, tre incontri (quarti, semifinale, finale con la campionessa Cora) e i finali.
(function () {
  "use strict";
  function boot() {
    const E = window.__figurineCore;
    if (!E || !E.api || !E.api.addChapter || !window.__lotta || !window.__figurineH) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const H = window.__figurineH(K), { say, done, ask } = H, { setStep, quest, F } = K;
    const N = 4, S = () => K.stepOf(N), PASS = K.PASS;
    H.cast("fg_rosa", "Rosa", "Arbitra della Lega", { style: "bob", hair: "#1e293b", acc: ["fischietto"], shirt: "#7c3aed", bg: ["#4c1d95", "#ddd6fe"] }, "Fischia con una calma che spegne le discussioni e accende il resto.");
    H.cast("fg_cora", "Cora", "Campionessa in carica", { style: "long", hair: "#7f1d1d", acc: ["fascia"], shirt: "#0f766e", skin: "#c68642", bg: ["#134e4a", "#99f6e4"] }, "Ha vinto tre Leghe. Si è accorta di non essere mai stata davvero in gara.");
    K.cos("fg_c4", { kind: "shirt", label: "Maglia della Lega", val: "#a855f7", from: "Capitolo 4 di Cacciatori di Figurine" });

    const goal = (s) => ({
      0: "Parla con Rosa, l'arbitra, e iscriviti alla Lega. Puoi allenare la squadra con Nives.",
      1: "Quarti di finale: parla con Rosa.",
      2: "Semifinale: parla con Rosa.",
      3: "La finale contro Cora: parla con Rosa."
    }[s] || "La storia è conclusa. Rivivi i finali dal Registro.");
    const FOES = [
      [["fg_tonino", 2], ["fg_muraglia", 2]],
      [["fg_raffica", 3], ["fg_sipario", 3], ["fg_caldana", 2]],
      [["fg_eclisse", 3], ["fg_cometa", 3], ["fg_zollone", 2]]
    ];
    const TIT = ["Quarti di finale", "Semifinale", "Finale · contro Cora"];
    function round(i) {
      K.catch.battle(FOES[i], { title: `Lega delle Figure · ${TIT[i]}`, done: (r) => {
        if (!r.win) { say("fg_rosa", "[serio] Non è finita: puoi riprovare quando vuoi. Le figure hanno bisogno di fiato, tu di un piano."); return done(); }
        if (i < 2) { setStep(N, i + 2); quest("fg_c4" + i, TIT[i + 1], "Parla con Rosa: il prossimo incontro."); say("fg_rosa", i === 0 ? "[felice] Avanti. Semifinale al prossimo giro." : "[felice] In finale! Cora ti aspetta."); return done(); }
        finale();
      } });
    }
    function finale() {
      const lib = F.is("fg_libera"), comp = K.catch.complete();
      K.reward("fg_c4", { coins: 250, cos: "fg_c4" });
      const end = lib ? "custode" : "campione";
      K.end(end); if (comp) K.end("album");
      setStep(N, 4); K.finishChapter(N, comp ? "album" : end);
      const t = lib
        ? [["fg_cora", "[pensa] Hai liberato le figure e ora vinci con quelle che hanno scelto di restare. È un'altra vittoria, e non l'avrei saputa dare io."], ["voce", "Nel cielo sopra l'Arena passa uno stormo di figure libere, e una si ferma a salutare."]]
        : [["fg_cora", "[serio] Vittoria pulita. Se un giorno ti chiedessero cosa è successo nelle vetrine, rispondi in modo che tu possa dormire."], ["voce", "Sul campo, la tua squadra alza l'Album come un trofeo. Nives alza anche il pugno."]];
      if (comp) t.push(["fg_ginestra", "[felice] Dodici specie. Dodici pagine. L'Album è pieno, e io ho smesso di contare."]);
      K.scene(t.concat([["voce", `<b>FINE DELLA STORIA · ${lib ? "Custode delle Figure" : "Campione della Lega"}${comp ? " · L'Album Completo" : ""}</b><br>Album ${K.catch.list().length} · Fama ${K.stat("fama")}. Altri finali sono nel Registro.`]]), () => K.openMain(), "fg_titolo");
    }
    const talk = Object.assign({
      fg_rosa() {
        const s = S();
        if (s === 0) { say("fg_rosa", "[serio] Benvenuto all'Arena. Tre incontri: quarti, semifinale e finale. Se perdi, riprovi: non ci sono regole contro la perseveranza."); setStep(N, 1); quest("fg_c4a", "La Lega", "Parla con Rosa per il primo incontro."); return done(); }
        if (s >= 1 && s <= 3) { say("fg_rosa", `${TIT[s - 1]}. Hai la squadra pronta?`); return ask("Rosa alza il fischietto.", [{ label: "Entra in campo", big: true, fn: () => round(s - 1) }, { label: "Un attimo", fn: K.done }]); }
        say("fg_rosa", "La Lega è tua. O di chi l'ha lasciata passare."); done();
      },
      fg_nives() {
        if (K.rel.scene("fg_nives")) return;
        if (!K.inZone("fg_lega")) { say("fg_nives", "[serio] L'Arena è l'ultima tappa. Andiamo?"); return ask(`Scorte ${K.stat("scorte")} · Fama ${K.stat("fama")}`, [{ label: "🗺️ Guarda la Rotta", sub: "Verso l'Arena", cls: "hot", big: true, fn: () => K.route.open(K.done, true) }, { label: "Restiamo un po'", fn: K.done }]); }
        say("fg_nives", "[felice] Vuoi allenare la squadra? Un incontro d'allenamento ti dà esperienza. Niente rischi.");
        ask("Nives indica il campo di prova.", [
          { label: "Allenamento", sub: "Le figure guadagnano esperienza", big: true, fn: () => K.catch.battle([["fg_zolla", 1], ["fg_piuma", 1]], { title: "Allenamento con Nives", done: (r) => { say("fg_nives", r.win ? "[ride] Ben fatto! Ancora?" : "[pensa] Non importa: ci riproviamo."); done(); } }) },
          { label: "Guarda l'Album", fn: () => K.catch.open(K.done, true) },
          { label: "Niente", fn: K.done }
        ]);
      }
    }, {});
    const zones = {
      fg_lega: {
        region: "lega", name: "Arena della Lega", short: "Arena", sub: "Tribune di colori, bandiere dei borghi e un campo con le righe già tracciate", bg: "fg_lega", time: "giorno",
        w: 32, h: 22, start: [4, 11], items: [[12, 14], [20, 7]],
        areas: [[0, 0, 31, 21, "L'Arena: bandiere, tribune e un silenzio che sembra un applauso trattenuto"]],
        npcs: () => [{ id: "fg_rosa", at: [15, 12] }, { id: "fg_nives", at: [7, 11] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 21, 31, 21, "t"); lay(0, 0, 0, 21, "t"); lay(31, 0, 31, 21, "t");
          lay(1, 10, 30, 12, "+"); lay(10, 6, 21, 9, ":"); [[3, 3], [28, 3], [4, 17], [27, 17], [8, 15], [23, 15]].forEach(([x, y]) => put(x, y, "t")); put(11, 15, "b"); put(20, 15, "b");
          house(4, 2, 6, 4, { door: [6, 5], roof: "#7c3aed", enter: "Lo spogliatoio è pieno di figurine che si prendono in giro con affetto." });
        }
      }
    };
    return {
      n: N, title: "La Lega delle Figure", sub: "Tre incontri e una scelta già fatta",
      goal, start: "fg_citta", introBg: "fg_titolo", zones, talk, obj: {},
      intro: [["voce", "L'Arena della Lega. Le bandiere dei borghi, le tribune di colori e, in mezzo, un campo con le righe tracciate da qualcuno che sa quello che fa."], ["voce", "Nives respira piano: è la prima volta in anni che non vuole vincere a tutti i costi."]]
    };
  }
  boot();
})();
