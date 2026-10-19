// js/capitani-c3.js - «CAPITANI DI VENTURA» · Capitolo 3: L'Autunno dei Contratti Doppi
// Due lettere per la stessa notte: il Conte vuole il granaio difeso, il Lupo Grigio vuole il ponte aperto. Due testimoni e un
// prigioniero parlano di un granaio troppo pieno per un villaggio troppo magro. Tre vie: Conte, Lupo o accordo (con indizi + compagnia).
// Segue un capitolo 4 provvisorio.
(function () {
  "use strict";
  function boot() {
    const E = window.__capitaniCore;
    if (!E || !E.api || !E.api.addChapter || !window.__schiere) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  const SHORT = { cv_isotta: "Isotta", cv_ambrogio: "Ambrogio", cv_brenno: "Brenno", cv_piccarda: "Piccarda", cv_tancredi: "Tancredi", cv_gemma: "Gemma", cv_dario: "Dario", cv_cunegonda: "Cunegonda", cv_letizia: "Letizia", cv_piero: "Piero", cv_zanna: "Zanna", cv_pellegrino: "Pellegrino", cv_ilaria: "Ilaria", cv_fulvio: "Fulvio", cv_tiburzio: "Tiburzio" };

  function chapter3(K) {
    const { setStep, quest, F } = K;
    const N = 3, S = () => K.stepOf(N), CR = K.crew, PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const gold = (n) => K.bond("scudi", n);
    const clues = () => ["cv3_marta", "cv3_bertoldo", "cv3_oddone"].filter((k) => F.is(k)).length;
    const clue = (k) => { if (!F.is(k)) { F.set(k, true); K.SFX && K.SFX.ding && K.SFX.ding(); say("voce", `<b>Indizio ${clues()}/3</b> annotato nel Registro.`); } };

    K.cast("cv_marta", { name: "Marta la Fornaia", sub: "Fiera d'Autunno", style: "bun", hair: "#7a4a2a", acc: ["grembiule"], skin: "#e0b890", eye: "#3a2a1a", shirt: "#92400e", bg: ["#78350f", "#fde68a"] }, "Fa il pane per mezzo villaggio. Da quando il grano scarseggia lo fa per la metà.");
    K.cast("cv_bertoldo", { name: "Nonno Bertoldo", sub: "Vecchio del borgo", style: "bald", hair: "#d8d8d8", beard: "folta", acc: ["paglia"], skin: "#d9a679", eye: "#3a3a2a", shirt: "#57534e", bg: ["#44403c", "#e7e5e4"] }, "Ha visto sette Conti e nove raccolti. Non si fida di nessuno dei due.");
    K.cos("cv_c3", { kind: "shirt", label: "Mantello d'Autunno", val: "#9a3412", from: "Capitolo 3 di Capitani di Ventura" });
    K.lore("l_doppio", { t: "I Contratti Doppi", d: "Una compagnia di ventura può firmare per due padroni solo se nessuno dei due lo sa. È un mestiere basato sul silenzio, sui cavilli e su un buon cuoco." });

    const goal = (s) => ({
      0: "Parla con Isotta all'accampamento: sono arrivate due lettere.",
      1: "Alla Fiera d'Autunno (porta est di Pietrabianca): ascolta Ser Oddone e la gente. Servono 2 indizi su 3.",
      2: `Hai ${clues()}/3 indizi. Porta la tua risposta al bosco, a est della Fiera, da Corvo.`
    }[s] || "Il Capitolo 3 è concluso. Il capitolo 4 è in arrivo.");

    function schiere(enemy, rounds, win, lose) {
      const mem = CR.field().map((id) => Object.assign({ id }, CR.members[id], { n: SHORT[id] }));
      K.say(flush(), () => K.ownMatch(window.__schiere.start, { members: mem, enemy, rounds, bg: "cv_ponte", title: "Capitani di Ventura", done: (r) => (r.win ? win() : lose()) }));
    }
    const retry = (txt) => K.scene([["voce", txt]], () => K.enterZone("cv_bosco"), "cv_bosco");

    function viaConte() {
      F.set("cv3_path", "conte");
      say("cv_lupo", "[ride] Il Conte? Capitano, avete scelto il padrone che paga dopo. Peccato. Vi aspetto sul ponte.");
      schiere({ name: "Lupo Grigio · Notte del Granaio", icon: "🐺", atk: [6, 0.7], def: [6, 0.6] }, 7, () => {
        K.bond("onore", -1); gold(50); K.reward("cv_c3a", { coins: 200, cos: "cv_c3" });
        fin("conte", ["cv_oddone", "[serio] Il granaio è salvo. Il Conte non dimenticherà. Neppure il villaggio, ma con un altro stato d'animo."]);
      }, () => retry("Il Lupo vi ha respinti. Rimettete in ordine la compagnia e riprovate."));
    }
    function viaLupo() {
      F.set("cv3_path", "lupo");
      say("cv_lupo", "[felice] La luna è nuova e il ponte è aperto. Dite ai vostri di non guardare. Se qualcuno guarda, che almeno non giudichi.");
      schiere({ name: "Guardia del Conte · Il Ponte Aperto", icon: "🛡️", atk: [5, 0.6], def: [5, 0.5] }, 6, () => {
        const eth = clues() >= 2; K.bond("onore", eth ? 1 : -1); K.bond("fama", 1); gold(40); K.reward("cv_c3b", { coins: 160, cos: "cv_c3" });
        fin("lupo", ["cv_lupo", eth ? "[serio] Il villaggio avrà il suo pane. Non perché sono buono: perché è l'unico modo di non perdere la guerra." : "[ride] Un granaio aperto, un cuoco felice e un conto ancora da pagare. È una vittoria, in senso largo."]);
      }, () => retry("Le guardie del Conte vi respingono. Riprovate con un'altra formazione."));
    }
    function accordo() {
      F.set("cv3_path", "accordo");
      const pw = CR.power("ingegno") + CR.power("cuore");
      if (clues() < 2) { say("voce", "Hai troppo poco in mano: due indizi su tre ti servirebbero, per un doppio gioco."); return done(); }
      if (pw < 8) { say("cv_isotta", `[pensa] Ingegno e cuore della squadra in campo valgono ${pw}. Ne servono 8: schiera meglio la compagnia, con Dario, Piero, Fulvio o Letizia, e riprova.`); return done(); }
      say("cv_lupo", "[serio] Un incontro a tre, di notte, senza armi. Il Conte può dire di no, ma non lo dirà davanti al villaggio.");
      say("cv_dario", "[ride] Ho già scritto la ballata. Si chiama «Il Pane non ha Padroni». Non è un bel titolo, ma è un bel ritornello.");
      K.bond("onore", 2); K.bond("fama", 2); K.reward("cv_c3c", { coins: 180, cos: "cv_c3" });
      fin("accordo", ["cv_conte", "[serio] Il granaio resta aperto fino a Natale. Il Lupo non attraversa il ponte. Nessuno lo dirà, ma tutti l'avranno firmato."]);
    }
    function fin(end, extra) {
      K.finishChapter(N, end);
      K.scene([extra, ["voce", `<b>FINE DEL CAPITOLO 3.</b> L'autunno è passato. La Rondine Scalza è ${CR.count()} compagni e una reputazione che non sa più di che colore sia.`], ["voce", "Il Capitolo 4, «L'Inverno del Capitano», chiude la storia."]], () => K.openMain(), "cv_titolo");
    }

    const talk = {
      cv_isotta() {
        const s = S();
        if (s === 0 && K.inZone("cv_campo")) {
          say("cv_isotta", "[pensa] Capitano. Due lettere. La prima è del Conte: «Difendete il granaio la notte di luna nuova». La seconda non è firmata, ma l'inchiostro è di Corvo: «Lasciate il ponte aperto. Trecento scudi».");
          say("cv_isotta", "Due contratti per la stessa notte. Nessuno dei due sa dell'altro. Io li ho letti entrambi, ho pianto in modo contabile e sono qui.");
          say("cv_isotta", "Alla Fiera d'Autunno, a est del borgo, la gente parla. Parlare costa meno dei contratti. Andiamo a sentire.");
          setStep(N, 1); K.learnLore("l_doppio");
          quest("cv_c3_fiera", "Due lettere", "Alla Fiera d'Autunno (porta est di Pietrabianca): ascolta la gente e Ser Oddone. Servono 2 indizi su 3.");
          return done();
        }
        if (s === 1 && K.inZone("cv_campo")) { say("cv_isotta", "Alla Fiera, a est di Pietrabianca. Chiedi, non accusare."); return done(); }
        return PASS;
      },
      cv_oddone() {
        const s = S();
        if (!K.inZone("cv_fiera") || s < 1) return PASS;
        if (F.is("cv3_oddone")) { say("cv_oddone", "[serio] Ho già detto troppo. Se mi chiedete ancora, dirò altro e il Conte mi licenzierà."); return done(); }
        say("cv_oddone", "[serio] Il Conte vi ordina di difendere il granaio la notte di luna nuova. Dal Lupo. Io vi dico solo: fate il vostro dovere.");
        ask("Ser Oddone evita il tuo sguardo.", [
          { label: "Lo incalzi con garbo", sub: "Fama 2 o Onore 3", fn: () => { if (K.stat("fama") >= 2 || K.stat("onore") >= 3) { say("cv_oddone", "[triste] ...Il granaio ha sacchi per tre inverni. Il Conte ha ordinato di razionare. Io firmo gli ordini. Vorrei non farlo."); clue("cv3_oddone"); } else say("cv_oddone", "[serio] Non ho nulla da aggiungere, capitano."); done(); } },
          { label: "Lo lasci stare", sub: "Si ricorderà del favore", fn: () => { K.bond("onore", 1); say("cv_oddone", "[serio] ...Grazie. Non lo dimenticherò, e non lo scriverò."); done(); } }
        ]);
      },
      cv_marta() {
        if (!K.inZone("cv_fiera")) return PASS;
        say("cv_marta", "[triste] Il pane. Sono tre settimane che impasto metà del dovuto. La farina del Conte la dà a chi ha il lasciapassare, e il lasciapassare lo dà chi ha la tessera.");
        say("cv_marta", "Il granaio ha il lucchetto nuovo. Nessuno ne ha mai visto uno uguale. Il Lupo? Il Lupo è l'unico che ha portato un sacco di farina in dono, l'altra sera.");
        clue("cv3_marta"); done();
      },
      cv_bertoldo() {
        if (!K.inZone("cv_fiera")) return PASS;
        say("cv_bertoldo", "Ho visto sette Conti, giovanotto. Questo è il peggiore: ha paura di tutti, e quindi accumula.");
        ask("Il vecchio sospira.", [
          { label: "Lo ascolti seduto", sub: "Una buona storia", fn: () => { say("cv_bertoldo", "[pensa] La notte scorsa ho visto lo scrivano contare sacchi al granaio. Contava, e piangeva. A quell'età, io piango solo di rabbia."); clue("cv3_bertoldo"); done(); } },
          { label: "Gli dai due scudi per il tabacco", sub: "Scudi -2", fn: () => { if (K.stat("scudi") < 2) { say("cv_bertoldo", "Il pensiero mi basta, mi basta."); return done(); } gold(-2); say("cv_bertoldo", "[felice] Bravo. Ti dico una cosa: lo scrivano conta i sacchi di notte, e piange."); clue("cv3_bertoldo"); done(); } }
        ]);
      },
      cv_lupo() {
        const s = S();
        if (K.inZone("cv_fiera") || !K.inZone("cv_bosco")) {
          if (s >= 1 && s < 3) { say("cv_lupo", "[ride] Domani sera, capitano. Qui è il Conte, là sono io."); return done(); }
          return PASS;
        }
        if (s < 2) { say("cv_lupo", "[ride] Non è il momento, capitano. Prima parlate con chi parla."); return done(); }
        say("cv_lupo", "[serio] Vi ho scritto io. Trecento scudi e il ponte aperto. È un tradimento, lo so. Ma a volte il tradimento è il solo modo di dare pane a chi non ha niente.");
        say("cv_lupo", `Avete ${clues()}/3 indizi, ${CR.field().length} in campo. Che risposta ho?`);
        ask("Corvo aspetta la tua risposta.", [
          { label: "Resto col Conte", sub: "Battaglia contro il Lupo. Onore -1, scudi +50", fn: () => viaConte() },
          { label: "Apro il ponte al Lupo", sub: "Battaglia contro le guardie. Scudi +40", fn: () => viaLupo() },
          { label: "Doppio gioco: un accordo", sub: "2 indizi + Ingegno e Cuore in campo ≥ 8", big: true, cls: "hot", fn: () => accordo() },
          { label: "⚔️ Schiera la compagnia", sub: "Cambia chi va in campo", fn: () => CR.pick(K.done, true) },
          { label: "Torno più tardi", fn: K.done }
        ]);
      }
    };
    const obj = {
      Y() { say("voce", "Avvisi della Fiera: «Si cerca gallo che canti a mezzogiorno.» «Si ringrazia chi ha restituito la ruota.» «Il grano è in arrivo. Fonte: il Conte.» (Sotto, con altra grafia: «Da dove?»)"); done(); },
      U() { say("voce", "La fontana è in secca. Qualcuno ci ha lasciato un biglietto: «Cercasi pioggia. Astenersi indecisi.»"); done(); }
    };

    const zones = {
      cv_fiera: {
        region: "borgo", name: "Fiera d'Autunno", short: "Fiera", sub: "Bancarelle, zucche, un granaio col lucchetto nuovo", bg: "cv_borgo", time: "giorno",
        w: 32, h: 20, start: [2, 10], items: [[6, 15], [27, 16]],
        areas: [[0, 0, 31, 19, "La Fiera d'Autunno di Pietrabianca"]],
        npcs: (s) => [{ id: "cv_marta", at: [11, 9] }, { id: "cv_bertoldo", at: [20, 12] }].concat(s >= 1 ? [{ id: "cv_oddone", at: [15, 11] }] : []),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 19, 31, 19, "t"); lay(0, 0, 0, 19, "t"); lay(31, 0, 31, 19, "t");
          lay(1, 9, 30, 11, "+"); lay(14, 5, 17, 18, "+");
          [[8, 6], [9, 6], [20, 6], [21, 6]].forEach(([x, y]) => put(x, y, "Z"));
          [[24, 13], [25, 13]].forEach(([x, y]) => put(x, y, "C"));
          [[12, 14], [13, 14], [3, 15], [28, 8]].forEach(([x, y]) => put(x, y, "E"));
          put(16, 11, "U"); put(6, 13, "Y");
          house(4, 2, 6, 4, { door: [6, 5], roof: "#7c2d12", enter: { room: "locanda", name: "La Botte Piena", who: (s) => (s <= 2 ? ["cv_lupo"] : []) } });
          house(24, 2, 6, 4, { door: [26, 5], roof: "#6b4a2a", enter: "Il granaio del Conte. Il lucchetto è nuovo, di ferro, e sul portone c'è scritto «PIENO» in lettere troppo grandi. Dalla fessura vedi sacchi fino al soffitto." });
          house(0, 9, 1, 3, { door: [0, 10], enter: { to: "cv_borgo", at: [29, 11] } });
          house(31, 9, 1, 3, { door: [31, 10], enter: { to: "cv_bosco", at: [2, 9] } });
        }
      },
      cv_bosco: {
        region: "casa", name: "Il Bosco dei Corvi", short: "Bosco", sub: "Un falò, tre tende e un capitano che aspetta", bg: "cv_campo", time: "notte",
        w: 28, h: 18, start: [2, 9], items: [[5, 14], [24, 5]],
        areas: [[0, 0, 27, 17, "Il bosco dove il Lupo Grigio aspetta la tua risposta"]],
        npcs: (s) => [{ id: "cv_lupo", at: [17, 9] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, ":"); put(19, 9, "F"); put(21, 4, "P"); put(24, 4, "P"); put(21, 14, "P"); put(24, 14, "P"); put(6, 13, "C"); put(7, 13, "C");
          [[4, 3], [8, 5], [11, 14], [14, 4], [14, 15], [3, 15], [24, 9]].forEach(([x, y]) => put(x, y, "t"));
          house(0, 8, 1, 3, { door: [0, 9], enter: { to: "cv_fiera", at: [29, 10] } });
        }
      }
    };
    return {
      n: N, title: "L'Autunno dei Contratti Doppi", sub: "Due lettere, un granaio e un lucchetto nuovo",
      goal, start: "cv_campo", introBg: "cv_titolo", zones, talk, obj,
      patch: { cv_borgo: { build(L) { L.house(31, 10, 1, 3, { door: [31, 11], enter: { to: "cv_fiera", at: [1, 10] } }); } } },
      intro: [["voce", "Autunno 1427. Il vento porta foglie e lettere."], ["voce", "Le lettere sono due, e nessuna delle due ha il suo vero scopo scritto sopra."]]
    };
  }

  boot();
})();
