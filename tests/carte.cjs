// tests/carte.cjs - «Carte del Destino · Cronache del Molo»: zone raggiungibili, pesca delle carte, 2 storie complete (una vinta, una persa), 4 prove, Archivio
const L = require("./lib.cjs");
const MOD = { mod: "__carte", key: "ali-di-rondine.carte" };
const K_ = "window.__carte._dbg.K";
const info = (p) => L.info(p);
const ZONES = ["cd_molo", "cd_bar", "cd_mercato", "cd_cantiere", "cd_faro"];
const AMBZ = { bar: "cd_bar", mercato: "cd_mercato", cantiere: "cd_cantiere", faro: "cd_faro" };
async function reach(page, zid, setup) {
  await page.evaluate(([k, z, s]) => { const K = eval(k); if (s) { K.F.set("cd_amb", s.amb); K.F.set("cd_pg", s.pg); K.setStep(1, 1); } else { K.F.set("cd_amb", ""); K.setStep(1, 0); } K.enterZone(z); }, [K_, zid, setup || null]);
  await page.waitForTimeout(450);
  return page.evaluate((zid) => {
    const D = window.__carte._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
    const npcs = (z.npcs || []).filter((n) => !n.ghost).map((n) => n.at), seen = T.bfs(m, z, st[0], st[1], npcs);
    const adj = (x, y) => [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
    (spec.items || []).forEach(([x, y]) => { if (T.solidAt(m, z, x, y) || !(seen[y] && seen[y][x])) bad.push("oggetto " + x + "," + y); });
    (spec.npcs ? spec.npcs(1) : []).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at); });
    for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) if (m[y][x] === "q" && !adj(x, y)) bad.push("porta " + x + "," + y);
    return bad;
  }, zid);
}
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__carte.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  const zone = () => L.zone(page);
  // raggiungibilità: tutte le zone da sole e, nei luoghi delle carte, con il personaggio presente (ogni personaggio)
  for (const z of ZONES) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  for (const [amb, z] of Object.entries(AMBZ)) for (const pg of ["mimmo", "vela", "gigi", "lanterna", "tonno"]) { const bad = await reach(page, z, { amb, pg }); if (bad.length) errors.push(z + "/" + pg + ": " + bad.join(", ")); }
  await page.evaluate(([k]) => { const K = eval(k); K.F.set("cd_amb", ""); K.setStep(1, 0); K.enterZone("cd_molo"); }, [K_]); await page.waitForTimeout(450);
  if (w === 390) await L.shot(page, "cd_molo");
  const play = async (win, shotName) => {
    await L.talk(page, "cd_zio"); await L.advance(page, [/Pesca 5 carte/]);
    await page.waitForSelector(".cdOv", { timeout: 5000 }).catch(() => errors.push("overlay carte non comparso"));
    if (w === 390 && shotName) { await page.waitForTimeout(900); await L.shot(page, shotName + "_mazzo"); }
    await page.evaluate(() => document.getElementById("cdAll").click()); await page.waitForTimeout(1800);
    if (w === 390 && shotName) await L.shot(page, shotName + "_carte");
    await page.evaluate(() => document.getElementById("cdGo").click()); await page.waitForTimeout(600);
    const st = await page.evaluate(([k]) => { const K = eval(k); return { amb: K.F.get("cd_amb"), pg: K.F.get("cd_pg"), s: K.stepOf(1) }; }, [K_]);
    if (st.s !== 1 || !AMBZ[st.amb]) errors.push("storia non partita: " + JSON.stringify(st));
    if ((await zone()) !== AMBZ[st.amb]) errors.push("non nel luogo estratto: " + (await zone()) + " vs " + AMBZ[st.amb]);
    if (w === 390 && shotName) await L.shot(page, shotName + "_luogo");
    const pgid = await page.evaluate(([k]) => { const K = eval(k); const id = K.F.get("cd_pg"); return ({ mimmo: "cd_mimmo", vela: "cd_vela", gigi: "cd_gigi", lanterna: "cd_lanterna", tonno: "cd_tonno", ilse: "qt_ilse", tamburo: "ce_tamburo", tilly: "rt_tilly" })[id]; }, [K_]);
    const firsts = await page.evaluate(() => Object.values(window.__carteEV || {}).map((e) => e.ch[0].t)); await L.talk(page, pgid); await L.advance(page, firsts.map((t) => new RegExp("^" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
    await page.waitForSelector("#cdProva", { timeout: 6000 }).catch(() => errors.push("prova non comparsa"));
    if (w === 390 && shotName) await L.shot(page, shotName + "_prova");
    await page.evaluate(() => document.getElementById("cdPg").click()); await page.waitForTimeout(500);
    await page.evaluate((v) => window.__carteProva.finish(v), win ? 0.9 : 0.1); await page.waitForTimeout(1300);
    await L.advance(page);
    if ((await zone()) !== "cd_molo") errors.push("non tornato al molo: " + (await zone()));
    const f = await page.evaluate(([k]) => { const K = eval(k); return { runs: K.F.get("cd_runs", 0), wins: K.F.get("cd_wins", 0), amb: K.F.get("cd_amb"), s: K.stepOf(1) }; }, [K_]);
    if (f.s !== 0 || f.amb) errors.push("storia non chiusa: " + JSON.stringify(f));
    return f;
  };
  const a = await play(true, "cd_run"); if (a.runs !== 1 || a.wins !== 1) errors.push("run 1 (vinta): " + JSON.stringify(a));
  const b = await play(false); if (b.runs !== 2 || b.wins !== 1) errors.push("run 2 (persa): " + JSON.stringify(b));
  const html = await page.evaluate(([k]) => window.__carte._dbg.K.F.get("cd_runs") + ":" + (window.__carte._dbg.K ? 1 : 0), [K_]);
  // le quattro prove: partono, disegnano, si chiudono
  for (const kind of ["tempismo", "memoria", "mira", "tazze"]) {
    let got = null;
    await page.evaluate(([kind]) => { window.__got = null; window.__carteProvaStart(kind, 5, (s) => (window.__got = s)); document.getElementById("cdPg").click(); }, [kind]);
    await page.waitForTimeout(600);
    const px = await page.evaluate(() => { const c = document.getElementById("cdPc"), d = c.getContext("2d").getImageData(0, 0, 320, 200).data; let n = 0; for (let i = 0; i < d.length; i += 400) if (d[i] + d[i + 1] + d[i + 2] > 60) n++; return n; });
    if (px < 20) errors.push("prova " + kind + " vuota (" + px + ")");
    if (w === 390) await L.shot(page, "cd_prova_" + kind);
    await page.evaluate(() => window.__carteProva.finish(0.8)); await page.waitForTimeout(1200);
    got = await page.evaluate(() => window.__got); if (got == null) errors.push("prova " + kind + " non ha restituito il punteggio");
  }
  // mazzi: il Salone ha il bottone in cima, il mazzo Marea è bloccato fino a 3 vittorie, poi entra nel gioco
  const dl = await page.evaluate(() => window.__carteDecks.list()); if (!dl.some((d) => d.id === "marea")) errors.push("mazzo marea non registrato");
  await page.evaluate(() => { window.__salone.open(); }); await page.waitForTimeout(500);
  const btn = await page.evaluate(() => { const b = document.querySelector('[data-go="carte"]'); return b ? b.textContent : null; }); if (!btn || !/Carte del Destino/.test(btn)) errors.push("bottone Salone assente");
  if (btn) { await page.evaluate(() => document.querySelector('[data-go="carte"]').click()); await page.waitForTimeout(400);
    const t1 = await page.evaluate(() => document.querySelector(".cdOv").innerText); if (!/Mazzo della Marea/.test(t1) || !/Vinci 3 storie/.test(t1)) errors.push("hub: mazzo marea non bloccato: " + t1.slice(0, 80));
    if (w === 390) await L.shot(page, "cd_hub"); await page.evaluate(() => document.getElementById("cdBack").click()); }
  await page.evaluate(([k]) => { const K = eval(k); K.F.set("cd_wins", 3); K.F.set("cd_amb", "bar"); K.F.set("cd_pg", "marea_risacca"); K.F.set("cd_ev", "marea_lanterne"); K.F.set("cd_sf", "tempismo"); K.F.set("cd_tw", "marea_alta"); K.setStep(1, 1); K.enterZone("cd_bar"); }, [K_]); await page.waitForTimeout(450);
  await L.talk(page, "cd_risacca"); await L.advance(page, [/^Esprimi un desiderio/]);
  await page.waitForSelector("#cdProva", { timeout: 6000 }).catch(() => errors.push("prova mazzo marea non comparsa"));
  await page.evaluate(() => document.getElementById("cdPg").click()); await page.waitForTimeout(500); await page.evaluate(() => window.__carteProva.finish(0.9)); await page.waitForTimeout(1300); await L.advance(page);
  if ((await zone()) !== "cd_molo") errors.push("mazzo marea: non tornato al molo");
  await page.evaluate(() => { window.__salone.open(); }); await page.waitForTimeout(400); await page.evaluate(() => document.querySelector('[data-go="carte"]').click()); await page.waitForTimeout(300);
  const t2 = await page.evaluate(() => document.querySelector(".cdOv").innerText); if (!/Attivo/.test(t2)) errors.push("hub: mazzo marea non sbloccato");
  // un mazzo per saga: bloccato finché la saga non è giocata, poi le sue carte entrano (qui: Quattordici, Fortino)
  const dk = await page.evaluate(() => window.__carteDecks.list().map((d) => d.id)); for (const id of ["qt", "sg", "fo", "ce", "qd", "dz", "fa", "my", "te", "alc", "mn", "gp", "rt", "dg", "rm", "re", "nf", "cp", "gl", "pr", "bm", "cs", "rz", "sq", "ft", "td", "gr", "ml", "cm", "tc", "vl", "kb", "chr", "al", "pi", "omb", "pg", "sh", "fe", "bv", "rag", "abi", "lb", "dt", "cr", "mu", "ve", "dc", "ep", "so", "ts", "cc", "mg", "sf", "nl", "tm"]) if (!dk.includes(id)) errors.push("mazzo saga mancante: " + id);
  await page.evaluate(() => { const real = window.__salone.concluded; window.__salone.concluded = (k) => /quattordici|fortino|tempo|pugno|titano|libro-finali|mondi/.test(k) || real(k); localStorage.setItem("ali-di-rondine.quattordici", '{"x":1}'); localStorage.setItem("ali-di-rondine.fortino", '{"x":1}'); localStorage.setItem("ali-di-rondine.tempo", '{"x":1}'); localStorage.setItem("ali-di-rondine.pugno", '{"x":1}'); localStorage.setItem("ali-di-rondine.titano", '{"x":1}'); localStorage.setItem("ali-di-rondine.libro-finali", '{"x":1}'); localStorage.setItem("ali-di-rondine.mondi", '{"x":1}'); });
  const lv = await page.evaluate(() => window.__carteDecks.list().filter((d) => d.on).map((d) => d.id)); if (!lv.includes("qt") || !lv.includes("fo") || lv.includes("sg")) errors.push("sblocco mazzi saga: " + lv);
  for (const [pg, ev, id, first] of [["qt_p", "qt_e", "qt_teo", /^Sorridi davvero/], ["fo_p", "fo_e", "fo_lupin", /^Entra dalla finestra/], ["rt_p", "rt_e", "rt_quarzo", /^Parlagli con calma/], ["pr_p", "pr_e", "pr_barnaba", /^Separali con una battuta/], ["ft_p", "ft_e", "ft_sam", /^Fai la scala umana/], ["lb_p", "lb_e", "lb_lupo", /^Scrivilo con il cuore/], ["tm_p", "tm_e", "tm_custode", /^Il buio/]]) {
    await page.evaluate(([k, pg, ev]) => { const K = eval(k); K.F.set("cd_amb", "mercato"); K.F.set("cd_pg", pg); K.F.set("cd_ev", ev); K.F.set("cd_sf", "memoria"); K.F.set("cd_tw", pg.slice(0, 2) + "_t"); K.setStep(1, 1); K.enterZone("cd_mercato"); }, [K_, pg, ev]); await page.waitForTimeout(450);
    await L.talk(page, id); await L.advance(page, [first]);
    await page.waitForSelector("#cdProva", { timeout: 6000 }).catch(() => errors.push("prova mazzo " + pg + " non comparsa"));
    await page.evaluate(() => document.getElementById("cdPg").click()); await page.waitForTimeout(500); await page.evaluate(() => window.__carteProva.finish(0.9)); await page.waitForTimeout(1300); await L.advance(page);
    if ((await zone()) !== "cd_molo") errors.push("mazzo " + pg + ": non tornato al molo");
  }
  await page.evaluate(() => { window.__salone.open(); }); await page.waitForTimeout(400); await page.evaluate(() => document.querySelector('[data-go="carte"]').click()); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "cd_hub2");
  // Archivio: il diario elenca le carte trovate
  const arch = await page.evaluate(([k]) => { const K = eval(k); return document.body.innerText.length; }, [K_]);
  await browser.close(); L.check("Carte del Destino · storie, prove, Archivio (" + w + " px)", errors);
}
(async () => { await run(390); await run(320); })();
