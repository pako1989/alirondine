// js/tifosi-c3.js - «LA NOTTE DEI TIFOSI MORTI» · Capitolo 3: La Curva
// La curva ospite: ventimila tifosi del Valtorta che ondeggiano a tempo, senza fiato. L'unica uscita è il cancello in cima, e la chiave ce l'ha Ringhio,
// capo ultras da quarant'anni, nel suo bugigattolo sotto le gradinate. Là sotto si scopre chi ha provato per primo il fumogeno. E sulla scala del cancello
// Pippo, il Muro, si mette in mezzo un'ultima volta.
// Zone: la curva ospite (34x24: gradoni, transenne, scalinate, tamburi, il cancello), il bugigattolo di Ringhio (16x10), più lo stadio col varco della curva.
(function () {
  "use strict";
  function boot() {
    const E = window.__tifosiCore;
    if (!E || !E.api || !E.api._has || !E.api._has(2) || !window.__tifosiZ) return setTimeout(boot, 120);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__tifosiH(K), Z = window.__tifosiZ, { say, done, wask, ask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("zt_c3", { kind: "acc", label: "Sciarpa della curva ospite", val: "sciarpa", from: "Capitolo 3 di La Notte dei Tifosi Morti" });
    K.lore("l_zt_ringhio", { t: "Aldo Ringhieri, detto Ringhio", d: "Quarant'anni di curva ospite. Trent'anni di cantiere navale a Valtorta, poi la cassa integrazione, poi niente. La curva era l'unico posto dove qualcuno lo ascoltava ancora. Bellotti gli aveva chiesto di provare il lotto 7 per primo: «Se va bene, la curva è tua per sempre». È andata così." });
    K.lore("l_zt_lettera", { t: "La lettera nel cassetto", d: "«Davide, domenica giochiamo a Borgo Marino. Se vieni, ti tengo il posto vicino al tamburo, come quando eri piccolo. Se non vieni, va bene lo stesso. Papà.» Mai spedita. Il francobollo c'è già." });

    const goal = (s) => ({
      0: "Sei nella curva ospite. Mimmo è in fondo, vicino alla scalinata: parla con lui prima di salire.",
      1: "La chiave del cancello è nel bugigattolo di Ringhio, sotto la curva, in basso a sinistra.",
      2: "Hai la chiave. Torna su, al cancello in cima alla curva: il Gruppo ti aspetta.",
      3: "Il cancello cigola e la curva ha sentito. Parla con Gaspare, sotto il cancello: è ora dell'Assedio.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      setStep(N, 4); F.set("zt_c3_done", true);
      const m = K.reward("zt_c3", { coins: 130, cos: "zt_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "La chiave gira due volte. Il cancello della curva ospite si apre su una rampa di cemento, e in fondo alla rampa il parcheggio, i pullman del Valtorta, i lampioni gialli."],
        F.is("zt_pippo_attesa") ? ["voce", "Da sotto i gradoni arriva la radiolina di Franca, che gracchia un notiziario. Poi tre colpi sulla porta del bugigattolo. Lenti. Pippo c'è ancora."] : ["voce", "Sulla scalinata, una fascia da capitano gialla e blu è rimasta impigliata alla transenna. Nessuno la tocca."],
        ["zt_gaspare", "[serio] Il pullman della squadra è in fondo al parcheggio. Nello, l'autista, dorme lì dentro da prima della partita: dice che il calcio gli fa venire il mal di mare."],
        ["voce", `<b>FINE DEL CAPITOLO 3 · «La Curva»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 4 ti aspetta: il parcheggio, l'ultima ora prima dell'alba, e un furgone che sa di zolfo."]
      ]), () => K.openMain(), "zt_curva");
    }
    function notte() {
      say("zt_mimmo", "[serio] Eccolo. Lo riconosco dal passo. Quarant'anni che sale questa scala per primo.");
      H.run({ title: "La Curva", arena: "curva", time: 130, mix: ["tifoso", "corridore", "panzone", "tamburino", "lanciatore"], boss: "ringhio" }, (r) => {
        F.set("zt_n3", true);
        say("voce", `Ringhio si ferma a metà scalinata. Si guarda intorno come chi ha perso il pullman. Poi si siede su un gradone, piano, e non si rialza più. Respinti: <b>${r.a || 0}</b>.`);
        say("zt_mimmo", "[triste] Ciao, Aldo. Trent'anni a insultarci. Ti avrei offerto un caffè, una volta. Non l'ho mai fatto.");
        say("voce", "Mimmo si toglie una delle sue sciarpe, quella più vecchia, e la appoggia sulle spalle di Ringhio. Nessuno dice niente.");
        K.say(H.flush(), () => H.bivio(() => fin()));
      });
    }

    const talk = {
      zt_mimmo() {
        if (K.rel.scene("zt_mimmo")) return;
        const s = S();
        if (s === 0) {
          say("zt_mimmo", "[serio] La curva ospite. Io qui non ci sono mai entrato, in quarantacinque anni. Era una questione di principio. Stasera il principio può aspettare.");
          say("voce", "Davanti a voi, i gradoni sono pieni. Ventimila sciarpe viola e gialle che ondeggiano a destra, poi a sinistra. A tempo. Senza fiato.");
          if (F.is("zt_coro")) {
            say("voce", "Mimmo ti dà una gomitata. Tu attacchi: «Valtorta alé, Valtorta alé…». La fila più vicina si gira. Ascolta. Poi si scansa, a tempo, e lascia libera la scalinata.");
            say("zt_mimmo", "[ride] Se mia madre mi vedesse. Pace all'anima sua: per fortuna non mi vede.");
            return avanti();
          }
          return wask("«Col nostro coro si arrabbiano. Col loro, si scansano. Te lo insegno adesso? Sono due righe.»", [
            { label: "🏃 Impari il coro del Valtorta", sub: "Due righe, e la scalinata è libera", big: true, w: { pelle: 1 }, fn: () => { F.set("zt_coro", true); K.learnLore("l_zt_coro"); say("voce", "Lo impari in fretta, sottovoce, coi denti stretti. Poi lo canti. La fila più vicina si gira e si scansa, a tempo."); say("zt_mimmo", "[pensa] Visto? Il calcio è tutto qui. Basta cantare la canzone giusta."); avanti(); } },
            { label: "🤝 «Si passa di corsa. Il Borgo canta il Borgo.»", sub: "Rasenti il muro, tutti insieme", big: true, w: { squadra: 1 }, fn: () => { say("voce", "Correte rasenti il muro, in fila, Gaspare in mezzo. Una mano grigia afferra la sciarpa di Mimmo. Mimmo la lascia andare senza voltarsi."); say("zt_mimmo", "[triste] Quarantaquattro sciarpe. Va bene. Ne avevo una di troppo."); avanti(); } }
          ]);
        }
        say("zt_mimmo", s === 1 ? "Il bugigattolo di Ringhio è in fondo a sinistra, sotto i gradoni. Lo so perché una volta ci ho lanciato un uovo. Dalla curva di casa. Che mira." : "[serio] Lassù c'è il cancello. Dietro il cancello, il parcheggio. Dietro il parcheggio, casa."); done();
        function avanti() { setStep(N, 1); quest("zt_c3", "La Curva", "La chiave del cancello è nel bugigattolo di Ringhio, sotto la curva."); done(); }
      },
      zt_pippo() {
        const s = S();
        if (s === 2) {
          say("voce", "Siete quasi al cancello quando una mano viola sbuca dalla terza fila e afferra Gaspare per la giacca. Gaspare scivola sul gradone. Pippo si mette in mezzo. Lo fa senza pensarci, come diciotto stagioni di calci d'angolo.");
          say("voce", "Il morso è sull'avambraccio. Non profondo. Abbastanza.");
          say("zt_nadia", "[serio] Fammi vedere. …Venti minuti. Forse trenta. Ho visto come è andata col primo tempo. Non ti mento, Pippo.");
          say("zt_pippo", "[ride] Diciotto stagioni a mettermi in mezzo. Mi sembrava brutto smettere proprio stasera.");
          say("zt_gaspare", "[triste] Dovevo esserci io. Io ho sessantaquattro anni. Tu hai una figlia.");
          say("zt_pippo", "[serio] Martina. Nove anni. Sa la telecronaca del mio gol a memoria. È l'unica.");
          return wask("Pippo si siede sul gradone e si stringe l'avambraccio con la fascia da capitano. «Decidete voi. Io sono un difensore: ho sempre fatto quello che diceva il Mister.»", [
            { label: "🤝 «Ti chiudiamo sotto la curva. All'alba c'è il fumo blu.»", sub: "Una speranza, chiusa a chiave", big: true, w: { squadra: 2 }, fn: () => {
              F.set("zt_pippo_attesa", true);
              say("voce", "Lo accompagnate giù, nel bugigattolo di Ringhio. Gaspare gli sistema una sedia, una coperta, la radiolina di Franca. Poi gira la chiave da fuori.");
              say("zt_pippo", "[serio] Se all'alba non venite, almeno sento come finisce. E se vengo fuori io… mirate alle gambe. Di testa sono sempre stato meglio.");
              say("zt_gaspare", "[triste] Torniamo. Te lo giuro sulla scopa.");
              dopo();
            } },
            { label: "🏃 «Il tuo ultimo minuto, Pippo. Come vuoi tu.»", sub: "Lo lasci scegliere come finire", big: true, w: { pelle: 2 }, fn: () => {
              F.set("zt_pippo_minuto", true);
              say("zt_pippo", "[serio] Allora fatemi fare il difensore. Scendo in mezzo a loro e li tengo sulla scala. Voi aprite il cancello.");
              say("zt_pippo", "Campione. Una cosa. Se la vedi, a Martina, raccontale il gol. Di testa, al novantesimo, nel 2011. Ma raccontalo meglio di come è stato: era un rimpallo.");
              say("voce", "Pippo si lega la fascia al braccio, scende tre gradoni e comincia a cantare il coro del Borgo, stonato, a squarciagola. La curva si gira verso di lui. Tutta.");
              say("voce", "L'ultima cosa che vedete è la sua schiena larga, in mezzo al viola, ferma. Un muro.");
              dopo();
            } }
          ]);
          function dopo() { K.crew.leave("zt_pippo"); setStep(N, 3); quest("zt_c3c", "Il cancello", "Parla con Gaspare, sotto il cancello: è ora dell'Assedio."); done(); }
        }
        if (F.is("zt_pippo_attesa")) { say("voce", "Da dietro la porta, Pippo canticchia una telecronaca: «…cross dalla destra, stacca Carrara, di testa… GOL!». Poi tossisce. Poi ricomincia."); return done(); }
        say("zt_pippo", "Il cancello è in cima. Io sto dietro di voi. È il mio mestiere."); done();
      },
      zt_gaspare() {
        if (K.rel.scene("zt_gaspare")) return;
        const s = S();
        if (s === 3 && F.is("zt_n3")) { say("zt_gaspare", "[serio] La chiave gira. Prima di uscire, pensa a cosa ti porti via da qui."); return K.say(H.flush(), () => H.bivio(() => fin())); }
        if (s === 3) {
          say("zt_gaspare", "[serio] La chiave entra. Il cancello cigola come una porta del Purgatorio. E tutta la curva, insieme, si gira verso di noi.");
          return ask("In fondo alla scalinata, uno grosso con la sciarpa al collo comincia a salire. Davanti a tutti.", [
            { label: "🧟 Si comincia · L'Assedio", sub: "Terza notte: la curva", big: true, fn: notte },
            { label: "🧍 Prima sistemo il Gruppo", sub: "Chi corre con te", fn: () => K.crew.pick(() => K.done(), true) },
            { label: "◂ Un momento", fn: done }
          ]);
        }
        say("zt_gaspare", s === 2 ? "Su, al cancello. Pippo ci copre le spalle, come sempre." : s >= 4 ? "Il parcheggio. Poi il pullman. Poi a letto, per una settimana." : "[pensa] In trent'anni non sono mai entrato in curva ospite. Il magazziniere non va in trasferta: resta a lavare le maglie."); done();
      }
    };
    // il cassetto di Ringhio
    function cassetto() {
      const s = S();
      if (s < 1) { say("voce", "Un cassetto chiuso. Non è roba tua. Non ancora."); return done(); }
      if (s > 1) { say("voce", "Il cassetto è aperto. Dentro è rimasta solo la lettera col francobollo. La lasci lì: è di qualcun altro."); return done(); }
      say("voce", "Il cassetto della scrivania di Ringhio. Dentro: un mazzo di chiavi con un portachiavi a forma di tamburo, una foto, un biglietto e una lettera con il francobollo già attaccato.");
      say("voce", "La foto: un uomo grosso, giovane, con un bambino sulle spalle. Sullo sfondo, la curva ospite di Borgo Marino. Dietro, a penna: «Davide, finale play-off 1998. Abbiamo perso. Ti sei addormentato al secondo tempo».");
      say("voce", "Il biglietto, su carta intestata «Bellotti Pirotecnica»: «Aldo, provalo tu per primo. Se va bene, la curva è tua per sempre. — B.»");
      K.learnLore("l_zt_ringhio"); K.learnLore("l_zt_lettera");
      say("zt_gaspare", "[triste] L'hanno usato come cavia. Il capo della curva. Quello a cui tutti davano retta. Se cantava lui, cantavano tutti.");
      say("zt_mimmo", "[serio] Trent'anni ci siamo odiati. Non sapevo niente di lui. Nemmeno che aveva un figlio.");
      F.set("zt_chiave_curva", true); setStep(N, 2);
      say("voce", "Prendi le chiavi del cancello. Il portachiavi a forma di tamburo pesa più del resto.");
      quest("zt_c3b", "La chiave", "Torna su, al cancello in cima alla curva.");
      done();
    }

    const stadio = Z.stadio(H, () => [], {
      doors: { "16,0": { to: "zt_tribuna", at: [16, 22] }, "17,0": { to: "zt_tribuna", at: [17, 22] }, "0,8": { to: "zt_curva", at: [16, 21] } },
      extra: [[16, 0, "q"], [17, 0, "q"], [2, 8, "Y"], [1, 8, "Y"], [0, 8, "q"]],
      act: { q: "Passa" },
      intro: [["voce", "Lo stadio, di nuovo. Il varco della curva ospite è a sinistra, a metà campo: una scaletta tra le transenne, in alto a sinistra."]]
    });
    const zones = {
      zt_stadio: stadio,
      zt_curva: {
        region: "curva", name: "La curva ospite", short: "Curva ospite", sub: "Gradoni, transenne, tamburi e ventimila sciarpe viola", bg: "zt_curva", time: "notte", w: 34, h: 24, base: "Y", start: [16, 21], travel: [16, 21],
        items: [[2, 3], [31, 7], [12, 15], [29, 19]], itemCos: "zt_c3",
        areas: [[14, 0, 19, 2, "Il cancello"], [1, 19, 9, 23, "Sotto la curva"], [0, 0, 33, 23, "La curva ospite"]],
        act: { q: "Torna in campo", n: "Leggi lo striscione", s: "Riprendi fiato", z: "Guarda gli zaini", G: "Guarda il cancello", K: "Guarda il tamburo", u: "Guarda la cassa" },
        flavor: { n: "Lo striscione della curva: «NOI NON MORIAMO MAI». Qualcuno, stanotte, l'ha preso troppo alla lettera.", z: "Zaini di trasferta. Panini al salame, un thermos di vino, un biglietto del pullman: «Valtorta–Borgo Marino, andata e ritorno». Il ritorno non timbrato.", K: "Un tamburo della curva, sfondato. Sulla pelle, a pennarello, decine di firme. Una dice «Davide, 8 anni».", G: "Il cancello della curva ospite. Catena, lucchetto, e una serratura grande come un pugno.", u: "Una cassa di fumogeni vuota. Sul coperchio: «B.P. · VigorVerde · lotto 7 · NON APRIRE IN LUOGHI CHIUSI»." },
        loot: { "9,7": { id: "zt_bossolo", text: "Un bossolo verde, schiacciato sotto un gradone. «B.P. · VigorVerde · lotto 7».", empty: "Il bossolo l'hai già preso." }, "25,15": { id: "zt_bossolo", text: "Un altro bossolo, ancora caldo, incastrato in una transenna. Qui ne hanno accesi parecchi.", empty: "Qui c'era un bossolo. È rimasto l'odore." } },
        doors: { "16,23": { to: "zt_stadio", at: [3, 8] }, "17,23": { to: "zt_stadio", at: [3, 8] } },
        npcs: (s) => {
          const L = [];
          if (s === 0) L.push({ id: "zt_mimmo", at: [17, 19] });
          if (s === 2) { L.push({ id: "zt_pippo", at: [15, 2] }); L.push({ id: "zt_gaspare", at: [18, 2] }); }
          if (s >= 3) L.push({ id: "zt_gaspare", at: [18, 2] });
          return L;
        },
        intro: [["voce", "La curva ospite. Gradoni di cemento fino al cielo, transenne, tamburi abbandonati. E loro: in piedi, fitti, viola e gialli, che ondeggiano a tempo di un coro che nessuno canta più."], ["voce", "In cima, il cancello. Sotto i gradoni, in basso a sinistra, una porticina con scritto «ULTRAS 1977 · PRIVATO»."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); put(16, 0, "G"); put(17, 0, "G");
          // transenne con i varchi delle scalinate
          [5, 9, 13, 17].forEach((y) => { lay(1, y, 32, y, "F"); [4, 16, 17, 28].forEach((x) => put(x, y, "Y")); });
          lay(0, 1, 0, 19, "a"); lay(33, 1, 33, 19, "a");
          // tamburi, fari, casse, zaini
          [[8, 3], [24, 3], [11, 11], [21, 7], [6, 15], [26, 11]].forEach(([x, y]) => put(x, y, "K"));
          put(1, 1, "I"); put(32, 1, "I"); put(1, 19, "I"); put(32, 19, "I");
          put(9, 7, "V"); put(25, 15, "V"); put(30, 3, "n"); put(13, 3, "z"); put(22, 15, "u"); put(30, 21, "s"); put(23, 19, "z");
          // sotto la curva: il bugigattolo di Ringhio
          lay(0, 20, 33, 23, "Y");
          house(2, 20, 7, 3, { door: [5, 22], roof: "#3b0764", wall: "#292524", chimney: false, enter: { to: "zt_sottocurva", at: [8, 8] } });
          put(16, 23, "q"); put(17, 23, "q");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow();
          // i gradoni: un bordo chiaro ogni riga, la folla fuori dalle scalinate
          g.save(); for (let y = 1; y <= 19; y++) { g.fillStyle = "rgba(231,229,228,.10)"; g.fillRect(d.X(1), d.Y(y) + 14, d.X(33) - d.X(1), 2); } g.restore();
          [[1, 3], [5, 15], [18, 27], [29, 32]].forEach(([a, b], i) => { [[1, 4], [6, 8], [10, 12], [14, 16], [18, 19]].forEach(([y0, y1], j) => { if (S() >= 4 && j < 2) return; Z.crowd(g, d, f, a, y0, b, y1, 5 + i * 7 + j * 3, ["#6d28d9", "#facc15", "#4c1d95"]); }); });
          H.fog(g, d, f, 34, 24);
          for (let i = 0; i < 3; i++) { const x = d.X([7, 20, 30][i]), y = d.Y([10, 4, 16][i]); g.fillStyle = `rgba(239,68,68,${0.5 + 0.3 * Math.sin(f / 3 + i)})`; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); for (let k = 0; k < 3; k++) { const t = (f / 2 + k * 14 + i * 9) % 40; g.fillStyle = `rgba(239,68,68,${0.25 - t / 170})`; g.beginPath(); g.arc(x + Math.sin(t / 8 + i) * 4, y - t * 0.7, 3 + t / 6, 0, 7); g.fill(); } }
          H.plaque(g, "▴ CANCELLO", d.X(17), d.Y(1) + 2, "#facc15"); H.plaque(g, "ULTRAS 1977", d.X(5) + 8, d.Y(20) + 2, "#c084fc"); H.plaque(g, "▾ CAMPO", d.X(17), d.Y(23), "#bef264");
          if (F.is("zt_pippo_minuto") && S() >= 3) { g.fillStyle = "#facc15"; g.fillRect(d.X(16) + 2, d.Y(5) + 6, 10, 3); g.fillStyle = "#1f5fbf"; g.fillRect(d.X(16) + 6, d.Y(5) + 6, 3, 3); }
        }
      },
      zt_sottocurva: {
        interior: true, region: "interno", name: "Il bugigattolo di Ringhio", short: "Bugigattolo", sub: "Sotto i gradoni: striscioni, foto, casse di fumogeni", bg: "zt_sottocurva", w: 16, h: 10, start: [8, 8], outside: ["zt_curva", 5, 23], base: "U",
        act: { T: "Guarda il tavolo", D: "Apri il cassetto", L: "Guarda le foto", K: "Guarda il tamburo", u: "Guarda le casse", b: "Siediti", n: "Leggi il calendario", z: "Guarda la branda" },
        flavor: { T: "Un tavolo con un fornelletto da campeggio, una moka e quattro tazzine sbeccate. Una ha scritto «CAPO».", L: "Quarant'anni di foto di curva. Cambiano i tifosi, cambiano le sciarpe, cambiano i capelli. In mezzo c'è sempre lo stesso uomo col megafono, che invecchia una foto alla volta.", K: "Il tamburo grande della curva. Ha una toppa di nastro adesivo sopra un'altra toppa di nastro adesivo.", u: "Casse di fumogeni con la sigla «B.P.». Due sono vuote. Una ha il coperchio forzato, come se qualcuno avesse avuto fretta.", b: "Una sedia pieghevole davanti a un televisorino. Accanto, un posacenere pieno e una scatola di pasticche per la pressione.", n: "Un calendario del cantiere navale di Valtorta, fermo a marzo di tre anni fa. Su un giorno, cerchiato in rosso: «ultimo turno».", z: "Una branda da campo con una coperta del Valtorta. Qualcuno, qui sotto, ci dormiva più spesso di quanto avrebbe ammesso." },
        npcs: () => (F.is("zt_pippo_attesa") && S() >= 3 ? [{ id: "zt_pippo", at: [12, 6] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 9, "U"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 9, "a"); lay(15, 0, 15, 9, "a"); lay(0, 9, 15, 9, "a"); put(8, 9, "v");
          lay(10, 2, 13, 2, "T"); put(13, 3, "D"); lay(2, 1, 6, 1, "L"); put(2, 5, "K"); put(1, 7, "u"); put(1, 8, "u"); put(6, 4, "b"); put(14, 7, "z"); put(9, 1, "n");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.fillStyle = `rgba(254,240,138,${0.1 + 0.05 * Math.sin(f / 5)})`; g.beginPath(); g.arc(d.X(8), d.Y(1), 50, 0, 7); g.fill(); H.plaque(g, "ULTRAS 1977 · PRIVATO", d.X(8), d.Y(0) + 6, "#c084fc"); }
      }
    };
    return {
      n: N, title: "La Curva", sub: "Ventimila voci senza fiato, una chiave sotto i gradoni e un muro che non si sposta",
      goal, start: "zt_curva", introBg: "zt_curva", zones, talk, obj: { "zt_sottocurva:D": () => cassetto() },
      intro: [["voce", "Il varco della curva ospite è una scaletta stretta tra due transenne. Dall'altra parte, un rumore che conoscete tutti: ventimila persone che respirano insieme. Solo che non respirano."], ["zt_gaspare", "[serio] Restiamo uniti. Se qualcuno si perde, non tornate a prenderlo. …No. Tornate a prenderlo. Ma in fretta."]]
    };
  }
  boot();
})();
