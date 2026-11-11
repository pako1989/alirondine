// js/foto58-c3.js - «LA FOTO DEL '58» · Capitolo 3: La Galleria
// Mauro Mancuso guida la corriera del Passo da trentun anni; suo zio Ottavio è morto nel '58 e nessuno gli ha detto come.
// Viola sviluppa l'ultimo rullino che non voleva toccare: la galleria, al lampo del flash, e il pendio fuori, dove una fila di orme se ne va.
// Il volto graffiato entra nel Taccuino. Alla fine, a Mauro, cosa dici: la verità intera o quella che si può portare?
(function () {
  "use strict";
  function boot() {
    const E = window.__foto58Core;
    if (!E || !E.api || !E.api.addChapter || !window.__f5H || !window.__f5P) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__f5H(K), Z = window.__f5Z, { say, done } = H;
    const N = 3, S = () => K.stepOf(N), D = () => K.deduce;
    H.people();
    K.cos("f5_c3", { kind: "acc", label: "Lanterna della corriera", val: "lanterna", from: "Capitolo 3 di La Foto del '58" });
    K.lore("l_f5_galleria", { t: "La galleria del Passo", d: "Trecento metri scavati a mano nel 1911, la volta di mattoni. Il 13 aprile 1958, al ritorno dalla finale, una trave cedette mentre la corriera era ferma per una frana. Ne uscirono in tredici, più l'autista. Rifatta in cemento nel 1960." });
    K.lore("l_f5_mauro", { t: "Mauro Mancuso", d: "Nipote di Ottavio, il terzino con la barba. Autolinee Mancuso, corsa Borgo-Valle-Passo da trentun anni. Rallenta sempre, in galleria. Dice per le buche." });
    const goal = (s) => ({
      0: "In piazza, alla fermata, la corriera blu delle Autolinee Mancuso. L'autista fuma appoggiato alla palina.",
      1: "All'Archivio, Viola ha l'ultimo rullino. Quello che non voleva sviluppare: «Galleria».",
      2: `Apri la galleria dal mirino. Ascolta (${H.heard("f5_galleria")}/10 almeno), poi esci dall'altra parte, sul pendio (${H.heard("f5_neve")}/4). Poi torna da Viola.`,
      3: "In piazza, la lapide vicino alla fontana: sotto la polvere c'è un nome. Poi Mauro, alla fermata.",
      4: `Nel Taccuino, porta a nove i volti confermati (${H.conf()}/9). Poi parla con Viola.`,
      5: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      setStep(N, 5); F.set("f5_c3_done", true);
      const m = K.reward("f5_c3", { coins: 140, cos: "f5_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["f5_viola", "[serio] Nove. E un volto che fino a ieri non c'era."],
        ["f5_viola", "[pensa] Manca il ritorno. Nando l'ha fotografato di notte, in piazza: la corriera che arriva, le madri sui gradini. È l'ultimo negativo della busta. Dopo, il rullino è vuoto."],
        ["f5_viola", "[triste] E poi bisogna decidere cosa mettere in bacheca. Io lo so, cosa voglio. Non so se è giusto."],
        ["voce", `<b>FINE DEL CAPITOLO 3 · «La Galleria»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 4 ti aspetta: il ritorno, il cimitero del Borgo, un uomo che fa il solitario da settant'anni, e una bacheca con un posto vuoto al centro."]
      ]), () => K.openMain(), "f5_ritorno");
    }
    const ready = () => H.heard("f5_galleria") >= 10 && H.heard("f5_neve") >= 4;
    const after = (zid) => { if (S() === 2 && ready() && !F.is("f5_c3_visto")) { F.set("f5_c3_visto", true); say("voce", "<b>Hai visto abbastanza.</b> Più di quanto volessi. Torna al cavalletto e da Viola."); } };
    const over = {
      "f5_neve:f5_renzo": () => {
        const first = !F.is("f5_h_f5_neve_renzo"); F.set("f5_h_f5_neve_renzo", true);
        say("voce", "<em>(Lontano, sul pendio, un uomo con la busta in mano. Si è voltato un'ultima volta. E qui, nel negativo del pendio, la faccia c'è: il graffio è stato fatto sulla stampa, non sul negativo. Un viso storto, il sorriso storto, gli occhi di uno che ha appena deciso.)</em>");
        say("f5_renzo", "Dite che sono stato io. Ditelo. Così è finita.");
        if (first) {
          D() && D().see("f5_renzo"); D() && D().note("f5_renzo", "f5_neve", true);
          say("voce", "📓 <b>Un volto nuovo nel Taccuino:</b> il Nove. Adesso ha una faccia. Gli manca un nome e un destino.");
          after("f5_neve");
        }
        done();
      },
      "f5_galleria:f5_renzo": () => { const first = !F.is("f5_h_f5_galleria_renzo"); F.set("f5_h_f5_galleria_renzo", true); say("voce", "<em>(Il Nove. Stringe la busta. Nel lampo del flash la faccia è bianca, troppo bianca: bruciata.)</em>"); say("f5_renzo", "Adesso è mia. Hai capito? Adesso è mia. Corri."); if (first) after("f5_galleria"); done(); }
    };

    const talk = Object.assign(window.__f5FT(K, H, over, after), {
      f5_mauro() {
        const s = S();
        if (s === 0) {
          say("voce", "Un uomo grosso, la barba grigia, la giacca delle Autolinee Mancuso aperta sulla pancia. Fuma come si fa una cosa vietata da tanto tempo che non è più vietata.");
          say("f5_mauro", "[ride] Tu sei quello dell'Archivio. Viola mi ha detto: «Se lo vedi, sii gentile». Io sono sempre gentile. È la corriera che è scorbutica.");
          say("f5_mauro", "[serio] Mio zio Ottavio era nella foto. Il terzino con la barba, quello che fa la smorfia. Morto nel '58, in galleria. Avevo zero anni meno trentanove, cioè non c'ero. Ma a casa mia aprile non si nominava.");
          say("f5_mauro", "[pensa] Viola ha un rullino che non ha mai voluto sviluppare. C'è scritto «Galleria». Me l'ha detto lei, una sera. Poi ha cambiato discorso, ha parlato di biscotti per mezz'ora.");
          K.learnLore("l_f5_mauro"); K.rel.add("f5_mauro", 2);
          setStep(N, 1); quest("f5_c3a", "Il rullino «Galleria»", "Viola ha l'ultimo rullino che non voleva sviluppare.");
          return done();
        }
        if (s === 3) {
          if (!F.is("f5_lapide")) { say("f5_mauro", "[serio] La lapide, vicino alla fontana. Guardala bene, sotto la targa piccola. Io non ce la faccio, da trentun anni la guardo di sbieco dal finestrino."); return done(); }
          say("f5_mauro", "[serio] Allora? L'hai visto, nel negativo? Com'è morto mio zio? Mia nonna diceva «il Nove, quel Maffei, ha portato la sfortuna». Renzo Maffei. Lo diceva come una bestemmia.");
          D() && D().learn("who", "renzo");
          say("voce", "📓 Il nome che mancava sul retro della foto ha un suono, adesso: <b>Renzo Maffei</b>, il 9.");
          return H.wask("Mauro aspetta. Fuori la corriera tossisce. Cosa gli dici di suo zio?", [
            { label: "🔎 Tutta la verità", sub: "Ha tenuto su la trave per salvare un ragazzo: Ilario", w: { verita: 2 }, fn: () => {
              F.set("f5_c3_verita", true);
              say("f5_mauro", "[sorpreso] …Ilario. Ilario Gentile. Quello del bar. Che ogni aprile mi offre il caffè e non mi guarda in faccia.");
              say("voce", "Mauro spegne la sigaretta sulla palina, con cura, come se fosse importante non sporcare.");
              say("f5_mauro", "[triste] Settant'anni di caffè. …Va bene. Va bene. Lo zio teneva su una trave. Lo zio era forte. Mia nonna diceva sempre che era forte.");
              K.rel.add("f5_mauro", 2); fine();
            } },
            { label: "🕊️ La verità che si può portare", sub: "È morto da eroe, salvando gli altri. Senza nomi.", w: { pieta: 2 }, fn: () => {
              F.set("f5_c3_pieta", true);
              say("f5_mauro", "[pensa] Da eroe. Salvando gli altri. …Ci credevo già, sai. Ma un conto è crederci, un conto è che te lo dica uno che l'ha visto. Anche se l'ha visto in un negativo.");
              say("f5_mauro", "[triste] Non mi dire chi. Se c'è un chi, non me lo dire. Io devo passare in quella galleria due volte al giorno.");
              K.rel.add("f5_mauro", 3); fine();
            } }
          ]);
        }
        say("f5_mauro", ["[ride] La corriera del '58 era verde e crema. La mia è blu. Mio nonno diceva che il blu porta bene. Non ci ha mai preso, il nonno.", "[serio] In galleria rallento sempre. Per le buche, dico. Non ci sono buche.", "[pensa] Alla fermata, d'inverno, la Rina mi porta il tè. Non me l'ha mai chiesto nessuno, di portarlo. Lei lo porta."][K.hash(Date.now()) % 3]);
        return done();
        function fine() {
          say("f5_mauro", "[pensa] Don Dario, il parroco che mi ha battezzato… era della Rondine, lo sapevi? Il dieci, quello con la medaglietta. Ogni 13 aprile diceva messa per lo zio. Da prete. Per quarant'anni. Diceva che l'aveva promesso «là sotto».");
          D() && D().learn("fate", "prete");
          setStep(N, 4); K.questDone("f5_c3c"); done();
        }
      },
      f5_viola() {
        const s = S();
        if (s === 0) { say("f5_viola", "[pensa] Mauro è alla fermata. Va' tu. Io… io oggi riordino i verbali. Tutti. In ordine alfabetico. Di nuovo."); return done(); }
        if (s === 1) {
          say("f5_viola", "[serio] «Galleria». L'ho tenuto nel cassetto due anni. Non perché ho paura. Ho paura. Ma non è per quello. È che dopo non si torna indietro.");
          say("f5_viola", "[pensa] Va bene. Io tengo la pinzetta, tu dimmi chi è chi. Il flash di Nando, in galleria, ha fermato tutto. Anche la polvere.");
          return H.develop({ id: "galleria", title: "Il negativo della galleria", ids: ["f5_ottavio", "f5_ilario58", "f5_amedeo", "f5_nicolino", "f5_rocco", "f5_carmine", "f5_dario", "f5_guido"], seed: 1304, diff: 1,
            intro: "Il negativo della galleria: otto facce al lampo del flash, nel buio. Dì chi è chi prima che la carta si annerisca." }, (r) => {
            say("f5_viola", r && r.viola ? "[triste] Fatto. L'ho fatto io. Non l'ho guardato. Guardalo tu, prima." : "[triste] Ecco. È venuto. Non guardarlo da qui: guardalo nel mirino.");
            say("voce", "Nel mirino, adesso, c'è anche <b>la galleria</b>. In fondo, verso la luce, si esce sul pendio.");
            setStep(N, 2); K.questDone("f5_c3a"); quest("f5_c3b", "La galleria", "Apri la galleria dal mirino, ascolta, esci sul pendio.");
            done();
          });
        }
        if (s === 2) {
          if (!ready()) { say("f5_viola", `[serio] Galleria ${H.heard("f5_galleria")}/10, pendio ${H.heard("f5_neve")}/4. Lo so. Lo so che è difficile. Torna dentro.`); return done(); }
          say("f5_viola", "[triste] Ottavio Mancuso teneva su la trave. Per il ragazzo coi guanti. E il Nove gli ha preso la busta dalle mani e se n'è andato nella neve. Perché?");
          say("f5_viola", "[pensa] «Dite che sono stato io.» Si è preso la colpa. Della busta, della finale persa, di tutto. E il Borgo gliel'ha data volentieri: un colpevole è più comodo di un ragazzo di diciannove anni.");
          say("f5_viola", "[serio] La lapide in piazza. Sotto la targa della Rondine, «ai suoi», c'era un nome. L'hanno coperto di vernice nel '60. Io so dove grattare.");
          setStep(N, 3); K.questDone("f5_c3b"); quest("f5_c3c", "La lapide e la fermata", "La lapide in piazza, vicino alla fontana. Poi Mauro, alla fermata.");
          return done();
        }
        if (s === 3) { say("f5_viola", F.is("f5_lapide") ? "[serio] Mauro è alla fermata. Cosa gli dici è affar tuo. Io sono un'archivista: io conservo, non decido." : "[pensa] La lapide, vicino alla fontana. Gratta piano: è vernice del '60, viene via con l'unghia."); return done(); }
        if (s === 4) {
          if (H.conf() >= 9) return fin();
          say("f5_viola", `[serio] ${H.conf()} su nove. Il Taccuino ha nomi nuovi: il terzino della galleria, il prete, il Nove. Prova.`); return done();
        }
        say("f5_viola", "[felice] Ultimo negativo. Ultimo. Poi mi compro una macchina del caffè nuova. Questa ha visto troppo."); return done();
      },
      f5_ilario() {
        say("f5_ilario", S() >= 2 ? ["[serio] Hai visto la galleria. Si vede. Hai la faccia di uno che ha sentito una trave cedere.", "[triste] Non oggi. Oggi no. Domani, forse. Domani è sempre il giorno giusto per le cose che non si fanno."][K.hash(Date.now()) % 2] : "[pensa] Mauro passa col pullman alle dieci e venti. Lo sento arrivare dalla galleria: rallenta sempre. Sempre.");
        return done();
      },
      f5_nello() { say("f5_nello", ["[serio] Ogni 13 aprile Ilario offre il caffè a Mauro. Mauro lo beve. Non si dicono niente. Sono quarant'anni che li guardo e non ho ancora capito chi dei due paga il conto vero.", "[ride] Don Dario veniva qui a vedere le partite. Bestemmiava in latino, così non era peccato."][K.hash(Date.now()) % 2]); return done(); },
      f5_rina() { say("f5_rina", ["[triste] Ottavio aveva la barba di tre giorni anche il giorno del battesimo. Sua madre, Assunta, ha messo il piatto in più fino al '90.", "[pensa] Bepi è tornato. Ottavio no. Il Nove neanche. Io ho sposato quello che è tornato. Non me ne sono mai pentita, ma ogni tanto me lo chiedo."][K.hash(Date.now()) % 2]); return done(); }
    });

    const zones = Object.assign(window.__f5P(K, H, {
      borgo: () => [{ id: "f5_mauro", at: [30, 13] }, { id: "f5_rina", at: [7, 12] }],
      arch: () => [{ id: "f5_viola", at: [7, 6] }],
      bar: () => [{ id: "f5_ilario", at: [13, 2] }, { id: "f5_nello", at: [4, 2] }],
      busOggi: true, borgoItems: [[2, 17], [34, 17], [20, 8]], itemCos: "f5_c3",
      borgoObj: {
        N: () => {
          if (S() < 3) return K.say([["voce", "La lapide della piazza: i nomi della Grande Guerra e, più in basso, una targa più piccola: «U.S. Rondine · ai suoi». Sotto, una striscia di vernice grigia, più nuova del resto."]], K.done);
          const nw = !F.is("f5_lapide"); F.set("f5_lapide", true); if (nw) { D() && D().learn("fate", "galleria", true); K.learnLore("l_f5_galleria"); }
          K.say([["voce", "Gratti la vernice grigia con l'unghia, come ha detto Viola. Viene via a scaglie, come la neve vecchia."], ["voce", "Sotto, inciso piccolo: <em>«Ottavio Mancuso, 1936-1958. Galleria del Passo. Teneva su il mondo.»</em> Qualcuno, nel '60, ha deciso che il Borgo non doveva leggerlo."]].concat(nw ? [["voce", "📓 Nuovo destino nel Taccuino: <b>Morto nella galleria, 1958</b>."]] : []), K.done);
        }
      },
      intro: { borgo: [["voce", "La piazza, le dieci e venti. La corriera blu delle Autolinee Mancuso aspetta alla fermata col motore acceso. L'autista fuma appoggiato alla palina e guarda la lapide di sbieco."]] }
    }), {
      f5_galleria: Z.galleria(H),
      f5_neve: Z.neve(H)
    });
    zones.f5_galleria.intro = [["voce", "Il lampo del flash di Nando, e poi il buio. Nel negativo, il buio resta. Si vede quello che il lampo ha illuminato: una trave, delle spalle, una mano tesa, la polvere ferma come neve al contrario."]];
    zones.f5_neve.intro = [["voce", "Fuori dalla galleria, il pendio. Il sole è basso, la neve è rosa. I vivi sono seduti in fila, contati due volte. E lontano, su per il crinale, una fila di orme che non torna."]];

    return {
      n: N, title: "La Galleria", sub: "Trecento metri di buio, un lampo, una trave",
      goal, start: "f5_borgo", introBg: "f5_galleria_bg", zones, talk, obj: {},
      intro: [["voce", "Il terzo giorno, al Borgo, c'è la nebbia. Di quelle che salgono dalla valle e si fermano in piazza come se volessero parlare con qualcuno."], ["voce", "Alla fermata, la corriera blu delle Autolinee Mancuso aspetta col motore acceso. Viola, al telefono, ha detto solo: «Oggi è il giorno della galleria. Non sono pronta. Vieni lo stesso.»"]]
    };
  }
  boot();
})();
