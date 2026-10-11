// js/cristalli-c2.js - CRISTALLI DEL CAMPO · Capitolo 2 «Il Cielo di Ferro»
// Il ponte della Rondine Grigia, la Città Sospesa (Torneo dei Venti, a scelta; il Cristallo del Vento insegna il Funambolo),
// la Forgia di Ferrogrigio (l'Armata: partita a turni, forzata). Si vola con la mappa del mondo in Mode 7.
// Colpo di scena: il quinto cristallo. Aira è il Cristallo del Campo, nato da tutte le partite giocate. E il re la vuole.
(function () {
  "use strict";
  function boot() { const CR = window.__cristalli; if (!CR || !CR.addChapter || !CR._has(1)) return setTimeout(boot, 120); CR.addChapter(chapter2); }
  function chapter2(X) {
    const { T, F, say, ask, done, go, note, setStep, reward, bond, learnLore, unlockJob, finishChapter } = X;
    const N = 2, S = () => X.stepOf(N);

    // ---------------------------------------------------------------- personaggi
    X.cast("cr_zefira", { name: "Madre Zefira", tag: "", hair: "#eaf6ff", style: "long", skin: "#e8c4a0", eye: "#3fa7ff", bg: ["#bfe3ff", "#3fa7ff"], shirt: "#ffffff" },
      "La sacerdotessa del Cristallo del Vento. Parla piano, come se il vento potesse portarle via le parole. Da giovane era un'ala destra velocissima: dicono che il vento la seguisse per vederla correre.");
    X.cast("cr_fanfaro", { name: "Araldo Fanfaro", tag: "", hair: "#c9a227", style: "cresta", skin: "#f0d0b0", eye: "#2a2a2a", bg: ["#3f6a9a", "#ffd36b"], shirt: "#3f6a9a" },
      "L'araldo del Torneo dei Venti. Ha una tromba, una voce più forte della tromba e un'opinione su tutto. Annuncia anche quando nessuno gliel'ha chiesto, soprattutto allora.");
    X.cast("cr_libeccio", { name: "Gallo Libeccio", tag: "", hair: "#e05a3a", style: "spiky", skin: "#d9a679", eye: "#2b1d14", bg: ["#bfe3ff", "#e05a3a"], shirt: "#ffffff" },
      "Capitano degli Aquiloni, la squadra della Città Sospesa. Spavaldo, rapido, simpatico quando perde. Non perde quasi mai, quindi non lo sa nessuno.");
    X.cast("cr_maestrale", { name: "Nonno Maestrale", tag: "gray", hair: "#d8d8d8", style: "slick", skin: "#d9a679", eye: "#2a4a6a", bg: ["#3f6a9a", "#eaf6ff"], shirt: "#6a8aaa", beard: true },
      "Vecchio portiere degli Aquiloni. Ha parato rigori per cinquant'anni. Adesso para piccioni, dalla panchina, con lo stesso stile.");
    X.cast("cr_lumio", { name: "Ser Lumio", tag: "", hair: "#e8d8a0", style: "slick", skin: "#f2d8c0", eye: "#6a5a2a", bg: ["#2a1a3a", "#c9a227"], shirt: "#c9a227" },
      "Araldo di Re Aldeberto. Guanti bianchi, sorriso di porcellana, un rotolo con il sigillo reale per ogni occasione. Non suda mai. Nessuno l'ha mai visto mangiare.");
    X.cast("cr_brunoferro", { name: "Sergente Brunoferro", tag: "", hair: "#3a3a44", style: "buzz", skin: "#c68642", eye: "#2a2a2a", cap: "#4a4a52", bg: ["#2a2a33", "#c0392b"], shirt: "#4a4a52", beard: true },
      "Il sergente che sorveglia il cancello della Forgia. Due metri di ferro e baffi. Ha un debole per le sfide di palleggio e per le regole, in quest'ordine.");
    X.cos("cr_c2", { kind: "shirt", label: "Casacca del Vento", val: "#bfe3ff", from: "Completa il Capitolo 2 di Cristalli del Campo" });
    X.cos("cr_nuvola", { kind: "hairc", label: "Capelli Nuvola", val: "#eaf6ff", from: "Raccogli tutti i frammenti di luce nella Città Sospesa" });
    X.cos("cr_brace", { kind: "shirt", label: "Maglia Brace", val: "#e05a3a", from: "Raccogli tutti i frammenti di luce alla Forgia" });
    X.cos("cr_rondine", { kind: "shirt", label: "Giubbotto da Pilota", val: "#5a3a2a", from: "Raccogli i frammenti di luce sul ponte della Rondine Grigia" });
    X.cos("cr_aquilone", { kind: "shirt", label: "Maglia degli Aquiloni", val: "#ffffff", from: "Un forziere nella Città Sospesa" });
    X.cos("cr_ferro", { kind: "hairc", label: "Capelli Ferrogrigio", val: "#5a5a62", from: "Un forziere alla Forgia" });

    // ---------------------------------------------------------------- frammenti di storia
    X.lore("l_decima", { t: "La Decima di Luce", d: "Il registro della Città Sospesa: ogni anno il re prende un decimo della luce di ogni Cristallo, «per proteggere la capitale». Trent'anni fa il decimo è diventato un terzo. Quest'anno, metà." });
    X.lore("l_ferro", { t: "La caduta di Ferrogrigio", d: "Ferrogrigio era un'isola come le altre. Trent'anni fa il suo Cristallo si spense e l'isola cadde in mare. I sopravvissuti costruirono navi di ferro. Da allora volano con luce presa in prestito." });
    X.lore("l_contratto", { t: "Il contratto col sigillo", d: "Un contratto con il sigillo di Re Aldeberto: il regno vende all'Impero la luce dei Cristalli, «in quantità crescenti». In fondo, la firma del re. E sotto, a mano: «Il Cristallo del Campo va trovato a ogni costo»." });
    X.lore("l_campo", { t: "Il quinto Cristallo", d: "Non ha un santuario. Nasce da tutte le partite giocate per gioia, in ogni prato del regno. Ogni tanto prende forma umana per vedere da vicino il gioco. Questa volta ha preso la forma di Aira." });

    // ---------------------------------------------------------------- l'aeronave: i luoghi della mappa del mondo (Mode 7)
    X.place("borgo", { name: "Borgo Radice", x: 120, y: 240, col: "#9fd18a", zone: "cr_borgo", at: [17, 15] });
    X.place("citta", { name: "Città Sospesa", x: 300, y: 120, col: "#bfe3ff", zone: "cr_citta", r: 52, land: () => { if (S() < 2) setStep(N, 2); go("cr_citta", 8, 20); } });
    X.place("forgia", { name: "Forgia di Ferrogrigio", x: 400, y: 380, col: "#ff6a3a", zone: "cr_forgia", r: 50, locked: () => S() < 5, land: () => { if (S() < 6) setStep(N, 6); go("cr_forgia", 6, 21); } });

    const goal = (s) => ({
      0: "Sul ponte della Rondine Grigia: parla con la Capitana Vela, accanto al timone.",
      1: "Prendi il timone (a destra del ponte) e vola alla Città Sospesa, a nord-est sulla mappa.",
      2: "Città Sospesa: sali al Tempio del Vento (in alto, al centro) e parla con Madre Zefira.",
      3: "All'arena (a destra) parla con l'araldo Fanfaro: il Torneo dei Venti.",
      4: "Torna al Tempio del Vento: Madre Zefira ti aspetta davanti al Cristallo.",
      5: "Sali sull'aeronave (piattaforma in basso a sinistra) e vola alla Forgia di Ferrogrigio, a sud-est.",
      6: "Forgia di Ferrogrigio: supera il cancello del Sergente Brunoferro (al centro, in basso).",
      7: "Oltre il fiume di lava, nella sala del Cristallo del Fuoco: affronta il Generale Kael.",
    }[s] || "Capitolo concluso. Il prossimo ti aspetta dal menu.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(10,20,64,.85)"); R(g, x - w / 2, y + 2, w, 1, "#c9a227"); g.fillStyle = "#ffe9b0"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    function mill(g, x, y, fr) { R(g, x - 2, y, 4, 14, "#e8e4dc"); g.save(); g.translate(x, y); g.rotate(fr / 40); for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 2); g.fillStyle = "#ffffff"; g.fillRect(-1.5, -13, 3, 12); g.fillStyle = "#3f6a9a"; g.fillRect(-1.5, -13, 3, 2); } g.restore(); }
    function warship(g, x, y, fr) { // la corazzata di Kael all'ormeggio
      const b = Math.sin(fr / 40) * 2; g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(x + 40, y + 56, 40, 6, 0, 0, 7); g.fill();
      g.fillStyle = "#2a2a33"; g.beginPath(); g.moveTo(x, y + 30 + b); g.lineTo(x + 84, y + 30 + b); g.lineTo(x + 72, y + 48 + b); g.lineTo(x + 10, y + 48 + b); g.closePath(); g.fill(); R(g, x + 4, y + 29 + b, 76, 2, "#c0392b");
      g.fillStyle = "#4a4a52"; g.beginPath(); g.ellipse(x + 42, y + 12 + b, 40, 14, 0, 0, 7); g.fill(); for (let i = 0; i < 6; i++) R(g, x + 10 + i * 12, y + 4 + b, 2, 18, "#3a3a44");
      for (let i = 0; i < 5; i++) { R(g, x + 14 + i * 13, y + 36 + b, 5, 4, "#ffb347"); X.light(x + 16 + i * 13, y + 38 + b, 10, "255,180,70", 0.3); }
      g.fillStyle = "#c0392b"; g.font = "bold 8px sans-serif"; g.fillText("FG", x + 36, y + 16 + b);
    }
    const zones = {
      cr_nave: {
        region: "cielo", name: "Cristalli del Campo · La Rondine Grigia", short: "La Rondine Grigia", sub: "Il ponte dell'aeronave, tra le nuvole", bg: "cr_cielo", dock: true,
        w: 22, h: 14, start: [8, 7], itemCos: "cr_rondine", items: [[4, 9], [15, 4]],
        areas: [[2, 3, 7, 10, "La prua"], [14, 3, 19, 10, "Il timone"], [2, 2, 19, 11, "Il ponte"]],
        act: { z: "Guarda le casse", p: "Guarda l'albero maestro", b: "Siediti", e: "Affacciati dal parapetto", f: "Appoggiati al parapetto", l: "Guarda la lanterna" },
        flavor: {
          z: ["Casse di mele del cielo, corde, un pallone di riserva. Su una cassa, scritto a mano: «NON APRIRE. (FRRR)»", "Una cassa con dentro mappe arrotolate. Su una, cerchiato in rosso: «capitale · NON atterrare»."],
          p: "L'albero maestro. Ci sono incise le iniziali di tutti quelli che hanno volato sulla Rondine Grigia. Bram ha già inciso le sue. In grande.",
          b: "Ti siedi. Il vento ti spettina. Sotto, il mare di nuvole scorre come un campo d'erba bianca.",
          e: ["Ti affacci. Le nuvole sono così vicine che sembra di poterle calciare.", "Un uccello ti vola accanto, ti guarda, decide che sei strano e se ne va."],
          f: "Il parapetto vibra con il motore. Ha il ritmo di un cuore contento.",
          l: "Una lanterna con un frammento d'ambra della Grotta di Terra. Bram l'ha montata ieri sera: «Così vediamo dove sbattiamo».",
        },
        intro: [["voce", "La Rondine Grigia, in volo. Il ponte di legno scricchiola, il pallone d'aria sopra le vostre teste brontola come Bram, e tutt'intorno c'è solo cielo."]],
        npcs: (s) => [{ id: "cr_vela", at: [16, 8] }, { id: "cr_bram", at: [10, 9] }, ...(s < 8 ? [{ id: "cr_aira", at: [4, 6] }] : []), ...(F.is("c2_trillo") ? [{ id: "cr_trillo", at: [12, 9] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 21, 13, "e");
          lay(4, 3, 17, 10, "="); lay(2, 5, 3, 8, "="); lay(18, 4, 19, 9, "="); lay(5, 2, 16, 2, "f"); lay(5, 11, 16, 11, "f");
          put(9, 4, "p"); put(13, 4, "p"); put(17, 6, "h"); [[13, 9], [14, 9], [14, 8]].forEach(([x, y]) => put(x, y, "z")); put(6, 9, "s"); put(5, 4, "b"); put(11, 3, "l"); put(18, 9, "l");
        },
        decor(g, cx, cy, d) { plaque(g, "TIMONE", d.X(17) + 8, d.Y(5) + 6); },
        top(g, cx, cy, d) { // l'ombra del pallone d'aria sopra il ponte, e le corde
          g.fillStyle = "rgba(20,30,60,.16)"; g.beginPath(); g.ellipse(d.X(11), d.Y(2), 120, 26, 0, 0, 7); g.fill();
          g.strokeStyle = "rgba(90,58,42,.5)"; g.lineWidth = 1; [5, 9, 13, 17].forEach((x) => { g.beginPath(); g.moveTo(d.X(x), d.Y(2)); g.lineTo(d.X(x) + 6, -10); g.stroke(); });
        },
      },
      cr_citta: {
        region: "cielo", name: "Cristalli del Campo · Città Sospesa di Aeria", short: "Città Sospesa", sub: "Marmo bianco, mulini e vento", bg: "cr_citta", dock: true, crystal: "#9fe0ff", cluster: "#9fe0ff", stands: ["#ffffff", "#3f6a9a", "#e05a3a"],
        dim: (s) => s < 4,
        w: 36, h: 28, start: [8, 20], itemCos: "cr_nuvola", items: [[3, 8], [33, 6], [14, 24], [20, 12]], pitch: [22, 11, 12, 7],
        areas: [[11, 1, 24, 8, "Il Tempio del Vento"], [21, 9, 34, 18, "L'arena dei Venti"], [2, 20, 10, 26, "La piattaforma d'attracco"], [0, 0, 35, 27, "Città Sospesa"]],
        chests: { "4,16": { coins: 30, cos: "cr_aquilone", text: "Una maglia bianca degli Aquiloni, con un biglietto: «Per chi batte Libeccio. Se non l'hai battuto, rimettila a posto»." }, "32,8": { coins: 40, text: "Monete e una piuma bianca enorme. Trillo la guarda con invidia profonda." } },
        act: { t: "Guarda l'albero", n: "Leggi il cartello", m: "Guarda i cristalli del vento", c: "Il Cristallo del Vento", p: "Guarda la colonna", j: "Guarda la tribuna", g: "Guarda la porta", b: "Siediti sulla panca", l: "Guarda la lanterna", e: "Affacciati sul vuoto", q: "Bussa alla porta", u: "Guarda la bancarella" },
        flavor: {
          t: "Un ciliegio del cielo. I petali non cadono: volano via, verso est, tutti insieme.",
          n: ["Cartello: «CITTÀ SOSPESA DI AERIA · Altitudine: sì · Vento: sempre».", "Cartello: «TORNEO DEI VENTI · Chi vince tocca il Cristallo. Chi perde tocca l'erba»."],
          m: "Cristalli azzurri, sottili come ali di libellula. Quando il vento passa, suonano.",
          p: "Una colonna di marmo, liscia, fredda. Ci hanno inciso i nomi dei vincitori del Torneo. L'ultimo è di trent'anni fa: Zefira.",
          j: "Le tribune dell'arena: tifosi in bianco e azzurro che sventolano aquiloni invece delle sciarpe.",
          g: "Una porta di marmo bianco con le reti di seta. Quando la palla entra, suona come un'arpa.",
          b: "Ti siedi. Da qui si vede tutta Calcistea: isole, mare di nuvole, e lontano, a est, una città dorata. La capitale.",
          l: "Una lanterna a forma di aquilone, appesa a un filo. Ondeggia sempre, anche senza vento.",
          e: "Il bordo della città. Sotto, nuvole. Una bambina ci butta un aeroplanino di carta: non scende, sale.",
          q: "Bussi. Una voce: «Se è per il torneo, l'arena è a destra. Se è per il vento, è dappertutto».",
          u: "Una bancarella di aquiloni. Il venditore dorme. Gli aquiloni no: tirano i fili come cani al guinzaglio.",
        },
        intro: [["voce", "La Città Sospesa di Aeria. Marmo bianco, tetti azzurri, mulini che girano senza fermarsi mai. Il vento qui ha un odore: di bucato e di erba appena tagliata."], ["cr_aira", "Il Cristallo del Vento è in alto, nel tempio. Lo sento. È stanco, ma è ancora gentile."]],
        npcs: (s) => [
          { id: "cr_zefira", at: [17, 6] }, { id: "cr_fanfaro", at: [26, 20] }, { id: "cr_libeccio", at: [30, 20] }, { id: "cr_maestrale", at: [14, 15] },
          ...(s <= 5 ? [{ id: "cr_aira", at: [10, 21] }] : []),
          ...(s === 4 && !F.is("c2_lumio") ? [{ id: "cr_lumio", at: [20, 7] }] : []),
        ],
        build(L) {
          const { lay, put, house, ship } = L;
          lay(0, 0, 35, 0, "e"); lay(0, 0, 1, 27, "e"); lay(34, 0, 35, 27, "e"); lay(0, 27, 35, 27, "e");
          // la piattaforma d'attracco con l'aeronave
          lay(2, 20, 10, 26, "+"); ship(3, 22);
          // viali di marmo
          lay(7, 19, 31, 19, ":"); lay(17, 9, 18, 19, ":"); lay(10, 20, 10, 21, ":");
          // il Tempio del Vento
          lay(11, 1, 24, 1, "a"); lay(11, 1, 11, 8, "a"); lay(24, 1, 24, 8, "a"); lay(12, 2, 23, 8, "+");
          put(17, 3, "c"); [[13, 3], [13, 7], [22, 3], [22, 7], [15, 2], [20, 2]].forEach(([x, y]) => put(x, y, "p")); put(17, 8, "+"); put(18, 8, "+");
          // case bianche con i tetti azzurri
          house(3, 3, 6, 4, { door: [5, 6], roof: "#3f6a9a", wall: "#f2f0ea", chimney: false });
          house(3, 10, 6, 4, { door: [6, 13], roof: "#5a8aba", wall: "#f2f0ea" });
          house(27, 2, 6, 4, { door: [29, 5], roof: "#3f6a9a", wall: "#f2f0ea" });
          // l'arena dei Venti
          lay(22, 11, 33, 17, "-"); lay(22, 10, 33, 10, "j"); lay(22, 18, 33, 18, "j"); put(27, 18, ":"); put(28, 18, ":"); put(22, 13, "g"); put(22, 14, "g"); put(33, 13, "g"); put(33, 14, "g");
          // giardini, panche, lanterne, cristalli, il cristallo azzurro
          [[12, 12], [9, 16], [13, 22], [20, 23], [26, 24], [31, 23], [2, 17], [9, 2]].forEach(([x, y]) => put(x, y, "t")); [[15, 12], [8, 9], [24, 23]].forEach(([x, y]) => put(x, y, "m"));
          put(14, 14, "b"); put(15, 14, "b"); put(12, 18, "s"); put(16, 18, "n"); [[11, 9], [26, 8], [12, 20], [25, 20], [32, 20]].forEach(([x, y]) => put(x, y, "l")); put(20, 21, "u"); put(4, 16, "x"); put(32, 8, "x");
        },
        decor(g, cx, cy, d) { mill(g, d.X(4) + 8, d.Y(3) - 2, d.fr); mill(g, d.X(30) + 8, d.Y(2) - 2, d.fr + 20); mill(g, d.X(6) + 8, d.Y(10) - 2, d.fr + 40); plaque(g, "TEMPIO DEL VENTO", d.X(17) + 8, d.Y(1) + 2); plaque(g, "ARENA DEI VENTI", d.X(27) + 8, d.Y(9) + 4); },
      },
      cr_forgia: {
        region: "forgia", name: "Cristalli del Campo · La Forgia di Ferrogrigio", short: "La Forgia di Ferrogrigio", sub: "Ferro, lava e corazzate", bg: "cr_forgia", dock: true, crystal: "#ff5a3a", cluster: "#ff7a3a",
        dim: (s) => s < 8,
        w: 36, h: 26, start: [6, 21], itemCos: "cr_brace", items: [[2, 15], [33, 14], [30, 22], [20, 8]], pitch: [12, 13, 12, 4],
        areas: [[12, 1, 23, 9, "La sala del Cristallo del Fuoco"], [11, 12, 24, 16, "Il cortile di ferro"], [1, 18, 9, 24, "L'attracco"], [0, 0, 35, 25, "La Forgia"]],
        chests: { "3,13": { coins: 35, lore: "l_ferro", text: "Dentro, un libro di bordo bruciacchiato." }, "33,2": { coins: 45, cos: "cr_ferro", text: "Un elmo da corazzata, troppo grande per chiunque. Dentro, una tintura grigio ferro e un biglietto: «Per Pim. Torna presto. La mamma»." } },
        act: { k: "Guarda l'incudine", z: "Guarda le casse", p: "Guarda la colonna", r: "Guarda il blocco di ferro", w: "Guarda la lava", n: "Leggi il cartello", c: "Il Cristallo del Fuoco", e: "Affacciati sul vuoto", l: "Guarda la lanterna", g: "Guarda la porta" },
        flavor: {
          k: ["Un'incudine grande come un letto. Ancora calda. Ci hanno battuto sopra un pallone di ferro: rimbalzerebbe come un sasso.", "Sull'incudine, inciso: «Ogni nave è un'isola che non vuole cadere»."],
          z: "Casse marchiate «LUCE · CAPITALE». Mandate dalla capitale? O alla capitale? L'etichetta è strappata a metà.",
          p: "Una colonna di ferro nero, con dentro tubi che pulsano di luce rossa. Rubata, o comprata: da qui non si capisce.",
          r: "Un blocco di ferro grezzo. Bram lo accarezza come un gatto: «Questo sì che è materiale»",
          w: "Un fiume di lava. Il calore ti asciuga gli occhi. Dentro, ogni tanto, si accende un riflesso che sembra un cristallo.",
          n: ["Cartello: «FORGIA DI FERROGRIGIO · Area militare · Vietato l'accesso ai non autorizzati e ai palloni».", "Cartello: «Si ricorda al personale che il Generale non tollera la parola 'ruggine'.» Vela ride."],
          e: "Il bordo dell'isola di ferro. Sotto, lontano, il mare. Ferrogrigio, una volta, era laggiù.",
          l: "Una lanterna di ferro con dentro una brace rossa. Fa più fumo che luce.",
          g: "Una porta di ferro saldata. Le reti sono catene sottili. Il pallone qui deve fare male.",
        },
        intro: [["voce", "La Forgia di Ferrogrigio. Un'isola di ferro tenuta insieme da bulloni e ostinazione. Fiumi di lava, martelli che battono, e all'attracco una corazzata grande come un borgo."], ["cr_vela", "Atterrare qui è da pazzi. Infatti l'ho fatto con stile."]],
        npcs: (s) => [
          ...(!F.is("c2_in") ? [{ id: "cr_brunoferro", at: [17, 17] }] : [{ id: "cr_brunoferro", at: [15, 18] }]),
          ...(F.is("c1_pim_talk") && s >= 6 ? [{ id: "cr_pim", at: [21, 20] }] : []),
          ...(s >= 6 && s <= 7 ? [{ id: "cr_aira", at: [8, 20] }] : []),
          ...(s >= 7 && s < 8 ? [{ id: "cr_kael", at: [17, 6] }] : []),
        ],
        build(L) {
          const { lay, put, ship } = L;
          lay(0, 0, 0, 25, "e"); lay(0, 25, 35, 25, "e"); lay(35, 0, 35, 25, "e"); lay(1, 0, 34, 0, "a");
          // l'attracco
          lay(1, 18, 9, 24, "+"); ship(2, 20); lay(9, 21, 17, 21, ":"); lay(17, 18, 18, 21, ":");
          // le mura con il cancello
          lay(1, 17, 34, 17, "a"); put(17, 17, ":"); put(18, 17, "a");
          // il cortile di ferro con il campo
          lay(12, 13, 23, 16, "-"); put(12, 14, "g"); put(12, 15, "g"); put(23, 14, "g"); put(23, 15, "g"); lay(17, 12, 18, 12, ":");
          [[4, 14], [8, 13], [28, 14], [31, 15]].forEach(([x, y]) => put(x, y, "k")); [[26, 13], [27, 13], [30, 13], [6, 15], [9, 15]].forEach(([x, y]) => put(x, y, "z")); [[10, 13], [25, 16], [10, 16], [25, 13]].forEach(([x, y]) => put(x, y, "p"));
          put(3, 13, "x"); put(14, 18, "n"); put(20, 18, "l");
          // il fiume di lava con il ponte
          lay(1, 11, 34, 11, "w"); lay(1, 10, 6, 10, "w"); lay(29, 10, 34, 10, "w"); put(17, 11, "="); put(18, 11, "=");
          // la sala del Cristallo del Fuoco
          lay(12, 1, 23, 1, "a"); lay(12, 1, 12, 9, "a"); lay(23, 1, 23, 9, "a"); lay(13, 2, 22, 9, "+"); put(17, 9, "+"); put(18, 9, "+"); lay(13, 9, 16, 9, "a"); lay(19, 9, 22, 9, "a");
          put(17, 3, "c"); [[14, 3], [21, 3], [14, 7], [21, 7]].forEach(([x, y]) => put(x, y, "p")); [[25, 4], [29, 6], [8, 5], [4, 3]].forEach(([x, y]) => put(x, y, "r")); [[27, 2], [6, 7]].forEach(([x, y]) => put(x, y, "m")); put(33, 2, "x");
        },
        decor(g, cx, cy, d) {
          warship(g, d.X(25), d.Y(18), d.fr);
          plaque(g, "CANCELLO", d.X(17) + 8, d.Y(17) - 2);
          if (S() < 8) { g.strokeStyle = "#5a5a62"; g.lineWidth = 2; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { g.beginPath(); g.moveTo(d.X(17) + 8, d.Y(3) + 2); g.lineTo(d.X(17) + 8 + a * 46, d.Y(3) + 2 + b * 26); g.stroke(); }); }
        },
      },
    };

    // ---------------------------------------------------------------- dialoghi
    const talk = {
      cr_vela() {
        const s = S();
        if (s === 0) return say([
          ["cr_vela", "Benvenuti sul ponte. Regole di bordo: uno, non si tocca il timone senza permesso. Due, il permesso ve lo do io. Tre: ve lo do adesso, perché devo dormire."],
          ["cr_vela", "Il timone è qui accanto. Lo prendi e voli: vedi le isole dall'alto, giri, acceleri, e quando sei sopra un posto premi «Atterra». Facile. Io ci ho messo due anni e tre alberi maestri."],
          ["cr_vela", "Il prossimo Cristallo è nella Città Sospesa, a nord-est. Poi c'è la Forgia di Kael, a sud-est, ma lì non ci si va senza un piano. O almeno senza un piano cattivo."],
          ["cr_bram", "(da lontano) Ho sentito «alberi maestri»! Ne ho riparato uno stanotte! Non toccate niente!"],
        ], () => { setStep(N, 1); done(); });
        if (s >= 8) return say([["cr_vela", "Si va alla capitale. Non ho mai voluto atterrarci. Adesso ci atterro di muso, se serve."]]);
        return say([["cr_vela", pick2(["Il timone è lì. Vai, Guerriero: la Rondine ti ascolta più di quanto ascolti me.", "Sai cos'è un funambolo? Uno che cammina dove gli altri cadono. In campo uguale: io gioco sulla linea laterale.", "Kael mi insegue da due anni perché trasportavo luce per i borghi poveri. Rubata? Restituita. Dipende da come la guardi."])]]);
      },
      cr_bram() {
        const s = S();
        if (S() >= 8) return say([["cr_bram", "Se tocca a quella ragazza anche solo un capello, il re impara cosa fa un martello. Su una corona. Ripetutamente."]]);
        return say([["cr_bram", pick2(["Questo pallone d'aria l'ho rattoppato con la tela della mia tenda. Adesso dormo sotto le stelle. Le stelle russano meno di Vela.", "Hmpf. Volare. Gli uomini non sono fatti per volare. Le incudini nemmeno. Eppure eccoci.", "Se il motore fa un rumore tipo «tonc», va bene. Se fa «tinc», scappate."])]]);
      },
      cr_aira() {
        const s = S();
        if (s <= 1) return trilloScene();
        if (s === 2 || s === 3) return say([["cr_aira", "Questa città è bellissima. Mi sembra di esserci già stata. Come quando sogni un posto e poi lo trovi davvero."]]);
        if (s === 4) return say([["cr_aira", "Il Cristallo del Vento si è acceso quando abbiamo giocato. Non quando abbiamo vinto: quando abbiamo giocato. Hai notato?"]]);
        if (s === 5) return say([["cr_aira", "La Forgia. Ho paura, {n}. Non di Kael. Di quello che sentirò quando vedrò il Cristallo del Fuoco."]]);
        if (s >= 6) return say([["cr_aira", "Le mani mi bruciano. Il Cristallo del Fuoco è oltre la lava. Ed è prigioniero: lo sento piangere."]]);
      },
      cr_trillo() { return say([["cr_trillo", pick2(["Trillo è il mozzo! Il mozzo pulisce il ponte. Trillo pulisce il ponte con le ali. Le ali poi sono sporche, frrr.", "Frrr! Trillo ha visto una nuvola a forma di pallone. Poi a forma di Bram. Poi di nuovo pallone.", "Il cristallo azzurro di bordo l'ha portato Trillo! Nella cassa! Insieme a Trillo!"])]]); },
      cr_zefira() {
        const s = S();
        if (s === 2) return say([
          ["cr_zefira", "Il Guerriero della Luce. E con te… oh. Con te c'è lei. (Guarda Aira a lungo, poi abbassa gli occhi, come davanti a un altare.) Benvenuti."],
          ["cr_zefira", "Il Cristallo del Vento si spegne. Per riaccenderlo serve una partita vera: il Torneo dei Venti. Contro gli Aquiloni di Gallo Libeccio, all'arena qui a destra."],
          ["cr_zefira", "Non serve vincere. Serve giocare bene, con gioia. Il vento lo sente. Ma se vincete, Libeccio diventa simpatico, e questo è un miracolo che voglio vedere."],
        ], () => { setStep(N, 3); done(); });
        if (s === 3) return say([["cr_zefira", "L'arena è a destra. L'araldo Fanfaro vi aspetta. Lo sentirete prima di vederlo."]]);
        if (s === 4) return windCrystal();
        if (s >= 5) return say([["cr_zefira", "Il Cristallo del Fuoco è prigioniero alla Forgia di Ferrogrigio. E la ragazza… proteggila, Guerriero. Più di quanto proteggeresti un Cristallo."]]);
        return say([["cr_zefira", "Il vento ti saluta."]]);
      },
      cr_fanfaro() {
        const s = S();
        if (s < 3) return say([["cr_fanfaro", "SIGNORE E SIGNORI! …Ah, scusa, credevo fossi il pubblico. Il Torneo dei Venti comincia quando la sacerdotessa dice. Su al tempio!"]]);
        if (s === 3) return ask("cr_fanfaro", "SIGNORE E SIGNORI! IL TORNEO DEI VENTI! Da una parte gli Aquiloni di Gallo Libeccio, imbattuti da sette anni! Dall'altra… come vi chiamate?\n(Bram: «Rondine Grigia FC». Vela: «Mi piace». Aira: «Mi piace tantissimo».)\nDALL'ALTRA LA RONDINE GRIGIA FC!", [
          { label: "⚽ Gioca il Torneo dei Venti", sub: "Partita a scelta · contro gli Aquiloni", cls: "hot", fn: torneo },
          { label: "Non ancora", fn: done },
        ]);
        return say([["cr_fanfaro", pick2(["CHE PARTITA! Ne parlerò per anni! A tutti! Anche a chi non vuole!", "Sapete che i miei antenati annunciavano le partite del re? Ma il re non viene a vedere una partita da… da quanto? Strano, eh. UN RE CHE NON GUARDA IL CALCIO!"])]]);
      },
      cr_libeccio() {
        const s = S();
        if (s <= 3) return say([["cr_libeccio", "Voi siete gli sfidanti? Un fabbro, una pilota, una ragazza che brilla e uno col numero {num}. Carino. Vi faremo volare. Qui è un modo di dire e anche una minaccia."]]);
        return say([["cr_libeccio", F.is("c2_torneo_win") ? "Va bene, va bene. Siete forti. Lo dico una volta sola e poi lo nego: siete forti. Se andate alla Forgia, colpite basso: i soldati di ferro non sanno chinarsi." : "Bella partita, eh? Non piangete. Cioè, piangete pure: il vento asciuga tutto in fretta, qui."]]);
      },
      cr_maestrale() {
        if (!F.is("c2_maestrale")) { F.set("c2_maestrale", true); return say([
          ["cr_maestrale", "Siediti, ragazzo. Ho parato rigori per cinquant'anni. Vuoi sapere il segreto? Guardare i piedi, mai gli occhi. Gli occhi mentono. I piedi hanno paura."],
          ["cr_maestrale", "E un'altra cosa, già che ci sei: trent'anni fa il re è venuto qui. L'ultima volta. Ha guardato il Cristallo del Vento come si guarda una torta. Da quell'anno la Decima di Luce è cresciuta, e la città ha cominciato a tremare."],
        ]); }
        return say([["cr_maestrale", pick2(["Guarda i piedi, ragazzo. Sempre i piedi.", "I piccioni li paro ancora. Il re no: quello non l'ho mai visto arrivare."])]]);
      },
      cr_lumio() { return lumioScene(); },
      cr_brunoferro() {
        if (F.is("c2_in")) return say([["cr_brunoferro", F.is("c2_palleggi") ? "Centoquattro palleggi. Me li sogno stanotte. Passate, passate." : "Passate. E non ditelo al Generale che vi ho fatti passare. Anzi, ditelo: tanto lo sa già."]]);
        return gate();
      },
      cr_pim() {
        if (S() >= 6 && !F.is("c2_in")) return say([["cr_pim", "Ehi! Ve lo ricordate Pim? Io sì! Sono tornato a casa, e poi la casa mi ha rimandato qui. Il sergente è un mio parente: zio Brunoferro. Lasciate fare a me."]], () => { passGate("c2_pim_aiuta"); bond("ferro", 1); say([["cr_pim", "Zio! Questi sono amici miei. Mi hanno lasciato andare quando potevano non farlo."], ["cr_brunoferro", "…Pim. Hai ancora quell'elmo troppo grande. Va bene. Passate. Ma io non vi ho visti. Io non vedo mai niente, è il mio talento."]]); });
        return say([["cr_pim", "Il Generale è nella sala del Fuoco. È strano, da quando siete arrivati: ha lucidato tre volte lo stesso bottone."]]);
      },
      cr_kael() {
        const s = S();
        if (s === 7) return kaelScene();
        return say([["cr_kael", "…"]]);
      },
    };
    function pick2(a) { return a[Math.floor(Math.random() * a.length)]; }
    function passGate(flag) { F.set("c2_in", true); if (flag) F.set(flag, true); if (S() === 6) setStep(N, 7); X.refreshZone(); }
    function trilloScene() {
      if (F.is("c2_trillo")) return say([["cr_aira", "Volare… mi sembra di ricordare cosa vuol dire. Come una parola che ti scappa."]]);
      return ask("cr_aira", "Ssst. {n}, vieni qui. Quella cassa laggiù. Ha appena fatto «frrr».\n(Si apre il coperchio. Esce una palla di lana bianca con due alucce e una mela in bocca.)", [
        { label: "«Trillo! Benvenuto a bordo!»", sub: "Il mozzo più piccolo del regno", cls: "hot", fn: () => { F.set("c2_trillo", true); X.refreshZone(); say([["cr_trillo", "Frrr! Trillo è un clandestino! Ma un clandestino utile: ha portato il cristallo azzurro. Così potete salvare e cambiare mestiere anche in volo!"], ["cr_vela", "Un mufflo clandestino. Lo voglio nel contratto. Paga: mele."]]); } },
        { label: "«Trillo, il borgo ha bisogno di te…»", sub: "Prova a convincerlo a tornare", fn: () => { F.set("c2_trillo", true); X.refreshZone(); say([["cr_trillo", "Il borgo ha Nonna Ortensia. Nonna Ortensia vale dieci Trillo. Voi invece avete solo un Trillo. Quindi resto! Frrr! (Logica inattaccabile.)"]]); } },
      ]);
    }
    function torneo() {
      X.playMatch({
        id: "cr_torneo", alt: "hd,cage,az", force: false, mate: "Aira", squad: ["Bram", "Capitana Vela Ruggine"], us: "Rondine Grigia FC", homeKit: ["#3f5fbf", "#c9a227"], azPitch: "cielo", cageField: 1,
        chap: "Cristalli del Campo · Torneo dei Venti", bg: "cr_citta", intro: "Torneo dei Venti nell'arena della Città Sospesa: la Rondine Grigia FC di {n} contro gli Aquiloni di Gallo Libeccio. Il vento soffia da ovest.",
        oppNames: ["Nonno Maestrale", "Brezza", "Tramontana", "Scirocco", "Gallo Libeccio"],
        venue: { ads: [["TORNEO DEI VENTI", "#3f6a9a"], ["AERIA", "#ffffff"], ["GLI AQUILONI", "#e05a3a"], ["VENTO DA OVEST", "#3f6a9a"]], crowd: ["#ffffff", "#bfe3ff", "#3f6a9a", "#e05a3a", "#ffffff"], ground: ["#68c463", "#5fb85a"], line: "#ffffffcc", grid: "rgba(255,255,255,.06)", tint: "rgba(200,230,255,.12)", glow: "220,240,255" },
        team: (t, s) => ({ name: "Aquiloni", vs: "gli Aquiloni", color: "#ffffff", atk: t(s.tiro * 0.92), def: t(s.drib * 0.9), vel: t(s.tiro * 0.98), names: ["Nonno Maestrale", "Brezza", "Tramontana", "Scirocco", "Gallo Libeccio"] }),
        done: (r) => {
          if (r.win) F.set("c2_torneo_win", true);
          const msg = r.win ? X.reward("cr_c2_torneo", { coins: 35 }) : [];
          setStep(N, 4); X.SFX.crystal();
          say([["voce", `Torneo dei Venti: ${r.a} a ${r.b}. ${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}`],
            ["cr_fanfaro", r.win ? "INCREDIBILE! GLI AQUILONI BATTUTI DOPO SETTE ANNI! IL VENTO HA CAMBIATO DIREZIONE! CIOÈ NO, SOFFIA SEMPRE DA OVEST, MA SPIRITUALMENTE!" : "GLI AQUILONI VINCONO ANCORA! Ma che partita, signori! Il vento ha applaudito! L'avete sentito? QUELLO ERA IL VENTO!"],
            ["voce", "Dal tempio, in alto, si accende una luce azzurra. Il Cristallo del Vento si è svegliato: non per la vittoria. Per la partita."],
            ["cr_aira", "Madre Zefira ci chiama. Andiamo al tempio."]]);
        },
      });
    }
    function windCrystal() {
      X.api.play(X.lines([
        ["cr_zefira", "Guarda. Il Cristallo del Vento è tornato a respirare. L'avete svegliato voi, giocando."],
        ["voce", "Tocchi il Cristallo. Il vento ti attraversa, ti solleva di un palmo da terra e ti rimette giù. Una voce leggera: «Cammina dove gli altri cadono. Il Funambolo ruba il tempo al nemico»."],
        ["voce", "<b>Hai imparato un nuovo mestiere: Funambolo.</b> (Finta Lunare: toglie il tempo a chi ha palla e gliela ruba.)"],
        ["cr_zefira", "Il Cristallo del Fuoco è prigioniero alla Forgia di Ferrogrigio, a sud-est. E ora… ora c'è qualcuno che non avrei voluto vedere."],
        ["cr_lumio", "Madre Zefira! Che piacere. Ser Lumio, araldo di Sua Maestà Re Aldeberto. Il re ha saputo del risveglio del Cristallo. Il re è felicissimo. Il re ordina che la luce del Vento sia inviata subito alla capitale. Per proteggerla, naturalmente."],
      ], "cr_citta"), () => { unlockJob("funambolo"); X.SFX.job(); lumioScene(); });
    }
    function lumioScene() {
      if (F.is("c2_lumio")) return say([["cr_lumio", "Il re vi ringrazia. Sempre."]]);
      ask("cr_lumio", "Allora, Guerriero della Luce? Il sigillo del re è qui. Una firma, e la luce parte con la mia nave stasera. Sua Maestà non dimentica chi lo aiuta.", [
        { label: "Firma: il re sa quel che fa", sub: "La luce del Vento va alla capitale", fn: () => { bond("corona", 2); F.set("c2_lumio", "firma"); F.set("c2_vento_al_re", true); after("Grazie. Sua Maestà sarà… soddisfatto. (Lumio sorride. Dietro di lui, il Cristallo del Vento trema appena.)", "Hai firmato. Spero che tu abbia ragione, {n}."); } },
        { label: "«No. La luce resta al Cristallo.»", sub: "Rifiuti", cls: "hot", fn: () => { bond("luce", 1); F.set("c2_lumio", "rifiuto"); after("Rifiuti un ordine del re. Interessante. Sua Maestà ama le persone interessanti. Le colleziona.", "Grazie. Il Cristallo ti ha sentito."); } },
        { label: "«Prima voglio vedere il registro della Decima.»", sub: "Indaga", fn: () => { bond("luce", 1); bond("trust", 1); F.set("c2_lumio", "registro"); learnLore("l_decima"); after("(Lumio smette di sorridere per mezzo secondo. Poi ricomincia.) Il registro è un documento noioso. Ma prego. Sua Maestà non ha niente da nascondere. Nulla.", "Un decimo, poi un terzo, poi metà. Dove va tutta quella luce, {n}?"); } },
      ], "cr_citta");
      function after(lum, aira) { setStep(N, 5); X.refreshZone(); say([["cr_lumio", lum], ["voce", "Ser Lumio se ne va con un inchino perfetto. Prima di uscire guarda Aira. Non come si guarda una ragazza. Come si guarda una cosa che si stava cercando."], ["cr_aira", aira], ["cr_zefira", "Andate alla Forgia. E tenete gli occhi aperti: la luce, in questo regno, va in troppe direzioni."]]); }
    }
    function gate() {
      if (F.is("c1_pim_talk")) return say([["cr_brunoferro", "Alt. Non si passa. Nessuno. Nemmeno i palloni. Soprattutto i palloni."], ["cr_aira", "{n}… quel ragazzo laggiù, con l'elmo troppo grande. Non è Pim?"]]);
      return ask("cr_brunoferro", "Alt. Forgia di Ferrogrigio, area militare. Non si passa. Nessuno. Nemmeno i palloni. Soprattutto i palloni.", [
        { label: "«Siamo ispettori del re.»", sub: "Un bluff col nome di Aldeberto", fn: () => { bond("corona", 1); passGate("c2_bluff"); say([["cr_brunoferro", "Del re? Ah. Allora… allora passate. Gli uomini del re qui entrano sempre. Vengono a contare le casse. Non salutano mai."], ["cr_vela", "(sottovoce) Gli uomini del re entrano nella Forgia del nemico. Sempre. Interessante, no?"]]); } },
        { label: "«Ti sfido a palleggi.»", sub: "Il suo punto debole", cls: "hot", fn: () => { bond("luce", 1); passGate("c2_palleggi"); say([["cr_brunoferro", "Palleggi? A me? …Va bene. Se fai più palleggi di me, passi. Io ne faccio sempre cento. Precisi."], ["voce", "Lui arriva a cento e si ferma, fiero. Tu arrivi a cento, poi a centouno, centodue… Al centoquattro il sergente si toglie l'elmo, commosso."], ["cr_brunoferro", "Passa. È giusto così. Le regole sono regole. E i palleggi sono palleggi."]]); } },
...(F.is("c2_trillo") ? [{ label: "Trillo fa da diversivo", sub: "Un mufflo che vola è una distrazione notevole", fn: () => { passGate("c2_trillo_diversivo"); say([["voce", "Trillo vola davanti al sergente, gli ruba il cappello e scappa verso le casse. «Frrr!»"], ["cr_brunoferro", "Il mio cappello! Torna qui, pecora volante!"], ["voce", "Il cancello resta incustodito. Passate in silenzio. Da lontano, ogni tanto: «frrr!» e «il mio cappello!»"]]); } }] : []),
      ]);
    }
    function kaelScene() {
      X.api.play(X.lines([
        ["cr_kael", "Guerriero della Luce. Ti aspettavo. Ho lucidato tre volte lo stesso bottone, per l'emozione. Pim te l'avrà detto: Pim dice tutto."],
        ["cr_kael", "Vuoi liberare il Cristallo del Fuoco. Prima, leggi questo. (Ti porge un rotolo. Il sigillo è quello del re.)"],
        ["voce", "È un contratto. Il regno di Calcistea vende all'Impero di Ferrogrigio la luce dei Cristalli, «in quantità crescenti». Firmato: Aldeberto. E sotto, a mano, una riga: «Il Cristallo del Campo va trovato a ogni costo»."],
        ["cr_kael", "Il mio popolo vive su navi perché trent'anni fa il nostro Cristallo si è spento. Sai chi prendeva la sua luce? La Decima del re. Adesso il re ce la rivende. Io la compro, perché se non la compro le mie navi cadono in mare."],
        ["cr_kael", "Ma un generale è un generale. Se vuoi il Cristallo, giocatelo. Contro la mia Armata, nel cortile. Alla vecchia maniera: una mossa alla volta, come gli scacchi. Io gioco solo così."],
      ], "cr_forgia"), () => { learnLore("l_contratto", true); armata(); });
    }
    function armata() {
      X.playMatch({
        id: "cr_armata", mate: "Bram", squad: ["Aira", "Capitana Vela Ruggine"], us: "Guerrieri della Luce", homeKit: ["#3f5fbf", "#c9a227"],
        chap: "Cristalli del Campo · Contro l'Armata di Ferrogrigio", bg: "cr_forgia", intro: "Nel cortile di ferro della Forgia, tra la lava e le incudini: {n} e i Guerrieri della Luce contro l'Armata del Generale Kael. Una mossa alla volta.",
        oppNames: ["Sergente Brunoferro", "Caporale Bullone", "Soldato Ingranaggio", "Soldato Lamiera", "Gen. Kael Ferrogrigio"],
        team: (t, s) => ({ name: "Armata di Ferrogrigio", vs: "l'Armata di Ferrogrigio", color: "#4a4a52", atk: t(s.tiro * 0.98), def: t(s.drib * 1.0), vel: t(s.tiro * 0.92), names: ["Sergente Brunoferro", "Caporale Bullone", "Soldato Ingranaggio", "Soldato Lamiera", "Gen. Kael Ferrogrigio"] }),
        done: (r) => {
          if (!r.win) return ask("cr_kael", `${r.a} a ${r.b}. L'Armata ha vinto. Il Cristallo resta qui. A meno che tu non voglia riprovare: io ho tempo. Ne ho sempre.`, [
            { label: "⚽ Rigioca contro l'Armata", sub: "Partita a turni", cls: "hot", fn: armata },
            { label: "Ritirati per ora", sub: "Torna da Kael quando vuoi", fn: done },
          ], "cr_forgia");
          const msg = X.reward("cr_c2_armata", { coins: 45 });
          ask("cr_kael", `${r.a} a ${r.b}. (Kael si toglie un guanto e ti stringe la mano. ${msg.length ? msg.join(" · ") + "." : ""})\nHai vinto. Il Cristallo del Fuoco è tuo. Decidi tu cosa farne. Io ascolto. È la cosa più difficile che abbia mai detto.`, [
            { label: "Libera il Cristallo del Fuoco", sub: "Tutta la luce torna al Cristallo", cls: "hot", fn: () => { bond("luce", 2); F.set("c2_fuoco", "libero"); fire("Allora le mie navi voleranno meno. Qualcuna cadrà. …Ma hai ragione tu. La luce non era nostra. Troverò un altro modo. Promettimi che lo cercherai anche tu."); } },
            { label: "Dividi la luce con Ferrogrigio", sub: "Metà al Cristallo, metà alle navi di Kael", fn: () => { bond("ferro", 2); F.set("c2_fuoco", "diviso"); F.set("kael_alleato", true); fire("Metà. Nessun re mi ha mai offerto metà di qualcosa. Ferrogrigio non lo dimenticherà, Guerriero. Quando andrai dal re, le mie navi saranno con te."); } },
            { label: "Prendi la luce per la Rondine Grigia", sub: "Con quella luce, nessuno vi fermerà", fn: () => { bond("corona", 2); F.set("c2_fuoco", "preso"); fire("Prendi la luce per te. Come il re. (Kael ti guarda a lungo.) Spero che tu sappia la differenza tra te e lui. Io, per ora, non la vedo."); } },
          ], "cr_forgia");
        },
      });
    }
    function fire(kline) {
      setStep(N, 8);
      X.api.play(X.lines([
        ["cr_kael", kline],
        ["voce", "Le catene cadono. Il Cristallo del Fuoco si accende, rosso, caldo come un abbraccio. E Aira fa un passo avanti, senza volerlo, come chiamata."],
        ["voce", "Le sue mani toccano il Cristallo. La luce le entra dentro. I suoi capelli d'argento diventano oro, poi bianchi, poi di tutti i colori di un tramonto."],
        ["cr_aira", "Ricordo. Ricordo tutto. Non sono caduta dal cielo. Sono nata nel cielo, da… da voi. Da tutte le partite giocate per gioia, in ogni prato del regno. Sono il quinto Cristallo. Il Cristallo del Campo."],
        ["cr_aira", "Il re mi teneva in una sala bianca. Per prendere la mia luce: la luce che non finisce mai, perché ogni partita la rinnova. Con quella, lui non invecchia. Sono scappata. Sono caduta. Sono arrivata da te."],
      ], "cr_forgia"), () => {
        learnLore("l_campo");
        const t = X.mem().trust;
        say([[t >= 2 ? "cr_aira" : "voce", t >= 2 ? "Volevo dirtelo per prima a te, {n}. Te l'avevo promesso. In ritardo, come una regista." : "Aira ti guarda. C'è qualcosa che non dice. Forse perché non sei stato tu a chiederglielo nel modo giusto."],
          ["voce", "Poi, dall'alto, un'ombra dorata copre la Forgia. Una nave del re. Scende una scaletta, e sulla scaletta, con i guanti bianchi, Ser Lumio."],
          ["cr_lumio", "Trovata! Sua Maestà ringrazia il Guerriero della Luce per averla accompagnata fin qui. Ce la siamo cercata ovunque. Guardie: il Cristallo del Campo torna a casa."]], capture);
      });
    }
    function capture() {
      ask("cr_aira", "(Le guardie reali la circondano. Aira ti guarda, e non ha paura: ha deciso.)\n{n}…", [
        { label: "Combatti le guardie", sub: "Non la porteranno via", cls: "hot", fn: () => { bond("luce", 1); F.set("c2_cattura", "lotta"); end("Combatti. Bram con il martello, Vela con le corde, tu con il pallone. Ma le guardie sono troppe, e la nave del re si alza con Aira a bordo."); } },
        { label: "«Ti vengo a prendere. Te lo giuro.»", sub: "Lasciala andare, per ora", fn: () => { bond("trust", 2); F.set("c2_cattura", "giuro"); end("Aira sorride. «Lo so.» Si lascia portare via, a testa alta. Sulla scaletta si volta e ti fa un segno: una mano aperta, come un passaggio filtrante. Sai già dove andrà il pallone."); } },
        { label: "Tratta con Lumio", sub: "«Cosa vuole il re in cambio?»", fn: () => { bond("corona", 1); F.set("c2_cattura", "tratta"); end("Ser Lumio sorride. «Sua Maestà vuole solo lei. Ma ammira chi tratta. Venite alla capitale: forse ci sarà un posto anche per voi, accanto al trono.» E porta via Aira."); } },
      ], "cr_forgia");
      function end(line) {
        const ally = F.is("kael_alleato") || X.mem().ferro >= 3;
        X.api.play(X.lines([
          ["voce", line],
          ...(ally ? [["cr_kael", "La capitale. Ci vado anch'io, Guerriero. Con tutte le mie navi. Il re mi ha venduto la luce del mio stesso popolo per trent'anni: è ora che venga a riscuotere il conto."]] : [["cr_kael", "Il re ha quello che voleva. Io torno alle mie navi. Ma se un giorno dovessi andare alla capitale, Guerriero… pensaci bene. Il trono ha un modo tutto suo di cambiare chi ci si avvicina."]]),
          ["cr_vela", "Rotta sulla capitale. Non ci sono mai voluta atterrare. Ci atterrerò di muso."],
          ["cr_bram", "Prendo il martello grande."],
        ], "cr_forgia"), () => {
          finishChapter(N, F.get("c2_fuoco", "ok")); setStep(N, 9);
          const msg = X.reward("cr_c2_fine", { coins: 70, cos: "cr_c2" });
          X.scene([["voce", `<b>Capitolo 2 concluso · Il Cielo di Ferro</b><br>Hai scoperto che Aira è il quinto Cristallo, e che il re vende la luce dei Cristalli. Il re ha preso Aira.${msg.length ? "<br>" + msg.join(" · ") : ""}`]], done, "cr_cielo");
        });
      }
    }

    // ---------------------------------------------------------------- oggetti e uscite
    const obj = {
      "cr_nave:h": () => (S() < 1 ? say([["cr_vela", "Ehi ehi ehi. Il timone. Prima le presentazioni: parla con me."]]) : X.fly("cr_nave")),
      "cr_citta:c": () => (S() === 4 ? windCrystal() : say([["voce", S() >= 5 ? "Il Cristallo del Vento respira piano, azzurro. Ogni tanto ti scompiglia i capelli, come un nonno." : "Il Cristallo del Vento, pallido. Sembra trattenere il fiato. Aspetta una partita."]])),
      "cr_forgia:c": () => (S() >= 8 ? say([["voce", "Il Cristallo del Fuoco arde, libero. Il calore ti scalda le mani come un fuoco di casa."]]) : say([["voce", "Il Cristallo del Fuoco, incatenato a una macchina che ne succhia la luce. Prima devi parlare con Kael."]])),
    };
    // lungo il fiume di lava: si passa solo dal ponte, e la sala del Fuoco si apre dopo il cancello
    const def = {
      n: N, title: "Il Cielo di Ferro", sub: "La Rondine Grigia, la Città Sospesa, la Forgia", start: "cr_nave", goal, zones, talk, obj, introBg: "cr_cielo",
      patch: { cr_borgo: { npcs: (s, list) => list.filter((n) => !["cr_vela", "cr_kael", "cr_bram", "cr_aira"].includes(n.id)) } }, // il gruppo è a bordo
      news: (id, s) => (id === "cr_vela" && s === 0) || (id === "cr_aira" && s <= 1 && !F.is("c2_trillo")) || (id === "cr_zefira" && (s === 2 || s === 4)) || (id === "cr_fanfaro" && s === 3) || (id === "cr_maestrale" && !F.is("c2_maestrale")) || (id === "cr_pim" && s >= 6 && !F.is("c2_in")) || (id === "cr_kael" && s === 7),
      intro: () => [
        ["voce", "La notte dopo, la Rondine Grigia si alza da Borgo Radice. Bram l'ha riparata con quello che aveva: tela da tenda, chiodi, e una pazienza che non sapeva di avere."],
        ["voce", "Nonna Ortensia vi ha salutato dal campo, con il fischietto. Le lanterne del borgo, sotto di voi, brillano come non brillavano da mesi."],
        ["cr_vela", "Prossima fermata: il cielo. Allacciatevi a qualcosa. Bram, non a me."],
      ],
    };
    return def;
  }
  boot();
})();
