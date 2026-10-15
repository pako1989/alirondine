// js/gp-c3.js - GRAN PREMIO DEL PALLONE · Capitolo 3 «Il Gran Premio»
// La finale. Chi rovina le gare? Gli indizi, una scelta di fronte al sabotatore, la gara decisiva contro la Scuderia Fiamma e la Coppa Rotonda.
// Cinque bandiere (finali): a scacchi, la Coppa di due, la voce nuova, l'Officina rinasce e il giro perfetto (segreto).
(function () {
  "use strict";
  function boot() { const D = window.__gp; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);
    const indizi = () => ["gp_c1", "gp_c2", "gp_c3"].filter((f) => F.is(f)).length;

    K.cos("gp_c3", { kind: "shirt", label: "Tuta della Bandiera", val: "#f4f4f4", from: "Completa il Capitolo 3 di Gran Premio del Pallone" });
    K.cos("gp_e_scacchi", { kind: "hairc", label: "Capelli a Scacchi", val: "#9a9aa4", from: "Bandiera «A scacchi»" });
    K.cos("gp_e_condivisa", { kind: "hairc", label: "Capelli d'Argento", val: "#d0d0dc", from: "Bandiera «La Coppa di due»" });
    K.cos("gp_e_voce", { kind: "hairc", label: "Capelli Menta", val: "#6af0c8", from: "Bandiera «La voce nuova»" });
    K.cos("gp_e_officina", { kind: "hairc", label: "Capelli Blu Officina", val: "#2a6adf", from: "Bandiera «L'Officina rinasce»" });
    K.cos("gp_e_giro", { kind: "hairc", label: "Capelli d'Oro Puro", val: "#ffd23f", from: "Bandiera segreta «Il giro perfetto»" });
    K.lore("l_sabotatore", { t: "Gli scherzi della pista", d: "Olio sul tratto sbagliato, un bullone limato, un filo che scende da una finestra. Non erano cattiverie: erano <i>effetti speciali</i>. Il telecronista li chiamava «colpi di scena». Le macchine, qualche volta, «incidenti»." });

    const goal = (s) => ({
      0: "Il Gran Premio è oggi. Parla con il Commissario Nembo, in paddock.",
      1: "Cerca gli indizi sul sabotatore: il box (banco attrezzi), la pista (pila di gomme), la cabina di Gridoni (banco di regia). Poi torna da Nembo.",
      2: "Sai chi è. Il Gran Premio comincia: parla con Rosalba in paddock.",
      3: "Gran Premio vinto. Il Commissario Nembo ti aspetta per la Coppa.",
    }[s] || "Il Gran Premio è concluso. Il Libro di Bordo conserva le bandiere.");

    const talk = {
      gp_nembo() {
        const s = S(), here = K.api.trZone(); if (here !== "gp_paddock") return done();
        if (s >= 4) return say([["gp_nembo", "La Coppa è al suo posto. Io torno a vigilare: dall'alto, con riserva."]]);
        if (s === 3) return coppa();
        if (s === 2) return say([["gp_nembo", "Rosalba ti aspetta per la gara. Io fischio, sventolo e, quando posso, tifo. In silenzio, per regolamento."]]);
        if (s === 0) return say([
          ["gp_nembo", "[pensa] Il Gran Premio comincia a mezzogiorno. Ma qualcuno, a Palladoro, ha sporcato le gare: olio, bulloni, un freno che non frena. Ho bisogno di un nome."],
          ["gp_nembo", "Tre luoghi: il banco del box, la pila di gomme in pista, il banco di regia in cabina. Quando hai le prove, vieni da me. Io non accuso: io verbalizzo."],
        ], () => { setStep(N, 1); quest("gp_fin", "Il Gran Premio", "Cerca gli indizi sul sabotatore (box, pista, cabina) e poi parla con il Commissario Nembo."); K.learnLore("l_sabotatore", true); done(); });
        if (indizi() < 2) return say([["gp_nembo", `Hai ${indizi()} indizi. Me ne servono almeno due: guarda il banco del box, la pila di gomme in pista e il banco di regia in cabina.`]]);
        ask("gp_nembo", `Ho ${indizi()} indizi sul verbale. Chi è il sabotatore?`, [
          { label: "Rosalba", sub: "La campionessa, ha più da perdere", fn: () => sbagliato("rosalba") },
          { label: "Il Signor Gommino", sub: "Lo sponsor compra tutto", fn: () => sbagliato("gommino") },
          { label: "Cesare Gridoni", sub: "Menta, gel per la gola e una canna da pesca", cls: "hot", big: true, fn: smaschera },
          { label: "Non ancora", fn: done },
        ], "gp_paddock");
      },
      gp_gridoni() {
        const s = S(), here = K.api.trZone();
        if (F.is("gp_out") && here !== "gp_cabina") return say([["gp_gridoni", "Sono sospeso per tre gare. Mi sono portato il microfono: lo tengo spento. E mi sento nudo."]]);
        if (here === "gp_cabina") return say([["gp_gridoni", s >= 2 ? "[triste] Una gara noiosa è una gara sprecata, dicevo. Poi ho visto la tua faccia, dopo l'olio. Non era emozione: era spavento. Non lo rifaccio." : "Il Gran Premio! La finale! Io racconto, tu corri, e chi sa cosa succederà. Io non lo so. O forse sì."]]);
        say([["gp_gridoni", s >= 3 ? "SIGNORE E SIGNORI! IL GRAN PREMIO HA UN VINCITORE! E IO UN MICROFONO A CUI ASSOMIGLIAMO ENTRAMBI: TROPPO ACCESI!" : "AMICI! Oggi si decide tutto! O niente! O la merenda!"]]);
      },
      gp_rosalba() {
        const s = S();
        if (s === 2) return ask("gp_rosalba", F.get("gp_m3") === "persa" ? "Ancora un giro? Io sono qui." : "La finale. Un patto, o niente patto: io corro per vincere. Ti dico solo di stare attento in curva due.", [
          { label: "Gioca il Gran Premio", sub: "Giro e Gol · 4 giri · gara forzata", cls: "hot", fn: finale },
          { label: "Ancora un momento", fn: done },
        ], "gp_pista");
        if (s >= 3) return say([["gp_rosalba", st("rosa") >= 2 ? "Se non fosse stato per te, questo Gran Premio non l'avrei mai goduto così. Sì, anche se ho perso." : "Hai corso bene. Rispetto il blu. Ma domani il rosso ti sorpassa."]]);
        say([["gp_rosalba", s === 1 ? "Mi dicono che stai cercando un sabotatore. Io, se fossi in te, guarderei in alto. Sopra la pista. Non lo dico io: lo dice la logica." : "Finale tra poco. Io mi scaldo con la musica, tu con la lavatrice."]]);
      },
      gp_gommino() { return say([["gp_gommino", F.get("gp_spons") === "si" ? "Sulla fiancata ho fatto mettere tre loghi. Uno è per fortuna. Gli altri, per soldi." : "Senza il mio logo, la Rondinella è bella. Con il mio logo, sarebbe stata redditizia. Dettagli."]]); },
    };
    function sbagliato(chi) {
      if (chi === "rosalba") { bond("rosa", -2); say([["gp_nembo", "Rosalba? Hai un'idea e nessuna prova. Lei corre per vincere, non per far perdere. Lei lo saprà: non dirglielo."], ["voce", "Poco distante, Rosalba sta guardando dall'altra parte, con grande dignità. Ha sentito, e lo sa."]], done); }
      else { say([["gp_nembo", "Gommino? Lui compra, non rovina. Ha troppi loghi da proteggere per mettere in pericolo un cofano."], ["gp_gommino", "[triste] Io? Ma se non so nemmeno aprire un cofano! Per quello pago."]], done); }
    }
    function smaschera() {
      const n = indizi(); F.set("gp_trovato", true);
      K.scene([
        ["gp_nembo", "[furbo] Gel per la gola, cartina di menta e una canna da pesca. Un solo uomo, a Palladoro, ha tutte e tre le cose. E ha anche il microfono."],
        ["gp_gridoni", "[triste] …Ho il microfono. E ho una confessione. Io volevo solo… un COLPO DI SCENA. Una gara noiosa è una gara sprecata! Un po' d'olio, un bullone, una canna da pesca. Niente di grave!"],
        ["gp_gridoni", "Sono dei miei effetti speciali. Li chiamo «incidenti drammaturgici». Non voleva farsi male nessuno. Solo… emozione."],
        ["voce", n >= 3 ? "Hai le tre prove: la menta, il gel, la canna. Nessuno, adesso, può far finta di niente." : "Hai le prove che bastano. Gridoni, di nome, di voce e di menta, non può negare."],
      ], () => ask("gp_nembo", "Ora, come lo trattiamo?", [
        { label: "Smascherarlo in diretta", sub: "Tutto il paddock sa: sospeso per tre gare", big: true, fn: () => scelta("pubblico") },
        { label: "Parlargli in privato", sub: "Che ripari i danni e racconti il vero, da domani", cls: "hot", big: true, fn: () => scelta("privato") },
      ], "gp_cabina"), "gp_cabina");
    }
    function scelta(k) {
      if (k === "pubblico") { F.set("gp_out", true); bond("team", 1); say([["gp_gridoni", "[triste] Sospeso. Tre gare. Per la prima volta in vita mia, avrò tempo per ascoltare, invece di parlare. Che incubo."], ["gp_nembo", "Verbalizzato. Scrivo anche che non è cattivo: è solo molto, molto ad alto volume."]], () => { setStep(N, 2); F.set("gp_perdono", false); questDone("gp_fin"); quest("gp_gp", "La finale", "Parla con Rosalba, in paddock: il Gran Premio comincia."); K.go("gp_paddock", 21, 8); done(); }); }
      else { F.set("gp_perdono", true); bond("rosa", 1); say([["voce", "Lo porti in disparte, dietro la cabina, con una tazza di tè. Gridoni piange un po', poi ride, poi fa un microfono finto con la mano."], ["gp_gridoni", "Racconterò solo il vero. Sempre. Anche quando è noioso. Soprattutto quando è bello. Promesso. Su menta."]], () => { setStep(N, 2); questDone("gp_fin"); quest("gp_gp", "La finale", "Parla con Rosalba, in paddock: il Gran Premio comincia."); K.go("gp_paddock", 21, 8); done(); }); }
    }
    // ------------------------------------------------------------ la finale
    const OPP3 = { name: "Scuderia Fiamma", color: "#d8302a", players: [{ name: "Rosalba" }, { name: "Fiammetta" }], keeper: { name: "Il Palo Bionico" } };
    function finale() {
      K.gara({
        title: "Gran Premio del Pallone · La Finale", laps: 4, bg: "gp_pista", oppStyle: "pressing", opp: OPP3,
        intro: `<p>La finale. <b>Quattro giri</b> contro la Scuderia Fiamma. Hai ${K.vantaggi().turbi + 2} turbo e ${K.vantaggi().mira} mirini ${F.is("gp_perdono") || F.is("gp_out") ? "e nessuno sabota più la pista." : "."} Rosalba è la campionessa: supera la sua macchina, e il suo contropiede si spegne.</p>`,
        done: (r) => {
          if (r.quit) return say([["gp_rosalba", "Ti fermi? Il Gran Premio ti aspetta. Io, anche."]]);
          F.set("gp_m3", r.win ? "vinta" : "persa");
          if (!r.win) return K.scene([["voce", "Bandiera a scacchi. È rossa, per una volta in più."], ["gp_rosalba", "[felice] Non è finita finché non mi senti dire «finita». E non lo dico."]], () => K.enterZone("gp_paddock"), "gp_podio");
          setStep(N, 3);
          K.scene([
            ["voce", "Bandiera a scacchi! La Rondinella taglia il traguardo: un po' scheggiata, molto orgogliosa."],
            ["gp_gridoni", F.is("gp_perdono") ? "[felice] E IL CAMPIONE VINCE. Non lo dico io. Lo dicono i numeri. E i numeri, per fortuna, sono noiosi." : "[ride] E IL CAMPIONE VINCE! (Lo dice una voce da fuori, un po' più giù della solita.)"],
            ["voce", "Il Commissario Nembo ti aspetta al podio, con la Coppa Rotonda."],
          ], () => K.enterZone("gp_paddock"), "gp_podio");
        },
      });
    }
    // ------------------------------------------------------------ la Coppa e le bandiere
    function coppa() {
      const o = [{ label: "Alzare la Coppa", sub: "Una bandiera a scacchi, con tutti i manici", big: true, fn: () => bandiera("scacchi") }];
      if (F.is("gp_patto")) o.unshift({ label: "Dividere la Coppa con la Scuderia Fiamma", sub: "L'articolo zero: due officine, due manici", cls: "hot", big: true, fn: () => bandiera("dividi") });
      ask("gp_nembo", "La Coppa Rotonda. Ha due manici: ricordi l'articolo zero? Che ne facciamo?", o, "gp_podio");
    }
    function bandiera(scelta) {
      const gi = F.is("gp_giardino"), no = F.get("gp_spons") === "no", dividi = scelta === "dividi";
      let kind = "scacchi";
      if (dividi && gi && indizi() >= 3 && no && st("rosa") >= 2 && st("team") >= 4) kind = "giro";
      else if (dividi && st("rosa") >= 2) kind = "condivisa";
      else if (F.is("gp_perdono")) kind = "voce";
      else if (no && st("team") >= 4) kind = "officina";
      const R2 = { scacchi: { coins: 150, cos: ["gp_c3", "gp_e_scacchi"] }, condivisa: { coins: 170, cos: ["gp_c3", "gp_e_condivisa"] }, voce: { coins: 170, cos: ["gp_c3", "gp_e_voce"] }, officina: { coins: 170, cos: ["gp_c3", "gp_e_officina"] }, giro: { coins: 250, cos: ["gp_c3", "gp_e_giro"] } }[kind];
      F.set("gp_coppa", true); const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N); setStep(N, 5); questDone("gp_gp");
      const L = {
        scacchi: [["gp_nembo", "Una Coppa, un vincitore. Verbalizzato. E quel manico spaiato, mi spiace, resta lì."], ["voce", "Alzi la Coppa Rotonda. Il pubblico canta, Gridoni (o il suo sostituto) si sgola, e la Coppa pesa quanto promesso: tantissimo."], ["voce", "<b>BANDIERA · A SCACCHI.</b> Un Gran Premio come tutti gli altri, ma tuo."]],
        condivisa: [["gp_rosalba", "[ride] Due manici. Mio nonno e il padre di Tonino lo sapevano. Noi, finalmente, anche."], ["voce", "Alzate la Coppa in due, uno per manico, davanti a tutta Palladoro. Tonino, in fondo, dice «ma si stringe a mano» e piange nel cappello."], ["voce", "<b>BANDIERA · LA COPPA DI DUE.</b> Il Gran Premio non si scioglie: comincia."]],
        voce: [["gp_gridoni", "[felice] Il Gran Premio è stato vinto da un campione e da una verità. E, un po', da una menta."], ["voce", "Nelle telecronache di Gridoni, d'ora in poi, nessun colpo di scena è finto: sono veri, e fanno più ridere."], ["voce", "<b>BANDIERA · LA VOCE NUOVA.</b> A volte, un perdono vale una curva."]],
        officina: [["gp_bullone", "[felice] Senza sponsor, con un gatto e una lavatrice. Ho i debiti, ma adesso ho anche un coro."], ["voce", "L'Officina Bullone alza la Coppa in mezzo a duecento persone che gridano il suo nome. Dado, il gatto, ruba un panino a un tifoso."], ["voce", "<b>BANDIERA · L'OFFICINA RINASCE.</b> A volte un'officina vale più di uno sponsor."]],
        giro: [["gp_nembo", "[sorpreso] Questo… non è nel verbale. Non si può verbalizzare."], ["voce", "In cima alla Coppa non c'è niente: c'è un giro, uno solo, quello vero. Lo fate in quattro, a fari spenti, Tonino, Rosalba, Gridoni e te, e nessuno lo cronometra."], ["voce", "<b>BANDIERA SEGRETA · IL GIRO PERFETTO.</b> È il più veloce di tutti."]],
      }[kind];
      K.scene([...L, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Bandiere trovate: ${K.mem().ends.length} su 5. Dal menu «Capitoli» puoi rigiocare per scoprire le altre.</span>`]], () => K.openMain(), "gp_podio");
    }
    const obj = {
    };
    return { n: N, title: "Il Gran Premio", sub: "Gli indizi, il sabotatore, la finale, la Coppa", goal, start: "gp_paddock", introBg: "gp_paddock", zones: {}, talk, obj, patch: {},
      intro: () => [["voce", "Il giorno del Gran Premio. Palladoro si sveglia con le campane, le sirene e una canzoncina che non si sa chi l'abbia scritta."], ["voce", "Altoparlanti: «ATTENZIONE: OGGI È L'ULTIMA TAPPA. I SORPASSI SONO CONSENTITI. I COLPI DI SCENA, DA OGGI, NO.»"]] };
  }
  boot();
})();
