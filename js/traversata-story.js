// ================= v17 · LA TRAVERSATA D'ORO: IL TORNEO DEI TRABUCCHI =================
// Nuova saga narrativa speciale: dialoghi drammatici, bivi tattici sul bancone del bar,
// sfide tra le onde e partite sul campetto della scogliera con la ciurma dei Corsari del Tigullio.
(function () {
  const K_TRAV = "ali-di-rondine.traversata-oro";

  function setChap(t) {
    if (window.gameEngine && typeof window.gameEngine.chap === "function") {
      window.gameEngine.chap(t);
    } else {
      const el = document.getElementById("chap");
      if (el) el.textContent = t;
    }
  }

  function showText(who, html) {
    if (window.gameEngine && typeof window.gameEngine.text === "function") {
      window.gameEngine.text(who, html);
    } else {
      const el = document.getElementById("text");
      if (el) el.innerHTML = `<span class="who">${who}</span><span class="t">${html}</span>`;
    }
  }

  function showButtons(list, one) {
    if (window.gameEngine && typeof window.gameEngine.buttons === "function") {
      window.gameEngine.buttons(list, one);
    } else {
      const c = document.getElementById("choices");
      if (!c) return;
      c.innerHTML = "";
      c.className = "choices" + (one ? " one" : "");
      list.forEach((o) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = o.label;
        if (o.cls) b.className = o.cls;
        if (o.sub) {
          const s = document.createElement("small");
          s.textContent = o.sub;
          b.appendChild(s);
        }
        b.onclick = () => {
          c.innerHTML = "";
          if (o.fn) o.fn();
        };
        c.appendChild(b);
      });
    }
  }

  const GUESTS = { solari: "Renzo Solari" };

  function runScene(sceneLines, onDone) {
    if (window.gameEngine && typeof window.gameEngine.play === "function") {
      const lines = sceneLines.map(([who, text]) => {
        if (GUESTS[who]) { text = `${GUESTS[who]}: ${text}`; who = "voce"; }
        if (window.gameEngine.L) return window.gameEngine.L(who, text, "beach");
        return { who, text, bg: "beach" };
      });
      window.gameEngine.play(lines, onDone);
    } else {
      onDone && onDone();
    }
  }

  const TRAV_EP = [
    {
      id: "ep1",
      title: "Il Veliero di Ponente",
      sub: "Capitolo 1 · Una vecchia scommessa sul molo",
      bg: "beach",
      speaker: "baciccia",
      scene: [
        ["baciccia", "Guarda là, Leo. Quel gozzo a vela latina ormeggiato sotto il faro non si vedeva dal 1982."],
        ["leo", "Chi c'è al timone, Baciccia? Sembrano pescatori di Camogli."],
        ["baciccia", "Peggio: è Renzo Solari, detto 'Il Falco'. Ai tempi della C2 giocavamo insieme. Dice che il nostro molo non reggerebbe dieci minuti contro i suoi trabucchi."],
        ["sara", "Ho i dati delle loro ultime partite: giocano con un 3-5-2 asimmetrico, sfruttano il vento di mare per tiri a scendere sul secondo palo."],
        ["nonna", "Che tirino dove vogliono! Ho appena sfornato una teglia con cipolle di Certaldo. Se Renzo vuole fare il gradasso, gli tiro la teglia sul gozzo!"]
      ],
      choices: [
        {
          id: "schema_gigi",
          label: "Disegna lo schema delle tazzine con Gigi al Bar",
          sub: "Tattica di contropiede · Blocco centrale e verticalizzazione veloce",
          effect: "tattica",
          mate: "Gigi",
          line: "Gigi dispone tre tazzine sul bancone e spiega come aggirare la marcatura a uomo dei Corsari."
        },
        {
          id: "grinta_nico",
          label: "Allena le uscite basse sul cemento con Nico",
          sub: "Grinta e coraggio · Nico si lancia sui palloni bagnati dalla risacca",
          effect: "grinta",
          mate: "Nico",
          line: "Nico para quattro tiri consecutivi gridando: «Nessun falco entra nel nido della Rondine!»"
        }
      ],
      team: {
        name: "I Corsari del Tigullio",
        vs: "i Corsari del Tigullio",
        gk: "Solari",
        color: "#1d3fa3"
      },
      winLine: "«Un gol da cineteca di Leo spegne le arie del Falco! Borgo Marino conquista il primo round della Traversata!»"
    },
    {
      id: "ep2",
      title: "La Trappola dei Caruggi",
      sub: "Capitolo 2 · L'allenamento segreto della focaccia",
      bg: "borgo",
      speaker: "nonna",
      scene: [
        ["nonna", "Ieri sera ho visto due spie dei Corsari che sbirciavano dal vicolo delle Sirene. Pensano che ci alleniamo sul campo grande."],
        ["leo", "E invece dove andiamo, Nonna?"],
        ["nonna", "Tutti dentro la Panda 30! Vi porto su al santuario di Monte Nero. Là c'è una piazzola di pietre dove la palla rimbalza come una lepre!"],
        ["tommy", "Sul selciato bagnato? Ma è scivolosissimo!"],
        ["gigi", "È proprio lì il segreto, Tommy: chi impara a controllare la palla sulle pietre umide, sull'erba vola come un gabbiano!"]
      ],
      choices: [
        {
          id: "dribbling",
          label: "Perfeziona il dribbling nello spazio stretto dei caruggi",
          sub: "Tecnica sopraffina · Leo salta le fioriere con tocchi d'esterno",
          effect: "tecnica",
          mate: "Tommy",
          line: "Leo danza sul selciato scambiando palla di prima con Tommy tra le porte delle case."
        },
        {
          id: "tiro_faro",
          label: "Prova le conclusioni a giro con vento contrario",
          sub: "Potenza balistica · Tiro a scendere sul palo lontano",
          effect: "tiro",
          mate: "Sara",
          line: "Sara calcola le folate del vento: Leo scaglia tre tiri a parabola perfetta che gonfiano la rete improvvisata."
        }
      ],
      team: {
        name: "Gabbiani di Camogli",
        vs: "i Gabbiani di Camogli",
        gk: "Vincenzo",
        color: "#ff7b00"
      },
      winLine: "«La coordinazione stretta imparata nei caruggi beffa la difesa avversaria! La Rondine vola in semifinale!»"
    },
    {
      id: "ep3",
      title: "La Battaglia della Scogliera",
      sub: "Capitolo 3 · Scirocco e mareggiate",
      bg: "beach",
      speaker: "ester",
      scene: [
        ["ester", "Attenzione ragazzi: la lanterna del faro segnala mare forza quattro in arrivo dal largo."],
        ["sara", "Il campo del molo sarà spazzato da spruzzi di salsedine. I palloni diventeranno pesanti e imprevedibili."],
        ["nico", "Meglio così! Il cemento bagnato è il mio habitat naturale. Se Renzo crede di spaventarci con due onde, non conosce i liguri!"],
        ["papa", "Ho portato tre ceste di focaccia appena sfornata sulla banchina: energia pura prima del fischio d'inizio!"]
      ],
      choices: [
        {
          id: "muro_costa",
          label: "Forma il Muro della Scogliera davanti a Nico",
          sub: "Difesa ferrea · Blocca tutti i tiri dalla distanza",
          effect: "difesa",
          mate: "Ruggeri",
          line: "Ruggeri guida la linea difensiva: nessun pallone passa e la squadra regge l'urto delle folate di vento."
        },
        {
          id: "contropiede",
          label: "Innesca il contropiede lampo sul filo della banchina",
          sub: "Velocità micidiale · Leo lancia Tommy nello spazio vuoto",
          effect: "velocita",
          mate: "Leo",
          line: "Leo controlla di tacco sulla linea dell'out e pennella un traversone d'oro per il gol decisivo!"
        }
      ],
      team: {
        name: "Fortezza di Portovenere",
        vs: "la Fortezza di Portovenere",
        gk: "Balbi",
        color: "#2a9d8f"
      },
      winLine: "«Sotto gli spruzzi della risacca, una bordata terrificante di Leo all'incrocio piega la Fortezza! SIAMO IN FINALE!»"
    },
    {
      id: "ep4",
      title: "La Notte della Lanterna d'Oro",
      sub: "Capitolo 4 · La Grande Finale sotto le stelle",
      bg: "stadium",
      speaker: "leo",
      scene: [
        ["leo", "Tutto il Borgo è sceso al molo: ci sono le lampare accese, i tavolini della trattoria affollati e la Panda di Nonna coi fari puntati sul campo."],
        ["solari", "Riconosco il vostro valore, Moretti. Ma la Lanterna d'Oro appartiene a chi ha navigato più mari. Stasera non ci saranno sconti."],
        ["baciccia", "Fagli vedere di che pasta siamo fatti, Leo! Il Tiro della Rondine ha il cuore di questo golfo!"],
        ["nonna", "Se vincete, focaccia gratis per tutto il paese fino all'alba! AVANTI RONDINE!"]
      ],
      choices: [
        {
          id: "tiro_rondine_finale",
          label: "Scatena il Tiro della Rondine Dorata al 90°",
          sub: "Super mossa finale · La parabola impossibile a picco sul mare",
          effect: "super",
          mate: "Leo",
          line: "Leo carica tutta la grinta della squadra: la palla si alza verso le stelle e scende a foglia morta nell'angolino!"
        },
        {
          id: "gioco_corale",
          label: "Azione corale con tutta la squadra di Borgo Marino",
          sub: "Il calcio del popolo · Scambi di prima tra Nico, Tommy e Leo",
          effect: "cuore",
          mate: "Squadra",
          line: "Sette passaggi di prima al volo fanno impazzire i Corsari: tap-in vincente a porta vuota!"
        }
      ],
      team: {
        name: "I Corsari di Renzo Solari",
        vs: "i Corsari di Renzo Solari",
        gk: "Renzo Solari",
        color: "#c9a24a"
      },
      winLine: "«TRIONFO ASSOLUTO! La Lanterna d'Oro è di Borgo Marino! La festa esplode tra fuochi d'artificio e clacson della Panda 30!»"
    }
  ];
  // ---------- Bivi di provviste: ogni scelta lascia qualcosa nella stiva ----------
  // Focacce = energia in partita. Lanterne = rivelano la mossa dell'avversario. Generoso (a) o pratico (b).
  const TRAV_DIL = [
    {
      scene: [["gigi", "Boss, nella stiva c'è posto per una cosa sola: o le focacce di Nonna, o la lanterna a olio di zio Sergio. Il resto lo carichiamo in spalla."]],
      a: { label: "Dividi le focacce con la ciurma di Renzo", sub: "+1 Lanterna · un gesto che si ricorda", res: { lanterne: 1 }, gen: 1, line: "Renzo azzanna una focaccia e borbotta che «è accettabile». Per lui è un'ovazione. Ti passa una lanterna." },
      b: { label: "Tieni le focacce per la squadra", sub: "+2 Focacce · energia per la partita", res: { focacce: 2 }, gen: 0, line: "Nonna annuisce soddisfatta: «Prima i miei, poi il mondo». E ti fa una doppia porzione." }
    },
    {
      scene: [["nonna", "Su, caricate la Panda. Ah, Leo: il custode del santuario ha perso il cappello nel vicolo. Sembra un'inezia. Per lui è l'unico che ha."]],
      a: { label: "Cerca il cappello del custode tra i caruggi", sub: "+1 Lanterna · tempo perso, cuore guadagnato", res: { lanterne: 1 }, gen: 1, line: "Lo trovi sul tetto, in compagnia di un gabbiano che si è fatto un nido. Il custode ti regala una lampada del santuario." },
      b: { label: "Vai dritto all'allenamento", sub: "+2 Focacce · niente tempo da perdere", res: { focacce: 2 }, gen: 0, line: "La squadra si allena fino a tardi. Il cappello resta sul tetto. Il gabbiano non protesta." }
    },
    {
      scene: [["ester", "Il vento sta girando. Renzo ha un gozzo che fa acqua sul lato sinistro e una fierezza che lo tiene a galla meglio dello scafo."]],
      a: { label: "Offri una mano a Renzo per tappare la falla", sub: "+1 Lanterna · e un rivale da rispettare", res: { lanterne: 1 }, gen: 1, line: "Lavorate in silenzio mezz'ora. Lui dice: «Non è un favore». Tu rispondi: «Certo che no». Tutti e due sapete di mentire." },
      b: { label: "Concentrati sulla partita", sub: "+2 Focacce · testa bassa, fame alta", res: { focacce: 2 }, gen: 0, line: "Mangi, ti scaldi, ti concentri. Dal molo senti Renzo che impreca contro la falla. Sembra quasi dispiaciuto." }
    },
    {
      scene: [["solari", "Ti dirò una cosa, Moretti. Quel gozzo era di mio padre. Se perdo stasera lo lascio in porto per sempre. Se vinco, ci salpo ancora una volta."], ["leo", "Non so cosa si debba rispondere a una frase così. Sorrido, e per una volta non faccio battute."]],
      a: { label: "«Gioca per il tuo gozzo, Renzo. Io gioco per il mio Borgo.»", sub: "+2 Lanterne · una partita vera, senza rancore", res: { lanterne: 2 }, gen: 1, line: "Renzo ti stringe la mano con la sua mano di cordame. Poi ricorda di dover sembrare cattivo e rimette il broncio." },
      b: { label: "«Mi dispiace. Ma stasera non ti faccio sconti.»", sub: "+3 Focacce · rispetto, e basta", res: { focacce: 3 }, gen: 0, line: "Renzo annuisce lentamente. «Così mi piaci.» Nonna ti caccia in bocca una focaccia: «Per il coraggio»." }
    }
  ];

  const TRAV_END = {
    gen: [
      "Renzo non lascia il gozzo in porto: lo spinge in acqua, e la Rondine intera sale a bordo, Nonna compresa, con la teglia in grembo. «Una traversata sola», dice. Dura fino all'alba, e nessuno guarda l'ora.",
      "A riva Baciccia, per la prima volta in quarant'anni, non ha niente da dire. Poi dice: «Sempre stato il migliore dei miei compagni, quel testone.» Lo sente solo il mare."
    ],
    pra: [
      "Renzo solleva la Lanterna d'Oro e la porge a Leo senza una parola. Poi, con la voce più bassa che ha: «Il gozzo resta in porto. Ma lo tengo lucido.» Nonna gli fa arrivare una teglia in segreto.",
      "Il Borgo festeggia fino a tardi. Sulla banchina, un vecchio pescatore guarda il suo gozzo e sorride per la prima volta. Il vento, per una volta, non ha niente da obiettare."
    ]
  };

  // Avversari: schema delle mosse (0 Pressing, 1 Blocco, 2 Contropiede), rumore, tiri speciali, indizi
  const TRAV_OPP = [
    { pat: [0, 0, 1], noise: 0.15, power: 0, special: [], hint: "Pressing alto due volte, poi si rintana a Blocco." },
    { pat: [2, 1, 2, 0], noise: 0.18, power: 1, special: [5], hint: "Ama il Contropiede, ogni tanto cambia al volo.", spName: "VOLO DEL GABBIANO" },
    { pat: [1, 1, 2, 0], noise: 0.2, power: 2, special: [4, 7], hint: "Si chiude due volte, poi scatta e pressa.", spName: "BORDATA DELLA FORTEZZA" },
    { pat: [0, 1, 2, 0, 2], noise: 0.22, power: 3, special: [3, 6], hint: "Cambia ritmo di continuo: leggi lo storico.", spName: "SCIROCCO D'ORO" }
  ];
  const STANCE = [["🔥", "Pressing alto"], ["🧱", "Blocco basso"], ["⚡", "Contropiede"]];

  // ---------- Dati (stesse chiavi, nuovi campi con default sicuri) ----------
  function getTravData() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(K_TRAV)); } catch (e) {}
    if (!d || typeof d !== "object") d = {};
    if (!Array.isArray(d.won)) d.won = [];
    if (!d.picks || typeof d.picks !== "object") d.picks = {};
    if (!d.stars || typeof d.stars !== "object") d.stars = {};
    if (!d.paid || typeof d.paid !== "object") d.paid = {};
    if (!d.gen || typeof d.gen !== "object") d.gen = {};
    if (!d.res || typeof d.res !== "object") d.res = { focacce: 1, lanterne: 1 };
    d.res.focacce = Math.max(0, Math.min(6, d.res.focacce | 0));
    d.res.lanterne = Math.max(0, Math.min(5, d.res.lanterne | 0));
    d.best = d.best | 0;
    d.played = d.played | 0;
    d.done = !!d.done;
    return d;
  }

  function saveTravData(d) {
    try { localStorage.setItem(K_TRAV, JSON.stringify(d)); } catch (e) {}
  }

  function stars(n) { return "★".repeat(n) + "☆".repeat(3 - n); }

  // ---------- Stile (prefisso tvx-) ----------
  function injectCss() {
    if (document.getElementById("tvx-css")) return;
    const s = document.createElement("style");
    s.id = "tvx-css";
    s.textContent = `
.tvx-ov{position:fixed;inset:0;z-index:9000;background:#06101f;color:var(--ink,#f3f6fb);display:flex;flex-direction:column;align-items:center;overflow:hidden;touch-action:manipulation;-webkit-user-select:none;user-select:none}
.tvx-in{width:100%;max-width:480px;height:100%;display:flex;flex-direction:column;padding:8px 12px 12px;box-sizing:border-box;gap:8px}
.tvx-top{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--dim,#9fb0c8)}
.tvx-x{background:none;border:0;color:var(--dim,#9fb0c8);font:inherit;font-size:13px;padding:6px 4px;text-decoration:underline}
.tvx-hud{display:flex;justify-content:space-between;align-items:center;gap:6px;font-weight:800;flex-wrap:wrap}
.tvx-score{font-size:18px;color:var(--gold,#ffd23f)}
.tvx-chip{background:var(--panel,#14243d);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:3px 8px;font-size:13px;white-space:nowrap}
.tvx-cv{width:100%;aspect-ratio:3/4;max-height:56vh;background:#0a2a52;border-radius:12px;border:2px solid rgba(255,255,255,.2);display:block;touch-action:none}
.tvx-msg{min-height:56px;background:var(--panel,#14243d);border-radius:10px;padding:8px 10px;font-size:15px;line-height:1.3;display:flex;align-items:center}
.tvx-ctl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:auto}
.tvx-ctl .full{grid-column:1/-1}
.tvx-b{border:0;border-radius:12px;padding:12px 6px;min-height:56px;font:inherit;font-size:15px;font-weight:800;color:#fff;background:linear-gradient(#2c4a7c,#1d3358);box-shadow:0 3px 0 #0a1428}
.tvx-b.hot{background:linear-gradient(#ff6b57,#c9302c)}
.tvx-b.alt{background:linear-gradient(#c58b1c,#8c5f0c)}
.tvx-b.on{outline:3px solid var(--gold,#ffd23f)}
.tvx-b:disabled{opacity:.38}
.tvx-b:active{transform:translateY(2px)}
.tvx-b small{display:block;font-weight:600;font-size:11px;opacity:.85}
.tvx-card{background:var(--panel,#14243d);border-radius:14px;padding:12px;text-align:center;border:1px solid rgba(255,255,255,.15)}
.tvx-card .big{font-size:44px;line-height:1.1}
.tvx-card .nm{font-weight:800;font-size:17px}
.tvx-card .sm{font-size:13px;color:var(--dim,#9fb0c8);margin-top:2px}
.tvx-card.sp{border-color:#ff5a3c;box-shadow:0 0 14px rgba(255,90,60,.5)}
.tvx-hist{display:flex;gap:6px;justify-content:center;align-items:center;font-size:20px;min-height:28px}
`;
    document.head.appendChild(s);
  }

  function mkOverlay(title, onAbandon) {
    injectCss();
    const ov = document.createElement("div");
    ov.className = "tvx-ov";
    ov.innerHTML = `<div class="tvx-in"><div class="tvx-top"><span>${title}</span><button class="tvx-x" type="button">Abbandona</button></div></div>`;
    document.body.appendChild(ov);
    ov.querySelector(".tvx-x").addEventListener("click", onAbandon);
    return { ov, inn: ov.querySelector(".tvx-in") };
  }

  function mkBtns(ctl, list) {
    ctl.innerHTML = "";
    list.forEach((o) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tvx-b " + (o.cls || "");
      b.innerHTML = o.label;
      if (o.dis) b.disabled = true;
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); if (!o.dis && o.fn) o.fn(); });
      ctl.appendChild(b);
      o.el = b;
    });
  }

  // ---------- Minigioco 1: la traversata a vela ----------
  // Tre corsie, scorri o tocca ◀ ▶: evita onde e scogli, raccogli focacce e lanterne.
  function playSea(ch, opts, onEnd) {
    const free = !!(opts && opts.free);
    const { ov, inn } = mkOverlay(free ? "Rotta libera" : "La Traversata", () => end(true));
    inn.insertAdjacentHTML("beforeend", `
      <div class="tvx-hud"><span class="tvx-chip tm"></span><span class="tvx-chip hp"></span><span class="tvx-chip it"></span></div>
      <canvas class="tvx-cv" width="240" height="320"></canvas>
      <div class="tvx-msg"></div><div class="tvx-ctl"></div>`);
    const cv = ov.querySelector("canvas"), g = cv.getContext("2d"), msg = ov.querySelector(".tvx-msg"), ctl = ov.querySelector(".tvx-ctl");
    const LX = [40, 120, 200], BY = 268, DUR = free ? 28 : 20;
    let alive = true, running = false, raf = 0, last = 0;
    let lane = 1, bx = LX[1], time = DUR, hits = 0, foc = 0, lan = 0, objs = [], spawn = 0.6, scroll = 0, flash = 0, el = 0;

    function hud() {
      ov.querySelector(".tm").textContent = "⏱ " + Math.ceil(time) + "s";
      ov.querySelector(".hp").textContent = "🛡️ " + "❤".repeat(3 - hits) + "·".repeat(hits);
      ov.querySelector(".it").textContent = `🥖 ${foc}  💡 ${lan}`;
    }
    function go(dir) { if (!running) return; lane = Math.max(0, Math.min(2, lane + dir)); }
    function end(abandon) {
      if (!alive) return;
      alive = false; cancelAnimationFrame(raf);
      document.removeEventListener("keydown", key);
      ov.remove();
      onEnd({ foc, lan, hits, abandon: !!abandon, score: Math.max(0, foc * 10 + lan * 20 - hits * 5 + (hits < 3 ? 10 : 0)) });
    }
    function key(e) { if (e.key === "ArrowLeft") go(-1); else if (e.key === "ArrowRight") go(1); }
    document.addEventListener("keydown", key);
    let sx = null;
    cv.addEventListener("pointerdown", (e) => { sx = e.clientX; });
    cv.addEventListener("pointerup", (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 18) go(dx > 0 ? 1 : -1);
      else { const r = cv.getBoundingClientRect(); go(e.clientX < r.left + r.width / 2 ? -1 : 1); }
    });

    function addRow() {
      const nh = Math.random() < 0.35 + ch * 0.06 ? 2 : 1;
      const lanes = [0, 1, 2].sort(() => Math.random() - 0.5);
      for (let i = 0; i < nh; i++) objs.push({ l: lanes[i], y: -20, t: Math.random() < 0.5 ? "w" : "r" });
      if (Math.random() < 0.7) {
        const rest = lanes.slice(nh);
        objs.push({ l: rest[Math.floor(Math.random() * rest.length)], y: -20, t: Math.random() < 0.18 ? "l" : "f" });
      }
    }
    function draw() {
      const sea = g.createLinearGradient(0, 0, 0, 320);
      sea.addColorStop(0, "#0c3b73"); sea.addColorStop(1, "#06214a");
      g.fillStyle = sea; g.fillRect(0, 0, 240, 320);
      g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 2;
      for (let i = 0; i < 9; i++) { const y = ((i * 40 + scroll) % 360) - 20; g.beginPath(); g.moveTo(10 + (i * 53) % 60, y); g.quadraticCurveTo(40 + (i * 53) % 60, y - 6, 70 + (i * 53) % 60, y); g.stroke(); g.beginPath(); g.moveTo(130 + (i * 31) % 80, y + 14); g.quadraticCurveTo(150 + (i * 31) % 80, y + 8, 170 + (i * 31) % 80, y + 14); g.stroke(); }
      g.strokeStyle = "rgba(255,255,255,.09)"; g.setLineDash([6, 10]);
      [80, 160].forEach((x) => { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 320); g.stroke(); });
      g.setLineDash([]);
      g.font = "26px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      objs.forEach((o) => {
        const x = LX[o.l];
        if (o.t === "w") { g.fillText("🌊", x, o.y); }
        else if (o.t === "r") { g.fillText("🪨", x, o.y); }
        else if (o.t === "f") { g.fillText("🥖", x, o.y); }
        else { g.fillText("💡", x, o.y); }
      });
      // gozzo
      g.save(); g.translate(bx, BY);
      if (flash > 0) g.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(el * 30));
      g.fillStyle = "#b5481e"; g.beginPath(); g.moveTo(-18, 0); g.lineTo(18, 0); g.lineTo(12, 22); g.lineTo(-12, 22); g.closePath(); g.fill();
      g.fillStyle = "#f3f3f0"; g.beginPath(); g.moveTo(0, -30); g.lineTo(16, -2); g.lineTo(0, -2); g.closePath(); g.fill();
      g.fillStyle = "#6b4a2a"; g.fillRect(-1, -32, 2, 32);
      g.restore();
    }
    function step(now) {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; el += dt;
      if (running) {
        time -= dt; scroll = (scroll + dt * 90) % 360;
        if (flash > 0) flash -= dt;
        bx += (LX[lane] - bx) * Math.min(1, dt * 14);
        const v = 120 + ch * 18 + (DUR - time) * 3;
        spawn -= dt;
        if (spawn <= 0) { addRow(); spawn = Math.max(0.45, 0.9 - ch * 0.06 - (DUR - time) * 0.008); }
        objs.forEach((o) => { o.y += v * dt; });
        objs = objs.filter((o) => {
          if (Math.abs(o.y - (BY - 2)) < 22 && Math.abs(LX[o.l] - bx) < 24) {
            if (o.t === "f") { foc++; if (window.sfx) window.sfx("kick"); return false; }
            if (o.t === "l") { lan++; if (window.sfx) window.sfx("kick"); return false; }
            hits++; flash = 0.8; if (window.sfx) window.sfx("crowd"); return false;
          }
          return o.y < 350;
        });
        hud();
        if (time <= 0 || hits >= 3) { running = false; summary(); }
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    function summary() {
      const wreck = hits >= 3;
      msg.innerHTML = `<span>${wreck ? "<b>Incagliati!</b> Il gozzo si ferma sugli scogli: salvi quel che hai." : "<b>Approdo!</b> Il molo è in vista."}<br>🥖 ${foc} focacce · 💡 ${lan} lanterne · scafo ${3 - hits}/3</span>`;
      mkBtns(ctl, [{ label: "Avanti ➔", cls: "hot full", fn: () => end(false) }]);
    }
    hud(); draw();
    msg.innerHTML = `<span><b>Traversata.</b> Scorri a destra/sinistra (o tocca ◀ ▶) tra le 3 corsie. Evita 🌊 e 🪨, prendi 🥖 (energia) e 💡 (lanterne). Ogni urto toglie un cuore e un punto energia in partita.</span>`;
    mkBtns(ctl, [
      { label: "◀", fn: () => go(-1) },
      { label: "▶", fn: () => go(1) },
      { label: "⛵ Salpa!", cls: "hot full", fn: () => { if (running || time < DUR) return; running = true; mkBtns(ctl, [{ label: "◀", fn: () => go(-1) }, { label: "▶", fn: () => go(1) }]); msg.innerHTML = "<span>Rotta libera, mozzo!</span>"; } }
    ]);
    raf = requestAnimationFrame(step);
  }

  // ---------- Minigioco 2: il duello tattico ----------
  // Leggi la mossa dell'avversario (storico + lanterne) e scegli la contromossa. Gestisci l'energia.
  function playDuel(idx, tactic, boot, onEnd) {
    const ep = TRAV_EP[idx], opp = TRAV_OPP[idx];
    let alive = true;
    const { ov, inn } = mkOverlay(ep.title, () => end(true));
    inn.insertAdjacentHTML("beforeend", `
      <div class="tvx-hud"><span class="tvx-score"></span><span class="tvx-chip en"></span><span class="tvx-chip lt"></span></div>
      <div class="tvx-card"><div class="big stn">❔</div><div class="nm stname">Mossa avversaria</div><div class="sm stsub"></div></div>
      <div class="tvx-hist"></div>
      <div class="tvx-msg"></div><div class="tvx-ctl"></div>`);
    const q = (s) => ov.querySelector(s), msg = q(".tvx-msg"), ctl = q(".tvx-ctl");
    const eff = tactic.effect;
    const costT = (eff === "tiro" || eff === "super" || eff === "velocita") ? 1 : 2;
    const costD = eff === "velocita" ? 0 : 1;
    let pf = 0, pa = 0, turn = 0, maxT = 8;
    let energy = Math.min(7, 2 + boot.foc + (eff === "grinta" || eff === "difesa" || eff === "cuore" ? 2 : 0) - boot.hits);
    energy = Math.max(2, energy);
    let lant = boot.lan + (eff === "tattica" || eff === "tecnica" ? 1 : 0);
    let hist = [], cur = null, useL = false, locked = false;
    const rndStance = (t) => (Math.random() < opp.noise ? Math.floor(Math.random() * 3) : opp.pat[t % opp.pat.length]);

    function end(abandon) {
      if (!alive) return;
      alive = false; ov.remove();
      const win = pf > pa || (pf === pa && !abandon);
      onEnd({ win: abandon ? false : win, pf, pa, lant, abandon: !!abandon, pens: !abandon && pf === pa });
    }
    function hud() {
      q(".tvx-score").textContent = `RONDINE ${pf}–${pa} ${["CORSARI", "GABBIANI", "FORTEZZA", "RENZO"][idx] || ""}`;
      q(".en").textContent = `⚡ ${energy}`;
      q(".lt").textContent = `💡 ${lant}`;
      q(".tvx-hist").innerHTML = `<span style="font-size:12px;color:var(--dim,#9fb0c8)">Storico:</span>` + (hist.length ? hist.map((h) => STANCE[h][0]).join(" ") : "–") + `<span style="font-size:12px;color:var(--dim,#9fb0c8)"> · Turno ${turn + 1}/${maxT}</span>`;
    }
    function startTurn() {
      locked = false; useL = false;
      if (turn > 0) energy = Math.min(7, energy + 1);
      const sp = opp.special.includes(turn) || (turn >= 8 && false);
      cur = { s: rndStance(turn), sp };
      const card = q(".tvx-card");
      card.className = "tvx-card" + (sp ? " sp" : "");
      q(".stn").textContent = sp ? "💥" : "❔";
      q(".stname").textContent = sp ? opp.spName : "Mossa nascosta";
      q(".stsub").textContent = sp ? "Tiro speciale in arrivo: solo CHIUDI lo ferma (altrimenti 2 gol)" : (turn === 0 ? "Dossier di Sara: " + opp.hint : "Leggi lo storico o accendi una lanterna");
      msg.innerHTML = `<span>${sp ? "<b>Segnale d'allarme!</b> Chiudi gli spazi o incassi un colpo doppio." : "<b>Turno " + (turn + 1) + ".</b> Scegli la contromossa: Dribbling batte 🔥, Passaggio batte 🧱, Tiro batte ⚡."}</span>`;
      hud(); controls();
    }
    function controls() {
      const list = [
        { label: `💡 Usa lanterna<small>${lant} disponibili · rivela la mossa</small>`, cls: "alt full" + (useL ? " on" : ""), dis: lant < 1 || useL, fn: () => {
          if (locked || lant < 1 || useL) return; lant--; useL = true;
          q(".stn").textContent = STANCE[cur.s][0]; q(".stname").textContent = STANCE[cur.s][1]; q(".stsub").textContent = "Rivelata dalla lanterna!";
          hud(); controls();
        } },
        { label: `🔥 Dribbling<small>costa ${costD} ⚡ · batte Pressing</small>`, dis: energy < costD, fn: () => play(0, costD) },
        { label: `🧱 Passaggio<small>costa 1 ⚡ · batte Blocco</small>`, dis: energy < 1, fn: () => play(1, 1) },
        { label: `⚡ Tiro (2 punti)<small>costa ${costT} ⚡ · batte Contropiede</small>`, dis: energy < costT, fn: () => play(2, costT) },
        { label: `🛡️ Chiudi<small>costa 1 ⚡ · ferma il tiro speciale</small>`, dis: energy < 1, fn: () => play(3, 1) }
      ];
      mkBtns(ctl, list);
    }
    function play(m, cost) {
      if (locked) return; locked = true;
      energy -= cost; hist.push(cur.s);
      const st = cur.s;
      q(".stn").textContent = STANCE[st][0]; q(".stname").textContent = STANCE[st][1];
      q(".stsub").textContent = cur.sp ? opp.spName + "!" : "";
      let txt = "", my = 0, op = 0;
      const win = m < 3 && m === st, exposed = m < 3 && m === (st + 1) % 3;
      if (win) { my = m === 2 ? 2 : 1; txt = m === 2 ? "<b>TIRO DELLA RONDINE!</b> Doppio punto: portiere battuto." : (m === 0 ? "<b>Dribbling secco!</b> Superi il pressing e depositi in rete." : "<b>Passaggio filtrante!</b> Il blocco si apre e Leo la mette dentro."); if (window.sfx) window.sfx("goal"); }
      else if (m === 3) txt = cur.sp ? "<b>Chiusura perfetta!</b> Il tiro speciale si spegne sul muro di Ruggeri." : "Ti chiudi bene: nessuno passa, nessuno segna.";
      else if (exposed) { if (Math.random() < 0.4 + idx * 0.1) { op = 1; txt = "Scoperto! Si infilano alle tue spalle: <b>gol avversario</b>."; } else txt = "Mossa azzardata: ti salva Nico con un riflesso da gatto."; }
      else txt = "Azione confusa: nessuno ha la meglio. Palla che scotta.";
      if (cur.sp && m !== 3) { op += 2; txt += `<br><b>${opp.spName}!</b> Il tiro speciale vale doppio.`; }
      pf += my; pa += op;
      if (op && !win && window.sfx) window.sfx("crowd");
      hud();
      msg.innerHTML = `<span>${txt}</span>`;
      turn++;
      const over = (turn >= maxT && pf !== pa) || pf >= 5 || pa >= 5 || turn >= maxT + 3;
      mkBtns(ctl, [{ label: over ? "Fischio finale ➔" : "Prossimo turno ➔", cls: "hot full", fn: () => { if (over) end(false); else startTurn(); } }]);
    }
    startTurn();
  }

  // ---------- Menu e flusso ----------
  function openTraversataMenu(onBack) {
    if (window.closeAltStage) window.closeAltStage();
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "scene", bg: "beach" });
    }
    const data = getTravData();
    const curIdx = data.won.length < TRAV_EP.length ? data.won.length : TRAV_EP.length - 1;
    const ep = TRAV_EP[curIdx];
    const isCompleted = data.won.length === TRAV_EP.length;
    const tot = Object.keys(data.stars).reduce((a, k) => a + (data.stars[k] | 0), 0);

    setChap("La Traversata d'Oro");
    showText("baciccia", `
      <b>La Traversata d'Oro</b> · ${data.won.length}/${TRAV_EP.length} sfide · ${tot}/12 ★<br>
      ${isCompleted
        ? "<span style='color:var(--gold);'>Lanterna d'Oro conquistata.</span>"
        : `Prossima: <b>${ep.title}</b>`}<br>
      <span style="color:var(--dim);font-size:12px;">🥖 Focacce ${data.res.focacce} · 💡 Lanterne ${data.res.lanterne} · Rotta libera record ${data.best}</span>`);

    const btnList = [];
    if (!isCompleted) {
      btnList.push({ label: `Gioca: ${ep.title}`, sub: ep.sub, cls: "hot", fn: () => playTravChapter(curIdx, onBack) });
    } else {
      btnList.push({ label: "Rivivi la Finalissima", sub: "Renzo vuole la rivincita", cls: "hot", fn: () => playTravChapter(3, onBack, true) });
    }
    if (data.won.length > 0) btnList.push({ label: "Capitoli e stelle", sub: "Rigioca per le 3 stelle", fn: () => travChapters(onBack) });
    btnList.push({ label: "⛵ Rotta libera", sub: "Corsa a vela · record personale", cls: "pick", fn: () => playSea(1, { free: true }, (r) => {
      if (r.abandon) return openTraversataMenu(onBack);
      const d = getTravData();
      if (r.score > d.best) { d.best = r.score; saveTravData(d); if (window.toast) window.toast("Nuovo record: " + r.score, "success", "⛵"); }
      openTraversataMenu(onBack);
    }) });
    btnList.push({ label: "🚗 Corsa della Panda 30", sub: "Consegna le focacce in 3D", cls: "pick", fn: () => { if (window.openPanda3D) window.openPanda3D(() => openTraversataMenu(onBack)); } });
    if (isCompleted) {
      btnList.push({ label: "Ricomincia la Traversata", sub: "Azzera i progressi", fn: () => {
        const d = getTravData();
        saveTravData({ won: [], picks: {}, stars: {}, paid: d.paid, gen: {}, res: { focacce: 1, lanterne: 1 }, best: d.best, played: d.played, done: false });
        if (window.toast) window.toast("Torneo riavviato!", "info", "⛵");
        openTraversataMenu(onBack);
      } });
    }
    btnList.push({ label: "◂ Menu", fn: () => { if (typeof onBack === "function") onBack(); else if (window.gameEngine && window.gameEngine.title) window.gameEngine.title(); } });
    showButtons(btnList);
  }

  function travChapters(onBack) {
    const data = getTravData();
    setChap("La Traversata d'Oro · Capitoli");
    showText("sara", `<b>Registro del torneo</b><br>Rigioca un capitolo vinto: le stelle dipendono dalla differenza punti.`);
    const list = TRAV_EP.map((ep, i) => ({
      label: `${i + 1}. ${ep.title}`,
      sub: data.won.includes(i) ? stars(data.stars[i] | 0) : "Da sbloccare",
      cls: data.won.includes(i) ? "pick" : "",
      fn: () => { if (data.won.includes(i)) playTravChapter(i, onBack, true); else openTraversataMenu(onBack); }
    }));
    list.push({ label: "◂ Indietro", fn: () => openTraversataMenu(onBack) });
    showButtons(list);
  }

  function playTravChapter(idx, onBack, replay) {
    const ep = TRAV_EP[idx];
    setChap(`Traversata d'Oro · ${ep.title}`);
    if (replay) return travDilemma(idx, onBack, true);
    runScene(ep.scene, () => travDilemma(idx, onBack));
  }

  function travDilemma(idx, onBack, replay) {
    const d = TRAV_DIL[idx];
    setChap(`La Stiva · ${TRAV_EP[idx].title}`);
    const go = () => chooseTravTactic(idx, onBack);
    const showDil = () => {
      showText("baciccia", `<b>Si parte tra poco.</b><br>Cosa carichi sul gozzo? Ogni scelta ha un prezzo.`);
      const apply = (o) => {
        const data = getTravData();
        data.res.focacce = Math.min(6, data.res.focacce + (o.res.focacce || 0));
        data.res.lanterne = Math.min(5, data.res.lanterne + (o.res.lanterne || 0));
        data.gen[idx] = o.gen ? 1 : 0;
        saveTravData(data);
        showText("leo", `${o.line}<br><span style="color:var(--dim);font-size:12px;">${o.sub.split(" · ")[0]}</span>`);
        showButtons([{ label: "Verso il piano tattico ➔", cls: "hot", fn: go }], true);
      };
      showButtons([
        { label: d.a.label, sub: d.a.sub, cls: "hot", fn: () => apply(d.a) },
        { label: d.b.label, sub: d.b.sub, cls: "hot", fn: () => apply(d.b) }
      ], true);
    };
    if (replay) return showDil();
    runScene(d.scene, showDil);
  }

  function chooseTravTactic(idx, onBack) {
    const ep = TRAV_EP[idx];
    setChap(`Scelta Tattica · ${ep.title}`);
    const hints = {
      tattica: "+1 lanterna in partita", tecnica: "+1 lanterna in partita",
      grinta: "+2 energia a inizio partita", difesa: "+2 energia a inizio partita", cuore: "+2 energia a inizio partita",
      tiro: "il Tiro costa 1 energia in meno", super: "il Tiro costa 1 energia in meno", velocita: "il Dribbling è gratis"
    };
    showText("leo", `<b>${ep.team.name}</b><br>Prima la traversata in mare, poi il duello. Cosa prepari?<br><span style="color:var(--dim);font-size:12px;">Dossier di Sara: ${TRAV_OPP[idx].hint}</span>`);
    const btns = ep.choices.map((c) => ({
      label: c.label,
      sub: hints[c.effect] || c.sub,
      cls: "hot",
      fn: () => {
        const data = getTravData();
        data.picks[idx] = c.id;
        saveTravData(data);
        startTravMatch(idx, c, onBack);
      }
    }));
    btns.push({ label: "◂ Indietro", fn: () => openTraversataMenu(onBack) });
    showButtons(btns, true);
  }

  function startTravMatch(idx, chosenTactic, onBack) {
    const ep = TRAV_EP[idx];
    setChap(`Partita · ${ep.title}`);
    showText("voce", `<b>RONDINE FC vs ${ep.team.name.toUpperCase()}</b><br><i>${chosenTactic.line}</i><br>Prima la traversata fino al campo: più focacce raccogli, più energia hai.`);
    showButtons([{ label: "⛵ Salpa", cls: "hot", fn: () => {
      playSea(idx, {}, (sea) => {
        if (sea.abandon) return openTraversataMenu(onBack);
        const data = getTravData();
        const boot = { foc: data.res.focacce + sea.foc, lan: Math.min(5, data.res.lanterne + sea.lan), hits: sea.hits };
        boot.foc = Math.min(5, boot.foc);
        data.res.focacce = 0; data.res.lanterne = boot.lan;
        saveTravData(data);
        playDuel(idx, chosenTactic, boot, (r) => concludeTravMatch(idx, r, onBack));
      });
    } }], true);
  }

  function concludeTravMatch(idx, r, onBack) {
    const ep = TRAV_EP[idx];
    if (r.abandon) return openTraversataMenu(onBack);
    const data = getTravData();
    data.played++;
    data.res.lanterne = Math.max(0, Math.min(5, r.lant));
    const diff = r.pf - r.pa;
    if (r.win) {
      const st = diff >= 3 ? 3 : diff >= 1 ? 2 : 1;
      data.stars[idx] = Math.max(data.stars[idx] | 0, st);
      if (!data.won.includes(idx)) { data.won.push(idx); data.won.sort((a, b) => a - b); }
      let coins = 0;
      if (!data.paid[idx]) { data.paid[idx] = 1; coins += idx === 3 ? 4 : 2; }
      if (st === 3 && !data.paid["s" + idx]) { data.paid["s" + idx] = 1; coins += 1; }
      if (data.won.length === TRAV_EP.length) data.done = true;
      saveTravData(data);
      if (coins && typeof window.addCoins === "function") { try { window.addCoins(coins); } catch (e) {} }
      if (window.toast) window.toast(`Vittoria ${r.pf}-${r.pa}${r.pens ? " (rigori)" : ""} · ${stars(st)}${coins ? " · +" + coins + " monete" : ""}`, "success", "🏆");
      const pensNote = r.pens ? "<br><i>Pari a oltranza: la focaccia di Nonna decide e sorride alla Rondine.</i>" : "";
      showText("leo", `<b style="color:var(--gold);">VITTORIA ${r.pf}–${r.pa}${r.pens ? " (rigori)" : ""}</b> · ${stars(st)}<br>${ep.winLine}${pensNote}`);
      const last = idx === TRAV_EP.length - 1;
      showButtons([{ label: last ? "Il finale ➔" : "Continua ➔", cls: "hot", fn: () => (last ? travEpilogue(onBack) : openTraversataMenu(onBack)) }], true);
    } else {
      saveTravData(data);
      showText("nico", `<b>${r.pf}–${r.pa}.</b> «La risacca ci ha messo lo zampino. Un'altra fetta di focaccia e riproviamo, stavolta leggendo meglio lo storico.»`);
      showButtons([
        { label: "Riprova la partita", cls: "hot", fn: () => chooseTravTactic(idx, onBack) },
        { label: "Alla mappa del torneo", fn: () => openTraversataMenu(onBack) }
      ]);
    }
  }

  function travEpilogue(onBack) {
    const data = getTravData();
    const g = Object.keys(data.gen).filter((k) => data.gen[k]).length;
    const lines = (g >= 2 ? TRAV_END.gen : TRAV_END.pra).map((t) => ["baciccia", t]);
    runScene(lines, () => {
      showText("baciccia", `<b>Lanterna d'Oro conquistata.</b><br>Puoi rigiocare i capitoli per le tre stelle.`);
      showButtons([{ label: "◂ Alla mappa", cls: "hot", fn: () => openTraversataMenu(onBack) }], true);
    });
  }

  window.openTraversataMenu = openTraversataMenu;
  if (/[?&]debug/.test(location.search)) window.__trav = { playSea, playDuel, getTravData };
})();
