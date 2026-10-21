// tests/vuota.cjs - «Operazione Scatola Vuota»: zone, Allerta, scatola, Infiltrazione, capitoli
const L = require("./lib.cjs");
const MOD = { mod: "__vuota", key: "ali-di-rondine.vuota" };
const info = (p) => L.info(p);
const K_ = "window.__vuota._dbg.K";
const CH = { 1: ["vs_molo", "vs_capanna", "vs_scogliera"], 2: ["vs_cortile", "vs_officine"], 3: ["vs_celle", "vs_archivio"], 4: ["vs_tetto", "vs_campo"] };
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function zonesTest(w) {
  for (const n of [1, 2, 3, 4]) {
    const save = Object.assign({}, L.BASE, { ch: n, step: { 1: 3, 2: 3, 3: 3, 4: 0 }, done: { 1: "ok", 2: n > 2 ? "ok" : undefined, 3: n > 3 ? "ok" : undefined }, flags: { vs_tessera: 1, vs_c1_done: 1 } });
    const { browser, page, errors } = await L.setup({ w, ...MOD, save });
    await page.evaluate(() => window.__vuota.open()); await page.waitForTimeout(500); await L.advance(page).catch(() => {});
    for (const z of CH[n]) {
      try { await go(page, z); } catch (e) { errors.push("go " + z + ": " + e.message.slice(0, 120)); continue; }
      const cur = await L.zone(page).catch(() => null);
      if (w === 390) await L.shot(page, "vs_" + z);
      try { let bad = await L.reachAll(page, z);
        // un blocco pieno di muro (container, recinto) ha l'interno irraggiungibile: conta solo se confina con terreno libero
        const real = await page.evaluate(([z, bad]) => { const Z = window.__borgoApi.TRZ[z], m = window.__tr.trMap(Z); return bad.filter((b) => { const q = /^oggetto (.) (\d+),(\d+)$/.exec(b); if (!q) return true; const x = +q[2], y = +q[3]; return [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => { const c = m[y + dy] && m[y + dy][x + dx]; return c !== undefined && !window.T_.solidAt(m, Z, x + dx, y + dy); }); }); }, [z, bad]);
        bad = real; if (bad.length) errors.push(z + ": " + bad.join(", ")); } catch (e) { errors.push("reach " + z + ": " + e.message.slice(0, 160)); }
    }
    L.check(`Scatola Vuota · capitolo ${n} zone (${w} px)`, errors); await browser.close();
  }
}
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; });
const SAVE = (ch, step, done, flags, st) => Object.assign({}, L.BASE, { v: 1, diffSet: true, intro: { ch1: 1 }, ch, step, done, flags: flags || {}, st: Object.assign({}, st || {}) });
const winInf = (p, win = true) => p.evaluate(([k, w]) => { const K = eval(k); K.infiltra = (lv, cb) => { K.say([["voce", "(infiltrazione " + lv + ")"]], () => cb({ win: w })); }; }, [K_, win]);
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__vuota.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  await winInf(page);
  await L.talk(page, "vs_ottone"); await adv(page, ["Prendi la scatola"]);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Ottone: " + JSON.stringify(i.step));
  if (!(await page.evaluate((k) => eval(k).inv.has("vs_scatola"), K_))) errors.push("scatola mancante");
  await page.evaluate((k) => eval(k).setStep(1, 2), K_);
  await L.talk(page, "vs_mira"); await adv(page, ["Inizia l'allenamento"]);
  i = await info(page); if (i.step[1] !== 3) errors.push("dopo allenamento: " + JSON.stringify(i.step));
  await go(page, "vs_scogliera", 2, 17);
  await winInf(page);
  await L.talk(page, "vs_corvo"); await adv(page, ["Provi ad aggirarlo"]);
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step, i.st]));
  L.check(`Scatola Vuota · capitolo 1 (${w} px)`, errors); await browser.close();
}
const setStat = (p, a, n) => p.evaluate(([k, a, n]) => { const K = eval(k); K.bond(a, n - K.stat(a)); }, [K_, a, n]);
const give = (p, id) => p.evaluate(([k, id]) => eval(k).inv.give(id), [K_, id]);
async function open(w, save, zone) {
  const c = await L.setup({ w, ...MOD, save }); await c.page.evaluate(() => window.__vuota.open()); await c.page.waitForTimeout(500); await adv(c.page, ["Inizia", "Continua"]); await winInf(c.page);
  if (zone) await go(c.page, zone); return c;
}
async function c2(w) {
  const { browser, page, errors } = await open(w, SAVE(2, { 1: 4 }, { 1: "ok" }, { vs_c1_done: true }, { fiducia: 2 }), "vs_cortile");
  await L.talk(page, "vs_brace"); await adv(page, ["Accetti la scommessa"]);
  let i = await info(page); if (i.step[2] !== 2) errors.push("dopo scommessa: " + JSON.stringify(i.step));
  await give(page, "vs_razione"); await go(page, "vs_officine");
  await L.talk(page, "vs_pio"); await adv(page, ["Gli dai una razione"]);
  i = await info(page); if (i.step[2] !== 3) errors.push("dopo Pio: " + JSON.stringify(i.step));
  await go(page, "vs_cortile");
  await L.talk(page, "vs_brace"); await adv(page, ["Non è stata colpa tua"]);
  i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Scatola Vuota · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const { browser, page, errors } = await open(w, SAVE(3, { 1: 4, 2: 4 }, { 1: "ok", 2: "ok" }, { vs_c1_done: true, vs_c2_done: true, vs_tessera: true }, { fiducia: 2 }), "vs_archivio");
  for (const [x, y] of [[7, 4], [18, 8], [24, 14]]) { const r = await page.evaluate(([x, y]) => window.T_.goAct(x, y), [x, y]); if (r !== "ok") { errors.push("scaffale " + x + "," + y + " " + r); continue; } await L.act(page); await adv(page); }
  let i = await info(page); if (i.step[3] !== 2) errors.push("dopo cartelle: " + JSON.stringify(i.step));
  await L.talk(page, "vs_lastra"); await adv(page, ["Provi a prenderle la parte uno", "Lo affronti subito"]);
  i = await info(page); if (i.done[3] !== "ok" && i.done[3] !== undefined && !i.done[3]) errors.push("capitolo 3: " + JSON.stringify(i.done));
  if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  if (!(await page.evaluate((k) => eval(k).F.is("vs_ott_conf"), K_))) errors.push("confronto con Ottone non registrato");
  L.check(`Scatola Vuota · capitolo 3 (${w} px)`, errors); await browser.close();
}
async function fine(w, id, setup) {
  const { browser, page, errors } = await open(w, SAVE(4, { 1: 4, 2: 4, 3: 4, 4: 3 }, { 1: "ok", 2: "ok", 3: "ok" }, { vs_c1_done: true, vs_c2_done: true, vs_c3_done: true, vs_tessera: true, vs_hatch: true, vs_ott_conf: true }, {}), "vs_campo");
  await setup(page);
  await L.talk(page, "vs_eco"); const lab = { pubblico: "Diffondilo", fuoco: "Bruciarlo", scatola: "Lascialo sul tavolo" }[id];
  await adv(page, [lab]);
  const i = await info(page); if (!(i.ends || []).includes(id) && JSON.stringify(i).indexOf(id) < 0) errors.push("finale " + id + " non registrato: " + JSON.stringify(i).slice(0, 300));
  const e = await page.evaluate(() => window.__vuota.endings()); const f = e.find((x) => x.id === id); if (!f || !f.found) errors.push("finale " + id + " non trovato in endings()");
  L.check(`Scatola Vuota · finale ${id} (${w} px)`, errors); await browser.close();
}
async function bloccati(w) {
  const { browser, page, errors } = await open(w, SAVE(4, { 1: 4, 2: 4, 3: 4, 4: 3 }, { 1: "ok", 2: "ok", 3: "ok" }, { vs_c1_done: true, vs_c2_done: true, vs_c3_done: true, vs_tessera: true, vs_hatch: true }, { fiducia: 2 }), "vs_campo");
  await L.talk(page, "vs_eco"); await page.waitForTimeout(300);
  const ok = await page.evaluate(() => { const b = window.T_.btns(); return { dif: b.find((x) => /Diffondilo/.test(x.t)), sc: b.find((x) => /Lascialo sul tavolo/.test(x.t)) }; });
  if (!ok.dif || !ok.dif.d) errors.push("Diffondi non bloccato con Fiducia 2"); if (!ok.sc || !ok.sc.d) errors.push("Scatola non bloccato");
  L.check(`Scatola Vuota · finali bloccati senza requisiti (${w} px)`, errors); await browser.close();
}
async function partita(w, win) {
  const { browser, page, errors } = await open(w, SAVE(4, { 1: 4, 2: 4, 3: 4, 4: 2 }, { 1: "ok", 2: "ok", 3: "ok" }, { vs_c1_done: true, vs_c2_done: true, vs_c3_done: true, vs_tessera: true, vs_hatch: true }, { fiducia: 5 }), "vs_campo");
  await L.stubMatch(page, win);
  await L.talk(page, "vs_eco"); await adv(page, ["Accetti la partita", "Accetta il risultato", "Diffondilo"]);
  const i = await info(page); if (JSON.stringify(i).indexOf("pubblico") < 0 && !(await page.evaluate(() => window.__vuota.endings().find((x) => x.id === "pubblico").found))) errors.push("finale pubblico dopo partita " + win + " non registrato");
  L.check(`Scatola Vuota · partita finale ${win ? "vinta" : "persa"} (${w} px)`, errors); await browser.close();
}
async function allerta(w) {
  const { browser, page, errors } = await open(w, SAVE(1, { 1: 3 }, {}, {}, {}), "vs_scogliera");
  const a0 = await page.evaluate((k) => eval(k).alert.get(), K_);
  await page.evaluate((k) => { const K = eval(k); K.alert.add(1); K.alert.add(1); }, K_);
  const a1 = await page.evaluate((k) => eval(k).alert.get(), K_); if (a1 !== a0 + 2) errors.push("Allerta " + a0 + " → " + a1);
  await page.evaluate((k) => { const K = eval(k); K.alert.add(5); }, K_);
  const a2 = await page.evaluate((k) => eval(k).alert.get(), K_); if (a2 !== 3) errors.push("Allerta non si ferma a 3: " + a2);
  await go(page, "vs_molo"); const a3 = await page.evaluate((k) => eval(k).alert.get(), K_); if (a3 >= 3) errors.push("Allerta non cala cambiando zona: " + a3);
  L.check(`Scatola Vuota · Allerta (${w} px)`, errors); await browser.close();
}
async function cattura(w) {
  const { browser, page, errors } = await open(w, SAVE(4, { 1: 4, 2: 4, 3: 4, 4: 0 }, { 1: "ok", 2: "ok", 3: "ok" }, { vs_c1_done: true, vs_c2_done: true, vs_c3_done: true }, {}), "vs_tetto");
  await page.evaluate((k) => { const K = eval(k); K.alert.add(5); window.__vuota._dbg.ZONES.vs_tetto.spec.onSeen(K); }, K_);
  await adv(page).catch(() => {}); await page.waitForTimeout(300);
  const e = await page.evaluate(() => window.__vuota.endings().find((x) => x.id === "silenzio")); if (!e || !e.found) errors.push("finale silenzio non registrato");
  L.check(`Scatola Vuota · cattura = finale Silenzio (${w} px)`, errors); await browser.close();
}
async function inf(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  const r = await page.evaluate(() => { const E = window.__inf.eng, out = []; for (let n = 1; n <= window.__inf.count; n++) { const lv = E.level ? E.level(n) : null; out.push(n); } return out.length; });
  if (r !== 8) errors.push("livelli " + r);
  L.check(`Scatola Vuota · Infiltrazione (${w} px)`, errors); await browser.close();
}
(async () => {
  await zonesTest(390); await c1(390); await c2(390); await c3(390); await allerta(390); await cattura(390); await inf(390);
  await fine(390, "fuoco", async () => {}); await fine(390, "pubblico", (p) => setStat(p, "fiducia", 5));
  await fine(390, "scatola", async (p) => { await setStat(p, "fiducia", 7); await setStat(p, "silenzio", 6); await give(p, "vs_foto"); });
  await bloccati(390); await partita(390, true); await partita(390, false);
})();
