// js/figurine-c3.js - «CACCIATORI DI FIGURINE» · Capitolo 3: La Città delle Vetrine
// La Fabbrica Album, le figure in vetrina con il cartellino del prezzo, una prova e una scelta: liberarle o lasciarle dove sono.
(function () {
  "use strict";
  function boot() {
    const E = window.__figurineCore;
    if (!E || !E.api || !E.api.addChapter || !window.__lotta || !window.__figurineH) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const H = window.__figurineH(K), { say, done, ask } = H, { setStep, quest, F } = K;
    const N = 3, S = () => K.stepOf(N), PASS = K.PASS;
    H.cast("fg_vetrino", "Dott. Vetrino", "Direttore della Fabbrica Album", { style: "slick", hair: "#1c1917", acc: ["occhiali"], shirt: "#0f172a", skin: "#e0b890", bg: ["#0f172a", "#e2e8f0"] }, "Parla piano e con ordine. Ogni suo «proteggere» ha un cartellino col prezzo.");
    H.cast("fg_gilda", "Gilda", "Emporio dei Tipi", { style: "bun", hair: "#9a3412", acc: ["grembiule"], shirt: "#a16207", bg: ["#78350f", "#fde68a"] }, "Vende esche, nastri e consigli. Anche quando non servono.");
    K.cos("fg_c3", { kind: "shirt", label: "Maglia della Vetrina", val: "#334155", from: "Capitolo 3 di Cacciatori di Figurine" });

    const goal = (s) => ({
      0: "Parla con Nives nel bosco: la Città delle Vetrine ti aspetta. Apri la Rotta.",
      1: "In città: parla con il Dott. Vetrino nella sede della Fabbrica.",
      2: "Il Dott. Vetrino ti propone una Prova: affronta le sue figure.",
      3: "Hai la scelta sulle figure delle vetrine. Torna dal Dott. Vetrino.",
      4: "Apri la Rotta con Nives: l'Arena della Lega ti aspetta."
    }[s] || "Il capitolo 3 è concluso. Segue la Lega.");
    function after() { setStep(N, 4); quest("fg_c3d", "La Lega", "Apri la Rotta con Nives e vai all'Arena della Lega."); done(); }
    function route() {
      ask(`Scorte ${K.stat("scorte")} · Fama ${K.stat("fama")} · Album ${K.catch.list().length}/${K.catch.total}`, [
        { label: "🗺️ Guarda la Rotta", sub: "Scegli la prossima tappa", cls: "hot", big: true, fn: () => K.route.open(K.done, true) },
        { label: "Restiamo un po'", fn: K.done }
      ]);
    }
    const talk = Object.assign({
      fg_nives() {
        if (K.rel.scene("fg_nives")) return;
        if (S() === 0) { say("fg_nives", "[serio] Le vetrine. Ho visto la Fabbrica quando avevo quindici anni e ho pensato che fosse bello. Ho cambiato idea, adesso."); setStep(N, 1); quest("fg_c3a", "La Città delle Vetrine", "Apri la Rotta con Nives e vai in città: cerca il Dott. Vetrino."); return route(); }
        if (S() === 3 && F.is("fg_decided")) { say("fg_nives", "Hai scelto. Io sono con te, in ogni caso."); return after(); }
        say("fg_nives", S() >= 4 ? "Andiamo alla Lega? Ho una bella sensazione, il che di solito è un pessimo segno." : "Dove andiamo?"); route();
      },
      fg_gilda() {
        say("fg_gilda", "[felice] Esche, nastri e consigli! Gli ultimi due sono gratis. Il primo pure, se sei simpatico.");
        if (!F.is("fg_gilda_e")) { F.set("fg_gilda_e", true); K.inv.give("fg_esca", 2); say("voce", "Gilda ti dà due esche per il viaggio."); }
        done();
      },
      fg_vetrino() {
        const s = S();
        if (s === 1) {
          say("fg_vetrino", "[serio] Benvenuto. La Fabbrica Album protegge le figure da chi non ne ha cura. Qui sono al sicuro, in fila, con un cartellino. Nessuna soffre.");
          say("voce", "Dietro di lui, una teca contiene una figura immobile. Ha gli occhi aperti.");
          return ask("Il Dott. Vetrino ti guarda come un contratto.", [
            { label: "«Dimostralo»", sub: "Prova a turni", big: true, fn: () => trial() },
            { label: "«Non mi fido»", sub: "Fama +1", fn: () => { K.bond("fama", 1); say("fg_vetrino", "[ride] La fiducia è un lusso. Alla Prova, allora."); trial(); } }
          ]);
        }
        if (s === 2) { say("fg_vetrino", "Ti aspetto per la Prova, quando sei pronto."); return ask("Il Dott. Vetrino indica la porta del campo.", [{ label: "Affronta la Prova", big: true, fn: () => trial() }, { label: "Non ancora", fn: K.done }]); }
        if (s === 3) { return choice(); }
        say("fg_vetrino", "La Lega è aperta. Buona fortuna: ne avrai bisogno."); done();
      }
    }, {});
    function trial() {
      setStep(N, 2);
      K.catch.battle([["fg_sipario", 2], ["fg_muraglia", 2], ["fg_svolazzo", 2]], { title: "La Prova delle Vetrine · contro il Dott. Vetrino", done: (r) => {
        if (!r.win) { say("fg_vetrino", "[serio] Non basta ancora. Le figure della Fabbrica sono state allenate con metodo. Riprova."); return done(); }
        say("fg_vetrino", "[pensa] Hai battuto la mia squadra. Non lo capisco, ma lo registro."); setStep(N, 3); quest("fg_c3b", "La scelta", "Torna dal Dott. Vetrino: ora vuole parlare."); done();
      } });
    }
    function choice() {
      say("fg_vetrino", "[serio] Hai vinto. Per regolamento, ti spetta un invito alla Lega e una scelta: le figure in vetrina possono restare con noi, oppure uscire con te.");
      say("fg_vetrino", "Se escono, perdiamo l'inventario. Se restano, perdi tu la loro fiducia. Non ho un'opinione. Ho solo un modulo.");
      ask("Nelle vetrine, le figure ti guardano.", [
        { label: "Le liberi", sub: "Fama -1. Finale «Custode»", big: true, fn: () => { F.set("fg_libera", true); F.set("fg_decided", true); K.bond("fama", -1); say("fg_vetrino", "[triste] Le teche si aprono. Alcune se ne vanno senza voltarsi. Qualcuna ti segue in silenzio."); say("voce", "Dalle vetrine escono volando decine di figure. Nel cielo sopra la città, per un istante, sembra di vedere un album aperto."); fin3(); } },
        { label: "Le lasci dove sono", sub: "Fama +1. Finale «Campione»", fn: () => { F.set("fg_decided", true); K.bond("fama", 1); say("fg_vetrino", "[serio] Una scelta ragionevole. La Fabbrica si ricorderà di te con gratitudine."); say("voce", "Nives non dice niente. Ma ti guarda con una domanda."); fin3(); } }
      ]);
    }
    function fin3() {
      F.set("fg_c3_done", true); setStep(N, 4); K.reward("fg_c3", { coins: 120, cos: "fg_c3" }); K.finishChapter(N, F.is("fg_libera") ? "libera" : "tiene");
      K.scene([["voce", "La Città delle Vetrine si spegne piano. L'Arena è a una tappa."], ["voce", `<b>FINE DEL CAPITOLO 3.</b> Album ${K.catch.list().length} · Scorte ${K.stat("scorte")} · Fama ${K.stat("fama")}.`], ["voce", "Il Capitolo 4, «La Lega delle Figure», chiude il viaggio."]], () => K.openMain(), "fg_titolo");
    }
    const WILD = { fg_muraglia: [7, 15], fg_svolazzo: [22, 15], fg_zolla: [15, 17], fg_notturno: [24, 8] };
    Object.assign(talk, H.wild(["fg_muraglia", "fg_svolazzo", "fg_zolla", "fg_notturno"], null));
    const zones = {
      fg_citta: {
        region: "citta", name: "Città delle Vetrine", short: "Città", sub: "Marciapiedi lucidi, teche in fila e un cartellino per ogni respiro", bg: "fg_citta", time: "giorno",
        w: 32, h: 22, start: [4, 11], items: [[12, 14], [20, 7]],
        areas: [[0, 0, 31, 21, "La Città: vetrine ovunque, e dietro ogni vetro una figura che guarda fuori"]],
        npcs: () => H.here(["fg_muraglia", "fg_svolazzo", "fg_zolla"], WILD).concat(K.clock.is("Sera") || K.clock.is("Notte") ? H.here(["fg_notturno"], WILD) : []).concat([{ id: "fg_nives", at: [7, 11] }]),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 21, 31, 21, "t"); lay(0, 0, 0, 21, "t"); lay(31, 0, 31, 21, "t");
          lay(1, 10, 30, 12, "+"); lay(14, 1, 17, 9, "+"); lay(14, 13, 17, 20, "+"); put(10, 14, "b"); put(22, 14, "b");
          [[3, 3], [28, 3], [4, 17], [27, 17], [8, 6], [24, 6]].forEach(([x, y]) => put(x, y, "t"));
          house(3, 2, 6, 4, { door: [5, 5], roof: "#a16207", enter: { room: "bottega", name: "Emporio dei Tipi", who: ["fg_gilda"] } });
          house(22, 2, 7, 5, { door: [25, 6], roof: "#0f172a", enter: { room: "ufficio", name: "Sede della Fabbrica Album", who: ["fg_vetrino"] } });
        }
      }
    };
    return {
      n: N, title: "La Città delle Vetrine", sub: "Una fabbrica, una prova e una scelta",
      goal, start: "fg_bosco", introBg: "fg_titolo", zones, talk, obj: {},
      patch: { fg_bosco: { npcs: (s, list) => list } },
      intro: [["voce", "Il bosco alle spalle, la città davanti. Le vetrine riflettono il cielo e non lasciano passare niente."], ["voce", "Nives cammina più veloce del solito. Ha deciso di non parlarne, il che è una forma di parlarne."]]
    };
  }
  boot();
})();
