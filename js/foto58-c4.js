// js/foto58-c4.js - «LA FOTO DEL '58» · Capitolo 4: Il Ritorno
// L'ultimo negativo: la corriera che torna in piazza, di notte. Il cimitero del Borgo e le foto al muro del Bar Sport danno gli ultimi destini.
// Ilario, al tavolino, dice tutto. Una lettera da Rosario mai aperta. E la bacheca della mostra, col posto vuoto al centro: quattro finali, uno segreto.
(function () {
  "use strict";
  function boot() {
    const E = window.__foto58Core;
    if (!E || !E.api || !E.api.addChapter || !window.__f5H || !window.__f5P) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__f5H(K), Z = window.__f5Z, { say, done } = H;
    const N = 4, S = () => K.stepOf(N), D = () => K.deduce;
    H.people();
    K.cos("f5_c4", { kind: "acc", label: "Medaglietta della Madonnina del Passo", val: "medaglia", from: "Capitolo 4 di La Foto del '58" });
    K.lore("l_f5_ritorno", { t: "Il ritorno", d: "La corriera tornò in piazza alle undici di sera del 14 aprile 1958, un giorno dopo il previsto, con tredici uomini e l'autista. Il commendator Bassi, presidente, fece graffiare un volto dalla foto ufficiale prima ancora che fosse appesa." });
    K.lore("l_f5_rosario", { t: "Rosario, Argentina", d: "Città sul fiume Paraná. Dal 1959 ci visse un uomo che si faceva chiamare Lorenzo Maffi: lavorava in una fornace e la domenica allenava i ragazzini di un barrio. Ogni tanto, dicono, giocava a carte con un portiere col polso storto venuto da Buenos Aires." });
    const goal = (s) => ({
      0: "All'Archivio, Viola ha l'ultimo negativo della busta: il ritorno.",
      1: `Apri il ritorno dal mirino: la piazza, di notte, nel '58. Ascolta (${H.heard("f5_ritorno")}/12 almeno). Poi torna da Viola.`,
      2: `Gli ultimi destini: il cimitero (in fondo alla piazza, verso est) ${F.is("f5_cim_ok") ? "✔" : "…"} e le foto al muro del Bar Sport ${F.is("f5_bar_foto") ? "✔" : "…"}. Poi Ilario, al tavolino.`,
      3: "La lettera da Rosario: aprila all'Archivio, con Viola, sul tavolo della foto.",
      4: `La bacheca della mostra, all'Archivio: decidi cosa fare della foto. 📓 ${H.conf()}/15 · 🎞️ ${H.frames()}/8.`,
      5: "La saga è conclusa. Dal menu puoi rigiocare il capitolo per gli altri finali."
    }[s] || "Il capitolo 4 è concluso.");

    // ------------------------------------------------------------------------------------------------ i finali
    const ENDS = {
      bacheca: { coins: 260, need: () => H.conf() >= 12 && F.is("f5_ilario_si"), why: "Servono 12 volti confermati e Ilario disposto a parlare", lines: () => [
        ["voce", "Il sabato dopo, all'Archivio, c'è mezzo Borgo. La foto è in bacheca, al centro, e sotto, a matita sul cartoncino, ci sono i nomi. Tutti. E sotto ogni nome, una riga."],
        ["f5_ilario", "[serio] Laurenti Amedeo, maestro. Abate Carmine, allenatore. Danzi Rocco, Belgio. Ferri Guido, Argentina. Mancuso Ottavio… Ottavio teneva su il mondo. Lo teneva su per me."],
        ["voce", "Al nove si ferma. Il Borgo trattiene il fiato, come la piazza nel negativo."],
        ["f5_ilario", "[triste] Maffei Renzo. Il Nove. Non ha fatto niente. Niente. La busta l'avevo presa io. Lui se l'è presa dalle mie mani, e con la busta si è preso anche me. Settant'anni. Scusatemi. Scusami, Renzo."],
        ["f5_mauro", "[serio] …Il caffè, Ilario. Il 13 aprile. Lo offro io, quest'anno."],
        ["f5_viola", "[felice] Nonno Libero, il ciuffo. Si vede che ride anche lui, se guardi bene. Si vede adesso."]] },
      lettera: { coins: 220, need: () => F.is("f5_c3_verita"), why: "Serve aver detto a Mauro tutta la verità, in galleria", lines: () => [
        ["voce", "Non va in bacheca e non torna nella scatola. Scrivi tu. A mano, su carta dell'Archivio, con la matita di Viola: una lettera alla Rina, una a Mauro, una ai nipoti di Guido in Argentina, una a Rosario, a un indirizzo che forse non esiste più."],
        ["voce", "Mauro la legge sulla corriera, fermo davanti alla galleria, col motore acceso e le quattro frecce. Poi riparte. Piano. Non per le buche."],
        ["f5_rina", "[pensa] Bepi lo sapeva, secondo me. Fischiava sempre quella canzone. Era la canzone che cantava il Nove in corriera. Adesso lo so anch'io."],
        ["f5_ilario", "[serio] Nessun processo. Grazie. Le cose vere, scritte a mano, pesano il giusto. Né di più né di meno."]] },
      scatola: { coins: 200, need: () => true, why: "", lines: () => [
        ["voce", "Rimetti la foto nella scatola di latta, la busta sotto il fondo di cartone, la scatola nel faldone «Varie (non buttare)». Viola non dice niente. Poi dice: «Va bene così. Le scatole servono a questo»."],
        ["voce", "Ilario muore in primavera, il 13 aprile, mentre fa il solitario. Nello dice che stava vincendo. Al funerale ci sei tu, Viola, la Rina, Mauro. Mauro ha portato il caffè in un thermos."],
        ["f5_mauro", "[triste] Mi offriva il caffè ogni anno. Adesso lo porto io. Così il conto resta aperto."],
        ["voce", "Nessun altro, al Borgo, sa perché piangi. Va bene così. Forse."]] },
      volto: { coins: 400, need: () => H.frames() >= 8 && H.conf() >= 14 && F.is("f5_lettera_letta"), why: "Segreto", lines: () => [
        ["voce", "Metti in fila gli otto fotogrammi sul tavolo, sotto la lampada verde. La corriera, la curva, la neve, la busta, la galleria, le orme, la piazza, il cimitero. E l'ottavo, quello trovato in fondo alle orme, col timbro straniero sul bordo."],
        ["voce", "Non viene dal '58. Viene da Rosario, Argentina, 1961: due uomini a un tavolino di un bar sul fiume. Uno ha il braccio storto e un berretto. L'altro ha il sorriso storto e una maglia granata scolorita."],
        ["voce", "Sul retro, a matita, la stessa matita del retro della foto: <em>«Non era colpa tua. Gioca, ragazzino. R.»</em>"],
        ["f5_viola", "[sorpreso] È lui. È il Nove. E l'altro… è Guido Ferri. Il portiere. Si sono ritrovati. Settemila miglia e si sono ritrovati a giocare a carte."],
        ["voce", "Viola prende la foto del '58. Con la matita morbida numero due, sul graffio bianco, disegna piano un viso: il sorriso storto, gli occhi di uno che ha appena deciso. Non è perfetto. È giusto."],
        ["f5_ilario", "[triste] …Renzo. Ciao, Renzo. Hai visto? Ho parato. Alla fine ho parato."]] }
    };
    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 5); F.set("f5_c4_done", true); F.set("f5_fine_" + id, true);
      if (id === "volto") { F.set("f5_volto", true); window.__f5Names && window.__f5Names(K); }
      K.reward("f5_c4" + id, { coins: E2.coins, cos: "f5_c4" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines()).concat([
        ["voce", `<b>FINE DI LA FOTO DEL '58.</b><br>${H.stato()}`],
        ["voce", "Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «Camera Oscura». E all'Archivio del Borgo, da oggi, il caffè è gratis per chi porta una foto vecchia."]
      ]), () => K.openMain(), id === "volto" ? "f5_volto" : id === "lettera" ? "f5_lettera" : id === "scatola" ? "f5_scatola" : "f5_bacheca");
    }
    function bacheca() {
      const opts = ["bacheca", "lettera", "scatola", "volto"].map((id) => {
        const E2 = ENDS[id], ok = E2.need(), t = K.ENDINGS && K.ENDINGS[id] ? K.ENDINGS[id][0] : id;
        if (id === "volto" && !ok) return null;
        return { label: (id === "bacheca" ? "🖼️ " : id === "lettera" ? "✉️ " : id === "scatola" ? "📦 " : "✨ ") + t, sub: ok ? (K.ENDINGS && K.ENDINGS[id] ? K.ENDINGS[id][2] : "") : "🔒 " + E2.why, disabled: !ok, fn: () => (ok ? ending(id) : K.done()) };
      }).filter(Boolean);
      say("voce", "La bacheca della mostra «Un secolo di Rondine». Al centro, il posto vuoto col cartellino «1958». Viola ti passa la foto e la scatola di latta, e non dice niente: è una che conserva, non decide.");
      return H.ask("Cosa fai della foto del '58?", opts.concat([{ label: "◂ Non ancora", sub: "Il Taccuino si può ancora completare", fn: () => K.done() }]));
    }

    const lastLeads = () => { if (S() === 2 && F.is("f5_cim_ok") && F.is("f5_bar_foto") && !F.is("f5_c4_leads")) { F.set("f5_c4_leads", true); say("voce", "<b>Ora sai abbastanza.</b> Al tavolino vicino alla finestra, Ilario ha smesso di fare il solitario. Ti aspetta."); } };
    const after = (zid) => { if (S() === 1 && zid === "f5_ritorno" && H.heard(zid) === 12) say("voce", "<b>Dodici voci.</b> Il ritorno è tutto qui: chi abbraccia, chi conta, chi graffia. Torna da Viola."); };

    const talk = Object.assign(window.__f5FT(K, H, {}, after), {
      f5_viola() {
        const s = S();
        if (s === 0) {
          say("f5_viola", "[serio] L'ultimo. Etichetta: «Ritorno, notte». Dopo questo il rullino è vuoto, e io non ho più scuse per non finire la mostra.");
          return H.develop({ id: "ritorno", title: "Il negativo del ritorno", ids: ["f5_bepi", "f5_tonino", "f5_gigi", "f5_libero", "f5_dario", "f5_sante", "f5_guido", "f5_rocco"], seed: 1404, diff: 2,
            intro: "Il negativo del ritorno, di notte: otto facce sotto i lampioni. Dì chi è chi prima che la carta si annerisca." }, (r) => {
            say("f5_viola", r && r.viola ? "[pensa] Fatto. Di notte, i negativi vengono più neri. Come le cose." : "[serio] La piazza. Di notte. Le madri sui gradini.");
            say("voce", "Nel mirino, adesso, c'è anche <b>il ritorno</b>.");
            setStep(N, 1); quest("f5_c4a", "Il ritorno", "Apri il ritorno dal mirino: la piazza, di notte, nel '58.");
            done();
          });
        }
        if (s === 1) {
          if (H.heard("f5_ritorno") < 12) { say("f5_viola", `[serio] Il ritorno: ${H.heard("f5_ritorno")} voci su dodici. Il presidente con il temperino, l'hai visto? Torna dentro.`); return done(); }
          say("f5_viola", "[arrabbiato] «Il nove non è mai esistito.» Il commendator Bassi. Il padrone della fornace. Ha graffiato la foto lui. E Ilario, sulla porta della corriera: «Sono stato io, e nessuno lo saprà mai».");
          say("f5_viola", "[pensa] Mancano gli ultimi destini. Il cimitero, in fondo alla piazza, verso est: lì ci sono quasi tutti. E Nello ha delle foto al muro, al bar, che nessuno guarda più.");
          setStep(N, 2); K.questDone("f5_c4a"); quest("f5_c4b", "Gli ultimi destini", "Il cimitero in fondo alla piazza e le foto al muro del Bar Sport. Poi Ilario.");
          return done();
        }
        if (s === 2) { say("f5_viola", `[pensa] Cimitero ${F.is("f5_cim_ok") ? "fatto" : "da fare"}, foto del bar ${F.is("f5_bar_foto") ? "fatte" : "da guardare"}. Poi Ilario. Io ti aspetto qui, con la lampada accesa.`); return done(); }
        if (s === 3) {
          if (!K.inv.has("f5_lettera")) { say("f5_viola", "[serio] Ilario ti ha dato qualcosa? No? Torna da lui."); return done(); }
          say("voce", "Viola prende un tagliacarte d'osso. Lo tiene sospeso sulla busta, come la pinzetta sopra la bacinella.");
          say("f5_viola", "[serio] È indirizzata a lui. Non a noi. Però lui te l'ha data. …Apriamola insieme. Così, se è sbagliato, è sbagliato in due.");
          F.set("f5_lettera_letta", true); K.learnLore("l_f5_rosario");
          D() && D().learn("who", "renzo", true); D() && D().see("f5_renzo", true); D() && D().learn("fate", "rosario");
          say("voce", "<em>«Rosario, marzo 1961. Ragazzino, qui mi chiamano Lorenzo Maffi. Lavoro in una fornace, come al Borgo: i mattoni sono uguali dappertutto. La domenica alleno dei ragazzi scalzi che giocano meglio di noi.»</em>");
          say("voce", "<em>«Guido è a Buenos Aires, viene a trovarmi. Il polso gli è rimasto storto, para lo stesso. Giochiamo a carte e bariamo tutti e due.»</em>");
          say("voce", "<em>«La busta l'ho buttata nel fiume. Ottavio non è morto per colpa tua: è morto perché era Ottavio. Non tornerò. Al Borgo un colpevole serviva, e io avevo le spalle larghe. Gioca, ragazzino. R.»</em>");
          say("f5_viola", "[triste] Sessantacinque anni in un cassetto. Chiusa. E dentro c'era scritto «non è colpa tua». Ilario non l'ha mai letta. Aveva paura che ci fosse scritto il contrario.");
          setStep(N, 4); K.questDone("f5_c4c"); quest("f5_c4d", "La bacheca", "All'Archivio, la bacheca della mostra: decidi cosa fare della foto.");
          return done();
        }
        if (s === 4) { say("f5_viola", `[serio] La bacheca è lì. ${H.conf()} volti su quindici. Io conservo. Tu decidi. Quando vuoi.`); return done(); }
        say("f5_viola", ["[felice] La mostra ha avuto quattrocento visitatori. Al Borgo siamo in seicento. Gli altri duecento erano al bar a parlarne.", "[pensa] La Voigtländer la tengo sul cavalletto. Ogni tanto ci guardo dentro. C'è solo l'Archivio, capovolto. Va bene così."][K.hash(Date.now()) % 2]);
        return done();
      },
      f5_ilario() {
        const s = S();
        if (s === 2 && F.is("f5_cim_ok") && F.is("f5_bar_foto")) {
          say("voce", "Ilario ha messo via le carte. Sul tavolo c'è solo il caffè, freddo, e il berretto.");
          say("f5_ilario", "[serio] Siediti. Lo so che hai visto. Si vede da come cammini: cammini come uno che ha visto la galleria.");
          say("f5_ilario", "[triste] Gatti mi trovò nella hall. Guido s'era rotto il polso, toccava a me. Mi disse: «Tu ti tuffi un attimo dopo. Solo un attimo». Mia madre faceva le pulizie in tre case. Io avevo diciannove anni e i calzoni buoni erano gli unici.");
          say("f5_ilario", "[triste] Ho preso la busta. Abbiamo perso tre a zero. E non so, non lo so ancora adesso, se mi sono tuffato un attimo dopo. Settant'anni a chiedermelo. Forse ero solo scarso.");
          say("f5_ilario", "[serio] Poi la galleria. Ottavio sotto la trave. Renzo mi ha strappato la busta di mano: «Adesso è mia». E se n'è andato. Il Borgo ha detto che era lui. E io ho lasciato che lo dicesse.");
          return H.wask("Ilario ti guarda, per la prima volta, dritto. Cosa gli chiedi?", [
            { label: "🔎 «Lo dica lei. Alla mostra.»", sub: "Davanti al Borgo, con il nome del Nove", w: { verita: 2 }, fn: () => {
              const si = K.rel.lv("f5_ilario") >= 2 || K.stat("pieta") >= 3;
              F.set("f5_c4_scelta", "verita");
              if (si) { F.set("f5_ilario_si", true); say("f5_ilario", "[serio] …Davanti a tutti. Alla mia età. Va bene. Va bene, sì. Se non adesso, al funerale lo diresti tu, e lo diresti male."); }
              else { F.set("f5_ilario_no", true); say("f5_ilario", "[arrabbiato] Davanti a tutti? Tu non mi conosci. Vieni qui con una scatola di biscotti e mi chiedi settant'anni. No. Non ce la faccio."); }
              lettera();
            } },
            { label: "🕊️ «Non deve niente a nessuno.»", sub: "Ha pagato abbastanza. Il resto è vostro.", w: { pieta: 2 }, fn: () => {
              F.set("f5_c4_scelta", "pieta"); F.set("f5_ilario_pace", true);
              say("f5_ilario", "[triste] Niente a nessuno. Lo dici tu. Lo dici gentile. …Settant'anni che aspettavo qualcuno che lo dicesse, e adesso che lo dici non ci credo lo stesso.");
              K.rel.add("f5_ilario", 2);
              if (K.rel.lv("f5_ilario") >= 3) { F.set("f5_ilario_si", true); say("f5_ilario", "[pensa] Però. Però alla mostra ci vengo. E se Viola mi passa la matita, il nome del Nove lo scrivo io. Solo quello."); }
              lettera();
            } }
          ]);
        }
        if (s === 2) { say("f5_ilario", "[serio] Il cimitero, prima. E le foto al muro, dietro di te. Poi siediti. Poi."); return done(); }
        say("f5_ilario", ["[pensa] Il fante di spade. Lo tengo da parte, adesso. Non lo gioco più.", "[ride] Nello, un caffè. Anzi due. Uno lo paga lui, l'altro lo pago io. Facciamo pari."][K.hash(Date.now()) % 2]);
        return done();
        function lettera() {
          say("voce", "Ilario tira fuori dal taschino una busta azzurra, con i bordi a righe e i francobolli dell'Argentina. Chiusa. Il timbro dice 1961.");
          say("f5_ilario", "[serio] Arrivò qui al bar. «Ilario Gentile, Bar Sport, Borgo». Il padre di Nello me la diede senza dire niente. Non l'ho mai aperta. Tienila tu. Aprila tu. Io non ho mai avuto il coraggio.");
          K.inv.give("f5_lettera");
          setStep(N, 3); K.questDone("f5_c4b"); quest("f5_c4c", "La lettera da Rosario", "Aprila all'Archivio, con Viola.");
          done();
        }
      },
      f5_nello() { say("f5_nello", ["[pensa] Le foto al muro? Guardale. Mio padre le appendeva e non le toglieva più. Diceva che le facce, al muro, tengono su l'intonaco.", "[serio] Ilario oggi non ha giocato. Neanche una mano. In quarant'anni non era mai successo."][K.hash(Date.now()) % 2]); return done(); },
      f5_rina() { say("f5_rina", ["[pensa] Il cimitero, in fondo alla piazza. Bepi è nella terza fila. Salutalo da parte mia: digli che il sale l'ho messo giusto.", "[triste] Sante Mori. Sua madre gli faceva una sciarpa all'anno. Dalla Svizzera è tornata solo la sciarpa."][K.hash(Date.now()) % 2]); return done(); },
      f5_mauro() { say("f5_mauro", F.is("f5_c3_verita") ? "[serio] Ilario mi ha offerto il caffè, stamattina. Stavolta l'ho guardato in faccia. Lui pure. Non ci siamo detti niente. Era già tanto." : "[pensa] Da eroe. Me lo ripeto in galleria, due volte al giorno. Funziona, quasi sempre."); return done(); }
    });

    // il cimitero: le tombe con la foto ovale
    const TOMBS = {
      "5,6": ["Sante Mori", "1937-1963", "«Morto alla diga di Mattmark, Svizzera. Non aveva paura del buio.» Nella foto ovale ha una sciarpa.", "svizzera"],
      "7,6": ["Ferdinando «Nando» Brizzi", "1911-1994", "«Fotografo. Settecento matrimoni, mille comunioni, una squadra.» Sulla lapide è incisa una macchina a soffietto.", "fotografo"],
      "9,6": ["Giuseppe «Bepi» Cozzolino", "1936-2009", "«Sposo di Rina Abate. Terzino destro, marito sinistro.» Qualcuno ci ha lasciato un fiore di lana granata."],
      "18,8": ["Carmine Abate", "1934-2012", "«Capitano e allenatore della Rondine per trent'anni. Al Passo non si va.»"],
      "20,8": ["Amedeo Laurenti", "1909-1995", "«Maestro. Insegnò a leggere a tre generazioni del Borgo.» Sotto, un paio di occhiali di bronzo."],
      "22,13": ["Libero Sanna", "1938-2019", "«Barbiere. Il pallone non lo voleva più vedere. I capelli sì.»"],
      "11,8": ["Don Dario Coletti", "1937-2005", "«Parroco di San Rocco. Ogni 13 aprile, una messa per uno che non c'è.» Una medaglietta della Madonnina è appesa alla croce."],
      "24,18": ["Ottavio Mancuso", "1936-1958", "«Teneva su il mondo.» La tomba è vuota: la montagna se l'è tenuto. Ci sono sempre fiori freschi. Li porta un autista di corriera."],
      "11,18": ["(senza nome)", "", "Una pietra piccola, senza nome. Sopra, inciso a mano, solo un «9». Qualcuno ci tiene un lumino acceso. Ai piedi, sotto il lumino, c'è un fotogramma."]
    };
    const cimObj = {
      I: (o) => {
        const k = o.tx + "," + o.ty, t = TOMBS[k];
        if (!t) { const nm = ["Famiglia Russo", "Pia Bellotti", "Augusto Ferri", "Famiglia Gentile", "Teresa Danzi", "Elvira Coletti", "Famiglia Bassi"][(o.tx * 7 + o.ty) % 7]; return K.say([["voce", `${nm}. Una foto ovale sbiadita, un lumino, un nome che al Borgo qualcuno ricorda ancora.`]], K.done); }
        const L = [["voce", `<b>${t[0]}</b> ${t[1]}. ${t[2]}`]];
        if (t[3]) { const nw = D() && D().learn("fate", t[3], true); F.set("f5_tomba_" + t[3], true); if (nw) L.push(["voce", `📓 Nuovo destino nel Taccuino: <b>${H.FATES[t[3]]}</b>.`]); }
        if (k === "11,18" && !F.is("f5_frame_cim")) { F.set("f5_frame_cim", true); K.inv.give("f5_frame"); L.push(["voce", "Raccogli il fotogramma: <b>Fotogramma</b> nello zaino. È la piazza del Borgo vista dalla corriera che parte. Nell'angolo, una mano che saluta."]); }
        if (S() === 2 && F.is("f5_tomba_svizzera") && F.is("f5_tomba_fotografo") && !F.is("f5_cim_ok")) { F.set("f5_cim_ok", true); }
        K.say(L, () => { lastLeads(); H.done(); });
      }
    };

    const zones = Object.assign(window.__f5P(K, H, {
      borgo: () => [{ id: "f5_rina", at: [7, 12] }, { id: "f5_mauro", at: [30, 13] }],
      arch: () => [{ id: "f5_viola", at: [7, 6] }],
      bar: () => [{ id: "f5_ilario", at: [13, 2] }, { id: "f5_nello", at: [4, 2] }],
      busOggi: true, borgoItems: [[5, 16], [31, 17], [13, 8]], itemCos: "f5_c4",
      borgoDoors: { "35,12": { to: "f5_cimitero", at: [15, 19] } },
      barObj: {
        "9,0": () => { const nw = D() && D().learn("fate", "carabiniere", true); F.set("f5_bar_foto", true); K.say([["voce", "Le foto al muro del Bar Sport. Squadre, sagre, un matrimonio. E una del 1975: un carabiniere in alta uniforme, il pennacchio, piccolo piccolo, il berretto storto come da bambino. Sotto, a penna: «Nicola Russo, brigadiere. Ha trovato tutti, tranne uno.»"]].concat(nw ? [["voce", "📓 Nuovo destino nel Taccuino: <b>Carabiniere</b>."]] : []), () => { lastLeads(); H.done(); }); },
        "6,0": () => K.say([["voce", "La Rondine del 1931, quella della maglia in bacheca. Baffi, scarpe alte, un cane in prima fila che si crede il portiere."]], K.done)
      },
      archObj: {
        c: () => { if (S() >= 4) return bacheca(); K.say([["voce", "La bacheca della mostra «Un secolo di Rondine». Coppe di latta, una maglia del 1931, la tessera n. 1. Al centro, un posto vuoto col cartellino «1958»."]], K.done); }
      }
    }), {
      f5_ritorno: Z.piazza(H, Z.frozenNpcs("f5_ritorno"), { mode: "notte58", start: [16, 18], items: [[3, 15], [33, 9]], itemCos: "f5_c4", act: { N: "Guarda ai piedi della lapide" },
        loot: { "26,9": { id: "f5_frame", text: "Ai piedi della lapide, sotto una corona di fiori ferma a metà caduta: un fotogramma. Si vede la corriera che entra in piazza coi fari accesi, e dodici facce ai finestrini.", empty: "La corona di fiori, ferma a mezz'aria. Non cade." } },
        intro: [["voce", "La piazza, di notte. I lampioni a gas, le madri sui gradini della chiesa, la corriera verde e crema che entra coi fari accesi. È il 14 aprile 1958, le undici di sera. Tutto è fermo nell'attimo in cui si apre la porta."]] }),
      f5_cimitero: Z.cimitero(H, () => [], { objects: cimObj, items: [[3, 3], [27, 3]], itemCos: "f5_c4" })
    });

    return {
      n: N, title: "Il Ritorno", sub: "Una piazza di notte, un temperino, una lettera chiusa",
      goal, start: "f5_borgo", introBg: "f5_ritorno", zones, talk, obj: {},
      intro: [["voce", "Il quarto giorno, al Borgo, c'è il sole. Viola ti aspetta sulla porta dell'Archivio con due caffè e una faccia da notte in bianco."], ["voce", "«L'ultimo negativo», dice. «Il ritorno. Dopo, il rullino è vuoto. E io devo decidere cosa mettere in bacheca. Anzi, no: devi decidere tu.»"]]
    };
  }
  boot();
})();
