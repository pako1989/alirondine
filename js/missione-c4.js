// js/missione-c4.js - «MISSIONE SENZA RITORNO» · Capitolo 4: Il Passo d'Omega
// Dal tavolo-mappa della Sala Tattica si parte: da lì non si torna. Le migliorie mancanti costano vite all'attraversamento.
// Nella Tana dei Raccoglitori si decide con «Il Piano» (novità del core, cfg.plan): chi va nei condotti, chi guida, chi tiene la barriera, chi scorta i rapiti.
// Chi è adatto E leale torna. Gli altri, forse. Poi il Gigante, la Linea, e l'ultima scelta: far saltare la Tana o consegnarla a Cerbero. Morti fuori scena, niente sangue.
(function () {
  "use strict";
  function boot() {
    const E = window.__missioneCore;
    if (!E || !E.api || !E.api.addChapter || !E.api._has || !E.api._has(3) || !window.__missioneH || !window.__pausa) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__missioneH(K), { say, done, ask, wask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    H.cast("ms_tali", "Tali", "Ingegnera della Flotta", { style: "hood", hair: "#7e22ce", shirt: "#a855f7", skin: "#c4b5fd", eye: "#f0abfc", acc: ["casco"], bg: ["#4c1d95", "#f5d0fe"] }, "Viene dalla Flotta dei Pescatori. Non toglie mai il casco.");
    H.cast("ms_zero", "Zero", "Ex ultrà, ex detenuta", { style: "bald", hair: "#1c1917", shirt: "#3f3f46", skin: "#e8c4a0", eye: "#a855f7", scar: true, bg: ["#3b0764", "#d8b4fe"] }, "Tatuata fino alle orecchie. Quando si arrabbia, le cose si spostano da sole.");
    H.cast("ms_tano", "Tano", "Ex sicario, portiere di riserva", { style: "slick", hair: "#14532d", shirt: "#1c1917", skin: "#86efac", eye: "#1c1917", acc: ["guanti"], bg: ["#052e16", "#bbf7d0"] }, "Prega prima di ogni lavoro. Para come un santo, quando nessuno lo guarda.");
    H.cast("ms_legione", "Legione", "Macchina che dice «noi»", { shape: "robot", skin: "#6b7280", shirt: "#374151", hair: "#4b5563", eye: "#38bdf8", bg: ["#0f172a", "#7dd3fc"] }, "Un robot da allenamento con mille voci in testa. Parla al plurale.");
    H.cast("ms_prelato", "Il Prelato", "Comandante dei Raccoglitori", { shape: "ombra", skin: "#1f2937", shirt: "#111827", eye: "#facc15", hair: "#422006", bg: ["#1c1917", "#facc15"] }, "Una sagoma più alta delle altre, con una voce che non si muove con la bocca.");
    H.cast("ms_capitano", "Capitano di Orizzonte", "Rapito dai Raccoglitori", { style: "short", hair: "#78350f", shirt: "#15803d", skin: "#d9a679", bg: ["#14532d", "#bbf7d0"] }, "Il capitano di Borgo Orizzonte. Ha ancora la fascia al braccio. Non sa da quanti giorni.");
    H.cast("ms_gemello", "Uno dei gemelli", "Rapito dai Raccoglitori", { style: "messy", hair: "#a16207", shirt: "#15803d", skin: "#e8c4a0", bg: ["#14532d", "#fef08a"] }, "Uno dei gemelli di Orizzonte. L'altro è nel bozzolo accanto. Si tengono per mano attraverso il guscio.");
    K.cos("ms_c4", { kind: "shirt", label: "Divisa del Passo", val: "#ea580c", from: "Capitolo 4 di Missione Senza Ritorno" });
    K.lore("l_passo", { t: "Il Passo d'Omega", d: "Due rupi e una luce arancio. Le navi che non si riconoscono vengono fatte a pezzi dai rottami di chi ci ha provato prima." });
    K.lore("l_gigante", { t: "Il Gigante", d: "I Raccoglitori non rapiscono squadre per mangiarle: le cuciono insieme, in un pallone vivo grande come uno stadio. Una squadra perfetta, fatta di tutte le squadre." });

    const P = K.plan, has = (id) => K.crew.has(id), loyalOk = (id) => F.is("ms_loy_" + id), dead = () => Object.keys(K.crew.members).filter((id) => F.is("ms_dead_" + id));
    const name = (id) => K.crew.members[id].n.replace(/ «.*»/, "");
    function kill(id, why) { if (!id || !has(id) || id === "ms_miranda") return false; F.set("ms_dead_" + id, true); K.crew.leave(id); say("voce", `<b>${name(id)} non torna.</b> ${why}`); return true; }
    const firstOf = (order, skip) => order.find((id) => has(id) && id !== "ms_miranda" && !(skip || []).includes(id));
    const goal = (s) => ({
      0: "Quando sei pronto: il tavolo-mappa della Sala Tattica traccia la rotta per il Passo. Da lì non si torna.",
      1: F.is("ms_p1") ? "Nel varco: lo scontro alle valvole, dal tavolo del piano." : "Al Passo: decidi il piano al tavolo vicino alla Normanna.",
      2: F.is("ms_p2") ? "Nella Tana: attraversa lo sciame, dal tavolo del piano." : "Nella Tana: decidi il secondo piano al tavolo all'ingresso.",
      3: "Nel cuore della Tana: affronta il Prelato e il Gigante.",
      4: "Il Gigante è caduto. Decidi cosa fare della Tana."
    }[s] || "La missione è finita.");

    // ---------------------------------------------------------------- partenza e attraversamento
    function depart() {
      if (S() > 0) { say("voce", "La rotta è già tracciata. Il Passo è dietro di te."); return done(); }
      const up = F.get("ms_upg", 0), opn = Object.keys({ ms_miranda: 1, ms_garro: 1, ms_zero: 1, ms_tali: 1, ms_tano: 1, ms_jacopo: 1, ms_mordini: 1 }).filter((id) => has(id) && !loyalOk(id)).length;
      say("ms_edi", `Rotta per il Passo d'Omega pronta. Migliorie installate: ${up} su 3. Membri dell'equipaggio con un conto ancora aperto: ${opn}.`);
      return ask("Il Mediterraneo in luce, e una linea arancio che porta al Passo. Da lì non si torna.", [
        { label: "🔥 Traccia la rotta per il Passo", sub: "Punto di non ritorno", big: true, cls: "hot", fn: crossing },
        { label: "↩ Non ancora", sub: "I conti in sospeso si chiudono con Jolly", fn: done }
      ]);
    }
    function crossing() {
      setStep(N, 1); K.learnLore("l_passo"); quest("ms_c4", "Il Passo d'Omega", "Attraversa il Passo e trova la Tana dei Raccoglitori.");
      say("ms_jolly", "[serio] Tutti seduti. Tutti allacciati. Anche tu, EDI. Sì, lo so che non hai un sedile. Fingi.");
      say("voce", "La Normanna entra nel varco. I rottami di cento navi girano intorno come una giostra rotta. Il trasponditore ronza: i rottami si scostano. Quasi tutti.");
      if (!F.is("ms_upg_scafo")) kill(firstOf(["ms_zero", "ms_jacopo", "ms_tano", "ms_garro", "ms_mordini", "ms_tali", "ms_legione"]), "Uno scafo senza corazza: un rottame entra nella stiva come un treno. Nella stiva c'era qualcuno.");
      else say("voce", "Un rottame colpisce la stiva. La corazza di Mordini si piega e regge. Jolly urla qualcosa di intraducibile.");
      if (!F.is("ms_upg_scudi")) kill(firstOf(["ms_legione", "ms_tali", "ms_tano", "ms_garro", "ms_jacopo", "ms_mordini", "ms_zero"]), "Senza scudi, lo sciame entra dalla sala macchine. Qualcuno chiude la porta da dentro, per tenerlo lontano dagli altri.");
      else say("voce", "Lo sciame si abbatte sui fianchi e rimbalza sugli scudi a onda, come pioggia d'oro su una vetrina.");
      if (!F.is("ms_upg_armi")) kill(firstOf(["ms_tano", "ms_garro", "ms_jacopo", "ms_mordini", "ms_zero", "ms_tali", "ms_legione"]), "Una nave dei Raccoglitori si aggancia alla prua. Senza il cannone, la si stacca a mano. Qualcuno ci riesce, e cade con lei.");
      else say("voce", "Una nave dei Raccoglitori punta la prua. Il cannone di Tali spara un pallone zavorrato. La nave si gira su se stessa e sparisce nel buio.");
      say("ms_jolly", "[sorpreso] Siamo passati. SIAMO PASSATI. Atterro. Atterro male, ma atterro.");
      K.say(H.flush(), () => K.go("ms_passo", 5, 11));
    }

    // ---------------------------------------------------------------- piano 1: i condotti
    function plan1() {
      if (S() !== 1) { say("voce", "Il tavolo del primo piano: pezzi di carta, una matita, la calligrafia di Miranda."); return done(); }
      if (F.is("ms_p1")) return fight1();
      say("ms_miranda", "[serio] La Tana ha una sola entrata: le valvole sono chiuse dall'interno. Uno di noi entra nei condotti, il resto in due squadre. Una la guidi tu. L'altra serve qualcuno che sappia guidare.");
      K.say(H.flush(), () => P.open({ title: "Il Piano · le valvole", q: "Chi va nei condotti, chi guida la seconda squadra. ★★ = adatto. Conta anche la lealtà.", roles: ["tecnico", "capo"], pool: K.crew.list() }, done, true, (m) => { F.set("ms_p1", true); say("voce", `Nei condotti: ${m.tecnico ? name(m.tecnico) : "nessuno"}. A guidare la seconda squadra: ${m.capo ? name(m.capo) : "nessuno"}.`); fight1(); }));
    }
    function fight1() {
      return ask("La prima squadra avanza verso le valvole. I Raccoglitori escono dalle pareti.", [
        { label: "⏸ Tieni le valvole", sub: "Scontro «Squadra in Pausa» · 3 ondate", big: true, cls: "hot", fn: () => H.fight({ title: "Le valvole del Passo", arena: "tana", waves: [[["base", 6]], [["lesto", 4], ["scudo", 2]], [["grosso", 2], ["base", 4]]] }, (r) => {
          if (!r.win) { say("ms_miranda", "Ritirata dietro la Normanna! Il piano regge. Noi no, per ora. Riproviamo."); return done(); }
          const t = P.get("tecnico"), c = P.get("capo"), tOk = t && has(t) && P.fit("tecnico", t) >= 2 && loyalOk(t), cOk = c && has(c) && P.fit("capo", c) >= 2 && loyalOk(c);
          if (!t) kill(firstOf(["ms_mordini", "ms_jacopo", "ms_tano", "ms_garro", "ms_zero", "ms_tali", "ms_legione"]), "Nessuno nei condotti: qualcuno ci si infila all'ultimo, senza piano e senza attrezzi. Le valvole si aprono. Lui no, non esce.");
          else if (!tOk) kill(t, P.fit("tecnico", t) >= 2 ? "Nei condotti si è fermato un attimo, a metà, a pensare a un conto ancora aperto. Un attimo di troppo." : "Nei condotti serviva un tecnico vero. Ha aperto le valvole lo stesso, ma non è riuscito a tornare indietro.");
          else if (!cOk) kill(t, "La seconda squadra arriva tardi: chi la guidava ha esitato. Le valvole si aprono, ma nei condotti nessuno ha più copertura.");
          else say("voce", `${name(t)} apre l'ultima valvola e cade fuori dal condotto, dritto tra le braccia della seconda squadra. ${name(c)} conta tutti. Ci sono tutti.`);
          setStep(N, 2); K.say(H.flush(), () => K.go("ms_tana", 3, 10));
        }) },
        { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => fight1(), true) }
      ]);
    }

    // ---------------------------------------------------------------- piano 2: lo sciame e i rapiti
    function plan2() {
      if (S() !== 2) { say("voce", "Il tavolo del secondo piano: una mappa disegnata su un guscio di bozzolo."); return done(); }
      if (F.is("ms_p2")) return fight2();
      say("ms_miranda", "[serio] Lo sciame riempie la Tana. Serve una barriera per attraversarla. E i rapiti di Orizzonte sono vivi: qualcuno deve riportarli alla Normanna. E l'altra squadra, di nuovo, va guidata.");
      K.say(H.flush(), () => P.open({ title: "Il Piano · la Tana", q: "Barriera, scorta dei rapiti, guida della seconda squadra. Chi scorta i rapiti torna alla Normanna con loro.", roles: ["barriera", "scorta", "capo"], pool: K.crew.list() }, done, true, (m) => { F.set("ms_p2", true); say("voce", `Barriera: ${m.barriera ? name(m.barriera) : "nessuno"}. Scorta: ${m.scorta ? name(m.scorta) : "nessuno"}. Guida: ${m.capo ? name(m.capo) : "nessuno"}.`); fight2(); }));
    }
    function fight2() {
      const b = P.get("barriera"), bOk = b && has(b) && P.fit("barriera", b) >= 2 && loyalOk(b);
      return ask("La barriera si alza. Lo sciame la circonda come un mare d'oro.", [
        { label: "⏸ Attraversa la Tana", sub: `Scontro «Squadra in Pausa» · 4 ondate${bOk ? " · barriera solida: +1 bonus" : ""}`, big: true, cls: "hot", fn: () => H.fight({ title: "La Tana", arena: "tana", bonus: bOk ? 1 : 0, waves: [[["base", 5], ["lesto", 2]], [["scudo", 3], ["base", 3]], [["grosso", 2], ["lesto", 3]], [["boss", 1], ["base", 4]]] }, (r) => {
          if (!r.win) { say("ms_miranda", "Indietro, dentro la barriera! Il piano resta. Si riprova."); return done(); }
          const s = P.get("scorta"), c = P.get("capo"), cOk = c && has(c) && P.fit("capo", c) >= 2 && loyalOk(c);
          if (!b) kill(firstOf(["ms_jacopo", "ms_mordini", "ms_tano", "ms_garro", "ms_tali", "ms_legione", "ms_zero"], [s]), "Senza barriera, lo sciame si prende qualcuno a metà strada. Lo vedi sollevarsi, leggero, e sparire nell'oro.");
          else if (!bOk) kill(firstOf(["ms_jacopo", "ms_mordini", "ms_tano", "ms_garro", "ms_tali", "ms_legione", "ms_zero"], [b, s]), `La barriera di ${name(b)} trema, si apre per un secondo. Un secondo basta allo sciame.`);
          else say("voce", `${name(b)} tiene la barriera fino all'ultimo passo, con gli occhi chiusi e i denti stretti. Nessuno resta fuori.`);
          if (!s) { F.set("ms_rapiti_persi", true); say("voce", "Nessuno scorta i rapiti. Li vedi tornare indietro, verso i bozzoli, come sonnambuli. Non c'è tempo di fermarli."); }
          else if (!has(s)) { F.set("ms_rapiti_persi", true); say("voce", "La scorta non c'è più. I rapiti restano soli, e tornano verso i bozzoli."); }
          else if (!loyalOk(s) && kill(s, "Ha riportato i rapiti fino al portellone della Normanna. Poi è tornato indietro per l'ultimo, e l'ultimo era lui.")) { /* i rapiti sono salvi, la scorta no */ }
          else { F.set("ms_scorta_ok", s); say("voce", `${name(s)} riporta i rapiti di Orizzonte alla Normanna, uno per uno, tenendoli per mano come bambini al primo giorno di scuola.`); }
          if (!cOk) kill(c && c !== s ? c : firstOf(["ms_tano", "ms_garro", "ms_mordini", "ms_jacopo", "ms_tali", "ms_legione", "ms_zero"], [b, s]), "La seconda squadra si perde nei cunicoli. Quando la ritrovi, manca qualcuno all'appello.");
          setStep(N, 3); K.learnLore("l_gigante"); K.say(H.flush(), () => K.go("ms_cuore", 8, 9));
        }) },
        { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => fight2(), true) }
      ]);
    }

    // ---------------------------------------------------------------- il Gigante e la Linea
    function fightFinal() {
      return ask("Il Gigante si stacca dai cavi. Il Prelato alza le braccia.", [
        { label: "⏸ Abbatti il Gigante", sub: "Scontro «Squadra in Pausa» · 5 ondate, con il capo", big: true, cls: "hot", fn: () => H.fight({ title: "Il Gigante", arena: "tana", foeCol: "#3b2a10", foeEye: "#facc15", waves: [[["base", 6]], [["lesto", 5], ["scudo", 2]], [["grosso", 3], ["base", 3]], [["scudo", 4], ["lesto", 3]], [["boss", 2], ["base", 3]]] }, (r) => {
          if (!r.win) { say("ms_jolly", "[serio] Comandante, vi tengo il motore acceso. Riprovate. Riprovate finché serve."); return done(); }
          const field = K.crew.field().slice(0, 2), esc = F.get("ms_scorta_ok", ""), line = K.crew.list().filter((id) => !field.includes(id) && id !== esc);
          say("voce", "Il Gigante crolla su se stesso. I bozzoli si aprono, uno dopo l'altro, come fiori stanchi. Il Prelato cade in ginocchio e la voce gli esce, finalmente, dalla bocca: «...volevamo solo una squadra perfetta».");
          // la Linea: chi è rimasto indietro tiene i Raccoglitori lontani mentre tutti corrono alla Normanna
          if (line.length) {
            const sc = (id) => Object.values(K.crew.members[id].s || {}).reduce((a, b) => a + b, 0) + (loyalOk(id) ? 2 : 0), avg = line.reduce((a, id) => a + sc(id), 0) / line.length;
            const weak = line.filter((id) => !loyalOk(id)).sort((a, b2) => sc(a) - sc(b2)), n = avg >= 4 ? 0 : avg >= 3 ? 1 : 2;
            say("voce", `${line.map(name).join(", ")} ${line.length > 1 ? "tengono" : "tiene"} la Linea all'ingresso del cuore.`);
            weak.slice(0, n).forEach((id) => kill(id, "Ha tenuto la Linea fino all'ultimo. Quando gli altri sono corsi via, si è voltato a guardare. È rimasto lì."));
            if (!weak.slice(0, n).length) say("voce", "La Linea regge. Quando arrivi di corsa, sono tutti lì, sporchi d'oro e vivi, a lamentarsi del ritardo.");
          }
          field.filter((id) => has(id) && !loyalOk(id)).forEach((id) => kill(id, "Nella corsa verso la Normanna, si è fermato a guardare indietro. Il pavimento della Tana ha ceduto."));
          setStep(N, 4); K.say(H.flush(), () => talk.ms_prelato());
        }) },
        { label: "👥 Scegli chi porti", fn: () => K.crew.pick(() => fightFinal(), true) }
      ]);
    }

    const ENDS = {
      tutti: { title: "Nessuno Resta Indietro", coins: 300 },
      prezzo: { title: "Il Prezzo del Passo", coins: 220 },
      solo: { title: "L'Ultimo a Bordo", coins: 180 }
    };
    function finale(cerb) {
      if (cerb) { F.set("ms_cerbero", true); K.end("cerbero"); }
      const alive = K.crew.list(), lost = dead(), id = !alive.filter((x) => x !== "ms_miranda").length && lost.length ? "solo" : lost.length ? "prezzo" : "tutti", E2 = ENDS[id];
      setStep(N, 5); F.set("ms_c4_done", true);
      K.reward("ms_c4" + id, { coins: E2.coins, cos: "ms_c4" });
      K.finishChapter(N, cerb ? "cerbero" : id); K.end(id);
      const lines = [];
      lines.push(["ms_jolly", "[serio] Tutti a bordo? ...Contate. Contate di nuovo. Va bene. Va bene. Si parte."]);
      if (!F.is("ms_rapiti_persi")) lines.push(["ms_capitano", "[triste] Capitano di Borgo Orizzonte. Ricordo la finale di domani. Mi hanno detto che è stata tre settimane fa. Possiamo giocarla lo stesso?"]);
      else lines.push(["voce", "Nella stiva, i posti preparati per i rapiti di Orizzonte restano vuoti. Mordini li aveva numerati uno per uno."]);
      if (lost.length) lines.push(["voce", `Sul ponte della Normanna, ${lost.length === 1 ? "una sedia vuota" : lost.length + " sedie vuote"}: ${lost.map(name).join(", ")}. Nessuno le toglie.`]);
      alive.forEach((x) => { const t = { ms_miranda: "[serio] Ho fatto un rapporto a Cerbero. Una riga: «missione compiuta». Il resto lo tengo per me.", ms_jacopo: F.is("ms_ferro_processo") ? "[serio] Ho una registrazione e una domanda per il Signor Fumo. Adesso ho anche il tempo di fargliela." : "[pensa] Torno a casa. Prima, però, una birra. Con te.", ms_mordini: "[felice] Vivo! Tutti vivi... no, non tutti. Ma io sì. Opera finita. Terzo atto: riscrivere.", ms_garro: "[serio] Ho mirato tutta la notte. Ho mancato un colpo solo. Quello giusto, credo.", ms_zero: "[felice] Ho rotto una cosa enorme di Cerbero e una ancora più enorme dei Raccoglitori. Che giornata.", ms_tali: "[felice] Il motore tre fa ancora quel rumore. Lo terremo. Porta fortuna.", ms_tano: "[triste] Ho pregato per tutti. Anche per quelli che non ci credevano. Soprattutto per loro.", ms_legione: "Noi abbiamo deciso un nome per questa sensazione. Noi la chiamiamo: casa." }[x]; if (t) lines.push([x, t]); });
      lines.push(["ms_fumo", cerb ? "[felice] La Tana è nostra, Comandante. Il Gigante, i bozzoli, tutto. Cerbero ti ringrazia. Il mondo, un giorno, forse." : "[freddo] Hai fatto saltare la Tana. La cosa più preziosa mai trovata nel Mediterraneo, in fumo. ...Ironico, detto da me. Ci rivedremo, Comandante."]);
      lines.push(["voce", `<b>FINE.</b> Hai chiuso «Missione Senza Ritorno» con il finale «${E2.title}»${cerb ? " e «La Tana a Cerbero»" : ""}.<br>Tornati ${alive.length} · Perduti ${lost.length} · 🔵 Esempio ${K.stat("esempio")} · 🔴 Spregiudicato ${K.stat("spregio")}`]);
      K.scene(lines, () => K.openMain(), "ms_titolo");
    }

    const talk = {
      ms_jolly() {
        if (K.rel.scene("ms_jolly")) return;
        if (S() === 0) return K.PASS;
        say("ms_jolly", S() >= 5 ? "[felice] Rotta di casa. La conosco a memoria. È l'unica che ho sempre sperato di fare." : "[serio] Il motore è acceso, Comandante. Lo tengo acceso finché non tornate. Tutti, possibilmente."); done();
      },
      ms_edi() {
        if (K.rel.scene("ms_edi")) return;
        if (S() === 0) { say("ms_edi", "Comandante, quando sarai pronto, il tavolo-mappa della Sala Tattica traccerà la rotta per il Passo. Consiglio: prima chiudi i conti in sospeso e completa le migliorie. Consiglio non richiesto, lo so."); return done(); }
        say("ms_edi", "Sono qui. Sono sempre qui. Anche quando la nave atterra storta."); done();
      },
      ms_prelato() {
        if (K.rel.scene("ms_prelato")) return;
        if (S() === 3) {
          say("ms_prelato", "[freddo] COMANDANTE. TU HAI RIUNITO UNA SQUADRA DI SCARTI. NOI ABBIAMO CUCITO DICIANNOVE SQUADRE PERFETTE IN UNA SOLA. GUARDALA.");
          say("ms_miranda", "[serio] È un pallone. Un pallone fatto di persone. Comandante: due con te, gli altri tengono la Linea all'ingresso. Scegli bene chi porti.");
          return fightFinal();
        }
        if (S() === 4) {
          say("ms_fumo", "[serio] Comandante, mi senti? La Tana è intatta. Con quella tecnologia, Cerbero potrebbe fare squadre perfette senza rapire nessuno. Non distruggerla. Consegnala.");
          say("ms_miranda", "[pensa] Ha ragione, e ha torto. Come sempre. Decidi tu: io ti seguo. Anche stavolta.");
          return wask("Il cuore della Tana pulsa ancora, piano. Hai la carica di Zero in mano.", [
            { label: "🔵 «Saltate tutti a bordo. Questa cosa non la avrà nessuno.»", w: { esempio: 2 }, fn: () => { say("voce", "La carica si accende. La Normanna decolla con il portellone ancora aperto. Dietro, la Tana si accende d'oro una volta sola, poi si spegne per sempre."); finale(false); } },
            { label: "🔴 «Cerbero se la prenda. Ma che serva a qualcosa.»", w: { spregio: 2 }, fn: () => { say("voce", "Lasci la carica a terra. Le navi di Cerbero entrano nel Passo un'ora dopo, con le luci accese e i camion vuoti. Ripartono pieni."); finale(true); } }
          ]);
        }
        say("voce", "Il Prelato è seduto per terra, la testa tra le mani. Non dice più niente. Forse non ha mai detto niente: era il Gigante a parlare."); done();
      },
      ms_capitano() { say("ms_capitano", S() >= 4 ? "Possiamo andare a casa? Abbiamo una finale da giocare." : "[triste] Non riesco a muovermi. Vedo tutto. La fascia, ce l'ho ancora. Sono ancora il capitano."); done(); },
      ms_gemello() { say("ms_gemello", "[triste] Mio fratello è lì dentro. Gli tengo la mano attraverso il guscio. Non mollatela voi, se io mollo."); done(); }
    };

    // ---------------------------------------------------------------- zone
    const crewHere = (spots) => () => Object.keys(spots).filter((id) => K.crew.has(id) && !K.crew.field().includes(id)).map((id) => ({ id, at: spots[id] }));
    const zones = {
      ms_passo: {
        region: "passo", name: "Il Passo d'Omega", short: "Il Passo", sub: "Rottami, fuoco e due rupi", bg: "ms_passo", time: "notte", w: 30, h: 22, base: ",", start: [5, 11],
        itemCos: "ms_c4", items: [[3, 16], [16, 4], [27, 18], [14, 19]],
        areas: [[1, 1, 9, 7, "La Normanna, atterrata storta"], [12, 8, 18, 13, "Il guado di lava"], [22, 6, 28, 15, "L'ingresso della Tana"], [0, 0, 29, 21, "Il Passo d'Omega"]],
        act: { P: "Guarda il piano", r: "Guarda la roccia", E: "Guarda i rottami", l: "Guarda il fuoco", n: "Leggi i segni", K: "Guarda la bitta", s: "Riposa un momento" },
        flavor: { r: "Una roccia nera, calda. Sopra, qualcuno ha inciso un nome e una data. Due anni fa.", E: "Rottami di navi: una prua con un nome ancora leggibile, «SPERANZA». Ironico, direbbe Jolly. Jolly non lo dice.", l: "Un fuoco che esce dal terreno, senza legna. Fa luce, non scalda.", n: "Segni sulla roccia: frecce, tutte verso l'ingresso della Tana. Nessuna verso l'uscita.", K: "Una bitta strappata dalla Normanna nell'atterraggio. Jolly dice che «si è staccata da sola, per l'emozione».", w: "Lava. O qualcosa che le somiglia molto. Non toccarla neanche col pensiero.", s: "Ti siedi un momento accanto alla Normanna. Lo scafo ticchetta mentre si raffredda." },
        doors: {},
        npcs: crewHere({ ms_jacopo: [4, 9], ms_mordini: [8, 13], ms_garro: [7, 15], ms_zero: [3, 14], ms_tali: [9, 9], ms_tano: [6, 17], ms_legione: [10, 14], ms_miranda: [5, 9] }),
        intro: [["voce", "La Normanna è atterrata storta in mezzo ai rottami, oltre il varco. Fumo, scintille, e un silenzio che fa più rumore di tutto il resto."], ["voce", "A est, l'ingresso della Tana: una bocca nera tra le rocce. Vicino alla nave, Miranda ha già aperto un tavolo da campo. Il piano."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          house(2, 2, 7, 5, { door: [5, 6], roof: "#1e3a5f", wall: "#e2e8f0", enter: "La Normanna, dentro: luci d'emergenza, un estintore usato a metà e Jolly che parla con il cruscotto come con un cavallo." });
          lay(12, 1, 13, 20, "w"); lay(12, 10, 13, 11, ":"); lay(19, 1, 20, 20, "w"); lay(19, 15, 20, 16, ":");
          lay(4, 10, 11, 11, ":"); lay(14, 10, 16, 11, ":"); lay(16, 12, 16, 15, ":"); lay(17, 15, 18, 15, ":"); lay(21, 15, 24, 15, ":"); lay(24, 10, 24, 14, ":");
          house(23, 4, 6, 5, { door: [25, 8], roof: "#1c1408", wall: "#3b2a10", enter: "L'ingresso della Tana: una bocca d'oro opaco. Le valvole sono chiuse dall'interno. Serve il piano, prima." });
          put(7, 8, "P");
          [[3, 19], [9, 3], [15, 3], [17, 18], [26, 19], [22, 2], [27, 12], [10, 18]].forEach(([x, y]) => put(x, y, "r")); [[15, 6], [16, 7], [22, 18], [26, 17], [10, 16]].forEach(([x, y]) => put(x, y, "E"));
          [[11, 8], [14, 13], [21, 12], [25, 11], [17, 4]].forEach(([x, y]) => put(x, y, "l")); put(3, 8, "K"); put(22, 10, "n"); put(8, 18, "s");
        },
        decor(g, cx, cy, d) { H.plaque(g, "NORMANNA", d.X(5) + 8, d.Y(2) - 6, "#7dd3fc"); H.plaque(g, "LA TANA", d.X(25) + 8, d.Y(4) - 6, "#fde047"); H.plaque(g, "IL PIANO", d.X(7) + 8, d.Y(8) - 6, "#fdba74"); }
      },
      ms_tana: {
        region: "tana", name: "La Tana dei Raccoglitori", short: "La Tana", sub: "Bozzoli, cunicoli e uno sciame che dorme", bg: "ms_tana", time: "notte", w: 30, h: 22, base: ":", start: [3, 10],
        itemCos: "ms_c4", items: [[2, 3], [27, 3], [2, 18], [27, 18]],
        areas: [[1, 8, 6, 13, "L'ingresso"], [8, 2, 22, 7, "I bozzoli di Orizzonte"], [8, 14, 22, 19, "I bozzoli delle altre squadre"], [24, 7, 28, 14, "Verso il cuore"], [0, 0, 29, 21, "La Tana dei Raccoglitori"]],
        act: { P: "Guarda il piano", V: "Guarda il bozzolo", t: "Guarda la colonna", l: "Guarda la luce", w: "Guarda l'oro", n: "Leggi i segni" },
        flavor: { t: "Una colonna che sembra un albero, che sembra un osso, che sembra una gamba di sedia. Fa paura in tutti e tre i modi.", l: "Una luce gialla che batte come un cuore. Insieme alle altre, batte allo stesso ritmo.", w: "Un fiume d'oro denso che scorre piano. Dentro, ogni tanto, passa un fischietto.", n: "Sulla parete, segni a gruppi di undici. Diciannove gruppi. Uno, l'ultimo, è a metà." },
        doors: {},
        npcs: (s) => (s <= 3 && !F.is("ms_rapiti_persi") && !F.get("ms_scorta_ok", "") ? [{ id: "ms_capitano", at: [14, 8] }, { id: "ms_gemello", at: [17, 8] }] : []),
        intro: [["voce", "La Tana dei Raccoglitori: cunicoli d'oro, colonne che respirano, bozzoli in fila come seggiolini in una tribuna enorme."], ["voce", "Nei bozzoli a nord, maglie verdi: Borgo Orizzonte. A est, la strada verso il cuore della Tana. All'ingresso, il tavolo del secondo piano."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(1, 1, 28, 1, "w"); lay(1, 20, 28, 20, "w"); lay(8, 10, 22, 11, "+");
          [[9, 3], [11, 3], [13, 3], [15, 3], [17, 3], [19, 3], [21, 3], [9, 17], [11, 17], [13, 17], [15, 17], [17, 17], [19, 17], [21, 17]].forEach(([x, y]) => put(x, y, "V"));
          [[7, 5], [7, 15], [23, 5], [23, 15], [12, 13], [18, 13], [25, 3], [25, 18]].forEach(([x, y]) => put(x, y, "t"));
          [[10, 8], [20, 8], [10, 13], [20, 13], [26, 10]].forEach(([x, y]) => put(x, y, "l")); put(4, 13, "P"); put(3, 6, "n");
          lay(25, 7, 25, 8, "w"); lay(25, 13, 25, 14, "w");
        },
        decor(g, cx, cy, d) { H.plaque(g, "ORIZZONTE", d.X(15) + 8, d.Y(2) - 4, "#bbf7d0"); H.plaque(g, "IL PIANO", d.X(4) + 8, d.Y(13) - 6, "#fdba74"); H.plaque(g, "CUORE ▸", d.X(27) + 8, d.Y(9) - 6, "#fde047"); }
      },
      ms_cuore: {
        interior: true, region: "cuore", name: "Il cuore della Tana", short: "Il cuore", sub: "Il Gigante e il Prelato", bg: "ms_cuore", w: 16, h: 12, start: [8, 9], outside: ["ms_tana", 26, 11], base: "+",
        act: { V: "Guarda il bozzolo", M: "Guarda la console", l: "Guarda la luce", n: "Leggi i segni" },
        flavor: { V: "Un bozzolo aperto. Dentro, solo uno scarpino da bambino, slacciato.", M: "La console del Gigante: una superficie calda che mostra diciannove stemmi di paese, cuciti insieme.", l: "Una luce d'oro che non illumina niente: fa solo ombra intorno.", n: "Sulla parete, un'unica parola incisa diciannove volte: «PERFETTA»." },
        npcs: (s) => (s >= 3 ? [{ id: "ms_prelato", at: [8, 4] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          [[2, 2], [4, 2], [11, 2], [13, 2], [2, 8], [13, 8]].forEach(([x, y]) => put(x, y, "V")); [[6, 1], [9, 1]].forEach(([x, y]) => put(x, y, "M")); [[1, 5], [14, 5]].forEach(([x, y]) => put(x, y, "l")); put(1, 10, "n");
        },
        decor(g, cx, cy, d) { H.plaque(g, "IL GIGANTE", d.X(8) + 8, d.Y(0) + 6, "#fde047"); }
      }
    };
    return {
      n: N, title: "Il Passo d'Omega", sub: "La missione da cui non si torna",
      goal, start: "ms_normanna", introBg: "ms_titolo", zones, talk,
      obj: { "ms_sala:P": depart, "ms_passo:P": plan1, "ms_tana:P": plan2 },
      intro: [["voce", "La Normanna è pronta. La rotta per il Passo è sul tavolo-mappa della Sala Tattica, una linea arancio che nessuno ha ancora tracciato."], ["voce", "Chi ha ancora un conto aperto può chiuderlo adesso. Dopo, non ci sarà tempo."]]
    };
  }
  boot();
})();
