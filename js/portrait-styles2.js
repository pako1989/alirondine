// js/portrait-styles2.js - DUE STILI NUOVI DEI VOLTI (Impostazioni → Grafica → Stile dei volti)
//  - flat:  FLAT DESIGN. Niente contorni, solo forme geometriche a colori pieni, una sola ombra netta, occhi a pastiglia.
//           Come le illustrazioni delle app: pulito, leggibile anche piccolissimo.
//  (lo stile 2D HD è stato tolto il 2026-11-02: Pasquale usa solo Classico e Flat)
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
    g.save(); bodyPath(g, 36); g.clip(); g.fillStyle = shirtS; g.fillRect(6, 30, 40, 40); g.restore(); if (window.__shirtPat) { g.save(); bodyPath(g, 36); g.clip(); window.__shirtPat(g, shirt); g.restore(); }
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

  function cosm(g, c, T, back) { // i cosmetici come negli altri stili: aura (dietro), corone, maschere, elmi, mantelli, sciarpe, fasce… (FS.acc di portrait-styles.js)
    if (!c.acc || typeof c.acc !== "string") return; const G = { fw: T.fw, top: -26, ey: T.eyeY, eg: T.gap };
    try { if (back) { if (FS.acc) FS.acc(g, c, "back", G, "#1a1a22"); return; } if (FS.acc) { FS.acc(g, c, "body", G, "#1a1a22"); FS.acc(g, c, "head", G, "#1a1a22"); } else if (c.accFn) { c.accFn(g, "body"); c.accFn(g, "head"); } } catch (e) {}
  }
  function thinkBubbles(g, col) { g.fillStyle = col; [[23, -20, 2], [28, -28, 3], [35, -38, 5]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }); }

  const NEW = { flat };
  const draw0 = FS.draw.bind(FS);
  FS.draw = function (style, g, id, c, expr) {
    if (!NEW[style]) return draw0(style, g, id, c, expr);
    if (!c || !c.skin) return false; if (c.cap && typeof c.cap !== "string") c = Object.assign({}, c, { cap: "#1d3fa3" });
    // le acconciature nuove (afro, dreadlock, undercut, ciuffo, mullet, onde, chignon spettinato, crocchia, treccia di lato, due chignon): base + pezzi dietro e davanti
    const st0 = ALIAS[c.style] || c.style, NB = { cyber: "slick", maschera: "slick", ventura: "buzz", arbitro: "buzz", autista: "buzz", cacciatore: "buzz", meccanico: "buzz", apprendista: "buzz", afro: "buzz", dread: "buzz", undercut: "slick", pompadour: "slick", mullet: "messy", wavy: "long", messybun: "bun", topknot: "buzz", sidebraid: "slick", spacebuns: "buzz", corona: "slick", ciuffo: "slick", cometa: "buzz", scodella: "buzz", antenne: "buzz", criniera: "slick", brace: "buzz", palma: "buzz", alloro: "buzz", borsalino: "slick", colbacco: "buzz", cowboy: "buzz", coppola: "buzz" }[st0];
    g.save(); try { if (NB && FS.hairOver && !c.cap) FS.hairOver(g, st0, c, "back"); NEW[style](g, id, NB ? Object.assign({}, c, { style: NB }) : c, expr); if (NB && FS.hairOver && (!c.cap || st0 === "sidebraid")) FS.hairOver(g, st0, c, "front"); } catch (e) { g.restore(); return false; } g.restore(); return true;
  };

  // ---------------------------------------------------------------- dettagli del volto (valgono per tutti gli stili e per i PNG delle saghe)
  // c.beard: true = barba piena di sempre; oppure "incolta" | "folta" | "pizzetto" | "baffi"
  // c.scar: true = cicatrice sul sopracciglio; c.streak: "#colore" = ciocca colorata; c.band: "#colore" = fascia sulla fronte
  FS.mods = function (g, c, o) {
    o = o || {}; const hair = c.hair || "#2b1d14", b = typeof c.beard === "string" ? c.beard : "";
    g.save(); g.lineCap = "round"; g.lineJoin = "round";
    const bowl = (top, chin, a, w) => { g.globalAlpha = a; g.fillStyle = hair; g.beginPath(); g.moveTo(-w, top); g.bezierCurveTo(-w - 1, 18, -w + 3, chin - 2, 0, chin); g.bezierCurveTo(w - 3, chin - 2, w + 1, 18, w, top); g.quadraticCurveTo(w - 4, top + 5, 6, 15.6); g.quadraticCurveTo(0, 17.5, -6, 15.6); g.quadraticCurveTo(-w + 4, top + 5, -w, top); g.fill(); g.globalAlpha = 1; };
    const must = (th) => { g.strokeStyle = hair; g.lineWidth = th; g.beginPath(); g.moveTo(-7, 17); g.quadraticCurveTo(-3.5, 14.2, 0, 16); g.quadraticCurveTo(3.5, 14.2, 7, 17); g.stroke(); };
    if (b === "incolta") bowl(9, 27, 0.32, 15);
    else if (b === "folta") { bowl(5, 33, 0.96, 16.5); g.fillStyle = "#7a2c3c"; g.fillRect(-3.4, 18.6, 6.8, 1.8); }
    else if (b === "pizzetto") { g.fillStyle = hair; g.beginPath(); g.ellipse(0, 24.5, 3.6, 5, 0, 0, 7); g.fill(); must(1.6); }
    else if (b === "baffi") must(3.2);
    else if (b === "corta") { bowl(8, 29, 0.62, 15.5); must(2.2); }
    else if (b === "lunga") { bowl(5, 42, 0.95, 16.5); g.fillStyle = "#7a2c3c"; g.fillRect(-3.4, 18.6, 6.8, 1.8); }
    else if (b === "basette") { g.fillStyle = hair; g.globalAlpha = 0.9; [-1, 1].forEach((sd) => { g.beginPath(); g.moveTo(sd * 16.5, -4); g.lineTo(sd * 16.8, 15); g.lineTo(sd * 13.2, 17); g.lineTo(sd * 13, -4); g.closePath(); g.fill(); }); g.globalAlpha = 1; }
    else if (b === "mosca") { g.fillStyle = hair; g.beginPath(); g.ellipse(0, 24, 2, 2.6, 0, 0, 7); g.fill(); }
    // DETTAGLI (2026-11-07): c.marks = elenco separato da virgole, valgono in tutti gli stili e per Campione e PNG.
    // freckles lentiggini · mole neo · blush guance rosse · wrinkles rughe (automatiche per i personaggi tag "gray") · plaster cerotto
    // paint righe da tifoso (colore maglia) · earring orecchino d'oro · tired occhiaie · nosebreak naso da pugile · tattoo tatuaggio sul collo
    const M = new Set(String(c.marks || "").split(/[ ,]+/).filter(Boolean)); if (c.tag === "gray" && !M.has("noage")) M.add("wrinkles");
    const sk = c.skin || "#e0b48a", dk = (a) => `rgba(60,25,15,${a})`;
    if (M.has("blush")) { g.fillStyle = "rgba(255,90,110,.28)"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * 10.5, 13.5, 4.2, 2.6, 0, 0, 7); g.fill(); }); }
    if (M.has("freckles")) { g.fillStyle = dk(0.42); [[-12, 11], [-9.5, 12.5], [-12.5, 14], [-10, 15], [12, 11], [9.5, 12.5], [12.5, 14], [10, 15], [-3, 10.5], [3, 10.5]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 0.75, 0, 7); g.fill(); }); }
    if (M.has("mole")) { g.fillStyle = dk(0.75); g.beginPath(); g.arc(7.5, 17.5, 1.1, 0, 7); g.fill(); }
    if (M.has("wrinkles")) { g.strokeStyle = dk(0.3); g.lineWidth = 0.8; g.beginPath(); g.moveTo(-7, -9); g.quadraticCurveTo(0, -11, 7, -9); g.moveTo(-5, -12); g.quadraticCurveTo(0, -13.5, 5, -12); [-1, 1].forEach((sd) => { g.moveTo(sd * 14, 3); g.lineTo(sd * 16, 1.5); g.moveTo(sd * 14, 5); g.lineTo(sd * 16.2, 5); g.moveTo(sd * 5.5, 15); g.quadraticCurveTo(sd * 7, 18, sd * 6, 21); }); g.stroke(); }
    if (M.has("tired")) { g.strokeStyle = "rgba(90,60,110,.4)"; g.lineWidth = 1.2; [-1, 1].forEach((sd) => { g.beginPath(); g.arc(sd * 9.5, 7.5, 3.2, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); }); }
    if (M.has("nosebreak")) { g.strokeStyle = dk(0.45); g.lineWidth = 1.1; g.beginPath(); g.moveTo(-0.5, 6); g.lineTo(1.5, 9); g.lineTo(0, 11.5); g.stroke(); }
    if (M.has("plaster")) { g.save(); g.translate(9, 9.5); g.rotate(-0.5); g.fillStyle = "#f2d4a8"; g.fillRect(-4.5, -1.6, 9, 3.2); g.fillStyle = "#e0b88a"; g.fillRect(-1.4, -1.6, 2.8, 3.2); g.restore(); }
    if (M.has("paint")) { const pc = c.shirt || "#ff4d5a", p2 = c.shirt2 || "#ffffff"; [-1, 1].forEach((sd) => { [[pc, 0], [p2, 2.2]].forEach(([col, dy]) => { g.fillStyle = col; g.beginPath(); g.moveTo(sd * 8, 10 + dy); g.lineTo(sd * 14, 9 + dy); g.lineTo(sd * 14, 10.6 + dy); g.lineTo(sd * 8, 11.6 + dy); g.closePath(); g.fill(); }); }); }
    if (M.has("earring")) { g.fillStyle = "#ffd23f"; g.strokeStyle = "#a8801a"; g.lineWidth = 0.6; g.beginPath(); g.arc(-17.5, 10.5, 1.6, 0, 7); g.fill(); g.stroke(); }
    if (M.has("tattoo")) { g.fillStyle = "rgba(30,50,110,.75)"; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 1.4 : 3.2; g.lineTo(-3 + Math.cos(a) * r, 27.5 + Math.sin(a) * r); } g.closePath(); g.fill(); }
    void sk;
    if (c.scar && !o.noScar) { g.strokeStyle = "#e08a90"; g.lineWidth = 1.9; g.beginPath(); g.moveTo(6.5, -4); g.lineTo(10.5, 6); g.stroke(); g.lineWidth = 1; g.beginPath(); g.moveTo(5.3, -0.3); g.lineTo(9.3, 0.8); g.moveTo(7.2, 3.2); g.lineTo(11.4, 4); g.stroke(); }
    if (!c.cap) {
      if (c.streak) { g.strokeStyle = c.streak; g.globalAlpha = 0.92; g.lineWidth = 3.6; g.beginPath(); g.moveTo(-3, -29); g.quadraticCurveTo(5, -23, 7, -12); g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(-8, -27); g.quadraticCurveTo(-3, -21, -3, -14); g.stroke(); g.globalAlpha = 1; }
      if (c.band) { g.fillStyle = c.band; g.beginPath(); g.moveTo(-18, -12); g.quadraticCurveTo(0, -17, 18, -12); g.lineTo(18, -8.5); g.quadraticCurveTo(0, -13, -18, -8.5); g.closePath(); g.fill(); g.beginPath(); g.moveTo(16, -10); g.lineTo(24, -5); g.lineTo(20, -2); g.closePath(); g.fill(); }
    }
    g.restore();
  };
  const withMods = FS.draw;
  FS.draw = function (style, g, id, c, expr) {
    if (!c || !(typeof c.beard === "string" || c.scar || c.streak || c.band || c.marks || c.tag === "gray")) return withMods.call(FS, style, g, id, c, expr);
    const c2 = typeof c.beard === "string" ? Object.assign({}, c, { beard: false }) : c; // la barba a stile la disegniamo noi
    const r = withMods.call(FS, style, g, id, c2, expr);
    if (r !== false) { try { FS.mods(g, c, {}); } catch (e) {} }
    return r;
  };
  FS.__v2 = true; FS.NEW = Object.keys(NEW);
})();
