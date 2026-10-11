// js/cristalli-mode7.js - LA MAPPA DEL MONDO IN PSEUDO-3D (Mode 7) di «Cristalli del Campo»
// Un piccolo motore grafico a parte: il terreno del mondo (mare, isole, santuari) è una texture disegnata a codice e
// proiettata in prospettiva riga per riga, come nei JRPG a 16 bit. Si pilota l'aeronave e si atterra nei luoghi.
// Comandi: ◀ ▶ virano, ▲ accelera, ▼ frena; oppure frecce da tastiera. Vicino a un luogo compare «Atterra».
// Uso: window.__crMode7.start({ places:[{id,name,x,y,col,locked}], at:{x,y,a}, title, onLand(id, pos), onExit(pos) })
(function () {
  "use strict";
  if (window.__crMode7) return;
  const W = 320, H = 200, HOR = 64, TEX = 512, FOCAL = 120, CAMH = 34;
  let S = null, TEXD = null, TEXC = null, TEXK = "";
  // ---------------------------------------------------------------- la texture del mondo, disegnata una volta
  function hash(x, y) { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function noise(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, s = (t) => t * t * (3 - 2 * t); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * s(xf) + (c - a) * s(yf) + (a - b - c + d) * s(xf) * s(yf); }
  function buildTexture(places) {
    const c = document.createElement("canvas"); c.width = c.height = TEX; const g = c.getContext("2d");
    const img = g.createImageData(TEX, TEX), d = img.data;
    const isl = places.map((p) => ({ x: p.x, y: p.y, r: p.r || 46 }));
    for (let y = 0; y < TEX; y++) for (let x = 0; x < TEX; x++) {
      let land = -0.35; isl.forEach((I) => { let dx = Math.abs(x - I.x), dy = Math.abs(y - I.y); dx = Math.min(dx, TEX - dx); dy = Math.min(dy, TEX - dy); land = Math.max(land, 1 - Math.hypot(dx, dy) / I.r); });
      const n = noise(x / 22, y / 22) * 0.55 + noise(x / 7, y / 7) * 0.2 - 0.3; const h = land + n * 0.6;
      let r, gg, b;
      if (h < 0) { const dp = Math.min(1, -h * 2); r = 30 - dp * 18; gg = 90 - dp * 40; b = 150 - dp * 40; if (h > -0.08) { r = 90; gg = 170; b = 190; } }
      else if (h < 0.08) { r = 222; gg = 200; b = 140; }
      else if (h < 0.45) { const t = noise(x / 5, y / 5); r = 70 + t * 30; gg = 140 + t * 40; b = 60 + t * 20; }
      else if (h < 0.7) { r = 50; gg = 105; b = 50; }
      else { r = 150; gg = 140; b = 130; }
      const i = (y * TEX + x) * 4; d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    // santuari: un campo da calcio e un cristallo per ogni luogo
    places.forEach((p) => { g.fillStyle = "#3e8e4a"; g.fillRect(p.x - 10, p.y - 6, 20, 12); g.strokeStyle = "#fff"; g.lineWidth = 1; g.strokeRect(p.x - 10, p.y - 6, 20, 12); g.beginPath(); g.moveTo(p.x, p.y - 6); g.lineTo(p.x, p.y + 6); g.stroke(); g.fillStyle = p.col || "#ffd36b"; g.beginPath(); g.moveTo(p.x + 14, p.y - 8); g.lineTo(p.x + 18, p.y); g.lineTo(p.x + 14, p.y + 8); g.lineTo(p.x + 10, p.y); g.fill(); });
    TEXC = c; TEXD = new Uint32Array(g.getImageData(0, 0, TEX, TEX).data.buffer);
  }
  // ---------------------------------------------------------------- DOM
  function css() {
    if (document.getElementById("crM7style")) return;
    const st = document.createElement("style"); st.id = "crM7style";
    st.textContent = `#crM7{position:fixed;inset:0;z-index:300;background:#05060e;display:flex;flex-direction:column;align-items:center;padding:8px;gap:8px;font-family:Georgia,serif;color:#f0e6c8;touch-action:none;user-select:none;-webkit-user-select:none}
#crM7 .top{width:min(100%,460px);display:flex;justify-content:space-between;font-weight:700;font-size:14px}
#crM7 canvas{width:min(100%,460px);aspect-ratio:16/10;border:2px solid #c9a227;border-radius:6px;image-rendering:pixelated;box-shadow:0 0 18px #c9a22744}
#crM7 .pad{width:min(100%,460px);display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto auto;gap:8px}
#crM7 button{font:700 18px Georgia,serif;color:#f0e6c8;background:linear-gradient(#1a2a6a,#0a1440);border:2px solid #e8e0d0;border-radius:8px;padding:14px 6px;cursor:pointer;touch-action:none}
#crM7 button.on{background:#c9a227;color:#0a1440}
#crM7 .land{grid-column:1/-1;font-size:16px;background:linear-gradient(#c9a227,#8a6a1a);color:#0a1440;display:none}#crM7 .land.ok{display:block}
#crM7 .exit{grid-column:1/-1;font-size:12px;padding:6px;background:#2a2a3a}`;
    document.head.appendChild(st);
  }
  // ---------------------------------------------------------------- rendering Mode 7
  function render() {
    const g = S.g, img = S.img, buf = S.buf, cam = S.cam, sa = Math.sin(cam.a), ca = Math.cos(cam.a);
    // cielo
    for (let y = 0; y <= HOR; y++) { const t = Math.min(1, y / HOR), r = 40 + t * 120, gg = 60 + t * 120, b = 120 + t * 110; const col = (255 << 24) | (b << 16) | (gg << 8) | r; for (let x = 0; x < W; x++) buf[y * W + x] = col; }
    // nuvole sul cielo (si spostano con la virata)
    for (let i = 0; i < 9; i++) { const cx = ((i * 97 - cam.a * 160 + S.t * 0.05) % (W + 80) + W + 80) % (W + 80) - 40, cy = 12 + (i * 23) % 40; for (let k = -18; k <= 18; k++) for (let j = -4; j <= 4; j++) { if (k * k / 324 + j * j / 16 > 1) continue; const x = (cx + k) | 0, y = (cy + j) | 0; if (x >= 0 && x < W && y >= 0 && y < HOR) buf[y * W + x] = 0xfff0f0f8; } }
    // terreno proiettato riga per riga
    for (let y = HOR + 1; y < H; y++) {
      const dist = CAMH * FOCAL / (y - HOR), fog = Math.min(1, (y - HOR) / 70);
      const wx0 = cam.x + ca * dist - sa * dist * (-W / 2) / FOCAL, wy0 = cam.y + sa * dist + ca * dist * (-W / 2) / FOCAL;
      const dx = -sa * dist / FOCAL, dy = ca * dist / FOCAL;
      let wx = wx0, wy = wy0;
      for (let x = 0; x < W; x++) {
        const tx = ((wx | 0) % TEX + TEX) % TEX, ty = ((wy | 0) % TEX + TEX) % TEX; let c = TEXD[ty * TEX + tx];
        if (fog < 1) { const r = c & 255, gg = (c >> 8) & 255, b = (c >> 16) & 255, f = fog, fr = 170, fgc = 180, fb = 230; c = (255 << 24) | (((b * f + fb * (1 - f)) | 0) << 16) | (((gg * f + fgc * (1 - f)) | 0) << 8) | ((r * f + fr * (1 - f)) | 0); }
        buf[y * W + x] = c; wx += dx; wy += dy;
      }
    }
    g.putImageData(img, 0, 0);
    // luoghi: colonne di luce e nomi proiettati
    S.near = null;
    S.o.places.forEach((p) => {
      let dx = p.x - cam.x, dy = p.y - cam.y; dx = ((dx + TEX / 2) % TEX + TEX) % TEX - TEX / 2; dy = ((dy + TEX / 2) % TEX + TEX) % TEX - TEX / 2;
      const fwd = dx * ca + dy * sa, side = -dx * sa + dy * ca, dd = Math.hypot(dx, dy);
      if (dd < 26 && !p.locked) S.near = p;
      if (fwd < 4) return;
      const sx = W / 2 + side * FOCAL / fwd, sy = HOR + CAMH * FOCAL / fwd; if (sx < -20 || sx > W + 20 || sy > H) return;
      const hgt = Math.min(60, 900 / fwd);
      g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createLinearGradient(sx, sy - hgt, sx, sy); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(1, p.locked ? "rgba(120,120,140,.5)" : hexA(p.col || "#ffd36b", 0.7)); g.fillStyle = gr; g.fillRect(sx - 3, sy - hgt, 6, hgt); g.restore();
      if (fwd < 220) { g.font = "bold 8px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#000a"; g.fillText(p.locked ? "???" : p.name, sx + 1, sy - hgt - 3); g.fillStyle = p.locked ? "#9a9aaa" : "#ffd36b"; g.fillText(p.locked ? "???" : p.name, sx, sy - hgt - 4); g.textAlign = "left"; }
    });
    // l'aeronave (fissa al centro), con l'ombra sul mare
    const bob = Math.sin(S.t / 14) * 1.5, tilt = S.turn * 0.18;
    g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(160, 178, 22 - S.speed * 2, 5, 0, 0, 7); g.fill();
    g.save(); g.translate(160, 148 + bob); g.rotate(tilt);
    g.fillStyle = "#8a5a3a"; g.beginPath(); g.moveTo(-26, 4); g.lineTo(26, 4); g.lineTo(18, 14); g.lineTo(-18, 14); g.closePath(); g.fill(); g.fillStyle = "#c9a227"; g.fillRect(-24, 3, 48, 2);
    g.fillStyle = "#9aa5b1"; g.beginPath(); g.ellipse(0, -10, 30, 11, 0, 0, 7); g.fill(); g.fillStyle = "#c9d1d8"; g.beginPath(); g.ellipse(-4, -14, 22, 5, 0, 0, 7); g.fill();
    g.strokeStyle = "#5a3a2a"; g.lineWidth = 1; [-14, 0, 14].forEach((x) => { g.beginPath(); g.moveTo(x, -1); g.lineTo(x, 4); g.stroke(); });
    const pr = S.t * (0.3 + S.speed * 0.4); g.fillStyle = "#e8e0d0"; g.fillRect(30, -12 + Math.sin(pr) * 6, 3, 4); g.fillRect(30, -12 - Math.sin(pr) * 6, 3, 4); g.fillRect(-34, -12 + Math.cos(pr) * 6, 3, 4);
    g.fillStyle = "#c0392b"; g.beginPath(); g.moveTo(-30, -10); g.lineTo(-40, -18); g.lineTo(-40, -2); g.fill();
    g.restore();
    // bussola e minimappa
    g.drawImage(TEXC, 0, 0, TEX, TEX, W - 60, 4, 56, 56); g.strokeStyle = "#c9a227"; g.strokeRect(W - 60.5, 3.5, 57, 57);
    const mx = W - 60 + (cam.x % TEX + TEX) % TEX / TEX * 56, my = 4 + (cam.y % TEX + TEX) % TEX / TEX * 56; g.fillStyle = "#ff3a3a"; g.beginPath(); g.moveTo(mx + Math.cos(cam.a) * 5, my + Math.sin(cam.a) * 5); g.lineTo(mx + Math.cos(cam.a + 2.5) * 3, my + Math.sin(cam.a + 2.5) * 3); g.lineTo(mx + Math.cos(cam.a - 2.5) * 3, my + Math.sin(cam.a - 2.5) * 3); g.fill();
    if (S.near) { g.fillStyle = "rgba(10,20,64,.85)"; g.fillRect(8, 6, 150, 18); g.strokeStyle = "#e8e0d0"; g.strokeRect(8.5, 6.5, 149, 17); g.fillStyle = "#ffd36b"; g.font = "bold 9px Georgia, serif"; g.fillText(`Sotto di te: ${S.near.name}`, 14, 18); }
    S.landBtn.classList.toggle("ok", !!S.near); if (S.near) S.landBtn.textContent = `⬇ Atterra a ${S.near.name}`;
  }
  function hexA(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
  function step() {
    const k = S.keys, c = S.cam;
    S.turn = (k.l ? -1 : 0) + (k.r ? 1 : 0); c.a += S.turn * 0.035;
    if (k.u) S.speed = Math.min(2.6, S.speed + 0.06); else if (k.d) S.speed = Math.max(0, S.speed - 0.1); else S.speed = Math.max(0.6, S.speed - 0.01);
    c.x += Math.cos(c.a) * S.speed; c.y += Math.sin(c.a) * S.speed; S.t++;
  }
  function loop() { if (!S) return; step(); render(); S.raf = requestAnimationFrame(loop); }
  function close(cb) { const s = S; S = null; cancelAnimationFrame(s.raf); window.removeEventListener("keydown", s.kd, true); window.removeEventListener("keyup", s.ku, true); s.el.remove(); const pos = { x: s.cam.x, y: s.cam.y, a: s.cam.a }; try { cb(pos); } catch (e) { console.error(e); } }
  function start(o) {
    if (S) return false;
    css(); const key = (o.places || []).map((p) => `${p.x},${p.y},${p.r || 46},${p.col}`).join("|"); if (!TEXD || key !== TEXK) { buildTexture(o.places || []); TEXK = key; }
    const el = document.createElement("div"); el.id = "crM7";
    el.innerHTML = `<div class="top"><span>✈ ${o.title || "Rondine Grigia"}</span><span style="color:#ffd36b">Mappa del mondo</span></div><canvas width="${W}" height="${H}"></canvas><div class="pad"><button type="button" data-k="l">◀</button><button type="button" data-k="u">▲</button><button type="button" data-k="r">▶</button><button type="button" class="land">⬇ Atterra</button><button type="button" data-k="d" style="grid-column:2">▼</button><button type="button" class="exit">Atterra dove eri partito</button></div>`;
    document.body.appendChild(el);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d"), img = g.createImageData(W, H);
    S = { o, el, g, img, buf: new Uint32Array(img.data.buffer), cam: Object.assign({ x: 100, y: 100, a: 0 }, o.at || {}), speed: 0.8, turn: 0, t: 0, keys: {}, near: null, landBtn: el.querySelector(".land") };
    el.querySelectorAll("[data-k]").forEach((b) => { const k = b.dataset.k, on = (e) => { e.preventDefault(); S.keys[k] = true; b.classList.add("on"); try { b.setPointerCapture(e.pointerId); } catch (er) {} }, off = () => { if (S) S.keys[k] = false; b.classList.remove("on"); }; b.addEventListener("pointerdown", on); ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => b.addEventListener(ev, off)); });
    // trascinare sul cielo/terreno: sinistra-destra vira, tenere premuto avanza
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; S.keys.u = true; S.keys.l = x < 0.4; S.keys.r = x > 0.6; try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
    cv.addEventListener("pointermove", (e) => { if (!S || !S.keys.u) return; const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; S.keys.l = x < 0.4; S.keys.r = x > 0.6; });
    ["pointerup", "pointercancel"].forEach((ev) => cv.addEventListener(ev, () => { if (S) { S.keys.u = S.keys.l = S.keys.r = false; } }));
    S.landBtn.onclick = () => { if (S && S.near) { const id = S.near.id; close((pos) => o.onLand(id, pos)); } };
    el.querySelector(".exit").onclick = () => close((pos) => o.onExit(pos));
    const map = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d" };
    S.kd = (e) => { if (!S) return; if (map[e.key]) { S.keys[map[e.key]] = true; e.preventDefault(); e.stopPropagation(); } else if ((e.key === "Enter" || e.key === " ") && S.near) { e.preventDefault(); S.landBtn.click(); } };
    S.ku = (e) => { if (S && map[e.key]) { S.keys[map[e.key]] = false; e.stopPropagation(); } };
    window.addEventListener("keydown", S.kd, true); window.addEventListener("keyup", S.ku, true);
    loop(); return true;
  }
  window.__crMode7 = { start, get state() { return S; }, rebuild: (places) => buildTexture(places), _land: () => S && S.landBtn.click() };
})();
