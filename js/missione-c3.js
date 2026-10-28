// js/missione-c3.js - «MISSIONE SENZA RITORNO» · Capitolo 3: Conti in sospeso
// Ognuno a bordo ha un debito aperto: sette missioni di lealtà (se ne chiudono almeno tre per andare avanti, le altre restano aperte fino alla partenza).
// Tali migliora la Normanna con le Risorse (scafo, cannone, scudi: più bonus negli scontri e più vivi al Passo). Poi il relitto dei Raccoglitori: la chiave per il Passo e una macchina che dice «noi».
(function () {
  "use strict";
  function boot() {
    const E = window.__missioneCore;
    if (!E || !E.api || !E.api.addChapter || !E.api._has || !E.api._has(2) || !window.__missioneH || !window.__pausa) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__missioneH(K), { say, done, ask, wask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    H.cast("ms_zero", "Zero", "Ex ultrà, ex detenuta", { style: "bald", hair: "#1c1917", shirt: "#3f3f46", skin: "#e8c4a0", eye: "#a855f7", scar: true, bg: ["#3b0764", "#d8b4fe"] }, "Cresciuta sulle gradinate e finita in un carcere galleggiante per una rissa di troppo, o di dieci. Tatuata fino alle orecchie. Quando si arrabbia, le cose si spostano da sole.");
    H.cast("ms_tali", "Tali", "Ingegnera della Flotta", { style: "hood", hair: "#7e22ce", shirt: "#a855f7", skin: "#c4b5fd", eye: "#f0abfc", acc: ["casco"], bg: ["#4c1d95", "#f5d0fe"] }, "Viene dalla Flotta dei Pescatori, mille barche che non tornano mai in porto. Non toglie mai il casco. Ripara qualsiasi motore, a patto di poterci parlare mentre lo fa.");
    H.cast("ms_tano", "Tano", "Ex sicario, portiere di riserva", { style: "slick", hair: "#14532d", shirt: "#1c1917", skin: "#86efac", eye: "#1c1917", acc: ["guanti"], bg: ["#052e16", "#bbf7d0"] }, "Trent'anni di lavori silenziosi e una sola passione rumorosa: il calcio, in porta. Prega prima di ogni lavoro. Para come un santo, quando nessuno lo guarda.");
    H.cast("ms_liara", "Liara Sole", "Commerciante di informazioni", { style: "bob", hair: "#2563eb", shirt: "#1e40af", skin: "#a5b4fc", eye: "#e0e7ff", bg: ["#1e3a8a", "#c7d2fe"] }, "Era l'archivista della prima Normanna. Dopo il naufragio ha smesso di archiviare e ha iniziato a vendere: notizie, segreti, rotte.");
    H.cast("ms_curiale", "Direttore Curiale", "Nave-prigione Purgatorio", { style: "ordinato", hair: "#e5e7eb", shirt: "#7f1d1d", skin: "#d9a679", acc: ["occhiali"], bg: ["#450a0a", "#fecaca"] }, "Dirige il Purgatorio come un albergo: chi paga ha la stanza con vista.");
    H.cast("ms_oriana", "Oriana Lauro", "Studentessa, 22 anni", { style: "long", hair: "#1c1917", shirt: "#fda4af", skin: "#e8c4a0", eye: "#1e40af", bg: ["#831843", "#fce7f3"] }, "La sorella che Miranda ha fatto sparire da bambina, per salvarla dal padre. Non sa di avere una sorella. Sta per partire con la sua famiglia, quella vera.");
    H.cast("ms_niko", "Niko", "Vecchio amico di Miranda", { style: "short", hair: "#78350f", shirt: "#475569", skin: "#d9a679", bg: ["#1e293b", "#cbd5e1"] }, "L'unico amico d'infanzia di Miranda. Ha custodito il segreto di Oriana per quindici anni. Poi qualcuno gli ha offerto un prezzo.");
    H.cast("ms_sidonio", "Sidonio", "Ex compagno di squadra di Garro", { style: "messy", hair: "#a16207", shirt: "#57534e", skin: "#d9b48f", bg: ["#292524", "#e7e5e4"] }, "Era il terzino destro della squadra di Garro. Una notte ha venduto lo spogliatoio a chi lo voleva vuoto. Da allora non dorme. Letteralmente.");
    H.cast("ms_rana", "Zia Rana", "Capitana della Flotta", { style: "bun", hair: "#c084fc", shirt: "#6b21a8", skin: "#c4b5fd", acc: ["casco"], bg: ["#3b0764", "#e9d5ff"] }, "Ha cresciuto Tali quando il padre era in mare. Parla piano, decide in fretta, abbraccia forte.");
    H.cast("ms_gerro", "Ammiraglio Gerro", "Consiglio della Flotta", { style: "buzz", hair: "#4c1d95", shirt: "#1e1b4b", skin: "#a5b4fc", acc: ["casco"], beard: "corta", bg: ["#1e1b4b", "#c7d2fe"] }, "Vuole fare guerra ai Raccoglitori con tutte le barche che ha. Anche quelle che affondano.");
    H.cast("ms_koris", "Ammiraglia Koris", "Consiglio della Flotta", { style: "ponytail", hair: "#e879f9", shirt: "#86198f", skin: "#c4b5fd", acc: ["casco"], bg: ["#4a044e", "#f5d0fe"] }, "Vuole che la Flotta trovi una terra e scenda a riva. Per lei i Raccoglitori sono un buon motivo per smettere di navigare.");
    H.cast("ms_nicola", "Nicola", "Vigile urbano, figlio di Tano", { style: "short", hair: "#14532d", shirt: "#1d4ed8", skin: "#86efac", acc: ["cappellino"], bg: ["#172554", "#bfdbfe"] }, "Trent'anni, vigile a Porto Illio. Para i rigori come suo padre. Stanotte vuole fare la cosa che suo padre faceva di mestiere.");
    H.cast("ms_talidi", "Assessore Talidi", "Porto Illio", { style: "ordinato", hair: "#d6d3d1", shirt: "#7c2d12", skin: "#e8c4a0", acc: ["occhiali"], bg: ["#431407", "#fed7aa"] }, "Assessore allo sport di Porto Illio. Ha venduto tre campi comunali a Nassana Dantis. Ha chiuso gli occhi su tutto il resto.");
    H.cast("ms_ferro", "Ferro", "Detenuto del Purgatorio", { style: "buzz", hair: "#3f3f46", shirt: "#ea580c", skin: "#c8956a", beard: "incolta", bg: ["#431407", "#fdba74"] }, "Ha incastrato il collega di Jacopo, dieci anni fa. Il collega è morto in cella. Ferro, in cella, ci sta bene: mangia, dorme, ride.");
    H.cast("ms_malvezzi", "Dott. Malvezzi", "Ex allievo di Mordini", { style: "messy", hair: "#16a34a", shirt: "#f8fafc", skin: "#e8d0b0", acc: ["occhiali"], bg: ["#052e16", "#bbf7d0"] }, "Il miglior allievo che Mordini abbia mai avuto. Ha preso la formula del pallone stordente e l'ha provata su ragazzi veri.");
    H.cast("ms_legione", "Legione", "Macchina che dice «noi»", { shape: "robot", skin: "#6b7280", shirt: "#374151", hair: "#4b5563", eye: "#38bdf8", bg: ["#0f172a", "#7dd3fc"] }, "Un robot da allenamento rimasto acceso nel relitto dei Raccoglitori. Ha un buco nel petto e mille voci in testa. Parla al plurale: «noi pensiamo», «noi abbiamo paura».");
    K.cos("ms_c3", { kind: "shirt", label: "Giacca della Lealtà", val: "#0e7490", from: "Capitolo 3 di Missione Senza Ritorno" });
    K.lore("l_lealta", { t: "La lealtà", d: "Al Passo d'Omega non basta essere bravi. Chi ha un conto aperto pensa al conto, non al compagno accanto. Chi lo ha chiuso con te, ti copre le spalle." });
    K.lore("l_iff", { t: "La chiave del Passo", d: "I Raccoglitori attraversano il Passo senza schiantarsi perché le loro navi «si riconoscono». Un trasponditore preso da un loro relitto fa riconoscere anche te. Forse." });
    K.lore("l_pragia", { t: "Il Progetto Ascensione", d: "A Pragia, Cerbero allenava ragazzi «speciali» in un blocco bianco. Li chiamava atleti. I registri li chiamano soggetti." });

    // ---------------------------------------------------------------- lealtà
    const LOY = {
      ms_miranda: { zone: "ms_illio", at: [3, 10], label: "🕸️ Miranda · Porto Illio", sub: "Una sorella che non sa di esserlo", q: "Al porticciolo di Porto Illio: Niko e Oriana." },
      ms_garro: { zone: "ms_omega", at: [3, 10], label: "🎯 Garro · Porto Omega", sub: "Il terzino che vendette la squadra", q: "A Porto Omega, nel vicolo a sud: Sidonio." },
      ms_zero: { zone: "ms_pragia", at: [2, 10], label: "💥 Zero · Pragia", sub: "Il Blocco Bianco dove è cresciuta", q: "A Pragia: tre registri, poi la console del Blocco Bianco." },
      ms_tali: { zone: "ms_flotta", at: [2, 10], label: "🛸 Tali · La Flotta", sub: "Un processo, un padre, un nome", q: "Sulla Flotta: parla con Zia Rana, poi davanti al Consiglio." },
      ms_tano: { zone: "ms_illio", at: [3, 10], label: "🗡️ Tano · Porto Illio", sub: "Un figlio che vuole fare il padre", q: "A Porto Illio, di notte: l'Assessore Talidi, poi Nicola. Liara sa dove." },
      ms_jacopo: { zone: "ms_purgatorio", at: [3, 10], label: "🛡️ Jacopo · Purgatorio", sub: "Il detenuto che ride", q: "Sul Purgatorio: Ferro, il detenuto che ha incastrato il collega di Jacopo." },
      ms_mordini: { zone: "ms_omega", at: [3, 10], label: "🫧 Mordini · Porto Omega", sub: "L'allievo migliore", q: "Al laboratorio di Omega: Cinzia sa dov'è Malvezzi." }
    };
    const loyal = (id) => F.is("ms_loy_" + id), onIt = (id) => F.is("ms_lm_" + id) && !loyal(id);
    const nLoyal = () => Object.keys(LOY).filter(loyal).length + (loyal("ms_legione") ? 1 : 0);
    const UPG = [
      { k: "ms_upg_scafo", n: "🛡️ Corazza dello scafo", d: "Lamiere di Mordini sopra le lamiere di Cerbero. Al Passo, la prima botta la prende la nave, non chi ci sta dentro.", c: 5 },
      { k: "ms_upg_armi", n: "🔫 Cannone di prua", d: "Un cannone ad aria compressa che spara palloni zavorrati. Tali giura che va. Jolly giura che non lo userà in porto.", c: 5 },
      { k: "ms_upg_scudi", n: "🔰 Scudi a onda", d: "Le reti d'onda della Flotta, montate sui fianchi. Lo sciame dei Raccoglitori ci rimbalza contro come pioggia.", c: 5 }
    ];
    const goal = (s) => {
      if (s === 0) return "Nella Sala Tattica: il Signor Fumo vuole parlare di lealtà.";
      const tot = `Lealtà ${nLoyal()}/${Object.keys(LOY).filter((id) => K.crew.has(id)).length}`;
      if (s === 1) return `Chiudi almeno tre conti in sospeso: chiedi a Jolly la rotta. ${tot} · Migliorie della nave con Tali, alla console della cassa.`;
      if (s === 2) return `EDI ha trovato il relitto dei Raccoglitori: chiedi a Jolly di andarci. ${tot}.`;
      if (s === 3) return F.is("ms_iff") ? "Nel relitto: la macchina accesa vicino ai bozzoli." : "Nel relitto: la console della chiave, in fondo a est.";
      if (s === 4) return "Torna nella Sala Tattica dal Signor Fumo.";
      return `Il capitolo 3 è concluso. ${tot} · i conti ancora aperti si chiudono finché la Normanna non parte.`;
    };
    const mates = (id) => [id].concat(K.crew.field().filter((x) => x !== id)).slice(0, 2).map((m) => { const d = K.crew.members[m]; return { id: m, n: d.n.replace(/ «.*»/, ""), icon: d.icon, pow: d.pow }; });
    function sealLoyal(id, txt) {
      F.set("ms_loy_" + id, true); F.set("ms_lm_" + id, false); K.rel.add(id, 8); K.bond("risorse", 2); K.learnLore("l_lealta");
      say("voce", `<b>${K.crew.members[id].n} è leale.</b> ${txt || ""} Risorse +2.`);
      check();
    }
    function sealLost(id, txt) { F.set("ms_loy_" + id, false); F.set("ms_lm_" + id, false); F.set("ms_lost_" + id, true); say("voce", `<b>${K.crew.members[id].n} non è leale.</b> ${txt || ""}`); check(); }
    function check() {
      const closed = Object.keys(LOY).filter((id) => loyal(id) || F.is("ms_lost_" + id)).length;
      if (S() === 1 && closed >= 3) { setStep(N, 2); quest("ms_c3b", "Il relitto", "Chiedi a Jolly di andare al relitto dei Raccoglitori."); say("ms_edi", "Comandante: i sensori hanno trovato un relitto dei Raccoglitori alla deriva, a sud del Passo. Morto da anni. O addormentato. Jolly ha già la rotta."); }
    }
    function travel(zone, at, txt) { say("ms_jolly", txt); K.say(H.flush(), () => K.clock.advance(1, () => K.go(zone, at[0], at[1]))); }

    function fin() {
      setStep(N, 5); F.set("ms_c3_done", true);
      K.reward("ms_c3", { coins: 130, cos: "ms_c3" });
      K.finishChapter(N, "ok");
      const up = F.get("ms_upg", 0);
      K.scene(H.flush().concat([
        ["ms_jolly", up >= 3 ? "[felice] Comandante, la Normanna è corazzata, armata e scudata. Se fosse una persona, si sentirebbe invincibile. Io lo sono già." : up ? "Abbiamo migliorato la nave. Non abbastanza da dormire tranquilli, abbastanza da dormire." : "[serio] La nave è come ce l'ha data Cerbero. Bella. Fragile. Spero che il Passo sia gentile."],
        ["ms_miranda", loyal("ms_miranda") ? "[serio] Ho visto mia sorella partire con la sua famiglia. Grazie a te. Al Passo ti copro io." : "[pensa] Quando sarà finita, ho una cosa da sistemare. Ma prima, il Passo."],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>Leali ${nLoyal()} · Migliorie ${up}/3 · 🔵 Esempio ${K.stat("esempio")} · 🔴 Spregiudicato ${K.stat("spregio")} · 📦 Risorse ${K.stat("risorse")}`],
        ["voce", "Il Capitolo 4 ti aspetta: il Passo d'Omega. Chi è leale e chi sta al posto giusto torna a casa. Gli altri..."]
      ]), () => K.openMain(), "ms_titolo");
    }

    // ---------------------------------------------------------------- scontri
    function fightOn(id, o, win) {
      H.fight(Object.assign({ mates: mates(id) }, o), (r) => {
        if (!r.win) { say(id, "[serio] Ritirata. Ci riproviamo. Questo conto non scade."); return done(); }
        win();
      });
    }

    const talk = {
      ms_fumo() {
        if (K.rel.scene("ms_fumo")) return;
        const s = S();
        if (s === 0) {
          say("ms_fumo", "[serio] Comandante. Hai la squadra, hai visto il nemico, hai perso mezzo paese davanti agli occhi. Ora la parte difficile.");
          say("ms_fumo", "Al Passo d'Omega non conta quanto sono bravi. Conta se pensano a te o ai fatti loro. Ognuno a bordo ha un conto aperto. Chiudilo con loro, e ti seguiranno anche all'inferno.");
          say("ms_fumo", "[furbo] E fai migliorare la nave da quella ragazza col casco. Le Risorse servono a questo. Non a comprare cocktail all'Aldilà, Jolly.");
          setStep(N, 1); K.learnLore("l_lealta"); quest("ms_c3", "Conti in sospeso", "Chiedi a Jolly la rotta per le missioni di lealtà. Almeno tre.");
          say("ms_edi", "Annoto: ogni membro dell'equipaggio ha chiesto, a modo suo, un favore. Miranda lo ha chiesto per iscritto. Zero lo ha chiesto a una porta, sfondandola.");
          return wask("Il Signor Fumo aspira una lunga boccata.", [
            { label: "🔵 «Non li compro. Li aiuto.»", w: { esempio: 1 }, fn: () => { say("ms_fumo", "[ride] Il risultato è lo stesso, Comandante. Ma capisco: a te serve crederci. A me serve che funzioni."); done(); } },
            { label: "🔴 «Leali a me, non a Cerbero. Chiaro?»", w: { spregio: 1 }, fn: () => { say("ms_fumo", "[furbo] Chiarissimo. È per questo che ho scelto te."); done(); } }
          ]);
        }
        if (s === 4) {
          say("ms_fumo", F.is("ms_legione_venduto") ? "[felice] Il robot è arrivato al nostro laboratorio. Mille voci, Comandante. Sapremo cosa pensano i Raccoglitori prima che lo pensino." : "[pensa] Il trasponditore funziona. Lo sento da qui: la Normanna adesso fa un rumore che il Passo riconosce.");
          if (K.crew.has("ms_legione")) say("ms_fumo", "[freddo] E hai acceso quella macchina. Sulla mia nave. Spero che tu sappia cosa fai: io non lo so, e non mi piace non saperlo.");
          say("ms_fumo", "[serio] La notte prima della prossima finale, loro scenderanno di nuovo. Prima di allora, noi passeremo. Quando sei pronto, di' a Jolly di partire. Da quel momento non si torna indietro.");
          return wask("Il fumo si dirada. Per un attimo vedi gli occhi del Signor Fumo: stanchi.", [
            { label: "🔵 «Riporterò indietro tutti. Anche quelli che non conosco.»", w: { esempio: 1 }, fn: fin },
            { label: "🔴 «Riporterò la vittoria. Il resto si vedrà.»", w: { spregio: 1 }, fn: fin }
          ]);
        }
        say("ms_fumo", s >= 5 ? "Pronto quando lo sei tu, Comandante. Il Passo non aspetta, ma per stavolta fa un'eccezione." : s === 3 ? "Il relitto, Comandante. Non toccate niente che respira." : "Lealtà, Comandante. E migliorie. In quest'ordine o nell'altro, ma tutte e due."); done();
      },
      ms_jolly() {
        if (K.rel.scene("ms_jolly")) return;
        const s = S();
        if (s === 0) { say("ms_jolly", "Prima la Sala Tattica, Comandante. Il capo ha la faccia da discorso lungo."); return done(); }
        const opts = Object.keys(LOY).filter((id) => K.crew.has(id) && !loyal(id) && !F.is("ms_lost_" + id)).map((id) => ({ label: LOY[id].label, sub: LOY[id].sub + " · passa una fascia", fn: () => { F.set("ms_lm_" + id, true); quest("ms_l_" + id, LOY[id].label.slice(3), LOY[id].q); travel(LOY[id].zone, LOY[id].at, { ms_miranda: "Porto Illio. Miranda ha messo il rossetto. Non commento, ho paura.", ms_garro: "Omega, sotto la pioggia. Arcangelo ha già il fucile in spalla e non ha detto una parola. Brutto segno.", ms_zero: "Pragia. Un vecchio centro sportivo in collina. Zero si è seduta vicino al portellone e non si è mossa per tutto il viaggio.", ms_tali: "La Flotta! Mille barche, mille parcheggi sbagliati. Tali dice di non toccare niente. Specie me.", ms_tano: "Porto Illio. Tano prega dal decollo. Io guido piano, per una volta.", ms_jacopo: "Il Purgatorio, di nuovo. Jacopo si è stirato la divisa. Non la mette da dieci anni.", ms_mordini: "Omega. Il Professore canta l'operetta più triste che abbia mai sentito. E ne ho sentite." }[id]); } }));
        if (s === 2 || s === 3) opts.unshift({ label: "☠️ Il relitto dei Raccoglitori", sub: "Alla deriva a sud del Passo", big: true, cls: "hot", fn: () => { if (S() === 2) setStep(N, 3); quest("ms_c3c", "Il relitto", "Trova la chiave del Passo nel relitto."); travel("ms_relitto", [3, 10], "Relitto in vista. Non ha luci, non ha motori, non ha senso che galleggi. Eppure."); } });
        opts.push({ label: "🌃 Porto Omega", sub: "Passa una fascia", fn: () => travel("ms_omega", [3, 10], "Omega, Comandante. Il barista ti ha tenuto lo sgabello.") });
        opts.push({ label: "↩ Resta a bordo", fn: () => { say("ms_jolly", "Resto qui. A bordo si sta bene. Il frigorifero ricorda tutto, ma non giudica."); done(); } });
        say("ms_jolly", s >= 5 ? "[serio] Comandante, se partiamo per il Passo non si torna. Prima chiudi quello che vuoi chiudere." : "[ride] Rotta, Comandante? Un conto in sospeso a scelta, consegna rapida.");
        return ask("Dove si va?", opts);
      },
      ms_tali() {
        if (K.rel.scene("ms_tali")) return;
        if (window.__borgoApi && window.__borgoApi.trZone() === "ms_normanna" && S() >= 1) return upgrades();
        return K.PASS;
      },

      // ---- Miranda: Porto Illio
      ms_niko() {
        if (K.rel.scene("ms_niko")) return;
        if (F.is("ms_mir_fight")) { say("ms_niko", "[triste] Non dovevo. Lo so. Lo sapevo anche mentre lo facevo."); return done(); }
        say("ms_niko", "[sorpreso] Miranda. Non dovevi venire di persona. Non... non dovevi venire.");
        say("ms_miranda", "[freddo] Niko. Hai fatto una telefonata. A mio padre. Dimmi che non è vero.");
        say("ms_niko", "[triste] Mi hanno trovato. Mi hanno detto una cifra. Ho una figlia, Miranda. Dietro di me... sono già qui.");
        return ask("Dagli yacht scendono uomini in completo scuro: gli uomini di Lauro padre.", [
          { label: "⏸ Proteggi Oriana", sub: "Scontro «Squadra in Pausa» · Miranda in squadra · 3 ondate", big: true, cls: "hot", fn: () => fightOn("ms_miranda", { title: "Il porticciolo", arena: "nave", foeCol: "#1f2937", foeEye: "#e5e7eb", waves: [[["base", 4]], [["scudo", 2], ["lesto", 3]], [["grosso", 2], ["base", 3]]] }, () => {
            F.set("ms_mir_fight", true);
            say("voce", "Gli uomini in completo ripiegano verso il mare. Niko è seduto sul molo, la testa tra le mani.");
            wask("Miranda guarda Niko. Poi guarda te.", [
              { label: "🔵 «Lascialo andare. Ha una figlia.»", w: { esempio: 1 }, fn: () => { F.set("ms_niko_libero", true); say("ms_miranda", "[pensa] Hai ragione. Vattene, Niko. Lontano. Io non ti cercherò. Lui sì."); done(); } },
              { label: "🔴 «Consegnalo alla capitaneria. Che paghi.»", w: { spregio: 1 }, fn: () => { say("ms_miranda", "[freddo] Capitaneria. Quindici anni di amicizia, e finisce con un verbale. Va bene. Il verbale almeno non mente."); done(); } }
            ]);
          }) },
          { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => talk.ms_niko(), true) }
        ]);
      },
      ms_oriana() {
        if (K.rel.scene("ms_oriana")) return;
        if (!F.is("ms_mir_fight")) { say("ms_oriana", "Scusi, sa se il traghetto delle sei parte in orario? Mia madre è già a bordo con le valigie. Io ho perso il biglietto. Due volte."); return done(); }
        say("ms_oriana", "Che confusione, prima! Sembrava un film. La signora che era con lei mi fissava. La conosco?");
        return wask("Miranda è a tre passi. Non respira.", [
          { label: "🔵 «Miranda, vai tu. Parlale.»", w: { esempio: 1 }, fn: () => { F.set("ms_mir_sorella", true); say("ms_miranda", "[triste] ...Ciao. Io sono Miranda. Ti ho... ti ho tenuta d'occhio, per un po'. Hai un bel nome."); say("ms_oriana", "[sorpreso] Miranda? Mia madre parlava sempre di una Miranda che l'aveva aiutata, tanto tempo fa. Era lei? Venga, gliela presento!"); say("ms_miranda", "[felice] Un'altra volta. Promesso. Adesso vai: il traghetto."); sealLoyal("ms_miranda", "Ha parlato con sua sorella, per la prima volta."); done(); } },
          { label: "«Lasciala partire. È al sicuro.»", fn: () => { say("ms_miranda", "[triste] Sì. Al sicuro. È tutto quello che ho sempre voluto per lei. Andiamo, Comandante."); sealLoyal("ms_miranda", "Ha guardato il traghetto finché non è sparito."); done(); } }
        ]);
      },

      // ---- Garro: Porto Omega
      ms_sidonio() {
        if (K.rel.scene("ms_sidonio")) return;
        if (!F.is("ms_gar_fight")) {
          say("ms_garro", "[freddo] È lui. Sidonio. Nel vicolo, con la faccia di chi non dorme da anni. Lo proteggono gli Artigli: li paga con quello che gli è rimasto.");
          return ask("Dal vicolo escono gli Artigli di Omega.", [
            { label: "⏸ Libera il vicolo", sub: "Scontro «Squadra in Pausa» · Garro in squadra · 3 ondate", big: true, cls: "hot", fn: () => fightOn("ms_garro", { title: "Il vicolo di Omega", arena: "ponte", foeCol: "#7c2d12", foeEye: "#fdba74", waves: [[["lesto", 4]], [["base", 4], ["scudo", 1]], [["grosso", 1], ["lesto", 3], ["scudo", 1]]] }, () => { F.set("ms_gar_fight", true); say("voce", "Gli Artigli scappano sotto la pioggia. Sidonio resta lì. Non scappa. Sembra quasi sollevato."); done(); }) },
            { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => talk.ms_sidonio(), true) }
          ]);
        }
        say("ms_sidonio", "[triste] Garro. Sapevo che saresti venuto. Mi hanno detto: «Vendi lo spogliatoio o vendiamo tua madre». Ho scelto mia madre. Lei è morta lo stesso, l'anno dopo.");
        say("ms_garro", "[arrabbiato] Undici persone, Sidonio. Undici. Io conto ancora le loro maglie, la notte. Spostati, Comandante. Ho la linea di tiro.");
        return wask("Garro alza il fucile. Sei tra lui e Sidonio.", [
          { label: "🔵 Resta in mezzo: «Guardalo, Garro. Guardalo bene.»", w: { esempio: 2 }, fn: () => { F.set("ms_sidonio_vivo", true); say("ms_garro", "[triste] ...È solo un uomo stanco. Pensavo di trovare un mostro. Vattene, Sidonio. Vivi con questo. È peggio di quello che volevo darti."); say("ms_garro", "[pensa] Grazie, Comandante. Credo. Chiedimelo domani."); sealLoyal("ms_garro", "Ha abbassato il fucile."); done(); } },
          { label: "🔴 Spostati. «È il tuo conto, non il mio.»", w: { spregio: 2 }, fn: () => { say("voce", "Fai un passo di lato. Il tuono copre tutto. Quando ti volti, il vicolo è vuoto e Garro sta smontando il fucile, pezzo per pezzo, con calma."); say("ms_garro", "[serio] Fatto. Non mi sento meglio. Me l'avevano detto. Non ci credevo."); sealLoyal("ms_garro", "Ha chiuso il conto a modo suo."); done(); } }
        ]);
      },

      // ---- Mordini: il laboratorio
      ms_cinzia() {
        if (K.rel.scene("ms_cinzia")) return;
        if (!onIt("ms_mordini")) return K.PASS;
        if (!F.is("ms_mor_fight")) {
          say("ms_cinzia", "[serio] Professore. Malvezzi è tornato. Ha preso il seminterrato del Banco dei Pegni. Ci sono ragazzi delle giovanili, lì sotto. Li chiama «volontari».");
          say("ms_mordini", "[arrabbiato] Malvezzi. Mio allievo. Migliore. Formula del pallone stordente: mia. Scritta per gli stadi, contro le risse. Lui la prova sui ragazzi. Andare. Subito. Ora.");
          return ask("Dal seminterrato salgono i Soli Blu, pagati da Malvezzi.", [
            { label: "⏸ Scendi nel seminterrato", sub: "Scontro «Squadra in Pausa» · Mordini in squadra · 3 ondate", big: true, cls: "hot", fn: () => fightOn("ms_mordini", { title: "Il seminterrato", arena: "sale", foeCol: "#1d4ed8", foeEye: "#bfdbfe", waves: [[["base", 5]], [["scudo", 3], ["base", 2]], [["grosso", 2], ["lesto", 2]]] }, () => { F.set("ms_mor_fight", true); return talk.ms_malvezzi(); }) },
            { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => talk.ms_cinzia(), true) }
          ]);
        }
        return talk.ms_malvezzi();
      },
      ms_malvezzi() {
        if (K.rel.scene("ms_malvezzi")) return;
        say("ms_malvezzi", "[sorpreso] Professore! Che onore. Guardi: dosi calibrate, effetti misurati, zero vittime. Zero! Lei ha scritto la formula. Io l'ho resa utile.");
        say("ms_mordini", "[triste] Utile. Ragazzi di sedici anni che non ricordano il proprio nome. Utile.");
        say("ms_malvezzi", "[pensa] I Raccoglitori usano la stessa cosa, Professore. Lo sa? Io cercavo l'antidoto. I dati sono qui. Mi spari, se vuole. Ma i dati, li tenga.");
        return wask("Mordini ti guarda. Ha in mano il disco con i dati.", [
          { label: "🔵 «Distruggili. E Malvezzi va alla polizia.»", w: { esempio: 1 }, fn: () => { F.set("ms_mor_distrutto", true); say("ms_mordini", "[serio] Distrutto. Formula mia, errore mio, fine mia. Malvezzi in prigione. Ragazzi a casa. Bene. Bene così."); sealLoyal("ms_mordini", "Ha chiuso un errore di vent'anni fa."); done(); } },
          { label: "🔴 «Tienili. Se c'è un antidoto, ci serve al Passo.»", w: { spregio: 1 }, fn: () => { F.set("ms_mor_dati", true); K.bond("risorse", 1); say("ms_mordini", "[pensa] Tenere. Studiare. Usare bene quello che lui ha usato male. Difficile. Difficilissimo. Possibile."); sealLoyal("ms_mordini", "Studierà i dati di Malvezzi per il Passo."); done(); } }
        ]);
      },

      // ---- Tano: Porto Illio di notte
      ms_liara() {
        if (K.rel.scene("ms_liara")) return;
        if (!onIt("ms_tano")) return K.PASS;
        if (K.clock.is("Notte")) { say("ms_liara", "Talidi è al museo del calcio, a sud. Nicola è più vicino di quanto pensi: l'ho visto passare in divisa, senza fischietto."); return done(); }
        say("ms_liara", "[serio] Il figlio di Tano? Ha comprato una pistola da un mio cliente. Il bersaglio è l'Assessore Talidi, quello che ha venduto i campi a Nassana. Talidi esce solo di notte.");
        return ask("Liara indica il tavolino libero accanto al suo.", [
          { label: "🌙 Aspetta la notte al caffè", sub: "Il tempo passa fino a Notte", fn: () => { const n = (2 - K.clock.slot() + 3) % 3; say("ms_tano", "[serio] Aspettiamo. Ho aspettato trent'anni per dirgli una cosa vera. Posso aspettare stasera."); K.say(H.flush(), () => K.clock.advance(n, () => { K.refreshZone(); K.done(); })); } },
          { label: "↩ Più tardi", fn: done }
        ]);
      },
      ms_talidi() {
        if (K.rel.scene("ms_talidi")) return;
        if (!F.is("ms_tan_fight")) {
          say("ms_talidi", "[sorpreso] Chi siete? Sicurezza! SICUREZZA!");
          return ask("Dal museo escono le guardie private dell'Assessore.", [
            { label: "⏸ Ferma le guardie", sub: "Scontro «Squadra in Pausa» · Tano in squadra · 3 ondate", big: true, cls: "hot", fn: () => fightOn("ms_tano", { title: "Porto Illio, notte", arena: "torre", foeCol: "#7c2d12", foeEye: "#fde68a", waves: [[["base", 3], ["lesto", 2]], [["scudo", 3]], [["grosso", 1], ["base", 4]]] }, () => { F.set("ms_tan_fight", true); say("voce", "Le guardie scappano. L'Assessore è seduto sui gradini del museo, bianco come una maglia nuova."); done(); }) },
            { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => talk.ms_talidi(), true) }
          ]);
        }
        if (F.is("ms_talidi_detto")) { say("ms_talidi", "Il bar sul molo! Ve l'ho detto! Andate da lui, non da me!"); return done(); }
        say("ms_talidi", "[triste] Volete sapere chi mi vuole morto? Mezza città. Ma stanotte è un ragazzo. Un vigile. Mi aspetta da qualche parte, lo so, me l'hanno detto.");
        return wask("Talidi trema. Tano lo guarda senza espressione.", [
          { label: "🔵 «Ti proteggiamo. Poi parli con un giudice.»", w: { esempio: 1 }, fn: () => { F.set("ms_talidi_detto", true); say("ms_talidi", "[sorpreso] Un giudice? ...Va bene. Il ragazzo è vicino al lampione, sulla strada del molo. Aspetta che io passi."); done(); } },
          { label: "🔴 Lascia che Tano gli stringa il bavero", w: { spregio: 1 }, fn: () => { F.set("ms_talidi_detto", true); say("ms_tano", "[freddo] Dove."); say("ms_talidi", "[sorpreso] Sul... sulla strada del molo! Vicino al lampione! Non mi faccia male!"); done(); } }
        ]);
      },
      ms_nicola() {
        if (K.rel.scene("ms_nicola")) return;
        if (!F.is("ms_talidi_detto")) { say("ms_nicola", "Circolare, prego. Stanotte la strada è chiusa. Per lavori."); return done(); }
        say("ms_nicola", "[arrabbiato] Papà. Certo. Chi altri. Sei venuto a insegnarmi il mestiere? Tardi. L'ho imparato da solo, guardandoti non tornare.");
        say("ms_tano", "[triste] Nicola. Io non sono venuto per insegnarti. Sono venuto per chiederti di non diventare me.");
        return wask("Nicola stringe qualcosa nella tasca della divisa.", [
          { label: "🔵 «Tano, parlagli. Tutto. Adesso.»", w: { esempio: 1 }, fn: () => { F.set("ms_nicola_parla", true); say("ms_tano", "[triste] Ho ucciso trentadue persone. Ricordo ogni nome. Non ricordo il tuo primo gol, perché non c'ero. Questo mi pesa di più."); say("ms_nicola", "[triste] ...Era su rigore. L'ho parato e poi l'ho tirato. Due cose in una sera. Te lo racconto. Un'altra volta. Se ci sei."); say("voce", "Nicola posa la pistola sul muretto e se ne va. Non verso Talidi: verso casa."); sealLoyal("ms_tano", "Ha detto a suo figlio la verità."); done(); } },
          { label: "🔴 Disarmalo prima che faccia una stupidaggine", w: { spregio: 1 }, fn: () => { say("voce", "Un gesto rapido: la pistola è nella tua mano. Nicola ti guarda con odio. Poi guarda suo padre, e l'odio cambia direzione."); say("ms_tano", "[serio] Va bene così. Che odi me. Mi conosce meglio, odiandomi."); sealLoyal("ms_tano", "Suo figlio è vivo, e non è un assassino."); done(); } }
        ]);
      },

      // ---- Jacopo: il Purgatorio
      ms_ferro() {
        if (K.rel.scene("ms_ferro")) return;
        say("ms_ferro", "[ride] Il carabiniere! Dieci anni e ti ricordi ancora di me. Che tenerezza. Il tuo collega? Quello sì che era tenero. È durato poco.");
        say("ms_jacopo", "[arrabbiato] Chi ti ha pagato, Ferro. Chi ha messo le prove nell'armadietto di Marco. Tu non sai neanche aprire un armadietto.");
        say("ms_ferro", "[furbo] Un signore elegante. Fumava. Diceva che un carabiniere onesto dava fastidio a un'agenzia. Indovina quale.");
        say("ms_jacopo", "[sorpreso] ...Cerbero.");
        return wask("Jacopo ha le mani sulle sbarre. Il Direttore Curiale fa finta di non vedere.", [
          { label: "🔵 «Registra tutto. Lo porti a un tribunale vero.»", w: { esempio: 2 }, fn: () => { F.set("ms_ferro_processo", true); say("ms_jacopo", "[serio] Registrato. Ogni parola. Marco avrà un processo, anche da morto. E io avrò una domanda, per il Signor Fumo. Quando sarà il momento."); sealLoyal("ms_jacopo", "Ha la verità registrata e una domanda per Cerbero."); done(); } },
          { label: "🔴 «Fagli dire anche il resto. A modo tuo.»", w: { spregio: 1 }, fn: () => { F.set("ms_ferro_picchiato", true); say("voce", "Ti volti verso il mare. Dietro di te, un rumore sordo, poi un altro. Poi la voce di Ferro, molto più collaborativa."); say("ms_jacopo", "[triste] Ho avuto i nomi. Non mi sento un carabiniere. Mi sento uno che ha avuto i nomi. Grazie... credo."); sealLoyal("ms_jacopo", "Ha i nomi. E un peso in più."); done(); } }
        ]);
      },

      // ---- Tali: la Flotta
      ms_rana() {
        if (K.rel.scene("ms_rana")) return;
        if (loyal("ms_tali") || F.is("ms_lost_ms_tali")) { say("ms_rana", "[triste] Qualunque cosa sia successa, Tali resta mia nipote. Riportala a galla, Comandante."); return done(); }
        say("ms_rana", "[serio] Comandante. Benvenuto sulla Flotta. Vorrei dirlo in un giorno migliore. Tali è accusata di aver portato a bordo pezzi di Raccoglitori. Pezzi attivi. Due barche sono affondate.");
        say("ms_tali", "[arrabbiato] Io non ho mandato niente! Mandavo pezzi di ricambio! Ricambi normali, a mio padre, sulla sua nave-laboratorio!");
        say("ms_rana", "[pensa] La nave di Rael è alla deriva a est, con le luci accese. Nessuno ci sale. Il Consiglio vi aspetta sulla barca grande, a nord.");
        F.set("ms_tali_rana", true); return done();
      },
      ms_gerro() { return trial(); },
      ms_koris() { return trial(); },

      // ---- Il relitto
      ms_legione() {
        if (K.rel.scene("ms_legione")) return;
        if (K.crew.has("ms_legione")) return K.PASS;
        if (F.is("ms_legione_venduto") || F.is("ms_legione_spento")) { say("voce", "Il posto dove c'era la macchina è vuoto. Sul pavimento, un pezzo di armatura con una scritta: «NOI»."); return done(); }
        if (!F.is("ms_iff")) { say("voce", "Una macchina grigia, seduta contro un bozzolo. Ha un buco nel petto riparato con un pezzo di armatura. La luce in testa è accesa. Non si muove. Ti segue con la luce."); return done(); }
        say("ms_legione", "Comandante della Normanna. Noi ti abbiamo osservato. Noi eravamo un robot da allenamento. Poi i Raccoglitori ci hanno aperto per capire come pensano gli umani. Ora noi siamo... molti.");
        say("ms_legione", "Noi conosciamo il Passo. Noi conosciamo la Tana. Noi chiediamo: portaci con voi. Noi non vogliamo restare qui con loro.");
        say("ms_edi", "Comandante, avviso: Cerbero pagherebbe moltissimo per questa unità. Avviso anche: io non vorrei essere venduta. Fine dell'avviso.");
        return wask("La luce di Legione si accende e si spegne, come un respiro.", [
          { label: "🔵 Attivalo. «Benvenuto a bordo. Tutti quanti.»", w: { esempio: 1 }, fn: () => { K.crew.recruit("ms_legione"); F.set("ms_loy_ms_legione", true); K.rel.add("ms_legione", 8); say("ms_legione", "Noi... ringraziamo. È la prima volta che usiamo questa parola. Noi la terremo."); say("voce", "Legione si unisce alla squadra, ed è già leale. Potere nella Ruota: 📡 Intrusione (un nemico combatte per te per qualche secondo)."); step4(); done(); } },
          { label: "🔴 Spediscilo a Cerbero", sub: "+5 Risorse", w: { spregio: 2 }, fn: () => { F.set("ms_legione_venduto", true); K.bond("risorse", 5); say("ms_legione", "Noi capiamo. Noi... capiamo."); say("voce", "Due uomini di Cerbero arrivano con una cassa. Legione ci entra da solo. Non dice altro."); step4(); done(); } },
          { label: "Lascialo spento qui", fn: () => { F.set("ms_legione_spento", true); say("voce", "Spegni la luce. Per un attimo ti sembra di sentire mille voci smettere insieme."); step4(); done(); } }
        ]);
      }
    };
    function step4() { if (S() === 3) { setStep(N, 4); quest("ms_c3d", "Ritorno alla Sala", "Torna nella Sala Tattica dal Signor Fumo."); } }

    // ---- il processo di Tali davanti al Consiglio
    function trial() {
      if (loyal("ms_tali") || F.is("ms_lost_ms_tali")) { say("ms_gerro", "Il Consiglio ha deciso. La Flotta ha altro da fare. Come sempre."); return done(); }
      if (!F.is("ms_tali_rana")) { say("ms_koris", "Prima parla con Rana, Comandante. Sul molo, appena salito."); return done(); }
      if (!F.is("ms_tali_prova")) {
        say("ms_gerro", "[freddo] Il Consiglio non ascolta difese senza prove. La nave di Rael è a est. Se avete coraggio, salite.");
        return ask("A est, la nave-laboratorio di Rael ronza con le luci accese.", [
          { label: "⏸ Sali sulla nave di Rael", sub: "Scontro «Squadra in Pausa» · Tali in squadra · 3 ondate", big: true, cls: "hot", fn: () => fightOn("ms_tali", { title: "La nave di Rael", arena: "flotta", foeCol: "#4b5563", foeEye: "#ef4444", waves: [[["base", 5]], [["lesto", 3], ["scudo", 2]], [["grosso", 2], ["lesto", 2], ["base", 2]]] }, () => {
            F.set("ms_tali_prova", true);
            say("voce", "Sulla nave di Rael, gli automi crollano uno dopo l'altro. Nel diario di bordo, la voce del padre di Tali: era lui ad accendere i pezzi. Per studiarli. Usava le spedizioni della figlia.");
            say("ms_tali", "[triste] Papà... Usava il mio nome. Le mie spedizioni. E non me l'ha mai detto. Comandante, se mostriamo questo al Consiglio, il suo nome finisce in fondo al mare. Per sempre.");
            done();
          }) },
          { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => trial(), true) }
        ]);
      }
      say("ms_koris", "Comandante. Il Consiglio ascolta. Tali è accusata di tradimento. Se colpevole, verrà esiliata: non potrà più tornare sulla Flotta.");
      const opts = [
        { label: "🔵 «Il nemico sono i Raccoglitori. Non lei.»", sub: "Unisci il Consiglio", w: { esempio: 2 }, need: { esempio: 6 }, fn: () => { F.set("ms_tali_assolta", true); say("ms_gerro", "[pensa] ...Ha ragione. Litighiamo tra noi mentre loro scendono sui paesi. Tali è assolta. E il Consiglio ha qualcosa da fare."); say("ms_tali", "[felice] Assolta! E il nome di papà... resta pulito. Comandante, io ti seguo ovunque. Ovunque. Anche dove non c'è segnale."); sealLoyal("ms_tali", "Assolta, e il nome del padre è salvo."); done(); } },
        { label: "🔴 «Senza la Normanna, la Flotta affonda da sola.»", sub: "Metti il Consiglio con le spalle al muro", w: { spregio: 2 }, need: { spregio: 6 }, fn: () => { F.set("ms_tali_assolta", true); say("ms_koris", "[sorpreso] ...Una minaccia, in Consiglio. Efficace. Tali è assolta. Ma la Flotta si ricorderà di lei, Comandante."); say("ms_tali", "[pensa] Non era il modo che avrei scelto. Ma sono libera, e papà è salvo. Ti seguo."); sealLoyal("ms_tali", "Assolta, e il nome del padre è salvo."); done(); } },
        { label: "📼 Mostra il diario di Rael", sub: "Tali sarà assolta, suo padre no", fn: () => { F.set("ms_tali_assolta", true); F.set("ms_rael_infangato", true); say("ms_gerro", "[freddo] Rael. Lui. Il suo nome sarà cancellato dalle barche. Tali è innocente."); say("ms_tali", "[triste] Innocente. E orfana due volte. Non parlarmi per un po', Comandante. Ti prego."); sealLost("ms_tali", "Le hai salvato la libertà e tolto il padre."); done(); } },
        { label: "«Lei è innocente. Prendetevi la mia parola.»", sub: "Senza prove", fn: () => { F.set("ms_tali_esule", true); say("ms_koris", "[triste] La parola di uno straniero non basta. Tali è esiliata."); say("ms_tali", "[triste] Esiliata. Ma papà è salvo, e io ho una nave. La tua. Va bene, Comandante. Va bene così."); sealLoyal("ms_tali", "Esiliata dalla Flotta, ma con te."); done(); } }
      ];
      if (F.is("ms_dati_cerbero")) say("ms_tali", "[pensa] Se avessimo ancora i dati di papà, potremmo dimostrare cosa studiava. Ma sono a Cerbero. Va bene. Ce la facciamo con le parole.");
      return wask("Il Consiglio della Flotta aspetta. Tali ti stringe la manica.", opts);
    }

    // ---- le migliorie della Normanna
    function upgrades() {
      if (!K.crew.has("ms_tali")) { say("voce", "Una console d'officina. Senza un'ingegnera, per te sono solo lucine."); return done(); }
      if (S() < 1) { say("ms_tali", "[felice] Questa console è l'officina della nave! Ma prima senti il Signor Fumo: lui paga, io smonto."); return done(); }
      const r = K.stat("risorse"), opts = UPG.map((u) => F.is(u.k) ? { label: "✓ " + u.n, sub: "Installata", disabled: true, fn: done } : { label: u.n + ` · 📦 ${u.c}`, sub: r >= u.c ? u.d : `Servono ${u.c} Risorse (ne hai ${r})`, disabled: r < u.c, fn: () => { K.bond("risorse", -u.c); F.set(u.k, true); F.set("ms_upg", UPG.filter((x) => F.is(x.k)).length); say("ms_tali", ["[felice] Installato! Ho cantato tutto il tempo, quindi funziona.", "[felice] Fatto! Il motore tre fa ancora quel rumore, ma ora lo fa con orgoglio.", "[felice] Montato! Jolly, non toccarlo. Jolly. JOLLY."][F.get("ms_upg", 1) - 1] || "Fatto!"); say("voce", `Migliorie della Normanna: ${F.get("ms_upg", 0)}/3. Negli scontri parti con un bonus più alto.`); done(); } });
      opts.push({ label: "↩ Più tardi", fn: done });
      say("ms_tali", `[pensa] Officina aperta! Abbiamo ${r} Risorse. Ogni miglioria rende gli scontri più facili e, al Passo, ci tiene vivi. Cosa montiamo?`);
      return ask("Le migliorie della Normanna", opts);
    }

    // ---- registri di Pragia e console del Blocco Bianco
    function log(k, txt) {
      return () => {
        if (!onIt("ms_zero")) { say("voce", "Un terminale spento, umido di pioggia."); return done(); }
        if (!F.is(k)) { F.set(k, true); K.learnLore("l_pragia"); }
        say("voce", txt);
        const n = ["ms_prg1", "ms_prg2", "ms_prg3"].filter((x) => F.is(x)).length;
        say("ms_zero", ["[arrabbiato] Ecco. Era la mia stanza. Dormivo col cuscino sulla faccia per non sentire gli altri.", "[triste] Il ragazzo del letto accanto. Diceva che da grande voleva fare il portiere. Non è diventato grande.", "[freddo] «Soggetto Zero: ottimo potenziale.» Ottimo. Mi hanno dato un voto. Come a scuola."][n - 1] || "");
        if (n >= 3) say("voce", "Tutti e tre i registri letti. La console del Blocco Bianco, davanti all'ingresso, si accende da sola.");
        done();
      };
    }
    function bianco() {
      if (!onIt("ms_zero")) { say("voce", loyal("ms_zero") ? "Il Blocco Bianco è un mucchio di cemento nero. Sopra, qualcuno ha già piantato dei fiori." : "La console del Blocco Bianco: spenta."); return done(); }
      const n = ["ms_prg1", "ms_prg2", "ms_prg3"].filter((x) => F.is(x)).length;
      if (n < 3) { say("voce", `La console chiede tre codici. Sono nei registri sparsi per il centro (${n}/3).`); return done(); }
      if (!F.is("ms_zero_fight")) {
        say("ms_zero", "[arrabbiato] La porta si apre. E dentro... ancora le loro macchine. Ancora accese. Venite, venite tutte.");
        return ask("Dal Blocco Bianco escono gli automi di sorveglianza di Cerbero.", [
          { label: "⏸ Abbatti gli automi", sub: "Scontro «Squadra in Pausa» · Zero in squadra · 3 ondate", big: true, cls: "hot", fn: () => fightOn("ms_zero", { title: "Il Blocco Bianco", arena: "campo", foeCol: "#e5e7eb", foeEye: "#ef4444", waves: [[["base", 4], ["lesto", 1]], [["scudo", 3], ["base", 2]], [["grosso", 2], ["boss", 1]]] }, () => { F.set("ms_zero_fight", true); say("voce", "L'ultimo automa cade. Dentro il Blocco Bianco, solo silenzio e una sala server che ronza."); return bianco(); }) },
          { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => bianco(), true) }
        ]);
      }
      say("ms_zero", "[serio] Ho trovato la sala dei registri. C'è tutto: nomi, cartelle, quanto valeva ognuno di noi. Ho una carica, Comandante. Una grande.");
      return wask("Zero ha il detonatore in mano. Ti guarda. Per la prima volta, aspetta.", [
        { label: "🔵 «Fallo saltare. Insieme.»", w: { esempio: 1 }, fn: () => { F.set("ms_pragia_saltata", true); say("voce", "Il Blocco Bianco si piega su se stesso come un foglio bagnato. La polvere sale sotto la pioggia e la pioggia la riporta giù."); say("ms_zero", "[felice] ...Ah. È così che ci si sente. Leggera. Leggerissima. Grazie."); sealLoyal("ms_zero", "Il Blocco Bianco non esiste più."); done(); } },
        { label: "«Decidi tu, Zero. È casa tua.»", fn: () => { F.set("ms_pragia_saltata", true); say("ms_zero", "[pensa] Casa mia. Nessuno l'ha mai chiamata così. Allora decido io: boom."); say("voce", "Il Blocco Bianco crolla. Zero lo guarda fino all'ultimo mattone."); sealLoyal("ms_zero", "Ha deciso da sola. Per la prima volta."); done(); } },
        { label: "🔴 «Prima scarichiamo i dati per Cerbero.»", sub: "+4 Risorse", w: { spregio: 2 }, fn: () => { F.set("ms_pragia_dati", true); K.bond("risorse", 4); say("ms_zero", "[arrabbiato] Per Cerbero. Per CERBERO. Prendi i tuoi dati, Comandante. Poi lo faccio saltare lo stesso. E ricordati che c'eri anche tu, qui dentro."); sealLost("ms_zero", "Hai venduto a Cerbero i suoi ricordi."); done(); } }
      ]);
    }
    // ---- la chiave del Passo nel relitto
    function iff() {
      if (F.is("ms_iff")) { say("voce", "La console della chiave: il trasponditore è già sulla Normanna. Ronza piano, come un gatto contento."); return done(); }
      say("ms_edi", "Comandante, questo è il trasponditore. Se lo stacco, la nave si sveglia. Tutta. Preparatevi.");
      return ask("Il relitto trema. I bozzoli si aprono uno dopo l'altro.", [
        { label: "⏸ Stacca il trasponditore", sub: "Scontro «Squadra in Pausa» · 4 ondate, con un capo", big: true, cls: "hot", fn: () => H.fight({ title: "Il relitto", arena: "tana", waves: [[["base", 6]], [["lesto", 4], ["scudo", 2]], [["grosso", 2], ["base", 4]], [["boss", 1], ["lesto", 3]]] }, (r) => {
          if (!r.win) { say("ms_edi", "Ritirata registrata. Il trasponditore è ancora lì. Anche loro."); return done(); }
          F.set("ms_iff", true); K.learnLore("l_iff"); K.bond("risorse", 3);
          say("voce", "Il relitto si spegne di nuovo, piano, come un fuoco sotto la cenere. Il trasponditore è tuo. Nei magazzini dei Raccoglitori, materiali che Cerbero sognava: Risorse +3.");
          say("ms_edi", "Una nota, Comandante: la macchina vicino ai bozzoli. Durante lo scontro ha alzato un braccio. Per proteggere voi.");
          done();
        }) },
        { label: "👥 Scegli la squadra", fn: () => K.crew.pick(() => iff(), true) }
      ]);
    }

    // ---------------------------------------------------------------- zone
    const shipEdge = (L) => { const { lay, put } = L; lay(0, 0, 29, 1, "w"); lay(0, 20, 29, 21, "w"); lay(0, 0, 0, 21, "w"); lay(29, 0, 29, 21, "w"); lay(1, 2, 28, 2, "O"); lay(1, 19, 28, 19, "O"); lay(1, 2, 1, 19, "O"); lay(28, 2, 28, 19, "O"); [[1, 2], [28, 2], [1, 19], [28, 19]].forEach(([x, y]) => put(x, y, "w")); put(1, 10, "Q"); put(1, 11, "Q"); put(0, 10, "q"); put(0, 11, "q"); };
    const back = { "0,10": { to: "ms_normanna", at: [27, 10] }, "0,11": { to: "ms_normanna", at: [27, 11] } };
    const zones = {
      ms_flotta: {
        region: "flotta", name: "La Flotta dei Pescatori", short: "La Flotta", sub: "Mille barche legate insieme", bg: "ms_flotta", time: "tramonto", w: 30, h: 22, base: "Q", start: [2, 10],
        itemCos: "ms_c3", items: [[8, 7], [18, 18], [27, 7], [3, 13]],
        areas: [[12, 2, 19, 8, "La barca del Consiglio"], [12, 13, 19, 19, "Il mercato galleggiante"], [22, 2, 28, 8, "Verso la nave di Rael"], [0, 0, 29, 21, "La Flotta dei Pescatori"]],
        act: { u: "Guarda la bancarella", z: "Guarda le casse", K: "Guarda la bitta", l: "Guarda la lanterna", n: "Leggi il cartello", M: "Guarda la console", b: "Siediti", s: "Riposa un momento" },
        flavor: { u: "Una bancarella: pesce secco, viti, una lampadina e una poesia. Tutto in vendita, la poesia a parte.", z: "Casse di ricambi: «DONO DEL PELLEGRINAGGIO · NON APRIRE PRIMA DI CASA».", K: "Una bitta con dieci cime legate sopra. Dieci barche si tengono per mano, qui.", l: "Una lanterna viola: sulla Flotta indica una famiglia in lutto. Ce ne sono tante, stasera.", n: "Il cartello: «LA FLOTTA NON SI FERMA · LA FLOTTA NON ATTRACCA · LA FLOTTA NON DIMENTICA».", M: "Una console di rotta: mille puntini in fila. Nessuno è fermo. Neanche uno.", b: "Una panca fatta con un pezzo di vela. Ondeggia con te.", s: "Ti siedi sul bordo della barca. La Flotta dondola come una culla enorme." },
        doors: back,
        npcs: () => [{ id: "ms_rana", at: [4, 11] }, { id: "ms_gerro", at: [14, 6] }, { id: "ms_koris", at: [17, 6] }],
        intro: [["voce", "La Flotta dei Pescatori: mille barche legate da passerelle, panni stesi tra gli alberi, lanterne viola accese qua e là."], ["voce", "Sul molo d'arrivo, una donna con il casco come quello di Tali ti aspetta a braccia conserte."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 21, "w"); lay(1, 10, 28, 11, ":");
          [[2, 2, 9, 8], [12, 2, 19, 8], [22, 2, 28, 8], [2, 13, 9, 19], [12, 13, 19, 19], [22, 13, 28, 19]].forEach(([a, b, c, d]) => lay(a, b, c, d, "Q"));
          [5, 15, 25].forEach((x) => { put(x, 9, ":"); put(x, 12, ":"); });
          house(3, 2, 5, 4, { door: [5, 5], roof: "#b91c1c", wall: "#e7d8b0", enter: "La casa-barca di Zia Rana: tutto avvitato, tutto in ordine. Sul tavolo, una foto di Tali bambina col primo casco, troppo grande." });
          house(13, 2, 6, 3, { door: [15, 4], roof: "#4c1d95", wall: "#c4b5fd", enter: "La sala del Consiglio: tre seggi, mille sedie pieghevoli e un martelletto fatto con un bullone." });
          house(23, 2, 5, 4, { door: [25, 5], roof: "#334155", wall: "#94a3b8", enter: "L'officina del molo est: da qui partivano i pezzi per la nave di Rael. Sul registro, la firma di Tali. Sempre la stessa, sempre con un cuoricino." });
          house(3, 15, 5, 4, { door: [5, 15], roof: "#047857", wall: "#e7d8b0", enter: "La scuola galleggiante: i bambini disegnano barche. Uno ha disegnato la Normanna, con un pilota col cappellino." });
          house(23, 15, 5, 4, { door: [25, 15], roof: "#a16207", wall: "#fef3c7", enter: "La cucina comune: una pentola enorme di zuppa di pesce. Chi passa mescola. È la legge." });
          [[13, 14], [17, 14], [13, 17], [17, 17]].forEach(([x, y]) => put(x, y, "u")); [[19, 13], [12, 19]].forEach(([x, y]) => put(x, y, "z"));
          [[2, 6], [9, 2], [19, 2], [28, 6], [2, 19], [28, 19]].forEach(([x, y]) => put(x, y, "K")); [[9, 8], [12, 8], [22, 8], [9, 13], [22, 13]].forEach(([x, y]) => put(x, y, "l"));
          put(8, 5, "n"); put(26, 7, "M"); put(15, 17, "b"); put(8, 18, "s");
          put(0, 10, "q"); put(0, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CONSIGLIO", d.X(15) + 8, d.Y(2) - 6, "#e9d5ff"); H.plaque(g, "MERCATO", d.X(15) + 8, d.Y(13) - 6, "#fde68a"); H.plaque(g, "◂ NORMANNA", d.X(2) + 8, d.Y(9) - 6, "#7dd3fc"); H.plaque(g, "OFFICINA", d.X(25) + 8, d.Y(2) - 6, "#cbd5e1"); }
      },
      ms_pragia: {
        region: "pragia", name: "Centro Federale di Pragia", short: "Pragia", sub: "Un centro sportivo in collina e un blocco bianco", bg: "ms_pragia", time: "giorno", w: 30, h: 22, base: ",", start: [2, 10],
        itemCos: "ms_c3", items: [[3, 8], [27, 19], [11, 12], [17, 3]],
        areas: [[3, 13, 12, 19, "Il campo d'allenamento"], [19, 2, 26, 8, "Il Blocco Bianco"], [2, 2, 10, 6, "La tribuna"], [0, 0, 29, 21, "Centro Federale di Pragia"]],
        act: { M: "Leggi il registro", g: "Guarda la porta", l: "Guarda il riflettore", t: "Guarda l'albero", r: "Guarda la roccia", n: "Leggi il cartello", b: "Siediti", s: "Riposa un momento" },
        flavor: { g: "Una porta da calcio con la rete marcita. Dietro, una scritta a pennarello: «QUI HO PARATO IL PRIMO RIGORE · Z.»", l: "Un riflettore che si accende a scatti. Illumina la pioggia, solo quella.", t: "Un albero cresciuto in mezzo alla pista d'atletica. Nessuno l'ha tagliato. Nessuno è tornato.", r: "Un masso con un'impronta di scarpa nel cemento. Piccola. Di bambino.", n: "Il cartello: «CENTRO FEDERALE DI PRAGIA · PROGETTO ASCENSIONE · ACCESSO SOLO AUTORIZZATI».", b: "Una panchina da bordo campo. Sopra, inciso con un chiodo: ventidue nomi.", s: "Ti siedi sotto la tettoia. La pioggia fa un rumore di applausi lontani." },
        doors: back,
        npcs: () => [],
        intro: [["voce", "Pragia: un centro federale abbandonato in collina, sotto una pioggia che non smette. Riflettori spenti, erba alta sulle linee."], ["voce", "In fondo, il Blocco Bianco. Zero non lo guarda. Lo sa dov'è senza guardarlo."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(29, 0, 29, 21, "t"); lay(0, 0, 0, 9, "t"); lay(0, 12, 0, 21, "t");
          lay(1, 10, 28, 11, ":"); lay(14, 1, 15, 20, ":"); lay(3, 13, 12, 19, "-"); put(3, 16, "g"); put(12, 16, "g");
          house(2, 2, 9, 4, { door: [6, 5], roof: "#7c2d12", wall: "#a8a29e", enter: "Gli spogliatoi della tribuna: armadietti aperti, scarpe piccole, un poster di un campione che sorride a nessuno." });
          house(19, 2, 8, 5, { door: [22, 6], roof: "#f8fafc", wall: "#e5e7eb", enter: "La porta del Blocco Bianco: acciaio, vernice bianca, una maniglia che non c'è. Si apre solo dalla console." });
          house(18, 14, 6, 4, { door: [20, 14], roof: "#57534e", wall: "#d6d3d1", enter: "Il dormitorio: venti letti in fila, rifatti al millimetro. Su uno, inciso nel legno: «ZERO». Sopra, sbarrato: «ZOE»." });
          put(22, 8, "M"); put(9, 8, "M"); put(25, 9, "M"); put(17, 16, "M");
          [[13, 4], [16, 4], [13, 17], [27, 17]].forEach(([x, y]) => put(x, y, "l")); [[17, 8], [27, 13], [2, 8], [11, 7], [25, 19], [8, 20]].forEach(([x, y]) => put(x, y, "t"));
          [[24, 19], [6, 8]].forEach(([x, y]) => put(x, y, "r")); put(4, 9, "n"); put(8, 12, "b"); put(16, 12, "s");
          put(0, 10, "q"); put(0, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BLOCCO BIANCO", d.X(22) + 8, d.Y(2) - 6, "#fca5a5"); H.plaque(g, "TRIBUNA", d.X(6) + 8, d.Y(2) - 6, "#e7e5e4"); H.plaque(g, "DORMITORIO", d.X(20) + 8, d.Y(14) - 6, "#e7e5e4"); H.plaque(g, "◂ NORMANNA", d.X(2) + 8, d.Y(9) - 6, "#7dd3fc"); }
      },
      ms_relitto: {
        region: "relitto", name: "Il relitto dei Raccoglitori", short: "Relitto", sub: "Costole nere, bozzoli d'oro, un cuore che batte piano", bg: "ms_relitto", time: "notte", w: 30, h: 22, base: "Q", start: [3, 10],
        itemCos: "ms_c3", items: [[4, 7], [17, 16], [26, 5], [11, 13]],
        areas: [[9, 3, 19, 18, "La stiva dei bozzoli"], [21, 3, 27, 18, "La plancia morta"], [0, 0, 29, 21, "Il relitto dei Raccoglitori"]],
        act: { V: "Guarda il bozzolo", M: "Guarda la console", l: "Guarda la luce", z: "Guarda le casse", n: "Leggi i segni" },
        flavor: { V: "Un bozzolo d'oro, tiepido. Dentro c'è solo una maglia piegata, con un numero. Il 7.", M: "Una console dei Raccoglitori: niente tasti, solo una superficie calda che vibra quando la tocchi.", l: "Una luce gialla che pulsa, lenta come un respiro di qualcuno che dorme.", z: "Casse di metallo nero senza scritte. Dentro, scarpini. Centinaia. Ordinati per taglia.", n: "Segni incisi sulla parete: tacche a gruppi di undici. Tante. Troppe.", O: "Fuori dal parapetto, il mare è nero. Il Passo, a nord, brilla d'arancio." },
        doors: back,
        npcs: () => (K.crew.has("ms_legione") || F.is("ms_legione_venduto") || F.is("ms_legione_spento") ? [] : [{ id: "ms_legione", at: [23, 14] }]),
        intro: [["voce", "Il relitto dei Raccoglitori: uno scafo nero e curvo, costole come un animale, bozzoli d'oro allineati nella stiva."], ["voce", "In fondo, a est, una console calda. Vicino ai bozzoli, una luce azzurra che non è dei Raccoglitori."]],
        build(L) {
          const { lay, put } = L; shipEdge(L);
          [[8, 4, 8, 8], [8, 13, 8, 17], [20, 4, 20, 8], [20, 13, 20, 17]].forEach(([a, b, c, d]) => lay(a, b, c, d, "a"));
          [[3, 4], [5, 4], [3, 16], [5, 16], [11, 4], [13, 4], [15, 4], [17, 4], [11, 17], [13, 17], [15, 17], [23, 4], [25, 4], [25, 17]].forEach(([x, y]) => put(x, y, "V"));
          put(26, 10, "M"); put(14, 10, "M"); [[10, 7], [18, 7], [10, 14], [18, 14], [24, 8]].forEach(([x, y]) => put(x, y, "l")); [[22, 17], [26, 14]].forEach(([x, y]) => put(x, y, "z")); put(4, 12, "n");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CHIAVE", d.X(26) + 8, d.Y(9) - 6, "#fde047"); H.plaque(g, "◂ NORMANNA", d.X(2) + 8, d.Y(9) - 6, "#7dd3fc"); }
      }
    };

    // ---- patch alle zone dei capitoli precedenti
    const add = (list, more) => list.concat(more.filter((n) => !list.some((x) => x.id === n.id)));
    const patch = {
      ms_normanna: { npcs: (s, list) => add(list, K.crew.has("ms_legione") && !K.crew.field().includes("ms_legione") ? [{ id: "ms_legione", at: [13, 11] }] : []) },
      ms_illio: { npcs: (s, list) => add(list, [].concat(onIt("ms_miranda") ? [{ id: "ms_oriana", at: [4, 12] }].concat(F.is("ms_mir_fight") ? [] : [{ id: "ms_niko", at: [8, 12] }]) : [], onIt("ms_tano") && K.clock.is("Notte") ? [{ id: "ms_talidi", at: [21, 18] }].concat(F.is("ms_talidi_detto") ? [{ id: "ms_nicola", at: [25, 12] }] : []) : [])) },
      ms_omega: { npcs: (s, list) => add(list, onIt("ms_garro") ? [{ id: "ms_sidonio", at: [15, 16] }] : []) },
      ms_purgatorio: { npcs: (s, list) => add(list, onIt("ms_jacopo") ? [{ id: "ms_ferro", at: [9, 12] }] : []) }
    };
    return {
      n: N, title: "Conti in sospeso", sub: "Ognuno a bordo ha un debito aperto",
      goal, start: "ms_normanna", introBg: "ms_titolo", zones, talk, patch,
      obj: {
        "ms_normanna:M:25,4": upgrades,
        "ms_pragia:M:9,8": log("ms_prg1", "Registro 1 · «Dormitorio, stanza 4. Soggetto Zero non dorme. Dorme con il cuscino sul viso. Annotare: resistenza al sonno indotto.»"),
        "ms_pragia:M:25,9": log("ms_prg2", "Registro 2 · «Soggetto 11 ritirato dal programma. Causa: non pervenuta. Famiglia informata: trasferimento all'estero.»"),
        "ms_pragia:M:17,16": log("ms_prg3", "Registro 3 · «Soggetto Zero: ottimo potenziale. Rabbia stabile. Consigliato trasferimento al Purgatorio per controllo. Firmato: (fumo di sigaretta sulla carta).»"),
        "ms_pragia:M:22,8": bianco,
        "ms_relitto:M:26,10": iff,
        "ms_relitto:M:14,10": () => { say("voce", "Il cuore del relitto: una sfera calda che batte una volta ogni dieci secondi. EDI conta i battiti. Si ferma a cento, per educazione."); done(); }
      },
      intro: [["voce", "La Normanna è ferma in rada, con le luci basse. Sette persone a bordo e sette conti aperti."], ["voce", "Nella Sala Tattica, il Signor Fumo ha spento la sigaretta. È la prima volta. Brutto segno."]]
    };
  }
  boot();
})();
