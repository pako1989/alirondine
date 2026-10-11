// js/muro-c1.js - IL MURO · Capitolo 1 «La Prova della Guardia»
// La Città Bassa sotto la pioggia, il Camminamento in cima al muro. La Prova della Guardia: Partita sul Muro, forzata.
// Durante la partita un pallone cade fuori dal muro… e torna indietro. Qualcuno, di là, l'ha rilanciato.
(function () {
  "use strict";
  function boot() { const MU = window.__muro; if (!MU || !MU.addChapter) return setTimeout(boot, 120); MU.addChapter(chapter1); }
  function chapter1(X) {
    const { F, say, ask, done, go, setStep, bond, learnLore, finishChapter } = X;
    const N = 1, S = () => X.stepOf(N);

    X.cast("mu_teo", { name: "Teo Pietralunga", tag: "", hair: "#c9a26a", style: "messy", skin: "#f0d0b0", eye: "#3a6a8a", bg: ["#2a2c34", "#c9a26a"], shirt: "#5a5a62" },
      "Recluta della Guardia del Muro, amico d'infanzia del Campione. Ride forte, corre più forte, e ha una sola ossessione: sapere com'è il cielo fuori dal muro. Dice che deve essere più grande.");
    X.cast("mu_nives", { name: "Nives", tag: "", hair: "#e8e8f0", style: "codino", skin: "#d9a679", eye: "#2a6a5a", bg: ["#1a1c20", "#5a7a6a"], shirt: "#3a3a42" },
      "Una Fuorimura: una di quelli che escono dal muro di nascosto, per cercare cose. Parla poco, cammina senza fare rumore, conosce i Colossi meglio di chiunque. Non si fida di nessuno. Quasi.");
    X.cast("mu_ilse", { name: "Comandante Ilse Morra", tag: "", hair: "#2a2a2a", style: "bun", skin: "#e8c4a0", eye: "#6a8aaa", bg: ["#2a2c34", "#a8322a"], shirt: "#a8322a" },
      "Comandante della Guardia del Muro. Una cicatrice sul sopracciglio, la voce di chi ha già detto addio a troppa gente. Gioca libero: non perde un pallone, e non perde una recluta, se può.");
    X.cast("mu_saverio", { name: "Araldo Saverio", tag: "", hair: "#3a2a2a", style: "slick", skin: "#f2d8c0", eye: "#4a3a2a", glasses: true, bg: ["#3a1a20", "#c9a227"], shirt: "#6a1a24" },
      "Araldo del Consiglio di Cintavecchia. Porta i proclami del Prevosto Grifo, i sorrisi del Prevosto Grifo, e qualche volta anche le minacce del Prevosto Grifo, sempre con la stessa voce gentile.");
    X.cast("mu_ugolino", { name: "Mastro Ugolino", tag: "gray", hair: "#d8d8d8", style: "buzz", skin: "#c68642", eye: "#3a3a2a", bg: ["#3a3028", "#8a8070"], shirt: "#6a5a4a", beard: true },
      "Il vecchio muratore che ripara il muro da cinquant'anni. Conosce ogni pietra per nome. Dice che il muro, di notte, respira. Nessuno gli crede. Lui non insiste.");
    X.cos("mu_c1", { kind: "shirt", label: "Mantello della Guardia", val: "#a8322a", from: "Completa il Capitolo 1 de Il Muro" });
    X.cos("mu_pioggia", { kind: "hairc", label: "Capelli Pioggia", val: "#5a6a8a", from: "Raccogli tutte le piume di corvo nella Città Bassa" });
    X.cos("mu_vento", { kind: "shirt", label: "Maglia del Camminamento", val: "#8a8478", from: "Raccogli tutte le piume di corvo sul Camminamento" });
    X.cos("mu_cappuccio", { kind: "shirt", label: "Cappuccio dei Fuorimura", val: "#3a3a42", from: "Un baule nella Città Bassa" });

    X.lore("l_cinta", { t: "La Cinta di Cintavecchia", d: "Il muro è alto quaranta uomini e largo come una strada. Lo costruirono i Primi Prevosti duecento anni fa, «per salvare la città dai Colossi». Così dice la lapide. La lapide l'ha scritta il Consiglio." });
    X.lore("l_colossi", { t: "Cosa si dice dei Colossi", d: "Che schiacciano chi esce. Che non dormono mai. Che vengono al muro attirati dal rumore. Nessuno, in città, ricorda qualcuno che sia stato schiacciato davvero. Ma tutti conoscono qualcuno che conosce qualcuno." });
    X.lore("l_portone", { t: "Il Grande Portone", d: "Il Portone del muro non si apre da ottant'anni. Le cerniere sono saldate. Mastro Ugolino dice che dall'altra parte, ogni primavera, qualcuno bussa." });
    X.lore("l_pallone", { t: "Il pallone che tornò", d: "Durante la Prova della Guardia un pallone cadde fuori dal muro. Un minuto dopo tornò su, lanciato da una mano di pietra. Delicatamente. Come si rimanda un pallone ai bambini." });

    const goal = (s) => ({
      0: "Parla con Teo, davanti a casa tua (in basso a sinistra).",
      1: "In piazza, l'Araldo del Consiglio ha un messaggio per le reclute.",
      2: "Sali sul muro dalla scala della Torre (a nord-ovest della città). Se vuoi, prima cerca Nives nel vicolo a est.",
      3: "Sul Camminamento: parla con la Comandante Ilse Morra.",
    }[s] || "Capitolo concluso. Il prossimo ti aspetta dal menu.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(15,15,20,.85)"); R(g, x - w / 2, y + 2, w, 1, "#a8322a"); g.fillStyle = "#e8e2d4"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    const zones = {
      mu_bassa: {
        region: "bassa", name: "Il Muro · La Città Bassa", short: "La Città Bassa", sub: "Pioggia, lanterne e il muro sopra tutto", bg: "mu_bassa",
        w: 36, h: 26, start: [7, 24], itemCos: "mu_pioggia", items: [[8, 12], [34, 8], [21, 24], [23, 7]],
        areas: [[26, 3, 33, 6, "Il Grande Portone"], [30, 16, 34, 24, "Il vicolo dei Fuorimura"], [12, 9, 24, 15, "La piazza"], [0, 0, 35, 25, "La Città Bassa"]],
        chests: { "34,23": { coins: 25, cos: "mu_cappuccio", text: "Un cappuccio grigio, cucito con il filo dei Fuorimura. Dentro, un sassolino liscio e un biglietto: «Per chi sa stare zitto»." }, "3,4": { coins: 20, lore: "l_portone", text: "Sotto alcune monete, gli appunti di un muratore." } },
        act: { n: "Leggi il cartello", t: "Guarda l'albero", z: "Guarda le casse", b: "Siediti", l: "Guarda la lanterna", u: "Guarda la bancarella", w: "Guarda il pozzo", c: "Guarda il Grande Portone", q: "Bussa alla porta", k: "Guarda l'argano", "^": "Sali sul muro" },
        flavor: {
          n: ["Proclama del Consiglio: «IL MURO CI PROTEGGE. IL CONSIGLIO PROTEGGE IL MURO. RINGRAZIATE»", "Cartello: «LA LANTERNA STORTA · minestra, birra scura, nessuna domanda»."],
          t: "Un albero spoglio. Qui sotto il sole arriva solo a mezzogiorno, per un'ora, e l'albero ha deciso che non ne vale la pena.",
          z: "Casse di patate del Consiglio. Ogni cassa ha un timbro: «RAZIONE · SETTIMANA 12». Sono quasi vuote.",
          b: "Ti siedi. La pioggia cade dritta, senza vento: il muro ferma anche quello.",
          l: "Una lanterna a olio, appesa a un gancio storto. Brilla di giallo nella pioggia come un pensiero buono.",
          u: "Una bancarella di cose «trovate». Un cucchiaio, una bambola di pezza, una moneta che nessuno riconosce. Il venditore sussurra: «Vengono da fuori»",
          w: "Un pozzo. Se ci guardi dentro vedi il cielo, piccolo e rotondo. È l'unico modo per vedere il cielo senza alzare la testa, quaggiù.",
          c: ["Il Grande Portone. Ferro e legno, alto come tre case, le cerniere saldate. Ci appoggi la mano: è freddo. Dall'altra parte, il silenzio.", "Sul Portone qualcuno ha disegnato col gesso un pallone. Sotto: «Un giorno»"],
          q: "Bussi. Da dentro: «Se è il Consiglio, non c'è nessuno. Se non è il Consiglio, entra pure… ma non c'è nessuno lo stesso»",
          k: "L'argano del Portone: una ruota enorme, ferma da ottant'anni. Le catene sono arrugginite e piene di nidi.",
        },
        intro: [["voce", "Cintavecchia, Città Bassa. Piove. Qui piove quasi sempre, perché il muro trattiene le nuvole come un catino. Sopra di te, a nord, il muro: una parete di pietra così alta che il cielo sembra un nastro."], ["voce", "Oggi è il giorno della Prova della Guardia. Chi la passa sale sul muro e ci vive. Chi non la passa resta quaggiù a guardarlo."]],
        npcs: (s) => [{ id: "mu_teo", at: s === 0 ? [8, 20] : [11, 4] }, { id: "mu_saverio", at: [18, 11] }, { id: "mu_nives", at: [32, 20] }, { id: "mu_ugolino", at: [26, 7] }],
        build(L) {
          const { lay, put, house } = L;
          // il muro a nord, con il Portone e la scala della Torre
          lay(0, 0, 35, 2, "a"); lay(28, 0, 30, 2, "c"); put(10, 2, "^"); lay(0, 3, 0, 25, "a"); lay(35, 3, 35, 25, "a"); lay(0, 25, 35, 25, "a");
          lay(1, 17, 34, 18, ":"); lay(8, 3, 12, 17, ":"); lay(12, 9, 24, 15, ":"); lay(24, 3, 32, 6, ":"); lay(18, 6, 18, 9, ":"); lay(31, 18, 33, 24, ":");
          put(27, 4, "k"); put(31, 4, "k");
          house(2, 19, 6, 4, { door: [5, 22], roof: "#4a3a3a", wall: "#7a6a58", chimney: true });
          house(2, 6, 5, 4, { door: [4, 9], roof: "#3a3030", wall: "#6a5a4a" }); house(2, 11, 5, 4, { door: [5, 14], roof: "#4a3030", wall: "#6a5a4a" });
          house(13, 3, 9, 5, { door: [17, 7], roof: "#5a2a2a", wall: "#8a7a68", rr: 2, chimney: true }); // la Lanterna Storta
          house(25, 9, 7, 5, { door: [27, 13], roof: "#3a3a3a", wall: "#6a5a4a" }); house(10, 19, 6, 5, { door: [13, 23], roof: "#4a3a3a", wall: "#7a6a58" }); house(17, 19, 6, 5, { door: [20, 23], roof: "#3a3030", wall: "#6a5a4a", chimney: true }); house(24, 19, 6, 5, { door: [27, 23], roof: "#4a3030", wall: "#7a6a58" });
          put(18, 12, ":"); put(16, 13, "w"); put(20, 14, "s"); put(14, 10, "u"); put(22, 10, "u"); [[13, 15], [23, 15], [7, 16], [30, 15], [9, 3]].forEach(([x, y]) => put(x, y, "l")); put(12, 16, "b"); put(24, 16, "b"); put(19, 8, "n"); put(7, 18, "n");
          [[33, 16], [3, 16], [33, 10]].forEach(([x, y]) => put(x, y, "t")); [[32, 21], [33, 21], [3, 3]].forEach(([x, y]) => put(x, y, "z")); put(34, 23, "x"); put(3, 4, "x");
        },
        decor(g, cx, cy, d) { plaque(g, "IL GRANDE PORTONE", d.X(29) + 8, d.Y(3) + 2); plaque(g, "SCALA DELLA TORRE", d.X(10) + 8, d.Y(3) + 4); plaque(g, "LA LANTERNA STORTA", d.X(17) + 8, d.Y(3) + 2); },
      },
      mu_muro: {
        region: "muro", name: "Il Muro · Il Camminamento", short: "Il Camminamento", sub: "In cima al muro, nel vento", bg: "mu_muro", stands: ["#a8322a", "#5a5a62", "#e8e2d4"],
        dropOut: (tx, ty) => ty < 6, w: 44, h: 16, start: [4, 9], itemCos: "mu_vento", items: [[2, 7], [41, 9], [26, 10], [10, 7]], pitch: [14, 7, 20, 4],
        areas: [[14, 6, 33, 11, "Il campo sul muro"], [0, 6, 13, 11, "La Torre della Guardia"], [34, 6, 43, 11, "Il bastione est"]],
        act: { f: "Affacciati dal parapetto", e: "Guarda giù", s: "Scaldati al braciere", p: "Guarda la torretta", n: "Leggi il cartello", g: "Guarda la porta", z: "Guarda le casse", l: "Guarda la lanterna", k: "Guarda il corno", v: "Scendi in città" },
        flavor: {
          f: ["Ti affacci a nord: fuori. L'erba alta ondeggia fino all'orizzonte, e in mezzo, lontani, i Colossi: macchie grigie che camminano piano, come nuvole con le gambe.", "Ti affacci a sud: la città. Tetti, fumo, la pioggia che non arriva quassù. Da qui Cintavecchia sembra piccola come un plastico."],
          e: "Giù, lontanissimo. Il vento ti tira la maglia come un cane che vuole giocare.",
          p: "Una torretta di vedetta. Dentro, un cannocchiale puntato sempre fuori. Qualcuno ci ha lasciato un quaderno: «Colosso n. 7 fermo da tre giorni. Sembra che guardi il campo»",
          n: "Cartello: «CAMPO DEL CAMMINAMENTO · Il pallone che cade giù non si va a riprendere. MAI.»",
          g: "Una porta di ferro, con le reti fatte di corde da campana. Il vento ci fischia dentro.",
          z: "Casse di palloni di riserva. Molti. Sul muro i palloni cadono spesso.",
          l: "Una lanterna con il vetro rosso: di notte serve a dire ai Colossi «qui c'è qualcuno». Nessuno sa se funziona.",
          k: "Il corno della Guardia: si suona quando un Colosso tocca il muro. Ha una crepa. L'ultima volta l'hanno suonato troppo forte.",
        },
        intro: [["voce", "Il Camminamento. Sei in cima al muro, e il mondo si apre: a sud la città sotto la pioggia, a nord la Terra di Fuori, verde, infinita, piena di nebbia. Il vento ti entra nei vestiti come se ti conoscesse."], ["mu_teo", "Guarda! Guarda laggiù! Il cielo… è più grande. Te l'avevo detto. Te l'avevo detto!"]],
        npcs: (s) => [{ id: "mu_ilse", at: [8, 8] }, ...(s >= 2 ? [{ id: "mu_teo", at: [10, 9] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 43, 5, "e"); lay(0, 12, 43, 15, "e");
          lay(0, 6, 43, 11, "+"); lay(0, 6, 43, 6, "f"); lay(0, 11, 43, 11, "f");
          lay(14, 7, 33, 10, "-"); put(14, 8, "g"); put(14, 9, "g"); put(33, 8, "g"); put(33, 9, "g");
          put(3, 7, "p"); put(40, 7, "p"); put(6, 10, "s"); put(12, 7, "n"); [[37, 10], [38, 10]].forEach(([x, y]) => put(x, y, "z")); [[13, 10], [35, 7]].forEach(([x, y]) => put(x, y, "l")); put(1, 8, "k"); put(1, 10, "v");
        },
        decor(g, cx, cy, d) {
          plaque(g, "FUORI ↑", d.X(24), d.Y(5) + 6); plaque(g, "↓ LA CITTÀ", d.X(24), d.Y(12) + 10);
          // i Colossi lontani, laggiù nella Terra di Fuori, piccoli per la distanza
          for (let i = 0; i < 4; i++) { const x = ((i * 170 + d.fr * 0.05) % 760) - cx * 0.4 - 40, y = d.Y(4) + 6 + (i % 2) * 10; X.colossus(g, x, y, 0, d.fr, { s: 0.35, ph: i }); }
        },
      },
    };

    const talk = {
      mu_teo() {
        const s = S();
        if (s === 0) return say([
          ["mu_teo", "Eccoti! Hai dormito? Io no. Neanche un minuto. Oggi c'è la Prova della Guardia, {n}! Se la passiamo, saliamo sul muro. Per sempre. Il cielo, capisci? Il cielo intero!"],
          ["mu_teo", "L'Araldo del Consiglio è in piazza, dice che ha un messaggio per le reclute. Andiamo a sentire, poi su dalla scala della Torre. Io ti aspetto lì sotto. Non farmi aspettare: sono già agitato di mio."],
        ], () => { setStep(N, 1); done(); });
        if (s <= 2) return say([["mu_teo", pick2(["La scala è qui dietro. Trecentoquaranta gradini. Li ho contati da piccolo. Poi ho smesso perché avevo paura di arrivare in cima.", "Hai visto Nives? La Fuorimura? Dicono che esca dal muro di notte. Dicono anche che parli con i Colossi. Io dico che è bellissima. Cioè. Coraggiosa. Volevo dire coraggiosa."])]]);
        return say([["mu_teo", "Il vento! Senti il vento?"]]);
      },
      mu_saverio() {
        const s = S();
        if (s === 1) return ask("mu_saverio", "Recluta {n}, giusto? Il Prevosto Grifo ti saluta. Il Consiglio ha a cuore la Guardia del Muro: così tanto, che vorrebbe sapere tutto quello che succede lassù. Proprio tutto. Una parolina ogni tanto, a me. Il Consiglio sa essere generoso.", [
          { label: "«Va bene. Vi terrò informati.»", sub: "Il Consiglio apprezzerà", fn: () => { bond("consiglio", 2); F.set("c1_spia", true); X.reward("mu_c1_saverio", { coins: 20 }); after("Splendido. Lo sapevo che eri sveglio. Ecco un anticipo, per le scarpe: il muro consuma le suole. E la pazienza."); } },
          { label: "«Io giuro alla Guardia, non al Consiglio.»", sub: "Rifiuti", cls: "hot", fn: () => { bond("guardia", 1); F.set("c1_spia", false); after("Peccato. La Guardia è fatta di persone oneste, e le persone oneste durano poco. Te lo dico con affetto."); } },
          { label: "«Cosa teme il Consiglio, lassù?»", sub: "Fai una domanda", fn: () => { bond("fuori", 1); learnLore("l_cinta", true); after("Temere? Il Consiglio non teme niente. Il Consiglio… osserva. Osserva il muro, osserva i Colossi, osserva chi guarda troppo fuori. Sai, alcune reclute cominciano a fare domande sul muro. Brutta abitudine."); } },
        ]);
        if (s >= 2) return say([["mu_saverio", F.is("c1_spia") ? "Ricorda: una parolina, ogni tanto." : "Il Consiglio ti augura buona fortuna. Sinceramente. Quasi."]]);
        return say([["mu_saverio", "Prima saluta il tuo amico, recluta. Il Consiglio aspetta: è la cosa che sa fare meglio."]]);
      },
      mu_nives() {
        if (F.is("c1_nives")) return say([["mu_nives", "Guarda a nord. Quando cade un pallone. Ricordatelo."]]);
        F.set("c1_nives", true); bond("trust", 1); learnLore("l_colossi", true);
        return say([
          ["mu_nives", "(Nives è appoggiata al muro del vicolo, il cappuccio sulla testa. Non ti guarda.) La recluta. Quello che fa la Prova oggi."],
          ["mu_nives", "Ti dico una cosa, e poi te la scordi. Lassù, se un pallone cade fuori, non andate via subito. Guardate chi lo rimanda indietro."],
          ["mu_nives", "E se qualcuno del Consiglio ti chiede di raccontare cosa vedi… pensaci due volte. Il Consiglio ha paura di una cosa sola: che la gente guardi fuori."],
        ]);
      },
      mu_ugolino() {
        if (!F.is("c1_ugolino")) { F.set("c1_ugolino", true); return say([["mu_ugolino", "Ah, una recluta. Guarda qui: questa pietra si chiama Berta, questa Ottavio, questa si chiama Ottavio anche lei perché non mi veniva un altro nome. Il muro è fatto di pietre con un nome. Le hanno messe persone con un nome."], ["mu_ugolino", "Sai cosa ti dico? Di notte il muro respira. E ogni primavera, dall'altra parte del Portone, qualcuno bussa. Tre colpi. Sempre tre. Come un calcio d'inizio."]]); }
        return say([["mu_ugolino", pick2(["Berta oggi è di buon umore. Si vede dal muschio.", "Il Portone non si apre da ottant'anni. Le cerniere le ho viste saldare io, da ragazzo. Piangeva un sacco di gente quel giorno. Chissà perché, se era per salvarla."])]]);
      },
      mu_ilse() {
        const s = S();
        if (s < 3) return ask("mu_ilse", "Recluta {n}. Sono la Comandante Morra. Prima della Prova, una domanda sola, e voglio la verità: perché vuoi entrare nella Guardia del Muro?", [
          { label: "«Per proteggere la città.»", sub: "La risposta giusta. Forse.", cls: "hot", fn: () => { bond("guardia", 1); F.set("c1_perche", "proteggere"); prova("Bene. Molti lo dicono. Pochi lo pensano. Vediamo se tu sei tra i pochi."); } },
          { label: "«Per vedere cosa c'è fuori.»", sub: "La risposta di Teo", fn: () => { bond("fuori", 1); F.set("c1_perche", "fuori"); prova("(Ilse ti guarda a lungo.) Anch'io lo dicevo, alla tua età. Non dirlo al Consiglio. Non dirlo a nessuno."); } },
          { label: "«Per la paga e la razione doppia.»", sub: "Onesto, almeno", fn: () => { bond("consiglio", 1); F.set("c1_perche", "paga"); prova("Onesto. La razione doppia è vera. La paga, quasi. Va bene, recluta: la fame è un motivo serio."); } },
        ]);
        if (s === 3) return prova("Pronta la Prova?");
        return say([["mu_ilse", "Domani all'alba, recluta. La prima ricognizione. Dormi, se riesci."]]);
      },
    };
    function pick2(a) { return a[Math.floor(Math.random() * a.length)]; }
    function after(line) { setStep(N, 2); say([["mu_saverio", line], ["mu_teo", "(sottovoce) Andiamo, {n}. La scala della Torre è a nord-ovest. Il muro ci aspetta."]]); }
    function prova(line) {
      setStep(N, 3);
      ask("mu_ilse", `${line}\nLa Prova si gioca qui, sul campo del Camminamento: tu e Teo contro due veterani. Se un Colosso appoggia la mano sul muro, non scappate: spostatevi. E se il pallone cade giù… non si va a riprenderlo.`, [
        { label: "⚽ Gioca la Prova della Guardia", sub: "Partita sul Muro · tu e Teo contro i Veterani", cls: "hot", fn: match },
        { label: "Un momento", sub: "Riprendi fiato, guardati intorno", fn: done },
      ], "mu_muro");
    }
    function match() {
      X.wallMatch({ title: "La Prova della Guardia", us: "Reclute", mate: "mu_teo", mateShirt: "#5a5a62", bg: "mu_muro", half: 40, wind: true,
        opp: { name: "Veterani della Guardia", kit: "#a8322a", names: ["Gualdo", "Sasso"] }, halftime: "Fine del primo tempo. Teo ha il fiatone e ride. Laggiù, nella nebbia, un Colosso si è fermato. Sembra che guardi il campo.",
        done: (r) => {
          if (!r.win) return ask("mu_ilse", `${r.a} a ${r.b}. Non basta, recluta. Ma hai corso fino all'ultimo. Il muro dà sempre una seconda possibilità: è l'unica cosa gentile che fa.`, [
            { label: "⚽ Rigioca la Prova", cls: "hot", fn: match },
            { label: "Riprova più tardi", sub: "Parla con Ilse quando sei pronto", fn: done },
          ], "mu_muro");
          const msg = X.reward("mu_c1_prova", { coins: 40 });
          X.api.play(X.lines([
            ["voce", `${r.a} a ${r.b}. La Prova è passata. ${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}`],
            ["voce", "Ma prima del fischio finale è successa una cosa. Un tiro di Teo è finito alto, oltre il parapetto, giù nella Terra di Fuori. Tutti si sono fermati. Il pallone che cade non si va a riprendere. Mai."],
            ["voce", "Poi, dalla nebbia, una mano. Una mano di pietra, grande come una casa, che sale piano lungo il muro… e appoggia il pallone sul Camminamento. Delicatamente. Come si rimanda un pallone ai bambini."],
            ["mu_teo", "L'avete… l'avete visto anche voi? Ditemi che l'avete visto."],
            ["mu_ilse", "(a bassa voce, guardando tutti) Nessuno ha visto niente. È chiaro? Niente. Il vento ha riportato su il pallone."],
          ], "mu_muro"), () => {
            learnLore("l_pallone", true);
            ask("mu_ilse", "Recluta {n}. Hai visto niente anche tu, vero?", [
              { label: "«Niente, Comandante.»", sub: "Il segreto resta nella Guardia", cls: "hot", fn: () => { bond("guardia", 2); end("guardia", "Bene. Hai la testa sulle spalle. Il Consiglio non deve sapere nulla, finché non sappiamo noi cosa abbiamo visto."); } },
              { label: "«Il Consiglio deve saperlo.»", sub: "Lo riferirai all'Araldo", fn: () => { bond("consiglio", 2); end("consiglio", "(Ilse stringe la mascella.) Fai quello che devi. Ma ricorda: quando il Consiglio viene a sapere una cosa, quella cosa smette di esistere. Insieme a chi l'ha vista."); } },
              { label: "«Ho visto una mano gentile.»", sub: "Lo racconterai a Nives", fn: () => { bond("fuori", 1); bond("trust", 2); end("fuori", "(Ilse ti guarda come si guarda qualcuno che ha appena detto una cosa pericolosa e vera.) Gentile. Sì. Anch'io ho visto così. Non dirlo a voce alta, recluta. Non ancora."); } },
            ], "mu_muro");
          });
        } });
    }
    function end(path, line) {
      F.set("c1_visto", path); F.set("guardia_mantello", true); X.castHero();
      X.api.play(X.lines([
        ["mu_ilse", line],
        ["mu_ilse", "Benvenuto nella Guardia del Muro, {n}. Questo è il tuo mantello. È rosso perché da lontano i Colossi vedano che siamo noi. Non sappiamo se gli importa. Lo portiamo lo stesso."],
        ...(path === "fuori" ? [["mu_nives", "(Più tardi, nel vicolo, sotto la pioggia.) Una mano gentile. Lo sapevo che lo avresti visto. Domani escono in ricognizione, vero? Bene. Ti insegno a camminare nell'erba alta. I Colossi non ti vedono, se sai come stare."]] : []),
        ["mu_ilse", "Domani all'alba, la tua prima ricognizione. Fuori dal muro. Dormi, se riesci. Io non ci riesco mai, la prima volta. Nemmeno l'ultima."],
      ], "mu_muro"), () => {
        finishChapter(N, path); setStep(N, 4);
        const msg = X.reward("mu_c1_fine", { coins: 60, cos: "mu_c1" });
        X.scene([["voce", `<b>Capitolo 1 concluso · La Prova della Guardia</b><br>Sei nella Guardia del Muro. E hai visto un Colosso restituire un pallone.${msg.length ? "<br>" + msg.join(" · ") : ""}`]], done, "mu_muro");
      });
    }
    const obj = {
      "mu_bassa:^": () => (S() >= 2 ? go("mu_muro", 3, 9) : say([["voce", S() === 0 ? "La scala della Torre. Teo ti aspetta per salire insieme: prima passa da lui, davanti a casa tua." : "Prima senti cosa vuole l'Araldo del Consiglio, in piazza. Teo insiste: «Non si sale sul muro con un messaggio non letto. Porta sfortuna. Me lo sono inventato adesso, ma porta sfortuna»."]])),
      "mu_muro:v": () => go("mu_bassa", 10, 4),
    };
    return {
      n: N, title: "La Prova della Guardia", sub: "La Città Bassa e il Camminamento", start: "mu_bassa", goal, zones, talk, obj, introBg: "mu_bassa",
      news: (id, s) => (id === "mu_teo" && s === 0) || (id === "mu_saverio" && s === 1) || (id === "mu_nives" && !F.is("c1_nives")) || (id === "mu_ilse" && (s === 2 || s === 3)) || (id === "mu_ugolino" && !F.is("c1_ugolino")),
      intro: () => [
        ["voce", "Cintavecchia è l'ultima città. Tutt'intorno, un muro alto quaranta uomini. Fuori dal muro camminano i Colossi: giganti di pietra, lenti, silenziosi, alti come torri."],
        ["voce", "Nessuno esce. Tranne la Guardia del Muro, che vive lassù, in cima, gioca a calcio sul Camminamento e ogni tanto scende fuori, in ricognizione. E i Fuorimura, che escono di nascosto, e di cui nessuno parla."],
        ["voce", "Tu sei {n}, numero {num} della Città Bassa. Oggi fai la Prova per entrare nella Guardia. Il muro ti guarda dall'alto, come ogni mattina. Stamattina, per la prima volta, ti sembra che ti aspetti."],
      ],
    };
  }
  boot();
})();
