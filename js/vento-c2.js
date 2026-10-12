// js/vento-c2.js - LA VALLE DEL VENTO GENTILE · Capitolo 2 «La Casa che Cammina»
// Mattina senza vento a Mulinella. La Compagnia delle Turbine propone la Coppa delle Turbine (partita secondaria: scegli tu il modo).
// Di notte, nel Bosco dei Sussurri, la CASA CHE CAMMINA: una casa su quattro zampe di legno che gira per il bosco e si ferma
// ogni tanto. Si bussa solo quando è ferma, e la sua porta è sempre in un posto diverso. Dentro: il mago Ottone, che chiude
// i venti nei barattoli, e Brace, lo spirito del fuoco. Una commissione, una pagina del vecchio custode, e la promessa.
(function () {
  "use strict";
  function boot() { const V = window.__vento; if (!V || !V.addChapter || !V._has(1)) return setTimeout(boot, 120); V.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, learnLore, finishChapter, quest, questDone, questState } = K;
    const N = 2, S = () => K.stepOf(N), TS = 16;

    K.cast("ve_ottone", { acc: ["stella"], name: "Mago Ottone", tag: "", hair: "#e8d080", style: "long", skin: "#f2d8c0", eye: "#4a6aaa", bg: ["#3a2a4a", "#e8d080"], shirt: "#5a3a7a" },
      "Il padrone della Casa che Cammina. Mago, collezionista di venti, vanitoso come un pavone e gentile come un nonno. Ha paura che le cose belle finiscano, e allora le chiude nei barattoli.");
    K.cast("ve_brace", { acc: "", name: "Brace", tag: "", hair: "#ff6a2a", style: "spiky", skin: "#ffb83a", eye: "#2a1a0e", bg: ["#3a1a0e", "#ffb83a"], shirt: "#ff8a2a" },
      "Lo spirito del fuoco che muove la Casa che Cammina. Brontola, minaccia di spegnersi ogni due minuti, e non lo fa mai. Gli piacciono le bucce d'arancia e le storie che finiscono bene.");
    K.cos("ve_c2", { kind: "shirt", label: "Mantella della Casa che Cammina", val: "#5a3a7a", from: "Completa il Capitolo 2 de La Valle del Vento Gentile" });
    K.cos("ve_barattolo", { kind: "acc", label: "Stemma del barattolo di giugno", val: "#7ab8d8", from: "Riporta a Ottone il vento di giugno" });
    K.cos("ve_lucciola", { kind: "hairc", label: "Capelli Lucciola", val: "#e8f070", from: "Trova tutti i Soffi del Bosco dei Sussurri" });
    K.cos("ve_turbina", { kind: "acc", label: "Fascia della Compagnia delle Turbine", val: "#4a5a6a", from: "Gioca la Coppa delle Turbine" });

    K.lore("l_barattoli", { t: "I barattoli di Ottone", d: "Ottone chiude i venti nei barattoli: il vento di marzo che sa di terra, quello di giugno che sa di mare, quello di novembre che sa di castagne. Dice che così non finiscono mai. Brace dice che così non cominciano mai." });
    K.lore("l_promessa", { t: "La promessa", d: "Dal quaderno del vecchio custode: «Il vento soffierà sulla valle finché qualcuno giocherà sul prato per gioia. Quando non ci giocherà più nessuno così, il vento manterrà la parola e si fermerà. Firmato: Pietro Lieve, e il Vento.»" });
    K.lore("l_coppa", { t: "La Coppa delle Turbine", d: "La Compagnia propone una coppa: se vince lei, monta una turbina di prova sul colle. Il premio c'è, il pubblico c'è, i manifesti ci sono. Manca solo una cosa che nessuno nota: la voglia di giocare." });

    const goal = (s) => ({
      0: "Mulinella è senza vento. Parla con Selva, davanti al suo laboratorio.",
      1: "Gualdo ha visto la Casa che Cammina nel Bosco dei Sussurri: il sentiero parte in cima al villaggio, verso nord. (In piazza, Dora ha una proposta.)",
      2: "Nel bosco la Casa che Cammina si ferma ogni tanto: raggiungila e bussa quando è ferma.",
      3: "Dentro la Casa che Cammina: parla con Ottone.",
      4: "Ottone ha perso un barattolo nel bosco: trovalo (una cassetta tra le radici), poi riportaglielo.",
      5: "Torna a Mulinella: la valle aspetta di sapere cosa hai scoperto. Selva è alla locanda.",
    }[s] || "Capitolo concluso. Il prossimo ti aspetta dal menu.");

    // ---------------------------------------------------------------- LA CASA CHE CAMMINA (si muove tra quattro radure e si ferma)
    const HOUSE = { path: [[24, 7], [31, 15], [17, 18], [9, 9]], i: 0, x: 24, y: 7, stop: 6, door: null, step: 0 };
    function houseTick(px, py, dt, K, s) {
      if (s < 2 && !K.F.is("ve_casa_vista")) return null;
      const H = HOUSE, nx = H.path[(H.i + 1) % H.path.length];
      if (H.stop > 0) {
        H.stop -= dt; if (!H.door) setDoor(Math.round(H.x), Math.round(H.y) + 1);
        if (H.stop <= 0) clearDoor();
        return null;
      }
      const dx = nx[0] - H.x, dy = nx[1] - H.y, d = Math.hypot(dx, dy), v = 1.1 * dt;
      H.step += dt * 6;
      if (d <= v) { H.x = nx[0]; H.y = nx[1]; H.i = (H.i + 1) % H.path.length; H.stop = 7; K.tone(110, 0.3, "sine", 0.06, 0, 80); }
      else { H.x += dx / d * v; H.y += dy / d * v; if (Math.floor(H.step) % 2 === 0 && Math.random() < 0.02) K.SFX.step(); }
      return null;
    }
    function setDoor(tx, ty) { const zr = K.zone("ve_bosco"); if (!zr) return; HOUSE.door = [tx, ty, K.at(tx, ty)]; K.setTiles(tx, ty, tx, ty, "Q"); zr.spec.doors = { [tx + "," + ty]: { to: "ve_casa_in", at: [10, 10] } }; }
    function clearDoor() { const zr = K.zone("ve_bosco"); if (!zr || !HOUSE.door) return; const [tx, ty, was] = HOUSE.door; K.setTiles(tx, ty, tx, ty, was && was !== "Q" ? was : ":"); zr.spec.doors = {}; HOUSE.door = null; }
    function drawHouse(g, cx, cy, fr) {
      const H = HOUSE, x = H.x * TS - cx + 8, y = H.y * TS - cy + 14, walking = H.stop <= 0, sw = walking ? Math.sin(H.step) * 3 : 0;
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x, y + 16, 26, 6, 0, 0, 7); g.fill();
      // le quattro zampe di legno (con le ginocchia), che camminano
      [[-16, sw], [-6, -sw], [6, sw], [16, -sw]].forEach(([lx, s]) => { g.strokeStyle = "#5a3a22"; g.lineWidth = 3; g.beginPath(); g.moveTo(x + lx, y - 4); g.lineTo(x + lx + s * 0.6, y + 6); g.lineTo(x + lx + s, y + 16 - Math.abs(s) * 0.6); g.stroke(); });
      const by = y - 4 + (walking ? Math.abs(Math.sin(H.step)) * -2 : 0);
      g.fillStyle = "#7a6048"; g.fillRect(x - 22, by - 26, 44, 26); g.fillStyle = "#6a5040"; for (let i = 0; i < 4; i++) g.fillRect(x - 22, by - 24 + i * 6, 44, 1);
      g.fillStyle = "#8a4a32"; g.beginPath(); g.moveTo(x - 26, by - 24); g.lineTo(x - 4, by - 44); g.lineTo(x + 12, by - 34); g.lineTo(x + 26, by - 24); g.closePath(); g.fill();
      g.fillStyle = "#4a4a52"; g.fillRect(x + 8, by - 46, 6, 14); g.fillStyle = "#5a5a62"; g.fillRect(x - 18, by - 38, 5, 9); // due comignoli storti
      for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(210,210,220,${0.4 - i * 0.1})`; g.beginPath(); g.arc(x + 11 + Math.sin(fr / 15 + i) * 3, by - 50 - i * 6 - (fr / 4 % 6), 3 + i, 0, 7); g.fill(); }
      g.fillStyle = "#ffd98a"; g.fillRect(x - 16, by - 18, 7, 7); g.fillRect(x + 9, by - 18, 7, 7); g.fillStyle = "rgba(255,200,110,.35)"; g.beginPath(); g.arc(x - 12, by - 14, 12, 0, 7); g.arc(x + 12, by - 14, 12, 0, 7); g.fill();
      g.fillStyle = "#3a2418"; g.fillRect(x - 4, by - 12, 8, 12); g.fillStyle = "#e8c46a"; g.fillRect(x + 2, by - 6, 1.5, 1.5);
      // la scaletta che scende solo quando la casa è ferma
      if (!walking) { g.fillStyle = "#6a4a2a"; for (let i = 0; i < 3; i++) g.fillRect(x - 4, by + 1 + i * 5, 8, 2); g.font = "bold 7px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "rgba(28,44,38,.85)"; g.fillRect(x - 26, by - 62, 52, 11); g.fillStyle = "#fbf6e6"; g.fillText(`ferma · ${Math.ceil(H.stop)}s`, x, by - 54); g.textAlign = "left"; }
    }

    const zones = {
      ve_bosco: {
        music: "vento_notte",
        region: "bosco", name: "Il Vento Gentile · Il Bosco dei Sussurri", short: "Il Bosco dei Sussurri", sub: "Di notte, tra le lucciole", bg: "ve_bosco", time: "notte", travel: [20, 23],
        wind: { str: 0.08, turn: false },
        w: 40, h: 26, start: [20, 23], itemCos: "ve_lucciola", items: [[3, 3], [36, 4], [36, 22], [12, 13]],
        areas: [[14, 4, 34, 20, "Le radure della Casa"], [0, 0, 39, 25, "Il Bosco dei Sussurri"]],
        act: { t: "Guarda l'albero", r: "Guarda il sasso", Q: "Bussa alla Casa che Cammina", x: "Guarda tra le radici", v: "Torna a Mulinella", ";": "Guarda l'erba" },
        flavor: {
          t: ["Un faggio enorme. Sulla corteccia, alla tua altezza, qualcuno ha inciso un pallone. Più su, molto più su, un altro.", "Un tronco cavo. Dentro, una lucciola accende e spegne la luce come un faro piccolissimo.", "Le radici di un vecchio castagno. In mezzo, impronte rotonde, grandi come piatti: le zampe della Casa."],
          r: "Un sasso coperto di muschio, morbido come un cuscino. Ci dormono sopra due spiritelli verdi, abbracciati.",
        },
        intro: [["voce", "Il Bosco dei Sussurri, di notte. Non c'è vento, eppure le foglie bisbigliano. Le lucciole si accendono a gruppi, come se si passassero la voce."], ["voce", "Da qualche parte, tra gli alberi, si sente un rumore di passi. Passi di legno. Grandi."]],
        npcs: () => [],
        tick: houseTick,
        onEnter() { HOUSE.door = null; },
        decor(g, cx, cy, d) { if (S() >= 2 || F.is("ve_casa_vista")) drawHouse(g, cx, cy, d.fr); },
        build(L) {
          const { lay, put } = L;
          for (let y = 0; y < 26; y++) for (let x = 0; x < 40; x++) if (x < 2 || x > 37 || y < 2 || y > 23) put(x, y, "t");
          // il sentiero che sale dal villaggio e si apre in quattro radure collegate
          lay(19, 18, 20, 24, ":"); put(20, 25, "v"); put(19, 25, "t");
          lay(8, 6, 33, 19, ","); lay(14, 10, 26, 13, ":"); lay(9, 8, 10, 15, ":"); lay(24, 6, 25, 15, ":"); lay(16, 17, 32, 18, ":"); lay(30, 14, 32, 18, ":");
          [[12, 5], [27, 4], [5, 10], [34, 9], [6, 17], [13, 21], [27, 21], [35, 19], [3, 7], [22, 4], [29, 9], [13, 15], [21, 15], [36, 13]].forEach(([x, y]) => put(x, y, "t"));
          lay(3, 19, 7, 22, ";"); lay(32, 2, 36, 6, ";"); lay(28, 20, 33, 22, ";");
          [[17, 8], [33, 12], [5, 14]].forEach(([x, y]) => put(x, y, "r"));
          put(5, 20, "x"); put(16, 21, "S");
        },
      },
    };

    // ---------------------------------------------------------------- la Coppa delle Turbine (partita secondaria: il modo lo scegli tu)
    function coppa() {
      K.playMatch({
        id: "ve_coppa", alt: "az,cage,hd", force: false, oppTeam: "La Compagnia delle Turbine", oppColor: "#5a5a62", mate: "Selva Ventura", squad: ["Mastro Gualdo"], us: "Mulinella", homeKit: ["#5a8a4a", "#f4efe0"], azPitch: "erba", cageField: 1,
        chap: "Il Vento Gentile · La Coppa delle Turbine", bg: "ve_valle", intro: "La Coppa delle Turbine, sul prato senza vento: {n}, Selva e Gualdo contro la squadra della Compagnia. Ci sono i manifesti, c'è la banda, c'è il premio. Nessuno ride.",
        oppNames: ["Ing. Ferraglia", "Tecnico Bulloni", "Geometra Raso", "Perito Spina", "Cassiere Tondi"],
        done: (r) => {
          F.set("ve_coppa", r.win ? "vinta" : "persa"); K.learnLore("l_coppa"); const msg = K.reward("m:ve_coppa", { coins: r.win ? 40 : 20, cos: "ve_turbina" });
          if (!r.win) { bond("turbine", 2); F.set("ve_turbina_prova", true); }
          say([
            ["voce", r.win ? "Mulinella vince la Coppa delle Turbine. La banda suona. Dora stringe la mano a tutti, sportiva. I manifesti restano attaccati ai muri." : "La Compagnia vince la Coppa delle Turbine. Domattina monteranno una turbina di prova sul colle. Dora stringe la mano a tutti, gentile."],
            ["ve_selva", "Hai notato? Abbiamo giocato una partita intera, e nessuno ha riso. Nemmeno una volta. Nemmeno quando Gualdo è inciampato nel pallone."],
            ["voce", `Dal prato, i Soffi hanno guardato la partita da lontano, senza avvicinarsi. Sbuffo si è voltato prima della fine. <b>${msg.join(" · ")}</b>`],
          ]);
        },
      });
    }

    const talk = {
      ve_selva() {
        const s = S();
        if (s === 0) return say([
          ["ve_selva", "Ho provato a decollare dal colle, all'alba. Il Gabbiano ha fatto tre metri e si è seduto sull'erba come un cane stanco."],
          ["ve_selva", "Gualdo stanotte ha visto una cosa nel bosco: una casa che cammina. Dice che va avanti e indietro tra le radure, si ferma, fuma dal comignolo e riparte. Pensava di aver bevuto troppo liquore di Tisi. Poi l'ho vista anch'io, dalla finestra."],
          ["ve_selva", "Se c'è qualcuno che sa dov'è andato il vento, è qualcuno che vive in una casa che cammina. Il bosco comincia in cima al villaggio, dove finisce il sentiero. Vai stanotte: di giorno la casa dorme."],
        ], () => { setStep(N, 1); K.note("Selva ti ha parlato della Casa che Cammina, nel Bosco dei Sussurri."); done(); });
        if (s === 5) return ask("ve_selva", "Allora? Cosa c'era nella casa? Hai la faccia di chi ha letto una lettera non sua.", [
          { label: "Racconta tutto al villaggio: la promessa, il prato, la gioia", sub: "La verità, a tutti, stasera alla locanda", big: true, fn: () => end2("verita") },
          { label: "Lo dici solo a Selva", sub: "Prima capire, poi parlare", big: true, fn: () => end2("selva") },
          { label: "Ne parli con Dora: forse la Compagnia può aiutare", sub: "Una soluzione pratica", fn: () => end2("dora") },
        ], "ve_valle");
        return say([["ve_selva", s >= 6 ? "Domani si sale al colle. Tutti e due. Anzi, tutti e tre: Gualdo dice che non viene, quindi viene." : "Il bosco è a nord, in cima al villaggio. Le lucciole ti indicano la strada, se le guardi con gentilezza."]]);
      },
      ve_dora() {
        if (F.get("ve_coppa")) return say([["ve_dora", F.get("ve_coppa") === "vinta" ? "Avete vinto. Rispetto i patti: per tutta l'estate la Compagnia non monterà niente. Ma l'estate finisce, custode. E il vento?" : "La turbina di prova sarà montata domattina sul colle. Vedrà: quando girerà, nessuno si ricorderà più dei mulini."]]);
        return ask("ve_dora", "Custode! Le propongo una cosa semplice, sportiva: la Coppa delle Turbine. Una partita, oggi, sul prato. Se vince la Compagnia, montiamo una turbina di prova sul colle. Se vince Mulinella, ce ne andiamo per tutta l'estate.\n\nI manifesti li abbiamo già stampati. Sa, per ottimismo.", [
          { label: "Si gioca la Coppa delle Turbine", sub: "Partita secondaria: scegli tu il modo", cls: "hot", fn: coppa },
          { label: "«Montate pure la turbina. Proviamo»", sub: "Senza partita", fn: () => { F.set("ve_turbina_prova", true); F.set("ve_coppa", "ceduta"); bond("turbine", 3); K.learnLore("l_coppa"); say([["ve_dora", "Una persona ragionevole! Domattina sarà sul colle. Vedrà, custode: il vento si può aiutare."]]); } },
          { label: "«Non oggi»", fn: () => say([["ve_dora", "I manifesti aspettano. Io pure."]]) },
        ], "ve_valle");
      },
      ve_gualdo() { return say([["ve_gualdo", S() >= 5 ? "Hai visto la casa? Allora non ero ubriaco. Lo dirò a Tisi. No, non lo dirò a Tisi." : "Senza vento la farina non si macina. Ho fatto il pane con la farina di ieri. Domani lo farò con quella di oggi, cioè niente."]]); },
      ve_tisi() { return say([["ve_tisi", K.pick(["Stamattina nessuno è andato al prato. È la prima mattina da cinquant'anni. Ho fatto la zuppa lo stesso: le zuppe non sanno niente.", "I ventagli della locanda pendono come foglie d'inverno. Ne ho mosso uno con la mano, per farli contenti."])]]); },
      ve_ottone() {
        const s = S();
        if (s === 3) return say([
          ["ve_ottone", "Un ospite! Bussare a una casa che cammina non è da tutti. Io sono Ottone, mago, collezionista, e soprattutto bellissimo, come puoi notare."],
          ["ve_brace", "(dal camino) Bellissimo. Ha i bigodini sotto il cappello."],
          ["ve_ottone", "Quello è Brace. Muove la casa e dice cose false. Allora: cerchi il vento? Ce l'ho io. Cioè: ne ho un po'. Guarda."],
          ["voce", "Sugli scaffali, centinaia di barattoli. In ognuno, un filo di vento che gira su se stesso: bianco, azzurro, dorato. Hanno le etichette scritte a mano: «marzo, terra bagnata», «giugno, mare», «novembre, castagne»."],
          ["ve_ottone", "Li raccolgo da anni. Il vento se ne sta andando dappertutto, e io non voglio che finisca. Così lo chiudo qui. Al sicuro."],
          ["ve_brace", "Al sicuro e fermo. Come un uccello in una scatola da scarpe."],
          ["ve_ottone", "Ma io non c'entro, con la tua valle. Il vento della valle non l'ho preso io. Quello se n'è andato da solo: ha mantenuto una promessa."],
          ["ve_ottone", "Te la racconto. Ma prima, un favore: stanotte, mentre la casa inciampava su una radice, mi è caduto un barattolo. Il vento di giugno. Il mio preferito. È in una cassetta, tra le radici, a sud-ovest. Riportamelo, e ti mostro una cosa che ti riguarda."],
        ], () => { setStep(N, 4); quest("ve_giugno", "Il vento di giugno", "Ottone ha perso un barattolo tra le radici del bosco, a sud-ovest. Riportaglielo."); K.learnLore("l_barattoli"); done(); });
        if (s === 4 && F.is("ve_giugno_preso")) {
          questDone("ve_giugno"); bond("ottone", 2); const msg = K.reward("q:ve_giugno", { coins: 30, cos: "ve_barattolo" });
          return ask("ve_ottone", `Il vento di giugno! Senti: sa ancora di mare. Grazie, custode. <b>${msg.join(" · ")}</b>\n\nTi avevo promesso una cosa. Questa pagina me l'ha data un uomo, tanti anni fa, prima di salire al colle: era il custode del tuo prato. Mi disse: «Se un giorno arriva un altro custode, dagliela».\n\nIn cambio… posso tenere ancora un po' i miei barattoli? Solo un po'.`, [
            { label: "«Tienili. Ma un giorno aprili»", sub: "Gentile con Ottone", fn: () => { bond("ottone", 1); F.set("ve_ottone_promessa", true); reveal(); } },
            { label: "«Apri almeno quello di giugno. Adesso»", sub: "Un po' di vento libero", fn: () => { F.set("ve_giugno_libero", true); bond("ottone", -1); bond("gioia", 1); K.SFX.wind(); say([["voce", "Ottone esita. Poi stappa il barattolo. Il vento di giugno esce, fa un giro della stanza, scompiglia i capelli di Ottone, fa ridere Brace, e se ne va dalla finestra. Fuori, per un secondo, le lucciole si piegano tutte dalla stessa parte."], ["ve_ottone", "…Era bello anche così. Più bello, forse. Non dirlo a nessuno."]], reveal); } },
          ], "ve_casa");
        }
        if (s === 4) return say([["ve_ottone", "Il barattolo! In una cassetta tra le radici, a sud-ovest del bosco. Si riconosce: ha l'etichetta azzurra e fa un piccolo rumore di onde."]]);
        return say([["ve_ottone", s >= 5 ? "Il colle. Mormorio. Vai, custode, e porta una sciarpa: lassù il vento c'è sempre stato. Se c'è ancora, morde." : "Accomodati. Non toccare i barattoli con l'etichetta rossa: sono i venti di tempesta. Li tengo per le feste."]]);
      },
      ve_brace() {
        const s = S();
        if (s < 3) return say([["ve_brace", "Chi è? Non sono un fuoco qualunque. Sono un fuoco antico e terribile. Hai una buccia d'arancia?"]]);
        return ask("ve_brace", s >= 5 ? "Hai letto la pagina. Adesso sai. Sai cosa penso io? Che un fuoco senza vento si spegne. Pure io. Quindi sbrigati, custode." : "Ottone ti ha già chiesto un favore? Tipico. A me non chiede mai niente. Io muovo la casa, io scaldo il tè, io…", [
          { label: "Dai a Brace una buccia d'arancia", sub: "Ne avevi una in tasca, dal treno", fn: () => { if (F.is("ve_buccia")) return say([["ve_brace", "Un'altra? No, grazie. Una al giorno. Sono un fuoco con dei princìpi."]]); F.set("ve_buccia", true); bond("gioia", 1); say([["voce", "Brace la divora con uno sfrigolio felice. Per un attimo diventa verde, poi blu, poi di nuovo arancione. La casa fa un saltello sul posto."], ["ve_brace", "Ti voglio bene. Non dirlo a Ottone."]]); } },
          { label: "Lascialo brontolare", fn: () => done() },
        ], "ve_casa");
      },
    };
    function reveal() {
      K.learnLore("l_promessa"); setStep(N, 5); K.note("Hai letto la promessa del vecchio custode: il vento soffia finché qualcuno gioca sul prato per gioia.");
      say([
        ["voce", "La pagina è ingiallita, scritta a matita con una calligrafia storta. In alto, un pallone disegnato. Sotto:"],
        ["voce", "«Il vento soffierà sulla valle finché qualcuno giocherà sul prato <i>per gioia</i>. Quando non ci giocherà più nessuno così, il vento manterrà la parola e si fermerà. Firmato: Pietro Lieve, e il Vento.»"],
        ["ve_ottone", "Per gioia. Non per un premio, non per una coppa, non per i manifesti. Per gioia. Il vento è puntiglioso con le parole: è fatto d'aria, non ha altro."],
        ["ve_brace", "Da quanto tempo, a Mulinella, nessuno gioca solo per ridere? Tre mesi? Da quando sono arrivati quelli delle turbine con le coppe, i premi e le scommesse?"],
        ["ve_ottone", "Pietro è salito al colle undici anni fa, e non è più sceso. Lassù c'è Mormorio, il Soffio più grande della valle. Se vuoi sapere il resto, chiedilo a lui. Ma vai di giorno, e tieni stretta la sciarpa."],
      ]);
    }
    function end2(kind) {
      if (kind === "verita") { bond("gioia", 3); F.set("ve_verita", true); }
      else if (kind === "selva") { bond("selva", 2); F.set("ve_segreto", true); }
      else { bond("turbine", 2); F.set("ve_dora_sa", true); }
      const msg = K.reward("ch:ve_c2", { coins: 70, cos: "ve_c2" });
      finishChapter(N); setStep(N, 6);
      K.scene([
        ...(kind === "verita" ? [["voce", "Alla locanda, la sera, racconti tutto. La pagina passa di mano in mano. Gualdo la legge due volte. Tisi la legge tre volte, poi si soffia il naso con un ventaglio."], ["ve_tisi", "Per gioia. E noi che abbiamo fatto? Abbiamo stampato i manifesti."]]
          : kind === "selva" ? [["voce", "Lo racconti solo a Selva, sotto il portico del laboratorio, mentre il Gabbiano dorme sotto il telo."], ["ve_selva", "Allora il vento non è malato. È offeso. Questo… questo si può aggiustare. Credo."]]
          : [["voce", "Lo racconti a Dora, alla locanda. Lei prende appunti su un taccuino d'ottone, seria."], ["ve_dora", "Una promessa. Una clausola, in pratica. Interessante. Le clausole si possono rinegoziare, custode. Con i giusti strumenti."]]),
        ["ve_selva", "Domani si sale al colle. Da Mormorio. Io porto il Gabbiano, anche se dovrò trascinarlo."],
        ["voce", "Quella notte, dal capanno, guardi il colle. Lassù, in cima, c'è una forma bianca, grande come una casa. Ogni tanto si muove. Come qualcuno che respira, piano, nel sonno."],
        ["voce", `<b>Fine del Capitolo 2 · La Casa che Cammina.</b> ${msg.join(" · ")}`],
      ], () => K.openMain(), "ve_valle");
    }
    const obj = {
      "ve_bosco:Q": () => enterHouse(),
      "ve_bosco:v": () => go("ve_valle", 18, 3),
      "ve_valle:^": () => (S() >= 1 ? (setStep(N, Math.max(S(), 2)), go("ve_bosco", 20, 23)) : say([["voce", "Il sentiero che sale nel Bosco dei Sussurri. Prima senti cosa ha da dirti Selva: è davanti al suo laboratorio."]])),
      "ve_bosco:x:5,20": () => {
        if (F.is("ve_giugno_preso")) return say([["voce", "La cassetta tra le radici è vuota. Dentro, sabbia fine. Sabbia di mare, in mezzo a un bosco."]]);
        if (S() < 4) return say([["voce", "Una cassetta incastrata tra le radici. Dentro c'è un barattolo con l'etichetta azzurra. Non è tuo: lo lasci dov'è."]]);
        F.set("ve_giugno_preso", true); K.SFX.chest(); return say([["voce", "Tra le radici, una cassetta di legno. Dentro, avvolto in un panno, un barattolo con l'etichetta azzurra: «giugno, mare». Lo avvicini all'orecchio: dentro ci sono le onde."]]);
      },
    };
    function enterHouse() {
      if (!HOUSE.door || HOUSE.stop <= 0) return say([["voce", "La casa riparte proprio adesso. Raggiungila alla prossima radura!"]]);
      if (S() < 3) setStep(N, 3);
      F.set("ve_casa_vista", true);
      K.enterDoor("ve_bosco", HOUSE.door[0], HOUSE.door[1], { to: "ve_casa_in", at: [10, 10] });
    }
    // l'interno della Casa che Cammina: stanza «casa» con barattoli, il camino di Brace e Ottone
    const casaIn = {
      interior: true, region: "casa", name: "La Casa che Cammina", short: "La Casa che Cammina", sub: "Dentro, tutto ondeggia appena", bg: "ve_casa", w: 20, h: 13, start: [10, 10],
      intro: [["voce", "Dentro la Casa che Cammina tutto ondeggia appena, come su una barca. Profumo di tè, di legna e di cose vecchie. Su ogni parete, scaffali pieni di barattoli che brillano."]],
      act: { L: "Guarda i barattoli", H: "Guarda il camino", T: "Guarda il tavolo", B: "Guarda il letto", W: "Guarda dalla finestra", v: "Esci dalla casa", D: "Apri la credenza" },
      flavor: {
        L: ["Barattoli di vento. «Aprile, ciliegi». «Agosto, temporale». «Un martedì qualunque». Ognuno gira su se stesso, piano.", "Un barattolo vuoto con l'etichetta: «Mulinella». Sotto, a matita: «non si prende»."],
        T: "Sul tavolo, tazze spaiate e una teiera che si versa da sola, a scatti, come chi ha il singhiozzo.",
        B: "Un letto a baldacchino, troppo grande per la stanza. Le tende sono fatte di vecchie mappe del cielo.",
        W: "Dalla finestra il bosco scorre piano. La casa cammina anche adesso, mentre parli.",
        D: "Nella credenza: biscotti, bucce d'arancia (per Brace), e un cappello di Ottone con dentro altri tre cappelli.",
        H: "Il camino. Dentro, Brace ti guarda con due occhi come due monete di rame.",
      },
      npcs: (s) => [{ id: "ve_ottone", at: [12, 6] }, { id: "ve_brace", at: [10, 2] }],
      build(L) {
        const { lay, put } = L; lay(0, 0, 19, 12, "="); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v");
        put(10, 1, "H"); put(4, 1, "W"); put(15, 1, "W"); for (let x = 1; x <= 7; x++) if (x !== 4) put(x, 2, "L"); for (let x = 13; x <= 18; x++) if (x !== 15) put(x, 2, "L");
        lay(7, 6, 12, 8, '"'); put(16, 5, "B"); put(16, 6, "B"); put(4, 6, "T"); put(5, 6, "T"); put(4, 7, "b"); put(2, 10, "D"); put(17, 10, "z");
      },
    };
    zones.ve_casa_in = casaIn;
    const patch = {
      ve_valle: {
        npcs: (s, list) => [...list, { id: "ve_selva", at: [24, 9] }, { id: "ve_dora", at: [20, 16] }, { id: "ve_gualdo", at: [6, 9] }],
        build(L) { L.put(18, 0, "^"); L.put(19, 0, "^"); L.lay(18, 1, 19, 1, ":"); },
        act: { "^": "Sali nel Bosco dei Sussurri" },
      },
      ve_locanda: { npcs: (s, list) => (K.stepOf(N) >= 5 ? [...list, { id: "ve_selva", at: [6, 8] }] : list) },
    };
    return { n: N, title: "La Casa che Cammina", sub: "Il bosco di notte, i barattoli di vento, la promessa", goal, start: "ve_valle", introBg: "ve_valle", zones, talk, obj, patch,
      intro: () => [["voce", "Mattina, a Mulinella. Niente vento. I panni stesi pendono dritti. Il fumo dei comignoli sale in verticale, come una matita."], ["voce", "In piazza qualcuno ha attaccato dei manifesti nuovi, lucidi: «COPPA DELLE TURBINE · OGGI · SI VINCE IL FUTURO»."]] };
  }
  boot();
})();
