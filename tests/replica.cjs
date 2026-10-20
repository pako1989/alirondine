// tests/replica.cjs - «Eroi in Replica»: Peso (scelte e porte chiuse), Sparring Volante (schivata/colpo), Rapporti, Dossier, 4 capitoli, tre finali
const L = require("./lib.cjs");
const MOD = { mod: "__replica", key: "ali-di-rondine.replica" };
const K_ = "window.__replica._dbg.K";
const info = (p) => L.info(p);
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; });
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
const stat = (p, a) => p.evaluate(([k, a]) => eval(k).stat(a), [K_, a]);
async function fight(p, win = true) {
  await p.waitForSelector("#spOv", { timeout: 5000 });
  await p.evaluate((w) => window.__sparring.state.finish(w), win); await p.waitForTimeout(150); await p.click("#spGo"); await p.waitForTimeout(300);
  await L.advance(p).catch(() => {});
}
const SAVE = (zone, ch, step, done, flags, st) => ({ v: 1, diffSet: true, intro: { ch1: 1, [zone]: 1 }, ch, step, done, flags: flags || {}, st: Object.assign({ potere: 3, fiducia: 1, colpa: 0, rabbia: 0 }, st || {}) });
const click = async (p, t) => { await p.evaluate((t) => window.T_.click(t), t); await p.waitForTimeout(200); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__replica.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  if (w === 390) await L.shot(page, "rp_borgo");
  { const bad = await L.reachAll(page, "rp_borgo"); if (bad.length) errors.push("rp_borgo: " + bad.join(", ")); }
  await go(page, "rp_borgo_i0", 10, 10); { const bad = await L.reachAll(page, "rp_borgo_i0"); if (bad.length) errors.push("casa: " + bad.join(", ")); }
  await L.talk(page, "rp_marta"); await adv(page, ["Ho paura"]);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Marta: " + JSON.stringify(i.step));
  if ((await stat(page, "fiducia")) !== 1) errors.push("Peso: fiducia attesa 1, " + (await stat(page, "fiducia")));
  await go(page, "rp_borgo", 12, 10);
  await L.talk(page, "rp_zenit"); await adv(page, ["Grazie per esserci"]);
  i = await info(page); if (i.step[1] !== 2) errors.push("dopo Zenit: " + JSON.stringify(i.step));
  await L.talk(page, "rp_basalto"); await adv(page); await fight(page, false);
  i = await info(page); if (i.step[1] !== 2) errors.push("sconfitta avanza: " + JSON.stringify(i.step));
  await L.talk(page, "rp_basalto"); await adv(page); await fight(page, true);
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step, i.st]));
  L.check(`Replica · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("rp_lega", 2, { 1: 4 }, { 1: "ok" }) });
  await page.evaluate(() => window.__replica.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await adv(page);
  if (w === 390) await L.shot(page, "rp_lega");
  { const bad = await L.reachAll(page, "rp_lega"); if (bad.length) errors.push("rp_lega: " + bad.join(", ")); }
  await L.talk(page, "rp_brezza"); await adv(page);
  await L.talk(page, "rp_brezza"); await adv(page, ["Allenati"]);
  await L.talk(page, "rp_brezza"); await adv(page, ["Allenati"]);
  let i = await info(page); if (i.step[2] !== 2) errors.push("dopo gli allenamenti: " + JSON.stringify(i.step));
  await L.talk(page, "rp_ilario"); await adv(page, ["Raccontami"]);
  if (!(await page.evaluate((k) => eval(k).dossier.has("verita", "copione"), K_))) errors.push("copione non nel Dossier");
  await go(page, "rp_lega_i0", 10, 10); { const bad = await L.reachAll(page, "rp_lega_i0"); if (bad.length) errors.push("direzione: " + bad.join(", ")); }
  await L.talk(page, "rp_sabbioni"); await adv(page);
  i = await info(page); if (i.step[2] !== 3) errors.push("dopo Sabbioni: " + JSON.stringify(i.step));
  await go(page, "rp_lega", 12, 10);
  await L.talk(page, "rp_nube"); await adv(page); await fight(page, true);
  i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Replica · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("rp_archivio", 3, { 2: 4 }, { 1: "ok", 2: "ok" }, {}, { fiducia: 2, rabbia: 1 }) });
  await page.evaluate(() => window.__replica.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await adv(page);
  if (w === 390) await L.shot(page, "rp_archivio");
  { const bad = await L.reachAll(page, "rp_archivio"); if (bad.length) errors.push("rp_archivio: " + bad.join(", ")); }
  await L.talk(page, "rp_brezza"); await adv(page);
  await go(page, "rp_archivio_i0", 10, 10); { const bad = await L.reachAll(page, "rp_archivio_i0"); if (bad.length) errors.push("cassa: " + bad.join(", ")); }
  await L.talk(page, "rp_ottone"); await adv(page, ["Parlami"]);
  await go(page, "rp_archivio", 12, 10);
  await L.talk(page, "rp_teodora"); await adv(page, ["Mi fido"]);
  let i = await info(page); if (i.step[3] !== 2) errors.push("dopo le prove: " + JSON.stringify(i.step));
  await L.talk(page, "rp_brezza"); await click(page, "Apri il Dossier");
  await click(page, "Copione"); await click(page, "Registro");
  await click(page, "Fatture"); await click(page, "Registro");
  const fnd = await page.evaluate((k) => eval(k).dossier.found("verita"), K_); if (fnd !== 2) errors.push("contraddizioni: " + fnd);
  await click(page, "Indietro"); await adv(page).catch(() => {});
  await L.talk(page, "rp_zenit"); await adv(page, ["Voglio capire", "Decidi cosa fare", "Dire tutto"]);
  i = await info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  if ((await page.evaluate((k) => eval(k).F.get("rp_verdict", ""), K_)) !== "" ) {}
  if (!(await page.evaluate((k) => eval(k).F.get("rp_verdict", "") || eval(k).F.get("rp_verdict", ""), K_))) errors.push("verdetto non salvato");
  L.check(`Replica · capitolo 3 (${w} px)`, errors); await browser.close();
}
const DS = { ds_verita_copione: true, ds_verita_fatture: true, ds_verita_registro: true, dl_verita_0: true, dl_verita_1: true };
async function c4(w, want, st) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("rp_stadio", 4, { 3: 4 }, { 1: "ok", 2: "ok", 3: "ok" }, DS, st) });
  await page.evaluate(() => window.__replica.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await adv(page);
  if (w === 390) await L.shot(page, "rp_stadio");
  { const bad = await L.reachAll(page, "rp_stadio"); if (bad.length) errors.push("rp_stadio: " + bad.join(", ")); }
  await L.talk(page, "rp_marta"); await adv(page);
  await L.talk(page, "rp_brezza"); await adv(page, ["Come viene"]);
  let i = await info(page); if (i.step[4] !== 2) errors.push("preparazione: " + JSON.stringify(i.step));
  await L.talk(page, "rp_zenit"); await adv(page); await fight(page, false);
  i = await info(page); if (i.done[4]) errors.push("sconfitta chiude il capitolo: " + JSON.stringify(i.done));
  await L.talk(page, "rp_zenit"); await adv(page); await fight(page, true); await adv(page).catch(() => {});
  i = await info(page); if (i.done[4] !== want) errors.push("finale " + want + ": " + JSON.stringify([i.done, i.step]));
  L.check(`Replica · capitolo 4 ${want} (${w} px)`, errors); await browser.close();
}
async function porta(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("rp_stadio", 4, { 4: 1 }, { 1: "ok", 2: "ok", 3: "ok" }, DS, { fiducia: 1, rabbia: 0 }) });
  await page.evaluate(() => window.__replica.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await adv(page);
  await L.talk(page, "rp_brezza");
  for (let k = 0; k < 8; k++) { await page.waitForTimeout(250); if (await page.evaluate(() => window.T_.btns().some((o) => /Parlargli/.test(o.t)))) break; await page.evaluate(() => window.T_.click("^Continua")); }
  const dis = await page.evaluate(() => { const b = window.T_.btns().find((o) => /Parlargli/.test(o.t)); return b ? b.d : null; });
  if (dis !== true) errors.push("opzione con Fiducia 3 non bloccata a Fiducia 1: " + dis);
  L.check(`Replica · Peso, porta chiusa (${w} px)`, errors); await browser.close();
}
async function sparring(w) {
  const { browser, page, errors } = await L.setup({ w });
  await page.evaluate(() => { window.__dn = null; window.__sparring.start({ title: "Prova", level: 1, oppName: "Test", hp: 0, onDone: (r) => { window.__dn = r; } }); });
  await page.waitForSelector("#spOv");
  const hp0 = await page.evaluate(() => window.__sparring.state.hp), cur = await page.evaluate(() => window.__sparring.state.cur);
  await page.click(`[data-d="${(cur + 1) % 3}"]`); await page.waitForTimeout(100);
  const ch = await page.evaluate(() => window.__sparring.state.charge), hp1 = await page.evaluate(() => window.__sparring.state.hp);
  if (ch !== 1 || hp1 !== hp0) errors.push(`schivata: carica ${ch}, vita ${hp0}→${hp1}`);
  const cur2 = await page.evaluate(() => window.__sparring.state.cur);
  await page.click(`[data-d="${cur2}"]`); await page.waitForTimeout(100);
  const hp2 = await page.evaluate(() => window.__sparring.state.hp); if (hp2 !== hp1 - 1) errors.push(`corsia sbagliata: vita ${hp1}→${hp2}`);
  await page.evaluate(() => window.__sparring.state.finish(true)); await page.click("#spGo"); await page.waitForTimeout(150);
  const r = await page.evaluate(() => window.__dn); if (!r || !r.win) errors.push("finish(true) senza vittoria: " + JSON.stringify(r));
  L.check(`Replica · Sparring Volante (${w} px)`, errors); await browser.close();
}
(async () => {
  await sparring(390);
  await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320);
  await c4(390, "terza", { fiducia: 3, rabbia: 3 }); await c4(390, "figlio", { fiducia: 4, rabbia: 1 }); await c4(320, "cielo", { fiducia: 1, rabbia: 4 });
  await porta(390);
})().catch((e) => { console.error("✗ replica:", e.message); process.exit(1); });
