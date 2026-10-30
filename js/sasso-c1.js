// js/sasso-c1.js - «SETTE PER SASSO NERO» · Capitolo 1: Il prezzo del riso
// Il vecchio Gisaku ti affida tre sacchi di riso e una palla da kemari: in città si comprano ronin affamati. Un bambino preso in ostaggio in un capanno,
// un vecchio stratega coi capelli rasati, un predone alla gogna, un'ombra che si fa pagare, una danzatrice e uno spadaccino che non ha mai perso.
// Al ritorno il villaggio si nasconde: per farlo uscire bisogna suonare il tamburo d'allarme. Zone: villaggio di Sasso Nero (34x24, la palizzata con
// quattro porte, risaie, granaio, campo da kemari), casa di Gisaku (12x9), città del castello (32x22), locanda delle Tre Lanterne (14x10), dojo (12x9).
// Espone window.__sassoZ: il villaggio e la casa di Gisaku, riusati dai capitoli successivi.
(function () {
  "use strict";
  window.__sassoZ = {
    villaggio(H, npcs, o) {
      o = o || {};
      return {
        region: o.region || "villaggio", name: "Sasso Nero", short: "Sasso Nero", sub: "Risaie, una palizzata, quattro porte e un granaio", bg: o.bg || "sn_villaggio", time: o.time || "giorno", w: 34, h: 24, base: "Q", start: o.start || [16, 18], travel: [16, 18],
        itemCos: o.itemCos, items: o.items || [],
        areas: [[14, 9, 19, 13, "Il granaio"], [3, 3, 11, 8, "La casa del vecchio Gisaku"], [22, 3, 30, 8, "Il mulino di Manzo"], [10, 14, 23, 20, "Il campo da kemari"], [14, 0, 19, 2, "La Porta Nord"], [31, 10, 33, 13, "La Porta Est"], [14, 21, 19, 23, "La Porta Sud"], [0, 10, 2, 13, "La Porta Ovest"], [0, 0, 33, 23, "Sasso Nero"]],
        act: Object.assign({ f: "Guarda la staccionata", q: "Vai in città", n: "Leggi il cartello", l: "Guarda la lanterna", b: "Siediti", u: "Guarda il banco", z: "Guarda i sacchi", s: "Riposa un momento", x: "Apri la cassa", t: "Guarda l'albero", w: "Guarda il fiume", r: "Guarda la roccia" }, o.act || {}),
        flavor: Object.assign({
          f: "La staccionata del villaggio: canne legate col fil di paglia. Tiene fuori le volpi. I predoni, meno.",
          n: "Un cartello scritto a mano: «SASSO NERO · 42 famiglie · 1 mulino · 0 samurai». Lo zero è stato aggiunto da poco.",
          l: "Una lanterna di carta appesa a un palo. Di notte la accende Shinobu, la figlia del mugnaio.", b: "Una panca di legno davanti a una casa. Ci si siede la sera a contare le stelle e i debiti.",
          u: "Il banco del mercato del villaggio: tre ravanelli, un cesto di uova e una zucca che nessuno vuole.", z: "Sacchi di paglia di riso, vuoti. Quelli pieni li tiene il granaio.", w: "Il fiume Kuro, nero di sabbia di ferro. Ci si specchia male, ma l'acqua è buona.", r: "Una roccia scura, levigata dalla pioggia. Dicono che dia il nome al villaggio. Dicono anche che porti sfortuna."
        }, o.flavor || {}),
        doors: Object.assign({ "33,11": { to: "sn_citta", at: [1, 11] }, "33,12": { to: "sn_citta", at: [1, 12] } }, o.doors || {}),
        npcs, intro: o.intro, onEnter: o.onEnter,
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(16, 0, 17, 0, ":"); lay(0, 23, 33, 23, "w"); lay(32, 0, 33, 22, "w"); lay(32, 11, 32, 12, ":"); put(33, 11, "q"); put(33, 12, "q");
          lay(0, 1, 1, 22, "R"); lay(0, 11, 1, 12, ":");
          // la staccionata con le quattro porte
          lay(2, 2, 31, 2, "f"); lay(2, 21, 31, 21, "f"); lay(2, 2, 2, 21, "f"); lay(31, 2, 31, 21, "f");
          lay(16, 1, 17, 2, ":"); lay(16, 21, 17, 22, ":"); lay(2, 11, 2, 12, ":"); lay(31, 11, 31, 12, ":"); lay(16, 3, 17, 20, ":"); lay(3, 11, 30, 12, ":");
          house(4, 3, 6, 4, { door: [6, 6], roof: "#a16207", wall: "#7c5a36", chimney: true, enter: { to: "sn_casa", at: [6, 7] } });
          house(23, 3, 5, 4, { door: [25, 6], roof: "#854d0e", wall: "#6f5030", enter: o.mulino || "Il mulino di Manzo. La porta è sbarrata dall'interno. Da dentro, qualcuno trattiene il respiro." });
          put(28, 4, "M"); put(29, 4, "w"); put(28, 5, "w"); put(29, 5, "w");
          house(14, 8, 6, 3, { door: [16, 10], roof: "#a16207", wall: "#5b4636", enter: o.granaio || "Il granaio comune. Dentro, il riso dell'anno scorso: poco, contato due volte, coperto di paglia." });
          house(4, 15, 4, 3, { door: [5, 17], roof: "#a16207", wall: "#7c5a36", enter: o.casa1 || "La casa di Rikichi. Una stuoia sola, una ciotola sola. Sul muro, un pettine da donna appeso a un chiodo." });
          house(25, 15, 4, 3, { door: [26, 17], roof: "#a16207", wall: "#6f5030", enter: o.casa2 || "Una casa di contadini. Dentro, tre bambini e una nonna contano chicchi di riso su una stuoia, a voce bassa." });
          house(10, 3, 3, 3, { door: [11, 5], roof: "#854d0e", wall: "#7c5a36", enter: "Una capanna degli attrezzi: zappe, rastrelli, una lancia di bambù storta." });
          // risaie dentro la palizzata, campo da kemari
          lay(4, 8, 11, 10, "R"); lay(22, 8, 29, 10, "R"); lay(4, 13, 10, 13, "R"); lay(23, 13, 29, 13, "R");
          [[11, 15], [22, 15], [11, 19], [22, 19]].forEach(([x, y]) => put(x, y, "K"));
          [[3, 4], [21, 4], [3, 19], [30, 19]].forEach(([x, y]) => put(x, y, "S"));
          [[13, 3], [20, 3], [13, 20], [20, 20], [3, 10], [30, 10], [3, 13], [30, 13]].forEach(([x, y]) => put(x, y, "l"));
          put(21, 11, "n"); put(8, 18, "b"); put(9, 18, "b"); put(24, 18, "u"); put(13, 7, "z"); put(28, 18, "s"); put(20, 7, "r");
          [[4, 22], [9, 22], [24, 22], [29, 22]].forEach(([x, y]) => put(x, y, "t"));
          (o.extra || []).forEach(([x, y, c]) => put(x, y, c));
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow();
          // fumo dal comignolo di Gisaku e le bandierine di carta sul campo da kemari
          g.save(); for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(214,211,209,${0.25 - i * 0.07})`; g.beginPath(); g.arc(d.X(8) + 4 + Math.sin(f / 30 + i) * 3, d.Y(3) - 6 - i * 6 - (f % 40) / 8, 3 + i, 0, 7); g.fill(); }
          for (let i = 0; i < 10; i++) { const x = d.X(12) + i * 15, y = d.Y(15) - 6 + Math.sin(f / 9 + i) * 1.5; g.fillStyle = ["#ef4444", "#fef3c7", "#22c55e"][i % 3]; g.fillRect(x, y, 4, 5); }
          g.restore();
          H.plaque(g, "CASA DI GISAKU", d.X(7), d.Y(3) - 4, "#fde68a"); H.plaque(g, "MULINO", d.X(25) + 8, d.Y(3) - 4, "#fde68a"); H.plaque(g, "GRANAIO", d.X(17), d.Y(8) - 4, "#facc15"); H.plaque(g, "CITTÀ ▸", d.X(32) + 8, d.Y(10) - 4, "#93c5fd"); H.plaque(g, "KEMARI", d.X(16) + 8, d.Y(14), "#fca5a5");
          if (o.decor) o.decor(g, cx, cy, d, f);
        }
      };
    },
    casa(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "casa", name: "La casa del vecchio Gisaku", short: "Casa di Gisaku", sub: "Un focolare nel pavimento, tre sacchi di riso, settant'anni di raccolti", bg: "sn_casa", w: 12, h: 9, start: [6, 7], outside: ["sn_villaggio", 6, 7], base: "Y",
        act: { H: "Guarda il focolare", D: "Guarda la credenza", W: "Guarda lo shoji", B: "Guarda il futon", T: "Guarda il tavolino", z: "Guarda i sacchi", L: "Guarda la mensola" },
        flavor: Object.assign({ H: "L'irori, il focolare scavato nel pavimento. Il bollitore borbotta come un vecchio che ha ragione.", D: "Una credenza con le ciotole di tutta la famiglia. Le ciotole sono sei. La famiglia, adesso, è uno.", W: "Lo shoji di carta di riso. Fuori, l'ombra delle risaie piegata dal vento.", B: "Un futon arrotolato, con una coperta rattoppata in sette colori.", T: "Un tavolino basso con un rotolo: i nomi dei capifamiglia di Sasso Nero. Accanto a molti, un segno nero.", z: "Tre sacchi di riso. È tutto quello che il villaggio può pagare.", L: "Una mensola con una statuina di Jizō, il protettore dei bambini e dei viandanti. Ha un cappellino di paglia." }, o.flavor || {}),
        loot: o.loot || {}, npcs, intro: o.intro,
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 11, 8, "Y"); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 8, "a"); lay(11, 0, 11, 8, "a"); lay(0, 8, 11, 8, "a"); put(6, 8, "v");
          put(5, 4, "H"); put(6, 4, "H"); put(1, 2, "D"); put(8, 0, "W"); put(9, 0, "W"); put(3, 0, "W"); put(10, 6, "B"); put(10, 7, "B"); put(8, 3, "T"); put(1, 6, "z"); put(1, 7, "z"); put(5, 0, "L");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); g.fillStyle = `rgba(251,146,60,${0.12 + 0.05 * Math.sin(f / 5)})`; g.beginPath(); g.arc(d.X(6), d.Y(4) + 8, 40, 0, 7); g.fill(); g.restore(); H.plaque(g, "GISAKU", d.X(6), d.Y(0) + 6, "#fde68a"); }
      };
    }
  };

  function boot() {
    const E = window.__sassoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__sassoH || !window.__notte) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__sassoH(K), Z = window.__sassoZ, { say, done, ask, wask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("sn_c1", { kind: "acc", label: "Fascia da ronin", val: "fascia", from: "Capitolo 1 di Sette per Sasso Nero" });
    K.lore("l_sasso", { t: "Sasso Nero", d: "Villaggio di quarantadue famiglie sotto il passo del Corvo. Risaie a terrazze, un mulino, un campo da kemari. Ogni raccolto, i predoni scendono e prendono metà del riso. L'anno scorso, anche una donna." });
    K.lore("l_kemari", { t: "Il kemari", d: "Il gioco della palla di pelle di cervo: la si calcia in cerchio, fra quattro alberi, e non deve mai toccare terra. A Sasso Nero lo giocano tutti, dai bambini ai nonni. Dicono che chi sa tenere su la palla sa tenere su un villaggio." });
    K.lore("l_corvo", { t: "Corvo Rosso", d: "Capo dei predoni del passo: quaranta uomini a cavallo, un mantello rosso, una voce che non si alza mai. Prende metà del riso e lascia l'altra metà, «perché un campo vuoto non dà raccolti»." });

    const n = () => K.crew.count();
    const goal = (s) => ({
      0: "Parla col vecchio Gisaku, nella sua casa (in alto a sinistra, col comignolo che fuma).",
      1: "Vai in città (il ponte a est del villaggio): cerca un ronin che valga il riso. Gira voce di un capanno con un bambino preso in ostaggio.",
      2: `Trova altri compagni in città (${n()}/6, almeno 3 per tornare): la gogna del mercato, la locanda delle Tre Lanterne, il dojo. Sacchi di riso: ${K.stat("riso")}.`,
      3: `Torna a Sasso Nero (${n()} compagni). Rikichi ti aspetta alla Porta Est.`,
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");
    function check() { if (S() === 2 && n() >= 3) { setStep(N, 3); quest("sn_c1c", "Ritorno a Sasso Nero", "Hai abbastanza compagni per cominciare: torna al villaggio quando vuoi (in città puoi trovarne ancora)."); say("sn_kanbei", "[pensa] Tre lame. Quattro, contando la palla. Si può cominciare. Se trovi altri buoni, prendili: in città ne restano. Quando sei pronto, torniamo."); } }
    function fin() {
      setStep(N, 4); F.set("sn_c1_done", true);
      const m = K.reward("sn_c1", { coins: 90, cos: "sn_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["sn_kanbei", "[serio] Bene. Ora che ci hanno visto, ci conteranno. Quarantadue famiglie, e noi siamo pochi. Servono altri: sul passo, al tempio, nel bosco, alla fucina sul fiume."],
        ["sn_gisaku", "[felice] Sei samurai e il Campione col pallone. Sette. Il sette è un buon numero. Anche il sei era un buon numero, prima che lo dicessi."],
        ["voce", `<b>FINE DEL CAPITOLO 1 · «Il prezzo del riso»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 2 ti aspetta: il passo di montagna, un tempio, un bosco di bambù e un fabbro gigante."]
      ]), () => K.openMain(), "sn_villaggio");
    }
    // prezzo del ronin: se il riso non basta, si torna con altro
    const hire = (id, cost, txt) => { if (!H.hire(id, cost, txt)) { say("voce", `Ti servono ${cost} sacchi di riso. Ne hai ${K.stat("riso")}.`); return false; } check(); return true; };
    const full = () => n() >= 6;

    const talk = {
      sn_gisaku() {
        if (K.rel.scene("sn_gisaku")) return;
        const s = S();
        if (s === 0) {
          say("sn_gisaku", "[serio] Tu sei il ronin col pallone. Ti ho visto palleggiare sul ponte: tre ore, e la palla non ha mai toccato terra. Siediti.");
          say("sn_gisaku", "Fra trenta giorni il riso è maturo. Fra trentuno arrivano i predoni di Corvo Rosso. Quaranta uomini a cavallo. Prendono metà del raccolto. L'anno scorso hanno preso anche la moglie di Rikichi.");
          say("sn_gisaku", "[pensa] Ho un'idea, ed è vecchia come me: compriamo dei samurai. Samurai affamati. Non abbiamo soldi, abbiamo riso. Sei sacchi. Bastano per sei pance, se non sono pance troppo grandi.");
          say("sn_gisaku", "E tieni questa. È la palla da kemari di mio figlio. Lui non la usa più. Tu sì.");
          K.inv.give("sn_kemari"); K.learnLore("l_sasso"); K.learnLore("l_kemari");
          say("voce", "Ottieni la Palla da kemari. Nello zaino: i tuoi calci arrivano più lontano nell'Ultima Notte.");
          setStep(N, 1); quest("sn_c1", "Il prezzo del riso", "Vai in città, oltre il ponte a est: cerca dei ronin affamati.");
          return wask("«Allora? Sei sacchi di riso e un villaggio di contadini. Non è una paga da samurai.»", [
            { label: "🗡️ «Un samurai non chiede la paga. Chiede la causa.»", w: { onore: 1 }, fn: () => { say("sn_gisaku", "[ride] La causa! Bella parola. Qui la causa è il riso. Ma va bene, chiamala come vuoi."); done(); } },
            { label: "🌾 «Basta che i bambini mangino. Io mi arrangio.»", w: { pieta: 1 }, fn: () => { say("sn_gisaku", "[sorpreso] Ti arrangi. Un samurai che si arrangia. Allora forse sei davvero un ronin, e non un ladro travestito."); done(); } }
          ]);
        }
        say("sn_gisaku", s <= 2 ? "La città è oltre il ponte, a est. Non dire a nessuno che paghiamo in riso: ti ruberebbero i sacchi prima di sentire la proposta." : s === 3 ? "Sei tornato! Ma dove sono tutti? Ah. Si sono nascosti. Hanno paura dei samurai più che dei predoni. Parla con Rikichi." : "Sette. Va bene. Il riso li sfamerà, i samurai sfameranno il riso. È un cerchio, come il kemari."); done();
      },
      sn_rikichi() {
        if (K.rel.scene("sn_rikichi")) return;
        const s = S();
        if (s === 3) {
          say("sn_rikichi", "[arrabbiato] Sono tornati. Tu e i tuoi samurai. E guarda: il villaggio è vuoto. Si sono chiusi in casa. Manzo ha tagliato i capelli a sua figlia per farla sembrare un ragazzo, così i samurai non la guardano.");
          say("sn_kanbei", "[pensa] Hanno paura di noi più che dei predoni. Normale. Un predone ti prende il riso. Un samurai ti prende il riso e ti fa anche la predica.");
          return wask("Kanbei indica il tamburo d'allarme appeso alla Porta Est. «Lo sai cosa succede se lo suoni?»", [
            { label: "🗡️ Suoni il tamburo d'allarme", sub: "«I predoni! I predoni!»", big: true, w: { onore: 1 }, fn: () => { F.set("sn_tamburo", true); say("voce", "Bum. Bum. Bum. In un attimo ogni porta si spalanca: contadini con le zappe, nonne coi mestoli, bambini con le pentole in testa. Tutti corrono verso di te. Verso i samurai."); say("sn_kanbei", "[ride] Ecco. Adesso sanno chi chiamare, quando hanno paura."); say("sn_shinobu", "[arrabbiato] (Una ragazza coi capelli tagliati male ti guarda storto. Ha in mano un mestolo e l'aria di saperlo usare.)"); fin(); } },
            { label: "🌾 Palleggi in mezzo alla piazza e aspetti", sub: "Un bambino esce sempre per primo", big: true, w: { pieta: 1 }, fn: () => { F.set("sn_palleggio", true); say("voce", "Tiri fuori la palla da kemari. Uno, dieci, cento palleggi. Dopo un po' una porta si socchiude: un bambino. Poi un altro. Poi una nonna che dice «più in alto». Alla fine c'è mezzo villaggio intorno a te."); say("sn_kanbei", "[sorpreso] Più lento del tamburo. Ma questi non torneranno a casa arrabbiati."); say("sn_shinobu", "[felice] (Una ragazza coi capelli tagliati male ti ruba la palla e fa cinquanta palleggi di fila. Poi te la rende senza dire niente.)"); fin(); } }
          ]);
        }
        say("sn_rikichi", s <= 2 ? "[arrabbiato] I samurai. Quelli che bevono il sakè degli altri. Va', va' a cercarli. Io intanto affilo la zappa." : "[serio] Va bene. Siete qui. Domani vi mostro le porte. Quattro. Tutte storte."); done();
      },
      sn_kanbei() {
        if (K.rel.scene("sn_kanbei")) return;
        const s = S();
        if (s === 1 && K.inZone("sn_citta")) {
          say("voce", "Davanti al capanno del mercato c'è folla. Dentro, un ladro tiene un bambino con un coltello. Fuori, un ronin anziano si sta facendo rasare la testa da un monaco.");
          say("sn_kanbei", "[serio] Mi rasano per sembrare un monaco: un monaco porta il riso, e un ladro affamato apre sempre la porta al riso. Due onigiri e un'idea. L'idea è mia, gli onigiri del monaco.");
          say("sn_kanbei", "Tu hai una palla, vedo. Sai tirarla con precisione?");
          return wask("Il bambino piange, dentro il capanno. Kanbei ha in mano due onigiri e la testa lucida.", [
            { label: "🗡️ «Entro io con te dalla porta. Due è meglio di uno.»", big: true, w: { onore: 2 }, fn: () => { F.set("sn_ostaggio_porta", true); say("voce", "Kanbei entra con gli onigiri. Tu dietro, la palla sotto il braccio. Il ladro guarda il riso, poi te: un attimo di troppo. Kanbei è più veloce di quanto sembri. Il bambino corre fuori, il ladro resta dentro."); fine(); } },
            { label: "🌾 «Calcio la palla contro la finestra di dietro: lui si gira, tu entri.»", big: true, w: { pieta: 2 }, fn: () => { F.set("sn_ostaggio_palla", true); say("voce", "Prendi la mira da trenta passi. La palla da kemari passa fra due bancarelle, sopra un cane e dentro la finestrella di dietro. Il ladro si gira. Kanbei entra. Il bambino esce in braccio a lui, con la palla."); say("sn_kanbei", "[sorpreso] Trenta passi. Senza toccare il cane. Mi interessa, il tuo gioco."); fine(); } }
          ]);
        }
        say("sn_kanbei", s === 2 ? `[pensa] Contiamo: ${n()} lame. Ne servono sei, più te. Il riso è poco: scegli chi sa difendere una porta, non chi sa fare inchini.` : s === 3 ? "Al villaggio, quando vuoi. Se in città c'è ancora qualcuno di buono, prendilo: dopo sarà tardi." : "Conta i nemici, poi le porte, poi i compagni. Mai il contrario."); done();
        function fine() {
          K.crew.recruit("sn_kanbei"); K.rel.add("sn_kanbei", 3);
          say("sn_kanbei", "[serio] Il villaggio di Sasso Nero, dici. Quaranta predoni. Sei sacchi di riso. È una battaglia persa.");
          say("sn_kanbei", "[ride] Le uniche che ho combattuto. Vengo. Non pagarmi: il riso tienilo per gli altri. Io mangio poco, e i pensieri non costano.");
          say("voce", `Kanbei si unisce ai Sette. ${H.count()}`);
          setStep(N, 2); quest("sn_c1b", "Sei lame", "In città: la gogna del mercato, la locanda delle Tre Lanterne, il dojo.");
          done();
        }
      },
      sn_gonta() {
        if (K.rel.scene("sn_gonta")) return;
        const s = S();
        if (K.crew.has("sn_gonta")) { say("sn_gonta", "[ride] Libero, sazio e con una zappa in mano. Se mi vedesse mia madre, piangerebbe. Di sollievo o di vergogna, non lo so."); return done(); }
        if (s >= 2 && !full()) {
          say("sn_gonta", "[arrabbiato] Che guardi? Mai visto un uomo alla gogna? Mi hanno preso con un sacco di riso non mio. Il sacco era pieno di sassi. Mi hanno fregato due volte.");
          say("voce", "La guardia sbadiglia: «Due sacchi di multa e se lo porta via. Fosse per me, gliene darei uno per non vederlo più».");
          return wask("Gonta ha le mani grandi come zappe e una cicatrice a forma di corvo sul polso.", [
            { label: "🍚 Paghi la multa (2 sacchi di riso)", sub: `Ne hai ${K.stat("riso")}`, disabled: K.stat("riso") < 2, w: { pieta: 1 }, fn: () => { if (hire("sn_gonta", 2, `Gonta si strofina i polsi e ti segue. ${H.count()}`)) { K.rel.add("sn_gonta", 2); say("sn_gonta", "[sorpreso] Due sacchi. Per me. Nessuno ha mai speso niente per me, se non per farmi stare zitto."); } done(); } },
            { label: "🗡️ «Garantisco io per lui.» (alla guardia)", sub: "La tua parola di ronin al posto del riso", w: { onore: 1 }, fn: () => { F.set("sn_gonta_garante", true); if (hire("sn_gonta", 0, `La guardia ci pensa, sputa, apre la gogna. Gonta ti segue. ${H.count()}`)) { say("sn_gonta", "[pensa] La tua parola. Adesso se sbaglio io, paghi tu. È un bel guinzaglio, ronin. Quasi mi piace."); K.F.set("sn_corvo_polso", true); } done(); } },
            { label: "◂ Lascialo dov'è", fn: done }
          ]);
        }
        say("sn_gonta", full() ? "Sei già pieno, eh? Va bene. Io resto qui, alla gogna. È comoda, se non ti muovi." : "[arrabbiato] Passa oltre, ronin. Qui non c'è niente da vedere. Solo un uomo e un pezzo di legno."); done();
      },
      sn_ren() {
        if (K.rel.scene("sn_ren")) return;
        const s = S();
        if (K.crew.has("sn_ren")) { say("sn_ren", "[furbo] Pagato in anticipo, servo fino alla fine. È il mio unico principio. Ne ho anche altri, ma costano a parte."); return done(); }
        if (s >= 2 && !full()) {
          say("sn_ren", "[furbo] Un villaggio di contadini, quaranta predoni e sei sacchi di riso. Ti hanno raccontato la barzelletta più vecchia della provincia, ronin.");
          say("sn_ren", "Io lancio coltelli, apro porte chiuse e sento i cavalli arrivare un'ora prima degli altri. Tre sacchi. Pagati adesso. Per chi lavoravo prima non te lo dico: non mi pagano per dirlo.");
          return ask("Ren gioca a dadi da solo, e vince sempre.", [
            { label: "🍚 Paghi (3 sacchi di riso)", sub: `Ne hai ${K.stat("riso")}`, disabled: K.stat("riso") < 3, fn: () => { if (hire("sn_ren", 3, `Ren intasca il riso con un inchino perfetto. ${H.count()}`)) { F.set("sn_ren_pagato", true); say("sn_ren", "[furbo] Affare fatto. Ricordati: io sono fedele al riso. Se il riso cambia padrone, mi cerchi e mi trovi. Forse."); } done(); } },
            { label: "◂ Forse dopo", fn: () => { say("sn_ren", "Dopo costo di più. Il tempo è riso."); done(); } }
          ]);
        }
        say("sn_ren", full() ? "Siete al completo. Peccato, ero l'unico che sapeva contare fino a quaranta." : "[furbo] Ronin, non hai l'aria di chi paga. Torna quando avrai l'aria giusta."); done();
      },
      sn_yumi() {
        if (K.rel.scene("sn_yumi")) return;
        const s = S();
        if (K.crew.has("sn_yumi")) { say("sn_yumi", "[felice] Ho portato aghi, bende, erbe e un ventaglio. Il ventaglio serve a niente. Ma una donna deve avere qualcosa di inutile, se no impazzisce."); return done(); }
        if (s >= 2 && !full()) {
          if (!F.is("sn_yumi_aiuto")) {
            say("voce", "Al tavolino d'angolo, un samurai ubriaco tira il kimono a una danzatrice. «Balla, ho pagato». Lei sorride, ma la mano è sul ventaglio come su un coltello.");
            return wask("Il samurai ubriaco ha due spade e nessuna pazienza.", [
              { label: "🌾 Ti siedi fra loro e offri da bere al samurai", sub: "Lo distrai finché si addormenta", w: { pieta: 2 }, fn: () => { F.set("sn_yumi_aiuto", true); say("voce", "Un bicchiere, due, sei. Il samurai racconta la sua vita, piange sulla tua spalla e si addormenta sul tavolino. La danzatrice ti guarda con un sopracciglio alzato."); yumi(); } },
              { label: "🗡️ «Lasciala stare.» (con la mano sull'elsa)", sub: "Una parola sola, e lo guardi", w: { onore: 2 }, fn: () => { F.set("sn_yumi_aiuto", true); say("voce", "Il samurai si alza, barcolla, ti guarda. Guarda la palla da kemari che hai alla cintura. Si siede. Si riaddormenta. Era più stanco che cattivo."); yumi(); } }
            ]);
          }
          return yumi();
        }
        say("sn_yumi", full() ? "[pensa] Al completo? Allora vi auguro poche ferite. Se no, chiamatemi: non costo molto, ma faccio male mentre curo." : "Un ronin con un pallone. Ne ho visti di strani, ma tu vinci."); done();
        function yumi() {
          say("sn_yumi", "[furbo] Grazie, ronin. Ballo per tre signori e ne ho curati due: il terzo non lo nomino. Ho sentito del vostro villaggio. Ci sono feriti, in una guerra. Vengo gratis.");
          say("sn_yumi", "[serio] Una condizione: nessuno mi chiede di ballare. Mai.");
          hire("sn_yumi", 0, `Yumi chiude il ventaglio e prende la sua borsa di erbe. ${H.count()}`); K.rel.add("sn_yumi", 2); done();
        }
      },
      sn_hayate() {
        if (K.rel.scene("sn_hayate")) return;
        const s = S();
        if (K.crew.has("sn_hayate")) { say("sn_hayate", "[felice] Quaranta predoni! Ne voglio dieci. No, dodici. Kanbei dice che è un pensiero stupido. È un pensiero veloce, e io sono veloce."); return done(); }
        if (s >= 2 && !full() && K.inZone("sn_dojo")) {
          say("sn_hayate", "[arrabbiato] Tu! Il ronin col pallone! Al mercato dicono che hai preso un ladro con un calcio. Un calcio! La spada è l'anima del samurai, non il piede!");
          say("sn_hayate", "Duello. Spada di legno contro... quella cosa. Se vinco, mi porti al tuo villaggio come capitano. Se vinci tu, vengo come soldato. Ho diciannove anni e non ho mai perso.");
          return wask("Hayate impugna la spada di legno. Gli tremano le mani, ma non per paura: per fretta.", [
            { label: "🗡️ Accetti il duello", sub: "La palla contro la spada di legno", big: true, w: { onore: 2 }, fn: () => { F.set("sn_hayate_duello", true); say("voce", "Hayate attacca dritto. Tu calci la palla alla sua spada: la spada vola, la palla torna nelle tue mani. Hayate guarda la spada sul pavimento, poi te, poi la spada."); say("sn_hayate", "[sorpreso] Ho... perso. Ho perso! Era questa la sensazione? È orribile. Vengo. Come soldato. Insegnami quel calcio."); hire("sn_hayate", 0, `Hayate raccoglie la spada di legno e ti segue. ${H.count()}`); K.rel.add("sn_hayate", 3); done(); } },
            { label: "🌾 «Non duello con chi non ha mai perso. Vieni, e perderai coi predoni.»", sub: "Lo lasci venire senza combattere", big: true, w: { pieta: 2 }, fn: () => { F.set("sn_hayate_risparmiato", true); say("sn_hayate", "[arrabbiato] Coi predoni! Io non perderò coi predoni! Vengo, e te lo dimostro!"); say("sn_kanbei", "[ride] Ecco come si recluta un ragazzo: gli si dice che non ce la fa."); hire("sn_hayate", 0, `Hayate ti segue, offeso e felice. ${H.count()}`); K.rel.add("sn_hayate", 1); done(); } }
          ]);
        }
        say("sn_hayate", full() ? "[arrabbiato] Al completo? Senza di me? È un errore strategico, lo dico io." : "Il dojo è aperto a chi ha coraggio. E a chi ha i sandali puliti."); done();
      },
      sn_oste() {
        if (K.rel.scene("sn_oste")) return;
        say("sn_oste", S() <= 1 ? "Benvenuto alle Tre Lanterne! Accendo una lanterna per ogni cliente che paga. Stasera ne ho accese due. Una è la mia." : "Cerchi ronin? La città ne è piena: quello col ventaglio è una lei, quello coi dadi bara, e il ragazzo del dojo urla di notte. Scegli bene: costano tutti più di quanto valgono, tranne quelli che valgono più di quanto costano."); done();
      },
      sn_shinobu() {
        if (K.rel.scene("sn_shinobu")) return;
        say("sn_shinobu", "[arrabbiato] Mio padre dice che i samurai rubano le figlie. Io dico che le figlie sanno correre. E calciare."); done();
      },
      sn_manzo() {
        if (K.rel.scene("sn_manzo")) return;
        say("sn_manzo", "[arrabbiato] Samurai! Samurai nel villaggio! Mangeranno il nostro riso, berranno il nostro sakè e poi... e poi... Gisaku è vecchio e ha idee vecchie!"); done();
      }
    };

    const zones = {
      sn_villaggio: Z.villaggio(H, (s) => {
        const L = [];
        if (s <= 2) L.push({ id: "sn_rikichi", at: [26, 11] }, { id: "sn_manzo", at: [21, 5] }, { id: "sn_shinobu", at: [20, 17] });
        if (s === 3) L.push({ id: "sn_rikichi", at: [29, 12] }, { id: "sn_gisaku", at: [17, 14] });
        return L;
      }, {
        items: [[5, 19], [27, 20], [12, 6], [19, 16]], itemCos: "sn_c1",
        intro: [["voce", "Sasso Nero, sotto il passo del Corvo. Risaie a terrazze, una staccionata di canne, quarantadue famiglie e un granaio mezzo vuoto."], ["voce", "Il vecchio Gisaku ti ha mandato a chiamare. Dal comignolo della sua casa esce un fumo storto."]]
      }),
      sn_casa: Z.casa(H, (s) => s === 0 ? [{ id: "sn_gisaku", at: [4, 4] }] : s <= 2 ? [{ id: "sn_gisaku", at: [4, 4] }] : []),
      sn_citta: {
        region: "citta", name: "La città del castello", short: "Città", sub: "Botteghe, lanterne rosse, ronin in cerca di riso", bg: "sn_citta", time: "giorno", w: 32, h: 22, base: "Q", start: [2, 11], travel: [2, 11],
        items: [[8, 7], [28, 17], [16, 19], [24, 8]], itemCos: "sn_c1",
        areas: [[10, 1, 22, 5, "Il castello del signore"], [2, 14, 9, 19, "Il capanno del mercato"], [12, 12, 19, 16, "Il mercato"], [23, 12, 30, 17, "La locanda delle Tre Lanterne"], [23, 1, 30, 7, "Il dojo"], [0, 0, 31, 21, "La città del castello"]],
        act: { q: "Entra", u: "Guarda la bancarella", l: "Guarda la lanterna", n: "Leggi l'avviso", b: "Siediti", G: "Guarda le armi", I: "Guarda il torii", z: "Guarda le casse", s: "Riposa un momento", t: "Guarda l'albero", S: "Guarda il ciliegio", E: "Guarda la lanterna di pietra", J: "Guarda la gogna" },
        flavor: { u: "Una bancarella di riso, sakè e pesce secco. Il mercante guarda i ronin come si guardano le nuvole di pioggia.", l: "Una lanterna rossa davanti a una casa: qui c'è un ronin che cerca lavoro. Accanto, una lanterna spenta: qui c'è un ronin che ha mangiato.", n: "L'avviso del signore: «I ronin senza padrone non portino le spade in città dopo il tramonto». Sotto, a carboncino: «e le portino dopo il riso».", b: "Una panca davanti al tempio. Ci dormono i ronin che non hanno riso per la locanda.", G: "Una bottega di spade. Il fabbro ti guarda la palla da kemari e scuote la testa.", I: "Un piccolo torii rosso davanti a un santuario. Qualcuno ha lasciato un onigiri al dio. Il dio non l'ha ancora mangiato.", z: "Casse di sakè impilate. Sopra, un gatto dorme come se le avesse pagate.", t: "Un salice sul canale.", J: "La gogna del mercato: un'asse di legno con tre buchi. Ne è occupato uno, fino a poco fa." },
        doors: { "0,11": { to: "sn_villaggio", at: [32, 11] }, "0,12": { to: "sn_villaggio", at: [32, 12] } },
        npcs: (s) => {
          const L = [];
          if (!K.crew.has("sn_gonta")) L.push({ id: "sn_gonta", at: [14, 17] });
          if (s === 1) L.push({ id: "sn_kanbei", at: [5, 18] });
          return L;
        },
        intro: [["voce", "La città del castello: botteghe col tetto nero, lanterne rosse, il castello bianco del signore che guarda tutto dall'alto e non vede niente."], ["voce", "Davanti al capanno del mercato c'è folla. Qualcuno grida. Un bambino piange."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 21, 31, 21, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); put(0, 11, "q"); put(0, 12, "q");
          lay(1, 11, 30, 12, ":"); lay(15, 6, 16, 20, ":");
          // il castello in alto, con le mura
          lay(10, 1, 22, 4, "a"); house(13, 1, 6, 4, { door: [15, 4], roof: "#334155", wall: "#e5e7eb", chimney: false, enter: "La porta del castello. Due guardie con le lance ti guardano la palla. «Il signore non riceve ronin. Né palloni.»" });
          house(24, 1, 6, 5, { door: [26, 5], roof: "#1c1917", wall: "#a16207", enter: { to: "sn_dojo", at: [6, 7] } });
          house(2, 1, 6, 5, { door: [4, 5], roof: "#1c1917", wall: "#92400e", enter: "Una bottega di tè. La padrona ti versa una tazza «per il ronin col pallone, che ha fatto ridere mio nipote»." });
          house(24, 13, 6, 4, { door: [26, 16], roof: "#1c1917", wall: "#7c2d12", enter: { to: "sn_locanda", at: [7, 8] } });
          house(3, 14, 5, 3, { door: [5, 16], roof: "#57534e", wall: "#5b4636", enter: S() <= 1 ? "Il capanno del mercato. Dentro si sente un bambino piangere e un uomo che conta i secondi." : "Il capanno del mercato, vuoto. A terra, due onigiri mangiati a metà e un cappello di paglia." });
          house(8, 14, 4, 3, { door: [9, 16], roof: "#1c1917", wall: "#92400e", enter: "Una casa di mercanti. Dalla finestra, una donna conta monete e non alza la testa." });
          [[12, 13], [13, 13], [18, 13], [19, 13], [12, 15], [19, 15]].forEach(([x, y]) => put(x, y, "u")); put(14, 18, "J"); put(13, 18, "J");
          [[3, 9], [9, 9], [21, 9], [28, 9], [21, 14], [29, 18]].forEach(([x, y]) => put(x, y, "l")); put(20, 10, "n"); put(8, 19, "b"); put(9, 19, "b"); put(22, 18, "G"); put(23, 18, "G");
          put(11, 7, "I"); put(10, 7, "E"); put(12, 7, "E"); put(21, 17, "z"); put(28, 19, "s"); [[1, 2], [30, 9], [1, 19], [30, 20]].forEach(([x, y]) => put(x, y, "S")); lay(1, 20, 30, 20, "w"); put(15, 20, ":"); put(16, 20, ":");
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(); g.save();
          [[3, 9], [9, 9], [21, 9], [28, 9]].forEach(([x, y], i) => { g.fillStyle = `rgba(239,68,68,${0.15 + 0.06 * Math.sin(f / 8 + i)})`; g.beginPath(); g.arc(d.X(x) + 8, d.Y(y) + 4, 14, 0, 7); g.fill(); });
          g.restore();
          H.plaque(g, "CASTELLO", d.X(16), d.Y(1) - 4, "#e5e7eb"); H.plaque(g, "DOJO", d.X(27), d.Y(1) - 4, "#fde68a"); H.plaque(g, "TRE LANTERNE", d.X(27), d.Y(13) - 4, "#fca5a5"); H.plaque(g, "◂ SASSO NERO", d.X(1) + 8, d.Y(10) - 4, "#93c5fd"); H.plaque(g, "CAPANNO", d.X(5) + 8, d.Y(14) - 4, "#fde68a");
        }
      },
      sn_locanda: {
        interior: true, region: "casa", name: "Locanda delle Tre Lanterne", short: "Tre Lanterne", sub: "Sakè annacquato, dadi truccati e ronin che fingono di non avere fame", bg: "sn_locanda", w: 14, h: 10, start: [7, 8], outside: ["sn_citta", 26, 17], base: "Y",
        act: { T: "Guarda il tavolino", K: "Guarda il bancone", W: "Guarda lo shoji", D: "Guarda la credenza", l: "Guarda la lanterna", z: "Guarda le botti" },
        flavor: { T: "Un tavolino basso con due ciotole vuote e un dado. Il dado ha due sei.", W: "Lo shoji sul vicolo. Passa un'ombra con due spade e un ombrello rotto.", D: "La credenza della locandiera: piatti, fiaschi e un registro dei debiti più lungo di un rotolo sacro.", l: "Una lanterna di carta accesa. Sotto, a pennello: «chi paga, vede».", z: "Botti di sakè. Una ha il rubinetto che gocciola a tempo." },
        npcs: (s) => { const L = [{ id: "sn_oste", at: [3, 3] }]; if (!K.crew.has("sn_ren")) L.push({ id: "sn_ren", at: [10, 3] }); if (!K.crew.has("sn_yumi")) L.push({ id: "sn_yumi", at: [4, 6] }); return L; },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "Y"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(1, 1, 5, 1, "D"); put(8, 0, "W"); put(10, 0, "W"); [[10, 4], [11, 4], [3, 7], [4, 7], [9, 7], [10, 7]].forEach(([x, y]) => put(x, y, "T")); put(12, 1, "z"); put(12, 2, "z"); put(1, 4, "l"); put(12, 6, "l");
        },
        decor(g, cx, cy, d) { H.plaque(g, "TRE LANTERNE", d.X(7), d.Y(0) + 6, "#fca5a5"); }
      },
      sn_dojo: {
        interior: true, region: "casa", name: "Il dojo della città", short: "Dojo", sub: "Tatami consumato in due punti: dove si sta in piedi e dove si cade", bg: "sn_dojo", w: 12, h: 9, start: [6, 7], outside: ["sn_citta", 26, 6], base: "Y",
        act: { G: "Guarda le armi", W: "Guarda lo shoji", L: "Guarda il rotolo", D: "Guarda l'altare" },
        flavor: { G: "Spade di legno appese in ordine di lunghezza. Una è spezzata e incollata con la colla di riso.", W: "Lo shoji sul cortile. Fuori, un ciliegio che perde petali sul tatami.", L: "Il rotolo col carattere «Dō»: la via. Qualcuno ci ha disegnato sotto, piccolissimo, un pallone.", D: "Un piccolo altare con una spada vera, mai sfoderata. Accanto, un mazzo di fiori secchi." },
        npcs: () => (K.crew.has("sn_hayate") ? [] : [{ id: "sn_hayate", at: [6, 3] }]),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 11, 8, "Y"); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 8, "a"); lay(11, 0, 11, 8, "a"); lay(0, 8, 11, 8, "a"); put(6, 8, "v");
          lay(1, 1, 1, 6, "G"); lay(10, 1, 10, 6, "G"); put(5, 0, "L"); put(6, 0, "L"); put(3, 0, "W"); put(8, 0, "W"); put(6, 2, "D");
        },
        decor(g, cx, cy, d) { H.plaque(g, "DOJO", d.X(6), d.Y(0) + 6, "#fde68a"); }
      }
    };
    return {
      n: N, title: "Il prezzo del riso", sub: "Tre sacchi, una palla da kemari e una città piena di ronin affamati",
      goal, start: "sn_villaggio", introBg: "sn_villaggio", zones, talk, obj: {},
      intro: [["voce", "Primavera. Il riso è alto una spanna. Sul passo del Corvo, qualcuno ha visto fumo di bivacco."], ["voce", "Tu sei un ronin senza padrone, con una spada che non usi e una palla da kemari che non lasci mai."]]
    };
  }
  boot();
})();
