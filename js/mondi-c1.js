// js/mondi-c1.js - IL TORNEO DEI MONDI · Capitolo 1 «L'eclissi»
// Un'eclissi sul Borgo Marino, e al posto della piazza l'Atrio: tredici porte in cerchio, e in mezzo il Custode delle Porte.
// Si aprono solo le porte delle saghe che hai finito; dietro ognuna, il suo campione ti sfida nel suo modo di giocare.
// Chi non ha ancora finito nessuna saga gioca la «porta di prova» contro il Custode stesso.
(function () {
  "use strict";
  function boot() { const D = window.__mondi; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("tm_custode", { shape: "nuvola", name: "Il Custode delle Porte", tag: "", skin: "#ffe8a0", eye: "#5a3a8a", bg: ["#1a1030", "#ffd23f"], shirt: "#ffd23f" },
      "Uno spirito d'eclissi, fatto di luce d'oro e di nuvola. Custodisce le porte tra i mondi delle saghe e si apre solo quando un campione ne ha attraversati abbastanza. Ha un cappuccio che non si toglie mai. Dice che sotto c'è «una sorpresa».");
    K.cast("tm_eclisse", { shape: "ombra", name: "L'Eclisse", tag: "", skin: "#2a1a4a", eye: "#ffd23f", bg: ["#05030f", "#ffd23f"], shirt: "#ffd23f", num: "0" },
      "La squadra che vive nel buio tra un mondo e l'altro: undici sagome con gli occhi d'oro, che giocano con le regole di tutti i mondi insieme. Non sono cattivi: sono annoiati. Da sempre nessuno passa di qui.");
    K.cos("tm_c1", { kind: "acc", label: "Stella dell'eclissi", val: "stella", from: "Capitolo 1 del Torneo dei Mondi" });
    K.cos("tm_frammenti", { kind: "hairc", label: "Capelli Eclissi", val: "#6a4aaa", from: "Trova tutti i frammenti d'eclissi dell'Atrio" });
    K.lore("l_porte", { t: "Le tredici porte", d: "Ogni porta è il mondo di una saga. Si apre solo se quella saga l'hai finita: il mondo deve ricordarsi di te. Dietro, il suo campione ti sfida nel suo modo di giocare." });
    const need = () => Math.min(2, Math.max(1, K.openWorlds().length));
    const seals = () => K.sealCount() + (F.is("sig_prova") ? 1 : 0);
    const goal = (s) => ({
      0: "Un'eclissi, e al posto della piazza l'Atrio. Al centro c'è il Custode delle Porte: parlagli.",
      1: `Vinci ${need()} sfide dietro le porte aperte (sigilli: ${seals()}/${need()}). Le porte chiuse si aprono finendo la loro saga.`,
      2: "Hai i sigilli. Torna dal Custode delle Porte.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    // ------------------------------------------------------------ la partita in un mondo (la usano tutti i capitoli)
    // eng: vignette · atb · bottoni · nastro · luci (i motori delle saghe, con le impostazioni dei cabinati della Sala Giochi) · kit
    K.allyIn = (w) => !!w && F.is("ally_" + w.ally);
    K.playIn = (w, o) => {
      const sal = window.__salone, m = w.eng !== "kit" && sal && sal.machine ? sal.machine(w.eng) : null;
      if (!m || !window[m.eng]) {
        return K.playMatch({ id: "tm_" + w.id, alt: "az,cage,hd", force: false, oppTeam: o.oppName || `I campioni di ${w.t}`, oppColor: o.oppColor || w.col, mate: o.mate || "Il Custode", us: "Il Campione dei Mondi", homeKit: ["#ffd23f", "#2a1a4a"], chap: "Il Torneo dei Mondi · " + w.t, bg: w.bg, intro: o.intro || `Dietro la porta, il mondo di «${w.t}»: si gioca sul campo, con le regole di quel mondo.`, done: o.done });
      }
      const opp = o.opp || m.boss, ally = K.allyIn(w), base = m.opts(opp, sal.heroLook(), true, o.power || "fulmine");
      if (ally) { if (w.eng === "vignette") base.actions = (base.actions || 8) + 2; if (w.eng === "atb") base.heroMp = (base.heroMp || 16) + 12; if (w.eng === "bottoni") base.shots = (base.shots || 6) + 1; if (w.eng === "nastro") base.rewinds = (base.rewinds || 1) + 1; if (w.eng === "luci") base.lanterns = (base.lanterns || 3) + 1; }
      K.ownMatch(window[m.eng].start, Object.assign(base, { oppStyle: opp.style, title: o.title || `${w.e} ${w.t} · contro ${opp.name}`, intro: (o.intro || "") + (ally ? `<p><b>Vantaggio della squadra mista</b>: ${w.perk}.</p>` : ""), done: o.done }));
    };
    function challenge(w) {
      const champ = K.api.CAST && K.api.CAST[w.champ], cn = (champ && champ.name) || "Il campione", et = K.endTitle(w);
      ask(w.champ, `${et ? `Mi ricordo di te. Hai chiuso la mia storia con «${et}».` : "Mi ricordo di te."}\n\n${w.line}`, [
        { label: K.F.is("sig_" + w.id) ? "Sfida di nuovo" : "Accetta la sfida", sub: w.eng === "kit" ? "Il campo del suo mondo" : `Nel suo motore: ${{ vignette: "Vignette", atb: "ATB", bottoni: "Super-Bottoni", nastro: "Il Nastro", luci: "Luci" }[w.eng]}`, cls: "hot", fn: () => K.playIn(w, { done: (r) => won(w, r, cn) }) },
        { label: "Non ancora", fn: done },
      ], w.bg);
    }
    function won(w, r, cn) {
      if (!r.win) return say([["voce", `${cn} vince la sfida. Ti stringe la mano attraverso la porta: «Torna quando vuoi. La porta resta aperta.»`]]);
      const first = !F.is("sig_" + w.id); F.set("sig_" + w.id, true); if (first) bond("sigilli", 1);
      const msg = first ? K.reward("sig:" + w.id, { coins: 40 }) : [];
      say([["voce", `Vittoria! La porta di «${w.t}» si tinge d'oro: <b>sigillo conquistato</b>.${msg.length ? " " + msg.join(" · ") : ""}`]], () => { check(); done(); });
    }
    function check() { if (S() === 1 && seals() >= need()) { setStep(N, 2); questDone("tm_sigilli"); } }
    function prova() { // per chi non ha ancora finito nessuna saga: la porta di prova, contro il Custode
      K.playMatch({ id: "tm_prova", alt: "az,cage,hd", force: false, oppTeam: "Le Nuvole del Custode", oppColor: "#ffe8a0", mate: "Il Custode", us: "Il Campione dei Mondi", homeKit: ["#ffd23f", "#2a1a4a"], chap: "Il Torneo dei Mondi · La porta di prova", bg: "tm_atrio", intro: "La porta di prova: una partita contro il Custode delle Porte e le sue nuvole. Più saghe finirai, più porte si apriranno.", done: (r) => { if (r.win) F.set("sig_prova", true); say([["tm_custode", r.win ? "[felice] Bene! La porta di prova è tua. Le altre ti aspettano: finisci le loro storie, e si apriranno." : "Le nuvole hanno vinto. Capita, sono morbide ma testarde. Riprova quando vuoi."]], () => { check(); done(); }); } });
    }
    const zones = {
      tm_atrio: {
        region: "atrio", name: "Il Torneo dei Mondi · L'Atrio", short: "L'Atrio", sub: "Tredici porte e un'eclissi", bg: "tm_atrio", time: "notte", travel: [14, 13], caption: "",
        w: 30, h: 22, start: [14, 13], itemCos: "tm_frammenti", items: [[2, 8], [27, 14], [2, 13]],
        areas: [[6, 7, 23, 14, "La piazza dell'eclissi"], [0, 0, 29, 21, "L'Atrio"]],
        intro: [["voce", "Un'eclissi. Il sole diventa un anello d'oro, il Borgo Marino trattiene il fiato, e quando la luce torna la piazza non c'è più: c'è l'Atrio. Un cerchio di tredici porte, ognuna con un colore diverso."], ["voce", "Da alcune porte arrivano rumori conosciuti. Altre sono chiuse, grigie, con un lucchetto di luce."]],
        npcs: (s) => [{ id: "tm_custode", at: [14, 10] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(2, 4, 27, 6, ":"); lay(2, 15, 27, 17, ":"); lay(6, 7, 23, 14, "+"); lay(24, 10, 27, 10, ":");
          Object.keys(K.POS).forEach((k) => { const [x, y] = k.split(",").map(Number); put(x, y, "P"); });
          put(3, 10, "s"); [[1, 1], [28, 1], [1, 20], [28, 20], [15, 1], [15, 20]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) { // il disegno dell'eclissi sul pavimento della piazza
          const x = d.X(14) + 8, y = d.Y(10) + 8; g.strokeStyle = "rgba(255,210,63,.35)"; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 40, 0, 7); g.stroke(); g.strokeStyle = "rgba(200,170,255,.25)"; g.beginPath(); g.arc(x + 6, y - 4, 34, 0, 7); g.stroke();
        },
      },
    };
    const talk = {
      tm_custode() {
        const s = S(), open = K.openWorlds();
        if (s === 0) return say([["tm_custode", `[felice] Un campione! Finalmente. Ogni eclissi apro le porte, e quasi mai passa qualcuno. Sono il Custode. Dietro ogni porta c'è il mondo di una saga.`], ["tm_custode", open.length ? `[pensa] Ti conoscono in ${open.length} ${open.length === 1 ? "mondo" : "mondi"}: ${open.map((w) => w.e).join(" ")}. Le loro porte sono aperte. Il campione di ogni mondo ti sfiderà nel suo modo di giocare. Vinci, e la porta si tinge d'oro: è un sigillo.` : "[pensa] Nessun mondo ti conosce ancora: le porte restano chiuse finché non finisci le loro storie. Ma c'è la porta di prova: gioca contro di me e le mie nuvole."]], () => { setStep(N, 1); K.learnLore("l_porte"); quest("tm_sigilli", "I sigilli dei mondi", `Vinci ${need()} sfide dietro le porte.`); done(); });
        if (s === 1) { if (!open.length && !F.is("sig_prova")) return ask("tm_custode", "Nessuna porta ti conosce ancora. Vuoi giocare la porta di prova, contro di me?", [{ label: "Gioca la porta di prova", cls: "hot", fn: prova }, { label: "Non ancora", fn: done }]); return say([["tm_custode", `Sigilli: ${seals()}/${need()}. Le porte aperte brillano del colore del loro mondo.`]]); }
        if (s === 2) return ask("tm_custode", "Hai i sigilli. Le porte ti riconoscono, e qualcuno dall'altra parte vuole conoscerti meglio: i compagni dei campioni. Ma prima dimmi: perché sei entrato nell'Atrio?", [
          { label: "«Per giocare con tutti quelli che ho conosciuto»", sub: "Il cuore", big: true, fn: () => fine1("cuore") },
          { label: "«Per vincere. In ogni mondo»", sub: "La sfida", big: true, fn: () => fine1("sfida") },
        ]);
        return say([["tm_custode", "Le porte sono aperte. Il resto lo decidi tu."]]);
      },
    };
    function fine1(kind) {
      bond(kind === "cuore" ? "legami" : "sigilli", 2); const msg = K.reward("c1:tm", { coins: 60, cos: ["tm_c1"] }); finishChapter(N, kind); setStep(N, 5);
      say([["tm_custode", kind === "cuore" ? "[felice] Allora ti piacerà quello che viene dopo: dalle porte stanno arrivando visite." : "[furbo] Vincere in ogni mondo… ambizioso. Allora ti servirà una squadra all'altezza. Dalle porte stanno arrivando visite."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «La squadra mista».`]], () => K.openMain());
    }
    const obj = {
      "tm_atrio:P": ({ tx, ty }) => { const w = K.worldAt(tx, ty); if (!w) return done(); if (!K.isOpen(w)) return say([["voce", `La porta di «${w.t}» ${w.e} è chiusa da un lucchetto di luce. Si apre finendo quella saga (almeno un finale), dal Salone delle Saghe.`]]); if (S() < 1) return say([["voce", "La porta vibra, ma non si apre ancora. Prima parla con il Custode, al centro della piazza."]]); challenge(w); },
    };
    return { n: N, title: "L'eclissi", sub: "L'Atrio, le tredici porte, i primi sigilli", goal, start: "tm_atrio", introBg: "tm_atrio", zones, talk, obj,
      intro: () => [["voce", "<b>IL TORNEO DEI MONDI.</b> Un pomeriggio qualunque al Borgo Marino. Poi il sole comincia a scurirsi, da un lato, come un biscotto morsicato."]] };
  }
  boot();
})();
