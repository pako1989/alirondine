// js/sogni-albo.js - L'ALBO DELLA SQUADRA DEI SOGNI (opzione in Impostazioni, spenta di base)
// Tutte le carte dei Sogni in un unico album, sfogliabile per saga, per tema e per rarità, con le percentuali di completamento.
//  - Le carte che non hai sono sagome: nome oscurato e un indizio vago su dove cercarle (niente spoiler di trama).
//  - A soglie di completamento si sbloccano premi SOLO estetici: cornici, titoli e sfondi per le carte della Squadra dei Sogni.
//    Nessun vantaggio di forza, intesa o partita.
// Salvataggio proprio (retrocompatibile, i vecchi salvataggi non cambiano): ali-di-rondine.sogni-albo
//   { on, cut, seen:[premi già annunciati], frame, title, bg }
(function () {
  "use strict";
  if (window.__albo) return;
  const KEY = "ali-di-rondine.sogni-albo";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  function load() {
    const o = safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {}) || {};
    return { on: !!o.on, cut: !!o.cut, seen: Array.isArray(o.seen) ? o.seen : [], frame: o.frame || "", title: o.title || "", bg: o.bg || "" };
  }
  const save = (o) => safe(() => localStorage.setItem(KEY, JSON.stringify(o)), 0);

  // ---------------------------------------------------------------- temi (raggruppano le saghe per genere)
  const TEMI = {
    calcio: ["⚽", "Calcio e Borgo", "#ff7a45", "borgo mondiale campetto colline stagione torneo dopo quattordici latta banda estate corriere compagnia fischietto figurine montagna muro doppio cavallo cenere trono gp"],
    giallo: ["🕵️", "Giallo e Noir", "#ca8a04", "milano detective moviola falsari tipografia treno fortino vuota spia gala missione note onde"],
    avventura: ["🧭", "Avventura e Viaggi", "#0e9aa7", "pirati galletta naufraghi piramide fiume rotta alcatraz alcatraz2 zampano dungeon"],
    fantasy: ["🐉", "Fantasy e Leggenda", "#7a4ab0", "vallombra kronenburg alchimia ragnarok belovodia cristalli regno sigilli cronache cavaliere titano vento mondi libro"],
    storia: ["🏛️", "Storia e Western", "#b91c1c", "roma pugno tempo shogun sasso capitani ducati bilancia"],
    futuro: ["🚀", "Futuro e Supereroi", "#22d3ee", "circuiti replica spazio chrono phantom ombre officina razzo mantello grigio quartiere"],
    mistero: ["🕯️", "Mistero e Brivido", "#a3a3a3", "abisso tifosi campana lampioni neve diga burattini"],
  };
  const T_OF = {}; Object.entries(TEMI).forEach(([k, t]) => t[3].split(" ").forEach((s) => { T_OF[s] = k; }));
  const temaOf = (saga) => T_OF[saga] || "calcio"; // una saga nuova non ancora in tabella finisce nel Calcio, non rompe nulla
  const RARK = ["c", "r", "e", "l"];

  // ---------------------------------------------------------------- premi estetici a soglie (percentuale totale)
  const FRAMES = { bronzo: ["Cornice di Bronzo", "#cd7f32"], argento: ["Cornice d'Argento", "#d7dde4"], oro: ["Cornice d'Oro", "#ffd23f"], iride: ["Cornice d'Iride", "linear"] };
  const BGS = { zucchero: ["Carta da Zucchero", "linear-gradient(160deg,#3b5b8a,#1d2f4f)"], golfo: ["Notte sul Golfo", "radial-gradient(circle at 70% 20%,#fff6 0 2px,transparent 3px),radial-gradient(circle at 25% 35%,#fff5 0 1px,transparent 2px),linear-gradient(180deg,#0b1a3a,#14305a 60%,#0e4a5a)"], olo: ["Olografico", "linear-gradient(120deg,#ff7ab6,#ffd23f,#7ad87a,#5ad1ff,#b07aff)"] };
  const TITOLI = { piazza: "Collezionista di Piazza", archivista: "Archivista del Borgo", custode: "Custode dell'Albo" };
  const SOGLIE = [
    { p: 5, k: "frame:bronzo" }, { p: 15, k: "title:piazza" }, { p: 25, k: "bg:zucchero" }, { p: 40, k: "frame:argento" },
    { p: 50, k: "title:archivista" }, { p: 60, k: "bg:golfo" }, { p: 75, k: "frame:oro" }, { p: 90, k: "title:custode" },
    { p: 100, k: "frame:iride" }, { p: 100, k: "bg:olo" },
  ];
  // titoli di tema: tema completato al 100%
  const TITOLI_TEMA = { calcio: "Re del Pallone", giallo: "Occhio da Detective", avventura: "Lupo di Mare", fantasy: "Cantastorie dei Regni", storia: "Cronista dei Secoli", futuro: "Pilota del Domani", mistero: "Guardiano del Buio" };
  const rName = (k) => { const [t, id] = k.split(":"); if (t === "frame") return "🖼️ " + FRAMES[id][0]; if (t === "bg") return "🎨 Sfondo " + BGS[id][0]; if (t === "title") return "🏷️ Titolo «" + (TITOLI[id] || TITOLI_TEMA[id]) + "»"; return k; };

  // ---------------------------------------------------------------- conteggi
  function stats() {
    const so = S(); if (!so || !so.CARDS) return null;
    const own = new Set(safe(() => so._load().own, []) || []);
    const z = () => ({ n: 0, h: 0 });
    const tot = z(), saga = {}, tema = {}, rar = { c: z(), r: z(), e: z(), l: z() };
    so.CARDS.forEach((c) => {
      const h = own.has(c.id) ? 1 : 0, t = temaOf(c.saga);
      [tot, saga[c.saga] || (saga[c.saga] = z()), tema[t] || (tema[t] = z()), rar[c.rar] || (rar[c.rar] = z())].forEach((o) => { o.n++; o.h += h; });
    });
    return { own, tot, saga, tema, rar };
  }
  const pct = (o) => (o && o.n ? Math.floor((o.h * 100) / o.n) : 0);
  function unlocked(st) {
    st = st || stats(); if (!st) return [];
    const p = pct(st.tot), out = SOGLIE.filter((s) => p >= s.p).map((s) => s.k);
    Object.keys(TEMI).forEach((t) => { if (st.tema[t] && st.tema[t].n && st.tema[t].h === st.tema[t].n) out.push("title:" + t); });
    return out;
  }
  // premi nuovi da annunciare (una volta sola)
  function fresh() {
    const o = load(); if (!o.on) return [];
    const u = unlocked(), nw = u.filter((k) => !o.seen.includes(k));
    if (nw.length) { o.seen = o.seen.concat(nw); save(o); }
    return nw;
  }

  // ---------------------------------------------------------------- indizi senza spoiler
  function hint(c) {
    const so = S(), p = safe(() => so._progress ? so._progress(c.saga) : null, null);
    const started = safe(() => { const k = (so.SAGHE[c.saga] || [])[0]; const m = k && JSON.parse(localStorage.getItem(k) || "null"); return !!m; }, false) || !!(p && p.ch) || safe(() => so._load().own.some((id) => so.BY[id] && so.BY[id].saga === c.saga), false);
    const T = TEMI[temaOf(c.saga)];
    if (!started) return `Da una saga ${T[0]} ${T[1].toLowerCase()} che non hai ancora cominciato`;
    const nm = "«" + ((so.SAGHE[c.saga] || [])[1] || "una saga") + "»";
    if (c.n) return safe(() => so._seen(c), false) ? `Già incontrato · ora può uscire in una bustina` : safe(() => so.premio.on(), true) ? `Più avanti in ${nm}: poi esce dalle bustine` : `Più avanti nella storia di ${nm}`;
    const pr = !!safe(() => so.premio.on(), true), bus = pr ? " o in una bustina" : " o nelle bustine";
    const met = safe(() => so._seen(c), false);
    if (met) return `Già incontrato · ora può uscire in una bustina`;
    if (pr) return { c: `Gioca ${nm}: dopo averlo incontrato esce dalle bustine`, r: `Va avanti con ${nm}: poi esce dalle bustine`, e: `Arriva in fondo a ${nm}: poi esce dalle bustine`, l: `Scopri tutti i finali di ${nm}: poi esce dalle bustine` }[c.rar] || `Solo da bustina`;
    return c.rar === "c" ? `Gira per ${nm}${bus}` : c.rar === "r" ? `Va avanti con ${nm}${bus}` : c.rar === "e" ? `Arriva in fondo a ${nm}` : `Solo per chi scopre tutti i finali di ${nm}`;
  }

  // ---------------------------------------------------------------- estetica sulle carte della Squadra dei Sogni
  function skin(ov) {
    if (!ov) return; const o = load();
    [...ov.classList].forEach((c) => { if (/^albo[FB]-/.test(c)) ov.classList.remove(c); });
    if (!o.on) return; css(); const u = unlocked();
    if (o.frame && u.includes("frame:" + o.frame)) ov.classList.add("alboF-" + o.frame);
    if (o.bg && u.includes("bg:" + o.bg)) ov.classList.add("alboB-" + o.bg);
  }
  function badge() {
    const o = load(); if (!o.on || !o.title) return "";
    const u = unlocked(), t = TITOLI[o.title] || TITOLI_TEMA[o.title];
    return t && u.includes("title:" + o.title) ? `<span class="alboTitle">🏷️ ${esc(t)}</span>` : "";
  }

  // ---------------------------------------------------------------- interfaccia
  let OV = null, VIEW = "saga", BACK = null, OPEN_G = {};
  function css() {
    if (document.getElementById("alboCss")) return; const st = document.createElement("style"); st.id = "alboCss";
    const fr = Object.entries(FRAMES).map(([k, [, c]]) => c === "linear"
      ? `.sgOv.alboF-${k} .sgCard:not(.lock):not(.empty){outline:3px solid transparent;box-shadow:0 0 0 3px #ff7ab6,0 0 0 5px #5ad1ff,0 0 14px #b07aff88}`
      : `.sgOv.alboF-${k} .sgCard:not(.lock):not(.empty){box-shadow:0 0 0 3px ${c},0 0 10px ${c}66}`).join("\n");
    const bg = Object.entries(BGS).map(([k, [, g]]) => `.sgOv.alboB-${k} .sgCard:not(.lock):not(.empty) .img{background:${g}}`).join("\n");
    st.textContent = `${fr}\n${bg}
.alboTitle{display:inline-block;margin:2px 0 4px;padding:2px 10px;border-radius:999px;background:#ffd23f22;border:1px solid #ffd23f88;color:#ffd23f;font:800 12px system-ui}
.alboOv{z-index:312}.alboOv .alboTot{background:#181326;border:1px solid #3d2d60;border-radius:12px;padding:10px 12px;margin:6px 0 10px}
.alboBar{height:10px;border-radius:6px;background:#2a2240;overflow:hidden;margin:4px 0}.alboBar i{display:block;height:100%;background:linear-gradient(90deg,#ffd23f,#ff7a45);border-radius:6px}
.alboTabs{display:flex;gap:6px;margin:6px 0 8px;flex-wrap:wrap}.alboTabs button{flex:1;min-height:40px;border-radius:8px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:700 13px system-ui}.alboTabs button.on{background:#ffd23f;color:#1a0f00;border-color:#ffd23f}
.alboGrp{border:1px solid #3d2d60;border-radius:10px;margin:6px 0;background:#161124;overflow:hidden}.alboGrp>button{width:100%;display:flex;gap:8px;align-items:center;padding:9px 10px;background:none;border:0;color:#f4f0e4;font:700 13px system-ui;text-align:left;min-height:44px}
.alboGrp>button .nm{flex:1;min-width:0}.alboGrp>button .nm small{display:block;font-weight:400;opacity:.7}.alboGrp>button b{color:#ffd23f;font-size:13px}.alboGrp .dot{width:10px;height:10px;border-radius:50%;flex:none}
.alboGrp .alboBar{margin:0 10px 8px}.alboGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px;padding:0 8px 10px}
.alboC{position:relative;border-radius:8px;border:2px solid var(--rc);background:#1e1830;padding:4px;text-align:center;font-size:11px;min-height:132px;display:flex;flex-direction:column;gap:3px;color:#f4f0e4}
.alboC .im{height:72px;border-radius:5px;background:#0e0b18;display:flex;align-items:center;justify-content:center;overflow:hidden}.alboC .im img{width:100%;height:100%;object-fit:cover}
.alboC.lock{border-style:dashed;opacity:.92}.alboC.lock .im img{filter:brightness(0) opacity(.55)}.alboC.lock .im span{font:900 26px system-ui;opacity:.4}
.alboC .n{font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.alboC .h{font-size:10px;opacity:.75;line-height:1.25}.alboC .rr{font-size:9px;color:var(--rc);font-weight:800;text-transform:uppercase}
.alboC.full::after{content:"💯";position:absolute;top:2px;right:4px}
.alboPrem{display:grid;gap:6px}.alboPrem button{display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:44px;padding:8px 10px;border-radius:8px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:700 13px system-ui;text-align:left}
.alboPrem button.on{border-color:#ffd23f;background:#3a2e10}.alboPrem button:disabled{opacity:.5}.alboPrem button small{font-weight:400;opacity:.75}
.alboStamp{display:inline-block;margin:2px;padding:2px 8px;border-radius:999px;border:1px solid var(--sc);color:#f4f0e4;font-size:11px}`;
    document.head.appendChild(st);
  }
  function cardMini(c, st) {
    const so = S(), R = { c: ["Comune", "#9aa5b1"], r: ["Rara", "#3a8ad8"], e: ["Epica", "#a85ad8"], l: ["Leggendaria", "#ffd23f"] }[c.rar] || ["", "#9aa5b1"];
    const own = st.own.has(c.id), img = safe(() => so.port(c.id), null);
    return `<div class="alboC${own ? "" : " lock"}" style="--rc:${R[1]}"${own ? ` data-lore="${c.id}" role="button" tabindex="0"` : ""}><div class="im">${img ? `<img alt="" src="${img}">` : `<span>?</span>`}</div><div class="rr">${R[0]}</div><div class="n">${own ? esc(so.name(c.id)) : "? ? ?"}</div>${own ? "" : `<div class="h">${esc(hint(c))}</div>`}</div>`;
  }
  function groups(st) {
    const so = S();
    if (VIEW === "tema") return Object.entries(TEMI).map(([k, t]) => ({ id: "t-" + k, nm: `${t[0]} ${t[1]}`, sub: `${Object.keys(st.saga).filter((s) => temaOf(s) === k).length} saghe`, col: t[2], o: st.tema[k] || { n: 0, h: 0 }, cards: so.CARDS.filter((c) => temaOf(c.saga) === k) })).filter((g) => g.o.n);
    if (VIEW === "rar") { const RN = { c: ["Comuni", "#9aa5b1"], r: ["Rare", "#3a8ad8"], e: ["Epiche", "#a85ad8"], l: ["Leggendarie", "#ffd23f"] }; return RARK.map((k) => ({ id: "r-" + k, nm: RN[k][0], sub: "", col: RN[k][1], o: st.rar[k], cards: so.CARDS.filter((c) => c.rar === k) })).filter((g) => g.o && g.o.n); }
    // per saga: prima quelle più avanti, poi le altre in ordine alfabetico
    return Object.keys(st.saga).map((k) => { const SG = so.SAGHE[k] || [0, k, "#94a3b8"], T = TEMI[temaOf(k)]; return { id: "s-" + k, nm: SG[1], sub: `${T[0]} ${T[1]}`, col: SG[2], o: st.saga[k], cards: so.CARDS.filter((c) => c.saga === k) }; })
      .sort((a, b) => pct(b.o) - pct(a.o) || a.nm.localeCompare(b.nm, "it"));
  }
  function render() {
    const st = stats(); if (!st || !OV) return; const so = S(), o = load(), body = OV.querySelector(".body"), u = unlocked(st), p = pct(st.tot);
    const next = SOGLIE.find((s) => p < s.p);
    let h = `<div class="alboTot">${badge()}<div><b>Albo completato: ${p}%</b> · ${st.tot.h}/${st.tot.n} carte</div><div class="alboBar"><i style="width:${p}%"></i></div>`;
    h += `<div style="font-size:12px;opacity:.85">${RARK.map((k) => `${{ c: "Comuni", r: "Rare", e: "Epiche", l: "Leggendarie" }[k]} ${pct(st.rar[k])}%`).join(" · ")}</div>`;
    h += `<div style="font-size:12px;margin-top:4px;color:#c8b8ff">${next ? `Prossimo premio al ${next.p}%: ${esc(rName(next.k))}` : "Hai sbloccato tutti i premi a soglia. 🏆"}</div></div>`;
    h += `<div class="alboTabs">${[["saga", "📚 Per saga"], ["tema", "🎭 Per tema"], ["rar", "💎 Per rarità"], ["prem", "🏅 Premi"]].map(([k, l]) => `<button type="button" data-v="${k}" class="${VIEW === k ? "on" : ""}">${l}</button>`).join("")}</div>`;
    if (VIEW === "prem") {
      const all = SOGLIE.map((s) => ({ k: s.k, req: `al ${s.p}% dell'Albo` })).concat(Object.keys(TEMI).map((t) => ({ k: "title:" + t, req: `tema ${TEMI[t][1]} al 100%` })));
      const cur = { frame: o.frame, title: o.title, bg: o.bg };
      h += `<p class="sum">Premi solo estetici: cambiano l'aspetto delle tue carte e il titolo nella Squadra dei Sogni. Nessun vantaggio in partita. Tocca un premio sbloccato per indossarlo, di nuovo per toglierlo.</p><div class="alboPrem">`;
      h += all.map((a) => { const [t, id] = a.k.split(":"), got = u.includes(a.k), on = cur[t] === id; return `<button type="button" data-eq="${a.k}" class="${on ? "on" : ""}"${got ? "" : " disabled"}><span>${esc(rName(a.k))}<br><small>${got ? (on ? "In uso · tocca per togliere" : "Sbloccato · tocca per usarlo") : "🔒 " + esc(a.req)}</small></span><span>${got ? (on ? "✅" : "▫️") : "🔒"}</span></button>`; }).join("");
      h += `</div>`;
      const full = Object.keys(st.saga).filter((k) => st.saga[k].h === st.saga[k].n);
      h += `<div class="sec">Timbri di saga completata (${full.length}/${Object.keys(st.saga).length})</div><div>${full.length ? full.map((k) => `<span class="alboStamp" style="--sc:${(so.SAGHE[k] || [])[2] || "#94a3b8"}">💯 ${esc((so.SAGHE[k] || [0, k])[1])}</span>`).join("") : `<p class="sum">Completa tutte le carte di una saga per il suo timbro.</p>`}</div>`;
    } else {
      h += groups(st).map((g) => { const op = !!OPEN_G[g.id], pp = pct(g.o); return `<div class="alboGrp"><button type="button" data-g="${g.id}" aria-expanded="${op}"><span class="dot" style="background:${g.col}"></span><span class="nm">${esc(g.nm)}${g.sub ? `<small>${esc(g.sub)}</small>` : ""}</span><span>${g.o.h}/${g.o.n} · <b>${pp}%</b>${pp === 100 ? " 💯" : ""}</span><span>${op ? "▾" : "▸"}</span></button><div class="alboBar"><i style="width:${pp}%"></i></div>${op ? `<div class="alboGrid">${g.cards.map((c) => cardMini(c, st)).join("")}</div>` : ""}</div>`; }).join("");
    }
    body.innerHTML = h;
    body.querySelectorAll(".alboTabs button").forEach((b) => { b.onclick = () => { VIEW = b.dataset.v; render(); }; });
    body.querySelectorAll("[data-g]").forEach((b) => { b.onclick = () => { OPEN_G[b.dataset.g] = !OPEN_G[b.dataset.g]; render(); }; });
    body.querySelectorAll("[data-lore]").forEach((el) => { el.onclick = () => { const id = el.dataset.lore; close(); safe(() => so.openCardLore(id, () => open(BACK)), 0); }; });
    body.querySelectorAll("[data-eq]").forEach((b) => { b.onclick = () => { const [t, id] = b.dataset.eq.split(":"), x = load(); x[t] = x[t] === id ? "" : id; save(x); render(); }; });
  }
  function close() { if (OV) { OV.remove(); OV = null; } }
  function open(back) {
    const so = S(); if (!so) return; BACK = back || (() => so.open()); css(); close();
    safe(() => so.sync(), 0);
    OV = document.createElement("div"); OV.className = "sgOv alboOv";
    OV.innerHTML = `<div class="wrap"><div class="bar"><h2>📒 L'Albo dei Sogni</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`;
    OV.querySelector(".x").onclick = () => { const b = BACK; close(); if (typeof b === "function") b(); };
    document.body.appendChild(OV); render();
    const nw = fresh();
    if (nw.length && window.__presa && window.__presa.toast) window.__presa.toast(`🏅 Nuovi premi dell'Albo: ${nw.map((k) => esc(rName(k))).join(", ")}`);
  }
  const isOn = () => load().on;
  function setOn(v) {
    const o = load(); o.on = !!v; const first = o.on && !o.cut; if (first) o.cut = true;
    if (o.on) o.seen = Array.from(new Set(o.seen.concat(unlocked()))); // i premi già raggiunti all'accensione non vengono annunciati uno a uno
    save(o); return first;
  }
  window.__albo = { on: isOn, setOn, open, close, stats, pct, unlocked, fresh, skin, badge, hint, temaOf, TEMI, SOGLIE, _load: load };
})();
