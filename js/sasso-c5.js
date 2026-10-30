// js/sasso-c5.js - «SETTE PER SASSO NERO» · Capitolo 5: L'alba
// Corvo Rosso scende con tutti quelli che gli restano, all'alba, sotto la pioggia: l'ultima «Ultima Notte», col capo in persona (si può riprovare).
// Poi il mantello rosso nel fango, e chi c'è sotto. Poi la collina dei tumuli: una spada per chi è caduto, una parola per chi resta, e la scelta finale.
// Finali: raccolto (5+ vivi) · tumuli (4 o meno) · resta (più Pietà che Onore, e scegli di restare) · nessuno (segreto: tutti e sei vivi, la soffitta perdonata, Jirō salvo).
// Zone: villaggio all'alba (con la Porta Sud verso la collina), la collina dei tumuli (30x22).
(function () {
  "use strict";
  function boot() {
    const E = window.__sassoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__sassoH || !window.__sassoZ || !window.__sassoWounds || !E.api._has(4)) return setTimeout(boot, 100);
    E.api.addChapter(chapter5);
  }
  // dove sta la spada di ciascuno sulla collina, e il saluto di chi resta
  const GRAVE = { sn_kanbei: [13, 9], sn_kiku: [17, 9], sn_gonta: [11, 11], sn_shino: [19, 11], sn_hayate: [9, 13], sn_okuma: [21, 13], sn_tetsu: [12, 14], sn_ren: [18, 14], sn_yumi: [10, 16], sn_masa: [20, 16] };
  const SPOT = { sn_kanbei: [16, 8], sn_kiku: [6, 9], sn_gonta: [24, 10], sn_shino: [5, 13], sn_hayate: [25, 14], sn_okuma: [7, 17], sn_tetsu: [23, 17], sn_ren: [26, 6], sn_yumi: [4, 6], sn_masa: [27, 18] };
  const BYE = {
    sn_kanbei: "[pensa] Ho perso trenta battaglie. Questa l'hanno vinta i contadini. Me la segno lo stesso.",
    sn_kiku: "[felice] Jirō vuole imparare l'arco. Gli ho detto: prima impari a perdere le frecce. Le ha perse tutte in un'ora.",
    sn_gonta: "[serio] Torno al campo. Non per Corvo: ci sono altri come me, là. Qualcuno deve dirgli che si può cambiare strada a piedi, di notte.",
    sn_shino: "[serio] Torno al tempio. La campana adesso suona. Non so chi l'abbia aggiustata. Forse nessuno: forse si è stancata di stare zitta.",
    sn_hayate: "[pensa] Shinobu mi ha chiesto di restare per il kemari della festa. Solo per il kemari. Resto. Solo per il kemari.",
    sn_okuma: "[felice] Ho fatto una campana nuova per il villaggio con le punte delle trappole. Suona in do. Più o meno.",
    sn_tetsu: "[ride] Tetsu, samurai! Me l'hanno scritto sulla porta del granaio. Con la vernice di Manzo. Manzo non lo sa ancora.",
    sn_ren: "[furbo] Mi avete pagato in riso, in sakè e in fiducia. La fiducia pesa di più. Non so dove metterla, ma la tengo.",
    sn_yumi: "[felice] Stasera ballo. Per il villaggio. Gratis. È la prima volta che ballo per chi non ha un castello.",
    sn_masa: "Il fiume è tornato pulito. I pesci pure. I predoni, li ho ributtati tutti: erano piccoli."
  };
  function chapter5(K) {
    const { setStep, quest, F } = K, H = window.__sassoH(K), Z = window.__sassoZ, { say, done, wask, ask } = H;
    const N = 5, S = () => K.stepOf(N);
    H.people();
    K.cos("sn_c5", { kind: "acc", label: "Mantello di Sasso Nero", val: "mantello", from: "Capitolo 5 di Sette per Sasso Nero" });
    K.lore("l_corvo", { t: "Corvo Rosso", d: "Prima di avere un mantello rosso aveva un maestro, un'armatura e un nome. A Nagashino l'hanno lasciato fra i morti. Lo hanno raccolto dei contadini, con le zappe." });

    const nm = (id) => K.crew.members[id].n;
    const dead = (id) => F.is("sn_morto_" + id);
    const kan = () => K.crew.has("sn_kanbei") && !dead("sn_kanbei");
    const secret = () => H.alive().length >= 6 && F.is("sn_perdono") && F.is("sn_jiro_salvo");
    const goal = (s) => ({
      0: "All'alba, sotto la pioggia, Corvo Rosso scende dal passo con tutti i suoi. Parla con Kanbei (o con Gisaku) al granaio.",
      1: "È finita. Sulla collina, oltre la Porta Sud, sotto il ciliegio: chi è caduto e chi resta.",
      2: "Fine."
    }[s] || "Sette per Sasso Nero è concluso.");

    const ENDS = {
      raccolto: { coins: 420, lines: [["voce", "Il riso viene battuto nell'aia cantando. Sulla collina, il ciliegio perde gli ultimi petali sui pochi tumuli."], ["sn_gisaku", "[felice] Hanno vinto. I samurai, dico. Non succede quasi mai. Mio nonno non ci credeva. Lo dirò a mio nonno."]] },
      tumuli: { coins: 360, lines: [["voce", "Il villaggio è salvo. Sulla collina, sotto il ciliegio, ci sono troppe spade piantate nella terra. I contadini cantano mentre piantano il riso nuovo."], ["@kan", "[triste] Abbiamo perso di nuovo. Hanno vinto i contadini. Noi siamo come il vento: passiamo sopra la terra. Loro restano."]] },
      resta: { coins: 440, lines: [["voce", "Gli altri ripartono per le strade, uno a uno, voltandosi due volte. Tu no."], ["voce", "Posi la spada nel granaio, sopra le armature di Manzo. Tieni il pallone. La sera, sul campo fra i quattro alberi, insegni il kemari ai bambini di Sasso Nero."], ["sn_shinobu", "[felice] La palla non deve toccare terra! Mai! Neanche quando piove!"]] },
      nessuno: { coins: 600, lines: [["voce", "All'alba i sette sono tutti in piedi, sporchi di fango, a contarsi. Il conto torna. Lo rifanno tre volte, perché non ci credono."], ["voce", "Sulla collina non c'è nessuna spada. Solo il ciliegio, e sotto il ciliegio Jirō e Kiku che litigano per una freccia storta."], ["sn_gisaku", "[ride] Nessuna tomba. Mio nonno diceva che non si può. Mio nonno, a kemari, perdeva sempre."]] }
    };
    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 2); F.set("sn_c5_done", true); F.set("sn_fine_" + id, true);
      K.reward("sn_c5" + id, { coins: E2.coins, cos: "sn_c5" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines.map(([w, t]) => [w === "@kan" ? (kan() ? "sn_kanbei" : "sn_gisaku") : w, t])).concat([
        ["voce", `<b>FINE DI SETTE PER SASSO NERO.</b><br>${H.stato()} · Caduti: ${Object.keys(K.crew.members).filter(dead).map(nm).join(", ") || "nessuno"}`],
        ["voce", "Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «La Porta del villaggio»."]
      ]), () => K.openMain(), id === "tumuli" ? "sn_tumuli" : "sn_alba");
    }

    // la battaglia dell'alba, con la pioggia e Corvo Rosso in persona
    function battaglia() {
      const d = K.clock.day(); K.clock.set(d, 0);
      K.say(H.flush(), () => K.plan.open({ title: "L'alba · Le Porte", q: `L'ultima volta. Corvo Rosso scende con tutti. Feriti: ${H.alive().filter((id) => F.get("sn_ferite_" + id, 0)).map(nm).join(", ") || "nessuno"}.`, roles: ["n", "e", "s", "o"], pool: H.alive() }, done, true, (m) => {
        H.night({ title: "L'alba di Sasso Nero", granaio: 30, rain: true, boss: true, waves: [[["base", 6], ["lesto", 4]], [["scudo", 4], ["base", 5]], [["capo", 2], ["lesto", 4]], [["corvo", 1, "n"], ["base", 6], ["scudo", 3]]] }, (r) => {
          r = r || {};
          if (!r.win) {
            say("voce", "La pioggia vi respinge fino al granaio. Corvo Rosso si ritira per un'ora, a far riposare i cavalli. Un'ora: è tutto quello che avete.");
            say(kan() ? "sn_kanbei" : "sn_gisaku", "[serio] Di nuovo. Le porte, gli stessi o altri. Quando sei pronto.");
            return done();
          }
          window.__sassoWounds(K, H, (r.data && r.data.fell) || [], m || {});
          corvo();
        });
      }));
    }
    function corvo() {
      say("voce", "Smette di piovere all'improvviso, come quando si chiude una porta. Nel fango davanti alla Porta Nord, un mantello rosso. Corvo Rosso è in ginocchio. L'elmo è rotolato via.");
      if (kan()) {
        say("sn_kanbei", "[sorpreso] (Kanbei si ferma. Guarda la faccia sotto il fango a lungo, come si guarda una lettera vecchia.) Sōjirō. Nagashino. Ti avevo detto «a destra».");
        say("sn_corvo", "[serio] E io sono andato a destra, maestro. Lì c'erano i fucili. Mi avete lasciato fra i morti. Mi hanno trovato dei contadini, di notte. Con le zappe. Per l'armatura.");
      } else {
        say("sn_corvo", "[serio] Il vecchio coi capelli rasati. Era il mio maestro. Diceva «a destra». A Nagashino sono andato a destra e mi hanno lasciato fra i morti. Mi hanno trovato dei contadini, di notte. Con le zappe. Per l'armatura.");
      }
      say("sn_corvo", "[triste] Sono sopravvissuto a loro. Poi ho imparato a fare quello che facevano loro, ma meglio. Tutto qui. Non c'è altro. Non c'è mai altro.");
      if (F.is("sn_giuramento") && !dead("sn_shino") && K.crew.has("sn_shino")) say("sn_shino", "[serio] Si è arreso, ronin. Ricordi.");
      wask("Corvo Rosso, in ginocchio nel fango, aspetta. Il villaggio intero guarda dalle palizzate.", [
        { label: "🌾 «Vattene. Senza mantello e senza nome. Vivi.»", big: true, w: { pieta: 2 }, fn: () => {
          F.set("sn_corvo_vivo", true); K.learnLore("l_corvo"); if (K.crew.has("sn_shino")) K.rel.add("sn_shino", 3);
          say("voce", "Corvo Rosso si toglie il mantello. Lo piega, con cura, come si piega una bandiera. Lo lascia nel fango e scende verso il fiume, a piedi. Non si volta.");
          if (kan()) say("sn_kanbei", "[pensa] Gli ho detto «a destra» un'altra volta. Speriamo che stavolta ci sia un fiume, e non dei fucili.");
          setStep(N, 1); quest("sn_c5", "L'alba", "Sulla collina, oltre la Porta Sud: chi è caduto e chi resta."); done();
        } },
        { label: "🗡️ «Hai ucciso per quattro raccolti. Finisce qui.»", big: true, w: { onore: 2 }, fn: () => {
          F.set("sn_corvo_morto", true); K.learnLore("l_corvo");
          if (kan()) say("sn_kanbei", "[serio] No. Non tu. Era mio allievo: è mio anche questo. (Un colpo solo. Kanbei pulisce la spada nella manica, piano, e la rinfodera per l'ultima volta.)");
          else say("voce", "Un colpo solo. Il mantello rosso resta nel fango. Nessuno lo raccoglie.");
          setStep(N, 1); quest("sn_c5", "L'alba", "Sulla collina, oltre la Porta Sud: chi è caduto e chi resta."); done();
        } }
      ]);
    }

    const talk = {
      sn_kanbei() {
        if (K.rel.scene("sn_kanbei")) return;
        if (S() === 0) { say("sn_kanbei", "[serio] Eccolo. Con la pioggia, come diceva il vecchio. Tutti quelli che gli restano, e lui davanti. Una persona per porta. Il Campione dove serve. Il resto lo decide il fango."); return battaglia(); }
        say("sn_kanbei", BYE.sn_kanbei); done();
      },
      sn_gisaku() {
        if (K.rel.scene("sn_gisaku")) return;
        if (S() === 0 && !kan()) { say("sn_gisaku", "[serio] Kanbei non c'è più a contare. Conto io. Sono vecchio, ma i numeri li so: quattro porte, voi, e lui. Andate."); return battaglia(); }
        if (S() === 1) {
          const opts = [{ label: "🛤️ Riparti con gli altri, per le strade", sub: "Un ronin non resta: passa", big: true, fn: () => ending(secret() ? "nessuno" : H.alive().length >= 5 ? "raccolto" : "tumuli") }];
          if (K.stat("pieta") > K.stat("onore")) opts.push({ label: "🏐 Resti a Sasso Nero, col pallone", sub: "Più Pietà che Onore: qui c'è un posto per te", big: true, fn: () => ending(secret() ? "nessuno" : "resta") });
          opts.push({ label: "◂ Fra poco", fn: done });
          say("sn_gisaku", "[pensa] Sotto il ciliegio ci si dice addio, a Sasso Nero. Oppure no. Dipende da chi resta.");
          return ask(`La collina sopra il villaggio. Sotto, le risaie già allagate per il riso nuovo. ${Object.keys(K.crew.members).filter(dead).length ? "Le spade piantate nella terra luccicano di pioggia." : "Nessuna spada nella terra. Solo il ciliegio."}`, opts);
        }
        say("sn_gisaku", "[serio] Il tè è freddo. Non c'è tempo per scaldarlo."); done();
      },
      sn_corvo() { say("sn_corvo", "..."); done(); },
      sn_rikichi() { if (K.rel.scene("sn_rikichi")) return; say("sn_rikichi", S() === 0 ? "[serio] Stavolta la falce la tengo per i predoni. Solo per loro." : F.is("sn_moglie_salva") ? "[felice] Miyo ha piantato il riso nuovo. Ha detto una parola sola: «ancora»." : "[triste] Il nastro è sulla falce. La falce è nel campo. Il campo è suo."); done(); },
      sn_shinobu() { if (K.rel.scene("sn_shinobu")) return; say("sn_shinobu", S() === 0 ? "[serio] Ho fatto cento onigiri. Per dopo. Ci sarà un dopo. Li ho già fatti." : "[felice] Kemari stasera! Il villaggio contro chi resta. Non vi faccio sconti nemmeno adesso."); done(); },
      sn_manzo() { if (K.rel.scene("sn_manzo")) return; say("sn_manzo", S() === 0 ? "[arrabbiato] La pioggia! Proprio oggi! Il mulino si allaga! (Poi, piano:) Tornate vivi. Tutti." : "[triste] Le armature. Le ho seppellite sulla collina anch'io, con un nome finto per ciascuno. Non sapevo i nomi veri."); done(); },
      sn_miyo() { say("sn_miyo", "[pensa] Ho piantato il riso. Non lo pianto da due anni. Le mani se lo ricordano. È strano cosa si ricordano le mani."); done(); },
      sn_jiro() { say("sn_jiro", "[felice] (Jirō palleggia la palla da kemari: dieci, venti, trenta. Poi la passa a te. Parla poco. Non ce n'è bisogno.)"); done(); }
    };
    Object.keys(BYE).forEach((id) => { if (id !== "sn_kanbei") talk[id] = () => { if (K.rel.scene(id)) return; say(id, S() === 0 ? "[serio] Pronto. Dimmi solo quale porta." : BYE[id]); done(); }; });

    const crewAt = (L, spots) => H.alive().filter((id) => spots[id]).forEach((id) => L.push({ id, at: spots[id] }));
    const zones = {
      sn_villaggio: Z.villaggio(H, (s) => {
        const L = [{ id: "sn_rikichi", at: [26, 11] }, { id: "sn_shinobu", at: [20, 17] }, { id: "sn_manzo", at: [21, 5] }];
        if (s === 0) { L.push({ id: "sn_gisaku", at: [13, 14] }); if (kan()) L.push({ id: "sn_kanbei", at: [18, 13] }); }
        if (F.is("sn_moglie_salva")) L.push({ id: "sn_miyo", at: [6, 19] });
        if (F.is("sn_jiro_salvo")) L.push({ id: "sn_jiro", at: [10, 19] });
        if (s === 0) crewAt(L, { sn_okuma: [12, 13], sn_gonta: [14, 18], sn_hayate: [21, 9], sn_yumi: [8, 17], sn_shino: [21, 13], sn_tetsu: [27, 7], sn_ren: [12, 7], sn_masa: [29, 16], sn_kiku: [12, 17] });
        return L;
      }, {
        time: "giorno", bg: "sn_alba", start: [16, 13],
        doors: { "16,0": { to: "sn_passo", at: [16, 22] }, "17,0": { to: "sn_passo", at: [17, 22] }, "0,11": { to: "sn_bosco", at: [28, 10] }, "0,12": { to: "sn_bosco", at: [28, 11] }, "16,23": { to: "sn_tumuli", at: [14, 20] }, "17,23": { to: "sn_tumuli", at: [15, 20] } },
        extra: [[16, 0, "q"], [17, 0, "q"], [0, 11, "q"], [0, 12, "q"], [16, 23, "q"], [17, 23, "q"]],
        items: [[3, 6], [30, 6], [7, 20], [24, 20]], itemCos: "sn_c5",
        intro: [["voce", "L'alba non arriva. Arriva la pioggia, fitta, grigia, che trasforma le risaie in specchi e le porte in fango."], ["voce", "Sul passo, un mantello rosso. Dietro, tutti quelli che restano a Corvo."]]
      }),
      sn_tumuli: {
        region: "campo", name: "La collina dei tumuli", short: "Collina", sub: "Un ciliegio, la valle, e una spada per chi non è tornato", bg: "sn_tumuli", time: "giorno", w: 30, h: 22, base: ",", start: [15, 20], travel: false,
        items: [[5, 4], [25, 5], [4, 17]], itemCos: "sn_c5",
        areas: [[8, 4, 22, 17, "Sotto il ciliegio"], [0, 0, 29, 21, "La collina dei tumuli"]],
        act: { S: "Guarda il ciliegio", n: "🗡️ Guarda la spada", t: "Guarda l'albero", r: "Guarda la roccia", q: "Torna al villaggio", b: "Siediti", E: "Guarda la lanterna" },
        flavor: { R: "Le terrazze di riso, allagate per il riso nuovo. Riflettono il cielo, che per una volta è pulito.", S: "Il ciliegio della collina. Fiorisce tardi, quando tutti gli altri hanno già finito. Dicono che aspetti chi torna.", t: "Un pino sul crinale. Da qui si vede tutto il villaggio, le quattro porte e il passo, vuoto.", r: "Una roccia scura, calda di sole dopo la pioggia.", b: "Una panca di legno nuova. Okuma l'ha fatta con i pali di una palizzata.", E: "Una lanterna di pietra accesa. Le fiammelle sono quante le spade." },
        doors: { "14,21": { to: "sn_villaggio", at: [16, 22] }, "15,21": { to: "sn_villaggio", at: [17, 22] } },
        npcs: () => { const L = [{ id: "sn_gisaku", at: [15, 7] }]; crewAt(L, SPOT); if (F.is("sn_jiro_salvo")) L.push({ id: "sn_jiro", at: [8, 6] }); return L; },
        intro: [["voce", "La collina sopra Sasso Nero. Dopo la pioggia, l'erba è così verde che fa male agli occhi. Sotto, le risaie riflettono il cielo."], ["voce", "Sotto il ciliegio, il vecchio Gisaku aspetta. Ha portato il tè. È freddo."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t"); put(14, 21, "q"); put(15, 21, "q");
          lay(14, 6, 15, 20, ":"); lay(10, 18, 19, 18, ":"); lay(12, 4, 17, 6, ";"); put(14, 6, ";"); put(15, 6, ";");
          // le terrazze di riso sotto la collina, allagate per il riso nuovo, e i boschetti sul crinale
          lay(1, 19, 11, 20, "R"); lay(18, 19, 28, 20, "R"); lay(1, 1, 7, 1, "t"); lay(22, 1, 28, 1, "t"); lay(1, 2, 2, 6, "t"); lay(27, 2, 28, 6, "t");
          [[13, 12], [16, 12], [13, 16], [16, 16]].forEach(([x, y]) => put(x, y, "E"));
          put(15, 5, "S"); put(14, 5, "S");
          Object.keys(GRAVE).forEach((id) => { if (F.is("sn_morto_" + id)) put(GRAVE[id][0], GRAVE[id][1], "n"); });
          put(11, 7, "E"); put(19, 7, "E"); put(8, 18, "b"); put(21, 18, "b");
          [[4, 3], [25, 3], [2, 10], [27, 11], [3, 17], [26, 17]].forEach(([x, y]) => put(x, y, "t")); [[6, 2], [23, 2], [2, 14], [27, 15]].forEach(([x, y]) => put(x, y, "r"));
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(); g.save();
          // petali che cadono dal ciliegio e il bagliore del sole dopo la pioggia
          for (let i = 0; i < 14; i++) { g.fillStyle = "rgba(251,207,232,.85)"; g.fillRect(d.X(9) + ((i * 53 + f * 0.5) % 200), d.Y(4) + ((i * 37 + f * 0.8) % 180), 2, 1.5); }
          g.fillStyle = `rgba(254,240,138,${0.06 + 0.02 * Math.sin(f / 50)})`; g.beginPath(); g.arc(d.X(15), d.Y(5), 90, 0, 7); g.fill();
          // la spada piantata su ogni tumulo
          Object.keys(GRAVE).forEach((id) => { if (!F.is("sn_morto_" + id)) return; const x = d.X(GRAVE[id][0]) + 8, y = d.Y(GRAVE[id][1]); g.fillStyle = "#cbd5e1"; g.fillRect(x - 0.5, y - 12, 1.5, 12); g.fillStyle = "#1c1917"; g.fillRect(x - 3, y - 12, 7, 1.5); });
          g.restore();
          H.plaque(g, "IL CILIEGIO", d.X(15), d.Y(4) - 6, "#f9a8d4"); H.plaque(g, "▼ SASSO NERO", d.X(15), d.Y(20) - 2, "#fde68a");
        }
      }
    };
    const obj = {
      "sn_tumuli:n": ({ tx, ty }) => {
        const id = Object.keys(GRAVE).find((k) => GRAVE[k][0] === tx && GRAVE[k][1] === ty);
        say("voce", id ? `Una spada piantata nella terra. Sull'elsa, un nome scritto col carbone: <b>${nm(id)}</b>. ${K.crew.members[id].role}.` : "Una spada piantata nella terra, senza nome."); done();
      }
    };
    return {
      n: N, title: "L'alba", sub: "La pioggia, il mantello rosso, il ciliegio sulla collina",
      goal, start: "sn_villaggio", introBg: "sn_alba", zones, talk, obj,
      intro: [["voce", "L'ultimo giorno comincia senza sole. Piove sulle risaie tagliate, sulle palizzate rotte, sulle spade."], ["voce", "Corvo Rosso scende dal passo con tutti quelli che gli restano. Davanti, lui."]]
    };
  }
  boot();
})();
