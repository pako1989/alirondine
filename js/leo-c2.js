// js/leo-c2.js - «L'ESTATE DEL MURO» · Capitolo 2: La trattoria piena
// Il torneo costa sei euro a squadra e papà dice che i soldi non crescono sulla sabbia: Leo e Dario fanno i camerieri per una sera. Tre tavoli, tre ordini, una cucina a vista,
// un vassoio che cade e una scelta (coprire Dario o dire la verità). Zone: la Trattoria Moretti (16x11, due versioni: raccontata e vera). La porta della trattoria nel Borgo si apre da qui.
(function () {
  "use strict";
  function boot() {
    const E = window.__leoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__leoH || !E.api._has || !E.api._has(1)) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function buildTrattoria(L, tell) {
    const { lay, put } = L;
    lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
    put(3, 1, "H"); put(4, 1, "H"); put(1, 2, "D"); put(1, 3, "D"); [[7, 0], [10, 0], [13, 0]].forEach(([x, y]) => put(x, y, "W"));
    [[2, 6], [3, 6], [8, 6], [9, 6], [12, 7], [13, 7]].forEach(([x, y]) => put(x, y, "T"));
    put(12, 2, "L"); put(13, 2, "L"); put(14, 8, "l"); put(1, 8, "l"); put(6, 5, "B"); put(11, 4, "B");
    if (tell) { put(5, 8, "l"); put(10, 8, "l"); }
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__leoH(K), { say, done, wask } = H, N = 2, S = () => K.stepOf(N);
    H.people();
    H.cast("lm_turista", "Signora Bertolotti", "Turista di Torino", { style: "bun", hair: "#b9b2c4", shirt: "#7c3aed", skin: "#f0d0b0", acc: ["occhiali"], bg: ["#4c1d95", "#ddd6fe"] }, "Una signora di Torino in vacanza da trentun anni nello stesso posto. Giudica tutto con gentilezza.");
    H.cast("lm_capitano", "Capitan Brunello", "Ex marinaio", { style: "slick", hair: "#e5e7eb", shirt: "#1e3a8a", skin: "#d9a679", beard: "folta", acc: ["cappellino"], cap: "#1e3a8a", bg: ["#0f172a", "#93c5fd"] }, "Un vecchio marinaio che ordina sempre le acciughe e racconta sempre la stessa tempesta, ogni volta più grande.");
    H.cast("lm_famiglia", "Famiglia Cuneo", "In gita", { style: "messy", hair: "#7a4a22", shirt: "#16a34a", skin: "#f1ccaa", bg: ["#14532d", "#bbf7d0"] }, "Padre, madre e un bambino con un pallone sotto il braccio che guarda Leo come si guarda un campione.");
    K.cos("lm_c2", { kind: "acc", label: "Grembiule da cameriere", val: "grembiule", from: "Capitolo 2 di L'Estate del Muro" });
    K.lore("l_trattoria", { t: "La Trattoria Moretti", d: "Dodici tavoli d'estate, quattro d'inverno. Il fritto di acciughe è il piatto che tutti ordinano e nessuno finisce. Il cartello «Non si fa credito» è appeso dal '98 e nessuno l'ha mai rispettato." });
    const goal = (s) => ({ 0: "Parla con Papà in trattoria: oggi si lavora in sala.", 1: "Prendi le ordinazioni dei tre tavoli (turista, capitano, famiglia).", 2: "Torna da Papà ai fornelli: i piatti sono pronti.", 3: "Servi i tre tavoli: Dario cammina dietro di te, con un vassoio e poca fortuna.", 4: "Il capitolo si chiude." }[s] || "Il capitolo 2 è concluso.");
    const orders = () => ["a", "b", "c"].filter((k) => F.is("lm_o_" + k)).length, served = () => ["a", "b", "c"].filter((k) => F.is("lm_s_" + k)).length;
    function fin() {
      setStep(N, 4); F.set("lm_c2_done", true);
      const m = K.reward("lm_c2", { coins: 100, cos: "lm_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["lm_rita", "[pensa] Tuo padre non dorme, in questi giorni. Conta le settimane di agosto come fossero un debito. Non chiedermi perché: non lo sa nemmeno lui."],
        ["lm_dario", "[felice] Hai visto? Duecento coperti. Se mi pagassero a coperto sarei ricco. Invece sono tuo fratello."],
        ["voce", `<b>FINE DEL CAPITOLO 2 · «La trattoria piena»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 3 ti aspetta: un signore in beige in pieno agosto, con un taccuino."]
      ]), () => K.openMain(), "lm_trattoria");
    }
    function spill() {
      say("voce", H.v("Dario attraversa la sala portando tre vassoi sulla testa, due in mano e uno sull'alluce. Il vassoio dell'alluce cede.", "Dario cammina con un vassoio di acciughe e il pensiero altrove. Inciampa sul canovaccio di Rita. Il piatto vola e atterra, con precisione, sul cappello del Capitano."));
      say("lm_capitano", "[arrabbiato] Acciughe in testa! Non succedeva dal '71. Chi è stato?");
      say("lm_papa", "(Dalla cucina, con voce di tuono.) Chi è stato?");
      return wask("Dario ti guarda. Ha le scarpe bucate e gli occhi di chi sa già com'è andata.", [
        { label: "✨ «Sono stato io, il vassoio era mio.»", sub: "Copri Dario: il ricordo resta bello", big: true, w: { leggenda: 1 }, fn: () => { F.set("lm_copri", true); say("lm_dario", "[sorpreso] Piccolo, no, non… va bene. Ti devo un gelato. Anzi due."); say("lm_papa", "Leo. In cucina. Dopo. Hai lavato il pavimento? Lo laverai."); K.rel.add("lm_dario", 2); done(); sv("b"); } },
        { label: "📓 «Dario è inciampato sul canovaccio.»", sub: "Dici la verità: costa a lui, vale a te", big: true, w: { verita: 1 }, fn: () => { F.set("lm_copri", false); say("lm_dario", "[triste] …Ha ragione. Sono inciampato. Pago io il piatto."); say("lm_papa", "Una volta sola paghi tu. La prossima paghiamo tutti, perché la prossima la facciamo insieme."); K.rel.add("lm_papa", 2); done(); sv("b"); } }
      ]);
    }
    function sv(k) { F.set("lm_s_" + k, true); if (served() === 3) { setStep(N, 4); quest("lm_c2c", "Chiudere la sala", "Parla con Papà ai fornelli: la serata è finita."); } }
    const talk = {
      lm_papa() {
        if (K.rel.scene("lm_papa")) return;
        const s = S();
        if (s === 0) {
          say("lm_papa", H.v("Leo! Benvenuto nel più grande locale del mondo! Dodici tavoli, mille clienti, un solo cuoco: io!", "Leo. Dodici tavoli prenotati, sei in sala con tuo fratello e una cucina con due fuochi su quattro. Siamo pronti."));
          say("lm_papa", "L'iscrizione al torneo sono sei euro a squadra. I soldi non crescono sulla sabbia. Servi i tre tavoli e sei dentro. Dario, tu, sorridi.");
          say("lm_dario", "[ride] Io sorrido sempre. È l'unica cosa che faccio bene senza allenarmi.");
          setStep(N, 1); quest("lm_c2", "La trattoria piena", "Prendi le ordinazioni dei tre tavoli."); return H.done();
        }
        if (s === 2) {
          say("lm_papa", "Tre ordini: acciughe fritte, spaghetti alle vongole, un fritto misto che ha sbagliato strada. Vai. E reggi il vassoio come reggi il pallone: con rispetto.");
          K.inv.give("lm_gelato"); setStep(N, 3); quest("lm_c2b", "Servire", "Porta i piatti ai tre tavoli. Dario ti segue, con un vassoio e molta fiducia."); say("voce", "Papà ti infila in tasca un <b>Gelato al limone</b> «per quando la serata va storta»."); return H.done();
        }
        if (s === 4) { return wask("Papà si siede per la prima volta in tutta la sera. «Com'è andata, in sala?»", [
          { label: "✨ «Una serata leggendaria, papà.»", w: { leggenda: 1 }, fn: () => { say("lm_papa", "[ride] Leggendaria. Hai preso da tua madre: lei diceva «un successo» anche con la cucina in fiamme."); fin(); } },
          { label: "📓 «Faticosa. Ma ho capito perché lo fai.»", w: { verita: 1 }, fn: () => { say("lm_papa", "[pensa] …Non sai quanto mi basta. Vai a dormire, campione."); fin(); } } ]); }
        say("lm_papa", s === 1 ? "Prendi le ordinazioni. Blocchetto e sorriso, non il contrario." : "I piatti sono sul passe. Vai, che si raffreddano e Rita mi guarda male."); H.done();
      },
      lm_rita() { if (K.rel.scene("lm_rita")) return; say("lm_rita", H.v("Leo, tesoro, la sala brilla come una reggia. Ma ricordati: il cliente ha sempre ragione, tranne il Capitano.", "Il cliente ha sempre ragione, tranne il Capitano. E Dario. E tuo padre. E io, a volte.")); K.rel.add("lm_rita", 1); H.done(); },
      lm_dario() {
        if (K.rel.scene("lm_dario")) return;
        say("lm_dario", S() < 3 ? "Io porto i piatti, tu prendi gli ordini. Divisione del lavoro. Come in campo: io creo, tu finalizzi." : "Vai avanti, io ti seguo. Uno, due… ho tre vassoi. Se cado, fai finta di niente."); H.done();
      },
      lm_turista() {
        const s = S();
        if (s === 1 && !F.is("lm_o_a")) { say("lm_turista", "Per me un fritto leggero. Non troppo leggero: il fritto che non si sente fritto è un'ipocrisia."); F.set("lm_o_a", true); if (orders() === 3) { setStep(N, 2); quest("lm_c2a", "Ai fornelli", "Torna da Papà con i tre ordini."); say("voce", "Hai tutti e tre gli ordini. Torna da Papà ai fornelli."); } return H.done(); }
        if (s === 3 && !F.is("lm_s_a")) { say("lm_turista", "Splendido. Qui si mangia come a casa, ma senza dover lavare dopo."); sv("a"); return H.done(); }
        say("lm_turista", "Il mare, il fritto e un ragazzo che sorride quando serve. Che altro?"); H.done();
      },
      lm_capitano() {
        const s = S();
        if (s === 1 && !F.is("lm_o_b")) { say("lm_capitano", "Acciughe. Come sempre. E ti racconto la tempesta del '71: l'onda era alta come… come questo ristorante. Anzi, di più. Come il campanile."); F.set("lm_o_b", true); if (orders() === 3) { setStep(N, 2); quest("lm_c2a", "Ai fornelli", "Torna da Papà con i tre ordini."); say("voce", "Hai tutti e tre gli ordini. Torna da Papà ai fornelli."); } return H.done(); }
        if (s === 3 && !F.is("lm_s_b")) return spill();
        say("lm_capitano", "L'onda era alta come il campanile. Quest'estate è salita ancora di un metro."); H.done();
      },
      lm_famiglia() {
        const s = S();
        if (s === 1 && !F.is("lm_o_c")) { say("lm_famiglia", "Spaghetti alle vongole per tre. E per il bambino, un pallone. Se non ce l'avete, un piatto vuoto: lo usa come pallone lo stesso."); F.set("lm_o_c", true); if (orders() === 3) { setStep(N, 2); quest("lm_c2a", "Ai fornelli", "Torna da Papà con i tre ordini."); say("voce", "Hai tutti e tre gli ordini. Torna da Papà ai fornelli."); } return H.done(); }
        if (s === 3 && !F.is("lm_s_c")) { say("voce", "Il bambino ti guarda come si guarda un campione. «Sei Leo? Il Leo del campetto? Mio cugino dice che tiri dritto.»"); say("lm_famiglia", "Grazie, ragazzo. Torneremo l'anno prossimo. Se ancora giochi, ti portiamo un pallone nuovo."); sv("c"); return H.done(); }
        say("lm_famiglia", "Un'estate così non la dimentichiamo."); H.done();
      }
    };
    const zones = {
      lm_trattoria: {
        interior: true, region: "raccontoint", name: "La Trattoria Moretti", short: "Trattoria", sub: "Fritto, canovacci e il ventilatore che fa «tac»", bg: "lm_trattoria", w: 16, h: 11, start: [8, 9], outside: ["lm_borgo", 15, 7], base: "Y",
        act: { H: "Guarda i fornelli", D: "Guarda la credenza", W: "Guarda la finestra", T: "Guarda il tavolo", L: "Guarda la lavagna", B: "Guarda il bancone", l: "Guarda la lanterna" },
        flavor: { H: "I fornelli: quattro fuochi, due funzionanti. Papà dice che il segreto è non farlo sapere alla pentola.", D: "La credenza dei piatti. Due servizi: quello buono e quello per Dario.", W: "La finestra sul porto. Si vede il muro, e se guardi bene, il pallone.", T: "Un tavolo con tovaglia a quadretti, rossa e bianca. Il bianco è quello che resta dopo la prima serata.", L: (K) => (K.recall && K.recall.isTrue() ? "La lavagna del menù: «Fritto di acciughe 9€. Spaghetti vongole 12€. Il resto: chiedere a Papà, che non risponde.»" : "La lavagna del menù: «Fritto di acciughe: gratis, con un sorriso. Spaghetti alle vongole: gratis, con due.»"), B: "Il bancone. Sotto, il cartello «Non si fa credito», appeso dal '98 e ignorato dal '98.", l: "Una lanterna di carta sopra un tavolo. Fa più ombra che luce, ma fa atmosfera." },
        npcs: (s) => [{ id: "lm_papa", at: [4, 3] }, { id: "lm_rita", at: [7, 3] }, { id: "lm_dario", at: [10, 3] }, { id: "lm_turista", at: [2, 5] }, { id: "lm_capitano", at: [8, 5] }, { id: "lm_famiglia", at: [12, 6] }],
        build(L) { buildTrattoria(L, true); },
        eras: {
          vero: {
            label: "Com'è andata davvero", region: "vero",
            npcs: () => [{ id: "lm_papa", at: [4, 3] }, { id: "lm_rita", at: [7, 3] }, { id: "lm_dario", at: [10, 3] }, { id: "lm_turista", at: [2, 5] }, { id: "lm_capitano", at: [8, 5] }, { id: "lm_famiglia", at: [12, 6] }],
            build(L) { buildTrattoria(L, false); }
          }
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(), vero = K.recall && K.recall.isTrue(); g.save();
          if (!vero) { for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(255,220,120,${0.14 + 0.05 * Math.sin(f / 9 + i)})`; g.beginPath(); g.arc(d.X(3 + i * 5) + 8, d.Y(4), 26, 0, 7); g.fill(); } g.fillStyle = "rgba(255,215,0,.8)"; g.fillRect(d.X(7), d.Y(1), 34, 3); [0, 1, 2, 3].forEach((i) => g.fillRect(d.X(7) + 3 + i * 9, d.Y(1) + 3, 1.5, 8)); }
          else { g.strokeStyle = "rgba(60,40,20,.6)"; g.lineWidth = 2; const a = f / 14; g.beginPath(); g.moveTo(d.X(14) + 8, d.Y(5)); g.lineTo(d.X(14) + 8 + Math.cos(a) * 10, d.Y(5) + Math.sin(a) * 10); g.moveTo(d.X(14) + 8, d.Y(5)); g.lineTo(d.X(14) + 8 - Math.cos(a) * 10, d.Y(5) - Math.sin(a) * 10); g.stroke(); }
          g.restore(); H.plaque(g, "TRATTORIA MORETTI", d.X(8), d.Y(0) + 6, "#fdba74");
        }
      }
    };
    return {
      n: N, title: "La trattoria piena", sub: "Sei euro a squadra, due fratelli in grembiule e un vassoio con destino",
      goal, start: "lm_trattoria", introBg: "lm_trattoria", zones, talk, obj: {},
      patch: { lm_borgo: { build(Ls) { Ls.house(12, 2, 8, 5, { door: [15, 6], roof: "#a8523a", wall: "#d8c8a8", enter: { to: "lm_trattoria", at: [8, 9] } }); }, act: { q: "Entra" } } },
      intro: [["voce", "Sera. La Trattoria Moretti è piena. Nel ricordo di Leo ancora di più."], ["voce", "L'iscrizione al torneo sono sei euro a squadra. Papà non regala niente, nemmeno al figlio. Soprattutto al figlio."]]
    };
  }
  boot();
})();
