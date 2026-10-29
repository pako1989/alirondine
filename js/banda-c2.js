// js/banda-c2.js - «BANDA DI PIAZZA» · Capitolo 2: San Rocco sotto la pioggia
// La processione del patrono: senza prima tromba la banda rischia di essere sostituita dal furgone di SuonoSmart. Si bussa alla porta di Zio Ciro,
// si litiga col Maestro per una variazione di Lilli e si sfila sotto la pioggia (brano «Ritmo» in modalità sfilata, col passo).
// Zone: piazza (di mattina, con la casa di Ciro aperta e il corso a est), casa di Zio Ciro (12x9), il corso sotto la pioggia (34x22).
(function () {
  "use strict";
  function boot() {
    const E = window.__bandaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__bandaH || !window.__bandaZ || !E.api._has(1)) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__bandaH(K), Z = window.__bandaZ, { say, done, ask, wask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("bp_c2", { kind: "acc", label: "Berretto della Banda", val: "berretto", from: "Capitolo 2 di Banda di Piazza" });
    K.lore("l_tonino", { t: "Tonino Esposito", d: "Il figlio di Zio Ciro. Pescatore, trent'anni, tromba della banda dai dodici. Teneva lo strumento al contrario per via della mano sinistra. Una sera d'inverno il mare non l'ha restituito." });
    K.lore("l_sanrocco", { t: "La processione di San Rocco", d: "Da settant'anni la banda accompagna il patrono dal sagrato al porto, sotto il sole o sotto la pioggia. Una volta sola non ha suonato: nel 1966, per l'alluvione. E anche allora, dicono, qualcuno fischiettava." });

    const goal = (s) => ({
      0: "In piazza: parla col Maestro Ferrante, vicino alla cassa armonica.",
      1: "Bussa alla casa di Zio Ciro (la casa stretta con le persiane verdi, in alto a destra).",
      2: "Vai sul corso (a est della piazza): la processione sta per partire. Parla con Lilli e poi con Don Abele.",
      3: "Dopo la processione: parla col Maestro, in fondo al corso.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      setStep(N, 4); F.set("bp_c2_done", true);
      const m = K.reward("bp_c2", { coins: 90, cos: "bp_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["bp_abele", "[felice] San Rocco è arrivato al porto asciutto. Noi un po' meno. Ma il Signore apprezza anche le divise bagnate."],
        ["bp_rocco", "Hai sentito, prima, dalla finestra in piazza? Una nota. Una sola. Lunga. Io non dico niente. Ma era un si bemolle, e lo conosco."],
        ["bp_ferrante", "[serio] Fra tre settimane c'è il derby. La banda contro la cassa, davanti a tutto lo stadio. Chi non sa il suo tempo a memoria, lo impari. Chi lo sa, lo dimentichi e lo reimpari."],
        ["voce", `<b>FINE DEL CAPITOLO 2 · «San Rocco sotto la pioggia»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 3 ti aspetta: lo stadio, il derby e una cassa con il led blu."]
      ]), () => K.openMain(), "bp_corso");
    }

    function sfilata() {
      H.play("pioggia", { title: "San Rocco sotto la pioggia · la sfilata" }, (r) => {
        if (r.win) {
          F.set("bp_sfilata_ok", true); setStep(N, 3); K.learnLore("l_sanrocco"); quest("bp_c2c", "In fondo al corso", "Parla col Maestro davanti alla chiesetta del porto.");
          say("voce", "La processione arriva al porto sotto la pioggia, a passo pari. Dagli ombrelli parte un applauso bagnato.");
          say("bp_abele", r.a >= 85 ? "[felice] Perfetti! Perfino i piatti, e i piatti ero io." : "[ride] Arrivati! Un po' storti, ma arrivati. Come i pescatori.");
          if (F.is("bp_ciro_ascolto")) say("voce", "Mentre la banda passava sotto le persiane verdi, una persiana si è aperta di due dita. Solo due.");
          return done();
        }
        say("bp_ferrante", "[arrabbiato] Fermi. FERMI. Il santo è andato avanti da solo. Si ricomincia dal sagrato. Il passo, gente: il PASSO.");
        say("bp_rocco", "Le barre gialle, campione. Passo, passo. È come la corsa di riscaldamento, solo con la grancassa addosso."); done();
      });
    }

    const talk = {
      bp_ferrante() {
        if (K.rel.scene("bp_ferrante")) return;
        const s = S();
        if (s === 0) {
          say("bp_ferrante", "[serio] Oggi c'è la processione di San Rocco. L'assessore ha detto che se la banda non è al completo, il furgone di SuonoSmart accompagna il santo con la marcia registrata.");
          say("bp_ferrante", "Il santo registrato. Con gli applausi in coda. Mi rifiuto.");
          say("bp_ferrante", "Ci manca una prima tromba. Ce n'è una sola in questo paese, ed è chiusa in una custodia, in quella casa con le persiane verdi. Esposito. Ciro Esposito.");
          setStep(N, 1); quest("bp_c2", "La tromba chiusa", "Bussa alla casa di Zio Ciro, in alto a destra nella piazza.");
          return wask("«Lei è nuovo, quindi non ha ancora litigato con nessuno. Vada lei.»", [
            { label: "🎼 «Vado. E lo porto.»", w: { rigore: 1 }, fn: () => { say("bp_ferrante", "Non lo porti. Lo inviti. È diverso. Io non l'ho mai capito."); done(); } },
            { label: "❤️ «Vado. Ma non lo forzo.»", w: { cuore: 1 }, fn: () => { say("bp_ferrante", "[pensa] Non forzare. Sì. È quello che dicono tutti, di me. Che forzo."); done(); } }
          ]);
        }
        if (s === 3) {
          say("bp_ferrante", "[serio] Abbiamo finito. Il santo è al porto, la cassa è rimasta sul furgone. Per oggi.");
          say("bp_ferrante", "Tenga. Questo è di Tonino, il figlio di Ciro. Il bocchino della sua tromba. Ciro me l'ha dato due anni fa, «per venderlo». Non l'ho venduto. Non so perché.");
          K.inv.give("bp_bocchino"); K.learnLore("l_tonino");
          say("voce", "Ottieni il Bocchino d'argento. Dentro c'è un'incisione: «T. — per le ultime note».");
          say("bp_ferrante", "Glielo riporti lei, quando sarà il momento. Non oggi. Oggi Ciro ha aperto due dita di persiana, e due dita bastano.");
          say("bp_ferrante", "[arrabbiato] Signorina Lilli. La sua «variazione» di oggi. Davanti al santo. Le note che non sono scritte sono note rubate.");
          say("bp_lilli", "[arrabbiato] Erano note di più, non rubate! La gente batteva le mani!");
          say("bp_ferrante", "La gente batte le mani anche al circo. Alla prossima nota sua, la mando a suonare il kazoo alle feste dell'Unità.");
          return wask("Lilli ha le lacrime agli occhi e la cresta afflosciata dalla pioggia. Tutta la banda guarda te.", [
            { label: "❤️ «Maestro, la piazza ha ballato. Per me Lilli ha ragione.»", big: true, w: { cuore: 2 }, fn: () => { F.set("bp_difeso_lilli", true); K.rel.add("bp_lilli", 4); say("bp_ferrante", "[sorpreso] ...La piazza ha ballato. Ah. Lo segno nel registro. Alla voce «incidenti»."); say("bp_lilli", "[felice] Grazie. Nessuno mi aveva mai difeso davanti a lui. Neanche il mio clarinetto."); fin(); } },
            { label: "🎼 «Le note scritte, Lilli. Almeno fino al derby.»", big: true, w: { rigore: 2 }, fn: () => { F.set("bp_zitto_lilli", true); K.rel.add("bp_ferrante", 3); say("bp_lilli", "[triste] Anche tu. Va bene. Suono le note scritte. Le suono talmente scritte che ti sembreranno stampate."); say("bp_ferrante", "Grazie. Ha capito. Lei, almeno."); fin(); } }
          ]);
        }
        say("bp_ferrante", s === 1 ? "Le persiane verdi. Non bussi forte: Ciro ha le orecchie di un trombettista, sente anche i pensieri." : s === 2 ? "Il corso è a est. La processione parte quando lo dice Don Abele. Cioè quando lo dico io a Don Abele." : "Si cammina. A tempo."); done();
      },
      bp_ciro() {
        if (K.rel.scene("bp_ciro")) return;
        const s = S();
        if (s === 1 && K.inZone("bp_casaciro")) {
          say("bp_ciro", "[serio] Chi è? Ah. Il calciatore. Quello della grancassa. Rocco me l'aveva detto. Entra, chiudi, che la pioggia mi entra nelle ossa.");
          say("bp_ciro", "So perché sei qui. San Rocco. La processione. La banda senza tromba. Lo so. Lo sento da qui, il Maestro che conta i secondi.");
          say("bp_ciro", "[triste] Io non suono. Non suono più. L'ultima volta che ho preso la tromba era il giorno del funerale di mio figlio. Ho soffiato e non è uscito niente. Niente.");
          return wask("Zio Ciro guarda la custodia aperta sul tavolo. L'ottone è lucido, come se qualcuno lo pulisse ogni sera.", [
            { label: "❤️ Ti siedi accanto a lui e non dici niente", sub: "Il silenzio, per un po'", big: true, w: { cuore: 2 }, fn: () => { F.set("bp_ciro_ascolto", true); K.rel.add("bp_ciro", 4); say("voce", "Restate seduti. La pioggia batte sui vetri a tempo di marcia lenta. Dopo un po', Ciro parla."); say("bp_ciro", "Tonino la teneva al contrario, la tromba. Per via della mano. Gli dicevano che non era cosa per lui. Lui suonava meglio di me. Me lo diceva, anche. Aveva ragione."); say("bp_ciro", "[pensa] Vai. Vai alla processione. Io... io resto qui. Ma lascio la finestra socchiusa, va bene? Solo questo."); setStep(N, 2); quest("bp_c2b", "La processione", "Vai sul corso, a est della piazza."); done(); } },
            { label: "🎼 «La banda ha bisogno della sua tromba. Oggi.»", big: true, w: { rigore: 2 }, fn: () => { F.set("bp_ciro_forzato", true); say("bp_ciro", "[arrabbiato] Bisogno! La banda ha bisogno! E mio figlio aveva bisogno del mare calmo, quella sera. Il bisogno non conta niente, ragazzo."); say("bp_ciro", "Fuori. Fuori, per piacere. Dite al Maestro che il santo arriva al porto anche senza di me. È sempre arrivato."); setStep(N, 2); quest("bp_c2b", "La processione", "Vai sul corso, a est della piazza."); done(); } }
          ]);
        }
        say("bp_ciro", s < 1 ? "(Dalla finestra, nessuna risposta.)" : "[triste] Vai, ragazzo. La processione non aspetta. Non ha mai aspettato nessuno, neanche il santo."); done();
      },
      bp_rocco() {
        if (K.rel.scene("bp_rocco")) return;
        const s = S();
        say("bp_rocco", s === 0 ? "Processione! Divise lavate, scarpe lucide, ombrello vietato. Il Maestro dice che l'ombrello è un contrattempo." : s === 1 ? "Da Ciro? Coraggio. Ci sono andato io per tre anni. Mi ha offerto il caffè sempre, e la tromba mai." : s === 2 ? "[ride] Piove. Il bombardino si riempie d'acqua e fa i gargarismi. Sembra un tricheco con l'influenza." : "Asciughiamoci dalla Nanà, dopo. Lei asciuga tutto: le divise, i capelli e i cuori."); done();
      },
      bp_lilli() {
        if (K.rel.scene("bp_lilli")) return;
        const s = S();
        if (s === 2 && !F.is("bp_lilli_var")) {
          F.set("bp_lilli_var", true);
          say("bp_lilli", "[furbo] Senti. Al ponticello, quando il santo gira, la marcia fa otto battute tutte uguali. Io ci metto una variazione. Quattro note in più. Punk. Al santo piacerà.");
          say("bp_lilli", "Il Maestro non lo sa. Se mi copri col rullante, non se ne accorge. Forse.");
          return wask("Lilli ti guarda da sotto la cresta bagnata.", [
            { label: "❤️ «Suonala. Ti copro io.»", w: { cuore: 1 }, fn: () => { F.set("bp_var_si", true); K.rel.add("bp_lilli", 2); say("bp_lilli", "[felice] Sapevo che eri dei nostri! Rullante forte al ponticello, mi raccomando."); done(); } },
            { label: "🎼 «Le note scritte, Lilli. Oggi no.»", w: { rigore: 1 }, fn: () => { say("bp_lilli", "[arrabbiato] Uff. Va bene, oggi no. Ma un giorno sì. Te lo giuro sulla cresta."); done(); } }
          ]);
        }
        say("bp_lilli", s < 2 ? "Piove. La mia cresta resiste. Il clarinetto un po' meno." : s === 2 ? "Quando parte Don Abele, si parte. Guarda il Maestro, non le pozzanghere." : "(Lilli si strizza la cresta e non ti guarda.)"); done();
      },
      bp_abele() {
        if (K.rel.scene("bp_abele")) return;
        const s = S();
        if (s === 2) {
          say("bp_abele", "Figliolo, siamo pronti. Il santo sotto il baldacchino, i portatori sotto il santo, e la banda sotto la pioggia. È la gerarchia celeste.");
          if (!F.is("bp_lilli_var")) say("bp_abele", "Lilli voleva dirti qualcosa, mi pare. Ha la faccia di chi ha un'idea. Le idee di Lilli fanno rumore.");
          return ask("La processione parte dal sagrato e arriva al porto.", [
            { label: "☔ Si parte: sfilata", sub: "Brano a tempo col passo · quota 58%", big: true, cls: "hot", fn: sfilata },
            { label: "🎒 Prima controlla lo zaino", sub: "Gli oggetti con «tempo» allargano un po' le finestre", fn: () => { say("voce", K.inv.bonus("te") ? "Qualcosa nello zaino ticchetta. Le note sembrano un po' più larghe." : "Nello zaino niente che ticchetti. Ma le braccia ci sono."); done(); } },
            { label: "◂ Un momento", fn: done }
          ]);
        }
        say("bp_abele", s < 2 ? "San Rocco ci aspetta sul corso. È un santo paziente: protegge dalla peste, non dai ritardi." : "Bella processione. Io ho perso il ritmo una volta, ma ho fatto finta di benedire."); done();
      },
      bp_bracco() {
        if (K.rel.scene("bp_bracco")) return;
        say("bp_bracco", S() <= 2 ? "Il furgone è pronto! Se la banda non ce la fa, SuonoSmart accompagna il santo. A norma, senza pioggia: il furgone è coperto." : "[sorpreso] Bella processione. Molto... tradizionale. Ne parleremo al derby."); done();
      },
      bp_gigi() {
        if (K.rel.scene("bp_gigi")) return;
        say("bp_gigi", S() <= 2 ? "Ho la marcia di San Rocco in tre versioni: allegra, solenne e «festa patronale con fuochi». Non so quale scegliere. Nessuno me l'ha mai chiesto." : "[pensa] Il passo della banda sotto la pioggia... Il furgone non lo sa fare. Il furgone non si bagna. Forse è quello il punto."); done();
      },
      bp_nana() {
        if (K.rel.scene("bp_nana")) return;
        say("bp_nana", S() <= 2 ? "Ho preparato le asciugamani e il brodo. Andate, che San Rocco non aspetta! Io guardo dalla finestra e piango un po', come ogni anno." : "Brodo per tutti! Anche per il Maestro, se lo chiede con educazione. Cioè mai."); done();
      }
    };

    const zones = {
      bp_piazza: Z.piazza(H, (s) => {
        const L = [{ id: "bp_ferrante", at: [21, 15] }, { id: "bp_nana", at: [15, 7] }];
        if (s <= 1) L.push({ id: "bp_rocco", at: [19, 14] });
        return L;
      }, {
        time: "giorno", east: true, start: [15, 16], ciro: { to: "bp_casaciro", at: [6, 7] },
        items: [[7, 16], [27, 9], [12, 9], [29, 18]], itemCos: "bp_c2",
        doors: { "31,12": { to: "bp_corso", at: [1, 10] }, "31,13": { to: "bp_corso", at: [1, 11] } },
        flavor: { P: "La cassa armonica sotto il cielo grigio. Il tetto verde gocciola a tempo, più o meno." },
        intro: [["voce", "Domenica mattina. Il cielo è grigio, la piazza è lucida di pioggia e le campane di San Rocco suonano in anticipo, come sempre."], ["voce", "Il Maestro Ferrante aspetta sotto la cassa armonica, l'unico posto asciutto della piazza. Ha già guardato l'orologio tre volte."]]
      }),
      bp_casaciro: Z.casaciro(H, () => [{ id: "bp_ciro", at: [4, 4] }]),
      bp_corso: {
        region: "corso", name: "Il corso sotto la pioggia", short: "Corso", sub: "Dal sagrato al porto, tra ombrelli e luminarie spente", bg: "bp_corso", time: "giorno", w: 34, h: 22, base: ",", start: [2, 10], travel: [2, 10],
        items: [[9, 6], [22, 15], [30, 8], [15, 17]], itemCos: "bp_c2",
        areas: [[0, 8, 6, 13, "L'imbocco del corso"], [14, 8, 22, 13, "Il ponticello"], [26, 1, 32, 8, "La chiesetta del porto"], [0, 17, 33, 21, "Il porto"], [0, 0, 33, 21, "Il corso"]],
        act: { q: "Entra", u: "Guarda la bancarella", l: "Guarda il lampione", n: "Leggi il manifesto", b: "Siediti", A: "Guarda l'altoparlante", t: "Guarda l'albero", s: "Riposa un momento", x: "Apri la cassa", z: "Guarda le casse", w: "Guarda il mare" },
        flavor: { u: "Una bancarella di torroni e santini. Sotto la tenda, il venditore ti offre un santino di San Rocco «col cane, che porta bene».", l: "Un lampione con le luminarie della festa, spente per la pioggia. Una lucina si ostina.", n: "Il manifesto: «FESTA DI SAN ROCCO · PROCESSIONE ORE 11 · BANDA CITTÀ DI BORGO MARINO». Sotto, un adesivo: «oppure SuonoSmart».", b: "Una panchina bagnata. Ci si siede solo per dovere.", A: "Il furgone di SuonoSmart con due casse sul tetto. Sul fianco: «L'emozione, senza errori». Sotto, a pennarello: «e senza cuore».", t: "Un platano. Sotto, l'unico ombrello concesso: quello del santo.", z: "Casse di bottiglie della festa, impilate sotto un telo.", w: "Il porto: barche ferme, cime tese e il mare grigio che respira piano." },
        doors: { "0,10": { to: "bp_piazza", at: [30, 12] }, "0,11": { to: "bp_piazza", at: [30, 13] } },
        npcs: (s) => {
          const L = [{ id: "bp_ferrante", at: s >= 3 ? [27, 10] : [11, 9] }, { id: "bp_abele", at: s >= 3 ? [25, 11] : [17, 11] }, { id: "bp_bracco", at: [24, 14] }, { id: "bp_gigi", at: [22, 13] }];
          if (s === 2) L.push({ id: "bp_lilli", at: [7, 11] });
          if (s >= 3) L.push({ id: "bp_lilli", at: [28, 12] });
          return L;
        },
        intro: [["voce", "Il corso di Borgo Marino scende dal sagrato al porto. Piove fitto: ombrelli ovunque, luminarie spente, il santo sotto il baldacchino."], ["voce", "In fondo, davanti alla chiesetta del porto, il furgone di SuonoSmart aspetta col motore acceso."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 19, 33, 21, "w"); lay(0, 17, 33, 18, ":"); lay(0, 9, 33, 12, "+"); lay(16, 13, 18, 16, "+");
          house(2, 1, 5, 5, { door: [4, 5], roof: "#9a3412", wall: "#e7c9a0", enter: "La merceria Bassi. Sulla vetrina: «Divise da banda, bottoni dorati, pazienza (su ordinazione)»." });
          house(8, 1, 4, 4, { door: [10, 4], roof: "#7c2d12", wall: "#d9a77a", enter: "Il forno. Dentro odora di pane e di zucchero a velo per i dolci del santo. La fornaia ti saluta con le mani bianche." });
          house(13, 1, 6, 5, { door: [16, 5], roof: "#57534e", wall: "#f0d9b5", enter: "Casa Rondi. Una targa: «Qui visse il Maestro Anselmo Rondi, fondatore della banda». Le finestre sono murate da anni." });
          house(20, 1, 5, 4, { door: [22, 4], roof: "#9a3412", wall: "#c98a5c", enter: "Il barbiere Totò. Sulla porta: «Chiuso per processione, riapre per la partita»." });
          house(26, 1, 7, 6, { door: [29, 6], roof: "#1e3a8a", wall: "#e5e7eb", enter: "La chiesetta del porto. Dentro, cento ex voto di pescatori: barche in tempesta, onde dipinte, una tromba d'argento appesa a un chiodo." });
          house(2, 13, 5, 4, { door: [4, 16], roof: "#7c2d12", wall: "#e8b98a", enter: "Una casa con il balcone pieno di gerani. Una signora agita un fazzoletto bianco verso la banda, da tre generazioni." });
          house(23, 15, 4, 2, { door: [24, 16], roof: "#334155", wall: "#475569", enter: "Il deposito delle reti. Odore di catrame e di sale." });
          [[1, 8], [8, 8], [19, 8], [25, 8], [32, 8], [1, 13], [10, 13], [20, 13], [31, 13]].forEach(([x, y]) => put(x, y, "l"));
          [[12, 14], [13, 14], [28, 14]].forEach(([x, y]) => put(x, y, "u")); put(6, 8, "n"); put(14, 15, "b"); put(30, 14, "s"); put(32, 16, "x");
          put(26, 13, "A"); put(27, 13, "A"); [[8, 15], [9, 15]].forEach(([x, y]) => put(x, y, "z")); [[0, 14], [33, 14], [19, 16]].forEach(([x, y]) => put(x, y, "t"));
          put(0, 10, "q"); put(0, 11, "q");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(), bx = d.X(16), by = d.Y(10);
          // il baldacchino del santo sul ponticello
          g.save(); g.fillStyle = "#facc15"; g.fillRect(bx - 4, by - 26, 40, 4); for (let i = 0; i < 4; i++) { g.fillStyle = "#e5e7eb"; g.fillRect(bx - 2 + i * 12, by - 22, 2, 20); } g.fillStyle = "#e7d7b5"; g.beginPath(); g.arc(bx + 16, by - 12, 5, 0, 7); g.fill(); g.fillStyle = "#7c2d12"; g.fillRect(bx + 12, by - 8, 8, 8);
          for (let i = 0; i < 7; i++) { g.fillStyle = `rgba(253,224,71,${0.4 + 0.3 * Math.sin(f / 10 + i)})`; g.beginPath(); g.arc(bx - 2 + i * 6, by - 22, 1, 0, 7); g.fill(); } g.restore();
          H.plaque(g, "◂ PIAZZA", d.X(1) + 8, d.Y(9) - 6, "#fde68a"); H.plaque(g, "CHIESETTA DEL PORTO", d.X(29) + 8, d.Y(1) - 6, "#93c5fd"); H.plaque(g, "CASA RONDI", d.X(16) + 8, d.Y(1) - 6, "#fde68a"); H.plaque(g, "SUONOSMART", d.X(26) + 16, d.Y(13) - 6, "#7dd3fc");
        }
      }
    };
    return {
      n: N, title: "San Rocco sotto la pioggia", sub: "Una processione, una persiana verde e una variazione non scritta",
      goal, start: "bp_piazza", introBg: "bp_corso", zones, talk, obj: {},
      intro: [["voce", "Tre giorni di prove. Il Maestro ha rotto due bacchette e un metronomo, Rocco ha imparato a contare fino a otto senza le dita."], ["voce", "Oggi è San Rocco, il patrono. Piove. E alla banda manca ancora una prima tromba."]]
    };
  }
  boot();
})();
