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
  function traits(id, c) {
    const h = hash(id), b = (n, k) => (h >>> n) % k;
    return {
      fw: 16.5 + b(0, 4) * 0.8, chin: b(2, 3), eye: b(4, 4), eyeW: 5.8 + b(6, 3) * 0.5, eyeGap: 8.5 + b(8, 3) * 0.6, eyeY: 5 + b(10, 3) * 0.6,
      brow: b(12, 3), browTilt: (b(14, 5) - 2) * 0.06, nose: b(17, 3), mouth: b(19, 4), lash: b(21, 2), freckles: b(22, 7) === 0, mole: b(25, 6) === 0, fringe: b(27, 4), tuft: b(29, 3),
      older: c.tag === "gray" || /#(c|d|e|f)[0-9a-f](c|d|e|f)[0-9a-f](c|d|e|f)/i.test(c.hair || "") && !!c.beard,
    };
  }

  // ---------------------------------------------------------------- stile ANIME
  function anime(g, id, c, expr, real) {
    const T = Object.assign({}, traits(id, c)), skin = c.skin || "#e0b48a", hair = c.hair || "#2b1d14", eyeC = c.eye || "#3a2a1a", shirt = c.shirt || (c.bg && c.bg[1]) || "#3f5fbf";
    if (real) { T.eyeW *= 0.62; T.eyeGap += 0.4; T.eyeY += 0.6; T.chin = T.chin === 1 ? 2 : T.chin; T.lash = 0; }
    const line = dark(skin, 0.62), shade = mix(skin, 0.22, "#a04a5a"), hairD = dark(hair, 0.35), hairL = lite(hair, 0.32), st = c.style || "messy";
    const longHair = st === "long" || st === "codino" || st === "bun" || st === "ponytail";
    g.lineJoin = "round"; g.lineCap = "round";
    // capelli dietro (lunghi)
    if (longHair) {
      g.fillStyle = hairD; g.beginPath(); g.moveTo(-T.fw - 6, -6); g.quadraticCurveTo(-T.fw - 10, 30, -T.fw - 4, st === "long" ? 50 : 30); g.lineTo(T.fw + 4, st === "long" ? 50 : 30); g.quadraticCurveTo(T.fw + 10, 30, T.fw + 6, -6); g.closePath(); g.fill();
    }
    if (st === "bun") { g.fillStyle = hair; g.beginPath(); g.arc(0, -30, 9, 0, 7); g.fill(); g.strokeStyle = hairD; g.lineWidth = 1.2; g.stroke(); }
    if (st === "codino" || st === "ponytail") { g.fillStyle = hair; g.beginPath(); g.ellipse(T.fw + 8, 8, 6, 16, -0.25, 0, 7); g.fill(); g.strokeStyle = hairD; g.lineWidth = 1.2; g.stroke(); }
    // collo e spalle
    g.fillStyle = shade; g.fillRect(-6, 22, 12, 14);
    g.fillStyle = shirt; g.beginPath(); g.moveTo(-36, 62); g.quadraticCurveTo(-32, 36, -10, 32); g.lineTo(10, 32); g.quadraticCurveTo(32, 36, 36, 62); g.closePath(); g.fill();
    g.strokeStyle = dark(shirt, 0.5); g.lineWidth = 1.4; g.stroke();
    g.fillStyle = dark(shirt, 0.25); g.beginPath(); g.moveTo(-10, 32); g.lineTo(0, 42); g.lineTo(10, 32); g.lineTo(6, 32); g.lineTo(0, 38); g.lineTo(-6, 32); g.closePath(); g.fill(); // colletto
    g.fillStyle = lite(shirt, 0.18); g.beginPath(); g.moveTo(-30, 50); g.quadraticCurveTo(-26, 38, -12, 34); g.lineTo(-14, 38); g.quadraticCurveTo(-24, 42, -26, 52); g.closePath(); g.fill();
    if (c.num && g.getTransform().a > 0) { g.fillStyle = lite(shirt, 0.75); g.font = "bold 10px sans-serif"; g.textAlign = "center"; g.fillText(String(c.num).slice(0, 2), 18, 54); g.textAlign = "left"; }
    // orecchie
    g.fillStyle = skin; g.strokeStyle = line; g.lineWidth = 1.1;
    [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * (T.fw + 1), 6, 3.2, 5, 0, 0, 7); g.fill(); g.stroke(); });
    // viso: tempie larghe, mento morbido o a punta
    const fw = T.fw, cy = [27, 29, 25][T.chin];
    g.beginPath(); g.moveTo(-fw, -10); g.quadraticCurveTo(-fw - 1, 10, -fw + 3, 16);
    if (T.chin === 1) { g.quadraticCurveTo(-8, cy - 2, 0, cy); g.quadraticCurveTo(8, cy - 2, fw - 3, 16); }
    else if (T.chin === 2) { g.quadraticCurveTo(-10, cy, 0, cy); g.quadraticCurveTo(10, cy, fw - 3, 16); }
    else { g.quadraticCurveTo(-7, cy + 1, 0, cy); g.quadraticCurveTo(7, cy + 1, fw - 3, 16); }
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
      const ex = sd * T.eyeGap, ey = T.eyeY, ew = T.eyeW * (wide ? 1.12 : 1), eh = [7, 5.4, 6.4, 4.8][T.eye] * (wide ? 1.2 : 1) * (real ? 0.45 : 1);
      if (blink || happy && expr === "grin") { g.strokeStyle = line; g.lineWidth = 1.6; g.beginPath(); g.arc(ex, ey + 1, ew * 0.8, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); return; }
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
    });
    // sopracciglia
    g.strokeStyle = dark(hair, 0.3); g.lineWidth = [1.4, 2.4, 1.8][T.brow];
    [-1, 1].forEach((sd) => {
      const bx = sd * T.eyeGap, by = T.eyeY - 9 - (wide ? 2 : 0), tilt = (angry ? 0.35 : sad ? -0.3 : T.browTilt) * sd;
      g.beginPath(); g.moveTo(bx - sd * 5, by + tilt * 6 + (T.brow === 2 ? 1 : 0)); g.quadraticCurveTo(bx, by - (T.brow === 2 ? 2 : 0.5) - tilt, bx + sd * 5, by - tilt * 6 + 1); g.stroke();
    });
    // naso
    g.strokeStyle = dark(skin, 0.4); g.lineWidth = 1;
    if (T.nose === 0) { g.beginPath(); g.moveTo(1, 12); g.lineTo(-0.5, 15); g.stroke(); }
    else if (T.nose === 1) { g.beginPath(); g.moveTo(1.5, 10); g.quadraticCurveTo(2.5, 14, 0, 15.5); g.stroke(); }
    else { g.fillStyle = dark(skin, 0.18); g.beginPath(); g.moveTo(0, 11); g.lineTo(2.5, 15); g.lineTo(-1, 15.5); g.closePath(); g.fill(); }
    if (real) { g.fillStyle = mix(skin, 0.2, "#7a3a3a"); g.globalAlpha = 0.55; g.beginPath(); g.moveTo(1.5, 6); g.quadraticCurveTo(3.5, 12, 2.5, 15); g.lineTo(0.5, 15); g.closePath(); g.fill(); g.globalAlpha = 1; g.fillStyle = dark(skin, 0.45); [-1.6, 1.6].forEach((nx) => { g.beginPath(); g.ellipse(nx, 15.2, 0.9, 0.5, 0, 0, 7); g.fill(); }); g.fillStyle = "rgba(0,0,0,.06)"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * (fw - 4), 14, 3, 6, 0, 0, 7); g.fill(); }); } // ombra del naso, narici, zigomi
    // bocca
    g.strokeStyle = dark(skin, 0.6); g.lineWidth = 1.3; const my = 20.5;
    if (expr === "grin") { g.fillStyle = "#7a2a3a"; g.beginPath(); g.moveTo(-5, my - 1); g.quadraticCurveTo(0, my + 7, 5, my - 1); g.closePath(); g.fill(); g.fillStyle = "#fff"; g.fillRect(-3.5, my - 0.8, 7, 1.6); }
    else if (expr === "smile" || T.mouth === 1 && !sad && !angry) { g.beginPath(); g.moveTo(-4, my); g.quadraticCurveTo(0, my + 3.5, 4, my); g.stroke(); }
    else if (sad) { g.beginPath(); g.moveTo(-3.5, my + 2); g.quadraticCurveTo(0, my - 1, 3.5, my + 2); g.stroke(); }
    else if (angry) { g.beginPath(); g.moveTo(-4, my + 1); g.lineTo(4, my); g.stroke(); }
    else if (wide) { g.fillStyle = "#7a2a3a"; g.beginPath(); g.ellipse(0, my + 1, 2.2, 3, 0, 0, 7); g.fill(); }
    else if (T.mouth === 2) { g.beginPath(); g.moveTo(-3, my); g.quadraticCurveTo(0, my + 1.2, 3, my - 0.6); g.stroke(); }
    else if (T.mouth === 3) { g.beginPath(); g.moveTo(-2.5, my + 0.5); g.lineTo(2.5, my + 0.5); g.stroke(); g.fillStyle = "rgba(200,80,100,.35)"; g.fillRect(-2, my + 1.4, 4, 1.2); }
    else { g.beginPath(); g.moveTo(-3, my); g.quadraticCurveTo(0, my + 2, 3, my); g.stroke(); }
    if (real && !expr) { g.fillStyle = mix(skin, 0.35, "#b04a4a"); g.globalAlpha = 0.5; g.beginPath(); g.ellipse(0, my + 1.6, 3, 1.1, 0, 0, 7); g.fill(); g.globalAlpha = 1; } // labbro inferiore
    // capelli davanti: calotta + frangia a ciocche
    if (st !== "buzz" || !c.cap) {
      const top = st === "buzz" ? -19 : st === "cresta" ? -20 : -24;
      g.fillStyle = hair; g.strokeStyle = hairD; g.lineWidth = 1.3;
      g.beginPath(); g.moveTo(-fw - 2.5, 4); g.quadraticCurveTo(-fw - 3, top + 4, -6, top); g.quadraticCurveTo(0, top - 2, 6, top); g.quadraticCurveTo(fw + 3, top + 4, fw + 2.5, 4);
      // ciocche della frangia (verso sinistra, destra o divise)
      const n = st === "buzz" ? 0 : st === "slick" ? 2 : 5, dir = [1, -1, 0, 1][T.fringe];
      if (n) { for (let i = n; i >= 0; i--) { const x0 = -fw + (2 * fw) * (i / n), tipY = st === "slick" ? -10 : (i % 2 ? -2 : 1) + (st === "spiky" ? -4 : 0), tipX = x0 - dir * 3; g.lineTo(x0 + (2 * fw) / n * 0.5, -12); g.lineTo(tipX, tipY); } }
      else g.lineTo(-fw - 2.5, -4);
      g.closePath(); g.fill(); g.stroke();
      if (st === "spiky") { for (let i = 0; i < 5; i++) { const a = Math.PI * (1.1 + i * 0.2); g.beginPath(); g.moveTo(Math.cos(a) * 14, top + 8 + Math.sin(a) * 6); g.lineTo(Math.cos(a) * 24, top + 2 + Math.sin(a) * 14); g.lineTo(Math.cos(a + 0.25) * 14, top + 8 + Math.sin(a + 0.25) * 6); g.closePath(); g.fill(); g.stroke(); } }
      if (st === "cresta") { g.beginPath(); g.moveTo(-4, top + 2); g.lineTo(0, top - 12); g.lineTo(4, top + 2); g.closePath(); g.fill(); g.stroke(); }
      if (st === "messy") { for (let i = 0; i < T.tuft + 1; i++) { g.beginPath(); g.moveTo(-4 + i * 5, top + 1); g.quadraticCurveTo(-2 + i * 5, top - 7, 2 + i * 5, top - 5); g.quadraticCurveTo(0 + i * 5, top - 1, 1 + i * 5, top + 2); g.fill(); } }
      if (longHair) { g.beginPath(); g.moveTo(-fw - 2.5, 0); g.quadraticCurveTo(-fw - 5, 18, -fw - 1, 30); g.lineTo(-fw + 3, 14); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(fw + 2.5, 0); g.quadraticCurveTo(fw + 5, 18, fw + 1, 30); g.lineTo(fw - 3, 14); g.closePath(); g.fill(); g.stroke(); }
      // riflesso a fascia
      g.strokeStyle = hairL; g.lineWidth = 2; g.globalAlpha = 0.75; g.beginPath(); g.arc(-2, top + 18, 15, Math.PI * 1.15, Math.PI * 1.55); g.stroke(); g.globalAlpha = 1;
    }
    if (c.older) { g.strokeStyle = dark(skin, 0.3); g.lineWidth = 0.8; [-1, 1].forEach((sd) => { g.beginPath(); g.moveTo(sd * (T.eyeGap + T.eyeW + 1), T.eyeY); g.lineTo(sd * (T.eyeGap + T.eyeW + 3), T.eyeY + 2); g.stroke(); }); }
    // accessori
    if (c.glasses) { g.strokeStyle = "#1a1a22"; g.lineWidth = 1.4; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * T.eyeGap, T.eyeY, T.eyeW + 2.4, 6.4, 0, 0, 7); g.stroke(); }); g.beginPath(); g.moveTo(-T.eyeGap + T.eyeW + 2, T.eyeY); g.lineTo(T.eyeGap - T.eyeW - 2, T.eyeY); g.stroke(); g.fillStyle = "rgba(255,255,255,.25)"; [-1, 1].forEach((sd) => g.fillRect(sd * T.eyeGap - 3, T.eyeY - 4, 2, 3)); }
    if (c.shades) { g.fillStyle = "#111"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * T.eyeGap, T.eyeY, T.eyeW + 2.5, 5, 0, 0, 7); g.fill(); }); g.fillRect(-T.eyeGap, T.eyeY - 1, T.eyeGap * 2, 1.6); }
    if (c.cap) { g.fillStyle = c.cap; g.strokeStyle = dark(c.cap, 0.5); g.lineWidth = 1.3; g.beginPath(); g.moveTo(-fw - 3, -6); g.quadraticCurveTo(-fw, -28, 0, -29); g.quadraticCurveTo(fw, -28, fw + 3, -6); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.ellipse(-6, -6, fw + 4, 3.5, -0.08, 0, 7); g.fill(); g.stroke(); g.fillStyle = lite(c.cap, 0.3); g.fillRect(-2, -26, 4, 3); }
  }


  // ---------------------------------------------------------------- stile FUMETTO «linea chiara» (contorni neri netti, colori pieni, facce da caratterista)
  function comic(g, id, c, expr) {
    const T = traits(id, c), h = hash(id + "*"), b = (n, k) => (h >>> n) % k;
    const skin = c.skin || "#e0b48a", hair = c.hair || "#2b1d14", shirt = c.shirt || (c.bg && c.bg[1]) || "#3f5fbf", K = "#14100e", st = c.style || "messy";
    const fw = 15 + b(0, 5), fh = 21 + b(3, 5), jaw = b(6, 3), noseT = b(8, 4), eyeT = b(10, 3), ears = 3 + b(12, 2);
    g.lineJoin = "round"; g.lineCap = "round"; g.strokeStyle = K; g.lineWidth = 1.6;
    const fill = (f) => { g.fillStyle = f; g.fill(); g.stroke(); };
    // capelli lunghi dietro
    if (st === "long" || st === "codino" || st === "bun") { g.beginPath(); g.moveTo(-fw - 4, -4); g.lineTo(-fw - 5, st === "long" ? 46 : 26); g.lineTo(fw + 5, st === "long" ? 46 : 26); g.lineTo(fw + 4, -4); g.closePath(); fill(hair); }
    if (st === "bun") { g.beginPath(); g.arc(0, -fh - 6, 8, 0, 7); fill(hair); }
    // spalle e colletto
    g.beginPath(); g.moveTo(-36, 62); g.quadraticCurveTo(-34, 36, -9, 31); g.lineTo(9, 31); g.quadraticCurveTo(34, 36, 36, 62); g.closePath(); fill(shirt);
    g.beginPath(); g.moveTo(-9, 31); g.lineTo(0, 40); g.lineTo(9, 31); g.stroke();
    g.beginPath(); g.rect(-5, 20, 10, 12); fill(skin);
    // orecchie e testa
    [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * (fw + 1), 5, ears, 5, 0, 0, 7); fill(skin); });
    g.beginPath();
    if (jaw === 0) g.ellipse(0, 3, fw, fh, 0, 0, 7); // tondo
    else if (jaw === 1) { g.moveTo(-fw, -12); g.quadraticCurveTo(-fw, 22, 0, fh + 4); g.quadraticCurveTo(fw, 22, fw, -12); g.quadraticCurveTo(0, -fh - 4, -fw, -12); } // a uovo
    else { g.moveTo(-fw, -12); g.lineTo(-fw, 14); g.quadraticCurveTo(-fw + 2, fh + 3, 0, fh + 3); g.quadraticCurveTo(fw - 2, fh + 3, fw, 14); g.lineTo(fw, -12); g.quadraticCurveTo(0, -fh - 4, -fw, -12); } // squadrato
    fill(skin);
    if (c.beard) { g.beginPath(); g.moveTo(-fw + 1, 8); g.quadraticCurveTo(-fw + 2, fh + 4, 0, fh + 6); g.quadraticCurveTo(fw - 2, fh + 4, fw - 1, 8); g.quadraticCurveTo(0, 17, -fw + 1, 8); fill(hair); }
    // occhi: puntini, ovali o mezzelune
    const ey = 3 + b(14, 3), eg = 6 + b(16, 3), angry = expr === "angry", sad = expr === "sad", happy = expr === "smile" || expr === "grin";
    [-1, 1].forEach((sd) => {
      const x = sd * eg;
      if (happy || expr === "blink") { g.beginPath(); g.arc(x, ey + 1, 2.4, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); return; }
      if (eyeT === 0) { g.fillStyle = K; g.beginPath(); g.arc(x, ey, 1.7, 0, 7); g.fill(); }
      else if (eyeT === 1) { g.beginPath(); g.ellipse(x, ey, 2.6, 3.6, 0, 0, 7); fill("#fff"); g.fillStyle = K; g.beginPath(); g.arc(x + sd * 0.5, ey + 0.6, 1.4, 0, 7); g.fill(); }
      else { g.fillStyle = K; g.beginPath(); g.ellipse(x, ey, 1.6, 2.6, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(x - 3, ey - 3); g.lineTo(x + 3, ey - 3.4); g.stroke(); }
    });
    // sopracciglia espressive
    g.lineWidth = 2.2; [-1, 1].forEach((sd) => { const x = sd * eg, y = ey - 6 - (expr === "surprised" ? 2 : 0), t = angry ? 2 : sad ? -2 : (b(18, 3) - 1); g.beginPath(); g.moveTo(x - sd * 3.5, y + t * sd * (sd > 0 ? 1 : -1)); g.lineTo(x + sd * 3.5, y - t); g.stroke(); }); g.lineWidth = 1.6;
    // naso: a patata, a punta, all'insù, aquilino
    g.beginPath();
    if (noseT === 0) g.ellipse(1, 11, 3.6, 3, 0, 0, 7);
    else if (noseT === 1) { g.moveTo(0, 5); g.lineTo(5, 13); g.lineTo(0, 14); }
    else if (noseT === 2) { g.moveTo(0, 7); g.quadraticCurveTo(4, 12, 1, 13); g.quadraticCurveTo(-1, 13.5, -1.5, 12); }
    else { g.moveTo(-1, 4); g.quadraticCurveTo(6, 7, 4, 14); g.lineTo(0, 14); }
    if (noseT === 0) fill(mix(skin, 0.15, "#d06a6a")); else { g.fillStyle = skin; g.fill(); g.stroke(); }
    // bocca
    const my = 18 + b(20, 3);
    g.beginPath();
    if (expr === "grin") { g.moveTo(-6, my); g.quadraticCurveTo(0, my + 7, 6, my); g.closePath(); fill("#7a2a2a"); }
    else if (happy) { g.moveTo(-5, my); g.quadraticCurveTo(0, my + 4, 5, my); g.stroke(); }
    else if (sad) { g.moveTo(-4, my + 2); g.quadraticCurveTo(0, my - 1, 4, my + 2); g.stroke(); }
    else if (expr === "surprised") { g.ellipse(0, my + 1, 2, 2.6, 0, 0, 7); fill("#7a2a2a"); }
    else { const k = b(22, 3); g.moveTo(-4, my); if (k === 0) g.lineTo(4, my); else if (k === 1) g.quadraticCurveTo(0, my + 2, 4, my - 1); else g.quadraticCurveTo(1, my - 1.5, 4, my + 0.5); g.stroke(); }
    if (T.freckles) { g.fillStyle = mix(skin, 0.4, "#8a4a2a"); [[-8, 11], [-10, 13], [8, 11], [10, 13]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 0.7, 0, 7); g.fill(); }); }
    // capelli: una massa piena con un ciuffo che caratterizza
    if (!c.cap) {
      g.beginPath(); const top = -fh - (st === "buzz" ? 1 : 4);
      if (st === "buzz") { g.moveTo(-fw, -6); g.quadraticCurveTo(-fw, top, 0, top); g.quadraticCurveTo(fw, top, fw, -6); g.quadraticCurveTo(0, -12, -fw, -6); }
      else if (st === "spiky") { g.moveTo(-fw - 2, 0); for (let i = 0; i <= 6; i++) { const a = Math.PI * (1 + i / 6), r = i % 2 ? fh + 10 : fh + 1; g.lineTo(Math.cos(a) * (fw + 3) * (r / (fh + 4)), -2 + Math.sin(a) * r); } g.lineTo(fw + 2, 0); g.quadraticCurveTo(0, -10, -fw - 2, 0); }
      else if (st === "cresta") { g.moveTo(-5, -fh + 2); g.lineTo(0, top - 12); g.lineTo(5, -fh + 2); g.closePath(); }
      else { g.moveTo(-fw - 2, 2); g.quadraticCurveTo(-fw - 3, top, 0, top - 2); g.quadraticCurveTo(fw + 3, top, fw + 2, 2); if (st === "slick") g.quadraticCurveTo(fw - 4, -12, -fw + 4, -10); else { g.lineTo(fw - 2, -8); g.quadraticCurveTo(fw * 0.3, -6 - b(24, 5), -2, -10); g.quadraticCurveTo(-fw * 0.5, -6, -fw + 1, -6); } g.closePath(); }
      fill(hair);
      if (st === "messy" || st === "codino") { g.beginPath(); g.moveTo(-2, top - 1); g.quadraticCurveTo(4, top - 9, 9, top - 4); g.quadraticCurveTo(4, top - 4, 2, top); fill(hair); } // il ciuffo
    }
    if (c.glasses) { g.lineWidth = 1.4; [-1, 1].forEach((sd) => { g.beginPath(); g.arc(sd * eg, ey, 4.4, 0, 7); g.stroke(); }); g.beginPath(); g.moveTo(-eg + 4.4, ey); g.lineTo(eg - 4.4, ey); g.stroke(); }
    if (c.shades) { g.fillStyle = K; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * eg, ey, 5, 3.6, 0, 0, 7); g.fill(); }); }
    if (c.cap) { g.beginPath(); g.moveTo(-fw - 2, -6); g.quadraticCurveTo(-fw, -fh - 8, 0, -fh - 8); g.quadraticCurveTo(fw, -fh - 8, fw + 2, -6); g.closePath(); fill(c.cap); g.beginPath(); g.ellipse(-7, -6, fw + 4, 3.4, -0.06, 0, 7); fill(c.cap); }
  }
  // ---------------------------------------------------------------- stile PIXEL 16-bit (dal volto anime, a bassa risoluzione)

  // ---------------------------------------------------------------- stili «dipinti» (dal volto anime, rielaborato su una tela a parte e messo in cache)
  // la tela copre il riquadro locale x -36..36, y -40..62 (quello del ritratto) a doppia risoluzione
  const SC = 3, OW = 72 * SC, OH = 102 * SC, OX = 36 * SC, OY = 40 * SC, FX_CACHE = {};
  function offscreen(key, draw, post) {
    let cv = FX_CACHE[key]; if (cv) return cv;
    cv = document.createElement("canvas"); cv.width = OW; cv.height = OH; const o = cv.getContext("2d");
    o.translate(OX, OY); o.scale(SC, SC); draw(o); o.setTransform(1, 0, 0, 1, 0, 0);
    post(o, cv); FX_CACHE[key] = cv; const ks = Object.keys(FX_CACHE); if (ks.length > 160) delete FX_CACHE[ks[0]];
    return cv;
  }
  const fxKey = (st, id, c, expr) => st + "|" + id + "|" + (expr || "") + "|" + (c.skin || "") + (c.hair || "") + (c.shirt || "") + (c.style || "") + (c.cap || "") + (c.num || "");
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
    const key = id + "|" + (expr || "") + "|" + (c.skin || "") + (c.hair || "") + (c.shirt || "") + (c.style || "") + (c.cap || "") + (c.num || "");
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
    list: [["classic", "Classico"], ["anime", "Anime"], ["pixel", "Pixel 16-bit"], ["comic", "Fumetto"], ["manga", "Manga"], ["acquerello", "Acquerello"], ["illustrato", "Illustrato"]],
    draw(style, g, id, c, expr) { if (!c || !c.skin) return false; g.save(); try { if (style === "anime") anime(g, id, c, expr); else if (style === "illustrato") anime(g, id, c, expr, true); else if (style === "comic") comic(g, id, c, expr); else if (style === "manga") manga(g, id, c, expr); else if (style === "acquerello") acquerello(g, id, c, expr); else if (style === "pixel") pixel(g, id, c, expr); else { g.restore(); return false; } } catch (e) { g.restore(); return false; } g.restore(); return true; },
    traits,
  };
})();
