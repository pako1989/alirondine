// js/officina-c4.js - «L'OFFICINA DEI GIGANTI DI RUGGINE» · Capitolo 4: La Battaglia delle Caldaie
// Tre partite (livello 2, 3, 3), Rina e Gasparre in panchina, Vanda in tribuna. Finali: vapore, patto, nucleo (segreto, 3 ingranaggi d'oro).
(function () {
  "use strict";
  function boot() {
    const E = window.__officinaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__officinaH) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__officinaH(K), { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.cast("of_rina", "Rina", "Meccanica capo dell'Officina", { style: "ponytail", hair: "#3a2a1a", acc: ["occhiali", "grembiule"], shirt: "#b45309", skin: "#d9a679", bg: ["#78350f", "#fdba74"] }, "Porta la chiave inglese del padre come altri portano un anello.");
    H.cast("of_gasparre", "Gasparre", "Vecchio fonditore", { style: "bald", hair: "#aaa", beard: "folta", acc: ["berretto"], shirt: "#44403c", skin: "#c68642", bg: ["#292524", "#d6d3d1"] }, "Parla alle caldaie come si parla ai cani.");
    H.cast("of_vanda", "Vanda", "Direttrice dell'Acciaio Supremo", { style: "bun", hair: "#1a1a1a", acc: ["occhiali"], shirt: "#27272a", skin: "#e0b890", bg: ["#18181b", "#d4d4d8"] }, "Firma sempre con la penna nuova.");
    K.cos("of_c4", { kind: "shirt", label: "Maglia delle Caldaie", val: "#7c2d12", from: "Capitolo 4 di L'Officina dei Giganti" });
    K.lore("l_nucleo", { t: "Il Nucleo Dormiente", d: "Sotto le Caldaie dorme il cuore del primo gigante. Si dice sia nato con tre ingranaggi d'oro, e che gli altri li abbia persi per strada." });

    const goal = (s) => ({
      0: "Parla con Rina all'ingresso dell'Arena.",
      1: "Da Brontolo: pressione 7 per caricare la caldaia centrale.",
      2: "Parla con Rina: prima partita (Reparto Alfa).",
      3: "Parla con Gasparre: seconda partita (Reparto Beta).",
      4: "Parla con Vanda: la finale contro l'Acciaio Supremo."
    }[s] || "Il capitolo 4 è concluso.");

    function final(win) {
      const gears = !!(F.is("of_gear1") && F.is("of_gear2") && F.is("of_gear3"));
      const patto = F.is("of_patto"), end = patto ? "patto" : "vapore";
      K.reward("of_c4" + end, { coins: 260, cos: "of_c4" });
      setStep(N, 5);
      const txt = gears
        ? [["voce", "Al fischio finale, Gasparre pone i tre ingranaggi d'oro nel petto di Brontolo. Il vecchio gigante sospira, si alza e guarda lo stadio come se lo vedesse per la prima volta."], ["of_gasparre", "[felice] Non l'ho costruito io. L'ho solo ritrovato."], ["voce", `<b>FINE DELLA STORIA · Il Nucleo Dormiente</b><br>Il primo gigante è tornato. Pressione ${K.steam.bar()} · Scafo ${K.stat("scafo")} · Fiducia ${K.stat("fiducia")}.`]]
        : patto
          ? [["voce", "Vincete. Vanda firma con la penna nuova. Sotto le ciminiere, i turni diventano più corti e le catene più lunghe."], ["of_rina", "[pensa] Abbiamo vinto e abbiamo ceduto. Resta da capire in che ordine."], ["voce", `<b>FINE DELLA STORIA · Il Patto dell'Acciaio</b><br>Pressione ${K.steam.bar()} · Scafo ${K.stat("scafo")} · Fiducia ${K.stat("fiducia")}.`]]
          : [["voce", "Vincete. La Corporazione se ne va con le sue valigette; le ciminiere, per la prima volta in quarant'anni, fumano per scelta."], ["of_rina", "[felice] L'Officina è di chi la fa funzionare. Mio padre l'avrebbe detto meglio, ma più lungamente."], ["voce", `<b>FINE DELLA STORIA · L'Età del Vapore Rigenerato</b><br>Pressione ${K.steam.bar()} · Scafo ${K.stat("scafo")} · Fiducia ${K.stat("fiducia")}.`]];
      K.finishChapter(N, gears ? "nucleo" : end); K.end(end); if (gears) K.end("nucleo");
      K.scene(txt.concat([["voce", "Gli altri finali sono nel Registro."]]), () => K.openMain(), "of_titolo");
    }
    function charge() {
      if (K.steam.level() < 7) { say("of_brontolo", "[serio] Fsss... (Servono 7 di pressione per la caldaia centrale.)"); say("voce", `Pressione ${K.steam.bar()}.`); return done(); }
      K.steam.need(4);
      say("voce", "La caldaia centrale si accende con un rombo da stadio. Le altre due rispondono. Brontolo si raddrizza."); setStep(N, 2); K.bond("fiducia", 1); done();
    }
    function game(level, opp, title, nextStep, lines) {
      H.play(level, opp, title, (r) => {
        if (r && r.win) { lines.forEach((l) => say(l[0], l[1])); K.bond("fiducia", 1); if (nextStep === 5) return final(true); setStep(N, nextStep); done(); }
        else { say("of_rina", "Persa. Controlla la pressione e riprova: la caldaia ricorda tutto."); done(); }
      });
    }
    const gen = H.brontolo("of_stall4");
    const talk = {
      of_rina() {
        if (K.rel.scene("of_rina")) return;
        const s = S();
        if (s === 0) {
          say("of_rina", "[serio] Eccoci alle Caldaie. Tre partite, tre reparti. Se vinciamo l'ultima, il distretto torna nostro. Se perdiamo, torna di chi ha la penna nuova.");
          K.learnLore("l_nucleo"); setStep(N, 1); quest("of_c4", "La Battaglia delle Caldaie", "Pressione 7: carica la caldaia centrale da Brontolo.");
          return done();
        }
        if (s === 2) { say("of_rina", "[serio] Reparto Alfa. Giocano a muro. Rompiamolo."); return game(2, "Reparto Alfa", "Caldaie · Reparto Alfa", 3, [["of_rina", "[felice] Uno. Ne mancano due."]]); }
        say("of_rina", s === 1 ? "Carica quella caldaia." : "Ci siamo quasi."); done();
      },
      of_gasparre() {
        if (K.rel.scene("of_gasparre")) return;
        const s = S();
        if (s === 3) { say("of_gasparre", "[pensa] Reparto Beta. Hanno giganti più veloci. Ma la velocità, in caldaia, va in stallo."); return game(3, "Reparto Beta", "Caldaie · Reparto Beta", 4, [["of_gasparre", "[felice] Due. Brontolo canta."]]); }
        say("of_gasparre", "Piano e costante. È l'unica ricetta, e la più difficile."); done();
      },
      of_vanda() {
        if (K.rel.scene("of_vanda")) return;
        const s = S();
        if (s === 4) { say("of_vanda", "[serio] Finale. L'Acciaio Supremo contro l'Officina. Spero che la tua caldaia regga: il Patto, nel caso, è ancora sul tavolo."); return game(3, "Acciaio Supremo", "Caldaie · Finale", 5, [["of_vanda", "[pensa] Annoto. Annoto con interesse."]]); }
        say("of_vanda", "Prima le formalità, poi la finale."); done();
      },
      of_brontolo: H.brontolo("of_stall4", () => {
        const s = S();
        if (s === 0) { say("of_brontolo", "[serio] ...Fsss. (Parla con Rina.)"); done(); return true; }
        if (s === 1) {
          ask(`Pressione ${K.steam.bar()}`, [
            { label: "🔥 Carica la caldaia", sub: "Serve pressione 7 (ne spende 4)", big: true, cls: "hot", fn: charge },
            { label: "♨️ Alimenta", sub: "+3, passa una fascia", fn: () => H.feed(3, "of_stall4", done) },
            { label: "Altro…", fn: gen }
          ]); return true;
        }
        return false;
      })
    };
    const zones = {
      of_caldaie: {
        region: "caldaie", name: "L'Arena delle Caldaie", short: "Caldaie", sub: "Fuoco, passerelle e tre reparti in attesa", bg: "of_caldaie", time: "sera",
        w: 28, h: 18, start: [4, 9], items: [[2, 13], [24, 14]],
        areas: [[0, 0, 27, 17, "L'Arena delle Caldaie: calda, rumorosa e sincera"]],
        npcs: () => [{ id: "of_brontolo", at: [10, 9] }, { id: "of_rina", at: [14, 7] }, { id: "of_gasparre", at: [14, 11] }, { id: "of_vanda", at: [21, 9] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(7, 14, "b"); put(20, 14, "b"); [[3, 3], [24, 3], [5, 15], [22, 15], [12, 3], [16, 3]].forEach(([x, y]) => put(x, y, "t"));
        }
      }
    };
    return {
      n: N, title: "La Battaglia delle Caldaie", sub: "Tre reparti, un Patto e un gigante che si sveglia",
      goal, start: "of_caldaie", introBg: "of_caldaie", zones, talk, obj: {},
      intro: [["voce", "L'Arena delle Caldaie ha la temperatura di una promessa mantenuta male."], ["voce", "Tre reparti, tre partite. In tribuna, qualcuno ha già scelto con quale penna firmare."]]
    };
  }
  boot();
})();
