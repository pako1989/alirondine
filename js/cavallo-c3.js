// js/cavallo-c3.js - IL CAVALLO STAR · Capitolo 3 «La puntata in diretta»
// Il Teatro 9, la puntata finale in diretta: Zoccoli d'Oro contro Cuccioli in Campo. La rete ha scritto un copione in cui
// Baldo perde, per lanciare lo spin-off di Max. Nel camerino, Baldo ha paura. In campo, il copione o la verità.
(function () {
  "use strict";
  function boot() { const D = window.__cavallo; if (!D || !D.addChapter || !D._has || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cos("cs_c3", { kind: "shirt", label: "Maglia di «Zoccoli d'Oro», ultima puntata", val: "#a8d8f0", from: "Capitolo 3 di Il Cavallo Star" });
    K.cos("cs_diretta", { kind: "acc", label: "Medaglia del gol non scritto", val: "medaglia", from: "Finale «Il gol che nessuno aveva scritto»" });
    K.cos("cs_serie", { kind: "acc", label: "Corona da prima serata", val: "corona", from: "Finale «La serie più vista dell'anno»" });
    K.cos("cs_biografia", { kind: "acc", label: "Il taccuino di Viola", val: "taccuino", from: "Finale «La biografia di Viola»" });
    K.cos("cs_puntata", { kind: "acc", label: "Fiore del campetto del 1996", val: "fiore", from: "Finale segreto «La puntata perduta»" });
    const ITEMZ = ["cs_colle", "cs_studios", "cs_teatro"];
    function allVhs() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = ((Z[z] && Z[z].items) || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const goal = (s) => ({
      0: "Davanti al Teatro 9. Stasera c'è la puntata finale, in diretta. Lucilla ha il copione.",
      1: "Baldo è chiuso nel camerino. Qualcuno deve parlargli.",
      2: "La diretta: il regista aspetta al Teatro 9. Motore… azione.",
      3: "La diretta è finita. Lucilla ti cerca fuori dal teatro.",
    }[s] || "La saga è conclusa. Puoi rigiocarla per trovare gli altri finali.");
    const zones = {
      cs_teatro: {
        region: "studio", name: "Il Cavallo Star · Il Teatro 9", short: "Il Teatro 9", sub: "La puntata finale in diretta, il camerino, il pubblico in fila", bg: "cs_teatro", time: "tramonto", travel: [15, 19],
        w: 30, h: 22, start: [15, 19], items: [[1, 1], [28, 20]], itemCos: "cs_vhs",
        areas: [[9, 2, 20, 7, "Il Teatro 9"], [0, 0, 29, 21, "Gli studi di Lustrino"]],
        flavor: { t: "Un albero illuminato con le lucine. Stasera è festa: anche gli alberi sono truccati.", l: "Un lampione con un cartello: «IN ONDA». Si accende da solo, quando si accende la diretta." },
        intro: [["voce", "Il tramonto su Lustrino. Davanti al Teatro 9 c'è la fila del pubblico: persone, cani, una famiglia di procioni con i biglietti in prima fila. Sopra l'ingresso, la scritta luminosa: «ZOCCOLI D'ORO · ULTIMA PUNTATA · IN DIRETTA»."]],
        npcs: (s) => [{ id: "cs_lucilla", at: [8, 14] }, { id: "cs_viola", at: [5, 10] }, { id: "cs_ugo", at: [12, 16] }, { id: "cs_max", at: [21, 15] }, { id: "cs_regista", at: [15, 10] }, ...(s >= 3 ? [{ id: "cs_baldo", at: [17, 16] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 0, 0, 21, "a"); lay(29, 0, 29, 21, "a"); lay(0, 21, 29, 21, "a");
          lay(1, 17, 28, 20, "*"); lay(15, 8, 15, 16, ":"); lay(3, 12, 27, 12, ":");
          house(10, 2, 10, 5, { door: [15, 6], roof: "#ff7aa8", wall: "#fff4f8", rr: 2, enter: "Dentro il Teatro 9: il campo-set pastello, le telecamere, le luci, trecento posti già pieni. Il regista ti fa segno di aspettare fuori: «Prima il camerino!»." });
          house(23, 9, 5, 3, { door: [25, 11], roof: "#f0c84a", wall: "#f4e8f8", rr: 1, enter: { to: "cs_camerino", at: [7, 9] } });
          [[8, 8], [22, 8]].forEach(([x, y]) => put(x, y, "F")); [[12, 9], [18, 9]].forEach(([x, y]) => put(x, y, "K")); lay(2, 5, 4, 5, "A");
          [[1, 9], [28, 5]].forEach(([x, y]) => put(x, y, "P")); [[6, 15], [26, 15]].forEach(([x, y]) => put(x, y, "t")); [[10, 13], [20, 13]].forEach(([x, y]) => put(x, y, "l")); put(3, 15, "s");
        },
      },
      cs_camerino: {
        interior: true, region: "interno", name: "Il Cavallo Star · Il camerino di Baldo", short: "Il camerino", sub: "Lo specchio con le lampadine", bg: "cs_camerino", w: 16, h: 12, start: [7, 9], outside: ["cs_teatro", 25, 12],
        act: { L: "Guarda lo specchio", T: "Guarda il trucco", A: "Guarda la foto", v: "Esci" },
        flavor: { L: "Lo specchio con le lampadine: tre sono fulminate. Baldo dice che così si vede meglio la criniera.", T: "Il trucco: fondotinta per cavalli, lucido per zoccoli, una spazzola d'argento con le iniziali «B.C.»." },
        intro: [["voce", "Il camerino: piccolo, caldo, profuma di lacca. Baldo è seduto davanti allo specchio, già truccato. Si guarda, ma non si vede."]],
        npcs: (s) => (s <= 2 ? [{ id: "cs_baldo", at: [7, 4] }] : []),
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(4, 1, 10, 1, "L"); lay(5, 2, 9, 2, "T"); put(13, 4, "A"); },
      },
    };
    // il copione della rete: Zoccoli d'Oro deve perdere
    const SCRIPT = [
      { k: "pari", t: "La sigla. Baldo entra in campo tra gli applausi registrati. Fa la sua faccia del 1994." },
      { k: "noi", t: "Baldo ti lancia con lo zoccolo: tu segni. «Che zoccolata!», dice lui, e il pubblico la ripete." },
      { k: "loro", t: "Max Allegria pareggia con un colpo di coda. Il pubblico in studio si scioglie." },
      { k: "pari", t: "Baldo cade al rallentatore e guarda in camera. Pausa drammatica di otto secondi." },
      { k: "loro", t: "Cuccioli in Campo segna ancora. Baldo dice: «Forse è ora di lasciare il campo ai giovani»." },
      { k: "noi", t: "Ultimo minuto: tuo gol di testa, ma è tardi. Il copione dice che l'arbitro lo annulla." },
      { k: "loro", t: "Fischio finale: Cuccioli in Campo segna il terzo. Baldo abbraccia Max. Titoli di coda." },
    ];
    function diretta() {
      const corag = F.is("cs_coraggio");
      K.ciakMatch({ title: "Ciak! Si Gioca · L'ultima puntata, in diretta", minutes: 90, takes: corag ? 2 : 1, script: SCRIPT, opp: { name: "Cuccioli in Campo", color: "#7ab8e8", players: [{ name: "Max Allegria" }, { name: "Briciola" }] },
        intro: `<p>La puntata finale, <b>in diretta</b>. Il copione della rete dice che <b>Zoccoli d'Oro perde</b>, per lanciare lo spin-off di Max. ${corag ? "Baldo ti ha detto: «Improvvisiamo». Hai due ciak di riserva." : "Baldo ti ha detto: «Segui il copione». In diretta non si rifà niente: un solo ciak di riserva."}</p><p>Se segui il copione, il regista vi adora. Se vuoi vincere, devi <b>improvvisare</b>.</p>`, winTitle: "IL GOL CHE NESSUNO AVEVA SCRITTO!" }, (r) => {
        F.set("cs_vinta", !!r.win); F.set("cs_media", Math.round((r.data && r.data.media) || 0)); setStep(N, 3); bond("baldo", 2);
        K.scene(r.win ? [["cs_regista", "[sorpreso] (Il megafono gli cade di mano.) Non era… non era nel copione. (Lo raccoglie.) Era meglio del copione. NON DITELO ALLA RETE."], ["cs_baldo", "[felice] (In mezzo al campo, sudato, spettinato, senza la faccia del 1994.) Abbiamo vinto. Davvero. Non perché qualcuno l'aveva scritto."]]
          : [["cs_regista", "(Al megafono, commosso.) STOP. Buona la prima. (Si asciuga una lacrima.) Era tutto come doveva essere."], ["cs_baldo", "[pensa] (Abbraccia Max, come da copione. Poi resta abbracciato un secondo in più, fuori copione.) Bella partita, Max. Davvero."]], () => K.enterZone("cs_teatro"), "cs_finale");
      });
    }
    function endingAsk() {
      const opts = [];
      if (F.is("cs_vinta")) opts.push({ label: "«Abbiamo vinto davvero, Baldo»", sub: "Il gol che nessuno aveva scritto", big: true, fn: () => ending("diretta") });
      else opts.push({ label: "«Gli ascolti sono altissimi, Lucilla»", sub: "La serie più vista dell'anno", big: true, fn: () => ending("serie") });
      if (F.is("cs_verita")) opts.push({ label: "«Viola, il libro è pronto?»", sub: "La biografia vera di Baldo", big: true, fn: () => ending("biografia") });
      if (allVhs() && (F.get("cs_media", 0) | 0) >= 4 && !F.is("cs_lasciato")) opts.unshift({ label: "«Ugo, cosa c'è nell'ultima cassetta?»", sub: "Segreto: tutte le cassette, quattro stelle del regista, nessuna ripresa interrotta", cls: "hot", big: true, fn: () => ending("puntata") });
      ask("cs_lucilla", "(Fuori dal teatro. I quattro telefoni, per la prima volta, sono spenti.) È finita. La puntata, la serie, forse anche la mia pausa pranzo del 2009. (Ti guarda.) E adesso?", opts, "cs_finale");
    }
    function ending(kind) {
      const R = { diretta: { coins: 150, cos: ["cs_c3", "cs_diretta"] }, serie: { coins: 140, cos: ["cs_c3", "cs_serie"] }, biografia: { coins: 160, cos: ["cs_c3", "cs_biografia"] }, puntata: { coins: 260, cos: ["cs_c3", "cs_puntata"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 9);
      const lines = {
        diretta: [["cs_lucilla", "[ride] La rete ha chiuso la serie. Per «insubordinazione». (Ride ancora.) Trent'anni che lavoro con lui, e non l'avevo mai visto così."], ["voce", "<b>FINALE · IL GOL CHE NESSUNO AVEVA SCRITTO.</b> «Zoccoli d'Oro» non tornerà più in onda. Il giorno dopo Baldo va al campetto di terra dietro gli studi, da solo, col pallone. Ci torna anche il giorno dopo. Non c'è nessuna telecamera. Gioca benissimo."]],
        serie: [["cs_lucilla", "[felice] Ascolti record. Rinnovati per tre stagioni. Lo spin-off di Max, pure. Siete tutti ricchi. (Guarda Baldo, seduto sul gradino del teatro.) Lui no. Lui è famoso."], ["cs_baldo", "[pensa] È andata come doveva andare. (Pausa.) E adesso?"], ["voce", "<b>FINALE · LA SERIE PIÙ VISTA DELL'ANNO.</b> Baldo è di nuovo sulle copertine. Ripete «Che zoccolata!» in ogni intervista. A volte, la sera, si chiede se gli piace ancora. Poi squilla il telefono."]],
        biografia: [["cs_viola", "[felice] (Ha in mano la prima copia.) «Zoccoli e paure». La copertina è una foto di lui a sei anni, su un campetto di terra. Niente trofei."], ["cs_baldo", "[triste] (Sfoglia il libro. Si ferma a una pagina. La legge due volte.) Sono io. Davvero."], ["voce", "<b>FINALE · LA BIOGRAFIA DI VIOLA.</b> Primo in classifica per sei mesi. Le persone fermano Baldo per strada, ma non per la battuta: per dirgli che anche loro, da piccoli, avevano un campetto. Lui ascolta tutti. Ci mette ore."]],
        puntata: [["cs_ugo", "[sorpreso] (Infila l'ultima cassetta nel videoregistratore del camerino.) Idea: la guardiamo. (Pausa.) No, aspetta, questa è un'idea buona. È la prima."], ["voce", "Sullo schermo, 1996: l'episodio mai andato in onda. Baldo giovane e la sua vecchia squadra giocano su un campetto, senza copione, senza pubblico, ridendo. A un certo punto guarda in camera e dice: «Questa è la parte vera»."], ["voce", "<b>FINALE SEGRETO · LA PUNTATA PERDUTA.</b> Lustrino TV la trasmette quella sera stessa, senza pubblicità. Tutta la collina la guarda in silenzio. Baldo la guarda con te, con Lucilla, Ugo, Viola e Max, sul divano di Ugo. Che, si scopre, è un divano molto comodo."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "cs_finale");
    }
    const talk = {
      cs_lucilla() {
        const s = S();
        if (s === 0) return K.stampa("finale", { fama: 1 }, () => K.scene([["cs_lucilla", "(Ti mette in mano il copione. È rosso.) L'ultima puntata. La rete ha deciso: Zoccoli d'Oro perde, Max vince, e domani parte lo spin-off «Cuccioli in Campo: le Origini». Baldo ha letto il copione un'ora fa."], ["cs_lucilla", "[triste] Si è chiuso nel camerino. Non apre a nessuno. Neanche a me. A te, forse sì."]], () => { setStep(N, 1); quest("cs_camerino", "Il camerino di Baldo", "Dietro il Teatro 9."); done(); }, "cs_teatro"));
        if (s === 3) return endingAsk();
        return say([["cs_lucilla", "Il camerino è dietro il teatro. Bussa due volte, poi una. È il nostro codice dal 1993."]]);
      },
      cs_baldo() {
        const s = S();
        if (s === 1) return ask("cs_baldo", "(Senza girarsi. Ti guarda dallo specchio.) Ho letto il copione. Perdo. Dico «è ora di lasciare il campo ai giovani». Abbraccio Max. (Pausa.) È un buon finale. È quello che vuole il pubblico. (Pausa più lunga.) Tu cosa faresti?", [
          { label: "«Segui il copione. Sei una star: dai al pubblico il finale»", sub: "La fama", big: true, fn: () => coraggio(false) },
          { label: "«Improvvisiamo. Giochiamo per vincere, davvero»", sub: "La verità, in diretta", big: true, fn: () => coraggio(true) },
        ], "cs_camerino");
        return say([["cs_baldo", s >= 3 ? "[felice] È finita. (Respira.) Strano: mi sento più leggero. Come uno zoccolo nuovo." : "Il regista ci aspetta. (Si sistema la criniera.) Andiamo, spalla."]]);
      },
      cs_regista() {
        if (S() === 2) return ask("cs_regista", "(Al megafono, ma piano.) Trenta secondi alla diretta. Tutti in posizione. Spalla: ricordati, CONTA IL FINALE.", [{ label: "Vai in onda", sub: "Ciak! Si Gioca · la diretta finale", cls: "hot", fn: diretta }, { label: "Un momento", fn: done }], "cs_teatro");
        return say([["cs_regista", "(Controlla le luci, le telecamere, il cielo.) Stasera niente dodici ciak. Stasera ce n'è uno."]]);
      },
      cs_viola() { return say([["cs_viola", F.is("cs_verita") ? "[felice] Ho finito il libro. Mi manca l'ultima pagina. Dipende da stasera." : "Scrivo una frase al giorno. Oggi non l'ho ancora scritta. Aspetto."]]); },
      cs_ugo() { return say([["cs_ugo", "Ho trovato delle vecchie cassette nella roulotte. Idea: guardarle tutte stasera. (Pausa.) Dopo la diretta. Prima ho paura."]]); },
      cs_max() { return say([["cs_max", S() >= 3 ? "[felice] Che puntata! Baldo è il mio migliore amico! Stasera me l'ha detto anche lui! (Scodinzola così forte che gira su se stesso.)" : "[pensa] (Smette un attimo di scodinzolare.) Non mi piace il copione. Io non voglio che Baldo perda. Io voglio solo giocare con lui."]]); },
    };
    function coraggio(si) {
      F.set(si ? "cs_coraggio" : "cs_copione", true); setStep(N, 2); questDone("cs_camerino");
      say([["cs_baldo", si ? "[sorpreso] (Si gira, per la prima volta.) Improvvisare. In diretta. (Ride, piano.) Nel 1996 lo facevamo sempre, prima che arrivassero i copioni. Va bene, spalla. Ma se sbaglio, la colpa è tua." : "[pensa] (Annuisce allo specchio.) Il finale che vuole il pubblico. Va bene. Sono un professionista. (Si alza.) Sono un professionista."]]);
    }
    return { n: N, title: "La puntata in diretta", sub: "Il Teatro 9, il camerino, la diretta, il finale", goal, start: "cs_teatro", introBg: "cs_teatro", zones, talk,
      intro: () => [["voce", "<b>IL CAVALLO STAR</b>. Episodio 3, l'ultimo. Stasera, in diretta, la puntata finale di «Zoccoli d'Oro». La rete ha già scritto come finisce. Il cavallo ha appena letto il copione."]] };
  }
  boot();
})();
