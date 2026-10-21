// js/cavaliere-c2.js - «IL CAVALIERE DEL FISCHIO» · Capitolo 2: Il Manicomio dei Rigori
// Il porto con i container e le gru (rampino sulla pila del Pierrot), poi il Manicomio dei Rigori con gli infermieri di ronda, lo studio del Dottor Spillo e l'Interrogatorio.
(function () {
  "use strict";
  function boot() {
    const E = window.__cavCore;
    if (!E || !E.api || !E.api.addChapter || !window.__cavH || !window.__interrogatorio) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__cavH(K), { say, done, ask } = H;
    const N = 2, S = () => K.stepOf(N), R = K.roof;
    H.people();
    ["cf_dock1", "cf_dock2", "cf_inf1", "cf_inf2"].forEach((id, i) => H.cast(id, ["Scaricatore", "Scaricatore", "Infermiere", "Infermiere"][i], i < 2 ? "Uomo del Pierrot" : "Del Manicomio", { style: "short", hair: "#292524", shirt: i < 2 ? "#44403c" : "#e5e7eb", skin: "#d9a679", bg: ["#292524", "#d6d3d1"] }, "Un uomo che ha il turno di notte e non vuole compagnia."));
    K.cos("cf_c2", { kind: "shirt", label: "Mantello del Porto", val: "#1e3a5f", from: "Capitolo 2 di Il Cavaliere del Fischio" });
    K.lore("l_manicomio", { t: "Il Manicomio dei Rigori", d: "Un tempo ospitava i portieri che non reggevano la pressione. Ora ospita chi ha visto qualcosa e non l'ha taciuto abbastanza." });
    const goal = (s) => ({
      0: "Parla con Micia Nera sul molo, a sud-ovest.",
      1: "Raggiungi la pila di container del Pierrot, a nord-est, col rampino dall'argine.",
      2: "Torna da Micia: ti dà la tessera per il Manicomio.",
      3: "Entra nel Manicomio (cancello a est), evita gli infermieri e raggiungi lo studio del Dottor Spillo.",
      4: "Torna da Micia, fuori dal Manicomio.",
      5: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");
    function fin() {
      F.set("cf_c2_done", true); R.rest();
      K.reward("cf_c2", { coins: 110, cos: "cf_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", `<b>FINE DEL CAPITOLO 2.</b><br>🪝 Agilità ${K.stat("agilita")} · 👁 Timore ${K.stat("timore")} · Indovinelli ${["carta1", "carta2", "carta3", "carta4", "carta5", "carta6"].filter((c) => K.dossier.has("fischio", c)).length}/6`], ["voce", "Il Capitolo 3, «Sipario e Cassaforte», ti aspetta."]]), () => K.openMain(), "cf_porto");
    }
    const zones = {
      cf_porto: {
        region: "porto", name: "Borgo Gotico · Il Porto", short: "Porto", sub: "Container impilati, gru che oscillano e un fischio di sirena lontana", bg: "cf_porto", time: "notte", w: 32, h: 22, base: "d", start: [2, 18], sneakStart: [2, 18],
        itemCos: "cf_c2", items: [[3, 14], [12, 15], [20, 16], [28, 18]], hide: "h",
        areas: [[0, 0, 31, 2, "I magazzini"], [3, 4, 24, 10, "Le file di container"], [26, 3, 31, 9, "La pila del Pierrot"], [0, 11, 31, 18, "La banchina"], [0, 0, 31, 21, "Il Porto di Borgo Gotico"]],
        act: { M: "Guarda il container", H: "Lancia il rampino", B: "Guarda la cassa", L: "Guarda il lampione", G: "Guarda la gargolla", C: "Guarda il comignolo" },
        flavor: { M: "Un container, nome e matricola cancellati. Dentro, solo ruggine e la voce del vento.", L: "Un lampione che resiste alla nebbia e alla manutenzione.", B: "Una cassa piena di cordami bagnati." },
        objects: {
          "24,6": () => R.hook(["cf_porto", 26, 6], { need: 35, text: "Rampino sulla gru: il cavo vibra, la pila di container si avvicina. Atterri sul tetto del container, con il fiato corto." }),
          "25,5": () => R.hook(["cf_porto", 23, 5], { text: "Rampino all'indietro. Il molo, con tutto il suo odore di sale e di ferro, ti riaccoglie." }),
          "29,4": () => {
            if (K.dossier.has("fischio", "carta3")) { say("voce", "La cassa del Pierrot, ormai vuota."); return done(); }
            K.dossier.add("fischio", "carta3"); K.bond("agilita", 3); K.learnLore("l_manicomio");
            say("voce", "Nella cassa, tre palloni di cuoio con una firma cancellata e un Jolly: «Parte vuoto, torna pieno, e nessuno chiede cosa c'è nel container». Dietro la carta, un indirizzo a matita: Manicomio dei Rigori.");
            if (S() === 1) { setStep(N, 2); quest("cf_c2", "Il Cavaliere del Fischio", "Torna da Micia: ti dà la tessera."); }
            done();
          }
        },
        doors: { "31,15": { to: "cf_manicomio", at: [2, 8], locked: () => (K.inv.has("cf_tessera") ? false : "Il cancello del Manicomio è chiuso: serve una tessera da infermiere.") } },
        npcs: () => [{ id: "cf_micia", at: S() >= 3 ? [29, 15] : [4, 16], face: S() >= 3 ? "right" : "down" },
          { id: "cf_dock1", at: [4, 4], route: [[4, 4], [22, 4]], speed: 0.55, guard: { range: 5, cone: 0.55 } }, { id: "cf_dock2", at: [4, 8], route: [[4, 8], [22, 8]], speed: 0.5, guard: { range: 5, cone: 0.55 } }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "d"); lay(0, 0, 31, 2, "P"); lay(0, 19, 31, 21, "Z"); lay(0, 18, 4, 18, "d");
          [[4, 5, 7, 6], [10, 5, 13, 6], [16, 5, 19, 6], [22, 5, 24, 6], [6, 11, 9, 12], [13, 11, 16, 12], [20, 11, 23, 12]].forEach(([a, b, c, d]) => lay(a, b, c, d, "M"));
          lay(25, 3, 25, 9, "Z"); lay(26, 3, 31, 9, "r"); lay(26, 9, 31, 9, "Z"); lay(26, 3, 31, 3, "P"); lay(26, 4, 30, 8, "r");
          put(24, 6, "H"); put(25, 5, "H"); put(29, 4, "B"); put(28, 5, "C"); put(27, 7, "h");
          put(31, 15, "q"); lay(30, 14, 30, 16, "d");
          put(10, 15, "L"); put(24, 15, "L"); put(2, 12, "B"); put(14, 17, "B"); put(28, 12, "B");
          put(12, 8, "h"); put(18, 8, "h"); put(8, 4, "h"); put(20, 10, "h"); put(5, 9, "h");
        },
        decor(g, cx, cy, d) { H.plaque(g, "PORTO DI BORGO GOTICO", d.X(16) + 8, d.Y(2) + 4, "#93c5fd"); H.plaque(g, "PILA 7", d.X(28) + 8, d.Y(3) + 4, "#facc15"); }
      },
      cf_manicomio: {
        interior: true, region: "manicomio", name: "Il Manicomio dei Rigori", short: "Manicomio", sub: "Corridoi pallidi, celle di portieri e luci che tremano", bg: "cf_manicomio", w: 26, h: 16, start: [2, 8], sneakStart: [2, 8], outside: ["cf_porto", 30, 15], hide: "h",
        itemCos: "cf_c2", items: [[5, 11], [12, 7], [22, 12], [9, 13]],
        act: { V: "Guarda le sbarre", Q: "Guarda l'archivio", S: "Guarda la sedia", D: "Usa la console", s: "Siediti un momento" },
        flavor: { V: "Una cella con un letto, un pallone sgonfio e un biglietto: «Non ero io, il rigore era di Lucre».", Q: "Cartelle, cartelle, cartelle: ogni portiere che ha detto di no a qualcuno.", S: "Una sedia a rotelle ferma da molto tempo." },
        objects: {},
        doors: { "24,8": { to: "cf_spillo", at: [7, 8], locked: () => S() >= 3 ? false : "La porta dello studio è chiusa a chiave. Per ora, un'altra faccenda." } },
        npcs: () => [{ id: "cf_inf1", at: [4, 7], route: [[4, 7], [19, 7]], speed: 0.5, guard: { range: 5, cone: 0.55 } }, { id: "cf_inf2", at: [19, 10], route: [[19, 10], [4, 10]], speed: 0.5, guard: { range: 5, cone: 0.55 } }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 15, "y"); lay(0, 0, 25, 1, "a"); lay(0, 0, 0, 15, "a"); lay(25, 0, 25, 15, "a"); lay(0, 15, 25, 15, "a"); put(1, 8, "v");
          lay(2, 2, 6, 2, "V"); lay(9, 2, 13, 2, "V"); lay(16, 2, 20, 2, "V"); lay(2, 13, 6, 13, "V"); lay(16, 13, 20, 13, "V");
          put(8, 13, "S"); put(22, 3, "Q"); put(22, 4, "Q"); put(10, 13, "s");
          put(8, 4, "h"); put(14, 4, "h"); put(21, 5, "h"); put(8, 11, "h"); put(14, 11, "h"); put(22, 11, "h"); put(24, 8, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "MANICOMIO DEI RIGORI", d.X(13) + 8, d.Y(1) + 4, "#e5e7eb"); }
      },
      cf_spillo: {
        interior: true, region: "manicomio", name: "Lo Studio del Dottor Spillo", short: "Studio", sub: "Libri di psichiatria, un lettino e una cassaforte a muro", bg: "cf_manicomio", w: 14, h: 11, start: [7, 8], outside: ["cf_manicomio", 23, 8],
        act: { D: "Usa la console", Q: "Guarda l'archivio", S: "Guarda la poltrona", U: "Guarda la statua", s: "Siediti un momento" },
        flavor: { Q: "Un archivio chiuso a chiave. Un'etichetta: «F. Ruggero, radiato».", S: "Una poltrona di pelle consumata dal sedere di chi dice «mi fido» troppo spesso.", U: "Un busto di Freud con un fischietto in bocca." },
        objects: {},
        doors: {},
        npcs: () => [{ id: "cf_spillo", at: [7, 3], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 10, "y"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 10, "a"); lay(13, 0, 13, 10, "a"); lay(0, 10, 13, 10, "a"); put(7, 10, "v");
          lay(2, 2, 4, 2, "Q"); lay(9, 2, 11, 2, "Q"); put(6, 2, "D"); put(8, 2, "D"); put(1, 5, "S"); put(12, 5, "S"); put(1, 8, "U"); put(12, 8, "U");
        },
        decor(g, cx, cy, d) { H.plaque(g, "DOTT. SPILLO", d.X(7) + 8, d.Y(1) + 4, "#e5e7eb"); }
      }
    };
    const talk = {
      cf_micia() {
        if (K.rel.scene("cf_micia")) return;
        const s = S();
        if (s === 0) {
          say("cf_micia", "[furbo] Il Cavaliere in persona, bagnato come un gatto in un lavandino. Mi piaci così: sei la prima persona al porto che non è qui per rubare.");
          say("cf_micia", "Il Pierrot tiene i palloni sulla pila 7, a nord-est. Ci sono due scaricatori che pattugliano: guarda le linee gialle dei loro coni e usa le ombre. Dalla banchina, il rampino sulla gru ti porta sopra la pila: serve un po' di Agilità.");
          say("cf_micia", "Non farmi domande su perché so tutto. Fammi invece un favore: portami quello che trovi, e io ti apro il Manicomio.");
          K.rel.add("cf_micia", 2, true); setStep(N, 1); quest("cf_c2", "Il Cavaliere del Fischio", "Sali sulla pila 7 col rampino della gru."); return done();
        }
        if (s === 2) {
          say("cf_micia", "[sorpreso] Hai la carta! E con la faccia di chi ha fatto una buona corsa. Va bene, la mia parte: la tessera dell'infermiera di turno. Ha una foto che non mi somiglia, ma ai cancelli non guardano la faccia.");
          K.inv.give("cf_tessera"); K.bond("agilita", 2); K.rel.add("cf_micia", 3, true); setStep(N, 3); quest("cf_c2", "Il Cavaliere del Fischio", "Entra nel Manicomio, a est.");
          say("voce", "Ottieni la <b>Tessera del Manicomio</b>: il cancello a est si apre."); return done();
        }
        if (s === 4) {
          say("cf_micia", "[serio] Hai parlato con Spillo? Lo vedo dalla faccia. Chi ha la verità in mano cammina diverso.");
          say("cf_micia", "Il Pierrot ha lasciato un altro indovinello all'Opera. Il Teatro apre la prima di stasera, e il palco più bello è di un banchiere che si chiama come un portafoglio.");
          return fin();
        }
        say("cf_micia", s === 1 ? "La pila 7, nord-est. Ci vediamo dopo." : s === 3 ? "Il cancello è aperto. Fai silenzio, e chiudi la porta." : "Il capitolo è chiuso."); done();
      },
      cf_spillo() {
        if (K.rel.scene("cf_spillo")) return;
        const s = S();
        if (s === 3) {
          say("cf_spillo", "[sorpreso] Una visita a mezzanotte? Prego, si accomodi. Se è qui per un rigore, lo calciamo all'alba. Se è per un'idea, la teniamo per il rinfresco.");
          say("cf_spillo", "Ruggero Fischi? Non ho mai avuto un paziente con quel nome. Ho avuto un arbitro, sì, ma sulla cartella c'è il nome di un altro. Può vederla da sé: purché ci passi sopra la mia pazienza.");
          return H.play(2, "Dottor Spillo", "Interrogatorio · Studio di Spillo", (r) => {
            if (r && r.win) {
              K.dossier.add("fischio", "cartella"); K.dossier.add("fischio", "carta4"); K.bond("timore", 4); K.rel.add("cf_spillo", 2, true); setStep(N, 4); quest("cf_c2", "Il Cavaliere del Fischio", "Torna da Micia, fuori dal Manicomio.");
              say("cf_spillo", "[triste] Va bene. Lo internai io, dieci anni fa. Un mese dopo la radiazione, sul tavolo c'era una busta con il timbro della Banca del Pallone. Cosa potevo fare? Firmai.");
              say("voce", "Nel Dossier entrano la <b>Cartella clinica di Ruggero</b> e l'indovinello del Manicomio. Il nome sulla busta: Lucre."); done();
            } else { say("cf_spillo", "[freddo] Ha esaurito la mia pazienza e le mie domande. Torni quando ne avrà di migliori."); done(); }
          });
        }
        say("cf_spillo", s > 3 ? "Ho già detto tutto. Mi lasci in pace con il mio caffè freddo." : "Non dovrebbe essere qui."); done();
      }
    };
    return {
      n: N, title: "Il Manicomio dei Rigori", sub: "Container, infermieri e un'indagine",
      goal, start: "cf_porto", introBg: "cf_porto", zones, talk, obj: {},
      intro: [["voce", "Il giorno dopo la pioggia è la stessa, ma ha l'odore del sale. Il porto di Borgo Gotico è un dedalo di container e ombre."], ["cf_fulgenzio", "[serio] Micia Nera la aspetta sul molo. Non si fidi di lei. Ma non si fidi nemmeno di me: sono pur sempre un maggiordomo."]]
    };
  }
  boot();
})();
