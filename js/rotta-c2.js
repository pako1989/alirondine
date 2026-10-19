// js/rotta-c2.js - «ROTTA 66» · Capitolo 2: Il Lago che non Pretendeva
// Autogrill → Lago → Borgo. Un passeggero in più nel bagagliaio, il traghetto o la strada lunga (Rotta), una festa di paese e una telefonata.
(function () {
  "use strict";
  function boot() {
    const E = window.__rottaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K;
    const N = 2, S = () => K.stepOf(N), PASS = K.PASS;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const C = (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio);
    C("ro_ersilia", "Ersilia", "Vedova del fondatore", { style: "bun", hair: "#ccc", acc: ["occhiali", "scialle"], shirt: "#6d28d9", bg: ["#4c1d95", "#ddd6fe"] }, "Viaggia con la squadra da sempre. Quest'anno ha portato anche il marito, in un modo che non spiega.");
    C("ro_cosimo", "Cosimo", "Traghettatore del Lago", { style: "buzz", hair: "#777", beard: "folta", acc: ["berretto"], shirt: "#0e7490", skin: "#c68642", bg: ["#164e63", "#a5f3fc"] }, "Il traghetto parte quando lui è pronto. Cioè mai, ma sempre in orario.");
    C("ro_luisa", "Luisa", "Locandiera del Borgo del Lago", { style: "ponytail", hair: "#7a3a1a", acc: ["grembiule"], shirt: "#be123c", bg: ["#881337", "#fecdd3"] }, "Organizza la Sagra della Trota da undici anni. La trota, di sua volontà, non ha mai partecipato.");
    K.cos("ro_c2", { kind: "shirt", label: "Maglia del Lago", val: "#0e7490", from: "Capitolo 2 di Rotta 66" });
    K.lore("l_traghetto", { t: "Il Traghetto di Cosimo", d: "Parte quando il lago è tranquillo. Il lago, finora, ha sempre ritenuto la cosa ragionevole." });

    const goal = (s) => ({
      0: "All'Autogrill, di mattina: c'è un bagaglio che si muove. Parla con Ersilia.",
      1: "Apri la Rotta con Osvaldo: il Lago aspetta. Sul pontile c'è Cosimo; poi il Borgo.",
      2: "Al Borgo del Lago: Luisa organizza la sagra. Parla con lei, poi con Fiamma."
    }[s] || "Il capitolo 2 è concluso. Segue la finale.");

    const osv = () => () => {
      if (S() === 0) { say("ro_osvaldo", "Prima capiamo cosa si muove nel bagagliaio. Poi ripartiamo."); return done(); }
      say("ro_osvaldo", "Il Gigante è pronto. Per i suoi standard.");
      ask(`Benzina ${K.stat("benza")} · Umore ${K.stat("umore")} · Cassa ${K.stat("cassa")}`, [
        { label: "🗺️ Guarda la Rotta", sub: "Scegli la prossima tappa", cls: "hot", big: true, fn: () => K.route.open(K.done, true) },
        { label: "Restiamo un po'", fn: K.done }
      ]);
    };
    function fin() {
      F.set("ro_c2_done", true);
      K.reward("ro_c2", { coins: 90, cos: "ro_c2" });
      K.finishChapter(N, "ok");
      K.scene([["voce", "Il Borgo del Lago si addormenta con la sagra spenta e un odore di trota."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> Benzina ${K.stat("benza")} · Umore ${K.stat("umore")} · Cassa ${K.stat("cassa")}.`], ["voce", "Il Capitolo 3, «La Finale di Valcampo», chiude la Rotta."]], () => K.openMain(), "ro_titolo");
    }
    const talk = {
      ro_ersilia() {
        const s = S();
        if (K.rel.scene("ro_ersilia")) return;
        if (s === 0 && K.inZone("ro_autogrill")) {
          say("voce", "Il bagaglio più grande si muove, poi si siede. Esce Ersilia, spazzolandosi lo scialle.");
          say("ro_ersilia", "[serio] Non dite niente a Bartolo. Mio marito ha fondato la squadra nel '62 e non è mai arrivato a Valcampo. Lo porto io. In un'urna. In un bagaglio.");
          say("ro_ersilia", "[pensa] Dice che la strada è lunga. Gli ho risposto che è sempre stata lunga. Non mi ha contraddetta: da cosa lo vedi, che è lui?");
          return ask("Ersilia ti guarda come chi ha deciso di fidarsi di te.", [
            { label: "«Resta, viaggerai con noi»", sub: "Rapporto +3, Umore +1", big: true, fn: () => { K.rel.add("ro_ersilia", 6, true); K.bond("umore", 1); say("ro_ersilia", "[felice] Grazie. Vi avrei seguiti a piedi. Ma il pullman è più comodo."); go1(); } },
            { label: "«Lo dico a Bartolo»", sub: "Umore -1", fn: () => { K.bond("umore", -1); say("ro_ersilia", "[triste] Fai pure. Di verità, a Sant'Anselmo, ne circolano già abbastanza."); go1(); } }
          ]);
        }
        say("ro_ersilia", s >= 2 ? "[felice] Questo borgo è carino. Anche per chi non respira più." : "[serio] Ogni tanto lo sento russare. Poi ricordo che non succede più.");
        done();
      },
      ro_osvaldo: osv(),
      ro_cosimo() {
        if (!K.inZone("ro_lago")) return PASS;
        K.learnLore("l_traghetto");
        if (F.is("ro_traghetto_ok")) { say("ro_cosimo", "[ride] Il traghetto parte adesso. Cioè tra poco. Cioè prima o poi."); return done(); }
        say("ro_cosimo", "[serio] Il traghetto costa dieci. Ma ho un cavo da riparare. Se mi dai una mano, il biglietto è offerto. Se no, c'è anche la strada lunga.");
        ask("Cosimo ti passa un martello unto.", [
          { label: "Lo aiuti", sub: "Umore -1, il biglietto è gratis", big: true, fn: () => { K.bond("umore", -1); K.bond("cassa", 10); F.set("ro_traghetto_ok", true); say("ro_cosimo", "[ride] Ecco fatto. Ti ho anche rimborsato i dieci. Con gli interessi in storie."); say("voce", "Il martello pesa, il cavo è duro, ma il traghetto adesso è gratis (se vorrai). Cassa +10."); done(); } },
          { label: "Rifiuti e paghi", sub: "Nessun effetto", fn: K.done },
          { label: "Prendi la strada lunga", sub: "Benza 2, Umore 1", fn: () => { say("ro_cosimo", "La strada fa il giro del lago. Molto lungo. Molto largo."); done(); } }
        ]);
      },
      ro_luisa() {
        const s = S();
        if (s === 1) {
          say("ro_luisa", "[felice] Siete la squadra che va a Valcampo! Questa sera c'è la Sagra della Trota. Venite, mangiate, giocate a carte con il sindaco.");
          return ask("Luisa vi stringe le mani, tutte e due.", [
            { label: "Partecipi alla sagra", sub: "Cassa -5, Umore +2", big: true, fn: () => { if (K.stat("cassa") < 5) { say("voce", "Non hai abbastanza cassa."); return done(); } K.bond("cassa", -5); K.bond("umore", 2); K.clock.advance(1); say("ro_luisa", "[ride] Il sindaco ha perso a carte contro Ersilia. Ersilia ha chiesto un bis."); setStep(N, 2); quest("ro_c2b", "La sera del Lago", "Parla con Fiamma: non sta bene."); done(); } },
            { label: "Mangi e scappi", sub: "Umore +1", fn: () => { K.bond("umore", 1); say("ro_luisa", "Mangiate sulle scale. È il tipo di sagra che preferisco."); setStep(N, 2); quest("ro_c2b", "La sera del Lago", "Parla con Fiamma: non sta bene."); done(); } }
          ]);
        }
        say("ro_luisa", s >= 2 ? "Domani fate un altro pezzo di strada. Stasera, invece, la trota." : "Benvenuti, benvenuti!");
        done();
      },
      ro_fiamma() {
        if (!K.inZone("ro_borgo") || S() < 2 || F.is("ro_c2_done")) return PASS;
        if (K.rel.scene("ro_fiamma")) return;
        say("voce", "Fiamma è fuori dalla locanda, il telefono in mano. Lo guarda come un tiro in arrivo e senza guanti.");
        say("ro_fiamma", "[pensa] Mi ha chiamata il lavoro. Mi vogliono lunedì. Se vinciamo, tutti festeggiano. Se perdiamo, tutti tornano a casa. Io no.");
        ask("Fiamma non ti guarda negli occhi.", [
          { label: "«Domani giochi per tutti noi»", sub: "Rapporto +3, Umore +1", big: true, fn: () => { K.rel.add("ro_fiamma", 6, true); K.bond("umore", 1); say("ro_fiamma", "[felice] Sì. Poi decido. Domani, però."); fin(); } },
          { label: "«Dopo la finale deciderai»", sub: "Rapporto +2", fn: () => { K.rel.add("ro_fiamma", 3, true); say("ro_fiamma", "Esatto. Dopo. Grazie per non avermi detto che devo scegliere adesso."); fin(); } },
          { label: "Non dici niente", sub: "Umore -1", fn: () => { K.bond("umore", -1); say("ro_fiamma", "[triste] Ho capito. Va bene."); fin(); } }
        ]);
      }
    };
    function go1() {
      setStep(N, 1);
      quest("ro_c2a", "Il Lago", "Apri la Rotta con Osvaldo e vai al Pontile del Lago.");
      done();
    }
    const zones = {
      ro_lago: {
        region: "lago", name: "Pontile del Lago", short: "Lago", sub: "Un pontile, una barca e il lago che non pretendeva niente", bg: "ro_lago", time: "giorno",
        w: 28, h: 16, start: [3, 6], items: [[5, 4], [23, 5]],
        areas: [[0, 0, 27, 15, "Il Lago: grande, calmo e fin troppo educato"]],
        npcs: () => [{ id: "ro_cosimo", at: [14, 7] }, { id: "ro_osvaldo", at: [7, 7] }, { id: "ro_ersilia", at: [19, 8] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 15, 27, 15, "t"); lay(0, 0, 0, 15, "t"); lay(27, 0, 27, 15, "t");
          lay(1, 9, 26, 14, "w"); lay(1, 6, 26, 8, "+"); lay(10, 9, 16, 11, "="); [[3, 3], [24, 3]].forEach(([x, y]) => put(x, y, "t")); put(19, 4, "b");
        }
      },
      ro_borgo: {
        region: "lago", name: "Borgo del Lago", short: "Borgo", sub: "Una sagra, una locanda e un sindaco che bara", bg: "ro_lago", time: "sera",
        w: 28, h: 18, start: [3, 9], items: [[4, 14], [23, 14]],
        areas: [[0, 0, 27, 17, "Il Borgo: casette di pietra, lampadine appese e profumo di trota"]],
        npcs: () => [{ id: "ro_osvaldo", at: [8, 9] }, { id: "ro_ersilia", at: [18, 9] }, { id: "ro_fiamma", at: [22, 11] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(7, 14, "b"); put(20, 14, "b"); [[3, 3], [24, 3], [4, 15], [22, 15]].forEach(([x, y]) => put(x, y, "t"));
          house(11, 2, 6, 4, { door: [13, 5], roof: "#be123c", enter: { room: "locanda", name: "Locanda del Lago", who: ["ro_luisa"] } });
        }
      }
    };
    return {
      n: N, title: "Il Lago che non Pretendeva", sub: "Un passeggero, un traghetto e una sagra",
      goal, start: "ro_autogrill", introBg: "ro_titolo", zones, talk, obj: {},
      patch: { ro_autogrill: { npcs(step, list) { return step === 0 ? list.concat([{ id: "ro_ersilia", at: [18, 9] }]) : list; } } },
      intro: [["voce", "Mattina all'Autogrill. Un bagaglio troppo grande si sposta da solo."], ["voce", "Il Gigante tossisce. È un buon segno: vuol dire che è sveglio."]]
    };
  }
  boot();
})();
