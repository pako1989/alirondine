// js/gp-c2.js - GRAN PREMIO DEL PALLONE · Capitolo 2 «Il Giro Lungo»
// A Palladoro entra in scena lo sponsor, il telecronista invita il Campione nella sua cabina, la pista comincia a fare brutti scherzi.
// Tappa 2 contro i Bolidi Verdi. Un archivio del regolamento svela perché la Coppa Rotonda ha due manici.
(function () {
  "use strict";
  function boot() { const D = window.__gp; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("gp_smeraldo", { band: "#22c55e", acc: ["cappellino"], name: "Smeraldo Lime", tag: "", hair: "#2a2a1a", style: "spiky", skin: "#d9a679", eye: "#2a4a2a", bg: ["#0a2a14", "#1a8a4a"], shirt: "#1a8a4a" },
      "Capitano dei Bolidi Verdi. Parla di verde come di una religione: macchina verde, tuta verde, colazione verde (frullato). Ha un solo difetto: non perde mai un'occasione di ricordartelo.");
    K.cos("gp_c2", { kind: "shirt", label: "Tuta Giro Lungo", val: "#ffb02a", from: "Completa il Capitolo 2 di Gran Premio del Pallone" });
    K.lore("l_sponsor", { t: "Gommalux", d: "«La gomma che ti ricorda». Il Signor Gommino compra pneumatici, cartelloni, tribune e, se ci riesce, anche le curve. Ha un unico principio: i bulloni si pagano a peso d'oro, ma non per tenerli." });
    K.lore("l_cabina", { t: "La cabina di Gridoni", d: "Una stanza sopra la pista con una vetrata sul circuito, un microfono grande come un gatto e una luce «ON AIR» che a volte si accende da sola. Dalla finestra pende un filo molto lungo. Non si sa a che pro." });
    K.lore("l_patto", { t: "Il patto del Gran Premio", d: "Prima del Gran Premio c'erano due officine: Bullone e Fiamma. Fondarono la gara insieme, e la Coppa Rotonda con due manici: uno per ciascuno. Poi litigarono per una gomma. Il patto dice: chi vince l'ultima tappa deve condividere la Coppa, o sciogliere il Gran Premio." });

    const goal = (s) => ({
      0: "Il Giro Lungo: parla con Gridoni in paddock.",
      1: "Il Signor Gommino ti aspetta a Gommalux Hospitality, la casa gialla al centro in alto, nel paddock.",
      2: "Sponsor deciso. Smeraldo dei Bolidi Verdi ti aspetta in pista per la tappa 2.",
      3: "Tappa vinta. Il Commissario Nembo ti cerca in paddock.",
    }[s] || "Capitolo concluso. Il Gran Premio è domani: parla con il Commissario Nembo.");

    const zones = {
      gp_cabina: {
        interior: true, region: "cabina", name: "Gran Premio del Pallone · La Cabina di Telecronaca", short: "La Cabina di Telecronaca", sub: "Una vetrata, un microfono, una luce ON AIR", bg: "gp_cabina", w: 14, h: 10, start: [7, 7], outside: ["gp_paddock", 23, 7], items: [[11, 7]],
        act: { M: "Guarda il banco di regia", U: "Guarda i monitor", Y: "Guarda il microfono", v: "Esci", W: "Guarda la vetrata", b: "Siediti" },
        flavor: { U: "Sei monitor: sei angolazioni dello stesso sorpasso. Ogni angolazione, per Gridoni, è «la migliore».", Y: "Il microfono: grosso, nero, con un adesivo «NON SOFFIARE: SONO GIÀ ABBASTANZA DRAMMATICO».", W: "La vetrata dà sulla pista. Da qui si vedrebbe una pozza d'olio da cento metri. Gridoni, infatti, la vede sempre." },
        intro: [["voce", "La cabina di telecronaca: moquette viola, luci a LED e un odore di caramella alla menta. La luce «ON AIR» si accende da sola quando entri. Per gentilezza."]],
        npcs: () => [{ id: "gp_gridoni", at: [7, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          put(3, 2, "U"); put(4, 2, "U"); put(10, 2, "M"); put(11, 2, "M"); put(7, 2, "Y"); put(2, 1, "W"); put(12, 1, "W"); put(2, 6, "b");
        },
      },
      gp_salotto: {
        interior: true, region: "salotto", name: "Gran Premio del Pallone · Gommalux Hospitality", short: "Gommalux Hospitality", sub: "Champagne, olive a ruota, un contratto", bg: "gp_salotto", w: 14, h: 10, start: [7, 7], outside: ["gp_paddock", 14, 7], items: [[11, 7]],
        act: { M: "Guarda il buffet", K: "Guarda il quadro", v: "Esci", b: "Siediti" },
        flavor: { M: "Il buffet: olive a forma di ruota, tartine a forma di pallone, e un cartello «NON SERVIRSI CON LE MANI: LE MANI SONO PER I CONTRATTI».", K: "Un quadro: il logo di Gommalux in tre dimensioni, e un angolo vuoto dove, a quanto pare, ne dovrà stare un quarto." },
        intro: [["voce", "Gommalux Hospitality: moquette d'oro, lampadario d'oro, e un cartello «SI PREGA DI NON TOCCARE NIENTE CHE NON SIA DI GOMMALUX». Quindi: niente."]],
        npcs: () => [{ id: "gp_gommino", at: [7, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          put(2, 2, "M"); put(3, 2, "M"); put(10, 2, "K"); put(11, 2, "K"); put(2, 6, "b");
        },
      },
    };

    // ------------------------------------------------------------ lo sponsor
    function sponsor() {
      ask("gp_gommino", "Dunque: una scritta gialla sul cofano e un assegno nel taschino. Che ne dici?", [
        { label: "Accetto lo sponsor", sub: "Monete e un turbo in più, ma l'Officina ci resta male", big: true, fn: () => scegli("si") },
        { label: "Rifiuto: resto con Tonino", sub: "Nessun assegno, ma l'Officina è con te", big: true, fn: () => scegli("no") },
        { label: "Ci devo pensare", fn: done },
      ], "gp_salotto");
    }
    function scegli(k) {
      F.set("gp_spons", k);
      if (k === "si") {
        bond("team", -2); F.set("gp_turbo", true); const m = K.reward("gp:spons", { coins: 120 }); K.note("Sponsor Gommalux: accettato.");
        say([["gp_gommino", "[felice] Un uomo di buon senso! Domani la Rondinella avrà il logo, e tu un turbo in più. «Gomma che ti ricorda»: ricordatelo."], ["voce", `Ti stringi la mano con un uomo che sorride troppo. ${m.join(" · ")}`]], () => { setStep(N, 2); quest("gp_giro", "Il Giro Lungo", "In pista, Smeraldo dei Bolidi Verdi ti aspetta per la tappa 2."); done(); });
      } else {
        bond("team", 2); K.note("Sponsor Gommalux: rifiutato.");
        say([["gp_gommino", "[triste] Rifiutato. Per un'officina con un gatto. Lo scrivo, con calma, in rosso."], ["voce", "Esci con la schiena dritta. Sul tavolo, un'oliva a ruota ti guarda andare via, delusa."]], () => { setStep(N, 2); quest("gp_giro", "Il Giro Lungo", "In pista, Smeraldo dei Bolidi Verdi ti aspetta per la tappa 2."); done(); });
      }
    }

    // ------------------------------------------------------------ la tappa 2
    const OPP2 = { name: "I Bolidi Verdi", color: "#1a8a4a", players: [{ name: "Smeraldo" }, { name: "Lime" }], keeper: { name: "Il Guardrail" } };
    function chiudi2(r) {
      if (r.quit) return say([["gp_smeraldo", "Ti ritiri? Ti aspetto. Sono verde, ma paziente."]]);
      F.set("gp_m2", r.win ? "vinta" : "persa");
      if (!r.win) return K.scene([["voce", "Bandiera a scacchi: per i Bolidi Verdi. La loro festa è color pisello."], ["gp_smeraldo", "[ride] Verde batte blu! Questo lo dico a ogni pasto."]], () => K.enterZone("gp_pista"), "gp_pista");
      setStep(N, 3);
      K.scene([
        ["voce", "Bandiera a scacchi! La Rondinella taglia il traguardo con un sorrisetto sul parafango."],
        ["gp_gridoni", "[felice] E IL CAMPIONE DI NUOVO! È UN CAMPIONE! È UNA MACCHINA! È UN… PRODIGIO MECCANICO CON UN PILOTA!"],
        ["voce", "Poco dopo, ai box, Tonino alza il cofano. Il tubo dell'olio è slacciato: non rotto, slacciato. «Come se qualcuno avesse voluto vederti scivolare, non fermarti.»"],
        ["voce", "Il Commissario Nembo ti cerca in paddock."],
      ], () => K.enterZone("gp_paddock"), "gp_pista");
    }
    function gara2() {
      ask("gp_smeraldo", F.get("gp_m2") === "persa" ? "Rivincita? Il verde non dimentica." : "Il verde non perde. Il verde non rallenta. Il verde, a dire il vero, a volte sbanda. Pronto?", [
        { label: "Giro e Gol", sub: "La gara del Gran Premio · 3 giri", cls: "hot", fn: () => K.gara({ title: "Tappa 2 · Il Giro Lungo", laps: 3, bg: "gp_pista", oppStyle: "contropiede", opp: OPP2, intro: "<p>Il Giro Lungo. Tre giri, e i Bolidi Verdi sono più rapidi in rettilineo. Superali prima dell'area: il loro contropiede è un fulmine.</p>", done: chiudi2 }) },
        { label: "Un'altra modalità", sub: "3 contro 3, 2D HD o La Gabbia", fn: () => K.playMatch({ alt: "az,cage,hd", force: false, id: "gp_t2", chap: "Gran Premio del Pallone", oppNames: ["Smeraldo", "Lime", "Il Guardrail"], intro: "Tappa a bordo pista contro i Bolidi Verdi.", done: chiudi2 }) },
        { label: "Ancora un momento", fn: done },
      ], "gp_pista");
    }

    // ------------------------------------------------------------ l'archivio e il patto
    function patto() {
      K.learnLore("l_patto", true); K.learnLore("l_coppa", true);
      K.scene([
        ["gp_nembo", "[furbo] Archivio del Regolamento, articolo zero. Nessuno lo legge: sta sotto il timbro. Per fortuna io leggo anche sotto i timbri."],
        ["gp_nembo", "Il Gran Premio lo fondarono in due: Bullone e Fiamma, due officine, un'amicizia. La Coppa Rotonda ha due manici perché è di due."],
        ["gp_nembo", "L'articolo dice: chi vince l'ultima tappa <b>divide la Coppa</b> con l'altra officina, o scioglie il Gran Premio. Il resto è storia, e un po' di litigio per una gomma."],
        ["gp_rosalba", "[sorpreso] …Mio nonno e il padre di Tonino? Soci? Mi hanno sempre detto che si odiavano. Evidentemente odiavano con cura."],
        ["gp_bullone", "[pensa] Mio padre diceva «Con i Fiamma non si parla». Per trent'anni ha parlato solo di loro."],
      ], () => ask("gp_nembo", "E adesso? Il Gran Premio è domani. Che cosa ne facciamo, di questo patto?", [
        { label: "Dirlo a tutti, in paddock", sub: "Il patto è pubblico: poi si vede", cls: "hot", big: true, fn: () => fine2(true) },
        { label: "Tenerlo da parte, per ora", sub: "Pensare alla gara, poi il resto", big: true, fn: () => fine2(false) },
      ], "gp_pista"), "gp_pista");
    }
    function fine2(detto) {
      F.set("gp_patto", detto); if (detto) { bond("rosa", 1); bond("team", 1); } else F.set("gp_coppetta", true);
      F.set("gp_giro", true); const msg = K.reward("ch:gp_c2", { coins: 100, cos: ["gp_c2"] });
      finishChapter(N); setStep(N, 4); questDone("gp_giro");
      K.scene([
        detto ? ["gp_rosalba", "Una Coppa divisa. Ci vuole un po' per capirlo. Domani la vedremo."] : ["gp_nembo", "Il segreto, per ora, è al sicuro. Come i bulloni nelle tasche di Tonino."],
        ["voce", `<b>Fine del Capitolo 2 · Il Giro Lungo.</b> ${msg.join(" · ")}<br><span style="color:var(--dim)">La finale è domani. Qualcuno, a Palladoro, sta rovinando le gare: prima di partire, apri gli occhi.</span>`],
      ], () => K.openMain(), "gp_pista");
    }

    const talk = {
      gp_gridoni() {
        const s = S(), here = K.api.trZone();
        if (here === "gp_cabina") {
          if (F.is("gp_cab_vista")) return say([["gp_gridoni", K.pick(["Il microfono è la mia anima. Se me lo spegni, parlo comunque: mi sento.", "Una menta? Ne ho a chili. Le tengo per la voce. E per i nervi. E perché sono buone."])]]);
          F.set("gp_cab_vista", true);
          return say([["gp_gridoni", "[felice] Un VISITATORE! Nella mia cabina! Prego, prego: non toccare niente. Tocca, tocca, ma poi dimmelo."], ["gp_gridoni", "Da qui vedo tutto, dico tutto, e invento il resto. Una gara noiosa è una gara sprecata, caro: la gente vuole il COLPO DI SCENA."]]);
        }
        if (s >= 4) return K.PASS;
        if (s === 3) return say([["gp_gridoni", "Il Commissario Nembo ti cerca! Io lo seguirei: ha un sacco di bandiere, e se ne dimentica sempre una."]]);
        if (s === 2) return say([["gp_gridoni", "Smeraldo ti aspetta in pista. Lo riconosci dal colore: non c'è altro verde, in giro, che non sia un cartello."]]);
        if (s === 1) return say([["gp_gridoni", "Gommalux Hospitality! La casa gialla! Il Signor Gommino non è mai in ritardo, perché non è mai in orario: è sempre già lì."]]);
        say([
          ["gp_gridoni", "[felice] AMICI! Il Giro Lungo! La tappa più lunga! Il circuito più storto! E un Campione con una lavatrice a quattro ruote!"],
          ["gp_gridoni", "Il Signor Gommino, lo sponsor, ti vuole parlare. Ha un contratto, un sorriso e un biglietto da visita che pesa. Gommalux Hospitality: casa gialla, centro, in alto."],
        ], () => { setStep(N, 1); quest("gp_giro", "Il Giro Lungo", "Parla con il Signor Gommino, a Gommalux Hospitality."); K.learnLore("l_cabina", true); done(); });
      },
      gp_gommino() {
        const s = S();
        if (s >= 2) return say([["gp_gommino", K.pick(["Il logo è sul cofano, e la fiducia nel portafoglio. Le due cose si assomigliano.", "La gomma che ti ricorda! Ricorda, ricorda."])]]);
        if (!F.is("gp_gommino1")) { F.set("gp_gommino1", true); K.learnLore("l_sponsor", true); return say([["gp_gommino", "[felice] Il Campione! Gommino, Gommalux, «la gomma che ti ricorda». Sentito parlare? No? Peccato: noi parliamo spesso di te."], ["gp_gommino", "L'Officina Bullone, senza sponsor, è una macchina senza benzina. Io ho la benzina. E un adesivo. Vuoi un adesivo?"]], sponsor); }
        sponsor();
      },
      gp_smeraldo() { if (S() === 2) return gara2(); if (S() >= 3) return say([["gp_smeraldo", "Il verde è tornato a casa. Il blu è in testa. Mi sto abituando, ma lo dico solo a mezza voce."]]); return say([["gp_smeraldo", "Il verde aspetta, e intanto prende il sole."]]); },
      gp_nembo() {
        const s = S();
        if (K.api.trZone() === "gp_paddock" && s === 3) return patto();
        if (s >= 4) return K.PASS;
        return say([["gp_nembo", "Vigilo. Dall'alto, naturalmente."]]);
      },
    };
    const obj = {
      "gp_pista:O": () => {
        if (!F.is("gp_c1")) { F.set("gp_c1", true); K.note("Indizio: una tanica di gel per la gola vicino all'olio."); return say([["voce", "Accanto alla pila di gomme c'è una pozza scura che non è olio motore: è <b>gel per la gola</b>, quello alla menta, con il tappo ancora sul fondo. Sul tappo, a pennarello: «VOCE D'ORO»."], ["voce", "Il gel per la gola lo usa uno solo, a Palladoro. Non ci vuole un genio. Per fortuna, ce ne sono pochi."]], done); }
        say([["voce", "Gomme impilate, una pozza di gel che dà ancora un buon odore di menta."]]);
      },
      "gp_cabina:M": () => {
        if (!F.is("gp_c3")) { F.set("gp_c3", true); K.note("Indizio: una canna da pesca con un filo che scende fino alla pista."); return say([["voce", "Accanto al banco di regia, appoggiata alla vetrata, una <b>canna da pesca</b>. Il filo scende fin laggiù, sul tratto di pista dove le gare sbandano."], ["voce", "Attaccata all'amo, una cartina di caramella alla menta. A pescare, qui, c'è solo uno che non ha mai visto un pesce."]], done); }
        say([["voce", "Il banco di regia: sei fader e una canna da pesca che sa già cosa ha pescato."]]);
      },
    };
    return { n: N, title: "Il Giro Lungo", sub: "Lo sponsor, la cabina, la tappa 2, il patto", goal, start: "gp_paddock", introBg: "gp_paddock", zones, talk, obj, patch: {},
      intro: () => [["voce", "Palladoro, qualche giorno dopo. Il tuo nome è sul tabellone dei tempi, il che è una cosa bellissima e un po' pericolosa."], ["voce", "Altoparlanti: «ATTENZIONE: STASERA LA PISTA È PIÙ LUNGA. LA GARA, ANCHE.»"]] };
  }
  boot();
})();
