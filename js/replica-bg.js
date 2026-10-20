// js/replica-bg.js - sfondi de «EROI IN REPLICA» (320x200): titolo, borgo, Lega Celeste, archivio, stadio. Animati (nuvole, luci, volo), con punti da toccare.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const cloud = (g, x, y, s, a) => { C(g, x, y, 10 * s, `rgba(255,255,255,${a})`); C(g, x + 11 * s, y + 3 * s, 8 * s, `rgba(255,255,255,${a})`); C(g, x - 11 * s, y + 3 * s, 8 * s, `rgba(255,255,255,${a})`); R(g, x - 16 * s, y + 3 * s, 32 * s, 8 * s, `rgba(255,255,255,${a})`); };
  const clouds = (g, f, W, n, y0, a) => { for (let i = 0; i < n; i++) cloud(g, ((i * 97 + f * (0.15 + i * 0.05)) % (W + 60)) - 30, y0 + (i % 3) * 14, 1 + (i % 2) * 0.5, a); };
  // eroe in volo (mantello che ondeggia)
  const hero = (g, x, y, f, s, cape, suit) => {
    const w = Math.sin(f / 5) * 3 * s;
    T(g, [x - 4 * s, y, x - 24 * s, y + 6 * s + w, x - 22 * s, y + 12 * s + w, x - 3 * s, y + 7 * s], cape);
    R(g, x - 6 * s, y - 3 * s, 14 * s, 9 * s, suit); C(g, x + 10 * s, y - 2 * s, 4 * s, "#e0b890"); R(g, x + 12 * s, y + 1 * s, 8 * s, 3 * s, suit);
  };
  const city = (g, W, y, c1, c2, seed) => { for (let i = 0; i < 18; i++) { const h = 14 + rnd(i + seed) * 40, x = i * 18; R(g, x, y - h, 16, h, i % 2 ? c1 : c2); for (let k = 0; k < 4; k++) if (rnd(i * 7 + k + seed) > 0.5) R(g, x + 3 + (k % 2) * 6, y - h + 4 + Math.floor(k / 2) * 8, 3, 4, "rgba(253,224,71,.7)"); } };
  const SC = {
    rp_titolo(g, W, H, f) {
      VG(g, 0, 130, "#0b2a5a", "#fbbf8a"); g.fillRect(0, 0, W, 130); GL(g, 250, 108, 80, "255,200,120", 0.45); C(g, 250, 112, 14, "#fde68a"); clouds(g, f, W, 5, 20, 0.7);
      city(g, W, 150, "#1e2a4a", "#26335a", 3); R(g, 0, 150, W, 50, "#141c34");
      hero(g, 70 + Math.sin(f / 40) * 6, 60 + Math.sin(f / 30) * 4, f, 1.1, "#e11d48", "#2563eb"); hero(g, 190 + Math.sin(f / 50) * 8, 40 - Math.sin(f / 35) * 3, f + 20, 2.2, "#fbbf24", "#1d4ed8");
      g.font = "900 16px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#fff7e0"; g.fillText("EROI IN REPLICA", 160, 168); g.fillStyle = "#7dd3fc"; g.font = "700 10px Georgia, serif"; g.fillText("il cielo è un palcoscenico", 160, 184); VIG(g, W, H, 0.4);
    },
    rp_borgo(g, W, H, f) {
      VG(g, 0, 120, "#7ec8f0", "#e8f4ff"); g.fillRect(0, 0, W, 120); clouds(g, f, W, 4, 18, 0.85);
      T(g, [0, 120, 60, 80, 120, 120], "#7aa68a"); T(g, [90, 120, 170, 70, 250, 120], "#6a9a7a"); T(g, [200, 120, 280, 84, 320, 120], "#7aa68a");
      R(g, 0, 120, W, 80, "#6a9a58"); for (let i = 0; i < 14; i++) R(g, i * 24 + ((f * 0.1) % 24), 170 + (i % 3) * 8, 2, 4, "#85b86e");
      R(g, 30, 74, 70, 50, "#c9a27a"); T(g, [24, 74, 65, 44, 106, 74], "#b9533a"); R(g, 58, 96, 14, 28, "#6b4528"); R(g, 38, 84, 12, 12, "#bae6fd"); R(g, 80, 84, 12, 12, "#bae6fd"); R(g, 86, 50, 6, 18, "#8a5a44");
      for (let i = 0; i < 3; i++) C(g, 94 + Math.sin(f / 14 + i) * 4, 42 - i * 10 - ((f * 0.4) % 12), 3 + i, `rgba(235,235,240,${0.5 - i * 0.12})`);
      R(g, 190, 100, 3, 24, "#5a3a22"); C(g, 191, 92, 16, "#3f7a48"); C(g, 182, 100, 11, "#4a8a54"); C(g, 202, 99, 11, "#4a8a54");
      hero(g, 250 + Math.sin(f / 36) * 20, 50 + Math.sin(f / 22) * 5, f, 1.3, "#dc2626", "#1d4ed8"); VIG(g, W, H, 0.2);
    },
    rp_lega(g, W, H, f) {
      VG(g, 0, 200, "#1e3a8a", "#bae6fd"); g.fillRect(0, 0, W, 200); clouds(g, f, W, 6, 130, 0.5); clouds(g, f * 1.3, W, 4, 150, 0.35);
      R(g, 100, 40, 120, 90, "#e2e8f0"); R(g, 90, 36, 140, 8, "#f8fafc"); for (let i = 0; i < 6; i++) { R(g, 106 + i * 20, 52, 10, 68, "#cbd5e1"); R(g, 108 + i * 20, 52, 2, 68, "#f1f5f9"); }
      T(g, [96, 36, 160, 8, 224, 36], "#94a3b8"); C(g, 160, 24, 8, "#fbbf24"); GL(g, 160, 24, 40, "255,220,120", 0.4 + Math.sin(f / 10) * 0.08); R(g, 140, 100, 40, 30, "#475569"); R(g, 152, 108, 16, 22, "#fde68a");
      R(g, 0, 150, W, 50, "#cbd5e1"); for (let i = 0; i < 8; i++) R(g, i * 42 - (f * 0.3) % 42, 172, 24, 3, "#94a3b8");
      for (let i = 0; i < 3; i++) hero(g, ((f * (1 + i * 0.3) + i * 110) % 380) - 30, 70 + i * 22, f + i * 9, 0.8, ["#e11d48", "#7c3aed", "#0d9488"][i], ["#2563eb", "#f59e0b", "#1e293b"][i]);
      VIG(g, W, H, 0.25);
    },
    rp_archivio(g, W, H, f) {
      VG(g, 0, 200, "#111827", "#1f2937"); g.fillRect(0, 0, W, 200);
      for (let c = 0; c < 4; c++) { const x = 8 + c * 78; R(g, x, 30, 66, 120, "#3a2a1c"); for (let r = 0; r < 6; r++) { R(g, x + 2, 34 + r * 19, 62, 3, "#241810"); for (let k = 0; k < 8; k++) R(g, x + 4 + k * 7.5, 21 + r * 19 - (k % 3), 5, 13 + (k % 3), ["#7f1d1d", "#1e3a8a", "#14532d", "#78350f", "#581c87"][Math.floor(rnd(c * 9 + r * 3 + k) * 5)]); } }
      GL(g, 160, 20, 120, "255,230,170", 0.28 + Math.sin(f / 18) * 0.05); R(g, 0, 150, W, 50, "#2a2118");
      R(g, 120, 140, 80, 18, "#5a3d24"); R(g, 130, 130, 28, 10, "#f5f0dc"); R(g, 164, 132, 22, 8, "#e8e2c8"); C(g, 150, 125, 5, "#fde047"); GL(g, 150, 125, 30, "255,220,120", 0.5 + Math.sin(f / 7) * 0.1);
      for (let i = 0; i < 22; i++) { const t = ((f * 0.3 + i * 13) % 140) / 140; R(g, rnd(i) * W, 30 + t * 120, 1, 1, `rgba(255,240,200,${0.5 * (1 - t)})`); } VIG(g, W, H, 0.5);
    },
    rp_stadio(g, W, H, f) {
      VG(g, 0, 110, "#1d4ed8", "#fbbf8a"); g.fillRect(0, 0, W, 110); clouds(g, f, W, 4, 22, 0.6);
      T(g, [0, 120, 0, 60, 70, 100, 70, 120], "#475569"); T(g, [320, 120, 320, 60, 250, 100, 250, 120], "#475569");
      for (let r = 0; r < 4; r++) for (let i = 0; i < 30; i++) { C(g, 6 + i * 11 + (r % 2) * 5, 96 + r * 6, 3, `hsl(${(i * 47 + r * 90 + f) % 360},60%,${50 + (i + r + Math.floor(f / 10)) % 2 * 10}%)`); }
      R(g, 0, 120, W, 80, "#3d8a52"); for (let i = 0; i < 8; i++) R(g, i * 42, 120, 21, 80, "rgba(255,255,255,.05)"); R(g, 158, 120, 4, 80, "rgba(255,255,255,.5)"); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 2; g.beginPath(); g.arc(160, 160, 26, 0, 7); g.stroke();
      hero(g, 160 + Math.sin(f / 26) * 60, 56 + Math.cos(f / 20) * 8, f, 2.2, "#fbbf24", "#1d4ed8"); hero(g, 160 - Math.sin(f / 26) * 60, 84 + Math.sin(f / 18) * 6, f + 10, 1.2, "#e11d48", "#2563eb"); VIG(g, W, H, 0.25);
    }
  };
  const HOT = {
    rp_titolo: [[40, 40, 60, 40, "🦸 Un eroe di passaggio: saluta con la mano. Non tutti gli eroi sanno fermarsi."], [160, 150, 150, 30, "🏙️ Una città piccola, un cielo grande e una voce che dice «tutto sotto controllo»."], [230, 90, 40, 40, "🌅 Il tramonto: da qui sembra vero. Da lassù, forse, è un faro."]],
    rp_borgo: [[30, 44, 78, 80, "🏠 Casa tua: il camino fuma, tua madre sta decidendo se la colazione è un problema."], [180, 80, 40, 50, "🌳 L'albero del campo: tuo padre ci ha lasciato un graffio a forma di mano."], [230, 30, 80, 40, "🦸 Qualcuno vola, in alto. È tuo padre, e forse sta salutando."]],
    rp_lega: [[100, 36, 120, 94, "🏛️ La Lega Celeste: marmo, colonne e un portone con più fotografi che serrature."], [140, 100, 40, 30, "🚪 L'ingresso: una luce gialla, un tappeto e una scritta «Eroi, entrate»."], [0, 150, 320, 50, "🛬 La pista d'atterraggio: il segno delle suole lo capisci anche dal vento."]],
    rp_archivio: [[8, 30, 300, 120, "📚 Scaffali: fascicoli, copioni e un'etichetta «Eventi sospetti, non aprire»."], [120, 130, 80, 30, "🕯️ Il tavolo di lettura: una candela per i segreti, una lampada per i verbali."], [0, 150, 320, 50, "🧾 Il pavimento: briciole di carta e polvere di anni di carte importanti."]],
    rp_stadio: [[0, 60, 70, 60, "🏟️ Le tribune: gente comune e due striscioni, uno per ogni parte."], [250, 60, 70, 60, "📣 Il tifo: si divide a metà, come ogni famiglia importante."], [130, 130, 60, 60, "⚪ Il cerchio di centro: da qui parte il duello, e si decide chi ha ragione."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
