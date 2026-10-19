// js/capitani-c2.js - «CAPITANI DI VENTURA» · Capitolo 2: L'Estate dei Contratti
// Castello del Conte Ruggero: due contratti a scelta (Torre dei Corvi o Scorta del Grano), tre nuovi compagni, battaglia con
// il motore SCHIERE (js/capitani-schiere.js), un prigioniero e tre finali di capitolo. Segue un capitolo 3 provvisorio.
(function () {
  "use strict";
  function boot() {
    const E = window.__capitaniCore;
    if (!E || !E.api || !E.api.addChapter || !window.__schiere) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
    E.api.addChapter(chapter3);
  }
  const SHORT = { cv_isotta: "Isotta", cv_ambrogio: "Ambrogio", cv_brenno: "Brenno", cv_piccarda: "Piccarda", cv_tancredi: "Tancredi", cv_gemma: "Gemma", cv_dario: "Dario", cv_cunegonda: "Cunegonda", cv_letizia: "Letizia", cv_piero: "Piero", cv_zanna: "Zanna", cv_pellegrino: "Pellegrino", cv_ilaria: "Ilaria", cv_fulvio: "Fulvio", cv_tiburzio: "Tiburzio" };

  function chapter2(K) {
    const { setStep, quest, F } = K;
    const N = 2, S = () => K.stepOf(N), CR = K.crew, PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const gold = (n) => K.bond("scudi", n);
    const join = (id, txt) => { if (txt) say(id, txt); if (CR.recruit(id)) say("voce", `<b>${K.esc(CR.members[id].n)}</b> si unisce alla Rondine Scalza. (${CR.count()}/${CR.total})`); };

    K.cast("cv_conte", { name: "Conte Ruggero", sub: "Signore di Pietrabianca", style: "slick", hair: "#8a8a8a", beard: "folta", acc: ["corona"], skin: "#e0b890", eye: "#2a2a2a", shirt: "#1d4ed8", bg: ["#1e3a8a", "#fde68a"] }, "Governa Pietrabianca da trent'anni e ha pagato un mercenario solo due volte. Una era la tua.");
    K.cast("cv_ilaria", { name: "Ilaria la Medica", sub: "Infermeria del castello", style: "braids", hair: "#3a2a1a", acc: ["grembiule"], skin: "#e0b890", eye: "#2a6a3a", shirt: "#166534", bg: ["#14532d", "#bbf7d0"] }, "Cuce i feriti e rimprovera i sani. Giura di non avere preferiti, e ha una brutta calligrafia nel mentire.");
    K.cast("cv_fulvio", { name: "Messer Fulvio", sub: "Mercante ambulante", style: "ordinato", hair: "#2a1a10", beard: "pizzetto", acc: ["borsa"], skin: "#d9a679", eye: "#3a2a1a", shirt: "#7c2d12", bg: ["#7c2d12", "#fde68a"] }, "Vende anche il tempo. Lo fa pagare a ore, ma in anticipo.");
    K.cast("cv_tiburzio", { name: "Tiburzio il Tamburino", sub: "Ritmo della truppa", style: "spiky", hair: "#c2410c", acc: ["berretto"], skin: "#c68642", eye: "#3a2a1a", shirt: "#a16207", bg: ["#78350f", "#fcd34d"] }, "Suona un tamburo che si sente fino al confine. Sta provando una versione silenziosa, finora senza risultati.");
    K.cos("cv_c2", { kind: "shirt", label: "Cotta del Conte", val: "#1e3a8a", from: "Capitolo 2 di Capitani di Ventura" });
    K.lore("l_schiere", { t: "Le Schiere", d: "Nelle battaglie di compagnia si schierano pochi capitani: chi difende un assalto, chi attacca. Il Conte ha una regola: le Schiere non toccano i civili. Il Lupo Grigio ha un'altra regola: quale regola?" });

    const path = () => F.get("cv2_path", "");
    const goal = (s) => ({
      0: "Parla con Isotta all'accampamento: il Conte ci convoca.",
      1: "Vai al Castello (porta a nord di Pietrabianca) e parla con il Conte Ruggero, nella sala.",
      2: path() === "assedio" ? "Prepara la compagnia (Ilaria, Fulvio e Tiburzio sono nel cortile). Poi Ser Oddone: Torre dei Corvi." : "Prepara la compagnia (Ilaria, Fulvio e Tiburzio sono nel cortile). Poi Ser Oddone: Scorta del Grano."
    }[s] || "Il Capitolo 2 è concluso. Il capitolo 3 è in arrivo.");

    function battle() {
      const field = CR.field(), mem = field.map((id) => Object.assign({ id }, CR.members[id], { n: SHORT[id] }));
      const hard = path() === "assedio";
      const enemy = hard ? { name: "Lupo Grigio · Torre dei Corvi", icon: "🐺", atk: [5, 0.7], def: [5, 0.6] } : { name: "Banditi del Lupo · Imboscata", icon: "🗡️", atk: [4, 0.5], def: [4, 0.5] };
      say("cv_oddone", hard ? "[serio] Ai merli. Un assalto per volta; chi difende non attacca, chi attacca non difende. È tutto qui. È difficilissimo." : "[serio] Carri pieni, strada stretta. Chi difende i carri non attacca. Chi attacca non difende i carri. Regola semplice, mestiere scomodo.");
      K.say(flush(), () => K.ownMatch(window.__schiere.start, {
        members: mem, enemy, rounds: hard ? 7 : 6, bg: "cv_ponte", title: "Capitani di Ventura",
        done: (r) => {
          if (!r.win) return K.scene([["cv_oddone", "[triste] Il campo è loro, per ora. Rimettete in ordine la compagnia: cambiate chi attacca e chi difende."]], () => K.enterZone("cv_castello"), "cv_castello");
          afterWin(hard);
        }
      }));
    }
    function afterWin(hard) {
      setStep(N, 3);
      K.scene([
        ["voce", hard ? "La Torre dei Corvi tace. Dal merlo più alto cade una bandiera grigia, poi un elmo, poi un cuoco in fuga." : "Il grano passa. Due carri hanno una ruota in più, un terzo ha una ruota in meno, e va bene così."],
        ["cv_ilaria", "[pensa] Uno dei loro, giovane, non scappa: è in ginocchio e perde sangue dalla spalla. Tace per educazione."],
        ["cv_brenno", "[triste] Capitano... decidi tu. Io non so come si chiede scusa a uno che ci ha attaccati."]
      ], () => K.ask("voce", "Un prigioniero ferito del Lupo Grigio. Cosa decidi?", [
        { label: "Lo curi e lo lasci andare", sub: "Onore +2", big: true, fn: () => { K.bond("onore", 2); K.reward("cv_c2a", { coins: hard ? 140 : 70, cos: "cv_c2" }); fin("clemenza", ["cv_ilaria", "[felice] Si chiamava Matteo. Ha detto «grazie» tre volte. Uno è bastato."]); } },
        { label: "Chiedi il riscatto", sub: "Scudi +30, Fama +1", big: true, fn: () => { gold(30); K.bond("fama", 1); K.reward("cv_c2b", { coins: hard ? 180 : 90, cos: "cv_c2" }); fin("riscatto", ["cv_isotta", "[ride] Segnato: «Matteo, prigioniero, attivo». Una voce positiva, finalmente."]); } },
        { label: "Lo arruoli", sub: "Fama +2, onore -1", big: true, fn: () => { K.bond("fama", 2); K.bond("onore", -1); K.reward("cv_c2c", { coins: hard ? 150 : 80, cos: "cv_c2" }); fin("arruola", ["cv_dario", "[ride] Un ex nemico nel coro! Questa la canto subito."]); } }
      ]), "cv_castello");
    }
    function fin(end, extra) {
      K.finishChapter(N, end);
      K.scene([extra, ["voce", `<b>FINE DEL CAPITOLO 2.</b> La Rondine Scalza è ora ${CR.count()} compagni. L'estate è finita, e con lei i contratti facili.`], ["voce", "Il Capitolo 3, «L'Autunno dei Contratti Doppi», è in arrivo."]], () => K.openMain(), "cv_titolo");
    }

    const talk = {
      cv_isotta() {
        const s = S();
        if (s === 0 && K.inZone("cv_campo")) {
          say("cv_isotta", "[ride] Capitano. L'avena è finita, ma è arrivata una lettera del Conte.");
          say("cv_isotta", "«Presentatevi al Castello. Con la compagnia. Con le scarpe, possibilmente.» Il Castello è a nord di Pietrabianca. Il portone è alto, la gente è bassa: fatevi coraggio.");
          setStep(N, 1);
          quest("cv_c2_conte", "La convocazione del Conte", "Vai al Castello (nord di Pietrabianca) e parla con il Conte Ruggero.");
          return done();
        }
        if (s === 1 && K.inZone("cv_campo")) { say("cv_isotta", "Il Castello è a nord del borgo. Non farlo aspettare: il Conte aspetta male."); return done(); }
        return PASS;
      },
      cv_conte() {
        const s = S();
        if (s === 0) { say("cv_conte", "Non vi ho ancora convocati. Torni dal campo con una lettera, capitano."); return done(); }
        if (s >= 2) { say("cv_conte", path() === "assedio" ? "La Torre dei Corvi non aspetta. Ser Oddone vi guida, nel cortile." : "Il grano non aspetta. Ser Oddone vi guida, nel cortile."); return done(); }
        if (s >= 3) { say("cv_conte", "Siete stati utili. Non è un complimento: è un'osservazione."); return done(); }
        say("cv_conte", "[serio] Capitano della Rondine Scalza. Il ponte ha tenuto. Mi hanno detto che qualcuno ha pianto, ma non so chi.");
        say("cv_conte", "Due contratti. Il primo: la Torre dei Corvi, a nord. Il Lupo Grigio l'ha occupata. Paga: grande, rischio: idem. Il secondo: scortare il grano del villaggio fino al mulino. Paga: piccola, rischio: piccolo, soddisfazione: media.");
        ask("Quale contratto firmi?", [
          { label: "La Torre dei Corvi", sub: "Più difficile. Paga alta", big: true, fn: () => { F.set("cv2_path", "assedio"); K.bond("fama", 1); say("cv_conte", "[serio] Bene. Il Lupo è un cane che morde, ma non sa leggere i contratti. Ser Oddone vi aspetta nel cortile."); setStep(N, 2); K.learnLore("l_schiere"); quest("cv_c2_batt", "La Torre dei Corvi", "Prepara la compagnia nel cortile. Poi parla con Ser Oddone."); done(); } },
          { label: "La Scorta del Grano", sub: "Più facile. Paga bassa", big: true, fn: () => { F.set("cv2_path", "grano"); K.bond("onore", 1); say("cv_conte", "[felice] Saggia scelta. Il grano non dimentica chi lo protegge. Ser Oddone vi aspetta nel cortile."); setStep(N, 2); K.learnLore("l_schiere"); quest("cv_c2_batt", "La Scorta del Grano", "Prepara la compagnia nel cortile. Poi parla con Ser Oddone."); done(); } }
        ]);
      },
      cv_oddone() {
        const s = S();
        if (!K.inZone("cv_castello") || s < 2) return PASS;
        if (s >= 3) { say("cv_oddone", "Il Conte è soddisfatto. Io quasi: è la mia massima espressione."); return done(); }
        const n = CR.field().length;
        say("cv_oddone", `[serio] Siete ${CR.count()} in rosa, ${n} in campo. Nella Schiera ogni compagno va su un assalto o all'attacco: il registro dice chi vale cosa.`);
        ask("Siete pronti?", [
          { label: "⚔️ Schiera la compagnia", sub: "Chi va in campo e chi guarda", cls: "hot", fn: () => CR.pick(K.done, true) },
          { label: "Sì, andiamo", big: true, fn: () => battle() },
          { label: "Un momento", fn: K.done }
        ]);
      },
      cv_ilaria() {
        if (CR.has("cv_ilaria")) { say("cv_ilaria", "[pensa] Siete già tutti interi? Peccato. Chiamatemi se vi rompete."); return done(); }
        say("cv_ilaria", "[serio] Ho un ragazzo con una gamba sbagliata e nessuno che regga la bacinella. Siete voi la compagnia?");
        ask("Ilaria ha bisogno di una mano.", [
          { label: "Reggi la bacinella", sub: "Cuore", fn: () => { K.bond("onore", 1); join("cv_ilaria", "[felice] Mani ferme. Io vengo con voi: qualcuno dovrà cucirvi."); done(); } },
          { label: "Paghi le erbe (10 scudi)", sub: `Hai ${K.stat("scudi")} scudi`, fn: () => { if (K.stat("scudi") < 10) { say("cv_ilaria", "[triste] Non basta, torna con il resto."); return done(); } gold(-10); join("cv_ilaria", "[ride] Con le erbe, il ragazzo vive. Con me, anche voi."); done(); } }
        ]);
      },
      cv_fulvio() {
        if (CR.has("cv_fulvio")) { say("cv_fulvio", "Ogni prezzo si può trattare. Soprattutto quelli che non si possono."); return done(); }
        say("cv_fulvio", "[ride] Messer Fulvio, sono io. Ho una sella da vendere. Anzi, ne ho due. Il compratore, però, mi serve intero.");
        ask("Fulvio ti guarda come un cliente.", [
          { label: "Tratti il prezzo", sub: "Ingegno. Rischio", fn: () => { if (K.stat("fama") >= 1 || Math.random() < 0.5) join("cv_fulvio", "[felice] Ho perso. Ottimo: significa che siete bravi. Vi seguo e vi sconto le promesse."); else { say("cv_fulvio", "[ride] Vi ho fregati, ma con affetto. Riprovate."); } done(); } },
          { label: "Gli offri una quota dei contratti", sub: "Scudi -5", fn: () => { if (K.stat("scudi") < 5) { say("cv_fulvio", "[triste] Una quota di niente è niente."); return done(); } gold(-5); join("cv_fulvio", "[felice] Una quota! Vi seguo. Le selle le porto io."); done(); } }
        ]);
      },
      cv_tiburzio() {
        if (CR.has("cv_tiburzio")) { say("cv_tiburzio", "[felice] Ho una nuova cadenza. Dura quattro ore. Si adatta!"); return done(); }
        say("cv_tiburzio", "[ride] TUM-TUM. Scusa. TUM. Non riesco a fermarmi. Sono un tamburino senza pubblico.");
        ask("Tiburzio batte il tempo a vuoto.", [
          { label: "Gli dai il ritmo di marcia", sub: "Una mano", fn: () => { join("cv_tiburzio", "[felice] Una marcia! Posso batterla ovunque. Vengo con voi."); done(); } },
          { label: "Gli compri nuove bacchette (5 scudi)", sub: `Hai ${K.stat("scudi")} scudi`, fn: () => { if (K.stat("scudi") < 5) { say("cv_tiburzio", "[triste] Cinque scudi. Non ho tempo di aspettare."); return done(); } gold(-5); join("cv_tiburzio", "[ride] Bacchette nuove! Mi unisco: sono il vostro tempo."); done(); } }
        ]);
      }
    };

    const obj = {
      Y() { say("voce", "Avviso del Conte: «Chi taglia la legna nel parco, la riporta. Chi la riporta, la ripianta.»"); done(); },
      U() { say("voce", "La fontana del cortile. Sul bordo, qualcuno ha scritto «Isotta paga» e qualcuno ha corretto «Isotta chiede»."); done(); }
    };

    const zones = {
      cv_castello: {
        region: "borgo", name: "Castello di Pietrabianca", short: "Castello", sub: "Cortile, sala del Conte, infermeria e un'armeria chiusa per inventario", bg: "cv_borgo", time: "giorno",
        w: 30, h: 22, start: [15, 19], items: [[3, 12], [26, 16]],
        areas: [[0, 0, 29, 21, "Il cortile del Castello del Conte Ruggero"]],
        npcs: () => [{ id: "cv_oddone", at: [15, 16] }, { id: "cv_fulvio", at: [9, 12] }, { id: "cv_tiburzio", at: [22, 12] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 21, "a"); lay(1, 1, 28, 20, "+"); lay(14, 1, 16, 20, ":");
          put(15, 12, "U"); put(8, 10, "Z"); put(9, 10, "Z"); put(10, 10, "E"); put(7, 14, "A"); put(8, 14, "A"); put(21, 14, "A"); put(13, 8, "V"); put(17, 8, "V"); put(25, 11, "Y");
          [[2, 9], [27, 9], [3, 17], [26, 18]].forEach(([x, y]) => put(x, y, "E"));
          house(12, 2, 7, 5, { door: [15, 6], roof: "#7f1d1d", enter: { room: "ufficio", name: "Sala del Conte", who: ["cv_conte"] } });
          house(3, 3, 5, 4, { door: [5, 6], roof: "#9a8a6a", enter: { room: "casa", name: "Infermeria", who: ["cv_ilaria"] } });
          house(22, 3, 5, 4, { door: [24, 6], roof: "#475569", enter: "L'armeria è chiusa per inventario. Da tre anni. La cosa non sembra preoccupare nessuno, tranne chi tiene l'inventario." });
          house(14, 21, 3, 1, { door: [15, 21], enter: { to: "cv_borgo", at: [15, 2] } });
        }
      }
    };

    return {
      n: N, title: "L'Estate dei Contratti", sub: "Un castello, due contratti e una battaglia a schiere",
      goal, start: "cv_campo", introBg: "cv_titolo", zones, talk, obj,
      patch: {
        cv_borgo: {
          build(L) { const { lay, house } = L; lay(15, 1, 15, 4, "+"); house(14, 0, 3, 1, { door: [15, 0], enter: { to: "cv_castello", at: [15, 20] } }); },
          npcs: (s, list) => list.filter((n) => n.id !== "cv_oddone")
        },
        cv_ponte: { npcs: (s, list) => list.filter((n) => n.id !== "cv_lupo" && n.id !== "cv_oddone") }
      },
      intro: [["voce", "Estate 1427. Il ponte ha tenuto, e al borgo qualcuno ha cominciato a chiamarvi «i Rondinelli»."], ["voce", "Per il Conte, forse, è un complimento."]]
    };
  }

  function chapter3() {
    return {
      n: 3, title: "L'Autunno dei Contratti Doppi", sub: "In arrivo",
      goal: () => "Il Capitolo 3 è in arrivo.", start: "cv_campo", introBg: "cv_titolo", zones: {}, talk: {}, obj: {},
      intro: [["voce", "Il Capitolo 3, «L'Autunno dei Contratti Doppi», è in arrivo."]]
    };
  }

  boot();
})();
