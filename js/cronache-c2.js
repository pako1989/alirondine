// js/cronache-c2.js - LE CRONACHE DEL PALLONE DI CRISTALLO · Capitolo 2 «Il Cristallo del Mare»
// Il porto di Sale Antico (Rubi, il ladro gentile, gira per le banchine con le vele della nave «rubate» per salvarle).
// La NAVE: avuta la nave, il mare della mappa del mondo diventa navigabile e il Campione ci va sopra (una barchetta
// sotto i piedi). L'isola del Cristallo del Mare e i Silenti del Re del Silenzio: partita ATB con il gruppo al completo.
(function () {
  "use strict";
  function boot() { const D = window.__cronache; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    const TS = 16;

    K.cast("cc_rubi", { acc: ["bandana"], name: "Rubi, ladro gentile", tag: "", hair: "#1a1a1a", style: "spiky", skin: "#c68642", eye: "#3a2a1a", bg: ["#1a2a4a", "#e8c84a"], shirt: "#3a7a5a" },
      "Il ladro più gentile del regno: ruba solo le cose che qualcun altro sta per rubare, e poi le restituisce, lucidate. È il più veloce di tutti. Dice che correre è come rubare il tempo agli altri, ma in modo onesto.");
    K.cast("cc_capitana", { acc: ["pescatore"], name: "Capitana Marea", tag: "", hair: "#d8d8d8", style: "codino", skin: "#c68642", eye: "#2a4a6a", bg: ["#1a2a4a", "#3a8ac8"], shirt: "#1a3a6a" },
      "Capitana del «Garbino», l'ultima nave del porto di Sale Antico. Ha navigato in tutti i mari del mondo e in nessuno ha trovato il vento che ha perso.");
    K.cast("cc_marinaio", { name: "Mozzo Tito Ancora", tag: "", hair: "#8a5a2a", style: "messy", skin: "#e8b88a", eye: "#3a3a2a", bg: ["#1a2a4a", "#f4ecdc"], shirt: "#f4ecdc" },
      "Il mozzo del Garbino. Pulisce il ponte dieci volte al giorno, anche se la nave non parte da un anno. «Quando tornerà il vento», dice, «voglio che trovi tutto in ordine.»");
    K.cast("cc_muto", { acc: ["maschera"], name: "Il Muto, capitano dei Silenti", tag: "", hair: "#3a3a4a", style: "slick", skin: "#c8c8d0", eye: "#5a5a6a", bg: ["#10102a", "#5a5a6a"], shirt: "#3a3a4a" },
      "Capitano dei Silenti, gli agenti del Re del Silenzio. Non parla mai: comunica con un fischietto senza fischio. I Silenti spengono i cristalli giocando partite senza esultare, senza parlare, senza gioia. Funziona benissimo. Purtroppo.");
    K.cos("cc_c2", { kind: "acc", label: "Bussola del Garbino", val: "#c9a227", from: "Capitolo 2 delle Cronache del Pallone di Cristallo" });
    K.cos("cc_mare", { kind: "hairc", label: "Capelli Cristallo del Mare", val: "#5ab8ff", from: "Trova tutte le schegge del porto e dell'isola" });
    K.lore("l_rubi", { t: "Rubi", d: "Ha rubato le vele del Garbino la notte in cui i Silenti volevano bruciarle. Le ha nascoste nel posto più sicuro del porto: addosso. Da un anno dorme avvolto nelle vele. Dice che sono calde e che sanno di vento." });
    K.lore("l_silenti", { t: "I Silenti", d: "Gli agenti del Re del Silenzio. Giocano partite perfette, senza un grido, senza un abbraccio. I cristalli non si ricaricano con le partite perfette: si ricaricano con la gioia. I Silenti lo sanno. Per questo giocano così." });
    K.lore("l_re", { t: "Il Re del Silenzio", d: "Il Muto, alla fine, scrive su un foglio: «Il nostro re era un portiere. Nessuno ha mai esultato per una sua parata. Neanche lui. Allora ha deciso che nessuno avrebbe più esultato per niente»." });

    const goal = (s) => ({
      0: "Il prossimo cristallo è il Cristallo del Mare. Sulla mappa del mondo, a ovest, c'è il porto di Sale Antico.",
      1: "Al porto, qualcuno ha «rubato» le vele del Garbino. Cerca il ladro: dicono che giri per le banchine.",
      2: "Rubi ti ha dato le vele. Riportale alla Capitana Marea, sul molo.",
      3: "Hai la nave! Sulla mappa del mondo il mare ora è navigabile: raggiungi l'isola del Cristallo del Mare, nel lago a nord-ovest.",
      4: "Il Cristallo del Mare brilla. Il Muto vuole dirti qualcosa.",
    }[s] || "Capitolo concluso. Dal menu prosegui con il Capitolo 3.");
    const lit = () => F.is("cristallo_cc_isola");
    const zones = {
      cc_porto: {
        region: "mare", name: "Le Cronache · Il porto di Sale Antico", short: "Sale Antico", sub: "L'ultima nave e un ladro gentile", bg: "cc_porto", time: "giorno", travel: [17, 2],
        w: 34, h: 20, start: [17, 2], itemCos: "cc_mare", items: [[2, 2], [31, 2], [8, 12]],
        areas: [[0, 13, 33, 19, "Il molo"], [0, 0, 33, 19, "Sale Antico"]], act: { "^": "Torna sulla mappa del mondo", K: "Guarda il Garbino" },
        flavor: { K: "Il Garbino, l'ultima nave del porto: tre alberi, nessuna vela. Sulla prua, una polena a forma di gabbiano con la bocca aperta, come se gridasse un gol." },
        intro: [["voce", "Sale Antico: case bianche col tetto blu, reti stese ad asciugare che non si asciugano mai, perché non c'è vento. Al molo, una nave a tre alberi senza vele."], ["voce", "Un ragazzo con una bandana rossa corre sulle banchine, saltando da una bitta all'altra. Ha l'aria di uno che è appena scappato da qualcosa. O verso qualcosa."]],
        npcs: (s) => [
          { id: "cc_capitana", at: [17, 14] },
          ...(s <= 1 && !F.is("party_cc_rubi") ? [{ id: "cc_rubi", at: [6, 9], route: [[6, 9], [27, 9], [27, 6], [6, 6]], speed: 0.9, pause: 15 }] : []),
          { id: "cc_marinaio", at: [24, 15], route: [[24, 15], [30, 15]], speed: 0.3, pause: 80 },
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(0, 0, 0, 19, "t"); lay(33, 0, 33, 19, "t"); put(16, 0, "^"); put(17, 0, "^");
          lay(0, 17, 33, 19, "~"); lay(1, 13, 32, 16, "+"); lay(16, 1, 17, 12, ":"); lay(2, 9, 31, 9, ":"); lay(2, 6, 31, 6, ":");
          house(3, 2, 6, 3, { door: [5, 4], roof: "#3a6ab8", wall: "#f4f4f8", rr: 2, enter: "La casa del faro spento. Un vecchio orologio a vento: fermo, ovviamente, sull'ora in cui il vento se n'è andato." });
          house(25, 2, 6, 3, { door: [28, 4], roof: "#3a6ab8", wall: "#f4f4f8", rr: 2, lit: true, enter: { room: "locanda", id: "cc_osteria", name: "L'osteria del Gabbiano", who: [] } });
          put(16, 16, "K"); put(17, 16, "K"); put(18, 16, "K"); [[10, 12], [22, 12]].forEach(([x, y]) => put(x, y, "s"));
        },
      },
      cc_isola: {
        region: "mare", name: "Le Cronache · L'isola del Cristallo del Mare", short: "L'isola del Mare", sub: "Il campo sulla spiaggia, con la bassa marea", bg: "cc_isola", time: "giorno", travel: [15, 17],
        w: 30, h: 20, start: [15, 17], items: [[3, 10], [26, 10]],
        areas: [[7, 4, 22, 13, "Il campo della marea"], [0, 0, 29, 19, "L'isola"]], act: { v: "Torna alla nave" },
        intro: [["voce", "L'isola del Cristallo del Mare: una spiaggia a forma di mezzaluna, e un campo da calcio disegnato nella sabbia che compare solo con la bassa marea. In fondo, su uno scoglio, il cristallo: azzurro, quasi spento."], ["voce", "In campo, quattro figure grigie in fila, immobili. Non parlano. Non si muovono. Aspettano."]],
        npcs: (s) => (s >= 3 ? [{ id: "cc_muto", at: [15, 8] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 2, "~"); lay(0, 0, 1, 19, "~"); lay(28, 0, 29, 19, "~"); lay(0, 19, 29, 19, "~"); lay(2, 3, 27, 18, ",");
          put(15, 3, "Y"); lay(14, 14, 16, 17, ":"); put(14, 18, "v"); put(15, 18, "v"); put(16, 18, "v"); [[4, 5], [25, 5], [4, 15], [25, 15]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) { // le linee del campo disegnate nella sabbia
          g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 1.2; g.setLineDash([4, 3]); g.strokeRect(d.X(7) + 2, d.Y(4) + 2, 16 * 16 - 4, 10 * 16 - 4); g.beginPath(); g.moveTo(d.X(15) + 8, d.Y(4) + 2); g.lineTo(d.X(15) + 8, d.Y(14) - 2); g.stroke(); g.setLineDash([]);
        },
      },
    };
    function match() {
      K.ownMatch(window.__atb.start, {
        oppStyle: "pressing", title: "Il Cristallo del Mare · contro i Silenti", us: "Il gruppo", half: 70, theme: "mare",
        heroSt: { tiro: 16, pass: 14, dif: 12, vel: 15 }, heroSpells: ["luce"], heroMp: 18,
        party: [{ id: "cc_lyra", name: "Lyra", skin: "#f0d0b0", hair: "#c8a040", st: { tiro: 9, pass: 12, dif: 18, vel: 12 }, spells: ["cura"], mp: 16 }, { id: "cc_fosco", name: "Fosco", skin: "#e8c4a0", hair: "#3a2a5a", st: { tiro: 9, pass: 15, dif: 8, vel: 10 }, spells: ["vento", "gelo", "fuoco"], mp: 32 }, { id: "cc_rubi", name: "Rubi", skin: "#c68642", hair: "#1a1a1a", st: { tiro: 13, pass: 12, dif: 14, vel: 18 }, spells: [], mp: 0 }],
        opp: { name: "I Silenti", color: "#4a4a5a", players: [{ name: "Il Muto", skin: "#c8c8d0", hair: "#3a3a4a", st: { tiro: 14, pass: 14, dif: 14, vel: 12 } }, { name: "Quieto", skin: "#c8c8d0", hair: "#2a2a3a", st: { tiro: 12, pass: 13, dif: 13, vel: 12 } }, { name: "Zitto", skin: "#c8c8d0", hair: "#4a4a5a", st: { tiro: 12, pass: 12, dif: 14, vel: 11 } }, { name: "Taciturno", skin: "#c8c8d0", hair: "#3a3a3a", st: { tiro: 11, pass: 12, dif: 15, vel: 11 } }] },
        intro: "<p>I Silenti pressano senza un rumore, perfetti come orologi. Rubi è il più veloce del gruppo: usalo per rubare palla. Fosco ha <b>Gelo</b> per rallentarli.</p>",
        done: (r) => {
          if (!r.win) return K.scene([["cc_rubi", "Hanno vinto loro, e non hanno nemmeno esultato. È questo che fa paura. Rigiochiamo: io stavolta corro il doppio."], ["cc_lyra", "La marea è ancora bassa. Abbiamo tempo."]], () => K.enterZone("cc_isola"), "cc_isola");
          F.set("cristallo_cc_isola", true); setStep(N, 4); questDone("cc_mare"); bond("gruppo", 2);
          K.scene([["voce", "Fischio finale. Rubi esulta così forte che si sente fino al porto. Fosco esulta anche lui, con un piccolo Vento che fa volare via il cappello di Lyra. Lyra esulta… quasi."], ["voce", "Il cristallo sullo scoglio si accende: azzurro, profondo, come il mare a mezzogiorno. E il vento torna. Tutto insieme. Le vele del Garbino si gonfiano da sole, laggiù al molo."], ["voce", "Il Muto è rimasto in campo. Fermo. Guarda il gruppo che esulta. Nella mano stringe un foglio e una matita."]], () => K.enterZone("cc_isola"), "cc_isola");
        },
      });
    }
    const talk = {
      cc_capitana() {
        const s = S();
        if (s === 0) return say([
          ["cc_capitana", "Capitana Marea, del Garbino. Volete andare all'isola del Cristallo del Mare? Anch'io. Da un anno. Ma senza vento non si parte, e senza vele neanche col vento."],
          ["cc_capitana", "Le vele me le hanno rubate. Un ragazzo con la bandana, velocissimo: gira ancora per le banchine, il furfante. Il bello è che ogni mattina mi lascia sul molo un pesce fresco. Un ladro strano."],
        ], () => { setStep(N, 1); quest("cc_vele", "Le vele del Garbino", "Trova il ragazzo con la bandana: gira per le banchine del porto."); done(); });
        if (s === 2) return say([["cc_capitana", "Le mie vele! Lucidate! Profumano di… di ragazzo che ci ha dormito dentro. Va bene, va bene. (Le annusa di nuovo, commossa.) Il Garbino è vostro, finché vi serve. Non c'è vento, ma il Garbino sa remare da solo, se glielo chiedi gentilmente."], ["voce", "<b>Avete la nave!</b> Sulla mappa del mondo, il mare ora si può navigare: ci passi sopra con la barca."]], () => { F.set("cc_nave", true); setStep(N, 3); questDone("cc_vele"); quest("cc_mare", "Il Cristallo del Mare", "Naviga fino all'isola del Cristallo del Mare, nel lago a nord-ovest della mappa del mondo."); done(); });
        if (s >= 4) return say([["cc_capitana", "Il vento! È tornato tutto insieme, stamattina! Le vele si sono gonfiate da sole. Non ho mai visto una cosa così in cinquant'anni di mare."]]);
        return say([["cc_capitana", K.pick(["Il Garbino è pronto. Più pronto di così, solo con il vento.", "Le stelle per orientarsi ci sono ancora. È il vento che manca. Il vento, e la voglia."])]]);
      },
      cc_rubi() {
        const s = S();
        if (F.is("party_cc_rubi")) return say([["cc_rubi", K.pick(["Corro dietro di te, ma potrei correre davanti. Non lo faccio per educazione.", "Se vedi qualcosa che sta per essere rubato, dimmelo: lo rubo prima io e poi lo restituisco.", lit() ? "Il vento è tornato. Le vele adesso sanno di vento vero. Mi mancheranno." : "I Silenti non parlano. Io parlo per due. È un buon equilibrio."])]]);
        if (s === 1) return ask("cc_rubi", "(si ferma in equilibrio su una bitta) Mi cercavate? Lo so, lo so: le vele. Le ho rubate io. Ma prima che le bruciassero i Silenti, quelli grigi del Re del Silenzio. Le ho tenute addosso un anno: ci ho dormito dentro. Sono calde.\n\nVolete il Cristallo del Mare? Ci vengo anch'io. I Silenti sono sull'isola. Corro più veloce di tutti, e rubo palla meglio di chiunque.", [
          { label: "«Ti credo. Vieni con noi»", sub: "Fidati del ladro gentile", cls: "hot", fn: () => joinRubi(true) },
          { label: "«Prima le vele. Poi vediamo»", sub: "Prudenza", fn: () => joinRubi(false) },
        ], "cc_porto");
        return say([["cc_rubi", "(passa correndo) Ciao! Non ho rubato niente! Oggi!"]]);
      },
      cc_marinaio() { return say([["cc_marinaio", lit() ? "Il vento! Il ponte è pulitissimo, l'avevo detto! Il vento ha trovato tutto in ordine!" : "Pulisco il ponte. Quando tornerà il vento, voglio che trovi tutto in ordine."]]); },
      cc_muto() {
        const s = S();
        if (s === 3) return ask("cc_muto", "(Il Muto alza una mano. Non dice niente. Indica il campo, poi il cristallo, poi voi. Poi porta il fischietto senza fischio alle labbra e soffia. Non si sente niente. Ma tutti capiscono: la partita è cominciata.)", [{ label: "Gioca contro i Silenti", sub: "Partita ATB · con tutto il gruppo", cls: "hot", fn: match }, { label: "Non ancora", fn: done }], "cc_isola");
        if (s === 4) return ask("cc_muto", "(Il Muto scrive su un foglio, lentamente, e te lo porge.) «Avete esultato. Il cristallo si è acceso. Il nostro re aveva detto che non sarebbe successo mai più. Aveva torto. Cosa farete di noi?»", [
          { label: "«Siete liberi. Andate, e provate a esultare»", sub: "Lascia andare i Silenti", big: true, fn: () => endCh("liberi") },
          { label: "«Venite con noi al castello. Spiegherete tutto»", sub: "Giustizia", big: true, fn: () => endCh("castello") },
          { label: "«Raccontami del tuo re»", sub: "Ascolta il Muto", big: true, fn: () => endCh("re") },
        ], "cc_isola");
        return say([["cc_muto", "(Il Muto fa un piccolo cenno con la testa. Quasi un sorriso.)"]]);
      },
    };
    function joinRubi(trust) {
      setStep(N, 2); K.joinParty("cc_rubi"); K.learnLore("l_rubi"); if (trust) { bond("luce", 1); bond("gruppo", 1); } else bond("luce", -1);
      say(trust ? [["cc_rubi", "Mi credi? Davvero? Nessuno mi crede mai, di solito mi inseguono. (Ti porge le vele, piegate a quadretto.) Portale alla Capitana. E io vengo con voi. Dietro. Per educazione."], ["voce", "<b>Rubi si unisce al gruppo.</b> È il più veloce di tutti."]]
        : [["cc_rubi", "Giusto, giusto. Prudenza. (Ti porge le vele, un po' offeso.) Le ho lucidate, eh. Comunque vengo lo stesso: senza di me, i Silenti vi rubano anche le scarpe."], ["voce", "<b>Rubi si unisce al gruppo.</b> È il più veloce di tutti."]]);
    }
    function endCh(kind) {
      if (kind === "liberi") bond("luce", 2); if (kind === "castello") { bond("gruppo", 1); bond("luce", -1); } if (kind === "re") { bond("luce", 1); K.learnLore("l_re"); }
      K.learnLore("l_silenti"); const msg = K.reward("ch2", { coins: 80, cos: ["cc_c2"] }); finishChapter(N, kind); setStep(N, 7);
      const lines = {
        liberi: [["voce", "I Silenti se ne vanno in fila, sulla spiaggia. A metà strada uno di loro si ferma, alza le braccia, e prova a gridare. Esce solo un fiato. Ma è un inizio."]],
        castello: [["voce", "I Silenti salgono sul Garbino senza opporsi. Durante il viaggio, uno di loro guarda Rubi che racconta barzellette, e una volta, una sola, gli trema l'angolo della bocca."]],
        re: [["voce", "Il Muto scrive a lungo. Fogli e fogli. Quando ha finito, il sole è già basso sull'isola."], ["voce", "«Il nostro re era un portiere. Il più forte del mondo. Nessuno ha mai esultato per una sua parata: si esulta per i gol, mai per chi li evita. Neanche lui ha mai esultato. Allora ha deciso che nessuno avrebbe più esultato per niente.»"], ["cc_lyra", "(piano) Un portiere che nessuno ha mai applaudito. …Lo capisco, sai. Più di quanto vorrei."]],
      }[kind];
      K.scene([...lines, ["voce", `Due cristalli brillano. Ne mancano due: le Stelle e il Fuoco. E il Re del Silenzio li aspetta. <b>Fine del Capitolo 2.</b> ${msg.join(" · ")}`]], () => K.openMain(), "cc_isola");
    }
    const obj = {
      "cc_mondo:K": () => go("cc_porto", 17, 2), "cc_porto:^": () => go("cc_mondo", 6, 10),
      "cc_mondo:U": () => go("cc_isola", 15, 17), "cc_isola:v": () => go("cc_mondo", 4, 6),
      "cc_isola:Y": () => say([["voce", lit() ? "Il Cristallo del Mare brilla, azzurro e profondo. Dentro, se avvicini l'orecchio, si sente il mare. E sotto il mare, piano, un coro di stadio." : "Il cristallo è quasi spento. Azzurro pallido, come un mare d'inverno. Aspetta."]]),
    };
    const patch = {
      // NOVITÀ: con la nave, il mare (il lago a nord-ovest e i canali) diventa navigabile, e in mezzo c'è l'isola
      cc_mondo: {
        build(L) { if (!F.is("cc_nave")) return; L.lay(1, 1, 3, 12, "J"); L.lay(1, 1, 12, 1, "J"); L.lay(4, 2, 5, 9, "J"); L.put(2, 6, "U"); },
        act: { U: "Sbarca sull'isola", K: "Entra nel porto" },
        top(g, cx, cy, d, s, K2) { // la barca sotto i piedi, quando si naviga
          const p = K.api.trPos && K.api.trPos(); if (!p) return; const tx = Math.floor(p[0] / TS), ty = Math.floor((p[1] - 4) / TS), m = K.ZX.map;
          if (!(m && m[ty] && m[ty][tx] === "J")) return; const x = p[0] - cx, y = p[1] - cy, b = Math.sin(d.fr / 12) * 1;
          g.fillStyle = "#6a4a2a"; g.beginPath(); g.moveTo(x - 11, y - 2 + b); g.lineTo(x + 11, y - 2 + b); g.lineTo(x + 7, y + 5 + b); g.lineTo(x - 7, y + 5 + b); g.closePath(); g.fill(); g.fillStyle = "#8a6a4a"; g.fillRect(x - 11, y - 3 + b, 22, 2);
          g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(x - 14 - (d.fr % 8), y + 4, 4, 1); g.fillRect(x + 10 + (d.fr % 8), y + 4, 4, 1);
        },
      },
    };
    return { n: N, title: "Il Cristallo del Mare", sub: "Il porto di Sale Antico, la nave, l'isola dei Silenti", goal, start: "cc_mondo", introBg: "cc_porto", zones, talk, obj, patch,
      intro: () => [["voce", "Il Cristallo dell'Erba brilla, e a Prato Lungo l'erba canta. Ma la stagione si è mossa di un passo appena: la primavera è arrivata, e si è fermata lì."], ["cc_fosco", "Il secondo cristallo è il Cristallo del Mare. Su un'isola. Per arrivarci serve una nave, e per la nave serve un porto. Il porto è a ovest, oltre il lago. Credo. Ho gli occhiali, adesso: ne sono quasi sicuro."]] };
  }
  boot();
})();
