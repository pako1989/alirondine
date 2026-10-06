// ================= NOIR COSTIERO: IL PESCHERECCIO FANTASMA (v2) =================
// Saga investigativa in 3 capitoli giocabili:
//  1. Ispezione del San Giuda (torcia limitata, rumore/allerta, 6 punti da frugare)
//  2. Interrogatorio del Dottore (le prove trovate contano: nervi, pazienza, bluff)
//  3. Rigori sul Molo Vecchio (mira a tempo, portiere con "tell", difficoltà legata all'interrogatorio)
//  + finale a scelta (Giustizia / Redenzione) e piccola ricompensa in monete.
(function () {
  const K_NOIR = "ali-di-rondine.noir-progress";

  function getProgress() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(K_NOIR)); } catch (e) {}
    d = d && typeof d === "object" ? d : {};
    return {
      step: d.step || 0,
      clues: Array.isArray(d.clues) ? d.clues : [],
      won: !!d.won,
      wins: d.wins || 0,
      endings: Array.isArray(d.endings) ? d.endings : [],
      bestShots: d.bestShots || 0,
      paid: !!d.paid,
      confessions: d.confessions || 0
    };
  }
  function saveProgress(p) {
    try { localStorage.setItem(K_NOIR, JSON.stringify(p)); } catch (e) {}
  }

  // ---------- stato della indagine in corso ----------
  let onExitCallback = null;
  let run = null;
  let loopId = null;
  let keyHandler = null;

  function newRun() {
    return { torch: 8, alert: 0, found: [], noise: 0, nerve: 0, patience: 3, stmt: 0, corrects: 0, compassion: false, confessed: false, caught: false, selected: null };
  }

  const CLUES = [
    { id: "fiala", short: "Sale Blu", ico: "🧪", title: "Fiala di Sale Blu", desc: "Cristalli fluorescenti nella salamoia: brillano di blu a contatto con l'acqua di mare. Altro che acciughe.", pos: { top: "58%", left: "44%" }, where: "la stiva" },
    { id: "registro", short: "Registro", ico: "📖", title: "Registro di Bordo Clandestino", desc: "Quote e nomi di scommettitori su cinque partite truccate. Un versamento in franchi svizzeri è cerchiato due volte.", pos: { top: "34%", left: "70%" }, where: "la cabina" },
    { id: "rete", short: "Rete", ico: "⚓", title: "Rete a Doppia Fodera", desc: "Dentro la rete non c'è pesce: ci sono casse stagne zavorrate col piombo, pronte da calare sotto il molo.", pos: { top: "72%", left: "20%" }, where: "la prua" },
    { id: "taccuino", short: "Taccuino", ico: "📓", title: "Taccuino dei Marinai", desc: "Nomi, soprannomi e orari dei turni: «Gigante», «Baffo», «Sciacca». E accanto a ognuno, una dose.", pos: { top: "44%", left: "30%" }, where: "il timone" },
    { id: "foto", short: "Foto", ico: "🖼️", title: "Foto Incorniciata", desc: "Un'aula di scuola, anni fa. Il Dottore sorride in mezzo a trenta ragazzi. Sul retro: «Il giorno che ho smesso di insegnare».", pos: { top: "26%", left: "48%" }, where: "la bacheca di bordo" },
    { id: "esche", short: "Esche", ico: "🪱", title: "Scatola di Esche", desc: "Esche. Vere. Una si muove ancora. Nessuna prova, ma Lina ti guarda come se avessi perso tempo.", pos: { top: "80%", left: "62%" }, where: "la cassetta di poppa", decoy: true }
  ];
  const KEY_CLUES = CLUES.filter((c) => !c.decoy);

  const STATEMENTS = [
    { q: "«Quel sale? Serve per le acciughe dei ristoranti della Costa Azzurra. Mi dia una prova che non sia cucina!»", ok: ["fiala"], hint: "Cosa non fanno le acciughe nell'acqua di mare?" },
    { q: "«Scommesse? Io pesco. Non so nemmeno cosa sia un 'over 2,5'.»", ok: ["registro"], hint: "Chi ha scritto quelle quote?" },
    { q: "«Le reti pesano perché pescano bene. Sono un uomo fortunato.»", ok: ["rete"], hint: "Cosa c'è dentro la rete?" },
    { q: "«Complici? Nessuno. Sono solo un vecchio pescatore, io. Non ho mai insegnato niente a nessuno.»", ok: ["taccuino", "foto"], hint: "Un vecchio pescatore con una squadra e un passato da... qualcosa." }
  ];

  // ---------- util DOM ----------
  const $ = (id) => document.getElementById(id);
  function getStageAlt() { return $("stageAlt"); }
  function setChap(t) { const el = $("chap"); if (el) el.textContent = t; }

  function injectStyle() {
    if ($("noirStyle")) return;
    const st = document.createElement("style");
    st.id = "noirStyle";
    st.textContent = `
      @keyframes noirPulse { from { transform:translate(-50%,-50%) scale(1); } to { transform:translate(-50%,-50%) scale(1.14); } }
      .noir-pin { position:absolute; z-index:15; transform:translate(-50%,-50%); width:38px; height:38px; border-radius:50%; border:2px solid #fff; background:#00e5ff; color:#0e1424; font-size:17px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 14px #00e5ff; animation:noirPulse 1.2s infinite alternate; padding:0; cursor:pointer; }
      .noir-pin.done { background:#4caf50; box-shadow:0 0 12px #4caf50; animation:none; }
      .noir-pin.sel { background:#ffd23f; box-shadow:0 0 16px #ffd23f; }
      .noir-pin.dud { background:#78909c; box-shadow:none; animation:none; }
      .noir-hud { position:absolute; left:6px; right:6px; z-index:10; display:flex; justify-content:space-between; align-items:center; gap:6px; background:rgba(10,16,32,.88); border:1px solid #78909c; border-radius:8px; padding:3px 8px; font-size:11px; color:#cfd8dc; }
      .noir-bar { display:inline-block; width:54px; height:7px; border-radius:4px; background:#263238; vertical-align:middle; overflow:hidden; border:1px solid #546e7a; }
      .noir-bar > i { display:block; height:100%; }
      .noir-hint { position:absolute; bottom:6px; left:8px; right:8px; z-index:10; background:rgba(6,11,24,.82); border:1px solid rgba(255,255,255,.1); border-radius:6px; padding:5px 8px; font-size:11px; color:#cfd8dc; text-align:center; }
      .noir-cv { display:block; width:100%; height:100%; background:#0b1220; touch-action:none; }
    `;
    document.head.appendChild(st);
  }

  function showText(who, html) {
    const el = $("text");
    if (el) el.innerHTML = `<span class="who" style="background:#546e7a; color:#fff;">${who}</span><span class="t">${html}</span>`;
    if (window.addDialogueLog) { try { window.addDialogueLog(who, html); } catch (e) {} }
  }

  function showButtons(list, one) {
    const c = $("choices");
    if (!c) return;
    c.innerHTML = "";
    c.className = "choices" + (one ? " one" : "");
    list.forEach((o) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      if (o.cls) b.className = o.cls;
      if (o.disabled) b.disabled = true;
      if (o.sub) { const s = document.createElement("small"); s.textContent = o.sub; b.appendChild(s); }
      b.onclick = () => {
        if (window.haptic) { try { window.haptic(12); } catch (e) {} }
        if (o.fn) o.fn();
      };
      c.appendChild(b);
    });
  }

  function stopLoops() {
    if (loopId) { cancelAnimationFrame(loopId); loopId = null; }
    if (keyHandler) { window.removeEventListener("keydown", keyHandler); keyHandler = null; }
  }

  function prepStage(display) {
    stopLoops();
    injectStyle();
    if (window.gameEngine && window.gameEngine.setView) window.gameEngine.setView({ kind: "noir" });
    const cv = $("cv");
    if (cv) cv.hidden = true;
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = display || "block";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
    }
    return alt;
  }

  function closeNoirStage() {
    stopLoops();
    const alt = getStageAlt();
    if (alt) { alt.hidden = true; alt.style.display = "none"; alt.innerHTML = ""; }
    const cv = $("cv");
    if (cv) cv.hidden = false;
    if (window.gameEngine && window.gameEngine.setView) window.gameEngine.setView({ kind: "scene", bg: "title" });
  }

  function exitToMenu() {
    closeNoirStage();
    if (onExitCallback) onExitCallback();
  }

  function giveCoins(n) {
    if (n > 0 && typeof window.addCoins === "function") { try { window.addCoins(n); } catch (e) {} }
  }

  const boatImg = (dim) => `<img src="img/noir_fishing_boat.jpg" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.2) brightness(${dim || 0.8}) saturate(0.8);">`;

  // ================= HUB =================
  function openNoirStoryMenu(onBack) {
    onExitCallback = onBack;
    run = newRun();
    showNoirHub();
  }

  function showNoirHub() {
    const alt = prepStage("flex");
    setChap("Noir Costiero · Caso Sale Blu");
    const prog = getProgress();
    if (alt) {
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        ${boatImg(0.8)}
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(7,13,24,0.2) 0%, rgba(7,13,24,0.88) 90%);"></div>
        <div style="position:relative; z-index:2; padding:10px; display:flex; justify-content:space-between; align-items:flex-end; gap:8px;">
          <div>
            <div style="font-family:var(--display); font-size:15px; color:#90caf9; text-shadow:0 0 10px rgba(144,202,249,0.8);">IL PESCHERECCIO FANTASMA</div>
            <div style="font-size:11px; color:#b0bec5;">Indagine notturna con Lina Esposito · Molo Vecchio</div>
          </div>
          <div style="background:rgba(255,255,255,0.1); border:1px solid #78909c; border-radius:6px; padding:3px 7px; font-size:10px; color:#eceff1; text-align:right; white-space:nowrap;">
            Casi chiusi: <b>${prog.wins}</b><br>Finali: <b>${prog.endings.length}/2</b>
          </div>
        </div>`;
    }
    showText(
      "Maresciallo Lina",
      `«Moretti, grazie di essere venuto a quest'ora. La nebbia ha inghiottito il porto e il vecchio <i>San Giuda</i> è rientrato a fari spenti. C'è del Sale Blu in giro, e qualcuno lo sta vendendo a chi truca le partite. Saliamo a bordo prima dell'alba?»`
    );
    showButtons([
      { label: "🕵️ Sali a bordo", sub: "Nuova indagine · 3 capitoli", cls: "hot", fn: startInvestigation },
      { label: "📁 Fascicolo", sub: "Il caso e le prove raccolte", fn: showDossier },
      { label: "◂ Torna al Menu", fn: exitToMenu }
    ]);
  }

  function showDossier() {
    const prog = getProgress();
    const seen = KEY_CLUES.filter((c) => prog.clues.includes(c.id));
    const list = seen.length
      ? seen.map((c) => `${c.ico} ${c.title}`).join("<br>")
      : "Nessuna prova ancora. Il fascicolo è vuoto come il frigo di Baciccia.";
    showText(
      "Lina",
      `«Il nostro uomo si fa chiamare <i>il Dottore</i>. Chimico, un tempo. Ha messo su una squadra clandestina, i <i>Marinai della Notte</i>. Se gli togliamo il carico e la copertura, la rete di combine si sfalda.»<br><b>Prove viste finora (${seen.length}/${KEY_CLUES.length}):</b><br>${list}` +
      (prog.endings.length ? `<br><b>Finali visti:</b> ${prog.endings.map((e) => (e === "giustizia" ? "Giustizia" : "Redenzione")).join(" · ")}` : "") +
      (prog.bestShots ? `<br><b>Record rigori:</b> ${prog.bestShots}/5` : "")
    );
    showButtons([
      { label: "Sali a bordo ▸", cls: "hot", fn: startInvestigation },
      { label: "◂ Indietro", fn: showNoirHub }
    ]);
  }

  // ================= CAPITOLO 1: ISPEZIONE =================
  function startInvestigation() {
    run = newRun();
    setChap("Cap. 1 · Ispezione del San Giuda");
    showText(
      "Lina",
      `«Abbiamo la torcia per otto <b>mosse</b>. Frugare <b>con cautela</b> costa 2 mosse; <b>a forza</b> ne costa 1, ma fa rumore: a 3 di <b>allerta</b> il guardiano ci scopre. Non possiamo trovare tutto: scegli bene.»`
    );
    renderInspection();
  }

  function renderInspection() {
    const alt = prepStage("block");
    if (!alt) return;
    const sel = run.selected;
    const pins = CLUES.map((c) => {
      const done = run.found.includes(c.id);
      const cls = "noir-pin" + (done ? (c.decoy ? " dud" : " done") : sel === c.id ? " sel" : "");
      return `<button type="button" class="${cls}" data-id="${c.id}" aria-label="${c.where}" style="top:${c.pos.top}; left:${c.pos.left};">${done ? (c.decoy ? "·" : "✓") : "🔍"}</button>`;
    }).join("");
    const nKey = run.found.filter((id) => !CLUES.find((c) => c.id === id).decoy).length;
    alt.innerHTML = `
      ${boatImg(0.85)}
      <div style="position:absolute; inset:0; background:rgba(6,12,24,0.3);"></div>
      <div class="noir-hud" style="top:6px;">
        <span>🔦 Torcia <b style="color:#ffd23f;">${run.torch}</b></span>
        <span>🚨 Allerta <b style="color:${run.alert >= 2 ? "#ff5252" : "#ffd23f"};">${run.alert}/3</b></span>
        <span>Prove <b style="color:#90caf9;">${nKey}/${KEY_CLUES.length}</b></span>
      </div>
      ${pins}
      <div class="noir-hint">${sel ? "Scegli come frugare qui sotto" : "Tocca i punti 🔍 sulla nave (o i pulsanti)"}</div>`;
    alt.querySelectorAll(".noir-pin").forEach((b) => {
      b.onclick = () => selectSpot(b.getAttribute("data-id"));
    });
    inspectionButtons();
  }

  function inspectionButtons() {
    const sel = run.selected;
    if (sel) {
      const c = CLUES.find((x) => x.id === sel);
      const canCareful = run.torch >= 2;
      showButtons([
        { label: "🤫 Con cautela", sub: "−2 torcia · nessun rumore", cls: "hot", disabled: !canCareful, fn: () => searchSpot(sel, false) },
        { label: "🔨 A forza", sub: "−1 torcia · +1 allerta", disabled: run.torch < 1, fn: () => searchSpot(sel, true) },
        { label: "◂ Cambia punto", fn: () => { run.selected = null; renderInspection(); } }
      ]);
      return;
    }
    const rows = CLUES.filter((c) => !run.found.includes(c.id)).map((c) => ({
      label: `🔍 ${c.where.charAt(0).toUpperCase() + c.where.slice(1)}`,
      fn: () => selectSpot(c.id)
    }));
    const done = [];
    if (run.found.length >= 1) done.push({ label: "⚖️ Basta così: interroga il Dottore", sub: "Vai al capitolo 2", cls: "hot", fn: startInterrogation });
    done.push({ label: "◂ Abbandona", fn: showNoirHub });
    showButtons(rows.concat(done));
  }

  function selectSpot(id) {
    if (!run || run.found.includes(id)) return;
    run.selected = id;
    const c = CLUES.find((x) => x.id === id);
    showText("Lina", `«${c.where.charAt(0).toUpperCase() + c.where.slice(1)}. Qui c'è qualcosa che non quadra. Piano o di forza?»`);
    renderInspection();
  }

  function searchSpot(id, force) {
    const c = CLUES.find((x) => x.id === id);
    if (!c || run.found.includes(id)) return;
    const cost = force ? 1 : 2;
    if (run.torch < cost) return;
    run.torch -= cost;
    if (force) run.alert++;
    run.found.push(id);
    run.selected = null;
    const prog = getProgress();
    if (!c.decoy && !prog.clues.includes(id)) { prog.clues.push(id); saveProgress(prog); }
    if (window.toast) { try { window.toast(c.decoy ? "Niente di utile…" : `Prova trovata: ${c.title}`, "info", c.ico); } catch (e) {} }
    let extra = "";
    if (force) extra = run.alert >= 3 ? "<br><b style='color:#ff5252'>Un tonfo! Una luce si accende sul molo…</b>" : "<br><i>Il legno scricchiola. Da qualche parte un cane abbaia.</i>";
    showText("Lina", `<b>${c.ico} ${c.title}</b><br>${c.desc}${extra}`);
    renderInspection();

    if (run.alert >= 3) {
      run.caught = true;
      showButtons([{ label: "🏃 Scappate! ▸", cls: "hot", sub: "Il Dottore sa che siete a bordo", fn: startInterrogation }], true);
      return;
    }
    const keyLeft = KEY_CLUES.filter((k) => !run.found.includes(k.id)).length;
    if (keyLeft === 0 || run.torch <= 0) {
      showButtons([{ label: run.torch <= 0 ? "🔦 Torcia scarica: interroga ▸" : "⚖️ Hai tutto: interroga ▸", cls: "hot", fn: startInterrogation }], true);
    }
  }

  // ================= CAPITOLO 2: INTERROGATORIO =================
  function startInterrogation() {
    if (!run.found.some((id) => !CLUES.find((c) => c.id === id).decoy)) {
      // nessuna prova valida: l'interrogatorio parte comunque, ma a mani vuote
    }
    run.nerve = 0;
    run.stmt = 0;
    run.corrects = 0;
    run.patience = run.caught ? 2 : 3;
    setChap("Cap. 2 · Interrogatorio");
    showText(
      "Lina",
      `«${run.caught ? "Ci hanno scoperti, il Dottore è sul chi vive: ho meno pazienza di prima. " : ""}Ascolta le sue bugie e rispondi con la <b>prova</b> che le smonta. Servono tre smentite su quattro per farlo crollare. Se sbagli ${run.patience} volte chiede l'avvocato. Se non hai la prova giusta puoi <b>bluffare</b>… ma è un rischio.»`
    );
    showButtons([{ label: "Entra in sala ▸", cls: "hot", fn: askStatement }], true);
  }

  function interrogationStage(mood) {
    const alt = prepStage("block");
    if (!alt) return;
    const hearts = "❤️".repeat(Math.max(0, run.patience)) + "🖤".repeat(Math.max(0, (run.caught ? 2 : 3) - run.patience));
    const pct = Math.max(0, 100 - run.nerve * 33);
    alt.innerHTML = `
      ${boatImg(0.45)}
      <div style="position:absolute; inset:0; background:radial-gradient(ellipse at 50% 40%, rgba(255,214,120,.18), rgba(5,8,16,.85) 70%);"></div>
      <div class="noir-hud" style="top:6px;">
        <span>🧑‍🔬 Nervi <span class="noir-bar"><i style="width:${pct}%; background:${pct > 60 ? "#ef5350" : pct > 30 ? "#ffa726" : "#66bb6a"};"></i></span></span>
        <span>Pazienza di Lina ${hearts}</span>
      </div>
      <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:64px; filter:drop-shadow(0 0 12px rgba(0,0,0,.8));">${mood || "🧑‍🔬"}</div>
      <div class="noir-hint">Il Dottore: smentita ${Math.min(run.stmt + 1, STATEMENTS.length)}/${STATEMENTS.length} · prove giuste: ${run.corrects}</div>`;
  }

  function askStatement() {
    if (run.stmt >= STATEMENTS.length) return endInterrogation();
    if (run.patience <= 0) return endInterrogation();
    const st = STATEMENTS[run.stmt];
    interrogationStage("🧑‍🔬");
    showText("Il Dottore", st.q + `<br><small style="opacity:.75">(${st.hint})</small>`);
    const have = run.found.map((id) => CLUES.find((c) => c.id === id));
    const btns = have.map((c) => ({
      label: `${c.ico} ${c.short}`,
      sub: "Mostra la prova",
      fn: () => presentClue(c.id)
    }));
    btns.push({ label: "🎲 Bluffa", sub: "35%: va male = −1 pazienza", fn: bluff });
    btns.push({ label: "➡️ Passa oltre", sub: "Nessun rischio, nessun progresso", fn: () => { run.stmt++; askStatement(); } });
    showButtons(btns);
  }

  function statementWon(how) {
    run.nerve++;
    run.corrects++;
    run.stmt++;
    if (how === "foto") run.compassion = true;
    interrogationStage(run.nerve >= 3 ? "😰" : "😠");
    if (window.toast) { try { window.toast("Colpito! Il Dottore vacilla.", "success", "💥"); } catch (e) {} }
    const line = how === "foto"
      ? "«Quella foto… Non l'avevo mai tolta dalla bacheca. Ero un insegnante, sì. Uno che credeva in loro.»"
      : how === "bluff"
        ? "«Come… come fa a saperlo?!» (Lina non lo sa nemmeno lei: ma è andata.)"
        : "«Non… non è come sembra! Quella roba è stata messa là da qualcuno!»";
    showText("Il Dottore", line);
    const last = run.stmt >= STATEMENTS.length;
    showButtons([{ label: last ? (run.nerve >= 3 ? "Il Dottore crolla ▸" : "Concludi ▸") : "Prossima bugia ▸", cls: "hot", fn: last ? endInterrogation : askStatement }], true);
  }

  function statementLost(msg) {
    run.patience--;
    interrogationStage("😏");
    showText("Il Dottore", msg + `<br><small style="opacity:.8">Pazienza di Lina: ${Math.max(0, run.patience)}</small>`);
    showButtons([{ label: run.patience <= 0 ? "Ha chiesto l'avvocato ▸" : "Riprova ▸", cls: "hot", fn: run.patience <= 0 ? endInterrogation : askStatement }], true);
  }

  function presentClue(id) {
    const st = STATEMENTS[run.stmt];
    if (st.ok.includes(id)) return statementWon(id);
    const c = CLUES.find((x) => x.id === id);
    statementLost(c.decoy ? "«Delle esche? Davvero, Maresciallo? Ora mi offendo.»" : "«Questa non c'entra niente con quello che ho detto. Altre idee?»");
  }

  function bluff() {
    if (Math.random() < 0.35) return statementWon("bluff");
    statementLost("«Bluff. Faccia di bronzo, ragazzino, ma io gioco a poker da quarant'anni.»");
  }

  function endInterrogation() {
    run.confessed = run.nerve >= 3;
    const prog = getProgress();
    if (run.confessed) { prog.confessions++; saveProgress(prog); }
    interrogationStage(run.confessed ? "😔" : "😎");
    if (run.confessed) {
      showText(
        "Il Dottore",
        `«Va bene. Va bene! Il carico è sotto il molo, e i miei ragazzi hanno bevuto la soluzione due ore fa. Ma battetemi sul campo e ve lo dimostro: stanotte gioca il Gigante, e sta già tremando.»<br><small style="opacity:.8">I Marinai sono a pezzi: portiere più lento.</small>`
      );
    } else {
      showText(
        "Il Dottore",
        `«Chiamate il mio avvocato. Intanto, ragazzino: i miei uomini hanno il Sale Blu in circolo e corrono come cavallette. Se volete il carico, prendetevelo sul campetto.»<br><small style="opacity:.8">Senza confessione, i Marinai sono carichi: portiere più veloce.</small>`
      );
    }
    if (window.triggerAnimeCutin && run.confessed) {
      try { window.triggerAnimeCutin({ who: "Lina & Leo", shotName: "OBIEZIONE DECISIVA!", isEgo: false, sfxWord: "SCACCO MATTO!" }); } catch (e) {}
    }
    showButtons([{ label: "⚽ Sfida sul Molo Vecchio ▸", cls: "hot", sub: "Cap. 3 · Rigori a mezzanotte", fn: startShootout }], true);
  }

  // ================= CAPITOLO 3: RIGORI SUL MOLO =================
  function startShootout() {
    setChap("Cap. 3 · Rigori sul Molo");
    const alt = prepStage("block");
    if (!alt) return;
    const easy = run.confessed;
    const W = 320, H = 200;
    alt.innerHTML = `<canvas id="noirCv" class="noir-cv" width="${W}" height="${H}"></canvas>
      <div class="noir-hud" style="top:6px;"><span id="noirScore">Gol: <b>0</b>/3</span><span id="noirShots">Tiri: <b>5</b></span><span>${easy ? "Portiere: stanco" : "Portiere: carico"}</span></div>`;
    const cv = $("noirCv");
    const ctx = cv.getContext("2d");

    const goal = { x: 60, y: 54, w: 200, h: 88 };
    let goals = 0, shots = 5, phase = "aim", t = 0, last = performance.now();
    let cx = goal.x + goal.w / 2, cy = goal.y + goal.h / 2;
    let gk = { x: goal.x + goal.w / 2, tx: goal.x + goal.w / 2, lean: 0, truth: true };
    let ball = { x: 160, y: 176, tx: 160, ty: 176, p: 1 };
    let msg = "", msgT = 0, timeout = null;
    const zone = easy ? 44 : 62;
    const speedX = easy ? 1.7 : 2.4;
    const speedY = easy ? 1.3 : 1.9;
    let aimT = 0;
    let streakPerfect = 0;

    function newShot() {
      phase = "aim";
      aimT = Math.random() * 6;
      const dir = Math.random() < 0.5 ? -1 : 1;
      gk.lean = dir;
      gk.truth = Math.random() < (easy ? 0.6 : 0.78); // "tell": il portiere si sbilancia dal lato in cui poi si tuffa
      gk.tx = gk.x + (gk.truth ? dir : -dir) * 62;
      gk.x = goal.x + goal.w / 2;
      ball.x = 160; ball.y = 176; ball.p = 0;
      showText("Leo", `Tiro ${6 - shots}/5. Guarda il portiere: si sbilancia verso un lato… ma può essere una finta. Ferma il mirino con <b>TIRA</b>!`);
      refreshButtons();
    }

    function refreshButtons() {
      showButtons([
        { label: "⚽ TIRA!", sub: "Ferma il mirino (o tocca il campo)", cls: "hot", disabled: phase !== "aim", fn: shoot },
        { label: "◂ Rinuncia", sub: "Torna al molo", fn: () => { stopLoops(); showNoirHub(); } }
      ]);
    }

    function shoot() {
      if (phase !== "aim") return;
      phase = "fly";
      ball.tx = cx; ball.ty = cy; ball.p = 0;
      refreshButtons();
    }

    function resolve() {
      const inGoal = cx > goal.x + 6 && cx < goal.x + goal.w - 6 && cy > goal.y + 4 && cy < goal.y + goal.h;
      const saved = Math.abs(cx - gk.tx) < zone / 2 + 6 && cy > goal.y - 4;
      const corner = Math.abs(cx - (goal.x + goal.w / 2)) > goal.w * 0.36;
      shots--;
      let line;
      if (!inGoal) {
        line = "Palo! Fuori di un soffio.";
        msg = "FUORI";
        streakPerfect = 0;
      } else if (saved) {
        line = "Parata del Gigante!";
        msg = "PARATA";
        streakPerfect = 0;
      } else {
        goals++;
        streakPerfect++;
        line = corner ? "Nel sette! Il portiere non la vede nemmeno." : "Gol! Rete che si gonfia.";
        msg = "GOL!";
        if (window.haptic) { try { window.haptic(30); } catch (e) {} }
      }
      msgT = 60;
      const sc = $("noirScore"), sh = $("noirShots");
      if (sc) sc.innerHTML = `Gol: <b>${goals}</b>/3`;
      if (sh) sh.innerHTML = `Tiri: <b>${shots}</b>`;
      showText("Leo", line + ` (${goals} gol, ${shots} tiri rimasti)`);
      phase = "wait";
      showButtons([]);
      timeout = setTimeout(() => {
        timeout = null;
        if (!$("noirCv")) return;
        if (goals >= 3 || shots <= 0 || goals + shots < 3) return endShootout(goals);
        newShot();
      }, 900);
    }

    keyHandler = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); shoot(); } };
    window.addEventListener("keydown", keyHandler);
    cv.addEventListener("pointerdown", () => shoot());

    function loop(now) {
      if (!$("noirCv")) { if (timeout) clearTimeout(timeout); return; }
      const dt = Math.min(3, (now - last) / 16.67); last = now;
      if (phase === "aim") {
        aimT += 0.035 * dt * speedX;
        cx = goal.x + goal.w / 2 + Math.sin(aimT * 1.6) * (goal.w / 2 + 6);
        cy = goal.y + goal.h / 2 + Math.sin(aimT * 1.1 * speedY + 1) * (goal.h / 2 + 5);
        gk.x += Math.sin(now / 150) * 0.2; // piccolo respiro
        gk.x += (goal.x + goal.w / 2 + gk.lean * 22 - gk.x) * 0.03 * dt; // si sbilancia = tell
      } else if (phase === "fly") {
        ball.p += 0.07 * dt;
        const p = Math.min(1, ball.p);
        ball.x = 160 + (ball.tx - 160) * p;
        ball.y = 176 + (ball.ty - 176) * p - Math.sin(p * Math.PI) * 14;
        gk.x += (gk.tx - gk.x) * 0.16 * dt;
        if (ball.p >= 1) resolve();
      }
      if (msgT > 0) msgT -= dt;

      // render
      ctx.fillStyle = "#0b1220"; ctx.fillRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#14233d"); g.addColorStop(1, "#2a2f38"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#3b3f46"; ctx.fillRect(0, 150, W, 50); // asfalto
      ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(W, 150); ctx.stroke();
      // lampione + nebbia
      ctx.fillStyle = "rgba(255,230,160,.18)"; ctx.beginPath(); ctx.arc(290, 40, 34, 0, 7); ctx.fill();
      ctx.fillStyle = "#222"; ctx.fillRect(288, 40, 3, 110);
      // porta
      ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1;
      for (let x = goal.x; x <= goal.x + goal.w; x += 10) { ctx.beginPath(); ctx.moveTo(x, goal.y); ctx.lineTo(x, goal.y + goal.h); ctx.stroke(); }
      for (let y = goal.y; y <= goal.y + goal.h; y += 10) { ctx.beginPath(); ctx.moveTo(goal.x, y); ctx.lineTo(goal.x + goal.w, y); ctx.stroke(); }
      ctx.strokeStyle = "#eceff1"; ctx.lineWidth = 4; ctx.strokeRect(goal.x, goal.y, goal.w, goal.h + 2);
      // portiere
      const gx = gk.x, lean = (gk.x - (goal.x + goal.w / 2)) / 60;
      ctx.save(); ctx.translate(gx, goal.y + goal.h - 6); ctx.rotate(lean * 0.5);
      ctx.fillStyle = "#c62828"; ctx.fillRect(-11, -46, 22, 42);
      ctx.fillStyle = "#ffcc80"; ctx.beginPath(); ctx.arc(0, -52, 8, 0, 7); ctx.fill();
      ctx.fillStyle = "#c62828"; ctx.fillRect(-26, -40, 15, 6); ctx.fillRect(11, -40, 15, 6);
      ctx.restore();
      // mirino
      if (phase === "aim") {
        ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 7); ctx.moveTo(cx - 14, cy); ctx.lineTo(cx + 14, cy); ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy + 14); ctx.stroke();
      }
      // Leo
      ctx.fillStyle = "#3fa7ff"; ctx.fillRect(150, 176, 20, 20);
      ctx.fillStyle = "#ffd23f"; ctx.fillRect(154, 168, 12, 10);
      // palla
      const bs = 7 - (phase === "fly" ? Math.min(1, ball.p) * 3 : 0);
      ctx.beginPath(); ctx.arc(ball.x, ball.y - 4, bs, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.stroke();
      if (msgT > 0) {
        ctx.font = "bold 26px sans-serif"; ctx.textAlign = "center";
        ctx.fillStyle = msg === "GOL!" ? "#ffd23f" : "#ff5252"; ctx.fillText(msg, 160, 130);
      }
      loopId = requestAnimationFrame(loop);
    }

    newShot();
    loopId = requestAnimationFrame(loop);

    function endShootout(g) {
      stopLoops();
      const prog = getProgress();
      if (g > prog.bestShots) { prog.bestShots = g; saveProgress(prog); }
      if (g >= 3) return solved(g);
      showText(
        "Lina",
        `<b style="color:#ff5252;">Solo ${g} gol: ne servivano 3.</b> «Il Gigante è una roccia stanotte. ${easy ? "" : "Prova a farlo confessare meglio: i suoi sono meno stanchi senza la smentita giusta. "}Respira, ripartiamo dal dischetto.»`
      );
      showButtons([
        { label: "🔁 Riprova i rigori", cls: "hot", fn: startShootout },
        { label: "◂ Torna al molo", fn: showNoirHub }
      ]);
    }
  }

  // ================= FINALE =================
  function solved(goals) {
    setChap("Epilogo · Alba sul Molo");
    prepStage("flex");
    const alt = getStageAlt();
    if (alt) {
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `${boatImg(1)}<div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(255,160,90,.18), rgba(7,13,24,.82) 90%);"></div>
        <div style="position:relative; z-index:2; padding:10px; font-size:12px; color:#ffe0b2;">Alba sul Molo Vecchio · ${goals} gol su 5</div>`;
    }
    if (window.triggerAnimeCutin) { try { window.triggerAnimeCutin({ who: "Leo Moretti", shotName: "TIRO DELLA RONDINE DI MEZZANOTTE", isEgo: false, sfxWord: "CASO CHIUSO!" }); } catch (e) {} }
    showText(
      "Lina",
      `«Carico sequestrato, rete di combine tagliata. Il Dottore ti aspetta in manette sulla banchina. ${run.compassion ? "Ha chiesto di te: ha visto che hai guardato quella foto." : "Ti guarda senza rabbia, come uno che ha perso e lo sa."} Leo… a te la scelta: come chiudiamo?»`
    );
    showButtons([
      { label: "⚖️ Giustizia", sub: "Lo consegni ai carabinieri, senza sconti", cls: "hot", fn: () => ending("giustizia") },
      { label: "🕯️ Redenzione", sub: run.compassion ? "Gli dai la possibilità di costituirsi e testimoniare" : "Gli offri di testimoniare contro la rete", fn: () => ending("redenzione") }
    ]);
  }

  function ending(kind) {
    const prog = getProgress();
    prog.won = true;
    prog.wins++;
    prog.step = 3;
    if (!prog.endings.includes(kind)) prog.endings.push(kind);
    let coins = 2;
    if (!prog.paid) { prog.paid = true; coins = 10; }
    saveProgress(prog);
    giveCoins(coins);
    if (window.toast) { try { window.toast("🏆 CASO RISOLTO: IL PESCHERECCIO FANTASMA!", "goal", "🕵️"); } catch (e) {} }
    const txt = kind === "giustizia"
      ? `Il Dottore sale sulla volante senza dire una parola. Lina lo guarda andare via: «Il Sale Blu rovinava ragazzi che avevano solo voglia di giocare. Le regole servono anche a questo, Leo.»`
      : `Il Dottore consegna da solo il registro completo. «Insegnavo chimica a trenta ragazzi,» dice, «e ho finito per vendere la peggiore lezione. Ditelo ai miei vecchi studenti: studiate, e lasciate stare le scorciatoie.» Lina annuisce piano. Tre mesi dopo, la rete di combine non esiste più.`;
    showText("Lina", `<b style="color:var(--gold); font-size:15px;">CASO CHIUSO!</b><br>${txt}<br><small style="opacity:.8">+${coins} monete · Finali visti: ${prog.endings.length}/2</small>`);
    showButtons([
      { label: "🔁 Nuova indagine", sub: prog.endings.length < 2 ? "C'è un altro finale da scoprire" : "Batti il tuo record", fn: startInvestigation },
      { label: "Festeggia alla Trattoria Moretti 🏠", cls: "hot", fn: exitToMenu }
    ]);
  }

  window.openNoirStoryMenu = openNoirStoryMenu;
})();
