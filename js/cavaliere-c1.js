// js/cavaliere-c1.js - «IL CAVALIERE DEL FISCHIO» · Capitolo 1: Pioggia sui Tetti
// Il rifugio sotto la villa, i tetti del Borgo Gotico (rampino, salti, guardie del Pierrot), il Commissario sulla questura e il vicolo dove tengono Zeppa.
(function () {
  "use strict";
  function boot() {
    const E = window.__cavCore;
    if (!E || !E.api || !E.api.addChapter || !window.__cavH || !window.__interrogatorio) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  const LAMPS = [[8, 10], [16, 4], [24, 12], [12, 17]];
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__cavH(K), { say, done, ask } = H;
    const N = 1, S = () => K.stepOf(N), R = K.roof;
    H.people();
    ["cf_thug1", "cf_thug2", "cf_thug3", "cf_sent1", "cf_sent2"].forEach((id, i) => H.cast(id, ["Scagnozzo Gancio", "Scagnozzo Rotella", "Scagnozzo Tappo", "Vedetta", "Vedetta"][i], "Uomo del Pierrot", { style: "short", hair: "#292524", shirt: ["#7f1d1d", "#1e3a8a", "#14532d"][i], skin: "#d9a679", bg: ["#292524", "#d6d3d1"] }, "Uno dei picchiatori che il Pierrot Bianco paga a ore. Non fa domande, e non risponde alle tue."));
    K.cos("cf_c1", { kind: "shirt", label: "Mantello della Prima Notte", val: "#111827", from: "Capitolo 1 di Il Cavaliere del Fischio" });
    K.lore("l_cavaliere", { t: "Il Cavaliere del Fischio", d: "Un ex portiere miliardario che, dopo il crollo di una partita truccata, ha messo un mantello. Non vuole vincere: vuole che le partite non siano comprate." });
    K.lore("l_pierrot", { t: "Il Pierrot Bianco", d: "Ruba palloni dagli stadi, dai caveau e dalle teche, e lascia un'indovinello su una carta da gioco. Trucco bianco, sorriso rosso e una gorgiera da arbitro." });
    const cards = () => ["carta1", "carta2", "carta3", "carta4", "carta5", "carta6"].filter((c) => K.dossier.has("fischio", c)).length;
    const goal = (s) => ({
      0: "Parla con Fulgenzio, nel rifugio.",
      1: "Sali sui tetti (botola a ovest) e raggiungi il Commissario Brandi, sulla questura, a est.",
      2: "Scendi nel vicolo dalla botola in fondo al tetto sud-est e trova Zeppa, dove lo tengono i suoi sequestratori.",
      3: "Torna al rifugio da Fulgenzio con ciò che hai scoperto.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");
    function fin() {
      F.set("cf_c1_done", true); R.rest();
      K.reward("cf_c1", { coins: 90, cos: "cf_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", `<b>FINE DEL CAPITOLO 1.</b><br>🪝 Agilità ${K.stat("agilita")} · 👁 Timore ${K.stat("timore")} · Indovinelli ${cards()}/6`], ["voce", "Il Capitolo 2, «Il Manicomio dei Rigori», ti aspetta."]]), () => K.openMain(), "cf_rifugio");
    }
    const leap = (to, extra) => () => R.leap(to, extra);
    const down = (id) => !R.down(id);
    const zones = {
      cf_rifugio: {
        interior: true, region: "rifugio", name: "Il Rifugio sotto la villa", short: "Rifugio", sub: "Schermi, una teca col mantello e una moto che non fa rumore", bg: "cf_rifugio", w: 18, h: 13, start: [8, 10], outside: ["cf_tetti", 2, 12],
        act: { D: "Usa la console", Q: "Guarda la teca", s: "Riposa un momento" },
        flavor: { Q: "La teca custodisce il mantello, il rampino di scorta e un guanto sinistro lucidato fino a sembrare nuovo. Nessuno lo ha mai visto senza." },
        objects: {
          "8,2": () => ask("La console del rifugio: telecamere, registri e il tuo Dossier.", [
            { label: "📂 Rileggi gli indovinelli e le prove", sub: `${K.dossier.list("fischio").length} elementi · Indovinelli ${cards()}/6`, fn: () => K.dossier.open("fischio", () => done(), true) },
            { label: "🩹 Cura e riposo", sub: `Vigore ${R.vigor()}/100`, disabled: R.vigor() >= 100, fn: () => { R.rest(); say("cf_fulgenzio", "[serio] Tisana, benda e un rimprovero. Nell'ordine."); done(); } },
            { label: "Chiudi", fn: done }
          ])
        },
        npcs: () => [{ id: "cf_fulgenzio", at: [9, 6], face: "down" }],
        doors: {},
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 12, "k"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 12, "a"); lay(17, 0, 17, 12, "a"); lay(0, 12, 17, 12, "a"); put(8, 12, "v");
          lay(6, 2, 11, 2, "D"); put(8, 2, "D"); lay(2, 2, 3, 3, "Q"); lay(14, 2, 15, 3, "Q"); put(14, 10, "s"); put(3, 10, "U"); put(15, 6, "B"); put(2, 7, "B");
        },
        decor(g, cx, cy, d) { H.plaque(g, "IL RIFUGIO", d.X(8) + 8, d.Y(1) + 4, "#facc15"); }
      },
      cf_tetti: {
        region: "tetti", name: "Borgo Gotico · I Tetti", short: "Tetti", sub: "Tegole bagnate, vuoti tra i palazzi e un faro sulla questura", bg: "cf_tetti", time: "notte", w: 36, h: 22, base: "Z", start: [3, 12], sneakStart: [3, 12],
        itemCos: "cf_c1", items: [[2, 7], [20, 6], [15, 16], [33, 18], [29, 4]], hide: "h",
        areas: [[1, 6, 8, 17, "Il tetto della villa"], [13, 5, 22, 17, "I tetti del Borgo"], [27, 3, 35, 9, "La questura"], [27, 12, 35, 19, "Il tetto delle ciminiere"], [0, 0, 35, 21, "I tetti di Borgo Gotico"]],
        act: { J: "Salta sul tetto di fronte", H: "Lancia il rampino", G: "Guarda la gargolla", C: "Guarda il comignolo", B: "Guarda la cassa" },
        flavor: { G: "La gargolla guarda il Borgo con una smorfia di sufficienza. Ha ragione: il Borgo se lo merita.", C: "Un comignolo di mattoni. Il fumo che sale è caldo e sa di cena.", B: "Una cassa di legno bagnata. Dentro, solo vecchie tegole." },
        objects: {
          "8,10": leap(["cf_tetti", 14, 10]), "8,15": leap(["cf_tetti", 14, 15]),
          "13,12": leap(["cf_tetti", 7, 12]),
          "22,14": leap(["cf_tetti", 28, 14], { base: 0.5 }),
          "22,6": () => R.hook(["cf_tetti", 28, 6], { need: 30, text: "Lanci il rampino verso la gronda della questura. Si aggancia con un clic. Tiri, e la pioggia ti passa sotto i piedi." }),
          "27,5": () => R.hook(["cf_tetti", 21, 5], { text: "Rampino, strappo, e sei di nuovo sui tetti del Borgo." }),
          "30,10": leap(["cf_tetti", 30, 13]), "31,12": leap(["cf_tetti", 31, 9]),
          "27,15": leap(["cf_tetti", 21, 15]),
          "21,16": () => {
            if (K.dossier.has("fischio", "carta1")) { say("voce", "La cassa dove hai trovato la prima carta. Solo tegole."); return done(); }
            K.dossier.add("fischio", "carta1"); K.bond("agilita", 2); K.learnLore("l_pierrot");
            say("voce", "Sotto un fischietto di plastica bagnato, una carta da gioco: un Jolly con il sorriso dipinto a rosso. Sul retro, un indovinello: «Mi fischiano e non respiro; mi calciano e non mi lamento...». Il Pierrot è passato di qui."); done();
          }
        },
        doors: { "1,12": { to: "cf_rifugio", at: [8, 10] }, "35,16": { to: "cf_vicolo", at: [30, 18], locked: () => S() >= 2 ? false : "La botola dà sul vicolo. Prima parla con il Commissario, sulla questura." } },
        npcs: (s) => [{ id: "cf_brandi", at: [31, 6], face: "down" }].concat(
          [{ id: "cf_sent1", at: [15, 8], route: [[15, 8], [20, 8], [20, 13], [15, 13]], speed: 0.5, guard: { range: 5, cone: 0.55 } }, { id: "cf_sent2", at: [31, 16], face: "left", guard: { range: 4, cone: 0.5, turn: 55 } }]),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 21, "Z");
          lay(1, 6, 7, 17, "r"); lay(14, 5, 21, 17, "r"); lay(28, 3, 34, 9, "r"); lay(28, 13, 34, 19, "r");
          lay(1, 5, 7, 5, "P"); lay(14, 4, 21, 4, "P"); lay(28, 2, 34, 2, "P");
          put(8, 10, "J"); put(8, 15, "J"); put(13, 12, "J"); put(22, 14, "J"); put(22, 6, "H"); put(27, 5, "H"); put(30, 10, "J"); put(31, 12, "J"); put(27, 15, "J");
          put(1, 12, "q"); put(35, 16, "q");
          put(3, 8, "C"); put(6, 15, "C"); put(5, 10, "h"); put(2, 16, "h"); put(6, 7, "B"); put(1, 6, "G"); put(7, 6, "G");
          put(17, 6, "C"); put(19, 11, "C"); put(15, 15, "C"); put(17, 10, "h"); put(18, 15, "h"); put(15, 6, "h"); put(21, 16, "B");
          put(28, 3, "G"); put(34, 3, "G"); put(33, 14, "C"); put(29, 18, "C"); put(31, 17, "h"); put(30, 4, "C");
        },
        decor(g, cx, cy, d) { H.plaque(g, "QUESTURA", d.X(31) + 8, d.Y(2) + 4, "#93c5fd"); H.plaque(g, "VILLA", d.X(4) + 8, d.Y(5) + 4, "#facc15"); }
      },
      cf_vicolo: {
        region: "vicolo", name: "Borgo Gotico · Il Vicolo dei Fischi", short: "Vicolo", sub: "Lampioni a gas, pozzanghere e tre uomini che sorvegliano una porta", bg: "cf_vicolo", time: "notte", w: 32, h: 22, base: "p", start: [30, 18], sneakStart: [30, 18],
        itemCos: "cf_c1", items: [[3, 10], [17, 19], [29, 5], [11, 17]], buio: 0.6,
        luci: () => LAMPS.filter(([x, y]) => !R.lamp(x + "_" + y)).map(([x, y]) => [x, y, 4]),
        areas: [[0, 0, 31, 3, "La facciata dei palazzi"], [4, 5, 14, 9, "Le case storte"], [18, 6, 25, 12, "Il retro del bar"], [20, 13, 31, 20, "Il cortile dei sorveglianti"], [0, 0, 31, 21, "Il Vicolo dei Fischi"]],
        act: { H: "Lancia il rampino", L: "Spegni la lampada", B: "Guarda la cassa", M: "Guarda il container" },
        flavor: { B: "Una cassa di birra vuota. Qualcuno l'ha usata per sedersi, non per berla.", M: "Un container arrugginito. Dentro, il rumore della pioggia." },
        objects: {
          "7,10": () => { if (R.down("cf_thug1")) { say("voce", "Hai già sistemato lo scagnozzo del corridoio."); return done(); } R.drop("cf_thug1"); K.bond("timore", 3); say("voce", "Ti cali dal ferro sopra il corridoio e piombi alle spalle dello scagnozzo. Un colpo secco: dorme, con la faccia sull'asfalto."); done(); },
          "22,12": () => { if (R.down("cf_thug2")) { say("voce", "Lo scagnozzo del cortile è già fuori gioco."); return done(); } R.drop("cf_thug2"); K.bond("timore", 3); say("voce", "Una caduta silenziosa dall'alto: lo scagnozzo non vede nemmeno l'ombra. Si sdraia piano, come se fosse il suo turno di riposo."); done(); },
          "28,8": () => { if (R.down("cf_thug3")) { say("voce", "Lo scagnozzo di guardia a Zeppa non guarderà più nessuno."); return done(); } R.drop("cf_thug3"); K.bond("timore", 3); say("voce", "Il rampino sibila, e lo scagnozzo che sorvegliava Zeppa sparisce dalla sua postazione. Il vicolo, di colpo, è più silenzioso."); done(); },
          ...Object.fromEntries(LAMPS.map(([x, y]) => [x + "," + y, () => { if (R.lamp(x + "_" + y)) { say("voce", "Il lampione è spento. Il buio, qui, ti protegge."); return done(); } R.lampOff(x + "_" + y); say("voce", "Un tiro preciso, e la lampada esplode in un lampo di vetro. L'ombra si allarga come inchiostro nel latte."); done(); }]))
        },
        doors: { "1,18": { to: "cf_rifugio", at: [8, 10] } },
        npcs: () => [{ id: "cf_zeppa", at: [26, 9], face: "down" }].concat(
          down("cf_thug1") ? [{ id: "cf_thug1", at: [10, 10], route: [[10, 10], [18, 10]], speed: 0.55, guard: { range: 5, cone: 0.55 } }] : [],
          down("cf_thug2") ? [{ id: "cf_thug2", at: [22, 13], route: [[22, 13], [22, 19], [29, 19], [29, 13]], speed: 0.5, guard: { range: 5, cone: 0.55 } }] : [],
          down("cf_thug3") ? [{ id: "cf_thug3", at: [26, 12], face: "down", guard: { range: 4, cone: 0.5, turn: 45 } }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "p"); lay(0, 0, 31, 3, "P");
          [[5, 6, 9, 9], [12, 5, 17, 8], [20, 7, 24, 11], [8, 12, 13, 15], [16, 14, 21, 17], [24, 14, 28, 16]].forEach(([a, b, c, d]) => lay(a, b, c, d, "P"));
          LAMPS.forEach(([x, y]) => put(x, y, "L")); put(7, 10, "H"); put(22, 12, "H"); put(28, 8, "H");
          put(1, 18, "q"); put(2, 4, "B"); put(30, 6, "B"); put(14, 19, "M"); put(15, 19, "M"); put(6, 18, "B"); put(10, 20, "B"); put(29, 10, "M");
        },
        decor(g, cx, cy, d) { H.plaque(g, "VICOLO DEI FISCHI", d.X(16) + 8, d.Y(3) + 4, "#facc15"); }
      }
    };
    const talk = {
      cf_fulgenzio() {
        if (K.rel.scene("cf_fulgenzio")) return;
        const s = S();
        if (s === 0) {
          say("cf_fulgenzio", "[serio] Buonasera. Sono passate quattordici ore dall'ultimo pallone rubato, e da un po' preferisco contarle che dormirle.");
          say("cf_fulgenzio", "Il Pierrot Bianco ha svuotato la teca dello stadio e ha lasciato una carta da gioco con un indovinello. Il Commissario Brandi vuole parlarle, sul tetto della questura. Ha un faro, e non lo spegne mai.");
          say("cf_fulgenzio", "I tetti del Borgo non sono una strada, sono una scommessa. Il rampino si aggancia, i salti si tentano. Se cade, rotola: la tisana è pronta.");
          K.bond("agilita", 10); K.learnLore("l_cavaliere"); setStep(N, 1); quest("cf_c1", "Il Cavaliere del Fischio", "Sali sui tetti e raggiungi il Commissario Brandi.");
          say("voce", "Ricevi nuova <b>Agilità</b> (+10). Sui tetti userai il <b>rampino</b> (sicuro, serve Agilità) e i <b>salti</b> (a rischio). Una caduta costa Vigore: lo ripristini al rifugio."); return done();
        }
        if (s === 3) {
          say("cf_fulgenzio", "[felice] Zeppa è al sicuro e il Commissario ha una pista. Direi che il vecchio guanto sinistro merita una serata di riposo.");
          say("cf_fulgenzio", "Il Manicomio dei Rigori, la prossima notte. Il Pierrot ha lasciato un secondo indovinello laggiù: se ne parla in cucina, con una tazza.");
          return fin();
        }
        say("cf_fulgenzio", s < 3 ? "Se serve riposo, la console cura. Se serve coraggio, il tetto è sempre lì." : "Il capitolo è chiuso."); done();
      },
      cf_brandi() {
        if (K.rel.scene("cf_brandi")) return;
        const s = S();
        if (s === 1) {
          say("cf_brandi", "[serio] Ha scelto la strada più scomoda per arrivare. Mi piace. Non l'ha detto nessuno, ma chi vola vede meglio.");
          say("cf_brandi", "Il Pierrot Bianco ha rapito il mio informatore, Zeppa, il tabaccaio. Lo tengono nel Vicolo dei Fischi con tre uomini. Se Zeppa parla, sappiamo dove colpisce domani.");
          say("cf_brandi", "La botola a sud-est porta in vicolo. I lampioni attirano la luce: spenga quelli che può. E si ricordi: dall'alto, uno scagnozzo è più morbido che da vicino.");
          K.rel.add("cf_brandi", 2, true); setStep(N, 2); quest("cf_c1", "Il Cavaliere del Fischio", "Scendi nel vicolo e trova Zeppa."); return done();
        }
        say("cf_brandi", s === 0 ? "Fulgenzio la sta aspettando." : "Non faccia aspettare Zeppa. Gli uomini del Pierrot non sono pazienti."); done();
      },
      cf_zeppa() {
        if (K.rel.scene("cf_zeppa")) return;
        const s = S();
        if (s === 2) {
          say("cf_zeppa", "[sorpreso] Il Cavaliere! Pensavo di essere nelle mani del Pierrot per sempre, o almeno fino alla chiusura del tabacchi.");
          say("cf_zeppa", "Mi hanno chiesto una cosa sola: dove il Presidente della Federazione tiene le chiavi dello stadio. Io ho detto «non lo so». Loro hanno scritto «non lo so» su un biglietto.");
          say("cf_zeppa", "Ascolti: il Pierrot non è un pazzo. Ha un metodo. Un indovinello per ogni luogo dove una partita fu truccata. E il prossimo è al Manicomio dei Rigori.");
          K.dossier.add("fischio", "carta2"); K.bond("agilita", 3); K.rel.add("cf_zeppa", 3, true); setStep(N, 3); quest("cf_c1", "Il Cavaliere del Fischio", "Torna al rifugio da Fulgenzio.");
          say("voce", "Zeppa ti consegna una carta da gioco bagnata: un secondo Jolly, con l'indovinello del Vicolo."); return done();
        }
        say("cf_zeppa", s < 2 ? "Non dovrebbe essere qui..." : "Grazie, Cavaliere. Mi dica solo dove andare, e ci vado."); done();
      }
    };
    return {
      n: N, title: "Pioggia sui Tetti", sub: "Il rampino e il vicolo",
      goal, start: "cf_rifugio", introBg: "cf_titolo", zones, talk, obj: {},
      intro: [["voce", "Borgo Gotico, ottobre. La pioggia non smette dal giorno in cui il Pierrot Bianco ha rubato il primo pallone."], ["voce", "Sotto una villa che nessuno visita, un uomo con un guanto sinistro e un mantello nero ascolta la città respirare."]]
    };
  }
  boot();
})();
