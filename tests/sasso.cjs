// tests/sasso.cjs - «Sette per Sasso Nero»: zone raggiungibili, capitoli giocati con la notte finta, una «Ultima Notte» vera (ondate, porte, granaio), Le Costruzioni
const L = require("./lib.cjs");
const MOD = { mod: "__sasso", key: "ali-di-rondine.sasso" };
const K_ = "window.__sasso._dbg.K";
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__sasso.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
// la notte finta: vince (o perde) subito e registra le porte con cui è stata chiamata
const stub = (p, win = true, fell = []) => p.evaluate(([win, fell]) => { window.__ntLog = []; window.__notte.start = (o) => { window.__ntLog.push({ gates: o.gates, waves: (o.waves || []).length, rain: !!o.rain }); setTimeout(() => o.onDone({ win, a: win ? 80 : 0, b: 1, data: { fell, kills: 30, granaio: win ? 80 : 0, gates: {} } }), 10); return true; }; }, [win, fell]);
const st = async (p, errors, ch, n, what) => { const i = await L.info(p); if (i.step[ch] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
const crew = (p) => p.evaluate((k) => eval(k).crew.list(), K_);
async function zones(w, save, pick, list, tag) {
  const { browser, page, errors } = await start(w, save, pick);
  for (const z of list) {
    try { await go(page, z); if (w === 390) await L.shot(page, "sn_" + z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Sasso Nero · zone ${tag} (${w} px)`, errors); await browser.close();
}
const S1 = { v: 1, diffSet: true, intro: { ch1: 1, sn_villaggio: 1, sn_casa: 1, sn_citta: 1, sn_locanda: 1, sn_dojo: 1 } };
async function flow1(w, alt) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await go(page, "sn_casa", 6, 6); await L.talk(page, "sn_gisaku"); await L.advance(page, [alt ? "Un samurai" : "Basta che"]); await st(page, errors, 1, 1, "dopo Gisaku");
    if (!(await page.evaluate((k) => eval(k).inv.has("sn_kemari"), K_))) errors.push("palla da kemari non ricevuta");
    await go(page, "sn_citta", 5, 19); await L.talk(page, "sn_kanbei"); await L.advance(page, [alt ? "Entro io" : "Calcio la palla"]); await st(page, errors, 1, 2, "dopo Kanbei");
    await go(page, "sn_citta", 14, 16); await L.talk(page, "sn_gonta"); await L.advance(page, [alt ? "Garantisco" : "Paghi la multa"]);
    await go(page, "sn_locanda", 7, 5); await L.talk(page, "sn_oste"); await L.advance(page);
    await L.talk(page, "sn_yumi"); await L.advance(page, [alt ? "Lasciala stare" : "Ti siedi fra loro"]);
    await st(page, errors, 1, 3, "con tre compagni");
    if (!alt) { await L.talk(page, "sn_ren"); await L.advance(page, ["Paghi"]); }
    await go(page, "sn_dojo", 6, 5); await L.talk(page, "sn_hayate"); await L.advance(page, [alt ? "Non duello" : "Accetti il duello"]);
    const c = await crew(page); const want = alt ? 4 : 5; if (c.length !== want) errors.push("compagni: " + JSON.stringify(c));
    const riso = await page.evaluate((k) => eval(k).stat("riso"), K_); if (riso !== (alt ? 6 : 1)) errors.push("riso rimasto: " + riso);
    await go(page, "sn_villaggio", 29, 11); await L.talk(page, "sn_rikichi"); await L.advance(page, [alt ? "Suoni il tamburo" : "Palleggi"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const ax = await page.evaluate((k) => [eval(k).stat("onore"), eval(k).stat("pieta")], K_); if (alt ? !(ax[0] > ax[1]) : !(ax[1] > ax[0])) errors.push("Peso sbagliato: " + JSON.stringify(ax));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// una notte vera: si apre, la spiegazione si chiude, il Campione corre e calcia, le ondate arrivano, la fine chiude
async function real(w) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await page.evaluate(() => { window.__ntRes = null; window.__notte.start({ title: "Prova", gates: { n: { def: 2, tower: true, who: { id: "sn_kiku", n: "Kiku", pow: "arco" } }, e: { ditch: true, trap: 2, who: { n: "Okuma", pow: "muro" } }, s: { who: { n: "Shino", pow: "cura" } }, o: {} }, waves: [[["base", 3, "o"]], [["lesto", 2, "n"], ["capo", 1, "e"]]], onDone: (r) => { window.__ntRes = r; } }); });
    await page.waitForTimeout(400);
    if (w === 390) await L.shot(page, "sn_notte_tut");
    const t0 = await page.evaluate(() => window.__notte.state.tut()); if (t0) await page.evaluate(() => { const b = [...document.querySelectorAll("#ntOv .tut button")].find((x) => /Gioca|Salta/.test(x.innerText)); if (b) b.click(); });
    await page.evaluate(() => window.__notte.state.tick(3.5)); await page.waitForTimeout(100);
    const w0 = await page.evaluate(() => ({ wave: window.__notte.state.wave, foes: window.__notte.state.foes })); if (w0.wave !== 0 || !(w0.foes > 0)) errors.push("la prima ondata non parte: " + JSON.stringify(w0));
    // il Campione va alla porta ovest (senza difese) e calcia
    await page.evaluate(() => { const b = document.querySelector('#ntOv button[data-g="o"]'); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); });
    await page.evaluate(() => window.__notte.state.tick(14)); await page.waitForTimeout(100);
    const k1 = await page.evaluate(() => ({ kills: window.__notte.state.kills, hero: window.__notte.state.hero() })); if (!(k1.kills >= 1) || !(k1.hero[0] < 90)) errors.push("il Campione non corre o non calcia: " + JSON.stringify(k1));
    if (w === 390) await L.shot(page, "sn_notte_gioco");
    await page.evaluate(() => window.__notte.state.tick(40)); await page.waitForTimeout(100);
    const g = await page.evaluate(() => window.__notte.state.gates()); if (!g.find((x) => x[0] === "n" && x[2] === 22)) errors.push("la palizzata non rinforza la porta: " + JSON.stringify(g));
    await page.evaluate(() => window.__notte.state.finish(true)); await page.waitForTimeout(300);
    if (w === 390) await L.shot(page, "sn_notte_fine");
    await page.evaluate(() => document.querySelector("#ntGo").click()); await page.waitForTimeout(300);
    const r = await page.evaluate(() => window.__ntRes); if (!r || !r.win || !r.data || !Array.isArray(r.data.fell)) errors.push("risultato della notte: " + JSON.stringify(r));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · Ultima Notte vera (${w} px)`, errors); await browser.close();
}
// Le Costruzioni: i cantieri compaiono quando servono, si costruisce col legno, resta e si smonta
async function build(w) {
  const { browser, page, errors } = await start(w, Object.assign({}, S1, { ch: 1, step: { 1: 4 }, done: { 1: "ok" }, st: { legno: 6 }, flags: { sn_c1_done: 1 } }));
  try {
    await go(page, "sn_villaggio", 14, 4);
    const t0 = await page.evaluate((k) => eval(k).at(14, 3), K_); if (t0 === "O") errors.push("il cantiere si vede prima del tempo");
    await page.evaluate((k) => { eval(k).F.set("sn_cantieri", true); eval(k).go("sn_villaggio", 14, 4); }, K_); await page.waitForTimeout(500);
    const t1 = await page.evaluate((k) => eval(k).at(14, 3), K_); if (t1 !== "O") errors.push("cantiere vuoto non disegnato: " + t1);
    if (w === 390) await L.shot(page, "sn_cantiere");
    await L.goAct(page, 14, 3); await L.advance(page, ["Palizzata"]);
    const k1 = await page.evaluate((k) => [eval(k).build.at("n1"), eval(k).stat("legno"), eval(k).at(14, 3), eval(k).build.list("n").length], K_);
    if (k1[0] !== "palizzata" || k1[1] !== 3 || k1[2] !== "P" || k1[3] !== 1) errors.push("costruzione: " + JSON.stringify(k1));
    await page.evaluate((k) => eval(k).go("sn_casa", 6, 6), K_); await page.waitForTimeout(400); await page.evaluate((k) => eval(k).go("sn_villaggio", 14, 4), K_); await page.waitForTimeout(400);
    if ((await page.evaluate((k) => eval(k).at(14, 3), K_)) !== "P") errors.push("la palizzata non resta");
    await L.goAct(page, 19, 3); await L.advance(page, ["◂ Lascia stare"]);
    const k2 = await page.evaluate((k) => [eval(k).build.place("n2", "torretta"), eval(k).build.place("n2", "trappola"), eval(k).build.remove("n1"), eval(k).stat("legno")], K_);
    if (k2[0] !== false || k2[1] !== true || k2[2] !== true || k2[3] !== 3) errors.push("legno e smontaggio: " + JSON.stringify(k2));
    const html = await page.evaluate((k) => eval(k).build.html(), K_); if (!/Trappola/.test(html)) errors.push("diario senza costruzioni");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · Le Costruzioni (${w} px)`, errors); await browser.close();
}
// capitolo 2: quattro compagni dal capitolo 1, al passo se ne trovano altri due (il prezzo è chi lasci indietro), poi il kemari coi contadini
const C4 = { cr_n: 4, cr_sn_kanbei: 1, cf_sn_kanbei: 1, cr_sn_gonta: 2, cf_sn_gonta: 1, cr_sn_yumi: 3, cf_sn_yumi: 1, cr_sn_hayate: 4, cf_sn_hayate: 1 };
const S2 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, sn_villaggio: 1, sn_casa: 1, sn_citta: 1, sn_locanda: 1, sn_dojo: 1, sn_passo: 1, sn_tempio: 1, sn_fucina: 1 }, ch: 2, step: { 1: 4 }, done: { 1: "ok" }, st: { riso: 2, onore: 7, pieta: 7 }, flags: Object.assign({ sn_c1_done: 1 }, C4) };
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, S2);
  try {
    await page.evaluate((k) => { window.__kmLog = []; eval(k).playMatch = (o) => { window.__kmLog.push(o.oppTeam); setTimeout(() => o.done({ win: true }), 10); }; }, K_);
    await go(page, "sn_villaggio", 17, 6); await L.talk(page, "sn_kanbei"); await L.advance(page); await st(page, errors, 2, 1, "dopo Kanbei");
    await go(page, "sn_passo", 6, 9); await L.talk(page, "sn_kiku"); await L.advance(page, [alt ? "Corvo Rosso pagherà" : "se Jirō è vivo"]);
    if (!alt) {
      await go(page, "sn_fucina", 6, 6); await L.talk(page, "sn_okuma"); await L.advance(page);
      await go(page, "sn_passo", 26, 17); await L.goAct(page, 26, 18); await L.advance(page);
      if (!(await page.evaluate((k) => eval(k).inv.has("sn_ferro"), K_))) errors.push("sabbia di ferro non presa");
      await go(page, "sn_fucina", 6, 6); await L.talk(page, "sn_okuma"); await L.advance(page);
    } else {
      await go(page, "sn_tempio", 7, 7); await L.talk(page, "sn_shino"); await L.advance(page, ["Non posso"]);
      if (!(await page.evaluate((k) => eval(k).inv.has("sn_campanella"), K_))) errors.push("campanella non ricevuta");
      if ((await crew(page)).includes("sn_shino")) errors.push("Shino è venuta lo stesso");
      await go(page, "sn_passo", 8, 15); await L.talk(page, "sn_masa"); await L.advance(page, ["Lo sfidi"]);
    }
    const c = await crew(page); if (c.length !== 6) errors.push("compagni: " + JSON.stringify(c));
    await st(page, errors, 2, 2, "con sei compagni");
    await go(page, "sn_passo", 19, 20); const t = await page.evaluate((k) => eval(k).crew.has("sn_tetsu"), K_); if (t) errors.push("Tetsu entra oltre il completo");
    await go(page, "sn_villaggio", 16, 12); await L.talk(page, "sn_gisaku"); await L.advance(page, ["Kemari coi contadini"]); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const km = await page.evaluate(() => window.__kmLog); if (!km.length) errors.push("il kemari non parte");
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// capitolo 3: legno dal bosco (il tempo passa), le difese sui cantieri, la soffitta del mulino, la prima notte col Piano vero e l'esploratore
const C6 = Object.assign({}, C4, { cr_n: 6, cr_sn_kiku: 5, cf_sn_kiku: 1, cr_sn_okuma: 6, cf_sn_okuma: 1 });
const S3 = { v: 1, diffSet: true, intro: Object.assign({ ch3: 1, sn_bosco: 1, sn_soffitta: 1 }, S2.intro), ch: 3, step: { 1: 4, 2: 3 }, done: { 1: "ok", 2: "ok" }, st: { riso: 2, onore: 7, pieta: 7 }, flags: Object.assign({ sn_c1_done: 1, sn_c2_done: 1, sn_giuramento: 1 }, C6) };
async function flow3(w, alt) {
  const { browser, page, errors } = await start(w, S3);
  try {
    await stub(page, !alt);
    await go(page, "sn_villaggio", 18, 14); await L.talk(page, "sn_kanbei"); await L.advance(page); await st(page, errors, 3, 1, "dopo Kanbei");
    await go(page, "sn_bosco", 27, 10);
    for (const [x, y] of [[3, 7], [6, 7], [9, 7], [18, 4], [22, 6]]) { await L.goAct(page, x, y); await L.advance(page); }
    const b = await page.evaluate((k) => [eval(k).stat("legno"), eval(k).at(3, 7), eval(k).clock.day(), eval(k).clock.slot()], K_);
    if (b[0] !== 10 || b[1] === "A" || b[2] !== 2 || b[3] !== 2) errors.push("taglio del bambù: " + JSON.stringify(b));
    await go(page, "sn_villaggio", 12, 12); await L.talk(page, "sn_okuma"); await L.advance(page);
    await go(page, "sn_villaggio", 14, 4); await L.goAct(page, 14, 3); await L.advance(page, ["Palizzata"]);
    await page.evaluate((k) => { const B = eval(k).build; B.place("o1", "trappola"); B.place("o2", "fossato"); B.place("e1", "palizzata"); }, K_);
    await go(page, "sn_villaggio", 18, 14); await L.talk(page, "sn_kanbei"); await L.advance(page); await st(page, errors, 3, 2, "con quattro difese");
    await L.talk(page, "sn_shinobu"); await L.advance(page);
    await go(page, "sn_villaggio", 25, 7); await L.goAct(page, 25, 6); await L.advance(page);
    const z = await page.evaluate(() => window.__borgoApi.trZone()); if (z !== "sn_soffitta") errors.push("il mulino non porta in soffitta: " + z);
    if (w === 390) await L.shot(page, "sn_soffitta_c3");
    await L.goAct(page, 3, 1); await L.advance(page, [alt ? "Il villaggio deve sapere" : "Ricoprile"]); await st(page, errors, 3, 3, "dopo la soffitta");
    if (!alt && !(await page.evaluate((k) => eval(k).F.is("sn_perdono"), K_))) errors.push("perdono non segnato");
    await go(page, "sn_villaggio", 18, 14); await L.talk(page, "sn_kanbei");
    await L.advance(page, ["Conferma il piano", "^\\S+ Porta \\S+: \\? ", "^\\S+ (Kanbei|Gonta|Yumi|Hayate|Kiku|Okuma)", alt ? "loro giustizia" : "Si è arreso"]); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const log = await page.evaluate(() => window.__ntLog);
    if (!log.length || !log[0].gates.n.who || !(log[0].gates.n.def >= 1) || !log[0].gates.o.ditch || log[0].gates.o.trap !== 1) errors.push("la notte non riceve porte e difese: " + JSON.stringify(log));
    const i = await L.info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    const f = await page.evaluate((k) => [eval(k).F.is("sn_jiro_pista"), eval(k).F.is("sn_giuramento_rotto"), eval(k).stat("riso"), eval(k).clock.slot()], K_);
    if (alt ? !(f[1] && f[2] === 0) : !(f[0] && f[2] === 2)) errors.push("esito della notte: " + JSON.stringify(f));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · capitolo 3${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// capitolo 4: tre notti (porte cadute = ferite, la seconda ferita uccide, la guaritrice salva uno), il campo dei predoni, Ren
const C6R = Object.assign({}, C4, { cr_n: 6, cr_sn_kiku: 5, cf_sn_kiku: 1, cr_sn_ren: 6, cf_sn_ren: 1 });
const S4 = { v: 1, diffSet: true, intro: Object.assign({ ch4: 1, sn_accampamento: 1 }, S3.intro), ch: 4, step: { 1: 4, 2: 3, 3: 4 }, done: { 1: "ok", 2: "ok", 3: "ok" }, st: { riso: 4, onore: 8, pieta: 8 }, flags: Object.assign({ sn_c1_done: 1, sn_c2_done: 1, sn_c3_done: 1, sn_cantieri: 1, sn_jiro_pista: 1, bd_n1: "palizzata", bd_o1: "trappola" }, C6R) };
const stubSeq = (p, seq) => p.evaluate((seq) => { window.__ntLog = []; window.__notte.start = (o) => { const fell = seq[window.__ntLog.length] || []; window.__ntLog.push({ gates: o.gates, title: o.title }); setTimeout(() => o.onDone({ win: true, a: 80, b: 1, data: { fell, kills: 30, granaio: 80, gates: {} } }), 10); return true; }; }, seq);
const PLAN = ["Conferma il piano", "^\\S+ Porta \\S+: \\? ", "^\\S+ (Kanbei|Gonta|Yumi|Hayate|Kiku|Okuma|Ren)"];
async function flow4(w, alt) {
  const { browser, page, errors } = await start(w, S4);
  try {
    await stubSeq(page, alt ? [[], ["n", "e"], ["n", "e"]] : [[], ["n"], ["n"]]);
    if (alt) await page.evaluate((k) => eval(k).rel.add("sn_ren", 9), K_);
    await go(page, "sn_villaggio", 18, 14); await L.talk(page, "sn_kanbei"); await L.advance(page, PLAN); await st(page, errors, 4, 1, "dopo la prima notte");
    await L.talk(page, "sn_kanbei"); await L.advance(page, ["Andate al campo"]); await st(page, errors, 4, 2, "verso il campo");
    if ((await page.evaluate(() => window.__borgoApi.trZone())) !== "sn_accampamento") errors.push("non si arriva al campo");
    if (w === 390) await L.shot(page, "sn_campo_c4");
    await L.goAct(page, 14, 21); await L.advance(page); if ((await page.evaluate(() => window.__borgoApi.trZone())) !== "sn_accampamento") errors.push("si esce dal campo senza i prigionieri");
    await L.talk(page, "sn_miyo"); await L.advance(page, [alt ? "Scegli tu" : "Rikichi tiene"]);
    await L.talk(page, "sn_jiro"); await L.advance(page);
    await L.goAct(page, 14, 21); await L.advance(page);
    if ((await page.evaluate(() => window.__borgoApi.trZone())) !== "sn_villaggio") errors.push("non si torna dal campo");
    await go(page, "sn_villaggio", 18, 14); await L.talk(page, "sn_kanbei"); await L.advance(page, PLAN); await st(page, errors, 4, 3, "dopo la seconda notte");
    const r = await page.evaluate(([k, alt]) => [eval(k).F.is("sn_ren_tradito"), eval(k).crew.has("sn_ren"), eval(k).build.at("o1"), eval(k).F.is("sn_jiro_salvo"), eval(k).F.is(alt ? "sn_moglie_resta" : "sn_moglie_salva")], [K_, alt]);
    if (alt ? (r[0] || !r[1] || r[2] !== "trappola") : (!r[0] || r[1] || r[2] !== "")) errors.push("Ren: " + JSON.stringify(r));
    if (!r[3] || !r[4]) errors.push("campo: " + JSON.stringify(r));
    await L.talk(page, "sn_kanbei"); await L.advance(page, PLAN); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[4] !== "ok") errors.push("capitolo 4 non concluso: " + JSON.stringify([i.done, i.step]));
    const d = await page.evaluate((k) => { const K = eval(k); return { log: window.__ntLog.length, m: K.plan.last(), dead: Object.keys(K.crew.members).filter((id) => K.F.is("sn_morto_" + id)), fer: Object.keys(K.crew.members).map((id) => K.F.get("sn_ferite_" + id, 0)).filter(Boolean).length, n1: K.build.at("n1") }; }, K_);
    if (d.log !== 3 || d.n1 !== "") errors.push("notti: " + JSON.stringify(d));
    if (alt ? d.dead.length !== 1 : d.dead.length !== 0) errors.push("ferite e morti: " + JSON.stringify(d));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · capitolo 4${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// capitolo 5: l'alba con Corvo Rosso (si riprova se si perde), il mantello nel fango, la collina e i quattro finali
const S5 = { v: 1, diffSet: true, intro: Object.assign({ ch5: 1, sn_tumuli: 1 }, S4.intro), ch: 5, step: { 1: 4, 2: 3, 3: 4, 4: 4 }, done: { 1: "ok", 2: "ok", 3: "ok", 4: "ok" }, st: { riso: 4, onore: 8, pieta: 8 }, flags: Object.assign({ sn_c1_done: 1, sn_c2_done: 1, sn_c3_done: 1, sn_c4_done: 1, sn_cantieri: 1, sn_perdono: 1, sn_jiro_salvo: 1, sn_giuramento: 1 }, C6R) };
const stubRes = (p, seq) => p.evaluate((seq) => { window.__ntLog = []; window.__notte.start = (o) => { const win = seq[window.__ntLog.length]; window.__ntLog.push({ rain: !!o.rain, boss: !!o.boss, corvo: JSON.stringify(o.waves).includes("corvo") }); setTimeout(() => o.onDone({ win, a: 80, b: 1, data: { fell: [], kills: 30, granaio: 80, gates: {} } }), 10); return true; }; }, seq);
async function flow5(w, mode) {
  const save = JSON.parse(JSON.stringify(S5));
  if (mode === "tumuli") Object.assign(save.flags, { sn_morto_sn_kiku: 1, cr_sn_kiku: 0, cf_sn_kiku: 0, sn_morto_sn_ren: 1, cr_sn_ren: 0, cf_sn_ren: 0 }), Object.assign(save.st, { onore: 9, pieta: 8 });
  if (mode === "resta") { delete save.flags.sn_perdono; Object.assign(save.st, { onore: 5, pieta: 10 }); }
  const { browser, page, errors } = await start(w, save);
  try {
    await stubRes(page, mode === "tumuli" ? [false, true] : [true]);
    await go(page, "sn_villaggio", 18, 14); await L.talk(page, "sn_kanbei"); await L.advance(page, PLAN.concat([mode === "tumuli" ? "Finisce qui" : "Vattene"]));
    if (mode === "tumuli") { if ((await L.info(page)).step[5]) errors.push("dopo la sconfitta non si riprova"); await L.talk(page, "sn_kanbei"); await L.advance(page, PLAN.concat(["Finisce qui"])); }
    await st(page, errors, 5, 1, "dopo Corvo");
    const log = await page.evaluate(() => window.__ntLog); if (!log.length || !log[0].rain || !log[0].corvo) errors.push("l'alba senza pioggia o senza Corvo: " + JSON.stringify(log));
    await go(page, "sn_villaggio", 16, 22); await L.goAct(page, 16, 23); await L.advance(page);
    if ((await page.evaluate(() => window.__borgoApi.trZone())) !== "sn_tumuli") errors.push("la Porta Sud non porta alla collina");
    if (w === 390) await L.shot(page, "sn_tumuli_" + mode);
    if (mode === "tumuli") { await L.goAct(page, 17, 9); await L.advance(page); }
    await L.talk(page, "sn_gisaku"); await L.advance(page, [mode === "resta" ? "Resti a Sasso Nero" : "Riparti"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[5] !== mode) errors.push("finale: " + JSON.stringify([i.done, i.step]));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · capitolo 5 · finale ${mode} (${w} px)`, errors); await browser.close();
}
(async () => {
  const only = process.argv[2] || "";
  for (const w of [390, 320]) {
    if (!only || only === "zone") await zones(w, S1, null, ["sn_villaggio", "sn_casa", "sn_citta", "sn_locanda", "sn_dojo"], "cap. 1");
    if (!only || only === "zone2") await zones(w, S2, null, ["sn_villaggio", "sn_passo", "sn_tempio", "sn_fucina"], "cap. 2");
    if (!only || only === "c2") { await flow2(w, false); if (w === 390) await flow2(w, true); }
    if (!only || only === "zone3") await zones(w, Object.assign({}, S3, { step: { 1: 4, 2: 3, 3: 2 }, flags: Object.assign({ sn_cantieri: 1, sn_soff_pista: 1 }, S3.flags) }), null, ["sn_villaggio", "sn_bosco", "sn_soffitta"], "cap. 3");
    if (!only || only === "c3") { await flow3(w, false); if (w === 390) await flow3(w, true); }
    if (!only || only === "zone4") await zones(w, S4, null, ["sn_villaggio", "sn_accampamento"], "cap. 4");
    if (!only || only === "c4") { await flow4(w, false); if (w === 390) await flow4(w, true); }
    if (!only || only === "zone5") await zones(w, Object.assign({}, S5, { step: Object.assign({ 5: 1 }, S5.step), flags: Object.assign({ sn_morto_sn_kiku: 1 }, S5.flags) }), null, ["sn_villaggio", "sn_tumuli"], "cap. 5");
    if (!only || only === "c5") { if (w === 390) { await flow5(w, "nessuno"); await flow5(w, "tumuli"); } else await flow5(w, "resta"); }
    if (!only || only === "c1") { await flow1(w, false); if (w === 390) await flow1(w, true); }
    if (!only || only === "real") await real(w);
    if (!only || only === "build") await build(w);
  }
})();
