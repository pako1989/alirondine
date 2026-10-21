// js/fischietto-c4.js - «IL FISCHIETTO» · Capitolo ponte: La Cartolina di Montegol (con Operazione Doppio Zero)
// Dopo la finale: una cartolina, un agente «solo di passaggio» e una crittografa. Dossier «ponte» (6 voci, 3 contraddizioni) e un verdetto su chi deve saperlo.
// Gli ospiti sono Sterling ed Eva di Operazione Doppio Zero. Finale bonus: «Il Fischietto Doppio Zero».
(function () {
  "use strict";
  function boot() {
    const E = window.__fischiettoCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K;
    const N = 4, S = () => K.stepOf(N), DS = K.dossier, PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const got = (i, txt) => { if (DS.add("ponte", i)) say("voce", `<b>Nel dossier:</b> ${K.esc(DS.cases.ponte.items[i].t)} (${DS.list("ponte").length}/6)`); if (txt) say("voce", txt); };
    // gli ospiti arrivano da Operazione Doppio Zero: se quella saga è già caricata hanno già la loro scheda, altrimenti la portano qui
    K.cast("dz_sterling", { name: "Agente Sterling", sub: "Agente Speciale 00", style: "slick", hair: "#1c1917", eye: "#2563eb", skin: "#e0ac7e", shirt: "#0f172a", acc: ["occhiali"], bg: ["#064e3b", "#0f172a"] }, "Il più raffinato agente segreto della sezione sportiva. Non perde mai la calma, non sbaglia mai un cross e preferisce le carambole a effetto alle pistole.");
    K.cast("dz_eva", { name: "Eva Vesper", sub: "Esperta Crittografa", style: "bob", hair: "#2b1d14", eye: "#10b981", skin: "#f5d6b8", shirt: "#e11d48", acc: ["cuffie"], bg: ["#10b981", "#022c22"] }, "Mente brillante dei servizi tecnologici. Calcola traiettorie paraboliche al millimetro e sa decifrare qualsiasi codice radio prima che scada il tempo.");
    K.cos("fi_c4", { kind: "shirt", label: "Smoking del Giurì", val: "#0f172a", from: "Capitolo ponte di Il Fischietto" });

    const n6 = () => DS.list("ponte").length;
    const goal = (s) => ({
      0: "Parla con Edvige nella Federazione (Piazza Vecchia): è arrivata una cartolina.",
      1: `All'Albergo Montegol (Piazza Vecchia, in basso a destra): Sterling ed Eva. Dossier ${n6()}/6. Il verdetto lo decidi da Eva.`
    }[s] || "Il capitolo ponte è concluso. Rivivi i finali dal Registro.");

    function fin(id, solid) {
      const hi = solid >= 0.66; let lines;
      if (id === "agente") {
        if (hi) K.bond("fama", 2);
        lines = [["dz_sterling", "[pensa] Mi consegni tutto, senza chiedermi niente. È raro, e un po' pericoloso per te. Il Servizio la chiuderà senza rumore."], ["dz_eva", "[felice] E io ti lascio il cifrario. Se qualcuno ti scrive in codice, ora sai come rispondere."], ["voce", hi ? "Con le tre prove incrociate, il Servizio ha tutto quello che serve. La partita di Montegol si gioca pulita." : "Le prove erano poche: il Servizio chiude, ma resta un dubbio. Sterling lo sa, e fa finta di no."]];
      } else if (id === "procura") {
        if (hi) { K.bond("fama", 2); K.bond("integrita", 1); }
        lines = [["fi_edvige", "[serio] La Procura federale non è mai stata così educata con noi. Qualcuno, a Roma, ha letto la cartolina e ha deciso di non ridere."], ["dz_sterling", "[serio] Strada lunga, ma vera. Non l'avrei scelta io. Per questo la rispetto."], ["voce", hi ? "Con il dossier solido, la Procura apre un'indagine: la rete delle scommesse perde il suo primo anello." : "Il dossier ha dei buchi. La Procura prende tempo, e la rete anche."]];
      } else {
        K.bond("integrita", -1);
        lines = [["fi_edvige", "[serio] Ho archiviato. Mi hai chiesto tu di non guardare. Ma ricordati: quello che non guardi, ti guarda."], ["dz_eva", "[triste] Il cifrario resta lì, sulla scrivania. Qualcuno lo leggerà. Non so se sarà quello giusto."]];
      }
      lines.push(["voce", `<b>FINE DEL CAPITOLO PONTE.</b><br>Integrità ${K.stat("integrita")} · Reputazione ${K.stat("fama")}. ${id === "archivia" ? "" : "Finale «Il Fischietto Doppio Zero» trovato."}`]);
      K.reward("fi_c4" + id, { coins: id === "archivia" ? 60 : 160, cos: "fi_c4" });
      setStep(N, 2); K.finishChapter(N, id); if (id !== "archivia") K.end("doppio");
      K.scene(lines, () => K.openMain(), "fi_titolo");
    }

    const talk = {
      fi_edvige() {
        if (K.stepOf(3) < 3 && !K.inZone("fi_citta_i0")) return PASS;
        if (K.stepOf(3) < 3) return PASS;
        if (!K.inZone("fi_citta_i0")) return PASS;
        const s = S();
        if (s === 0) {
          say("fi_edvige", "[serio] Dopo la finale, un po' di calma. Poi è arrivata questa. Una cartolina di Montegol, senza mittente: «Primo tempo 3-0. Secondo, a piacere.»");
          say("fi_edvige", "L'ho trovata lunedì sotto la porta, in una busta senza francobollo. E ieri sera è arrivato un signore in smoking all'albergo. Dice di essere un osservatore internazionale. Non ho mai visto un osservatore con le scarpe lucide.");
          got("p_cart"); got("p_edv", "«La cartolina è arrivata il 21 marzo, a mano, senza francobollo.»");
          setStep(N, 1);
          quest("fi_c4", "La Cartolina di Montegol", "All'Albergo Montegol (Piazza Vecchia, in basso a destra): parla con Sterling ed Eva. Poi decidi.");
          return done();
        }
        if (s === 1) { say("fi_edvige", `Albergo Montegol, in fondo alla piazza. Nel dossier ${n6()}/6 voci. Io resto qui a non vedere niente.`); return done(); }
        return PASS;
      },
      dz_sterling() {
        if (S() < 1) return PASS;
        if (!DS.has("ponte", "p_ster")) {
          say("dz_sterling", "[ride] Signor arbitro. Sterling, osservatore. Sono qui per guardare una partita e bere un tè. Nient'altro. Se cerca un agente, ha sbagliato albergo.");
          say("dz_sterling", "[pensa] Dico per dire: ho solo due valigie. Una è per i vestiti. L'altra, per i vestiti di riserva.");
          got("p_ster"); return done();
        }
        if (S() >= 2) { say("dz_sterling", "Ci rivedremo. Probabilmente non lo noterà."); return done(); }
        say("dz_sterling", "Ha già il mio tè e la mia storia. Il resto lo trova da Eva: lei ha più prove di me e meno pudore."); done();
      },
      dz_eva() {
        if (S() < 1) return PASS;
        if (S() >= 2) { say("dz_eva", "Il cifrario è tuo, se ti serve. Ma non so a chi."); return done(); }
        if (!DS.has("ponte", "p_eva")) {
          say("dz_eva", "[felice] Un arbitro! Perfetto: capisce i codici di campo. Guarda: «3-0» non è un risultato, è un cifrario. Tre quarti del tabellone, zero rischi: significa «punta sul primo tempo e non toccare il secondo».");
          got("p_eva"); return done();
        }
        if (!DS.has("ponte", "p_reg")) {
          say("dz_eva", "Ho anche scaricato il registro dell'albergo e il tabulato di un cercapersone. Il primo dice chi dorme in camera 12. Il secondo, chi scrive a chi. Leggili con calma: i fatti sono tutti lì, aspettano che qualcuno li accosti.");
          got("p_reg"); got("p_tab");
          return done();
        }
        say("dz_eva", `Nel dossier ${n6()}/6 voci, ${DS.found("ponte")}/3 contraddizioni.`);
        ask("Eva ti passa la penna.", [
          { label: "🗂️ Apri il Dossier", sub: "Confronta due voci", fn: () => DS.open("ponte", K.done, true) },
          { label: "⚖️ Decidi cosa fare", sub: "A chi consegnare la cartolina", big: true, fn: () => DS.verdict("ponte", K.done, true, (id, solid) => fin(id, solid)) },
          { label: "Non ancora", fn: K.done }
        ]);
      }
    };
    const zones = {};
    return {
      n: N, title: "La Cartolina di Montegol", sub: "Capitolo ponte · con Operazione Doppio Zero",
      goal, start: "fi_citta", introBg: "fi_titolo", zones, talk, obj: {},
      patch: { fi_citta: { build(L) { L.house(23, 14, 5, 4, { door: [25, 17], roof: "#0f172a", enter: { room: "locanda", name: "Albergo Montegol · camera 12", who: ["dz_sterling", "dz_eva"] } }); } } },
      intro: [["voce", "Qualche settimana dopo la finale. Ponterosso è tornata a fare il suo mestiere preferito: parlare di arbitri."], ["voce", "Edvige ha una cartolina in mano. E in piazza è appena arrivato qualcuno che profuma di tè e di cose non dette."]]
    };
  }
  boot();
})();
