// js/spazio-c3.js - CALCIO SPAZIALE · Capitolo 3 «La finale tra le stelle»
// Giovedì: la finale del torneo nella Cupola d'osservazione, contro la Selezione Galattica (una nave da crociera di passaggio).
// Il mistero delle cartoline dalla Terra si scioglie: erano per la Comandante Gru, che da ragazza giocava terzino e ha lasciato
// il calcio per i regolamenti. Se le trovi tutte e tre, in finale gioca anche lei. NONNA promette di non toccare la gravità…
// e in finale non ci riesce (Gravità zero con le inversioni più frequenti). Finali: RITORNO SULLA TERRA · CAPITANO DELLE STELLE
// · LA PORTIERA DI SILICIO · (segreto) IL FUORIGIOCO PERFETTO.
(function () {
  "use strict";
  function boot() { const D = window.__spazio; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);

    K.cast("so_zorgo", { streak: "#a855f7", acc: ["medaglia"], name: "Zorgo Tre-Occhi", tag: "", hair: "#e8e84a", style: "cresta", skin: "#e89ab8", eye: "#3a1a5a", bg: ["#10162e", "#e89ab8"], shirt: "#7a3ae8" },
      "Capitano della Selezione Galattica, la squadra della nave da crociera «Nebulosa Splendida». Ha tre occhi: uno per il pallone, uno per l'avversario, uno per il buffet. Non perde una finale da quattrocento anni. Ne ha giocate due.");
    K.cos("so_c3", { kind: "shirt", label: "Maglia della Finale tra le stelle", val: "#1a2a5a", from: "Completa Calcio Spaziale" });
    K.cos("so_casa", { kind: "acc", label: "Pallone che non cade", val: "#e8e8f0", from: "Finale «Ritorno sulla Terra»" });
    K.cos("so_capitano", { kind: "acc", label: "Fascia di capitano orbitale", val: "#7af0c8", from: "Finale «Capitano delle stelle»" });
    K.cos("so_nonnag", { kind: "acc", label: "Guanti di NONNA", val: "#9ad8f0", from: "Finale «La portiera di silicio»" });
    K.cos("so_fischio", { kind: "acc", label: "Fischietto d'oro di ARBI-9", val: "#e8c84a", from: "Finale segreto «Il fuorigioco perfetto»" });
    K.cos("so_stelle", { kind: "hairc", label: "Capelli Polvere di stelle", val: "#c8d8ff", from: "Trova tutti i bulloni d'oro della Cupola" });
    K.lore("l_cart3", { t: "Cartolina dalla Terra · 3", d: "«Saluti dal campetto della scuola! Lo hanno rifatto, l'erba è vera. Il tuo posto da terzino sinistro è ancora libero. Torna quando vuoi, Ortensia. — Il tuo centravanti.»" });
    K.lore("l_gru", { t: "Il terzino sinistro", d: "Ortensia Gru, da ragazza, giocava terzino sinistro. Fortissima. Poi un giorno ha smesso, ha studiato i regolamenti e ha scelto lo spazio, dove nessuno gioca a calcio. Ogni anno le arriva una cartolina. Non le ha mai lette: le ha nascoste nelle grate." });
    K.lore("l_finale", { t: "La finale tra le stelle", d: "Prima finale di calcio nella storia dell'orbita bassa. Spettatori: sei membri d'equipaggio, otto robot, una nave da crociera intera affacciata ai finestrini, e la Terra." });

    const goal = (s) => ({
      0: "Giovedì: il giorno della finale. La Comandante Gru è nell'hangar.",
      1: "La finale si gioca nella Cupola d'osservazione (la scaletta in fondo alla Palestra). Parla con il capitano della Selezione Galattica.",
      2: "Tutto pronto. Quando vuoi, parla con ARBI-9 per il fischio d'inizio della finale.",
      3: "Hai giocato la finale. La Comandante Gru ti aspetta nella Cupola.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");

    const carts = () => K.F.get("cartoline", 0);
    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const zones = {
      so_cupola: {
        region: "cupola", name: "Calcio Spaziale · La Cupola d'osservazione", short: "La Cupola", sub: "Il campo della finale, sotto le stelle", bg: "so_cupola", time: "notte", travel: [13, 15],
        w: 26, h: 18, start: [13, 15], itemCos: "so_stelle", items: [[2, 15], [23, 15], [2, 5], [23, 5]],
        areas: [[4, 6, 21, 13, "Il campo della finale"], [0, 0, 25, 17, "La Cupola"]],
        act: { v: "Scendi in Palestra" },
        flavor: { V: ["Sopra la Cupola, tutta la galassia. La Via Lattea passa da un lato all'altro come una sciarpa.", "Una nave da crociera enorme è affiancata alla stazione: a ogni finestrino c'è un tifoso con una bandierina."], Y: "Una pianta della Serra, portata quassù da Primula «perché anche il basilico vuole vedere la finale»." },
        intro: [["voce", "La Cupola d'osservazione: una bolla di vetro in cima alla stazione. Sopra, le stelle. Sotto, la Terra. In mezzo, un campo di calcio con le linee disegnate col gesso fosforescente."], ["voce", "Accanto alla stazione è agganciata la «Nebulosa Splendida», una nave da crociera grande come una città. A ogni finestrino, un tifoso. A ogni tifoso, una bandierina."]],
        npcs: (s) => [{ id: "so_gru", at: [8, 14] }, { id: "so_arbi", at: [13, 9] }, { id: "so_zorgo", at: [18, 9] }, { id: "so_blop", at: [4, 14] }, { id: "so_quattro", at: [21, 14] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 0, "a"); lay(0, 17, 25, 17, "a"); lay(0, 0, 0, 17, "a"); lay(25, 0, 25, 17, "a"); lay(1, 1, 24, 3, "U"); lay(2, 3, 23, 3, "V"); lay(1, 4, 1, 12, "V"); lay(24, 4, 24, 12, "V"); put(13, 17, "v");
          lay(4, 6, 21, 13, "+"); put(3, 16, "Y"); put(22, 16, "Y"); put(10, 16, "Q"); put(16, 16, "Q"); put(6, 16, "E");
        },
        decor(g, cx, cy, d) { // le linee del campo col gesso fosforescente
          const a = 0.5 + 0.2 * Math.sin(d.fr / 30); g.strokeStyle = `rgba(122,240,200,${a})`; g.lineWidth = 1; g.strokeRect(d.X(4) + 2, d.Y(6) + 2, 18 * 16 - 4, 8 * 16 - 4); g.beginPath(); g.moveTo(d.X(13), d.Y(6) + 2); g.lineTo(d.X(13), d.Y(14) - 2); g.stroke(); g.beginPath(); g.arc(d.X(13), d.Y(10), 18, 0, 7); g.stroke();
          R(g, d.X(4) - 2, d.Y(9), 4, 32, "#e8e8f0"); R(g, d.X(22) - 2, d.Y(9), 4, 32, "#e8e8f0");
        },
      },
    };
    function finale() {
      const gru = F.is("so_gru_gioca");
      K.ownMatch(window.__gravita.start, { oppStyle: "contropiede",
        title: `La finale tra le stelle · ${F.get("so_nome", "Stazione 7")} – Selezione Galattica`, us: F.get("so_nome", "Stazione 7"), half: 35, nonna: true, flipEvery: 18, hard: true,
        opp: { name: "Selezione Galattica", kit: "#7a3ae8", names: ["Zorgo", "Bleeb"], skins: ["#e89ab8", "#9ae8b8"], hairs: ["#e8e84a", "#3a1a5a"] }, gk1: "#3a1a5a",
        mate: gru ? { name: "Gru", skin: "#e8c8a8", hair: "#c8c8d8", shirt: "#2a6ac8" } : { name: "Blop", skin: "#7ae86a", hair: "#5ac84a", shirt: "#2a6ac8" }, gk0: "#8a9ae8", shirt: "#1a2a5a", bg: "so_cupola", winTitle: "CAMPIONI DELL'ORBITA!",
        halftime: gru ? "Intervallo. La Comandante Gru si toglie la giacca dell'uniforme: sotto ha una maglia numero 3, vecchissima, piena di toppe. Nessuno dice niente. Tutti sorridono." : "Intervallo. Blop distribuisce zuppa in bolle. ARBI-9 non ha ancora fischiato nessun fuorigioco: si sta trattenendo. Gli tremano i bulloni.",
        introExtra: `<p>La finale. NONNA ha promesso di non toccare la gravità. Ha promesso. Davvero.${gru ? " In campo, con te, la Comandante Gru: terzino sinistro, dopo trent'anni." : ""}</p>`,
        done: (r) => {
          if (!r.win) return K.scene([["so_zorgo", "Vince la Selezione Galattica! Ma che partita. Il mio terzo occhio ha pianto. Rigiochiamola: la nave riparte solo domani, e il buffet è aperto fino a tardi."], ["so_arbi", "Articolo 6, scritto adesso: «la finale si rigioca finché tutti non sono contenti». Approvato all'unanimità. Anche dalla Selezione."]], () => K.enterZone("so_cupola"), "so_cupola");
          F.set("so_m3", true); setStep(N, 3); bond("squadra", 2); K.learnLore("l_finale");
          K.scene([["voce", "Fischio finale. La Cupola esplode. Dalla Nebulosa Splendida, mille bandierine sventolano contro i finestrini. Blop si espande per la gioia fino a occupare mezza panchina."], ["so_nonna", "(dagli altoparlanti) Scusate. Scusate! Ho girato la gravità sei volte. Avevo promesso. Ma eravate così belli a testa in giù…"], ["so_gru", "NONNA. …Grazie. Era la partita più bella della mia vita."]], () => K.enterZone("so_cupola"), "so_cupola");
        },
      });
    }
    function endingAsk() {
      const opts = [{ label: "«Torno sulla Terra con la navetta della domenica»", sub: "Con un pallone che non cade in valigia", big: true, fn: () => ending("casa") }];
      if (st("squadra") >= 7) opts.push({ label: "«Resto. Sono il vostro capitano»", sub: "La prima squadra orbitale della storia", big: true, fn: () => ending("capitano") });
      if (st("arbi") >= 5) opts.push({ label: "«NONNA, la prossima stagione in porta ci vai tu»", sub: "Un corpo da robot portiere per il computer di bordo", big: true, fn: () => ending("nonna") });
      if (carts() >= 3 && st("arbi") >= 6) opts.unshift({ label: "ARBI-9 alza la mano: «Devo dire una cosa sulla finale…»", sub: "Segreto: tutte le cartoline dalla Terra e la fiducia piena di ARBI-9", cls: "hot", big: true, fn: () => ending("fuorigioco") });
      ask("so_gru", "Campioni dell'orbita. Lo scrivo nel registro di bordo, in maiuscolo, con il pennarello indelebile. Quattrocentododici giorni di noia, e poi questa settimana.\n\nE adesso, esperto? La navetta della domenica riparte dopodomani. Lei che fa?", opts, "so_finale");
    }
    function ending(kind) {
      const R2 = { casa: { coins: 120, cos: ["so_c3", "so_casa"] }, capitano: { coins: 130, cos: ["so_c3", "so_capitano"] }, nonna: { coins: 130, cos: ["so_c3", "so_nonnag"] }, fuorigioco: { coins: 200, cos: ["so_c3", "so_fischio"] } }[kind];
      if (kind === "capitano") F.set("so_capitano", true);
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        casa: [["voce", "Domenica, la navetta riparte. Tutto l'equipaggio è nell'hangar. Blop ti regala una zuppa in barattolo «per il viaggio, se scappa inseguila». Quattrobraccia ti saluta con quattro mani, poi ricomincia dalla prima."], ["so_nonna", "Hai mangiato, caro? Ti ho messo dei cracker in valigia. E una maglia. Scrivici. Una cartolina, come quelle della Comandante."], ["voce", "<b>FINALE · RITORNO SULLA TERRA.</b> Sulla Terra, il pallone che hai portato rimbalza un po' troppo. Ogni tanto, la sera, guardi in su."]],
        capitano: [["voce", "Resti a bordo. La Comandante Gru firma il modulo di assunzione in triplice copia: «Capitano della squadra orbitale». Blop mangia la terza copia. È inevitabile."], ["so_gru", "Nuovo primato della stazione: la prima squadra di calcio dell'orbita bassa. Il vecchio primato, quello della noia, l'ho cancellato dal registro. Con il pennarello indelebile. Ci ho messo un'ora."], ["voce", "<b>FINALE · CAPITANO DELLE STELLE.</b> La noia è finita. Adesso la Stazione 7 è famosa in tutta la galassia, e le navi da crociera prenotano per vedere le partite."]],
        nonna: [["voce", "Mira Zetta lavora tre settimane in Sala Macchine. Il risultato: un robot portiere alto due metri, con le braccia lunghe e un grembiule. Dentro, NONNA."], ["so_nonna", "Oh. Oh, caro. Ho le mani. Ho le mani! Posso… posso parare? (Para tutto il primo allenamento. Dopo ogni parata chiede a chi ha tirato se ha mangiato.)"], ["so_arbi", "Mamma in porta. Articolo 7: «se il portiere è tua madre, l'arbitro può commuoversi». Lo uso subito."], ["voce", "<b>FINALE · LA PORTIERA DI SILICIO.</b> NONNA gioca la sua prima partita. Non perde un pallone. Non perde una merenda."]],
        fuorigioco: [["so_arbi", "Devo dire una cosa. Al minuto trentuno della finale, l'attaccante della Selezione era oltre l'ultimo difensore quando gli hanno passato la palla. Non ho fischiato. Era… fuorigioco. Un fuorigioco VERO. Il primo della mia vita."], ["voce", "ARBI-9 si siede. Dagli occhi gli scendono due gocce di olio. Piange per un'ora intera. Nessuno lo interrompe: è la cosa più bella che la Stazione 7 abbia mai visto."], ["so_gru", "(con le tre cartoline in mano) Ortensia Gru, terzino sinistro, dichiara: anche io sono stata in fuorigioco per trent'anni. Fuori dal gioco. Domenica scrivo al mio centravanti. Con una cartolina della Terra vista da quassù."], ["voce", "<b>FINALE SEGRETO · IL FUORIGIOCO PERFETTO.</b> ARBI-9 ha capito l'articolo 3. Il fischietto d'oro, adesso, lo porta al collo il Campione."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "so_finale");
    }
    const talk = {
      so_gru() {
        const s = S(), here = K.api.trZone();
        if (s === 0) return say([
          ["so_gru", "Giovedì! La finale! Ho dormito quattro minuti. Li ho cronometrati. La Selezione Galattica è arrivata stanotte con una nave da crociera: hanno un buffet che si vede dallo spazio."],
          ["so_gru", "Si gioca nella Cupola d'osservazione, in cima: la scaletta è in fondo alla Palestra. Vada a presentarsi al loro capitano. Io… io arrivo. Devo solo cercare una cosa."],
        ], () => { setStep(N, 1); quest("so_finale", "La finale tra le stelle", "Sali nella Cupola (la scaletta in fondo alla Palestra) e parla con il capitano della Selezione Galattica."); done(); });
        if (s === 3 && here === "so_cupola") return endingAsk();
        if (s >= 1 && s < 3 && carts() >= 3 && !F.is("so_gru_gioca")) {
          return ask("so_gru", "Cosa ha in mano? …Quelle cartoline. Le ho nascoste io, nelle grate. Tre anni, tre cartoline. Non le ho mai lette. Le legge lei, per favore? Io non ce la faccio.", [
            { label: "Leggile ad alta voce", sub: "«Il tuo posto da terzino sinistro è ancora libero»", cls: "hot", fn: () => { F.set("so_gru_gioca", true); K.learnLore("l_gru"); bond("squadra", 1); say([["voce", "Leggi la terza cartolina: «Il tuo posto da terzino sinistro è ancora libero. Torna quando vuoi, Ortensia. — Il tuo centravanti»."], ["so_gru", "(lunghissimo silenzio) Terzino sinistro. Ero fortissima, sa? Poi ho avuto paura di non esserlo più, e ho scelto i regolamenti. Nei regolamenti non si sbaglia mai un passaggio."], ["so_gru", "In finale gioco anch'io. Se il regolamento lo permette. …Il regolamento lo scrivo io. Lo permette."]]); } },
            { label: "Ridagliele chiuse", sub: "Le leggerà lei, quando vorrà", fn: () => say([["so_gru", "Grazie. Le leggerò. Domenica. O la prossima. …Forse."]]) },
          ], "so_cupola");
        }
        if (here === "so_cupola") return say([["so_gru", K.pick(["La Cupola è pronta. Le linee col gesso fosforescente le ho tirate io, col righello. Sono dritte al micron.", "Ho controllato il regolamento della finale undici volte. Poi l'ho dato ad ARBI-9 e l'ha mangiato. No, quello era Blop."])]]);
        return say([["so_gru", "La finale è nella Cupola. Su, su, su! (Sta cercando qualcosa nelle grate dell'hangar, carponi. Quando ti vede, fa finta di niente.)"]]);
      },
      so_zorgo() {
        const s = S();
        if (s === 1) return say([
          ["so_zorgo", "Ah, la squadra della stazione! Zorgo Tre-Occhi, capitano della Selezione Galattica. Il primo occhio guarda te, il secondo il pallone, il terzo il buffet. Non offenderti: il buffet è eccezionale."],
          ["so_zorgo", "Noi giochiamo in ogni porto della galassia. Di solito vinciamo. Una volta abbiamo pareggiato con un pianeta intero: erano in sei miliardi, ma molto disorganizzati. Quando sei pronto, parla con il vostro arbitro. Sembra… agitato."],
        ], () => { setStep(N, 2); done(); });
        return say([["so_zorgo", K.pick(["Il buffet della Nebulosa ha diciotto tipi di gelato. Uno è al gusto «nostalgia». Sa di merendina delle elementari.", "Bella stazione. Piccola. Mi piace. Sulla nostra nave ci si perde: ho un cugino che cerca la piscina da quattro anni."])]]);
      },
      so_arbi() {
        const s = S(), here = K.api.trZone();
        if (here === "so_cupola" && s === 2) {
          if (!F.is("so_arbi_paura")) return ask("so_arbi", "BIP. Prima del fischio d'inizio, una domanda. Non c'entra il regolamento. Se in finale sbaglio un fuorigioco… mi spegnete? Mi rimettono nella scatola del tostapane?", [
            { label: "«Nessuno ti spegne. Sbagliare fa parte del gioco»", sub: "Rassicuralo", fn: () => { F.set("so_arbi_paura", true); bond("arbi", 2); say([["so_arbi", "Sbagliare fa parte del gioco. Lo salvo nella memoria permanente. Quella che non si cancella neanche staccando la spina. Grazie."]]); } },
            { label: "«Allora non sbagliare»", sub: "Pressione da finale", fn: () => { F.set("so_arbi_paura", true); bond("arbi", -1); say([["so_arbi", "Non sbagliare. Ricevuto. Sto… sto bene. I bulloni mi tremano per il freddo. Fa freddo. Nella Cupola. Sì."]]); } },
          ], "so_cupola");
          return ask("so_arbi", "Squadre in campo. Pubblico ai finestrini. NONNA ha promesso di non toccare la gravità. Lo ha promesso.\n\nFischio l'inizio della finale?", [{ label: "Gioca la finale", sub: "Gravità zero, contro la Selezione Galattica", cls: "hot", fn: finale }, { label: "Un momento", fn: done }], "so_cupola");
        }
        return say([["so_arbi", s >= 3 ? "Ho arbitrato una finale. UNA FINALE. Lo dirò al tostapane della mensa, che è un mio lontano parente." : "Pronto per la finale. Ho lucidato il fischietto. Due volte. Una con lo straccio, una con la lingua: non ho la lingua, ma il gesto c'era."]]);
      },
      so_blop() { return say([["so_blop", S() >= 3 ? "Campioni! Blop! Ho fatto la zuppa della vittoria! È uguale a quella di sempre, ma la prima cucchiaiata la dai tu." : "Finale! Sono così emozionato che sono diventato verde scuro. Di solito sono verde chiaro. Tocca qui: sono tutto tremolante."]]); },
      so_quattro() { return say([["so_quattro", S() >= 3 ? "Ho parato con tutte e quattro le mani. Una volta anche con la testa, ma era a testa in giù, quindi conta come piede." : "In porta, in finale, con la Terra sotto e le stelle sopra. Ciao, ciao, ciao, ciao: sto salutando la galassia, poi mi concentro."]]); },
    };
    const obj = {
      "so_palestra:^": () => go("so_cupola", 13, 15), "so_cupola:v": () => go("so_palestra", 12, 2),
      "so_cupola:E": () => { K.learnLore("l_cart3", true); K.cartolina("so_cupola", "Infilata nella grata della Cupola, l'ultima cartolina: «Saluti dal campetto della scuola! Il tuo posto da terzino sinistro è ancora libero. Torna quando vuoi, Ortensia». Ortensia… Ortensia Gru. La Comandante."); },
      "so_cupola:Q": () => say([["so_nonna", S() >= 3 ? "Lo so, lo so. Ho girato la gravità. Sei volte. Non riuscivo a trattenermi: eravate così belli a testa in giù. Hai mangiato, almeno?" : "Ho promesso: in finale non tocco la gravità. Promesso. Giurato. (pausa) …Quasi giurato."]]),
    };
    const patch = {
      so_palestra: { build(L) { L.put(12, 1, "^"); }, act: { "^": "Sali nella Cupola" } },
      so_hangar: { npcs: (s, list) => (s >= 1 ? list.filter((n) => n.id !== "so_gru" && n.id !== "so_arbi" && n.id !== "so_blop") : list) },
    };
    return { n: N, title: "La finale tra le stelle", sub: "La Cupola, le cartoline, la Selezione Galattica", goal, start: "so_hangar", introBg: "so_cupola", zones, talk, obj, patch,
      intro: () => [["voce", "Giovedì. Alle sei del mattino, NONNA accende tutte le luci della stazione insieme e mette la musica a volume altissimo. «È il giorno della finale! Avete mangiato?»"], ["voce", "Dall'oblò della cuccetta vedi una nave enorme, illuminata come un albero di Natale, che si avvicina piano. Sulla fiancata, a lettere d'oro: «NEBULOSA SPLENDIDA · CROCIERE GALATTICHE · SELEZIONE DI CALCIO A BORDO»."]] };
  }
  boot();
})();
