// js/mondi-c2.js - IL TORNEO DEI MONDI · Capitolo 2 «La squadra mista»
// Dalle porte aperte arrivano i compagni dei campioni: Bullone, Ada, Lyra, Fiammetta, la maestra Iole, Blop…
// Ognuno ricorda la sua saga e come l'hai finita. Ne scegli fino a tre: ti seguono nell'Atrio e, nelle partite del loro
// mondo, danno un vantaggio (un tiro in più a Super-Bottoni, una lanterna in più a Luci, un riavvolgimento al Nastro…).
(function () {
  "use strict";
  function boot() { const D = window.__mondi; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cos("tm_c2", { kind: "shirt", label: "Maglia della squadra mista", val: "#6a4aaa", from: "Capitolo 2 del Torneo dei Mondi" });
    const SPOTS = [[8, 8], [11, 8], [17, 8], [20, 8], [8, 13], [11, 13], [17, 13], [20, 13], [7, 10], [21, 10], [10, 11], [18, 11], [22, 12]];
    const allies = () => K.WORLDS.filter((w) => F.is("ally_" + w.ally));
    const needA = () => Math.min(2, K.openWorlds().length);
    const goal = (s) => ({
      0: K.openWorlds().length ? `Dalle porte aperte sono arrivati i compagni dei campioni. Scegline fino a tre per la squadra mista (${allies().length}/3; ne servono almeno ${needA()}).` : "Nessun mondo ti conosce ancora: parla con il Custode, ti accompagnerà lui.",
      1: "La squadra c'è. Dillo al Custode.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    // le battute dei compagni: ricordano la loro saga, e come l'hai finita
    const HELLO = {
      ts_iole: "(Suona il fischietto di latta.) Tre passaggi senza guardare, e il terzo tira. In un altro mondo vale lo stesso, scommetto.",
      cc_lyra: "Una cavaliera non si tira mai indietro, nemmeno davanti a tredici porte. Lo scudo è pronto. Anche i piedi.",
      mg_bullone: "BIP! BOP! (Ti stira la maglia, felice. Il mantellino granata svolazza.)",
      sf_ada: "Un giorno nuovo, finalmente: qui niente si ripete. Ho portato le chiavi del Lido, per abitudine.",
      nl_fiammetta: "[felice] Ho portato la lanterna della nonna. Nell'Atrio c'è un'eclissi: un po' di luce serve sempre.",
      ve_sbuffo: "Fff! (Lo spirito del vento ti gira intorno e ti scompiglia i capelli: vuol dire sì.)",
      dc_agata: "Ispettrice Agata Brina. Ho un'ottima memoria per i volti. Il suo me lo ricordo bene. Andiamo.",
      ep_tecla: "Ho visto il campo in tre epoche diverse. Un'eclissi mi mancava. Prendo appunti.",
      so_blop: "Blop! Qui il pallone cade per terra! Lo trovo meraviglioso. Giocherò in difesa: sono morbido.",
      mu_nives: "Abbiamo buttato giù un muro, insieme. Tredici porte sono solo tredici muri con la maniglia.",
      cr_aira: "Livello di amicizia: massimo. Abilità sbloccata: «Gioco di squadra». Premi un tasto per continuare.",
      dt_nina: "Due metà dello stesso campione, e adesso una squadra di mondi diversi. Mi sento a casa.",
      lb_virgola: "Una virgola, in squadra, serve sempre: fa respirare le frasi. E i passaggi.",
    };
    function recruit(w) {
      const id = w.ally, c = K.api.CAST && K.api.CAST[id], nm = (c && c.name) || "Il compagno", et = K.endTitle(w);
      if (allies().length >= 3) return say([[id, `${HELLO[id] || ""}`], ["voce", "La squadra mista è già al completo: tre compagni, tre mondi. (Puoi liberare un posto dal Custode.)"]]);
      ask(id, `${HELLO[id] || ""}${et ? `\n\n(«${et}»: si ricorda anche di quel finale.)` : ""}`, [
        { label: `Prendi ${nm.split(",")[0]} in squadra`, sub: w.perk ? `Vantaggio: ${w.perk}` : "Un compagno dal campo classico", big: true, fn: () => { F.set("ally_" + id, true); bond("legami", 1); K.refreshZone(); say([["voce", `<b>${nm.split(",")[0]} entra nella squadra mista.</b> Ti segue nell'Atrio. (${allies().length}/3)`]], () => { if (S() === 0 && allies().length >= needA()) setStep(N, 1); done(); }); } },
        { label: "Non ancora", fn: done },
      ], w.bg);
    }
    const talk = {
      tm_custode() {
        const s = S();
        if (!K.openWorlds().length && s === 0) { setStep(N, 1); }
        if (S() === 1) return ask("tm_custode", allies().length ? `La squadra mista: ${allies().map((w) => w.e).join(" ")}. Ogni compagno, nelle partite del suo mondo, vi darà una mano. Come vi chiamate?` : "Nessun mondo ti conosce ancora, e allora gioco io con te. Come ci chiamiamo?", [
          { label: "«I Rondini dei Mondi»", big: true, fn: () => fine2("rondini") },
          { label: "«La Tredicesima Porta»", big: true, fn: () => fine2("porta") },
          { label: "«Gli Eclissati»", big: true, fn: () => fine2("eclissati") },
        ]);
        return ask("tm_custode", `La squadra mista: ${allies().length}/3. ${allies().length ? "Vuoi liberare un posto?" : "Parla con i compagni arrivati dalle porte."}`, [
          ...(allies().length ? [{ label: "Libera tutti i posti", sub: "La squadra ricomincia da capo", fn: () => { allies().forEach((w) => F.set("ally_" + w.ally, false)); K.refreshZone(); done(); } }] : []),
          { label: "Va bene così", fn: done },
        ]);
      },
    };
    K.WORLDS.forEach((w) => { talk[w.ally] = () => (F.is("ally_" + w.ally) ? say([[w.ally, HELLO[w.ally] || "Sono con te."]]) : recruit(w)); });
    function fine2(name) {
      F.set("tm_nome", name); const msg = K.reward("c2:tm", { coins: 70, cos: ["tm_c2"] }); finishChapter(N, name); setStep(N, 5);
      say([["tm_custode", "[pensa] Bel nome. Adesso ascoltate: dal buio tra i mondi sta arrivando una squadra. Non ha una porta, non ha un mondo. Si chiama l'Eclisse. Vuole giocare. Con tutte le regole di tutti i mondi, una dopo l'altra."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La staffetta dei mondi».`]], () => K.openMain());
    }
    const patch = {
      tm_atrio: { npcs: (st, list) => list.concat(K.openWorlds().filter((w) => !F.is("ally_" + w.ally)).map((w) => ({ id: w.ally, at: SPOTS[K.WORLDS.indexOf(w)] }))) },
    };
    return { n: N, title: "La squadra mista", sub: "I compagni arrivano dalle porte", goal, start: "tm_atrio", introBg: "tm_atrio", talk, patch,
      intro: () => [["voce", "<b>IL TORNEO DEI MONDI</b>, capitolo 2. Dalle porte d'oro arrivano passi, voci, un «bip», un fruscio di videocassetta. Qualcuno ti è venuto a trovare."]] };
  }
  boot();
})();
