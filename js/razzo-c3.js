// js/razzo-c3.js - RAZZOPACCO · CONSEGNE DAL FUTURO · Capitolo 3 «La Coppa dei Corrieri»
// L'Asteroide Arena, lo stadio sospeso nel vuoto. La finale contro la OmniPacco Galacticos. Prima, la torre di Orsola Monòpoli:
// viene dal 2025, come te. Poi la formazione, la partita, e cosa fare dopo: restare liberi, unire le ditte, tornare a casa.
(function () {
  "use strict";
  function boot() { const D = window.__razzo; if (!D || !D.addChapter || !D._has || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cast("rz_orsola", { acc: ["fischietto"], name: "Orsola Monòpoli", tag: "", hair: "#c83a2a", style: "side", skin: "#f0d0b0", eye: "#3a3a5a", bg: ["#1a1030", "#5a6ad8"], shirt: "#5a6ad8" },
      "La padrona della OmniPacco, la ditta di consegne più grande della galassia. Ibernata nel 2025, scongelata nel 3002: in nove anni ha comprato quasi tutto. Al collo porta ancora un fischietto di plastica del suo vecchio campetto.");
    K.cos("rz_c3", { kind: "shirt", label: "Maglia della Coppa dei Corrieri", val: "#c8a040", from: "Capitolo 3 di Razzopacco · Consegne dal Futuro" });
    K.cos("rz_libera", { kind: "acc", label: "Medaglia della Coppa dei Corrieri", val: "medaglia", from: "Finale «Razzopacco resta libera»" });
    K.cos("rz_fusione", { kind: "acc", label: "Fischietto di Orsola", val: "fischietto", from: "Finale «OmniRazzo: consegne per tutti»" });
    K.cos("rz_ritorno", { kind: "acc", label: "Cartolina dal 3011", val: "taccuino", from: "Finale «Il biglietto per il 2025»" });
    K.cos("rz_pacco", { kind: "acc", label: "La borsa del primo corriere", val: "borsa", from: "Finale segreto «Il pacco numero uno»" });
    const ITEMZ = ["rz_citta", "rz_brodo", "rz_luna"];
    function allStamps() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = ((Z[z] && Z[z].items) || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const onTime = () => ["plof", "minestra", "archivio"].every((id) => F.is("rz_orario_" + id));
    const goal = (s) => ({
      0: "L'Asteroide Arena. La Professoressa ti aspetta sotto gli spalti.",
      1: "Orsola Monòpoli ti ha invitato nella sua torre, prima della finale.",
      2: "La Professoressa vuole decidere chi gioca con te in finale.",
      3: "La finale: la OmniPacco Galacticos. Orsola aspetta in mezzo al campo.",
      4: "La Coppa è vostra. La Professoressa ti cerca.",
    }[s] || "La saga è conclusa. Puoi rigiocarla per trovare gli altri finali.");
    const zones = {
      rz_arena: {
        region: "arena", name: "Razzopacco · L'Asteroide Arena", short: "Asteroide Arena", sub: "Lo stadio sospeso, la torre della OmniPacco", bg: "rz_arena", time: "notte", travel: [15, 20],
        w: 30, h: 22, start: [15, 20], items: [[1, 20]], itemCos: "rz_stamps",
        areas: [[6, 3, 23, 10, "Lo stadio"], [23, 11, 29, 17, "La torre della OmniPacco"], [0, 0, 29, 21, "Asteroide Arena"]],
        flavor: { t: "Un albero di cristallo: cresce solo sugli asteroidi, e suona quando passa una cometa.", l: "Un faro dello stadio. Illumina il campo e, per sbaglio, un pianeta vicino." },
        intro: [["voce", "L'Asteroide Arena: uno stadio scavato in un sasso grande come una città, sospeso nel vuoto. Gli spalti sono pieni di tifosi di tutta la galassia: meduse, robot, cuochi di minestra, ispettori in ferie."], ["voce", "Sopra lo stadio, la torre della OmniPacco, con un'insegna che gira: «CONSEGNIAMO IL FUTURO». Sotto, più piccola: «E LO FATTURIAMO»."]],
        tubes: [{ at: [21, 19], path: [[23, 18.5], [26, 18]], out: [26, 17] }, { at: [24, 17], path: [[24, 19]], out: [24, 20] }],
        npcs: (s) => [{ id: "rz_ottavia", at: [11, 13] }, { id: "rz_borea", at: [17, 13] }, { id: "rz_ferruccio", at: [6, 13] }, { id: "rz_timbro", at: [20, 13] }, ...(s >= 3 ? [{ id: "rz_orsola", at: [15, 7] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 0, 0, 21, "a"); lay(29, 0, 29, 21, "a"); lay(0, 21, 29, 21, "a");
          lay(6, 1, 23, 2, "u"); lay(6, 3, 23, 10, "-");
          lay(1, 11, 22, 14, ":"); lay(1, 15, 22, 20, ":"); lay(23, 19, 28, 20, ":");
          L.house(12, 17, 5, 3, { door: [14, 19], roof: "#ff8a3a", wall: "#e8d8c0", rr: 1, enter: { to: "rz_razzo", at: [7, 9] } });
          L.house(24, 12, 5, 4, { door: [26, 15], roof: "#5a6ad8", wall: "#c8d0ff", rr: 2, enter: { to: "rz_omni", at: [7, 9] } });
          lay(23, 11, 23, 18, "w"); lay(23, 18, 28, 18, "w"); lay(24, 16, 28, 17, ","); put(21, 19, "O"); put(24, 17, "O");
          [[2, 12], [3, 18], [27, 3], [2, 3]].forEach(([x, y]) => put(x, y, "t")); [[5, 11], [24, 2]].forEach(([x, y]) => put(x, y, "l")); put(25, 6, "Y"); put(9, 16, "s"); put(19, 16, "A");
        },
      },
      rz_omni: {
        interior: true, region: "interno", name: "Razzopacco · La torre della OmniPacco", short: "La torre OmniPacco", sub: "L'ufficio di Orsola Monòpoli", bg: "rz_omni", w: 16, h: 12, start: [7, 9], outside: ["rz_arena", 26, 16],
        act: { K: "Guarda i pacchi", Y: "Guarda l'ologramma", T: "Guarda la scrivania", v: "Esci" },
        flavor: { T: "La scrivania di Orsola: vetro, nient'altro. Tranne una cosa: un pallone di cuoio vecchio, sgonfio, sotto una campana di vetro. Etichetta: «2025»." },
        intro: [["voce", "L'ufficio in cima alla torre: tutto vetro, tutto specchi, tutto silenzio. Dalle finestre si vede la galassia intera. In mezzo, una scrivania vuota e un pallone sgonfio sotto una campana di vetro."]],
        npcs: (s) => [...(s <= 2 ? [{ id: "rz_orsola", at: [7, 4] }] : []), { id: "rz_zeta", at: [12, 6] }],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(5, 2, 9, 2, "T"); put(2, 3, "Y"); put(13, 3, "Y"); [[1, 9], [14, 9]].forEach(([x, y]) => put(x, y, "K")); },
      },
    };
    function mate() { return F.get("rz_mate") === "ferruccio" ? { name: "Ferruccio" } : { name: "Capitana Borea" }; }
    function finale() {
      K.consegnaMatch({ title: "Consegna a Rete · Finale della Coppa dei Corrieri", oppStyle: "pressing", secs: 110, minutes: 90, mate: mate(),
        opp: { name: "OmniPacco Galacticos", color: "#5a6ad8", players: [{ name: "Orsola Monòpoli" }, { name: "Agente Zeta" }], keeper: { name: "Il Drone Omega" } },
        intro: `<p>La finale. I Galacticos fanno <b>pressing</b>: ti vengono addosso in due. Usa i <b>passaggi</b>, i <b>tubi</b> e le curve attorno ai pianeti. ${F.get("rz_mate") === "ferruccio" ? "Ferruccio commenta mentre gioca." : "La Capitana Borea è in campo con te."}</p>`, winTitle: "LA COPPA DEI CORRIERI È VOSTRA!" }, (r) => {
        if (!r.win) return K.scene([["rz_orsola", "[pensa] (Si toglie il fischietto dal collo, lo guarda.) No. Così non vale. Non avete giocato male: è il pianeta arancione che vi odia. Rigiochiamo. Si fa così, ai campetti."]], () => K.enterZone("rz_arena"), "rz_arena");
        setStep(N, 4); F.set("rz_vinta", true); bond("ditta", 3);
        K.scene([["rz_ferruccio", "[felice] FINE! FINE! LA RAZZOPACCO VINCE LA COPPA DEI CORRIERI! (Si gira la testa due volte.) Tre volte. Non si ferma più."], ["rz_orsola", "[sorpreso] (Si siede sul prato sintetico, il fischietto in mano.) Nove anni a comprare tutto. E perdo contro una ditta che consegna in ritardo per principio. (Ride, per la prima volta.) Come al campetto."]], () => K.enterZone("rz_arena"), "rz_finale");
      });
    }
    function endingAsk() {
      const opts = [{ label: "«La Razzopacco resta com'è»", sub: "Piccola, sgangherata, libera", big: true, fn: () => ending("libera") }];
      if (F.is("rz_orsola_ascoltata")) opts.push({ label: "«Orsola, vieni con noi»", sub: "Le due ditte diventano una", big: true, fn: () => ending("fusione") });
      if (F.is("rz_sigillato")) opts.push({ label: "«Ferruccio… il pacco sigillato»", sub: "È arrivato il momento in cui serve", big: true, fn: () => ending("ritorno") });
      if (allStamps() && onTime() && !F.is("rz_lasciato")) opts.unshift({ label: "«Professoressa, cosa c'è in fondo al magazzino?»", sub: "Segreto: tutti i francobolli, tutte le consegne in orario, nessuna partita lasciata", cls: "hot", big: true, fn: () => ending("pacco") });
      ask("rz_ottavia", "(Ha la Coppa in mano. È un pacco d'oro con un fiocco.) Abbiamo vinto, ragazzo. La OmniPacco ritira l'offerta. (Guarda la galassia, gli spalti, te.) E adesso, cosa consegniamo?", opts, "rz_finale");
    }
    function ending(kind) {
      const R = { libera: { coins: 140, cos: ["rz_c3", "rz_libera"] }, fusione: { coins: 160, cos: ["rz_c3", "rz_fusione"] }, ritorno: { coins: 160, cos: ["rz_c3", "rz_ritorno"] }, pacco: { coins: 260, cos: ["rz_c3", "rz_pacco"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 9);
      const lines = {
        libera: [["rz_ottavia", "[felice] Com'è! Allora domani si consegna. In ritardo, ma si consegna. (Beve spremuta di cometa.) Ah. Mi sento di nuovo centosessantenne."], ["voce", "<b>FINALE · RAZZOPACCO RESTA LIBERA.</b> La ditta più piccola della galassia vince la Coppa dei Corrieri e torna al lavoro il giorno dopo. Sul razzo arancione c'è una toppa nuova, a forma di coppa. Il motto non cambia: «Consegniamo tutto. Prima o poi»."]],
        fusione: [["rz_orsola", "[pensa] Con voi? (Guarda il fischietto.) Nel 2025 allenavo una squadra di quartiere. Non vincevamo mai, ma nessuno restava in panchina. Mi era mancato."], ["rz_ottavia", "[ride] OmniRazzo! Il nome lo scelgo io. Timbro, i moduli!"], ["voce", "<b>FINALE · OMNIRAZZO: CONSEGNE PER TUTTI.</b> I razzi della OmniPacco, il cuore della Razzopacco, e una regola nuova scritta sul muro della sede: «Nessun pacco resta indietro. Nessun corriere resta in panchina». Timbro diventa di un verde chiarissimo."]],
        ritorno: [["rz_ferruccio", "[pensa] (Tira fuori il pacco sigillato.) «Da non aprire finché non serve.» Adesso serve. (Lo apre.) Dentro c'è un biglietto: «Cella frigorifera all'indietro. Andata e ritorno: solo andata»."], ["rz_ottavia", "[triste] L'ho costruita tanti anni fa, per qualcuno che volesse tornare. Nessuno voleva. (Ti abbraccia.) Tu sì. Porta una cartolina al 2025, da parte mia."], ["voce", "<b>FINALE · IL BIGLIETTO PER IL 2025.</b> Ti risvegli al campetto di Borgo Marino, nel 2025, con l'abbronzatura spaziale e una cartolina in tasca: «Saluti dal 3011. Consegnato in ritardo, come sempre. — R.» Nessuno ti crede. Va benissimo così."]],
        pacco: [["rz_ottavia", "[sorpreso] Il magazzino? (Si gratta la testa.) Laggiù c'è il primo pacco della Razzopacco. Mai consegnato. Dal 2025. Il destinatario era…"], ["rz_ferruccio", "[felice] (Lo legge.) «Campetto di Borgo Marino, anno 2025». BIP. Novecentottantasei anni di ritardo. È un record!"], ["voce", "<b>FINALE SEGRETO · IL PACCO NUMERO UNO.</b> Lo consegni tu, al campetto, con la tuta arancione. Dentro c'è un pallone. Il tuo: quello che avevi in mano quando sei entrato nella cella frigorifera. Qualcuno, novecentottantasei anni fa, l'aveva spedito avanti nel tempo, per ritrovarti."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "rz_finale");
    }
    const talk = {
      rz_ottavia() {
        const s = S();
        if (s === 0) return K.scene([["rz_ottavia", "[felice] Ragazzo! La finale! Ho portato la spremuta, i panini e un cartello: «FORZA RAZZO». La «P» si è staccata durante il viaggio. Pazienza."], ["rz_ottavia", "[pensa] Orsola Monòpoli ti ha mandato un invito. Vuole vederti nella sua torre, prima della partita. (Ti guarda da sopra gli occhiali.) Vai. Ma non firmare niente. Neanche un autografo."]], () => { setStep(N, 1); quest("rz_orsola", "L'invito di Orsola", "La torre della OmniPacco, oltre il fossato: col tubo."); done(); }, "rz_arena");
        if (s === 2) return ask("rz_ottavia", "(Ha disegnato la formazione su un tovagliolo.) In finale si gioca in due, più il drone. Tu e chi?", [
          { label: "La Capitana Borea", sub: "Ex portiera della Lega Orbitale: ordinata, sicura", big: true, fn: () => setMate("borea") },
          { label: "Ferruccio", sub: "Commenta mentre gioca. Nessuno se lo aspetta", big: true, fn: () => setMate("ferruccio") },
        ], "rz_arena");
        if (s === 4) return endingAsk();
        return say([["rz_ottavia", s === 3 ? "Orsola è in mezzo al campo. Vai. Io bevo la spremuta e urlo." : "La torre è oltre il fossato. Il tubo ti porta. Tutto ti porta, nel 3011, tranne la pazienza."]]);
      },
      rz_orsola() {
        const s = S();
        if (s === 1) return ask("rz_orsola", "(Non si gira. Guarda la galassia dalla finestra.) Campetto di Borgo Marino, 2025. Tu giocavi lì. Io allenavo la squadra del campetto accanto. Ci battevate sempre. (Si gira.) Poi un giorno è arrivato il caldo, e un supermercato, e una cella frigorifera. Anche per me.", [
          { label: "«Raccontami cos'è successo dopo»", sub: "Ascolta la sua storia", big: true, fn: () => ascolta(true) },
          { label: "«Basta chiacchiere: ci vediamo in campo»", sub: "La sfida e basta", big: true, fn: () => ascolta(false) },
        ], "rz_omni");
        if (s === 3) return ask("rz_orsola", "(In mezzo al campo, il fischietto al collo.) Come ai campetti. Chi vince decide.", [{ label: "Gioca la finale", sub: "Consegna a Rete · la finale", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "rz_arena");
        return say([["rz_orsola", "Nove anni. Ho comprato quasi tutto. Il campetto non si compra. (Pausa.) L'ho cercato. Non c'è più."]]);
      },
      rz_borea() { return say([["rz_borea", S() >= 4 ? "[felice] Niente ha preso fuoco. Nemmeno una cosa. È il giorno più bello della mia vita." : "Il drone dei Galacticos si chiama Omega. Para tutto quello che arriva dritto. Quindi: non arrivare dritto."]]); },
      rz_ferruccio() { return say([["rz_ferruccio", "E IL PUBBLICO DELL'ASTEROIDE ARENA È IN PIEDI! (Pausa.) Anche quelli senza piedi. Si alzano come possono."]]); },
      rz_timbro() { return say([["rz_timbro", "Ho compilato il modulo per la vittoria e quello per la sconfitta. Uno lo straccerò. (Verde normale.) Spero il secondo."]]); },
      rz_zeta() { return say([["rz_zeta", S() >= 4 ? "(Senza la giacca a specchio. Sotto ha una maglietta con scritto «AMO I PACCHI».) La giacca era un'idea del marketing." : "La signora Monòpoli la riceverà. È un onore. L'onore è incluso nel prezzo."]]); },
    };
    function ascolta(si) {
      F.set(si ? "rz_orsola_ascoltata" : "rz_sfida", true); setStep(N, 2); questDone("rz_orsola");
      K.scene(si ? [["rz_orsola", "[triste] Mi hanno scongelata nel 3002. Nessuno che conoscevo. Nessun campetto. Solo pacchi. (Indica il pallone sotto la campana.) Allora ho deciso: se non potevo tornare indietro, avrei comprato tutto il futuro. Così nessuno mi avrebbe più lasciata in una cella frigorifera."], ["rz_orsola", "[pensa] Non ha funzionato. (Si mette il fischietto al collo.) Ci vediamo in campo, ragazzo del campetto accanto."]]
        : [["rz_orsola", "[furbo] Basta chiacchiere. Mi piace. Allora: in campo. Come nel 2025. (Soffia nel fischietto. Fa un fischio piccolo, di plastica.)"]], done, "rz_omni");
    }
    function setMate(k) { F.set("rz_mate", k); setStep(N, 3); say([["rz_ottavia", k === "ferruccio" ? "[ride] Ferruccio! Il pubblico impazzirà. Lui di sicuro." : "[felice] Borea. Ordine e sangue freddo. E guanti nuovi: li ho fatti io, sono a reazione. Non li usate."]]); }
    return { n: N, title: "La Coppa dei Corrieri", sub: "L'Asteroide Arena, la torre di Orsola, la finale", goal, start: "rz_arena", introBg: "rz_arena", zones, talk,
      intro: () => [["voce", "<b>RAZZOPACCO · CONSEGNE DAL FUTURO</b>. Episodio 3. La Coppa dei Corrieri: tutta la galassia guarda. Anche quelli che non hanno gli occhi."]] };
  }
  boot();
})();
