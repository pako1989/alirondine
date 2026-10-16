// tests/cenere.cjs - «Cenere e Gloria»: raggiungibilità delle zone, tre capitoli giocati, quattro finali, motore Campo di Rottami a pilota automatico
const L = require("./lib.cjs");
const MOD = { mod: "__cenere", key: "ali-di-rondine.cenere" };
const K_ = "window.__cenere._dbg.K";
const info = (p) => L.info(p);
const mockMatch = (p, win = true) => p.evaluate((w) => { window.__rottami.start = (o) => { setTimeout(() => o.done ? o.done({ a: w ? 2 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} }) : o.onDone({ a: w ? 2 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} }), 30); return true; }; }, win);
async function reach(page, zid) {
  await page.evaluate(([k, z]) => { eval(k).enterZone(z); }, [K_, zid]); await page.waitForTimeout(450);
  return page.evaluate((zid) => {
    const D = window.__cenere._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
    const npcs = (z.npcs || []).filter((n) => !n.ghost).map((n) => n.at), seen = T.bfs(m, z, st[0], st[1], npcs);
    const adj = (x, y) => [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
    (spec.items || []).forEach(([x, y]) => { if (T.solidAt(m, z, x, y) || !(seen[y] && seen[y][x])) bad.push("oggetto " + x + "," + y); });
    for (let s = 0; s <= 3; s++) (spec.npcs ? spec.npcs(s) : []).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at); });
    for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) if (m[y][x] === "q" && !adj(x, y)) bad.push("porta " + x + "," + y);
    return bad;
  }, zid);
}
async function storia(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__cenere.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  const chk = async (n, v, why) => { const s = (await info(page)).step[n] || 0; if (s !== v) errors.push(why + ": step " + s + " invece di " + v); };
  await mockMatch(page, true);
  const zones = { 1: ["ce_villaggio", "ce_bunker"], 2: ["ce_strada", "ce_oasi"], 3: ["ce_cratere", "ce_torre"] };
  const goEnter = async (z) => { await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, z]); await page.waitForTimeout(400); };
  for (const z of zones[1]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("ce_villaggio"); if (w === 390) await L.shot(page, "ce_villaggio");
  await L.talk(page, "ce_brace"); await L.advance(page); await chk(1, 1, "Brace c1");
  await L.talk(page, "ce_tamburo"); await L.advance(page); await chk(1, 2, "Tamburo c1");
  await L.talk(page, "ce_cenere"); await L.advance(page);
  await goEnter("ce_bunker"); await L.talk(page, "ce_selce"); await L.advance(page); await chk(1, 3, "Selce c1");
  await L.talk(page, "ce_dente"); await L.advance(page, [/Gioca al Campo di Rottami/]);
  { const i = await info(page); if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch])); }
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "ce_strada") errors.push("cap.2 non parte dalla strada: " + (await L.zone(page)));
  for (const z of zones[2]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("ce_strada"); if (w === 390) await L.shot(page, "ce_strada");
  await L.talk(page, "ce_tamburo"); await L.advance(page, [/Dividi quasi tutto/]); await chk(2, 1, "Tamburo c2");
  await goEnter("ce_oasi"); await L.talk(page, "ce_selce"); await L.advance(page, [/Riempi quanto basta/]); await chk(2, 2, "Selce c2");
  await L.talk(page, "ce_predicatore"); await L.advance(page); await chk(2, 3, "Predicatore c2");
  await L.talk(page, "ce_predicatore"); await L.advance(page, [/Gioca al Campo di Rottami/]);
  { const i = await info(page); if (!i.done[2] || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.ch])); }
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if ((await L.zone(page)) !== "ce_cratere") errors.push("cap.3 non parte dal cratere: " + (await L.zone(page)));
  for (const z of zones[3]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("ce_cratere"); if (w === 390) await L.shot(page, "ce_cratere");
  await L.talk(page, "ce_selce"); await L.advance(page); await chk(3, 1, "Selce c3");
  await L.talk(page, "ce_tamburo"); await L.advance(page, [/Aiutarlo a riparare/]); await chk(3, 2, "Tamburo c3");
  await L.talk(page, "ce_brace"); await L.advance(page);
  await goEnter("ce_torre"); await L.talk(page, "ce_predicatore"); await L.advance(page); await chk(3, 3, "Predicatore c3");
  await L.talk(page, "ce_predicatore"); await L.advance(page, [/Gioca al Campo di Rottami/]); await chk(3, 4, "ultima partita");
  const fin = async (kind, pref) => {
    await page.evaluate(([k]) => { const K = eval(k); K.setStep(3, 4); K.enterZone("ce_torre"); }, [K_]);
    await page.waitForTimeout(450); await L.talk(page, "ce_predicatore"); await L.advance(page, [pref]);
    const i = await info(page); if (!i.ends.includes(kind) || i.done[3] !== kind) errors.push("finale " + kind + ": " + JSON.stringify([i.done, i.ends]));
  };
  // il finale segreto non compare senza legami, speranza e borracce
  await page.evaluate(([k]) => { const K = eval(k); K.bond("legami", -99); K.bond("speranza", -99); K.setStep(3, 4); K.enterZone("ce_torre"); }, [K_]);
  await page.waitForTimeout(450); await L.talk(page, "ce_predicatore");
  { const has = await page.evaluate(() => /Fidati di tutti/.test(document.body.innerText)); if (has) errors.push("finale segreto visibile senza i requisiti"); await L.advance(page, [/Dividi il pallone/]); const i = await info(page); if (i.done[3] !== "pace") errors.push("finale pace: " + JSON.stringify(i.done)); }
  await fin("solitaria", /Riprendi la strada/); await fin("reliquia", /Lascia il pallone/);
  await page.evaluate(([k]) => { const K = eval(k); K.bond("legami", 99); K.bond("speranza", 99); K.bond("borraccia", 9); }, [K_]);
  await fin("segreto", /Fidati di tutti/);
  { const i = await info(page); if (!i.ends.includes("pace") && !i.ends.includes("solitaria")) errors.push("finali: " + JSON.stringify(i.ends)); if (i.ends.length < 3) errors.push("finali pochi: " + JSON.stringify(i.ends)); }
  L.check(`Cenere e Gloria · tre capitoli e finali (${w} px)`, errors); await browser.close();
}
// il motore: partite intere a pilota automatico, con punteggi plausibili
async function motore() {
  const { browser, page, errors } = await L.setup({ ...MOD });
  const r = await page.evaluate(async () => {
    const out = []; for (let k = 0; k < 8; k++) { let res = null; window.__rottami.start({ auto: true, fast: true, oppNames: ["Dente", "Saccheggiatori"], mate: "Tamburo", bonus: k > 5 ? { at: 2, df: 2, te: 2 } : null, onDone: (x) => { res = x; } });
      for (let i = 0; i < 300 && !res; i++) await new Promise((r) => setTimeout(r, 50)); out.push(res ? [res.a, res.b, res.win] : null); if (!res) { window.__rottami.state.finish(); } }
    return out; });
  if (r.some((x) => !x)) errors.push("partita non conclusa: " + JSON.stringify(r));
  const ok = r.filter(Boolean), tot = ok.reduce((n, [a, b]) => n + a + b, 0);
  if (tot === 0) errors.push("mai un punto in 8 partite: " + JSON.stringify(r));
  if (ok.every((x) => x[2])) errors.push("il bot vince sempre: " + JSON.stringify(r));
  if (ok.every((x) => !x[2])) errors.push("il bot non vince mai: " + JSON.stringify(r));
  console.log("  punteggi:", JSON.stringify(r.map((x) => x && [x[0], x[1]])));
  L.check("Campo di Rottami · partite a pilota automatico", errors); await browser.close();
}
(async () => { await storia(390); await storia(320); await motore(); })().catch((e) => { console.error("✗ cenere:", e.message); process.exit(1); });
