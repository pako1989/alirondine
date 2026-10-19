// js/officina-c2.js - «L'OFFICINA DEI GIGANTI DI RUGGINE» · Capitolo 2: I Cavi dell'Alta Tensione
// Volta, due valvole (pressione 5 e 7), la squadra di Ferro. Steam Strikers livello 2.
(function () {
  "use strict";
  function boot() {
    const E = window.__officinaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__officinaH) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__officinaH(K), { say, done, ask } = H, PASS = K.PASS;
    const N = 2, S = () => K.stepOf(N);
    H.cast("of_volta", "Volta", "Elettricista dei Cavi", { style: "spiky", hair: "#facc15", acc: ["occhiali"], shirt: "#1d4ed8", skin: "#e0b890", bg: ["#1e3a8a", "#bfdbfe"] }, "I capelli stanno dritti da vent'anni. Dice che è colpa dei cavi. Gli altri dicono di no.");
    H.cast("of_ferro", "Ferro", "Capitano della Squadra di Ferro", { style: "buzz", hair: "#444", beard: "pizzetto", shirt: "#3f3f46", skin: "#c68642", bg: ["#18181b", "#a1a1aa"] }, "Gioca per la Corporazione, ma tiene il fischietto nel taschino sbagliato: quello del cuore.");
    K.cos("of_c2", { kind: "shirt", label: "Maglia dei Cavi", val: "#1d4ed8", from: "Capitolo 2 di L'Officina dei Giganti" });
    K.lore("l_cavi", { t: "I Cavi dell'Alta Tensione", d: "Una foresta di tralicci che alimenta l'intero distretto. Chi li controlla decide chi ha la luce." });

    const goal = (s) => ({
      0: "Parla con Volta nella cabina dei Cavi.",
      1: "Da Brontolo: porta la pressione a 5 e apri la Valvola A.",
      2: "Da Brontolo: porta la pressione a 7 e apri la Valvola B.",
      3: "Parla con Ferro nel piazzale: partita contro la Squadra di Ferro.",
      4: "Il capitolo si chiude con la prima luce dei Cavi."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      F.set("of_c2_done", true);
      if (!F.is("of_stall2")) { F.set("of_gear2", true); K.inv.give("of_ingranaggio"); say("voce", "Nella cabina, tra due fusibili, trovi un secondo ingranaggio d'oro. Nessuno stallo, nessun sacrificio: ti spetta."); }
      K.reward("of_c2", { coins: 90, cos: "of_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", "I Cavi cantano. Per la prima volta in dodici anni, il distretto ha la luce senza chiedere il permesso."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> Pressione ${K.steam.bar()} · Scafo ${K.stat("scafo")} · Fiducia ${K.stat("fiducia")}.`], ["voce", "Il Capitolo 3, «Il Collaudo del Titano», ti aspetta."]]), () => K.openMain(), "of_titolo");
    }
    function valve(n, nextStep, txt) {
      if (!K.steam.need(n)) { say("of_brontolo", `[serio] Fsss... (Servono ${n} di pressione.)`); say("voce", `Pressione ${K.steam.bar()}.`); return done(); }
      say("voce", txt); setStep(N, nextStep); K.bond("fiducia", 1); done();
    }
    function match() {
      say("of_ferro", "[serio] Ordini della Corporazione: vincere. Ordini miei: giocare bene. Spesso coincidono.");
      H.play(2, "Squadra di Ferro", "Partita sui Cavi", (r) => {
        if (r && r.win) { setStep(N, 4); say("of_ferro", "[felice] Mi hai battuto. Faccio finta di non averlo apprezzato. Lo apprezzo."); K.bond("fiducia", 1); fin(); }
        else { say("of_ferro", "Riprova quando la caldaia è carica. Io sono qui, sono sempre qui."); done(); }
      });
    }
    const gen = H.brontolo("of_stall2");
    const talk = {
      of_volta() {
        if (K.rel.scene("of_volta")) return;
        const s = S();
        if (s === 0) {
          say("of_volta", "[serio] Hanno spento i Cavi per costringerci a comprare l'energia della Corporazione. Per riaccenderli servono due valvole: la A a pressione 5, la B a pressione 7.");
          say("of_volta", "Brontolo le apre, tu gli dai fiato. Ma se la caldaia va in stallo a metà, ricominciamo da capo. E io non ho più capelli da sacrificare.");
          K.learnLore("l_cavi"); setStep(N, 1); quest("of_c2", "Rimettere la luce", "Da Brontolo: apri la Valvola A (5) e la Valvola B (7).");
          return done();
        }
        say("of_volta", s < 4 ? "Sali di pressione, scendi di pressione, ma non andare in stallo. Mi raccomando." : "I Cavi sono accesi. Persino i piccioni ne sono felici."); done();
      },
      of_ferro() {
        if (K.rel.scene("of_ferro")) return;
        const s = S();
        if (s === 3) return match();
        say("of_ferro", s < 3 ? "[serio] Torna quando i Cavi funzionano. Giocare al buio è da dilettanti." : "Ci rivedremo. In campo, spero."); done();
      },
      of_brontolo: H.brontolo("of_stall2", () => {
        const s = S();
        if (s === 0) { say("of_brontolo", "[serio] ...Fsss. (Parla con Volta nella cabina.)"); done(); return true; }
        if (s === 1 || s === 2) {
          ask(`Pressione ${K.steam.bar()}`, [
            s === 1 ? { label: "🔧 Valvola A", sub: "Serve pressione 5 (la spende)", big: true, cls: "hot", fn: () => valve(5, 2, "La Valvola A si apre. Un tremito percorre i tralicci e metà dei cavi si accende di un azzurro timido.") }
              : { label: "🔧 Valvola B", sub: "Serve pressione 7 (la spende)", big: true, cls: "hot", fn: () => valve(7, 3, "La Valvola B si apre di scatto. I Cavi si illuminano tutti insieme, come un albero di Natale con troppa fiducia.") },
            { label: "♨️ Alimenta", sub: "+3, passa una fascia", fn: () => H.feed(3, "of_stall2", done) },
            { label: "Altro…", fn: gen }
          ]); return true;
        }
        return false;
      })
    };
    const zones = {
      of_cavi: {
        region: "cavi", name: "I Cavi dell'Alta Tensione", short: "Cavi", sub: "Tralicci, cabina e un gigante che ronza", bg: "of_cavi", time: "giorno",
        w: 28, h: 18, start: [4, 9], items: [[2, 13], [24, 14]],
        areas: [[0, 0, 27, 17, "La foresta dei tralicci: l'aria sa di ozono e di cattive decisioni"]],
        npcs: () => [{ id: "of_brontolo", at: [10, 9] }, { id: "of_ferro", at: [20, 9] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(7, 14, "b"); put(20, 14, "b"); [[3, 3], [24, 3], [5, 15], [22, 15], [14, 14]].forEach(([x, y]) => put(x, y, "t"));
          house(11, 2, 6, 4, { door: [13, 5], roof: "#1e3a8a", enter: { room: "ufficio", name: "Cabina dei Cavi", who: ["of_volta"] } });
        }
      }
    };
    return {
      n: N, title: "I Cavi dell'Alta Tensione", sub: "Due valvole, una cabina e un capitano",
      goal, start: "of_cavi", introBg: "of_cavi", zones, talk, obj: {},
      intro: [["voce", "Il Tubo ti sputa sul piazzale dei Cavi. L'aria punge, i capelli ti si rizzano."], ["voce", "Sopra di te, mille fili spenti e un cartello: «Pericolo. Anche per la fantasia.»"]]
    };
  }
  boot();
})();
