// tests/tavolo.cjs - «Il Tavolo di Sotto»: pulsanti in Salone e Squadra dei Sogni, run nuova, panchine (sacrifici), fischio e tabellone,
// premio dopo la vittoria, boss del Guardalinee (fuorigioco), fiammiferi e fine run (carta trattenuta), seconda frazione dell'Arbitro e finale (390 e 320 px)
const L = require("./lib.cjs");
const tv = (page, fn, arg) => page.evaluate(fn, arg);
async function story(page, max = 12) { for (let i = 0; i < max; i++) { const r = await page.evaluate(() => { const b = document.querySelector('#tvOv [data-n]'); if (b) { b.click(); return 1; } return 0; }); if (!r) return; await page.waitForTimeout(60); } }
async function btn(page, re) { const r = await page.evaluate((re) => { const b = [...document.querySelectorAll("#tvOv button")].find((x) => !x.disabled && new RegExp(re, "i").test(x.innerText)); if (b) { b.click(); return b.innerText; } return null; }, re); if (!r) throw new Error("manca il bottone " + re); await page.waitForTimeout(80); return r; }
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, h: 800 });
  try {
    await tv(page, () => { const S = window.__sogni; S.sync(); const r = S._load(); ["leo", "nico", "tommy", "ruggeri", "dario", "sara"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["leo", "nico", "tommy"]; S._save(r); localStorage.removeItem("ali-di-rondine.tavolo"); });
    await tv(page, () => window.__salone.open(() => {})); await page.waitForTimeout(200);
    if (!(await tv(page, () => !!document.querySelector('.salOv [data-go="tavolo"]')))) errors.push("manca il pulsante nel Salone");
    await tv(page, () => window.__salone.close());
    await tv(page, () => window.__sogni.open(() => {})); await page.waitForTimeout(200);
    if (!(await tv(page, () => !!document.querySelector('.sgOv [data-go="tavolo"]')))) errors.push("manca il pulsante nella Squadra dei Sogni");
    await tv(page, () => window.__sogni.close());
    await tv(page, () => window.__tavolo.open(() => {})); await page.waitForTimeout(100);
    await btn(page, "Nuova run"); await story(page);
    let st = await tv(page, () => { const s = window.__tavolo.state(); return { deck: s.R.deck.length, floor: s.R.floor, map: s.R.map.length, ids: s.R.deck.map((c) => c.id) }; });
    if (st.deck !== 6 || st.map !== 5) errors.push("run iniziale sbagliata: " + JSON.stringify(st));
    if (!st.ids.includes("leo")) errors.push("il mazzo non usa la Squadra dei Sogni: " + st.ids.join(","));
    await L.shot(page, "tv_mappa_" + w);
    // partita: raccattapalle in campo, poi una carta da una panchina che lo sacrifica
    await btn(page, "Partita"); await page.waitForTimeout(100);
    const p1 = await tv(page, () => { const T = window.__tavolo, B = T.state().B; const i = B.hand.findIndex((c) => c.id === "rp"); return T.play(i, 0, []); });
    if (!p1) errors.push("il raccattapalle non entra");
    const p2 = await tv(page, () => { const T = window.__tavolo, B = T.state().B; B.hand.push({ id: "prova", n: "Prova", e: "🧪", atk: 2, res: 2, hp: 2, cost: 1, sig: [], side: "p", uid: "pr" }); const ok0 = T.play(B.hand.length - 1, 1, []); const ok = T.play(B.hand.length - 1, 0, [0]); return { ok0, ok, lane0: B.mine[0] && B.mine[0].id }; });
    if (p2.ok0 || !p2.ok || p2.lane0 !== "prova") errors.push("panchine (sacrifici) non funzionano: " + JSON.stringify(p2));
    const b1 = await tv(page, () => { const T = window.__tavolo, B = T.state().B; B.theirs.fill(null); B.queue.fill(null); const s0 = B.scale; T.bell(); return { s0, s1: T.state().B.scale, phase: T.state().B.phase }; });
    if (!(b1.s1 > b1.s0) || b1.phase !== "draw") errors.push("il fischio non segna in corsia libera: " + JSON.stringify(b1));
    await tv(page, () => window.__tavolo.draw("rp"));
    await L.shot(page, "tv_partita_" + w);
    await tv(page, () => window.__tavolo._win()); await page.waitForTimeout(150);
    await btn(page, "⚽"); await page.waitForTimeout(100);
    st = await tv(page, () => { const s = window.__tavolo.state(); return { deck: s.R.deck.length, floor: s.R.floor }; });
    if (st.deck !== 7 || st.floor !== 1) errors.push("premio dopo la vittoria: " + JSON.stringify(st));
    // boss dell'atto I: il fuorigioco
    await tv(page, () => { const s = window.__tavolo.state(); s.R.floor = 4; window.__tavolo.node(0); }); await page.waitForTimeout(100); await story(page);
    const bs = await tv(page, () => { const B = window.__tavolo.state().B; return { boss: B.boss && B.boss.id, flag: !!document.querySelector("#tvOv .flag") }; });
    if (bs.boss !== "guardalinee" || !bs.flag) errors.push("boss del Guardalinee: " + JSON.stringify(bs));
    await tv(page, () => window.__tavolo._win()); await page.waitForTimeout(150); await story(page);
    st = await tv(page, () => { const s = window.__tavolo.state(); return { act: s.R.act, floor: s.R.floor, c: s.R.candles }; });
    if (st.act !== 2 || st.floor !== 0) errors.push("passaggio all'atto II: " + JSON.stringify(st));
    // sconfitte: un fiammifero, poi la fine della run e la carta trattenuta
    await tv(page, () => window.__tavolo._battle(false)); await tv(page, () => window.__tavolo._lose()); await page.waitForTimeout(150);
    if ((await tv(page, () => window.__tavolo.state().R.candles)) !== 1) errors.push("il fiammifero non si spegne");
    await story(page); await tv(page, () => window.__tavolo._lose()); await page.waitForTimeout(150); await story(page);
    const mo = await tv(page, () => window.__tavolo.load());
    if (mo.run || mo.kept.length !== 1) errors.push("fine run: " + JSON.stringify({ run: !!mo.run, kept: mo.kept }));
    // run nuova fino all'Arbitro: seconda frazione, poi il patto
    await btn(page, "Nuova run"); await story(page);
    const kept = await tv(page, () => window.__tavolo.state().R.deck.map((c) => c.id));
    if (kept.includes(mo.kept[0])) errors.push("la carta trattenuta è ancora nel mazzo");
    await tv(page, () => { const s = window.__tavolo.state(); s.R.act = 3; s.R.floor = 4; s.R.map[4] = ["boss"]; window.__tavolo.node(0); }); await page.waitForTimeout(100); await story(page);
    await tv(page, () => window.__tavolo._win()); await page.waitForTimeout(150);
    const p2s = await tv(page, () => { const B = window.__tavolo.state().B; return { p2: B && B.phase2, red: document.getElementById("tvOv").classList.contains("red") }; });
    if (!p2s.p2) errors.push("seconda frazione non partita: " + JSON.stringify(p2s));
    await story(page); await L.shot(page, "tv_frazione2_" + w);
    await tv(page, () => window.__tavolo._win()); await page.waitForTimeout(150); await story(page);
    await btn(page, "Accendi la luce"); await story(page);
    const fin = await tv(page, () => window.__tavolo.load());
    if (fin.wins !== 1 || !fin.ends.includes("luce") || fin.kept.length) errors.push("finale: " + JSON.stringify(fin));
    await tv(page, () => window.__tavolo.close());
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Tavolo di Sotto (${w} px)`, errors); await browser.close();
}
(async () => { for (const w of [390, 320]) await run(w); })();
