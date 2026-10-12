// tests/lib.cjs - aiuti comuni per i test automatici (Playwright + Chromium)
// Aprono il gioco come su un telefono, camminano nelle zone, parlano con i personaggi, scelgono nei dialoghi
// e controllano che non ci siano errori in console. Ogni saga sul motore comune si prova con setup({ mod, key }).
const path = require("path");
function loadPW() { for (const p of ["playwright", "/opt/node22/lib/node_modules/playwright"]) { try { return require(p); } catch (e) {} } throw new Error("Playwright non trovato: npm i --no-save playwright"); }
const { chromium } = loadPW();
const fs = require("fs");
const BASE = process.env.TEST_URL || "http://localhost:8765";
const EXE = process.env.PW_CHROMIUM || (fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const OUT = process.env.TEST_SHOTS || path.join(__dirname, "shots");
require("fs").mkdirSync(OUT, { recursive: true });
const HERO = { v: 1, name: "Rondo", num: 7, style: "messy", hair: "#2b1d14", eye: "#2563eb", skin: "#e0ac7e", shirt: "#1f5fbf", acc: "none", shot: "parabola" };

async function setup(o = {}) {
  const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: o.w || 390, height: o.h || 800 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message + "\n" + (e.stack || "").split("\n").slice(0, 3).join("\n")));
  await page.addInitScript(([hero, save, key, extra]) => {
    if (sessionStorage.getItem("__init")) return; sessionStorage.setItem("__init", "1");
    localStorage.setItem("ali-di-rondine.campione", JSON.stringify(hero));
    if (save) localStorage.setItem(key, JSON.stringify(save)); else localStorage.removeItem(key);
    Object.keys(extra || {}).forEach((k) => localStorage.setItem(k, JSON.stringify(extra[k]))); // altri salvataggi di prova (setup({ extra: { chiave: valore } }))
  }, [HERO, o.save || null, o.key, o.extra || null]);
  // solo file del gioco: le richieste esterne (font, statistiche) si bloccano, così il test non dipende dalla rete
  await page.route((u) => !String(u).startsWith(BASE), (r) => r.fulfill({ status: 200, contentType: /\.css|fonts\.googleapis/.test(r.request().url()) ? "text/css" : "text/plain", body: "" }));
  await page.goto(BASE + "/index.html?debug", { waitUntil: "domcontentloaded" });
  await page.waitForFunction((mod) => window.__borgoApi && window.__ali && window.__tr && (!mod || (window[mod] && window[mod]._dbg && Object.keys(window[mod]._dbg.CHAPTERS).length > 0)), o.mod || null, { timeout: 30000 });
  await page.evaluate((mod) => { window.__MOD = mod; }, o.mod || null);
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const T = (window.T_ = {});
    T.btns = () => [...document.querySelectorAll("#choices button")].filter((b) => b.offsetParent !== null).map((b) => ({ b, t: b.innerText.replace(/\s+/g, " ").trim(), d: b.disabled }));
    T.walk = () => document.body.classList.contains("borgo") && window.__ali.view && window.__ali.view.kind === "trasf";
    T.click = (re) => { const x = T.btns().find((o) => !o.d && new RegExp(re, "i").test(o.t)); if (!x) return false; x.b.click(); return x.t; };
    T.solidAt = (m, z, x, y) => { const c = m[y] && m[y][x]; if (c === undefined) return true; if (typeof z.pass === "function" && (z.pass() || "").includes(c)) return false; return "~#TSGMORWLNHBDW".includes(c) || (z.solid && z.solid.includes(c)); };
    T.npcTiles = () => { const TW = window.__tr.TW; return (TW.z.npcs || []).filter((n) => !n.ghost).map((n) => n.at); };
    T.bfs = (m, z, sx, sy, npcs) => {
      const H = m.length, W = m[0].length, seen = Array.from({ length: H }, () => Array(W).fill(false)), q = [[sx, sy]]; seen[sy][sx] = true;
      const occ = new Set((npcs || []).map((a) => a[0] + "," + a[1]));
      while (q.length) { const [x, y] = q.shift(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny][nx]) return; if (T.solidAt(m, z, nx, ny) || occ.has(nx + "," + ny)) return; seen[ny][nx] = true; q.push([nx, ny]); }); }
      return seen;
    };
    // si posiziona accanto al bersaglio (tessera o PNG) camminando su tessere raggiungibili, e preme Azione
    T.reachAdj = (tx, ty) => {
      const TW = window.__tr.TW, m = TW.map, z = TW.z, cx = Math.floor(TW.x / 16), cy = Math.floor((TW.y - 4) / 16);
      const seen = T.bfs(m, z, cx, cy, T.npcTiles());
      for (const [dx, dy, dir] of [[0, 1, "up"], [0, -1, "down"], [-1, 0, "right"], [1, 0, "left"]]) { const ax = tx + dx, ay = ty + dy; if (seen[ay] && seen[ay][ax]) return { ax, ay, dir }; }
      return null;
    };
    T.goAct = (tx, ty) => {
      const TW = window.__tr.TW, r = T.reachAdj(tx, ty); if (!r) return "UNREACHABLE " + tx + "," + ty;
      TW.x = r.ax * 16 + 8; TW.y = r.ay * 16 + 12; TW.dir = r.dir; return "ok";
    };
    T.npcAt = (id) => { const n = (window.__tr.TW.z.npcs || []).find((n) => n.id === id); return n ? n.at : null; };
  });
  return { browser, page, errors };
}
async function act(page) { await page.waitForTimeout(140); const t = await page.evaluate(() => { const b = document.getElementById("bAct"); const tt = b && b.textContent; if (b && !b.disabled) b.click(); return tt; }); await page.waitForTimeout(80); return t; }
async function goAct(page, x, y) { const r = await page.evaluate(([x, y]) => window.T_.goAct(x, y), [x, y]); if (r !== "ok") throw new Error(r); return act(page); }
async function talk(page, id) { const at = await page.evaluate((id) => window.T_.npcAt(id), id); if (!at) throw new Error("PNG assente: " + id); return goAct(page, at[0], at[1]); }
// fa avanzare dialoghi e scelte finché si torna a camminare (o finché nessuna preferenza combacia)
async function advance(page, prefs = [], max = 300) {
  const log = [];
  for (let i = 0; i < max; i++) {
    await page.waitForTimeout(60);
    const st = await page.evaluate((prefs) => {
      const T = window.T_; if (T.walk()) return { walk: true };
      if (T.btns().some((o) => /^Capitoli Rigioca/.test(o.t))) return { walk: true, menu: true };
      const bs = T.btns(); const names = bs.map((o) => o.t);
      for (const p of prefs) { const r = T.click(p); if (r) return { clicked: r }; }
      for (const p of ["^Continua ▸", "^Avanti", "^Ok", "^Prosegui", "^Normale L'equilibrio"]) { const r = T.click(p); if (r) return { clicked: r }; }
      return { stuck: names };
    }, prefs.map(String).map((s) => s.replace(/^\/|\/[a-z]*$/g, "")));
    if (st.walk) return log;
    if (st.stuck) { if (st.stuck.length === 0) { await page.waitForTimeout(200); continue; } throw new Error("BLOCCO: " + JSON.stringify(st.stuck) + " dopo " + JSON.stringify(log.slice(-8))); }
    log.push(st.clicked);
  }
  throw new Error("advance: troppi passi " + JSON.stringify(log.slice(-10)));
}
async function shot(page, name) { await page.waitForTimeout(250); await page.screenshot({ path: OUT + "/" + name + ".png" }); }
async function stubMatch(page, win = true) { await page.evaluate((win) => { window.__borgoApi.matchPick = (cfg) => { window.__lastMatch = { id: cfg.id, alt: cfg.alt, mate: cfg.mate, azPitch: cfg.azPitch, venue: !!cfg.venue, intro: cfg.intro, oppNames: cfg.oppNames }; setTimeout(() => cfg.onDone(win ? { a: 3, b: 0, win: true, recap: "" } : { a: 0, b: 2, win: false, recap: "" }), 30); }; }, win); }
async function info(page) { return page.evaluate(() => window[window.__MOD].info()); }
async function zone(page) { return page.evaluate(() => window.__borgoApi.trZone()); }
// raggiungibilità di tutto quello che c'è in una zona (dopo aver scritto tutte le pagine)
async function reachAll(page, zid) {
  return page.evaluate((zid) => {
    const D = window[window.__MOD]._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z);
    const T = window.T_, st = spec.start, npcs = (z.npcs || []).map((n) => n.at);
    const seen = T.bfs(m, z, st[0], st[1], npcs), bad = [];
    const adj = (x, y) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    (spec.items || []).forEach(([x, y]) => { if (!(seen[y] && seen[y][x])) bad.push("goccia " + x + "," + y); });
    for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) { const c = m[y][x]; if (z.act[c] && "_zQ".indexOf(c) < 0 && "tjyaewfcdo".indexOf(c) < 0 && !adj(x, y) && !(seen[y] && seen[y][x])) bad.push("oggetto " + c + " " + x + "," + y); }
    (spec.npcs ? spec.npcs(99) : []).concat(spec.npcs ? spec.npcs(0) : []).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at); if (T.solidAt(m, z, n.at[0], n.at[1])) bad.push("png su solido " + n.id); });
    if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
    return bad;
  }, zid);
}
// esito: stampa e ricorda gli errori
function check(name, errors) { if (errors.length) { console.error("✗ " + name + "\n  " + errors.join("\n  ")); process.exitCode = 1; } else console.log("✓ " + name); }
module.exports = { check, BASE, setup, act, goAct, talk, advance, shot, stubMatch, info, zone, reachAll, OUT };
