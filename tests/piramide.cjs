// tests/piramide.cjs - «La Piramide del Sole»: raggiungibilità delle zone, tre capitoli giocati, quattro finali, motore Pok-ta-pok a pilota automatico
const L = require("./lib.cjs");
const MOD = { mod: "__piramide", key: "ali-di-rondine.piramide" };
const K_ = "window.__piramide._dbg.K";
const info = (p) => L.info(p);
const mockMatch = (p, win = true) => p.evaluate((w) => { window.__anello.start = (o) => { setTimeout(() => o.done ? o.done({ a: w ? 2 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} }) : o.onDone({ a: w ? 2 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} }), 30); return true; }; }, win);
async function reach(page, zid) {
  await page.evaluate(([k, z]) => { eval(k).enterZone(z); }, [K_, zid]); await page.waitForTimeout(450);
  return page.evaluate((zid) => {
    const D = window.__piramide._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
    const npcs = (z.npcs || []).filter((n) => !n.ghost).map((n) => n.at), seen = T.bfs(m, z, st[0], st[1], npcs);
    const adj = (x, y) => [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
    (spec.items || []).forEach(([x, y]) => { if (!adj(x, y)) bad.push("oggetto " + x + "," + y); });
    for (let s = 0; s <= 3; s++) (spec.npcs ? spec.npcs(s) : []).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at); });
    for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) if (m[y][x] === "q" && !adj(x, y)) bad.push("porta " + x + "," + y);
    return bad;
  }, zid);
}
async function storia(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__piramide.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  const chk = async (n, v, why) => { const s = (await info(page)).step[n] || 0; if (s !== v) errors.push(why + ": step " + s + " invece di " + v); };
  await mockMatch(page, true);
  const zones = { 1: ["my_campobase", "my_giungla", "my_atrio"], 2: ["my_cortile", "my_labirinto", "my_cripta"], 3: ["my_sommita", "my_cenote"] };
  const goEnter = async (z) => { await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, z]); await page.waitForTimeout(400); };
  for (const z of zones[1]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("my_campobase"); if (w === 390) await L.shot(page, "my_campobase");
  await L.talk(page, "my_alvarez"); await L.advance(page); await chk(1, 1, "Alvarez c1");
  await L.talk(page, "my_diego"); await L.advance(page); await chk(1, 2, "Diego c1");
  await L.talk(page, "my_ixchel"); await L.advance(page); await chk(1, 3, "Ixchel c1");
  await goEnter("my_atrio"); await L.talk(page, "my_kukulkan"); await L.advance(page, [/Sfida il Guardiano/]);
  { const i = await info(page); if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch])); }
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "my_cortile") errors.push("cap.2 non parte dal cortile: " + (await L.zone(page)));
  for (const z of zones[2]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("my_cortile");
  await L.talk(page, "my_alvarez"); await L.advance(page); await chk(2, 1, "Alvarez c2");
  await goEnter("my_labirinto"); await L.talk(page, "my_ixchel"); await L.advance(page); await chk(2, 2, "Ixchel c2");
  await goEnter("my_cripta"); await L.talk(page, "my_vargas"); await L.advance(page); await chk(2, 3, "Vargas c2");
  await L.talk(page, "my_vargas"); await L.advance(page, [/Sfida i Mercenari/]);
  { const i = await info(page); if (!i.done[2] || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.ch])); }
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if ((await L.zone(page)) !== "my_sommita") errors.push("cap.3 non parte dalla sommità: " + (await L.zone(page)));
  for (const z of zones[3]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("my_sommita"); if (w === 390) await L.shot(page, "my_sommita");
  await L.talk(page, "my_alvarez"); await L.advance(page); await chk(3, 1, "Alvarez c3");
  await L.talk(page, "my_ixchel"); await L.advance(page); await chk(3, 2, "Ixchel c3");
  await L.talk(page, "my_kukulkan"); await L.advance(page, [/Gioca l'Ultimo Rito/]); await chk(3, 3, "finale giocata");
  const fin = async (kind, pref) => {
    await page.evaluate(([k]) => { const K = eval(k); K.setStep(3, 3); K.enterZone("my_sommita"); }, [K_]);
    await page.waitForTimeout(450); await L.talk(page, "my_kukulkan"); await L.advance(page, [pref]);
    const i = await info(page); if (!i.ends.includes(kind) || i.done[3] !== kind) errors.push("finale " + kind + ": " + JSON.stringify([i.done, i.ends]));
  };
  await fin("giaguaro", /Consacra il Tempio/); await fin("accademia", /Dona i reperti/); await fin("abisso", /fuga rocambolesca/); await fin("kukulkan", /Abbraccia la profezia/);
  { const i = await info(page); if (i.ends.length !== 4) errors.push("finali: " + JSON.stringify(i.ends)); }
  L.check(`La Piramide del Sole · tre capitoli e quattro finali (${w} px)`, errors); await browser.close();
}
// il motore: partita intera a pilota automatico, con punteggi plausibili
async function motore() {
  const { browser, page, errors } = await L.setup({ ...MOD });
  const r = await page.evaluate(async () => {
    const out = []; for (let k = 0; k < 6; k++) { let res = null; window.__anello.start({ auto: true, fast: true, oppNames: ["Guardiano", "Sacerdote"], mate: "Ixchel", onDone: (x) => { res = x; } });
      for (let i = 0; i < 400 && !res; i++) await new Promise((r) => setTimeout(r, 50)); out.push(res ? [res.a, res.b] : null); if (!res) { window.__anello.state.finish(); } }
    return out; });
  if (r.some((x) => !x)) errors.push("partita non conclusa: " + JSON.stringify(r));
  const tot = r.filter(Boolean).reduce((n, [a, b]) => n + a + b, 0); if (tot === 0) errors.push("mai un punto in 6 partite: " + JSON.stringify(r)); if (tot / 6 > 16) errors.push("troppi punti: " + JSON.stringify(r));
  console.log("  punteggi:", JSON.stringify(r));
  L.check("Pok-ta-pok · partite a pilota automatico", errors); await browser.close();
}
(async () => { await storia(390); await motore(); })().catch((e) => { console.error("✗ piramide:", e.message); process.exit(1); });
