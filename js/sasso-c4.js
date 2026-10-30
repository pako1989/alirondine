// js/sasso-c4.js - «SETTE PER SASSO NERO» · Capitolo 4: Tre notti
// Il riso è tagliato. Corvo Rosso manda i suoi tre notti di fila. Ogni notte si assegnano le porte (Il Piano) e si gioca «L'Ultima Notte»:
// una porta che cade perde le sue costruzioni e ferisce chi la difendeva; due ferite e un compagno non torna (una guaritrice viva ne salva uno a notte).
// Fra la prima e la seconda notte, l'incursione al campo dei predoni: i prigionieri, la moglie di Rikichi, il ragazzo dei cavalli.
// Prima della seconda notte, Ren: se il legame è debole, apre una porta a Corvo. Zone: villaggio (al tramonto, con chi c'è ancora), il campo dei predoni (30x22).
(function () {
  "use strict";
  function boot() {
    const E = window.__sassoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__sassoH || !window.__sassoZ || !E.api._has(3)) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  // le ultime parole di chi cade
  const LAST = {
    sn_kanbei: "Ho perso un'altra battaglia dalla parte giusta. Questa volta... ne valeva la pena. A destra. Guarda bene, a destra.",
    sn_kiku: "Quarantadue frecce. Ne ho tirate quarantuno. L'ultima... dalla a Jirō.",
    sn_gonta: "Sei raccolti dalla parte sbagliata. Uno da quella giusta. Fa sette. Il sette è un buon numero, diceva il vecchio.",
    sn_shino: "La campana. Sentite? Suona. Non piangete: vuol dire che sono passata.",
    sn_hayate: "Ho perso. Adesso so com'è. Non è orribile. È solo... freddo.",
    sn_okuma: "(Okuma canta, piano, la ninna nanna della forgia. Si ferma a metà.)",
    sn_tetsu: "Il mio nome... ditelo giusto, sulla pietra. Tetsu. Solo Tetsu. Samurai.",
    sn_ren: "Il riso... non mi è mai piaciuto. Mi piaceva essere pagato. Voi... pagavate bene.",
    sn_yumi: "Ho ballato per tre signori. Per voi... avrei ballato gratis.",
    sn_masa: "Settant'anni di fiume. La rete stavolta l'ho gettata con gli occhi aperti."
  };
  // le porte cadute perdono le costruzioni e feriscono chi le difendeva; la seconda ferita uccide, una guaritrice viva salva uno a notte
  function wounds(K, H, fell, m) {
    const F = K.F, say = H.say, nm = (id) => K.crew.members[id].n, dead = (id) => F.is("sn_morto_" + id);
    let saved = false;
    fell.forEach((g) => {
      (K.build ? K.build.list(g) : []).forEach((b) => F.set("bd_" + b.site, ""));
      const id = m[g]; if (!id || dead(id) || !K.crew.has(id)) return;
      const w = (F.get("sn_ferite_" + id, 0) | 0) + 1;
      if (w < 2) { F.set("sn_ferite_" + id, w); say("voce", `La ${K.plan.roles[g].n} è caduta. <b>${nm(id)}</b> è ferito: una seconda ferita, e non si rialza.`); return; }
      const healer = H.alive().find((h) => h !== id && K.crew.members[h].pow === "cura");
      if (healer && !saved) { saved = true; F.set("sn_ferite_" + id, 1); say(healer, `[serio] (${nm(healer)} lavora tutta la notte su ${nm(id)}, con le erbe, l'ago e le preghiere.) Vive. Per stavolta. Non chiedetemi di rifarlo stanotte.`); return; }
      F.set("sn_morto_" + id, true); K.crew.leave(id);
      say(id, `[triste] ${LAST[id] || "..."}`); say("voce", `<b>${nm(id)} è caduto alla ${K.plan.roles[g].n}.</b> Lo portano sulla collina, sotto il ciliegio. Una spada piantata nella terra.`);
    });
  }
  window.__sassoWounds = wounds;
  const NIGHTS = {
    1: { title: "La prima delle tre notti", granaio: 24, waves: [[["base", 5]], [["base", 4], ["lesto", 3]], [["scudo", 2], ["base", 4]]] },
    2: { title: "La seconda notte", granaio: 24, waves: [[["base", 6]], [["lesto", 4], ["base", 3]], [["scudo", 3], ["base", 4]], [["capo", 1], ["base", 4]]] },
    3: { title: "La terza notte", granaio: 26, waves: [[["lesto", 5], ["base", 4]], [["scudo", 4], ["base", 5]], [["capo", 1], ["lesto", 4], ["scudo", 2]], [["base", 6], ["lesto", 4]]] }
  };
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__sassoH(K), Z = window.__sassoZ, { say, done, wask, ask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    H.cast("sn_jiro", "Jirō", "Il ragazzo dei cavalli", { style: "messy", hair: "#1c1917", shirt: "#57534e", skin: "#efcfb0", eye: "#1c1917", bg: ["#292524", "#d6d3d1"] }, "Dodici anni, quattro dei quali passati a tenere i cavalli di Corvo Rosso. Al campo lo chiamano «il Muto».");
    H.cast("sn_miyo", "Miyo", "La moglie di Rikichi", { style: "long", hair: "#1c1917", shirt: "#7f1d1d", skin: "#f1d1b0", eye: "#3f2a1a", bg: ["#450a0a", "#fecaca"] }, "Presa dai predoni l'ultimo raccolto. Al villaggio nessuno pronuncia il suo nome.");
    K.cos("sn_c4", { kind: "acc", label: "Elmo di ronin", val: "elmo", from: "Capitolo 4 di Sette per Sasso Nero" });
    K.lore("l_tre", { t: "Le tre notti", d: "Corvo Rosso non attacca mai una notte sola: manda i suoi a ondate, finché il villaggio non ha più fiato. Ogni porta che cade costa una difesa e, spesso, qualcuno." });

    const nm = (id) => K.crew.members[id].n;
    const dead = (id) => F.is("sn_morto_" + id);
    const nights = () => F.get("sn_notte4", 0) | 0;
    const goal = (s) => ({
      0: "Il riso è tagliato. Kanbei aspetta al granaio: stanotte si comincia.",
      1: "Kanbei e Kiku hanno un'idea: andare loro al campo dei predoni, prima della seconda notte. Parla con Kanbei.",
      2: F.is("sn_campo_ok") ? `Torna da Kanbei per la seconda notte. Prima, se vuoi, ricostruisci le difese sui cantieri: 🪵 Legno ${K.stat("legno")}.` : "Al campo dei predoni: libera i prigionieri (il recinto a ovest), trova il ragazzo dei cavalli, poi torna al sentiero (Sud).",
      3: `La terza notte. Ricostruisci quello che è caduto (🪵 Legno ${K.stat("legno")}) e parla con Kanbei.`,
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 4 è concluso.");

    // dopo una notte: le porte cadute perdono le costruzioni e feriscono chi le difendeva
    function esito(n, r, m) {
      const fell = (r.data && r.data.fell) || [];
      F.set("sn_notte4", n); if (r.win) F.set("sn_vinta" + n, true);
      if (!r.win) { K.bond("riso", -3); say("voce", "I predoni arrivano al granaio. Prendono tre sacchi e scappano prima dell'alba, ridendo nel buio."); }
      else say("voce", `L'ultima ondata si ritira verso il passo. ${fell.length ? "Ma non senza danni." : "Le porte hanno retto tutte e quattro."}`);
      wounds(K, H, fell, m);
      const gift = 5; K.bond("legno", gift); say("voce", `All'alba i contadini smontano una stalla per le palizzate: <b>+${gift} 🪵 Legno</b> (${K.stat("legno")}). ${H.stato()}`);
    }
    function night(n, then) {
      const d = K.clock.day(); K.clock.set(d, 3);
      const o = NIGHTS[n];
      K.say(H.flush(), () => K.plan.open({ title: o.title + " · Le Porte", q: `Chi difende quale porta? Feriti: ${H.alive().filter((id) => F.get("sn_ferite_" + id, 0)).map(nm).join(", ") || "nessuno"}. Una porta scoperta cade prima.`, roles: ["n", "e", "s", "o"], pool: H.alive() }, done, true, (m) => {
        H.night({ title: o.title, granaio: o.granaio, waves: o.waves }, (r) => { K.clock.set(d + 1, 0); esito(n, r || {}, m || {}); then(); });
      }));
    }
    // Ren: con un legame debole apre la Porta Ovest a Corvo; con uno forte confessa
    function ren() {
      if (!K.crew.has("sn_ren") || dead("sn_ren") || F.is("sn_ren_scelta")) return;
      F.set("sn_ren_scelta", true);
      if ((K.rel.lv("sn_ren") | 0) >= 2) {
        F.set("sn_ren_fedele", true); K.bond("onore", 1);
        say("sn_ren", "[serio] Una cosa, prima di stanotte. Corvo Rosso mi ha pagato per venire con voi. Per aprire la Porta Ovest, la seconda notte. Stanotte.");
        say("sn_ren", "[furbo] Mi ha pagato meno di voi. E voi mi avete parlato, che è una moneta che non conoscevo. La porta resta chiusa.");
        if (K.crew.has("sn_gonta")) say("sn_gonta", "[pensa] Lo sapevo. Ti avevo visto al campo, due raccolti fa. Non l'ho detto perché aspettavo questo. Bene, ombra.");
        return;
      }
      F.set("sn_ren_tradito", true); K.crew.leave("sn_ren");
      (K.build ? K.build.list("o") : []).forEach((b) => F.set("bd_" + b.site, ""));
      say("voce", "Al tramonto Ren non c'è. Alla Porta Ovest, le palizzate sono state segate alla base, le trappole riempite di terra. Sulla sabbia, un sacchetto di monete col sigillo di un corvo.");
      if (K.crew.has("sn_gonta")) say("sn_gonta", "[arrabbiato] Lo sapevo. L'avevo visto al campo. Dovevo parlare. (Gonta prende a pugni un palo finché sanguina.) Dovevo parlare.");
      say("sn_kanbei", "[serio] Uno si compra, uno si guadagna. Abbiamo comprato quello sbagliato. Ricostruite la Porta Ovest, se c'è tempo. Non c'è tempo.");
    }
    function fin() {
      setStep(N, 4); F.set("sn_c4_done", true);
      const m = K.reward("sn_c4", { coins: 140, cos: "sn_c4" });
      K.finishChapter(N, "ok");
      const vivi = H.alive().length;
      K.scene(H.flush().concat([
        ["sn_kanbei", vivi >= 5 ? "[pensa] Tre notti. Siamo ancora quasi tutti. Non è fortuna: è legno, fossati e gente che non scappa." : "[triste] Tre notti. Conto, e il conto non torna. Ho sempre odiato contare dopo."],
        ["sn_gisaku", "[serio] Corvo Rosso ha perso metà dei suoi. Non scenderà più a ondate. Scenderà lui, con tutti quelli che restano. All'alba, con la pioggia: lui ama la pioggia."],
        ["voce", `<b>FINE DEL CAPITOLO 4 · «Tre notti»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 5 ti aspetta: la pioggia, il mantello rosso e l'alba."]
      ]), () => K.openMain(), "sn_notte");
    }

    const talk = {
      sn_kanbei() {
        if (K.rel.scene("sn_kanbei")) return;
        const s = S();
        if (s === 0) {
          say("voce", "Il riso è tagliato in due giorni di canti e di schiene curve. I covoni sono nel granaio. Sul passo, al tramonto, si accendono quaranta fuochi.");
          say("sn_kanbei", "[serio] Stanotte vengono davvero. Ricordate: una porta che cade perde quello che ci abbiamo costruito, e chi la difende si fa male. Due volte male, e non si rialza.");
          return night(1, () => { setStep(N, 1); quest("sn_c4", "Tre notti", "Reggi tre notti di fila contro i predoni di Corvo Rosso."); done(); });
        }
        if (s === 1) {
          say("sn_kanbei", "[pensa] Abbiamo retto una notte. Adesso facciamo una cosa che Corvo non si aspetta: andiamo noi da lui. Non per combattere. Per prendere.");
          if (K.crew.has("sn_kiku")) say("sn_kiku", "[serio] I prigionieri sono nel recinto a ovest del campo. I cavalli a est. Se Jirō è vivo, è coi cavalli.");
          if (F.is("sn_jiro_pista")) say("sn_kanbei", "L'esploratore che hai risparmiato ci ha detto dov'è il campo, e come entrarci. Il tuo perdono, ronin, adesso è una mappa.");
          return ask("Il campo dei predoni, nella gola del fiume oltre il passo. Partite in pochi, al buio, coi sandali in mano.", [
            { label: "🌙 Andate al campo dei predoni", big: true, cls: "hot", fn: () => { setStep(N, 2); K.clock.set(K.clock.day(), 3); K.say(H.flush().concat([["voce", "Due ore di sentiero al buio. Poi l'odore del fumo, dei cavalli e del riso rubato."]]), () => K.go("sn_accampamento", 15, 19)); } },
            { label: "◂ Fra poco", fn: done }
          ]);
        }
        if (s === 2) {
          if (!F.is("sn_campo_ok")) { say("sn_kanbei", "Il campo prima. Poi la notte."); return done(); }
          ren();
          say("sn_kanbei", "[serio] La seconda notte. Corvo sa che siamo stati da lui. Verrà arrabbiato, e gli arrabbiati sbagliano. Speriamo.");
          return night(2, () => { setStep(N, 3); done(); });
        }
        if (s === 3) { say("sn_kanbei", "[serio] La terza. L'ultima a ondate. Poi verrà lui."); return night(3, () => fin()); }
        say("sn_kanbei", "All'alba, con la pioggia. Dormi, se riesci."); done();
      },
      sn_miyo() {
        if (F.is("sn_miyo_scelta")) { say("sn_miyo", F.is("sn_moglie_salva") ? "[triste] Mi guarderà. Lo so. Fammi solo camminare dietro di te." : "[serio] Vai. Digli che sono morta l'anno scorso. È quasi vero."); return done(); }
        say("voce", "Nel recinto dei prigionieri, fra donne che dormono sedute, una si alza. Ha ancora al collo un nastro rosso, sbiadito.");
        say("sn_miyo", "[sorpreso] Sei di Sasso Nero? No. Sei uno dei samurai. Ho sentito i predoni: «sette ronin e un villaggio di zappe». Ridevano. Non ridono più.");
        say("sn_miyo", "[triste] Rikichi. È vivo? Non dirmelo. Sì, dimmelo. Non posso tornare. Non dopo un anno qui. Non posso guardarlo.");
        return wask("Le altre prigioniere sono già fuori dal recinto. Miyo resta sulla soglia.", [
          { label: "🌾 «Rikichi tiene il tuo pettine appeso al muro. Non chiede niente. Aspetta.»", big: true, w: { pieta: 2 }, fn: () => { F.set("sn_miyo_scelta", true); F.set("sn_moglie_salva", true); say("sn_miyo", "[triste] Il pettine. Quello rotto. (Miyo si copre la faccia con le mani. Poi esce dal recinto.)"); done(); } },
          { label: "🗡️ «Nessuno ti porta via due volte. Scegli tu.»", big: true, w: { onore: 2 }, fn: () => { F.set("sn_miyo_scelta", true); F.set("sn_moglie_resta", true); say("sn_miyo", "[serio] Allora scelgo io. Resto. Qualcuno deve aprire il recinto anche la prossima volta. (Ti dà il nastro rosso.) Questo, a lui. Niente parole."); done(); } }
        ]);
      },
      sn_jiro() {
        if (F.is("sn_jiro_salvo")) { say("sn_jiro", "[felice] (Jirō tiene per la briglia il cavallo più nero del campo. Non parla. Sorride.)"); return done(); }
        if (F.is("sn_jiro_no")) { say("voce", "Il ragazzo dei cavalli non c'è più. Solo le briglie, appese a un palo."); return done(); }
        say("voce", "Fra i cavalli, un ragazzino magro col viso sporco li accarezza uno per uno, perché non nitriscano. Ti guarda. Non scappa, non chiama nessuno.");
        if (K.crew.has("sn_kiku") && !dead("sn_kiku")) {
          say("sn_kiku", "[sorpreso] (Kiku esce dall'ombra, l'arco abbassato.) Jirō. Jirō, sono io.");
          say("sn_jiro", "[sorpreso] ...Kiku? (È la prima parola che dice da quattro raccolti.) Kiku. Hai ancora la freccia storta?");
          F.set("sn_jiro_salvo", true); K.rel.add("sn_kiku", 6); return done();
        }
        if (F.is("sn_jiro_pista")) {
          say("voce", "Ti ricordi le parole dell'esploratore: «lo chiamano il Muto». Tiri fuori la palla da kemari, la palleggi tre volte, gliela passi. Jirō la ferma col piede. Senza guardare.");
          say("sn_jiro", "[pensa] (Jirō palleggia una volta, due, tre. Poi ti segue, con il cavallo più nero del campo.)");
          F.set("sn_jiro_salvo", true); return done();
        }
        say("voce", "Fai un passo verso di lui. Il ragazzo indietreggia fra i cavalli e sparisce nel buio, senza un suono. Non sai neanche il suo nome.");
        F.set("sn_jiro_no", true); done();
      },
      sn_rikichi() {
        if (K.rel.scene("sn_rikichi")) return;
        if (F.is("sn_moglie_salva")) { say("sn_rikichi", "[felice] (Rikichi non dice niente. Pettina i capelli di Miyo col pettine rotto, seduto sulla soglia, per un'ora intera.)"); return done(); }
        if (F.is("sn_moglie_resta")) { say("sn_rikichi", "[triste] (Rikichi prende il nastro rosso. Lo lega al manico della falce. Non chiede niente. Non chiederà mai.)"); return done(); }
        say("sn_rikichi", "[serio] Stanotte tengo la falce. Non per i predoni. Per non tremare."); done();
      },
      sn_gisaku() { if (K.rel.scene("sn_gisaku")) return; say("sn_gisaku", nights() ? "[triste] Ogni mattina conto. Ogni mattina il conto è più corto. Sono vecchio per contare così." : "[serio] Il riso è al sicuro. Adesso tocca a noi."); done(); },
      sn_shinobu() { if (K.rel.scene("sn_shinobu")) return; say("sn_shinobu", K.crew.has("sn_hayate") && !dead("sn_hayate") ? "[triste] Hayate dice che non ha paura. Gli tremano le mani quando mangia. Gli ho fatto un onigiri più grande." : "[triste] Porto l'acqua ai feriti. Ce ne sono sempre di più."); done(); },
      sn_manzo() { if (K.rel.scene("sn_manzo")) return; say("sn_manzo", F.is("sn_perdono") ? "[serio] Ho dato il riso del mulino ai feriti. Tutto. Non ditelo a nessuno. No: ditelo." : "[triste] Mi guardano. Tutti. Me lo merito. Stanotte tengo la Porta Sud con la zappa. Me lo merito anche quello."); done(); }
    };
    // i compagni vivi al villaggio, ognuno vicino alla sua porta
    const crewAt = (L, spots) => H.alive().filter((id) => spots[id]).forEach((id) => L.push({ id, at: spots[id] }));
    const zones = {
      sn_villaggio: Z.villaggio(H, () => {
        const L = [{ id: "sn_kanbei", at: [18, 13] }, { id: "sn_rikichi", at: [26, 11] }, { id: "sn_gisaku", at: [13, 14] }, { id: "sn_shinobu", at: [20, 17] }, { id: "sn_manzo", at: [21, 5] }];
        if (F.is("sn_moglie_salva")) L.push({ id: "sn_miyo", at: [6, 19] });
        if (F.is("sn_jiro_salvo")) L.push({ id: "sn_jiro", at: [10, 19] });
        crewAt(L, { sn_okuma: [12, 13], sn_gonta: [14, 18], sn_hayate: [21, 9], sn_yumi: [8, 17], sn_shino: [21, 13], sn_tetsu: [27, 7], sn_ren: [12, 7], sn_masa: [29, 16], sn_kiku: [12, 17] });
        return L;
      }, {
        time: "tramonto", start: [16, 13],
        doors: { "16,0": { to: "sn_passo", at: [16, 22] }, "17,0": { to: "sn_passo", at: [17, 22] }, "0,11": { to: "sn_bosco", at: [28, 10] }, "0,12": { to: "sn_bosco", at: [28, 11] } },
        extra: [[16, 0, "q"], [17, 0, "q"], [0, 11, "q"], [0, 12, "q"]],
        items: [[3, 6], [30, 6], [7, 20], [24, 20]], itemCos: "sn_c4",
        intro: [["voce", "Il riso è maturo. Le spighe si piegano come chi ha qualcosa da confessare."], ["voce", "Sul passo, al tramonto, si accendono i fuochi dei predoni. Kanbei li conta. Smette a quaranta."]]
      }),
      sn_accampamento: {
        region: "notte", name: "Il campo dei predoni", short: "Campo dei predoni", sub: "Tende, cavalli, il riso rubato e un recinto per le persone", bg: "sn_accampamento", time: "notte", w: 30, h: 22, base: ";", start: [15, 19], travel: false,
        items: [[4, 5], [26, 18], [15, 4]], itemCos: "sn_c4",
        areas: [[1, 2, 9, 12, "Il recinto dei prigionieri"], [20, 2, 28, 10, "I cavalli"], [10, 8, 19, 15, "Il fuoco"], [0, 0, 29, 21, "Il campo dei predoni"]],
        act: { q: "Torna al sentiero", t: "Guarda l'albero", f: "Guarda il recinto", E: "Guarda il fuoco", z: "Guarda il bottino", G: "Guarda le armi", n: "Guarda lo stendardo", b: "Guarda la stuoia" },
        flavor: { t: "Un pino bruciato a metà. Ci hanno appeso le selle.", r: "Le pareti della gola. Di notte, l'eco ripete ogni passo due volte.", f: "Il recinto: canne legate con la corda. Dall'altra parte, persone sedute che non dormono.", E: "Il fuoco dei predoni. Cucinano il riso rubato l'anno scorso. Ha l'odore di Sasso Nero.", z: "Sacchi di riso col marchio di quattro villaggi diversi. Uno è di Sasso Nero.", G: "Lance, archi, una spada spezzata. E un pallone da kemari bucato, appeso come un trofeo.", n: "Lo stendardo di Corvo Rosso: un corvo nero su un campo di sangue.", b: "Stuoie di predoni che dormono. Uno parla nel sonno: chiama sua madre." },
        npcs: () => {
          const L = [{ id: "sn_miyo", at: [5, 8] }];
          if (!F.is("sn_jiro_no") && !F.is("sn_jiro_salvo")) L.push({ id: "sn_jiro", at: [24, 11] });
          if (K.crew.has("sn_kiku") && !dead("sn_kiku")) L.push({ id: "sn_kiku", at: [16, 17] });
          return L;
        },
        intro: [["voce", "Il campo di Corvo Rosso, nella gola del fiume. Fuochi bassi, cavalli legati, predoni che dormono col coltello in mano."], ["voce", "A ovest il recinto dei prigionieri. A est i cavalli. In mezzo, il fuoco. Muoviti piano."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "r"); lay(0, 0, 0, 21, "r"); lay(29, 0, 29, 21, "r"); lay(0, 21, 29, 21, "r"); put(14, 21, "q"); put(15, 21, "q");
          lay(14, 16, 15, 20, ":"); lay(4, 15, 25, 15, ":");
          // il recinto dei prigionieri, aperto a sud-est
          lay(2, 3, 8, 3, "f"); lay(2, 3, 2, 11, "f"); lay(8, 3, 8, 7, "f"); lay(8, 9, 8, 11, "f"); lay(2, 11, 8, 11, "f"); put(3, 5, "b"); put(3, 9, "b");
          // i cavalli, legati a est
          lay(21, 3, 27, 3, "f"); lay(21, 3, 21, 9, "f"); lay(27, 3, 27, 9, "f"); lay(21, 9, 23, 9, "f"); lay(25, 9, 27, 9, "f");
          // il fuoco al centro e le tende intorno
          put(14, 11, "E"); put(15, 11, "E");
          house(10, 5, 4, 3, { door: [11, 7], roof: "#7f1d1d", wall: "#57534e", enter: "Una tenda di predoni. Dentro, tre uomini dormono abbracciati alle spade. Uno ha una bambola di paglia." });
          house(16, 5, 4, 3, { door: [18, 7], roof: "#1c1917", wall: "#44403c", enter: "La tenda di Corvo Rosso. È vuota. Sul cuscino, un elmo da samurai con lo stemma raschiato via." });
          house(10, 17, 3, 3, { door: [11, 19], roof: "#7f1d1d", wall: "#57534e", enter: "Una tenda di predoni. Russano tutti. Non è il momento di essere eroi." });
          house(18, 17, 3, 3, { door: [19, 19], roof: "#7f1d1d", wall: "#57534e", enter: "Il deposito: corde, frecce, sakè. Molto sakè. Questo spiega il russare." });
          put(12, 13, "z"); put(17, 13, "z"); put(24, 13, "G"); put(28, 2, "n"); put(5, 18, "b"); put(6, 18, "b"); put(24, 18, "b");
          [[2, 14], [27, 14], [3, 19], [26, 20], [9, 2], [19, 2]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(); g.save();
          // il fuoco del campo e le scintille, i cavalli che sbuffano
          g.fillStyle = `rgba(251,146,60,${0.18 + 0.07 * Math.sin(f / 4)})`; g.beginPath(); g.arc(d.X(15), d.Y(11) + 8, 60, 0, 7); g.fill();
          for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(253,186,116,.8)"; g.fillRect(d.X(14) + 8 + Math.sin(f / 9 + i * 2) * 10, d.Y(11) - ((f * 0.8 + i * 13) % 50), 1.5, 1.5); }
          for (let i = 0; i < 4; i++) { const x = d.X(22 + i * 1.4), y = d.Y(5 + (i % 2) * 2); g.fillStyle = ["#1c1917", "#57534e", "#7c2d12", "#292524"][i]; g.fillRect(x, y + Math.sin(f / 20 + i), 12, 6); g.fillRect(x + 10, y - 3 + Math.sin(f / 20 + i), 4, 5); }
          g.restore();
          H.plaque(g, "PRIGIONIERI", d.X(5), d.Y(3) - 4, "#fecaca"); H.plaque(g, "CAVALLI", d.X(24), d.Y(3) - 4, "#fde68a"); H.plaque(g, "▼ SENTIERO", d.X(15), d.Y(20) - 2, "#fde68a");
        }
      }
    };
    // uscire dal campo: solo dopo i prigionieri
    function esci() {
      if (!F.is("sn_miyo_scelta")) { say("sn_kanbei", "[serio] Non senza i prigionieri. Il recinto è a ovest."); return done(); }
      F.set("sn_campo_ok", true);
      say("voce", "Un predone si sveglia per pisciare e vi vede. Il grido rimbalza nella gola due volte. Correte. Dietro di voi, il campo si accende come un formicaio.");
      say("voce", `All'alba siete a Sasso Nero. ${F.is("sn_moglie_salva") ? "Miyo cammina dietro di te, a testa bassa, fino alla porta di Rikichi." : "Nella tasca hai un nastro rosso sbiadito."} ${F.is("sn_jiro_salvo") ? "Jirō arriva per ultimo, sul cavallo più nero del campo." : ""}`);
      K.clock.set(K.clock.day() + 1, 0); K.say(H.flush(), () => K.go("sn_villaggio", 16, 3));
    }
    const obj = { "sn_accampamento:q": () => esci() };
    return {
      n: N, title: "Tre notti", sub: "Il riso tagliato, tre notti di ondate, un campo nella gola e chi non torna",
      goal, start: "sn_villaggio", introBg: "sn_notte", zones, talk, obj,
      intro: [["voce", "Il raccolto. Due giorni di falci e canti, e il riso al sicuro nel granaio."], ["voce", "Poi tre notti. Corvo Rosso non ha fretta: manda i suoi a ondate, finché il villaggio non ha più fiato."]]
    };
  }
  boot();
})();
