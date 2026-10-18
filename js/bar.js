// js/bar.js - «IL BAR DEL BORGO» · modalità di gestione leggera (nessuna modifica alle partite)
// Di giorno si serve a tocchi, a tempo (4 prodotti, clienti con la fumetta dell'ordine e la pazienza che cala).
// Con la cassa si migliora il locale (si vede nella scena). Di sera arriva un ospite con un episodio: scelte brevi,
// cuori da riempire. Reputazione a stelle sblocca ospiti nuovi. Salvataggio proprio, monete di gioco con tetto giornaliero.
(function () {
  "use strict";
  if (window.__bar) return;
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const KEY = "ali-di-rondine.bar", DCAP = 150;
  const def = () => ({ day: 1, cash: 0, rep: 0, up: {}, hearts: {}, shifts: 0, best: 0, wins: 0, dday: "", dcoins: 0, last: "" });
  const load = () => safe(() => Object.assign(def(), JSON.parse(localStorage.getItem(KEY) || "{}")), def());
  const save = (s) => safe(() => localStorage.setItem(KEY, JSON.stringify(s)));
  const stars = (s) => Math.min(5, 1 + Math.floor(s.rep / 40));
  const lv = (s, k) => s.up[k] || 0;

  // ------------------------------------------------------------------ dati
  const ITEMS = [["caffe", "☕", "Caffè", 2], ["panino", "🥪", "Panino", 4], ["birra", "🍺", "Birra", 3], ["spritz", "🍹", "Spritz", 5]];
  const UP = {
    mac: { n: "Macchina espresso", i: "☕", max: 3, cost: [80, 200, 400], d: ["Ogni caffè dà +50% di mancia", "Ogni caffè dà +100% di mancia", "Ogni caffè dà +150% di mancia"] },
    tav: { n: "Tavolini", i: "🪑", max: 3, cost: [100, 240, 450], d: ["Un posto in più (4)", "Un altro posto (5)", "Ultimo posto (6)"] },
    tv: { n: "Televisore", i: "📺", max: 2, cost: [150, 350], d: ["Ogni 3° giorno è giorno di derby: più clienti, mance doppie", "Derby ogni 2 giorni"] },
    ins: { n: "Insegna al neon", i: "💡", max: 3, cost: [90, 220, 420], d: ["+3 clienti per turno, +1 reputazione", "+6 clienti, +2 reputazione", "+9 clienti, +3 reputazione"] },
    gia: { n: "Giardinetto", i: "🌿", max: 3, cost: [70, 180, 360], d: ["I clienti aspettano 15% di più", "Pazienza +30%", "Pazienza +45%"] }
  };
  const S = (lines, ch) => ({ lines, ch: ch.map((c) => ({ t: c[0], r: c[1], h: c[2] || 0, cash: c[3] || 0, rep: c[4] || 0 })) });
  // ospiti: `min` = stelle per vedere il primo episodio; ogni episodio successivo chiede una stella in più
  const G = [
    { id: "alberto", n: "Alberto il Presidente", i: "🎩", col: "#6d28d9", min: 1, d: "Ex presidente di una squadra che non esiste più. Ordina sempre un caffè «per il bilancio».", eps: [
      S([["Alberto", "Presidente, io. Anzi, ex. La mia squadra aveva tre tifosi e un debito che aveva più tifosi di lei."], ["Alberto", "Ho venduto lo stadio per comprare un frigo. Funziona benissimo. Il frigo, non lo stadio."]], [["Ridi con lui", "Alberto ride così forte che si fa ripetere il caffè. «Offro io», dice, e non offre.", 1, 6, 1], ["Chiedi del frigo", "«Tiene il ghiaccio dal 2009.» Lo guarda come un figlio. Ti lascia una mancia da ex presidente.", 1, 10, 0]]),
      S([["Alberto", "Fra un mese c'è la cena dei vecchi giocatori. Devo fare un discorso. Il guaio è che non mi ricordo nessun gol."], ["Alberto", "Ne ricordo uno. Lo abbiamo preso. Posso partire da lì?"]], [["Aiutalo a scriverlo", "Scrivete sul retro di un tovagliolo. Viene fuori una cosa vera: poche righe, nessun gol, tanti nomi. Alberto le piega con cura.", 1, 0, 2], ["Digli di improvvisare", "«Improvvisare è il mio mestiere.» Non lo è. Ma ha il coraggio di chi non ha più niente da perdere.", 1, 12, 0]]),
      S([["Alberto", "Sono venuti in nove. Nove. Dei venti che erano. Gli altri hanno mandato i saluti. Qualcuno, credo, anche una busta."], ["Alberto", "Ho tenuto il discorso. Ho pianto alla seconda riga. È andata bene lo stesso."]], [["Offri tu il giro", "Il bar brinda con un caffè in nove tazzine. Alberto si alza in piedi: «Alla squadra». Qualcuno risponde «Che non c'è». «Per questo!»", 1, -10, 3], ["Lo lasci in silenzio", "Resti accanto al bancone senza dire niente. A volte è tutto quello che serve. Alberto lo capisce e mette sul banco la sua sciarpa.", 1, 0, 3]])] },
    { id: "rosa", n: "Rosa Microfono", i: "🎙️", col: "#be123c", min: 1, d: "Telecronista di una radio locale. Commenta tutto, anche chi sale le scale.", eps: [
      S([["Rosa", "E in questo momento il cliente alza la tazza, la guarda, la annusa… ATTENZIONE, beve! Che gesto!"], ["Rosa", "Non farci caso. Se non commento, mi sento nuda. Anche senza microfono."]], [["Fai il contropiede", "«Il barista recupera palla in cucina… tunnel al lavello… GOL.» Ti applaude con il cucchiaino.", 1, 8, 1], ["Chiedi di smettere", "Per tre secondi c'è silenzio vero. Poi lei sussurra: «In silenzio è peggio». Torna a commentare.", 1, 0, 0]]),
      S([["Rosa", "La radio chiude a fine mese. Cinquant'anni di partite del Borgo. Le cassette le tiene un tizio che non risponde al telefono."], ["Rosa", "Ho una voce per ogni gol. Non so dove metterle."]], [["Offri il bar per l'ultima diretta", "Rosa trasmette dal tuo bancone. Dal pubblico arriva un applauso vero. Ci sono più clienti del solito.", 1, 15, 3], ["La ascolti e basta", "Racconta il gol più bello che ha mai commentato. Non era una partita: era un battesimo. Ti si chiude la gola.", 1, 0, 2]]),
      S([["Rosa", "Ultima diretta. Se mi tremano le gambe commentatele come un vento."], ["Rosa", "Signore e signori… dal bar più piccolo del Borgo… buonanotte. E ricordate: la partita è lunga. Anche la vita. Sì, uguale."]], [["Spegni le luci a metà", "Il bar resta in penombra, ascolti la frase finale come in una chiesa. Rosa alza il pollice nel buio.", 1, 0, 4], ["Le offri il caffè del Presidente", "«Offre la ditta», dici. Rosa ride e le scappa una lacrima. Il caffè lo paga lei. Ma più tardi.", 1, 5, 3]])] },
    { id: "santo", n: "Santo il Marinaio", i: "⚓", col: "#0f766e", min: 2, d: "Non parla. Ordina una birra e guarda il mare dalla finestra.", eps: [
      S([["Santo", "…"], ["Santo", "(Beve. Guarda la finestra. Beve. Ti fa un cenno con due dita: «Un'altra».)"]], [["Ne porti una e basta", "Santo annuisce. Per lui è come un discorso.", 1, 5, 0], ["Gli chiedi del mare", "Un lungo sguardo. Poi: «Fa rumore». Altre parole non servono.", 1, 0, 1]]),
      S([["Santo", "Mio fratello navigava. Io no. Sono rimasto a casa a tenere il fuoco acceso."], ["Santo", "Ogni sera guardo la finestra. Non è tornato. Ma ci tengo il fuoco."]], [["Accendi la lampada alla finestra", "Metti una lampada sul davanzale. Santo non dice grazie. Si toglie il cappello.", 1, 0, 3], ["Gli dici che tornerà", "«Lo so», dice. Non sembra convinto. Lascia lo stesso una mancia pesante.", 1, 12, 0]]),
      S([["Santo", "Oggi è arrivata una cartolina. Un porto lontano. Una riga: «Sto bene. Tieni il fuoco acceso»."], ["Santo", "Ho riso. Era da vent'anni."]], [["Brindi con lui", "Due birre alzate. Santo parla per tre minuti di fila. Nessuno ci crede, ma è successo.", 1, 0, 4], ["Gli presti la penna", "Scrive la risposta al banco. Una riga sola. La imbuca il giorno dopo, con la sciarpa.", 1, 8, 3]])] },
    { id: "violetta", n: "Violetta", i: "🎻", col: "#db2777", min: 3, d: "Suona il violino per strada. Dice che stona di proposito, per fare scena.", eps: [
      S([["Violetta", "Posso suonare qui? Il marciapiede ha un'acustica pessima. E un vigile con un udito ottimo."], ["Violetta", "In cambio ti suono qualsiasi cosa. Tranne il Ballo del Qua Qua."]], [["Va bene, suona", "Il bar si riempie di una cosa che somiglia a un valzer di gabbiani. I clienti applaudono per educazione.", 1, 10, 1], ["Chiedi il Ballo del Qua Qua", "La vedi impallidire. Poi lo suona. Il bar ride per dieci minuti buoni.", 1, 15, 0]]),
      S([["Violetta", "Mi hanno proposto un'audizione. Al conservatorio. Fra tre giorni."], ["Violetta", "Io stono di proposito, dico. In realtà ho paura di non stonare."]], [["Falle ripassare dal vivo", "Fai da pubblico, seduto in prima fila. Lei suona. Stona due volte. Il resto è bellissimo.", 1, 5, 3], ["Le dici di andare", "«E se mi bocciano?» «Torni qui, e il caffè lo offro io.» Ride, ma si segna la data.", 1, -5, 2]]),
      S([["Violetta", "L'audizione è andata. Non ti dico com'è andata. Te lo suono."], ["Violetta", "(Suona. Il bar tace. Anche il frigo.)"]], [["Ascolti in piedi", "Quando finisce nessuno applaude subito. Poi tutti insieme, a lungo.", 1, 0, 5], ["Filmi la sera per lei", "Una fotografia del bar con tutte le luci. La appenderà sopra il bancone.", 1, 10, 3]])] },
    { id: "pallini", n: "Professor Pallini", i: "♟️", col: "#334155", min: 4, d: "Maestro di scacchi. Perde sempre contro un bambino e non lo accetta.", eps: [
      S([["Pallini", "Muovo il cavallo. Il cavallo non si muove così, lo so. Ma muovo il cavallo."], ["Pallini", "Giochi? Ti avviso: ho una teoria su ogni apertura. Nessuna funziona."]], [["Accetti la sfida", "Perdi dopo venti mosse. Pallini esulta come per un mondiale.", 1, 8, 1], ["Lo lasci vincere", "Se ne accorge dopo tre mosse. Ti guarda male. Poi ride. Poi ti fa il conto più pesante dell'anno.", 1, 12, 0]]),
      S([["Pallini", "Il bambino non viene più. Quello che mi batteva. Si è trasferito."], ["Pallini", "Non è che mi mancasse perdere. Mi mancava qualcuno a cui spiegare perché avevo perso."]], [["Giochi tu con lui, a distanza", "Scrivete le mosse su cartoline. Per ora la partita è alla quinta mossa.", 1, 0, 3], ["Gli dici: ricomincia da capo", "«Da capo?» «Sì, dal cavallo.» «Quello che non si muove così.» Sorride.", 1, 6, 2]]),
      S([["Pallini", "Ho vinto. Contro un computer. Il computer si è bloccato, ma ho vinto."], ["Pallini", "Stasera pago io. Non lo dico mai. Dillo anche al registratore di cassa."]], [["Brindi alla vittoria", "Tutto il bar alza la tazza. Pallini fa un inchino che dura un minuto.", 1, -8, 3], ["Gli rovini la festa con la verità", "«È stato un bug.» «È stato un MIO bug.» Gli dai ragione. Va a casa felice.", 1, 15, 2]])] }
  ];

  // ------------------------------------------------------------------ disegno
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const SEATS = [[80, 134], [160, 134], [240, 134], [34, 152], [286, 152], [122, 168]];
  const person = (g, x, y, col, sc, hair, mood) => {
    sc = sc || 1; R(g, x - 4 * sc, y - 12 * sc, 8 * sc, 12 * sc, col); R(g, x - 4 * sc, y - 12 * sc, 8 * sc, 2 * sc, "rgba(255,255,255,.18)");
    C(g, x, y - 16 * sc, 4 * sc, "#e0b890"); R(g, x - 4.4 * sc, y - 21 * sc, 8.8 * sc, 3.6 * sc, hair || "#2a1a10");
    R(g, x - 1.8 * sc, y - 16.8 * sc, 1 * sc, 1 * sc, "#222"); R(g, x + 1 * sc, y - 16.8 * sc, 1 * sc, 1 * sc, "#222");
    if (mood === "bad") R(g, x - 1.5 * sc, y - 13.6 * sc, 3 * sc, 0.8 * sc, "#7f1d1d"); else if (mood === "ok") R(g, x - 1.5 * sc, y - 14 * sc, 3 * sc, 1 * sc, "#92400e");
  };
  function drawBar(g, f, st, custs, opt) {
    opt = opt || {}; const night = !!opt.night, W = 320, H = 200;
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, night ? "#160d1e" : "#3a2216"); gr.addColorStop(1, night ? "#2a1626" : "#5a3a22"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) R(g, i * 8, 0, 1, 104, "rgba(255,200,120,.05)");
    // vetrina sul mare
    R(g, 12, 18, 74, 52, "#2a1a10"); const sk = g.createLinearGradient(0, 22, 0, 66); sk.addColorStop(0, night ? "#1a2a52" : "#7ec0ee"); sk.addColorStop(1, night ? "#0c1830" : "#d6ecf7"); g.fillStyle = sk; g.fillRect(16, 22, 66, 44);
    R(g, 16, 50, 66, 16, night ? "#0b2540" : "#2f7ab5"); for (let i = 0; i < 5; i++) R(g, 18 + ((i * 17 + f * 0.3) % 56), 53 + i * 2.6, 9, 1, "rgba(255,255,255,.4)");
    R(g, 48, 22, 2, 44, "#2a1a10"); if (night) for (let i = 0; i < 6; i++) R(g, 20 + i * 10, 25 + (i * 7) % 12, 1, 1, "#fff");
    // scaffali
    R(g, 120, 28, 180, 3, "#7a4a22"); R(g, 120, 52, 180, 3, "#7a4a22"); R(g, 120, 76, 180, 3, "#7a4a22");
    for (let r = 0; r < 3; r++) for (let i = 0; i < 14; i++) { const c = ["#7dd3fc", "#fbbf24", "#f87171", "#86efac", "#c4b5fd"][(i * 3 + r) % 5]; R(g, 124 + i * 12.6, 14 + r * 24 + (i % 3), 5, 14 - (i % 3), c); R(g, 125 + i * 12.6, 14 + r * 24 + (i % 3), 1, 12 - (i % 3), "rgba(255,255,255,.4)"); }
    // lampade
    [70, 160, 250].forEach((x, i) => { R(g, x - 0.5, 0, 1, 10, "#222"); C(g, x, 12, 5, night ? "#ffd070" : "#fcd34d"); GL(g, x, 14, night ? 56 : 44, "255,200,110", (night ? 0.55 : 0.4) + Math.sin(f / 30 + i) * 0.05); });
    // upgrade visibili
    if (lv(st, "tv")) { R(g, 92, 18, 22, 16, "#111"); R(g, 94, 20, 18, 12, "#0d9488"); const dd = opt.derby; if (dd) { g.fillStyle = "#fff"; g.font = "700 6px sans-serif"; g.textAlign = "center"; g.fillText("DERBY", 103, 28); } else R(g, 96, 24 + Math.sin(f / 15) * 2, 14, 2, "rgba(255,255,255,.5)"); }
    if (lv(st, "ins")) { const a = 0.7 + Math.sin(f / 10) * 0.3; g.save(); g.shadowColor = "#ff2a8a"; g.shadowBlur = 8; g.fillStyle = `rgba(255,70,150,${a})`; g.font = "900 9px sans-serif"; g.textAlign = "center"; g.fillText("BAR DEL BORGO", 222, 92); g.restore(); }
    if (lv(st, "gia")) for (let i = 0; i < lv(st, "gia"); i++) { const x = 300 - i * 14; R(g, x - 3, 172, 6, 8, "#7a3a1a"); C(g, x, 168, 5, "#22a05a"); C(g, x - 3, 165, 3, "#2cc070"); }
    if (lv(st, "mac")) { R(g, 262, 100, 20, 14, "#9aa4b0"); R(g, 264, 102, 16, 5, "#3a4a5a"); C(g, 270, 111, 1.5, "#fb923c"); if (f % 60 < 30) R(g, 272, 96 - (f % 30) / 4, 1, 4, "rgba(255,255,255,.35)"); }
    // bancone
    R(g, 0, 104, W, 16, "#8a5a2c"); R(g, 0, 104, W, 3, "#c28a4a"); R(g, 0, 120, W, 8, "#4a2a14"); for (let i = 0; i < 16; i++) R(g, i * 20 + 4, 108, 1, 10, "rgba(0,0,0,.2)");
    // tavolini e sgabelli
    for (let i = 0; i < 6; i++) { const [x, y] = SEATS[i]; if (i >= 3 && lv(st, "tav") < i - 2) continue; R(g, x - 7, y + 2, 14, 3, "#5a3a20"); R(g, x - 1, y + 5, 2, 12, "#3a2410"); if (i >= 3) { C(g, x + (x < 160 ? 14 : -14), y + 6, 6, "#7a4a22"); R(g, x + (x < 160 ? 13 : -15), y + 6, 2, 10, "#3a2410"); } }
    // pavimento
    R(g, 0, 128, W, 72, "#3a2412"); for (let i = 0; i < 12; i++) R(g, 0, 128 + i * 6, W, 1, "rgba(0,0,0,.25)");
    // clienti
    (custs || []).forEach((c) => {
      if (c.state === "gone") return; const [sx, sy] = SEATS[c.seat], x = c.x, y = sy + 4 + Math.sin((f + c.seat * 9) / 25) * 0.6;
      person(g, x, y, c.col, 1.35, c.hair, c.state === "angry" ? "bad" : c.p < 0.4 ? "ok" : "");
      if (c.state === "seated") {
        const n = c.orders.length, bw = 8 + n * 14, bx = x - bw / 2, by = y - 52;
        g.fillStyle = c.vip ? "#fde68a" : "#fff"; g.beginPath(); g.moveTo(bx + 4, by); g.lineTo(bx + bw - 4, by); g.quadraticCurveTo(bx + bw, by, bx + bw, by + 4); g.lineTo(bx + bw, by + 16); g.quadraticCurveTo(bx + bw, by + 20, bx + bw - 4, by + 20); g.lineTo(x + 4, by + 20); g.lineTo(x, by + 25); g.lineTo(x - 3, by + 20); g.lineTo(bx + 4, by + 20); g.quadraticCurveTo(bx, by + 20, bx, by + 16); g.lineTo(bx, by + 4); g.quadraticCurveTo(bx, by, bx + 4, by); g.fill();
        g.font = "13px sans-serif"; g.textAlign = "center"; c.orders.forEach((o, j) => g.fillText(ITEMS.find((it) => it[0] === o)[1], bx + 4 + 7 + j * 14, by + 15));
        if (c.vip) { g.font = "8px sans-serif"; g.fillText("⭐", x, by - 2); }
        R(g, x - 14, by - 5 + (c.vip ? 4 : 0), 28, 3, "rgba(0,0,0,.5)"); const pc = c.p > 0.6 ? "#22c55e" : c.p > 0.3 ? "#fbbf24" : "#ef4444"; R(g, x - 14, by - 5 + (c.vip ? 4 : 0), 28 * c.p, 3, pc);
      }
      if (c.fx) { g.font = "700 10px sans-serif"; g.textAlign = "center"; g.fillStyle = c.fx.c; g.globalAlpha = Math.max(0, c.fx.t); g.fillText(c.fx.s, x, y - 30 - (1 - c.fx.t) * 22); g.globalAlpha = 1; }
    });
    // barista
    person(g, 160, 114, "#f1f5f9", 1.5, "#2a1a10"); R(g, 154, 108, 12, 6, "#e5e7eb");
    const vg = g.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 210); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${night ? 0.5 : 0.35})`); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  }

  // ------------------------------------------------------------------ interfaccia
  let CSS = false;
  const injectCss = () => {
    if (CSS) return; CSS = true; const s = document.createElement("style");
    s.textContent = `.brOv{position:fixed;inset:0;z-index:99981;background:#120a06;display:flex;flex-direction:column;align-items:center;gap:10px;font-family:'Trebuchet MS',system-ui,sans-serif;color:#fdf2dc;padding:10px;overflow:auto}
.brOv canvas{width:100%;max-width:520px;aspect-ratio:320/200;height:auto;border-radius:12px;border:2px solid #7a4a22;background:#000;flex:none;image-rendering:auto;touch-action:none}
.brOv h2{margin:0;font-size:18px;color:#fcd34d;text-shadow:0 2px 0 #0008}.brOv .sub{font-size:12px;opacity:.8;text-align:center;max-width:420px}
.brBar{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;font-size:12.5px}.brBar span{background:#2a160c;border:1px solid #7a4a22;border-radius:999px;padding:4px 10px}
.brBt{background:#b45309;color:#fff;border:0;border-bottom:3px solid #78350f;border-radius:12px;padding:12px 16px;font:700 15px 'Trebuchet MS',system-ui,sans-serif;min-width:150px;cursor:pointer}.brBt.s{background:#3a2412;border-bottom-color:#1a0e06;font-size:13px;padding:9px 12px}.brBt:disabled{opacity:.45}
.brBt small{display:block;font-weight:400;font-size:11px;opacity:.85;margin-top:2px}.brRow{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;max-width:520px}
.brIt{display:flex;gap:8px;width:100%;max-width:520px;flex:none}.brIt button{flex:1;background:#fff3d6;color:#3a2412;border:0;border-bottom:4px solid #c28a4a;border-radius:14px;padding:10px 0;font-size:30px;line-height:1;cursor:pointer;touch-action:manipulation}.brIt button small{display:block;font:700 11px 'Trebuchet MS',sans-serif;margin-top:3px}.brIt button:active{transform:translateY(2px);border-bottom-width:2px}.brIt button.no{animation:brSh .25s}
@keyframes brSh{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.brCard{width:100%;max-width:520px;background:#2a160c;border:1px solid #7a4a22;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.4;flex:none}
.brCard .row{display:flex;gap:10px;align-items:center;background:#1c0f08;border-radius:10px;padding:8px}.brCard .row .e{font-size:26px;width:36px;text-align:center}.brCard .row b{display:block}.brCard .row small{display:block;opacity:.75;font-size:11.5px}
.brSay{display:flex;gap:10px;align-items:flex-start}.brSay .pt{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;flex:none;border:2px solid #fcd34d}.brSay b{color:#fcd34d}.brSay .tx{flex:1}
.brCh{display:flex;flex-direction:column;gap:8px}.brHt{letter-spacing:2px}`;
    document.head.appendChild(s);
  };
  const rnd = (n) => Math.floor(Math.random() * n), pick = (a) => a[rnd(a.length)];

  function open(back, o) {
    injectCss(); document.querySelectorAll(".brOv").forEach((e) => e.remove());
    const ov = document.createElement("div"); ov.className = "brOv"; document.body.appendChild(ov);
    let st = load(), raf = 0, frame = 0, live = null, destroyed = false;
    const stop = () => { cancelAnimationFrame(raf); raf = 0; live = null; };
    const close = () => { destroyed = true; stop(); ov.remove(); if (back) back(); };
    const canvas = () => { const c = document.createElement("canvas"); c.width = 320; c.height = 200; return c; };
    const derby = () => lv(st, "tv") > 0 && st.day % (lv(st, "tv") >= 2 ? 2 : 3) === 0;
    const hud = () => `<div class="brBar"><span>📅 Giorno ${st.day}${derby() ? " · ⚽ DERBY" : ""}</span><span>💶 Cassa ${st.cash}</span><span>${"★".repeat(stars(st))}${"☆".repeat(5 - stars(st))}</span></div>`;
    const idle = (cv, night, gs) => { const g = cv.getContext("2d"); const loop = () => { if (destroyed || live) return; frame++; drawBar(g, frame, st, gs ? [{ seat: 1, x: SEATS[1][0], col: gs.col, hair: "#c8c8c8", state: "idle", orders: [], p: 1 }] : [], { night, derby: derby() }); raf = requestAnimationFrame(loop); }; cancelAnimationFrame(raf); loop(); };
    const hub = () => {
      stop(); const g0 = G.filter((x) => x.min <= stars(st)); const ready = g0.some((x) => (st.hearts[x.id] || 0) < 3);
      ov.innerHTML = `<h2>🍺 Il Bar del Borgo</h2><div class="sub">Di giorno servi, di sera ascolti. Con la cassa migliori il locale.</div>${hud()}<canvas></canvas><div class="brRow"><button class="brBt" id="go">▶ Apri il bar<small>Turno di 40 secondi${derby() ? " · giorno di derby!" : ""}</small></button></div><div class="brRow"><button class="brBt s" id="up">🔧 Migliorie</button><button class="brBt s" id="gs">👥 Ospiti${ready ? " •" : ""}</button><button class="brBt s" id="ex">Esci</button></div>`;
      idle(ov.querySelector("canvas"), false);
      ov.querySelector("#go").onclick = shift; ov.querySelector("#up").onclick = ups; ov.querySelector("#gs").onclick = guests; ov.querySelector("#ex").onclick = close;
    };
    const ups = (msg) => {
      stop(); const rows = Object.keys(UP).map((k) => { const u = UP[k], l = lv(st, k), mx = l >= u.max; return `<div class="row"><span class="e">${u.i}</span><div style="flex:1"><b>${u.n} · liv. ${l}/${u.max}</b><small>${esc(mx ? "Al massimo." : "Prossimo: " + u.d[l])}</small></div>${mx ? "" : `<button class="brBt s" data-k="${k}" ${st.cash < u.cost[l] ? "disabled" : ""}>💶 ${u.cost[l]}</button>`}</div>`; }).join("");
      ov.innerHTML = `<h2>🔧 Migliorie</h2>${hud()}<canvas></canvas><div class="brCard">${typeof msg === "string" ? `<b>${esc(msg)}</b>` : ""}${rows}</div><button class="brBt s" id="bk">◂ Indietro</button>`;
      idle(ov.querySelector("canvas"), false);
      ov.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => { const k = b.dataset.k, u = UP[k], l = lv(st, k); if (st.cash < u.cost[l]) return; st.cash -= u.cost[l]; st.up[k] = l + 1; save(st); ups(`${u.n} migliorata: ${u.d[l]}.`); }));
      ov.querySelector("#bk").onclick = hub;
    };
    const guests = () => {
      stop(); const rows = G.map((x) => { const h = st.hearts[x.id] || 0, un = x.min <= stars(st); return `<div class="row" style="${un ? "" : "opacity:.5"}"><span class="e">${un ? x.i : "❔"}</span><div><b>${un ? esc(x.n) : "Ospite misterioso"}</b><small>${un ? esc(x.d) : "Arriva a " + x.min + " stelle di reputazione."}</small><small class="brHt">${"❤".repeat(h)}${"♡".repeat(3 - h)}</small></div></div>`; }).join("");
      ov.innerHTML = `<h2>👥 Ospiti del bar</h2>${hud()}<div class="brCard"><small>Ogni sera arriva un ospite con un episodio. Riempi i cuori per vedere la sua storia fino in fondo. Più stelle hai, più ospiti arrivano.</small>${rows}</div><button class="brBt s" id="bk">◂ Indietro</button>`;
      ov.querySelector("#bk").onclick = hub;
    };

    // ---------- turno
    function shift() {
      stop(); const L = lv(st, "gia"), isD = derby();
      ov.innerHTML = `<h2>${isD ? "⚽ Derby!" : "☀️ Turno di giorno"}</h2>${hud()}<canvas></canvas><div class="brIt">${ITEMS.map((it) => `<button data-i="${it[0]}">${it[1]}<small>${it[3]}€</small></button>`).join("")}</div><div class="sub" id="tm">Tocca il prodotto che chiedono le fumetta. Chi aspetta troppo se ne va.</div>`;
      const cv = ov.querySelector("canvas"), g = cv.getContext("2d");
      const sh = { t: 0, dur: 40, next: 1, total: 0, served: 0, lost: 0, cash: 0, custs: [], seats: 3 + lv(st, "tav"), extra: 8 };
      live = sh; const names = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#0891b2", "#ca8a04", "#be185d"], hairs = ["#1a1a1a", "#4a2a10", "#c8c8c8", "#8a5a2a", "#d4a02a"];
      const patience = () => Math.max(6.2, 11 - st.day * 0.15) * (1 + 0.15 * L);
      const spawn = () => {
        const free = [...Array(sh.seats).keys()].filter((i) => !sh.custs.some((c) => c.seat === i && c.state !== "gone")); if (!free.length) return false;
        const seat = pick(free), n = sh.t > 12 && Math.random() < 0.3 ? 2 : 1, orders = Array.from({ length: n }, () => pick(ITEMS.slice(0, st.rep >= 40 ? 4 : 3))[0]);
        const vip = Math.random() < 0.08, tirchio = !vip && Math.random() < 0.1, p0 = patience() * (vip ? 0.75 : 1);
        sh.custs.push({ seat, x: seat < 3 || seat === 5 ? -20 : (SEATS[seat][0] < 160 ? -20 : 340), tx: SEATS[seat][0], state: "walk", orders, p: 1, p0, vip, tirchio, col: pick(names), hair: pick(hairs), got: 0 }); sh.total++; return true;
      };
      const pay = (c) => { const base = c.orders0.reduce((a, o) => a + ITEMS.find((it) => it[0] === o)[3], 0); let tip = c.tirchio ? 0 : Math.round(c.p * 3 * c.orders0.length); const cof = c.orders0.filter((o) => o === "caffe").length; tip += Math.round(cof * [0, 0.5, 1, 1.5][lv(st, "mac")]); let tot = base + tip; if (c.vip) tot *= 3; if (isD) tot += tip; return tot; };
      const serve = (id) => {
        const c = sh.custs.filter((x) => x.state === "seated" && x.orders.includes(id)).sort((a, b) => a.p - b.p)[0]; const btn = ov.querySelector(`[data-i="${id}"]`);
        if (!c) { btn.classList.remove("no"); void btn.offsetWidth; btn.classList.add("no"); sh.cash = Math.max(0, sh.cash - 1); return; }
        c.orders0 = c.orders0 || c.orders.slice(); c.orders.splice(c.orders.indexOf(id), 1);
        if (!c.orders.length) { const v = pay(c); sh.cash += v; sh.served++; c.state = "happy"; c.fx = { s: "+" + v, c: "#86efac", t: 1 }; c.leave = 0.6; }
        else c.fx = { s: "✔", c: "#fde68a", t: 1 };
      };
      ov.querySelectorAll(".brIt button").forEach((b) => (b.onpointerdown = (e) => { e.preventDefault(); serve(b.dataset.i); }));
      let last = performance.now(), ended = false;
      const loop = (now) => {
        if (destroyed || live !== sh) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; frame++; sh.t += dt;
        if (sh.t < sh.dur) { sh.next -= dt; if (sh.next <= 0) { spawn(); sh.next = Math.max(0.9, (2.6 - sh.t * 0.022 - st.day * 0.03 - lv(st, "ins") * 0.08) / (isD ? 1.4 : 1)); } }
        sh.custs.forEach((c) => {
          if (c.orders0 === undefined) c.orders0 = c.orders.slice();
          if (c.state === "walk") { c.x += (c.tx - c.x) * Math.min(1, dt * 5); if (Math.abs(c.tx - c.x) < 2) { c.x = c.tx; c.state = "seated"; } }
          else if (c.state === "seated") { c.p -= dt / c.p0; if (c.p <= 0) { c.state = "angry"; c.leave = 0.8; sh.lost++; c.fx = { s: "😠", c: "#fca5a5", t: 1 }; } }
          else if (c.state === "happy" || c.state === "angry") { c.leave -= dt; if (c.leave <= 0) c.state = "gone"; }
          if (c.fx) { c.fx.t -= dt * 0.9; if (c.fx.t <= 0) c.fx = null; }
        });
        sh.custs = sh.custs.filter((c) => c.state !== "gone" || c.fx);
        const active = sh.custs.some((c) => c.state === "walk" || c.state === "seated");
        drawBar(g, frame, st, sh.custs, { derby: isD });
        const tm = ov.querySelector("#tm"); if (tm) tm.textContent = `⏱ ${Math.max(0, Math.ceil(sh.dur - sh.t))}s · 💶 ${sh.cash} · serviti ${sh.served}`;
        if (!ended && ((sh.t >= sh.dur && !active) || sh.t > sh.dur + 9)) { ended = true; sh.custs.filter((c) => c.state === "seated").forEach(() => sh.lost++); finish(sh); return; }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    function finish(sh) {
      stop(); const score = sh.total ? sh.served / sh.total : 0, repGain = Math.round(score * 12) + lv(st, "ins"), earn = sh.cash;
      const day = new Date().toISOString().slice(0, 10); if (st.dday !== day) { st.dday = day; st.dcoins = 0; }
      const left = Math.max(0, DCAP - st.dcoins), conv = Math.min(left, Math.floor(earn / 3));
      const got = conv > 0 && typeof window.addCoins === "function" ? safe(() => { window.addCoins(conv); return conv; }, 0) : 0; st.dcoins += got;
      st.cash += earn; st.rep += repGain; st.shifts++; if (score >= 0.7) st.wins++; st.best = Math.max(st.best, earn); save(st);
      const rt = score >= 0.9 ? "Servizio perfetto!" : score >= 0.7 ? "Bel turno." : score >= 0.45 ? "Turno ballerino." : "Serata da dimenticare.";
      ov.innerHTML = `<h2>🌆 Fine turno</h2><div class="brCard"><b>${rt}</b><div>Clienti serviti: <b>${sh.served}/${sh.total}</b> · persi: ${sh.lost}</div><div>Incasso: <b>💶 ${earn}</b> (record ${st.best})</div><div>Reputazione: <b>+${repGain}</b> · ${"★".repeat(stars(st))}${"☆".repeat(5 - stars(st))}</div><div>${got ? `Monete di gioco: <b>+${got}</b>${got < conv || left - got <= 0 ? ` (tetto giornaliero ${DCAP})` : ""}` : left <= 0 ? `Monete di gioco: tetto di oggi (${DCAP}) raggiunto, la cassa del bar resta tua.` : "Nessuna moneta di gioco da questo turno."}</div></div><button class="brBt" id="ev">🌙 Arriva la sera</button>`;
      ov.querySelector("#ev").onclick = evening;
    }

    // ---------- sera
    function evening() {
      stop();
      const eligible = G.filter((x) => { const h = st.hearts[x.id] || 0; return h < 3 && Math.min(5, x.min + h) <= stars(st); });
      const fresh = eligible.filter((x) => x.id !== st.last); const gst = pick(fresh.length ? fresh : eligible);
      ov.innerHTML = `<h2>🌙 Sera</h2>${hud()}<canvas></canvas><div class="brCard" id="sc"></div>`;
      const cv = ov.querySelector("canvas"); frame = 0; idle(cv, true, gst); const sc = ov.querySelector("#sc");
      const next = () => { st.day++; save(st); hub(); };
      if (!gst) { sc.innerHTML = `<div class="tx">Serata tranquilla. ${pick(["Il frigo borbotta, la radio no.", "Un cliente dorme sul bancone, con dignità.", "Qualcuno ha lasciato un ombrello. Nessuno ricorda di averlo mai visto."])}</div><button class="brBt" id="ok">Chiudi il bar</button>`; sc.querySelector("#ok").onclick = next; return; }
      st.last = gst.id; const ep = gst.eps[st.hearts[gst.id] || 0]; let i = 0;
      const say = () => {
        if (i < ep.lines.length) { const [w, t] = ep.lines[i]; sc.innerHTML = `<div class="brSay"><div class="pt" style="background:${gst.col}">${gst.i}</div><div class="tx"><b>${esc(w)}</b><br>${t.replace(/</g, "&lt;")}</div></div><button class="brBt s" id="nx">▸</button>`; sc.querySelector("#nx").onclick = () => { i++; say(); }; return; }
        sc.innerHTML = `<div class="brSay"><div class="pt" style="background:${gst.col}">${gst.i}</div><div class="tx"><b>${esc(gst.n)}</b><br>Che fai?</div></div><div class="brCh">${ep.ch.map((c, k) => `<button class="brBt" data-k="${k}">${esc(c.t)}</button>`).join("")}</div>`;
        sc.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => {
          const c = ep.ch[+b.dataset.k]; st.hearts[gst.id] = (st.hearts[gst.id] || 0) + c.h; st.cash = Math.max(0, st.cash + c.cash); st.rep += c.rep; save(st);
          const dl = [c.cash ? `${c.cash > 0 ? "+" : ""}${c.cash} cassa` : "", c.rep ? `+${c.rep} reputazione` : "", c.h ? "+1 ❤" : ""].filter(Boolean).join(" · ");
          sc.innerHTML = `<div class="brSay"><div class="pt" style="background:${gst.col}">${gst.i}</div><div class="tx">${c.r.replace(/</g, "&lt;")}</div></div><div class="sub">${dl}${(st.hearts[gst.id] || 0) >= 3 ? `<br><b>${esc(gst.n)}: storia conclusa.</b>` : ""}</div><button class="brBt" id="ok">Chiudi il bar</button>`; sc.querySelector("#ok").onclick = next;
        }));
      };
      say();
    }
    if (o && o.evening) evening(); else hub();
  }
  window.__bar = { open, state: load, ITEMS, UP, G, reset: () => save(def()) };
})();
