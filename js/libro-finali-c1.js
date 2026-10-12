// js/libro-finali-c1.js - IL LIBRO CHE MANGIAVA I FINALI · Capitolo 1 «C'era una volta un pallone» (acquerello)
// La fiaba dei Tre Porcellini ha perso il finale: il Lupo non sa più se è il cattivo, i Porcellini non sanno più se salvarsi.
// Parole: PONTE, LUCE, SOFFIO. Lettera dell'Autrice n. 1 nel bosco. Partita: Calcio d'azione 3 contro 3 sul campo di carta.
(function () {
  "use strict";
  function boot() {
    const LF = window.__libroFinali;
    if (!LF || !LF.addChapter) return setTimeout(boot, 120);
    LF.addChapter(chapter1);
  }
  function chapter1(X) {
    const { T, F, say, ask, narr, done, go, note, setStep, reward, hero, learn, knows, cheat, finishChapter } = X;
    const N = 1, S = () => X.stepOf(N);

    // ---------------------------------------------------------------- personaggi
    X.cast("lb_virgola", { name: "Virgola", tag: "", hair: "#c81e3a", style: "long", skin: "#f4ecd8", eye: "#3b3a4a", bg: ["#f4ecd8", "#c81e3a"], shirt: "#c81e3a" },
      "Il segnalibro del libro: un nastro di seta rossa che ha preso la forma di una ragazza di carta. Parla, fa una pausa, riparte: è fatta così. Conosce ogni pagina, perché ci ha dormito in mezzo.");
    X.cast("lb_narratore", { name: "Il Narratore", tag: "", hair: "#1a1a22", style: "slick", skin: "#b07a52", eye: "#e8c66a", shades: true, cap: "#1a1a22", bg: ["#1a1a22", "#e8c66a"], shirt: "#2a2838" },
      "La voce del libro. Profonda, calma, un po' teatrale. Racconta tutto quello che succede, anche quello che non succede. Nessuno l'ha mai visto in faccia: dice che i narratori non hanno faccia, hanno solo il tono.");
    X.cast("lb_lupo", { name: "Lupo", tag: "", hair: "#7a7f8a", style: "messy", skin: "#d9b38c", eye: "#e8c66a", beard: true, glasses: true, bg: ["#3b3a4a", "#8fb8d8"], shirt: "#4a5a7a" },
      "Il Sig. Lupo Gentiluomo, ala destra. Monocolo, panciotto, tè alla bergamotto. Da quando gli hanno mangiato il finale non sa più se è il cattivo della sua storia, e la cosa lo fa piangere nel tè.");
    X.cast("lb_mattone", { name: "Mattone", tag: "", hair: "#e8c46a", style: "buzz", skin: "#f2b8b0", eye: "#3b2a2a", bg: ["#c0644a", "#f2a5b8"], shirt: "#c0644a" },
      "Il terzo dei Tre Porcellini, quello della casa di mattoni. Capitano, regista, geometra. Ha un piano per tutto, e un piano di riserva per il piano.");
    X.cast("lb_paglia", { name: "Paglia", tag: "", hair: "#e8c46a", style: "messy", skin: "#f2b8b0", eye: "#3b2a2a", bg: ["#e8c46a", "#f2a5b8"], shirt: "#e8c46a" },
      "Il primo dei Tre Porcellini. La sua casa è di paglia e la sua difesa pure. Molto simpatico, molto veloce, molto spettinato.");
    X.cast("lb_legno", { name: "Legno", tag: "", hair: "#b98a5a", style: "codino", skin: "#efb0a8", eye: "#3b2a2a", bg: ["#b98a5a", "#f2a5b8"], shirt: "#b98a5a" },
      "Il secondo dei Tre Porcellini. Casa di legno, carattere di legno: tutto d'un pezzo. Porta un codino e un'opinione su ogni cosa.");
    X.cast("lb_nonna", { name: "Nonna Gomitolo", tag: "", hair: "#e6e0d0", style: "bun", skin: "#e8c4a0", eye: "#3b3a4a", glasses: true, bg: ["#8a6a9a", "#f2a5b8"], shirt: "#8a6a9a" },
      "Una nonna che abitava in un'altra fiaba, prima che le mangiassero l'ultima pagina. Adesso vive nel bosco e fa a maglia palloni di lana. Sono pessimi per giocare, ottimi per pensare.");
    X.cast("lb_autrice", { name: "L'Autrice", tag: "", hair: "#9a9a95", style: "bun", skin: "#e0b48a", eye: "#3b3a4a", glasses: true, bg: ["#3b3a4a", "#c9a7f2"], shirt: "#5a4a6a" },
      "Chi ha scritto il libro. Si firma soltanto «A.». Lascia lettere dove nessuno guarda.");
    X.cos("lb_c1", { kind: "shirt", label: "Maglia Acquerello", val: "#9cc081", from: "Completa il Capitolo 1 del Libro che Mangiava i Finali" });
    X.cos("lb_inchiostro", { kind: "hairc", label: "Capelli Inchiostro", val: "#2a2550", from: "Raccogli tutte le gocce d'inchiostro nella Radura della Prima Pagina" });
    X.cos("lb_petalo", { kind: "hairc", label: "Capelli Petalo", val: "#f2a5b8", from: "Raccogli tutte le gocce d'inchiostro nel Bosco del Lupo" });
    X.cos("lb_mattoni", { kind: "shirt", label: "Maglia dei Mattoni", val: "#c0644a", from: "Raccogli tutte le gocce d'inchiostro al Campo dei Tre Porcellini" });

    const goal = (s) => ({
      0: "Parla con Virgola, il segnalibro, in mezzo alla radura.",
      1: "Trova la parola PONTE nel prato fiorito a nord-ovest (avvicinati e premi «Raccogli la parola»).",
      2: "Scrivi PONTE sul fiume bianco, dove il sentiero si interrompe.",
      3: "Attraversa il ponte e prendi il sentiero verso est: il Bosco del Lupo.",
      4: "Trova il Sig. Lupo davanti alla sua casetta, nella radura a nord del sentiero.",
      5: !knows("luce") ? "Cerca la parola LUCE nell'albero cavo, a ovest nel bosco (Nonna Gomitolo sa dove)." : !F.is("wr_bosco_luce") ? "Scrivi LUCE sul sentiero buio a nord-est del bosco." : "Raccogli la parola SOFFIO, oltre il sentiero che hai illuminato.",
      6: "Riporta il SOFFIO al Sig. Lupo.",
      7: "Vai al Campo dei Tre Porcellini (uscita a est del bosco) e parla con Mattone.",
      8: "Parla con Mattone per cominciare la partita. (Il tabellone, intanto, ti guarda.)",
      9: "Decidi con Mattone e il Lupo il finale della fiaba.",
    }[s] || "Capitolo concluso. Parla con Virgola per voltare pagina, o cerca le gocce d'inchiostro rimaste.");

    // ---------------------------------------------------------------- disegni sopra la mappa (sagome ritagliate)
    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "italic 7px Georgia, serif"; const w = g.measureText(txt).width + 8; R(g, x - w / 2, y - 7, w, 10, "rgba(251,247,236,.92)"); R(g, x - w / 2, y + 2, w, 1, "rgba(59,58,74,.5)"); g.fillStyle = "#3b3a4a"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    function windmill(g, x, y, fr) { R(g, x - 3, y - 18, 7, 22, "#e8d6b0"); R(g, x - 4, y - 21, 9, 4, "#c0644a"); for (let i = 0; i < 4; i++) { const a = fr / 30 + i * Math.PI / 2; g.save(); g.translate(x, y - 18); g.rotate(a); R(g, 0, -1, 15, 3, "#fbf7ec"); g.strokeStyle = "rgba(59,58,74,.45)"; g.strokeRect(0, -1, 15, 3); g.restore(); } }
    function fallingLetters(g, fr, n, col) { g.font = "7px Georgia, serif"; g.fillStyle = col; const L = "ACEFILMNORSTUV"; for (let i = 0; i < n; i++) { const x = (i * 61 + Math.sin(fr / 60 + i) * 14) % 330 - 5, y = (i * 43 + fr * (0.2 + (i % 3) * 0.08)) % 210 - 5; g.fillText(L[i % L.length], x, y); } }
    function smoke(g, x, y, fr) { for (let i = 0; i < 4; i++) { const t = ((fr / 50 + i * 0.25) % 1); g.fillStyle = `rgba(240,240,250,${0.45 * (1 - t)})`; g.beginPath(); g.ellipse(x + Math.sin(t * 6 + i) * 4, y - t * 26, 3 + t * 5, 2 + t * 3, 0, 0, 7); g.fill(); } }

    // ---------------------------------------------------------------- luoghi
    const zones = {
      lb_radura: {
        name: "Il Libro · Radura della Prima Pagina", short: "La Radura della Prima Pagina", sub: "Dove comincia ogni storia", style: "acq", bg: "lb_radura",
        w: 36, h: 24, start: [4, 11], itemCos: "lb_inchiostro", items: [[3, 3], [12, 21], [24, 14], [32, 21]],
        words: { "8,4": "ponte" },
        writes: [{ id: "radura_ponte", need: "ponte", area: [20, 10, 21, 13], to: "=", prompt: "Il sentiero finisce contro un fiume di pagina bianca: qui la storia è stata mangiata. Cosa scrivi?",
          ok: [["voce", "Scrivi PONTE. Le lettere si allungano, si intrecciano, diventano assi di legno e corde. Il fiume bianco si lascia attraversare con l'aria di chi ha perso una discussione."], ["lb_virgola", "Visto? Le parole, qui dentro, pesano. Pesano proprio: ci puoi camminare sopra."]],
          then: () => { if (S() < 3) setStep(N, 3); done(); } }],
        areas: [[2, 2, 12, 7, "Il prato fiorito"], [19, 1, 22, 22, "Il fiume bianco"], [23, 1, 34, 22, "La riva delle prime righe"], [1, 8, 18, 22, "La Radura della Prima Pagina"]],
        act: { e: "Leggi la prima pagina", u: "Guarda nel pozzo", n: "Leggi il cartello", Z: "Guarda il mulino di carta", t: "Guarda l'albero", ">": "Verso il Bosco del Lupo" },
        flavor: {
          u: ["Il pozzo dei desideri. In fondo, invece dell'acqua, c'è inchiostro. Ti specchi: il tuo riflesso è disegnato un po' meglio di te.", "Butti dentro una monetina immaginaria. Dal fondo sale un «grazie» scritto in corsivo."],
          n: "Il cartello dice: «→ Bosco del Lupo. Attenzione: Lupo gentile. Non dargli da mangiare biscotti al burro, poi piange».",
          Z: ["Il mulino di carta gira quando lo guardi e si ferma quando ti volti. È timido.", "Sulla pala del mulino, a matita: «Questo mulino è di Mastro Rilegatore. Restituire a fine fiaba»."],
          t: ["Un albero dipinto ad acquerello. Le foglie colano un po' verso il basso, come se avessero pianto.", "Sulla corteccia qualcuno ha inciso: «Qui finiva la fiaba di Pollicino». Il resto è stato morsicato."],
        },
        intro: [["voce", "Atterri a pancia in giù su un prato morbido come carta assorbente. Il cielo è un acquerello che non si è ancora asciugato. Dall'alto cadono lettere, piano, come petali."], ["voce", "Il prato ha le righe. Sono righe di scrittura. Stai camminando su una pagina."]],
        npcs: (s) => [{ id: "lb_virgola", at: s >= 3 && F.is("wr_radura_ponte") ? [25, 10] : [11, 9] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 23, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          lay(2, 2, 12, 7, ";"); lay(1, 11, 34, 12, ":"); lay(24, 6, 32, 8, ";");
          lay(20, 1, 21, 22, "_");
          lay(19, 1, 19, 9, "h"); lay(19, 14, 19, 22, "h"); lay(22, 1, 22, 9, "h"); lay(22, 14, 22, 22, "h");
          [[3, 15], [5, 19], [9, 16], [13, 20], [16, 3], [15, 8], [25, 3], [30, 4], [33, 9], [26, 17], [31, 18], [24, 20], [33, 15], [2, 21], [16, 17]].forEach(([x, y]) => put(x, y, "t"));
          put(14, 17, "u"); put(17, 10, "n"); put(28, 7, "e"); put(5, 9, "Z");
          put(35, 11, ">"); put(35, 12, ">");
        },
        decor(g, cx, cy, d) {
          windmill(g, d.X(5) + 8, d.Y(9) + 12, d.fr * (S() >= 3 ? 2 : 1));
          plaque(g, "LA PRIMA PAGINA", d.X(28) + 8, d.Y(6) - 2);
          plaque(g, "↓ IL FIUME BIANCO ↓", d.X(21), d.Y(1) + 10);
        },
        top(g, cx, cy, d) { fallingLetters(g, d.fr, 14, "rgba(59,58,74,.28)"); },
      },

      lb_bosco: {
        name: "Il Libro · Bosco del Lupo", short: "Il Bosco del Lupo", sub: "Alberi ad acquerello e tè alla bergamotto", style: "acq", bg: "lb_bosco",
        w: 36, h: 26, start: [2, 12], itemCos: "lb_petalo", items: [[4, 8], [12, 10], [10, 21], [33, 4]],
        words: { "5,4": "luce", "31,2": "soffio" },
        writes: [
          { id: "bosco_luce", need: "luce", area: [28, 6, 29, 11], to: ":", prompt: "Un sentiero sparisce nel buio d'inchiostro: non si vede dove mettere i piedi. Cosa scrivi?",
            ok: [["voce", "Scrivi LUCE. Il buio si scioglie come zucchero nel tè: sotto c'era un sentiero di terra battuta, con le impronte di qualcuno che correva a perdifiato."], ["lb_virgola", "Impronte di lupo. Vanno verso la radura in alto. Qualcuno ha corso via di qui, tanto tempo fa."]],
            then: () => done() },
          { id: "bosco_lettera", need: "ponte", area: [31, 16, 31, 16], to: "=", when: () => true, prompt: "Un piccolo strappo bianco tra gli alberi. Di là si intravede una radura che non compare in nessuna pagina. Cosa scrivi?",
            ok: [["voce", "Scrivi PONTE. Un ponticello minuscolo, quasi un'idea di ponte, scavalca lo strappo. Di là c'è qualcosa che brilla."]], then: () => done() },
        ],
        letter: { at: [32, 20], n: 1, txt: "A chi legge. Se hai trovato questa lettera, vuol dire che guardi dove gli altri non guardano: bene, ci serve gente così. Ho scritto questo libro per leggerlo ad alta voce, la sera, in libreria. Ogni sera una fiaba, ogni fiaba con il suo finale. Poi, una sera, ho detto «torno subito». — A." },
        areas: [[11, 2, 24, 11, "La casetta del Lupo"], [3, 3, 9, 9, "L'albero cavo"], [26, 1, 33, 5, "La radura dei fiati perduti"], [3, 15, 12, 22, "Il cerchio dei funghi"], [30, 17, 33, 22, "Lo strappo nascosto"], [1, 12, 34, 13, "Il sentiero del bosco"]],
        act: { q: "Bussa alla casetta", b: "Guarda la panchina", p: "Guarda il fungo", x: "Guarda il cesto della Nonna", t: "Guarda l'albero", "<": "Torna alla Radura", ">": "Verso il Campo dei Porcellini", n: "Leggi il cartello" },
        flavor: {
          b: "Una panchina con una tazza di tè ancora calda. Accanto, un fazzoletto ricamato: «L. G.». È umido.",
          p: ["Un fungo rosso a pois. Ha l'aria di uno che sa delle cose e non le dice.", "Il fungo, quando lo tocchi, fa «puff». Una nuvola di lettere minuscole: «e vissero…». Poi niente."],
          x: "Il cesto di Nonna Gomitolo: palloni di lana di tutti i colori. Uno ha la forma di un punto interrogativo.",
          t: ["Un albero altissimo. In cima, un nido di virgole.", "Sulla corteccia: «Il Lupo è passato di qui alle 18:43». Qualcuno, sotto: «Non è vero, era in casa a stirare»."],
          n: "Cartello: «Proprietà del Sig. Lupo Gentiluomo. Si prega di bussare. Si prega di non soffiare (il Sig. Lupo è suscettibile)».",
        },
        intro: [["voce", "Il Bosco del Lupo, all'ora del tramonto. Gli alberi sono macchie d'acquerello che colano verso l'alto. Da qualche parte un bollitore fischia."]],
        npcs: (s) => {
          const o = [{ id: "lb_virgola", at: [24, 11] }, { id: "lb_nonna", at: [7, 18] }];
          if (s < 7 || !F.get("fin1")) o.push({ id: "lb_lupo", at: [19, 9] });
          return o;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 25, 35, 25, "a"); lay(0, 0, 0, 25, "a"); lay(35, 0, 35, 25, "a");
          lay(1, 1, 34, 24, "t");
          lay(1, 12, 34, 13, ":");
          lay(11, 2, 24, 11, ","); house(14, 3, 8, 5, { roof: "#8a3a2a", wall: "#c49a6a", wood: true, door: [17, 7, "q"], chim: 6 }); put(21, 9, "b"); lay(16, 8, 18, 11, ":");
          lay(3, 3, 9, 9, ";"); lay(6, 10, 6, 11, ":");
          lay(26, 1, 33, 5, ","); lay(28, 6, 29, 11, "z");
          lay(3, 15, 12, 22, ","); lay(7, 14, 8, 14, ":"); [[4, 16], [11, 16], [4, 21], [11, 21], [5, 15]].forEach(([x, y]) => put(x, y, "p")); put(8, 18, "x");
          lay(31, 14, 31, 15, ":"); put(31, 16, "_"); lay(30, 17, 33, 22, ";");
          put(13, 12, "n");
          put(0, 12, "<"); put(0, 13, "<"); put(35, 12, ">"); put(35, 13, ">");
        },
        decor(g, cx, cy, d) {
          smoke(g, d.X(20) + 8, d.Y(3) - 4, d.fr);
          plaque(g, "SIG. LUPO GENTILUOMO", d.X(18), d.Y(3) - 3);
          // lucciole tra gli alberi
          for (let i = 0; i < 14; i++) { const x = ((i * 89 + Math.sin(d.fr / 40 + i) * 18) % 330) - 5, y = ((i * 53 + Math.cos(d.fr / 50 + i) * 12) % 200); g.save(); g.globalCompositeOperation = "lighter"; X.glow(g, x, y, 5, "255,240,150", 0.25 + 0.2 * Math.sin(d.fr / 9 + i)); g.restore(); }
        },
        top(g, cx, cy, d) { g.fillStyle = "rgba(140,90,150,.10)"; g.fillRect(0, 0, 320, 200); },
      },

      lb_campo3p: {
        name: "Il Libro · Campo dei Tre Porcellini", short: "Il Campo dei Tre Porcellini", sub: "Tre case, un campo, un finale da decidere", style: "acq", bg: "lb_campo3p",
        w: 38, h: 26, start: [2, 12], itemCos: "lb_mattoni", items: [[2, 3], [36, 4], [20, 24], [3, 22]],
        areas: [[2, 1, 10, 7, "La casa di paglia"], [14, 1, 23, 7, "La casa di legno"], [27, 1, 36, 7, "La casa di mattoni"], [6, 11, 31, 20, "Il campo dei Porcellini"], [6, 22, 31, 23, "Le tribune"], [1, 8, 36, 10, "Il viale delle tre case"]],
        act: { q: "Bussa alla porta", P: "Guarda il tabellone", j: "Guarda le tribune", g: "Guarda la porta", l: "Guarda il lampione", "<": "Torna al Bosco" },
        flavor: {
          j: ["Sulle tribune, porcellini di carta con le sciarpe rosa. Uno ha uno striscione: «FORZA MATTONE, MA ANCHE NO SE PIOVE».", "Un tifoso porcellino ti saluta. Poi si accorge che sei della squadra avversaria. Poi ti saluta lo stesso: è educato."],
          g: "Una porta da calcio fatta di stuzzicadenti e buona volontà. La rete è una ragnatela, gentilmente prestata.",
          l: "Un lampione a candela. La fiamma si inchina quando passi.",
        },
        intro: [["voce", "Tre case in fila, come tre idee di casa: una di paglia, una di legno, una di mattoni. Davanti, un campo da calcio disegnato con il righello. Sulle tribune, un pubblico di porcellini di carta."]],
        npcs: (s) => {
          const o = [{ id: "lb_virgola", at: [3, 10] }, { id: "lb_mattone", at: [19, 13] }, { id: "lb_paglia", at: [11, 15] }, { id: "lb_legno", at: [26, 15] }];
          if (s >= 7) o.push({ id: "lb_lupo", at: [8, 9] });
          return o;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 37, 0, "a"); lay(0, 25, 37, 25, "a"); lay(0, 0, 0, 25, "a"); lay(37, 0, 37, 25, "a");
          house(3, 2, 7, 5, { roof: "#d9b04a", wall: "#e8c46a", straw: true, door: [6, 6, "q"] });
          house(15, 2, 8, 5, { roof: "#7a4a2a", wall: "#b98a5a", wood: true, door: [18, 6, "q"] });
          house(28, 2, 8, 5, { roof: "#8a3a2a", wall: "#c0644a", brick: true, door: [31, 6, "q"], chim: 6 });
          lay(1, 7, 36, 9, ":"); lay(6, 11, 31, 20, "-"); [14, 15, 16].forEach((y) => { put(5, y, "g"); put(32, y, "g"); });
          lay(6, 22, 31, 23, "j"); put(12, 9, "P"); put(2, 8, "l"); put(36, 8, "l");
          put(0, 12, "<"); put(0, 13, "<");
        },
        decor(g, cx, cy, d) {
          const x0 = d.X(6), y0 = d.Y(11), w = 26 * 16, h = 10 * 16;
          g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, w - 1, h - 1); g.beginPath(); g.moveTo(x0 + w / 2, y0); g.lineTo(x0 + w / 2, y0 + h); g.stroke(); g.beginPath(); g.arc(x0 + w / 2, y0 + h / 2, 20, 0, 7); g.stroke();
          plaque(g, "PAGLIA", d.X(6) + 8, d.Y(2) - 2); plaque(g, "LEGNO", d.X(19), d.Y(2) - 2); plaque(g, "MATTONE", d.X(32), d.Y(2) - 2);
          for (let i = 0; i < 22; i++) { const x = d.X(6 + i * 1.2) + 4, y = d.Y(10) + 6 + Math.sin(i) * 2; g.fillStyle = ["#f2a5b8", "#ffe28a", "#8fb8d8", "#c9a7f2"][i % 4]; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + 3, y); g.lineTo(x, y + 6); g.fill(); }
          smoke(g, d.X(34) + 8, d.Y(2) - 4, d.fr);
        },
        top(g, cx, cy, d) { },
      },
    };

    // ---------------------------------------------------------------- Virgola
    function virgola() {
      const s = S();
      if (s === 0) {
        return say([
          ["lb_virgola", "Oh. Oh! Sei caduto. Dalla parte giusta, per fortuna: dalla parte delle pagine."],
          ["lb_virgola", "Io sono Virgola. Il segnalibro. Quando un libro si chiude, io sto in mezzo, e aspetto. È un lavoro, aspettare: lo faccio molto bene."],
          ["hero", "Dove sono? Un minuto fa ero in una libreria, sotto la pioggia, con una partita domani mattina."],
          ["lb_virgola", "Sei dentro «Il Libro delle Partite che Finiscono Bene». O meglio, finivano. Qualcuno sta mangiando i finali. Uno a uno. Le fiabe arrivano all'ultima pagina, e l'ultima pagina… non c'è più."],
          ["lb_virgola", "Senza finale, una storia non sa più cosa diventare. Il Lupo non sa se è cattivo. La Regina non sa se perde. E i personaggi girano in tondo, sempre più pallidi, finché sbiadiscono."],
        ], () => narr("Non temere, {n}. Il colpevole ha un nome: il Gommapane, una creatura grigia e affamata che si nutre delle ultime righe. Io racconto, e tu lo fermerai.", () => say([
          ["lb_virgola", "Lui è il Narratore. Parla sempre. Anche quando nessuno gliel'ha chiesto. Soprattutto allora."],
          ["lb_virgola", "Senti, {n}: qui dentro le parole sono cose. Se trovi una parola, la puoi scrivere sulla pagina, e la pagina ti obbedisce. Ti presto il mio pennino."],
          ["voce", "Virgola ti mette in mano un pennino d'acciaio, sottile, ancora sporco d'inchiostro. Pesa più di quanto sembri."],
          ["lb_virgola", "Il fiume bianco, laggiù a est, è un pezzo di storia mangiato. Per attraversarlo serve un PONTE. Ho visto la parola svolazzare nel prato fiorito, a nord-ovest. Le parole stanno volentieri tra i fiori: si sentono capite."],
        ], () => { setStep(N, 1); note("Sono caduto dentro un libro. Virgola, il segnalibro, mi ha prestato il suo pennino."); done(); })));
      }
      if (s === 1) return say([["lb_virgola", "La parola PONTE è nel prato fiorito, a nord-ovest. Ti avvicini e la prendi. Le parole non mordono. Quasi mai."]]);
      if (s === 2) return say([["lb_virgola", "Hai la parola. Ora il fiume bianco: vai dove il sentiero si interrompe, guarda il bianco e scrivi. Il pennino sa cosa fare. Più o meno."]]);
      if (s >= 10) {
        return ask("lb_virgola", "«Il capitolo è finito. Le pagine dopo tremano: qualcosa ha morsicato anche loro. Voltiamo pagina?»", [
          { label: "📖 Volta pagina", sub: "Verso il Capitolo 2", cls: "hot", fn: () => { if (X.hasChapter(2) && X.mem().ch >= 2) X.continueStory(); else say([["lb_virgola", "Le pagine del capitolo dopo sono ancora in tipografia. Mastro Rilegatore dice «tra poco». Lo dice da un po'."]]); } },
          { label: "Due chiacchiere", sub: "Cosa pensa Virgola", fn: () => say([["lb_virgola", X.pick(["Sai cosa mi piace dei finali? Che dopo puoi ricominciare dall'inizio, e sai già che andrà tutto bene. È una cosa che rassicura.", "Ho dormito tra le pagine di questo libro per trentanove anni. Le conosco tutte. Quella dei Porcellini sa di paglia. Quella della Regina sa di colla.", "Il Narratore dice che il colpevole è il Gommapane. Il Narratore dice tante cose."])]]) },
        ]);
      }
      return ask("lb_virgola", "«Una pausa. Così. Poi ripartiamo.»", [
        { label: "Cosa devo fare?", sub: "Un consiglio senza giri di parole", fn: () => say([["lb_virgola", "Ecco cosa direi io: " + T(goal(S()))]]) },
        { label: "Chi è il Narratore?", sub: "La voce che racconta", fn: () => say([["lb_virgola", "È la voce del libro. C'è da sempre. Racconta benissimo: a volte anche quello che non succede. Se ti dice una cosa che non vedi, diglielo. Le note a margine servono a quello."]]) },
        { label: "Come funziona il pennino?", sub: "Parole e pagine bianche", fn: () => say([["lb_virgola", "Raccogli le parole che galleggiano. Poi, davanti a una pagina bianca o a un buio, scegli quale scrivere. Se sbagli parola non succede niente di male: la pagina ti guarda storto, tutto qui."], ["lb_virgola", "Le parole che trovi te le tieni. Servono anche dopo. Per cose che adesso non immagini."]]) },
      ]);
    }

    // ---------------------------------------------------------------- il Lupo
    function lupo() {
      const s = S();
      if (s < 4) return say([["lb_lupo", "Oh, un ospite. Mi scusi, non sono presentabile: ho pianto nel tè. Lei venga dal sentiero, quando ha finito con la radura, e parleremo da gentiluomini."]]);
      if (s === 4) {
        return say([
          ["voce", "Sulla panchina davanti alla casetta siede un lupo in panciotto, con un monocolo appannato e una tazza di tè tra le zampe. Si soffia il naso in un fazzoletto ricamato."],
          ["lb_lupo", "Lupo. Sig. Lupo Gentiluomo, ala destra, per servirla. Lei deve essere il campione caduto dal cielo. Si parla di lei in tutto il bosco: i funghi sono pettegoli."],
        ], () => narr("Il Lupo ghignò, crudele, mostrando le zanne al nuovo arrivato.", () => say([
          ["lb_lupo", "Il fatto è questo. Ogni sera, da sempre, arrivavo davanti alle tre case, soffiavo, e la storia andava come doveva andare. Io ero il cattivo. Era un lavoro onesto."],
          ["lb_lupo", "Poi una notte, l'ultima pagina è sparita. E con lei il mio soffio. Adesso arrivo davanti alle case, apro la bocca e… niente. Uno sbuffo di vapore da tè. I Porcellini mi guardano con pietà. Non c'è niente di peggio, per un lupo, che la pietà di un porcellino."],
          ["lb_lupo", "E non so più chi sono. Se non soffio, sono buono? Se sono buono, perché ho le zanne? Mi capisce?"],
          ["hero", "Più di quanto pensi. Anche a me, a volte, tolgono la partita a metà."],
          ["lb_lupo", "L'ultima volta che ho soffiato davvero, il fiato mi è volato via verso nord-est, oltre il sentiero buio. Là non vede niente nessuno. Neanche un lupo."],
          ["lb_virgola", "Per il buio ci vuole la parola LUCE. Nonna Gomitolo, nel cerchio dei funghi a sud-ovest, sa dove si nascondono le parole del bosco. Fa la maglia da cent'anni: sa dove va a finire ogni filo."],
        ], () => { setStep(N, 5); note("Il Lupo ha perso il suo SOFFIO insieme al finale. Serve LUCE per il sentiero buio."); done(); }), { id: "lupo_piange", say: "Non ghigna: sta piangendo nel tè.", note: "Il Narratore ha detto che il Lupo ghignava. Piangeva.", reply: [["lb_narratore", "…Un lupo che piange? Mai sentito. Sarà la luce. Proseguiamo."], ["lb_lupo", "Grazie. Nessuno mi difende mai dal Narratore. Lui mi racconta sempre peggio di come sono."]] }));
      }
      if (s === 5) return say([["lb_lupo", knows("luce") ? "Ha trovato la LUCE? Allora il sentiero buio, a nord-est, non le farà più paura. A me sì. Ma io sono suscettibile." : "Nonna Gomitolo, nel cerchio dei funghi a sud-ovest. Le porti i miei omaggi. E non accetti la sua torta: è di lana."]]);
      if (s === 6) {
        return say([
          ["voce", "Apri il pennino davanti al Lupo. La parola SOFFIO scivola fuori come un nastro e gli entra nel petto. Il monocolo gli si appanna di colpo."],
          ["lb_lupo", "Oh. Oh, sì. Lo sento. Mi scusi un istante."],
          ["voce", "Il Lupo si alza, prende fiato… e soffia. Tutte le foglie del bosco si girano dall'altra parte. Una ventata di lettere si alza dal prato. Il cappello di Virgola vola via, e lei non aveva un cappello."],
          ["lb_lupo", "Ah! Ah ah! Sono io! Ancora lupo! Grazie, grazie infinite, signor {n}."],
          ["lb_lupo", "E ora viene la parte difficile. I Porcellini mi hanno mandato un invito, molto cortese, scritto su carta da pacchi: vogliono decidere il finale della nostra fiaba con una partita. Loro tre contro di me. Ma io, da solo, non sono una squadra: sono un'ala destra in cerca di un centravanti."],
          ["lb_lupo", "Giocherebbe con me? Il campo è a est, oltre il bosco."],
        ], () => { setStep(N, 7); note("Il Lupo ha ritrovato il suo SOFFIO. Mi ha chiesto di giocare con lui contro i Tre Porcellini."); X.refreshZone(); done(); });
      }
      if (s === 7 || s === 8) return say([["lb_lupo", X.pick(["Mattone è il capitano: gli parli lei, io con lui ho un… passato. Un passato soffiato.", "Ho fatto stretching alle zanne. Si dice così? Ho fatto stretching.", "Se vinciamo, decidiamo noi il finale. Se perdiamo, lo decidono loro. Se pareggiamo, ci vorrà un tè."])]]);
      if (s >= 10) return say([["lb_lupo", F.get("fin1") === "riscritto" ? "Mi hanno dato una sciarpa rosa. Mi sta malissimo. Non me la tolgo più." : "Domani sera tornerò a soffiare. È la mia storia. Ma ogni tanto, quando nessuno guarda, porterò il tè a Mattone."]]);
      return say([["lb_lupo", "Il campo ci aspetta, signor {n}."]]);
    }

    // ---------------------------------------------------------------- Nonna Gomitolo
    function nonna() {
      const s = S();
      const opts = [
        { label: "Dove si nascondono le parole?", sub: "Il bosco ha i suoi segreti", fn: () => say([["lb_nonna", knows("luce") ? "La LUCE l'hai già presa, tesoro. Ora vai al sentiero buio, a nord-est, e scrivila lì. Il buio è come un gomitolo arruffato: gli basta un capo da cui cominciare." : "La LUCE? Sta nell'albero cavo, a ovest, quello con le foglie che gocciolano. Le parole luminose si nascondono sempre al buio. È il loro modo di fare le preziose."]]) },
        { label: "Chi era, prima?", sub: "La sua fiaba", fn: () => say([["lb_nonna", "Io? Ero la nonna di una fiaba con un cappuccio rosso e un bosco. Poi l'ultima pagina è sparita, e la bambina non è mai arrivata. Sono andata a cercarla, e mi sono trovata qui."], ["lb_nonna", "Non ti preoccupare per me. Le nonne aspettano benissimo. E intanto faccio palloni di lana per chi passa."]]) },
        { label: "Un pallone di lana?", sub: "Regalo della nonna", fn: () => { const msg = reward("lb_c1_nonna", { coins: 10 }); say([["voce", "Nonna Gomitolo ti regala un pallone di lana a righe. Rimbalza come un gatto offeso. Dentro, cucita, c'è una monetina."], ["voce", msg.length ? msg.join(" · ") : "Il pallone di lana ti fa compagnia. Le monete le hai già avute."]]); } },
      ];
      if (s >= 4 && s <= 5) opts.unshift({ label: "Il Lupo dice che lei sa dove trovare la LUCE", sub: "Per il sentiero buio", cls: "hot", fn: opts[0].fn });
      ask("lb_nonna", "«Siediti, siediti. Tieni questo capo del filo, così non mi scappa.»", opts);
    }

    // ---------------------------------------------------------------- i Porcellini
    function mattone() {
      const s = S();
      if (s < 7) return say([["lb_mattone", "Un forestiero! Benvenuto al campo. Se cerchi il Lupo, è nel bosco a piangere. Se cerchi una partita, aspetta: abbiamo un appuntamento con lui. Uno storico."]]);
      if (s === 7) {
        return say([
          ["lb_mattone", "Allora è lei la novità. Mattone, capitano, geometra, terzo di tre. Ho la casa di mattoni, quindi decido io: è una regola che mi sono dato da solo."],
          ["lb_paglia", "Ciao! Paglia! Primo di tre! Casa di paglia, ma la tengo pulitissima!"],
          ["lb_legno", "Legno. Secondo. Casa di legno. Non ho altro da aggiungere. Che è già qualcosa da aggiungere."],
          ["lb_mattone", "La faccenda è semplice. La nostra fiaba non ha più un finale. Il Lupo non soffia, le case non cadono, noi non scappiamo nella casa di mattoni. Stiamo tutti fermi davanti alla porta, la sera, come al cinema quando si rompe la pellicola."],
          ["lb_mattone", "Allora facciamo come fanno le persone civili: una partita. Chi vince decide come finisce la storia. Noi tre contro il Lupo e chi si porta."],
          ["lb_lupo", "Mi porto il signor {n}. E la signorina Virgola, in porta. Se non le dispiace."],
          ["lb_virgola", "Mi dispiace moltissimo. Lo faccio lo stesso."],
          ["lb_mattone", "Benissimo. Quando siete pronti, venite da me. Il tabellone è pronto da trentanove anni."],
        ], () => { setStep(N, 8); done(); });
      }
      if (s === 8) {
        return ask("lb_mattone", "«Il campo è disegnato, le porte sono di stuzzicadenti, il pubblico ha pagato il biglietto in ghiande. Si gioca?»", [
          { label: "⚡ Si gioca!", sub: "Calcio d'azione 3 contro 3 sul campo di carta · con il Lupo", cls: "hot", fn: playPorcellini },
          { label: "Un momento", sub: "Torna a esplorare", fn: done },
        ]);
      }
      if (s === 9) return chooseEnding();
      return say([["lb_mattone", F.get("fin1") === "riscritto" ? "Abbiamo trasformato le case in tribune. Il Lupo fa il guardalinee. Non ha mai sbandierato un fuorigioco: dice che non è da gentiluomini." : "Il Lupo ha soffiato. Paglia e Legno hanno dormito da me. Tutto come doveva essere. Strano: è bellissimo, ed è anche un po' triste."]]);
    }
    function paglia() { say([["lb_paglia", X.pick(S() >= 10 ? ["Ho ricostruito la casa! Di paglia! Mi piace la paglia, che problema c'è?", "La partita è stata bellissima. Ho corso tanto che mi si è spettinato anche il codino. E io non ho il codino."] : ["Io gioco in difesa. Cioè: corro avanti e indietro urlando «difesa!». Funziona circa una volta su tre.", "Mi piace il Lupo. Non dirlo a Mattone. Mattone dice che non si dice.", "Lo sapevi che la paglia rimbalza? Io sì. L'ho imparato in un modo che non ti racconto."])]]); }
    function legno() { say([["lb_legno", X.pick(S() >= 10 ? ["Il finale è deciso. Bene. Ora posso tornare a non avere opinioni. Scherzo: ne ho sei."] : ["Il Lupo ha un buon sinistro. Il destro, meno. Lo dico per correttezza.", "Ho letto il regolamento. Non c'è scritto niente sui soffi. Quindi valgono.", "Mattone ha un piano. Io ho un'opinione sul piano. Paglia ha fame."])]]); }

    // ---------------------------------------------------------------- la partita
    function playPorcellini() {
      X.playMatch({
        id: "lb_porcellini", alt: "az", azPitch: "carta", mate: "Lupo", squad: ["Virgola"], us: "La Squadra del Lupo", homeKit: ["#4a5a7a", "#f4ecd8"],
        chap: "Il Libro · Lupo e {n} contro i Tre Porcellini", bg: "lb_campo3p",
        venue: { ads: [["CASA DI MATTONI", "#c0644a"], ["TÈ DEL SIG. LUPO", "#4a5a7a"], ["PAGLIA & FIGLI", "#b8902a"], ["LEGNAMI LEGNO", "#8a5a3a"]], crowd: ["#f2a5b8", "#e8c46a", "#b98a5a", "#c0644a", "#fbf7ec"], ground: ["#93c47d", "#a2cf8b"], tint: "rgba(244,236,216,.14)", glow: "255,230,180", fx: { fr: 0.978 } },
        intro: "Sul campo di carta disegnato a righello, il Lupo, {n} e Virgola contro i Tre Porcellini. Chi vince decide il finale della fiaba.",
        oppNames: ["Mattone", "Paglia", "Legno", "Ricciolo", "Grugno"],
        team: (t, s) => ({ name: "I Tre Porcellini", vs: "i Tre Porcellini", color: "#f2a5b8", atk: t(s.tiro * 0.85), def: t(s.drib * 0.85), vel: t(s.tiro * 0.8), gk: ["Mattone", t(s.tiro * 0.95)] }),
        done: (r) => {
          if (r.win) {
            F.set("tab_lb_campo3p", `${r.a}:${r.b}`); setStep(N, 9);
            X.reward("lb_c1_match", { coins: 20 });
            return say([["voce", `Fischio finale: ${r.a} a ${r.b}. Il pubblico di carta applaude con le zampe. Paglia si sdraia sull'erba a forma di stella. Il tabellone, per la prima volta in trentanove anni, segna un risultato.`], ["lb_mattone", "Avete vinto voi. Allora il finale lo decidete voi. Però… posso dire una cosa, da geometra? Un finale si costruisce come una casa: deve reggere."]], chooseEnding);
          }
          say([["voce", `Fischio finale: ${r.a} a ${r.b}. I Porcellini fanno il trenino attorno al campo.`], ["lb_mattone", "Un finale deciso così, di misura, non regge. Rigiochiamo quando volete: il libro concede sempre un'altra pagina a chi la chiede."]]);
        },
      });
    }
    function tabellone() {
      const s = S();
      if (s !== 8) return say([["voce", s >= 9 ? `Il tabellone segna ${F.get("tab_lb_campo3p", "?:?")}. Le cifre brillano orgogliose, come se avessero giocato loro.` : "Il tabellone segna «?:?». Aspetta una partita da trentanove anni. Non ha fretta, ma neanche tanta pazienza."]]);
      ask("voce", "Il tabellone segna «?:?». Ti accorgi che c'è spazio per una parola. Il pennino, da solo, ti suggerisce una parola nuova, appiccicosa come il miele: VINTO.\nSe la scrivi, la partita sarà già finita. A vostro favore.", [
        { label: "✒ Scrivi VINTO", sub: "Salti la partita · il libro se lo ricorderà", fn: () => {
          cheat(); X.SFX.scribble(); F.set("tab_lb_campo3p", "1:0"); F.set("c1_vinto", true);
          if (!knows("vinto")) X.mem().words.push("vinto"); X.save();
          setStep(N, 9);
          say([["voce", "Scrivi VINTO. Le cifre del tabellone si girano da sole: 1 a 0. Il pubblico applaude, confuso. Nessuno ha visto il gol, ma eccolo lì."], ["lb_virgola", "…"], ["lb_virgola", "Funziona. Le parole funzionano sempre. È questo che fa un po' paura."], ["lb_mattone", "Mah. Se lo dice il tabellone… Allora il finale lo decidete voi."]], chooseEnding);
        } },
        { label: "No: si gioca", sub: "Il finale si guadagna", cls: "hot", fn: () => say([["voce", "Rimetti il cappuccio al pennino. Il tabellone sembra quasi sollevato."]]) },
      ]);
    }

    // ---------------------------------------------------------------- il finale della fiaba
    function chooseEnding() {
      say([
        ["voce", "Mattone, il Lupo, Paglia e Legno si mettono in cerchio attorno a te. Virgola apre il libro all'ultima pagina della fiaba: è bianca, con i bordi morsicati."],
        ["lb_virgola", "Ecco. Qui ci va il finale. Lo scrivi tu: hai vinto, è il tuo diritto. Ma pensaci bene. I finali restano."],
      ], () => ask("voce", "Come finisce la fiaba dei Tre Porcellini?", [
        { label: "«Il Lupo soffia. È la sua storia.»", sub: "Il finale vero, quello di sempre", fn: () => ending("vero") },
        { label: "«Nessuno soffia. Il Lupo resta con loro.»", sub: "Un finale riscritto, tutto nuovo", fn: () => ending("riscritto") },
      ]));
    }
    function ending(v) {
      F.set("fin1", v); setStep(N, 10);
      const a = v === "vero" ? [
        ["voce", "Scrivi: «E il Lupo soffiò». Le lettere si accendono. Il Lupo si inchina, prende fiato, e soffia: la casa di paglia vola via come un cappello, quella di legno si apre come un libro pop-up al contrario. La casa di mattoni resta in piedi."],
        ["lb_mattone", "Dentro! Tutti dentro, da me! Come da copione!"],
        ["lb_lupo", "Grazie, signor {n}. Un cattivo che sa di esserlo è un cattivo onesto. Domani sera tornerò a soffiare, e loro torneranno a salvarsi. E tutti sapranno cosa diventare."],
        ["voce", "Il Lupo si allontana nel bosco con il monocolo lucido. Poco prima di sparire si volta e fa l'occhiolino alla casa di mattoni. Da una finestra, Mattone risponde con un pollice."],
      ] : [
        ["voce", "Scrivi: «E il Lupo restò a cena». Le lettere ridono. Le case non cadono: si spostano piano sul bordo del campo e diventano tribune, con le finestre come palchi."],
        ["lb_paglia", "Una sciarpa! Ti abbiamo fatto una sciarpa rosa, Lupo! È di paglia! Gratta!"],
        ["lb_lupo", "È… la cosa più brutta che io abbia mai indossato. Non me la tolgo più."],
        ["lb_mattone", "Quarto porcellino onorario. L'ho deciso io: la casa di mattoni è mia, decido io. Però porta tu il tè."],
      ];
      say(a, () => narr("E così il Gommapane, il mostro che mangia i finali, fuggì terrorizzato da questa pagina, sconfitto dal coraggio di {n}.", () => say([
        ["lb_virgola", "Vieni a vedere una cosa. Qui, sul bordo della pagina."],
        ["voce", "Sul margine dell'ultima pagina c'è il segno del morso. Non è rotondo, come un morso di denti. È dritto. Netto. Con una piccola punta in fondo, come il taglio di un pennino."],
        ["lb_virgola", "Il Gommapane, dicono, ha la bocca tonda. Questo è un taglio dritto. Io… non lo so. Forse non è niente."],
        ["voce", "Poi, da un angolo dell'ultima pagina, una goccia d'inchiostro rosso scivola giù, verso il capitolo dopo. Là le pagine sono tutte bianche e nere, come incise nel legno. E c'è un castello fatto di carte da gioco."],
        ["lb_virgola", "La Regina di Picche. La sua fiaba finisce con una sola riga, l'unica che non hanno mangiato: «E nessuno la batté mai». Non mi è mai sembrata una bella frase."],
      ], () => {
        finishChapter(N, v);
        const msg = X.reward("lb_c1_done", { coins: 40, cos: "lb_c1" });
        note(v === "vero" ? "Ho scritto il finale vero dei Tre Porcellini: il Lupo soffia." : "Ho riscritto il finale dei Tre Porcellini: il Lupo resta con loro.");
        say([["voce", "Fine del Capitolo 1 · «C'era una volta un pallone». " + (msg.length ? msg.join(" · ") : "")], ["lb_virgola", "Quando vuoi voltare pagina, vieni da me."]]);
      }), { id: "gommapane_c1", say: "Qui non c'era nessun Gommapane.", note: "Il Narratore dice che il Gommapane è fuggito dai Porcellini. Non c'era.", reply: [["lb_narratore", "…Non l'hai visto perché era invisibile. Il Gommapane è molto bravo a essere invisibile. Proseguiamo, prego."], ["lb_virgola", "Invisibile. Certo. Come le cose che non ci sono."]] }));
    }

    // ---------------------------------------------------------------- oggetti
    const obj = {
      "lb_radura:>": () => { if (S() === 3) setStep(N, 4); go("lb_bosco", 2, 12); },
      "lb_radura:e": () => say([["voce", "La prima pagina del libro, aperta su un leggio di legno. In alto, con una lettera miniata: «C'era una volta un pallone che voleva finire in rete…»"], ["voce", "Leggi fino in fondo. L'ultima riga della pagina è stata morsicata via: rimane solo «…e da quel giorno, tutti».", "lb_radura"]], () =>
        narr("La prima pagina era intatta, perfetta, come il giorno in cui fu scritta.", done, { id: "pagina_morsa", say: "Manca l'ultima riga: è morsicata.", note: "La prima pagina, per il Narratore, era intatta. L'ultima riga era morsicata.", reply: [["lb_narratore", "Intatta… nei punti importanti. Un narratore riassume. È il mestiere."]] })),
      "lb_bosco:<": () => go("lb_radura", 33, 11),
      "lb_bosco:>": () => (S() >= 7 ? go("lb_campo3p", 2, 12) : say([["lb_virgola", "Il campo dei Porcellini è da quella parte. Ma prima il Lupo: senza di lui non c'è partita, e senza partita non c'è finale."]])),
      "lb_bosco:q": () => say([["voce", S() <= 4 ? "Bussi. Da dentro, una voce col naso chiuso: «Sono fuori! Sulla panchina! Mi scusi, sono anche dentro a piangere, è complicato»." : "Bussi. La casetta profuma di tè e di lana. Sul tavolo, un manuale: «Come essere cattivi senza offendere nessuno». È pieno di orecchie."]]),
      "lb_campo3p:<": () => go("lb_bosco", 33, 12),
      "lb_campo3p:P": tabellone,
      "lb_campo3p:q:6,6": () => say([["voce", "La porta della casa di paglia. Bussi e la porta si apre per il colpo. Dentro, un letto di paglia, una poltrona di paglia e un poster: «Paglia è per sempre»."]]),
      "lb_campo3p:q:18,6": () => say([["voce", "La casa di legno. Su una mensola, sei opinioni incorniciate. Sulla porta: «Bussare con rispetto. Il legno ricorda»."]]),
      "lb_campo3p:q:31,6": () => say([["voce", "La casa di mattoni. Sul campanello: «Mattone · geometra · capitano». Dentro, un plastico in scala della casa, e un plastico in scala del plastico."]]),
    };
    // quando raccogli una parola, la storia avanza
    function onWord(w) {
      if (w === "ponte" && S() < 2) { setStep(N, 2); return say([["lb_virgola", "PONTE! Brava parola. Ora portala al fiume bianco, dove il sentiero si interrompe, e scrivila."]]); }
      if (w === "luce") return say([["lb_virgola", "LUCE. È tiepida, eh? Le parole luminose scaldano le mani. Il sentiero buio è a nord-est, sopra il sentiero del bosco."]]);
      if (w === "soffio" && S() < 6) { setStep(N, 6); return say([["voce", "La parola SOFFIO ti scompiglia i capelli da sola, impaziente. Vuole tornare a casa: dal Lupo."]]); }
      done();
    }
    // segnalino «!» sui personaggi che hanno qualcosa di nuovo da dire
    function news(id, s) {
      if (id === "lb_virgola") return s === 0 || s >= 10;
      if (id === "lb_lupo") return s === 4 || s === 6;
      if (id === "lb_mattone") return s === 7 || s === 8 || s === 9;
      if (id === "lb_nonna") return s === 5 && !knows("luce");
      return false;
    }

    return {
      n: N, title: "C'era una volta un pallone", sub: "Acquerello · i Tre Porcellini e il Lupo che non sapeva più soffiare", start: "lb_radura",
      goal, zones, obj, news, onWord,
      talk: { lb_virgola: virgola, lb_lupo: lupo, lb_nonna: nonna, lb_mattone: mattone, lb_paglia: paglia, lb_legno: legno },
      intro: () => [
        ["voce", "La sera prima della partita più importante della stagione piove su tutta la città. Tu cerchi riparo nel primo portone aperto: una vecchia libreria in un vicolo, con un'insegna d'ottone. «Il Segnalibro».", "lb_libreria"],
        ["voce", "Dentro non c'è nessuno. Sulla porta un cartello: «Torno subito». La data, sotto, è di trentanove anni fa.", "lb_libreria"],
        ["voce", "Su un leggio, in fondo, c'è un libro aperto. Brilla. Le pagine si girano da sole, come se qualcuno le sfogliasse in fretta, cercando qualcosa.", "lb_libreria"],
        ["voce", "Il titolo sulla copertina è «Il Libro delle Partite che…». Il resto è stato morsicato via.", "lb_copertina"],
        ["lb_narratore", "C'era una volta un campione di nome {n}, numero {num}, che una sera di pioggia entrò in una libreria dove non avrebbe dovuto entrare.", "lb_libreria"],
        ["hero", "Chi ha parlato?", "lb_libreria"],
        ["lb_narratore", "Io racconto. È il mio mestiere. E tu, {n}, sei appena entrato in una storia. Che ne dici di vedere come va a finire?", "lb_libreria"],
        ["voce", "Le lettere si alzano dalla pagina come una sciarpa, ti girano attorno, ti prendono per i polsi. La libreria si ripiega come un libro pop-up. E tu cadi dentro, tra le righe.", "lb_copertina"],
      ],
    };
  }
  boot();
})();
