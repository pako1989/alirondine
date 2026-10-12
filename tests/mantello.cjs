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
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); })().catch((e) => { console.error("✗ mantello:", e.message); process.exit(1); });
