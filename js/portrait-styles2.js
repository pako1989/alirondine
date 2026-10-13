// js/portrait-styles2.js - DUE STILI NUOVI DEI VOLTI (Impostazioni → Grafica → Stile dei volti)
//  - flat:  FLAT DESIGN. Niente contorni, solo forme geometriche a colori pieni, una sola ombra netta, occhi a pastiglia.
//           Come le illustrazioni delle app: pulito, leggibile anche piccolissimo.
//  - hd:    2D HD. Disegno vettoriale morbido ad alta definizione: pelle con sfumature calde, occlusione sotto i capelli,
//           capelli con gradiente, riflessi a ciocche e luce di contorno, occhi con iride a raggiera e due riflessi.
// Stesso riferimento dei ritratti classici: origine al centro del viso, viso ±18 circa, spalle fino a y=60.
// Si aggancia a window.__faceStyles (js/portrait-styles.js): draw(style, …) gestisce anche questi tre.
(function () {
  "use strict";
  const FS = window.__faceStyles; if (!FS || FS.__v2) return;
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return h >>> 0; };
  const hex = (c) => { c = String(c || "#888").replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); const n = parseInt(c.slice(0, 6), 16); return Number.isFinite(n) ? [(n >> 16) & 255, (n >> 8) & 255, n & 255] : [136, 136, 136]; };
  const rgb = (a, al) => (al == null ? `rgb(${a.map((v) => Math.max(0, Math.min(255, Math.round(v)))).join(",")})` : `rgba(${a.map((v) => Math.max(0, Math.min(255, Math.round(v)))).join(",")},${al})`);
  const mix = (c, k, to, al) => { const a = hex(c), b = hex(to || "#000000"); return rgb(a.map((v, i) => v + (b[i] - v) * k), al); };
  const dark = (c, k, al) => mix(c, k, "#1a0f18", al), lite = (c, k, al) => mix(c, k, "#ffffff", al), warm = (c, k, al) => mix(c, k, "#c0485a", al);
  const lum = (c) => { const [r, g2, b] = hex(c); return (0.299 * r + 0.587 * g2 + 0.114 * b) / 255; };
  // le acconciature: nomi delle saghe e sinonimi ricondotti a una forma
  const ALIAS = { short: "buzz", corto: "buzz", lungo: "long", flowing: "long", coda: "ponytail", medium: "slick", afro: "curly" };
  const hairOf = (c) => { const s = ALIAS[c.style] || c.style || "messy"; return s; };
  const LONG = { long: 1, bob: 1, ponytail: 1, codino: 1, twintails: 1, braids: 1, bun: 1 };
  function traits(id, c) {
    const h = hash(id + (c && c.face ? "|" + c.face : "")), b = (n, k) => (h >>> n) % k;
    return { fw: 16 + b(0, 4) * 0.8, chin: b(3, 3), eyeW: 5 + b(5, 4) * 0.45, gap: 8.6 + b(8, 3) * 0.5, eyeY: 5 + b(10, 3) * 0.5, brow: b(12, 3), nose: b(14, 3), mouth: b(16, 3), part: b(18, 3), locks: 4 + b(20, 3), tilt: (b(22, 5) - 2) * 0.05, lash: b(24, 2), mole: b(26, 7) === 0, freck: b(28, 8) === 0 };
  }
  const isWow = (e) => e === "surprised" || e === "wow";

  // ---------------------------------------------------------------- forme comuni
  function facePath(g, fw, chinY, pointy) { // viso: tempie, guance, mento (più a punta nello stile visual novel)
    g.beginPath(); g.moveTo(-fw, -10); g.bezierCurveTo(-fw - 1, 6, -fw + 1, 14, -fw + (pointy ? 5 : 3), 18);
    if (pointy) { g.quadraticCurveTo(-6, chinY - 1, 0, chinY); g.quadraticCurveTo(6, chinY - 1, fw - 5, 18); }
    else { g.bezierCurveTo(-fw + 7, chinY - 1, -5, chinY + 1, 0, chinY + 0.5); g.bezierCurveTo(5, chinY + 1, fw - 7, chinY - 1, fw - 3, 18); }
    g.bezierCurveTo(fw - 1, 14, fw + 1, 6, fw, -10); g.bezierCurveTo(fw - 2, -26, -fw + 2, -26, -fw, -10); g.closePath();
  }
  function bodyPath(g, w) { g.beginPath(); g.moveTo(-w, 62); g.bezierCurveTo(-w + 1, 44, -26, 34, -10, 31); g.lineTo(10, 31); g.bezierCurveTo(26, 34, w - 1, 44, w, 62); g.closePath(); }
  // capelli DIETRO la testa (code, trecce, caschetto, chignon, lunghi)
  function hairBack(g, st, fw, fill, P) {
    if (st === "hood") return;
    g.fillStyle = fill;
    if (st === "long") { g.beginPath(); g.moveTo(-fw - 5, -8); g.bezierCurveTo(-fw - 12, 20, -fw - 8, 44, -fw - 2, 56); g.lineTo(fw + 2, 56); g.bezierCurveTo(fw + 8, 44, fw + 12, 20, fw + 5, -8); g.closePath(); g.fill(); }
    if (st === "bob") { g.beginPath(); g.moveTo(-fw - 5, -8); g.bezierCurveTo(-fw - 9, 10, -fw - 7, 22, -fw - 3, 26); g.lineTo(fw + 3, 26); g.bezierCurveTo(fw + 7, 22, fw + 9, 10, fw + 5, -8); g.closePath(); g.fill(); }
    if (st === "ponytail" || st === "codino") { g.beginPath(); g.moveTo(fw - 2, -14); g.bezierCurveTo(fw + 16, -16, fw + 14, 12, fw + 8, 30); g.bezierCurveTo(fw + 4, 16, fw + 6, 0, fw - 4, -6); g.closePath(); g.fill(); if (P.tie) { g.fillStyle = P.tie; g.beginPath(); g.ellipse(fw + 3, -12, 3, 4, 0.4, 0, 7); g.fill(); } }
    if (st === "twintails") [-1, 1].forEach((sd) => { g.fillStyle = fill; g.beginPath(); g.moveTo(sd * (fw - 2), -16); g.bezierCurveTo(sd * (fw + 18), -14, sd * (fw + 16), 18, sd * (fw + 6), 38); g.bezierCurveTo(sd * (fw + 6), 18, sd * (fw + 4), 2, sd * (fw - 4), -8); g.closePath(); g.fill(); if (P.tie) { g.fillStyle = P.tie; g.beginPath(); g.arc(sd * (fw + 1), -14, 3.2, 0, 7); g.fill(); } });
    if (st === "braids") [-1, 1].forEach((sd) => { for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? fill : P.alt || fill; g.beginPath(); g.ellipse(sd * (fw + 2), 6 + k * 7.5, 4.6, 4.4, sd * 0.3, 0, 7); g.fill(); } if (P.tie) { g.fillStyle = P.tie; g.fillRect(sd * (fw + 2) - 3, 40, 6, 3); } });
    if (st === "bun") { g.beginPath(); g.arc(0, -29, 8.5, 0, 7); g.fill(); }
  }
  // calotta e frangia DAVANTI (path chiuso, da riempire); top = altezza della calotta
  function hairFront(g, st, fw, T, opts) {
    const o = opts || {}, top = st === "buzz" ? -21 : st === "cresta" ? -21 : -25 - (st === "curly" ? 3 : 0), pointy = !!o.pointy;
    g.beginPath(); g.moveTo(-fw - 3, 6);
    g.bezierCurveTo(-fw - 5, top + 2, -8, top - 2, 0, top - 1); g.bezierCurveTo(8, top - 2, fw + 5, top + 2, fw + 3, 6);
    if (st === "buzz") { g.lineTo(fw, -8); g.quadraticCurveTo(0, -16, -fw, -8); g.closePath(); return top; }
    if (st === "slick" || st === "ordinato") { g.lineTo(fw + 1, -6); g.bezierCurveTo(fw - 4, -14, 6, -15, T.part === 2 ? 4 : -4, -13); g.bezierCurveTo(-8, -12, -fw + 2, -12, -fw - 1, -4); g.closePath(); return top; }
    if (st === "side") { g.lineTo(fw + 1, -2); g.bezierCurveTo(fw - 6, -12, 0, -10, -fw + 4, 4); g.lineTo(-fw - 1, -2); g.closePath(); return top; }
    // frangia a ciocche (più lunghe e appuntite nello stile visual novel)
    const n = st === "bob" || st === "long" ? T.locks + 1 : T.locks, dir = T.part === 1 ? 2.2 : T.part === 2 ? -2.2 : 0, len = o.len || 0;
    g.lineTo(fw + 1.5, -2);
    for (let i = n; i >= 1; i--) {
      const x1 = -fw + (2 * fw) * (i / n), x0 = -fw + (2 * fw) * ((i - 1) / n), mid = (x0 + x1) / 2, deep = (i % 2 ? -1 : 2) + len + (st === "spiky" ? -3 : 0) + (st === "messy" ? (i % 3) - 1 : 0);
      if (pointy) { g.quadraticCurveTo(x1 - 1, -10, mid - dir, deep); g.quadraticCurveTo(x0 + 2, -8, x0, -12 + (i === 1 ? 10 : 0)); }
      else { g.quadraticCurveTo(x1, -6, mid - dir, deep); g.quadraticCurveTo(x0 + 1, -6, x0, -10 + (i === 1 ? 8 : 0)); }
    }
    g.lineTo(-fw - 1.5, -2); g.closePath(); return top;
  }
  function sideLocks(g, st, fw, fill, len) { // ciocche lunghe ai lati del viso
    if (!(LONG[st] || st === "messy" || st === "spiky")) return; const L = (st === "long" ? 30 : st === "bob" ? 22 : 14) + (len || 0);
    g.fillStyle = fill; [-1, 1].forEach((sd) => { g.beginPath(); g.moveTo(sd * (fw + 3), -6); g.bezierCurveTo(sd * (fw + 5), 6, sd * (fw + 3), L - 6, sd * (fw - 1), L); g.bezierCurveTo(sd * (fw - 2), L - 10, sd * (fw - 3), 4, sd * (fw - 4), -2); g.closePath(); g.fill(); });
  }
  function extras(g, st, fw, top, fill, line) { // ciuffi, creste, punte, ricci sopra la calotta
    g.fillStyle = fill;
    if (st === "spiky") for (let i = 0; i < 5; i++) { const a = Math.PI * (1.12 + i * 0.19); g.beginPath(); g.moveTo(Math.cos(a - 0.12) * 13, top + 10 + Math.sin(a - 0.12) * 8); g.lineTo(Math.cos(a) * 26, top + 6 + Math.sin(a) * 15); g.lineTo(Math.cos(a + 0.12) * 13, top + 10 + Math.sin(a + 0.12) * 8); g.closePath(); g.fill(); }
    if (st === "cresta") { g.beginPath(); g.moveTo(-5, top + 3); g.quadraticCurveTo(-2, top - 14, 3, top - 13); g.quadraticCurveTo(4, top - 4, 5, top + 3); g.closePath(); g.fill(); }
    if (st === "messy") { [[-6, -7], [2, -9], [9, -6]].forEach(([x, h]) => { g.beginPath(); g.moveTo(x - 4, top + 3); g.quadraticCurveTo(x, top + h, x + 5, top + h + 2); g.quadraticCurveTo(x + 2, top, x + 3, top + 4); g.closePath(); g.fill(); }); }
    if (st === "curly") { for (let i = 0; i <= 10; i++) { const a = Math.PI * (1 + i / 10); g.beginPath(); g.arc(Math.cos(a) * (fw + 3), top + 18 + Math.sin(a) * 18, 5.5, 0, 7); g.fill(); } }
    if (st === "elmo") { g.fillStyle = "#9aa0ac"; g.beginPath(); g.moveTo(-fw - 4, -2); g.bezierCurveTo(-fw - 5, -30, fw + 5, -30, fw + 4, -2); g.closePath(); g.fill(); g.fillStyle = "#c8a040"; g.fillRect(-2, -34, 4, 14); g.fillStyle = "#6a707c"; g.fillRect(-fw - 4, -6, 2 * fw + 8, 4); }
    if (st === "bandana") { g.fillStyle = "#c83a3a"; g.beginPath(); g.moveTo(-fw - 3, -8); g.quadraticCurveTo(0, -16, fw + 3, -8); g.lineTo(fw + 3, -3); g.quadraticCurveTo(0, -11, -fw - 3, -3); g.closePath(); g.fill(); g.beginPath(); g.moveTo(fw + 1, -7); g.lineTo(fw + 10, -1); g.lineTo(fw + 6, 2); g.closePath(); g.fill(); }
    if (st === "hood") { g.fillStyle = fill; g.beginPath(); g.moveTo(-fw - 9, 34); g.bezierCurveTo(-fw - 12, -34, fw + 12, -34, fw + 9, 34); g.lineTo(fw + 3, 34); g.bezierCurveTo(fw + 4, -16, -fw - 4, -16, -fw - 3, 34); g.closePath(); g.fill(); }
  }
  function capPath(g, fw) { g.beginPath(); g.moveTo(-fw - 3, -7); g.bezierCurveTo(-fw - 2, -30, fw + 2, -30, fw + 3, -7); g.closePath(); }

  // ================================================================ FLAT DESIGN
  function flat(g, id, c, expr) {
    const T = traits(id, c), st = hairOf(c), skin = c.skin || "#e0b48a", hair = c.hair || "#2b1d14", eye = c.eye || "#2a2a2a", shirt = c.shirt || "#3f5fbf", fw = T.fw;
    const skinS = mix(skin, 0.16, "#7a3a4a"), hairS = dark(hair, 0.22), shirtS = dark(shirt, 0.2), ink = dark(skin, 0.72);
    cosm(g, c, T, true);
    hairBack(g, st, fw, hairS, { tie: "#ff6a7a", alt: hair });
    // corpo: maglia piatta, ombra netta a destra, colletto geometrico
    g.fillStyle = shirt; bodyPath(g, 36); g.fill();
    g.save(); bodyPath(g, 36); g.clip(); g.fillStyle = shirtS; g.fillRect(6, 30, 40, 40); g.restore();
    g.fillStyle = dark(shirt, 0.35); g.beginPath(); g.moveTo(-9, 31); g.lineTo(0, 41); g.lineTo(9, 31); g.closePath(); g.fill();
    g.fillStyle = skinS; g.fillRect(-6, 20, 12, 13); g.fillStyle = skin; g.beginPath(); g.moveTo(-6, 31); g.lineTo(0, 37); g.lineTo(6, 31); g.closePath(); g.fill();
    if (c.num && g.getTransform().a > 0) { g.fillStyle = lum(shirt) > 0.6 ? "#1a1a1a" : "#ffffff"; g.font = "800 10px system-ui, sans-serif"; g.textAlign = "center"; g.fillText(String(c.num).slice(0, 2), -20, 54); g.textAlign = "left"; }
    // orecchie e viso
    g.fillStyle = skin; [-1, 1].forEach((sd) => { g.beginPath(); g.arc(sd * (fw + 1), 6, 4, 0, 7); g.fill(); });
    facePath(g, fw, 26 + [0, 2, -1][T.chin], false); g.fillStyle = skin; g.fill();
    g.save(); facePath(g, fw, 26 + [0, 2, -1][T.chin], false); g.clip(); g.fillStyle = skinS; g.beginPath(); g.moveTo(3, -30); g.bezierCurveTo(fw * 0.9, -8, fw * 0.8, 12, 2, 32); g.lineTo(40, 32); g.lineTo(40, -30); g.closePath(); g.fill(); g.restore();
    if (c.beard) { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw + 2, 10); g.quadraticCurveTo(-fw + 4, 29, 0, 30); g.quadraticCurveTo(fw - 4, 29, fw - 2, 10); g.quadraticCurveTo(0, 22, -fw + 2, 10); g.fill(); }
    // occhi a pastiglia, un punto bianco
    const blink = expr === "blink" || expr === "grin", wide = isWow(expr);
    [-1, 1].forEach((sd) => {
      const ex = sd * T.gap, ey = T.eyeY + 1;
      if (c.shades) return;
      if (blink || expr === "smile" && T.mouth === 2) { g.strokeStyle = ink; g.lineWidth = 2.2; g.lineCap = "round"; g.beginPath(); g.arc(ex, ey + 2, 3.4, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); return; }
      if (expr === "sly" && sd > 0) { g.fillStyle = ink; g.fillRect(ex - 3.5, ey - 0.5, 7, 2.4); return; }
      const rw = wide ? 3.6 : 3, rh = wide ? 4.8 : expr === "angry" ? 3 : 4.2;
      g.fillStyle = ink; g.beginPath(); g.ellipse(ex, ey, rw, rh, 0, 0, 7); g.fill(); g.fillStyle = eye; g.globalAlpha = 0.55; g.beginPath(); g.ellipse(ex, ey + 1, rw * 0.8, rh * 0.6, 0, 0, 7); g.fill(); g.globalAlpha = 1;
      g.fillStyle = "#fff"; g.beginPath(); g.arc(ex - 1, ey - 1.4, 1.1, 0, 7); g.fill();
      if (expr === "sad") { g.fillStyle = "#7ac8f0"; g.beginPath(); g.moveTo(ex + sd * 2, ey + 4); g.quadraticCurveTo(ex + sd * 3.5, ey + 8, ex + sd * 2, ey + 9); g.quadraticCurveTo(ex + sd * 0.5, ey + 8, ex + sd * 2, ey + 4); g.fill(); }
    });
    // sopracciglia: barrette arrotondate
    g.strokeStyle = hairS; g.lineCap = "round"; g.lineWidth = [2, 2.8, 2.4][T.brow];
    [-1, 1].forEach((sd) => { const bx = sd * T.gap, by = T.eyeY - 6 - (wide ? 2 : 0), t = (expr === "angry" ? 0.4 : expr === "sad" ? -0.35 : T.tilt) * sd; g.beginPath(); g.moveTo(bx - sd * 4, by + t * 5); g.lineTo(bx + sd * 4, by - t * 5); g.stroke(); });
    // naso: un piccolo semicerchio d'ombra
    g.fillStyle = skinS; g.beginPath(); g.arc(1, 13, [1.8, 2.4, 2][T.nose], 0, Math.PI); g.fill();
    // bocca piatta
    const my = 19.5;
    if (expr === "grin" || expr === "smile" && T.mouth !== 1) { g.fillStyle = "#6a2232"; g.beginPath(); g.moveTo(-4.5, my - 1); g.lineTo(4.5, my - 1); g.quadraticCurveTo(4.5, my + 5, 0, my + 5); g.quadraticCurveTo(-4.5, my + 5, -4.5, my - 1); g.fill(); g.fillStyle = "#ff8a9a"; g.beginPath(); g.ellipse(0, my + 3.2, 2.4, 1.2, 0, 0, 7); g.fill(); }
    else if (wide) { g.fillStyle = "#6a2232"; g.beginPath(); g.ellipse(0, my + 1, 2.4, 3, 0, 0, 7); g.fill(); }
    else { g.strokeStyle = "#8a3242"; g.lineWidth = 1.8; g.lineCap = "round"; g.beginPath(); if (expr === "sad") g.arc(0, my + 3, 3.2, Math.PI * 1.2, Math.PI * 1.8); else if (expr === "angry" || expr === "think") { g.moveTo(-3, my + 1); g.lineTo(3, my + 1); } else if (expr === "sly") { g.moveTo(-3, my + 1); g.quadraticCurveTo(1, my + 2.5, 4, my - 0.5); } else g.arc(0, my - 1, 3.2, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); }
    // capelli: blocco pieno + una ciocca più chiara geometrica
    if (c.cap) { g.save(); g.beginPath(); g.rect(-60, -8, 120, 80); g.clip(); }
    const top = hairFront(g, st, fw, T); if (st !== "hood" && st !== "elmo") { g.fillStyle = hair; g.fill(); }
    sideLocks(g, st, fw, hair); extras(g, st, fw, top, hair, null);
    if (!c.cap && st !== "buzz" && st !== "hood" && st !== "elmo") { g.fillStyle = lite(hair, 0.18); g.beginPath(); g.moveTo(-fw + 3, top + 10); g.quadraticCurveTo(-6, top + 1, 4, top + 2); g.quadraticCurveTo(-4, top + 5, -fw + 6, top + 14); g.closePath(); g.fill(); }
    if (c.cap) g.restore();
    if (c.glasses) { g.strokeStyle = "#20222a"; g.lineWidth = 1.8; [-1, 1].forEach((sd) => { g.beginPath(); g.roundRect ? g.roundRect(sd * T.gap - 6, T.eyeY - 4, 12, 10, 3) : g.rect(sd * T.gap - 6, T.eyeY - 4, 12, 10); g.stroke(); }); g.beginPath(); g.moveTo(-T.gap + 6, T.eyeY); g.lineTo(T.gap - 6, T.eyeY); g.stroke(); }
    if (c.shades) { g.fillStyle = "#16181f"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * T.gap, T.eyeY + 1, 6.5, 4.5, 0, 0, 7); g.fill(); }); g.fillRect(-T.gap, T.eyeY - 0.5, T.gap * 2, 2); g.fillStyle = "rgba(255,255,255,.35)"; [-1, 1].forEach((sd) => g.fillRect(sd * T.gap - 4, T.eyeY - 1, 3, 1.5)); }
    if (c.cap) { g.fillStyle = c.cap; capPath(g, fw); g.fill(); g.fillStyle = dark(c.cap, 0.2); g.beginPath(); g.ellipse(-6, -7, fw + 6, 3.5, -0.06, 0, 7); g.fill(); g.fillStyle = lite(c.cap, 0.25); g.beginPath(); g.arc(0, -28, 2, 0, 7); g.fill(); }
    if (expr === "think") thinkBubbles(g, "rgba(255,255,255,.9)");
    cosm(g, c, T);
  }

  // ================================================================ 2D HD
  function hd(g, id, c, expr) {
    const T = traits(id, c), st = hairOf(c), skin = c.skin || "#e0b48a", hair = c.hair || "#2b1d14", eye = c.eye || "#3a2a1a", shirt = c.shirt || "#3f5fbf", fw = T.fw, chinY = 26 + [0, 2, -1][T.chin];
    const line = dark(skin, 0.55), hairD = dark(hair, 0.4), hairL = lite(hair, 0.45);
    g.lineJoin = "round"; g.lineCap = "round";
    // capelli dietro con gradiente
    cosm(g, c, T, true);
    const hb = g.createLinearGradient(0, -20, 0, 56); hb.addColorStop(0, dark(hair, 0.2)); hb.addColorStop(1, dark(hair, 0.5)); hairBack(g, st, fw, hb, { tie: "#e8485a", alt: dark(hair, 0.1) });
    // corpo: maglia con pieghe sfumate e luce di contorno
    const sg = g.createLinearGradient(-36, 30, 36, 62); sg.addColorStop(0, lite(shirt, 0.18)); sg.addColorStop(0.55, shirt); sg.addColorStop(1, dark(shirt, 0.35)); g.fillStyle = sg; bodyPath(g, 36); g.fill();
    g.save(); bodyPath(g, 36); g.clip();
    g.strokeStyle = dark(shirt, 0.25, 0.5); g.lineWidth = 1.2; [[-20, 44, -14, 60], [18, 42, 24, 60]].forEach(([a, b, c2, d]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo((a + c2) / 2 + 3, (b + d) / 2, c2, d); g.stroke(); });
    g.strokeStyle = lite(shirt, 0.6, 0.7); g.lineWidth = 1.6; g.beginPath(); g.moveTo(-34, 60); g.bezierCurveTo(-33, 44, -24, 36, -10, 32); g.stroke();
    const ao = g.createRadialGradient(0, 30, 2, 0, 30, 18); ao.addColorStop(0, "rgba(0,0,0,.35)"); ao.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = ao; g.fillRect(-20, 28, 40, 20);
    g.restore();
    g.strokeStyle = dark(shirt, 0.55); g.lineWidth = 0.9; bodyPath(g, 36); g.stroke();
    // colletto a V con bordino
    g.fillStyle = dark(shirt, 0.3); g.beginPath(); g.moveTo(-10, 31); g.lineTo(0, 42); g.lineTo(10, 31); g.lineTo(7, 31); g.lineTo(0, 38); g.lineTo(-7, 31); g.closePath(); g.fill();
    if (c.num && g.getTransform().a > 0) { g.font = "900 11px system-ui, sans-serif"; g.textAlign = "center"; g.fillStyle = dark(shirt, 0.5); g.fillText(String(c.num).slice(0, 2), 19, 55); g.fillStyle = lite(shirt, 0.8); g.fillText(String(c.num).slice(0, 2), 18, 54); g.textAlign = "left"; }
    // collo con ombra del mento
    const ng = g.createLinearGradient(0, 18, 0, 34); ng.addColorStop(0, warm(skin, 0.4)); ng.addColorStop(1, mix(skin, 0.12, "#7a3a4a")); g.fillStyle = ng; g.beginPath(); g.moveTo(-6, 18); g.lineTo(-6.5, 33); g.quadraticCurveTo(0, 37, 6.5, 33); g.lineTo(6, 18); g.closePath(); g.fill();
    // orecchie
    [-1, 1].forEach((sd) => { const eg = g.createRadialGradient(sd * (fw + 1), 6, 0.5, sd * (fw + 1), 6, 5); eg.addColorStop(0, warm(skin, 0.35)); eg.addColorStop(1, skin); g.fillStyle = eg; g.beginPath(); g.ellipse(sd * (fw + 1), 6, 3.3, 5, 0, 0, 7); g.fill(); g.strokeStyle = line; g.lineWidth = 0.7; g.stroke(); });
    // viso: luce da sinistra in alto, calore sulle guance, ombra sul lato destro
    facePath(g, fw, chinY, false);
    const fg = g.createRadialGradient(-6, -2, 2, 0, 6, 30); fg.addColorStop(0, lite(skin, 0.14)); fg.addColorStop(0.55, skin); fg.addColorStop(1, mix(skin, 0.22, "#8a3a4a")); g.fillStyle = fg; g.fill();
    g.save(); g.clip();
    const side = g.createLinearGradient(fw * 0.2, 0, fw + 2, 0); side.addColorStop(0, "rgba(120,40,60,0)"); side.addColorStop(1, "rgba(120,40,60,.22)"); g.fillStyle = side; g.fillRect(0, -30, 30, 60);
    const occ = g.createLinearGradient(0, -14, 0, -4); occ.addColorStop(0, "rgba(60,20,30,.35)"); occ.addColorStop(1, "rgba(60,20,30,0)"); g.fillStyle = occ; g.fillRect(-30, -16, 60, 14); // occlusione sotto la frangia
    g.restore();
    facePath(g, fw, chinY, false); g.strokeStyle = line; g.lineWidth = 0.9; g.stroke();
    if (c.beard) { const bg2 = g.createLinearGradient(0, 8, 0, chinY + 3); bg2.addColorStop(0, dark(hair, 0.1, 0.55)); bg2.addColorStop(1, dark(hair, 0.2)); g.fillStyle = bg2; g.beginPath(); g.moveTo(-fw + 2, 9); g.quadraticCurveTo(-fw + 4, chinY + 1, 0, chinY + 3); g.quadraticCurveTo(fw - 4, chinY + 1, fw - 2, 9); g.quadraticCurveTo(5, 23, 0, 22); g.quadraticCurveTo(-5, 23, -fw + 2, 9); g.fill(); }
    if (T.freck) { g.fillStyle = dark(skin, 0.3, 0.6); [[-11, 12], [-9, 13.5], [-12.5, 14], [11, 12], [9, 13.5], [12.5, 14]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 0.55, 0, 7); g.fill(); }); }
    if (T.mole) { g.fillStyle = dark(skin, 0.6); g.beginPath(); g.arc(7.5, 21, 0.8, 0, 7); g.fill(); }
    // occhi dettagliati
    eyesDetailed(g, T, c, expr, { skin, hair, eye, line, scale: 1, vn: false });
    // naso sfumato
    g.save(); const nG = g.createLinearGradient(-1, 8, 3, 15); nG.addColorStop(0, "rgba(140,60,70,0)"); nG.addColorStop(1, "rgba(140,60,70,.32)"); g.fillStyle = nG; g.beginPath(); g.moveTo(1, 7); g.quadraticCurveTo(3.4, 12, 2.6, 15); g.lineTo(-0.5, 15.4); g.quadraticCurveTo(1.6, 12, 1, 7); g.fill();
    g.fillStyle = "rgba(255,255,255,.45)"; g.beginPath(); g.ellipse(0, 13.6, 0.9, 0.6, 0, 0, 7); g.fill(); g.fillStyle = dark(skin, 0.4, 0.7); [-1.4, 1.8].forEach((nx) => { g.beginPath(); g.ellipse(nx, 15.4, 0.8, 0.45, 0, 0, 7); g.fill(); }); g.restore();
    // bocca con labbra sfumate
    mouthSoft(g, T, skin, expr, 20.5);
    // capelli: gradiente, ciocche, riflessi e luce di contorno
    if (c.cap) { g.save(); g.beginPath(); g.rect(-60, -8, 120, 80); g.clip(); }
    const hg = g.createLinearGradient(0, -30, 0, 10); hg.addColorStop(0, lite(hair, 0.12)); hg.addColorStop(0.45, hair); hg.addColorStop(1, dark(hair, 0.3));
    const top = hairFront(g, st, fw, T); if (st !== "hood" && st !== "elmo") { g.fillStyle = hg; g.fill(); g.strokeStyle = hairD; g.lineWidth = 0.9; g.stroke(); }
    sideLocks(g, st, fw, hg); extras(g, st, fw, top, hg, hairD);
    if (!c.cap && st !== "hood" && st !== "elmo") {
      g.save(); hairFront(g, st, fw, T); g.clip();
      g.strokeStyle = dark(hair, 0.35, 0.55); g.lineWidth = 0.7; for (let i = 0; i < 7; i++) { const x = -fw + 4 + i * (fw * 2 - 8) / 6; g.beginPath(); g.moveTo(x * 0.5, top + 2); g.quadraticCurveTo(x * 0.9, top + 10, x, -8); g.stroke(); } // ciocche
      g.strokeStyle = hairL; g.globalAlpha = 0.85; g.lineWidth = 1.6; for (let i = 0; i < 4; i++) { const x = -10 + i * 4.5; g.beginPath(); g.moveTo(x - 2, top + 7 + (i % 2)); g.quadraticCurveTo(x, top + 4, x + 3, top + 6 + (i % 2)); g.stroke(); } g.globalAlpha = 1; // riflesso
      g.strokeStyle = "rgba(255,240,220,.35)"; g.lineWidth = 2.5; g.beginPath(); g.arc(0, top + 26, fw + 6, Math.PI * 1.06, Math.PI * 1.3); g.stroke(); // luce di contorno
      g.restore();
    }
    if (c.cap) g.restore();
    glassesHD(g, T, c);
    if (c.cap) { const cg = g.createLinearGradient(0, -30, 0, -6); cg.addColorStop(0, lite(c.cap, 0.2)); cg.addColorStop(1, dark(c.cap, 0.25)); g.fillStyle = cg; capPath(g, fw); g.fill(); g.strokeStyle = dark(c.cap, 0.5); g.lineWidth = 0.9; g.stroke(); const vg = g.createLinearGradient(0, -10, 0, -3); vg.addColorStop(0, dark(c.cap, 0.1)); vg.addColorStop(1, dark(c.cap, 0.45)); g.fillStyle = vg; g.beginPath(); g.ellipse(-6, -7, fw + 6, 3.6, -0.06, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.3)"; g.beginPath(); g.ellipse(-5, -22, 6, 2.5, -0.3, 0, 7); g.fill(); }
    if (expr === "think") thinkBubbles(g, "rgba(255,255,255,.92)");
    cosm(g, c, T);
  }
  function eyesDetailed(g, T, c, expr, P) {
    const blink = expr === "blink", wide = isWow(expr), happy = expr === "grin", sad = expr === "sad", angry = expr === "angry", vn = P.vn;
    [-1, 1].forEach((sd) => {
      if (c.shades) return;
      const ex = sd * T.gap, ey = T.eyeY + (vn ? 1 : 0), ew = T.eyeW * (vn ? 1.22 : 1) * (wide ? 1.1 : 1), eh = (vn ? 7.4 : 5.4) * (wide ? 1.18 : angry ? 0.78 : 1);
      g.save(); g.translate(ex, ey); g.rotate(-sd * (T.tilt + (angry ? 0.12 : sad ? -0.1 : 0))); g.translate(-ex, -ey);
      if (blink || happy || expr === "sly" && sd > 0) { g.strokeStyle = dark(P.hair, 0.5); g.lineWidth = vn ? 1.8 : 1.6; g.beginPath(); if (happy) g.arc(ex, ey + 2, ew * 0.85, Math.PI * 1.12, Math.PI * 1.88); else g.arc(ex, ey - 1.5, ew * 0.9, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); g.restore(); return; }
      // bianco con ombra della palpebra
      g.beginPath(); g.ellipse(ex, ey, ew, eh, 0, 0, 7); g.fillStyle = "#fdfbf8"; g.fill();
      g.save(); g.clip();
      const lid = g.createLinearGradient(0, ey - eh, 0, ey); lid.addColorStop(0, "rgba(90,60,90,.35)"); lid.addColorStop(1, "rgba(90,60,90,0)"); g.fillStyle = lid; g.fillRect(ex - ew, ey - eh, ew * 2, eh);
      // iride: scura in alto, luminosa in basso, anello e raggiera
      const ix = ex - sd * 0.3, iy = ey + (vn ? 0.9 : 0.4), ir = ew * (vn ? 0.78 : 0.68), irh = eh * (vn ? 0.92 : 0.9);
      const igr = g.createLinearGradient(0, iy - irh, 0, iy + irh); igr.addColorStop(0, dark(P.eye, 0.6)); igr.addColorStop(0.5, P.eye); igr.addColorStop(1, lite(P.eye, vn ? 0.55 : 0.35)); g.fillStyle = igr; g.beginPath(); g.ellipse(ix, iy, ir, irh, 0, 0, 7); g.fill();
      g.strokeStyle = dark(P.eye, 0.55, 0.5); g.lineWidth = 0.35; for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; g.beginPath(); g.moveTo(ix + Math.cos(a) * ir * 0.35, iy + Math.sin(a) * irh * 0.35); g.lineTo(ix + Math.cos(a) * ir * 0.9, iy + Math.sin(a) * irh * 0.9); g.stroke(); }
      g.strokeStyle = dark(P.eye, 0.65); g.lineWidth = 0.8; g.beginPath(); g.ellipse(ix, iy, ir, irh, 0, 0, 7); g.stroke();
      g.fillStyle = dark(P.eye, 0.85); g.beginPath(); g.ellipse(ix, iy + 0.3, ir * (wide ? 0.3 : 0.4), irh * (wide ? 0.32 : 0.44), 0, 0, 7); g.fill();
      if (vn) { g.fillStyle = lite(P.eye, 0.7, 0.75); g.beginPath(); g.ellipse(ix, iy + irh * 0.62, ir * 0.62, irh * 0.24, 0, 0, Math.PI); g.fill(); }
      g.restore();
      // riflessi (a stella nello stile visual novel)
      g.fillStyle = "#fff"; if (vn) star(g, ix - ir * 0.38, iy - irh * 0.4, 2.1); else { g.beginPath(); g.ellipse(ix - ir * 0.35, iy - irh * 0.38, 1.5, 1.2, -0.4, 0, 7); g.fill(); }
      g.globalAlpha = 0.8; g.beginPath(); g.arc(ix + ir * 0.4, iy + irh * 0.35, vn ? 1.1 : 0.8, 0, 7); g.fill(); g.globalAlpha = 1;
      // linea delle ciglia: spessa sopra, con la codina; sottile sotto
      g.strokeStyle = dark(P.hair, 0.6); g.lineWidth = vn ? 2.2 : 1.7; g.beginPath(); g.ellipse(ex, ey, ew + 0.3, eh + 0.2, 0, Math.PI * 1.04, Math.PI * 1.96); g.stroke();
      if (vn || T.lash) { g.lineWidth = 1.2; g.beginPath(); g.moveTo(ex + sd * (ew - 0.3), ey - eh * 0.45); g.quadraticCurveTo(ex + sd * (ew + 1.5), ey - eh * 0.6, ex + sd * (ew + 2.6), ey - eh * 0.95); g.stroke(); }
      g.strokeStyle = dark(P.skin, 0.4, 0.8); g.lineWidth = 0.6; g.beginPath(); g.ellipse(ex, ey, ew, eh, 0, Math.PI * 0.18, Math.PI * 0.82); g.stroke();
      if (!vn) { g.strokeStyle = dark(P.skin, 0.25, 0.6); g.lineWidth = 0.6; g.beginPath(); g.ellipse(ex, ey - 1.6, ew + 0.8, eh + 2, 0, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); } // piega della palpebra
      if (sad) { g.fillStyle = "rgba(150,210,255,.9)"; g.beginPath(); g.ellipse(ex + sd * 1.5, ey + eh + 2.5, 1.1, 1.8, 0, 0, 7); g.fill(); }
      g.restore();
    });
    // sopracciglia sottili con lieve gradiente
    g.strokeStyle = dark(P.hair, 0.3); g.lineWidth = vn ? 1.3 : [1.4, 2, 1.7][T.brow];
    [-1, 1].forEach((sd) => { const bx = sd * T.gap, by = T.eyeY - (vn ? 10 : 8) - (wide ? 2 : 0), t = (angry ? 0.38 : sad ? -0.32 : T.tilt) * sd; g.beginPath(); g.moveTo(bx - sd * 5, by + t * 6); g.quadraticCurveTo(bx, by - 1.2 - t, bx + sd * 5.5, by - t * 6 + 1); g.stroke(); });
  }
  function star(g, x, y, r) { g.beginPath(); for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 - Math.PI / 2, rr = k % 2 ? r * 0.4 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); }
  function mouthSoft(g, T, skin, expr, my) {
    const lip = mix(skin, 0.38, "#b84a5a");
    if (expr === "grin") { g.fillStyle = "#6a1e2c"; g.beginPath(); g.moveTo(-5.5, my - 1); g.quadraticCurveTo(0, my + 0.4, 5.5, my - 1); g.quadraticCurveTo(0, my + 8, -5.5, my - 1); g.fill(); g.fillStyle = "#fbf6f2"; g.beginPath(); g.moveTo(-4.5, my - 0.6); g.quadraticCurveTo(0, my + 0.6, 4.5, my - 0.6); g.lineTo(4, my + 1.2); g.quadraticCurveTo(0, my + 2, -4, my + 1.2); g.closePath(); g.fill(); g.fillStyle = "#e86a7a"; g.beginPath(); g.ellipse(0, my + 4.6, 2.6, 1.3, 0, 0, 7); g.fill(); return; }
    if (isWow(expr)) { g.fillStyle = "#6a1e2c"; g.beginPath(); g.ellipse(0, my + 1, 2.4, 3.2, 0, 0, 7); g.fill(); g.strokeStyle = lip; g.lineWidth = 0.8; g.stroke(); return; }
    g.strokeStyle = dark(skin, 0.55); g.lineWidth = 1.1; g.beginPath();
    if (expr === "smile" || T.mouth === 1 && expr !== "sad" && expr !== "angry") { g.moveTo(-4.2, my - 0.4); g.quadraticCurveTo(0, my + 3, 4.2, my - 0.4); }
    else if (expr === "sad") { g.moveTo(-3.5, my + 1.8); g.quadraticCurveTo(0, my - 0.8, 3.5, my + 1.8); }
    else if (expr === "angry") { g.moveTo(-4, my + 1); g.quadraticCurveTo(0, my - 0.2, 4, my + 1); }
    else if (expr === "sly") { g.moveTo(-3.5, my + 0.6); g.quadraticCurveTo(1, my + 2, 4.5, my - 1.2); }
    else { g.moveTo(-3.2, my); g.quadraticCurveTo(0, my + 1.4, 3.2, my); }
    g.stroke(); g.fillStyle = mix(skin, 0.3, "#c05060", 0.55); g.beginPath(); g.ellipse(0, my + 1.9, 2.6, 0.9, 0, 0, 7); g.fill();
  }
  function glassesHD(g, T, c) {
    if (c.glasses) { [-1, 1].forEach((sd) => { g.fillStyle = "rgba(200,230,255,.14)"; g.beginPath(); g.ellipse(sd * T.gap, T.eyeY, T.eyeW + 2.6, 6.4, 0, 0, 7); g.fill(); g.strokeStyle = "#2a2a34"; g.lineWidth = 1.2; g.stroke(); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(sd * T.gap - 3.5, T.eyeY - 3.5); g.lineTo(sd * T.gap - 1, T.eyeY - 5); g.stroke(); }); g.strokeStyle = "#2a2a34"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-T.gap + T.eyeW + 2.4, T.eyeY - 1); g.quadraticCurveTo(0, T.eyeY - 3, T.gap - T.eyeW - 2.4, T.eyeY - 1); g.stroke(); }
    if (c.shades) { [-1, 1].forEach((sd) => { const sg = g.createLinearGradient(0, T.eyeY - 5, 0, T.eyeY + 5); sg.addColorStop(0, "#3a3a4a"); sg.addColorStop(1, "#0a0a10"); g.fillStyle = sg; g.beginPath(); g.ellipse(sd * T.gap, T.eyeY, T.eyeW + 2.6, 5.2, 0, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.ellipse(sd * T.gap - 2.5, T.eyeY - 2, 2.4, 1, -0.3, 0, 7); g.fill(); }); g.fillStyle = "#111"; g.fillRect(-T.gap, T.eyeY - 1, T.gap * 2, 1.4); }
  }
  function cosm(g, c, T, back) { // i cosmetici come negli altri stili: aura (dietro), corone, maschere, elmi, mantelli, sciarpe, fasce… (FS.acc di portrait-styles.js)
    if (!c.acc || typeof c.acc !== "string") return; const G = { fw: T.fw, top: -26, ey: T.eyeY, eg: T.gap };
    try { if (back) { if (FS.acc) FS.acc(g, c, "back", G, "#1a1a22"); return; } if (FS.acc) { FS.acc(g, c, "body", G, "#1a1a22"); FS.acc(g, c, "head", G, "#1a1a22"); } else if (c.accFn) { c.accFn(g, "body"); c.accFn(g, "head"); } } catch (e) {}
  }
  function thinkBubbles(g, col) { g.fillStyle = col; [[23, -20, 2], [28, -28, 3], [35, -38, 5]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }); }

  const NEW = { flat, hd };
  const draw0 = FS.draw.bind(FS);
  FS.draw = function (style, g, id, c, expr) {
    if (!NEW[style]) return draw0(style, g, id, c, expr);
    if (!c || !c.skin) return false; if (c.cap && typeof c.cap !== "string") c = Object.assign({}, c, { cap: "#1d3fa3" });
    // le acconciature nuove (afro, dreadlock, undercut, ciuffo, mullet, onde, chignon spettinato, crocchia, treccia di lato, due chignon): base + pezzi dietro e davanti
    const st0 = ALIAS[c.style] || c.style, NB = { afro: "buzz", dread: "buzz", undercut: "slick", pompadour: "slick", mullet: "messy", wavy: "long", messybun: "bun", topknot: "buzz", sidebraid: "slick", spacebuns: "buzz", corona: "slick", ciuffo: "slick" }[st0];
    g.save(); try { if (NB && FS.hairOver && !c.cap) FS.hairOver(g, st0, c, "back"); NEW[style](g, id, NB ? Object.assign({}, c, { style: NB }) : c, expr); if (NB && FS.hairOver && (!c.cap || st0 === "sidebraid")) FS.hairOver(g, st0, c, "front"); } catch (e) { g.restore(); return false; } g.restore(); return true;
  };
  FS.__v2 = true; FS.NEW = Object.keys(NEW);
})();
