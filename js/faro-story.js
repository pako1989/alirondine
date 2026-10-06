// ================= v16 · LA NOTTE DEL FARO E LA COPPA DELLE TRE RIVIERE =================
// Nuova saga narrativa a capitoli: bivi, dialoghi teatrali, partite sul campetto della scogliera
// e scelte tattiche con Leo, Sara, Nico, Nonna e la Panda 30.
(function () {
  const K_FARO = "ali-di-rondine.notte-faro";

  // Helpers sicuri che usano window.gameEngine o il DOM direttamente
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

  const GUESTS = { valerio: "Valerio Leone" };

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

  const FARO_EP = [
    {
      id: "ep1",
      title: "L'Ormeggio al Molo Vecchio",
      sub: "Capitolo 1 · Una sfida venuta dal mare",
      bg: "beach",
      speaker: "baciccia",
      scene: [
        ["baciccia", "C'è un gozzo lungo ormeggiato al molo vecchio che non avevo mai visto. Batte bandiera a strisce rosse e nere."],
        ["sara", "Ho controllato i registri del porto: è la ciurma di Valerio Leone, detto 'Mano di Ferro'. Negli anni '80 vinceva tutti i tornei notturni tra Genova e Tolone."],
        ["nico", "E perché è venuto proprio a Borgo Marino a quest'ora? Il Bar Moretti sta chiudendo e le trofie sono finite!"],
        ["nonna", "Niente affatto! Ho ancora sei teglie di focaccia calda nella Panda. Se quei marinai vogliono giocare a pallone, prima devono passare sul mio cofano!"],
        ["leo", "Valerio ha piantato un palo con una lanterna in mezzo al campetto della scogliera. Dice che chi vince la Coppa delle Tre Riviere si porta a casa la leggenda della costa."]
      ],
      choices: [
        {
          id: "vento",
          label: "Studia le correnti del vento con Sara e Baciccia",
          sub: "Strategia tattica · Sara mappa le folate che scendono dal monte",
          effect: "intel",
          mate: "Sara",
          line: "Sara e Baciccia segnano sul taccuino i punti del campo dove il vento di mare devia le parabole dei tiri."
        },
        {
          id: "panda",
          label: "Carica la squadra sulla Panda di Nonna per l'allenamento notturno",
          sub: "Grinta e riflessi · Nico e Tommy provano le uscite sui fari della Panda",
          effect: "grit",
          mate: "Nico",
          line: "Nonna accende gli abbaglianti gialli della Panda 30. Nico para tre tiri al buio gridando GATTO VOLANTE DELLA NOTTE!"
        }
      ],
      team: {
        id: "marinai_faro",
        name: "I Lupi del Molo Vecchio",
        vs: "i Lupi del Molo Vecchio",
        color: "#8a2a2a",
        style: "contropiede",
        power: 16,
        special: ["SCIABOLATA DEL MARE", 22]
      },
      winLine: "Valerio osserva Leo dal parapetto del molo. «Hai il tocco leggero delle rondini, ragazzo. Ma la scogliera non perdona chi ha paura del vuoto.»"
    },
    {
      id: "ep2",
      title: "La Scogliera dei Falchi",
      sub: "Capitolo 2 · Campo di pietra e sale",
      bg: "beach",
      speaker: "sara",
      scene: [
        ["sara", "Il campo di Punta Rondine è ricavato tra la roccia e il mare. Dietro la porta di Nico ci sono quindici metri di scogliera."],
        ["nico", "Ho promesso a mia mamma che stasera non mi butto di sotto... ma per fermare un tiro all'incrocio non garantisco!"],
        ["tommy", "I Falchi di Portovenere giocano con le scarpe da calcetto consumate. Non scivolano mai sulla ghiaia umida."],
        ["gigi", "Io ho portato il nastro isolante per le suole di tutti! E due acciughe salate per la grinta!"]
      ],
      choices: [
        {
          id: "fasce",
          label: "Allarga il gioco sulle fasce per aggirare la roccia",
          sub: "Gigi e Sara creano spazio con triangolazioni rapide",
          effect: "support",
          mate: "Gigi",
          line: "Gigi scatta sulla linea del fallo laterale a un soffio dalle onde, servendo palloni al bacio per l'inserimento centrale."
        },
        {
          id: "muro",
          label: "Innalza la diga difensiva con Tommy",
          sub: "Contrasti duri e recupero palla immediato",
          effect: "intel",
          mate: "Tommy",
          line: "Tommy intercetta ogni rilancio dei Falchi a centrocampo: la palla resta inchiodata nella loro metà campo."
        }
      ],
      team: {
        id: "falchi_scogliera",
        name: "I Falchi della Scogliera",
        vs: "i Falchi della Scogliera",
        color: "#b8862a",
        style: "pressing",
        power: 21,
        special: ["PICCHIATA DEL FALCO", 28]
      },
      winLine: "Il capitano dei Falchi cede il passo. Le lanterne delle barche dei pescatori cominciano ad accendersi all'orizzonte: la finale è vicina."
    },
    {
      id: "ep3",
      title: "La Lanterna Rotante",
      sub: "Capitolo 3 · Semifinale sotto il fascio di luce",
      bg: "beach",
      speaker: "ester",
      scene: [
        ["ester", "Ho acceso la lanterna del faro a piena potenza. Ogni quattordici secondi il fascio bianco illumina l'area di rigore."],
        ["papa", "Chi sa leggere il ritmo del faro sa quando calciare senza che il portiere riesca a mettere a fuoco il pallone."],
        ["bruno", "I Corsari di Nizza sono veloci e sfrontati. Non hanno paura del buio. Ma voi avete il Borgo dietro le spalle."],
        ["leo", "Basta un secondo di luce per vedere dove si muove Nico. Poi tocca al Tiro della Rondine fare il resto."]
      ],
      choices: [
        {
          id: "sincro",
          label: "Calcola il tempo del faro per il tiro a sorpresa",
          sub: "Leo sfrutta il cono d'ombra per fulminare il portiere",
          effect: "grit",
          mate: "Bruno",
          line: "Bruno suggerisce il tempo esatto: appena il fascio fende la salsedine, Leo calcia secco a mezza altezza!"
        },
        {
          id: "coro",
          label: "Coinvolgi tutta la squadra in un possesso palla ipnotico",
          sub: "Tutti toccano il pallone prima della conclusione",
          effect: "support",
          mate: "Papa",
          line: "La Rondine muove il pallone a un tocco tra gli applausi dei pescatori: i Corsari non vedono mai la palla."
        }
      ],
      team: {
        id: "corsari_nizza",
        name: "I Corsari della Costa Blu",
        vs: "i Corsari della Costa Blu",
        color: "#1d3fa3",
        style: "tecnico",
        power: 28,
        special: ["ONDA BLU DI NIZZA", 36]
      },
      winLine: "I Corsari salutano levando le borracce verso il faro. Resta solo l'ultimo atto: il vecchio Valerio Leone in persona."
    },
    {
      id: "ep4",
      title: "La Notte delle Tre Riviere",
      sub: "Capitolo 4 · La Grande Finale sul mare",
      bg: "beach",
      speaker: "papa",
      scene: [
        ["valerio", "Moretti! Tuo padre mi ha battuto quarant'anni fa con una rovesciata sotto la pioggia. Stasera tocca a te dimostrare se porti davvero le Ali di Rondine."],
        ["papa", "Valerio ha schierato i migliori undici marinai della riviera. Sarà una battaglia su ogni metro di fango e ghiaia."],
        ["sara", "Il taccuino dice che non perdono da trentaquattro partite. Ma nessuno di loro ha mai giocato con l'odore del nostro pesto nell'aria."],
        ["nonna", "Se vincete, focaccia ripiena e gelato al limone per tutti fino all'alba! Se perdete... vi riporto a casa a spinta con la Panda!"],
        ["leo", "Ragazzi, sentite il rumore della risacca? Questo è il nostro campo. Voliamo!"]
      ],
      choices: [
        {
          id: "rondine_oro",
          label: "Lancia il SUPER TIRO DELLA RONDINE DEL FARO",
          sub: "Tiro a effetto leggendario che taglia il vento marino",
          effect: "grit",
          mate: "Sara",
          line: "Leo raccoglie tutta la sua grinta: la palla disegna un arco perfetto che scavalca la barriera e si insacca nell'angolino più alto!"
        },
        {
          id: "fratellanza",
          label: "Passaggio smarcante per l'inserimento a rimorchio di Nico e Tommy",
          sub: "Il gol corale che unisce tutto il Borgo",
          effect: "support",
          mate: "Tommy",
          line: "Leo finta il tiro, attira tutta la difesa e appoggia a rimorchio: la rete trema sul boato di Borgo Marino!"
        }
      ],
      team: {
        id: "tre_riviere_final",
        name: "Selezione delle Tre Riviere",
        vs: "la Selezione di Capitan Valerio",
        color: "#c9302c",
        style: "maestoso",
        power: 35,
        special: ["TUONO DELLA LANTERNA", 46]
      },
      winLine: "Valerio solleva la Coppa d'argento delle Tre Riviere e la posa tra le mani di Leo e della squadra. «Borgo Marino ha un cuore che non affonda mai. Portate queste ali sempre con voi.»"
    }
  ];
  // ---------- Bivi narrativi: ogni scelta ha un prezzo e una risorsa ----------
  // Olio = rallenta il fascio/il bersaglio per un tiro. Cuore = una seconda occasione ("Rimonta di cuore").
  const FARO_DIL = [
    {
      scene: [["baciccia", "Prima del fischio hai venti minuti. La lanterna del molo ha il serbatoio quasi a secco, e la rete della porta ha più buchi di un maglione di Gigi."]],
      a: { label: "Riempi il serbatoio della lanterna", sub: "+2 Olio · la squadra resta al buio e un po' fredda", res: { olio: 2 }, line: "Il fascio si accende lento e regolare. Sara annota il ritmo sul taccuino." },
      b: { label: "Aiuta i Lupi a rammendare la rete", sub: "+1 Cuore · gesto da galantuomini", res: { cuore: 1 }, line: "Valerio ti guarda ricucire con la lingua tra i denti. Non dice nulla, ma smette di sorridere come uno squalo." }
    },
    {
      scene: [["nico", "Un falco con la scarpa slacciata si è fermato a un metro da me. Non so se mi guarda o se vuole la mia merenda."]],
      a: { label: "Presta nastro isolante ai Falchi", sub: "+1 Cuore · avversari più rilassati", res: { cuore: 1 }, line: "Il capitano dei Falchi borbotta un grazie. Gigi si sente derubato, ma anche orgoglioso." },
      b: { label: "Lucida a specchio il parapetto del faro", sub: "+1 Olio · il fascio rimbalza meglio", res: { olio: 1 }, line: "Il vetro rilancia la luce fino in fondo al campo. Ester applaude da lassù." }
    },
    {
      scene: [["papa", "Leo, il vecchio custode del faro ha perso il turno di guardia per venire a vederti. Se resta, domani nessuno sorveglierà la scogliera fino all'alba."]],
      a: { label: "Accompagna il custode al suo posto e torna di corsa", sub: "+2 Cuore · arrivi in campo senza fiato", res: { cuore: 2 }, line: "Il custode ti stringe la mano con due dita rugose: «Gioca per chi non può guardare». Ti scende una lacrima. È salsedine. Ovviamente." },
      b: { label: "Resta a scaldarti e fai il pieno di focaccia", sub: "+2 Olio · la Nonna approva con vigore", res: { olio: 2 }, line: "Nonna ti infila in tasca altri due panini «per le emergenze strategiche»." }
    },
    {
      scene: [["valerio", "Ultima notte, Moretti. Se vinci, la Coppa torna dove è nata. Se perdi, io ho una barca e non ho fretta."], ["leo", "Prima di giocare, guardo la squadra. Nessuno ha dormito. Tutti sono qui."]],
      a: { label: "Fai un discorso a tutta la squadra", sub: "+2 Cuore · Nico piange, Gigi no (dice)", res: { cuore: 2 }, line: "Dici due frasi. Poi Gigi ne aggiunge cinque sull'acciuga. Funziona lo stesso." },
      b: { label: "Controlla ogni dettaglio col taccuino di Sara", sub: "+2 Olio · niente è lasciato al caso", res: { olio: 2 }, line: "Sara ha previsto anche il vento di ponente. E il bis di Nonna." }
    }
  ];

  const EPILOGO = {
    cuore: [
      "Valerio non lascia la Coppa e non la ritira: la appoggia sul molo. «Falla guardare a tutti, ragazzo. Ma la prossima la voglio giocare io.» Poi, piano, aggiunge: «Mio padre sarebbe contento di sapere che il faro è ancora acceso.»",
      "La notte finisce con tutto il Borgo seduto sul molo, Nonna che distribuisce focaccia come benedizioni e Valerio che racconta, finalmente, la storia di quella rovesciata sotto la pioggia. Dalla sua parte."
    ],
    olio: [
      "Il fascio del faro gira ancora, preciso come uno dei piani di Sara. Valerio ammette, a denti stretti: «Non ho perso contro la fortuna. Ho perso contro un taccuino.» Sara arrossisce, e giura che non succederà mai più.",
      "Il custode, dalla cima del faro, fa lampeggiare tre volte la luce. Per la prima volta in trentaquattro partite, Valerio fa un gesto di saluto. A un faro."
    ]
  };

  // ---------- Dati salvati (stesse chiavi, campi nuovi con default sicuri) ----------
  function getFaroData() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(K_FARO)); } catch (e) {}
    if (!d || typeof d !== "object") d = {};
    if (!Array.isArray(d.won)) d.won = [];
    if (!d.picks || typeof d.picks !== "object") d.picks = {};
    if (!d.stars || typeof d.stars !== "object") d.stars = {};
    if (!d.paid || typeof d.paid !== "object") d.paid = {};
    if (!d.res || typeof d.res !== "object") d.res = { olio: 1, cuore: 1 };
    d.res.olio = Math.max(0, Math.min(5, d.res.olio | 0));
    d.res.cuore = Math.max(0, Math.min(5, d.res.cuore | 0));
    d.played = d.played | 0;
    d.done = !!d.done;
    return d;
  }

  function saveFaroData(d) {
    try { localStorage.setItem(K_FARO, JSON.stringify(d)); } catch (e) {}
  }

  function stars(n) { return "★".repeat(n) + "☆".repeat(3 - n); }

  // ---------- Stile (prefisso frx-) ----------
  function injectCss() {
    if (document.getElementById("frx-css")) return;
    const s = document.createElement("style");
    s.id = "frx-css";
    s.textContent = `
.frx-ov{position:fixed;inset:0;z-index:9000;background:#070d1a;color:var(--ink,#f3f6fb);display:flex;flex-direction:column;align-items:center;font-family:inherit;overflow:hidden;touch-action:manipulation;-webkit-user-select:none;user-select:none}
.frx-in{width:100%;max-width:480px;height:100%;display:flex;flex-direction:column;padding:8px 12px 12px;box-sizing:border-box;gap:8px}
.frx-hud{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:800}
.frx-score{font-size:20px;color:var(--gold,#ffd23f);letter-spacing:.02em}
.frx-chip{background:var(--panel,#14243d);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:3px 8px;font-size:13px;white-space:nowrap}
.frx-dots{display:flex;gap:5px;justify-content:center}
.frx-dots i{width:22px;height:8px;border-radius:4px;background:#26344f}
.frx-dots i.g{background:#4cd964}.frx-dots i.m{background:#e0303a}.frx-dots i.c{background:var(--gold,#ffd23f)}
.frx-cv{width:100%;aspect-ratio:4/3;max-height:42vh;background:#0b1630;border-radius:12px;border:2px solid rgba(255,255,255,.2);display:block}
.frx-msg{min-height:58px;background:var(--panel,#14243d);border-radius:10px;padding:8px 10px;font-size:15px;line-height:1.3;display:flex;align-items:center}
.frx-ctl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:auto}
.frx-ctl.three{grid-template-columns:1fr 1fr 1fr}
.frx-ctl .full{grid-column:1/-1}
.frx-b{border:0;border-radius:12px;padding:14px 8px;min-height:54px;font:inherit;font-size:16px;font-weight:800;color:#fff;background:linear-gradient(#2c4a7c,#1d3358);box-shadow:0 3px 0 #0a1428}
.frx-b.hot{background:linear-gradient(#ff6b57,#c9302c);font-size:20px;min-height:64px}
.frx-b.alt{background:linear-gradient(#c58b1c,#8c5f0c)}
.frx-b.dim{background:#2a3347;color:#9fb0c8}
.frx-b:disabled{opacity:.4}
.frx-b:active{transform:translateY(2px)}
.frx-b small{display:block;font-weight:600;font-size:11px;opacity:.85}
.frx-top{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--dim,#9fb0c8)}
.frx-x{background:none;border:0;color:var(--dim,#9fb0c8);font:inherit;font-size:13px;padding:6px 4px;text-decoration:underline}
`;
    document.head.appendChild(s);
  }

  // ---------- Partita: "Il Fascio del Faro" ----------
  // Attacco: mira col bersaglio che oscilla e colpisci FUORI dalla zona del portiere, che si vede
  // solo quando il fascio la illumina. Difesa: leggi il suggerimento del tiratore e tuffati dal lato giusto.
  function playFaroMatch(idx, tactic, onEnd) {
    injectCss();
    const ep = FARO_EP[idx];
    const data = getFaroData();
    const res = { olio: data.res.olio, cuore: data.res.cuore };
    const power = ep.team.power;
    const eff = tactic.effect;
    // difficolta' derivata dalla forza dell'avversario e dalla tattica scelta
    const P = {
      markSpeed: (1.15 + power * 0.016) * (eff === "support" ? 0.8 : 1),
      zoneW: (0.27 + power * 0.004) * (eff === "support" ? 0.85 : 1),
      cycle: 1.7 - power * 0.008,
      beamOn: eff === "intel" ? 1.05 : 0.62,
      hintRel: Math.max(0.5, 0.92 - power * 0.01) + (eff === "intel" ? 0.2 : 0),
      shotT: Math.max(0.85, 1.35 - power * 0.007) + (eff === "grit" ? 0.2 : 0),
      wrongSave: eff === "grit" ? 0.4 : 0
    };
    // sequenza: A D A D A D (3 tiri e 3 parate), poi a oltranza
    let seq = ["A", "D", "A", "D", "A", "D"];
    let round = 0, gf = 0, gs = 0, marks = [];
    let alive = true, timers = [];
    let phase = "idle", cur = null, useOlio = false, lastFail = null, specialDone = false, t0 = 0, raf = 0;

    const ov = document.createElement("div");
    ov.className = "frx-ov";
    ov.innerHTML = `<div class="frx-in">
      <div class="frx-top"><span>${ep.title}</span><button class="frx-x" type="button">Abbandona</button></div>
      <div class="frx-hud"><span class="frx-score"></span><span class="frx-chip res"></span></div>
      <div class="frx-dots"></div>
      <canvas class="frx-cv" width="320" height="240"></canvas>
      <div class="frx-msg"></div>
      <div class="frx-ctl"></div></div>`;
    document.body.appendChild(ov);
    const q = (s) => ov.querySelector(s);
    const cv = q(".frx-cv"), g = cv.getContext("2d"), msg = q(".frx-msg"), ctl = q(".frx-ctl");

    function later(fn, ms) { const t = setTimeout(() => { if (alive) fn(); }, ms); timers.push(t); }
    function say(h) { msg.innerHTML = h; }
    function hud() {
      q(".frx-score").textContent = `RONDINE ${gf} – ${gs} ${["LUPI", "FALCHI", "CORSARI", "VALERIO"][idx] || "AVVERSARI"}`;
      q(".res").textContent = `🛢️ ${res.olio}  ❤️ ${res.cuore}`;
      q(".frx-dots").innerHTML = seq.map((k, i) => `<i class="${marks[i] === 1 ? "g" : marks[i] === 0 ? "m" : i === round ? "c" : ""}" title="${k}"></i>`).join("");
    }
    function setCtl(list, cls) {
      ctl.className = "frx-ctl" + (cls ? " " + cls : "");
      ctl.innerHTML = "";
      list.forEach((o) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "frx-b " + (o.cls || "");
        b.innerHTML = o.label;
        if (o.dis) b.disabled = true;
        b.addEventListener("pointerdown", (e) => { e.preventDefault(); if (alive && !o.dis && o.fn) o.fn(); });
        ctl.appendChild(b);
      });
    }
    function finish(win, goalsFor, goalsAg, pens, abandon) {
      if (!alive) return;
      alive = false; timers.forEach(clearTimeout); cancelAnimationFrame(raf);
      ov.remove();
      onEnd({ win, gf: goalsFor, gs: goalsAg, res, pens, abandon: !!abandon });
    }
    q(".frx-x").addEventListener("click", () => finish(false, gf, gs, false, true));

    // ---- disegno ----
    const GX0 = 60, GX1 = 260, GY0 = 96, GY1 = 176;
    function drawBase(beamAng, beamOn) {
      const sky = g.createLinearGradient(0, 0, 0, 240);
      sky.addColorStop(0, "#050a1e"); sky.addColorStop(0.55, "#10265a"); sky.addColorStop(0.56, "#0a1c3d"); sky.addColorStop(1, "#06122a");
      g.fillStyle = sky; g.fillRect(0, 0, 320, 240);
      g.fillStyle = "#cfd8ee";
      for (let i = 0; i < 14; i++) g.fillRect((i * 83) % 320, (i * 37) % 60, 1.5, 1.5);
      // faro
      g.fillStyle = "#e8e8f0"; g.fillRect(286, 36, 14, 44); g.fillStyle = "#b12a2a"; g.fillRect(286, 50, 14, 8); g.fillRect(286, 68, 14, 8);
      g.fillStyle = "#333b55"; g.fillRect(283, 80, 20, 6);
      g.fillStyle = beamOn ? "#fff7b0" : "#555a70"; g.fillRect(288, 28, 10, 8);
      // fascio
      if (beamOn) {
        g.fillStyle = "rgba(255,247,176,.22)";
        g.beginPath(); g.moveTo(293, 32); g.lineTo(0, 150 + beamAng); g.lineTo(0, 205 + beamAng); g.closePath(); g.fill();
      }
      // campo e porta
      g.fillStyle = "#17482a"; g.fillRect(0, 150, 320, 90);
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, 190); g.lineTo(320, 190); g.stroke();
      g.strokeStyle = "#f2f2f2"; g.lineWidth = 4;
      g.strokeRect(GX0, GY0, GX1 - GX0, GY1 - GY0);
      g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 1;
      for (let x = GX0 + 10; x < GX1; x += 10) { g.beginPath(); g.moveTo(x, GY0); g.lineTo(x, GY1); g.stroke(); }
      for (let y = GY0 + 10; y < GY1; y += 10) { g.beginPath(); g.moveTo(GX0, y); g.lineTo(GX1, y); g.stroke(); }
    }
    function px(m) { return GX0 + m * (GX1 - GX0); }
    function keeper(x, alpha, dive) {
      g.save(); g.globalAlpha = alpha; g.translate(x, GY1 - 24);
      if (dive) g.rotate(dive * 0.9);
      g.fillStyle = "#ffcf3f"; g.fillRect(-8, -14, 16, 26);
      g.fillStyle = "#f1c7a0"; g.beginPath(); g.arc(0, -20, 7, 0, 7); g.fill();
      g.fillStyle = "#ffcf3f"; g.fillRect(-20, -12, 40, 5);
      g.restore();
    }
    function ball(x, y, r) {
      g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      g.strokeStyle = "#222"; g.lineWidth = 1; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    }

    // ---- attacco ----
    function startAttack() {
      phase = "A"; useOlio = false; lastFail = null;
      cur = { c: 0.2 + Math.random() * 0.6, nextC: 0, t: 0, slow: 1, shot: null };
      t0 = performance.now(); cur.cycleStart = t0;
      say(`<span><b>Attacco.</b> Il fascio mostra dov'è il portiere: tira <b>fuori</b> dalla sua zona, ma dentro i pali.</span>`);
      setCtl([
        { label: "⚽ TIRA!", cls: "hot full", fn: shoot },
        { label: `🛢️ Olio: fascio e mira lenti (${res.olio})`, cls: "alt full", dis: res.olio < 1, fn: () => { if (res.olio < 1 || useOlio || phase !== "A") return; res.olio--; useOlio = true; hud(); say(`<span>Il fascio brucia olio buono: <b>mira rallentata</b> per questo tiro.</span>`); } }
      ]);
      hud();
      loop();
    }
    function markPos(now) {
      const sp = P.markSpeed * (useOlio ? 0.55 : 1);
      cur.phaseT = (cur.phaseT || 0) + (now - (cur.lastT || now)) / 1000 * sp; cur.lastT = now;
      const u = cur.phaseT % 2; // 0..2 triangolare
      const tri = u < 1 ? u : 2 - u;
      return -0.15 + tri * 1.3;
    }
    function beamState(now) {
      const per = P.cycle * (useOlio ? 1.0 : 1), el = (now - cur.cycleStart) / 1000;
      if (el >= per) { cur.cycleStart = now; cur.c = 0.2 + Math.random() * 0.6; return { on: true, k: 0 }; }
      return { on: el < P.beamOn * (useOlio ? 1.5 : 1), k: el / per };
    }
    function loop() {
      cancelAnimationFrame(raf);
      const step = (now) => {
        if (!alive) return;
        if (phase === "A" && !cur.shot) {
          const m = markPos(now), b = beamState(now);
          drawBase(Math.sin(now / 300) * 10, b.on);
          const zx = px(cur.c), zw = P.zoneW * (GX1 - GX0);
          keeper(zx, b.on ? 1 : 0.07, 0);
          if (b.on) { g.fillStyle = "rgba(224,48,58,.20)"; g.fillRect(zx - zw / 2, GY0 + 2, zw, GY1 - GY0 - 4); }
          cur.m = m;
          g.strokeStyle = "#ffd23f"; g.lineWidth = 2;
          g.beginPath(); g.arc(px(m), 136, 11, 0, 7); g.moveTo(px(m) - 16, 136); g.lineTo(px(m) + 16, 136); g.moveTo(px(m), 120); g.lineTo(px(m), 152); g.stroke();
          ball(160, 214, 7);
        } else if (phase === "A" && cur.shot) {
          const s = cur.shot, k = Math.min(1, (now - s.t) / 520);
          drawBase(0, true);
          const bx = 160 + (px(s.m) - 160) * k, by = 214 + (136 - 214) * k;
          keeper(px(cur.c), 1, s.saved ? Math.sign(s.m - cur.c || 1) * k * 0.9 : Math.sign(cur.c - 0.5) * k * 0.3);
          ball(bx, by, 7 - 2 * k);
        } else if (phase === "D") drawDef(now);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    function shoot() {
      if (phase !== "A" || cur.shot) return;
      const m = cur.m, onBeamZone = Math.abs(m - cur.c) < P.zoneW / 2;
      const out = m < 0.02 || m > 0.98;
      cur.shot = { m: Math.max(-0.1, Math.min(1.1, m)), t: performance.now(), saved: !out && onBeamZone };
      phase = "A";
      if (window.sfx) window.sfx("kick");
      setCtl([]);
      later(() => {
        if (out) result(false, "Il pallone sfiora il palo e se ne va a salutare i gabbiani. <i>Fuori di un soffio.</i>");
        else if (onBeamZone) result(false, "Il portiere si trova esattamente dove dovevi non tirare. <b>Parata.</b>");
        else result(true, "<b>GOL!</b> La palla scivola dove la luce non arriva.");
      }, 600);
    }

    // ---- difesa ----
    function startDefense() {
      phase = "D"; lastFail = null;
      const special = !specialDone && round >= 3 && power >= 20;
      if (special) specialDone = true;
      const dir = Math.floor(Math.random() * 3);
      const rel = special ? 0.34 : P.hintRel;
      const hint = Math.random() < rel ? dir : (dir + 1 + Math.floor(Math.random() * 2)) % 3;
      cur = { dir, hint, special, T: (special ? P.shotT * 0.72 : P.shotT), t: performance.now(), pick: null, pickT: 0, done: false };
      say(special
        ? `<span><b>${ep.team.special[0]}!</b> Tiro speciale: nessun indizio, solo istinto!</span>`
        : `<span><b>Difesa.</b> Il tiratore tradisce il lato con lo sguardo. Ma ${eff === "intel" ? "con Sara lo leggi bene" : "non sempre dice la verità"}. Tuffati!</span>`);
      setCtl([
        { label: "◀ Sinistra", fn: () => pick(0) },
        { label: "▲ Centro", fn: () => pick(1) },
        { label: "Destra ▶", fn: () => pick(2) }
      ], "three");
      hud();
      loop();
    }
    function drawDef(now) {
      const el = (now - cur.t) / 1000;
      drawBase(0, Math.floor(now / 500) % 2 === 0);
      const sx = 160, sy = 214;
      // tiratore e indizio (compare tra 0.15s e 0.8*T, lampeggia)
      g.fillStyle = "#c9302c"; g.fillRect(sx - 8, sy - 20, 16, 22);
      g.fillStyle = "#f1c7a0"; g.beginPath(); g.arc(sx, sy - 27, 7, 0, 7); g.fill();
      if (!cur.special && el > 0.15 && el < cur.T * 0.85 && Math.floor(el * 8) % 2 === 0) {
        g.fillStyle = "#ffd23f"; g.font = "bold 24px sans-serif"; g.textAlign = "center";
        g.fillText(["◀", "▲", "▶"][cur.hint], sx + (cur.hint - 1) * 28, sy - 44);
      }
      if (cur.special) { g.fillStyle = "rgba(255,80,60," + (0.2 + 0.2 * Math.sin(now / 60)) + ")"; g.fillRect(0, 0, 320, 240); }
      const launched = el >= cur.T;
      const tx = px([0.17, 0.5, 0.83][cur.dir]);
      let kx = px(0.5), dv = 0;
      if (cur.pick !== null) { const kk = Math.min(1, (now - cur.pickT) / 250); kx = px(0.5) + (px([0.17, 0.5, 0.83][cur.pick]) - px(0.5)) * kk; dv = (cur.pick - 1) * kk; }
      keeper(kx, 1, dv);
      if (launched) {
        const k = Math.min(1, (el - cur.T) / 0.28);
        ball(sx + (tx - sx) * k, sy + (130 - sy) * k, 7 - 2 * k);
      } else ball(sx + 18, sy, 6);
      if (launched && !cur.done) {
        cur.done = true;
        later(resolveDef, 350);
      }
    }
    function pick(d) {
      if (phase !== "D" || cur.pick !== null) return;
      cur.pickT = performance.now(); cur.pick = d;
      const el = (cur.pickT - cur.t) / 1000;
      if (window.sfx) window.sfx("kick");
      // la parata e' valida solo se il tuffo parte prima del tiro (con 0.25 s di tolleranza dopo lo stacco)
      cur.late = el > cur.T + 0.25;
    }
    function resolveDef() {
      if (phase !== "D") return;
      phase = "R";
      let saved = false, why = "";
      if (cur.pick === null) why = "Nico è rimasto a guardare il mare. <i>Bellissimo, il mare.</i>";
      else if (cur.late) why = "Troppo tardi: la palla era già in rete quando Nico è partito.";
      else if (cur.pick === cur.dir) { saved = true; why = "<b>PARATA!</b> Nico vola e grida «GATTO VOLANTE DELLA NOTTE!»"; }
      else if (Math.random() < P.wrongSave) { saved = true; why = "Lato sbagliato, ma i riflessi da gatto fanno il resto. <b>Parata di grinta!</b>"; }
      else why = "Ti sei tuffato dalla parte opposta. Il pallone ringrazia.";
      result(saved, why, true);
    }

    // ---- risultato di un round ----
    function result(ok, why, isDef) {
      // per l'attacco ok = gol, per la difesa ok = parata
      const goal = isDef ? !ok : ok;
      // gol
      const kind = seq[round];
      if (kind === "A") { if (ok) gf++; } else if (!ok) gs++;
      marks[round] = (kind === "A" ? ok : ok) ? 1 : 0;
      if (ok && kind === "A" && window.sfx) window.sfx("goal");
      hud();
      say(`<span>${why}</span>`);
      lastFail = !ok;
      phase = "R";
      drawBase(0, true);
      if (!ok && res.cuore > 0) {
        const redo = () => {
          res.cuore--; marks[round] = undefined;
          if (kind === "A") { /* annulla */ } else if (!ok) gs--;
          hud();
          if (kind === "A") startAttack(); else startDefense();
        };
        setCtl([
          { label: `❤️ Rimonta di cuore<small>ritenta · costa 1 Cuore (${res.cuore})</small>`, cls: "alt", fn: redo },
          { label: "Avanti", fn: next }
        ]);
      } else {
        setCtl([{ label: "…", cls: "dim full", dis: true }]);
        later(next, 1500);
      }
    }
    function next() {
      if (phase !== "R") return;
      phase = "N";
      round++;
      // controlla chi e' fuori portata dopo i round regolari
      const regular = 6;
      if (round >= regular && (round - regular) % 2 === 0) {
        if (gf !== gs) return end();
        if (round >= regular + 6) return end(true);
        seq.push("A", "D");
        say(`<span><b>Pareggio!</b> Si va a oltranza: una coppia di azioni in più.</span>`);
      }
      if (round >= seq.length) return end();
      later(() => { hud(); if (seq[round] === "A") startAttack(); else startDefense(); }, 250);
    }
    function end(pens) {
      cancelAnimationFrame(raf);
      const win = gf > gs || (gf === gs && !!pens);
      finish(win, gf, gs, !!pens && gf === gs);
    }

    hud();
    drawBase(0, true);
    say(`<span><b>${ep.team.name}</b>: ${tactic.line}</span>`);
    setCtl([{ label: "🔔 Fischio d'inizio", cls: "hot full", fn: () => { if (window.sfx) window.sfx("whistle"); startAttack(); } }]);
  }

  // ---------- Menu e flusso ----------
  function faroView() {
    if (window.closeAltStage) { try { window.closeAltStage(); } catch (e) {} }
    if (window.gameEngine && window.gameEngine.setView) window.gameEngine.setView({ kind: "scene", bg: "beach" });
  }

  function openFaroStoryMenu(onBack) {
    faroView();
    const data = getFaroData();
    const curIdx = data.won.length < FARO_EP.length ? data.won.length : FARO_EP.length - 1;
    const ep = FARO_EP[curIdx];
    const isCompleted = data.won.length === FARO_EP.length;
    const tot = Object.keys(data.stars).reduce((a, k) => a + (data.stars[k] | 0), 0);

    setChap("La Notte del Faro");
    showText("baciccia", `
      <b>La Notte del Faro</b> · ${data.won.length}/${FARO_EP.length} capitoli · ${tot}/12 ★<br>
      ${isCompleted
        ? "<span style='color:var(--gold);'>Coppa conquistata. Il faro brilla ancora.</span>"
        : `Prossimo: <b>${ep.title}</b>`}<br>
      <span style="color:var(--dim);font-size:12px;">🛢️ Olio ${data.res.olio} · ❤️ Cuore ${data.res.cuore}</span>`);

    const btnList = [];
    if (!isCompleted) {
      btnList.push({ label: `Gioca: ${ep.title}`, sub: ep.sub, cls: "hot", fn: () => playFaroChapter(curIdx, onBack) });
    } else {
      btnList.push({ label: "Rivivi la Grande Finale", sub: "Valerio vuole la rivincita", cls: "hot", fn: () => playFaroChapter(3, onBack, true) });
    }
    if (data.won.length > 0) {
      btnList.push({ label: "Capitoli e stelle", sub: "Rigioca per prendere 3 stelle", fn: () => faroChapters(onBack) });
    }
    btnList.push({ label: "⚽ Tiri 3D", sub: "Allenamento nello Stadio 3D", cls: "pick", fn: () => { if (window.openStadium3D) window.openStadium3D(() => openFaroStoryMenu(onBack)); } });
    if (isCompleted) {
      btnList.push({ label: "Ricomincia la saga", sub: "Azzera i progressi del Faro", fn: () => {
        const d = getFaroData();
        saveFaroData({ won: [], picks: {}, stars: {}, paid: d.paid, res: { olio: 1, cuore: 1 }, played: d.played, done: false });
        if (window.toast) window.toast("Saga riavviata!", "info", "⛵");
        openFaroStoryMenu(onBack);
      } });
    }
    btnList.push({ label: "◂ Menu", fn: () => { if (typeof onBack === "function") onBack(); else if (window.gameEngine && window.gameEngine.title) window.gameEngine.title(); } });
    showButtons(btnList);
  }

  function faroChapters(onBack) {
    const data = getFaroData();
    setChap("La Notte del Faro · Capitoli");
    showText("sara", `<b>Diario di Sara</b><br>Scegli un capitolo vinto da rigiocare: la partita vale stelle in base alla differenza reti.`);
    const list = FARO_EP.map((ep, i) => ({
      label: `${i + 1}. ${ep.title}`,
      sub: data.won.includes(i) ? stars(data.stars[i] | 0) : "Da sbloccare",
      cls: data.won.includes(i) ? "pick" : "",
      fn: () => { if (data.won.includes(i)) playFaroChapter(i, onBack, true); else openFaroStoryMenu(onBack); }
    }));
    list.push({ label: "◂ Indietro", fn: () => openFaroStoryMenu(onBack) });
    showButtons(list);
  }

  function playFaroChapter(idx, onBack, replay) {
    const ep = FARO_EP[idx];
    setChap(`La Notte del Faro · ${ep.title}`);
    if (replay) return faroDilemma(idx, onBack, true);
    runScene(ep.scene, () => faroDilemma(idx, onBack));
  }

  // bivio con conseguenze: dà risorse usabili in partita
  function faroDilemma(idx, onBack, replay) {
    const d = FARO_DIL[idx];
    setChap(`Il Bivio · ${FARO_EP[idx].title}`);
    const go = () => chooseFaroTactic(idx, onBack);
    const showDil = () => {
      showText("baciccia", `<b>Hai un attimo prima del fischio.</b><br>Scegli bene: ogni scelta lascia qualcosa in tasca per la partita.`);
      const apply = (o) => {
        const data = getFaroData();
        data.res.olio = Math.min(5, data.res.olio + (o.res.olio || 0));
        data.res.cuore = Math.min(5, data.res.cuore + (o.res.cuore || 0));
        data.dil = data.dil || {}; data.dil[idx] = o === d.a ? "a" : "b";
        saveFaroData(data);
        showText("leo", `${o.line}<br><span style="color:var(--dim);font-size:12px;">${o.sub.split(" · ")[0]}</span>`);
        showButtons([{ label: "Verso il campo ➔", cls: "hot", fn: go }], true);
      };
      showButtons([
        { label: d.a.label, sub: d.a.sub, cls: "hot", fn: () => apply(d.a) },
        { label: d.b.label, sub: d.b.sub, cls: "hot", fn: () => apply(d.b) }
      ], true);
    };
    if (replay) return showDil();
    runScene(d.scene, showDil);
  }

  function chooseFaroTactic(idx, onBack) {
    const ep = FARO_EP[idx];
    setChap(`Scelta Tattica · ${ep.title}`);
    const hints = { intel: "il fascio mostra il portiere più a lungo e Sara decifra gli indizi del tiratore", grit: "Nico para anche alla cieca e ha più tempo per tuffarsi", support: "bersaglio più lento e portiere più stretto" };
    showText("leo", `<b>${ep.team.name}</b><br>Quale piano scegli? Cambia davvero la partita.`);
    const btns = ep.choices.map((c) => ({
      label: c.label,
      sub: hints[c.effect] || c.sub,
      cls: "hot",
      fn: () => {
        const data = getFaroData();
        data.picks[idx] = c.id;
        saveFaroData(data);
        startFaroMatch(idx, c, onBack);
      }
    }));
    btns.push({ label: "◂ Indietro", fn: () => openFaroStoryMenu(onBack) });
    showButtons(btns, true);
  }

  function startFaroMatch(idx, chosenTactic, onBack) {
    const ep = FARO_EP[idx];
    setChap(`Partita · ${ep.title}`);
    showText("voce", `<b>RONDINE FC vs ${ep.team.name.toUpperCase()}</b><br><i>${chosenTactic.line}</i>`);
    showButtons([{ label: "▶ Scendi in campo", cls: "hot", fn: () => {
      playFaroMatch(idx, chosenTactic, (r) => concludeFaroMatch(idx, r, onBack, chosenTactic));
    } }], true);
  }

  function concludeFaroMatch(idx, r, onBack, tactic) {
    const ep = FARO_EP[idx];
    if (r.abandon) return openFaroStoryMenu(onBack);
    const data = getFaroData();
    data.played++;
    data.res = { olio: Math.max(0, Math.min(5, r.res.olio)), cuore: Math.max(0, Math.min(5, r.res.cuore)) };
    const diff = r.gf - r.gs;
    if (r.win) {
      const st = diff >= 2 ? 3 : diff === 1 ? 2 : 1;
      data.stars[idx] = Math.max(data.stars[idx] | 0, st);
      if (!data.won.includes(idx)) { data.won.push(idx); data.won.sort((a, b) => a - b); }
      let coins = 0;
      if (!data.paid[idx]) { data.paid[idx] = 1; coins += idx === 3 ? 4 : 2; }
      if (st === 3 && !data.paid["s" + idx]) { data.paid["s" + idx] = 1; coins += 1; }
      if (data.won.length === FARO_EP.length) data.done = true;
      saveFaroData(data);
      if (coins && typeof window.addCoins === "function") { try { window.addCoins(coins); } catch (e) {} }
      if (window.toast) window.toast(`Vittoria ${r.gf}-${r.gs}${r.pens ? " (rigori)" : ""} · ${stars(st)}${coins ? " · +" + coins + " monete" : ""}`, "success", "🏆");
      const pensNote = r.pens ? "<br><i>Pareggio a oltranza: Nonna decide ai rigori della focaccia, e vince.</i>" : "";
      showText("leo", `<b style="color:var(--gold);">VITTORIA ${r.gf}–${r.gs}${r.pens ? " (rigori)" : ""}</b> · ${stars(st)}<br>${ep.winLine}${pensNote}`);
      const last = idx === FARO_EP.length - 1;
      showButtons([{
        label: last ? "Il finale della notte ➔" : "Continua ➔",
        cls: "hot",
        fn: () => (last ? faroEpilogue(onBack) : openFaroStoryMenu(onBack))
      }], true);
    } else {
      saveFaroData(data);
      showText("nico", `<b>${r.gf}–${r.gs}.</b> «Un rigore in più e saremmo eroi. Ricarichiamo le batterie al Bar Moretti: la focaccia non giudica.»`);
      showButtons([
        { label: "Riprova la partita", cls: "hot", fn: () => chooseFaroTactic(idx, onBack) },
        { label: "Alla mappa della saga", fn: () => openFaroStoryMenu(onBack) }
      ]);
    }
  }

  function faroEpilogue(onBack) {
    const data = getFaroData();
    const heart = (data.dil && Object.values(data.dil).filter((v) => v === "a").length >= 2) || data.res.cuore >= data.res.olio;
    const lines = (heart ? EPILOGO.cuore : EPILOGO.olio).map((t) => ["valerio", t]);
    runScene(lines, () => {
      showText("baciccia", `<b>Coppa delle Tre Riviere conquistata.</b><br>Torna al faro quando vuoi: puoi rigiocare per le tre stelle.`);
      showButtons([{ label: "◂ Alla mappa", cls: "hot", fn: () => openFaroStoryMenu(onBack) }], true);
    });
  }

  window.openFaroStoryMenu = openFaroStoryMenu;
  if (/[?&]debug/.test(location.search)) window.__faro = { playFaroMatch, getFaroData };
})();
