// js/trono-c3.js - IL TRONO DI CUOIO · Capitolo 3 «Il Torneo del Trono»
// Il campo del Torneo, sotto le sette torri di Altavalle. Una semifinale contro Gelaneve (la modalità la scegli tu), poi la
// finale al Concilio contro la reggente Ottavia Ferroquercia, che tradisce ogni patto che firma. Chi vince tocca il Trono.
// Finali: IL TRONO DI CUOIO · OLTRE LA BARRIERA DI GHIACCIO · LA REPUBBLICA DELLE SQUADRE · (segreto) IL TRONO DI NESSUNO.
(function () {
  "use strict";
  function boot() { const D = window.__trono; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, go } = K;
    const N = 3, S = () => K.stepOf(N), C = K.CASATE;
    K.cast("tc_araldo", { acc: ["fischietto"], name: "L'araldo del Torneo", tag: "", hair: "#8a5a2a", style: "ordinato", skin: "#e8c4a0", eye: "#3a3a3a", bg: ["#2a1a0c", "#ffd27a"], shirt: "#c8a050" },
      "L'araldo del Torneo del Trono: annuncia le squadre, i patti e i gol con la stessa voce, solenne e un po' nasale. Ha una tromba d'ottone che suona solo il do.");
    K.cos("tc_c3", { kind: "acc", label: "Corona di cuoio", val: "corona", from: "Completa Il Trono di Cuoio" });
    K.cos("tc_trono", { kind: "shirt", label: "Mantello del Trono", val: "#8a5a2a", from: "Finale «Il Trono di Cuoio»" });
    K.cos("tc_barriera", { kind: "hairc", label: "Capelli Brina", val: "#e8f0f8", from: "Finale «Oltre la Barriera di Ghiaccio»" });
    K.cos("tc_repubblica", { kind: "acc", label: "Fascia della Lega delle Casate", val: "fascia", from: "Finale «La repubblica delle squadre»" });
    K.cos("tc_nessuno", { kind: "shirt", label: "Maglia di cuoio cucito", val: "#c8a050", from: "Finale segreto «Il Trono di nessuno»" });
    K.cos("tc_sigilli3", { kind: "acc", label: "Piuma di corvo", val: "medaglia", from: "Trova tutti i sigilli di cera del campo del Torneo" });
    const ITEMZ = ["tc_rocca", "tc_capitale", "tc_arena"];
    function allSeals() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const clean = () => !(+F.get("tc_tradimenti", 0)) && !F.is("tc_venduto_ardo");
    const goal = (s) => ({
      0: "Il Torneo del Trono è cominciato. L'araldo, al centro del campo, annuncia la semifinale.",
      1: "La finale: la reggente Ottavia aspetta al tavolo del Concilio, davanti alle tribune.",
      2: "Hai vinto il Torneo. Il Trono di Cuoio ti aspetta nel palazzo, in alto.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    const zones = {
      tc_arena: {
        region: "arena", name: "Il Trono di Cuoio · Il campo del Torneo", short: "Il campo del Torneo", sub: "Sotto le sette torri di Altavalle", bg: "tc_arena", time: "giorno", travel: [15, 19],
        w: 32, h: 22, start: [15, 19], itemCos: "tc_sigilli3", items: [[2, 2], [29, 2], [29, 19]],
        banners: { "4,5": "tasso", "8,5": "corvonero", "12,5": "salmastra", "19,5": "rovoardente", "23,5": "gelaneve", "27,5": "pietrabruna", "4,17": "ferroquercia", "27,17": "ferroquercia", def: "ferroquercia" },
        areas: [[6, 8, 25, 15, "Il campo del Torneo"], [0, 0, 31, 21, "Il Torneo del Trono"]],
        flavor: { t: "Un olmo antico. Da qui, dicono, il primo re guardò la prima partita, e decise che il pallone meritava un trono." },
        intro: [["voce", "Il campo del Torneo del Trono. Tribune di legno piene fino all'ultimo posto, sette stendardi che sventolano, e un'aria che sa di erba tagliata e di cera calda. Al centro, un tavolo con le candele: il tavolo del Concilio."], ["voce", "In cima, oltre le tribune, la porta del palazzo. Dentro, il Trono di Cuoio aspetta. Come ogni sette anni, aspetta qualcuno."]],
        npcs: (s) => [
          { id: "tc_araldo", at: [15, 11] }, ...(s === 1 ? [{ id: "tc_ottavia", at: [18, 11] }] : []),
          { id: F.is("tc_brunilde_alleata") ? "tc_brunilde" : "tc_gualtiero", at: [10, 17] }, { id: "tc_ysolde", at: [22, 17] },
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 21, 31, 21, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a");
          lay(5, 7, 26, 16, ":"); lay(6, 8, 25, 15, "+"); lay(15, 4, 15, 20, ":");
          house(12, 1, 7, 3, { door: [15, 3], roof: "#8a6a1a", wall: "#d8c8a8", rr: 2, enter: { to: "tc_trono", at: [10, 10] } });
          Object.keys({ "4,5": 1, "8,5": 1, "12,5": 1, "19,5": 1, "23,5": 1, "27,5": 1, "4,17": 1, "27,17": 1 }).forEach((k) => { const [x, y] = k.split(",").map(Number); put(x, y, "Q"); });
          [[2, 9], [29, 9], [2, 14], [29, 14], [7, 2], [24, 2]].forEach(([x, y]) => put(x, y, "t")); put(13, 19, "s");
        },
      },
      tc_trono: {
        interior: true, region: "casa", name: "Il Trono di Cuoio · La sala del Trono", short: "La sala del Trono", sub: "Dove si siede chi vince", bg: "tc_trono", w: 20, h: 13, start: [10, 10], outside: ["tc_arena", 15, 4],
        banners: { "3,1": "tasso", "5,1": "corvonero", "7,1": "salmastra", "13,1": "rovoardente", "15,1": "gelaneve", "17,1": "pietrabruna", def: "ferroquercia" },
        act: { L: "Guarda gli archivi", v: "Esci" },
        flavor: { L: "L'albo d'oro del Torneo: settanta nomi di casate, uno ogni sette anni. In fondo, una riga vuota. L'inchiostro è già pronto." },
        intro: [["voce", "La sala del Trono: alta, silenziosa, piena di polvere d'oro. In fondo, su tre gradini, il Trono di Cuoio: uno schienale alto cucito a esagoni, come un pallone antico. Sembra che respiri."]],
        npcs: (s) => (s >= 2 ? [{ id: "tc_ysolde", at: [15, 7] }, { id: F.is("tc_brunilde_alleata") ? "tc_brunilde" : "tc_gualtiero", at: [5, 7] }] : []),
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(8, 3, 12, 4, ":"); put(10, 3, "Y"); [3, 5, 7, 13, 15, 17].forEach((x) => put(x, 1, "Q")); lay(1, 9, 2, 9, "L"); },
      },
    };
    function semifinal() { // partita secondaria: la modalità la scegli tu
      K.playMatch({ id: "tc_semi", alt: "az,cage,hd", force: false, oppTeam: "Casa Gelaneve", oppColor: C.gelaneve.c, mate: F.is("tc_brunilde_alleata") ? "Brunilde" : "Ser Gualtiero", us: "Casa Tasso", homeKit: [C.tasso.c, C.tasso.c2], chap: "Il Trono di Cuoio · La semifinale", bg: "tc_arena", oppNames: ["Inverno", "Brina", "Gelo", "Tormenta", "Nevischio"], intro: "Semifinale del Torneo del Trono: Casa Tasso contro Casa Gelaneve, che gioca come si gioca al nord. Lento, preciso, senza mai smettere.",
        done: (r) => {
          if (!r.win) return K.scene([["tc_araldo", "Casa Gelaneve vince la semifinale! (Abbassa la tromba.) …Ma il regolamento del Torneo concede una rivincita a chi ha un patto firmato con l'araldo. Voi ce l'avete. Io lo firmo adesso."]], () => K.enterZone("tc_arena"), "tc_arena");
          setStep(N, 1); K.refreshZone();
          K.scene([["tc_araldo", "(Do. Do. Do.) Casa Tasso in finale! Contro… (abbassa la voce) …contro la reggente. Al Concilio. Come vuole la tradizione."], ["voce", "Ser Inverno ti stringe la mano. Ha la mano fredda e lo sguardo caldo. «Il nord tifa per te», dice. «Il nord non tifa mai.»"]], () => K.enterZone("tc_arena"), "tc_arena");
        } });
    }
    function final() {
      K.concilio({ title: "La finale · il Concilio contro Casa Ferroquercia", us: F.is("tc_riconosciuto") ? "Casa Tasso" : "Il figlio senza nome", opp: { name: "Casa Ferroquercia", color: C.ferroquercia.c, sigil: C.ferroquercia.s, honor: 0.3 }, oppStyle: "pressing",
        cards: ["centro", "sinistra", "destra", "tregua", "ostaggio"], ravens: 1 + (F.is("tc_corvo") ? 1 : 0) + (F.is("tc_ysolde_patto") ? 2 : 0), spied: F.is("tc_ysolde_patto"), foresee: F.is("tc_ysolde_patto"), turns: 10, winTitle: "IL TORNEO DEL TRONO È VOSTRO",
        intro: `<p>La finale del Torneo del Trono, dieci turni. La reggente firma tutto quello che le proponi, con un sorriso. Poi tradisce.${F.is("tc_ysolde_patto") ? " Ma hai la piuma di Ysolde: in difesa, <b>le piume ti dicono dove tradirà</b>." : " L'<b>ostaggio d'onore</b> è l'unica carta che la punisce davvero: serve credibilità 6."}</p>` }, (r) => {
        if (!r.win) return K.scene([["tc_ottavia", "[furbo] Peccato. (Si sistema la corona.) Sette anni sono lunghi, ma passano. Ritenta, figlio senza nome: il Concilio è sempre aperto a chi vuole perdere."]], () => K.enterZone("tc_arena"), "tc_arena");
        setStep(N, 2); bond("onore", 2); if (r.data.traditi) bond("intrighi", r.data.traditi);
        K.scene([["voce", "L'ultimo turno. L'ultimo attacco. Il pallone entra, e per un attimo le tribune non respirano. Poi esplodono."], ["tc_ottavia", r.data.traditi ? "[arrabbiato] Ho rotto ogni patto. Ogni patto! E ho perso. (Si toglie la corona, la guarda, e per la prima volta in sette anni non sorride.) …Va'. Il Trono è tuo. Vediamo se ci riesci, tu, a non rompere niente." : "[sorpreso] Non ho nemmeno avuto il tempo di tradire. (Si toglie la corona.) Il Trono è tuo. Vai. Ti aspetta."], ["tc_araldo", "(DO!) Casa Tasso vince il Torneo del Trono! Il vincitore salga al palazzo!"]], () => go("tc_trono", 10, 10), "tc_arena");
      });
    }
    function endingAsk() {
      const opts = [{ label: "Siediti sul Trono di Cuoio", sub: "Il Trono", big: true, fn: () => ending("trono") }];
      if (F.is("tc_barriera")) opts.push({ label: "«Il Trono può aspettare. Andiamo a nord»", sub: "Oltre la Barriera di Ghiaccio", big: true, fn: () => ending("barriera") });
      if (K.cred() >= 7) opts.push({ label: "«Nessuno siederà qui. Sette sedie uguali»", sub: "La repubblica delle squadre", big: true, fn: () => ending("repubblica") });
      if (clean() && allSeals()) opts.unshift({ label: "Prendi l'ago del cuoiaio e scuci il Trono…", sub: "Segreto: nessun patto tradito e tutti i sigilli", cls: "hot", big: true, fn: () => ending("nessuno") });
      ask("voce", "(Il Trono di Cuoio è davanti a te. Il cuoio è caldo, come un pallone dopo una partita. Tutta Valdoro, da fuori, aspetta di sapere cosa farai.)", opts, "tc_trono");
    }
    function ending(kind) {
      const R = { trono: { coins: 120, cos: ["tc_c3", "tc_trono"] }, barriera: { coins: 140, cos: ["tc_c3", "tc_barriera"] }, repubblica: { coins: 140, cos: ["tc_c3", "tc_repubblica"] }, nessuno: { coins: 250, cos: ["tc_c3", "tc_nessuno"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 5); if (kind === "nessuno") { F.set("tc_scucito", true); K.refreshZone(); }
      const lines = {
        trono: [["voce", "Ti siedi. Il Trono di Cuoio scricchiola come un pallone vecchio, e per un attimo ti sembra di sentire il rumore della prima partita della storia."], ["tc_ysolde", "[furbo] Sette anni di regno. (Un corvo le si posa sul braccio.) Ricordati del favore. Io me lo ricordo già."], ["voce", "<b>FINALE · IL TRONO DI CUOIO.</b> Per sette anni Valdoro gioca secondo le tue regole. La prima che scrivi: «Chi perde pulisce le stalle». Lord Ubaldo, a Rocca Tasso, ride per la prima volta in vent'anni."]],
        barriera: [["voce", "Lasci il Trono vuoto, sotto il suo drappo. Il giorno dopo, sette squadre partono verso nord, dietro allo stendardo di Gelaneve."], ["tc_inverno", "[felice] (In cima alla Barriera, il vento ti porta le grida di una partita che dura da trecento anni.) Eccoli. Undici, da soli, da sempre. Da oggi non più."], ["voce", "<b>FINALE · OLTRE LA BARRIERA DI GHIACCIO.</b> Le sette casate scendono sul campo bianco e danno il cambio alla squadra del nord. L'inverno resta dall'altra parte. Per la prima volta, nessuno è solo a giocare contro di lui."]],
        repubblica: [["voce", "Non ti siedi. Prendi il drappo e copri il Trono, piano, come si copre un mobile in una casa che si chiude."], ["tc_ardo", "[felice] Sette sedie uguali. (Incide una pietra: «LEGA DI VALDORO».) Questa è una parola che sottoscrivo."], ["voce", "<b>FINALE · LA REPUBBLICA DELLE SQUADRE.</b> Il Trono di Cuoio va in un museo. Al suo posto, un tavolo rotondo: Valdoro diventa una lega, con un calendario, un campionato, e un Consiglio che litiga ogni lunedì. Ma litiga parlando."]],
        nessuno: [["voce", "Prendi l'ago del cuoiaio di corte. Trovi il primo punto della cucitura, quello più vecchio, e tiri. Il Trono non oppone resistenza: sembra che aspettasse soltanto questo."], ["voce", "Ci vuole tutta la notte. All'alba, sui gradini, ci sono sette palloni di cuoio antico, cuciti a mano, uno per ogni casata."], ["tc_ysolde", "[sorpreso] (Per la prima volta in vita sua, Lady Ysolde non sa cosa dire. Poi prende il suo pallone, e lo calcia, forte, contro il muro.) …Noi non sapevamo. Questo, non lo sapevamo."], ["voce", "<b>FINALE SEGRETO · IL TRONO DI NESSUNO.</b> Non c'è più un trono da vincere. Ci sono sette palloni, e un campo. Il primo pallone della storia torna a fare quello per cui era nato: rotolare."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "tc_trono");
    }
    const talk = {
      tc_araldo() {
        if (S() === 0) return ask("tc_araldo", "(Do!) Semifinale del Torneo del Trono: Casa Tasso contro Casa Gelaneve! Si gioca senza Concilio, come vuole la tradizione delle semifinali. Il campo lo scegliete voi.", [{ label: "Gioca la semifinale", sub: "Partita secondaria · scegli tu la modalità", cls: "hot", fn: semifinal }, { label: "Non ancora", fn: done }], "tc_arena");
        return say([["tc_araldo", S() >= 2 ? "(Do!) Il vincitore salga al palazzo! (Do!) …Scusa, mi è scappato." : "(Do.) La finale è al tavolo del Concilio. La reggente ha già firmato tre patti con sé stessa, per allenarsi."]]);
      },
      tc_ottavia() {
        if (S() === 1) return ask("tc_ottavia", "[felice] Eccoti. (Accende le candele del tavolo, una dopo l'altra.) La finale. Firmerò tutto quello che mi porgi, figlio senza nome. Sai già cosa farò dopo. Lo sanno tutti.\n\nSiediti.", [{ label: "Siedi al tavolo della finale", sub: "Il Concilio · la reggente tradisce", cls: "hot", fn: final }, { label: "Non ancora", fn: done }], "tc_arena");
        return say([["tc_ottavia", "[furbo] Al tavolo, quando vuoi."]]);
      },
      tc_ysolde() { return say([["tc_ysolde", S() >= 2 ? "[pensa] Il Trono ti aspetta. Ma i troni aspettano tutti, sai? Anche quelli che non ci si siedono." : F.is("tc_ysolde_patto") ? "[furbo] Guarda le piume, in difesa. Dove si muovono, lì tradirà." : "Noi sappiamo. Ma oggi preferisco guardare."]]); },
      tc_gualtiero() { return say([["tc_gualtiero", S() >= 2 ? "[felice] (Si asciuga gli occhi con il guanto.) Il ragazzo del cortile. Sul Trono. O davanti. Comunque sia, ragazzo: testa alta." : "[ride] Ti ho insegnato a tirare in porta, non a firmare patti. Ma vedo che hai imparato da solo."]]); },
      tc_brunilde() { return say([["tc_brunilde", S() >= 2 ? "[felice] Fratello. (Lo dice davanti a tutti.) Qualunque cosa farai lassù, Casa Tasso è con te." : "[pensa] Io tengo lo stendardo. Tu vinci. Facile, no?"]]); },
    };
    const obj = {
      "tc_trono:Y": () => {
        if (S() >= 2 && S() < 5) return endingAsk();
        if (F.is("tc_scucito")) return say([["voce", "Al posto del Trono, sette palloni di cuoio antico. Uno manca: l'hai calciato tu, stamattina, giù per le scale."]]);
        return say([["voce", S() >= 5 ? "Il Trono di Cuoio. Ha visto settanta casate e settanta finali. Ora ha visto anche la tua." : "Il Trono di Cuoio, sotto il suo drappo. Una guardia ti sbarra la strada: «Solo chi vince il Torneo può toccarlo»."]]);
      },
    };
    return { n: N, title: "Il Torneo del Trono", sub: "La semifinale, la finale al Concilio, il Trono", goal, start: "tc_arena", introBg: "tc_arena", zones, talk, obj,
      intro: () => [["voce", "<b>IL TRONO DI CUOIO</b>, capitolo 3. Il giorno del Torneo. Altavalle si sveglia con sette stendardi in ogni strada e una sola domanda: chi siederà sul Trono, stavolta?"]] };
  }
  boot();
})();
