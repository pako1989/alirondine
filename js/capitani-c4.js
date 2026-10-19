// js/capitani-c4.js - «CAPITANI DI VENTURA» · Capitolo 4: L'Inverno del Capitano (finale)
// Il Conte offre un incarico fisso, il Duca di Roccaferrea scende dal Valico. Battaglia finale a Schiere: se hai stretto un accordo
// (o aperto il ponte) del capitolo 3, Corvo combatte con te. Tre finali: Capitano del Conte, La Rondine Scalza, La Rondine Leggendaria.
(function () {
  "use strict";
  function boot() {
    const E = window.__capitaniCore;
    if (!E || !E.api || !E.api.addChapter || !window.__schiere) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  const SHORT = { cv_isotta: "Isotta", cv_ambrogio: "Ambrogio", cv_brenno: "Brenno", cv_piccarda: "Piccarda", cv_tancredi: "Tancredi", cv_gemma: "Gemma", cv_dario: "Dario", cv_cunegonda: "Cunegonda", cv_letizia: "Letizia", cv_piero: "Piero", cv_zanna: "Zanna", cv_pellegrino: "Pellegrino", cv_ilaria: "Ilaria", cv_fulvio: "Fulvio", cv_tiburzio: "Tiburzio" };

  function chapter4(K) {
    const { setStep, quest, F } = K;
    const N = 4, S = () => K.stepOf(N), CR = K.crew, PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const ally = () => ["accordo", "lupo"].includes(F.get("cv3_path", ""));

    K.cast("cv_araldo", { name: "Araldo del Duca", sub: "Roccaferrea", style: "ordinato", hair: "#1a1a1a", beard: "pizzetto", acc: ["corona"], skin: "#e0b890", eye: "#2a2a2a", shirt: "#7f1d1d", bg: ["#450a0a", "#fecaca"] }, "Annuncia le battaglie con una voce che, sul campo, sembra più sicura del Duca.");
    K.cos("cv_c4", { kind: "shirt", label: "Mantello d'Inverno della Rondine", val: "#e5e7eb", from: "Capitolo 4 di Capitani di Ventura" });
    K.lore("l_valico", { t: "Il Valico di Roccaferrea", d: "L'unica strada tra la pianura del Conte e le terre del Duca. D'inverno la neve la chiude. Quest'anno, anche i debiti." });

    const goal = (s) => ({
      0: "Parla con Isotta all'accampamento: è arrivato l'inverno, e con lui il Duca.",
      1: "Vai al Castello, parla con il Conte nella sala. Poi il Valico (porta est del cortile).",
      2: "Al Valico di Roccaferrea: parla con i compagni al falò e poi con l'Araldo del Duca."
    }[s] || "La storia è conclusa. Rivivi i finali dal Registro.");

    function battle() {
      const field = CR.field(), mem = field.map((id) => Object.assign({ id }, CR.members[id], { n: SHORT[id] }));
      if (ally()) mem.splice(4, 1, { id: "cv_lupo", n: "Corvo", icon: "🐺", role: "Alleato", s: { tiro: 3, forza: 2, cuore: 1 } });
      say("cv_araldo", "[serio] Il Duca di Roccaferrea reclama il Valico. Il Conte lo nega. Gli altri, dicono, devono decidere. Si combatte alla vecchia maniera.");
      K.say(flush(), () => K.ownMatch(window.__schiere.start, {
        members: mem.slice(0, 5), enemy: { name: "Esercito del Duca · Valico", icon: "🏔️", atk: [ally() ? 6 : 7, 0.8], def: [6, 0.7] }, rounds: 8, bg: "cv_ponte", title: "Capitani di Ventura",
        done: (r) => (r.win ? afterWin() : K.scene([["voce", "La neve copre il campo. Il Duca avanza di un passo. Rimettete in ordine la compagnia e riprovate."]], () => K.enterZone("cv_valico"), "cv_valico"))
      }));
    }
    function afterWin() {
      setStep(N, 3);
      const off = F.get("cv4_off", "rifiuta");
      const end = off === "accetta" ? "capitano" : (K.stat("onore") >= 5 && CR.count() >= 12 ? "leggenda" : "libera");
      const txt = {
        capitano: [["cv_conte", "[serio] Capitano del Conte. Suona bene. E vi pago bene, finché non sbaglierete. Che accadrà."], ["cv_isotta", "[ride] Segnato: stipendio fisso. Ho pianto in modo contabile, di gioia."]],
        libera: [["cv_isotta", "[pensa] Libera, e con i debiti di prima. Qualcuno dice che sono l'unica cosa onesta che abbiamo."], ["cv_dario", "[ride] Ho già la ballata. Titolo provvisorio: «Senza Scarpe Uguali»."]],
        leggenda: [["cv_dario", "[felice] Non scrivo più ballate. Le scrive la gente."], ["cv_isotta", "[felice] Segno una voce nuova nel bilancio: «Fama». Non so ancora come si somma."], ["cv_pellegrino", "[serio] Credo di sapere dove stavo andando. Ci sono arrivato."]]
      }[end];
      K.reward("cv_c4" + end, { coins: end === "capitano" ? 300 : end === "leggenda" ? 400 : 200, cos: "cv_c4" });
      K.finishChapter(N, end); K.end(end);
      K.scene(txt.concat([["voce", `<b>FINE DELLA STORIA · ${end === "capitano" ? "Capitano del Conte" : end === "leggenda" ? "La Rondine Leggendaria" : "La Rondine Scalza"}</b><br>${CR.count()} compagni, ${K.stat("onore")} di Onore. Altri finali sono nel Registro.`]]), () => K.openMain(), "cv_titolo");
    }

    const talk = {
      cv_isotta() {
        const s = S();
        if (s === 0 && K.inZone("cv_campo")) {
          say("cv_isotta", "[pensa] Capitano. Inverno. La buona notizia: il fuoco è acceso. La cattiva: è il solo che abbiamo pagato.");
          say("cv_isotta", "Il Duca di Roccaferrea scende dal Valico con duecento uomini. Il Conte ci convoca al Castello. Lui offre qualcosa che non ho mai visto: uno stipendio.");
          setStep(N, 1); K.learnLore("l_valico");
          quest("cv_c4_conte", "L'incarico del Conte", "Vai al Castello e parla con il Conte nella sala. Poi il Valico (porta est del cortile).");
          return done();
        }
        if (s === 1 && K.inZone("cv_campo")) { say("cv_isotta", "Il Castello è a nord di Pietrabianca. Io sto qui, a tenere il fuoco. E i conti."); return done(); }
        return PASS;
      },
      cv_conte() {
        const s = S();
        if (s < 1) return PASS;
        if (s >= 2) { say("cv_conte", F.get("cv4_off") === "accetta" ? "Siete il mio Capitano. Fatemi onore al Valico." : "Il Valico è a est del cortile. Che sia con o senza la mia bandiera."); return done(); }
        say("cv_conte", "[serio] Capitano. Il Duca scende. Duecento uomini, neve e una lettera di intenti. Ho bisogno di qualcuno che tenga il Valico.");
        say("cv_conte", "Vi offro il titolo di Capitano del Conte di Pietrabianca: stipendio fisso, uniformi, stalla. In cambio, la Compagnia non firma più contratti con altri.");
        ask("Il Conte attende la tua risposta.", [
          { label: "Accetto l'incarico", sub: "Stipendio fisso. Niente più contratti liberi", big: true, fn: () => { F.set("cv4_off", "accetta"); K.bond("scudi", 20); say("cv_conte", "[felice] Bene. Il Valico è a est del cortile."); setStep(N, 2); quest("cv_c4_valico", "Il Valico", "Porta est del cortile del Castello: il Valico di Roccaferrea."); done(); } },
          { label: "Rifiuto: la Rondine resta libera", sub: "Si combatte lo stesso, ma a nostro nome", big: true, fn: () => { F.set("cv4_off", "rifiuta"); K.bond("onore", 1); say("cv_conte", "[serio] Libera. Hm. Sarà più difficile pagarvi. Ma il Valico non cambia: a est del cortile."); setStep(N, 2); quest("cv_c4_valico", "Il Valico", "Porta est del cortile del Castello: il Valico di Roccaferrea."); done(); } }
        ]);
      },
      cv_ambrogio() {
        if (!K.inZone("cv_valico")) return PASS;
        say("cv_ambrogio", "[felice] Zuppa di ceci con neve. L'ingrediente segreto è non dire che è neve.");
        done();
      },
      cv_dario() {
        if (!K.inZone("cv_valico")) return PASS;
        say("cv_dario", "[ride] Ho scritto una strofa nuova: «E se la neve cade, cade anche l'avversario.» Non è poesia: è tattica.");
        done();
      },
      cv_pellegrino() {
        if (!K.inZone("cv_valico")) return PASS;
        if (F.is("cv4_pell")) { say("cv_pellegrino", "Resto qui, se non vi dispiace. Ho trovato qualcuno che mi ascolta."); return done(); }
        say("cv_pellegrino", "[serio] Capitano. Ho camminato per molti inverni verso un posto che non ricordo. Stanotte credo di averlo sentito nominare: era una porta e un falò.");
        ask("Il Pellegrino ti guarda e aspetta.", [
          { label: "Gli offri un posto al falò", sub: "Onore +1", fn: () => { F.set("cv4_pell", true); K.bond("onore", 1); say("cv_pellegrino", "Grazie. Non so dove vado, ma ora so con chi."); done(); } },
          { label: "Gli dici di riposare", sub: "Un gesto cortese", fn: () => { F.set("cv4_pell", true); say("cv_pellegrino", "Sì. Riposo. Domani, forse, un posto."); done(); } }
        ]);
      },
      cv_araldo() {
        const s = S();
        if (!K.inZone("cv_valico") || s < 2) return PASS;
        if (s >= 3) { say("cv_araldo", "Il Duca si ritira. Non lo scriverò: la rima non regge."); return done(); }
        say("cv_araldo", `[serio] La Rondine Scalza? Il Duca mi ha detto di dirvi che apprezza il coraggio. E che lo userà.`);
        say("cv_araldo", ally() ? "Vedo che Corvo è con voi. Il Duca non lo sapeva. Adesso lo sa, e non è contento." : "Siete soli, a quanto vedo. Il Duca apprezza anche questo.");
        ask("L'Araldo attende il tuo segnale.", [
          { label: "⚔️ Schiera la compagnia", sub: "Chi va in campo", cls: "hot", fn: () => CR.pick(K.done, true) },
          { label: "Sì, si combatte", big: true, fn: () => battle() },
          { label: "Un momento", fn: K.done }
        ]);
      }
    };
    const obj = {
      "cv_valico:A"() { say("voce", "Lance spezzate nella neve. Qualcuno ci ha appeso una sciarpa. Non è chiaro se per scherzo."); done(); },
      "cv_valico:F"() { say("voce", "Il falò del Valico. L'unico punto del mondo dove si sta vicini senza motivo."); done(); }
    };

    const zones = {
      cv_valico: {
        region: "neve", name: "Il Valico di Roccaferrea", short: "Valico", sub: "Neve, un falò e il Duca in fondo alla strada", bg: "cv_ponte", time: "giorno",
        w: 30, h: 18, start: [2, 10], items: [[5, 14], [26, 4]],
        areas: [[0, 0, 29, 17, "Il Valico, dove la neve ha chiuso le strade e aperto le discussioni"]],
        npcs: () => [{ id: "cv_araldo", at: [24, 10] }, { id: "cv_ambrogio", at: [9, 12] }].concat(CR.has("cv_dario") ? [{ id: "cv_dario", at: [12, 12] }] : []).concat(CR.has("cv_pellegrino") ? [{ id: "cv_pellegrino", at: [11, 13] }] : []),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 17, 29, 17, "t"); lay(0, 0, 0, 17, "t"); lay(29, 0, 29, 17, "t");
          lay(1, 9, 28, 11, ":"); put(10, 14, "F"); put(6, 4, "P"); put(9, 4, "P"); put(20, 5, "A"); put(21, 5, "A"); put(24, 14, "C"); put(25, 14, "C"); put(14, 4, "V");
          [[3, 3], [4, 15], [16, 15], [20, 15], [27, 8], [26, 3]].forEach(([x, y]) => put(x, y, "t"));
          house(0, 9, 1, 3, { door: [0, 10], enter: { to: "cv_castello", at: [27, 15] } });
        }
      }
    };
    return {
      n: N, title: "L'Inverno del Capitano", sub: "Un incarico, un Duca e un Valico innevato",
      goal, start: "cv_campo", introBg: "cv_titolo", zones, talk, obj,
      patch: { cv_castello: { build(L) { L.house(29, 14, 1, 3, { door: [29, 15], enter: { to: "cv_valico", at: [1, 10] } }); } } },
      intro: [["voce", "Inverno 1427. La neve copre il campo e le stesse parole."], ["voce", "Il Duca scende dal Valico. Tu, Capitano, hai ancora due scarpe, o quasi."]]
    };
  }
  boot();
})();
