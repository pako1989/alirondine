// tests/banda.cjs - «Banda di Piazza»: zone raggiungibili, capitoli giocati con il brano finto, un brano «Ritmo» vero (apertura, tocchi, fine), Repertorio
const L = require("./lib.cjs");
const MOD = { mod: "__banda", key: "ali-di-rondine.banda" };
const K_ = "window.__banda._dbg.K";
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__banda.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
// il brano finto: vince (o perde) subito e registra con che opzioni è stato chiamato
const stub = (p, win = true, acc = 92) => p.evaluate(([win, acc]) => { window.__rtLog = []; window.__ritmo.start = (o) => { window.__rtLog.push({ song: o.song, mode: o.mode, need: o.need, bonus: o.bonus, mates: (o.mates || []).length }); setTimeout(() => o.onDone({ win, a: acc, b: 60, data: { stars: acc >= 90 ? 3 : 2 } }), 10); return true; }; }, [win, acc]);
const st = async (p, errors, ch, n, what) => { const i = await L.info(p); if (i.step[ch] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
async function zones(w, save, pick, list, tag) {
  const { browser, page, errors } = await start(w, save, pick);
  for (const z of list) {
    try { await go(page, z); if (w === 390) await L.shot(page, "bp_" + z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Banda · zone ${tag} (${w} px)`, errors); await browser.close();
}
const S1 = { v: 1, diffSet: true, intro: { ch1: 1 } };
async function flow1(w, alt) {
  const { browser, page, errors } = await start(w, S1);
  await stub(page);
  try {
    await go(page, "bp_piazza", 21, 16); await L.talk(page, "bp_rocco"); await L.advance(page, [alt ? "Se lo faccio" : "Per la piazza"]); await st(page, errors, 1, 1, "dopo Rocco");
    await L.talk(page, "bp_bracco"); await L.advance(page); await L.talk(page, "bp_nana"); await L.advance(page);
    await go(page, "bp_sala", 8, 8); await L.talk(page, "bp_lilli"); await L.advance(page); await L.talk(page, "bp_abele"); await L.advance(page);
    await L.talk(page, "bp_ferrante"); await L.advance(page, [alt ? "Piacere" : "Sì, Maestro", "Suona la marcia"]); await L.advance(page).catch(() => {});
    await st(page, errors, 1, 2, "dopo la prova");
    const lg = await page.evaluate(() => window.__rtLog); if (!lg || !lg.length || lg[0].song !== "ingresso" || !(lg[0].need > 0.5)) errors.push("brano mal configurato: " + JSON.stringify(lg));
    await go(page, "bp_trattoria", 7, 7); await L.talk(page, "bp_nana"); await L.advance(page, [alt ? "Ci serve" : "Il posto di Ciro"]); await st(page, errors, 1, 3, "dopo Nanà");
    for (const id of ["bp_rocco", "bp_abele", "bp_lilli"]) { await L.talk(page, id); await L.advance(page); }
    await go(page, "bp_piazza", 18, 10); await L.talk(page, "bp_gigi"); await L.advance(page); await L.talk(page, "bp_lilli"); await L.advance(page);
    await L.talk(page, "bp_bracco"); await L.advance(page, [alt ? "Ci dia una data" : "La banda è la piazza"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const ax = await page.evaluate((k) => [eval(k).stat("rigore"), eval(k).stat("cuore")], K_); if (alt ? !(ax[0] > ax[1]) : !(ax[1] > ax[0])) errors.push("Peso sbagliato: " + JSON.stringify(ax));
    const rp = await page.evaluate((k) => eval(k).rhythm.won("ingresso") && eval(k).rhythm.stars("ingresso"), K_); if (!rp) errors.push("Repertorio: il brano vinto non è registrato");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Banda · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// un brano vero: si apre, la spiegazione si chiude, i tocchi contano, finish chiude e la storia va avanti
async function real(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1, bp_sala: 1 }, ch: 1, step: { 1: 1 }, flags: { bp_fer1: 1, bp_m_bp_rocco: 1 } });
  try {
    await go(page, "bp_sala", 8, 8); await L.talk(page, "bp_ferrante");
    for (let k = 0; k < 10; k++) { const ok = await page.evaluate(() => !!window.__ritmo.state); if (ok) break; await page.evaluate(() => { const b = [...document.querySelectorAll("#choices button")].find((x) => /Suona la marcia|^Continua/.test(x.innerText.trim())); if (b) b.click(); }); await page.waitForTimeout(300); }
    await page.waitForTimeout(500);
    const s0 = await page.evaluate(() => window.__ritmo.state && { tut: window.__ritmo.state.tut(), notes: window.__ritmo.state.notes });
    if (!s0) throw new Error("brano vero non aperto");
    if (w === 390) await L.shot(page, "bp_ritmo_tut");
    if (s0.tut) await page.evaluate(() => { const b = [...document.querySelectorAll("#rtOv .tut button")].find((x) => /Gioca|Salta/.test(x.innerText)); if (b) b.click(); });
    if (!(s0.notes > 30)) errors.push("poche note: " + s0.notes);
    // il pilota preme le prime note al momento giusto con i pulsanti veri
    for (let k = 0; k < 8; k++) { await page.evaluate(() => { const st = window.__ritmo.state, n = st.next(); if (n) { st.warp(n.t + 0.01); const b = document.querySelector(`#rtOv button[data-l="${n.lane}"]`); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); } }); await page.waitForTimeout(30); }
    const s1 = await page.evaluate(() => ({ perfect: window.__ritmo.state.perfect, combo: window.__ritmo.state.combo }));
    if (s1.perfect < 6) errors.push("i pulsanti non prendono le note: " + JSON.stringify(s1));
    if (w === 390) await L.shot(page, "bp_ritmo_gioco");
    await page.evaluate(() => window.__ritmo.state.finish(true, 0.8)); await page.waitForTimeout(300);
    if (w === 390) await L.shot(page, "bp_ritmo_fine");
    await page.evaluate(() => document.querySelector("#rtGo").click()); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    await st(page, errors, 1, 2, "dopo il brano vero");
    const mh = await page.evaluate(() => !!window.__musHold); if (mh) errors.push("la musica del gioco resta zittita dopo il brano");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Banda · Ritmo vero (${w} px)`, errors); await browser.close();
}
const S2 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, bp_piazza: 1, bp_corso: 1 }, ch: 2, step: { 1: 4 }, done: { 1: "ok" }, flags: { bp_c1_done: 1, bp_m_bp_rocco: 1, bp_m_bp_lilli: 1, bp_m_bp_abele: 1 } };
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, S2, "Inizia il Capitolo 2");
  await stub(page, true, 88);
  try {
    await go(page, "bp_piazza", 21, 16); await L.talk(page, "bp_ferrante"); await L.advance(page, [alt ? "Vado. E lo porto" : "Vado. Ma non"]); await st(page, errors, 2, 1, "dopo Ferrante");
    await L.talk(page, "bp_rocco"); await L.advance(page); await L.talk(page, "bp_nana"); await L.advance(page);
    await go(page, "bp_casaciro", 6, 6); await L.talk(page, "bp_ciro"); await L.advance(page, [alt ? "La banda ha bisogno" : "Ti siedi"]); await st(page, errors, 2, 2, "dopo Ciro");
    await go(page, "bp_corso", 3, 10); await L.talk(page, "bp_lilli"); await L.advance(page, [alt ? "Le note scritte" : "Suonala"]);
    await L.talk(page, "bp_bracco"); await L.advance(page); await L.talk(page, "bp_gigi"); await L.advance(page);
    await L.talk(page, "bp_abele"); await L.advance(page, ["Si parte"]); await L.advance(page).catch(() => {});
    await st(page, errors, 2, 3, "dopo la sfilata");
    const lg = await page.evaluate(() => window.__rtLog); if (!lg || !lg.length || lg[0].song !== "pioggia" || lg[0].mode !== "sfilata" || lg[0].mates < 2) errors.push("sfilata mal configurata: " + JSON.stringify(lg));
    await L.talk(page, "bp_ferrante"); await L.advance(page, [alt ? "Le note scritte, Lilli. Almeno" : "Maestro, la piazza"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
    const b = await page.evaluate((k) => eval(k).inv.has("bp_bocchino"), K_); if (!b) errors.push("bocchino non ricevuto");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Banda · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
const S3 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, bp_stadio: 1, bp_sottotribuna: 1, bp_regia: 1 }, ch: 3, step: { 1: 4, 2: 4 }, done: { 1: "ok", 2: "ok" }, flags: { bp_c1_done: 1, bp_c2_done: 1, bp_m_bp_rocco: 1, bp_m_bp_lilli: 1, bp_m_bp_abele: 1 } };
async function flow3(w, alt) {
  const { browser, page, errors } = await start(w, S3, "Inizia il Capitolo 3");
  await stub(page, true, 91);
  try {
    await go(page, "bp_sottotribuna", 7, 5); await L.talk(page, "bp_ferrante"); await L.advance(page, [alt ? "Ricominciamo" : "Vado da lei"]);
    if (!alt) {
      await st(page, errors, 3, 1, "dopo la prova");
      await go(page, "bp_stadio", 29, 10); await L.talk(page, "bp_lilli"); await L.advance(page); await st(page, errors, 3, 1, "Lilli senza ancia");
      await go(page, "bp_stadio", 8, 16); await L.talk(page, "bp_rocco"); await L.advance(page);
      const a = await page.evaluate((k) => eval(k).inv.has("bp_ancia"), K_); if (!a) errors.push("ancia di Rocco non ricevuta");
      await go(page, "bp_stadio", 29, 10); await L.talk(page, "bp_lilli"); await L.advance(page, ["Al derby suona"]);
    }
    await st(page, errors, 3, 2, "verso la regia");
    await go(page, "bp_regia", 3, 4); await L.talk(page, "bp_gigi"); await L.advance(page, [alt ? "Stacca il cavo" : "Abbassala"]); await st(page, errors, 3, 3, "dopo Gigi");
    for (const id of ["bp_rocco", "bp_bracco", "bp_nana"]) { await go(page, "bp_stadio", 5, 17); await L.talk(page, id); await L.advance(page); }
    await go(page, "bp_stadio", 5, 17); await L.talk(page, "bp_ferrante"); await L.advance(page, ["Derby: duello"]); await L.advance(page).catch(() => {});
    await st(page, errors, 3, 4, "dopo il derby");
    const lg = await page.evaluate(() => window.__rtLog); if (!lg || !lg.length || lg[0].song !== "derby" || lg[0].mode !== "duello") errors.push("derby mal configurato: " + JSON.stringify(lg));
    await L.talk(page, "bp_ferrante"); await L.advance(page, [alt ? "Prove alle sei" : "Prove in piazza"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    const fl = await page.evaluate((k) => [eval(k).F.is("bp_lilli_via"), eval(k).F.is("bp_sabotaggio"), eval(k).F.is("bp_derby_win")], K_);
    if (fl[0] !== !!alt || fl[1] !== !!alt || !fl[2]) errors.push("flag sbagliati: " + JSON.stringify(fl));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Banda · capitolo 3${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// il derby perso: si può lasciare la curva alla cassa e la storia va avanti
async function lose3(w) {
  const { browser, page, errors } = await start(w, Object.assign({}, S3, { step: { 1: 4, 2: 4, 3: 3 }, flags: Object.assign({ bp_leale: 1 }, S3.flags) }), "Continua");
  await stub(page, false, 40);
  try {
    await go(page, "bp_stadio", 5, 17); await L.talk(page, "bp_ferrante"); await L.advance(page, ["Derby: duello", "Lascia la curva"]); await L.advance(page).catch(() => {});
    await st(page, errors, 3, 4, "dopo il derby perso");
    const lg = await page.evaluate(() => window.__rtLog); if (!lg.length) errors.push("brano non chiamato");
    if (!(await page.evaluate((k) => eval(k).F.is("bp_derby_perso"), K_))) errors.push("flag derby perso mancante");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Banda · derby perso (${w} px)`, errors); await browser.close();
}
(async () => {
  const only = process.argv[2] || "";
  for (const w of [390, 320]) {
    if (!only || only === "zone") await zones(w, S1, null, ["bp_piazza", "bp_sala", "bp_trattoria"], "cap. 1");
    if (!only || only === "c1") { await flow1(w, false); if (w === 390) await flow1(w, true); }
    if (!only || only === "real") await real(w);
    if (!only || only === "zone2") await zones(w, S2, "Inizia il Capitolo 2", ["bp_piazza", "bp_casaciro", "bp_corso"], "cap. 2");
    if (!only || only === "c2") { await flow2(w, false); if (w === 390) await flow2(w, true); }
    if (!only || only === "zone3") await zones(w, S3, "Inizia il Capitolo 3", ["bp_stadio", "bp_sottotribuna", "bp_regia"], "cap. 3");
    if (!only || only === "c3") { await flow3(w, false); if (w === 390) { await flow3(w, true); await lose3(w); } }
  }
})();
