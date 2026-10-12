// js/portrait-dicebear.js - STILI DEI VOLTI CON LA LIBRERIA DICEBEAR (Impostazioni → Grafica → Stile dei volti)
//  - db_avataaars: «Avatar» flat design (disegni di Pablo Stanley): capelli, occhiali, barba, maglia ed espressioni vere.
//  - db_lorelei:   «Lorelei», illustrazione a linea sottile (Lisa Wischofsky, CC0): volti delicati da romanzo visivo.
//  - db_adventurer:«Avventuriero», chibi da JRPG (Lisa Wischofsky, CC BY 4.0).
// La libreria (js/vendor/dicebear.js, ~550 KB) si carica SOLO quando scegli uno di questi stili: chi non li usa non la scarica.
// Ogni volto è un SVG costruito dai colori del personaggio (pelle, capelli, maglia, occhi) e dalla sua acconciatura;
// le espressioni dei dialoghi ([felice], [triste]…) cambiano bocca, occhi e sopracciglia. Gli SVG diventano immagini e
// restano in memoria: il disegno di ogni fotogramma costa come quello di una figurina.
// Licenze: js/vendor/LICENZE-dicebear.txt
(function () {
  "use strict";
  const FS = window.__faceStyles; if (!FS || FS.__db) return;
  const SRC = "js/vendor/dicebear.js?v=1";
  let loading = false;
  function lib() { if (window.__dicebear) return window.__dicebear; if (!loading) { loading = true; const s = document.createElement("script"); s.src = SRC; s.onerror = () => { loading = false; }; document.head.appendChild(s); } return null; }
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const hx = (c, d) => { c = String(c || d || "#888888").replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); return /^[0-9a-f]{6}/i.test(c) ? c.slice(0, 6).toLowerCase() : String(d || "888888").replace("#", ""); };
  const ALIAS = { short: "buzz", corto: "buzz", lungo: "long", flowing: "long", coda: "ponytail", medium: "slick", afro: "curly" };
  const LONG = { long: 1, bob: 1, ponytail: 1, codino: 1, twintails: 1, braids: 1, bun: 1 };
  const isWow = (e) => e === "surprised" || e === "wow";
  // ---------------------------------------------------------------- opzioni per stile
  const TOP = { messy: "shortWaved", spiky: "shortFlat", buzz: "theCaesar", slick: "shortFlat", ordinato: "theCaesarAndSidePart", side: "sides", cresta: "shavedSides", long: "straight01", bob: "bob", bun: "bun", ponytail: "straightAndStrand", codino: "straightAndStrand", twintails: "straight02", braids: "longButNotTooLong", curly: "curly", hood: "winterHat02", bandana: "froBand", elmo: "winterHat1" };
  function avataaars(c, st, e, seed) {
    const o = { seed, skinColor: [hx(c.skin, "edb98a")], hairColor: [hx(c.hair, "2c1b18")], clothesColor: [hx(c.shirt, "3c4f5c")], clothing: ["shirtCrewNeck"], top: [TOP[st] || "shortWaved"], hatColor: [hx(c.cap || c.hair, "262e33")], topProbability: 100,
      facialHair: ["beardMedium"], facialHairColor: [hx(c.hair, "2c1b18")], facialHairProbability: c.beard ? 100 : 0, accessories: [c.shades ? "sunglasses" : "prescription02"], accessoriesProbability: c.shades || c.glasses ? 100 : 0, accessoriesColor: ["262e33"] };
    o.mouth = [e === "grin" ? "twinkle" : e === "smile" ? "smile" : e === "sad" ? "sad" : e === "angry" ? "serious" : isWow(e) ? "screamOpen" : e === "sly" ? "twinkle" : e === "think" ? "concerned" : "default"];
    o.eyes = [e === "grin" ? "happy" : e === "sad" ? "cry" : isWow(e) ? "surprised" : e === "sly" ? "wink" : e === "blink" ? "closed" : e === "think" ? "side" : e === "angry" ? "squint" : "default"];
    o.eyebrows = [e === "angry" ? "angryNatural" : e === "sad" ? "sadConcernedNatural" : isWow(e) || e === "grin" ? "raisedExcitedNatural" : e === "think" ? "frownNatural" : "defaultNatural"];
    return o;
  }
  const pickV = (n, k, pre) => `${pre || "variant"}${String((k % n) + 1).padStart(2, "0")}`;
  function lorelei(c, st, e, seed) {
    const h = hash(seed), o = { seed, skinColor: [hx(c.skin, "f5d7c3")], hairColor: [hx(c.hair, "0e0e0e")], eyebrowsColor: [hx(c.hair, "0e0e0e")], eyesColor: ["000000"], glassesProbability: c.glasses || c.shades ? 100 : 0, glasses: [c.shades ? "variant02" : "variant01"], beardProbability: c.beard ? 100 : 0, earringsProbability: 0, hairAccessoriesProbability: 0, frecklesProbability: h % 6 === 0 ? 100 : 0 };
    o.hair = [LONG[st] ? pickV(24, h, "variant") : pickV(24, h >>> 4, "variant").replace(/\d+$/, (n) => String(+n + 24))];
    if (e === "grin") o.mouth = ["happy09"]; else if (e === "smile") o.mouth = ["happy02"]; else if (e === "sad") o.mouth = ["sad04"]; else if (e === "angry") o.mouth = ["sad08"]; else if (isWow(e)) o.mouth = ["happy13"]; else if (e === "sly") o.mouth = ["happy06"];
    return o;
  }
  function adventurer(c, st, e, seed) {
    const h = hash(seed), o = { seed, skinColor: [hx(c.skin, "f2d3b1")], hairColor: [hx(c.hair, "0e0e0e")], glassesProbability: c.glasses || c.shades ? 100 : 0, earringsProbability: 0, features: ["mustache"], featuresProbability: c.beard ? 100 : 0, hairProbability: 100 };
    o.hair = [LONG[st] ? pickV(26, h, "long") : pickV(19, h >>> 3, "short")];
    if (e === "grin") o.mouth = ["variant23"]; else if (e === "smile") o.mouth = ["variant26"]; else if (e === "sad") o.mouth = ["variant05"]; else if (isWow(e)) o.mouth = ["variant14"];
    return o;
  }
  const STY = { db_avataaars: ["avataaars", avataaars, { x: -46, y: -56, s: 92 }], db_lorelei: ["lorelei", lorelei, { x: -38, y: -40, s: 76 }], db_adventurer: ["adventurer", adventurer, { x: -38, y: -38, s: 76 }] };
  // ---------------------------------------------------------------- immagini in memoria
  const IMG = {}; let N = 0;
  function image(style, id, c, e) {
    const D = lib(); if (!D) return null;
    const key = style + "|" + id + "|" + (e || "") + "|" + [c.skin, c.hair, c.shirt, c.style, c.cap, c.beard, c.glasses, c.shades, c.face].join(",");
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
  const draw0 = FS.draw.bind(FS);
  FS.draw = function (style, g, id, c, expr) {
    if (!STY[style]) return draw0(style, g, id, c, expr);
    if (!c || !c.skin) return false;
    const P = STY[style][2], img = image(style, id, c, expr === "blink" ? (style === "db_avataaars" ? "blink" : null) : expr);
    g.save();
    if (!img) placeholder(g, c);
    else { if (style !== "db_avataaars") { g.fillStyle = c.shirt || "#3f5fbf"; g.beginPath(); g.moveTo(-34, 62); g.quadraticCurveTo(-30, 34, -8, 30); g.lineTo(8, 30); g.quadraticCurveTo(30, 34, 34, 62); g.closePath(); g.fill(); } g.drawImage(img, P.x, P.y, P.s, P.s); }
    if (c.accFn) { try { c.accFn(g, "body"); } catch (e) {} }
    g.restore(); return true;
  };
  FS.__db = true; FS.preload = () => lib();
})();
