// js/mini.js - utilità comuni per i minigiochi delle saghe (struttura grafica + spiegazione in pagine + prova libera).
// Contenitore atteso: root > .wr > [.top (titolo + pulsante ?) , .hud, .cv (canvas), .bt (pulsanti), .lg (testo)].
// window.__mini.shell(id, title) crea overlay + struttura e restituisce {root, wr, cv, g, hud, bt, lg, help}.
// window.__mini.tut({ root, key, pages:[{t, p, draw(g, f)}], onClose(practice) }) apre la spiegazione (3 pagine con scena animata) dentro root; «Salta/Gioca» -> onClose(false), «Prova libera» -> onClose(true).
// window.__mini.seen(key) / mark(key): la spiegazione parte da sola solo la prima volta.
// window.__mini.fx() -> { burst(x,y,n,cols), text(t,x,y,c), banner(t,c), shake(n), tick(), draw(g) } per particelle, scritte e striscioni.
// window.__mini.img(id) -> ritratto (Image) del personaggio o null. window.__mini.man(g,x,y,o) disegna una figura con ritratto.
(function () {
  "use strict";
  if (window.__mini) return;
  const W = 380, H = 230, SS = 2;
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = (k) => "ali-di-rondine.mini." + k;
  const seen = (k) => safe(() => localStorage.getItem(store(k)) === "1", false), mark = (k) => safe(() => localStorage.setItem(store(k), "1"), 0);
  const IMG = {}; const img = (id) => { if (!id || id === "hero") return null; if (IMG[id] !== undefined) return IMG[id]; const u = safe(() => window.__sogni.port(id), null); if (!u) return (IMG[id] = null); const i = new Image(); i.src = u; return (IMG[id] = i); };
  function css() {
    if (document.getElementById("miniCss")) return; const st = document.createElement("style"); st.id = "miniCss";
    st.textContent = `.miniOv{position:fixed;inset:0;z-index:300;background:#070d20;color:#e8f0ff;font-family:system-ui,sans-serif;overflow:auto;touch-action:manipulation}.miniOv .wr{max-width:560px;margin:0 auto;padding:8px;display:flex;flex-direction:column;gap:7px;min-height:100%}
.miniOv .top{display:flex;justify-content:space-between;align-items:center;gap:8px}.miniOv h3{margin:0;font:900 17px system-ui;color:var(--ac,#7dd3fc)}.miniOv .hp{width:38px;height:38px;border-radius:50%;border:2px solid var(--ac,#7dd3fc);background:rgba(255,255,255,.07);color:var(--ac,#7dd3fc);font:900 18px system-ui;flex:none}
.miniOv .hud{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:6px 10px;font-size:12px;flex-wrap:wrap}.miniOv .hud b{color:var(--ac,#7dd3fc)}.miniOv .bar{flex:1;min-width:60px;height:10px;border-radius:6px;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.2);overflow:hidden}.miniOv .bar i{display:block;height:100%;background:var(--ac,#7dd3fc);transition:width .25s}
.miniOv .cv canvas{display:block;width:100%;height:auto;border:2px solid rgba(255,255,255,.2);border-radius:12px;background:#0b1530;touch-action:none}
.miniOv .bt{display:flex;gap:6px;flex-wrap:wrap}.miniOv .bt button{flex:1;min-width:84px;min-height:58px;border-radius:12px;border:2px solid var(--ac,#7dd3fc);background:rgba(255,255,255,.08);color:#fff;font:800 14px system-ui;padding:4px}.miniOv .bt button small{display:block;font-size:11px;font-weight:500;opacity:.8}.miniOv .bt button:disabled{opacity:.4}.miniOv .bt button.pw{border-color:#fbbf24;background:rgba(251,191,36,.18)}
.miniOv .lg{font-size:13px;line-height:1.4;min-height:40px;background:rgba(0,0,0,.35);border-radius:10px;padding:7px 10px}
.miniOv .go{min-height:50px;border-radius:12px;border:2px solid #fbbf24;background:#b45309;color:#fff;font:900 16px system-ui;flex:1}
.miniOv.tutOn .wr>:not(.tut):not(.top){display:none}.miniOv .tut{border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.2);display:flex;flex-direction:column;padding:12px;gap:9px}.miniOv .tut h4{margin:0;font:900 16px system-ui;color:var(--ac,#7dd3fc)}.miniOv .tut p{margin:0;font-size:13px;line-height:1.4}.miniOv .tut canvas{width:100%;border-radius:10px;border:1px solid rgba(255,255,255,.2)}
.miniOv .tut .nv{display:flex;gap:6px;margin-top:4px}.miniOv .tut .nv button{flex:1;min-height:42px;border-radius:10px;border:2px solid var(--ac,#7dd3fc);background:rgba(255,255,255,.08);color:#fff;font:800 14px system-ui}.miniOv .tut .nv .pr{background:rgba(255,255,255,.2)}`;
    document.head.appendChild(st);
  }
  function shell(id, title, ac) {
    css(); const old = document.getElementById(id); if (old) old.remove(); const root = document.createElement("div"); root.id = id; root.className = "miniOv"; if (ac) root.style.setProperty("--ac", ac); document.body.appendChild(root);
    root.innerHTML = `<div class="wr"><div class="top"><h3>${esc(title)}</h3><button class="hp" aria-label="Come si gioca">?</button></div><div class="hud"></div><div class="cv"><canvas width="${W * SS}" height="${H * SS}"></canvas></div><div class="bt"></div><div class="lg"></div></div>`;
    const cv = root.querySelector("canvas"); return { root, wr: root.querySelector(".wr"), cv, g: cv.getContext("2d"), hud: root.querySelector(".hud"), bt: root.querySelector(".bt"), lg: root.querySelector(".lg"), help: root.querySelector(".hp") };
  }
  function tut(o) {
    const root = o.root, wr = root.querySelector(".wr"); let page = 0, raf = 0, f = 0, cvEl = null;
    function stopAnim() { cancelAnimationFrame(raf); raf = 0; }
    function close(practice) { stopAnim(); const el = wr.querySelector(".tut"); if (el) el.remove(); root.classList.remove("tutOn"); mark(o.key); o.onClose && o.onClose(!!practice); }
    function show(i) {
      stopAnim(); page = i; root.classList.add("tutOn"); let el = wr.querySelector(".tut"); if (!el) { el = document.createElement("div"); el.className = "tut"; wr.insertBefore(el, wr.querySelector(".hud")); }
      const pg = o.pages[i], last = i === o.pages.length - 1;
      el.innerHTML = `<h4>${i + 1} · ${pg.t}</h4><canvas width="${W * SS}" height="${H * SS}"></canvas><p>${pg.p}</p><div class="nv">${i ? `<button data-a="b">◂ Indietro</button>` : `<button data-a="x">Salta</button>`}${last ? `<button class="pr" data-a="pr">🎮 Prova libera</button><button class="pr" data-a="go">▶ Gioca</button>` : `<button class="pr" data-a="n">Avanti ▸</button>`}</div>`;
      cvEl = el.querySelector("canvas"); const g = cvEl.getContext("2d"); f = 0; const lp = () => { if (!cvEl.isConnected) return; f++; g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); safe(() => pg.draw(g, f), 0); raf = requestAnimationFrame(lp); }; lp();
      el.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => { const a = b.dataset.a; if (a === "n") return show(page + 1); if (a === "b") return show(page - 1); close(a === "pr"); }));
    }
    show(0); return { close: () => { stopAnim(); const el = wr.querySelector(".tut"); if (el) el.remove(); root.classList.remove("tutOn"); }, get open() { return !!wr.querySelector(".tut"); } };
  }
  function fx() {
    const F = { parts: [], texts: [], b: null, sh: 0 };
    F.burst = (x, y, n, cols) => { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = 0.8 + Math.random() * 2.6; F.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.8, l: 22 + Math.random() * 22, c: cols[i % cols.length], s: 2 + Math.random() * 2 }); } };
    F.text = (t, x, y, c) => F.texts.push({ t, x, y, c: c || "#fde047", l: 40 });
    F.banner = (t, c) => { F.b = { t, c: c || "#fde047", l: 80 }; };
    F.shake = (n) => { F.sh = Math.max(F.sh, n); };
    F.tick = () => { F.parts = F.parts.filter((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.08; return --p.l > 0; }); F.texts = F.texts.filter((x) => --x.l > 0); if (F.b && --F.b.l <= 0) F.b = null; if (F.sh > 0) F.sh -= 0.6; };
    F.draw = (g) => {
      F.parts.forEach((p) => { g.globalAlpha = Math.min(1, p.l / 12); g.fillStyle = p.c; g.fillRect(p.x, p.y, p.s, p.s); }); g.globalAlpha = 1;
      g.font = "900 14px system-ui"; g.textAlign = "center"; F.texts.forEach((x) => { g.globalAlpha = Math.min(1, x.l / 18); g.strokeStyle = "#000"; g.lineWidth = 3; g.fillStyle = x.c; g.strokeText(x.t, x.x, x.y - (40 - x.l) * 0.7); g.fillText(x.t, x.x, x.y - (40 - x.l) * 0.7); }); g.globalAlpha = 1;
      if (F.b) { const k = Math.min(1, (80 - F.b.l) / 8), a = Math.min(1, F.b.l / 14); g.save(); g.globalAlpha = a; g.translate(W / 2, 112); g.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k); g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(-W / 2, -26, W, 52); g.font = "900 32px system-ui"; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = "#000"; g.fillStyle = F.b.c; g.strokeText(F.b.t, 0, 12); g.fillText(F.b.t, 0, 12); g.restore(); }
    };
    return F;
  }
  // figura frontale con ritratto (token): corpo colorato, testa col ritratto o icona
  function man(g, x, y, o) {
    o = o || {}; const s = o.s || 1, col = o.col || "#2563eb"; g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(0, 11, 11, 3.6, 0, 0, 7); g.fill();
    g.fillStyle = o.shorts || "#f8fafc"; g.beginPath(); g.roundRect(-6, 3, 12, 7, 2); g.fill();
    g.fillStyle = col; g.strokeStyle = "rgba(0,0,0,.65)"; g.lineWidth = 1.2; g.beginPath(); g.roundRect(-8.5, -7, 17, 14, 4); g.fill(); g.stroke();
    if (o.arms != null) { g.strokeStyle = "#e8c8a0"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(-8, -3); g.lineTo(-13, o.arms); g.moveTo(8, -3); g.lineTo(13, o.arms); g.stroke(); }
    if (o.num != null) { g.fillStyle = "rgba(255,255,255,.9)"; g.font = "900 8px system-ui"; g.textAlign = "center"; g.fillText(String(o.num), 0, 4); }
    const im = o.img, hy = -13; g.save(); g.beginPath(); g.arc(0, hy, 8, 0, 7); g.clip(); if (im && im.complete && im.naturalWidth) g.drawImage(im, -8, hy - 8.5, 16, 16); else { g.fillStyle = o.skin || "#e8c8a0"; g.fillRect(-8, hy - 8, 16, 16); if (o.icon) { g.font = "11px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(o.icon, 0, hy + 1); g.textBaseline = "alphabetic"; } } g.restore();
    g.strokeStyle = o.ring || "#fff"; g.lineWidth = o.rw || 1.8; g.beginPath(); g.arc(0, hy, 8, 0, 7); g.stroke(); g.restore();
  }
  window.__mini = { W, H, SS, esc, safe, seen, mark, img, shell, tut, fx, man };
})();
