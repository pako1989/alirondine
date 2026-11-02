// tests/alcatraz2.cjs - «Fuga da Alcatraz FC 2»: zone con mappa (build/npcs), raggiungibilità, capitolo 1 giocato, 4 capitoli fino al finale, eredità dalla prima Alcatraz
const L = require("./lib.cjs");
const MOD = { mod: "__alcatraz2", key: "ali-di-rondine.alcatraz2" };
const K_ = "window.__alcatraz2._dbg.K";
const info = (p) => L.info(p);
const mockMatch = (p) => p.evaluate(() => { window.__alcatraz2Match.start = (o) => { setTimeout(() => o.onDone({ a: 2, b: 1, win: true, quit: false, data: {} }), 30); return true; }; });
const ZONES = ["alc2_falesia", "alc2_dormitorio", "alc2_cisterna", "alc2_faro"];
async function reach(page, zid) {
  await page.evaluate(([k, z]) => { eval(k).enterZone(z); }, [K_, zid]); await page.waitForTimeout(450);
  return page.evaluate((zid) => {
    const D = window.__alcatraz2._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
    if (typeof spec.build !== "function" || typeof spec.npcs !== "function") return ["build/npcs assenti"];
    const npcs = (z.npcs || []).filter((n) => !n.ghost).map((n) => n.at), seen = T.bfs(m, z, st[0], st[1], npcs);
    const adj = (x, y) => [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
    (spec.items || []).forEach(([x, y]) => { if (!adj(x, y)) bad.push("oggetto " + x + "," + y); });
    for (let s = 0; s <= 3; s++) spec.npcs(s).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at); });
    return bad;
  }, zid);
}
async function storia(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__alcatraz2.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if ((await L.zone(page)) !== "alc2_falesia") errors.push("non parte dalla Falesia: " + (await L.zone(page)));
  await mockMatch(page);
  for (const z of ZONES) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await page.evaluate(([k]) => eval(k).enterZone("alc2_falesia"), [K_]); await page.waitForTimeout(400);
  if (w === 390) await L.shot(page, "alc2_falesia");
  await L.talk(page, "alc2_dario"); await L.advance(page, [/Salpa/]);
  let i = await info(page); if (i.step[1] !== 2) errors.push("dopo Dario: step " + i.step[1]);
  await L.talk(page, "alc2_rebecca"); await L.advance(page, [/Forzatura manuale/]);
  i = await info(page); if (i.step[1] !== 3) errors.push("dopo Rebecca: step " + i.step[1]);
  await page.evaluate(([k]) => eval(k).enterZone("alc2_falesia"), [K_]); await page.waitForTimeout(400);
  await L.talk(page, "alc2_sentinella"); await L.advance(page, [/Sfida a Calcio a Parete/]);
  i = await info(page); if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch]));
  // capitoli 2-4: [capitolo, zona, [personaggio, scelte, step atteso]...]
  const plan = [
    [2, "alc2_dormitorio", [["alc2_bruno", [], 1], ["alc2_gaetano", [], 2], ["alc2_tonelli", [/Libera Tonelli/], 3], ["alc2_sorvegliante", [/Partita a Calcio/], null]]],
    [3, "alc2_cisterna", [["alc2_bruno", [], 1], ["alc2_gaetano", [], 2], ["alc2_bruno", [], 3], ["alc2_vane", [/Sfida Ufficiale/, /Allaga/], null]]],
    [4, "alc2_faro", [["alc2_bruno", [], 1], ["alc2_rebecca", [], 2], ["alc2_corvo", [/Imbarca/], 3], ["alc2_campione", [/Precisione/], null]]]
  ];
  for (const [n, zid, steps] of plan) {
    await page.evaluate(() => window.__alcatraz2.open()); await page.waitForTimeout(200);
    await page.evaluate((n) => window.T_.click("Inizia il Capitolo " + n), n); await L.advance(page);
    if ((await L.zone(page)) !== zid) { errors.push("cap." + n + " non parte da " + zid + ": " + (await L.zone(page))); break; }
    if (w === 390) await L.shot(page, zid);
    for (const [id, prefs, want] of steps) {
      await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, zid]); await page.waitForTimeout(350);
      await L.talk(page, id); await L.advance(page, prefs);
      i = await info(page); if (want !== null && i.step[n] !== want) errors.push("cap." + n + " dopo " + id + ": step " + i.step[n] + " invece di " + want);
    }
    i = await info(page); if (!i.done[n]) errors.push("capitolo " + n + " non concluso: " + JSON.stringify(i.done));
  }
  if (!(i.ends || []).length) errors.push("nessun finale registrato: " + JSON.stringify(i.done));
  L.check(`Alcatraz 2 · zone e 4 capitoli fino al finale (${w} px)`, errors); await browser.close();
}
async function eredita() {
  const out = [];
  for (const [ends, want] of [[["patto"], "patto"], [["scatola", "evasione"], "evasione"], [[], "nessuno"]]) {
    const { browser, page, errors } = await L.setup({ ...MOD });
    const got = await page.evaluate((e) => { localStorage.setItem("ali-di-rondine.alcatraz", JSON.stringify({ v: 1, ends: e })); return window.__alcatraz2._dbg.K.getHeritage(); }, ends);
    if (got !== want) out.push(JSON.stringify(ends) + " → " + got + " (atteso " + want + ")");
    errors.forEach((x) => out.push(x)); await browser.close();
  }
  L.check("Alcatraz 2 · eredità dalla prima Alcatraz", out);
}
(async () => { await storia(390); await eredita(); })().catch((e) => { console.error("✗ alcatraz2:", e.message); process.exit(1); });
