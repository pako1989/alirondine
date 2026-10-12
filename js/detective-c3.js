// js/detective-c3.js - DETECTIVE DI CAMPO · Capitolo 3 «Il fischio finale»
// La finale della Lega si gioca a Portagrigia, allo Stadio Comunale pieno. Moviola IN DIRETTA del primo tempo, la ricostruzione
// del secondo, e il confronto finale nella Sala del Consiglio del Grand Hotel (si entra): tre prove da presentare al segretario Vanni.
// Finali: CASO CHIUSO · LA LEGA PULITA · LA VENDETTA DI AGATA · (segreto) DI NUOVO IN CAMPO.
(function () {
  "use strict";
  function boot() { const D = window.__detective; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);

    K.cast("dc_vanni", { name: "Segretario Teodoro Vanni", tag: "gray", hair: "#8a8a8a", style: "slick", skin: "#e8d0b8", eye: "#3a3a3a", shades: true, bg: ["#1a1a1a", "#c0392b"], shirt: "#1a1a1a" },
      "Segretario della Lega delle Città da vent'anni. Voce bassa, mani pulite, un ombrello rosso sempre chiuso sotto il braccio. Non ha mai perso un'elezione, né la calma.");
    K.evidence("tribuna", { t: "L'ombrello in tribuna d'onore", d: "In diretta: nel primo tempo della finale, in tribuna d'onore, si apre un ombrello rosso. Senza pioggia. Accanto c'è Vanni.", icon: "☂️", short: "Dalla moviola della finale" });
    K.evidence("pallone3", { t: "Il pallone chiaro della finale", d: "In diretta: al 30' entra in campo un pallone chiaro, leggero. Come nel 1987. Come contro il Portagrigia.", icon: "⚪", short: "Dalla moviola della finale" });
    K.evidence("guardalinee3", { t: "Il guardalinee sostituito", d: "In diretta: il guardalinee di destra non è quello designato. Tiene la bandierina con la sinistra, e non la alza mai.", icon: "🚩", short: "Dalla moviola della finale" });
    K.cos("dc_c3", { kind: "shirt", label: "Divisa della Questura", val: "#2a3a5a", from: "Completa Detective di Campo" });
    K.cos("dc_fisarmonica", { kind: "acc", label: "Fascia dell'assistente", val: "#d8b46a", from: "Finale «Caso chiuso»" });
    K.cos("dc_lega_pulita", { kind: "acc", label: "Stemma della Lega pulita", val: "#e8e2d4", from: "Finale «La Lega pulita»" });
    K.cos("dc_vendetta", { kind: "acc", label: "Mantello rosso di Agata", val: "#8a2a2a", from: "Finale «La vendetta di Agata»" });
    K.cos("dc_campo", { kind: "shirt", label: "Maglia del ritorno in campo", val: "#d8b46a", from: "Finale segreto «Di nuovo in campo»" });

    const allClues = () => ["cucitura", "guardalinee", "pallone", "numeri", "ombrello", "biglietto", "nastro87", "ricevute", "contratto", "tribuna", "pallone3", "guardalinee3"].every((id) => K.hasClue(id));
    const secretOk = () => st("fiuto") >= 12 && !F.get("dc_wrong") && F.get("dc_m1") != null && F.get("dc_m3") != null;
    const goal = (s) => ({
      0: "È il giorno della finale. Agata ti aspetta in Questura.",
      1: "Allo stadio: corri (piano) alla Sala Moviola. Ugo trasmette la finale in diretta.",
      2: "Hai visto il trucco. Agata è a bordo campo: il secondo tempo va giocato pulito.",
      3: "Il Consiglio è al Grand Hotel, nella Sala del Consiglio. Vanni ti aspetta. Porta le prove.",
      4: "Vanni ha ceduto. Agata deve decidere cosa fare. Parlale, nella Sala del Consiglio.",
    }[s] || "Il caso è chiuso. Dal menu puoi rigiocare i capitoli per gli altri finali.");

    // ---------------------------------------------------------------- la finale in diretta: Valfonda (verde) – Capitale (blu), primo tempo
    const green = "#2a7a4a", blue = "#2a4a8a";
    const CLIP = {
      frames: 360,
      ball: [[0, 160, 100, 0], [50, 130, 90, 0], [90, 100, 110, 0], [130, 90, 150, 10], [150, 86, 186, 0], [165, 86, 188, 0], [180, 100, 150, 12], [220, 60, 110, 0], [250, 30, 104, 0], [262, 8, 100, 6], [360, 8, 100, 0]],
      ballCol: (f) => (f >= 165 ? "#f2e8c4" : "#ffffff"),
      actors: [
        { id: "c9", shirt: blue, num: "9", path: [[0, 170, 96], [90, 108, 108], [180, 96, 140], [220, 64, 112], [250, 34, 104], [360, 40, 108]] },
        { id: "c10", shirt: blue, num: "10", path: [[0, 180, 130], [130, 100, 150], [180, 90, 146], [360, 70, 130]] },
        { id: "v5", shirt: green, num: "5", path: [[0, 120, 90], [130, 96, 130], [220, 70, 118], [360, 60, 110]] },
        { id: "v2", shirt: green, num: "2", path: [[0, 100, 140], [180, 92, 152], [360, 80, 140]] },
        { id: "vgk", shirt: "#e8c46a", num: "1", path: [[0, 16, 100], [250, 18, 104], [262, 22, 112], [360, 18, 100]] },
        { id: "arb", shirt: "#1a1a1a", num: "", path: [[0, 150, 120], [360, 90, 120]] },
        { id: "gl3", shirt: "#ffd23f", num: "", skin: "#d9b08c", path: [[0, 140, 188], [200, 90, 188], [360, 60, 188]], extra: (g, p, f) => { g.fillStyle = "#c0392b"; g.fillRect(p[0] - 8, p[1] - 6, 4, 3); g.fillStyle = "#222"; g.fillRect(p[0] - 5, p[1] - 6, 1, 7); } },
        { id: "boy3", shirt: "#3a5a8a", num: "", when: [150, 180], path: [[150, 76, 196], [165, 82, 192], [180, 76, 196]] },
      ],
      draw(g, f) {
        // la tribuna d'onore in alto, con Vanni; l'ombrello si apre tra i fotogrammi 80 e 220
        g.fillStyle = "#3a2a2a"; g.fillRect(120, 0, 80, 12); for (let i = 0; i < 6; i++) { g.fillStyle = i === 3 ? "#1a1a1a" : "#5a4a4a"; g.fillRect(126 + i * 12, 2, 6, 8); }
        if (f >= 80 && f <= 220) { g.fillStyle = "#c0392b"; g.beginPath(); g.arc(166, 6, 6, Math.PI, 0); g.fill(); }
        if (f > 262) { g.font = "bold 10px Georgia, serif"; g.fillStyle = "#ffd36b"; g.fillText("GOL CAPITALE · 0-1", 120, 196); }
      },
    };
    const ANOM = [
      { id: "tribuna", label: "L'ombrello in tribuna d'onore", x: 166, y: 6, frames: [80, 220], r: 14, text: "In tribuna d'onore si apre un ombrello rosso. Non piove. Accanto, Vanni guarda il campo.", hint: "In alto, in tribuna d'onore. Non sempre: solo per un po'." },
      { id: "pallone3", label: "Il pallone chiaro della finale", ball: true, frames: [165, 300], r: 12, text: "Dopo la rimessa entra il pallone chiaro. Lo stesso trucco del 1987.", hint: "Il pallone, prima e dopo la rimessa." },
      { id: "guardalinee3", label: "Il guardalinee sostituito", on: "gl3", frames: [0, 359], r: 14, text: "Il guardalinee di destra tiene la bandierina con la sinistra. Non è quello designato.", hint: "Guarda come tiene la bandierina." },
    ];
    function liveMoviola() {
      K.setInMatch(true);
      window.__moviola.start({
        title: "FINALE · Valfonda–Capitale · 1° tempo, in diretta", clip: CLIP, anomalies: ANOM, need: 3,
        intro: "La finale scorre in diretta sullo schermo di Ugo. Hai solo il primo tempo per trovare <b>tre dettagli</b>: il segnale, il pallone, l'uomo sulla linea.",
        miss: ["Niente. Ugo: «Lucia dice di guardare in alto, ogni tanto»", "Niente di strano. Agata, alla radio: «Il trucco ama le rimesse»", "No. Il pubblico intanto canta: «Va-lfon-da! Va-lfon-da!»"],
        outro: "Ugo ferma il nastro. «Stesso trucco del 1987. Lucia lo riconosce. Lo riconosco anch'io»",
        onDone: (r) => {
          K.setInMatch(false); r.found.forEach((id) => K.giveClue(id, true)); bond("fiuto", r.found.length - Math.floor(r.misses / 3));
          if (r.found.length >= 3) { F.set("dc_m3", r.misses); setStep(N, 2); }
          K.scene(r.found.length >= 3 ? [["dc_ugo", "Il pallone chiaro, il guardalinee falso, l'ombrello. Corri, ragazzo. Cioè: zoppica in fretta."], ["voce", "Dalla radio, la voce di Agata: «Ho fatto fermare la partita per un controllo. Il secondo tempo si gioca con il pallone di Tonio, quello con la cucitura rossa. E con Sereno Pace sulla linea. Venga a bordo campo»."]] : [["dc_ugo", "Il primo tempo è ancora sul nastro. Riguardalo, presto."]], () => K.enterZone(K.api.trZone() || "dc_moviola_in"), "dc_moviola");
        },
      });
    }
    function secondHalf() {
      const known = K.hasClue("pallone3") && K.hasClue("cucitura");
      K.ownMatch(window.__moviola.rigioca, {
        title: "La finale · secondo tempo pulito", twist: "pallone", known, us: "Valfonda", opp: { name: "Capitale", kit: blue, names: ["9", "10"] }, half: 30,
        mate: { name: "Valli jr.", skin: "#e8c4a0", hair: "#5a4a3a", shirt: green }, bg: "dc_stadio",
        intro: "Il secondo tempo della finale, giocato pulito, nella tua testa e sullo schermo: il Valfonda per una volta è libero di vincere o di perdere da solo.",
        knownTxt: "con il pallone di Tonio (cucitura rossa) i tiri vanno dove li mandi, e il portiere della Capitale non è più avvantaggiato.",
        goalTxt: "FINALE · SECONDO TEMPO",
        done: (r) => { F.set("dc_finale", r.win ? "vinta" : "persa"); bond("fiuto", 1); setStep(N, 3); quest("dc_consiglio", "Il Consiglio della Lega", "Affronta il segretario Vanni nella Sala del Consiglio del Grand Hotel.");
          K.scene([["voce", r.win ? "Valfonda vince la finale. Pulita. Il presidente Valli piange in tribuna, e stavolta non si vergogna." : "Valfonda perde la finale. Pulita. Il presidente Valli applaude lo stesso: per la prima volta da un anno, ha perso davvero."], ["dc_agata", "Il Consiglio è scappato al Grand Hotel. Sala del Consiglio, terzo piano. Vanni ci aspetta: lo ha detto lui, con il suo solito sorriso. Porti tutte le prove."]], () => K.enterZone("dc_stadio"), "dc_stadio"); },
      });
    }
    // ---------------------------------------------------------------- il confronto: tre prove per Vanni
    const ROUNDS = [
      { ok: ["ricevute"], prompt: "«Ispettrice, assistente. Che piacere. Io sono un segretario: firmo moduli, non partite. Non ho mai dato un soldo a nessuno, men che meno al Valfonda.»", right: "Ricevute dei bonifici della Lega al Valfonda. Sempre il giorno dopo una vittoria. Firmate: T. Vanni.", react: "(Vanni si toglie gli occhiali scuri. Ha gli occhi stanchi, molto più vecchi della voce.) Fondo promozione. Si promuove il calcio. Anche così." },
      { ok: ["tribuna", "ombrello"], prompt: "«Segnali? Truccare una partita con un ombrello? Lei legge troppi gialli. Un ombrello è un ombrello. Lo porto per la pioggia.»", right: "Non pioveva. Fila B, posto 14, contro il Portagrigia. Tribuna d'onore, oggi. Ogni volta che lei apriva l'ombrello, il guardalinee guardava altrove.", react: "(Vanni appoggia l'ombrello sul tavolo, piano, come un'arma consegnata.) Il guardalinee. Già. Le persone sono sempre il punto debole. Le bandierine no." },
      { ok: ["contratto", "nastro87"], prompt: "«E perché la Lega dovrebbe truccare la propria finale? Le finali sono la festa del calcio. Nessuno rovina la propria festa.»", right: "Perché la festa era già venduta: «stagione con favola garantita», diritti raddoppiati se la favola arriva in finale. E perde cinque a zero. Come nel 1987.", react: "(Vanni guarda Agata. Per la prima volta, abbassa gli occhi.) Nel 1987 ero un giovane impiegato. Mi chiesero di aprire un ombrello. Lo aprii. Da allora non ho mai smesso." },
    ];
    function confront(i) {
      const R = ROUNDS[i];
      K.present({
        who: "dc_vanni", bg: "dc_hotel", ok: R.ok, prompt: R.prompt,
        right: () => { bond("fiuto", 1); say([["hero", R.right], ["dc_vanni", R.react]], () => (i + 1 < ROUNDS.length ? confront(i + 1) : afterConfront())); },
        wrong: () => { bond("fiuto", -1); F.add("dc_wrong", 1); say([["dc_vanni", "(Sorride.) Questo? Questo non dice niente. Assistente, si sieda: il ginocchio le fa male, si vede. Anche la logica, forse."], ["voce", "Non era la prova giusta. Ascolta bene cosa nega."]], () => confront(i)); },
        back: done,
      });
    }
    function afterConfront() { setStep(N, 4); questDone("dc_consiglio"); say([["dc_vanni", "Va bene. Ho finito gli ombrelli. Il Consiglio sapeva tutto: cinque presidenti, cinque firme. Le carte sono nella cassaforte, dietro il quadro della prima Coppa della Lega."], ["dc_agata", "(Agata non parla. Stringe la fisarmonica. Le tremano le mani.)"]]); }
    function endingAsk() {
      const opts = [{ label: "Fai arrestare Vanni e chiudi il caso", sub: "La giustizia, un passo alla volta", big: true, fn: () => ending("chiuso") }];
      if (allClues() && st("agata") >= 5) opts.unshift({ label: "Porta tutte le prove al Tribunale sportivo e alla Gazzetta", sub: "Tutte e dodici, con Agata accanto", cls: "hot", big: true, fn: () => ending("pulita") });
      if (F.is("dc_agata_rabbia")) opts.push({ label: "Lascia che sia Agata a decidere", sub: "È la sua storia, dal 1987", big: true, fn: () => ending("vendetta") });
      if (secretOk()) opts.unshift({ label: "Agata ti guarda il ginocchio…", sub: "Segreto: fiuto altissimo, nessuna accusa sbagliata, tutte le moviole risolte", cls: "hot", big: true, fn: () => ending("campo") });
      ask("dc_agata", "È finita, assistente. Trentacinque anni di ombrelli. Mio fratello… lo saprà domani dai giornali, credo.\n\nCome lo chiudiamo, questo caso?", opts, "dc_hotel");
    }
    function ending(kind) {
      const R = { chiuso: { coins: 120, cos: ["dc_c3", "dc_fisarmonica"] }, pulita: { coins: 150, cos: ["dc_c3", "dc_lega_pulita"] }, vendetta: { coins: 120, cos: ["dc_c3", "dc_vendetta"] }, campo: { coins: 200, cos: ["dc_c3", "dc_campo"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N); setStep(N, 5);
      const lines = {
        chiuso: [["voce", "Vanni esce dal Grand Hotel tra due agenti, con l'ombrello chiuso sotto il braccio. Nessuno glielo toglie: non serve più a niente."], ["voce", "La Lega cambia arbitri e segretario. Il Consiglio si dimette «per motivi personali». Le partite tornano pulite. Quasi tutte."], ["dc_agata", "Liquirizia, assistente? Per festeggiare. È l'unica cosa che festeggio da anni."], ["voce", "<b>FINALE · CASO CHIUSO.</b> Il colpevole confessa, e le partite tornano pulite. Quasi tutte."]],
        pulita: [["voce", "Dodici prove sul tavolo del Tribunale sportivo. La Gazzetta di Nina esce con il titolo più grande della sua storia: «LA FAVOLA ERA SCRITTA»."], ["voce", "Cade l'intero Consiglio della Lega. Le partite del 1987 vengono riaperte. Il fratello di Agata riceve una lettera: la squalifica è annullata."], ["dc_agata", "(Agata sorride. Davvero, con i denti.) Lo sa che non sorridevo dal 1987? Mi fa male la faccia. È bellissimo."], ["voce", "<b>FINALE · LA LEGA PULITA.</b> Con tutte le prove sul tavolo, cade l'intero Consiglio."]],
        vendetta: [["voce", "Agata non chiama gli agenti. Chiama la Gazzetta, la televisione, e tutti i presidenti della Lega, uno per uno, di notte. Vuole che lo sappiano da lei."], ["voce", "Vanni perde tutto in una settimana: il posto, la casa, il nome. Il caso si chiude in fretta, con molto rumore."], ["dc_agata", "Ho aspettato trentacinque anni. Pensavo che dopo sarei stata contenta. …Sono solo stanca. Mi accompagni al Caffè, assistente?"], ["voce", "<b>FINALE · LA VENDETTA DI AGATA.</b> Il caso si chiude, ma qualcosa in lei resta aperto."]],
        campo: [["dc_agata", "Lei ha visto tutto, senza mai sbagliare un'accusa. Gli occhi migliori che abbia mai avuto accanto. Adesso però… le gambe."], ["voce", "Sei mesi dopo, il ginocchio regge. La Lega riorganizzata rigioca la finale, stavolta davvero, stavolta pulita. E in campo, con il numero {num}, ci sei tu."], ["voce", "Al primo tocco di palla, in tribuna, una fisarmonica attacca una marcia stonata. Il pubblico ride, poi canta. Tu tiri «{tiro}». È un gol, o forse no: non importa. Importa che è vero."], ["voce", "<b>FINALE SEGRETO · DI NUOVO IN CAMPO.</b> Il ginocchio regge. Nella finale pulita, il Campione torna in campo."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "dc_hotel");
    }

    const talk = {
      dc_agata() {
        const s = S();
        if (s === 0) return say([
          ["dc_agata", F.is("dc_agata_rabbia") ? "Oggi è il giorno. Non ho dormito. Ho suonato la fisarmonica fino alle quattro, i vicini hanno chiamato la Questura. Cioè me." : "Oggi è il giorno della finale. Ho dormito benissimo: ho sognato che arrestavo un ombrello. Lui resisteva."],
          ["dc_agata", "Io starò a bordo campo, con la radio. Lei vada nella Sala Moviola: Ugo trasmette la finale in diretta. Se il trucco è lo stesso, lo vedrà prima di chiunque."],
        ], () => { setStep(N, 1); done(); });
        if (s === 2) return ask("dc_agata", "Il pallone chiaro l'ho fatto togliere. Il guardalinee finto è scappato dalla porta degli spogliatoi, inciampando nella sua stessa bandierina. Al suo posto c'è Sereno Pace. Si gioca il secondo tempo pulito.\n\nLo guardi con me. Anzi: lo giochi con la testa, come l'altra volta.", [
          { label: "Gioca il secondo tempo pulito", sub: "La finale, ricostruita (Moviola)", cls: "hot", fn: secondHalf },
          { label: "Un attimo", fn: done },
        ], "dc_stadio");
        if (s === 4) return endingAsk();
        return say([["dc_agata", s >= 5 ? "Il caso è chiuso. Le serve un caso nuovo? Ne ho tre nel cassetto. Uno riguarda un piccione." : "Il Grand Hotel, terzo piano. Porti le prove. E la stampella: fa scena."]]);
      },
      dc_ugo() {
        const s = S();
        if (s !== 1) return say([["dc_ugo", s > 1 ? "Lucia, il proiettore, oggi ha lavorato come nel 1987. Stanotte le cambio l'olio, poverina." : "La finale si vede da qui meglio che dalla tribuna. Lucia non ha mai sbagliato una diretta."]]);
        return ask("dc_ugo", "La diretta è cominciata. Primo tempo, Valfonda–Capitale. Lucia è già calda. Guardiamo?", [{ label: "Guarda la finale in moviola", sub: "Trova i tre dettagli, in diretta", cls: "hot", fn: liveMoviola }, { label: "Più tardi", fn: done }], "dc_moviola");
      },
      dc_vanni() { if (S() === 3) return confront(0); return say([["dc_vanni", S() > 3 ? "Ho finito gli ombrelli, assistente. Mi lasci finire anche il caffè." : "Ispettrice, assistente. La finale è di sotto. Io guardo da quassù: si vede meglio il disegno, da lontano."]]); },
      dc_valli() { return say([["dc_valli", "Comunque vada oggi, il Valfonda gioca. Per davvero. È la prima volta da un anno che ho voglia di guardare."]]); },
      dc_sereno() { return say([["dc_sereno", "Mi hanno rimesso sulla linea. Oggi la bandierina la alzo quando c'è fuorigioco. Mi sembra una rivoluzione."]]); },
      dc_tonio() { return say([["dc_tonio", "Ho portato i miei palloni. Tutti con la cucitura rossa. Trentacinque anni li ho tenuti in cantina, per questo giorno. Non lo sapevo, ma era per questo giorno."]]); },
      dc_nina() { return say([["dc_nina", "La prima pagina di domani è bianca. La riempie lei. Non mi deluda: ho già comprato l'inchiostro rosso."]]); },
    };
    const patch = {
      dc_stadio: { npcs: (s, list) => [...list.filter((n) => n.id !== "dc_agata"), ...(s >= 2 && s <= 2 ? [{ id: "dc_agata", at: [20, 20] }] : []), { id: "dc_tonio", at: [10, 20] }, { id: "dc_sereno", at: [30, 20] }, { id: "dc_valli", at: [20, 4] }] },
      dc_citta: {
        build(L, s) { if (s >= 3) L.house(30, 3, 8, 7, { door: [33, 9], roof: "#4a2a3a", wall: "#d8c8b8", rr: 3, lit: true, enter: { room: "ufficio", id: "dc_consiglio", name: "La Sala del Consiglio", bg: "dc_hotel", intro: "La Sala del Consiglio del Grand Hotel: un tavolo lungo, cinque poltrone vuote, e alla parete il quadro della prima Coppa della Lega. Alla finestra, di spalle, il segretario Vanni.", who: (s2) => [{ id: "dc_vanni", at: [10, 4] }, ...(K.stepOf(3) >= 3 ? [{ id: "dc_agata", at: [15, 9] }] : [])] } }); },
      },
      dc_questura: { npcs: (s, list) => (K.stepOf(3) >= 3 ? list.filter((n) => n.id !== "dc_agata") : list) },
    };
    return { n: N, title: "Il fischio finale", sub: "La finale in diretta, il Grand Hotel, l'ombrello di Vanni", goal, start: "dc_citta", introBg: "dc_stadio", zones: {}, talk, obj: {}, patch,
      intro: () => [["voce", "Domenica. Finale della Lega delle Città: Valfonda contro la Capitale. Lo Stadio Comunale di Portagrigia è pieno come non lo era da trent'anni."], ["voce", "Piove, naturalmente. Ma stavolta, in tribuna d'onore, c'è un ombrello rosso che aspetta solo il momento giusto per aprirsi."]] };
  }
  boot();
})();
