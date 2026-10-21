// js/arena.js - Arena dei Sogni e Torre dei Duelli: battaglia a turni con le carte della Squadra dei Sogni (js/sogni.js).
// Livelli e progressi vivono solo qui (chiave propria): non toccano Storia, Carriera né le stelle della Squadra dei Sogni.
// Tratti: Assalto (ATT) batte Mente (TEC), Mente batte Muro (DIF), Muro batte Assalto. Il tratto è la statistica più alta della carta.
(function () {
  "use strict";
  if (window.__arena) return;
  const KEY = "ali-di-rondine.arena";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const TR = { at: ["Assalto", "🔥", "#e8603a"], df: ["Muro", "🛡️", "#3a8ad8"], te: ["Mente", "🎯", "#a85ad8"] };
  const BEATS = { at: "te", te: "df", df: "at" }; // chi batte chi
  const ABIL = { A: ["Tiro Fuoco", "Colpo da 2,2× su un nemico"], C: ["Regia", "Squadra +25% danni per 2 round"], D: ["Muro Vivente", "Attira i colpi per 2 round e +45 scudo"], P: ["Parata Totale", "Scudo +30 a tutta la squadra"] };
  const ROLE = { A: "Attaccante", C: "Centrocampista", D: "Difensore", P: "Portiere" };
  const XPT = [0, 2, 5, 9, 14, 20, 27, 35, 44, 54]; // soglie livello 1..10
  const lvOf = (xp) => { let l = 1; XPT.forEach((t, i) => { if (xp >= t) l = i + 1; }); return l; };
  const MODS = [["Pioggia", "I danni sono −15%", { dmg: 0.85 }], ["Vento in poppa", "Le abilità si ricaricano un round prima", { cd: 1 }], ["Notte di coppa", "Colpi critici più frequenti", { crit: 0.12 }], ["Terreno pesante", "Tutti hanno +20% punti vita", { hp: 1.2 }]];
  const PERKS = [
    ["fuoco", "🔥 Colpo caldo", "+12% danni per il resto della salita"], ["scudo", "🛡️ Cuore di roccia", "−10% danni subiti per il resto della salita"],
    ["cura", "💚 Cura completa", "Tutta la squadra torna a piena salute"], ["torna", "✨ Ritorno", "Un caduto rientra al 50%"], ["pronte", "⚡ Abilità pronte", "Tutte le abilità subito disponibili"], ["telo", "🧤 Scudo iniziale", "+35 scudo a tutti a ogni piano"],
  ];
  let OV = null, BACK = null, B = null, FAST = false;
  // ------------------------------------------------------------ dati
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { xp: r.xp && typeof r.xp === "object" ? r.xp : {}, tier: Math.max(1, r.tier | 0), best: r.best | 0, run: r.run && r.run.team ? r.run : null, daily: r.daily || { d: "", won: false }, wins: r.wins | 0, bosses: r.bosses | 0 }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  const today = () => new Date().toISOString().slice(0, 10);
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const name = (id) => safe(() => S().name(id), id);
  const trOf = (c) => (c.at >= c.df && c.at >= c.te ? "at" : c.df >= c.te ? "df" : "te");
  // ------------------------------------------------------------ unità
  function mk(c, side, o) {
    const m = o.m || 1, st = o.st || { at: c.at, df: c.df, te: c.te };
    const at = st.at * m, df = st.df * m, te = st.te * m, hp = Math.round((70 + df * 1.1 + te * 0.4) * (o.hpm || 1));
    return { id: c.id, side, n: name(c.id), role: ABIL[c.role] ? c.role : { at: "A", te: "C", df: "D" }[trOf({ at, df, te })], rar: c.rar, tr: trOf({ at, df, te }), at, df, te, maxhp: hp, hp: o.hp != null ? Math.max(1, Math.min(hp, o.hp)) : hp, shield: 0, cd: 1, taunt: 0, def: false, boss: !!o.boss };
  }
  function ownTeam(r, ar) {
    const I = S().intesa(r.team).n, b = 1 + I * 0.015;
    return r.team.map((id) => { const c = S().BY[id]; if (!c) return null; const e = S().eff(c), lv = lvOf(ar.xp[id] | 0); return { c, st: e, m: b * (1 + (lv - 1) * 0.04) }; }).filter(Boolean);
  }
  function enemyTeam(rand, tier, theme, n) {
    const all = S().CARDS.filter((c) => !theme || c.saga === theme), pool = all.length >= 3 ? all : S().CARDS, out = [], used = {};
    const want = ["D", "A", "C", "A", "P"];
    for (let i = 0; i < (n || 5); i++) {
      let list = pool.filter((c) => c.role === want[i] && !used[c.id]); if (!list.length) list = pool.filter((c) => !used[c.id]); if (!list.length) list = S().CARDS.filter((c) => !used[c.id]);
      const c = list[Math.floor(rand() * list.length)]; used[c.id] = 1; out.push(c);
    }
    return out;
  }
  // ------------------------------------------------------------ battaglia
  function start(cfg) {
    const r = load(), team = (cfg.team || ownTeam(S()._load(), r)).map((o) => { const u = mk(o.c, "p", { st: o.st, m: o.m, hp: cfg.hp && cfg.hp[o.c.id], hpm: cfg.mod && cfg.mod.hp }); return u; });
    const tm = cfg.tierM || 1, foes = cfg.foes.map((c, i) => mk(c, "e", { m: tm, boss: cfg.boss && i === 0, hpm: (cfg.boss && i === 0 ? 2.2 : 1) * ((cfg.mod && cfg.mod.hp) || 1) }));
    const P = cfg.perks || [];
    team.forEach((u) => { if (P.includes("telo")) u.shield = 35; if (P.includes("pronte")) u.cd = 0; if (cfg.mod && cfg.mod.cd) u.cd = Math.max(0, u.cd - 1); });
    B = { team, foes, round: 0, order: [], i: -1, cur: null, mode: null, buffT: 0, buffE: 0, over: null, log: [], cfg, perks: P, rand: cfg.seed != null ? rng(cfg.seed) : Math.random, wait: null };
    render(); nextRound(); return B;
  }
  const alive = (a) => a.filter((u) => u.hp > 0);
  const delay = (fn, ms) => { if (FAST) return fn(); B.wait = setTimeout(fn, ms); };
  function nextRound() {
    B.round++; B.order = alive(B.team).concat(alive(B.foes)).map((u) => [u, u.te + B.rand() * 14]).sort((a, b) => b[1] - a[1]).map((x) => x[0]); B.i = -1;
    B.team.concat(B.foes).forEach((u) => { if (u.hp > 0) { if (u.cd > 0) u.cd--; if (u.taunt > 0) u.taunt--; u.def = false; } });
    if (B.buffT > 0) B.buffT--; if (B.buffE > 0) B.buffE--;
    say(`Round ${B.round}`); step();
  }
  function say(t) { B.log.push(t); const el = OV && OV.querySelector(".arLog"); if (el) el.innerHTML = esc(t); }
  function step() {
    if (!B || B.over) return;
    if (!alive(B.foes).length) return end("win"); if (!alive(B.team).length) return end("lose");
    B.i++; if (B.i >= B.order.length) return nextRound();
    const u = B.order[B.i]; if (u.hp <= 0) return step();
    B.cur = u; B.mode = null;
    if (u.side === "p") { render(); return; } // tocca al giocatore
    render(); delay(() => enemyAct(u), 650);
  }
  function enemyAct(u) {
    if (!B || B.over || u.hp <= 0) return step();
    const T = alive(B.team), tk = T.filter((x) => x.taunt > 0), pool = tk.length ? tk : T;
    const weak = pool.slice().sort((a, b) => a.hp - b.hp)[0], tgt = B.rand() < 0.55 ? weak : pool[Math.floor(B.rand() * pool.length)];
    if (u.cd <= 0 && B.rand() < 0.6) ability(u, tgt); else attack(u, tgt);
  }
  function dmgCalc(a, d, mult) {
    const raw = a.at * 0.5 * (mult || 1) - d.df * 0.12, trM = BEATS[a.tr] === d.tr ? 1.3 : BEATS[d.tr] === a.tr ? 0.8 : 1;
    const cfgm = (B.cfg.mod && B.cfg.mod.dmg) || 1, crit = B.rand() < Math.min(0.5, a.te / 500 + ((B.cfg.mod && B.cfg.mod.crit) || 0));
    let buff = (a.side === "p" ? (B.buffT > 0 ? 1.25 : 1) * (B.perks.includes("fuoco") ? 1.12 : 1) : B.buffE > 0 ? 1.25 : 1);
    let v = Math.max(6, raw) * trM * cfgm * buff * (0.92 + B.rand() * 0.16) * (crit ? 1.5 : 1);
    if (d.side === "p" && B.perks.includes("scudo")) v *= 0.9; if (d.def) v *= 0.5;
    return { v: Math.max(1, Math.round(v)), crit, trM };
  }
  function hit(a, d, mult) {
    const x = dmgCalc(a, d, mult); let v = x.v;
    if (d.shield > 0) { const s = Math.min(d.shield, v); d.shield -= s; v -= s; }
    d.hp = Math.max(0, d.hp - v); pop(d, "-" + x.v, x.crit ? "crit" : x.trM > 1 ? "good" : x.trM < 1 ? "bad" : "");
    return x;
  }
  function attack(a, d) {
    const x = hit(a, d, 1); say(`${a.n} colpisce ${d.n}: ${x.v}${x.crit ? " critico!" : x.trM > 1 ? " (tratto favorevole)" : x.trM < 1 ? " (tratto sfavorevole)" : ""}${d.hp <= 0 ? " · KO" : ""}`);
    shake(d); finish(a);
  }
  function ability(a, tgt) {
    const A = ABIL[a.role] || ABIL.A; a.cd = 3; cutin(a, A[0]);
    const go = () => {
      if (!B || B.over) return;
      if (a.role === "A") { const x = hit(a, tgt, 2.2); say(`${a.n}: ${A[0]} su ${tgt.n} (${x.v})${tgt.hp <= 0 ? " · KO" : ""}`); shake(tgt); }
      else if (a.role === "C") { if (a.side === "p") B.buffT = 2; else B.buffE = 2; say(`${a.n}: ${A[0]}. Danni della squadra +25%`); }
      else if (a.role === "D") { a.taunt = 2; a.shield += 45; say(`${a.n}: ${A[0]}. Tutti i colpi su di lui`); pop(a, "+45🛡", "good"); }
      else { alive(a.side === "p" ? B.team : B.foes).forEach((u) => { u.shield += 30; pop(u, "+30🛡", "good"); }); say(`${a.n}: ${A[0]}. Scudo a tutta la squadra`); }
      finish(a);
    };
    FAST ? go() : (B.wait = setTimeout(go, 950));
  }
  function defend(a) { a.def = true; a.shield += 10; pop(a, "+10🛡", "good"); say(`${a.n} si copre`); finish(a); }
  function finish(a) { render(); delay(() => step(), 420); }
  function end(res) { B.over = res; render(); const f = B.cfg.onEnd; setTimeout(() => f && f(res, B), FAST ? 0 : 900); }
  // ------------------------------------------------------------ azioni del giocatore (anche per i test)
  function act(kind, targetId) {
    if (!B || B.over || !B.cur || B.cur.side !== "p") return false; const u = B.cur;
    if (kind === "defend") { defend(u); return true; }
    const T = alive(B.foes), tk = T.filter((x) => x.taunt > 0), pool = tk.length ? tk : T;
    const t = pool.find((x) => x.id === targetId) || pool.slice().sort((a, b) => a.hp - b.hp)[0];
    if (kind === "attack") { attack(u, t); return true; }
    if (kind === "ability") { if (u.cd > 0) return false; ability(u, t); return true; }
    return false;
  }
  // ------------------------------------------------------------ vista
  function css() {
    if (document.getElementById("arCss")) return; const st = document.createElement("style"); st.id = "arCss";
    st.textContent = `.arOv{position:fixed;inset:0;z-index:312;background:radial-gradient(ellipse at 50% 0,#2a1d4a,#0c0818 70%);color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto}
.arOv .wrap{max-width:560px;margin:0 auto;padding:10px 10px 28px}.arOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#0c0818;padding:6px 0;z-index:3}.arOv h2{margin:0;font:900 20px system-ui;color:#ffd23f}.arOv .x{width:40px;height:40px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#fff;font-size:17px}
.arOv .sum{font-size:13px;line-height:1.45;opacity:.9}.arOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}
.arOv .big{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.arOv .big button,.arOv .one{min-height:56px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px}.arOv .big button small{display:block;font-weight:400;font-size:11px;opacity:.75;margin-top:2px}.arOv button:disabled{opacity:.4}
.arOv .one{width:100%;margin:6px 0}.arOv .one small{display:block;font-weight:400;font-size:11px;opacity:.75}
.arRow{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:6px 0}.arU{position:relative;border-radius:9px;background:linear-gradient(160deg,var(--tc),#120e1e 80%);border:2px solid var(--tc);padding:3px;text-align:center;font-size:9.5px;overflow:hidden;transition:transform .15s,opacity .3s}
.arU .im{aspect-ratio:1;border-radius:6px;background:#0a0814;overflow:hidden;display:flex;align-items:center;justify-content:center}.arU .im img{width:100%;height:100%;object-fit:cover}.arU .nm{font-weight:800;line-height:1.1;min-height:2.2em;margin-top:2px}
.arU .hp{height:6px;border-radius:3px;background:#000a;margin-top:2px;overflow:hidden}.arU .hp i{display:block;height:100%;background:linear-gradient(90deg,#e8603a,#7ad87a)}.arU .sh{position:absolute;top:2px;left:3px;font-size:9px;font-weight:800;color:#9ad8ff;text-shadow:0 1px 0 #000}.arU .tag{position:absolute;top:2px;right:3px;font-size:10px}
.arU.cur{box-shadow:0 0 0 3px #ffd23f,0 0 14px #ffd23f88;transform:translateY(-3px)}.arU.ko{opacity:.3;filter:grayscale(1)}.arU.tg{cursor:pointer;animation:arPulse .8s infinite}.arU.shk{animation:arShake .3s}.arU.boss{box-shadow:0 0 0 2px #ff5a5a,0 0 12px #ff5a5a88}
@keyframes arPulse{50%{box-shadow:0 0 0 3px #ff7a7a}}@keyframes arShake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.arPop{position:absolute;left:50%;top:30%;transform:translateX(-50%);font:900 15px system-ui;color:#fff;text-shadow:0 1px 0 #000,0 0 4px #000;animation:arUp .9s forwards;pointer-events:none;z-index:4}.arPop.crit{color:#ffd23f;font-size:19px}.arPop.good{color:#7ad87a}.arPop.bad{color:#9aa5b1}
@keyframes arUp{to{transform:translate(-50%,-34px);opacity:0}}
.arLog{min-height:36px;font-size:13px;text-align:center;margin:6px 0;padding:6px;background:#1a1428;border-radius:8px}.arHd{display:flex;justify-content:space-between;font-size:12px;opacity:.85}
.arAct{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}.arAct button{min-height:50px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 13px system-ui;padding:6px}.arAct button small{display:block;font-weight:400;font-size:10px;opacity:.75}.arAct button:disabled{opacity:.4}
.arCut{position:absolute;left:0;right:0;top:34%;height:92px;overflow:hidden;z-index:6;pointer-events:none;background:linear-gradient(90deg,#000c,#3a1a6ccc 40%,#000c);border-top:3px solid #ffd23f;border-bottom:3px solid #ffd23f;animation:arCut 1.1s forwards;display:flex;align-items:center;gap:12px;padding:0 14px}
.arCut img{height:80px;width:80px;object-fit:cover;object-position:50% 20%;border-radius:50%;border:2px solid #ffd23f;animation:arSl .5s ease-out}.arCut b{font:900 22px system-ui;color:#ffd23f;text-shadow:0 2px 0 #000}.arCut span{display:block;font-size:12px;color:#fff}
@keyframes arCut{0%{opacity:0;transform:scaleY(.1)}12%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0}}@keyframes arSl{from{transform:translateX(-120px)}}
.arBt{position:relative}.arRes{text-align:center;margin:14px 0}.arRes h3{font:900 24px system-ui;margin:4px 0}.arPerk{display:grid;gap:6px}
@media (prefers-reduced-motion:reduce){.arU.tg,.arCut,.arPop{animation:none!important}}`;
    document.head.appendChild(st);
  }
  function shell(title) { css(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "arOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { if (B && !B.over && B.cfg.quit) return B.cfg.quit(); const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function close() { if (B && B.wait) clearTimeout(B.wait); B = null; if (OV) { OV.remove(); OV = null; } }
  const img = (id) => safe(() => S().port(id), null);
  function unit(u, cls, extra) {
    const t = TR[u.tr];
    return `<div class="arU ${cls || ""}${u.hp <= 0 ? " ko" : ""}${u.boss ? " boss" : ""}" data-u="${u.id}" data-s="${u.side}" style="--tc:${t[2]}">${u.shield > 0 ? `<span class="sh">🛡${u.shield}</span>` : ""}<span class="tag">${u.taunt > 0 ? "🎯" : t[1]}</span><div class="im">${img(u.id) ? `<img alt="" src="${img(u.id)}">` : "?"}</div><div class="nm">${esc(u.n)}</div><div class="hp"><i style="width:${Math.round((u.hp / u.maxhp) * 100)}%"></i></div></div>`;
  }
  function render() {
    if (!B) return; if (!OV || !OV.querySelector(".arBt")) shell(B.cfg.title || "⚔️ Arena dei Sogni");
    const body = OV.querySelector(".body"), u = B.cur, mine = u && u.side === "p" && !B.over;
    const tk = alive(B.foes).filter((x) => x.taunt > 0), tg = mine && B.mode === "attack";
    const act = mine ? `<div class="arAct"><button type="button" data-a="attack">⚔️ Attacca<small>${B.mode === "attack" ? "scegli il bersaglio" : "colpo normale"}</small></button><button type="button" data-a="ability" ${u.cd > 0 ? "disabled" : ""}>${esc(ABIL[u.role][0])}<small>${u.cd > 0 ? `pronta tra ${u.cd}` : esc(ABIL[u.role][1])}</small></button><button type="button" data-a="defend">🛡️ Difendi<small>danni −50%, +10 scudo</small></button></div>` : `<div class="arAct" style="opacity:.5"><button disabled>…</button><button disabled>…</button><button disabled>…</button></div>`;
    body.innerHTML = `<div class="arBt"><div class="arHd"><span>${esc(B.cfg.sub || "")}</span><span>Round ${B.round}${B.buffT > 0 ? " · 📣 +25%" : ""}</span></div><div class="arRow" data-r="e">${B.foes.map((x) => unit(x, (tg && x.hp > 0 && (!tk.length || x.taunt > 0) ? "tg " : "") + (u === x ? "cur" : ""))).join("")}</div><div class="arLog">${esc(B.log[B.log.length - 1] || "")}</div><div class="arRow" data-r="p">${B.team.map((x) => unit(x, u === x ? "cur" : "")).join("")}</div>${mine ? `<div class="sum" style="text-align:center">Tocca a <b>${esc(u.n)}</b> · ${esc(ROLE[u.role])} · tratto ${TR[u.tr][0]} ${TR[u.tr][1]}</div>` : ""}${act}<p class="sum" style="font-size:11px;opacity:.65">🔥 Assalto batte 🎯 Mente, 🎯 Mente batte 🛡️ Muro, 🛡️ Muro batte 🔥 Assalto: +30% danni al tratto favorevole.</p></div>`;
    body.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => {
      const k = b.dataset.a; if (k === "defend") return act2("defend");
      if (k === "ability") { if (u.role !== "A") return act2("ability"); B.mode = "ability"; return render2(); }
      B.mode = "attack"; render2();
    }));
    body.querySelectorAll(".arU.tg").forEach((el) => (el.onclick = () => act2(B.mode, el.dataset.u)));
    if (B.mode === "ability") body.querySelectorAll('[data-r="e"] .arU:not(.ko)').forEach((el) => { el.classList.add("tg"); el.onclick = () => act2("ability", el.dataset.u); });
  }
  const render2 = () => render();
  const act2 = (k, t) => act(k, t);
  function pop(u, text, cls) { if (FAST || !OV) return; const el = OV.querySelector(`.arU[data-u="${u.id}"][data-s="${u.side}"]`); if (!el) return; const s = document.createElement("span"); s.className = "arPop " + (cls || ""); s.textContent = text; el.appendChild(s); setTimeout(() => s.remove(), 950); }
  function shake(u) { if (FAST || !OV) return; const el = OV.querySelector(`.arU[data-u="${u.id}"][data-s="${u.side}"]`); if (el) { el.classList.add("shk"); setTimeout(() => el.classList.remove("shk"), 320); } }
  function cutin(u, ab) { if (FAST || !OV) return; const bt = OV.querySelector(".arBt"); if (!bt) return; const c = document.createElement("div"); c.className = "arCut"; c.innerHTML = `${img(u.id) ? `<img alt="" src="${img(u.id)}">` : ""}<div><b>${esc(ab)}</b><span>${esc(u.n)} · ${esc(ROLE[u.role])}</span></div>`; bt.appendChild(c); setTimeout(() => c.remove(), 1150); }
  // ------------------------------------------------------------ menu, modalità, Torre
  const bestTeam = () => { const s = S(), r = s._load(); const own = r.own.map((id) => s.BY[id]).filter(Boolean).sort((a, b) => (s.eff(b).at + s.eff(b).df + s.eff(b).te) - (s.eff(a).at + s.eff(a).df + s.eff(a).te)); r.team = own.slice(0, 5).map((c) => c.id); s._save(r); return r.team; };
  function teamBar(r, ar) {
    return `<div class="arRow">${[0, 1, 2, 3, 4].map((k) => { const id = r.team[k]; if (!id) return `<div class="arU" style="--tc:#4a3a6a;opacity:.5"><div class="im">+</div><div class="nm">vuoto</div></div>`; const c = S().BY[id], lv = lvOf(ar.xp[id] | 0); return unit({ id, side: "m", n: name(id), tr: trOf(S().eff(c)), hp: 1, maxhp: 1, shield: 0, taunt: 0 }, "") .replace('<div class="hp"><i style="width:100%"></i></div>', `<div class="hp" style="background:none;color:#ffd23f;font-weight:800;height:auto">Liv. ${lv}</div>`); }).join("")}</div>`;
  }
  function open(back) {
    if (back) BACK = back; if (!S()) return; const body = shell("⚔️ Arena dei Sogni"), r = S()._load(), ar = load(); S().sync && S().sync();
    const rr = S()._load(), I = S().intesa(rr.team).n, has = rr.team.length > 0, d = ar.daily.d === today() ? ar.daily : { d: today(), won: false };
    const mod = MODS[hash(today()) % MODS.length];
    let h = `<p class="sum">I personaggi della Squadra dei Sogni combattono a turni. Ruoli, abilità, tratti e intesa tra saghe contano. I livelli di Arena valgono <b>solo qui</b>. Intesa squadra: <b>+${(I * 1.5).toFixed(1)}%</b> a tutte le statistiche.</p>`;
    h += `<div class="sec">La tua squadra</div>${teamBar(rr, ar)}`;
    if (!has) h += `<p class="sum">Nessuna carta in squadra. Sblocca carte giocando le saghe, poi schierale.</p>`;
    h += `<div class="big"><button type="button" data-go="best">✨ Schiera le migliori<small>le 5 carte più forti</small></button><button type="button" data-go="sogni">🃏 Cambia squadra<small>vai alla Squadra dei Sogni</small></button></div>`;
    h += `${window.__picchia ? `<div class="sec">Altri giochi con le tue carte</div><button type="button" class="one" data-go="pic">🥊 Duello dei Sogni<small>Picchiaduro 1 contro 1: mosse, speciale di ruolo e Super</small></button>` : ""}${window.__corsa ? `<button type="button" class="one" data-go="cor">🏁 Gran Premio dei Sogni<small>Corsa a squadre: guidi un pilota, due compagni corrono da soli</small></button>` : ""}<div class="sec">Scontri · livello sbloccato ${ar.tier}/5</div>${[1, 2, 3, 4, 5].map((t) => `<button type="button" class="one" data-tier="${t}" ${!has || t > ar.tier ? "disabled" : ""}>Scontro ${t}${"★".repeat(t)}<small>${t > ar.tier ? "Vinci il livello precedente" : "Avversari +" + Math.round((t - 1) * 12 + 0) + "% · premio " + 10 * t + " monete"}</small></button>`).join("")}`;
    h += `<div class="sec">Arena del giorno</div><button type="button" class="one" data-go="daily" ${!has ? "disabled" : ""}>📅 ${esc(mod[0])}${d.won ? " ✓" : ""}<small>${esc(mod[1])} · ${d.won ? "già vinta oggi" : "primo successo del giorno: +30 monete"}</small></button>`;
    h += `<div class="sec">Torre dei Duelli · record piano ${ar.best}</div><button type="button" class="one" data-go="torre" ${!has ? "disabled" : ""}>🗼 ${ar.run ? "Continua la salita (piano " + ar.run.floor + ")" : "Sali la Torre"}<small>30 piani · boss ogni 10 · tra un piano e l'altro scegli un potenziamento</small></button>${ar.run ? `<button type="button" class="one" data-go="torreNew">↺ Ricomincia dal piano 1<small>abbandona la salita in corso</small></button>` : ""}`;
    body.innerHTML = h;
    const q = (s) => body.querySelector(s);
    q('[data-go="best"]').onclick = () => { bestTeam(); open(); };
    q('[data-go="sogni"]').onclick = () => { close(); S().open(() => open()); };
    body.querySelectorAll("[data-tier]").forEach((b) => (b.onclick = () => scontro(+b.dataset.tier)));
    const pi = q('[data-go="pic"]'); if (pi) pi.onclick = () => { close(); window.__picchia.open(() => open()); };
    const co = q('[data-go="cor"]'); if (co) co.onclick = () => { close(); window.__corsa.open(() => open()); };
    const dl = q('[data-go="daily"]'); if (dl) dl.onclick = daily;
    const tr = q('[data-go="torre"]'); if (tr) tr.onclick = () => torre(false);
    const tn = q('[data-go="torreNew"]'); if (tn) tn.onclick = () => torre(true);
  }
  function giveXp(team) {
    const ar = load(), ups = []; team.forEach((t) => { const id = t.id, l0 = lvOf(ar.xp[id] | 0); ar.xp[id] = Math.min(60, (ar.xp[id] | 0) + 1); if (lvOf(ar.xp[id]) > l0) ups.push(name(id) + " Liv. " + lvOf(ar.xp[id])); }); save(ar); return ups;
  }
  function result(res, win, lines, again, title) {
    const body = shell(win ? "🏆 Vittoria" : "💫 Sconfitta");
    body.innerHTML = `<div class="arRes"><h3>${win ? "Vittoria!" : "Sconfitta"}</h3>${lines.map((l) => `<p class="sum">${l}</p>`).join("")}</div><div class="big">${again ? `<button type="button" data-go="again">${esc(again[0])}<small>${esc(again[1])}</small></button>` : ""}<button type="button" data-go="menu">◂ Menu Arena<small>torna alle modalità</small></button></div>`;
    const a = body.querySelector('[data-go="again"]'); if (a) a.onclick = again[2]; body.querySelector('[data-go="menu"]').onclick = () => open();
  }
  function scontro(t) {
    const r = S()._load(), ar = load(), rand = rng(Date.now() & 0xffff);
    const foes = enemyTeam(rand, t, null, 5);
    start({ title: `⚔️ Scontro ${t}${"★".repeat(t)}`, sub: "Scontro singolo", foes, tierM: 0.85 + t * 0.12, onEnd: (res) => {
      const win = res === "win", ups = win ? giveXp(B.team.filter((u) => u.hp > 0 || true)) : [], a = load(), L = [];
      if (win) { a.wins++; if (t === a.tier && a.tier < 5) { a.tier++; L.push(`Livello ${a.tier} sbloccato.`); } save(a); safe(() => window.addCoins(10 * t), 0); L.push(`+${10 * t} monete.`); if (ups.length) L.push("📈 " + ups.map(esc).join(" · ")); } else L.push("Riprova con un'altra squadra o un livello più basso.");
      result(res, win, L, ["⚔️ Ancora", "stesso livello", () => scontro(t)]);
    }, quit: () => { close(); open(); } });
  }
  function daily() {
    const mod = MODS[hash(today()) % MODS.length], rand = rng(hash("d" + today())), theme = [...new Set(S().CARDS.map((c) => c.saga))][hash("t" + today()) % [...new Set(S().CARDS.map((c) => c.saga))].length];
    const foes = enemyTeam(rand, 3, theme, 5);
    start({ title: "📅 Arena del giorno", sub: mod[0] + " · " + mod[1], foes, tierM: 1.05, mod: mod[2], seed: hash("b" + today()), onEnd: (res) => {
      const win = res === "win", a = load(), L = [], ups = win ? giveXp(B.team) : [];
      if (win) { a.wins++; if (a.daily.d !== today() || !a.daily.won) { a.daily = { d: today(), won: true }; safe(() => window.addCoins(30), 0); L.push("+30 monete: primo successo del giorno."); } else L.push("Già vinta oggi: nessun premio extra."); save(a); if (ups.length) L.push("📈 " + ups.map(esc).join(" · ")); } else L.push("Domani l'avversario cambia. Riprova ora se vuoi.");
      result(res, win, L, null);
    }, quit: () => { close(); open(); } });
  }
  // la Torre: 30 piani, boss ogni 10 con una saga a tema; la salute passa da un piano all'altro
  const sagas = () => [...new Set(S().CARDS.map((c) => c.saga))].filter((k) => S().CARDS.filter((c) => c.saga === k).length >= 3);
  function floorFoes(f) {
    const rand = rng(hash("torre" + f)), boss = f % 10 === 0, ss = sagas(), theme = boss ? ss[(f / 10 - 1) * 7 % ss.length] : ss[hash("f" + f) % ss.length];
    let foes = enemyTeam(rand, 1, theme, boss ? 5 : Math.min(5, 2 + Math.ceil(f / 8)));
    if (boss) { const top = S().CARDS.filter((c) => c.saga === theme).sort((a, b) => b.at + b.df + b.te - (a.at + a.df + a.te))[0]; if (top) foes = [top].concat(foes.filter((c) => c.id !== top.id)).slice(0, 5); }
    return { foes, boss, theme };
  }
  function torre(fresh) {
    const ar = load(), r = S()._load(); let run = ar.run;
    if (fresh || !run) { run = { floor: 1, perks: [], hp: {}, team: r.team.slice() }; ar.run = run; save(ar); }
    const team = run.team.map((id) => S().BY[id]).filter(Boolean), I = S().intesa(run.team).n, tm = ownTeam({ team: run.team }, ar);
    const F = floorFoes(run.floor), tierM = 0.9 + run.floor * 0.045 + (F.boss ? 0.12 : 0);
    start({ title: `🗼 Torre · piano ${run.floor}`, sub: F.boss ? "👑 BOSS" : "Piano " + run.floor + "/30", team: tm, hp: run.hp, perks: run.perks, foes: F.foes, boss: F.boss, tierM, onEnd: (res, b) => {
      const a = load(); const rn = a.run || run;
      if (res === "lose") { a.best = Math.max(a.best, rn.floor - 1); a.run = null; save(a); const ups = giveXp(b.team); return result(res, false, [`Salita finita al piano ${rn.floor}. Record: ${a.best}.`, ups.length ? "📈 " + ups.map(esc).join(" · ") : "Ogni salita conta: i livelli restano."], ["🗼 Riprova", "dal piano 1", () => torre(true)]); }
      const ups = giveXp(b.team); b.team.forEach((u) => (rn.hp[u.id] = u.hp));
      rn.hp = Object.assign({}, rn.hp); const heal = Math.round(0.25); b.team.forEach((u) => { if (u.hp > 0) rn.hp[u.id] = Math.min(u.maxhp, u.hp + Math.round(u.maxhp * 0.25)); });
      a.best = Math.max(a.best, rn.floor); if (F.boss) { a.bosses++; safe(() => window.addCoins(5 * rn.floor), 0); }
      if (rn.floor >= 30) { a.run = null; save(a); safe(() => window.addCoins(300), 0); return result(res, true, ["Hai conquistato la cima della Torre! +300 monete.", "Record piano 30."], null); }
      rn.floor++; a.run = rn; save(a); perkPick(rn, ups, F.boss);
    }, quit: () => { close(); open(); } });
  }
  function perkPick(rn, ups, boss) {
    const rand = rng(hash("p" + rn.floor)), pool = PERKS.slice(), pick = []; while (pick.length < 3) pick.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
    const body = shell("🗼 Un potenziamento");
    body.innerHTML = `<div class="arRes"><h3>Piano ${rn.floor - 1} superato</h3><p class="sum">${boss ? "Boss battuto! " : ""}Salute +25% a chi è in piedi.${ups.length ? " 📈 " + ups.map(esc).join(" · ") : ""}</p></div><div class="arPerk">${pick.map((p) => `<button type="button" class="one" data-p="${p[0]}">${esc(p[1])}<small>${esc(p[2])}</small></button>`).join("")}</div>`;
    body.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => {
      const a = load(), run = a.run, k = b.dataset.p;
      if (k === "cura") run.team.forEach((id) => delete run.hp[id]);
      else if (k === "torna") { const d = run.team.find((id) => run.hp[id] === 0 || run.hp[id] <= 0); if (d) delete run.hp[d], (run.hp[d] = 40); }
      else run.perks.push(k);
      a.run = run; save(a); torre(false);
    }));
  }
  window.__arena = { open, close, start, act, state: () => B, load, save, _fast: (v) => { FAST = !!v; }, lvOf, mk, floorFoes, TR, ABIL, PERKS, MODS };
})();
