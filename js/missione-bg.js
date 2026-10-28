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
    }
  };
  const HOT = {
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
