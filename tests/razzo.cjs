// tests/razzo.cjs - «Razzopacco · Consegne dal Futuro»: il motore Consegna a Rete (razzetto guidato col dito, lancio del pacco),
// i tubi pneumatici del motore comune (viaggio in capsula, tubi chiusi), le consegne a tempo, la rotta stellare, le guardie della
// Luna Modulo 7, le partite a scelta, i 3 capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__razzo", key: "ali-di-rondine.razzo" };
const K_ = "window.__razzo._dbg.K";
const info = (p) => L.info(p);
const rnStart = async (p) => { await p.waitForTimeout(300); const ok = await p.evaluate(() => { const b = document.querySelector(".rnOv .ov .goB"); if (b) { b.click(); return true; } return false; }); await p.waitForTimeout(250); return ok; };
const rnEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__consegna.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await p.evaluate(() => { const b = document.querySelector(".rnOv .ov .goB"); if (b) b.click(); }); await p.waitForTimeout(250); };
// un viaggio nel tubo: davanti alla stazione, Azione, e si aspetta l'arrivo
async function tube(p, x, y) { await L.goAct(p, x, y); await p.waitForTimeout(200); for (let i = 0; i < 60; i++) { if (!(await p.evaluate((k) => eval(k).tubeBusy(), K_))) break; await p.waitForTimeout(100); } await p.waitForTimeout(200); }
const tile = (p) => p.evaluate(() => { const TW = window.__tr.TW; return [Math.floor(TW.x / 16), Math.floor((TW.y - 4) / 16)]; });
// come L.reachAll, ma i tubi contano: da una stazione raggiunta si arriva anche all'uscita del tubo
async function reachTubes(page, zid) {
  return page.evaluate((zid) => {
    const D = window[window.__MOD]._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z);
    const T = window.T_, st = spec.start, npcs = (z.npcs || []).map((n) => n.at), bad = [];
    const seen = T.bfs(m, z, st[0], st[1], npcs), adj = (x, y) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    const used = new Set(); let grew = true;
    while (grew) { grew = false; (spec.tubes || []).forEach((t, i) => { if (used.has(i) || !adj(t.at[0], t.at[1])) return; used.add(i); grew = true; const s2 = T.bfs(m, z, t.out[0], t.out[1], npcs); s2.forEach((row, y) => row.forEach((v, x) => { if (v) seen[y][x] = true; })); }); }
    (spec.tubes || []).forEach((t, i) => { if (!used.has(i)) bad.push("tubo " + i + " irraggiungibile"); if (T.solidAt(m, z, t.out[0], t.out[1])) bad.push("uscita del tubo " + i + " su solido"); });
    (spec.items || []).forEach(([x, y]) => { if (!(seen[y] && seen[y][x])) bad.push("francobollo " + x + "," + y); });
    for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) { const c = m[y][x]; if (z.act[c] && "_zQ".indexOf(c) < 0 && "tjyaewfcdo".indexOf(c) < 0 && !adj(x, y) && !(seen[y] && seen[y][x])) bad.push("oggetto " + c + " " + x + "," + y); }
    (spec.npcs ? spec.npcs(99) : []).concat(spec.npcs ? spec.npcs(0) : []).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at); if (T.solidAt(m, z, n.at[0], n.at[1])) bad.push("png su solido " + n.id); });
    return bad;
  }, zid);
}
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__razzo.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if ((await L.zone(page)) !== "rz_crio") errors.push("non si parte dal Criogenico: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "rz_crio");
  { const bad = await L.reachAll(page, "rz_crio"); if (bad.length) errors.push("rz_crio irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "rz_ferruccio"); await L.advance(page);
  await page.evaluate((k) => eval(k).go("rz_citta", 4, 7), K_); await page.waitForTimeout(500); await L.advance(page);
  if (w === 390) await L.shot(page, "rz_citta");
  // il tubo per il Bar Orbitale è chiuso finché non hai un lavoro
  await L.goAct(page, 12, 10).catch((e) => errors.push(String(e))); await page.waitForTimeout(150);
  { const busy = await page.evaluate((k) => eval(k).tubeBusy(), K_); if (!busy) errors.push("il tubo non parte"); }
  if (w === 390) { await page.waitForTimeout(350); await L.shot(page, "rz_tubo"); }
  for (let i = 0; i < 40 && (await page.evaluate((k) => eval(k).tubeBusy(), K_)); i++) await page.waitForTimeout(100);
  await page.waitForTimeout(200);
  { const t = await tile(page); if (t[0] !== 20 || t[1] !== 10) errors.push("il tubo non porta oltre il canale: " + t); }
  { const bad = await reachTubes(page, "rz_citta"); if (bad.length) errors.push("rz_citta irraggiungibile: " + bad.join(", ")); }
  await L.goAct(page, 21, 14); await page.waitForTimeout(200); await L.advance(page);
  if (await page.evaluate((k) => eval(k).tubeBusy(), K_)) errors.push("il tubo chiuso è partito lo stesso");
  await L.goAct(page, 21, 5); await L.advance(page); if ((await L.zone(page)) !== "rz_sede") errors.push("non si entra nella Razzopacco");
  await L.talk(page, "rz_ottavia"); await L.advance(page);
  let i = await info(page); if (i.step[1] !== 2 || i.flags.rz_pk !== "plof") errors.push("il pacco del Signor Plof: " + JSON.stringify([i.step, i.flags.rz_pk]));
  if (w === 390) { await page.evaluate((k) => eval(k).go("rz_citta", 21, 6), K_); await page.waitForTimeout(500); await L.advance(page); await L.shot(page, "rz_pacco"); } else { await page.evaluate((k) => eval(k).go("rz_citta", 21, 6), K_); await page.waitForTimeout(500); await L.advance(page); }
  await tube(page, 21, 14);
  if ((await tile(page)).join() !== "24,19") errors.push("il tubo del Bar Orbitale non porta alla piattaforma: " + (await tile(page)));
  await L.talk(page, "rz_plof"); await L.advance(page);
  i = await info(page); if (i.step[1] !== 3 || !i.flags.rz_fatto_plof || i.flags.rz_pk) errors.push("consegna al Signor Plof: " + JSON.stringify([i.step, i.flags.rz_fatto_plof, i.flags.rz_orario_plof]));
  await tube(page, 19, 21); if ((await tile(page)).join() !== "19,13") errors.push("il tubo di ritorno: " + (await tile(page)));
  await tube(page, 19, 12);
  await L.stubMatch(page, true); await L.talk(page, "rz_ferruccio"); await page.evaluate(() => window.T_.click("La partitella dei robot")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "rz_robot") errors.push("partitella dei robot non a scelta");
  await tube(page, 12, 10);
  await L.talk(page, "rz_zeta"); await page.evaluate(() => window.T_.click("Sfida la OmniPacco Express")); await page.waitForTimeout(500);
  if (!(await rnStart(page))) errors.push("Consegna a Rete non si apre");
  // un comando vero: un tocco sul campo (il razzo vola lì) e il pulsante LANCIA (il pacco parte)
  const box = await page.evaluate(() => { const r = document.querySelector(".rnOv canvas").getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  await page.mouse.click(box[0] + box[2] * 0.85, box[1] + box[3] * 0.3); await page.waitForTimeout(400);
  const mv = await page.evaluate(() => { const S = window.__consegna.state, H = S.ships[0]; return [Math.round(H.x), Math.round(H.y), !!S.tgt || H.x > 115]; });
  if (!(mv[0] > 112) || !(mv[1] < 100)) errors.push("Consegna a Rete, il razzo non va dove tocchi: " + mv);
  if (w === 390) await L.shot(page, "rz_consegna");
  await page.evaluate(() => { const S = window.__consegna.state; S.parcel.own = S.ships[0]; document.querySelector(".rnOv .thr").disabled = false; document.querySelector(".rnOv .thr").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); });
  await page.waitForTimeout(150);
  { const st = await page.evaluate(() => { const S = window.__consegna.state; return [S.data.lanci, S.parcel.own ? "a bordo" : "in volo"]; }); if (st[0] !== 1 || st[1] !== "in volo") errors.push("Consegna a Rete, LANCIA: " + JSON.stringify(st)); }
  await rnEnd(page, 2, 0); await L.advance(page);
  i = await info(page); if (i.step[1] !== 4) errors.push("dopo la OmniPacco Express: " + JSON.stringify(i.step));
  await page.evaluate((k) => eval(k).go("rz_sede", 7, 9), K_); await page.waitForTimeout(500); await L.advance(page);
  await L.talk(page, "rz_ottavia"); await L.advance(page, [w === 390 ? "Firmo" : "mese di prova"]);
  i = await info(page); if (!i.done[1] || !(w === 390 ? i.flags.rz_contratto : i.flags.rz_prova)) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Razzopacco · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const fl = { rz_contratto: true, rz_fatto_plof: true, rz_orario_plof: true };
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "contratto" }, diffSet: true, intro: { ch1: 1, rz_crio: 1, rz_citta: 1, rz_sede: 1 }, st: { ditta: 3 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__razzo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if (w === 390) await L.shot(page, "rz_razzo");
  await L.talk(page, "rz_borea"); await L.advance(page);
  let i = await info(page); if (i.step[2] !== 1 || i.flags.rz_pk !== "minestra") errors.push("il mestolo: " + JSON.stringify([i.step, i.flags.rz_pk]));
  // la rotta: la console, la mappa stellare, il volo
  await L.goAct(page, 5, 2); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.querySelector(".rzMap")))) errors.push("la rotta non si apre");
  if (w === 390) await L.shot(page, "rz_rotta");
  await page.evaluate(() => [...document.querySelectorAll(".rzMap .list button")].find((b) => /Brodo/.test(b.textContent)).click());
  await page.waitForTimeout(2200); await L.advance(page);
  if ((await L.zone(page)) !== "rz_brodo") errors.push("la rotta non porta al Pianeta Brodo: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "rz_brodo");
  { const bad = await reachTubes(page, "rz_brodo"); if (bad.length) errors.push("rz_brodo irraggiungibile: " + bad.join(", ")); }
  await tube(page, 8, 16); await L.talk(page, "rz_minestra"); await L.advance(page);
  i = await info(page); if (i.step[2] !== 2 || !i.flags.rz_fatto_minestra) errors.push("consegna alla Gran Cuoca: " + JSON.stringify(i.step));
  await tube(page, 22, 11); await tube(page, 9, 20);
  await L.stubMatch(page, true); await L.talk(page, "rz_crostino"); await page.evaluate(() => window.T_.click("Sfida I Crostini")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "rz_crostini") errors.push("sfida dei Crostini non a scelta");
  await tube(page, 16, 17); await L.goAct(page, 4, 15); await L.advance(page);
  if ((await L.zone(page)) !== "rz_razzo") errors.push("non si rientra nel razzo: " + (await L.zone(page)));
  await L.talk(page, "rz_timbro"); await L.advance(page, [w === 390 ? "Usa il timbro falso" : "Passo di nascosto"]);
  i = await info(page); if (i.step[2] !== 3 || i.flags.rz_pk !== "archivio") errors.push("il pacco per l'Archivista: " + JSON.stringify([i.step, i.flags.rz_pk]));
  await page.evaluate((k) => eval(k).rotta(), K_); await page.waitForTimeout(200); await page.evaluate(() => [...document.querySelectorAll(".rzMap .list button")].find((b) => /Luna/.test(b.textContent)).click()); await page.waitForTimeout(2200); await L.advance(page);
  if ((await L.zone(page)) !== "rz_luna") errors.push("la rotta non porta sulla Luna: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "rz_luna");
  { const bad = await L.reachAll(page, "rz_luna"); if (bad.length) errors.push("rz_luna irraggiungibile: " + bad.join(", ")); }
  if (w === 320) {
    // senza timbro falso gli ispettori ti vedono e ti rimandano al razzo
    await page.evaluate(() => { const TW = window.__tr.TW; TW.x = 10 * 16 + 8; TW.y = 8 * 16 + 12; }); await page.waitForTimeout(1800);
    const back = await tile(page); if (back.join() !== "3,16") errors.push("l'ispettore non ti vede: " + back);
    await L.advance(page);
  }
  await page.evaluate(() => { window.__noGuards = true; });
  await page.evaluate(() => { const TW = window.__tr.TW; TW.x = 25 * 16 + 8; TW.y = 6 * 16 + 12; }); await page.waitForTimeout(200);
  await L.talk(page, "rz_archivista"); await L.advance(page);
  i = await info(page); if (i.step[2] !== 4 || !i.flags.rz_dossier) errors.push("l'Archivista e il fascicolo: " + JSON.stringify([i.step, i.flags.rz_dossier]));
  await page.evaluate(() => { window.__noGuards = false; });
  await page.evaluate((k) => eval(k).go("rz_razzo", 7, 9), K_); await page.waitForTimeout(500); await L.advance(page);
  await L.talk(page, "rz_borea"); await page.evaluate(() => window.T_.click("Gioca la semifinale")); await page.waitForTimeout(500);
  if (!(await rnStart(page))) errors.push("la semifinale non si apre");
  await rnEnd(page, 2, 1); await L.advance(page);
  await L.talk(page, "rz_ferruccio"); await L.advance(page, [w === 390 ? "Tienilo sigillato" : "Aprilo adesso"]);
  i = await info(page); if (!i.done[2] || !(w === 390 ? i.flags.rz_sigillato : i.flags.rz_aperto) || !i.flags.rz_arena_ok) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Razzopacco · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = { rz_contratto: true, rz_arena_ok: true, [w === 390 ? "rz_sigillato" : "rz_aperto"]: true, rz_dossier: true };
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 9 }, done: { 1: "contratto", 2: w === 390 ? "sigillato" : "aperto" }, diffSet: true, intro: { ch1: 1, ch2: 1, rz_citta: 1, rz_razzo: 1 }, st: { ditta: 6 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__razzo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if (w === 390) await L.shot(page, "rz_arena");
  { const bad = await reachTubes(page, "rz_arena"); if (bad.length) errors.push("rz_arena irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "rz_ottavia"); await L.advance(page);
  await tube(page, 21, 19); await L.goAct(page, 26, 15); await L.advance(page);
  if ((await L.zone(page)) !== "rz_omni") errors.push("non si entra nella torre: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "rz_omni");
  await L.talk(page, "rz_orsola"); await L.advance(page, [w === 390 ? "Raccontami" : "Basta chiacchiere"]);
  let i = await info(page); if (i.step[3] !== 2 || (w === 390 && !i.flags.rz_orsola_ascoltata)) errors.push("Orsola: " + JSON.stringify([i.step, i.flags.rz_orsola_ascoltata]));
  await page.evaluate((k) => eval(k).go("rz_arena", 15, 20), K_); await page.waitForTimeout(500); await L.advance(page);
  await L.talk(page, "rz_ottavia"); await L.advance(page, [w === 390 ? "La Capitana Borea" : "Ferruccio"]);
  await L.talk(page, "rz_orsola"); await page.evaluate(() => window.T_.click("Gioca la finale")); await page.waitForTimeout(500);
  const mate = await page.evaluate(() => window.__consegna.state && window.__consegna.state.ships[1].p.name); if (mate !== (w === 390 ? "Capitana Borea" : "Ferruccio")) errors.push("finale, il compagno: " + mate);
  await rnStart(page); await rnEnd(page, 3, 1); await L.advance(page);
  if (w === 390) await L.shot(page, "rz_finale");
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["rz_citta", "rz_brodo", "rz_luna"].forEach((z) => { r.got[z] = ((Z[z] && Z[z].items) || []).map((_, k) => k); }); });
  await page.evaluate((k) => { const K = eval(k); ["plof", "minestra", "archivio"].forEach((id) => K.F.set("rz_orario_" + id, true)); }, K_);
  const ends = [["cosa c'è in fondo al magazzino", {}], ["Orsola, vieni con noi", { rz_orsola_ascoltata: true }], ["il pacco sigillato", { rz_sigillato: true }], ["resta com'è", {}]];
  for (const [e, f] of ends) {
    await page.evaluate(([k, f]) => { const K = eval(k); Object.keys(f).forEach((x) => K.F.set(x, f[x])); K.setStep(3, 4); K.enterZone("rz_arena"); }, [K_, f]); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "rz_ottavia"); await L.advance(page, [e]);
  }
  i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate((k) => eval(k).mem().ends.length, K_); if (n < 4) errors.push("finali trovati " + n + " su 4");
  const m = await page.evaluate(() => { const x = window.__salone.machine("consegna"); return x && x.eng; }); if (m !== "__consegna") errors.push("cabinato di Consegna a Rete mancante");
  L.check(`Razzopacco · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ razzo:", e.stack); process.exit(1); });
