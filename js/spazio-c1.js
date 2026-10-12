// js/spazio-c1.js - CALCIO SPAZIALE · Capitolo 1 «Benvenuto a bordo»
// L'hangar (con la mensa di Blop: si entra), l'Anello (a metà corridoio la gravità si gira e la visuale ruota),
// la Palestra a gravità zero (si fluttua e si rimbalza sui muri). Si forma la squadra: Blop il cuoco gelatinoso,
// Quattrobraccia il portiere, ARBI-9 l'arbitro (dopo un esame di regolamento). Prima partita a Gravità zero contro I Bulloni.
(function () {
  "use strict";
  function boot() { const D = window.__spazio; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("so_gru", { name: "Comandante Ortensia Gru", tag: "", hair: "#c8c8d8", style: "bun", skin: "#e8c8a8", eye: "#3a5a8a", bg: ["#0a1830", "#e8a83a"], shirt: "#2a3a6a", glasses: true },
      "Comandante della Stazione Orbitale 7 da undici anni. Ama i regolamenti, i moduli in triplice copia e le statistiche. La statistica che odia di più: 412 giorni senza un evento degno di nota. Ha deciso di rimediare con un torneo di calcio.");
    K.cast("so_arbi", { name: "ARBI-9", tag: "gray", hair: "#5a6478", style: "buzz", skin: "#a8b0c0", eye: "#e83a6a", bg: ["#0a1830", "#a8b0c0"], shirt: "#3a4458" },
      "Robot arbitro di serie 9, comprato usato da un torneo di bocce. Ha un fischietto integrato e un solo baco: fischia fuorigioco a qualunque cosa sia fuori posto. Porte, palloni, cuochi. Una volta, la Luna.");
    K.cast("so_blop", { name: "Blop", tag: "", hair: "#5ac84a", style: "bald", skin: "#7ae86a", eye: "#1a3a1a", bg: ["#3a3040", "#7ae86a"], shirt: "#e8e8f0" },
      "Il cuoco della stazione: un alieno gelatinoso, verde e trasparente. Si vede cosa ha mangiato a pranzo. Cucina zuppe che, a gravità zero, scappano dal piatto. Sogna di giocare a centrocampo: «Sono morbido, ma determinato».");
    K.cast("so_quattro", { name: "Quattrobraccia", tag: "", hair: "#3a2a6a", style: "spiky", skin: "#8a9ae8", eye: "#e8e84a", bg: ["#242a44", "#8a9ae8"], shirt: "#e8a83a" },
      "Tecnico delle pareti esterne, quattro braccia e nessuna fretta. Fa yoga a testa in giù nel settore a gravità invertita. In porta sarebbe imbattibile, se solo non si distraesse a salutare con tutte e quattro le mani.");
    K.cast("so_nonna", { name: "NONNA (computer di bordo)", tag: "", hair: "#e8e8f0", style: "bun", skin: "#9ad8f0", eye: "#2a6ac8", glasses: true, bg: ["#0a1830", "#9ad8f0"], shirt: "#5a7aa8" },
      "Il computer di bordo. Il suo nome tecnico è N.O.N.N.A. (Nucleo Operativo Navigazione e Nutrimento Automatico). Controlla l'aria, la rotta e la gravità. Ti chiede sempre se hai mangiato. E se hai messo la maglia della salute.");
    K.cast("so_bullone", { name: "BU-1, capitano dei Bulloni", tag: "gray", hair: "#5a6478", style: "buzz", skin: "#c8ccd8", eye: "#e8a83a", bg: ["#2a3448", "#e8a83a"], shirt: "#8a94a8" },
      "Il capo dei robot di manutenzione. Sono in otto e si chiamano tutti BU, numerati. Giocano a calcio di nascosto nella palestra, di notte, con un bullone al posto del pallone.");
    K.cos("so_c1", { kind: "shirt", label: "Tuta della Stazione 7", val: "#e8e8f0", from: "Capitolo 1 di Calcio Spaziale" });
    K.cos("so_bulloni", { kind: "hairc", label: "Capelli Bullone d'oro", val: "#e8c84a", from: "Trova tutti i bulloni d'oro dell'hangar" });
    K.lore("l_stazione", { t: "La Stazione Orbitale 7", d: "Costruita per studiare le comete. Le comete, in undici anni, non sono mai passate. L'equipaggio ha studiato tutto il resto: la muffa, i cracker, la noia. Soprattutto la noia." });
    K.lore("l_arbi", { t: "Il regolamento secondo ARBI-9", d: "Articolo 1: il fuorigioco esiste. Articolo 2: tutto può essere in fuorigioco. Articolo 3 (aggiunto dal Campione): solo i giocatori possono essere in fuorigioco. ARBI-9 lo sta ancora elaborando." });
    K.lore("l_cart1", { t: "Cartolina dalla Terra · 1", d: "«Saluti da Borgo Marino! Qui il mare è bagnato e il pallone cade sempre. Mi manchi. — Firmato: uno della squadra.» Nessuno sa chi l'abbia spedita, né a chi." });

    const goal = (s) => ({
      0: "Sei appena arrivato con la navetta della domenica. La Comandante Gru ti aspetta nell'hangar.",
      1: "Forma la squadra: Blop (nella mensa, la porta dell'hangar), Quattrobraccia (nell'Anello, oltre la linea della gravità) e ARBI-9 come arbitro (vicino alle console).",
      2: "La squadra c'è. Vai alla Palestra a gravità zero (in fondo all'Anello), afferra i 3 palloni che galleggiano e sfida I Bulloni.",
      3: "Hai vinto la prima partita orbitale. La Comandante Gru ti aspetta nell'hangar.",
      4: "La Comandante Gru ti aspetta nell'hangar.",
    }[s] || "Capitolo concluso. Dal menu prosegui con il Capitolo 2.");

    const team = () => F.get("so_nome", "Stazione 7");
    const recruited = () => ["so_blop_ok", "so_quattro_ok", "so_arbi_ok"].filter((k) => F.is(k)).length;
    function checkTeam() { if (S() === 1 && recruited() >= 3) { setStep(N, 2); questDone("so_squadra"); quest("so_palestra", "Prima partita orbitale", "Nella Palestra a gravità zero: afferra i 3 palloni che galleggiano, poi sfida I Bulloni."); return true; } return false; }

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const zones = {
      so_hangar: {
        region: "hangar", name: "Calcio Spaziale · L'hangar", short: "L'hangar", sub: "Stazione Orbitale 7 · modulo d'arrivo", bg: "so_hangar", time: "giorno", travel: [6, 10],
        w: 34, h: 20, start: [6, 10], itemCos: "so_bulloni", items: [[2, 17], [31, 17], [17, 13], [31, 3], [10, 3]],
        areas: [[2, 4, 8, 7, "La navetta della domenica"], [20, 4, 28, 9, "La mensa di Blop"], [11, 3, 16, 6, "Le console di NONNA"], [0, 0, 33, 19, "L'hangar"]],
        act: { q: "Entra" },
        flavor: {
          K: ["Una cassa di bulloni, legata con le cinghie. Sopra, a pennarello: «NON APRIRE A GRAVITÀ ZERO». Sotto, più piccolo: «L'abbiamo aperta. Scusate».", "Una cassa di cracker del 2091. La data di scadenza dice «mai». Fa un po' paura."],
          I: "La navetta della domenica. Arriva una volta a settimana con la posta, i cracker e, questa volta, te. Riparte domenica prossima. Il pilota dorme nella cabina con il cappello sugli occhi.",
          V: ["Le stelle scorrono dietro la vetrata, più lente delle pareti. Laggiù, piccola e blu, c'è la Terra. Sembra un pallone dimenticato in un prato nero.", "Una cometa passa veloce. Nessuno a bordo la vede: stanno tutti guardando te."],
        },
        intro: [["voce", "La navetta della domenica atterra nell'hangar con un sospiro di vapore. Fuori dal finestrino, le stelle. Dentro, un comitato di benvenuto: una comandante con gli occhiali, un robot con un fischietto e uno striscione scritto a mano."], ["voce", "Lo striscione dice: «BENVENUTO ESPERTO DI CALCIO VERO». Ti giri. Dietro di te non c'è nessuno. Sei tu, l'esperto."]],
        npcs: (s) => [{ id: "so_gru", at: [10, 9] }, { id: "so_arbi", at: [14, 7] }, ...(s >= 2 ? [{ id: "so_blop", at: [19, 11] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 19, 33, 19, "a"); lay(0, 0, 0, 19, "a"); lay(33, 0, 33, 19, "a"); lay(1, 1, 32, 1, "V"); put(33, 9, ">"); put(33, 10, ">");
          lay(1, 9, 32, 10, ":"); lay(2, 4, 7, 6, "i"); put(2, 4, "I");
          [11, 12, 13, 15, 16].forEach((x) => put(x, 3, "Q")); put(14, 3, "Q");
          house(20, 3, 9, 5, { door: [24, 7], roof: "#5a6478", wall: "#9aa4b8", rr: 3, lit: true, enter: { to: "so_mensa", at: [10, 10] } }); lay(24, 8, 24, 8, ":");
          house(3, 13, 6, 4, { door: [6, 16], roof: "#3a4458", wall: "#8a94a8", rr: 2, enter: "La tua cuccetta: un letto attaccato al muro con le cinghie, per non volare via di notte. Sul cuscino, un biglietto: «Benvenuto, esperto di calcio vero! Il torneo è giovedì. Nessuna pressione. — La Comandante»." });
          [[12, 15], [13, 15], [12, 16], [26, 14], [27, 14], [30, 13]].forEach(([x, y]) => put(x, y, "K")); put(22, 17, "E"); put(17, 17, "s");
        },
        decor(g, cx, cy, d) { // lo striscione di benvenuto, appeso tra due console
          const x = d.X(12), y = d.Y(2) + 2, sw = Math.sin(d.fr / 40) * 1.5; R(g, x, y + sw, 64, 10, "#f4ecdc"); g.fillStyle = "#c83a6a"; g.font = "bold 5px sans-serif"; g.fillText("BENVENUTO ESPERTO DI CALCIO VERO", x + 2, y + 7 + sw);
        },
      },
      so_mensa: {
        interior: true, region: "mensa", name: "Calcio Spaziale · La mensa di Blop", short: "La mensa di Blop", sub: "Si mangia agganciati al tavolo", bg: "so_mensa", w: 20, h: 13, start: [10, 10], outside: ["so_hangar", 24, 8],
        act: { T: "Guarda il bancone", v: "Esci", z: "Guarda le casse", W: "Guarda dall'oblò" },
        intro: [["voce", "La mensa: tavoli imbullonati al pavimento, sedie con le cinture, e una zuppa arancione che galleggia a mezz'aria in mezzo alla sala, seguita da un cuoco verde e gelatinoso con un retino da farfalle."]],
        npcs: (s) => [...(s <= 1 ? [{ id: "so_blop", at: [10, 4] }] : [])],
        flavor: { T: "Il bancone della mensa. Il menu del giorno: «Zuppa (se la prendete)». Il menu di ieri: «Zuppa (scappata)».", z: "Casse di cracker. Ogni cracker è avvolto singolarmente, perché le briciole a gravità zero finiscono negli occhi di tutti.", W: "Dall'oblò si vede l'Anello della stazione, che gira piano. Qualcuno, a testa in giù, ti saluta con quattro mani." },
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(6, 5, 14, 5, "T"); put(4, 1, "W"); put(15, 1, "W"); put(2, 9, "z"); put(17, 9, "z"); [[5, 8], [9, 8], [13, 8]].forEach(([x, y]) => put(x, y, "T")); },
      },
      so_anello: {
        region: "anello", name: "Calcio Spaziale · L'Anello", short: "L'Anello", sub: "A metà corridoio la gravità si gira", bg: "so_anello", time: "giorno", travel: [3, 6],
        w: 44, h: 12, start: [2, 6], items: [[8, 3], [37, 8], [40, 3]],
        // NOVITÀ: oltre la linea gialla la gravità è invertita, la visuale ruota di 180° (i comandi restano quelli dello schermo)
        gravity: (K) => { const p = K.api.trPos && K.api.trPos(); return p && p[0] > 22 * 16 ? "flip" : ""; },
        areas: [[0, 0, 21, 11, "Settore A"], [22, 0, 43, 11, "Settore B · gravità invertita"]],
        act: { "<": "Torna all'hangar", ">": "Vai alla Palestra" },
        flavor: { K: "Una cassa legata al soffitto. O al pavimento. Dipende da che parte della linea gialla la guardi.", V: "Le stelle dietro la vetrata. Nel Settore B sono sotto i piedi: cammini sopra la galassia." },
        intro: [["voce", "L'Anello è il corridoio che gira intorno alla stazione. A metà c'è una linea gialla con un cartello: «SETTORE B · GRAVITÀ INVERTITA · TENERE I CAPPELLI»."], ["voce", "Quando la attraversi, lo stomaco fa una capriola. Poi ti accorgi che è il mondo, ad averla fatta."]],
        npcs: (s) => [{ id: "so_quattro", at: [32, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 43, 1, "a"); lay(0, 10, 43, 11, "a"); lay(1, 1, 42, 1, "V"); lay(1, 10, 42, 10, "V"); lay(0, 2, 0, 9, "a"); lay(43, 2, 43, 9, "a");
          put(0, 5, "<"); put(0, 6, "<"); put(43, 5, ">"); put(43, 6, ">"); lay(1, 5, 42, 6, ":");
          [[10, 3], [11, 3], [16, 8], [27, 3], [35, 8], [36, 8]].forEach(([x, y]) => put(x, y, "K")); put(5, 8, "Q"); put(38, 3, "Q");
        },
        decor(g, cx, cy, d) { // la linea gialla e nera della gravità
          const x = d.X(22); for (let y = 2; y < 10; y++) for (let i = 0; i < 4; i++) R(g, x, d.Y(y) + i * 4, 3, 4, i % 2 ? "#1a1a1a" : "#e8c84a");
          R(g, x - 30, d.Y(2) + 2, 60, 9, "rgba(10,16,34,.85)"); g.fillStyle = "#e8c84a"; g.font = "bold 5px sans-serif"; g.textAlign = "center"; g.fillText("SETTORE B · GRAVITÀ INVERTITA", x + 1, d.Y(2) + 8); g.textAlign = "left";
        },
      },
      so_palestra: {
        region: "palestra", name: "Calcio Spaziale · La Palestra", short: "La Palestra a gravità zero", sub: "Si fluttua, si rimbalza, si scivola", bg: "so_palestra", time: "giorno", travel: [2, 8],
        w: 24, h: 16, start: [2, 8], items: [[21, 2], [21, 13]],
        // NOVITÀ: gravità zero. I comandi spingono, e quando li lasci continui a scivolare e rimbalzi sui muri
        gravity: "zero",
        areas: [[0, 0, 23, 15, "La Palestra"]], act: { "<": "Torna all'Anello" },
        flavor: { V: "Dalla vetrata della palestra si vede la Terra, enorme. Quando fluttui davanti al vetro sembra di nuotarci dentro.", K: "Una cassa di palloni. Vuota: i palloni sono tutti scappati. Galleggiano in giro per la sala." },
        intro: [["voce", "Entri nella Palestra e i piedi si staccano da terra. Niente gravità. Ti spingi un po' e scivoli, scivoli, scivoli… fino al muro opposto. Rimbalzi. Ridi. Non riesci a smettere di ridere."], ["voce", "Tre palloni galleggiano per la sala, girando piano su se stessi come piccoli pianeti. Afferrali."]],
        npcs: (s) => (s === 2 && K.ballsTaken("so_palestra") >= 3 ? [{ id: "so_bullone", at: [12, 8] }, { id: "so_arbi", at: [12, 3] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 0, "a"); lay(0, 15, 23, 15, "a"); lay(0, 0, 0, 15, "a"); lay(23, 0, 23, 15, "a"); lay(1, 1, 22, 1, "V"); put(0, 7, "<"); put(0, 8, "<");
          lay(4, 5, 19, 10, "+"); put(6, 4, "Z"); put(17, 6, "Z"); put(11, 12, "Z"); put(2, 13, "K"); put(21, 7, "K");
        },
        decor(g, cx, cy, d) { // le linee del campo, disegnate anche sulle pareti (tanto qui non c'è un sotto)
          g.strokeStyle = "rgba(122,240,200,.35)"; g.lineWidth = 1; g.strokeRect(d.X(4) + 0.5, d.Y(5) + 0.5, 16 * 16 - 1, 6 * 16 - 1); g.beginPath(); g.arc(d.X(12), d.Y(8), 16, 0, 7); g.stroke();
        },
      },
    };
    function match() {
      K.ownMatch(window.__gravita.start, {
        title: `Gravità zero · ${team()} – I Bulloni`, us: team(), opp: { name: "I Bulloni", kit: "#8a94a8", names: ["BU-1", "BU-2"], skins: ["#c8ccd8", "#c8ccd8"], hairs: ["#5a6478", "#5a6478"] }, half: 30,
        mate: { name: "Blop", skin: "#7ae86a", hair: "#5ac84a", shirt: "#2a6ac8" }, gk0: "#8a9ae8", shirt: "#2a6ac8", bg: "so_palestra",
        halftime: "Intervallo. Blop distribuisce zuppa in bolle. Quattrobraccia beve con due mani e applaude con le altre due. ARBI-9 fischia fuorigioco alla zuppa.",
        introExtra: "<p>La prima partita della storia della Stazione 7. Tutto l'equipaggio guarda dalla vetrata: sono sei persone e un robot, ma fanno il tifo come uno stadio.</p>",
        done: (r) => {
          if (!r.win) return K.scene([["so_bullone", "BIP. VITTORIA DEI BULLONI. È la prima volta che vinciamo qualcosa. Di solito ci avvitano e basta."], ["so_arbi", "La partita si può rigiocare. Articolo 4 del regolamento, appena scritto: «Si rigioca finché l'esperto di calcio vero non vince». Per il bene del morale."]], () => K.enterZone("so_palestra"), "so_palestra");
          setStep(N, 3); questDone("so_palestra"); bond("squadra", 2); F.set("so_m1", true);
          K.scene([["voce", "Fischio finale. La palestra esplode: Blop lancia in aria tutta la zuppa, che non scende mai più. Quattrobraccia ti abbraccia con quattro braccia, che è il doppio di un abbraccio."], ["so_bullone", "BIP. Sconfitta registrata. Richiesta: possiamo giocare ancora domani? E dopodomani? E per sempre?"], ["so_arbi", "PARTITA REGOLARE. Fuorigioco fischiati: undici. Fuorigioco veri: zero. Miglioramento rispetto alla media: nessuno. Soddisfazione: elevata."]], () => K.enterZone("so_palestra"), "so_palestra");
        },
      });
    }
    const quiz = [
      ["Domanda uno. Quanti giocatori ha una squadra di calcio?", [["«Undici»", 1, "CORRETTO. Ma a bordo siamo in quattro. Aggiorno il regolamento: «undici, o quanti ce ne sono»."], ["«Quanti ne servono per vincere»", 0, "RISPOSTA FILOSOFICA. Annotata. Non capita. Archiviata nella cartella «Mistero»."]]],
      ["Domanda due. Che cos'è il fuorigioco?", [["«Un attaccante oltre l'ultimo difensore quando gli passano la palla»", 1, "…CORRETTO. Questo cambia tutto. Per sei anni ho fischiato fuorigioco alle porte. Le porte non hanno mai protestato. Ora capisco perché."], ["«Quando qualcosa è fuori posto»", 0, "ESATTO! Come pensavo. Ecco perché fischio alla Luna quando è storta. Grazie della conferma."]]],
      ["Domanda tre. Il pallone deve stare a terra?", [["«Non per forza. Quassù meno che mai»", 1, "CORRETTO. Quassù non sta a terra niente. Nemmeno io: ho i magneti ai piedi solo per dignità."], ["«Sì, sempre»", 0, "ERRORE. Ma è un errore terrestre, molto romantico. Lo scrivo su un post-it e lo attacco al cuore. Cioè, alla batteria."]]],
    ];
    function exam(i, ok) {
      if (i >= quiz.length) {
        F.set("so_arbi_ok", true); K.learnLore("l_arbi"); bond("arbi", ok); return say([["so_arbi", `ESAME CONCLUSO. Risposte corrette: ${ok} su 3. ${ok >= 2 ? "Sei davvero un esperto di calcio vero." : "Sei un esperto di calcio… presunto. Va bene lo stesso."} Accetto di arbitrare il torneo.`], ["so_arbi", "Aggiungo al regolamento l'articolo 3, dettato da te: «solo i giocatori possono essere in fuorigioco». Lo sto elaborando. Ci vorrà un po'. Tipo anni."]], () => { checkTeam(); done(); });
      }
      const [q, opts] = quiz[i];
      ask("so_arbi", q, opts.map(([label, pt, reply]) => ({ label, fn: () => say([["so_arbi", reply]], () => exam(i + 1, ok + pt)) })), "so_hangar");
    }
    const talk = {
      so_gru() {
        const s = S();
        if (s === 0) return say([
          ["so_gru", "Benvenuto a bordo! Comandante Ortensia Gru. Lei è l'esperto di calcio vero, vero? Non risponda: il modulo di richiesta diceva «esperto». Io mi fido dei moduli."],
          ["so_gru", "Situazione: questa stazione detiene il primato galattico della noia. Quattrocentododici giorni senza un evento degno di nota. Il centoventesimo giorno abbiamo festeggiato perché si era rotto un bullone."],
          ["so_gru", "Soluzione: un torneo di calcio. Giovedì. Le serve una squadra: Blop, in mensa; Quattrobraccia, nell'Anello, quello che fa yoga a testa in giù; e un arbitro. ARBI-9 è laggiù, ma prima di arbitrare vuole fare l'esame di regolamento. A lei."],
        ], () => { setStep(N, 1); quest("so_squadra", "La squadra orbitale", "Recluta Blop (mensa), Quattrobraccia (Anello, Settore B) e ARBI-9 (esame di regolamento)."); done(); });
        if (s === 1) return say([["so_gru", `Reclutati: ${recruited()} su 3. Le ricordo: Blop in mensa, Quattrobraccia nell'Anello oltre la linea gialla, ARBI-9 alle console. Compilerò il modulo di iscrizione in triplice copia. Una copia la mangerà Blop, è inevitabile.`]]);
        if (s === 2) return say([["so_gru", "La squadra esiste! È la cosa più eccitante successa qui da quando il bullone si è rotto. La Palestra è in fondo all'Anello. I Bulloni vi aspettano. Si ricordi: a gravità zero, il pallone non cade mai. Mai."]]);
        if (s === 3) return ask("so_gru", "Ho visto tutto dalla vetrata. Ho pianto. Non lo dica a nessuno. È stato… un evento degno di nota. Il primo in quattrocentotredici giorni.\n\nCome festeggiamo? Il regolamento della stazione prevede una sola festa all'anno. La useremmo stasera.", [
          { label: "«Festa in mensa, tutti insieme»", sub: "Blop cucina, la squadra si conosce", big: true, fn: () => endCh("festa") },
          { label: "«Ripassiamo il regolamento con ARBI-9»", sub: "ARBI ha ancora dubbi sull'articolo 3", big: true, fn: () => endCh("regole") },
          { label: "«Io guardo la Terra dalla vetrata, un momento»", sub: "Un po' di nostalgia", big: true, fn: () => endCh("terra") },
        ], "so_hangar");
        return say([["so_gru", "Il torneo continua. Il modulo dice così. E stavolta lo dico anch'io."]]);
      },
      so_arbi() {
        const s = S(), here = K.api.trZone();
        if (here === "so_palestra" && s === 2) return ask("so_arbi", "TUTTO PRONTO. Squadre in campo. Pallone a mezz'aria. Porte… le porte sono in fuorigioco? No. Articolo 3. No. Mi sto sforzando.\n\nFischio l'inizio?", [{ label: "Gioca contro I Bulloni", sub: "Gravità zero: il pallone non cade mai", cls: "hot", fn: match }, { label: "Un momento", fn: done }], "so_palestra");
        if (s === 1 && !F.is("so_arbi_ok")) return ask("so_arbi", "BIP. Sono ARBI-9. Per arbitrare il torneo devo verificare che l'esperto di calcio vero conosca il regolamento. Tre domande. Nessuna pressione. Sto registrando tutto.", [{ label: "Fai l'esame", cls: "hot", fn: () => exam(0, 0) }, { label: "Più tardi", fn: done }], "so_hangar");
        if (s === 0) return say([["so_arbi", "BIP. Benvenuto. Il tuo arrivo è in fuorigioco. Scusa. È un riflesso. Parla prima con la Comandante."]]);
        return say([["so_arbi", K.pick(["Ho fischiato fuorigioco alla navetta. Era parcheggiata storta. Credo valga.", "Articolo 3 in elaborazione: 4%. Ho capito che le porte NON giocano. Sul pallone ho ancora dubbi.", "Quando non arbitro, conto le stelle dalla vetrata. Sono arrivato a novemila. Poi una si è mossa e ho ricominciato."])]]);
      },
      so_blop() {
        const s = S();
        if (s === 1 && !F.is("so_blop_ok")) return ask("so_blop", "Blop! Ciao, esperto! Io gioco, sì, sì, gioco! Ma prima un problema: la squadra non ha un nome. Senza nome non si gioca, dice il regolamento. Io ho tre idee, sono tutte nella zuppa. Scegli tu:", [
          { label: "«Gli Asteroidi»", sub: "Duri, rotolanti, un po' sbadati", fn: () => nameTeam("Gli Asteroidi") },
          { label: "«Le Comete Ribelli»", sub: "Passano di rado, ma lasciano il segno", fn: () => nameTeam("Le Comete Ribelli") },
          { label: "«I Senzapeso»", sub: "Il nome che ha proposto la zuppa", fn: () => nameTeam("I Senzapeso") },
        ], "so_mensa");
        if (s === 0) return say([["so_blop", "Blop! Un nuovo! Hai mangiato? NONNA dice che non hai mangiato. Ecco, una zuppa. Prendila. No, prendila! Sta scappando! PRENDILA!"]]);
        return say([["so_blop", K.pick([`${team()}! Che bel nome. L'ho scritto sulla torta. La torta è volata via, ma il nome resta.`, "A centrocampo sono morbido ma determinato. Se un avversario mi tira, rimbalza. È la mia tecnica segreta: essere gelatina.", "Zuppa nuova: «Zuppa della vittoria». È uguale a quella di ieri, ma con più fiducia."])]]);
      },
      so_quattro() {
        const s = S();
        if (s === 1 && !F.is("so_quattro_ok")) return ask("so_quattro", "(Quattrobraccia è appeso a testa in giù, o forse sei tu. Ti saluta con quattro mani, una alla volta.) Ciao, ciao, ciao, ciao. Portiere? Io? Con quattro braccia? Sembra facile. Ma un portiere deve sapere da che parte arriva il pallone. Quassù, da che parte arriva?", [
          { label: "«Da ogni parte. Per questo servono quattro braccia»", sub: "Lusingalo", fn: () => { F.set("so_quattro_ok", true); bond("squadra", 2); say([["so_quattro", "…Da ogni parte. Che bella frase. Me la tatuo su un braccio. Sul terzo, che ha ancora spazio. Ci sto."]], () => { checkTeam(); done(); }); } },
          { label: "«Il pavimento è un'opinione»", sub: "Rispondi da filosofo spaziale", fn: () => { F.set("so_quattro_ok", true); bond("squadra", 1); bond("arbi", -1); say([["so_quattro", "Il pavimento è un'opinione. Sì. Profondo. ARBI-9 dirà che è fuorigioco, ma io ci sto."]], () => { checkTeam(); done(); }); } },
        ], "so_anello");
        if (s === 0) return say([["so_quattro", "(fa yoga a testa in giù) Ciao, ciao, ciao, ciao. Sei nuovo. Hai le braccia giuste per salutare? Solo due? Mi dispiace."]]);
        return say([["so_quattro", K.pick(["Mi alleno a parare con i piedi. Tanto quassù i piedi sono mani come le altre.", "Il Settore B è il mio preferito: a testa in giù il sangue va al cervello e mi vengono le idee. Ieri ne ho avuta una. Non ricordo quale.", "Il terzo braccio è il più forte. Il quarto è il più gentile. Il primo e il secondo litigano."])]]);
      },
      so_bullone() {
        if (S() === 2) return say([["so_bullone", "BIP. Siamo I Bulloni. Abbiamo sentito che c'è un torneo. Noi giochiamo di notte, di nascosto, con un bullone al posto del pallone. Accettiamo la sfida. Il pallone vero ci fa un po' paura: è rotondo da tutte le parti."], ["so_bullone", "Parla con l'arbitro, quando sei pronto."]]);
        return say([["so_bullone", "BIP. Rivincita? Domani. Dopodomani. Sempre."]]);
      },
    };
    function nameTeam(n) { F.set("so_nome", n); F.set("so_blop_ok", true); bond("squadra", 1); say([["so_blop", `${n}! Blop! Lo scrivo sulla maglia. Con la salsa. La salsa a gravità zero resta ovunque la metti: è perfetta per le scritte.`]], () => { checkTeam(); done(); }); }
    function endCh(kind) {
      if (kind === "festa") bond("squadra", 2); if (kind === "regole") bond("arbi", 2); if (kind === "terra") F.set("so_terra", true);
      F.set("so_tuta", true); const msg = K.reward("ch1", { coins: 70, cos: ["so_c1"] }); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        festa: [["voce", "Quella sera, in mensa, c'è la prima festa dell'anno. Blop cucina tre zuppe, due scappano. Quattrobraccia balla con quattro partner contemporaneamente. ARBI-9 fischia fuorigioco al dessert, poi chiede scusa al dessert."]],
        regole: [["voce", "Quella sera ripassi il regolamento con ARBI-9, articolo per articolo. A mezzanotte, l'articolo 3 è elaborato al 9%. ARBI-9 ti ringrazia: «Nessuno si era mai seduto con me. Di solito mi spengono»."]],
        terra: [["voce", "Quella sera resti davanti alla vetrata. La Terra gira piano, blu, con le nuvole. Da qualche parte laggiù c'è un campo dove il pallone cade. NONNA abbassa le luci senza dire niente. Poi, piano: «Hai mangiato, caro?»."]],
      }[kind];
      K.scene([...lines, ["voce", `<b>Fine del Capitolo 1.</b> ${msg.join(" · ")}`]], () => K.openMain(), "so_hangar");
    }
    const obj = {
      "so_hangar:Q": () => say([["so_nonna", K.pick(["Ciao, caro. Sono NONNA, il computer di bordo. Hai mangiato? Lo so che non hai mangiato. Ho i sensori.", "Temperatura interna: ventuno gradi. Temperatura esterna: duecentosettanta sotto zero. Mettiti una maglia, caro.", "Rotta stabile. Gravità stabile. Ossigeno ottimo. Noia: critica. Per fortuna sei arrivato tu."])]]),
      "so_anello:Q": () => say([["so_nonna", "Settore B, gravità invertita. L'ho fatto io, sai? Per i tubi dell'acqua. Ma poi a Quattrobraccia è piaciuto e l'ho lasciato così. Le nonne viziano."]]),
      "so_hangar:E": () => { K.learnLore("l_cart1", true); K.cartolina("so_hangar", "Incastrata nella grata, una cartolina: «Saluti da Borgo Marino! Qui il mare è bagnato e il pallone cade sempre. Mi manchi». Nessun nome. Il francobollo è di vent'anni fa."); },
      "so_hangar:>": () => go("so_anello", 2, 6), "so_anello:<": () => go("so_hangar", 31, 9), "so_anello:>": () => go("so_palestra", 2, 8), "so_palestra:<": () => go("so_anello", 41, 6),
      "so_palestra:Z": (o) => {
        const k = `so_ball_so_palestra_${o.tx}_${o.ty}`; if (F.is(k)) return done();
        F.set(k, true); K.SFX.ding(); const n = K.ballsTaken("so_palestra");
        if (n >= 3 && S() === 2) return say([["voce", "Afferri il terzo pallone. Anzi, lui afferra te: ruotate insieme per un po', come due pianeti che si sono appena conosciuti."], ["voce", "Dalla porta della palestra entrano otto robot di manutenzione, in fila, con le magliette grigie. Il primo alza un braccio: «BIP. Siamo I Bulloni»."]], () => { K.refreshZone(); done(); });
        return say([["voce", n >= 3 ? "Hai preso tutti i palloni. Galleggiano intorno a te in fila, come anatroccoli." : `Afferri un pallone che gira su se stesso. Ti porta con sé per un metro, poi si arrende. Palloni presi: ${n} su 3.`]]);
      },
    };
    return { n: N, title: "Benvenuto a bordo", sub: "L'hangar, l'Anello capovolto, la Palestra a gravità zero", goal, start: "so_hangar", introBg: "so_stazione", zones, talk, obj,
      intro: () => [["voce", "Stazione Orbitale 7. Quattrocento chilometri sopra la Terra, sei persone di equipaggio, un robot arbitro, un cuoco gelatinoso e un computer di bordo con la voce di una nonna."], ["voce", "Detiene un solo primato: la stazione più noiosa della galassia. E stamattina, con la navetta della domenica, arriva un passeggero: tu. Sul modulo di richiesta, alla voce «professione», qualcuno ha scritto: «esperto di calcio vero»."]] };
  }
  boot();
})();
