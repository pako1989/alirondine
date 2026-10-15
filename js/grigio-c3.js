// js/grigio-c3.js - IL CAVALIERE DELLA NOTTE · Capitolo 3 «L'ultima partita della notte»
// La notte prima della finale, la radio del faro arriva in tutta Porto Scuro. Il giorno dopo, allo Stadio della Gru,
// Porto Scuro Calcio gioca contro il Nebbia Athletic di Ottavio Brume. Stavolta il risultato non l'ha deciso nessuno.
(function () {
  "use strict";
  function boot() { const D = window.__grigio; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cast("gr_brume", { beard: "baffi", acc: ["sciarpa"], name: "Ottavio Brume, presidente della Lega", tag: "gray", hair: "#9a9a9a", style: "slick", skin: "#f0d8c8", eye: "#5a5a6a", bg: ["#0c101a", "#8a8a9a"], shirt: "#3a3a4a" },
      "Il presidente della Lega del Porto e del Nebbia Athletic. Elegante, gentile, sempre asciutto anche quando piove. Lo chiamano il Mercante di Nebbia: compra partite come altri comprano il pesce, al mattino presto, quando nessuno guarda.");
    K.cast("gr_capitano", { acc: [], name: "Il capitano del Nebbia Athletic", tag: "", hair: "#e8e8f0", style: "undercut", skin: "#e8c4a0", eye: "#4a4a5a", bg: ["#0c101a", "#8a8a9a"], shirt: "#8a8a9a" },
      "Il capitano del Nebbia Athletic. Gioca bene, gioca pulito, e non sa niente del contratto. O forse lo sa, e ha deciso di non saperlo.");
    ["gr_sg7", "gr_sg8"].forEach((id, i) => K.cast(id, { acc: ["cappellino"], name: ["La guardia della scala", "La guardia del faro"][i], tag: "", hair: "#1a1a1a", style: "hood", skin: ["#e0b890", "#d9a679"][i], eye: "#2a2a2a", bg: ["#0c101a", "#4a4a5a"], shirt: "#3a3a4a" },
      "Una delle guardie private di Ottavio Brume. Cappotto lungo, torcia potente, poca pazienza."));
    K.cos("gr_c3", { kind: "shirt", label: "Maglia della finale del Porto Scuro", val: "#5a6a8a", from: "Capitolo 3 di Il Cavaliere della Notte" });
    K.cos("gr_luce", { kind: "acc", label: "Distintivo della polizia portuale", val: "medaglia", from: "Finale «Il porto torna a respirare»" });
    K.cos("gr_ombra", { kind: "shirt", label: "Mantello grigio dell'Airone", val: "#2a3040", from: "Finale «Il Cavaliere resta nell'ombra»" });
    K.cos("gr_vela", { kind: "acc", label: "Bandana di Vela Nera", val: "bandana", from: "Finale «Due ombre sui tetti»" });
    K.cos("gr_airone", { kind: "acc", label: "La piuma del primo Airone", val: "corona", from: "Finale segreto «Il vero Airone»" });
    K.cos("gr_piume3", { kind: "acc", label: "Piuma d'airone del faro", val: "fiore", from: "Trova la piuma d'airone del faro" });
    K.lore("l_brume", { t: "Ottavio Brume", d: "Presidente della Lega del Porto. La sigla O.B. nel registro, la firma sul contratto della finale. Il Mercante di Nebbia: compra le partite, non i giocatori. I giocatori, dice, costano troppo." });
    const ITEMZ = ["gr_piazza", "gr_moli", "gr_tetti", "gr_deposito", "gr_torre"];
    function allFeathers() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const goal = (s) => ({
      0: "Allo Stadio della Gru, il giorno prima della finale. Alfio ha un'idea per stanotte.",
      1: "Stanotte, al faro: porta le prove alla radio in cima alla torre. Le guardie di Brume salgono e scendono le scale.",
      2: "Domenica, la finale. Il capitano del Nebbia Athletic ti aspetta a centrocampo.",
      3: "Fischio finale. Alfio ti aspetta a bordo campo.",
    }[s] || "La saga è conclusa. Puoi rigiocarla per trovare gli altri finali.");
    const zones = {
      gr_stadio: {
        region: "stadio", name: "Il Cavaliere della Notte · Lo Stadio della Gru", short: "Lo Stadio della Gru", sub: "Tribune di ferro, riflettori, la finale della Lega", bg: "gr_stadio", time: (K, s) => (s >= 2 ? "tramonto" : "notte"), travel: [15, 18],
        w: 30, h: 22, start: [15, 18],
        areas: [[2, 4, 27, 16, "Il campo"], [0, 0, 29, 21, "Lo Stadio della Gru"]],
        flavor: { s: "La panchina del Porto Scuro. Qualcuno ci ha inciso un airone, piccolo piccolo." },
        intro: [["voce", "Lo Stadio della Gru, la sera prima della finale. Le tribune sono vuote, i riflettori accesi a metà. Sul tabellone, già scritto: PORTO SCURO – NEBBIA ATHLETIC."]],
        npcs: (s) => [{ id: "gr_alfio", at: [4, 18] }, { id: "gr_marisa", at: [10, 17] }, ...(F.is("gr_gancio_amico") ? [{ id: "gr_gancio", at: [22, 18] }] : []), ...(F.is("gr_vela_alleata") ? [{ id: "gr_vela", at: [27, 2] }] : []), ...(s >= 2 ? [{ id: "gr_capitano", at: [15, 10] }, { id: "gr_brume", at: [26, 18] }, { id: "gr_dora", at: [7, 19] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 21, ":"); lay(0, 0, 29, 1, "a"); lay(0, 0, 0, 21, "a"); lay(29, 0, 29, 21, "a"); lay(0, 21, 29, 21, "a"); put(29, 19, ">");
          lay(2, 4, 27, 16, ","); put(2, 10, "Q"); put(26, 10, "Q"); lay(1, 2, 28, 2, "b"); put(27, 2, ":"); lay(26, 2, 26, 2, ":");
          put(1, 3, "A"); put(28, 3, "A"); put(12, 18, "s"); put(18, 18, "s"); [[6, 20], [24, 20]].forEach(([x, y]) => put(x, y, "V"));
        },
      },
      gr_torre: {
        region: "porto", name: "Il Cavaliere della Notte · Il faro", short: "Il faro", sub: "La torre, le scale, la radio che arriva in tutta la città", bg: "gr_torre", time: "notte", travel: [2, 18],
        w: 26, h: 20, start: [2, 18], sneakStart: [2, 18], itemCos: "gr_piume3", items: [[23, 17]], buio: 0.48, heroLight: 2.8, hide: "%",
        luci: () => [[13, 2, 4, "255,240,190"], [8, 12, 2.5, "255,200,120"], [19, 8, 2.5, "255,200,120"]],
        areas: [[10, 1, 16, 4, "La lanterna del faro"], [0, 0, 25, 19, "Il faro"]],
        flavor: { "%": "L'ombra della torre. La luce del faro passa sopra, mai qui." },
        intro: [["voce", "Il faro di Porto Scuro, sulla punta del molo. Una torre bianca e rossa, una scala a chiocciola fuori, e in cima la vecchia stanza della radio: da lì, una volta, si avvisavano le navi della tempesta. Stanotte avviserà la città."]],
        npcs: (s) => [
          ...(s === 1 && !F.is("gr_radio") ? [{ id: "gr_sg7", at: [6, 9], route: [[6, 9], [6, 15], [12, 15]], speed: 0.5, pause: 40, guard: { range: 4 } }, { id: "gr_sg8", at: [19, 6], face: "down", guard: { range: 4.5, turn: 100 } }] : []),
          ...(s === 1 && F.is("gr_radio") ? [{ id: "gr_brume", at: [16, 3] }] : []),
          ...(s === 1 && F.is("gr_vela_alleata") ? [{ id: "gr_vela", at: [3, 15] }] : []),
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 19, "w"); lay(1, 5, 24, 18, ":"); lay(10, 1, 16, 4, ":"); lay(13, 4, 13, 5, ":");
          lay(9, 6, 17, 10, "a"); put(13, 10, ":"); lay(10, 7, 16, 9, "a"); put(13, 6, ":"); lay(12, 7, 14, 9, "a");
          lay(2, 7, 3, 9, "K"); lay(20, 12, 22, 14, "K"); lay(15, 14, 16, 16, "E"); lay(4, 11, 5, 12, "K");
          lay(2, 10, 3, 13, "%"); lay(7, 6, 8, 8, "%"); lay(18, 10, 19, 11, "%"); lay(17, 15, 18, 16, "%"); lay(21, 15, 22, 16, "%");
          put(8, 12, "l"); put(19, 8, "l"); put(13, 1, "x"); put(0, 18, "<"); [[5, 17], [11, 13], [22, 6]].forEach(([x, y]) => put(x, y, "V"));
        },
      },
    };
    function radio() {
      if (F.is("gr_radio")) return say([["voce", "La radio trasmette ancora. Fuori, una finestra dopo l'altra, la città si accende."]]);
      F.set("gr_radio", true); bond("leggenda", 2); K.refreshZone();
      K.scene([["voce", "La stanza della radio: valvole, manopole, un microfono di bachelite. Accendi. Una lucina rossa: IN ONDA."], ["voce", F.is("gr_registro_dora") || F.is("gr_contratto_dora") ? "Leggi le prove ad alta voce: date, nomi, cifre, la firma O.B. In fondo, aggiungi: «La commissaria Valli ha già tutto. Domani, allo stadio, guardate bene la tribuna d'onore»." : "Leggi le prove ad alta voce: il registro, pagina per pagina, e il contratto della finale. Date, nomi, cifre. La firma O.B. Poi spegni, senza dire chi sei."], ["voce", "Sotto, una finestra dopo l'altra, Porto Scuro si accende. Tutti stanno ascoltando."], ["gr_brume", "[arrabbiato] (Dalla scala, senza fiato, asciutto come sempre.) Spegni. (Sorride, a fatica.) Non importa. Domani la finale la vince il Nebbia Athletic comunque: i miei giocatori sono più forti. Non mi serve più un contratto, Airone. Mi basta il campo."]], () => { setStep(N, 2); K.enterZone("gr_torre"); }, "gr_torre");
    }
    function finale() {
      const mates = [{ name: "Marisa" }, { name: F.is("gr_gancio_amico") ? "Gancio" : "Il Terzino" }];
      K.notte({ title: "Ombre e Gadget · La finale della Lega del Porto contro il Nebbia Athletic", oppStyle: "pressing", minutes: 90, slots: 4,
        mates, opp: { name: "Nebbia Athletic", color: "#8a8a9a", players: [{ name: "Il Capitano", skin: "#e8c4a0", hair: "#e8e8f0" }, { name: "Foschia", skin: "#f0d0b0", hair: "#5a5a6a" }, { name: "Caligine", skin: "#d9a679", hair: "#2a2a2a" }], keeper: { name: "Il Muro Grigio" } },
        intro: `<p>La finale, sotto i riflettori e la pioggia. Il Nebbia Athletic fa <b>pressing</b> ed è forte davvero. ${F.is("gr_gancio_amico") ? "Gancio gioca con voi: in difesa è un armadio." : ""} Sei tu a decidere la partita, non un contratto.</p>`, winTitle: "PORTO SCURO CAMPIONE!" }, (r) => {
        if (!r.win) return K.scene([["gr_capitano", r.a === r.b ? "[pensa] Pareggio. Il regolamento della Lega vuole la ripetizione. (Ti guarda.) Per la prima volta, giocherei volentieri un'altra partita contro qualcuno." : "[pensa] Abbiamo vinto noi. Davvero, stavolta. (Esita.) Ma il presidente ha chiesto la ripetizione: dice che la radio ha disturbato i giocatori. Ci rivediamo in campo."]], () => K.enterZone("gr_stadio"), "gr_stadio");
        setStep(N, 3); F.set("gr_campioni", true); bond("fiducia", 2);
        K.scene([["voce", "Il fischio finale si perde in un urlo che Porto Scuro non sentiva da anni. Marisa cade in ginocchio sull'erba bagnata. Qualcuno, in curva, accende una torcia; poi cento; poi mille."], ["gr_brume", "[sorpreso] (In tribuna d'onore, con la coppa in mano, si accorge che nessuno lo guarda più.)"], ["voce", "E poi, per la prima volta da trecento giorni, smette di piovere."]], () => K.enterZone("gr_stadio"), "gr_finale");
      });
    }
    function amichevole() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["gr_marisa", r && r.win ? "[felice] Se domani giochiamo così, il contratto lo usiamo per accendere il camino." : "[ride] Meglio sbagliare oggi che domani."]], () => K.enterZone("gr_stadio"), "gr_stadio");
      ask("gr_marisa", "L'ultimo allenamento prima della finale. Tutti contro tutti, sotto i riflettori. Come vuoi giocarlo?", [
        { label: "Di notte, a turni", sub: "Ombre e Gadget · la partita della saga", cls: "hot", fn: () => K.notte({ title: "Ombre e Gadget · L'ultimo allenamento", oppStyle: "equilibrata", minutes: 45, mates: [{ name: "Marisa" }, { name: "Il Terzino" }], opp: { name: "Le riserve del Porto Scuro", color: "#3a6a5a", players: [{ name: "Riserva Uno" }, { name: "Riserva Due" }, { name: "Riserva Tre" }], keeper: { name: "Il Vice" } } }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "gr_amichevole", alt: "az,cage,hd", force: false, oppTeam: "Le riserve", oppColor: "#3a6a5a", us: "Porto Scuro Calcio", homeKit: ["#5a6a8a", "#ffd23f"], mate: "Marisa Onda", squad: ["Marisa Onda", "Il Terzino", "Il Vice"], chap: "Il Cavaliere della Notte · L'ultimo allenamento", bg: "gr_stadio", oppNames: ["Riserva Uno", "Riserva Due", "Riserva Tre", "Il Vice", "La Punta"], intro: "L'ultimo allenamento prima della finale, allo Stadio della Gru.", done: after }) },
        { label: "Non adesso", fn: done },
      ], "gr_stadio");
    }
    function endingAsk() {
      const opts = [];
      if (F.is("gr_registro_dora") || F.is("gr_contratto_dora")) opts.push({ label: "«Commissaria, tocca a lei»", sub: "Il porto torna a respirare", big: true, fn: () => ending("luce") });
      if (F.is("gr_registro_tuo") || F.is("gr_piano_faro")) opts.push({ label: "Sparisci prima che qualcuno ti riconosca", sub: "Il Cavaliere resta nell'ombra", big: true, fn: () => ending("ombra") });
      if (F.is("gr_vela_alleata") && (+F.get("gr_vela_fid", 0)) >= 3) opts.push({ label: "Guarda verso il tetto del mercato", sub: "Due ombre sui tetti", big: true, fn: () => ending("vela") });
      if (allFeathers() && F.is("gr_gancio_amico") && F.is("gr_foto_chiesto")) opts.unshift({ label: "«Alfio, la foto dell'officina. Eri tu.»", sub: "Segreto: tutte le piume, Gancio dalla tua parte, la domanda sulla foto", cls: "hot", big: true, fn: () => ending("airone") });
      if (!opts.length) opts.push({ label: "Sparisci prima che qualcuno ti riconosca", sub: "Il Cavaliere resta nell'ombra", big: true, fn: () => ending("ombra") });
      ask("gr_alfio", "(A bordo campo, con l'ombrello chiuso: non serve più.) Campioni. Senza contratti, senza paura. (Si pulisce gli occhiali.) Brume è in tribuna, con la coppa in mano e nessuno che lo guarda. E adesso, Airone?", opts, "gr_finale");
    }
    function ending(kind) {
      const R = { luce: { coins: 140, cos: ["gr_c3", "gr_luce"] }, ombra: { coins: 140, cos: ["gr_c3", "gr_ombra"] }, vela: { coins: 160, cos: ["gr_c3", "gr_vela"] }, airone: { coins: 260, cos: ["gr_c3", "gr_airone"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        luce: [["gr_dora", "[felice] (Scende in campo con due agenti, il registro e il contratto in mano.) Ottavio Brume, lei è in arresto. Per frode sportiva, corruzione, e per aver rovinato trecento domeniche a questa città."], ["voce", "<b>FINALE · IL PORTO TORNA A RESPIRARE.</b> La Lega del Porto ricomincia da capo, con arbitri nuovi e partite vere. Il Bar del Molo riaccende il televisore. Nessuno abbassa più il volume."]],
        ombra: [["voce", "Quando le torce della curva si girano a cercarti, non ci sei più. Sulla panchina resta solo una piuma grigia."], ["voce", "<b>FINALE · IL CAVALIERE RESTA NELL'OMBRA.</b> Brume lascia la città il giorno dopo, con le valigie e senza la coppa. Nessuno sa chi ha acceso la radio del faro. Ma di notte, sui tetti di Porto Scuro, qualcuno veglia."]],
        vela: [["gr_vela", "[furbo] (Sul tetto del mercato, con le gambe a penzoloni nel vuoto.) Ho restituito tutto: le casse, i soldi, i segreti. Adesso sono una ladra disoccupata. (Ti fa posto.) Allora, Airone. Domani notte, stesso tetto?"], ["voce", "<b>FINALE · DUE OMBRE SUI TETTI.</b> Porto Scuro ha un vigilante e una ladra pentita, che a volte giocano a calcio sul tetto del mercato all'alba. I pescatori dicono che lei è più forte. Probabilmente hanno ragione."]],
        airone: [["gr_alfio", "[pensa] (Ti porta in officina. Apre l'ultimo armadio: dentro c'è un mantello vecchio, rammendato cento volte.) Quarant'anni fa ero più veloce. E molto più stupido. (Sorride.) Sì. Il primo Airone ero io."], ["gr_gancio", "[sorpreso] (Dalla porta, col berretto in mano.) Mio padre me lo diceva sempre: l'Airone aveva le mani di un magazziniere. Non ci ho mai creduto."], ["voce", "<b>FINALE SEGRETO · IL VERO AIRONE.</b> Alfio ti mette in mano una piuma grigia, vecchia di quarant'anni. «Adesso la città ne ha uno migliore», dice. Sulla foto dell'officina, la figura col mantello sembra sorridere."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "gr_finale");
    }
    const talk = {
      gr_alfio() {
        const s = S();
        if (s === 3) return endingAsk();
        const opts = [{ label: "L'officina", sub: "Scegli i gadget della cintura", fn: () => K.officina(done) }];
        if (s === 0) opts.unshift({ label: "«Qual è il piano?»", cls: "hot", fn: () => K.scene([["gr_alfio", "[furbo] Il faro. In cima c'è la vecchia radio delle tempeste: arriva in ogni casa di Porto Scuro. Stanotte qualcuno ci sale con le prove. (Ti guarda.) Qualcuno con un mantello."], ["gr_alfio", "Brume lo sa, che le prove sono in giro. Ha messo le sue guardie sulla scala del faro. Ma le guardie guardano davanti, e il faro fa ombra."]], () => { setStep(N, 1); quest("gr_faro", "La radio del faro", "In cima alla torre, sulla punta del molo. Esci dallo stadio a destra."); done(); }, "gr_stadio") });
        if (F.is("gr_foto") && !F.is("gr_foto_chiesto")) opts.push({ label: "«La foto nell'officina… chi è col mantello?»", fn: () => { F.set("gr_foto_chiesto", true); say([["gr_alfio", "[pensa] (Si pulisce gli occhiali molto a lungo.) Una foto vecchia. Gente vecchia. (Li rimette.) Vinci la finale, e forse un giorno te lo racconto."]]); } });
        opts.push({ label: "Dopo", fn: done });
        return ask("gr_alfio", s === 0 ? "(Sistema i palloni nel sacco, uno per uno.) Domani è la finale. Stanotte, però, c'è ancora lavoro per l'Airone." : s === 1 ? "Il faro è in fondo al molo, a destra dello stadio. Sali, trasmetti, scendi. E non farti vedere." : "Domani si gioca. Dormi, se ci riesci.", opts, "gr_stadio");
      },
      gr_marisa() {
        if (S() <= 1) return ask("gr_marisa", "[pensa] (Palleggia contro il muro della tribuna.) Domani gioco. Anche se il mio nome è su quel contratto. Soprattutto per questo.", [{ label: "L'ultimo allenamento", sub: "Partita secondaria · scegli tu la modalità", fn: amichevole }, { label: "Dopo", fn: done }], "gr_stadio");
        return say([["gr_marisa", S() >= 3 ? "[felice] Campioni! Campioni! Hai sentito? Ha smesso di piovere!" : "[felice] Hai sentito la radio, stanotte? Tutta la città l'ha sentita. Oggi si gioca per davvero."]]);
      },
      gr_gancio() { return say([["gr_gancio", S() >= 3 ? "[ride] Un armadio in difesa, dicevi? (Si gratta la barba.) Mio padre sarebbe contento." : "[felice] Domenica gioco in difesa. Dicono che sono un armadio. Gli armadi non si spostano."]]); },
      gr_vela() {
        if (S() === 1) return say([["gr_vela", "[furbo] Distraggo la guardia della scala. Tu sali. (Sparisce nell'ombra.)"]], () => { F.add("gr_vela_fid", 1); done(); });
        return say([["gr_vela", "[furbo] Io guardo la partita dal tetto della tribuna. Si vede meglio, e non si paga."]]);
      },
      gr_capitano() {
        if (S() === 2) return ask("gr_capitano", "(A centrocampo, sotto la pioggia.) Ho sentito la radio, stanotte. (Si stringe la fascia.) Io non sapevo niente. O non volevo sapere. Oggi gioco per vincere, e basta. Anche voi?", [{ label: "Gioca la finale", sub: "Ombre e Gadget · la finale della Lega", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "gr_stadio");
        return say([["gr_capitano", S() >= 3 ? "[pensa] Avete vinto. Davvero. (Ti stringe la mano.) Era ora." : "Il campo decide."]]);
      },
      gr_brume() {
        if (S() === 1 && F.is("gr_radio")) return say([["gr_brume", "[arrabbiato] (Asciutto, come sempre, anche sotto la pioggia.) Domani, Airone. Domani vediamo chi ha più amici."]]);
        return say([["gr_brume", S() >= 3 ? "[triste] (Guarda la coppa che ha in mano. Non sa a chi darla.)" : "[furbo] (Dalla tribuna d'onore.) Che vinca il migliore. (Sorride.) Lo dico sempre."]]);
      },
      gr_dora() { return say([["gr_dora", S() >= 3 ? "[felice] Bella partita. (Guarda la tribuna d'onore.) Adesso tocca a me." : "Sono qui per vedere la partita. E per vedere chi la guarda."]]); },
      gr_sg7() { return say([["gr_sg7", "(Sale tre gradini, scende tre gradini. Sbadiglia.)"]]); },
      gr_sg8() { return say([["gr_sg8", "(Gira su se stessa come la luce del faro.)"]]); },
    };
    const obj = {
      "gr_stadio:>": () => (S() === 1 ? go("gr_torre", 2, 18) : say([["voce", S() === 0 ? "La strada per il faro, in fondo al molo. Alfio ha detto qualcosa su stanotte: meglio sentirlo prima." : "Il faro, in fondo al molo. Il suo lavoro l'ha fatto."]])),
      "gr_torre:<": () => go("gr_stadio", 27, 19),
      "gr_torre:x:13,1": () => radio(),
    };
    return { n: N, title: "L'ultima partita della notte", sub: "La radio del faro, la finale, l'ultima piuma", goal, start: "gr_stadio", introBg: "gr_stadio", zones, talk, obj,
      intro: () => [["voce", "<b>IL CAVALIERE DELLA NOTTE.</b> Capitolo 3. Domenica si gioca la finale della Lega del Porto. Il risultato, sulla carta, è già scritto. Ma la carta, a Porto Scuro, si bagna."]] };
  }
  boot();
})();
