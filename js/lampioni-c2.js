// js/lampioni-c2.js - LA NOTTE DEI LAMPIONI · Capitolo 2 «La strada delle lucciole»
// Oltre la piazza, il bosco. Buio fitto: si vede solo vicino alla lanterna, ai lampioni che accendi e alle lucciole che
// girano. Tre Ombre del 1952 si sono perse tra gli alberi. In una capanna, in fondo al bosco, vive qualcuno che i lampioni
// li accendeva davvero: Nonna Lucia, l'ultima lampionaia. Ha smesso di crederci. Ha con sé la fiammella madre.
(function () {
  "use strict";
  function boot() { const D = window.__lampioni; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("nl_lucia", { acc: ["sciarpa", "occhiali"], name: "Nonna Lucia, l'ultima lampionaia", tag: "gray", hair: "#e8e8f0", style: "bun", skin: "#e8c4a0", eye: "#3a5a3a", bg: ["#14142a", "#ffd27a"], shirt: "#3a3a5a" },
      "Per sessant'anni ha acceso i lampioni di Sanlume, uno a uno, ogni sera, anche quando non serviva. Poi in paese hanno cominciato a dire che erano vecchi, che servivano quelli nuovi. Si è ritirata nella capanna del bosco con la fiammella madre in un barattolo. Non è triste: è offesa. È diverso.");
    [["nl_ombra1", "Ombra del terzino", "#2a6a8a", "3", "Il terzino del 1952: non ha mai fatto un gol in vita sua, e se ne vanta. «Il mio lavoro era non farne fare agli altri»."], ["nl_ombra2", "Ombra del portiere", "#6a6a2a", "1", "Il portiere del 1952: parava tutto, tranne i rigori di sua sorella. Nel buio vede benissimo: per questo si è perso. Era troppo sicuro di sé."], ["nl_ombra3", "Ombra dell'ala", "#8a3a6a", "7", "L'ala del 1952, la più veloce delle colline. Corre ancora, nel bosco, in tondo: non trova l'uscita perché va troppo veloce per vederla."]].forEach(([id, name, shirt, num, bio]) => K.cast(id, { shape: "ombra", name, tag: "", skin: "#3a3a6a", eye: "#ffe8a0", bg: ["#0a0a1a", "#9ab8ff"], shirt, num }, bio));
    K.cos("nl_c2", { kind: "acc", label: "Sciarpa di Nonna Lucia", val: "sciarpa", from: "Capitolo 2 della Notte dei Lampioni" });
    K.cos("nl_fiammiferi2", { kind: "shirt", label: "Maglia Lucciola", val: "#c8e86a", from: "Trova tutti i fiammiferi antichi del bosco" });
    K.lore("l_fiammella", { t: "La fiammella madre", d: "La prima fiamma di Sanlume, accesa trecento anni fa e mai spenta: tutte le lanterne del paese sono figlie sue. Sta in un barattolo di vetro, e quando nessuno ci crede diventa piccola come un seme." });
    K.lore("l_tredici", { t: "Il tredicesimo lampione", d: "Nonna Lucia dice che i lampioni non sono dodici, ma tredici. Il tredicesimo è sul vecchio campo, e si accende solo quando tutti i fiammiferi antichi del paese tornano insieme." });
    const found = () => ["nl_ombra1", "nl_ombra2", "nl_ombra3"].filter((id) => F.is("trovata_" + id)).length;
    const goal = (s) => ({
      0: `Nel bosco a nord della piazza tre Ombre si sono perse (${found()}/3). Accendi i lampioni lungo il sentiero: nella luce le vedrai.`,
      1: "Le Ombre sono ritrovate. In fondo al bosco, a destra, c'è una capanna con la luce accesa.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    // le lucciole: piccole luci che girano lungo il sentiero (si muovono con il tempo)
    const flies = () => { const t = K.frNow() / 90; return [[17 + Math.sin(t) * 1.5, 21 + Math.cos(t) * 2], [9 + Math.cos(t * 0.8) * 1.5, 15 + Math.sin(t * 0.8) * 3], [19 + Math.sin(t * 1.2), 9 + Math.cos(t) * 2], [14 + Math.cos(t * 0.7) * 3, 6 + Math.sin(t * 0.9)]].map(([x, y]) => [x, y, 1.3, "200,255,140"]); };
    const zones = {
      nl_bosco: {
        region: "bosco", name: "La Notte dei Lampioni · Il bosco delle lucciole", short: "Il bosco", sub: "Il sentiero per il vecchio campo", bg: "nl_bosco", time: "notte", travel: [17, 24],
        w: 34, h: 26, start: [17, 24], itemCos: "nl_fiammiferi2", items: [[5, 19], [30, 21], [11, 3]],
        buio: 0.93, heroLight: 2.4, luci: K.lampLights("nl_bosco", flies),
        areas: [[23, 2, 31, 9, "La capanna"], [0, 0, 33, 25, "Il bosco delle lucciole"]], act: { v: "Torna in piazza", "^": "Il vecchio campo" },
        intro: [["voce", "Il bosco delle lucciole: alberi neri, un sentiero di terra battuta, e il buio così fitto che sembra di camminare dentro un cappotto. Ogni tanto, una lucciola. Ogni tanto, un lampione spento."], ["voce", "Da qualche parte, lontano, qualcuno chiama: «Capitanooo! Da che parte è il campo?». Una voce senza eco."]],
        npcs: (s) => [{ id: "nl_leandro", at: [18, 24] }, ...["nl_ombra1", "nl_ombra2", "nl_ombra3"].filter((id) => !F.is("trovata_" + id)).map((id, i) => ({ id, at: { nl_ombra1: [5, 17], nl_ombra2: [28, 20], nl_ombra3: [5, 3] }[id] }))],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 25, "t"); put(17, 25, "v"); put(17, 0, "^");
          lay(17, 19, 17, 24, ":"); lay(9, 19, 17, 19, ":"); lay(9, 12, 9, 19, ":"); lay(9, 12, 19, 12, ":"); lay(19, 6, 19, 12, ":"); lay(12, 6, 19, 6, ":"); lay(17, 1, 17, 6, ":");
          lay(4, 16, 8, 19, ","); lay(17, 22, 29, 22, ":"); lay(27, 19, 30, 22, ","); lay(19, 9, 28, 9, ":"); lay(23, 2, 31, 9, ",");
          house(24, 3, 7, 5, { door: [27, 7], roof: "#4a3a2a", wall: "#8a6a4a", rr: 3, lit: true, enter: { to: "nl_capanna", at: [10, 10] } }); lay(27, 8, 27, 8, ":");
          lay(4, 2, 12, 4, ","); lay(12, 4, 12, 6, ":");
          [[16, 21], [8, 15], [20, 10], [26, 10], [13, 7]].forEach(([x, y]) => put(x, y, "U")); put(18, 23, ",");
        },
      },
      nl_capanna: {
        interior: true, region: "casa", name: "La Notte dei Lampioni · La capanna della lampionaia", short: "La capanna", sub: "Un barattolo con dentro un seme di luce", bg: "nl_capanna", w: 20, h: 13, start: [10, 10], outside: ["nl_bosco", 27, 8],
        buio: 0.5, heroLight: 3, luci: () => [[10, 4, 3.4, "255,190,110"], [15, 7, 1.5, "255,220,140"]],
        act: { T: "Guarda il tavolo", L: "Guarda le lanterne appese", D: "Guarda il barattolo", W: "Guarda dalla finestra", v: "Esci" },
        flavor: { T: "Un tavolo con un quaderno: «Lampione n. 1: acceso. Lampione n. 2: acceso…» fino al dodici, per sessant'anni. L'ultima pagina è bianca.", L: "Lanterne appese, tutte spente, tutte lucidate. Le lucida ancora, dice Nonna Lucia. «Per abitudine. Non per speranza.»", D: "Un barattolo di vetro, e dentro un seme di luce, piccolo, che pulsa piano. La fiammella madre. Quando lo guardi, pulsa un po' più forte.", W: "Dalla finestra, il bosco al buio. Se guardi bene, verso il paese, si vedono i lampioni che hai acceso. Brillano. Nonna Lucia li guarda di sbieco, facendo finta di non guardarli." },
        intro: [["voce", "La capanna: lanterne spente appese al soffitto, un fuoco piccolo nel camino, un gatto (vero) che dorme su una sedia. E una vecchia signora con la sciarpa, che ti guarda entrare senza alzarsi."]],
        npcs: () => [{ id: "nl_lucia", at: [10, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(2, 1, 7, 1, "L"); put(14, 1, "W"); put(15, 7, "D"); lay(4, 6, 5, 7, "T"); put(2, 10, "s"); put(17, 3, "H"); },
      },
    };
    function trova(id, lines) {
      F.set("trovata_" + id, true); bond("ombre", 1);
      K.scene(lines.concat([["voce", `<b>Ombra ritrovata.</b> Va verso il vecchio campo, seguendo i lampioni. (${found()}/3)`]]), () => { if (found() === 3 && S() === 0) { setStep(N, 1); questDone("nl_ombre"); quest("nl_lucia", "La capanna nel bosco", "In fondo al bosco, a destra, c'è una luce accesa."); } K.refreshZone(); done(); }, "nl_bosco");
    }
    function partitella() {
      ask("nl_tobia", "Una partitella prima della festa? Sul sagrato, con le campane per porte! Come la giochiamo?", [
        { label: "A Luci, al buio", sub: "La partita con le lanterne", big: true, fn: () => K.ownMatch(window.__luci.start, { title: "Luci · la partitella del sagrato", us: "Sanlume", usColor: "#ffd27a", lanterns: 4, actions: 4, mates: [{ name: "Fiammetta" }, { name: "Clelia" }], opp: { name: "Il coro della chiesa", color: "#8a6a9a" }, done: pDone }) },
        { label: "Un'altra partita", sub: "Scegli tu la modalità", big: true, fn: () => K.playMatch({ id: "nl_sagrato", alt: "az,cage,hd", force: false, oppTeam: "Il coro della chiesa", oppColor: "#8a6a9a", mate: "Tobia", us: "Sanlume", homeKit: ["#3a3a6a", "#ffd27a"], azPitch: "notte", chap: "La Notte dei Lampioni · La partitella del sagrato", bg: "nl_borgo", oppNames: ["Contralto", "Soprano", "Tenore", "Basso", "Maestro"], intro: "Sul sagrato, sotto il campanile: Sanlume contro il coro della chiesa, che canta anche mentre gioca.", done: pDone }) },
        { label: "Un'altra volta", fn: done },
      ], "nl_borgo");
    }
    function pDone(r) { const msg = K.reward("m:nl_sagrato" + (r.win ? "w" : "p"), { coins: r.win ? 35 : 15 }); F.set("nl_sagrato", true); say([["nl_tobia", r.win ? "[ride] Battuto il coro! Il maestro dice che abbiamo segnato «fuori tempo». Ma era gol." : "Ha vinto il coro. Hanno segnato cantando. Non è regolare, ma è bellissimo."], ["voce", msg.join(" · ") || "Bella partitella."]]); }
    const talk = {
      nl_leandro() { return say([["nl_leandro", found() < 3 ? "[pensa] Le mie Ombre sono qui dentro, da qualche parte. Il buio è grande, per noi: senza luce non ci vediamo nemmeno tra di noi. Accendi i lampioni del sentiero, e guarda bene nelle radure." : "[felice] Tutti e tre! La squadra c'è. Adesso manca solo la strada fino al campo. E per quella, ci vuole la fiamma giusta."]]); },
      nl_ombra1() { trova("nl_ombra1", [["nl_ombra1", "[sorpreso] Luce! Finalmente! Stavo marcando un albero da un'ora. Era bravissimo. Non mi ha mai superato, ma nemmeno io lui."]]); },
      nl_ombra2() { trova("nl_ombra2", [["nl_ombra2", "[ride] Ah, sei tu! Pensavo fosse un rigore. Ogni luce che vedo, mi tuffo. Ho parato tre lucciole. Si sono offese."]]); },
      nl_ombra3() { trova("nl_ombra3", [["nl_ombra3", "[felice] Ferma, ferma, mi fermo! (Si ferma, dopo tre giri intorno a te.) Correvo in tondo da… da quando è buio. Cioè da sempre. Che bello fermarsi."]]); },
      nl_lucia() {
        const s = S();
        if (s === 0) return say([["nl_lucia", "[furbo] Un ragazzo con la lanterna di mia nipote, nel mio bosco, a mezzanotte. (Si sistema la sciarpa.) Le Ombre si sono perse, vero? Succede quando nessuno accende la strada. Trovale. Poi ne parliamo."]]);
        if (s === 1) return ask("nl_lucia", "(Guarda fuori dalla finestra: i lampioni del bosco, accesi, uno dopo l'altro.) Li hai accesi tu. Con la lanterna di Fiammetta. E le Ombre sono tornate.\n\nIo ho smesso perché in paese dicevano che erano vecchi, i lampioni. Come me. (Prende il barattolo con la fiammella madre: pulsa forte.) …Dicevano male, eh?", [
          { label: "«Torni in paese con noi. La festa senza di lei non è festa»", sub: "Riporta la lampionaia a Sanlume", big: true, fn: () => fine2(true) },
          { label: "«Le porteremo noi la festa, qui. Ci tenga la fiamma accesa»", sub: "Rispetta la sua scelta", big: true, fn: () => fine2(false) },
        ], "nl_capanna");
        return say([["nl_lucia", "La fiammella madre è con te. Trattala bene: è vecchia anche lei, e ha un caratteraccio."]]);
      },
      nl_tobia() { return partitella(); },
    };
    function fine2(back) {
      F.set("nl_fiammella", true); F.set("nl_lucia_torna", !!back); bond(back ? "luce" : "ombre", 2); K.learnLore("l_fiammella"); K.learnLore("l_tredici"); questDone("nl_lucia");
      const msg = K.reward("c2:nl", { coins: 70, cos: ["nl_c2"] }); finishChapter(N, back ? "torna" : "bosco"); setStep(N, 5);
      K.scene([["nl_lucia", back ? "[ride] In paese! Alla mia età! (Si alza, prende la sciarpa, il barattolo, il gatto.) Il gatto viene. Lui la festa non se l'è mai persa." : "[felice] Qui. Sì. Mi piace, qui. (Ti mette in mano il barattolo.) Ma la fiamma va al campo. È lei che deve accendere il resto."], ["nl_lucia", "[pensa] Ah, un'ultima cosa. I lampioni non sono dodici: sono tredici. Il tredicesimo è sul vecchio campo, e nessuno se lo ricorda più. Si accende solo se tutti i fiammiferi antichi del paese tornano insieme."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La notte più lunga».`]], () => K.openMain(), "nl_capanna");
    }
    const obj = { "nl_borgo:^": () => go("nl_bosco", 17, 24), "nl_bosco:v": () => go("nl_borgo", 17, 1), "nl_bosco:^": () => say([["voce", "Il sentiero sale verso il vecchio campo, ma oltre è buio pesto: senza la fiammella madre non si va. (Nonna Lucia, nella capanna.)"]]) };
    const patch = { nl_borgo: { build(L) { L.put(17, 0, "^"); L.lay(17, 1, 17, 8, ":"); }, npcs: (st, list) => list } };
    return { n: N, title: "La strada delle lucciole", sub: "Il bosco al buio, le Ombre perse, la capanna di Nonna Lucia", goal, start: "nl_borgo", introBg: "nl_bosco", zones, talk, obj, patch,
      intro: () => [["voce", "<b>LA NOTTE DEI LAMPIONI</b>, capitolo 2. La piazza è accesa, la festa aspetta. Ma la partita vera si gioca al vecchio campo, oltre il bosco. E il bosco è buio."]] };
  }
  boot();
})();
