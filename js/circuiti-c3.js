// js/circuiti-c3.js - «NEO-RONDINE 2099» · Capitolo 3: La Terrazza della Vektor Corp
// L'eliporto a seicento metri: pista di luce, hangar con l'ispettore Vance, il salotto-giardino e il Barone. Sovraccarico contro Z-Zero.
(function () {
  "use strict";
  function boot() {
    const E = window.__circuitiCore;
    if (!E || !E.api || !E.api.addChapter || !window.__circuitiH || !window.__emp) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__circuitiH(K), { say, done, ask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("nr_c3", { kind: "shirt", label: "Cappotto da eliporto", val: "#e879f9", from: "Capitolo 3 di Neo-Rondine 2099" });
    K.lore("l_vance", { t: "L'Ispettore Vance", d: "Polizia Urbana. Cerca da anni la prova definitiva sui bonifici offshore della Vektor. Non gli danno più i fondi, e non lo licenziano: sarebbe una conferma." });
    K.lore("l_sovraccarico", { t: "Il Sovraccarico", d: "A carica piena la sfera può scaricare un impulso che cancella gli schermaggi: contro un portiere quantistico, è l'unica carta." });

    const goal = (s) => ({
      0: "Sali sull'eliporto. Il Barone Vektor ti aspetta davanti alla torre (nord).",
      1: "Cerca l'Ispettore Vance nell'hangar, a ovest dell'eliporto.",
      2: "Sfida Z-Zero sulla pista di luce, al centro dell'eliporto, con il Sovraccarico.",
      3: "Z-Zero è battuto: parla con Kira.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      F.set("nr_c3_done", true);
      K.reward("nr_c3", { coins: 130, cos: "nr_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["nr_vektor", "[disperato] Impossibile. Non si batte un'equazione con una gamba. ...Il Nucleo. Seguimi, se hai il coraggio di vedere come funziona tutto."], ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>⚡ Carica ${K.stat("energia")} · 💻 Hacking ${K.stat("hackeraggio")} · Fama ${K.stat("fama")}`], ["voce", "Il Capitolo 4, «Il Cuore del Server Centrale», ti aspetta."]]), () => K.openMain(), "nr_terrazza");
    }
    function match() {
      say("nr_zero", "[freddo] Resa dei conti a seicento metri: calcolo traiettoria. Ripeto: calcolo traiettoria. Il mio portiere parerà ogni tiro, tranne quello che non esiste.");
      H.play(3, "Z-Zero & la Squadra del Barone", "Sovraccarico · L'eliporto", (r) => {
        if (r && r.win) { setStep(N, 3); say("nr_zero", "[pensa] Traiettoria non catalogata. Chiedo scusa al Barone. Non so a chi altro chiedere."); K.bond("fama", 12); K.bond("hackeraggio", 5); say("nr_kira", "[felice] Hai fatto saltare il portiere quantistico! Vektor sta scappando verso la torre: vai!"); setStep(N, 4); fin(); }
        else { say("nr_zero", "[freddo] Probabilità confermata. Il Sovraccarico richiede carica piena: usa i nodi e il tiro EMP."); done(); }
      });
    }
    function offer() {
      ask("Il Barone offre un assegno in bianco prima del fischio d'inizio. Dietro di lui, il vento scuote il tetto.", [
        { label: "✊ Rifiuta e dichiara guerra aperta", sub: "+15 Fama, finale «libero» sbloccato", big: true, cls: "hot", fn: () => { K.bond("fama", 15); F.set("nr_rifiuta", true); setStep(N, 1); quest("nr_c3b", "L'Ispettore nell'hangar", "Cerca Vance nell'hangar, a ovest."); say("nr_kira", "[arrabbiato] Non ascoltarlo! Se firmi, i bassifondi rimarranno al buio per altri cinquant'anni!"); say("nr_vektor", "[freddo] Che peccato. Era un buon assegno. Si dice che cancelli la memoria dei debiti."); done(); } },
        { label: "🔍 Esita, studiando i suoi punti deboli", sub: "+15 Hacking, Dossier completo", fn: () => { K.bond("hackeraggio", 15); F.set("nr_esita", true); ["scommesse", "microfilm", "bonifico", "chip"].forEach((i) => K.dossier.add("vektor", i)); setStep(N, 1); quest("nr_c3b", "L'Ispettore nell'hangar", "Cerca Vance nell'hangar, a ovest."); say("nr_kira", "[arrabbiato] Non ascoltarlo! Se firmi, i bassifondi rimarranno al buio per altri cinquant'anni!"); say("nr_vektor", "[furbo] Prenditi il tempo, Campione. Il tempo è l'unica cosa che non ti vendo. Ancora."); done(); } }
      ]);
    }

    const talk = {
      nr_vektor() {
        if (K.rel.scene("nr_vektor")) return;
        const s = S();
        if (s === 0) {
          say("nr_vektor", "[furbo] Ammiro la tua tenacia, Campione. Ma il calcio è un'industria da quaranta miliardi: unisciti a me o verrai cancellato dai registri.");
          say("nr_vektor", "Ti ho portato fino a qui per una ragione. Il talento umano è obsoleto: un algoritmo non si stanca, non si infortuna e non chiede aumenti. Tu sei un bell'esempio di qualcosa che non esisterà più.");
          setStep(N, 0); return offer();
        }
        say("nr_vektor", s < 3 ? "[freddo] Ti aspetto sulla pista. Non farmi attendere: sto pagando i secondi." : "[disperato] Non è finita. Il Nucleo ti aspetta."); done();
      },
      nr_kira() {
        if (K.rel.scene("nr_kira")) return;
        say("nr_kira", S() >= 1 ? "[serio] Fai da solo ma ricordati: se i droni ti beccano, un terminale ti salva. O un cassonetto." : "[serio] Vektor è qui. Non sprecare i pochi attimi in cui non ha le guardie intorno."); done();
      },
      nr_vance() {
        if (K.rel.scene("nr_vance")) return;
        const s = S();
        if (s === 1) {
          say("nr_vance", "[serio] Ispettore Vance, Polizia Urbana. Sono quindici anni che cerco i bonifici offshore della Vektor. Il sigaro è spento da più tempo ancora.");
          say("nr_vance", "Questo microfilm viene dal Piano 40: partite con i risultati scritti accanto, datate prima del fischio. Prendilo. Il mio ufficio non ha più fondi, ma ha ancora una cassaforte.");
          K.learnLore("l_vance"); K.learnLore("l_sovraccarico"); K.dossier.add("vektor", "microfilm"); F.set("nr_vance_met", true); setStep(N, 2); quest("nr_c3c", "Il Sovraccarico", "Sfida Z-Zero sulla pista di luce.");
          return ask("Vance apre un fascicolo sul tavolo da lavoro.", [
            { label: "📂 Apri il Dossier con Vance", big: true, cls: "hot", fn: () => { K.dossier.open(() => done(), false, "vektor"); } },
            { label: "Più tardi", fn: done }
          ]);
        }
        if (s >= 2) return ask("Vance ti ascolta, con il sigaro tra le dita.", [
          { label: "📂 Apri il Dossier", fn: () => { K.dossier.open(() => done(), false, "vektor"); } },
          { label: "Nessuna novità", fn: () => { say("nr_vance", "[serio] Quando ne avrai, io ci sono. Il mio fascicolo ha fame."); done(); } }
        ]);
        say("nr_vance", "[pensa] Parla prima col Barone. Poi torna: ti dirò cosa non torna."); done();
      },
      nr_zero() {
        if (K.rel.scene("nr_zero")) return;
        if (S() === 2) return match();
        say("nr_zero", "[freddo] Sistema in attesa. Il portiere guarda un punto che esiste solo nel suo calcolo."); done();
      },
      nr_nyx() { if (K.rel.scene("nr_nyx")) return; say("nr_nyx", "[serio] L'imparzialità, stasera, non si dirige: si decide."); done(); },
      nr_drone() { say("nr_drone", "[freddo] Soggetto non autorizzato. Segnalazione in corso."); done(); },
      nr_volt() {
        if (K.rel.scene("nr_volt")) return;
        say("nr_volt", "[furbo] Ultime scorte prima del Sovraccarico. Il prezzo? Il tempo che hai.");
        ask(`Fama ${K.stat("fama")} · Carica ${K.stat("energia")}`, [
          { label: "🧪 Pillola refrigerante", sub: "5 Fama", disabled: K.stat("fama") < 5 || K.inv.has("nr_pillola"), fn: () => { K.bond("fama", -5); K.inv.give("nr_pillola"); say("nr_volt", "[ride] Fresca come un ricatto."); done(); } },
          { label: "🔋 Cella al litio sovraccaricata", sub: "10 Fama", big: true, cls: "hot", disabled: K.stat("fama") < 10 || K.inv.has("nr_cella"), fn: () => { K.bond("fama", -10); K.inv.give("nr_cella"); say("nr_volt", "[ride] Con questa, il portiere pensa ancora meno."); done(); } },
          { label: "🔋 Ricarica", sub: "+15 Carica, passa una fascia", fn: () => { K.bond("energia", 15); K.clock.advance(1, done); } },
          { label: "Niente", fn: done }
        ]);
      }
    };

    const zones = {
      nr_terrazza: {
        region: "terrazza", name: "Neo-Rondine 2099 · L'Eliporto", short: "Eliporto", sub: "Seicento metri sopra la pioggia, vento a sessanta nodi", bg: "nr_terrazza", time: "notte", w: 32, h: 22, base: "u", start: [15, 19], sneakStart: [15, 19],
        itemCos: "nr_c3", items: [[2, 3], [29, 2], [29, 19], [8, 13]], hide: "h",
        areas: [[10, 6, 21, 15, "La pista dell'eliporto"], [0, 8, 6, 14, "L'hangar"], [1, 16, 12, 21, "Il salotto-giardino"], [24, 6, 27, 16, "Le piastre del cargo"], [8, 0, 23, 4, "La torre Vektor"], [0, 0, 31, 21, "L'eliporto"]],
        act: { K: "Usa il terminale", N: "Guarda la colonna olografica", E: "Guarda l'antenna", Q: "Guarda l'insegna", I: "Guarda lo sfiato", T: "Guarda il tavolo", D: "Guarda il bancone", J: "Guarda il jukebox", x: "Apri il cassetto", q: "Entra", n: "Leggi il cartello", s: "Siediti un momento" },
        flavor: { n: "«ELIPORTO VEKTOR · VENTO MAX 60 NODI · I TIFOSI NON SONO AUTORIZZATI ALL'ATTERRAGGIO».", N: "Una colonna olografica: un elicottero finto atterra, decolla, atterra. Nessuno lo ferma.", E: "Un'antenna: una lancia di ferro che punge il cielo per ascoltare i discorsi di altri.", Q: "«VEKTOR · IL FUTURO È GIÀ PAGATO».", I: "Sfiato: aria calda che sale dai piani sotto, odorosa di fritto di lusso.", T: "Un tavolo da giardino con candeline elettriche e due bicchieri di cristallo.", D: "Un bancone in legno vero: a Neo-Rondine, il lusso è una pianta che non è sintetica.", J: "Un jukebox che suona solo valzer. Nessuno sa il perché." },
        loot: { "1,19": { id: "nr_datapad", text: "Nel cassetto del bancone, avvolto in un tovagliolo di lino: un datapad inciso «1960».", empty: "Il cassetto è vuoto. Rimane l'odore di vecchio whisky." } },
        objects: {
          "9,7": () => H.hackMenu("Terminale dell'eliporto", [
            { id: "dev_nr_terrazza_0", label: "Deviare il drone di pattuglia", sub: "Guarda il cielo", cost: 10, run: () => { say("voce", "Il drone alza lo sguardo verso un elicottero che non c'è. Per un po' sarà felice."); done(); } },
            { id: "pol_nr_terrazza", label: "Invertire le piastre del cargo", sub: "Il cargo est è libero", cost: 8, run: () => { say("voce", "Le piastre del cargo smettono di mordere. Adesso sono solo lamiera."); done(); } },
            { id: "blackout", label: "Forzare un blackout", sub: "Luci e droni spenti", cost: 6, alert: true, once: false, run: () => { K.clock.set(K.clock.day(), 1); say("voce", "I riflettori si spengono. La rete segna il tuo nome in rosso."); done(); } },
            { id: "ric", label: "Ricarica alla presa", sub: "+20 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 20); K.clock.advance(1, done); } }
          ]),
          "15,4": () => { if ((K.mem().done || {})[3]) return K.go("nr_penthouse", 11, 16); say("voce", "La porta della torre è sigillata. Prima, il Barone e Z-Zero."); done(); }
        },
        onSeen: () => say([["voce", "Un faro ti inquadra: il drone ti riaccompagna con gentilezza al bordo sud. Ti sembra di sentire una risata, da molto in alto."]], done),
        npcs: (s) => {
          const l = [{ id: "nr_kira", at: [6, 18] }, { id: "nr_volt", at: [10, 19] }];
          if (s < 3) l.push({ id: "nr_vektor", at: [13, 5] });
          if (s >= 2 && s < 3) l.push({ id: "nr_zero", at: [15, 10] });
          if (!K.hack.on("dev_nr_terrazza_0") && K.clock.slot() !== 1) l.push({ id: "nr_drone", at: [9, 5], route: [[9, 5], [22, 5], [22, 16], [9, 16]], speed: 0.55, guard: { range: K.clock.slot() === 2 ? 6 : 5, cone: 0.55 } });
          else if (K.hack.on("dev_nr_terrazza_0")) l.push({ id: "nr_drone", at: [15, 16], face: "up", guard: { range: 3, cone: 0.3 } });
          if (K.clock.slot() === 2 || K.hack.heat() >= 2) l.push({ id: "nr_drone", at: [26, 7], route: [[26, 7], [30, 7], [30, 15], [26, 15]], speed: 0.6, guard: { range: 5, cone: 0.5 } });
          return l;
        },
        intro: [["voce", "La Terrazza della Vektor Corp. Seicento metri sopra la pioggia: qui il cielo è nitido e i problemi sono in ordine alfabetico."], ["voce", "In fondo, la torre del Barone. In mezzo, la pista di luce dell'eliporto."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "u"); lay(8, 0, 23, 4, "C"); put(15, 4, "q");
          lay(10, 6, 21, 15, "d"); [[10, 6], [21, 6], [10, 15], [21, 15]].forEach(([x, y]) => put(x, y, "N"));
          lay(0, 8, 6, 14, "C"); put(6, 11, "q");
          lay(24, 6, 27, 16, "e"); lay(28, 6, 31, 16, "i"); lay(28, 14, 30, 16, "R");
          lay(1, 16, 12, 20, "p"); lay(2, 17, 8, 17, "D"); [[4, 19], [8, 19]].forEach(([x, y]) => put(x, y, "T")); put(12, 18, "J"); put(1, 19, "x"); put(5, 14, "s");
          [[9, 7], [22, 12]].forEach(([x, y]) => put(x, y, "K"));
          [[3, 3], [28, 3], [3, 6], [29, 5], [12, 12], [20, 8]].forEach(([x, y]) => put(x, y, "E"));
          [[14, 0], [17, 0]].forEach(([x, y]) => put(x, y, "Q")); [[7, 4], [24, 4], [7, 17], [30, 17]].forEach(([x, y]) => put(x, y, "I"));
          put(2, 7, "n"); [[7, 18], [9, 18], [5, 4], [26, 2]].forEach(([x, y]) => put(x, y, "h"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "VEKTOR CORP · ELIPORTO", d.X(15) + 8, d.Y(4) - 6, "#e879f9"); H.plaque(g, "HANGAR", d.X(6) + 8, d.Y(11) - 6, "#a3e635"); H.plaque(g, "SALOTTO-GIARDINO", d.X(5) + 8, d.Y(16) - 6, "#facc15"); H.plaque(g, "CARGO ⚡", d.X(25) + 24, d.Y(6) - 6, "#fbbf24"); }
      },
      nr_hangar: {
        interior: true, region: "officina", name: "Neo-Rondine 2099 · L'Hangar di Vance", short: "Hangar", sub: "Un elicottero senza rotore, casse di fascicoli e un ispettore stanco", bg: "nr_officina", w: 22, h: 14, start: [10, 12], outside: ["nr_terrazza", 7, 11],
        act: { M: "Guarda il banco", L: "Guarda la lavagna", K: "Usa il terminale", B: "Guarda la branda", x: "Apri la cassa", Q: "Guarda l'insegna", T: "Guarda il tavolo" },
        flavor: { M: "Un banco di lavoro: cacciaviti, una lente e un panino che sembra più vecchio del fascicolo.", L: "Una lavagna con fili rossi, foto di arbitri-androidi, e un punto interrogativo grande come un pallone.", B: "Una branda: due coperte, un termos e una foto di una bambina con un fischietto.", T: "Un tavolo di riunione: caffè freddo, fascicoli aperti, una pila di speranze.", R: "Un elicottero senza rotore, in manutenzione dal 2091. Qualcuno ci ha scritto «AIUTO» con il dito nella polvere.", Q: "«POLIZIA URBANA · SEZIONE CRIMINI FINANZIARI · NON CHIAMARE».", x: "Una cassa di fascicoli. Tutti con la stessa intestazione: «Vektor»." },
        objects: { "18,3": () => H.hackMenu("Terminale del registro voli", [
          { id: "voli", label: "Leggere il registro voli del Barone", sub: "+1 prova nel Dossier", cost: 8, run: () => { K.dossier.add("vektor", "bonifico"); say("voce", "Ogni mese, un elicottero porta un valigetta a quattro indirizzi. Quattro arbitri-androidi, quattro valigette, nessuna coincidenza."); done(); } },
          { id: "ric7", label: "Ricarica alla presa", sub: "+15 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 15); K.clock.advance(1, done); } }
        ]) },
        npcs: () => [{ id: "nr_vance", at: [7, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 21, 13, "i"); lay(0, 0, 21, 1, "a"); lay(0, 0, 0, 13, "a"); lay(21, 0, 21, 13, "a"); lay(0, 13, 21, 13, "a"); put(10, 13, "v");
          lay(2, 2, 6, 2, "L"); lay(14, 5, 19, 7, "R"); put(18, 3, "K"); lay(3, 5, 5, 5, "M"); put(3, 10, "B"); put(4, 10, "B"); put(16, 10, "x"); put(17, 10, "x"); put(8, 8, "T"); put(9, 8, "T"); put(20, 2, "Q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "POLIZIA URBANA · SEZ. CRIMINI FINANZIARI", d.X(10) + 8, d.Y(1) + 4, "#f59e0b"); }
      }
    };
    return {
      n: N, title: "La Terrazza della Vektor Corp", sub: "Resa dei Conti a Seicento Metri",
      goal, start: "nr_terrazza", introBg: "nr_terrazza", zones, talk, obj: {},
      intro: [["voce", "L'ascensore panoramico ti lascia sul tetto del mondo. Fa freddo, ma di un freddo costoso."], ["nr_kira", "[serio] Vektor ti ha invitato. Non è mai un bene quando un nemico ti invita."]]
    };
  }
  boot();
})();
