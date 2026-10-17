// tests/quattordici.cjs - «Il Torneo dei Quattordici»: zone raggiungibili, calendario a fasce (K.clock), tre giorni giocati,
// quattro finali (uno segreto) e il motore Zona Rossa a pilota automatico
const L = require("./lib.cjs");
const MOD = { mod: "__quattordici", key: "ali-di-rondine.quattordici" };
const K_ = "window.__quattordici._dbg.K";
const info = (p) => L.info(p);
const mockMatch = (p, win = true) => p.evaluate((w) => { window.__zonarossa.start = (o) => { setTimeout(() => o.done ? o.done({ a: w ? 3 : 0, b: w ? 1 : 3, win: w, quit: false, data: {} }) : o.onDone({ a: w ? 3 : 0, b: w ? 1 : 3, win: w, quit: false, data: {} }), 30); return true; }; }, win);
const clk = (p) => p.evaluate((k) => { const c = eval(k).clock; return [c.day(), c.name()]; }, K_);
const stat = (p, s) => p.evaluate(([k, s]) => eval(k).stat(s), [K_, s]);
async function reach(page, zid) {
  await page.evaluate(([k, z]) => { eval(k).enterZone(z); }, [K_, zid]); await page.waitForTimeout(450);
  return page.evaluate((zid) => {
    const D = window.__quattordici._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
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
  await page.evaluate(() => window.__quattordici.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  const chk = async (n, v, why) => { const s = (await info(page)).step[n] || 0; if (s !== v) errors.push(why + ": step " + s + " invece di " + v); };
  const ck = async (day, slot, why) => { const c = await clk(page); if (c[0] !== day || c[1] !== slot) errors.push(why + ": orologio " + JSON.stringify(c) + " invece di " + day + " " + slot); };
  await mockMatch(page, true);
  const goEnter = async (z) => { await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, z]); await page.waitForTimeout(400); await L.advance(page); };
  const zones = { 1: ["qt_atrio", "qt_stadio"], 2: ["qt_giardino", "qt_archivio"], 3: ["qt_alanord", "qt_sipario"] };

  // ---- giorno 1
  for (const z of zones[1]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("qt_atrio"); if (w === 390) await L.shot(page, "qt_atrio");
  await ck(1, "Mattina", "avvio giorno 1");
  await L.talk(page, "qt_teo"); await L.advance(page); await chk(1, 0, "Teo prima del briefing");
  await L.talk(page, "qt_ilse"); await L.advance(page); await chk(1, 1, "Ilse c1");
  await L.talk(page, "qt_ilse"); await L.advance(page, [/Allenarsi con Ilse/]); await ck(1, "Pomeriggio", "dopo l'attività del mattino");
  if ((await stat(page, "forma")) !== 1) errors.push("la forma non sale dopo l'allenamento");
  await L.talk(page, "qt_ilse"); await L.advance(page); await ck(1, "Pomeriggio", "il pomeriggio non consuma tempo senza la partita");
  await goEnter("qt_stadio"); if (w === 390) await L.shot(page, "qt_stadio");
  await L.talk(page, "qt_banditore"); await L.advance(page, [/Gioca contro i Fenicotteri/]); await chk(1, 2, "partita c1"); await ck(1, "Sera", "dopo la partita");
  await goEnter("qt_atrio");
  { const gone = await page.evaluate(() => !window.T_.npcAt("qt_teo")); if (!gone) errors.push("Teo è ancora nell'atrio dopo l'eliminazione"); }
  await L.talk(page, "qt_ilse"); await L.advance(page, [/Chiederle del suo passato/]);
  { const lv = await page.evaluate((k) => eval(k).rel.lv("qt_ilse"), K_); if (lv !== 1) errors.push("rapporto con Ilse dopo il giorno 1: livello " + lv + " invece di 1"); }
  { const i = await info(page); if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch])); if ((await stat(page, "squadre")) !== 7) errors.push("squadre dopo la notte 1: " + (await stat(page, "squadre"))); }

  // ---- giorno 2
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "qt_giardino") errors.push("cap.2 non parte dal giardino: " + (await L.zone(page)));
  await ck(2, "Mattina", "avvio giorno 2");
  for (const z of zones[2]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("qt_giardino"); if (w === 390) await L.shot(page, "qt_giardino");
  await L.talk(page, "qt_ilse"); await L.advance(page); await chk(2, 1, "Ilse c2 (scena del rapporto, poi il briefing)");
  { const seen = await page.evaluate((k) => eval(k).F.get("relsc_ilse1"), K_); if (!seen) errors.push("scena di rapporto Ilse livello 1 non vista"); }
  await goEnter("qt_archivio"); if (w === 390) await L.shot(page, "qt_archivio");
  await L.talk(page, "qt_luce"); await L.advance(page, [/Leggere il registro/]); await ck(2, "Pomeriggio", "Luce di mattina");
  await goEnter("qt_giardino"); await L.talk(page, "qt_banditore"); await L.advance(page, [/Gioca contro i Gufi/]); await chk(2, 2, "partita c2"); await ck(2, "Sera", "dopo la partita 2");
  await goEnter("qt_archivio"); await L.talk(page, "qt_luce"); await L.advance(page, [/Leggere il registro/]);
  { const i = await info(page); if (!i.done[2] || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.ch])); if ((await stat(page, "squadre")) !== 2) errors.push("squadre dopo la notte 2: " + (await stat(page, "squadre"))); }
  { const key = await page.evaluate((k) => eval(k).F.get("qt_chiave"), K_); if (!key) errors.push("la chiave di Luce non è stata consegnata"); }

  // ---- giorno 3
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if ((await L.zone(page)) !== "qt_alanord") errors.push("cap.3 non parte dall'Ala Nord: " + (await L.zone(page)));
  await ck(3, "Mattina", "avvio giorno 3");
  for (const z of zones[3]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await goEnter("qt_alanord"); if (w === 390) await L.shot(page, "qt_alanord");
  await L.talk(page, "qt_ilse"); await L.advance(page); await chk(3, 1, "Ilse c3");
  await L.talk(page, "qt_corvo"); await L.advance(page, [/Parlare con Corvo/]); await ck(3, "Pomeriggio", "Corvo di mattina");
  await goEnter("qt_sipario"); if (w === 390) await L.shot(page, "qt_sipario");
  await L.talk(page, "qt_banditore"); await L.advance(page, [/Gioca contro i Corvi/]); await chk(3, 2, "finale"); await ck(3, "Sera", "dopo la finale");

  const fin = async (kind, pref) => {
    await page.evaluate(([k]) => { const K = eval(k); K.setStep(3, 2); K.clock.set(3, 2); K.enterZone("qt_sipario"); }, [K_]);
    await page.waitForTimeout(450); await L.advance(page); await L.talk(page, "qt_sfinge"); await L.advance(page, [pref]);
    const i = await info(page); if (!i.ends.includes(kind) || i.done[3] !== kind) errors.push("finale " + kind + ": " + JSON.stringify([i.done, i.ends]));
  };
  // il finale segreto non compare senza alleanze e verità, quello della rivolta senza la chiave
  await page.evaluate(([k]) => { const K = eval(k); K.bond("alleanze", -99); K.bond("verita", -99); K.F.set("qt_chiave", false); K.setStep(3, 2); K.clock.set(3, 2); K.enterZone("qt_sipario"); }, [K_]);
  await page.waitForTimeout(450); await L.advance(page); await L.talk(page, "qt_sfinge");
  { const t = await page.evaluate(() => document.body.innerText); if (/libertà di tutti/.test(t)) errors.push("finale segreto visibile senza i requisiti"); if (/Smaschera il Banditore/.test(t)) errors.push("rivolta visibile senza la chiave"); await L.advance(page, [/Prendi il Premio/]); const i = await info(page); if (i.done[3] !== "sipario") errors.push("finale sipario: " + JSON.stringify(i.done)); }
  await fin("patto", /Prendi il posto del Banditore/);
  await page.evaluate(([k]) => { eval(k).F.set("qt_chiave", true); }, [K_]);
  await fin("rivolta", /Smaschera il Banditore/);
  await page.evaluate(([k]) => { const K = eval(k); K.bond("alleanze", 99); K.bond("verita", 99); }, [K_]);
  await fin("quattordici", /libertà di tutti/);
  { const i = await info(page); if (i.ends.length < 4) errors.push("finali pochi: " + JSON.stringify(i.ends)); }
  L.check(`Il Torneo dei Quattordici · tre giorni e finali (${w} px)`, errors); await browser.close();
}
// il motore: partite intere a pilota automatico (due livelli di bravura), punteggi plausibili e fasce che chiudono
async function motore() {
  const { browser, page, errors } = await L.setup({ ...MOD });
  const r = await page.evaluate(async () => {
    const out = [];
    for (let i = 0; i < 14; i++) {
      const strong = i >= 7; let res = null;
      window.__zonarossa.start({ auto: true, fast: true, autoLvl: strong ? 0.95 : 0.62, bonus: strong ? { at: 3, df: 3, te: 3 } : null, onDone: (x) => { res = x; } });
      for (let j = 0; j < 400 && !res; j++) await new Promise((q) => setTimeout(q, 40));
      out.push(res ? [res.a, res.b, res.win] : null); if (!res) window.__zonarossa.state.finish(false);
    }
    return out;
  });
  if (r.some((x) => !x)) errors.push("partita non conclusa: " + JSON.stringify(r));
  const ok = r.filter(Boolean), tot = ok.reduce((n, [a, b]) => n + a + b, 0);
  if (tot === 0) errors.push("mai un punto in 14 partite: " + JSON.stringify(r));
  if (ok.every((x) => x[2])) errors.push("il bot vince sempre: " + JSON.stringify(r));
  if (ok.every((x) => !x[2])) errors.push("il bot non vince mai: " + JSON.stringify(r));
  console.log("  punteggi:", JSON.stringify(r.map((x) => x && [x[0], x[1]])));
  L.check("Zona Rossa · partite a pilota automatico", errors); await browser.close();
}
(async () => { await storia(390); await storia(320); await motore(); })().catch((e) => { console.error("✗ quattordici:", e.message); process.exit(1); });
