// ================= SAGA: WESTEROS · I CINQUE TRABUCCHI (campagna a feudi + partite reali) =================
// Livello campagna: giornate, risorse (oro, pesto, morale), Inverno che avanza, corvi con scelte,
// preparazione pre-partita che cambia la difficoltà reale della partita (Calcio d'Azione), rendite dei feudi,
// finale con scelta del Trono. Salvataggio: "ali-di-rondine.thrones-v3" (campi nuovi con default sicuri).
(function () {
  const K_GOT = "ali-di-rondine.thrones-v3";
  const DIFFS = ["facile", "norm", "duro", "leggenda"];
  const DIFF_N = { facile: "Facile", norm: "Normale", duro: "Duro", leggenda: "Leggenda" };
  const PITCH_IT = { molo: "sul molo", campo: "in campo", sabbia: "sulla sabbia", erba: "sull'erba" };
  const FEUDI = ["rondine", "lanterna", "ferri", "baciccia", "night_king"];
  const PERKS = {
    lanterna: { txt: "Dazi del Molo: +6 oro al giorno", gold: 6 },
    ferri: { txt: "Granai di Castel Forno: +8 pesto al giorno", pesto: 8 },
    baciccia: { txt: "Canti del Porto: +3 morale al giorno", morale: 3 }
  };
  // Schieramenti: abilità dei compagni (id validi del Calcio d'Azione: tommy, nico, gigi, fede, bruno)
  const FORMS = [
    { n: "Equilibrato", roles: ["nico", "tommy", "fede"], d: "Muro, Filtrante, Mira" },
    { n: "Assalto", roles: ["bruno", "fede", "tommy"], d: "Bomba, Mira, Filtrante" },
    { n: "Bastione", roles: ["nico", "gigi", "tommy"], d: "Muro, Finta, Filtrante" }
  ];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (typeof v === "number" && isFinite(v) ? v : d);

  function defaults() {
    return { conquered: ["rondine"], gold: 150, pesto: 100, morale: 90, winterMeter: 10, wonIronFocaccia: false,
      day: 1, prep: { pesto: false, bribe: false }, seen: [], pending: -1, ending: "", finaleCoins: false, goals: 0, wins: 0, losses: 0, pestoBuff: false, form: 0 };
  }
  function getProgress() {
    const p = defaults();
    try {
      const d = JSON.parse(localStorage.getItem(K_GOT));
      if (d && typeof d === "object") {
        if (Array.isArray(d.conquered)) p.conquered = d.conquered.filter((x) => typeof x === "string");
        if (!p.conquered.includes("rondine")) p.conquered.unshift("rondine");
        p.gold = Math.max(0, num(d.gold, p.gold)); p.pesto = Math.max(0, num(d.pesto, p.pesto));
        p.morale = clamp(num(d.morale, p.morale), 0, 100); p.winterMeter = clamp(num(d.winterMeter, p.winterMeter), 0, 100);
        p.wonIronFocaccia = !!d.wonIronFocaccia; p.day = Math.max(1, num(d.day, 1));
        p.prep = { pesto: !!(d.prep && d.prep.pesto) || !!d.pestoBuff, bribe: !!(d.prep && d.prep.bribe) };
        p.seen = Array.isArray(d.seen) ? d.seen.filter((x) => typeof x === "number") : [];
        p.pending = typeof d.pending === "number" ? d.pending : -1;
        p.ending = typeof d.ending === "string" ? d.ending : ""; p.finaleCoins = !!d.finaleCoins;
        p.form = clamp(Math.floor(num(d.form, 0)), 0, FORMS.length - 1); p.goals = num(d.goals, 0); p.wins = num(d.wins, 0); p.losses = num(d.losses, 0);
        if (p.wonIronFocaccia && !p.conquered.includes("night_king")) p.conquered.push("night_king");
      }
    } catch (e) {}
    p.pestoBuff = p.prep.pesto;
    return p;
  }
  function saveProgress(p) {
    try { localStorage.setItem(K_GOT, JSON.stringify(p)); } catch (e) {}
  }
  const feudiCount = (p) => FEUDI.filter((f) => p.conquered.includes(f)).length;
  const lordsDown = (p) => ["lanterna", "ferri", "baciccia"].filter((f) => p.conquered.includes(f)).length;

  const HOUSES = [
    {
      id: "lanterna",
      name: "Casata Ruggeri",
      seat: "Fortezza della Lanterna",
      sigil: "🏮 Faro nella Tempesta",
      motto: "Noi Non Passiamo",
      teamKey: "lanterna_got",
      pitch: "molo",
      leader: "Ser Ruggeri il Mastino",
      rewardGold: 60,
      introLore: `«Lord Leo! I Ruggeri custodiscono la roccia della Lanterna da nove generazioni. I loro difensori giocano con corazze pesanti di cuoio bollito e non lasciano un solo centimetro sul molo.<br>
      Ser Ruggeri ha arruolato i balestrieri della falesia: chiunque provi a crossare al centro viene intercettato da una selva di gambe d'acciaio!»`,
      dialoguePre: `Vedo che la Rondine osa spingersi fin sotto i miei bastioni. Qui non siamo in campionato: il mare sbatte contro gli scogli e se sbagli un passaggio finisci nell'abisso! Vediamo se i tuoi ricami reggono il ferro di Ser Ruggeri!`
    },
    {
      id: "ferri",
      name: "Casata Ferri",
      seat: "Castel Forno",
      sigil: "🥖 Teglia d'Oro",
      motto: "Caldi e Croccanti",
      teamKey: "ferri_got",
      pitch: "campo",
      leader: "Lady Nonna Ferri",
      rewardGold: 75,
      introLore: `«Castel Forno è la cassaforte del regno: qui riposano i sacchi di grano saraceno e le giare dell'olio nobile.<br>
      Lady Nonna governa con il mestolo di ferro e il sorriso accogliente: "Un uomo a pancia piena non pensa a farsi ammazzare... ma se tocca la mia farina, gli scaglio addosso cento teglie roventi!"»`,
      dialoguePre: `Leo, amore di nonna! Lo sai che ti voglio bene, ma gli affari della Casata vengono prima dei sentimenti! I miei attaccanti sono cresciuti a panissa e pesto concentrato: corrono il doppio dei tuoi!`
    },
    {
      id: "baciccia",
      name: "Casata Baciccia",
      seat: "Porto Trabucco",
      sigil: "⚓ Rete di Cuoio",
      motto: "Reti e Tempesta",
      teamKey: "baciccia_got",
      pitch: "sabbia",
      leader: "Sire Baciccia il Vecchio",
      rewardGold: 90,
      introLore: `«Porto Trabucco sorge su mille palafitte di rovere piantate nel fondale marino. Sire Baciccia ha novant'anni e non ha mai piegato la schiena davanti a nessun duca.<br>
      La loro squadra gioca con il vento in poppa: scivolate rasoterra tra la battigia e tiri a effetto che sfruttano le raffiche del libeccio!»`,
      dialoguePre: `Ragazzetto di paese! Ho visto imperi crollare e mari prosciugarsi. Il Trabucco appartiene ai Baciccia da quando il mare era solo pioggia! Se vuoi il mio rispetto, devi strapparmelo con tre gol sul bagnasciuga!`
    },
    {
      id: "night_king",
      name: "L'Armata della Notte",
      seat: "La Barriera di Ghiaccio",
      sigil: "❄️ Teschio Gelido",
      motto: "L'Inverno è Qui",
      teamKey: "night_king",
      pitch: "erba",
      leader: "Il Re della Notte",
      rewardGold: 150,
      introLore: `«I corvi neri tacciono, l'acqua del porto si è tramutata in una lastra di ghiaccio perenne. Il Re della Notte scende dalle montagne con i non-morti della bufera.<br>
      Non sentono il dolore, non si stancano mai e il loro sguardo azzurro gela la palla ad ogni tocco. È la battaglia finale per il Trono di Focaccia e per la vita stessa di Borgo Marino!»`,
      dialoguePre: `<i>...Il gelo consuma ogni speranza. Non esistono tattiche o passaggi di prima nella tomba del ghiaccio eterno. Il vostro regno si spegnerà qui.</i>`
    }
  ];


  // ================= EVENTI DEL CORVO (scelte con conseguenze) =================
  const EVENTS = [
    { t: "Il disertore dei Ruggeri", who: "Corvo da Lanterna",
      txt: "Un soldato di Ser Ruggeri bussa alle porte: ha perso lo scudo, il turno e la dignità. Chiede asilo e una zuppa.",
      ch: [
        { l: "Accoglilo e sfamalo", s: "-10 pesto · +8 morale", fx: { pesto: -10, morale: 8 }, r: "Il disertore giura che sa tutto sulla difesa dei Ruggeri. In realtà sa solo dove si trova la cucina." },
        { l: "Rimandalo indietro", s: "+10 oro · -6 morale", fx: { gold: 10, morale: -6 }, r: "Ser Ruggeri paga il riscatto, ma la truppa mormora: «Un giorno potremmo essere noi.»" }
      ] },
    { t: "Il mercante del pesto miracoloso", who: "Mercante d'Oltremare",
      txt: "«Pesto della Valle Eterna, direttamente dal giardino degli dèi!» L'etichetta dice basilico, l'odore dice 'quasi basilico'.",
      ch: [
        { l: "Compra la partita", s: "-30 oro · +35 pesto", fx: { gold: -30, pesto: 35 }, r: "Era pesto vero, solo con troppa menta. I soldati lo chiamano 'il Rinfrescante'." },
        { l: "Declina con garbo", s: "+3 morale", fx: { morale: 3 }, r: "Il mercante se ne va offeso. Qualcuno dice di averlo visto rubare un basilico dal tuo orto." }
      ] },
    { t: "Nevicata fuori stagione", who: "Guardiano del Molo",
      txt: "Sui moli cadono i primi fiocchi, e non sono quelli di agosto. Il Nord si avvicina: serve legna per i falò di guardia.",
      ch: [
        { l: "Compra legna e accendi i falò", s: "-20 oro · Inverno -8%", fx: { gold: -20, winter: -8 }, r: "Il molo si illumina di arancione. Per una notte l'Inverno resta fuori dalla porta." },
        { l: "Risparmia, ci si scalda correndo", s: "Inverno +6% · -4 morale", fx: { winter: 6, morale: -4 }, r: "Tutti corrono sul posto per scaldarsi. Sembra un allenamento. È un allenamento molto freddo." }
      ] },
    { t: "Il vecchio del faro", who: "Custode della Lanterna",
      txt: "Un anziano guardiano, l'unico sopravvissuto della vecchia guarnigione, siede da solo sul molo. Non chiede nulla. Guarda l'acqua che si ghiaccia.",
      ch: [
        { l: "Siediti con lui fino all'alba", s: "+12 morale · Inverno -3%", fx: { morale: 12, winter: -3 }, r: "Parla dei compagni persi, uno per uno, per nome. Alla fine dice: «Grazie. Nessuno ascolta più». Il Borgo, la mattina, canta di nuovo." },
        { l: "Mandagli una coperta e vai avanti", s: "+10 oro", fx: { gold: 10 }, r: "Un gesto gentile, ma frettoloso. Il vecchio sorride lo stesso. I consiglieri non capiscono perché tu sia così silenzioso." }
      ] },
    { t: "Il bardo di corte", who: "Bardo errante",
      txt: "Un bardo con un liuto a sei corde vuole comporre «La Ballata di Lord Leo, Signore delle Teglie». Chiede un piccolo anticipo.",
      ch: [
        { l: "Finanzia la ballata", s: "-15 oro · +10 morale", fx: { gold: -15, morale: 10 }, r: "La ballata ha ventidue strofe, tutte sul tuo naso. I soldati la cantano sotto la doccia di pioggia." },
        { l: "Congedalo (ha una voce da gabbiano)", s: "-3 morale", fx: { morale: -3 }, r: "Il bardo pianta una canzone satirica sul portone. Rima 'Moretti' con 'ricotti'." }
      ] },
    { t: "I corsari chiedono pedaggio", who: "Capitano dei Corsari",
      txt: "Una nave nera ormeggia davanti a Porto Trabucco. Il capitano alza un cartello: «PEDAGGIO — oppure ballo».",
      ch: [
        { l: "Paga il pedaggio", s: "-25 oro", fx: { gold: -25 }, r: "I corsari contano le monete due volte, salutano con il cappello e salpano. Uno lascia una cozza in segno di rispetto." },
        { l: "Rispondi a colpi di focaccia", s: "-15 pesto · +6 morale", fx: { pesto: -15, morale: 6 }, r: "Un tiro di focaccia ben piazzato manda il capitano in acqua. Gli equipaggi si stringono la mano, bagnati." }
      ] },
    { t: "Sciopero delle focaccine", who: "Capocuoco di Castel Forno",
      txt: "I fornai incrociano le braccia: «Quattro turni di fila, e il lievito non perdona!» Senza di loro, niente razioni.",
      ch: [
        { l: "Aumenta le razioni a tutti", s: "-20 pesto · +10 morale", fx: { pesto: -20, morale: 10 }, r: "Il forno torna a profumare. Il capocuoco ti stringe la mano con una mano infarinata e una felice." },
        { l: "Promessa solenne, pagamento rimandato", s: "-8 morale · +15 oro", fx: { morale: -8, gold: 15 }, r: "Le promesse non cuociono il pane. Ma per questa volta le casse respirano." }
      ] },
    { t: "Libeccio sul porto", who: "Maestro d'ascia",
      txt: "Il libeccio ha strappato mezza tettoia del porto. Se non la sistemi, la prossima onda porterà via anche i barili.",
      ch: [
        { l: "Ripara subito", s: "-30 oro · +4 morale", fx: { gold: -30, morale: 4 }, r: "Martelli, chiodi e bestemmie dolci: il molo regge. Il maestro d'ascia versa una lacrima di segatura." },
        { l: "Salva i barili e lascia il resto", s: "-20 pesto", fx: { pesto: -20 }, r: "Metà dei barili finisce in mare. Qualche delfino si ritrova il pranzo gratis." }
      ] }
  ];

  // ================= UTILITÀ UI =================
  let onExitCallback = null;
  let styled = false;
  function injectStyle() {
    if (styled || document.getElementById("tw-style")) { styled = true; return; }
    styled = true;
    const st = document.createElement("style");
    st.id = "tw-style";
    st.textContent = `.tw-wrap{position:absolute;inset:0;background:radial-gradient(circle at 50% 20%,#3a0d14 0%,#100406 100%);overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:8px 10px;box-sizing:border-box;color:#f8edeb}
    .tw-top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}
    .tw-title{font-family:var(--display);font-size:15px;line-height:1.1;color:#ffb703;text-shadow:2px 2px 0 #000,0 0 10px #ffb703}
    .tw-sub{font-size:10.5px;font-weight:700;margin-top:2px}
    .tw-res{background:rgba(20,5,5,.88);border:1.5px solid #ffb703;border-radius:6px;padding:3px 7px;font-size:11px;text-align:right;white-space:nowrap}
    .tw-map{display:flex;gap:4px;justify-content:space-between}
    .tw-chip{flex:1;min-width:0;text-align:center;border-radius:6px;padding:3px 1px;font-size:9.5px;background:rgba(25,10,8,.9);border:1px solid #ffffff30;line-height:1.15}
    .tw-chip b{display:block;font-size:17px}
    .tw-chip.own{border-color:#ffb703;box-shadow:0 0 8px #ffb70399}
    .tw-chip.lock{opacity:.5}
    .tw-bars{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:10px}
    .tw-bar{height:7px;border-radius:4px;background:#ffffff1f;overflow:hidden;margin-top:2px}
    .tw-bar i{display:block;height:100%}
    .tw-snow{position:absolute;width:3px;height:3px;background:#a2d2ff;top:8%;left:20%;box-shadow:40px 30px #a2d2ff,90px 10px #fff,160px 40px #a2d2ff,240px 20px #fff,280px 50px #a2d2ff;pointer-events:none}
    .tw-vs{display:flex;align-items:center;justify-content:space-around;text-align:center}`;
    document.head.appendChild(st);
  }
  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#590d22; color:#ffb703; font-weight:800; border:1px solid #ffb703; letter-spacing:0.5px;">${who}</span><span class="t">${html}</span>`;
      el.scrollTop = 0;
    }
    if (window.addDialogueLog) window.addDialogueLog(who, html);
  }
  function showButtons(list, one) {
    const c = document.getElementById("choices");
    if (!c) return;
    c.innerHTML = "";
    c.className = "choices" + (one ? " one" : "");
    list.forEach((o) => {
      if (o.head) {
        const h = document.createElement("div");
        h.className = "head"; h.textContent = o.head; c.appendChild(h); return;
      }
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      if (o.cls) b.className = o.cls;
      if (o.disabled) b.disabled = true;
      if (o.sub) { const s = document.createElement("small"); s.textContent = o.sub; b.appendChild(s); }
      b.onclick = () => { if (window.haptic) window.haptic(15); if (o.fn) o.fn(); };
      c.appendChild(b);
    });
  }
  function playSynth(freq, type = "sine", dur = 0.12, vol = 0.15) {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator(), gain = actx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(vol, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      osc.connect(gain); gain.connect(actx.destination);
      osc.start(); osc.stop(actx.currentTime + dur);
    } catch (e) {}
  }
  const toast = (m, k, i) => { if (window.toast) window.toast(m, k || "success", i || "👑"); };

  function activateThronesStage() {
    injectStyle();
    if (window.setView) window.setView({ kind: "thrones" });
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = true;
    const alt = document.getElementById("stageAlt");
    if (alt) {
      alt.hidden = false; alt.style.display = "block"; alt.style.position = "relative";
      alt.style.overflow = "hidden"; alt.style.zIndex = "10"; alt.innerHTML = "";
    }
    return alt;
  }

  function renderThronesHubStage(prog) {
    const alt = activateThronesStage();
    if (!alt) return;
    const chip = (id, ico, nm) => {
      const own = prog.conquered.includes(id);
      const locked = id === "night_king" && lordsDown(prog) < 3 && !own;
      return `<div class="tw-chip ${own ? "own" : ""} ${locked ? "lock" : ""}"><b>${locked ? "🔒" : ico}</b>${nm}</div>`;
    };
    const wc = prog.winterMeter >= 70 ? "#ff6b6b" : "#a2d2ff";
    const mc = prog.morale < 35 ? "#ff6b6b" : "#06d6a0";
    alt.innerHTML = `<div class="tw-wrap"><div class="tw-snow"></div>
      <div class="tw-top"><div><div class="tw-title">👑 I CINQUE TRABUCCHI</div><div class="tw-sub">Giorno ${prog.day} · Anno Domini 1240</div></div>
        <div class="tw-res"><div>🪙 <b>${prog.gold}</b> oro</div><div style="color:#06d6a0">🫒 <b>${prog.pesto}</b> pesto</div></div></div>
      <div class="tw-map">${chip("rondine", "🦅", "Rondine")}${chip("lanterna", "🏮", "Lanterna")}${chip("ferri", "🥖", "Forno")}${chip("baciccia", "⚓", "Trabucco")}${chip("night_king", "❄️", "Barriera")}</div>
      <div class="tw-bars"><div>Morale ${prog.morale}%<div class="tw-bar"><i style="width:${prog.morale}%;background:${mc}"></i></div></div>
        <div style="color:${wc}">Inverno ${prog.winterMeter}%<div class="tw-bar"><i style="width:${prog.winterMeter}%;background:${wc}"></i></div></div></div></div>`;
  }

  // ================= LOGICA DI CAMPAGNA =================
  // Avanza di una giornata: l'Inverno cresce, i feudi producono, a volte arriva un corvo.
  function advanceDay(prog) {
    prog.day++;
    prog.winterMeter = clamp(prog.winterMeter + 3, 0, 100);
    const inc = [];
    prog.conquered.forEach((id) => {
      const pk = PERKS[id];
      if (!pk) return;
      if (pk.gold) { prog.gold += pk.gold; inc.push(`+${pk.gold} oro`); }
      if (pk.pesto) { prog.pesto += pk.pesto; inc.push(`+${pk.pesto} pesto`); }
      if (pk.morale) { prog.morale = clamp(prog.morale + pk.morale, 0, 100); inc.push(`+${pk.morale} morale`); }
    });
    if (prog.winterMeter >= 70) prog.morale = clamp(prog.morale - 2, 0, 100);
    if (prog.pending < 0 && prog.day % 2 === 0) prog.pending = prog.seen.length % EVENTS.length;
    saveProgress(prog);
    return inc.length ? "Rendite dei feudi: " + inc.join(", ") + "." : "";
  }
  function applyFx(prog, fx) {
    prog.gold = Math.max(0, prog.gold + (fx.gold || 0));
    prog.pesto = Math.max(0, prog.pesto + (fx.pesto || 0));
    prog.morale = clamp(prog.morale + (fx.morale || 0), 0, 100);
    prog.winterMeter = clamp(prog.winterMeter + (fx.winter || 0), 0, 100);
  }
  function canFx(prog, fx) { return prog.gold + (fx.gold || 0) >= 0 && prog.pesto + (fx.pesto || 0) >= 0; }

  // Difficoltà reale della partita: base globale +/- fattori di campagna.
  function effectiveDiff(prog, house) {
    const base = window.getGlobalAzDiff ? window.getGlobalAzDiff() : "norm";
    let bi = DIFFS.indexOf(base); if (bi < 0) bi = 1;
    const f = [];
    let d = 0;
    if (prog.prep.pesto) { d--; f.push("Pesto -1"); }
    if (prog.prep.bribe) { d--; f.push("Focaccia di corte -1"); }
    if (prog.morale < 35) { d++; f.push("Morale basso +1"); }
    if (prog.winterMeter >= 70) { d++; f.push("Inverno +1"); }
    if (house.id === "night_king" && prog.winterMeter >= 90) { d++; f.push("Notte Eterna +1"); }
    const idx = clamp(bi + d, 0, 3);
    return { diff: DIFFS[idx], base, factors: f };
  }

  // ================= HUB CONSIGLIO DI GUERRA =================
  function openThronesWarMenu(onBack) {
    onExitCallback = onBack;
    showWarCouncil();
  }
  function exitSaga() {
    if (onExitCallback) onExitCallback(); else if (window.title) window.title();
  }

  function showWarCouncil() {
    if (window.setChapter) window.setChapter("Westeros Ligure · I Cinque Trabucchi");
    const prog = getProgress();
    renderThronesHubStage(prog);
    if (prog.pending >= 0) { showEvent(prog); return; }
    if (prog.wonIronFocaccia && !prog.ending) { showEnding(); return; }

    const open = HOUSES.filter((h) => !prog.conquered.includes(h.id));
    const lords = open.filter((h) => h.id !== "night_king");
    const boss = HOUSES.find((h) => h.id === "night_king");
    const bossOpen = !prog.conquered.includes("night_king") && lords.length === 0;
    const b = [];

    if (prog.wonIronFocaccia) {
      showText("Lord Leo Moretti", `«La costa è in pace e il Trono di Focaccia è ${prog.ending === "condiviso" ? "una panca lunga per tutti" : prog.ending === "teglia" ? "una teglia gigante nel mezzo della piazza" : "una locanda aperta fino a tardi"}. Giorno ${prog.day}: l'Inverno è scacciato, ma le rendite continuano.»`);
    } else if (bossOpen) {
      showText("Maestro del Consiglio", `«Mio signore, tutte le casate hanno piegato il ginocchio. Ma dal Nord scende il <b>Re della Notte</b>: Inverno al ${prog.winterMeter}%. Prepara la squadra, e il cuore.»`);
    } else {
      showText("Primo Cavaliere", `«Giorno ${prog.day}, mio signore. Controlliamo ${feudiCount(prog)}/5 feudi, ${prog.gold} oro e ${prog.pesto} barili di pesto. Ogni mossa costa una giornata, e l'Inverno non aspetta: affrontate le casate, ma tenete d'occhio morale e gelo.»`);
    }

    if (!prog.wonIronFocaccia) {
      b.push({ head: "Campagna" });
      lords.forEach((h) => b.push({ label: `⚔️ ${h.name}`, sub: `${h.seat} · ${PITCH_IT[h.pitch]} · +${h.rewardGold} oro`, cls: "hot", fn: () => startSiegeMatchBriefing(h) }));
      if (bossOpen) b.push({ label: "❄️ LA BARRIERA: Re della Notte", sub: "La partita finale del regno", cls: "hot", fn: () => startSiegeMatchBriefing(boss) });
      else if (!prog.conquered.includes("night_king")) b.push({ label: `🔒 La Barriera (${lordsDown(prog)}/3 casate)`, sub: "Piega prima le tre casate della costa", disabled: true });
    }
    b.push({ head: "Consiglio (ogni mossa = 1 giorno)" });
    b.push(
      { label: "🪙 Baratto al Porto", sub: "-40 pesto → +60 oro", disabled: prog.pesto < 40, fn: () => councilAct(`Carovana venduta: i mercanti d'Oltremare pagano in monete e in complimenti.`, { pesto: -40, gold: 60 }, 650) },
      { label: "🥖 Focaccia alle Truppe", sub: "-30 oro → +40 pesto, +20 morale", disabled: prog.gold < 30, fn: () => councilAct(`I fornai sfornano per tutti. Il morale sale insieme al lievito.`, { gold: -30, pesto: 40, morale: 20 }, 520) },
      { label: "🛡️ Soccorso Contadino", sub: "-50 pesto → Inverno -15%, +25 morale", disabled: prog.pesto < 50, fn: () => councilAct(`Il pesto scalda le case dei contadini: l'Inverno arretra di un passo.`, { pesto: -50, winter: -15, morale: 25 }, 720) },
      { label: "🔥 Falò di Guardia", sub: "-25 oro → Inverno -8%", disabled: prog.gold < 25, fn: () => councilAct(`Falò accesi lungo tutta la costa. Il Nord sbuffa, ma fa un passo indietro.`, { gold: -25, winter: -8 }, 600) }
    );
    if (feudiCount(prog) > 1 || prog.wonIronFocaccia) b.push({ label: "🏟️ Torneo di Allenamento", sub: "Rigioca una casata già vinta: +15 oro", fn: showRematch });
    b.push(
      { label: "📜 Corvi e Motti", sub: "Rendite dei feudi e lettere", fn: showLore },
      { label: "◂ Menu Principale", cls: "pick", fn: exitSaga }
    );
    showButtons(b, false);
  }

  function councilAct(msg, fx, tone) {
    const prog = getProgress();
    if (!canFx(prog, fx)) { showWarCouncil(); return; }
    applyFx(prog, fx);
    const inc = advanceDay(prog);
    playSynth(tone, "sine", 0.3, 0.25);
    toast("Giorno " + prog.day + " · " + msg.split(":")[0].slice(0, 60), "success", "🪙");
    renderThronesHubStage(prog);
    showText("Primo Cavaliere", `«${msg}»<br><small style="opacity:.8">${inc}</small>`);
    showButtons([{ label: "Prosegui ▸", cls: "hot", fn: showWarCouncil }], true);
  }

  function showEvent(prog) {
    const ev = EVENTS[prog.pending];
    if (!ev) { prog.pending = -1; saveProgress(prog); showWarCouncil(); return; }
    renderThronesHubStage(prog);
    showText(ev.who, `📨 <b>${ev.t}</b><br>${ev.txt}`);
    showButtons(ev.ch.map((c) => ({
      label: c.l, sub: c.s, disabled: !canFx(prog, c.fx), cls: "hot",
      fn: () => {
        const p = getProgress();
        if (!canFx(p, c.fx)) return;
        applyFx(p, c.fx);
        p.seen.push(p.pending); p.pending = -1;
        saveProgress(p);
        playSynth(480, "triangle", 0.25, 0.2);
        renderThronesHubStage(p);
        showText(ev.who, `${c.r}`);
        showButtons([{ label: "Prosegui ▸", cls: "hot", fn: showWarCouncil }], true);
      }
    })), true);
  }

  function showLore() {
    const prog = getProgress();
    const perks = Object.keys(PERKS).map((id) => `${prog.conquered.includes(id) ? "✓" : "○"} ${PERKS[id].txt}`).join("<br>");
    showText("Archivio dei Corvi", `<b>Rendite dei feudi</b> (ogni giorno):<br>${perks}<br><b>Motti:</b> Moretti «Il Calcio sta Arrivando» · Ruggeri «Noi Non Passiamo» · Ferri «Caldi e Croccanti» · Baciccia «Reti e Tempesta».<br><small>Inverno ≥70%: partite più dure e morale che cala. Morale &lt;35%: partite più dure.</small>`);
    showButtons([{ label: "◂ Consiglio di Guerra", fn: showWarCouncil }], true);
  }

  function showRematch() {
    const prog = getProgress();
    const done = HOUSES.filter((h) => prog.conquered.includes(h.id));
    showText("Maestro d'Armi", `«Un po' di allenamento non ha mai fatto male a nessuno, specie ai nemici sconfitti, che adorano la rivincita.»`);
    const b = done.map((h) => ({ label: `⚔️ ${h.name}`, sub: `${PITCH_IT[h.pitch]} · +15 oro se vinci`, fn: () => startSiegeMatchBriefing(h) }));
    b.push({ label: "◂ Consiglio", cls: "pick", fn: showWarCouncil });
    showButtons(b, false);
  }

  function renderThronesMatchPreviewStage(house, eff) {
    const alt = activateThronesStage();
    if (!alt) return;
    alt.innerHTML = `<div class="tw-wrap"><div style="text-align:center;font-family:var(--display);font-size:13px;color:#ffb703;text-shadow:0 0 8px #ffb703">⚔️ ASSEDIO SUL RETTANGOLO VERDE</div>
      <div class="tw-vs"><div><div style="font-size:30px">🦅</div><div style="color:#3fa7ff;font-weight:bold;font-size:12px">RONDINE FC</div><div style="color:#a2d2ff;font-size:10px">Leo &amp; Nico</div></div>
      <div style="font-family:var(--display);font-size:20px;color:#ffb703">VS</div>
      <div><div style="font-size:30px">${house.sigil.split(" ")[0]}</div><div style="color:#ffb703;font-weight:bold;font-size:12px">${house.name.toUpperCase()}</div><div style="font-size:10px">${house.leader}</div></div></div>
      <div style="background:rgba(20,5,5,.85);border:1px solid #ffb703;border-radius:6px;padding:3px 8px;font-size:10px;text-align:center">Terreno: <b>${house.pitch.toUpperCase()}</b> · Difficoltà: <b>${DIFF_N[eff.diff]}</b></div></div>`;
  }

  // ================= BRIEFING + PREPARAZIONE =================
  function startSiegeMatchBriefing(house) {
    const prog = getProgress();
    const eff = effectiveDiff(prog, house);
    renderThronesMatchPreviewStage(house, eff);
    const why = eff.factors.length ? ` (${eff.factors.join(", ")})` : "";
    showText(house.leader, `<i>«${house.dialoguePre}»</i><br><b>Difficoltà della partita: ${DIFF_N[eff.diff]}</b>${why}.`);
    const rematch = prog.conquered.includes(house.id);
    showButtons([
      { label: "⚽ FISCHIO D'INIZIO", sub: `3v3 ${PITCH_IT[house.pitch]} · ${rematch ? "rivincita" : "assedio"}`, cls: "hot", fn: () => launchSiegeMatch(house) },
      { label: `🫒 Trabucchi al Pesto${prog.prep.pesto ? " ✓" : ""}`, sub: prog.prep.pesto ? "Attivo: tocca per annullare (+35 pesto)" : "-35 pesto · difficoltà -1", disabled: !prog.prep.pesto && prog.pesto < 35, fn: () => togglePrep("pesto", house) },
      { label: `🥖 Focaccia ai Cavalieri${prog.prep.bribe ? " ✓" : ""}`, sub: prog.prep.bribe ? "Attiva: tocca per annullare (+40 oro)" : "-40 oro · difficoltà -1", disabled: !prog.prep.bribe && prog.gold < 40, fn: () => togglePrep("bribe", house) },
      { label: `🛡️ Schieramento: ${FORMS[prog.form].n}`, sub: FORMS[prog.form].d + " · tocca per cambiare", fn: () => { const p = getProgress(); p.form = (p.form + 1) % FORMS.length; saveProgress(p); startSiegeMatchBriefing(house); } },
      { label: "📜 Dossier", sub: "Debolezze e lore", fn: () => showHouseLoreModal(house) },
      { label: "◂ Consiglio", fn: showWarCouncil }
    ], false);
  }
  function togglePrep(kind, house) {
    const prog = getProgress();
    const cost = kind === "pesto" ? { pesto: 35 } : { gold: 40 };
    if (prog.prep[kind]) {
      prog.prep[kind] = false;
      prog.pesto += cost.pesto || 0; prog.gold += cost.gold || 0;
    } else {
      if (prog.pesto < (cost.pesto || 0) || prog.gold < (cost.gold || 0)) return;
      prog.prep[kind] = true;
      prog.pesto -= cost.pesto || 0; prog.gold -= cost.gold || 0;
    }
    saveProgress(prog);
    playSynth(580, "sine", 0.2, 0.2);
    startSiegeMatchBriefing(house);
  }
  function showHouseLoreModal(house) {
    showText(house.leader, `<b>${house.seat.toUpperCase()}</b><br>${house.introLore}<br>Motto: <i>«${house.motto}»</i>`);
    showButtons([
      { label: "⚽ Gioca ▸", cls: "hot", fn: () => launchSiegeMatch(house) },
      { label: "◂ Preparazione", fn: () => startSiegeMatchBriefing(house) }
    ], true);
  }

  // ================= PARTITA REALE =================
  function launchSiegeMatch(house) {
    if (!window.azStartSagaMatch) { toast("Motore di gioco non pronto!", "error", "⚠️"); showWarCouncil(); return; }
    const prog = getProgress();
    const eff = effectiveDiff(prog, house);
    prog.prep = { pesto: false, bribe: false }; // consumate
    saveProgress(prog);
    toast(`⚔️ RONDINE FC vs ${house.name.toUpperCase()} · ${DIFF_N[eff.diff]}`, "success", "🏰");
    window.azStartSagaMatch(house.teamKey, {
      mode: "amic", pitch: house.pitch, diff: eff.diff, customDiff: true, pu: true, roles: FORMS[prog.form].roles
    }, (myGoals, rivalGoals) => handleSiegeResult(house, myGoals, rivalGoals));
  }

  // ================= POST-PARTITA =================
  function handleSiegeResult(house, myGoals, rivalGoals) {
    if (myGoals === 0 && rivalGoals === 0) { // uscita dalla partita (o 0-0): nessun effetto sul regno
      renderThronesHubStage(getProgress());
      showText(house.leader, `<b>Assedio sospeso (0–0).</b> Nessun giorno passa, nessuna perdita: i bastioni restano a guardarsi.`);
      showButtons([{ label: "Preparazione ▸", cls: "hot", fn: () => startSiegeMatchBriefing(house) }, { label: "◂ Consiglio", fn: showWarCouncil }], true);
      return;
    }
    const prog = getProgress();
    const won = myGoals > rivalGoals;
    const first = !prog.conquered.includes(house.id);
    prog.goals += myGoals;
    let inc = "";
    if (won) {
      prog.wins++;
      prog.winterMeter = clamp(prog.winterMeter - 4, 0, 100);
      prog.morale = clamp(prog.morale + 12, 0, 100);
      if (first) {
        prog.conquered.push(house.id);
        prog.gold += house.rewardGold; prog.pesto += 30;
        if (window.addCoins) window.addCoins(house.id === "night_king" ? 3 : 2);
        if (house.id === "night_king") prog.wonIronFocaccia = true;
      } else {
        prog.gold += 15;
      }
    } else {
      prog.losses++;
      prog.morale = clamp(prog.morale - (myGoals === rivalGoals ? 3 : 8), 0, 100);
      if (myGoals < rivalGoals) prog.winterMeter = clamp(prog.winterMeter + 5, 0, 100);
    }
    inc = advanceDay(prog);
    renderThronesHubStage(prog);
    const gap = `${myGoals} – ${rivalGoals}`;

    if (won && first && house.id === "night_king") {
      playSynth(950, "sine", 0.45, 0.4);
      showText("Il Re della Notte", `<b style="color:var(--gold)">TRIPLICE FISCHIO! ${gap}</b><br>Il gelo si crepa. Il Re della Notte si ferma, toglie l'elmo di ghiaccio e per un attimo sembra solo molto stanco: «Avevo dimenticato come si gioca. Grazie.» Poi si scioglie in una pozzanghera tiepida.`);
      showButtons([{ label: "Il Trono di Focaccia ▸", cls: "hot", fn: showEnding }], true);
      return;
    }
    if (won) {
      playSynth(950, "sine", 0.4, 0.35);
      toast(`${house.seat.toUpperCase()} ${first ? "È CADUTO" : "battuto"}! (${gap})`, "success", "🏆");
      const perk = first && PERKS[house.id] ? `<br><b>Nuova rendita:</b> ${PERKS[house.id].txt}.` : "";
      showText(house.leader, `<b style="color:var(--gold)">VITTORIA ${gap}!</b><br>«${first ? `Ammainate gli stendardi: le chiavi di ${house.seat} sono vostre, con ${house.rewardGold} monete d'oro e 30 barili di pesto.` : "Va bene, va bene: avete vinto ancora. Prendete le vostre quindici monete."}»${perk}<br><small style="opacity:.8">${inc}</small>`);
      if (first) {
        showButtons([
          { label: "Clemenza", sub: "+10 morale · -10 oro", fn: () => afterConquest("clemenza") },
          { label: "Tributo", sub: "+20 oro · -10 morale", fn: () => afterConquest("tributo") }
        ], false);
      } else showButtons([{ label: "Prosegui ▸", cls: "hot", fn: showWarCouncil }], true);
    } else if (myGoals === rivalGoals) {
      showText(house.leader, `<b style="color:#4cc9f0">PAREGGIO ${gap}.</b><br>«I bastioni hanno retto, ma avete mostrato valore. L'assedio continua.»<br><small style="opacity:.8">Morale -3. ${inc}</small>`);
      showButtons([{ label: "Preparazione ▸", cls: "hot", fn: () => startSiegeMatchBriefing(house) }, { label: "◂ Consiglio", fn: showWarCouncil }], true);
    } else {
      showText(house.leader, `<b style="color:#ff0054">SCONFITTA ${gap}.</b><br>«Tornate a leccarvi le ferite: la marea non perdona.»<br><small style="opacity:.8">Morale -8, Inverno +5%. ${inc}</small>`);
      showButtons([{ label: "Preparazione ▸", cls: "hot", fn: () => startSiegeMatchBriefing(house) }, { label: "◂ Consiglio", fn: showWarCouncil }], true);
    }
  }
  function afterConquest(kind) {
    const p = getProgress();
    if (kind === "clemenza") applyFx(p, { morale: 10, gold: -10 }); else applyFx(p, { gold: 20, morale: -10 });
    saveProgress(p);
    toast(kind === "clemenza" ? "Clemenza: il feudo ti è fedele." : "Tributo riscosso, ma si mormora.", "info", kind === "clemenza" ? "🕊️" : "🪙");
    showWarCouncil();
  }

  // ================= FINALE =================
  function showEnding() {
    const prog = getProgress();
    renderThronesHubStage(prog);
    if (prog.ending) { showWarCouncil(); return; }
    showText("Lord Leo", `Il Trono di Focaccia è un divanetto di crosta dorata nella piazza del Borgo. Tutti ti guardano. «Che ne facciamo?»`);
    const pick = (id, line, fx) => () => {
      const p = getProgress();
      p.ending = id; applyFx(p, fx);
      if (!p.finaleCoins) { p.finaleCoins = true; if (window.addCoins) window.addCoins(12); }
      saveProgress(p);
      playSynth(880, "sine", 0.5, 0.35);
      toast("Il regno ha un nuovo Trono!", "success", "👑");
      renderThronesHubStage(p);
      showText("Epilogo", line);
      showButtons([{ label: "Torna al Consiglio ▸", cls: "hot", fn: showWarCouncil }], true);
    };
    showButtons([
      { label: "Panca per tutti", sub: "+20 morale", fn: pick("condiviso", "Il Trono diventa una panca lunga dieci metri: ci si siede in cento, a turno. Nessuno comanda, tutti mangiano. Per la prima volta il regno è piccolo come dev'essere.", { morale: 20 }) },
      { label: "Teglia gigante", sub: "+40 pesto", fn: pick("teglia", "Lo tagli a quadrotti: una teglia infinita nel centro della piazza. Per un anno intero nessuno ha fame, e il regno profuma di rosmarino.", { pesto: 40 }) },
      { label: "Locanda del Trono", sub: "+40 oro", fn: pick("locanda", "Aprite una locanda: «Il Trono — Si accomodi». Il Re della Notte, in forma di pozzanghera, ha un tavolo riservato.", { gold: 40 }) }
    ], false);
  }

  window.openThronesWarMenu = openThronesWarMenu;
})();
