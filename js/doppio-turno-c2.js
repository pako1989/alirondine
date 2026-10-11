// js/doppio-turno-c2.js - DOPPIO TURNO · Capitolo 2 «Il Fuori»
// Fuori: il luna park chiuso, il Cartografo e la Gabbia contro i Gabbiani del Molo (forzata). Il codice della porta 8 lo sa solo il Fuori:
// va mandato al Dentro con un biglietto. Dentro: l'Archivio con il registro dell'Armadietto 7 e la bobina della Voce.
// Colpo di scena: chi ha scritto i biglietti firmati «14». Partita secondaria a scelta: il Torneo dei Reparti.
(function () {
  "use strict";
  function boot() { const DTm = window.__doppioTurno; if (!DTm || !DTm.addChapter || !DTm._has || !DTm._has(1)) return setTimeout(boot, 120); DTm.addChapter(chapter2); }
  function chapter2(X) {
    const { T, F, say, ask, done, go, note, setStep, reward, knows, learnFact, conf, finishChapter } = X;
    const N = 2, S = () => X.stepOf(N);
    const zone = () => X.api.trZone();

    X.cast("dt_cartografo", { name: "Il Cartografo", tag: "", hair: "#111111", style: "messy", skin: "#8d5524", eye: "#111111", shades: true, cap: "#222222", bg: ["#120c1e", "#5af06a"], shirt: "#2a2a33" },
      "Felpa, cappuccio, occhiali scuri anche di notte. Vive dentro la giostra chiusa del luna park, tra schermi e cavi. Disegna mappe dei posti dove non si può entrare. Si dice che abbia giocato nel Porto Livido FC, in porta, per una partita sola.");
    X.cast("dt_scheggia", { name: "Scheggia", tag: "", hair: "#e8d08a", style: "spiky", skin: "#e0ac7e", eye: "#2b1d14", bg: ["#22345a", "#e8d08a"], shirt: "#22345a" },
      "Capitano dei Gabbiani del Molo, la squadra di strada del porto. Gioca a piedi nudi anche d'inverno. Odia il Valtorre, ama le sfide, e non ha mai perdonato al 14 di essere andato via.");
    X.cos("dt_c2", { kind: "shirt", label: "Felpa del Cartografo", val: "#2a2a33", from: "Completa il Capitolo 2 di Doppio Turno" });
    X.cos("dt_ruota", { kind: "hairc", label: "Capelli Lucine", val: "#ffd36b", from: "Raccogli tutte le conchiglie al Luna Park" });
    X.cos("dt_archivista", { kind: "shirt", label: "Camice dell'Archivio", val: "#1f2f2e", from: "Raccogli tutte le graffette d'oro all'Archivio" });

    X.fact("f_cartografo", { t: "Il Cartografo", d: "Un ragazzo col cappuccio che disegna mappe dei posti chiusi. Ha mappato il Complesso dall'esterno, muro per muro." });
    X.fact("f_mappa", { t: "La mappa del Complesso", d: "Sotto il Campo Bianco c'è una stanza che non compare in nessuna pianta. Il Cartografo l'ha chiamata «la Sala della Voce»." });
    X.fact("d_archivio", { t: "L'Archivio dietro la porta 8", d: "Faldoni con i contratti della Procedura Duale. Sul tuo ci sono due numeri: il tuo, e un 14 scritto a matita." });
    X.fact("d_registro", { t: "Il registro dell'Armadietto 7", d: "Alcuni biglietti li ha messi l'«Ufficio», in penna blu. Altri, firmati 14, li ha consegnati a mano «una donna coi capelli rossi»." });
    X.fact("d_registrazione", { t: "La bobina della Voce", d: "In archivio c'è la registrazione della Voce delle cuffie. Comincia così: «…sono io. Se mi senti…». Poi si interrompe." });

    X.noteDef("n_nina14", { to: "d", ink: "pennarello verde", sign: "14", fake: true, who: "Nina",
      text: "Sono il Fuori. Non ascoltare la Voce. Mai. E cerca il registro dell'Armadietto 7, nell'Archivio dietro la porta 8.",
      tell: "È firmato «14». Il tuo numero è {num}, e il Fuori firma sempre così. Chi ha scritto questo biglietto ti conosceva quando portavi il 14. E conosce l'Archivio.",
      onBelieve: () => { conf(-8); F.set("nina14_creduto", true); }, onUnmask: () => F.set("nina14_smascherato", true) });
    X.noteDef("n_ufficio2", { to: "f", ink: "penna blu aziendale", sign: "{num}", fake: true, who: "il Complesso",
      text: "Sono il Dentro. Il Cartografo lavora per il Valtorre: è lui che ti spia. Non dargli niente, non andare al luna park.",
      tell: "Il Dentro non può sapere chi sia il Cartografo: l'hai conosciuto tu, qui fuori, stasera. Qualcuno, là dentro, sa dove vai la sera.",
      onBelieve: () => { conf(6); F.set("uff2_creduto", true); }, onUnmask: () => F.set("uff2_smascherato", true) });

    const goal = (s) => ({
      0: "Parla con Nina al Bar Marea.",
      1: "Vai al luna park chiuso (uscita a est del porto) e trova il Cartografo nella giostra.",
      2: "Sfida Scheggia e i Gabbiani del Molo nella gabbia del luna park.",
      3: knows("f_quattordici", "d") || (X.mem().notes.w_f_quattordici && X.mem().notes.w_f_quattordici.st === "new") ? "Entra nel Complesso dall'ingresso del personale, al porto." : "Lascia al Dentro un biglietto con «Il numero 14» (Armadietto 7, all'ingresso del personale), poi entra nel Complesso.",
      4: knows("f_quattordici", "d") ? "Apri la porta numero 8, in alto nel Reparto Morale: ora conosci il codice." : "Leggi i biglietti nell'Armadietto 7 dell'atrio: il Fuori ti ha scritto qualcosa.",
      5: "Nell'Archivio: leggi il registro sul terminale e ascolta la bobina. Ofelia ti aspetta.",
      6: "Torna Fuori (ascensore nell'atrio) e parla con Nina.",
      7: "Decidi cosa fare con Nina.",
    }[s] || "Capitolo concluso. Il prossimo turno ti aspetta dal menu.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y, f) { g.font = "bold 7px system-ui, sans-serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, f ? "rgba(26,16,24,.85)" : "#ffffff"); R(g, x - w / 2, y + 2, w, 1, f ? "#ffb347" : "#2a9d8f"); g.fillStyle = f ? "#ffcf7a" : "#2b3a3a"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    const zones = {
      dt_giostre: {
        half: "f", name: "Doppio Turno · Il Luna Park chiuso", short: "Il Luna Park", sub: "Giostre ferme, una gabbia, un covo", bg: "dt_giostre",
        w: 38, h: 24, start: [2, 11], itemCos: "dt_ruota", items: [[36, 2], [36, 17], [2, 17], [22, 4]],
        areas: [[14, 4, 22, 12, "La giostra dei cavalli"], [26, 3, 35, 12, "La gabbia"], [1, 18, 36, 22, "Il recinto dello stadio"], [1, 1, 36, 22, "Il Luna Park chiuso"]],
        act: { C: "Guarda la giostra", f: "Guarda la rete", l: "Guarda le lucine", n: "Leggi il cartello", Q: "Guarda il cancello dello stadio", Z: "Guarda la ruota panoramica", q: "Bussa al botteghino", "<": "Torna al porto" },
        flavor: {
          C: ["La giostra dei cavalli: i cavalli sono fermi a metà salita. Dentro, tra le colonne specchiate, lampeggiano schermi verdi.", "Su un cavallo c'è scritto, a pennarello: «Questo è il 14. Galoppa a sinistra»."],
          f: "La rete della gabbia. Sui pali, adesivi dei Gabbiani del Molo e un vecchio adesivo strappato: «P.L.F.C.».",
          l: "Lucine attaccate a un palo. Funzionano: qualcuno ruba la corrente al Complesso con un cavo verde.",
          n: "Cartello: «LUNA PARK · CHIUSO PER RISTRUTTURAZIONE · VALTORRE». La ristrutturazione dura da tre anni.",
          Q: "Il cancello posteriore del vecchio Stadio del Porto. Lucchetto del Valtorre. Ma il cardine di destra è stato svitato, e rimesso a posto con lo scotch.",
          Z: "Il pilone della ruota panoramica. Qualcuno ci ha disegnato sopra, con il gesso, il campo del vecchio stadio e una X sul dischetto del rigore.",
          q: "Il botteghino: «Biglietti 1 euro · Bambini e capitani gratis». Dentro, polvere e una sciarpa del Porto Livido.",
        },
        intro: [["voce", "Il luna park di Porto Livido, chiuso da tre anni. La ruota panoramica è ferma contro il cielo viola, la giostra dei cavalli è avvolta in un telone. Ma da sotto il telone esce una luce verde. E il rumore di una tastiera."]],
        npcs: (s) => [{ id: "dt_cartografo", at: [18, 13] }, { id: "dt_scheggia", at: [30, 8] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 37, 0, "a"); lay(0, 23, 37, 23, "a"); lay(0, 0, 0, 23, "a"); lay(37, 0, 37, 23, "a");
          house(2, 2, 6, 4, { roof: "#c0392b", wall: "#e8e0d0", door: [4, 5, "q"] });
          lay(9, 2, 11, 9, "Z"); lay(15, 6, 21, 11, "C");
          lay(26, 3, 35, 3, "f"); lay(26, 12, 35, 12, "f"); lay(26, 3, 26, 12, "f"); lay(35, 3, 35, 12, "f"); lay(27, 4, 34, 11, "-"); put(30, 12, "-"); put(31, 12, "-");
          lay(1, 19, 36, 19, "f"); put(18, 19, "Q"); put(14, 17, "n");
          [[3, 14], [12, 14], [24, 14], [34, 16]].forEach(([x, y]) => put(x, y, "l"));
          put(0, 11, "<"); put(0, 12, "<");
        },
        decor(g, cx, cy, d) {
          // la giostra dei cavalli: pedana tonda, tetto a spicchi, cavalli che salgono e scendono
          const gx = d.X(15), gy = d.Y(6), gw = 7 * 16, gh = 6 * 16, ccx = gx + gw / 2, ccy = gy + gh / 2 + 8;
          if (gx > -140 && gx < 340) {
            g.fillStyle = "#2a1f2e"; g.fillRect(gx, gy, gw, gh);
            g.fillStyle = "#4a3a5a"; g.beginPath(); g.ellipse(ccx, ccy + 14, gw / 2, 22, 0, 0, 7); g.fill(); g.fillStyle = "#c9a227"; g.beginPath(); g.ellipse(ccx, ccy + 12, gw / 2 - 4, 18, 0, 0, 7); g.fill();
            for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + (X.F.is("giostra_on") ? d.fr / 40 : 0), hx = ccx + Math.cos(a) * 38, hy = ccy + 8 + Math.sin(a) * 12 + Math.sin(d.fr / 20 + i) * 2; R(g, hx - 1, hy - 26, 2, 26, "#e8d08a"); R(g, hx - 6, hy - 10, 12, 7, "#e8e0d0"); R(g, hx + 4, hy - 14, 3, 5, "#e8e0d0"); }
            for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? "#c0392b" : "#e8e0d0"; g.beginPath(); g.moveTo(ccx, gy - 10); g.arc(ccx, gy + 18, gw / 2 + 2, Math.PI + i * Math.PI / 12, Math.PI + (i + 1) * Math.PI / 12); g.closePath(); g.fill(); }
            for (let i = 0; i < 9; i++) { const on = (Math.floor(d.fr / 8) + i) % 3 !== 0; g.fillStyle = on ? "#ffd36b" : "#5a4a6a"; g.beginPath(); g.arc(gx + 6 + i * (gw - 12) / 8, gy + 18, 2, 0, 7); g.fill(); }
            g.save(); g.globalCompositeOperation = "lighter"; X.glow(g, ccx, ccy, 40, "90,240,106", 0.18 + 0.08 * Math.sin(d.fr / 7)); g.restore();
          }
          // la ruota panoramica sopra il pilone
          const wx = d.X(10) + 8, wy = d.Y(4);
          if (wx > -80 && wx < 400) { g.strokeStyle = "#7a5a8a"; g.lineWidth = 2; g.beginPath(); g.arc(wx, wy, 40, 0, 7); g.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2, x = wx + Math.cos(a) * 40, y = wy + Math.sin(a) * 40; g.beginPath(); g.moveTo(wx, wy); g.lineTo(x, y); g.stroke(); R(g, x - 5, y - 2, 10, 8, ["#ffd36b", "#ff7a7a", "#7ae0ff"][i % 3]); } R(g, wx - 3, wy, 6, 70, "#3a2a4a"); }
          plaque(g, "LA GABBIA", d.X(30) + 8, d.Y(3) - 2, true); plaque(g, "STADIO DEL PORTO ↓", d.X(18) + 8, d.Y(19) - 6, true);
        },
      },
      dt_archivio: {
        half: "d", name: "Doppio Turno · L'Archivio della Procedura", short: "L'Archivio", sub: "Dietro la porta numero 8", bg: "dt_archivio",
        w: 30, h: 20, start: [14, 17], itemCos: "dt_archivista", items: [[1, 1], [28, 1], [1, 18], [28, 18]],
        areas: [[3, 3, 26, 10, "Gli scaffali dei contratti"], [12, 12, 22, 17, "Il tavolo del registro"], [1, 1, 28, 18, "L'Archivio"]],
        act: { x: "Sfoglia i faldoni", d: "Leggi il registro", V: "Ascolta la bobina", v: "Torna al Reparto Morale" },
        flavor: {
          x: ["Faldoni grigi: «Procedura Duale · contratto n. 412», «n. 413»… Tutti firmati con due grafie diverse.", "Un faldone: «Bruno Tessari». Dentro, una sola pagina: «Desidera dimenticare: niente. Firma comunque». Povero Bruno.", "Un faldone: «Ofelia Sanz». È vuoto. Sulla copertina, a penna: «ritirato dall'interessata»."],
        },
        intro: [["voce", "La porta numero 8 si apre su un buio che ronza. Poi un neon si accende, sfarfallando. Scaffali di faldoni a perdita d'occhio. In fondo, un terminale acceso e un registratore a bobine."]],
        npcs: (s) => [{ id: "dt_ofelia", at: [10, 14] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 19, 29, 19, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a");
          [3, 6, 9].forEach((y) => { lay(3, y, 12, y, "x"); lay(17, y, 26, y, "x"); });
          put(14, 13, "d"); put(20, 15, "V"); lay(12, 16, 22, 16, '"');
          put(14, 19, "v"); put(15, 19, "v");
        },
        decor(g, cx, cy, d) { plaque(g, "ARCHIVIO · PROCEDURA DUALE", d.X(14) + 8, d.Y(1) + 6); },
      },
    };

    // ---------------------------------------------------------------- ritocchi alle zone del capitolo 1
    const patch = {
      dt_porto: { npcs: (s) => [{ id: "dt_nina", at: [30, 19] }, { id: "dt_pio", at: [3, 18] }] },
      dt_atrio: { npcs: (s) => (s === 4 ? [{ id: "dt_valtorre", at: [14, 8] }] : []) },
      dt_uffici: { npcs: (s) => [{ id: "dt_bruno", at: [11, 8] }].concat(s < 5 ? [{ id: "dt_ofelia", at: [25, 17] }] : []) },
      dt_campo: { npcs: (s) => [{ id: "dt_bruno", at: [11, 20] }] },
    };

    // ---------------------------------------------------------------- dialoghi
    function nina() {
      const s = S();
      if (s === 0) return say([
        ["voce", "Passano i giorni. Ogni mattina l'ascensore sale, ogni sera scende. Ogni sera il Fuori trova nell'armadietto un biglietto in penna blu, e ogni mattina il Dentro ne trova uno in pennarello verde. Due metà che si scrivono, come due amici di penna che abitano nello stesso corpo."],
        ["dt_nina", "Sei stanco. Ogni sera di più. E ogni sera hai le scarpe più pulite. Non mi piace, {n}."],
        ["dt_nina", "Ricordi cosa ti avevo detto? Il Cartografo. Ha il covo nella giostra del luna park, quello chiuso, a est del porto. Lui ha mappato il Complesso dall'esterno: ogni muro, ogni tubo. Se c'è un modo per capire cosa ti fanno lì dentro, ce l'ha lui."],
      ], () => { setStep(N, 1); done(); });
      if (s >= 1 && s <= 5) return say([["dt_nina", X.pick(["Il Cartografo è al luna park, a est. Non guardarlo negli occhiali: si offende.", "Scheggia? È un bravo ragazzo. Gioca coi piedi nudi e col cuore in mano. Ti odia, ma con affetto.", "Quando torni dentro… salutami il te di là. Anche se non sa chi sono."])]]);
      if (s === 6) return say([
        ["hero", "Il registro dell'armadietto. I biglietti firmati «14»: li hai scritti tu."],
        ["voce", "Nina smette di asciugare il bicchiere. Lo appoggia sul bancone, piano, come se fosse l'ultimo."],
        ["dt_nina", "Sì. Li ho scritti io. Col pennarello verde, perché sembrassero tuoi. Li ho dati a Pio, e Pio li ha messi nell'armadietto. Firmati 14, perché per me sei ancora quello."],
        ["dt_nina", "Volevo svegliarlo, il te di dentro. Volevo che disobbedisse alla Voce, che cercasse, che si ricordasse. Che si ricordasse di me, anche."],
        ["dt_nina", "Tu hai firmato per dimenticare qualcosa, {n}. Non so cosa. Non me l'hai mai detto. Ma io non volevo che dimenticassi tutto il resto. Il porto. La squadra. Noi."],
      ], () => { setStep(N, 7); chooseNina(); });
      if (s === 7) return chooseNina();
      return say([["dt_nina", F.get("nina") === "alleata" ? "Domani la finale. Il Porto Livido rinato contro il tuo Valtorre. Io sarò in campo. E tu?" : "…Il bar è aperto. Per tutti. Anche per te."]]);
    }
    function chooseNina() {
      ask("dt_nina", "«Allora? Mi odi?»", [
        { label: "«Mi hai mentito. Ma per tenermi qui.»", sub: "La perdoni: resta tua alleata", cls: "hot", fn: () => endNina("alleata") },
        { label: "«Non avevi il diritto di scrivere al mio posto.»", sub: "La allontani", fn: () => endNina("lontana") },
      ]);
    }
    function endNina(v) {
      F.set("nina", v); setStep(N, 8);
      say((v === "alleata" ? [
        ["dt_nina", "…Grazie. Allora ti dico anche il resto. Il Cartografo e io abbiamo rimesso insieme la squadra. Il Porto Livido FC. Con Scheggia, i Gabbiani, i vecchi. Ci siamo iscritti alla Coppa della Costa."],
        ["dt_nina", "E siamo arrivati in finale. Domani. Contro il Valtorre. Al Campo Bianco."],
      ] : [
        ["dt_nina", "Va bene. È giusto. Me lo merito."],
        ["dt_nina", "Allora lo saprai da Pio, come tutti: domani c'è la finale della Coppa della Costa. Il Valtorre contro il Porto Livido FC. Quello vero. Rinato."],
      ]).concat([
        ["dt_pio", "(dall'ingresso del personale) {num}! Domani turno speciale, eh! Finale! Lo dicono anche dentro: la Voce, domani, avrà molto da dirti."],
        ["voce", "Quella notte, il Fuori non riesce a dormire. Sogna un dischetto bianco, in uno stadio vecchio, e un pallone che non parte mai."],
      ]), () => {
        finishChapter(N, v);
        const msg = reward("dt_c2_done", { coins: 50, cos: "dt_c2" });
        note(v === "alleata" ? "Ho perdonato Nina: ha scritto lei i biglietti firmati 14. Il Porto Livido FC è rinato ed è in finale." : "Ho allontanato Nina. Domani c'è la finale contro il Porto Livido FC rinato.");
        say([["voce", "Fine del Capitolo 2 · «Il Fuori». " + (msg.length ? msg.join(" · ") : "")], ["voce", "Il prossimo turno comincia dal menu di Doppio Turno."]]);
      });
    }
    function pio() {
      const s = S();
      if (s === 6 || s === 7) return say([["dt_pio", "I biglietti col 14? …Sì. Me li dava Nina. Io li mettevo nell'armadietto. Non c'è scritto da nessuna parte che non si può. L'ho controllato. Più o meno."]]);
      return say([["dt_pio", X.pick(["Entrare dentro? Quando vuoi, {num}: il tuo tesserino funziona sempre. Solo… ricordati di lasciare un biglietto, prima. Lì dentro non ricordi niente.", "Io sto sulla soglia. Vedo entrare il te di fuori e uscire il te di dentro. Si somigliano. Non del tutto.", "Il Cartografo? Mai visto. Cioè: lo vedo tutte le sere che ruba la corrente col cavo verde. Ma non l'ho mai visto."])]]);
    }
    function cartografo() {
      const s = S();
      if (s === 1) return say([
        ["voce", "Sotto il telone della giostra, tra i cavalli fermi, un ragazzo col cappuccio e gli occhiali scuri batte su tre tastiere insieme. Non si volta."],
        ["dt_cartografo", "Il 14. Lo sapevo che saresti venuto. Le mappe non mentono: ogni sera prendi la stessa strada, e ogni sera ti fermi davanti al recinto dello stadio per tre secondi esatti. Poi vai al bar."],
        ["dt_cartografo", "Ho mappato il Complesso dall'esterno. Tubi, cavi, muri. E sotto il Campo Bianco c'è una stanza che non esiste in nessuna pianta. Dentro c'è un registratore. Lo chiamano… la Sala della Voce."],
        ["dt_cartografo", "Ma la mappa non te la regalo. Prima batti i Gabbiani del Molo, nella gabbia. Scheggia vuole vedere se sei ancora il 14, o solo un manichino del Valtorre."],
      ], () => { learnFact("f_cartografo"); setStep(N, 2); done(); });
      if (s === 2) return say([["dt_cartografo", "Scheggia è nella gabbia. A piedi nudi. Come sempre."]]);
      if (s === 3) return say([
        ["dt_cartografo", "Una cosa ancora, sulla mappa. La porta numero 8 del loro reparto: tastiera a quattro cifre. Il tasto 1 e il tasto 4 sono consumati. Te l'ha detto il te di dentro, no?"],
        ["dt_cartografo", "Il codice l'hanno scelto loro, per prenderti in giro. Pensaci: 1, 4. Due volte. Tu lo sai, che numero è. Il te di dentro, no."],
        ["dt_cartografo", "Scriviglielo. Armadietto 7, all'ingresso del personale. E poi entra."],
      ], done);
      return say([["dt_cartografo", X.pick(s >= 8 ? ["Domani accendo i fari del vecchio stadio. Per la finale. Non chiedermi come: rubo bene.", "Ho giocato una partita sola nel Porto Livido. In porta. Abbiamo perso 0-1. L'unica cosa che ricordo è il tuo rigore che non è partito."] : ["Le mappe non mentono. Le persone sì. È per questo che faccio mappe.", "Sotto il Campo Bianco c'è una stanza. Lì dentro c'è la tua voce. Non chiedermi come lo so.", "Ho un cavo verde che arriva fin dentro il Complesso. Ci passa la corrente. E qualche volta, una parola."])]]);
    }
    function scheggia() {
      const s = S();
      if (s < 2) return say([["dt_scheggia", "Chi si rivede. Il 14 col sorriso del Valtorre. Torna quando hai voglia di sporcarti i piedi."]]);
      if (s === 2) return say([
        ["dt_scheggia", "Eccolo. Il traditore. Il 14 che è andato a giocare per quelli che ci hanno chiuso lo stadio."],
        ["dt_scheggia", "Qui nella gabbia si gioca senza arbitro, sul cemento bagnato. Se vinci, ti credo quando dici che sei ancora dei nostri. Se perdi, torna a sorridere per loro."],
      ], () => ask("dt_scheggia", "«Allora? Ti togli le scarpe aziendali?»", [
        { label: "🥅 La Gabbia del Molo", sub: "3 contro 3 a rimbalzo · con Nina e il Cartografo", cls: "hot", fn: playGabbia },
        { label: "Non ancora", sub: "Torna a esplorare", fn: done },
      ]));
      return say([["dt_scheggia", X.pick(["Va bene, sei ancora il 14. Più o meno. Diciamo un 13 e mezzo.", "Domani la finale. Noi siamo il Porto Livido. Tu? Tu chi sei, domani?"])]]);
    }
    function playGabbia() {
      X.playMatch({
        id: "dt_gabbia", alt: "cage", mate: "Nina Rocca", squad: ["Il Cartografo"], us: "Il 14 e i suoi", homeKit: ["#7a3b2e", "#ffcf7a"], cageField: 2, cageMut: "wet", cageTarget: 5,
        chap: "Doppio Turno · La Gabbia del Molo", bg: "dt_giostre", intro: "Nella gabbia del luna park, sul cemento bagnato: {n}, Nina e il Cartografo contro i Gabbiani del Molo.",
        oppNames: ["Gancio", "Rete", "Lampo", "Sardina", "Scheggia"],
        team: (t, s) => ({ name: "Gabbiani del Molo", vs: "i Gabbiani del Molo", color: "#22345a", atk: t(s.tiro * 0.95), def: t(s.drib * 0.92), vel: t(s.tiro * 0.95) }),
        done: (r) => {
          if (r.win) { setStep(N, 3); learnFact("f_mappa"); reward("dt_c2_gabbia", { coins: 30 }); return say([["voce", `Finisce ${r.a} a ${r.b}. Scheggia si siede sul cemento bagnato e ride, a piedi nudi.`], ["dt_scheggia", "Va bene, 14. Sei ancora dei nostri. Più o meno."], ["dt_cartografo", "La mappa è tua. Sotto il Campo Bianco, la Sala della Voce. E adesso parliamo della porta numero 8."]]); }
          say([["voce", `Finisce ${r.a} a ${r.b}.`], ["dt_scheggia", "Sorridi per loro, allora. O riprova: la gabbia è sempre aperta."]]);
        },
      });
    }
    // ---- Dentro
    function valtorre() { say([["dt_valtorre", "Buongiorno, {n}. Vedo che hai ricevuto posta, stamattina. L'armadietto 7 è molto… frequentato. Ricorda la regola due: non si chiede del Fuori. Ma nessuna regola vieta al Fuori di scriverti. Per ora."]]); }
    function bruno() {
      const s = S();
      if (zone() === "dt_campo" || s >= 4) return ask("dt_bruno", s >= 5 ? "«Il Torneo dei Reparti! Contro le Risorse Umane! Giochi con me? È facoltativo. Cioè, è consigliato.»" : "«Ciao! Oggi c'è il Torneo dei Reparti al Campo Bianco. Vuoi giocare? Le Risorse Umane barano: sorridono troppo.»", [
        { label: "⚽ Torneo dei Reparti", sub: "Partita secondaria: scegli tu come giocarla", cls: "hot", fn: playTorneo },
        { label: "Due chiacchiere", sub: "Bruno e il Dentro", fn: () => say([["dt_bruno", X.pick(["Sai che non ho niente da dimenticare? Ho firmato la Procedura così, per stare in squadra. Fuori faccio il cassiere. Dentro sono felice. Fuori… non lo so, non me lo ricordo.", "Ofelia è sparita da stamattina. Ha lasciato la sua sedia girata verso la porta 8. Strano, eh?", "La Voce oggi mi ha detto «bravo» tre volte. A te quante?"])]]) },
      ]);
      return say([["dt_bruno", "Buongiorno! Sorrisi di ieri: 1.205. Grazie a te! Oggi puntiamo a 1.206."]]);
    }
    function playTorneo() {
      X.playMatch({
        id: "dt_torneo", alt: "az,hd,cage", force: false, mate: "Bruno Tessari", squad: ["Ofelia Sanz", "Guardiano Pio"], us: "Reparto Morale", homeKit: ["#2a9d8f", "#eef2f1"], azPitch: "bianco", cageField: 0,
        chap: "Doppio Turno · Torneo dei Reparti", bg: "dt_campo", intro: "Torneo dei Reparti al Campo Bianco: il Reparto Morale di {n} e Bruno contro le Risorse Umane.",
        oppNames: ["Selezione", "Colloquio", "Benefit", "Welfare", "Capo del Personale"],
        venue: { ads: [["VALTORRE FC", "#2a9d8f"], ["SORRIDI", "#2b3a3a"], ["PROCEDURA DUALE", "#2a9d8f"], ["IL DENTRO È PIÙ BELLO", "#5a6560"]], crowd: ["#9aa5b1", "#dfe6e4", "#2a9d8f", "#cfd6c8", "#9aa5b1"], ground: ["#d9efe6", "#cfe8de"], line: "#2a9d8fcc", grid: "rgba(42,157,143,.08)", tint: "rgba(220,255,248,.10)", glow: "200,255,240" },
        team: (t, s) => ({ name: "Risorse Umane", vs: "le Risorse Umane", color: "#e07a3a", atk: t(s.tiro * 0.85), def: t(s.drib * 0.85), vel: t(s.tiro * 0.85) }),
        done: (r) => { if (r.win) reward("dt_c2_torneo", { coins: 20 }); say([["voce", `Torneo dei Reparti: ${r.a} a ${r.b}.`], ["dt_bruno", r.win ? "Abbiamo vinto! Sorrisi di oggi: 1.300! Record!" : "Abbiamo perso. Ma sorridendo. Conta lo stesso, vero? Vero?"]]); },
      });
    }
    function ofelia() {
      const s = S();
      if (zone() === "dt_archivio") {
        if (s === 5 && !F.is("c2_ofelia_arch")) return say([
          ["dt_ofelia", "Sapevo che avresti trovato il codice. 1-4-1-4. Che fantasia, eh? Hanno usato il tuo vecchio numero per chiuderti fuori dai tuoi ricordi."],
          ["dt_ofelia", "Io sono qui da stanotte. Ho ritirato il mio contratto, sai? Non sono più nella Procedura. Fuori e dentro sono la stessa Ofelia. È faticoso. È bellissimo."],
          ["dt_ofelia", "Il terminale ha il registro dell'Armadietto 7. E là, il registratore a bobine. Quello che c'è sulla bobina… ascoltalo tu. Io l'ho fatto, e non ho dormito."],
        ], () => { F.set("c2_ofelia_arch", true); done(); });
        if (s === 6 || s === 7) return say([["dt_ofelia", "Torna fuori, {n}. Chiedi conto a chi firmava 14. E poi preparati: la finale di domani non è una partita qualsiasi. Per la Voce, sei tu la partita."]]);
        return say([["dt_ofelia", "Leggi il registro. Ascolta la bobina. Poi decidiamo."]]);
      }
      if (s === 4) return say([["dt_ofelia", knows("f_quattordici") ? "Hai il codice, vero? Te lo leggo in faccia. La porta 8 è in alto, nel corridoio. Ci vediamo dall'altra parte." : "Ti ha scritto, il Fuori? Leggi bene. E controlla la firma."]]);
      return say([["dt_ofelia", "Conto le porte. Ancora otto. Bene."]]);
    }

    // ---------------------------------------------------------------- oggetti
    function lockerHere(back) { X.locker(back || done); }
    const obj = {
      "dt_porto:>": () => (S() >= 1 ? go("dt_giostre", 2, 11) : say([["voce", "Il vicolo che porta al luna park. Prima, forse, Nina ha qualcosa da dirti."]])),
      "dt_giostre:<": () => go("dt_porto", 38, 10),
      "dt_porto:K": () => { if (S() >= 3) X.plant("n_ufficio2"); lockerHere(); },
      "dt_porto:e": () => {
        if (S() < 3) return say([["dt_pio", "Il turno di domani comincia alle otto, {num}. Adesso vai a goderti la sera."]]);
        const m = X.mem(), sent = (m.notes.w_f_quattordici && m.notes.w_f_quattordici.st === "new") || knows("f_quattordici", "d");
        if (S() === 3 && !sent) return say([["dt_pio", "Entri? Aspetta, {num}: hai lasciato qualcosa all'altro te? Lì dentro non ti ricorderai niente. Neanche di quel numero che hai in testa stasera."]]);
        say([["voce", "Passi il tesserino. Pio ti fa l'occhiolino. L'ascensore sale. Il formicolio dietro gli occhi, il bianco…"]], () => { if (S() === 3) setStep(N, 4); go("dt_atrio", 14, 3); });
      },
      "dt_atrio:e": () => {
        if (S() < 4) return say([["voce", "L'ascensore: «FINE TURNO — PROCEDURA DUALE IN CORSO»."]], () => go("dt_porto", 8, 18));
        say([["voce", "Prendi l'ascensore. «FINE TURNO». Il formicolio, il bianco, e poi il rumore del mare."]], () => go("dt_porto", 8, 18));
      },
      "dt_atrio:K": () => { if (S() >= 4) X.plant("n_nina14"); lockerHere(); },
      "dt_uffici:Q": () => {
        if (!knows("f_quattordici")) return say([["voce", "La tastiera della porta 8: quattro cifre. Provi 1-2-3-4. Errore. 0-0-0-0. Errore. Il tasto 1 e il tasto 4 sono consumati. Ma che numero vorrebbero dire? Il Dentro non lo sa."]]);
        ask("voce", "La tastiera della porta 8. Quattro cifre. Ti viene in mente il biglietto del Fuori: «Al Porto Livido portavi il 14».", [
          { label: "1 4 1 4", sub: "Il 14, due volte", cls: "hot", fn: () => { X.SFX.ding(); if (S() === 4) setStep(N, 5); learnFact("d_archivio", "d", true); say([["voce", "Bip. Bip. Bip. Bip. La serratura scatta. La porta numero 8, che non esiste, si apre."]], () => go("dt_archivio", 14, 17)); } },
          { label: "1 4 4 1", sub: "", fn: () => say([["voce", "Errore. Il tastierino lampeggia di rosso, come una guancia."]]) },
          { label: "4 1 1 4", sub: "", fn: () => say([["voce", "Errore. Da qualche parte, un altoparlante tossisce."]]) },
          { label: "Lascia stare", sub: "", fn: done },
        ]);
      },
      "dt_campo:>": () => go("dt_atrio", 1, 9),
      "dt_archivio:v": () => go("dt_uffici", 16, 1),
      "dt_archivio:d": () => say([["voce", "Il terminale mostra il registro dell'Armadietto 7. Righe e righe. «#031 · penna blu · inserito da: UFFICIO». «#032 · pennarello verde · inserito da: titolare (Fuori)». «#033 · pennarello verde, firma 14 · consegnato a mano da: donna, capelli rossi, tramite guardiano P.»"], ["voce", "Altre righe in penna blu, tutte dall'«UFFICIO». Il Complesso scriveva al Fuori fingendosi te."]], () => { learnFact("d_registro"); checkArch(); }),
      "dt_archivio:V": () => say([["voce", "Premi PLAY. Le bobine girano. Fruscio. Poi una voce, calma, con l'accento del porto. La stessa delle cuffie."], ["voce", "«…sono io. Se mi senti, vuol dire che ha funzionato. Ascoltami: quando arriva il momento, non…» Clic. La bobina si interrompe. Qualcuno ha tagliato il nastro."], ["dt_ofelia", "Hai sentito la voce? Ascoltala bene. Non ti ricorda nessuno?"]], () => { learnFact("d_registrazione"); checkArch(); }),
    };
    function checkArch() {
      if (S() === 5 && knows("d_registro") && knows("d_registrazione")) { setStep(N, 6); return say([["dt_ofelia", "Il registro dice che i biglietti col 14 li ha portati una donna coi capelli rossi. E la bobina… la bobina ha la tua voce, {n}. È la tua voce. Torna fuori. Chiedi a lei."]]); }
      done();
    }
    function news(id, s) {
      const z = zone();
      if (id === "dt_nina") return s === 0 || s === 6 || s === 7;
      if (id === "dt_cartografo") return s === 1 || s === 3;
      if (id === "dt_scheggia") return s === 2;
      if (id === "dt_ofelia") return (s === 5 && z === "dt_archivio" && !F.is("c2_ofelia_arch")) || (s === 4 && z === "dt_uffici");
      if (id === "dt_valtorre") return s === 4;
      return false;
    }
    return {
      n: N, title: "Il Fuori", sub: "Il Cartografo, la porta 8, chi scrive i biglietti", start: "dt_porto",
      goal, zones, obj, news, patch,
      talk: { dt_nina: nina, dt_pio: pio, dt_cartografo: cartografo, dt_scheggia: scheggia, dt_valtorre: valtorre, dt_bruno: bruno, dt_ofelia: ofelia },
      intro: () => [
        ["voce", "Sera. Porto Livido. Le lucine si accendono a onde, come ogni sera.", "dt_porto"],
        ["voce", "Il Fuori scende dall'ingresso del personale con la borsa che sa di disinfettante e un biglietto in penna blu in tasca. Sono giorni che le due metà si scrivono.", "dt_porto"],
      ],
    };
  }
  boot();
})();
