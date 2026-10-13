// js/campetto-c3.js - DAL CAMPETTO AL MONDIALE · Capitolo 3 «Il Mondiale»
// La convocazione nella Nazionale giovanile. Il ritiro, il compagno con cui si fanno i passaggi d'oro, un girone, e la finale
// del Mondiale contro Nordavia e il suo capitano, il Barone, che non ha mai perso una finale.
// Finali: CAMPIONI DEL MONDO · IL LEONE IN SQUADRA · RITORNO AL CAMPETTO · (segreto) IL PALLONE È UN AMICO.
(function () {
  "use strict";
  function boot() { const D = window.__campetto; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, go, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cast("cm_ct", { acc: ["fischietto", "taccuino"], name: "Mister Adele Ferri", tag: "", hair: "#3a3a3a", style: "bob", skin: "#e0b890", eye: "#2a3a5a", bg: ["#0e1628", "#1f5fbf"], shirt: "#1f2a4a" },
      "La commissaria tecnica della Nazionale giovanile. Ha visto giocare Bastiano Loi dal vivo, da bambina, e ha deciso quel giorno di fare l'allenatrice. Non urla mai: scrive tutto su un taccuino, e quando lo chiude la decisione è presa.");
    K.cast("cm_dario", { name: "Dario Vento", tag: "", hair: "#c87a3a", style: "side", skin: "#f0d0b0", eye: "#3a6a5a", bg: ["#0e1628", "#7ad8a8"], shirt: "#1f5fbf", num: "8" },
      "Il centrocampista della Nazionale. Ha giocato in otto città diverse, perché il padre è un pittore che non sta mai fermo. Dice che in ogni città ha imparato un passaggio. Ne conosce otto. Il nono lo vuole inventare con te.");
    K.cast("cm_barone", { acc: ["fascia"], name: "Il Barone, capitano di Nordavia", tag: "", hair: "#f0e0a0", style: "slick", skin: "#f0e0d8", eye: "#3a6aa8", bg: ["#0e1628", "#e8e8f0"], shirt: "#e8e8f0", num: "10" },
      "Il capitano di Nordavia. Lo chiamano il Barone perché cammina in campo come in un salone da ballo. Non ha mai perso una finale. Quando tira il Fuoco del Nord, dicono, il pallone diventa blu.");
    K.cos("cm_c3", { kind: "acc", label: "Coppa del Mondiale giovanile", val: "corona", from: "Completa Dal Campetto al Mondiale" });
    K.cos("cm_mondiale", { kind: "shirt", label: "Maglia della Nazionale col numero dieci", val: "#1f5fbf", from: "Finale «Campioni del mondo»" });
    K.cos("cm_leone", { kind: "hairc", label: "Capelli Criniera", val: "#c8641a", from: "Finale «Il Leone in squadra»" });
    K.cos("cm_campetto", { kind: "acc", label: "Fischietto di Bastiano", val: "fischietto", from: "Finale «Ritorno al campetto»" });
    K.cos("cm_amico", { kind: "shirt", label: "Maglia dorata del pallone amico", val: "#ffd23f", from: "Finale segreto «Il pallone è un amico»" });
    K.cos("cm_palloni3", { kind: "hairc", label: "Capelli Azzurro Nazionale", val: "#3a7ad8", from: "Trova tutti i palloni firmati del ritiro" });
    K.lore("l_oro", { t: "La Combinazione d'Oro", d: "Due passaggi di prima tra te e Dario Vento, così veloci che il pallone sembra d'oro. Il tiro parte da solo. È il tiro speciale più forte: costa 45 di grinta." });
    const ITEMZ = ["cm_riva", "cm_provincia", "cm_ritiro"];
    function allBalls() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const allShots = () => ["aquila", "catapulta", "oro"].every((k) => F.is("cm_sp_" + k));
    const goal = (s) => ({
      0: "Sei stato convocato in Nazionale! Mister Ferri ti aspetta al centro del ritiro.",
      1: "Dario Vento, il numero otto, vuole provare un passaggio con te sul campo del ritiro.",
      2: "La partita del girone contro Solaria: Mister Ferri dà il via.",
      3: "La finale del Mondiale! Il pullman porta allo stadio: il Barone di Nordavia vi aspetta.",
      4: "Il Mondiale è finito. Bastiano è venuto fin qui: è a bordo campo.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    const zones = {
      cm_ritiro: {
        region: "stadio", name: "Dal Campetto al Mondiale · Il ritiro della Nazionale", short: "Il ritiro", sub: "Campi perfetti, una mensa enorme, e ventidue convocati", bg: "cm_ritiro", time: "giorno", travel: [15, 18],
        w: 30, h: 22, start: [15, 18], itemCos: "cm_palloni3", items: [[2, 2], [27, 2], [27, 19]],
        areas: [[17, 9, 27, 16, "Il campo del ritiro"], [0, 0, 29, 21, "Il ritiro della Nazionale"]],
        flavor: { t: "Un ulivo antico in mezzo ai campi perfetti. Lo hanno lasciato apposta: dicono che porti fortuna." },
        intro: [["voce", "Il ritiro della Nazionale giovanile: sei campi d'erba perfetta, un albergo con la piscina, una mensa dove ci si serve da soli. Il campetto di Riva Azzurra ci starebbe dentro dieci volte."], ["voce", "Sulla tua maglia blu c'è il numero dieci. Lo stesso di Bastiano, vent'anni fa."]],
        npcs: (s) => [{ id: "cm_ct", at: [14, 9] }, ...(s >= 1 ? [{ id: "cm_dario", at: [20, 12] }] : []), ...(F.is("cm_leone_amico") ? [{ id: "cm_leone", at: [10, 13] }] : []), { id: "cm_saverio", at: F.is("cm_rivale_saverio") ? [6, 9] : [6, 16] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(1, 18, 28, 19, ":"); lay(15, 6, 15, 17, ":"); lay(4, 11, 14, 11, ":");
          house(10, 1, 10, 5, { door: [15, 5], roof: "#1f5fbf", wall: "#f4f0e4", rr: 3, enter: "L'albergo del ritiro: corridoi silenziosi, una piscina, e una bacheca con le foto di tutte le Nazionali giovanili. In quella di vent'anni fa, in basso a destra, c'è un ragazzo con la barba già lunga: Bastiano Loi." });
          put(17, 12, "Q"); put(27, 12, "Q");
          [[3, 5], [26, 5], [3, 15], [12, 15]].forEach(([x, y]) => put(x, y, "t")); put(8, 18, "s");
        },
      },
      cm_stadio: {
        region: "stadio", name: "Dal Campetto al Mondiale · Lo stadio della finale", short: "Lo stadio della finale", sub: "Ottantamila posti, bandiere di ogni paese", bg: "cm_mondiale", time: "tramonto", travel: [15, 18],
        w: 30, h: 22, start: [15, 18],
        areas: [[0, 0, 29, 21, "Lo stadio della finale"]],
        flavor: { t: "Un pennone con la bandiera del Mondiale. Si sente il vento, e sotto il vento ottantamila persone." },
        intro: [["voce", "Lo stadio della finale: ottantamila posti, bandiere di ogni paese, un'erba così verde che sembra disegnata. Da qui, il campetto di Riva Azzurra sembra lontanissimo. Eppure, chiudendo gli occhi, si sente ancora l'odore del pesce."]],
        npcs: (s) => [...(s === 3 ? [{ id: "cm_barone", at: [15, 9] }] : []), ...(s >= 3 ? [{ id: "cm_ct", at: [10, 12] }] : []), ...(s >= 4 ? [{ id: "cm_bastiano", at: [19, 12] }, { id: "cm_rosa", at: [21, 14] }, { id: "cm_gino", at: [8, 15] }, { id: "cm_pio", at: [11, 16] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 21, 29, 21, "a"); lay(0, 0, 0, 21, "a"); lay(29, 0, 29, 21, "a");
          lay(2, 2, 27, 3, "a"); lay(1, 18, 28, 19, ":"); lay(15, 17, 15, 17, ":"); put(3, 10, "Q"); put(26, 10, "Q"); put(14, 19, "s");
        },
      },
    };
    function girone() { // la partita secondaria: la modalità la scegli tu
      K.playMatch({ id: "cm_solaria", alt: "az,cage,hd", force: false, oppTeam: "Solaria", oppColor: "#f0a020", mate: F.is("cm_leone_amico") ? "Leone Ruggeri" : "Dario Vento", squad: ["Saverio Muro", "Gino", "Dario Vento"], us: "La Nazionale", homeKit: ["#1f5fbf", "#ffffff"], chap: "Dal Campetto al Mondiale · Il girone contro Solaria", bg: "cm_ritiro", oppNames: ["Sole", "Raggio", "Meriggio", "Siesta", "Canicola"], intro: "La partita del girone: la Nazionale contro Solaria, che gioca piano piano e poi, all'improvviso, velocissima.",
        venue: { ads: [["MONDIALE GIOVANILE", "#1f5fbf"], ["SOLARIA", "#f0a020"], ["FORZA AZZURRI", "#ffffff"], ["RIVA AZZURRA TIFA", "#e83a3a"]], crowd: ["#1f5fbf", "#ffffff", "#f0a020", "#e83a3a", "#ffd23f"], ground: ["#2f9e55", "#34a95c"], line: "#ffffffcc", grid: "rgba(255,255,255,.05)", tint: "rgba(255,220,150,.08)", glow: "255,220,150", sky: ["#2a6ac8", "#f0c070"], fx: { spd: 1.05 } },
        done: (r) => {
          if (!r.win) return K.scene([["cm_ct", "[pensa] (Scrive sul taccuino.) Pareggio o sconfitta, si rigioca: il regolamento del girone ci concede la ripetizione. Concentrazione."]], () => K.enterZone("cm_ritiro"), "cm_ritiro");
          setStep(N, 3); bond("amicizia", 1);
          K.scene([["voce", "Vittoria nel girone. Poi i quarti, poi la semifinale, una dopo l'altra, come un sogno che corre più veloce di te. E una sera, sul pullman, Mister Ferri chiude il taccuino."], ["cm_ct", "[felice] Finale. Contro Nordavia. Contro il Barone. Domani."]], () => go("cm_stadio", 15, 18), "cm_ritiro");
        } });
    }
    function finale() {
      K.duello({ title: "Duello Cinematico · La finale del Mondiale contro Nordavia", us: "La Nazionale", usColor: "#1f5fbf", oppStyle: "pressing", minutes: 90, guts: 120,
        mates: [{ name: "Dario Vento" }, { name: F.is("cm_leone_amico") ? "Leone Ruggeri" : "Pio" }, { name: "Elio Ponte" }], keeperName: "Saverio Muro", keeperPow: 2,
        opp: { name: "Nordavia", color: "#e8e8f0", players: [{ name: "Il Barone", skin: "#f0e0d8", hair: "#f0e0a0", pow: 15 }, { name: "Gelo", skin: "#f0d8d0", hair: "#c8d8e8", pow: 13 }, { name: "Fiordo", skin: "#e8d0c0", hair: "#8a6a3a", pow: 13 }], keeper: { name: "Il Muro di Nordavia", pow: 17 }, ace: { name: "Il Barone", special: "Fuoco del Nord" } },
        intro: `<p>La finale del Mondiale. Il Barone tira il <b>Fuoco del Nord</b>: fermalo prima che arrivi in area. In porta c'è Saverio Muro, il tuo vecchio rivale. Hai ${K.learned().length} tiri speciali e un po' di grinta in più, per la finale.</p>`, winTitle: "CAMPIONI DEL MONDO!" }, (r) => {
        if (!r.win) return K.scene([["cm_barone", "[pensa] Bella partita. Ma le finali le vince Nordavia. (Ti porge la mano.) Il regolamento vuole la ripetizione, se il campo è bagnato. Il campo, guarda caso, è bagnato."]], () => K.enterZone("cm_stadio"), "cm_mondiale");
        setStep(N, 4); bond("sogno", 3); F.set("cm_campioni", true);
        K.scene([["voce", "L'ultimo duello. Il pallone sale, si ferma un attimo nel cielo della finale, e piomba giù. Ottantamila persone trattengono il fiato. Poi la rete si gonfia."], ["cm_barone", "[sorpreso] (Si siede sull'erba, per la prima volta in vita sua.) …Un'aquila. In una finale. Chi ti ha insegnato?"], ["voce", "Dalla tribuna, in fondo, qualcuno con la barba bianca si alza in piedi e non si siede più."]], () => K.enterZone("cm_stadio"), "cm_mondiale");
      });
    }
    function endingAsk() {
      const opts = [{ label: "Alza la coppa", sub: "Campioni del mondo", big: true, fn: () => ending("mondiale") }];
      if (F.is("cm_leone_amico")) opts.push({ label: "«Leone, alziamola insieme»", sub: "Il Leone in squadra", big: true, fn: () => ending("leone") });
      if (K.stat("amicizia") >= 6) opts.push({ label: "«Bastiano, torniamo al campetto»", sub: "Ritorno al campetto", big: true, fn: () => ending("campetto") });
      if (allShots() && allBalls() && !F.is("cm_lasciato")) opts.unshift({ label: "Prendi il pallone della finale e palleggia, da solo…", sub: "Segreto: tutti i tiri, tutti i palloni firmati, nessuna partita lasciata", cls: "hot", big: true, fn: () => ending("amico") });
      ask("cm_bastiano", "(Ha la coppa in mano: te l'ha portata lui, dal palco, scavalcando tre guardie.) Campione del mondo. Dal campetto di terra dietro la pescheria. (La voce gli trema.) E adesso, numero dieci?", opts, "cm_mondiale");
    }
    function ending(kind) {
      const R = { mondiale: { coins: 120, cos: ["cm_c3", "cm_mondiale"] }, leone: { coins: 140, cos: ["cm_c3", "cm_leone"] }, campetto: { coins: 140, cos: ["cm_c3", "cm_campetto"] }, amico: { coins: 250, cos: ["cm_c3", "cm_amico"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        mondiale: [["voce", "Alzi la coppa. Ottantamila persone urlano il tuo nome, sbagliandolo un po'. Non importa."], ["cm_bastiano", "[ride] Vent'anni fa ho smesso di sognare. Oggi ho ricominciato. Per colpa tua."], ["voce", "<b>FINALE · CAMPIONI DEL MONDO.</b> Riva Azzurra fa una festa che dura tre giorni. Rosa regala acciughe a tutto il paese. La foto ingiallita di Bastiano, in pescheria, ha una compagna: la tua."]],
        leone: [["cm_leone", "[sorpreso] Insieme? (Prende un manico della coppa. Tu prendi l'altro.) Il tuo tiro sale, il mio va dritto. Insieme fanno un angolo. Pio aveva ragione."], ["voce", "<b>FINALE · IL LEONE IN SQUADRA.</b> Il rivale di sempre, il compagno di sempre. Da quel giorno, in Nazionale, l'aquila e il leone giocano dalla stessa parte. I portieri di tutto il mondo dormono un po' meno."]],
        campetto: [["voce", "Torni a Riva Azzurra col primo traghetto. Al campetto, dietro la pescheria, ci sono undici bambini e un pallone sgonfio. Ti guardano come tu guardavi Bastiano."], ["cm_bastiano", "[felice] (Ti lancia il fischietto.) Tocca a te, adesso. Io ho una rete da riparare."], ["voce", "<b>FINALE · RITORNO AL CAMPETTO.</b> La coppa sta su una mensola della pescheria, accanto alle acciughe. Il campetto ha un allenatore nuovo. Il tiro dell'aquila, un nuovo allievo."]],
        amico: [["voce", "Lo stadio si svuota. Restano i riflettori, l'erba, e un pallone. Palleggi da solo: uno, dieci, cento. Il pallone non cade mai."], ["cm_bastiano", "[ride] (Dalla tribuna vuota.) Te l'avevo detto, no? Il pallone è un amico. Se non lo tradisci, non ti tradisce."], ["voce", "<b>FINALE SEGRETO · IL PALLONE È UN AMICO.</b> Hai imparato tutti i tiri, trovato tutti i palloni firmati, e non hai mai lasciato una partita a metà. Il sogno era grande. Il pallone, di più."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "cm_mondiale");
    }
    const talk = {
      cm_ct() {
        const s = S();
        if (s === 0) return say([["cm_ct", "[pensa] (Apre il taccuino.) Ti ho visto al Torneo delle Province. Il tiro che sale. (Lo chiude.) Sei convocato. Numero dieci."], ["cm_ct", "[furbo] C'è uno, nella squadra, che ti cerca da quando è arrivato. Dario Vento, il numero otto. Dice che ha un passaggio da inventare con te."]], () => { setStep(N, 1); F.set("cm_nazionale", true); quest("cm_mondiale", "Il Mondiale", "Dario Vento sul campo del ritiro, poi il girone, poi la finale."); done(); });
        if (s === 2) return ask("cm_ct", "Il girone. Solaria: gioca piano, piano, piano, e poi velocissima. Pronti?", [{ label: "Gioca la partita del girone", sub: "Partita secondaria · scegli tu la modalità", big: true, fn: girone }, { label: "Non ancora", fn: done }], "cm_ritiro");
        return say([["cm_ct", s === 1 ? "Dario Vento ti aspetta al campo." : s >= 3 ? "(Chiude il taccuino.) Domani è la finale. Dormite. Io no." : "Testa alta."]]);
      },
      cm_dario() {
        if (S() === 1) return ask("cm_dario", "[felice] Il numero dieci del campetto! Ho imparato otto passaggi in otto città. Il nono lo voglio inventare con te: io te la passo, tu me la ripassi di prima, io di prima, e poi tiri. Così veloce che il pallone diventa d'oro. Proviamo?", [{ label: "Prova la Combinazione d'Oro", sub: "Allenamento", cls: "hot", fn: oro }, { label: "Non ancora", fn: done }], "cm_ritiro");
        return say([["cm_dario", F.is("cm_sp_oro") ? "[ride] Il nono passaggio! Lo chiameranno così, vedrai. O «la Combinazione d'Oro». Mi piace di più." : "Otto passaggi, otto città."]]);
      },
      cm_barone() {
        if (S() === 3) return ask("cm_barone", "(Una mano dietro la schiena, come un principe.) Il numero dieci di… Riva Azzurra. Non conosco. (Sorride.) Nordavia non ha mai perso una finale. Non comincerà oggi.\n\nScendiamo in campo?", [{ label: "Gioca la finale del Mondiale", sub: "Duello Cinematico · il Fuoco del Nord", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "cm_mondiale");
        return say([["cm_barone", "Le finali, di solito, le vinciamo noi."]]);
      },
      cm_bastiano() { if (S() === 4) return endingAsk(); return say([["cm_bastiano", "[ride] Testa alta. E il pallone è un amico."]]); },
      cm_leone() { return say([["cm_leone", S() >= 4 ? "[felice] Campioni. (Non sorride. Poi sì.)" : "Dritto. Sempre. Ma stavolta, dalla stessa parte."]]); },
      cm_saverio() { return say([["cm_saverio", F.is("cm_rivale_saverio") ? "[ride] Sono il portiere della Nazionale. Tu sei l'unico che mi ha segnato. Da oggi tiri contro gli altri, eh." : "Portiere della Nazionale. Imbattuto. Quasi."]]); },
      cm_rosa() { return say([["cm_rosa", "[felice] Ho preso il treno, il traghetto e due pullman! E ho portato le acciughe. Per tutta la Nazionale."]]); },
      cm_gino() { return say([["cm_gino", "[ride] Abbiamo fatto il tifo dalla curva! Pio ha disegnato tutta la finale sul quaderno. Dice che 2 a 1 era previsto."]]); },
      cm_pio() { return say([["cm_pio", "Geometria. Te l'avevo detto."]]); },
    };
    function oro() {
      K.allena({ title: "La Combinazione d'Oro", sub: "Dario te la passa, tu la ripassi di prima, lui di prima, e tiri. Tre volte di fila, senza sbagliare il tempo.", hard: true }, (ok) => {
        if (!ok) return say([["cm_dario", "Quasi! In ogni città ci ho messo una settimana. Riproviamo quando vuoi."]]);
        F.set("cm_sp_oro", true); K.learnLore("l_oro"); bond("amicizia", 1); setStep(N, 2);
        K.scene([["voce", "Passaggio. Di prima. Di prima. Tiro. Il pallone attraversa il campo del ritiro così veloce che lascia una scia dorata, e si ferma nell'angolo alto."], ["cm_dario", "[felice] Il nono passaggio! Mister, ha visto? Ha visto?"], ["cm_ct", "[sorpreso] (Apre il taccuino. Scrive una parola sola. Lo chiude.)"]], done, "cm_ritiro");
      });
    }
    const obj = {};
    return { n: N, title: "Il Mondiale", sub: "La Nazionale, la Combinazione d'Oro, il Barone di Nordavia", goal, start: "cm_ritiro", introBg: "cm_ritiro", zones, talk, obj,
      intro: () => [["voce", "<b>DAL CAMPETTO AL MONDIALE</b>, puntata 3. Una lettera con lo stemma della Federazione arriva alla pescheria di Rosa, perché nessuno sapeva il tuo indirizzo. Dentro c'è una parola sola: «Convocato»."]] };
  }
  boot();
})();
