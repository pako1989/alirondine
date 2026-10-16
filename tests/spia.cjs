// tests/spia.cjs - «Operazione Doppio Zero»: raggiungibilità delle zone, tre capitoli giocati, quattro finali, motore Pok-ta-pok a pilota automatico
const L = require("./lib.cjs");
const MOD = { mod: "__spia", key: "ali-di-rondine.spia" };
const K_ = "window.__spia._dbg.K";
const info = (p) => L.info(p);
const mockMatch = (p, win = true) => p.evaluate((w) => { window.__spiaMatch.start = (o) => { setTimeout(() => o.done ? o.done({ a: w ? 3 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} }) : o.onDone({ a: w ? 3 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} }), 30); return true; }; }, win);
async function reach(page, zid) {
  await page.evaluate(([k, z]) => { eval(k).enterZone(z); }, [K_, zid]); await page.waitForTimeout(450);
  return page.evaluate((zid) => {
    const D = window.__spia._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
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
  await page.evaluate(() => window.__spia.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  const chk = async (n, v, why) => { const s = (await info(page)).step[n] || 0; if (s !== v) errors.push(why + ": step " + s + " invece di " + v); };
  await mockMatch(page, true);
  const zones = { 1: ["dz_casino", "dz_salavip"], 2: ["dz_chalet", "dz_neve"], 3: ["dz_base", "dz_bunker"] };
  const goEnter = async (z) => { await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, z]); await page.waitForTimeout(400); };
  for (const z of zones[1]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("dz_casino"); if (w === 390) await L.shot(page, "dz_casino");
  await L.talk(page, "dz_sterling"); await L.advance(page); await chk(1, 1, "Sterling c1");
  await L.talk(page, "dz_croupier"); await L.advance(page); await chk(1, 2, "Felix c1");
  await L.talk(page, "dz_guard1"); await L.advance(page);
  await goEnter("dz_salavip"); await L.talk(page, "dz_eva"); await L.advance(page, [/Sfida al Tavolo Royale/]);
  { const i = await info(page); if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch])); }
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "dz_chalet") errors.push("cap.2 non parte dallo chalet: " + (await L.zone(page)));
  for (const z of zones[2]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("dz_chalet");
  await L.talk(page, "dz_eva"); await L.advance(page); await chk(2, 1, "Eva c2");
  await L.talk(page, "dz_colbacco"); await L.advance(page); await chk(2, 2, "Boris c2");
  await L.talk(page, "dz_guard_neve"); await L.advance(page);
  await goEnter("dz_neve"); await L.talk(page, "dz_sterling"); await L.advance(page, [/Sfida al Tavolo/]);
  { const i = await info(page); if (!i.done[2] || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.ch])); }
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if ((await L.zone(page)) !== "dz_base") errors.push("cap.3 non parte dalla base: " + (await L.zone(page)));
  for (const z of zones[3]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("dz_base"); if (w === 390) await L.shot(page, "dz_base");
  await L.talk(page, "dz_eva"); await L.advance(page); await chk(3, 1, "Eva c3");
  await L.talk(page, "dz_guard_base"); await L.advance(page); await chk(3, 2, "Sentinella c3");
  await goEnter("dz_bunker"); await L.talk(page, "dz_kalt"); await L.advance(page, [/Sfida al Tavolo Royale/, /Consegna il dossier/]);
  { const i = await info(page); if (!i.ends.includes("diplomatico")) errors.push("finale dopo la partita: " + JSON.stringify(i.ends)); }
  const bugs = await page.evaluate(([k]) => eval(k).F.get("dz_bug_count"), [K_]); if (bugs !== 6) errors.push("microspie: " + bugs + " invece di 6");
  const fin = async (kind, pref) => {
    await page.evaluate(([k]) => { const K = eval(k); K.setStep(3, 3); K.enterZone("dz_bunker"); }, [K_]);
    await page.waitForTimeout(450); await L.talk(page, "dz_kalt"); await L.advance(page, [pref]);
    const i = await info(page); if (!i.ends.includes(kind) || i.done[3] !== kind) errors.push("finale " + kind + ": " + JSON.stringify([i.done, i.ends]));
  };
  await fin("diplomatico", /Consegna il dossier/); await fin("ombra", /Svanisci nella notte/); await fin("spettacolo", /Fai saltare il banco/); await fin("segreto", /Protocollo Segreto/);
  { const i = await info(page); if (i.ends.length !== 4) errors.push("finali: " + JSON.stringify(i.ends)); }
  L.check(`Operazione Doppio Zero · tre capitoli e quattro finali (${w} px)`, errors); await browser.close();
}
async function motore() {
  const { browser, page, errors } = await L.setup({ ...MOD });
  const r = await page.evaluate(async () => {
    const out = [];
    for (let k = 0; k < 8; k++) {
      let res = null;
      window.__spiaMatch.start({ auto: true, fast: true, targetGoals: 2, turns: 6, bonus: k > 3 ? { at: 2, df: 2, te: 2 } : null, opp: { name: "Croupier", color: "#e11d48" }, onDone: (x) => { res = x; } });
      for (let i = 0; i < 400 && !res; i++) await new Promise((q) => setTimeout(q, 50));
      out.push(res ? [res.a, res.win] : null);
      if (!res) { const st = window.__spiaMatch.state; if (st) st.finish(false); }
    }
    return out;
  });
  if (r.some((x) => !x)) errors.push("partita non conclusa: " + JSON.stringify(r));
  const goals = r.filter(Boolean).reduce((n, [a]) => n + a, 0), wins = r.filter((x) => x && x[1]).length;
  if (goals === 0) errors.push("mai un gol in 8 partite: " + JSON.stringify(r));
  if (wins === 8) errors.push("vinte tutte: troppo facile " + JSON.stringify(r));
  console.log("  gol/vittorie:", JSON.stringify(r));
  L.check("Tavolo da Gioco · partite a pilota automatico", errors); await browser.close();
}
(async () => { await storia(390); await motore(); })().catch((e) => { console.error("✗ spia:", e.message); process.exit(1); });
