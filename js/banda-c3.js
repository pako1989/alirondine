// js/banda-c3.js - «BANDA DI PIAZZA» · Capitolo 3: Il Derby dei Tamburi
// Derby col Montenero: la banda in curva contro la cassa di SuonoSmart. Il Maestro spinge Lilli fino a farle rompere l'ancia, in cabina di regia
// si decide se staccare un cavo o vincere suonando, poi duello («Ritmo» in modalità duello: il pubblico come tiro alla fune). Alla fine, Venezia.
// Zone: lo stadio comunale (32x22, tribune, campo, curva della banda, torre SuonoSmart), sotto la tribuna (14x10), cabina di regia (10x8).
(function () {
  "use strict";
  function boot() {
    const E = window.__bandaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__bandaH || !E.api._has(2)) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__bandaH(K), { say, done, ask, wask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("bp_c3", { kind: "acc", label: "Sciarpa del Derby", val: "sciarpa", from: "Capitolo 3 di Banda di Piazza" });
    K.lore("l_derby", { t: "Il derby col Montenero", d: "Borgo Marino e Montenero si odiano dal 1921, per una capra, un confine e un rigore. Da settant'anni la banda suona in curva al derby: il primo inno lo scrisse Anselmo Rondi, l'ultimo nessuno." });
    K.lore("l_suonosmart", { t: "SuonoSmart", d: "Ditta di impianti audio «per stadi, sagre e matrimoni». Slogan: «L'emozione, senza errori». Ha già sostituito sette bande in provincia. Nessuna ha più suonato." });

    // pubblico di partenza nel duello: la cassa a 120 decibel parte avanti, abbassata quasi alla pari, col cavo staccato parte dietro
    const crowd = () => F.is("bp_sabotaggio") ? 60 : F.is("bp_leale") ? 50 : 42;
    const goal = (s) => ({
      0: "Sotto la tribuna (la porta al centro delle gradinate): il Maestro Ferrante sta facendo l'ultima prova.",
      1: K.inv.has("bp_ancia") ? "Lilli è corsa via: è seduta sulla pista, sotto la tribuna ospiti (a destra). Hai un'ancia nuova." : "Lilli è corsa via con l'ancia rotta: è sulla pista, a destra. Forse qualcuno in curva ha un'ancia di scorta.",
      2: "Sali in cabina di regia (la casetta blu in alto a destra): Gigi SuonoSmart ti vuole parlare.",
      3: "In curva (in basso a sinistra): il Maestro aspetta il fischio d'inizio. Il derby comincia.",
      4: "Dopo il derby: parla col Maestro in curva.",
      5: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      setStep(N, 5); F.set("bp_c3_done", true);
      const m = K.reward("bp_c3", { coins: 100, cos: "bp_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["bp_bracco", "[serio] Io sono un uomo di numeri. E i numeri dicono che il derby non decide niente. Decide Venezia. Concorso nazionale delle bande, fra un mese."],
        ["bp_bracco", "Se la banda vince un premio, resta allo stadio. Se torna a mani vuote, la cassa si accende per sempre. Firmato, timbrato, a norma."],
        ["bp_rocco", "Venezia! L'ultima volta che ci siamo andati era il '72. Abbiamo vinto. Poi mio zio è caduto in un canale col bombardino. Ha continuato a suonare. In acqua."],
        ["voce", `<b>FINE DEL CAPITOLO 3 · «Il Derby dei Tamburi»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 4 ti aspetta: il colle, un silenzio lungo tre anni e una marcia senza finale."]
      ]), () => K.openMain(), "bp_stadio");
    }

    function derby() {
      H.play("derby", { title: "Il Derby dei Tamburi · contro la cassa", crowd: crowd() }, (r) => {
        if (r.win) {
          F.set("bp_derby_win", true); setStep(N, 4); K.learnLore("l_derby"); quest("bp_c3d", "Dopo il fischio", "Parla col Maestro, in curva.");
          say("voce", "Al novantesimo la curva canta l'inno sopra la cassa. La cassa alza il volume. La curva canta più forte. La cassa si arrende con un fischio di feedback.");
          say("bp_nana", "[felice] HAI SENTITO? Lo stadio ha scelto noi! Pure quelli del Montenero battevano le mani, e quelli non battono le mani neanche ai matrimoni!");
          if (F.is("bp_sabotaggio")) say("bp_gigi", "[pensa] (Dalla cabina, Gigi guarda il cavo staccato. Poi la curva. Poi di nuovo il cavo.)");
          return done();
        }
        say("voce", "La cassa copre tutto: i tamburi, gli ottoni, perfino i fischi. Lo stadio si gira verso la torre col led blu.");
        return ask("La banda è rimasta indietro. Il secondo tempo deve ancora cominciare.", [
          { label: "🥁 Secondo tempo: si ricomincia", sub: "Il pubblico riparte da metà strada", big: true, cls: "hot", fn: derby },
          { label: "🏳️ Lascia la curva alla cassa", sub: "Il derby si perde. La storia va avanti lo stesso", fn: () => { F.set("bp_derby_perso", true); setStep(N, 4); quest("bp_c3d", "Dopo il fischio", "Parla col Maestro, in curva."); say("bp_ferrante", "[triste] Mettete giù gli strumenti. Non con rabbia. Con ordine. Una banda perde come suona: in fila."); done(); } }
        ]);
      });
    }

    const talk = {
      bp_ferrante() {
        if (K.rel.scene("bp_ferrante")) return;
        const s = S();
        if (s === 0 && K.inZone("bp_sottotribuna")) {
          say("bp_ferrante", "[serio] Ultima prova. Signorina Lilli, la battuta diciassette. Di nuovo.");
          say("voce", "Lilli suona la battuta diciassette. È giusta. Il Maestro batte la bacchetta sul leggio.");
          say("bp_ferrante", "In ritardo. Di un niente. Il niente, al derby, è tutto. Di nuovo.");
          say("voce", "Di nuovo. Di nuovo. Alla dodicesima volta Lilli soffia forte, l'ancia si spezza con un crac che sembra un ramo. Silenzio sotto la tribuna.");
          say("bp_lilli", "[arrabbiato] Era giusta. Era giusta dalla prima volta e lei lo sa. Si tenga la diciassette. Io me ne vado.");
          say("voce", "Lilli esce sbattendo la porta. Il Maestro guarda il leggio vuoto e non dice niente per un tempo lunghissimo: due battute.");
          return wask("Fra quaranta minuti c'è il fischio d'inizio. Il Maestro ti guarda.", [
            { label: "❤️ «Vado da lei.»", sub: "La prova aspetta", big: true, w: { cuore: 2 }, fn: () => { setStep(N, 1); quest("bp_c3", "La diciassette", "Trova Lilli sulla pista, a destra, sotto la tribuna ospiti."); say("bp_ferrante", "[pensa] Vada. Le dica... no, non le dica niente. Le parole mie stonano."); done(); } },
            { label: "🎼 «Ricominciamo, Maestro. Tornerà da sola.»", sub: "La banda va avanti", big: true, w: { rigore: 2 }, fn: () => { F.set("bp_lilli_via", true); F.set("bp_m_bp_lilli", false); K.rel.add("bp_ferrante", 2); setStep(N, 2); quest("bp_c3b", "La cabina", "Sali in cabina di regia: Gigi SuonoSmart ti cerca."); say("bp_ferrante", "Bene. Ricominciamo senza clarinetto. Rocco, la sua parte la fa il bombardino. Un'ottava sotto. Con dignità."); say("bp_rocco", "[sorpreso] Con dignità. Va bene. Ci provo. La dignità io l'ho sempre suonata un'ottava sotto."); done(); } }
          ]);
        }
        if (s === 3) {
          say("bp_ferrante", F.is("bp_lilli_via") ? "[serio] Siamo in sei. Basta. Anselmo Rondi vinse un derby in quattro, nel '58, con la neve. Si suona." : "[serio] Siamo tutti. Anche lei, signorina. Non mi guardi così: la diciassette, stasera, la suoni come vuole.");
          return ask("L'arbitro guarda l'orologio. Dalla torre SuonoSmart parte il conto alla rovescia registrato.", [
            { label: "📢 Derby: duello contro la cassa", sub: `Il pubblico come tiro alla fune · quota 60% · pubblico di partenza ${crowd()}%`, big: true, cls: "hot", fn: derby },
            { label: "🎒 Prima controlla lo zaino", sub: "Gli oggetti con «tempo» allargano un po' le finestre", fn: () => { say("voce", K.inv.bonus("te") ? "Qualcosa nello zaino ticchetta. Il tempo sembra più largo." : "Nello zaino niente che ticchetti. Ma la curva è con te. Più o meno."); done(); } },
            { label: "◂ Un momento", fn: done }
          ]);
        }
        if (s === 4) {
          say("bp_ferrante", F.is("bp_derby_win") ? "[sorpreso] Abbiamo vinto. Lo stadio ha cantato. Io non ho capito bene come, perché a metà ho smesso di contare e ho... ascoltato. Non mi succedeva dal conservatorio." : "[serio] Abbiamo perso. Ma nessuno è uscito di tempo. Neanche quando la cassa ha messo gli applausi registrati sopra di noi.");
          if (F.is("bp_sabotaggio")) say("bp_ferrante", "[pensa] Una cosa. La cassa, a metà primo tempo, ha fatto un rumore strano. Come un cavo. Non lo voglio sapere. Non me lo dica.");
          say("bp_ferrante", "Venezia. Un mese. Le bande migliori d'Italia, una giuria che non sorride dal 1987. Come ci arriviamo?");
          return wask("Il Maestro aspetta la tua risposta, la bacchetta stretta in mano.", [
            { label: "🎼 «Prove alle sei, tutti i giorni. Come dice lei.»", big: true, w: { rigore: 2 }, fn: () => { F.set("bp_prove_sei", true); K.rel.add("bp_ferrante", 3); say("bp_ferrante", "Alle sei meno cinque. Le sei sono per chi arriva tardi."); say("bp_rocco", "[triste] Alle sei. Il bombardino alle sei non si sveglia. Lo dovrò portare a letto con me."); fin(); } },
            { label: "❤️ «Prove in piazza, la sera, davanti alla gente.»", big: true, w: { cuore: 2 }, fn: () => { F.set("bp_prove_piazza", true); if (!F.is("bp_lilli_via")) K.rel.add("bp_lilli", 2); say("bp_ferrante", "[sorpreso] In piazza. Con la gente che chiacchiera. E i bambini. E i cani."); say("bp_nana", "[felice] E il ragù! Porto i tavoli fuori. Maestro, lei si siede in prima fila e per una volta mangia seduto."); say("bp_ferrante", "[pensa] ...Proviamo. Una settimana. Se un cane abbaia a tempo, lo assumo."); fin(); } }
          ]);
        }
        say("bp_ferrante", s === 1 ? "La signorina Lilli è sulla pista. Lo so perché la sento non suonare." : s === 2 ? "Il tecnico della cassa la cerca. Ci vada. Ascolti, non prometta niente." : "Si suona. A tempo."); done();
      },
      bp_lilli() {
        if (K.rel.scene("bp_lilli")) return;
        const s = S();
        if (s === 1 && K.inZone("bp_stadio")) {
          if (!K.inv.has("bp_ancia")) {
            say("bp_lilli", "[triste] Lo sai cos'è un'ancia? Un pezzetto di canna. Costa tre euro. E senza, il clarinetto è un bastone con i buchi.");
            say("bp_lilli", "Non torno. Non con un bastone. E comunque non torno. Forse.");
            return done();
          }
          K.inv.take("bp_ancia"); K.rel.add("bp_lilli", 3);
          say("voce", "Le dai l'ancia nuova, ancora nella bustina. Lilli la gira tra le dita come una cosa preziosa.");
          say("bp_lilli", "[sorpreso] Forza tre e mezzo. La mia. Come facevi a saperlo? Rocco. Certo. Rocco sa tutto e non dice niente.");
          say("bp_lilli", "[triste] La diciassette era giusta. Lo sai, vero? Io voglio solo che una volta, UNA, mi dica «brava». Non «di nuovo». «Brava». Sono due sillabe in meno.");
          return wask("Lilli monta l'ancia e aspetta.", [
            { label: "❤️ «Al derby suona come vuoi. Col Maestro ci parlo io.»", big: true, w: { cuore: 2 }, fn: () => { F.set("bp_lilli_libera", true); K.rel.add("bp_lilli", 2); say("bp_lilli", "[felice] Come voglio io. Va bene. Ma solo alla diciassette. Sono una punk, mica una vandala."); fine1(); } },
            { label: "🎼 «Esagera, sì. Ma il tempo è tempo. Torna per la banda.»", big: true, w: { rigore: 2 }, fn: () => { K.rel.add("bp_ferrante", 1); say("bp_lilli", "[pensa] Per la banda. Non per lui. Va bene. Le note scritte. Tutte. Gliele suono così precise che gli verrà il dubbio di avere torto."); fine1(); } }
          ]);
        }
        say("bp_lilli", s === 0 ? "Diciassette. Diciassette. La sogno, la diciassette." : s >= 2 && !F.is("bp_lilli_via") ? "Si sente la curva da qui. Quando cantano, il clarinetto mi vibra in mano da solo." : "(Lilli ti guarda da lontano e non si avvicina.)"); done();
        function fine1() { F.set("bp_m_bp_lilli", true); setStep(N, 2); quest("bp_c3b", "La cabina", "Sali in cabina di regia: Gigi SuonoSmart ti cerca."); say("voce", "Lilli torna con te. In curva Rocco le fa un inchino col bombardino."); done(); }
      },
      bp_rocco() {
        if (K.rel.scene("bp_rocco")) return;
        const s = S();
        if (s === 1 && !K.inv.has("bp_ancia") && !F.is("bp_ancia_rocco")) {
          F.set("bp_ancia_rocco", true); K.inv.give("bp_ancia");
          say("bp_rocco", "Lilli ha rotto l'ancia? Tieni. Ne ho sempre una di scorta in tasca, forza tre e mezzo.");
          say("bp_rocco", "[ride] Non chiedermi perché. Suono il bombardino: il bombardino non ha l'ancia. È che da vent'anni qualcuno, in questa banda, prima o poi la rompe.");
          say("voce", "Ottieni un'Ancia nuova.");
          return done();
        }
        say("bp_rocco", s === 0 ? "Il derby! Ho la divisa stirata, le scarpe lucide e un panino nella custodia. Il panino è per l'intervallo, la custodia è per il panino." : s === 1 ? "Valla a prendere, campione. Lilli fa la dura, ma quando piange si nasconde dietro la cresta." : s === 2 ? "La cabina di Gigi è lassù. Da lì si vede tutto. Io ci sono salito una volta: c'era un pulsante «APPLAUSI». L'ho premuto. Applaudiva." : s === 3 ? "Bombardino pronto. Il fa basso è carico. Il panino, purtroppo, è finito." : F.is("bp_derby_win") ? "[felice] Ho pianto. Non dirlo a nessuno. Ho pianto nel bombardino e adesso fa il gargarismo." : "Abbiamo perso. Ma hai visto la Nanà? Ha fischiato la cassa per novanta minuti. Pure all'intervallo."); done();
      },
      bp_gigi() {
        if (K.rel.scene("bp_gigi")) return;
        const s = S();
        if (s === 2 && K.inZone("bp_regia")) {
          say("bp_gigi", "[serio] Entra, entra, chiudi. Senti, io faccio il tecnico. Collego cavi. Non decido niente. Però l'Assessore mi ha detto di mettere la cassa a centoventi decibel quando suonate voi.");
          say("bp_gigi", "Centoventi. È il rumore di un aereo. Non vi sentirà nessuno, neanche voi stessi.");
          say("bp_gigi", "[pensa] Ti ho visto, a San Rocco. Sotto la pioggia, a passo. Il furgone non si bagna, ma neanche si muove. Io... non so perché te lo dico. Il cavo principale è quello rosso. Lì.");
          return ask("Il cavo rosso pende dal mixer. Gigi guarda da un'altra parte, molto intensamente.", [
            { label: "🔌 Stacca il cavo rosso", sub: "La cassa parte zoppa. Gigi non ha visto niente", big: true, fn: () => { F.set("bp_sabotaggio", true); say("voce", "Stacchi il cavo. Il led blu della torre fa un singhiozzo e torna acceso, ma più fioco."); say("bp_gigi", "[sorpreso] Ah. Si è staccato. Capita, coi cavi vecchi. Lo segno nel registro alla voce «guasti». Non ho visto niente."); after(); } },
            { label: "🎚️ «Abbassala, Gigi. Vinciamo suonando.»", sub: "Una gara alla pari, o quasi", big: true, fn: () => { F.set("bp_leale", true); say("bp_gigi", "[felice] Alla pari. Mi piace. Abbasso a cento. Di più non posso, sennò l'Assessore mi trasferisce alle sagre del cinghiale."); after(); } },
            { label: "✋ «Non toccare niente. Ci arrangiamo.»", sub: "La cassa resta a centoventi", fn: () => { say("bp_gigi", "[pensa] Niente? Centoventi decibel? Siete matti. Però... matti a tempo. In bocca al lupo."); after(); } }
          ]);
        }
        say("bp_gigi", s < 2 ? "Ciao campione! Sali in cabina, dopo. Ti devo parlare. No, non adesso: c'è l'Assessore che guarda." : s === 3 ? "Fra poco tocca a voi. Io sono in cabina, se serve. Cioè: non serve. Ufficialmente." : F.is("bp_derby_win") ? "[felice] Ho registrato la curva, stasera. Di nascosto. Settanta decibel di gente vera. È il suono più bello che ho mai registrato." : "Mi dispiace. Davvero. La cassa ha vinto. Io no."); done();
        function after() { setStep(N, 3); quest("bp_c3c", "Il fischio d'inizio", "Torna in curva, in basso a sinistra: il Maestro aspetta."); done(); }
      },
      bp_bracco() {
        if (K.rel.scene("bp_bracco")) return;
        const s = S();
        say("bp_bracco", s <= 3 ? "Bella serata per il futuro! Stasera la gente sceglie: tamburi di legno o il suono del duemila. Io sono neutrale. Ho solo comprato la cassa." : F.is("bp_derby_win") ? "[sorpreso] Una curva che canta. Non era nel preventivo. Va bene. Va bene. Ne parliamo." : "Avete visto? La gente vuole il futuro. O almeno non lo fischia. Quasi."); done();
      },
      bp_abele() {
        if (K.rel.scene("bp_abele")) return;
        const s = S();
        say("bp_abele", s === 0 ? "[pensa] Il Maestro sta esagerando. Lo dico da prete: la pazienza è una virtù, ma lui la tratta come una nota sbagliata." : s <= 3 ? "Ho benedetto i piatti. Non si fa, ma il vescovo è del Montenero." : "Comunque vada, figliolo: abbiamo suonato. Il Signore conta le note, non i decibel."); done();
      },
      bp_nana() {
        if (K.rel.scene("bp_nana")) return;
        say("bp_nana", S() <= 3 ? "Ho portato le frittate in curva. Dodici. Una per sezione. La sezione «ottoni» ne mangia due." : "Venezia! Devo ritrovare il vestito del '72. Mi stava largo. Adesso mi starà... eh. Come un ricordo."); done();
      }
    };

    const zones = {
      bp_stadio: {
        region: "stadio", name: "Lo stadio comunale", short: "Stadio", sub: "Derby col Montenero: la curva del Borgo, la torre di SuonoSmart", bg: "bp_stadio", time: "sera", w: 32, h: 22, base: ":", start: [5, 17], travel: [5, 17],
        onEnter(K) { if (K.clock && K.clock.slot && K.clock.slot() < 2) K.clock.set(K.clock.day(), 2); },
        items: [[3, 6], [29, 8], [16, 19], [24, 18]], itemCos: "bp_c3",
        areas: [[0, 15, 11, 20, "La curva del Borgo"], [24, 1, 30, 4, "La cabina di regia"], [26, 15, 31, 20, "La torre SuonoSmart"], [5, 6, 26, 14, "Il campo"], [0, 0, 31, 21, "Lo stadio comunale"]],
        act: { j: "Guarda la tribuna", g: "Guarda la porta", q: "Entra", l: "Guarda il riflettore", n: "Leggi il tabellone", b: "Siediti in panchina", u: "Guarda il chiosco", s: "Riposa un momento", A: "Guarda la cassa", M: "Guarda il leggio", E: "Guarda i tamburi", z: "Guarda le casse", f: "Guarda la ringhiera" },
        flavor: { j: "Le gradinate. Sciarpe, bandiere, un nonno con la radiolina e un bambino che fa il verso alla grancassa.", g: "La porta. La rete ha un buco storico, rammendato con lo spago da pesca.", l: "Un riflettore sul suo palo. Ronza in si bemolle, dice Rocco.", n: "Il tabellone: «BORGO MARINO – MONTENERO · ore 20:30». Sotto, uno striscione: «LA BANDA NON SI TOCCA».", b: "La panchina dei magazzinieri. Sotto, una borsa del ghiaccio e un santino di San Rocco.", u: "Il chiosco delle bibite. Il cartello dice «Birra · Gazzosa · Tappi per le orecchie (novità SuonoSmart)».", A: "La torre SuonoSmart: tre metri di casse nere e un led blu che pulsa come un cuore che non batte.", M: "I leggii della banda, legati alla ringhiera col fil di ferro. Il vento del mare li ha già rovesciati due volte.", E: "La grancassa con la rondine dipinta. Il tuo posto. La pelle è tesa come un tamburo, cioè giustamente.", z: "Casse di bottiglie vuote del chiosco. Rocco le usa come leggio di riserva.", f: "La ringhiera della curva, verniciata coi colori del Borgo. Ci sono incise iniziali dal 1960." },
        npcs: (s) => {
          const L = [{ id: "bp_rocco", at: s >= 3 ? [6, 18] : [8, 17] }, { id: "bp_nana", at: [2, 16] }, { id: "bp_bracco", at: [22, 16] }];
          if (s <= 1 || s >= 3) L.push({ id: "bp_gigi", at: [27, 5] });
          if (s === 1) L.push({ id: "bp_lilli", at: [30, 10] });
          if (s >= 3) { L.push({ id: "bp_ferrante", at: [4, 18] }, { id: "bp_abele", at: [9, 18] }); if (!F.is("bp_lilli_via")) L.push({ id: "bp_lilli", at: [7, 19] }); }
          if (s === 2 && !F.is("bp_lilli_via")) L.push({ id: "bp_lilli", at: [7, 19] });
          return L;
        },
        doors: { "15,3": { to: "bp_sottotribuna", at: [7, 8] }, "16,3": { to: "bp_sottotribuna", at: [7, 8] } },
        intro: [["voce", "Lo stadio comunale di Borgo Marino, sera di derby. Riflettori accesi, sciarpe al vento, odore di salsedine e di frittata."], ["voce", "In curva, la banda. In fondo, dall'altra parte, la torre nera di SuonoSmart col suo led blu. Stasera lo stadio sceglie chi ascoltare."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 21, 31, 21, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a");
          lay(1, 1, 30, 3, "j"); lay(1, 1, 1, 14, "j");
          lay(5, 6, 26, 14, "-"); put(4, 9, "g"); put(4, 10, "g"); put(4, 11, "g"); put(27, 9, "g"); put(27, 10, "g"); put(27, 11, "g");
          house(24, 1, 6, 3, { door: [27, 3], roof: "#1e3a8a", wall: "#0ea5e9", enter: { to: "bp_regia", at: [5, 6] } });
          put(15, 3, "q"); put(16, 3, "q"); put(15, 4, ":"); put(16, 4, ":");
          // la curva della banda: ringhiera, leggii e grancassa
          lay(1, 15, 11, 15, "f"); put(5, 15, ":"); put(6, 15, ":"); [[3, 19], [5, 20], [8, 20]].forEach(([x, y]) => put(x, y, "M")); put(10, 19, "E"); put(1, 20, "z");
          // la torre SuonoSmart
          put(28, 18, "A"); put(29, 18, "A"); put(28, 17, "A"); put(29, 17, "A");
          [[3, 5], [28, 5], [3, 15], [13, 15], [18, 15], [28, 14]].forEach(([x, y]) => put(x, y, "l"));
          put(12, 17, "b"); put(13, 17, "b"); put(18, 17, "b"); put(19, 17, "b"); put(22, 19, "u"); put(23, 19, "u"); put(14, 5, "n"); put(25, 20, "s");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow();
          // fasci di luce dei riflettori e il led blu della torre che pulsa
          g.save(); [[3, 5], [28, 5]].forEach(([x, y]) => { const X = d.X(x) + 8, Y = d.Y(y); g.fillStyle = "rgba(255,255,220,.07)"; g.beginPath(); g.moveTo(X, Y); g.lineTo(X + (x < 16 ? 160 : -160), Y + 140); g.lineTo(X + (x < 16 ? 80 : -80), Y + 160); g.fill(); });
          const p = 0.5 + 0.5 * Math.sin(f / 7); g.fillStyle = `rgba(56,189,248,${(F.is("bp_sabotaggio") ? 0.15 : 0.3) * p})`; g.beginPath(); g.arc(d.X(29), d.Y(17), 26, 0, 7); g.fill();
          // sciarpe della curva al vento
          for (let i = 0; i < 6; i++) { const X = d.X(1 + i * 2) + 6, Y = d.Y(15) - 2 + Math.sin(f / 9 + i) * 1.5; g.fillStyle = i % 2 ? "#facc15" : "#b91c1c"; g.fillRect(X, Y - 6, 3, 6); g.fillRect(X + 3, Y - 6 + Math.sin(f / 6 + i) * 1, 4, 2); }
          g.restore();
          H.plaque(g, "CURVA DEL BORGO", d.X(5) + 8, d.Y(15) - 8, "#fde68a"); H.plaque(g, "SOTTO LA TRIBUNA", d.X(15) + 16, d.Y(3) - 4, "#e5e7eb"); H.plaque(g, "REGIA", d.X(27) + 8, d.Y(1) - 4, "#7dd3fc"); H.plaque(g, "SUONOSMART", d.X(28) + 16, d.Y(17) - 8, "#7dd3fc");
        }
      },
      bp_sottotribuna: {
        interior: true, region: "sala", name: "Sotto la tribuna", short: "Sottotribuna", sub: "Armadietti, una lampadina e l'ultima prova", bg: "bp_sottotribuna", w: 14, h: 10, start: [7, 8], outside: ["bp_stadio", 15, 4], base: "=",
        items: [[12, 2]], itemCos: "bp_c3",
        act: { L: "Guarda l'armadietto", M: "Guarda il leggio", E: "Guarda i tamburi", b: "Siediti", D: "Guarda la bacheca", z: "Guarda le casse", s: "Riposa un momento" },
        flavor: { L: "Gli armadietti della banda, accanto a quelli delle squadre. Sul numero sette, a pennarello: «Ciro — tienilo libero».", M: "Il leggio del clarinetto. La battuta diciassette è cerchiata tre volte in rosso.", E: "I tamburi di riserva. Uno ha la pelle rotta e una toppa di nastro americano.", b: "Una panca di legno consumata da settant'anni di pantaloni da banda.", D: "La bacheca: il calendario dei derby dal 1958, un ritaglio «LA BANDA SUONA SOTTO LA NEVE» e una foto di Anselmo Rondi con la bacchetta.", z: "Casse di bottiglie d'acqua per l'intervallo. Il Maestro le ha contate: una a testa, nessuna di più.", s: "Una sedia pieghevole sotto la lampadina." },
        npcs: (s) => s === 0 ? [{ id: "bp_ferrante", at: [7, 3] }, { id: "bp_lilli", at: [4, 4] }, { id: "bp_abele", at: [10, 4] }] : s <= 2 ? [{ id: "bp_ferrante", at: [7, 3] }, { id: "bp_abele", at: [10, 4] }] : [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "="); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          for (let x = 1; x <= 5; x++) put(x, 1, "L"); put(9, 1, "D"); put(10, 1, "D");
          put(5, 3, "M"); put(7, 2, "M"); put(9, 3, "M"); put(12, 5, "E"); put(12, 6, "E"); put(2, 6, "b"); put(3, 6, "b"); put(1, 8, "z"); put(11, 8, "s");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); g.fillStyle = `rgba(253,224,71,${0.12 + 0.04 * Math.sin(f / 4)})`; g.beginPath(); g.arc(d.X(7) + 8, d.Y(3), 60, 0, 7); g.fill(); g.restore(); H.plaque(g, "BANDA · NON ENTRARE CON I TACCHETTI", d.X(7) + 8, d.Y(0) + 6, "#fde68a"); }
      },
      bp_regia: {
        interior: true, region: "stadio", name: "La cabina di regia", short: "Regia", sub: "Duecento cursori e un pulsante «APPLAUSI»", bg: "bp_regia", w: 10, h: 8, start: [5, 6], outside: ["bp_stadio", 27, 4], base: "=",
        act: { W: "Guarda dalla vetrata", T: "Guarda il mixer", A: "Guarda la cassa", D: "Guarda il rack", L: "Guarda lo scaffale", s: "Siediti" },
        flavor: { W: "La vetrata sullo stadio. Da quassù la curva sembra un'onda gialla e rossa che respira.", T: "Il mixer: duecento cursori, una lucina per ognuno e un pulsante rosso con scritto «APPLAUSI». Accanto, «FISCHI (non usare)».", A: "Una cassa spia. Sopra, un adesivo: «L'emozione, senza errori». Qualcuno ha aggiunto a penna «senza emozione».", D: "Il rack con gli amplificatori. Il cavo rosso è quello grosso, quello che va giù alla torre.", L: "Uno scaffale di chiavette USB: «Inno nazionale», «Inno del Borgo (versione rock)», «Applausi da stadio (pieno)», «Applausi da stadio (pienissimo)».", s: "La sedia girevole di Gigi. Gira da sola, un po'." },
        npcs: (s) => s === 2 ? [{ id: "bp_gigi", at: [3, 3] }] : [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 9, 7, "="); lay(0, 0, 9, 0, "a"); lay(0, 0, 0, 7, "a"); lay(9, 0, 9, 7, "a"); lay(0, 7, 9, 7, "a"); put(5, 7, "v");
          for (let x = 2; x <= 7; x++) put(x, 0, "W"); put(3, 2, "T"); put(4, 2, "T"); put(5, 2, "T"); put(1, 2, "A"); put(8, 2, "A"); put(8, 4, "D"); put(8, 5, "D"); put(1, 5, "L"); put(6, 4, "s");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); for (let i = 0; i < 12; i++) { const h = 2 + Math.abs(Math.sin(f / 6 + i)) * 4; g.fillStyle = i % 5 ? "#22c55e" : "#ef4444"; g.fillRect(d.X(3) + i * 4, d.Y(2) + 4 - h, 2, h); } g.restore(); H.plaque(g, "SUONOSMART", d.X(5), d.Y(0) + 6, "#7dd3fc"); }
      }
    };
    return {
      n: N, title: "Il Derby dei Tamburi", sub: "Una curva, una cassa a centoventi decibel e la battuta diciassette",
      goal, start: "bp_stadio", introBg: "bp_stadio", zones, talk, obj: {},
      intro: [["voce", "Tre settimane di prove. Il Maestro ha imparato il nome di tutti, e lo usa solo per dire «di nuovo»."], ["voce", "Stasera c'è il derby col Montenero. La banda in curva, la cassa di SuonoSmart dall'altra parte. Lo stadio deciderà chi ascoltare."]]
    };
  }
  boot();
})();
