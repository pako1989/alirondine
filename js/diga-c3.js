// js/diga-c3.js - «LA DIGA DI VALPIANA» · Capitolo 3: Il Paese sotto il Lago
// Il lago si abbassa (a mano e per storia): Valpiana Vecchia riemerge, sei punti-ricordo, la chiesa e il pallone di Zita. Argine livelli 3 e 4.
// Il livello dell'acqua scende e risale: lo scarico basso dà tempo, ma è un prestito.
(function () {
  "use strict";
  function boot() {
    const E = window.__digaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const H = window.__digaH, { setStep, quest, F } = K;
    const N = 3, S = () => K.stepOf(N), PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled })));
      if (l.length) K.say(l, go); else go();
    };
    K.cos("vp_c3", { kind: "shirt", label: "Maglia del '61", val: "#7c3aed", from: "Capitolo 3 di La Diga di Valpiana" });
    K.lore("l_62", { t: "La piena del '62", d: "In una notte il vecchio paese è diventato lago. Quaranta famiglie hanno fatto in tempo a salire. Il campanile no: è rimasto in piedi, con l'acqua fino alle campane." });
    K.lore("l_pallone", { t: "Il pallone del prete", d: "Un pallone di cuoio, troppo grande per tutti. Il prete lo prestava, e il campo diventava la cosa più grande del paese." });

    const MEM = ["m_lamp", "m_scuola", "m_forno", "m_barca", "m_pompa", "m_pali"];
    const nm = () => MEM.filter((k) => F.is("vp_" + k)).length;
    const goal = (s) => ({
      0: "Parla con Zita, in piazza (la panchina in basso a destra).",
      1: "Sali alla diga: Ermete può aprire lo scarico basso, ma ti serve una mano con l'acqua (Argine, livello 3).",
      2: () => `Il lago è sceso. Dalla riva, a destra in basso, il sentiero di Valpiana Vecchia. Ricordi ${nm()}/6, poi la chiesa.`,
      3: "Hai il pallone. Torna da Zita, in piazza."
    }[s]);
    const goalFn = (s) => { const g = goal(s); return typeof g === "function" ? g() : g || "Il capitolo 3 è concluso. La cresta e la notte ti aspettano."; };

    function spot(key, lines, extra) {
      if (S() < 2) { say("voce", "Un'ombra sotto l'acqua. Per ora, un'ombra."); return done(); }
      const first = !F.is("vp_" + key);
      if (!first) { say("voce", lines[0]); return done(); }
      F.set("vp_" + key, true); K.bond("memoria", 1);
      lines.forEach((t) => say("voce", t));
      say("voce", `<b>Memoria +1</b> (ricordi ${nm()}/6).`);
      if (extra) extra();
      done();
    }
    function fin() {
      F.set("vp_c3_done", true); K.flood.set(3);
      K.reward("vp_c3", { coins: 120, cos: "vp_c3" });
      setStep(N, 4); K.finishChapter(N, "ok");
      K.scene([["vp_zita", "[triste] Il mio pallone. Ha il nodo di Sante e il segno del tuo pollice, adesso. Tienilo con te: il giorno che servirà, saprai a chi darlo."], ["vp_zita", "[felice] Una cosa però te la dico. Il lago che hai visto scendere non è un regalo. Torna. Stanotte."], ["voce", `<b>FINE DEL CAPITOLO 3.</b> Memoria ${K.stat("memoria")}/6 · Argine ${K.stat("argine")}.`], ["voce", "Il livello è risalito: ora è Colmo. Il Capitolo 4, «La Notte della Cresta», ti aspetta."]], () => K.openMain(), "dg_paese");
    }

    const talk = {
      vp_zita() {
        if (K.rel.scene("vp_zita")) return;
        const s = S();
        if (s === 0) {
          say("vp_zita", "Mi hai chiesto delle scarpe bagnate. Eccoci. Il mio paese si chiamava Valpiana anche lui. Lo chiamiamo «Vecchia» per non litigare.");
          say("vp_zita", "Nel '62 piovve per nove giorni. La nona notte, la frana chiuse la valle e l'acqua si prese tutto. Quaranta famiglie. Io avevo ventisei anni e un bambino in braccio.");
          say("vp_zita", "[triste] Quel bambino è Ermete. Non glielo dice nessuno: il pallone che ho perso, quella notte, era l'unica cosa che lui voleva portare.");
          say("vp_zita", "Se il lago scendesse di due dita... nel campo si vedrebbe ancora la porta. Non chiedo altro. Se riesci, vai a Valpiana Vecchia e porta su quel pallone.");
          K.learnLore("l_62"); K.learnLore("l_pallone"); setStep(N, 1);
          quest("vp_c3", "Il Paese sotto il Lago", "Sali alla diga: Ermete può aprire lo scarico basso.");
          return done();
        }
        if (s === 1) { say("vp_zita", "Ermete è sulla diga. Digli che sono io a mandarti. Non ti darà retta. Dagli retta tu."); return done(); }
        if (s === 2) { say("vp_zita", `Hai visto già qualcosa? ${nm()} ricordi su sei. Il pallone è dove ha sempre vissuto, in chiesa.`); return done(); }
        if (s === 3) {
          say("vp_zita", "[triste] Lo hai portato. Ha l'odore di fango e di cuoio. Anche di lui, di quando era piccolo.");
          K.inv.give("vp_foto");
          K.rel.add("vp_zita", 6, true); K.bond("memoria", 1);
          return fin();
        }
        return PASS;
      },
      vp_ermete() {
        if (K.rel.scene("vp_ermete")) return;
        const s = S();
        if (s === 1) {
          say("vp_ermete", "[serio] Mia madre ti ha mandato. Lo vedo da come ti guardi i piedi.");
          say("vp_ermete", "Lo scarico basso porta via due metri di lago in una notte. Ma l'acqua che esce deve andare da qualche parte: se la mandi dal lato sbagliato, allaga la strada del paese. Si fa con i sacchi, in fila, e un po' di fortuna.");
          return ask("Ermete indica la ruota rossa della paratoia.", [
            { label: "Provi l'Argine (livello 3)", sub: "Guida l'acqua dello scarico lontano dalle case", big: true, cls: "hot", fn: () => { QL = []; K.argine([3], (r) => { if (r.win) { K.flood.drain(2); K.bond("argine", 1); setStep(N, 2); quest("vp_c3b", "Valpiana Vecchia", "Dalla riva, il sentiero in basso a destra: l'acqua si è ritirata."); say("vp_ermete", "[pensa] Due metri. È quello che ho. L'acqua tornerà: non è un regalo, è un prestito."); say("voce", "Il lago è sceso. Dalla riva, in basso a destra, si apre il sentiero di Valpiana Vecchia."); } else say("vp_ermete", "L'acqua è andata dove non doveva. Aspetto che si calmi. Riprova."); done(); }); } },
            { label: "Non ancora", fn: K.done }
          ]);
        }
        if (s === 2 || s === 3) { say("vp_ermete", "[serio] Vai giù, finché c'è luce. E se vedi una campana ancora appesa, non toccarla: è di mia madre."); return done(); }
        if (S() >= 4) { say("vp_ermete", "[triste] Mi ha detto che le hai ridato il pallone. Non l'ho ringraziata, per quel pallone, in sessant'anni. Ringrazio te."); return done(); }
        return PASS;
      },
      vp_capo() {
        if (S() < 2) return PASS;
        say("vp_capo", "[serio] Quarant'anni fa, qui, ho segnato il mio unico gol. Da quel giorno gioco in difesa: per non rovinare il ricordo.");
        say("vp_capo", "[ride] Il campo è quello lì. Se trovi un pallone, non calciarlo: portalo a chi lo cerca."); done();
      }
    };
    const zones = {
      vp_vecchia: {
        region: "sommerso", name: "Valpiana Vecchia", short: "Vecchia", sub: "Un paese emerso dal lago: tetti, fango e una porta da calcio senza rete", bg: "dg_vecchia", time: "pomeriggio", w: 32, h: 22, base: "i", start: [1, 11],
        itemCos: "vp_c3", items: [[2, 9], [19, 14], [28, 11]],
        areas: [[12, 3, 21, 9, "La chiesa di Valpiana Vecchia"], [22, 12, 30, 17, "Il campo"], [0, 10, 12, 18, "La piazza sommersa"], [0, 0, 31, 21, "Valpiana Vecchia"]],
        npcs: () => (S() >= 2 ? [{ id: "vp_capo", at: [14, 12] }] : []),
        doors: { "0,11": { to: "vp_riva", at: [28, 10] } },
        flood: [[3, 0, 18, 31, 18], [4, 0, 17, 31, 18]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 1, "A"); lay(31, 2, 31, 18, "A"); lay(0, 2, 0, 10, "A"); lay(0, 12, 0, 18, "A"); put(0, 11, "q"); lay(0, 19, 31, 21, "~");
          house(13, 3, 8, 6, { door: [16, 8], roof: "#6b5a4a", enter: { to: "vp_chiesa", at: [8, 12] } });
          house(3, 3, 6, 4, { door: [5, 6], roof: "#7a5a4a", enter: "Una casa senza tetto: l'acqua ha lasciato sul muro una riga, all'altezza del cuore." });
          house(24, 3, 6, 4, { door: [26, 6], roof: "#6a4a3a", enter: "Il forno del paese. Il forno è lì; il pane, no. Resta il profumo, che è forse una bugia." });
          lay(22, 12, 30, 17, "g"); lay(7, 9, 10, 9, "K"); put(6, 12, "Q"); put(20, 11, "P"); put(29, 8, "Y"); put(4, 13, "E"); put(10, 12, "V"); put(26, 13, "F"); put(26, 17, "F");
          lay(14, 10, 24, 10, "r"); [[9, 16], [16, 16], [22, 9]].forEach(([x, y]) => put(x, y, "T"));
        },
        objects: {
          "6,12": () => spot("m_lamp", ["Il lampione della piazza. Zita dice che lo accendevano la sera del ballo, e che tutti sapevano chi invitava chi."], null),
          "20,11": () => spot("m_scuola", ["Un cartello: «SCUOLA — SILENZIO». Lo hanno scritto tre volte, perché la prima non bastava."], null),
          "29,8": () => spot("m_forno", ["Gli scaffali del forno, ancora in fila. Sul più basso, un'impronta di mano nella farina fossile: piccola, quasi un bambino."], null),
          "4,13": () => spot("m_barca", ["Una barca capovolta contro il muro. Non è di Zattera: è la barca del prete, quella usata la notte del '62 per portare in salvo gli anziani."], null),
          "10,12": () => spot("m_pompa", ["La pompa della piazza. Zita dice che, l'ultima sera, qualcuno ha pompato per un'ora per riempire le borracce di tutti."], null),
          "26,13": () => spot("m_pali", ["Il primo palo della porta, bianco, intatto. Sessant'anni sott'acqua e ancora dritto: ostinato, come chi l'ha piantato."], null),
          "26,17": () => spot("m_pali", ["Il secondo palo. Tra i due, uno spazio di sette metri: la porta più larga e più difesa di tutta la valle."], null)
        },
        decor(g, cx, cy, d) { H.plaque(g, "VALPIANA VECCHIA", d.X(16) + 8, d.Y(3) - 6, "#a78bfa"); H.plaque(g, "◂ RIVA", d.X(1) + 8, d.Y(10) + 6, "#94a3b8"); H.plaque(g, "IL CAMPO", d.X(27) + 8, d.Y(12) + 6, "#86efac"); H.plaque(g, "LA CHIESA", d.X(16) + 8, d.Y(9) + 4, "#fbbf24"); },
        intro: [["voce", "Il lago si è ritirato come una marea stanca. Sotto, un paese intero: tetti scoperchiati, strade di fango, un campanile con l'orlo di alghe."], ["voce", "Non c'è rumore. Solo, da lontano, quello che sembra il fischio di una partita mai finita."]]
      },
      vp_chiesa: {
        interior: true, region: "sommerso", name: "Valpiana Vecchia · La Chiesa", short: "Chiesa", sub: "Panche rovesciate, un confessionale e una luce grigia dalle finestre", bg: "dg_vecchia", w: 16, h: 14, start: [8, 12], outside: ["vp_vecchia", 16, 9],
        objects: {
          "8,3": () => {
            if (S() < 2) { say("voce", "Il confessionale. Chiuso."); return done(); }
            if (K.inv.has("vp_pallone") || S() >= 3) { say("voce", "Il confessionale, ora vuoto. Dentro, la sagoma di un pallone sul legno."); return done(); }
            if (nm() < 3) { say("voce", `Il confessionale non si apre: l'acqua l'ha gonfiato. Forse, se ascolti ancora il paese (ricordi ${nm()}/3), si decide.`); return done(); }
            say("voce", "Il confessionale cede con un sospiro. Dentro, avvolto in un sacco di tela, un pallone di cuoio con un nodo di spago sull'asola e il nome «SANTE» a pennarello.");
            say("voce", "Alle tue spalle, un rumore basso: il lago si sta riprendendo il suo spazio. Dal portone entra l'acqua, scura e lenta.");
            const l = flush(); return K.say(l, () => K.argine([4], (r) => {
              if (r.win) { K.inv.give("vp_pallone"); K.bond("argine", 1); K.bond("memoria", 1); setStep(N, 3); quest("vp_c3c", "Il pallone di Zita", "Torna da Zita, in piazza."); say("voce", "Prendi il pallone. L'acqua si ferma sulla soglia, come un ospite educato. Fuori, il cielo è già di un altro colore."); say("voce", "Ora Zita: in piazza, alla panchina."); }
              else say("voce", "L'acqua si è fermata da sola, o forse è stata gentile. Il pallone è ancora lì. Riprova quando vuoi.");
              done();
            }));
          },
          "3,6": () => { say("voce", "Una cassa di legno, con dentro la foto di una classe: dodici ragazzi davanti a una chiesa. In fondo, un pallone più grande di tutti."); if (!K.inv.has("vp_foto") && !F.is("vp_foto_ch")) { F.set("vp_foto_ch", true); K.inv.give("vp_foto"); say("voce", "<b>Ricevi la Foto della classe del '61.</b>"); } done(); }
        },
        build(L) {
          const { lay, put } = L;
          H.room(L, 16, 14, "i", 8); lay(7, 3, 9, 3, "Y"); put(3, 6, "K"); lay(2, 8, 5, 8, "K"); lay(10, 8, 13, 8, "K"); lay(2, 10, 5, 10, "K"); lay(10, 10, 13, 10, "K");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CHIESA DI SAN FIUME VECCHIA", d.X(8) + 8, d.Y(1) + 6, "#fbbf24"); H.plaque(g, "CONFESSIONALE", d.X(8) + 8, d.Y(4) + 4, "#a78bfa"); }
      }
    };
    return {
      n: N, title: "Il Paese sotto il Lago", sub: "Un campo, un campanile e un pallone sparito",
      goal: goalFn, start: "vp_paese", introBg: "dg_vecchia", zones, talk, obj: {},
      patch: { vp_riva: { npcs: (s, l) => l } },
      intro: [["voce", "La sera dopo il registro, Zita ti aspetta sulla panchina con una domanda piccola, quella che pesa di più."], ["voce", "«Hai le scarpe bagnate?»"]]
    };
  }
  boot();
})();
