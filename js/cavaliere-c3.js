// js/cavaliere-c3.js - «IL CAVALIERE DEL FISCHIO» · Capitolo 3: Sipario e Cassaforte
// Il Teatro dell'Opera (rampino sul lampadario fino al palco), la Banca del Pallone con guardie di ronda, l'ufficio del Signor Lucre (Interrogatorio di livello 3) e il caveau.
(function () {
  "use strict";
  function boot() {
    const E = window.__cavCore;
    if (!E || !E.api || !E.api.addChapter || !window.__cavH || !window.__interrogatorio) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__cavH(K), { say, done } = H;
    const N = 3, S = () => K.stepOf(N), R = K.roof;
    H.people();
    ["cf_usc1", "cf_usc2", "cf_gd1", "cf_gd2", "cf_gd3"].forEach((id, i) => H.cast(id, i < 2 ? "Maschera" : "Guardia", i < 2 ? "Del Teatro" : "Della Banca", { style: "short", hair: "#1f2937", shirt: i < 2 ? "#7f1d1d" : "#0f172a", skin: "#d9a679", bg: i < 2 ? ["#450a0a", "#fecaca"] : ["#0f172a", "#94a3b8"] }, i < 2 ? "Un maschera che controlla i biglietti con molta più cura di quanta ne metta nel resto." : "Una guardia della Banca. Ha una pistola e un orario."));
    K.cos("cf_c3", { kind: "shirt", label: "Frac del Sipario", val: "#450a0a", from: "Capitolo 3 di Il Cavaliere del Fischio" });
    K.lore("l_banca", { t: "La Banca del Pallone", d: "Presta soldi alle società in difficoltà. A un certo punto le società in difficoltà hanno cominciato a perdere le partite giuste." });
    const goal = (s) => ({
      0: "Parla con la Diva, sul palco del Teatro.",
      1: "Raggiungi il palco di Lucre, a est, col rampino sul lampadario.",
      2: "Torna dalla Diva: ti aiuta a entrare in Banca.",
      3: "Entra nella Banca (porta a est dell'Opera) e raggiungi l'ufficio di Lucre, a est.",
      4: "Entra nel caveau (porta a est della Banca) con la chiave.",
      5: "Esci dal caveau e parla con il Commissario Brandi, nella hall."
    }[s] || "Il capitolo 3 è concluso.");
    function fin() {
      F.set("cf_c3_done", true); R.rest();
      K.reward("cf_c3", { coins: 130, cos: "cf_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", `<b>FINE DEL CAPITOLO 3.</b><br>🪝 Agilità ${K.stat("agilita")} · 👁 Timore ${K.stat("timore")} · Indovinelli ${["carta1", "carta2", "carta3", "carta4", "carta5", "carta6"].filter((c) => K.dossier.has("fischio", c)).length}/6`], ["voce", "Il Capitolo 4, «Il Fischio nel Cimitero», ti aspetta."]]), () => K.openMain(), "cf_banca");
    }
    const zones = {
      cf_opera: {
        region: "opera", name: "Teatro dell'Opera", short: "Opera", sub: "Velluto, ori e un lampadario grande come un'auto", bg: "cf_opera", time: "notte", w: 32, h: 22, base: "o", start: [2, 17], sneakStart: [2, 17],
        itemCos: "cf_c3", items: [[3, 6], [18, 8], [10, 17], [27, 16]], hide: "h",
        areas: [[2, 3, 21, 8, "Il palcoscenico"], [23, 3, 29, 8, "Il palco di Lucre"], [2, 11, 21, 18, "La platea"], [0, 0, 31, 21, "Il Teatro dell'Opera"]],
        act: { N: "Guarda il tendaggio", V: "Guarda la balaustra", S: "Guarda la poltrona", H: "Lancia il rampino", U: "Guarda la statua", Q: "Guarda il palco", B: "Guarda la cassa" },
        flavor: { N: "Un sipario pesante di velluto. Dietro, qualcuno ha dimenticato un cappello.", V: "La balaustra dell'orchestra. Il direttore, un secolo fa, ci è caduto sopra.", S: "Una poltrona di velluto consumata dal sedere di chi si è alzato prima della fine.", U: "Una statua dell'Opera, con la bocca aperta per l'eternità.", B: "Una cassa di scenografie: un albero di cartone e un ruscello di stagnola." },
        objects: {
          "22,6": () => R.hook(["cf_opera", 24, 6], { need: 35, text: "Rampino sul lampadario: il cavo vibra, lo scarto è netto. Atterri nel palco con il fiato mozzo." }),
          "22,5": () => R.hook(["cf_opera", 20, 5], { text: "Rampino all'indietro. Il palcoscenico, con le sue luci false, ti riaccoglie." }),
          "27,4": () => {
            if (K.dossier.has("fischio", "carta5")) { say("voce", "La cassa del Pierrot, ormai vuota."); return done(); }
            K.dossier.add("fischio", "carta5"); K.bond("agilita", 3);
            say("voce", "Nella cassa, un pallone d'oro e un Jolly: «Si applaude chi cade con grazia; chi cade davvero, non lo si vede». Il pallone ha inciso un nome: Lucre.");
            if (S() === 1) { setStep(N, 2); quest("cf_c3", "Il Cavaliere del Fischio", "Torna dalla Diva."); }
            done();
          },
          "28,7": () => {
            if (K.inv.has("cf_lente")) { say("voce", "Il palco di Lucre: velluto rosso e un posacenere di cristallo."); return done(); }
            K.inv.give("cf_lente"); say("voce", "Nel palco, un binocolo e un bigliettino: «Pagato in anticipo». Ottieni la <b>Lente del detective</b>."); done();
          }
        },
        doors: { "31,15": { to: "cf_banca", at: [2, 16], locked: () => (S() >= 3 ? false : "Il portone della Banca è chiuso. Prima parla con la Diva.") } },
        npcs: () => [{ id: "cf_diva", at: [10, 5], face: "down" },
          { id: "cf_usc1", at: [3, 11], route: [[3, 11], [19, 11]], speed: 0.5, guard: { range: 5, cone: 0.55 } }, { id: "cf_usc2", at: [3, 15], route: [[3, 15], [20, 15]], speed: 0.45, guard: { range: 5, cone: 0.55 } }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "o"); lay(0, 0, 31, 2, "P"); lay(0, 19, 31, 21, "P");
          lay(1, 3, 1, 8, "N"); lay(22, 3, 22, 9, "Z"); lay(23, 3, 29, 8, "c"); lay(23, 3, 29, 3, "P"); lay(23, 9, 31, 9, "Z"); lay(30, 3, 31, 8, "Z");
          put(22, 6, "H"); put(22, 5, "H"); put(27, 4, "B"); put(28, 7, "Q"); put(24, 8, "h");
          lay(3, 10, 8, 10, "V"); lay(13, 10, 18, 10, "V");
          lay(3, 13, 8, 13, "S"); lay(13, 13, 18, 13, "S"); lay(3, 17, 8, 17, "S"); lay(13, 17, 18, 17, "S");
          lay(26, 14, 30, 16, "o"); put(31, 15, "q"); put(4, 3, "U"); put(18, 3, "U");
          put(2, 14, "h"); put(20, 14, "h"); put(10, 18, "h"); put(12, 8, "h"); put(8, 12, "h");
        },
        decor(g, cx, cy, d) { H.plaque(g, "TEATRO DELL'OPERA", d.X(10) + 8, d.Y(2) + 4, "#facc15"); H.plaque(g, "PALCO 1", d.X(26) + 8, d.Y(3) + 4, "#fecaca"); }
      },
      cf_banca: {
        region: "banca", name: "La Banca del Pallone", short: "Banca", sub: "Marmi, sportelli dorati e guardie che sanno contare", bg: "cf_banca", time: "notte", w: 32, h: 22, base: "c", start: [2, 16], sneakStart: [2, 16],
        itemCos: "cf_c3", items: [[4, 6], [16, 18], [27, 10], [10, 11]], hide: "h",
        areas: [[0, 0, 31, 7, "Gli sportelli"], [0, 8, 31, 18, "La hall"], [0, 0, 31, 21, "La Banca del Pallone"]],
        act: { D: "Guarda lo sportello", Q: "Guarda la teca", U: "Guarda la statua", S: "Guarda la poltrona" },
        flavor: { D: "Uno sportello dorato con una targa: «Prestiti alle società in difficoltà». La difficoltà è la merce.", Q: "Una teca con una coppa vera e una pubblicità finta.", U: "Una statua del fondatore, con un pallone in una mano e un sacchetto di monete nell'altra.", S: "Una poltrona da attesa. L'attesa è a pagamento." },
        objects: {},
        doors: {
          "0,16": { to: "cf_opera", at: [30, 15] },
          "31,5": { to: "cf_ufficio", at: [8, 8], locked: () => (S() >= 3 ? false : "La porta dell'ufficio è chiusa.") },
          "31,12": { to: "cf_caveau", at: [7, 8], locked: () => (K.inv.has("cf_chiave") ? false : "Il caveau è blindato: serve la chiave di Lucre.") }
        },
        npcs: () => [{ id: "cf_gd1", at: [3, 8], route: [[3, 8], [28, 8]], speed: 0.5, guard: { range: 5, cone: 0.55 } }, { id: "cf_gd2", at: [14, 3], route: [[14, 3], [14, 18]], speed: 0.45, guard: { range: 5, cone: 0.55 } }, { id: "cf_gd3", at: [28, 13], route: [[28, 13], [3, 13]], speed: 0.5, guard: { range: 5, cone: 0.55 } }]
          .concat(S() >= 5 ? [{ id: "cf_brandi", at: [3, 16], face: "right" }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 21, "c"); lay(0, 0, 31, 2, "P"); lay(0, 19, 31, 21, "P");
          lay(5, 5, 12, 5, "D"); lay(19, 5, 26, 5, "D"); lay(5, 16, 8, 16, "Q"); lay(24, 16, 27, 16, "Q"); put(15, 4, "U"); put(30, 4, "S"); put(30, 7, "S");
          put(0, 16, "q"); put(31, 5, "q"); put(31, 12, "q"); lay(30, 4, 30, 6, "c"); lay(30, 11, 30, 13, "c");
          put(4, 9, "h"); put(16, 11, "h"); put(28, 10, "h"); put(10, 18, "h"); put(22, 18, "h"); put(14, 7, "h");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BANCA DEL PALLONE", d.X(16) + 8, d.Y(2) + 4, "#facc15"); }
      },
      cf_ufficio: {
        interior: true, region: "banca", name: "L'ufficio del Signor Lucre", short: "Ufficio", sub: "Una scrivania enorme, un camino spento e un quadro di un portiere", bg: "cf_banca", w: 16, h: 11, start: [8, 8], outside: ["cf_banca", 30, 5],
        act: { D: "Guarda la scrivania", Q: "Guarda la teca", S: "Guarda la poltrona", U: "Guarda la statua" },
        flavor: { D: "Sulla scrivania, un calendario di partite con i risultati scritti in anticipo. A matita.", Q: "Una teca con una medaglia d'oro: «Miglior banchiere dell'anno».", S: "Una poltrona di pelle che sa tutto.", U: "Un busto di Lucre di Lucre." },
        objects: {}, doors: {},
        npcs: () => [{ id: "cf_lucre", at: [8, 4], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "c"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(6, 2, 10, 2, "D"); put(2, 3, "Q"); put(13, 3, "Q"); put(2, 6, "S"); put(13, 6, "S"); put(1, 8, "U"); put(14, 8, "U");
        },
        decor(g, cx, cy, d) { H.plaque(g, "PRESIDENTE", d.X(8) + 8, d.Y(1) + 4, "#facc15"); }
      },
      cf_caveau: {
        interior: true, region: "banca", name: "Il caveau", short: "Caveau", sub: "Cassette numerate, aria fredda e un ticchettio lento", bg: "cf_banca", w: 14, h: 11, start: [7, 8], outside: ["cf_banca", 30, 12],
        act: { K: "Apri la cassaforte", Q: "Guarda la teca", D: "Guarda il banco", U: "Guarda la statua" },
        flavor: { Q: "Una teca con una vecchia targa: «A Ruggero Fischi, il fischio d'argento».", D: "Un banco con una lente d'ingrandimento e un registro vuoto.", U: "Una statua di un arbitro, con le mani coperte da un telo." },
        objects: {
          "6,2": () => {
            if (K.dossier.has("fischio", "libro")) { say("voce", "La cassaforte è vuota, ormai."); return done(); }
            K.dossier.add("fischio", "libro"); K.learnLore("l_banca");
            say("voce", "Il Libro Mastro: partite vendute, arbitri pagati, firme. Alla pagina di dieci anni fa, il nome di Ruggero Fischi con un tratto di penna sopra. Esci col registro sotto il mantello.");
            if (S() === 4) { setStep(N, 5); quest("cf_c3", "Il Cavaliere del Fischio", "Esci e parla con Brandi nella hall."); }
            done();
          },
          "7,2": () => { say("voce", "La seconda cassaforte è vuota. Qualcuno, di fretta, non l'ha richiusa."); done(); },
          "11,2": () => {
            if (K.dossier.has("fischio", "fischietto")) { say("voce", "La teca è vuota, ormai."); return done(); }
            K.dossier.add("fischio", "fischietto"); K.bond("timore", 3);
            say("voce", "Nella teca, un fischietto d'oro. Sul bordo, inciso a mano: «R. Fischi». Il tuo guanto lo sfiora e senti freddo."); done();
          }
        },
        doors: {}, npcs: () => [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 10, "k"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 10, "a"); lay(13, 0, 13, 10, "a"); lay(0, 10, 13, 10, "a"); put(7, 10, "v");
          put(6, 2, "K"); put(7, 2, "K"); put(2, 2, "Q"); put(11, 2, "Q"); lay(2, 6, 4, 6, "D"); put(12, 8, "U"); put(1, 8, "U");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CAVEAU", d.X(7) + 8, d.Y(1) + 4, "#e5e7eb"); }
      }
    };
    const talk = {
      cf_diva() {
        if (K.rel.scene("cf_diva")) return;
        const s = S();
        if (s === 0) {
          say("cf_diva", "[furbo] Il Cavaliere a teatro! Che ironia: tutti, qui, cercano un'entrata più elegante dell'ultima volta.");
          say("cf_diva", "Il Pierrot ha lasciato un pallone d'oro nel palco di Lucre, a est. Lui lo chiama «un omaggio». Il palco è sopra il vuoto: ci si arriva con il rampino sul lampadario, se hai un po' di Agilità.");
          say("cf_diva", "Prendi quello che c'è e torna. In cambio ti faccio entrare in Banca: ho un debito con l'unica persona che mi abbia mai chiesto di cantare piano.");
          K.rel.add("cf_diva", 2, true); setStep(N, 1); quest("cf_c3", "Il Cavaliere del Fischio", "Sali sul palco di Lucre col rampino."); return done();
        }
        if (s === 2) {
          say("cf_diva", "[sorpresa] Un pallone d'oro con il nome di Lucre. Il sospetto è bello quando si siede sul suo viso.");
          say("cf_diva", "Il portone della Banca è aperto. Dentro, tre guardie di ronda e un ufficio, a est. Lucre, stanotte, vuole essere lasciato in pace: non è una buona idea fargli compagnia.");
          K.inv.give("cf_fumogeno"); K.bond("agilita", 2); K.rel.add("cf_diva", 3, true); setStep(N, 3); quest("cf_c3", "Il Cavaliere del Fischio", "Entra in Banca e raggiungi l'ufficio di Lucre."); say("voce", "Ottieni un <b>Fumogeno</b>."); return done();
        }
        say("cf_diva", s === 1 ? "Il palco di Lucre, a est. Il lampadario non morde." : s >= 3 ? "Buona fortuna in Banca. Canta piano." : "Il sipario è calato."); done();
      },
      cf_lucre() {
        if (K.rel.scene("cf_lucre")) return;
        const s = S();
        if (s === 3) {
          say("cf_lucre", "[furbo] Il Cavaliere. Mi avevano detto che i miei guai avrebbero avuto un mantello. Non mi avevano detto che sarebbe passato dall'ufficio.");
          say("cf_lucre", "Ruggero Fischi? Un arbitro che non sapeva perdere. Ho un registro per ogni cosa, ma non uno per questo. Provi a farmelo dire.");
          return H.play(3, "Signor Lucre", "Interrogatorio · L'ufficio di Lucre", (r) => {
            if (r && r.win) {
              K.inv.give("cf_chiave"); K.bond("timore", 5); K.rel.add("cf_lucre", 2, true); setStep(N, 4); quest("cf_c3", "Il Cavaliere del Fischio", "Entra nel caveau, a est della hall.");
              say("cf_lucre", "[triste] Ho pagato io. Non per il Pierrot, per Ruggero. Dieci anni fa mi chiese di truccare una finale, e ho detto di sì: era più facile che dirgli di no. La chiave del caveau è nel cassetto.");
              say("voce", "Ottieni la <b>Chiave della Banca</b>: il caveau, a est della hall, si apre."); done();
            } else { say("cf_lucre", "[freddo] Ho finito. Le guardie le mostreranno l'uscita. Tornerà con domande migliori."); done(); }
          });
        }
        say("cf_lucre", s > 3 ? "Ho detto abbastanza. Il resto è nel caveau, se ha il coraggio." : "Non dovrebbe essere qui."); done();
      },
      cf_brandi() {
        if (K.rel.scene("cf_brandi")) return;
        const s = S();
        if (s === 5) {
          say("cf_brandi", "[serio] Il caveau, la chiave, il registro. Io non ho visto niente, e se qualcuno chiede ho visto tutto.");
          say("cf_brandi", "L'ultimo indovinello del Pierrot parla di un cimitero. Il vecchio cimitero dei Tre Pali, a nord: l'ultimo posto dove un arbitro può riposare in pace.");
          K.rel.add("cf_brandi", 2, true); return fin();
        }
        say("cf_brandi", "Il Borgo dorme. Io, no."); done();
      }
    };
    return {
      n: N, title: "Sipario e Cassaforte", sub: "Un teatro, una banca, un banchiere",
      goal, start: "cf_opera", introBg: "cf_opera", zones, talk, obj: {},
      intro: [["voce", "Il Teatro dell'Opera apre la prima di stasera. Gli applausi coprono tutto, anche i passi sui tetti."], ["cf_fulgenzio", "[serio] Si ricordi: l'uomo che si inchina per ultimo, è quasi sempre il primo a sapere."]]
    };
  }
  boot();
})();
