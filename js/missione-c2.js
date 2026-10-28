// js/missione-c2.js - «MISSIONE SENZA RITORNO» · Capitolo 2: La Nave Nera
// Tre nomi nuovi sull'elenco: Zero (la nave-prigione Purgatorio), Tano (la Torre Dantis a Porto Illio), Tali (l'Isola Bianca). Si viaggia con Jolly, ogni viaggio costa tempo.
// Poi Borgo Orizzonte, sotto attacco adesso: tre torri da riaccendere e il primo scontro con i Raccoglitori. Un vecchio amico che non ti perdona Cerbero.
(function () {
  "use strict";
  function boot() {
    const E = window.__missioneCore;
    if (!E || !E.api || !E.api.addChapter || !E.api._has || !E.api._has(1) || !window.__missioneH || !window.__pausa) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__missioneH(K), { say, done, ask, wask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    H.cast("ms_zero", "Zero", "Ex ultrà, ex detenuta", { style: "bald", hair: "#1c1917", shirt: "#3f3f46", skin: "#e8c4a0", eye: "#a855f7", scar: true, bg: ["#3b0764", "#d8b4fe"] }, "Cresciuta sulle gradinate e finita in un carcere galleggiante per una rissa di troppo, o di dieci. Tatuata fino alle orecchie. Quando si arrabbia, le cose si spostano da sole.");
    H.cast("ms_tali", "Tali", "Ingegnera della Flotta", { style: "hood", hair: "#7e22ce", shirt: "#a855f7", skin: "#c4b5fd", eye: "#f0abfc", acc: ["casco"], bg: ["#4c1d95", "#f5d0fe"] }, "Viene dalla Flotta dei Pescatori, mille barche che non tornano mai in porto. Non toglie mai il casco. Ripara qualsiasi motore, a patto di poterci parlare mentre lo fa.");
    H.cast("ms_tano", "Tano", "Ex sicario, portiere di riserva", { style: "slick", hair: "#14532d", shirt: "#1c1917", skin: "#86efac", eye: "#1c1917", acc: ["guanti"], bg: ["#052e16", "#bbf7d0"] }, "Trent'anni di lavori silenziosi e una sola passione rumorosa: il calcio, in porta. Prega prima di ogni lavoro. Para come un santo, quando nessuno lo guarda.");
    H.cast("ms_curiale", "Direttore Curiale", "Nave-prigione Purgatorio", { style: "ordinato", hair: "#e5e7eb", shirt: "#7f1d1d", skin: "#d9a679", acc: ["occhiali"], bg: ["#450a0a", "#fecaca"] }, "Dirige il Purgatorio come un albergo: chi paga ha la stanza con vista. Chi non paga, a volte, sparisce lo stesso.");
    H.cast("ms_guardia", "Guardia del Purgatorio", "Turno di notte", { style: "buzz", hair: "#3f3f46", shirt: "#991b1b", skin: "#c8956a", acc: ["casco"], bg: ["#450a0a", "#fca5a5"] }, "Fa il turno di notte da sei anni. Non ricorda più l'ultima alba, ma ricorda tutti i detenuti. Soprattutto una.");
    H.cast("ms_liara", "Liara Sole", "Commerciante di informazioni", { style: "bob", hair: "#2563eb", shirt: "#1e40af", skin: "#a5b4fc", eye: "#e0e7ff", bg: ["#1e3a8a", "#c7d2fe"] }, "Era l'archivista della prima Normanna. Dopo il naufragio ha smesso di archiviare e ha iniziato a vendere: notizie, segreti, rotte. Non ti ha mai cercato. Non perché non volesse.");
    H.cast("ms_nassana", "Nassana Dantis", "Agente di calciatori", { style: "long", hair: "#fde68a", shirt: "#fbbf24", skin: "#e8c4a0", acc: ["occhiali"], bg: ["#713f12", "#fef08a"] }, "La procuratrice più ricca di Porto Illio. Ha venduto contratti, diritti e, a quanto dicono, anche le squadre di qualcun altro.");
    H.cast("ms_capo", "Capo della sicurezza", "Torre Dantis", { style: "buzz", hair: "#1c1917", shirt: "#1e3a8a", skin: "#a9744a", acc: ["visiera"], bg: ["#172554", "#bfdbfe"] }, "Dirige la sicurezza della torre. Pagato per non fare domande: lo fa benissimo.");
    H.cast("ms_ascanio", "Ascanio Williams", "Ufficiale della Federazione", { style: "ponytail", hair: "#7c2d12", shirt: "#e2e8f0", skin: "#e8c4a0", bg: ["#334155", "#e2e8f0"] }, "Era il capitano in seconda sulla prima Normanna. Ti ha pianto, due anni fa. Ora ti ritrova vivo, con lo stemma di Cerbero sulla nave. Non sa cosa sia peggio.");
    H.cast("ms_prelato", "Il Prelato", "Comandante dei Raccoglitori", { shape: "ombra", skin: "#1f2937", shirt: "#111827", eye: "#facc15", hair: "#422006", bg: ["#1c1917", "#facc15"] }, "Una sagoma più alta delle altre, con una voce che non si muove con la bocca. I Raccoglitori si fermano quando si ferma lui.");
    H.cast("ms_sindaca", "Sindaca Delia", "Borgo Orizzonte", { style: "bun", hair: "#9ca3af", shirt: "#15803d", skin: "#d9a679", bg: ["#14532d", "#bbf7d0"] }, "Sindaca, allenatrice e magazziniera di Borgo Orizzonte. La sua squadra doveva giocare la finale regionale domani.");
    K.cos("ms_c2", { kind: "shirt", label: "Giubba della Flotta", val: "#7e22ce", from: "Capitolo 2 di Missione Senza Ritorno" });
    K.lore("l_purgatorio", { t: "Il Purgatorio", d: "Una nave-prigione che non attracca mai. I detenuti li tengono in mare, e il mare tiene il segreto." });
    K.lore("l_flotta", { t: "La Flotta dei Pescatori", d: "Mille barche legate insieme, una città che galleggia. Chi nasce lì fa un viaggio da solo, da adulto, e torna solo con un dono per tutti." });
    K.lore("l_navenera", { t: "La Nave Nera", d: "Senza bandiera, senza luci, senza rumore. La stessa sagoma che due anni fa ha affondato la prima Normanna. Ora scende sui paesi la notte prima delle finali." });

    const rec = (id) => K.crew.has(id);
    const goal = (s) => ({
      0: "Nella Sala Tattica: il Signor Fumo ha tre nomi nuovi.",
      1: `Parla con Jolly in plancia e scegli la rotta. ${rec("ms_zero") ? "✓ Zero" : "Zero (Purgatorio)"} · ${rec("ms_tano") ? "✓ Tano" : "Tano (Porto Illio)"} · ${rec("ms_tali") ? "✓ Tali" : "Tali (Isola Bianca)"}.`,
      2: "Borgo Orizzonte è sotto attacco: chiedi a Jolly di andarci.",
      3: `A Borgo Orizzonte: riaccendi le tre torri di difesa (${["ms_tr1", "ms_tr2", "ms_tr3"].filter((k) => F.is(k)).length}/3).`,
      4: "Sul campo di Orizzonte: affronta il Prelato.",
      5: "Parla con Ascanio, vicino al campo."
    }[s] || "Il capitolo 2 è concluso.");
    function three() { if (S() === 1 && rec("ms_zero") && rec("ms_tano") && rec("ms_tali")) { setStep(N, 2); quest("ms_c2b", "Borgo Orizzonte", "Chiedi a Jolly di andare a Borgo Orizzonte: è sotto attacco adesso."); say("ms_edi", "Comandante, messaggio urgente dal Signor Fumo: Borgo Orizzonte. I Raccoglitori stanno scendendo adesso. Non domani: adesso."); } }
    function travel(zone, txt) { say("ms_jolly", txt); K.say(H.flush(), () => K.clock.advance(1, () => K.enterZone(zone))); }

    function fin() {
      setStep(N, 6); F.set("ms_c2_done", true);
      K.reward("ms_c2", { coins: 110, cos: "ms_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["ms_mordini", "[pensa] Sciame paralizzante. Visto. Studiato. Contromisura funziona, per poco. Serve meglio. Serve tempo. Tempo poco."],
        ["ms_miranda", "[serio] Metà della squadra di Orizzonte è sulla Nave Nera. Ora sappiamo che faccia hanno. Domani capiremo dove vanno."],
        ["ms_jolly", "Comandante, una cosa: la nave nera è la stessa di due anni fa. Ho riconosciuto il rumore. Non lo dimentico, quel rumore."],
        ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>🔵 Esempio ${K.stat("esempio")} · 🔴 Spregiudicato ${K.stat("spregio")} · 📦 Risorse ${K.stat("risorse")} · Squadra ${K.crew.count()}/${K.crew.total}`],
        ["voce", "Il Capitolo 3 ti aspetta: ognuno a bordo ha un conto in sospeso. Chi lo chiude con te, ti segue fino in fondo."]
      ]), () => K.openMain(), "ms_titolo");
    }

    // ---------------------------------------------------------------- scontri
    function fightPurgatorio() {
      H.fight({ title: "Il Purgatorio", arena: "nave", foeCol: "#7f1d1d", foeEye: "#fca5a5", waves: [[["base", 4]], [["base", 3], ["scudo", 2]], [["grosso", 1], ["base", 3], ["lesto", 2]]] }, (r) => {
        if (!r.win) { say("ms_curiale", "[furbo] Ritirata strategica. Tornerete. Qui tornano tutti, prima o poi."); return done(); }
        F.set("ms_purg_vinto", true); say("voce", "Le guardie si arrendono. Il Direttore Curiale si chiude nel suo ufficio. La cella di massima sicurezza è aperta: la porta grande al centro.");
        done();
      });
    }
    function fightTorre() {
      H.fight({ title: "Torre Dantis", arena: "torre", foeCol: "#1e3a8a", foeEye: "#93c5fd", waves: [[["lesto", 4]], [["scudo", 3], ["base", 2]], [["grosso", 2], ["lesto", 3]]] }, (r) => {
        if (!r.win) { say("ms_capo", "[freddo] Uscite dalla porta da cui siete entrati. Gratis, per stavolta."); return done(); }
        F.set("ms_torre_vinta", true); say("voce", "La sicurezza della torre si ritira. Dietro la scrivania, Nassana Dantis. Alla finestra, una figura che non avevi visto entrare.");
        done();
      });
    }
    function fightIsola() {
      H.fight({ title: "Isola Bianca", arena: "sale", foeCol: "#6b7280", foeEye: "#ef4444", waves: [[["base", 5]], [["lesto", 4], ["scudo", 1]], [["grosso", 2], ["base", 3]]] }, (r) => {
        if (!r.win) { say("ms_tali", "[sorpreso] Ritirata! Ritirata! Ho ancora bisogno di voi, possibilmente interi!"); return done(); }
        F.set("ms_isola_vinta", true); return talk.ms_tali();
      });
    }
    function fightPrelato() {
      H.fight({ title: "Borgo Orizzonte", arena: "tana", waves: [[["base", 5]], [["lesto", 4], ["base", 2]], [["scudo", 3], ["grosso", 1]], [["boss", 1], ["base", 3]]] }, (r) => {
        if (!r.win) { say("ms_mordini", "Contromisura regge. Non per sempre. Riprovare. Subito. Prima che finisca."); return done(); }
        setStep(N, 5); K.learnLore("l_navenera");
        say("voce", "Il Prelato crolla. Lo sciame si alza come fumo, la Nave Nera accende i motori e sale nel buio. Metà della squadra di Orizzonte è a bordo. Metà è qui, a terra, che ricomincia a muoversi.");
        say("ms_sindaca", "[triste] Il portiere, il capitano, i due gemelli... li ho visti salire. Camminavano. Non si sono neanche voltati.");
        say("voce", "Vicino al campo, una divisa bianca della Federazione. Ascanio Williams. Ti guarda come si guarda un fantasma.");
        done();
      });
    }

    const talk = {
      ms_fumo() {
        if (K.rel.scene("ms_fumo")) return;
        if (S() === 0) {
          say("ms_fumo", "[furbo] Due nomi reclutati, due mondi in meno da salvare da soli. Ottimo inizio. Ecco i prossimi.");
          say("ms_fumo", "Zero: la detenuta più pericolosa del Purgatorio, la nave-prigione. Ho pagato il Direttore per rilasciarla. Il Direttore ha accettato. Questo mi preoccupa.");
          say("ms_fumo", "Tano: il miglior sicario del Mediterraneo, e il miglior portiere che nessuno ha mai visto giocare. È a Porto Illio, sulla Torre Dantis, per un ultimo lavoro.");
          say("ms_fumo", "Tali: un'ingegnera della Flotta dei Pescatori, bloccata sull'Isola Bianca con i dati di suo padre. Gli automi dell'isola non la lasciano andare.");
          setStep(N, 1); K.learnLore("l_flotta"); quest("ms_c2", "Tre nomi", "Parla con Jolly in plancia e scegli la rotta: Purgatorio, Porto Illio, Isola Bianca.");
          return wask("Il Signor Fumo spegne una sigaretta e ne accende un'altra.", [
            { label: "🔵 «Una detenuta, un sicario e una ragazza in pericolo. Bel gruppo.»", w: { esempio: 1 }, fn: () => { say("ms_fumo", "[ride] Il migliore che si possa comprare. Il resto, Comandante, dovrai guadagnartelo."); done(); } },
            { label: "🔴 «Cosa c'è nei dati del padre di Tali?»", w: { spregio: 1 }, fn: () => { F.set("ms_fumo_dati", true); say("ms_fumo", "[furbo] Domanda acuta. Portameli, se puoi. Cerbero sa essere riconoscente."); done(); } }
          ]);
        }
        return K.PASS;
      },
      ms_jolly() {
        if (K.rel.scene("ms_jolly")) return;
        const s = S();
        if (s === 0) { say("ms_jolly", "Prima la Sala Tattica, Comandante. Il capo vuole parlarti. Io intanto lucido la cloche."); return done(); }
        if (s >= 6) return K.PASS;
        const opts = [];
        if (s >= 1 && !rec("ms_zero")) opts.push({ label: "⛓️ Il Purgatorio", sub: "Nave-prigione · Zero · passa una fascia del giorno", fn: () => travel("ms_purgatorio", "Purgatorio! Una nave piena di gente arrabbiata. Mi sento già a casa.") });
        if (s >= 1 && !rec("ms_tano")) opts.push({ label: "🏙️ Porto Illio", sub: "Torre Dantis · Tano · passa una fascia", fn: () => travel("ms_illio", "Porto Illio: yacht, vetrine e gente che ti vende la tua stessa ombra.") });
        if (s >= 1 && !rec("ms_tali")) opts.push({ label: "🏝️ Isola Bianca", sub: "Saline e automi · Tali · passa una fascia", fn: () => travel("ms_isola", "Isola Bianca. Portatevi gli occhiali da sole. E qualcosa contro i robot.") });
        if (s >= 2) opts.push({ label: "🔥 Borgo Orizzonte", sub: "Sotto attacco adesso", big: true, cls: "hot", fn: () => { setStep(N, Math.max(3, s)); quest("ms_c2c", "Le torri di Orizzonte", "Riaccendi le tre torri di difesa del paese."); travel("ms_orizzonte", "Tenetevi forte. Atterro sul campo da calcio: è l'unico posto piatto."); } });
        opts.push({ label: "🌃 Porto Omega", sub: "Passa una fascia", fn: () => travel("ms_omega", "Omega. Di nuovo. Ormai il barista mi saluta per nome.") });
        opts.push({ label: "↩ Resta a bordo", fn: () => { say("ms_jolly", "Resto qui. Sono bravissimo a restare qui."); done(); } });
        say("ms_jolly", "[ride] Rotta, Comandante? La Normanna va dove le dici. Più o meno.");
        return ask("Dove si va?", opts);
      },
      ms_curiale() {
        if (K.rel.scene("ms_curiale")) return;
        if (rec("ms_zero")) { say("ms_curiale", "[arrabbiato] Ho un ufficio da ricostruire e un carcere da riempire. Fuori, Comandante."); return done(); }
        if (F.is("ms_purg_vinto")) { say("ms_curiale", "[freddo] La cella grande, al centro. Prendetela e andatevene. La fattura arriverà a Cerbero."); return done(); }
        say("ms_curiale", "[furbo] Comandante! Benvenuto al Purgatorio. Il pagamento di Cerbero è arrivato, la detenuta è pronta. Prego, da questa parte.");
        say("ms_curiale", "Ah, un dettaglio: c'è chi paga molto bene per un Comandante tornato dal mare. Niente di personale. Guardie!");
        return ask("Il Direttore fa un passo indietro. Le guardie un passo avanti.", [
          { label: "⏸ Combatti", sub: "Scontro «Squadra in Pausa» · 3 ondate", big: true, cls: "hot", fn: fightPurgatorio },
          { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => talk.ms_curiale(), true) },
          { label: "↩ Ritirati sulla Normanna", fn: () => K.go("ms_normanna", 7, 11) }
        ]);
      },
      ms_guardia() {
        if (K.rel.scene("ms_guardia")) return;
        say("ms_guardia", F.is("ms_purg_vinto") ? "[pensa] La detenuta della cella grande? Sei anni che le porto da mangiare. Mi ha detto grazie una volta. Me lo ricordo ancora." : "Circolare. Qui si cammina in fila, anche se la fila sei solo tu."); done();
      },
      ms_zero() {
        if (K.rel.scene("ms_zero")) return;
        if (rec("ms_zero")) return K.PASS;
        say("ms_zero", "[arrabbiato] E tu chi saresti? Un altro che mi compra? Mi hanno venduto tre volte quest'anno. Il prezzo sale. Il servizio peggiora.");
        say("ms_zero", "Il Signor Fumo? Cerbero? [ride] Cerbero mi ha tenuta in una stanza bianca per due anni, prima di questa. Sai cosa voglio? Rompere qualcosa di loro. Grande.");
        return wask("Zero ti fissa. L'aria intorno a lei vibra.", [
          { label: "🔵 «Vieni per le squadre. Poi rompi quello che vuoi.»", w: { esempio: 1 }, fn: () => { K.crew.recruit("ms_zero"); say("ms_zero", "[pensa] Prima il lavoro, poi la festa? Va bene. Ma la festa la scelgo io."); say("voce", "Zero si unisce alla squadra. Potere nella Ruota: 💥 Onda d'urto (spinge indietro e colpisce chi è vicino)."); three(); done(); } },
          { label: "🔴 «Ti do i file di Cerbero su di te. Tutti.»", w: { spregio: 1 }, fn: () => { F.set("ms_zero_file", true); K.crew.recruit("ms_zero"); say("ms_zero", "[sorpreso] Tutti? Allora ci sto. Ma se mi menti, ti sposto. Lontano."); say("voce", "Zero si unisce alla squadra. Potere nella Ruota: 💥 Onda d'urto (spinge indietro e colpisce chi è vicino)."); three(); done(); } }
        ]);
      },
      ms_liara() {
        if (K.rel.scene("ms_liara")) return;
        if (!F.is("ms_liara1")) {
          F.set("ms_liara1", true);
          say("ms_liara", "[sorpreso] ...Comandante. Mi avevano detto che eri vivo. Non ci ho creduto. Ho preferito non crederci.");
          say("ms_liara", "[triste] Due anni fa ho archiviato il tuo nome sotto «dispersi». Poi l'ho spostato sotto «morti». Poi ho smesso di archiviare. Adesso vendo quello che so.");
          say("ms_liara", "Tano? È nella Torre Dantis, lassù, il palazzo d'oro. Nassana Dantis ha venduto le rotte delle squadre sparite. Lui ci è andato per chiudere il conto. Tu, se ti sbrighi, arrivi prima.");
          return wask("Liara aspetta. Non sai se vuole che tu resti o che tu vada.", [
            { label: "🔵 «Mi sei mancata, Liara.»", w: { esempio: 1 }, fn: () => { F.set("ms_liara_cuore", true); say("ms_liara", "[triste] Anche tu. Vai. Torna. In quest'ordine, per favore."); done(); } },
            { label: "«Quanto ti devo per l'informazione?»", fn: () => { say("ms_liara", "[pensa] Niente. Per te è gratis. È l'unica cosa gratis che ho."); done(); } }
          ]);
        }
        say("ms_liara", rec("ms_tano") ? "Hai preso Tano. Bene. Io continuo a vendere segreti. Tu continua a non diventarne uno." : "La Torre Dantis, Comandante. Il palazzo d'oro, a est."); done();
      },
      ms_capo() {
        if (K.rel.scene("ms_capo")) return;
        if (F.is("ms_torre_vinta")) { say("ms_capo", "[freddo] Io non ho visto niente. È il mio lavoro."); return done(); }
        say("ms_capo", "[freddo] La signora Dantis non riceve. Nemmeno i fantasmi. Soprattutto i fantasmi.");
        return ask("La sicurezza della torre ti sbarra la strada.", [
          { label: "⏸ Passa con la forza", sub: "Scontro «Squadra in Pausa» · 3 ondate", big: true, cls: "hot", fn: fightTorre },
          { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => talk.ms_capo(), true) },
          { label: "↩ Non ancora", fn: done }
        ]);
      },
      ms_nassana() {
        if (K.rel.scene("ms_nassana")) return;
        if (rec("ms_tano")) { say("voce", F.is("ms_nassana_viva") ? "Nassana Dantis aspetta l'arrivo della Guardia Costiera, seduta, con le mani in grembo." : "La scrivania è vuota. Sul vetro, una ditata e il riflesso di una città che non sa niente."); return done(); }
        if (!F.is("ms_torre_vinta")) { say("ms_nassana", "Chi l'ha fatta salire?"); return done(); }
        say("ms_nassana", "[furbo] Il Comandante della Normanna. E dietro di lei... Tano. Allora è vero: ho venduto le rotte sbagliate alle persone sbagliate.");
        say("ms_tano", "[serio] Diciannove squadre, signora. Le rotte erano sue. Io sono qui per l'ultimo lavoro. Poi, forse, per il primo vero.");
        return wask("Tano ti guarda. Aspetta la tua parola, non il tuo permesso.", [
          { label: "🔴 Lascia che Tano chiuda il conto", sub: "Fuori scena", w: { spregio: 2 }, fn: () => { F.set("ms_nassana_viva", false); say("voce", "Ti volti verso la finestra. Quando ti rigiri, Tano sta stringendo il rosario e la stanza è silenziosa."); say("ms_tano", "[triste] Fatto. Non mi sento meglio. Non mi sono mai sentito meglio. Grazie di non avermi fermato."); recruitTano(); } },
          { label: "🔵 «Consegnala alla Guardia Costiera. Che parli.»", w: { esempio: 2 }, fn: () => { F.set("ms_nassana_viva", true); K.bond("risorse", 1); say("ms_nassana", "[sorpreso] Mi... risparmia? Allora parlerò. Rotte, nomi, date. Tutto. Anche quelle che non ricordavo di sapere."); say("ms_tano", "[pensa] Trent'anni senza che nessuno mi fermasse. Strano. È più leggero."); recruitTano(); } }
        ]);
      },
      ms_tano() {
        if (K.rel.scene("ms_tano")) return;
        if (rec("ms_tano")) return K.PASS;
        say("ms_tano", "[serio] Non qui. Prima lei."); done();
      },
      ms_tali() {
        if (K.rel.scene("ms_tali")) return;
        if (rec("ms_tali")) return K.PASS;
        if (!F.is("ms_isola_vinta")) {
          say("ms_tali", "[sorpreso] Una nave! Persone! Persone senza occhi rossi! Sono Tali. Gli automi dell'isola mi tengono chiusa qui da tre giorni. Sto finendo il caffè. È grave.");
          return ask("Dalle saline arrivano gli automi, in fila, lenti e testardi.", [
            { label: "⏸ Proteggi Tali", sub: "Scontro «Squadra in Pausa» · 3 ondate", big: true, cls: "hot", fn: fightIsola },
            { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => talk.ms_tali(), true) },
            { label: "↩ Non ancora", fn: done }
          ]);
        }
        say("ms_tali", "[felice] Grazie! Davvero. Mio padre studiava i Raccoglitori. È venuto qui e non è tornato. Ha lasciato questi dati. E un messaggio: «non fidatevi della luce gialla».");
        K.inv.give("ms_dati");
        return wask("Tali stringe i Dati di Rael al petto.", [
          { label: "🔵 «Tienili tu. Sono di tuo padre e della Flotta.»", w: { esempio: 1 }, fn: () => { F.set("ms_dati_flotta", true); K.inv.take("ms_dati"); K.crew.recruit("ms_tali"); say("ms_tali", "[triste] Grazie. Li porterò alla Flotta, quando torno. Se torno. Intanto vengo con te: la tua nave fa un rumore strano al motore tre."); afterTali(); } },
          { label: "🔴 «Li prende Cerbero. Servono alla missione.»", sub: "+3 Risorse", w: { spregio: 1 }, fn: () => { F.set("ms_dati_cerbero", true); K.bond("risorse", 3); K.crew.recruit("ms_tali"); say("ms_tali", "[pensa] ...Va bene. Se servono a riportare a casa qualcuno, va bene. Ma me lo ricorderò."); afterTali(); } }
        ]);
      },
      ms_sindaca() {
        if (K.rel.scene("ms_sindaca")) return;
        const s = S();
        if (s === 3) { say("ms_sindaca", "[arrabbiato] Le tre torri di difesa! Le abbiamo comprate con la colletta della sagra. Riaccendile, ti prego: sono dove finiscono le strade, a nord, a est e a sud."); return done(); }
        say("ms_sindaca", s >= 5 ? "[triste] Domani dovevamo giocare la finale. Metteremo in campo chi c'è. Anche io, se serve." : "Il campo, Comandante. Lui è lì."); done();
      },
      ms_paesano() { say("voce", "Un uomo immobile, a metà di un passo. Gli occhi si muovono. Il resto no. Lo sciame ronza sopra di lui come un pensiero cattivo."); done(); },
      ms_paesana() { say("voce", "Una ragazza con un pallone fermo sul piede. Non cade. Non si muove. Aspetta qualcosa che non sa."); done(); },
      ms_prelato() {
        if (K.rel.scene("ms_prelato")) return;
        if (S() < 4) { say("voce", "Una sagoma alta al centro del campo. Non si muove ancora. Le torri, prima: sono la sola cosa che lo tiene lontano."); return done(); }
        say("ms_prelato", "[freddo] COMANDANTE. TI ABBIAMO PERSO UNA VOLTA. NON CI SARÀ UNA SECONDA.");
        say("ms_mordini", "Contromisura attiva! Squadra protetta! Dieci minuti, forse. Forse nove. Non contare, combattere!");
        return ask("Lo sciame scende sul campo di Orizzonte.", [
          { label: "⏸ Difendi Orizzonte", sub: "Scontro «Squadra in Pausa» · 4 ondate, con il capo", big: true, cls: "hot", fn: fightPrelato },
          { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => talk.ms_prelato(), true) }
        ]);
      },
      ms_ascanio() {
        if (K.rel.scene("ms_ascanio")) return;
        if (S() < 5) return done();
        say("ms_ascanio", "[arrabbiato] Due anni. Due anni a portarti fiori su un mare. E tu sei vivo, e lavori per Cerbero. Per Cerbero!");
        say("ms_ascanio", "[triste] Ho visto cosa ha fatto Cerbero, sai. Stanze bianche. Persone comprate. E adesso c'è il tuo nome sulla loro nave.");
        return wask("Ascanio aspetta una risposta che non ti farà comodo.", [
          { label: "🔵 «Ho bisogno delle loro navi, non dei loro ordini.»", w: { esempio: 1 }, fn: () => { F.set("ms_ascanio_ok", true); say("ms_ascanio", "[pensa] Spero tu abbia ragione. Davvero. Se sbagli, vengo a prenderti io. Con i fiori, stavolta per te."); fin(); } },
          { label: "🔴 «Faccio quello che serve. Anche questo.»", w: { spregio: 1 }, fn: () => { say("ms_ascanio", "[freddo] Allora non sei la persona che ho pianto. Buona fortuna, Comandante. Ti servirà."); fin(); } },
          { label: "«Vieni con noi. Vedi tu stessa.»", fn: () => { say("ms_ascanio", "[triste] No. Io ho una divisa. Tu, a quanto pare, ne hai cambiata una. Addio, Comandante."); fin(); } }
        ]);
      }
    };
    function recruitTano() { K.crew.recruit("ms_tano"); K.inv.give("ms_rosario"); say("voce", "Tano si unisce alla squadra. Potere nella Ruota: 🗡️ Colpo dall'ombra (mette a terra un nemico). Sul pavimento ha lasciato il rosario: lo raccogli tu."); three(); done(); }
    function afterTali() { say("voce", "Tali si unisce alla squadra. Potere nella Ruota: 🛸 Drone esca (i nemici inseguono il drone per qualche secondo)."); three(); done(); }
    // le tre torri di difesa: console «M» dentro Orizzonte
    function tower(k, name) {
      return () => {
        if (S() < 3) { say("voce", "Una torre di difesa spenta. Il paese l'ha comprata con la colletta della sagra."); return done(); }
        if (F.is(k)) { say("voce", `${name}: accesa. Ronza come un frigorifero arrabbiato.`); return done(); }
        F.set(k, true);
        const n = ["ms_tr1", "ms_tr2", "ms_tr3"].filter((x) => F.is(x)).length;
        say("ms_edi", `${name} riattivata. Torri in funzione: ${n} su 3.`);
        if (n >= 3) { setStep(N, 4); quest("ms_c2d", "Il Prelato", "Al centro del campo di Orizzonte: affronta il comandante dei Raccoglitori."); say("voce", "Le tre torri si accendono insieme. Lo sciame si ritira verso il campo da calcio. Al centro, una sagoma più alta delle altre si volta verso di te."); }
        done();
      };
    }

    const back = { "0,10": { to: "ms_normanna", at: [27, 10] }, "0,11": { to: "ms_normanna", at: [27, 11] } };
    const shipEdge = (L) => { const { lay, put } = L; lay(0, 0, 29, 1, "w"); lay(0, 20, 29, 21, "w"); lay(0, 0, 0, 21, "w"); lay(29, 0, 29, 21, "w"); lay(1, 2, 28, 2, "O"); lay(1, 19, 28, 19, "O"); lay(1, 2, 1, 19, "O"); lay(28, 2, 28, 19, "O"); [[1, 2], [28, 2], [1, 19], [28, 19]].forEach(([x, y]) => put(x, y, "w")); put(1, 10, "Q"); put(1, 11, "Q"); put(0, 10, "q"); put(0, 11, "q"); };
    const zones = {
      ms_purgatorio: {
        region: "carcere", name: "Il Purgatorio", short: "Purgatorio", sub: "Una nave-prigione che non attracca mai", bg: "ms_purgatorio", time: "notte", w: 30, h: 22, base: "Q", start: [3, 10],
        itemCos: "ms_c2", items: [[11, 17], [27, 9], [12, 11], [24, 17]],
        areas: [[2, 8, 6, 13, "La passerella"], [12, 3, 19, 8, "Il blocco di massima sicurezza"], [21, 3, 26, 8, "L'ufficio del Direttore"], [0, 0, 29, 21, "Purgatorio · ponte delle celle"]],
        act: { M: "Guarda la console", O: "Guarda il mare", z: "Guarda le casse", l: "Guarda il faro", n: "Leggi il cartello", K: "Guarda la bitta", q: "Torna sulla Normanna" },
        flavor: { M: "Una console di sorveglianza: cento celle, cento puntini verdi. Uno rosso, al centro. Lampeggia come se fosse arrabbiato.", O: "Il mare intorno al Purgatorio. Nessuno nuota via da qui: troppo lontano, troppo scuro.", z: "Casse di razioni: «PASTO A · PASTO B · PASTO A, DI NUOVO».", l: "Un faro di sorveglianza che gira piano. Ogni giro, un'ombra in meno sul ponte.", n: "Il cartello: «PURGATORIO · VISITE SOLO SU APPUNTAMENTO · USCITE SOLO SU MIRACOLO».", K: "Una bitta senza cima. Il Purgatorio non attracca da undici anni." },
        doors: back,
        npcs: () => [{ id: "ms_curiale", at: [5, 10] }, { id: "ms_guardia", at: [20, 11], route: [[20, 11], [26, 11], [26, 12], [20, 12]], speed: 0.35, pause: 50 }],
        intro: [["voce", "Il Purgatorio: una nave-prigione grigia, ferma in mezzo al mare come un pensiero che non se ne va."], ["voce", "Alla passerella, il Direttore Curiale ti aspetta con un sorriso da albergatore."]],
        build(L) {
          const { lay, put, house } = L; shipEdge(L);
          house(4, 4, 6, 4, { door: [6, 7], roof: "#3f3f46", wall: "#71717a", enter: "Il Blocco A: corridoi, sbarre e un odore di candeggina che non nasconde niente." });
          house(12, 4, 8, 5, { door: [15, 8], roof: "#7f1d1d", wall: "#a1a1aa", enter: { to: "ms_cella", at: [7, 8], locked: () => (F.is("ms_purg_vinto") ? false : "La porta della cella grande è chiusa. Prima il Direttore e le sue guardie.") } });
          house(21, 4, 6, 4, { door: [23, 7], roof: "#450a0a", wall: "#d4d4d8", enter: "L'ufficio del Direttore: una poltrona di pelle, un acquario e una cassaforte. L'acquario è l'unica cosa onesta." });
          house(4, 14, 6, 4, { door: [6, 14], roof: "#3f3f46", wall: "#71717a", enter: "La mensa del carcere: tavoli avvitati, cucchiai di plastica, un menù che non cambia dal 2014." });
          house(14, 14, 6, 4, { door: [16, 14], roof: "#3f3f46", wall: "#71717a", enter: "La lavanderia: uniformi arancioni ovunque. Su una, a pennarello: «ZERO · NON TOCCARE · DAVVERO»." });
          [[24, 14], [25, 14], [10, 10]].forEach(([x, y]) => put(x, y, "M")); [[22, 15], [23, 17], [11, 12]].forEach(([x, y]) => put(x, y, "z"));
          [[8, 9], [20, 9], [12, 17], [26, 9]].forEach(([x, y]) => put(x, y, "l")); put(4, 8, "n"); [[3, 5], [3, 17]].forEach(([x, y]) => put(x, y, "K"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "MASSIMA SICUREZZA", d.X(15) + 8, d.Y(4) - 6, "#fca5a5"); H.plaque(g, "DIRETTORE", d.X(23) + 8, d.Y(4) - 6, "#e5e7eb"); H.plaque(g, "◂ NORMANNA", d.X(2) + 8, d.Y(9) - 6, "#7dd3fc"); H.plaque(g, "BLOCCO A", d.X(6) + 8, d.Y(4) - 6, "#d4d4d8"); }
      },
      ms_cella: {
        interior: true, region: "cella", name: "La cella di massima sicurezza", short: "Cella", sub: "Pareti bianche, luce rossa, una sedia sola", bg: "ms_cella", w: 14, h: 10, start: [7, 8], outside: ["ms_purgatorio", 15, 9], base: "+",
        act: { M: "Guarda la console", b: "Guarda la sedia", l: "Guarda la luce", n: "Leggi la targa" },
        flavor: { M: "La console della cella: «STASI · LIVELLO 3». Qualcuno ha premuto «SPEGNI». Più volte. Con rabbia.", b: "Una sedia di metallo, avvitata al pavimento. Le cinghie sono spezzate.", l: "Una luce rossa che pulsa piano. Fa sembrare tutto un cuore stanco.", n: "La targa: «DETENUTA ZERO · TRASFERITA DA: (cancellato) · NOTE: (cancellato) · NON GUARDARLA NEGLI OCCHI»." },
        npcs: () => (rec("ms_zero") ? [] : [{ id: "ms_zero", at: [7, 4] }]),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(3, 2, 3, 6, "a"); lay(11, 2, 11, 6, "a"); put(7, 2, "b"); [[5, 1], [9, 1]].forEach(([x, y]) => put(x, y, "M")); [[1, 4], [12, 4]].forEach(([x, y]) => put(x, y, "l")); put(1, 7, "n");
        },
        decor(g, cx, cy, d) { H.plaque(g, "DETENUTA ZERO", d.X(7) + 8, d.Y(0) + 6, "#fca5a5"); }
      },
      ms_illio: {
        region: "illio", name: "Porto Illio", short: "Porto Illio", sub: "Yacht, vetrine e una torre d'oro", bg: "ms_illio", time: "giorno", w: 30, h: 22, base: ",", start: [2, 10],
        itemCos: "ms_c2", items: [[9, 4], [12, 18], [17, 18], [27, 19]],
        areas: [[1, 13, 9, 20, "Il porticciolo"], [10, 7, 16, 13, "La piazza delle vetrine"], [20, 2, 28, 9, "Torre Dantis"], [0, 0, 29, 21, "Porto Illio"]],
        act: { u: "Guarda il tavolino", b: "Siediti", l: "Guarda il lampione", n: "Leggi il cartello", N: "Guarda l'insegna", K: "Guarda la bitta", s: "Riposa un momento" },
        flavor: { u: "Un tavolino del caffè: cappuccino a nove euro, vista sulla torre gratis. Per ora.", b: "Una panchina di marmo. Fredda, elegante, scomoda: Porto Illio in una panchina.", l: "Un lampione dorato. Anche la luce, qui, ha un prezzo.", n: "Il cartello: «TORRE DANTIS · SOLO SU APPUNTAMENTO · I SOGNI SI COMPRANO AL PIANO TERRA».", N: "Un'insegna che scorre: «COMPRA · VENDI · DIMENTICA».", K: "Una bitta lucidata a mano. A Porto Illio lucidano anche le bitte.", s: "Una fontanella all'ombra. L'unica cosa gratis del porto." },
        doors: { "0,10": { to: "ms_normanna", at: [27, 10] }, "0,11": { to: "ms_normanna", at: [27, 11] } },
        npcs: () => [{ id: "ms_liara", at: [12, 10] }],
        intro: [["voce", "Porto Illio: yacht bianchi, vetrine d'oro e gente che sorride come se ti stesse misurando."], ["voce", "A est, la Torre Dantis. In piazza, ai tavolini del caffè, qualcuno che conosci."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(29, 0, 29, 21, "t"); lay(0, 0, 0, 9, "t"); lay(0, 12, 0, 21, "w");
          lay(1, 14, 9, 21, "w"); lay(1, 13, 9, 13, ":"); [[3, 13], [7, 13]].forEach(([x, y]) => put(x, y, "K")); lay(1, 21, 29, 21, "w");
          lay(1, 10, 28, 11, "+"); lay(10, 7, 16, 13, "+"); lay(22, 9, 23, 11, "+"); lay(10, 14, 28, 20, ","); lay(12, 16, 26, 16, ":");
          house(20, 2, 8, 7, { door: [23, 8], roof: "#ca8a04", wall: "#fef3c7", enter: { to: "ms_torre", at: [8, 10] } });
          house(2, 2, 6, 5, { door: [4, 6], roof: "#b91c1c", wall: "#fef3c7", flowers: true, enter: "Una boutique di scarpe da calcio dorate. Il commesso ti guarda le scarpe e sospira." });
          house(11, 2, 6, 4, { door: [13, 5], roof: "#1e3a8a", wall: "#f1f5f9", enter: "Una banca. Il direttore ti saluta per nome e ti chiede se vuoi aprire un conto «per la vita dopo»." });
          house(18, 14, 5, 4, { door: [20, 17], roof: "#15803d", wall: "#fef3c7", enter: "Un museo del calcio privato: maglie storiche sotto vetro. Una vetrina è vuota: «In restauro». Era di una squadra sparita." });
          [[11, 9], [15, 9], [11, 12], [15, 12]].forEach(([x, y]) => put(x, y, "u")); [[10, 9], [16, 12]].forEach(([x, y]) => put(x, y, "b"));
          [[9, 10], [19, 12], [24, 12], [8, 7]].forEach(([x, y]) => put(x, y, "l")); put(18, 9, "N"); put(19, 10, "n"); put(26, 18, "s");
          [[24, 14], [26, 14], [11, 19], [14, 19], [17, 19], [22, 19]].forEach(([x, y]) => put(x, y, "t"));
          put(0, 10, "q"); put(0, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "TORRE DANTIS", d.X(23) + 8, d.Y(2) - 6, "#fde68a"); H.plaque(g, "CAFFÈ", d.X(13) + 8, d.Y(7) - 6, "#fef3c7"); H.plaque(g, "◂ NORMANNA", d.X(2) + 8, d.Y(9) - 6, "#7dd3fc"); H.plaque(g, "MUSEO", d.X(20) + 8, d.Y(14) - 6, "#bbf7d0"); }
      },
      ms_torre: {
        interior: true, region: "torre", name: "Torre Dantis · ultimo piano", short: "Torre Dantis", sub: "Vetro, oro e una città ai tuoi piedi", bg: "ms_torre", w: 16, h: 12, start: [8, 10], outside: ["ms_illio", 23, 9], base: "+",
        act: { u: "Guarda la scrivania", M: "Guarda lo schermo", b: "Siediti", l: "Guarda la lampada", n: "Leggi la targa", z: "Guarda le casse" },
        flavor: { u: "Una scrivania di vetro: contratti, firme, una lista di rotte con diciannove nomi di paese.", M: "Uno schermo con le quotazioni dei calciatori. Alcuni nomi sono barrati. Non per infortunio.", b: "Una poltrona bianca. Comoda come un'offerta che non puoi rifiutare.", l: "Una lampada d'oro a forma di pallone. Brutta, costosissima.", n: "La targa: «NASSANA DANTIS · PROCURATRICE · TUTTO HA UN PREZZO».", z: "Casse di champagne della finale di coppa. Non è mai stato stappato: la squadra non è arrivata." },
        npcs: () => [{ id: "ms_capo", at: [8, 7] }].concat(F.is("ms_torre_vinta") ? [{ id: "ms_nassana", at: [8, 3] }].concat(rec("ms_tano") ? [] : [{ id: "ms_tano", at: [13, 4] }]) : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          lay(6, 2, 10, 2, "u"); [[2, 1], [13, 1]].forEach(([x, y]) => put(x, y, "M")); [[3, 4], [3, 6], [12, 7]].forEach(([x, y]) => put(x, y, "b")); [[1, 8], [14, 8]].forEach(([x, y]) => put(x, y, "l")); put(1, 2, "n"); put(14, 10, "z");
        },
        decor(g, cx, cy, d) { H.plaque(g, "DANTIS", d.X(8) + 8, d.Y(0) + 6, "#fde68a"); }
      },
      ms_isola: {
        region: "isola", name: "L'Isola Bianca", short: "Isola Bianca", sub: "Saline accecanti, rottami e automi", bg: "ms_isola", time: "giorno", w: 30, h: 22, base: ",", start: [2, 10],
        itemCos: "ms_c2", items: [[6, 4], [15, 18], [27, 3], [21, 16]],
        areas: [[1, 8, 6, 13, "L'approdo"], [12, 4, 18, 10, "Le vasche di sale"], [20, 7, 27, 14, "Il relitto"], [0, 0, 29, 21, "Isola Bianca"]],
        act: { E: "Guarda il relitto", M: "Guarda il terminale", r: "Guarda la roccia", z: "Guarda le casse", n: "Leggi il cartello", s: "Riposa all'ombra" },
        flavor: { E: "Pezzi della navetta di Tali: lamiere viola, piegate come carta. Su una, a pennarello: «non è colpa mia (quasi)».", M: "Un terminale degli automi dell'isola. Ripete in loop: «PROTEGGERE IL SALE. PROTEGGERE IL SALE. PERCHÉ? PROTEGGERE IL SALE».", r: "Una roccia bianca, calda come una stufa. Fa un'ombra piccola e preziosa.", z: "Casse di sale da esportazione. Il sale dell'Isola Bianca, dicono, fa ricordare le cose.", n: "Il cartello: «SALINE DI RAEL · ACCESSO VIETATO · GLI AUTOMI NON ACCETTANO SCUSE».", s: "L'ombra di una roccia. Ti siedi. Il sole, per un attimo, si dimentica di te." },
        doors: back,
        npcs: () => (rec("ms_tali") ? [] : [{ id: "ms_tali", at: [22, 11] }]),
        intro: [["voce", "L'Isola Bianca: saline fino all'orizzonte, un sole che picchia e un silenzio di metallo."], ["voce", "A est, i rottami di una navetta viola. In mezzo ai rottami, qualcuno che agita le braccia."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "r"); lay(0, 21, 29, 21, "r"); lay(29, 0, 29, 21, "r"); lay(0, 0, 0, 9, "w"); lay(0, 12, 0, 21, "w"); lay(1, 0, 2, 7, "w"); lay(1, 14, 2, 21, "w");
          lay(1, 10, 20, 11, ":"); lay(12, 4, 13, 8, "w"); lay(15, 4, 16, 8, "w"); lay(12, 13, 16, 16, "w"); lay(3, 15, 7, 18, "w");
          lay(23, 8, 26, 9, "E"); lay(25, 12, 27, 13, "E"); [[24, 13], [21, 8]].forEach(([x, y]) => put(x, y, "M"));
          [[5, 6], [9, 3], [9, 16], [19, 4], [26, 17], [18, 19], [10, 13]].forEach(([x, y]) => put(x, y, "r")); [[20, 13], [22, 15]].forEach(([x, y]) => put(x, y, "z"));
          put(4, 9, "n"); put(9, 7, "s"); put(29, 0, "w"); put(29, 21, "w"); put(0, 10, "q"); put(0, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALINE DI RAEL", d.X(14) + 8, d.Y(3) - 6, "#78716c"); H.plaque(g, "RELITTO", d.X(24) + 8, d.Y(7) - 6, "#d8b4fe"); H.plaque(g, "◂ NORMANNA", d.X(2) + 8, d.Y(9) - 6, "#0c4a6e"); }
      },
      ms_orizzonte: {
        region: "orizzonte", name: "Borgo Orizzonte", short: "Orizzonte", sub: "Un paese immobile e uno sciame che ronza", bg: "ms_orizzonte", time: "tramonto", w: 30, h: 22, base: ",", start: [2, 10],
        itemCos: "ms_c2", items: [[8, 3], [27, 18], [10, 17], [27, 6]],
        areas: [[11, 7, 20, 14, "Il campo di Orizzonte"], [12, 1, 17, 3, "La torre nord"], [25, 9, 28, 12, "La torre est"], [12, 17, 17, 20, "La torre sud"], [0, 0, 29, 21, "Borgo Orizzonte"]],
        act: { M: "Riattiva la torre", g: "Guarda la porta", n: "Leggi il cartello", l: "Guarda il lampione", b: "Siediti", z: "Guarda le casse", u: "Guarda la bancarella" },
        flavor: { g: "Una porta da calcio con la rete rattoppata. Domani doveva esserci la finale regionale.", n: "Il cartello: «BORGO ORIZZONTE · FINALE REGIONALE DOMANI · PORTATE LE SEDIE DA CASA».", l: "Un lampione con un festone di bandierine verdi. Si muove solo lui, nel vento.", b: "Una panchina con una sciarpa dimenticata sopra.", z: "Casse di birra per la festa di domani. Ancora fresche.", u: "Una bancarella di panini: il venditore è fermo con il coltello a metà di un salame." },
        doors: back,
        npcs: (s) => [{ id: "ms_sindaca", at: [7, 12] }, { id: "ms_paesano", at: [9, 6] }, { id: "ms_paesana", at: [21, 15] }].concat(s < 5 ? [{ id: "ms_prelato", at: [15, 10] }] : [{ id: "ms_ascanio", at: [9, 9] }]),
        intro: [["voce", "Borgo Orizzonte, al tramonto. Nessuno si muove. Le persone sono ferme a metà gesto, come statue di un paese che non ha finito la frase."], ["voce", "Sopra le case ronza uno sciame d'oro. Tre torri di difesa sono spente: una a nord, una a est, una a sud."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(29, 0, 29, 21, "t"); lay(0, 0, 0, 9, "t"); lay(0, 12, 0, 21, "t");
          lay(1, 10, 28, 11, ":"); lay(14, 1, 15, 20, ":"); lay(11, 7, 20, 14, "-"); put(11, 10, "g"); put(20, 10, "g"); lay(11, 10, 20, 11, "-");
          house(2, 2, 5, 4, { door: [4, 5], roof: "#9a3412", wall: "#fde7c4", flowers: true, enter: "Una casa con la tavola apparecchiata: sei piatti, sei bicchieri, sei sedie vuote." });
          house(3, 14, 6, 4, { door: [5, 14], roof: "#166534", wall: "#fef3c7", enter: { room: "casa", name: "Il municipio-spogliatoio", who: [] } });
          house(22, 2, 5, 4, { door: [24, 5], roof: "#9a3412", wall: "#fde7c4", enter: "La sede della squadra: coppe piccole, foto grandi, una lavagna con la formazione di domani." });
          house(22, 15, 5, 4, { door: [24, 15], roof: "#1e3a8a", wall: "#fef3c7", enter: "L'unico bar del paese: la TV è accesa sul telegiornale. Il barista è fermo con la tazzina a mezz'aria." });
          put(14, 2, "M"); put(27, 11, "M"); put(14, 19, "M");
          [[8, 8], [21, 8], [8, 13], [21, 13]].forEach(([x, y]) => put(x, y, "l")); [[10, 4], [19, 4]].forEach(([x, y]) => put(x, y, "b")); put(4, 9, "n"); [[18, 17], [19, 17]].forEach(([x, y]) => put(x, y, "z")); put(10, 16, "u");
          put(0, 10, "q"); put(0, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "TORRE NORD", d.X(14) + 8, d.Y(1) - 6, "#fde68a"); H.plaque(g, "TORRE EST", d.X(27) + 8, d.Y(10) - 6, "#fde68a"); H.plaque(g, "TORRE SUD", d.X(14) + 8, d.Y(18) - 6, "#fde68a"); H.plaque(g, "CAMPO", d.X(15) + 8, d.Y(7) - 6, "#bbf7d0"); }
      }
    };
    const shipNpcs = (s, list) => {
      const spots = { ms_mordini: [16, 17], ms_garro: [25, 10], ms_zero: [22, 9], ms_tali: [24, 12], ms_tano: [8, 6] }, on = K.crew.field();
      return list.concat(Object.keys(spots).filter((id) => K.crew.has(id) && !on.includes(id) && !list.some((n) => n.id === id)).map((id) => ({ id, at: spots[id] })));
    };
    return {
      n: N, title: "La Nave Nera", sub: "Tre nomi nuovi e un paese che non si muove",
      goal, start: "ms_normanna", introBg: "ms_titolo", zones, talk,
      patch: { ms_normanna: { npcs: shipNpcs } },
      obj: { "ms_orizzonte:M:14,2": tower("ms_tr1", "Torre nord"), "ms_orizzonte:M:27,11": tower("ms_tr2", "Torre est"), "ms_orizzonte:M:14,19": tower("ms_tr3", "Torre sud") },
      intro: [["voce", "La Normanna naviga di notte, con le luci basse. A bordo, uno scienziato canta e un cecchino calibra."], ["voce", "Nella Sala Tattica, il Signor Fumo ha già acceso la sigaretta. E l'elenco."]]
    };
  }
  boot();
})();
