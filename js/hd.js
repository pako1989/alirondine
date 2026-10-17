// js/hd.js - attrezzi grafici comuni per le saghe: pavimenti con texture, pareti decorate, luci, plachette, atmosfera.
// Uso: cfg.floorPaint = (K, f, sx, sy, tx, ty) => window.__hd.floor(K, f, sx, sy, tx, ty, TABELLA); e cfg.paint.a = window.__hd.wall(...).
(function () {
  "use strict";
  if (window.__hd) return;
  const hs = (x, y, i) => { const s = Math.sin(x * 127.1 + y * 311.7 + (i || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };

  // ---- pavimenti: (g, sx, sy, tx, ty, fr, K, pal) ----
  const F = {
    marble(g, sx, sy, tx, ty, fr, K, p) { // scacchiera di marmo con venature, smusso e riflesso
      const d = (tx + ty) % 2, base = d ? p[0] : p[1];
      R(g, sx, sy, 16, 16, base);
      for (let i = 0; i < 2; i++) { const x = sx + hs(tx, ty, i) * 12, y = sy + hs(tx, ty, i + 5) * 12; g.strokeStyle = "rgba(90,80,70,.16)"; g.lineWidth = 0.6; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 5, y + 3 + hs(tx, ty, i + 9) * 4, x + 11, y + 2); g.stroke(); }
      R(g, sx, sy, 16, 1, "rgba(255,255,255,.35)"); R(g, sx, sy, 1, 16, "rgba(255,255,255,.2)"); R(g, sx, sy + 15, 16, 1, "rgba(0,0,0,.22)"); R(g, sx + 15, sy, 1, 16, "rgba(0,0,0,.16)");
      if (p[2] && (tx % 4 === 0) && (ty % 4 === 0)) { R(g, sx - 1, sy - 1, 3, 3, p[2]); }
      g.fillStyle = "rgba(255,255,255,.09)"; g.beginPath(); g.moveTo(sx + 2, sy + 14); g.lineTo(sx + 8, sy + 2); g.lineTo(sx + 11, sy + 2); g.lineTo(sx + 5, sy + 14); g.fill();
    },
    carpet(g, sx, sy, tx, ty, fr, K, p, edgeUp, edgeDn) { // tappeto con bordo dorato e motivo
      R(g, sx, sy, 16, 16, p[0]);
      for (let i = 0; i < 16; i += 4) R(g, sx + i, sy, 1, 16, "rgba(0,0,0,.07)");
      if (edgeUp) { R(g, sx, sy, 16, 2, p[1]); R(g, sx, sy + 3, 16, 1, p[1]); } if (edgeDn) { R(g, sx, sy + 14, 16, 2, p[1]); R(g, sx, sy + 12, 16, 1, p[1]); }
      if ((tx + ty) % 2 === 0) { R(g, sx + 6, sy + 6, 4, 4, p[1]); R(g, sx + 7, sy + 7, 2, 2, p[0]); }
      R(g, sx, sy + 8, 16, 1, "rgba(255,255,255,.05)");
    },
    planks(g, sx, sy, tx, ty, fr, K, p) { // assi di legno
      R(g, sx, sy, 16, 16, p[(ty * 2 + tx) % 2 ? 0 : 1]);
      for (let i = 0; i < 4; i++) { R(g, sx, sy + i * 4, 16, 1, "rgba(0,0,0,.28)"); const o = ((tx * 5 + ty * 3 + i * 7) % 12) + 2; R(g, sx + o, sy + i * 4 + 1, 1, 3, "rgba(0,0,0,.22)"); R(g, sx + (o + 5) % 14, sy + i * 4 + 2, 3, 1, "rgba(255,255,255,.07)"); }
      R(g, sx, sy, 16, 1, "rgba(255,230,180,.12)");
    },
    stone(g, sx, sy, tx, ty, fr, K, p) { // lastroni
      R(g, sx, sy, 16, 16, p[(tx * 3 + ty * 5) % 2]);
      R(g, sx, sy + 15, 16, 1, "rgba(0,0,0,.28)"); R(g, sx + 15, sy, 1, 16, "rgba(0,0,0,.22)"); R(g, sx, sy, 16, 1, "rgba(255,255,255,.12)");
      for (let i = 0; i < 3; i++) R(g, sx + hs(tx, ty, i) * 13, sy + hs(tx, ty, i + 3) * 13, 2, 1, "rgba(0,0,0,.16)");
      if (hs(tx, ty, 8) < 0.1) { R(g, sx + 3, sy + 4, 8, 1, "rgba(0,0,0,.2)"); R(g, sx + 8, sy + 5, 1, 4, "rgba(0,0,0,.2)"); }
    },
    cobble(g, sx, sy, tx, ty, fr, K, p) { // acciottolato
      R(g, sx, sy, 16, 16, p[1]);
      for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) { const x = sx + i * 5.4 + (j ? 2.6 : 0), y = sy + j * 8; R(g, x, y + 0.5, 5, 7, mix(p[0], p[1], hs(tx + i, ty + j) * 0.6)); R(g, x, y + 0.5, 5, 1, "rgba(255,255,255,.14)"); R(g, x, y + 7, 5, 1, "rgba(0,0,0,.25)"); }
    },
    grass(g, sx, sy, tx, ty, fr, K, p) { // prato con ciuffi
      R(g, sx, sy, 16, 16, p[hs(tx, ty) < 0.5 ? 0 : 1]);
      for (let i = 0; i < 6; i++) { const x = sx + hs(tx, ty, i) * 14, y = sy + hs(tx, ty, i + 9) * 12; R(g, x, y, 1, 3, "rgba(0,0,0,.16)"); R(g, x + 1, y + 1, 1, 2, "rgba(255,255,255,.1)"); }
      if (hs(tx, ty, 20) < 0.07) { C(g, sx + 4 + hs(tx, ty, 21) * 8, sy + 5 + hs(tx, ty, 22) * 6, 1.2, p[2] || "#ffe9a0"); }
    },
    mown(g, sx, sy, tx, ty, fr, K, p) { // prato tagliato a strisce
      R(g, sx, sy, 16, 16, p[Math.floor(tx / 2) % 2]);
      for (let i = 0; i < 4; i++) R(g, sx + hs(tx, ty, i) * 14, sy + hs(tx, ty, i + 4) * 14, 1, 2, "rgba(255,255,255,.07)");
      R(g, sx, sy + 15, 16, 1, "rgba(0,0,0,.05)");
    },
    gravel(g, sx, sy, tx, ty, fr, K, p) { // ghiaia
      R(g, sx, sy, 16, 16, p[(tx + ty) % 2]);
      for (let i = 0; i < 9; i++) { const x = sx + hs(tx, ty, i) * 14, y = sy + hs(tx, ty, i + 11) * 14; R(g, x, y, 2, 1, i % 2 ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.2)"); }
      if (K && K.ZX && K.ZX.under && (K.ZX.under[ty - 1] || [])[tx] !== ":") R(g, sx, sy, 16, 1, "rgba(0,0,0,.14)");
    },
    concrete(g, sx, sy, tx, ty, fr, K, p) { // cemento sporco
      R(g, sx, sy, 16, 16, p[(tx + ty) % 2]);
      R(g, sx, sy + 15, 16, 1, "rgba(0,0,0,.3)"); R(g, sx + 15, sy, 1, 16, "rgba(0,0,0,.24)");
      for (let i = 0; i < 4; i++) R(g, sx + hs(tx, ty, i) * 14, sy + hs(tx, ty, i + 6) * 14, 3, 2, "rgba(0,0,0,.1)");
      if (hs(tx, ty, 14) < 0.16) { g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 0.7; g.beginPath(); g.moveTo(sx + 3, sy + 2); g.lineTo(sx + 7, sy + 8); g.lineTo(sx + 6, sy + 14); g.stroke(); }
    },
    grate(g, sx, sy, tx, ty, fr, K, p) { // griglia metallica
      R(g, sx, sy, 16, 16, p[0]); for (let i = 0; i < 4; i++) { R(g, sx, sy + i * 4, 16, 1, p[1]); R(g, sx + i * 4, sy, 1, 16, p[1]); } R(g, sx, sy, 16, 1, "rgba(255,255,255,.16)");
    },
    sand(g, sx, sy, tx, ty, fr, K, p) { // sabbia con onde, sassi e ciuffi secchi
      R(g, sx, sy, 16, 16, p[(tx + ty) % 2]);
      if (hs(tx, ty, 40) < 0.5) R(g, sx + hs(tx, ty, 41) * 6, sy + hs(tx, ty, 42) * 6, 9, 7, "rgba(255,230,170,.07)");
      if (hs(tx, ty, 43) < 0.12) { const x = sx + 3 + hs(tx, ty, 44) * 9, y = sy + 8 + hs(tx, ty, 45) * 5; R(g, x, y, 3, 2, "#8a7a68"); R(g, x, y, 3, 1, "rgba(255,255,255,.25)"); R(g, x, y + 2, 4, 1, "rgba(0,0,0,.25)"); }
      if (hs(tx, ty, 46) < 0.1) { const x = sx + 4 + hs(tx, ty, 47) * 8, y = sy + 14; g.strokeStyle = "#7a6a3a"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 2, y - 4); g.moveTo(x, y); g.lineTo(x + 1, y - 5); g.moveTo(x, y); g.lineTo(x + 3, y - 3); g.stroke(); }
      for (let i = 0; i < 3; i++) { const y = sy + 3 + i * 5 + hs(tx, ty, i) * 2; g.strokeStyle = "rgba(0,0,0,.11)"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx, y); g.quadraticCurveTo(sx + 8, y - 2, sx + 16, y); g.stroke(); R(g, sx + hs(tx, ty, i + 5) * 14, y + 2, 2, 1, "rgba(255,255,255,.14)"); }
    },
    ash(g, sx, sy, tx, ty, fr, K, p) { // cenere e braci
      R(g, sx, sy, 16, 16, p[(tx + ty) % 2]);
      for (let i = 0; i < 6; i++) R(g, sx + hs(tx, ty, i) * 14, sy + hs(tx, ty, i + 7) * 14, 2, 1, "rgba(255,255,255,.07)");
      if (hs(tx, ty, 30) < 0.08) { const a = 0.35 + Math.sin(fr / 14 + tx + ty) * 0.2; R(g, sx + 5, sy + 7, 4, 2, `rgba(255,110,30,${a})`); R(g, sx + 6, sy + 8, 2, 1, `rgba(255,220,120,${a})`); }
    }
  };

  // ---- pareti ----
  const W = {
    // parete d'albergo: carta da parati damascata + boiserie + cornice dorata; finestra, quadro, applique a rotazione
    hotel(K, sx, sy, tx, ty, o) {
      const g = K.g, m = K.ZX.map, below = (m[ty + 1] || [])[tx], isFace = below !== "a" && below !== undefined, side = (m[ty] || [])[tx + 1] !== "a" && (m[ty] || [])[tx + 1] !== undefined;
      if (!isFace && !side) { R(g, sx, sy, 16, 16, o.cap[0]); R(g, sx, sy, 16, 1, o.cap[1]); return; }
      if (!isFace) { R(g, sx, sy, 16, 16, o.cap[0]); R(g, sx + 13, sy, 3, 16, o.paper); R(g, sx + 15, sy, 1, 16, o.trim); return; }
      R(g, sx, sy, 16, 16, o.paper);
      for (let i = 0; i < 16; i += 8) { R(g, sx + i + 3, sy + 2, 2, 5, o.damask); R(g, sx + i + 2, sy + 4, 4, 1, o.damask); }
      R(g, sx, sy + 9, 16, 7, o.wain); R(g, sx, sy + 9, 16, 1, o.trim); R(g, sx + 1, sy + 11, 14, 4, "rgba(0,0,0,.18)"); R(g, sx + 2, sy + 12, 12, 2, "rgba(255,255,255,.06)");
      R(g, sx, sy, 16, 1, o.trim); R(g, sx, sy + 8, 16, 1, "rgba(0,0,0,.25)");
      const k = (tx * 7 + ty) % 6;
      if (k === 1) { // finestra con tende
        R(g, sx + 2, sy + 1, 12, 9, "#3a2a1a"); R(g, sx + 3, sy + 2, 10, 8, o.sky); R(g, sx + 8, sy + 2, 1, 8, "#3a2a1a");
        if (o.night) { R(g, sx + 4, sy + 3, 1, 1, "#fff"); R(g, sx + 11, sy + 5, 1, 1, "#fff"); R(g, sx + 6, sy + 7, 1, 1, "#ffe9a0"); }
        R(g, sx + 1, sy + 1, 3, 9, o.curtain); R(g, sx + 12, sy + 1, 3, 9, o.curtain); R(g, sx + 1, sy + 1, 1, 9, "rgba(0,0,0,.25)");
      } else if (k === 3) { // quadro
        R(g, sx + 3, sy + 2, 10, 7, o.trim); R(g, sx + 4, sy + 3, 8, 5, o.art[(tx + ty) % o.art.length]); R(g, sx + 4, sy + 6, 8, 2, "rgba(0,0,0,.25)"); C(g, sx + 9, sy + 5, 1.3, "rgba(255,255,255,.5)");
      } else if (k === 5 || k === 0) { // applique con luce
        R(g, sx + 7, sy + 3, 2, 4, o.trim); R(g, sx + 6, sy + 2, 4, 2, "#fff3c0");
        if (K.light) K.light(sx + 8, sy + 5, 22, "255,220,150", 0.5);
      }
    }
  };

  // ---- decor: luce, polvere, vignetta, plachette ----
  const D = {
    plaque(g, txt, x, y, col) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(22,18,28,.88)"); R(g, x - w / 2, y + 2, w, 1, col || "#ffb347"); g.fillStyle = "#f6efe0"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; },
    motes(g, fr, n, rgb, a) { for (let i = 0; i < n; i++) { const x = (i * 83 + fr * (0.12 + (i % 3) * 0.06)) % 340 - 10, y = (i * 47 + Math.sin(fr / 40 + i) * 6 + fr * 0.05 * (i % 2 ? 1 : -1) + 400) % 210; g.fillStyle = `rgba(${rgb},${a * (0.5 + 0.5 * Math.sin(fr / 25 + i))})`; g.fillRect(x, y, 1.5, 1.5); } },
    vignette(g, a) { const gr = g.createRadialGradient(160, 100, 70, 160, 100, 210); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a || 0.4})`); g.fillStyle = gr; g.fillRect(0, 0, 320, 200); },
    beam(g, x, y, w, len, rgb, a) { const gr = g.createLinearGradient(x, y, x, y + len); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x + w / 2, y); g.lineTo(x + w * 1.1, y + len); g.lineTo(x - w * 1.1, y + len); g.fill(); }
  };

  window.__hd = {
    hs, R, C, mix, F, W, D,
    floor(K, f, sx, sy, tx, ty, table) { const fn = table && table[f]; if (!fn) return false; fn(K.g, sx, sy, tx, ty, Math.floor(performance.now() / 16), K); return true; }
  };
})();
