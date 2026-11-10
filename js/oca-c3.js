// js/oca-c3.js - «IL GIOCO DELL'OCA DEL CONTE» · Capitolo 3: La Prigione
// La terza tirata si gioca di notte, alle lanterne (clausola del Conte): dieci caselle, dal Labirinto (42) alla Prigione (52).
// Chi arriva alla 52 passa la notte nella cappella di famiglia, «come ho fatto io». Dentro, il Conte si era ricostruito la sua cella: una parete incisa col chiodo,
// un'inferriata, un altare con una lettera mai spedita. Il capitolo serio della saga: 1972, i soldi della Rondinese, Ottone, Lucia. All'alba, cosa farne.
// Zone: il parco di notte, la cappella (14x11), la cucina all'alba.
(function () {
  "use strict";
  function boot() {
    const E = window.__ocaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__ocaH || !window.__ocaZ || !window.__tabellone) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__ocaH(K), Z = window.__ocaZ, { say, done, wask, ask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("oc_c3", { kind: "acc", label: "Lanterna della cappella", val: "lanterna", from: "Capitolo 3 di Il Gioco dell'Oca del Conte" });
    K.lore("l_oc_cella", { t: "La cella nella cappella", d: "Nel 1975, uscito da Porta Nebbia, il Conte fece costruire nella cappella di famiglia una copia esatta della sua cella: tre metri per due, un'inferriata, una branda. Ci dormiva una notte all'anno, il 14 marzo, il giorno della sentenza. Sulla parete, mille e novantasei tacche: i giorni di carcere." });
    K.lore("l_oc_verita", { t: "La verità del '72", d: "I quaranta milioni della Rondinese li prese Ottone Pastrocchi, il tesoriere, fratello del Conte, per coprire debiti di gioco. Il Conte se ne accorse quando Ottone aveva appena avuto un figlio, Arrigo. Firmò lui i registri e si fece condannare al suo posto. Poi restituì tutto, lira per lira, in vent'anni di pacchi di Natale alla Rondinese." });
    K.lore("l_oc_lucia", { t: "Lucia Bove", d: "La cuoca di Villa Pastrocchi negli anni Settanta. Il Conte le scriveva dal carcere lettere che non spediva mai. Nel 1973, mentre lui era dentro, Lucia ebbe una bambina e la chiamò Ernestina. Non disse mai a nessuno chi fosse il padre." });
    const goal = (s) => ({
      0: "Notte, lanterne accese: Gilda ti aspetta al tabellone per la terza tirata, dal Labirinto alla Prigione.",
      1: "La cappella di famiglia è aperta (in basso a destra nel parco). Passa la notte lì: guarda l'altare, il ritratto e la parete in fondo.",
      2: "L'alba. Ernestina è già in cucina: hai in tasca una lettera che è sua.",
      3: "Arrigo è sulla terrazza a guardare le oche. Anche lui ha un conto aperto col '72.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");
    const visti = () => ["oc_vista_parete", "oc_vista_altare", "oc_visto_ritratto"].filter((f) => F.is(f)).length;

    function fin() {
      setStep(N, 4); F.set("oc_c3_done", true);
      const m = K.reward("oc_c3", { coins: 140, cos: "oc_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Mattina del quarto giorno. Il tabellone sul viale è bagnato di rugiada. Le pedine sono tutte alla 52, tranne quella del Conte: Gilda l'ha messa sulla 63, come da testamento. «Vi aspetta lì.»"],
        ["oc_gilda", "[serio] L'ultima tirata. Undici caselle, dalla Prigione alla fine. C'è la Morte, alla 58: chi ci cade torna dov'era partito. Il Conte ci teneva, a quella casella. Diceva che è la più onesta del gioco."],
        ["oc_gilda", "[pensa] E c'è una busta, nello studio del Conte. «Da aprire alla 63.» Chi ci arriva primo, la apre."],
        ["voce", `<b>FINE DEL CAPITOLO 3 · «La Prigione»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 4 ti aspetta: le ultime undici caselle, lo studio chiuso del Conte e una busta sigillata con un'oca di ceralacca."]
      ]), () => K.openMain(), "oc_parco_alba");
    }
    function terza() {
      const story = {
        45: { who: "oc_ernestina", t: "La lanterna di Ernestina", text: "Ernestina cammina accanto alla tua pedina con la lanterna alzata. «Mia madre diceva che il Conte, la notte, andava in cappella. Io da bambina lo seguivo. Non sono mai entrata.» Ti guarda. «Lei entrerà.»", opts: [
          { label: "❤️ «Le racconterò tutto. Promesso.»", sub: "Una promessa", eff: { flag: "oc_promessa" }, after: "Ernestina annuisce. Ti mette in mano un biscotto avvolto nel tovagliolo, «per la notte», e torna indietro con la lanterna." },
          { label: "🦊 «Cosa cercava, secondo lei?»", sub: "Una domanda in più", eff: { move: 1 }, after: "«Una cosa che aveva lasciato in cella.» Ci pensa. «Lo diceva così: in cella. Come se la cella ci fosse ancora.» Avanzi di uno, pensieroso." }] },
        49: { who: "oc_arrigo", t: "Un'offerta al buio", text: "Arrigo si sporge sopra la Buca della 49. Nel buio la sua voce è più bassa: «Lei arrivi alla 52, ci passi la notte, e qualunque cosa trovi in quella cappella me la porta. Senza leggerla. Pago bene. Pago in villa.»", opts: [
          { label: "❤️ «No.»", sub: "Solo no", eff: { flag: "oc_offerta_rifiutata" }, after: "Arrigo ride, ma non gli riesce bene. «Lo sapevo. Lo zio sceglieva sempre gente così. Per farmi dispetto.»" },
          { label: "🦊 «Cosa ha paura che ci sia?»", sub: "Lo metti all'angolo", eff: { flag: "oc_arrigo_paura", rival: "oc_arrigo", rmove: -2 }, after: "Arrigo non risponde. Arretra di due caselle senza accorgersene, e per una volta non bara nel contarle." }] }
      };
      H.tirata({ title: "Terza tirata · alla Prigione", from: 42, to: 52, rivals: ["ofelia", "ernestina", "tonio", "arrigo"], diff: 1, bg: "oc_notte", story }, (r) => {
        if (r.flags.oc_promessa) { K.bond("cuore", 1); K.rel.add("oc_ernestina", 2); if (!K.inv.has("oc_biscotto")) K.inv.give("oc_biscotto"); }
        if (r.flags.oc_offerta_rifiutata) K.bond("cuore", 1); if (r.flags.oc_arrigo_paura) K.bond("astuzia", 1);
        say("voce", `Casella 52, la Prigione. ${H.esito(r)} Le lanterne sul viale si spengono una a una. Gilda ti consegna una chiave di ferro lunga come una mano.`);
        say("oc_gilda", "[serio] La cappella. Il Conte ha scritto: «chi arriva alla Prigione ci dorma una notte, come ho fatto io». Le altre pedine sono ferme. La sua conta: lei è il giocatore neutrale, entra lei.");
        say("oc_tonio", "[serio] Se senti rumori, sono io che faccio la ronda. Se senti rumori di scivolata, sono sempre io.");
        setStep(N, 1); quest("oc_c3b", "La notte nella cappella", "La cappella in basso a destra nel parco: guarda l'altare, il ritratto, la parete in fondo."); done();
      });
    }
    function ricordo() {
      if (S() !== 1 || visti() < 3) return false;
      K.learnLore("l_oc_verita"); K.learnLore("l_oc_lucia");
      K.scene([
        ["voce", "Ti siedi sulla branda. La candela sull'altare trema. Hai la lettera in mano, il registro in testa, mille e novantasei tacche davanti agli occhi. E il resto lo vedi, come se ci fossi."],
        ["voce", "<i>Valcortese, marzo 1972. Il tribunale ha i vetri sporchi. In prima fila c'è Ottone Pastrocchi, tesoriere della Rondinese, con un neonato in braccio: Arrigo, tre mesi.</i>"],
        ["oc_conte", "[serio] <i>«I registri li ho firmati io. I soldi li ho presi io. Mio fratello non ne sapeva niente.»</i>"],
        ["voce", "<i>Ottone abbassa gli occhi sul bambino. Non li rialza più, per tutta l'udienza. In fondo all'aula, in piedi, una ragazza col grembiule sotto il cappotto: Lucia. Il Conte la cerca con lo sguardo una volta sola, prima di uscire tra i carabinieri.</i>"],
        ["voce", "<i>Porta Nebbia, inverno. Il Conte incide una tacca nel muro col chiodo di una cassetta. Poi scrive, a lume di candela, una lettera che non spedirà mai.</i>"],
        ["oc_conte", "[triste] <i>«Lucia, mi hanno detto della bambina. Non venire qui, non portarla qui. Quando esco le insegno a giocare all'oca, e a perdere bene. Che è la cosa più difficile.»</i>"],
        ["voce", "La candela si spegne. Nel buio, la porta della cappella cigola. Una lanterna. Un cappello da giardiniere."],
        ["oc_teo", "[serio] Non volevo spaventarla. Il Conte ci veniva ogni anno, il 14 marzo. Io lo aspettavo fuori con la lanterna. Stanotte… l'abitudine."],
        ["oc_teo", "[pensa] Lei adesso sa una cosa che lui non ha mai detto a nessuno. Neanche a Ernestina. Soprattutto a Ernestina. Il Conte pensava che una figlia di un galeotto stesse peggio di una figlia di nessuno."],
        ["oc_teo", "[triste] Si sbagliava, secondo me. Ma lui era il Conte, e io sono il giardiniere. All'alba lei esce. Cosa ne fa, di quella lettera, lo decide lei."]
      ], () => {
        K.rel.add("oc_teo", 2);
        setStep(N, 2); quest("oc_c3c", "L'alba", "Ernestina è già in cucina. La lettera è sua.");
        K.say([["voce", "Esci dalla cappella che il cielo è color latte. Le oche dormono con la testa sotto l'ala. In cucina c'è già la luce accesa."]], K.done);
      }, "oc_ricordo");
      return true;
    }

    const talk = {
      oc_gilda() {
        const s = S();
        if (s === 0) {
          say("oc_gilda", "[serio] Terza tirata. Clausola del Conte: «la Prigione si raggiunge al buio». Quindi lanterne. Le oche protestano, ma il testamento è chiaro.");
          return ask("Lanterne a petrolio lungo il viale. Le caselle si leggono a fatica; la 52, con le sbarre dipinte, si vede benissimo.", [
            { label: "🎲 Si comincia · Terza tirata", sub: "Dal Labirinto (42) alla Prigione (52)", big: true, fn: terza },
            { label: "◂ Un momento", sub: "Prima cerca carte e regali", fn: done }
          ]);
        }
        say("oc_gilda", s === 1 ? "La chiave della cappella ce l'ha lei. Io resto qui con le pedine. Qualcuno deve pur sorvegliare Arrigo." : "[pensa] Ha la faccia di chi non ha dormito. Bene: la cappella fa quell'effetto. Anche a me, quando ho letto il testamento la prima volta."); done();
      },
      oc_ernestina() {
        if (K.rel.scene("oc_ernestina")) return; const s = S();
        if (s === 2 && K.inZone("oc_cucina")) {
          say("voce", "Ernestina è al tavolo di marmo, con il caffè davanti e il brodo spento per la prima volta in trentun anni. Ti guarda la lettera in mano prima ancora di guardare te.");
          say("oc_ernestina", "[serio] È la calligrafia del Conte. La conosco dalle liste della spesa. «Lucia Bove, cucina di Villa Pastrocchi.» Mia madre.");
          return wask("Lei aspetta. La lettera è indirizzata a sua madre. Quello che c'è dentro riguarda lei.", [
            { label: "❤️ Le dai la lettera, e le racconti la notte", sub: "La verità, adesso", big: true, w: { cuore: 2 }, fn: () => { F.set("oc_verita_ernestina", true); K.inv.take("oc_lettera"); say("voce", "Ernestina legge. Due volte. La seconda con il dito che segue le righe, come le aveva insegnato sua madre."); say("oc_ernestina", "[triste] «Le insegno a giocare all'oca, e a perdere bene.» …Mi ha insegnato. Avevo sei anni. Mi faceva vincere sempre, e poi diceva che avevo barato."); say("oc_ernestina", "[pensa] Lo sapevo. Non lo sapevo, ma lo sapevo. Mi teneva sempre il posto a capotavola, e io non mi sono mai seduta."); K.rel.add("oc_ernestina", 4); avanti(); } },
            { label: "🦊 «Gliela do alla 63. È lì che il Conte voleva le verità.»", sub: "Aspetti la fine del gioco", big: true, w: { astuzia: 2 }, fn: () => { F.set("oc_lettera_tenuta", true); say("oc_ernestina", "[serio] Alla 63. Va bene. Ho aspettato cinquantatré anni, posso aspettare undici caselle."); say("oc_ernestina", "[pensa] Ma se arriva prima Arrigo, quella lettera la brucio io. Insieme alla villa."); K.rel.add("oc_ernestina", 1); avanti(); } }
          ]);
        }
        if (s === 2) { say("oc_ernestina", "Venga in cucina. Il caffè è pronto. Ho fatto anche il brodo, per abitudine, poi l'ho spento."); return done(); }
        say("oc_ernestina", F.is("oc_verita_ernestina") ? ["[pensa] Ho messo la lettera nel libro delle ricette. Tra le lasagne e il ragù. È il posto più sicuro della casa.", "[ride] Ho rimproverato Teo perché non me l'ha mai detto. Lui ha detto che è il giardiniere. Ho detto che anche i giardinieri parlano. Si è offeso."][Math.floor(Math.random() * 2)] : ["Undici caselle. Poi la lettera.", "[serio] Ha dormito, nella cappella? No. Si vede."][Math.floor(Math.random() * 2)]); done();
        function avanti() { setStep(N, 3); quest("oc_c3d", "Arrigo", "Arrigo è sulla terrazza a guardare le oche."); done(); }
      },
      oc_arrigo() {
        if (K.rel.scene("oc_arrigo")) return; const s = S();
        if (s === 3) {
          say("voce", "Arrigo è sulla terrazza, in vestaglia, con una tazza in mano. Le oche gli girano intorno senza beccarlo, per una volta. Ti vede arrivare dalla cappella e capisce.");
          say("oc_arrigo", "[serio] L'ha trovato. Il registro, la lettera, qualcosa. Lo vedo da come cammina: cammina come lo zio quando aveva ragione.");
          say("oc_arrigo", "[pensa] Mio padre è morto nel '98. Non ha mai parlato del '72. Mai. Però ogni 14 marzo si ubriacava. Io pensavo fosse per la vergogna dello zio.");
          return wask("Arrigo stringe la tazza. Ha cinquantaquattro anni ed è la prima volta che sembra il figlio di qualcuno.", [
            { label: "❤️ Gli dici la verità, piano", sub: "Suo padre, il registro, lo zio che si è preso la colpa", big: true, w: { cuore: 2 }, fn: () => { F.set("oc_arrigo_sa", true); say("voce", "Glielo racconti senza aggettivi. Arrigo ascolta guardando il prato, poi guarda la cappella, poi non guarda più niente."); say("oc_arrigo", "[triste] Tre anni. Per mio padre. Per me, che avevo tre mesi. E io l'ho chiamato ladro a cena davanti a tutti."); say("oc_arrigo", "[serio] …All'ultima tirata gioco pulito. Non per lei. Per lui. Una volta sola, poi torno quello di prima, non si preoccupi."); K.rel.add("oc_arrigo", 4); fin(); } },
            { label: "🦊 «Se all'ultima tirata bara, lo sanno tutti.»", sub: "Il registro come leva", big: true, w: { astuzia: 2 }, fn: () => { F.set("oc_ricatto", true); say("oc_arrigo", "[arrabbiato] Un ricatto. In casa mia. Con le carte di mio padre."); say("oc_arrigo", "[furbo] …Rispetto. Giocherò pulito. E lei mi spiegherà, un giorno, cosa c'era scritto davvero. Lo sento che non mi ha detto tutto."); K.rel.add("oc_arrigo", 1); fin(); } }
          ]);
        }
        say("oc_arrigo", s < 3 ? (s === 1 ? "[furbo] Buona notte in cappella. Se trova un notaio sepolto lì sotto, non è un parente: è un collega." : "[pensa] L'alba. Il momento in cui i bari vanno a dormire e gli onesti si alzano. Io sono sveglio. Non so cosa vuol dire.") : "[pensa] Undici caselle. Senza trucchi. Mi sento nudo."); done();
      },
      oc_teo() {
        if (K.rel.scene("oc_teo")) return;
        say("oc_teo", S() >= 2 ? "[pensa] Il Conte diceva che la verità è come la potatura: fa male alla pianta, ma l'anno dopo fiorisce. Io, comunque, poto col righello." : [`[pensa] Dadi d'avorio: ne hai ${H.dadi()}. Uno sta in cappella, nella cassetta delle elemosine. Il Conte ci metteva i dadi invece dei soldi. Diceva che era la stessa cosa.`, "Di notte le siepi sembrano più alte. È un'impressione. Le ho misurate.", "[serio] La cappella non la apro io. Io porto la lanterna. È sempre stato così."][Math.floor(Math.random() * 3)]); done();
      },
      oc_tonio() { if (K.rel.scene("oc_tonio")) return; say("oc_tonio", ["[serio] Faccio la ronda. Se vedo uno spirito gli chiedo un autografo. Se vedo Arrigo, gli faccio un fallo tattico.", "Il Conte un ladro… no. Io ho preso ventotto ammonizioni in una stagione. So riconoscere chi entra duro e chi no. Lui non entrava duro."][Math.floor(Math.random() * 2)]); done(); },
      oc_ofelia() { if (K.rel.scene("oc_ofelia")) return; say("oc_ofelia", ["[pensa] Stanotte ho tirato le carte. È uscita la Giustizia. Rovesciata. Vuol dire che arriva in ritardo. Di cinquant'anni, direi.", "[sorpreso] La cappella! Io lì non entro. Non per gli spiriti. Per l'umidità."][Math.floor(Math.random() * 2)]); done(); },
      oc_cosimo() { say("oc_cosimo", F.is("oc_gemelli_pace") ? "[ride] Io e Damiano facciamo la guardia alle pedine. Lui guarda la 52, io la 42. Come una difesa a due." : "Mio fratello fa la guardia alla 52. Io alla 42. Ci incontriamo alla 47, e ci giriamo dall'altra parte."); done(); },
      oc_damiano() { say("oc_damiano", F.is("oc_gemelli_pace") ? "[pensa] Mio fratello ha detto che il Conte veniva a vederci giocare, da ragazzi. Nascosto dietro la rete. Io non me n'ero mai accorto." : "Undici metri e venti. Me lo sogno anche stanotte."); done(); }
    };

    const cellLook = {
      parete: (o, K2) => { const first = !F.is("oc_vista_parete"); F.set("oc_vista_parete", true); K2.learnLore("l_oc_cella"); K2.say([["voce", "La parete di fondo della cella è di calce, incisa da cima a fondo. Tacche a gruppi di cinque, col chiodo. Le conti: mille e novantasei. Tre anni."], ["voce", "In basso, accanto alla branda, più piccole: «L.» e una data, «14-3-1972». E sotto, più recente, a matita: «Ernestina ha fatto il ragù. Era buono. Non gliel'ho detto.»"], ...(first ? endLook() : [])], () => { if (!ricordo()) K2.done(); }); },
      altare: (o, K2) => { const first = !F.is("oc_vista_altare"); F.set("oc_vista_altare", true); if (!K2.inv.has("oc_lettera") && !F.is("oc_verita_ernestina") && !F.is("oc_lettera_tenuta")) K2.inv.give("oc_lettera"); K2.say([["voce", "Sull'altare, al posto del Vangelo, un registro della Rondinese e una scatola di latta. Nella scatola, una busta ingiallita con un francobollo da 50 lire mai timbrato: «Lucia Bove, cucina di Villa Pastrocchi»."], ["voce", "Non è chiusa. Dentro c'è una lettera datata «Porta Nebbia, dicembre 1972». La metti nello Zaino (✉️ <b>Lettera a Lucia</b>). Non è tua. Ma stanotte, qui, sei tu che hai la chiave."], ...(first ? endLook() : [])], () => { if (!ricordo()) K2.done(); }); },
      ritratto: (o, K2) => { const first = !F.is("oc_visto_ritratto"); F.set("oc_visto_ritratto", true); K2.say([["voce", "Il ritratto ufficiale del Conte, giovane, in abito da presidente della Rondinese. Dietro la cornice, infilata nel legno, una foto piccola e piegata: una donna col grembiule e una bambina di due anni in braccio, davanti alla cucina della villa."], ["voce", "Sul retro, a penna: «Lucia ed E., 1975. Il giorno che sono tornato. Non mi hanno visto. Meglio così.»"], ...(first ? endLook() : [])], () => { if (!ricordo()) K2.done(); }); }
    };
    function endLook() { const n = visti(); return n < 3 ? [["voce", `<span style="opacity:.75">Nella cappella c'è ancora qualcosa da guardare (${n}/3).</span>`]] : []; }

    const NIGHT = { region: "notte", time: "notte", bg: "oc_notte", itemCos: "oc_c3", items: [[2, 9], [40, 4], [30, 30], [17, 20]] };
    const zones = {
      oc_parco: Z.parco(H, (s) => {
        const L = [];
        if (s === 0) L.push({ id: "oc_gilda", at: [22, 16] });
        if (s === 1) { L.push({ id: "oc_gilda", at: [22, 16] }); L.push({ id: "oc_tonio", at: [28, 20] }); L.push({ id: "oc_ofelia", at: [10, 20] }); L.push({ id: "oc_cosimo", at: [18, 13] }); L.push({ id: "oc_damiano", at: [26, 11] }); }
        if (s === 0) { L.push({ id: "oc_tonio", at: [28, 20] }); L.push({ id: "oc_ofelia", at: [10, 20] }); }
        if (s >= 3) L.push({ id: "oc_arrigo", at: [24, 8] });
        if (s >= 2) L.push({ id: "oc_teo", at: [33, 28] });
        if (s === 0) L.push({ id: "oc_teo", at: [33, 28] });
        return L;
      }, Object.assign({}, NIGHT, {
        cappella: { to: "oc_cappella", at: [7, 9], locked: (K2) => (K2.stepOf(3) < 1 ? "La cappella di famiglia. Chiusa a chiave. Gilda dice che la chiave tocca a chi arriva alla Prigione." : false) },
        intro: [["voce", "Il parco di notte. Lanterne a petrolio lungo il viale del tabellone, la luna sopra il labirinto, la cappella in fondo con una candela accesa dietro la grata. Le oche, insonni, borbottano."]]
      })),
      oc_cucina: Z.cucina(H, () => [{ id: "oc_ernestina", at: [4, 4] }], { bg: "oc_cucina", intro: [["voce", "La cucina all'alba. Il brodo è spento. È la prima volta che la vedi senza vapore."]] }),
      oc_capanno: Z.capanno(H, () => [], {}),
      oc_salone: Z.salone(H, () => [], {}),
      oc_serra: Z.serra(H, () => [], { time: "notte", bg: "oc_seduta" }),
      oc_cappella: {
        interior: true, region: "cappella", name: "La cappella di famiglia", short: "Cappella", sub: "Un altare, un ritratto e una cella di tre metri per due", bg: "oc_cappella", w: 14, h: 11, start: [7, 9], outside: ["oc_parco", 35, 27], base: "A",
        act: { O: "Guarda l'altare", Q: "Guarda il ritratto", Z: "Guarda la parete", x: "Apri la cassetta", I: "Guarda l'inferriata" },
        flavor: { I: "L'inferriata della cella. Vera: il Conte l'ha comprata all'asta quando hanno ristrutturato Porta Nebbia. La porticina è aperta, legata con un nastro rosso.", b: "Le panche della cappella. Su una c'è inciso «U. + L.» con un cuore storto. Poi qualcuno, forse lo stesso, ha provato a cancellarlo.", l: "Candele. Una è accesa da chissà quanto. Teo dice che le cambia lui. Teo dice molte cose." },
        loot: { "1,8": { id: "oc_dado", text: "La cassetta delle elemosine. Dentro, invece delle monete, un dado d'avorio e un biglietto: «Per le anime del Purgatorio che giocano all'oca».", empty: "La cassetta è vuota. Il biglietto è rimasto: le anime giocano ancora." } },
        objects: { "6,1": cellLook.altare, "7,1": cellLook.altare, "3,1": cellLook.ritratto, "13,6": cellLook.parete, "13,7": cellLook.parete, "13,8": cellLook.parete },
        npcs: () => [],
        intro: [["voce", "La cappella. Fa freddo, odora di cera e di muffa nobile. In fondo a destra, dove dovrebbe esserci un confessionale, c'è una cella: inferriata, branda, un secchio. La porta della cella è aperta."]],
        build(L) { const { lay, put } = L; lay(0, 0, 13, 10, "A"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 10, "a"); lay(13, 0, 13, 10, "a"); lay(0, 10, 13, 10, "a"); put(7, 10, "v"); put(6, 1, "O"); put(7, 1, "O"); put(3, 1, "Q"); put(5, 1, "l"); put(8, 1, "l"); lay(2, 4, 5, 4, "b"); lay(2, 6, 5, 6, "b"); put(9, 5, "I"); put(10, 5, "I"); put(12, 5, "I"); put(9, 6, "I"); put(9, 8, "I"); lay(13, 6, 13, 8, "Z"); put(1, 8, "x"); put(12, 9, "l"); },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); [[5, 1], [8, 1], [12, 9]].forEach(([x, y], i) => { const X = d.X(x) + 8, Y = d.Y(y) + 2, r = 10 + Math.sin(f / 9 + i) * 2; const gr = g.createRadialGradient(X, Y, 1, X, Y, r * 2.4); gr.addColorStop(0, "rgba(253,224,71,.32)"); gr.addColorStop(1, "rgba(253,224,71,0)"); g.fillStyle = gr; g.fillRect(X - r * 2.4, Y - r * 2.4, r * 4.8, r * 4.8); });
          g.fillStyle = "#57534e"; g.fillRect(d.X(11) + 2, d.Y(8) + 4, 12, 8); g.fillStyle = "#a8a29e"; g.fillRect(d.X(11) + 3, d.Y(8) + 5, 10, 3); H.plaque(g, "1972", d.X(11) + 8, d.Y(5) - 4, "#f87171"); }
      }
    };
    return {
      n: N, title: "La Prigione", sub: "Una notte nella cappella del Conte, e cosa farne all'alba",
      goal, start: "oc_parco", introBg: "oc_notte", zones, talk, obj: {},
      intro: [["voce", "Terzo giorno a Villa Pastrocchi. Il Conte ha lasciato scritto che la Prigione si raggiunge al buio: alle nove di sera Teo accende le lanterne lungo il viale."], ["voce", "Nessuno ride, stasera. Anche Tonio ha messo la giacca. Ofelia non ha portato le carte. Arrigo, per la prima volta, non ha portato i suoi dadi."]]
    };
  }
  boot();
})();
