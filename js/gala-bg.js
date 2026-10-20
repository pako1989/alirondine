// js/gala-bg.js - sfondi di «IL RAPIMENTO DEL PALLONE D'ORO» (320x200): titolo, giardino sotto la tempesta, salone da ballo, sala da pranzo, biblioteca, cantina. Candele, camini, lampadari, pioggia.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const rain = (g, f, W, H, n, a) => { g.strokeStyle = `rgba(170,200,255,${a || 0.3})`; g.lineWidth = 1; for (let i = 0; i < n; i++) { const x = (rnd(i) * (W + 40) + f * 1.1 * (0.6 + rnd(i + 3))) % (W + 40) - 20, y = (rnd(i + 7) * H + f * 5 * (0.7 + rnd(i + 9))) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y + 9); g.stroke(); } };
  const flame = (g, x, y, f, k) => { const h = 4 + Math.sin(f / 3 + k) * 1.4; R(g, x - 0.5, y, 1.5, 5, "#fef3c7"); T(g, [x - 1.8, y, x, y - h - 2, x + 1.8, y], "#f97316"); T(g, [x - 0.9, y, x, y - h, x + 0.9, y], "#fde68a"); GL(g, x, y - 2, 12, "255,190,90", 0.35); };
  const chand = (g, x, y, f, w) => { R(g, x - 0.5, 0, 1.2, y, "#6b5a3a"); R(g, x - w / 2, y, w, 2, "#d4a73a"); for (let i = 0; i < 5; i++) flame(g, x - w / 2 + 3 + i * (w - 6) / 4, y - 2, f, i + x); for (let i = 0; i < 6; i++) R(g, x - w / 2 + 2 + i * (w - 4) / 5, y + 2, 0.8, 5 + (i % 2) * 3, "rgba(255,235,180,.6)"); };
  const SC = {
    pd_titolo(g, W, H, f) {
      VG(g, 0, 200, "#0b0a16", "#241a30"); g.fillRect(0, 0, W, 200); GL(g, 250, 40, 80, "180,190,255", 0.18); C(g, 250, 36, 12, "#e5e7eb"); C(g, 254, 34, 11, "#241a30");
      for (let i = 0; i < 30; i++) R(g, rnd(i) * W, rnd(i + 5) * 70, 1, 1, `rgba(255,255,255,${0.4 + 0.4 * Math.sin(f / 20 + i)})`);
      R(g, 0, 120, W, 80, "#10241a"); for (let i = 0; i < 10; i++) T(g, [i * 36 - 10, 128, i * 36 + 10, 70 + rnd(i) * 18, i * 36 + 30, 128], "#0c1c14");
      R(g, 70, 70, 180, 70, "#d9ccaa"); T(g, [60, 72, 160, 36, 260, 72], "#7c2d12"); R(g, 150, 48, 20, 20, "#d9ccaa"); T(g, [146, 50, 160, 36, 174, 50], "#7c2d12");
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const on = (Math.floor(f / 40) + i * 3 + j) % 4 !== 0; R(g, 84 + i * 40, 82 + j * 26, 16, 16, on ? "#fde68a" : "#1e293b"); if (on) GL(g, 92 + i * 40, 90 + j * 26, 22, "255,220,120", 0.22); }
      R(g, 148, 106, 24, 34, "#4a2a14"); R(g, 152, 112, 16, 28, "#7a4a22"); C(g, 160, 124, 1.5, "#d4a73a");
      R(g, 0, 140, W, 60, "#0e1d15"); R(g, 130, 140, 60, 60, "#8f8671");
      g.strokeStyle = "#475569"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 150); g.lineTo(80, 146); g.stroke(); for (let i = 0; i < 6; i++) R(g, 8 + i * 12, 134, 1.5, 16, "#475569");
      const gx = 160, gy = 168, p = 0.5 + 0.5 * Math.sin(f / 12); GL(g, gx, gy, 38 + p * 6, "255,215,90", 0.35); C(g, gx, gy, 12, "#b8860b"); C(g, gx - 1, gy - 1, 10.5, "#facc15"); R(g, gx - 1.2, gy - 8, 2.4, 16, "#a16207"); R(g, gx - 8, gy - 1, 16, 2.4, "#a16207");
      rain(g, f, W, H, 60, 0.28);
      g.font = "900 15px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#fdf6e3"; g.shadowColor = "#d4a73a"; g.shadowBlur = 10; g.fillText("IL RAPIMENTO DEL PALLONE D'ORO", 160, 22); g.shadowBlur = 0; g.font = "700 9px Georgia, serif"; g.fillStyle = "#facc15"; g.fillText("Cena di gala alla Villa Delmonte · nessuno esce", 160, 34); g.textAlign = "left"; VIG(g, W, H, 0.5);
    },
    pd_giardino(g, W, H, f) {
      VG(g, 0, 200, "#0a0f1c", "#16281e"); g.fillRect(0, 0, W, 200);
      for (let i = 0; i < 14; i++) T(g, [i * 26 - 14, 120, i * 26 + 4, 70 + rnd(i) * 26, i * 26 + 22, 120], "#0b1a12");
      R(g, 60, 52, 200, 70, "#d9ccaa"); T(g, [48, 54, 160, 14, 272, 54], "#7c2d12"); for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { const on = (Math.floor(f / 50) + i + j) % 5 !== 0; R(g, 72 + i * 30, 64 + j * 26, 14, 16, on ? "#fde68a" : "#1e293b"); if (on) GL(g, 79 + i * 30, 72 + j * 26, 20, "255,220,120", 0.18); }
      R(g, 150, 98, 20, 24, "#4a2a14"); R(g, 0, 122, W, 78, "#15281d"); R(g, 120, 122, 80, 78, "#8f8671");
      for (let i = 0; i < 5; i++) { R(g, 0, 128 + i * 12, 100 - i * 12, 8, "#0f3a1e"); R(g, 220 + i * 12, 128 + i * 12, 100 - i * 12, 8, "#0f3a1e"); }
      C(g, 160, 165, 24, "#9c9686"); C(g, 160, 165, 20, "#2563a0"); R(g, 158, 140, 4, 25, "#cbd5e1"); for (let i = 0; i < 8; i++) { const t = ((f * 0.05 + i / 8) % 1); R(g, 160 + (i - 4) * 3 * t, 140 + t * 24 - Math.sin(t * 3.14) * 14, 1.6, 1.6, `rgba(210,235,255,${1 - t})`); }
      T(g, [255, 200, 280, 130, 305, 200], "#1b2a22"); R(g, 275, 150, 10, 50, "#2b3a30");
      if (Math.floor(f / 70) % 6 === 0) { g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(40, 0); g.lineTo(52, 30); g.lineTo(44, 36); g.lineTo(60, 70); g.stroke(); R(g, 0, 0, W, H, "rgba(220,230,255,.08)"); }
      rain(g, f, W, H, 90, 0.35); VIG(g, W, H, 0.55);
    },
    pd_salone(g, W, H, f) {
      VG(g, 0, 200, "#3b2412", "#7c5a2c"); g.fillRect(0, 0, W, 200); R(g, 0, 0, W, 24, "#2a180c");
      for (let i = 0; i < 5; i++) { R(g, 24 + i * 60, 28, 30, 86, "#1b2a44"); R(g, 26 + i * 60, 30, 26, 82, "#0b1426"); R(g, 22 + i * 60, 28, 4, 90, "#7f1d1d"); R(g, 52 + i * 60, 28, 4, 90, "#7f1d1d"); if (Math.floor(f / 80) % 7 === i) R(g, 26 + i * 60, 30, 26, 82, "rgba(200,220,255,.22)"); }
      for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) R(g, i * 20, 140 + j * 15, 20, 15, (i + j) % 2 ? "#1c1c24" : "#e8e4d8");
      chand(g, 100, 40, f, 50); chand(g, 220, 40, f, 50); R(g, 130, 112, 60, 30, "#0b0b0f"); R(g, 134, 106, 52, 8, "#1f1f2b"); for (let i = 0; i < 12; i++) R(g, 136 + i * 4, 124, 3, 8, "#f8fafc");
      T(g, [14, 200, 40, 120, 66, 200], "rgba(255,200,110,.07)"); flame(g, 20, 130, f, 1); flame(g, 300, 130, f, 2); VIG(g, W, H, 0.4);
    },
    pd_pranzo(g, W, H, f) {
      VG(g, 0, 200, "#2d1612", "#5a2a2a"); g.fillRect(0, 0, W, 200); R(g, 0, 0, W, 20, "#1a0a08");
      for (let i = 0; i < 4; i++) { R(g, 20 + i * 76, 30, 40, 50, "#b8860b"); R(g, 23 + i * 76, 33, 34, 44, "#334155"); R(g, 28 + i * 76, 40, 24, 14, "#cbd5e1"); R(g, 28 + i * 76, 56, 24, 16, "#94a3b8"); }
      R(g, 20, 116, 280, 50, "#f4efe3"); R(g, 20, 160, 280, 8, "#c9b98c"); for (let i = 0; i < 9; i++) { C(g, 42 + i * 28, 140, 7, "#fff"); C(g, 42 + i * 28, 140, 4, "#e5e7eb"); }
      for (let i = 0; i < 5; i++) { R(g, 40 + i * 58, 100, 3, 18, "#b8860b"); flame(g, 41 + i * 58, 98, f, i); }
      R(g, 150, 112, 20, 14, "#b91c1c"); C(g, 160, 108, 6, "#facc15"); chand(g, 160, 32, f, 70); VIG(g, W, H, 0.45);
    },
    pd_biblioteca(g, W, H, f) {
      VG(g, 0, 200, "#24160c", "#3b2616"); g.fillRect(0, 0, W, 200);
      for (let c = 0; c < 4; c++) for (let r = 0; r < 5; r++) { R(g, 6 + c * 80, 10 + r * 28, 70, 3, "#1a100a"); for (let k = 0; k < 14; k++) { const col = ["#9f1239", "#1d4ed8", "#15803d", "#a16207", "#6d28d9", "#0f766e"][Math.floor(rnd(c * 70 + r * 14 + k) * 6)]; R(g, 8 + c * 80 + k * 5, 14 + r * 28, 4, 22 - rnd(k + r) * 5, col); } }
      R(g, 130, 130, 60, 40, "#14532d"); R(g, 130, 126, 60, 6, "#3a2a1a"); C(g, 160, 118, 6, "#facc15"); GL(g, 160, 118, 40, "255,210,110", 0.28);
      R(g, 244, 150, 8, 50, "#6b5a3a"); for (let i = 0; i < 6; i++) R(g, 238, 156 + i * 8, 20, 2, "#6b5a3a");
      T(g, [20, 200, 60, 170, 100, 200], "#6b1e2e"); flame(g, 288, 152, f, 3); VIG(g, W, H, 0.5);
    },
    pd_cantina(g, W, H, f) {
      VG(g, 0, 200, "#0f0d0a", "#2a2622"); g.fillRect(0, 0, W, 200);
      for (let i = 0; i < 5; i++) { T(g, [i * 70 - 20, 70, i * 70 + 15, 20, i * 70 + 50, 70], "#1a1612"); R(g, i * 70 - 20, 70, 70, 4, "#3a342c"); }
      for (let i = 0; i < 4; i++) { C(g, 40 + i * 76, 140, 22, "#6b3a1c"); R(g, 18 + i * 76, 132, 44, 3, "#2b180b"); R(g, 18 + i * 76, 146, 44, 3, "#2b180b"); C(g, 40 + i * 76, 140, 3, "#2b180b"); }
      R(g, 0, 172, W, 28, "#2a251f"); for (let i = 0; i < 12; i++) R(g, i * 28, 172 + (i % 2) * 8, 24, 2, "#4a423a");
      R(g, 150, 60, 20, 30, "#3a2e22"); R(g, 154, 62, 12, 26, "#6b5a3a"); GL(g, 160, 70, 70, "255,150,60", 0.3 + 0.08 * Math.sin(f / 6)); flame(g, 160, 100, f, 0);
      for (let i = 0; i < 10; i++) R(g, (rnd(i) * 320 + f * 0.1) % 320, 40 + rnd(i + 5) * 100, 1, 1, "rgba(255,210,150,.4)"); VIG(g, W, H, 0.6);
    }
  };
  const HOT = {
    pd_titolo: [[130, 140, 60, 56, "🏆 Il Pallone d'Oro: sembra più piccolo, in fotografia. Tra qualche ora, sarà più piccolo ancora."], [70, 50, 180, 90, "🏛️ Villa Delmonte: ottanta stanze, un ponte, nessuna uscita."], [0, 120, 320, 80, "🌧️ Il giardino sotto la tempesta: il ponte crollerà prima del dolce."]],
    pd_giardino: [[130, 150, 60, 40, "⛲ La fontana: un getto d'acqua e l'aria da quadro d'epoca."], [60, 52, 200, 70, "🏛️ La villa: finestre accese, ombre che passano e non salutano."], [255, 130, 50, 70, "🌳 Il gazebo: l'unico posto dove nessuno ti guarda, e tutti lo sanno."]],
    pd_salone: [[130, 104, 60, 40, "🎹 Il pianoforte: lo suona il maggiordomo, quando è sicuro che nessuno ascolti."], [20, 28, 280, 90, "🪟 Le finestre sul giardino: da qui si vede il ponte, o quello che ne resta."], [80, 28, 160, 40, "🕯️ I lampadari: cento candele elettriche, una vera. Indovina."]],
    pd_pranzo: [[20, 110, 280, 62, "🍽️ La lunga tavola: dodici posti, otto invitati, un posto vuoto che pesa."], [20, 30, 280, 50, "🖼️ I ritratti: tutti i presidenti della squadra, tutti con la stessa espressione soddisfatta."], [130, 20, 60, 30, "🕯️ Il lampadario: gocciola cera sul tovagliolo di qualcuno."]],
    pd_biblioteca: [[6, 10, 310, 150, "📚 Gli scaffali: cinquemila libri, una scala, una parete che sembra più profonda."], [130, 118, 60, 56, "📖 La scrivania: la lampada è ancora calda."], [244, 150, 14, 50, "🪜 La scala a pioli: slitta senza rumore, e nessuno sa dove porti."]],
    pd_cantina: [[18, 118, 270, 54, "🛢️ Le botti: odorano di vino e di qualcosa che qualcuno ha bevuto in fretta."], [150, 60, 20, 40, "🕯️ La lanterna: cera ancora tiepida, qualcuno è passato da poco."], [0, 172, 320, 28, "🧱 Il pavimento di pietra: due file di orme, una dentro e una fuori."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
