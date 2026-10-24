// tests/viva.cjs - Partita Viva (Phaser): squadra con portiere compreso, fisica, tiro, passaggio, partita completa in simulazione, uscita onDone
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
async function run(w, n) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => window.__sogni.sync());
  await page.evaluate(() => { const S = window.__sogni, r = S._load(); ["of_ferro", "pd_zeno", "bm_boris", "ml_marta", "cm_bastiano"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "pd_zeno", "bm_boris", "ml_marta", "cm_bastiano"]; S._save(r); });
  await page.evaluate((n) => { window.__res = null; window.__viva.start({ level: 2, n, tutorial: false, onDone: (r) => { window.__res = r; } }); }, n);
  for (let i = 0; i < 80 && !(await page.evaluate(() => !!(window.Phaser && window.__viva.scene && window.__viva.scene.P))); i++) await page.waitForTimeout(250);
  const ok = await page.evaluate(() => !!(window.Phaser && window.__viva.scene && window.__viva.scene.P)); if (!ok) { errors.push("Phaser/Viva non partiti"); L.check(`Partita Viva ${n}v${n} (${w} px)`, errors); await browser.close(); return; }
  await page.waitForTimeout(600);
  if (w === 390 && n === 5) await L.shot(page, "viva_campo");
  const sq = await page.evaluate(() => { const s = window.__viva.scene; return { p: s.P.length, q: s.Q.length, kp: s.P.filter((x) => x.keeper).length, kq: s.Q.filter((x) => x.keeper).length, gk: s.P[s.P.length - 1].id, nf: s.nf }; });
  if (sq.p !== n || sq.q !== n || sq.kp !== 1 || sq.kq !== 1) errors.push("squadre: " + JSON.stringify(sq));
  if (n === 5 && sq.gk !== "bm_boris") errors.push("la carta Portiere non è in porta: " + sq.gk);
  const fm = await page.evaluate(() => { const s = window.__viva.scene, R = { A: 0, C: 1, D: 2 }, f = s.P.filter((x) => !x.keeper).slice().sort((a, b) => b.hx - a.hx); let bad = false; for (let i = 1; i < f.length; i++) if (R[f[i].role] < R[f[i - 1].role]) bad = true; return { bad, o: f.map((x) => x.role + Math.round(x.hx)) }; });
  if (fm.bad) errors.push("formazione non per ruolo: " + JSON.stringify(fm));
  // fisica: la palla rimbalza sulle sponde e resta nel campo
  const ph = await page.evaluate(() => { const V = window.__viva.state, s = window.__viva.scene, b = s.ball; V.auto(true); b.owner = null; b.x = 300; b.y = 8; b.vx = 3; b.vy = -6; b.cool = 99; V.sim(10); const y1 = b.y, vy1 = b.vy; return { y1, vy1, in: b.y >= 0 && b.y <= 400 }; });
  if (!ph.in || ph.vy1 < 0) errors.push("rimbalzo sulla sponda: " + JSON.stringify(ph));
  // tiro in porta senza portiere: gol
  const gl = await page.evaluate(() => { const V = window.__viva.state, s = window.__viva.scene, b = s.ball; s.freeze = 0; s.Q.forEach((x) => { x.stun = 9999; }); const p = s.P[0]; p.x = 600; p.y = 200; p.stun = 0; b.owner = p; b.cool = 0; b.x = p.x + 12; b.y = p.y; s.shoot(p, 1, 200); const g0 = s.score[0]; V.sim(120); return { g: s.score[0] - g0, score: s.score.slice() }; });
  if (gl.g !== 1) errors.push("tiro in porta: " + JSON.stringify(gl));
  // passaggio: la palla arriva al compagno
  const ps = await page.evaluate(() => { const V = window.__viva.state, s = window.__viva.scene, b = s.ball; s.freeze = 0; const p = s.P[0], m = s.P[1]; s.P.forEach((x) => { x.stun = 0; }); s.Q.forEach((x) => { x.stun = 9999; }); p.x = 200; p.y = 150; b.owner = p; b.cool = 0; b.x = 212; b.y = 150; m.x = 300; m.y = 150; m.vx = m.vy = 0; s.pass(p, m); let got = false; for (let i = 0; i < 90; i++) { s.step(); if (b.owner && b.owner.team === 0) { got = true; break; } } return { got, owner: b.owner && b.owner.id }; });
  if (!ps.got) errors.push("passaggio: " + JSON.stringify(ps));
  // controllo umano: joystick muove, TIRA dà un tiro, PASSA con la palla passa, senza palla cambia giocatore
  const hu = await page.evaluate(() => { const V = window.__viva.state, s = window.__viva.scene, b = s.ball; V.auto(false); s.over = false; s.freeze = 0; s.Q.forEach((x) => { x.stun = 9999; }); s.P.forEach((x) => { x.stun = 0; });
    const c = s.ctl; b.owner = null; b.x = 0; b.y = 0; c.x = 300; c.y = 200; b.owner = c; b.cool = 0; V.stick(1, 0); const x0 = c.x; V.sim(30); const mv = c.x - x0;
    V.stick(0, 0); V.sim(10); b.owner = c; const sh0 = s.shots[0]; V.press("shoot", true); V.sim(30); V.press("shoot", false); const shot = s.shots[0] - sh0;
    const o1 = s.ctl; V.sim(60); b.owner = null; b.x = 500; b.y = 100; b.vx = b.vy = 0; b.cool = 99; V.press("pass", true); V.sim(2); return { mv: Math.round(mv), shot, sw: s.ctl !== o1 }; });
  if (hu.mv < 20 || hu.shot !== 1) errors.push("controllo umano: " + JSON.stringify(hu));
  // partita completa simulata (IA contro IA): finisce, niente NaN
  const full = await page.evaluate(() => { const V = window.__viva.state, s = window.__viva.scene; V.auto(true); s.Q.forEach((x) => { x.stun = 0; }); let n = 0; while (!s.over && n++ < 40000) s.step(); const nan = s.all.some((p) => !isFinite(p.x) || !isFinite(p.y)) || !isFinite(s.ball.x); return { over: s.over, score: s.score.slice(), shots: s.shots.slice(), nan, frames: n }; });
  if (!full.over || full.nan || full.shots[0] + full.shots[1] < 2) errors.push("partita completa: " + JSON.stringify(full));
  await page.waitForTimeout(400);
  const res = await page.evaluate(() => window.__viva.state.over);
  if (!res) errors.push("schermata finale non comparsa");
  await page.evaluate(() => { const b = [...document.querySelectorAll("#vivaOv button")].find((x) => /Continua|Chiudi/.test(x.textContent)); if (b) b.click(); }); await page.waitForTimeout(300);
  const r = await page.evaluate(() => window.__res); if (!r || typeof r.win !== "boolean") errors.push("onDone: " + JSON.stringify(r));
  console.log(`  ${n}v${n} punteggio simulato ${JSON.stringify(full.score)} tiri ${JSON.stringify(full.shots)} frame ${full.frames}`);
  L.check(`Partita Viva ${n}v${n} (${w} px)`, errors); await browser.close();
}
(async () => { await run(390, 5); await run(320, 3); })();
// dentro la Squadra dei Sogni: pulsante, partenza con le 5 carte, esito che torna alla schermata
async function sogni(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => window.__sogni.sync());
  await page.evaluate(() => { const S = window.__sogni, r = S._load(); ["of_ferro", "pd_zeno", "bm_boris", "ml_marta", "cm_bastiano"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "pd_zeno", "bm_boris", "ml_marta", "cm_bastiano"]; S._save(r); });
  await page.evaluate(() => window.__sogni.open()); await page.waitForTimeout(400);
  const has = await page.evaluate(() => { const b = document.querySelector('[data-go="viva"]'); return b ? !b.disabled : null; });
  if (!has) errors.push("pulsante Partita Viva assente o disabilitato: " + has);
  if (w === 390) await L.shot(page, "viva_sogni");
  await page.evaluate(() => { window.__sgDone = 0; document.querySelector('[data-go="viva"]').click(); });
  for (let i = 0; i < 80 && !(await page.evaluate(() => !!(window.Phaser && window.__viva.scene && window.__viva.scene.P))); i++) await page.waitForTimeout(250);
  const sq = await page.evaluate(() => { const s = window.__viva.scene; return s ? { n: s.P.length, gk: s.P[s.P.length - 1].id, bonus: !!s.cfg.bonus } : null; });
  if (!sq || sq.n !== 5 || sq.gk !== "bm_boris" || !sq.bonus) errors.push("squadra in campo: " + JSON.stringify(sq));
  await page.evaluate(() => window.__viva.state.finish(true)); await page.waitForTimeout(500);
  await page.evaluate(() => { const b = [...document.querySelectorAll("#vivaOv button")].find((x) => /Continua|Chiudi/.test(x.textContent)); if (b) b.click(); }); await page.waitForTimeout(500);
  const back = await page.evaluate(() => ({ sg: !!document.querySelector('[data-go="viva"]'), w: window.__sogni._load().vivaW }));
  if (!back.sg || back.w !== 1) errors.push("ritorno a Sogni: " + JSON.stringify(back));
  L.check(`Partita Viva in Squadra dei Sogni (${w} px)`, errors); await browser.close();
}
(async () => { await sogni(390); await sogni(320); })();
