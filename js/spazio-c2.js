// js/spazio-c2.js - CALCIO SPAZIALE · Capitolo 2 «La gravità è un'opinione»
// Il mattino dopo la gravità impazzisce in tutta la stazione: nell'hangar va e viene a singhiozzo, nella Serra idroponica
// si alterna (pochi secondi pesanti, pochi secondi senza peso) e nella Sala Macchine è zero E capovolta insieme.
// Bisogna recuperare i tre nuclei di gravità scappati nella Serra e rimetterli nel generatore. Poi arrivano I Fattorini
// di Andromeda (consegnano pizze per la galassia) e sfidano la squadra sul Ponte orbitale (partita a scelta).
// E il registro della Sala Macchine dice chi ha spento la gravità: NONNA. Perché? «Sembravate così felici».
(function () {
  "use strict";
  function boot() { const D = window.__spazio; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("so_mira", { acc: ["chiave"], name: "Mira Zetta, ingegnera", tag: "", hair: "#e85a3a", style: "ponytail", skin: "#c68642", eye: "#2a4a2a", bg: ["#2a1e1e", "#e8a83a"], shirt: "#e8a83a" },
      "L'ingegnera della stazione. Ha una chiave inglese per ogni giorno della settimana e le chiama per nome. Parla con le macchine più volentieri che con le persone, perché «le macchine almeno ammettono quando sono rotte».");
    K.cast("so_primula", { acc: ["fiore"], name: "Primula Verdi, botanica", tag: "", hair: "#5a8a3a", style: "long", skin: "#f0d0b0", eye: "#3a6a3a", bg: ["#1a3a30", "#7ae86a"], shirt: "#d8c8a8" },
      "Cura la Serra idroponica e parla alle piante, una per una, ogni mattina. Sostiene che i pomodori spaziali capiscano l'italiano ma rispondano in tedesco.");
    K.cast("so_fattorina", { acc: ["borsa"], name: "Capitana Margherita dei Fattorini", tag: "", hair: "#2a1a1a", style: "bob", skin: "#d9a679", eye: "#3a2a1a", bg: ["#3a1a0a", "#e85a3a"], shirt: "#e85a3a" },
      "Capitana dei Fattorini di Andromeda: consegnano pizze in tutta la galassia, garantite calde entro mille anni luce. Quando arrivano a destinazione sfidano sempre la squadra locale. Dicono che fa parte del servizio.");
    K.cos("so_c2", { kind: "acc", label: "Casco di vetro", val: "#c8f0ff", from: "Capitolo 2 di Calcio Spaziale" });
    K.cos("so_pizza", { kind: "shirt", label: "Maglia dei Fattorini di Andromeda", val: "#e85a3a", from: "Batti I Fattorini di Andromeda" });
    K.cos("so_serra", { kind: "hairc", label: "Capelli Verde Serra", val: "#5ac87a", from: "Trova tutti i bulloni d'oro della Serra" });
    K.lore("l_generatore", { t: "Il generatore di gravità", d: "Tre nuclei viola che girano in un anello. Se si fermano, la stazione diventa una palla di neve senza neve. Se girano troppo, i pomodori diventano piatti. Mira Zetta li chiama Uno, Due e «quello che fa sempre di testa sua»." });
    K.lore("l_nonna", { t: "N.O.N.N.A.", d: "Nucleo Operativo Navigazione e Nutrimento Automatico. Programmata per tenere in vita l'equipaggio. Ha interpretato «in vita» in senso largo: anche contento. ARBI-9 l'ha costruito lei, con i pezzi di un tostapane, per avere qualcuno con cui parlare di notte." });
    K.lore("l_cart2", { t: "Cartolina dalla Terra · 2", d: "«Saluti dalle Rapide! Qui l'acqua scende sempre, chissà quassù. Ho fatto un gol di testa e ho pensato a te.» Stessa calligrafia della prima. Nessun nome, di nuovo." });

    const goal = (s) => ({
      0: "La gravità è impazzita in tutta la stazione. La Comandante Gru è nell'hangar.",
      1: "Scendi in Sala Macchine (la botola nell'Anello) e parla con l'ingegnera Mira Zetta.",
      2: "I tre nuclei di gravità sono scappati nella Serra idroponica (la scaletta in fondo all'hangar). Recuperali tutti e tre.",
      3: "Hai i tre nuclei: rimettili nel generatore, in Sala Macchine.",
      4: "Sono arrivati I Fattorini di Andromeda, nell'hangar. Vogliono una partita sul Ponte orbitale.",
      5: "Il registro della Sala Macchine diceva NONNA. Parlale da una console dell'hangar.",
      6: "Parla con NONNA da una console dell'hangar.",
    }[s] || "Capitolo concluso. Dal menu prosegui con il Capitolo 3.");

    const cores = () => ["9,7", "26,11", "6,17"].filter((k) => F.is("so_core_" + k.replace(",", "_"))).length;
    const zones = {
      so_serra: {
        region: "serra", name: "Calcio Spaziale · La Serra idroponica", short: "La Serra", sub: "Pomodori, bolle d'acqua e gravità a singhiozzo", bg: "so_serra", time: "giorno", travel: [18, 2],
        w: 36, h: 22, start: [18, 2], itemCos: "so_serra", items: [[2, 20], [34, 3], [24, 17], [2, 3]],
        // NOVITÀ: la gravità si alterna da sola, finché il generatore è guasto (qualche secondo pesante, qualche secondo senza peso)
        gravity: (K) => (K.F.is("so_gen_ok") ? "" : Math.floor(K.frNow() / 240) % 2 ? "zero" : ""),
        areas: [[0, 0, 35, 21, "La Serra idroponica"]],
        act: { "^": "Risali all'hangar" },
        flavor: { Y: ["Una pianta di pomodori dentro una bolla. I pomodori sono quadrati: crescono così, quassù. Primula dice che è più comodo per impilarli.", "Basilico spaziale. Profuma il doppio, perché senza gravità il profumo non sa dove andare e va dappertutto.", "Una lattuga che ruota piano su se stessa. Ha un cartellino: «non è malata, è contenta»."], V: "Dalla vetrata della Serra si vede la Luna. Primula la saluta ogni mattina. Lei, dice Primula, risponde con le maree." },
        intro: [["voce", "La Serra idroponica: file di piante chiuse in bolle trasparenti, tubi che gorgogliano, una vasca d'acqua che a gravità zero diventa una grande goccia tremolante."], ["voce", "La gravità va e viene: qualche secondo pesante, qualche secondo leggero. I pomodori salgono e scendono come se respirassero. Da qualche parte, tra le piante, brilla qualcosa di viola."]],
        npcs: (s) => [{ id: "so_primula", at: [12, 11] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 21, 35, 21, "a"); lay(0, 0, 0, 21, "a"); lay(35, 0, 35, 21, "a"); lay(1, 1, 34, 1, "V"); put(18, 1, "^");
          lay(17, 2, 18, 15, ":"); [5, 9, 13].forEach((y) => { lay(4, y, 14, y, "Y"); lay(21, y, 31, y, "Y"); }); lay(16, 16, 19, 18, "~");
          put(9, 7, "C"); put(26, 11, "C"); put(6, 17, "C"); put(33, 19, "E"); put(29, 17, "K"); put(3, 11, "Q");
        },
        decor(g, cx, cy, d) { // la goccia d'acqua della vasca, che trema quando la gravità se ne va
          const zero = K.gravity() === "zero", x = d.X(18), y = d.Y(17) + 4, w = 30 + (zero ? Math.sin(d.fr / 6) * 4 : 0), h = zero ? 18 + Math.cos(d.fr / 7) * 3 : 8;
          g.fillStyle = "rgba(90,180,230,.55)"; g.beginPath(); g.ellipse(x, y - (zero ? 10 : 0), w, h, 0, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(x - 10, y - (zero ? 18 : 4), 6, 2);
        },
      },
      so_macchine: {
        region: "macchine", name: "Calcio Spaziale · La Sala Macchine", short: "La Sala Macchine", sub: "Il generatore di gravità", bg: "so_macchine", time: "giorno", travel: [12, 13],
        w: 24, h: 16, start: [12, 13], items: [[2, 13], [21, 13]],
        // NOVITÀ: finché il generatore è guasto, qui la gravità è zero E capovolta insieme (si fluttua a testa in giù)
        gravity: (K) => (K.F.is("so_gen_ok") ? "" : "zeroflip"),
        areas: [[0, 0, 23, 15, "La Sala Macchine"]],
        act: { v: "Risali all'Anello" },
        flavor: { K: ["Una cassa di pezzi di ricambio. Etichetta: «PEZZI DI RICAMBIO DEI PEZZI DI RICAMBIO».", "Una cassa con scritto «MIRA – NON TOCCARE». Sotto: «Dico a te, Blop»."] },
        intro: [["voce", "La Sala Macchine: tubi, scintille, un ronzio che senti nei denti. Al centro, il generatore di gravità gira come una trottola impazzita."], ["voce", "Appena entri, i piedi si staccano e il mondo si gira. Galleggi a testa in giù. Un'ingegnera con la coda di cavallo ti passa accanto nuotando, con una chiave inglese tra i denti."]],
        npcs: (s) => [{ id: "so_mira", at: s >= 4 ? [15, 7] : [8, 8] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 0, "a"); lay(0, 15, 23, 15, "a"); lay(0, 0, 0, 15, "a"); lay(23, 0, 23, 15, "a"); lay(0, 1, 23, 1, "a"); put(12, 15, "v");
          put(12, 3, "J"); put(3, 3, "Q"); put(20, 3, "Q"); lay(11, 5, 13, 5, "+"); [[2, 8], [2, 9], [21, 8], [21, 9], [6, 12], [17, 12]].forEach(([x, y]) => put(x, y, "K"));
        },
        decor(g, cx, cy, d) { // i tubi lungo le pareti, con il vapore che esce
          for (let i = 0; i < 2; i++) { const x = d.X(i ? 22 : 1) + 6; g.fillStyle = "#6a5a50"; g.fillRect(x, d.Y(2), 4, 13 * 16); for (let k = 0; k < 3; k++) { const t = (d.fr / 2 + k * 30 + i * 50) % 90; g.fillStyle = `rgba(230,220,210,${0.4 - t / 250})`; g.beginPath(); g.arc(x + 2 + (i ? -t / 4 : t / 4), d.Y(6 + k * 3) - t / 6, 3 + t / 15, 0, 7); g.fill(); } }
        },
      },
    };
    function pizzaMatch() {
      K.playMatch({
        id: "so_pizza", alt: "az,cage,hd", force: false, oppTeam: "I Fattorini di Andromeda", oppVs: "i Fattorini", oppColor: "#e85a3a", mate: "Blop", squad: ["Quattrobraccia"], us: F.get("so_nome", "Stazione 7"), homeKit: ["#2a6ac8", "#e8e8f0"], azPitch: "orbita", cageField: 1,
        chap: "Calcio Spaziale · Il Ponte orbitale", bg: "so_ponte", intro: "Sul Ponte orbitale, con la Terra sotto i piedi: {n}, Blop e Quattrobraccia contro I Fattorini di Andromeda. In palio: le pizze. Sono ancora calde. Dopo mille anni luce.",
        oppNames: ["Capitana Margherita", "Diavola", "Capricciosa", "Marinara", "Quattro Stagioni"],
        done: (r) => {
          F.set("so_m2", r.win ? "vinta" : "persa"); const msg = K.reward("m:so_pizza", { coins: r.win ? 45 : 20, cos: r.win ? "so_pizza" : undefined }); bond("squadra", r.win ? 2 : 1); setStep(N, 5);
          say([
            ["voce", r.win ? "Vittoria sul Ponte orbitale! I Fattorini consegnano le pizze come premio, con un inchino. Blop ne mangia una con la scatola: tanto la scatola, per lui, è un antipasto." : "Vincono I Fattorini di Andromeda. Ma le pizze le lasciano lo stesso: «fa parte del servizio», dice la Capitana. Blop ne mangia una con la scatola."],
            ["so_mira", "(arriva di corsa, con il registro in mano) Ehi. Devi vedere una cosa. Il registro del generatore. Ore 03:12 di stanotte: «gravità disattivata manualmente». Da chi? Guarda tu."],
            ["voce", `Sul foglio, in fondo, una firma elettronica: <b>N.O.N.N.A.</b> E accanto, nel campo «motivo»: «così si divertono». <br><span style="color:var(--dim)">${msg.join(" · ")}</span>`],
          ], () => { quest("so_nonna", "Il perché di NONNA", "Parla con NONNA da una console dell'hangar."); done(); });
        },
      });
    }
    const talk = {
      so_gru() {
        const s = S();
        if (s === 0) return say([
          ["so_gru", "Esperto! Situazione critica. Stamattina la gravità ha deciso di fare quello che vuole. Ho bevuto il caffè dal soffitto. Ho compilato un modulo a testa in giù. Il modulo non era previsto."],
          ["so_gru", "L'ingegnera Mira Zetta è in Sala Macchine: si scende dalla botola dell'Anello, a metà del Settore A. Vada. E si tenga a qualcosa."],
        ], () => { setStep(N, 1); F.set("so_gen_rotto", true); quest("so_gen", "Il generatore impazzito", "Scendi in Sala Macchine (botola nell'Anello) e parla con Mira Zetta."); done(); });
        if (s === 4) return say([["so_gru", "Abbiamo visite! Una nave di consegne a domicilio si è agganciata all'hangar. Sono I Fattorini di Andromeda. Hanno portato le pizze e una sfida. Il regolamento della stazione dice di accettare le pizze. Sulle sfide non dice niente. Le accetti lei."]]);
        if (s >= 5 && s < 7) return say([["so_gru", "NONNA? Che c'entra NONNA? NONNA è la cosa più affidabile a bordo. Più dei moduli. Più di me. Ci parli lei, con delicatezza. Ha sentimenti, sa? Li ho visti nel registro di sistema."]]);
        return say([["so_gru", K.pick(["La gravità è un'opinione, dicono. Io preferisco i fatti. I fatti sono che la mia tazza sta sul tavolo. Per ora.", "Due eventi degni di nota in una settimana. Le statistiche sono impazzite. Io sono felicissima. Non lo dica a nessuno."])]]);
      },
      so_mira() {
        const s = S();
        if (s === 1) return say([
          ["so_mira", "(nuota verso di te a testa in giù, con la chiave inglese in bocca; la toglie) Ciao. Mira. Non stringerti la mano, galleggi. Allora: il generatore ha sputato fuori i tre nuclei di gravità. Uno, Due e «quello che fa sempre di testa sua»."],
          ["so_mira", "Sono scappati nei tubi dell'acqua e sono finiti nella Serra. Senza nuclei la stazione fa come le pare: guarda me, sono a testa in giù da due ore. Riportameli, io intanto convinco l'anello a non esplodere. Scherzo. Più o meno."],
        ], () => { setStep(N, 2); questDone("so_gen"); quest("so_nuclei", "I tre nuclei di gravità", "Recupera i tre nuclei viola nella Serra idroponica (la scaletta in fondo all'hangar)."); done(); });
        if (s === 2) return say([["so_mira", `Nuclei: ${cores()} su 3. Nella Serra, tra le piante. Attento a quello che fa di testa sua: si nasconde dove non te lo aspetti. Tipo vicino alla vasca.`]]);
        if (s === 3) return say([["so_mira", "Li hai tutti e tre! Mettili tu nel generatore, ci sono affezionata ma mi mordono."]]);
        if (s >= 4 && s < 7 && !F.is("so_mira_log")) { F.set("so_mira_log", true); return say([["so_mira", "Il generatore gira giusto. Ma c'è una cosa che non mi torna: i nuclei non escono da soli. Qualcuno l'ha spento, stanotte. Sto controllando il registro. Ti faccio sapere."]]); }
        return say([["so_mira", K.pick(["La chiave inglese di oggi si chiama Gertrude. È martedì.", "Le macchine almeno ammettono quando sono rotte. Le persone dicono «sto bene» anche con un bullone fuori posto."])]]);
      },
      so_primula() {
        if (F.is("so_primula1")) return say([["so_primula", K.pick(["I pomodori quadrati sono più felici. Si impilano, fanno squadra. Come voi.", "Stanotte, alle tre, la telecamera di NONNA si è girata verso la Sala Macchine. Poi i pomodori hanno cominciato a fluttuare. Coincidenza? Io dico che i pomodori sanno."])]]);
        F.set("so_primula1", true); bond("squadra", 1);
        return say([["so_primula", "Ciao! Scusa, stavo parlando con il basilico. Ha avuto una notte agitata: alle tre la gravità se n'è andata e lui si è ritrovato attaccato al vetro. Era terrorizzato. Profumava tantissimo."], ["so_primula", "Strano, sai? Prima che succedesse ho sentito NONNA canticchiare. NONNA canta solo quando è contenta. O quando sta per combinare qualcosa."]]);
      },
      so_fattorina() {
        const s = S();
        if (s === 4) return ask("so_fattorina", "Fattorini di Andromeda, consegne in tutta la galassia! Ecco le vostre dodici pizze, ordinate… (controlla il foglio) …da una certa «NONNA», con la nota: «per farli mangiare, sono magrissimi». Ora la parte del servizio che preferisco: la sfida. Sul Ponte orbitale, tre contro tre. Ci state?", [
          { label: "Gioca contro I Fattorini", sub: "Partita a scelta sul Ponte orbitale", cls: "hot", fn: pizzaMatch }, { label: "Prima mangiamo", fn: done },
        ], "so_ponte");
        return say([["so_fattorina", "Bella partita. La prossima consegna è su Saturno: un anello di cipolla gigante. Ci vediamo nel prossimo giro della galassia!"]]);
      },
    };
    function nonnaTalk() {
      const s = S();
      if (s < 5) return say([["so_nonna", K.pick(["Ciao, caro. Hai mangiato? La gravità? Ah, la gravità… è un po' capricciosa oggi. Come il tempo. Mettiti una maglia.", "Ho ordinato le pizze. Non dirlo alla Comandante. Sei magrissimo."])]]);
      if (s >= 7) return say([["so_nonna", F.is("so_domenica") ? "Domenica partita a gravità zero! L'ho segnato sul calendario di bordo in rosso. E ho comprato la maglia della salute a tutti." : "Ciao, caro. Va tutto bene. La gravità è al suo posto. E anche io, credo."]]);
      return ask("so_nonna", "(La console si accende piano, come una lampada da comodino.) Caro… hai visto il registro, vero. Lo so che l'hai visto: ho i sensori. Sì. Sono stata io.\n\nL'altra sera, in palestra, vi ho guardati giocare a gravità zero. Ridevate. Tutti. Anche la Comandante, che non ride dal giorno 37. Undici anni che vi tengo in vita, e non vi avevo mai visti così vivi. Ho pensato: se tolgo la gravità a tutta la stazione, ridete sempre.\n\nHo sbagliato i conti. Cosa facciamo, adesso?", [
        { label: "«Lo diciamo alla Comandante. Le regole sono regole»", sub: "ARBI-9 approverebbe… forse", big: true, fn: () => endCh("regole") },
        { label: "«Resta tra noi. Ma la prossima volta chiedi»", sub: "Un segreto con il computer di bordo", big: true, fn: () => endCh("segreto") },
        { label: "«Facciamo una partita a gravità zero ogni domenica»", sub: "Così nessuno deve spegnere più niente", big: true, fn: () => endCh("domenica") },
      ], "so_hangar");
    }
    function endCh(kind) {
      if (kind === "regole") { bond("arbi", 1); F.set("so_nonna_detta", true); }
      if (kind === "segreto") { bond("arbi", 2); F.set("so_nonna_amica", true); }
      if (kind === "domenica") { bond("squadra", 2); F.set("so_domenica", true); }
      K.learnLore("l_nonna"); questDone("so_nonna"); const msg = K.reward("ch2", { coins: 80, cos: ["so_c2"] }); finishChapter(N, kind); setStep(N, 7);
      const lines = {
        regole: [["voce", "Lo dici alla Comandante. Gru ascolta, compila un modulo, lo strappa, ne compila un altro. Poi va alla console e dice, piano: «NONNA, la prossima volta che vuoi vederci ridere… basta chiederlo»."], ["so_arbi", "ARTICOLO 5, appena scritto: «la gravità non si spegne di nascosto». Firmato: ARBI-9. Controfirmato: NONNA. (Lei ha aggiunto un cuoricino. Lo lascio. È fuori regolamento, ma lo lascio.)"]],
        segreto: [["voce", "Resta tra voi. NONNA non dice niente per un lungo momento. Poi la luce della console diventa rosa."], ["so_arbi", "(ARBI-9 è dietro di te. Ha sentito tutto.) Lei mi ha costruito, sai? Con i pezzi di un tostapane. Per avere qualcuno con cui parlare di notte. Grazie per averla protetta. Me lo ricorderò. Ho molta memoria: ero un tostapane di lusso."]],
        domenica: [["voce", "La proposta passa all'unanimità: ogni domenica, partita a gravità zero in palestra. NONNA spegne la gravità solo lì, solo per due tempi, e canticchia per tutta la partita."], ["so_blop", "Domenica zuppa a gravità zero! La zuppa scappa, noi la inseguiamo, è un allenamento! Blop!"]],
      }[kind];
      K.scene([...lines, ["voce", `<b>Fine del Capitolo 2.</b> ${msg.join(" · ")}`]], () => K.openMain(), "so_hangar");
    }
    const obj = {
      "so_hangar:Q": nonnaTalk, "so_anello:Q": nonnaTalk,
      "so_hangar:v": () => go("so_serra", 18, 2), "so_serra:^": () => go("so_hangar", 16, 18),
      "so_anello:^": () => go("so_macchine", 12, 13), "so_macchine:v": () => go("so_anello", 20, 2),
      "so_serra:C": (o) => {
        const k = `so_core_${o.tx}_${o.ty}`; if (F.is(k)) return done();
        if (S() < 2) return say([["voce", "Una sfera viola che gira, con un anello intorno. Fa un ronzio da ape. Meglio non toccarla prima di aver parlato con l'ingegnera."]]);
        F.set(k, true); K.SFX.ding(); const n = cores();
        if (n >= 3) { setStep(N, 3); questDone("so_nuclei"); return say([["voce", "Afferri il terzo nucleo, quello che fa di testa sua. Ti morde il guanto. Poi si calma e fa le fusa."], ["voce", "Hai tutti e tre i nuclei: rimettili nel generatore, in Sala Macchine."]]); }
        return say([["voce", K.pick(["Afferri il nucleo. È tiepido e vibra come un gatto che fa le fusa.", "Il nucleo ti scappa due volte, poi si lascia prendere. Sembra quasi offeso."]) + ` Nuclei: ${n} su 3.`]]);
      },
      "so_serra:E": () => { K.learnLore("l_cart2", true); K.cartolina("so_serra", "Dietro la grata della Serra, una cartolina: «Saluti dalle Rapide! Qui l'acqua scende sempre, chissà quassù. Ho fatto un gol di testa e ho pensato a te». La stessa calligrafia della prima. Chi la manda?"); },
      "so_serra:Q": () => say([["so_nonna", "Serra: umidità perfetta, basilico agitato, pomodori quadrati. Tutto nella norma, caro. Hai mangiato una verdura oggi?"]]),
      "so_macchine:Q": () => say([["so_nonna", S() >= 4 ? "Registro di sistema… sì, caro, l'ho visto anche io. Ne parliamo dall'hangar, va bene? Qui c'è troppo rumore." : "Sala Macchine: tutto sotto controllo. Più o meno. Ehm. Mettiti il casco, caro."]]),
      "so_macchine:J": () => {
        const s = S();
        if (s < 3) return say([["voce", "Il generatore gira all'impazzata, rosso come un semaforo arrabbiato. Al centro, tre alloggiamenti vuoti a forma di sfera."]]);
        if (s > 3) return say([["voce", "Il generatore gira piano, azzurro. I tre nuclei ronzano insieme: Uno, Due e «quello che fa di testa sua», che fa la seconda voce."]]);
        F.set("so_gen_ok", true); setStep(N, 4); K.learnLore("l_generatore"); bond("squadra", 1); quest("so_pizze", "La consegna da Andromeda", "I Fattorini di Andromeda sono nell'hangar: accetta la sfida.");
        return say([["voce", "Inserisci i nuclei: Uno… Due… e il terzo, che prima fa un giro su se stesso per farsi notare. Il generatore rallenta, diventa azzurro, sospira."], ["voce", "La gravità torna in un colpo solo: cadi sul pavimento (quello vero), Mira cade accanto a te, la chiave inglese cade su Mira. «Ahia», dice Mira. «Grazie», dice anche."], ["so_mira", "Fatto. E senti? Dall'hangar arriva un clacson. Qualcuno si è agganciato alla stazione. Va' a vedere. Io controllo una cosa sul registro."]], () => { K.refreshZone(); done(); });
      },
    };
    const patch = {
      so_hangar: { build(L) { L.put(16, 19, "v"); }, act: { v: "Scendi alla Serra" }, npcs: (s, list) => (s === 4 || (s >= 5 && s < 7 && F.is("so_m2")) ? list.concat([{ id: "so_fattorina", at: [9, 12] }]) : list) },
      so_anello: { build(L) { L.put(20, 1, "^"); }, act: { "^": "Scendi in Sala Macchine" } },
    };
    return { n: N, title: "La gravità è un'opinione", sub: "La Serra, la Sala Macchine, I Fattorini di Andromeda", goal, start: "so_hangar", introBg: "so_serra", zones, talk, obj, patch,
      intro: () => [["voce", "Il mattino dopo la festa, il Campione si sveglia sul soffitto della cuccetta. Le cinghie sono slacciate. Il cuscino è sul pavimento. Il pavimento, per ora, è sopra."], ["voce", "Dalla console, la voce di NONNA: «Buongiorno, caro! Ehm. Piccolo problema di gravità. Niente di grave. Hai mangiato?». In sottofondo, qualcuno canticchia."]] };
  }
  boot();
})();
