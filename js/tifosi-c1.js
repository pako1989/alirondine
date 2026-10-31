// js/tifosi-c1.js - «LA NOTTE DEI TIFOSI MORTI» · Capitolo 1: Il Novantesimo
// Novantesimo più tre, uno a uno. Un fumogeno verde nella curva ospite, e gli ultras del Valtorta si rialzano cantando. Nadia, la preparatrice, ti trascina
// via dal centrocampo; negli spogliatoi Pippo tiene sbarrata la porta delle docce (dentro c'è Tonino, e non solo), nel magazzino Gaspare ha i palloni.
// Poi si torna in campo per la prima notte dell'Assedio. Zone: lo stadio di notte (34x24: campo, tribune, curve, panchine, fari), spogliatoi (16x10), magazzino (12x9).
// Espone window.__tifosiZ.stadio, riusato dai capitoli successivi.
(function () {
  "use strict";
  // la folla di zombie disegnata sugli spalti (non sono PNG: ondeggiano e cantano)
  function crowd(g, d, f, x0, y0, x1, y1, seed, cols) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const k = (x * 31 + y * 17 + seed) % 97; if (k % 3 === 0) continue;
      const px = d.X(x) + 4 + (k % 8), py = d.Y(y) + 4 + Math.sin(f / 10 + k) * 1.2;
      g.fillStyle = (cols || ["#6d28d9", "#facc15", "#7c3aed"])[k % 3]; g.fillRect(px - 2, py, 5, 5); g.fillStyle = "#86a36b"; g.beginPath(); g.arc(px + 0.5, py - 1, 2, 0, 7); g.fill();
      if (k % 23 === 0) { g.fillStyle = "rgba(233,213,255,.8)"; g.font = "6px serif"; g.fillText("♪", px + 3, py - 4 - ((f / 3 + k) % 8)); }
    }
  }
  window.__tifosiZ = {
    crowd,
    stadio(H, npcs, o) {
      o = o || {};
      return {
        region: o.region || "stadio", name: "Stadio Comunale di Borgo Marino", short: "Lo stadio", sub: "Il campo, le tribune, due curve e una nebbia verde", bg: o.bg || "zt_stadio", time: o.time || "notte", w: 34, h: 24, base: "Q", start: o.start || [16, 13], travel: [16, 13],
        itemCos: o.itemCos, items: o.items || [], loot: o.loot || {},
        areas: [[3, 6, 30, 19, "Il campo"], [0, 0, 33, 4, "La tribuna centrale"], [0, 21, 33, 23, "I distinti"], [0, 5, 2, 19, "La curva ospite"], [31, 5, 33, 19, "La curva di casa"], [15, 20, 18, 23, "Il tunnel degli spogliatoi"], [0, 0, 33, 23, "Lo stadio"]],
        act: Object.assign({ q: "Entra", n: "Leggi il tabellone", s: "Riprendi fiato", z: "Guarda le borse", u: "Guarda il carrello", b: "Siediti in panchina" }, o.act || {}),
        flavor: Object.assign({
          n: "Il tabellone luminoso: BORGO 1 - 1 VALTORTA · 90'+3. Il cronometro si è fermato. Ha più buon senso di tutti.",
          z: "Le borse della squadra ospite, abbandonate a bordo campo. Dentro: parastinchi, un panino morsicato, un rosario.",
          u: "Il carrello dei palloni, rovesciato. Tre palloni rotolano ancora verso la porta, piano, come se avessero un appuntamento.",
          b: "La panchina. Da qui il Mister ha visto quaranta pareggi. Stasera ha visto anche il resto."
        }, o.flavor || {}),
        doors: Object.assign({ "16,23": { to: "zt_spogliatoi", at: [8, 1] }, "17,23": { to: "zt_spogliatoi", at: [8, 1] }, "6,23": { to: "zt_magazzino", at: [6, 1] } }, o.doors || {}),
        npcs, intro: o.intro, onEnter: o.onEnter,
        build(L) {
          const { lay, put } = L;
          // tribuna in alto, distinti in basso, curve ai lati
          lay(0, 0, 33, 3, "P"); lay(16, 0, 17, 3, "Y"); lay(0, 4, 33, 4, "Y"); lay(0, 20, 33, 20, "Y"); lay(0, 21, 33, 23, "P"); lay(15, 21, 18, 23, "Y");
          lay(0, 5, 1, 19, "P"); lay(32, 5, 33, 19, "P"); lay(2, 5, 2, 19, "F"); lay(31, 5, 31, 19, "F"); put(2, 12, "Y"); put(31, 12, "Y");
          // cartelloni a bordo campo, con i varchi
          lay(3, 5, 30, 5, "J"); lay(15, 5, 18, 5, "Y"); lay(3, 20, 30, 20, "J"); lay(14, 20, 19, 20, "Y"); lay(5, 20, 7, 20, "Y");
          // le porte
          lay(3, 11, 3, 13, "X"); lay(30, 11, 30, 13, "X");
          // fari, panchine, tabellone, oggetti a bordo campo
          put(2, 4, "I"); put(31, 4, "I"); put(2, 20, "I"); put(31, 20, "I");
          put(10, 19, "E"); put(11, 19, "E"); put(22, 19, "E"); put(23, 19, "E"); put(9, 19, "b"); put(24, 19, "b");
          put(16, 4, "n"); put(26, 18, "z"); put(7, 18, "u"); put(28, 6, "s");
          put(16, 23, "q"); put(17, 23, "q"); put(6, 23, "q"); lay(6, 21, 6, 22, "Y");
          (o.extra || []).forEach(([x, y, c]) => put(x, y, c));
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow();
          crowd(g, d, f, 0, 0, 33, 3, 3); crowd(g, d, f, 0, 5, 1, 19, 7); crowd(g, d, f, 0, 21, 33, 23, 11, ["#6d28d9", "#1f5fbf", "#facc15"]);
          // linee del campo
          g.save(); g.strokeStyle = "rgba(240,253,244,.55)"; g.lineWidth = 1; g.strokeRect(d.X(3) + 8, d.Y(6), d.X(30) - d.X(3), d.Y(20) - d.Y(6)); g.beginPath(); g.moveTo(d.X(17), d.Y(6)); g.lineTo(d.X(17), d.Y(20)); g.stroke(); g.beginPath(); g.arc(d.X(17), d.Y(13), 30, 0, 7); g.stroke();
          g.strokeRect(d.X(4), d.Y(9), 48, d.Y(17) - d.Y(9) + 0); g.strokeRect(d.X(27), d.Y(9), 48, d.Y(17) - d.Y(9)); g.restore();
          H.fog(g, d, f, 34, 24);
          H.plaque(g, "◂ CURVA OSPITE", d.X(1) + 8, d.Y(5) - 2, "#c084fc"); H.plaque(g, "CURVA DI CASA ▸", d.X(32), d.Y(5) - 2, "#93c5fd"); H.plaque(g, "SPOGLIATOI ▾", d.X(17), d.Y(21) - 2, "#bef264"); H.plaque(g, "MAGAZZINO", d.X(6) + 8, d.Y(21) - 2, "#fde68a"); H.plaque(g, "TRIBUNA ▴", d.X(17), d.Y(4) + 4, "#bef264");
          if (o.decor) o.decor(g, cx, cy, d, f);
        }
      };
    }
  };

  function boot() {
    const E = window.__tifosiCore;
    if (!E || !E.api || !E.api.addChapter || !window.__tifosiH || !window.__assedio) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__tifosiH(K), Z = window.__tifosiZ, { say, done, wask, ask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("zt_c1", { kind: "acc", label: "Sciarpa del Borgo (sbrindellata)", val: "sciarpa", from: "Capitolo 1 di La Notte dei Tifosi Morti" });
    K.lore("l_zt_stadio", { t: "Lo Stadio Comunale", d: "Quattromila posti, due curve, una tribuna con la copertura che perde. Costruito nel 1961, rifatto nel 1998 per la promozione. Le uscite si chiudono da fuori: era una regola per gli ultras." });
    K.lore("l_zt_fumo", { t: "Il fumogeno verde", d: "Al novantesimo più tre, dalla curva ospite, un fumogeno di un verde mai visto. Chi l'ha respirato si è rialzato con la pelle grigia, gli occhi gialli e la voglia di cantare. Chi non l'ha respirato, scappa." });
    K.lore("l_zt_valtorta", { t: "Sporting Valtorta", d: "La squadra del paese di là dal fiume. Rivali da settant'anni: due derby all'anno, una rissa ogni tre. I colori sono il viola e il giallo, i tifosi i più rumorosi della provincia." });

    const goal = (s) => ({
      0: "Al centro del campo qualcuno ti chiama per nome. È Nadia, la preparatrice, con una borraccia in mano.",
      1: "Scendi negli spogliatoi: dal tunnel in fondo al campo si sentono colpi contro una porta.",
      2: "Servono palloni, tanti. Il magazzino di Gaspare è in basso a sinistra, sotto i distinti.",
      3: "Torna in campo da Nadia: è ora di respingerli. Prima, se vuoi, sistema il Gruppo dal Taccuino.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      setStep(N, 4); F.set("zt_c1_done", true);
      const m = K.reward("zt_c1", { coins: 90, cos: "zt_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Il campo è vostro. Per adesso. Sugli spalti, ventimila voci senza fiato cantano un coro che nessuno ha mai sentito."],
        ["voce", "Poi, dagli altoparlanti, una voce di donna, rotta dalle interferenze: «…Qui Telegolfo, tribuna stampa. C'è qualcuno vivo? Rispondete. Per favore, rispondete.»"],
        ["zt_gaspare", "[pensa] La tribuna stampa. Sopra la tribuna centrale. Ci si arriva dalla scala in mezzo. Se è ancora intera."],
        ["voce", `<b>FINE DEL CAPITOLO 1 · «Il Novantesimo»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 2 ti aspetta: la tribuna, la sala stampa, il bar dello stadio e un palco VIP chiuso a chiave."]
      ]), () => K.openMain(), "zt_stadio");
    }
    function notte() {
      say("zt_nadia", "[serio] Ascoltami. Corri, non fermarti mai. Calcia a chi ti si avvicina. Raccogli quello che lasciano cadere: Gaspare dice che sono gettoni del bar, e il bar qui è sacro.");
      H.run({ title: "Il Novantesimo", arena: "campo", time: 110, mix: ["tifoso", "corridore", "panzone", "tamburino"], boss: "tamburo" }, (r) => {
        F.set("zt_n1", true);
        say("voce", `Il Gran Tamburo della curva ospite rotola sul prato e resta lì, a pancia in su, a battere il tempo con un piede. Respinti: <b>${r.a || 0}</b>.`);
        say("zt_pippo", "[ride] Ma tu l'hai visto? Gli ho fatto il fallo tattico! A uno zombie! Diciotto anni di carriera, e il fallo migliore lo faccio stanotte.");
        K.say(H.flush(), () => H.bivio(() => fin()));
      });
    }

    const talk = {
      zt_nadia() {
        if (K.rel.scene("zt_nadia")) return;
        const s = S();
        if (s === 0) {
          say("zt_nadia", "[arrabbiato] Campione! Sveglia! Non stare lì impalato col pallone in mano, la partita è finita. Cioè, è finita in un altro modo.");
          say("zt_nadia", "Il fumo verde è sceso dalla curva ospite. Quelli che l'hanno respirato si sono rialzati. Cantano. Mordono. Il Mister è andato a protestare con l'arbitro e…");
          say("zt_nadia", "[pensa] …e adesso il Mister è dall'altra parte. Guardalo, laggiù vicino alla panchina. Dà ancora indicazioni.");
          K.learnLore("l_zt_fumo");
          return wask("Nadia ti stringe un braccio. Sulla curva ospite, ventimila sciarpe viola ondeggiano a tempo.", [
            { label: "🤝 «Prima troviamo gli altri. Nessuno resta indietro.»", big: true, w: { squadra: 1 }, fn: () => { F.set("zt_nadia_squadra", true); say("zt_nadia", "[sorpreso] Parli come il Mister quando era vivo. Cioè, quando era normale. Va bene: Pippo e Tonino sono negli spogliatoi."); avanti(); } },
            { label: "🏃 «Prima ci mettiamo al sicuro. Poi pensiamo agli altri.»", big: true, w: { pelle: 1 }, fn: () => { F.set("zt_nadia_pelle", true); say("zt_nadia", "[serio] Giusto. Il posto più sicuro dello stadio sono gli spogliatoi: porte di ferro e una sola entrata. Pippo e Tonino sono già lì."); avanti(); } }
          ]);
        }
        if (s === 3 && F.is("zt_n1")) { say("zt_nadia", "[serio] Il campo è nostro, per ora. Prima di salire, pensa a cosa hai imparato stanotte."); return K.say(H.flush(), () => H.bivio(() => fin())); }
        if (s === 3) {
          say("zt_nadia", "[serio] I palloni ci sono. Il Gruppo pure. Il campo è pieno di loro e il tunnel non regge ancora per molto. Adesso o mai.");
          return ask("Nadia passa una borraccia a ciascuno. «Chi non beve non corre.»", [
            { label: "🧟 Si comincia · L'Assedio", sub: "Prima notte: il campo", big: true, fn: notte },
            { label: "🧍 Prima sistemo il Gruppo", sub: "Dal Taccuino: chi corre con te", fn: () => K.crew.pick(() => K.done(), true) },
            { label: "◂ Un momento", fn: done }
          ]);
        }
        say("zt_nadia", s <= 2 ? "[arrabbiato] Muoviti! Io tengo d'occhio il campo. Se il Mister si avvicina, gli tiro la borraccia. Piena." : "Respira. Bevi. Corri. In quest'ordine."); done();
        function avanti() { H.join("zt_nadia", "Nadia ti segue con la borsa delle borracce a tracolla."); setStep(N, 1); quest("zt_c1", "Il Novantesimo", "Scendi negli spogliatoi dal tunnel: Pippo e Tonino sono lì."); done(); }
      },
      zt_mister() {
        if (K.rel.scene("zt_mister")) return;
        if (!F.is("zt_mister_visto")) { F.set("zt_mister_visto", true); say("voce", "Il Mister Sbarra è a bordo campo, grigio in faccia, gli occhi gialli. Agita le braccia verso i tifosi zombie come faceva coi suoi giocatori."); }
        say("zt_mister", ["[arrabbiato] Grrrraaa… PRESSING… alto… grrr…", "Grrr… stringere… le… LINEE…", "…diagonale… DIAGONALE… grrraaa!", "(Ti guarda. Ti indica. Fa il gesto della sostituzione. Poi torna a guardare la curva.)"][Math.floor(Math.random() * 4)]);
        say("voce", "Non ti morde. Forse anche da zombie un allenatore non tocca i suoi giocatori."); done();
      },
      zt_pippo() {
        if (K.rel.scene("zt_pippo")) return;
        const s = S();
        if (s === 1) {
          say("zt_pippo", "[arrabbiato] Campione! Dammi una mano, spingi! Dietro questa porta ci sono le docce. Nelle docce c'è Tonino. E con Tonino ci sono due di loro.");
          say("voce", "Da dietro la porta: «PIPPO! Mi stanno sporcando i capelli! PIPPO!» E un coro, sotto, a bocca chiusa.");
          say("zt_pippo", "[serio] Se apro, entrano. Se non apro, Tonino resta dentro. Ho fatto il difensore diciotto anni: so chiudere una porta, non so cosa fare dopo.");
          return wask("La porta delle docce trema. Pippo ci si appoggia con tutta la schiena.", [
            { label: "🤝 «Apri al tre. Io calcio, tu lo tiri fuori.»", big: true, w: { squadra: 2 }, fn: () => { F.set("zt_docce_aperte", true); say("voce", "Uno, due, tre. La porta si spalanca: due zombie in accappatoio viola. Due calci, due tonfi. Pippo infila un braccio nel vapore e tira fuori Tonino per il colletto."); say("zt_tonino", "[arrabbiato] Il gel! Mi hanno rovinato il gel! Ventisei gol, e finisco in una doccia con due del Valtorta!"); unisci(); } },
            { label: "🏃 «Lo facciamo uscire dalla finestrella del retro.»", big: true, w: { pelle: 2 }, fn: () => { F.set("zt_docce_finestra", true); say("voce", "Esci dal retro, rompi il vetro della finestrella delle docce con un tiro secco. Tonino si infila fuori a testa avanti, incastrandosi all'altezza delle spalle. Ne esce con un gemito e un ciuffo in meno."); say("zt_tonino", "[arrabbiato] Una finestrella! Io! Che ho fatto la copertina del giornale del paese!"); unisci(); } }
          ]);
        }
        say("zt_pippo", s === 0 ? "[serio] (Pippo è chiuso negli spogliatoi. Lo senti gridare da qui.)" : s === 2 ? "[pensa] Palloni. Gaspare ne ha un magazzino pieno. Se c'è uno che sa dove sono le cose, in questo stadio, è lui." : "Era la mia ultima partita. Lo sapevi? Avevo preparato un discorso. Mi sa che lo tengo per un'altra volta."); done();
        function unisci() {
          H.join("zt_pippo", "Pippo stringe la fascia da capitano sul braccio."); H.join("zt_tonino", "Tonino si pettina con le dita e ti segue.");
          say("zt_pippo", "[serio] Ce ne vogliono tanti, di palloni, per tenerli lontani. Il magazzino di Gaspare è sotto i distinti, a sinistra del tunnel.");
          setStep(N, 2); quest("zt_c1b", "Palloni, tanti", "Il magazzino di Gaspare, sotto i distinti a sinistra del tunnel."); done();
        }
      },
      zt_tonino() {
        if (K.rel.scene("zt_tonino")) return;
        say("zt_tonino", ["[furbo] Lo sai che il gel tenuta dieci resiste anche all'acqua santa? L'ho provato a una comunione.", "Se ne prendo dieci di fila, sono record stagionale. Anche se sono zombie. Valgono, no?", "[serio] Mia madre è in tribuna. Era in tribuna. Non ci voglio pensare. Calcio e basta."][Math.floor(Math.random() * 3)]); done();
      },
      zt_cesaroni() {
        if (K.rel.scene("zt_cesaroni")) return;
        if (!F.is("zt_fischietto_preso")) {
          say("zt_cesaroni", "[sorpreso] Un giocatore! Vivo! Mi sono chiuso qui dentro al primo morso. Sai cosa mi ha detto il Mister prima di cambiare? «Arbitro, era rigore». Era rigore, in effetti.");
          say("zt_cesaroni", "[serio] Tieni il mio fischietto. Ho notato una cosa: quando fischio, loro si fermano. Si girano. Protestano. Anche da morti, un tifoso protesta.");
          F.set("zt_fischietto_preso", true); K.inv.give("zt_fischietto"); K.perks.give("fischietto");
          say("voce", "Ricevi il <b>Fischietto dell'arbitro</b> (🎒 Zaino). Nell'Assedio parti già col Fischietto: ogni tanto stordisce chi ti è vicino.");
          say("zt_cesaroni", "Io resto qui. Ho un regolamento da rileggere. Non c'è niente, sugli zombie. Ho controllato due volte."); return done();
        }
        say("zt_cesaroni", "Regola 12: falli e scorrettezze. Non dice niente sul mordere. Faccio un esposto, appena finisce."); done();
      },
      zt_gaspare() {
        if (K.rel.scene("zt_gaspare")) return;
        const s = S();
        if (s === 2) {
          say("zt_gaspare", "[arrabbiato] Chi è? Fuori! Ho una scopa e trent'anni di rancore! …Ah, sei tu. Il Campione. Entra, e chiudi.");
          say("zt_gaspare", "Palloni? Ne ho trecentododici. Trecentoundici, uno l'ha bucato Tonino a settembre e l'ha negato davanti a un sacerdote.");
          say("zt_gaspare", "[pensa] Ma sentimi bene: le uscite dello stadio si chiudono da fuori. Era la regola per gli ultras. Il custode è scappato con le chiavi. Siamo chiusi dentro, con loro, fino a domattina.");
          return wask("Gaspare carica un sacco di palloni su un carrello cigolante. «Ne vuoi quanti?»", [
            { label: "🤝 «Tutti. E vieni con noi.»", w: { squadra: 1 }, fn: () => { say("zt_gaspare", "[ride] Con voi? Alla mia età? …Va bene. Ma la scopa viene con me. È più vecchia di Tonino e para meglio."); entra(); } },
            { label: "🏃 «Quanti ne servono per arrivare all'alba.»", w: { pelle: 1 }, fn: () => { say("zt_gaspare", "[serio] Risposta da portiere. Allora tutti. E vengo anch'io, così li conto: un pallone perso è un pallone perso, anche alla fine del mondo."); entra(); } }
          ]);
        }
        say("zt_gaspare", s < 2 ? "Fuori dal mio magazzino. Chiunque tu sia, qui si entra solo con le scarpe pulite." : "[pensa] Trecentododici palloni. Se li calci tutti bene, arriviamo all'alba. Se li calci male, li raccolgo io. Come sempre."); done();
        function entra() {
          H.join("zt_gaspare", "Gaspare spinge il carrello dei palloni con la scopa sotto il braccio.");
          K.learnLore("l_zt_stadio");
          say("voce", "Il Gruppo corre con te nell'Assedio, tre alla volta. Dal Taccuino, «Schiera la compagnia», scegli chi.");
          setStep(N, 3); quest("zt_c1c", "Il campo", "Torna in campo da Nadia: è ora di respingerli."); done();
        }
      }
    };

    const zones = {
      zt_stadio: Z.stadio(H, (s) => {
        const L = [];
        if (s === 0 || s === 3) L.push({ id: "zt_nadia", at: [16, 12] });
        if (s <= 3) L.push({ id: "zt_mister", at: [12, 18] });
        return L;
      }, {
        items: [[6, 8], [27, 15], [20, 7], [12, 16]], itemCos: "zt_c1",
        loot: { "8,8": { id: "zt_bossolo", text: "Un bossolo di fumogeno, ancora tiepido. Sulla latta c'è una sigla: «B.P. · VigorVerde · lotto 7».", empty: "Il bossolo l'hai già preso. Resta solo l'odore." }, "25,16": { id: "zt_bossolo", text: "Un altro bossolo verde, schiacciato dai tacchetti. Stessa sigla, stesso lotto.", empty: "Qui c'era un bossolo. Adesso c'è un'impronta di tacchetto." } },
        extra: [[8, 8, "V"], [25, 16, "V"]],
        intro: [["voce", "Lo stadio di notte. I fari sono accesi, il tabellone si è fermato a 90'+3, uno a uno. Sugli spalti nessuno è seduto."], ["voce", "Dal tunnel degli spogliatoi, in fondo, arrivano colpi contro una porta. E un coro, a bocca chiusa."]]
      }),
      zt_spogliatoi: {
        interior: true, region: "interno", name: "Gli spogliatoi del Borgo Marino", short: "Spogliatoi", sub: "Armadietti, una lavagna, e la porta delle docce che trema", bg: "zt_spogliatoi", w: 16, h: 10, start: [8, 1], outside: ["zt_stadio", 16, 21], base: "U",
        act: { A: "Guarda gli armadietti", n: "Leggi la lavagna", b: "Siediti sulla panca", G: "Guarda la porta delle docce", z: "Guarda le borse", x: "Apri la cassa", l: "Guarda la lampada" },
        flavor: { A: "Gli armadietti. Su quello di Pippo, un foglio: «ULTIMA PARTITA. NON PIANGERE NELLO SPOGLIATOIO». Sotto, a penna: «ok, un po'».", n: "La lavagna del Mister: «PRESSING ALTO · NON CONCEDERE IL CROSS · VINCIAMO PER GASPARE». Gaspare non lo sa.", b: "La panca. Qui, prima della partita, Tonino ha fatto il discorso. Parlava del suo gel.", G: "La porta delle docce, sbarrata con una panca e una scopa. Trema a intervalli regolari, come una lavatrice.", z: "Le borse dei giocatori. In una c'è una lettera d'amore mai spedita. Non la leggi. Quasi.", l: "Una lampada al neon che sfarfalla. In questo stadio fa paura anche quella." },
        loot: { "13,8": { id: "zt_gel", text: "Nell'armadietto numero 9 trovi un barattolo di gel «tenuta 10», nascosto sotto le parastinchi.", empty: "L'armadietto di Tonino. Odora ancora di gel." } },
        npcs: (s) => { const L = [{ id: "zt_cesaroni", at: [13, 3] }]; if (s === 1) L.push({ id: "zt_pippo", at: [3, 7] }); return L; },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 9, "U"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 9, "a"); lay(15, 0, 15, 9, "a"); lay(0, 9, 15, 9, "a"); put(8, 0, "v");
          lay(1, 1, 6, 1, "A"); lay(10, 1, 11, 1, "A"); lay(3, 4, 7, 4, "b"); put(1, 8, "G"); put(1, 7, "a"); put(6, 8, "z");
          // lo stanzino dell'arbitro, a destra, con la porticina
          lay(11, 2, 11, 6, "a"); put(11, 4, "U"); put(14, 1, "n"); put(12, 6, "x"); put(14, 6, "l");
          lay(5, 7, 9, 7, "b"); put(13, 8, "A"); put(14, 8, "A");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); if (K.stepOf(1) === 1) { g.fillStyle = "rgba(226,232,240,.25)"; for (let i = 0; i < 4; i++) { const t = (f + i * 20) % 80; g.beginPath(); g.arc(d.X(1) + 8 + Math.sin(t / 10 + i) * 4, d.Y(8) - t * 0.3, 3 + t / 20, 0, 7); g.fill(); } } H.plaque(g, "BORGO MARINO", d.X(8), d.Y(0) + 6, "#93c5fd"); H.plaque(g, "ARBITRO", d.X(13), d.Y(2) - 2, "#facc15"); H.plaque(g, "DOCCE", d.X(1) + 8, d.Y(7) - 2, "#bef264"); }
      },
      zt_magazzino: {
        interior: true, region: "interno", name: "Il magazzino di Gaspare", short: "Magazzino", sub: "Trecentododici palloni, reti, coni e trent'anni di polvere", bg: "zt_magazzino", w: 12, h: 9, start: [6, 1], outside: ["zt_stadio", 6, 21], base: "Y",
        act: { z: "Guarda gli scaffali", u: "Guarda il carrello", M: "Guarda la moka", n: "Leggi il registro", l: "Guarda la lampadina", b: "Siediti" },
        flavor: { z: "Scaffali di palloni, coni, casacche. Ogni scatola ha un'etichetta scritta a mano: «Coppa Italia '98, non toccare».", u: "Il carrello dei palloni. Ha una ruota che gira per conto suo, come Tonino.", n: "Il registro del magazzino: trent'anni di righe in stampatello. L'ultima, di stasera: «palloni partita: 3. reti: integre. tifosi: da rivedere».", l: "Una lampadina appesa a un filo. Ondeggia anche quando non c'è vento.", b: "La sedia di Gaspare, consumata nella forma esatta di Gaspare." },
        loot: { "10,7": { id: "zt_caffe", text: "Sul fornelletto da campeggio di Gaspare c'è una moka ancora calda. Ti versi un bicchierino.", empty: "La moka è vuota. Gaspare ti guarda come se gli avessi rubato la pensione." } },
        npcs: () => [{ id: "zt_gaspare", at: [3, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 11, 8, "Y"); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 8, "a"); lay(11, 0, 11, 8, "a"); lay(0, 8, 11, 8, "a"); put(6, 0, "v");
          lay(1, 2, 4, 2, "z"); lay(8, 2, 10, 2, "z"); lay(1, 7, 3, 7, "z"); put(7, 5, "u"); put(10, 6, "n"); put(10, 7, "M"); put(5, 4, "l"); put(2, 5, "b");
        },
        decor(g, cx, cy, d) { H.plaque(g, "MAGAZZINO · VIETATO L'INGRESSO", d.X(6), d.Y(0) + 6, "#fde68a"); }
      }
    };
    return {
      n: N, title: "Il Novantesimo", sub: "Uno a uno, novantesimo più tre, e un fumogeno di un verde mai visto",
      goal, start: "zt_stadio", introBg: "zt_novantesimo", zones, talk, obj: {},
      intro: [["voce", "Ultima giornata di campionato. Borgo Marino contro Sporting Valtorta. Uno a uno, novantesimo più tre. Hai il pallone tra i piedi e la porta davanti."], ["voce", "Poi, dalla curva ospite, si alza un fumogeno. Verde. Un verde che non hai mai visto. La nebbia scende sulle gradinate come una coperta."], ["voce", "Quando si dirada, i tifosi del Valtorta sono ancora in piedi. Cantano ancora. Ma hanno la pelle grigia, e cominciano a scavalcare."]]
    };
  }
  boot();
})();
