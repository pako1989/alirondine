// js/fischietto-c2.js - «IL FISCHIETTO» · Capitolo 2: La Partita Finita Troppo Bene
// Borgo Alto, il molo, il Totosport. Dossier «troppo» (7 voci, 3 contraddizioni), Rapporti con Ivano, orologio che decide chi si trova dove.
(function () {
  "use strict";
  function boot() {
    const E = window.__fischiettoCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K;
    const N = 2, S = () => K.stepOf(N), DS = K.dossier, CK = K.clock, PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const got = (i, txt) => { if (DS.add("troppo", i)) say("voce", `<b>Nel dossier:</b> ${K.esc(DS.cases.troppo.items[i].t)} (${DS.list("troppo").length}/7)`); if (txt) say("voce", txt); };
    const C = (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio);
    C("fi_ivano", "Ivano Reggi", "Portiere del Borgo Alto", { style: "curly", hair: "#2a1a10", beard: "pizzetto", acc: ["guanti"], shirt: "#0369a1", skin: "#d9a679", bg: ["#0c4a6e", "#bae6fd"] }, "Para con le mani e si scusa con gli occhi. Quella domenica, purtroppo, ha fatto l'opposto.");
    C("fi_rocco", "Mister Rocco", "Allenatore del Borgo Alto", { style: "bald", hair: "#aaa", beard: "folta", acc: ["fischietto"], shirt: "#166534", bg: ["#14532d", "#bbf7d0"] }, "Quarant'anni di panchina, un solo vizio: dire la verità male.");
    C("fi_nilde", "Nilde", "Ricevitoria Totosport", { style: "bob", hair: "#7a4a2a", acc: ["occhiali"], shirt: "#9d174d", bg: ["#831843", "#fbcfe8"] }, "Conosce i numeri di tutta la provincia e non dimentica nessuna giocata. Non è una virtù: è una condanna.");
    C("fi_gigio", "Gigio del molo", "Capo ormeggiatore", { style: "buzz", hair: "#4a3a2a", beard: "folta", acc: ["berretto"], shirt: "#334155", bg: ["#1e293b", "#cbd5e1"] }, "Registra ogni pagamento e ogni nave. Per i secondi ha una grafia migliore.");
    K.cos("fi_c2", { kind: "shirt", label: "Cerata del Molo", val: "#ca8a04", from: "Capitolo 2 di Il Fischietto" });

    const goal = (s) => ({
      0: "Parla con Edvige nella sede (Ponterosso): è arrivato un caso da Borgo Alto.",
      1: `Vai a Borgo Alto (uscita sud della piazza di Ponterosso). Dossier ${DS.list("troppo").length}/7: Ivano, Mister Rocco, Nilde (Totosport), Gigio (molo). Poi verdetto da Edvige.`
    }[s] || "Il capitolo 2 è concluso. Segue l'Esposto.");

    function verdict(id, solid) {
      const hi = solid >= 0.66, lines = []; let iz = 0, fm = 0;
      if (id === "procura") { if (hi) { iz = 2; fm = 1; lines.push(["fi_edvige", "[serio] La Procura federale ha fatto in due giorni quello che noi non facciamo in due anni. Il caso scoppia, il campo respira."], ["fi_ivano", "[triste] ...Ero io il debitore. Ma non ero il solo. Grazie di non avermi lasciato solo."]); } else { iz = 0; fm = -1; lines.push(["fi_edvige", "[pensa] Prematura: il dossier non reggeva, la Procura archivia. Ma c'è un'indagine aperta, ora. Non è niente."]); } }
      else if (id === "squalifica") { iz = hi ? 1 : 0; fm = 1; lines.push(["fi_edvige", hi ? "Squalifica sul campo. Giusta, ma chi ha mosso i fili è ancora libero di muoverli." : "Squalifica prudente. Il caso, così, si chiude. Forse troppo presto."], ["fi_ivano", "(Annuisce.) Lo sapevo. Era giusto, o quasi."]); }
      else { iz = hi ? -2 : -1; lines.push(["fi_edvige", hi ? "[serio] Archiviare, con tre contraddizioni sul tavolo. La Procura lo saprà. Io no. Non l'ho visto." : "[pensa] Archiviato. Meno rumore, meno rischi. Spero tu dorma."], ["fi_rocco", "[triste] Il mio portiere non deve tornare in campo come se niente fosse. Ma lo farà."]); }
      K.bond("integrita", iz); K.bond("fama", fm); F.set("fi_g2_" + id, true);
      K.rel.add("fi_edvige", hi ? 4 : 2, true); K.rel.add("fi_ivano", id === "procura" ? 5 : id === "squalifica" ? 1 : -2, true);
      K.reward("fi_c2" + id, { coins: 100, cos: "fi_c2" });
      setStep(N, 2); K.finishChapter(N, id);
      K.scene(lines.concat([["voce", `<b>FINE DEL CAPITOLO 2.</b> Integrità ${K.stat("integrita")} · Reputazione ${K.stat("fama")}.`], ["voce", "Il Capitolo 3, «L'Esposto», chiude la storia: una lettera, una finale e il fischietto in mano."]]), () => K.openMain(), "fi_sede");
    }

    const talk = {
      fi_edvige() {
        const s = S();
        if (K.stepOf(1) < 2) return PASS;
        if (s === 0) {
          say("fi_edvige", "[pensa] Borgo Alto contro Marinella: sette a zero. Cinque reti su tiri centrali, a mezza altezza, contro il portiere titolare, Ivano Reggi. La Federazione sospetta che l'abbia fatto apposta.");
          say("fi_edvige", "Ecco il referto, ecco il tabulato del cercapersone del portiere, trovato nella tasca del giubbotto. Il resto è sul posto: Borgo Alto, in pullman, uscita sud della piazza.");
          got("t_ref"); got("t_tel"); setStep(N, 1);
          quest("fi_c2", "Il caso del sette a zero", "A Borgo Alto: Ivano, Mister Rocco, il Totosport, il molo. Poi il verdetto da Edvige.");
          return done();
        }
        if (s === 1) {
          if (K.rel.scene("fi_edvige")) return;
          say("fi_edvige", `Nel dossier ${DS.list("troppo").length}/7 voci, ${DS.found("troppo")}/3 contraddizioni.`);
          return ask("Cosa vuoi fare?", [
            { label: "🗂️ Apri il Dossier", sub: "Confronta due voci", fn: () => DS.open("troppo", K.done, true) },
            { label: "⚖️ Emetti il verdetto", sub: "Squalifica, Procura o archivio", big: true, fn: () => DS.verdict("troppo", K.done, true, (id, solid) => verdict(id, solid)) },
            { label: "Torno più tardi", fn: K.done }
          ]);
        }
        return PASS;
      },
      fi_ivano() {
        if (S() < 1) return PASS;
        if (DS.has("troppo", "t_ivano")) { say("fi_ivano", "Ti ho detto quello che posso. Il resto lo sa il molo."); return done(); }
        if (K.rel.lv("fi_ivano") < 1) {
          say("fi_ivano", "[triste] Non ho niente da dirti. Ero stanco, ecco.");
          return ask("Ivano si chiude a riccio.", [
            { label: "Gli offri un caffè", sub: "Rapporto +2", fn: () => { K.rel.add("fi_ivano", 6, true); say("fi_ivano", "(Si siede.) Se proprio vuoi saperlo..."); got("t_ivano", "«Ero fuori forma. Mi faceva male la schiena.»"); done(); } },
            { label: "Lo incalzi", sub: "Rapporto -1", fn: () => { K.rel.add("fi_ivano", -1, true); say("fi_ivano", "[triste] Mi stai accusando. Parlane con l'avvocato che non ho."); done(); } }
          ]);
        }
        say("fi_ivano", "[serio] Se proprio vuoi saperlo...");
        got("t_ivano", "«Ero fuori forma. Mi faceva male la schiena.»");
        done();
      },
      fi_rocco() {
        if (S() < 1) return PASS;
        if (DS.has("troppo", "t_allen") && DS.has("troppo", "t_diario")) { say("fi_rocco", "Non ho altro. Quella domenica il campo è andato dove voleva: io mi sono preoccupato della panchina."); return done(); }
        say("fi_rocco", "[serio] Ivano parava anche i cori! Fino a sabato lo vedevo allenarsi come un ossesso. Poi domenica, quella partita... e io ho cominciato a pensare.");
        got("t_allen", "«Mai visto un portiere così, fino al giorno prima.»");
        say("fi_rocco", "Ah, il suo taccuino era negli spogliatoi. L'ha dimenticato. Io non l'ho letto, giuro. Quasi tutto.");
        got("t_diario", "«Debito: tre milioni. Scadenza: lunedì.»");
        done();
      },
      fi_nilde() {
        if (S() < 1) return PASS;
        if (DS.has("troppo", "t_sched")) { say("fi_nilde", "Le giocate non si commentano. Si registrano."); return done(); }
        say("fi_nilde", "[pensa] Una schedina esatta sul sette a zero, giocata alle 11:40 della domenica. Un gran colpo di fortuna. Qualcuno vince sempre, no?");
        got("t_sched", "Nilde ti mostra il talloncino: esito esatto, ora 11:40.");
        done();
      },
      fi_gigio() {
        if (S() < 1) return PASS;
        if (DS.has("troppo", "t_ric")) { say("fi_gigio", "Ogni ricevuta ha la sua firma. Questa, di Ivano, aveva anche un tremore."); return done(); }
        say("fi_gigio", "[serio] Lunedì mattina Ivano è venuto a pagare tre milioni in contanti per la barca del fratello. Non l'avevo mai visto con tanti soldi in mano. Né con tanta fretta.");
        got("t_ric", "Gigio ti dà la ricevuta, controfirmata.");
        done();
      }
    };
    const zones = {
      fi_molo: {
        region: "citta", name: "Borgo Alto · Il molo", short: "Borgo Alto", sub: "Un molo, il Totosport e un campo con le reti tese", bg: "fi_citta", time: "giorno",
        w: 32, h: 20, start: [16, 2], items: [[5, 8], [27, 9]],
        areas: [[0, 0, 31, 19, "Borgo Alto: casette, barche e una riva dove le voci viaggiano più delle reti"]],
        npcs: () => [{ id: "fi_ivano", at: [8, 9] }].concat(CK.is("Mattina") ? [{ id: "fi_rocco", at: [24, 9] }] : []).concat(CK.is("Pomeriggio") ? [{ id: "fi_gigio", at: [16, 11] }] : []),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 19, 31, 19, "t"); lay(0, 0, 0, 19, "t"); lay(31, 0, 31, 19, "t");
          lay(1, 13, 30, 18, "w"); lay(14, 13, 17, 18, "="); lay(1, 8, 30, 10, "+"); lay(15, 3, 16, 12, "+");
          put(10, 11, "b"); put(22, 11, "b"); [[4, 4], [27, 5], [3, 12], [28, 12]].forEach(([x, y]) => put(x, y, "t"));
          house(4, 2, 6, 4, { door: [6, 5], roof: "#9d174d", enter: { room: "bottega", name: "Ricevitoria Totosport", who: () => (CK.is("Sera") ? [] : ["fi_nilde"]) } });
          house(22, 2, 6, 4, { door: [24, 5], roof: "#374151", enter: "La capanna dei pescatori. Dentro, sedie vuote e il profumo di chi ha dormito poco." });
          house(15, 0, 3, 1, { door: [16, 0], enter: { to: "fi_citta", at: [16, 20] } });
        }
      }
    };
    return {
      n: N, title: "La Partita Finita Troppo Bene", sub: "Sette gol, un portiere e tre milioni",
      goal, start: "fi_citta", introBg: "fi_titolo", zones, talk, obj: {},
      patch: { fi_citta: { build(L) { L.house(15, 21, 3, 1, { door: [16, 21], enter: { to: "fi_molo", at: [16, 1] } }); } } },
      intro: [["voce", "Lunedì mattina. Il Giurì ha un altro caso, e questa volta è più grosso."], ["voce", "Sette a zero, tutto a mezza altezza. Un portiere che non ha mai fatto un errore così."]]
    };
  }
  boot();
})();
