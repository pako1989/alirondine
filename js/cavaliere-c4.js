// js/cavaliere-c4.js - «IL CAVALIERE DEL FISCHIO» · Capitolo 4: Il Fischio nel Cimitero
// Il vecchio cimitero dei Tre Pali (lapidi, nebbia, ombre di ronda, tetto del mausoleo col rampino), il mausoleo, il Pierrot Bianco (Interrogatorio di livello 3) e quattro finali.
(function () {
  "use strict";
  function boot() {
    const E = window.__cavCore;
    if (!E || !E.api || !E.api.addChapter || !window.__cavH || !window.__interrogatorio) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__cavH(K), { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N), R = K.roof;
    H.people();
    ["cf_om1", "cf_om2"].forEach((id, i) => H.cast(id, "Ombra", "Uomo del Pierrot", { style: "short", hair: "#0b0b12", shirt: "#111827", skin: "#d9a679", bg: ["#0b0b12", "#6b7280"] }, "Un uomo vestito di nero che veglia le tombe per conto di qualcuno che non si fa vedere."));
    K.cos("cf_c4", { kind: "shirt", label: "Mantello della Notte", val: "#0b0b12", from: "Capitolo 4 di Il Cavaliere del Fischio" });
    K.lore("l_trepali", { t: "Il Cimitero dei Tre Pali", d: "Il vecchio cimitero degli arbitri e dei guardalinee. Ogni lapide ha un nome e un'ultima decisione contestata." });
    const prove = () => ["libro", "fischietto", "cartella"].filter((c) => K.dossier.has("fischio", c)).length;
    const carte = () => ["carta1", "carta2", "carta3", "carta4", "carta5", "carta6"].filter((c) => K.dossier.has("fischio", c)).length;
    const goal = (s) => ({
      0: "Parla con il Commissario Brandi, al cancello.",
      1: "Cerca la lapide con il fischietto scolpito, a est, tra le tombe (occhio alle ombre di ronda).",
      2: "Il portone del mausoleo, a nord, è aperto: entra e parla con il Pierrot.",
      3: "Il Pierrot ha parlato. Decidi il finale, parlando con lui.",
      4: "La storia si chiude."
    }[s] || "La storia è conclusa.");
    function ending(id, lines) {
      K.end(id); R.rest();
      const msg = K.reward("cf_c4", { coins: 160, cos: "cf_c4" });
      K.finishChapter(N, id);
      K.scene(lines.concat([["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Hai trovato un finale. Gli altri ti aspettano nel Taccuino.`]]), () => K.openMain(), "cf_cimitero");
    }
    function finale() {
      const doss = prove(), cs = carte(), tm = K.stat("timore");
      ask(`Il Pierrot ti guarda. Prove ${doss}/3 · Indovinelli ${cs}/6 · Timore ${tm}`, [
        { label: "👂 Ascoltalo fino alla fine e lascialo andare", sub: "Finale «Il Perdono di Ruggero»", big: true, cls: "hot", fn: () => ending("pieta", [
          ["cf_pierrot", "[triste] Dieci anni dentro una stanza bianca, con le stesse tre domande. Non volevo vendetta: volevo che qualcuno ascoltasse."],
          ["hero", "Ti ascolto. E ti lascio andare."],
          ["voce", "Quella notte parte una lettera anonima, senza francobollo, verso il Commissario. La Banca viene smascherata un mattino come un altro; la città non saprà mai chi ha firmato."],
          ["cf_brandi", "[felice] Alla fine, un fischio era solo un fischio."]]) },
        { label: "⚖️ Consegna il Pierrot e le prove al Commissario", sub: doss >= 3 ? "Finale «Il Verdetto della Legge»" : `Servono le 3 prove (ne hai ${doss})`, disabled: doss < 3, fn: () => ending("giustizia", [
          ["cf_brandi", "[serio] Il registro, la cartella, il fischietto. Con questi, Lucre non ha più un avvocato."],
          ["voce", F.get("cf_verdict") === "diffondi" ? "Il Libro Mastro è già su tutti i giornali: la procedura arriva dopo, ma arriva." : "Il Commissario apre il fascicolo, senza fretta e senza sconti. Lucre firma, per la prima volta, una cosa che non può rinegoziare."],
          ["cf_pierrot", "[triste] Mi chiederanno se ho rubato. Risponderò: sì, e non ho smesso di restituire."], ["voce", "Il Cavaliere resta un'ombra che non ha mai cercato la gloria."]]) },
        { label: "🕳️ Lascialo cadere nel buio", sub: tm >= 40 ? "Finale «L'Ombra che Cade»" : `Serve Timore 40 (hai ${tm})`, disabled: tm < 40, fn: () => ending("ombra", [
          ["voce", "Il Pierrot sorride, come se avesse sempre saputo. Poi scivola oltre l'orlo, e il buio non risponde."],
          ["voce", "Il Borgo non lo racconterà mai. Qualcuno smette di truccare le partite: per paura, non per scelta."],
          ["cf_fulgenzio", "[triste] Il rampino regge, signore. Ma lei, no."]]) },
        { label: "🃏 Sistema i sei indovinelli sul registro", sub: carte() >= 6 && K.dossier.has("fischio", "libro") ? "Finale segreto" : `Servono 6 indovinelli (ne hai ${cs}) e il Libro Mastro`, disabled: carte() < 6 || !K.dossier.has("fischio", "libro"), fn: () => ending("segreto", [
          ["voce", "Sei carte, sei frasi, un registro. Messe in fila, le iniziali dicono una parola sola: «Confessa»."],
          ["voce", "Quella sera, alla prima della stagione, Lucre sale sul palco e confessa davanti a tutta la Banca. Il silenzio dura quanto un respiro."],
          ["cf_pierrot", "[felice] Sapevo che avresti messo in fila anche quelle."], ["voce", "L'arbitro viene riabilitato e il fischietto d'oro torna in campo, a un fischio dalla verità."]]) },
        { label: "📂 Presenta il Dossier (verdetto)", sub: `${doss} prove`, fn: () => K.dossier.verdict("fischio", () => finale(), false, (id) => { F.set("cf_verdict", id); say("voce", id === "diffondi" ? "Hai scelto di diffondere il Libro Mastro: lo saprà tutta la città." : "Hai scelto di consegnare tutto al Commissario, con la procedura."); done(); }) },
        { label: "Non ancora", fn: done }
      ]);
    }
    const zones = {
      cf_cimitero: {
        region: "cimitero", name: "Il Cimitero dei Tre Pali", short: "Cimitero", sub: "Lapidi storte, nebbia bassa e un mausoleo con una lampada accesa", bg: "cf_cimitero", time: "notte", w: 36, h: 24, base: "n", start: [2, 20], sneakStart: [2, 20],
        itemCos: "cf_c4", items: [[5, 10], [26, 14], [12, 20], [33, 6]], hide: "h",
        areas: [[14, 3, 21, 7, "Il mausoleo"], [32, 11, 35, 17, "Il tetto della cappella"], [0, 3, 31, 21, "Le tombe dei Tre Pali"], [0, 0, 35, 23, "Il Cimitero dei Tre Pali"]],
        act: { X: "Leggi la lapide", H: "Lancia il rampino", G: "Guarda la gargolla", L: "Guarda il lampione", B: "Guarda la cassa", C: "Guarda il comignolo", U: "Guarda la statua" },
        flavor: { X: "«Qui riposa un guardalinee. Alzò la bandierina troppo tardi, e un giorno prima di sempre.»", G: "Una gargolla con il becco di un fischietto.", L: "Un lampione a gas, a metà tra il lutto e la nebbia.", B: "Una cassa di fiori finti: il cimitero, ogni tanto, si traveste da giardino.", C: "Un comignolo che non ha mai fumato.", U: "Un angelo con le ali di cemento e una benda sugli occhi." },
        objects: {
          "28,12": () => {
            if (K.dossier.has("fischio", "carta6")) { say("voce", "La lapide del fischietto. Il Jolly non c'è più."); return done(); }
            K.dossier.add("fischio", "carta6"); K.bond("timore", 2); K.learnLore("l_trepali");
            say("voce", "Sulla lapide, un fischietto scolpito e un nome cancellato a scalpello. Sotto la pietra, un Jolly: «Ogni lapide ha un nome. Una sola ha un fischietto». Il portone del mausoleo, a nord, è aperto.");
            if (S() === 1) { setStep(N, 2); quest("cf_c4", "Il Cavaliere del Fischio", "Entra nel mausoleo, a nord."); }
            done();
          },
          "31,14": () => R.hook(["cf_cimitero", 33, 14], { need: 30, text: "Rampino sul tetto della cappella: l'ancora tiene, la pietra no. Atterri sul coppo, con un pezzo di cielo in meno." }),
          "32,13": () => R.hook(["cf_cimitero", 30, 13], { text: "Rampino all'indietro. Il cimitero ti riaccoglie con l'umidità di sempre." }),
          "35,14": () => { if (K.inv.has("cf_batarang")) { say("voce", "La cassa è vuota: dentro, solo un po' di polvere."); return done(); } K.inv.give("cf_batarang"); say("voce", "In cima alla cappella, una cassa e un <b>Boomerang d'acciaio</b>, dimenticato da un ladro che non ci è salito mai più."); done(); }
        },
        doors: { "17,6": { to: "cf_mausoleo", at: [9, 9], locked: () => (S() >= 2 ? false : "Il portone del mausoleo è sigillato. Cerca la lapide col fischietto, tra le tombe.") } },
        npcs: () => [{ id: "cf_brandi", at: [4, 20], face: "right" },
          { id: "cf_om1", at: [3, 9], route: [[3, 9], [30, 9]], speed: 0.5, guard: { range: 5, cone: 0.55 } }, { id: "cf_om2", at: [30, 14], route: [[30, 14], [3, 14]], speed: 0.45, guard: { range: 5, cone: 0.55 } }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 23, "n"); lay(0, 0, 35, 2, "P"); lay(0, 22, 35, 23, "P"); lay(14, 3, 21, 6, "P"); put(17, 6, "q");
          [7, 12, 16].forEach((y) => [4, 7, 10, 13, 16, 19, 22, 25, 28].forEach((x) => { if (!(y === 7 && x >= 13 && x <= 22 && false)) put(x, y, "X"); }));
          lay(32, 11, 32, 17, "Z"); lay(33, 11, 35, 17, "r"); lay(33, 17, 35, 17, "Z"); put(31, 14, "H"); put(32, 13, "H"); put(35, 14, "B"); put(34, 12, "C");
          put(3, 4, "G"); put(30, 4, "G"); put(8, 20, "L"); put(24, 20, "L"); put(12, 4, "U"); put(23, 4, "U");
          put(2, 12, "h"); put(32, 8, "h"); put(18, 18, "h"); put(6, 18, "h"); put(26, 10, "h");
        },
        decor(g, cx, cy, d) { H.plaque(g, "TRE PALI", d.X(17) + 8, d.Y(2) + 4, "#e5e7eb"); H.plaque(g, "MAUSOLEO", d.X(17) + 8, d.Y(6) + 4, "#facc15"); }
      },
      cf_mausoleo: {
        interior: true, region: "cimitero", name: "Il Mausoleo", short: "Mausoleo", sub: "Marmo freddo, una lampada ad olio e un uomo in bianco", bg: "cf_cimitero", w: 18, h: 12, start: [9, 9], outside: ["cf_cimitero", 17, 7],
        act: { X: "Leggi la lapide", U: "Guarda la statua", Q: "Guarda la teca" },
        flavor: { X: "«R. Fischi. Radiato. Non morto.»", U: "Una statua di arbitro con le mani sul volto.", Q: "Una teca con un mazzo di palloni d'oro: un indovinello per ogni anno." },
        objects: {}, doors: {},
        npcs: () => [{ id: "cf_pierrot", at: [9, 4], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 11, "k"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 11, "a"); lay(17, 0, 17, 11, "a"); lay(0, 11, 17, 11, "a"); put(9, 11, "v");
          put(3, 3, "X"); put(14, 3, "X"); put(3, 7, "U"); put(14, 7, "U"); lay(6, 2, 7, 2, "Q"); lay(11, 2, 12, 2, "Q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "R. FISCHI", d.X(9) + 8, d.Y(1) + 4, "#e5e7eb"); }
      }
    };
    const talk = {
      cf_brandi() {
        if (K.rel.scene("cf_brandi")) return;
        const s = S();
        if (s === 0) {
          say("cf_brandi", "[serio] Il Cimitero dei Tre Pali. Il Pierrot lo conosce meglio di me: ci veniva ogni anno, nell'anniversario di un fischio.");
          say("cf_brandi", "L'ultimo indovinello dice «una sola lapide ha un fischietto»: è a est, tra le tombe. Attento alle ombre di ronda: non sono dei miei.");
          K.rel.add("cf_brandi", 2, true); setStep(N, 1); quest("cf_c4", "Il Cavaliere del Fischio", "Trova la lapide col fischietto, a est."); return done();
        }
        say("cf_brandi", s === 1 ? "A est, tra le tombe. Con calma." : "Io aspetto qui. Chiamo i miei quando serve."); done();
      },
      cf_pierrot() {
        if (K.rel.scene("cf_pierrot")) return;
        const s = S();
        if (s === 2) {
          say("cf_pierrot", "[furbo] Il Cavaliere. Sei arrivato per ultimo, come tutti i bravi detective. Ho lasciato sei indovinelli: ne hai risolti abbastanza per vedere la faccia sotto il trucco.");
          say("cf_pierrot", "Mi chiamo Ruggero Fischi. Ero un arbitro. Ora sono un nome cancellato a scalpello. Se vuoi la verità, devi strapparmela: da dieci anni la tengo stretta.");
          return H.play(3, "Il Pierrot Bianco", "Interrogatorio · Il Mausoleo", (r) => {
            if (r && r.win) {
              setStep(N, 3); K.bond("timore", 3); K.rel.add("cf_pierrot", 3, true); quest("cf_c4", "Il Cavaliere del Fischio", "Decidi il finale parlando con il Pierrot.");
              say("cf_pierrot", "[triste] Mi chiesero di fischiare un rigore che non c'era. Dissi di no. Il giorno dopo ero radiato; un mese dopo ero «malato». Ho rubato palloni per non rubare niente: ogni palloncino porta un indovinello, ogni indovinello porta qui.");
              say("voce", "Ora sai tutto quello che c'era da sapere. Quando sei pronto, parlagli di nuovo."); done();
            } else { say("cf_pierrot", "[freddo] Non ancora. Torna quando avrai ascoltato meglio."); done(); }
          });
        }
        if (s === 3) { say("cf_pierrot", "[serio] Ho detto quello che dovevo. Ora decidi tu cosa farne."); return finale(); }
        say("cf_pierrot", "Non è ancora il momento."); done();
      }
    };
    return {
      n: N, title: "Il Fischio nel Cimitero", sub: "Tombe, nebbia e una verità sepolta",
      goal, start: "cf_cimitero", introBg: "cf_cimitero", zones, talk, obj: {},
      intro: [["voce", "Il vecchio cimitero dei Tre Pali dorme sotto la nebbia. Un solo lume resta acceso, in cima al mausoleo."], ["cf_fulgenzio", "[triste] Mi dica soltanto che torna a cena, signore."]]
    };
  }
  boot();
})();
