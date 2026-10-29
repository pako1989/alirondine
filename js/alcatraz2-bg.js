// js/alcatraz2-bg.js - Sfondi e scenari di «FUGA DA ALCATRAZ FC 2 · L'ULTIMO RIENTRO» (320x200)
// Falesia Nord e canali di scarico, Dormitorio delle cisterne, Bastione sommerso e Torre Faro.
(function () {
  "use strict";

  const R = (g, x, y, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  const C = (g, x, y, r, c) => {
    g.fillStyle = c;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  };
  const T = (g, a, c) => {
    g.fillStyle = c;
    g.beginPath();
    g.moveTo(a[0], a[1]);
    for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]);
    g.closePath();
    g.fill();
  };
  const rnd = (i) => {
    const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const VG = (g, y0, y1, a, b) => {
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, a);
    gr.addColorStop(1, b);
    g.fillStyle = gr;
  };
  const GL = (g, x, y, r, rgb, a) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},${a})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.save();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
    g.restore();
  };
  const VIG = (g, W, H, a) => {
    const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200);
    gr.addColorStop(0, "rgba(0,0,0,0)");
    gr.addColorStop(1, `rgba(0,0,0,${a})`);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
  };

  const sea = (g, f, W, H, y0) => {
    VG(g, y0, H, "#082f49", "#020617");
    g.fillRect(0, y0, W, H - y0);
    g.strokeStyle = "rgba(56,189,248,0.25)";
    g.lineWidth = 1;
    for (let r = 0; r < 6; r++) {
      const y = y0 + 6 + r * 7;
      g.beginPath();
      for (let x = 0; x <= W; x += 16) {
        const off = Math.sin((x + f * 1.5 + r * 24) / 18) * 3;
        if (x === 0) g.moveTo(x, y + off);
        else g.lineTo(x, y + off);
      }
      g.stroke();
    }
  };

  const rain = (g, f, W, H, n, a) => {
    g.strokeStyle = `rgba(186,230,253,${a || 0.3})`;
    g.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const x = ((rnd(i) * (W + 50) + f * 2.2 * (0.8 + rnd(i + 2))) % (W + 50)) - 25;
      const y = (rnd(i + 7) * H + f * (6 + rnd(i + 3) * 5)) % H;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x - 4, y + 10);
      g.stroke();
    }
  };

  const spot = (g, x, y, angle, len, spread, rgb, a) => {
    g.save();
    g.globalCompositeOperation = "lighter";
    const x2 = x + Math.cos(angle - spread) * len;
    const y2 = y + Math.sin(angle - spread) * len;
    const x3 = x + Math.cos(angle + spread) * len;
    const y3 = y + Math.sin(angle + spread) * len;
    const gr = g.createRadialGradient(x, y, 5, x + Math.cos(angle) * (len * 0.7), y + Math.sin(angle) * (len * 0.7), len);
    gr.addColorStop(0, `rgba(${rgb},${a * 0.7})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x2, y2);
    g.lineTo(x3, y3);
    g.closePath();
    g.fill();
    g.restore();
  };

  const SC = {
    alc2_titolo(g, W, H, f) {
      // Cielo tempestoso notturno su Alcatraz
      VG(g, 0, 130, "#020617", "#0c4a6e");
      g.fillRect(0, 0, W, 130);

      // Sagoma della fortezza su roccia
      T(g, [
        0, 120, 40, 95, 90, 92, 110, 68, 140, 68, 150, 85, 
        210, 85, 225, 60, 245, 60, 255, 92, 290, 95, 320, 120
      ], "#0f172a");

      // Dettagli muraglione e grate
      R(g, 112, 70, 26, 15, "#1e293b");
      R(g, 226, 62, 18, 23, "#1e293b");

      // Torre faro che rotea a ultravioletto / turchese
      const ang = (f * 0.02) % (Math.PI * 2);
      spot(g, 235, 62, ang, 180, 0.28, "56,189,248", 0.55);
      GL(g, 235, 62, 24, "56,189,248", 0.8);

      // Mare in burrasca
      sea(g, f, W, H, 120);

      // Pioggia e riflessi
      rain(g, f, W, H, 65, 0.35);

      // Logo / Titolo principale
      g.font = "900 15px 'Courier New', monospace";
      g.textAlign = "center";
      g.fillStyle = "#38bdf8";
      g.shadowColor = "#0284c7";
      g.shadowBlur = 10;
      g.fillText("FUGA DA ALCATRAZ FC 2", 160, 162);
      g.shadowBlur = 0;
      g.font = "700 9px system-ui, sans-serif";
      g.fillStyle = "#f8fafc";
      g.fillText("L'ULTIMO RIENTRO · SUB-WATER REBOUND", 160, 178);
      g.textAlign = "left";
      VIG(g, W, H, 0.45);
    },

    alc2_falesia(g, W, H, f) {
      // Falesia Nord & Canali di Scarico
      VG(g, 0, 140, "#020617", "#0f172a");
      g.fillRect(0, 0, W, 140);

      // Scogliera a picco sulla sinistra
      T(g, [0, 0, 130, 0, 150, 60, 135, 120, 100, 150, 0, 150], "#1e293b");
      T(g, [0, 20, 115, 20, 130, 75, 120, 125, 80, 150, 0, 150], "#0f172a");

      // Condotto di scarico circolare arrugginito che versa schiuma
      C(g, 122, 105, 16, "#334155");
      C(g, 122, 105, 11, "#020617");
      R(g, 118, 108, 8, 42, "rgba(56,189,248,0.4)");

      // Boa Sonar galleggiante con luce lampeggiante rossa/verde
      const bY = 160 + Math.sin(f * 0.08) * 3;
      C(g, 240, bY, 7, "#e2e8f0");
      C(g, 240, bY - 4, 3, (Math.floor(f / 15) % 2) ? "#ef4444" : "#22c55e");
      GL(g, 240, bY - 4, 12, (Math.floor(f / 15) % 2) ? "239,68,68" : "34,197,94", 0.5);

      // Banchina di cemento e scaletta dei contrabbandieri
      R(g, 20, 130, 60, 70, "#334155");
      for (let s = 0; s < 5; s++) {
        R(g, 35 + s * 5, 135 + s * 8, 12, 3, "#475569");
      }

      // Torretta in alto a destra con riflettore mobile
      R(g, 275, 30, 25, 45, "#1e293b");
      const sAng = Math.PI * 0.75 + Math.sin(f * 0.03) * 0.45;
      spot(g, 287, 35, sAng, 170, 0.22, "250,204,21", 0.5);

      sea(g, f, W, H, 140);
      rain(g, f, W, H, 80, 0.4);
      VIG(g, W, H, 0.4);
    },

    alc2_dormitorio(g, W, H, f) {
      // Dormitorio delle Cisterne (Sotterraneo)
      VG(g, 0, 200, "#090d16", "#1e293b");
      g.fillRect(0, 0, W, 200);

      // Volte a crociera in mattoni
      g.strokeStyle = "#334155";
      g.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const vx = i * 90 + 25;
        g.beginPath();
        g.arc(vx, 40, 42, Math.PI, 0);
        g.stroke();
      }

      // Tubature idrauliche industriali lungo il soffitto
      R(g, 0, 36, W, 8, "#475569");
      R(g, 0, 50, W, 6, "#64748b");
      // Gocciolamento ritmico
      const dropY = 56 + ((f * 3) % 110);
      C(g, 110, dropY, 2, "#38bdf8");

      // La stufa a nafta improvvisata con fusto arancione
      R(g, 60, 120, 32, 48, "#78350f");
      R(g, 66, 136, 20, 16, "#ea580c");
      GL(g, 76, 144, 45, "234,88,12", 0.45 + Math.sin(f * 0.1) * 0.08);

      // Lo specchio scheggiato della barberia di Bruno
      R(g, 180, 85, 34, 45, "#475569");
      R(g, 184, 89, 26, 37, "#94a3b8");
      // Crepa dello specchio
      g.strokeStyle = "#0f172a";
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(194, 89);
      g.lineTo(198, 105);
      g.lineTo(192, 120);
      g.stroke();

      // Il quadro idraulico con manometri
      R(g, 245, 95, 55, 38, "#1e293b");
      g.strokeStyle = "#f59e0b";
      g.strokeRect(247, 97, 51, 34);
      C(g, 260, 112, 6, "#cbd5e1");
      C(g, 275, 112, 6, "#cbd5e1");
      C(g, 290, 112, 6, "#cbd5e1");

      // Pavimento bagnato con pozzanghere riflettenti
      R(g, 0, 168, W, 32, "#0f172a");
      for (let p = 0; p < 4; p++) {
        R(g, 30 + p * 75, 175 + (p % 2) * 8, 48, 5, "rgba(56,189,248,0.22)");
      }
      VIG(g, W, H, 0.45);
    },

    alc2_cisterna(g, W, H, f) {
      // La Cisterna del Bastione Sommerso (Arena da partita 3v3)
      VG(g, 0, 140, "#082f49", "#0f172a");
      g.fillRect(0, 0, W, 140);

      // Paratie metalliche ondulate alle pareti laterali (sponde elastiche)
      for (let s = 0; s < 10; s++) {
        R(g, 8 + (s % 2) * 3, 20 + s * 12, 6, 10, "#64748b");
        R(g, 306 - (s % 2) * 3, 20 + s * 12, 6, 10, "#64748b");
      }

      // Passerella sopraelevata con vetrate della tribuna di guardia
      R(g, 90, 16, 140, 24, "#1e293b");
      for (let w = 0; w < 5; w++) {
        R(g, 98 + w * 26, 20, 20, 14, "rgba(56,189,248,0.45)");
      }

      // Valvola di fondo di ghisa gigante centrale
      C(g, 160, 75, 18, "#334155");
      C(g, 160, 75, 12, "#1e293b");
      for (let sp = 0; sp < 4; sp++) {
        const a = (Math.PI / 2) * sp + (f * 0.015);
        R(g, 160 + Math.cos(a) * 6 - 2, 75 + Math.sin(a) * 6 - 2, 4, 4, "#94a3b8");
      }

      // Sbuffi di vapore bianco a intervalli regolari
      if (Math.sin(f * 0.08) > 0.4) {
        GL(g, 45, 95, 26, "241,245,249", 0.35);
        GL(g, 275, 95, 26, "241,245,249", 0.35);
      }

      // Specchio d'acqua riflettente (campo parzialmente allagato)
      VG(g, 135, 200, "#0c4a6e", "#020617");
      g.fillRect(0, 135, W, 65);

      // Linee del campo sommerse luminescenti
      g.strokeStyle = "rgba(56,189,248,0.6)";
      g.lineWidth = 2;
      g.strokeRect(30, 145, 260, 50);
      g.beginPath();
      g.moveTo(160, 145);
      g.lineTo(160, 195);
      g.stroke();
      g.beginPath();
      g.arc(160, 170, 16, 0, Math.PI * 2);
      g.stroke();

      VIG(g, W, H, 0.4);
    },

    alc2_faro(g, W, H, f) {
      // Torre Faro & Scogliera (Capitolo 4 Finale)
      VG(g, 0, 130, "#020617", "#0c4a6e");
      g.fillRect(0, 0, W, 130);

      // Balconata del faro in primo piano / sinistra
      T(g, [0, 80, 140, 45, 180, 55, 130, 200, 0, 200], "#0f172a");
      // Parapetto di ghisa a colonnine
      for (let c = 0; c < 12; c++) {
        R(g, 15 + c * 10, 60 + c * 3, 2, 14, "#475569");
      }
      R(g, 10, 58, 135, 3, "#64748b");

      // La lanterna gigante di Fresnel con rotazione
      C(g, 75, 40, 18, "#1e293b");
      const fAng = (f * 0.025) % (Math.PI * 2);
      spot(g, 75, 40, fAng, 220, 0.25, "56,189,248", 0.65);
      GL(g, 75, 40, 32, "56,189,248", 0.9);

      // Il mare scuro e la sagoma del motoscafo di Dario all'orizzonte
      sea(g, f, W, H, 130);
      const boatX = 230 + Math.sin(f * 0.05) * 4;
      const boatY = 155 + Math.cos(f * 0.07) * 2;
      T(g, [boatX - 16, boatY, boatX + 16, boatY, boatX + 10, boatY + 7, boatX - 12, boatY + 7], "#1e293b");
      R(g, boatX - 4, boatY - 6, 8, 6, "#334155");
      C(g, boatX + 12, boatY - 1, 2, "#facc15");

      rain(g, f, W, H, 95, 0.45);
      VIG(g, W, H, 0.45);
    }
  };

  const HOT = {
    alc2_titolo: [
      [226, 60, 22, 28, "🗼 La Torre Faro di Cerbero: fari a ultravioletti ruotano ogni otto secondi."],
      [112, 70, 28, 16, "⛓️ Il Braccio Sotterraneo: le antiche celle convertite in galleria di scavo."],
      [0, 120, 320, 80, "🌊 La Risacca della Baia: correnti gelide che scoraggiano qualsiasi nuotata."]
    ],
    alc2_falesia: [
      [100, 95, 40, 40, "🕳️ La Grata Divelta: i cardini mostrano ancora i segni della sega a corda di tre anni fa. La salsedine ha fatto il resto del lavoro."],
      [232, 150, 20, 20, "🚨 La Boa Sonar: un bulbo di gomma e rame che emette un 'bip' sommesso ogni sei secondi. Rebecca ha oscurato la lente con grasso marino."],
      [20, 130, 60, 60, "🧗 La Scaletta dei Contrabbandieri: gradini di roccia scavati nell'Ottocento, coperti di alghe viscide. Scivolare qui significa finire dritti nella risacca."]
    ],
    alc2_dormitorio: [
      [60, 120, 36, 50, "🔥 La Stufa a Nafta: brucia rami galleggianti e trucioli di cartone. Scalda poco, ma il fumo allontana l'umidità delle ossa."],
      [180, 85, 36, 48, "🪞 Lo Specchio Scheggiato: dietro la cornice di legno Bruno custodisce il taccuino con i turni delle ronde e una bottiglia di colonia alla lavanda."],
      [245, 95, 55, 40, "🚰 Il Quadro Idraulico: sei rubinetti di bronzo e tre manometri a lancetta. Una targhetta d'ottone recita: 'Regia Marina - Bacino Sommergibili 1918'."]
    ],
    alc2_cisterna: [
      [145, 60, 32, 32, "⚙️ La Valvola di Fondo: un massiccio timone di ghisa con una freccia verniciata di bianco: 'SCARICO RAPIDO'. È sigillato da una catena d'acciaio."],
      [5, 40, 20, 90, "🛡️ La Parete Elastica N° 3: lamiera scanalata montata su molle industriali. Un tiro d'interno piede qui sopra schizza con traiettoria tesa verso l'incrocio opposto."],
      [90, 16, 140, 25, "👁️ La Tribuna di Guardia: una passerella sopraelevata protetta da vetri blindati, da cui la Comandante Vane supervisiona ogni traiettoria."]
    ],
    alc2_faro: [
      [60, 25, 34, 34, "🔦 Il Proiettore Cerbero: lente di Fresnel da mille watt con filtro ultravioletto che spazza la scogliera."],
      [10, 55, 140, 30, "💨 La Balconata della Tempesta: parapetto in ghisa spazzato dal vento di tramontana a quaranta metri sul mare aperto."],
      [215, 145, 40, 25, "🚤 Il Motoscafo di Dario: motore fuoribordo al minimo tra le onde per l'imbarco rapido."]
    ]
  };

  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) {
      Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    } else if (n < 80) {
      setTimeout(() => reg(n + 1), 120);
    }
  }
  reg(0);
})();
