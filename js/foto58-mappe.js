// js/foto58-mappe.js - «LA FOTO DEL '58» · le mappe: la piazza del Borgo oggi e nel '58 (stessa pianta, settant'anni dopo), la curva del Passo, l'albergo e il campo innevato,
// la hall dell'albergo, la galleria, il pendio fuori dalla galleria, il cimitero, l'Archivio e il Bar Sport. Espone window.__f5Z: ogni costruttore restituisce lo spec di una zona.
// Nelle scene ferme (frozen) i personaggi sono quelli di FZ (js/foto58.js) nelle loro posizioni; il cavalletto (J) riporta al presente.
(function () {
  "use strict";
  const frNow = () => Math.floor(performance.now() / 16);
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  // la corriera: «58» verde e crema col portapacchi pieno di valigie; «oggi» blu e bianca, quella di Mauro
  function bus(g, x, y, w, mode, f) {
    const L = w * 16, old = mode !== "oggi";
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x + L / 2, y + 30, L / 2 + 4, 5, 0, 0, 7); g.fill();
    g.fillStyle = old ? "#3f6212" : "#1d4ed8"; g.beginPath(); g.roundRect(x, y - 8, L, 34, old ? [14, 6, 6, 14] : [6, 6, 4, 4]); g.fill();
    g.fillStyle = old ? "#efe6c8" : "#f8fafc"; g.fillRect(x + 4, y - 6, L - 8, 14); if (old) { g.fillStyle = "#a16207"; g.fillRect(x + 2, y + 9, L - 4, 2); }
    for (let i = 0; i < w - 1; i++) { g.fillStyle = old ? "#3b4a52" : "#1e293b"; g.fillRect(x + 10 + i * 16, y - 4, old ? 11 : 14, 10); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(x + 11 + i * 16, y - 3, 3, 8); }
    g.fillStyle = old ? "#efe6c8" : "#fbbf24"; g.fillRect(x + 1, y + 2, 4, 5); if (!old) { g.fillStyle = "#0f172a"; g.fillRect(x + L - 44, y - 7, 40, 5); g.fillStyle = "#fbbf24"; g.font = "700 4px system-ui"; g.textAlign = "left"; g.fillText("PASSO · VALLE · BORGO", x + L - 43, y - 3.4); }
    [x + 18, x + L - 22].forEach((wx) => { C(g, wx, y + 25, 6, "#1c1917"); C(g, wx, y + 25, 2.6, "#a8a29e"); });
    if (old) { g.fillStyle = "#57534e"; g.fillRect(x + 10, y - 13, L - 24, 2); ["#7c2d12", "#a16207", "#44403c", "#7f1d1d", "#78350f", "#57534e"].forEach((c, i) => R(g, x + 14 + i * ((L - 40) / 6), y - 20 + (i % 2) * 2, 14 - (i % 3) * 2, 7 - (i % 2), c)); g.fillStyle = "#efe6c8"; g.font = "800 5px Georgia"; g.textAlign = "center"; g.fillText("AUTOSERVIZI BORGO", x + L / 2, y + 18); }
    else { g.fillStyle = "#fff"; g.font = "800 5px system-ui"; g.textAlign = "center"; g.fillText("AUTOLINEE MANCUSO", x + L / 2, y + 18); }
  }
  // festoni granata e bianchi (la partenza) e lampioni
  function bunting(g, x0, y0, x1, y1, f) { g.strokeStyle = "rgba(60,40,20,.7)"; g.lineWidth = 0.6; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, y0 + 14, x1, y1); g.stroke(); for (let i = 1; i < 14; i++) { const t = i / 14, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 10, s = Math.sin(f / 14 + i) * 0.8; g.fillStyle = i % 2 ? "#7f1d1d" : "#f5ead6"; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + 3, y); g.lineTo(x + s, y + 6); g.fill(); } }
  function belltower(g, x, y, f, night) { R(g, x, y - 46, 16, 50, "#d6d3d1"); R(g, x + 2, y - 40, 12, 10, "#44403c"); C(g, x + 8, y - 33, 3, "#a16207"); g.fillStyle = "#57534e"; g.beginPath(); g.moveTo(x - 2, y - 46); g.lineTo(x + 8, y - 60); g.lineTo(x + 18, y - 46); g.fill(); R(g, x + 3, y - 22, 10, 10, "#e7e5e4"); g.strokeStyle = "#1c1917"; g.lineWidth = 0.8; g.beginPath(); g.arc(x + 8, y - 17, 4, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x + 8, y - 17); g.lineTo(x + 8, y - 20); g.moveTo(x + 8, y - 17); g.lineTo(x + 10, y - 17); g.stroke(); if (night) { g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createRadialGradient(x + 8, y - 17, 1, x + 8, y - 17, 14); gr.addColorStop(0, "rgba(255,240,200,.4)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.fillRect(x - 6, y - 31, 28, 28); g.restore(); } }
  // figurine ferme della squadra avversaria (Sportiva Alpina) sul campo innevato
  function alpino(g, x, y, k, f) { g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(x, y + 12, 5, 1.6, 0, 0, 7); g.fill(); R(g, x - 4, y, 8, 7, "#f8fafc"); R(g, x - 4, y + 2, 8, 1.4, "#1e3a8a"); R(g, x - 3, y + 7, 6, 3, "#1e3a8a"); R(g, x - 3 + (k % 2), y + 10, 2, 3, "#1c1917"); R(g, x + 1 - (k % 2), y + 10, 2, 3, "#1c1917"); C(g, x, y - 3, 3.2, "#e0b48a"); R(g, x - 3, y - 6, 6, 2, "#3f2a1a"); }
  const frozenNpcs = (z) => () => (window.__foto58FZ && window.__foto58FZ[z] ? window.__foto58FZ[z].list : []).map(([id, x, y]) => ({ id, at: [x, y] }));
  const backJ = { J: (o, K) => window.__f5Back && window.__f5Back(K) };
  const camTop = (o) => (g, cx, cy, d, K) => { window.__f5Cam = [cx, cy]; if (o && o.top) o.top(g, cx, cy, d, K); };
  window.__f5Z = {
    bus, frozenNpcs,
    // ------------------------------------------------------------------ LA PIAZZA DEL BORGO (o.mode: "oggi" | "58" | "notte58")
    piazza(H, npcs, o) {
      o = o || {}; const m = o.mode || "oggi", y58 = m !== "oggi", night = m === "notte58" || o.time === "notte";
      return {
        region: night ? "notte" : o.region || "piazza", name: y58 ? "La piazza del Borgo, 1958" : "La piazza del Borgo", short: y58 ? "Piazza, 1958" : "La piazza", sub: y58 ? (night ? "Il ritorno della corriera" : "La partenza per il Passo") : "L'Archivio, il Bar Sport, la chiesa e la fermata della corriera",
        bg: o.bg || (y58 ? (night ? "f5_ritorno" : "f5_partenza") : "f5_piazza"), time: o.time || (night ? "notte" : "giorno"), w: 36, h: 26, base: "C", start: o.start || (y58 ? [16, 19] : [17, 16]), travel: y58 ? undefined : [17, 16], frozen: y58,
        itemCos: o.itemCos, items: o.items || [], loot: o.loot || {},
        areas: [[2, 1, 9, 6, y58 ? "La Sede della Rondine" : "L'Archivio del Borgo"], [27, 1, 34, 6, "Il Bar Sport"], [15, 0, 21, 6, "La chiesa"], [2, 19, 7, 23, y58 ? "Il barbiere Sanna" : "La Barberia Sanna"], [12, 20, 19, 24, "La scuola"], [26, 11, 34, 15, "La fermata"], [0, 0, 35, 25, "La piazza"]],
        act: Object.assign({ ">": "Vai al cimitero", q: "Entra", b: "Siediti sulla panchina", l: "Guarda il lampione" }, o.act || {}),
        flavor: Object.assign({ l: y58 ? "Un lampione a gas. Lo accende il sacrestano, la sera, con una pertica." : "Un lampione con la lampadina a basso consumo. Ilario dice che fa una luce «da ospedale»." }, o.flavor || {}),
        doors: Object.assign({
          "5,5": y58 ? { text: "La porta della Sede dell'U.S. Rondine. Nel '58 era sempre aperta: dentro, il commendator Bassi contava i soldi delle trasferte." } : { to: "f5_archivio", at: [8, 9] },
          "30,5": y58 ? { text: "Il Bar Sport, 1958. Dalla porta esce odore di caffè e di toscano. Dentro, qualcuno ha già scommesso sulla finale." } : { to: "f5_bar", at: [8, 8] },
          "18,5": { text: y58 ? "La chiesa. Sui gradini, nel '58, le madri della squadra con la corona in mano." : "La chiesa di San Rocco. Sul portone, la targa dei parroci." },
          "12,4": { text: "Una casa con le persiane verdi. Sul davanzale, un gatto che guarda la piazza come se fosse sua." },
          "15,23": { text: y58 ? "La scuola elementare. Il maestro, la mattina dopo il ritorno, era in classe lo stesso." : "La scuola elementare. Sul portone: «Scuola elementare Amedeo Laurenti, maestro»." },
          "24,23": { text: y58 ? "La merceria. Lana, bottoni, nastri granata per la partenza." : "La merceria della signora Pia: lana, bottoni e notizie, in quest'ordine." },
          "35,12": { text: "La strada per il cimitero, tra i cipressi. Ci andrai, prima o poi." },
          "4,22": { text: y58 ? "Il barbiere Sanna, il padre di Libero. Rasoio, schiuma, e la radio sintonizzata sulla partita." : "La Barberia Sanna, «dal 1961». In vetrina, un pettine d'argento e una foto della Rondine." }
        }, o.doors || {}),
        objects: Object.assign({}, y58 ? backJ : {}, o.objects || {}), npcs, intro: o.intro, onEnter: o.onEnter,
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 0, "t"); lay(0, 0, 0, 25, "t"); lay(35, 0, 35, 25, "t"); lay(0, 25, 35, 25, "t");
          house(2, 1, 8, 5, { door: [5, 5], roof: "#7c2d12", wall: y58 ? "#cbb48a" : "#d9c29a", lit: night });
          house(11, 1, 4, 4, { door: [12, 4], roof: "#92400e", wall: "#e7cfa2", lit: night });
          house(15, 0, 7, 6, { door: [18, 5], roof: "#57534e", wall: "#e7e5e4", lit: night });
          house(23, 1, 3, 4, { roof: "#78350f", wall: "#e3c79a", lit: night });
          house(27, 1, 8, 5, { door: [30, 5], roof: "#7f1d1d", wall: "#f0d9b0", lit: true });
          house(2, 19, 6, 4, { door: [4, 22], roof: "#7c2d12", wall: "#e7d4b0", lit: night });
          house(12, 20, 8, 4, { door: [15, 23], roof: "#9a3412", wall: "#f1e2c4", lit: night });
          house(22, 20, 5, 4, { door: [24, 23], roof: "#78350f", wall: "#ead6b2", lit: night });
          house(28, 19, 6, 5, { roof: "#57534e", wall: "#d6c29e", lit: night });
          lay(1, 17, 34, 18, y58 ? "C" : "A"); lay(27, 12, 34, 16, y58 ? "C" : "A");
          lay(8, 9, 9, 10, "F"); put(26, 9, "N");
          [[10, 14], [25, 14], [11, 7], [24, 7]].forEach(([x, y]) => put(x, y, "t"));
          [[11, 6], [24, 6], [8, 16], [27, 17]].forEach(([x, y]) => put(x, y, "l"));
          put(6, 12, "b"); put(21, 7, "b"); put(14, 7, "b");
          if (!y58) { put(29, 12, "S"); put(30, 12, "b"); put(35, 12, ">"); }
          if (y58) { lay(12, 10, 20, 11, "U"); if (m === "58") put(16, 18, "J"); else put(16, 19, "J"); }
          (o.extra || []).forEach(([x, y, c]) => put(x, y, c));
        },
        top: camTop(o),
        decor(g, cx, cy, d) {
          const f = frNow();
          belltower(g, d.X(21), d.Y(6), f, night);
          // la fontana: zampillo
          const fx = d.X(9), fy = d.Y(9) + 4; R(g, fx - 1.5, fy - 8, 3, 8, "#78716c"); for (let i = 0; i < 8; i++) { const t = ((f * 1.1 + i * 9) % 44) / 44, a = (i / 8) * 6.28; g.fillStyle = `rgba(186,230,253,${0.85 - t * 0.7})`; g.beginPath(); g.arc(fx + Math.cos(a) * t * 10, fy - 8 - Math.sin(t * Math.PI) * 8 + t * 10, 1.1, 0, 7); g.fill(); }
          if (y58) { bus(g, d.X(12), d.Y(10), 9, "58", f); bunting(g, d.X(3), d.Y(6), d.X(16), d.Y(7) - 4, f); bunting(g, d.X(19), d.Y(7) - 4, d.X(33), d.Y(6), f);
            // il carretto del lattaio e la bicicletta del postino
            R(g, d.X(31), d.Y(9), 18, 8, "#78350f"); C(g, d.X(31) + 4, d.Y(9) + 10, 3, "#3f2a1a"); C(g, d.X(31) + 14, d.Y(9) + 10, 3, "#3f2a1a"); R(g, d.X(31) + 2, d.Y(9) - 4, 4, 4, "#e7e5e4"); R(g, d.X(31) + 8, d.Y(9) - 4, 4, 4, "#e7e5e4");
            H.plaque(g, "SEDE U.S. RONDINE", d.X(6), d.Y(1) + 6, "#fca5a5"); H.plaque(g, "BARBIERE SANNA", d.X(5), d.Y(19) + 4, "#fde68a"); H.plaque(g, "FORZA RONDINE · TORNEO DEL PASSO", d.X(17) + 8, d.Y(8) - 2, "#fca5a5");
          } else {
            if (o.busOggi) bus(g, d.X(27), d.Y(13), 7, "oggi", f);
            H.plaque(g, "ARCHIVIO DEL BORGO", d.X(6), d.Y(1) + 6, "#fde68a"); H.plaque(g, "BARBERIA SANNA · DAL 1961", d.X(5), d.Y(19) + 4, "#fde68a"); H.plaque(g, "FERMATA · AUTOLINEE MANCUSO", d.X(30), d.Y(11) + 4, "#bfdbfe"); H.plaque(g, "CIMITERO ▸", d.X(34), d.Y(11) + 8, "#e7e5e4");
            H.plaque(g, "MOSTRA «UN SECOLO DI RONDINE»", d.X(6), d.Y(7) - 2, "#fca5a5");
          }
          H.plaque(g, "BAR SPORT", d.X(31), d.Y(1) + 6, "#fbbf24"); H.plaque(g, y58 ? "SCUOLA ELEMENTARE" : "SCUOLA «A. LAURENTI»", d.X(16), d.Y(20) + 4, "#fde68a");
          // tavolini fuori dal bar
          [[28, 7], [32, 7]].forEach(([x, y]) => { C(g, d.X(x) + 8, d.Y(y) + 6, 5, "#e7e5e4"); R(g, d.X(x) + 7, d.Y(y) + 7, 2, 7, "#57534e"); });
          if (night) [[11, 6], [24, 6], [8, 16], [27, 17]].forEach(([x, y]) => window.__foto58Core && window.__foto58Core.K && window.__foto58Core.K.light(d.X(x) + 8, d.Y(y), 34, "255,210,140", 0.5));
          if (o.decor) o.decor(g, cx, cy, d, f);
        }
      };
    },
    // ------------------------------------------------------------------ LA CURVA DEL PASSO (scena ferma, ch. 1)
    curva(H) {
      return {
        region: "monte", name: "La curva del Passo, 1958", short: "La curva", sub: "La corriera ferma, una lite, la neve di aprile", bg: "f5_curva_bg", time: "giorno", w: 34, h: 22, base: "K", start: [16, 13], frozen: true,
        npcs: frozenNpcs("f5_curva"), objects: backJ, items: [[3, 18], [30, 6], [12, 4]], itemCos: "f5_c1",
        act: { r: "Guarda il masso" }, flavor: { r: "Un masso. Dietro, le orme di Tonino. Meglio non indagare oltre." },
        loot: { "30,13": { id: "f5_frame", text: "Sul paracarro, incastrato nella neve, un pezzo di pellicola: un fotogramma. Nando ne perdeva sempre uno, quando cambiava rullino al freddo.", empty: "Solo neve, e il segno di un guanto." } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 3, "R"); [[2, 4], [7, 4], [13, 4], [19, 4], [31, 4], [33, 5], [0, 5]].forEach(([x, y]) => put(x, y, "P"));
          lay(0, 6, 12, 10, ":"); lay(10, 7, 24, 11, ":"); lay(22, 8, 33, 12, ":");
          lay(12, 8, 20, 9, "U");
          lay(14, 14, 33, 14, "r"); lay(14, 15, 33, 21, "V"); put(18, 14, "K"); put(26, 14, "K"); put(15, 14, "K"); put(30, 14, "R");
          put(30, 13, "r"); put(6, 6, "r"); put(4, 7, "r");
          put(27, 6, "E"); lay(0, 16, 13, 16, "P"); put(6, 16, "K"); put(7, 16, "K"); [[1, 12], [3, 14], [12, 17], [0, 19], [5, 20], [9, 21], [13, 20]].forEach(([x, y]) => put(x, y, "P"));
          put(15, 13, "J");
        },
        top: camTop(),
        decor(g, cx, cy, d) {
          const f = frNow(); bus(g, d.X(12), d.Y(8), 9, "58", f);
          // la ruota smontata e la cassetta degli attrezzi
          C(g, d.X(22) + 4, d.Y(10) + 8, 6, "#1c1917"); C(g, d.X(22) + 4, d.Y(10) + 8, 2.6, "#a8a29e");
          // palle di neve ferme a mezz'aria
          [[10, 13, -6], [9, 14, -10]].forEach(([x, y, dy]) => C(g, d.X(x) + 8, d.Y(y) + dy, 2.4, "#f8fafc"));
          H.plaque(g, "PASSO DELLA CAVALLA · 1850 m", d.X(26), d.Y(4) + 2, "#e7e5e4"); H.plaque(g, "🎞️ IL MIRINO", d.X(15) + 8, d.Y(13) - 6, "#fca5a5");
        }
      };
    },
    // ------------------------------------------------------------------ L'ALBERGO DEL PASSO e il campo innevato (scena ferma, ch. 2)
    albergo(H) {
      return {
        region: "monte", name: "L'Albergo del Passo, 1958", short: "L'Albergo", sub: "La semifinale nella neve, ferma a metà azione", bg: "f5_albergo_bg", time: "giorno", w: 34, h: 24, base: "K", start: [11, 20], frozen: true,
        npcs: frozenNpcs("f5_albergo"), objects: Object.assign({ "28,14": (o, K) => window.__f5Ball && window.__f5Ball(K) }, backJ), items: [[2, 22], [31, 2], [8, 9]], itemCos: "f5_c2",
        doors: { "9,6": { to: "f5_hall", at: [9, 9] } },
        act: { o: "Tocca il pallone", "15,21": "Guarda sotto la panchina" },
        loot: { "15,21": { id: "f5_frame", text: "Sotto la panchina, nella neve calpestata: un fotogramma. Si vede un pallone a mezz'aria e, di spalle, un 9.", empty: "Solo neve calpestata." } },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 1, "R"); [[16, 2], [20, 2], [25, 2], [30, 2], [33, 3], [0, 8], [0, 12], [1, 16]].forEach(([x, y]) => put(x, y, "P"));
          house(3, 2, 12, 5, { door: [9, 6], roof: "#57534e", wall: "#c9b48a", lit: true });
          lay(7, 7, 11, 8, ":"); lay(9, 9, 10, 20, ":");
          window.__f5Pitch = [16, 8, 32, 22]; lay(16, 8, 32, 22, "&"); lay(16, 13, 16, 17, "h"); lay(32, 13, 32, 17, "h"); put(17, 13, "&");
          lay(13, 10, 13, 18, "b"); put(28, 14, "o");
          put(12, 21, "J"); [[4, 12], [6, 16], [2, 20], [5, 22], [14, 23], [33, 23], [33, 9]].forEach(([x, y]) => put(x, y, "P"));
        },
        top: camTop(),
        decor(g, cx, cy, d) {
          const f = frNow();
          // neve sul tetto dell'albergo, comignoli, insegna
          R(g, d.X(3) - 2, d.Y(2) - 3, 12 * 16 + 4, 5, "#f8fafc"); for (let i = 0; i < 12; i++) C(g, d.X(3) + i * 16 + 8, d.Y(2) + 1, 4, "#f8fafc");
          H.plaque(g, "ALBERGO DEL PASSO · 1850 m", d.X(9), d.Y(2) - 6, "#fde68a"); H.plaque(g, "TORNEO DEL PASSO · SEMIFINALE", d.X(24), d.Y(8) - 6, "#fca5a5");
          // gli avversari della Sportiva Alpina, fermi anche loro
          [[22, 13], [26, 16], [29, 12], [30, 15], [24, 10], [28, 19], [31, 14]].forEach(([x, y], k) => alpino(g, d.X(x) + 8, d.Y(y), k, f));
          // il pallone fermo a mezz'aria sopra la tessera
          const bx = d.X(28) + 8, by = d.Y(14) - 6; g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(bx, by + 16, 4, 1.4, 0, 0, 7); g.fill(); C(g, bx, by, 3.6, "#efe6d2"); g.strokeStyle = "#3b2d1f"; g.lineWidth = 0.6; g.beginPath(); g.arc(bx, by, 3.6, 0, 7); g.moveTo(bx - 3.6, by); g.lineTo(bx + 3.6, by); g.stroke();
          // spettatori col cappotto lungo la rete
          for (let i = 0; i < 9; i++) { const x = d.X(17 + i * 2) + 4, y = d.Y(23) - 2; R(g, x - 3, y - 6, 6, 8, ["#44403c", "#57534e", "#78350f"][i % 3]); C(g, x, y - 9, 2.6, "#d9b48a"); }
        }
      };
    },
    // ------------------------------------------------------------------ LA HALL DELL'ALBERGO, di notte (scena ferma, interno)
    hall(H) {
      return {
        interior: true, region: "interno", name: "La hall dell'albergo, notte", short: "La hall", sub: "Il telefono a muro, il camino, un tavolino in fondo", bg: "f5_hall_bg", time: "notte", w: 18, h: 11, start: [9, 9], outside: ["f5_albergo", 9, 7], base: "=", frozen: true,
        npcs: frozenNpcs("f5_hall"),
        act: { T: "Guarda il tavolino", X: "Guarda il banco", H: "Guarda il camino", z: "Guarda dietro la poltrona" },
        flavor: { X: "Il banco della reception. Un registro aperto: «U.S. Rondine, 15 persone, 3 camere». Qualcuno ha corretto il 15 in 16.", H: "Il camino. Davanti, a scaldarsi, un paio di scarpe con la suola che ride." },
        objects: { "12,5": (o, K) => { K.F.set("f5_busta_vista", true); K.say([["voce", "Il tavolino in fondo, sotto la lampada. Una busta gialla, gonfia, col timbro «Totocalcio Gatti & C.». Una mano col mignolo inanellato la spinge. Una mano giovane non la tocca. Ancora."]], K.done); } },
        loot: { "16,9": { id: "f5_frame", text: "Dietro la poltrona del capitano, sul tappeto: un fotogramma. Il flash di Nando ha fatto brillare tutto: occhi, bicchieri, una busta.", empty: "Il tappeto. Odora di neve e di sigaro." } },
        build(L) {
          const { lay, put } = L; lay(0, 0, 17, 10, "="); lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 10, "a"); lay(17, 0, 17, 10, "a"); lay(0, 10, 17, 10, "a"); put(9, 10, "v");
          put(0, 6, "H"); lay(8, 2, 10, 2, "X"); put(12, 5, "T"); put(13, 5, "T"); put(5, 8, "T"); put(11, 9, "T"); put(15, 0, "W"); put(12, 0, "W"); put(3, 0, "W"); put(16, 9, "z");
          lay(1, 1, 3, 2, "-");
        },
        top: camTop(),
        decor(g, cx, cy, d) {
          const f = frNow();
          // le scale (gradini), il telefono a muro, la poltrona, il lampadario
          for (let i = 0; i < 4; i++) R(g, d.X(1), d.Y(1) + i * 7, 48, 3, "rgba(60,40,20,.5)");
          R(g, d.X(5) + 4, d.Y(0) + 6, 8, 10, "#1c1917"); R(g, d.X(5) + 5, d.Y(0) + 8, 3, 6, "#44403c");
          R(g, d.X(16) - 2, d.Y(7) - 2, 20, 18, "#7f1d1d"); R(g, d.X(16), d.Y(7) - 6, 16, 6, "#991b1b");
          const lx = d.X(12) + 16, ly = d.Y(3); g.strokeStyle = "#57534e"; g.beginPath(); g.moveTo(lx, d.Y(0)); g.lineTo(lx, ly); g.stroke(); C(g, lx, ly, 3, "#fde68a");
          if (window.__foto58Core) window.__foto58Core.K.light(lx, ly + 4, 40, "255,220,150", 0.6);
          H.plaque(g, "ALBERGO DEL PASSO · RECEPTION", d.X(9) + 8, d.Y(1) + 6, "#fde68a");
        }
      };
    },
    // ------------------------------------------------------------------ LA GALLERIA (scena ferma, ch. 3): buio, la frana, l'uscita
    galleria(H) {
      return {
        region: "galleria", name: "La galleria del Passo, 1958", short: "La galleria", sub: "Il crollo, fermo al lampo del flash", bg: "f5_galleria_bg", time: "notte", w: 42, h: 12, base: "%", start: [3, 6], frozen: true,
        npcs: frozenNpcs("f5_galleria"), objects: backJ, items: [[2, 3], [39, 3]], itemCos: "f5_c3",
        buio: 0.8, heroLight: 3.4, luci: () => [[8, 7, 3, "255,190,110"], [22, 5, 2.4, "255,220,150"], [17, 8, 2, "255,200,120"], [40, 5, 5, "220,235,255"], [30, 7, 2, "255,200,120"]],
        doors: { "41,6": { to: "f5_neve", at: [3, 11] } },
        act: { ">": "Esci dalla galleria", "26,8": "Guarda tra la ghiaia" },
        loot: { "26,8": { id: "f5_frame", text: "Tra la ghiaia, vicino a una scarpa persa: un fotogramma. Il flash ha fermato la polvere a mezz'aria, come neve al contrario.", empty: "Ghiaia, e la scarpa. Non la tocchi." } },
        build(L) {
          const { lay, put } = L; lay(0, 0, 41, 1, "Z"); lay(0, 10, 41, 11, "Z"); lay(0, 0, 0, 11, "Z");
          lay(6, 4, 14, 5, "U"); lay(23, 2, 24, 4, "Q"); put(25, 2, "Q"); put(23, 9, "Q"); put(24, 9, "Q");
          put(41, 6, ">"); lay(41, 2, 41, 5, "Z"); lay(41, 7, 41, 9, "Z"); put(2, 7, "J");
        },
        top: camTop(),
        decor(g, cx, cy, d) {
          const f = frNow(); bus(g, d.X(6), d.Y(4), 9, "58", f);
          // la trave che cede, sulle spalle del terzino
          g.save(); g.translate(d.X(22) + 8, d.Y(4)); g.rotate(-0.35); R(g, -18, -3, 36, 6, "#5a4028"); R(g, -18, -3, 36, 1.5, "#7a5838"); g.restore();
          // polvere ferma nel lampo
          for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(240,230,210,.5)"; g.fillRect(d.X(18) + ((i * 37) % 120), d.Y(2) + ((i * 23) % 100), 1, 1); }
          // l'uscita: luce bianca
          const gr = g.createLinearGradient(d.X(38), 0, d.X(41) + 16, 0); gr.addColorStop(0, "rgba(230,240,255,0)"); gr.addColorStop(1, "rgba(230,240,255,.7)"); g.fillStyle = gr; g.fillRect(d.X(38), d.Y(2), 64, 128);
          H.plaque(g, "USCITA ▸", d.X(40), d.Y(6) - 10, "#e0f2fe"); H.plaque(g, "🎞️ IL MIRINO", d.X(2) + 8, d.Y(7) - 6, "#fca5a5");
        }
      };
    },
    // ------------------------------------------------------------------ FUORI DALLA GALLERIA (scena ferma, ch. 3): le orme di uno che se ne va
    neve(H) {
      return {
        region: "monte", name: "Fuori dalla galleria, 1958", short: "Il pendio", sub: "Neve, i vivi contati, e una fila di orme", bg: "f5_neve_bg", time: "tramonto", w: 32, h: 22, base: "K", start: [3, 11], frozen: true,
        npcs: frozenNpcs("f5_neve"), objects: backJ, doors: { "0,11": { to: "f5_galleria", at: [40, 6] } }, act: { "<": "Torna nella galleria", "28,2": "Guarda dove finiscono le orme" },
        loot: { "28,2": { id: "f5_frame", text: "Dove finiscono le orme, mezzo sepolto: un fotogramma. Non è di Nando: è un ritaglio diverso, più piccolo, con un timbro straniero sul bordo.", empty: "Le orme proseguono oltre il crinale. La neve le ha già quasi coperte." } },
        build(L) {
          const { lay, put } = L; lay(0, 0, 0, 21, "R"); put(0, 11, "<"); lay(1, 0, 2, 8, "R"); lay(1, 14, 2, 21, "R");
          [[6, 3], [9, 5], [15, 2], [19, 7], [22, 12], [27, 9], [30, 14], [14, 17], [8, 19], [24, 19], [18, 15], [31, 4]].forEach(([x, y]) => put(x, y, "P")); put(4, 13, "J");
          lay(20, 0, 31, 0, "R");
        },
        top: camTop(),
        decor(g, cx, cy, d) {
          const f = frNow();
          // l'imbocco della galleria
          g.fillStyle = "#1c1917"; g.beginPath(); g.ellipse(d.X(1), d.Y(11) + 8, 14, 22, 0, -Math.PI / 2, Math.PI / 2); g.fill();
          // le orme: da dove sono i vivi fin su, verso il crinale
          for (let i = 0; i < 22; i++) { const t = i / 22, x = d.X(13) + (d.X(26) - d.X(13)) * t + Math.sin(i) * 3, y = d.Y(11) + (d.Y(3) - d.Y(11)) * t; g.fillStyle = "rgba(90,110,130,.55)"; g.beginPath(); g.ellipse(x + (i % 2) * 3, y, 1.6, 2.4, 0.4, 0, 7); g.fill(); }
          H.plaque(g, "🎞️ IL MIRINO", d.X(4) + 8, d.Y(13) - 6, "#fca5a5");
        }
      };
    },
    // ------------------------------------------------------------------ IL CIMITERO (oggi, ch. 4): le tombe con le fotografie ovali
    cimitero(H, npcs, o) {
      o = o || {};
      return {
        region: "cimitero", name: "Il cimitero del Borgo", short: "Cimitero", sub: "Cipressi, tombe con la foto ovale, un lumino per ognuno", bg: "f5_cimitero_bg", time: "tramonto", w: 30, h: 22, base: ",", start: [15, 19], travel: [15, 19],
        npcs: npcs || (() => []), items: o.items || [], itemCos: o.itemCos, loot: o.loot || {}, objects: o.objects || {},
        doors: { "15,21": { to: "f5_borgo", at: [34, 13] } }, act: Object.assign({ v: "Torna in piazza" }, o.act || {}), flavor: o.flavor || {},
        build(L) {
          const { lay, put, house } = L; lay(0, 0, 29, 0, "Y"); lay(0, 0, 0, 21, "Y"); lay(29, 0, 29, 21, "Y"); lay(0, 21, 29, 21, "Y"); put(15, 21, "v"); put(14, 21, "C"); put(16, 21, "C");
          lay(14, 2, 16, 20, "C"); lay(2, 10, 27, 11, "C"); lay(2, 4, 27, 4, "C"); lay(2, 16, 27, 16, "C");
          house(11, 1, 9, 3, { door: [15, 3], roof: "#57534e", wall: "#e7e5e4" }); put(15, 4, "C");
          [5, 7, 9, 11, 18, 20, 22, 24].forEach((x) => { put(x, 6, "I"); put(x, 8, "I"); put(x, 13, "I"); put(x, 18, "I"); });
          [[3, 2], [27, 2], [3, 14], [27, 14], [8, 20], [22, 20]].forEach(([x, y]) => put(x, y, "Y"));
        },
        decor(g, cx, cy, d) {
          const f = frNow(), K = window.__foto58Core && window.__foto58Core.K;
          // lumini rossi accesi sulle tombe
          [5, 7, 9, 11, 18, 20, 22, 24].forEach((x) => [6, 8, 13, 18].forEach((y) => { if ((x + y) % 3) return; const lx = d.X(x) + 13, ly = d.Y(y) + 13; g.fillStyle = "#dc2626"; g.fillRect(lx - 1, ly - 1, 3, 3); g.fillStyle = `rgba(253,224,71,${0.7 + 0.3 * Math.sin(f / 5 + x)})`; g.fillRect(lx, ly - 2, 1, 1.5); if (K) K.light(lx, ly, 12, "255,170,90", 0.35); }));
          H.plaque(g, "CIMITERO DEL BORGO", d.X(15) + 8, d.Y(1) - 2, "#e7e5e4"); H.plaque(g, "◂ LA PIAZZA", d.X(15) + 8, d.Y(21) - 4, "#e7e5e4");
          if (o.decor) o.decor(g, cx, cy, d, f);
        }
      };
    },
    // ------------------------------------------------------------------ L'ARCHIVIO DEL BORGO (oggi): la foto sul tavolo, il mirino, la camera oscura, la mostra
    archivio(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "interno", name: "L'Archivio del Borgo", short: "Archivio", sub: "Faldoni, il tavolo della foto, la camera oscura dietro la tenda", bg: "f5_archivio_bg", time: "giorno", w: 18, h: 11, start: [8, 9], outside: ["f5_borgo", 5, 6], base: "m",
        npcs, objects: o.objects || {}, loot: o.loot || {}, flavor: Object.assign({ c: "La bacheca della mostra «Un secolo di Rondine». Coppe di latta, una maglia del 1931, la tessera n. 1. Al centro un posto vuoto, con un cartellino: «1958»." }, o.flavor || {}),
        act: Object.assign({ T: "Guarda la foto", J: "Guarda nel mirino", k: "Usa la camera oscura", c: "Guarda la bacheca", L: "Leggi gli scaffali", x: "Apri la scatola di latta" }, o.act || {}),
        build(L) {
          const { lay, put } = L; lay(0, 0, 17, 10, "m"); lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 10, "a"); lay(17, 0, 17, 10, "a"); lay(0, 10, 17, 10, "a"); put(8, 10, "v");
          lay(1, 1, 6, 1, "L"); lay(11, 1, 13, 1, "L"); put(1, 3, "L"); put(1, 4, "L"); put(1, 5, "L");
          put(8, 4, "T"); put(9, 4, "T"); put(10, 4, "x"); put(11, 5, "J");
          lay(16, 3, 16, 5, "k"); lay(4, 7, 5, 7, "c"); lay(12, 7, 13, 7, "c"); put(15, 0, "W"); put(9, 0, "W");
        },
        decor(g, cx, cy, d) {
          const f = frNow(), K = window.__foto58Core && window.__foto58Core.K;
          // la tenda della camera oscura e la luce rossa che filtra
          R(g, d.X(15) + 6, d.Y(2), 4, 64, "#7f1d1d"); for (let i = 0; i < 4; i++) R(g, d.X(15) + 6, d.Y(2) + i * 16 + 2, 4, 1, "rgba(0,0,0,.3)"); if (K) K.light(d.X(16) + 8, d.Y(4), 30, "220,38,38", 0.45);
          // la foto sul tavolo e la scatola di latta
          R(g, d.X(8) + 6, d.Y(4) + 2, 18, 12, "#efe6d2"); R(g, d.X(8) + 8, d.Y(4) + 4, 14, 8, "#a48e66"); for (let i = 0; i < 5; i++) C(g, d.X(8) + 10 + i * 2.6, d.Y(4) + 7, 0.9, "#7f1d1d");
          R(g, d.X(10) + 2, d.Y(4) + 4, 12, 9, "#a8a29e"); R(g, d.X(10) + 2, d.Y(4) + 4, 12, 2, "#d6d3d1");
          // la lampada da tavolo
          C(g, d.X(9) + 14, d.Y(3) + 10, 3, "#fde68a"); if (K) K.light(d.X(9) + 14, d.Y(4), 34, "255,220,150", 0.5);
          H.plaque(g, "ARCHIVIO DEL BORGO", d.X(9), d.Y(0) + 6, "#fde68a"); H.plaque(g, "CAMERA OSCURA", d.X(16) + 6, d.Y(2) - 2, "#fca5a5"); H.plaque(g, "MOSTRA", d.X(8) + 8, d.Y(7) - 4, "#fca5a5");
          if (o.decor) o.decor(g, cx, cy, d, f);
        }
      };
    },
    // ------------------------------------------------------------------ IL BAR SPORT (oggi): il tavolino di Ilario, il bancone di Nello, le foto al muro
    bar(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "interno", name: "Il Bar Sport", short: "Bar Sport", sub: "Il bancone, le foto al muro, il tavolino vicino alla finestra", bg: "f5_bar_bg", time: "giorno", w: 16, h: 10, start: [8, 8], outside: ["f5_borgo", 30, 6], base: "m",
        npcs, objects: o.objects || {}, loot: o.loot || {}, act: Object.assign({ X: "Guarda il bancone", "9,0": "Guarda le foto al muro", "6,0": "Guarda le foto al muro", D: "Guarda le bottiglie" }, o.act || {}),
        flavor: Object.assign({ X: "Il bancone del Bar Sport. Nello lo lucida con lo stesso straccio da quarant'anni. Dice che lo straccio è nuovo: è il bancone che è vecchio.", D: "Bottiglie di amaro, grappa del Passo, uno sciroppo di menta che nessuno ha mai ordinato." }, o.flavor || {}),
        build(L) {
          const { lay, put } = L; lay(0, 0, 15, 9, "m"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 9, "a"); lay(15, 0, 15, 9, "a"); lay(0, 9, 15, 9, "a"); put(8, 9, "v");
          lay(2, 3, 7, 3, "X"); lay(1, 0, 5, 0, "D"); put(12, 0, "W"); put(14, 0, "W"); put(13, 3, "T"); put(11, 6, "T"); put(4, 6, "T"); put(14, 7, "T");
        },
        decor(g, cx, cy, d) {
          const f = frNow(), K = window.__foto58Core && window.__foto58Core.K;
          // le foto al muro: squadre, un carabiniere in alta uniforme, una coppa
          [[6, "#a48e66"], [9, "#8a7454"], [10, "#b9a37c"]].forEach(([x, c], i) => { R(g, d.X(x) + 2, d.Y(0) + 3, 12, 9, "#3b2414"); R(g, d.X(x) + 3, d.Y(0) + 4, 10, 7, c); if (i === 1) { C(g, d.X(x) + 8, d.Y(0) + 6, 1.6, "#d9b48a"); R(g, d.X(x) + 6, d.Y(0) + 8, 4, 3, "#1c1917"); R(g, d.X(x) + 6, d.Y(0) + 4, 4, 1.2, "#1c1917"); } });
          // la macchina del caffè che sbuffa, le carte del solitario
          R(g, d.X(5) + 2, d.Y(2) + 2, 12, 9, "#a8a29e"); for (let i = 0; i < 3; i++) { const t = (f / 2 + i * 12) % 30; g.fillStyle = `rgba(241,245,249,${0.4 - t / 80})`; C(g, d.X(5) + 8 + Math.sin(t / 5) * 2, d.Y(2) - t / 2, 2 + t / 12, g.fillStyle); }
          for (let i = 0; i < 5; i++) R(g, d.X(13) + 1 + i * 3, d.Y(3) + 3 + (i % 2), 3, 4, i % 2 ? "#f5f5f4" : "#fef3c7");
          if (K) { K.light(d.X(13) + 8, d.Y(0) + 8, 40, "255,240,210", 0.4); K.light(d.X(4), d.Y(3), 30, "255,210,140", 0.4); }
          H.plaque(g, "BAR SPORT · DAL 1949", d.X(8), d.Y(0) + 6, "#fbbf24");
          if (o.decor) o.decor(g, cx, cy, d, f);
        }
      };
    }
  };
})();
