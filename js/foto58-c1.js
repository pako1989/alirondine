// js/foto58-c1.js - «LA FOTO DEL '58» · Capitolo 1: La Corriera
// Viola Sanna, archivista, ti chiama all'Archivio: in una scatola di latta c'è la foto della Rondine 1958, un volto graffiato e una scritta sul retro.
// La macchina a soffietto di Nando Brizzi apre il primo negativo (la partenza in piazza); la Camera Oscura sviluppa il secondo (la curva del Passo).
// Al Bar Sport c'è Ilario Gentile, il ragazzo coi guanti: non ricorda niente. Il Registro delle partenze dice dove sono finiti tre di loro.
// Qui stanno anche gli aiuti comuni dei capitoli: il mirino (window.__f5Mir), i dialoghi con le figure ferme (window.__f5FT), le zone del presente (window.__f5P).
(function () {
  "use strict";
  // ------------------------------------------------------------------------------------------------ il mirino: i negativi che hai aperto
  const NEG = [
    ["f5_piazza58", "🎞️ La partenza", "Piazza del Borgo, aprile 1958, le sette e venti", [16, 19], "f5_neg_partenza"],
    ["f5_curva", "🎞️ La curva del Passo", "La corriera ferma, la neve, una lite", [16, 13], "f5_dev_curva"],
    ["f5_albergo", "🎞️ L'Albergo del Passo", "La semifinale nella neve e la notte in albergo", [11, 20], "f5_dev_albergo"],
    ["f5_galleria", "🎞️ La galleria", "Il lampo del flash, il crollo", [3, 6], "f5_dev_galleria"],
    ["f5_ritorno", "🎞️ Il ritorno", "Piazza del Borgo, di notte, la corriera che torna", [16, 18], "f5_dev_ritorno"]
  ];
  window.__f5Mir = (K) => {
    const l = NEG.filter((n) => K.F.is(n[4]));
    if (!l.length) return K.say([["voce", "Nel mirino c'è solo l'Archivio, capovolto e sfocato. Il soffietto aspetta un negativo."]], K.done);
    K.ask("voce", "Avvicini l'occhio al mirino della macchina a soffietto. Dentro, capovolta, una scena aspetta di tornare dritta. Quale negativo apri?", l.map((n) => ({ label: n[1], sub: `${n[2]} · ascoltati ${window.__f5H(K).heard(n[0])}/${(window.__foto58FZ[n[0]] || { list: [] }).list.length}`, fn: () => { K.F.set("f5_mir_" + n[0], true); K.go(n[0], n[3][0], n[3][1]); } })).concat([{ label: "◂ Resta nel presente", fn: () => K.done() }]));
  };
  // ------------------------------------------------------------------------------------------------ IL NEGATIVO: le figure ferme
  // over["zona:id"] = fn() sostituisce l'ultima frase; after(zid, id) può aggiungere righe (H.say) dopo averla ascoltata
  window.__f5FT = (K, H, over, after) => {
    const T = {};
    Object.keys(H.FZ).forEach((z) => H.FZ[z].list.forEach(([id]) => {
      if (T[id]) return;
      T[id] = () => {
        const zid = K.api.trZone(), Z = H.FZ[zid]; if (!Z) return K.PASS;
        const e = Z.list.find((x) => x[0] === id); if (!e) return K.PASS;
        const f = over && over[zid + ":" + id]; if (f) return f();
        const o = e[4] || {}, first = !K.F.is("f5_h_" + zid + "_" + id.slice(3));
        if (H.P58[id] && K.deduce) K.deduce.note(id, zid, true);
        K.F.set("f5_h_" + zid + "_" + id.slice(3), true);
        H.say("voce", `<em>(${o.d || "Fermo a metà gesto."}${o.back ? ` Di spalle si legge il numero <b>${o.back}</b>.` : ""})</em>`);
        H.say(id, e[3]);
        if (first && H.P58[id]) H.say("voce", "<span style='color:#7f1d1d'>📓 Appunto nel Taccuino.</span>");
        if (first && after) after(zid, id);
        if (first && H.heard(zid) === Z.list.length) H.say("voce", `<b>Hai ascoltato tutti, in «${Z.t}».</b> La scena trattiene il fiato. Torna al cavalletto per staccarti dal mirino.`);
        H.done();
      };
    }));
    return T;
  };
  // ------------------------------------------------------------------------------------------------ le zone del presente (ridefinite a ogni capitolo, con le persone di quel capitolo)
  // o = { borgo: npcs(s), arch: npcs(s), bar: npcs(s), archObj, barObj, borgoObj, borgoDoors, borgoItems, archLoot, intro: {borgo, arch, bar}, busOggi }
  window.__f5P = (K, H, o) => {
    const Z = window.__f5Z, F = K.F;
    const tac = () => { if (!K.deduce) return K.done(); K.deduce.open(() => K.done(), true); };
    const archObj = Object.assign({
      J: () => window.__f5Mir(K),
      T: () => { F.set("f5_foto_vista", true); K.say([["voce", "La foto, sotto la lampada verde. Quindici uomini davanti a una corriera, in seppia. La maglia era granata: lo sai perché la Rondine è granata da sempre, non perché si veda."], ["voce", "Apri il <b>📓 Taccuino</b>: per ogni volto, chi è e che fine ha fatto. Si conferma a gruppi di tre."]], tac); },
      x: () => K.say([["voce", "La scatola di latta dei biscotti Lazzaroni. Dentro, una volta, c'era la foto. Adesso c'è odore di carta e di ruggine."]], K.done),
      k: () => K.say([["voce", "La camera oscura, dietro la tenda nera: bacinelle, pinzette, la lampada rossa. Viola sviluppa qui i negativi, quando c'è da svilupparne uno."]], K.done),
      L: () => K.say([["voce", "Faldoni: «Verbali 1950-1960», «Tesseramenti», «Trasferte», «Varie (non buttare)». Viola dice che «Varie» è la sezione più importante di ogni archivio."]], K.done)
    }, o.archObj || {});
    return {
      f5_borgo: Z.piazza(H, o.borgo || (() => []), { mode: "oggi", busOggi: o.busOggi, objects: o.borgoObj, doors: Object.assign({ "4,22": { to: "f5_borgo", locked: () => { if (K.stepOf(1) >= 5 || K.F.is("f5_c1_done")) { const nw = K.deduce && K.deduce.learn("fate", "barbiere", true); return "La Barberia Sanna, «dal 1961». In vetrina, un pettine d'argento e una foto incorniciata: un uomo col ciuffo, il rasoio in mano, davanti alla bottega. Sotto: «Libero Sanna, barbiere, 1961-2019. Il pallone non lo voleva più vedere.»" + (nw ? " 📓 Nuovo destino nel Taccuino: <b>Barbiere al Borgo</b>." : ""); } return "La Barberia Sanna, «dal 1961». Chiusa per lutto da cinque anni, e mai riaperta. Il pettine d'argento in vetrina lo lucida ancora qualcuno."; } } }, o.borgoDoors || {}), items: o.borgoItems || [], itemCos: o.itemCos, intro: o.intro && o.intro.borgo, start: o.start, extra: o.extra, act: o.borgoAct, loot: o.borgoLoot }),
      f5_archivio: Z.archivio(H, o.arch || (() => []), { objects: archObj, loot: o.archLoot, intro: o.intro && o.intro.arch }),
      f5_bar: Z.bar(H, o.bar || (() => []), { objects: o.barObj, intro: o.intro && o.intro.bar })
    };
  };

  function boot() {
    const E = window.__foto58Core;
    if (!E || !E.api || !E.api.addChapter || !window.__f5H || !window.__f5Z || !window.__cameraOscura) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__f5H(K), Z = window.__f5Z, { say, done, ask } = H;
    const N = 1, S = () => K.stepOf(N), D = () => K.deduce;
    H.people();
    K.cos("f5_c1", { kind: "acc", label: "Sciarpa granata del '58", val: "sciarpa", from: "Capitolo 1 di La Foto del '58" });
    K.lore("l_f5_rondine58", { t: "L'U.S. Rondine 1958", d: "La squadra del Borgo nella stagione 1957-58: undici titolari, due riserve, il Professore in panchina e Nando Brizzi con la borsa e la macchina fotografica. Ad aprile partì per il Torneo del Passo, in corriera. Tornò un giorno dopo il previsto, senza coppa e senza due uomini." });
    K.lore("l_f5_soffietto", { t: "La macchina a soffietto", d: "Una Voigtländer del 1934, di Nando Brizzi, massaggiatore e fotografo della Rondine. Viola la tiene sul cavalletto all'Archivio. Se guardi nel mirino con un negativo giusto dentro, dice lei, «le persone finiscono la frase»." });
    K.lore("l_f5_registro", { t: "Il Registro delle partenze", d: "Il Comune segnava chi partiva per lavorare fuori: nome, destinazione, data. Dal 1958 al 1965 il Borgo perse un ragazzo su tre: Belgio, Svizzera, Torino, Argentina." });
    const goal = (s) => ({
      0: "Davanti all'Archivio del Borgo, in piazza, una donna con una matita dietro l'orecchio ti fa segno di entrare.",
      1: "All'Archivio: guarda la foto sul tavolo e la scatola di latta, poi parla con Viola.",
      2: `Guarda nel mirino della macchina a soffietto e ascolta quelli della partenza (${H.heard("f5_piazza58")}/6 almeno). Poi torna da Viola.`,
      3: `Il negativo della curva è pronto: aprilo dal mirino e ascolta la lite (${H.heard("f5_curva")}/8 almeno). Poi parla con Viola.`,
      4: "Al Bar Sport, il tavolino vicino alla finestra: Ilario Gentile, il ragazzo coi guanti della foto. Ha ottantanove anni.",
      5: `Il Registro delle partenze è negli scaffali dell'Archivio. Poi, nel Taccuino, conferma tre volti (${H.conf()}/3).`,
      6: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      setStep(N, 6); F.set("f5_c1_done", true);
      const m = K.reward("f5_c1", { coins: 100, cos: "f5_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["f5_viola", "[felice] Tre! Tre nomi con la loro vita attaccata. Lo so che sembra poco. Ma questa foto è stata zitta per settant'anni."],
        ["f5_viola", "[pensa] Ilario però mente. Uno che non ricorda niente non smette di mescolare le carte quando senti nominare la galleria."],
        ["voce", "Sul retro della foto, a matita, sotto «Nessuno tornò uguale», qualcuno aveva cominciato una seconda riga e l'aveva cancellata con la gomma. Si legge solo una «I» maiuscola."],
        ["voce", `<b>FINE DEL CAPITOLO 1 · «La Corriera»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 2 ti aspetta: l'Albergo del Passo, una semifinale giocata nella neve, la notte prima della finale. E una signora in piazza che lavora a maglia e ricorda tutto, tranne quello che non vuole."]
      ]), () => K.openMain(), "f5_bacheca");
    }
    // dopo ogni frase ascoltata: i progressi del capitolo
    const after = (zid) => {
      if (S() === 2 && zid === "f5_piazza58" && H.heard(zid) === 6) say("voce", "<b>Sei voci.</b> Basta per capire che quella mattina nessuno sapeva niente. Torna al cavalletto e racconta tutto a Viola.");
      if (S() === 3 && zid === "f5_curva" && H.heard(zid) === 8) say("voce", "<b>Otto voci.</b> Il capitano e il Nove: una lite vera, non da spogliatoio. Torna da Viola.");
    };
    const over = {
      "f5_curva:f5_renzo": () => {
        const first = !F.is("f5_h_f5_curva_renzo"); F.set("f5_h_f5_curva_renzo", true); if (first) after("f5_curva");
        say("voce", "<em>(Il Nove. Il pugno chiuso, la giacca strappata. Ma il viso… il viso non c'è: nel negativo, come nella foto, dove dovrebbe esserci la faccia c'è un graffio bianco.)</em>");
        say("f5_renzo", "Io all'osservatore non ho chiesto niente! È lui che ha chiesto di me!");
        say("voce", "Nel Taccuino, il Nove non c'è ancora: un volto senza faccia non si può segnare.");
        done();
      }
    };

    const talk = Object.assign(window.__f5FT(K, H, over, after), {
      f5_viola() {
        const s = S();
        if (s === 0) {
          say("f5_viola", "[felice] Sei tu, quello che ha risposto all'annuncio? «Cercasi persona paziente per riordino fotografico, pagamento in caffè». Sì? Meraviglioso. Nessun altro ha risposto. Neanche per sbaglio.");
          say("f5_viola", "[serio] Viola Sanna, archivista del Borgo. Sto preparando la mostra «Un secolo di Rondine» e ho un buco nel 1958. Un buco a forma di foto. Vieni dentro, che fuori c'è la signora Pia che ascolta.");
          setStep(N, 1); quest("f5_c1a", "L'Archivio del Borgo", "Viola ti aspetta all'Archivio: una foto, una scatola di latta, un buco nel 1958.");
          const l = H.flush(); return K.say(l, () => K.go("f5_archivio", 8, 8));
        }
        if (s === 1) {
          if (!F.is("f5_foto_vista")) { say("f5_viola", ["[pensa] La foto è sul tavolo, sotto la lampada. Guardala bene. Poi la scatola, accanto.", "[ride] Non mordono. Le foto vecchie al massimo ti guardano male."][K.hash(Date.now()) % 2]); return done(); }
          say("f5_viola", "[serio] L'hanno trovata gli eredi della fornace Bassi, svuotando la soffitta. Una scatola di latta, e dentro questa. Sul retro, a matita: «Nessuno tornò uguale». E quattordici nomi. Il quindicesimo è graffiato via, sulla carta e sul retro.");
          say("f5_viola", "[pensa] I nomi li abbiamo, vedi? Quello che non sappiamo è chi è chi. E che fine hanno fatto. Al Borgo, del '58, non parla nessuno. Mio nonno Libero era in questa foto, e non mi ha mai detto quale fosse.");
          say("f5_viola", "[furbo] Però abbiamo lei. La Voigtländer di Nando Brizzi, il fotografo. Il negativo della foto era ancora dentro. Guarda nel mirino. Poi dimmi che sono matta.");
          say("voce", "Ricevi il <b>📓 Taccuino</b> (Menu → Registro). Volti, nomi, destini: si conferma a gruppi di tre giusti.");
          F.set("f5_neg_partenza", true); setStep(N, 2); quest("f5_c1b", "Il mirino", "Guarda nel mirino della macchina a soffietto, sul cavalletto vicino al tavolo.");
          return done();
        }
        if (s === 2) {
          if (H.heard("f5_piazza58") < 6) { say("f5_viola", `[serio] Allora? Nel mirino? …Ne hai sentiti ${H.heard("f5_piazza58")}. Torna dentro: almeno sei. Io intanto faccio il caffè. Il quarto.`); return done(); }
          say("f5_viola", "[sorpreso] Parlano? Davvero parlano? E dicono… «sorridi che magari è l'ultima»? Ma che razza di foto ricordo è.");
          say("f5_viola", "[pensa] Nella busta del negativo ce n'erano altri. Rovinati, mai sviluppati: la data a matita dice «Passo, 12 aprile». La camera oscura è dietro la tenda. Io tengo la pinzetta, tu dimmi chi è chi.");
          return H.develop({ id: "curva", title: "Il negativo della curva", ids: ["f5_carmine", "f5_rocco", "f5_ottavio", "f5_bepi", "f5_tonino", "f5_ilario58"], seed: 58, diff: 0,
            intro: "Il negativo della curva del Passo. Sei facce che affiorano dal bagno: dì chi è chi prima che la carta si annerisca." }, (r) => {
            if (r && r.viola) say("f5_viola", "[ride] Fatto io, con calma e due imprecazioni. Non dirlo alla mostra.");
            else say("f5_viola", "[felice] Guarda! La neve! Ad aprile! E la corriera di traverso sulla curva!");
            say("voce", "Nel mirino, adesso, c'è anche <b>la curva del Passo</b>.");
            setStep(N, 3); quest("f5_c1c", "La curva del Passo", "Apri il negativo della curva dal mirino e ascolta cosa è successo."); K.questDone("f5_c1b");
            done();
          });
        }
        if (s === 3) {
          if (H.heard("f5_curva") < 8) { say("f5_viola", `[serio] La curva: ${H.heard("f5_curva")} voci. Ne servono almeno otto per capirci qualcosa. Io dalla curva del Passo ci passo solo con la corriera di Mauro, e con gli occhi chiusi.`); return done(); }
          say("f5_viola", "[serio] Il capitano e il Nove si sono presi a spinte sulla neve. Per un osservatore. Di una squadra di città, il Brianza. Il Nove era il più forte, e lo sapeva.");
          say("f5_viola", "[pensa] Il Nove è quello senza faccia. Al Borgo si diceva che «uno sparì nella neve», e basta. Mio nonno diceva: «Tagliati i capelli e non fare domande», che era il suo modo di dire tutto.");
          D() && D().learn("fate", "sparito");
          say("f5_viola", "[furbo] Ma uno vivo c'è. Al Bar Sport, il tavolino vicino alla finestra. Ilario Gentile. Era la riserva, il ragazzo coi guanti. Fa il solitario da quarant'anni e non ha mai perso, dice Nello. Non si sa contro chi.");
          setStep(N, 4); K.questDone("f5_c1c"); quest("f5_c1d", "Il tavolino alla finestra", "Al Bar Sport, in piazza, Ilario Gentile: l'ultimo vivo della foto.");
          return done();
        }
        if (s === 4) { say("f5_viola", "[serio] Il Bar Sport è dall'altra parte della piazza. Ilario lo riconosci: è quello che non alza la testa quando entra qualcuno."); return done(); }
        if (s === 5) {
          if (!K.inv.has("f5_registro")) { say("f5_viola", "[pensa] Il Registro delle partenze del Comune? Ce l'ho io, in copia, negli scaffali. «Varie (non buttare)», ovvio."); return done(); }
          say("f5_viola", `[serio] Ora prendi il Taccuino e prova. Chi sei sicuro che sia, e dove è andato. Tre giusti insieme, e la foto si «ferma». ${H.conf()}/3.`);
          if (H.conf() >= 3) return fin();
          return done();
        }
        say("f5_viola", "[felice] Domani si va al Passo. Nel negativo, intendo. Io porto i biscotti.");
        return done();
      },
      f5_ilario() {
        const s = S();
        if (s < 4) { say("f5_ilario", "[serio] …Sette di coppe sul fante di spade. No. Su niente. Scusi, stavo giocando."); return done(); }
        if (s === 4) {
          say("voce", "Un uomo minuscolo, il berretto in testa al chiuso, le mani nodose sopra le carte. Ti guarda solo quando sei già seduto.");
          say("f5_ilario", "[serio] Viola l'archivista ti manda. Si vede: hai la faccia di uno che ha visto una foto vecchia. Siediti. Il caffè lo paghi tu.");
          return ask("Cosa gli chiedi?", [
            { label: "📷 «Lei è nella foto del '58.»", sub: "Mettila sul tavolo", fn: () => {
              say("f5_ilario", "[pensa] Sono in tante foto. Comunioni, matrimoni, funerali. Più funerali, ultimamente. È la statistica.");
              say("f5_ilario", "[serio] Il '58… avevo diciannove anni. Ero la riserva. Il portiere vero si fece male e io presi il suo posto. Perdemmo. Basta. Non c'è altro.");
              say("f5_ilario", "[arrabbiato] E della galleria non parlo. Non ne parla nessuno, al Borgo. Chiedi al Comune, che ha i registri. A me lasciami il mio solitario.");
              D() && D().learn("fate", "vivo"); K.rel.add("f5_ilario", 1); F.set("f5_ila_c1", true);
              setStep(N, 5); K.questDone("f5_c1d"); quest("f5_c1e", "Il Registro delle partenze", "Negli scaffali dell'Archivio, il Registro del Comune: chi partì dopo il '58, e per dove.");
              done();
            } },
            { label: "🃏 «Posso giocare anch'io?»", sub: "Prima le carte, poi le domande", fn: () => {
              say("f5_ilario", "[ride] Il solitario si gioca da soli. Si chiama così apposta. …Va be'. Tu tieni il mazzo.");
              say("voce", "Giocate dieci minuti in silenzio. Lui bara, un po', con eleganza. Poi parla senza alzare gli occhi.");
              say("f5_ilario", "[serio] Ero la riserva, nel '58. Il portiere vero si fece male. Io giocai la finale. Perdemmo. Il resto, chiedilo ai registri del Comune, che i registri non hanno rimorsi.");
              D() && D().learn("fate", "vivo"); K.rel.add("f5_ilario", 2); K.bond("pieta", 1); F.set("f5_ila_c1", true);
              setStep(N, 5); K.questDone("f5_c1d"); quest("f5_c1e", "Il Registro delle partenze", "Negli scaffali dell'Archivio, il Registro del Comune: chi partì dopo il '58, e per dove.");
              done();
            } }
          ]);
        }
        say("f5_ilario", ["[serio] Il caffè, poi le domande. Anzi: il caffè, e basta.", "[pensa] Nella foto ero seduto per terra. Mia madre aveva detto di non sporcarmi i calzoni. Era l'unica cosa che dovevo fare, e l'ho fatta.", "[ride] Nello, un altro. Corretto. Paga il ragazzo."][K.hash(Date.now()) % 3]);
        return done();
      },
      f5_nello() {
        if (S() === 4) { say("f5_nello", "[serio] Ilario? Al tavolino. Da quarant'anni. Il caffè glielo porto senza che lo chieda; se lo chiede, vuol dire che sta male."); return done(); }
        if (S() === 5 && !K.inv.has("f5_caffe")) { say("f5_nello", "[ride] Un corretto per Ilario? Glielo porti tu, così ti guarda in faccia. Offre la casa."); K.inv.give("f5_caffe"); say("voce", "Ricevi un <b>Caffè corretto</b> (🎒 Zaino): un regalo che al Borgo non si rifiuta."); return done(); }
        say("f5_nello", ["[pensa] Nel '58 il bar era di mio padre. Diceva che dopo il Passo la Rondine non vinse più niente per dieci anni. Neanche a carte.", "[ride] Le foto al muro? Tutte squadre del Borgo. Quella del '58 non c'è. Non c'è mai stata.", "[serio] Il Totocalcio, nel '58, lo teneva un certo Gatti, a Valle. Mio padre non ci giocava: «Gatti vince sempre», diceva."][K.hash(Date.now()) % 3]);
        return done();
      }
    });

    const zones = Object.assign(window.__f5P(K, H, {
      borgo: (s) => (s === 0 ? [{ id: "f5_viola", at: [6, 7] }] : []),
      arch: (s) => (s >= 1 ? [{ id: "f5_viola", at: [7, 6] }] : []),
      bar: (s) => [{ id: "f5_ilario", at: [13, 2] }, { id: "f5_nello", at: [4, 2] }],
      borgoItems: [[3, 15], [33, 9], [22, 16]], itemCos: "f5_c1",
      archObj: {
        x: () => { F.set("f5_scatola_vista", true); K.say([["voce", "La scatola di latta dei biscotti Lazzaroni. Dentro, una busta vuota col timbro di una ricevitoria, un tappo di sughero e niente altro."], ["voce", "Il retro della foto, che Viola ha lasciato girato accanto: <em>«Nessuno tornò uguale.»</em> E quattordici nomi, a matita, in colonna. Il quindicesimo è graffiato via fino a bucare la carta."]], K.done); },
        L: () => {
          if (S() < 5) return K.say([["voce", "Faldoni: «Verbali 1950-1960», «Tesseramenti», «Trasferte», «Varie (non buttare)». Viola dice che «Varie» è la sezione più importante di ogni archivio."]], K.done);
          if (!K.inv.has("f5_registro")) { K.inv.give("f5_registro"); K.learnLore("l_f5_registro"); }
          ["argentina", "belgio", "torino"].forEach((x) => D() && D().learn("fate", x, true));
          K.say([["voce", "In «Varie (non buttare)», tra le ricevute della fornace: il <b>Registro delle partenze</b>, copia a carta carbone. Scorri il '58 e il '59."],
            ["voce", "«Ferri Guido, portiere di fornace, per Buenos Aires, Argentina, 1958.» «Danzi Rocco, minatore, per Charleroi, Belgio, 1958.» «Perrella Antonio, per Torino, FIAT, 1959.»"],
            ["voce", "📓 Tre destini nuovi nel Taccuino: <b>Emigrato in Argentina</b>, <b>Emigrato in Belgio</b>, <b>Operaio a Torino</b>. Chi era chi, nella foto, lo devi dire tu."],
            ["voce", "In fondo, a matita, qualcuno ha scritto: «Sanna Libero: rimasto. Barbiere.» La barberia è in piazza, vicino alla scuola."]], K.done);
        }
      },
      intro: { arch: [["voce", "L'Archivio del Borgo: due stanze che odorano di colla e di caffè bruciato. Sul tavolo, sotto la lampada verde, una foto. Accanto, su un cavalletto, una macchina fotografica a soffietto, nera, come una fisarmonica che ha visto cose."]] }
    }), {
      f5_piazza58: Z.piazza(H, Z.frozenNpcs("f5_piazza58"), { mode: "58", start: [16, 19], items: [[3, 15], [33, 9]], itemCos: "f5_c1", act: { F: "Guarda nel bordo della fontana" },
        loot: { "8,10": { id: "f5_frame", text: "Sul bordo della fontana, sotto una goccia ferma a mezz'aria: un fotogramma ritagliato. Si vede la corriera dall'alto, il portapacchi, una valigia legata con lo spago rosso.", empty: "La goccia è ancora lì, a mezz'aria. Non cade." } },
        intro: [["voce", "Il mirino si apre come una finestra. La piazza del Borgo, ma con la corriera verde e crema, i festoni granata, l'odore di benzina e di brioche. Aprile 1958, le sette e venti."], ["voce", "Tutto è fermo. Un piccione a mezz'aria. Il fumo della marmitta come cotone. Quindici uomini in posa, e ognuno, se ti avvicini, finisce la frase che stava dicendo."]] }),
      f5_curva: Z.curva(H)
    });
    zones.f5_curva.intro = [["voce", "Il negativo della curva si apre in un bianco che fa male agli occhi. Neve. Ad aprile. La corriera di traverso, una ruota nel fosso, e in mezzo alla strada due uomini con i pugni chiusi."]];

    return {
      n: N, title: "La Corriera", sub: "Una foto, un volto graffiato, una macchina che fa finire le frasi",
      goal, start: "f5_borgo", introBg: "f5_titolo", zones, talk, obj: {},
      intro: [["voce", "Un annuncio in bacheca, al Comune: «Archivio del Borgo cerca persona paziente per riordino fotografico. Pagamento in caffè.»"], ["voce", "Tu hai risposto. Non sai bene perché. Forse per il caffè."], ["voce", "In piazza c'è il sole di novembre e la corriera blu di Mauro che fa manovra. All'Archivio, una donna con la matita dietro l'orecchio ti aspetta da settant'anni. O da stamattina: dipende da come la guardi."]]
    };
  }
  boot();
})();
