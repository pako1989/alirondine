// js/fischietto-c1.js - «IL FISCHIETTO» · Capitolo 1: Il Gomito di Ponterosso
// Sede della Federazione, Bar Sport, Videoteca Moviola, Campo comunale. Dossier «gomito» (6 voci, 3 contraddizioni), la busta del presidente,
// verdetto del Giurì. Usa: Dossier, Rapporti, Inventario, orologio, interni automatici.
(function () {
  "use strict";
  function boot() {
    const E = window.__fischiettoCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K;
    const N = 1, S = () => K.stepOf(N), DS = K.dossier, CK = K.clock;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const got = (i, txt) => { if (DS.add("gomito", i)) say("voce", `<b>Nel dossier:</b> ${K.esc(DS.cases.gomito.items[i].t)} (${DS.list("gomito").length}/6)`); if (txt) say("voce", txt); };

    const C = (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio);
    C("fi_edvige", "Edvige", "Segretaria della Federazione", { style: "bun", hair: "#8a8a8a", acc: ["occhiali", "taccuino"], shirt: "#7c2d12", bg: ["#78350f", "#fde68a"] }, "Segretaria da trent'anni. Conosce tutti i referti a memoria e quasi tutti i segreti dei loro autori.");
    C("fi_pino", "Pino", "Guardalinee", { style: "buzz", hair: "#4a3a2a", beard: "folta", acc: ["cappellino"], shirt: "#facc15", bg: ["#713f12", "#fef08a"] }, "Guardalinee volontario. Ha la bandierina più antica della provincia e le opinioni più veloci.");
    C("fi_ottavio", "Ottavio", "Barista del Bar Sport", { style: "bald", hair: "#aaa", beard: "pizzetto", acc: ["grembiule"], shirt: "#f1f5f9", bg: ["#78350f", "#fde68a"] }, "Racconta le partite meglio di come si giocano. Ogni volta in modo diverso.");
    C("fi_tullio", "Tullio", "Videoteca Moviola", { style: "messy", hair: "#2a1a10", acc: ["occhiali"], shirt: "#0f766e", bg: ["#134e4a", "#99f6e4"] }, "Noleggia cassette e rimpianti. Giura di non aver mai riavvolto niente di non suo.");
    C("fi_dante", "Dante Lupi", "Centrocampista del Ponterosso", { style: "spiky", hair: "#2a1a10", shirt: "#b91c1c", skin: "#d9a679", bg: ["#7f1d1d", "#fecaca"] }, "Gioca duro e parla piano. Nessuno ha mai capito come sia compatibile.");
    C("fi_gualtiero", "Gualtiero Conti", "Presidente del Ponterosso", { style: "slick", hair: "#c8c8c8", beard: "pizzetto", acc: ["occhiali"], shirt: "#1e3a8a", bg: ["#1e3a8a", "#fde68a"] }, "Il presidente più elegante della Terza Categoria. Regala sempre qualcosa. Più o meno sempre con un secondo fine.");
    C("fi_livia", "Livia Serra", "Cronista del Resto del Piano", { style: "ponytail", hair: "#3a2a1a", acc: ["taccuino"], shirt: "#166534", bg: ["#14532d", "#bbf7d0"] }, "Scrive tutto, pubblica la metà, e la metà che pubblica è quasi sempre quella che serve.");

    K.cos("fi_c1", { kind: "shirt", label: "Divisa da Giurì", val: "#111827", from: "Capitolo 1 di Il Fischietto" });
    K.lore("l_giuri", { t: "Il Giurì sportivo", d: "Tre arbitri provinciali si riuniscono il lunedì per giudicare i casi della domenica. Se due sono d'accordo, il terzo ha pensato." });

    const goal = (s) => ({
      0: "Parla con Edvige nella sede della Federazione (porta in alto a sinistra).",
      1: `Raccogli prove e testimonianze (${DS.list("gomito").length}/6): Videoteca, Bar Sport, Campo comunale, l'avviso in piazza. Poi apri il Dossier e confronta. Verdetto da Edvige.`
    }[s] || "Il capitolo 1 è concluso. Segue il caso di Borgo Alto.");

    function verdict(id, solid) {
      const hi = solid >= 0.66, took = F.is("fi_busta"), lines = [];
      let iz = 0, fm = 0, tag = id;
      if (id === "assolvi") { if (hi) { iz = 2; fm = 1; lines.push(["fi_edvige", "[felice] Tre contraddizioni, un verdetto che regge. Il Giurì annuota: un caso chiuso come si deve."], ["fi_dante", "Grazie. Davvero. Non per l'assoluzione: perché ci hai pensato."]); } else { iz = took ? -1 : 0; lines.push(["fi_edvige", "[pensa] Assolto, ma il dossier non reggerebbe a un'appello. Forse hai avuto ragione. Forse fortuna."], ["fi_dante", "Meglio così. Non è un complimento: è un sollievo."]); } }
      else if (id === "ammonisci") { iz = 1; lines.push(["fi_edvige", "Un'ammonizione. Nessuno è contento, nessuno è scontento. Un classico compromesso del Giurì."], ["fi_dante", "(Annuisce senza dire niente.) Prendo. Può andare."]); }
      else { if (hi) { iz = -1; fm = 1; lines.push(["fi_edvige", "[serio] Due turni a un innocente, e lo sapevi. Il referto parla chiaro: sbagliava la nuca, non il ragazzo."], ["fi_dante", "[triste] ...Mi squalifichi per un'errore tuo. Lo ricorderò, ma senza rancore. Ci provo."]); } else { fm = 1; lines.push(["fi_edvige", "Prudente. Squalifica per due turni. Sirio sarà contento, Dante meno. E tu fuori pericolo."], ["fi_dante", "(Annuisce una sola volta.) Va bene. Due turni sono due turni."]); } }
      if (took && id !== "squalifica") { iz -= 1; lines.push(["voce", "In tasca, la busta del presidente pesa un po' di più."]); }
      K.bond("integrita", iz); K.bond("fama", fm); F.set("fi_g_" + id, true);
      K.rel.add("fi_edvige", hi ? 4 : 2, true); K.rel.add("fi_dante", id === "squalifica" ? -2 : 3, true);
      K.reward("fi_c1" + tag, { coins: 80, cos: "fi_c1" });
      setStep(N, 2); K.finishChapter(N, tag);
      K.scene(lines.concat([["voce", `<b>FINE DEL CAPITOLO 1.</b> Integrità ${K.stat("integrita")} · Reputazione ${K.stat("fama")}.`], ["voce", "Il Capitolo 2, «La Partita Finita Troppo Bene», ti aspetta a Borgo Alto."]]), () => K.openMain(), "fi_sede");
    }

    const talk = {
      fi_edvige() {
        const s = S();
        if (s === 0) {
          say("fi_edvige", "[pensa] Buongiorno, signor arbitro. Sono Edvige, segretaria. Domani è lunedì, domani c'è il Giurì.");
          say("fi_edvige", "Domenica a Ponterosso un tale Lupi avrebbe dato un gomito a un tale Bassi. Tu eri l'arbitro, quindi sei anche testimone, quindi giudichi. Funziona così, sì.");
          say("fi_edvige", "Il tuo referto, ecco. Il referto del medico, anche. Il resto è da trovare: la cassetta alla Videoteca, il guardalinee Pino al campo, Ottavio al Bar Sport. Nel dossier trovi tutto, e puoi confrontare le voci.");
          got("g_ref"); got("g_med");
          K.learnLore("l_giuri"); setStep(N, 1);
          quest("cv_f1", "Il caso del gomito", "Raccogli le voci del dossier e confrontale. Poi il verdetto da Edvige.");
          return done();
        }
        if (s === 1) {
          if (K.rel.scene("fi_edvige")) return;
          say("fi_edvige", `Nel dossier hai ${DS.list("gomito").length}/6 voci, ${DS.found("gomito")}/3 contraddizioni. Il Giurì si riunisce quando vuoi.`);
          return ask("Cosa vuoi fare?", [
            { label: "🗂️ Apri il Dossier", sub: "Confronta due voci", fn: () => DS.open("gomito", K.done, true) },
            { label: "⚖️ Emetti il verdetto", sub: "Non si torna indietro", big: true, fn: () => DS.verdict("gomito", K.done, true, (id, solid) => verdict(id, solid)) },
            { label: "Torno più tardi", fn: K.done }
          ]);
        }
        say("fi_edvige", "Il caso è chiuso. Il prossimo arriva domani, come tutte le disgrazie."); done();
      },
      fi_tullio() {
        if (S() < 1) { say("fi_tullio", "Cassette, cassette, cassette. Hai la tessera?"); return done(); }
        if (DS.has("gomito", "g_vhs")) { say("fi_tullio", "La cassetta l'hai già. Restituiscimela intera, o almeno mezza."); return done(); }
        if (CK.is("Mattina")) { say("fi_tullio", "La videoteca apre nel pomeriggio. Prima ho la colazione e la moviola personale."); return ask("Aspetti?", [{ label: "Aspetta il pomeriggio", sub: "Passa una fascia", fn: () => { CK.advance(1); K.done(); } }, { label: "Torno dopo", fn: K.done }]); }
        say("fi_tullio", "La cassetta del Telecolor, quella di Ponterosso. Il fotogramma del trentunesimo è rovinato, ma dal cappello di Lupi si capisce abbastanza.");
        got("g_vhs", "Si vede Lupi che arretra a braccia larghe. Il fotogramma del contatto è scivolato via.");
        done();
      },
      fi_pino() {
        if (S() < 1) { say("fi_pino", "[ride] Eccolo, il signor arbitro. Sei in anticipo."); return done(); }
        if (DS.has("gomito", "g_pino")) { say("fi_pino", "Ti ho già detto tutto. Anche due volte."); return done(); }
        say("fi_pino", "[serio] Io l'ho visto benissimo: gomito volontario, dalla linea. Ero vicinissimo, a due metri.");
        got("g_pino", "«Lo giuro sulla bandierina.»");
        done();
      },
      fi_ottavio() {
        if (S() < 1) { say("fi_ottavio", "Il caffè è pronto. E io, se serve, sono una fonte."); return done(); }
        if (DS.has("gomito", "g_ott")) { say("fi_ottavio", "Di nuovo? Va bene, ti ripeto: tutto alla tv."); return done(); }
        if (CK.is("Pomeriggio")) { say("fi_ottavio", "Il pomeriggio il bar è un caos. Tornate la sera o la mattina, che parlo meglio."); return ask("Aspetti?", [{ label: "Aspetta la sera", sub: "Passa una fascia", fn: () => { CK.advance(1); K.done(); } }, { label: "Torno dopo", fn: K.done }]); }
        say("fi_ottavio", "[felice] Io la partita l'ho vista alla tv del bar. Bassi è inciampato da solo, te lo giuro sulla macchina del caffè.");
        got("g_ott");
        done();
      },
      fi_dante() {
        if (K.rel.scene("fi_dante")) return;
        say("fi_dante", S() < 1 ? "Ci conosciamo? Beh, adesso sì." : "[serio] Non ho colpito nessuno di proposito. Ma non mi aspetto che mi creda: sono quello con la faccia da colpevole.");
        ask("Dante ti guarda in silenzio.", [
          { label: "Lo ascolti con calma", sub: "Rapporto +1", fn: () => { K.rel.add("fi_dante", 3); say("fi_dante", "[felice] Nessuno mi ascolta mai. Grazie."); done(); } },
          { label: "Gli dai il cartellino del nonno", sub: "Se lo hai", fn: () => { if (!K.inv.has("fi_cartellino")) { say("voce", "Non hai il cartellino giallo del nonno: forse lo trovi in piazza."); return done(); } K.inv.take("fi_cartellino"); K.rel.add("fi_dante", 8); say("fi_dante", "[felice] Era il cartellino del vecchio! Lo tengo, sai?"); done(); } },
          { label: "Via", fn: K.done }
        ]);
      },
      fi_gualtiero() {
        const s = S();
        if (s < 1) { say("fi_gualtiero", "[ride] Il signor arbitro! Sono Gualtiero Conti, presidente del Ponterosso. Passi a prendere un caffè, quando vuole."); return done(); }
        if (F.is("fi_pres")) { say("fi_gualtiero", "La mia offerta resta. Non si dice mai di no a chi fa il bene dello sport."); return done(); }
        say("fi_gualtiero", "[felice] Signor arbitro. Dante è un ragazzo serio: in quel campo non ha mai fatto male a una mosca. Voglio solo dare una mano al Giurì: una busta per il disturbo.");
        ask("Gualtiero ti porge una busta, spessa.", [
          { label: "Accetto la busta", sub: "Integrità -2. Poi non si torna indietro", fn: () => { F.set("fi_pres", true); F.set("fi_busta", true); K.inv.give("fi_busta"); K.bond("integrita", -2); say("fi_gualtiero", "[ride] Un uomo ragionevole! Il Giurì avrà una bella giornata."); done(); } },
          { label: "Rifiuto e me ne vado", sub: "Integrità +1", fn: () => { F.set("fi_pres", true); K.bond("integrita", 1); say("fi_gualtiero", "[triste] Peccato. Rimarrà un'amicizia fredda."); done(); } },
          { label: "Prendo tempo", sub: "Torno sul discorso", fn: () => { say("fi_gualtiero", "Prenda pure tempo. Io non scappo, ma i giorni sì."); done(); } }
        ]);
      },
      fi_livia() {
        if (K.rel.scene("fi_livia")) return;
        say("fi_livia", "[pensa] Livia Serra, il Resto del Piano. Se mi dici qualcosa, lo scrivo. Se non mi dici niente, lo scrivo comunque.");
        say("fi_livia", "Un consiglio gratis: Ottavio racconta tutto alla tv del bar. Ma domenica a Ponterosso, in quella zona, non c'era la corrente. Informati.");
        K.rel.add("fi_livia", 2, true);
        done();
      }
    };
    const obj = {
      "fi_citta:n"() {
        if (S() < 1) { say("voce", "Una bacheca della piazza: avvisi, mercatini e annunci di cani smarriti."); return done(); }
        say("voce", "Tra i volantini: «AVVISO ENEL: domenica, dalle 15:30 alle 17:30, interruzione di corrente in zona Bar Sport e Piazza Vecchia.»");
        if (DS.add("gomito", "g_blk")) say("voce", `<b>Nel dossier:</b> Avviso Enel (${DS.list("gomito").length}/6)`);
        if (F.get("fi_cart") !== 1 && !K.inv.has("fi_cartellino")) { F.set("fi_cart", 1); K.inv.give("fi_cartellino"); say("voce", "Sotto, attaccato con lo scotch, un cartellino giallo di cartone, vecchissimo. Lo prendi."); }
        done();
      }
    };

    const zones = {
      fi_citta: {
        region: "citta", name: "Ponterosso", short: "Ponterosso", sub: "Una piazza, un bar, una videoteca e la Federazione", bg: "fi_citta", time: "giorno",
        w: 34, h: 22, start: [2, 11], items: [[5, 15], [28, 16]],
        areas: [[0, 0, 33, 21, "Piazza Vecchia, il cuore di Ponterosso"]],
        flavor: { t: "Un albero. Qualcuno ci ha appeso il manifesto di un comizio del 1992." },
        npcs: () => (CK.is("Sera") ? [{ id: "fi_gualtiero", at: [19, 13] }] : []),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(0, 21, 33, 21, "t"); lay(0, 0, 0, 21, "t"); lay(33, 0, 33, 21, "t");
          lay(1, 10, 32, 12, "+"); lay(10, 6, 10, 20, "+"); lay(20, 6, 20, 20, "+");
          house(4, 3, 6, 4, { door: [6, 6], roof: "#6b3a2a", enter: { room: "ufficio", name: "Sede della Federazione", who: ["fi_edvige"] } });
          house(13, 3, 6, 4, { door: [15, 6], roof: "#9b2a2a", enter: { room: "locanda", name: "Bar Sport", who: () => (CK.is("Pomeriggio") ? [] : ["fi_ottavio"]).concat(CK.is("Mattina") ? ["fi_livia"] : []) } });
          house(23, 3, 6, 4, { door: [25, 6], roof: "#134e4a", enter: { room: "bottega", name: "Videoteca Moviola", who: ["fi_tullio"] } });
          put(12, 12, "n"); put(8, 14, "b"); put(22, 14, "b");
          [[3, 17], [6, 19], [27, 18], [30, 15], [14, 18]].forEach(([x, y]) => put(x, y, "t"));
          house(33, 10, 1, 3, { door: [33, 11], enter: { to: "fi_campo", at: [1, 10] } });
        }
      },
      fi_campo: {
        region: "campo", name: "Campo comunale di Ponterosso", short: "Campo", sub: "Un rettangolo di erba, due porte e duecento esperti", bg: "fi_campo", time: "giorno",
        w: 30, h: 20, start: [2, 10], items: [[4, 16], [26, 3]],
        areas: [[0, 0, 29, 19, "Il campo dove tutto è successo, alle 16:31"]],
        npcs: () => [{ id: "fi_pino", at: [15, 10] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 19, 29, 19, "t"); lay(0, 0, 0, 19, "t"); lay(29, 0, 29, 19, "t");
          lay(1, 9, 28, 11, ":"); put(6, 15, "b"); put(7, 15, "b"); put(22, 15, "b"); [[3, 4], [10, 5], [18, 4], [25, 6], [24, 16], [13, 16]].forEach(([x, y]) => put(x, y, "t"));
          house(3, 2, 6, 3, { door: [5, 4], roof: "#44403c", enter: { room: "spogliatoio", name: "Spogliatoi", who: ["fi_dante"] } });
          house(0, 9, 1, 3, { door: [0, 10], enter: { to: "fi_citta", at: [32, 11] } });
        }
      }
    };
    return {
      n: N, title: "Il Gomito di Ponterosso", sub: "Un gomito, sei voci e un Giurì",
      goal, start: "fi_citta", introBg: "fi_titolo", zones, talk, obj,
      intro: [["voce", "Domenica sera. Sei tornato a casa con il fischietto in tasca e un dubbio nel cuore."], ["voce", "Lunedì mattina, il Giurì ti aspetta. Prima: capire che cosa hai visto davvero."]]
    };
  }
  boot();
})();
