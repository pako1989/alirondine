// tests/presa.cjs - Presa Unica, Gettoni Truccati, Scambio di Costumi (Sala Giochi) e Sala dei Cimeli (Salone)
const L = require("./lib.cjs");
(async () => {
  const extra = {
    "ali-di-rondine.mantello": { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "segreto", 2: "amica", 3: "eroe" }, ends: ["eroe"], diffSet: true, flags: {} },
  };
  const { browser, page, errors } = await L.setup({ w: 390, extra });
  const ev = (f, a) => page.evaluate(f, a);
  await ev(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(300);
  if (!(await ev(() => document.querySelectorAll(".salOv [data-tok]").length))) errors.push("manca la riga dei gettoni");
  await ev(() => document.querySelector('.salOv [data-tok="nebbia"]').click()); await page.waitForTimeout(200);
  if ((await ev(() => window.__presa.sel().tok)) !== "nebbia") errors.push("gettone non selezionato");
  const cs = await ev(() => document.querySelectorAll(".salOv [data-cos]").length);
  if (cs > 1) await ev(() => document.querySelectorAll(".salOv [data-cos]")[1].click());
  await ev(() => window.__presa.setSel({ cos: window.__presa.costumeSagas()[0] })); const cos = await ev(() => window.__presa.sel().cos);
  // portrait wrapper: prima, durante, dopo
  const orig = await ev(() => { window.__t0 = window.__borgoApi.portraitImg; return 1; });
  await ev(() => document.querySelector('.salOv [data-m="bottoni"]').click()); await page.waitForTimeout(200);
  await ev(() => document.querySelector('.salOv [data-o="1"]').click()); await page.waitForTimeout(300);
  const during = await ev(() => ({ cls: document.body.classList.contains("pgt-nebbia"), fx: !!document.getElementById("pgFx"), swapped: window.__borgoApi.portraitImg !== window.__t0 }));
  if (!during.cls || !during.fx) errors.push("gettone non applicato durante la partita: " + JSON.stringify(during));
  if (cos && !during.swapped) errors.push("costume non applicato");
  if (!(await ev(() => !!document.getElementById("pgBadge") && /pgt-on/.test(document.body.className)))) errors.push("etichetta/tinta costume assenti");
  await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); }); await page.waitForTimeout(400);
  await ev(() => { const S = window.__bottoni.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(300); await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); }); await page.waitForTimeout(400);
  const after = await ev(() => ({ cls: document.body.classList.contains("pgt-nebbia"), fx: !!document.getElementById("pgFx"), restored: window.__borgoApi.portraitImg === window.__t0, rec: window.__presa.recs() }));
  if (after.cls || after.fx || !after.restored) errors.push("pulizia mancata: " + JSON.stringify(after));
  if (!after.rec["bottoni|nebbia"] || after.rec["bottoni|nebbia"].n !== 1) errors.push("record col gettone non salvato: " + JSON.stringify(after.rec));
  // Presa Unica: run() diretto
  await ev(() => { window.__runRes = null; window.__presa.setSel({ tok: "", cos: "" }); window.__runOk = window.__presa.run("bottoni", { token: "notte", onEnd: (r) => (window.__runRes = r) }); }); await page.waitForTimeout(300);
  if (!(await ev(() => document.body.classList.contains("pgt-notte")))) errors.push("run(): gettone notte non applicato");
  await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); }); await page.waitForTimeout(400);
  await ev(() => { const S = window.__bottoni.state; S.a = 1; S.b = 0; S.finish(); }); await page.waitForTimeout(300); await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); }); await page.waitForTimeout(400);
  const rr = await ev(() => window.__runRes); if (!rr || rr.id !== "bottoni" || rr.token !== "notte" || typeof rr.punti !== "number" || !("vinto" in rr) || !("tempo" in rr)) errors.push("run(): esito non normalizzato " + JSON.stringify(rr));
  if (await ev(() => document.body.classList.contains("pgt-notte"))) errors.push("run(): gettone notte rimasto");
  // costume: i ritratti cambiano durante la partita e tornano dopo
  const cks = await ev(() => window.__presa.costumeSagas()); if (!cks.length) errors.push("nessuna saga per i costumi");
  const sw = await ev((k) => { window.__t1 = window.__borgoApi.portraitImg; const P = window.__borgoApi; window.__presa.run("bottoni", { costume: k }); const d = P.portraitImg !== window.__t1; const ids = Object.keys(window.__sogni.BY).slice(0, 40); const a = ids.map((i) => P.portraitImg(i) ? 1 : 0).join(""); return { d, a }; }, cks[0]);
  if (!sw.d) errors.push("costume non applicato in run()");
  await page.waitForTimeout(300); await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); }); await page.waitForTimeout(300);
  await ev(() => { const S = window.__bottoni.state; S.a = 1; S.b = 0; S.finish(); }); await page.waitForTimeout(300); await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); }); await page.waitForTimeout(400);
  if (!(await ev(() => window.__borgoApi.portraitImg === window.__t1))) errors.push("ritratti non ripristinati dopo il costume");
  // opzione spenta: nessun gettone
  await ev(() => window.__presa.setOn(false)); await ev(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(200);
  if (await ev(() => document.querySelectorAll(".salOv [data-tok]").length)) errors.push("riga gettoni visibile con opzione spenta");
  await ev(() => window.__presa.setOn(true));
  // Cimeli
  await ev(() => window.__salone.cimeli.open(() => {})); await page.waitForTimeout(300);
  const cim = await ev(() => ({ v: document.querySelectorAll(".salOv .cimV").length, full: document.querySelectorAll(".salOv .cimV:not(.cimEmpty)").length, txt: document.querySelector(".salOv .cimV:not(.cimEmpty)") && document.querySelector(".salOv .cimV:not(.cimEmpty)").innerText }));
  if (!cim.v || cim.full < 1) errors.push("Sala dei Cimeli: vetrine " + JSON.stringify(cim));
  await L.shot(page, "cimeli");
  await ev(() => window.__salone.cimeli.setOn(false)); await ev(() => window.__salone.open(() => {})); await page.waitForTimeout(300);
  if (await ev(() => !!document.querySelector('.salOv [data-go="cim"]'))) errors.push("pulsante Cimeli visibile con opzione spenta");
  L.check("presa, gettoni, costumi, cimeli", errors); await browser.close();
})().catch((e) => { console.error("✗ presa:", e.message); process.exit(1); });
