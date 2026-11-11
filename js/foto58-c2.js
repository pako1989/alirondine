// js/foto58-c2.js - «LA FOTO DEL '58» · Capitolo 2: L'Albergo del Passo
// Rina Abate, sorella del capitano e vedova del terzino, lavora a maglia in piazza. Viola sviluppa il negativo dell'albergo:
// la semifinale giocata nella neve (si rigioca, ferma a metà azione: tocca il pallone) e la notte nella hall, dove una busta scivola su un tavolino.
// Al Bar Sport, Ilario davanti alla busta del Totocalcio Gatti: la prima scelta che pesa (Verità o Pietà).
(function () {
  "use strict";
  // il pallone fermo a mezz'aria nell'albergo: la semifinale si rigioca
  window.__f5Ball = (K) => {
    const F = K.F, s = K.stepOf(2);
    if (s < 2) return K.say([["voce", "Il pallone, fermo a mezz'aria sopra la neve, come appeso a un filo. Non ancora."]], K.done);
    if (F.is("f5_semi_done")) return K.ask("voce", "Il pallone è ancora lì, sospeso. La semifinale è finita, nel '58. Nel ricordo, invece, si può rigiocare.", [{ label: "⚽ Rigioca la semifinale", sub: "Rondine contro Sportiva Alpina, nella neve", fn: () => play(K) }, { label: "◂ Lascialo dov'è", fn: () => K.done() }]);
    K.say([["voce", "Tocchi il pallone. Il negativo trema, la neve ricomincia a cadere, e undici uomini in maglia granata si muovono tutti insieme, come se qualcuno avesse tolto il dito dal tasto della pausa."], ["f5_carmine", "Su, Rondine! Su che il campo è uguale per tutti!"]], () => play(K));
  };
  function play(K) {
    const F = K.F;
    K.playMatch({
      id: "f5_semi", alt: "az,cage,hd", force: false, oppTeam: "Sportiva Alpina", oppColor: "#1e3a8a", mate: "Carmine Abate", squad: ["Guido Ferri", "Carmine Abate", "Renzo Maffei"], us: "U.S. Rondine 1958", homeKit: ["#7f1d1d", "#f5ead6"],
      chap: "La Foto del '58 · La semifinale nella neve", bg: "f5_albergo_bg", oppNames: ["Il portiere alpino", "Zanin", "Dellagiacoma", "Il Moro", "Fontanella"],
      intro: "Aprile 1958, il campo dietro l'Albergo del Passo, quaranta centimetri di neve. Semifinale del Torneo del Passo: U.S. Rondine contro Sportiva Alpina. Davanti alla porta c'è il Nove, e in tribuna un osservatore col cappello.",
      done: (r) => {
        const first = !F.is("f5_semi_done"); F.set("f5_semi_done", true);
        if (r.win) F.set("f5_semi_win", true);
        if (first && K.stepOf(2) === 2) K.setStep(2, 3);
        const L = r.win
          ? [["voce", "Fischio finale. Nel '58 finì 2 a 1 per la Rondine: gol del Nove, di testa, nella neve fino alle ginocchia. Oggi, nel ricordo, hai vinto anche tu."], ["f5_renzo", "Visto, osservatore? Visto? Scrivilo sul taccuino: Maffei, di testa, nella neve."], ["f5_amedeo", "Maffei, la testa usala anche fuori dal campo. Stanotte tutti a letto alle dieci."]]
          : [["voce", "Fischio finale. Nel ricordo è andata storta; nel '58, invece, finì 2 a 1 per la Rondine: gol del Nove, di testa, nella neve fino alle ginocchia. Il negativo non cambia. Cambia solo chi lo guarda."], ["f5_renzo", "Visto, osservatore? Visto? Scrivilo sul taccuino: Maffei, di testa, nella neve."]];
        if (first) L.push(["voce", "Il negativo si ferma di nuovo. Ma la porta dell'albergo, adesso, è socchiusa: dentro è già notte, la notte prima della finale."]);
        K.scene(L, () => K.enterZone("f5_albergo"), "f5_albergo_bg");
      }
    });
  }

  function boot() {
    const E = window.__foto58Core;
    if (!E || !E.api || !E.api.addChapter || !window.__f5H || !window.__f5P) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__f5H(K), Z = window.__f5Z, { say, done } = H;
    const N = 2, S = () => K.stepOf(N), D = () => K.deduce;
    H.people();
    K.cos("f5_c2", { kind: "acc", label: "Guanti di lana del portiere", val: "guanti", from: "Capitolo 2 di La Foto del '58" });
    K.lore("l_f5_torneo", { t: "Il Torneo del Passo", d: "Torneo di primavera tra le squadre di valle, giocato all'Albergo del Passo della Cavalla, a milleseicento metri. Nel '58 nevicò ad aprile. La Rondine arrivò in finale per la prima e unica volta." });
    K.lore("l_f5_gatti", { t: "Totocalcio Gatti & C.", d: "Ricevitoria a Valle, aperta nel 1950 dal signor Gatti, cappotto di cammello e anello al mignolo. Accettava anche scommesse che il Totocalcio non prevedeva: risultati esatti, marcatori, «sorprese». Chiusa nel 1964 per una storia di carte false." });
    K.lore("l_f5_rina", { t: "Rina Abate", d: "Sorella di Carmine, il capitano. Sposò Bepi Cozzolino nel 1959, dopo tre proposte. Cinquantun anni di matrimonio, litigando sul sale. Oggi fa la maglia sulla panchina della piazza." });
    const goal = (s) => ({
      0: "In piazza, sulla panchina vicino alla fontana, una signora lavora a maglia granata. Rina Abate: nel '58 aveva diciannove anni.",
      1: "All'Archivio, Viola ha un negativo nuovo da sviluppare: l'Albergo del Passo.",
      2: `Apri l'Albergo dal mirino, ascolta la semifinale ferma (${H.heard("f5_albergo")}/8 almeno) e tocca il pallone.`,
      3: `Entra nell'albergo: la notte prima della finale. Ascolta la hall (${H.heard("f5_hall")}/8 almeno) e guarda il tavolino in fondo. Poi torna da Viola.`,
      4: "Al Bar Sport: Nello ha qualcosa nel cassetto, e Ilario deve vedere quella busta.",
      5: `Nel Taccuino, porta a sei i volti confermati (${H.conf()}/6). Poi parla con Viola.`,
      6: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      setStep(N, 6); F.set("f5_c2_done", true);
      const m = K.reward("f5_c2", { coins: 120, cos: "f5_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["f5_viola", "[serio] Sei. Sei vite al loro posto. E una busta del Totocalcio che nessuno doveva vedere."],
        ["f5_viola", "[pensa] Domani Mauro fa la corsa del Passo. Se ci sali, ti fa vedere la galleria. Lui ci rallenta sempre, dice per le buche. Non ci sono buche."],
        ["voce", `<b>FINE DEL CAPITOLO 2 · «L'Albergo del Passo»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 3 ti aspetta: la corriera di Mauro Mancuso, la galleria del Passo, e quello che si vede al lampo di un flash."]
      ]), () => K.openMain(), "f5_galleria_bg");
    }
    const after = (zid) => {
      if (S() === 2 && zid === "f5_albergo" && H.heard(zid) === 8) say("voce", "<b>Otto voci.</b> La semifinale è ferma a metà azione. Il pallone è sospeso davanti al Nove: toccalo.");
      if (S() === 3 && zid === "f5_hall" && H.heard(zid) >= 8 && F.is("f5_busta_vista") && !F.is("f5_hall_ok")) { F.set("f5_hall_ok", true); say("voce", "<b>Basta così.</b> Una busta, un ragazzo, una finestra. Torna al cavalletto e racconta tutto a Viola."); }
    };
    const hallCheck = () => { if (S() === 3 && H.heard("f5_hall") >= 8 && F.is("f5_busta_vista")) F.set("f5_hall_ok", true); };
    const over = {
      "f5_albergo:f5_renzo": () => { const first = !F.is("f5_h_f5_albergo_renzo"); F.set("f5_h_f5_albergo_renzo", true); say("voce", "<em>(Di spalle: il <b>9</b>. Davanti a lui, la porta. Non si vede la faccia, ma si vede come sta in piedi: come uno che sa già dove andrà il pallone.)</em>"); say("f5_renzo", "Palla a me. Palla a me e domani il Brianza mi compra."); if (first) after("f5_albergo"); done(); },
      "f5_hall:f5_renzo": () => { const first = !F.is("f5_h_f5_hall_renzo"); F.set("f5_h_f5_hall_renzo", true); say("voce", "<em>(Il Nove, alla finestra, controluce. Ha visto tutto. La faccia è in ombra, e nel negativo l'ombra è un graffio.)</em>"); say("f5_renzo", "Ragazzino. Ragazzino, no."); if (first) { after("f5_hall"); hallCheck(); } done(); }
    };

    const talk = Object.assign(window.__f5FT(K, H, over, (z, id) => { after(z, id); hallCheck(); }), {
      f5_rina() {
        const s = S();
        if (s === 0) {
          say("voce", "Una signora minuta, i capelli bianchi raccolti, i ferri che vanno da soli. Il gomitolo è granata. Ti guarda da sopra gli occhiali come si guarda uno che è in ritardo.");
          say("f5_rina", "[furbo] Tu sei quello dell'Archivio. Si sa. Al Borgo si sa tutto in mezz'ora, tranne le cose importanti, che ci mettono settant'anni.");
          say("f5_rina", "[pensa] La foto del '58. Io c'ero, alla partenza: ai bordi, col cappotto di mia madre. Guardavo Bepi Cozzolino, quello con la cicatrice. Lui guardava me. Il fotografo ci ha sgridati tutti e due.");
          say("f5_rina", "[ride] L'ho sposato l'anno dopo. Alla terza proposta. Cinquantun anni, poi se n'è andato prima lui, come sempre: anche al bar arrivava prima lui.");
          say("f5_rina", "[serio] Il Professore, Laurenti, quello con gli occhiali… a me ha insegnato a leggere. Ha fatto il maestro alle elementari fino al '90. Il giorno dopo il ritorno era in classe. Lo stesso.");
          say("f5_rina", "[triste] E mio fratello Carmine, il capitano… dopo ha allenato la Rondine per venticinque anni. Non ha mai voluto andare al Passo. Mai. Neanche in gita.");
          D() && D().learn("fate", "sposato"); D() && D().learn("fate", "maestro");
          K.rel.add("f5_rina", 2); K.learnLore("l_f5_rina");
          setStep(N, 1); quest("f5_c2a", "Il negativo dell'albergo", "Viola ha un negativo nuovo da sviluppare: l'Albergo del Passo.");
          return done();
        }
        if (s === 4 && !F.is("f5_rina_busta")) {
          F.set("f5_rina_busta", true);
          say("f5_rina", "[serio] Gatti. Il signor Gatti. Con la G maiuscola anche quando lo dicevi piano. Veniva al Borgo il sabato e i ragazzi della Rondine gli giravano intorno come le mosche al miele.");
          say("f5_rina", "[pensa] Bepi no. Bepi diceva che Gatti aveva le mani fredde anche d'agosto.");
          return done();
        }
        say("f5_rina", ["[ride] Questa sciarpa è per la mostra. Granata, come quella di Sante. Sua madre gliene faceva una all'anno, e lui all'anno ne perdeva due.", "[pensa] Bepi la sera fischiava sempre la stessa canzone. Una cosa del '58. Non mi ha mai detto dove l'aveva imparata.", "[serio] Se vedi Ilario, digli che la Rina lo saluta. Lui fa finta di non sentire. Da settant'anni."][K.hash(Date.now()) % 3]);
        return done();
      },
      f5_viola() {
        const s = S();
        if (s === 0) { say("f5_viola", "[pensa] La Rina Abate, in piazza, sulla panchina. Se c'è una che sa, è lei. Il problema è che sa anche quando smettere di parlare."); return done(); }
        if (s === 1) {
          say("f5_viola", "[felice] Ho trovato il secondo rullino. Etichetta: «Albergo, sabato». Nando scriveva come un medico, ma si capisce.");
          return H.develop({ id: "albergo", title: "Il negativo dell'albergo", ids: ["f5_guido", "f5_bepi", "f5_ottavio", "f5_rocco", "f5_carmine", "f5_libero", "f5_gigi"], seed: 412, diff: 1,
            intro: "Il negativo dell'Albergo del Passo: sette uomini nella neve. Dì chi è chi prima che la carta si annerisca." }, (r) => {
            say("f5_viola", r && r.viola ? "[ride] Fatto. Ci ho messo un'ora e un caffè. Il quinto." : "[sorpreso] Una partita! Nella neve! E guarda: nessuno si vede in faccia. Tutti di spalle, coi numeri.");
            say("voce", "Nel mirino, adesso, c'è anche <b>l'Albergo del Passo</b>. I numeri di maglia, nel Taccuino, valgono come nomi: chi portava il 2, chi il 5, chi il 9…");
            setStep(N, 2); K.questDone("f5_c2a"); quest("f5_c2b", "La semifinale nella neve", "Apri l'Albergo dal mirino, ascolta la partita ferma e tocca il pallone.");
            done();
          });
        }
        if (s === 2) { say("f5_viola", F.is("f5_semi_done") ? "[felice] La semifinale l'hai rigiocata? E l'albergo? Entra, dai: la porta è socchiusa." : `[serio] L'albergo: ${H.heard("f5_albergo")} voci. E il pallone? È sospeso a mezz'aria, nel negativo. Toccalo, vediamo che succede.`); return done(); }
        if (s === 3) {
          if (!F.is("f5_hall_ok")) { say("f5_viola", `[pensa] La hall, di notte: ${H.heard("f5_hall")} voci${F.is("f5_busta_vista") ? "" : ", e il tavolino in fondo non l'hai guardato"}. Torna dentro.`); return done(); }
          say("f5_viola", "[serio] Una busta. Il ragazzo coi guanti. E il Nove alla finestra che dice «no». …Aspetta.");
          say("voce", "Viola rovescia la scatola di latta sul tavolo. Sotto il fondo di cartone, schiacciata, c'è una busta gialla, vuota. Il timbro: «Totocalcio Gatti & C. · Valle».");
          say("f5_viola", "[sorpreso] È la stessa. La stessa busta. Chi ha messo la foto in questa scatola sapeva cosa c'era dentro, quella notte.");
          K.inv.give("f5_busta"); K.learnLore("l_f5_gatti");
          say("f5_viola", "[pensa] E guarda negli scaffali: c'è l'annuario della Rondine, «Cent'anni di granata». C'è scritto chi ha allenato chi. Io vado a fare un caffè. Il sesto. Non giudicarmi.");
          setStep(N, 4); K.questDone("f5_c2b"); quest("f5_c2c", "La busta del Totocalcio", "Al Bar Sport: Nello ha qualcosa nel cassetto, e Ilario deve vedere quella busta.");
          return done();
        }
        if (s === 4) { say("f5_viola", F.is("f5_c2_scelta") ? "[serio] L'hai detto a Ilario? E cosa ha fatto? …No, aspetta. Prima il Taccuino. Sei volti, poi me lo racconti." : "[pensa] La busta nello zaino pesa più di quanto pesi. Portala al bar."); if (F.is("f5_c2_scelta")) setStep(N, 5); return done(); }
        if (s === 5) {
          if (H.conf() >= 6) return fin();
          say("f5_viola", `[serio] ${H.conf()} volti su sei. Il portiere col berretto, il capitano, quello con la cicatrice… i numeri di maglia dell'albergo aiutano. E l'annuario negli scaffali.`); return done();
        }
        say("f5_viola", "[felice] Domani la corriera. Siediti davanti: Mauro racconta barzellette solo a chi siede davanti."); return done();
      },
      f5_nello() {
        if (S() >= 4 && !K.inv.has("f5_ritaglio")) {
          say("f5_nello", "[pensa] Il '58? Aspetta. Mio padre teneva nel cassetto un ritaglio. Diceva che era «l'unico del Borgo arrivato in alto». Ecco. Gazzetta del Nord, 1962.");
          say("voce", "«Valtorta, la mezzala del Brianza, in Serie B.» La foto è sgranata. Il pizzetto no.");
          K.inv.give("f5_ritaglio"); D() && D().learn("fate", "serieb");
          say("f5_nello", "[ride] Il milanese. Al Borgo ci stava per lavoro, alla fornace. Il Brianza venne al Passo a vedere il Nove, e si portò via lui. Dice mio padre che il milanese non tornò mai, neanche per Natale. Il Borgo era troppo «poco».");
          return done();
        }
        say("f5_nello", ["[serio] Ilario oggi ha chiesto il caffè. L'ha chiesto. Brutto segno.", "[ride] Il Totocalcio? Adesso si gioca col telefono. Una volta c'era Gatti, a Valle, e le schedine si compilavano col sangue. Così diceva mio padre.", "[pensa] Il polso di Guido Ferri. Lo sapevi? Si ruppe la notte prima della finale, sulle scale di fuori. Ghiaccio."][K.hash(Date.now()) % 3]);
        return done();
      },
      f5_ilario() {
        const s = S();
        if (s === 4 && !F.is("f5_c2_scelta")) {
          if (!K.inv.has("f5_ritaglio")) { say("f5_ilario", "[serio] Di nuovo tu. Nello, il ragazzo vuole qualcosa dal cassetto, si vede. Chiedi a lui, prima. Io sto perdendo a solitario, e non succede mai."); return done(); }
          say("voce", "Ti siedi. Ilario mescola. Tu appoggi la mano sul tavolo, e sotto la mano c'è la busta gialla del Totocalcio Gatti. Non l'hai ancora girata.");
          return H.wask("La busta è sotto la tua mano. Ilario non la vede ancora. Cosa fai?", [
            { label: "🔎 Giri la busta sul tavolo", sub: "Che la veda. Che dica.", w: { verita: 2 }, fn: () => {
              F.set("f5_c2_scelta", "verita"); F.set("f5_c2_v", true);
              say("voce", "Giri la busta. Ilario smette di mescolare. Le carte gli scivolano di mano: il fante di spade finisce per terra, faccia in su.");
              say("f5_ilario", "[sorpreso] …Dove l'hai presa. Dove. Questa era… Questa l'avevo buttata nella neve. Nel '58. L'ho buttata.");
              say("f5_ilario", "[arrabbiato] Non sai niente. Non sai niente di niente. Nello, il conto. Lo paga lui.");
              say("voce", "Esce senza berretto. Nello raccoglie il fante di spade e lo rimette sul tavolo. «Quarant'anni che non lo vedo uscire senza berretto», dice.");
              K.rel.add("f5_ilario", -1); setStep(N, 5); done();
            } },
            { label: "🕊️ Tieni la busta, chiedi dei guanti", sub: "Prima l'uomo, poi la busta", w: { pieta: 2 }, fn: () => {
              F.set("f5_c2_scelta", "pieta"); F.set("f5_c2_p", true);
              say("voce", "Rimetti la busta in tasca. Chiedi invece dei guanti: nella foto ne aveva due spaiati.");
              say("f5_ilario", "[pensa] I guanti. Uno era di Guido. Si ruppe il polso la notte prima della finale, sulle scale, col ghiaccio. Mi diede il suo guanto destro: «Così para la mano mia, almeno quella».");
              say("f5_ilario", "[triste] Perdemmo tre a zero. Io… presi tre gol. Uno, dicono, sembrava che mi tuffassi dall'altra parte apposta. Lo dicono. La gente dice.");
              say("voce", "Mescola. Non alza gli occhi. Sul tavolo, accanto alle carte, la sua mano trema appena.");
              K.rel.add("f5_ilario", 2); setStep(N, 5); done();
            } }
          ]);
        }
        say("f5_ilario", F.is("f5_c2_v") ? ["[serio] …Siediti, se proprio devi. Ma la busta tienila in tasca.", "[arrabbiato] Settant'anni. Settant'anni e arrivi tu con una scatola di biscotti."][K.hash(Date.now()) % 2] : ["[pensa] Guido scriveva da Buenos Aires, a Natale. Poi ha smesso. Si smette, a un certo punto.", "[ride] Il solitario si vince sempre, se bari con te stesso con abbastanza convinzione."][K.hash(Date.now()) % 2]);
        return done();
      }
    });

    const zones = Object.assign(window.__f5P(K, H, {
      borgo: (s) => [{ id: "f5_rina", at: [7, 12] }].concat(s >= 3 ? [] : []),
      arch: () => [{ id: "f5_viola", at: [7, 6] }],
      bar: () => [{ id: "f5_ilario", at: [13, 2] }, { id: "f5_nello", at: [4, 2] }],
      borgoItems: [[33, 16], [10, 23], [26, 4]], itemCos: "f5_c2",
      archObj: {
        L: () => {
          if (S() < 4) return K.say([["voce", "Faldoni: «Verbali», «Tesseramenti», «Trasferte». E l'annuario della Rondine, «Cent'anni di granata», che Viola ti dirà quando aprire."]], K.done);
          const nw = D() && D().learn("fate", "allenatore", true);
          K.say([["voce", "L'annuario «Cent'anni di granata», 1998. Pagina 41: <em>«Allenatori: … 1965-1990, Carmine Abate, già capitano. Venticinque stagioni, un solo patto con i giocatori: al Passo non si va.»</em>"]].concat(nw ? [["voce", "📓 Nuovo destino nel Taccuino: <b>Allenatore della Rondine</b>."]] : []), K.done);
        }
      },
      intro: { borgo: [["voce", "La piazza del Borgo, un altro giorno. Sulla panchina vicino alla fontana una signora lavora a maglia granata, e i piccioni le stanno intorno come se aspettassero un verdetto."]] }
    }), {
      f5_albergo: Z.albergo(H),
      f5_hall: Z.hall(H)
    });
    zones.f5_albergo.doors["9,6"].locked = () => (F.is("f5_semi_done") ? false : "La porta dell'albergo è chiusa, ferma come tutto il resto. Prima la partita: il pallone è sospeso davanti al Nove.");
    zones.f5_albergo.intro = [["voce", "Il negativo dell'albergo: un campo bianco dietro un edificio di legno scuro, le porte coi pali pitturati. Undici maglie granata e undici bianche e blu ferme nella neve, il pallone a mezz'aria. Sono tutti di spalle. Si leggono i numeri."]];
    zones.f5_hall.intro = [["voce", "Dentro è notte. Il camino acceso, le carte sul tavolo, un telefono a muro con la cornetta sollevata. E in fondo, sotto una lampada, un tavolino dove due mani non si guardano."]];

    return {
      n: N, title: "L'Albergo del Passo", sub: "Una semifinale nella neve, una notte, una busta gialla",
      goal, start: "f5_borgo", introBg: "f5_albergo_bg", zones, talk, obj: {},
      intro: [["voce", "Il giorno dopo, al Borgo, piove. Viola ti manda un messaggio alle sette: «Ho trovato un altro rullino. Porta i biscotti.»"], ["voce", "In piazza, sulla panchina, una signora lavora a maglia sotto l'ombrello. La lana è granata. Ti guarda passare come si guarda un forestiero che fa domande."]]
    };
  }
  boot();
})();
