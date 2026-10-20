// js/circuiti-bg.js - sfondi di «NEO-RONDINE 2099» (320x200): titolo, vicoli, officina, monorotaia, cupola, terrazza, sala server. Pioggia, neon, monorotaia in corsa, ologrammi.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const NEON = ["#22d3ee", "#f0abfc", "#fb7185", "#a3e635", "#fbbf24"];
  const rain = (g, f, W, H, n, a) => { g.strokeStyle = `rgba(160,220,255,${a || 0.35})`; g.lineWidth = 1; for (let i = 0; i < n; i++) { const x = (rnd(i) * (W + 40) + f * 1.2 * (0.6 + rnd(i + 3))) % (W + 40) - 20, y = (rnd(i + 7) * H + f * (5 + rnd(i + 5) * 4)) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y + 9); g.stroke(); } };
  const sign = (g, x, y, w, h, c, f, txt, k) => { const fl = (Math.floor(f / 7 + (k || 0) * 3) % 23) === 0; R(g, x, y, w, h, "#0a0a18"); g.strokeStyle = fl ? "rgba(255,255,255,.2)" : c; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2); if (!fl) { GL(g, x + w / 2, y + h / 2, w, c === "#22d3ee" ? "34,211,238" : c === "#f0abfc" ? "240,171,252" : "251,113,133", 0.35); g.fillStyle = c; g.font = "bold 8px monospace"; g.textAlign = "center"; g.fillText(txt, x + w / 2, y + h / 2 + 3); g.textAlign = "left"; } };
  const towers = (g, W, y, f, seed, c1, c2) => { for (let i = 0; i < 12; i++) { const h = 40 + rnd(i + seed) * 70, x = i * 28 - 10, w = 20 + rnd(i + seed + 9) * 14; R(g, x, y - h, w, h, i % 2 ? c1 : c2); for (let k = 0; k < 12; k++) if (rnd(i * 31 + k + seed) > 0.45) R(g, x + 3 + (k % 3) * 6, y - h + 5 + Math.floor(k / 3) * 9, 3, 4, `rgba(${[ "34,211,238", "251,191,36", "240,171,252" ][Math.floor(rnd(k + i) * 3)]},.7)`); if (rnd(i + seed + 2) > 0.6) { R(g, x + w / 2 - 1, y - h - 10, 2, 10, "#334155"); R(g, x + w / 2 - 1, y - h - 10, 2, 2, (Math.floor(f / 18) + i) % 2 ? "#f43f5e" : "#450a0a"); } } };
  const mono = (g, f, y, W, off) => { const x = ((f * 4 + off) % (W + 160)) - 120; R(g, x, y, 110, 12, "#cbd5e1"); R(g, x, y + 8, 110, 4, "#475569"); for (let i = 0; i < 6; i++) R(g, x + 6 + i * 17, y + 3, 11, 4, "#fde68a"); T(g, [x + 110, y, x + 124, y + 6, x + 110, y + 12], "#94a3b8"); GL(g, x + 120, y + 6, 24, "255,255,220", 0.5); };
  const hexfloor = (g, y0, W, H, f, c) => { for (let r = 0; r < 5; r++) for (let i = -1; i < 15; i++) { const x = i * 26 + (r % 2) * 13, y = y0 + r * 14; g.strokeStyle = c; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 6; k++) { const a = (Math.PI / 3) * k; g.lineTo(x + Math.cos(a) * 11, y + Math.sin(a) * 6); } g.closePath(); g.stroke(); if ((i * 3 + r * 5 + Math.floor(f / 12)) % 11 === 0) { g.fillStyle = "rgba(34,211,238,.25)"; g.fill(); } } };
  const SC = {
    nr_titolo(g, W, H, f) {
      VG(g, 0, 140, "#0a0420", "#4c1d95"); g.fillRect(0, 0, W, 150); GL(g, 250, 60, 90, "240,171,252", 0.3);
      towers(g, W, 150, f, 4, "#150a30", "#1e1042"); mono(g, f, 62, W, 40);
      sign(g, 200, 82, 90, 22, "#f0abfc", f, "VEKTOR", 1); sign(g, 28, 100, 70, 18, "#22d3ee", f, "NEO-RONDINE", 2);
      VG(g, 150, 200, "#12082a", "#05030f"); g.fillRect(0, 150, W, 50); for (let i = 0; i < 5; i++) { R(g, 20 + i * 60, 152 + (i % 2) * 8, 40, 2, `rgba(${i % 2 ? "34,211,238" : "240,171,252"},.35)`); }
      rain(g, f, W, H, 70, 0.3); g.font = "900 15px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#e0f2fe"; g.shadowColor = "#22d3ee"; g.shadowBlur = 12; g.fillText("NEO-RONDINE 2099", 160, 172); g.shadowBlur = 0; g.fillStyle = "#f0abfc"; g.font = "700 9px monospace"; g.fillText("IL CAMPIONATO DEI CIRCUITI D'ORO", 160, 188); g.textAlign = "left"; VIG(g, W, H, 0.45);
    },
    nr_vicoli(g, W, H, f) {
      VG(g, 0, 200, "#0b0720", "#1a1040"); g.fillRect(0, 0, W, 200);
      R(g, 0, 0, 90, 150, "#140c30"); R(g, 230, 0, 90, 150, "#120a2c"); for (let i = 0; i < 6; i++) { R(g, 8 + (i % 2) * 40, 12 + i * 22, 24, 12, "#0a0618"); if (rnd(i + 3) > 0.4) R(g, 10 + (i % 2) * 40, 14 + i * 22, 20, 8, "rgba(251,191,36,.55)"); }
      sign(g, 236, 30, 70, 18, "#22d3ee", f, "CYBER-BAR", 5); sign(g, 6, 92, 54, 14, "#fb7185", f, "CHIPS", 8);
      R(g, 100, 40, 120, 110, "#0f0a26"); for (let i = 0; i < 4; i++) R(g, 112 + i * 28, 56, 16, 90, "#171040");
      g.strokeStyle = "#1e1b4b"; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(0, 20 + k * 12); for (let x = 0; x <= W; x += 20) g.lineTo(x, 20 + k * 12 + Math.sin(x / 38 + k + f / 40) * 5 + 6); g.stroke(); }
      R(g, 0, 150, W, 50, "#0a0818"); for (let i = 0; i < 4; i++) { const px = 40 + i * 70; R(g, px, 164 + (i % 2) * 12, 52, 8, "rgba(34,211,238,.18)"); R(g, px + 6, 166 + (i % 2) * 12, 40, 2, `rgba(240,171,252,${0.4 + 0.2 * Math.sin(f / 9 + i)})`); }
      R(g, 110, 148, 40, 14, "#1e293b"); R(g, 114, 146, 32, 4, "#334155"); C(g, 262, 124, 5, (Math.floor(f / 14) % 2) ? "#f43f5e" : "#7f1d1d"); R(g, 258, 124, 8, 24, "#1e293b");
      rain(g, f, W, H, 90, 0.35); VIG(g, W, H, 0.5);
    },
    nr_officina(g, W, H, f) {
      VG(g, 0, 200, "#06140f", "#0e2a22"); g.fillRect(0, 0, W, 200); R(g, 0, 140, W, 60, "#0a1a16");
      for (let i = 0; i < 4; i++) { const x = 18 + i * 76; R(g, x, 22, 58, 38, "#061a12"); g.strokeStyle = "#22c55e"; g.lineWidth = 1; g.strokeRect(x + 1.5, 23.5, 55, 35); g.beginPath(); g.moveTo(x + 4, 50); for (let k = 0; k < 50; k += 3) g.lineTo(x + 4 + k, 40 + Math.sin((k + f * 0.8 + i * 9) / 5) * (6 + i)); g.stroke(); GL(g, x + 29, 41, 50, "34,197,94", 0.16); }
      R(g, 20, 100, 90, 44, "#1e293b"); R(g, 24, 96, 82, 6, "#334155"); for (let i = 0; i < 3; i++) R(g, 34 + i * 24, 70 - (i % 2) * 8, 6, 30, "#64748b"); T(g, [60, 70, 80, 70, 90, 100, 50, 100], "#475569");
      R(g, 150, 90, 12, 54, "#cbd5e1"); R(g, 144, 86, 24, 8, "#94a3b8"); R(g, 150, 70, 6, 20, "#94a3b8"); sparks(g, 156, 98, f);
      R(g, 220, 112, 80, 32, "#1e293b"); for (let i = 0; i < 5; i++) { R(g, 226 + i * 14, 118, 10, 20, "#0f172a"); R(g, 228 + i * 14, 120, 6, 4, i % 2 ? "#22d3ee" : "#a3e635"); }
      VIG(g, W, H, 0.45);
    },
    nr_monorotaia(g, W, H, f) {
      VG(g, 0, 150, "#0b1326", "#334155"); g.fillRect(0, 0, W, 160); GL(g, 80, 40, 110, "186,230,253", 0.22); towers(g, W, 130, f, 11, "#0f172a", "#172033");
      R(g, 0, 118, W, 5, "#475569"); for (let i = 0; i < 8; i++) R(g, 10 + i * 42, 123, 5, 40, "#334155"); mono(g, f, 104, W, 0);
      R(g, 0, 160, W, 40, "#1e293b"); for (let i = 0; i < 10; i++) R(g, i * 34, 160, 3, 40, "#0f172a"); R(g, 0, 160, W, 4, "#facc15"); for (let i = 0; i < 8; i++) R(g, i * 40 + 6, 172, 22, 3, "#475569");
      sign(g, 220, 134, 88, 16, "#fbbf24", f, "LIVELLO 02 ▲", 4); rain(g, f, W, H, 50, 0.2); g.fillStyle = "rgba(200,220,255,.08)"; g.fillRect(0, 60, W, 70); VIG(g, W, H, 0.4);
    },
    nr_cupola(g, W, H, f) {
      VG(g, 0, 200, "#05030f", "#1e1b4b"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI; g.strokeStyle = "rgba(34,211,238,.25)"; g.lineWidth = 1; g.beginPath(); g.moveTo(160, -40); g.lineTo(160 + Math.cos(a) * 260, 90 + Math.sin(a) * 60); g.stroke(); }
      for (let r = 0; r < 4; r++) for (let i = 0; i < 40; i++) { const x = i * 8 + (r % 2) * 4, y = 60 + r * 11; C(g, x, y, 2.2, `hsla(${(i * 37 + r * 70 + f * 2) % 360},80%,65%,.8)`); }
      VG(g, 100, 200, "#0f172a", "#1e1b4b"); g.fillRect(0, 100, W, 100); hexfloor(g, 112, W, H, f, "rgba(34,211,238,.45)");
      R(g, 0, 98, W, 2, "#22d3ee"); GL(g, 160, 150, 90, "56,189,248", 0.35); const zz = 160 + Math.sin(f / 30) * 12; R(g, zz - 8, 124, 16, 30, "rgba(56,189,248,.55)"); C(g, zz, 120, 7, "rgba(224,242,254,.85)"); R(g, zz - 8, 108, 16, 3, "#fde047");
      for (let i = 0; i < 2; i++) { const x = i ? 296 : 16; R(g, x, 118, 3, 70, "#f43f5e"); R(g, x, 118, 24, 3, "#f43f5e"); } R(g, 140, 62, 40, 4, "rgba(240,171,252,.8)"); VIG(g, W, H, 0.4);
    },
    nr_terrazza(g, W, H, f) {
      VG(g, 0, 140, "#020617", "#1e1b4b"); g.fillRect(0, 0, W, 150); g.fillStyle = "rgba(15,23,42,.8)"; for (let i = 0; i < 6; i++) { C(g, 40 + i * 60 + Math.sin(f / 50 + i) * 8, 30 + (i % 3) * 14, 30, "rgba(30,41,59,.85)"); }
      if (f % 140 < 6) { g.strokeStyle = "rgba(220,230,255,.9)"; g.lineWidth = 2; g.beginPath(); g.moveTo(210, 0); g.lineTo(196, 40); g.lineTo(208, 44); g.lineTo(188, 86); g.stroke(); g.fillStyle = "rgba(200,220,255,.12)"; g.fillRect(0, 0, W, H); }
      towers(g, W, 150, f, 21, "#0f172a", "#111a30"); R(g, 0, 150, W, 50, "#1e293b"); R(g, 0, 150, W, 4, "#64748b"); for (let i = 0; i < 12; i++) R(g, i * 28, 154, 2, 40, "#475569");
      C(g, 70, 166, 26, "#0f172a"); g.strokeStyle = "#fbbf24"; g.lineWidth = 2; g.beginPath(); g.arc(70, 166, 22, 0, 7); g.stroke(); g.fillStyle = "#fbbf24"; g.font = "bold 18px sans-serif"; g.textAlign = "center"; g.fillText("H", 70, 173); g.textAlign = "left";
      rain(g, f, W, H, 120, 0.4); VIG(g, W, H, 0.5);
    },
    nr_penthouse(g, W, H, f) {
      VG(g, 0, 200, "#030712", "#1e1b4b"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 8; i++) { g.strokeStyle = "rgba(100,116,139,.35)"; g.beginPath(); g.moveTo(i * 46 - 20, 0); g.lineTo(160, 90); g.lineTo(i * 46 + 26, 0); g.stroke(); }
      R(g, 138, 20, 44, 140, "#0f172a"); R(g, 144, 20, 32, 140, "#172554"); for (let i = 0; i < 14; i++) { const y = 24 + ((i * 11 + f * 1.5) % 132); R(g, 148, y, 2 + (i % 3) * 8, 2, i % 2 ? "#fde047" : "#22d3ee"); R(g, 162, 24 + ((i * 17 + f) % 132), 8, 2, "#fde047"); } GL(g, 160, 90, 110, "250,204,21", 0.28 + Math.sin(f / 14) * 0.05);
      R(g, 0, 160, W, 40, "#0b1020"); hexfloor(g, 170, W, H, f, "rgba(250,204,21,.3)"); R(g, 30, 140, 70, 20, "#1e293b"); for (let i = 0; i < 6; i++) R(g, 34 + i * 11, 144, 8, 8, ((f >> 4) + i) % 3 ? "#22d3ee" : "#f0abfc"); R(g, 220, 130, 80, 30, "#1e293b"); R(g, 226, 136, 68, 14, "#0a0a18"); VIG(g, W, H, 0.5);
    }
  };
  function sparks(g, x, y, f) { for (let i = 0; i < 8; i++) { const t = ((f * 1.3 + i * 11) % 36) / 36; R(g, x + (rnd(i) - 0.5) * 40 * t, y - t * 24 + t * t * 34, 2, 2, `rgba(255,${190 + Math.floor(rnd(i + 5) * 60)},80,${1 - t})`); } }
  const HOT = {
    nr_titolo: [[200, 82, 90, 22, "🏢 L'insegna Vektor: «Il monopolio della luce elettrica sopra la nebbia»."], [10, 60, 140, 40, "🚝 La monorotaia: il treno a levitazione che unisce il fango ai cieli."], [20, 100, 90, 40, "📺 Lo schermo dei Bassifondi: «Torneo clandestino: iscrizioni aperte al Livello 01»."]],
    nr_vicoli: [[40, 164, 230, 30, "💧 Pozzanghera neon: l'acqua riflette l'insegna intermittente del Cyber-Bar."], [110, 146, 40, 16, "🗑️ Cassonetto dei chip: componenti scartate dai laboratori del piano superiore."], [0, 20, 320, 28, "🔌 Cavi aerei: fili in fibra ottica allacciati abusivamente alla linea elettrica."]],
    nr_officina: [[18, 22, 290, 38, "🖥️ Monitor diagnostici: grafici di telemetria e impulsi di tiro di Rusty Jax."], [144, 70, 28, 74, "🔧 Torchio idraulico: un pistone rinforzato per calibrare sfere metalliche."], [220, 112, 80, 32, "🔋 Cassetta delle batterie: celle al litio pronte per alimentare il trasmettitore EMP."]],
    nr_monorotaia: [[0, 100, 320, 30, "🚝 Il binario sospeso: ogni quattro minuti passa il treno, ogni dieci passa un controllo."], [220, 134, 88, 16, "🪧 Il pannello: «Livello 02 ▲». Il Livello 01 non compare sulla mappa."], [0, 160, 320, 40, "⚠️ La banchina: una riga gialla che separa chi sale da chi resta."]],
    nr_cupola: [[0, 56, 320, 40, "👥 Tifosi olografici: applaudono sempre, anche quando non c'è nessuno."], [120, 104, 80, 54, "🤖 Z-Zero: il portiere quantistico, imbattuto, ha i pali al posto del cuore."], [10, 110, 300, 80, "⬡ Il pavimento a esagoni: si illumina dove cammina chi sta vincendo."]],
    nr_terrazza: [[0, 150, 320, 50, "🏙️ Il parapetto: seicento metri di pioggia senza il minimo rumore."], [40, 140, 60, 50, "🚁 L'eliporto olografico: H, un cerchio d'oro e nessun elicottero vero."], [180, 0, 80, 90, "⚡ Il fulmine: arriva in ritardo, come ogni cosa che non è stata autorizzata."]],
    nr_penthouse: [[138, 20, 44, 140, "💾 La colonna dei dati: miliardi di stringhe che controllano ogni risultato sportivo."], [30, 140, 70, 20, "⌨️ La consolle master: la tastiera quantistica che attende il codice di sblocco."], [220, 130, 80, 30, "🌃 Il parapetto panoramico: a seicento metri la pioggia sembra immobile."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
