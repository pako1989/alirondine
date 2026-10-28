// js/missione-bg.js - sfondi di «MISSIONE SENZA RITORNO» (320x200): titolo (la Normanna verso il Passo), ponte di coperta, Sala Tattica, Porto Omega, l'Aldilà, il laboratorio. Animati, con punti da toccare
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
  const sea = (g, W, y, f, a, b) => { VG(g, y, 200, a, b); g.fillRect(0, y, W, 200 - y); for (let i = 0; i < 26; i++) R(g, (i * 41 + f * (0.4 + (i % 3) * 0.2)) % (W + 30) - 15, y + 4 + (i % 7) * ((200 - y) / 8), 10 + (i % 4) * 4, 1, "rgba(255,255,255,.28)"); };
  // la Normanna di profilo: scafo bianco e blu, ponte, antenne, luci
  const ship = (g, x, y, s, f) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    T(g, [-70, 0, 74, 0, 60, 20, -58, 20], "#e2e8f0"); T(g, [-58, 20, 60, 20, 56, 26, -54, 26], "#1e3a5f"); R(g, -60, 6, 128, 2, "#0c4a6e");
    T(g, [-30, 0, 34, 0, 26, -18, -22, -18], "#cbd5e1"); R(g, -18, -14, 40, 6, "#0f172a"); for (let i = 0; i < 6; i++) R(g, -16 + i * 7, -13, 4, 4, `rgba(125,211,252,${0.6 + 0.3 * Math.sin(f / 10 + i)})`);
    R(g, 4, -34, 2, 16, "#94a3b8"); R(g, -2, -30, 14, 1, "#94a3b8"); C(g, 5, -35, 1.6, Math.sin(f / 6) > 0 ? "#ef4444" : "#7f1d1d");
    g.font = "900 7px 'Trebuchet MS', sans-serif"; g.textAlign = "left"; g.fillStyle = "#1e3a5f"; g.fillText("NORMANNA", -52, 15);
    GL(g, -66, 4, 22, "125,211,252", 0.35 + 0.1 * Math.sin(f / 7)); g.restore();
  };
  const hills = (g, W, y, c, a, p) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= W; x += 6) g.lineTo(x, y - Math.abs(Math.sin(x / (26 + p) + p)) * a); g.lineTo(W, 200); g.fill(); };
  const neon = (g, x, y, txt, rgb, f, sz) => { const on = Math.sin(f / 9 + x) > -0.9; g.font = `900 ${sz || 12}px 'Trebuchet MS', sans-serif`; g.textAlign = "center"; g.fillStyle = on ? `rgb(${rgb})` : "#3f3f46"; g.fillText(txt, x, y); if (on) GL(g, x, y - 4, 40, rgb, 0.35); };
  const rain = (g, W, f) => { g.strokeStyle = "rgba(170,190,230,.3)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 60; i++) { const x = (i * 47 + f * 1.4) % 340 - 10, y = (i * 71 + f * 5) % 210 - 5; g.moveTo(x, y); g.lineTo(x - 2, y + 7); } g.stroke(); };
  const raccoglitore = (g, x, y, s, f) => { g.save(); g.translate(x, y); g.scale(s, s); T(g, [-6, 0, 6, 0, 4, -18, -4, -18], "#111827"); C(g, 0, -22, 6, "#1f2937"); g.fillStyle = "#facc15"; g.beginPath(); g.ellipse(-2.4, -23, 1.8, 1.1, -0.4, 0, 7); g.ellipse(2.4, -23, 1.8, 1.1, 0.4, 0, 7); g.fill(); GL(g, 0, -23, 8, "250,204,21", 0.2 + 0.1 * Math.sin(f / 5 + x)); g.restore(); };
  const SC = {
    ms_titolo(g, W, H, f) {
      VG(g, 0, 130, "#030712", "#1e1b4b"); g.fillRect(0, 0, W, 130); stars(g, W, 60, f, 110);
      // il Passo d'Omega: un varco tra due rupi con un bagliore arancio
      T(g, [190, 130, 230, 40, 250, 130], "#0b0a1a"); T(g, [270, 130, 285, 50, 320, 130], "#0b0a1a"); GL(g, 258, 90, 70, "251,146,60", 0.35 + 0.12 * Math.sin(f / 14)); R(g, 250, 60, 16, 70, `rgba(251,146,60,${0.15 + 0.08 * Math.sin(f / 9)})`);
      sea(g, W, 128, f, "#0c1f3a", "#020617"); ship(g, 110 + Math.sin(f / 60) * 3, 126 + Math.sin(f / 30) * 1.5, 0.9, f);
      for (let i = 0; i < 5; i++) raccoglitore(g, 232 + i * 9, 128 - (i % 2) * 3, 0.45, f + i * 7);
      g.textAlign = "center"; g.font = "900 22px 'Trebuchet MS', sans-serif"; g.fillStyle = "#e0f2fe"; g.fillText("MISSIONE", 100, 40); g.fillStyle = "#38bdf8"; g.font = "900 17px 'Trebuchet MS', sans-serif"; g.fillText("SENZA RITORNO", 100, 62);
      VIG(g, W, H, 0.45);
    },
    ms_normanna(g, W, H, f) {
      VG(g, 0, 110, "#7dd3fc", "#e0f2fe"); g.fillRect(0, 0, W, 110); for (let i = 0; i < 3; i++) R(g, ((i * 130 + f * 0.12) % 380) - 40, 18 + i * 16, 64, 6, "rgba(255,255,255,.85)"); C(g, 270, 30, 13, "#fef9c3"); GL(g, 270, 30, 50, "254,240,138", 0.4);
      sea(g, W, 104, f, "#0ea5e9", "#0c4a6e");
      // ponte in prospettiva
      T(g, [0, 200, 40, 128, 280, 128, 320, 200], "#475569"); for (let i = 0; i < 9; i++) { const x = 40 + i * 30; g.strokeStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.moveTo(x, 128); g.lineTo(x * 1.14 - 22, 200); g.stroke(); }
      R(g, 0, 160, W, 2, "rgba(250,204,21,.4)"); R(g, 40, 124, 240, 5, "#94a3b8"); for (let i = 0; i < 12; i++) R(g, 44 + i * 21, 112, 2, 13, "#64748b"); R(g, 40, 112, 240, 2, "#cbd5e1");
      // sovrastruttura e Sala Tattica
      R(g, 110, 74, 100, 50, "#cbd5e1"); R(g, 110, 74, 100, 6, "#1e3a5f"); for (let i = 0; i < 6; i++) R(g, 118 + i * 15, 88, 10, 10, `rgba(56,189,248,${0.5 + 0.2 * Math.sin(f / 12 + i)})`); R(g, 150, 104, 20, 20, "#0f172a"); R(g, 158, 54, 3, 20, "#94a3b8"); C(g, 159, 52, 2, Math.sin(f / 5) > 0 ? "#ef4444" : "#7f1d1d");
      R(g, 232, 140, 30, 24, "#b91c1c"); R(g, 262, 146, 26, 18, "#1d4ed8"); for (let i = 0; i < 9; i++) R(g, 234 + i * 3, 140, 1, 24, "rgba(0,0,0,.2)");
      VIG(g, W, H, 0.3);
    },
    ms_sala(g, W, H, f) {
      VG(g, 0, 200, "#020617", "#0f172a"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 12; i++) R(g, i * 28, 0, 1, 200, "rgba(56,189,248,.08)");
      // tavolo-mappa olografico
      g.fillStyle = "#1e293b"; g.beginPath(); g.ellipse(160, 160, 120, 26, 0, 0, 7); g.fill(); g.strokeStyle = "#38bdf8"; g.lineWidth = 2; g.stroke();
      g.fillStyle = `rgba(56,189,248,${0.18 + 0.06 * Math.sin(f / 12)})`; g.beginPath(); g.moveTo(60, 160); g.lineTo(100, 70); g.lineTo(220, 70); g.lineTo(260, 160); g.fill();
      // il Mediterraneo stilizzato
      g.fillStyle = "rgba(186,230,253,.65)"; [[100, 96, 40, 6], [150, 90, 24, 4], [178, 100, 30, 5], [120, 112, 50, 4], [200, 116, 26, 4]].forEach(([x, y, w, h]) => R(g, x, y, w, h, "rgba(186,230,253,.55)"));
      for (let i = 0; i < 19; i++) { const x = 100 + rnd(i) * 120, y = 88 + rnd(i + 9) * 40; C(g, x, y, 1.6, (f / 10 + i) % 6 < 3 ? "#f87171" : "#7f1d1d"); }
      C(g, 236, 82, 3, "#fb923c"); GL(g, 236, 82, 20, "251,146,60", 0.4 + 0.15 * Math.sin(f / 6));
      // ologramma del Signor Fumo
      R(g, 150, 18, 20, 40, `rgba(125,211,252,${0.25 + 0.08 * Math.sin(f / 4)})`); C(g, 160, 16, 7, `rgba(125,211,252,${0.3 + 0.08 * Math.sin(f / 4)})`); for (let i = 0; i < 5; i++) R(g, 164 + Math.sin(f / 20 + i) * 4, 6 - ((f * 0.4 + i * 9) % 40), 3, 3, `rgba(203,213,225,${0.4 - i * 0.07})`);
      for (let y = 10; y < 60; y += 3) R(g, 148, y, 24, 1, "rgba(14,165,233,.15)");
      VIG(g, W, H, 0.5);
    },
    ms_omega(g, W, H, f) {
      VG(g, 0, 120, "#0b0617", "#3b0764"); g.fillRect(0, 0, W, 120);
      // grattacieli con finestre
      for (let i = 0; i < 9; i++) { const x = i * 38 - 6, h = 60 + rnd(i) * 60; R(g, x, 120 - h, 32, h, i % 2 ? "#1e1b2e" : "#17142a"); for (let k = 0; k < 14; k++) if (rnd(i * 31 + k) > 0.45) R(g, x + 4 + (k % 4) * 7, 124 - h + Math.floor(k / 4) * 10, 3, 4, rnd(i + k) > 0.7 ? "#f0abfc" : "#fde68a"); }
      R(g, 0, 120, W, 80, "#1c1a24"); for (let i = 0; i < 18; i++) R(g, rnd(i + 4) * W, 130 + rnd(i + 8) * 66, 18, 1, "rgba(240,171,252,.25)");
      neon(g, 160, 92, "ALDILÀ", "240,171,252", f, 18); neon(g, 54, 70, "PEGNI", "250,204,21", f + 30, 9); neon(g, 272, 60, "SOLI BLU", "56,189,248", f + 60, 9);
      R(g, 120, 96, 80, 34, "#2e1065"); R(g, 150, 104, 20, 26, "#0b0617"); GL(g, 160, 118, 40, "240,171,252", 0.3);
      for (let i = 0; i < 3; i++) raccoglitore(g, 250 + i * 14, 168, 0.6, f + i * 5); rain(g, W, f);
      VIG(g, W, H, 0.45);
    },
    ms_aldila(g, W, H, f) {
      VG(g, 0, 200, "#12061c", "#3b0764"); g.fillRect(0, 0, W, 200);
      for (let i = 0; i < 6; i++) { const a = f / 40 + i; g.fillStyle = `rgba(${["240,171,252", "56,189,248", "250,204,21"][i % 3]},.12)`; g.beginPath(); g.moveTo(160, 0); g.lineTo(160 + Math.cos(a) * 260, 200); g.lineTo(160 + Math.cos(a + 0.18) * 260, 200); g.fill(); }
      // pista
      for (let x = 0; x < 8; x++) for (let y = 0; y < 3; y++) R(g, 70 + x * 23, 150 + y * 14, 22, 13, ["#7e22ce", "#db2777", "#0ea5e9", "#1e1b4b"][(Math.floor(f / 20) + x * 3 + y * 5) % 4]);
      // bancone e il balcone di Aria
      R(g, 10, 110, 110, 30, "#0f0a1a"); R(g, 10, 110, 110, 3, "#f0abfc"); for (let i = 0; i < 8; i++) R(g, 16 + i * 13, 98, 4, 12, ["#38bdf8", "#f0abfc", "#facc15"][i % 3]);
      R(g, 220, 60, 90, 8, "#4c1d95"); R(g, 220, 68, 90, 40, "rgba(76,29,149,.4)"); C(g, 266, 86, 8, "#c4b5fd"); R(g, 258, 94, 16, 14, "#7e22ce");
      neon(g, 160, 30, "ALDILÀ", "240,171,252", f, 16); VIG(g, W, H, 0.45);
    },
    ms_lab(g, W, H, f) {
      VG(g, 0, 200, "#052e26", "#0d1f1a"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 10; i++) R(g, i * 32, 0, 2, 200, "rgba(134,239,172,.06)");
      // scaffali con provette che ribollono
      for (let s = 0; s < 3; s++) { R(g, 14, 40 + s * 30, 100, 3, "#334155"); for (let i = 0; i < 8; i++) { const c = ["#86efac", "#7dd3fc", "#fde68a", "#f0abfc"][(i + s) % 4]; R(g, 18 + i * 12, 26 + s * 30, 6, 14, "rgba(255,255,255,.15)"); R(g, 18 + i * 12, 32 + s * 30 + Math.sin(f / 10 + i + s) * 2, 6, 8, c); } }
      // banco con pallone sezionato
      R(g, 130, 130, 170, 12, "#475569"); C(g, 200, 118, 14, "#f8fafc"); T(g, [200, 104, 214, 118, 200, 132], "#1c1917"); R(g, 240, 112, 30, 18, "#14532d"); GL(g, 255, 120, 30, "134,239,172", 0.3 + 0.1 * Math.sin(f / 8));
      // lavagna con note e formule
      R(g, 150, 24, 150, 70, "#1f2937"); R(g, 150, 24, 150, 3, "#64748b"); g.fillStyle = "#e5e7eb"; g.textAlign = "left"; g.font = "8px monospace"; g.fillText("Ch = f(colla) · v²", 160, 44); g.fillText("♪ atto II: tenore?", 160, 60); g.fillText("NON CANCELLARE", 160, 80);
      for (let i = 0; i < 6; i++) { const t = (f + i * 20) % 120; C(g, 230 + i * 5, 110 - t * 0.4, 2, `rgba(134,239,172,${1 - t / 120})`); }
      VIG(g, W, H, 0.45);
    },
    ms_purgatorio(g, W, H, f) {
      VG(g, 0, 120, "#0b0f19", "#1e293b"); g.fillRect(0, 0, W, 120); stars(g, W, 40, f, 70); C(g, 270, 30, 10, "#e5e7eb");
      sea(g, W, 112, f, "#0f2a44", "#020617");
      // lo scafo grigio della nave-prigione, con file di oblò e il faro che gira
      T(g, [20, 150, 300, 150, 284, 176, 36, 176], "#3f3f46"); R(g, 30, 96, 260, 54, "#52525b"); R(g, 30, 96, 260, 4, "#71717a");
      for (let r = 0; r < 3; r++) for (let i = 0; i < 18; i++) R(g, 40 + i * 14, 104 + r * 14, 6, 6, (i + r * 3 + Math.floor(f / 50)) % 11 === 0 ? "#ef4444" : "#1f2937");
      R(g, 150, 60, 20, 36, "#3f3f46"); const a = f / 40; g.fillStyle = "rgba(254,240,138,.18)"; g.beginPath(); g.moveTo(160, 62); g.lineTo(160 + Math.cos(a) * 200, 62 + Math.sin(a) * 30 - 20); g.lineTo(160 + Math.cos(a + 0.2) * 200, 62 + Math.sin(a + 0.2) * 30 - 10); g.fill(); C(g, 160, 62, 4, "#fef08a");
      g.textAlign = "left"; g.font = "900 9px 'Trebuchet MS', sans-serif"; g.fillStyle = "#e5e7eb"; g.fillText("PURGATORIO", 46, 168);
      VIG(g, W, H, 0.5);
    },
    ms_cella(g, W, H, f) {
      VG(g, 0, 200, "#18181b", "#0a0a0b"); g.fillRect(0, 0, W, 200); GL(g, 160, 30, 160, "239,68,68", 0.18 + 0.08 * Math.sin(f / 20));
      R(g, 60, 20, 200, 150, "#e5e7eb"); R(g, 64, 24, 192, 142, "#f4f4f5"); for (let i = 0; i < 12; i++) R(g, 66 + i * 16, 24, 2, 142, "rgba(0,0,0,.05)");
      // la sedia con le cinghie spezzate
      R(g, 144, 110, 32, 40, "#52525b"); R(g, 140, 100, 40, 12, "#3f3f46"); R(g, 136, 120, 8, 3, "#27272a"); R(g, 176, 120, 8, 3, "#27272a"); R(g, 128, 122, 6, 2, "#7f1d1d"); R(g, 186, 118, 6, 2, "#7f1d1d");
      for (let i = 0; i < 6; i++) { const t = (f * 0.6 + i * 30) % 160; R(g, 150 + Math.sin(i * 3 + f / 20) * 40, 160 - t, 2, 2, `rgba(168,85,247,${0.6 - t / 300})`); }
      g.textAlign = "center"; g.font = "900 9px monospace"; g.fillStyle = "#991b1b"; g.fillText("STASI · LIVELLO 3 · SPENTO", 160, 186); VIG(g, W, H, 0.55);
    },
    ms_illio(g, W, H, f) {
      VG(g, 0, 120, "#7dd3fc", "#fef3c7"); g.fillRect(0, 0, W, 120); C(g, 60, 34, 16, "#fef9c3"); GL(g, 60, 34, 60, "254,240,138", 0.45);
      // grattacieli di vetro e la torre d'oro
      for (let i = 0; i < 8; i++) { const x = 20 + i * 36, h = 40 + rnd(i + 2) * 40; R(g, x, 116 - h, 26, h, i % 2 ? "#cbd5e1" : "#e2e8f0"); for (let k = 0; k < 6; k++) R(g, x + 3, 120 - h + k * 7, 20, 2, "rgba(56,189,248,.35)"); }
      R(g, 220, 10, 40, 106, "#ca8a04"); T(g, [220, 10, 260, 10, 240, -6], "#eab308"); for (let k = 0; k < 14; k++) R(g, 224, 16 + k * 7, 32, 2, `rgba(254,240,138,${0.4 + 0.3 * Math.sin(f / 15 + k)})`);
      sea(g, W, 116, f, "#38bdf8", "#0369a1");
      // yacht
      for (let i = 0; i < 3; i++) { const x = 30 + i * 90 + Math.sin(f / 50 + i) * 2; T(g, [x, 150, x + 60, 150, x + 52, 162, x + 6, 162], "#f8fafc"); R(g, x + 16, 140, 26, 10, "#e2e8f0"); R(g, x + 20, 143, 18, 3, "#0ea5e9"); }
      VIG(g, W, H, 0.25);
    },
    ms_torre(g, W, H, f) {
      VG(g, 0, 200, "#1c1917", "#292524"); g.fillRect(0, 0, W, 200);
      // vetrata sulla città al tramonto
      VG(g, 10, 120, "#f59e0b", "#7c2d12"); g.fillRect(20, 10, 280, 110); for (let i = 0; i < 12; i++) { const x = 24 + i * 23, h = 20 + rnd(i + 5) * 50; R(g, x, 120 - h, 18, h, "#451a03"); for (let k = 0; k < 4; k++) if (rnd(i * 7 + k) > 0.4) R(g, x + 4, 124 - h + k * 9, 3, 3, "#fde68a"); }
      for (let i = 0; i < 6; i++) R(g, 20 + i * 56, 10, 3, 110, "#a16207"); R(g, 20, 64, 280, 2, "#a16207");
      R(g, 0, 120, W, 80, "#292524"); R(g, 90, 140, 140, 10, "rgba(186,230,253,.4)"); R(g, 90, 150, 4, 30, "#78716c"); R(g, 226, 150, 4, 30, "#78716c");
      C(g, 270, 150, 8, "#fde047"); GL(g, 270, 150, 26, "250,204,21", 0.35); g.fillStyle = "#15803d"; g.beginPath(); g.ellipse(46, 160, 10, 24, 0, 0, 7); g.fill();
      VIG(g, W, H, 0.4);
    },
    ms_isola(g, W, H, f) {
      VG(g, 0, 100, "#bae6fd", "#fefce8"); g.fillRect(0, 0, W, 100); C(g, 260, 26, 18, "#fffbeb"); GL(g, 260, 26, 120, "255,251,235", 0.6 + 0.08 * Math.sin(f / 20));
      R(g, 0, 96, W, 104, "#f5f5f4"); for (let i = 0; i < 9; i++) { g.strokeStyle = "rgba(168,162,158,.5)"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 110 + i * 10); g.lineTo(W, 104 + i * 11); g.stroke(); }
      for (let i = 0; i < 4; i++) R(g, 30 + i * 70, 120 + (i % 2) * 20, 50, 14, `rgba(94,234,212,${0.4 + 0.1 * Math.sin(f / 18 + i)})`);
      // relitto viola e automi lontani
      T(g, [190, 150, 230, 112, 280, 128, 300, 160], "#7e22ce"); T(g, [214, 140, 240, 124, 262, 136, 250, 150], "#a855f7"); R(g, 236, 108, 3, 20, "#4c1d95");
      for (let i = 0; i < 4; i++) { const x = 40 + i * 30, y = 104 + Math.sin(f / 30 + i) * 1.5; R(g, x, y - 12, 6, 12, "#6b7280"); C(g, x + 3, y - 15, 3, "#9ca3af"); C(g, x + 3, y - 15, 1, Math.sin(f / 7 + i) > 0 ? "#ef4444" : "#7f1d1d"); }
      for (let i = 0; i < 12; i++) { const x = (i * 37 + f * 0.3) % W; R(g, x, 100 + (i % 4) * 2, 6, 1, "rgba(255,255,255,.5)"); }
      VIG(g, W, H, 0.2);
    },
    ms_orizzonte(g, W, H, f) {
      VG(g, 0, 120, "#7c2d12", "#fdba74"); g.fillRect(0, 0, W, 120); C(g, 160, 100, 26, "#fde68a"); GL(g, 160, 100, 120, "251,146,60", 0.45);
      hills(g, W, 110, "#4d5a2a", 22, 2); R(g, 0, 120, W, 80, "#55702f");
      // campetto con le porte e il paese fermo
      R(g, 70, 136, 180, 44, "#4d7c2f"); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 1; g.strokeRect(70, 136, 180, 44); g.beginPath(); g.moveTo(160, 136); g.lineTo(160, 180); g.stroke(); R(g, 66, 150, 4, 16, "#f8fafc"); R(g, 250, 150, 4, 16, "#f8fafc");
      [[20, 100, 34], [244, 96, 40], [290, 104, 30]].forEach(([x, y, w]) => { R(g, x, y, w, 24, "#fde7c4"); T(g, [x - 3, y, x + w + 3, y, x + w / 2, y - 14], "#9a3412"); R(g, x + 6, y + 8, 5, 6, "#fde68a"); });
      for (let i = 0; i < 5; i++) { const x = 90 + i * 34; R(g, x, 150, 6, 14, "#1e3a8a"); C(g, x + 3, 146, 4, "#e8c4a0"); }
      // lo sciame d'oro e la sagoma del Prelato
      for (let i = 0; i < 70; i++) { const a = f / 30 + i * 0.6, r = 30 + (i % 9) * 6; R(g, 160 + Math.cos(a) * r * 1.6, 70 + Math.sin(a * 1.3) * r * 0.5, 1.5, 1.5, `rgba(250,204,21,${0.4 + 0.4 * Math.sin(f / 5 + i)})`); }
      R(g, 154, 132, 12, 30, "#111827"); C(g, 160, 128, 7, "#1f2937"); C(g, 157, 127, 1.5, "#facc15"); C(g, 163, 127, 1.5, "#facc15");
      VIG(g, W, H, 0.4);
    },
    ms_flotta(g, W, H, f) {
      VG(g, 0, 110, "#f97316", "#fde68a"); g.fillRect(0, 0, W, 110); C(g, 240, 92, 22, "#fef3c7"); GL(g, 240, 92, 110, "251,146,60", 0.5);
      for (let i = 0; i < 4; i++) R(g, ((i * 110 + f * 0.1) % 400) - 50, 20 + i * 14, 70, 5, "rgba(255,237,213,.7)");
      sea(g, W, 104, f, "#2b7fb0", "#0c3a5a");
      // mille barche legate: scafi colorati, alberi, vele rattoppate e passerelle
      for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) {
        const x = i * 38 - 10 + r * 14 + Math.sin(f / 40 + i + r) * 1.5, y = 112 + r * 26 + Math.sin(f / 30 + i * 2) * 1, c = ["#b91c1c", "#1d4ed8", "#a16207", "#7e22ce", "#047857", "#0e7490"][(i + r * 2) % 6];
        T(g, [x, y, x + 34, y, x + 30, y + 9, x + 4, y + 9], c); R(g, x + 2, y - 2, 30, 2, "#78350f"); R(g, x + 10, y - 8, 12, 6, "#e7d8b0");
        if ((i + r) % 2 === 0) { R(g, x + 16, y - 34, 1.5, 26, "#3b2f22"); T(g, [x + 18, y - 32, x + 30 + Math.sin(f / 20 + i) * 2, y - 14, x + 18, y - 12], ["#fde68a", "#fca5a5", "#c4b5fd", "#a7f3d0"][(i + r) % 4]); }
        R(g, x + 34, y + 2, 6, 1, "#a0815a"); GL(g, x + 16, y - 4, 10, "254,215,170", 0.2 + 0.1 * Math.sin(f / 12 + i));
      }
      for (let i = 0; i < 18; i++) { const x = (i * 23 + f * 0.25) % W; R(g, x, 30 + (i % 5) * 9, 2, 1, "rgba(30,20,10,.5)"); }
      VIG(g, W, H, 0.3);
    },
    ms_pragia(g, W, H, f) {
      VG(g, 0, 120, "#475569", "#94a3b8"); g.fillRect(0, 0, W, 120); for (let i = 0; i < 5; i++) R(g, ((i * 90 + f * 0.08) % 420) - 60, 10 + i * 12, 110, 10, "rgba(71,85,105,.6)");
      hills(g, W, 104, "#334155", 26, 4); R(g, 0, 116, W, 84, "#3f4a3a");
      // il centro federale abbandonato: tribuna arrugginita, riflettori, il Blocco Bianco
      R(g, 20, 70, 130, 46, "#52525b"); for (let i = 0; i < 6; i++) R(g, 24, 74 + i * 7, 122, 3, "#71717a"); R(g, 20, 66, 130, 4, "#7c2d12");
      [[16, 40], [154, 40], [300, 44]].forEach(([x, y], i) => { R(g, x, y, 3, 76, "#3f3f46"); R(g, x - 8, y - 6, 19, 8, "#27272a"); const on = Math.sin(f / 7 + i * 2) > 0.6; if (on) GL(g, x + 1, y - 2, 30, "254,249,195", 0.5); for (let k = 0; k < 3; k++) R(g, x - 6 + k * 6, y - 4, 4, 3, on ? "#fef9c3" : "#52525b"); });
      R(g, 196, 64, 92, 52, "#e5e7eb"); R(g, 196, 60, 92, 5, "#f8fafc"); for (let k = 0; k < 4; k++) R(g, 204 + k * 21, 76, 12, 18, `rgba(239,68,68,${0.15 + 0.12 * Math.sin(f / 16 + k)})`); R(g, 234, 98, 16, 18, "#9ca3af");
      R(g, 60, 140, 200, 40, "#4b5b3a"); g.strokeStyle = "rgba(255,255,255,.25)"; g.strokeRect(60, 140, 200, 40); R(g, 56, 152, 4, 16, "#d4d4d8"); R(g, 260, 152, 4, 16, "#d4d4d8");
      g.textAlign = "center"; g.font = "900 8px 'Trebuchet MS', sans-serif"; g.fillStyle = "#991b1b"; g.fillText("CERBERO · PROGETTO ASCENSIONE", 242, 72);
      rain(g, W, f); VIG(g, W, H, 0.45);
    },
    ms_relitto(g, W, H, f) {
      VG(g, 0, 200, "#05040a", "#1a1408"); g.fillRect(0, 0, W, 200); stars(g, W, 40, f, 60);
      // lo scafo morto dei Raccoglitori: costole nere e bozzoli d'oro
      for (let i = 0; i < 9; i++) { const x = 20 + i * 34; g.strokeStyle = "#141218"; g.lineWidth = 6; g.beginPath(); g.moveTo(x, 200); g.quadraticCurveTo(x + 14, 60, 160, 30); g.stroke(); }
      R(g, 0, 150, W, 50, "#141218"); for (let i = 0; i < 12; i++) { const x = 14 + i * 26, y = 132 + (i % 3) * 8; g.fillStyle = "#3b2f12"; g.beginPath(); g.ellipse(x, y, 7, 13, 0, 0, 7); g.fill(); GL(g, x, y, 16, "250,204,21", 0.2 + 0.15 * Math.sin(f / 14 + i)); }
      C(g, 160, 80, 16, "#1c1917"); C(g, 160, 80, 9, `rgba(250,204,21,${0.55 + 0.3 * Math.sin(f / 9)})`); GL(g, 160, 80, 60, "250,204,21", 0.3 + 0.15 * Math.sin(f / 9));
      // la sagoma di Legione: luce singola, testa a faro
      R(g, 250, 118, 12, 26, "#4b5563"); C(g, 256, 112, 7, "#6b7280"); C(g, 256, 112, 2.5, Math.sin(f / 5) > -0.3 ? "#38bdf8" : "#0c4a6e"); GL(g, 256, 112, 14, "56,189,248", 0.4);
      VIG(g, W, H, 0.55);
    },
    ms_passo(g, W, H, f) {
      VG(g, 0, 140, "#1c0a05", "#9a3412"); g.fillRect(0, 0, W, 140); GL(g, 160, 60, 140, "251,146,60", 0.35 + 0.1 * Math.sin(f / 16));
      // le due rupi del Passo e il varco di fuoco, rottami che girano
      T(g, [0, 140, 0, 20, 70, 50, 120, 140], "#0f0604"); T(g, [320, 140, 320, 10, 240, 60, 200, 140], "#0f0604"); R(g, 140, 20, 40, 120, `rgba(253,186,116,${0.2 + 0.1 * Math.sin(f / 8)})`);
      for (let i = 0; i < 14; i++) { const a = f / 80 + i * 0.45, x = 160 + Math.cos(a) * (50 + i * 6), y = 70 + Math.sin(a) * (14 + i * 2); g.save(); g.translate(x, y); g.rotate(a * 3 + i); R(g, -4, -2, 8 + (i % 3) * 3, 4, "#292524"); R(g, -4, -2, 8, 1, "#78716c"); g.restore(); }
      R(g, 0, 140, W, 60, "#1c1210"); for (let i = 0; i < 10; i++) T(g, [i * 34, 200, i * 34 + 10, 150 + (i % 3) * 8, i * 34 + 26, 200], "#2a1b16");
      // la Normanna atterrata storta, fumo
      g.save(); g.translate(96, 160); g.rotate(-0.12); T(g, [-50, 0, 52, 0, 42, 14, -40, 14], "#cbd5e1"); T(g, [-20, 0, 24, 0, 18, -12, -14, -12], "#94a3b8"); g.restore();
      for (let i = 0; i < 8; i++) { const t = (f * 0.5 + i * 20) % 120; C(g, 120 + Math.sin(i + f / 30) * 6, 150 - t, 4 + t / 12, `rgba(68,64,60,${0.5 - t / 260})`); }
      VIG(g, W, H, 0.5);
    },
    ms_tana(g, W, H, f) {
      VG(g, 0, 200, "#0d0904", "#3b2a10"); g.fillRect(0, 0, W, 200);
      // pareti organiche a costole, cunicoli, fiumi d'oro
      for (let i = 0; i < 12; i++) { g.strokeStyle = "#1c1408"; g.lineWidth = 8; g.beginPath(); g.moveTo(i * 30, 0); g.quadraticCurveTo(i * 30 + 40, 100, i * 30 - 10, 200); g.stroke(); }
      for (let k = 0; k < 3; k++) { g.strokeStyle = `rgba(250,204,21,${0.3 + 0.15 * Math.sin(f / 12 + k)})`; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 150 + k * 14); for (let x = 0; x <= W; x += 20) g.lineTo(x, 150 + k * 14 + Math.sin(x / 30 + f / 20 + k) * 5); g.stroke(); }
      for (let i = 0; i < 10; i++) { const x = 20 + i * 30, y = 92 + (i % 2) * 10; g.fillStyle = "#3b2f12"; g.beginPath(); g.ellipse(x, y, 8, 15, 0, 0, 7); g.fill(); GL(g, x, y, 18, "250,204,21", 0.2 + 0.15 * Math.sin(f / 10 + i)); }
      for (let i = 0; i < 40; i++) R(g, 160 + Math.cos(f / 25 + i) * (40 + i * 3), 50 + Math.sin(f / 20 + i * 1.3) * 20, 1.5, 1.5, `rgba(250,204,21,${0.3 + 0.4 * Math.sin(f / 6 + i)})`);
      VIG(g, W, H, 0.55);
    },
    ms_cuore(g, W, H, f) {
      VG(g, 0, 200, "#000", "#2a1a05"); g.fillRect(0, 0, W, 200);
      // il Gigante: un pallone d'oro enorme fatto di bozzoli, appeso a cavi
      for (let i = 0; i < 8; i++) { g.strokeStyle = "#1c1408"; g.lineWidth = 3; g.beginPath(); g.moveTo(160, 80); g.lineTo(i * 46, 0); g.stroke(); }
      const r = 54 + Math.sin(f / 18) * 2; C(g, 160, 92, r, "#3b2a10"); for (let i = 0; i < 18; i++) { const a = i * 0.35 + f / 200; C(g, 160 + Math.cos(a) * r * 0.7, 92 + Math.sin(a) * r * 0.7, 6, "#5a4416"); }
      C(g, 160, 92, 16, `rgba(250,204,21,${0.6 + 0.3 * Math.sin(f / 7)})`); GL(g, 160, 92, 110, "250,204,21", 0.35 + 0.15 * Math.sin(f / 7));
      R(g, 0, 160, W, 40, "#120c05"); R(g, 60, 158, 200, 3, "#a16207");
      for (let i = 0; i < 5; i++) { const x = 90 + i * 34; R(g, x, 140, 6, 18, "#1e3a8a"); C(g, x + 3, 136, 4, "#e8c4a0"); }
      VIG(g, W, H, 0.55);
    }
  };
  const HOT = {
    ms_passo: [[130, 20, 60, 120, "🔥 Il varco del Passo: due rupi e una luce arancio in mezzo. Nessuno l'ha attraversato. Fino a stasera."], [40, 130, 120, 40, "🚢 La Normanna, atterrata storta. Jolly giura che era voluto."], [200, 40, 120, 60, "🪨 Rottami che girano piano: le navi di chi ci ha provato prima."]],
    ms_tana: [[0, 80, 320, 30, "🫘 Bozzoli in fila, a perdita d'occhio. In alcuni, una maglia. In altri, qualcuno che respira ancora."], [0, 140, 320, 40, "✨ Fiumi d'oro sul pavimento: lo sciame dorme qui. Non svegliatelo. Troppo tardi."], [120, 30, 80, 50, "🌀 Lo sciame gira sopra le teste, come un pensiero che non trova pace."]],
    ms_cuore: [[100, 30, 120, 120, "🟡 Il Gigante: un pallone fatto di bozzoli, grande come uno stadio. Batte. Ha un cuore. Ha diciannove squadre dentro."], [80, 130, 170, 30, "⚽ I rapiti di Orizzonte, in piedi, immobili. Aspettano un fischio che non arriva."], [0, 0, 320, 30, "🕸️ Cavi che scendono dal buio. Tengono su il Gigante. O lo trattengono."]],
    ms_flotta: [[0, 100, 320, 80, "⛵ Mille barche legate insieme. Si nasce su una, si muore su un'altra, si litiga su tutte."], [210, 70, 60, 40, "🌅 Il sole cala sulla Flotta. Qui il tramonto è l'unica cosa che nessuno ripara."], [0, 10, 320, 50, "🐦 Gabbiani. Sulla Flotta hanno un nome ciascuno. E un debito."]],
    ms_pragia: [[196, 60, 92, 56, "🏥 Il Blocco Bianco: dove Cerbero «allenava» i ragazzi speciali. Le finestre sono rosse anche di giorno."], [20, 66, 130, 50, "🏟️ La tribuna arrugginita: nessuno ci si siede da anni. Qualcuno ci ha scritto «ZERO» con lo spray."], [60, 140, 200, 40, "⚽ Il campo di Pragia: l'erba è cresciuta sopra le linee. Le porte, invece, sono ancora lì."]],
    ms_relitto: [[144, 64, 32, 32, "🟡 Il cuore della nave: batte ancora, lento. Ogni battito fa tremare le costole."], [0, 120, 320, 40, "🫘 Bozzoli d'oro in fila. Dentro qualcuno respira? EDI dice di no. Lo dice due volte."], [240, 100, 30, 46, "📡 Una macchina accesa in mezzo al buio. Ti guarda. Poi guarda di nuovo, come se fossero in tanti a guardare."]],
    ms_purgatorio: [[30, 96, 260, 54, "⛓️ Cento celle, cento oblò. Uno solo lampeggia rosso, al centro. Indovina chi c'è dentro."], [140, 40, 40, 60, "🔦 Il faro di sorveglianza: gira, illumina, conta. Non sbaglia mai il conto."], [250, 20, 40, 30, "🌕 La luna. L'unica cosa che dal Purgatorio si vede gratis."]],
    ms_cella: [[130, 96, 60, 60, "🪑 La sedia: cinghie spezzate da dentro. Nessuno ha mai capito come."], [60, 176, 200, 16, "🖥️ «STASI · LIVELLO 3 · SPENTO». Qualcuno ha premuto spegni. Più volte. Con rabbia."], [100, 30, 120, 40, "🔴 La luce rossa: batte come un cuore che non ha più voglia di aspettare."]],
    ms_illio: [[216, 0, 50, 116, "🏙️ La Torre Dantis: oro, vetro e ottanta piani di contratti firmati."], [20, 136, 280, 30, "🛥️ Yacht bianchi: si chiamano tutti come una vittoria. Nessuno ha mai vinto niente."], [40, 18, 40, 34, "☀️ Il sole di Illio: anche lui sembra in affitto."]],
    ms_torre: [[20, 10, 280, 110, "🌇 La città ai tuoi piedi. Da quassù sembra tutto in vendita. Lo è."], [90, 136, 140, 44, "🧾 La scrivania di vetro: rotte, nomi, firme. Diciannove paesi in una lista."], [256, 136, 30, 30, "🟡 Una lampada a forma di pallone, d'oro. Brutta. Costosissima. Inutile. Perfetta."]],
    ms_isola: [[190, 106, 110, 56, "🛸 Il relitto viola della navetta di Tali. «Non è colpa mia (quasi)», c'è scritto sopra."], [30, 86, 120, 30, "🤖 Gli automi delle saline: proteggono il sale. Nessuno ricorda più perché."], [240, 8, 40, 40, "☀️ Un sole che non perdona: qui l'ombra è una moneta."]],
    ms_orizzonte: [[100, 30, 120, 80, "✨ Lo sciame d'oro: ronza sopra il paese e lo tiene fermo, come una mano sulla bocca."], [70, 136, 180, 44, "⚽ Il campo della finale di domani. Le porte hanno la rete rattoppata, ma sono pronte."], [150, 120, 20, 44, "👤 Il Prelato: una sagoma più alta delle altre. Quando si ferma lui, si ferma tutto."]],
    ms_titolo: [[60, 100, 110, 40, "🚢 La Normanna: scafo nuovo, nome vecchio. Il primo viaggio è quello che ricordi; questo, forse, è quello che ti ricorderà."], [228, 40, 70, 90, "🔥 Il Passo d'Omega: un varco tra le rupi e una luce che non dovrebbe esserci. Nessuno è tornato a raccontarla."], [226, 112, 60, 22, "👁️ Sagome in fila, maschere scure, occhi gialli. Non si muovono. Aspettano."]],
    ms_normanna: [[110, 70, 100, 56, "🧭 La Sala Tattica: dentro c'è il Mediterraneo in luce e un uomo che fuma da lontano."], [230, 138, 60, 28, "📦 Container di Cerbero. «Non aprire», c'è scritto. L'ultima volta che qualcuno ha obbedito era il Medioevo."], [256, 18, 30, 26, "☀️ Il sole del Mediterraneo. Due anni fa, l'ultima cosa che ricordi è il buio. Oggi è bello vederlo."]],
    ms_sala: [[140, 2, 40, 60, "🚬 Il Signor Fumo, in ologramma. Il fumo è vero, giura Jolly. EDI dice che è una simulazione. Lui non commenta."], [90, 80, 140, 50, "🗺️ Diciannove puntini rossi sul Mediterraneo. Diciannove spogliatoi vuoti."], [226, 72, 22, 22, "🔥 Il Passo d'Omega: un punto arancio che pulsa. Come un cuore che non dovrebbe battere."]],
    ms_omega: [[120, 74, 80, 56, "🍸 L'Aldilà: si entra vivi, di solito. Aria guarda tutto dal balcone."], [240, 150, 50, 30, "👁️ Tre figure con maschere scure, ferme sotto la pioggia. Quando ti giri, non ci sono più."], [30, 60, 50, 20, "💰 Il Banco dei Pegni: tutto ha un prezzo, a Omega. Anche le promesse. Soprattutto quelle."]],
    ms_aldila: [[220, 56, 90, 54, "👑 Il balcone di Aria: da lì vede tutto Omega. E Omega lo sa."], [10, 96, 110, 44, "🍸 Il bancone: bicchieri blu, debiti scritti sotto il vetro, un cocktail chiamato «Domani»."], [70, 148, 184, 44, "💃 La pista: luci che cambiano a tempo. Nessuno balla davvero. Tutti guardano chi entra."]],
    ms_lab: [[10, 20, 110, 90, "🧪 Provette che ribollono. Il Professore le chiama per nome. Una si chiama «Signora Pazienza»."], [186, 100, 30, 34, "⚽ Un pallone sezionato a spicchi. Dentro, una colla che non dovrebbe esistere."], [150, 24, 150, 70, "🎶 La lavagna: formule, note musicali e una scritta in stampatello. Il secondo atto non è finito."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
