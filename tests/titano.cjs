// tests/titano.cjs - «Il Figlio del Titano»: il motore Volo a Tutto Campo (traiettoria disegnata, volo vero, fine partita),
// le scelte a tempo del motore comune (sia scegliendo sia lasciando scadere il tempo), le partite a scelta,
// i 3 capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__titano", key: "ali-di-rondine.titano" };
const K_ = "window.__titano._dbg.K";
const info = (p) => L.info(p);
const voStart = async (p) => { await p.waitForTimeout(300); const ok = await p.evaluate(() => { const b = document.querySelector(".voOv .ov .goB"); if (b) { b.click(); return true; } return false; }); await p.waitForTimeout(250); return ok; };
const voEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__volo.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await p.evaluate(() => { const b = document.querySelector(".voOv .ov .goB"); if (b) b.click(); }); await p.waitForTimeout(250); };
// una scelta a tempo: o si lascia scadere (fire) o si clicca un'opzione
const timed = async (p, label, errors) => {
  await p.waitForTimeout(300); if (!(await p.evaluate(() => !!document.getElementById("scTimer")))) errors.push("manca la barra della scelta a tempo");
  if (label) await p.evaluate((l) => window.T_.click(l), label); else await p.evaluate((k) => eval(k).timedFire(), K_);
  await p.waitForTimeout(300);
};
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__titano.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  { const bad = await L.reachAll(page, "ft_citta"); if (bad.length) errors.push("ft_citta irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "ft_citta");
  await L.talk(page, "ft_sam"); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "ft_sam"); await page.evaluate(() => window.T_.click("Partitella al Campo Sud")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Con i piedi per terra")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "ft_partitella") errors.push("partitella non a scelta");
  await L.goAct(page, 23, 17); await L.advance(page); if ((await L.zone(page)) !== "ft_casa") errors.push("non si entra in casa");
  { const bad = await L.reachAll(page, "ft_casa"); if (bad.length) errors.push("ft_casa irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "ft_atlante"); await L.advance(page); await L.talk(page, "ft_nora"); await L.advance(page);
  if ((await info(page)).step[1] !== 2) errors.push("tuo padre non ha parlato");
  await page.evaluate((k) => eval(k).go("ft_citta", 16, 2), K_); await page.waitForTimeout(400); await L.advance(page);
  await L.goAct(page, 16, 0); await L.advance(page); if ((await L.zone(page)) !== "ft_cielo") errors.push("non si sale in cielo");
  { const bad = await L.reachAll(page, "ft_cielo"); if (bad.length) errors.push("ft_cielo irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "ft_cielo");
  await L.talk(page, "ft_atlante"); if (w === 390) { await page.waitForTimeout(300); await L.shot(page, "ft_scelta_tempo"); }
  await timed(page, w === 390 ? null : "Neanche un po'", errors); await L.advance(page);
  let i = await info(page); if (i.flags.ft_primo !== (w === 390 ? "silenzio" : "coraggio") || i.step[1] !== 3 || !i.flags.ft_tuta) errors.push("primo volo: " + JSON.stringify([i.flags.ft_primo, i.step]));
  await L.talk(page, "ft_cecile"); await page.evaluate(() => window.T_.click("Accetta il test")); await page.waitForTimeout(500);
  if (!(await voStart(page))) errors.push("Volo a Tutto Campo non si apre");
  // un comando vero: una traiettoria disegnata e il pulsante «Vola!»
  const ok = await page.evaluate(() => { const S = window.__volo.state; return S.plan([[S.hero.x + 40, S.hero.y - 20], [S.hero.x + 80, S.hero.y]]); });
  if (w === 390) await L.shot(page, "ft_volo");
  await page.evaluate(() => { const b = document.querySelector(".voOv .pad button.go"); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); }); await page.waitForTimeout(1500);
  const st = await page.evaluate(() => { const S = window.__volo.state; return [S.data.voli, S.phase, Math.round(S.hero.x)]; }); if (!ok || st[0] !== 1 || st[2] <= 150) errors.push("Volo a Tutto Campo, il volo: " + JSON.stringify([ok, st]));
  await voEnd(page, 2, 0); await L.advance(page);
  if ((await info(page)).step[1] !== 4) errors.push("dopo il test dei Fulmini: " + JSON.stringify((await info(page)).step));
  await L.talk(page, "ft_cecile"); await L.advance(page, [w === 390 ? "Entro nell'Agenzia" : "Mi allena mio padre"]);
  i = await info(page); if (!i.done[1] || !(w === 390 ? i.flags.ft_agenzia : i.flags.ft_con_padre)) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Il Figlio del Titano · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "agenzia" }, diffSet: true, intro: { ch1: 1, ft_citta: 1, ft_cielo: 1 }, st: { famiglia: 2 }, flags: { ft_tuta: true, ft_agenzia: true, ft_primo: "paura" } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__titano.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  { const bad = await L.reachAll(page, "ft_porto"); if (bad.length) errors.push("ft_porto irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "ft_porto");
  await L.talk(page, "ft_vega"); await L.advance(page);
  if (w === 390) { await L.talk(page, "ft_vega"); await page.evaluate(() => window.T_.click("Prima una partita")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("In volo")); await page.waitForTimeout(500); if (!(await voStart(page))) errors.push("partita con Vega non parte"); await voEnd(page, 3, 1); await L.advance(page); }
  await L.talk(page, "ft_vega"); await L.advance(page, [w === 390 ? "Mi fido di te" : "Ti porto all'Agenzia"]);
  await L.talk(page, "ft_atlante"); await timed(page, w === 390 ? "Perché sei venuto" : null, errors); await L.advance(page).catch(() => {});
  await page.waitForTimeout(300);
  const mates = await page.evaluate(() => window.__volo.state && window.__volo.state.o.mates.map((m) => m.name).join()); if (mates !== (w === 390 ? "Vega" : "Sam")) errors.push("partita con tuo padre, compagni: " + mates);
  await voStart(page); await voEnd(page, 2, 1); await L.advance(page);
  let i = await info(page); if (i.step[2] !== 3 || i.flags.ft_domanda !== (w === 390 ? "perche" : "silenzio")) errors.push("domanda a tuo padre: " + JSON.stringify([i.step, i.flags.ft_domanda]));
  await L.goAct(page, 27, 19); await L.advance(page); if ((await L.zone(page)) !== "ft_agenzia") errors.push("non si entra nell'Agenzia");
  { const bad = await L.reachAll(page, "ft_agenzia"); if (bad.length) errors.push("ft_agenzia irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "ft_cecile"); await L.advance(page);
  await page.evaluate((k) => eval(k).go("ft_porto", 16, 19), K_); await page.waitForTimeout(400); await L.advance(page);
  await L.talk(page, "ft_nora"); await L.advance(page, [w === 390 ? "Dille tutta la verità" : "È una cosa fra me e papà"]);
  i = await info(page); if (!i.done[2] || (w === 390 && !i.flags.ft_madre_sa)) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.flags.ft_madre_sa]));
  L.check(`Il Figlio del Titano · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = Object.assign({ ft_tuta: true, ft_agenzia: true }, w === 390 ? { ft_madre_sa: true, ft_vega_fiducia: true } : { ft_vega_agenzia: true });
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "agenzia", 2: "verita" }, diffSet: true, intro: { ch1: 1, ch2: 1, ft_citta: 1, ft_cielo: 1, ft_porto: 1 }, st: { famiglia: 5, cielo: 4 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__titano.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  { const bad = await L.reachAll(page, "ft_arena"); if (bad.length) errors.push("ft_arena irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "ft_arena");
  await L.talk(page, "ft_orione"); await L.advance(page);
  await L.talk(page, "ft_atlante"); await timed(page, w === 390 ? "Papà, gioca con noi" : null, errors); await L.advance(page);
  let i = await info(page); if (i.step[3] !== 2 || !!i.flags.ft_padre_con !== (w === 390)) errors.push("la scelta di tuo padre: " + JSON.stringify([i.step, i.flags.ft_padre_con]));
  await L.talk(page, "ft_orione"); await page.evaluate(() => window.T_.click("Gioca la Partita del Cielo")); await page.waitForTimeout(500);
  const o = await page.evaluate(() => { const S = window.__volo.state; return S && [S.o.mates.map((m) => m.name).join(), S.o.energy]; }); if (!o || o[0] !== (w === 390 ? "Atlante" : "Sam")) errors.push("Partita del Cielo: " + JSON.stringify(o));
  await voStart(page); await voEnd(page, 3, 2); await L.advance(page);
  if (w === 390) await L.shot(page, "ft_finale");
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["ft_cielo", "ft_porto", "ft_arena"].forEach((z) => { r.got[z] = ((Z[z] && Z[z].items) || []).map((_, k) => k); }); });
  const ends = ["Prendi il pallone e guarda tuo padre", "Papà, torniamo a casa", "Il cielo sopra Altamira", "Vega, portami su Elyon"];
  for (const e of ends) {
    await page.evaluate((k) => { const K = eval(k); K.F.set("ft_padre_con", true); K.F.set("ft_vega_fiducia", true); K.setStep(3, 3); K.enterZone("ft_arena"); }, K_); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "ft_nora"); await L.advance(page, [e]);
  }
  i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate((k) => eval(k).mem().ends.length, K_); if (n < 4) errors.push("finali trovati " + n + " su 4");
  const m = await page.evaluate(() => { const x = window.__salone.machine("volo"); return x && x.eng; }); if (m !== "__volo") errors.push("cabinato di Volo a Tutto Campo mancante");
  L.check(`Il Figlio del Titano · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ titano:", e.stack); process.exit(1); });
