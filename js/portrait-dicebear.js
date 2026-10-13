// js/portrait-dicebear.js - STILI DEI VOLTI CON LA LIBRERIA DICEBEAR (Impostazioni → Grafica → Stile dei volti)
//  - db_toonhead:  «Toon Head», cartone a testa grande (Johan Melin, CC BY 4.0): acconciatura, barba, colori ed espressioni vere.
// La libreria (js/vendor/dicebear.js) si carica SOLO quando scegli uno di questi stili: chi non li usa non la scarica.
// Ogni volto è un SVG costruito dai colori del personaggio (pelle, capelli, maglia) e dalla sua acconciatura; le espressioni
// dei dialoghi ([felice], [triste]…) cambiano bocca, occhi e sopracciglia. Gli SVG diventano immagini e restano in memoria.
// I COSMETICI si applicano come negli altri stili (corone, maschere, elmi, mantelli, sciarpe, fasce, occhiali, cappellino):
// per Toon Head la testa è più grande, e i cosmetici della testa si allargano per starci sopra.
// Licenze: js/vendor/LICENZE-dicebear.txt
(function () {
  "use strict";
  const FS = window.__faceStyles; if (!FS || FS.__db) return;
  const SRC = "js/vendor/dicebear.js?v=4";
  let loading = false;
  function lib() { if (window.__dicebear) return window.__dicebear; if (!loading) { loading = true; const s = document.createElement("script"); s.src = SRC; s.onerror = () => { loading = false; }; document.head.appendChild(s); } return null; }
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const hx = (c, d) => { c = String(c || d || "#888888").replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); return /^[0-9a-f]{6}/i.test(c) ? c.slice(0, 6).toLowerCase() : String(d || "888888").replace("#", ""); };
  const ALIAS = { short: "buzz", corto: "buzz", lungo: "long", flowing: "long", coda: "ponytail", medium: "slick", afro: "curly" };
  const LONG = { long: 1, bob: 1, ponytail: 1, codino: 1, twintails: 1, braids: 1, bun: 1, wavy: 1, dread: 1, sidebraid: 1, mullet: 1, messybun: 1, spacebuns: 1, corona: 1 };
  const isWow = (e) => e === "surprised" || e === "wow";
  const pickV = (n, k, pre) => `${pre || "variant"}${String((k % n) + 1).padStart(2, "0")}`;
  // ---------------------------------------------------------------- opzioni per stile
  // Toon Head: quattro tagli davanti (riga di lato, undercut, a punte, chignon) e quattro lunghezze dietro
  const TH_FRONT = { scodella: "sideComed", cometa: "spiky", corona: "bun", ciuffo: "sideComed", messy: "spiky", spiky: "spiky", cresta: "spiky", curly: "spiky", hood: "spiky", bandana: "spiky", elmo: "undercut", buzz: "undercut", slick: "sideComed", ordinato: "sideComed", side: "sideComed", long: "sideComed", bob: "sideComed", twintails: "sideComed", braids: "sideComed", bun: "bun", ponytail: "bun", codino: "bun", afro: "spiky", dread: "spiky", undercut: "undercut", pompadour: "sideComed", mullet: "spiky", wavy: "sideComed", messybun: "bun", topknot: "bun", sidebraid: "sideComed", spacebuns: "bun" };
  const TH_BACK = { long: "longStraight", bob: "shoulderHigh", twintails: "neckHigh", braids: "longWavy", ponytail: "neckHigh", dread: "longWavy", mullet: "neckHigh", wavy: "longWavy", sidebraid: "shoulderHigh" };
  function toonhead(c, st, e, seed) {
    const h = hash(seed), o = { seed, skinColor: [hx(c.skin, "e0b48a")], hairColor: [hx(c.hair, "2b1d14")], clothesColor: [hx(c.shirt, "3f5fbf")], clothes: [["tShirt", "shirt", "turtleNeck", "openJacket"][h % 4]],
      hair: [TH_FRONT[st] || "spiky"], hairProbability: st === "bald" ? 0 : 100, rearHair: [TH_BACK[st] || "neckHigh"], rearHairProbability: TH_BACK[st] ? 100 : 0,
      beard: [["fullBeard", "chinMoustache", "chin", "longBeard"][h % 4]], beardProbability: c.beard ? 100 : 0 };
    o.mouth = [e === "grin" ? "laugh" : e === "angry" ? "angry" : isWow(e) ? "agape" : e === "sad" ? "sad" : "smile"];
    o.eyes = [e === "grin" || e === "blink" ? "bow" : isWow(e) ? "wide" : e === "sad" || e === "think" ? "humble" : e === "sly" ? "wink" : "happy"]; // «happy» sono gli occhi aperti, «bow» quelli chiusi a mezzaluna
    o.eyebrows = [e === "angry" ? "angry" : e === "sad" ? "sad" : isWow(e) ? "raised" : e === "grin" || e === "smile" ? "happy" : "neutral"];
    return o;
  }
  // { x, y, s }: dove sta l'immagine nel riquadro del ritratto · G: la geometria della testa per i cosmetici · H: come allargare i cosmetici della testa
  const STY = {
    db_toonhead: ["toonHead", toonhead, { x: -53, y: -53, s: 106 }, { fw: 20, top: -34, ey: 2.6, eg: 11 }, { sx: 1.08, sy: 1.38 }],
  };
  // ---------------------------------------------------------------- immagini in memoria
  const IMG = {}; let N = 0;
  function image(style, id, c, e) {
    const D = lib(); if (!D) return null;
    const key = style + "|" + id + "|" + (e || "") + "|" + [c.skin, c.hair, c.shirt, c.style, c.beard, c.face, c.glasses, c.shades].join(",");
    const hit = IMG[key]; if (hit) return hit.ok ? hit.img : null;
    if (++N > 600) { Object.keys(IMG).slice(0, 200).forEach((k) => delete IMG[k]); N = 400; }
    const [name, opts] = STY[style], st = ALIAS[c.style] || c.style || "messy";
    try {
      const svg = D.createAvatar(D.styles[name], opts(c, st, e, id + (c.face ? "|" + c.face : ""))).toString();
      const img = new Image(), rec = { img, ok: false }; IMG[key] = rec; img.onload = () => { rec.ok = true; }; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    } catch (err) { IMG[key] = { ok: false }; }
    return null;
  }
  function placeholder(g, c) { // mentre la libreria si carica: una sagoma morbida nei colori del personaggio
    g.fillStyle = c.shirt || "#3f5fbf"; g.beginPath(); g.moveTo(-34, 60); g.quadraticCurveTo(0, 24, 34, 60); g.fill();
    g.fillStyle = c.skin || "#e0b48a"; g.beginPath(); g.ellipse(0, 4, 18, 22, 0, 0, 7); g.fill(); g.fillStyle = c.hair || "#2b1d14"; g.beginPath(); g.ellipse(0, -10, 20, 14, 0, Math.PI, 0); g.fill();
  }
  // occhiali, occhiali da sole e cappellino (Toon Head non li ha): disegnati sopra, sulla geometria della testa
  function extras(g, c, G, style) {
    const ink = "#1a1a22";
    if (style === "db_toonhead" && (c.glasses || c.shades)) {
      g.strokeStyle = ink; g.lineWidth = 1.6;
      [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * G.eg, G.ey, 6.4, 5.2, 0, 0, 7); g.fillStyle = c.shades ? "#14161e" : "rgba(200,230,255,.18)"; g.fill(); g.stroke(); if (c.shades) { g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.ellipse(sd * G.eg - 2, G.ey - 2, 2.2, 1, -0.3, 0, 7); g.fill(); } });
      g.beginPath(); g.moveTo(-G.eg + 6.4, G.ey - 1); g.quadraticCurveTo(0, G.ey - 3, G.eg - 6.4, G.ey - 1); g.stroke();
    }
    if (c.cap) { const fw = G.fw + 2, t = G.top; g.fillStyle = c.cap; g.beginPath(); g.moveTo(-fw, t + 18); g.bezierCurveTo(-fw, t - 4, fw, t - 4, fw, t + 18); g.closePath(); g.fill(); g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1; g.stroke(); g.beginPath(); g.ellipse(-7, t + 18, fw + 6, 3.6, -0.06, 0, 7); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,.3)"; g.beginPath(); g.ellipse(-4, t + 6, 6, 2.4, -0.3, 0, 7); g.fill(); }
  }
  function cosmetics(g, c, part, G, H) { // i cosmetici come negli altri stili (FS.acc), allargati sulla testa grande di Toon Head
    if (!FS.acc || !c.acc || typeof c.acc !== "string") return; // c.acc arriva da game.js già risolto (una stringa); un elenco grezzo non è un cosmetico
    try {
      if (part === "head" && H) { g.save(); g.translate(0, 4); g.scale(H.sx, H.sy); g.translate(0, -4); FS.acc(g, c, part, { fw: G.fw / H.sx, top: -24, ey: 3, eg: 9 }, "#1a1a22"); g.restore(); }
      else FS.acc(g, c, part, G, "#1a1a22");
    } catch (e) {}
  }
  const draw0 = FS.draw.bind(FS);
  FS.draw = function (style, g, id, c, expr) {
    if (!STY[style]) return draw0(style, g, id, c, expr);
    if (!c || !c.skin) return false;
    if (c.cap && typeof c.cap !== "string") c = Object.assign({}, c, { cap: "#1d3fa3" });
    const [, , P, G, H] = STY[style], img = image(style, id, c, expr === "blink" ? (style === "db_toonhead" ? "blink" : null) : expr);
    g.save();
    cosmetics(g, c, "back", G, H);
    if (!img) placeholder(g, c);
    else { g.drawImage(img, P.x, P.y, P.s, P.s); }
    cosmetics(g, c, "body", G, H); extras(g, c, G, style); cosmetics(g, c, "head", G, H);
    if (expr === "think") { g.fillStyle = "rgba(255,255,255,.92)"; [[24, -24, 2], [29, -32, 3], [36, -42, 5]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }); }
    g.restore(); return true;
  };
  FS.__db = true; FS.preload = () => lib();
})();
