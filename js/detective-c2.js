// js/detective-c2.js - DETECTIVE DI CAMPO · Capitolo 2 «Il nastro sparito»
// Il nastro del 1987 (stesso risultato, stesso trucco) sparisce dalla Sala Moviola. Una pista porta alla Stazione.
// Novità del capitolo: il PEDINAMENTO. L'uomo con l'ombrello rosso attraversa la stazione e il porto: devi seguirlo senza
// farti vedere (quando si volta, resta fermo o nasconditi lontano) e senza perderlo (non restare troppo indietro).
// Poi il magazzino del porto (si entra), la partita di beneficenza della Lega (scegli tu il modo) e il presidente di Valfonda:
// il colpevole che è anche una vittima.
(function () {
  "use strict";
  function boot() { const D = window.__detective; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N), TS = 16;

    K.cast("dc_valli", { acc: ["garofano"], name: "Presidente Tommaso Valli", tag: "gray", hair: "#c8c8c8", style: "slick", skin: "#e8c4a0", eye: "#4a5a4a", bg: ["#1a3a2a", "#2a7a4a"], shirt: "#2a4a3a" },
      "Presidente del Valfonda, la «favola» della Lega. Un vecchio commerciante di stoffe che ha comprato la squadra del suo paese per amore. Da quando la favola è cominciata, non dorme più.");
    K.cast("dc_ombra", { acc: "", name: "L'uomo con l'ombrello rosso", tag: "", hair: "#1a1a1a", style: "slick", skin: "#d9b08c", eye: "#2a2a2a", shades: true, bg: ["#1a1a1a", "#c0392b"], shirt: "#1a1a1a" },
      "Cappotto nero, occhiali scuri anche di notte, un ombrello rosso sempre chiuso. Cammina come chi non ha mai dovuto chiedere permesso.");
    K.evidence("nastro87", { t: "Il nastro del 1987", d: "Portagrigia–Valfonda 1987, 0-3: tre gol dopo tre rimesse. Stesso trucco, trentacinque anni prima. Qualcuno lo ha rubato per non farlo confrontare.", icon: "📼", short: "Dal magazzino del porto" });
    K.evidence("ricevute", { t: "Le ricevute della Lega", d: "Bonifici dalla «Lega delle Città · Fondo Promozione» al Valfonda, sempre il giorno dopo una vittoria. Firmati: T. Vanni, segretario.", icon: "🧾", short: "Dal magazzino del porto" });
    K.evidence("contratto", { t: "Il contratto televisivo", d: "La Lega ha venduto i diritti TV di una stagione «con favola garantita». La favola è il Valfonda. Il prezzo raddoppia se arriva in finale.", icon: "📺", short: "Da Nina Rotativa" });
    K.cos("dc_c2", { kind: "shirt", label: "Cappotto da pedinamento", val: "#2a2a32", from: "Completa il Capitolo 2 di Detective di Campo" });
    K.cos("dc_ombrello", { kind: "acc", label: "Stemma dell'ombrello rosso", val: "#c0392b", from: "Pedina l'uomo con l'ombrello senza farti mai vedere" });
    K.cos("dc_porto_c", { kind: "hairc", label: "Capelli Nebbia di porto", val: "#9aa8b8", from: "Trova tutti i bottoni d'ottone al porto" });
    K.lore("l_vanni", { t: "Teodoro Vanni, il segretario", d: "Segretario della Lega da vent'anni. Non ha mai dato un'intervista, non ha mai perso un'elezione, non ha mai, dice chi lo conosce, aperto l'ombrello. Lo porta per abitudine. O per segnale." });
    K.lore("l_1987", { t: "La favola del 1987", d: "Nel 1987 anche il Valfonda era «la favola» della Lega: arrivò in finale e la perse 0-5. Il giorno dopo, la Lega vendette i diritti della stagione successiva al doppio del prezzo." });

    const goal = (s) => ({
      0: "Il nastro del 1987 è sparito dalla Sala Moviola. Agata ti aspetta in Questura.",
      1: "Nina Rotativa ha una pista: è al Caffè Fuorigioco.",
      2: "Vai alla Stazione (a ovest della città) e pedina l'uomo con l'ombrello rosso fino al porto. Quando si volta, stai fermo o resta lontano.",
      3: "L'uomo è entrato nel magazzino 7 del porto: entra e cerca il nastro.",
      4: "Interroga il presidente Valli: è al porto, alla partita di beneficenza della Lega.",
      5: "Agata deve sapere cosa hai scoperto. Torna in Questura.",
    }[s] || "Capitolo concluso. L'ultimo caso ti aspetta dal menu.");

    // ---------------------------------------------------------------- IL PEDINAMENTO
    const TAIL = { path: [[8, 12], [14, 12], [14, 7], [24, 7], [24, 16], [33, 16], [33, 10], [42, 10], [46, 14]], i: 0, x: 8, y: 12, look: 0, next: 3.5, warn: 0, state: "idle", seen: 0, lost: 0, spotted: 0 };
    K.dcTail = TAIL; // per i test
    function tailReset(K) { Object.assign(TAIL, { i: 0, x: 8, y: 12, look: 0, next: 3.5, warn: 0, state: "run" }); }
    function tailTick(px, py, dt, K, s) {
      if (s !== 2 || TAIL.state === "done") return null;
      if (TAIL.state === "idle") { if (Math.hypot(px / TS - TAIL.x, py / TS - TAIL.y) < 6) { TAIL.state = "run"; K.SFX.warn(); } return null; }
      const d = Math.hypot(px / TS - TAIL.x, (py - 4) / TS - TAIL.y), moving = Math.hypot(px - (TAIL.px || px), py - (TAIL.py || py)) > 0.4; TAIL.px = px; TAIL.py = py;
      // si volta ogni tanto: se ti muovi ed è vicino, ti vede
      if (TAIL.look > 0) { TAIL.look -= dt; if (moving && d < 7) { TAIL.seen += dt; if (TAIL.seen > 0.35) return caught(K, "seen"); } }
      else { TAIL.seen = 0; TAIL.next -= dt; if (TAIL.next <= 0.8 && TAIL.warn <= 0) { TAIL.warn = 1; K.tone(520, 0.12, "square", 0.04); } if (TAIL.next <= 0) { TAIL.look = 1.4; TAIL.next = 2.8 + Math.random() * 2; TAIL.warn = 0; } }
      if (d < 1.6) return caught(K, "close");
      if (d > 10) { TAIL.lost += dt; if (TAIL.lost > 2.5) return caught(K, "lost"); } else TAIL.lost = 0;
      if (TAIL.look <= 0 && d < 9) { // cammina solo se non è voltato e tu non sei troppo lontano
        const nx = TAIL.path[TAIL.i + 1]; if (!nx) { TAIL.state = "done"; setTimeout(() => K.safe(() => arrived(K)), 0); return null; }
        const dx = nx[0] - TAIL.x, dy = nx[1] - TAIL.y, dd = Math.hypot(dx, dy), v = 1.6 * dt;
        if (dd <= v) { TAIL.x = nx[0]; TAIL.y = nx[1]; TAIL.i++; } else { TAIL.x += dx / dd * v; TAIL.y += dy / dd * v; }
      }
      return null;
    }
    function caught(K, why) {
      TAIL.state = "idle"; if (why !== "lost") TAIL.spotted++; F.add("dc_pedina_err", 1);
      const tx = TAIL.x; tailReset(K); TAIL.state = "idle";
      setTimeout(() => K.safe(() => say([["voce", why === "seen" ? "L'uomo si volta di scatto. Ti vede. Apre a metà l'ombrello rosso, come un saluto, e sparisce tra la folla. Torni all'ingresso della stazione a riprendere fiato: tornerà a passare di lì." : why === "close" ? "Troppo vicino! L'uomo si ferma, ti guarda attraverso gli occhiali scuri e sorride. Poi riparte veloce. Meglio ricominciare, con più distanza." : "L'hai perso. Il cappotto nero si confonde con la notte e la nebbia. Torni alla stazione: secondo Nina passa di lì ogni sera, a quest'ora."]])), 30);
      return [6 * TS + 8, 12 * TS + 12];
    }
    function arrived(K) {
      setStep(N, 3); if (!F.get("dc_pedina_err")) K.reward("m:dc_ombrello", { cos: "dc_ombrello" }); bond("fiuto", F.get("dc_pedina_err") ? 1 : 2);
      say([["voce", "L'uomo con l'ombrello si ferma davanti al magazzino 7 del porto. Si guarda intorno. Apre il lucchetto, entra, esce dopo un minuto a mani vuote, e se ne va verso il Grand Hotel."], ["voce", "Il lucchetto è rimasto aperto. Chi è abituato a non essere seguito, non chiude le porte."]]);
    }
    function drawTail(g, cx, cy, fr) {
      if (S() !== 2 || TAIL.state === "done") return;
      const x = TAIL.x * TS - cx + 8, y = TAIL.y * TS - cy + 12, look = TAIL.look > 0;
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x, y + 4, 6, 2, 0, 0, 7); g.fill();
      g.fillStyle = "#1a1a1a"; g.fillRect(x - 4, y - 10, 8, 13); g.fillStyle = "#d9b08c"; g.beginPath(); g.arc(x, y - 13, 3.5, 0, 7); g.fill(); g.fillStyle = "#111"; g.fillRect(x - 3, y - 14, 6, 1.6);
      g.strokeStyle = "#c0392b"; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 5, y - 6); g.lineTo(x + 5, y + 4); g.stroke();
      if (look) { // il cono dello sguardo quando si volta
        const gr = g.createRadialGradient(x, y - 8, 4, x, y - 8, 7 * TS); gr.addColorStop(0, "rgba(255,90,60,.35)"); gr.addColorStop(1, "rgba(255,90,60,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y - 8, 7 * TS, 0, 7); g.fill();
        g.font = "bold 12px Georgia, serif"; g.fillStyle = "#ff8a6a"; g.textAlign = "center"; g.fillText("!", x, y - 20); g.textAlign = "left";
      } else if (TAIL.warn > 0) { g.font = "bold 10px Georgia, serif"; g.fillStyle = "#ffd36b"; g.textAlign = "center"; g.fillText("…", x, y - 20); g.textAlign = "left"; }
    }
    function tailHud(g, K, s) {
      if (s !== 2 || TAIL.state === "done") return;
      const tw = K.api.TRZ ? null : null; g.fillStyle = "rgba(24,20,18,.85)"; g.fillRect(4, 184, 160, 13); g.font = "bold 8px sans-serif";
      const txt = TAIL.state === "idle" ? "🕵️ Avvicinati all'uomo con l'ombrello" : TAIL.look > 0 ? "⚠ Si è voltato: STAI FERMO!" : TAIL.warn > 0 ? "… sta per voltarsi" : "🕵️ Seguilo, a distanza";
      g.fillStyle = TAIL.look > 0 ? "#ff8a6a" : TAIL.warn > 0 ? "#ffd36b" : "#efe6d2"; g.fillText(txt, 8, 193);
    }

    const zones = {
      dc_porto: {
        music: "detective_tesa",
        region: "porto", name: "Detective di Campo · La Stazione e il Porto", short: "La Stazione e il Porto", sub: "Nebbia, gru, magazzini numerati", bg: "dc_porto", time: "notte", travel: [3, 12],
        w: 50, h: 26, start: [3, 12], itemCos: "dc_porto_c", items: [[2, 20], [30, 3], [48, 20], [20, 20]],
        areas: [[1, 2, 12, 8, "La Stazione Centrale"], [40, 15, 47, 20, "Il magazzino 7"], [26, 18, 38, 24, "Il molo della beneficenza"], [0, 0, 49, 25, "Il porto"]],
        act: { w: "Guarda il mare", z: "Guarda le casse", l: "Guarda il lampione", n: "Leggi il cartello", b: "Siediti", q: "Entra", "<": "Torna in città", p: "Guarda la gru" },
        flavor: {
          w: "L'acqua del porto, nera e lucida. Ogni tanto una sirena lontana. La nebbia arriva dal mare a nuvole basse, come pecore grigie.",
          z: ["Casse di legno con la scritta «LEGA DELLE CITTÀ · MATERIALE PROMOZIONALE». Una è aperta: palloni. Più chiari del normale.", "Casse di arance. Sopra, un gatto addormentato con l'aria di chi sorveglia."],
          l: "Un lampione nella nebbia: fa un alone giallo, come una moneta nell'acqua.",
          n: ["Orari dei treni. L'ultimo per Valfonda parte alle 23:07. Qualcuno ha cerchiato l'orario con un pennarello rosso.", "«MAGAZZINI 1-9 · ACCESSO RISERVATO». Sotto, a mano: «e allora cosa ci fate qui»"],
          p: "Una gru del porto, ferma. Sul braccio, un gabbiano dorme in equilibrio perfetto.",
        },
        intro: [["voce", "La Stazione Centrale e, dietro, il porto: binari che finiscono nella nebbia, gru ferme come giraffe di ferro, magazzini numerati con i lucchetti arrugginiti."], ["voce", "Secondo Nina, l'uomo con l'ombrello rosso arriva ogni sera con il treno delle ventidue e scende verso il porto. Senza fretta. Come chi sa di non essere seguito."]],
        npcs: (s) => [...(s >= 4 ? [{ id: "dc_valli", at: [32, 20] }, { id: "dc_nina", at: [28, 19] }] : [])],
        tick: tailTick,
        onEnter() { tailReset(K); TAIL.state = "idle"; },
        decor(g, cx, cy, d) { drawTail(g, cx, cy, d.fr); K.neon(g, "STAZIONE CENTRALE", d.X(6) + 8, d.Y(2) + 2, "120,200,255", 0); K.neon(g, "MAGAZZINO 7", d.X(43) + 8, d.Y(15) + 2, "255,200,120", 1); },
        hud: tailHud,
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 49, 25, "+"); lay(0, 0, 49, 0, "a"); lay(0, 25, 49, 25, "a"); lay(0, 0, 0, 25, "a"); lay(49, 0, 49, 25, "a"); put(0, 12, "<"); put(0, 13, "<");
          house(1, 2, 12, 6, { door: [6, 7], roof: "#3a3a44", wall: "#a8a098", rr: 2, lit: true, enter: "La Stazione Centrale: la sala d'attesa è vuota, il tabellone gira le lettere con un rumore di carte da gioco. «VALFONDA · 23:07 · IN ORARIO»." });
          lay(1, 8, 13, 13, ":"); lay(14, 6, 25, 8, ":"); lay(23, 6, 25, 17, ":"); lay(23, 15, 34, 17, ":"); lay(32, 9, 34, 17, ":"); lay(32, 9, 43, 11, ":"); lay(41, 9, 47, 14, ":");
          lay(0, 22, 49, 24, "w"); lay(26, 18, 38, 21, "="); lay(26, 21, 38, 21, "=");
          house(40, 15, 8, 5, { door: [44, 19], roof: "#4a4038", wall: "#6a5a4a", rr: 2, enter: { room: "bottega", id: "dc_magazzino", name: "Il magazzino 7", bg: "dc_porto", intro: "Il magazzino 7: scaffali di metallo, casse con il logo della Lega, un odore di mare e di carta umida. Su un tavolo, una lampada da tavolo ancora calda.", locked: (K) => (K.stepOf(2) < 3 ? "Il magazzino 7 è chiuso con un lucchetto nuovo. Lucido. Troppo lucido, per un porto." : false), who: [], chest: { coins: 30, text: "In un cassetto della scrivania, una busta della Lega e qualche moneta dimenticata." } } });
          lay(44, 20, 44, 21, "=");
          [[16, 3], [17, 3], [28, 4], [29, 4], [36, 6], [37, 6], [20, 12], [21, 12], [28, 12], [29, 12], [38, 13], [38, 14], [6, 16], [7, 16], [12, 19], [13, 19]].forEach(([x, y]) => put(x, y, "z"));
          [[19, 9], [36, 8], [10, 15], [30, 13]].forEach(([x, y]) => put(x, y, "p"));
          [[13, 9], [22, 9], [31, 14], [39, 8], [46, 8]].forEach(([x, y]) => put(x, y, "l")); put(4, 9, "n"); put(39, 12, "n"); put(15, 14, "b"); put(36, 19, "s");
        },
      },
    };

    // ---------------------------------------------------------------- la partita di beneficenza (secondaria: il modo lo scegli tu)
    function beneficenza() {
      K.playMatch({
        id: "dc_benef", alt: "az,cage,hd", force: false, oppTeam: "I dirigenti della Lega", oppColor: "#2a2a3a", mate: "Ispettrice Agata Brina", squad: ["Nina Rotativa"], us: "Questura di Portagrigia", homeKit: ["#6a5a4a", "#d8b46a"], azPitch: "notte", cageField: 1,
        chap: "Detective di Campo · La partita di beneficenza", bg: "dc_porto", intro: "Partita di beneficenza della Lega sul molo, tra le gru: la Questura di Portagrigia (con {n} in panchina… finché il ginocchio regge cinque minuti) contro i dirigenti della Lega.",
        oppNames: ["Segretario Vanni", "Consigliere Rossi", "Tesoriere Gallo", "Avv. Merli", "Dott. Bassi"],
        done: (r) => { F.set("dc_benef", r.win ? "vinta" : "persa"); K.reward("m:dc_benef", { coins: r.win ? 40 : 20 }); bond("lega", r.win ? 2 : 1); say([["voce", r.win ? "La Questura vince sul molo. Il segretario Vanni stringe la mano ad Agata un secondo più del necessario. Lei sorride. Lui no." : "Vincono i dirigenti della Lega. Il segretario Vanni non esulta: guarda Agata, poi guarda te, poi guarda l'orologio."], ["dc_agata", "Ha visto come tiene l'ombrello, Vanni? Chiuso, sotto il braccio. Anche sul molo. Anche senza pioggia."]]); },
      });
    }
    function interrogate() {
      K.present({
        who: "dc_valli", bg: "dc_porto", ok: ["ricevute"],
        prompt: "«Il Valfonda vince perché ci crede. È una favola, lo dicono tutti. Io non so niente di palloni e di bandierine. Vendo stoffe, signor detective. Le stoffe non truccano le partite.»",
        right: () => { bond("fiuto", 1); K.scene([["hero", "Le stoffe no. Ma queste ricevute sì: bonifici della Lega al Valfonda, sempre il giorno dopo una vittoria. Firmate Vanni."], ["dc_valli", "…"], ["dc_valli", "Non li ho mai chiesti. Me li hanno mandati. La prima volta li ho rimandati indietro. Poi è arrivata una lettera: o il Valfonda vinceva quando dicevano loro, o la squadra spariva. Fallita. Venduta. Il mio paese senza squadra."], ["dc_valli", "Io ho comprato il Valfonda per amore, sa? Adesso mi vergogno ogni domenica. La favola la scrivono loro. Io la firmo."], ["dc_valli", "La prossima pagina è la finale della Lega. Valfonda deve arrivarci, e deve perderla. Cinque a zero, come nel 1987. Così la stagione dopo i diritti valgono il doppio."]], () => { setStep(N, 5); K.learnLore("l_1987"); questDone("dc_valli"); done(); }, "dc_porto"); },
        wrong: (id) => { bond("fiuto", -1); F.add("dc_wrong", 1); say([["dc_valli", id === "nastro87" ? "Un vecchio nastro. Nel 1987 io vendevo stoffe a Milano. Ero innocente allora, e sa una cosa? Lo sono anche adesso, nel 1987." : "Questo non dice niente di me. Mi dispiace, signor detective."], ["voce", "Non era la prova giusta. Lui dice di non sapere niente di soldi: cosa lo collega ai soldi della Lega?"]], interrogate); },
        back: done,
      });
    }

    const talk = {
      dc_agata() {
        const s = S();
        if (s === 0) return say([
          ["dc_agata", "Il nastro del 1987 è sparito. Ugo ha pianto. Ugo non piange nemmeno quando perde il Portagrigia, e il Portagrigia perde sempre."],
          ["dc_agata", "Portagrigia–Valfonda 1987: zero a tre. Le dice niente? A me dice tantissimo. Dice che il trucco è vecchio. Che qualcuno lo usa da trentacinque anni."],
          ["dc_agata", "Nina Rotativa vuole parlarle. È al Caffè Fuorigioco, al suo tavolo. Quello vicino al juke-box, così nessuno sente."],
        ], () => { setStep(N, 1); done(); });
        if (s === 5) return ask("dc_agata", "Valli è una vittima. Vanni è il segretario. E sopra Vanni c'è il Consiglio della Lega: cinque presidenti, un hotel di lusso, una finale da truccare.\n\n(Agata stringe la fisarmonica senza suonarla.) Le devo dire una cosa. Nel 1987, nella finale persa cinque a zero, giocava mio fratello. Lo squalificarono a vita per una combine che non aveva fatto. Non ha più toccato un pallone.\n\nAssistente. Cosa facciamo, adesso?", [
          { label: "«Proteggiamo Valli e prendiamo Vanni con le prove»", sub: "Pazienza e metodo", big: true, fn: () => end2("metodo") },
          { label: "«Pubblichiamo tutto con Nina, subito»", sub: "Fare rumore", big: true, fn: () => end2("stampa") },
          { label: "«Decida lei, ispettrice. È anche la sua storia»", sub: "Lasciare spazio alla sua rabbia", big: true, fn: () => end2("agata") },
        ], "dc_questura");
        return say([["dc_agata", K.pick(["Liquirizia. Aiuta a pedinare: si mastica in silenzio.", "Non si fidi della nebbia. Nasconde lei, ma nasconde anche gli altri.", "Pensi alle ricevute. I soldi lasciano sempre le impronte, anche con i guanti."])]]);
      },
      dc_nina() {
        const s = S();
        if (s === 1) return say([
          ["dc_nina", "Il nastro sparito? Non l'ho rubato io, se è questo che pensa. Io rubo solo frasi."],
          ["dc_nina", "Ma ho due cose. Uno: questo. Il contratto televisivo della Lega: «stagione con favola garantita». La favola è il Valfonda. Se arriva in finale, il prezzo raddoppia."],
          ["dc_nina", "Due: un uomo con l'ombrello rosso arriva ogni sera alla Stazione con il treno delle ventidue e va al porto, ai magazzini. Io non lo seguo: ho una faccia troppo conosciuta. Lei invece ha una stampella. Nessuno sospetta di una stampella."],
        ], () => { K.giveClue("contratto"); setStep(N, 2); quest("dc_pedina", "L'uomo con l'ombrello", "Pedinalo dalla Stazione al porto, senza farti vedere."); done(); });
        if (s >= 4) return ask("dc_nina", "Il presidente Valli è là, al molo, con la faccia di chi è a un funerale. Vuole una partita di beneficenza? La Lega ne ha organizzata una per i fotografi. La Questura gioca. Lei, almeno in panchina.", [
          { label: "Gioca la partita di beneficenza", sub: "Partita secondaria: scegli tu il modo", cls: "hot", fn: beneficenza },
          { label: "Più tardi", fn: done },
        ], "dc_porto");
        return say([["dc_nina", "Scriva tutto. Anche quello che sembra stupido. Le cose stupide sono quelle che i colpevoli non cancellano."]]);
      },
      dc_valli() {
        const s = S();
        if (s !== 4) return say([["dc_valli", s > 4 ? "Grazie. Non so se mi avete salvato o condannato. Ma almeno adesso dormo." : "Non parlo con la stampa. Né con la Questura. Né con le stampelle."]]);
        return interrogate();
      },
      dc_ugo() { return say([["dc_ugo", "Il nastro del 1987. Lucia, il proiettore, non vuole più girare. Dice che senza quel nastro le manca un pezzo. Ha ragione."]]); },
      dc_tonio() { return say([["dc_tonio", "Il 1987? C'ero. Magazziniere giovane. Il pallone di quella finale era chiaro, leggero. Me lo ricordo perché mi diedero la colpa. Trentacinque anni con quella colpa in tasca."]]); },
    };
    function end2(kind) {
      F.set("dc_c2scelta", kind);
      if (kind === "metodo") { bond("agata", 2); bond("fiuto", 1); } else if (kind === "stampa") { bond("lega", 3); bond("fiuto", 1); } else { F.set("dc_agata_rabbia", true); bond("agata", 1); }
      const msg = K.reward("ch:dc_c2", { coins: 80, cos: "dc_c2" });
      finishChapter(N); setStep(N, 6);
      K.scene([
        ["dc_agata", kind === "metodo" ? "Pazienza e metodo. Come la fisarmonica: se tiri troppo, si strappa. Bene, assistente. La finale è tra tre giorni." : kind === "stampa" ? "Rumore. Sì. A volte serve: i topi escono quando senti i passi. Domani la Gazzetta esce con il titolo più grande della sua storia." : "Decido io. …Lei è gentile, sa? Troppo. Non mi lasci decidere quando sono così. O forse sì. Vedremo."],
        ["voce", "La finale della Lega: Valfonda contro la Capitale, allo Stadio delle Città. Il Consiglio guarderà dalla tribuna d'onore. E qualcuno, in tribuna, avrà un ombrello rosso."],
        ["voce", `<b>Fine del Capitolo 2 · Il nastro sparito.</b> ${msg.join(" · ")}`],
      ], () => K.openMain(), "dc_questura");
    }
    const obj = {
      "dc_citta:<": () => (S() >= 2 ? go("dc_porto", 3, 12) : say([["voce", "La strada per la Stazione e il porto. Prima, senti cosa dice Nina al Caffè Fuorigioco."]])),
      "dc_porto:<": () => go("dc_citta", 1, 12),
      "dc_magazzino:T": () => {
        if (K.hasClue("ricevute")) return say([["voce", "Il tavolo è vuoto. Hai già preso tutto quello che serviva. La lampada, intanto, si è raffreddata."]]);
        K.giveClue("nastro87"); K.giveClue("ricevute"); K.learnLore("l_vanni"); setStep(N, 4); questDone("dc_pedina"); quest("dc_valli", "Il presidente di Valfonda", "Interroga Tommaso Valli al molo della beneficenza.");
        return say([["voce", "Sul tavolo, sotto la lampada: il nastro del 1987, con l'etichetta scritta a mano da Ugo. Accanto, una cartellina con le ricevute dei bonifici della Lega al Valfonda. Tutte firmate: «T. Vanni»."], ["voce", "Fuori, al molo, sta cominciando la partita di beneficenza della Lega. Il presidente del Valfonda, Tommaso Valli, è là."]]);
      },
    };
    const patch = {
      dc_citta: { build(L) { L.put(0, 12, "<"); L.put(0, 13, "<"); }, act: { "<": "Vai alla Stazione e al porto" }, npcs: (s, list) => (s >= 1 && s <= 4 ? list.filter((n) => n.id !== "dc_nina") : list) },
      dc_caffe: { npcs: (s, list) => (s >= 1 && s <= 3 ? [...list, { id: "dc_nina", at: [15, 7] }] : list) },
    };
    return { n: N, title: "Il nastro sparito", sub: "Il pedinamento, il porto, la favola del Valfonda", goal, start: "dc_citta", introBg: "dc_moviola", zones, talk, obj, patch,
      intro: () => [["voce", "Mattina. Ugo Nastro ti chiama alle sei: «È sparito. Il nastro del 1987. Portagrigia–Valfonda, zero a tre. Lo stesso risultato, lo stesso trucco»."], ["voce", "La Sala Moviola non è stata forzata. Chi ha preso il nastro aveva la chiave. O sapeva dove la tiene Ugo: sotto il cuscino."]] };
  }
  boot();
})();
