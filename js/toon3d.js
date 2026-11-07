// js/toon3d.js - CEL SHADING per tutte le modalità 3D (2026-11-07). Opzione «Grafica 3D: Cel shading» in Impostazioni, spenta di partenza.
// Si aggancia a THREE.Scene.onBeforeRender: nessuna modifica ai file delle modalità (Calcio a 11 3D, Gabbia 3D, Città 3D, Stadio, Panda, Gacha).
//  - materiali Standard/Lambert/Phong/Physical → MeshToonMaterial con rampa a 3 bande (luce, ombra, ombra scura), colori un po' più vivi
//  - contorno nero «guscio inverso» (spessore costante in pixel) solo sugli oggetti piccoli: giocatori, pallone, porte, oggetti. Niente su prato/spalti/cielo.
//  - se il telefono va lento (meno di ~25 fps) i contorni si spengono da soli; i materiali a bande restano.
// I colori cambiati dal codice sul materiale originale (es. maglia evidenziata) vengono ricopiati sul materiale toon ogni pochi frame.
(function () {
  "use strict";
  const T = window.THREE; if (!T || !T.WebGLRenderer || window.__toon3d) return;
  const SETK = "ali-di-rondine.impostazioni";
  let onCache = false, onAt = -1e9;
  function isOn() { const n = performance.now(); if (n - onAt > 1000) { onAt = n; try { onCache = !!(JSON.parse(localStorage.getItem(SETK) || "{}").cel3d); } catch (e) { onCache = false; } } return onCache; }
  let ramp = null;
  function gradient() {
    if (ramp) return ramp;
    ramp = new T.DataTexture(new Uint8Array([70, 150, 255]), 3, 1, T.RedFormat);
    ramp.minFilter = ramp.magFilter = T.NearestFilter; ramp.generateMipmaps = false; ramp.needsUpdate = true; return ramp;
  }
  const LIT = { MeshStandardMaterial: 1, MeshPhysicalMaterial: 1, MeshLambertMaterial: 1, MeshPhongMaterial: 1 };
  const pairs = new Map(); // originale → toon
  function toonOf(m) {
    if (!m || !LIT[m.type]) return m;
    let t = pairs.get(m); if (t) return t;
    t = new T.MeshToonMaterial({ gradientMap: gradient() });
    ["map", "emissiveMap", "alphaMap", "aoMap", "lightMap", "transparent", "opacity", "side", "vertexColors", "alphaTest", "depthWrite", "depthTest", "fog", "visible", "wireframe", "flatShading", "polygonOffset", "polygonOffsetFactor", "polygonOffsetUnits", "blending"].forEach((k) => { if (m[k] !== undefined) { try { t[k] = m[k]; } catch (e) {} } });
    t.userData.__toonSrc = m; t.userData.__toon = 1; sync(m, t); pairs.set(m, t);
    if (pairs.size > 3000) { const k = pairs.keys().next().value; pairs.delete(k); }
    return t;
  }
  const hsl = { h: 0, s: 0, l: 0 };
  function sync(m, t) {
    const sig = (m.color ? m.color.getHex() : 0) + "|" + (m.emissive ? m.emissive.getHex() : 0) + "|" + m.emissiveIntensity + "|" + m.opacity + "|" + m.visible + "|" + (m.map ? m.map.uuid : "");
    if (t.userData.__sig === sig) return; t.userData.__sig = sig; // solo se il codice ha cambiato l'originale: le modifiche fatte direttamente sul toon restano
    if (m.color) { t.color.copy(m.color); t.color.getHSL(hsl); if (hsl.s > 0.08) t.color.setHSL(hsl.h, Math.min(1, hsl.s * 1.15), hsl.l); }
    if (m.emissive) { t.emissive.copy(m.emissive); t.emissiveIntensity = m.emissiveIntensity; }
    t.opacity = m.opacity; t.visible = m.visible; if (t.map !== m.map) { t.map = m.map; t.needsUpdate = true; }
  }
  // contorno: un solo materiale per tutti, normali «lisciate» per non aprire buchi sugli spigoli dei cubi
  const res = new T.Vector2(1, 1), thick = { value: 3 };
  // spessore in pixel, ma mai più del 12% della grandezza dell'oggetto sullo schermo: i giocatori lontani non diventano macchie nere
  const VS = "attribute vec3 onorm; uniform vec2 res; uniform float thick; uniform float rad; void main(){ vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.0); vec3 n = normalize(normalMatrix * onorm); vec2 d = (projectionMatrix * vec4(n, 0.0)).xy; float L = length(d); float rpx = rad * abs(projectionMatrix[1][1]) / max(c.w, 1e-3) * res.y * 0.5; float t = min(thick, rpx * 0.12); if (L > 1e-5 && t > 0.4) c.xy += d / L * t * c.w * 2.0 / res; gl_Position = c; }";
  const outlineCol = new T.Color(0x14101c), olMats = new Map(), olState = { visible: true };
  function outlineMatFor(rad) {
    const k = Math.round(rad * 50) / 50 || 0.02; let m = olMats.get(k); if (m) return m;
    m = new T.ShaderMaterial({ uniforms: { res: { value: res }, thick, rad: { value: k }, col: { value: outlineCol } }, vertexShader: VS, fragmentShader: "uniform vec3 col; void main(){ gl_FragColor = vec4(col, 1.0); }", side: T.BackSide });
    m.visible = olState.visible; olMats.set(k, m); return m;
  }
  function setOutlines(v) { if (olState.visible === v) return; olState.visible = v; olMats.forEach((m) => { m.visible = v; }); }
  const outGeo = new WeakMap();
  function outlineGeo(geo) {
    let o = outGeo.get(geo); if (o) return o;
    const pos = geo.attributes.position; if (!pos) return null;
    if (!geo.attributes.normal) geo.computeVertexNormals();
    const nrm = geo.attributes.normal, acc = new Map(), n = pos.count, on = new Float32Array(n * 3), key = (i) => Math.round(pos.getX(i) * 1000) + "," + Math.round(pos.getY(i) * 1000) + "," + Math.round(pos.getZ(i) * 1000);
    for (let i = 0; i < n; i++) { const k = key(i); let a = acc.get(k); if (!a) { a = [0, 0, 0]; acc.set(k, a); } a[0] += nrm.getX(i); a[1] += nrm.getY(i); a[2] += nrm.getZ(i); }
    for (let i = 0; i < n; i++) { const a = acc.get(key(i)), l = Math.hypot(a[0], a[1], a[2]) || 1; on[i * 3] = a[0] / l; on[i * 3 + 1] = a[1] / l; on[i * 3 + 2] = a[2] / l; }
    o = new T.BufferGeometry(); o.setAttribute("position", pos); o.setAttribute("onorm", new T.BufferAttribute(on, 3)); if (geo.index) o.setIndex(geo.index);
    o.boundingSphere = geo.boundingSphere; outGeo.set(geo, o); return o;
  }
  const v3 = new T.Vector3();
  function wantsOutline(mesh, orig) {
    if (!mesh.isMesh || mesh.isInstancedMesh || mesh.isSkinnedMesh || mesh.userData.__noOutline) return false;
    const m = Array.isArray(orig) ? orig[0] : orig; if (!m || !LIT[m.type] || (m.transparent && m.opacity < 0.95) || m.depthWrite === false) return false;
    const geo = mesh.geometry; if (!geo || !geo.attributes || !geo.attributes.position || geo.attributes.position.count > 6000) return false;
    if (/Plane|Circle|Ring/.test(geo.type)) return false;
    if (!geo.boundingSphere) geo.computeBoundingSphere(); mesh.getWorldScale(v3);
    const r = geo.boundingSphere.radius * Math.max(v3.x, v3.y, v3.z); return r < 4.5 ? r : false; // solo oggetti piccoli
  }
  function convert(scene) {
    const list = []; scene.traverse((o) => { if (o.isMesh && !o.userData.__isOutline) list.push(o); });
    list.forEach((mesh) => {
      const cur = mesh.material;
      if (Array.isArray(cur)) { if (cur.some((m) => m && LIT[m.type])) mesh.material = cur.map(toonOf); }
      else if (cur && LIT[cur.type]) { mesh.material = toonOf(cur); }
      if (!mesh.userData.__olDone) {
        mesh.userData.__olDone = 1; const src = Array.isArray(mesh.material) ? mesh.material.map((m) => (m && m.userData.__toonSrc) || m) : (mesh.material && mesh.material.userData.__toonSrc) || mesh.material;
        const rad = wantsOutline(mesh, src); if (rad) { const g = outlineGeo(mesh.geometry); if (g) { const ol = new T.Mesh(g, outlineMatFor(rad)); ol.userData.__isOutline = 1; ol.name = "__outline"; ol.raycast = () => {}; ol.castShadow = ol.receiveShadow = false; ol.renderOrder = mesh.renderOrder; ol.frustumCulled = mesh.frustumCulled; mesh.add(ol); ol.updateMatrixWorld(true); } }
      }
    });
    pairs.forEach((t, m) => sync(m, t));
  }
  // velocità: se i frame durano troppo, contorni spenti (si riaccendono se il gioco torna fluido)
  let last = 0, avg = 16, cnt = 0;
  // three.js definisce render() dentro il costruttore (non sul prototipo): ci agganciamo a Scene.onBeforeRender, che render() chiama a ogni frame
  const SP = T.Scene.prototype, obr0 = SP.onBeforeRender;
  SP.onBeforeRender = function (renderer, scene, cam, rt) {
    if (scene && scene.isScene && !rt && isOn()) {
      try {
        const n = performance.now(); if (last) { const dt = Math.min(200, n - last); avg = avg * 0.95 + dt * 0.05; } last = n;
        if (++cnt % 90 === 0) setOutlines(!(avg > 40 || (!olState.visible && avg > 30)));
        if (scene.userData.__toonN === undefined || ++scene.userData.__toonN >= 12) { scene.userData.__toonN = 0; convert(scene); }
        renderer.getDrawingBufferSize(res); thick.value = 3 * Math.min(2, renderer.getPixelRatio() || 1);
      } catch (e) { window.__toon3d.err = String((e && e.stack) || e); }
    }
    if (obr0) return obr0.apply(this, arguments);
  };
  window.__toon3d = { stats: () => ({ pairs: pairs.size }), isOn, olState, forceCheck: () => { onAt = -1e9; } };
})();
