// js/dopo-c3.js - DOPO IL CAMPIONE · Capitolo 3 «Il messaggio»
// Valdorsa d'inverno. La stazione e, dentro il bar, la sala giochi (si entra): oggi cabinati spenti e polvere, con gli occhi
// di Ada è di nuovo il 1989 e il Capitano, settantanove anni, gioca a «RONDINE '89». Nel suo cabinato ha nascosto un messaggio:
// si legge solo vincendo la partita a 8 bit (Epoche · 1989). Poi l'ultima partita, oggi, sul vecchio campo: la nuova squadra
// con Ada in porta (Epoche · oggi). Finali: IL VIAGGIO CONTINUA · LA NUOVA SQUADRA · IL TEMPO RIPRENDE · (segreto) L'ULTIMO PASSAGGIO.
(function () {
  "use strict";
  function boot() { const D = window.__dopo; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);

    K.cast("ep_bruno89", { name: "Bruno Arcieri, 1989", tag: "gray", hair: "#f0f0f0", style: "buzz", skin: "#e0b890", eye: "#4a3a2a", glasses: true, bg: ["#1a1a3a", "#7a2a2a"], shirt: "#7a2a2a" },
      "Il Capitano a settantanove anni, con gli occhiali spessi e la sciarpa granata anche d'estate. Tutti i pomeriggi gioca a «RONDINE '89» nel bar della stazione. Ha il record. Nessuno sa perché ci tenga tanto.");
    K.cast("ep_rita", { name: "Rita della stazione", tag: "", hair: "#8a4a6a", style: "bun", skin: "#e8c4a0", eye: "#4a3a5a", bg: ["#1a1a3a", "#e83a8a"], shirt: "#3a3a5a" },
      "Gestisce il bar della stazione di Valdorsa da quando i treni passavano ogni ora. Adesso ne passano tre al giorno. La sala giochi l'ha tenuta aperta per un cliente solo, finché c'è stato.");
    K.cos("ep_c3", { kind: "shirt", label: "Maglia granata di oggi", val: "#8a2a3a", from: "Completa Dopo il Campione" });
    K.cos("ep_ricordo", { kind: "acc", label: "Stemma della scatola di latta", val: "#c9a227", from: "Finale «Il viaggio continua»" });
    K.cos("ep_squadra", { kind: "acc", label: "Fascia della nuova squadra", val: "#7a2a2a", from: "Finale «La nuova squadra»" });
    K.cos("ep_tempo", { kind: "acc", label: "Sciarpa del tempo che riprende", val: "#d8d8e8", from: "Finale «Il tempo riprende»" });
    K.cos("ep_passaggio", { kind: "acc", label: "Aura dell'ultimo passaggio", val: "#e8b86a", from: "Finale segreto «L'ultimo passaggio»" });
    K.cos("ep_neve", { kind: "hairc", label: "Capelli Neve di Valdorsa", val: "#eef2f8", from: "Trova tutte le foglie d'oro alla stazione" });
    K.lore("l_1989", { t: "RONDINE '89", d: "Un cabinato da sala giochi programmato nel 1989 da un ragazzo di Bologna, con l'aiuto di un vecchio calciatore che gli spiegava «come si gioca davvero». Il vecchio calciatore aveva una sola richiesta: un messaggio nascosto, che compare solo a chi vince." });
    K.lore("l_messaggio", { t: "Il messaggio", d: "«Ada. Se stai leggendo, hai vinto. Lo sapevo. Non devi ricordarti di me tutto: ricordati della partita. Le partite sono l'unica cosa che non invecchia. — B.»" });
    K.lore("l_eco7", { t: "Eco · Il record", d: "1989. Il Capitano batte il proprio record a «RONDINE '89» e scrive le iniziali: A, D, A. Il ragazzino accanto a lui chiede: «Chi è Ada?». Lui risponde: «La migliore portiera del mondo. Gioca ancora, sai». Il ragazzino ride." });
    K.lore("l_eco8", { t: "Eco · La finestra", d: "Dalla finestra della sala giochi si vede la fermata della corriera. Il Capitano guarda fuori ogni volta che passa la corriera delle cinque. Ogni volta. Come chi aspetta qualcuno che arriva sempre in ritardo." });
    K.lore("l_eco9", { t: "Eco · Il gettone", d: "Il Capitano mette un gettone in tasca, invece che nel cabinato. «Questo lo tengo per lei. Il giorno che viene, la partita gliela offro io.» Rita annuisce, e gli porta un caffè." });

    const goal = (s) => ({
      0: "Valdorsa d'inverno. Ada è alla stazione, sotto la neve.",
      1: "Entra nel bar della stazione: la sala giochi è dentro. Guarda con gli occhi di Ada e trova i 3 echi.",
      2: "Il cabinato «RONDINE '89» (quello con la striscia rosa, in fondo): inserisci il gettone della scatola di latta.",
      3: "Hai letto il messaggio. L'ultima partita si gioca oggi, sul vecchio campo: Ada ti aspetta lì.",
      4: "Ada ti aspetta sotto la quercia.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const zones = {
      ep_stazione: {
        region: "inverno", name: "Dopo il Campione · La stazione di Valdorsa", short: "La stazione di Valdorsa", sub: "D'inverno, tre treni al giorno", bg: "ep_stazione", time: "tramonto", travel: [20, 4],
        w: 40, h: 24, start: [20, 4], itemCos: "ep_neve", items: [[2, 21], [37, 21], [3, 3], [36, 3]],
        areas: [[12, 8, 27, 14, "Il bar della stazione"], [0, 17, 39, 22, "I binari"], [0, 0, 39, 23, "La stazione"]],
        act: { q: "Entra", n: "Leggi l'orario", b: "Siediti", l: "Guarda il lampione", t: "Guarda l'albero", "^": "Torna in paese", f: "Guarda la staccionata", p: "Guarda la pensilina" },
        flavor: {
          n: ["Orario invernale: tre treni al giorno. Quello delle cinque ha una matita disegnata accanto: «arriva sempre in ritardo, ma arriva».", "«VIETATO ATTRAVERSARE I BINARI». Sotto, una vecchia scritta a gesso quasi cancellata: «RONDINE '89 · RECORD: A.D.A.»"],
          b: "La panchina della stazione, fredda come un gelato. Da qui si vede la fermata della corriera e, se ti giri, la vetrina del bar con i cabinati spenti.",
          l: "Un lampione con un cappello di neve. La luce cade a cerchio, come un riflettore su un palco vuoto.",
          t: "Un abete carico di neve. Ogni tanto un ramo si scrolla, come chi si toglie il cappotto entrando in casa.",
          f: "La staccionata dei binari. Qualcuno ci ha legato, tanto tempo fa, una sciarpa granata. Adesso è quasi rosa, scolorita dal sole di trent'anni.",
          p: "La pensilina della stazione, ghisa e vetro. Sotto, un uomo con il cappotto aspettava sempre la corriera delle cinque. Così dicono.",
        },
        intro: [["voce", "Valdorsa d'inverno. La neve copre il paese come un lenzuolo su un mobile che non si usa. La stazione è in fondo alla valle: tre treni al giorno, un bar, una pensilina di ghisa."], ["voce", "Ada è sotto la pensilina, con un gettone da sala giochi in mano. Lo gira tra le dita come una moneta portafortuna."]],
        npcs: (s) => [...(s <= 1 ? [{ id: "ep_ada", at: [21, 15] }] : []), { id: "ep_nino", at: [8, 15] }, { id: "ep_lia", at: [31, 15] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 0, "t"); lay(0, 0, 0, 23, "t"); lay(39, 0, 39, 23, "t"); lay(0, 23, 39, 23, "t"); put(19, 0, "^"); put(20, 0, "^");
          lay(19, 1, 20, 7, ":"); lay(1, 15, 38, 16, "+"); lay(0, 18, 39, 18, "f"); lay(0, 19, 39, 22, ",");
          house(12, 8, 16, 7, { door: [20, 14], roof: "#6a4a3a", wall: "#d8c8a8", rr: 3, lit: true, enter: { to: "ep_sala", at: [10, 10] } });
          lay(20, 15, 20, 15, "+"); [[6, 14], [14, 16], [26, 16], [34, 14]].forEach(([x, y]) => put(x, y, "p"));
          [[10, 16], [30, 16]].forEach(([x, y]) => put(x, y, "l")); put(17, 16, "b"); put(23, 16, "b"); put(4, 16, "n"); put(36, 16, "n");
          [[3, 6], [8, 3], [32, 4], [36, 9], [5, 11]].forEach(([x, y]) => put(x, y, "t")); put(28, 6, "s");
        },
        decor(g, cx, cy, d) { // l'insegna del bar e, sui binari, i lampioni nella neve
          const x = d.X(20) + 8, y = d.Y(8) - 4; R(g, x - 36, y - 9, 72, 12, "rgba(20,16,40,.88)"); g.font = "bold 7px Georgia, serif"; g.fillStyle = (Math.floor(d.fr / 40) % 5) ? "#e83a8a" : "#5a3a5a"; g.textAlign = "center"; g.fillText("BAR · SALA GIOCHI", x, y); g.textAlign = "left";
        },
      },
      ep_sala: {
        interior: true, region: "sala", name: "Dopo il Campione · La sala giochi", short: "La sala giochi del bar", sub: "Cabinati e polvere", bg: "ep_1989", w: 20, h: 13, start: [10, 10], outside: ["ep_stazione", 20, 15],
        act: { A: "Guarda il cabinato", T: "Guarda il bancone", v: "Esci", z: "Guarda le casse", W: "Guarda dalla finestra" },
        intro: [["voce", "La sala giochi dietro il bar: sei cabinati spenti, con la polvere sugli schermi come neve sulle macchine. In fondo, il più vecchio: «RONDINE '89», con una striscia rosa sopra."]],
        npcs: (s) => [{ id: "ep_rita", at: [4, 6] }, ...(s >= 1 && s <= 2 ? [{ id: "ep_ada", at: [14, 8] }] : [])],
        build(L) {
          const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v");
          [6, 8, 10, 12, 14].forEach((x) => put(x, 2, "A")); put(3, 1, "W"); put(16, 1, "W"); lay(2, 5, 6, 5, "T"); put(17, 9, "z"); put(2, 10, "z");
          put(8, 8, "e"); put(16, 5, "e"); put(4, 9, "e");
        },
        eras: {
          1989: { label: "La sala giochi · 1989", region: "sala", filter: "pixel", time: "giorno",
            npcs: () => [{ id: "ep_bruno89", at: [10, 4] }, { id: "ep_rita", at: [4, 6] }, { id: "ep_ada", at: [14, 8] }],
            build(L) { zones.ep_sala.build(L); } },
        },
      },
    };
    function arcade() {
      K.ownMatch(window.__epoche.start, {
        era: "1989", title: "RONDINE '89 · INSERT COIN", us: "1UP", opp: { name: "CPU", kit: "#3a6ae8", names: ["CPU-1", "CPU-2"] }, half: 25,
        mate: { name: "BRUNO", skin: "#e0b890", hair: "#f0f0f0", shirt: "#7a2a2a" }, shirt: "#e83a8a", bg: "ep_1989",
        halftime: "HALF TIME · Sullo schermo, una scritta lampeggia per un secondo: «A.D.A. NON MOLLARE». Poi sparisce.",
        introExtra: "<p>Il gettone di Bruno entra nel cabinato con un clic. Lo schermo si accende: «PRESS START». Vinci, e il cabinato ti mostrerà quello che il Capitano ha nascosto.</p>",
        done: (r) => {
          if (!r.win) return K.scene([["voce", "GAME OVER. Lo schermo lampeggia: «INSERT COIN». Rita ti mette un altro gettone sul bancone, senza dire niente. «Lui ne perdeva tre al giorno. Poi vinceva»."]], () => K.enterZone("ep_sala"), "ep_1989");
          K.learnLore("l_messaggio"); setStep(N, 3); questDone("ep_rondine"); bond("ada", 2);
          K.scene([
            ["voce", "YOU WIN! Lo schermo si spegne. Poi si riaccende, lentamente, riga per riga, come un ricordo che si sveglia. Lettere bianche, a 8 bit, su fondo blu:"],
            ["voce", "«ADA.<br>SE STAI LEGGENDO, HAI VINTO. LO SAPEVO.<br>NON DEVI RICORDARTI DI ME TUTTO:<br>RICORDATI DELLA PARTITA.<br>LE PARTITE SONO L'UNICA COSA<br>CHE NON INVECCHIA.<br>— B.»"],
            ["ep_ada", "(Ada resta ferma davanti allo schermo. Poi ride, piano, con le lacrime.) Trent'anni. Ha aspettato trent'anni che venissi a giocare. E io pensavo che giocasse per ammazzare il tempo."],
            ["ep_ada", "Ricordati della partita. Va bene, Bruno. Allora giochiamola. Oggi. Sul campo di terra, con i ragazzi. L'ultima. O la prima."],
          ], () => K.enterZone("ep_sala"), "ep_1989");
        },
      });
    }
    function finale() {
      setStep(N, 4);
      K.ownMatch(window.__epoche.start, {
        era: "oggi", title: "Epoche · Oggi: Valdorsa–Fornaci", us: "Valdorsa", opp: { name: "Fornaci", kit: "#5a5a62", names: ["Gelindo jr.", "Mattoni"] }, half: 35, ada: true,
        mate: { name: "Nino", skin: "#f0d0b0", hair: "#e8a040", shirt: "#7a2a2a" }, shirt: "#8a2a3a", bg: "ep_campo",
        halftime: "Intervallo. Lia, in panchina, guarda Ada parare. Ada le fa un cenno: secondo tempo, in porta ci vai tu. Lia diventa rossa come la maglia.",
        introExtra: "<p>Valdorsa contro le Fornaci, come nel 1928. Sul vecchio campo di terra, con la neve ai bordi. Ada in porta. Per l'ultima volta? Lo deciderà lei.</p>",
        done: (r) => { F.set("ep_finale", r.win ? "vinta" : "persa"); bond("squadra", 2); K.scene([["voce", r.win ? "Valdorsa batte le Fornaci, cent'anni dopo. Nino corre sotto la quercia urlando. Lia, entrata nel secondo tempo, ha parato un rigore. Ada la abbraccia, e per la prima volta da ottant'anni non lascia spazio." : "Le Fornaci vincono, cent'anni dopo, come nel 1928. Nessuno è triste. Nino dice che è tradizione. Lia ha parato un rigore. Ada la abbraccia."], ["voce", "Poi Ada va sotto la quercia, da sola, e appoggia la mano sull'incisione. Ti aspetta."]], () => K.enterZone("ep_campo"), "ep_campo"); },
      });
    }
    function endingAsk() {
      const ech = K.F.get("echi", 0), opts = [{ label: "«Continua il tuo viaggio, Ada. Portalo con te»", sub: "Ripartire, con i ricordi in tasca", big: true, fn: () => ending("ricordo") }];
      if (st("squadra") >= 6) opts.push({ label: "«Resta. Nino e Lia hanno bisogno di te»", sub: "La nuova squadra", big: true, fn: () => ending("squadra") });
      if (st("ada") >= 6) opts.push({ label: "«E se lasciassi che il tempo ti raggiunga?»", sub: "Il tempo riprende", big: true, fn: () => ending("addio") });
      if (ech >= 9 && st("ada") >= 7) opts.unshift({ label: "Sotto l'incisione, nella corteccia, c'è un'altra riga…", sub: "Segreto: tutti gli echi delle tre epoche e la fiducia piena di Ada", cls: "hot", big: true, fn: () => ending("lettera") });
      ask("ep_ada", "Ho giocato. Ho ricordato. Adesso so chi era: uno che passava la palla per primo, anche quando poteva tirare. Uno che aspettava la corriera delle cinque.\n\nE adesso, capitano? Cosa faccio, io, con tutto questo tempo?", opts, "ep_campo");
    }
    function ending(kind) {
      const R2 = { ricordo: { coins: 120, cos: ["ep_c3", "ep_ricordo"] }, squadra: { coins: 130, cos: ["ep_c3", "ep_squadra"] }, addio: { coins: 130, cos: ["ep_c3", "ep_tempo"] }, lettera: { coins: 200, cos: ["ep_c3", "ep_passaggio"] } }[kind];
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N); setStep(N, 5);
      const lines = {
        ricordo: [["voce", "Ada riparte con la corriera delle cinque. Nella scatola di latta adesso ci sono quattro cose: una foto, un biglietto, un gettone, e una foglia della quercia."], ["ep_ada", "Andrò a vedere tutti i campi dove ha giocato. Anche quelli dove ha perso. Soprattutto quelli."], ["voce", "<b>FINALE · IL VIAGGIO CONTINUA.</b> Ada riparte, con i ricordi del Capitano in tasca."]],
        squadra: [["voce", "Ada resta a Valdorsa. Allena i portieri della nuova squadra tutte le mattine alle sei, con i guanti di lana di Sandro arrivati per posta dalla Riva dei Pini."], ["ep_lia", "Nonna Ada! Cioè… Ada. Scusa. Nino dice che sei nostra nonna. Io no. Io dico che sei il nostro capitano."], ["ep_ada", "(finge di arrabbiarsi, e non ci riesce)"], ["voce", "<b>FINALE · LA NUOVA SQUADRA.</b> Ada resta a Valdorsa con Nino e Lia."]],
        addio: [["ep_ada", "Lasciare che il tempo mi raggiunga. …Sai che non ci avevo mai pensato? Pensavo che fosse lui a non trovarmi. Forse ero io che scappavo. Anche da lui."], ["voce", "Quella sera, sotto la quercia, Ada si guarda le mani alla luce del tramonto. Il giorno dopo, allo specchio, trova un capello grigio. Uno solo. Ride per un minuto intero, come lui."], ["voce", "<b>FINALE · IL TEMPO RIPRENDE.</b> Da domani Ada invecchierà, come tutti. E sorride."]],
        lettera: [["voce", "Sotto l'incisione «per Ada, che para tutto» e «anche me», nella corteccia, c'è una terza riga, così piccola che l'hai vista solo adesso, con la luce bassa dell'inverno:"], ["voce", "«Ti ho sempre passato la palla per prima. Anche quando non serviva.»"], ["ep_ada", "…Lo so. Lo sapevo. Ogni partita, la prima palla era mia. Pensavo fosse tattica."], ["voce", "Ada resta sotto la quercia fino a sera. Poi raccoglie un pallone, lo passa a Lia, per prima. Anche se non serviva."], ["voce", "<b>FINALE SEGRETO · L'ULTIMO PASSAGGIO.</b> Il messaggio del Capitano, nascosto per ottant'anni."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "ep_finale");
    }
    const talk = {
      ep_ada() {
        const s = S(), era = K.api.trZone() === "ep_sala" ? K.eraOf("ep_sala") : null;
        if (era) return say([["ep_ada", "(Nel ricordo, Ada è ferma sulla porta della sala giochi, con il cappotto. Non entra. Guarda il vecchio con gli occhiali spessi che gioca, e sorride.) Ci sono venuta, sai? Una volta. Non sono entrata. Mi è sembrato felice così."]]);
        if (s === 0) return say([
          ["ep_ada", "Il gettone. RONDINE '89. Bruno giocava qui tutti i pomeriggi, nella sala giochi del bar. Settantanove anni e i videogiochi. In paese dicevano che stava perdendo la testa."],
          ["ep_ada", "Io pensavo che ammazzasse il tempo. Il tempo, a me, non serve ammazzarlo. A lui sì. Pensavo."],
          ["ep_ada", "Entriamo? Rita, la barista, c'è ancora. Ha tenuto la sala aperta per lui, finché c'è stato."],
        ], () => { setStep(N, 1); done(); });
        if (s === 1 && K.api.trZone() === "ep_sala") {
          if (K.echoes("ep_sala") >= 3) return say([["ep_ada", "Ho visto. Il record, la finestra, il gettone. Mi aspettava. Il gettone ce l'ho io: inseriscilo tu. Io… non ce la faccio a perdere, oggi."]], () => { setStep(N, 2); quest("ep_rondine", "RONDINE '89", "Inserisci il gettone della scatola di latta nel cabinato «RONDINE '89» e vinci."); done(); });
          return ask("ep_ada", "Polvere, cabinati spenti. Vuoi vederla com'era nel 1989? Io ci sono passata una volta, dalla porta. Non sono entrata.", [
            { label: "«Mostrami il 1989»", sub: "Con gli occhi di Ada: la sala giochi accesa", cls: "hot", fn: () => { K.setEra("ep_sala", "1989"); say([["voce", "I cabinati si accendono uno alla volta, con un ronzio. I colori diventano grossi, quadrati, felici. Musichette a 8 bit da ogni lato. E davanti a «RONDINE '89», un vecchio con gli occhiali spessi e la sciarpa granata."]]); } },
            { label: "Più tardi", fn: done },
          ], "ep_1989");
        }
        if (s === 3) return ask("ep_ada", "Il vecchio campo. Nino ha portato le Fornaci: sono i nipoti dei nipoti di Gelindo. Lia ha già i guanti. Io… sono pronta.\n\nGiochiamo?", [{ label: "Gioca l'ultima partita, oggi", sub: "Epoche · oggi, con Ada in porta", cls: "hot", fn: finale }, { label: "Un momento", fn: done }], "ep_campo");
        if (s === 4) return endingAsk();
        return say([["ep_ada", "Nevica come nel '29. L'anno dopo la prima partita. Bruno costruì una porta di neve e mi fece parare palle di neve per un pomeriggio intero."]]);
      },
      ep_bruno89() {
        if (K.eraOf("ep_sala") !== "1989") return done();
        return say([["ep_bruno89", "(Il Capitano non si gira. Gioca. Sul suo schermo, un omino granata segna di testa.) Lo vedi? Sempre di testa, a questo gioco. Il ragazzo che l'ha programmato non sapeva niente di calcio. Gli ho spiegato tutto io."], ["ep_bruno89", "Sai cosa gli ho chiesto in cambio? Un messaggio. Uno solo. Che si vede solo se vinci. Per una persona che, prima o poi, verrà a giocare. Arriva sempre in ritardo, ma arriva."]]);
      },
      ep_rita() {
        const s = S();
        if (s < 1) return say([["ep_rita", "Il bar è aperto. La sala giochi pure, anche se nessuno ci gioca più. L'ho tenuta per lui. Adesso la tengo per abitudine."]]);
        if (F.is("ep_rita1")) return say([["ep_rita", s >= 3 ? "Ha letto il messaggio? Lui mi aveva detto: «Rita, se viene una ragazza con i capelli bianchi, non dirle niente. Deve vincere da sola». Ho tenuto il segreto trent'anni. Ho tenuto anche i gettoni." : "Il cabinato in fondo, quello con la striscia rosa. Funziona ancora. Lo pulivo ogni lunedì, come mi aveva chiesto lui."]]);
        F.set("ep_rita1", true); bond("ada", 1);
        return say([["ep_rita", "Ada. Lui diceva che saresti venuta. Diceva: «Arriva sempre in ritardo, ma arriva». Guardava la corriera delle cinque ogni giorno, sai? Per trent'anni."], ["ep_ada", "…La corriera delle cinque. Era quella che prendevo io. Per andare via."]]);
      },
      ep_nino() { if (F.is("ep_nino3")) return say([["ep_nino", "Ho prenotato il vecchio campo per oggi. Cioè, ho tolto la neve dalle porte con una pala. È la stessa cosa."]]); F.set("ep_nino3", true); bond("squadra", 1); return say([["ep_nino", "Capitano! Ho trovato le Fornaci! Cioè, i loro nipoti. Giocano a calcetto in città. Gli ho detto: «Cent'anni fa i vostri bisnonni hanno giocato contro la nostra portiera». Mi hanno chiesto se stavo bene."]]); },
      ep_lia() { if (F.is("ep_lia3")) return say([["ep_lia", "Ho i guanti. Quelli di lana di Sandro. Me li ha mandati per posta, con un biglietto: «Si para con il coraggio. Le mani vengono dopo»."]]); F.set("ep_lia3", true); bond("squadra", 1); return say([["ep_lia", "Capitano. Se oggi Ada para, io guardo. Se Ada mi chiede di entrare… io entro. Volevo solo che lo sapessi. Non dirlo a lei. Cioè, diglielo."]]); },
    };
    const ECHI = {
      "ep_sala:e:8,8": [[["voce", "L'eco fa «bip-bip-bip», un record che si scrive lettera per lettera: A… D… A."], ["voce", "Un bambino, accanto al vecchio: «Chi è Ada?». Il vecchio: «La migliore portiera del mondo. Gioca ancora, sai». Il bambino ride."], ["ep_ada", "Gioco ancora. Sì. Avrei potuto dirglielo io, al bambino."]], "l_eco7"],
      "ep_sala:e:16,5": [[["voce", "L'eco è vetro freddo e un motore di corriera che si ferma, sbuffa, riparte. Ogni giorno alle cinque, un vecchio alza la testa dal cabinato e guarda fuori."], ["ep_ada", "La corriera delle cinque. Scendevo da lì quando tornavo a Valdorsa. Due volte in trent'anni. Lui l'ha aspettata tutti i giorni."]], "l_eco8"],
      "ep_sala:e:4,9": [[["voce", "L'eco è il tintinnio di un gettone che non cade nella fessura, ma in una tasca. «Questo lo tengo per lei. Il giorno che viene, la partita gliela offro io.»"], ["ep_ada", "Il gettone della scatola. Era questo. Me l'ha offerta. Trent'anni fa. E io arrivo adesso."]], "l_eco9"],
    };
    const obj = {
      "ep_sala:e": (o) => { const E = ECHI[`ep_sala:e:${o.tx},${o.ty}`]; if (!E) return done(); if (K.eraOf("ep_sala") !== "1989") return say([["voce", "Qualcosa luccica nella polvere, debole. Un eco. Si sveglia solo nel 1989 di Ada: chiedile di guardare con i suoi occhi."]]); K.echo(o, E[0], E[1]); if (K.echoes("ep_sala") >= 3) setTimeout(() => K.safe(() => { K.setEra("ep_sala", null); say([["voce", "I cabinati si spengono uno alla volta, come candeline. La polvere torna. La sala giochi è di nuovo quella di oggi."], ["ep_ada", "Ha aspettato. Tutti i giorni. Il gettone… ce l'ho io. Inseriscilo tu, nel suo cabinato. Quello con la striscia rosa."]], () => { setStep(N, 2); quest("ep_rondine", "RONDINE '89", "Inserisci il gettone della scatola di latta nel cabinato «RONDINE '89» e vinci."); done(); }); }), 50); },
      "ep_sala:A": (o) => {
        if (o.tx !== 10) return say([["voce", K.eraOf("ep_sala") ? K.pick(["Un cabinato acceso: «POLPO KARATE '88». Il polpo vince sempre. Ha otto mani.", "«CORSA DEI CARRETTI». Il record è di un certo «NINO»: punteggio 3."]) : "Un cabinato spento, coperto di polvere. Sullo schermo, qualcuno ha disegnato un cuore con il dito. Tanto tempo fa."]]);
        if (K.eraOf("ep_sala")) return say([["voce", "Davanti a RONDINE '89 c'è il Capitano, che gioca. Non si gira. Non è il tuo turno: questo è il suo ricordo."]]);
        if (S() < 2) return say([["voce", "«RONDINE '89». Lo schermo è spento. Sulla striscia rosa, a pennarello: «RECORD: A.D.A.». Prima di giocare, Ada vuole vedere la sala com'era."]]);
        if (S() >= 3) return say([["voce", "RONDINE '89. Sullo schermo, adesso, scorre in loop: «LE PARTITE SONO L'UNICA COSA CHE NON INVECCHIA». Rita dice che lo lascerà acceso."]]);
        return ask("voce", "Il cabinato «RONDINE '89». Il gettone della scatola di latta è caldo in mano, come se qualcuno l'avesse tenuto stretto fino a un minuto fa.", [{ label: "Inserisci il gettone", sub: "Epoche · 1989, la sala giochi a 8 bit", cls: "hot", fn: arcade }, { label: "Non ancora", fn: done }], "ep_1989");
      },
      "ep_stazione:^": () => go("ep_valdorsa", 19, 23),
      "ep_valdorsa:v": () => go("ep_stazione", 20, 2),
      "ep_campo:O": () => (S() === 4 ? talk.ep_ada() : say([["voce", "La quercia sotto la neve. L'incisione è coperta di brina: «per Ada, che para tutto»."]])),
    };
    const patch = {
      ep_valdorsa: { build(L) { L.put(19, 25, "v"); L.put(20, 25, "v"); L.lay(19, 24, 20, 24, ":"); }, act: { v: "Scendi alla stazione" } },
      ep_campo: { npcs: (s, list) => (s >= 3 ? [{ id: "ep_ada", at: [6, 13] }, { id: "ep_nino", at: [17, 19] }, { id: "ep_lia", at: [26, 19] }] : list) },
    };
    return { n: N, title: "Il messaggio", sub: "La stazione d'inverno, RONDINE '89, l'ultima partita", goal, start: "ep_stazione", introBg: "ep_stazione", zones, talk, obj, patch,
      intro: () => [["voce", "Dicembre. A Valdorsa nevica da tre giorni. La scatola di latta, adesso, contiene solo il gettone: la foto del '28 Ada l'ha appesa in camera, il biglietto del '74 l'ha regalato a Sandro."], ["voce", "«RONDINE '89», dice Ada. «Il bar della stazione. Lui ci andava tutti i pomeriggi. Io pensavo che stesse diventando vecchio. Lo era. Ma non per quello»."]] };
  }
  boot();
})();
