// js/campetto-c1.js - DAL CAMPETTO AL MONDIALE · Capitolo 1 «Il campetto di Riva Azzurra»
// Dietro la pescheria c'è un campetto di terra. Ci gioca chiunque, la sera, finché c'è luce. Un signore che ripara reti da
// pesca guarda le partite senza dire niente: si chiama Bastiano Loi, e vent'anni fa giocava in Nazionale. Oggi ti guarda tirare.
(function () {
  "use strict";
  function boot() { const D = window.__campetto; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("cm_bastiano", { beard: "incolta", acc: ["fischietto"], name: "Bastiano Loi", tag: "gray", hair: "#c8c8c8", style: "messy", skin: "#c68642", eye: "#2a2a2a", bg: ["#0e1628", "#1f5fbf"], shirt: "#1f5fbf" },
      "Vent'anni fa era il numero dieci della Nazionale: in una sola partita segnò tre gol con un tiro che nessuno sapeva rifare. Poi tornò a Riva Azzurra, comprò una barca e smise di parlare di calcio. Ripara reti da pesca. Guarda tutte le partite del campetto.");
    K.cast("cm_saverio", { acc: ["guanti"], name: "Saverio Muro", tag: "", hair: "#1a1a1a", style: "slick", skin: "#e8c4a0", eye: "#3a3a3a", cap: "#c83a3a", bg: ["#0e1628", "#c83a3a"], shirt: "#c83a3a" },
      "Il portiere del Collegio San Marco. Non ha mai preso un gol in partita: dice che è perché para tutto, i suoi compagni dicono che è perché nessuno ha il coraggio di tirargli. Porta sempre il cappellino rosso, anche di notte.");
    K.cast("cm_gino", { name: "Gino Scoglio", tag: "", hair: "#5a3a1a", style: "buzz", skin: "#d9a679", eye: "#3a2a1a", bg: ["#0e1628", "#3a8a5a"], shirt: "#3a8a5a" },
      "Il terzino del campetto: corre tantissimo, tira malissimo, e non si arrende mai. Lavora alla pescheria della mamma, e profuma sempre un po' di acciughe.");
    K.cast("cm_pio", { acc: ["occhiali"], name: "Pio Bonsanti", tag: "", hair: "#c8a040", style: "side", skin: "#f0d0b0", eye: "#3a5a8a", bg: ["#0e1628", "#e8c84a"], shirt: "#e8c84a" },
      "Il regista del campetto. Con gli occhiali vede il campo come una scacchiera, e i passaggi li disegna prima sul quaderno. Sostiene che il calcio è geometria. Poi sbaglia lo stop.");
    K.cast("cm_rosa", { acc: ["grembiule"], name: "Rosa della pescheria", tag: "", hair: "#8a2a1a", style: "bun", skin: "#e0b890", eye: "#3a2a1a", bg: ["#0e1628", "#e83a3a"], shirt: "#e83a3a" },
      "La pescivendola di Riva Azzurra, e la mamma di Gino. Ha visto giocare Bastiano in Nazionale, una volta, alla televisione del bar. Da allora tifa per chiunque giochi al campetto.");
    K.cos("cm_c1", { kind: "shirt", label: "Maglia del campetto di Riva Azzurra", val: "#1f5fbf", from: "Capitolo 1 di Dal Campetto al Mondiale" });
    K.cos("cm_palloni1", { kind: "acc", label: "Pallone firmato da Bastiano", val: "medaglia", from: "Trova tutti i palloni firmati di Riva Azzurra" });
    K.lore("l_aquila", { t: "Il Tiro dell'Aquila", d: "Il tiro di Bastiano Loi: sale dritto, si ferma un attimo in cielo e poi piomba giù, come un'aquila sul pesce. Costa tanta grinta. Nel Duello Cinematico si usa vicino alla porta." });
    K.lore("l_duello", { t: "Il Duello Cinematico", d: "Al campetto le partite si giocano a duelli: quando hai palla, uno ti viene incontro e devi scegliere. Dribbling, passaggio, uno-due, tiro. Quando l'hanno loro, indovina cosa faranno: il contrasto ferma chi dribbla, l'anticipo chi passa." });
    const team = () => ["cm_team_gino", "cm_team_pio"].filter((k) => F.is(k)).length;
    const goal = (s) => ({
      0: "Al campetto, dietro la pescheria, c'è un signore che ripara reti da pesca. Lo chiamano Bastiano.",
      1: `Per giocare serve una squadra (${team()}/2): Gino alla pescheria, Pio sulla panchina del molo.`,
      2: "Il Collegio San Marco è arrivato al campetto. Il loro portiere, Saverio, ti aspetta in porta.",
      3: "Hai segnato a Saverio Muro. Bastiano vuole parlarti.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      cm_riva: {
        region: "riva", name: "Dal Campetto al Mondiale · Riva Azzurra", short: "Riva Azzurra", sub: "Il paese di mare e il campetto dietro la pescheria", bg: "cm_riva", time: "tramonto", travel: [16, 19],
        w: 34, h: 24, start: [16, 19], itemCos: "cm_palloni1", items: [[2, 3], [31, 2], [30, 21]],
        areas: [[18, 4, 31, 13, "Il campetto"], [0, 0, 33, 23, "Riva Azzurra"]],
        flavor: { t: "Un pino marittimo, storto dal vento. Ci si appendono le giacche durante le partite." },
        intro: [["voce", "Riva Azzurra: case bianche, barche colorate, l'odore del pesce e del sale. Dietro la pescheria c'è un campetto di terra battuta, con due porte di ferro e le righe tracciate col gesso. La sera ci gioca chiunque."], ["voce", "Su una cassetta di legno, a bordo campo, un signore con la barba bianca ripara una rete da pesca. Non alza gli occhi. Ma quando il pallone rotola fino a lui, lo ferma col piede senza guardarlo."]],
        npcs: (s) => [{ id: "cm_bastiano", at: [17, 9] }, { id: "cm_rosa", at: [7, 9] }, ...(s <= 1 && !F.is("cm_team_gino") ? [{ id: "cm_gino", at: [9, 10] }] : F.is("cm_team_gino") ? [{ id: "cm_gino", at: [22, 11] }] : []), { id: "cm_pio", at: F.is("cm_team_pio") ? [27, 11] : [12, 19] }, ...(s >= 2 && s <= 3 ? [{ id: "cm_saverio", at: [30, 8] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(0, 0, 0, 23, "t"); lay(33, 0, 33, 23, "t"); lay(0, 23, 33, 23, "w"); lay(0, 22, 33, 22, "w");
          lay(1, 20, 32, 21, ":"); lay(16, 12, 16, 19, ":"); lay(4, 13, 15, 13, ":");
          lay(18, 4, 31, 13, ":"); put(18, 8, "Q"); put(30, 8, "Q");
          house(3, 4, 8, 4, { door: [7, 7], roof: "#e83a3a", wall: "#f4f0e4", rr: 2, enter: "La pescheria di Rosa: cassette di ghiaccio, acciughe d'argento, un orologio a forma di pesce. Dietro il bancone, appesa al muro, una foto di giornale: «Loi, tripletta in Nazionale!». È ingiallita, ma qualcuno la spolvera ogni giorno." });
          house(4, 15, 6, 3, { door: [7, 17], roof: "#2a6ac8", wall: "#f4f0e4", rr: 2, enter: "La casa di Bastiano: una stanza sola, una barca in cortile, nessun trofeo in vista. Sotto il letto, però, sporge una scatola con scritto «NAZIONALE». È chiusa con lo spago da pesca." });
          [[2, 10], [14, 3], [32, 15], [12, 15], [24, 17]].forEach(([x, y]) => put(x, y, "t")); put(14, 19, "s"); put(20, 17, "s");
        },
      },
    };
    function match() {
      K.duello({ title: "Duello Cinematico · Il campetto contro il Collegio San Marco", us: "Il campetto", oppStyle: "difensiva", minutes: 60,
        mates: [{ name: "Gino" }, { name: "Pio" }], opp: { name: "Collegio San Marco", color: "#c83a3a", players: [{ name: "Il Capitano", skin: "#e8c4a0", hair: "#3a2a1a", pow: 10 }, { name: "Il Mediano", skin: "#d9a679", hair: "#1a1a1a", pow: 10 }, { name: "Il Libero", skin: "#f0d0b0", hair: "#5a3a1a", pow: 11 }], keeper: { name: "Saverio Muro", pow: 16 } },
        intro: "<p>Saverio Muro non ha mai preso un gol. Avvicinati alla porta prima di tirare: da lontano non passa niente. E tieni la grinta per il <b>Tiro dell'Aquila</b>.</p>", winTitle: "GOL A SAVERIO MURO!" }, (r) => {
        if (!r.win) return K.scene([["cm_saverio", r.a > 0 ? "[sorpreso] Mi hai… segnato. (Si sistema il cappellino.) Ma abbiamo vinto noi. Domani si rigioca: il primo gol non conta, si dice al Collegio." : "[furbo] Imbattuto. Come sempre. (Si sistema il cappellino.) Torna quando il tuo tiro sale un po' di più."]], () => K.enterZone("cm_riva"), "cm_campetto");
        setStep(N, 3); K.learnLore("l_duello"); bond("sogno", 2);
        K.scene([["voce", "Fischio finale. Saverio Muro resta seduto in porta, a guardare il pallone dentro la rete come se fosse un animale strano."], ["cm_saverio", "[sorpreso] …È entrato. È entrato davvero. (Si toglie il cappellino, per la prima volta.) Come si chiama quel tiro?"], ["voce", "A bordo campo, Bastiano ha smesso di riparare la rete."]], () => K.enterZone("cm_riva"), "cm_campetto");
      });
    }
    const talk = {
      cm_bastiano() {
        const s = S();
        if (s === 0) return ask("cm_bastiano", "(Non alza gli occhi dalla rete.) Tiri forte. Tiri dritto. Il portiere, però, sa sempre dove andrà il pallone. (Un nodo, un altro.) Il tiro buono è quello che il portiere non capisce.\n\nVuoi che te lo insegni? Ti avverto: si impara sbagliando. Tanto.", [
          { label: "«Insegnamelo»", sub: "Allenamento · il Tiro dell'Aquila", cls: "hot", fn: train }, { label: "Non ancora", fn: done }], "cm_campetto");
        if (s === 3) return ask("cm_bastiano", "(Ha posato la rete. Ti guarda, finalmente.) Hai segnato a uno che non aveva mai preso gol. Con il mio tiro. (Silenzio.) Vent'anni fa ho smesso di sognare. Tu cosa sogni?", [
          { label: "«Il Mondiale»", sub: "Il sogno più grande", big: true, fn: () => fine1("mondiale") },
          { label: "«Prima, battere di nuovo Saverio»", sub: "Un rivale vero", big: true, fn: () => fine1("rivale") },
        ], "cm_campetto");
        return say([["cm_bastiano", s >= 4 ? "[ride] Testa alta, ragazzo. E il pallone è un amico." : s === 1 ? "Un tiro da solo non basta. Ti serve una squadra. Gino e Pio non aspettano altro, anche se fanno finta di no." : "Il portiere col cappellino rosso. Fagli vedere l'aquila."]]);
      },
      cm_gino() {
        if (S() === 1 && !F.is("cm_team_gino")) return say([["cm_gino", "[sorpreso] Una squadra? Per giocare contro il Collegio San Marco? (Si pulisce le mani sul grembiule.) Mamma, posso? …Ha detto sì! Ha detto anche di portare a casa le acciughe, dopo. Ci sto!"]], () => { F.set("cm_team_gino", true); bond("amicizia", 1); check(); });
        return say([["cm_gino", F.is("cm_team_gino") ? "[ride] Io corro, tu tiri. È un buon accordo, no?" : "Le acciughe non si vendono da sole. Però la sera gioco, eh."]]);
      },
      cm_pio() {
        if (S() === 1 && !F.is("cm_team_pio")) return ask("cm_pio", "(Ti mostra il quaderno: frecce, cerchi, triangoli.) Ho già disegnato la partita contro il Collegio. Vinciamo 3 a 2. Però mi manca il numero dieci. Sei tu?", [
          { label: "«Sono io»", fn: () => say([["cm_pio", "[felice] Perfetto. Allora adesso vinciamo 4 a 2. (Corregge il quaderno.)"]], () => { F.set("cm_team_pio", true); bond("amicizia", 1); check(); }) },
          { label: "«Il quaderno lo teniamo per la ripresa»", fn: () => say([["cm_pio", "[ride] La ripresa! Non ci avevo pensato. Ci sto, ci sto."]], () => { F.set("cm_team_pio", true); bond("amicizia", 2); check(); }) },
        ], "cm_riva");
        return say([["cm_pio", F.is("cm_team_pio") ? "Triangolo, poi uno-due, poi tiro. Sulla carta è perfetto." : "Il calcio è geometria. Il resto è fortuna."]]);
      },
      cm_rosa() { return say([["cm_rosa", S() >= 3 ? "[felice] Ho sentito urlare fino alla pescheria! Il cappellino rosso ha preso gol? Stasera acciughe gratis per tutto il campetto!" : "Bastiano? Era il più forte di tutti. Poi un giorno è tornato e non ne ha più parlato. Ma guarda tutte le partite, eh. Tutte."]]); },
      cm_saverio() {
        if (S() === 2) return ask("cm_saverio", "(Cappellino rosso, guanti enormi, le braccia incrociate in porta.) Saverio Muro, Collegio San Marco. Mai preso un gol. Mai. Siete venuti a perdere, o a guardare?", [{ label: "Gioca contro il Collegio", sub: "Duello Cinematico", cls: "hot", fn: match }, { label: "Non ancora", fn: done }], "cm_campetto");
        return say([["cm_saverio", S() >= 3 ? "[pensa] Il prossimo non entra. Te lo prometto. (Sorride, quasi.)" : "Mai preso un gol."]]);
      },
    };
    function train() {
      K.allena({ title: "Il Tiro dell'Aquila", sub: "Bastiano: «Il piede sotto il pallone, al momento giusto». Ferma la lancetta nella zona dorata tre volte di fila." }, (ok) => {
        if (!ok) return say([["cm_bastiano", "Sbagliato. Bene. Si impara così. Torna quando vuoi: la rete la sto ancora riparando."]]);
        F.set("cm_sp_aquila", true); K.learnLore("l_aquila"); bond("sogno", 1); setStep(N, 1); quest("cm_squadra", "Una squadra per il campetto", "Gino alla pescheria, Pio sulla panchina del molo.");
        K.scene([["voce", "Il pallone sale dritto, sale ancora, si ferma un attimo nel cielo rosso del tramonto. Poi piomba giù, sotto la traversa. La rete di spago si gonfia."], ["cm_bastiano", "[sorpreso] (Lascia cadere l'ago.) …L'aquila. Vent'anni che non la vedevo. (Si schiarisce la voce.) Ora ti serve una squadra. Un tiro da solo non vince niente."]], done, "cm_campetto");
      });
    }
    function check() { if (team() >= 2 && S() === 1) { setStep(N, 2); questDone("cm_squadra"); K.refreshZone(); say([["voce", "La squadra del campetto è pronta. E proprio in quel momento, dal fondo della strada, arriva un pulmino blu con scritto «Collegio San Marco»."]]); } else done(); }
    function fine1(kind) {
      if (kind === "mondiale") bond("sogno", 2); else { F.set("cm_rivale_saverio", true); bond("amicizia", 1); }
      const msg = K.reward("c1:cm", { coins: 60, cos: ["cm_c1"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "mondiale" ? [["cm_bastiano", "[ride] Il Mondiale. (Ride, davvero, per la prima volta.) Da un campetto di terra dietro una pescheria. Mi piace. Allora si comincia dal Torneo delle Province."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il Torneo delle Province».`]]
        : [["cm_saverio", "[furbo] (Da lontano, mentre sale sul pulmino.) Ho sentito! Al Torneo delle Province, numero dieci. Io e te. Stavolta non entra."], ["cm_bastiano", "Un rivale vero è un regalo. Tienilo stretto."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il Torneo delle Province».`]], () => K.openMain(), "cm_campetto");
    }
    return { n: N, title: "Il campetto di Riva Azzurra", sub: "Bastiano Loi, il Tiro dell'Aquila, il portiere mai battuto", goal, start: "cm_riva", introBg: "cm_titolo", zones, talk,
      intro: () => [["voce", "<b>DAL CAMPETTO AL MONDIALE.</b> Puntata 1. Un paese di mare, un campetto di terra, un pallone. Tutti i grandi campioni sono partiti da un posto così. Quasi tutti, poi, se lo sono dimenticato."]] };
  }
  boot();
})();
