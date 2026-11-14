// js/conte-bg.js - sfondi di «IL CONTE DI MONTECALCIO» (320x200, animati, con i punti da toccare).
// ct_titolo (il borgo al tramonto, tre maschere) · ct_piazza (piazza con fontana e municipio) · ct_stadio (lo stadio Ferrante di giorno) · ct_palazzo (il salotto di Palazzo Vanni)
// ct_notte (lo stadio di notte, sotto i riflettori spenti) · ct_ballo (la sala del ballo in maschera)
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const E = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
  const P = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, x, y, w, h, stops) => { const gr = g.createLinearGradient(0, y, 0, y + h); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; g.fillRect(x, y, w, h); };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 210); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const TXT = (g, t, x, y, font, fill, stroke, lw) => { g.font = font; g.textAlign = "center"; if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 3; g.strokeText(t, x, y); } g.fillStyle = fill; g.fillText(t, x, y); g.textAlign = "left"; };
  // una maschera da ballo: faccia, occhi, decoro
  function mask(g, x, y, s, col, deco, tilt) {
    g.save(); g.translate(x, y); g.rotate(tilt || 0); g.scale(s, s);
    P(g, [-11, -4, -6, -8, 0, -6, 6, -8, 11, -4, 9, 3, 4, 5, 0, 3, -4, 5, -9, 3], col); R(g, -8, -2, 5, 3, "#0b0b0f"); R(g, 3, -2, 5, 3, "#0b0b0f");
    g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-10, -3); g.lineTo(-6, -7); g.lineTo(0, -5); g.lineTo(6, -7); g.lineTo(10, -3); g.stroke();
    if (deco === "piuma") { P(g, [9, -4, 15, -14, 13, -6], "#fde68a"); P(g, [9, -4, 12, -16, 12, -7], "#e0b44a"); } else if (deco === "naso") P(g, [0, 0, 3, 8, -3, 8], "#e8d5b0"); else if (deco === "gemma") C(g, 0, -5, 1.8, "#f43f5e");
    g.restore();
  }
  function fall(g, W, f, n, cols, y0) { for (let i = 0; i < n; i++) { const x = (rnd(i + 9) * W + f * (0.3 + rnd(i) * 0.3)) % W, y = ((rnd(i + 31) * 200 + f * (0.5 + rnd(i + 2) * 0.6)) % 200) + (y0 || 0); R(g, x, y % 200, 2, 1, cols[i % cols.length]); } }

  const SC = {
    // il borgo al tramonto: colline, torre civica, un campo da calcio storto, tre maschere appese come bandiere
    ct_titolo(g, W, H, f) {
      VG(g, 0, 0, W, 120, ["#2a1236", "#8a2f4a", "#f08a4b", "#fde2a0"]);
      C(g, 220, 92, 22, "#fff3c4"); GL(g, 220, 92, 70, "255,200,120", 0.4);
      for (let i = 0; i < 22; i++) R(g, rnd(i) * W, rnd(i + 5) * 60, 1, 1, `rgba(255,255,255,${0.2 + 0.4 * Math.abs(Math.sin(f * 0.04 + i))})`);
      P(g, [0, 118, 40, 96, 90, 108, 140, 88, 200, 106, 260, 90, 320, 104, 320, 140, 0, 140], "#3a2a3a");
      P(g, [0, 140, 60, 124, 130, 132, 190, 120, 260, 130, 320, 122, 320, 200, 0, 200], "#2a1f2c");
      // il borgo sul colle
      for (let i = 0; i < 12; i++) { const x = 90 + i * 9 + (i % 3) * 2, h = 14 + rnd(i + 3) * 16, y = 108 - h * 0.3; R(g, x, y, 8, h * 0.8, "#1a1220"); P(g, [x - 1, y, x + 4, y - 5, x + 9, y], "#3a1f2f"); if (rnd(i + 8) > 0.5 && f % 120 < 90 + i) R(g, x + 3, y + 5, 2, 2, "#ffd27a"); }
      R(g, 132, 78, 12, 40, "#1a1220"); P(g, [130, 78, 138, 66, 146, 78], "#3a1f2f"); R(g, 136, 84, 4, 5, f % 200 < 150 ? "#ffd27a" : "#3a2d12");
      // campo storto in basso
      VG(g, 0, 150, W, 50, ["#2f6b3a", "#1d4527"]); g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 168); g.lineTo(W, 172); g.moveTo(160, 152); g.lineTo(162, 200); g.stroke(); g.beginPath(); g.ellipse(161, 176, 28, 8, 0.03, 0, 7); g.stroke();
      // tre maschere appese a un filo
      g.strokeStyle = "#e0b44a"; g.lineWidth = 1; g.beginPath(); g.moveTo(10, 18); g.quadraticCurveTo(160, 52, 310, 18); g.stroke();
      [[70, 33, "#7f1d1d", "piuma", 0.1], [160, 38, "#92400e", "naso", -0.05], [250, 33, "#14532d", "gemma", -0.1]].forEach(([x, y, c, d, t], i) => mask(g, x, y + Math.sin(f * 0.04 + i) * 1.5, 1.7, c, d, t + Math.sin(f * 0.03 + i) * 0.04));
      fall(g, W, f, 24, ["#e0b44a", "#fde68a", "#f472b6"]);
      TXT(g, "IL CONTE DI MONTECALCIO", 160, 180, "bold 13px Georgia, serif", "#fde68a", "#2a0f10", 4);
      VIG(g, W, H, 0.5);
    },
    // piazza: fontana al centro, municipio a destra, bar a sinistra, campanile e bandierine
    ct_piazza(g, W, H, f) {
      VG(g, 0, 0, W, 90, ["#7aa7d6", "#d9e6f2", "#f1e6c9"]);
      for (let i = 0; i < 3; i++) E(g, ((rnd(i + 2) * 420 + f * 0.1 * (1 + i * 0.5)) % 420) - 50, 18 + i * 14, 36, 5, "rgba(255,255,255,.7)");
      // campanile
      R(g, 140, 18, 18, 70, "#a99a7c"); R(g, 140, 18, 18, 3, "#8a7c60"); P(g, [138, 18, 149, 2, 160, 18], "#7f1d1d"); R(g, 145, 28, 8, 12, "#2a1c14"); R(g, 147, 30, 4, 8, f % 90 < 45 ? "#ffd27a" : "#e0b44a");
      // municipio
      R(g, 190, 46, 110, 52, "#c9b78e"); R(g, 190, 46, 110, 4, "#a8966c"); P(g, [186, 46, 245, 24, 304, 46], "#9b5f3f"); R(g, 232, 66, 26, 32, "#4a2f20"); R(g, 236, 70, 18, 28, "#6b4a30");
      for (let i = 0; i < 4; i++) { R(g, 198 + i * 22 + (i > 1 ? 36 : 0), 56, 10, 14, "#3b2f24"); R(g, 199 + i * 22 + (i > 1 ? 36 : 0), 57, 8, 12, "rgba(255,230,150,.35)"); }
      R(g, 238, 30, 14, 14, "#f8f5ec"); R(g, 238, 30, 14, 3, "#7f1d1d"); TXT(g, "COMUNE", 245, 56, "bold 5px Georgia", "#3b2f24");
      // bar a sinistra con tenda
      R(g, 20, 56, 96, 42, "#b98a5a"); R(g, 20, 56, 96, 3, "#8a6238"); for (let i = 0; i < 8; i++) R(g, 24 + i * 11, 62, 11, 9, i % 2 ? "#f8f5ec" : "#b3202c"); R(g, 34, 76, 22, 22, "#2a1c14"); R(g, 70, 74, 36, 16, "#1c2a38"); R(g, 72, 76, 32, 12, "rgba(255,230,150,.4)");
      TXT(g, "BAR SPORT", 68, 54, "bold 7px Georgia", "#fde68a", "#2a1c14", 2);
      // bandierine
      g.strokeStyle = "#6b5a3f"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 44); g.quadraticCurveTo(160, 60, 320, 44); g.stroke();
      for (let i = 0; i < 16; i++) { const x = i * 20 + 6, y = 44 + Math.sin((x / 320) * Math.PI) * 11, w = Math.sin(f * 0.1 + i) * 1.2; P(g, [x, y, x + 6, y + 1, x + 3 + w, y + 7], ["#7f1d1d", "#e0b44a", "#1e3a5f", "#f8f5ec"][i % 4]); }
      // selciato e fontana
      VG(g, 0, 98, W, 102, ["#b8a07a", "#8f7e60"]);
      for (let y = 102; y < 200; y += 10) for (let x = (y / 10) % 2 * 9; x < W; x += 18) R(g, x, y, 17, 1, "rgba(0,0,0,.1)");
      E(g, 160, 150, 44, 14, "#7d7360"); E(g, 160, 147, 40, 11, "#5c9fc0"); E(g, 160, 148, 24, 6, "#3a7da0"); R(g, 157, 124, 6, 22, "#9b927e"); E(g, 160, 124, 12, 3, "#9b927e");
      for (let i = 0; i < 9; i++) { const a = (f * 0.07 + i) % 3, x = 160 + (i - 4) * 3.2 + Math.sin(a) * 2, y = 118 + a * 9; R(g, x, y, 1, 2, "#e0f2fe"); }
      GL(g, 160, 146, 50, "255,255,255", 0.08);
      // passanti sagome
      [[40, 150, "#1e3a5f"], [86, 170, "#7f1d1d"], [250, 160, "#14532d"], [286, 178, "#92400e"]].forEach(([x, y, c], i) => { const b = Math.sin(f * 0.08 + i) * 0.8; C(g, x, y - 12 + b, 3, "#e0b890"); R(g, x - 3, y - 9 + b, 6, 10, c); R(g, x - 2, y + 1, 2, 5, "#1f2937"); R(g, x + 1, y + 1, 2, 5, "#1f2937"); });
      VIG(g, W, H, 0.32);
    },
    // lo stadio Ferrante di giorno: tribuna, tabellone, cancello, un pallone sgonfio
    ct_stadio(g, W, H, f) {
      VG(g, 0, 0, W, 80, ["#7aa7d6", "#dbe8f3"]); for (let i = 0; i < 2; i++) E(g, ((rnd(i + 12) * 420 + f * 0.12) % 420) - 40, 20 + i * 16, 40, 5, "rgba(255,255,255,.75)");
      P(g, [0, 78, 60, 62, 130, 74, 200, 58, 270, 72, 320, 64, 320, 90, 0, 90], "#6b8a5a");
      // tribuna
      R(g, 28, 54, 264, 44, "#8d93a0"); for (let r = 0; r < 4; r++) { R(g, 28, 58 + r * 9, 264, 7, r % 2 ? "#7f1d1d" : "#9a2a2a"); for (let i = 0; i < 40; i++) if (rnd(i + r * 50) > 0.7) { C(g, 34 + i * 6.4, 60 + r * 9, 1.8, ["#e8c4a0", "#c8956a", "#f1d1b0"][i % 3]); } }
      R(g, 24, 50, 272, 5, "#5a6070"); for (let i = 0; i < 6; i++) R(g, 40 + i * 48, 38, 3, 16, "#5a6070"); R(g, 22, 34, 276, 5, "#434956");
      // tabellone
      R(g, 118, 8, 84, 30, "#1c2128"); R(g, 120, 10, 80, 26, "#0f3a2a"); TXT(g, "MONTECALCIO  0–0", 160, 22, "bold 7px monospace", "#9fffc0"); TXT(g, "OSPITI · 90'", 160, 32, "5px monospace", "#6bd49a");
      // prato e linee
      VG(g, 0, 98, W, 102, ["#3f8f4a", "#2f7a3b"]); for (let i = 0; i < 10; i++) P(g, [i * 36, 98, i * 36 + 18, 98, i * 44 - 20 + 22, 200, i * 44 - 20, 200], i % 2 ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.04)");
      g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1.2; g.strokeRect(70, 118, 180, 70); g.beginPath(); g.moveTo(160, 118); g.lineTo(160, 188); g.stroke(); g.beginPath(); g.ellipse(160, 153, 28, 14, 0, 0, 7); g.stroke();
      // porta storta
      g.strokeStyle = "#f1f1f1"; g.lineWidth = 2; g.beginPath(); g.moveTo(52, 188); g.lineTo(54, 148); g.lineTo(82, 150); g.lineTo(80, 188); g.stroke();
      g.strokeStyle = "rgba(255,255,255,.2)"; g.lineWidth = 1; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(54 + i * 5, 148); g.lineTo(54 + i * 5, 188); g.stroke(); }
      // il pallone sgonfio e il fischietto
      E(g, 224, 178, 7, 5, "#e8e2d2"); g.strokeStyle = "#8a8272"; g.lineWidth = 1; g.beginPath(); g.ellipse(224, 178, 7, 5, 0, 0, 7); g.stroke(); R(g, 221, 176, 3, 2, "#3a3a3a");
      R(g, 236, 181, 8, 2, "#ca8a04"); C(g, 245, 182, 2, "#ca8a04");
      // un uomo con le chiavi
      const b = Math.sin(f * 0.07) * 0.8; C(g, 270, 150 + b, 3, "#e0b890"); R(g, 267, 153 + b, 6, 12, "#14532d"); R(g, 268, 165, 2, 6, "#1f2937"); R(g, 271, 165, 2, 6, "#1f2937"); R(g, 273, 156 + b, 1, 5, "#ca8a04");
      VIG(g, W, H, 0.3);
    },
    // salotto di Palazzo Vanni: lampadario, ritratti, tavolino con tre tazze, cani
    ct_palazzo(g, W, H, f) {
      R(g, 0, 0, W, 130, "#5a1520"); for (let i = 0; i < 16; i++) R(g, i * 20, 0, 2, 130, "rgba(0,0,0,.18)"); R(g, 0, 126, W, 6, "#3a0e18"); R(g, 0, 0, W, 8, "#ca8a04");
      VG(g, 0, 132, W, 68, ["#8d5a3b", "#5a3b24"]); for (let i = 0; i < 12; i++) R(g, i * 28, 132, 1, 68, "rgba(0,0,0,.18)");
      R(g, 60, 150, 200, 38, "#7f1d1d"); R(g, 60, 150, 200, 2, "#e0b44a"); R(g, 60, 186, 200, 2, "#e0b44a");
      // finestre con tende
      [[18, 28], [262, 28]].forEach(([x, y]) => { R(g, x, y, 40, 70, "#1c2a3a"); R(g, x + 3, y + 3, 34, 64, "#3b5a7a"); R(g, x + 19, y + 3, 2, 64, "#1c2a3a"); R(g, x + 3, y + 34, 34, 2, "#1c2a3a"); R(g, x - 6, y - 4, 12, 78, "#9f1239"); R(g, x + 34, y - 4, 12, 78, "#9f1239"); GL(g, x + 20, y + 30, 40, "180,210,255", 0.1); });
      // ritratti
      [[80, 20, 40, 52], [200, 20, 40, 52]].forEach(([x, y, w, h], i) => { R(g, x - 3, y - 3, w + 6, h + 6, "#ca8a04"); R(g, x, y, w, h, "#2a1c14"); C(g, x + w / 2, y + 20, 8, "#d9b48f"); R(g, x + w / 2 - 10, y + 28, 20, 20, i ? "#1e3a5f" : "#4c1d95"); R(g, x + w / 2 - 5, y + 8, 10, 4, i ? "#a3a3a3" : "#d4d4d8"); });
      // camino al centro? lampadario
      g.strokeStyle = "#ca8a04"; g.lineWidth = 1; g.beginPath(); g.moveTo(160, 0); g.lineTo(160, 34); g.stroke(); E(g, 160, 38, 30, 6, "#ca8a04"); for (let i = 0; i < 7; i++) { const x = 134 + i * 8.7; R(g, x, 30, 2, 7, "#f4ecd8"); R(g, x, 27 + Math.sin(f * 0.3 + i) * 0.5, 2, 3, "#ffb347"); }
      GL(g, 160, 34, 110, "255,190,110", 0.22 + Math.sin(f * 0.05) * 0.02);
      // tavolino con tazze, tre cani
      R(g, 112, 134, 96, 6, "#3b2a1c"); R(g, 116, 140, 4, 18, "#3b2a1c"); R(g, 200, 140, 4, 18, "#3b2a1c"); [128, 156, 184].forEach((x, i) => { R(g, x, 128, 8, 6, "#f8f5ec"); R(g, x + 8, 129, 2, 3, "#f8f5ec"); if (i === 1) { g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(x + 3 + Math.sin(f * 0.1) * 1, 122 - (f % 14) * 0.4, 1, 4); } });
      [[40, 176], [90, 182], [250, 178]].forEach(([x, y], i) => { const s = Math.sin(f * 0.06 + i) * 0.8; E(g, x, y + s, 9, 5, i === 1 ? "#d4d4d8" : "#8a6a4a"); C(g, x + 9, y - 3 + s, 4, i === 1 ? "#d4d4d8" : "#8a6a4a"); R(g, x + 11, y - 9 + s, 2, 4, "#6b4a30"); R(g, x - 7, y + 3, 2, 5, "#3a2a1a"); R(g, x + 4, y + 3, 2, 5, "#3a2a1a"); });
      VIG(g, W, H, 0.4);
    },
    // lo stadio di notte: riflettori spenti, un solo faro che ondeggia, luna, nebbia bassa, l'armadietto nove
    ct_notte(g, W, H, f) {
      VG(g, 0, 0, W, 120, ["#070b18", "#13203a", "#233a54"]);
      for (let i = 0; i < 50; i++) R(g, rnd(i) * W, rnd(i + 4) * 70, 1, 1, `rgba(220,235,255,${0.3 + 0.5 * Math.abs(Math.sin(f * 0.03 + i))})`);
      C(g, 54, 34, 14, "#e8efe6"); C(g, 50, 30, 3, "#c4cfc2"); GL(g, 54, 34, 60, "200,220,255", 0.22);
      R(g, 22, 70, 276, 38, "#1b2230"); for (let r = 0; r < 3; r++) R(g, 22, 76 + r * 9, 276, 6, "#272f40");
      // riflettori: tre spenti, uno che pende
      [60, 130, 210, 270].forEach((x, i) => { R(g, x, 40, 3, 34, "#2d3648"); const on = i === 2 && f % 180 > 50; R(g, x - 10, 32 + (i === 2 ? Math.sin(f * 0.02) * 0.6 : 0), 22, 9, "#1a2030"); for (let k = 0; k < 4; k++) R(g, x - 8 + k * 5, 34, 3, 5, on ? "#ffe9a8" : "#2a3346"); if (on) { GL(g, x, 40, 80, "255,230,170", 0.3); P(g, [x - 10, 41, x + 12, 41, x + 50, 150, x - 50, 150], "rgba(255,240,190,.07)"); } });
      VG(g, 0, 108, W, 92, ["#14301d", "#0b1c12"]); g.strokeStyle = "rgba(200,230,210,.35)"; g.lineWidth = 1; g.strokeRect(70, 128, 180, 60); g.beginPath(); g.moveTo(160, 128); g.lineTo(160, 188); g.stroke();
      // sottopassaggio con la scritta SPOGLIATOI
      R(g, 236, 112, 62, 36, "#252d3b"); R(g, 242, 122, 50, 26, "#0a0d14"); TXT(g, "SPOGLIATOI", 267, 119, "bold 5px monospace", "#a0a8b8"); R(g, 262, 134, 10, 14, f % 220 < 14 ? "#ffe9a8" : "#0a0d14");
      for (let i = 0; i < 6; i++) { const x = ((rnd(i + 20) * 380 + f * 0.25) % 380) - 30; E(g, x, 170 + rnd(i) * 22, 44, 6, "rgba(180,200,215,.08)"); }
      const sw = Math.sin(f * 0.04) * 8; GL(g, 150 + sw, 160, 26, "255,230,160", 0.35); R(g, 148 + sw, 158, 3, 5, "#ffe9a8"); // la lanterna del Custode
      C(g, 130 + sw, 160, 3, "#bfa078"); R(g, 127 + sw, 163, 6, 12, "#14532d");
      VIG(g, W, H, 0.55);
    },
    // sala da ballo: lampadari, coppie in maschera che girano, orchestra sul palco, tappeto rosso
    ct_ballo(g, W, H, f) {
      R(g, 0, 0, W, 120, "#3a0e18"); for (let i = 0; i < 12; i++) { P(g, [i * 28 + 2, 0, i * 28 + 26, 0, i * 28 + 14, 100], "rgba(224,180,74,.06)"); }
      for (let i = 0; i < 5; i++) { const x = 30 + i * 65; R(g, x, 12, 18, 80, "#5a1a28"); R(g, x - 3, 8, 24, 6, "#ca8a04"); R(g, x - 3, 88, 24, 6, "#ca8a04"); }
      VG(g, 0, 120, W, 80, ["#e8dfc9", "#b8aa90"]); for (let r = 0; r < 6; r++) for (let c = 0; c < 20; c++) if ((r + c) % 2) R(g, c * 16, 120 + r * 14, 16, 14, "rgba(0,0,0,.12)");
      // orchestra
      R(g, 110, 90, 100, 24, "#2a1010"); R(g, 108, 112, 104, 4, "#ca8a04"); for (let i = 0; i < 5; i++) { const x = 122 + i * 18, b = Math.sin(f * 0.15 + i) * 1.2; C(g, x, 96 + b, 3, "#e0b890"); R(g, x - 3, 99 + b, 6, 11, "#111827"); if (i % 2) R(g, x + 3, 100 + b, 7, 1, "#ca8a04"); }
      // lampadari
      [80, 160, 240].forEach((x, i) => { g.strokeStyle = "#ca8a04"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 26); g.stroke(); E(g, x, 30, 20, 5, "#ca8a04"); for (let k = 0; k < 5; k++) { R(g, x - 16 + k * 8, 24, 2, 5, "#f4ecd8"); R(g, x - 16 + k * 8, 21 + Math.sin(f * 0.3 + k + i) * 0.5, 2, 3, "#ffb347"); } GL(g, x, 28, 70, "255,190,110", 0.18); });
      // coppie che girano con le maschere
      const cols = ["#7f1d1d", "#92400e", "#14532d", "#1e3a8a", "#6b21a8", "#be123c"], dec = ["piuma", "naso", "gemma", "piuma", "gemma", "naso"];
      for (let i = 0; i < 6; i++) { const cx = 50 + i * 44 + Math.sin(f * 0.03 + i) * 10, cy = 160 + (i % 2) * 14 + Math.cos(f * 0.04 + i * 2) * 4, a = f * 0.05 + i; for (let p = 0; p < 2; p++) { const x = cx + Math.cos(a + p * 3.14) * 9, y = cy + Math.sin(a + p * 3.14) * 3; R(g, x - 4, y, 8, 16, p ? "#111827" : cols[i]); C(g, x, y - 3, 4, "#e0b890"); mask(g, x, y - 3, 0.45, cols[(i + p) % 6], dec[(i + p) % 6], 0); } }
      // coriandoli
      fall(g, W, f, 40, ["#f43f5e", "#fde68a", "#60a5fa", "#a7f3d0"], 0);
      VIG(g, W, H, 0.35);
    }
  };
  const HOT = {
    ct_titolo: [[50, 18, 40, 36, "🎩 Il Conte: velluto, piuma e un nome che apre le porte. Non è tuo. Per ora è il più utile."], [140, 24, 40, 40, "🧢 Il Mercante: parla con tutti, dice la metà. La metà giusta."], [230, 18, 40, 36, "🔑 Il Custode: il più umile. Nessuno guarda chi pulisce lo spogliatoio."], [90, 78, 70, 60, "🏘️ Montecalcio. Quindici anni fa te ne sei andato di notte. Il campanile non ha cambiato ora."]],
    ct_piazza: [[130, 118, 60, 46, "⛲ La fontana: i ragazzi ci fanno le sfide di palleggio. Chi lascia cadere il pallone nell'acqua paga il caffè."], [190, 24, 112, 74, "🏛️ Il Municipio. Sul portone un avviso: «Chiuso per riunione». È lì da quindici anni."], [20, 54, 96, 46, "☕ Il Bar Sport del Moro. L'insegna dice SPORT; la parete, tutto il resto."], [130, 0, 36, 90, "🔔 Il campanile suona le ore con un ritardo di sette minuti. Il paese ci ha fatto l'orologio."]],
    ct_stadio: [[28, 54, 264, 46, "🏟️ La tribuna, intitolata a Ferrante da sette anni. Il nome è scolpito storto: non c'era spazio per la «e»."], [118, 8, 84, 30, "📟 Il tabellone: 0–0, da una partita di pochi mesi fa. Nessuno ha avuto cuore di cambiarlo."], [48, 144, 36, 50, "🥅 Una porta più bassa dell'altra. Dicono che i portieri di Montecalcio crescano di lato."], [216, 170, 34, 18, "⚽ Un pallone sgonfio e un fischietto d'ottone. Qualcuno li ha lasciati lì in ordine, come un altarino."]],
    ct_palazzo: [[78, 17, 44, 58, "🖼️ Il Conte Vanni, 1887. Sotto, la contessa ha aggiunto a matita: «non era così bello»."], [110, 124, 100, 36, "🫖 Tre tazze in porcellana: una per l'ospite, una per il sospetto, una per chi origlia."], [20, 26, 40, 72, "🪟 Dalla finestra si vede lo stadio. La contessa dice di non guardarlo mai."], [130, 20, 60, 28, "🕯️ Il lampadario, tirato a lucido per il ballo. L'ultimo dopo sette anni: il lutto, in questo palazzo, è un'arte lenta."]],
    ct_notte: [[236, 112, 62, 38, "🚪 L'ingresso agli spogliatoi. La porta è aperta, e a Montecalcio questo, di notte, non è mai un buon segno."], [40, 28, 30, 30, "🌕 La luna. Di giorno il campo è del paese; di notte, di chi ha le chiavi."], [120, 30, 100, 30, "💡 Tre riflettori spenti, uno quasi. Dicono sia il fantasma di un elettricista. Dicono tante cose."], [104, 150, 90, 28, "🔦 Una lanterna a petrolio che oscilla sul prato. Chi la porta ha il passo di chi conosce a memoria ogni buca."]],
    ct_ballo: [[100, 86, 120, 32, "🎻 L'orchestra suona da due ore lo stesso valzer, con piccole varianti: ogni invitato è una variazione."], [30, 140, 260, 50, "💃 Le coppie girano e si guardano da sotto la maschera. Qui nessuno riconosce nessuno, e ci tengono molto."], [60, 10, 200, 30, "✨ I lampadari accesi, per una volta tutti. Il Palazzo ha finito l'olio e cominciato i ricordi."], [0, 120, 40, 60, "🎭 Un servitore porge maschere di riserva. Ne offre una a te, bianca: «Per i momenti in cui non vuole essere nessuno»."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
  window.__conteBg = { SC, HOT };
})();
