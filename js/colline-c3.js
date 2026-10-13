// js/colline-c3.js - MASTER LEAGUE DELLE COLLINE · Capitolo 3 «Lo spareggio»
// Fine stagione. Lo Stadio delle Colline, l'unico con le tribune vere. Prima la Coppa del Vino (due partite a scelta,
// contro Monteroso e San Gallo), poi lo spareggio per la Serie Collina contro l'Atletico Valfonda.
// Finali: SERIE COLLINA · LA SQUADRA DEL PAESE · IL RITORNO DEL MAGO · (segreto) IL TRIPLETE DELLE COLLINE.
(function () {
  "use strict";
  function boot() { const D = window.__colline; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cos("ml_c3", { kind: "acc", label: "Coppa della Serie Collina", val: "corona", from: "Completa Master League delle Colline" });
    K.cos("ml_promozione", { kind: "shirt", label: "Maglia della promozione", val: "#3a8a4a", from: "Finale «Serie Collina»" });
    K.cos("ml_paese", { kind: "acc", label: "Sciarpa del paese", val: "sciarpa", from: "Finale «La squadra del paese»" });
    K.cos("ml_mago", { kind: "hairc", label: "Capelli Gesso", val: "#e8e8e0", from: "Finale «Il ritorno del Mago»" });
    K.cos("ml_triplete", { kind: "shirt", label: "Maglia del Triplete", val: "#c8a050", from: "Finale segreto «Il Triplete delle Colline»" });
    K.cos("ml_fig3", { kind: "hairc", label: "Capelli Uva Nera", val: "#3a1a3a", from: "Trova tutte le figurine rare dello Stadio delle Colline" });
    const ITEMZ = ["ml_colle", "ml_citta", "ml_stadio"];
    function allFig() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const tutteBattute = () => ["pietrafitta", "borgofiera", "valfonda", "monteroso", "sangallo"].every((t) => F.is("ml_battuta_" + t));
    const goal = (s) => ({
      0: "Lo Stadio delle Colline. Il Mago Pino è qui: ha chiuso il bar per un giorno.",
      1: `La Coppa del Vino: Monteroso e San Gallo (${["monteroso", "sangallo"].filter((t) => F.is("ml_battuta_" + t)).length}/2, facoltative). Lo spareggio con la Valfonda: dal Cavalier Ottone, in tribuna.`,
      2: "Lo spareggio è finito. La Contessa scende dalla tribuna.",
    }[s] || "La stagione è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    const zones = {
      ml_stadio: {
        region: "colle", name: "Master League delle Colline · Lo Stadio delle Colline", short: "Lo Stadio delle Colline", sub: "Lo spareggio per la Serie Collina", bg: "ml_stadio", time: "tramonto", travel: [15, 19],
        w: 30, h: 22, start: [15, 19], itemCos: "ml_fig3", items: [[2, 2], [27, 2], [27, 19]],
        areas: [[5, 7, 24, 15, "Il campo"], [0, 0, 29, 21, "Lo Stadio delle Colline"]],
        flavor: { t: "Un pino marittimo dietro la curva. Sopra, tre ragazzi del paese: dicono che da lì si vede meglio. Ed è gratis." },
        intro: [["voce", "Lo Stadio delle Colline: tribune di legno, bandiere di sei paesi, un campo piatto. Piatto! I ragazzi della Colle Alto lo guardano con diffidenza: senza salita, dicono, non sembra calcio."], ["voce", "In tribuna d'onore, il Cavalier Ottone. Accanto, la Contessa Bice, con il ventaglio. Si salutano. Non si sorridono."]],
        npcs: (s) => [{ id: "ml_pino", at: [12, 17] }, ...(s <= 1 ? [{ id: "ml_ottone", at: [20, 4] }] : []), ...(!F.is("ml_ceduto_marta") ? [{ id: "ml_marta", at: [9, 12] }] : []), { id: "ml_rino", at: [20, 12] }, ...(s >= 1 ? [{ id: "ml_fiera", at: [24, 17] }] : []), ...(s >= 2 ? [{ id: "ml_bice", at: [15, 12] }] : [{ id: "ml_bice", at: [14, 4] }])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(3, 2, 26, 3, "a"); lay(1, 18, 28, 19, ":"); lay(15, 16, 15, 17, ":"); lay(13, 4, 22, 5, "+"); lay(15, 6, 15, 6, ":");
          put(5, 11, "Q"); put(24, 11, "Q");
          [[2, 8], [27, 8], [2, 14], [27, 14]].forEach(([x, y]) => put(x, y, "t")); put(10, 18, "s");
        },
      },
    };
    function coppa(team) { // la Coppa del Vino: partite secondarie, la modalità la scegli tu
      const T = K.TEAMS[team];
      K.playMatch({ id: "ml_coppa_" + team, alt: "az,cage,hd", force: false, oppTeam: T.n, oppColor: T.c, mate: F.is("ml_ceduto_marta") ? "Rino Corriera" : "Marta Fiore", squad: ["Bepi Sasso", "Gigio Ruota", "Rino Corriera"], us: "U.S. Colle Alto", homeKit: ["#2a6a3a", "#f4ecd8"], chap: "Master League delle Colline · Coppa del Vino contro " + T.n, bg: "ml_stadio", intro: `La Coppa del Vino, il trofeo più antico delle colline: una botte d'argento. ${T.n} gioca a ${(window.__lavagna && window.__lavagna.INSTR[T.instr] ? window.__lavagna.INSTR[T.instr][0] : T.instr).toLowerCase()}.`,
        done: (r) => {
          if (r.win) { F.set("ml_battuta_" + team, true); F.set("ml_res_" + team, "v"); bond("paese", 1); }
          K.scene([["voce", r.win ? `Vittoria in Coppa del Vino contro ${T.n}!${["monteroso", "sangallo"].every((t) => F.is("ml_battuta_" + t)) ? " La botte d'argento è della Colle Alto. Il Mago Pino la riempie di vino rosso e la fa girare per tutta la tribuna." : ""}` : `${T.n} passa il turno. La Coppa del Vino, a Colle Alto, aspetterà un altro anno. (Si può rigiocare.)`]], () => K.enterZone("ml_stadio"), "ml_stadio");
        } });
    }
    function spareggio() {
      K.lavagna({ title: "Lavagna Tattica · Lo spareggio per la Serie Collina", oppId: "valfonda", opp: { name: K.TEAMS.valfonda.n, color: K.TEAMS.valfonda.c, ovr: 73, instr: F.is("ml_battuta_valfonda") ? "contropiede" : "pressing", style: "pressing" }, scout: true,
        intro: `<p>Lo spareggio. Il Cavalier Ottone ha comprato due giocatori nuovi, apposta. ${F.is("ml_battuta_valfonda") ? "E dopo la sconfitta alla fiera, il loro allenatore ha cambiato: niente più pressing, adesso giocano in <b>contropiede</b>." : "Giocano in <b>pressing alto</b>, come sempre."}</p>${F.is("ml_ceduto_marta") ? "<p>In campo, con la maglia rossa della Valfonda, c'è Marta Fiore.</p>" : ""}`, winTitle: "SERIE COLLINA!" }, (r) => {
        if (!r.win) return K.scene([["ml_ottone", "[ride] Lo spareggio è della Valfonda. (Si sistema il garofano.) Il regolamento prevede la ripetizione in caso di… be', di quello che vuole lei, Mister. Ci rivediamo in campo."]], () => K.enterZone("ml_stadio"), "ml_stadio");
        setStep(N, 2); F.set("ml_battuta_valfonda", true); bond("fiducia", 2); bond("paese", 2);
        K.scene([["voce", `Fischio finale: ${r.a} a ${r.b}. L'U.S. Colle Alto, ultima in classifica a ottobre, sale in Serie Collina. Sulle colline, uno dopo l'altro, suonano tutti i campanili. Anche quello della Valfonda, per sbaglio.`], ["ml_ottone", "[sorpreso] (Il garofano gli cade, e stavolta lo calpesta.) …Quanto vuole per lei stesso, Mister? (Nessuno gli risponde.)"]], () => K.enterZone("ml_stadio"), "ml_stadio");
      });
    }
    function endingAsk() {
      const opts = [{ label: "«Serie Collina!»", sub: "La promozione", big: true, fn: () => ending("promozione") }];
      if (K.comprati() <= 1 && K.stat("paese") >= 6) opts.push({ label: "«È la vittoria del paese»", sub: "La squadra del paese", big: true, fn: () => ending("paese") });
      if (K.stat("fiducia") >= 4 && F.is("ml_pino_ascoltato")) opts.push({ label: "«Mago, torna in panchina con me»", sub: "Il ritorno del Mago", big: true, fn: () => ending("mago") });
      if (tutteBattute() && allFig()) opts.unshift({ label: "La Contessa apre una vetrina con tre trofei…", sub: "Segreto: tutte le squadre battute e tutte le figurine rare", cls: "hot", big: true, fn: () => ending("triplete") });
      ask("ml_bice", "(Scende dalla tribuna, il ventaglio chiuso.) Mister. Quindici allenatori in quarant'anni. Lei è il primo che non se n'è andato da solo. (Pausa.) E adesso che si fa?", opts, "ml_stadio");
    }
    function ending(kind) {
      const R = { promozione: { coins: 120, cos: ["ml_c3", "ml_promozione"] }, paese: { coins: 140, cos: ["ml_c3", "ml_paese"] }, mago: { coins: 140, cos: ["ml_c3", "ml_mago"] }, triplete: { coins: 250, cos: ["ml_c3", "ml_triplete"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        promozione: [["ml_bice", "[felice] Serie Collina. (Apre il ventaglio. Lo richiude. Ti abbraccia, davanti a tutti.) Offro io. Non succedeva dal 1978."], ["voce", "<b>FINALE · SERIE COLLINA.</b> La Colle Alto è promossa. Il campanile suona per un'ora, la corriera di Rino fa tre giri del paese suonando il clacson, e la Contessa paga da bere a tutti. Il Mago Pino, al bar, appende il tovagliolo dello spareggio accanto a quello del '78."]],
        paese: [["voce", "Il fornaio, il sacrestano, il meccanico, la fiorista, l'autista della corriera: promossi senza comprare nessuno. Il paese entra in campo e li porta in trionfo."], ["ml_rino", "[ride] Sulla corriera! Tutti sulla corriera! Guido io, ovviamente."], ["voce", "<b>FINALE · LA SQUADRA DEL PAESE.</b> Nella Lega delle Colline lo raccontano ancora: la squadra più povera, fatta solo con la gente di Colle Alto, che batte i trattori del Cavalier Ottone."]],
        mago: [["ml_pino", "[sorpreso] In panchina? Io? (Si guarda le mani. C'è ancora il gesso sulle dita.) Sono trent'anni che… (Ride.) Va bene. Ma il caffè lo porto io. Il vostro è imbevibile."], ["voce", "<b>FINALE · IL RITORNO DEL MAGO.</b> Da quel giorno, sulla panchina della Colle Alto siedono in due: l'allenatore e il suo vecchio maestro, con una lavagna a testa. La Serie Collina non sa ancora cosa la aspetta."]],
        triplete: [["ml_bice", "(Apre la vetrina della società, vuota dal 1978. Dentro mette la Coppa del Vino, il trofeo del campionato, e la Coppa dello spareggio.) Tre. In una stagione. (Il ventaglio le scivola di mano.)"], ["voce", "<b>FINALE SEGRETO · IL TRIPLETE DELLE COLLINE.</b> Hai battuto tutte le squadre della Lega e trovato tutte le figurine rare. Nel Bar dello Sport attaccano la tua foto accanto a quella del 1978. Il Mago Pino, per l'emozione, sbaglia un caffè. Il primo in trent'anni."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "ml_stadio");
    }
    const talk = {
      ml_pino() {
        if (S() === 0) return ask("ml_pino", "(Ha chiuso il bar. Ha una lavagna sottobraccio.) Ultimo giorno, Mister. Prima la Coppa del Vino, se vuoi: Monteroso e San Gallo, il trofeo più vecchio delle colline. Poi lo spareggio con la Valfonda. Ultimo mercato, ultimo allenamento: tutto adesso.", [
          { label: "Apri l'ultimo mercato", sub: `Hai ${K.crediti()} crediti`, fn: () => K.mercato({ title: "Ultimo mercato della stagione", pool: ["ermes", "ines", "lucia", "ottavio", "furio", "gemma", "samba"] }, () => { setStep(N, 1); quest("ml_spareggio", "Lo spareggio", "La Coppa del Vino (facoltativa), poi la Valfonda."); done(); }) },
          { label: "Allenamento e via", sub: "+1 ai tre più deboli della rosa", fn: () => { const n = K.allenamento(1); setStep(N, 1); quest("ml_spareggio", "Lo spareggio", "La Coppa del Vino (facoltativa), poi la Valfonda."); say([["ml_pino", `Ultimo allenamento: ${n.join(", ")} migliorano di un punto. Ora tocca a te, Mister.`]]); } },
        ], "ml_stadio");
        return say([["ml_pino", S() >= 2 ? "[felice] (Pulisce la lavagna, piano piano, come se fosse un trofeo.)" : "Ricordati: la loro istruzione la vedi sulla lavagna. Battila."]]);
      },
      ml_fiera() {
        if (S() === 1) return ask("ml_fiera", "La Coppa del Vino! Organizzo io, quest'anno: due partite, due avversari, una botte d'argento. Contro chi?", [
          { label: F.is("ml_battuta_monteroso") ? "Real Monteroso · già battuto" : "Contro il Real Monteroso", sub: "Partita secondaria · scegli tu la modalità", disabled: F.is("ml_battuta_monteroso"), fn: () => coppa("monteroso") },
          { label: F.is("ml_battuta_sangallo") ? "Virtus San Gallo · già battuta" : "Contro la Virtus San Gallo", sub: "Partita secondaria · scegli tu la modalità", disabled: F.is("ml_battuta_sangallo"), fn: () => coppa("sangallo") },
          { label: "Non ora", fn: done },
        ], "ml_stadio");
        return say([["ml_fiera", "Palla lunga e pedalare."]]);
      },
      ml_ottone() {
        if (S() === 1) return ask("ml_ottone", "[furbo] Mister! Lo spareggio. Ho comprato due giocatori apposta, per lei. (Indica il campo, dove due giganti si scaldano.) Nessun rancore. Solo trattori.", [{ label: "Gioca lo spareggio per la Serie Collina", sub: "Lavagna Tattica", cls: "hot", fn: spareggio }, { label: "Non ancora", fn: done }], "ml_stadio");
        return say([["ml_ottone", "Tutto si vende, Mister."]]);
      },
      ml_bice() { if (S() === 2) return endingAsk(); return say([["ml_bice", "(Dalla tribuna, con il ventaglio.) Coraggio, Mister. Io non licenzio nessuno, si ricordi."]]); },
      ml_marta() { return say([["ml_marta", "[felice] Lo Stadio delle Colline! Piatto! (Lo guarda storto.) Senza salita non so dove mettermi. Me lo dice lei, Mister, alla lavagna."]]); },
      ml_rino() { return say([["ml_rino", "La corriera è parcheggiata qui dietro, Mister. Se vinciamo, giro del paese col clacson. Se perdiamo, giro del paese senza clacson."]]); },
    };
    return { n: N, title: "Lo spareggio", sub: "La Coppa del Vino, la Valfonda, la Serie Collina", goal, start: "ml_stadio", introBg: "ml_stadio", zones, talk,
      intro: () => [["voce", "<b>MASTER LEAGUE DELLE COLLINE</b>, capitolo 3. Maggio. Le vigne sono verdi, e la Colle Alto, ultima a ottobre, è seconda in classifica. Lo spareggio per la Serie Collina si gioca allo Stadio delle Colline. Contro chi? Contro la Valfonda, naturalmente."]] };
  }
  boot();
})();
