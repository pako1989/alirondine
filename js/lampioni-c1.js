// js/lampioni-c1.js - LA NOTTE DEI LAMPIONI · Capitolo 1 «Il primo lampione»
// Sanlume, la notte della festa. Il paese è al buio: i dodici lampioni antichi non si sono accesi. La sindaca è nervosa,
// il campanaro gira con una candela, e nella bottega in fondo alla piazza Fiammetta, nipote dell'ultima lampionaia,
// tiene in un cassetto la lanterna della nonna. Si accendono i quattro lampioni della piazza, e nella luce compare un'ombra.
(function () {
  "use strict";
  function boot() { const D = window.__lampioni; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("nl_fiammetta", { acc: ["grembiule", "chiave"], name: "Fiammetta, nipote della lampionaia", tag: "", hair: "#c8642a", style: "braids", skin: "#f0d0b0", eye: "#3a5a3a", bg: ["#14142a", "#ffd27a"], shirt: "#5a3a2a" },
      "Ripara orologi e lampade nella bottega di sua nonna, l'ultima lampionaia di Sanlume. Non ha mai acceso un lampione: dice che non è roba sua, che la nonna aveva «la mano». Tiene la lanterna della nonna in un cassetto, e la lucida ogni domenica.");
    K.cast("nl_clelia", { acc: ["fascia"], name: "Sindaca Clelia", tag: "gray", hair: "#d8d8d8", style: "bun", skin: "#e8c4a0", eye: "#3a3a5a", bg: ["#1a1a2a", "#5a8ad8"], shirt: "#3a4a8a" },
      "La sindaca di Sanlume. Ha sempre una cartellina sotto il braccio e un'idea per migliorare il paese. Quella di quest'anno: lampioni nuovi, a luce bianca, che si accendono da soli. Quelli vecchi non si sono accesi per protesta. Forse.");
    K.cast("nl_tobia", { acc: ["sciarpa"], name: "Tobia il campanaro", tag: "", hair: "#5a4a3a", style: "messy", skin: "#e0b890", eye: "#3a3a3a", bg: ["#1a1a2a", "#e8c84a"], shirt: "#6a5a4a" },
      "Il campanaro di Sanlume. Suona le ore, le feste e, quando nessuno lo vede, una canzone che ha inventato lui. Stanotte gira per il paese con una candela, a controllare che il buio non si porti via niente.");
    K.cast("nl_leandro", { shape: "ombra", name: "Capitano Leandro, un'ombra", tag: "", skin: "#3a3a6a", eye: "#ffe8a0", bg: ["#0a0a1a", "#9ab8ff"], shirt: "#8a2a2a", num: "9" },
      "Il capitano del Sanlume del 1952, la squadra che vinse il torneo delle colline e poi, una sera, giocò la partita più bella che nessuno abbia visto: al buio, per un guasto alla corrente. Ogni anno torna, con la sua squadra, per la festa. È un'ombra gentile: ride spesso, e ha freddo ai piedi.");
    K.cos("nl_c1", { kind: "shirt", label: "Maglia notte di Sanlume", val: "#3a3a6a", from: "Capitolo 1 della Notte dei Lampioni" });
    K.cos("nl_fiammiferi1", { kind: "hairc", label: "Capelli Fiammella", val: "#ff9a3a", from: "Trova tutti i fiammiferi antichi della piazza" });
    K.lore("l_lampioni", { t: "I dodici lampioni", d: "Una notte all'anno, a Sanlume, i dodici lampioni antichi si accendono da soli: è la Notte dei Lampioni. Servono a fare strada alle Ombre gentili, i giocatori di un tempo, che tornano per la partita della festa." });
    K.lore("l_lanterna", { t: "La lanterna della nonna", d: "Ottone, vetro soffiato, un manico di legno consumato dalle mani. Non si accende con i fiammiferi: si accende quando la porta qualcuno che vuole davvero fare luce." });
    const goal = (s) => ({
      0: "Sanlume è al buio, la notte della festa. In piazza c'è la sindaca Clelia.",
      1: "La bottega di Fiammetta è la casa in alto a sinistra della piazza.",
      2: `Accendi i quattro lampioni della piazza con la lanterna (accesi: ${K.lampsIn("nl_borgo")}/4).`,
      3: "Nella luce dei lampioni c'è un'ombra. Parlale.",
      4: "Hai giocato con le Ombre. Parla con il capitano Leandro.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      nl_borgo: {
        region: "borgo", name: "La Notte dei Lampioni · Sanlume", short: "Sanlume", sub: "Il paese al buio, la notte della festa", bg: "nl_borgo", time: "notte", travel: [17, 19],
        w: 34, h: 24, start: [17, 19], itemCos: "nl_fiammiferi1", items: [[2, 20], [31, 12], [9, 21]],
        buio: (k) => 0.86, heroLight: 2.6, luci: K.lampLights("nl_borgo", (k) => [[6, 8, 1.2, "255,180,90"], [27, 8, 1.2, "255,180,90"]]),
        areas: [[12, 9, 22, 15, "La piazza dei lampioni"], [0, 0, 33, 23, "Sanlume"]],
        flavor: { t: "Un castagno. Nel buio, i ricci fanno ombre di stelle." },
        intro: [["voce", "Sanlume, la notte della festa. I tavoli sono pronti in piazza, le bandierine appese, la banda accorda gli strumenti. Ma i dodici lampioni antichi, che ogni anno si accendono da soli a mezzanotte, sono spenti. E il paese è al buio."], ["voce", "Si vede solo un poco intorno a te. Più in là, il buio. E nel buio, a volte, qualcosa che sembra ascoltare."]],
        npcs: (s) => [{ id: "nl_clelia", at: [17, 12] }, { id: "nl_tobia", at: [10, 20], route: [[10, 20], [24, 20]], speed: 0.3, pause: 70 }, ...(s >= 3 && s <= 4 ? [{ id: "nl_leandro", at: [17, 10] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(0, 23, 33, 23, "t"); lay(0, 0, 0, 23, "t"); lay(33, 0, 33, 23, "t");
          lay(12, 9, 22, 15, "+"); lay(17, 16, 17, 22, ":"); lay(6, 8, 11, 8, ":"); lay(23, 8, 27, 8, ":"); lay(9, 18, 25, 20, ":");
          house(3, 3, 7, 5, { door: [6, 7], roof: "#5a3a2a", wall: "#c8b090", rr: 3, lit: true, enter: { to: "nl_bottega", at: [10, 10] } });
          house(24, 3, 7, 5, { door: [27, 7], roof: "#6a2a2a", wall: "#c8a890", rr: 3, lit: true, enter: "L'osteria della festa: tavolate lunghe, fiaschi impagliati, e un oste che taglia il pane al buio, a memoria. «Stanotte senza lampioni non viene nessuno», sospira. «Nemmeno loro.»" });
          [[12, 8], [22, 8], [12, 16], [22, 16]].forEach(([x, y]) => put(x, y, "U"));
          [[3, 12], [6, 15], [29, 15], [27, 20], [4, 2], [30, 2], [14, 3], [20, 3]].forEach(([x, y]) => put(x, y, "t")); put(5, 20, "s");
        },
        decor(g, cx, cy, d) { // le bandierine della festa, tra un lampione e l'altro
          for (let i = 0; i < 11; i++) { const x = d.X(12) + 8 + i * 16, y = d.Y(8) - 18 + Math.sin(i / 10 * Math.PI) * 6; g.fillStyle = ["#e83a3a", "#ffd27a", "#3a8ac8", "#5aa84a"][i % 4]; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6, y); g.lineTo(x + 3, y + 6); g.closePath(); g.fill(); }
        },
      },
      nl_bottega: {
        interior: true, region: "casa", name: "La Notte dei Lampioni · La bottega di Fiammetta", short: "La bottega", sub: "Orologi, lampade e un cassetto chiuso", bg: "nl_bottega", w: 20, h: 13, start: [10, 10], outside: ["nl_borgo", 6, 8],
        buio: 0.55, heroLight: 3, luci: () => [[10, 4, 3, "255,190,110"], [4, 7, 2, "255,190,110"]],
        act: { T: "Guarda il banco da lavoro", L: "Guarda gli scaffali", D: "Guarda il cassetto", W: "Guarda dalla finestra", v: "Esci" },
        flavor: { T: "Il banco da lavoro: orologi aperti come conchiglie, molle, viti, una lente. E un quaderno della nonna: «Lampione n. 7: cigola. Lampione n. 12: ha paura del vento».", L: "Lampade di ogni epoca: a olio, a petrolio, a carburo, una a forma di gufo. Nessuna accesa.", D: "Il cassetto della nonna. Dentro, avvolta in un panno di velluto, c'era una lanterna. Adesso c'è solo il segno del suo manico, sul velluto.", W: "Dalla finestra si vede la piazza al buio. Una candela gira in tondo: è Tobia, il campanaro." },
        intro: [["voce", "La bottega: orologi che ticchettano tutti insieme, lampade appese al soffitto come frutti, odore di olio e di ottone. Al banco, una ragazza con le trecce rosse lucida qualcosa che brilla."]],
        npcs: () => [{ id: "nl_fiammetta", at: [10, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(2, 1, 7, 1, "L"); lay(12, 1, 17, 1, "L"); put(4, 7, "T"); put(5, 7, "T"); put(15, 6, "D"); put(9, 1, "W"); put(2, 10, "s"); },
      },
    };
    function match() {
      K.ownMatch(window.__luci.start, {
        oppStyle: "equilibrata", title: "Luci · contro le Ombre del 1952", us: "Sanlume", usColor: "#ffd27a", lanterns: 3, actions: 6,
        mates: [{ name: "Fiammetta" }, { name: "Tobia" }], opp: { name: "Le Ombre del '52", color: "#6a7ab8" },
        intro: "<p>Il capitano Leandro vuole una partita «come quella del '52»: al buio. Le sue Ombre si vedono solo nella luce. Tu hai tre lanterne per azione: usale bene.</p>", winTitle: "LA PIAZZA SI ACCENDE!",
        done: (r) => {
          bond("ombre", r.win ? 3 : 2); setStep(N, 4);
          K.scene([["voce", r.win ? "Fischio finale, o qualcosa del genere: Leandro ha un fischietto che non fa rumore. Avete vinto! Le Ombre applaudono senza far rumore, ed è il silenzio più allegro che tu abbia mai sentito." : "Le Ombre vincono, con un gol di tacco che non si vede ma si sente. Leandro ride senza far rumore."], ["nl_leandro", "[ride] Così si gioca! Al buio, a tentoni, fidandosi. Nel '52 abbiamo giocato così una partita intera. È stata la più bella. E nessuno l'ha vista."]], () => K.enterZone("nl_borgo"), "nl_borgo");
        },
      });
    }
    const talk = {
      nl_clelia() {
        if (S() === 0) return say([["nl_clelia", "[arrabbiato] Ma ti pare? La notte della festa, e i lampioni non si accendono. Da trecento anni si accendono da soli, a mezzanotte. Proprio quest'anno che volevo sostituirli con quelli nuovi, a luce bianca, automatici…"], ["nl_clelia", "[pensa] …Non che io creda a queste cose. Però. Fiammetta, la nipote della vecchia lampionaia, ha la bottega in alto a sinistra della piazza. Prova a chiedere a lei. Io intanto conto le sedie. Al buio."]], () => { setStep(N, 1); quest("nl_luci", "I lampioni spenti", "Fiammetta, nella bottega in alto a sinistra, forse sa qualcosa."); done(); });
        return say([["nl_clelia", S() >= 3 ? "[sorpreso] Un'… ombra? In piazza? (Si sistema gli occhiali, che non ha.) Bene. Benissimo. La metto nel verbale come «ospite d'onore»." : "Ho contato le sedie: centoventi. Al buio ne ho contate centoventidue. Due sono in più. Non so di chi siano."]]);
      },
      nl_fiammetta() {
        const s = S();
        if (s <= 1) return ask("nl_fiammetta", "(Smette di lucidare.) La sindaca ti manda? (Sospira.) Nonna diceva che i lampioni si accendono da soli finché qualcuno, in paese, ci crede. Quest'anno forse non ci crede più nessuno. Neanche io.\n\nPerò ho questa. (Apre il panno di velluto: una lanterna d'ottone.) La sua lanterna. Non si accende con i fiammiferi. Si accende… be', non lo so come si accende.", [
          { label: "«Proviamo insieme. Io la porto, tu mi dici dove»", sub: "Prendi la lanterna", big: true, fn: () => lantern(true) },
          { label: "«Accendila tu. È la lanterna di tua nonna»", sub: "Incoraggiala", big: true, fn: () => lantern(false) },
        ], "nl_bottega");
        return say([["nl_fiammetta", s >= 4 ? "[felice] Le Ombre… sono vere. Nonna me lo raccontava e io ridevo. (Ride, adesso.) Domani le chiedo scusa. Cioè: stanotte. Al vecchio campo." : `I lampioni della piazza sono quattro, agli angoli. Avvicina la lanterna al vetro: il resto lo fa lei. (Accesi: ${K.lampsIn("nl_borgo")}/4.)`]]);
      },
      nl_tobia() { return say([["nl_tobia", S() >= 3 ? "Hai visto? Hai visto?! C'è un signore fatto di buio in piazza, e mi ha salutato! Gli ho suonato la mia canzone. Ha ballato. Male, ma ha ballato." : "(Con la candela in mano) Faccio il giro per controllare che il buio non si porti via niente. Finora ha preso solo un gatto. Poi l'ha ridato."]]); },
      nl_leandro() {
        const s = S();
        if (s === 3) return ask("nl_leandro", "(Un'ombra alta, con una maglia granata del 1952 e il numero nove. Ti guarda con due occhi che sembrano fiammelle.) Finalmente un po' di luce! Era un anno che aspettavamo. Senza i lampioni non troviamo la strada: il buio è grande, per noi.\n\nSono Leandro, capitano del Sanlume. Prima della festa, di solito, giochiamo una partitella. Al buio, come la nostra partita più bella. Ci stai?", [{ label: "Gioca con le Ombre", sub: "Luci · la partita al buio", cls: "hot", fn: match }, { label: "Non ancora", fn: done }], "nl_borgo");
        if (s === 4) return ask("nl_leandro", "Bella partita. (Si siede su un gradino, che non scricchiola.) Ma la festa vera è al vecchio campo, oltre il bosco. Senza lampioni, il bosco è troppo buio anche per noi. Le altre Ombre si sono perse là dentro.", [
          { label: "«Accenderemo tutti i lampioni. Vi porto io al campo»", sub: "Una promessa", big: true, fn: () => fine1(true) },
          { label: "«Domani, con la luce del giorno, sarà più facile»", sub: "Prudenza", big: true, fn: () => fine1(false) },
        ], "nl_borgo");
        return say([["nl_leandro", "[felice] Grazie della luce. Ne avevamo bisogno più di quanto sembri."]]);
      },
    };
    function lantern(take) {
      K.scene(take ? [["voce", "Prendi la lanterna. È tiepida, come una mano. Fiammetta ti guarda, e per un attimo dentro il vetro si accende una fiammella piccolissima. Poi, quando lei sorride, diventa grande."], ["nl_fiammetta", "[sorpreso] Si è accesa! Si è accesa quando… quando ci ho creduto un po'. (Ride.) Vai. Quattro lampioni in piazza, agli angoli. Io ti seguo con lo sguardo dalla finestra."]]
        : [["nl_fiammetta", "[triste] Io? (Prende la lanterna. Non succede niente.) Vedi? Non ho la mano di nonna."], ["voce", "Le prendi la mano, con la lanterna dentro. E la fiammella si accende: piccola, poi grande."], ["nl_fiammetta", "[ride] …Ah. Era una lanterna da due mani. Nonna non me l'aveva mai detto. Portala tu, stanotte: io ti faccio strada."]], () => {
        F.set("nl_lanterna", true); bond("luce", take ? 1 : 2); setStep(N, 2); K.learnLore("l_lanterna"); questDone("nl_luci"); quest("nl_piazza", "I quattro lampioni della piazza", "Agli angoli della piazza: avvicina la lanterna al vetro."); K.refreshZone(); done();
      }, "nl_bottega");
    }
    function fine1(promise) {
      if (promise) bond("ombre", 2); else bond("luce", 1);
      const msg = K.reward("c1:nl", { coins: 60, cos: ["nl_c1"] }); finishChapter(N, promise ? "promessa" : "prudenza"); setStep(N, 5);
      K.scene([["nl_leandro", promise ? "[felice] Una promessa fatta al buio vale il doppio: la luce non la vede, e allora la custodisce il cuore. Ti aspettiamo al bosco." : "[pensa] Domani? Noi non abbiamo domani, ragazzo. Abbiamo stanotte. (Sorride.) Ma va bene: comincia a cercare la strada. Noi ti aspettiamo."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «La strada delle lucciole».`]], () => K.openMain(), "nl_borgo");
    }
    // i quattro lampioni della piazza: quando sono accesi, compare l'ombra
    const plugTick = () => { if (S() === 2 && K.lampsIn("nl_borgo") >= 4) { setStep(N, 3); questDone("nl_piazza"); K.learnLore("l_lampioni"); K.refreshZone(); K.scene([["voce", "Il quarto lampione si accende. La piazza, per la prima volta stanotte, è piena di luce calda. E nel centro, dove un attimo fa non c'era nessuno, c'è qualcuno."], ["voce", "Un'ombra. Alta, gentile, con una maglia vecchia e il numero nove. Ti saluta con la mano."]], done, "nl_borgo"); } };
    zones.nl_borgo.tick = () => plugTick();
    return { n: N, title: "Il primo lampione", sub: "La lanterna della nonna, i quattro lampioni della piazza, l'Ombra", goal, start: "nl_borgo", introBg: "nl_borgo", zones, talk,
      intro: () => [["voce", "<b>LA NOTTE DEI LAMPIONI.</b> Sanlume, ventitré e cinquanta. Tra dieci minuti i lampioni dovrebbero accendersi da soli. Il paese aspetta, in piazza, con il naso all'insù."]] };
  }
  boot();
})();
