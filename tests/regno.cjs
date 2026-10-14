// tests/regno.cjs - «Cronache del Regno Ultimo»: il motore Duello di Corona, le Casate, i capitoli, i luoghi, i finali
const L = require("./lib.cjs");
const MOD = { mod: "__regno", key: "ali-di-rondine.regno" };
const cnEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__corona.state; if (!S) return; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(300); };
const cnBtn = (p) => p.evaluate(() => { const b = document.querySelector(".cnOv .btns button"); if (b) { b.click(); return true; } return false; });
// gioca davvero la partita: la fa passare per i consigli e poi chiude con il risultato voluto
async function duello(page, a, b, errors) {
  await page.waitForTimeout(500);
  if (!(await page.evaluate(() => !!window.__corona.state))) { errors.push("il Duello di Corona non parte"); return; }
  await cnEnd(page, a, b); await page.waitForTimeout(300);
  for (let k = 0; k < 12 && (await cnBtn(page)); k++) await page.waitForTimeout(250);
}
async function reach(page, errors, z) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
// sceglie una voce di menu dopo aver fatto scorrere il dialogo, poi lascia che advance chiuda il resto
async function pick(page, re) { for (let k = 0; k < 25; k++) { await page.waitForTimeout(120); if (await page.evaluate((re) => window.T_.click(re), re)) { await page.waitForTimeout(150); return true; } await page.evaluate(() => window.T_.click("^Continua")); } return false; }
const SAVE1 = (o = {}) => Object.assign({ v: 1, ch: 1, step: {}, done: {}, diffSet: true, intro: {}, st: {}, flags: {} }, o);

async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__regno.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  await reach(page, errors, "re_cortile"); if (w === 390) await L.shot(page, "re_cortile");
  await L.talk(page, "re_fiorino"); if (!(await pick(page, "Cantami"))) errors.push("menu Fiorino"); await L.advance(page, ["A dopo"]);
  await L.talk(page, "re_mirta"); await L.advance(page);
  await L.talk(page, "re_evaristo"); await pick(page, "Vado"); await L.advance(page);
  await L.talk(page, "re_evaristo"); if (!(await pick(page, "Che cos.è il Patto"))) errors.push("menu Evaristo"); await pick(page, "Come funziona"); await L.advance(page, ["Vado"]);
  let i = await L.info(page); if (i.step[1] !== 1) errors.push("il Consiglio non si apre: " + JSON.stringify(i.step));
  // la Sala del Trono: si entra dal portone del palazzo
  await page.evaluate(() => window.__regno._dbg.K.go("re_trono", 10, 12)); await page.waitForTimeout(500); await L.advance(page);
  if ((await L.zone(page)) !== "re_trono") errors.push("non si entra nel Palazzo");
  await reach(page, errors, "re_trono"); if (w === 390) await L.shot(page, "re_trono");
  for (const id of ["re_gatto", "re_perla", "re_cedro", "re_mirta"]) { await L.talk(page, id); await L.advance(page); }
  await L.talk(page, "re_anselmo"); await L.advance(page, ["Al Generale"]);
  i = await L.info(page); if (i.step[1] !== 2) errors.push("il Re non manda alle Mura: " + JSON.stringify(i.step));
  if ((await page.evaluate(() => window.__regno._dbg.K.liv("lupi"))) < 1) errors.push("favore dei Lupi non assegnato");
  await page.evaluate(() => window.__regno._dbg.K.go("re_mura", 2, 8)); await page.waitForTimeout(500); await L.advance(page);
  await reach(page, errors, "re_mura"); if (w === 390) await L.shot(page, "re_mura");
  await L.talk(page, "re_brando"); if (!(await pick(page, "Gioca la Partita"))) errors.push("menu Brando");
  await duello(page, 3, 1, errors); await L.advance(page);
  i = await L.info(page); if (i.step[1] !== 3) errors.push("la Partita d'Assedio non sblocca Oriele: " + JSON.stringify(i.step));
  await L.talk(page, "re_oriele"); await pick(page, "Come stai"); await pick(page, "Che cosa vuole"); await L.advance(page, ["Finiamo la giornata"]);
  i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  const m = await page.evaluate(() => { const x = window.__salone.machine("corona"); return x && x.eng; }); if (m !== "__corona") errors.push("cabinato del Duello di Corona mancante");
  L.check(`Cronache del Regno Ultimo · capitolo 1 (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); })().catch((e) => { console.error("✗ regno:", e.message); process.exit(1); });
