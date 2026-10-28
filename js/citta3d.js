// js/citta3d.js - motore «CITTÀ APERTA 3D» (Three.js): una città a 6 quartieri da girare in terza persona, ciclo giorno/notte,
// PNG con orari, missioni a catena (consegne, indagini) e dialoghi. Una saga lo usa con __citta3d.create(cfg) e ottiene { open, menuEntry, info, endings, _dbg }.
//
//  cfg = { id, key, title, icon, menuSub, chapters: 4,
//          districts: [{ id, name, icon, gx, gz, pal: { ground, road, walk, bld: [colori], tree, accent }, dark?: true, landmark: "porto|mercato|stazione|collina|stadio|sotterranei" }],   // griglia 3x2 di quartieri da 90x90
//          npcs: [{ id, name, emoji, look: { shirt, hair, skin }, sched: [{ h: [da, a], d: "id quartiere", at: [x, z] (0..90 locali) }] }],
//          pois: [{ id, d, at, r, label, mark }],
//          start: { d, at, hour }, hourPerSec: 1/20,
//          story(K) -> { talk: { npcId(K) }, poi: { poiId(K) }, goal(K) -> { text, target: { npc } | { d, at } | null }, intro?(K) },
//          endings: { id: [titolo, descrizione, indizio] } }
//  K: say(lines, cb) · ask(prompt, opts) · flag(k) / setFlag(k, v) · step · inv · hour() · skipTo(h, cb) · coins · done(ending) · tp(d, x, z)
(function () {
  "use strict";
  if (window.__citta3d) return;
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const hs = (a, b, c) => { const s = Math.sin(a * 127.1 + b * 311.7 + (c || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const DS = 90, CELL = 30, RW = 8;
  const IS_SW_GL = (() => {
    try {
      const c = document.createElement("canvas"), gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info"), gpu = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || "");
      const lose = gl.getExtension("WEBGL_lose_context"); if (lose) lose.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch (e) { return true; }
  })();

  function css() {
    if (document.getElementById("c3dCss")) return;
    const st = document.createElement("style"); st.id = "c3dCss";
    st.textContent = `.c3dOv{position:fixed;inset:0;z-index:340;background:#0b1226;color:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none}
.c3dOv *{box-sizing:border-box}.c3dOv canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.c3dTop{position:absolute;left:0;right:0;top:0;display:flex;gap:6px;align-items:center;padding:8px 10px;background:linear-gradient(#0b1226cc,#0b122600);pointer-events:none}
.c3dTop .clk{font:900 15px system-ui;background:#0f172acc;border:1px solid #475569;border-radius:10px;padding:5px 9px;white-space:nowrap}
.c3dTop .dst{font:800 12px system-ui;color:#fde68a;background:#0f172acc;border:1px solid #475569;border-radius:10px;padding:5px 9px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.c3dTop .sp{flex:1}.c3dBtn{pointer-events:auto;min-width:42px;min-height:42px;border-radius:10px;border:1px solid #64748b;background:#1e293bdd;color:#f8fafc;font:800 14px system-ui;cursor:pointer;touch-action:manipulation}
.c3dGoal{position:absolute;left:10px;right:10px;top:54px;font:700 12.5px/1.35 system-ui;color:#e2e8f0;background:#0f172acc;border:1px solid #334155;border-radius:10px;padding:6px 10px;pointer-events:none;display:flex;gap:8px;align-items:center}
.c3dGoal .ar{display:inline-block;font-size:18px;transition:transform .15s;flex-shrink:0}
.c3dStick{position:absolute;left:18px;bottom:22px;width:132px;height:132px;border-radius:50%;background:#0f172a88;border:2px solid #64748baa;touch-action:none}
.c3dKnob{position:absolute;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;background:#e2e8f0cc;border:2px solid #fff}
.c3dAct{position:absolute;right:18px;bottom:30px;min-width:116px;min-height:116px;border-radius:50%;border:3px solid #fde68a;background:#92400ecc;color:#fff;font:900 15px/1.15 system-ui;padding:6px;touch-action:manipulation;cursor:pointer}
.c3dAct.off{border-color:#64748b;background:#334155aa;color:#94a3b8}
.c3dBox{position:absolute;left:8px;right:8px;bottom:8px;background:#0f172af2;border:2px solid #fbbf24;border-radius:14px;padding:12px 14px;z-index:5;max-height:62%;overflow:auto}
.c3dBox .who{font:900 13px system-ui;color:#fde68a;margin-bottom:4px}.c3dBox .tx{font:600 15px/1.45 system-ui;color:#f1f5f9}.c3dBox .tx b{color:#fde68a}
.c3dBox button{display:block;width:100%;margin-top:8px;min-height:46px;border-radius:10px;border:1.5px solid #fbbf24;background:#1e293b;color:#fff;font:800 14px/1.25 system-ui;padding:8px 10px;text-align:left;cursor:pointer;touch-action:manipulation}
.c3dBox button.hot{background:#92400e}.c3dBox button small{display:block;font:600 11.5px system-ui;color:#cbd5e1}
.c3dMenu{position:absolute;inset:0;background:#0b1226ee;z-index:6;padding:56px 14px 14px;overflow:auto}.c3dMenu h3{margin:0 0 8px;color:#fde68a;font:900 18px system-ui}.c3dMenu p{font:600 13.5px/1.5 system-ui;color:#cbd5e1;margin:6px 0}
.c3dMenu button{display:block;width:100%;margin:8px 0;min-height:46px;border-radius:10px;border:1.5px solid #64748b;background:#1e293b;color:#fff;font:800 14px system-ui;cursor:pointer}
.c3dFade{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .5s;z-index:7}.c3dFade.on{opacity:1}
.c3dToast{position:absolute;left:50%;top:96px;transform:translateX(-50%);background:#0f172af2;border:1.5px solid #fbbf24;border-radius:12px;padding:8px 14px;font:800 13px system-ui;z-index:4;pointer-events:none;text-align:center;max-width:90%}`;
    document.head.appendChild(st);
  }

  function create(cfg) {
    const KEY = cfg.key, TITLE = cfg.title, ICON = cfg.icon || "🏙️";
    const DIST = {}; (cfg.districts || []).forEach((d) => { DIST[d.id] = d; });
    const NPCS = {}; (cfg.npcs || []).forEach((n) => { NPCS[n.id] = n; });
    const POIS = {}; (cfg.pois || []).forEach((p) => { POIS[p.id] = p; });
    let OV = null, BACK = null, G = null, M = null, STORY = null, keyCleanup = null, resizeCleanup = null;
    const DBG = /[?&]debug\b/.test(location.search || "");

    // ------------------------------------------------------------ salvataggio
    const def = () => ({ v: 1, hour: (cfg.start && cfg.start.hour) || 9, d: (cfg.start && cfg.start.d) || cfg.districts[0].id, at: ((cfg.start && cfg.start.at) || [45, 45]).slice(), yaw: 0.6, ch: 1, step: {}, done: {}, ends: [], flags: {}, inv: [], coins: 0, q: IS_SW_GL ? "low" : "hi" });
    const load = () => Object.assign(def(), safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {}) || {});
    const mem = () => (M || (M = load()));
    const save = () => { if (M) safe(() => localStorage.setItem(KEY, JSON.stringify(M)), 0); };
    const flag = (k, d) => (mem().flags[k] == null ? d : mem().flags[k]);
    const setFlag = (k, v) => { mem().flags[k] = v; save(); };

    // ------------------------------------------------------------ mondo: coordinate globali
    const origin = (d) => ({ x: d.gx * DS, z: d.gz * DS });
    const toWorld = (did, at) => { const d = DIST[did] || cfg.districts[0], o = origin(d); return { x: o.x + at[0], z: o.z + at[1] }; };
    const districtAt = (x, z) => cfg.districts.find((d) => x >= d.gx * DS && x < (d.gx + 1) * DS && z >= d.gz * DS && z < (d.gz + 1) * DS) || null;

    // ------------------------------------------------------------ DIALOGHI / K
    let dlgCb = null, queue = [];
    function boxEl() { let b = OV.querySelector(".c3dBox"); if (!b) { b = document.createElement("div"); b.className = "c3dBox"; OV.appendChild(b); } return b; }
    function closeBox() { const b = OV && OV.querySelector(".c3dBox"); if (b) b.remove(); }
    function whoName(w) { if (!w || w === "voce") return ""; const n = NPCS[w]; return n ? `${n.emoji || ""} ${n.name}` : w; }
    function say(lines, cb) {
      if (!G) return; queue = (lines || []).slice(); dlgCb = cb || null; G.talking = true; next();
    }
    function next() {
      if (!queue.length) { closeBox(); G.talking = false; const cb = dlgCb; dlgCb = null; if (cb) cb(); return; }
      const [w, t] = queue.shift(), b = boxEl();
      b.innerHTML = `${whoName(w) ? `<div class="who">${esc(whoName(w))}</div>` : ""}<div class="tx">${String(t).replace(/^\[[^\]]*\]\s*/, "")}</div><button type="button" data-nx="1">Avanti ▸</button>`;
      b.querySelector("[data-nx]").onclick = next;
    }
    function ask(prompt, opts) {
      if (!G) return; G.talking = true; const b = boxEl();
      b.innerHTML = `<div class="tx">${prompt}</div>` + opts.map((o, i) => `<button type="button" data-o="${i}" class="${o.cls || ""}"${o.disabled ? " disabled style='opacity:.5'" : ""}>${esc(o.label)}${o.sub ? `<small>${esc(o.sub)}</small>` : ""}</button>`).join("");
      b.querySelectorAll("[data-o]").forEach((bt) => { bt.onclick = () => { const o = opts[+bt.dataset.o]; closeBox(); G.talking = false; if (o.fn) o.fn(); }; });
    }
    function toast(t, ms) {
      if (!OV) return; const e = document.createElement("div"); e.className = "c3dToast"; e.innerHTML = t; OV.appendChild(e); setTimeout(() => e.remove(), ms || 2600);
    }
    const hour = () => G ? G.hour : mem().hour;
    const K = {
      say, ask, toast, flag, setFlag, hour,
      step: (n) => mem().step[n || mem().ch] || 0, setStep: (n, v) => { mem().step[n] = v; save(); refreshGoal(); },
      ch: () => mem().ch,
      inv: { has: (i) => mem().inv.includes(i), give: (i) => { if (!mem().inv.includes(i)) { mem().inv.push(i); save(); } }, take: (i) => { mem().inv = mem().inv.filter((x) => x !== i); save(); } },
      coins: (n) => { mem().coins += n | 0; save(); toast(`🪙 ${n > 0 ? "+" : ""}${n}`); },
      tp(did, x, z) { if (!G) return; const w = toWorld(did, [x, z]); G.p.x = w.x; G.p.z = w.z; },
      skipTo(h, cb) {
        if (!G) return; const f = OV.querySelector(".c3dFade"); f.classList.add("on");
        setTimeout(() => { let d = h - G.hour; if (d <= 0) d += 24; G.hour = h % 24; G.day += (G.hour < h - d + 0.01 ? 1 : 0); updateNpcsInstant(); applyLight(); f.classList.remove("on"); if (cb) cb(); }, 520);
      },
      finishChapter(n, ending) { const m = mem(); m.done[n] = String(ending || "ok"); if (m.ch <= n && n < (cfg.chapters || 1)) m.ch = n + 1; save(); },
      end(id) { const m = mem(); if (!m.ends.includes(id)) m.ends.push(id); save(); },
      exit() { close(); const b = BACK; if (typeof b === "function") b(); },
      refresh: () => refreshGoal(),
      mem
    };

    // ------------------------------------------------------------ costruzione scena
    function mkCanvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
    function groundTex(THREE, d) {
      const P = d.pal, c = mkCanvas(512, 512), g = c.getContext("2d"), px = 512 / DS;
      g.fillStyle = P.ground; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${hs(i, 1) > 0.5 ? "255,255,255" : "0,0,0"},${0.025 + hs(i, 2) * 0.04})`; g.fillRect(hs(i, 3) * 512, hs(i, 4) * 512, 2 + hs(i, 5) * 8, 2 + hs(i, 6) * 8); }
      for (let a = 0; a <= 3; a++) {
        const p = a * CELL * px;
        g.fillStyle = P.walk; g.fillRect(p - (RW / 2 + 1.6) * px, 0, (RW + 3.2) * px, 512); g.fillRect(0, p - (RW / 2 + 1.6) * px, 512, (RW + 3.2) * px);
      }
      for (let a = 0; a <= 3; a++) {
        const p = a * CELL * px; g.fillStyle = P.road; g.fillRect(p - RW / 2 * px, 0, RW * px, 512); g.fillRect(0, p - RW / 2 * px, 512, RW * px);
      }
      g.fillStyle = "rgba(255,240,180,.55)";
      for (let a = 0; a <= 3; a++) { const p = a * CELL * px; for (let t = 0; t < 512; t += 22) { g.fillRect(p - 1, t, 2, 11); g.fillRect(t, p - 1, 11, 2); } }
      g.fillStyle = "rgba(255,255,255,.5)";
      for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) { const x = a * CELL * px, z = b * CELL * px; for (let k = -3; k <= 3; k++) { g.fillRect(x - RW / 2 * px - 6, z + k * 6 - 1, 5, 3); g.fillRect(x + RW / 2 * px + 1, z + k * 6 - 1, 5, 3); } }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
    }
    function winTex(THREE, lit) {
      const c = mkCanvas(128, 128), g = c.getContext("2d");
      g.fillStyle = lit ? "#000" : "#d9cdb4"; g.fillRect(0, 0, 128, 128);
      if (!lit) { g.fillStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < 40; i++) g.fillRect(hs(i, 9) * 128, hs(i, 8) * 128, 3, 3); }
      for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) {
        const on = hs(x, y, 5) > 0.45;
        if (lit) { if (!on) continue; g.fillStyle = "#fff"; } else g.fillStyle = on ? "#7aa0c4" : "#3d5568";
        g.fillRect(x * 32 + 8, y * 32 + 7, 16, 18);
      }
      const t = new THREE.CanvasTexture(c); t.colorSpace = lit ? THREE.NoColorSpace : THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 2; return t;
    }
    const BCLASS = [[10, 9, 10], [14, 15, 10], [10, 24, 12], [16, 11, 16], [12, 36, 12]];

    function build(THREE, scene) {
      const W = { solids: [], mats: [], lamps: [], emis: [], water: [], props: [] };
      const addSolid = (x0, z0, x1, z1) => W.solids.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]);
      const box = (x, y, z, w, h, d, col, o) => {
        o = o || {}; const mat = new THREE.MeshStandardMaterial({ color: col, roughness: o.rough == null ? 0.8 : o.rough, metalness: o.metal || 0, emissive: o.em || 0x000000, emissiveIntensity: 0 });
        if (o.em != null) W.emis.push({ mat, base: o.emi == null ? 1.2 : o.emi, night: true });
        W.mats.push(mat); const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z); m.castShadow = !G.low; m.receiveShadow = !G.low; scene.add(m);
        if (o.solid !== false) addSolid(x - w / 2, z - d / 2, x + w / 2, z + d / 2); return m;
      };
      // terreno e strade per quartiere
      cfg.districts.forEach((d) => {
        const o = origin(d), tex = groundTex(THREE, d), m = new THREE.Mesh(new THREE.PlaneGeometry(DS, DS), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }));
        m.rotation.x = -Math.PI / 2; m.position.set(o.x + DS / 2, 0, o.z + DS / 2); m.receiveShadow = !G.low; scene.add(m); W.mats.push(m.material);
      });
      // palazzi a istanza (classi di forma, tinta per quartiere)
      const per = BCLASS.map(() => []);
      const trees = [], lamps = [];
      cfg.districts.forEach((d, di) => {
        const o = origin(d), P = d.pal;
        for (let bx = 0; bx < 3; bx++) for (let bz = 0; bz < 3; bz++) {
          const cx = o.x + bx * CELL + CELL / 2, cz = o.z + bz * CELL + CELL / 2, r = hs(d.gx * 3 + bx, d.gz * 3 + bz, 7), center = bx === 1 && bz === 1;
          if (center) { landmark(THREE, scene, d, cx, cz, box, addSolid, W); continue; }
          if (d.landmark === "porto" && bz === 0) { // mare: lungo il bordo del porto
            const wm = new THREE.Mesh(new THREE.PlaneGeometry(CELL - RW, CELL - RW), new THREE.MeshStandardMaterial({ color: 0x1d5f8a, roughness: 0.25, metalness: 0.2, emissive: 0x0a2a4a, emissiveIntensity: 0.2 }));
            wm.rotation.x = -Math.PI / 2; wm.position.set(cx, 0.06, cz); scene.add(wm); W.water.push(wm); addSolid(cx - (CELL - RW) / 2 + 1.2, cz - (CELL - RW) / 2 + 1.2, cx + (CELL - RW) / 2 - 1.2, cz + (CELL - RW) / 2 - 1.2); continue;
          }
          if (r < 0.62) {
            const ci = Math.floor(hs(bx, bz, d.gx + d.gz * 5) * (d.landmark === "collina" ? 3 : BCLASS.length)), [w, h, dd] = BCLASS[ci], rot = hs(bx, bz, 3) > 0.5;
            per[ci].push({ x: cx + (hs(bx, bz, 11) - 0.5) * 3, z: cz + (hs(bx, bz, 12) - 0.5) * 3, rot, col: P.bld[Math.floor(hs(bx, bz, 13) * P.bld.length)] });
            const ww = rot ? dd : w, dz = rot ? w : dd; const last = per[ci][per[ci].length - 1]; addSolid(last.x - ww / 2, last.z - dz / 2, last.x + ww / 2, last.z + dz / 2);
          } else if (r < 0.82) { // piccolo parco
            for (let i = 0; i < 6; i++) trees.push({ x: cx + (hs(bx + i, bz, 21) - 0.5) * 16, z: cz + (hs(bx, bz + i, 22) - 0.5) * 16, s: 0.8 + hs(i, bx, bz) * 0.7, col: P.tree });
            box(cx, 0, cz, 5, 0.4, 5, 0x6b7a8f, { solid: false });
          } else { // piazzetta con panchine
            box(cx - 4, 0, cz, 5, 0.9, 1.2, 0x7a5a3a); box(cx + 4, 0, cz, 5, 0.9, 1.2, 0x7a5a3a);
          }
          [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz], i) => { if (hs(bx, bz, 30 + i) > 0.4) lamps.push({ x: cx + sx * (CELL / 2 - RW / 2 - 0.4), z: cz + sz * (CELL / 2 - RW / 2 - 0.4) }); });
        }
      });
      BCLASS.forEach(([w, h, dd], ci) => {
        const arr = per[ci]; if (!arr.length) return;
        const side = new THREE.MeshStandardMaterial({ color: 0xffffff, map: winTex(THREE, false), emissive: 0xffd9a0, emissiveMap: winTex(THREE, true), emissiveIntensity: 0, roughness: 0.85 });
        [side.map, side.emissiveMap].forEach((t) => t.repeat.set(w / 12, h / 12));
        const roof = new THREE.MeshStandardMaterial({ color: 0x6b6f78, roughness: 0.95 });
        W.mats.push(side, roof); W.emis.push({ mat: side, base: 1.25, night: true });
        const im = new THREE.InstancedMesh(new THREE.BoxGeometry(w, h, dd), [side, side, roof, roof, side, side], arr.length);
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), c = new THREE.Color();
        arr.forEach((b, i) => { q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), b.rot ? Math.PI / 2 : 0); m4.compose(new THREE.Vector3(b.x, h / 2, b.z), q, s); im.setMatrixAt(i, m4); c.set(b.col); im.setColorAt(i, c); });
        im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.castShadow = !G.low; im.receiveShadow = !G.low; scene.add(im);
      });
      // alberi
      if (trees.length) {
        const tg = new THREE.ConeGeometry(2.2, 5.5, 6), tm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), trg = new THREE.CylinderGeometry(0.35, 0.45, 2, 5), trm = new THREE.MeshStandardMaterial({ color: 0x5a3a20 });
        const ti = new THREE.InstancedMesh(tg, tm, trees.length), tri = new THREE.InstancedMesh(trg, trm, trees.length), m4 = new THREE.Matrix4(), c = new THREE.Color(); W.mats.push(tm, trm);
        trees.forEach((t, i) => { m4.compose(new THREE.Vector3(t.x, 4.4 * t.s, t.z), new THREE.Quaternion(), new THREE.Vector3(t.s, t.s, t.s)); ti.setMatrixAt(i, m4); c.set(t.col); ti.setColorAt(i, c); m4.compose(new THREE.Vector3(t.x, 1 * t.s, t.z), new THREE.Quaternion(), new THREE.Vector3(t.s, t.s, t.s)); tri.setMatrixAt(i, m4); });
        scene.add(ti); scene.add(tri); ti.castShadow = !G.low;
      }
      // lampioni
      if (lamps.length) {
        const pole = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.16, 5.2, 5), new THREE.MeshStandardMaterial({ color: 0x2a2f3a }), lamps.length);
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0x9aa0aa, fog: true }), bulb = new THREE.InstancedMesh(new THREE.SphereGeometry(0.5, 8, 6), bulbMat, lamps.length), m4 = new THREE.Matrix4();
        lamps.forEach((l, i) => { m4.setPosition(l.x, 2.6, l.z); pole.setMatrixAt(i, m4); m4.setPosition(l.x, 5.3, l.z); bulb.setMatrixAt(i, m4); });
        scene.add(pole); scene.add(bulb); W.bulbMat = bulbMat; W.lampPts = lamps;
      }
      // confini del mondo: muro invisibile
      const maxX = 3 * DS, maxZ = 2 * DS; addSolid(-10, -10, maxX + 10, 0); addSolid(-10, maxZ, maxX + 10, maxZ + 10); addSolid(-10, 0, 0, maxZ); addSolid(maxX, 0, maxX + 10, maxZ);
      return W;
    }
    function landmark(THREE, scene, d, cx, cz, box, addSolid, W) {
      const L = d.landmark, P = d.pal, A = P.accent || 0xfbbf24;
      if (L === "mercato") {
        for (let i = 0; i < 8; i++) { const a = i % 4, r = Math.floor(i / 4), x = cx - 9 + a * 6, z = cz - 5 + r * 10, col = [0xdc2626, 0x16a34a, 0xf59e0b, 0x2563eb][(a + r) % 4]; box(x, 0, z, 4, 1.1, 2.2, 0x8a6a42); box(x, 2.4, z, 4.4, 0.5, 3.2, col, { solid: false }); box(x - 1.8, 0, z - 1, 0.2, 2.4, 0.2, 0x5a3a20, { solid: false }); }
        box(cx, 0, cz, 3, 0.8, 3, 0x9ca3af); box(cx, 0.8, cz, 1, 2, 1, 0x9ca3af, { solid: false }); // fontana
      } else if (L === "stazione") {
        box(cx, 0, cz - 6, 26, 0.9, 6, 0x9ca3af, { solid: false }); box(cx, 0, cz + 2, 26, 0.5, 6, 0x374151, { solid: false });
        [0, 1, 2].forEach((i) => box(cx - 9 + i * 9, 0.6, cz + 2, 8.4, 3.4, 3.2, [0xdc2626, 0xf59e0b, 0x16a34a][i], { solid: false }));
        box(cx + 13, 0, cz - 8, 4, 18, 4, 0xe7e5e4); box(cx + 13, 18, cz - 8, 4.8, 0.6, 4.8, 0x7f1d1d, { solid: false });
        const clock = new THREE.Mesh(new THREE.CircleGeometry(1.5, 16), new THREE.MeshStandardMaterial({ color: 0xfff7d6, emissive: 0xfff7d6, emissiveIntensity: 0.5 })); clock.position.set(cx + 13, 16, cz - 5.9); scene.add(clock);
        box(cx - 11, 0, cz - 6, 0.5, 3.4, 0.5, 0x374151, { solid: false }); box(cx + 4, 0, cz - 6, 0.5, 3.4, 0.5, 0x374151, { solid: false }); box(cx - 3.5, 3.4, cz - 6, 16, 0.4, 5, 0x6b7280, { solid: false });
      } else if (L === "collina") {
        box(cx, 0, cz, 18, 0.8, 14, 0xd6d3d1, { solid: false }); box(cx, 0.8, cz - 1, 16, 7, 8, 0xf5f0e6); box(cx, 7.8, cz - 1, 17, 1, 9, 0xa8a29e, { solid: false });
        for (let i = 0; i < 5; i++) box(cx - 6 + i * 3, 0.8, cz + 4, 1, 6.4, 1, 0xf5f5f4);
        for (let i = 0; i < 4; i++) box(cx, i * 0.4, cz + 8 + i * 1.6, 12, 0.4, 1.6, 0xd6d3d1, { solid: false });
      } else if (L === "stadio") {
        const n = 20, R = 11; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; if (i === 0 || i === 1) continue; const x = cx + Math.cos(a) * R, z = cz + Math.sin(a) * R * 0.8; const b = box(x, 0, z, 6.2, 5 + hs(i, 4) * 2, 3.2, [0x7c6a5a, 0x6e5e4e][i % 2]); b.rotation.y = -a; }
        const f = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), new THREE.MeshStandardMaterial({ color: 0x2f6a3a, roughness: 1 })); f.rotation.x = -Math.PI / 2; f.position.set(cx, 0.08, cz); scene.add(f);
        [[-12, -10], [12, -10], [-12, 10], [12, 10]].forEach(([dx, dz]) => { box(cx + dx, 0, cz + dz, 0.5, 14, 0.5, 0x4b5563); box(cx + dx, 14, cz + dz, 2.4, 0.9, 1.6, 0xfff7d6, { em: 0xfff1b0, emi: 1.6, solid: false }); });
      } else if (L === "sotterranei") {
        for (let i = 0; i < 3; i++) { const x = cx - 8 + i * 8; box(x - 2, 0, cz - 6, 1, 6, 1.4, 0x3f4b5b); box(x + 2, 0, cz - 6, 1, 6, 1.4, 0x3f4b5b); box(x, 5.6, cz - 6, 5, 1, 1.6, 0x3f4b5b, { solid: false }); box(x, 5.2, cz - 6, 4, 0.3, 0.4, [0x22d3ee, 0xf472b6, 0xa3e635][i], { em: [0x22d3ee, 0xf472b6, 0xa3e635][i], emi: 2.2, solid: false }); }
        box(cx, 3.2, cz + 4, 28, 0.8, 0.8, 0x5b6676, { solid: false }); box(cx, 0, cz + 4, 22, 3.2, 1.2, 0x3f4b5b);
      } else if (L === "porto") {
        const cols = [0xdc2626, 0x2563eb, 0xf59e0b, 0x16a34a, 0x7c3aed];
        for (let i = 0; i < 9; i++) box(cx - 8 + (i % 3) * 8, 0, cz + 2 + Math.floor(i / 3) * 4, 6.4, 2.6 * (1 + (i % 2)), 2.6, cols[(i * 2) % 5]);
        box(cx + 10, 0, cz - 8, 1, 22, 1, 0xf59e0b); box(cx + 3, 20, cz - 8, 16, 1, 1, 0xf59e0b, { solid: false });
      }
    }

    // ------------------------------------------------------------ figure
    function labelSprite(THREE, text, bg) {
      const c = mkCanvas(256, 64), g = c.getContext("2d"); g.font = "900 26px system-ui"; g.textAlign = "center";
      const w = Math.min(244, g.measureText(text).width + 24); g.fillStyle = bg || "rgba(15,23,42,.85)"; g.fillRect(128 - w / 2, 8, w, 42); g.fillStyle = "#fde68a"; g.fillText(text, 128, 38);
      const t = new THREE.CanvasTexture(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); s.scale.set(3.6, 0.9, 1); return s;
    }
    function figure(THREE, look) {
      const grp = new THREE.Group(), mk = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 });
      const skin = mk(look.skin || 0xe0b890), shirt = mk(look.shirt || 0x2563eb), hair = mk(look.hair || 0x3a2a1a), legs = mk(look.pants || 0x334155);
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.05, 0.5), shirt); torso.position.y = 1.55; grp.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), skin); head.position.y = 2.38; grp.add(head);
      const hr = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 0.66), hair); hr.position.y = 2.6; grp.add(hr);
      const mkLeg = (x) => { const l = new THREE.Group(); l.position.set(x, 1.05, 0); const m = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.05, 0.38), legs); m.position.y = -0.5; l.add(m); grp.add(l); return l; };
      const mkArm = (x) => { const a = new THREE.Group(); a.position.set(x, 2, 0); const m = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.95, 0.3), shirt); m.position.y = -0.42; a.add(m); grp.add(a); return a; };
      grp.userData = { legL: mkLeg(-0.24), legR: mkLeg(0.24), armL: mkArm(-0.6), armR: mkArm(0.6), torso };
      const sh = new THREE.Mesh(new THREE.CircleGeometry(0.7, 12), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = 0.05; grp.add(sh);
      return grp;
    }
    function animFig(f, speed, t) { const u = f.userData, s = Math.sin(t * 9) * clamp(speed / 6, 0, 1) * 0.9; u.legL.rotation.x = s; u.legR.rotation.x = -s; u.armL.rotation.x = -s * 0.8; u.armR.rotation.x = s * 0.8; }
    function markSprite(THREE) {
      const c = mkCanvas(64, 64), g = c.getContext("2d"); g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(32, 32, 26, 0, 7); g.fill(); g.fillStyle = "#7c2d12"; g.font = "900 40px system-ui"; g.textAlign = "center"; g.fillText("!", 32, 46);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); s.scale.set(1.2, 1.2, 1); return s;
    }

    // ------------------------------------------------------------ orari PNG
    function slotFor(n, h) { return (n.sched || []).find((x) => (x.h[0] <= x.h[1] ? h >= x.h[0] && h < x.h[1] : h >= x.h[0] || h < x.h[1])) || null; }
    function npcTarget(n, h) { const s = slotFor(n, h); if (!s || s.away) return null; const w = toWorld(s.d, s.at); return { x: w.x, z: w.z, d: s.d, here: s.here }; }
    function updateNpcsInstant() { if (!G) return; G.npcs.forEach((o) => { const t = npcTarget(o.cfg, G.hour); if (t) { o.x = t.x; o.z = t.z; o.mesh.position.set(o.x, 0, o.z); } }); }

    // ------------------------------------------------------------ luce e giorno/notte
    function dayFactor(h) { return clamp(Math.sin(((h - 5) / 14) * Math.PI) * 1.3 + 0.12, 0, 1); }
    const C3 = (THREE, a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), clamp(t, 0, 1));
    function applyLight() {
      if (!G) return; const THREE = G.THREE, h = G.hour, d = dayFactor(h), dist = districtAt(G.p.x, G.p.z), dark = dist && dist.dark ? 1 : 0, dd = dark ? 0.35 + d * 0.15 : d;
      const dusk = clamp(1 - Math.abs(d - 0.35) / 0.35, 0, 1) * (dark ? 0 : 1);
      let sky = C3(THREE, 0x070d1f, 0x8ec5ff, dd); sky = sky.lerp(new THREE.Color(0xff9a6a), dusk * 0.55); if (dark) sky = new THREE.Color(0x0a1620);
      G.scene.background = sky; G.scene.fog.color.copy(sky); G.scene.fog.density = (dark ? 0.02 : 0.006) + (1 - dd) * 0.004;
      G.sun.intensity = 0.15 + 1.15 * dd; G.sun.color.copy(C3(THREE, 0xffb070, 0xfff4e0, dd * 1.2)); G.hemi.intensity = 0.25 + 0.65 * dd;
      const a = ((h - 6) / 12) * Math.PI; G.sun.position.set(G.p.x + Math.cos(a) * 60, 40 + Math.sin(a) * 40, G.p.z + 30);
      G.sun.target.position.set(G.p.x, 0, G.p.z); const night = clamp(1.0 - dd * 1.7, 0, 1);
      const nt = dark ? 1 : night; G.W.emis.forEach((e) => { e.mat.emissiveIntensity = e.base * nt; });
      if (G.W.bulbMat) G.W.bulbMat.color.set(night > 0.3 ? 0xffe9a0 : 0x8a919b);
      G.night = dark ? 1 : night;
    }

    // ------------------------------------------------------------ apertura
    function close() {
      if (keyCleanup) { keyCleanup(); keyCleanup = null; } if (resizeCleanup) { resizeCleanup(); resizeCleanup = null; }
      if (G) { G.dead = true; if (G.raf) cancelAnimationFrame(G.raf); if (G.scene) G.scene.traverse((o) => { if (o.geometry && o.geometry.dispose) o.geometry.dispose(); }); safe(() => G.renderer.dispose(), 0); G = null; }
      if (OV) { OV.remove(); OV = null; } queue = [];
    }
    function open(back) {
      css(); close(); BACK = back || BACK; M = load(); if (!window.THREE) return;
      OV = document.createElement("div"); OV.className = "c3dOv";
      OV.innerHTML = `<canvas></canvas><div class="c3dTop"><span class="clk">🕘 09:00</span><span class="dst"></span><span class="sp"></span><button class="c3dBtn" data-menu="1" type="button">☰</button></div>
<div class="c3dGoal"><span class="ar">🧭</span><span class="tx"></span></div><div class="c3dStick"><div class="c3dKnob"></div></div><button class="c3dAct off" type="button">…</button><div class="c3dFade"></div>`;
      document.body.appendChild(OV);
      const THREE = window.THREE, canvas = OV.querySelector("canvas"), low = mem().q === "low";
      let renderer; try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !IS_SW_GL && !low }); } catch (e) { OV.innerHTML = `<div style="padding:30px;text-align:center">WebGL non disponibile su questo dispositivo.<br><br><button class="c3dBtn" id="c3dX">Chiudi</button></div>`; OV.querySelector("#c3dX").onclick = () => { close(); if (BACK) BACK(); }; return; }
      renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setPixelRatio(IS_SW_GL || low ? 1 : Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.shadowMap.enabled = !IS_SW_GL && !low;
      const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x8ec5ff, 0.006);
      const cam = new THREE.PerspectiveCamera(58, 1, 0.5, 400);
      const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x4a4036, 0.8), sun = new THREE.DirectionalLight(0xfff4e0, 1.1); scene.add(hemi); scene.add(sun); scene.add(sun.target);
      if (renderer.shadowMap.enabled) { sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); const sc = sun.shadow.camera; sc.left = -40; sc.right = 40; sc.top = 40; sc.bottom = -40; sc.near = 5; sc.far = 160; sun.shadow.bias = -0.0006; }
      G = { THREE, renderer, scene, cam, hemi, sun, low, dead: false, p: { x: 0, z: 0, vx: 0, vz: 0 }, yaw: mem().yaw, hour: mem().hour, day: 1, stk: { x: 0, y: 0 }, keys: {}, npcs: [], talking: false, menu: false, t: 0, near: null, last: performance.now(), acc: 0 };
      G.W = build(THREE, scene);
      const w0 = toWorld(mem().d, mem().at); G.p.x = w0.x; G.p.z = w0.z;
      G.me = figure(THREE, cfg.hero || { shirt: 0xf59e0b, hair: 0x3a2a1a, pants: 0x334155 }); scene.add(G.me);
      (cfg.npcs || []).forEach((n) => {
        const mesh = figure(THREE, n.look || {}), lab = labelSprite(THREE, n.name); lab.position.y = 3.6; mesh.add(lab); const mk = markSprite(THREE); mk.position.y = 4.3; mesh.add(mk);
        scene.add(mesh); const t = npcTarget(n, G.hour) || { x: 0, z: 0 }; mesh.position.set(t.x, 0, t.z); G.npcs.push({ cfg: n, mesh, mk, x: t.x, z: t.z, sp: 0, face: 0 });
      });
      (cfg.pois || []).forEach((p) => { if (!p.mark) return; const w = toWorld(p.d, p.at), m = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.2, 14), new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.55 })); m.position.set(w.x, 0.12, w.z); scene.add(m); });
      G.beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 40, 10, 1, true), new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide })); G.beacon.visible = false; scene.add(G.beacon);
      STORY = cfg.story(K); applyLight(); updateNpcsInstant(); refreshGoal();
      bindInputs(); onResize(); resizeCleanup = (() => { const f = () => onResize(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); })();
      if (STORY.intro && !flag("intro_done")) { setFlag("intro_done", 1); STORY.intro(K); }
      loop();
    }
    function onResize() { if (!G) return; const w = OV.clientWidth || innerWidth, h = OV.clientHeight || innerHeight; G.renderer.setSize(w, h, false); G.cam.aspect = w / h; G.cam.updateProjectionMatrix(); }

    // ------------------------------------------------------------ input
    function bindInputs() {
      const stick = OV.querySelector(".c3dStick"), knob = OV.querySelector(".c3dKnob"), act = OV.querySelector(".c3dAct"); let pid = null;
      const mv = (e) => { const r = stick.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width * 0.36; let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy); if (d > R) { dx = dx / d * R; dy = dy / d * R; } knob.style.transform = `translate(${dx}px,${dy}px)`; G.stk.x = d < 6 ? 0 : dx / R; G.stk.y = d < 6 ? 0 : dy / R; };
      const rs = () => { pid = null; knob.style.transform = ""; if (G) { G.stk.x = 0; G.stk.y = 0; } };
      stick.addEventListener("pointerdown", (e) => { e.preventDefault(); pid = e.pointerId; safe(() => stick.setPointerCapture(e.pointerId), 0); mv(e); });
      stick.addEventListener("pointermove", (e) => { if (e.pointerId === pid) mv(e); });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach((n) => stick.addEventListener(n, rs));
      act.onclick = () => doAct();
      OV.querySelector("[data-menu]").onclick = () => openMenu();
      let dragId = null, lx = 0; const cv = OV.querySelector("canvas");
      cv.addEventListener("pointerdown", (e) => { dragId = e.pointerId; lx = e.clientX; });
      cv.addEventListener("pointermove", (e) => { if (e.pointerId === dragId && G) { G.yaw -= (e.clientX - lx) * 0.008; lx = e.clientX; } });
      ["pointerup", "pointercancel"].forEach((n) => cv.addEventListener(n, () => { dragId = null; }));
      const kd = (e) => { if (!G) return; const k = e.key.toLowerCase(); if (k === "e" || k === " " || k === "enter") { e.preventDefault(); doAct(); return; } G.keys[k] = true; };
      const ku = (e) => { if (G) G.keys[e.key.toLowerCase()] = false; };
      window.addEventListener("keydown", kd); window.addEventListener("keyup", ku); keyCleanup = () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
    }
    function openMenu() {
      if (!G || G.talking) return; G.menu = true; const m = document.createElement("div"); m.className = "c3dMenu";
      const goal = STORY.goal ? STORY.goal(K) : null;
      m.innerHTML = `<h3>${ICON} ${esc(TITLE)}</h3><p><b>Obiettivo:</b> ${esc((goal && goal.text) || "Gira la città.")}</p><p>Capitolo ${mem().ch}/${cfg.chapters || 1} · 🪙 ${mem().coins} · ${mem().inv.length ? "🎒 " + esc(mem().inv.join(", ")) : "🎒 vuoto"}</p>
<button type="button" data-q="1">Grafica: ${mem().q === "low" ? "Leggera" : "Alta"} (tocca per cambiare, riapre)</button><button type="button" data-z="1">🕘 Riposa fino a domattina</button><button type="button" data-r="1">▶ Riprendi</button><button type="button" data-x="1">✕ Esci dalla città</button>`;
      OV.appendChild(m);
      m.querySelector("[data-r]").onclick = () => { m.remove(); G.menu = false; };
      m.querySelector("[data-x]").onclick = () => { save(); K.exit(); };
      m.querySelector("[data-q]").onclick = () => { mem().q = mem().q === "low" ? "hi" : "low"; persist(); const b = BACK; open(b); };
      m.querySelector("[data-z]").onclick = () => { m.remove(); G.menu = false; K.skipTo(7, () => toast("🌅 Un nuovo giorno.")); };
    }
    function persist() { if (!G || !M) return; const d = districtAt(G.p.x, G.p.z); if (d) { M.d = d.id; M.at = [G.p.x - origin(d).x, G.p.z - origin(d).z]; } M.hour = G.hour; M.yaw = G.yaw; save(); }

    // ------------------------------------------------------------ interazione
    function nearest() {
      if (!G) return null; let best = null, bd = 3.6;
      G.npcs.forEach((o) => { const d = Math.hypot(o.x - G.p.x, o.z - G.p.z); if (d < bd && npcPresent(o)) { bd = d; best = { kind: "npc", o, label: "Parla" + "\n" + o.cfg.name }; } });
      (cfg.pois || []).forEach((p) => { const w = toWorld(p.d, p.at), d = Math.hypot(w.x - G.p.x, w.z - G.p.z); if (d < Math.max(p.r || 2.6, 0) && d < bd + 0.5 && (!p.when || p.when(K))) { bd = d; best = { kind: "poi", p, label: p.label || "Usa" }; } });
      return best;
    }
    const npcPresent = (o) => { const t = npcTarget(o.cfg, G.hour); return !!t; };
    function doAct() {
      if (!G || G.talking || G.menu) return; const n = G.near; if (!n) return;
      if (n.kind === "npc") { const f = STORY.talk && STORY.talk[n.o.cfg.id]; if (f) f(K); else say([[n.o.cfg.id, "Ciao."]]); }
      else if (n.kind === "poi") { const f = STORY.poi && STORY.poi[n.p.id]; if (f) f(K); }
      persist(); refreshGoal();
    }
    let goalCur = null;
    function refreshGoal() {
      if (!OV || !STORY) return; goalCur = STORY.goal ? STORY.goal(K) : null; const t = OV.querySelector(".c3dGoal .tx"); if (t) t.textContent = (goalCur && goalCur.text) || "Gira la città.";
      if (G && G.beacon) { const tg = goalCur && goalCur.target, p = tg && tg.npc ? null : tg && tg.d ? toWorld(tg.d, tg.at) : null; G.beacon.visible = !!p; if (p) G.beacon.position.set(p.x, 20, p.z); }
      if (G) G.npcs.forEach((o) => { const s = STORY.hasTalk ? STORY.hasTalk(o.cfg.id, K) : false; o.mk.visible = !!s; });
    }
    function goalPos() { if (!goalCur || !goalCur.target) return null; const tg = goalCur.target; if (tg.npc) { const o = G.npcs.find((n) => n.cfg.id === tg.npc); return o ? { x: o.x, z: o.z } : null; } return tg.d ? toWorld(tg.d, tg.at) : null; }

    // ------------------------------------------------------------ simulazione
    function collide(x, z, r) {
      for (let i = 0; i < G.W.solids.length; i++) { const s = G.W.solids[i]; const cx = clamp(x, s[0], s[2]), cz = clamp(z, s[1], s[3]), dx = x - cx, dz = z - cz, d2 = dx * dx + dz * dz; if (d2 < r * r) { if (d2 > 1e-6) { const d = Math.sqrt(d2), p = r - d; x += dx / d * p; z += dz / d * p; } else { const l = x - s[0], rr = s[2] - x, t = z - s[1], b = s[3] - z, m = Math.min(l, rr, t, b); if (m === l) x = s[0] - r; else if (m === rr) x = s[2] + r; else if (m === t) z = s[1] - r; else z = s[3] + r; } } }
      return [x, z];
    }
    function step(dt) {
      if (!G) return; if (!G.talking && !G.menu) {
        G.hour += dt * (cfg.hourPerSec || 1 / 20); if (G.hour >= 24) { G.hour -= 24; G.day++; }
        let sx = G.stk.x, sy = G.stk.y; const k = G.keys; if (k.a || k.arrowleft) sx -= 1; if (k.d || k.arrowright) sx += 1; if (k.w || k.arrowup) sy -= 1; if (k.s || k.arrowdown) sy += 1; if (k.q) G.yaw += dt * 1.8; if (k.z) G.yaw -= dt * 1.8;
        const m = Math.hypot(sx, sy); if (m > 1) { sx /= m; sy /= m; }
        const fx = -Math.sin(G.yaw), fz = -Math.cos(G.yaw), rx = Math.cos(G.yaw), rz = -Math.sin(G.yaw), sp = 8.2;
        const vx = (fx * -sy + rx * sx) * sp, vz = (fz * -sy + rz * sx) * sp; G.p.vx = vx; G.p.vz = vz;
        let nx = G.p.x + vx * dt, nz = G.p.z + vz * dt; [nx, nz] = collide(nx, nz, 0.7); G.p.x = nx; G.p.z = nz;
        if (Math.hypot(vx, vz) > 0.5) G.face = Math.atan2(vx, vz);
        // PNG: camminano verso la posizione dell'orario
        G.npcs.forEach((o) => { const t = npcTarget(o.cfg, G.hour); if (!t) { o.sp = 0; return; } const dx = t.x - o.x, dz = t.z - o.z, d = Math.hypot(dx, dz); if (d > 0.4) { const s = Math.min(d, 5 * dt); o.x += dx / d * s; o.z += dz / d * s; o.face = Math.atan2(dx, dz); o.sp = 5; } else o.sp = 0; });
      }
      G.t += dt; G.acc += dt; if (G.acc > 0.3) { G.acc = 0; applyLight(); G.near = nearest(); }
    }
    function updateVisuals(dt) {
      G.me.position.set(G.p.x, 0, G.p.z); const sp = Math.hypot(G.p.vx, G.p.vz) * (G.talking || G.menu ? 0 : 1); if (G.face != null) G.me.rotation.y = lerpAng(G.me.rotation.y, G.face, 0.25); animFig(G.me, sp, G.t);
      G.npcs.forEach((o) => { o.mesh.position.set(o.x, 0, o.z); o.mesh.rotation.y = lerpAng(o.mesh.rotation.y, o.face || 0, 0.15); animFig(o.mesh, o.sp, G.t + o.x); o.mk.position.y = 4.3 + Math.sin(G.t * 3) * 0.15; o.mesh.visible = npcPresent(o); });
      const D = 11 - (G.menu ? 0 : 0), H = 8; const tx = G.p.x + Math.sin(G.yaw) * D, tz = G.p.z + Math.cos(G.yaw) * D;
      G.cam.position.x = lerp(G.cam.position.x, tx, 0.14); G.cam.position.y = lerp(G.cam.position.y, H, 0.1); G.cam.position.z = lerp(G.cam.position.z, tz, 0.14); G.cam.lookAt(G.p.x, 1.8, G.p.z);
      G.W.water.forEach((w, i) => { w.material.emissiveIntensity = 0.2 + Math.sin(G.t * 1.5 + i) * 0.06; });
      const hh = Math.floor(G.hour), mm = Math.floor((G.hour % 1) * 60), clk = OV.querySelector(".clk"); clk.textContent = `${G.night > 0.5 ? "🌙" : "☀️"} ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
      const d = districtAt(G.p.x, G.p.z); const ds = OV.querySelector(".dst"); if (d && ds.dataset.d !== d.id) { ds.dataset.d = d.id; ds.textContent = `${d.icon || ""} ${d.name}`; }
      const a = OV.querySelector(".c3dAct"), n = G.near; a.classList.toggle("off", !n); a.innerHTML = n ? n.label.replace(/\n/, "<br>") : "…";
      const gp = goalPos(), ar = OV.querySelector(".c3dGoal .ar"); if (gp) { const ang = Math.atan2(gp.x - G.p.x, gp.z - G.p.z) - (G.yaw + Math.PI); ar.style.transform = `rotate(${(-ang * 180 / Math.PI + 180).toFixed(0)}deg)`; ar.textContent = "⬆️"; } else ar.textContent = "🧭";
    }
    const lerpAng = (a, b, t) => { let d = b - a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return a + d * t; };
    function loop() {
      if (!G || G.dead) return; const now = performance.now(), dt = Math.min(0.05, (now - G.last) / 1000); G.last = now;
      step(dt); updateVisuals(dt); G.renderer.render(G.scene, G.cam); G.raf = requestAnimationFrame(loop);
    }

    const api = {
      open, close,
      menuEntry: (back) => ({ label: `${ICON} ${TITLE}`, cls: "hot", fn: () => open(back), sub: `Capitolo ${mem().ch}${mem().done[mem().ch] ? " concluso" : " in corso"}${cfg.menuSub ? " · " + cfg.menuSub : ""}` }),
      endings: () => Object.keys(cfg.endings || {}).map((k) => ({ id: k, title: cfg.endings[k][0], desc: cfg.endings[k][1], hint: cfg.endings[k][2] || "", found: mem().ends.includes(k) })),
      info: () => { const m = load(); return { ch: m.ch, step: m.step, done: m.done, ends: m.ends, flags: m.flags }; },
      _dbg: DBG ? { K, state: () => G, mem, step: (dt) => { step(dt); if (G) updateVisuals(dt); }, render: () => G && G.renderer.render(G.scene, G.cam), toWorld, districtAt, DIST, NPCS, say, near: () => (G && G.near) || null, near2: () => { if (G) G.near = nearest(); return G && G.near; }, act: () => doAct(), solids: () => G && G.W.solids } : undefined
    };
    return api;
  }
  window.__citta3d = { create, DS };
})();
