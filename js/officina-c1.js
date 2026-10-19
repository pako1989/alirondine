// js/officina-c1.js - «L'OFFICINA DEI GIGANTI DI RUGGINE» · Capitolo 1: La Fonderia Dimenticata
// Rina e Gasparre, un colosso muto e una caldaia da imparare a dosare. Prima valvola, primo allenamento (Steam Strikers livello 1).
(function () {
  "use strict";
  function boot() {
    const E = window.__officinaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__officinaH) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__officinaH(K), { say, done, ask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.cast("of_rina", "Rina", "Meccanica capo dell'Officina", { style: "ponytail", hair: "#3a2a1a", acc: ["occhiali", "grembiule"], shirt: "#b45309", skin: "#d9a679", bg: ["#78350f", "#fdba74"] }, "Porta la chiave inglese del padre come altri portano un anello. Non la usa. La tiene.");
    H.cast("of_gasparre", "Gasparre", "Vecchio fonditore", { style: "bald", hair: "#aaa", beard: "folta", acc: ["berretto"], shirt: "#44403c", skin: "#c68642", bg: ["#292524", "#d6d3d1"] }, "Settantadue anni, un'opera d'arte e nessuna fretta. Parla alle caldaie come si parla ai cani.");
    H.cast("of_brontolo", "Brontolo", "Colosso a vapore", { shape: "robot", skin: "#9a6a3a", shirt: "#7c4a2a", hair: "#7c4a2a", eye: "#fde047", bg: ["#431407", "#fdba74"] }, "Dieci tonnellate di ruggine e un carattere da nonno. Parla a sbuffi; Gasparre traduce. Quasi sempre.");
    H.cast("of_apprendista", "Apprendista dell'Acciaio", "Squadra della Corporazione", { style: "short", hair: "#222", shirt: "#52525b", bg: ["#27272a", "#d4d4d8"] }, "Divisa grigia, sorriso grigio. Gli hanno insegnato a vincere. Non a farlo con piacere.");
    K.cos("of_c1", { kind: "shirt", label: "Maglia della Fonderia", val: "#b45309", from: "Capitolo 1 di L'Officina dei Giganti" });
    K.lore("l_brontolo", { t: "Brontolo", d: "Il primo gigante: tre tubi di rame, due caldaie di recupero e il cuore di una vecchia locomotiva." });
    K.lore("l_pressione", { t: "Pressione e Sfiato", d: "La caldaia accetta vapore fino a 10. Oltre, va in stallo: perdi pressione e pezzi di scafo. I Tubi pneumatici, le valvole e le partite la consumano." });

    const goal = (s) => ({
      0: "Entra nell'hangar della Fonderia e parla con Rina.",
      1: "Parla con Gasparre nella bottega: ti insegna a dosare la caldaia.",
      2: "Da Brontolo: porta la pressione a 5 e apri la valvola (Alimenta, poi Valvola).",
      3: "Da Brontolo: l'allenamento contro gli Apprendisti dell'Acciaio.",
      4: "Il capitolo si chiude con la prima notte alla Fonderia."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      F.set("of_c1_done", true);
      if (!F.is("of_stall1")) { F.set("of_gear1", true); K.inv.give("of_ingranaggio"); say("voce", "Sotto la ruggine della caldaia luccica un ingranaggio d'oro: nessuno stallo, nessuno scarto. Lo raccogli."); }
      K.reward("of_c1", { coins: 70, cos: "of_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", "Notte alla Fonderia. Brontolo respira piano, come un vecchio in poltrona."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> Pressione ${K.steam.bar()} · Scafo ${K.stat("scafo")} · Fiducia ${K.stat("fiducia")}.`], ["voce", "Il Capitolo 2, «I Cavi dell'Alta Tensione», ti aspetta."]]), () => K.openMain(), "of_titolo");
    }
    function valve() {
      if (!K.steam.need(5)) { say("of_brontolo", "[serio] Fsss... (Pressione bassa. Servono 5 per aprire la valvola.)"); say("voce", `Pressione ${K.steam.bar()}. Alimenta la caldaia.`); return done(); }
      say("voce", "La valvola gira con un gemito antico. Un getto di vapore rompe la ruggine e il gigante apre gli occhi: due lampadine gialle."); say("of_gasparre", "[felice] Ecco. Ti ha riconosciuto. A me ci ha messo un anno.");
      setStep(N, 3); quest("of_c1b", "Il primo allenamento", "Da Brontolo: gli Apprendisti dell'Acciaio sono al campo."); K.bond("fiducia", 1); done();
    }
    function training() {
      say("of_apprendista", "[serio] Siamo qui per un'amichevole. La Corporazione consiglia di perderla con dignità.");
      H.play(1, "Apprendisti dell'Acciaio", "Allenamento · Fonderia", (r) => {
        if (r && r.win) { setStep(N, 4); say("of_rina", "[felice] Ha vinto un colosso con una gamba allentata. La Corporazione dovrà inventarsi qualcosa."); K.bond("fiducia", 1); fin(); }
        else { say("of_gasparre", "[pensa] Perso, ma ha tirato. Sistema la pressione e riprova."); done(); }
      });
    }
    const gen = H.brontolo("of_stall1");
    const talk = {
      of_rina() {
        if (K.rel.scene("of_rina")) return;
        const s = S();
        if (s === 0) {
          say("of_rina", "[serio] Ah, sei tu. Quello che «ha letto il volantino». Benvenuto alla Vecchia Fonderia: tre tetti, due caldaie e un gigante che non si sveglia da quarant'anni.");
          say("of_rina", "La Corporazione ha annunciato un torneo di calcio corazzato: Acciaio Supremo contro chiunque. Noi siamo il «chiunque». Parla con Gasparre, nella bottega.");
          K.learnLore("l_brontolo"); setStep(N, 1); K.inv.give("of_chiave");
          quest("of_c1", "Il Gigante muto", "Parla con Gasparre nella bottega.");
          return done();
        }
        say("of_rina", s < 4 ? "Non fare il turista. Le caldaie non si svegliano da sole." : "Bel lavoro. Domani si sale ai Cavi."); done();
      },
      of_gasparre() {
        if (K.rel.scene("of_gasparre")) return;
        const s = S();
        if (s === 1) {
          say("of_gasparre", "[pensa] Una caldaia è come un cane: se la nutri poco muore, se la nutri troppo morde. La pressione va da 0 a 10. Oltre il 10, stallo: perdi vapore e un pezzo di scafo.");
          say("of_gasparre", "Il tempo la fa salire: una fascia e +1. Brontolo ha una valvola principale: servono 5 di pressione per aprirla. Alimenta da lui, ma non esagerare. Tieni, olio buono.");
          K.learnLore("l_pressione"); K.inv.give("of_olio"); setStep(N, 2);
          quest("of_c1a", "La prima valvola", "Da Brontolo: porta la pressione a 5 e apri la valvola.");
          return done();
        }
        say("of_gasparre", s < 4 ? "Piano. La caldaia ha pazienza, a differenza di chi la guarda." : "Ottimo. Non dirlo a Rina, ma ero preoccupato."); done();
      },
      of_brontolo: H.brontolo("of_stall1", () => {
        const s = S();
        if (s === 0 || s === 1) { say("of_brontolo", "[serio] ...Fsss. (Parla prima con Rina e Gasparre.)"); done(); return true; }
        if (s === 2) {
          ask(`Pressione ${K.steam.bar()}`, [
            { label: "🔧 Apri la valvola", sub: "Serve pressione 5 (la spende)", big: true, cls: "hot", fn: valve },
            { label: "♨️ Alimenta", sub: "+3, passa una fascia", fn: () => H.feed(3, "of_stall1", done) },
            { label: "Altro…", fn: gen }
          ]); return true;
        }
        if (s === 3) {
          ask(`Pressione ${K.steam.bar()}`, [
            { label: "⚽ Allenamento", sub: "Steam Strikers, livello 1", big: true, cls: "hot", fn: training },
            { label: "Altro…", fn: gen }
          ]); return true;
        }
        return false;
      })
    };
    const zones = {
      of_fonderia: {
        region: "fonderia", name: "La Vecchia Fonderia", short: "Fonderia", sub: "Ciminiere spente, un hangar e un gigante muto", bg: "of_fonderia", time: "giorno",
        w: 28, h: 18, start: [4, 9], items: [[2, 13], [24, 14]],
        areas: [[0, 0, 27, 17, "Il piazzale della Fonderia: ruggine, sole basso e ostinazione"]],
        npcs: () => [{ id: "of_brontolo", at: [13, 9] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(8, 14, "b"); put(19, 14, "b"); [[3, 3], [24, 3], [5, 15], [22, 15]].forEach(([x, y]) => put(x, y, "t"));
          house(5, 2, 6, 4, { door: [7, 5], roof: "#7c2d12", enter: { room: "ufficio", name: "Hangar di Rina", who: ["of_rina"] } });
          house(17, 2, 6, 4, { door: [19, 5], roof: "#44403c", enter: { room: "bottega", name: "Bottega di Gasparre", who: ["of_gasparre"] } });
        }
      }
    };
    return {
      n: N, title: "La Fonderia Dimenticata", sub: "Un gigante muto, una caldaia e un'amichevole",
      goal, start: "of_fonderia", introBg: "of_titolo", zones, talk, obj: {},
      intro: [["voce", "Distretto delle Ciminiere, mattina. La Vecchia Fonderia è chiusa da quarant'anni. La porta, però, è aperta."], ["voce", "Dentro, qualcuno ha acceso una lampada. Dentro, qualcosa respira."]]
    };
  }
  boot();
})();
