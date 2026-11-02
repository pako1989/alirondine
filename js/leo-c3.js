// js/leo-c3.js - «L'ESTATE DEL MURO» · Capitolo 3: L'uomo col taccuino
// Un signore in completo beige, in pieno agosto, alla Pensione Bellavista: prende appunti su tutti. Chiede di Dario. All'alba Leo scopre che il fratello si allena di nascosto al muro.
// Zone: la Pensione Bellavista (14x9, due versioni) e il muro all'alba (24x14, due versioni). Il Borgo guadagna la pensione (casa in alto a destra).
(function () {
  "use strict";
  function boot() {
    const E = window.__leoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__leoH || !E.api._has || !E.api._has(2)) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function buildPensione(L, tell) {
    const { lay, put } = L;
    lay(0, 0, 13, 8, "Y"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 8, "a"); lay(13, 0, 13, 8, "a"); lay(0, 8, 13, 8, "a"); put(6, 8, "v");
    put(2, 2, "D"); put(3, 2, "D"); [[6, 0], [9, 0], [3, 0]].forEach(([x, y]) => put(x, y, "W")); put(11, 2, "B"); put(11, 3, "B"); put(9, 5, "T"); put(10, 5, "T"); put(1, 6, "l"); put(12, 6, "l");
    if (tell) { put(4, 5, "l"); put(7, 6, "l"); }
  }
  function buildAlba(L, tell) {
    const { lay, put } = L;
    lay(0, 0, 23, 0, "t"); lay(0, 0, 0, 13, "t"); lay(23, 0, 23, 13, "t"); lay(0, 12, 23, 13, "w"); lay(0, 7, 0, 8, ":"); put(0, 7, "q"); put(0, 8, "q");
    lay(20, 1, 20, 11, "M"); lay(1, 7, 19, 8, ":"); put(5, 3, "N"); put(6, 3, "N"); put(18, 2, "l"); put(3, 11, "N"); put(9, 3, "t"); put(2, 2, "t");
    if (tell) { put(15, 2, "O"); put(12, 10, "O"); }
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__leoH(K), { say, done, wask } = H, N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("lm_c3", { kind: "acc", label: "Taccuino di Quaglia", val: "taccuino", from: "Capitolo 3 di L'Estate del Muro" });
    K.lore("l_quaglia", { t: "Il Prof. Quaglia", d: "Un signore in beige che compare ogni agosto in un posto diverso. Prende appunti su tutti e non dice per chi lavora. Dicono che abbia scoperto più campioni che sbagliato cognomi." });
    const goal = (s) => ({ 0: "Cerca il signore in beige alla Pensione Bellavista (la casa in alto a destra, sulla strada).", 1: "Chiedi a Ottavio, al molo: sa tutto dei Moretti e di chi li guarda.", 2: "Sul muro all'alba: Dario si allena di nascosto. Parla con lui.", 3: "Torna dal Prof. Quaglia: vuole sapere cosa ne pensi di tuo fratello.", 4: "Il capitolo si chiude." }[s] || "Il capitolo 3 è concluso.");
    function fin() {
      setStep(N, 4); F.set("lm_c3_done", true);
      const m = K.reward("lm_c3", { coins: 110, cos: "lm_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["lm_quaglia", "[pensa] Una cosa ancora, Leo. Quando un ragazzo ha un fratello come te, di solito non parte. Oppure parte e ti lascia il muro. Mi segno l'una o l'altra."],
        ["voce", F.is("lm_aiuto") ? "Quella notte metti il pallone nella borsa di Dario, accanto alla scarpa buona. Non glielo dici. Lui capisce." : "Quella notte nascondi le scarpe di Dario. Poi, a mezzanotte, le rimetti dove le hai prese. Non glielo dirai mai."],
        ["voce", `<b>FINE DEL CAPITOLO 3 · «L'uomo col taccuino»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 4 ti aspetta: Ferragosto, la banda, i fuochi e la finale del torneo."]
      ]), () => K.openMain(), "lm_borgo");
    }
    const talk = {
      lm_quaglia() {
        if (K.rel.scene("lm_quaglia")) return;
        const s = S();
        if (s === 0) {
          say("lm_quaglia", H.v("Buongiorno, giovane Leonardo. Quaglia, osservatore delle stelle di domani. Questo completo è tessuto con filo d'oro, ma non lo dica a nessuno.", "Buongiorno. Quaglia. Sono qui per qualche giorno di mare. Il completo è beige perché a Milano non fa caldo."));
          say("lm_quaglia", "Ho visto un ragazzo tirare contro un muro, ieri. Il pallone tornava dritto ogni volta. Conosce, per caso, un certo Dario Moretti?");
          return wask("Il Professore gira una pagina del taccuino. Sulla prima riga, a matita, c'è già un nome.", [
            { label: "✨ «È mio fratello. Ha il tiro più pulito del porto.»", sub: "Il ricordo sarà bello", big: true, w: { leggenda: 1 }, fn: () => { F.set("lm_q_vanto", true); say("lm_quaglia", "[furbo] Più pulito del porto. È un dato molto vago, ma mi piace come lo dice."); next(); } },
            { label: "📓 «Chieda a lui. Io tiro contro il muro.»", sub: "Non dici nulla di più", big: true, w: { verita: 1 }, fn: () => { F.set("lm_q_vanto", false); say("lm_quaglia", "Una risposta onesta e una cattiva abitudine: rispondere a un'altra domanda. Ha futuro."); next(); } }
          ]);
          function next() { say("lm_quaglia", "Gli porti questo biglietto: «Se mai volesse vedere Milano, il 12 settembre». Niente di più. Io i ragazzi non li porto via: li guardo."); say("voce", "Ottieni il <b>biglietto di Quaglia</b>. È un cartoncino beige con un numero di telefono e una data."); setStep(N, 1); quest("lm_c3", "L'uomo col taccuino", "Chiedi a Ottavio, al molo: sa tutto dei Moretti."); done(); }
        }
        if (s === 3) {
          say("lm_quaglia", "Sono stato al muro, stamattina, a distanza decente. Suo fratello tira bene. Ma io non scrivo sul taccuino quello che vedo: scrivo quello che ho capito.");
          return wask("«Mi dica una cosa vera: ha paura di partire, suo fratello?»", [
            { label: "📓 «Sì. Ma ha più paura di lasciare papà.»", sub: "La verità", big: true, w: { verita: 2 }, fn: () => { F.set("lm_q_dice", true); say("lm_quaglia", "[pensa] Più della paura di sbagliare. Lo segno."); fin(); } },
            { label: "✨ «Dario non ha paura di niente. Resta qui, a vincere il torneo.»", sub: "La leggenda", big: true, w: { leggenda: 2 }, fn: () => { F.set("lm_q_dice", false); say("lm_quaglia", "[furbo] Un fratello che mente per un fratello. Anche questo lo segno."); fin(); } }
          ]);
        }
        say("lm_quaglia", s === 1 || s === 2 ? "Il biglietto è nel taschino. Lo consegni quando le sembra il momento: i biglietti hanno un tempismo loro." : "Il Borgo è bello. Ma io, a differenza dei gabbiani, torno sempre a casa."); H.done();
      },
      lm_ottavio() {
        if (K.rel.scene("lm_ottavio")) return;
        const s = S();
        if (s === 1) {
          say("lm_ottavio", "Quaglia. L'ho visto a Cervia, nel '94, quando scoprì uno che poi vinse il campionato. Non sorride mai, ma ti guarda i piedi.");
          say("lm_ottavio", "Tuo fratello, comunque, all'alba va al muro. Da solo. Pensa che nessuno lo veda. Io lo vedo: dormo poco, e il mare russa.");
          say("voce", "Ottavio ti indica la scorciatoia: il muro del porto, sul lato dove sorge il sole.");
          setStep(N, 2); quest("lm_c3b", "All'alba", "Raggiungi il muro all'alba e parla con Dario.");
          return K.say(H.flush(), () => { K.done(); K.go("lm_alba", 2, 7); });
        }
        say("lm_ottavio", s === 2 ? "L'alba è al muro. Vai, prima che il sole si accorga di te." : "Fischio io, che il mare non fischia."); H.done();
      },
      lm_dario() {
        if (K.rel.scene("lm_dario")) return;
        const s = S();
        if (s === 2 && K.inZone("lm_alba")) {
          say("voce", H.v("Alba. Dario si allena contro un drago di nebbia che esce dal mare. Il pallone rimbalza sul muro, torna dritto, e il drago svanisce.", "Alba. Dario si allena da solo: calcia, il pallone torna, calcia ancora. Tra un tiro e l'altro gratta con la scarpa un buco nella sabbia."));
          say("lm_dario", "[sorpreso] Piccolo! Che ci fai qui, a quest'ora? Non dirlo a papà. Per favore. Non è… è un'abitudine.");
          say("hero", "Perché ti alleni di nascosto?");
          say("lm_dario", "[pensa] Perché se mi vedono, devo diventare bravo. E se divento bravo, devo andare dove sono i bravi. E io… non ho ancora capito se voglio.");
          return wask("Dario ti passa la palla. «Tira. Poi dimmi cosa farai di quello che hai visto.»", [
            { label: "✨ «Tiriamo insieme. Poi aiuto io con papà.»", sub: "Lo aiuti (giochi a Torna Dritto)", big: true, w: { leggenda: 1 }, fn: () => { F.set("lm_aiuto", true); say("lm_dario", "[felice] Una squadra. Come ai vecchi tempi, quando eri alto come il bancone."); K.say(H.flush(), () => muro()); } },
            { label: "📓 «Se vai, resto io col muro. Ma non voglio che tu parta di nascosto.»", sub: "Lo metti davanti a una scelta (giochi a Torna Dritto)", big: true, w: { verita: 1 }, fn: () => { F.set("lm_aiuto", false); say("lm_dario", "[triste] …Hai ragione. Non è giusto che lo scopra papà da solo."); K.say(H.flush(), () => muro()); } }
          ]);
        }
        say("lm_dario", s === 2 ? "Ci vediamo all'alba. Se ci sei, tiri." : s === 3 ? "Quaglia? Nome strano per un pesce. Hai la faccia di chi sa qualcosa." : "Io tiro. Tu pensa."); H.done();
        function muro() {
          K.minigame(window.__tornadritto.start, { title: "Torna Dritto · all'alba", rounds: 6, need: 3 }, (r) => {
            F.set("lm_alba_vinta", !!r.win); K.rel.add("lm_dario", 3);
            K.say([r.win ? ["lm_dario", "[felice] Tre dritti su sei. Sembri me, ma più piccolo e con meno scarpe."] : ["lm_dario", "[ride] Tre storti e tre quasi. Ma ti sei divertito. Il muro, la prima volta, non lo perdona a nessuno."], ["voce", "Ti accorgi che sul muro ci sono due macchie rosse. Una è del pallone. L'altra, più piccola, è di una mano."]], () => { setStep(N, 3); quest("lm_c3c", "Il biglietto", "Torna dal Prof. Quaglia alla Pensione Bellavista."); K.go("lm_borgo", 24, 17); done(); });
          });
        }
      },
      lm_papa() { if (K.rel.scene("lm_papa")) return; say("lm_papa", "Leo, la trattoria non si regge da sola. Ma nemmeno tu. Mangia qualcosa."); H.done(); }
    };
    const zones = {
      lm_pensione: {
        interior: true, region: "raccontoint", name: "Pensione Bellavista", short: "Pensione", sub: "Una stella sul cartello, una finestra sul porto e un uomo in beige", bg: "lm_pensione", w: 14, h: 9, start: [6, 7], outside: ["lm_borgo", 32, 7], base: "Y",
        act: { D: "Guarda il banco", W: "Guarda la finestra", B: "Guarda la libreria", T: "Guarda il tavolo", l: "Guarda la lampada" },
        flavor: { D: "Il banco della reception: un campanello, un registro, un posacenere pieno di conchiglie.", W: "La finestra sul mare. Dalla pensione si vede il muro, e un puntino rosso: il pallone, forse.", B: "Una libreria con tre gialli, due guide del Piemonte e una Bibbia sottolineata a matita.", T: "Un tavolo con due tazze di tè e un taccuino chiuso. Non lo apri. Non ti sembra giusto.", l: "Una lampada con il paralume di pizzo, tarlato da un gatto che non esiste." },
        npcs: (s) => [{ id: "lm_quaglia", at: [8, 5] }],
        build(L) { buildPensione(L, true); },
        eras: { vero: { label: "Com'è andata davvero", region: "vero", npcs: () => [{ id: "lm_quaglia", at: [8, 5] }], build(L) { buildPensione(L, false); } } },
        decor(g, cx, cy, d) { const vero = K.recall && K.recall.isTrue(), f = window.__sagaCore.util.frNow(); if (!vero) { g.save(); g.fillStyle = `rgba(255,215,0,${0.18 + 0.05 * Math.sin(f / 10)})`; g.fillRect(d.X(1), d.Y(1), 12 * 16, 16 * 7); g.restore(); } H.plaque(g, vero ? "PENSIONE BELLAVISTA ★" : "PENSIONE BELLAVISTA ★★★★★", d.X(7), d.Y(0) + 6, "#fde68a"); }
      },
      lm_alba: {
        region: "racconto", name: "Il muro all'alba", short: "Muro all'alba", sub: "Il sole dal mare, un pallone, un ragazzo che non sa di essere guardato", bg: "lm_alba", time: "alba", w: 24, h: 14, base: "Q", start: [2, 7], travel: [2, 7],
        areas: [[19, 1, 21, 11, "Il muro del porto"], [0, 0, 23, 13, "Il muro all'alba"]],
        act: { N: "Guarda la barca", l: "Guarda il lampione", t: "Guarda l'albero", O: "Guarda l'ombrellone", q: "Torna in paese", w: "Guarda il mare" },
        flavor: { N: "Una barca capovolta. Sotto, due gatti e un segreto.", l: "Un lampione ancora acceso. Non sa che è mattina.", t: "Un albero che fa ombra solo a chi arriva in ritardo.", O: "Un ombrellone chiuso, ancora in attesa dei turisti." },
        doors: { "0,7": { to: "lm_borgo", at: [24, 17] }, "0,8": { to: "lm_borgo", at: [24, 17] } },
        npcs: () => [{ id: "lm_dario", at: [17, 8] }],
        build(L) { buildAlba(L, true); },
        eras: { vero: { label: "Com'è andata davvero", region: "vero", time: "alba", npcs: () => [{ id: "lm_dario", at: [17, 8] }], build(L) { buildAlba(L, false); } } },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(), vero = K.recall && K.recall.isTrue(); g.save();
          g.fillStyle = vero ? "rgba(253,186,116,.16)" : "rgba(253,164,175,.22)"; g.fillRect(d.X(0), d.Y(0), 24 * 16, 14 * 16);
          const sx = d.X(8) + (f * 0.2 % 6); g.fillStyle = vero ? "rgba(253,224,71,.9)" : "rgba(254,240,138,.95)"; g.beginPath(); g.arc(sx, d.Y(11) + 4, vero ? 14 : 22, 0, 7); g.fill();
          if (!vero) { g.fillStyle = "rgba(240,249,255,.5)"; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(d.X(13) + i * 12 + Math.sin(f / 16 + i) * 3, d.Y(8) - i * 6, 8 + i, 0, 7); g.fill(); } }
          g.restore(); H.plaque(g, "IL MURO", d.X(20) + 8, d.Y(1) - 4, "#fca5a5");
        }
      }
    };
    return {
      n: N, title: "L'uomo col taccuino", sub: "Un completo beige, una pensione con una stella e un fratello che si allena di nascosto",
      goal, start: "lm_borgo", introBg: "lm_borgo", zones, talk, obj: {},
      patch: { lm_borgo: { build(Ls) { Ls.house(31, 3, 4, 4, { door: [32, 6], roof: "#6d7a8a", wall: "#d8d0c0", enter: { to: "lm_pensione", at: [6, 7] } }); }, act: { q: "Entra" } } },
      intro: [["voce", "Qualche giorno dopo. Sulla porta della Pensione Bellavista è comparso un cartello nuovo: «Completo»."], ["voce", "Nel Borgo si dice che un signore in beige, in pieno agosto, sia venuto a vedere qualcuno. Nessuno sa chi."]]
    };
  }
  boot();
})();
