// tests/naufraghi.cjs - «Naufraghi del Pallone»: l'orologio dell'isola (giorno, notte, marea che cambiano la mappa), il motore Marea
// (celle che si allagano, passaggi, tiri, pedane), i 3 capitoli, i finali e il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__naufraghi", key: "ali-di-rondine.naufraghi" };
const K_ = "window.__naufraghi._dbg.K";
const info = (p) => L.info(p);
const clock = (p, f) => p.evaluate((f) => window.__naufraghi.clock.congela(f), f);
// raggiungibilità con l'orologio fermo su più fasi: ogni cosa deve essere raggiungibile in almeno una (le secche e le pietre aprono altre zone)
async function reachMondo(page, zid, fasi = ["giorno", "notte"]) {
  const union = new Set(); let start = null, all = null;
  for (const f of fasi) {
    await clock(page, f);
    await page.evaluate(([k, z]) => { eval(k).enterZone(z); }, [K_, zid]); await page.waitForTimeout(450);
    const r = await page.evaluate((zid) => {
      const D = window.__naufraghi._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, npcs = (z.npcs || []).filter((n) => !n.ghost).map((n) => n.at);
      const seen = T.bfs(m, z, st[0], st[1], npcs), adj = (x, y) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
      const ok = new Set(); const bad = [];
      (spec.items || []).forEach(([x, y]) => { if (seen[y] && seen[y][x]) ok.add("goccia " + x + "," + y); });
      for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) { const c = m[y][x]; if (z.act[c] && "_zQ".indexOf(c) < 0 && "tjyaewfcdo".indexOf(c) < 0 && c !== "t" && (adj(x, y) || (seen[y] && seen[y][x]))) ok.add("oggetto " + c + " " + x + "," + y); }
      (spec.npcs ? spec.npcs(99).concat(spec.npcs(0), spec.npcs(2), spec.npcs(4)) : []).forEach((n) => { if (adj(n.at[0], n.at[1])) ok.add("png " + n.id + " " + n.at); if (T.solidAt(m, z, n.at[0], n.at[1])) bad.push("png su solido " + n.id + " " + n.at); });
      if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
      const all = new Set(); (spec.items || []).forEach(([x, y]) => all.add("goccia " + x + "," + y));
      for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) { const c = m[y][x]; if (z.act[c] && "_zQ".indexOf(c) < 0 && "tjyaewfcdo".indexOf(c) < 0 && c !== "t") all.add("oggetto " + c + " " + x + "," + y); }
      (spec.npcs ? spec.npcs(99).concat(spec.npcs(0), spec.npcs(2), spec.npcs(4)) : []).forEach((n) => all.add("png " + n.id + " " + n.at));
      return { ok: [...ok], all: [...all], bad };
    }, zid);
    r.ok.forEach((x) => union.add(x)); all = r.all; if (r.bad.length) return r.bad;
  }
  await clock(page, null);
  return (all || []).filter((x) => !union.has(x));
}
// le pagine del Giornale di Bordo e simili si chiudono da sole (il test non deve leggerle)
const autoPag = (p) => p.evaluate(() => { if (window.__autoPag) return; window.__autoPag = setInterval(() => { const b = document.querySelector(".nfPag button"); if (b) b.click(); }, 120); });
const pick = async (p, re) => { await p.waitForTimeout(150); const r = await p.evaluate((re) => window.T_.click(re), re); await p.waitForTimeout(250); return r; };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await autoPag(page); await page.evaluate(() => window.__naufraghi.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  await clock(page, "giorno");
  if (w === 390) await L.shot(page, "nf_spiaggia");
  { const bad = await reachMondo(page, "nf_spiaggia"); if (bad.length) errors.push("nf_spiaggia irraggiungibile: " + bad.join(", ")); }
  const step = async () => (await info(page)).step;
  const chk = async (n, why) => { const st = await step(); if ((st[1] || 0) !== n) errors.push(why + ": step " + JSON.stringify(st)); };
  // prima di parlare con la Capitana: Salvi e Gaspare rimandano
  await L.talk(page, "nf_salvi"); await L.advance(page); await L.talk(page, "nf_gaspare"); await L.advance(page); await chk(0, "PNG prima della Capitana");
  await L.talk(page, "nf_bora"); await L.advance(page); await chk(1, "dopo la Capitana");
  await L.talk(page, "nf_salvi"); await L.advance(page); await L.talk(page, "nf_salvi"); await L.advance(page);
  await L.talk(page, "nf_gaspare"); await L.advance(page, [/Parti uguali, e tu/]); await chk(2, "dopo Salvi e Gaspare");
  if (await page.evaluate((k) => eval(k).F.get("nf_razioni"), K_) !== "registro") errors.push("scelta razioni non registrata");
  // la giungla (prima di aver cercato il cappellino non si prende)
  await L.goAct(page, 33, 12); await L.advance(page); if ((await L.zone(page)) !== "nf_giungla") errors.push("non si entra nella giungla: " + (await L.zone(page)));
  await clock(page, "giorno");
  { const bad = await reachMondo(page, "nf_giungla"); if (bad.length) errors.push("nf_giungla irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "nf_giungla");
  await L.goAct(page, 15, 4); await L.advance(page);
  await L.goAct(page, 29, 10); await L.advance(page); if ((await L.zone(page)) !== "nf_giungla") errors.push("il sentiero a est si apre troppo presto");
  await L.goAct(page, 21, 7); await L.advance(page); await chk(3, "dopo il cappellino");
  await L.goAct(page, 0, 12); await L.advance(page); if ((await L.zone(page)) !== "nf_spiaggia") errors.push("non si torna alla spiaggia");
  // la radio non risponde di giorno, la partita non parte prima del rapporto
  await clock(page, "giorno");
  await L.goAct(page, 15, 11); await L.advance(page); await chk(3, "radio di giorno");
  await L.talk(page, "nf_gaspare"); await L.advance(page, ["Dopo"]); await chk(3, "partitella prima del rapporto");
  await L.talk(page, "nf_bora"); await L.advance(page);
  await page.evaluate(() => { window.__marea.start = (o) => { setTimeout(() => o.onDone({ a: 2, b: 1, win: true, quit: false, data: {} }), 30); return true; }; });
  await L.talk(page, "nf_gaspare"); await L.advance(page, [/Giochiamo a Marea/]); await chk(4, "dopo la partitella");
  await clock(page, "notte");
  await L.goAct(page, 15, 11); await L.advance(page, [/Chi sei/]);
  { const i = await info(page); if (!i.done[1] || i.step[1] !== 5 || i.ends.length) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step, i.ends])); if (i.ch !== 2) errors.push("il capitolo 2 non si apre: " + i.ch); }
  L.check(`Naufraghi del Pallone · capitolo 1 (${w} px)`, errors); await browser.close();
}
// il motore Marea: regole, comandi veri (tocco, trascinamento, pedana), tastiera, partita intera a pilota automatico, fine
async function marea(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => { window.__done = null; window.__marea.start({ title: "Prova", us: "Rondine", opp: { name: "Gabbiani", color: "#e11d48" }, onDone: (r) => { window.__done = r; } }); });
  await page.waitForSelector(".mrOv .goB");
  if (w === 390) await L.shot(page, "marea_regole");
  const fit = await page.evaluate(() => { const c = document.querySelector(".mrOv .card").getBoundingClientRect(); return { r: c.right, w: innerWidth }; });
  if (fit.r > fit.w + 1) errors.push("regole fuori dallo schermo a destra");
  await page.click(".mrOv .goB"); await page.waitForTimeout(500);
  const cvb = await page.evaluate(() => { const r = document.querySelector("#mrCv").getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  if (cvb[3] < 100 || cvb[2] > 521) errors.push("canvas storto " + cvb);
  await page.waitForTimeout(1500);
  const st = () => page.evaluate(() => { const S = window.__marea.state; return S && { car: S.ball.car && S.ball.car.team + S.ball.car.name, ped: S.data.pedane, ch: S.charges, pass: S.data.passaggi || 0, tiri: S.data.tiri || 0, a: S.a, b: S.b, over: S.over, hero: [S.P[0].x, S.P[0].y], mate: [S.P[1].x, S.P[1].y] }; });
  const px = (x, y) => [cvb[0] + ((x + 10) / 320) * cvb[2], cvb[1] + ((y + 14) / 200) * cvb[3]];
  let s0 = await st(); const [cx, cy] = px(45, 150); await page.mouse.click(cx, cy); await page.waitForTimeout(200);
  let s1 = await st(); if (!(s1.ped > s0.ped)) errors.push("tocco su cella non alza la pedana " + JSON.stringify([s0.ped, s1.ped]));
  await page.evaluate(() => { const S = window.__marea.state; S.pause = 0; const c = S.P[0]; c.x = 150; c.y = 90; S.P[1].x = 180; S.P[1].y = 40; S.ball.prot = 9; S.ball.car = c; S.ball.who = c; S.ball.last = 0; });
  await page.waitForTimeout(80);
  const m = await st(); const [mx, my] = px(m.mate[0], m.mate[1]); await page.mouse.click(mx, my); await page.waitForTimeout(150);
  let s2 = await st(); if (!(s2.pass > s1.pass)) errors.push("tocco su compagno non passa " + JSON.stringify(s2));
  await page.evaluate(() => { const S = window.__marea.state; const c = S.P[0]; c.x = 200; c.y = 90; S.ball.prot = 9; S.ball.car = c; S.ball.who = c; S.ball.last = 0; });
  await page.waitForTimeout(60);
  const h = await st(); const [hx, hy] = px(h.hero[0], h.hero[1]); await page.mouse.move(hx, hy + 20); await page.mouse.down(); await page.mouse.move(hx + 40, hy + 22, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150);
  let s3 = await st(); if (!(s3.tiri > s2.tiri)) errors.push("trascinamento non tira " + JSON.stringify(s3));
  await page.keyboard.press("ArrowRight"); await page.keyboard.press("Space"); await page.waitForTimeout(100);
  if (!(await st())) errors.push("la partita è sparita dopo la tastiera");
  await page.evaluate(() => { const S = window.__marea.state; S.t = 62; S.pause = 0; }); await page.waitForTimeout(2500); if (w === 390) await L.shot(page, "marea_gioco");
  await page.evaluate(() => { const S = window.__marea.state; S.autoPilot = true; S.charges = 3; });
  await page.evaluate(() => new Promise((res) => { const S = window.__marea.state, M = window.__marea; let n = 0; const iv = setInterval(() => { for (let i = 0; i < 90 && !S.over; i++) M.step(S, 1 / 60); n++; if (S.over || n > 400) { clearInterval(iv); if (S.over && !S.res) S.finish(false); res(); } }, 5); }));
  await page.waitForSelector(".mrOv .goB", { timeout: 15000 }); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "marea_fine");
  const sc = await page.evaluate(() => { const S = window.__marea.state; return S && [S.a, S.b]; });
  if (!sc || sc[0] === sc[1] || sc[0] > 9 || sc[1] > 9) errors.push("risultato strano " + JSON.stringify(sc));
  await page.click(".mrOv .goB"); await page.waitForTimeout(300);
  const dn = await page.evaluate(() => window.__done); if (!dn || typeof dn.a !== "number" || typeof dn.win !== "boolean") errors.push("onDone non chiamato bene " + JSON.stringify(dn));
  if (await page.evaluate(() => !!document.querySelector(".mrOv"))) errors.push("overlay ancora aperto");
  await page.evaluate(() => { window.__done = null; window.__marea.start({ onDone: (r) => { window.__done = r; } }); }); await page.waitForSelector(".mrOv .goB"); await page.click(".mrOv .goB"); await page.waitForTimeout(300);
  await page.click(".mrOv .quit"); await page.waitForSelector(".mrOv .goB"); await page.click(".mrOv .goB"); await page.waitForTimeout(200);
  const q = await page.evaluate(() => window.__done); if (!q || !q.quit) errors.push("uscita non registrata " + JSON.stringify(q));
  L.check(`Marea (${w} px)`, errors); await browser.close();
}
(async () => { await marea(390); await marea(320); await c1(390); await c1(320); })().catch((e) => { console.error("✗ naufraghi:", e.stack); process.exit(1); });
