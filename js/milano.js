// js/milano.js - «OPERAZIONE FUORIGIOCO NOIR · MILANO 1954» · configurazione della saga su js/saga-core.js
// Giallo noir d'epoca nella Milano del novembre-dicembre 1954: nebbia sui Bastioni, il tram 19, il night club
// «La Lucciola», l'Arena Civica nel fango, i Navigli d'inverno e la sera di Sant'Ambrogio alla Scala.
// Il Campione gioca nei Ferrovieri di Porta Ticinese e indaga con il Commissario De Santis su un giro di partite comprate.
// Restaurata e allungata a 5 capitoli (4 nov 2026): 34 personaggi, interni a mano, tre scelte che pesano sul finale.
// Meccaniche:
//  - PEDINAMENTO TATTICO (js/pedinamento.js, sul kit partita): notte, nebbia, riflettori che girano, arbitro comprato,
//    il fiuto che si carica pedinando nell'ombra.
//  - IL TACCUINO DEI VERBALI (K.interroga): sei verbali dattiloscritti, si rileggono nel diario.
//  - PROVE DA PRESENTARE (K.evidence / K.present del motore) nei confronti dei capitoli 4 e 5.
//  - IL PESO (cfg.weight del motore): Legge, Pietà, Ombra. Le scelte lo spostano e aprono o chiudono i finali.
//  - RAPPORTI (cfg.bonds del motore): Mara, Ines, De Santis, Nando, Peppino hanno scene che si aprono a soglia.
(function () {
  "use strict";
  if (window.__milano || !window.__sagaCore) return;

  const VERBALI = {
    biglietto: ["VERBALE N° 1 · IL BIGLIETTO DEL TRAM N° 19", "REPERTO: cartoncino con doppia punzonatura della corsa delle 22:45", "«L'ALIBI DEL CAPOLINEA»",
      "Due fori invece di uno, e il secondo è a forma di stella. Le vincite delle scommesse si pagano così: in biglietti del tram, che non insospettiscono nessuno. Chi li punzona ha una pinza speciale."],
    valigia: ["VERBALE N° 2 · LA VALIGIA IN FIBRA VULCANIZZATA", "REPERTO: valigia marrone, chiusure d'ottone, mazzette da mille lire", "«IL FONDO CASSA»",
      "Nel camerino della Lucciola. Dentro: quaranta mazzette e un elenco di undici nomi di calciatori, ognuno con una cifra accanto. Le cifre sono piccole. Si vendono per poco, quelli che hanno fame."],
    fischietto: ["VERBALE N° 3 · IL FISCHIETTO D'OTTONE BRUNITO", "REPERTO: fischietto da arbitro con la sfera di sughero piombata", "«IL FUORIGIOCO A COMANDO»",
      "Il suono è diverso: più basso, più lungo. Chi gioca lo riconosce. È il segnale per i difensori comprati: al fischio lungo, ci si ferma e si alza il braccio."],
    spartito: ["VERBALE N° 4 · LO SPARTITO DI «NUSTALGIA»", "REPERTO: spartito per pianoforte, note a matita, un numero di telefono nel pentagramma", "«LA NOTTE DELLA MADONNINA»",
      "Le note non suonano: sono numeri. Il numero di telefono è di un ufficio in via Manzoni. Sulla porta di quell'ufficio c'è una targa d'ottone: «Acciaierie Balestrini»."],
    assegno: ["VERBALE N° 5 · L'ASSEGNO NEL GUANTO", "REPERTO: assegno circolare piegato in otto, trovato nel guanto da portiere di Nando Colombo", "«IL PREZZO DI UN PORTIERE»",
      "Duecentomila lire, firma illeggibile, banca di via Manzoni. Non incassato. Nando l'aveva tenuto in tasca tutta la notte. Non l'aveva incassato: l'aveva tenuto come prova."],
    registro: ["VERBALE N° 6 · IL REGISTRO DELLE VISITE", "REPERTO: registro delle visite notturne della Questura centrale, pagina del 16 novembre", "«LA FIRMA DI TROPPO»",
      "Alle 23:10 del 16 novembre, la notte in cui è morto Nando, una visita al Questore Vitali. Il visitatore ha firmato col nome intero, per abitudine di chi non ha mai avuto paura: G. Balestrini."],
  };

  const E = window.__sagaCore.create({
    id: "milano",
    key: "ali-di-rondine.milano",
    title: "Operazione Fuorigioco Noir · Milano 1954",
    icon: "🕵️",
    bg: "mn_titolo",
    chapters: 5,
    menuSub: "Nebbia sui Bastioni, bische, un derby comprato e un portiere che non voleva più perdere. Milano, inverno 1954.",
    theme: { accent: "#fde68a", ink: "#0f172a", paper: "rgba(241,245,249,.96)", font: "'Courier New', Courier, monospace", chipBg: "#e2e8f0", chipBorder: "#475569" },
    stats: {
      biglietti: [0, 999, 12, "Biglietti del Tram (🎫)"],
      sospetto: [0, 99, 10, "Sospetto della Questura"],
      fiuto: [0, 99, 25, "Fiuto Investigativo"],
      legge: [0, 9, 0, "Legge"],
      pieta: [0, 9, 0, "Pietà"],
      ombra: [0, 9, 0, "Ombra"],
    },
    weight: { name: "Il Peso delle Scelte", axes: { legge: ["Legge", "⚖️"], pieta: ["Pietà", "🕯️"], ombra: ["Ombra", "🌫️"] } },
    bonds: {
      talk: 3, per: 8, max: 5, names: ["Sconosciuti", "Conoscenti", "Alleati", "Fidati", "Complici", "Fratelli di nebbia"],
      scenes: {
        mn_nando: [{ lv: 1, id: "nando1", lines: [
          ["mn_nando", "Lo sai perché ho scelto la porta? Da bambino ero il più piccolo. In porta non ti chiede nessuno di correre: ti chiedono solo di non avere paura."],
          ["mn_nando", "Io la paura ce l'ho. Sempre. Ma la tengo in tasca, come il fazzoletto. Ogni tanto la tiro fuori e mi ci soffio il naso."],
          ["hero", "E adesso cosa c'è in tasca?"],
          ["mn_nando", "[ride, ma non ride con gli occhi] Adesso? Un debito con uno che non sa aspettare. Ma passerà. Tutto passa, a Milano. Anche il tram, prima o poi."]], reward: (K) => K.bond("fiuto", 3) }],
        mn_ines: [{ lv: 2, id: "ines1", lines: [
          ["mn_ines", "In redazione mi chiamano «la signorina dello sport», come se fosse un difetto di fabbrica. Mi danno le partite di Promozione e i necrologi."],
          ["mn_ines", "Sai qual è la differenza tra un tabellino e un necrologio? Nessuna. Nomi, numeri, e uno che alla fine ha perso."],
          ["hero", "Allora perché lo fai?"],
          ["mn_ines", "Perché un giorno scriverò un pezzo che li costringerà a mettermi in prima pagina. E non sarà un tabellino."]], reward: (K) => K.bond("fiuto", 4) }],
        mn_mara: [{ lv: 2, id: "mara1", lines: [
          ["mn_mara", "[si toglie gli orecchini, li posa nel portacipria] Sono di vetro. Tutti credono che siano veri. Anche io, certe sere."],
          ["mn_mara", "Sono arrivata a Milano nel '46 con una valigia di cartone e una voce. La valigia l'ho buttata. La voce l'ho venduta a rate."],
          ["mn_mara", "Don Carmine non è il peggio, sai. Il peggio è chi non entra mai alla Lucciola. Chi manda gli altri."]], reward: (K) => K.weight.add("pieta", 1) }],
        mn_desantis: [{ lv: 3, id: "desantis1", lines: [
          ["mn_desantis", "[accende la sigaretta, la guarda bruciare senza fumarla] Mia moglie diceva che fumavo per avere qualcosa da fare con le mani quando non sapevo cosa dire."],
          ["mn_desantis", "È morta nel '48. Un inverno come questo. Le medicine costavano, e io facevo il commissario con uno stipendio da commissario."],
          ["mn_desantis", "[lascia cadere la sigaretta nella pozzanghera] Non è una storia per stasera. Un giorno te la finisco."]], reward: (K) => K.bond("fiuto", 3) }],
        mn_peppino: [{ lv: 2, id: "peppino1", lines: [
          ["mn_peppino", "Il Guercio, mi chiamano. Sai come l'ho perso, l'occhio? Non in una rissa. In fabbrica, alla Breda, nel '41. Una scheggia di tornio."],
          ["mn_peppino", "Il padrone mi ha dato una medaglia e il benservito. Da allora conto i soldi degli altri. Almeno quelli non mi cavano niente."]], reward: (K) => K.bond("biglietti", 20) }],
      },
    },
    travel: true,
    item: ["Biglietto del Tram", "Biglietti del Tram"],
    drawItem(g, x, y, i, f) {
      g.save(); g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.fillStyle = "#e7dcc0"; g.fillRect(-6, -4, 12, 8); g.strokeStyle = "#7c5a2a"; g.lineWidth = 1; g.strokeRect(-6, -4, 12, 8);
      g.fillStyle = "#b91c1c"; g.fillRect(-4, -2, 2, 4); g.fillStyle = "#334155"; g.fillRect(0, -2, 4, 1); g.fillRect(0, 1, 4, 1);
      g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,230,160,${0.25 + 0.2 * Math.sin(f / 8 + i)})`; g.fillRect(-7, -5, 14, 10);
      g.restore();
    },
    stadium: {
      azPitch: "cortile", cageField: 2, cageMut: "night", weather: "rain",
      venue: {
        ads: [["AMARO DEL TRAM", "#b91c1c"], ["CORRIERE D'INFORMAZIONE", "#1e293b"], ["CAFFÈ DEI BASTIONI", "#15803d"], ["TONDINO BALESTRINI", "#d97706"]],
        crowd: ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8"], ground: ["#2d3748", "#1a202c"], line: "rgba(203,213,225,.6)", grid: "rgba(148,163,184,.15)",
        sky: ["#0f172a", "#1e293b"], wall: ["#334155", "#1e293b"], fx: { fr: 1.25, spd: 0.92, wind: 0.4 },
      },
    },
    regions: {
      bastioni: { grass: ["#253041", "#1f2937", "#1b2432"], path: ["#5b4636", "#523f31"], stone: ["#4b5563", "#3f4754"], wall: ["#111827", "#0b1220"], water: ["#1e3a5f", "#172f4d"], tall: "#64748b", tree: ["#1f3a2a", "#173022"], tint: "40,60,120", tintA: 0.12, fx: "fog", dark: 0.3 },
      lucciola: { grass: ["#2d1b2e", "#24152a", "#1d1122"], path: ["#6b2150", "#5a1a44"], stone: ["#4a2040", "#3d1a35"], wall: ["#1a0f1c", "#120a14"], water: ["#4c1d95", "#2e1065"], tall: "#a855f7", tree: ["#3b0764", "#2a0550"], tint: "236,180,254", tintA: 0.08, fx: "", dark: 0.12 },
      arena: { grass: ["#2f3b27", "#2a3523", "#24301f"], path: ["#5b5148", "#4d443c"], stone: ["#52525b", "#3f3f46"], wall: ["#18181b", "#0f0f12"], water: ["#1e293b", "#0f172a"], tall: "#71717a", tree: ["#1a3a24", "#14301e"], tint: "228,228,231", tintA: 0.06, fx: "rain", dark: 0.14 },
      naviglio: { grass: ["#3a3f36", "#33382f", "#2d3229"], path: ["#8a7f70", "#7a705f"], stone: ["#6b6258", "#5d554c"], wall: ["#2a2620", "#201d18"], water: ["#2c4a5a", "#264251"], tall: "#8a8a7a", tree: ["#3a4a2a", "#2f3d22"], tint: "90,100,120", tintA: 0.1, fx: "fog", dark: 0.12 },
      scala: { grass: ["#e8edf3", "#dfe6ee", "#d6dee8"], path: ["#9ca3af", "#8b929e"], stone: ["#a8a29e", "#97918c"], wall: ["#3a2a20", "#2c2018"], water: ["#1e3a5f", "#172f4d"], tall: "#cbd5e1", tree: ["#2a4a3a", "#203c2e"], tint: "255,235,200", tintA: 0.08, fx: "snow", dark: 0.12 },
    },
    floors: "Y",
    // pavimenti: il pavé milanese (sampietrini a ventaglio) al posto della pietra liscia, e le pozzanghere che riflettono i lampioni
    floorPaint(K, f, sx, sy, tx, ty) {
      if (f !== "+" || K.ZX.spec && K.ZX.spec.interior) return false;
      const R = K.ZX.rg, P = K.P, c0 = R.stone[0], c1 = R.stone[1];
      P(sx, sy, 16, 16, "#161b24");
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const ox = (r % 2) * 2, x = sx + c * 4 + ox - 1, y = sy + r * 4; P(x, y, 3, 3, (tx * 3 + ty * 5 + r + c) % 4 ? c0 : c1); P(x, y, 3, 1, "rgba(255,255,255,.08)"); }
      const h = (tx * 73 + ty * 131) % 23;
      if (h === 0) { P(sx + 2, sy + 9, 11, 4, "rgba(40,60,90,.75)"); P(sx + 4, sy + 10, 5, 1, "rgba(253,230,138,.45)"); }
      return true;
    },
    solid: "OKCRAE",
    paint: {
      // binari del tram (pavimento con rotaie: si cammina sopra) → li disegna il pavimento «:» con le rotaie sovrapposte via decor
      Y(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.P(sx, sy + 3, 16, 10, "#3a2a1a"); K.P(sx, sy + 4, 16, 1, "#9ca3af"); K.P(sx, sy + 11, 16, 1, "#9ca3af"); for (let i = 0; i < 4; i++) K.P(sx + 1 + i * 4, sy + 3, 2, 10, "#5a3a22"); },
      O(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 7); K.P(sx + 2, sy + 2, 12, 12, "#7c2d12"); K.P(sx + 3, sy + 3, 10, 10, "#9a3412"); K.P(sx + 5, sy - 3, 6, 6, "#fbbf24"); const h = 2 + Math.abs(Math.sin(fr / 6)) * 2; K.P(sx + 6, sy - 3 - h, 4, h, "rgba(255,255,255,.35)"); K.light(sx + 8, sy, 18, "255,170,80", 0.35); },
      // edicola dei giornali con le locandine
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 7); K.P(sx + 1, sy + 1, 14, 14, "#14532d"); K.P(sx + 1, sy + 1, 14, 3, "#166534"); K.P(sx + 3, sy + 5, 10, 8, "#f5f5f4"); K.P(sx + 4, sy + 6, 8, 1, "#111827"); K.P(sx + 4, sy + 8, 6, 1, "#b91c1c"); K.P(sx + 4, sy + 10, 7, 1, "#111827"); },
      // carrozza del tram (si accosta in fila: verde sopra, crema sotto, finestrini accesi)
      C(K, sx, sy, tx, ty) { const top = K.at(tx, ty - 1) !== "C"; K.P(sx, sy, 16, 16, "#365314"); K.P(sx, sy + 10, 16, 6, "#e7dcc0"); if (top) K.P(sx, sy, 16, 2, "#1a2e05"); K.P(sx + 3, sy + 3, 10, 6, "#0f172a"); K.P(sx + 4, sy + 4, 8, 4, (tx + ty) % 3 ? "#fcd34d" : "#1e293b"); K.P(sx, sy + 15, 16, 1, "#1c1917"); },
      // colonnina dei manifesti (la Fiera, il derby, la Vestale)
      A(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 6); K.P(sx + 3, sy - 6, 10, 21, "#57534e"); K.P(sx + 4, sy - 4, 8, 6, "#fde68a"); K.P(sx + 4, sy + 3, 8, 6, (tx % 2) ? "#fca5a5" : "#93c5fd"); K.P(sx + 2, sy - 8, 12, 3, "#292524"); },
      // banco del bar / scrittoio (interni)
      E(K, sx, sy, tx, ty) { K.P(sx, sy, 16, 16, "#4a2a18"); K.P(sx, sy, 16, 4, "#7c4a2a"); K.P(sx, sy + 4, 16, 1, "#c8a050"); K.P(sx + 3, sy - 3, 2, 4, "#14532d"); K.P(sx + 9, sy - 2, 3, 3, "#fef3c7"); },
      R(K, sx, sy, tx, ty) { K.P(sx, sy, 16, 16, "#7f1d1d"); K.P(sx, sy, 16, 3, "#991b1b"); for (let i = 0; i < 4; i++) K.P(sx + i * 4 + 1, sy + 3, 1, 13, "rgba(0,0,0,.3)"); K.P(sx, sy + 14, 16, 2, "#fbbf24"); },
    },
    act: { K: "Guarda l'edicola", C: "Guarda il tram", A: "Leggi i manifesti", E: "Appoggiati al banco", Y: "Guarda i binari", O: "Scaldati al braciere", R: "Tocca il velluto", l: "Guarda il lampione", s: "Riposa", b: "Siediti" },
    rest: { ch: "s", label: "Riposa", text: "Un caffè corretto e il giornale della sera. Gli indizi si mettono in fila da soli, quando smetti di tirarli." },
    journal: { name: "Il Taccuino dei Verbali", sub: "Verbali, persone, scelte e finali", html: (K) => {
      const got = Object.keys(VERBALI).filter((k) => K.F.is("vb_" + k));
      return `<b>📁 Verbali (${got.length}/${Object.keys(VERBALI).length})</b><br>` + (got.length ? got.map((k) => `• <b>${K.esc(VERBALI[k][0])}</b><br><span style="color:var(--dim)">${K.esc(VERBALI[k][3])}</span>`).join("<br>") : "<span style='color:var(--dim)'>Nessun verbale, per ora.</span>") + (K.weight ? K.weight.html() : "");
    } },
    endings: {
      legge: ["La Giustizia dei Bastioni", "Il dossier va alla Procura, non alla Questura. Un processo lungo, articoli di Ines in prima pagina, e un Commendatore che per la prima volta aspetta in corridoio come tutti.", "Consegna tutto a chi non ha amici in via Manzoni."],
      riscatto: ["Il Patto della Lucciola", "Lasci a Mara il suo biglietto per Parigi e ai Ferrovieri i soldi della valigia. La giustizia non arriva in tribunale: arriva in uno spogliatoio con le docce calde, finalmente.", "Fidati di Mara, e lascia che la pietà ti guidi la mano."],
      solitario: ["Il Passo nella Nebbia", "Lasci il dossier sul tavolo di De Santis e cammini sui binari del 19 fino al capolinea. Milano non ti deve niente. Tu nemmeno.", "Andartene a piedi, senza voltarti."],
      silenzio: ["Il Prezzo del Silenzio", "Prendi la busta del Commendatore. La stagione dopo i Ferrovieri hanno un campo nuovo con la tribuna coperta. Su una targa c'è scritto «Dono delle Acciaierie Balestrini». Tu ci passi davanti ogni domenica.", "Accetta il prezzo, se l'Ombra ti pesa abbastanza."],
      verita: ["Il Dossier Segreto del '54", "Finale segreto. Peppino porta il libro mastro, Brambilla testimonia, De Santis firma la sua confessione accanto a quella del Questore. Ines ha la sua prima pagina. Sulla tomba di Nando qualcuno lascia un paio di guanti nuovi.", "Un informatore libero, un arbitro che parla, tutti e sei i verbali."],
    },
    guest: { id: "mn_desantis", lines: [
      "Un saluto da Milano, figliolo. Qui da voi la nebbia non sa fare il suo mestiere: si vede tutto.",
      "Ti ho portato il Corriere d'Informazione. In prima pagina c'è un pezzo di Ines Ferrario. Sì, in prima pagina.",
      "Ogni tanto passo dal Naviglio e lascio un fiore. Non dico per chi. Lo sai.",
    ] },
    cameos: [{ id: "dz_sterling", zone: "mn_foyer", at: [4, 9], when: (K) => { const s = K.otherSaga("ali-di-rondine.spia"); return !!(s && s.ends && s.ends.length); }, lines: [
      ["dz_sterling", "Smoking, scarpe lucide, e un posto in platea che non ho pagato. Sono qui per la Vestale. Ufficialmente."],
      ["dz_sterling", "Ufficiosamente: il Commendatore Balestrini vende tondino di ferro a gente con cui il mio servizio non vorrebbe che facesse affari. Se lo inchiodi tu, io stasera mi godo il secondo atto."],
      ["hero", "E se non ci riesco?"], ["dz_sterling", "Allora mi godo il secondo atto lo stesso. Ma con meno appetito."]] }],
  });

  const { api, K } = E;

  // IL TACCUINO DEI VERBALI: legge un verbale dattiloscritto, lo segna (flag vb_<id>) e dà i premi
  K.interroga = function (id, premi, poi) {
    const v = VERBALI[id]; if (!v) { if (poi) poi(); return; }
    const nuovo = !K.F.is("vb_" + id); K.F.set("vb_" + id, true);
    if (nuovo && premi) { if (premi.biglietti) K.bond("biglietti", premi.biglietti); if (premi.fiuto) K.bond("fiuto", premi.fiuto); if (premi.sospetto) K.bond("sospetto", premi.sospetto); }
    K.say([["voce", `<b>${v[0]}</b><br><small style="color:#64748b;">${v[1]}</small>`], ["voce", `<em>${v[2]}</em><br>${v[3]}`]], () => {
      if (nuovo && window.toast) window.toast(`Verbale acquisito: ${v[2]}`, "info", "📁");
      if (poi) poi(); else K.done();
    });
  };
  K.verbali = () => Object.keys(VERBALI).filter((k) => K.F.is("vb_" + k)).length;
  K.VERBALI = VERBALI;
  // targhetta sopra porte e insegne (nel decor delle zone)
  K.plaque = (g, txt, x, y, col) => { g.font = "bold 7px 'Courier New', monospace"; const w = g.measureText(txt).width + 10; g.fillStyle = "rgba(10,14,22,.86)"; g.fillRect(x - w / 2, y - 8, w, 11); g.fillStyle = col || "#fde68a"; g.fillRect(x - w / 2, y + 2, w, 1); g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; };
  // dialoghi brevi: K.chat(righe, poi) = K.say con il «fatto» alla fine
  K.chat = (ls, then) => K.say(ls, typeof then === "function" ? () => { then(); } : K.done);

  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);
    const C = (id, look, bio) => K.cast(id, look, bio);
    // — i protagonisti dell'indagine
    C("mn_desantis", { name: "Commissario De Santis", sub: "Squadra Mobile", tag: "gray", style: "slick", hair: "#475569", skin: "#d6c3a8", eye: "#0f172a", shirt: "#334155", beard: "baffi", acc: ["taccuino"], bg: ["#1e293b", "#64748b"] }, "Squadra Mobile di Milano. Impermeabile chiaro, sigaretta sempre accesa e mai fumata, un fiuto da segugio. Ha perso la moglie nell'inverno del '48 e da allora non ha più chiesto un giorno di ferie.");
    C("mn_ines", { name: "Ines Ferrario", sub: "Cronista del Corriere d'Informazione", tag: "", style: "bob", hair: "#3b2416", skin: "#f1d5b5", eye: "#1e3a8a", shirt: "#7c2d12", acc: ["taccuino"], bg: ["#7c2d12", "#1c1917"] }, "L'unica donna nella redazione sportiva del Corriere d'Informazione. Le danno le partite di Promozione e i necrologi. Lei li scrive meglio di chiunque, e aspetta.");
    C("mn_nando", { name: "Nando Colombo", sub: "Portiere dei Ferrovieri", tag: "", style: "messy", hair: "#2a1d14", skin: "#e8c39e", eye: "#3f6212", shirt: "#7f1d1d", acc: ["guanti"], bg: ["#7f1d1d", "#1c1917"] }, "Portiere dei Ferrovieri di Porta Ticinese, scambista delle Ferrovie di giorno. Allena i bambini del quartiere il sabato. Ha un debito che non racconta a nessuno, nemmeno a sua moglie.");
    C("mn_mara", { name: "«La Bionda» Mara", sub: "Cantante della Lucciola", tag: "gold", style: "wavy", hair: "#e8d08a", skin: "#fdf2f8", eye: "#2563eb", shirt: "#581c87", acc: ["fiore"], bg: ["#581c87", "#1a0f1c"] }, "La voce della Lucciola. Arrivata a Milano nel '46 con una valigia di cartone. Tiene i conti di Don Carmine e un biglietto di sola andata per Parigi in fondo al portacipria.");
    C("mn_carmine", { name: "Don Carmine", sub: "Il «Presidente Ombra» dei Bastioni", tag: "gray", style: "slick", hair: "#94a3b8", skin: "#e2e8f0", eye: "#0f172a", shirt: "#0f172a", beard: "baffi", acc: ["occhiali"], bg: ["#0f172a", "#334155"] }, "Tiene il banco delle scommesse da Porta Ticinese a Porta Romana. Elegante, impassibile, bastone d'ebano. Crede di essere lui a comandare. È la cosa più ingenua che abbia mai creduto.");
    C("mn_balestrini", { name: "Commendator Balestrini", sub: "Acciaierie Balestrini", tag: "gold", style: "slick", hair: "#e5e7eb", skin: "#f3d9c0", eye: "#78350f", shirt: "#1f2937", beard: "baffi", acc: ["medaglia"], bg: ["#78350f", "#1c1917"] }, "Il re del tondino di ferro: metà dei palazzi della ricostruzione stanno in piedi sul suo acciaio. Mecenate, benefattore, presidente onorario di tre società sportive. Sorride sempre, anche quando non c'è niente da ridere.");
    C("mn_vitali", { name: "Questore Vitali", sub: "Questura centrale", tag: "gray", style: "buzz", hair: "#9ca3af", skin: "#e5d3c0", eye: "#1f2937", shirt: "#111827", acc: ["medaglia"], bg: ["#111827", "#374151"] }, "Il superiore di De Santis. Ordinato, cortese, sempre di fretta. Firma tutto con la stessa penna stilografica d'oro, regalo di un amico.");
    C("mn_peppino", { name: "Peppino il Guercio", sub: "Allibratore del capolinea", tag: "blue", style: "messy", hair: "#1e293b", skin: "#cbd5e1", eye: "#0f172a", shirt: "#475569", scar: true, acc: ["coppola"], bg: ["#0f172a", "#475569"] }, "Allibratore del capolinea del 19. Ha perso un occhio alla Breda nel '41. Conta i soldi degli altri con una velocità che fa paura, e ricorda ogni puntata degli ultimi dieci anni.");
    C("mn_arbitro", { name: "Arbitro Brambilla", sub: "Direttore di gara", tag: "", style: "buzz", hair: "#334155", skin: "#cbd5e1", eye: "#0f172a", shirt: "#18181b", acc: ["fischietto"], bg: ["#18181b", "#cbd5e1"] }, "Trecento partite arbitrate in Lombardia. Severo, puntuale, giacca nera pesante. Ha una figlia in ospedale a Niguarda e un fischietto in tasca che non è il suo.");
    // — Bastioni
    C("mn_oste", { name: "Battista l'Oste", sub: "Osteria del Tram", tag: "", style: "buzz", hair: "#334155", skin: "#f1d5b5", eye: "#1e293b", shirt: "#f8fafc", beard: "baffi", acc: ["grembiule"], bg: ["#334155", "#cbd5e1"] }, "Gestisce l'Osteria del Tram ai Bastioni. Serve rosso novello e minestrone d'orzo, ascolta tutto e ricorda poco. Per scelta.");
    C("mn_scotti", { name: "Brigadiere Scotti", sub: "Squadra Mobile", tag: "", style: "buzz", hair: "#78350f", skin: "#f5d0b0", eye: "#1e293b", shirt: "#1e3a8a", acc: ["berretto"], bg: ["#1e3a8a", "#0f172a"] }, "Il brigadiere di De Santis. Legge solo la Gazzetta, è convinto che il fuorigioco sia un reato penale e prende appunti su tutto, anche sulle cose che non servono. Soprattutto su quelle.");
    C("mn_brogio", { name: "Ambrogio «el Brogio»", sub: "Tranviere del 19", tag: "", style: "messy", hair: "#6b7280", skin: "#e8c39e", eye: "#1e293b", shirt: "#365314", beard: "folta", acc: ["berretto"], bg: ["#365314", "#1a2e05"] }, "Guida il 19 da ventidue anni. Conosce ogni scambio, ogni curva e ogni passeggero che sale senza biglietto. Parla col tram come con una moglie: con pazienza e qualche bestemmia.");
    C("mn_gaspare", { name: "Gaspare delle Caldarroste", sub: "Venditore ambulante", tag: "", style: "bandana", hair: "#44403c", skin: "#d6a77a", eye: "#1c1917", shirt: "#78350f", beard: "pizzetto", acc: ["grembiule"], bg: ["#9a3412", "#431407"] }, "Vende caldarroste al cartoccio sotto l'arco di Porta Ticinese. Da novembre a marzo è l'uomo più amato di Milano. Da aprile a ottobre nessuno sa dove vada.");
    C("mn_tino", { name: "Tino «Bauscia»", sub: "Tifoso nerazzurro", tag: "blue", style: "pompadour", hair: "#111827", skin: "#f1d5b5", eye: "#1e3a8a", shirt: "#1e3a8a", acc: ["sciarpa"], bg: ["#1e3a8a", "#0a0a0a"] }, "Tifoso nerazzurro, ragioniere al catasto. Pettinatura con la brillantina e la convinzione di essere nato dalla parte giusta del Naviglio.");
    C("mn_pinin", { name: "Pinin «Casciavit»", sub: "Tifoso rossonero", tag: "", style: "messy", hair: "#7c2d12", skin: "#e8c39e", eye: "#14532d", shirt: "#991b1b", acc: ["coppola", "sciarpa"], bg: ["#991b1b", "#0a0a0a"] }, "Tifoso rossonero, operaio alla Pirelli. Litiga con Tino dal 1938, ogni sera, allo stesso tavolo. Se uno dei due manca, l'altro non beve.");
    C("mn_carlo", { name: "Sciur Carlo", sub: "Pensionato delle Ferrovie", tag: "", style: "buzz", hair: "#e5e7eb", skin: "#e8c39e", eye: "#1e293b", shirt: "#57534e", beard: "baffi", acc: ["occhiali"], bg: ["#57534e", "#1c1917"] }, "Ex capostazione, ottantun anni, gioca a scopa all'Osteria del Tram da quando c'era ancora il re. Bara. Tutti lo sanno. Nessuno glielo dice.");
    C("mn_celestino", { name: "Celestino il Lampionaio", sub: "Accenditore dei lampioni a gas", tag: "", style: "wavy", hair: "#a8a29e", skin: "#f1d5b5", eye: "#334155", shirt: "#1f2937", acc: ["berretto"], bg: ["#1f2937", "#fbbf24"] }, "Ogni sera accende i lampioni a gas dei Bastioni con una pertica lunga tre metri. Scrive poesie sul retro delle bollette. Dice che la nebbia è la città che si vergogna di farsi vedere.");
    // — La Lucciola
    C("mn_tullio", { name: "Maestro Tullio", sub: "Pianista della Lucciola", tag: "", style: "slick", hair: "#d6d3d1", skin: "#e8c39e", eye: "#57534e", shirt: "#0a0a0a", acc: ["occhiali"], bg: ["#0a0a0a", "#44403c"] }, "Pianista della Lucciola, cieco dal '43. Non vede niente e sente tutto: il fruscio di una banconota, il tremito di una voce, il passo di chi ha paura.");
    C("mn_ugo", { name: "Ugo il Barman", sub: "Banco della Lucciola", tag: "", style: "slick", hair: "#1c1917", skin: "#f1d5b5", eye: "#1e293b", shirt: "#fafaf9", beard: "baffi", acc: [], bg: ["#581c87", "#fafaf9"] }, "Serve cocktail con nomi di calciatori: il «Meazza» (forte, va giù di colpo) e il «Fuorigioco» (sembra acqua, non lo è). Non fa domande. Le risposte, però, le vende.");
    C("mn_contessa", { name: "Contessa Bice Lanzi", sub: "Scommettitrice d'alto bordo", tag: "gold", style: "wavy", hair: "#f5f5f4", skin: "#fde7d9", eye: "#4c1d95", shirt: "#4c1d95", acc: ["fiore"], bg: ["#4c1d95", "#fef3c7"] }, "Contessa di un feudo che non esiste più. Punta solo sul pareggio, perché «è l'unico risultato educato». Perde da trent'anni con un'eleganza che fa scuola.");
    C("mn_ciccio", { name: "Ciccio Ferro", sub: "Guardaspalle di Don Carmine", tag: "", style: "buzz", hair: "#0a0a0a", skin: "#d6a77a", eye: "#1c1917", shirt: "#27272a", scar: true, acc: [], bg: ["#27272a", "#0a0a0a"] }, "Due metri di muscoli e un cuore di panna montata. Picchia per contratto, piange al cinema. Il suo film preferito è «Ladri di biciclette»: l'ha visto undici volte.");
    C("mn_wanda", { name: "Wanda del Guardaroba", sub: "Guardarobiera della Lucciola", tag: "", style: "ponytail", hair: "#9a3412", skin: "#f5d0b0", eye: "#14532d", shirt: "#14532d", acc: [], bg: ["#14532d", "#052e16"] }, "Dal guardaroba della Lucciola passano tutti i cappotti di Milano. Wanda li riconosce dall'odore: tabacco, nafta, profumo francese, paura.");
    // — L'Arena Civica
    C("mn_gioann", { name: "Sciur Gioann", sub: "Magazziniere dell'Arena", tag: "", style: "buzz", hair: "#d6d3d1", skin: "#e8c39e", eye: "#1c1917", shirt: "#44403c", beard: "folta", acc: ["grembiule"], bg: ["#44403c", "#1c1917"] }, "Magazziniere dell'Arena Civica dal 1921. Ingrassa i palloni di cuoio con il sego, li conta, li chiama per nome. Il più vecchio si chiama Pierino.");
    C("mn_pavesi", { name: "Mister Pavesi", sub: "Allenatore dei Ferrovieri", tag: "", style: "slick", hair: "#57534e", skin: "#e8c39e", eye: "#1e293b", shirt: "#7f1d1d", acc: ["fischietto"], bg: ["#7f1d1d", "#1c1917"] }, "Allenatore dei Ferrovieri, ex mediano. Gioca col Metodo e giura che il Sistema è una moda che passerà. Urla sempre, tranne quando ha paura: allora parla piano.");
    C("mn_marietto", { name: "Marietto lo Strillone", sub: "Strillone di giornali", tag: "", style: "messy", hair: "#a8a29e", skin: "#d6a77a", eye: "#1c1917", shirt: "#a16207", acc: ["coppola"], bg: ["#a16207", "#1c1917"] }, "Strillone da quarant'anni: vende la Gazzetta fuori dall'Arena e la Notte ai Bastioni. Ha la voce di un tenore e un orecchio d'oro per le notizie che non sono ancora uscite.");
    C("mn_rino", { name: "Rino «Flash»", sub: "Fotografo sportivo", tag: "", style: "wavy", hair: "#1c1917", skin: "#f1d5b5", eye: "#1e293b", shirt: "#3f3f46", acc: ["occhiali"], bg: ["#3f3f46", "#fef3c7"] }, "Fotografo a cottimo, magnesio e Rolleiflex. Ha immortalato tre gol di Nordahl e il naso rotto di un arbitro. Dice che la foto giusta vale più di cento testimoni.");
    C("mn_boffi", { name: "Il Sergente Boffi", sub: "Capitano dei Diavoli dell'Ombra", tag: "", style: "buzz", hair: "#292524", skin: "#d6a77a", eye: "#1c1917", shirt: "#0f172a", beard: "baffi", acc: ["fascia"], bg: ["#0f172a", "#7f1d1d"] }, "Capitano dei Diavoli dell'Ombra, ex sergente degli alpini. Gioca duro e pulito. Il problema è che metà della sua squadra gioca solo duro.");
    // — I Navigli
    C("mn_rosetta", { name: "Rosetta Colombo", sub: "Moglie di Nando", tag: "", style: "ponytail", hair: "#57534e", skin: "#f5d0b0", eye: "#3f6212", shirt: "#57534e", acc: [], bg: ["#57534e", "#1c1917"] }, "Sarta a cottimo, moglie di Nando. Cuce camicie per una ditta di corso Buenos Aires e ha le dita bucate dagli spilli. Non piange davanti a nessuno. Davanti a nessuno.");
    C("mn_teresa", { name: "Teresa la Lavandaia", sub: "Lavatoio del Vicolo", tag: "", style: "bandana", hair: "#78716c", skin: "#e8c39e", eye: "#1c1917", shirt: "#e7e5e4", acc: ["grembiule"], bg: ["#a8a29e", "#44403c"] }, "Lava i panni di mezza Porta Genova nel lavatoio coperto del Vicolo. Canta mentre sbatte le lenzuola. La mattina del 17 novembre non cantava.");
    C("mn_remo", { name: "Remo il Barcaiolo", sub: "Barconi della Darsena", tag: "", style: "bandana", hair: "#44403c", skin: "#c69468", eye: "#1c1917", shirt: "#1e3a8a", beard: "folta", acc: [], bg: ["#1e3a8a", "#0c0a09"] }, "Porta sabbia e ghiaia dal Ticino alla Darsena su un barcone lungo venti metri. Conosce le correnti del Naviglio come le rughe di sua madre.");
    C("mn_sangalli", { name: "Dottor Sangalli", sub: "Medico legale", tag: "", style: "slick", hair: "#d6d3d1", skin: "#f1d5b5", eye: "#1e293b", shirt: "#fafaf9", acc: ["occhiali"], bg: ["#fafaf9", "#44403c"] }, "Medico legale dell'obitorio di via Ponzio. Cinico per mestiere, gentile per sbaglio. Fa le autopsie fischiettando Verdi.");
    // — La Scala
    C("mn_ernesto", { name: "Ernesto la Maschera", sub: "Maschera della Scala", tag: "", style: "slick", hair: "#e7e5e4", skin: "#f1d5b5", eye: "#1e293b", shirt: "#7f1d1d", acc: ["medaglia"], bg: ["#7f1d1d", "#fbbf24"] }, "Maschera della Scala da trentaquattro stagioni. Ha accompagnato al palco re, ministri e un toro scappato da un'Aida del '38. Non si stupisce di niente, ma lo fa con stile.");
    C("mn_fausto", { name: "Fausto il Loggionista", sub: "Loggione della Scala", tag: "", style: "messy", hair: "#57534e", skin: "#e8c39e", eye: "#1c1917", shirt: "#1f2937", acc: ["sciarpa"], bg: ["#1f2937", "#0a0a0a"] }, "Tranviere di giorno, loggionista di notte. Fischia i tenori stonati e i centravanti che non tirano, con la stessa ferocia e lo stesso amore.");
    C("mn_elvira", { name: "Elvira la Sarta di Scena", sub: "Sartoria della Scala", tag: "", style: "bob", hair: "#d6d3d1", skin: "#f5d0b0", eye: "#4c1d95", shirt: "#4c1d95", acc: [], bg: ["#4c1d95", "#1c1917"] }, "Sarta di scena della Scala. Ha cucito i costumi di tre Aide e di una Vestale. Era la maestra di Rosetta, quando Rosetta aveva quindici anni e voleva vestire le regine.");
  }
  casts();

  // sfondi semplici di riserva (se js/milano-bg.js non è caricato): restano per compatibilità
  window.__mnDraw = window.__mnDraw || {};
  window.__milano = api;
})();
