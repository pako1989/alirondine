// js/leo-c1.js - «L'ESTATE DEL MURO» · Capitolo 1: Il pallone sgonfio
// Inizio agosto, Borgo Marino. Leo vuole iscriversi al torneo estivo del porto: servono tre in squadra e un pallone che regga. Nico è già pazzo (Gatto Volante),
// Dario non vuole giocare, Ottavio ha la pompa, Gegè Spinola e i suoi Granchi non hanno mai perso. Zone: il Borgo d'agosto (36x24, due versioni: raccontata e vera) e casa Moretti (12x9).
(function () {
  "use strict";
  function boot() {
    const E = window.__leoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__leoH) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  // la mappa del Borgo, nelle due versioni (tell = come la racconta Leo)
  function buildBorgo(L, tell) {
    const { lay, put, house } = L;
    lay(0, 0, 35, 0, "t"); lay(0, 0, 0, 20, "t"); lay(35, 0, 35, 20, "t"); lay(0, 21, 35, 23, "w");
    lay(1, 10, 34, 12, ":"); lay(30, 16, 31, 22, "="); lay(5, 7, 5, 9, ":");
    house(3, 3, 6, 4, { door: [5, 6], roof: tell ? "#ef4444" : "#a8523a", wall: tell ? "#fde68a" : "#d8c8a8", chimney: true, enter: { to: "lm_casa", at: [6, 7] } });
    house(12, 2, 8, 5, { door: [15, 6], roof: tell ? "#f59e0b" : "#8a5a2b", wall: tell ? "#fff7ed" : "#e0d2b4", timber: tell ? null : "#8a6a40", lit: true, enter: tell ? "La Trattoria Moretti, la più famosa del mondo conosciuto. Dentro: il profumo, il fumo e papà che fa il fuoco con le mani." : "La Trattoria Moretti, chiusa fino alle sei. Dalla porta sul retro si sente papà che discute con una padella." });
    house(24, 3, 6, 4, { door: [26, 6], roof: tell ? "#38bdf8" : "#5a6a7a", wall: tell ? "#e0f2fe" : "#b8c0c8", enter: tell ? "Il cantiere navale: dentro costruiscono navi spaziali. Ufficialmente barche." : "Il cantiere navale. Una barca a metà, un cane che dorme sotto lo scafo e un cartello «Torno subito» da gennaio." });
    // campetto, spiaggia, muro del porto, molo
    lay(2, 14, 12, 18, "-"); [15, 16, 17].forEach((y) => { put(1, y, "g"); put(13, y, "g"); });
    [[17, 16], [20, 18], [23, 15]].forEach(([x, y]) => put(x, y, "O")); put(28, 18, "C"); put(29, 18, "C");
    lay(26, 14, 26, 19, "M"); put(4, 20, "N"); put(5, 20, "N"); put(28, 17, "K"); put(29, 17, "K"); put(20, 13, "n");
    [[10, 8], [22, 8], [34, 9], [2, 9]].forEach(([x, y]) => put(x, y, "t")); [[11, 9], [21, 9], [33, 9]].forEach(([x, y]) => put(x, y, "l")); put(8, 21, "N");
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__leoH(K), { say, done, wask } = H, N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("lm_c1", { kind: "acc", label: "Fascia da torneo", val: "fascia", from: "Capitolo 1 di L'Estate del Muro" });
    K.lore("l_muro", { t: "Il muro del porto", d: "Un muro basso, scrostato, sul lato est del Borgo. Ci si tira contro da una vita. Se il pallone torna dritto, sei pronto: lo dicono tutti, e nessuno ricorda chi l'ha detto per primo." });
    K.lore("l_granchi", { t: "I Granchi del porto", d: "La banda di ragazzi di Gegè Spinola: cappellini girati, passo di lato, mai battuti nel torneo estivo. Dicono che camminino così per non perdere il porto di vista." });
    const goal = (s) => ({ 0: "Cerca Nico: in giro per il campetto, a fare qualcosa di sbagliato con convinzione.", 1: "Serve un pallone che regga: chiedi una pompa a Ottavio, vicino al muro e alle casse di pesce (est).", 2: "Porta il pallone gonfio a Dario, al muro del porto: ci tira contro, da solo.", 3: "Iscrivi la squadra: parla con Gegè davanti al cartello del torneo (sulla strada, al centro).", 4: "Il capitolo si chiude." }[s] || "Il capitolo 1 è concluso.");
    function fin() {
      setStep(N, 4); F.set("lm_c1_done", true);
      const m = K.reward("lm_c1", { coins: 90, cos: "lm_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["lm_nico", "[felice] Siamo iscritti! Abbiamo un nome, tre giocatori e un pallone che respira. La stampa ci adorerà."],
        ["lm_dario", "[pensa] Va bene, piccolo. Giochiamo. Ma domani lavori in trattoria: papà ha detto che l'iscrizione la paghiamo noi."],
        ["voce", `<b>FINE DEL CAPITOLO 1 · «Il pallone sgonfio»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 2 ti aspetta: una trattoria piena, un turno in sala e una busta da coprire."]
      ]), () => K.openMain(), "lm_borgo");
    }
    function sorteggio() {
      say("lm_gege", H.v("Spinola! Capo dei Granchi, signore del porto, domatore di maree. E voi chi siete? Tre bambini e un pallone moscio.", "Spinola. Gegè. Capo dei Granchi. E voi siete quelli con il pallone che sembra una sogliola?"));
      say("lm_gege", "[furbo] Il torneo si gioca a sorteggio: chi pesca la pallina bianca sceglie il campo. Io pesco sempre la bianca. È un talento.");
      return wask("Gegè agita il sacchetto con due palline. Una è visibilmente più bianca dell'altra.", [
        { label: "✨ Sbirci nel sacchetto e peschi quella giusta", sub: "Il ricordo sarà più bello", big: true, w: { leggenda: 1 }, fn: () => { F.set("lm_baro", true); say("voce", H.v("Con un gesto da mago peschi la pallina bianca. Il pubblico applaude. Gli uccelli applaudono. Una balena applaude.", "Con le dita sudate sposti il sacchetto e peschi la bianca. Nessuno applaude. Ottavio, da lontano, alza un sopracciglio.")); say("lm_gege", "[sorpreso] La bianca? Tu? …Va bene. Ma ti tengo d'occhio, Moretti."); partita(); } },
        { label: "📓 Peschi a occhi chiusi e quello che esce, esce", sub: "Il ricordo sarà più vero", big: true, w: { verita: 1 }, fn: () => { F.set("lm_baro", false); say("voce", "Peschi a occhi chiusi. Esce la nera. Gegè sorride come un gatto davanti a una pescheria."); say("lm_gege", "[ride] Campo nostro, ragazzi. Vi lasciamo il sole in faccia, per cortesia."); partita(); } }
      ]);
    }
    function partita() {
      K.say(H.flush(), () => K.playMatch({
        id: "lm_granchi", alt: "az,cage,hd", force: false, oppTeam: "I Granchi del porto", oppColor: "#dc2626", mate: "Dario", squad: ["Dario", "Nico", "Tonino"], us: "La squadra dei Moretti", homeKit: ["#ff4d5a", "#ffd23f"],
        chap: "L'Estate del Muro · Granchi del porto", bg: "lm_borgo", oppNames: ["Gegè", "Chele", "Telina", "Il Cugino", "Il Bagnino"],
        intro: "Sulla sabbia del campetto, a mezzogiorno: tre contro tre contro tre granchi. Il pallone, per ora, regge.",
        done: (r) => {
          F.set("lm_c1_win", !!r.win);
          say("voce", r.win ? H.v("Fischio finale. Hai segnato un gol da sessanta metri, di tacco, controvento. Si dice ancora oggi.", "Fischio finale. Avete vinto 3 a 2, con un gol sporco di Nico che ha finto di tuffarsi e si è tuffato davvero.") : "Fischio finale. Avete perso, ma Gegè ha detto «non male» a bassa voce, e sul porto è un'onorificenza.");
          wask("È sera. Sulla pagina bianca del Diario devi scrivere com'è andata la giornata.", [
            { label: "✨ «È stata una giornata leggendaria»", sub: "Tieni il ricordo bello", big: true, w: { leggenda: 1 }, fn: () => { say("voce", "Scrivi: «Leo, Dario e Nico contro i Granchi. Il muro brillava.» Il muro, nel frattempo, si fa gli affari suoi."); fin(); } },
            { label: "📓 «È stata una giornata sudata e storta»", sub: "Scrivi la verità", big: true, w: { verita: 1 }, fn: () => { say("voce", "Scrivi: «Pallone sgonfio, scarpe bucate, Nico in un secchio.» È molto meno bello. È molto più tuo."); fin(); } }
          ]);
        }
      }));
    }
    const talk = {
      lm_nico() {
        if (K.rel.scene("lm_nico")) return;
        const s = S();
        if (s === 0) {
          say("lm_nico", H.v("Leo! Hai visto il Gatto Volante? Sono salito a nove metri. Un gabbiano mi ha chiesto l'autografo.", "Leo! Guarda il Gatto Volante! …Non guardare in basso, ho appena perso la scarpa nel secchio."));
          say("hero", "Nico, i gatti non volano.");
          say("lm_nico", "Appunto. Per questo è una tecnica segreta.");
          say("hero", "C'è il torneo del porto. Serve una squadra da tre. Io, tu e… mio fratello, se riesco a convincerlo.");
          say("lm_nico", "[felice] Un torneo! Io in porta, tu davanti, Dario in mezzo a fare il fratello maggiore! Dove ci iscriviamo? C'è una cassa dei reclami?");
          K.rel.add("lm_nico", 2); setStep(N, 1); quest("lm_c1", "Il pallone sgonfio", "Serve un pallone che regga: chiedi la pompa a Ottavio, sul lato est.");
          return H.done();
        }
        say("lm_nico", s < 3 ? "Io sono pronto. Ho fatto stretching. Mi sono anche stirato." : "[felice] Dimmi dove devo essere e quando. E dov'è il bagno."); H.done();
      },
      lm_ottavio() {
        if (K.rel.scene("lm_ottavio")) return;
        const s = S();
        if (s === 1) {
          say("lm_ottavio", "Il pallone sgonfio dei Moretti. Lo riconosco dal rumore: fa «ffff». Mi serve una cosa in cambio.");
          return wask("Ottavio indica la cassa delle acciughe. «Reggimi la cassa mentre cerco la pompa. Una sola volta, giuro.»", [
            { label: "📓 Reggi la cassa senza far domande", sub: "Ottavio ti ricorderà", w: { verita: 1 }, fn: () => { say("lm_ottavio", "Puzza di pesce, eh? Così sai come ci si sente a lavorare. Eccola, la pompa. Si gonfia col braccio, non con la speranza."); K.inv.give("lm_pompa"); setStep(N, 2); say("voce", "Ottieni la <b>Pompa da bicicletta</b>."); quest("lm_c1b", "Il muro", "Porta il pallone gonfio a Dario, al muro del porto."); K.rel.add("lm_ottavio", 2); done(); } },
            { label: "✨ «Ti racconto di quando ho battuto Gegè»", sub: "Non l'hai ancora fatto", w: { leggenda: 1 }, fn: () => { say("lm_ottavio", "Non l'hai fatto. Ma racconti bene. La pompa è lì. La prossima volta però, la cassa."); K.inv.give("lm_pompa"); setStep(N, 2); say("voce", "Ottieni la <b>Pompa da bicicletta</b>."); quest("lm_c1b", "Il muro", "Porta il pallone gonfio a Dario, al muro del porto."); K.rel.add("lm_ottavio", 1); done(); } }
          ]);
        }
        say("lm_ottavio", s === 0 ? "Fischio io, che il mare non fischia. Torna quando hai una squadra." : "La pompa si restituisce a fine torneo. Come i palloni e le promesse."); H.done();
      },
      lm_dario() {
        if (K.rel.scene("lm_dario")) return;
        const s = S();
        say("voce", H.v("Dario è alto tre metri. Ha scarpini d'oro e gli occhi di un eroe di cartone. Tira contro il muro con la mano sinistra mentre legge.", "Dario tira contro il muro del porto, da solo, con le scarpe bucate. Il pallone torna dritto ogni volta. Non lo guarda nemmeno."));
        if (s <= 1) {
          say("lm_dario", "Torneo? No. Ho altro da fare. E il tuo pallone sembra una sogliola.");
          say("hero", "Allora te lo faccio gonfiare.");
          return H.done();
        }
        if (s === 2) {
          say("hero", "Ho il pallone gonfio. Facciamo la squadra.");
          say("lm_dario", "[pensa] Piccolo. Il torneo non è un esame.");
          return wask("Dario ti guarda, poi guarda il muro. Aspetta che tu dica qualcosa.", [
            { label: "✨ «Se il pallone torna dritto, giochi.»", sub: "Una sfida: tiri contro il muro", big: true, w: { leggenda: 1 }, fn: () => { F.set("lm_dario_sfida", true); say("voce", "Dario si appoggia al muro, braccia incrociate. «Cinque tiri. Se me ne rimanda due dritti, giochiamo.»"); K.say(H.flush(), () => K.minigame(window.__tornadritto.start, { title: "Torna Dritto · la sfida di Dario", rounds: 5, need: 2 }, (r) => { F.set("lm_sfida_vinta", !!r.win); K.bond(r.win ? "leggenda" : "verita", 1); K.say([r.win ? ["lm_dario", "[sorpreso] Dritto. Due volte. Va bene, giochiamo. Ma giochi bene, non per sport: giochi per me."] : ["lm_dario", "[ride] Storto, piccolo. Ma ti sei messo a tirare e non hai smesso. Giochiamo: il muro conta meno di quello."]], () => { K.rel.add("lm_dario", 2); setStep(N, 3); quest("lm_c1c", "Iscrivi la squadra", "Parla con Gegè davanti al cartello del torneo."); done(); }); })); } },
            { label: "📓 «Non voglio che tu parta senza giocare con me.»", sub: "Una frase vera", big: true, w: { verita: 1 }, fn: () => { F.set("lm_dario_sfida", false); say("lm_dario", "[triste] …Chi ti ha detto che parto?"); say("hero", "Nessuno. Si vede dalle scarpe."); say("lm_dario", "[pensa] Va bene. Giochiamo. Una volta sola."); K.rel.add("lm_dario", 3); setStep(N, 3); quest("lm_c1c", "Iscrivi la squadra", "Parla con Gegè davanti al cartello del torneo."); done(); } }
          ]);
        }
        say("lm_dario", s === 3 ? "Vai dai Granchi. Io tengo il muro." : "Ci vediamo domani. Presto. E non portare il pallone in trattoria."); H.done();
      },
      lm_gege() {
        if (K.rel.scene("lm_gege")) return;
        const s = S();
        if (s === 3) return sorteggio();
        say("lm_gege", "Passa oltre, Moretti. Il porto è nostro, il muro pure."); H.done();
      },
      lm_papa() {
        if (K.rel.scene("lm_papa")) return;
        say("lm_papa", H.v("Leo! La più grande trattoria del mondo ha bisogno di te! Domani lavori in sala, dalle sette.", "Leo. Domani, in sala, alle sette. Non alle sette e un quarto. Alle sette."));
        if (!F.is("lm_gelato_ok")) { F.set("lm_gelato_ok", true); K.inv.give("lm_gelato"); say("voce", "Papà ti infila in mano un <b>Gelato al limone</b> «per il torneo». Si scioglie in fretta: regalalo bene dal menu 🎒 Zaino."); }
        H.done();
      }
    };
    const zones = {
      lm_borgo: {
        region: "racconto", name: "Il Borgo Marino d'agosto", short: "Borgo Marino", sub: "Il muro, la spiaggia, la trattoria e il campetto", bg: "lm_borgo", time: "giorno", w: 36, h: 24, base: "Q", start: [5, 8], travel: [5, 8],
        items: [[9, 8], [27, 11], [17, 20], [32, 14]], itemCos: "lm_c1",
        areas: [[3, 3, 8, 6, "Casa Moretti"], [12, 2, 19, 6, "La Trattoria Moretti"], [24, 3, 29, 6, "Il cantiere navale"], [2, 14, 12, 18, "Il campetto"], [26, 14, 31, 19, "Il muro del porto"], [0, 0, 35, 23, "Il Borgo Marino"]],
        act: { q: "Entra", n: "Leggi il cartello", l: "Guarda il lampione", t: "Guarda l'albero", g: "Guarda la porta", s: "Riposa un momento", w: "Guarda il mare", "=": "Guarda il molo" },
        flavor: { n: (K) => (K.recall && K.recall.isTrue() ? "«TORNEO ESTIVO DEL PORTO. 1° premio: coppa di latta e un gelato a testa. Iscrizione: sei euro a squadra.»" : "«TORNEO ESTIVO DEL PORTO. 1° premio: un'astronave. 2° premio: due astronavi. Iscrizione: un sorriso.»"), l: "Un lampione. Di sera lo accende Rita con un bastone e le sue opinioni.", t: "Un albero stanco. Fa ombra solo se glielo chiedi gentilmente.", g: "Una porta del campetto: due pali storti e una rete di corda da pesca.", w: "Il mare. Oggi è blu come la copertina di un fumetto." },
        intro: [["voce", "Agosto, Borgo Marino. Caldo, gabbiani, il profumo del fritto che arriva dalla trattoria di papà."], ["voce", "Tu sei Leo. Hai quattordici anni e un'idea: iscriversi al torneo del porto. Il tuo fratello maggiore ti guarda da lontano, come se tu avessi già vinto."]],
        npcs: (s) => { const L = [{ id: "lm_nico", at: [8, 15] }, { id: "lm_dario", at: [24, 15] }, { id: "lm_ottavio", at: [28, 15] }]; if (s >= 3) L.push({ id: "lm_gege", at: [22, 14] }); return L; },
        build(L) { buildBorgo(L, true); },
        eras: {
          vero: {
            label: "Com'è andata davvero", region: "vero", time: "giorno",
            npcs: (s) => { const L = [{ id: "lm_nico", at: [8, 15] }, { id: "lm_dario", at: [24, 15] }, { id: "lm_ottavio", at: [28, 15] }]; if (s >= 3) L.push({ id: "lm_gege", at: [22, 14] }); return L; },
            build(L) { buildBorgo(L, false); }
          }
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(), vero = K.recall && K.recall.isTrue();
          g.save();
          if (!vero) { // il racconto: sole con la faccia, nuvole a forma di pallone, fumo che sale dalla trattoria
            g.fillStyle = "rgba(255,230,120,.9)"; g.beginPath(); g.arc(d.X(31), d.Y(1) + 8, 14 + Math.sin(f / 20) * 1.2, 0, 7); g.fill(); g.fillStyle = "#7c2d12"; g.fillRect(d.X(31) - 5, d.Y(1) + 4, 2, 2); g.fillRect(d.X(31) + 3, d.Y(1) + 4, 2, 2); g.fillRect(d.X(31) - 4, d.Y(1) + 11, 8, 1.5);
            for (let i = 0; i < 3; i++) { g.fillStyle = "rgba(255,255,255,.85)"; g.beginPath(); g.arc(d.X(8 + i * 8) + Math.sin(f / 40 + i) * 6, d.Y(1) + 4, 7, 0, 7); g.fill(); }
            g.fillStyle = "rgba(255,200,60,.35)"; g.fillRect(d.X(25) - 4, d.Y(10), 8, 70); // il Dario alto tre metri (ombra)
          } else {
            for (let i = 0; i < 2; i++) { g.fillStyle = `rgba(214,211,209,${0.28 - i * 0.1})`; g.beginPath(); g.arc(d.X(8) + 4 + Math.sin(f / 30 + i) * 3, d.Y(3) - 6 - i * 6 - (f % 40) / 8, 3 + i, 0, 7); g.fill(); }
          }
          g.restore();
          H.plaque(g, "CASA MORETTI", d.X(6), d.Y(3) - 4, "#fde68a"); H.plaque(g, "TRATTORIA", d.X(16), d.Y(2) - 4, "#fdba74"); H.plaque(g, "CAMPETTO", d.X(7), d.Y(13) - 4, "#bbf7d0"); H.plaque(g, "IL MURO", d.X(26) + 8, d.Y(14) - 8, "#fca5a5");
        }
      },
      lm_casa: {
        interior: true, region: "casa", name: "Casa Moretti", short: "Casa Moretti", sub: "Una cucina, due letti a castello, la radio e il rumore del frigo", bg: "lm_casa", w: 12, h: 9, start: [6, 7], outside: ["lm_borgo", 5, 7], base: "Y",
        act: { H: "Guarda i fornelli", D: "Guarda la credenza", W: "Guarda la finestra", B: "Guarda il letto a castello", T: "Guarda il tavolo", L: "Guarda la mensola" },
        flavor: { H: "I fornelli di casa. Qui papà prova le ricette: quelle che riescono vanno in trattoria, le altre le mangia Dario.", D: "La credenza con le tazze spaiate. Una dice «Il miglior papà». Il «miglior» l'ha scritto Dario con un pennarello diverso.", W: "La finestra sul porto. Si vede il muro e un puntino rosso: il pallone, probabilmente.", B: "Il letto a castello. Sopra dorme Dario, sotto Leo. La scaletta ha un gradino rotto che nessuno vuole ammettere.", T: "Il tavolo della cucina. Sopra: la lista della spesa, una bolletta e un biglietto del treno per Milano, piegato in quattro. Non è tuo. Non lo apri.", L: "Una mensola con le coppe di Dario. Cinque. Tre sono di latta, una di plastica, una è un trofeo di bocce." },
        npcs: () => [{ id: "lm_papa", at: [6, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 11, 8, "Y"); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 8, "a"); lay(11, 0, 11, 8, "a"); lay(0, 8, 11, 8, "a"); put(6, 8, "v");
          put(5, 1, "H"); put(6, 1, "H"); put(1, 2, "D"); put(2, 2, "D"); put(8, 0, "W"); put(3, 0, "W"); put(10, 5, "B"); put(10, 6, "B"); put(8, 3, "T"); put(9, 3, "T"); put(1, 5, "L"); put(1, 6, "L");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CASA MORETTI", d.X(6), d.Y(0) + 6, "#fde68a"); }
      }
    };
    return {
      n: N, title: "Il pallone sgonfio", sub: "Un torneo, un pallone moscio e tre che non sanno ancora di essere una squadra",
      goal, start: "lm_borgo", introBg: "lm_borgo", zones, talk, obj: {},
      intro: [["voce", "Agosto, tre anni prima. Il Borgo Marino ha il mare più blu della costa e il campetto più storto."], ["voce", "Quello che stai per rivedere è un ricordo. Lo racconta Leo. Dal menu puoi sempre chiedergli: «com'è andata davvero?»"]]
    };
  }
  boot();
})();
