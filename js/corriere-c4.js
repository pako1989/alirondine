// js/corriere-c4.js - «IL CORRIERE DEL PALLONE» · Capitolo 4: Il Pacco Aperto
// Ettore e Nina da convincere, poi la notte allo Stadio Vecchio con tutti: il pacco senza indirizzo ha tre destini (consegna, dono allo stadio, apertura).
(function () {
  "use strict";
  if (!window.__corriereCh) return;
  window.__corriereCh(function (K, S) {
    const on = () => K.ch() === 4, st = () => K.step(4), D = (n) => K.flag("c4_" + n);
    const wrap = (obj, id, fn) => { const prev = obj[id]; obj[id] = function (a, b) { return on() ? fn(a, b) : prev ? prev(a, b) : undefined; }; };
    const night = () => K.hour() >= 23 || K.hour() < 3;
    const prevGoal = S.goal, prevHas = S.hasTalk;
    S.goal = () => {
      if (!on()) return prevGoal();
      const s = st();
      if (s === 0) return { text: "Parla con Zia Marta, in Stazione.", target: { npc: "marta" } };
      if (s === 1) return { text: "Convinci Don Ettore, al Colle delle Ville.", target: { npc: "ettore" } };
      if (s === 2) return { text: "Trova Nina, al Mercato (solo dalle 13 alle 20).", target: { npc: "nina" } };
      if (s === 3) return { text: "Allo Stadio Vecchio, dopo le 23: parla con il Custode Ruggero.", target: { npc: "ruggero" } };
      return { text: "La storia è conclusa.", target: null };
    };
    S.hasTalk = (id) => { if (!on()) return prevHas(id); const s = st(); return (s === 0 && id === "marta") || (s === 1 && id === "ettore") || (s === 2 && id === "nina") || (s === 3 && id === "ruggero"); };
    wrap(S.talk, "marta", () => {
      if (st() === 0) return K.say([["marta", "[serio] Il pacco è tornato. Pesa sempre come un pallone e sempre di più come una responsabilità. Non è dell'agenzia, non è di Ettore, non è tuo. Va deciso stanotte, allo Stadio, alla presenza di tutti."], ["marta", "Ettore deve venire, perché è sua la parte più grossa di questa storia. E Nina, che dice di non volerlo, deve dirlo in faccia a lui. Io resto qui a ricontare le bollette: questa storia mi ha rovinato il bilancio."]], () => { K.setStep(4, 1); });
      K.say([["marta", "Vai, corriere. Io qui non apro nemmeno la porta."]]);
    });
    wrap(S.talk, "ettore", () => {
      if (st() !== 1) return K.say([["ettore", "Ci vediamo allo Stadio."]]);
      const how = K.flag("c3_ettore", "");
      const line = how === "giustizia" ? "[triste] Mi hai detto che non si ruba. È vero. Vengo, ma a testa bassa." : how === "accordo" ? "[felice] Il pallone lo decide Marta. Vengo. E porto la moneta d'oro per Pina." : "[felice] Il minuto ottantanove. Vengo. Voglio rivederlo, quel pallone.";
      K.say([["ettore", line]], () => { K.setFlag("c4_ettore", 1); K.setStep(4, 2); });
    });
    wrap(S.talk, "nina", () => {
      if (st() !== 2) return K.say([["nina", "[furbo] Ciao! Niente maschera, oggi. Solo una ragazza con una pagnotta."]]);
      K.say([["nina", "[serio] Non lo voglio il pallone. Lo volevo solo per capire perché Don Ettore piangeva, ogni volta che passava davanti allo stadio."], ["nina", "Vengo. Dico quello che penso. E se mi trovate la maschera, la rimetto."]], () => { K.setFlag("c4_nina", 1); K.setStep(4, 3); K.toast("🏟️ Allo Stadio, dopo le 23"); });
    });
    function ending(id, title, lines) {
      K.end(id); K.setStep(4, 4); K.finishChapter(4, id); K.coins({ corriere: 100, libero: 140, segreto: 250 }[id]);
      K.say(lines.concat([["voce", `<b>FINE.</b> Hai chiuso «Il Corriere del Pallone» con il finale «${title}».`]]), () => { K.toast(`🏁 Finale: ${title}`); });
    }
    wrap(S.talk, "ruggero", () => {
      if (st() !== 3) return K.say([["ruggero", "Lo stadio è ancora in piedi. Merito tuo."]]);
      if (!night()) return K.say([["ruggero", "Sono quasi le undici? Non ancora. Passeggia: gli altri arrivano dopo le undici."]]);
      const okSeg = K.flag("c3_ettore", "") !== "giustizia" && K.inv.has("pacco_senza_indirizzo");
      K.say([["ruggero", "[serio] Eccoli: Marta non c'è, ma c'è Ettore, c'è Nina, c'è il faro acceso. Il pacco è sul dischetto del rigore. Decide chi lo ha portato fin qui."]], () => {
        K.ask("Tutti ti guardano, in silenzio. Il pacco senza indirizzo è sul dischetto.", [
          { label: "📦 Consegna il pacco a Zia Marta", sub: "Il Corriere · tutto in orario", big: true, cls: "hot", fn: () => ending("corriere", "Il Corriere", [["voce", "Metti il pacco sotto il braccio e torni in Stazione. L'etichetta resta vuota: «senza indirizzo» diventa il primo pacco dello scaffale in fondo."], ["marta", "[felice] Consegnato. Il mio bilancio ringrazia. Il mio cuore, meno."]]) },
          { label: "🏟️ Lascia il pallone allo Stadio", sub: "Il Corriere Libero · lo Stadio ha di nuovo un cuore", fn: () => ending("libero", "Il Corriere Libero", [["ettore", "[commosso] Allo stadio. Dove sarebbe dovuto stare dal novantotto."], ["ruggero", "Lo metto nella teca vicino al faro. Per le notti lunghe."], ["voce", "Il pacco resta sul dischetto. Nessuno lo apre, nessuno lo consegna. Il pallone crepato torna a casa."]]) },
          { label: "🎁 Apri il pacco", sub: okSeg ? "Segreto · serve il perdono di Ettore e il pacco con te" : "Segreto · serve che Ettore sia stato perdonato (non la giustizia) e il pacco con te", disabled: !okSeg, fn: () => ending("segreto", "Il Pacco Aperto", [["voce", "Sotto la carta, un pallone di cuoio vecchio, con una crepa dorata. E dentro, un biglietto: «per chi ha il coraggio di restituirmelo». La firma è di Ettore. Da ragazzo."], ["ettore", "[commosso] L'avevo scritto io. Non ricordavo più di averlo messo qui dentro."], ["nina", "[felice] Allora eravamo noi, il destinatario."]]) }
        ]);
      });
    });
  });
})();
