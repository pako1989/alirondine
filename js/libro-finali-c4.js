// js/libro-finali-c4.js - IL LIBRO CHE MANGIAVA I FINALI · Capitolo 4 «La Pagina Bianca» (matita)
// L'ultima parte del libro è solo a matita. Dai bordi avanza il Bianco: la cancellatura delle storie lasciate a metà.
// La Bozza, un abbozzo del Campione, sa chi sta leggendo davvero. Partita finale: Action Soccer 2D HD forzata
// contro «I Finali Mangiati», con la squadra dei personaggi aiutati. Poi l'ultima pagina: i finali disponibili dipendono
// da tutto quello che hai fatto (fiabe, Narratore, lettere, note a margine, imbrogli).
(function () {
  "use strict";
  function boot() {
    const LF = window.__libroFinali;
    if (!LF || !LF.addChapter || !LF._has || !LF._has(3)) return setTimeout(boot, 120);
    LF.addChapter(chapter4);
  }
  // altre saghe del gioco lasciate a metà (sola lettura dei loro salvataggi)
  const OTHER = [["ali-di-rondine.storia-campione", "Vallombra"], ["ali-di-rondine.kronenburg-story", "Kronenburg"], ["ali-di-rondine.chrono-story", "Chrono-Break"], ["ali-di-rondine.ragnarok", "Ragnarok Ball"], ["ali-di-rondine.belovodia-story", "Belovodia"], ["ali-di-rondine.alchimia-story", "L'Alchimia d'Acciaio"], ["ali-di-rondine.pirati-story", "I Pirati Celesti"], ["ali-di-rondine.shogun-story", "Shogun Eclipse"], ["ali-di-rondine.bilancia-feudi", "La Bilancia delle Tre Corone"], ["ali-di-rondine.campione-ombre", "Il Circuito delle Ombre"], ["ali-di-rondine.phantom-genesis", "Phantom Genesis"], ["ali-di-rondine.abisso-story", "L'Abisso di Dunwich"]];
  function unfinished() {
    const out = [];
    OTHER.forEach(([k, name]) => {
      try {
        const raw = localStorage.getItem(k); if (!raw) return;
        const o = JSON.parse(raw) || {}, done = o.done && typeof o.done === "object" ? Object.keys(o.done).length : 0, ch = +o.ch || 1;
        const started = done > 0 || ch > 1 || (o.step && Object.keys(o.step).length) || (o.flags && Object.keys(o.flags).length);
        if (started && done < 3) out.push({ name, ch });
      } catch (e) {}
    });
    return out;
  }
  function chapter4(X) {
    const { T, F, say, ask, done, go, note, setStep, reward, cheat, finishChapter } = X;
    const N = 4, S = () => X.stepOf(N);
    const h0 = X.hero() || {};
    const narrOK = () => F.get("narr") !== "cancellato";
    const gomOK = () => F.get("gomma") === "salvato";
    const mate1 = () => (F.get("fin1") === "riscritto" ? "Lupo" : "Mattone");
    const mate1Id = () => (F.get("fin1") === "riscritto" ? "lb_lupo" : "lb_mattone");
    const ending3 = () => [F.get("fin1"), F.get("fin2"), F.get("fin3")];

    X.cast("lb_bozza", { name: "La Bozza", tag: "", hair: "#7a7a76", style: h0.style || "messy", skin: "#e4e3db", eye: "#4a4a4a", bg: ["#f6f5ef", "#7a7a76"], shirt: "#bdbdb7" },
      "Un abbozzo a matita del Campione, con un braccio ancora da disegnare e i colori che mancano. Dice di essere fatta di tutte le storie lasciate a metà.");
    X.cos("lb_c4", { kind: "shirt", label: "Maglia Matita", val: "#bdbdb7", from: "Completa il Libro che Mangiava i Finali" });
    X.cos("lb_grafite", { kind: "hairc", label: "Capelli Grafite", val: "#6a6a66", from: "Raccogli tutte le gocce d'inchiostro nella Terra delle Bozze" });
    X.cos("lb_margine_c", { kind: "shirt", label: "Maglia del Margine", val: "#e6e2d6", from: "Raccogli tutte le gocce d'inchiostro al Margine" });
    X.cos("lb_ultima_c", { kind: "hairc", label: "Capelli Pagina Bianca", val: "#f2f1ea", from: "Raccogli tutte le gocce d'inchiostro all'Ultima Pagina" });
    X.cos("lb_end_fine", { kind: "shirt", label: "Maglia «Fine»", val: "#6a1f2a", from: "Finale del Libro: FINE" });
    X.cos("lb_end_storta", { kind: "hairc", label: "Capelli Inchiostro Storto", val: "#5a6b8c", from: "Finale del Libro: FINE?" });
    X.cos("lb_end_aperto", { kind: "hairc", label: "Capelli Segnalibro", val: "#c81e3a", from: "Finale del Libro: IL LIBRO APERTO" });
    X.cos("lb_end_narr", { kind: "shirt", label: "Cappotto del Narratore", val: "#2a2838", from: "Finale del Libro: IL NUOVO NARRATORE" });
    X.cos("lb_end_penna", { kind: "shirt", label: "Maglia della Penna d'Oro", val: "#e8c66a", from: "Finale segreto del Libro: LA PENNA AL LETTORE" });

    const goal = (s) => ({
      0: "Parla con Virgola, appena arrivato nella Terra delle Bozze.",
      1: "Parla con la Bozza, la figura a matita al centro della pagina.",
      2: "Vai al Margine (uscita a est) e guarda oltre il bordo della pagina.",
      3: "Scendi all'Ultima Pagina (in basso, al Margine) e affronta la Bozza.",
      4: "Scrivi l'ultima pagina del libro.",
    }[s] || "Il libro è finito. Puoi rileggere l'ultima pagina parlando con la Bozza.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "italic 8px Georgia, serif"; const w = g.measureText(txt).width + 8; R(g, x - w / 2, y - 8, w, 11, "rgba(255,255,255,.9)"); g.strokeStyle = "rgba(70,70,70,.6)"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 7.5, w - 1, 10); g.fillStyle = "#4a4a4a"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    function bianco(g, fr) { // il Bianco che erode i bordi dello schermo
      const t = (Math.sin(fr / 80) + 1) / 2, w = 14 + t * 12;
      [0, 1].forEach((side) => { const gr = g.createLinearGradient(side ? 320 : 0, 0, side ? 320 - w * 2 : w * 2, 0); gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(side ? 320 - w * 2 : 0, 0, w * 2, 200); });
      for (let i = 0; i < 8; i++) R(g, (i % 2 ? 320 - w - 4 : w) + Math.sin(fr / 20 + i) * 3, (i * 29 + fr * 0.4) % 200, 3, 2, "rgba(255,180,195,.7)");
    }

    const zones = {
      lb_bozza: {
        name: "Il Libro · Terra delle Bozze", short: "La Terra delle Bozze", sub: "Dove le storie aspettano di essere finite", style: "mat", bg: "lb_bozza",
        w: 36, h: 24, start: [4, 16], itemCos: "lb_grafite", items: [[2, 2], [33, 3], [33, 21], [16, 21]],
        areas: [[3, 3, 9, 7, "La casa di paglia, a matita"], [13, 3, 19, 7, "Il castello di carte, a matita"], [25, 3, 31, 8, "Il palazzo a fumetti, a matita"], [1, 1, 34, 22, "La Terra delle Bozze"]],
        act: { y: "Guarda lo schizzo", q: "Guarda la porta disegnata", c: "Guarda il castello abbozzato", Z: "Guarda la colonna di fogli", n: "Leggi l'appunto", ">": "Verso il Margine" },
        flavor: {
          y: ["Una casa disegnata a matita: le linee sono ripassate tre volte, come quando non si è sicuri.", "Una finestra senza vetro, una porta senza maniglia: «da finire», c'è scritto in un angolo."],
          q: "Una porta disegnata. La tocchi: è di carta. Dietro c'è scritto «qui ci va una stanza».",
          c: "Il castello di carte, ma a matita, con le carte senza semi. Qualcuno ha cominciato un picche e si è fermato a metà.",
          Z: "Una colonna di fogli appallottolati. Sono le prime versioni di questo capitolo. Una dice: «e poi arrivò un drago». Cancellato.",
          n: "Un appunto a margine: «Ricordarsi di finire. (Davvero, stavolta.)»",
        },
        intro: [["voce", "Volti pagina e il colore se ne va. Tutto è a matita: case, alberi, nuvole, perfino la luce. Le linee sono ripassate, incerte, come quando si disegna senza sapere ancora cosa."], ["voce", "Ai bordi, piano piano, qualcosa cancella. Non fa rumore. Lascia solo bianco, e briciole rosa."]],
        npcs: (s) => {
          const o = [{ id: "lb_virgola", at: [8, 15] }, { id: "lb_bozza", at: [20, 12] }];
          if (narrOK()) o.push({ id: "lb_narratore", at: [12, 15] });
          if (gomOK()) o.push({ id: "lb_gommapane", at: [6, 19] });
          return o;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 23, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          lay(1, 10, 34, 11, ":"); lay(17, 1, 18, 22, ":");
          house(3, 3, 7, 4, { straw: true, door: [6, 6, "q"] }); lay(13, 3, 16, 6, "c"); house(25, 3, 7, 5, { door: [28, 7, "q"] });
          [[2, 13], [3, 13], [30, 15], [31, 15]].forEach(([x, y]) => put(x, y, "Z")); put(22, 15, "n");
          [[10, 19], [24, 19], [28, 12], [5, 9]].forEach(([x, y]) => put(x, y, "t")); lay(19, 16, 23, 18, "'");
          put(35, 10, ">"); put(35, 11, ">");
        },
        decor(g, cx, cy, d) { plaque(g, "(da finire)", d.X(20) + 8, d.Y(12) + 26); },
        top(g, cx, cy, d) { bianco(g, d.fr); },
      },

      lb_margine: {
        name: "Il Libro · Il Margine", short: "Il Margine", sub: "Il bordo della pagina, e oltre", style: "mat", bg: "lb_margine",
        w: 36, h: 24, start: [2, 11], itemCos: "lb_margine_c", items: [[2, 2], [25, 2], [2, 21], [24, 21]],
        writes: [{ id: "marg_penna", need: "penna", area: [22, 6, 22, 6], to: "'", prompt: "Tra le pile di libri, una pagina bianca con una sola riga stampata: «Firma dell'Autrice: ________». Cosa scrivi?",
          ok: [["voce", "Scrivi PENNA. La parola si fa leggera, si arrotola, e diventa una piuma che firma da sola: «A.». Le pile di libri si scostano piano, come per lasciarti passare."]], then: () => done() }],
        letter: { at: [22, 3], n: 4, txt: "Ultima lettera. Ti lascio la penna, se la vuoi. L'ultima pagina non l'ho mai scritta, perché un finale vero lo scrive chi ha letto fino in fondo. E se per caso incontri la mia vecchia voce, dille che non era colpa sua. Io torno subito. Questa volta davvero. — A." },
        areas: [[26, 1, 34, 22, "Oltre il bordo"], [20, 2, 24, 5, "L'angolo della firma"], [1, 1, 25, 22, "Il Margine"]],
        act: { e: "Guarda la scrivania", i: "Guarda la pila di libri", "<": "Torna alla Terra delle Bozze", v: "Scendi all'Ultima Pagina" },
        flavor: {
          e: "La scrivania dell'Autrice, a matita. Una tazza, un biglietto: «Torno subito». Accanto, una sedia spostata, come da qualcuno che si è alzato di fretta.",
          i: ["Pile di libri disegnati. Il dorso di uno dice «Il Libro delle Partite che Finiscono Bene». È questo libro. Dentro questo libro.", "Una pila di libri a matita. In cima, un libro chiuso con un segnalibro rosso. Virgola, vedendolo, arrossisce."],
        },
        intro: [["voce", "Il Margine: qui la pagina finisce. Oltre il bordo, enorme, c'è un'altra luce: calda, gialla, vera. Si sente la pioggia, lontana. E un respiro lento, gigantesco, di qualcuno che legge."]],
        npcs: (s) => {
          const o = [{ id: "lb_virgola", at: [6, 12] }];
          if (narrOK()) o.push({ id: "lb_narratore", at: [18, 11] });
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 23, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          lay(26, 1, 34, 22, "a");
          lay(1, 10, 25, 11, ":"); put(10, 16, "e"); put(11, 16, "e");
          lay(20, 2, 20, 6, "i"); lay(24, 2, 24, 6, "i"); lay(21, 6, 23, 6, "i"); put(22, 6, "_");
          put(0, 10, "<"); put(0, 11, "<"); put(17, 23, "v"); put(18, 23, "v");
        },
        decor(g, cx, cy, d) {
          // oltre il bordo: la libreria vera, gigantesca
          const x0 = d.X(26), y0 = d.Y(1);
          if (x0 < 330) {
            const gr = g.createLinearGradient(x0, 0, x0 + 150, 0); gr.addColorStop(0, "#2a180f"); gr.addColorStop(1, "#4a2c1a"); g.fillStyle = gr; g.fillRect(x0, y0, 9 * 16, 22 * 16);
            g.save(); g.globalCompositeOperation = "lighter"; X.glow(g, x0 + 70, y0 + 40, 90, "255,200,120", 0.35); g.restore();
            for (let i = 0; i < 6; i++) R(g, x0 + 10 + i * 20, y0 + 120, 14, 40, ["#8a2f3a", "#2f5a7a", "#c99a3a", "#3a6a4a", "#6a4a8a", "#d8c8a8"][i]);
            g.fillStyle = "#e0b48a"; g.beginPath(); g.ellipse(x0 + 30, y0 + 260 + Math.sin(d.fr / 60) * 3, 30, 60, -0.2, 0, 7); g.fill();
            R(g, x0, y0, 5, 22 * 16, "#e6e2d6"); R(g, x0 + 5, y0, 3, 22 * 16, "rgba(0,0,0,.35)");
          }
          plaque(g, "pag. 213", d.X(13), d.Y(21));
        },
        top(g, cx, cy, d) { bianco(g, d.fr); },
      },

      lb_ultima: {
        name: "Il Libro · L'Ultima Pagina", short: "L'Ultima Pagina", sub: "Un campo a matita e una porta ancora da disegnare", style: "mat", bg: "lb_ultima",
        w: 38, h: 26, start: [18, 22], itemCos: "lb_ultima_c", items: [[2, 2], [35, 2], [2, 23], [35, 23]],
        areas: [[6, 8, 31, 19, "Il campo dell'ultima pagina"], [3, 1, 34, 4, "Le tribune a matita"], [1, 20, 36, 24, "Il bordo del campo"]],
        act: { P: "Guarda il tabellone", j: "Guarda le tribune", g: "Guarda la porta", "^": "Torna al Margine" },
        flavor: {
          j: ["Sulle tribune, a matita, tutti i personaggi delle fiabe. Alcuni sono colorati: sono quelli che hai aiutato.", "Il Due di Picche, a matita, tiene un cartello: «Articolo ultimo: finire»."],
          g: "Una porta disegnata con il righello. L'altra, in fondo, è ancora solo tratteggiata.",
        },
        intro: [["voce", "L'Ultima Pagina. Un campo da calcio disegnato a matita, con una porta vera e una tratteggiata. Sulle tribune, abbozzati, ci sono tutti: porcellini, carte, cittadini. Ti guardano. Aspettano."]],
        npcs: (s) => {
          const o = [{ id: "lb_bozza", at: [18, 13] }, { id: "lb_virgola", at: [4, 21] }, { id: mate1Id(), at: [30, 21] }, { id: F.get("fin2") === "riscritto" ? "lb_regina" : "lb_fante", at: [33, 21] }, { id: "lb_didascalia", at: [26, 21] }];
          if (narrOK()) o.push({ id: "lb_narratore", at: [8, 21] });
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 37, 0, "a"); lay(0, 25, 37, 25, "a"); lay(0, 0, 0, 25, "a"); lay(37, 0, 37, 25, "a");
          lay(3, 1, 34, 4, "j"); lay(6, 8, 31, 19, "-"); [12, 13, 14, 15].forEach((y) => { put(5, y, "g"); put(32, y, "g"); });
          lay(18, 1, 19, 7, ":"); put(24, 6, "P"); put(18, 0, "^"); put(19, 0, "^");
        },
        decor(g, cx, cy, d) {
          const x0 = d.X(6), y0 = d.Y(8), w = 26 * 16, h = 12 * 16;
          g.strokeStyle = "rgba(70,70,70,.6)"; g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, w - 1, h - 1); g.beginPath(); g.moveTo(x0 + w / 2, y0); g.lineTo(x0 + w / 2, y0 + h); g.stroke(); g.beginPath(); g.arc(x0 + w / 2, y0 + h / 2, 22, 0, 7); g.stroke();
          plaque(g, "L'ULTIMA PAGINA", d.X(19), d.Y(6));
        },
        top(g, cx, cy, d) { bianco(g, d.fr); },
      },
    };

    // ---------------------------------------------------------------- dialoghi
    function virgola() {
      const s = S();
      if (s === 0) return say([
        ["lb_virgola", "Mi vedi? Dimmi che mi vedi. Mi sento… a matita. Come se qualcuno mi stesse ancora disegnando."],
        ["lb_virgola", "Questa è la parte del libro che non è mai stata finita. Le bozze. E dai bordi arriva il Bianco: non morde, non mangia. Cancella. Piano piano. Tutto."],
        narrOK() ? ["lb_narratore", "Non sono io, stavolta. Lo giuro sulla mia ultima riga. Io mangiavo i finali per paura di questo. Ma il Bianco arriva lo stesso."] : ["lb_virgola", "Senza il Narratore, il libro non ha più nessuno che lo racconti. Forse è per questo che il Bianco corre così."],
        ["lb_virgola", "Laggiù, al centro della pagina. Quella figura a matita. Ha la tua maglia, {n}. Vai a parlarle. Io… io ti tengo il segno."],
      ], () => { setStep(N, 1); done(); });
      if (s >= 5) return ask("lb_virgola", "«Il libro è finito. Ma un libro finito si può rileggere, sai?»", [
        { label: "Il Segnalibro", sub: "I finali trovati e quelli che mancano", fn: () => X.notebook(done, true) },
        { label: "Due chiacchiere", sub: "Cosa pensa Virgola", fn: () => say([["lb_virgola", X.pick(["Grazie per essere arrivato fino in fondo. Non succede spesso. Lo so: io sto in mezzo alle pagine, vedo dove la gente si ferma.", "Se vuoi cercare gli altri finali, puoi ricominciare il libro dall'Indice. Io sarò di nuovo lì, nella radura, a dirti «oh, sei caduto».", "Ho fatto le orecchie a tutte le pagine dove hai riso. Il libro adesso è tutto orecchie."])]]) },
      ]);
      return say([["lb_virgola", T(goal(S()))]]);
    }
    function bozza() {
      const s = S();
      if (s < 1) return say([["lb_bozza", "…"], ["voce", "La figura a matita ti guarda. Poi guarda Virgola, come per dire: prima parla con lei."]]);
      if (s === 1) {
        const left = unfinished(), names = left.slice(0, 3).map((x) => x.name + (x.ch > 1 ? `, al capitolo ${x.ch}` : ""));
        return say([
          ["voce", "Da vicino è identica a te. Stessa maglia, stesso numero, {num}. Ma è grigia, a matita, e un braccio è soltanto una riga. Sotto i piedi c'è scritto, piccolo: «da finire»."],
          ["lb_bozza", "Ciao, {n}. Io sono te. Cioè: sono tutte le volte che una storia con te dentro è rimasta a metà."],
          left.length ? ["lb_bozza", `Per esempio: ${names.join("; ")}. Me le ricordo tutte. Le hai lasciate lì, un giorno, e sei andato a fare altro. Io sono rimasta.`] : ["lb_bozza", "Tu non hai lasciato niente a metà, lo so. Ho controllato. Allora io vengo da qualcun altro: da chi legge sopra la tua spalla."],
          ["lb_bozza", "Il Bianco non è un mostro, sai. È solo quello che succede a un libro quando chi lo legge se ne va prima della fine. Il Narratore mangiava i finali per non farlo arrivare. Ma il Bianco arriva comunque, se nessuno finisce di leggere."],
          ["hero", "E chi sta leggendo, adesso?"],
          ["voce", "La Bozza alza la testa. Non guarda te. Guarda oltre te. Fuori. Verso lo schermo."],
          ["lb_bozza", "Tu. Sì: tu, che tieni in mano {n}. È a te che parlo. Arriverai alla fine, stavolta?"],
          ["lb_virgola", "…"],
          ["lb_bozza", "Facciamo così. All'Ultima Pagina, una partita. Io con i finali mangiati, tu con quelli che hai salvato. Se vinci, mi finisci: mi dai i colori. Se perdi, divento io il {n} di questa storia. E tu una bozza."],
        ], () => { setStep(N, 2); note("La Bozza dice di essere fatta delle storie lasciate a metà. Il Bianco arriva quando chi legge se ne va prima della fine."); done(); });
      }
      if (s === 2 || s === 3) {
        if (s === 3 && isUltima()) return ask("lb_bozza", "«I Finali Mangiati sono pronti. Sono tutte le ultime righe che il Narratore ha masticato in trentanove anni. Sono affamate di una partita.»", [
          { label: "⚽ L'ultima partita", sub: "Action Soccer 2D HD · con tutti quelli che hai aiutato", cls: "hot", fn: playFinal },
          { label: "Un momento", sub: "Torna a esplorare", fn: done },
        ]);
        return say([["lb_bozza", "Ci vediamo all'Ultima Pagina. Si scende dal Margine, a est. Non metterci troppo: il Bianco ha fretta."]]);
      }
      if (s === 4) return finale();
      return ask("lb_bozza", "«Ho i colori, adesso. Guarda. Il braccio, anche. Vuoi rileggere l'ultima pagina?»", [
        { label: "📖 Rileggi l'ultima pagina", sub: "Scegli di nuovo, tra i finali che le tue scelte hanno aperto", cls: "hot", fn: finale },
        { label: "No, va bene così", sub: "Torna a esplorare", fn: done },
      ]);
    }
    const isUltima = () => X.api.trZone() === "lb_ultima";
    function narratore() {
      const s = S(), v = F.get("narr");
      if (isUltima()) return say([["lb_narratore", v === "patto" ? "Racconterò questa partita per sempre, socio. Anche se dura un minuto." : "Stavolta non racconto. Guardo. È la prima volta che guardo una partita senza sapere come finisce."]]);
      if (X.api.trZone() === "lb_margine" && s === 2) return say([
        ["lb_narratore", "Guarda, {n}. Di là dal bordo. È la libreria. La sua libreria."],
        ["lb_narratore", "Quel dito enorme che tiene la pagina… non è il suo. Lei aveva le mani piccole, macchiate d'inchiostro. Questo è qualcun altro. Qualcuno che legge adesso."],
        v === "patto" ? ["lb_narratore", "Il nostro patto vale, socio. Ma se il lettore se ne va, il Bianco ci mangia tutti e due. Bisogna finire la partita, almeno."] : ["lb_narratore", "Avevo paura che, finito il libro, nessuno ci tornasse più. Invece c'è sempre qualcuno che apre un libro. Non è detto che sia lei. Ma qualcuno sì."],
        ["lb_narratore", "L'Ultima Pagina è qui sotto. La Bozza ti aspetta. Io vengo a guardare."],
      ], () => { setStep(N, 3); done(); });
      return say([["lb_narratore", { perdonato: "Il Bianco non mi fa più paura come prima. Forse perché adesso c'è qualcuno che finisce di leggere.", patto: "Socio, il Bianco è un problema per tutti e due. Finiamo questa storia, poi ne cominciamo un'altra." }[v] || "…"]]);
    }
    function onMargine() { // se il Narratore è stato cancellato, al Margine parla Virgola
      if (S() === 2 && !narrOK()) return say([["lb_virgola", "Di là dal bordo… è la libreria. Quella vera. E quel dito enorme… qualcuno sta leggendo, adesso. Proprio adesso."], ["lb_virgola", "L'Ultima Pagina è qui sotto. Andiamo. Prima che il Bianco ci arrivi."]], () => { setStep(N, 3); done(); });
      return virgolaSmall();
    }
    function virgolaSmall() { return say([["lb_virgola", T(goal(S()))]]); }

    // ---------------------------------------------------------------- la partita finale
    function playFinal() {
      const sq = [F.get("fin2") === "riscritto" ? "Regina di Picche" : "Virgola", "Fante di Cuori", gomOK() ? "Gommapane" : "Didascalia"];
      X.playMatch({
        id: "lb_finale", alt: "hd", mate: mate1(), squad: sq, us: "Le Fiabe Finite", chap: "Il Libro · L'Ultima Pagina", bg: "lb_ultima",
        intro: `L'ultima partita del libro. {n} con ${mate1()}, ${sq.join(", ")} contro i Finali Mangiati.`,
        oppNames: ["Pagina Strappata", "Riga Mancante", "Fine Mozzata", "Punto Sospeso", "La Bozza"],
        team: (t, s) => ({ name: "I Finali Mangiati", vs: "i Finali Mangiati", color: "#9a9a95", atk: t(s.tiro * 1.0), def: t(s.drib * 0.95), vel: t(s.tiro * 0.95), names: ["Pagina Strappata", "Riga Mancante", "Fine Mozzata", "Punto Sospeso", "La Bozza"] }),
        venue: { ads: [["L'ULTIMA PAGINA", "#4a4a4a"], ["DA FINIRE", "#7a7a76"], ["TORNO SUBITO", "#5a6b8c"], ["FINE?", "#4a4a4a"]], crowd: ["#bdbdb7", "#9b9b96", "#c0644a", "#1d1a17", "#ffd95a"], ground: ["#e8e7df", "#dfded6"], line: "#4a4a4acc", tint: "rgba(246,245,239,.12)", glow: "255,255,255" },
        done: (r) => {
          if (r.win) { setStep(N, 4); X.reward("lb_c4_match", { coins: 40 }); return say([["voce", `Fischio finale: ${r.a} a ${r.b}. La porta tratteggiata diventa vera, riga per riga. Sulle tribune, i personaggi a matita si colorano uno dopo l'altro.`], ["lb_bozza", "Hai vinto. Guarda… il braccio. Ho un braccio. E il blu della maglia. Mi hai finito."], ["voce", "La Bozza si guarda le mani colorate, ride, e scompare dentro di te come un'ombra che torna a casa. Resta solo l'ultima pagina, bianca. E il pennino, nella tua mano."]], finale); }
          say([["voce", `Fischio finale: ${r.a} a ${r.b}. Il Bianco avanza di un passo.`], ["lb_bozza", "Non ancora. Riprova: parlami di nuovo. Io non vado da nessuna parte. È questo il problema."]]);
        },
      });
    }
    function tabellone() {
      if (S() !== 3) return say([["voce", "Il tabellone: «? – ?». Le cifre non sono ancora disegnate."]]);
      ask("voce", "Il tabellone dell'ultima pagina: «? – ?». Potresti scrivere VINTO, e il libro finirebbe adesso.", [
        { label: "✒ Scrivi VINTO", sub: "Salti l'ultima partita · il libro se lo ricorderà", fn: () => { cheat(); X.SFX.scribble(); setStep(N, 4); say([["voce", "Scrivi VINTO. Il tabellone segna 1 a 0. La Bozza guarda il numero e rimane grigia."], ["lb_bozza", "Così hai vinto. Ma io resto da finire. Le storie vinte senza giocarle restano tutte un po' a matita."]], finale); } },
        { label: "No: si gioca", sub: "L'ultima partita va giocata", cls: "hot", fn: () => say([["voce", "Lasci stare il tabellone. Sulle tribune, qualcuno a matita applaude piano."]]) },
      ]);
    }

    // ---------------------------------------------------------------- l'ultima pagina: i finali
    function finale() {
      const m = X.mem(), f3 = ending3(), vero = f3.filter((v) => v === "vero").length, risc = f3.filter((v) => v === "riscritto").length, narr = F.get("narr");
      const secret = m.cheat === 0 && m.lett.length >= 4 && m.marg.length >= 6 && narr === "perdonato";
      const opts = [{ label: "📕 «Chiudo il libro.»", sub: vero >= 2 ? "Ogni fiaba con il suo finale" : "Il libro si chiude così com'è", cls: "hot", fn: () => ending(vero >= 2 ? "fine" : "fine_storta") }];
      if (narr === "perdonato" && risc >= 2) opts.push({ label: "📖 «Lo lascio aperto.»", sub: "Un libro che si riscrive a ogni lettura", fn: () => ending("aperto") });
      if (narr === "patto" || narr === "cancellato") opts.push({ label: "🎩 «Racconto io, adesso.»", sub: "Prendi il posto del Narratore", fn: () => ending("narratore") });
      if (secret) opts.push({ label: "🪶 «Restituisco la penna.»", sub: "Qualcuno, forse, sta tornando", cls: "hot", fn: () => ending("penna") });
      say([["voce", "L'ultima pagina del libro. Bianca, liscia, tiepida, come un foglio appena uscito dal torchio. Il pennino è nella tua mano. Tutti, sulle tribune, trattengono il fiato."]], () => ask("voce", `L'ultima pagina. Come finisce il libro?${opts.length === 1 ? "\n(Altri finali si aprono con scelte diverse.)" : ""}`, opts, "lb_ultima"));
    }
    function ending(id) {
      const h = X.hero() || { name: "Campione", num: 9, shotName: "il tuo tiro" };
      const L = {
        fine: [
          ["voce", "Scrivi una sola parola, al centro della pagina: FINE. Le lettere sono semplici, dritte, senza riccioli. La pagina le accoglie come una porta che si chiude piano, senza sbattere.", "lb_ultima"],
          ["voce", "Le fiabe tornano al loro posto, una dopo l'altra, come carte rimesse nel mazzo. Il Lupo soffia, la Regina para, la Banda va dove deve andare. Tutto finisce come deve finire. E proprio per questo si può ricominciare.", "lb_copertina"],
          ["lb_virgola", "Ecco. Io adesso mi metto qui, tra l'ultima pagina e la copertina. È il posto più bello del mondo per un segnalibro.", "lb_copertina"],
          ["voce", "Apri gli occhi. Sei in piedi davanti al leggio, nella libreria. Fuori è l'alba. La pioggia è finita.", "lb_alba"],
          ["voce", "Il libro è chiuso. Sulla copertina, il titolo è finalmente intero: «Il Libro delle Partite che Finiscono Bene».", "lb_alba"],
          ["voce", "Quella mattina, alla partita, al novantesimo, tiri «{tiro}». E mentre il pallone vola, per un attimo, senti una voce calma, un po' teatrale, che lo racconta.", "lb_alba"],
        ],
        fine_storta: [
          ["voce", "Scrivi FINE. Ma la mano trema un po', e la E viene storta. La pagina la prende lo stesso: un finale è un finale.", "lb_ultima"],
          ["voce", "Le fiabe si chiudono, ma alcune non nel modo in cui erano nate. Il Lupo non sa ancora se è cattivo. La Regina è felice e un po' confusa. Nel libro, qualcuno si guarda attorno chiedendosi se è davvero finita.", "lb_copertina"],
          ["lb_virgola", "È un finale. Un po' storto. Come quelli veri, a volte. Io lo tengo lo stesso.", "lb_copertina"],
          ["voce", "Ti svegli nella libreria, all'alba. Il libro è chiuso. Sul dorso, a matita, qualcuno ha aggiunto un punto interrogativo: «Il Libro delle Partite che Finiscono Bene?».", "lb_alba"],
          ["voce", "Forse un giorno lo riaprirai, per raddrizzare quel punto interrogativo. I libri aspettano. Sono bravissimi ad aspettare.", "lb_alba"],
        ],
        aperto: [
          ["voce", "Non scrivi FINE. Scrivi: «…e la sera dopo, la storia ricominciò, un po' diversa». Il Narratore, accanto a te, legge la riga ad alta voce. Per la prima volta la sua voce trema, ma non di paura.", "lb_ultima"],
          ["lb_narratore", "Un libro che si riscrive a ogni lettura. Ogni sera un finale nuovo, e nessuno da mangiare. Posso raccontarli tutti?"],
          ["lb_virgola", "Tutti. Io tengo il segno, tu racconti. E chi passa, legge.", "lb_copertina"],
          ["voce", "Ti svegli nella libreria, all'alba. Il libro è aperto sul leggio. Le pagine si girano piano da sole, e ogni tanto cambia una parola. Dalla carta sale un profumo di tè alla bergamotto e di rose dipinte di fresco.", "lb_alba"],
          ["voce", "Sul margine dell'ultima pagina, in piccolo, con due calligrafie diverse: «Grazie, {n}. — V. e N.»", "lb_alba"],
        ],
        narratore: [
          ["voce", "Non scrivi niente. Prendi il cappello del Narratore, lasciato sulla pagina bianca, e te lo metti. Ti sta grande. Poi comincia a starti giusto.", "lb_ultima"],
          F.get("narr") === "patto" ? ["lb_narratore", "Allora siamo in due, socio. Tu racconti le partite, io i silenzi tra una partita e l'altra. Questo libro non finirà mai."] : ["lb_virgola", "{n}… cosa fai? Così resti qui. Per sempre.", "lb_ultima"],
          ["voce", "La tua voce cambia. Diventa profonda, calma, un po' teatrale. «C'era una volta un pallone…», dici, e la radura ad acquerello si accende sotto di te.", "lb_radura"],
          ["voce", "Nella libreria, all'alba, il libro è aperto sul leggio. Non c'è nessuno. Le pagine si girano da sole, e una voce racconta ad alta voce, per chiunque entri a ripararsi dalla pioggia.", "lb_alba"],
          ["voce", "È la tua voce. Se un giorno entri anche tu, la riconoscerai.", "lb_alba"],
        ],
        penna: [
          ["voce", "Non scrivi niente. Il pennino, nella tua mano, è diventato una penna d'oca con il pennino d'oro. La penna dell'Autrice. Capisci che non è tua: va restituita.", "lb_ultima"],
          ["voce", "In quell'istante, oltre il margine, nella libreria vera, suona il campanello della porta. Qualcuno è entrato.", "lb_libreria"],
          ["voce", "Una signora anziana, con un ombrello gocciolante e gli occhiali sulla punta del naso, si avvicina al leggio. Si china sul libro. Ti vede, piccolo, sull'ultima pagina, con la sua penna in mano.", "lb_libreria"],
          ["lb_autrice", "Oh. Scusate il ritardo. Avevo detto «torno subito». Ci ho messo un po' più del previsto."],
          ["lb_narratore", "…Signora Ada?"],
          ["lb_autrice", "Eccoti, vecchia mia voce. Non era colpa tua, lo sai. Avevi solo paura del silenzio. Ma dopo la fine c'è sempre qualcuno che dice «ancora»."],
          ["voce", "Le porgi la penna. Lei la prende, la guarda, e te la restituisce."],
          ["lb_autrice", "No, caro. L'ultima riga la scrive chi ha letto fino in fondo. Io ho solo scritto l'inizio."],
        ],
      };
      if (id === "penna") {
        return say(L.penna, () => ask("lb_autrice", "«Scrivi tu l'ultima riga del libro. Quella che vuoi.»", [
          { label: "«E giocarono ancora, domani.»", sub: "", fn: () => pennaEnd("E giocarono ancora, domani.") },
          { label: "«Fine. Ma solo per stasera.»", sub: "", fn: () => pennaEnd("Fine. Ma solo per stasera.") },
          { label: "«C'era una volta, di nuovo.»", sub: "", fn: () => pennaEnd("C'era una volta, di nuovo.") },
        ], "lb_libreria"));
      }
      say(L[id], () => closeBook(id));
    }
    function pennaEnd(line) {
      F.set("riga", line.slice(0, 24));
      say([
        ["voce", `Scrivi: «${line}». La riga brilla, poi si asciuga. La signora Ada la legge ad alta voce, e la sua voce e quella del Narratore, per un momento, sono la stessa voce.`, "lb_libreria"],
        ["lb_virgola", "Lo sapevo. Lo sapevo che tornava. I segnalibri lo sentono.", "lb_copertina"],
        ["voce", "All'alba la libreria è aperta. Il cartello sulla porta, girato dopo trentanove anni, dice: APERTO. Dietro il bancone, una signora prepara il caffè. Sul leggio, il libro è chiuso, col titolo intero e un segnalibro rosso che spunta.", "lb_alba"],
        ["voce", `E a te, che hai letto fino in fondo: grazie. Questa storia aveva bisogno proprio di questo. Di qualcuno che arrivasse all'ultima pagina.`, "lb_alba"],
      ], () => closeBook("penna"));
    }
    function closeBook(id) {
      X.end(id); setStep(N, 5);
      const first = !X.mem().done[N];
      finishChapter(N, id);
      const cos = { fine: "lb_end_fine", fine_storta: "lb_end_storta", aperto: "lb_end_aperto", narratore: "lb_end_narr", penna: "lb_end_penna" }[id];
      const msg = X.reward("lb_c4_done", { coins: 80, cos: "lb_c4" }).concat(X.reward("lb_end_" + id, { coins: id === "penna" ? 100 : 30, cos }));
      note("Finale del libro: " + X.ENDINGS[id][0] + ".");
      const m = X.mem(), tot = Object.keys(X.ENDINGS).length;
      X.api.trSay([
        X.api.L("voce", `FINALE · ${X.ENDINGS[id][0]}. ${X.ENDINGS[id][1]}`, "lb_alba"),
        X.api.L("voce", `Finali trovati: ${m.ends.length} su ${tot}. ${m.ends.length < tot ? "Gli altri si aprono con scelte diverse: fiabe vere o riscritte, il destino del Narratore, le lettere, le note a margine, gli imbrogli." : "Li hai trovati tutti. Il libro ti ringrazia, pagina per pagina."}${msg.length ? " " + msg.join(" · ") : ""}`, "lb_alba"),
      ], () => X.api.trExitTo(() => window.__libroFinali.open()));
      if (first) note("Ho finito il libro.");
    }

    const obj = {
      "lb_bozza:>": () => (S() >= 2 ? go("lb_margine", 2, 11) : say([["lb_virgola", "Prima la figura a matita, al centro. Ha qualcosa da dirti. Lo sento."]])),
      "lb_margine:<": () => go("lb_bozza", 33, 10),
      "lb_margine:v": () => (S() >= 3 ? go("lb_ultima", 18, 22) : say([["lb_virgola", narrOK() ? "Aspetta. Il Narratore vuole mostrarti qualcosa, oltre il bordo." : "Aspetta. Guarda prima oltre il bordo. Parlami."]])),
      "lb_ultima:^": () => go("lb_margine", 17, 21),
      "lb_ultima:P": tabellone,
    };
    function news(id, s) {
      if (id === "lb_virgola") return s === 0 || (s === 2 && !narrOK() && X.api.trZone() === "lb_margine");
      if (id === "lb_bozza") return s === 1 || (s === 3 && isUltima()) || s === 4;
      if (id === "lb_narratore") return s === 2 && X.api.trZone() === "lb_margine";
      return false;
    }
    const zoneTalk = (fnMargine, fnElse) => () => (X.api.trZone() === "lb_margine" ? fnMargine() : fnElse());
    return {
      n: N, title: "La Pagina Bianca", sub: "Matita · la Bozza, il Bianco e l'ultima pagina", start: "lb_bozza",
      goal, zones, obj, news,
      talk: {
        lb_virgola: zoneTalk(onMargine, virgola), lb_bozza: bozza, lb_narratore: narratore,
        lb_gommapane: () => say([["lb_gommapane", "Il Bianco… non si mangia. Troppo grande. Io mangio solo piccoli sbagli. Tu finisci. Io guardo."]]),
        lb_lupo: () => say([["lb_lupo", "Sono a matita. Mi sento nudo senza l'acquerello. Ma il tifo lo faccio lo stesso."]]),
        lb_mattone: () => say([["lb_mattone", "Ho misurato l'ultima pagina: è perfetta. Manca solo il finale. Il finale lo misuri tu."]]),
        lb_regina: () => say([["lb_regina", "Difenderò la nostra porta. Ho perso una volta: adesso so quanto vale non perdere la seconda."]]),
        lb_fante: () => say([["lb_fante", "Gioco per lei, e per te. Articolo unico del Fante: il cuore in mezzo al campo."]]),
        lb_didascalia: () => say([["lb_didascalia", "INFINE… la cronista si siede in tribuna. Per una volta non racconta. Guarda."]]),
      },
      intro: () => [
        ["voce", "La pagina si gira, e dall'altra parte non c'è colore.", "lb_copertina"],
        narrOK() ? ["lb_narratore", "Capitolo quarto. L'ultimo. Nel quale… nel quale non so cosa succede. Non l'ho mai saputo. È la prima volta che lo dico.", "lb_bozza"] : ["voce", "Capitolo quarto. L'ultimo. Nessuno lo racconta: il libro è rimasto senza voce. Lo racconti tu, passo dopo passo.", "lb_bozza"],
      ],
    };
  }
  boot();
})();
