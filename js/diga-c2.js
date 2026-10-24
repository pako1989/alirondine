// js/diga-c2.js - «LA DIGA DI VALPIANA» · Capitolo 2: Il Registro delle Piene
// La diga (coronamento, scarichi, cabina), la sala di controllo e la galleria buia (interni a mano). Dossier «piena»: sei voci, tre contraddizioni, un verdetto.
// Il lago sale ancora: Argine livello 2 (allarme alla galleria) e un'amichevole contro i Veterani della Diga.
(function () {
  "use strict";
  function boot() {
    const E = window.__digaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const H = window.__digaH, { setStep, quest, F } = K;
    const N = 2, S = () => K.stepOf(N), DS = K.dossier, PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled })));
      if (l.length) K.say(l, go); else go();
    };
    const got = (i, txt) => { if (DS.add("piena", i)) say("voce", `<b>Nel dossier:</b> ${K.esc(DS.cases.piena.items[i].t)} (${DS.list("piena").length}/6)`); if (txt) say("voce", txt); };
    const n6 = () => DS.list("piena").length;
    K.cos("vp_c2", { kind: "shirt", label: "Casco del Custode", val: "#92400e", from: "Capitolo 2 di La Diga di Valpiana" });
    K.lore("l_registro", { t: "Il Registro delle Piene", d: "Un quaderno a righe in cui, ogni sera alle 22, qualcuno scrive «livello nella norma». Sette sere di fila. Il lago, intanto, faceva altro." });
    K.lore("l_galleria", { t: "La galleria", d: "Un corridoio dentro la diga, due metri sotto il livello del lago. Dentro, le pareti sudano e Ermete conta le crepe a voce bassa." });

    const goal = (s) => ({
      0: "Sali alla diga, dal sentiero della riva (a destra). Cerca Ermete, il custode, sul coronamento.",
      1: () => `Dossier ${n6()}/6. Cerca: il registro e il pannello (cabina di controllo), Valvola (lettera), Zattera (riva). Poi torna da Ermete.`,
      2: "Ermete ti ha dato la chiave: apri la galleria (porta in basso a sinistra, sulla diga) e fotografa la crepa.",
      3: "Torna da Ermete, sul coronamento: ha il suo registro. Poi il verdetto.",
      4: "Il verdetto è pronto: parla con Ermete e decidi."
    }[s]);
    const goalFn = (s) => { const g = goal(s); return typeof g === "function" ? g() : g || "Il capitolo 2 è concluso. Il paese sotto il lago ti aspetta."; };

    function fin(id, solid) {
      const hi = solid >= 0.66; let lines;
      if (id === "ente") {
        K.bond("fiducia", hi ? 1 : 0);
        lines = [["vp_valvola", "[serio] Un dossier formale. Con allegati. Ho pianto, internamente. Lo porto io, a mano, e lo faccio protocollare davanti a me."], ["vp_ermete", "[serio] Va bene. Sarà lento. Ma è la strada che ha più firme: se fallisce, nessuno potrà dire che non ci abbiamo provato."], ["voce", hi ? "Con le contraddizioni messe in fila, l'Ente non può più fingere: apre una verifica straordinaria. Arriverà tra tre giorni." : "Il dossier ha dei buchi: l'Ente promette una verifica, «a data da destinarsi»."]];
      } else if (id === "radio") {
        K.bond("fiducia", hi ? 2 : 1); K.bond("argine", 1);
        lines = [["vp_lorenza", "[felice] Lo leggo a microfono aperto, alle otto. Non lo addolcisco, non lo ingrandisco. Una notizia vera si legge da sola."], ["vp_ermete", "[triste] Paura, in paese, ne arriverà. Ma ne arriveranno anche braccia. Non so quale pesi di più."], ["voce", hi ? "Alle otto, mezza Valpiana è già alla diga con sacchi e pale. Gino ha pianto di commozione e di fatica." : "Il paese ascolta, ma non tutti credono. Alcuni vengono, altri chiudono le finestre."]];
      } else {
        K.bond("fiducia", 1); K.bond("memoria", 1);
        lines = [["vp_ermete", "[pensa] Non è venuto a chiedermi di firmare niente. Mi hai chiesto di scegliere come dirlo. Era quarant'anni che nessuno me lo chiedeva."], ["vp_ermete", "Domani, all'assemblea, lo dico io. Con la mia voce. Se mi tremerà, tu sarai in prima fila: mi basterà guardarti."], ["voce", "Ermete firma il secondo registro con la sua grafia vera, e lo mette sul tavolo di Tilde. Non servono altre parole."]];
      }
      lines.push(["voce", `<b>FINE DEL CAPITOLO 2.</b> Livello ${K.flood.name()} · Fiducia ${K.stat("fiducia")} · Argine ${K.stat("argine")}.<br>Dossier ${n6()}/6.`]);
      F.set("vp_verdict", id); F.set("vp_solid", hi ? 1 : 0);
      K.reward("vp_c2" + id, { coins: 100 + (hi ? 40 : 0), cos: "vp_c2" });
      setStep(N, 5); K.flood.add(1); K.finishChapter(N, id);
      K.scene(lines.concat([["voce", "Il Capitolo 3, «Il Paese sotto il Lago», ti aspetta. Zita ha una storia da raccontarti."]]), () => K.openMain(), "dg_diga");
    }
    function match() {
      K.say(flush(), () => K.playMatch({
        id: "vp_amichevole", alt: "", force: false, squad: ["Gino", "Zattera", "Lorenza"], mate: "Gino", us: "Valpiana", oppTeam: "Veterani della Diga", oppColor: "#7f1d1d", homeKit: ["#0369a1", "#f1f5f9"],
        oppNames: ["Bastia", "Ciocca", "Sasso", "Pilone"], intro: "Il campo della piazza, pozzanghere comprese. I Veterani della Diga giocano in difesa anche a tavola.",
        done: (r) => { F.set("vp_amic", r.win ? 1 : 0); if (r.win) K.bond("fiducia", 1); QL = []; say("vp_capo", r.win ? "[serio] Avete vinto. Pazienza. Il Capitano ha il cuore di una diga: tiene finché non cede." : "[ride] Un punto per noi! Così la diga, almeno in campo, tiene."); setStep(N, 4); say("voce", "Ora Ermete: il verdetto."); done(); }
      }));
    }
    function verdict() {
      if (n6() < 4) { say("vp_ermete", "[serio] Con " + n6() + " voci in mano non decidi niente. Cerca ancora."); return done(); }
      const l = flush(), go = () => DS.verdict("piena", K.done, true, (id, solid) => fin(id, solid));
      if (l.length) K.say(l, go); else go();
    }

    const talk = {
      vp_ermete() {
        if (K.rel.scene("vp_ermete")) return;
        const s = S();
        if (s === 0) {
          say("vp_ermete", "[serio] Il Campione. Tilde mi ha detto che sarebbe venuto uno che gioca a pallone. Non pensavo si arrampicasse fino qui.");
          say("vp_ermete", "Ho una domanda. Una sola. Se un registro dice che il lago è normale, e il lago è sopra la porta di casa, chi dei due mente?");
          say("vp_ermete", "Non lo so ancora. Trovalo tu. In cabina, il registro e il pannello. Dall'ingegnere, la lettera. Da Zattera, la barca. Poi torna da me.");
          K.learnLore("l_registro"); setStep(N, 1);
          quest("vp_c2", "Il Registro delle Piene", "Raccogli le voci del dossier: registro, pannello, lettera, barca.");
          return done();
        }
        if (s === 1) {
          const ok = DS.has("piena", "p_reg") && DS.has("piena", "p_sen") && DS.has("piena", "p_lett") && DS.has("piena", "p_zat");
          if (!ok) { say("vp_ermete", `Hai ${n6()} voci su 6. Registro e pannello in cabina, la lettera dall'ingegnere, la barca da Zattera. Poi parliamo.`); return ask("Ermete tamburella sulla ringhiera.", [{ label: "🗂️ Apri il Dossier", sub: "Confronta due voci", fn: () => DS.open("piena", K.done, true) }, { label: "Torno al lavoro", fn: K.done }]); }
          say("vp_ermete", "[pensa] Quattro voci. Contraddizioni, se le hai viste, ormai lo sai. Ora ti dico una cosa che non dico mai.");
          say("vp_ermete", "Sotto di noi c'è una galleria. Dentro, c'è una crepa. L'ho misurata ogni mese. Non l'ho detto a nessuno perché nessuno mi chiedeva.");
          if (!F.is("vp_key")) { F.set("vp_key", true); K.inv.give("vp_chiave"); say("voce", "<b>Ricevi la Chiave della galleria.</b>"); }
          K.learnLore("l_galleria"); setStep(N, 2);
          quest("vp_c2b", "La galleria", "Porta in basso a sinistra sulla diga. Fotografa la crepa.");
          return done();
        }
        if (s === 2) { say("vp_ermete", "La galleria è la porta in basso a sinistra, sul prato sotto il coronamento. Prendi il righello, non la paura."); return done(); }
        if (s === 3) {
          say("vp_ermete", "[triste] L'hai vista. Sedici millimetri. Aveva otto, quando la prima volta ho chiesto aiuto.");
          say("vp_ermete", "Ecco il mio registro. Quello vero. La calligrafia è piccola perché avevo paura di essere letto. Ora leggilo.");
          got("p_erm", "Ermete ti consegna il quaderno. Le pagine sono state riaperte tante volte che il dorso è morbido.");
          ask("Ermete si siede sul gradino e guarda il lago.", [
            { label: "Subito il verdetto", sub: "Ci pensiamo ora", big: true, cls: "hot", fn: () => { setStep(N, 4); say("vp_ermete", "[serio] Va bene. Prima, però, i Veterani ti aspettano in piazza per una partita: il Capitano ha insistito, non so come."); done(); } },
            { label: "🗂️ Dossier", fn: () => DS.open("piena", K.done, true) }
          ]);
          return;
        }
        if (s === 4) {
          if (!F.is("vp_amic_done")) { say("vp_ermete", "Prima la partita, in piazza, con i Veterani. Poi tornerai, e decidiamo."); return done(); }
          say("vp_ermete", `Dossier ${n6()}/6. Contraddizioni: ${DS.found("piena")}/3.`);
          return ask("Ermete è pronto ad ascoltare.", [{ label: "⚖️ Decidi cosa fare", sub: "A chi dare il dossier", big: true, cls: "hot", fn: verdict }, { label: "🗂️ Dossier", sub: "Confronta due voci", fn: () => DS.open("piena", K.done, true) }, { label: "Non ancora", fn: K.done }]);
        }
        return PASS;
      },
      vp_valvola() {
        if (S() < 1) return PASS;
        if (S() === 1 && !DS.has("piena", "p_lett")) {
          say("vp_valvola", "[serio] Mi cerca per la lettera. Lo so. La lettera dice che le verifiche sono rinviate «per mancanza di fondi». L'ho scritta io. Sotto dettatura.");
          say("vp_valvola", "[triste] Lo so che non è una scusa. Ne ho scritte quattordici, di quelle lettere. Ho tenuto una copia di ognuna.");
          got("p_lett", "Valvola ti allunga il foglio, senza guardarti negli occhi."); K.rel.add("vp_valvola", 3, true);
          return done();
        }
        say("vp_valvola", "[serio] Se vuole che l'Ente agisca, mi dia qualcosa di inoppugnabile. Io, il modulo, ce l'ho."); done();
      },
      vp_zattera() {
        if (S() < 1) return PASS;
        if (S() === 1 && !DS.has("piena", "p_zat")) {
          say("vp_zattera", "[serio] La notte del 14. L'acqua è arrivata al terzo piolo del pontile. Io ho spostato la barca di tre metri, a mano, con la luna che faceva da lampione.");
          say("vp_zattera", "Se vuoi scriverlo, scrivilo come l'ho detto. Non aggiungere i miei gesti: ho smesso di essere un eroe a quarant'anni.");
          got("p_zat"); return done();
        }
        return PASS;
      },
      vp_gino() {
        if (S() < 1) return PASS;
        if (S() === 4 && !F.is("vp_amic_done")) {
          say("vp_gino", "[felice] La partita coi Veterani! Hanno insistito. Sono in difesa dalle tre. Hai la squadra pronta?");
          return ask("Gino fa il gesto del fischio.", [{ label: "Giochi l'amichevole", sub: "Il campo della piazza", big: true, cls: "hot", fn: () => { F.set("vp_amic_done", true); match(); } }, { label: "Più tardi", fn: K.done }]);
        }
        return PASS;
      },
      vp_capo() {
        say("vp_capo", S() < 4 ? "[serio] Sono il Capitano Bastia. Aspetto Gino e la sua squadra. Gioco in difesa anche a tavola." : "[serio] Quando vuoi. Il campo è quello che è: l'acqua è già dentro l'area."); done();
      },
      vp_lorenza() { return S() >= 1 && S() < 5 ? (say("vp_lorenza", "Se il dossier va in onda, avvertimi cinque minuti prima. Il microfono ha un carattere."), done()) : PASS; }
    };
    const zones = {
      vp_diga: {
        region: "diga", name: "Valpiana · La Diga", short: "Diga", sub: "Coronamento, scarichi e una cabina con la lucina rossa", bg: "dg_diga", time: "sera", w: 30, h: 22, base: "c", start: [1, 11],
        itemCos: "vp_c2", items: [[3, 9], [26, 9], [24, 16]],
        areas: [[1, 7, 28, 10, "Il coronamento"], [1, 11, 28, 21, "Il prato sotto la diga"], [11, 12, 17, 16, "La cabina di controllo"], [0, 0, 29, 21, "La diga di Valpiana"]],
        npcs: () => [].concat([{ id: "vp_ermete", at: [12, 9] }], S() >= 1 && S() < 5 ? [{ id: "vp_valvola", at: [22, 9] }] : []),
        doors: {
          "0,11": { to: "vp_riva", at: [28, 6] },
          "4,12": { to: "vp_galleria", at: [10, 12], locked: () => (K.inv.has("vp_chiave") ? false : "La porta della galleria è chiusa a chiave. Ermete, sul coronamento, ne ha una.") },
          "29,11": { to: "vp_cresta", at: [1, 5], locked: () => (F.is("vp_c3_done") ? false : "Il sentiero verso la cresta è sbarrato: «PERICOLO DI FRANA». Per ora.") }
        },
        flood: [[3, 0, 19, 29, 21], [4, 0, 17, 29, 21], [4, 22, 11, 28, 14]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 6, "~"); lay(0, 7, 29, 7, "F"); lay(0, 8, 29, 10, "c"); lay(0, 11, 29, 21, "g");
          put(0, 11, "q"); put(29, 11, "q"); put(4, 12, "q");
          house(11, 12, 7, 5, { door: [14, 16], roof: "#374151", enter: { to: "vp_sala", at: [11, 11] } });
          lay(2, 18, 27, 19, "m"); lay(5, 20, 24, 21, "u"); [[6, 9], [14, 9], [24, 9]].forEach(([x, y]) => put(x, y, "Q")); put(19, 12, "V"); put(8, 13, "P");
          lay(18, 13, 20, 13, "K"); [[2, 14], [26, 15], [28, 14], [27, 20]].forEach(([x, y]) => put(x, y, "T"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "DIGA DI VALPIANA", d.X(14) + 8, d.Y(7) - 6, "#38bdf8"); H.plaque(g, "CABINA DI CONTROLLO", d.X(14) + 8, d.Y(12) - 4, "#fbbf24"); H.plaque(g, "◂ RIVA", d.X(1) + 8, d.Y(10) + 6, "#94a3b8"); H.plaque(g, "GALLERIA", d.X(4) + 8, d.Y(12) - 4, "#a78bfa"); H.plaque(g, "CRESTA ▸", d.X(28) - 8, d.Y(10) + 6, "#f87171"); },
        intro: [["voce", "La diga. Da vicino non è un muro: è un cielo di cemento appeso al contrario."], ["voce", "Sul coronamento, un uomo con un casco giallo guarda l'acqua come altri guardano il fuoco."]]
      },
      vp_sala: {
        interior: true, region: "sala", name: "Valpiana · La Cabina di Controllo", short: "Cabina", sub: "Quadranti, un pannello con le etichette a mano e un registro su uno scaffale", bg: "dg_sala", w: 22, h: 13, start: [11, 11], outside: ["vp_diga", 14, 17],
        objects: {
          "10,3": () => {
            if (S() < 1) { say("voce", "Il pannello. Un cartello: «Solo personale autorizzato». Tu, per ora, sei solo personale."); return done(); }
            if (DS.has("piena", "p_sen")) { say("voce", "Il pannello. Il tasto «ACQUA FORSE» ha ancora il pollice di Ermete stampato sopra."); return done(); }
            say("voce", "Premi il tasto con l'etichetta «MEMORIA PICCHI». Il display si accende, perplesso: due notti sopra la soglia di guardia, il 12 e il 14.");
            got("p_sen"); done();
          },
          "19,3": () => {
            if (S() < 1) { say("voce", "Scaffali con raccoglitori: «PIENE 1962-1989», «PIENE 1990-2010», «PIENE (VARIE)»."); return done(); }
            if (DS.has("piena", "p_reg")) { say("voce", "Gli scaffali. «PIENE (VARIE)» è il più consumato."); return done(); }
            say("voce", "In «PIENE (VARIE)», un quaderno a righe. Sette notti, sette volte la stessa riga: «livello nella norma». Stessa penna, stessa calligrafia, stessa ora. Il lago, quelle sere, non era una persona normale.");
            got("p_reg"); done();
          }
        },
        build(L) {
          const { lay, put } = L;
          H.room(L, 22, 13, "o", 11); lay(3, 2, 8, 2, "Z"); lay(13, 2, 18, 2, "Z"); put(10, 3, "J"); lay(19, 3, 20, 3, "Y"); lay(2, 6, 3, 6, "K"); put(15, 8, "P"); [[6, 8], [7, 8], [16, 6]].forEach(([x, y]) => put(x, y, "s"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "CABINA DI CONTROLLO", d.X(11) + 8, d.Y(1) + 6, "#fbbf24"); H.plaque(g, "PANNELLO", d.X(10) + 8, d.Y(4) + 4, "#38bdf8"); H.plaque(g, "ARCHIVIO", d.X(19) + 8, d.Y(4) + 4, "#a78bfa"); }
      },
      vp_galleria: {
        interior: true, region: "galleria", name: "Valpiana · La Galleria", short: "Galleria", sub: "Un corridoio dentro la diga: le pareti sudano e c'è una crepa con un righello", bg: "dg_sala", w: 20, h: 14, start: [10, 12], outside: ["vp_diga", 4, 13],
        act: { Z: "Misura la crepa" },
        objects: {
          "10,3": () => {
            if (S() < 2) { say("voce", "Una parete che suda. A mezz'aria, un righello di plastica appeso a un chiodo."); return done(); }
            if (DS.has("piena", "p_foto")) { say("voce", "La crepa, sempre lì. Il righello, sempre lì. L'acqua, sempre di più."); return done(); }
            say("voce", "Un righello è appeso a un chiodo. La crepa sale dal pavimento al soffitto, fine come un capello. Sedici millimetri.");
            say("voce", "Scatti una foto. Dietro di te, il corridoio fa un rumore basso: sembra una voce che si schiarisce.");
            got("p_foto");
            if (!F.is("vp_alarm")) { F.set("vp_alarm", true); setStep(N, 3); quest("vp_c2c", "Il registro di Ermete", "Torna da Ermete, sul coronamento."); say("voce", "Un allarme parte, lontano. Dalla porta, la voce di Gino: «SACCHI! NELLA GALLERIA, ORA!»"); const l = flush(); return K.say(l, () => K.argine([2], (r) => { if (r.win) { K.bond("argine", 1); K.rel.add("vp_gino", 3, true); say("voce", "L'allarme era un falso allarme. L'acqua, no. Argine +1."); } else say("voce", "Il corridoio si è riempito un po'. Ma il peggio è passato. Ermete ti aspetta."); done(); })); }
            done();
          }
        },
        build(L) {
          const { lay, put } = L;
          H.room(L, 20, 14, "i", 10); lay(2, 5, 17, 9, "m"); lay(9, 4, 10, 12, "i"); lay(9, 2, 11, 2, "h"); put(10, 3, "Z"); lay(3, 2, 6, 2, "Y"); lay(14, 2, 17, 2, "Y"); put(2, 4, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "GALLERIA DI ISPEZIONE", d.X(10) + 8, d.Y(1) + 6, "#a78bfa"); H.plaque(g, "FESSURA", d.X(10) + 8, d.Y(4) + 4, "#f87171"); }
      }
    };
    return {
      n: N, title: "Il Registro delle Piene", sub: "Il livello del lago, di notte, non era quello scritto",
      goal: goalFn, start: "vp_diga", introBg: "dg_diga", zones, talk, obj: {},
      patch: { vp_municipio: { npcs: (s, l) => l.filter((n) => n.id !== "vp_valvola") }, vp_riva: { npcs: (s, l) => l } },
      intro: [["voce", "La mattina dopo, l'acqua ha un metro in più di fiducia in sé stessa."], ["voce", "Sali alla diga: un sentiero, trecento gradini e un custode che non sorride mai."]]
    };
  }
  boot();
})();
