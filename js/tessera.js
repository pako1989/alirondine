// js/tessera.js - TESSERA DEL BORGO · MODALITÀ FOTO · HOME CHE CAMBIA (blocco 1 della coda, 4 nov 2026)
// Tre novità, ognuna spegnibile in Impostazioni › 🪪 Tessera, foto e home (con cut-in):
//  - TESSERA DEL BORGO: profilo con titolo scelto, ore di gioco, saga preferita, personaggio preferito, finali e carte.
//    Si apre dalla home («🪪 Tessera del Borgo») e si salva/condivide come immagine PNG.
//  - MODALITÀ FOTO: linguetta 📷 sul bordo sinistro. Tocchi = fermo immagine della scena (mappe, partite, saghe, minigiochi),
//    senza pulsanti né testi sopra. Cornici, filtri, didascalia, salva o condividi.
//  - HOME CHE CAMBIA: lo sfondo e il personaggio del titolo vengono dall'ultima cosa giocata: saga (copertina + suo ospite)
//    o stagione della storia (scena + capitolo). Disegnata da game.js (drawTitle) con window.__tessera.home().
// Salvataggio proprio: ali-di-rondine.tessera = { on: { tessera, foto, home }, last: { saga: {id, ts}, storia: {chap, scene, ts} },
//   secs, plays: { idSaga: n }, title, fav, night, cut } · retrocompatibile: chiave nuova, nessun altro salvataggio toccato.
// Test: window.__tessera.mark("saga", id) · .home() · .open() · .photo() · .cards() · tests/tessera.cjs
(function () {
  "use strict";
  if (window.__tessera) return;
  const KEY = "ali-di-rondine.tessera";
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const api = () => window.__borgoApi;
  function rec() {
    const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {}) || {};
    const on = Object.assign({ tessera: true, foto: true, home: true }, r.on && typeof r.on === "object" ? r.on : {});
    return { v: 1, on, last: r.last && typeof r.last === "object" ? r.last : {}, secs: +r.secs || 0, plays: r.plays && typeof r.plays === "object" ? r.plays : {}, title: typeof r.title === "string" ? r.title : "", fav: typeof r.fav === "string" ? r.fav : "", night: !!r.night, cut: !!r.cut };
  }
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)));
  const on = (k) => rec().on[k] !== false;
  function setOn(k, v) { const r = rec(); r.on[k] = !!v; save(r); if (k === "foto") tab(); if (window.__titleRefresh) safe(() => window.__titleRefresh()); }

  // ---------------------------------------------------------------- tempo di gioco (solo a schermo acceso) e «ultima cosa giocata»
  let tick = 0;
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    tick += 15;
    if (tick >= 60) { const r = rec(); r.secs += tick; tick = 0; const h = new Date().getHours(); if (h >= 0 && h < 5) r.night = true; save(r); }
  }, 15000);
  function mark(kind, data) {
    const r = rec(), ts = Date.now();
    if (kind === "saga" && data) { r.last.saga = { id: String(data), ts }; r.plays[data] = (r.plays[data] | 0) + 1; }
    if (kind === "storia") r.last.storia = Object.assign({ ts }, data || {});
    save(r);
  }

  // ---------------------------------------------------------------- dati letti dagli altri moduli (solo lettura)
  const sal = () => window.__salone;
  const sum = () => safe(() => sal().summary(), null) || { n: 0, run: 0, fin: 0, fe: 0, te: 0 };
  const sagaById = (id) => safe(() => sal().byId(id), null);
  const hero = () => safe(() => window.heroLoad && window.heroLoad(), null);
  const cast = () => safe(() => api().CAST, {}) || {};
  const nameOf = (id) => { const c = cast()[id]; return c ? String(c.name || c.n || id).replace(/<[^>]*>/g, "") : ""; };
  function guestOf(title) {
    if (!title) return "";
    const L = safe(() => window.__borgoGuests.list(), []) || [], t = String(title).toLowerCase();
    const g = L.find((x) => x.saga && (t.indexOf(String(x.saga).toLowerCase().split(" · ")[0]) === 0 || String(x.saga).toLowerCase().indexOf(t.split(" · ")[0]) === 0));
    return g && cast()[g.id] && cast()[g.id].skin ? g.id : "";
  }
  function sogniCount() { return safe(() => { const S = window.__sogni; return { own: S._load().own.length, tot: S.CARDS.length }; }, { own: 0, tot: 0 }); }
  function favSaga(r) {
    const ids = Object.keys(r.plays).sort((a, b) => r.plays[b] - r.plays[a]);
    for (const id of ids) { const s = sagaById(id); if (s) return s; }
    return null;
  }
  function hours(s) { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? `${h} h ${m} min` : `${m} min`; }

  // titoli: si sbloccano giocando, se ne mostra uno a scelta
  const TITLES = [
    ["esordiente", "Esordiente del Borgo", "Sempre tuo: il Comune non nega un titolo a nessuno", () => true],
    ["tifoso", "Tifoso della Rondine", "Gioca un capitolo della storia di Leo", (c) => !!c.r.last.storia],
    ["turista", "Turista delle Saghe", "Apri 3 saghe diverse", (c) => Object.keys(c.r.plays).length >= 3],
    ["viaggiatore", "Viaggiatore di Mondi", "Apri 10 saghe diverse", (c) => Object.keys(c.r.plays).length >= 10],
    ["cacciatore", "Cacciatore di Finali", "Trova 10 finali", (c) => c.s.fe >= 10],
    ["archivista", "Archivista dei Destini", "Trova 40 finali", (c) => c.s.fe >= 40],
    ["collezionista", "Collezionista di Sogni", "Possiedi 50 carte dei Sogni", (c) => c.k.own >= 50],
    ["nottambulo", "Nottambulo del Molo", "Gioca tra mezzanotte e le cinque (Pina lo sa)", (c) => c.r.night],
    ["habitue", "Habitué del Bar", "5 ore di gioco", (c) => c.r.secs >= 5 * 3600],
    ["veterano", "Veterano della Costa", "20 ore di gioco", (c) => c.r.secs >= 20 * 3600],
    ["leggenda", "Leggenda del Borgo", "Concludi 25 saghe", (c) => c.s.fin >= 25],
  ];
  function ctx() { return { r: rec(), s: sum(), k: sogniCount() }; }
  function titles() { const c = ctx(); return TITLES.map(([id, n, how, ok]) => ({ id, n, how, got: !!safe(() => ok(c), false) })); }
  function curTitle() { const T = titles(), r = rec(), t = T.find((x) => x.id === r.title && x.got); return t || T.filter((x) => x.got).pop() || T[0]; }

  // ---------------------------------------------------------------- HOME CHE CAMBIA: cosa mostrare sul titolo
  const IMG = {};
  function img(src) { if (!src) return null; if (!IMG[src]) { const i = new Image(); i.src = src; IMG[src] = i; } return IMG[src].complete && IMG[src].naturalWidth ? IMG[src] : null; }
  function home() {
    if (!on("home")) return null;
    const r = rec(), a = r.last.saga, b = r.last.storia;
    if (a && (!b || a.ts >= b.ts)) {
      const s = sagaById(a.id); if (!s) return b ? { kind: "storia", scene: b.scene || "beach", chap: b.chap || "" } : null;
      const cov = safe(() => sal().coverOf(a.id), null);
      return { kind: "saga", id: a.id, t: s.t, e: s.e, img: img(cov), guest: guestOf(s.t) };
    }
    if (b) return { kind: "storia", scene: b.scene || "beach", chap: b.chap || "" };
    return null;
  }

  // ---------------------------------------------------------------- stile comune
  function css() {
    if (document.getElementById("tesStyle")) return;
    const st = document.createElement("style"); st.id = "tesStyle";
    st.textContent = `.tesOv{position:fixed;inset:0;z-index:330;background:radial-gradient(ellipse at top,#1d2a55 0%,#0b1026 65%);color:#f2ead8;overflow:auto;-webkit-overflow-scrolling:touch;font-family:"M PLUS Rounded 1c",system-ui,sans-serif}
.tesOv .wrap{max-width:720px;margin:0 auto;padding:max(10px,env(safe-area-inset-top)) 16px 40px}
.tesOv .bar{display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:2;background:linear-gradient(#0b1026 70%,rgba(11,16,38,0));padding:6px 0 10px}
.tesOv h2{margin:0;font-family:"Dela Gothic One",Impact,sans-serif;font-size:22px;color:#ffd23f;text-shadow:0 2px 0 #000;flex:1}
.tesOv .x{min-width:44px;min-height:44px;border-radius:12px;border:2px solid #ffffff44;background:#16294a;color:#fff;font-size:18px;cursor:pointer}
.tesOv .pv{width:100%;border-radius:14px;box-shadow:0 8px 24px #000a;display:block;background:#000}
.tesOv .lbl{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#9fb0d6;margin:14px 0 6px;font-weight:800}
.tesOv .row{display:flex;gap:8px;flex-wrap:wrap}
.tesOv .chip{min-height:38px;padding:6px 12px;border-radius:999px;border:1.5px solid #ffffff3a;background:#16294a;color:#e8ecf7;font:700 13px/1.1 "M PLUS Rounded 1c",sans-serif;cursor:pointer}
.tesOv .chip.on{background:#ffd23f;color:#1a1400;border-color:#ffd23f}
.tesOv .chip.lock{opacity:.45}
.tesOv .go{flex:1;min-height:50px;border-radius:14px;border:2px solid #ffd23f;background:linear-gradient(#ffd23f,#e0a91a);color:#1a1400;font:800 15px "M PLUS Rounded 1c",sans-serif;cursor:pointer}
.tesOv .go.b{background:#16294a;color:#fff;border-color:#ffffff55}
.tesOv input{width:100%;min-height:42px;border-radius:12px;border:1.5px solid #ffffff44;background:#0e1a36;color:#fff;padding:0 12px;font:600 15px "M PLUS Rounded 1c",sans-serif;box-sizing:border-box}
.tesOv .faces{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:8px}
.tesOv .faces button{border:2px solid #ffffff22;border-radius:12px;background:#13213f;padding:4px;cursor:pointer;color:#dfe6f7;font:700 10px/1.1 "M PLUS Rounded 1c",sans-serif}
.tesOv .faces button.on{border-color:#ffd23f;box-shadow:0 0 10px #ffd23f66}
.tesOv .faces img{width:100%;aspect-ratio:1;image-rendering:pixelated;border-radius:8px;display:block;margin-bottom:3px}
.tesOv .note{font-size:12.5px;color:#a9b6d6;margin:8px 0 0}
#tesCam{position:fixed;left:0;top:26%;z-index:310;width:28px;height:40px;font-size:15px!important;border:0;border-radius:0 12px 12px 0;background:#0b1026b0;color:#fff;font-size:18px;cursor:pointer;box-shadow:2px 2px 8px #0007;padding:0 0 0 2px;opacity:.55}
#tesCam:active{opacity:1;transform:scale(1.08)}
.tesFlash{position:fixed;inset:0;z-index:340;background:#fff;pointer-events:none;animation:tesFl .35s ease-out forwards}
@keyframes tesFl{from{opacity:.9}to{opacity:0}}`;
    document.head.appendChild(st);
  }
  function overlay(title, back) {
    css(); close();
    const ov = document.createElement("div"); ov.className = "tesOv"; ov.id = "tesOv";
    ov.innerHTML = `<div class="wrap"><div class="bar"><h2>${esc(title)}</h2><button class="x" aria-label="Chiudi">✕</button></div><div class="in"></div></div>`;
    ov.querySelector(".x").onclick = () => { close(); if (back) back(); };
    document.body.appendChild(ov); tab();
    return ov.querySelector(".in");
  }
  function close() { const o = document.getElementById("tesOv"); if (o) o.remove(); tab(); }
  function saveCanvas(cv, name) {
    cv.toBlob((b) => {
      if (!b) return;
      const f = safe(() => new File([b], name, { type: "image/png" }), null);
      if (f && navigator.canShare && safe(() => navigator.canShare({ files: [f] }), false)) {
        navigator.share({ files: [f], title: "Ali di Rondine" }).catch(() => dl(b, name));
      } else dl(b, name);
    }, "image/png");
  }
  function dl(b, name) {
    const u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 4000);
    if (window.toast) window.toast("Immagine salvata nei download", "info", "💾");
  }
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function clip(g, t, max) { t = String(t); if (g.measureText(t).width <= max) return t; while (t.length > 1 && g.measureText(t + "…").width > max) t = t.slice(0, -1); return t + "…"; }

  // ---------------------------------------------------------------- TESSERA DEL BORGO
  function card(cb) {
    const r = rec(), s = sum(), k = sogniCount(), h = hero() || {}, t = curTitle(), fs = favSaga(r);
    const W = 1000, H = 630, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const g = cv.getContext("2d");
    const pHero = safe(() => api().portraitImg("hero"), null) || safe(() => api().portraitImg("leo"), null);
    const favId = r.fav && cast()[r.fav] ? r.fav : "leo", pFav = safe(() => api().portraitImg(favId), null);
    const cov = fs ? safe(() => sal().coverOf(fs.id), null) : null;
    const srcs = [pHero, pFav, cov].filter(Boolean), imgs = {};
    let left = srcs.length; const done = () => { if (--left <= 0) draw(); };
    if (!left) return draw();
    srcs.forEach((u) => { const i = new Image(); i.onload = done; i.onerror = done; i.src = u; imgs[u] = i; });
    function draw() {
      const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#14306a"); bg.addColorStop(0.55, "#0e1c44"); bg.addColorStop(1, "#0a1230"); rr(g, 0, 0, W, H, 34); g.fillStyle = bg; g.fill();
      g.save(); rr(g, 0, 0, W, H, 34); g.clip();
      if (cov && imgs[cov] && imgs[cov].naturalWidth) { g.globalAlpha = 0.32; g.drawImage(imgs[cov], 430, 0, 570, 356); g.globalAlpha = 1; const v = g.createLinearGradient(430, 0, 640, 0); v.addColorStop(0, "#0e1c44"); v.addColorStop(1, "rgba(14,28,68,0)"); g.fillStyle = v; g.fillRect(430, 0, 220, 356); const v2 = g.createLinearGradient(0, 240, 0, 356); v2.addColorStop(0, "rgba(10,18,48,0)"); v2.addColorStop(1, "#0d1a40"); g.fillStyle = v2; g.fillRect(430, 240, 570, 120); }
      g.strokeStyle = "rgba(255,210,63,.07)"; g.lineWidth = 18; for (let x = -H; x < W; x += 60) { g.beginPath(); g.moveTo(x, H); g.lineTo(x + H, 0); g.stroke(); }
      g.fillStyle = "#b3202c"; g.fillRect(0, 0, W, 86); g.fillStyle = "#ffd23f"; g.fillRect(0, 86, W, 6);
      g.restore();
      g.strokeStyle = "#ffd23f"; g.lineWidth = 6; rr(g, 3, 3, W - 6, H - 6, 32); g.stroke();
      g.fillStyle = "#ffd23f"; g.font = "44px 'Dela Gothic One', Impact, sans-serif"; g.textBaseline = "middle"; g.fillText("TESSERA DEL BORGO", 40, 46);
      g.font = "700 20px 'M PLUS Rounded 1c', sans-serif"; g.fillStyle = "#fff"; g.textAlign = "right"; g.fillText("COMUNE DI BORGO MARINO", W - 40, 34); g.fillStyle = "#ffe9a8"; g.fillText("Rondine FC · Coppa della Costa", W - 40, 60); g.textAlign = "left";
      // foto
      g.fillStyle = "#f2ead8"; rr(g, 40, 120, 230, 270, 16); g.fill();
      if (pHero && imgs[pHero] && imgs[pHero].naturalWidth) { g.imageSmoothingEnabled = false; g.save(); rr(g, 52, 132, 206, 206, 10); g.clip(); g.drawImage(imgs[pHero], 52, 132, 206, 206); g.restore(); g.imageSmoothingEnabled = true; }
      g.fillStyle = "#1a1400"; g.font = "800 22px 'M PLUS Rounded 1c', sans-serif"; g.textAlign = "center"; g.fillText(clip(g, h.name || "Campione", 200), 155, 366); g.textAlign = "left";
      // nome e titolo
      g.fillStyle = "#fff"; g.font = "800 46px 'M PLUS Rounded 1c', sans-serif"; g.fillText(clip(g, h.name || "Campione", 640), 300, 150);
      g.font = "800 22px 'M PLUS Rounded 1c', sans-serif"; const tw = g.measureText("🏷️ " + t.n).width + 36; g.fillStyle = "#ffd23f"; rr(g, 300, 182, tw, 44, 22); g.fill(); g.fillStyle = "#1a1400"; g.fillText("🏷️ " + t.n, 318, 205);
      // righe
      const rows = [
        ["⏱ Ore di gioco", hours(r.secs + tick)],
        ["🏛️ Saga preferita", fs ? `${fs.e || ""} ${fs.t.split(" · ")[0]}` : "Ancora nessuna"],
        ["🏆 Finali trovati", `${s.fe || 0} / ${s.te || 0}`],
        ["📚 Saghe concluse", `${s.fin || 0} su ${s.n || 0}`],
        ["🃏 Carte dei Sogni", `${k.own} / ${k.tot}`],
      ];
      rows.forEach((x, i) => { const y = 262 + i * 46; g.fillStyle = "#9fb0d6"; g.font = "700 19px 'M PLUS Rounded 1c', sans-serif"; g.fillText(x[0], 300, y); g.fillStyle = "#fff"; g.font = "800 23px 'M PLUS Rounded 1c', sans-serif"; g.fillText(clip(g, x[1], 420), 520, y); });
      // personaggio preferito
      g.fillStyle = "rgba(255,255,255,.08)"; rr(g, 40, 418, 230, 170, 16); g.fill();
      g.fillStyle = "#9fb0d6"; g.font = "700 16px 'M PLUS Rounded 1c', sans-serif"; g.textAlign = "center"; g.fillText("PERSONAGGIO PREFERITO", 155, 440);
      if (pFav && imgs[pFav] && imgs[pFav].naturalWidth) { g.imageSmoothingEnabled = false; g.save(); rr(g, 112, 454, 86, 86, 10); g.clip(); g.drawImage(imgs[pFav], 112, 454, 86, 86); g.restore(); g.imageSmoothingEnabled = true; }
      g.fillStyle = "#fff"; g.font = "800 18px 'M PLUS Rounded 1c', sans-serif"; g.fillText(clip(g, nameOf(favId) || "Leo", 210), 155, 565); g.textAlign = "left";
      // codice a barre, numero, timbro, motto
      const num = String(Math.abs([...(h.name || "Campione")].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)) % 1000000).padStart(6, "0");
      g.fillStyle = "#f2ead8"; for (let i = 0, x = 300; x < 560; i++) { const w = 2 + ((num.charCodeAt(i % 6) + i * 7) % 4); g.fillRect(x, 520, w, 50); x += w + 3; }
      g.font = "700 16px monospace"; g.fillText("N. " + num, 300, 590);
      g.save(); g.translate(860, 520); g.rotate(-0.22); g.strokeStyle = "rgba(220,60,70,.85)"; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 70, 0, 7); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 58, 0, 7); g.stroke();
      g.fillStyle = "rgba(220,60,70,.9)"; g.font = "800 15px 'M PLUS Rounded 1c', sans-serif"; g.textAlign = "center"; g.fillText("BORGO MARINO", 0, -18); g.font = "28px 'Dela Gothic One', Impact, sans-serif"; g.fillText("VALIDA", 0, 12); g.font = "700 12px 'M PLUS Rounded 1c', sans-serif"; g.fillText("timbro di Pina", 0, 36); g.restore(); g.textAlign = "left";
      g.fillStyle = "#a9b6d6"; g.font = "italic 600 15px 'M PLUS Rounded 1c', sans-serif"; g.fillText("Valida finché Pina non dice il contrario. Non dà diritto a sconti al bar.", 300, 612);
      cb(cv);
    }
  }
  function favList() {
    const C = cast(), base = ["leo", "nico", "pina", "tito", "gilda", "dario", "marta", "rocco", "vale", "mister"].filter((id) => C[id] && C[id].skin);
    const guests = (safe(() => window.__borgoGuests.list(), []) || []).filter((x) => x.on && C[x.id] && C[x.id].skin).map((x) => x.id);
    const others = Object.keys(C).filter((id) => C[id] && C[id].skin && !/_/.test(id) && id !== "hero" && !base.includes(id)).slice(0, 30);
    return [...new Set([...base, ...others, ...guests])];
  }
  function open(back) {
    if (!on("tessera")) { if (window.toast) window.toast("Tessera del Borgo spenta in Impostazioni", "info", "🪪"); if (back) back(); return; }
    const box = overlay("🪪 Tessera del Borgo", back);
    const paint = () => {
      const r = rec(), T = titles(), cur = curTitle();
      box.innerHTML = `<img class="pv" alt="La tua Tessera del Borgo"><div class="row" style="margin-top:12px"><button class="go">💾 Salva o condividi</button></div>
<div class="lbl">Titolo sulla tessera</div><div class="row">${T.map((x) => `<button class="chip ${x.id === cur.id ? "on" : ""} ${x.got ? "" : "lock"}" data-t="${x.id}" title="${esc(x.how)}">${x.got ? "" : "🔒 "}${esc(x.n)}</button>`).join("")}</div>
<p class="note" id="tesHow">Tocca un titolo con 🔒 per sapere come si ottiene.</p>
<div class="lbl">Personaggio preferito</div><div class="faces"></div>
<p class="note">Ore di gioco contate da oggi, solo a schermo acceso. La saga preferita è quella che apri più spesso: il Comune non giudica.</p>`;
      card((cv) => { const im = box.querySelector(".pv"); if (im) im.src = cv.toDataURL("image/png"); box._cv = cv; });
      box.querySelector(".go").onclick = () => { if (box._cv) saveCanvas(box._cv, "tessera-del-borgo.png"); };
      box.querySelectorAll("[data-t]").forEach((b) => b.onclick = () => { const x = T.find((y) => y.id === b.dataset.t); if (!x) return; if (!x.got) { box.querySelector("#tesHow").textContent = `🔒 ${x.n}: ${x.how}.`; return; } const r2 = rec(); r2.title = x.id; save(r2); paint(); });
      const fb = box.querySelector(".faces"), favs = favList(), favCur = r.fav || "leo";
      fb.innerHTML = favs.map((id) => { const u = safe(() => api().portraitImg(id), null); return u ? `<button data-f="${esc(id)}" class="${id === favCur ? "on" : ""}"><img alt="" src="${u}">${esc(clipTxt(nameOf(id), 12))}</button>` : ""; }).join("");
      fb.querySelectorAll("[data-f]").forEach((b) => b.onclick = () => { const r2 = rec(); r2.fav = b.dataset.f; save(r2); paint(); });
    };
    paint();
  }
  const clipTxt = (t, n) => (t.length > n ? t.slice(0, n - 1) + "…" : t);

  // ---------------------------------------------------------------- MODALITÀ FOTO
  function tab() {
    css();
    let b = document.getElementById("tesCam");
    const show = on("foto") && !document.getElementById("tesOv");
    if (!show) { if (b) b.remove(); return; }
    if (b) return;
    b = document.createElement("button"); b.id = "tesCam"; b.setAttribute("aria-label", "Modalità foto"); b.textContent = "📷";
    b.onclick = (e) => { e.stopPropagation(); photo(); };
    document.body.appendChild(b);
  }
  // fermo immagine: tutte le tele visibili, sovrapposte come a schermo (sotto la più grande), senza pulsanti né testi HTML
  function grab() {
    const vw = innerWidth, vh = innerHeight;
    const list = [...document.querySelectorAll("canvas")].filter((c) => {
      if (c.closest("#tesOv")) return false;
      const b = c.getBoundingClientRect(); if (b.width < 60 || b.height < 40 || b.right < 0 || b.bottom < 0 || b.left > vw || b.top > vh) return false;
      for (let e = c; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false; }
      return true;
    });
    if (!list.length) return null;
    const area = (c) => { const b = c.getBoundingClientRect(); return b.width * b.height; };
    const big = list.slice().sort((a, b) => area(b) - area(a))[0], B = big.getBoundingClientRect();
    const z = (c) => { let n = 0; for (let e = c; e && e !== document.body; e = e.parentElement) { const v = parseInt(getComputedStyle(e).zIndex, 10); if (!isNaN(v)) { n = v; break; } } return n; };
    const layers = list.filter((c) => { const b = c.getBoundingClientRect(); return b.right > B.left && b.left < B.right && b.bottom > B.top && b.top < B.bottom && (c === big || area(c) >= area(big) * 0.15); });
    layers.sort((a, b) => z(a) - z(b) || (a.compareDocumentPosition(b) & 4 ? -1 : 1));
    const sc = Math.max(1, Math.min(3, 960 / B.width)), out = document.createElement("canvas"); out.width = Math.round(B.width * sc); out.height = Math.round(B.height * sc);
    const g = out.getContext("2d"); g.imageSmoothingEnabled = false;
    let ok = false;
    layers.forEach((c) => { const b = c.getBoundingClientRect(); try { g.drawImage(c, (b.left - B.left) * sc, (b.top - B.top) * sc, b.width * sc, b.height * sc); ok = true; } catch (e) {} });
    if (!ok) return null;
    // tela 3D senza buffer conservato = tutta trasparente: non è una foto
    const d = safe(() => g.getImageData(0, 0, out.width, out.height).data, null);
    if (d) { let any = false; for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 0) { any = true; break; } if (!any) return null; }
    return out;
  }
  const FRAMES = [["nessuna", "Nessuna"], ["polaroid", "Polaroid"], ["figurina", "Figurina"], ["giornale", "L'Eco del Borgo"], ["cinema", "Cinema"], ["cartolina", "Cartolina"]];
  const FILTERS = [["nessuno", "Originale"], ["seppia", "Seppia"], ["bn", "Bianco e nero"], ["vintage", "Anni '70"], ["notte", "Notte"], ["pop", "Pop"], ["sogno", "Sogno"]];
  function filt(src, f) {
    const c = document.createElement("canvas"); c.width = src.width; c.height = src.height; const g = c.getContext("2d"); g.drawImage(src, 0, 0);
    if (f === "nessuno") return c;
    const im = g.getImageData(0, 0, c.width, c.height), d = im.data, w = c.width, h = c.height;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], gg = d[i + 1], b = d[i + 2]; const l = 0.299 * r + 0.587 * gg + 0.114 * b;
      if (f === "bn") { const v = Math.min(255, (l - 128) * 1.15 + 128); r = gg = b = v; }
      else if (f === "seppia") { r = l * 1.07 + 30; gg = l * 0.9 + 14; b = l * 0.68; }
      else if (f === "vintage") { r = r * 0.8 + l * 0.2 + 22; gg = gg * 0.75 + l * 0.2 + 12; b = b * 0.6 + l * 0.15 + 18; }
      else if (f === "notte") { r = l * 0.35; gg = l * 0.55 + 6; b = l * 0.85 + 30; }
      else if (f === "pop") { r = (r - l) * 1.7 + l; gg = (gg - l) * 1.7 + l; b = (b - l) * 1.7 + l; r = (r - 128) * 1.15 + 128; gg = (gg - 128) * 1.15 + 128; b = (b - 128) * 1.15 + 128; }
      else if (f === "sogno") { r = r * 0.7 + 255 * 0.22; gg = gg * 0.7 + 200 * 0.2; b = b * 0.7 + 255 * 0.28; }
      d[i] = r < 0 ? 0 : r > 255 ? 255 : r; d[i + 1] = gg < 0 ? 0 : gg > 255 ? 255 : gg; d[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }
    g.putImageData(im, 0, 0);
    if (f === "vintage" || f === "seppia" || f === "notte") { const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.7); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, f === "notte" ? "rgba(0,0,20,.6)" : "rgba(40,20,0,.5)"); g.fillStyle = v; g.fillRect(0, 0, w, h); }
    if (f === "vintage") { g.fillStyle = "rgba(255,255,255,.06)"; for (let k = 0; k < 900; k++) g.fillRect((k * 7919) % w, (k * 104729) % h, 2, 2); }
    return c;
  }
  function framed(src, fr, cap) {
    const w = src.width, h = src.height, F = { c: null };
    const mk = (W, H) => { const c = document.createElement("canvas"); c.width = W; c.height = H; F.c = c; return c.getContext("2d"); };
    const today = new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
    const name = (hero() || {}).name || "Campione";
    cap = String(cap || "").trim();
    if (fr === "polaroid") {
      const p = Math.round(w * 0.05), g = mk(w + p * 2, h + p * 2 + Math.round(w * 0.16)); g.fillStyle = "#f7f3ea"; g.fillRect(0, 0, F.c.width, F.c.height); g.drawImage(src, p, p);
      g.fillStyle = "#2a2a4a"; g.font = `${Math.round(w * 0.045)}px 'Segoe Print','Comic Sans MS',cursive`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(clip(g, cap || `Borgo Marino, ${today}`, w), F.c.width / 2, h + p + Math.round(w * 0.08));
    } else if (fr === "figurina") {
      const p = Math.round(w * 0.04), top = Math.round(w * 0.08), bot = Math.round(w * 0.11), g = mk(w + p * 2, h + top + bot + p);
      const gr = g.createLinearGradient(0, 0, F.c.width, F.c.height); gr.addColorStop(0, "#ffe27a"); gr.addColorStop(0.5, "#c8901a"); gr.addColorStop(1, "#ffd23f"); g.fillStyle = gr; g.fillRect(0, 0, F.c.width, F.c.height);
      g.fillStyle = "#b3202c"; g.fillRect(p, p * 0.5, w, top); g.drawImage(src, p, top + p * 0.5); g.strokeStyle = "#fff"; g.lineWidth = Math.max(3, w * 0.006); g.strokeRect(p, top + p * 0.5, w, h);
      g.fillStyle = "#ffd23f"; g.font = `${Math.round(top * 0.6)}px 'Dela Gothic One',Impact,sans-serif`; g.textBaseline = "middle"; g.fillText("ALI DI RONDINE", p * 1.6, p * 0.5 + top / 2); g.textAlign = "right"; g.fillStyle = "#fff"; g.fillText("N. " + String((Date.now() / 1000 | 0) % 1000).padStart(3, "0"), F.c.width - p * 1.6, p * 0.5 + top / 2);
      g.textAlign = "center"; g.fillStyle = "#1a1400"; g.font = `800 ${Math.round(bot * 0.42)}px 'M PLUS Rounded 1c',sans-serif`; g.fillText(clip(g, cap || name, w), F.c.width / 2, top + p * 0.5 + h + bot / 2);
    } else if (fr === "giornale") {
      const p = Math.round(w * 0.05), head = Math.round(w * 0.2), bot = Math.round(w * 0.12), g = mk(w + p * 2, h + head + bot + p); g.fillStyle = "#efe8d6"; g.fillRect(0, 0, F.c.width, F.c.height);
      g.fillStyle = "#1a1a1a"; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.font = `900 ${Math.round(head * 0.38)}px 'Times New Roman',Georgia,serif`; g.fillText("L'ECO DEL BORGO", F.c.width / 2, head * 0.45);
      g.fillRect(p, head * 0.55, w, 3); g.fillRect(p, head * 0.66, w, 1); g.font = `italic ${Math.round(head * 0.1)}px Georgia,serif`; g.fillText(`Borgo Marino · ${today} · Lire 50 · Edizione straordinaria`, F.c.width / 2, head * 0.63);
      g.font = `900 ${Math.round(head * 0.2)}px Georgia,serif`; g.fillText(clip(g, (cap || `${name} fa notizia`).toUpperCase(), w), F.c.width / 2, head * 0.9);
      g.drawImage(src, p, head); g.strokeStyle = "#1a1a1a"; g.lineWidth = 2; g.strokeRect(p, head, w, h);
      g.font = `${Math.round(bot * 0.24)}px Georgia,serif`; g.textAlign = "left"; g.fillText("Il nostro inviato era sul posto. Ha visto tutto. Ha capito la metà.", p, head + h + bot * 0.45); g.fillText("Segue a pagina 7, accanto ai necrologi e ai risultati delle bocce.", p, head + h + bot * 0.8);
    } else if (fr === "cinema") {
      const bar = Math.round(h * 0.14), g = mk(w, h + bar * 2); g.fillStyle = "#000"; g.fillRect(0, 0, w, F.c.height); g.drawImage(src, 0, bar);
      if (cap) { g.font = `800 ${Math.round(bar * 0.38)}px 'M PLUS Rounded 1c',sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 5; g.strokeStyle = "#000"; const t = clip(g, cap, w * 0.9); g.strokeText(t, w / 2, bar + h - bar * 0.45); g.fillStyle = "#ffe14a"; g.fillText(t, w / 2, bar + h - bar * 0.45); }
      g.fillStyle = "#777"; g.font = `${Math.round(bar * 0.26)}px monospace`; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("RONDINE PICTURES · SCENA 1 · CIAK 1", w * 0.03, bar / 2);
    } else if (fr === "cartolina") {
      const p = Math.round(w * 0.04), g = mk(w + p * 2, h + p * 2); g.fillStyle = "#fffaf0"; g.fillRect(0, 0, F.c.width, F.c.height); g.drawImage(src, p, p);
      g.font = `${Math.round(w * 0.075)}px 'Dela Gothic One',Impact,sans-serif`; g.textBaseline = "alphabetic"; g.lineWidth = Math.max(4, w * 0.008); g.strokeStyle = "#fff"; g.fillStyle = "#c0392b"; g.save(); g.translate(p * 2, p + h * 0.2); g.rotate(-0.06); g.strokeText("Saluti da", 0, 0); g.fillText("Saluti da", 0, 0); g.font = `${Math.round(w * 0.1)}px 'Dela Gothic One',Impact,sans-serif`; g.strokeText("BORGO MARINO", 0, w * 0.1); g.fillStyle = "#ffd23f"; g.fillText("BORGO MARINO", 0, w * 0.1); g.restore();
      const sw = w * 0.13, sx = F.c.width - p * 1.5 - sw, sy = p * 1.5; g.fillStyle = "#fff"; g.fillRect(sx - 4, sy - 4, sw + 8, sw * 1.2 + 8); g.fillStyle = "#2f6fb0"; g.fillRect(sx, sy, sw, sw * 1.2); g.fillStyle = "#fff"; g.font = `${Math.round(sw * 0.5)}px serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("⚽", sx + sw / 2, sy + sw * 0.55); g.font = `700 ${Math.round(sw * 0.14)}px sans-serif`; g.fillText("L. 20", sx + sw / 2, sy + sw * 1.05);
      if (cap) { g.textAlign = "right"; g.textBaseline = "alphabetic"; g.font = `${Math.round(w * 0.04)}px 'Segoe Print','Comic Sans MS',cursive`; g.lineWidth = 4; g.strokeStyle = "#000a"; const t = clip(g, cap, w * 0.8); g.strokeText(t, F.c.width - p * 2, p + h - p); g.fillStyle = "#fff"; g.fillText(t, F.c.width - p * 2, p + h - p); }
    } else { const g = mk(w, h); g.drawImage(src, 0, 0); if (cap) { g.font = `800 ${Math.round(h * 0.06)}px 'M PLUS Rounded 1c',sans-serif`; g.textAlign = "center"; g.textBaseline = "bottom"; g.lineWidth = 5; g.strokeStyle = "#000"; const t = clip(g, cap, w * 0.9); g.strokeText(t, w / 2, h - h * 0.04); g.fillStyle = "#fff"; g.fillText(t, w / 2, h - h * 0.04); } }
    return F.c;
  }
  const PH = { fr: "polaroid", fi: "nessuno", cap: "" };
  function photo() {
    if (!on("foto")) return;
    const shot = grab();
    if (!shot) { if (window.toast) window.toast("Qui non c'è niente da fotografare (le scene 3D non si lasciano fermare)", "info", "📷"); return; }
    css(); const fl = document.createElement("div"); fl.className = "tesFlash"; document.body.appendChild(fl); setTimeout(() => fl.remove(), 400);
    window.__fotoPausa = true;
    const chapEl = document.getElementById("chap"), place = chapEl ? chapEl.textContent.trim() : "";
    PH.cap = ""; const box = overlay("📷 Modalità foto", null);
    const x = document.querySelector("#tesOv .x"); if (x) x.onclick = () => { window.__fotoPausa = false; close(); };
    const cache = {};
    const out = () => { const k = PH.fi; if (!cache[k]) cache[k] = filt(shot, k); return framed(cache[k], PH.fr, PH.cap); };
    box.innerHTML = `<img class="pv" alt="Anteprima della foto">
<div class="row" style="margin-top:12px"><button class="go">💾 Salva o condividi</button><button class="go b" data-k="again">↩ Torna al gioco</button></div>
<div class="lbl">Cornice</div><div class="row" data-g="fr">${FRAMES.map((f) => `<button class="chip" data-v="${f[0]}">${esc(f[1])}</button>`).join("")}</div>
<div class="lbl">Filtro</div><div class="row" data-g="fi">${FILTERS.map((f) => `<button class="chip" data-v="${f[0]}">${esc(f[1])}</button>`).join("")}</div>
<div class="lbl">Didascalia</div><input maxlength="60" placeholder="${esc(place ? "Es. " + place : "Scrivi qualcosa (facoltativo)")}">
<p class="note">Scatto = fermo immagine della scena, senza pulsanti né fumetti sopra. Il gioco ti aspetta qui sotto.</p>`;
    const pv = box.querySelector(".pv");
    const paint = () => { box.querySelectorAll("[data-g]").forEach((r) => r.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c.dataset.v === PH[r.dataset.g]))); pv.src = out().toDataURL("image/jpeg", 0.88); };
    box.querySelectorAll("[data-g] .chip").forEach((c) => c.onclick = () => { PH[c.parentElement.dataset.g] = c.dataset.v; paint(); });
    let tmo = 0; box.querySelector("input").oninput = (e) => { PH.cap = e.target.value; clearTimeout(tmo); tmo = setTimeout(paint, 250); };
    box.querySelector(".go").onclick = () => saveCanvas(out(), `foto-borgo-${Date.now()}.png`);
    box.querySelector("[data-k=again]").onclick = () => { window.__fotoPausa = false; close(); };
    paint();
  }

  // ---------------------------------------------------------------- cut-in (Impostazioni e prima volta)
  const LBL = { tessera: ["TESSERA DEL BORGO", "Il tuo profilo, da salvare come immagine", "🪪"], foto: ["MODALITÀ FOTO", "Linguetta 📷 a sinistra · cornici e filtri", "📷"], home: ["HOME CHE CAMBIA", "Il titolo si veste dell'ultima saga giocata", "🏠"] };
  function cutin(k, cb) { const l = LBL[k]; if (l && typeof window.showFeatureCutIn === "function") window.showFeatureCutIn(l[0], l[1], l[2], cb); else if (cb) cb(); }
  function firstTime(cb) {
    const r = rec(); if (r.cut) return false; r.cut = true; save(r);
    if (typeof window.showFeatureCutIn === "function") window.showFeatureCutIn("NOVITÀ AL BORGO", "Tessera del Borgo · Modalità foto 📷 · Home che cambia", "🪪", cb);
    return true;
  }

  window.__tessera = { on, setOn, mark, home, open, photo, grab, card, titles, cutin, firstTime, _rec: rec, _save: save, _filt: filt, _framed: framed, FRAMES, FILTERS };
  const boot = () => tab();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
