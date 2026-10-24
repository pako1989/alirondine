// js/diga-c4.js - «LA DIGA DI VALPIANA» · Capitolo 4: La Notte della Cresta
// La cresta sopra la diga, sotto la tempesta. Argine livello 5, la scelta finale con quattro finali (due con requisiti), la partita di beneficenza all'alba.
(function () {
  "use strict";
  function boot() {
    const E = window.__digaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const H = window.__digaH, { setStep, quest, F } = K;
    const N = 4, S = () => K.stepOf(N), PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled })));
      if (l.length) K.say(l, go); else go();
    };
    K.cos("vp_c4", { kind: "shirt", label: "Maglia della Notte", val: "#0f172a", from: "Capitolo 4 di La Diga di Valpiana" });
    const goal = (s) => ({
      0: "Parla con Tilde, sulla cresta. Poi Gino: servono sacchi (Argine, livello 5).",
      1: "Argine fatto. Parla con Ermete e decidi come finisce la notte."
    }[s] || "Il capitolo 4 è concluso. Rivivi i finali dal Quaderno della Piena.");

    const ENDS = {
      diga: { lines: [["vp_ermete", "[felice] Tiene. La diga tiene. Quaranta anni di crepe, e adesso tiene perché c'è una fila di gente che non l'ha mai lasciata sola."], ["vp_tilde", "[felice] Alle cinque, la pioggia ha cominciato a stancarsi. Alle sei, il lago a ritirarsi. Alle sette, qualcuno ha portato il caffè."], ["voce", "Finale <b>«La Diga Tiene»</b>. Nessuno si è salvato da solo: l'argine, stanotte, era il paese."]], coins: 260 },
      scarichi: { lines: [["vp_ermete", "[serio] Apro. L'acqua va ai Prati. Il raccolto di tre famiglie sarà il prezzo del paese."], ["vp_tilde", "[triste] Andrò io, domani, a dirglielo. Prima il caffè, poi le scuse, poi la lista dei rimborsi: ho già cominciato a scriverla."], ["voce", "Finale <b>«Gli Scarichi Aperti»</b>. La diga resiste, i prati no. Le scelte vere costano."]], coins: 200 },
      sommerso: { lines: [["vp_zita", "[triste] Va bene così. Il paese era già sotto da sessant'anni. Che ci torni tutto, una volta per sempre, è quasi una gentilezza."], ["vp_ermete", "[triste] Mi sono dimenticato di dire addio a mia madre, da bambino. Lo dico adesso, a voce bassa."], ["voce", "Finale <b>«Il Ritorno al Lago»</b>. Valpiana Vecchia scompare un'altra volta, con i pali, il campanile e la fotografia. Il paese nuovo vive."]], coins: 180 },
      campo: { lines: [["vp_zita", "[felice] Il pallone! Sante lo avrebbe voluto vedere così: in mezzo al fango, con i bambini che gridano «fuorigioco» senza sapere cosa sia."], ["vp_ermete", "[felice] L'acqua scende piano. Dove prima c'era un lago, ricompare un campo. Ha una porta, un campanile e un paese che si rimette in fila."], ["voce", "Finale <b>«Il Campo di Zita»</b>. Il lago se ne va senza fare rumore, e lascia in cambio un campo."]], coins: 320 }
    };
    function ending(id) {
      const E = ENDS[id], lines = E.lines.slice();
      lines.push(["voce", "All'alba, sul campo della piazza, si gioca la finale della Coppa della Piena. Le pozzanghere sono le stesse, ma i volontari hanno steso la tela."]);
      K.say(lines, () => K.playMatch({
        id: "vp_coppa", alt: "", force: false, squad: ["Gino", "Zattera", "Lorenza"], mate: "Gino", us: "Valpiana", oppTeam: "Consorzio XI", oppColor: "#1e3a5f", homeKit: ["#0369a1", "#f1f5f9"],
        oppNames: ["Valvola", "Sasso", "Pilone", "Bastia"], intro: "La Coppa della Piena. Un incasso per ogni gol e il resto offerto dal Bar.",
        done: (r) => {
          const win = !!(r && r.win);
          F.set("vp_coppa", win ? 1 : 0); K.bond("fiducia", win ? 1 : 0);
          K.reward("vp_c4" + id, { coins: E.coins + (win ? 80 : 0), cos: "vp_c4" });
          setStep(N, 2); K.finishChapter(N, id); K.end(id);
          K.scene([["voce", win ? "La Coppa della Piena è vostra: una coppa di latta, ammaccata, piena di caffè." : "La Coppa non è vostra. Ma l'incasso pareggia il registro, e il Consorzio non può più far finta di niente."], ["voce", `<b>FINE.</b> Hai chiuso «La Diga di Valpiana» con il finale «${({ diga: "La Diga Tiene", scarichi: "Gli Scarichi Aperti", sommerso: "Il Ritorno al Lago", campo: "Il Campo di Zita" })[id]}». Gli altri finali ti aspettano nel Quaderno della Piena.`]], () => K.openMain(), "dg_titolo");
        }
      }));
    }
    function choose() {
      const fi = K.stat("fiducia"), ar = K.stat("argine"), me = K.stat("memoria"), pal = K.inv.has("vp_pallone");
      const okDiga = ar >= 6 && fi >= 6, okCampo = me >= 5 && fi >= 5 && pal, okSomm = me >= 2;
      ask("La pioggia non smette. Davanti a te, tre mani alzate e una ruota rossa.", [
        { label: "🧱 La Diga Tiene", sub: okDiga ? "Tutti ai sacchi: ultima prova dell'Argine (livello 6)" : `Serve Argine 6 e Fiducia 6 (ora ${ar} e ${fi})`, big: true, cls: "hot", disabled: !okDiga, fn: () => { QL = []; K.argine([6], (r) => { if (r.win) ending("diga"); else { say("vp_ermete", "[triste] L'ultima fila ha ceduto. Non è colpa tua. Riproviamo, o scegli un'altra strada."); choose(); } }); } },
        { label: "🚪 Apri gli scarichi verso i Prati", sub: "Sempre possibile · il raccolto, in cambio della diga", fn: () => ending("scarichi") },
        { label: "🌊 Lascia andare il vecchio paese", sub: okSomm ? "L'acqua torna dov'era" : "Serve Memoria 2", disabled: !okSomm, fn: () => ending("sommerso") },
        { label: "⚽ Il Campo di Zita", sub: okCampo ? "Segreto: Memoria 5, Fiducia 5 e il Pallone" : "Serve Memoria 5, Fiducia 5 e il Pallone di Zita", big: true, disabled: !okCampo, fn: () => { K.inv.take("vp_pallone"); ending("campo"); } }
      ]);
    }

    const talk = {
      vp_tilde() {
        if (K.rel.scene("vp_tilde")) return;
        const s = S();
        if (s === 0 && !F.is("vp_c4_open")) {
          F.set("vp_c4_open", true);
          const v = F.get("vp_verdict");
          say("vp_tilde", "[serio] Ci siamo. Sono le dieci, il lago è alto come non l'ho mai visto. Gino ha fatto tre ore di sacchi, il paese ne ha fatte sei, e abbiamo finito il caffè.");
          if (v === "ente") { say("vp_tilde", "L'Ente ha mandato Valvola con una squadra: due ingegneri e un furgone. Meglio di niente. Molto meglio di niente."); K.bond("argine", 1); }
          else if (v === "radio") { say("vp_tilde", "Dopo la radio sono arrivate trecento persone, di cui duecentonovantanove parenti. Più del solito."); K.bond("fiducia", 1); }
          else { say("vp_tilde", "Ermete ha parlato all'assemblea. Gli tremava la voce. Nessuno ha riso. Qualcuno ha pianto, qualcuno ha portato sacchi."); K.bond("fiducia", 1); }
          say("vp_tilde", "[triste] Se vuoi un consiglio: parla con Gino, poi con Ermete. Io faccio la sindaca: dico a tutti di stare calmi, e intanto corro.");
          quest("vp_c4", "La Notte della Cresta", "Gino: Argine, livello 5. Poi Ermete.");
          return done();
        }
        say("vp_tilde", s === 0 ? "Gino ti aspetta con i sacchi. Io ho dieci cose da fare e due mani." : "Ermete ha la paratoia. Io ho la voce, e per fortuna è ancora mia."); done();
      },
      vp_gino() {
        if (K.rel.scene("vp_gino")) return;
        const s = S();
        if (s === 0) {
          say("vp_gino", "[serio] L'acqua fa quello che vuole stasera. Noi, quello che possiamo. Sacchi a coppie, una fila storta e una dritta, e speriamo.");
          return ask("Gino ti passa un sacco bagnato.", [
            { label: "Provi l'Argine (livello 5)", sub: "Il vento spinge: i sacchi vanno tenuti stretti", big: true, cls: "hot", fn: () => { QL = []; K.argine([5], (r) => { if (r.win) { K.bond("argine", 1); K.rel.add("vp_gino", 5, true); setStep(N, 1); quest("vp_c4b", "La scelta", "Parla con Ermete e decidi come finisce la notte."); say("vp_gino", "[felice] Ce l'abbiamo fatta! Vai da Ermete. Il resto, sai già come si fa: dritto, una fila alla volta."); } else say("vp_gino", "Persa? Ma non è finita. L'acqua è la stessa. Riprova."); done(); }); } },
            { label: "Non ancora", fn: K.done }
          ]);
        }
        say("vp_gino", "Io ho fatto la mia parte. Ora tocca a lui, e a chi decide."); done();
      },
      vp_ermete() {
        if (K.rel.scene("vp_ermete")) return;
        const s = S();
        if (s === 0) { say("vp_ermete", "[serio] Prima i sacchi di Gino. Poi parliamo. Il lago non ha fretta, ma noi sì."); return done(); }
        if (s === 1) {
          say("vp_ermete", "[serio] Ci siamo. Le opzioni le sai. La diga ha la paratoia, il paese ha te. Dimmi tu.");
          return ask("Ermete guarda l'acqua e poi te.", [{ label: "⚖️ Decidi", sub: "Come finisce la notte", big: true, cls: "hot", fn: choose }, { label: "Non ancora", fn: K.done }]);
        }
        say("vp_ermete", "È finita. Quasi. Le dighe, come i paesi, hanno bisogno di qualcuno che ci creda anche dopo."); done();
      },
      vp_lorenza() { say("vp_lorenza", "[serio] Trasmetto a ciclo continuo. Il paese ascolta. Alle sei, giuro, canto."); done(); },
      vp_valvola() { say("vp_valvola", "[serio] Ho dieci minuti. Ne prenderò dieci. Per la prima volta nella mia vita."); done(); }
    };
    const zones = {
      vp_cresta: {
        region: "cresta", name: "Valpiana · La Cresta", short: "Cresta", sub: "Sopra la diga, sotto la tempesta: sacchi, fari e una ruota rossa", bg: "dg_diga", time: "notte", w: 32, h: 22, base: "c", start: [1, 5],
        itemCos: "vp_c4", items: [[3, 8], [28, 8], [20, 15]],
        areas: [[1, 4, 30, 9, "La cresta"], [1, 10, 30, 17, "Gli scarichi"], [0, 0, 31, 21, "La Cresta di Valpiana"]],
        npcs: () => [{ id: "vp_tilde", at: [8, 6] }, { id: "vp_gino", at: [14, 7] }, { id: "vp_ermete", at: [22, 6] }, { id: "vp_lorenza", at: [26, 8] }, { id: "vp_valvola", at: [4, 6] }],
        doors: { "0,5": { to: "vp_diga", at: [28, 11] } },
        flood: [[3, 0, 19, 31, 21], [4, 0, 18, 31, 21]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 2, "~"); lay(0, 3, 31, 3, "F"); lay(0, 4, 31, 9, "c"); lay(0, 10, 31, 17, "h"); lay(0, 18, 31, 21, "~"); put(0, 5, "q"); put(31, 5, "F");
          [[6, 4], [10, 4], [18, 4], [26, 4]].forEach(([x, y]) => put(x, y, "Q")); put(16, 12, "V"); put(9, 12, "J"); lay(12, 14, 14, 14, "K"); lay(22, 12, 24, 12, "K");
        },
        objects: {
          "16,12": () => { say("voce", S() >= 1 ? "La ruota della paratoia dei Prati. Ermete ti guarda, in silenzio. Non serve toccarla: serve decidere." : "La ruota della paratoia dei Prati. Rossa di ruggine e di pioggia."); done(); },
          "9,12": () => { say("voce", "Il pannello d'emergenza: il tasto «ACQUA FORSE» è stato scalpellato via. Qualcuno ha scritto «SI» sopra."); done(); }
        },
        decor(g, cx, cy, d) { H.plaque(g, "CRESTA DI VALPIANA", d.X(16) + 8, d.Y(3) - 6, "#38bdf8"); H.plaque(g, "PARATOIA DEI PRATI", d.X(16) + 8, d.Y(12) - 6, "#f87171"); H.plaque(g, "◂ DIGA", d.X(1) + 8, d.Y(4) + 4, "#94a3b8"); },
        intro: [["voce", "La cresta, di notte. La pioggia non cade: attraversa. Le lampade dei volontari disegnano una fila di lucciole zuppe."], ["voce", "Sotto, tutta Valpiana trattiene il fiato."]]
      }
    };
    return {
      n: N, title: "La Notte della Cresta", sub: "Una paratoia, un paese, quattro modi di finire",
      goal, start: "vp_cresta", introBg: "dg_diga", zones, talk, obj: {},
      intro: [["voce", "Stanotte il lago è colmo. Sulla cresta, il paese intero è in fila, con i secchi, le pale e un po' di fede."], ["voce", "Tilde ti stringe la mano: «Non c'è un piano. C'è un coraggio, a turno.»"]]
    };
  }
  boot();
})();
