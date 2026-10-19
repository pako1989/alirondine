// js/officina-c3.js - «L'OFFICINA DEI GIGANTI DI RUGGINE» · Capitolo 3: Il Collaudo del Titano
// Vanda, la direttrice dell'Acciaio Supremo, offre un Patto. Collaudo a pressione 6, scelta, partita di livello 2.
(function () {
  "use strict";
  function boot() {
    const E = window.__officinaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__officinaH) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__officinaH(K), { say, done, ask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.cast("of_vanda", "Vanda", "Direttrice dell'Acciaio Supremo", { style: "bun", hair: "#1a1a1a", acc: ["occhiali"], shirt: "#27272a", skin: "#e0b890", bg: ["#18181b", "#d4d4d8"] }, "Parla piano, sorride poco e firma sempre con la penna nuova. Quella vecchia è per i patti che non intende rispettare.");
    H.cast("of_titano", "Il Titano", "Colosso della Corporazione", { shape: "robot", skin: "#6b7280", shirt: "#4b5563", hair: "#4b5563", eye: "#ef4444", bg: ["#111827", "#9ca3af"] }, "Venti tonnellate, due metri di acciaio in più di Brontolo e il vantaggio di essere nuovo. Il resto è questione di caldaie.");
    K.cos("of_c3", { kind: "shirt", label: "Maglia del Collaudo", val: "#52525b", from: "Capitolo 3 di L'Officina dei Giganti" });
    K.lore("l_collaudo", { t: "Il Campo di Collaudo", d: "Un campo di calce fresca dove la Corporazione misura i giganti degli altri. I verdetti sono quasi sempre già scritti." });
    K.lore("l_patto", { t: "Il Patto dell'Acciaio", d: "Orari, forniture e una catena più lunga. In cambio, l'Officina smette di essere un'Officina." });

    const goal = (s) => ({
      0: "Parla con Vanda nell'ufficio del Collaudo.",
      1: "Da Brontolo: porta la pressione a 6 e sottoponi il gigante al Collaudo.",
      2: "Parla con Vanda: la Corporazione ha una proposta.",
      3: "Parla con Vanda: partita sul Campo di Collaudo.",
      4: "Il capitolo si chiude con la sera al Campo."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      F.set("of_c3_done", true);
      K.reward("of_c3", { coins: 110, cos: "of_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", "Sera al Campo di Collaudo. Brontolo, un po' ammaccato, guarda il Titano che non ha vinto."], ["voce", `<b>FINE DEL CAPITOLO 3.</b> Pressione ${K.steam.bar()} · Scafo ${K.stat("scafo")} · Fiducia ${K.stat("fiducia")}.${F.is("of_patto") ? " Hai firmato il Patto." : ""}`], ["voce", "Il Capitolo 4, «La Battaglia delle Caldaie», ti aspetta."]]), () => K.openMain(), "of_titolo");
    }
    function collaudo() {
      if (K.steam.level() < 6) { say("of_brontolo", "[serio] Fsss... (Servono 6 di pressione per il Collaudo.)"); say("voce", `Pressione ${K.steam.bar()}.`); return done(); }
      K.steam.need(3);
      say("voce", "Brontolo tiene il suo vapore sotto il naso del Titano per dieci minuti. Gli strumenti di Vanda ticchettano e poi, sconfitti, tacciono."); say("of_vanda", "[serio] ...Idoneo. Un'anomalia. Passiamo alla fase successiva.");
      setStep(N, 2); K.bond("fiducia", 1); done();
    }
    function offer() {
      say("of_vanda", "[serio] Parliamo da persone civili. La Corporazione ti offre un Patto: orari fissi, forniture, una catena più lunga. L'Officina diventa un nostro reparto. Non cambia niente. Cambia tutto.");
      ask("Vanda ti porge la penna nuova.", [
        { label: "Firma il Patto", sub: "Scafo +2, Fiducia -1. Cambia il finale", fn: () => { F.set("of_patto", true); K.bond("scafo", 2); K.bond("fiducia", -1); K.learnLore("l_patto"); say("of_vanda", "[felice] Una scelta lungimirante. Mi permetto di segnalare che la penna è nuova."); setStep(N, 3); done(); } },
        { label: "Rifiuti", sub: "Fiducia +1, trovi un ingranaggio d'oro", fn: () => { F.set("of_gear3", true); K.inv.give("of_ingranaggio"); K.bond("fiducia", 1); K.learnLore("l_patto"); say("of_vanda", "[serio] Capisco. Non ne parleremo più. La Corporazione ne parlerà soltanto per sempre."); say("voce", "Passando davanti alla scrivania, tra due fascicoli, noti un ingranaggio che luccica. Lo prendi: nessuno guarda."); setStep(N, 3); done(); } }
      ]);
    }
    function match() {
      say("of_vanda", "[serio] Il Titano contro il tuo gigante. Non per il Patto: per il gusto della cosa.");
      H.play(2, "Il Titano", "Campo di Collaudo", (r) => {
        if (r && r.win) { setStep(N, 4); say("of_vanda", "[pensa] Succede. Una volta. Registro l'anomalia."); K.bond("fiducia", 1); fin(); }
        else { say("of_vanda", "Il Titano ha vinto. Il Titano vince quasi sempre. Riprova quando sei pronto."); done(); }
      });
    }
    const gen = H.brontolo("of_stall3");
    const talk = {
      of_vanda() {
        if (K.rel.scene("of_vanda")) return;
        const s = S();
        if (s === 0) {
          say("of_vanda", "[serio] Le regole del torneo prevedono un Collaudo: ogni gigante deve reggere pressione 6 senza lamentarsi. Il vostro, lo dico con affetto, non ce la farà.");
          K.learnLore("l_collaudo"); setStep(N, 1); quest("of_c3", "Il Collaudo", "Da Brontolo: pressione 6 e Collaudo.");
          return done();
        }
        if (s === 2) return offer();
        if (s === 3) return match();
        say("of_vanda", s === 1 ? "Gli strumenti aspettano. Io, un po' meno." : "Ci rivedremo alle Caldaie."); done();
      },
      of_brontolo: H.brontolo("of_stall3", () => {
        const s = S();
        if (s === 0) { say("of_brontolo", "[serio] ...Fsss. (Parla con Vanda.)"); done(); return true; }
        if (s === 1) {
          ask(`Pressione ${K.steam.bar()}`, [
            { label: "📏 Collaudo", sub: "Serve pressione 6 (ne spende 3)", big: true, cls: "hot", fn: collaudo },
            { label: "♨️ Alimenta", sub: "+3, passa una fascia", fn: () => H.feed(3, "of_stall3", done) },
            { label: "Altro…", fn: gen }
          ]); return true;
        }
        return false;
      })
    };
    const zones = {
      of_collaudo: {
        region: "collaudo", name: "Il Campo di Collaudo", short: "Collaudo", sub: "Calce fresca, un ufficio e un Titano in attesa", bg: "of_collaudo", time: "giorno",
        w: 28, h: 18, start: [4, 9], items: [[2, 13], [24, 14]],
        areas: [[0, 0, 27, 17, "Il Campo di Collaudo: due porte, un cartello e verdetti già pronti"]],
        npcs: () => [{ id: "of_brontolo", at: [10, 9] }, { id: "of_titano", at: [21, 9] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, ":"); put(7, 14, "b"); put(20, 14, "b"); [[3, 3], [24, 3], [5, 15], [22, 15]].forEach(([x, y]) => put(x, y, "t"));
          house(11, 2, 6, 4, { door: [13, 5], roof: "#3f3f46", enter: { room: "ufficio", name: "Ufficio del Collaudo", who: ["of_vanda"] } });
        }
      }
    };
    talk.of_titano = () => { say("of_titano", "[serio] ...Clank. (Il Titano non parla. Ha un ufficio stampa.)"); done(); };
    return {
      n: N, title: "Il Collaudo del Titano", sub: "Pressione 6, una penna nuova e un Patto",
      goal, start: "of_collaudo", introBg: "of_collaudo", zones, talk, obj: {},
      intro: [["voce", "Il Campo di Collaudo ha le righe ancora umide di calce. Pare un campo vero. Lo è."], ["voce", "In fondo, un colosso grigio fa finta di non guardarti."]]
    };
  }
  boot();
})();
