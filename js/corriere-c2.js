// js/corriere-c2.js - «IL CORRIERE DEL PALLONE» · Capitolo 2: La Notte dello Stadio
// Lia al porto (solo di mattina), Tito al mercato (solo il pomeriggio), il Custode allo Stadio Vecchio (solo la sera): tre orari da incastrare, poi la partita 3D contro le Imprese Mazzolino.
(function () {
  "use strict";
  if (!window.__corriereCh) return;
  window.__corriereCh(function (K, S) {
    const N = 2, on = () => K.ch() === 2, st = () => K.step(2), D = (n) => K.flag("c2_" + n);
    const wrap = (obj, id, fn, fb) => { const prev = obj[id]; obj[id] = function (a, b) { return on() ? fn(a, b) : prev ? prev(a, b) : fb ? fb(a, b) : undefined; }; };
    const OPP = { tier: 4, name: "Imprese Mazzolino", icon: "🏗️", ovr: 66, prize: 40, shirt: 0x6b7280, trim: 0xfbbf24, arena: "periferia", pl: ["Geometra", "Betoniera", "Gru"] };
    const prevGoal = S.goal, prevHas = S.hasTalk;
    S.goal = () => {
      if (!on()) return prevGoal();
      const s = st();
      if (s === 0) return { text: "Nuovo giorno. Parla con Zia Marta, in Stazione.", target: { npc: "marta" } };
      if (s === 1) return { text: "Il Custode Ruggero ti aspetta allo Stadio Vecchio: solo dopo le 17.", target: { npc: "ruggero" } };
      if (s === 2) { const need = !D("lia") ? "Lia la Barcaiola, al Porto (solo di mattina, fino alle 13)" : !D("tito") ? "Tito, al Mercato (solo dalle 15 alle 20)" : null; return need ? { text: `Squadra: ${(D("lia") ? 1 : 0) + (D("tito") ? 1 : 0)}/2. Trova ${need}.`, target: { npc: !D("lia") ? "lia" : "tito" } } : { text: "Squadra pronta: torna dal Custode Ruggero, allo Stadio, dopo le 20.", target: { npc: "ruggero" } }; }
      if (s === 3) return { text: "Gioca la partita notturna con il Custode, allo Stadio Vecchio (dopo le 20).", target: { npc: "ruggero" } };
      if (s === 4) return { text: "Racconta tutto a Zia Marta, in Stazione.", target: { npc: "marta" } };
      return { text: "Il capitolo 2 è concluso. Il capitolo 3 arriva.", target: null };
    };
    S.hasTalk = (id) => { if (!on()) return prevHas(id); const s = st(); return (s === 0 && id === "marta") || (s === 1 && id === "ruggero") || (s === 2 && ((id === "lia" && !D("lia")) || (id === "tito" && !D("tito")) || (id === "ruggero" && D("lia") && D("tito")))) || (s === 3 && id === "ruggero") || (s === 4 && id === "marta"); };
    wrap(S.talk, "marta", () => {
      const s = st();
      if (s === 0) return K.say([["marta", "[pensa] Il pacco è nello scaffale in fondo. Non l'ho aperto. Ho solo controllato che respirasse, per scrupolo."], ["marta", "Ruggero ha chiamato: vuole te, allo Stadio, stasera dopo le cinque. Parla di una partita e di una ruspa. Poi ha riattaccato, come fa sempre quando ha detto troppo."]], () => { K.setStep(2, 1); });
      if (s === 4) return K.say([["marta", "[felice] Hai vinto? Hai vinto. Lo stadio resta, la ruspa se ne va e il pacco ha un posto dove aspettare. Sei un corriere strano: consegni anche i miracoli."], ["voce", "<b>FINE DEL CAPITOLO 2.</b> Il pallone crepato non è più un mistero soltanto tuo. Il capitolo 3 arriva."]], () => { K.coins(120); K.finishChapter(2, "ok"); K.setStep(2, 5); K.toast("✅ Capitolo 2 concluso"); });
      K.say([["marta", s < 4 ? "Vai, vai. Gli orari non aspettano nessuno. Nemmeno me." : "Riposati, corriere."]]);
    });
    wrap(S.talk, "ruggero", () => {
      const s = st(), h = K.hour();
      if (s === 1) return K.say([["ruggero", "[serio] Corriere. La lampadina ha funzionato. Il faro funziona. Lo stadio funziona. Domani non funzionerà nulla: arrivano le ruspe delle Imprese Mazzolino."], ["ruggero", "C'è un solo modo per fermarle: una partita, stanotte, tre contro tre, con il geometra in persona. Mi servono due giocatori che si fidino di te. Lia la Barcaiola, al porto, la mattina. Tito del Banco, al mercato, il pomeriggio. Poi torna qui, dopo le otto di sera."], ["ruggero", "Ho tutto il tempo. A parte quello di dormire."]], () => { K.setStep(2, 2); K.toast("📋 Squadra: Lia e Tito"); });
      if (s === 2) return K.say([["ruggero", D("lia") && D("tito") ? (h >= 20 || h < 2 ? "[serio] Siete in due più te. Pronti? Qui si gioca a mezzanotte, ma noi cominciamo adesso." : "Siete pronti, ma il geometra arriva dopo le otto. Passeggia, mangia, torna.") : "Ti mancano i giocatori. Lia al porto di mattina, Tito al mercato di pomeriggio."]], () => { if (D("lia") && D("tito") && (h >= 20 || h < 2)) K.setStep(2, 3); });
      if (s === 3) {
        if (!(h >= 20 || h < 2)) return K.say([["ruggero", "Il geometra arriva dopo le otto. Passeggia un po', io tengo il faro acceso."]]);
        return K.ask("Il geometra Mazzolino aspetta a centrocampo. Le sue Imprese sono pronte.", [
          { label: "⚽ Gioca la partita notturna", sub: "Gabbia 3D · tre contro tre · le Imprese Mazzolino", big: true, cls: "hot", fn: () => K.match({ mode: "quick", opp: OPP, arenaId: "periferia", n: 3, secs: 90 }, (r) => { if (r && r.win) { K.setStep(2, 4); K.coins(50); K.say([["ruggero", "[felice] Il geometra ha detto che «certi stadi non si demoliscono, si perdono». Ha firmato la rinuncia sul bancone del bar, davanti a tutti. Anche l'inchiostro era commosso."], ["voce", "Lo Stadio Vecchio è salvo. Torna da Zia Marta."]]); } else K.say([["ruggero", "[serio] Persa. Succede. Il geometra aspetta domani sera, e io pure."]]); }) },
          { label: "↩ Non ancora", fn: () => {} }
        ]);
      }
      K.say([["ruggero", "Lo stadio è ancora in piedi. Merito tuo, corriere."]]);
    });
    wrap(S.talk, "lia", () => {
      if (st() < 2) return K.say([["lia", "[furbo] Buongiorno! Il mare è bello e lo so perché lo guardo dalla mattina. Dopo le tredici, invece, vado a pescare."]]);
      if (D("lia")) return K.say([["lia", "Stasera ci sono. Porto io il remo, per i casi disperati."]]);
      K.ask("Lia la Barcaiola, al Porto: «Il Custode vuole giocare? Che novità.»", [
        { label: "🎖️ «Ruggero ti vuole in squadra»", sub: "Onore", fn: () => { K.setFlag("c2_lia", 1); K.say([["lia", "[felice] Allora ci sono. Il porto ha il fiato corto, ma io ce l'ho lungo. Stasera, allo Stadio."]], () => { K.toast("⛵ Lia si unisce"); K.refresh(); }); } },
        { label: "🪙 «Ti offro il pranzo»", sub: "Astuzia", fn: () => { K.setFlag("c2_lia", 1); K.coins(-5); K.say([["lia", "[furbo] Pranzo? Ci sono. E se perdo, vinco comunque."]], () => { K.toast("⛵ Lia si unisce"); K.refresh(); }); } }
      ]);
    });
    wrap(S.talk, "tito", () => {
      if (st() < 2) return K.say([["tito", "[sorpreso] Il banco di Nonna Pina! Dalle tre alle otto lo tengo io, come un re. Ti vendo un limone con un racconto incluso."]]);
      if (D("tito")) return K.say([["tito", "Stasera ci sono. Porto io i limoni: servono come munizioni morali."]]);
      K.ask("Tito del Banco: «Una partita? Contro chi?»", [
        { label: "🏗️ «Contro chi vuole demolire lo Stadio»", fn: () => { K.setFlag("c2_tito", 1); K.say([["tito", "[serio] Ah. Allora è personale. Ci sono."]], () => { K.toast("🍋 Tito si unisce"); K.refresh(); }); } },
        { label: "🍋 «Compro tutti i tuoi limoni»", sub: "-10 monete", fn: () => { K.setFlag("c2_tito", 1); K.coins(-10); K.say([["tito", "[felice] Tutti? Allora vengo e porto anche il cassetto."]], () => { K.toast("🍋 Tito si unisce"); K.refresh(); }); } }
      ]);
    });
  });
})();
