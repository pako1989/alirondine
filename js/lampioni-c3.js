// js/lampioni-c3.js - LA NOTTE DEI LAMPIONI · Capitolo 3 «La notte più lunga»
// Con la fiammella madre si sale al vecchio campo, oltre il bosco: tre lampioni da accendere intorno al rettangolo d'erba,
// e le Ombre del 1952 che aspettano la partita della festa. La finale si gioca a Luci, al buio, fino all'alba.
// Al centro del campo c'è un lampione che nessuno ricordava: il tredicesimo. Si accende solo con tutti i fiammiferi antichi.
// Finali: L'ALBA DI SANLUME · LA LAMPIONAIA · LA SQUADRA DI TUTTI I TEMPI · (segreto) IL TREDICESIMO LAMPIONE.
(function () {
  "use strict";
  function boot() { const D = window.__lampioni; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);
    K.cast("nl_bambino52", { shape: "ombra", name: "L'Ombra senza numero", tag: "", skin: "#4a4a7a", eye: "#fff4c8", bg: ["#0a0a1a", "#ffd27a"], shirt: "#ffd27a" },
      "Un'ombra piccola, con una maglia senza numero. Era il magazziniere del Sanlume del 1952: portava i palloni, gonfiava le camere d'aria, e non è mai entrato in campo. Ogni anno guarda la partita dal bordo, dove una volta c'era un lampione.");
    K.cos("nl_c3", { kind: "acc", label: "Lanterna d'ottone", val: "medaglia", from: "Completa La Notte dei Lampioni" });
    K.cos("nl_alba", { kind: "shirt", label: "Maglia Alba di Sanlume", val: "#f0b87a", from: "Finale «L'alba di Sanlume»" });
    K.cos("nl_lampionaia", { kind: "acc", label: "Chiave dei lampioni", val: "chiave", from: "Finale «La lampionaia»" });
    K.cos("nl_ombre", { kind: "hairc", label: "Capelli Notte del '52", val: "#3a3a6a", from: "Finale «La squadra di tutti i tempi»" });
    K.cos("nl_tredici", { kind: "acc", label: "Aura del tredicesimo lampione", val: "#fff4c8", from: "Finale segreto «Il tredicesimo lampione»" });
    const ITEMZ = ["nl_borgo", "nl_bosco", "nl_campo"];
    function allMatches() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const goal = (s) => ({
      0: `Al vecchio campo, oltre il bosco (il sentiero in cima): accendi i tre lampioni intorno al campo con la fiammella madre (${K.lampsIn("nl_campo")}/3).`,
      1: "Il campo è acceso. Le Ombre aspettano: parla con il capitano Leandro.",
      2: "La partita è finita, l'alba è vicina. Parla con Leandro.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    const zones = {
      nl_campo: {
        region: "campo", name: "La Notte dei Lampioni · Il vecchio campo", short: "Il vecchio campo", sub: "Dove giocavano le Ombre del 1952", bg: "nl_campo", time: "notte", travel: [15, 20],
        w: 30, h: 22, start: [15, 20], items: [[2, 2], [27, 2], [2, 19]],
        buio: (k) => (k.F.is("nl_tredici") ? 0.35 : 0.8), heroLight: 2.8, luci: K.lampLights("nl_campo", (k) => (k.F.is("nl_tredici") ? [[15, 10, 9, "255,240,190"]] : [])),
        areas: [[5, 4, 24, 16, "Il vecchio campo"], [0, 0, 29, 21, "La collina"]], act: { v: "Torna nel bosco", Y: "Guarda il lampione senza numero", g: "Guarda la porta" },
        flavor: { g: "Una porta di legno, vecchia, con la rete fatta di corda da pescatori. Ci hanno giocato le Ombre, nel 1952. Ci giocano ancora, una notte all'anno." },
        intro: [["voce", "Il vecchio campo: un rettangolo d'erba alta in cima alla collina, due porte di legno, e tutto intorno il buio della notte e le luci del paese, laggiù."], ["voce", "Al centro del campo, un palo di ferro. Senza vetro, senza numero. Un lampione che nessuno ricorda di aver mai visto acceso."]],
        npcs: (s) => [{ id: "nl_leandro", at: [11, 13] }, { id: "nl_ombra1", at: [10, 8] }, { id: "nl_ombra2", at: [6, 10] }, { id: "nl_ombra3", at: [20, 8] }, { id: "nl_bambino52", at: [26, 17] }, { id: "nl_fiammetta", at: [12, 19] }, ...(F.is("nl_lucia_torna") ? [{ id: "nl_lucia", at: [18, 19] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t"); put(15, 21, "v"); lay(15, 17, 15, 20, ":");
          lay(5, 4, 24, 16, "-"); put(5, 9, "g"); put(5, 10, "g"); put(24, 9, "g"); put(24, 10, "g"); put(15, 10, "Y");
          [[3, 9], [26, 9], [15, 3]].forEach(([x, y]) => put(x, y, "U")); [[4, 3], [25, 3], [4, 18], [25, 19]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) { g.strokeStyle = "rgba(240,240,220,.35)"; g.lineWidth = 1.5; g.strokeRect(d.X(5) + 3, d.Y(4) + 3, 20 * 16 - 6, 13 * 16 - 6); g.beginPath(); g.moveTo(d.X(15) - 8, d.Y(4) + 3); g.lineTo(d.X(15) - 8, d.Y(17) - 3); g.stroke(); },
      },
    };
    function finale() {
      K.ownMatch(window.__luci.start, {
        oppStyle: "pressing", title: "Luci · la partita della festa contro le Ombre del 1952", us: "Sanlume", usColor: "#ffd27a", lanterns: 3, actions: 8,
        mates: [{ name: "Fiammetta" }, { name: F.is("nl_lucia_torna") ? "Lucia" : "Tobia" }], opp: { name: "Le Ombre del '52", color: "#6a7ab8" },
        intro: "<p>La partita della festa, fino all'alba. Le Ombre del 1952 giocano in pressing: si fanno vedere solo nella luce. Tre lanterne per azione, otto azioni.</p>", winTitle: "SANLUME HA VINTO LA NOTTE!",
        done: (r) => {
          if (!r.win) return K.scene([["nl_leandro", "[ride] Abbiamo vinto noi, per una volta in settant'anni! Ma la notte è lunga: rigiochiamo? Ancora una. Le Ombre non si stancano mai."]], () => K.enterZone("nl_campo"), "nl_campo");
          setStep(N, 2); bond("ombre", 2);
          K.scene([["voce", "L'ultimo gol, nel buio, si sente prima di vederlo: il pallone che tocca la rete di corda, e tutte le Ombre che esultano senza rumore."], ["nl_leandro", "[felice] Questa sì che è una partita! Quasi come quella del '52. Anzi, meglio: stavolta c'era la luce, e vi abbiamo visti in faccia."], ["voce", "Sopra la collina, il cielo comincia a schiarire. Le Ombre si guardano. È quasi l'alba."]], () => K.enterZone("nl_campo"), "nl_campo");
        },
      });
    }
    function endingAsk() {
      const opts = [{ label: "«È l'alba. Ci vediamo l'anno prossimo»", sub: "L'alba di Sanlume", big: true, fn: () => ending("alba") }];
      if (st("luce") >= 12) opts.push({ label: "«Fiammetta, i lampioni hanno bisogno di te»", sub: "La lampionaia", big: true, fn: () => ending("fiammetta") });
      if (st("ombre") >= 10) opts.push({ label: "«Restate. Una notte al mese, a giocare con noi»", sub: "La squadra di tutti i tempi", big: true, fn: () => ending("ombre") });
      if (F.is("nl_tredici")) opts.unshift({ label: "Il tredicesimo lampione brilla sul campo…", sub: "Segreto: tutti i fiammiferi e tutti i lampioni", cls: "hot", big: true, fn: () => ending("tredicesimo") });
      ask("nl_leandro", "(Il cielo è color pesca, sopra la collina. Le Ombre diventano trasparenti, piano piano.) Ci siamo. Ogni anno, a quest'ora, torniamo nel buio. Ma quest'anno… (guarda i lampioni accesi) …quest'anno è diverso.\n\nDimmi tu, che hai acceso la strada.", opts, "nl_alba");
    }
    function ending(kind) {
      const R2 = { alba: { coins: 120, cos: ["nl_c3", "nl_alba"] }, fiammetta: { coins: 130, cos: ["nl_c3", "nl_lampionaia"] }, ombre: { coins: 130, cos: ["nl_c3", "nl_ombre"] }, tredicesimo: { coins: 200, cos: ["nl_c3", "nl_tredici"] } }[kind];
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        alba: [["voce", "Il sole sorge sulla collina. I lampioni si spengono da soli, uno dopo l'altro, come candele dopo una torta. Le Ombre salutano dal bordo del campo e diventano luce."], ["nl_leandro", "[felice] L'anno prossimo, stessa notte, stessa ora. Tenete accesa la strada."], ["voce", "<b>FINALE · L'ALBA DI SANLUME.</b> E quando la sindaca propone i lampioni nuovi, a luce bianca, tutto il paese vota contro. All'unanimità. Anche lei."]],
        fiammetta: [["nl_fiammetta", "[sorpreso] Io? La lampionaia? (Guarda la lanterna, poi le sue mani.) …Nonna diceva che bisogna avere «la mano». (Ride.) Forse la mano viene accendendo."], ["voce", "<b>FINALE · LA LAMPIONAIA.</b> Ogni sera, al tramonto, Fiammetta fa il giro dei dodici lampioni con la lanterna della nonna. Anche quando non serve. Soprattutto quando non serve."]],
        ombre: [["nl_leandro", "[ride] Una notte al mese? Abbiamo un calendario pieno, sai: settant'anni di nulla. (Le Ombre esultano senza rumore.) Affare fatto."], ["voce", "<b>FINALE · LA SQUADRA DI TUTTI I TEMPI.</b> Il primo venerdì del mese, al vecchio campo, si gioca. Leandro insegna i dribbling del '52. I vivi gli insegnano a fare il selfie. Non gli riesce: nelle foto non viene."]],
        tredicesimo: [["voce", "I fiammiferi antichi che hai raccolto in tutto il paese si accendono da soli, nella tua tasca, e volano al centro del campo. Il lampione senza numero si accende. Una luce bianca e calda, grande come l'alba."], ["nl_bambino52", "[sorpreso] Il… il mio lampione. Era qui che aspettavo, nel '52, con i palloni. Nessuno mi ha mai chiamato in campo."], ["nl_leandro", "[felice] E allora entra, ragazzo. Numero tredici. Ti abbiamo aspettato settant'anni."], ["voce", "<b>FINALE SEGRETO · IL TREDICESIMO LAMPIONE.</b> La squadra del 1952, per la prima volta, è al completo. Gioca l'ultima azione della notte, e il magazziniere segna. Di testa. Poi, all'alba, se ne vanno tutti insieme."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "nl_alba");
    }
    const talk = {
      nl_leandro() {
        const s = S();
        if (s === 0) return say([["nl_leandro", `Il campo è buio, e noi siamo pronti. Accendi i tre lampioni intorno al campo con la fiammella madre (${K.lampsIn("nl_campo")}/3), e si comincia.`]]);
        if (s === 1) return ask("nl_leandro", "Le luci sono accese, le Ombre sono in campo. La partita della festa, come ogni anno, fino all'alba. Pronti?", [{ label: "Gioca la partita della festa", sub: "Luci · contro le Ombre del '52", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "nl_campo");
        if (s === 2) return endingAsk();
        return say([["nl_leandro", "[felice] Grazie della luce, accenditore."]]);
      },
      nl_bambino52() { return say([["nl_bambino52", F.is("nl_tredici") ? "[felice] Il mio lampione è acceso! Mi vedono tutti! (Fa un palleggio. Il pallone gli passa attraverso. Ride lo stesso.)" : "(Guarda la partita dal bordo del campo, con un pallone in mano.) Io portavo i palloni. Non sono mai entrato in campo. C'era un lampione, qui, una volta. Era il mio posto. Adesso è buio."]]); },
      nl_fiammetta() { return say([["nl_fiammetta", "[felice] Guarda le Ombre! Nonna aveva ragione su tutto. (Sottovoce.) Anche sul fatto che io ho «la mano». Non dirglielo."]]); },
      nl_lucia() { return say([["nl_lucia", "[furbo] Al vecchio campo, alla mia età. Il gatto è rimasto a casa: dice che le Ombre gli fanno il solletico."]]); },
      nl_ombra1() { return say([["nl_ombra1", "Stasera marco solo gente. Niente alberi. Promesso."]]); },
      nl_ombra2() { return say([["nl_ombra2", "Se tiri, non tirare sulle lucciole. Mi tuffo per abitudine."]]); },
      nl_ombra3() { return say([["nl_ombra3", "Pronto a correre! Ma dritto, stavolta. Dritto."]]); },
    };
    const obj = {
      "nl_bosco:^": () => (F.is("nl_fiammella") ? go("nl_campo", 15, 20) : say([["voce", "Oltre è buio pesto. Senza la fiammella madre non si va."]])), "nl_campo:v": () => go("nl_bosco", 17, 1),
      "nl_campo:Y": () => {
        if (F.is("nl_tredici")) return say([["voce", "Il tredicesimo lampione brilla di una luce bianca e calda, grande come l'alba."]]);
        if (allMatches() && F.is("nl_fiammella")) { F.set("nl_tredici", true); bond("luce", 2); K.refreshZone(); return K.scene([["voce", "I fiammiferi antichi che hai raccolto in tutto il paese si accendono da soli nella tua tasca e volano verso il palo senza numero. Il tredicesimo lampione si accende."], ["voce", "Tutto il campo si illumina, come se fosse già giorno. Dal bordo, un'ombra piccola con una maglia senza numero alza la testa."]], done, "nl_campo"); }
        return say([["voce", "Un palo di ferro, senza vetro, senza numero. Nonna Lucia ha detto che si accende solo quando tutti i fiammiferi antichi del paese tornano insieme. (Ne servono di tutte le zone: piazza, bosco e campo.)"]]);
      },
    };
    const check3 = () => { if (S() === 0 && K.lampsIn("nl_campo") >= 3) { setStep(N, 1); K.refreshZone(); say([["voce", "Il terzo lampione si accende. Il vecchio campo appare tutto, verde e argento. Le Ombre si mettono in fila, a centrocampo, e aspettano te."]]); } };
    zones.nl_campo.tick = () => check3();
    return { n: N, title: "La notte più lunga", sub: "Il vecchio campo, la partita della festa, l'alba", goal, start: "nl_bosco", introBg: "nl_campo", zones, talk, obj,
      intro: () => [["voce", "<b>LA NOTTE DEI LAMPIONI</b>, capitolo 3. Con la fiammella madre nel barattolo, il sentiero del bosco si apre fino in cima alla collina. Lassù c'è il vecchio campo. E lassù aspettano le Ombre."]] };
  }
  boot();
})();
