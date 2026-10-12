// js/vento-c3.js - LA VALLE DEL VENTO GENTILE · Capitolo 3 «Col Vento»
// La salita al Colle del Vento, controvento: le FOLATE ti spingono giù e ci si ripara dietro i sassi (lato da cui soffia).
// In cima dorme Mormorio, il Soffio più grande della valle, con al collo la sciarpa del vecchio custode. Il colpo di scena:
// Mormorio è Pietro Lieve, che undici anni fa salì al colle per giocare da solo, per gioia, e tenere viva la promessa.
// Poi la grande partita finale Col Vento sul prato: tutta la valle, i Soffi e Mormorio in porta. Il vento torna mentre si gioca.
// Finali: IL VENTO TORNA · LE TURBINE · IL NUOVO CUSTODE · (segreto) L'ULTIMO SOFFIO.
(function () {
  "use strict";
  function boot() { const V = window.__vento; if (!V || !V.addChapter || !V._has(2)) return setTimeout(boot, 120); V.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, learnLore, finishChapter } = K;
    const N = 3, S = () => K.stepOf(N), TS = 16, st = (k) => K.stat(k);

    K.cast("ve_mormorio", { shape: "nuvola", acc: "", name: "Mormorio", tag: "gray", hair: "#eceef4", style: "buzz", skin: "#eceef4", eye: "#3a3a48", bg: ["#a8b86a", "#eceef4"], shirt: "#c0543a" },
      "Il Soffio più grande della valle: una nuvola bianca alta come una casa, che dorme in cima al Colle del Vento. Al collo porta una sciarpa rossa, vecchia, che sventola anche quando il vento non c'è.");
    K.cos("ve_c3", { kind: "shirt", label: "Maglia Col Vento", val: "#8cc76a", from: "Completa La Valle del Vento Gentile" });
    K.cos("ve_gabbiano", { kind: "shirt", label: "Maglia del Gabbiano", val: "#7ab8d8", from: "Finale «Il vento torna»" });
    K.cos("ve_fascia_custode", { kind: "acc", label: "Fascia del custode del prato", val: "#5a8a4a", from: "Finale «Il nuovo custode»" });
    K.cos("ve_mantello_ottone", { kind: "acc", label: "Mantello d'ottone della Compagnia", val: "#c9a227", from: "Finale «Le turbine»" });
    K.cos("ve_aura_soffio", { kind: "acc", label: "Aura del Soffio", val: "#dfe8ff", from: "Finale segreto «L'ultimo soffio»" });
    K.cos("ve_vetta", { kind: "hairc", label: "Capelli Vetta", val: "#c8d0e0", from: "Trova tutti i Soffi del Colle del Vento" });

    K.lore("l_pietro", { t: "Pietro Lieve, undici anni dopo", d: "Quando a Mulinella si smise di giocare per gioia, Pietro salì al colle con un pallone. Giocò da solo, ogni giorno, perché il vento non si fermasse. Giocò così tanto, e così contento, che un giorno diventò vento anche lui. I Soffi lo chiamano Mormorio." });
    K.lore("l_colle", { t: "Il Colle del Vento", d: "Sul colle il vento non ha mai smesso, nemmeno d'agosto. Sale dalla valle, sbatte contro la cima e torna giù a folate. I pastori dicono: «Sul colle si cammina come si parla col nonno: con pazienza, e stando al riparo quando alza la voce»." });

    const secretOk = () => { const so = K.soffi(); return so.tot > 0 && so.got >= so.tot && st("selva") >= 5 && K.mem().lore.length >= K.loreList().length - 1; };
    const goal = (s) => ({
      0: "Sali al Colle del Vento: dal Prato dei Soffi, la freccia a nord. Selva ti aspetta al prato.",
      1: "Sali controvento. Quando arriva una folata, mettiti al riparo sotto un sasso (dal lato da cui soffia). Mormorio è in cima.",
      2: "Mormorio dorme. Selva dice che i custodi si svegliano con un pallone.",
      3: "Torna al Prato dei Soffi: tutta la valle sta arrivando. Parla con Mormorio, accanto al campo.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");

    // ---------------------------------------------------------------- Mormorio, gigante e addormentato (disegnato sopra le tessere)
    function drawMormorio(g, cx, cy, fr, awake) {
      const x = 14 * TS - cx + 8, y = 4 * TS - cy - 2, br = Math.sin(fr / 40) * 2;
      g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(x, y + 18, 46, 9, 0, 0, 7); g.fill();
      g.fillStyle = "#eceef4"; g.beginPath(); g.ellipse(x, y - 8 - br, 40, 28 + br, 0, 0, 7); g.fill();
      for (let k = 0; k < 12; k++) { g.beginPath(); g.arc(x + Math.cos(k * 0.52 + fr / 90) * 36, y - 8 + Math.sin(k * 0.52 + fr / 90) * 24, 10, 0, 7); g.fill(); }
      g.fillStyle = "#2a2a30"; if (awake) { g.fillRect(x - 16, y - 16, 6, 7); g.fillRect(x + 10, y - 16, 6, 7); g.fillStyle = "#fff"; g.fillRect(x - 15, y - 15, 2, 2); g.fillRect(x + 11, y - 15, 2, 2); } else { g.fillRect(x - 17, y - 13, 8, 2); g.fillRect(x + 9, y - 13, 8, 2); g.font = "bold 9px Georgia, serif"; g.fillStyle = "#6a6a7a"; g.fillText("z", x + 30, y - 34 - (fr / 6 % 10)); g.fillText("Z", x + 38, y - 44 - (fr / 6 % 10)); }
      const fl = Math.sin(fr / 6) * 4; g.fillStyle = "#c0543a"; g.beginPath(); g.moveTo(x - 30, y + 6); g.lineTo(x + 30, y + 6); g.lineTo(x + 32, y + 12); g.lineTo(x - 28, y + 14); g.fill(); g.beginPath(); g.moveTo(x + 26, y + 8); g.lineTo(x + 52, y + 2 + fl); g.lineTo(x + 50, y + 12 + fl); g.lineTo(x + 28, y + 14); g.fill();
    }
    function drawTurbine(g, cx, cy, fr) { // la turbina di prova della Compagnia: ferro, bulloni, e un ronzio
      const x = 22 * TS - cx + 8, y = 9 * TS - cy + 14; g.fillStyle = "#6a6a72"; g.fillRect(x - 3, y - 50, 6, 50); g.fillStyle = "#4a4a52"; g.fillRect(x - 8, y - 4, 16, 6);
      g.save(); g.translate(x, y - 50); g.rotate(fr * 0.01); for (let i = 0; i < 3; i++) { g.rotate(Math.PI * 2 / 3); g.fillStyle = "#a8a8b0"; g.beginPath(); g.moveTo(0, 0); g.lineTo(4, 26); g.lineTo(-2, 26); g.closePath(); g.fill(); } g.restore();
      g.fillStyle = "#c9a227"; g.beginPath(); g.arc(x, y - 50, 3, 0, 7); g.fill();
    }

    [["ve_soffio_rosa", "Un Soffio rosato", "#ffd0d8", "Il Soffio della teiera di Nonna Tisi: piccolo, rosato come un tramonto, con una macchia a forma di mezzaluna sulla pancia. Raffredda il tè soffiando, da trent'anni."], ["ve_soffio_azzurro", "Un Soffio azzurro", "#c8e8ff", "Un Soffio selvatico: grande, azzurro, con le guance sempre gonfie. Gli piace scompigliare i capelli e scappare."], ["ve_soffio_verde", "Un Soffio verdolino", "#d8f8c8", "Un Soffio selvatico che sa d'erba tagliata. Ha una stella sulla pancia e l'aria di chi fa sempre domande."]].forEach(([id, name, skin, bio]) => K.cast(id, { shape: "nuvola", acc: "", name, tag: "", hair: skin, skin, eye: "#2a2a30", bg: ["#8cc764", skin], shirt: skin }, bio));
    K.cos("ve_teiera", { kind: "acc", label: "Sciarpa alla camomilla", val: "sciarpa", from: "Ritrova il Soffio della teiera di Nonna Tisi" });
    const zones = {
      ve_colle: {
        music: "vento_colle",
        region: "colle", name: "Il Vento Gentile · Il Colle del Vento", short: "Il Colle del Vento", sub: "Controvento, fino in cima", bg: "ve_colle", time: (s) => (s >= 3 ? "tramonto" : "giorno"), travel: [14, 35],
        wind: { str: 0.6, turn: false, ang: Math.PI / 2, gusts: true, gustDir: Math.PI / 2, gustEvery: 4.5, gustLen: 2.4, push: 58, gustWhen: (s) => s <= 1 },
        w: 30, h: 38, start: [14, 35], itemCos: "ve_vetta", items: [[3, 30], [26, 22], [4, 12], [25, 6]],
        areas: [[8, 1, 21, 7, "La cima di Mormorio"], [0, 0, 29, 37, "Il Colle del Vento"]],
        act: { r: "Guarda il sasso", t: "Guarda l'albero", n: "Leggi il cartello", v: "Scendi al prato", p: "Guarda la turbina", o: "Calcia il pallone" },
        flavor: { t: "Un pino piegato dal vento, tutto da una parte, come chi saluta da lontano per anni.", n: "Cartello di legno, mezzo cancellato: «CIMA → chi sale, saluti. Chi scende, racconti»." },
        intro: [["voce", "Il Colle del Vento. Erba bassa e dura, sassi grandi come pecore addormentate, e in cima, lontana, una forma bianca."], ["voce", "Qui il vento c'è ancora. Scende dalla cima a folate, come un respiro trattenuto troppo a lungo. Quando arriva, ti spinge giù."]],
        npcs: (s) => [...(s >= 1 && s <= 2 ? [{ id: "ve_selva", at: [11, 7] }] : []), ...(F.is("ve_turbina_prova") && s <= 2 ? [{ id: "ve_dora", at: [23, 11] }] : [])],
        tip: (s) => (s <= 1 ? "Le folate scendono dalla cima: riparati sotto un sasso, dal lato in alto." : ""),
        decor(g, cx, cy, d) { drawMormorio(g, cx, cy, d.fr, S() >= 3); if (F.is("ve_turbina_prova")) drawTurbine(g, cx, cy, d.fr); },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "r"); lay(0, 37, 29, 37, "r"); lay(0, 0, 0, 37, "r"); lay(29, 0, 29, 37, "r"); put(14, 37, "v");
          lay(13, 30, 15, 36, ":"); lay(8, 1, 20, 7, "+");
          // file di sassi con varchi sfalsati: per salire si va a zig-zag, da riparo a riparo
          const rows = [[31, [3, 8, 19, 24]], [27, [6, 11, 16, 22]], [23, [4, 9, 14, 20, 25]], [19, [7, 12, 18, 23]], [15, [5, 10, 15, 21, 26]], [11, [3, 8, 13, 19, 24]]];
          rows.forEach(([y, xs]) => xs.forEach((x) => { put(x, y, "r"); put(x + 1, y, "r"); }));
          [[2, 34], [26, 33], [27, 17], [2, 20], [27, 9], [2, 6]].forEach(([x, y]) => put(x, y, "t"));
          lay(12, 2, 16, 4, "r"); put(10, 6, "o"); put(15, 33, "n");
          if (K.F.is("ve_turbina_prova")) put(22, 9, "p");
          lay(3, 26, 6, 28, ";"); lay(22, 13, 26, 14, ";");
        },
      },
    };

    // ---------------------------------------------------------------- la partita finale: Col Vento, per gioia
    function finale() {
      setStep(N, 4);
      K.ownMatch(window.__ventoPartita.start, { oppStyle: "pressing",
        title: "Col Vento · La partita per gioia", us: "Mulinella e i Soffi", opp: { name: "La Compagnia delle Turbine", kit: "#4a5a6a", names: ["Ing. Ferraglia", "Bulloni"] }, rising: true, great: true, half: 45,
        mate: { name: "Selva", skin: "#f0c8a0", hair: "#b0502a", shirt: "#3a8a7a" }, bg: "ve_prato", extra: false,
        halftime: "Nell'intervallo nessuno guarda il punteggio. Gualdo racconta una barzelletta sui mugnai. Dora, dall'altra parte, ride. Si tappa la bocca, ma ormai l'ha fatto.",
        introExtra: "<p>Mormorio è in porta con voi. All'inizio il vento quasi non c'è: <b>gioca</b>, e torna. Ogni gol lo aiuta. Il risultato, stavolta, conta poco.</p>",
        done: (r) => {
          K.note(r.win ? "Avete vinto la partita per gioia." : "La partita per gioia è finita, e nessuno ha guardato il punteggio.");
          K.scene([
            ["voce", "Al fischio finale nessuno chiede il risultato. Tutti si buttano sull'erba, Soffi e persone, uno sopra l'altro. Ridono. Anche Dora."],
            ["voce", "E allora succede: i campanelli sul gelso tintinnano. L'erba si piega, tutta insieme, verso valle. Sulle colline, le pale del primo mulino tremano… e girano. Poi il secondo. Poi tutti e sette."],
            ["ve_selva", "Il vento… È tornato. Senti? È tornato!"],
          ], endingAsk, "ve_finale");
        },
      });
    }
    function endingAsk() {
      const opts = [
        { label: "«Resto. Il prato ha di nuovo un custode»", sub: "Mulinella diventa casa", big: true, fn: () => ending("custode") },
        { label: "«Riparto. Ma ogni estate tornerò a giocare»", sub: "Il vento torna per tutti", big: true, fn: () => ending("vento") },
      ];
      if (secretOk()) opts.unshift({ label: "Mormorio vuole giocare un'ultima partita…", sub: "Segreto: la piena fiducia di Selva, tutti i Soffi, il Quaderno", cls: "hot", big: true, fn: () => ending("soffio") });
      ask("ve_mormorio", "Undici anni ho giocato da solo, quassù. Adesso la valle gioca di nuovo, e io posso riposare.\n\nCustode: cosa farai, adesso?", opts, "ve_finale");
    }
    function ending(kind) {
      const R = { vento: { coins: 120, cos: ["ve_c3", "ve_gabbiano"] }, custode: { coins: 120, cos: ["ve_c3", "ve_fascia_custode"] }, turbine: { coins: 120, cos: ["ve_c3", "ve_mantello_ottone"] }, soffio: { coins: 200, cos: ["ve_c3", "ve_aura_soffio"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N); setStep(N, 5);
      const lines = {
        vento: [
          ["voce", "Riparti con il treno della sera. Dal finestrino vedi i sette mulini girare, e sopra la valle, piccolo, un aliante bianco che finalmente vola: il Gabbiano, con Selva che ti saluta muovendo le ali."],
          ["voce", "Sul prato, dicono, adesso si gioca tutti i giorni. Senza coppe, senza premi. Chi segna offre. Il vento ha sempre ragione."],
          ["voce", "<b>FINALE · IL VENTO TORNA.</b> Si gioca di nuovo per gioia, e il vento mantiene la sua promessa."],
        ],
        custode: [
          ["ve_gualdo", "Resti? Davvero? …Allora domani il prato va tagliato. E le linee vanno segnate. E la porta di sinistra, che è un'opinione, va aggiustata."],
          ["ve_selva", "Ti costruisco un aquilone con il tuo numero sopra. Così, da lontano, si capisce chi è il custode."],
          ["voce", "Il capanno di Pietro diventa il tuo. La sciarpa rossa resta sul gancio, ma ogni tanto, quando passa il vento, si muove da sola. Come per salutare."],
          ["voce", "<b>FINALE · IL NUOVO CUSTODE.</b> Resti. Il prato ha di nuovo un custode, e tu una casa."],
        ],
        turbine: [
          ["ve_dora", "Un accordo ragionevole. Le turbine conserveranno il vento quando c'è e lo restituiranno quando manca. La valle non avrà più paura."],
          ["voce", "In primavera, sulle colline, accanto ai sette mulini, spuntano sette turbine d'acciaio. Girano sempre, alla stessa velocità, senza un cigolio."],
          ["voce", "Mulinella diventa ricca e silenziosa. Sul prato si gioca ancora, qualche volta, con le coppe e i premi. I Soffi, uno alla volta, smettono di venire. Nessuno se ne accorge, tranne Nonna Tisi."],
          ["voce", "<b>FINALE · LE TURBINE.</b> La valle è al sicuro. Ma il vento, quello vero, è andato altrove a giocare."],
        ],
        soffio: [
          ["ve_mormorio", "Un'ultima partita. Io in porta, tu in attacco. Come quando eri piccolo… no, scusa. Come quando ero piccolo io."],
          ["voce", "Giocate fino al tramonto, voi due e i Soffi. Mormorio para tutto, ride come un temporale lontano, e lascia passare un solo tiro: il tuo, l'ultimo, «{tiro}»."],
          ["voce", "Poi si alza, grande come una casa, e si scioglie piano nell'aria: una folata calda che fa girare tutti i mulini, sale sul colle e non si ferma più. La sciarpa rossa resta sull'erba. Selva la raccoglie e te la mette al collo."],
          ["ve_selva", "Adesso il custode del vento sei tu. Lui lo sapeva dal primo giorno."],
          ["voce", "<b>FINALE SEGRETO · L'ULTIMO SOFFIO.</b> Mormorio gioca un'ultima partita, poi diventa vento."],
        ],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "ve_finale");
    }

    const talk = {
      ve_selva() {
        const s = S();
        if (s === 0) return say([
          ["ve_selva", "Il Gabbiano oggi non vola. Salgo a piedi con te. Il colle è da quella parte: la freccia a nord del prato."],
          ["ve_selva", "Lassù il vento arriva a folate, giù dalla cima. Quando senti che si gonfia, mettiti sotto un sasso, dal lato in alto. Come i pastori. Come le pecore, in effetti."],
        ], () => { setStep(N, 1); done(); });
        if (s === 2) return ask("ve_selva", "Dorme. Russa, anche: senti il ronzio? È come un temporale lontano.\n\nSai come si svegliava Pietro, la mattina? Gualdo dice che gli lanciava un pallone contro la porta del capanno. Pam. E lui usciva già con gli scarpini.", [
          { label: "Calcia il pallone contro la pancia di Mormorio", sub: "Delicatamente. Più o meno", cls: "hot", fn: wake },
          { label: "Aspetta ancora un po'", fn: done },
        ], "ve_colle");
        return say([["ve_selva", s >= 3 ? "Scendiamo. La valle sta arrivando al prato: l'ho visto dall'alto, sembrano formiche con le sciarpe." : "Coraggio. Da sasso a sasso. Io conto le folate: una, due… adesso!"]]);
      },
      ve_dora() {
        if (S() >= 3) return say([["ve_dora", "Ho sentito. Mormorio, la promessa, la gioia. Non so misurarla, la gioia. Ma oggi al prato ci vengo. A guardare. Solo a guardare."]]);
        if (F.is("ve_patto")) return say([["ve_dora", "Il patto è firmato. Se la valle vorrà, le turbine arriveranno in primavera. Se vorrà."]]);
        return ask("ve_dora", "La turbina di prova gira, vede? Poco, perché qui il vento arriva a strappi. Ma gira. Custode, le faccio una proposta seria: firmi con me un patto per tutta la valle. Turbine al posto dei mulini. Mai più paura.", [
          { label: "Firma il patto con la Compagnia", sub: "Le turbine potranno arrivare", fn: () => { F.set("ve_patto", true); bond("turbine", 3); say([["ve_dora", "Grazie. Lo tenga come un'assicurazione: sperando di non doverla mai usare. (Lo dice sorridendo. Sembra quasi sincera.)"]]); } },
          { label: "«Prima sentiamo cosa dice il vento»", fn: () => say([["ve_dora", "Il vento non dice niente, custode. Soffia o non soffia. …Va bene. Sentiamo."]]) },
        ], "ve_colle");
      },
      ve_mormorio() {
        if (S() < 4) return ask("ve_mormorio", "Il prato è pieno. Guarda: Tisi ha portato la zuppa in un pentolone, Gualdo ha messo gli scarpini del 1970, i Soffi rotolano tra le gambe di tutti. Anche quella signora della Compagnia è venuta.\n\nSi gioca, custode? Per gioia?", [
          { label: "Si gioca! Col Vento, tutti insieme", sub: "La partita finale (Mormorio in porta con voi)", cls: "hot", big: true, fn: finale },
          ...(F.is("ve_patto") && st("turbine") >= 4 ? [{ label: "«Lasciamo fare alla Compagnia: le turbine al posto del vento»", sub: "Il patto con Dora", big: true, fn: () => ending("turbine") }] : []),
          { label: "Fai prima un giro del prato", fn: done },
        ], "ve_prato");
        return say([["ve_mormorio", "Il vento è tornato. Lo senti? Gioca anche lui."]]);
      },
      ve_gualdo() { return say([["ve_gualdo", "Gli scarpini del '70. Mi stanno ancora. Un po' stretti sulle dita, ma sono le dita che sono cresciute, non gli scarpini."]]); },
      // missione degli spiriti: riconoscere il Soffio della teiera dall'aspetto (rosato, con la mezzaluna sulla pancia)
      ve_tisi() {
        if (S() >= 3 && !F.is("ve_teiera_cerca") && !F.is("ve_teiera_trovata")) return say([["ve_tisi", "[triste] Oh, caro. Il mio Soffio della teiera è scappato. Quello che soffia sul tè per raffreddarlo, da trent'anni. Si è unito a due Soffi selvatici e adesso girano per il prato."], ["ve_tisi", "[pensa] Lo riconosci così: è rosato come un tramonto, più piccolo degli altri, e ha una macchia a forma di mezzaluna sulla pancia. Gli altri due non sono cattivi, ma sono… selvatici. Non portarmi quelli."]], () => { F.set("ve_teiera_cerca", true); K.quest("ve_teiera", "Il Soffio della teiera", "Rosato come un tramonto, piccolo, con la mezzaluna sulla pancia. Gira per il prato con due Soffi selvatici."); K.refreshZone(); done(); });
        if (F.is("ve_teiera_cerca") && !F.is("ve_teiera_trovata")) return say([["ve_tisi", "Rosato come un tramonto, più piccolo degli altri, con la mezzaluna sulla pancia. Gira per il prato, ai margini."]]);
        return say([["ve_tisi", F.is("ve_teiera_trovata") ? "[felice] Il Soffio della teiera è tornato! Il tè è di nuovo alla temperatura giusta. Tieni, ti ho fatto una sciarpa: profuma di camomilla." : "Zuppa per tutti, dopo la partita. Anche per i Soffi: a loro piace il vapore."]]);
      },
      ve_soffio_rosa() { F.set("ve_teiera_trovata", true); F.set("ve_teiera_cerca", false); K.questDone("ve_teiera"); bond("gioia", 1); const msg = K.reward("ve_teiera", { coins: 50, cos: ["ve_teiera"] }); K.scene([["ve_soffio_rosa", "[felice] Fff… (Piccolo, rosato, con una mezzaluna bianca sulla pancia. Appena ti vede, ti soffia sul naso: è tiepido, sa di tè.)"], ["voce", `È lui: il Soffio della teiera. Ti segue fino da Nonna Tisi, girandoti intorno come un gatto. ${msg.join(" · ")}`]], () => { K.refreshZone(); done(); }, "ve_prato"); },
      ve_soffio_azzurro() { return say([["ve_soffio_azzurro", "[furbo] FFFFF! (Un Soffio azzurro, grande, con le guance gonfie. Ti scompiglia i capelli e scappa ridendo. Niente mezzaluna. Ed è tutt'altro che rosato.)"]]); },
      ve_soffio_verde() { return say([["ve_soffio_verde", "[sorpreso] Fff? (Un Soffio verdolino, che sa d'erba tagliata. Ti guarda con aria interrogativa. Sulla pancia ha una stella, non una mezzaluna.)"]]); },
      ve_ottone() { return say([["ve_ottone", F.is("ve_ottone_promessa") || F.is("ve_giugno_libero") ? "Ho portato un barattolo. Uno solo. Se oggi il vento torna, lo apro. Promesso. Brace è testimone." : "Sono venuto a vedere. Non ho portato barattoli. Quasi nessuno."]]); },
    };
    function wake() {
      setStep(N, 3); K.learnLore("l_pietro"); bond("gioia", 2);
      K.scene([
        ["voce", "Il pallone rotola, rimbalza sulla pancia di nebbia di Mormorio, e torna indietro, piano, ai tuoi piedi. Come si restituisce un pallone ai bambini."],
        ["voce", "Mormorio apre gli occhi. Sono due occhi neri, piccoli, gentilissimi. Ti guarda. Guarda la sciarpa rossa che ha al collo. Poi ride: un rumore di vento tra le foglie."],
        ["ve_mormorio", "Un custode nuovo. Era ora. Mi sono addormentato, eh? Scusate. Ero stanco."],
        ["ve_selva", "…Quella sciarpa. È la sciarpa di Pietro."],
        ["ve_mormorio", "È la mia sciarpa, Selva. Ti ho insegnato io a fare il primo aquilone. Era storto. Volava lo stesso."],
        ["voce", "Selva si porta le mani alla bocca."],
        ["ve_mormorio", "Undici anni fa, a Mulinella, si smise di giocare per gioia: c'erano le coppe, i premi, le scommesse dei forestieri. Il vento stava per mantenere la promessa e andarsene. Allora sono salito quassù con un pallone, e ho giocato da solo. Ogni giorno. Per gioia."],
        ["ve_mormorio", "Ho giocato così tanto, e così contento, che a un certo punto sono diventato vento anch'io. È una cosa che succede, se giochi abbastanza. Poi, tre mesi fa, mi sono addormentato. E nessuno, giù, giocava più così."],
        ["ve_mormorio", "Per riportare il vento non serve un mago, né una turbina. Serve una partita. Tutta la valle sul prato, per gioia. Scendiamo?"],
      ], () => { go("ve_prato", 9, 12); }, "ve_colle");
    }
    const obj = {
      "ve_prato:^": () => { if (S() === 0) setStep(N, 1); go("ve_colle", 14, 35); },
      "ve_colle:v": () => go("ve_prato", 22, 2),
      "ve_colle:o": () => (S() === 2 ? talk.ve_selva() : say([["voce", "Un pallone di cuoio vecchio, cucito a mano. Sul cuoio, a fuoco: «P.L.». Qualcuno ci ha giocato tantissimo, quassù."]])),
      "ve_colle:p": () => say([["voce", "La turbina di prova della Compagnia: un palo d'acciaio, tre pale lucide, un ronzio uniforme. Gira anche quando il vento cala, a batteria. Sulla targhetta: «Proprietà della Compagnia delle Turbine · non toccare»."]]),
      "ve_colle:r": (o) => {
        if (o.tx >= 12 && o.tx <= 16 && o.ty >= 2 && o.ty <= 4) {
          if (S() <= 1) { setStep(N, 2); K.SFX.ding(); return say([["voce", "Eccolo. Mormorio: una nuvola bianca alta come una casa, accoccolata sulla cima. Dorme. Al collo ha una sciarpa rossa, consumata, che sventola da sola."], ["ve_selva", "Ce l'hai fatta! Le folate qui sopra si calmano. Guarda… dorme. E russa."]]); }
          if (S() === 2) return talk.ve_selva();
          return say([["ve_mormorio", "Scendiamo, custode. Il prato aspetta."]]);
        }
        return say([["voce", K.pick(["Un sasso grande e liscio. Dietro, il vento non arriva: ci sono fili d'erba dritti, come in una stanza.", "Un sasso con un buco in mezzo. Quando passa una folata, suona come un flauto stonato.", "Sul sasso qualcuno ha inciso tante tacche, a gruppi di cinque. Sono tantissime. Undici anni di tacche, forse."])]]);
      },
    };
    const patch = {
      ve_prato: {
        npcs: (s, list) => (s >= 3 ? [{ id: "ve_mormorio", at: [9, 10] }, { id: "ve_selva", at: [14, 14] }, { id: "ve_gualdo", at: [16, 8] }, { id: "ve_tisi", at: [26, 15] }, { id: "ve_ottone", at: [27, 8] }, { id: "ve_dora", at: [30, 12] }, { id: "ve_sbuffo", at: [21, 11] }, { id: "ve_soffio", at: [19, 14] }, ...(F.is("ve_teiera_cerca") && !F.is("ve_teiera_trovata") ? [{ id: "ve_soffio_rosa", at: [33, 18], route: [[33, 18], [36, 18], [36, 20], [33, 20]], speed: 0.25, pause: 40 }, { id: "ve_soffio_azzurro", at: [8, 18], route: [[8, 18], [11, 18], [11, 20], [8, 20]], speed: 0.3, pause: 50 }, { id: "ve_soffio_verde", at: [34, 5], route: [[34, 5], [37, 5], [37, 7], [34, 7]], speed: 0.28, pause: 30 }] : [])] : [...list.filter((n) => n.id !== "ve_selva" && n.id !== "ve_gualdo"), ...(s === 0 ? [{ id: "ve_selva", at: [20, 4] }] : [])]),
        build(L) { L.put(22, 0, "^"); L.put(23, 0, "^"); L.lay(22, 1, 23, 5, ":"); },
        act: { "^": "Sali al Colle del Vento" },
      },
    };
    return { n: N, title: "Col Vento", sub: "Il colle, Mormorio, la partita per gioia", goal, start: "ve_prato", introBg: "ve_prato", zones, talk, obj, patch,
      intro: () => [["voce", "Mattina presto, sul Prato dei Soffi. I Soffi sono così sgonfi che sembrano batuffoli di cotone dimenticati sull'erba."], ["voce", "A nord del prato, il Colle del Vento. Dalla cima scende un filo di vento, l'ultimo della valle. Lassù qualcosa respira."]] };
  }
  boot();
})();
