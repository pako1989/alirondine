// js/figurine-c1.js - «CACCIATORI DI FIGURINE» · Capitolo 1: Il Primo Album
// Pratofiore: l'edicola del figurinaio, la prima figura, due catture nel prato e la sfida di Nives (prima lotta a turni).
(function () {
  "use strict";
  function boot() {
    const E = window.__figurineCore;
    if (!E || !E.api || !E.api.addChapter || !window.__lotta || !window.__figurineH) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const H = window.__figurineH(K), { say, done, ask } = H, { setStep, quest, F } = K;
    const N = 1, S = () => K.stepOf(N);
    H.castFigs();
    H.cast("fg_ginestra", "Ginestra", "Figurinaio di Pratofiore", { style: "bald", hair: "#aaa", beard: "folta", acc: ["occhiali"], shirt: "#6b21a8", bg: ["#4c1d95", "#ddd6fe"] }, "Vende figurine da quarant'anni. Dice che non le vende: le affida.");
    H.cast("fg_nives", "Nives", "Cacciatrice rivale", { style: "ponytail", hair: "#1e1b4b", acc: ["fascia"], shirt: "#be185d", bg: ["#831843", "#fbcfe8"] }, "Vince con una naturalezza che ha stancato anche lei.");
    H.cast("fg_ottone", "Ottone", "Barista di Pratofiore", { style: "short", hair: "#6b4a2a", acc: ["grembiule"], shirt: "#92400e", skin: "#c68642", bg: ["#78350f", "#fde68a"] }, "Serve caffè e consigli. Il caffè è meglio.");
    K.cos("fg_c1", { kind: "shirt", label: "Maglia dell'Album", val: "#7c3aed", from: "Capitolo 1 di Cacciatori di Figurine" });
    K.lore("l_figure", { t: "Le figure", d: "Nascono dalle figurine che qualcuno ha amato troppo. Hanno un tipo, un carattere e una pazienza limitata." });
    K.lore("l_triangolo", { t: "Il triangolo dei tipi", d: "Aria batte campo, campo batte ombra, ombra batte aria. Il cuore non batte nessuno, ma cura tutti." });

    const goal = (s) => ({
      0: "Entra nell'edicola di Pratofiore e parla con Ginestra: ti aspetta.",
      1: `Nel prato, a sud del borgo: avvicina e cattura due figure (Album ${K.catch.list().length}/3).`,
      2: "Nel prato: parla con Nives. Vuole una lotta."
    }[s] || "Il capitolo 1 è concluso. Segue il Bosco dei Fischi.");
    const chk = () => { if (S() === 1 && K.catch.list().length >= 3) { setStep(N, 2); quest("fg_c1b", "La sfida di Nives", "Parla con Nives nel prato."); say("voce", "<b>Album 3/3.</b> Nives ti sta aspettando in mezzo al prato."); } };
    function fin() {
      F.set("fg_c1_done", true); K.reward("fg_c1", { coins: 70, cos: "fg_c1" }); K.finishChapter(N, "ok");
      K.scene([["voce", "Pratofiore, sera. L'Album ha tre pagine piene e una quarta con la macchia di caffè."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> Album ${K.catch.list().length} · Scorte ${K.stat("scorte")} · Fama ${K.stat("fama")}.`], ["voce", "Il Capitolo 2, «Il Bosco dei Fischi», ti aspetta."]], () => K.openMain(), "fg_titolo");
    }
    const talk = Object.assign({
      fg_ginestra() {
        if (K.rel.scene("fg_ginestra")) return;
        if (S() === 0) {
          say("fg_ginestra", "[felice] Eccoti! Il Giurì di Pratofiore ti ha mandato per... no, aspetta, non ci sono giurì. Sei qui per l'Album.");
          say("fg_ginestra", "Le figure non si comprano: si incontrano. Le avvicini nel modo giusto e, se hanno voglia, ti seguono. Ogni carattere vuole una cosa.");
          K.learnLore("l_figure"); K.learnLore("l_triangolo"); K.inv.give("fg_album"); K.inv.give("fg_esca", 3);
          return ask("Ginestra apre una scatola con tre figurine che ondeggiano appena.", [
            { label: "Zolla 🌱", sub: "Campo · resistente e timida", fn: () => pick("fg_zolla") },
            { label: "Svolazzo 🪁", sub: "Aria · veloce e curiosa", fn: () => pick("fg_svolazzo") },
            { label: "Notturno 🦇", sub: "Ombra · elegante e vanitosa", fn: () => pick("fg_notturno") }
          ]);
        }
        say("fg_ginestra", S() >= 2 ? "Ti aspetta qualcuno, nel prato. Dai il meglio, ma senza litigare con le regole." : "Il prato ha figure per tutti i gusti. Per ognuna c'è un modo: leggi come si comportano.");
        done();
      },
      fg_ottone() {
        say("fg_ottone", "[felice] Un caffè per il cacciatore! Offre la casa. La casa è in perdita, ma è un'ottima casa.");
        const d = K.clock.day();
        if (!F.get("fg_ott_" + d, 0)) { F.set("fg_ott_" + d, 1); K.bond("scorte", 1); say("voce", "Ottone ti riempie la borraccia: Scorte +1."); }
        done();
      },
      fg_nives() {
        if (K.rel.scene("fg_nives")) return;
        if (S() < 2) { say("fg_nives", "[ride] Ancora poche figure? Torna quando l'Album avrà pagine vere."); return done(); }
        if (S() === 2) {
          say("fg_nives", "[serio] Sono Nives. Ho vinto due Leghe di borgo e perso zero tempo a dirtelo. Una lotta, tre figure. Chi perde, offre il caffè.");
          return ask("Nives ti tende la mano come un contratto.", [{ label: "Accetti la lotta", big: true, fn: () => K.catch.battle([["fg_raffica", 1], ["fg_muraglia", 1]], { title: "Lotta di Pratofiore · contro Nives", done: (r) => {
            if (!r.win) { say("fg_nives", "[ride] Riprova quando vuoi. Il caffè lo pago io, la prossima volta."); return done(); }
            K.rel.add("fg_nives", 6, true); say("fg_nives", "[pensa] Hai guardato le figure, non l'avversaria. Buona regola."); K.bond("fama", 1); fin();
          } }) }, { label: "Non ancora", fn: K.done }]);
        }
        say("fg_nives", "Ci vediamo in giro. Se hai ancora fame di sfide, io ci sono."); done();
      }
    }, H.wild(["fg_piuma", "fg_tonino", "fg_sorriso"], chk));
    function pick(id) {
      K.catch.add(id); say("voce", `${K.catch.figs[id].n} salta fuori dalla figurina e si siede sulla tua spalla.`);
      say("fg_ginestra", "Presentazioni fatte. Ora vai nel prato, a sud: lì le figure ti aspettano. Avvicinale nel modo giusto. Se sbagli, riprova: nessuno si offende (molto).");
      setStep(N, 1); quest("fg_c1a", "Il primo Album", "Cattura due figure nel prato, a sud di Pratofiore."); done();
    }
    const WILD = { fg_piuma: [8, 9], fg_tonino: [22, 8], fg_sorriso: [11, 16] };
    const zones = {
      fg_borgo: {
        region: "borgo", name: "Pratofiore", short: "Pratofiore", sub: "Un borgo di edicole, un bar e il profumo di carta nuova", bg: "fg_prato", time: "giorno",
        w: 30, h: 22, start: [15, 12], items: [[3, 9], [26, 8]],
        areas: [[0, 0, 29, 21, "Pratofiore: casette, aiuole e la sensazione di essere osservati da qualcosa di piatto"]],
        npcs: () => [{ id: "fg_ottone", at: [22, 9] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(1, 10, 28, 12, "+"); lay(14, 12, 16, 20, "+"); lay(22, 14, 27, 18, "w"); put(20, 15, "b"); put(21, 11, "b");
          [[3, 4], [26, 4], [3, 16], [8, 18], [19, 18], [26, 10]].forEach(([x, y]) => put(x, y, "t"));
          house(4, 3, 6, 4, { door: [6, 6], roof: "#7c3aed", enter: { room: "bottega", name: "Edicola di Ginestra", who: ["fg_ginestra"] } });
          house(19, 3, 6, 4, { door: [21, 6], roof: "#92400e", enter: { room: "locanda", name: "Bar Pratofiore", who: ["fg_ottone"] } });
          house(14, 21, 3, 1, { door: [15, 21], enter: { to: "fg_prato", at: [15, 2] } });
        }
      },
      fg_prato: {
        region: "borgo", name: "Il Prato delle Figure", short: "Prato", sub: "Fiori alti, figure timide e una cacciatrice impaziente", bg: "fg_prato", time: "giorno",
        w: 30, h: 22, start: [15, 3], items: [[4, 6], [25, 17]],
        areas: [[0, 0, 29, 21, "Il Prato: ogni fiore potrebbe avere un'opinione"]],
        npcs: () => H.here(["fg_piuma", "fg_tonino", "fg_sorriso"], WILD).concat(S() >= 2 || F.is("fg_c1_done") ? [{ id: "fg_nives", at: [15, 12] }] : []),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(14, 1, 16, 8, "+"); lay(5, 9, 25, 10, "+"); [[3, 3], [26, 3], [3, 14], [26, 12], [10, 19], [20, 19], [6, 16]].forEach(([x, y]) => put(x, y, "t")); put(18, 14, "b");
          house(14, 0, 3, 1, { door: [15, 0], enter: { to: "fg_borgo", at: [15, 20] } });
        }
      }
    };
    return {
      n: N, title: "Il Primo Album", sub: "Un'edicola, tre pagine e una lotta",
      goal, start: "fg_borgo", introBg: "fg_titolo", zones, talk, obj: {},
      intro: [["voce", "Pratofiore, mattina. L'edicola ha la serranda alzata a metà, e dentro c'è qualcuno che parla da solo."], ["voce", "Sulla vetrina, un cartello: «Figurine in affido. Non si restituiscono: si adottano.»"]]
    };
  }
  boot();
})();
