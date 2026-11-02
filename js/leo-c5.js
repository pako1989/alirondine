// js/leo-c5.js - «L'ESTATE DEL MURO» · Capitolo 5: La notte prima
// L'ultima notte prima del treno di Dario. Il muro al chiaro di luna, una borsa pronta, papà che non sa cosa dire. Un ultimo tiro insieme (Torna Dritto) e il finale: tre vie.
// Zona: il muro di notte (24x14, due versioni). Finali: Leggenda del Muro, Com'è andata davvero, segreto «Il biglietto sotto la pietra».
(function () {
  "use strict";
  function boot() {
    const E = window.__leoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__leoH || !E.api._has || !E.api._has(4)) return setTimeout(boot, 100);
    E.api.addChapter(chapter5);
  }
  function buildNotte(L, tell) {
    const { lay, put } = L;
    lay(0, 0, 23, 0, "t"); lay(0, 0, 0, 13, "t"); lay(23, 0, 23, 13, "t"); lay(0, 12, 23, 13, "w"); lay(0, 7, 0, 8, ":"); put(0, 7, "q"); put(0, 8, "q");
    lay(20, 1, 20, 11, "M"); lay(1, 7, 19, 8, ":"); put(5, 3, "N"); put(6, 3, "N"); put(18, 2, "l"); put(3, 11, "N"); put(9, 3, "t"); put(2, 2, "t");
    if (tell) { put(15, 2, "O"); put(12, 10, "O"); }
  }
  function chapter5(K) {
    const { setStep, quest, F } = K, H = window.__leoH(K), { say, done, wask } = H, N = 5, S = () => K.stepOf(N);
    H.people();
    K.cos("lm_c5", { kind: "acc", label: "Pietra del porto", val: "pietra", from: "Capitolo 5 di L'Estate del Muro" });
    K.lore("l_treno", { t: "Il treno delle 7:12", d: "Parte dalla stazioncina sopra il porto, due volte al giorno. Quello delle 7:12 porta a Milano. Nel Borgo lo chiamano «il Maestro»: insegna a tutti a salutare." });
    const goal = (s) => ({ 0: "Vai da Dario, al muro: stanotte non dorme neanche lui.", 1: "Papà è arrivato al muro con un canovaccio sulla spalla: parlagli.", 2: "L'ultimo tiro: parla con Dario.", 3: "Puoi guardare meglio il muro (🎞️) o ritirare ancora con Dario. Quando sei pronto, parla con papà." }[s] || "L'Estate del Muro è conclusa.");
    const record = () => { try { return +localStorage.getItem("ali-di-rondine.tornadritto.best") || 0; } catch (e) { return 0; } };
    const ENDS = {
      leggenda: { coins: 400, lines: [["voce", "Leo racconta la notte come la ricorda: la luna grande come una pizza, Dario che calcia e il pallone che torna dritto, ogni volta, fino all'alba. Papà piange di nascosto e dice che è il fumo."], ["voce", "Nel racconto, Dario parte con un sorriso e una promessa. Nei racconti il treno non fa rumore."], ["lm_ottavio", "[ride] Io c'ero e non mi ricordo così. Ma è una bella versione. La tengo."]] },
      vero: { coins: 400, lines: [["voce", "Leo scrive la versione vera: la borsa mezza vuota, il pallone sgonfio di nuovo, papà che non riesce a dire «vai» e ci mette un'ora per dire «scrivi». Dario risponde «ogni domenica». Non scrive ogni domenica. Scrive ogni tanto, ed è più onesto."], ["voce", "Il treno delle 7:12 parte con dieci minuti di ritardo. Tutto il Borgo finge di non guardare."], ["lm_ottavio", "[serio] La verità fa male e dura. La leggenda non fa male e non dura. Tu hai scelto la prima, ragazzo. Bravo."]] },
      biglietto: { coins: 600, lines: [["voce", "Sotto la pietra, dove Dario appoggiava il piede prima di ogni tiro, c'è un biglietto piegato in quattro. Non è del treno. È una pagina strappata da un quaderno: «Per Leo. Il muro è tuo. Tiralo dritto anche quando non c'è nessuno. D.»"], ["voce", "Leo lo legge una volta. Poi lo rimette sotto la pietra, perché certe cose si lasciano dove le ha messe qualcuno."], ["lm_dario", "[felice] Lo sapevo che avresti guardato sotto. Sei l'unico che guarda. Per questo il muro lo lascio a te."]] }
    };
    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 4); F.set("lm_c5_done", true); F.set("lm_fine_" + id, true);
      K.reward("lm_c5" + id, { coins: E2.coins, cos: "lm_c5" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines).concat([
        ["voce", `<b>FINE DI L'ESTATE DEL MURO.</b><br>${H.stato()}`],
        ["voce", "Dal menu, 🎞️ Il Ricordo: puoi tornare nelle zone e guardare l'altra versione. Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «Torna Dritto»."]
      ]), () => K.openMain(), "lm_notte");
    }
    function finale() {
      const cnt = K.recall.count(), tutte = cnt[0] >= cnt[1], rec = F.is("lm_record") || record() >= 5;
      say("voce", H.v("Alba. Dario cammina verso la stazione con la borsa in spalla e il pallone sotto il braccio. Papà lo segue con il canovaccio.", "Alba. Dario cammina verso la stazione con una borsa leggera. Papà lo segue a tre passi, con il canovaccio ancora sulla spalla."));
      if (tutte && rec) { K.say(H.flush(), () => ending("biglietto")); return; }
      wask("Il treno è alla stazione. Leo ha in mano una penna e una pagina bianca: come racconterà questa estate?", [
        { label: "✨ La racconto bella", sub: "La Leggenda del Muro", big: true, w: { leggenda: 2 }, fn: () => ending(K.stat("leggenda") >= K.stat("verita") ? "leggenda" : "vero") },
        { label: "📓 La racconto com'è andata", sub: "Com'è andata davvero", big: true, w: { verita: 2 }, fn: () => ending(K.stat("leggenda") > K.stat("verita") ? "leggenda" : "vero") }
      ]);
    }
    function muro(first) {
      K.minigame(window.__tornadritto.start, { title: "Torna Dritto · l'ultima notte", rounds: 8, need: 5 }, (r) => {
        const rec = r.win && ((r.data && r.data.catches) || 0) >= 5; if (rec) F.set("lm_record", true);
        K.rel.add("lm_dario", 3);
        K.say([r.win ? ["lm_dario", "[felice] Cinque dritti. Ormai tiri meglio di me. Non dirlo a nessuno, ho una reputazione."] : ["lm_dario", "[ride] Storti. Ma lo sai che l'ultimo tiro è sempre storto? Così si torna."], ["voce", first ? "Il pallone resta fermo contro il muro. La luna fa il resto." : "Un altro tiro. Per sicurezza."]], () => { if (first) { setStep(N, 3); quest("lm_c5c", "L'alba", "Quando sei pronto, parla con papà."); } done(); });
      });
    }
    const talk = {
      lm_dario() {
        if (K.rel.scene("lm_dario")) return;
        const s = S();
        if (s === 0) {
          say("voce", H.v("Notte. Il muro è d'argento. Dario ci è appoggiato con una borsa ai piedi e un biglietto del treno in tasca.", "Notte. Il muro è grigio. Dario ci è appoggiato con una borsa ai piedi e un biglietto del treno spiegazzato."));
          say("lm_dario", "[serio] Domani alle 7:12. Non l'ho detto a papà con le parole. L'ho detto lasciando il biglietto sul tavolo. Sono un vigliacco con la grafia chiara.");
          say("hero", "Papà lo sa. Ha il canovaccio sulla spalla da stasera.");
          say("lm_dario", "[pensa] Allora sa. Allora dobbiamo solo trovare il modo di non dirlo. Siamo bravi in questo, in famiglia.");
          setStep(N, 1); quest("lm_c5", "La notte prima", "Papà è arrivato al muro."); return done();
        }
        if (s === 2) {
          say("lm_dario", "Un ultimo tiro. Non per vincere: per ricordarlo. Prendi il pallone, io faccio il muro.");
          return wask("Dario si sposta di lato e ti lascia il posto che era suo.", [
            { label: "✨ «Tiro come fai tu.»", sub: "Giochi a Torna Dritto", big: true, w: { leggenda: 1 }, fn: () => muro(true) },
            { label: "📓 «Tiro come tiro io.»", sub: "Giochi a Torna Dritto", big: true, w: { verita: 1 }, fn: () => muro(true) }
          ]);
        }
        if (s === 3) {
          return wask("Dario rimette il pallone sul punto. «Ancora uno, se vuoi.»", [
            { label: "⚽ Ancora un tiro", sub: "Torna Dritto, di nuovo", big: true, fn: () => muro(false) },
            { label: "◂ No, basta così", sub: "Torna a esplorare", fn: () => done() }
          ]);
        }
        say("lm_dario", "Il muro è tuo adesso."); done();
      },
      lm_papa() {
        if (K.rel.scene("lm_papa")) return;
        const s = S();
        if (s === 1) {
          say("lm_papa", H.v("Leo. Ho portato il fritto. Per il viaggio. Che vale per tutta la tratta, fino a Milano e ritorno.", "Leo. Ho portato un panino. Per il viaggio. Non chiedermi cosa c'è dentro: se ne accorgerà lui."));
          say("lm_papa", "Tuo fratello parte. L'ho visto dal biglietto. Non ho nulla da dire. Ho solo un canovaccio, e una famiglia, e un fuoco da tenere acceso.");
          return wask("Papà ti guarda. Non ti chiede niente. Gli occhi chiedono.", [
            { label: "✨ «Gli dirai che è bravo. Lo sa già, ma lo vuole sentire da te.»", sub: "Lo spingi a dirlo", big: true, w: { leggenda: 1 }, fn: () => { F.set("lm_p_dice", true); say("lm_papa", "[serio] …Glielo dico. Poi mi giro, perché non voglio che mi veda la faccia."); setStep(N, 2); quest("lm_c5b", "L'ultimo tiro", "Parla con Dario."); done(); } },
            { label: "📓 «Gli dirai che ti dispiace. È la parte difficile.»", sub: "Gli chiedi la parte difficile", big: true, w: { verita: 1 }, fn: () => { F.set("lm_p_dice", false); say("lm_papa", "[triste] …Sì. Mi dispiace. E ho paura. E sono orgoglioso. Tutte e tre, nello stesso minuto."); setStep(N, 2); quest("lm_c5b", "L'ultimo tiro", "Parla con Dario."); done(); } }
          ]);
        }
        if (s === 3) {
          say("lm_papa", "È quasi l'alba. Il treno non aspetta nessuno, nemmeno chi cucina bene. Sei pronto?");
          return wask("Papà ti stringe la spalla. Il canovaccio sa di cipolla.", [
            { label: "🚂 Andiamo alla stazione", sub: "Il finale", big: true, cls: "hot", fn: () => finale() },
            { label: "◂ Ancora un momento", sub: "Torna a esplorare", fn: () => done() }
          ]);
        }
        say("lm_papa", s === 0 ? "Vai dal tuo fratello. Io arrivo." : "Eccomi."); done();
      },
      lm_ottavio() { say("lm_ottavio", "Sono di turno alla barca. Il porto di notte è mio. Di giorno è di tutti."); done(); },
      lm_nico() { say("lm_nico", "Io qui non ci sono. Sono andato a dormire. Il Gatto Volante sogna di parare l'alba."); done(); }
    };
    const zones = {
      lm_notte: {
        region: "racconto", name: "Il muro di notte", short: "Muro di notte", sub: "La luna sul porto, un pallone, due fratelli e un padre", bg: "lm_notte", time: "notte", w: 24, h: 14, base: "Q", start: [2, 7], travel: [2, 7],
        areas: [[19, 1, 21, 11, "Il muro del porto"], [0, 0, 23, 13, "Il muro di notte"]],
        act: { N: "Guarda la barca", l: "Guarda il lampione", t: "Guarda l'albero", O: "Guarda l'ombrellone", q: "Torna in paese", w: "Guarda il mare" },
        flavor: { N: "Una barca capovolta. Sotto, la sveglia di Dario: stanotte non serve.", l: "Un lampione che fa ombra a un gatto che fa ombra a un altro gatto.", t: "Un albero che stanotte ascolta e non dice niente.", O: "Un ombrellone chiuso. Ha visto un'estate intera e non ne parlerà." },
        doors: { "0,7": { to: "lm_borgo", at: [24, 17] }, "0,8": { to: "lm_borgo", at: [24, 17] } },
        npcs: (s) => [{ id: "lm_dario", at: [17, 8] }].concat(s >= 1 ? [{ id: "lm_papa", at: [13, 6] }] : []),
        build(L) { buildNotte(L, true); },
        eras: { vero: { label: "Com'è andata davvero", region: "vero", time: "notte", npcs: (s) => [{ id: "lm_dario", at: [17, 8] }].concat(s >= 1 ? [{ id: "lm_papa", at: [13, 6] }] : []), build(L) { buildNotte(L, false); } } },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(), vero = K.recall && K.recall.isTrue(); g.save();
          g.fillStyle = vero ? "rgba(30,41,59,.26)" : "rgba(99,102,241,.22)"; g.fillRect(d.X(0), d.Y(0), 24 * 16, 14 * 16);
          g.fillStyle = vero ? "rgba(226,232,240,.9)" : "rgba(254,243,199,.95)"; g.beginPath(); g.arc(d.X(5), d.Y(1) + 6, vero ? 10 : 18, 0, 7); g.fill();
          if (!vero) { g.fillStyle = "rgba(254,240,138,.8)"; for (let i = 0; i < 10; i++) { g.fillRect(d.X(1 + i * 2) + Math.sin(f / 20 + i) * 3, d.Y(2 + (i * 5) % 7), 2, 2); } }
          g.restore(); H.plaque(g, "IL MURO", d.X(20) + 8, d.Y(1) - 4, "#a5b4fc");
        }
      }
    };
    return {
      n: N, title: "La notte prima", sub: "Un treno alle 7:12, una borsa mezza piena e un ultimo tiro",
      goal, start: "lm_notte", introBg: "lm_notte", zones, talk, obj: {},
      intro: [["voce", "Notte tra l'undici e il dodici settembre. Il Borgo dorme, a parte tre persone e una luna."], ["voce", "Domani alle 7:12 parte il treno per Milano. Stanotte, il muro è l'unico posto dove nessuno deve dire niente."]]
    };
  }
  boot();
})();
