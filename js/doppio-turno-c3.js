// js/doppio-turno-c3.js - DOPPIO TURNO · Capitolo 3 «Il Rigore»
// Dentro: la Sala della Voce sotto il Campo Bianco (serve la mappa del Fuori). Fuori: il vecchio Stadio del Porto e il dischetto.
// Colpo di scena: la Voce sei tu. Finale della Coppa della Costa in Action Soccer 2D HD (forzata), poi il rigore decisivo:
// la Voce dice «non tirare». Quattro finali: dipendono da cosa le due metà si sono dette, dai biglietti falsi smascherati,
// dall'Indice di Conformità, da Nina, dalla maglia che indossi e da quel rigore.
(function () {
  "use strict";
  function boot() { const DTm = window.__doppioTurno; if (!DTm || !DTm.addChapter || !DTm._has || !DTm._has(2)) return setTimeout(boot, 120); DTm.addChapter(chapter3); }
  function chapter3(X) {
    const { T, F, say, ask, done, go, note, setStep, reward, knows, learnFact, conf, finishChapter } = X;
    const N = 3, S = () => X.stepOf(N);
    const zone = () => X.api.trZone();
    const shared = () => knows("f_rigore", "d") || knows("d_rigore", "f");
    const ally = () => F.get("nina") === "alleata";

    X.cos("dt_c3", { kind: "shirt", label: "Maglia del Porto Livido FC", val: "#7a3b2e", from: "Completa Doppio Turno" });
    X.cos("dt_sala_c", { kind: "hairc", label: "Capelli Bobina", val: "#3a2a1a", from: "Raccogli tutte le graffette d'oro nella Sala della Voce" });
    X.cos("dt_stadio_c", { kind: "shirt", label: "Maglia del 14", val: "#c9a227", from: "Raccogli tutte le conchiglie allo Stadio del Porto" });
    X.cos("dt_end_unito", { kind: "hairc", label: "Capelli Metà e Metà", val: "#5a8a7a", from: "Finale di Doppio Turno: UN SOLO TURNO" });
    X.cos("dt_end_diviso", { kind: "shirt", label: "Maglia Doppio Turno", val: "#4a5a6a", from: "Finale di Doppio Turno: DOPPIO TURNO" });
    X.cos("dt_end_dentro", { kind: "shirt", label: "Divisa Bianca del Complesso", val: "#eef2f1", from: "Finale di Doppio Turno: IL DENTRO RESTA" });
    X.cos("dt_end_porto", { kind: "hairc", label: "Capelli Lucine del Porto", val: "#ff7a7a", from: "Finale segreto di Doppio Turno: IL PORTO RINASCE" });

    X.fact("d_rigore", { t: "La Voce sei tu", d: "La bobina completa: è la voce del Fuori, registrata il giorno della firma. «Se arriva un rigore, non tirarlo. Passalo. Non tirare mai più.»" });
    X.fact("f_rigore", { t: "Il rigore sbagliato", d: "Tre anni fa, all'ultimo minuto dell'ultima partita del Porto Livido FC, il 14 ha sbagliato il rigore che avrebbe salvato il club. Il giorno dopo lo stadio era in vendita." });
    X.noteDef("n_finale", { to: "d", ink: "penna blu aziendale", sign: "{num}", fake: true, who: "il Complesso",
      text: "Sono il Fuori. Ho capito tutto: domani alla finale obbedisci alla Voce. Fallo per Nina. Lei vuole che tu vinca col Valtorre.",
      tell: "Il Fuori scrive con il pennarello verde, sempre. Questo è in penna blu aziendale: l'inchiostro del Complesso. E Nina, il Valtorre, non lo vuole vedere vincere.",
      onBelieve: () => { conf(6); F.set("finale_creduto", true); }, onUnmask: () => F.set("finale_smascherato", true) });

    const goal = (s) => ({
      0: "Parla con la Dott.ssa Valtorre e con Ofelia, nell'atrio.",
      1: knows("f_mappa") ? "Scendi nella Sala della Voce: botola in fondo a destra del Campo Bianco." : "Ti serve la mappa del Fuori: esci (ascensore), lascia al Dentro un biglietto con «La mappa del Complesso» e rientra.",
      2: "Nella Sala della Voce: ascolta la bobina completa.",
      3: "Vai Fuori, al vecchio Stadio del Porto: dal luna park, il cancello in basso.",
      4: "Torna Dentro: la finale è al Campo Bianco. Parla con la Dott.ssa Valtorre. (Prima, se vuoi, scrivi all'altra metà quello che hai scoperto.)",
      5: "Il rigore.",
      6: "Decidi cosa fare della Procedura Duale.",
    }[s] || "Doppio Turno è concluso. Dal menu puoi rigiocare i capitoli e cercare gli altri finali.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y, f) { g.font = "bold 7px system-ui, sans-serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, f ? "rgba(26,16,24,.85)" : "#ffffff"); R(g, x - w / 2, y + 2, w, 1, f ? "#ffb347" : "#2a9d8f"); g.fillStyle = f ? "#ffcf7a" : "#2b3a3a"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    const zones = {
      dt_sala: {
        half: "d", name: "Doppio Turno · La Sala della Voce", short: "La Sala della Voce", sub: "Sotto il Campo Bianco, dove nessuno va", bg: "dt_sala",
        w: 26, h: 18, start: [12, 15], itemCos: "dt_sala_c", items: [[1, 3], [24, 3], [1, 16], [24, 16]],
        areas: [[8, 6, 17, 12, "Il registratore"], [1, 1, 24, 16, "La Sala della Voce"]],
        act: { d: "Guarda lo schermo", V: "Ascolta la bobina completa", l: "Guarda il microfono", b: "Guarda la sedia", v: "Risali al Campo Bianco" },
        flavor: {
          d: ["Uno schermo mostra un occhio. Il tuo. Sbatte le palpebre quando le sbatti tu.", "Uno schermo mostra una scritta: «Seduta 1 — titolare: 14 — durata: 3 ore e 12 minuti»."],
          l: "Un microfono da radio, con la gommapiuma consumata. La lucina REC è accesa da tre anni.",
          b: "Una sedia verde acqua davanti al microfono. Un bracciolo è consumato. Ti siedi. Si adatta perfettamente.",
        },
        intro: [["voce", "La botola si apre su una scala di ferro. In fondo, una stanza bassa e calda, piena di schermi. Al centro, un registratore a bobine grande come un armadio. La lucina REC di un microfono è accesa."]],
        npcs: (s) => (s >= 2 && s <= 3 ? [{ id: "dt_valtorre", at: [16, 13] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 0, "a"); lay(0, 17, 25, 17, "a"); lay(0, 0, 0, 17, "a"); lay(25, 0, 25, 17, "a");
          lay(2, 1, 23, 1, "d"); put(12, 8, "V"); put(13, 8, "V"); put(16, 9, "l"); put(10, 10, "b"); lay(8, 11, 17, 12, '"');
          put(12, 17, "v"); put(13, 17, "v");
        },
      },
      dt_stadio: {
        half: "f", name: "Doppio Turno · Il vecchio Stadio del Porto", short: "Lo Stadio del Porto", sub: "Fari rubati, erba alta, un dischetto", bg: "dt_stadio", grass: true,
        w: 36, h: 24, start: [18, 21], itemCos: "dt_stadio_c", items: [[1, 5], [34, 5], [1, 21], [34, 21]],
        areas: [[4, 6, 31, 20, "Il campo del Porto Livido"], [1, 1, 34, 3, "Le vecchie tribune"], [5, 11, 10, 16, "L'area di rigore"]],
        act: { I: "Fermati sul dischetto", j: "Guarda le tribune", g: "Guarda la porta", l: "Guarda il faro", v: "Torna al luna park" },
        flavor: {
          j: ["Seggiolini color mattone e oro. Ne mancano tanti. Su uno è rimasta una sciarpa: «P.L.F.C. – noi non molliamo».", "Sulla tribuna, a vernice: «14 PER SEMPRE». Sotto, più piccolo e più recente: «anche se».", "Un seggiolino ha inciso un nome: «Nina R.». Accanto, un altro: il tuo. Stesso coltellino."],
          g: "La porta del Porto Livido. La rete è rotta in un punto preciso, in basso a destra. Lì non è mai entrato niente.",
          l: "Un faro dello stadio, acceso. Dal palo scende un cavo verde che sparisce verso il luna park.",
        },
        intro: [["voce", "Il vecchio Stadio del Porto. I fari si accendono uno a uno, a scatti, rubati dal cavo verde del Cartografo. L'erba è alta fino alle caviglie. Sulle tribune, sciarpe dimenticate."], ["voce", "In mezzo all'area di rigore, il dischetto bianco brilla come una moneta. Le tue gambe lo riconoscono prima della tua testa."]],
        npcs: (s) => { const o = [{ id: "dt_cartografo", at: [30, 22] }, { id: "dt_scheggia", at: [20, 16] }]; if (ally()) o.push({ id: "dt_nina", at: [14, 10] }); else o.push({ id: "dt_nina", at: [26, 8] }); return o; },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 23, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          lay(1, 1, 34, 3, "j"); lay(4, 6, 31, 20, "-"); [12, 13, 14, 15].forEach((y) => { put(3, y, "g"); put(32, y, "g"); }); put(8, 13, "I");
          [[2, 5], [33, 5], [2, 20], [33, 20]].forEach(([x, y]) => put(x, y, "l"));
          put(17, 23, "v"); put(18, 23, "v");
        },
        decor(g, cx, cy, d) { plaque(g, "PORTO LIVIDO FC", d.X(18), d.Y(4) + 4, true); },
      },
    };
    const patch = {
      dt_atrio: { npcs: (s) => (s === 0 ? [{ id: "dt_valtorre", at: [14, 8] }, { id: "dt_ofelia", at: [18, 8] }] : s <= 1 ? [{ id: "dt_ofelia", at: [18, 8] }] : []) },
      dt_campo: { act: { Q: "Apri la botola" }, build: (L) => L.put(28, 20, "Q"), npcs: (s) => { const o = [{ id: "dt_bruno", at: [11, 20] }]; if (s >= 4 && s <= 6) o.push({ id: "dt_valtorre", at: [17, 20] }, { id: "dt_nina", at: [22, 19] }, { id: "dt_scheggia", at: [24, 19] }); return o; } },
      dt_porto: { npcs: (s) => [{ id: "dt_pio", at: [3, 18] }] },
      dt_giostre: { npcs: (s) => [{ id: "dt_cartografo", at: [18, 13] }] },
      dt_uffici: { npcs: (s) => [{ id: "dt_bruno", at: [11, 8] }] },
    };

    // ---------------------------------------------------------------- dialoghi
    function valtorre() {
      const s = S(), z = zone();
      if (z === "dt_atrio" && s === 0) return say([
        ["dt_valtorre", "Buongiorno, {n}. Oggi è il giorno. La finale della Coppa della Costa, qui, al Campo Bianco. Contro… una squadra di nostalgici. Il Porto Livido FC, pare."],
        ["dt_valtorre", "La Voce sarà con te, come sempre. Ascoltala. Lei sa cosa è meglio per te. Lo sa da molto prima di me."],
      ], () => { if (!F.is("c3_ofelia0")) return done(); setStep(N, 1); X.plant("n_finale"); done(); });
      if (z === "dt_sala") return say([
        ["dt_valtorre", "Sapevo che saresti arrivato qui. Prima o poi arrivano tutti. Quasi tutti."],
        ["dt_valtorre", "Non sono io la Voce, {n}. Non lo sono mai stata. La Voce sei tu. Il te di fuori, il giorno della firma. Sei venuto qui, ti sei seduto su quella sedia, e hai registrato tre ore di consigli per il te di dentro."],
        ["dt_valtorre", "«Passa, non tirare, sorridi, obbedisci.» Ma soprattutto una cosa: «Se arriva un rigore, non tirarlo». È per questo che hai firmato. Non per i soldi. Per non dover mai più tirare un rigore."],
        ["dt_valtorre", "Noi abbiamo solo… preso il resto. Il tuo talento, senza i tuoi dubbi. Un affare. Per tutti."],
        ["hero", "E se oggi arriva un rigore?"],
        ["dt_valtorre", "Allora la Voce ti dirà cosa fare. Come sempre. A dopo, {n}. Al Campo Bianco."],
      ], () => { if (S() === 2) setStep(N, 3); note("La Voce sono io: il Fuori l'ha registrata il giorno della firma per non tirare mai più un rigore."); done(); });
      if (s === 4) return finaleAsk();
      if (s === 5) return rigore();
      if (s === 6) return endingsAsk();
      if (s >= 7) return say([["dt_valtorre", { unito: "Hai strappato il contratto. Che spreco. Che… meraviglia, forse. Non lo dirò a nessuno.", dentro: "Benvenuto a casa, {n}. Per sempre. Sorridi.", porto: "Lo stadio è vostro. Il Complesso resta. Ci vedremo in campo, ogni domenica. Come avversari, finalmente.", diviso: "Domani alle otto, {n}. Come sempre." }[F.get("fine")] || "A domani, {n}."]]);
      return say([["dt_valtorre", "Sorridi, {n}. Oggi più del solito."]]);
    }
    function ofelia() {
      if (S() === 0 && !F.is("c3_ofelia0")) return say([
        ["dt_ofelia", "Ultimo giorno, forse. Ascoltami. La bobina dell'archivio era tagliata. La registrazione completa è in una sala sotto il Campo Bianco: la Sala della Voce. Non c'è sulle piante."],
        ["dt_ofelia", "Il Fuori l'ha vista sulla mappa del Cartografo. Se te l'ha già scritto, sai dove andare: botola in fondo a destra del Campo Bianco. Se no… esci, e fatti scrivere. Hai ancora tempo prima della finale."],
        ["dt_ofelia", "E controlla l'armadietto. Stamattina qualcuno ci ha messo un biglietto. In penna blu."],
      ], () => { F.set("c3_ofelia0", true); setStep(N, 1); X.plant("n_finale"); done(); });
      return say([["dt_ofelia", knows("f_mappa") ? "La botola, in fondo a destra del Campo Bianco. Vai." : "Ti serve la mappa del Fuori. Esci, fatti scrivere, rientra."]]);
    }
    function nina() {
      const s = S(), z = zone();
      if (z === "dt_stadio") {
        if (!F.is("c3_dischetto")) return say([["dt_nina", ally() ? "Sei venuto. Il dischetto è là. Vai. Io aspetto qui. L'ho aspettato tre anni, questo momento: posso aspettare altri dieci secondi." : "…Il dischetto è là. Vai. Io non ti dico niente: l'ultima volta che ho scritto al posto tuo, hai detto che non ne avevo il diritto."]]);
        if (ally() && !F.is("maglia_porto")) return say([
          ["dt_nina", "Adesso lo sai. Adesso lo sa anche il Fuori. È per questo che hai firmato, vero? Per non ricordare quel rigore."],
          ["dt_nina", "Ascolta. Quella sera non ce l'avevo con te. Nessuno ce l'aveva con te. Ce l'avevamo con il Valtorre che aspettava solo quello per comprarsi lo stadio."],
          ["voce", "Nina tira fuori dallo zaino una maglia color mattone e oro, piegata. Sulla schiena: 14."],
          ["dt_nina", "Domani, alla finale, puoi giocare con loro o con noi. Il contratto dice loro. Questa maglia dice noi. Decidi tu. Ma decidi tu: non la Voce."],
        ], () => { F.set("maglia_porto", true); note("Nina mi ha dato la maglia del 14 del Porto Livido FC."); done(); });
        return say([["dt_nina", ally() ? "Domani. Al Campo Bianco. Qualunque maglia porti, guardami quando tiri." : "Domani c'è la finale. Gioca bene. Contro di noi, a quanto pare."]]);
      }
      if (z === "dt_campo") return say([["dt_nina", ally() ? (F.get("lato") === "porto" ? "Con noi. Lo sapevo. Andiamo." : "Contro di noi, eh? Va bene. Ma il rigore… quello è tuo, comunque.") : "Ci si vede in campo, {n}."]]);
      return say([["dt_nina", "Ehi."]]);
    }
    function scheggia() { say([["dt_scheggia", zone() === "dt_stadio" ? X.pick(["Il nostro stadio. Il Cartografo ha riacceso i fari. Quasi mi commuovo. Quasi.", "Domani vi facciamo neri. Cioè: verde acqua. Insomma, vi battiamo."]) : "Finale! A piedi nudi sull'erba finta. Che schifo. Che bello."]]); }
    function cartografo() { say([["dt_cartografo", zone() === "dt_stadio" ? (F.is("c3_dischetto") ? "Ho registrato i fari. Cioè: rubato. Domani il Campo Bianco avrà una sorpresa: le lucine del porto sul maxischermo. Non chiedermi come." : "Il dischetto è lì. Io ho acceso le luci. Il resto lo devi fare tu.") : "Il cancello dello stadio, in basso. Il cardine l'ho svitato io. Scotch di qualità."]]); }
    function bruno() {
      if (zone() === "dt_campo" && S() >= 4) return say([["dt_bruno", F.get("lato") === "porto" ? "Giochi con loro?! …Sai che c'è? Non è vietato. L'ho controllato. Non c'è scritto da nessuna parte. Buona fortuna, amico." : "Oggi la finale! La Voce mi ha detto che andrà tutto bene. A te cosa dice?"]]);
      return say([["dt_bruno", "Oggi la finale! Sorrisi previsti: tantissimi."]]);
    }
    function pio() { say([["dt_pio", X.pick(["Oggi entri ed esci quante volte vuoi, {num}. Giorno di finale: le regole si allentano. Un po'.", "Lo stadio vecchio? Il cancello è dal luna park. Io non ho detto niente. Sto sulla soglia."])]]); }

    // ---------------------------------------------------------------- la finale e il rigore
    function finaleAsk() {
      const opts = [{ label: "⚽ Gioca la finale col Valtorre", sub: "Il contratto dice loro · Action Soccer 2D HD", cls: F.is("maglia_porto") ? "" : "hot", fn: () => playFinale("valtorre") }];
      if (F.is("maglia_porto")) opts.push({ label: "🧡 Indossa il 14 e gioca col Porto Livido", sub: "La maglia di Nina · Action Soccer 2D HD", cls: "hot", fn: () => playFinale("porto") });
      opts.push({ label: "Un momento", sub: "Torna a esplorare", fn: done });
      say([["dt_valtorre", "La finale, {n}. Il Campo Bianco è pieno: per una volta, sulle tribune non ci sono sagome. C'è gente. Del porto, soprattutto. Rumorosa."]], () => ask("dt_valtorre", "«Con chi giochi oggi?»", opts));
    }
    function playFinale(side) {
      F.set("lato", side);
      const val = side === "valtorre";
      X.playMatch({
        id: "dt_finale", alt: "hd", us: val ? "Valtorre FC" : "Porto Livido FC", mate: val ? "Bruno Tessari" : "Nina Rocca", squad: val ? ["Guardiano Pio", "Ofelia Sanz", "Capo del Personale"] : ["Il Cartografo", "Gancio", "Rete"],
        chap: "Doppio Turno · Finale della Coppa della Costa", bg: "dt_campo",
        intro: val ? "Finale della Coppa della Costa al Campo Bianco: il Valtorre FC di {n} contro il Porto Livido FC." : "Finale della Coppa della Costa al Campo Bianco: {n}, con il 14 sulla schiena, gioca per il Porto Livido FC contro il Valtorre.",
        oppNames: val ? ["Il Cartografo", "Gancio", "Rete", "Scheggia", "Nina Rocca"] : ["Portiere Aziendale", "Welfare", "Benefit", "Selezione", "Bruno Tessari"],
        team: (t, s) => ({ name: val ? "Porto Livido FC" : "Valtorre FC", vs: val ? "il Porto Livido FC" : "il Valtorre FC", color: val ? "#7a3b2e" : "#2a9d8f", atk: t(s.tiro * 1.0), def: t(s.drib * 0.98), vel: t(s.tiro * 0.98), names: val ? ["Il Cartografo", "Gancio", "Rete", "Scheggia", "Nina Rocca"] : ["Portiere Aziendale", "Welfare", "Benefit", "Selezione", "Bruno Tessari"] }),
        done: (r) => {
          F.set("fin_a", r.a); F.set("fin_b", r.b); setStep(N, 5);
          if (r.win) X.reward("dt_c3_finale", { coins: 40 });
          say([
            ["voce", `${r.a} a ${r.b}, e siamo all'ultimo secondo. ${r.win ? "Basterebbe aspettare il fischio." : r.a === r.b ? "Il pareggio porterebbe ai supplementari." : "Serve un gol solo per riaprirla."}`],
            ["voce", "Poi, in area, un contrasto. Cadi. Non ti sei buttato: ti hanno preso davvero. L'arbitro indica il dischetto. Rigore. Per la tua squadra."],
            ["voce", "Il pallone te lo mettono in mano. Il Campo Bianco tace. Nella cuffia, un fruscio."],
          ], rigore);
        },
      });
    }
    function rigore() {
      say([["voce", "Appoggi il pallone sul dischetto. Il portiere si muove da una parte all'altra. Nella cuffia, la tua voce, di tre anni fa, calma e stanca:", "dt_rigore"], ["voce", "«Non tirare. Passalo. Non tirare mai più.»", "dt_rigore"]], () => ask("voce", "Il rigore. La Voce ti dice di passarlo. Cosa fai?", [
        { label: "🎯 Togli la cuffia e tira", sub: "Disobbedisci alla Voce", cls: "hot", fn: tira },
        { label: "🎧 Obbedisci: passalo", sub: "Fai quello che dice la Voce", fn: () => { F.set("rigore", "passato"); conf(15); say([["voce", "Tocchi il pallone di lato, piano, verso un compagno. Il Campo Bianco trattiene il fiato. Il compagno calcia, e il portiere para. Fischio finale.", "dt_rigore"], ["voce", "Nella cuffia: «Bravo». La tua voce. Calma. Contenta. Ti senti leggero. Così leggero che non senti niente.", "dt_rigore"]], afterRigore); } },
      ], "dt_rigore"));
    }
    function tira() {
      conf(-15);
      say([["voce", "Ti togli la cuffia. La lasci cadere sull'erba. Il rumore dello stadio ti arriva addosso tutto insieme: il porto, le lucine, tre anni di silenzio.", "dt_rigore"]], () => {
        X.api.timing("Il rigore", 1, "dt_rigore", (k) => (k === 3 ? "<b>Perfetto.</b> Il pallone parte esattamente come doveva partire tre anni fa." : k === 2 ? "<b>Buono.</b> Forte, angolato. Il portiere si butta." : "<b>Storto.</b> Il pallone parte, ma non come volevi."), (pts) => {
          const gol = (pts[0] || 0) >= 2; F.set("rigore", gol ? "gol" : "sbagliato");
          say(gol ? [
            ["voce", "GOL. Il pallone entra in basso a destra, dove la rete del vecchio stadio era rotta. Per un istante il Campo Bianco è tutto mattone e oro.", "dt_rigore"],
            ["voce", "Non senti la Voce. Senti la tua, quella vera, che grida. Non sapevi di avere ancora quel grido.", "dt_rigore"],
          ] : [
            ["voce", "Il portiere ci arriva. Parato. Di nuovo. Come tre anni fa.", "dt_rigore"],
            ["voce", "Ma stavolta è diverso: l'hai tirato. Le gambe tremano, la testa no. Ti accorgi che fa male, ma che puoi starci dentro. Che non devi dimenticarlo per sopravvivere.", "dt_rigore"],
          ], afterRigore);
        });
      });
    }
    function afterRigore() {
      setStep(N, 6);
      say([["dt_valtorre", "Bene. Partita finita. E adesso, {n}, l'ascensore. Come ogni sera. Oppure…"], ["dt_valtorre", "Oppure c'è una clausola, nel contratto, che nessuno usa mai. Puoi decidere cosa fare della Procedura. Oggi. Una volta sola."]], endingsAsk);
    }
    function endingsAsk() {
      const m = X.mem(), r = F.get("rigore", ""), took = r === "gol" || r === "sbagliato";
      const opts = [];
      if (took && shared()) opts.push({ label: "✂ Strappa il contratto: torna uno solo", sub: "Le due metà si ricompongono", cls: "hot", fn: () => ending("unito") });
      opts.push({ label: "🛗 Tieni il doppio turno", sub: "Dentro e Fuori restano divisi", fn: () => ending("diviso") });
      if (r === "passato" || m.conf >= 60) opts.push({ label: "🤍 Resta Dentro per sempre", sub: "Il Fuori si addormenta", fn: () => ending("dentro") });
      if (r === "gol" && F.get("lato") === "porto" && F.get("fake_unmasked", 0) >= 3 && m.conf <= 50 && shared() && ally()) opts.push({ label: "🏟️ Riprenditi lo stadio", sub: "Qualcosa di più grande di te", cls: "hot", fn: () => ending("porto") });
      ask("dt_valtorre", `«Cosa fai della Procedura Duale, {n}?»${opts.length < 3 ? "\n(Altre strade si aprono con scelte diverse: i biglietti, la Voce, Nina, quel rigore.)" : ""}`, opts);
    }
    function ending(id) {
      F.set("fine", id); setStep(N, 7);
      const L = {
        unito: [
          ["voce", "Prendi il contratto dalla scrivania della direttrice e lo strappi in due. Proprio in mezzo alla riga in grassetto: «PROCEDURA DUALE».", "dt_campo"],
          ["voce", "Un ronzio, un formicolio dietro gli occhi. Poi, invece del bianco, arriva tutto insieme: il dischetto di tre anni fa, il Campo Bianco, Bruno che conta i sorrisi, Nina che asciuga i bicchieri, i biglietti in verde e in blu, la tua voce nella cuffia.", "dt_sala"],
          ["voce", "Fa male. Fa molto male. Ed è tuo. Tutto quanto.", "dt_porto"],
          ["dt_nina", "Allora? Chi sei, adesso?", "dt_porto"],
          ["hero", "Uno solo. Quello che ha sbagliato un rigore, e quello che ne ha tirato un altro. Tutti e due.", "dt_porto"],
          ["voce", "L'Armadietto 7, quella sera, resta vuoto. Non c'è più nessuno a cui scrivere: sei già lì.", "dt_porto"],
        ],
        diviso: [
          ["voce", "Lasci il contratto dov'è. Domani alle otto l'ascensore salirà, e la sera scenderà. Due vite, una porta in mezzo.", "dt_atrio"],
          ["voce", "Ma qualcosa è cambiato. Il Dentro sa del porto. Il Fuori sa del Campo Bianco. E ogni sera, nell'Armadietto 7, c'è un biglietto. Verde la mattina, blu la sera. Come due amici di penna che si vogliono bene.", "dt_porto"],
          ["dt_pio", "Buonasera, {num}. Il solito? Biglietto per l'altro te?", "dt_porto"],
          ["voce", "Sì. Il solito. Firmato col tuo numero.", "dt_porto"],
        ],
        dentro: [
          ["voce", "Scegli il Dentro. La dottoressa Valtorre sorride: per la prima volta il sorriso le arriva anche agli occhi.", "dt_atrio"],
          ["voce", "Il Fuori si addormenta, piano, come una città quando si spengono le lucine. Nessun rigore da ricordare, nessun porto, nessun dischetto. Solo il calcio, puro, bianco, senza peso.", "dt_campo"],
          ["dt_bruno", "Benvenuto a casa! Sorrisi di oggi: 1.206!", "dt_uffici"],
          ["voce", "Al porto, al Bar Marea, una ragazza con i capelli rossi lascia ogni sera un sottobicchiere con un 14 disegnato a pennarello verde. Nessuno viene a prenderlo.", "dt_porto"],
        ],
        porto: [
          ["voce", "Strappi il contratto. Poi prendi il microfono dello stadio, quello della direttrice, e parli. Senza cuffia. Con la tua voce di adesso.", "dt_campo"],
          ["hero", "Il Porto Livido FC ha appena vinto la Coppa della Costa. Il regolamento dice che chi vince sceglie lo stadio della prossima stagione. Scegliamo il nostro.", "dt_campo"],
          ["voce", "Il Cartografo, dal tabellone, accende tutte le lucine del porto sul maxischermo. Ofelia mostra al pubblico il registro dell'Armadietto 7, con le righe dell'«Ufficio». Bruno, dopo un lungo silenzio, applaude. Poi applaude il Campo Bianco intero.", "dt_campo"],
          ["voce", "Una settimana dopo, il recinto bianco intorno al vecchio stadio viene smontato. Pezzo per pezzo. Dalla gente del porto. A mani nude.", "dt_stadio"],
          ["dt_nina", "Bentornato a casa, 14.", "dt_stadio"],
          ["voce", "Sulla tribuna, sotto la scritta «14 PER SEMPRE», qualcuno cancella «anche se».", "dt_stadio"],
        ],
      }[id];
      say(L, () => {
        X.end(id); finishChapter(N, id);
        const cos = { unito: "dt_end_unito", diviso: "dt_end_diviso", dentro: "dt_end_dentro", porto: "dt_end_porto" }[id];
        const msg = reward("dt_c3_done", { coins: 80, cos: "dt_c3" }).concat(reward("dt_end_" + id, { coins: id === "porto" ? 100 : 30, cos }));
        note("Finale: " + X.ENDINGS[id][0] + ".");
        const m = X.mem(), tot = Object.keys(X.ENDINGS).length;
        X.api.trSay([
          X.api.L("voce", `FINALE · ${X.ENDINGS[id][0]}. ${X.ENDINGS[id][1]}`, "dt_porto"),
          X.api.L("voce", `Finali trovati: ${m.ends.length} su ${tot}. ${m.ends.length < tot ? "Gli altri si aprono con scelte diverse: cosa si scrivono le due metà, i biglietti falsi smascherati, la Voce, Nina, la maglia, il rigore." : "Li hai trovati tutti."}${msg.length ? " " + msg.join(" · ") : ""}`, "dt_porto"),
        ], () => X.api.trExitTo(() => window.__doppioTurno.open()));
      });
    }

    // ---------------------------------------------------------------- oggetti
    const obj = {
      "dt_campo:Q": () => {
        if (S() < 1) return say([["voce", "Una botola di servizio nel pavimento, sotto la pubblicità «SORRIDI». Chiusa."]]);
        if (!knows("f_mappa")) return say([["voce", "Una botola di servizio. Ma come fai a sapere che porta da qualche parte? Il Dentro non ha mai visto una mappa del Complesso. Il Fuori sì."]]);
        say([["voce", "La mappa del Fuori aveva una X proprio qui. Sollevi la botola: una scala di ferro scende nel buio caldo."]], () => { if (S() === 1) setStep(N, 2); go("dt_sala", 12, 15); });
      },
      "dt_sala:v": () => go("dt_campo", 28, 19),
      "dt_sala:V": () => say([
        ["voce", "Premi PLAY. Questa volta il nastro è intero. Fruscio. Poi la voce delle cuffie, calma, con l'accento del porto. La tua."],
        ["voce", "«Sono io. Il Fuori. Se mi senti, vuol dire che ha funzionato: tu non ricordi niente, e va bene così. Ti dico solo una cosa, l'unica che conta.»"],
        ["voce", "«Tre anni fa ho sbagliato un rigore. L'ultimo. Quello che avrebbe salvato il porto. Non ce la faccio a ricordarlo ogni giorno. Per questo ti ho lasciato tutto il resto: il calcio, le gambe, il tiro. Ma se arriva un rigore… non tirarlo. Passalo. Non tirare mai più.»"],
        ["voce", "Clic. Fine del nastro. Nella stanza, solo il ronzio degli schermi. Su ognuno, la tua faccia."],
      ], () => { learnFact("d_rigore"); if (S() === 2) { return say([["voce", "Dietro di te, un passo leggero. La dottoressa Valtorre è scesa le scale senza fare rumore."]]); } done(); }),
      "dt_giostre:Q": () => (S() >= 3 ? go("dt_stadio", 18, 21) : say([["voce", "Il cancello posteriore dello stadio. Il cardine è svitato. Ma non è ancora il momento: prima, il Dentro deve sapere."]])),
      "dt_stadio:v": () => go("dt_giostre", 18, 18),
      "dt_stadio:I": () => say([
        ["voce", "Ti fermi sul dischetto. L'erba alta ti accarezza le caviglie. E poi, senza avvisare, torna."],
        ["voce", "Tre anni fa. Ultimo minuto. Lo stadio pieno, mattone e oro. Il pallone in mano. Nina che ti guarda dal centrocampo. Il portiere che si muove. Il silenzio."],
        ["voce", "Il tiro. Il portiere che ci arriva. Il pallone che rimbalza fuori. Il fischio. Il giorno dopo, il cartello: «STADIO IN VENDITA». Il giorno dopo ancora, una dottoressa gentile con un contratto e una penna blu."],
        ["voce", "Ricordi tutto. Non è il Dentro a ricordarlo: sei tu, il Fuori. Lo sapevi da sempre. Avevi solo pagato qualcuno per non pensarci."],
      ], () => { learnFact("f_rigore"); F.set("c3_dischetto", true); if (S() === 3) setStep(N, 4); done(); }),
    };
    function news(id, s) {
      const z = zone();
      if (id === "dt_valtorre") return (z === "dt_atrio" && s === 0) || (z === "dt_sala" && s === 2) || (z === "dt_campo" && s >= 4 && s <= 6);
      if (id === "dt_ofelia") return s === 0 && !F.is("c3_ofelia0");
      if (id === "dt_nina") return z === "dt_stadio" && F.is("c3_dischetto") && ally() && !F.is("maglia_porto");
      return false;
    }
    return {
      n: N, title: "Il Rigore", sub: "La Sala della Voce, il dischetto, la finale", start: "dt_atrio",
      goal, zones, obj, news, patch,
      talk: { dt_valtorre: valtorre, dt_ofelia: ofelia, dt_nina: nina, dt_scheggia: scheggia, dt_cartografo: cartografo, dt_bruno: bruno, dt_pio: pio },
      intro: () => [
        ["voce", "Il giorno della finale. L'ascensore sale, ding, e l'atrio è più bianco del solito.", "dt_atrio"],
        ["voce", "Sul pavimento lucido, per un istante, ti sembra di vedere riflessa una maglia color mattone. Poi sbatti le palpebre, ed è di nuovo la tua tuta grigia.", "dt_atrio"],
      ],
    };
  }
  boot();
})();
