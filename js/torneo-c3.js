// js/torneo-c3.js - IL TORNEO DELLE CENTO SCUOLE · Capitolo 3 «La finale»
// La sera della finale: il Campo dei Cento con i riflettori accesi e la tribuna piena. Lo spogliatoio (si entra): prima di
// scendere in campo si parla con ognuno della Via Lunga. La maestra Iole racconta la finale persa trent'anni fa contro
// l'Accademia di Vela senior. La finale a Vignette, con tutte e tre le tecniche. Finali: LA FESTA DELLA VIA LUNGA ·
// IL CAPITANO DEL FARO · LA MAESTRA TORNA · (segreto) IL TORNEO DI TUTTE LE STRADE.
(function () {
  "use strict";
  function boot() { const D = window.__torneo; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);

    K.cos("ts_c3", { kind: "acc", label: "Medaglia d'argento delle Cento Scuole", val: "#c8ccd8", from: "Completa Il Torneo delle Cento Scuole" });
    K.cos("ts_festa", { kind: "shirt", label: "Maglia della festa della Via Lunga", val: "#f0d070", from: "Finale «La festa della Via Lunga»" });
    K.cos("ts_amico", { kind: "acc", label: "Fascia blu dell'Accademia", val: "#1a2a5a", from: "Finale «Il capitano del Faro»" });
    K.cos("ts_maestra", { kind: "acc", label: "Fischietto di latta della maestra", val: "fischietto", from: "Finale «La maestra torna»" });
    K.cos("ts_tutte", { kind: "acc", label: "Sciarpa di Tutte le Strade", val: "#e8c84a", from: "Finale segreto «Il torneo di tutte le strade»" });
    K.cos("ts_luci", { kind: "hairc", label: "Capelli Riflettore", val: "#fff4c8", from: "Trova tutti i fischietti di latta della finale" });
    K.lore("l_iole", { t: "La finale di trent'anni fa", d: "Trent'anni fa la maestra Iole portò in finale la sua scuola dei portici contro l'Accademia del Faro di Vela senior. Persero 1 a 0, all'ultimo minuto. Il giorno dopo la scuola dei portici chiuse: non per la sconfitta, disse lei, ma perché aveva smesso di ridere." });
    K.lore("l_finale_ts", { t: "La finale delle Cento Scuole", d: "La Via Lunga contro l'Accademia del Faro, sotto i riflettori, con la tribuna di otto colori piena come cinquant'anni fa. Qualcuno, in fondo, ha portato un tamburo. Nessuno sa chi." });

    const goal = (s) => ({
      0: "La sera della finale. La maestra Iole è in piazza, davanti al Tabellone.",
      1: "Al Campo dei Cento (a ovest della piazza), entra nello spogliatoio e parla con ognuno della Via Lunga.",
      2: "La squadra è pronta. Esci in campo: la maestra Iole dà il fischio d'inizio.",
      3: "Fischio finale. La maestra Iole ti aspetta a centrocampo.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    const pep = () => ["ts_pep_tito", "ts_pep_alba", "ts_pep_gemelli"].filter((k) => F.is(k)).length;
    function checkPep() { if (S() === 1 && pep() >= 3) { setStep(N, 2); questDone("ts_spogliatoio"); return true; } return false; }

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const zones = {
      ts_finale: {
        region: "campo", name: "Il Torneo delle Cento Scuole · La finale", short: "La finale", sub: "Il Campo dei Cento sotto i riflettori", bg: "ts_finale", time: "notte", travel: [28, 9],
        w: 30, h: 20, start: [28, 9], itemCos: "ts_luci", items: [[2, 2], [2, 17], [27, 17]],
        areas: [[4, 3, 24, 14, "Il campo"], [0, 0, 29, 19, "Il Campo dei Cento, la sera della finale"]], act: { ">": "Torna in piazza", q: "Entra" },
        flavor: { K: "La bancarella dei biglietti stasera è chiusa: «TUTTO ESAURITO». Sotto, più piccolo: «anche le sedie dei vicini»." },
        intro: [["voce", "Il Campo dei Cento, la sera della finale. Quattro riflettori accesi, la tribuna di otto colori piena fino all'ultimo gradino, gente sugli alberi, sui tetti, sulla bancarella dei biglietti."], ["voce", "Qualcuno, in fondo, suona un tamburo. Bum. Bum. Bum. Come un cuore grande come una città."]],
        npcs: (s) => [...(s >= 2 ? [{ id: "ts_iole", at: [14, 9] }] : []), { id: "ts_ettore", at: s >= 3 ? [18, 11] : [20, 9] }, ...(s >= 1 ? [{ id: "ts_nadia", at: [26, 3] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 19, 29, 19, "t"); lay(0, 0, 0, 19, "t"); lay(29, 0, 29, 19, "t"); put(29, 8, ">"); put(29, 9, ">");
          lay(4, 3, 24, 14, "-"); lay(25, 8, 28, 9, ":"); [[6, 1], [10, 1], [14, 1], [18, 1], [22, 1]].forEach(([x, y]) => put(x, y, "b")); put(27, 5, "K");
          house(5, 15, 8, 3, { door: [9, 17], roof: "#3a5a8a", wall: "#e8e0c8", rr: 2, lit: true, enter: { room: "spogliatoio", id: "ts_spogl", name: "Lo spogliatoio della Via Lunga", who: (s) => (s <= 2 ? [{ id: "ts_tito", at: [5, 7] }, { id: "ts_alba", at: [14, 7] }, { id: "ts_rocco", at: [7, 9] }, { id: "ts_remo", at: [12, 9] }] : []) } });
        },
        decor(g, cx, cy, d) { // le linee del campo, i riflettori, il tamburo in tribuna
          g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1.2; g.strokeRect(d.X(4) + 2, d.Y(3) + 2, 21 * 16 - 4, 12 * 16 - 4); g.beginPath(); g.moveTo(d.X(14) + 8, d.Y(3) + 2); g.lineTo(d.X(14) + 8, d.Y(15) - 2); g.stroke(); g.beginPath(); g.arc(d.X(14) + 8, d.Y(9), 20, 0, 7); g.stroke();
          [[2, 2], [27, 2], [2, 14], [27, 14]].forEach(([x, y]) => { const X = d.X(x) + 8, Y = d.Y(y); R(g, X - 1, Y - 30, 2, 30, "#5a5a6a"); R(g, X - 6, Y - 36, 12, 7, "#e8e8f0"); K.light(X, Y - 32, 90, "255,250,220", 0.35); });
          if (Math.floor(d.fr / 22) % 2) { g.fillStyle = "rgba(255,255,255,.8)"; g.font = "bold 6px sans-serif"; g.fillText("BUM", d.X(22), d.Y(1) - 2); }
        },
      },
    };
    function finale() {
      K.ownMatch(window.__vignette.start, {
        oppStyle: "contropiede", title: "Finale · La Via Lunga – Accademia del Faro", us: "La Via Lunga", actions: 10,
        opp: { name: "Accademia del Faro", color: "#1a2a5a", players: [{ id: "ts_ettore", name: "Ettore", skin: "#e0b890", hair: "#1a1a2a" }, { name: "Marino", skin: "#e8c4a0", hair: "#2a1a1a" }, { name: "Scotti", skin: "#d9a679", hair: "#3a2a1a" }] },
        mates: [{ id: "ts_tito", name: "Tito", skin: "#e8b88a", hair: "#3a2a1a" }, { id: "ts_alba", name: "Alba", skin: "#f0d0b0", hair: "#c8642a" }], shirt: "#e83a3a", techniques: K.techs(), bg: "ts_finale", winTitle: "CAMPIONI DELLE CENTO SCUOLE!",
        intro: "<p>La finale. Dieci azioni. L'Accademia del Faro riparte in contropiede come un'onda lunga. Tre tecniche nello Spirito: <b>Tiro a Tre</b>, <b>Muro Umano</b>, <b>Finta dell'Ombra</b>. Usatele tutte, se potete.</p>",
        done: (r) => {
          if (!r.win) return K.scene([["ts_ettore", "(si avvicina, col fiatone) Avete perso. Ma… la rigiochiamo. Non per il regolamento. Perché non è finita. Lo sento."], ["ts_iole", "(fischia) Rivincita! Il torneo l'ha permesso una volta sola in cinquant'anni. Stasera fanno due."]], () => K.enterZone("ts_finale"), "ts_finale");
          const all = r.data && r.data.usate && ["tiro3", "muro", "ombra"].every((k) => r.data.usate[k]);
          F.set("tb_f", "La Via Lunga"); F.set("ts_m3", r.a + "-" + r.b); if (all) F.set("ts_tre_tecniche", true); setStep(N, 3); bond("squadra", 2); K.learnLore("l_finale_ts");
          K.scene([["voce", "Fischio finale. La Via Lunga vince il Torneo delle Cento Scuole. La tribuna di otto colori viene giù, tutta insieme, in campo. Tito solleva la coppa d'argento. La coppa solleva Tito, quasi: è più pesante del forno."], all ? ["voce", "Nadia, a bordo campo, ha contato: Tiro a Tre, Muro Umano, Finta dell'Ombra. Tutte e tre in una finale. «Non era mai successo», scrive. «Nemmeno nei fumetti.»"] : ["voce", "Nadia, a bordo campo, scrive in fretta su un taccuino che non le basta più."], ["voce", "Ettore Vela è in ginocchio a centrocampo. Non piange. Ride. Ride come uno che non lo faceva da anni e si è dimenticato come si smette."]], () => K.enterZone("ts_finale"), "ts_finale");
        },
      });
    }
    function endingAsk() {
      const opts = [{ label: "«Facciamo festa in piazza. Tutta la notte»", sub: "La Via Lunga festeggia", big: true, fn: () => ending("festa") }];
      if (st("rivale") >= 5) opts.push({ label: "«Ettore, l'anno prossimo gioca con noi»", sub: "Il capitano del Faro", big: true, fn: () => ending("amicizia") });
      if (st("squadra") >= 8) opts.push({ label: "«Maestra, riapra la sua scuola»", sub: "Sotto i portici, gratis per tutti", big: true, fn: () => ending("maestra") });
      if (F.is("ts_tre_tecniche") && F.is("ts_l2_venditore") && F.is("ts_l2_fioraia")) opts.unshift({ label: "Nadia ha un'idea per il titolo di domani…", sub: "Segreto: tutte le tecniche in finale e tutte le lettere di Alba", cls: "hot", big: true, fn: () => ending("tutte") });
      ask("ts_iole", "(La maestra Iole è a centrocampo, con la coppa d'argento tra le mani. Non l'ha mai tenuta prima.) Trent'anni fa ho perso questa finale all'ultimo minuto. Il giorno dopo ho chiuso la scuola. Non perché avevamo perso: perché avevo smesso di ridere.\n\nStasera ho riso per novanta minuti. Adesso tocca a te, capitano. Che facciamo, con tutta questa gioia?", opts, "ts_festa");
    }
    function ending(kind) {
      const R2 = { festa: { coins: 120, cos: ["ts_c3", "ts_festa"] }, amicizia: { coins: 130, cos: ["ts_c3", "ts_amico"] }, maestra: { coins: 130, cos: ["ts_c3", "ts_maestra"] }, tutte: { coins: 200, cos: ["ts_c3", "ts_tutte"] } }[kind];
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        festa: [["voce", "Quella notte la piazza del Tabellone non dorme. Tito sforna pane a forma di pallone fino all'alba, Alba consegna focacce in bicicletta, i gemelli ballano in perfetta sincronia e poi litigano su chi ballava meglio."], ["ts_iole", "L'anno prossimo si torna. Con la stessa squadra. E con qualche bambino in più, se viene."], ["voce", "<b>FINALE · LA FESTA DELLA VIA LUNGA.</b> Sul Tabellone, col gesso, qualcuno scrive: «Campioni: quelli che ridono»."]],
        amicizia: [["ts_ettore", "Giocare con voi? (Guarda la maglia blu dell'Accademia, poi la maglia rossa della Via Lunga.) Mio padre non capirà. Ma stasera ho riso, e non voglio smettere."], ["voce", "L'estate dopo, nella Via Lunga c'è un nuovo terzino: preciso come un righello, e ride a ogni gol. Anche a quelli degli avversari."], ["voce", "<b>FINALE · IL CAPITANO DEL FARO.</b> Ettore Vela lascia l'Accademia e gioca per divertirsi."]],
        maestra: [["ts_iole", "Riaprire la scuola? Alla mia età? Con questo fischietto? (Lo guarda, lo soffia piano.) …Sotto i portici c'è ancora il segno della porta, sul muro. L'avevo dipinta io."], ["voce", "Il lunedì dopo, sotto i portici di Portolungo, riapre la scuola calcio della maestra Iole. Gratis, per tutti. Il primo iscritto è un bambino col grembiule da panettiere: il nipote di Tito."], ["voce", "<b>FINALE · LA MAESTRA TORNA.</b> Il fischietto di latta suona di nuovo, tutti i pomeriggi."]],
        tutte: [["ts_nadia", "Ho il titolo. «Il Torneo delle Cento Scuole cambia nome». (Tutti si girano.) Ho parlato con il comitato. E con Bruna, con Lume, con Gil, con Ettore. Dall'anno prossimo: «Il Torneo di Tutte le Strade». Chiunque può iscriversi. Anche chi una scuola calcio non ce l'ha."], ["voce", "Alba, che di strade se ne intende, si toglie il berretto. Sor Fulvio e Mirella, che hanno ricevuto la loro prima lettera grazie a te, si tengono per mano in tribuna."], ["voce", "<b>FINALE SEGRETO · IL TORNEO DI TUTTE LE STRADE.</b> L'estate dopo le squadre sono trentadue. Una è fatta solo di nonni. Arriva in semifinale."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "ts_festa");
    }
    const talk = {
      ts_iole() {
        const s = S(), here = K.api.trZone();
        if (s === 0) return say([
          ["ts_iole", "La finale. Contro l'Accademia del Faro. (Guarda il Tabellone, dove qualcuno ha scritto VIA LUNGA in rosso.) Trent'anni fa ero qui, con la mia squadra dei portici. Finale contro l'Accademia di Vela senior. Perdemmo all'ultimo minuto."],
          ["ts_iole", "Il giorno dopo ho chiuso la scuola. Non per la sconfitta. Perché avevo smesso di ridere. Stasera non voglio vincere a tutti i costi: voglio che ridiate. Andate nello spogliatoio, al Campo. Parlate con ognuno. Una squadra si prepara così."],
        ], () => { setStep(N, 1); K.learnLore("l_iole"); quest("ts_spogliatoio", "Prima della finale", "Al Campo dei Cento, entra nello spogliatoio e parla con Tito, Alba e i gemelli."); done(); });
        if (s === 2 && here === "ts_finale") return ask("ts_iole", "Tutti pronti. Tutti in campo. (Il fischietto di latta le trema tra le dita.) Sapete cosa vi dico? Niente. Vi ho già detto tutto. Andate e ridete.", [{ label: "Gioca la finale", sub: "Vignette · dieci azioni, tre tecniche", cls: "hot", fn: finale }, { label: "Un momento", fn: done }], "ts_finale");
        if (s === 3 && here === "ts_finale") return endingAsk();
        return say([["ts_iole", "Arrivo, arrivo. Stasera arrivo prima di tutti."]]);
      },
      ts_tito() { return pepTalk("ts_pep_tito", "ts_tito", "(seduto sulla panca, col grembiule sotto la maglia) Ho le mani che tremano. Alle tre del mattino non mi tremano mai. Forse dovevo giocare alle tre del mattino.", [["«Tito, nessuno passa da te. Nemmeno l'Accademia»", "…Nessuno passa. Neanche alle tre del mattino. (Si alza, enorme.) Andiamo."], ["«Dopo la partita, pizza per tutti. Offri tu»", "Pizza per tutti! (Ride, e smette di tremare.) Offro io. Anche agli avversari: così la prossima volta corrono meno."]]); },
      ts_alba() { return pepTalk("ts_pep_alba", "ts_alba", "(si allaccia le scarpe per la quarta volta) Sai qual è la cosa più difficile del mio lavoro? Non le salite. È quando consegni una lettera e non sai cosa c'è dentro. Stasera è uguale: non so cosa c'è dentro.", [["«Dentro c'è la partita più bella della tua vita»", "La partita più bella. (Annuisce.) Va bene. La consegno. Firmata e tutto."], ["«Corri come quando ti insegue il cane del pescivendolo»", "(ride forte) Quello è il mio record personale. Va bene. Stasera il cane è l'Accademia."]]); },
      ts_rocco() { return pepTalk("ts_pep_gemelli", "ts_rocco", "(in coro) Abbiamo deciso: stasera io sono Rocco e lui è Remo. Per sempre. Basta scambi. È la finale.", [["«Stasera siete la Via Lunga, e basta»", "(si guardano) …La Via Lunga e basta. Mi piace. Niente nomi. Il Muro Umano non ha nomi."], ["«Scambiatevi i nomi a metà partita: l'Accademia impazzirà»", "Geniale! Al decimo minuto io divento lui. Al ventesimo torno io. Ettore Vela non capirà più niente!"]]); },
      ts_remo() { return talk.ts_rocco(); },
      ts_ettore() {
        const s = S();
        if (s <= 2) return say([["ts_ettore", st("rivale") >= 4 ? "(si stringe la fascia) Ho letto il regolamento interno dell'Accademia, articolo 4. «In campo non si ride». Stasera… stasera lo violo. Credo. Se succede, non è colpa mia: è colpa vostra." : "Stasera vince l'Accademia. Come sempre. È… è quello che ci si aspetta da me."]]);
        return say([["ts_ettore", "(ancora seduto sull'erba, ridendo) Scusa. Non riesco a smettere. È colpa tua. È colpa vostra. Grazie."]]);
      },
      ts_nadia() { return say([["ts_nadia", S() >= 3 ? "Ho scritto il titolo sei volte. Nessuno era abbastanza grande. Il direttore dice di usare il carattere più grosso che abbiamo. Ho chiesto se ne abbiamo uno ancora più grosso." : "Stasera ho portato tre taccuini. Uno per il primo tempo, uno per il secondo, uno per le lacrime. Le mie, probabilmente."]]); },
    };
    function pepTalk(flag, who, line, opts) {
      if (F.is(flag)) return say([[who, "Sono pronto. Più pronto di così si fa la muffa, come il pane vecchio."]]);
      if (S() !== 1) return say([[who, "In campo! In campo!"]]);
      return ask(who, line, opts.map(([label, reply]) => ({ label, fn: () => { F.set(flag, true); bond("squadra", 1); say([[who, reply]], () => { checkPep(); done(); }); } })), "ts_finale");
    }
    const obj = { "ts_piazza:<": () => go("ts_finale", 28, 9), "ts_finale:>": () => go("ts_piazza", 1, 12) };
    const patch = {
      ts_piazza: { npcs: (s, list) => [...list.filter((n) => n.id !== "ts_iole" && n.id !== "ts_nadia"), ...(s === 0 ? [{ id: "ts_iole", at: [17, 13] }] : [])] },
    };
    return { n: N, title: "La finale", sub: "Lo spogliatoio, i riflettori, l'Accademia del Faro", goal, start: "ts_piazza", introBg: "ts_finale", zones, talk, obj, patch,
      intro: () => [["voce", "La sera della finale Portolungo si svuota: tutti al Campo dei Cento. Restano solo i gatti e il Tabellone, con due nomi in alto: LA VIA LUNGA e ACCADEMIA DEL FARO."], ["voce", "La maestra Iole è ancora in piazza. Guarda il Tabellone come la prima volta. Ma stavolta ha il fischietto in bocca."]] };
  }
  boot();
})();
