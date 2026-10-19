// js/figurine-c2.js - «CACCIATORI DI FIGURINE» · Capitolo 2: Il Bosco dei Fischi
// Le figure spariscono dai prati. Nives si unisce al viaggio (la Rotta), un bosco che fischia, una radura con un vecchio collezionista e un'imboscata.
(function () {
  "use strict";
  function boot() {
    const E = window.__figurineCore;
    if (!E || !E.api || !E.api.addChapter || !window.__lotta || !window.__figurineH) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const H = window.__figurineH(K), { say, done, ask } = H, { setStep, quest, F } = K;
    const N = 2, S = () => K.stepOf(N), PASS = K.PASS;
    H.cast("fg_anselmo", "Anselmo", "Vecchio collezionista", { style: "bald", hair: "#ccc", beard: "baffi", acc: ["berretto", "occhiali"], shirt: "#44403c", bg: ["#292524", "#d6d3d1"] }, "Aveva ventidue figure. Ora ne ha una, e un posto vuoto sulla mensola per ogni altra.");
    H.cast("fg_retiere", "Retiere", "Cacciatore della Fabbrica", { style: "buzz", hair: "#1f2937", acc: ["occhiali"], shirt: "#111827", bg: ["#0f172a", "#94a3b8"] }, "Lavora per la Fabbrica Album. Non è cattivo: è solo molto efficiente.");
    K.cos("fg_c2", { kind: "shirt", label: "Maglia del Bosco", val: "#15803d", from: "Capitolo 2 di Cacciatori di Figurine" });
    K.lore("l_fabbrica", { t: "La Fabbrica Album", d: "Un'azienda che cataloga figure in vetrina, con un cartellino col prezzo. Dice di proteggerle." });

    const goal = (s) => ({
      0: "Parla con Ginestra nell'edicola di Pratofiore: sta sparendo qualcosa.",
      1: `Apri la Rotta con Nives e vai al Bosco dei Fischi. Cattura 2 nuove figure (Album ${K.catch.list().length}/5).`,
      2: "Nella radura (sentiero a sud del bosco) cerca Anselmo.",
      3: "Torna nel bosco: il Retiere ti aspetta. Poi apri la Rotta."
    }[s] || "Il capitolo 2 è concluso. Segue la Città delle Vetrine.");
    const chk = () => { if (S() === 1 && K.catch.list().length >= 5) { setStep(N, 2); quest("fg_c2b", "La radura", "Cerca Anselmo nella radura, a sud del bosco."); say("voce", "<b>Album 5/5.</b> Tra gli alberi c'è un sentiero a sud che sembra molto calpestato."); } };
    function fin() {
      F.set("fg_c2_done", true); K.reward("fg_c2", { coins: 90, cos: "fg_c2" }); K.finishChapter(N, "ok");
      K.scene([["voce", "Il Bosco dei Fischi smette di fischiare. Per un istante, anche gli alberi sembrano ascoltare."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> Album ${K.catch.list().length} · Scorte ${K.stat("scorte")} · Fama ${K.stat("fama")}.`], ["voce", "Il Capitolo 3, «La Città delle Vetrine», ti aspetta."]], () => K.openMain(), "fg_titolo");
    }
    const nives = () => {
      if (K.rel.scene("fg_nives")) return;
      if (S() === 3 && K.inZone("fg_bosco") && !F.is("fg_ret_done")) {
        say("fg_nives", "[serio] Dietro di noi. Ho sentito una rete. Non guardare: tienila d'occhio.");
        return ask("Il Retiere esce dal fogliame con una rete e un sorriso da contratto.", [{ label: "Accetti la lotta", big: true, fn: () => {
          say("fg_retiere", "[serio] Non è personale. Sono solo qui per catalogare. Quella figura, la tua, è fuori inventario.");
          K.catch.battle([["fg_tonino", 2], ["fg_zolla", 2]], { title: "Lotta nel bosco · contro il Retiere", done: (r) => {
            if (!r.win) { say("fg_retiere", "[ride] Non vi accanite. Tornate quando l'Album sarà più grosso."); return done(); }
            F.set("fg_ret_done", true); say("fg_retiere", "[pensa] Mi hai battuto con un'ottima squadra. Lo riferirò. Con onestà. Cioè, con tutto quello che mi conviene."); K.bond("fama", 1); fin();
          } });
        } }]);
      }
      say("fg_nives", S() === 0 ? "Ho sentito che Ginestra ti cerca. Io ci sono, se vuoi compagnia." : "Dove andiamo? Ho le scarpe asciutte e la pazienza corta.");
      ask(`Scorte ${K.stat("scorte")} · Fama ${K.stat("fama")} · Album ${K.catch.list().length}/${K.catch.total}`, [
        { label: "🗺️ Guarda la Rotta", sub: "Scegli la prossima tappa", cls: "hot", big: true, fn: () => K.route.open(K.done, true) },
        { label: "Restiamo un po'", fn: K.done }
      ]);
    };
    const talk = Object.assign({
      fg_ginestra() {
        if (K.rel.scene("fg_ginestra")) return;
        if (S() === 0) {
          say("fg_ginestra", "[serio] Ieri mattina ho contato le figure del prato: ventidue. Stamattina, quattordici. Nessuna ricevuta, nessuna lettera.");
          say("fg_ginestra", "Vai al Bosco dei Fischi. Nives viene con te: sa leggere i sentieri e anche i cartelli sbagliati. Scorte: te ne servono per ogni tappa.");
          K.learnLore("l_fabbrica"); K.bond("scorte", 2); setStep(N, 1); quest("fg_c2a", "Il Bosco dei Fischi", "Apri la Rotta con Nives, a Pratofiore, e vai al Bosco.");
          return done();
        }
        say("fg_ginestra", S() >= 2 ? "Appena sai qualcosa, dimmelo. Preferisco una brutta notizia a una bella ipotesi." : "Il Bosco è a est. Nives conosce la strada."); done();
      },
      fg_nives: nives,
      fg_anselmo() {
        if (S() < 2) { say("fg_anselmo", "[serio] Le figure non si perdono: se ne vanno. Ma non qui."); return done(); }
        if (S() === 2) {
          say("fg_anselmo", "[triste] Avevo ventidue figure. Ne avevo catalogate venti, e due si erano affezionate. Un giorno sono arrivati con le reti e un foglio firmato da qualcuno che non conoscevo.");
          say("fg_anselmo", "Dicono che le portano in città per proteggerle. Io ho visto le vetrine. Non so da cosa le proteggano.");
          K.rel.add("fg_anselmo", 2, true);
          return ask("Anselmo ti guarda con una calma che costa fatica.", [
            { label: "«Le riporterò a casa»", sub: "Fama +1", big: true, fn: () => { K.bond("fama", 1); say("fg_anselmo", "[felice] Non prometterlo. Fallo. Se serve, ti presto la mia ultima figura."); K.catch.add("fg_orsa"); say("voce", "Mamma Orsa esce dalla mensola e si siede accanto a te: «Ti tengo d'occhio».", null); next3(); } },
            { label: "«Capito, ti aiuto»", sub: "Rapporto +1", fn: () => { K.rel.add("fg_anselmo", 4, true); say("fg_anselmo", "Grazie. È una cosa che si dimentica: aiutare, e basta."); next3(); } }
          ]);
        }
        say("fg_anselmo", "Il Retiere passa di qui all'imbrunire. Con la Fabbrica non si scherza, ma si può discutere."); done();
      }
    }, H.wild(["fg_ghirigoro", "fg_raffica", "fg_caldana", "fg_sipario"], chk));
    function next3() { setStep(N, 3); quest("fg_c2c", "L'imboscata", "Torna nel bosco: il Retiere è tra gli alberi."); done(); }
    const WILD = { fg_ghirigoro: [8, 7], fg_raffica: [22, 10], fg_caldana: [7, 15], fg_sipario: [20, 16] };
    const zones = {
      fg_bosco: {
        region: "bosco", name: "Bosco dei Fischi", short: "Bosco", sub: "Rami bassi, fischi nel vento e foglie che fanno da rumore di fondo", bg: "fg_bosco", time: "giorno",
        w: 32, h: 22, start: [15, 4], items: [[4, 5], [27, 16]],
        areas: [[0, 0, 31, 21, "Il Bosco dei Fischi: ogni tronco ha una voce"]],
        npcs: () => H.here(["fg_ghirigoro", "fg_raffica", "fg_caldana"], WILD).concat(K.clock.is("Sera") || K.clock.is("Notte") ? H.here(["fg_sipario"], WILD) : []).concat([{ id: "fg_nives", at: [13, 6] }]),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 21, 31, 21, "t"); lay(0, 0, 0, 21, "t"); lay(31, 0, 31, 21, "t");
          lay(14, 1, 17, 8, "+"); lay(3, 9, 28, 10, "+"); lay(14, 11, 17, 20, "+");
          [[3, 3], [28, 3], [4, 7], [26, 7], [3, 13], [27, 13], [8, 17], [24, 18], [9, 12], [22, 13], [11, 4], [21, 5]].forEach(([x, y]) => put(x, y, "t"));
          house(14, 21, 3, 1, { door: [15, 21], enter: { to: "fg_radura", at: [15, 2] } });
        }
      },
      fg_radura: {
        region: "bosco", name: "La Radura di Anselmo", short: "Radura", sub: "Una capanna, una mensola con troppi posti vuoti e una luce bassa", bg: "fg_bosco", time: "sera",
        w: 28, h: 20, start: [14, 3], items: [[4, 14], [22, 14]],
        areas: [[0, 0, 27, 19, "La Radura: un tetto basso, un camino acceso e un vecchio con la pazienza di un sasso"]],
        npcs: () => [{ id: "fg_anselmo", at: [14, 10] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 19, 27, 19, "t"); lay(0, 0, 0, 19, "t"); lay(27, 0, 27, 19, "t");
          lay(13, 1, 15, 17, "+"); [[3, 4], [24, 4], [4, 12], [23, 12], [8, 16], [19, 16]].forEach(([x, y]) => put(x, y, "t")); put(18, 8, "b");
          house(14, 0, 3, 1, { door: [15, 0], enter: { to: "fg_bosco", at: [15, 20] } });
        }
      }
    };
    return {
      n: N, title: "Il Bosco dei Fischi", sub: "Figure che spariscono e un vecchio collezionista",
      goal, start: "fg_borgo", introBg: "fg_titolo", zones, talk, obj: {},
      patch: { fg_borgo: { npcs: (s, list) => (s >= 1 ? list.concat([{ id: "fg_nives", at: [16, 12] }]) : list) } },
      intro: [["voce", "Pratofiore, il mattino dopo. Sul prato mancano figure, e Ginestra ha la faccia di chi ha contato due volte."], ["voce", "Nives sta appoggiata al muro dell'edicola, con un'aria troppo casuale per essere casuale."]]
    };
  }
  boot();
})();
