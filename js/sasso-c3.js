// js/sasso-c3.js - «SETTE PER SASSO NERO» · Capitolo 3: Palizzate
// Ventotto giorni al raccolto. Si taglia il bambù nel bosco a ovest (ogni taglio consuma una fascia del giorno), si costruisce sui cantieri delle quattro porte
// (Le Costruzioni). Poi Shinobu parla del mulino: nella soffitta di Manzo c'è il segreto del villaggio. E la prima notte arrivano gli esploratori di Corvo Rosso:
// si assegnano le porte (Il Piano) e si gioca la prima «Ultima Notte», corta. Un esploratore si arrende: cosa ne fai?
// Zone: villaggio (con la Porta Ovest verso il bosco e il mulino aperto), il bosco di bambù (30x22), la soffitta del mulino (12x9).
(function () {
  "use strict";
  function boot() {
    const E = window.__sassoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__sassoH || !window.__sassoZ || !E.api._has(2)) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  // i ciuffi di bambù da tagliare nel bosco (ogni taglio: 2 legno e una fascia del giorno)
  const CUT = [[3, 7], [6, 7], [9, 7], [4, 14], [8, 15], [11, 13], [18, 4], [22, 6], [25, 4], [19, 15], [23, 17], [26, 14]];
  const NEED = 4;
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__sassoH(K), Z = window.__sassoZ, { say, done, wask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("sn_c3", { kind: "acc", label: "Fascia da ronin", val: "fascia", from: "Capitolo 3 di Sette per Sasso Nero" });
    K.lore("l_soffitta", { t: "La soffitta del mulino", d: "Sotto la paglia, armature e spade di samurai. Non comprate, non trovate. Prese a chi scappava ferito dalle battaglie, attraverso le risaie, e chiedeva acqua." });
    K.lore("l_campo", { t: "Il campo di Corvo Rosso", d: "Oltre il passo, nella gola del fiume: quaranta uomini, cavalli, un recinto per il bottino. E un recinto più piccolo, per le persone prese ai villaggi." });

    const built = () => (K.build ? K.build.list().length : 0);
    const goal = (s) => ({
      0: "Al villaggio: Kanbei ha disegnato le difese per terra, davanti al granaio.",
      1: `Taglia il bambù nel bosco (Porta Ovest) e costruisci sui cantieri 🔨 vicino alle porte: ${built()}/${NEED} difese · 🪵 Legno ${K.stat("legno")}. Poi parla con Kanbei.`,
      2: F.is("sn_soff_pista") ? "Il mulino di Manzo: sali in soffitta e guarda sotto la paglia." : "Shinobu, la figlia del mugnaio, ti cerca. Ha qualcosa da dire.",
      3: "Cala la sera. Kanbei aspetta davanti al granaio: si decide chi difende quale porta.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    // il tempo passa: tre fasce di lavoro al giorno, poi si dorme e torna l'alba
    function tick() {
      const d = K.clock.day(), s = K.clock.slot();
      if (s >= 2) { K.clock.set(d + 1, 0); say("voce", `Si fa buio. Le fiaccole, la cena di riso e miglio, il sonno senza sogni. <b>Alba del giorno ${d + 1}.</b>`); }
      else K.clock.set(d, s + 1);
    }
    function cut(tx, ty) {
      if (S() < 1) { say("voce", "Bambù fitto. Col vento fa il rumore di mille flauti stonati."); return done(); }
      const k = `sn_cut3_${tx}_${ty}`; if (F.is(k)) return done();
      F.set(k, true); K.bond("legno", 2); K.setTiles(tx, ty, tx, ty, "Q");
      const left = CUT.filter(([x, y]) => !F.is(`sn_cut3_${x}_${y}`)).length;
      say("voce", `Tagli il ciuffo di bambù in diagonale, come ti ha insegnato Kiku, e lo leghi in fascina. <b>+2 🪵 Legno</b> (${K.stat("legno")}). ${left ? `Ciuffi buoni rimasti: ${left}.` : "Nel bosco non c'è più bambù adatto."}`);
      tick(); done();
    }

    function fin(vivo) {
      setStep(N, 4); F.set("sn_c3_done", true);
      const m = K.reward("sn_c3", { coins: 120, cos: "sn_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["sn_kanbei", vivo ? "[pensa] Un nemico vivo è una bocca in più e una spia in meno. Vedremo quale delle due conta di più." : "[serio] Hanno fatto quello che volevano fare da un anno. Non li giudico. Non li perdono neanche. Domani si lavora."],
        ["sn_gisaku", "[triste] Venticinque giorni. Poi il raccolto. Poi tre notti, dicono. Corvo Rosso non viene mai una notte sola: viene finché non ha quello che vuole."],
        ["voce", `<b>FINE DEL CAPITOLO 3 · «Palizzate»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 4 ti aspetta: tre notti, un campo oltre il passo e qualcuno che non torna."]
      ]), () => K.openMain(), "sn_notte");
    }
    // l'esploratore che si arrende: Pietà lo tiene vivo (e parla), Onore lo consegna al villaggio
    function esploratore(r) {
      if (!r.win) { K.bond("riso", -2); say("voce", "All'alba manca la porta del granaio, e due sacchi di riso. Gli esploratori sono scappati verso il passo, ridendo."); }
      else say("voce", "All'alba i predoni sono scappati verso il passo. Tutti tranne uno: un ragazzo con la gamba presa nella trappola, che non piange per orgoglio.");
      say("sn_rikichi", "[arrabbiato] Uno è rimasto. Datelo a noi. Solo questo chiedo. Datelo a noi.");
      if (F.is("sn_giuramento")) say("sn_shino", "[serio] Ronin. Al tempio mi hai giurato una cosa. Chi si arrende, vive.");
      wask("L'esploratore ha la gamba nella trappola e le mani alzate. Tutto il villaggio guarda te.", [
        { label: "🌾 «Si è arreso. Lo leghiamo al tempio e lo curiamo.»", big: true, w: { pieta: 2 }, fn: () => {
          F.set("sn_scout_vivo", true); F.set("sn_jiro_pista", true); K.learnLore("l_campo"); if (F.is("sn_giuramento")) K.rel.add("sn_shino", 3);
          say("voce", "Yumi gli fascia la gamba. Il ragazzo guarda la benda come se non ne avesse mai vista una.");
          say("voce", "L'esploratore, a voce bassa: «Il campo è nella gola del fiume, oltre il passo. Ci sono donne prese ai villaggi. E un ragazzino che tiene i cavalli. Lo chiamano «il Muto». Non è muto: non ha più voglia di parlare.»");
          if (K.crew.has("sn_kiku")) say("sn_kiku", "[sorpreso] Un ragazzino. Coi cavalli. (Kiku stringe l'arco fino a farsi bianche le nocche.) Jirō.");
          say("sn_rikichi", "[triste] Donne prese ai villaggi. (Rikichi si gira e se ne va. Nessuno lo segue.)");
          fin(true);
        } },
        { label: "🗡️ «È il loro villaggio. È la loro giustizia.»", big: true, w: { onore: 2 }, fn: () => {
          F.set("sn_scout_morto", true); if (F.is("sn_giuramento")) { F.set("sn_giuramento_rotto", true); K.rel.add("sn_shino", -4); }
          say("voce", "Lo portano dietro il granaio. Non senti niente. È peggio di sentire qualcosa.");
          if (F.is("sn_giuramento")) say("sn_shino", "[triste] Avevi giurato. Io resto, perché i bambini non hanno giurato niente. Ma non chiedermi più di pregare per te.");
          say("sn_rikichi", "[serio] (Rikichi torna con le mani pulite. Le ha lavate tre volte.) Era nessuno. Era un ragazzo. Mia moglie... no. Niente.");
          fin(false);
        } }
      ]);
    }
    function primaNotte() {
      const d = K.clock.day(); K.clock.set(d, 3);
      say("sn_kanbei", "[serio] Stanotte vengono a contarci. Esploratori: pochi, veloci, curiosi. Non devono vedere quanti siamo, devono vedere che non passano. Una persona per porta.");
      K.say(H.flush(), () => K.plan.open({ title: "La prima notte · Le Porte", q: "Chi difende quale porta? Le stelle ★ dicono chi ci sta meglio. Le difese che hai costruito contano.", roles: ["n", "e", "s", "o"], pool: H.alive() }, done, true, () => {
        H.night({ title: "La prima notte", granaio: 20, waves: [[["base", 3, "n"], ["lesto", 1, "o"]], [["lesto", 3], ["base", 3]]] }, (r) => { K.clock.set(d + 1, 0); esploratore(r || {}); });
      }));
    }

    const talk = {
      sn_kanbei() {
        if (K.rel.scene("sn_kanbei")) return;
        const s = S();
        if (s === 0) {
          say("sn_kanbei", "[pensa] (Kanbei ha disegnato il villaggio per terra con un bastoncino: quattro porte, il granaio, il fiume.) Quattro porte, quaranta predoni. Dieci a porta, se sono educati. Non lo sono.");
          say("sn_kanbei", "Il legno è nel bosco di bambù, oltre la Porta Ovest. Ogni fascina costa mezza giornata. Intorno alle porte ho piantato i picchetti gialli: lì si costruisce. Palizzate, fossati, trappole, torrette. Almeno quattro difese, prima che arrivino a contarci.");
          F.set("sn_cantieri", true); K.clock.set(1, 0); setStep(N, 1);
          quest("sn_c3", "Palizzate", "Taglia il bambù nel bosco a ovest e costruisci almeno quattro difese sui cantieri delle porte.");
          return done();
        }
        if (s === 1) {
          if (built() >= NEED) {
            say("sn_kanbei", `[felice] ${built()} difese. Non è un castello. È un villaggio che ha deciso di non farsi prendere. È meglio di un castello: i castelli si arrendono.`);
            say("sn_kanbei", "[pensa] Una cosa. La figlia del mugnaio mi gira intorno da stamattina, come chi ha una cosa in bocca e non sa se sputarla. Parlaci tu. A me fa paura: ha lo sguardo di mia madre.");
            setStep(N, 2); return done();
          }
          say("sn_kanbei", `${built()} su ${NEED}. Il bambù è a ovest. I picchetti gialli sono vicino alle porte: tocca un picchetto e scegli cosa costruire. Una palizzata regge, un fossato rallenta, una trappola morde, una torretta tira da sola.`); return done();
        }
        if (s === 2) { say("sn_kanbei", F.is("sn_soff_pista") ? "Il mulino. Va' tu. Se è quello che penso, è meglio che lo veda uno solo, prima." : "Shinobu. La figlia del mugnaio. Ti aspetta."); return done(); }
        if (s === 3) return primaNotte();
        say("sn_kanbei", "Domani si ripara quello che hanno rotto stanotte."); done();
      },
      sn_shinobu() {
        if (K.rel.scene("sn_shinobu")) return;
        const s = S();
        if (s === 2 && !F.is("sn_soff_pista")) {
          say("sn_shinobu", "[serio] Non dirlo a mio padre. Non dirlo a nessuno. Ma tu sei uno di loro, dei samurai, e devi saperlo prima di morire per noi.");
          say("sn_shinobu", "Nella soffitta del mulino. Sotto la paglia. Mio padre ci dorme sopra da quando sono piccola. Io ci salivo a giocare, finché un giorno ho capito a cosa giocavo.");
          F.set("sn_soff_pista", true); quest("sn_c3s", "La soffitta", "Nel mulino di Manzo, sotto la paglia della soffitta, c'è qualcosa che il villaggio nasconde.");
          return done();
        }
        say("sn_shinobu", s <= 1 ? "[felice] Porto l'acqua a chi taglia il bambù. Hayate dice che non ha sete. Poi beve tre secchi." : "[triste] Hai visto. Adesso sai chi siamo."); done();
      },
      sn_manzo() {
        if (K.rel.scene("sn_manzo")) return;
        say("sn_manzo", S() <= 1 ? "[arrabbiato] Palizzate! Fossati! Nel mio campo! Chi paga? Io pago! Paga sempre il mugnaio!" : F.is("sn_soffitta") ? "[triste] Non guardarmi. Ti prego. Guarda le porte, guarda il passo. Non me." : "[sorpreso] Il mulino? No. Il mulino è chiuso. C'è polvere. C'è... polvere."); done();
      },
      sn_gisaku() {
        if (K.rel.scene("sn_gisaku")) return;
        say("sn_gisaku", F.is("sn_soffitta") ? "[triste] Le armature. Lo sapevo. Lo sapevamo tutti. Ero io il capo villaggio, quella notte. Chiedimi, se vuoi. Ti risponderò." : "Il tè è pronto. È sempre pronto. È l'unica cosa del villaggio che non manca mai."); done();
      },
      sn_rikichi() { if (K.rel.scene("sn_rikichi")) return; say("sn_rikichi", S() <= 1 ? "[serio] Una palizzata. Bene. L'anno scorso non c'era. L'anno scorso c'erano solo le nostre mani." : "[pensa] Stanotte vengono. Ho affilato la falce. Non chiedermi per chi."); done(); },
      sn_okuma() {
        if (K.rel.scene("sn_okuma")) return;
        if (S() === 1 && !F.is("sn_okuma_tronco")) { F.set("sn_okuma_tronco", true); K.bond("legno", 4); say("sn_okuma", "[felice] (Okuma arriva con un tronco di cedro sulla spalla, come un bambino porta un fiore.) L'ho trovato sul fiume. Era solo. Adesso è una porta."); say("voce", `<b>+4 🪵 Legno</b> (${K.stat("legno")}).`); return done(); }
        say("sn_okuma", "Ferro per le punte, legno per i pali, canzoni per il morale. Io porto tutte e tre."); done();
      },
      sn_kiku() { if (K.rel.scene("sn_kiku")) return; say("sn_kiku", S() <= 1 ? "[serio] Il bambù si taglia in diagonale, vicino al nodo. Così ricresce, e la punta è già una lancia." : "Stanotte tiro. Non sbaglio. Non stanotte."); done(); },
      sn_gonta() { if (K.rel.scene("sn_gonta")) return; say("sn_gonta", "[pensa] Gli esploratori arrivano dalla Porta Nord, sempre. Poi girano a ovest, dove la staccionata è bassa. Lo so perché lo facevo io."); done(); },
      sn_tetsu() { if (K.rel.scene("sn_tetsu")) return; say("sn_tetsu", F.is("sn_soffitta") ? "[serio] Non dite niente ai contadini. Non c'è niente da dire. Io lo so com'è, sotto il pavimento." : "[ride] Ho tagliato più bambù di tutti! Va bene, ho tagliato anche un pezzo di sandalo. Conta lo stesso!"); done(); },
      sn_masa() { if (K.rel.scene("sn_masa")) return; say("sn_masa", "Le reti sul fossato. Chi ci cade dentro, ci resta. Come i pesci, ma più arrabbiati."); done(); },
      sn_yumi() { if (K.rel.scene("sn_yumi")) return; say("sn_yumi", "Bende, erbe, ago e filo. Fra poco servono. Preferirei ballare, ma la musica, adesso, la fanno i tamburi."); done(); },
      sn_shino() { if (K.rel.scene("sn_shino")) return; say("sn_shino", "[serio] Ho benedetto le palizzate. Non so se serve. So che i contadini lavorano meglio, dopo."); done(); },
      sn_hayate() { if (K.rel.scene("sn_hayate")) return; say("sn_hayate", "[arrabbiato] Tagliare bambù! Io! Sono uno spadaccino! (Taglia un bambù in otto pezzi con un colpo solo.) Va bene, è divertente."); done(); },
      sn_ren() { if (K.rel.scene("sn_ren")) return; say("sn_ren", "[furbo] Lavoro manuale. Nel contratto non c'era. Rinegoziamo dopo la guerra, se ci siamo ancora."); done(); }
    };

    // i compagni al lavoro nel villaggio (solo chi c'è)
    const crewAt = (L, spots) => H.alive().filter((id) => spots[id]).forEach((id) => L.push({ id, at: spots[id] }));
    const zones = {
      sn_villaggio: Z.villaggio(H, (s) => {
        const L = [{ id: "sn_kanbei", at: [18, 13] }];
        L.push({ id: "sn_shinobu", at: [20, 17] }, { id: "sn_rikichi", at: [26, 11] }, { id: "sn_gisaku", at: [13, 14] });
        if (s <= 1 || F.is("sn_soffitta")) L.push({ id: "sn_manzo", at: [21, 5] });
        crewAt(L, { sn_okuma: [12, 13], sn_gonta: [14, 18], sn_hayate: [21, 9], sn_yumi: [8, 17], sn_shino: [21, 13], sn_tetsu: [27, 7], sn_ren: [10, 7], sn_masa: [29, 16] });
        return L;
      }, {
        time: "giorno", start: [16, 13],
        doors: { "16,0": { to: "sn_passo", at: [16, 22] }, "17,0": { to: "sn_passo", at: [17, 22] }, "0,11": { to: "sn_bosco", at: [28, 10] }, "0,12": { to: "sn_bosco", at: [28, 11] } },
        extra: [[16, 0, "q"], [17, 0, "q"], [0, 11, "q"], [0, 12, "q"]],
        items: [[3, 6], [29, 7], [7, 20], [24, 20]], itemCos: "sn_c3",
        get mulino() { return S() >= 2 && F.is("sn_soff_pista") ? { to: "sn_soffitta", at: [6, 7] } : "Il mulino di Manzo. La porta è sbarrata dall'interno. Da dentro, solo il cigolio della ruota."; },
        intro: [["voce", "Ventotto giorni al raccolto. Il villaggio si sveglia al rumore di Okuma che batte il ferro e di Gisaku che si lamenta del rumore."], ["voce", "Davanti al granaio, Kanbei ha disegnato per terra quattro porte e un cerchio. Il cerchio siamo noi."]]
      }),
      sn_bosco: {
        region: "bosco", name: "Il bosco di bambù", short: "Bosco di bambù", sub: "Canne alte come case, un ruscello, un torii e il silenzio dei cervi", bg: "sn_bosco", time: "giorno", w: 30, h: 22, base: ";", start: [27, 10], travel: [27, 10],
        items: [[2, 11], [27, 18], [16, 3]], itemCos: "sn_c3",
        areas: [[16, 8, 28, 13, "Il sentiero del torii"], [0, 0, 13, 21, "Il folto a ovest"], [0, 0, 29, 21, "Il bosco di bambù"]],
        act: { A: "🪓 Taglia il bambù", t: "Guarda l'albero", w: "Guarda il ruscello", r: "Guarda la roccia", q: "Torna al villaggio", z: "Guarda la catasta", n: "Leggi la tavoletta" },
        flavor: { t: "Un cedro vecchio, troppo grosso da tagliare. Ha visto passare tre guerre e non ne ha capita nessuna.", w: "Un ruscello freddo che scende dal passo. I sassi sul fondo sono neri.", z: "Una catasta di canne tagliate l'anno scorso, marce. Nessuno è tornato a prenderle.", n: "Una tavoletta votiva appesa al torii: «Fa' che il raccolto arrivi prima di loro.» La scrittura è di un bambino." },
        doors: { "29,10": { to: "sn_villaggio", at: [1, 11] }, "29,11": { to: "sn_villaggio", at: [1, 12] } },
        npcs: () => { const L = []; crewAt(L, { sn_kiku: [6, 10], sn_hayate: [20, 6], sn_tetsu: [10, 17] }); return L; },
        intro: [["voce", "Il bosco di bambù. Le canne sono così alte che il sole arriva a strisce, come da una persiana."], ["voce", "I ciuffi buoni da tagliare sono quelli più chiari, in mezzo alle radure. Ogni fascina costa mezza giornata."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t"); put(29, 10, "q"); put(29, 11, "q");
          // il sentiero dal villaggio e il ruscello col ponticello
          lay(1, 10, 28, 11, ":"); lay(14, 1, 15, 20, "w"); lay(14, 10, 15, 11, ":");
          // il folto: cedri vecchi; i ciuffi di bambù da tagliare stanno nelle radure
          lay(2, 2, 10, 5, "t"); lay(2, 17, 12, 19, "t"); lay(17, 1, 27, 2, "t"); lay(17, 19, 27, 20, "t");
          CUT.forEach(([x, y]) => put(x, y, F.is(`sn_cut3_${x}_${y}`) ? ";" : "A"));
          // il torii nel bosco, con le lanterne e la tavoletta
          put(21, 9, "I"); put(24, 9, "I"); put(20, 12, "E"); put(25, 12, "E"); put(22, 9, "n");
          put(12, 7, "r"); put(27, 7, "r"); put(4, 12, "z"); put(17, 16, "r");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(); g.save();
          // strisce di sole fra le canne e foglie che cadono
          for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(254,240,138,${0.05 + 0.03 * Math.sin(f / 40 + i)})`; g.beginPath(); const x = d.X(2 + i * 5); g.moveTo(x, d.Y(0)); g.lineTo(x + 18, d.Y(0)); g.lineTo(x + 50, d.Y(21)); g.lineTo(x + 32, d.Y(21)); g.fill(); }
          for (let i = 0; i < 8; i++) { g.fillStyle = "rgba(132,204,22,.7)"; g.fillRect(d.X(1) + ((i * 67 + f * 0.4) % 460), d.Y(0) + ((i * 41 + f * 0.7) % 340), 2, 1); }
          g.restore();
          H.plaque(g, "▸ SASSO NERO", d.X(27) + 8, d.Y(9) - 2, "#fde68a"); H.plaque(g, "TORII DEL BOSCO", d.X(22) + 8, d.Y(8) - 2, "#fca5a5");
        }
      },
      sn_soffitta: {
        interior: true, region: "casa", name: "La soffitta del mulino", short: "Soffitta", sub: "Paglia, polvere, un raggio di luce e quello che c'è sotto", bg: "sn_soffitta", w: 12, h: 9, start: [6, 7], outside: ["sn_villaggio", 25, 7], base: "Y",
        act: { G: "Guarda sotto la paglia", z: "Guarda i sacchi", D: "Guarda la trave", W: "Guarda l'abbaino", B: "Guarda il pagliericcio" },
        flavor: { z: "Sacchi di farina, impilati con troppa cura.", D: "La trave maestra. Ci sono incisi dei segni: sei tacche, una per ogni armatura.", W: "L'abbaino sul villaggio. Da qui si vedono tutte e quattro le porte. E il passo.", B: "Il pagliericcio di Manzo. Ci dorme da vent'anni, sopra quello che c'è sotto." },
        npcs: () => (S() === 2 && !F.is("sn_soffitta") ? [{ id: "sn_manzo", at: [8, 4] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 11, 8, "Y"); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 8, "a"); lay(11, 0, 11, 8, "a"); lay(0, 8, 11, 8, "a"); put(6, 8, "v");
          lay(2, 1, 4, 1, "G"); put(6, 0, "D"); put(9, 0, "W"); put(10, 0, "W"); put(1, 5, "z"); put(1, 6, "z"); put(10, 5, "B"); put(10, 6, "B");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); g.fillStyle = `rgba(254,243,199,${0.08 + 0.03 * Math.sin(f / 30)})`; g.beginPath(); g.moveTo(d.X(9), d.Y(0)); g.lineTo(d.X(11), d.Y(0)); g.lineTo(d.X(5), d.Y(8)); g.lineTo(d.X(3), d.Y(8)); g.fill(); g.restore(); H.plaque(g, "SOFFITTA", d.X(6), d.Y(0) + 6, "#fde68a"); }
      }
    };

    // il segreto della soffitta: le armature dei samurai uccisi dai contadini
    function soffitta() {
      if (S() !== 2 || F.is("sn_soffitta")) { say("voce", F.is("sn_soffitta") ? "Sotto la paglia, adesso, non c'è più niente. Ma la paglia ha ancora la forma." : "Paglia vecchia, ammucchiata con troppa cura."); return done(); }
      F.set("sn_soffitta", true); K.learnLore("l_soffitta");
      say("voce", "Sposti la paglia. Sotto, una lama. Poi un elmo. Poi un'armatura intera, lucidata, coi lacci nuovi. Poi un'altra. Sei armature di samurai, sei spade, un arco. Ordinati come in un tempio.");
      say("sn_manzo", "[triste] (Manzo è in cima alla scala. Non scappa. Si siede sul gradino.) Venivano dalle battaglie. Feriti. Attraverso le risaie, di notte. Chiedevano acqua.");
      say("sn_manzo", "Noi gliela davamo. Poi, quando dormivano... con le zappe. Una lama vale dieci sacchi di riso, in città. Un'armatura, trenta. Avevamo fame. Avevamo sempre fame.");
      say("sn_kanbei", "[serio] (Kanbei è salito senza fare rumore. Guarda le armature una per una, come si guardano dei volti.)");
      const who = K.crew.has("sn_tetsu") ? "sn_tetsu" : K.crew.has("sn_gonta") ? "sn_gonta" : "sn_kanbei";
      say(who, "[arrabbiato] E allora? Cosa credevate che fossero i contadini? Santi? Sono avari, bugiardi, codardi. Nascondono il riso, sorridono e vi tagliano la gola. Sì!");
      say(who, "[triste] Ma chi li ha fatti così? Voi! I samurai! Che bruciate i villaggi, prendete il riso, prendete le figlie, e poi chiedete acqua. Io lo so. Io ero sotto il pavimento.");
      if (K.crew.has("sn_hayate")) say("sn_hayate", "[sorpreso] (Hayate ha la mano sull'elsa. La toglie. Poi la rimette. Poi la toglie.)");
      return wask("Sei armature sotto la paglia. Manzo sul gradino, che aspetta. Kanbei ti guarda: decidi tu.", [
        { label: "🗡️ «Il villaggio deve sapere. Domani, davanti a tutti, la verità.»", big: true, w: { onore: 2 }, fn: () => {
          F.set("sn_verita", true); K.rel.add("sn_kanbei", 2);
          say("voce", "La mattina dopo, davanti al granaio, Manzo parla. Il villaggio ascolta in silenzio. Nessuno lo difende. Nessuno lo colpisce. Poi Gisaku dice: «Anch'io». E un altro. E un altro.");
          say("sn_kanbei", "[pensa] Adesso sanno chi sono. È un buon punto per cominciare una guerra."); setStep(N, 3); done();
        } },
        { label: "🌾 «Ricoprile. Usatele per difendervi. Non è mai successo.»", big: true, w: { pieta: 2 }, fn: () => {
          F.set("sn_perdono", true); K.rel.add("sn_tetsu", 2); K.rel.add("sn_gonta", 2);
          say("sn_manzo", "[sorpreso] Non... non è mai successo? (Manzo piange senza rumore, come chi lo fa da vent'anni.)");
          say("voce", "Le armature scendono dalla soffitta. Okuma le adatta ai contadini più grossi. Shinobu ne lucida una per Rikichi, che non la vuole e poi la indossa.");
          say("sn_kanbei", "[serio] Il perdono è un'arma. La più pesante. Vedremo se la reggono."); setStep(N, 3); done();
        } }
      ]);
    }
    const obj = {
      "sn_bosco:A": ({ tx, ty }) => cut(tx, ty),
      "sn_soffitta:G": () => soffitta(),
      "sn_bosco:r:27,7": () => { say("voce", "Sulla roccia, inciso col coltello, un corvo. Fresco: la pietra è ancora chiara."); if (K.crew.has("sn_gonta")) say("sn_gonta", "[serio] Il segno degli esploratori. Vuol dire: «di qui si passa». Lo incidevo io, una volta."); done(); }
    };
    return {
      n: N, title: "Palizzate", sub: "Bambù da tagliare, porte da chiudere, una soffitta da non aprire e la prima notte",
      goal, start: "sn_villaggio", introBg: "sn_villaggio", zones, talk, obj,
      intro: [["voce", "Ventotto giorni al raccolto. I contadini si sono abituati ai ronin; i ronin, quasi, ai contadini."], ["voce", "Adesso servono legno, fossati e porte. E qualcuno che dica la verità, prima che arrivi la notte."]]
    };
  }
  boot();
})();
