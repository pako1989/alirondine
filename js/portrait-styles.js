// js/portrait-styles.js - STILI ALTERNATIVI DEI VOLTI (Impostazioni → Grafica → Stile dei volti)
// Ridisegna i ritratti di TUTTI i personaggi (CAST di game.js) in uno stile diverso, nello stesso riferimento del ritratto classico:
// origine al centro del viso, viso circa ±20 in larghezza, spalle fino a y=60. Il ritratto è deterministico: forma del viso,
// occhi, sopracciglia, naso, bocca, ciuffi e piccoli dettagli derivano dall'id del personaggio, così ogni volto è diverso.
//  - anime: cel-shading, occhi grandi con iride sfumata e riflessi, frangia a ciocche, contorni morbidi.
//  - pixel: lo stesso volto rimpicciolito e riposterizzato, con contorno scuro (ritratti alla JRPG a 16 bit).
// Uso (da game.js): window.__faceStyles.draw(style, g, id, c, expr) dentro un g già traslato/scalato sul ritratto.
(function () {
  "use strict";
  if (window.__faceStyles) return;
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return h >>> 0; };
  const hex = (c) => { c = String(c || "#888").replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); const n = parseInt(c.slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgb = (a) => `rgb(${a.map((v) => Math.max(0, Math.min(255, Math.round(v)))).join(",")})`;
  const mix = (c, k, to) => { const a = hex(c), b = to ? hex(to) : [0, 0, 0]; return rgb(a.map((v, i) => v + (b[i] - v) * k)); };
  const dark = (c, k) => mix(c, k, "#1a0f14"), lite = (c, k) => mix(c, k, "#ffffff");

  // tratti del viso dall'id: sempre uguali per lo stesso personaggio
  const fid = (id, c) => id + (c && c.face ? "|" + c.face : ""); // il Campione può scegliere il volto: cambia il seme dei tratti
  function traits(id, c) {
    const h = hash(fid(id, c)), b = (n, k) => (h >>> n) % k;
    return {
      fw: 15.5 + b(0, 5) * 0.9, chin: b(2, 3), eye: b(4, 4), eyeW: 5.0 + b(6, 5) * 0.55, eyeGap: 8.5 + b(8, 3) * 0.6, eyeY: 5 + b(10, 3) * 0.6,
      brow: b(12, 3), browTilt: (b(14, 5) - 2) * 0.06, nose: b(17, 3), mouth: b(19, 4), lash: b(21, 2), freckles: b(22, 7) === 0, mole: b(25, 6) === 0, fringe: b(27, 4), tuft: b(29, 3), vol: ((h >>> 3) ^ (h >>> 17)) % 3, nStr: 3 + ((h >>> 5) ^ (h >>> 23)) % 5, curly: ((h >>> 9) ^ (h >>> 26)) % 4 === 0, part: ((h >>> 11) ^ (h >>> 28)) % 3, shaved: ((h >>> 13) ^ (h >>> 30)) % 5 === 0, fringeLen: ((h >>> 1) ^ (h >>> 19)) % 3,
      cut: ((h >>> 7) ^ (h >>> 21)) % 3, faceL: (((h >>> 15) ^ (h >>> 24)) % 5) - 2, jaw: ((h >>> 4) ^ (h >>> 27)) % 3, eyeTilt: ((((h >>> 2) ^ (h >>> 20)) % 5) - 2) * 0.09, eyeH: 0.78 + (((h >>> 6) ^ (h >>> 22)) % 5) * 0.1, noseS: 0.8 + (((h >>> 10) ^ (h >>> 25)) % 4) * 0.18, mouthW: 0.8 + (((h >>> 12) ^ (h >>> 29)) % 4) * 0.15, earS: 0.85 + (((h >>> 14) ^ (h >>> 18)) % 3) * 0.15,
      older: c.tag === "gray" || /#(c|d|e|f)[0-9a-f](c|d|e|f)[0-9a-f](c|d|e|f)/i.test(c.hair || "") && !!c.beard,
    };
  }

  // ---------------------------------------------------------------- accessori del Campione negli stili alternativi
  // c.accFn(g, part) disegna gli accessori «classici» (bandana, sciarpa, fascia…) con il disegno originale; gli altri
  // (quelli delle saghe, che hanno un colore come valore) si ricavano dal nome: corona, maschera, elmo, mantello…
  const ACC_KINDS = [[/corona|diadema/, "crown", "#f2c230"], [/maschera|visore/, "mask", "#2a1a3a"], [/elmo/, "helmet", "#c9a227"], [/tricorno/, "tricorn", "#2a2a3a"], [/aura/, "aura", "#ff6a3a"],
    [/mantello/, "cape", "#8a1a2a"], [/sciarpa/, "scarf", "#b3202c"], [/fascia/, "band", "#ffd23f"], [/guanto/, "glove", "#e8e2d4"], [/./, "badge", "#ffd23f"]];
  function accKinds(c) { const l = String(c.accLbl || "").toLowerCase(), r = []; ACC_KINDS.forEach(([re, k, col]) => { if (re.test(l) && (k !== "badge" || !r.length)) r.push([k, c.accCol || col]); }); return r.length ? r : [["badge", c.accCol || "#ffd23f"]]; }
  function acc(g, c, part, G, ink) {
    if (!c.acc) return;
    if (c.accFn) { if (part !== "back") c.accFn(g, part); return; }
    const ol = (w) => { g.lineWidth = w; g.strokeStyle = ink; g.stroke(); };
    accKinds(c).forEach(([k, col]) => {
      g.save(); g.lineJoin = "round"; g.lineCap = "round";
      if (part === "back" && k === "aura") { // un alone che pulsa dietro al Campione
        const gr = g.createRadialGradient(0, 10, 10, 0, 10, 56); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.55, mix(col, 0, null).replace("rgb", "rgba").replace(")", ",.55)")); gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr; g.fillRect(-60, -50, 120, 115);
        g.fillStyle = lite(col, 0.3); g.globalAlpha = 0.6; for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.11), r = G.fw + 14; g.beginPath(); g.moveTo(Math.cos(a - 0.08) * (r - 6), 4 + Math.sin(a - 0.08) * (r - 4)); g.lineTo(Math.cos(a) * (r + 6 + (i % 2) * 5), 4 + Math.sin(a) * (r + 8 + (i % 2) * 5)); g.lineTo(Math.cos(a + 0.08) * (r - 6), 4 + Math.sin(a + 0.08) * (r - 4)); g.fill(); }
      }
      if (part === "body") {
        if (k === "cape") { // mantello sulle spalle, con il fermaglio
          [-1, 1].forEach((sd) => { g.beginPath(); g.moveTo(sd * 10, 30); g.quadraticCurveTo(sd * 30, 30, sd * 38, 62); g.lineTo(sd * 26, 62); g.quadraticCurveTo(sd * 22, 42, sd * 8, 34); g.closePath(); g.fillStyle = col; g.fill(); ol(1.4); g.beginPath(); g.moveTo(sd * 12, 32); g.quadraticCurveTo(sd * 26, 34, sd * 32, 58); g.strokeStyle = lite(col, 0.3); g.lineWidth = 1.2; g.stroke(); });
          g.beginPath(); g.moveTo(-14, 30); g.quadraticCurveTo(0, 24, 14, 30); g.lineTo(12, 34); g.quadraticCurveTo(0, 29, -12, 34); g.closePath(); g.fillStyle = dark(col, 0.25); g.fill(); ol(1.2);
          g.beginPath(); g.arc(0, 35, 2.8, 0, 7); g.fillStyle = "#f2c230"; g.fill(); ol(1);
        }
        if (k === "scarf") { g.beginPath(); g.moveTo(-15, 26); g.quadraticCurveTo(0, 31, 15, 26); g.lineTo(16, 34); g.quadraticCurveTo(0, 39, -16, 34); g.closePath(); g.fillStyle = col; g.fill(); ol(1.3); g.beginPath(); g.moveTo(6, 33); g.lineTo(14, 33); g.lineTo(16, 52); g.lineTo(8, 52); g.closePath(); g.fill(); ol(1.3); g.fillStyle = lite(col, 0.45); g.fillRect(8.5, 47, 7, 2); }
        if (k === "band") { g.beginPath(); g.moveTo(-33, 43); g.lineTo(-21, 41); g.lineTo(-20, 49); g.lineTo(-32, 51); g.closePath(); g.fillStyle = col; g.fill(); ol(1.2); g.fillStyle = dark(col, 0.6); g.font = "bold 6px sans-serif"; g.textAlign = "center"; if (g.getTransform().a > 0) g.fillText("C", -26.5, 48.5); g.textAlign = "left"; }
        if (k === "glove") { g.beginPath(); g.ellipse(25, 48, 6.5, 6, -0.3, 0, 7); g.fillStyle = col; g.fill(); ol(1.3); g.fillStyle = dark(col, 0.3); g.fillRect(20, 53, 11, 3); for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(21 + i * 3, 43); g.lineTo(22 + i * 3, 47); g.strokeStyle = dark(col, 0.4); g.lineWidth = 0.8; g.stroke(); } g.beginPath(); g.arc(25, 48, 2.2, 0, 7); g.strokeStyle = lite(col, 0.5); g.stroke(); }
        if (k === "badge") { g.beginPath(); g.moveTo(-26, 42); g.lineTo(-14, 42); g.lineTo(-14, 51); g.lineTo(-20, 57); g.lineTo(-26, 51); g.closePath(); g.fillStyle = col; g.fill(); ol(1.2); g.fillStyle = lite(col, 0.55); g.beginPath(); g.moveTo(-20, 44.5); g.lineTo(-17.5, 49); g.lineTo(-20, 53); g.lineTo(-22.5, 49); g.closePath(); g.fill(); }
      }
      if (part === "head") {
        const fw = G.fw, top = G.top;
        if (k === "crown") { g.beginPath(); g.moveTo(-13, top + 5); for (let i = 0; i <= 4; i++) { g.lineTo(-13 + i * 6.5, top - (i % 2 ? 3 : 8)); if (i < 4) g.lineTo(-10 + i * 6.5, top + 1); } g.lineTo(13, top + 5); g.closePath(); g.fillStyle = col; g.fill(); ol(1.3); g.fillStyle = lite(col, 0.4); g.fillRect(-12, top + 2, 24, 1.5); [[-6.5, "#e0303a"], [0, "#3fa7ff"], [6.5, "#57d68d"]].forEach(([x, gc]) => { g.beginPath(); g.arc(x, top + 0.5, 1.6, 0, 7); g.fillStyle = gc; g.fill(); }); }
        if (k === "helmet") { g.beginPath(); g.moveTo(-fw - 4, 0); g.quadraticCurveTo(-fw - 5, top - 6, 0, top - 7); g.quadraticCurveTo(fw + 5, top - 6, fw + 4, 0); g.lineTo(fw - 1, 0); g.lineTo(fw - 2, -6); g.lineTo(-fw + 2, -6); g.lineTo(-fw + 1, 0); g.closePath(); g.fillStyle = col; g.fill(); ol(1.5); g.fillStyle = lite(col, 0.4); g.beginPath(); g.ellipse(-6, top + 2, 4, 2.5, -0.4, 0, 7); g.fill(); g.beginPath(); g.moveTo(-3, top - 7); g.quadraticCurveTo(4, top - 20, 16, top - 14); g.quadraticCurveTo(6, top - 10, 3, top - 7); g.closePath(); g.fillStyle = "#c8102e"; g.fill(); ol(1.1); }
        if (k === "tricorn") { g.beginPath(); g.moveTo(-fw - 10, top + 10); g.quadraticCurveTo(-8, top - 2, 0, top - 4); g.quadraticCurveTo(8, top - 2, fw + 10, top + 10); g.quadraticCurveTo(0, top + 4, -fw - 10, top + 10); g.closePath(); g.fillStyle = "#2a2430"; g.fill(); ol(1.4); g.beginPath(); g.moveTo(-fw - 10, top + 10); g.quadraticCurveTo(0, top + 4, fw + 10, top + 10); g.strokeStyle = col; g.lineWidth = 1.6; g.stroke(); g.beginPath(); g.ellipse(0, top + 1, 9, 6, 0, Math.PI, 0); g.fillStyle = "#2a2430"; g.fill(); ol(1.2); g.beginPath(); g.arc(0, top + 2, 2, 0, 7); g.fillStyle = col; g.fill(); }
        if (k === "mask") { g.beginPath(); g.moveTo(-fw - 1, G.ey - 4); g.quadraticCurveTo(0, G.ey - 8, fw + 1, G.ey - 4); g.quadraticCurveTo(fw + 2, G.ey + 4, fw - 2, G.ey + 5); g.quadraticCurveTo(0, G.ey + 2, -fw + 2, G.ey + 5); g.quadraticCurveTo(-fw - 2, G.ey + 4, -fw - 1, G.ey - 4); g.closePath(); [-1, 1].forEach((sd) => { g.moveTo(sd * G.eg + 4, G.ey); g.ellipse(sd * G.eg, G.ey, 4, 2.6, 0, 0, Math.PI * 2, true); }); g.fillStyle = col; g.fill("evenodd"); ol(1.3); g.strokeStyle = lite(col, 0.45); g.lineWidth = 1; g.beginPath(); g.moveTo(-fw + 1, G.ey - 4); g.quadraticCurveTo(0, G.ey - 7, fw - 1, G.ey - 4); g.stroke(); }
      }
      g.restore();
    });
  }

  // ---------------------------------------------------------------- stile ANIME
  function anime0(g, id, c, expr, real) {
    const T = Object.assign({}, traits(id, c)), skin = c.skin || "#e0b48a", hair = c.hair || "#2b1d14", eyeC = c.eye || "#3a2a1a", shirt = c.shirt || (c.bg && c.bg[1]) || "#3f5fbf";
    if (real) { T.eyeW *= 0.62; T.eyeGap += 0.4; T.eyeY += 0.6; T.chin = T.chin === 1 ? 2 : T.chin; T.lash = 0; }
    const line = dark(skin, 0.62), shade = mix(skin, 0.22, "#a04a5a"), hairD = dark(hair, 0.35), hairL = lite(hair, 0.32), st = c.style || "messy";
    const longHair = st === "long" || st === "codino" || st === "bun" || st === "ponytail";
    g.lineJoin = "round"; g.lineCap = "round";
    const AG = { fw: T.fw, top: -24 - T.vol * 2.5, ey: T.eyeY, eg: T.eyeGap }; acc(g, c, "back", AG, line);
    // capelli dietro (lunghi)
    if (longHair) {
      g.fillStyle = hairD; g.beginPath(); g.moveTo(-T.fw - 6, -6); g.quadraticCurveTo(-T.fw - 10, 30, -T.fw - 4, st === "long" ? 50 : 30); g.lineTo(T.fw + 4, st === "long" ? 50 : 30); g.quadraticCurveTo(T.fw + 10, 30, T.fw + 6, -6); g.closePath(); g.fill();
    }
    if (st === "bun" && !c.cap) { g.fillStyle = hair; g.beginPath(); g.arc(0, -30, 9, 0, 7); g.fill(); g.strokeStyle = hairD; g.lineWidth = 1.2; g.stroke(); }
    if (st === "codino" || st === "ponytail") { g.fillStyle = hair; g.beginPath(); g.ellipse(T.fw + 8, 8, 6, 16, -0.25, 0, 7); g.fill(); g.strokeStyle = hairD; g.lineWidth = 1.2; g.stroke(); }
    // collo e spalle
    g.fillStyle = shade; g.fillRect(-6, 22, 12, 14);
    g.fillStyle = shirt; g.beginPath(); g.moveTo(-36, 62); g.quadraticCurveTo(-32, 36, -10, 32); g.lineTo(10, 32); g.quadraticCurveTo(32, 36, 36, 62); g.closePath(); g.fill();
    g.strokeStyle = dark(shirt, 0.5); g.lineWidth = 1.4; g.stroke();
    g.fillStyle = dark(shirt, 0.25); g.beginPath(); g.moveTo(-10, 32); g.lineTo(0, 42); g.lineTo(10, 32); g.lineTo(6, 32); g.lineTo(0, 38); g.lineTo(-6, 32); g.closePath(); g.fill(); // colletto
    g.fillStyle = lite(shirt, 0.18); g.beginPath(); g.moveTo(-30, 50); g.quadraticCurveTo(-26, 38, -12, 34); g.lineTo(-14, 38); g.quadraticCurveTo(-24, 42, -26, 52); g.closePath(); g.fill();
    if (c.num && g.getTransform().a > 0) { g.fillStyle = lite(shirt, 0.75); g.font = "bold 10px sans-serif"; g.textAlign = "center"; g.fillText(String(c.num).slice(0, 2), 18, 54); g.textAlign = "left"; }
    acc(g, c, "body", AG, line);
    // orecchie
    g.fillStyle = skin; g.strokeStyle = line; g.lineWidth = 1.1;
    [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * (T.fw + 1), 6, 3.2 * T.earS, 5 * T.earS, 0, 0, 7); g.fill(); g.stroke(); });
    // viso: tempie larghe, mento morbido o a punta
    const fw = T.fw, cy = [27, 29, 25][T.chin] + T.faceL, jw = T.jaw === 1 ? 1.5 : T.jaw === 2 ? -1.5 : 0; // mento più lungo o corto, mascella larga o sottile
    g.beginPath(); g.moveTo(-fw, -10); g.quadraticCurveTo(-fw - 1, 10, -fw + 3 - jw, 16 + T.faceL * 0.5);
    const j16 = 16 + T.faceL * 0.5;
    if (T.chin === 1) { g.quadraticCurveTo(-8 - jw, cy - 2, 0, cy); g.quadraticCurveTo(8 + jw, cy - 2, fw - 3 + jw, j16); }
    else if (T.chin === 2) { g.quadraticCurveTo(-10 - jw, cy, 0, cy); g.quadraticCurveTo(10 + jw, cy, fw - 3 + jw, j16); }
    else { g.quadraticCurveTo(-7 - jw, cy + 1, 0, cy); g.quadraticCurveTo(7 + jw, cy + 1, fw - 3 + jw, j16); }
    g.quadraticCurveTo(fw + 1, 10, fw, -10); g.quadraticCurveTo(0, -26, -fw, -10); g.closePath();
    g.fillStyle = skin; g.fill(); g.strokeStyle = line; g.lineWidth = 1.3; g.stroke();
    // ombra a cel-shading sul lato destro e sotto la frangia
    g.save(); g.clip(); g.fillStyle = shade; g.globalAlpha = 0.55; g.beginPath(); g.moveTo(fw * 0.35, -20); g.quadraticCurveTo(fw * 0.7, 10, 2, cy + 2); g.lineTo(fw + 4, cy + 2); g.lineTo(fw + 4, -20); g.closePath(); g.fill(); g.globalAlpha = 0.5; g.fillRect(-fw, -12, fw * 2, 5); g.restore();
    // barba
    if (c.beard) { g.fillStyle = hair; g.globalAlpha = 0.85; g.beginPath(); g.moveTo(-fw + 2, 10); g.quadraticCurveTo(-fw + 3, cy, 0, cy + 3); g.quadraticCurveTo(fw - 3, cy, fw - 2, 10); g.quadraticCurveTo(6, 22, 0, 21); g.quadraticCurveTo(-6, 22, -fw + 2, 10); g.fill(); g.globalAlpha = 1; }
    // guance
    if (expr === "smile" || expr === "grin") { g.fillStyle = "rgba(200,90,90,.14)"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * (T.eyeGap + 2), 14, 3.5, 1.6, 0, 0, 7); g.fill(); }); } // un filo di rossore solo quando ride
    if (T.freckles) { g.fillStyle = dark(skin, 0.25); [[-11, 12], [-9, 14], [-13, 14], [11, 12], [9, 14], [13, 14]].forEach(([x, y]) => g.fillRect(x, y, 1, 1)); }
    if (T.mole) { g.fillStyle = dark(skin, 0.55); g.beginPath(); g.arc(7, 20, 0.9, 0, 7); g.fill(); }
    // occhi
    const blink = expr === "blink", wide = expr === "surprised", sad = expr === "sad", angry = expr === "angry", happy = expr === "smile" || expr === "grin";
    [-1, 1].forEach((sd) => {
      const ex = sd * T.eyeGap, ey = T.eyeY, ew = T.eyeW * (wide ? 1.12 : 1), eh = [7, 5.4, 6.4, 4.8][T.eye] * T.eyeH * (wide ? 1.2 : 1) * (real ? 0.45 : 1);
      g.save(); g.translate(ex, ey); g.rotate(-sd * T.eyeTilt); g.translate(-ex, -ey); // occhi a mandorla (all'insù) o cadenti
      if (blink || happy && expr === "grin") { g.strokeStyle = line; g.lineWidth = 1.6; g.beginPath(); g.arc(ex, ey + 1, ew * 0.8, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.restore(); return; }
      // bianco
      g.fillStyle = "#fbf8f4"; g.beginPath(); g.ellipse(ex, ey, ew, eh, 0, 0, 7); g.fill();
      // iride sfumata, pupilla, riflessi
      g.save(); g.beginPath(); g.ellipse(ex, ey, ew, eh, 0, 0, 7); g.clip();
      const ir = g.createLinearGradient(0, ey - eh, 0, ey + eh); ir.addColorStop(0, dark(eyeC, 0.45)); ir.addColorStop(0.6, eyeC); ir.addColorStop(1, lite(eyeC, 0.45));
      g.fillStyle = ir; g.beginPath(); g.ellipse(ex + sd * -0.4, ey + (real ? 0.2 : 0.6), ew * (real ? 0.55 : 0.74), eh * (real ? 1.15 : 0.98), 0, 0, 7); g.fill();
      g.fillStyle = dark(eyeC, 0.7); g.beginPath(); g.ellipse(ex + sd * -0.4, ey + 0.8, ew * 0.28, eh * 0.42, 0, 0, 7); g.fill();
      g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(ex - ew, ey - eh, ew * 2, eh * 0.45);
      g.restore();
      if (real) { g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.arc(ex - 0.8, ey - 0.6, 0.6, 0, 7); g.fill(); g.strokeStyle = dark(skin, 0.3); g.lineWidth = 0.7; g.beginPath(); g.ellipse(ex, ey - 1.2, ew + 0.6, eh + 1.8, 0, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); } // piega della palpebra
      else { g.fillStyle = "#fff"; g.beginPath(); g.arc(ex - 1.6, ey - 1.6, 1.5, 0, 7); g.fill(); g.beginPath(); g.arc(ex + 1.6, ey + 2.2, 0.8, 0, 7); g.fill(); }
      // ciglia superiori spesse, inferiori sottili
      g.strokeStyle = dark(hair, 0.55); g.lineWidth = real ? 1.1 : 2; g.beginPath(); g.ellipse(ex, ey, ew + 0.3, eh + 0.2, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
      if (T.lash) { g.lineWidth = 1.2; g.beginPath(); g.moveTo(ex + sd * (ew - 0.5), ey - eh * 0.6); g.lineTo(ex + sd * (ew + 2.2), ey - eh * 0.95); g.stroke(); }
      g.strokeStyle = line; g.lineWidth = 0.8; g.beginPath(); g.ellipse(ex, ey, ew, eh, 0, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
      if (sad) { g.fillStyle = "#8fd3ff"; g.beginPath(); g.ellipse(ex + sd * 2, ey + eh + 3, 1.2, 2, 0, 0, 7); g.fill(); }
      g.restore();
    });
    // sopracciglia
    g.strokeStyle = dark(hair, 0.3); g.lineWidth = [1.4, 2.4, 1.8][T.brow];
    [-1, 1].forEach((sd) => {
      const bx = sd * T.eyeGap, by = T.eyeY - 9 - (wide ? 2 : 0), tilt = (angry ? 0.35 : sad ? -0.3 : T.browTilt) * sd;
      g.beginPath(); g.moveTo(bx - sd * 5, by + tilt * 6 + (T.brow === 2 ? 1 : 0)); g.quadraticCurveTo(bx, by - (T.brow === 2 ? 2 : 0.5) - tilt, bx + sd * 5, by - tilt * 6 + 1); g.stroke();
    });
    // naso (più o meno grande)
    g.save(); g.translate(0, 13); g.scale(T.noseS, T.noseS); g.translate(0, -13);
    g.strokeStyle = dark(skin, 0.4); g.lineWidth = 1;
    if (T.nose === 0) { g.beginPath(); g.moveTo(1, 12); g.lineTo(-0.5, 15); g.stroke(); }
    else if (T.nose === 1) { g.beginPath(); g.moveTo(1.5, 10); g.quadraticCurveTo(2.5, 14, 0, 15.5); g.stroke(); }
    else { g.fillStyle = dark(skin, 0.18); g.beginPath(); g.moveTo(0, 11); g.lineTo(2.5, 15); g.lineTo(-1, 15.5); g.closePath(); g.fill(); }
    if (real) { g.fillStyle = mix(skin, 0.2, "#7a3a3a"); g.globalAlpha = 0.55; g.beginPath(); g.moveTo(1.5, 6); g.quadraticCurveTo(3.5, 12, 2.5, 15); g.lineTo(0.5, 15); g.closePath(); g.fill(); g.globalAlpha = 1; g.fillStyle = dark(skin, 0.45); [-1.6, 1.6].forEach((nx) => { g.beginPath(); g.ellipse(nx, 15.2, 0.9, 0.5, 0, 0, 7); g.fill(); }); g.fillStyle = "rgba(0,0,0,.06)"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * (fw - 4), 14, 3, 6, 0, 0, 7); g.fill(); }); } // ombra del naso, narici, zigomi
    g.restore();
    // bocca (larga o piccola)
    const my = 20.5 + T.faceL * 0.4; g.save(); g.translate(0, my); g.scale(T.mouthW, 1); g.translate(0, -my);
    g.strokeStyle = dark(skin, 0.6); g.lineWidth = 1.3;
    if (expr === "grin") { g.fillStyle = "#7a2a3a"; g.beginPath(); g.moveTo(-5, my - 1); g.quadraticCurveTo(0, my + 7, 5, my - 1); g.closePath(); g.fill(); g.fillStyle = "#fff"; g.fillRect(-3.5, my - 0.8, 7, 1.6); }
    else if (expr === "smile" || T.mouth === 1 && !sad && !angry) { g.beginPath(); g.moveTo(-4, my); g.quadraticCurveTo(0, my + 3.5, 4, my); g.stroke(); }
    else if (sad) { g.beginPath(); g.moveTo(-3.5, my + 2); g.quadraticCurveTo(0, my - 1, 3.5, my + 2); g.stroke(); }
    else if (angry) { g.beginPath(); g.moveTo(-4, my + 1); g.lineTo(4, my); g.stroke(); }
    else if (wide) { g.fillStyle = "#7a2a3a"; g.beginPath(); g.ellipse(0, my + 1, 2.2, 3, 0, 0, 7); g.fill(); }
    else if (T.mouth === 2) { g.beginPath(); g.moveTo(-3, my); g.quadraticCurveTo(0, my + 1.2, 3, my - 0.6); g.stroke(); }
    else if (T.mouth === 3) { g.beginPath(); g.moveTo(-2.5, my + 0.5); g.lineTo(2.5, my + 0.5); g.stroke(); g.fillStyle = "rgba(200,80,100,.35)"; g.fillRect(-2, my + 1.4, 4, 1.2); }
    else { g.beginPath(); g.moveTo(-3, my); g.quadraticCurveTo(0, my + 2, 3, my); g.stroke(); }
    if (real && !expr) { g.fillStyle = mix(skin, 0.35, "#b04a4a"); g.globalAlpha = 0.5; g.beginPath(); g.ellipse(0, my + 1.6, 3, 1.1, 0, 0, 7); g.fill(); g.globalAlpha = 1; } // labbro inferiore
    g.restore();
    // capelli davanti: calotta + frangia a ciocche
    if (st !== "buzz" || !c.cap) {
      g.save(); if (c.cap) { g.beginPath(); g.rect(-60, -7, 120, 90); g.clip(); } // sotto il cappello: niente capelli sopra la visiera
      const top = (st === "buzz" ? -19 : st === "cresta" ? -20 : -24) - (st === "buzz" ? 0 : T.vol * 2.5), side = T.shaved && (st === "messy" || st === "spiky" || st === "cresta") ? 4 : 0;
      g.fillStyle = hair; g.strokeStyle = hairD; g.lineWidth = 1.3;
      g.beginPath(); g.moveTo(-fw - 2.5 + side, 4 - side * 2); g.quadraticCurveTo(-fw - 3 - T.vol, top + 4, -6, top); g.quadraticCurveTo(T.part === 1 ? -2 : T.part === 2 ? 3 : 0, top - 2 - T.vol, 6, top); g.quadraticCurveTo(fw + 3 + T.vol, top + 4, fw + 2.5 - side, 4 - side * 2);
      // ciocche della frangia (verso sinistra, destra o divise)
      const n = st === "buzz" ? 0 : st === "slick" ? 2 : T.nStr, dir = T.part === 1 ? 2 : T.part === 2 ? -2 : [1, -1, 0, 1][T.fringe];
      if (n) { for (let i = n; i >= 0; i--) { const x0 = -fw + (2 * fw) * (i / n), tipY = st === "slick" ? -10 : (i % 2 ? -2 : 1) + (st === "spiky" ? -4 : 0) - (2 - T.fringeLen) * 3 + (T.part && ((T.part === 1) === (i < n / 2)) ? 3 : 0), tipX = x0 - dir * 3; g.lineTo(x0 + (2 * fw) / n * 0.5, -12); g.lineTo(tipX, tipY); } }
      else g.lineTo(-fw - 2.5, -4);
      g.closePath(); g.fill(); g.stroke();
      if (st === "spiky" && !c.cap) { for (let i = 0; i < 5; i++) { const a = Math.PI * (1.1 + i * 0.2); g.beginPath(); g.moveTo(Math.cos(a) * 14, top + 8 + Math.sin(a) * 6); g.lineTo(Math.cos(a) * 24, top + 2 + Math.sin(a) * 14); g.lineTo(Math.cos(a + 0.25) * 14, top + 8 + Math.sin(a + 0.25) * 6); g.closePath(); g.fill(); g.stroke(); } }
      if (st === "cresta") { g.beginPath(); g.moveTo(-4, top + 2); g.lineTo(0, top - 12); g.lineTo(4, top + 2); g.closePath(); g.fill(); g.stroke(); }
      if (st === "messy" && !c.cap) { for (let i = 0; i < T.tuft + 1; i++) { g.beginPath(); g.moveTo(-4 + i * 5, top + 1); g.quadraticCurveTo(-2 + i * 5, top - 7, 2 + i * 5, top - 5); g.quadraticCurveTo(0 + i * 5, top - 1, 1 + i * 5, top + 2); g.fill(); } }
      if (longHair) { g.beginPath(); g.moveTo(-fw - 2.5, 0); g.quadraticCurveTo(-fw - 5, 18, -fw - 1, 30); g.lineTo(-fw + 3, 14); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(fw + 2.5, 0); g.quadraticCurveTo(fw + 5, 18, fw + 1, 30); g.lineTo(fw - 3, 14); g.closePath(); g.fill(); g.stroke(); }
      if (T.curly && st !== "buzz" && st !== "slick" && !c.cap) { // ricci: una nuvola morbida (prima i contorni, poi il pieno, così restano solo i bordi esterni)
        const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (1.0 + i / 12), r = fw + 2 + T.vol; pts.push([Math.cos(a) * r, top + 17 + Math.sin(a) * (16 + T.vol * 2)]); }
        g.lineWidth = 2.2; g.strokeStyle = hairD; pts.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 5, 0, 7); g.stroke(); });
        g.fillStyle = hair; pts.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); });
        g.beginPath(); g.ellipse(0, top + 12, fw, 9, 0, 0, 7); g.fill();
        g.strokeStyle = hairD; g.lineWidth = 0.9; pts.forEach(([x, y], i) => { if (i % 2) return; g.beginPath(); g.arc(x * 0.8, y + 4, 2, 0.5, 3.6); g.stroke(); });
      }
      // tagli diversi a parità di stile: ciuffo all'indietro, frangia di lato sull'occhio, onde, caschetto dritto
      if (!c.cap && st === "slick" && T.cut === 1) { g.fillStyle = hair; g.strokeStyle = hairD; g.lineWidth = 1.3; g.beginPath(); g.moveTo(-10, top + 4); g.quadraticCurveTo(-8, top - 5, 4, top - 5); g.quadraticCurveTo(13, top - 4, 10, top + 4); g.closePath(); g.fill(); g.stroke(); g.strokeStyle = hairL; g.lineWidth = 1.4; g.beginPath(); g.arc(0, top + 2, 8, Math.PI * 1.2, Math.PI * 1.7); g.stroke(); }
      if (st === "messy" && T.cut === 2) { g.fillStyle = hair; g.strokeStyle = hairD; g.lineWidth = 1.2; const sd = T.part === 2 ? -1 : 1; g.beginPath(); g.moveTo(-sd * 6, -14); g.quadraticCurveTo(sd * 4, -10, sd * (T.eyeGap + 6), T.eyeY + 2); g.quadraticCurveTo(sd * (T.eyeGap - 2), T.eyeY - 6, -sd * 2, -10); g.closePath(); g.fill(); g.stroke(); }
      if (longHair && T.cut === 2) { g.strokeStyle = hairD; g.lineWidth = 1; [-1, 1].forEach((sd) => { for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(sd * (fw + 1), 4 + k * 8); g.quadraticCurveTo(sd * (fw + 5), 8 + k * 8, sd * (fw + 1), 12 + k * 8); g.stroke(); } }); }
      if (longHair && T.cut === 1 && st === "long") { g.fillStyle = hair; g.strokeStyle = hairD; g.lineWidth = 1.2; [-1, 1].forEach((sd) => { g.beginPath(); g.rect(sd > 0 ? fw - 3 : -fw - 3, -4, 6, 24); g.fill(); g.stroke(); }); g.beginPath(); g.moveTo(-fw, -12); g.lineTo(fw, -12); g.lineTo(fw, -6); g.lineTo(-fw, -6); g.closePath(); g.fill(); g.stroke(); }
      if (side) { g.fillStyle = dark(hair, 0.1); g.globalAlpha = 0.45; [-1, 1].forEach((sd) => { for (let i = 0; i < 10; i++) g.fillRect(sd * (fw - 1) - 1 + (i % 2), -6 + i * 1.4, 1, 1); }); g.globalAlpha = 1; } // lati rasati
      if (T.part && st !== "buzz" && st !== "cresta") { g.strokeStyle = hairD; g.lineWidth = 1; g.beginPath(); g.moveTo(T.part === 1 ? -5 : 5, top + 1); g.quadraticCurveTo(T.part === 1 ? -6 : 6, top + 6, T.part === 1 ? -8 : 8, top + 9); g.stroke(); } // riga di lato
      // riflesso a fascia
      g.strokeStyle = hairL; g.lineWidth = 2; g.globalAlpha = 0.75; g.beginPath(); g.arc(-2, top + 18, 15, Math.PI * 1.15, Math.PI * 1.55); g.stroke(); g.globalAlpha = 1;
      g.restore();
    }
    if (c.older) { g.strokeStyle = dark(skin, 0.3); g.lineWidth = 0.8; [-1, 1].forEach((sd) => { g.beginPath(); g.moveTo(sd * (T.eyeGap + T.eyeW + 1), T.eyeY); g.lineTo(sd * (T.eyeGap + T.eyeW + 3), T.eyeY + 2); g.stroke(); }); }
    // accessori
    if (c.glasses) { g.strokeStyle = "#1a1a22"; g.lineWidth = 1.4; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * T.eyeGap, T.eyeY, T.eyeW + 2.4, 6.4, 0, 0, 7); g.stroke(); }); g.beginPath(); g.moveTo(-T.eyeGap + T.eyeW + 2, T.eyeY); g.lineTo(T.eyeGap - T.eyeW - 2, T.eyeY); g.stroke(); g.fillStyle = "rgba(255,255,255,.25)"; [-1, 1].forEach((sd) => g.fillRect(sd * T.eyeGap - 3, T.eyeY - 4, 2, 3)); }
    if (c.shades) { g.fillStyle = "#111"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * T.eyeGap, T.eyeY, T.eyeW + 2.5, 5, 0, 0, 7); g.fill(); }); g.fillRect(-T.eyeGap, T.eyeY - 1, T.eyeGap * 2, 1.6); }
    if (c.cap) { g.fillStyle = c.cap; g.strokeStyle = dark(c.cap, 0.5); g.lineWidth = 1.3; g.beginPath(); g.moveTo(-fw - 3, -6); g.quadraticCurveTo(-fw, -28, 0, -29); g.quadraticCurveTo(fw, -28, fw + 3, -6); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.ellipse(-6, -6, fw + 4, 3.5, -0.08, 0, 7); g.fill(); g.stroke(); g.fillStyle = lite(c.cap, 0.3); g.fillRect(-2, -26, 4, 3); }
    acc(g, c, "head", AG, line);
  }



  // ---------------------------------------------------------------- ACCONCIATURE IN PIÙ (per Anime, Illustrato, Cartone, Fumetto e, di riflesso, Manga, Acquerello, Pixel)
  // Ogni stile conosce 9 tagli di base; le altre acconciature si appoggiano a una base e aggiungono i loro pezzi dietro
  // (code, chignon, afro, trecce lunghe…) e davanti (ciuffo, bandana, treccia di lato…), con i colori del personaggio.
  const HALIAS = { short: "buzz", corto: "buzz", lungo: "long", flowing: "long", coda: "ponytail", medium: "slick" };
  const HBASE = { afro: "buzz", dread: "buzz", undercut: "slick", pompadour: "slick", mullet: "messy", wavy: "long", messybun: "bun", topknot: "buzz", sidebraid: "slick", spacebuns: "buzz", corona: "slick", ciuffo: "slick", cometa: "buzz", scodella: "buzz", antenne: "buzz", criniera: "slick",
    bob: "slick", twintails: "slick", braids: "slick", curly: "buzz", side: "slick", ordinato: "slick", bandana: "messy", hood: "buzz", elmo: "buzz" };
  function hairOver(g, st, c, part) {
    const hair = c.hair || "#2b1d14", hd = dark(hair, 0.42), hl = lite(hair, 0.32), fw = 18;
    const blob = (x, y, rx, ry, rot) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, 7); g.fillStyle = hair; g.fill(); g.strokeStyle = hd; g.lineWidth = 1.2; g.stroke(); };
    const shine = (x, y, r, a0, a1) => { g.strokeStyle = hl; g.lineWidth = 1.4; g.globalAlpha = 0.7; g.beginPath(); g.arc(x, y, r, a0, a1); g.stroke(); g.globalAlpha = 1; };
    const braid = (x0, y0, x1, y1, n, w) => { for (let i = 0; i < n; i++) { const t = i / (n - 1), x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; blob(x, y, w - t * 0.8, w * 0.9 - t * 0.6, 0.4); } };
    g.save(); g.lineJoin = "round"; g.lineCap = "round";
    if (part === "back") {
      if (st === "afro") { blob(0, -10, 30, 27); for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; g.fillStyle = hair; g.beginPath(); g.arc(Math.cos(a) * 27, -10 + Math.sin(a) * 24, 6, 0, 7); g.fill(); } shine(-6, -18, 16, Math.PI * 1.1, Math.PI * 1.5); }
      if (st === "curly") { for (let i = 0; i <= 11; i++) { const a = Math.PI * (0.92 + i / 11 * 1.16); blob(Math.cos(a) * (fw + 3), -6 + Math.sin(a) * 22, 6.5, 6); } }
      if (st === "dread") { g.fillStyle = hd; g.beginPath(); g.ellipse(0, -10, fw + 6, 20, 0, Math.PI, 0); g.fill(); for (let i = 0; i < 9; i++) { const x = -fw - 5 + i * ((fw + 5) * 2 / 8), L = 30 + (i % 3) * 8; g.fillStyle = i % 2 ? hair : dark(hair, 0.15); g.beginPath(); g.roundRect ? g.roundRect(x - 2.4, -14, 4.8, L, 2.4) : g.rect(x - 2.4, -14, 4.8, L); g.fill(); g.strokeStyle = hd; g.lineWidth = 0.8; g.stroke(); for (let k = 0; k < L; k += 5) { g.beginPath(); g.moveTo(x - 2.4, -14 + k); g.lineTo(x + 2.4, -12 + k); g.stroke(); } } }
      if (st === "mullet") { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw + 2, 0); g.bezierCurveTo(-fw - 4, 16, -fw - 2, 30, -fw + 4, 36); g.lineTo(fw - 4, 36); g.bezierCurveTo(fw + 2, 30, fw + 4, 16, fw - 2, 0); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.2; g.stroke(); }
      if (st === "wavy") { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw - 4, -8); for (let y = -8; y <= 52; y += 8) g.quadraticCurveTo(-fw - 10 + ((y / 8) % 2) * 6, y + 4, -fw - 6 + ((y / 8) % 2) * 3, y + 8); g.lineTo(fw + 6, 60); for (let y = 52; y >= -8; y -= 8) g.quadraticCurveTo(fw + 10 - ((y / 8) % 2) * 6, y + 4, fw + 4, y); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.2; g.stroke(); }
      if (st === "bob") { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw - 5, -6); g.bezierCurveTo(-fw - 8, 10, -fw - 6, 22, -fw - 2, 24); g.lineTo(fw + 2, 24); g.bezierCurveTo(fw + 6, 22, fw + 8, 10, fw + 5, -6); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.2; g.stroke(); }
      if (st === "messybun") { blob(0, -31, 10, 8); [[-8, -36, -0.6], [7, -37, 0.5], [0, -40, 0]].forEach(([x, y, r]) => { g.strokeStyle = hair; g.lineWidth = 2; g.beginPath(); g.moveTo(x * 0.4, -33); g.quadraticCurveTo(x, y - 3, x * 1.3, y + 2 * Math.sign(r || 1)); g.stroke(); }); shine(-2, -33, 6, Math.PI * 1.1, Math.PI * 1.5); }
      if (st === "topknot") { blob(0, -32, 6, 6); g.fillStyle = "#c83a3a"; g.fillRect(-4, -27.5, 8, 2.5); shine(-1, -33, 4, Math.PI * 1.1, Math.PI * 1.6); }
      if (st === "spacebuns") { [-1, 1].forEach((sd) => { blob(sd * 15, -25, 8, 8); shine(sd * 15 - 2, -27, 5, Math.PI * 1.1, Math.PI * 1.5); }); }
      if (st === "hood") { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw - 10, 40); g.bezierCurveTo(-fw - 14, -36, fw + 14, -36, fw + 10, 40); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.3; g.stroke(); }
    } else {
      if (st === "pompadour") { g.fillStyle = hair; g.beginPath(); g.moveTo(-12, -16); g.bezierCurveTo(-16, -36, 10, -44, 16, -30); g.bezierCurveTo(18, -22, 8, -18, 4, -16); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.3; g.stroke(); shine(0, -24, 12, Math.PI * 1.15, Math.PI * 1.55); }
      if (st === "undercut") { [-1, 1].forEach((sd) => { g.fillStyle = mix(hair, 0.55, c.skin || "#e0b48a"); g.globalAlpha = 0.85; g.fillRect(sd > 0 ? fw - 4 : -fw, -12, 4, 14); g.globalAlpha = 1; }); g.fillStyle = hair; g.beginPath(); g.moveTo(-12, -14); g.bezierCurveTo(-8, -32, 14, -32, 16, -16); g.lineTo(6, -18); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.2; g.stroke(); }
      if (st === "sidebraid") braid(15, -6, 21, 44, 8, 4.6);
      if (st === "criniera") { g.fillStyle = hair; g.beginPath(); g.moveTo(-4, -30); g.quadraticCurveTo(12, -46, 28, -30); g.quadraticCurveTo(34, -10, 28, 18); g.quadraticCurveTo(24, 32, 30, 42); g.quadraticCurveTo(16, 34, 18, 14); g.quadraticCurveTo(20, -8, 10, -20); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.3; g.stroke(); shine(18, -10, 10, Math.PI * 1.2, Math.PI * 1.6); }
      if (st === "antenne") { g.strokeStyle = hair; g.lineWidth = 3.5; g.lineCap = "round"; [-1, 1].forEach((sd) => { g.beginPath(); g.moveTo(sd * 6, -26); g.quadraticCurveTo(sd * 9, -40, sd * 17, -44); g.stroke(); g.fillStyle = hair; g.beginPath(); g.arc(sd * 17, -44, 4, 0, 7); g.fill(); g.strokeStyle = hd; g.lineWidth = 1; g.stroke(); g.strokeStyle = hair; g.lineWidth = 3.5; }); g.lineCap = "butt"; }
      if (st === "scodella") { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw - 3, -2); g.bezierCurveTo(-fw - 4, -34, fw + 4, -34, fw + 3, -2); g.lineTo(fw + 3, -8); g.lineTo(-fw - 3, -8); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.3; g.stroke(); g.beginPath(); g.moveTo(-fw - 2, -9); g.lineTo(fw + 2, -9); g.stroke(); shine(-2, -18, 12, Math.PI * 1.15, Math.PI * 1.5); }
      if (st === "cometa") { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw + 2, -14); g.quadraticCurveTo(-6, -46, fw + 6, -44); g.quadraticCurveTo(6, -34, fw - 2, -14); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.3; g.stroke(); g.fillStyle = "#ffd23f"; g.beginPath(); g.moveTo(8, -42); g.quadraticCurveTo(16, -45, fw + 6, -44); g.quadraticCurveTo(14, -38, 12, -34); g.closePath(); g.fill(); shine(0, -28, 10, Math.PI * 1.15, Math.PI * 1.5); }
      if (st === "corona") { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.08 + i * 0.105); blob(Math.cos(a) * (fw + 2), -12 + Math.sin(a) * 15, 4.6, 3.8, a); } shine(-4, -22, 8, Math.PI * 1.15, Math.PI * 1.5); }
      if (st === "ciuffo") { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw + 1, -14); g.bezierCurveTo(-4, -26, 12, -22, fw - 1, -4); g.bezierCurveTo(fw - 3, 4, 10, 2, 6, -4); g.bezierCurveTo(1, -10, -8, -10, -fw + 2, -6); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.2; g.stroke(); shine(4, -12, 10, Math.PI * 1.2, Math.PI * 1.55); }
      if (st === "braids") { braid(-17, -2, -20, 42, 7, 4.2); braid(17, -2, 20, 42, 7, 4.2); [-20, 20].forEach((x) => { g.fillStyle = "#ffd23f"; g.fillRect(x - 3, 44, 6, 3); }); }
      if (st === "twintails") { [-1, 1].forEach((sd) => { g.fillStyle = hair; g.beginPath(); g.moveTo(sd * 15, -16); g.bezierCurveTo(sd * 34, -14, sd * 32, 18, sd * 24, 38); g.bezierCurveTo(sd * 22, 18, sd * 22, 2, sd * 13, -8); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.2; g.stroke(); g.fillStyle = "#ff8fb8"; g.beginPath(); g.arc(sd * 16, -15, 3, 0, 7); g.fill(); }); }
      if (st === "side") { g.fillStyle = hair; g.beginPath(); g.moveTo(-fw, -6); g.bezierCurveTo(-8, -22, 10, -22, fw + 1, -10); g.lineTo(fw - 2, -4); g.bezierCurveTo(6, -14, -6, -12, -fw + 2, 2); g.closePath(); g.fill(); g.strokeStyle = hd; g.lineWidth = 1.1; g.stroke(); }
      if (st === "ordinato") { g.strokeStyle = hd; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-6, -24); g.quadraticCurveTo(-7, -18, -9, -12); g.stroke(); shine(2, -16, 12, Math.PI * 1.15, Math.PI * 1.5); }
      if (st === "bandana") { g.fillStyle = "#c83a3a"; g.beginPath(); g.moveTo(-fw - 2, -10); g.quadraticCurveTo(0, -18, fw + 2, -10); g.lineTo(fw + 2, -5); g.quadraticCurveTo(0, -13, -fw - 2, -5); g.closePath(); g.fill(); g.strokeStyle = dark("#c83a3a", 0.5); g.lineWidth = 1; g.stroke(); g.beginPath(); g.moveTo(fw, -9); g.lineTo(fw + 9, -3); g.lineTo(fw + 5, 1); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#fff"; [[-8, -11], [0, -13], [8, -11]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 0.9, 0, 7); g.fill(); }); }
      if (st === "elmo") { g.fillStyle = "#9aa0ac"; g.beginPath(); g.moveTo(-fw - 4, -2); g.bezierCurveTo(-fw - 5, -32, fw + 5, -32, fw + 4, -2); g.closePath(); g.fill(); g.strokeStyle = "#4a505c"; g.lineWidth = 1.3; g.stroke(); g.fillStyle = "#c8a040"; g.fillRect(-2, -36, 4, 14); g.fillStyle = "#6a707c"; g.fillRect(-fw - 4, -6, 2 * fw + 8, 4); }
      if (st === "dread") { for (let i = 0; i < 4; i++) { const x = -9 + i * 6; g.fillStyle = hair; g.beginPath(); g.roundRect ? g.roundRect(x - 2, -20, 4, 12 + (i % 2) * 4, 2) : g.rect(x - 2, -20, 4, 14); g.fill(); g.strokeStyle = hd; g.lineWidth = 0.8; g.stroke(); } }
      if (st === "curly") { for (let i = 0; i < 5; i++) blob(-12 + i * 6, -14 + (i % 2) * 2, 4, 3.6); }
    }
    g.restore();
  }
  const withHair = (fn) => function (g, id, c, expr, real) {
    const st0 = HALIAS[c.style] || c.style, base = HBASE[st0];
    if (!base) return fn(g, id, c, expr, real);
    if (!c.cap) hairOver(g, st0, c, "back");
    fn(g, id, Object.assign({}, c, { style: base }), expr, real);
    if (!c.cap || st0 === "sidebraid" || st0 === "braids" || st0 === "twintails") hairOver(g, st0, c, "front");
  };
  const anime = withHair(anime0);
  const SC = 3, OW = 72 * SC, OH = 102 * SC, OX = 36 * SC, OY = 40 * SC, FX_CACHE = {};
  function offscreen(key, draw, post) {
    let cv = FX_CACHE[key]; if (cv) return cv;
    cv = document.createElement("canvas"); cv.width = OW; cv.height = OH; const o = cv.getContext("2d");
    o.translate(OX, OY); o.scale(SC, SC); draw(o); o.setTransform(1, 0, 0, 1, 0, 0);
    post(o, cv); FX_CACHE[key] = cv; const ks = Object.keys(FX_CACHE); if (ks.length > 160) delete FX_CACHE[ks[0]];
    return cv;
  }
  const fxKey = (st, id, c, expr) => st + "|" + id + "|" + (expr || "") + "|" + (c.skin || "") + (c.hair || "") + (c.shirt || "") + (c.style || "") + (c.cap || "") + (c.num || "") + "|" + (c.face || "") + (c.acc || "") + (c.glasses ? "g" : "") + (c.shades ? "s" : "");
  const lum = (r, g2, b) => (0.299 * r + 0.587 * g2 + 0.114 * b) / 255;
  // MANGA: bianco e nero, chine e retini a puntini come una tavola stampata
  function manga(g, id, c, expr) {
    const cv = offscreen(fxKey("manga", id, c, expr), (o) => anime(o, id, Object.assign({}, c, { num: "" }), expr), (o) => {
      const d = o.getImageData(0, 0, OW, OH), p = d.data, A = (x, y) => (x < 0 || y < 0 || x >= OW || y >= OH ? 0 : p[(y * OW + x) * 4 + 3]), out = new Uint8ClampedArray(p.length);
      for (let y = 0; y < OH; y++) for (let x = 0; x < OW; x++) {
        const i = (y * OW + x) * 4; if (p[i + 3] < 100) { if (A(x - 1, y) > 100 || A(x + 1, y) > 100 || A(x, y - 1) > 100 || A(x, y + 1) > 100) { out[i + 3] = 255; } continue; } // contorno a china
        const L = lum(p[i], p[i + 1], p[i + 2]); let v; const xs = (x / 1.5) | 0, ys = (y / 1.5) | 0;
        const j = Math.min(OW - 1, x + 1), k2 = Math.min(OH - 1, y + 1), Lr = lum(p[(y * OW + j) * 4], p[(y * OW + j) * 4 + 1], p[(y * OW + j) * 4 + 2]), Ld = lum(p[(k2 * OW + x) * 4], p[(k2 * OW + x) * 4 + 1], p[(k2 * OW + x) * 4 + 2]);
        if (Math.abs(L - Lr) > 0.16 || Math.abs(L - Ld) > 0.16) { out[i] = out[i + 1] = out[i + 2] = 15; out[i + 3] = 255; continue; } // linee interne a china
        if (L > 0.6) v = 255; // bianco carta (anche la pelle)
        else if (L > 0.45) v = (xs % 4 === 0 && ys % 4 === 0) ? 30 : 255; // retino leggero
        else if (L > 0.3) v = (xs % 3 === 0 && ys % 3 === 0) || ((xs + 1) % 3 === 0 && (ys + 1) % 3 === 0) ? 25 : 255; // retino fitto
        else if (L > 0.17) v = (xs - ys) % 4 === 0 ? 15 : 255; // tratteggio obliquo
        else v = 15; // nero pieno
        out[i] = out[i + 1] = out[i + 2] = v; out[i + 3] = 255;
      }
      d.data.set(out); o.putImageData(d, 0, 0);
    });
    g.drawImage(cv, -OX / SC, -OY / SC, OW / SC, OH / SC);
  }
  // ACQUERELLO: colori lavati e morbidi, bordi che «sbavano», grana della carta
  function acquerello(g, id, c, expr) {
    const cv = offscreen(fxKey("acq", id, c, expr), (o) => { o.filter = "blur(1.6px) saturate(1.25)"; anime(o, id, Object.assign({}, c, { num: "" }), expr); o.filter = "none"; }, (o) => {
      const d = o.getImageData(0, 0, OW, OH), p = d.data, src = new Uint8ClampedArray(p), h = hash(id) % 1000;
      const at = (x, y, k) => src[(Math.min(OH - 1, y) * OW + Math.min(OW - 1, x)) * 4 + k];
      for (let y = 0; y < OH; y++) for (let x = 0; x < OW; x++) {
        const i = (y * OW + x) * 4; if (src[i + 3] < 30) { p[i + 3] = 0; continue; }
        // macchie di colore a bassa frequenza (il pennello non stende mai uniforme) e grana della carta
        const blot = 0.96 + 0.05 * Math.sin(x * 0.06 + h + Math.sin(y * 0.045 + h) * 2.2), grain = 0.98 + 0.03 * Math.sin(x * 1.7 + y * 2.3 + h) * Math.sin(x * 0.9 - y * 1.3);
        // il pigmento si accumula dove il colore cambia (bordi scuri e irregolari)
        const diff = Math.abs(at(x + 1, y, 0) - src[i]) + Math.abs(at(x, y + 1, 1) - src[i + 1]) + Math.abs(at(x + 1, y + 1, 2) - src[i + 2]), pool = diff > 70 ? 0.72 : diff > 35 ? 0.86 : 1;
        for (let k = 0; k < 3; k++) p[i + k] = Math.min(255, (src[i + k] * 0.86 + 255 * 0.14) * blot * grain * pool);
        p[i + 3] = src[i + 3] < 160 ? src[i + 3] * 0.85 : 255;
      }
      o.putImageData(d, 0, 0);
    });
    g.drawImage(cv, -OX / SC, -OY / SC, OW / SC, OH / SC);
  }
  const PX_CACHE = {};
  function pixel(g, id, c, expr) {
    const key = id + "|" + (expr || "") + "|" + (c.skin || "") + (c.hair || "") + (c.shirt || "") + (c.style || "") + (c.cap || "") + (c.num || "") + "|" + (c.face || "") + (c.acc || "") + (c.glasses ? "g" : "") + (c.shades ? "s" : "");
    let cv = PX_CACHE[key];
    if (!cv) {
      const W = 36, H = 50; cv = document.createElement("canvas"); cv.width = W; cv.height = H; const o = cv.getContext("2d");
      o.translate(W / 2, 16); o.scale(0.5, 0.5); anime(o, id, Object.assign({}, c, { num: "" }), expr);
      const d = o.getImageData(0, 0, W, H), p = d.data, q = 22;
      for (let i = 0; i < p.length; i += 4) { if (p[i + 3] < 110) { p[i + 3] = 0; continue; } p[i + 3] = 255; for (let k = 0; k < 3; k++) p[i + k] = Math.round(p[i + k] / q) * q; }
      // contorno scuro attorno alla sagoma
      const out = new Uint8ClampedArray(p); const A = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : p[(y * W + x) * 4 + 3]);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (p[i + 3]) continue; if (A(x - 1, y) || A(x + 1, y) || A(x, y - 1) || A(x, y + 1)) { out[i] = 26; out[i + 1] = 16; out[i + 2] = 24; out[i + 3] = 255; } }
      d.data.set(out); o.setTransform(1, 0, 0, 1, 0, 0); o.putImageData(d, 0, 0);
      PX_CACHE[key] = cv; const ks = Object.keys(PX_CACHE); if (ks.length > 160) delete PX_CACHE[ks[0]];
    }
    const sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false; g.drawImage(cv, -36, -32, 72, 100); g.imageSmoothingEnabled = sm;
  }
  window.__faceStyles = {
    list: [["classic", "Classico"], ["anime", "Anime"], ["pixel", "Pixel 16-bit"], ["manga", "Manga"], ["acquerello", "Acquerello"]],
    draw(style, g, id, c, expr) { if (!c || !c.skin) return false; if (c.cap && typeof c.cap !== "string") c = Object.assign({}, c, { cap: "#1d3fa3" }); g.save(); try { if (style === "anime") anime(g, id, c, expr); else if (style === "manga") manga(g, id, c, expr); else if (style === "acquerello") acquerello(g, id, c, expr); else if (style === "pixel") pixel(g, id, c, expr); else { g.restore(); return false; } } catch (e) { g.restore(); return false; } g.restore(); return true; },
    traits, acc, HBASE, hairOver, // acc(g, c, part, G, ink): i cosmetici negli stili alternativi (anche per gli stili di portrait-styles2 e portrait-dicebear)
  };
})();
