// tests/mantello.cjs - «Il Mantello Granata»: le forme dell'eroe (passaggi che si aprono), Super-Bottoni, i capitoli e i finali
const L = require("./lib.cjs");
const MOD = { mod: "__mantello", key: "ali-di-rondine.mantello" };
const btStart = (p) => p.evaluate(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); });
const btEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__bottoni.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await btStart(p); await p.waitForTimeout(200); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__mantello.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["mg_sartoria", "mg_tetti"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "mg_piazza");
  await L.talk(page, "mg_gilda"); await L.advance(page);
  // senza mantello, oltre il canale non si va
  const blocked = await page.evaluate(() => window.T_.goAct(27, 10)); if (blocked === "ok") errors.push("si attraversa il canale senza volare");
  await L.goAct(page, 6, 6); await L.advance(page); if ((await L.zone(page)) !== "mg_sartoria") errors.push("non si entra in sartoria: " + (await L.zone(page)));
  await L.talk(page, "mg_tilde"); await L.advance(page); if (w === 390) await L.shot(page, "mg_sartoria");
  await L.goAct(page, 10, 12); await L.advance(page);
  // la cabina telefonica: si sceglie la forma Volo
  await L.goAct(page, 15, 10); await L.advance(page, ["Volo"]);
  const f = await page.evaluate(() => [window.__mantello._dbg.K.form(), (window.__tr.TW.z.heroFx() || {}).dy]); if (f[0] !== "volo" || !f[1]) errors.push("la forma Volo non si attiva: " + JSON.stringify(f));
  const bad = await L.reachAll(page, "mg_piazza"); if (bad.length) errors.push("mg_piazza (in volo) irraggiungibile: " + bad.join(", "));
  // sopra il canale non si può tornare normali
  await page.evaluate(() => { const TW = window.__tr.TW; TW.x = 18 * 16 + 8; TW.y = 11 * 16 + 12; }); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "mg_volo");
  const ok = await page.evaluate(() => window.__mantello._dbg.K.setForm("", true)); await L.advance(page); if (ok) errors.push("si torna normali sopra il canale");
  await L.goAct(page, 32, 0); await L.advance(page); if ((await L.zone(page)) !== "mg_tetti") errors.push("non si sale sui tetti: " + (await L.zone(page)));
  await L.talk(page, "mg_bullone"); await L.advance(page);
  const party = await page.evaluate(() => window.__tr.TW.z.npcs.filter((n) => n.ghost).map((n) => n.id)); if (party.join() !== "mg_bullone") errors.push("Bullone non segue: " + JSON.stringify(party));
  if (w === 390) await L.shot(page, "mg_tetti");
  await L.goAct(page, 3, 19); await L.advance(page);
  await L.talk(page, "mg_tonno"); await page.evaluate(() => window.T_.click("Sfida a Super-Bottoni")); await page.waitForTimeout(500); await btStart(page); await page.waitForTimeout(600);
  // un tiro vero con la fionda: il disco del Campione parte
  const box = await (await page.$(".btOv canvas")).boundingBox(); const d0 = await page.evaluate(() => { const d = window.__bottoni.state.D[0]; return [d.x, d.y]; });
  const sx = box.x + (d0[0] / 240) * box.width, sy = box.y + (d0[1] / 360) * box.height;
  await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.move(sx, sy + 60, { steps: 4 }); if (w === 390) await L.shot(page, "mg_bottoni"); await page.mouse.up(); await page.waitForTimeout(300);
  const mv = await page.evaluate(() => { const S = window.__bottoni.state; return [S.phase, S.data.tiri, S.D.length]; }); if (mv[1] !== 1 || mv[2] !== 8) errors.push("la fionda non tira: " + JSON.stringify(mv));
  await btEnd(page, 3, 1); await L.advance(page);
  // partita secondaria: si sceglie la modalità
  await L.stubMatch(page, true); await L.talk(page, "mg_brace"); await page.evaluate(() => window.T_.click("Un'altra partita")); await page.waitForTimeout(300); await L.advance(page);
  const lm = await page.evaluate(() => window.__lastMatch); if (!lm || lm.id !== "mg_pompieri") errors.push("partita dei pompieri non avviata");
  await L.talk(page, "mg_gilda"); await L.advance(page, ["Va bene. Sono"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step)); if (!i.flags.mg_coppa) errors.push("coppa non recuperata");
  L.check(`Il Mantello Granata · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "segreto" }, diffSet: true, intro: { ch1: 1, mg_piazza: 1, mg_sartoria: 1, mg_tetti: 1 }, st: { fama: 5, segreto: 2 }, flags: { mg_mantello: true, forma_volo: true, party_mg_bullone: true, mg_coppa: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__mantello.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  await L.talk(page, "mg_gilda"); await L.advance(page);
  const party = await page.evaluate(() => window.__tr.TW.z.npcs.filter((n) => n.ghost).map((n) => n.id).join()); if (party !== "mg_bullone,mg_gilda") errors.push("Gilda non si unisce: " + party);
  await L.goAct(page, 6, 6); await L.advance(page); await L.talk(page, "mg_tilde"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await page.evaluate(() => window.__mantello._dbg.K.setForm("volo", true)); await L.goAct(page, 35, 11); await L.advance(page); if ((await L.zone(page)) !== "mg_fabbrica") errors.push("non si arriva alla fabbrica: " + (await L.zone(page)));
  // con le due forme insieme (in momenti diversi) tutto è raggiungibile
  await page.evaluate(() => { const z = window.__borgoApi.TRZ.mg_fabbrica; z.__p = z.pass; z.pass = () => "wI"; });
  const bad = await L.reachAll(page, "mg_fabbrica"); if (bad.length) errors.push("mg_fabbrica irraggiungibile: " + bad.join(", "));
  await page.evaluate(() => { const z = window.__borgoApi.TRZ.mg_fabbrica; z.pass = z.__p; });
  for (const z of ["mg_laboratorio"]) { const b = await L.reachAll(page, z); if (b.length) errors.push(z + " irraggiungibile: " + b.join(", ")); }
  // in volo si passa il fiume ma non l'inferriata
  await L.goAct(page, 12, 11); await L.advance(page);
  if ((await page.evaluate(() => window.T_.goAct(22, 10))) === "ok") errors.push("si entra nel cortile senza la forma Mini");
  await page.evaluate(() => window.__mantello._dbg.K.setForm("mini", true)); if (w === 390) await L.shot(page, "mg_fabbrica");
  const fx = await page.evaluate(() => window.__tr.TW.z.heroFx().s); if (!(fx < 1)) errors.push("la forma Mini non rimpicciolisce: " + fx);
  await L.goAct(page, 22, 10); await L.advance(page); if ((await L.zone(page)) !== "mg_laboratorio") errors.push("non si entra nel laboratorio: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "mg_laboratorio");
  await L.talk(page, "mg_colla"); await page.evaluate(() => window.T_.click("Sfida a Super-Bottoni")); await page.waitForTimeout(500); await btStart(page); await page.waitForTimeout(500);
  // il contro-potere della Colla dimezza il tiro
  const half = await page.evaluate(() => { const S = window.__bottoni.state; S.curse = "colla"; S.flick(0, -Math.PI / 2, 1); return Math.hypot(S.D[0].vx, S.D[0].vy); }); if (!(half > 4 && half < 6)) errors.push("la colla non dimezza il tiro: " + half);
  await btEnd(page, 2, 1); await L.advance(page);
  await L.talk(page, "mg_colla"); await L.advance(page, ["la colla non serve"]);
  const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step)); if (!i.flags.mg_colla_amica) errors.push("scelta non registrata");
  L.check(`Il Mantello Granata · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "segreto", 2: "amica" }, diffSet: true, intro: { ch1: 1, ch2: 1, mg_piazza: 1, mg_sartoria: 1, mg_tetti: 1, mg_fabbrica: 1, mg_laboratorio: 1 }, st: { fama: 9, segreto: 2 }, flags: { mg_mantello: true, forma_volo: true, forma_mini: true, party_mg_bullone: true, party_mg_gilda: true, mg_coppa: true, mg_volto: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__mantello.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  await L.goAct(page, 6, 6); await L.advance(page); await L.talk(page, "mg_tilde"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 12, 23); await L.advance(page); if ((await L.zone(page)) !== "mg_viale") errors.push("non si arriva al viale: " + (await L.zone(page)));
  for (const z of ["mg_torre"]) { const b = await L.reachAll(page, z); if (b.length) errors.push(z + " irraggiungibile: " + b.join(", ")); }
  if ((await page.evaluate(() => window.T_.goAct(17, 18))) === "ok") errors.push("si passano le auto senza la forma Gigante");
  await L.talk(page, "mg_tonno"); await L.advance(page);
  await L.talk(page, "mg_vigile"); await L.advance(page, ["Mantello\\? Quale mantello"]);
  await page.evaluate(() => window.__mantello._dbg.K.setForm("gigante", true));
  const bad = await L.reachAll(page, "mg_viale"); if (bad.length) errors.push("mg_viale (gigante) irraggiungibile: " + bad.join(", "));
  await page.evaluate(() => { const TW = window.__tr.TW; TW.x = 16 * 16 + 8; TW.y = 8 * 16 + 12; }); await page.waitForTimeout(400); if (w === 390) await L.shot(page, "mg_gigante");
  const ok = await page.evaluate(() => window.__mantello._dbg.K.setForm("", true)); await L.advance(page); if (ok) errors.push("si torna normali sopra le auto");
  await L.goAct(page, 17, 18); await L.advance(page); if ((await L.zone(page)) !== "mg_torre") errors.push("non si entra nella torre: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "mg_torre");
  await L.talk(page, "mg_dottore"); await page.evaluate(() => window.T_.click("Calamita")); await page.waitForTimeout(500); await btStart(page); await page.waitForTimeout(500);
  const pw = await page.evaluate(() => { const S = window.__bottoni.state; S.meter = 100; S.usePower(); return [S.o.power, S.o.oppPower, S.armed]; }); if (pw.join() !== "calamita,specchio,calamita") errors.push("potere della finale sbagliato: " + pw);
  await btEnd(page, 3, 2); await L.advance(page);
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["mg_piazza", "mg_tetti", "mg_fabbrica", "mg_viale"].forEach((z) => { r.got[z] = (Z[z].items || []).map((_, k) => k); }); });
  const ends = ["I ritagli di stoffa", "Metropolenta è libera", "Tutti sanno chi sono", "alla città serve un arbitro"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__mantello._dbg.K; K.setStep(3, 3); K.enterZone("mg_torre"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "mg_dottore"); await L.advance(page, [e]); if (w === 390 && e === ends[0]) await L.shot(page, "mg_fine");
  }
  const i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__mantello._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  L.check(`Il Mantello Granata · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
async function c4(w) {
  const save = { v: 1, ch: 4, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "segreto", 2: "amica", 3: "eroe" }, ends: ["eroe"], diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, mg_piazza: 1, mg_sartoria: 1 }, st: { fama: 12 }, flags: { mg_mantello: true, forma_volo: true, forma_mini: true, forma_gigante: true, party_mg_bullone: true, party_mg_gilda: true, mg_colla_amica: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__mantello.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await L.advance(page);
  await L.goAct(page, 6, 6); await L.advance(page); await L.talk(page, "mg_tilde"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.talk(page, "mg_brace"); await L.advance(page);
  await page.evaluate(() => window.__mantello._dbg.K.setForm("volo", true));
  await L.talk(page, "mg_tonno"); await L.advance(page); await L.talk(page, "mg_colla"); await L.advance(page);
  await L.talk(page, "mg_senza"); await page.evaluate(() => window.T_.click("Sfida con la Lega")); await page.waitForTimeout(500); await btStart(page); await page.waitForTimeout(300);
  // i poteri girano: dopo il Fulmine arriva il Gigante
  const p = await page.evaluate(() => { const S = window.__bottoni.state, a = S.power; S.meter = 100; S.usePower(); return [a, S.power, S.meter]; }); if (p.join() !== "fulmine,gigante,50") errors.push("i poteri non girano: " + p);
  await page.waitForTimeout(1800); await btEnd(page, 3, 1); await L.advance(page);
  await L.talk(page, "mg_senza"); await L.advance(page, ["Nonna Tilde ve ne cuce"]);
  const i = await L.info(page); if (!i.done[4]) errors.push("capitolo bonus non concluso: " + JSON.stringify(i.step));
  L.check(`Il Mantello Granata · capitolo bonus «La Lega» (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); await c4(390); await c4(320); })().catch((e) => { console.error("✗ mantello:", e.message); process.exit(1); });
