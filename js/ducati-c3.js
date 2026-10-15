// js/ducati-c3.js - LA GUERRA DEI TRE DUCATI · Capitolo 3 «La finale sulle saline»
// Ruggine ha vinto l'altra semifinale. Il Duca Ferro non vuole solo la Coppa: vuole le saline, e lo dice chiaro.
// L'ultima Bilancia decide dove si gioca la finale, e con chi. Poi, il campo decide il resto.
(function () {
  "use strict";
  function boot() { const D = window.__ducati; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cast("td_duca", { beard: "pizzetto", acc: ["corona"], name: "Il Duca Ferro di Ruggine", tag: "", hair: "#2a2a2a", style: "buzz", skin: "#c68642", eye: "#5a2a1a", bg: ["#2a1e14", "#a83a2a"], shirt: "#5a3a34" },
      "Il signore di Ruggine. Parla poco, mangia poco, dorme poco. Il suo ducato ha ferro per cento anni e sale per tre mesi: per questo guarda le saline come un affamato guarda il pane.");
    K.cast("td_fabbro", { acc: ["grembiule", "guanti"], name: "Mastra Incudine, la fabbra", tag: "", hair: "#5a2a1a", style: "bandana", skin: "#d9a679", eye: "#3a2a1a", bg: ["#2a1e14", "#a83a2a"], shirt: "#5a4a44" },
      "La fabbra più brava di Ruggine. Forgia ferri di cavallo, chiodi e, una volta all'anno, una spada che nessuno usa. Dice che il ferro serve a costruire, non a minacciare. Il duca non la ascolta.");
    K.cos("td_c3", { kind: "shirt", label: "Maglia della finale dei Tre Ducati", val: "#c8a040", from: "Capitolo 3 di La Guerra dei Tre Ducati" });
    K.cos("td_corona", { kind: "acc", label: "Corona di sale", val: "corona", from: "Finale «La corona di sale»" });
    K.cos("td_patto", { kind: "acc", label: "Sigillo del patto di vetro", val: "medaglia", from: "Finale «Il patto di vetro»" });
    K.cos("td_saline", { kind: "acc", label: "Casco dei minatori di Salinella", val: "casco", from: "Finale «Le saline libere»" });
    K.cos("td_pari", { kind: "acc", label: "Bilancia d'oro in miniatura", val: "chiave", from: "Finale segreto «La bilancia in pari»" });
    K.cos("td_sigilli3", { kind: "acc", label: "Sigillo di sale e ferro", val: "medaglia", from: "Trova il sigillo di sale del Capitolo 3" });
    const ITEMZ = ["td_salinella", "td_miniera", "td_vetrara", "td_ruggine"];
    function allSeals() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const voters = () => ["td_corrado", "td_lia", "td_ottone", "td_anselmo", ...(F.is("td_isotta_con") ? ["td_isotta"] : [])];
    const goal = (s) => ({
      0: "Al confine con Ruggine, il campo dei Tre Ducati. Il Duca Ferro vuole parlare con il capitano di Salinella.",
      1: "L'ultima Bilancia: dove si gioca la finale? Cerca argomenti (la forgia di Mastra Incudine, Anselmo, Bruna), poi da Corrado.",
      2: "La finale della Coppa dei Tre Ducati. Il Duca Ferro aspetta a centrocampo.",
      3: "Fischio finale. Corrado ti aspetta.",
    }[s] || "La saga è conclusa. Puoi rigiocarla per trovare gli altri finali.");
    const zones = {
      td_ruggine: {
        region: "ruggine", name: "La Guerra dei Tre Ducati · Il confine di Ruggine", short: "Il confine di Ruggine", sub: "Le forge, la fortezza, il campo dei Tre Ducati", bg: "td_ruggine", time: (K, s) => (s >= 3 ? "tramonto" : "giorno"), travel: [16, 20],
        w: 34, h: 24, start: [16, 20], itemCos: "td_sigilli3", items: [[31, 2]],
        areas: [[8, 6, 25, 15, "Il campo dei Tre Ducati"], [0, 0, 33, 23, "Il confine di Ruggine"]],
        flavor: { r: "Roccia rossa, venata di ferro. Se la tocchi, ti lascia le dita arancioni." },
        intro: [["voce", "Il confine di Ruggine: rocce rosse, forge che fumano giorno e notte, una fortezza di ferro sulla collina. In mezzo, piatto e polveroso, il campo dei Tre Ducati, dove tutti i duchi possono giocare senza essere in casa di nessuno."]],
        npcs: (s) => [{ id: "td_corrado", at: [14, 19] }, { id: "td_lia", at: [19, 19] }, { id: "td_ottone", at: [11, 20] }, { id: "td_anselmo", at: [22, 20] }, { id: "td_bruna", at: [6, 19] }, ...(F.is("td_isotta_con") ? [{ id: "td_isotta", at: [25, 19] }] : []), { id: "td_duca", at: s >= 2 ? [16, 10] : [18, 5] }, { id: "td_chiodo", at: [20, 4] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "r"); lay(0, 0, 0, 23, "r"); lay(33, 0, 33, 23, "r"); lay(0, 23, 33, 23, "r");
          lay(1, 17, 32, 22, ":"); lay(16, 1, 16, 16, ":"); lay(8, 6, 25, 15, ","); lay(1, 5, 7, 5, ":");
          house(12, 1, 9, 3, { door: [16, 3], roof: "#4a3a34", wall: "#6a5a54", rr: 1, enter: "La sala del Duca Ferro: un tavolo di ferro, sedie di ferro, un camino acceso anche d'estate. Sul tavolo, una mappa delle saline di Salinella, con tante puntine rosse." });
          house(2, 1, 5, 3, { door: [4, 3], roof: "#4a3a34", wall: "#6a5a54", rr: 1, enter: { to: "td_forgia", at: [7, 8] } });
          [[26, 2], [28, 3], [3, 8], [30, 11]].forEach(([x, y]) => put(x, y, "F")); [[1, 12], [2, 13], [31, 15], [32, 7], [27, 9], [5, 14]].forEach(([x, y]) => put(x, y, "r"));
          put(23, 20, "s"); put(25, 6, "Q");
        },
      },
      td_forgia: {
        interior: true, region: "casa", name: "La Guerra dei Tre Ducati · La forgia di Mastra Incudine", short: "La forgia", sub: "Ferro, fuoco e una fabbra che non ama le guerre", bg: "td_ruggine", w: 14, h: 11, start: [7, 8], outside: ["td_ruggine", 4, 4],
        act: { F: "Guarda la forgia", L: "Guarda gli attrezzi", v: "Esci" }, flavor: { L: "Tenaglie, martelli, ferri di cavallo appesi in fila. Nessuna spada." },
        intro: [["voce", "Dentro la forgia fa caldo come d'agosto. Mastra Incudine batte il ferro senza fermarsi: un colpo, due colpi, tre."]],
        npcs: () => [{ id: "td_fabbro", at: [7, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 13, 10, "+"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 10, "a"); lay(13, 0, 13, 10, "a"); lay(0, 10, 13, 10, "a"); put(7, 10, "v"); put(3, 2, "F"); put(10, 2, "F"); lay(1, 1, 2, 1, "L"); lay(11, 1, 12, 1, "L"); },
      },
    };
    const TERR = { ruggine: "ruggine", alleanza: "vetro", saline: "saline" };
    const VENUE = { ruggine: "nello stadio di ferro di Ruggine", alleanza: "a Vetrara, sulle terrazze di vetro, con la Marchesa alleata", saline: "sulle saline, davanti a tutta Salinella" };
    function voto() {
      K.bilancia({ id: "v3", title: "La Bilancia · Dove si gioca la finale", q: "Il Duca Ferro vuole la finale a Ruggine: vincere in casa sua sarebbe l'unica vittoria indiscutibile. Oppure ci si allea con Vetrara e si gioca da loro, al sicuro. Oppure si gioca sulle saline, davanti al popolo che le scava.",
        opts: [{ id: "ruggine", label: "In casa di Ruggine", conv: "morale" }, { id: "alleanza", label: "A Vetrara, alleati", conv: "utile" }, { id: "saline", label: "Sulle saline, col popolo", conv: "liberta" }],
        voters: voters(), done: (w) => { setStep(N, 2); questDone("td_voto3"); bond(w === "ruggine" ? "morale" : w === "alleanza" ? "utile" : "liberta", 1);
          K.scene([["td_corrado", `[pensa] La Bilancia ha deciso: la finale si gioca ${VENUE[w]}. (Si stringe la fascia.) Andiamo a dirlo al Duca.`]], () => K.enterZone("td_ruggine"), "td_bilancia"); } });
    }
    function finale() {
      const v = F.get("td_v3", "ruggine"), mate2 = F.is("td_isotta_con") ? { name: "Isotta", skin: "#f4dcc8", hair: "#e8d08a" } : { name: "Lia", skin: "#e8c4a0", hair: "#c87a3a" };
      K.campo({ title: `Calcio Tattico · La finale della Coppa dei Tre Ducati`, terrain: TERR[v] || "ruggine", oppStyle: "pressing", minutes: 90,
        mates: [{ name: "Corrado", skin: "#e0b890", hair: "#a8a8a8" }, mate2], opp: { name: "Ruggine", color: "#a83a2a", players: [{ name: "Il Duca Ferro", skin: "#c68642", hair: "#2a2a2a" }, { name: "Chiodo", skin: "#d9a679", hair: "#1a1a1a" }, { name: "Lima", skin: "#e8c4a0", hair: "#3a2a1a" }], keeper: { name: "Incudine" } },
        intro: `<p>La finale si gioca ${VENUE[v] || ""}. Ruggine fa <b>pressing</b> forte e il Duca gioca in prima persona. ${F.is("td_isotta_con") ? "Isotta gioca con voi: è la regista migliore dell'altopiano." : ""} Tenete le alture e prendeteli alle spalle.</p>`, winTitle: "SALINELLA VINCE LA COPPA!" }, (r) => {
        if (!r.win) return K.scene([["td_duca", "[pensa] (Si pulisce le mani.) Pareggio o vittoria mia, non importa: il regolamento della Coppa vuole la finale vinta sul campo. Si rigioca. Domani. (Ti guarda.) Siete più duri del vostro sale."]], () => K.enterZone("td_ruggine"), "td_ruggine");
        setStep(N, 3); F.set("td_coppa", true);
        K.scene([["voce", "Fischio finale. Per la prima volta in trent'anni, la Coppa dei Tre Ducati va a Salinella."], ["td_duca", "[sorpreso] (Resta fermo a centrocampo a lungo. Poi ti tende la mano.) Il ferro si piega solo nel fuoco. Oggi l'ho visto piegarsi su un campo. (Stringe.) Ruggine onorerà la Coppa."], ["td_anselmo", "[felice] (Scrive così in fretta che rompe la penna.) Lo scrivo. Lo scrivo tutto."]], () => K.enterZone("td_ruggine"), "td_finale");
      });
    }
    function convs() { return ["v1", "v2", "v3"].map((v) => F.get("td_" + v + "_conv", "")).filter(Boolean); }
    function endingAsk() {
      const c = convs(), n = (k) => c.filter((x) => x === k).length, maj = ["morale", "utile", "liberta"].find((k) => n(k) >= 2), distinct = new Set(c).size === 3;
      const persuaded = Object.keys(K.COMP).filter((v) => F.is("td_pers_" + v)).length;
      const E = { morale: ["corona", "Alza la corona di sale", "La Morale ha pesato di più"], utile: ["patto", "Firma il patto con i tre ducati", "L'Utile ha pesato di più"], liberta: ["saline", "Porta la Coppa in piazza, ai minatori", "La Libertà ha pesato di più"] };
      const opts = [];
      const main = maj || F.get("td_v3_conv", "morale"); opts.push({ label: E[main][1], sub: E[main][2], big: true, fn: () => ending(E[main][0]) });
      if (distinct && allSeals() && persuaded >= 3) opts.unshift({ label: "Guarda la Bilancia della piazza: è in pari", sub: "Segreto: tre voti diversi, tutti i sigilli, tre compagni convinti", cls: "hot", big: true, fn: () => ending("pari") });
      ask("td_corrado", "(Ha la Coppa fra le mani e non sa dove metterla.) Tre voti, tre pesi. Adesso la Bilancia dice cosa siamo diventati, Salinella e tu. (Ti porge la Coppa.) Tocca a te, capitano.", opts, "td_finale");
    }
    function ending(kind) {
      const R = { corona: { coins: 140, cos: ["td_c3", "td_corona"] }, patto: { coins: 140, cos: ["td_c3", "td_patto"] }, saline: { coins: 140, cos: ["td_c3", "td_saline"] }, pari: { coins: 260, cos: ["td_c3", "td_pari"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        corona: [["voce", "Il vecchio duca di Salinella ti mette in testa una corona di sale cristallizzato. Si scioglierà alla prima pioggia: è fatta apposta."], ["td_corrado", "[felice] Niente venduto, nessuno tradito. Abbiamo vinto come si deve. (Ride.) Con le scarpe rotte."], ["voce", "<b>FINALE · LA CORONA DI SALE.</b> La corona sta appesa nello spogliatoio, sopra la panca. Quando piove, gocciola un po'. Nessuno la toglie."]],
        patto: [["td_ottone", "[felice] (Firma tre copie dello stesso foglio.) Sale a Vetrara, a prezzo giusto. Ferro da Ruggine, a prezzo giusto. E per Salinella, scarpe nuove per tutta la squadra. Per dieci anni."], ["td_marchesa", "[furbo] Ogni cosa ha un prezzo, capitano. Stavolta l'avete deciso voi."], ["voce", "<b>FINALE · IL PATTO DI VETRO.</b> Non è una favola: è un buon affare per tutti. Per la prima volta da cent'anni, sull'altopiano non c'è un ducato che ha fame."]],
        saline: [["td_bruna", "[felice] (In piazza, con la Coppa fra le mani bianche di sale.) Votiamo. Tutti. Anche chi lavora la domenica."], ["td_lia", "[felice] Le saline sono di chi le scava. L'abbiamo detto per trecento anni. Adesso è scritto."], ["voce", "<b>FINALE · LE SALINE LIBERE.</b> La Coppa sta nella sala comune dei minatori, e ognuno la può toccare. La domenica, finalmente, si gioca."]],
        pari: [["td_anselmo", "[pensa] (Davanti alla statua della piazza: i tre piatti, per la prima volta, sono alla stessa altezza.) Tre voti. Una volta ha vinto il giusto, una volta l'utile, una volta il libero. E nessuno se n'è andato."], ["voce", "<b>FINALE SEGRETO · LA BILANCIA IN PARI.</b> Anselmo scrive nella cronaca: «Quell'anno la bilancia restò in pari, e nessuno sa come». Tu lo sai: hai ascoltato tutti, e tutti hanno ascoltato te."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "td_finale");
    }
    const talk = {
      td_duca() {
        const s = S();
        if (s === 0) return K.scene([["td_duca", "[arrabbiato] (Davanti alla fortezza, senza mantello, con le braccia nude e piene di cicatrici di forgia.) Capitano. Ruggine ha ferro per cento anni e sale per tre mesi. La finale si gioca qui, nel mio stadio. Se vincete, la Coppa è vostra. Se rifiutate di venire… (guarda le saline, lontane) il sale lo verremo a prendere comunque."], ["td_corrado", "[pensa] (A bassa voce.) Si decide alla Bilancia. Come sempre. Anche stavolta."]], () => { setStep(N, 1); quest("td_voto3", "La Bilancia: dove si gioca la finale", "Cerca argomenti (la forgia, Anselmo, Bruna), poi da Corrado."); done(); }, "td_ruggine");
        if (s === 2) return ask("td_duca", "(A centrocampo, con la maglia rossa di Ruggine. Gioca lui, in persona.) La Bilancia ha deciso, mi dicono. Bene. Il campo deciderà il resto.", [{ label: "Gioca la finale", sub: "Calcio tattico · la finale della Coppa", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "td_ruggine");
        return say([["td_duca", s >= 3 ? "[pensa] Il ferro si piega nel fuoco. Oggi era il vostro fuoco." : "Il ferro non aspetta."]]);
      },
      td_corrado() {
        const s = S();
        if (s === 1) return ask("td_corrado", `L'ultima Bilancia. ${F.is("td_isotta_con") ? "Stavolta vota anche Isotta: è una di noi." : ""} Argomenti che hai: ${K.args().length}.`, [{ label: "Alla Bilancia", sub: "Dove si gioca la finale", cls: "hot", big: true, fn: voto }, { label: "Prima cerco argomenti", fn: done }], "td_bilancia");
        if (s === 3) return endingAsk();
        return say([["td_corrado", s === 2 ? "Il Duca ci aspetta a centrocampo." : "Testa alta. Il ferro fa rumore, ma il sale dura di più."]]);
      },
      td_fabbro() {
        if (S() >= 1 && !F.is("td_arg_ferro")) return say([["td_fabbro", "[pensa] (Non smette di battere.) Il duca pensa che il ferro serva a prendere. Il ferro serve a costruire. Se Vetrara stesse con voi, Ruggine non attaccherebbe: il vetro compra il nostro ferro, lo sanno tutti. Ditelo alla vostra Bilancia."]], () => { K.arg("ferro"); say([["voce", "<b>Nuovo argomento: Il ferro e il vetro (Utile).</b>"]]); });
        return say([["td_fabbro", "Un colpo, due colpi, tre. Il ferro ascolta solo così."]]);
      },
      td_anselmo() {
        if (S() >= 1 && !F.is("td_arg_onore")) return say([["td_anselmo", "[pensa] (Sfoglia il librone fino all'ultima pagina scritta.) In trecento anni, Salinella ha vinto la Coppa sette volte. Sei in casa. Una sola nello stadio di Ruggine: e quella, nessuno l'ha mai discussa."]], () => { K.arg("onore"); say([["voce", "<b>Nuovo argomento: Il campo dell'avversario (Morale).</b>"]]); });
        return say([["td_anselmo", "Scrivo. Anche le cose che non capisco ancora."]]);
      },
      td_bruna() {
        if (S() >= 1 && !F.is("td_arg_popolo")) return say([["td_bruna", "[felice] Siamo venuti tutti, col carro del sale! (Indica una folla di minatori, bianchi di polvere.) Se la finale è nostra, giocatela sulle saline. Con noi a guardare. Almeno una volta."]], () => { K.arg("popolo"); say([["voce", "<b>Nuovo argomento: Il popolo delle saline (Libertà).</b>"]]); });
        return say([["td_bruna", S() >= 3 ? "[felice] La Coppa! Fatemela toccare. Solo un dito." : "Il carro del sale aspetta. Anche noi."]]);
      },
      td_isotta() { return say([["td_isotta", S() >= 3 ? "[felice] Avete vinto. Abbiamo vinto. (Ride.) Mia madre scriverà una lettera lunghissima." : "Ruggine gioca forte, ma pensa piano. Prendiamoli alle spalle."]]); },
      td_lia() { return say([["td_lia", S() >= 3 ? "[felice] La Coppa a Salinella! Te l'avevo detto che sul sale si corre meglio." : "Il Duca ha le braccia come due incudini. Io ho le gambe."]]); },
      td_ottone() { return say([["td_ottone", "[pensa] Vincere costa meno che perdere. L'ho calcolato."]]); },
      td_chiodo() { return say([["td_chiodo", S() >= 3 ? "[pensa] (Chiude il taccuino, per sempre.) Il vostro campo l'avevo disegnato. Voi no." : "Il Duca gioca in prima persona. Non lo fa mai."]]); },
    };
    const obj = {};
    return { n: N, title: "La finale sulle saline", sub: "L'ultimatum del Duca Ferro, l'ultima Bilancia, la Coppa", goal, start: "td_ruggine", introBg: "td_ruggine", zones, talk, obj,
      intro: () => [["voce", "<b>LA GUERRA DEI TRE DUCATI.</b> Capitolo 3. Ruggine ha vinto l'altra semifinale, e il Duca Ferro ha mandato un messaggio di una riga: «La finale si gioca da me». Sulla pergamena, al posto della firma, una puntina rossa."]] };
  }
  boot();
})();
