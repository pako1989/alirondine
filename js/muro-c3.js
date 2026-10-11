// js/muro-c3.js - IL MURO · Capitolo 3 «La Partita di Primavera»
// Dentro il muro cavo, con Mastro Ugolino: l'archivio dei Primi Prevosti (secondo colpo di scena: chi ha costruito il muro, e perché).
// Il Palazzo del Consiglio: il Prevosto Grifo. Sul Camminamento, la Partita di Primavera (Partita sul Muro, versione finale:
// le mani dei Colossi aiutano). Poi, davanti al Grande Portone, la scelta.
// Finali: il Muro si apre · il Muro resta (serve il Consiglio) · Oltre l'orizzonte (servono i Fuorimura)
// · segreto: il Muro è una tribuna (serve la fiducia di Nives, il Taccuino quasi completo e i Colossi disegnati).
(function () {
  "use strict";
  function boot() { const MU = window.__muro; if (!MU || !MU.addChapter || !MU._has(2)) return setTimeout(boot, 120); MU.addChapter(chapter3); }
  function chapter3(X) {
    const { F, say, ask, done, go, setStep, bond, learnLore, finishChapter } = X;
    const N = 3, S = () => X.stepOf(N), M = () => X.mem();

    X.cast("mu_grifo", { name: "Prevosto Grifo", tag: "", hair: "#e8e0d0", style: "slick", skin: "#f0d0b0", eye: "#6a5a2a", bg: ["#3a1a20", "#c9a227"], shirt: "#6a1a24" },
      "Il Prevosto di Cintavecchia, capo del Consiglio. Voce di miele, mani sempre pulite, un anello per ogni anno di potere. Discende dai Primi Prevosti, e il loro segreto l'ha ereditato insieme al palazzo.");
    X.cos("mu_c3", { kind: "shirt", label: "Mantello di Primavera", val: "#7ab84a", from: "Completa il Capitolo 3 de Il Muro" });
    X.cos("mu_polvere", { kind: "hairc", label: "Capelli di Polvere", val: "#9a9488", from: "Raccogli tutte le piume di corvo dentro il muro" });
    X.cos("mu_porpora", { kind: "shirt", label: "Toga del Consiglio", val: "#6a1a24", from: "Raccogli tutte le piume di corvo nel Palazzo" });
    X.cos("mu_aperto", { kind: "hairc", label: "Capelli d'Alba", val: "#ffb070", from: "Finale «Il Muro si apre»" });
    X.cos("mu_chiuso", { kind: "shirt", label: "Corazza della Cinta", val: "#5a5a62", from: "Finale «Il Muro resta»" });
    X.cos("mu_via", { kind: "shirt", label: "Mantello del Viandante", val: "#7a6040", from: "Finale «Oltre l'orizzonte»" });
    X.cos("mu_tribuna", { kind: "hairc", label: "Capelli di Pietra Viva", val: "#8a9a8a", from: "Finale segreto «Il Muro è una tribuna»" });

    X.lore("l_patto", { t: "Il Patto della Cinta", d: "Il documento originale, firmato dai Primi Prevosti: «Durante il Grande Inverno le scorte bastano per la città, non per i borghi. Si costruisca il muro. I borghi restino fuori.» Il muro non fu costruito contro i Colossi. I Colossi non esistevano ancora." });
    X.lore("l_quiete", { t: "La Quiete di Pietra", d: "Le cronache dei Prevosti: «Quelli dei borghi aspettano al Portone. Non se ne vanno. Diventano grigi, poi duri, poi pietra. Aspettano così tanto che diventano l'attesa stessa»" });
    X.lore("l_cerniere", { t: "Le cerniere saldate", d: "Le cerniere del Grande Portone furono saldate dalla parte di dentro, ottant'anni fa, per ordine del nonno di Grifo. L'anno in cui i Colossi tornarono a bussare." });
    X.lore("l_primavera", { t: "La Partita di Primavera", d: "Nell'ultima pagina del Patto, a mano, una riga che i Prevosti non hanno cancellato: «Si sveglieranno quando si giocherà di nuovo la Partita di Primavera, con il Portone aperto»" });

    const ally = (k, v) => M()[k] >= v;
    const goal = (s) => ({
      0: "Città Bassa, di notte: Mastro Ugolino ti aspetta davanti al Grande Portone.",
      1: "Dentro il muro: esplora l'archivio dei Prevosti e parla con Ugolino al tavolo del Patto.",
      2: "Prendi il passaggio segreto (a est) fino al Palazzo del Consiglio e affronta il Prevosto Grifo.",
      3: "Sul Camminamento: parla con la Comandante Ilse. È l'ora della Partita di Primavera.",
      4: "Scendi in città, al Grande Portone. Ugolino è all'argano. Decidi.",
    }[s] || "Storia conclusa. Dal menu puoi rigiocare i capitoli e cercare gli altri finali.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(15,15,20,.85)"); R(g, x - w / 2, y + 2, w, 1, "#a8322a"); g.fillStyle = "#e8e2d4"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    const SHELVES = { "6,3": "l_patto", "14,3": "l_quiete", "22,3": "l_cerniere" };
    const zones = {
      mu_cavo: {
        region: "cavo", name: "Il Muro · Dentro il muro", short: "Dentro il muro", sub: "Corridoi, scale, l'archivio dei Prevosti", bg: "mu_cavo",
        w: 30, h: 18, start: [3, 15], itemCos: "mu_polvere", items: [[1, 1], [28, 15], [11, 9], [26, 3]],
        areas: [[4, 1, 25, 7, "L'archivio dei Prevosti"], [0, 8, 29, 17, "I corridoi del muro"]],
        chests: { "28,1": { coins: 50, lore: "l_primavera", text: "Dentro, l'ultima pagina del Patto, strappata e nascosta. Qualcuno, tanto tempo fa, voleva che non si perdesse." } },
        act: { d: "Leggi gli scaffali", u: "Il tavolo del Patto", l: "Guarda la lanterna", z: "Guarda le casse", v: "Torna in città", ">": "Il passaggio verso il Palazzo", p: "Guarda il pilastro" },
        flavor: { l: "Una lanterna a olio che qualcuno riempie ogni settimana. Ugolino, probabilmente. O qualcuno che lo fa da duecento anni.", z: "Casse di documenti con il sigillo del Consiglio: «NON APRIRE · PER ORDINE DEI PRIMI PREVOSTI». Il sigillo è rotto da tempo.", p: "Un pilastro che regge il muro dall'interno. Ci sono incisi nomi: i muratori. Accanto ai nomi, piccoli palloni. Giocavano anche loro." },
        intro: [["voce", "Dentro il muro. Un corridoio di pietra che corre nel buio, scale che salgono e scendono, l'odore della polvere e dell'olio. Il muro è cavo. Lo è sempre stato."], ["mu_ugolino", "Benvenuto nella pancia di Berta e di Ottavio. Di notte respira, ti avevo detto. Senti? È il vento nei corridoi. Ottant'anni fa me li ha mostrati mio padre. Adesso li mostro a te."]],
        npcs: (s) => [{ id: "mu_ugolino", at: [15, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 17, "a"); lay(1, 8, 28, 16, "+"); lay(4, 1, 25, 7, ":"); lay(1, 1, 3, 7, ":"); lay(26, 1, 28, 7, ":"); lay(1, 1, 28, 1, ":");
          [6, 14, 22].forEach((x) => { put(x, 3, "d"); put(x + 1, 3, "d"); }); [[9, 2], [10, 2], [18, 2], [19, 2], [25, 5]].forEach(([x, y]) => put(x, y, "d"));
          put(14, 5, "u"); put(15, 5, "u"); [[5, 10], [12, 14], [20, 10], [26, 13]].forEach(([x, y]) => put(x, y, "l")); [[8, 14], [9, 14], [22, 15]].forEach(([x, y]) => put(x, y, "z")); [[10, 11], [18, 11]].forEach(([x, y]) => put(x, y, "p"));
          put(3, 17, "v"); put(29, 12, ">"); put(28, 1, "x");
        },
        decor(g, cx, cy, d) { plaque(g, "IL PATTO", d.X(15), d.Y(5) - 2); plaque(g, "PALAZZO →", d.X(28), d.Y(12) - 2); },
      },
      mu_palazzo: {
        region: "palazzo", name: "Il Muro · Il Palazzo del Consiglio", short: "Il Palazzo del Consiglio", sub: "Porpora, oro e paura", bg: "mu_palazzo",
        w: 26, h: 20, start: [1, 10], itemCos: "mu_porpora", items: [[2, 2], [23, 2], [3, 17], [22, 17]],
        areas: [[8, 1, 17, 6, "Lo scranno del Prevosto"], [0, 0, 25, 19, "Il Palazzo del Consiglio"]],
        act: { p: "Guarda la colonna", z: "Guarda le casse", l: "Guarda la lanterna", d: "Guarda gli scaffali", u: "Guarda la tavola", "<": "Torna dentro il muro", n: "Leggi il proclama" },
        flavor: { p: "Una colonna di marmo con lo stemma del Consiglio: un muro con una corona sopra.", z: "Casse di grano. Piene. «RISERVA DEL CONSIGLIO». Nella Città Bassa le razioni sono dimezzate.", l: "Un lampadario di cristallo. Ogni goccia di luce, qui, è olio che manca nella Città Bassa.", d: "Libri rilegati in pelle: «Proclami», «Razioni», «Fuorimura: elenco». Il tuo nome è nell'ultimo.", u: "Una tavola imbandita. Un pollo intero, mai toccato. È lì per far vedere che c'è.", n: "Proclama: «IL MURO CI PROTEGGE. CHI GUARDA FUORI, GUARDA CONTRO DI NOI»" },
        intro: [["voce", "Il Palazzo del Consiglio. Tappeti porpora, colonne di marmo, lampadari accesi anche se nessuno legge. Sbuchi da un arazzo, come un ladro in un romanzo. In fondo, sullo scranno, il Prevosto Grifo ti aspetta. Sorride. Ti aspettava davvero."]],
        npcs: (s) => [{ id: "mu_grifo", at: [12, 4] }, { id: "mu_saverio", at: [9, 5] }, ...(s === 2 ? [{ id: "mu_ilse", at: [4, 12] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 0, "a"); lay(0, 19, 25, 19, "a"); lay(0, 0, 0, 19, "a"); lay(25, 0, 25, 19, "a"); put(0, 10, "<");
          lay(1, 9, 24, 11, '"'); lay(11, 2, 14, 11, '"');
          [[5, 3], [5, 8], [5, 13], [20, 3], [20, 8], [20, 13]].forEach(([x, y]) => put(x, y, "p")); [[2, 6], [23, 6], [2, 14], [23, 14]].forEach(([x, y]) => put(x, y, "l"));
          lay(9, 16, 16, 16, "u"); [[22, 9], [23, 9], [22, 11], [23, 11]].forEach(([x, y]) => put(x, y, "z")); [[1, 4], [1, 5], [24, 4], [24, 5]].forEach(([x, y]) => put(x, y, "d")); put(8, 1, "n");
        },
        decor(g, cx, cy, d) { const x = d.X(12), y = d.Y(2); R(g, x - 4, y - 10, 40, 20, "#6a1a24"); R(g, x - 4, y - 10, 40, 3, "#c9a227"); R(g, x + 8, y - 16, 16, 8, "#c9a227"); },
      },
    };

    const talk = {
      mu_ugolino() {
        const s = S();
        if (X.api.trZone() === "mu_bassa") {
          if (s === 0) return say([
            ["mu_ugolino", "Eccoti. Corvino ti ha mandato da me, vero? Quel ragazzo ha la bocca larga e il cuore giusto. Vieni. Ti porto dove nessuno, a parte il Prevosto e me, è stato da ottant'anni."],
            ["voce", "Ugolino spinge una pietra del muro, accanto al Portone. La pietra si chiama Berta. Berta si gira, come una porta. Dietro, una scala."],
          ], () => { setStep(N, 1); go("mu_cavo", 3, 15); });
          if (s >= 4) return ending();
          return say([["mu_ugolino", "Berta ti aspetta. Cioè, il muro. Cioè: andiamo."]]);
        }
        if (s === 1) {
          const n = ["l_patto", "l_quiete", "l_cerniere"].filter((k) => M().lore.includes(k)).length;
          if (n < 2) return say([["mu_ugolino", "Prima leggi, ragazzo. Gli scaffali dei Prevosti: quelli con il nastro rosso. La verità è là dentro, in fila, con la polvere sopra. Poi torna da me, al tavolo del Patto."]]);
          return twist();
        }
        return say([["mu_ugolino", "Il passaggio per il Palazzo è a est. Il Prevosto ti aspetta. Lui aspetta sempre: è il suo modo di comandare."]]);
      },
      mu_grifo() { return S() === 2 ? grifo() : say([["mu_grifo", "Andate, andate. Il popolo vuole la sua partita. Il popolo vuole sempre qualcosa."]]); },
      mu_saverio() { return say([["mu_saverio", S() >= 3 ? "Io porto solo i proclami. Ma quello di stasera… lo porterei volentieri a piedi fino al Portone." : "Il Prevosto ti riceverà. Sorridi. A lui piace quando si sorride."]]); },
      mu_ilse() {
        const s = S();
        if (X.api.trZone() === "mu_palazzo") return say([["mu_ilse", "Ti ho seguito. Non potevo lasciarti da solo con lui. Parla, {n}: io sono qui."]]);
        if (s === 3) return finalMatch();
        if (s >= 4) return say([["mu_ilse", "Il Portone, {n}. Tocca a te. Tocca a tutti, ma tocca prima a te."]]);
        return say([["mu_ilse", "…"]]);
      },
      mu_nives() { return say([["mu_nives", S() >= 4 ? "Li senti? Stanno bussando. Tre colpi. Come un calcio d'inizio." : "Ci sono. Stavolta ci sono anch'io, sul muro. Alla luce."]]); },
      mu_corvino() { return say([["mu_corvino", "Duecento anni. Duecento anni a bussare. Stanotte qualcuno risponde."]]); },
      mu_teo() { return say([["mu_teo", "Il cielo, {n}. Stanotte ce l'abbiamo tutto. Fino in fondo."]]); },
    };
    function twist() {
      X.api.play(X.lines([
        ["mu_ugolino", "Hai letto. Allora sai. Il muro non l'hanno costruito contro i Colossi. L'hanno costruito contro i borghi. Durante il Grande Inverno, le scorte bastavano per la città, non per tutti. I Primi Prevosti hanno chiuso il Portone, con loro fuori."],
        ["mu_ugolino", "E quelli di fuori hanno aspettato. Davanti al Portone. Al freddo, in silenzio. Hanno aspettato così tanto che sono diventati pietra. La Quiete, la chiamano le cronache. Erano i giocatori della Partita di Primavera, ragazzo. Quelli che la mattina dopo dovevano venire a giocare."],
        ["mu_ugolino", "Quando mio nonno era giovane, i Colossi tornarono a bussare. Tre colpi. Il Prevosto di allora fece saldare le cerniere dalla parte di dentro. Da allora il Consiglio racconta che i Colossi schiacciano. Perché la verità è peggio: siamo stati noi."],
        ["mu_ugolino", "L'ultima pagina del Patto dice che si sveglieranno quando si giocherà di nuovo la Partita di Primavera, con il Portone aperto. Grifo lo sa. Ha paura che, svegli, vengano a chiedere il conto."],
      ], "mu_cavo"), () => { ["l_patto", "l_quiete", "l_cerniere"].forEach((k) => learnLore(k, true)); setStep(N, 2); done(); });
    }
    function grifo() {
      X.api.play(X.lines([
        ["mu_grifo", "La recluta del pallone che torna. Ti aspettavo. Hai letto il Patto, immagino. Allora sai anche che non è colpa mia: io l'ho solo ereditato. Come il palazzo, gli anelli, e questa terribile vista sul muro."],
        ["mu_grifo", "Tu vuoi aprire il Portone. Bene. Ti dico cosa succede: i Colossi si svegliano, entrano, e si ricordano di chi li ha lasciati fuori. Pensi che vengano a giocare? Io penso che vengano a riprendersi il grano. E i palazzi. E la città."],
        ["mu_ilse", "(dalla porta) O forse vengono a giocare, Grifo. Abbiamo visto una mano rimandare indietro un pallone. Tu, in vita tua, cosa hai rimandato indietro?"],
      ], "mu_palazzo"), () => {
        const opts = [
          { label: "«Sfida: Partita di Primavera, davanti a tutti»", sub: "Sul muro, con il Portone pronto ad aprirsi", cls: "hot", fn: () => { bond("guardia", 1); F.set("c3_grifo", "sfida"); after("Una partita. Davanti al popolo. Sul mio muro. …Va bene. Così, quando i Colossi vi schiacceranno, il popolo avrà visto chi aveva ragione."); } },
          { label: "«Accordo: razioni piene, e il muro decide dopo»", sub: "Un compromesso con il Consiglio", fn: () => { bond("consiglio", 2); F.set("c3_grifo", "accordo"); after("Razioni piene. Generoso da parte tua, con il mio grano. Va bene. E la partita giocatela pure: il Portone resterà chiuso finché non dirò io. Siamo d'accordo?"); } },
          { label: "Smaschera Grifo con il Patto", sub: "Davanti al Consiglio riunito", fn: () => { bond("fuori", 1); bond("trust", 1); F.set("c3_grifo", "smascherato"); after("(Il Consiglio mormora. Saverio abbassa gli occhi. Grifo impallidisce, poi sorride di nuovo, più piano.) Bravo. Il popolo saprà. E allora, giochiamo questa vostra partita. Vediamo cosa scelgono, quando avranno paura."); } },
        ];
        ask("mu_grifo", "Allora, recluta. Cosa vuoi da me?", opts, "mu_palazzo");
      });
    }
    function after(line) { setStep(N, 3); say([["mu_grifo", line], ["mu_ilse", "Sul Camminamento, all'alba. La Partita di Primavera. Ugolino scenderà all'argano del Portone. Andiamo, {n}."]], () => go("mu_muro", 6, 9)); }
    function finalMatch() {
      const mate = M().trust >= 2 ? "mu_nives" : "mu_teo";
      ask("mu_ilse", "Tutta la città è sotto il muro, a guardare in su. I Fuorimura sono saliti con noi, alla luce. E laggiù, nella Terra di Fuori, i Colossi si sono fermati tutti. Guardano il campo. Pronto?", [
        { label: "⚽ Gioca la Partita di Primavera", sub: `Partita sul Muro · versione finale · con ${mate === "mu_nives" ? "Nives" : "Teo"}`, cls: "hot", fn: play },
        { label: "Un momento", fn: done },
      ], "mu_muro");
      function play() {
        X.wallMatch({ title: "La Partita di Primavera", us: "Guardia e Fuorimura", mate, mateShirt: mate === "mu_nives" ? "#3a3a42" : "#5a5a62", bg: "mu_muro", friendly: true, wind: true, half: 45, handRate: 360,
          opp: { name: "Guardie del Consiglio", kit: "#6a1a24", names: ["Saverio", "Capitano Ferro"] }, halftime: "Fine del primo tempo. Sotto il muro, la città canta. Fuori dal muro, per la prima volta da duecento anni, i Colossi battono le mani. Piano. Come un tuono lontano.",
          done: (r) => {
            if (!r.win) return ask("mu_ilse", `${r.a} a ${r.b}. Non è finita, {n}. La primavera non finisce con una partita persa. Un'altra.`, [{ label: "⚽ Rigioca la Partita di Primavera", cls: "hot", fn: play }, { label: "Più tardi", fn: done }], "mu_muro");
            const msg = X.reward("mu_c3_primavera", { coins: 80 });
            X.api.play(X.lines([
              ["voce", `${r.a} a ${r.b}. Fischio finale. Per un attimo, silenzio. ${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}`],
              ["voce", "Poi, dalla Terra di Fuori, tre colpi. TOC. TOC. TOC. Sul Grande Portone. Tutta la città si gira. Tutti i Colossi sono davanti al muro, in fila, come una squadra che aspetta di entrare in campo."],
              ["mu_ilse", "Al Portone, {n}. Ugolino è all'argano. La scelta è tua: l'hai guadagnata."],
            ], "mu_muro"), () => { learnLore("l_primavera", true); setStep(N, 4); go("mu_bassa", 29, 4); });
          } });
      }
    }
    // ---------------------------------------------------------------- i finali, davanti al Portone
    function ending() {
      const m = M(), sk = F.get("sketches", 0), secret = m.trust >= 4 && m.lore.length >= 10 && sk >= 3;
      const opts = [{ label: "🚪 Apri il Portone", sub: "Ugolino gira l'argano. Le cerniere si spezzano.", cls: "hot", fn: () => fin("aperto") }];
      if (m.consiglio >= 4) opts.push({ label: "🧱 Lascia il Portone chiuso", sub: "La città è salva così. Forse.", fn: () => fin("chiuso") });
      if (m.fuori >= 3) opts.push({ label: "🌄 Esci con i Fuorimura", sub: "Il mondo è più grande del muro", fn: () => fin("via") });
      if (secret) opts.push({ label: "🏟️ Il Muro è una tribuna", sub: "Un'idea che ti viene guardando i Colossi in fila", cls: "hot", fn: () => fin("tribuna") });
      opts.push({ label: "Non ancora", fn: done });
      ask("mu_ugolino", `Le mani sull'argano, ragazzo. Dall'altra parte bussano. Dalla nostra parte, tutta la città trattiene il fiato.\nCosa facciamo?${S() >= 5 ? "\n(Hai già visto un finale: puoi sceglierne un altro, se le tue scelte lo permettono.)" : ""}`, opts, "mu_bassa");
    }
    const ENDS = {
      aperto: { cos: "mu_aperto", lines: [
        ["voce", "Ugolino gira l'argano. Le catene gemono, le cerniere saldate si spezzano con un rumore che si sente fino al Palazzo. Il Grande Portone si apre, dopo ottant'anni, su un'alba arancione."],
        ["voce", "Davanti al Portone, il Colosso numero 14 si inginocchia. Mette una mano sulla soglia. E la pietra, piano, si crepa. Sotto c'è la pelle di un uomo vecchissimo, con una maglia gialla scolorita e un salice ricamato sul petto."],
        ["mu_ugolino", "Bentornato. Scusa il ritardo. Duecento anni di ritardo."],
        ["voce", "Uno alla volta, i Colossi si svegliano. Non schiacciano niente. Entrano in città guardandosi intorno, piano, come chi torna a casa dopo un lungo inverno. Qualcuno chiede del grano. Qualcuno chiede dove sia il campo."],
        ["mu_teo", "Il cielo, {n}! Adesso è grande anche quaggiù!"],
      ] },
      chiuso: { cos: "mu_chiuso", lines: [
        ["voce", "Metti una mano su quella di Ugolino, sull'argano. «No», dici. «Non ancora.» Ugolino ti guarda a lungo. Poi lascia andare."],
        ["mu_grifo", "Saggio. Il popolo ti ringrazierà. Il Consiglio ti ringrazierà. Razioni piene per tutti, da domani. Lo prometto davanti a tutti: così devo mantenerlo."],
        ["voce", "Dall'altra parte del Portone i colpi continuano per un po'. Poi smettono. I Colossi si allontanano piano nella nebbia, uno dopo l'altro, e tornano ai loro giri."],
        ["mu_ilse", "Hai salvato la città, {n}. Da cosa, non lo sapremo mai. Forse è il prezzo di comandare: non saperlo mai."],
        ["voce", "Cintavecchia vive tranquilla, al sicuro, con le razioni piene. Ogni primavera qualcuno bussa tre volte al Portone. E ogni primavera, sul muro, la Guardia gioca una partita un po' più forte, perché laggiù la sentano."],
      ] },
      via: { cos: "mu_via", lines: [
        ["mu_nives", "Il Portone non è l'unica porta, {n}. Ci sono le calate. C'è la Terra di Fuori. C'è tutto il resto del mondo, che nessuno di noi ha mai visto."],
        ["mu_corvino", "I Fuorimura partono stanotte. Verso ovest, verso il Borgo dei Salici, e oltre. Cerchiamo gli altri borghi, le altre città, se ci sono. Vieni?"],
        ["voce", "Lasci il mantello rosso a Teo, che piange e ride insieme. Ti cali dal muro con una sacca, un pallone e il Taccuino. I Colossi vi guardano passare in fila, nell'erba alta, senza fermarvi."],
        ["voce", "Il Colosso numero 14 vi accompagna per un pezzo di strada. Poi si siede su una collina, e vi guarda andare. Come un vecchio portiere che guarda partire la squadra in trasferta."],
        ["mu_nives", "Guarda, {n}. L'orizzonte. Non finisce."],
      ] },
      tribuna: { cos: "mu_tribuna", lines: [
        ["voce", "Guardi i Colossi in fila davanti al muro. Guardi la città che guarda in su. Guardi il muro: largo come una strada, alto quaranta uomini. Una tribuna. È sempre stato una tribuna."],
        ["voce", "«Non apriamo il Portone», dici. «Apriamo il campo.» E Ugolino capisce, e ride, e gira l'argano: il Portone si apre, ma nessuno entra e nessuno esce. Si scende tutti nella Terra di Fuori, dove c'è il Campo Vecchio."],
        ["voce", "La Partita di Primavera si gioca alle Rovine, duecento anni dopo: Cintavecchia contro il Borgo dei Salici. Sulle gradinate crepate, la città. Tutt'intorno, seduti nell'erba come giganti in curva, i Colossi."],
        ["voce", "Al primo gol, i Colossi si alzano in piedi tutti insieme, e la pietra si sbriciola dalle spalle come neve. Sotto ci sono persone. Vecchie, stupite, contente. Il Colosso numero 14 grida «GOL!» con una voce che non usa da due secoli."],
        ["mu_nives", "Te l'avevo detto, {n}. Non venivano per schiacciare. Venivano a vedere la partita."],
        ["voce", "Il finale segreto. Da quel giorno, il muro resta in piedi: è la tribuna più grande del mondo. E ogni primavera, si gioca."],
      ] },
    };
    function fin(id) {
      const e = ENDS[id];
      X.api.play(X.lines(e.lines, "mu_finale"), () => {
        X.end(id); finishChapter(N, id); setStep(N, 5);
        const msg = [...X.reward("mu_c3_fine", { coins: 120, cos: "mu_c3" }), ...X.reward("mu_fin_" + id, { coins: 40, cos: e.cos })];
        const E2 = X.ENDINGS[id], m = M();
        X.scene([["voce", `<b>FINE · ${E2[0]}</b><br>${E2[1]}<br><br>Finali trovati: ${m.ends.length} su ${Object.keys(X.ENDINGS).length}.${m.ends.length < 4 ? " Altre scelte, altri finali: rigioca i capitoli dal menu." : " Li hai trovati tutti. I Colossi ti salutano."}${msg.length ? "<br>" + msg.join(" · ") : ""}`]], done, "mu_finale");
      });
    }
    const obj = {
      "mu_cavo:d": (o) => { const k = SHELVES[o.tx + "," + o.ty] || SHELVES[(o.tx - 1) + "," + o.ty]; if (!k) return say([["voce", "Registri di razioni, elenchi di nomi, proclami. Duecento anni di Consiglio in fila sugli scaffali."]]); learnLore(k); X.SFX.sketch(); say([["voce", "Uno scaffale con il nastro rosso dei Primi Prevosti. Sfogli i documenti alla luce della lanterna."], ["voce", `Nel Taccuino: «${k === "l_patto" ? "Il Patto della Cinta" : k === "l_quiete" ? "La Quiete di Pietra" : "Le cerniere saldate"}». (Aprilo dal menu per rileggerlo.)`]]); },
      "mu_cavo:u": () => (S() === 1 ? talk.mu_ugolino() : say([["voce", "Il tavolo del Patto. Sopra, la copia originale, aperta all'ultima pagina."]])),
      "mu_cavo:v": () => go("mu_bassa", 29, 4),
      "mu_cavo:>": () => (S() >= 2 ? go("mu_palazzo", 1, 10) : say([["mu_ugolino", "Il passaggio per il Palazzo. Prima leggi, ragazzo, e parla con me."]])),
      "mu_palazzo:<": () => go("mu_cavo", 28, 12),
      "mu_bassa:c": () => (S() >= 4 ? ending() : say([["voce", S() === 0 ? "Il Grande Portone. Stanotte, accanto, c'è Mastro Ugolino con una lanterna. Ti fa cenno di avvicinarti." : "Il Grande Portone. Dall'altra parte, il silenzio. Per ora."]])),
      "mu_bassa:k": () => (S() >= 4 ? ending() : say([["voce", "L'argano del Portone. Ruggine e nidi."]])),
    };
    return {
      n: N, title: "La Partita di Primavera", sub: "Dentro il muro, il Palazzo, la partita, il Portone", start: "mu_bassa", goal, zones, talk, obj, introBg: "mu_bassa",
      patch: {
        mu_bassa: { npcs: (s, list) => list.filter((n) => !["mu_ugolino", "mu_corvino", "mu_nives", "mu_teo"].includes(n.id)).concat([{ id: "mu_ugolino", at: [29, 5] }], s >= 4 ? [{ id: "mu_nives", at: [25, 5] }, { id: "mu_corvino", at: [32, 6] }, { id: "mu_teo", at: [22, 5] }, { id: "mu_ilse", at: [27, 7] }] : []),
          top(g, cx, cy, d, s) { if (s < 4) return; for (let i = 0; i < 4; i++) X.colossus(g, d.X(22 + i * 4) + 8, d.Y(0) + 4 + Math.sin(d.fr / 40 + i) * 2, Math.PI / 2, d.fr, { s: 0.6, ph: i, num: ["14", "7", "9", "1"][i] }); } },
        mu_muro: { npcs: (s, list) => (s >= 3 ? [{ id: "mu_ilse", at: [8, 8] }, { id: "mu_teo", at: [10, 9] }, { id: "mu_nives", at: [11, 7] }, { id: "mu_corvino", at: [37, 8] }] : list) },
      },
      news: (id, s) => (id === "mu_ugolino" && (s === 0 || s === 1 || s === 4)) || (id === "mu_grifo" && s === 2) || (id === "mu_ilse" && s === 3),
      intro: () => [
        ["voce", "Notte, nella Città Bassa. Le calate sono chiuse, le guardie del Consiglio girano per i vicoli con le torce. Sulle porte dei Fuorimura qualcuno ha disegnato un muro con una croce sopra."],
        ["voce", "Corvino ti ha detto un nome: Ugolino. E una cosa: le cerniere del Portone sono saldate dalla parte di dentro. Il vecchio muratore ti aspetta davanti al Portone, con una lanterna."],
      ],
    };
  }
  boot();
})();
