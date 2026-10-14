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
  const chk2 = async (n, why) => { const st = await step(); if ((st[2] || 0) !== n) errors.push(why + ": step " + JSON.stringify(st)); };
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
  // ------------------------------------------------------------ capitolo 2
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "nf_spiaggia") errors.push("cap.2: non parte dalla spiaggia: " + (await L.zone(page)));
  await clock(page, "giorno");
  await L.talk(page, "nf_bora"); await L.advance(page); await chk2(1, "Bora cap.2");
  await L.talk(page, "nf_salvi"); await L.advance(page); await L.talk(page, "nf_gaspare"); await L.advance(page);
  await L.goAct(page, 33, 12); await L.advance(page); await L.goAct(page, 29, 10); await L.advance(page);
  if ((await L.zone(page)) !== "nf_laguna") errors.push("non si arriva alla laguna: " + (await L.zone(page)));
  await clock(page, "giorno"); await page.waitForTimeout(700);
  { const bad = await reachMondo(page, "nf_laguna"); if (bad.length) errors.push("nf_laguna irraggiungibile: " + bad.join(", ")); }
  await clock(page, "giorno"); await page.waitForTimeout(700);
  if (w === 390) await L.shot(page, "nf_laguna_giorno");
  await L.goAct(page, 5, 7); await L.advance(page); await chk2(2, "camera di Tobia");
  await clock(page, "notte"); await page.waitForTimeout(800);
  if (w === 390) await L.shot(page, "nf_laguna_notte");
  await L.talk(page, "nf_tobia"); await L.advance(page, [/Camera spenta/]); await chk2(3, "Tobia sull'isolotto");
  if ((await page.evaluate((k) => eval(k).F.get("nf_riprese"), K_)) !== false) errors.push("scelta riprese non registrata");
  await clock(page, "giorno"); await page.waitForTimeout(800);
  await L.goAct(page, 35, 10); await L.advance(page);
  if ((await L.zone(page)) !== "nf_faro") errors.push("non si arriva al faro: " + (await L.zone(page)));
  await clock(page, "giorno");
  { const bad = await reachMondo(page, "nf_faro"); if (bad.length) errors.push("nf_faro irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "nf_faro");
  await L.goAct(page, 14, 9); await L.advance(page); if ((await L.zone(page)) !== "nf_faro") errors.push("la porta del faro si apre troppo presto");
  await L.talk(page, "nf_scoglio"); await L.advance(page); await chk2(3, "Scoglio prima di Fiorenzo");
  await L.talk(page, "nf_fiorenzo"); await L.advance(page);
  await page.evaluate(() => { window.__W = false; window.__marea.start = (o) => { setTimeout(() => o.onDone({ a: window.__W ? 2 : 0, b: window.__W ? 1 : 2, win: window.__W, quit: false, data: {} }), 30); return true; }; });
  await L.talk(page, "nf_scoglio"); await L.advance(page, [/Accetto la sfida/]); await chk2(3, "dopo la sfida persa");
  await page.evaluate(() => { window.__W = true; });
  await L.talk(page, "nf_scoglio"); await L.advance(page, [/Accetto la sfida/]); await chk2(4, "dopo la sfida vinta");
  await L.goAct(page, 14, 9); await L.advance(page); if ((await L.zone(page)) !== "nf_radio") errors.push("non si entra nel faro: " + (await L.zone(page)));
  await clock(page, "giorno");
  { const bad = await reachMondo(page, "nf_radio", ["giorno"]); if (bad.length) errors.push("nf_radio irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "nf_radio");
  await L.talk(page, "nf_fiorenzo"); await L.advance(page); await L.talk(page, "nf_tobia"); await L.advance(page);
  await L.goAct(page, 7, 2); await L.advance(page, [/Cosa ti serve/]);
  { const i = await info(page); if (!i.done[2] || i.done[2] !== "ascolto" || i.step[2] !== 5 || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step, i.ch])); }
  // ------------------------------------------------------------ capitolo 3
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  const chk3 = async (n, why) => { const st = await step(); if ((st[3] || 0) !== n) errors.push(why + ": step " + JSON.stringify(st)); };
  await clock(page, "giorno");
  await L.talk(page, "nf_bora"); await L.advance(page); await chk3(1, "Bora cap.3");
  await L.talk(page, "nf_gaspare"); await L.advance(page, [/Costruiamola/]);
  if (!(await page.evaluate((k) => eval(k).F.is("nf_zattera"), K_))) errors.push("zattera non registrata");
  await L.talk(page, "nf_salvi"); await L.advance(page);
  await L.goAct(page, 33, 12); await L.advance(page); await L.goAct(page, 29, 10); await L.advance(page);
  await clock(page, "giorno"); await page.waitForTimeout(800);
  await L.goAct(page, 35, 10); await L.advance(page); await clock(page, "giorno");
  await L.goAct(page, 23, 12); await L.advance(page);
  await L.goAct(page, 29, 5); await L.advance(page); if ((await L.zone(page)) !== "nf_scogliera") errors.push("non si va alla scogliera: " + (await L.zone(page)));
  await clock(page, "giorno");
  { const bad = await reachMondo(page, "nf_scogliera"); if (bad.length) errors.push("nf_scogliera irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "nf_scogliera");
  await L.goAct(page, 29, 15); await L.advance(page); if ((await L.zone(page)) !== "nf_scogliera") errors.push("lo stadio si apre troppo presto");
  await L.talk(page, "nf_bora"); await L.advance(page); await L.talk(page, "nf_scoglio"); await L.advance(page); await chk3(1, "Scoglio prima del cannocchiale");
  await L.goAct(page, 14, 4); await L.advance(page); await chk3(2, "dopo il cannocchiale");
  await L.talk(page, "nf_bora"); await L.advance(page); await L.talk(page, "nf_scoglio"); await L.advance(page); await chk3(3, "dopo la verità di Scoglio");
  await L.goAct(page, 29, 15); await L.advance(page); if ((await L.zone(page)) !== "nf_stadio") errors.push("non si arriva allo stadio: " + (await L.zone(page)));
  await clock(page, "giorno");
  { const bad = await reachMondo(page, "nf_stadio"); if (bad.length) errors.push("nf_stadio irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "nf_stadio");
  for (const id of ["nf_scoglio", "nf_bora", "nf_tobia", "nf_salvi", "nf_gaspare", "nf_fiorenzo"]) { await L.talk(page, id); await L.advance(page); }
  await L.goAct(page, 24, 2); await L.advance(page);
  await page.evaluate(() => { window.__W = false; window.__marea.start = (o) => { window.__mo = o; setTimeout(() => o.onDone({ a: window.__W ? 2 : 0, b: window.__W ? 1 : 2, win: window.__W, quit: false, data: {} }), 30); return true; }; });
  await L.goAct(page, 17, 2); await L.advance(page, [/Giochiamo la Partita Grande/]); await chk3(3, "finale persa");
  await page.evaluate(() => { window.__W = true; });
  await L.goAct(page, 17, 2); await L.advance(page, [/Giochiamo la Partita Grande/, /Riportaci a casa/]);
  { const i = await info(page); if (i.done[3] !== "rotta" || !i.ends.includes("rotta") || i.step[3] !== 9) errors.push("finale rotta non registrato: " + JSON.stringify([i.done, i.ends, i.step])); }
  // gli altri finali: stesse partenze, condizioni diverse
  const finale = async (kind, setup, pref) => {
    await page.evaluate(([k, setup]) => { const K = eval(k); K.setStep(3, 4); K.F.set("nf_finale_vinta", true); eval(setup); K.enterZone("nf_stadio"); }, [K_, setup]);
    await page.waitForTimeout(500); await clock(page, "giorno");
    await L.goAct(page, 17, 2); await L.advance(page, [pref]);
    const i = await info(page); if (!i.ends.includes(kind) || i.done[3] !== kind) errors.push("finale " + kind + " non registrato: " + JSON.stringify([i.done, i.ends]));
  };
  await finale("custodi", "K.bond('voce', 20)", /teniamo accesa/);
  await finale("squadra", "K.bond('rispetto', 30); K.F.set('nf_con_scoglio', true)", /tutti insieme/);
  await finale("lunga", "K.bond('voce', 40); { const r = K.api.trRec(); r.got = r.got || {}; Object.keys(K.api.TRZ).forEach((z) => { if (/^nf_/.test(z)) r.got[z] = (K.api.TRZ[z].items || []).map((_, i) => i); } ); }", /Portaci a casa/);
  { const sc = await page.evaluate((k) => eval(k).conchiglie(), K_); if (!sc[1] || sc[0] !== sc[1]) errors.push("conta conchiglie: " + JSON.stringify(sc)); }
  await page.evaluate(([k]) => { const K = eval(k); K.setStep(3, 4); K.enterZone("nf_stadio"); }, [K_]);
  await page.evaluate(([k]) => { const K = eval(k); K.setStep(3, 3); K.F.set("nf_zattera", true); K.enterZone("nf_stadio"); }, [K_]);
  await page.waitForTimeout(500); await clock(page, "giorno");
  await L.goAct(page, 17, 2); await L.advance(page, [/zattera di Gaspare/]);
  { const i = await info(page); if (!i.ends.includes("zattera") || i.ends.length !== 5) errors.push("finale zattera: " + JSON.stringify(i.ends)); }
  L.check(`Naufraghi del Pallone · tre capitoli e cinque finali (${w} px)`, errors); await browser.close();
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
