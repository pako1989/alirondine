// js/conte-c3.js - «IL CONTE DI MONTECALCIO» · Capitolo 3: Il Custode
// Lo stadio Ferrante cerca un custode. Con la tuta e le chiavi si entra dove nessuno guarda: l'armadietto numero 9, la scrivania del Mister, la sagrestia di Don Cosimo.
// Due prove (il referto, la lettera) e un segreto: dire o no la verità a Nina. Il Sospetto non perdona le facce incrociate.
(function () {
  "use strict";
  function boot() {
    const E = window.__conteCore;
    if (!E || !E.api || !E.api.addChapter || !window.__conteH || !window.__conteZ) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__conteH(K), Z = window.__conteZ, { say, done, ask } = H;
    const N = 3, S = () => K.stepOf(N), here = () => K.api.trZone();
    K.cos("ct_c3", { kind: "shirt", label: "Tuta del Custode", val: "#14532d", from: "Capitolo 3 di Il Conte di Montecalcio" });
    K.lore("l_custode", { t: "Il Custode", d: "Lo stadio ha un custode da novantadue anni, e per novantuno è stato un uomo. Si chiamava Albino, aveva le chiavi dietro la schiena e non ricordava mai dove le aveva messe. Quando andò in pensione nessuno volle il mazzo: pesa più della panchina." });
    K.evidence("ct_lettera", { t: "La lettera mai spedita", d: "Una lettera di Mister Ferrante a sua figlia: «Il Presidente mi ha chiesto di tenere fuori il nove contro la Valdorcia. Ho detto no. Domani lo vedo in Municipio, con la Cassa Rurale.» Non è mai partita.", icon: "✉️", short: "Ferrante: «Il Presidente voleva il nove fuori»" });
    K.evidence("ct_referto", { t: "Il referto di Don Cosimo", d: "Una copia del referto, allegata al registro delle partite: Ferrante, ricovero del 14 giugno, «cuore stanco, forte agitazione». In margine, con l'inchiostro: «Il Sindaco gli aveva fatto visita la sera prima».", icon: "📋", short: "Nota a margine: il Sindaco aveva visitato Ferrante" });

    const goal = (s) => ({
      0: "Stadio Ferrante (a sud della piazza): Nina cerca un custode. Servirà la tuta: dal menu 🎭 Cambia maschera → Il Custode.",
      1: `Spogliatoio vecchio (casetta a destra dello stadio): l'armadietto n. 9 ${F.is("ct_n9") ? "✔" : "…"} e la scrivania del Mister ${F.is("ct_lettera_t") ? "✔" : "…"}.`,
      2: "San Cosimo (la chiesa in piazza): Don Cosimo conserva un registro e un referto.",
      3: "Torna da Nina, allo stadio: ti aspetta, e vuole sapere chi sei.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      setStep(N, 4); F.set("ct_c3_done", true); F.set("ct_open4", true);
      K.reward("ct_c3", { coins: 130, cos: "ct_c3" }); K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>🎩 Salotti ${K.stat("salotti")} · 🧢 Strada ${K.stat("strada")} · 🔑 Campo ${K.stat("campo")} · 👁️ Sospetto ${K.stat("sospetto")} · Prove ${H.clues()}/5`],
        ["voce", "Il Capitolo 4 ti aspetta a Palazzo Vanni: stasera la Contessa dà il suo ultimo ballo in maschera. Il cancello laterale è aperto."]
      ]), () => K.openMain(), "ct_stadio");
    }
    const check12 = () => { if (S() === 1 && F.is("ct_n9") && F.is("ct_lettera_t")) { setStep(N, 2); K.questDone("ct_c3b"); quest("ct_c3c", "Il registro", "San Cosimo: Don Cosimo conserva un referto."); say("voce", "<b>Hai quello che ti serviva allo stadio.</b> Manca la chiesa: Don Cosimo scrive tutto, anche quello che non dovrebbe."); } };

    const talk = {
      ct_nina() {
        if (here() !== "ct_stadio") return K.PASS;
        if (K.rel.scene("ct_nina")) return;
        const s = S(), m = K.mask.cur();
        if (s === 0 && m !== "custode") {
          say("ct_nina", "Lo stadio ha un custode in meno e un mazzo di chiavi in più. Cerco qualcuno con le mani da lavoro, non da salotto. Non lei, Conte, con la massima cortesia.");
          say("hero", "[pensa] (La tuta sta nel baule del camerino. Cambia maschera dal menu: Il Custode.)");
          return H.done();
        }
        const r = H.notice("ct_nina", true, [["ct_nina", "[pensa] Strano. Ha lo stesso modo di tenere le braccia del Conte. E la stessa voce, quando sottovoce. Mi sbaglio?"]]);
        if (r) return;
        if (s === 0) {
          H.rep("ct_nina", "campo");
          say("ct_nina", "Un custode! Finalmente. Qui ha le chiavi: spogliatoio, magazzino e il campo di notte. Non chiedo il nome: i custodi non ne hanno.");
          say("ct_nina", "[serio] Un'ultima cosa. L'armadietto del nove è sempre chiuso: mio padre non lo voleva aperto. Se dovesse aprirsi da solo, non mi stupirei.");
          K.learnLore("l_custode"); if (!K.inv.has("ct_chiavi")) K.inv.give("ct_chiavi"); F.set("ct_custode_ok", true);
          setStep(N, 1); quest("ct_c3b", "Lo spogliatoio", "L'armadietto n. 9 e la scrivania del Mister.");
          return H.done();
        }
        if (s === 3) {
          say("ct_nina", "Il custode. Chiudo la porta a chiave, adesso: nessuno ascolta.");
          say("ct_nina", "[serio] Hai le chiavi di mio padre, i suoi occhiali e lo sguardo di chi ha già visto tutto. Non credo che tu sia un custode. Chi sei?");
          return ask("Che cosa rispondi a Nina?", [
            { label: "🔑 «Il nove del Montecalcio, quindici anni fa.»", sub: "Solo a lei. Il Sospetto sale, il Campo anche.", fn: () => { F.set("ct_nina_truth", true); K.bond("campo", 2); K.bond("sospetto", 1); K.rel.add("ct_nina", 2); say("ct_nina", "[sorpreso] …Lo sapevo. Lo sapevo dal pallone sgonfio. Mio padre diceva: «Il nove tornerà quando avrà più dei soldi in tasca». Non dirò niente. Hai la mia parola, e il mio fischietto."); fin(); } },
            { label: "«Un custode con troppe chiavi.»", sub: "Il segreto resta tuo.", fn: () => { say("ct_nina", "[pensa] Va bene. Per ora. Ma se un giorno vuoi dirmelo, la porta dello spogliatoio non ha mai chiuso a chiave per te."); fin(); } },
            { label: "«Qualcuno che vuole il tuo bene.»", sub: "Una mezza verità.", fn: () => { K.bond("campo", 1); say("ct_nina", "[pensa] Chi vuole il mio bene, di solito, arriva con un conto. Tu no. Tienilo."); fin(); } }
          ]);
        }
        say("ct_nina", s < 3 ? "Gli spogliatoi, poi mi dici. Io faccio gli allenamenti; tu fai il custode." : "Il campo la domenica è pieno: sembra che la squadra non fallisca mai."); H.done();
      },
      ct_beppe() {
        if (here() !== "ct_stadio") return K.PASS;
        say("ct_beppe", S() >= 1 ? "Custode! Tieni il campo bagnato e le porte lontane. Il nove è sul dischetto, e il dischetto è quello che conta." : "Chi sei? Il Custode? Io mi chiamo Beppe, tiro col sinistro. Se hai le chiavi, apri il magazzino: i palloni nuovi sono lì.");
        H.done();
      },
      ct_cosimo() {
        if (K.rel.scene("ct_cosimo")) return;
        const s = S(), m = K.mask.cur();
        if (m === "conte" && s >= 2 && !K.hasClue("ct_referto")) { say("ct_cosimo", "[sorpreso] Il Conte in sagrestia! Si è perso? Il confessionale è dall'altra parte. Per le cose «di archivio» preferisco un uomo in tuta, che le porti via senza far rumore."); return H.done(); }
        if (s === 2) {
          say("ct_cosimo", "Il Custode! Sempre dietro una porta che non si apre. Le ostie sono sul tavolo, il vino nella credenza; le partite sono lì, nel registro. Per vizio.");
          say("ct_cosimo", "[serio] Quindici anni fa, una sera, sfogliarono questo registro in due. Uno era un medico, l'altro un uomo con un anello d'oro. Il medico lasciò una copia del referto. L'uomo chiese di dimenticare.");
          say("ct_cosimo", "[pensa] Io non dimentico: archivio. Ecco la copia. In margine ho scritto cosa vidi. Non l'ho mai detto, perché non me l'hanno chiesto.");
          K.giveClue("ct_referto"); K.rel.add("ct_cosimo", 1); K.bond("campo", 1);
          say("voce", "Don Cosimo ti porge la copia del referto. In margine: «Il Sindaco gli aveva fatto visita la sera prima». <b>Nuova prova: Il referto di Don Cosimo.</b>");
          setStep(N, 3); K.questDone("ct_c3c"); quest("ct_c3d", "Nina", "Torna allo stadio: Nina ti aspetta.");
          return H.done();
        }
        say("ct_cosimo", s < 2 ? "Le porte si aprono a chi bussa con le chiavi giuste. Torni con la tuta e con qualcosa da dire." : "Amen, figliolo. E se trovi una busta, restituiscila."); H.done();
      }
    };

    const obj = {
      "ct_spogliatoio:C:2,1": () => {
        if (S() < 1) return K.say([["voce", "L'armadietto n. 9. Chiuso, con un lucchetto nuovo. Nessuno, a Montecalcio, vuole toccarlo."]], K.done);
        if (K.mask.cur() !== "custode") return K.say([["voce", "L'armadietto n. 9. Il lucchetto non si apre a un Conte né a un Mercante: serve chi ha il mazzo."]], K.done);
        if (F.is("ct_n9")) return K.say([["voce", "L'armadietto n. 9, vuoto. Un taglio nella lamiera, sul fondo, di una busta spinta da dietro."]], K.done);
        F.set("ct_n9", true);
        K.say([["voce", "Con la chiave di Nina il lucchetto cede. Dentro: un paio di calzini, un biglietto «lunedì pulire» e, sul fondo, un taglio nella lamiera, come se qualcuno avesse infilato la busta da dietro."], ["hero", "[serio] (La busta non è stata trovata nell'armadietto. È stata messa. Da una persona con la chiave del corridoio dietro, quella del presidente.)"]], () => { check12(); H.done(); });
      },
      "ct_spogliatoio:T:12,7": () => {
        if (S() < 1 || !K.inv.has("ct_chiavi")) return K.say([["voce", "La scrivania del Mister: il cassetto è chiuso a chiave."]], K.done);
        if (F.is("ct_lettera_t")) return K.say([["voce", "Il cassetto è vuoto, adesso: un fischietto, una radiolina spenta."]], K.done);
        F.set("ct_lettera_t", true); K.giveClue("ct_lettera");
        K.say([["voce", "Una delle quattro chiavi dell'anello entra nel cassetto. Dentro, una lettera in una busta senza francobollo, scritta col pennino: «A Nina»."], ["voce", "<em>«Il Presidente mi ha chiesto di tenere fuori il nove contro la Valdorcia. Ho detto no. Domani lo vedo in Municipio, con la Cassa Rurale. Se non torno a cena, tieni il pallone sgonfio: era di tuo nonno.»</em>"], ["voce", "<b>Nuova prova: La lettera mai spedita.</b>"]], () => { check12(); H.done(); });
      }
    };

    const zones = {
      ct_stadio: Z.stadio({
        itemCos: "ct_c3",
        npcs: () => [{ id: "ct_nina", at: [15, 12] }, { id: "ct_beppe", at: [11, 12], route: [[11, 12], [13, 14], [11, 14]], speed: 0.5, pause: 24 }],
        intro: [["voce", "Lo stadio Ferrante. Il catenaccio è aperto. Sul prato, una donna fa correre dei ragazzi con un pallone sgonfio, e il pallone sembra il più allenato."]]
      }),
      ct_spogliatoio: Z.spogliatoio({ npcs: () => [] }),
      ct_sagrestia: Z.sagrestia({ npcs: () => [{ id: "ct_cosimo", at: [5, 5] }] })
    };
    return {
      n: N, title: "Il Custode", sub: "Una tuta, un mazzo di chiavi e un armadietto che non si apre",
      goal, start: "ct_stadio", introBg: "ct_stadio", zones, talk, obj,
      intro: [["voce", "Il Conte apre i salotti, Berto la strada. Resta il campo: dove la gente non guarda, perché è troppo occupata a cantare."], ["voce", "Allo stadio Ferrante serve un custode. Non servono documenti, né un nome: solo le mani, e la pazienza di chi sa aspettare una porta."]]
    };
  }
  boot();
})();
