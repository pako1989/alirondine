// js/banda-c4.js - «BANDA DI PIAZZA» · Capitolo 4: Il Silenzio di Ciro
// Per Venezia serve un brano del Borgo: la Marcia della Rondine di Anselmo Rondi (1950), mai finita, sparsa in quattro fogli. Uno in archivio, uno nella scatola
// di Tonino (Ciro la apre solo per il bocchino del figlio), uno sotto la tomba di Rondi sul colle, l'ultimo lo tiene qualcuno che non lo dice. Al tramonto Ciro suona
// per Tonino (brano «Ritmo» sul colle). Alla fine si decide a chi va l'assolo di Venezia. Zone: piazza (con il colle a ovest), sala prove, casa di Ciro,
// archivio della banda (sottotetto del municipio, 14x10), il colle col cimitero dei pescatori e il faro (32x22).
(function () {
  "use strict";
  function boot() {
    const E = window.__bandaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__bandaH || !window.__bandaZ || !window.__bandaZ.casaciro || !E.api._has(3)) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__bandaH(K), Z = window.__bandaZ, { say, done, ask, wask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("bp_c4", { kind: "acc", label: "Garofano all'occhiello", val: "fiore", from: "Capitolo 4 di Banda di Piazza" });
    K.lore("l_rondi", { t: "Anselmo Rondi", d: "Fondatore della banda di Borgo Marino (1950). Pescatore, falegname, compositore a orecchio. Scrisse la Marcia della Rondine per il ritorno delle barche e non la finì mai: diceva che il finale l'avrebbe scritto il mare." });
    K.lore("l_marcia", { t: "La Marcia della Rondine", d: "Quattro fogli a matita: l'attacco, il trio, il ritornello e un finale che nessuno ha mai sentito. La banda la suona da settant'anni fermandosi a metà, come una frase lasciata in sospeso." });

    const FOGLI = ["bp_f1", "bp_f2", "bp_f3", "bp_f4"];
    const nf = () => FOGLI.filter((f) => F.is(f)).length;
    function foglio(id, txt) {
      if (F.is(id)) return false;
      F.set(id, true); K.bond("fogli", 1); K.learnLore("l_marcia");
      say("voce", `📜 ${txt}<br><b>Foglio della Marcia: ${nf()}/4</b>`);
      if (S() === 1 && F.is("bp_f1") && F.is("bp_f2") && F.is("bp_f3")) { setStep(N, 2); quest("bp_c4b", "Tre fogli su quattro", "Porta i fogli al Maestro, in sala prove."); say("voce", "Tre fogli. Ne manca uno: il finale. Il Maestro, in sala prove, saprà leggerli meglio di chiunque."); }
      return true;
    }
    const goal = (s) => ({
      0: "In piazza: Don Abele ti cerca vicino alla cassa armonica.",
      1: `Ritrova i fogli della Marcia (${nf()}/4): l'archivio nel sottotetto del municipio, la casa di Zio Ciro, la tomba di Anselmo Rondi sul colle (a ovest della piazza).`,
      2: "Porta i tre fogli al Maestro Ferrante, in sala prove (sotto San Rocco).",
      3: "Al tramonto, sul colle: Zio Ciro ti aspetta al cimitero dei pescatori.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 4 è concluso.");

    function fin() {
      setStep(N, 5); F.set("bp_c4_done", true);
      const m = K.reward("bp_c4", { coins: 110, cos: "bp_c4" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Il faro si accende sopra il colle. Giù, in piazza, qualcuno ha lasciato la radio della trattoria accesa: suona l'inno, male, come sempre."],
        ["bp_rocco", "Venezia, campione. Le valigie, gli strumenti, il ragù sottovuoto. E il Maestro che ha già scritto il programma dell'autobus, minuto per minuto. Pipì comprese."],
        ["voce", `<b>FINE DEL CAPITOLO 4 · «Il Silenzio di Ciro»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 5 ti aspetta: Venezia, un teatro, una giuria che non sorride e un vecchio compagno di classe del Maestro."]
      ]), () => K.openMain(), "bp_colle");
    }
    function assolo() {
      say("bp_rocco", "[serio] Campione, il Maestro me l'ha detto prima di salire: a Venezia, a metà marcia, c'è un assolo. Otto battute, uno solo davanti a tutti. Dice che decidi tu: sei quello che ha tenuto insieme questa banda.");
      return ask("Chi suona l'assolo a Venezia?", [
        { label: "🎺 Zio Ciro", sub: "La tromba che era muta da tre anni", big: true, fn: () => { F.set("bp_assolo_ciro", true); K.rel.add("bp_ciro", 3); say("bp_ciro", "[sorpreso] Io? Alla mia età? Davanti a mille veneziani?"); say("bp_ciro", "[pensa] ...Va bene. Ma lo suono al contrario. Per Tonino."); if (F.is("bp_m_bp_lilli")) say("bp_lilli", "[felice] Giusto così. Io faccio il controcanto. Di nascosto. Non è scritto. Lo scrivo io."); fin(); } },
        { label: "🎷 Lilli", sub: "Il clarinetto punk, la variazione non scritta", big: true, disabled: !F.is("bp_m_bp_lilli"), fn: () => { F.set("bp_assolo_lilli", true); K.rel.add("bp_lilli", 3); say("bp_lilli", "[sorpreso] Io? Davanti alla giuria che non sorride dal 1987?"); say("bp_lilli", "[felice] Allora sorriderà. O scapperà. In tutti e due i casi è un successo."); say("bp_ciro", "Brava, ragazza. Io sto dietro. Dietro si sente meglio."); fin(); } }
      ]);
    }
    function silenzio() {
      H.play("ciro", { title: "Il Silenzio di Ciro · sul colle", venue: "collina", mates: [{ id: "bp_ciro", n: "Zio Ciro" }] }, (r) => {
        F.set("bp_pace_ciro", true); H.join("bp_ciro", "Zio Ciro chiude la custodia, se la mette in spalla e cammina con voi.");
        if (r.win) { F.set("bp_ciro_suona", true); say("voce", "La tromba di Ciro sale sopra il colle, piano, poi più forte. Le barche al porto suonano la sirena una dopo l'altra, come facevano per Tonino."); say("bp_ciro", "[triste] Hai sentito? Le barche. Mi hanno risposto. Tre anni che aspettavo che qualcuno mi rispondesse."); }
        else { say("voce", "Ciro si ferma a metà, il fiato corto. Poi riprende da solo, senza la grancassa, senza nessuno. Lo lasci finire."); say("bp_ciro", "[triste] Non importa come è venuto. È venuto. Tonino rideva quando stonavo."); }
        setStep(N, 4); K.rel.add("bp_ciro", 2);
        assolo();
      });
    }

    const talk = {
      bp_abele() {
        if (K.rel.scene("bp_abele")) return;
        const s = S();
        if (s === 0) {
          say("bp_abele", "[serio] Figliolo, ho letto il regolamento di Venezia. Tre brani: uno d'obbligo, uno a scelta e uno «della tradizione del paese». Scritto da qualcuno del paese.");
          say("bp_abele", "Noi abbiamo la Marcia della Rondine. Anselmo Rondi, 1950. La suoniamo da settant'anni. A metà. Perché il resto non c'è.");
          say("bp_abele", "Dicono che i fogli siano sparsi. Uno nell'archivio, sopra il municipio: ho le chiavi, il Comune me le ha date «perché tanto è roba vecchia». Uno... lo sa Ciro. E Rondi è sepolto sul colle, a ovest. Lui aveva le sue abitudini.");
          setStep(N, 1); quest("bp_c4", "La Marcia della Rondine", "Ritrova i fogli della Marcia: archivio, casa di Ciro, il colle a ovest.");
          return done();
        }
        if (s === 1 && K.inZone("bp_archivio")) { say("bp_abele", F.is("bp_f1") ? "Hai trovato il foglio? Bene. Rimetti a posto le cartelline: l'ordine di quell'archivio è l'unico miracolo che ho visto in vita mia." : "L'archivio della banda. Settant'anni di spartiti divisi per festa. La Marcia della Rondine dovrebbe essere nel baule, sotto «Marce che non finiscono»."); return done(); }
        say("bp_abele", s <= 2 ? "Il Signore ha scritto il mondo in sette giorni. Rondi una marcia in settant'anni, e non l'ha finita. Ognuno ha i suoi tempi." : "Ho sentito una tromba, dal colle. Ho smesso di dire messa a metà. Il vescovo non lo saprà."); done();
      },
      bp_ciro() {
        if (K.rel.scene("bp_ciro")) return;
        const s = S();
        if (s >= 1 && s <= 2 && K.inZone("bp_casaciro")) {
          if (F.is("bp_f2")) { say("bp_ciro", "Al tramonto, sul colle. Dove c'è Tonino. Prima porta i fogli al Maestro: lui sa leggere quello che Anselmo scriveva storto."); return done(); }
          say("bp_ciro", "[serio] Ancora tu. Entra. Il Maestro ti manda? No? Meglio.");
          if (K.inv.has("bp_bocchino")) {
            K.inv.take("bp_bocchino");
            say("voce", "Gli dai il bocchino d'argento. Ciro lo guarda a lungo, poi legge l'incisione a voce bassa: «per le ultime note».");
            say("bp_ciro", "[triste] Il Maestro non l'ha venduto. Lo sapevo, sai? Lo sapevo e gliel'ho dato lo stesso. Per vedere se era un uomo o un metronomo.");
          } else say("bp_ciro", "[triste] Stanotte ho sognato Tonino. Suonava la marcia di Rondi e si fermava a metà, come tutti. Poi si girava e mi diceva: «e tu che aspetti?».");
          say("bp_ciro", "Tonino aveva una scatola. Ci teneva le cose della banda. Non l'ho mai aperta. Aprila tu.");
          say("voce", "Nella scatola di latta: un fischietto, una foto della banda a Venezia nel '72 con Ciro giovane, e un foglio di musica copiato a mano, con la calligrafia di un ragazzo.");
          foglio("bp_f2", "Il trio della Marcia, copiato da Tonino. In fondo: «papà, il finale lo scriviamo noi».");
          K.rel.add("bp_ciro", 3);
          say("bp_ciro", "[pensa] «Lo scriviamo noi». Al tramonto. Sul colle. Vieni. Porta la grancassa: Tonino diceva che la tromba da sola è una persona che parla al muro.");
          return done();
        }
        if (s === 3 && K.inZone("bp_colle")) {
          say("bp_ciro", "[triste] Eccolo, Tonino. «Antonio Esposito, pescatore, prima tromba». Hanno scritto «prima tromba» sulla lapide. L'ho chiesto io. Il prete non voleva, Don Abele sì.");
          const sera = K.clock && K.clock.is && K.clock.is("Sera");
          return ask(sera ? "Il sole tocca il mare. Ciro apre la custodia." : "Ciro guarda il sole, ancora alto. «Al tramonto», dice.", [
            sera ? { label: "🕯️ Il Silenzio, per Tonino", sub: "Brano lento sul colle · quota 50%", big: true, cls: "hot", fn: silenzio }
              : { label: "🌅 Aspetta il tramonto, seduto con lui", sub: "Passa il tempo fino a sera", big: true, cls: "hot", fn: () => { if (K.clock && K.clock.set) K.clock.set(K.clock.day(), 2); say("voce", "Restate seduti sul muretto. Il sole scende piano dietro il faro, e il mare diventa color rame."); silenzio(); } },
            { label: "◂ Un momento", fn: done }
          ]);
        }
        if (s === 4) return assolo();
        say("bp_ciro", s >= 4 ? "[felice] Venezia. Ci sono stato nel '72. Avevo i capelli. Tutti e due ce li avevamo, io e il Maestro: lui li aveva neri." : "[triste] Vai, ragazzo. Io resto qui, con la finestra socchiusa."); done();
      },
      bp_ferrante() {
        if (K.rel.scene("bp_ferrante")) return;
        const s = S();
        if (s === 2 && K.inZone("bp_sala")) {
          say("bp_ferrante", "[serio] Faccia vedere. L'attacco... il trio, copiato da un ragazzo... il ritornello, questo l'ha scritto Rondi col lapis da falegname. Lo riconosco. Riconosco la mano.");
          say("bp_ferrante", "[triste] Lo riconosco perché era il mio maestro. Avevo nove anni. Mi chiudeva fuori se arrivavo alle sette e uno. Il giorno prima di morire mi diede un foglio. «Finiscila tu», disse. «Tu che conti bene».");
          say("bp_ferrante", "Ci ho provato per trent'anni. Al conservatorio, a Vienna, di notte. Ogni finale che scrivevo era perfetto. E finto. Non l'ho mai fatto sentire a nessuno.");
          say("voce", "Il Maestro apre il registro delle presenze. Fra le pagine, un foglio ingiallito, piegato in quattro. La calligrafia è la stessa del ritornello.");
          return wask("«Questo è il finale che Rondi non ha finito. L'ultima pagina. Non so cosa farne. Lei cosa farebbe?»", [
            { label: "❤️ «La marcia è del Borgo, Maestro. La finiamo insieme.»", big: true, w: { cuore: 2 }, fn: () => { F.set("bp_pace_ferrante", true); K.rel.add("bp_ferrante", 3); foglio("bp_f4", "L'ultima pagina della Marcia, a matita, con una frase di Rondi in fondo: «il finale lo fa chi resta»."); say("bp_ferrante", "[pensa] Insieme. Non ho mai finito niente insieme a nessuno. Neanche il matrimonio, a dire la verità."); next(); } },
            { label: "🎼 «La tenga lei. Rondi l'ha data a lei.»", big: true, w: { rigore: 2 }, fn: () => { F.set("bp_fer_tiene", true); K.rel.add("bp_ferrante", 4); say("bp_ferrante", "[sorpreso] La tengo. Sì. Grazie. Nessuno mi aveva mai lasciato una cosa mia senza chiedermi niente in cambio."); say("bp_ferrante", "A Venezia suoneremo la marcia come sempre: fino a metà. E la giuria penserà che sia un'idea moderna."); next(); } }
          ]);
        }
        say("bp_ferrante", s <= 1 ? "Fogli? Quali fogli? Non so niente di fogli. Prove venerdì, alle sette meno cinque." : s === 3 ? "Al tramonto, sul colle. Ci vada. Io... io guarderò dalla finestra della sala. Da qui il colle si vede." : "[serio] Venezia. Il programma dell'autobus è pronto. Undici pagine."); done();
        function next() { setStep(N, 3); quest("bp_c4c", "Al tramonto", "Sul colle, al cimitero dei pescatori: Zio Ciro ti aspetta."); done(); }
      },
      bp_lilli() {
        if (K.rel.scene("bp_lilli")) return;
        if (F.is("bp_lilli_via") && !F.is("bp_m_bp_lilli")) {
          say("bp_lilli", "[triste] Ah. Sei tu. Quello che «ricominciamo, Maestro, tornerà da sola». Sono tornata da sola, vedi? In piazza. Non in banda.");
          return wask("Lilli fa finta di guardare la fontana.", [
            { label: "❤️ «Scusa. Dovevo venirti a cercare.»", big: true, w: { cuore: 1 }, fn: () => { K.rel.add("bp_lilli", 3); F.set("bp_lilli_via", false); H.join("bp_lilli", "Lilli torna nella banda e cammina dietro di te, la cresta ritta."); say("bp_lilli", "[felice] Scuse accettate. Le scuse sono come le variazioni: vanno fatte al momento giusto. Questo era un po' tardi, ma va bene."); done(); } },
            { label: "🎼 «La banda è più debole senza di te. Torna.»", big: true, w: { rigore: 1 }, fn: () => { K.rel.add("bp_lilli", 1); F.set("bp_lilli_via", false); H.join("bp_lilli", "Lilli torna nella banda. Cammina dietro di te, a due passi di distanza."); say("bp_lilli", "[pensa] Più debole. Almeno è un complimento tecnico. Va bene. Torno per la marcia, non per te."); done(); } }
          ]);
        }
        const s = S();
        say("bp_lilli", s <= 1 ? "La Marcia della Rondine finisce a metà. L'ho sempre odiata, per questo. È come una canzone punk senza l'ultimo accordo: ti lascia lì, col pugno alzato." : s <= 3 ? "Tre fogli! Fammi vedere il trio. ...Questo l'ha copiato un ragazzo. Aveva la mano storta. Si vede dalle code delle note." : "[felice] Una tromba sul colle. Io stavo in piazza e mi sono messa a piangere sul clarinetto. Non dirlo a nessuno: si gonfia l'ancia."); done();
      },
      bp_rocco() {
        if (K.rel.scene("bp_rocco")) return;
        const s = S();
        say("bp_rocco", s === 0 ? "Don Abele ti cerca. Ha la faccia di quando ha letto un regolamento. Quando legge un regolamento, poi lo applica. Spaventoso." : s <= 2 ? "Il colle? Si sale da ovest, dietro gli alberi. C'è il faro e il cimitero dei pescatori. Mio nonno è lì. Gli porto un sigaro ogni anno. Non fumava, ma ci teneva." : s === 3 ? "[serio] Stasera vado anch'io, sul colle. Mi metto in fondo, lontano. Il bombardino lo lascio a casa: certe cose non vanno accompagnate." : "[felice] Ciro suona! Quarantadue anni di banda e non ho mai sentito una tromba così. Me la sono registrata nella testa."); done();
      },
      bp_nana() {
        if (K.rel.scene("bp_nana")) return;
        say("bp_nana", S() <= 3 ? "La Marcia della Rondine! Nel '72 l'abbiamo suonata a Venezia fino a metà, e la giuria ha pensato che fosse un'avanguardia. Abbiamo vinto. Per sbaglio, ma abbiamo vinto." : "Ciro ha suonato. L'ho sentito dalla cucina. Ho bruciato il sugo, per la prima volta in quarant'anni. Ne è valsa la pena."); done();
      },
      bp_bracco() {
        if (K.rel.scene("bp_bracco")) return;
        say("bp_bracco", "Una marcia del 1950? Interessante. Molto... d'epoca. A Venezia la giuria vuole innovazione. La cassa, per dire, è molto innovativa."); done();
      }
    };

    const zones = {
      bp_piazza: Z.piazza(H, (s) => {
        const L = [{ id: "bp_rocco", at: [19, 14] }, { id: "bp_nana", at: [15, 7] }];
        if (s === 0) L.push({ id: "bp_abele", at: [21, 15] });
        if (F.is("bp_lilli_via") && !F.is("bp_m_bp_lilli")) L.push({ id: "bp_lilli", at: [16, 13] });
        if (s <= 1) L.push({ id: "bp_bracco", at: [24, 8] });
        return L;
      }, {
        time: "giorno", west: true, start: [15, 16], ciro: { to: "bp_casaciro", at: [6, 7] }, municipio: { to: "bp_archivio", at: [7, 8] },
        items: [[3, 10], [26, 17], [10, 12], [20, 10]], itemCos: "bp_c4",
        doors: { "0,12": { to: "bp_colle", at: [1, 9] }, "0,13": { to: "bp_colle", at: [1, 10] } },
        intro: [["voce", "Una settimana a Venezia. La piazza è piena di valigie lasciate per sbaglio sul selciato, di prove fuori orario e di gente che fischietta la marcia della banda."], ["voce", "Fischiettano tutti fino a metà. Poi si fermano, come se avessero dimenticato qualcosa."]]
      }),
      bp_sala: Z.sala(H, (s) => {
        const L = [{ id: "bp_ferrante", at: [8, 2] }];
        if (F.is("bp_m_bp_lilli")) L.push({ id: "bp_lilli", at: [5, 7] });
        return L;
      }),
      bp_casaciro: Z.casaciro(H, (s) => s <= 2 ? [{ id: "bp_ciro", at: [4, 4] }] : []),
      bp_archivio: {
        interior: true, region: "archivio", name: "L'archivio della banda", short: "Archivio", sub: "Il sottotetto del municipio: settant'anni di spartiti divisi per festa", bg: "bp_archivio", w: 14, h: 10, start: [7, 8], outside: ["bp_piazza", 23, 6], base: "=",
        items: [[12, 3]], itemCos: "bp_c4",
        act: { L: "Guarda gli scaffali", T: "Guarda il tavolo", D: "Guarda lo schedario", x: "Apri il baule", M: "Guarda il leggio", W: "Guarda dall'abbaino", n: "Leggi l'elenco" },
        flavor: { L: "Cartelline in fila: «Pasqua», «San Rocco», «Matrimoni (allegri)», «Matrimoni (così così)», «Funerali (con dignità)», «Derby (senza dignità)».", T: "Un tavolo da disegno con un lapis da falegname consumato fino al pollice. Accanto, una gomma a forma di rondine.", D: "Lo schedario dei musicanti dal 1950. Alla «E»: Esposito Ciro, tromba. Esposito Antonio, tromba. Il secondo cartellino ha l'angolo piegato.", M: "Un leggio con una marcia del 1961 e un appunto: «troppo veloce, i vecchi non ce la fanno». Firmato: «i vecchi».", W: "L'abbaino sulla piazza. Si vede la cassa armonica dall'alto: è una rondine, la pianta. Nessuno se n'era mai accorto.", n: "L'elenco dei concorsi vinti: Venezia 1972. Sotto, a penna: «e il resto della vita, che non si scrive»." },
        npcs: (s) => s >= 1 && s <= 2 ? [{ id: "bp_abele", at: [6, 6] }] : [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "="); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(1, 1, 5, 1, "L"); lay(8, 1, 12, 1, "L"); put(6, 0, "W"); put(7, 0, "W"); lay(3, 4, 5, 4, "T"); lay(1, 6, 1, 7, "D"); put(11, 6, "x"); put(9, 4, "M"); put(12, 8, "n");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); g.fillStyle = `rgba(255,236,180,${0.1 + 0.03 * Math.sin(f / 30)})`; g.beginPath(); g.moveTo(d.X(6), d.Y(1)); g.lineTo(d.X(8), d.Y(1)); g.lineTo(d.X(10), d.Y(8)); g.lineTo(d.X(4), d.Y(8)); g.fill(); for (let i = 0; i < 8; i++) { g.fillStyle = "rgba(255,240,200,.5)"; g.fillRect(d.X(5) + ((f / 3 + i * 23) % 60), d.Y(2) + ((i * 17 + f / 5) % 80), 1, 1); } g.restore(); H.plaque(g, "ARCHIVIO DELLA BANDA · 1950", d.X(7), d.Y(0) + 6, "#fde68a"); }
      },
      bp_colle: {
        region: "colle", name: "Il colle dei pescatori", short: "Colle", sub: "Il faro, il cimitero rivolto al mare e il tramonto sul golfo", bg: "bp_colle", time: "tramonto", w: 32, h: 22, base: "U", start: [1, 9], travel: [1, 9],
        items: [[8, 4], [27, 8], [11, 16], [19, 15]], itemCos: "bp_c4",
        areas: [[2, 1, 8, 7, "Il faro"], [16, 2, 30, 16, "Il cimitero dei pescatori"], [0, 17, 31, 21, "La scogliera"], [0, 0, 31, 21, "Il colle"]],
        act: { q: "Torna in piazza", X: "Leggi la lapide", I: "Guarda il cipresso", b: "Siediti sul muretto", l: "Guarda il lampione", n: "Leggi il cartello", u: "Guarda la fioraia", s: "Riposa un momento", r: "Guarda la scogliera", w: "Guarda il mare" },
        flavor: { X: "Una lapide di pescatore, con una barca incisa e una data. Tutte guardano la stessa onda.", I: "Un cipresso. Il vento del mare lo pettina sempre dalla stessa parte.", b: "Il muretto sul golfo. Da qui si vedono le barche rientrare, una dopo l'altra.", l: "Un lampione storto dal vento. La lampadina è nuova, il palo del 1950.", n: "«CIMITERO DEI PESCATORI · si prega di non disturbare il mare».", u: "La fioraia del colle: garofani rossi, crisantemi e un secchio di margherite «per chi non sa cosa portare».", r: "Gli scogli. Il mare ci arriva bianco e se ne va verde.", w: "Il golfo al tramonto. Le barche rientrano col motore al minimo." },
        npcs: (s) => {
          const L = [];
          if (s === 3) L.push({ id: "bp_ciro", at: [24, 5] }, { id: "bp_rocco", at: [12, 12] });
          if (s >= 4) L.push({ id: "bp_ciro", at: [24, 5] });
          return L;
        },
        doors: { "0,9": { to: "bp_piazza", at: [1, 12] }, "0,10": { to: "bp_piazza", at: [1, 13] } },
        intro: [["voce", "Il colle a ovest del Borgo. Un sentiero fra i fichi d'India, il faro bianco e rosso, e in cima il piccolo cimitero dei pescatori, rivolto al mare."], ["voce", "Le lapidi guardano tutte la stessa onda. Da qui le barche si vedono rientrare, una dopo l'altra."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 1, 0, 17, "t"); lay(31, 1, 31, 17, "t"); lay(0, 18, 31, 18, "r"); put(0, 18, "t"); put(31, 18, "t"); lay(0, 19, 31, 21, "w");
          put(0, 9, "q"); put(0, 10, "q");
          lay(1, 9, 14, 10, ":"); lay(13, 5, 14, 15, ":"); lay(2, 17, 30, 17, ":");
          house(3, 1, 4, 5, { door: [5, 5], roof: "#b91c1c", wall: "#f8fafc", enter: "Il faro. Dentro, una scala a chiocciola e il guardiano che ascolta la radio. «La banda? Mio padre suonava il clarino. Male. Il faro, invece, non stona mai»." });
          // il cimitero: muro con il cancello a ovest
          lay(16, 2, 30, 2, "a"); lay(16, 16, 30, 16, "a"); lay(16, 2, 16, 16, "a"); lay(30, 2, 30, 16, "a"); put(16, 9, "+"); put(16, 10, "+"); lay(17, 9, 29, 10, "+");
          [18, 20, 22, 24, 26, 28].forEach((x) => { put(x, 4, "X"); put(x, 14, "X"); }); [18, 20, 26, 28].forEach((x) => put(x, 6, "X")); [18, 20, 22, 24, 26, 28].forEach((x) => put(x, 12, "X"));
          [[17, 3], [29, 3], [17, 15], [29, 15], [23, 7]].forEach(([x, y]) => put(x, y, "I"));
          [[9, 7], [2, 13], [10, 3], [27, 18]].forEach(([x, y]) => put(x, y, "t"));
          put(8, 16, "b"); put(9, 16, "b"); put(3, 16, "b"); put(4, 16, "b"); put(15, 8, "l"); put(15, 11, "l"); put(12, 8, "n"); put(11, 12, "u"); put(6, 14, "s");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(), fx = d.X(5) + 8, fy = d.Y(1) - 10;
          // il fascio del faro che gira e i lumini sulle lapidi
          g.save(); const a = f / 90; g.fillStyle = "rgba(254,240,138,.10)"; g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + Math.cos(a) * 220, fy + Math.sin(a) * 60 - 20); g.lineTo(fx + Math.cos(a + 0.18) * 220, fy + Math.sin(a + 0.18) * 60 - 20); g.fill();
          g.fillStyle = "#fde047"; g.beginPath(); g.arc(fx, fy, 3, 0, 7); g.fill();
          [[24, 4], [22, 12]].forEach(([x, y], i) => { const X = d.X(x) + 8, Y = d.Y(y) + 13; g.fillStyle = `rgba(253,186,116,${0.5 + 0.3 * Math.sin(f / 7 + i * 2)})`; g.beginPath(); g.arc(X, Y, 1.6, 0, 7); g.fill(); g.fillStyle = "rgba(253,186,116,.12)"; g.beginPath(); g.arc(X, Y, 8, 0, 7); g.fill(); });
          g.restore();
          H.plaque(g, "CIMITERO DEI PESCATORI", d.X(23) + 8, d.Y(2) - 4, "#fdba74"); H.plaque(g, "◂ PIAZZA", d.X(1) + 8, d.Y(8) - 6, "#fde68a"); H.plaque(g, "IL FARO", d.X(5), d.Y(1) - 4, "#fca5a5");
        }
      }
    };
    const obj = {
      "bp_archivio:x": () => {
        if (S() < 1) { say("voce", "Un baule con la scritta «MARCE CHE NON FINISCONO». È chiuso con un lucchetto a forma di chiave di violino."); return done(); }
        if (!foglio("bp_f1", "Nel baule, sotto settant'anni di marce interrotte: l'attacco della Marcia della Rondine, firmato «A. R. 1950». A margine: «manca il finale. Chiedere a C.»")) say("voce", "Il baule delle marce che non finiscono. Una ce n'è di meno, adesso.");
        done();
      },
      "bp_colle:X:22,12": () => {
        say("voce", "«ANSELMO RONDI · 1898-1962 · fondò la banda, non finì la marcia». Ai piedi della lapide, un vaso di latta per i fiori.");
        if (S() >= 1 && !F.is("bp_f3")) { foglio("bp_f3", "Sotto il vaso, in una busta di cerata: il ritornello della Marcia, scritto col lapis da falegname. «Per chi viene a trovarmi. A. R.»"); return done(); }
        if (S() < 1) say("voce", "Il vaso è pieno di terra secca. Qualcuno ci ha piantato una nota di plastica, al posto del fiore.");
        done();
      },
      "bp_colle:X:24,4": () => { say("voce", "«ANTONIO ESPOSITO · TONINO · pescatore, prima tromba». Accanto alla foto, un bocchino di plastica da bambini, sbiadito dal sole."); done(); }
    };
    return {
      n: N, title: "Il Silenzio di Ciro", sub: "Quattro fogli a matita, un colle sul mare e una tromba che non suona da tre anni",
      goal, start: "bp_piazza", introBg: "bp_colle", zones, talk, obj,
      intro: [["voce", "Un mese a Venezia. Il regolamento del concorso chiede un brano «della tradizione del paese»."], ["voce", "A Borgo Marino la tradizione è una marcia che si ferma a metà. E una tromba chiusa in una custodia."]]
    };
  }
  boot();
})();
