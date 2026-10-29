// js/banda-bg.js - sfondi di «BANDA DI PIAZZA» (320x200), animati, con i punti da toccare: titolo, piazza, sala prove, trattoria, corso sotto la pioggia,
// casa di Zio Ciro, stadio, sottotribuna, cabina audio, colle del cimitero, archivio della canonica, Venezia, retropalco del teatro, locanda.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const stars = (g, W, n, f, h) => { for (let i = 0; i < n; i++) R(g, rnd(i + 3) * W, rnd(i + 20) * (h || 90), 1, 1, `rgba(255,255,255,${0.3 + 0.35 * Math.sin(f / 18 + i)})`); };
  const notes = (g, f, x0, y0, n, col) => { g.font = "10px serif"; g.textAlign = "center"; for (let i = 0; i < n; i++) { const t = (f * 0.6 + i * 37) % 120; g.globalAlpha = Math.max(0, 1 - t / 120); g.fillStyle = col || "#fde68a"; g.fillText(i % 2 ? "♪" : "♫", x0 + Math.sin((f + i * 30) / 25) * 14 + i * 9, y0 - t * 0.7); } g.globalAlpha = 1; };
  const rain = (g, W, f, a) => { g.strokeStyle = `rgba(186,210,240,${a || 0.35})`; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 70; i++) { const x = (i * 47 + f * 1.6) % 340 - 10, y = (i * 71 + f * 6) % 210 - 5; g.moveTo(x, y); g.lineTo(x - 2, y + 8); } g.stroke(); };
  const bunting = (g, W, y, f) => { g.strokeStyle = "rgba(0,0,0,.4)"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, y); g.quadraticCurveTo(W / 2, y + 16, W, y); g.stroke(); for (let i = 0; i < 16; i++) { const x = 10 + i * 20, yy = y + Math.sin((x / W) * Math.PI) * 8 + 1; T(g, [x - 5, yy, x + 5, yy, x + Math.sin(f / 10 + i), yy + 9], ["#dc2626", "#f8fafc", "#16a34a", "#facc15"][i % 4]); } };
  const houseRow = (g, f, y, n, night) => { for (let i = 0; i < n; i++) { const x = i * (320 / n), w = 320 / n - 2, h = 60 + (i % 3) * 14; R(g, x, y - h, w, h, ["#e7c9a0", "#d9a77a", "#f0d9b5", "#c98a5c", "#e8b98a"][i % 5]); T(g, [x - 2, y - h, x + w / 2, y - h - 14, x + w + 2, y - h], "#9a3412"); for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) { const lit = night && (i + j + k) % 3 !== 0; R(g, x + 8 + j * (w / 2 - 4), y - h + 12 + k * 22, 10, 13, lit ? `rgba(253,224,71,${0.7 + 0.2 * Math.sin(f / 30 + i + j)})` : "#475569"); R(g, x + 6 + j * (w / 2 - 4), y - h + 25 + k * 22, 14, 2, "#7c2d12"); } } };
  const bandsman = (g, x, y, s, col, inst, f, i) => { g.save(); g.translate(x, y + Math.abs(Math.sin(f / 8 + i)) * -2); g.scale(s, s); R(g, -5, -22, 10, 16, col || "#7f1d1d"); R(g, -5, -7, 4, 8, "#111827"); R(g, 1, -7, 4, 8, "#111827"); C(g, 0, -27, 5, "#e8c4a0"); R(g, -6, -33, 12, 4, "#111827"); R(g, -4, -36, 8, 3, col || "#7f1d1d"); R(g, -3, -37, 6, 1, "#facc15");
    if (inst === "tromba") { R(g, 3, -24, 10, 2, "#facc15"); T(g, [13, -27, 17, -29, 17, -19, 13, -21], "#facc15"); } else if (inst === "cassa") { C(g, 0, -14, 8, "#b91c1c"); C(g, 0, -14, 6, "#f1f5f9"); } else if (inst === "piatti") { g.fillStyle = "#facc15"; g.beginPath(); g.ellipse(-9, -18, 3, 7, 0.3, 0, 7); g.ellipse(9, -18, 3, 7, -0.3, 0, 7); g.fill(); } else if (inst === "clarinetto") { R(g, 1, -24, 2, 16, "#111827"); } else { C(g, 6, -16, 6, "#ca8a04"); R(g, 4, -30, 3, 12, "#ca8a04"); }
    g.restore(); };
  const SC = {
    bp_titolo(g, W, H, f) {
      VG(g, 0, 140, "#fb923c", "#fde68a"); g.fillRect(0, 0, W, 140); C(g, 250, 60, 22, "#fef3c7"); GL(g, 250, 60, 70, "254,240,138", 0.45);
      R(g, 0, 120, W, 26, "#0e7490"); for (let i = 0; i < 20; i++) R(g, (i * 41 + f * 0.3) % 340 - 10, 124 + (i % 4) * 5, 12, 1, "rgba(255,255,255,.35)");
      houseRow(g, f, 132, 7, false); bunting(g, W, 34, f);
      R(g, 0, 140, W, 60, "#b8aa94"); for (let x = 0; x < W; x += 14) for (let y = 140; y < 200; y += 9) R(g, x + ((y / 9) % 2) * 7, y, 13, 8, "rgba(0,0,0,.08)");
      ["cassa", "tromba", "clarinetto", "piatti", "bombardino"].forEach((k, i) => bandsman(g, 70 + i * 44, 188, 1.6, "#7f1d1d", k, f, i));
      notes(g, f, 150, 150, 8, "#7f1d1d");
      g.textAlign = "center"; g.font = "900 26px Georgia, serif"; g.fillStyle = "#7f1d1d"; g.fillText("BANDA DI PIAZZA", W / 2, 30); g.font = "italic 700 10px Georgia, serif"; g.fillStyle = "#451a03"; g.fillText("Borgo Marino · dal 1950", W / 2, 44);
      VIG(g, W, H, 0.3);
    },
    bp_piazza(g, W, H, f) {
      VG(g, 0, 120, "#1e3a8a", "#fb923c"); g.fillRect(0, 0, W, 120); stars(g, W, 20, f, 50);
      R(g, 130, 20, 50, 100, "#e7d7b5"); T(g, [126, 20, 155, 0, 184, 20], "#7f1d1d"); R(g, 148, 34, 14, 22, "#1e293b"); C(g, 155, 34, 7, "#1e293b"); C(g, 155, 70, 6, "#fef3c7"); R(g, 154, 66, 2, 4, "#111827");
      houseRow(g, f, 124, 5, true); R(g, 130, 20, 50, 104, "rgba(231,215,181,.95)"); R(g, 145, 90, 20, 34, "#7c2d12");
      R(g, 0, 124, W, 76, "#a89a84"); for (let x = 0; x < W; x += 14) for (let y = 124; y < 200; y += 9) R(g, x + ((y / 9) % 2) * 7, y, 13, 8, "rgba(0,0,0,.07)");
      // cassa armonica
      R(g, 210, 150, 70, 10, "#9a6b3d"); for (let i = 0; i < 6; i++) R(g, 212 + i * 13, 118, 2, 32, "#e5e7eb"); T(g, [204, 120, 245, 96, 286, 120], "#14532d"); for (let i = 0; i < 8; i++) C(g, 208 + i * 10, 121, 1.4, `rgba(250,204,21,${0.6 + 0.3 * Math.sin(f / 8 + i)})`);
      // fontana
      R(g, 60, 160, 60, 12, "#a8a29e"); R(g, 64, 156, 52, 6, "#2f7fb5"); R(g, 88, 136, 4, 22, "#cbd5e1"); for (let i = 0; i < 8; i++) { const a = (f / 4 + i * 3) % 18; C(g, 90 + Math.sin(i) * 4, 136 + a, 1, `rgba(186,230,253,${0.8 - a / 22})`); }
      for (let i = 0; i < 4; i++) { R(g, 20 + i * 90, 126, 2, 30, "#1f2937"); C(g, 21 + i * 90, 124, 4, "#fde68a"); GL(g, 21 + i * 90, 124, 26, "253,224,71", 0.4); }
      VIG(g, W, H, 0.35);
    },
    bp_sala(g, W, H, f) {
      VG(g, 0, 200, "#3b2414", "#1c100a"); g.fillRect(0, 0, W, 200); for (let x = 0; x < W; x += 20) R(g, x, 0, 1, 130, "rgba(0,0,0,.25)");
      R(g, 0, 130, W, 70, "#5b3a22"); for (let x = 0; x < W; x += 26) R(g, x, 130, 1, 70, "rgba(0,0,0,.3)");
      R(g, 120, 14, 80, 10, "#1f2937"); g.font = "700 7px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#fde68a"; g.fillText("SALA PROVE · BANDA CITTÀ DI BORGO MARINO", 160, 21);
      C(g, 160, 50, 4, "#fde68a"); R(g, 159, 24, 2, 22, "#111827"); GL(g, 160, 54, 60, "253,224,71", 0.35);
      for (let i = 0; i < 6; i++) { const x = 40 + i * 48; R(g, x + 7, 120, 2, 30, "#111827"); T(g, [x - 4, 100, x + 20, 100, x + 18, 118, x - 2, 118], "#111827"); R(g, x, 103, 16, 12, "#f8fafc"); }
      R(g, 20, 40, 60, 40, "#1e293b"); R(g, 22, 42, 56, 36, "#e2e8f0"); g.fillStyle = "#334155"; g.font = "6px Georgia"; g.textAlign = "left"; ["PRESENZE", "Rocco ✓", "Lilli ✓", "Don Abele ✓", "Ciro —"].forEach((t, i) => g.fillText(t, 26, 50 + i * 6));
      C(g, 270, 160, 18, "#b91c1c"); C(g, 270, 160, 14, "#f1f5f9"); R(g, 262, 158, 16, 3, "#1e3a8a");
      // metronomo che oscilla
      R(g, 232, 70, 16, 26, "#7c4a2a"); const a = Math.sin(f / 10) * 0.5; g.save(); g.translate(240, 94); g.rotate(a); R(g, -1, -22, 2, 22, "#e2e8f0"); R(g, -3, -16, 6, 3, "#facc15"); g.restore();
      VIG(g, W, H, 0.4);
    },
    bp_trattoria(g, W, H, f) {
      VG(g, 0, 200, "#7c2d12", "#431407"); g.fillRect(0, 0, W, 200); R(g, 0, 0, W, 110, "#e8d5b0"); for (let x = 0; x < W; x += 16) R(g, x, 0, 1, 110, "rgba(120,80,40,.15)");
      R(g, 0, 110, W, 8, "#7c4a2a"); R(g, 0, 118, W, 82, "#9a6b3d");
      R(g, 30, 30, 70, 50, "#5b3a22"); R(g, 34, 34, 62, 42, "#e2e8f0"); for (let i = 0; i < 5; i++) bandsman(g, 42 + i * 12, 74, 0.7, "#7f1d1d", ["cassa", "tromba", "piatti", "clarinetto", "bombardino"][i], 0, i); g.font = "700 6px Georgia"; g.textAlign = "center"; g.fillStyle = "#451a03"; g.fillText("BANDA 1972 · VENEZIA", 65, 88);
      R(g, 180, 60, 110, 70, "#5b3a22"); R(g, 180, 56, 110, 6, "#7c4a2a"); R(g, 210, 40, 30, 18, "#334155"); for (let i = 0; i < 4; i++) C(g, 220 + Math.sin(f / 14 + i) * 4, 36 - ((f / 3 + i * 9) % 30), 3, `rgba(241,245,249,${0.35 - i * 0.07})`);
      for (let i = 0; i < 6; i++) { R(g, 186 + i * 17, 20, 10, 14, ["#7f1d1d", "#166534", "#a16207"][i % 3]); R(g, 189 + i * 17, 16, 4, 4, "#d6d3d1"); }
      R(g, 60, 150, 90, 6, "#f8fafc"); for (let i = 0; i < 9; i++) R(g, 60 + i * 10, 150, 5, 6, "#dc2626");
      C(g, 90, 146, 7, "#f1f5f9"); C(g, 90, 146, 5, "#b91c1c"); C(g, 120, 146, 7, "#f1f5f9"); C(g, 120, 146, 5, "#b91c1c");
      GL(g, 160, 30, 80, "255,190,110", 0.3); VIG(g, W, H, 0.35);
    },
    bp_corso(g, W, H, f) {
      VG(g, 0, 200, "#1e293b", "#475569"); g.fillRect(0, 0, W, 200); houseRow(g, f, 140, 6, true);
      R(g, 0, 140, W, 60, "#334155"); for (let i = 0; i < 12; i++) R(g, i * 28 + ((f * 0.5) % 28), 168, 12, 1, "rgba(186,210,240,.25)");
      // la processione: il santo sotto il baldacchino e la banda
      R(g, 140, 96, 40, 4, "#facc15"); for (let i = 0; i < 4; i++) R(g, 142 + i * 12, 100, 2, 40, "#e5e7eb"); C(g, 160, 118, 8, "#e7d7b5"); R(g, 154, 124, 12, 16, "#7c2d12");
      ["cassa", "tromba", "clarinetto", "piatti"].forEach((k, i) => bandsman(g, 40 + i * 26 + (f * 0.2) % 6, 180, 1.2, "#7f1d1d", k, f, i));
      for (let i = 0; i < 5; i++) { const x = 220 + i * 18; R(g, x - 1, 150, 2, 22, "#111827"); T(g, [x - 10, 152, x + 10, 152, x, 142], ["#1d4ed8", "#dc2626", "#111827"][i % 3]); }
      rain(g, W, f, 0.4); VIG(g, W, H, 0.4);
    },
    bp_casaciro(g, W, H, f) {
      VG(g, 0, 200, "#3f3428", "#1c1610"); g.fillRect(0, 0, W, 200); R(g, 0, 130, W, 70, "#57493a");
      R(g, 200, 26, 80, 60, "#1e3a5f"); R(g, 204, 30, 72, 52, `rgba(125,170,220,${0.5 + 0.1 * Math.sin(f / 40)})`); R(g, 238, 26, 4, 60, "#3f3428"); R(g, 200, 54, 80, 4, "#3f3428"); for (let i = 0; i < 6; i++) R(g, 210 + ((i * 37 + f * 0.2) % 60), 70 + (i % 2) * 4, 8, 1, "rgba(255,255,255,.4)");
      R(g, 40, 100, 90, 34, "#5b3a22"); R(g, 46, 92, 78, 10, "#7c4a2a"); g.fillStyle = "#111827"; g.beginPath(); g.ellipse(85, 96, 30, 6, 0, 0, 7); g.fill(); R(g, 60, 92, 50, 6, "#7f1d1d"); R(g, 70, 90, 30, 3, "#facc15");
      R(g, 150, 40, 30, 38, "#a8a29e"); R(g, 153, 43, 24, 32, "#e7e5e4"); C(g, 165, 56, 7, "#d9a679"); R(g, 158, 64, 14, 10, "#1e3a8a"); R(g, 162, 46, 6, 3, "#3b2a1a");
      C(g, 165, 86, 3, "#fde68a"); GL(g, 165, 84, 22, "253,224,71", 0.5 + 0.15 * Math.sin(f / 7));
      R(g, 20, 40, 100, 4, "#7c4a2a"); for (let i = 0; i < 4; i++) R(g, 26 + i * 24, 26, 14, 14, ["#0e7490", "#7f1d1d", "#a16207", "#166534"][i]);
      VIG(g, W, H, 0.5);
    },
    bp_stadio(g, W, H, f) {
      VG(g, 0, 120, "#0b1530", "#1e3a5f"); g.fillRect(0, 0, W, 120); stars(g, W, 30, f, 40);
      for (let i = 0; i < 3; i++) { R(g, 30 + i * 130, 10, 6, 60, "#64748b"); R(g, 20 + i * 130, 4, 26, 8, "#e5e7eb"); GL(g, 33 + i * 130, 10, 50, "255,255,220", 0.4); }
      R(g, 0, 60, W, 60, "#172554"); for (let i = 0; i < 220; i++) R(g, (i * 29) % W, 62 + ((i * 13) % 54), 3, 3, ["#dc2626", "#facc15", "#e2e8f0", "#1e40af"][i % 4]); for (let i = 0; i < 10; i++) R(g, i * 34 + Math.sin(f / 10 + i) * 3, 58, 2, 10, "#facc15");
      R(g, 0, 120, W, 80, "#166534"); for (let x = 0; x < W; x += 40) R(g, x, 120, 20, 80, "rgba(255,255,255,.05)"); R(g, 0, 150, W, 2, "rgba(255,255,255,.5)");
      R(g, 250, 92, 40, 58, "#0f172a"); for (let i = 0; i < 3; i++) C(g, 270, 104 + i * 17, 7, "#1e293b"); C(g, 270, 104, 2 + Math.abs(Math.sin(f / 5)) * 2, "#38bdf8"); GL(g, 270, 104, 30, "56,189,248", 0.3);
      ["cassa", "tromba", "piatti", "clarinetto"].forEach((k, i) => bandsman(g, 40 + i * 24, 186, 1.1, "#7f1d1d", k, f, i)); notes(g, f, 70, 168, 5);
      VIG(g, W, H, 0.35);
    },
    bp_sottotribuna(g, W, H, f) {
      VG(g, 0, 200, "#27272a", "#18181b"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 8; i++) T(g, [i * 44, 0, i * 44 + 44, 0, i * 44 + 44, 26 + i * 3], "#3f3f46");
      R(g, 0, 140, W, 60, "#3f3f46"); for (let x = 0; x < W; x += 20) R(g, x, 140, 1, 60, "rgba(0,0,0,.3)");
      for (let i = 0; i < 6; i++) { R(g, 30 + i * 46, 70, 30, 70, "#52525b"); R(g, 32 + i * 46, 74, 26, 8, "#7f1d1d"); C(g, 45 + i * 46, 100, 4, "#a1a1aa"); }
      R(g, 140, 30, 2, 20, "#a1a1aa"); C(g, 141, 52, 4, `rgba(253,224,71,${0.7 + 0.2 * Math.sin(f / 4)})`); GL(g, 141, 54, 50, "253,224,71", 0.3);
      g.fillStyle = "rgba(212,212,216,.6)"; g.font = "700 8px system-ui"; g.textAlign = "center"; g.fillText("SPOGLIATOIO OSPITI → ", 250, 130);
      for (let i = 0; i < 3; i++) R(g, 100 + i * 50, 132 + Math.abs(Math.sin(f / 6 + i)) * -3, 4, 4, "rgba(212,212,216,.4)");
      VIG(g, W, H, 0.5);
    },
    bp_regia(g, W, H, f) {
      VG(g, 0, 200, "#0f172a", "#020617"); g.fillRect(0, 0, W, 200); R(g, 0, 40, W, 70, "#1e3a5f"); R(g, 6, 44, W - 12, 62, `rgba(56,189,248,${0.15 + 0.05 * Math.sin(f / 20)})`);
      for (let i = 0; i < 160; i++) R(g, (i * 23) % (W - 20) + 10, 70 + ((i * 7) % 30), 2, 2, ["#dc2626", "#facc15", "#e2e8f0"][i % 3]);
      R(g, 20, 120, 280, 40, "#1f2937"); for (let i = 0; i < 24; i++) { const h = 6 + Math.abs(Math.sin(f / 6 + i * 0.7)) * 16; R(g, 30 + i * 11, 152 - h, 6, h, i % 6 === 0 ? "#ef4444" : "#22c55e"); }
      for (let i = 0; i < 8; i++) { R(g, 40 + i * 30, 166, 6, 24, "#334155"); R(g, 38 + i * 30, 172 + Math.sin(f / 15 + i) * 6, 10, 5, "#e2e8f0"); }
      g.font = "900 10px system-ui"; g.textAlign = "center"; g.fillStyle = "#38bdf8"; g.fillText("SUONOSMART · AUDIO PER STADI", 160, 30);
      VIG(g, W, H, 0.4);
    },
    bp_colle(g, W, H, f) {
      VG(g, 0, 130, "#7c2d12", "#fdba74"); g.fillRect(0, 0, W, 130); C(g, 70, 96, 24, "#fef3c7"); GL(g, 70, 96, 80, "254,215,170", 0.5);
      R(g, 0, 108, W, 30, "#0e7490"); for (let i = 0; i < 16; i++) R(g, (i * 43 + f * 0.25) % 340 - 10, 112 + (i % 4) * 5, 12, 1, `rgba(255,237,213,${0.4 + 0.2 * Math.sin(f / 20 + i)})`);
      T(g, [0, 200, 0, 132, 120, 118, 320, 140, 320, 200], "#4d5b2a"); T(g, [0, 200, 0, 150, 160, 136, 320, 160, 320, 200], "#3f4a22");
      for (let i = 0; i < 7; i++) { const x = 150 + i * 24, y = 150 - i * 1.5; R(g, x, y, 10, 14, "#d6d3d1"); C(g, x + 5, y, 5, "#d6d3d1"); }
      for (let i = 0; i < 3; i++) { const x = 260 + i * 20; T(g, [x, 80, x + 6, 140, x - 6, 140], "#14532d"); }
      R(g, 286, 40, 14, 60, "#f8fafc"); R(g, 284, 36, 18, 6, "#7f1d1d"); C(g, 293, 32, 5, `rgba(253,224,71,${0.6 + 0.4 * Math.sin(f / 10)})`); GL(g, 293, 32, 40, "253,224,71", 0.35);
      VIG(g, W, H, 0.35);
    },
    bp_archivio(g, W, H, f) {
      VG(g, 0, 200, "#3b2f22", "#1c1610"); g.fillRect(0, 0, W, 200); R(g, 0, 150, W, 50, "#4a3a2a");
      for (let s = 0; s < 3; s++) { R(g, 10, 30 + s * 40, 180, 4, "#7c4a2a"); for (let i = 0; i < 16; i++) R(g, 14 + i * 11, 6 + s * 40 + (i % 3) * 2, 9, 24 - (i % 3) * 2, ["#7f1d1d", "#1e3a5f", "#a16207", "#166534", "#57534e"][(i + s) % 5]); }
      R(g, 210, 100, 90, 50, "#5b3a22"); R(g, 216, 92, 80, 10, "#7c4a2a"); R(g, 222, 84, 40, 10, "#f5f0e1"); R(g, 268, 86, 24, 8, "#e7e2d0");
      R(g, 250, 40, 6, 40, "#1f2937"); C(g, 253, 38, 5, `rgba(253,224,71,${0.7 + 0.2 * Math.sin(f / 6)})`); GL(g, 253, 40, 60, "253,224,71", 0.4);
      for (let i = 0; i < 14; i++) { const t = (f * 0.3 + i * 23) % 200; R(g, 220 + Math.sin(t / 20 + i) * 30, 200 - t, 1, 1, "rgba(253,230,138,.5)"); }
      VIG(g, W, H, 0.5);
    },
    bp_venezia(g, W, H, f) {
      VG(g, 0, 120, "#7dd3fc", "#fde68a"); g.fillRect(0, 0, W, 120);
      for (let i = 0; i < 6; i++) { const x = i * 56; R(g, x, 40 - (i % 2) * 10, 52, 90, ["#c2693b", "#e8b98a", "#b45309", "#d9a77a", "#c98a5c", "#e7c9a0"][i]); for (let j = 0; j < 3; j++) { g.fillStyle = "#1e293b"; g.beginPath(); g.arc(x + 10 + j * 15, 60 - (i % 2) * 10, 4, Math.PI, 0); g.fill(); R(g, x + 6 + j * 15, 60 - (i % 2) * 10, 8, 12, "#1e293b"); } }
      R(g, 0, 130, W, 70, "#2f7f8f"); for (let i = 0; i < 26; i++) R(g, (i * 37 + f * 0.5) % 340 - 10, 136 + (i % 6) * 10, 14, 1, "rgba(255,255,255,.4)");
      g.strokeStyle = "#e7e2d8"; g.lineWidth = 8; g.beginPath(); g.arc(160, 156, 60, Math.PI, 0); g.stroke(); R(g, 96, 150, 128, 6, "#e7e2d8");
      const gx = ((f * 0.4) % 400) - 60; g.fillStyle = "#0f0f10"; g.beginPath(); g.moveTo(gx, 176); g.quadraticCurveTo(gx + 30, 186, gx + 64, 172); g.lineTo(gx + 62, 178); g.quadraticCurveTo(gx + 30, 192, gx + 2, 180); g.fill(); R(g, gx + 46, 154, 2, 22, "#7c4a2a"); R(g, gx + 42, 150, 8, 6, "#111827");
      for (let i = 0; i < 4; i++) { for (let k = 0; k < 6; k++) R(g, 20 + i * 90, 120 + k * 8, 4, 8, k % 2 ? "#f8fafc" : "#1d4ed8"); }
      VIG(g, W, H, 0.25);
    },
    bp_teatro(g, W, H, f) {
      VG(g, 0, 200, "#450a0a", "#1c0505"); g.fillRect(0, 0, W, 200);
      for (let i = 0; i < 10; i++) { const x = i * 32, sw = Math.sin(f / 30 + i) * 2; R(g, x + sw, 0, 30, 150, i % 2 ? "#7f1d1d" : "#991b1b"); R(g, x + 26 + sw, 0, 4, 150, "rgba(0,0,0,.2)"); }
      R(g, 0, 0, W, 16, "#a16207"); for (let i = 0; i < 20; i++) C(g, 8 + i * 16, 16, 4, "#facc15");
      R(g, 0, 150, W, 50, "#5b3a22"); for (let x = 0; x < W; x += 24) R(g, x, 150, 1, 50, "rgba(0,0,0,.3)");
      R(g, 140, 60, 40, 90, `rgba(253,224,71,${0.12 + 0.05 * Math.sin(f / 12)})`); GL(g, 160, 150, 70, "253,224,71", 0.3);
      R(g, 20, 110, 50, 40, "#334155"); R(g, 24, 114, 42, 6, "#64748b"); R(g, 250, 120, 40, 30, "#78350f"); g.font = "700 6px system-ui"; g.textAlign = "center"; g.fillStyle = "#fde68a"; g.fillText("FRAGILE · BANDA", 270, 138);
      notes(g, f, 160, 120, 6, "#fde68a"); VIG(g, W, H, 0.5);
    },
    bp_locanda(g, W, H, f) {
      VG(g, 0, 200, "#1e293b", "#0f172a"); g.fillRect(0, 0, W, 200); R(g, 0, 120, W, 80, "#57493a");
      R(g, 180, 20, 110, 80, "#0c4a6e"); R(g, 184, 24, 102, 72, "#1e3a5f"); stars(g, 100, 18, f, 60); for (let i = 0; i < 6; i++) C(g, 190 + i * 16, 80, 2, `rgba(253,224,71,${0.6 + 0.3 * Math.sin(f / 9 + i)})`); R(g, 180, 86, 110, 14, "#2f7f8f"); R(g, 233, 20, 4, 80, "#3f3428");
      R(g, 30, 100, 110, 40, "#e5e7eb"); R(g, 30, 96, 110, 8, "#7f1d1d"); R(g, 40, 90, 30, 10, "#f8fafc");
      R(g, 160, 130, 40, 30, "#5b3a22"); R(g, 170, 120, 20, 12, "#facc15"); R(g, 174, 116, 12, 4, "#facc15");
      VIG(g, W, H, 0.45);
    }
  };
  const HOT = {
    bp_titolo: [[50, 150, 220, 46, "🥁 La banda di Borgo Marino: cinque divise, cinque strumenti, una sola regola. Si arriva alle sette meno cinque."], [100, 10, 120, 40, "🎶 «Banda di Piazza». Fondata nel 1950 dal Maestro Anselmo Rondi. Da allora non ha mai saltato una domenica."], [220, 30, 60, 60, "🌅 Il sole sul mare. In piazza dicono che tramonta un po' più piano quando suona la banda."]],
    bp_piazza: [[200, 94, 90, 66, "🎪 La cassa armonica: ferro battuto, tetto verde e lucine. Ci hanno suonato tre generazioni di marce."], [56, 130, 70, 46, "⛲ La fontana della piazza. Ci si lavano le mani i bambini e, di nascosto, il Maestro le bacchette."], [126, 0, 60, 124, "⛪ San Rocco. Sotto, nella sala della parrocchia, si fanno le prove. Don Abele dice che i santi apprezzano. Il campanile un po' meno."]],
    bp_sala: [[30, 96, 260, 30, "🎼 I leggii in fila, in ordine di altezza. Il Maestro li ha misurati col metro. Due volte."], [18, 38, 64, 44, "📋 Il registro delle presenze. Accanto a «Ciro» c'è un trattino. Da tre anni."], [226, 64, 28, 34, "⏱️ Il metronomo. Batte il tempo anche quando nessuno lo guarda. Soprattutto allora."]],
    bp_trattoria: [[28, 28, 74, 64, "🖼️ La foto della banda a Venezia, 1972. Primo premio. In fondo a destra, un bombardino stona anche in fotografia."], [200, 20, 50, 40, "🍲 La pentola del ragù. Sei ore di fuoco lento. Nanà dice che il segreto è non guardarlo."], [56, 140, 100, 24, "🍝 La tavolata della domenica: trenta posti, trenta tovaglioli a quadretti. Uno resta sempre vuoto."]],
    bp_corso: [[134, 92, 52, 50, "⛱️ San Rocco sotto il baldacchino. Ha visto passare cento processioni. Questa è la prima con la grancassa infortunata."], [30, 140, 120, 46, "🥁 La banda in marcia. Sotto la pioggia le divise pesano il doppio. Il passo, invece, deve pesare uguale."], [210, 140, 100, 34, "☂️ Gli ombrelli della gente. Si spostano a tempo, senza accorgersene."]],
    bp_casaciro: [[40, 86, 90, 50, "🎺 La custodia della tromba, aperta. Dentro, l'ottone è lucido come se qualcuno lo pulisse ogni sera."], [146, 36, 38, 44, "🕯️ La foto di Tonino accanto a un lumino. Sorride con la tromba in mano. Al contrario."], [196, 22, 88, 66, "🌊 La finestra sul mare. Ciro la tiene sempre chiusa. Le tende, però, sempre aperte."]],
    bp_stadio: [[0, 56, 320, 64, "📣 La curva del Borgo. Stasera c'è il derby col Montenero, e la gente non ha ancora deciso chi ascoltare."], [246, 88, 48, 64, "📢 L'altoparlante SuonoSmart: tre metri di casse, un led blu e nessun'anima."], [24, 150, 110, 44, "🥁 La banda in tribuna. Le divise rosse si vedono da tutto lo stadio."]],
    bp_sottotribuna: [[20, 60, 300, 82, "🚪 Gli armadietti sotto la tribuna. Qui la banda si cambia accanto agli spogliatoi delle squadre. Puzza di canfora e di ansia."], [126, 26, 30, 40, "💡 Una lampadina sola. Il Maestro dice che basta. Il Maestro dice sempre che basta."], [200, 118, 110, 20, "⚽ Dallo spogliatoio ospiti arriva un coro. Stonato, ma convinto."]],
    bp_regia: [[6, 40, 308, 70, "🖥️ Dalla cabina si vede tutto lo stadio. Lo stadio, invece, la cabina non la vede mai."], [20, 118, 280, 44, "🎚️ Il mixer di SuonoSmart: duecento cursori e un pulsante rosso con scritto «APPLAUSI»."], [100, 20, 120, 16, "📜 «SuonoSmart: l'emozione, senza errori». Il motto è attaccato con lo scotch."]],
    bp_colle: [[140, 136, 180, 40, "🕯️ Il piccolo cimitero sul colle, rivolto al mare. Le lapidi dei pescatori guardano tutte la stessa onda."], [40, 72, 60, 50, "🌅 Il tramonto sul golfo. A quest'ora, una volta, Tonino suonava il silenzio per le barche che rientravano."], [276, 26, 34, 80, "🗼 Il faro. Si accende da solo, ogni sera. Come certe abitudini."]],
    bp_archivio: [[10, 6, 184, 120, "📚 L'archivio della banda: settant'anni di spartiti, divisi per festa. «Pasqua», «San Rocco», «Matrimoni (allegri)», «Matrimoni (così così)»."], [210, 80, 90, 30, "📜 Fogli di musica ingialliti. Qualcuno ha scritto a matita: «manca il finale. Chiedere ad A. R.»."], [240, 30, 26, 52, "🕯️ La lampada a petrolio. Don Abele giura che l'impianto elettrico c'è. Nessuno l'ha mai visto acceso."]],
    bp_venezia: [[90, 96, 140, 64, "🌉 Il ponte di pietra d'Istria. Sopra ci passano turisti, sotto gondole, e in mezzo la banda di Borgo Marino che cerca il teatro."], [0, 30, 320, 100, "🏛️ Le facciate di Venezia: finestre ad arco, intonaco che si stacca a strati come lo spartito di una marcia vecchia."], [0, 130, 320, 70, "🚣 Il canale. L'acqua qui ha il suo ritmo: lento, in tre quarti."]],
    bp_teatro: [[0, 0, 320, 150, "🎭 Le quinte di velluto rosso. Dall'altra parte, mille persone e una giuria che non sorride dal 1987."], [136, 56, 48, 94, "💡 Il cono di luce sul palco. Fra poco toccherà a voi."], [244, 116, 52, 36, "📦 Le casse degli strumenti, con scritto «FRAGILE · BANDA». Rocco ci ha aggiunto a mano: «anche noi»."]],
    bp_locanda: [[180, 18, 110, 84, "🌙 Venezia di notte dalla finestra. Le luci sull'acqua sembrano note su un pentagramma."], [28, 88, 114, 54, "🛏️ Il letto della locanda, troppo corto per Rocco e troppo morbido per il Maestro."], [156, 112, 48, 50, "🏆 Il posto vuoto sul comò, dove andrebbe un trofeo. Ferrante l'ha già misurato."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
