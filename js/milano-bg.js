// js/milano-bg.js - sfondi di «OPERAZIONE FUORIGIOCO NOIR · MILANO 1954» (320x200, pixel art, animati, con punti da toccare)
// Bastioni nella nebbia col tram 19, la Lucciola, l'Arena Civica sotto la pioggia, il Naviglio all'alba, la casa di ringhiera,
// la Questura di notte, Piazza della Scala sotto la neve, il palco e il foyer.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const D = (g, cx, cy, r, c) => { g.fillStyle = c; for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy))); g.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2, 1); } };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const bands = (g, W, y0, y1, cols) => { const n = cols.length, bh = (y1 - y0) / n; for (let i = 0; i < n; i++) R(g, 0, Math.round(y0 + i * bh), W, Math.ceil(bh) + 1, cols[i]); };
  const fog = (g, W, f, y0, n, a) => { for (let i = 0; i < n; i++) { const x = ((rnd(i) * 400 + f * (0.15 + rnd(i + 3) * 0.2)) % 420) - 60, y = y0 + rnd(i + 9) * 60; g.fillStyle = `rgba(210,215,225,${a})`; g.beginPath(); g.ellipse(x, y, 70 + rnd(i + 5) * 40, 10 + rnd(i + 7) * 8, 0, 0, 7); g.fill(); } };
  const rain = (g, W, H, f, n) => { g.strokeStyle = "rgba(170,190,220,.35)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < n; i++) { const x = (rnd(i) * W + f * 1.4) % W, y = (rnd(i + 40) * H + f * 6) % H; g.moveTo(x, y); g.lineTo(x - 2, y + 6); } g.stroke(); };
  const snow = (g, W, H, f, n) => { for (let i = 0; i < n; i++) { const x = (rnd(i) * (W + 20) + Math.sin(f / 40 + i) * 8) % (W + 20), y = (rnd(i + 70) * H + f * (0.3 + rnd(i + 9) * 0.5)) % H; R(g, x, y, 1 + (rnd(i + 3) > 0.7), 1 + (rnd(i + 3) > 0.7), "#ffffff"); } };
  // lampione a gas con l'alone
  const lamp = (g, x, y, h, f, on) => { R(g, x - 1, y - h, 3, h, "#1f2937"); R(g, x - 4, y - h - 8, 9, 8, "#111827"); R(g, x - 3, y - h - 7, 7, 6, on === false ? "#374151" : "#fde68a"); R(g, x - 5, y - h - 9, 11, 2, "#111827"); if (on !== false) GL(g, x, y - h - 4, 30 + Math.sin(f / 9 + x) * 2, "255,220,140", 0.35); };
  // facciata milanese a più piani con finestre accese a caso
  const facade = (g, x, y, w, h, wall, f, seed, lit) => { R(g, x, y, w, h, wall); R(g, x, y, w, 2, "rgba(255,255,255,.08)"); for (let r = 0; r < Math.floor((h - 8) / 16); r++) for (let c = 0; c < Math.floor((w - 6) / 12); c++) { const on = rnd(seed + r * 7 + c) < (lit == null ? 0.35 : lit), wx = x + 5 + c * 12, wy = y + 6 + r * 16; R(g, wx, wy, 7, 10, "#0b1020"); R(g, wx + 1, wy + 1, 5, 8, on ? "#fcd34d" : "#1e293b"); if (on) GL(g, wx + 3, wy + 5, 9, "255,200,110", 0.18); R(g, wx - 1, wy + 10, 9, 1, "rgba(0,0,0,.4)"); } };
  // tram a carrello verde-crema col numero e il trolley che fa scintille
  const tram = (g, x, y, f, n) => { R(g, x, y, 96, 30, "#365314"); R(g, x, y + 18, 96, 12, "#e7dcc0"); R(g, x, y + 28, 96, 2, "#1c1917"); for (let i = 0; i < 6; i++) { R(g, x + 6 + i * 15, y + 4, 11, 11, "#0f172a"); R(g, x + 7 + i * 15, y + 5, 9, 9, "#fcd34d"); GL(g, x + 11 + i * 15, y + 9, 10, "255,210,120", 0.18); } R(g, x + 80, y + 2, 14, 7, "#1c1917"); g.fillStyle = "#fde68a"; g.font = "bold 7px monospace"; g.fillText(String(n || 19), x + 82, y + 8); D(g, x + 18, y + 32, 4, "#111827"); D(g, x + 78, y + 32, 4, "#111827"); g.strokeStyle = "#1c1917"; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 48, y); g.lineTo(x + 62, y - 22); g.stroke(); if ((f >> 3) % 5 === 0) { GL(g, x + 62, y - 22, 12, "180,210,255", 0.7); R(g, x + 61, y - 23, 2, 2, "#ffffff"); } };
  const umbrellas = (g, x0, x1, y, f, cols) => { for (let x = x0, i = 0; x < x1; x += 7, i++) { const yy = y + (i % 3) * 3 + Math.round(Math.sin(f / 20 + i) * 0.6); g.fillStyle = cols[i % cols.length]; g.beginPath(); g.arc(x, yy, 4, Math.PI, 0); g.fill(); R(g, x, yy, 1, 3, "#111"); } };
  const SC = {
    mn_titolo(g, W, H, f) {
      bands(g, W, 0, 120, ["#0b1020", "#0f162a", "#141d33", "#1a253d", "#212d46", "#2a3650"]);
      // Porta Ticinese: l'arco neoclassico con le colonne
      R(g, 112, 40, 96, 92, "#3f4a5c"); R(g, 106, 34, 108, 10, "#4b5668"); R(g, 104, 30, 112, 5, "#5b667a"); for (let i = 0; i < 4; i++) { R(g, 116 + i * 26, 46, 8, 86, "#56627a"); R(g, 116 + i * 26, 46, 2, 86, "#6b7894"); }
      R(g, 140, 70, 40, 62, "#0b1020"); g.fillStyle = "#0b1020"; g.beginPath(); g.arc(160, 70, 20, Math.PI, 0); g.fill(); g.fillStyle = "#c9b98a"; g.font = "bold 6px monospace"; g.fillText("PORTA TICINESE", 126, 41);
      facade(g, 0, 58, 104, 80, "#2b3346", f, 3); facade(g, 220, 50, 100, 88, "#2a3042", f, 11);
      // l'insegna dell'Osteria
      R(g, 14, 104, 60, 12, "#7c2d12"); R(g, 14, 104, 60, 2, "#c2410c"); g.fillStyle = "#fde68a"; g.font = "bold 7px monospace"; g.fillText("OSTERIA DEL TRAM", 16, 113); GL(g, 44, 110, 26, "255,170,80", 0.25 + 0.05 * Math.sin(f / 7));
      R(g, 0, 132, W, 68, "#1f2633"); for (let x = 0; x < W; x += 10) for (let y = 136; y < 200; y += 6) R(g, x + ((y / 6) % 2) * 5, y, 9, 5, (x + y) % 3 ? "#262e3d" : "#2c3545");
      // binari e cavi aerei
      R(g, 0, 160, W, 2, "#9ca3af"); R(g, 0, 170, W, 2, "#9ca3af"); g.strokeStyle = "rgba(30,30,40,.9)"; g.beginPath(); g.moveTo(0, 96); g.lineTo(W, 92); g.stroke();
      const tx = ((f * 0.9) % 520) - 110; tram(g, tx, 128, f, 19);
      lamp(g, 92, 158, 44, f); lamp(g, 236, 158, 44, f);
      // il braciere di Gaspare e il fumo delle caldarroste
      R(g, 262, 172, 22, 10, "#3f3f46"); for (let i = 0; i < 5; i++) { const h = 3 + Math.abs(Math.sin(f / 4 + i * 1.7)) * 5; R(g, 264 + i * 4, 172 - h, 3, h, i % 2 ? "#f97316" : "#fbbf24"); } GL(g, 273, 170, 22, "255,140,60", 0.35);
      for (let i = 0; i < 4; i++) { const t = (f * 0.5 + i * 15) % 50; D(g, 273 + Math.sin(f / 15 + i) * 3, 164 - t, 2 + (t / 20 | 0), `rgba(200,200,210,${0.3 - t / 200})`); }
      // De Santis sotto il lampione: sagoma col cappello e la brace della sigaretta
      R(g, 84, 132, 14, 26, "#cbd5e1"); R(g, 82, 126, 18, 3, "#1f2937"); R(g, 86, 120, 10, 7, "#1f2937"); D(g, 91, 130, 3, "#d6c3a8"); R(g, 96, 131, 3, 1, "#e5e7eb"); D(g, 99, 131, 1, (f >> 4) % 2 ? "#f97316" : "#fbbf24");
      fog(g, W, f, 110, 7, 0.07); fog(g, W, f * 0.6, 150, 5, 0.06);
      VIG(g, W, H, 0.5);
    },
    mn_club(g, W, H, f) {
      R(g, 0, 0, W, H, "#1b0f1c"); for (let x = 0; x < W; x += 16) { R(g, x, 0, 8, 140, "#2a1530"); R(g, x + 8, 0, 8, 140, "#24112a"); }
      // tende di velluto e palco
      for (let i = 0; i < 6; i++) { R(g, i * 8, 0, 7, 150, i % 2 ? "#6b1d3a" : "#7f1d4a"); R(g, W - 48 + i * 8, 0, 7, 150, i % 2 ? "#6b1d3a" : "#7f1d4a"); }
      R(g, 60, 108, 200, 10, "#3a1a2a"); R(g, 60, 106, 200, 3, "#fbbf24");
      // l'insegna al neon che sfarfalla
      const on = Math.sin(f / 9) > -0.85 && (f % 97) > 4; g.fillStyle = on ? "#f0abfc" : "#6b2a6b"; g.font = "bold 13px 'Courier New', monospace"; g.fillText("★ LA LUCCIOLA ★", 102, 30); if (on) GL(g, 160, 26, 70, "240,170,250", 0.22);
      // Mara al microfono, in controluce
      GL(g, 160, 80, 46, "255,230,180", 0.25); R(g, 159, 70, 2, 36, "#9ca3af"); D(g, 160, 68, 3, "#d1d5db");
      g.fillStyle = "#0a0a0a"; g.beginPath(); g.moveTo(150, 106); g.lineTo(156, 66); g.lineTo(164, 66); g.lineTo(170, 106); g.fill(); D(g, 160, 60, 6, "#0a0a0a"); D(g, 160, 56, 7, "#e8d08a"); R(g, 166, 64, 3, 3, "#ef4444");
      // il pianoforte e Tullio
      R(g, 70, 82, 54, 24, "#0a0a0a"); R(g, 70, 82, 54, 3, "#27272a"); for (let k = 0; k < 12; k++) R(g, 74 + k * 4, 92, 3, 6, k % 3 ? "#f5f5f4" : "#0a0a0a"); D(g, 132, 82, 5, "#d6d3d1"); R(g, 127, 88, 10, 18, "#0a0a0a"); R(g, 129, 81, 7, 2, "#0a0a0a");
      // note musicali che salgono
      for (let i = 0; i < 4; i++) { const t = (f * 0.6 + i * 25) % 90; g.fillStyle = `rgba(253,230,138,${1 - t / 90})`; g.font = "9px serif"; g.fillText("♪", 96 + i * 8 + Math.sin(t / 10) * 4, 78 - t); }
      // tavolini con le candele e i clienti
      R(g, 0, 150, W, 50, "#140a16"); [[56, 168], [130, 178], [200, 170], [270, 180]].forEach(([x, y], i) => { D(g, x, y, 14, "#3a1d36"); R(g, x - 1, y - 8, 3, 6, "#fde68a"); GL(g, x, y - 8, 14, "255,200,120", 0.3 + 0.08 * Math.sin(f / 5 + i)); D(g, x - 18, y - 6, 5, "#0a0a0a"); D(g, x + 18, y - 6, 5, "#0a0a0a"); });
      for (let i = 0; i < 4; i++) { const x = ((f * 0.2 + i * 90) % 360) - 20; g.fillStyle = "rgba(180,160,200,.06)"; g.beginPath(); g.ellipse(x, 130 + i * 6, 60, 8, 0, 0, 7); g.fill(); }
      VIG(g, W, H, 0.55);
    },
    mn_stadio(g, W, H, f) {
      bands(g, W, 0, 60, ["#0b1020", "#111827", "#1a2233"]);
      // tribune piene di ombrelli
      R(g, 0, 40, W, 70, "#1e293b"); for (let r = 0; r < 6; r++) R(g, 0, 46 + r * 10, W, 2, "#334155"); for (let r = 0; r < 6; r++) umbrellas(g, 4 + (r % 2) * 3, W, 46 + r * 10, f, ["#0f172a", "#1f2937", "#374151", "#7f1d1d", "#1e3a8a"]);
      // i piloni dei riflettori
      [[24, 20], [296, 20]].forEach(([x, y]) => { R(g, x - 2, y, 4, 100, "#3f3f46"); R(g, x - 12, y - 10, 24, 12, "#27272a"); for (let k = 0; k < 4; k++) R(g, x - 10 + k * 6, y - 8, 4, 8, "#fef3c7"); GL(g, x, y - 4, 60, "255,245,200", 0.35); });
      const sw = Math.sin(f / 60) * 60; g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,245,200,.06)"; g.beginPath(); g.moveTo(24, 14); g.lineTo(150 + sw, 200); g.lineTo(230 + sw, 200); g.fill(); g.beginPath(); g.moveTo(296, 14); g.lineTo(100 - sw, 200); g.lineTo(170 - sw, 200); g.fill(); g.restore();
      // il campo nel fango
      R(g, 0, 110, W, 90, "#2c3a24"); for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(40,30,20,.6)"; g.beginPath(); g.ellipse(rnd(i) * W, 120 + rnd(i + 4) * 80, 10 + rnd(i + 2) * 14, 3, 0, 0, 7); g.fill(); }
      g.strokeStyle = "rgba(226,232,240,.45)"; g.lineWidth = 1.5; g.strokeRect(30, 122, 260, 74); g.beginPath(); g.moveTo(160, 122); g.lineTo(160, 196); g.stroke(); g.beginPath(); g.arc(160, 159, 14, 0, 7); g.stroke();
      // la porta con la rete di corda e il portiere che aspetta
      R(g, 140, 112, 40, 2, "#e5e7eb"); R(g, 140, 112, 2, 14, "#e5e7eb"); R(g, 178, 112, 2, 14, "#e5e7eb"); for (let k = 0; k < 6; k++) R(g, 142 + k * 6, 114, 1, 12, "rgba(220,220,220,.3)");
      D(g, 160, 118, 3, "#e8c39e"); R(g, 157, 121, 7, 8, "#7f1d1d"); R(g, 154, 122, 3, 2, "#e5e7eb"); R(g, 164, 122, 3, 2, "#e5e7eb");
      // fotografo col magnesio
      if ((f % 140) < 6) { GL(g, 52, 150, 50, "255,255,255", 0.8); } R(g, 48, 146, 8, 14, "#3f3f46"); R(g, 50, 142, 5, 4, "#111827");
      rain(g, W, H, f, 70); fog(g, W, f, 90, 4, 0.05);
      VIG(g, W, H, 0.5);
    },
    mn_naviglio(g, W, H, f) {
      bands(g, W, 0, 90, ["#5b6478", "#6e7688", "#838a98", "#9aa0aa", "#b3b6ba", "#c8c6c0"]);
      // case di ringhiera sui due lati, coi ballatoi e i panni stesi
      const ring = (x, y, w, h, wall, seed) => { facade(g, x, y, w, h, wall, f, seed, 0.15); for (let r = 1; r < 4; r++) { R(g, x, y + r * 16 - 2, w, 2, "#1c1917"); for (let k = 0; k < w; k += 3) R(g, x + k, y + r * 16 - 6, 1, 4, "#1c1917"); } for (let k = 0; k < 4; k++) { const px = x + 8 + k * 14 + Math.sin(f / 30 + k) * 1; R(g, px, y + 18, 6, 8, ["#f5f5f4", "#93c5fd", "#fca5a5", "#fde68a"][k]); } };
      ring(0, 40, 110, 70, "#a16207", 21); ring(210, 36, 110, 74, "#9a6a3a", 27); R(g, 0, 40, 110, 3, "#7c2d12"); R(g, 210, 36, 110, 3, "#7c2d12");
      // il ponte di ferro in fondo e le chiuse di Leonardo
      R(g, 110, 74, 100, 6, "#3f3f46"); for (let k = 0; k < 10; k++) R(g, 112 + k * 10, 66, 1, 8, "#3f3f46"); R(g, 110, 66, 100, 1, "#3f3f46");
      // l'acqua del Naviglio, verde-grigia, coi riflessi
      R(g, 0, 110, W, 50, "#3b5a5e"); for (let i = 0; i < 26; i++) { const x = (rnd(i) * W + f * 0.3) % W, y = 114 + rnd(i + 3) * 42; R(g, x, y, 8 + rnd(i + 5) * 10, 1, "rgba(220,230,230,.25)"); }
      // il barcone di Remo carico di sabbia
      const bx = 140 + Math.sin(f / 80) * 8; R(g, bx, 124, 90, 12, "#3f2a1a"); R(g, bx + 4, 116, 82, 8, "#c2a46a"); R(g, bx, 124, 90, 2, "#5a3a22"); R(g, bx + 80, 100, 2, 24, "#1c1917");
      // le alzaie in pietra e il lavatoio coperto
      R(g, 0, 160, W, 40, "#6b6258"); for (let x = 0; x < W; x += 12) R(g, x, 160, 11, 2, "#857b70"); R(g, 16, 140, 64, 22, "#57534e"); R(g, 12, 134, 72, 8, "#44403c"); R(g, 20, 150, 56, 10, "#3b5a5e"); for (let k = 0; k < 3; k++) D(g, 30 + k * 18, 148, 4, "#e7e5e4");
      // un mazzo di fiori sulla ringhiera dell'alzaia
      R(g, 250, 156, 40, 2, "#1c1917"); for (let k = 0; k < 6; k++) R(g, 252 + k * 7, 150, 1, 8, "#1c1917"); D(g, 268, 152, 4, "#f5f5f4"); D(g, 272, 150, 3, "#fca5a5"); R(g, 268, 154, 1, 6, "#365314");
      fog(g, W, f, 100, 6, 0.08);
      VIG(g, W, H, 0.35);
    },
    mn_ringhiera(g, W, H, f) {
      R(g, 0, 0, W, H, "#5b4636"); for (let x = 0; x < W; x += 18) R(g, x, 0, 1, 140, "#4a3a2c");
      R(g, 0, 140, W, 60, "#7a5a3a"); for (let y = 146; y < 200; y += 8) R(g, 0, y, W, 1, "#5a3e28");
      // la finestra sul ballatoio e i tetti nella nebbia
      R(g, 30, 30, 70, 60, "#2a1a10"); R(g, 34, 34, 62, 52, "#9aa0aa"); R(g, 64, 34, 3, 52, "#2a1a10"); R(g, 34, 58, 62, 3, "#2a1a10"); fog(g, 130, f, 50, 3, 0.15);
      // la macchina da cucire di Rosetta, con le camicie
      R(g, 150, 100, 90, 8, "#3a2a1a"); R(g, 156, 108, 4, 32, "#2a1a10"); R(g, 230, 108, 4, 32, "#2a1a10"); R(g, 176, 80, 40, 20, "#111827"); R(g, 206, 70, 8, 30, "#111827"); R(g, 180, 84, 20, 3, "#fbbf24"); const nd = (f >> 2) % 2; R(g, 210, 96 + nd, 1, 4, "#e5e7eb");
      for (let k = 0; k < 4; k++) R(g, 250 + k * 14, 50, 12, 40, "#f5f5f4"); R(g, 246, 48, 64, 2, "#3a2a1a");
      // la fotografia di Nando coi guanti, sul comò, e un lumino
      R(g, 110, 98, 30, 42, "#4a3020"); R(g, 116, 80, 18, 20, "#c8a050"); R(g, 118, 82, 14, 16, "#a8a29e"); D(g, 125, 87, 3, "#57534e"); R(g, 121, 91, 8, 6, "#57534e"); D(g, 125, 104, 2, "#fbbf24"); GL(g, 125, 102, 16, "255,190,90", 0.35 + 0.1 * Math.sin(f / 6));
      VIG(g, W, H, 0.45);
    },
    mn_questura(g, W, H, f) {
      R(g, 0, 0, W, H, "#1f2937"); for (let x = 0; x < W; x += 24) R(g, x, 0, 1, 140, "#111827");
      R(g, 0, 140, W, 60, "#3f3a33"); for (let x = 0; x < W; x += 20) R(g, x, 140, 10, 60, "#47413a");
      // scrivania, lampada verde, macchina da scrivere, fascicoli
      R(g, 70, 112, 180, 10, "#3a2a1a"); R(g, 76, 122, 6, 30, "#2a1a10"); R(g, 238, 122, 6, 30, "#2a1a10");
      R(g, 100, 92, 6, 20, "#14532d"); R(g, 92, 86, 22, 8, "#166534"); GL(g, 103, 98, 40, "220,255,200", 0.25);
      R(g, 140, 96, 44, 16, "#0a0a0a"); for (let k = 0; k < 8; k++) R(g, 144 + k * 5, 106, 3, 3, "#d6d3d1"); R(g, 150, 84, 24, 12, "#f5f5f4"); const ty = (f >> 3) % 6; R(g, 152, 86 + ty, 16, 1, "#111827");
      for (let k = 0; k < 4; k++) R(g, 200, 100 - k * 4, 34, 4, ["#a16207", "#78350f", "#57534e", "#a16207"][k]);
      // la finestra con le persiane e la luce del lampione fuori
      R(g, 220, 20, 70, 60, "#0b1020"); for (let k = 0; k < 10; k++) R(g, 220, 22 + k * 6, 70, 3, "#374151"); GL(g, 255, 50, 40, "255,220,140", 0.2);
      // il ritratto del Presidente e la penna d'oro di Vitali
      R(g, 30, 24, 40, 50, "#c8a050"); R(g, 33, 27, 34, 44, "#57534e"); D(g, 50, 42, 7, "#a8a29e"); R(g, 42, 52, 16, 14, "#1f2937"); R(g, 120, 108, 14, 2, "#fbbf24"); GL(g, 127, 108, 8, "255,220,120", 0.3 + 0.2 * Math.sin(f / 10));
      // fumo di sigaretta
      for (let i = 0; i < 5; i++) { const t = (f * 0.4 + i * 18) % 80; D(g, 230 + Math.sin(t / 8 + i) * 5, 104 - t, 2 + (t / 25 | 0), `rgba(200,200,210,${0.25 - t / 340})`); }
      VIG(g, W, H, 0.5);
    },
    mn_scala(g, W, H, f) {
      bands(g, W, 0, 70, ["#0b1020", "#101830", "#172140", "#1f2a4a"]);
      // la facciata del Teatro: portico, finestre accese, il timpano
      R(g, 50, 30, 220, 100, "#d6d0c4"); R(g, 50, 30, 220, 4, "#ece6da"); R(g, 130, 16, 60, 16, "#d6d0c4"); g.fillStyle = "#d6d0c4"; g.beginPath(); g.moveTo(126, 18); g.lineTo(160, 4); g.lineTo(194, 18); g.fill();
      for (let r = 0; r < 2; r++) for (let c = 0; c < 9; c++) { const x = 60 + c * 23, y = 40 + r * 26; R(g, x, y, 12, 18, "#3a2a20"); R(g, x + 1, y + 1, 10, 16, "#fcd34d"); GL(g, x + 6, y + 9, 14, "255,210,120", 0.25); }
      R(g, 50, 92, 220, 38, "#c8c0b2"); for (let c = 0; c < 8; c++) { R(g, 58 + c * 28, 96, 6, 34, "#e8e2d6"); R(g, 68 + c * 28, 100, 16, 30, "#2a1a10"); GL(g, 76 + c * 28, 116, 14, "255,200,120", 0.3); }
      g.fillStyle = "#3a2a20"; g.font = "bold 7px serif"; g.fillText("TEATRO ALLA SCALA", 124, 27);
      // la piazza innevata, le automobili nere e le carrozze, la gente in pelliccia
      R(g, 0, 130, W, 70, "#e8edf3"); for (let x = 0; x < W; x += 9) R(g, x, 134 + (x % 27) / 4, 6, 1, "rgba(150,165,190,.4)");
      const car = (x, c) => { R(g, x, 150, 40, 12, c); R(g, x + 8, 142, 22, 9, c); R(g, x + 10, 144, 8, 6, "#9ca3af"); R(g, x + 20, 144, 8, 6, "#9ca3af"); D(g, x + 8, 162, 4, "#0a0a0a"); D(g, x + 32, 162, 4, "#0a0a0a"); R(g, x + 38, 154, 3, 3, "#fde68a"); GL(g, x + 42, 155, 16, "255,240,180", 0.4); };
      car(((f * 0.5) % 420) - 60, "#0a0a0a"); car(230, "#1f2937");
      for (let i = 0; i < 9; i++) { const x = 20 + i * 34 + Math.sin(f / 50 + i) * 2, y = 170 + (i % 2) * 6; R(g, x, y, 8, 16, ["#1c1917", "#78350f", "#e7e5e4", "#4c1d95"][i % 4]); D(g, x + 4, y - 3, 3, "#e8c39e"); }
      lamp(g, 30, 168, 48, f); lamp(g, 292, 168, 48, f);
      snow(g, W, H, f, 70);
      VIG(g, W, H, 0.4);
    },
    mn_palco(g, W, H, f) {
      R(g, 0, 0, W, H, "#3a0f14"); // la sala vista dal palco: ordini di palchi dorati e il lampadario
      for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) { const x = c * 28 - 4, y = 10 + r * 30; R(g, x, y, 26, 26, "#5a1a20"); R(g, x + 2, y + 2, 22, 20, "#1c0508"); R(g, x, y + 22, 26, 4, "#c8a050"); if (rnd(r * 12 + c) < 0.5) { D(g, x + 9, y + 12, 3, "#e8c39e"); D(g, x + 17, y + 13, 3, "#e8c39e"); } }
      const sw = Math.sin(f / 80) * 2; R(g, 159, 0, 2, 40 + sw, "#c8a050"); for (let k = 0; k < 7; k++) { D(g, 140 + k * 7, 46 + sw + Math.abs(k - 3) * -1, 3, "#fde68a"); } GL(g, 160, 48, 70, "255,230,170", 0.3);
      // il parapetto del palco in velluto rosso, il binocolo e il programma di sala
      R(g, 0, 150, W, 50, "#7f1d1d"); R(g, 0, 150, W, 5, "#c8a050"); for (let k = 0; k < W; k += 6) R(g, k, 156, 1, 44, "rgba(0,0,0,.2)");
      R(g, 60, 140, 20, 10, "#c8a050"); D(g, 64, 144, 4, "#1c1917"); D(g, 76, 144, 4, "#1c1917");
      R(g, 220, 136, 30, 16, "#f5f5f4"); g.fillStyle = "#7f1d1d"; g.font = "bold 5px serif"; g.fillText("LA VESTALE", 222, 146);
      VIG(g, W, H, 0.5);
    },
  };
  const HOT = {
    mn_titolo: [[110, 30, 100, 100, "🏛️ Porta Ticinese: archi, colonne e la nebbia che ci si siede sopra. Da qui partiva il dazio. Adesso parte il 19."], [10, 100, 70, 30, "🍷 L'Osteria del Tram: rosso novello, minestrone, la radio sulla Domenica Sportiva. E Battista, che non ha mai sentito niente."], [80, 115, 24, 45, "🕵️ Un uomo sotto il lampione: impermeabile chiaro, sigaretta accesa e mai fumata."], [258, 160, 30, 26, "🌰 Le caldarroste di Gaspare: dieci lire al cartoccio, e la mano calda per mezz'ora."], [0, 125, 320, 40, "🚋 Il 19: verde e crema, il trolley che sputa scintille. Ultima corsa alle 23:40. Quasi sempre."]],
    mn_club: [[100, 14, 120, 24, "✨ LA LUCCIOLA: l'insegna perde una lettera ogni tanto. Quando perde la L, sembra un'altra cosa."], [140, 50, 40, 60, "🎤 Mara al microfono. Canta in milanese, e chi non capisce le parole capisce lo stesso."], [64, 76, 80, 32, "🎹 Il pianoforte del Maestro Tullio. Suona a memoria, e la memoria non sbaglia mai una nota."], [30, 150, 260, 40, "🥂 I tavolini riservati: candele, vermouth, mazzette passate sotto il tovagliolo come se niente fosse."]],
    mn_stadio: [[0, 40, 320, 70, "☂️ Cinquantamila ombrelli. Sotto ognuno, uno che ha pagato il biglietto per vedere una partita vera."], [8, 0, 40, 120, "💡 I piloni dei riflettori: quattro lampade per pilone, una sempre fulminata."], [138, 108, 44, 24, "🧤 La porta dei Ferrovieri. Nando ci si mette davanti come davanti a casa sua."], [40, 138, 22, 26, "📸 Rino «Flash» col magnesio: un lampo e la verità resta lì, in bianco e nero."]],
    mn_naviglio: [[0, 40, 110, 70, "🏘️ Le case di ringhiera: ballatoi lunghi, una latrina per piano, tutti sanno tutto di tutti."], [140, 96, 90, 40, "⛵ Il barcone di Remo: sabbia del Ticino per i cantieri della ricostruzione. Acciaio di Balestrini, sabbia di Remo."], [12, 132, 74, 30, "🧺 Il lavatoio coperto del Vicolo. È qui che Teresa, la mattina del 17, ha smesso di cantare."], [246, 140, 50, 22, "💐 Un mazzo di fiori sulla ringhiera. Nessun biglietto. Non serve."]],
    mn_ringhiera: [[100, 76, 50, 66, "🕯️ La foto di Nando coi guanti, e un lumino. Rosetta lo cambia ogni mattina."], [150, 66, 90, 74, "🧵 La macchina da cucire. Quaranta camicie al giorno, a cottimo. Le dita bucate."], [30, 30, 70, 60, "🪟 La finestra sul ballatoio: tetti, nebbia, e il campanile di San Lorenzo che si vede solo quando smette di piovere."]],
    mn_questura: [[60, 80, 70, 40, "💡 La lampada verde della Squadra Mobile. Accesa ventiquattro ore: risparmiano sulle lampadine, non sulle notti."], [138, 80, 50, 32, "⌨️ La macchina da scrivere di Scotti: batte con due dita, ma batte forte."], [110, 100, 30, 14, "🖋️ La penna d'oro del Questore. Regalo di un amico, dice lui. Gli amici fanno regali così."], [215, 15, 80, 70, "🪟 Fuori, la città. Dentro, i fascicoli che la città non vuole leggere."]],
    mn_scala: [[50, 4, 220, 90, "🎭 La Scala, sera di Sant'Ambrogio: la prima della stagione. Mezza Milano è dentro, l'altra mezza è fuori a guardare chi entra."], [0, 140, 320, 40, "🚗 Automobili nere, pellicce, cilindri. E un poliziotto in borghese per ogni colonna, stasera."], [280, 110, 30, 60, "🏮 I lampioni della piazza: la neve ci gira intorno come le falene."]],
    mn_palco: [[0, 0, 320, 130, "🎟️ Sei ordini di palchi d'oro e velluto. Da qui sopra, si vede chi guarda il palcoscenico e chi guarda gli altri palchi."], [140, 0, 40, 70, "💎 Il lampadario: trecentosessantacinque lampadine, una per ogni giorno in cui qualcuno qui dentro ha mentito."], [210, 130, 50, 26, "📜 Il programma di sala: «La Vestale». Una sacerdotessa che lascia spegnere il fuoco sacro. Viene sepolta viva. Poi la salvano. A volte."]],
  };
  // alias: gli interni e le zone usano gli stessi sfondi
  const ALIAS = { mn_bastioni: "mn_titolo", mn_lucciola: "mn_club", mn_arena: "mn_stadio", mn_alzaia: "mn_naviglio", mn_piazza: "mn_scala", mn_foyer: "mn_palco" };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) { Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] })); Object.keys(ALIAS).forEach((k) => B.register(k, { draw: SC[ALIAS[k]], hot: HOT[ALIAS[k]] || [] })); }
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
  window.__mnBg = { SC, HOT };
})();
