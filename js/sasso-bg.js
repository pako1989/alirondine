// js/sasso-bg.js - sfondi di «SETTE PER SASSO NERO» (320x200), animati, con i punti da toccare: titolo, villaggio, casa del vecchio Gisaku, città del castello,
// locanda, dojo, passo di montagna, tempio, fucina, campo da kemari, soffitta, bosco di bambù, notte dell'assedio, accampamento dei predoni, alba, tumuli.
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
  const rain = (g, f, a) => { g.strokeStyle = `rgba(186,210,240,${a || 0.35})`; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 80; i++) { const x = (i * 47 + f * 1.4) % 340 - 10, y = (i * 71 + f * 7) % 210 - 5; g.moveTo(x, y); g.lineTo(x - 3, y + 9); } g.stroke(); };
  const petals = (g, f, n, col) => { for (let i = 0; i < n; i++) { const x = (rnd(i) * 340 + f * (0.3 + rnd(i + 9) * 0.4)) % 340 - 10, y = (rnd(i + 4) * 200 + f * (0.4 + rnd(i + 2) * 0.3)) % 210 - 5; g.fillStyle = col || "rgba(251,207,232,.8)"; g.fillRect(x, y, 2, 1.5); } };
  // montagne a strati, risaie a specchio, case col tetto di paglia
  const mountains = (g, W, y, cols, f) => { cols.forEach((c, k) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, y + k * 10); for (let x = 0; x <= W; x += 8) g.lineTo(x, y + k * 10 - 30 - Math.abs(Math.sin(x / (40 + k * 18) + k * 2)) * (40 - k * 8)); g.lineTo(W, 200); g.lineTo(0, 200); g.fill(); }); };
  const paddies = (g, W, y0, h, f, sky) => { for (let r = 0; r < 4; r++) { const y = y0 + r * (h / 4); R(g, 0, y, W, h / 4 - 2, sky || "#5b7f9a"); for (let i = 0; i < 26; i++) R(g, (i * 13 + r * 5) % W, y + 3 + (i % 3) * 3, 1, 4, "#4d7c0f"); R(g, ((f * 0.4 + r * 60) % (W + 40)) - 20, y + 2, 20, 1, "rgba(255,255,255,.35)"); R(g, 0, y + h / 4 - 2, W, 2, "#5b4636"); } };
  const hut = (g, x, y, s, f, lit) => { R(g, x - 16 * s, y - 14 * s, 32 * s, 14 * s, "#5b4636"); R(g, x - 4 * s, y - 10 * s, 8 * s, 10 * s, "#1c1917"); T(g, [x - 22 * s, y - 12 * s, x, y - 32 * s, x + 22 * s, y - 12 * s], "#a16207"); T(g, [x - 22 * s, y - 12 * s, x, y - 32 * s, x - 18 * s, y - 13 * s], "#854d0e"); if (lit) { R(g, x + 6 * s, y - 10 * s, 5 * s, 5 * s, `rgba(253,186,116,${0.6 + 0.3 * Math.sin(f / 9 + x)})`); GL(g, x + 8 * s, y - 8 * s, 14 * s, "253,186,116", 0.25); } };
  const ronin = (g, x, y, s, col, f, i, kind) => {
    g.save(); g.translate(x, y + Math.abs(Math.sin(f / 9 + i)) * -1.5); g.scale(s, s);
    R(g, -6, -24, 12, 18, col || "#1e3a8a"); R(g, -6, -8, 5, 8, "#1c1917"); R(g, 1, -8, 5, 8, "#1c1917"); C(g, 0, -29, 5, "#e8c4a0"); R(g, -5, -34, 10, 4, "#1c1917");
    if (kind === "spada") { R(g, 5, -26, 2, 16, "#cbd5e1"); R(g, 4, -12, 4, 2, "#a16207"); } else if (kind === "arco") { g.strokeStyle = "#a16207"; g.lineWidth = 1.5; g.beginPath(); g.arc(7, -18, 10, -1.3, 1.3); g.stroke(); }
    else if (kind === "lancia") { R(g, -9, -40, 1.5, 36, "#78350f"); T(g, [-10, -40, -8.2, -46, -6.5, -40], "#e5e7eb"); } else if (kind === "martello") { R(g, 6, -28, 2, 20, "#78350f"); R(g, 3, -30, 8, 5, "#57534e"); }
    else if (kind === "cappello") { T(g, [-10, -33, 0, -40, 10, -33], "#d6b370"); } else if (kind === "corvo") { T(g, [-8, -34, 0, -44, 8, -34], "#991b1b"); R(g, -7, -22, 14, 3, "#991b1b"); }
    g.restore();
  };
  const SC = {
    sn_titolo(g, W, H, f) {
      VG(g, 0, 140, "#7f1d1d", "#fb923c"); g.fillRect(0, 0, W, 140); C(g, 160, 92, 34, "#fef3c7"); GL(g, 160, 92, 90, "254,215,170", 0.5);
      mountains(g, W, 120, ["#57261c", "#3b1a14", "#24110d"], f);
      paddies(g, W, 150, 50, f, "#c2410c");
      ["spada", "arco", "lancia", "martello", "cappello", "spada", "corvo"].forEach((k, i) => ronin(g, 40 + i * 40, 150, 1.25, i === 6 ? "#1c1917" : ["#1e3a8a", "#14532d", "#7c2d12", "#334155", "#a16207", "#581c87"][i], f, i, k === "corvo" ? "spada" : k));
      petals(g, f, 30);
      g.textAlign = "center"; g.font = "900 26px Georgia, serif"; g.fillStyle = "#fef3c7"; g.fillText("SETTE PER SASSO NERO", W / 2, 32); g.font = "italic 700 10px Georgia, serif"; g.fillStyle = "#fde68a"; g.fillText("un villaggio, un raccolto, sette lame", W / 2, 46);
      VIG(g, W, H, 0.3);
    },
    sn_villaggio(g, W, H, f) {
      VG(g, 0, 110, "#7dd3fc", "#fde68a"); g.fillRect(0, 0, W, 110); mountains(g, W, 96, ["#64748b", "#475569", "#334155"], f);
      R(g, 210, 30, 4, 50, "#1c1917"); for (let i = 0; i < 3; i++) C(g, 212 + Math.sin(f / 30 + i) * 6, 26 - i * 8, 5 - i, `rgba(203,213,225,${0.5 - i * 0.12})`);
      paddies(g, W, 116, 46, f, "#8fb4c9");
      hut(g, 60, 176, 1.3, f, false); hut(g, 150, 182, 1.1, f, false); hut(g, 260, 178, 1.4, f, false);
      // il mulino ad acqua sul fiume
      R(g, 0, 186, W, 14, "#4d7c99"); C(g, 300, 170, 16, "#78350f"); for (let i = 0; i < 8; i++) { const a = f / 20 + i * 0.785; R(g, 300 + Math.cos(a) * 14 - 1, 170 + Math.sin(a) * 14 - 1, 3, 3, "#a16207"); }
      ronin(g, 110, 190, 1, "#7c2d12", f, 2, "cappello"); ronin(g, 200, 192, 1, "#57534e", f, 5, "cappello");
      petals(g, f, 10, "rgba(250,250,210,.6)"); VIG(g, W, H, 0.25);
    },
    sn_casa(g, W, H, f) {
      VG(g, 0, 200, "#3b2414", "#1c100a"); g.fillRect(0, 0, W, 200); for (let x = 0; x < W; x += 24) R(g, x, 0, 3, 140, "#2a170c");
      R(g, 0, 140, W, 60, "#7c5a36"); for (let x = 0; x < W; x += 40) R(g, x, 140, 1, 60, "rgba(0,0,0,.3)");
      // il focolare irori al centro, col bollitore appeso
      R(g, 120, 150, 80, 30, "#3f2a1a"); R(g, 128, 156, 64, 18, "#57534e"); for (let i = 0; i < 5; i++) C(g, 140 + i * 10, 166 + Math.sin(f / 5 + i), 3 + Math.sin(f / 4 + i), `rgba(251,146,60,${0.7 + 0.2 * Math.sin(f / 3 + i)})`); GL(g, 160, 162, 60, "251,146,60", 0.35);
      R(g, 159, 60, 2, 80, "#1c1917"); C(g, 160, 136, 10, "#1f2937"); for (let i = 0; i < 3; i++) C(g, 160 + Math.sin(f / 20 + i) * 4, 120 - i * 10 - (f % 30) / 3, 3, "rgba(226,232,240,.25)");
      R(g, 230, 40, 70, 60, "#d6c9a8"); for (let i = 0; i < 4; i++) R(g, 230 + i * 18, 40, 1, 60, "#3f2a1a"); R(g, 230, 70, 70, 1, "#3f2a1a");
      R(g, 20, 90, 60, 50, "#5b4636"); for (let i = 0; i < 3; i++) R(g, 26 + i * 18, 96, 14, 12, "#a16207");
      ronin(g, 110, 172, 1.2, "#57534e", f, 1, "cappello"); VIG(g, W, H, 0.5);
    },
    sn_citta(g, W, H, f) {
      VG(g, 0, 120, "#93c5fd", "#fef3c7"); g.fillRect(0, 0, W, 120);
      // il castello del signore sullo sfondo
      R(g, 200, 50, 70, 50, "#e5e7eb"); T(g, [190, 52, 235, 30, 280, 52], "#334155"); R(g, 212, 22, 46, 20, "#f1f5f9"); T(g, [204, 24, 235, 6, 266, 24], "#334155"); R(g, 230, 64, 10, 14, "#1f2937");
      for (let i = 0; i < 6; i++) { const x = i * 56; R(g, x, 100, 50, 50, ["#b45309", "#7c2d12", "#92400e"][i % 3]); T(g, [x - 4, 102, x + 25, 84, x + 54, 102], "#1c1917"); R(g, x + 6, 112, 38, 6, "#fef3c7"); g.fillStyle = "#7f1d1d"; g.font = "700 6px serif"; g.textAlign = "center"; g.fillText(["米", "酒", "刀", "茶", "宿", "魚"][i], x + 25, 117); }
      R(g, 0, 150, W, 50, "#c2a878"); for (let x = 0; x < W; x += 16) R(g, x, 150, 1, 50, "rgba(0,0,0,.08)");
      for (let i = 0; i < 4; i++) { const x = 30 + i * 80; R(g, x - 1, 86, 2, 16, "#1c1917"); C(g, x, 104, 6, `rgba(239,68,68,${0.7 + 0.2 * Math.sin(f / 8 + i)})`); GL(g, x, 104, 18, "239,68,68", 0.25); }
      ronin(g, 60, 192, 1.1, "#1e3a8a", f, 0, "spada"); ronin(g, 140, 194, 1, "#a16207", f, 3, "cappello"); ronin(g, 250, 190, 1.2, "#334155", f, 5, "lancia");
      VIG(g, W, H, 0.25);
    },
    sn_locanda(g, W, H, f) {
      VG(g, 0, 200, "#451a03", "#1c0a02"); g.fillRect(0, 0, W, 200); R(g, 0, 140, W, 60, "#a68a5b"); for (let x = 0; x < W; x += 30) R(g, x, 140, 1, 60, "rgba(0,0,0,.25)");
      for (let i = 0; i < 4; i++) { const x = 30 + i * 80; R(g, x, 100, 50, 10, "#5b3a22"); R(g, x + 6, 110, 4, 30, "#3f2a1a"); R(g, x + 40, 110, 4, 30, "#3f2a1a"); C(g, x + 25, 98, 5, "#e5e7eb"); }
      for (let i = 0; i < 5; i++) { const x = 20 + i * 70; R(g, x, 20, 2, 18, "#1c1917"); R(g, x - 6, 38, 14, 18, `rgba(254,215,170,${0.75 + 0.15 * Math.sin(f / 7 + i)})`); GL(g, x + 1, 46, 30, "254,215,170", 0.3); }
      ronin(g, 80, 172, 1.2, "#334155", f, 1, "spada"); ronin(g, 220, 172, 1.2, "#581c87", f, 4, "cappello"); VIG(g, W, H, 0.45);
    },
    sn_dojo(g, W, H, f) {
      VG(g, 0, 200, "#78350f", "#451a03"); g.fillRect(0, 0, W, 200); R(g, 0, 130, W, 70, "#d6c9a8"); for (let x = 0; x < W; x += 32) R(g, x, 130, 1, 70, "#a68a5b"); for (let y = 130; y < 200; y += 18) R(g, 0, y, W, 1, "#a68a5b");
      for (let i = 0; i < 6; i++) R(g, 10 + i * 54, 20, 8, 110, "#3f2a1a"); R(g, 0, 18, W, 6, "#3f2a1a");
      R(g, 120, 36, 80, 60, "#f5f5f4"); g.fillStyle = "#1c1917"; g.font = "900 28px serif"; g.textAlign = "center"; g.fillText("道", 160, 78);
      ronin(g, 100, 180, 1.4, "#e5e7eb", f, 0, "spada"); ronin(g, 220, 180, 1.4, "#1e3a8a", f, 3, "spada"); VIG(g, W, H, 0.4);
    },
    sn_passo(g, W, H, f) {
      VG(g, 0, 140, "#bfdbfe", "#e0e7ff"); g.fillRect(0, 0, W, 140); mountains(g, W, 110, ["#94a3b8", "#64748b", "#475569"], f);
      for (let i = 0; i < 6; i++) R(g, 0, 20 + i * 14 + Math.sin(f / 40 + i) * 3, W, 6, "rgba(255,255,255,.18)");
      // il torii rosso sul sentiero
      R(g, 140, 90, 6, 60, "#b91c1c"); R(g, 194, 90, 6, 60, "#b91c1c"); R(g, 130, 84, 80, 8, "#b91c1c"); R(g, 136, 98, 68, 5, "#991b1b"); R(g, 128, 80, 84, 4, "#1c1917");
      R(g, 0, 150, W, 50, "#57534e"); T(g, [150, 200, 166, 150, 176, 150, 196, 200], "#a8a29e");
      ronin(g, 172, 160, 1, "#e5e7eb", f, 0, "lancia"); petals(g, f, 14, "rgba(255,255,255,.7)"); VIG(g, W, H, 0.3);
    },
    sn_tempio(g, W, H, f) {
      VG(g, 0, 200, "#1c1917", "#292524"); g.fillRect(0, 0, W, 200); R(g, 0, 150, W, 50, "#57534e"); for (let x = 0; x < W; x += 20) R(g, x, 150, 19, 50, "rgba(0,0,0,.08)");
      // la grande campana di bronzo sotto la tettoia
      T(g, [100, 40, 160, 14, 220, 40], "#1c1917"); R(g, 108, 40, 4, 100, "#3f2a1a"); R(g, 208, 40, 4, 100, "#3f2a1a"); const sw = Math.sin(f / 40) * 2;
      R(g, 140 + sw, 56, 40, 52, "#a16207"); C(g, 160 + sw, 108, 20, "#a16207"); R(g, 140 + sw, 66, 40, 2, "#854d0e"); R(g, 140 + sw, 90, 40, 2, "#854d0e");
      for (let i = 0; i < 6; i++) { C(g, 40 + i * 48, 140, 3, `rgba(253,186,116,${0.6 + 0.3 * Math.sin(f / 6 + i)})`); GL(g, 40 + i * 48, 140, 16, "253,186,116", 0.3); }
      for (let i = 0; i < 4; i++) C(g, 70 + Math.sin(f / 30 + i) * 20, 120 - ((f / 2 + i * 30) % 80), 4, "rgba(214,211,209,.12)");
      ronin(g, 260, 186, 1.3, "#e5e7eb", f, 1, "lancia"); VIG(g, W, H, 0.45);
    },
    sn_fucina(g, W, H, f) {
      VG(g, 0, 200, "#1c1917", "#0c0a09"); g.fillRect(0, 0, W, 200); R(g, 0, 150, W, 50, "#292524");
      R(g, 30, 80, 90, 70, "#44403c"); R(g, 50, 100, 50, 40, "#1c1917"); for (let i = 0; i < 8; i++) C(g, 60 + (i % 4) * 10, 130 - Math.floor(i / 4) * 10, 5 + Math.sin(f / 3 + i), `rgba(251,${120 + i * 10},60,${0.7 + 0.2 * Math.sin(f / 2 + i)})`); GL(g, 75, 120, 80, "251,146,60", 0.5);
      R(g, 170, 130, 50, 20, "#57534e"); R(g, 180, 150, 30, 20, "#44403c"); R(g, 176, 126, 40, 4, "#78716c");
      if (f % 50 < 6) for (let i = 0; i < 10; i++) C(g, 196 + Math.cos(i) * (f % 50) * 3, 126 - Math.sin(i * 1.3) * (f % 50) * 3, 1.2, "#fde047");
      for (let i = 0; i < 5; i++) R(g, 250 + i * 12, 60, 3, 70, "#a8a29e");
      ronin(g, 230, 186, 1.6, "#78350f", f, 2, "martello"); VIG(g, W, H, 0.5);
    },
    sn_campo(g, W, H, f) {
      VG(g, 0, 110, "#7dd3fc", "#fef9c3"); g.fillRect(0, 0, W, 110); mountains(g, W, 100, ["#6b8e5a", "#4d7c0f"], f);
      R(g, 0, 110, W, 90, "#a3a36b"); for (let i = 0; i < 40; i++) R(g, rnd(i) * W, 110 + rnd(i + 5) * 90, 2, 1, "#6b7a3b");
      // il campo da kemari: quattro alberi agli angoli (pino, ciliegio, salice, acero)
      [[60, 130, "#14532d"], [260, 130, "#f9a8d4"], [60, 190, "#65a30d"], [260, 190, "#dc2626"]].forEach(([x, y, c], i) => { R(g, x - 2, y - 30, 4, 30, "#5b3a22"); C(g, x, y - 34, 14, c); C(g, x - 6, y - 28, 9, c); C(g, x + 7, y - 28, 9, c); });
      const t = (f % 90) / 90, by = 120 - Math.sin(t * Math.PI) * 60; C(g, 120 + t * 80, by, 4, "#fef3c7"); g.strokeStyle = "#92400e"; g.lineWidth = 0.8; g.beginPath(); g.arc(120 + t * 80, by, 4, 0, 7); g.stroke();
      ronin(g, 120, 176, 1.1, "#7c2d12", f, 0, "cappello"); ronin(g, 200, 176, 1.1, "#57534e", f, 3, "cappello"); ronin(g, 160, 190, 1.2, "#b91c1c", f, 5); petals(g, f, 18); VIG(g, W, H, 0.25);
    },
    sn_soffitta(g, W, H, f) {
      VG(g, 0, 200, "#292524", "#0c0a09"); g.fillRect(0, 0, W, 200); T(g, [0, 60, 160, 0, 320, 60], "#3f2a1a"); for (let i = 0; i < 8; i++) R(g, 20 + i * 38, 20, 3, 120, "#2a170c");
      R(g, 0, 150, W, 50, "#44403c");
      // armature dei ronin di un tempo, impilate nel buio
      for (let i = 0; i < 5; i++) { const x = 60 + i * 44; R(g, x - 10, 100, 20, 30, "#57534e"); R(g, x - 12, 96, 24, 6, "#78716c"); C(g, x, 90, 8, "#44403c"); T(g, [x - 10, 86, x, 76, x + 10, 86], "#a16207"); R(g, x + 12, 80, 2, 60, "#cbd5e1"); }
      for (let i = 0; i < 20; i++) R(g, rnd(i) * W, (rnd(i + 3) * 160 + f * 0.2) % 160 + 20, 1, 1, "rgba(254,240,200,.4)");
      R(g, 140, 0, 40, 200, "rgba(254,240,200,.05)"); VIG(g, W, H, 0.6);
    },
    sn_bosco(g, W, H, f) {
      VG(g, 0, 200, "#14532d", "#052e16"); g.fillRect(0, 0, W, 200);
      for (let i = 0; i < 26; i++) { const x = rnd(i) * W, w = 4 + rnd(i + 2) * 6, sw = Math.sin(f / 40 + i) * 2; R(g, x + sw, 0, w, 200, ["#4d7c0f", "#3f6212", "#65a30d"][i % 3]); for (let y = 10; y < 200; y += 26) R(g, x + sw, y, w, 1, "#1a2e05"); }
      for (let i = 0; i < 8; i++) R(g, 0, 30 + i * 22, W, 3, "rgba(187,247,208,.05)");
      R(g, 0, 170, W, 30, "#365314"); ronin(g, 160, 190, 1.3, "#14532d", f, 1, "arco"); VIG(g, W, H, 0.45);
    },
    sn_notte(g, W, H, f) {
      VG(g, 0, 120, "#020617", "#1e1b4b"); g.fillRect(0, 0, W, 120); stars(g, W, 40, f, 80); C(g, 260, 40, 14, "#e0e7ff"); GL(g, 260, 40, 40, "224,231,255", 0.3);
      mountains(g, W, 110, ["#1e1b4b", "#0f0a2a"], f);
      R(g, 0, 130, W, 70, "#1c1917"); for (let i = 0; i < 30; i++) R(g, i * 11, 112 - (i % 3) * 4, 3, 30, "#3f2a1a");
      for (let i = 0; i < 7; i++) { const x = 20 + i * 46; R(g, x, 100, 2, 14, "#1c1917"); C(g, x + 1, 98, 3 + Math.sin(f / 3 + i), `rgba(251,146,60,${0.8})`); GL(g, x + 1, 98, 22, "251,146,60", 0.35); }
      for (let i = 0; i < 5; i++) ronin(g, 50 + i * 55, 170, 1.1, ["#1e3a8a", "#14532d", "#7c2d12", "#334155", "#581c87"][i], f, i, ["spada", "arco", "lancia", "martello", "spada"][i]);
      rain(g, f, 0.25); VIG(g, W, H, 0.5);
    },
    sn_accampamento(g, W, H, f) {
      VG(g, 0, 200, "#1c0a02", "#450a0a"); g.fillRect(0, 0, W, 200); mountains(g, W, 100, ["#2a0f07", "#1c0a02"], f);
      for (let i = 0; i < 4; i++) { const x = 40 + i * 80; T(g, [x - 24, 160, x, 120, x + 24, 160], "#57261c"); R(g, x - 2, 140, 4, 20, "#1c0a02"); }
      C(g, 160, 176, 18, "#7c2d12"); for (let i = 0; i < 8; i++) C(g, 150 + (i % 4) * 7, 170 - Math.floor(i / 4) * 8 + Math.sin(f / 3 + i), 4, `rgba(251,${100 + i * 15},40,.85)`); GL(g, 160, 168, 80, "251,146,60", 0.5);
      R(g, 280, 60, 3, 100, "#1c1917"); R(g, 283, 60, 26, 16, "#991b1b"); T(g, [292, 64, 298, 68, 292, 72], "#1c1917");
      ronin(g, 100, 194, 1.2, "#1c1917", f, 2, "corvo"); ronin(g, 220, 194, 1.2, "#44403c", f, 4, "lancia"); VIG(g, W, H, 0.5);
    },
    sn_alba(g, W, H, f) {
      VG(g, 0, 140, "#fdba74", "#fef3c7"); g.fillRect(0, 0, W, 140); C(g, 160, 128, 30, "#fef9c3"); GL(g, 160, 120, 120, "254,240,138", 0.5);
      mountains(g, W, 130, ["#a8a29e", "#78716c"], f); paddies(g, W, 142, 58, f, "#fcd34d");
      for (let i = 0; i < 8; i++) ronin(g, 30 + i * 36, 170 + (i % 2) * 6, 0.9, "#57534e", f, i, "cappello");
      petals(g, f, 16, "rgba(254,240,200,.6)"); VIG(g, W, H, 0.2);
    },
    sn_tumuli(g, W, H, f) {
      VG(g, 0, 130, "#cbd5e1", "#f1f5f9"); g.fillRect(0, 0, W, 130); mountains(g, W, 110, ["#94a3b8", "#64748b"], f);
      R(g, 0, 130, W, 70, "#6b8e5a");
      for (let i = 0; i < 4; i++) { const x = 70 + i * 60; T(g, [x - 22, 170, x, 146, x + 22, 170], "#57534e"); R(g, x - 1, 120, 2, 30, "#78350f"); R(g, x + 1, 128, 10, 2, "#cbd5e1"); }
      petals(g, f, 30, "rgba(251,207,232,.85)"); VIG(g, W, H, 0.3);
    }
  };
  const HOT = {
    sn_titolo: [[100, 120, 120, 50, "⚔️ Sette lame per un villaggio di contadini. Il riso è l'unica paga, e non basta mai."], [126, 58, 68, 66, "🌅 Il sole sopra le risaie di Sasso Nero. Il raccolto è fra un mese, i predoni fra trenta giorni."], [240, 120, 60, 60, "🐦‍⬛ L'ultimo della fila ha il cappello rosso. Lui non è dei sette."]],
    sn_villaggio: [[0, 116, 320, 46, "🌾 Le risaie a terrazze. L'acqua riflette il cielo: quando il riso cresce, il cielo sparisce."], [280, 150, 40, 40, "⚙️ Il mulino ad acqua del vecchio Manzo. Gira giorno e notte, anche quando nessuno macina."], [196, 18, 30, 64, "💨 Il fumo del focolare di Gisaku. Il vecchio dice che il fumo dritto porta buone notizie. Oggi è storto."]],
    sn_casa: [[118, 146, 84, 36, "🔥 L'irori, il focolare scavato nel pavimento. Ci si siede intorno per mangiare, parlare e decidere."], [228, 38, 74, 64, "🪟 Lo shoji di carta di riso. Si vede l'ombra delle risaie, piegata dal vento."], [18, 88, 64, 54, "🍚 Tre sacchi di riso. È tutto quello che il villaggio può pagare."]],
    sn_citta: [[190, 4, 90, 96, "🏯 Il castello del signore. Lui i predoni non li vede: le sue risaie sono lontane."], [0, 84, 320, 66, "🏮 Le botteghe: riso, sakè, spade, tè, una locanda e il pesce del giorno."], [20, 84, 240, 30, "🔴 Le lanterne rosse dei ronin in cerca di lavoro. Quando la lanterna è spenta, il ronin ha mangiato."]],
    sn_locanda: [[10, 18, 300, 40, "🏮 Lanterne di carta. La locandiera le accende una per ogni cliente che paga. Stasera ce ne sono due."], [20, 96, 290, 40, "🍶 Tavolini bassi, sakè annacquato e ronin che fingono di non avere fame."], [180, 140, 80, 50, "🧥 Un ronin col kimono viola gioca a dadi da solo. Vince sempre."]],
    sn_dojo: [[118, 34, 84, 64, "🖌️ «Dō»: la via. Il maestro dice che ognuno ne ha una. Qualcuno, purtroppo, la sua l'ha persa."], [0, 128, 320, 72, "🟫 Il tatami del dojo, consumato in due punti: dove si sta in piedi e dove si cade."], [60, 120, 200, 70, "🗡️ Due spadaccini si studiano da un'ora. Nessuno dei due ha ancora respirato."]],
    sn_passo: [[126, 78, 90, 76, "⛩️ Il torii rosso del passo. Si attraversa a capo chino, perché dall'altra parte c'è il tempio."], [0, 14, 320, 90, "☁️ La nebbia del passo. Sale dal basso come una marea lenta."], [140, 148, 60, 52, "🪨 Il sentiero di pietra. Ogni gradino ha un nome inciso: i monaci che l'hanno posato."]],
    sn_tempio: [[136, 50, 50, 80, "🔔 La grande campana di bronzo. Suona una volta per ogni anima che passa il passo. Sta zitta da un anno."], [20, 130, 290, 20, "🕯️ Le lanterne di pietra accese per i morti dell'ultimo raccolto."], [240, 140, 50, 50, "🧘 Una monaca con la naginata. Medita. Oppure dorme in piedi."]],
    sn_fucina: [[40, 90, 70, 60, "🔥 La forgia. Il fabbro dice che il fuoco ha un umore: oggi è arrabbiato."], [170, 120, 60, 50, "⚒️ L'incudine, con un incavo a forma di schiena: ci si è appoggiato per quarant'anni."], [244, 56, 66, 76, "🗡️ Lame non finite appese al muro. Una non ha mai avuto il manico."]],
    sn_campo: [[40, 90, 60, 100, "🌸 I quattro alberi del campo da kemari: pino, ciliegio, salice e acero. Si gioca fra le stagioni."], [110, 50, 110, 80, "🏐 La palla di pelle di cervo. Non deve toccare terra: è il gioco, ed è la regola del villaggio."], [100, 150, 120, 50, "👨‍🌾 I contadini giocano scalzi. Sbagliano, ridono, ricominciano."]],
    sn_soffitta: [[40, 70, 240, 70, "🪖 Armature di ronin, cinque, sei, troppe. Lucidate, ordinate, nascoste sotto la paglia."], [140, 0, 40, 200, "🌫️ Un raggio di luce dal tetto. La polvere ci balla dentro come cenere."], [250, 70, 50, 70, "🗡️ Una lama con l'impugnatura rossa. Qualcuno l'ha pulita da poco."]],
    sn_bosco: [[0, 0, 320, 170, "🎋 Il bosco di bambù. Quando c'è vento suona come mille flauti stonati."], [130, 150, 60, 50, "🏹 Un'arciera tra le canne. Non si muove. Neanche le canne, intorno a lei."], [0, 168, 320, 32, "🍂 Foglie secche: chi le pesta si fa sentire da un miglio."]],
    sn_notte: [[0, 92, 320, 30, "🔥 Le fiaccole sulla palizzata. Una per ogni uomo che sa tenere una lancia. Sono poche."], [230, 20, 60, 50, "🌕 La luna sopra il passo. Stanotte è dalla parte dei predoni: si vede tutto."], [30, 140, 270, 50, "⚔️ I sette, ognuno alla sua porta. Nessuno parla. Si sente il riso crescere."]],
    sn_accampamento: [[130, 150, 60, 50, "🔥 Il fuoco dei predoni. Cucinano il riso rubato l'anno scorso."], [276, 56, 40, 40, "🚩 Lo stendardo rosso di Corvo Rosso: un corvo nero su un campo di sangue."], [20, 116, 280, 50, "⛺ Le tende. Dentro, qualcuno canta una ninnananna di Sasso Nero."]],
    sn_alba: [[120, 90, 80, 60, "🌅 L'alba sopra il passo. Dopo tre notti, il sole sembra un'esagerazione."], [0, 142, 320, 58, "🌾 Le risaie. Le donne cantano mentre piantano, come se niente fosse successo."], [20, 150, 290, 30, "👨‍🌾 I contadini tornano nei campi. Non si girano a guardare i ronin."]],
    sn_tumuli: [[40, 130, 240, 50, "🪦 I tumuli sulla collina. Una spada piantata su ognuno."], [0, 0, 320, 110, "🌸 I petali del ciliegio. Cadono anche se nessuno li guarda."], [60, 110, 200, 30, "🗡️ Le spade sui tumuli guardano tutte verso il villaggio."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
