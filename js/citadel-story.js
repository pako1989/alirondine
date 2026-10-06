// ================= SAGA: RICK & MORTY · LA CITTADELLA DEI LEO MORETTI (parodia, nomi inventati) =================
// - 3 partite reali (motore Calcio d'azione) contro Milizia, Guardia Cyber ed Evil Leo, a difficoltà crescente
// - Portal Gun: 4 dimensioni da visitare (episodi con scelte) per reclutare varianti di Leo (+ Leo C-137 = 5 varianti)
// - Squadra: le varianti attive portano un'abilità in partita; Fluido Portale = risorsa per i salti dimensionali
// - Laboratorio: gadget che cambiano davvero la partita; scelta morale prima dello scontro finale (2 epiloghi)
(function () {
  const K_CIT = "ali-di-rondine.citadel-v3"; // chiave invariata, campi nuovi con default sicuri

  const DIFFS = ["facile", "norm", "duro", "leggenda"];
  const ROLE_NAMES = { tommy: "Passaggio Filtrante", gigi: "Finta", fede: "Mira", bruno: "Bomba", nico: "Muro" };

  // Varianti di Leo reclutabili con la Portal Gun: ognuna porta un'abilità in partita
  const VARIANTS = [
    {
      id: "pizzaiolo", name: "Leo Pizzaiolo", dim: "Dimensione dei Forni Senzienti", role: "tommy", icon: "🍕",
      intro: `Atterri in una pizzeria dove i clienti sono lieviti parlanti che discutono di politica. Al forno c'è un Leo col grembiule, la farina fin sulle ciglia. Non alza lo sguardo: «Se sei venuto a convincermi a giocare, il tavolo quattro aspetta da tre giorni.»<br><i>Rick-Nonna: «Ascoltalo, non dargli ordini. È un Leo: capisce solo chi gli parla piano.»</i>`,
      choices: [
        { label: "Ordini e ascolti la sua storia", ok: true, text: `Ti siedi al tavolo quattro. Leo ti racconta che non è mai uscito dal forno perché a tredici anni ha sbagliato un rigore decisivo e ha deciso che il campo non faceva per lui. Gli dici solo: «Ho sbagliato anch'io. Sono ancora qui.» Spegne il forno, si toglie il grembiule. «Porto io i passaggi, tu porta il fiato.»` },
        { label: "Gli rubi la ricetta della focaccia", ok: false, text: `Il lievito del tavolo sette dà l'allarme. Ti inseguono tre baguette senzienti e un grissino con un mandato di cattura. Scappi con lo scarpino mezzo infarinato. Il Leo Pizzaiolo ha capito che sei uno che prende senza ascoltare: riprova.` },
        { label: "Fingi di essere un ispettore sanitario", ok: false, text: `«Ispettore? Controlli le mie mani?» Te le fa vedere. Sono pulite. Sono sempre state pulite. Ti sbatte fuori con dignità. Riprova con un'altra strategia.` }
      ]
    },
    {
      id: "pirata", name: "Leo Pirata", dim: "Dimensione dei Tuberi Corsari", role: "gigi", icon: "🏴‍☠️",
      intro: `Una nave fatta di sacchi di patate attraversa un mare di olio. Al timone c'è un Leo con tricorno e una finta degna di un illusionista. «Chi osa salire sulla Rondine Nera? Parola d'ordine!»<br><i>Rick-Nonna: «Non conosco la parola d'ordine. Ma i pirati amano le storie ben raccontate e odiano chi balbetta.»</i>`,
      choices: [
        { label: "Improvvisi un racconto epico sui gabbiani", ok: true, text: `Inventi la leggenda del Gabbiano Senza Pesce, che rubò la luna per fame. La ciurma piange, applaude, richiede il bis. Il Leo Pirata si asciuga un occhio: «Questa è la parola d'ordine. Imbarco.» Ti insegna la finta del doppio galeone: due avversari restano incantati a guardare dove non c'è niente.` },
        { label: "Sfidi il capitano a duello di sciabola", ok: false, text: `Hai una spatola. Lui ha una sciabola. Il duello dura nove secondi e finisce con te sospeso all'albero per i pantaloni. Il pirata ride, ma non è convinto. Riprova.` },
        { label: "Prometti un tesoro che non esiste", ok: false, text: `«Un tesoro? Dove?» Ti pone tre domande di navigazione e crolli alla seconda. Ti lasciano in scialuppa con una patata di compensazione. Riprova.` }
      ]
    },
    {
      id: "cyber", name: "Leo Cyber", dim: "Dimensione dei Circuiti Stanchi", role: "fede", icon: "🤖",
      intro: `Una città di neon e server in ferie. Un Leo con un occhio meccanico ti fissa e calcola: «Probabilità che tu sia una trappola di Evil Leo: 61%.» Poi, piano: «Probabilità che io abbia solo bisogno di qualcuno che mi chieda come sto: 100%.»<br><i>Rick-Nonna: «Non discutere coi numeri. Chiedigli come sta, per una volta.»</i>`,
      choices: [
        { label: "Gli chiedi come sta, davvero", ok: true, text: `Per undici secondi il suo processore si blocca. Poi risponde: «Non me l'ha mai chiesto nessuno. Sono circa quattrocento anni di manutenzione ordinaria.» Ti offre il modulo di puntamento: «Mira. Ti serve per i tiri che contano. Non perderlo, o torno a calcolare.»` },
        { label: "Provi a hackerarlo", ok: false, text: `Il Leo Cyber ride in binario. Ti restituisce un virus che cambia il tuo sfondo in una foto di una zucchina. Per un giorno ti segue ovunque. Riprova con meno informatica e più cuore.` },
        { label: "Gli dici che sei più forte di lui", ok: false, text: `«Dato errato.» Lo conferma con un diagramma. Il terzo grafico è un istogramma con la tua faccia. Riprova.` }
      ]
    },
    {
      id: "gigante", name: "Leo Gigante", dim: "Dimensione dei Moli Infiniti", role: "bruno", icon: "🗿",
      intro: `Un molo lungo mille chilometri, e in fondo un Leo alto tre metri che pesca con una canna da ormeggio. Il suo tiro, dicono, fa tremare i fari. «Piccolo Leo. Sei venuto a chiedermi di calciare? Non calcio più. Ho rotto un portone, una volta, e ho smesso.»<br><i>Rick-Nonna: «Non spaventarlo. È grosso, ma ha più paura di te di quanto tu ne abbia di lui.»</i>`,
      choices: [
        { label: "Gli dici che il portone si ripara", ok: true, text: `Gli porti una cassetta degli attrezzi. Ripari insieme il portone, che era lì da vent'anni, ancora storto. Quando è fatto, il Gigante resta in silenzio. «Allora si può rompere e aggiustare.» Ti regala un tiro a distanza che parte da lontano come un cannone: il Bomba.` },
        { label: "Lo sfidi a un tiro libero", ok: false, text: `Prova per gioco. Il tiro spacca una nuvola. Spaventato dalla sua stessa forza, lascia cadere la canna e non dice più niente. Hai sbagliato il momento: riprova con più delicatezza.` },
        { label: "Gli offri una focaccia", ok: false, text: `Ne mangia sei, in un boccone. Si commuove. Ti dà una pacca sulla spalla che ti sposta di tre posti. Ma non è abbastanza per convincerlo. Riprova.` }
      ]
    }
  ];

  const STAGES = [
    {
      id: "citadel_patrol", name: "1. La Milizia dei Cloni", rival: "Milizia della Cittadella", captain: "Leo Cyborg C-800",
      teamKey: "citadel_army", pitch: "campo", mode: "eventi", bump: 0, coin: 3, need: 0,
      intro: `La Milizia dei Cloni gioca con schemi calcolati al millimetro: non sbagliano mai la posizione. Ma il Portale è instabile: a metà partita il campo cambia meteo e regole.`,
      pre: `«Identificato soggetto: Leo Moretti, dimensione Terra C-137. Livello di minaccia: focaccia non autorizzata. Consegnate gli scarpini o vi vaporizziamo!»`,
      win: `«Errore di sistema... la Milizia è stata aggirata dal dinamismo di Borgo Marino! Soggetto promosso ad allerta Alfa.»`
    },
    {
      id: "citadel_elite", name: "2. La Guardia Cyber", rival: "Guardia Cyber di Evil Leo", captain: "Leo Cyborg C-900",
      teamKey: "citadel_army", pitch: "erba", mode: "amic", bump: 1, coin: 4, need: 1,
      intro: `La Guardia Cyber è la Milizia dopo l'aggiornamento: più veloce, più dura, con un portiere che prevede i tuoi tiri. Senza varianti di Leo al tuo fianco sarebbe una passeggiata. Per loro.`,
      pre: `«Aggiornamento 9.0 installato. Pietà disinstallata. Cloni, formazione a tenaglia: portate il Leo originale in sala server!»`,
      win: `«Aggiornamento... fallito. Hanno una variante di Leo che non avevamo previsto: la coesione. Errore 404: sconfitta non trovata.»`
    },
    {
      id: "evil_syndicate", name: "3. Il Sindacato di Evil Leo", rival: "Evil Leo Syndicate", captain: "Evil Leo (Benda sull'Occhio)",
      teamKey: "evil_leo", pitch: "molo", mode: "amic", bump: 1, coin: 10, need: 2,
      intro: `Nel cuore della Cittadella siede Evil Leo: benda sull'occhio, gel quantico nei capelli, un disprezzo assoluto per il calcio pulito. Se vinciamo, liberiamo tutte le varianti di Leo del multiverso.`,
      pre: `«Sei prevedibile, Leo C-137. Corri, sudi, sogni di salvare il tuo paesino... Io domino decine di dimensioni mentre tu friggi acciughe con Nonna. Questo match decide chi merita di esistere!»`,
      win: ``
    }
  ];

  const PITCH = { campo: "campetto stretto", erba: "prato", molo: "molo al tramonto" };
  const GADGETS = [
    { id: "pickle", name: "Siero Cetriolo Leo C-137", cost: 35, icon: "🥒", desc: "Gli avversari si muovono al rallentatore: difficoltà -1 livello in ogni partita" },
    { id: "pizza", name: "Focaccia Multiversale 4D", cost: 25, icon: "🍕", desc: "Sblocca un secondo slot in squadra: due varianti di Leo contemporaneamente" }
  ];
  const FLUID_COST = 15; // monete per 3 dosi di Fluido Portale

  let onExitCallback = null;

  // ---------- salvataggio ----------
  function getProgress() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(K_CIT)); } catch (e) {}
    d = d && typeof d === "object" ? d : {};
    const ids = VARIANTS.map((v) => v.id);
    const sIds = STAGES.map((s) => s.id);
    return {
      ...d,
      stagesCleared: (Array.isArray(d.stagesCleared) ? d.stagesCleared : []).filter((x) => sIds.includes(x)),
      evilLeoDefeated: !!d.evilLeoDefeated,
      dimensionJumps: d.dimensionJumps | 0,
      goals: d.goals | 0,
      gadgets: d.gadgets && typeof d.gadgets === "object" ? d.gadgets : {},
      variants: (Array.isArray(d.variants) ? d.variants : []).filter((x) => ids.includes(x)),
      squad: (Array.isArray(d.squad) ? d.squad : []).filter((x) => ids.includes(x)),
      fluid: d.fluid == null ? 2 : Math.max(0, Math.min(9, d.fluid | 0)),
      paid: Array.isArray(d.paid) ? d.paid : [],
      cheated: !!d.cheated,
      oath: d.oath === "clean" || d.oath === "cheat" ? d.oath : null
    };
  }
  function saveProgress(p) {
    try { localStorage.setItem(K_CIT, JSON.stringify(p)); } catch (e) {}
  }
  function slots(p) { return p.gadgets.pizza ? 2 : 1; }
  function coinsNow() { try { return typeof window.coins === "function" ? window.coins() : 0; } catch (e) { return 0; } }
  function addCoins(n) { if (typeof window.addCoins === "function") { try { window.addCoins(n); } catch (e) {} } }

  // ---------- UI ----------
  const $ = (id) => document.getElementById(id);

  function showText(who, html) {
    const el = $("text");
    if (el) el.innerHTML = `<span class="who" style="background:#76ff03; color:#0d1b2a; font-weight:900; letter-spacing:0.5px;">${who}</span><span class="t">${html}</span>`;
    if (window.addDialogueLog) { try { window.addDialogueLog(who, html); } catch (e) {} }
  }

  function showButtons(list, one) {
    const c = $("choices");
    if (!c) return;
    c.innerHTML = "";
    c.className = "choices" + (one ? " one" : "");
    list.forEach((o) => {
      if (o.head) {
        const h = document.createElement("div");
        h.className = "head";
        h.textContent = o.head;
        c.appendChild(h);
        return;
      }
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      if (o.cls) b.className = o.cls;
      if (o.disabled) b.disabled = true;
      if (o.sub) {
        const s = document.createElement("small");
        s.textContent = o.sub;
        b.appendChild(s);
      }
      b.onclick = () => {
        if (window.haptic) { try { window.haptic(15); } catch (e) {} }
        if (o.fn) o.fn();
      };
      c.appendChild(b);
    });
  }

  function playSynth(freq, type, dur, vol) {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(vol || 0.15, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur || 0.12));
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + (dur || 0.12));
    } catch (e) {}
  }

  function activateCitadelStage() {
    if (window.setView) window.setView({ kind: "citadel" });
    const cv = $("cv");
    if (cv) cv.hidden = true;
    const alt = $("stageAlt");
    if (alt) {
      alt.hidden = false;
      alt.style.display = "block";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
      alt.innerHTML = "";
    }
    return alt;
  }

  function injectStyle() {
    if (document.getElementById("ctdStyle")) return;
    const st = document.createElement("style");
    st.id = "ctdStyle";
    st.textContent = "@keyframes ctdSpin{100%{transform:rotate(360deg)}}";
    document.head.appendChild(st);
  }

  function renderHubStage(p) {
    const alt = activateCitadelStage();
    if (!alt) return;
    const squadIcons = ["🦅"].concat(p.squad.map((id) => (VARIANTS.find((v) => v.id === id) || {}).icon || "")).join(" ");
    alt.innerHTML = `
      <div style="position:absolute; inset:0; background:radial-gradient(circle at 50% 45%, #180033 0%, #050010 100%); overflow:hidden;">
        <div style="position:absolute; width:2px; height:2px; background:#fff; top:20%; left:15%; box-shadow: 40px 60px #fff, 120px 20px #76ff03, 220px 80px #00e5ff, 80px 140px #ff0054, 260px 130px #fff, 180px 160px #76ff03;"></div>
        <div style="position:absolute; top:50%; left:50%; width:130px; height:130px; margin:-65px 0 0 -65px; border-radius:50%; background:radial-gradient(circle, #76ff03 25%, #00b300 65%, transparent 75%); box-shadow:0 0 35px #76ff03, inset 0 0 25px #003300; opacity:0.8; animation:ctdSpin 12s linear infinite;"></div>
        <svg style="position:absolute; bottom:0; left:0; width:100%; height:70px; opacity:0.65; pointer-events:none;" viewBox="0 0 320 80" preserveAspectRatio="none">
          <polygon points="20,80 35,30 50,80" fill="#2d004d"/><polygon points="70,80 85,15 100,80" fill="#1f0033"/><polygon points="120,80 140,40 160,80" fill="#38006b"/><polygon points="180,80 205,10 230,80" fill="#1f0033"/><polygon points="250,80 270,35 290,80" fill="#2d004d"/>
        </svg>
        <div style="position:relative; z-index:5; height:100%; padding:8px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
            <div>
              <div style="font-family:var(--display); font-size:15px; color:#76ff03; text-shadow:0 0 12px #76ff03, 2px 2px 0 #000;">🧪 LA CITTADELLA DEI LEO</div>
              <div style="font-size:11px; color:#e0fbfc; font-weight:bold;">Dimensione C-137</div>
            </div>
            <div style="background:rgba(5,0,20,0.8); border:1.5px solid #76ff03; border-radius:6px; padding:3px 7px; font-size:11px; color:#fff; text-align:right;">
              <div>Status: <b style="color:${p.evilLeoDefeated ? "#76ff03" : "#ff0054"};">${p.evilLeoDefeated ? "LIBERA" : "OCCUPATA"}</b></div>
              <div style="color:var(--gold); font-size:10px;">Partite vinte ${p.stagesCleared.length}/${STAGES.length}</div>
            </div>
          </div>
          <div style="background:rgba(10,0,25,0.85); border:1px solid rgba(118,255,3,0.5); border-radius:6px; padding:4px 8px; font-size:11px; color:#fff; display:flex; justify-content:space-between; align-items:center; gap:6px;">
            <span>Squadra: <b>${squadIcons}</b></span>
            <span style="color:#76ff03; font-size:11px;">🌀 Fluido ${p.fluid}/9 · Varianti ${p.variants.length + 1}/5</span>
          </div>
        </div>
      </div>`;
  }

  // ================= HUB =================
  function openCitadelStoryMenu(onBack) {
    onExitCallback = onBack;
    injectStyle();
    showHub();
  }

  function leave() {
    if (onExitCallback) onExitCallback();
    else if (window.title) window.title();
  }

  function stageLocked(p, i) {
    const s = STAGES[i];
    if (i > 0 && !p.stagesCleared.includes(STAGES[i - 1].id)) return "Vinci prima la partita " + i;
    if (p.variants.length < s.need) return "Servono " + s.need + " varianti di Leo (Portal Gun)";
    return null;
  }

  function showHub() {
    if (window.setChapter) window.setChapter("Rick & Morty · La Cittadella dei Leo");
    const p = getProgress();
    renderHubStage(p);

    if (p.evilLeoDefeated) {
      showText("Leo Moretti C-137", `«Evil Leo è stato sconfitto e la Cittadella è libera. Possiamo ancora rigiocare le partite, saltare tra le dimensioni e potenziare la squadra: il multiverso, ormai, è un gran bel campetto.»`);
    } else {
      showText(
        "Rick-Nonna C-137",
        `«*Burp* Leo, non fare quella faccia da triglia bollita! <b>Evil Leo</b> ha militarizzato la Cittadella e costringe i Leo a giocare partite truccate.<br>
        Gioca <b>3 partite vere</b>. Per le più dure ti servono <b>varianti di Leo</b>: usa la Portal Gun per visitare altre dimensioni e reclutarle, poi schierale in <b>Squadra</b>. Non fare lo splendido: ascoltali.»`
      );
    }

    const b = [{ head: "Partite" }];
    STAGES.forEach((s, i) => {
      const lock = stageLocked(p, i);
      const won = p.stagesCleared.includes(s.id);
      b.push({
        label: `${won ? "✓ " : lock ? "🔒 " : "🧪 "}${s.name}`,
        sub: lock || `Partita vera 3v3 · ${PITCH[s.pitch]}`,
        cls: won || lock ? "" : "hot",
        disabled: !!lock,
        fn: () => startBriefing(s, i)
      });
    });
    b.push({ head: "Il Multiverso" });
    b.push(
      { label: "🌀 Portal Gun", sub: `Fluido ${p.fluid}/9 · salta in un'altra dimensione`, cls: "hot", fn: showPortal },
      { label: `👥 Squadra Leo`, sub: `Slot ${p.squad.length}/${slots(p)} · ${p.variants.length} varianti`, fn: showSquad },
      { label: "🧪 Laboratorio", sub: `Gadget e Fluido · ${coinsNow()} monete`, fn: showQuantumLab },
      { label: "💭 Monologo di Rick-Nonna", sub: "Pensieri non richiesti", fn: showRickPhilosophy },
      { label: "◂ Torna al Menu Principale", cls: "pick", fn: leave }
    );
    showButtons(b);
  }

  // ================= PORTAL GUN =================
  function showPortal() {
    const p = getProgress();
    renderHubStage(p);
    showText("Rick-Nonna C-137", `«Ogni salto costa <b>1 Fluido Portale</b> (ne hai <b>${p.fluid}</b>). Il fluido si ricarica vincendo partite, o al Laboratorio. Ogni dimensione ha un Leo che ha smesso di giocare: convincilo a tornare, ma scegli bene le parole.»`);
    const b = VARIANTS.map((v) => {
      const has = p.variants.includes(v.id);
      return {
        label: `${has ? "✓ " : v.icon + " "}${v.dim}`,
        sub: has ? `${v.name} in squadra · ${ROLE_NAMES[v.role]}` : p.fluid < 1 ? "Serve 1 Fluido" : "Costo: 1 Fluido",
        cls: has ? "" : "hot",
        disabled: !has && p.fluid < 1,
        fn: () => (has ? showVariantInfo(v) : hop(v))
      };
    });
    b.push({ label: "◂ Torna al Portale", cls: "pick", fn: showHub });
    showButtons(b);
  }

  function showVariantInfo(v) {
    showText(v.name, `Già nella tua squadra. In partita porta l'abilità <b>${ROLE_NAMES[v.role]}</b>. Attivala dallo slot Squadra.`);
    showButtons([{ label: "◂ Dimensioni", fn: showPortal }], true);
  }

  function hop(v) {
    const p = getProgress();
    if (p.fluid < 1) return showPortal();
    p.fluid--;
    p.dimensionJumps++;
    saveProgress(p);
    renderHubStage(p);
    playSynth(300, "sawtooth", 0.4, 0.2);
    showText(v.dim, v.intro);
    const order = v.choices.map((c, i) => i);
    // le scelte vengono mescolate per non far ricordare la posizione di quella giusta
    order.sort(() => Math.random() - 0.5);
    showButtons(order.map((i) => ({ label: v.choices[i].label, fn: () => hopResult(v, v.choices[i]) })), true);
  }

  function hopResult(v, ch) {
    const p = getProgress();
    if (ch.ok) {
      if (!p.variants.includes(v.id)) p.variants.push(v.id);
      if (p.squad.length < slots(p) && !p.squad.includes(v.id)) p.squad.push(v.id);
      saveProgress(p);
      renderHubStage(p);
      playSynth(880, "sine", 0.4, 0.3);
      if (window.toast) window.toast(`${v.name} si unisce alla squadra!`, "success", v.icon);
      showText(v.name, `${ch.text}<br><br><b style="color:var(--gold);">${v.name} reclutato.</b> Abilità in partita: <b>${ROLE_NAMES[v.role]}</b>.${p.squad.includes(v.id) ? " (Schierato in squadra.)" : " (Attivalo dal menu Squadra.)"}`);
    } else {
      saveProgress(p);
      playSynth(160, "square", 0.3, 0.15);
      showText(v.name, `${ch.text}`);
    }
    showButtons([
      { label: ch.ok ? "◂ Torna alle dimensioni" : "🔄 Riprova (1 Fluido)", cls: ch.ok ? "" : "hot", disabled: !ch.ok && p.fluid < 1, fn: () => (ch.ok ? showPortal() : hop(v)) },
      { label: "◂ Portale", cls: "pick", fn: showHub }
    ]);
  }

  // ================= SQUADRA =================
  function showSquad() {
    const p = getProgress();
    renderHubStage(p);
    const roles = ["nico"].concat(p.squad.map((id) => VARIANTS.find((v) => v.id === id).role));
    showText(
      "Leo Moretti C-137",
      `Squadra: <b>Leo C-137</b> + ${p.squad.length ? p.squad.map((id) => VARIANTS.find((v) => v.id === id).name).join(", ") : "nessuna variante"}.<br>Abilità in partita: <b>${roles.map((r) => ROLE_NAMES[r]).join(", ")}</b>. Slot disponibili: ${slots(p)} (la Focaccia 4D ne aggiunge uno).`
    );
    const b = [];
    if (!p.variants.length) b.push({ label: "Nessuna variante: salta con la Portal Gun", cls: "hot", fn: showPortal });
    p.variants.forEach((id) => {
      const v = VARIANTS.find((x) => x.id === id);
      const on = p.squad.includes(id);
      b.push({
        label: `${on ? "✓ " : ""}${v.icon} ${v.name}`,
        sub: `${ROLE_NAMES[v.role]} · ${on ? "in squadra" : "in panchina"}`,
        cls: on ? "hot" : "",
        fn: () => {
          const q = getProgress();
          if (q.squad.includes(id)) q.squad = q.squad.filter((x) => x !== id);
          else {
            if (q.squad.length >= slots(q)) q.squad.shift();
            q.squad.push(id);
          }
          saveProgress(q);
          showSquad();
        }
      });
    });
    b.push({ label: "◂ Torna al Portale", cls: "pick", fn: showHub });
    showButtons(b);
  }

  // ================= LABORATORIO =================
  function showQuantumLab() {
    const p = getProgress();
    renderHubStage(p);
    const cur = coinsNow();
    showText(
      "Rick-Nonna C-137",
      `«*Burp* Il mio laboratorio dimensionale. Non toccare quella leva o finiamo nel 1942 a giocare coi palloni di pezza.<br>Hai <b>${cur} monete</b> e <b>${p.fluid}/9</b> Fluido Portale. I gadget cambiano davvero la partita.»`
    );
    const b = GADGETS.map((g) => {
      const owned = !!p.gadgets[g.id];
      return {
        label: `${owned ? "✓ " : g.icon + " "}${g.name}`,
        sub: owned ? g.desc : `${g.desc} · ${g.cost} monete`,
        cls: owned ? "" : "hot",
        disabled: owned || cur < g.cost,
        fn: () => {
          const q = getProgress();
          if (q.gadgets[g.id] || coinsNow() < g.cost) return;
          addCoins(-g.cost);
          q.gadgets[g.id] = true;
          saveProgress(q);
          playSynth(820, "sine", 0.35, 0.3);
          if (window.toast) window.toast(`Attivato: ${g.name}!`, "success", g.icon);
          showQuantumLab();
        }
      };
    });
    b.push({
      label: "🌀 Ricarica Fluido (+3)",
      sub: `${FLUID_COST} monete · ${p.fluid}/9`,
      cls: p.fluid < 9 && cur >= FLUID_COST ? "hot" : "",
      disabled: p.fluid >= 9 || cur < FLUID_COST,
      fn: () => {
        const q = getProgress();
        if (q.fluid >= 9 || coinsNow() < FLUID_COST) return;
        addCoins(-FLUID_COST);
        q.fluid = Math.min(9, q.fluid + 3);
        saveProgress(q);
        playSynth(660, "triangle", 0.3, 0.25);
        showQuantumLab();
      }
    });
    b.push({ label: "◂ Torna al Portale", cls: "pick", fn: showHub });
    showButtons(b);
  }

  const MONOLOGUES = [
    `«Vuoi la verità, Leo? Ci sono infinite versioni di te che hanno calciato sul palo, infinite che hanno preso gol al 90° e infinite che hanno aperto una pizzeria a Francoforte. Nessuno esiste di proposito. Ora allacciati gli scarpini.»`,
    `«*Burp* Sai qual è il segreto del multiverso? Che ogni Leo si crede l'unico. Poi ne incontri un altro e scopri che ha le stesse tue paure, ma con un cappello diverso. I difetti che credi solo tuoi sono un classico di famiglia.»`,
    `«Una volta ho perso una partita a carte contro un me stesso di un'altra dimensione. Mi ha chiesto: ti sei divertito? Ho detto di no. Ha detto: allora hai perso due volte. Da allora gioco solo per divertirmi, e vinco comunque. Beh, di solito.»`,
    `«Evil Leo non è nato cattivo, Leo. È un tuo gemello a cui nessuno ha mai detto 'ben fatto'. Se lo batti, ricordati di dirglielo. Sì, a quello con la benda. Sarà imbarazzante per entrambi.»`
  ];
  let monoIdx = 0;
  function showRickPhilosophy() {
    showText("Rick-Nonna C-137", MONOLOGUES[monoIdx % MONOLOGUES.length]);
    monoIdx++;
    showButtons([{ label: "◂ Torna al Portale Dimensionale", fn: showHub }], true);
  }

  // ================= PARTITA =================
  function effectiveDiff(p, s, cheat) {
    let base = window.getGlobalAzDiff ? window.getGlobalAzDiff() : "norm";
    let i = DIFFS.indexOf(base);
    if (i < 0) i = 1;
    i += s.bump;
    if (p.gadgets.pickle) i -= 1;
    if (cheat) i -= 1;
    return DIFFS[Math.max(0, Math.min(DIFFS.length - 1, i))];
  }

  function renderMatchPreviewStage(s, p) {
    const alt = activateCitadelStage();
    if (!alt) return;
    const icons = p.squad.map((id) => (VARIANTS.find((v) => v.id === id) || {}).icon || "").join(" ");
    alt.innerHTML = `
      <div style="position:absolute; inset:0; background:radial-gradient(circle at 50% 50%, #1a0033 0%, #050010 100%); display:flex; flex-direction:column; justify-content:space-between; padding:10px; box-sizing:border-box;">
        <div style="text-align:center; font-family:var(--display); font-size:13px; color:#76ff03; text-shadow:0 0 8px #76ff03;">SCONTRO MULTIVERSALE</div>
        <div style="display:flex; align-items:center; justify-content:space-around;">
          <div style="text-align:center;"><div style="font-size:30px;">🦅</div><div style="color:#3fa7ff; font-weight:bold; font-size:12px;">RONDINE FC</div><div style="color:#a2d2ff; font-size:10px;">Leo C-137 ${icons}</div></div>
          <div style="font-family:var(--display); font-size:20px; color:#76ff03; text-shadow:0 0 10px #76ff03;">VS</div>
          <div style="text-align:center;"><div style="font-size:30px;">🤖</div><div style="color:#ff0054; font-weight:bold; font-size:12px;">${s.rival.toUpperCase()}</div><div style="color:#f8edeb; font-size:10px;">${s.captain}</div></div>
        </div>
        <div style="background:rgba(10,0,25,0.85); border:1px solid #76ff03; border-radius:6px; padding:3px 8px; font-size:10px; color:#fff; text-align:center;">Campo: <b>${s.pitch.toUpperCase()}</b>${s.mode === "eventi" ? " · il Portale altera la partita!" : ""}</div>
      </div>`;
  }

  function startBriefing(s, idx) {
    const p = getProgress();
    renderMatchPreviewStage(s, p);
    // scelta morale prima dello scontro finale
    if (s.id === "evil_syndicate" && !p.oath) {
      showText(
        "Rick-Nonna C-137",
        `<i>${s.pre}</i><br><br>«*Burp* Ultima cosa, Leo. Ho la Portal Gun carica: potrei <b>barare</b> e spedire Evil Leo in una dimensione dove gioca coi guanti da forno. Vittoria facile, ma poco pulita. Oppure vai in campo e basta. Scegli tu.»`
      );
      showButtons([
        { label: "⚽ Gioco pulito", sub: "Difficoltà piena · epilogo migliore", cls: "hot", fn: () => { const q = getProgress(); q.oath = "clean"; saveProgress(q); startBriefing(s, idx); } },
        { label: "🌀 Uso la Portal Gun", sub: "Difficoltà -1 · ricompensa ridotta", fn: () => { const q = getProgress(); q.oath = "cheat"; q.cheated = true; saveProgress(q); startBriefing(s, idx); } },
        { label: "◂ Indietro", cls: "pick", fn: showHub }
      ]);
      return;
    }
    const roles = ["nico"].concat(p.squad.map((id) => VARIANTS.find((v) => v.id === id).role));
    const diff = effectiveDiff(p, s, s.id === "evil_syndicate" && p.oath === "cheat");
    showText(
      s.captain,
      `<i>${s.pre}</i><br>Difficoltà: <b>${diff}</b> · Abilità: <b>${roles.map((r) => ROLE_NAMES[r]).join(", ")}</b>.`
    );
    showButtons([
      { label: "⚽ FISCHIO D'INIZIO", sub: `3v3 · ${PITCH[s.pitch]}`, cls: "hot", fn: () => launchActualMatch(s, idx) },
      { label: "📜 Dossier tattico", sub: "Info sull'avversario", fn: () => showLore(s, idx) },
      { label: "👥 Squadra", sub: "Cambia le varianti", fn: showSquad },
      { label: "◂ Torna al Portale", cls: "pick", fn: showHub }
    ]);
  }

  function showLore(s, idx) {
    showText(s.captain, `<b>ANALISI TATTICA: ${s.rival.toUpperCase()}</b><br>${s.intro}`);
    showButtons([
      { label: "⚽ Gioca subito", cls: "hot", fn: () => launchActualMatch(s, idx) },
      { label: "◂ Indietro", fn: () => startBriefing(s, idx) }
    ], true);
  }

  function launchActualMatch(s, idx) {
    if (!window.azStartSagaMatch) {
      if (window.toast) window.toast("Motore partita non pronto!", "error", "⚠️");
      showHub();
      return;
    }
    const p = getProgress();
    const roles = ["nico"];
    p.squad.forEach((id) => { const v = VARIANTS.find((x) => x.id === id); if (v && !roles.includes(v.role)) roles.push(v.role); });
    const diff = effectiveDiff(p, s, s.id === "evil_syndicate" && p.oath === "cheat");
    if (window.toast) window.toast(`Rondine FC vs ${s.rival}`, "info", "🌀");
    window.azStartSagaMatch(
      s.teamKey,
      { mode: s.mode, pitch: s.pitch, diff, customDiff: true, pu: true, roles },
      (myGoals, rivalGoals) => handleResult(s, idx, myGoals, rivalGoals)
    );
  }

  // ================= RISULTATO =================
  function handleResult(s, idx, myGoals, rivalGoals) {
    const won = myGoals > rivalGoals;
    const p = getProgress();
    p.goals += myGoals;
    if (won) {
      const first = !p.stagesCleared.includes(s.id);
      if (first) p.stagesCleared.push(s.id);
      p.fluid = Math.min(9, p.fluid + (first ? 2 : 1));
      p.dimensionJumps++;
      let coins = 1;
      if (first && !p.paid.includes(s.id)) {
        p.paid.push(s.id);
        coins = s.id === "evil_syndicate" && p.oath === "cheat" ? 4 : s.coin;
      }
      if (s.id === "evil_syndicate") p.evilLeoDefeated = true;
      saveProgress(p);
      addCoins(coins);
      renderHubStage(p);
      playSynth(950, "sine", 0.45, 0.4);
      if (window.toast) window.toast(`Vittoria ${myGoals}–${rivalGoals}! +${coins} monete, +${first ? 2 : 1} Fluido`, "success", "🏆");

      if (s.id === "evil_syndicate") {
        const clean = p.oath !== "cheat";
        showText(
          "Evil Leo",
          `<b style="color:var(--gold); font-size:14px;">TRIPLICE FISCHIO! ${myGoals} – ${rivalGoals}</b><br><br>
          «Com'è possibile? La mia equazione era imbattibile...» La benda gli cade a terra. Sotto, un occhio stanco, uguale al tuo. «Ero un Leo che nessuno veniva a prendere dopo l'allenamento. Ho deciso di non aspettare più. Ho preso tutto io.»<br>
          ${clean
            ? `Gli porgi la mano. «Ben fatto, davvero.» Evil Leo resta immobile, poi sorride storto: «Nessuno me l'aveva mai detto.» Il generatore collassa piano, e con lui le catene di tutti i Leo. <b>Epilogo: Gioco Pulito.</b>`
            : `Il generatore collassa, ma c'è un retrogusto amaro: la Portal Gun fuma ancora. Evil Leo sparisce in una dimensione di guanti da forno e non saprai mai se avresti vinto da solo. <b>Epilogo: Scorciatoia.</b>`}`
        );
        showButtons([{ label: "🏆 Festeggia nel multiverso", cls: "hot", fn: showHub }], true);
      } else {
        showText(s.captain, `<b style="color:var(--gold); font-size:14px;">VITTORIA ${myGoals} – ${rivalGoals}!</b><br><br>${s.win}<br><i>Hai guadagnato Fluido Portale: usalo per reclutare altre varianti.</i>`);
        showButtons([
          { label: "Avanti ▸", cls: "hot", fn: showHub },
          { label: "🌀 Portal Gun", fn: showPortal }
        ]);
      }
    } else {
      saveProgress(p);
      renderHubStage(p);
      const draw = myGoals === rivalGoals;
      showText(
        s.captain,
        draw
          ? `<b style="color:#4cc9f0;">PARITÀ QUANTICA ${myGoals} – ${rivalGoals}</b><br><br>«Stallo temporale: nessun vincitore. Rientrate in campo per spezzare l'equilibrio!»`
          : `<b style="color:#ff0054;">SCONFITTA ${myGoals} – ${rivalGoals}</b><br><br>«Liquidati! Tornate alla dimensione di fritto e ricaricate le batterie.»<br><i>Suggerimento: reclutare varianti di Leo o comprare il Siero rende la partita più abbordabile.</i>`
      );
      showButtons([
        { label: "🔄 Rivincita", cls: "hot", fn: () => launchActualMatch(s, idx) },
        { label: "🌀 Portal Gun", sub: "Recluta varianti", fn: showPortal },
        { label: "◂ Torna all'Hub", cls: "pick", fn: showHub }
      ]);
    }
  }

  window.openCitadelStoryMenu = openCitadelStoryMenu;
})();
