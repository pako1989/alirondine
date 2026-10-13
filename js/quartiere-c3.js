// js/quartiere-c3.js - GLI STRAORDINARI DI QUARTIERE · Capitolo 3 «La partita del campetto»
// Domenica, al campetto di Ponterotto. Tutto il quartiere sugli spalti di cassette della frutta. La Squadra Calcestruzzo
// del Dottor Cemento contro gli Straordinari. Chi vince decide: parcheggio o campetto.
(function () {
  "use strict";
  function boot() { const D = window.__quartiere; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cast("sq_vicina", { acc: ["fiore"], name: "La signora Pina del terzo piano", tag: "gray", hair: "#c8c8c8", style: "bob", skin: "#f0d0b0", eye: "#3a3a3a", bg: ["#1e1432", "#ff5a8a"], shirt: "#ff5a8a" },
      "Vive al terzo piano da sessant'anni e sa tutto di tutti. Ha visto giocare al campetto tre generazioni. Tifa per chiunque abbia la maglia sporca di terra.");
    K.cos("sq_c3", { kind: "shirt", label: "Maglia della domenica al campetto", val: "#ffd23f", from: "Capitolo 3 di Gli Straordinari di Quartiere" });
    K.cos("sq_quartiere", { kind: "acc", label: "Fascia del quartiere", val: "fascia", from: "Finale «Tutto il quartiere in campo»" });
    K.cos("sq_maschere", { kind: "acc", label: "Maschera di tenda del salotto", val: "bandana", from: "Finale «Gli Straordinari restano segreti»" });
    K.cos("sq_cemento", { kind: "acc", label: "Casco del Dottor Cemento", val: "casco", from: "Finale «Il Dottor Cemento cambia idea»" });
    K.cos("sq_fumetto", { kind: "acc", label: "L'albo numero uno", val: "taccuino", from: "Finale segreto «L'albo numero uno»" });
    K.cos("sq_fumetti3", { kind: "acc", label: "Fumetto della domenica", val: "taccuino", from: "Trova il fumetto perduto del campetto" });
    const ITEMZ = ["sq_quartiere", "sq_cantiere", "sq_campetto"];
    function allComics() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const FORM = { gelo: ["ghiaccio", "vento", "fuoco"], ferro: ["elastico", "calamita", "fuoco"], misto: ["ghiaccio", "elastico", "calamita"] };
    const goal = (s) => ({
      0: "Domenica al campetto. Il Dottor Cemento è arrivato con la Squadra Calcestruzzo.",
      1: "Prima della partita, Nonna Ines vuole decidere la formazione.",
      2: "La partita del campetto. Il Dottor Cemento aspetta a centrocampo.",
      3: "Fischio finale. Tutto il quartiere è in campo. Nonna Ines ti cerca.",
    }[s] || "La saga è conclusa. Puoi rigiocarla per trovare gli altri finali.");
    const zones = {
      sq_campetto: {
        region: "quartiere", name: "Gli Straordinari di Quartiere · Il campetto", short: "Il campetto", sub: "La terra battuta, le cassette della frutta, tutto il quartiere", bg: "sq_campetto", time: "giorno", travel: [15, 19],
        w: 30, h: 22, start: [15, 19], itemCos: "sq_fumetti3", items: [[28, 1]],
        areas: [[3, 4, 26, 15, "Il campetto"], [0, 0, 29, 21, "Il campetto di Ponterotto"]],
        intro: [["voce", "Domenica, al campetto di Ponterotto. Gli spalti sono cassette della frutta impilate. Ci sono tutti: la signora Pina del terzo piano, il barista, i bambini del secondo piano, il gatto rosso della lavanderia."], ["voce", "Dall'altra parte, in fila, la Squadra Calcestruzzo: gilet gialli, scarpe antinfortunistiche, e il Dottor Cemento col casco da capitano."]],
        npcs: (s) => [{ id: "sq_ines", at: [9, 18] }, { id: "sq_brina", at: [12, 18] }, { id: "sq_soffio", at: [18, 18] }, { id: "sq_gommo", at: [21, 18] }, { id: "sq_scintilla", at: [24, 18] }, { id: "sq_vicina", at: [5, 19] }, ...(s <= 2 ? [{ id: "sq_cemento", at: s === 2 ? [15, 9] : [15, 3] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 0, 0, 21, "a"); lay(29, 0, 29, 21, "a"); lay(0, 21, 29, 21, "a");
          lay(1, 16, 28, 20, ":"); lay(3, 4, 26, 15, ","); put(3, 9, "Q"); put(25, 9, "Q");
          lay(1, 1, 27, 2, "u"); put(15, 2, ":"); put(28, 2, ":"); [[2, 17], [27, 17]].forEach(([x, y]) => put(x, y, "t")); put(15, 20, "s");
        },
      },
    };
    function formazione() {
      ask("sq_ines", "(Ha disegnato tre formazioni sulla lavagnetta.) Il Copione gioca sempre. Gli altri tre li scegliamo noi. Chi mettiamo in campo?", [
        { label: "Brina, Soffio, Scintilla", sub: "ghiaccio, vento, fuoco: bufera, tornado, vapore", fn: () => setForm("gelo") },
        { label: "Gommo, Nonna Ines, Scintilla", sub: "elastico, calamita, fuoco: fionda, pallone rovente, frusta", fn: () => setForm("ferro") },
        { label: "Brina, Gommo, Nonna Ines", sub: "ghiaccio, elastico, calamita: scivolo, ferro ghiacciato", fn: () => setForm("misto") },
      ], "sq_campetto");
      function setForm(k) { F.set("sq_form", k); setStep(N, 2); say([["sq_ines", "[felice] Formazione fatta. (Cancella la lavagnetta.) Il Dottor Cemento è a centrocampo. Andate."]]); }
    }
    function finale() {
      const f = FORM[F.get("sq_form", "gelo")] || FORM.gelo;
      K.combo({ title: "Combo di Squadra · La partita del campetto contro la Squadra Calcestruzzo", oppStyle: "pressing", minutes: 90, heroes: K.squadra(["scatto"].concat(f)),
        opp: { name: "Squadra Calcestruzzo", color: "#7a7a8a", players: [{ name: "Il Dottor Cemento", skin: "#e8d0c0", hair: "#8a8a8a" }, { name: "Betoniera" }, { name: "Il Capo dei Geometri" }], keeper: { name: "Il Pilastro" } },
        intro: `<p>La partita del campetto: chi vince decide. La Squadra Calcestruzzo fa <b>pressing</b> e mette muri. ${K.known().length} combo nel Libro: usale. Tutto il quartiere guarda.</p>`, winTitle: "IL CAMPETTO È SALVO!" }, (r) => {
        if (!r.win) return K.scene([["sq_cemento", "[pensa] (Guarda il quartiere sugli spalti di cassette.) Pareggio o sconfitta vostra… (Esita.) Il regolamento di Ponterotto dice che si rigioca? Non c'è un regolamento di Ponterotto. (Sospira.) Va bene: si rigioca."]], () => K.enterZone("sq_campetto"), "sq_campetto");
        setStep(N, 3); F.set("sq_vinta", true); bond("quartiere", 2);
        K.scene([["voce", "Fischio finale. La signora Pina del terzo piano lancia in aria la borsa della spesa. Il gatto rosso della lavanderia scappa sul fico. Ponterotto è in campo, tutto, in un abbraccio solo."], ["sq_cemento", "[sorpreso] (Si siede sulla terra battuta. Si sporca i pantaloni. Non gli importa.) Avete vinto voi. Il campetto resta."]], () => K.enterZone("sq_campetto"), "sq_finale");
      });
    }
    function endingAsk() {
      const opts = [];
      if (F.is("sq_volti")) opts.push({ label: "«Ponterotto, siamo noi!»", sub: "Tutto il quartiere in campo", big: true, fn: () => ending("quartiere") });
      if (F.is("sq_maschere") || !F.is("sq_volti")) opts.push({ label: "Sparite prima che vi riconoscano", sub: "Gli Straordinari restano segreti", big: true, fn: () => ending("maschere") });
      if (F.is("sq_cemento_ascoltato")) opts.push({ label: "«Dottore, un posto per sua madre lo troviamo insieme»", sub: "Il Dottor Cemento cambia idea", big: true, fn: () => ending("cemento") });
      if (allComics() && K.known().length >= 10 && !F.is("sq_lasciato")) opts.unshift({ label: "«Brina… cos'è quel quaderno a quadretti?»", sub: "Segreto: tutti i fumetti, dieci combo scoperte, nessuna partita lasciata", cls: "hot", big: true, fn: () => ending("fumetto") });
      ask("sq_ines", "(Un ferro da stiro le vola in mano, per abitudine.) Abbiamo vinto, ragazzo. Il campetto resta. (Guarda il quartiere, la squadra, il Dottore seduto per terra.) E adesso?", opts, "sq_finale");
    }
    function ending(kind) {
      const R = { quartiere: { coins: 140, cos: ["sq_c3", "sq_quartiere"] }, maschere: { coins: 140, cos: ["sq_c3", "sq_maschere"] }, cemento: { coins: 160, cos: ["sq_c3", "sq_cemento"] }, fumetto: { coins: 260, cos: ["sq_c3", "sq_fumetto"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        quartiere: [["sq_vicina", "[ride] (Dal terzo piano delle cassette.) Lo sapevo! La gelataia! L'idraulico! La Ines! Lo sapevo da sessant'anni che eravate strani!"], ["voce", "<b>FINALE · TUTTO IL QUARTIERE IN CAMPO.</b> La partita ricomincia, per gioco: novanta persone in campo, dai bambini alla signora Pina. Il parcheggio non si farà mai. Il campetto ha una targa nuova: «Campo degli Straordinari»."]],
        maschere: [["voce", "Quando Ponterotto si gira a cercarvi, sulla panchina ci sono solo cinque maschere fatte con le tende del salotto."], ["voce", "<b>FINALE · GLI STRAORDINARI RESTANO SEGRETI.</b> Il giornale di quartiere titola «Supereroi misteriosi salvano il campetto». Brina vende un gelato nuovo, il Misterioso. Gusto: segreto. Nessuno sospetta niente. Quasi nessuno."]],
        cemento: [["sq_cemento", "[pensa] (Si toglie il casco e lo appoggia sul dischetto del rigore.) Volevo solo un posto per la macchina di mia madre."], ["sq_gommo", "[felice] Il mio garage ha un posto libero. Coperto. Con il tubo dell'acqua nuovo."], ["voce", "<b>FINALE · IL DOTTOR CEMENTO CAMBIA IDEA.</b> La domenica dopo, la signora con la macchina rossa del 1974 parcheggia in un minuto. Il Dottore costruisce una tribuna di legno al campetto. Con le misure giuste, finalmente."]],
        fumetto: [["sq_brina", "[ride] (Tira fuori un quaderno a quadretti, pieno di disegni.) Vi ho disegnati tutti. Ogni combo, ogni corsa, ogni gol. Pure quando Gommo è rimasto incastrato nel cancello."], ["voce", "<b>FINALE SEGRETO · L'ALBO NUMERO UNO.</b> La copisteria di Ponterotto stampa centoventi copie di «Gli Straordinari di Quartiere, numero 1». Esaurito in un pomeriggio. Il Dottor Cemento ne compra tre: una per lui, due per sua madre."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "sq_finale");
    }
    const talk = {
      sq_cemento() {
        const s = S();
        if (s === 0) return K.scene([["sq_cemento", F.is("sq_scambio") ? "[pensa] Il quartiere doveva firmare lo scambio. Il quartiere non ha firmato. (Guarda gli spalti di cassette.) Il quartiere vuole una partita. Bene: partita. Chi vince decide." : "[arrabbiato] (Col casco da capitano.) Domenica, come promesso. La Squadra Calcestruzzo contro gli Straordinari. Chi vince decide: parcheggio o campetto."]], () => { setStep(N, 1); quest("sq_partita", "La partita del campetto", "Prima la formazione con Nonna Ines, poi il Dottor Cemento a centrocampo."); done(); }, "sq_campetto");
        if (s === 2) return ask("sq_cemento", "(A centrocampo, col pallone sotto il braccio.) Metri cubi contro supereroi. Vediamo chi regge.", [{ label: "Gioca la partita del campetto", sub: "Combo di Squadra · la finale", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "sq_campetto");
        return say([["sq_cemento", "Metri cubi."]]);
      },
      sq_ines() { const s = S(); if (s === 1) return formazione(); if (s === 3) return endingAsk(); return say([["sq_ines", s === 2 ? "Il Dottore è a centrocampo. (Un chiodo le vola in mano.) Il ferro dice che vinciamo." : "Il campetto. Ci ho giocato nel 1952. Ci giocherò anche oggi, se serve."]]); },
      sq_brina() { return say([["sq_brina", S() >= 3 ? "[felice] Gelato per tutti! Anche per il Dottore." : "Ho le mani freddissime. È l'emozione. O il gelato."]]); },
      sq_soffio() { return say([["sq_soffio", "[ride] Pfffff. (Il vento fa volare i cappelli di mezzo quartiere.)"]]); },
      sq_gommo() { return say([["sq_gommo", "Mi allungo fino alla porta, se serve. Ho fatto di peggio per un sifone."]]); },
      sq_scintilla() { return say([["sq_scintilla", "[felice] Dopo la partita, pizza. Comunque vada. Il forno sono io."]]); },
      sq_vicina() { return say([["sq_vicina", "[furbo] Ragazzo, io non so niente. Ma quella gelataia, quando passa, mi gela il basilico sul balcone. Dico solo questo."]]); },
    };
    return { n: N, title: "La partita del campetto", sub: "La formazione, la Squadra Calcestruzzo, il quartiere in campo", goal, start: "sq_campetto", introBg: "sq_campetto", zones, talk,
      intro: () => [["voce", "<b>GLI STRAORDINARI DI QUARTIERE</b> · numero 3. Domenica. Il campetto di Ponterotto non è mai stato così pieno. Nemmeno per la festa del patrono."]] };
  }
  boot();
})();
