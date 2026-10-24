// js/diga-argine.js - «ARGINE» · il minigioco di La Diga di Valpiana (e del cabinato in Sala Giochi). Costruito con Phaser 3 (js/vendor/phaser.min.js, caricato solo quando serve).
// L'acqua esce dalle falle in alto e scende verso il paese. Trascina il dito per allineare una fila di sacchi di sabbia: l'acqua rimbalza sui sacchi e scivola dove la mandi tu.
// Obiettivo: far finire l'acqua nel canale di scolo (ai lati) e non sulle case, fino allo scadere del tempo. Ogni sacco regge qualche colpo, poi cede. La sabbia si rigenera; la 💦 Pompa svuota lo schermo.
// Livelli 1-6. Stelle: 1 = paese salvo; +1 danni sotto il 35%; +1 danni sotto il 10%.
// Opzioni: level (1-6), title, bonus {at,df,te} (Squadra dei Sogni: at = più sabbia, df = sacchi più resistenti, te = pompa in più), tutorial (false = niente), onDone({win, level, damage, stars}). Richiede js/mini.js.
// Test: window.__argine.state (finish(win), place(x1,y1,x2,y2), pump(), s = {dmg, sand, left, drops, sacks, over}).
(function () {
  "use strict";
  if (window.__argine) return;
  const M = window.__mini, W = 360, H = 400, SAND_Y = 296, ROOF_Y = 352, MAXL = 112; // MAXL: lunghezza massima di una fila (sacchi a 8 px, senza buchi)
  // x delle falle, rate = gocce al secondo, can = [larghezza sinistra, larghezza destra] del canale di scolo, dmg = danno % per goccia sulle case
  const LV = [
    { name: "Il primo rigagnolo", hint: "Una sola falla. Trascina il dito per far rotolare l'acqua verso il canale a destra.", time: 18, leaks: [150], rate: 8, can: [0, 54], rocks: [], hp: 6, sand: 120, regen: 16, pump: 1, dmg: 0.95, wind: 0 },
    { name: "Due falle", hint: "Due getti e un canale a sinistra. Una fila diagonale vale più di tanti sacchi sparsi.", time: 22, leaks: [110, 250], rate: 9, can: [54, 0], rocks: [[180, 180, 11]], hp: 6, sand: 130, regen: 15, pump: 1, dmg: 0.9, wind: 0 },
    { name: "Vento di valle", hint: "Il vento spinge l'acqua di lato. Metti i sacchi controvento.", time: 26, leaks: [80, 180, 290], rate: 10, can: [0, 46], rocks: [[120, 170, 10], [250, 210, 10]], hp: 5, sand: 130, regen: 15, pump: 1, dmg: 0.85, wind: 22 },
    { name: "Doppio canale", hint: "Due canali, tre falle. Dividi il flusso: metà a destra, metà a sinistra.", time: 28, leaks: [70, 180, 300], rate: 12, can: [34, 34], rocks: [[110, 190, 11], [250, 190, 11]], hp: 5, sand: 140, regen: 16, pump: 2, dmg: 0.8, wind: -18 },
    { name: "La notte lunga", hint: "Quattro falle e sacchi più fragili. Usa la pompa quando il livello sale troppo.", time: 30, leaks: [60, 140, 220, 300], rate: 14, can: [0, 40], rocks: [[100, 160, 10], [180, 200, 10], [260, 160, 10]], hp: 4, sand: 140, regen: 17, pump: 2, dmg: 0.75, wind: 14 },
    { name: "Cresta di piena", hint: "L'ultima onda. Folate di vento, quattro falle e un solo canale stretto. Tieni duro fino all'alba.", time: 34, leaks: [60, 140, 220, 300], rate: 16, can: [36, 0], rocks: [[110, 150, 10], [180, 220, 10], [250, 150, 10]], hp: 4, sand: 150, regen: 18, pump: 3, dmg: 0.7, wind: 0, gust: 26 }
  ];
  let ui = null, game = null, OPT = {}, S = null, tutC = null, fxo = null;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function loadPhaser(ok, ko) {
    if (window.Phaser) return ok();
    const s = document.createElement("script"); s.src = "js/vendor/phaser.min.js?v=1"; s.onload = () => (window.Phaser ? ok() : ko()); s.onerror = ko; document.head.appendChild(s);
  }
  // ------------------------------------------------------------ spiegazione in tre pagine (disegnata a mano)
  const PAGES = [
    { t: "L'acqua scende", p: "Dalle falle in alto esce acqua. Se arriva sulle case, fa danni. Se finisce nel canale di scolo ai lati, è salva.", draw(g, f) { g.fillStyle = "#0b1530"; g.fillRect(0, 0, 380, 230); g.fillStyle = "#1e3a5f"; g.fillRect(0, 0, 380, 40); g.fillStyle = "#475569"; g.fillRect(150, 30, 80, 14); for (let i = 0; i < 14; i++) { const y = 44 + ((f * 2 + i * 14) % 150); g.fillStyle = "#38bdf8"; g.beginPath(); g.arc(190 + Math.sin(i * 3 + f / 20) * 6, y, 3, 0, 7); g.fill(); } g.fillStyle = "#7c2d12"; for (let i = 0; i < 5; i++) { g.fillRect(40 + i * 60, 196, 34, 22); g.fillStyle = "#b91c1c"; g.fillRect(36 + i * 60, 188, 42, 8); g.fillStyle = "#7c2d12"; } g.fillStyle = "#0ea5e9"; g.fillRect(340, 170, 40, 60); } },
    { t: "Trascina i sacchi", p: "Passa il dito sullo schermo: nasce una fila di sacchi di sabbia. L'acqua rimbalza e scivola in diagonale. Ogni sacco consuma sabbia, che si rigenera.", draw(g, f) { g.fillStyle = "#0b1530"; g.fillRect(0, 0, 380, 230); const k = (f % 120) / 120; for (let i = 0; i < 9; i++) { const t = Math.min(1, k * 1.4 - i * 0.07); if (t <= 0) continue; g.fillStyle = "#a16207"; g.beginPath(); g.arc(120 + i * 22, 70 + i * 12, 9, 0, 7); g.fill(); g.strokeStyle = "#451a03"; g.stroke(); } for (let i = 0; i < 10; i++) { const y = 20 + ((f * 2 + i * 22) % 190), x = y < 80 ? 130 + (y - 20) * 0.2 : 130 + (y - 80) * 1.4; g.fillStyle = "#38bdf8"; g.beginPath(); g.arc(Math.min(x, 352), y, 3, 0, 7); g.fill(); } g.fillStyle = "#0ea5e9"; g.fillRect(340, 150, 40, 80); g.font = "20px serif"; g.fillText("👆", 120 + ((f * 1.5) % 180), 70 + ((f * 1.5) % 180) * 0.54 + 22); } },
    { t: "Pompa e stelle", p: "La 💦 Pompa svuota lo schermo (poche volte). Resisti fino allo scadere del tempo: meno danni, più stelle. Ogni livello aggiunge falle, vento e rocce.", draw(g, f) { g.fillStyle = "#0b1530"; g.fillRect(0, 0, 380, 230); for (let i = 0; i < 24; i++) { const y = (f * 2 + i * 11) % 200 + 20, x = 60 + (i * 53) % 260; g.fillStyle = "#38bdf8"; g.globalAlpha = Math.max(0, 1 - (f % 90) / 30 * (f % 90 < 30 ? 1 : 0)); g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); } g.globalAlpha = 1; g.font = "28px serif"; g.fillText("💦", 170, 120); g.font = "900 22px system-ui"; g.fillStyle = "#fde047"; g.textAlign = "center"; g.fillText("★ ★ ★", 190, 190); g.textAlign = "left"; } }
  ];
  // ------------------------------------------------------------ scena Phaser
  function makeScene(lv, bonus) {
    const PH = window.Phaser;
    const hpMax = lv.hp + (bonus.df | 0), regen = lv.regen * (1 + 0.18 * (bonus.at | 0)), sandMax = lv.sand, pumps = lv.pump + (bonus.te | 0 ? 1 : 0);
    const G = 150, RS = 9, RD = 3; // gravità (px/s²), raggio sacco, raggio goccia (fisica fatta a mano: l'acqua scivola lungo la fila)
    return class Argine extends PH.Scene {
      constructor() { super("argine"); }
      create() {
        const sc = this; sc.left = lv.time; sc.sand = sandMax; sc.dmg = 0; sc.pumps = pumps; sc.acc = 0; sc.over = false; sc.drag = null; sc.hudT = 0; sc.saved = 0; sc.hits = 0;
        sc.dr = []; sc.sk = []; sc.rk = lv.rocks.map(([x, y]) => ({ x, y }));
        const gx = sc.make.graphics({ x: 0, y: 0, add: false });
        gx.fillStyle(0xbae6fd, 1); gx.fillCircle(4, 4, 4); gx.fillStyle(0x38bdf8, 1); gx.fillCircle(4, 4, 3.2); gx.generateTexture("drop", 8, 8); gx.clear();
        gx.fillStyle(0x451a03, 1); gx.fillCircle(9, 9, 9); gx.fillStyle(0xca8a04, 1); gx.fillCircle(9, 9, 7.6); gx.fillStyle(0xfde68a, 1); gx.fillRect(5, 6, 8, 2); gx.fillStyle(0x92400e, 1); gx.fillRect(4, 11, 10, 1); gx.generateTexture("sack", 18, 18); gx.clear();
        gx.fillStyle(0x1f2937, 1); gx.fillCircle(14, 14, 14); gx.fillStyle(0x6b7280, 1); gx.fillCircle(14, 14, 12); gx.fillStyle(0x9ca3af, 1); gx.fillCircle(10, 9, 4); gx.generateTexture("rock", 28, 28); gx.destroy();
        const bg = sc.add.graphics();
        bg.fillGradientStyle(0x0b1530, 0x0b1530, 0x172554, 0x172554, 1); bg.fillRect(0, 0, W, H);
        bg.fillStyle(0x1e3a5f, 1); bg.fillRect(0, 0, W, 44); bg.fillStyle(0x64748b, 1); bg.fillRect(0, 40, W, 12); bg.fillStyle(0x94a3b8, 1); bg.fillRect(0, 40, W, 3);
        lv.leaks.forEach((x) => { bg.fillStyle(0x0f172a, 1); bg.fillRect(x - 9, 40, 18, 14); bg.fillStyle(0x38bdf8, 1); bg.fillRect(x - 6, 50, 12, 4); });
        bg.fillStyle(0x3f3f46, 1); bg.fillRect(0, SAND_Y + 6, W, H - SAND_Y - 6); bg.fillStyle(0x27272a, 1); bg.fillRect(0, SAND_Y + 6, W, 3);
        for (let i = 0; i < 6; i++) { const hx = 44 + i * 54; if (hx < lv.can[0] + 20 || hx > W - lv.can[1] - 20) continue; bg.fillStyle(0x7c2d12, 1); bg.fillRect(hx - 15, ROOF_Y + 6, 30, 28); bg.fillStyle(0xb91c1c, 1); bg.fillTriangle(hx - 19, ROOF_Y + 8, hx + 19, ROOF_Y + 8, hx, ROOF_Y - 12); bg.fillStyle(0xfde047, 1); bg.fillRect(hx - 4, ROOF_Y + 14, 8, 8); }
        bg.fillStyle(0x0369a1, 1); if (lv.can[0]) { bg.fillRect(0, SAND_Y, lv.can[0], H - SAND_Y); bg.fillStyle(0x38bdf8, 0.5); for (let y = SAND_Y + 8; y < H; y += 14) bg.fillRect(4, y, lv.can[0] - 8, 3); } bg.fillStyle(0x0369a1, 1);
        if (lv.can[1]) { bg.fillRect(W - lv.can[1], SAND_Y, lv.can[1], H - SAND_Y); bg.fillStyle(0x38bdf8, 0.5); for (let y = SAND_Y + 8; y < H; y += 14) bg.fillRect(W - lv.can[1] + 4, y, lv.can[1] - 8, 3); }
        sc.add.text(W / 2, H - 14, "PAESE DI VALPIANA", { fontFamily: "system-ui", fontSize: "10px", color: "#cbd5e1" }).setOrigin(0.5);
        sc.rk.forEach((k) => sc.add.image(k.x, k.y, "rock"));
        sc.gfx = sc.add.graphics().setDepth(10); sc.parts = []; sc.msg = sc.add.text(W / 2, 150, "", { fontFamily: "system-ui", fontSize: "26px", fontStyle: "900", color: "#fde047", stroke: "#000", strokeThickness: 5, align: "center" }).setOrigin(0.5).setDepth(20);
        sc.input.on("pointerdown", (p) => { if (sc.over || p.y > SAND_Y) return; sc.drag = { x: p.x, y: p.y, x2: p.x, y2: p.y }; });
        sc.input.on("pointermove", (p) => { if (sc.drag) { sc.drag.x2 = p.x; sc.drag.y2 = p.y; } });
        const up = () => { const d = sc.drag; sc.drag = null; if (d && !sc.over) sc.place(d.x, d.y, d.x2, d.y2); };
        sc.input.on("pointerup", up); sc.input.on("pointerupoutside", up);
        window.__argine.scene = sc;
      }
      burst(x, y, n, col) { for (let i = 0; i < n; i++) this.parts.push({ x, y, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 2.4, l: 18 + Math.random() * 12, c: col }); }
      line(x1, y1, x2, y2) {
        let len = Math.hypot(x2 - x1, y2 - y1); if (len > MAXL) { x2 = x1 + (x2 - x1) * (MAXL / len); y2 = y1 + (y2 - y1) * (MAXL / len); len = MAXL; }
        const n = len < 12 ? 1 : Math.min(15, Math.round(len / 8) + 1), a = [];
        for (let i = 0; i < n; i++) { const t = n === 1 ? 0 : i / (n - 1); a.push([clamp(x1 + (x2 - x1) * t, 10, W - 10), clamp(y1 + (y2 - y1) * t, 58, SAND_Y - 8)]); } return a;
      }
      place(x1, y1, x2, y2) {
        const sc = this; let put = 0;
        sc.line(x1, y1, x2, y2).forEach(([x, y]) => { if (sc.sand < 4) return; const im = sc.add.image(x, y, "sack").setDepth(5); sc.sk.push({ x, y, hp: hpMax, im }); sc.sand -= 4; put++; });
        if (put) sc.burst(x1, y1, 5, 0xfde68a); return put;
      }
      pump() {
        const sc = this; if (sc.pumps <= 0 || sc.over) return false; sc.pumps--;
        sc.dr.forEach((d) => { sc.burst(d.x, d.y, 1, 0x7dd3fc); d.im.destroy(); }); sc.dr = []; return true;
      }
      finishNow(win) { if (this.over) return; this.over = true; this.win = !!win; const dm = Math.round(this.dmg); this.msg.setText(win ? "ARGINE TENUTO!" : "PAESE ALLAGATO"); this.msg.setColor(win ? "#86efac" : "#fca5a5"); window.__argine.over(win, dm); }
      hit(d, ox, oy, R, sack) { // goccia contro un ostacolo tondo: spinge fuori, toglie la componente contro la superficie, tiene quella lungo (così scivola)
        const dx = d.x - ox, dy = d.y - oy, dist = Math.hypot(dx, dy); if (dist >= R) return false;
        const m = dist || 0.01, nx = dx / m, ny = dy / m; d.x = ox + nx * R; d.y = oy + ny * R; const vn = d.vx * nx + d.vy * ny;
        if (vn < 0) { d.vx -= (1 + 0.1) * vn * nx; d.vy -= (1 + 0.1) * vn * ny; if (sack && -vn > 60) { sack.hp -= 0.11; sack.im.setAlpha(0.5 + 0.5 * clamp(sack.hp / hpMax, 0, 1)); this.hits++; } }
        return true;
      }
      update(time, dtMs) {
        const sc = this, dt = Math.min(dtMs, 50) / 1000;
        sc.gfx.clear();
        if (sc.drag && !sc.over) { const d = sc.drag; sc.line(d.x, d.y, d.x2, d.y2).forEach(([x, y]) => { sc.gfx.fillStyle(0xfde68a, 0.55); sc.gfx.fillCircle(x, y, 8); }); }
        sc.parts = sc.parts.filter((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.12; sc.gfx.fillStyle(p.c, Math.min(1, p.l / 12)); sc.gfx.fillRect(p.x, p.y, 3, 3); return --p.l > 0; });
        if (sc.over) return;
        sc.left -= dt; sc.sand = Math.min(sandMax, sc.sand + regen * dt);
        const gust = lv.gust ? Math.sin(time / 1300) * lv.gust : 0, wind = lv.wind + gust;
        sc.acc += lv.rate * dt;
        while (sc.acc >= 1) { sc.acc -= 1; if (sc.dr.length > 420) break; const x = lv.leaks[Math.floor(Math.random() * lv.leaks.length)] + (Math.random() - 0.5) * 8; sc.dr.push({ x, y: 54, vx: (Math.random() - 0.5) * 36, vy: 40 + Math.random() * 26, born: time, im: sc.add.image(x, 54, "drop").setDepth(6) }); }
        const sub = 2, h = dt / sub;
        for (let s = 0; s < sub; s++) sc.dr.forEach((d) => {
          d.vy = Math.min(190, d.vy + G * h); d.vx += wind * h; d.x += d.vx * h; d.y += d.vy * h;
          sc.sk.forEach((k) => { if (k.hp > 0 && Math.abs(d.x - k.x) < RS + RD && Math.abs(d.y - k.y) < RS + RD) sc.hit(d, k.x, k.y, RS + RD, k); });
          sc.rk.forEach((k) => sc.hit(d, k.x, k.y, 14 + RD, null));
          if (d.x < 3) { d.x = 3; d.vx = Math.abs(d.vx) * 0.2; } else if (d.x > W - 3) { d.x = W - 3; d.vx = -Math.abs(d.vx) * 0.2; } // le pareti laterali
        });
        sc.sk = sc.sk.filter((k) => { if (k.hp > 0) return true; sc.burst(k.x, k.y, 8, 0xfde68a); k.im.destroy(); return false; });
        sc.dr = sc.dr.filter((d) => {
          const x = d.x, y = d.y; let gone = false;
          if (y >= SAND_Y && ((lv.can[0] && x <= lv.can[0]) || (lv.can[1] && x >= W - lv.can[1]))) { sc.saved++; sc.burst(x, y, 1, 0x38bdf8); gone = true; }
          else if (y >= ROOF_Y) { sc.dmg += lv.dmg; sc.burst(x, y, 2, 0xf87171); sc.cameras.main.shake(60, 0.002); gone = true; }
          else if (x < -6 || x > W + 6 || time - d.born > 14000) gone = true;
          if (gone) d.im.destroy(); else d.im.setPosition(x, y);
          return !gone;
        });
        if (sc.dmg >= 100) return sc.finishNow(false);
        if (sc.left <= 0) return sc.finishNow(true);
        sc.hudT += dtMs; if (sc.hudT > 120) { sc.hudT = 0; window.__argine.hud(sc); }
      }
    };
  }
  // ------------------------------------------------------------ interfaccia
  function hud(sc) {
    if (!ui) return; const d = Math.round(sc.dmg), s = Math.round((sc.sand / 150) * 100);
    ui.hud.style.whiteSpace = "nowrap"; ui.hud.innerHTML = `<span>⏱ <b>${Math.max(0, Math.ceil(sc.left))}</b>s</span><span>🏠 danni <b style="color:${d > 60 ? "#f87171" : d > 30 ? "#fbbf24" : "#86efac"}">${d}%</b></span><span>🧱 sabbia <b>${Math.floor(sc.sand)}</b></span><span>💦 <b>${sc.pumps}</b></span>`;
  }
  function over(win, dmg) {
    if (!ui || !S) return; S.win = win; S.dmg = dmg; S.stars = win ? 1 + (dmg < 35 ? 1 : 0) + (dmg < 10 ? 1 : 0) : 0; S.done = true; hud(window.__argine.scene);
    ui.lg.innerHTML = win ? `<b>Argine tenuto!</b> Danni ${dmg}% · ${"⭐".repeat(S.stars)}` : `<b>Il paese è allagato.</b> Danni ${dmg}%. Riprova: cambia l'angolo dei sacchi.`;
    ui.bt.innerHTML = `<button data-a="retry">↻ Riprova</button><button data-a="ok" class="go">${win ? "Continua ▸" : "Chiudi"}</button>`;
    ui.bt.querySelectorAll("button").forEach((b) => (b.onclick = () => { if (b.dataset.a === "retry") begin(S.level); else close(win); }));
  }
  function begin(n) {
    const lv = LV[clamp(n, 1, LV.length) - 1]; S = { level: n, win: false, dmg: 0, stars: 0, done: false };
    if (game) { game.destroy(true); game = null; }
    ui.hud.innerHTML = ""; ui.lg.innerHTML = `<b>${n}. ${lv.name}.</b> ${lv.hint}`;
    ui.bt.innerHTML = `<button data-a="pump">💦 Pompa<small>svuota lo schermo</small></button>`;
    ui.bt.querySelector("button").onclick = () => { if (game && game.scene.keys.argine && game.scene.keys.argine.pump) { game.scene.keys.argine.pump(); hud(game.scene.keys.argine); } };
    ui.holder.innerHTML = "";
    const Scn = makeScene(lv, OPT.bonus || {});
    game = new window.Phaser.Game({ type: window.Phaser.CANVAS, parent: ui.holder, width: W, height: H, backgroundColor: "#0b1530", banner: false, audio: { noAudio: true },
      scale: { mode: window.Phaser.Scale.FIT, autoCenter: window.Phaser.Scale.CENTER_BOTH }, input: { touch: { capture: true } }, scene: Scn });
  }
  function close(w) {
    const o = OPT, r = { win: !!w && !!(S && S.win), level: S ? S.level : 0, damage: S ? S.dmg : 0, stars: S ? S.stars : 0 };
    if (game) { try { game.destroy(true); } catch (e) {} game = null; } if (ui) ui.root.remove(); ui = null; S = null; tutC = null;
    document.removeEventListener("keydown", key);
    if (o.onDone) o.onDone(r);
  }
  function key(e) { if (e.key === " " && game && game.scene.keys.argine) { game.scene.keys.argine.pump(); e.preventDefault(); } }
  function start(o) {
    if (ui) ui.root.remove(); OPT = o || {}; const n = clamp(OPT.level | 0 || 1, 1, LV.length);
    ui = M.shell("argOv", "🌊 " + (OPT.title || "Argine"), "#38bdf8"); ui.root.style.background = "#070b14"; ui.cv.style.display = "none";
    ui.holder = document.createElement("div"); ui.holder.style.cssText = "width:100%;aspect-ratio:" + W + "/" + H + ";position:relative;border:2px solid rgba(255,255,255,.2);border-radius:12px;overflow:hidden;touch-action:none;background:#0b1530";
    ui.cv.parentNode.insertBefore(ui.holder, ui.cv.nextSibling);
    const quit = document.createElement("button"); quit.textContent = "✕"; quit.setAttribute("aria-label", "Esci"); quit.className = "hp"; quit.style.cssText = "margin-left:6px"; quit.onclick = () => close(false); ui.root.querySelector(".top").appendChild(quit);
    document.addEventListener("keydown", key);
    ui.help.onclick = () => { if (!(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "argine", pages: PAGES, onClose: () => { tutC = null; } }); };
    ui.lg.textContent = "Carico il motore Phaser…";
    loadPhaser(() => {
      if (!ui) return; begin(n);
      if (OPT.tutorial !== false && !M.seen("argine")) tutC = M.tut({ root: ui.root, key: "argine", pages: PAGES, onClose: () => { tutC = null; } });
    }, () => { if (ui) ui.lg.innerHTML = "Serve la connessione la prima volta per caricare il motore Phaser. Riprova più tardi."; });
    return true;
  }
  window.__argine = { start, count: LV.length, LV, hud, over, scene: null,
    state: { finish(w) { const sc = window.__argine.scene; if (sc && !sc.over) sc.finishNow(!!w); else if (S && !S.done) over(!!w, S.dmg); },
      place(x1, y1, x2, y2) { const sc = window.__argine.scene; return sc ? sc.place(x1, y1, x2, y2) : 0; }, pump() { const sc = window.__argine.scene; return sc ? sc.pump() : false; },
      get s() { const sc = window.__argine.scene; return sc && S ? { dmg: sc.dmg, sand: sc.sand, left: sc.left, drops: sc.dr.length, sacks: sc.sk.length, saved: sc.saved, hits: sc.hits, over: sc.over, win: sc.win, level: S.level } : null; },
      get over() { return !!(S && S.done); } } };
})();
