// js/mantello-c3.js - IL MANTELLO GRANATA · Capitolo 3 «Il Dottor Fuorigioco»
// Tutti i fischietti di Metropolenta fischiano fuorigioco, a tutto: tram, piccioni, persone che tornano a casa.
// Il Dottor Fuorigioco, dalla Torre dell'Orologio, ha fermato la città con un fischietto ipnotico. Il Viale dei Tigli è
// bloccato da file di auto in doppia fila: serve la forma GIGANTE. Si sceglie il potere per la finale (Fulmine, Gigante,
// o la Calamita, se te la fai dare dai Panchinari), contro il contro-potere dello Specchio.
// Finali: L'EROE DI METROPOLENTA · LA LEGA DEI MANTELLI · IL DOTTORE CON IL FISCHIETTO · (segreto) LA PRIMA MANTELLO GRANATA.
(function () {
  "use strict";
  function boot() { const D = window.__mantello; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);

    K.cast("mg_dottore", { acc: ["fischietto", "occhiali"], name: "Il Dottor Fuorigioco", tag: "", hair: "#e8e8e8", style: "slick", skin: "#e8d0b8", eye: "#3a3a5a", bg: ["#1a1a2a", "#ffd23f"], shirt: "#1a1a1a", beard: true },
      "Un tempo era il guardalinee più preciso di Metropolenta: alzava la bandierina per un centimetro, per un capello, per un pensiero. Nessuno lo ringraziava, tutti lo fischiavano. Ha deciso che se tutto è fuorigioco, almeno avrà sempre ragione.");
    K.cast("mg_vigile", { name: "Vigile Puntuale", tag: "", hair: "#5a4a3a", style: "buzz", skin: "#e0b890", eye: "#3a3a3a", bg: ["#2a2a3a", "#e8e8e8"], shirt: "#e8e8f0", cap: "#1a2a4a" },
      "Il vigile del Viale dei Tigli. Fa le multe alle auto in doppia fila da trent'anni. Le auto sono sempre le stesse. Le multe sono sempre le stesse. Ormai si salutano.");
    K.cos("mg_c3", { kind: "acc", label: "Corona del Mantello Granata", val: "corona", from: "Completa Il Mantello Granata" });
    K.cos("mg_eroe", { kind: "shirt", label: "Maglia dell'eroe di Metropolenta", val: "#d82a3a", from: "Finale «L'eroe di Metropolenta»" });
    K.cos("mg_lega", { kind: "acc", label: "Distintivo della Lega dei Mantelli", val: "medaglia", from: "Finale «La Lega dei Mantelli»" });
    K.cos("mg_arbitro", { kind: "acc", label: "Fischietto del Dottore", val: "fischietto", from: "Finale «Il Dottore con il fischietto»" });
    K.cos("mg_tilde", { kind: "hairc", label: "Capelli Argento di Nonna Tilde", val: "#e8e8f0", from: "Finale segreto «La prima Mantello Granata»" });
    K.cos("mg_ritagli3", { kind: "hairc", label: "Capelli Oro Bottone", val: "#ffd23f", from: "Trova tutti i ritagli di stoffa del Viale dei Tigli" });
    K.lore("l_gigante_f", { t: "Forma · Gigante", d: "Il bottone più grande della sartoria, quello del cappotto del sindaco: giralo, e diventi alto come un lampione. Scavalchi le auto in doppia fila. Il vigile ti fa la multa lo stesso, per eccesso di altezza." });
    K.lore("l_specchio", { t: "Contro-potere · Specchio", d: "Il trucco del Dottor Fuorigioco: quando la sua barra è piena, il tuo prossimo tiro esce a specchio. Destra diventa sinistra. Tira storto apposta, e andrà dritto." });
    K.lore("l_calamita", { t: "Potere · Calamita", d: "La calamita della panchina dei Panchinari: per un tiro, il pallone è attirato dalla porta avversaria. «L'abbiamo usata per anni per non farci cadere i panini», dice Tonno." });
    const goal = (s) => ({
      0: "A Metropolenta tutti i fischietti fischiano fuorigioco. Nonna Tilde, in sartoria, ha un bottone nuovo per te.",
      1: "La Torre dell'Orologio è in fondo al Viale dei Tigli (a sud della piazza). Le auto in doppia fila si scavalcano solo in forma Gigante.",
      2: "Nella Torre dell'Orologio ti aspetta il Dottor Fuorigioco. (Ai Panchinari, sul viale, potresti chiedere un aiuto per la partita.)",
      3: "Hai battuto il Dottor Fuorigioco. Parlagli.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    const ITEMZ = ["mg_piazza", "mg_tetti", "mg_fabbrica", "mg_viale"];
    function allRitagli() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const zones = {
      mg_viale: {
        region: "citta", name: "Il Mantello Granata · Il Viale dei Tigli", short: "Il Viale dei Tigli", sub: "Auto in doppia fila dal 1987", bg: "mg_viale", time: "tramonto", travel: [17, 1], caption: "INTANTO, SUL VIALE DEI TIGLI…",
        w: 34, h: 22, start: [17, 1], itemCos: "mg_ritagli3", items: [[30, 3], [3, 18], [30, 18]],
        areas: [[1, 8, 32, 9, "Le auto in doppia fila"], [0, 0, 33, 21, "Il Viale dei Tigli"]],
        act: { "^": "Torna in piazza" },
        intro: [["voce", "Il Viale dei Tigli: alberi, lampioni, e due file di auto in doppia fila da un marciapiede all'altro. Nessuno passa. In fondo, la Torre dell'Orologio, con le lancette ferme su un orario impossibile: le «fuorigioco e un quarto»."], ["voce", "Da lassù, a ogni minuto, un fischio: FRIIIT! E tutta la città si ferma, con un piede alzato."]],
        npcs: (s) => [{ id: "mg_vigile", at: [10, 6], route: [[10, 6], [24, 6]], speed: 0.35, pause: 80 }, { id: "mg_tonno", at: [28, 4] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 21, 33, 21, "a"); lay(0, 0, 0, 21, "a"); lay(33, 0, 33, 21, "a"); put(17, 0, "^");
          lay(1, 8, 32, 9, "K"); lay(15, 1, 19, 7, "+"); lay(1, 5, 32, 6, ":"); lay(15, 10, 19, 13, "+");
          house(12, 14, 10, 5, { door: [17, 18], roof: "#4a3a5a", wall: "#d8c8b8", rr: 3, lit: true, enter: { to: "mg_torre", at: [10, 10] } });
          lay(2, 10, 2, 20, ":"); lay(2, 20, 31, 20, ":"); lay(17, 19, 17, 19, ":"); lay(31, 10, 31, 20, ":"); lay(3, 13, 11, 13, ":"); lay(22, 13, 30, 13, ":");
          put(5, 3, "J"); [[4, 2], [9, 2], [24, 2], [29, 1], [6, 11], [27, 11], [8, 17], [26, 17]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) { g.fillStyle = "#fff"; g.font = "bold 5px sans-serif"; g.fillText("DIVIETO DI SOSTA (DAL 1987)", d.X(20), d.Y(7) + 12); },
      },
      mg_torre: {
        interior: true, region: "torre", name: "Il Mantello Granata · La Torre dell'Orologio", short: "La Torre dell'Orologio", sub: "Ingranaggi, lancette e un fischietto", bg: "mg_torre", w: 20, h: 13, start: [10, 10], outside: ["mg_viale", 17, 19], caption: "INTANTO, NELLA TORRE…",
        act: { T: "Guarda il tavolo", L: "Guarda gli ingranaggi", W: "Guarda il quadrante", v: "Esci" },
        flavor: { T: "Un tavolo da bottoni, già apparecchiato. I bottoni del Dottore sono neri e lucidi, con una bandierina disegnata sopra.", L: "Ingranaggi grandi come ruote di tram. Uno ha la scritta «fuorigioco», un altro «sempre». Girano insieme.", W: "Il quadrante dell'orologio, da dietro: le lancette sono legate con un fischietto. Fuori, la città con un piede alzato." },
        intro: [["voce", "La Torre dell'Orologio: ingranaggi enormi, polvere d'oro, e in mezzo un uomo con la barba bianca, il fischietto in bocca e una bandierina in mano. La alza, solenne, appena entri."], ["mg_dottore", "[furbo] FUORIGIOCO."]],
        npcs: () => [{ id: "mg_dottore", at: [10, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(2, 1, 6, 1, "L"); lay(13, 1, 17, 1, "L"); put(10, 1, "W"); lay(8, 7, 12, 7, "T"); put(2, 10, "s"); },
      },
    };
    function finale(power) {
      const PN = { fulmine: "Fulmine Granata", gigante: "Bottone Gigante", calamita: "Calamita" }[power];
      K.ownMatch(window.__bottoni.start, {
        oppStyle: "pressing", title: "Super-Bottoni · contro il Dottor Fuorigioco", us: "Il Mantello e soci", usColor: "#8a1a2a", power, oppPower: "specchio", shots: 8,
        mates: [{ name: "Bullone", skin: "#b8c4d0", hair: "#8a9aa8" }, { name: "Gilda", skin: "#e8c4a0", hair: "#2a1a3a" }, { name: "Tilde", skin: "#f0d0b0", hair: "#e8e8f0" }],
        opp: { name: "Il Dottor Fuorigioco", color: "#1a1a1a", players: [{ name: "Dottore", skin: "#e8d0b8", hair: "#e8e8e8" }, { name: "Bandierina", skin: "#d9a679", hair: "#3a3a3a" }, { name: "Linea", skin: "#e8c4a0", hair: "#1a1a1a" }, { name: "Moviola", skin: "#c68642", hair: "#5a3a2a" }] },
        intro: `<p>La finale, sul tavolo da bottoni della Torre. Il tuo potere: <b>${PN}</b>. Il Dottore gioca in pressing, e quando la sua barra è piena usa lo <b>Specchio</b>: il tuo tiro dopo esce rovesciato, destra e sinistra. Tira storto apposta.</p>`, winTitle: "KABOOM! LA CITTÀ È LIBERA!",
        done: (r) => {
          if (!r.win) return K.scene([["mg_dottore", "[furbo] Fuorigioco. Fuorigioco di nuovo. (Abbassa la bandierina, un pochino.) …Rigiochiamo. Ma stavolta guardo meglio."]], () => K.enterZone("mg_torre"), "mg_torre");
          setStep(N, 3); bond("fama", 2); K.learnLore("l_specchio");
          K.scene([["voce", "KABOOM! Il pallone entra, il fischietto ipnotico cade dalla bocca del Dottore, rimbalza tre volte sul tavolo, e si zittisce. In tutta Metropolenta, la gente abbassa il piede alzato. Il tram riparte. I piccioni ripartono. Le lancette della Torre fanno un giro intero, per recuperare."], ["mg_dottore", "[sorpreso] Era… regolare. Il gol. Era regolarissimo. (Si toglie gli occhiali.) Non ricordavo che effetto facesse, un gol regolare. Fa venire voglia di applaudire."]], () => K.enterZone("mg_torre"), "mg_torre");
        },
      });
    }
    function powerAsk() {
      const opts = [{ label: "⚡ Fulmine Granata", sub: "Il tiro passa attraverso gli avversari", big: true, fn: () => finale("fulmine") }, { label: "🔘 Bottone Gigante", sub: "Il disco diventa enorme", big: true, fn: () => finale("gigante") }];
      if (F.is("pow_calamita")) opts.push({ label: "🧲 Calamita", sub: "Il pallone è attirato dalla porta", big: true, fn: () => finale("calamita") });
      opts.push({ label: "Non ancora", fn: done });
      ask("voce", "Il Dottor Fuorigioco apparecchia il tavolo da bottoni. Nonna Tilde, dalla radiolina di Bullone: «Caro, quale potere ti cucio per la finale? Uno solo: la stoffa è quella che è».", opts, "mg_torre");
    }
    function endingAsk() {
      const opts = [{ label: "«Metropolenta è libera. Io resto qui, se serve»", sub: "L'eroe di Metropolenta", big: true, fn: () => ending("eroe") }];
      if (F.is("mg_volto")) opts.push({ label: "«Tutti sanno chi sono. Facciamo una squadra di mantelli»", sub: "La Lega dei Mantelli", big: true, fn: () => ending("lega") });
      if (st("fama") >= 10) opts.push({ label: "«Dottore, alla città serve un arbitro. Uno vero»", sub: "Il Dottore con il fischietto", big: true, fn: () => ending("arbitro") });
      if (allRitagli() && st("segreto") >= 3) opts.unshift({ label: "I ritagli di stoffa granata cominciano a cucirsi da soli…", sub: "Segreto: tutti i ritagli e l'identità custodita", cls: "hot", big: true, fn: () => ending("tilde") });
      ask("mg_dottore", "Ho fischiato fuorigioco a tutta la città perché per quarant'anni nessuno mi ha mai dato ragione. Avevo sempre ragione, sai? Un centimetro, un capello. Ma nessuno applaudiva il guardalinee.\n\nE adesso, Mantello? Cosa ne fai di un vecchio con un fischietto?", opts, "mg_finale");
    }
    function ending(kind) {
      const R2 = { eroe: { coins: 120, cos: ["mg_c3", "mg_eroe"] }, lega: { coins: 130, cos: ["mg_c3", "mg_lega"] }, arbitro: { coins: 130, cos: ["mg_c3", "mg_arbitro"] }, tilde: { coins: 200, cos: ["mg_c3", "mg_tilde"] } }[kind];
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        eroe: [["voce", "Il Dottore consegna il fischietto alla Capitana Brace, che lo mette in una teca, accanto alla moka. Tu esci dalla Torre in volo, il mantello che sventola, e la città, per la prima volta, alza la testa per guardarti."], ["mg_gilda", "[ride] Prima pagina di domani: «GRAZIE, MANTELLO». Due parole. Le più difficili da scrivere, in tutta la mia carriera."], ["voce", "<b>FINALE · L'EROE DI METROPOLENTA.</b> Quando un pallone finisce sul tetto, quando un tram si ferma, quando qualcuno ha bisogno di una mano: un lampo granata, e la mano c'è."]],
        lega: [["mg_tilde", "[felice] Una squadra di mantelli? Allora mi servono dieci metri di stoffa granata. E un caffè. Bullone, il caffè."], ["voce", "In una settimana, Nonna Tilde cuce undici mantelli: per Gilda, per Brace, per i tre Panchinari, per Madame Colla, per Bullone (un mantellino), e per altri quattro che non avevano mai pensato di poter essere eroi."], ["voce", "<b>FINALE · LA LEGA DEI MANTELLI.</b> Undici eroi, nessun segreto. La domenica giocano a bottoni sul tavolo della sartoria, e perdono sempre contro Tilde."]],
        arbitro: [["mg_dottore", "[sorpreso] Un arbitro? Io? (Si guarda la bandierina, come se la vedesse per la prima volta.) …Fischierei solo quando c'è. Solo quando c'è davvero."], ["voce", "Il Dottor Fuorigioco fa il corso da arbitro. Lo passa con il massimo dei voti, e piange alla consegna del fischietto. Alla sua prima partita fischia un rigore, giusto. Lo applaudono tutti e due gli spalti."], ["voce", "<b>FINALE · IL DOTTORE CON IL FISCHIETTO.</b> Il miglior arbitro di Metropolenta. Ogni tanto alza la bandierina per niente, per abitudine. Poi la riabbassa e chiede scusa."]],
        tilde: [["voce", "I ritagli di stoffa che hai raccolto per tutta la città si sollevano dalla tasca, uno dopo l'altro, e si cuciono da soli, con un filo d'oro: una toppa, un'altra, un'altra ancora. Viene fuori un disegno. È un mantello granata. Più vecchio del tuo."], ["mg_tilde", "[furbo] Eh. L'hai capito, allora. Quarant'anni fa, a Metropolenta, c'era un'altra Mantello Granata. Volava un po' storta, perché aveva gli spilli in bocca."], ["mg_tilde", "[ride] Non l'hai detto a nessuno chi sei, e hai fatto bene. Un eroe è più forte quando nessuno sa a chi dire grazie: così lo dicono a tutti."], ["voce", "<b>FINALE SEGRETO · LA PRIMA MANTELLO GRANATA.</b> Due mantelli, nello stesso armadio. Quando la città chiama, a volte ne escono due."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "mg_finale");
    }
    const talk = {
      mg_tilde() {
        if (S() === 0) return say([["mg_tilde", "[pensa] Senti? FRIIIT. Ogni minuto. Tutti i fischietti di Metropolenta fischiano fuorigioco. Al mercato, alla posta, ai matrimoni. La sposa è rimasta con un piede alzato sull'altare."], ["mg_tilde", "È il Dottor Fuorigioco, dalla Torre dell'Orologio. Il Viale è bloccato da due file di auto in doppia fila. Per quelle serve qualcosa di grosso."], ["voce", "Nonna Tilde scuce dal cappotto del sindaco (appeso lì per un orlo da sei anni) un bottone enorme, e lo cuce sul mantello."], ["mg_tilde", "[furbo] Il sindaco non se ne accorgerà. Non se ne accorge da sei anni. Giralo, e diventi alto come un lampione."], ["voce", "<b>Nuova forma: GIGANTE.</b> Scavalchi le auto in doppia fila. Il Viale dei Tigli è a sud della piazza."]], () => { F.set("forma_gigante", true); setStep(N, 1); K.learnLore("l_gigante_f"); quest("mg_torre", "La Torre dell'Orologio", "In fondo al Viale dei Tigli, oltre le auto in doppia fila."); done(); });
        return say([["mg_tilde", S() >= 3 ? "[felice] Sento il tram! E i piccioni! E la sposa che finalmente dice sì! Bravo, caro." : "Il bottone del sindaco tiene bene? Non tirare troppo, che poi si sfila."]]);
      },
      mg_vigile() {
        if (S() === 1 && !F.is("mg_travestito")) return ask("mg_vigile", "Lei! Col mantello! (Ti guarda, poi guarda Gilda, che ti guarda con il taccuino in mano.) …La signorina della stampa dice che lei è il Mantello Granata. È vero? Devo fare un verbale.", [
          { label: "(Ti metti il cappello del vigile) «Mantello? Quale mantello?»", sub: "Proteggi l'identità segreta", big: true, fn: () => { F.set("mg_travestito", true); bond("segreto", 1); say([["mg_vigile", "[sorpreso] Ah, mi scusi, collega! Non l'avevo riconosciuta, col mantello. Buon lavoro."], ["mg_gilda", "[furbo] …Ci sono quasi. Ci sono QUASI."]]); } },
          { label: "«Sì, sono io. Faccia pure il verbale»", sub: "Niente segreti", big: true, fn: () => { F.set("mg_travestito", false); bond("segreto", -1); bond("fama", 1); say([["mg_vigile", "[felice] Verbale numero uno: «Il Mantello Granata ha salvato la città». Lo incornicio."], ["mg_gilda", "[ride] Ecco, adesso lo sa anche il vigile. Domani lo sa anche il sindaco. Dopodomani, sua nonna."]]); } },
        ], "mg_viale");
        return say([["mg_vigile", S() >= 3 ? "Le auto si muovono! Dopo trentacinque anni! (Si commuove.) Una è partita senza autista, per l'emozione." : "Multa. Multa. Multa. Sono sempre le stesse auto, dal 1987. Ormai le chiamo per nome. Quella blu è Gisella."]]);
      },
      mg_tonno() {
        if (S() >= 1 && S() <= 2 && !F.is("pow_calamita")) return say([["mg_tonno", "[felice] Mantello! Abbiamo giocato da titolari! Abbiamo perso nove a zero ed è stato il giorno più bello della nostra vita! Per ringraziarti, tieni: la calamita della nostra panchina."], ["mg_tonno", "La usavamo per non far cadere i panini. A bottoni, attira il pallone dove vuoi tu. Usala contro il Dottore: ci fischiava sempre fuorigioco, anche quando eravamo in panchina."], ["voce", "<b>Nuovo potere per la finale: CALAMITA.</b>"]], () => { F.set("pow_calamita", true); K.learnLore("l_calamita"); done(); });
        return say([["mg_tonno", "Domenica rigiochiamo! Stavolta puntiamo al sette a zero. Contro, ma è un miglioramento."]]);
      },
      mg_dottore() {
        const s = S();
        if (s <= 2) { if (s < 2) setStep(N, 2); return powerAsk(); }
        if (s === 3) return endingAsk();
        return say([["mg_dottore", "[felice] Fuori… (si ferma) …no. Regolare. È tutto regolare. Che parola bella."]]);
      },
    };
    const obj = {
      "mg_piazza:v": () => go("mg_viale", 17, 1), "mg_viale:^": () => go("mg_piazza", 12, 22),
    };
    const patch = {
      mg_piazza: { build(L) { L.put(12, 23, "v"); L.lay(12, 22, 12, 22, ":"); } },
    };
    return { n: N, title: "Il Dottor Fuorigioco", sub: "La forma Gigante, il Viale dei Tigli, la Torre dell'Orologio", goal, start: "mg_piazza", introBg: "mg_viale", zones, talk, obj, patch,
      intro: () => [["voce", "<b>IL MANTELLO GRANATA</b>, numero 3: «Il Dottor Fuorigioco». FRIIIT! Una mattina, tutti i fischietti di Metropolenta cominciano a fischiare fuorigioco. A tutto. E tutto si ferma."]] };
  }
  boot();
})();
