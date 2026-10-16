// js/cenere.js - «CENERE E GLORIA» · Configurazione saga su js/saga-core.js
// Dopo il crollo i villaggi di rottami si guardano con sospetto. Un pallone ritrovato in un bunker riaccende le sfide
// al posto dei saccheggi. Saga seria, umana, con poche battute ironiche. Ispirata a The Last of Us, Mad Max e Nausicaä.
// Novità: le BORRACCE (acqua da razionare tra le zone), il vento di sabbia in esplorazione e il motore «Campo di Rottami».
(function () {
  "use strict";
  if (window.__cenere || !window.__sagaCore) return;

  const OUTDOOR = { ce_strada: 1, ce_cratere: 1 };

  const E = window.__sagaCore.create({
    id: "cenere",
    key: "ali-di-rondine.cenere",
    title: "Cenere e Gloria",
    icon: "🏜️",
    bg: "ce_titolo",
    chapters: 3,
    menuSub: "Dopo il crollo, un pallone ritrovato in un bunker riaccende i villaggi di rottami: razionare l'acqua, attraversare le tempeste di sabbia e scegliere tra saccheggio e speranza.",
    theme: {
      accent: "#d97706",
      ink: "#1c1208",
      paper: "rgba(254,243,214,.96)",
      font: "'Trebuchet MS', 'Segoe UI', system-ui",
      chipBg: "#fde7b8",
      chipBorder: "#b45309"
    },
    stats: {
      borraccia: [0, 9, 5, "Borracce d'acqua"],
      legami: [0, 99, 20, "Legami tra villaggi"],
      speranza: [0, 99, 15, "Speranza"]
    },
    regions: {
      villaggio: {
        grass: ["#b98c55", "#ad8049", "#c39a61"], path: ["#8a6a3e", "#7d5f36"], stone: ["#6b6258", "#5c544b"],
        wall: ["#3a2c1e", "#2e2217"], water: ["#4b6f78", "#3f6068"], tree: "#6b5a3a",
        tint: "217,119,6", tintA: 0.07, fx: "dust"
      },
      bunker: {
        grass: ["#4a4d52", "#42454a", "#52555a"], path: ["#6b6f75", "#5e6268"], stone: ["#33363b", "#2a2d31"],
        wall: ["#1c1e22", "#141619"], water: ["#2a4a52", "#223c43"], tree: "#3a3d42",
        tint: "148,163,184", tintA: 0.1, fx: "dust", dark: true
      },
      strada: {
        grass: ["#c9a265", "#bd9659", "#d3ad72"], path: ["#9b7544", "#8e6a3b"], stone: ["#7a6a55", "#6c5d4a"],
        wall: ["#4a3822", "#3d2e1b"], water: ["#4b6f78", "#3f6068"], tree: "#7a6a3e",
        tint: "234,138,38", tintA: 0.1, fx: "dust"
      },
      cratere: {
        grass: ["#8a5a3a", "#7e5033", "#94643f"], path: ["#5a3a28", "#4e3122"], stone: ["#5f5148", "#51443c"],
        wall: ["#2a1a12", "#20130d"], water: ["#7c2d12", "#9a3412"], tree: "#6b3a1a",
        tint: "220,38,38", tintA: 0.1, fx: "sparks"
      }
    },
    solid: "aMKUPBNWE",
    paint: {
      a(K, sx, sy) {
        const g = K.g;
        g.fillStyle = "#4a3a2a"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#6b5640"; g.fillRect(sx + 1, sy + 1, 14, 6); g.fillRect(sx + 1, sy + 9, 14, 6);
        g.fillStyle = "#2a1f15"; g.fillRect(sx + 2, sy + 3, 2, 2); g.fillRect(sx + 11, sy + 11, 2, 2);
      },
      M(K, sx, sy) { // mucchio di rottami
        const g = K.g;
        g.fillStyle = "#5c4a38"; g.fillRect(sx + 1, sy + 5, 14, 10);
        g.fillStyle = "#8a6a4a"; g.fillRect(sx + 2, sy + 3, 6, 5); g.fillStyle = "#9aa0a6"; g.fillRect(sx + 8, sy + 2, 6, 4);
        g.fillStyle = "#b45309"; g.fillRect(sx + 3, sy + 8, 4, 3);
      },
      K(K, sx, sy) { // carcassa d'auto
        const g = K.g;
        g.fillStyle = "#7c3a1f"; g.fillRect(sx + 1, sy + 6, 14, 7);
        g.fillStyle = "#5a2a15"; g.fillRect(sx + 4, sy + 3, 8, 4);
        g.fillStyle = "#1c1917"; g.beginPath(); g.arc(sx + 4, sy + 13, 2.2, 0, 7); g.arc(sx + 12, sy + 13, 2.2, 0, 7); g.fill();
      },
      U(K, sx, sy) { // tenda di lamiera
        const g = K.g;
        g.fillStyle = "#8b7355"; g.beginPath(); g.moveTo(sx + 8, sy + 1); g.lineTo(sx + 15, sy + 15); g.lineTo(sx + 1, sy + 15); g.closePath(); g.fill();
        g.fillStyle = "#3a2c1e"; g.fillRect(sx + 6, sy + 9, 4, 6);
      },
      P(K, sx, sy, tx, ty, fr) { // pozzo
        const g = K.g;
        g.fillStyle = "#6b6258"; g.fillRect(sx + 2, sy + 4, 12, 11);
        g.fillStyle = "#1e3a44"; g.fillRect(sx + 4, sy + 6, 8, 5);
        g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(sx + 5 + Math.sin(fr / 14 + tx) * 1.5, sy + 7, 3, 1);
        g.fillStyle = "#3a2c1e"; g.fillRect(sx + 2, sy + 1, 12, 2);
      },
      B(K, sx, sy, tx, ty, fr) { // barile di fuoco
        const g = K.g;
        g.fillStyle = "#4b5563"; g.fillRect(sx + 3, sy + 6, 10, 9);
        g.fillStyle = "#f97316"; g.beginPath(); g.arc(sx + 8 + Math.sin(fr / 5 + tx) * 0.8, sy + 5, 3.4, 0, 7); g.fill();
        g.fillStyle = "#fde047"; g.beginPath(); g.arc(sx + 8, sy + 5.5, 1.6, 0, 7); g.fill();
      },
      N(K, sx, sy, tx, ty, fr) { // antenna radio
        const g = K.g;
        g.fillStyle = "#6b7280"; g.fillRect(sx + 7, sy + 2, 2, 13);
        g.fillStyle = "#9ca3af"; g.fillRect(sx + 3, sy + 5, 10, 1); g.fillRect(sx + 4, sy + 9, 8, 1);
        g.fillStyle = Math.floor(fr / 20) % 2 ? "#ef4444" : "#7f1d1d"; g.fillRect(sx + 7, sy + 1, 2, 2);
      },
      W(K, sx, sy, tx, ty, fr) { // pozza d'acqua
        const g = K.g;
        g.fillStyle = "#2f6f86"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(255,255,255,.28)"; g.fillRect(sx + 2 + Math.sin(fr / 18 + tx) * 2, sy + 4, 8, 1); g.fillRect(sx + 6, sy + 10, 8, 1);
      },
      E(K, sx, sy) { // portello del bunker
        const g = K.g;
        g.fillStyle = "#374151"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#6b7280"; g.fillRect(sx + 1, sy + 1, 14, 14);
        g.fillStyle = "#facc15"; for (let i = 0; i < 4; i++) g.fillRect(sx + 1 + i * 4, sy + 12, 2, 3);
        g.fillStyle = "#111827"; g.fillRect(sx + 6, sy + 5, 4, 4);
      }
    },
    act: { q: "Entra", P: "Guarda il pozzo", B: "Scalda le mani", N: "Ascolta la radio", E: "Esamina il portello", W: "Guarda la pozza" },
    travel: true,
    item: ["Rottame Prezioso", "Rottami Preziosi"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.2);
      g.fillStyle = "#9aa0a6"; g.beginPath(); g.moveTo(-5, 3); g.lineTo(-2, -5); g.lineTo(4, -4); g.lineTo(6, 3); g.closePath(); g.fill();
      g.strokeStyle = "#fbbf24"; g.lineWidth = 1; g.stroke();
      g.fillStyle = "#b45309"; g.fillRect(-2, -1, 4, 3);
      g.restore();
    },
    // acqua da razionare: la prima volta che entri in una zona all'aperto bevi una borraccia
    plugins: [{
      enter(zid, spec, K) {
        if (!OUTDOOR[zid] || K.F.get("ce_paid_" + zid)) return;
        K.F.set("ce_paid_" + zid, true);
        const b = K.stat("borraccia");
        if (b > 0) { K.bond("borraccia", -1); if (window.toast) window.toast(`Borracce: ${b - 1}/9`, "info", "💧"); }
        else if (window.toast) window.toast("Borracce finite. La sete pesa sulle gambe.", "warn", "🏜️");
      }
    }],
    // tempesta di sabbia in esplorazione
    mood(g, fr, K) {
      const z = K.api && K.api.trZone && K.api.trZone();
      if (!OUTDOOR[z]) return;
      const k = 0.5 + 0.5 * Math.sin(fr / 120);
      g.save();
      g.fillStyle = `rgba(214,160,90,${0.06 + k * 0.1})`; g.fillRect(0, 0, 4000, 4000);
      g.strokeStyle = `rgba(240,200,140,${0.2 + k * 0.25})`; g.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        const y = (i * 53 + fr * (1.5 + (i % 5) * 0.4)) % 600, x = (i * 97 + fr * 3.2) % 900;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + 14, y + 1.5); g.stroke();
      }
      g.restore();
    },
    stadium: {
      azPitch: "fondale",
      cageField: 2,
      cageMut: "rubber",
      weather: "clear",
      venue: {
        ads: [
          ["VILLAGGIO DI LAMIERA · CASA", "#d97706"],
          ["ACQUA: UN SORSO A TESTA", "#38bdf8"],
          ["STRADA DI POLVERE · KM 0", "#fbbf24"],
          ["IL PALLONE È DI TUTTI", "#f87171"]
        ],
        crowd: ["#7a5a3a", "#b45309", "#374151", "#9a7b4f", "#4b3621"],
        ground: ["#9b7544", "#8a6636"],
        wall: ["#3a2c1e", "#2a1f15"],
        line: "rgba(254,243,214,.7)",
        sky: ["#3b2a1a", "#c9803a"],
        fx: { fr: 0.93, spd: 1.0, wind: 0.5 }
      }
    },
    guest: {
      id: "ce_tamburo",
      lines: [
        "Ehi, Campione! Ho portato una borraccia. Qui al mare l'acqua c'è, ma vecchie abitudini.",
        "Giù da noi i villaggi si scambiano ancora il pallone. Nessuno saccheggia più il bunker.",
        "Cenere ha messo su peso. Dorme sulla radio e pretende il turno di notte.",
        "Se passi dal Cratere, saluta. E non dimenticare la regola: un sorso a testa."
      ]
    },
    endings: {
      pace: ["La Pace dei Villaggi", "Il pallone passa di mano in mano. Ogni villaggio ha il suo campo, e l'acqua del Pozzo viene divisa a turno.", "Dividi il pallone tra i villaggi."],
      solitaria: ["La Strada Solitaria", "Lasci i villaggi alle loro scelte e riprendi la strada con il pallone sotto il braccio. Qualcuno ti saluta ancora dall'orizzonte.", "Riprendi la strada da solo."],
      reliquia: ["La Reliquia", "Il pallone resta nella Torre, custodito come un oggetto sacro. Il Predicatore ha vinto un'idea, non una partita.", "Lascia il pallone nella Torre."],
      segreto: ["Cenere e Gloria", "Finale segreto: i legami, la speranza e l'acqua risparmiata aprono la strada dell'antico campo sotto il cratere. Dalla cenere spunta il primo prato.", "Fidati di tutti, fino in fondo."]
    }
  });

  const K = E.K;

  // Ritratti
  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);
    K.cast("ce_brace", {
      name: "Vedova Brace", sub: "Capovillaggio di Rottame", style: "bun", hair: "#9ca3af", eye: "#44403c", skin: "#d6a67a", shirt: "#7c2d12",
      acc: ["sciarpa"], bg: ["#7c2d12", "#1c1208"]
    }, "Guida il Villaggio di Rottame da quando il pozzo ha smesso di dare acqua buona. Dura nei modi, equa nelle razioni. Non ha mai perso un compito, e sa che il pallone potrebbe essere l'unico modo di non perdere anche le persone.");
    K.cast("ce_tamburo", {
      name: "Tamburo", sub: "Meccanico, ex saccheggiatore", style: "messy", hair: "#44403c", eye: "#0f172a", skin: "#e0b08a", shirt: "#4b5563",
      acc: ["occhiali"], scar: true, bg: ["#4b5563", "#111827"]
    }, "Ragazzo che aggiusta qualsiasi cosa con due fili e tanta ostinazione. Un tempo faceva parte di una banda di saccheggiatori; ora paga il debito riparando generatori. Parla a voce bassa, ascolta sempre.");
    K.cast("ce_selce", {
      name: "Dottoressa Selce", sub: "Cartografa", style: "bob", hair: "#1c1917", eye: "#047857", skin: "#c68c5b", shirt: "#0f766e",
      acc: ["occhiali", "cuffie"], bg: ["#0f766e", "#022c22"]
    }, "Disegna mappe che nessun altro sa leggere: pozzi, tempeste, strade che esistono solo nella sua testa. Calma, precisa, con un'ironia asciutta che esce solo quando è stanca.");
    K.cast("ce_predicatore", {
      name: "Predicatore delle Dune", sub: "Custode della Torre", style: "long", hair: "#d1d5db", eye: "#b45309", skin: "#b9835a", shirt: "#78350f",
      beard: "folta", acc: ["bandana"], bg: ["#78350f", "#1c1208"]
    }, "Predica da vent'anni che il pallone sia un dono da custodire, non da giocare. Ha una ragione comprensibile per credere quello che crede, e un modo di dirlo che raramente lascia indifferenti.");
    K.cast("ce_dente", {
      name: "Dente", sub: "Capobanda dei Saccheggiatori", style: "cresta", hair: "#7f1d1d", eye: "#111827", skin: "#d49a6a", shirt: "#292524",
      scar: true, acc: ["fascia"], bg: ["#292524", "#7f1d1d"]
    }, "Capo di una banda di saccheggiatori di lamiera. Sorride poco e mostra il dente d'oro che gli ha dato il nome. Vuole il pallone perché crede che valga più di un pozzo.");
    K.cast("ce_cenere", {
      name: "Cenere", sub: "Gatta del bunker", shape: "gatto", skin: "#6b7280", shirt: "#374151", eye: "#fde047", hair: "#4b5563", bg: ["#374151", "#111827"]
    }, "Gatta grigia nata nel bunker. Segue chi ha il pallone, dorme sulla radio e conosce ogni corridoio meglio di chiunque altro.");
  }
  casts();

  window.__cenere = E.api;
  window.__cenereCore = E;

  // Sfondi animati (usati da bg-scenarios.js): villaggio, bunker, strada/oasi, cratere/torre
  const sand = (g, W, H, f, a) => {
    g.strokeStyle = `rgba(240,200,140,${a})`; g.lineWidth = 1;
    for (let i = 0; i < 26; i++) { const y = (i * 41 + f * (1 + (i % 4) * 0.5)) % H, x = (i * 67 + f * 3) % (W + 20); g.beginPath(); g.moveTo(x - 20, y); g.lineTo(x, y + 1); g.stroke(); }
  };
  window.__ceDraw = {
    Villaggio(g, W, H, f) {
      const sky = g.createLinearGradient(0, 0, 0, H * 0.6); sky.addColorStop(0, "#5a3a1f"); sky.addColorStop(1, "#e0a458");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(255,226,160,.7)"; g.beginPath(); g.arc(W * 0.78, 52, 20, 0, 7); g.fill();
      g.fillStyle = "#7a4a26"; g.beginPath(); g.moveTo(0, H * 0.62); for (let x = 0; x <= W; x += 20) g.lineTo(x, H * 0.62 - 12 * Math.sin(x * 0.03 + 1)); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      g.fillStyle = "#b98c55"; g.fillRect(0, H * 0.68, W, H);
      // baracche di lamiera
      [[40, 0.5, 60], [120, 0.55, 48], [220, 0.5, 70], [290, 0.56, 44]].forEach(([x, y, w], i) => {
        const yy = H * y; g.fillStyle = i % 2 ? "#6b5640" : "#8b6a46"; g.fillRect(x, yy, w, H * 0.68 - yy);
        g.fillStyle = "#4a3a2a"; g.fillRect(x - 3, yy - 5, w + 6, 6);
        g.fillStyle = "#facc15"; if (Math.floor(f / 40 + i) % 3) g.fillRect(x + 8, yy + 10, 8, 8);
      });
      // fumo del barile
      g.fillStyle = "#f97316"; g.beginPath(); g.arc(W * 0.5, H * 0.74, 6 + Math.sin(f / 5) * 1.5, 0, 7); g.fill();
      g.fillStyle = "rgba(60,50,40,.35)"; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(W * 0.5 + Math.sin(f / 30 + i) * 6, H * 0.7 - i * 12, 5 + i, 0, 7); g.fill(); }
      sand(g, W, H, f, 0.18);
    },
    Bunker(g, W, H, f) {
      g.fillStyle = "#171a1f"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#2a2f36"; for (let y = 0; y < H; y += 24) g.fillRect(0, y, W, 2);
      g.fillStyle = "#111418"; g.fillRect(0, H * 0.72, W, H);
      // portellone
      g.fillStyle = "#3f4650"; g.fillRect(W * 0.38, H * 0.18, W * 0.24, H * 0.54);
      g.fillStyle = "#6b7280"; g.beginPath(); g.arc(W * 0.5, H * 0.45, 24, 0, 7); g.fill();
      g.fillStyle = "#111827"; g.beginPath(); g.arc(W * 0.5, H * 0.45, 12, 0, 7); g.fill();
      g.fillStyle = "#facc15"; for (let i = 0; i < 6; i++) g.fillRect(W * 0.38 + i * (W * 0.04), H * 0.66, W * 0.02, 8);
      // luce lampeggiante
      g.fillStyle = Math.floor(f / 30) % 2 ? "rgba(239,68,68,.9)" : "rgba(127,29,29,.9)"; g.beginPath(); g.arc(W * 0.12, H * 0.2, 6, 0, 7); g.fill();
      const cone = g.createRadialGradient(W * 0.12, H * 0.2, 2, W * 0.12, H * 0.2, 90); cone.addColorStop(0, "rgba(239,68,68,.25)"); cone.addColorStop(1, "rgba(239,68,68,0)"); g.fillStyle = cone; g.fillRect(0, 0, W, H);
      // pallone sullo scaffale
      g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(W * 0.84, H * 0.58 + Math.sin(f / 30) * 1.5, 9, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 1; g.stroke();
      g.fillStyle = "#3f4650"; g.fillRect(W * 0.76, H * 0.64, 40, 4);
    },
    Strada(g, W, H, f) {
      const sky = g.createLinearGradient(0, 0, 0, H * 0.6); sky.addColorStop(0, "#7a4a22"); sky.addColorStop(1, "#f0c27a");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(255,240,200,.6)"; g.beginPath(); g.arc(W * 0.2, 56, 24, 0, 7); g.fill();
      [0.6, 0.66, 0.72].forEach((y, i) => { g.fillStyle = ["#a97b44", "#c79a5a", "#d9b377"][i]; g.beginPath(); g.moveTo(0, H * y); for (let x = 0; x <= W; x += 20) g.lineTo(x, H * y - (10 + i * 4) * Math.sin(x * 0.02 + i * 2)); g.lineTo(W, H); g.lineTo(0, H); g.fill(); });
      // strada
      g.fillStyle = "#8e6a3b"; g.beginPath(); g.moveTo(W * 0.42, H * 0.62); g.lineTo(W * 0.58, H * 0.62); g.lineTo(W * 0.9, H); g.lineTo(W * 0.1, H); g.fill();
      g.strokeStyle = "#e9d8a6"; g.setLineDash([8, 10]); g.lineWidth = 2; g.beginPath(); g.moveTo(W * 0.5, H * 0.62); g.lineTo(W * 0.5, H); g.stroke(); g.setLineDash([]);
      // cartello e carcassa
      g.fillStyle = "#5c4a38"; g.fillRect(W * 0.18, H * 0.5, 3, 40); g.fillStyle = "#c2410c"; g.fillRect(W * 0.1, H * 0.46, 40, 14);
      g.fillStyle = "#7c3a1f"; g.fillRect(W * 0.72, H * 0.64, 50, 18); g.fillStyle = "#1c1917"; g.beginPath(); g.arc(W * 0.74, H * 0.7, 6, 0, 7); g.arc(W * 0.82, H * 0.7, 6, 0, 7); g.fill();
      sand(g, W, H, f, 0.3);
    },
    Cratere(g, W, H, f) {
      const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#2a0f0a"); sky.addColorStop(0.6, "#7c2d12"); sky.addColorStop(1, "#1c0a06");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = "#2a1a12"; g.beginPath(); g.moveTo(0, H * 0.4); g.lineTo(W * 0.3, H * 0.62); g.lineTo(W * 0.7, H * 0.62); g.lineTo(W, H * 0.4); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      // braci sul fondo
      g.fillStyle = "#b91c1c"; g.beginPath(); g.ellipse(W * 0.5, H * 0.78, 80, 14, 0, 0, 7); g.fill();
      g.fillStyle = "#f97316"; g.beginPath(); g.ellipse(W * 0.5, H * 0.78, 50 + Math.sin(f / 15) * 4, 8, 0, 0, 7); g.fill();
      // torre del Predicatore
      g.fillStyle = "#4a3a2a"; g.fillRect(W * 0.76, H * 0.22, 24, H * 0.46); g.fillStyle = "#6b5640"; g.fillRect(W * 0.74, H * 0.2, 28, 8);
      g.fillStyle = "#facc15"; g.fillRect(W * 0.76 + 8, H * 0.3, 8, 8);
      // scintille
      for (let i = 0; i < 18; i++) { const x = (i * 71 + f * 0.5) % W, y = H - ((i * 37 + f * (0.8 + (i % 3) * 0.4)) % (H * 0.7)); g.fillStyle = `rgba(253,186,116,${0.2 + (i % 4) * 0.12})`; g.fillRect(x, y, 2, 2); }
    }
  };
})();
