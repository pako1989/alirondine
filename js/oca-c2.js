// js/oca-c2.js - «IL GIOCO DELL'OCA DEL CONTE» · Capitolo 2: Il Labirinto e il Ponte
// Sera alla Locanda: Ernestina vuole la bottiglia del '71 dalla cantina chiusa da cinquant'anni; a cena Arrigo racconta che il Conte è stato in galera.
// A mezzanotte la seduta spiritica di Madame Ofelia nella serra. Poi i gemelli, che non si parlano da un rigore del 2004: una partita sul prato con le oche in campo.
// Infine la seconda tirata, dalla Locanda (19) al Labirinto (42), con l'ex terzino, i gemelli e il notaio. Zone: il parco al tramonto, la cantina (16x10), la serra di notte.
(function () {
  "use strict";
  function boot() {
    const E = window.__ocaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__ocaH || !window.__ocaZ || !window.__tabellone) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__ocaH(K), Z = window.__ocaZ, { say, done, wask, ask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("oc_c2", { kind: "acc", label: "Fiocco del labirinto (verde)", val: "fascia", from: "Capitolo 2 di Il Gioco dell'Oca del Conte" });
    K.lore("l_oc_registro", { t: "Il registro della Rondinese", d: "In cantina, tra le botti: il libro dei conti della U.S. Rondinese, stagione 1971-72. Il Conte era il presidente. A pagina 63, una colonna di cifre cancellate e una riga a penna rossa: «Mancano 40 milioni. Li ha presi O. Li restituisco io.» O. come Ottone, il fratello del Conte. Il padre di Arrigo." });
    K.lore("l_oc_galera", { t: "Il Conte in galera", d: "Nel 1972 il Conte Ugolino fu condannato per appropriazione indebita: i soldi della Rondinese spariti, la squadra fallita, i giocatori senza stipendio. Tre anni nel carcere di Porta Nebbia. Non si difese mai." });
    K.lore("l_oc_rigore", { t: "Il rigore del 2004", d: "Finale provinciale juniores, Valcortese contro Rondinese. Cosimo in porta per la Rondinese, Damiano sul dischetto per il Valcortese. Il rigore andò alto. Damiano sostiene che Cosimo si fosse mosso prima. Da allora i gemelli non si parlano." });
    const pace = () => F.is("oc_gemelli_pace");
    const goal = (s) => ({
      0: "Sera. Ernestina, in cucina, sta preparando la cena della Locanda: ti cerca.",
      1: "La cantina è aperta (porta a destra sulla facciata): trova la bottiglia del '71 e portala a Ernestina.",
      2: "Mezzanotte: Madame Ofelia ti aspetta nella serra per la seduta spiritica.",
      3: "I gemelli: Cosimo al labirinto, Damiano al pozzo. Tonio vuole organizzare una partita sul prato.",
      4: "Gilda ti aspetta al tabellone: la seconda tirata, dalla Locanda al Labirinto.",
      5: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin(r) {
      setStep(N, 5); F.set("oc_c2_done", true);
      const m = K.reward("oc_c2", { coins: 120, cos: "oc_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", `Casella 42, il Labirinto. ${H.esito(r)} Le siepi sono alte, la luna pure. Gilda segna le posizioni con una torcia in bocca.`],
        ["oc_gilda", "[serio] Seconda tirata conclusa. La terza è corta: dieci caselle, dalla 42 alla 52. La Prigione."],
        ["oc_gilda", "[pensa] Il Conte ha lasciato una clausola. Chi arriva alla 52 passa la notte nella cappella di famiglia. Da solo. «Come ho fatto io», ha scritto. Non ha scritto altro."],
        ["oc_ernestina", "[serio] Io in quella cappella non ci sono mai entrata. Mia madre diceva che il Conte ci teneva le cose che non si dicono."],
        ["voce", `<b>FINE DEL CAPITOLO 2 · «Il Labirinto e il Ponte»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 3 ti aspetta: la Prigione. Dieci caselle, una notte nella cappella e una parete incisa col chiodo."]
      ]), () => K.openMain(), "oc_labirinto");
    }
    function seconda() {
      const story = {
        26: { who: "oc_arrigo", t: "Uno scambio tra gentiluomini", text: "Arrigo ti blocca vicino alla 26: «Facciamo uno scambio. Tu mi dai quello che hai in tasca, io ti do un consiglio legale gratuito.» Ha l'aria di uno che ha già letto le tue carte.", opts: [
          { label: "🦊 «Prima il consiglio.»", sub: "Lo fai parlare", eff: { flag: "oc_consiglio" }, after: "«Il consiglio è: non fidarti dei notai.» Ride da solo. Poi si fa scuro: «Lo diceva mio padre. Lui sì che era un notaio. Prima di sparire coi soldi di tutti.» Si morde la lingua. Troppo tardi." },
          { label: "❤️ «Non scambio niente. Gioca e basta.»", sub: "Neutrale fino in fondo", eff: { move: 1 }, after: "Arrigo sbuffa. Tu avanzi di uno, così, per principio." }] },
        33: { who: "oc_teo", t: "La scorciatoia di Teo", text: "Teo sbuca da una siepe con le cesoie in mano. «Psst. Qui c'è un varco che conosco solo io. E il Conte. Ma il Conte non c'è più. Credo.»", opts: [
          { label: "🌿 Segui Teo nel varco", sub: "Avanti di 3", eff: { move: 3, flag: "oc_varco" }, after: "Il varco è stretto, profuma di bosso. Teo cammina come se conoscesse ogni radice. Esci tre caselle più avanti, con una foglia nei capelli." },
          { label: "🕯️ «Mi dia piuttosto un altro santino.»", sub: "Una carta per dopo", eff: { give: "santino" }, after: "Teo ride. «Ne ho una scatola. Il Conte se li faceva stampare a Lourdes. Con la sua faccia. Il prete non ha mai capito.»" }] },
        39: pace() ? { who: "oc_cosimo", t: "I gemelli sul ponte", text: "Sul ponticello di legno, Cosimo e Damiano ti aspettano. Insieme. Si sono messi d'accordo: «Non ti aiutiamo a vincere. Ti aiutiamo a non perdere male.» Ti porgono un'oca di carta.", opts: [{ label: "🪿 Prendi l'oca di carta", sub: "Dopo una mossa rilanci", eff: { give: "ocacarta", flag: "oc_ponte_gemelli" }, after: "Damiano la piega meglio, Cosimo la regge. Per la prima volta in vent'anni fanno una cosa a quattro mani. Non lo dicono, ma ci fanno caso." }] }
          : { who: "oc_damiano", t: "Lite sul ponte", text: "Sul ponticello i gemelli si sono incrociati e nessuno dei due si sposta. «Spostati tu.» «Spostati tu, che hai tirato alto.» Le oche guardano.", opts: [
            { label: "❤️ «Passate insieme. È largo.»", sub: "Non è largo", eff: { flag: "oc_ponte_insieme" }, after: "Passano insieme. Il ponte scricchiola. Si guardano. Quasi ridono. Quasi." },
            { label: "🦊 Passi tu in mezzo", sub: "Avanti di 2, mentre litigano", eff: { move: 2, rival: "oc_cosimo", rmove: -1 }, after: "Passi tra i due mentre discutono di undici metri e venti. Cosimo, distratto, arretra di un passo." }] }
      };
      H.tirata({ title: "Seconda tirata · fino al Labirinto", from: 19, to: 42, rivals: ["tonio", "cosimo", "damiano", "arrigo"], diff: 1, bg: "oc_labirinto", story }, (r) => {
        if (r.flags.oc_consiglio) { K.bond("astuzia", 1); K.learnLore("l_oc_galera"); } if (r.flags.oc_varco) K.rel.add("oc_teo", 2); if (r.flags.oc_ponte_insieme) { K.bond("cuore", 1); K.rel.add("oc_cosimo", 2); K.rel.add("oc_damiano", 2); } if (r.flags.oc_ponte_gemelli) { K.rel.add("oc_cosimo", 2); K.rel.add("oc_damiano", 2); }
        say("oc_tonio", r.win ? "[ride] Primo anche stasera! Ti avrei fatto un fallo, ma eri troppo lontano. È un complimento." : "[ride] Sei arrivato dietro, eh? Succede. Nell'84 arrivavo sempre dietro. Poi entravo in scivolata.");
        fin(r);
      });
    }
    function partita() {
      K.minigame(window.__ocaPartita.start, { oppStyle: "equilibrata", title: "Sul prato del Conte", us: "Il Neutrale e Damiano", opp: { name: "Tonio e Arrigo", kit: "#7c2d12", names: ["Tonio", "Arrigo"] },
        mate: { name: "Damiano", skin: "#f1c9a5", hair: "#57534e", shirt: "#15803d" }, half: 30, dusk: true, bg: "oc_prato", introExtra: "<p>In porta, per la vostra squadra, c'è <b>Cosimo</b>. Damiano non lo guarda. Passagli la palla e vedi che succede.</p>" }, (r) => {
        F.set("oc_partita_fatta", true); if (r.win) F.set("oc_partita_vinta", true);
        say("voce", r.win ? `Fischio finale (lo fischia Gilda, col fischietto da esecutrice). Vinto ${r.a}-${r.b}. Sull'ultimo gol, Cosimo ha rinviato lungo e Damiano l'ha messa dentro di prima. Senza pensarci.` : `Fischio finale. Perso ${r.a}-${r.b}: Tonio ha fatto tre falli e un gol, Arrigo un gol e nessun fallo, a sentire lui.`);
        say("oc_damiano", r.win ? "[sorpreso] …Bel rinvio." : "[arrabbiato] Se quel pallone l'avessi parato…");
        say("oc_cosimo", r.win ? "[sorpreso] …Bel tiro." : "[arrabbiato] Se l'avessi tirato dove si tirano i palloni…");
        say("voce", "Silenzio. Le oche si fermano. Teo, dietro una siepe, smette di potare.");
        wask(r.win ? "Vent'anni, e due parole. I gemelli si guardano come due che hanno appena scoperto di avere la stessa faccia." : "I gemelli stanno per ricominciare. Tonio fa il gesto del cartellino. Tutti guardano te.", [
          { label: "❤️ «Il rigore del 2004 non conta più. Conta questo.»", big: true, w: { cuore: 2 }, fn: () => { F.set("oc_gemelli_pace", true); say("oc_cosimo", "[pensa] …Mi sono mosso prima. Di poco. Un passo."); say("oc_damiano", "[pensa] E io l'ho tirato alto lo stesso. Di tanto. Un metro."); say("voce", "Ridono. Insieme. Ernestina, dalla finestra della cucina, si soffia il naso nel grembiule."); K.rel.add("oc_cosimo", 3); K.rel.add("oc_damiano", 3); avanti(); } },
          { label: "🦊 «Ritiratelo adesso, quel rigore. Qui. Davanti a tutti.»", big: true, w: { astuzia: 2 }, fn: () => { F.set("oc_rigore_ritirato", true); if (r.win) F.set("oc_gemelli_pace", true); say("voce", "Damiano mette il pallone sul dischetto di gesso. Cosimo va in porta. Teresa, l'oca, si piazza sulla linea. Damiano tira."); say("voce", r.win ? "Gol. Basso a sinistra. Cosimo si era tuffato a destra, e non si era mosso prima. Si abbracciano. Teresa morde Arrigo, per festeggiare." : "Alto. Di nuovo. Cosimo non si era mosso. Damiano lo guarda, poi guarda il cielo, poi ride come un matto. Cosimo ride con lui. È un inizio."); K.rel.add("oc_cosimo", 2); K.rel.add("oc_damiano", 2); avanti(); } }
        ]);
        function avanti() { K.learnLore("l_oc_rigore"); if (!K.inv.has("oc_gessetto")) K.inv.give("oc_gessetto"); say("voce", "Raccogli il <b>gessetto</b> del dischetto (🎒 Zaino). Gilda ti aspetta al tabellone: la seconda tirata."); setStep(N, 4); quest("oc_c2d", "La seconda tirata", "Gilda ti aspetta al tabellone."); done(); }
      });
    }

    const talk = {
      oc_ernestina() {
        if (K.rel.scene("oc_ernestina")) return; const s = S();
        if (s === 0) {
          say("oc_ernestina", "[felice] Eccolo! Stasera Locanda, cioè cena. Il testamento dice che chi è in Locanda cena in villa. Siete tutti in Locanda. Quindi cucino per sette.");
          say("oc_ernestina", "[pensa] Il Conte ha lasciato scritto: «la bottiglia del '71 va aperta quando la partita si fa seria». È in cantina. La cantina è chiusa da cinquant'anni. La combinazione è la casella della Locanda.");
          say("oc_ernestina", "Diciannove. L'ho provata stamattina. Si è aperta. Mi sono spaventata e l'ho richiusa. Ci va lei? Io ho il brodo.");
          setStep(N, 1); quest("oc_c2", "Il Labirinto e il Ponte", "La cantina (porta a destra sulla facciata): trova la bottiglia del '71."); return done();
        }
        if (s === 1 && K.inv.has("oc_barolo")) return cena();
        if (s === 1) { say("oc_ernestina", "[pensa] La bottiglia del '71. In fondo alla cantina, credo. Il Conte non la faceva toccare a nessuno. Neanche a sé stesso."); return done(); }
        say("oc_ernestina", ["[serio] Il brodo è sempre sul fuoco. Anche stasera. Anche dopo quello che ha detto Arrigo.", "Mia madre non parlava mai del Conte. Mai. Neanche male. È questo che mi ha sempre fatto pensare.", "[ride] Ha visto i gemelli? Stamattina si sono passati il sale. Senza guardarsi, ma se lo sono passati."][Math.floor(Math.random() * 3)]); done();
        function cena() {
          K.inv.take("oc_barolo");
          say("voce", "La cena della Locanda. Sette coperti, il brodo grande, un arrosto al rosmarino e la bottiglia del '71 al centro, come una reliquia. Gilda la stappa con un gesto da notaio vero.");
          say("oc_arrigo", "[furbo] Al Conte Ugolino! Che ci ha lasciato una villa, un gioco dell'oca e un passato da ladro.");
          say("oc_tonio", "[arrabbiato] Ladro?");
          say("oc_arrigo", "[serio] Non lo sapevate? Settantadue. I soldi della Rondinese spariti, la squadra fallita. Lo zio si è fatto tre anni a Porta Nebbia. Mio padre diceva che era la vergogna della famiglia. L'unica cosa su cui avesse ragione.");
          say("voce", "Ernestina posa il mestolo. Non dice niente. Si siede, e non si era mai seduta a tavola con loro.");
          K.learnLore("l_oc_galera");
          wask("Sette teste. Il brodo fuma. La bottiglia del '71 ha un'etichetta scritta a mano: «per quando torno».", [
            { label: "❤️ «Un ladro non paga di nascosto le trasferte di un terzino.»", big: true, w: { cuore: 1 }, fn: () => { F.set("oc_difeso", true); say("oc_tonio", "[serio] …È vero. Lo faceva. Dall'85. Dopo che era uscito."); say("oc_ernestina", "[pensa] E ogni Natale mandava un pacco alla Rondinese juniores. Me lo faceva incartare a me."); K.rel.add("oc_ernestina", 2); K.rel.add("oc_tonio", 2); avanti(); } },
            { label: "🦊 «Arrigo, chi le ha raccontato questa storia? Suo padre?»", big: true, w: { astuzia: 1 }, fn: () => { F.set("oc_dubbio", true); say("oc_arrigo", "[sorpreso] Mio padre, Ottone. E chi altri? Era il… era il tesoriere della Rondinese, all'epoca. Lui sapeva tutto."); say("voce", "Gilda alza un sopracciglio. Ernestina guarda Arrigo per la prima volta in tutta la sera."); K.rel.add("oc_arrigo", 2); avanti(); } }
          ]);
          function avanti() { say("oc_ofelia", "[sorpreso] Basta! Basta morti a tavola. Cioè: basta parlare di lui. A mezzanotte, nella serra, lo chiamiamo. E glielo chiediamo direttamente."); setStep(N, 2); quest("oc_c2b", "La seduta", "A mezzanotte, nella serra: Madame Ofelia chiama il Conte."); done(); }
        }
      },
      oc_ofelia() {
        if (K.rel.scene("oc_ofelia")) return; const s = S();
        if (s === 2 && K.inZone("oc_serra")) {
          say("voce", "La serra a mezzanotte. Una candela, il tavolino di velluto, la sfera col pesciolino rosso. Madame Ofelia ha gli occhi chiusi e le mani aperte sul tavolo.");
          say("oc_ofelia", "[serio] Conte Ugolino… Conte… se ci sei, batti un colpo.");
          say("voce", "TOC. Un colpo, sotto il tavolo. Poi un altro, più in là, verso la vetrata. Poi un cigolio di ferro. Il pesciolino nuota in cerchio, nervoso.");
          say("oc_ofelia", "[sorpreso] È lui! Conte, parlaci! La villa! Il tesoro! Chi deve vincere!");
          return wask("TOC. TOC. Il rumore viene dai tubi dell'acqua sotto le piante. O da qualcosa che ci cammina sopra.", [
            { label: "🦊 Guardi sotto il tavolo", sub: "Smascheri il trucco", big: true, w: { astuzia: 1 }, fn: () => { F.set("oc_seduta_trucco", true); say("voce", "Sotto il tavolo: un tubo dell'irrigazione e una carrucola con un martelletto. Il filo va fino a un piede di Madame Ofelia. Il secondo colpo, però, veniva da fuori. E quello, il filo non lo spiega."); say("oc_ofelia", "[triste] Va bene, va bene. Il primo colpo era mio. Il secondo no. Giuro sulle carte. Il secondo… non so chi l'ha fatto."); say("voce", "Fuori dalla vetrata, per un attimo, ti sembra di vedere un cappello da giardiniere. Poi niente."); K.rel.add("oc_ofelia", 2); avanti(); } },
            { label: "❤️ Reggi il gioco: «Conte, c'è qualcuno a cui vuole dire qualcosa?»", sub: "Lascia parlare la medium", big: true, w: { cuore: 1 }, fn: () => { F.set("oc_seduta_lucia", true); say("oc_ofelia", "[pensa] …Dice… dice un nome. Lucia. Dice: «Lucia, la minestra era onesta. Io no. Ma non per i motivi che pensano.»"); say("voce", "Ofelia apre gli occhi, sorpresa da sé stessa. Non sa da dove le sia uscita la frase. O lo sa, e non lo dice. Dietro la porta della serra, qualcuno trattiene il respiro: Ernestina."); K.rel.add("oc_ernestina", 2); K.rel.add("oc_ofelia", 1); avanti(); } }
          ]);
        }
        say("oc_ofelia", s === 2 ? "A mezzanotte. Nella serra. Porta una candela e lo scetticismo: lo lasciamo fuori dalla porta." : ["Il secondo colpo non era mio. Te l'ho detto. Non me lo levo dalla testa.", "[pensa] Il Conte mi chiedeva sempre di Lucia. Io non sapevo chi fosse. Adesso lo so: la madre di Ernestina.", "La Torre, nei tarocchi, è la verità che crolla addosso. È la carta che preferisco. Tranne quando esce a me."][Math.floor(Math.random() * 3)]); done();
        function avanti() { say("oc_tonio", "[ride] Bene, gli spiriti li abbiamo sentiti. Domattina, prima della tirata, una partita sul prato. Io e il notaio contro il neutrale e… chi ci sta. I gemelli, magari. Se si parlano."); setStep(N, 3); quest("oc_c2c", "I gemelli", "Cosimo al labirinto, Damiano al pozzo. Una partita sul prato, con le oche."); done(); }
      },
      oc_cosimo() { return gemello("oc_cosimo"); },
      oc_damiano() { return gemello("oc_damiano"); },
      oc_tonio() {
        if (K.rel.scene("oc_tonio")) return; const s = S();
        if (s === 3) return gemello("oc_tonio");
        say("oc_tonio", ["[ride] Il prato è pronto. Le porte sono due vasi di limoni. Regolamentari.", "Se Teresa ti becca, la palla è persa. È la regola del parco. Non l'ha scritta nessuno: l'ha scritta lei.", "Il Conte, un ladro? Io ci credo poco. I ladri non pagano le trasferte agli altri."][Math.floor(Math.random() * 3)]); done();
      },
      oc_gilda() {
        const s = S();
        if (s === 4) {
          say("oc_gilda", "[serio] Seconda tirata. Dalla Locanda al Labirinto. Ci sono il Pozzo alla 31 e una Buca alla 34: chi ha santini li tenga stretti.");
          return ask("Le pedine sono già sulla 19. Quella di Tonio ha una ginocchiera disegnata a pennarello.", [
            { label: "🎲 Si comincia · Seconda tirata", sub: "Dalla Locanda (19) al Labirinto (42)", big: true, fn: seconda },
            { label: "◂ Un momento", sub: "Prima cerca carte e regali", fn: done }
          ]);
        }
        say("oc_gilda", s >= 5 ? "Domani, la Prigione. Dorma, se ci riesce." : "La tirata è più tardi. Prima, la villa ha altre cose da dirle. Il Conte lo aveva previsto: è tutto nel testamento, in fondo, a matita."); done();
      },
      oc_arrigo() {
        if (K.rel.scene("oc_arrigo")) return;
        say("oc_arrigo", F.is("oc_dubbio") ? "[pensa] Mio padre era il tesoriere. Lo zio il presidente. I soldi spariscono, va in galera il presidente. È logico. È… logico, no?" : ["[furbo] Ladro di famiglia, notaio di famiglia. Tutto torna.", "Il '71 era buono. Lo ammetto. Lo zio aveva gusto per i vini e per le disgrazie.", "Se vince il neutrale, sceglie lui. Quindi lei, adesso, è la persona più importante della villa. Le posso offrire un caffè?"][Math.floor(Math.random() * 3)]); done();
      },
      oc_teo() {
        if (K.rel.scene("oc_teo")) return;
        say("oc_teo", F.is("oc_seduta_trucco") ? "[furbo] Un cappello da giardiniere fuori dalla serra, a mezzanotte? Ce ne sono tanti, di giardinieri. Io, per esempio. E… io. Basta, mi pare." : [`[pensa] Dadi d'avorio: ne hai ${H.dadi()}. Uno sta in cantina, in una botte che non si apre. Uno nella serra, tra le felci che piacciono a Ofelia.`, "Le oche stanotte erano nervose. C'era qualcuno in giro. Uno spirito, magari. Con le scarpe da giardino.", "[ride] I gemelli? Da piccoli si nascondevano nel labirinto, e il Conte faceva finta di non trovarli. Per ore. Poi gli portava il gelato."][Math.floor(Math.random() * 3)]); done();
      }
    };
    function gemello(who) {
      const s = S();
      if (s !== 3) return (who === "oc_cosimo" ? (say("oc_cosimo", pace() ? "[ride] Mio fratello tira ancora alto. Ma adesso glielo posso dire." : "Il labirinto di notte è più facile. Si vede la luna sopra l'uscita."), done()) : (say("oc_damiano", pace() ? "[ride] Mio fratello si muove ancora prima. Ma adesso glielo posso dire." : "Undici metri e venti."), done()));
      if (!F.is("oc_partita_fatta")) {
        if (who === "oc_cosimo") say("oc_cosimo", "[pensa] Una partita? Con lui? Io in porta, lui contro? Come nel 2004? …Va bene. Ma con lui dalla mia parte. Così se tira alto, tira alto per me.");
        else if (who === "oc_damiano") say("oc_damiano", "[arrabbiato] Una partita? Con mio fratello in porta? Dalla mia parte? …Così vedo se si muove prima anche coi suoi. Va bene.");
        else say("oc_tonio", "[ride] Io e il notaio contro te e Damiano, con Cosimo in porta per voi. Teo arbitra le oche. Gilda arbitra noi. Porte: due vasi di limoni.");
        return ask("Il prato davanti alla villa. Due vasi di limoni per porta, le oche a centrocampo, Gilda col fischietto da esecutrice.", [
          { label: "⚽ Si gioca · Sul prato del Conte", sub: "Tu e Damiano, Cosimo in porta, contro Tonio e Arrigo. Con le oche in campo.", big: true, fn: partita },
          { label: "◂ Più tardi", fn: done }
        ]);
      }
      say("voce", "La partita l'avete già giocata."); done();
    }

    const zones = {
      oc_parco: Z.parco(H, (s) => {
        const L = [];
        if (s === 3) { L.push({ id: "oc_cosimo", at: [31, 12] }); L.push({ id: "oc_damiano", at: [8, 14] }); L.push({ id: "oc_tonio", at: [22, 17] }); }
        if (s === 4) L.push({ id: "oc_gilda", at: [22, 16] });
        if (s >= 1) L.push({ id: "oc_arrigo", at: [24, 8] });
        return L;
      }, {
        region: "sera", time: "tramonto", bg: "oc_parco_sera", items: [[3, 17], [37, 21], [12, 30], [27, 12]], itemCos: "oc_c2",
        cantina: { to: "oc_cantina", at: [8, 8], locked: (K2) => (K2.stepOf(2) < 1 ? "Il lucchetto a combinazione. Ernestina dice che la combinazione la sa lei. Chiedile in cucina." : false) },
        intro: [["voce", "Il parco al tramonto. Le siepi diventano arancioni, le oche tornano verso il ruscello in fila indiana. Dalla cucina esce un profumo di brodo e di rosmarino."]]
      }),
      oc_cucina: Z.cucina(H, () => [{ id: "oc_ernestina", at: [4, 4] }], {}),
      oc_serra: Z.serra(H, (s) => (s === 2 ? [{ id: "oc_ofelia", at: [7, 3] }] : [{ id: "oc_ofelia", at: [7, 3] }]), {
        time: "notte", bg: "oc_seduta",
        loot: { "2,6": { id: "oc_dado", text: "Tra le felci, nel vaso in basso a sinistra, qualcosa di bianco: un dado d'avorio, mezzo sepolto nel terriccio.", empty: "Solo felci. Ofelia dice che sono felci medianiche. Sono felci." } }
      }),
      oc_capanno: Z.capanno(H, () => [{ id: "oc_teo", at: [4, 3] }], {}),
      oc_salone: Z.salone(H, () => [{ id: "oc_gilda", at: [9, 2] }], {}),
      oc_cantina: {
        interior: true, region: "cantina", name: "La cantina del Conte", short: "Cantina", sub: "Botti, ragnatele e un registro che nessuno doveva leggere", bg: "oc_cantina", w: 16, h: 10, start: [8, 8], outside: ["oc_parco", 29, 6], base: "+",
        act: { X: "Guarda le botti", L: "Leggi lo scaffale", x: "Apri la cassetta", z: "Guarda le casse" },
        flavor: { z: "Casse di bottiglie vuote, etichettate per anno. Il '72, il '73 e il '74 mancano. Al loro posto un foglio: «anni non bevuti».", l: "Una lampadina appesa a un filo. Si accende da sola quando entri. Teo dice che è un sensore. Ernestina dice che è il Conte." },
        loot: { "13,2": { id: "oc_barolo", text: "La botte con la scritta «NON APRIRE PRIMA DEL '71» ha un'anta. Dentro, coricata nella paglia, una bottiglia. Etichetta a mano: «'71 · per quando torno».", empty: "La botte è vuota. Odora di vino e di promesse." }, "2,7": { id: "oc_dado", text: "Nella cassetta degli attrezzi del cantiniere, avvolto in un fazzoletto ricamato «L.B.», un dado d'avorio.", empty: "Solo il fazzoletto. «L.B.» Lucia Bove." } },
        objects: { "1,2": (o, K2) => { K2.learnLore("l_oc_registro"); F.set("oc_registro_letto", true); K2.say([["voce", "Sullo scaffale, tra le bottiglie, un libro dei conti con la copertina blu: «U.S. RONDINESE · 1971-72». Le prime pagine sono ordinate. A pagina 63, colonne di cifre cancellate e una riga a penna rossa, nella calligrafia del Conte:"], ["voce", "<i>«Mancano 40 milioni. Li ha presi O. Li restituisco io.»</i>"], ["voce", "O. come Ottone. Il fratello del Conte. Il padre di Arrigo. Rimetti il libro dove l'hai trovato. Ma non riesci a smettere di pensarci."]], K2.done); } },
        npcs: () => [],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 9, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 9, "a"); lay(15, 0, 15, 9, "a"); lay(0, 9, 15, 9, "a"); put(8, 9, "v"); lay(3, 2, 6, 2, "X"); lay(10, 2, 13, 2, "X"); lay(3, 5, 5, 5, "X"); lay(10, 5, 12, 5, "X"); put(1, 2, "L"); put(1, 3, "L"); put(2, 7, "x"); put(14, 7, "z"); put(13, 7, "z"); put(8, 4, "l"); },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.strokeStyle = "rgba(226,232,240,.25)"; g.lineWidth = 0.6; [[1, 1], [14, 1], [7, 8]].forEach(([x, y], i) => { const X = d.X(x), Y = d.Y(y); for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(X, Y); g.lineTo(X + Math.cos(k * 0.6 + i) * 12, Y + Math.sin(k * 0.6 + i) * 12); g.stroke(); } }); H.plaque(g, "NON APRIRE PRIMA DEL '71", d.X(13) + 8, d.Y(2) - 3, "#fbbf24"); g.fillStyle = `rgba(251,191,36,${0.05 + 0.03 * Math.sin(f / 20)})`; g.fillRect(d.X(0), d.Y(0), 256, 160); }
      }
    };
    return {
      n: N, title: "Il Labirinto e il Ponte", sub: "Una cena alla Locanda, una seduta spiritica e un rigore di vent'anni fa",
      goal, start: "oc_parco", introBg: "oc_locanda", zones, talk, obj: {},
      intro: [["voce", "Seconda sera a Villa Pastrocchi. Le pedine sono ferme sulla Locanda, la 19, e per regola del Conte chi è in Locanda cena in villa."], ["voce", "Ernestina ha acceso tutti i fornelli. Arrigo ha messo la cravatta. I gemelli si sono seduti ai due capi del tavolo, il più lontano possibile."]]
    };
  }
  boot();
})();
