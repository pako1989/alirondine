// js/joypad.js - joystick virtuale al posto delle quattro frecce nel Borgo, nelle trasferte e nelle città delle saghe.
// Trova da solo i direzionali (.dpad con [data-d], .cala-dpad con [data-dir]), nasconde le frecce e ci mette sopra un joystick
// che "preme" le frecce nascoste (pointerdown/mousedown e pointerup/mouseup): così funziona con il codice che c'è già, in 8 direzioni.
// Scelta in Impostazioni › Comandi: Joystick (predefinito) o Quattro frecce. Chiave: ali-di-rondine.comandi = "joy" | "frecce".
(function () {
  "use strict";
  if (window.__joypad) return;
  const KEY = "ali-di-rondine.comandi", PADS = [[".dpad", "data-d"], [".cala-dpad", "data-dir"]];
  const mode = () => { try { return localStorage.getItem(KEY) === "frecce" ? "frecce" : "joy"; } catch (e) { return "joy"; } };
  function css() {
    if (document.getElementById("jpCss")) return; const s = document.createElement("style"); s.id = "jpCss";
    s.textContent = `.dpad.jpOn,.cala-dpad.jpOn{position:relative}
.jpOn>*:not(.jp){visibility:hidden!important;opacity:0!important;transition:none!important;pointer-events:none!important}
.jp{position:absolute;inset:0;margin:auto;aspect-ratio:1;max-width:100%;max-height:100%;border-radius:50%;background:radial-gradient(circle at 50% 40%,#2a3a5ecc,#111a30dd 70%);border:2px solid #ffffff40;touch-action:none;user-select:none;-webkit-user-select:none;box-shadow:inset 0 0 16px #000a,0 2px 8px #0008;z-index:2}
.jp::before{content:"";position:absolute;inset:24%;border-radius:50%;border:1.5px dashed #ffffff26}
.jp i{position:absolute;width:44%;height:44%;left:28%;top:28%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a8,#c8962a 70%);box-shadow:0 3px 8px #000b,inset 0 -3px 6px #0006;pointer-events:none}
.jp.on i{background:radial-gradient(circle at 35% 30%,#fff7cf,#ffb347 70%)}
.jp b{position:absolute;color:#ffffff55;font:700 10px system-ui;pointer-events:none;line-height:1}.jp b:nth-of-type(1){top:4%;left:50%;transform:translateX(-50%)}.jp b:nth-of-type(2){bottom:4%;left:50%;transform:translateX(-50%)}.jp b:nth-of-type(3){left:5%;top:50%;transform:translateY(-50%)}.jp b:nth-of-type(4){right:5%;top:50%;transform:translateY(-50%)}`;
    document.head.appendChild(s);
  }
  function fire(b, type) {
    if (!b) return; const o = { bubbles: true, cancelable: true, pointerId: 77, pointerType: "touch", isPrimary: false };
    try { b.dispatchEvent(type.startsWith("pointer") && window.PointerEvent ? new PointerEvent(type, o) : new MouseEvent(type, o)); } catch (e) { /* ok */ }
  }
  function attach(pad, attr) {
    if (pad._jp) return; css();
    const btn = (d) => pad.querySelector(`[${attr}="${d}"]`);
    if (!btn("up") || !btn("down") || !btn("left") || !btn("right")) return;
    const el = document.createElement("div"); el.className = "jp"; el.setAttribute("aria-label", "Joystick"); el.innerHTML = "<b>▲</b><b>▼</b><b>◀</b><b>▶</b><i></i>";
    const knob = el.querySelector("i"), held = new Set(); let pid = null;
    const press = (want) => {
      held.forEach((d) => { if (!want.has(d)) { held.delete(d); fire(btn(d), "pointerup"); fire(btn(d), "mouseup"); } });
      want.forEach((d) => { if (!held.has(d)) { held.add(d); fire(btn(d), "pointerdown"); fire(btn(d), "mousedown"); } });
    };
    // x, y da -1 a 1: sotto 0.28 fermo; 8 settori (diagonali = due frecce insieme)
    function set(x, y) {
      const m = Math.min(1, Math.hypot(x, y)), R = el.clientWidth * 0.3;
      if (m < 0.28) { knob.style.transform = ""; return press(new Set()); }
      const a = Math.atan2(y, x); knob.style.transform = `translate(${Math.cos(a) * m * R}px,${Math.sin(a) * m * R}px)`;
      const s = Math.round(a / (Math.PI / 4)), want = new Set(); // 0 destra, 2 giù, ±4 sinistra, -2 su
      if ([-1, 0, 1].includes(s)) want.add("right"); if ([3, 4, -4, -3].includes(s)) want.add("left");
      if ([1, 2, 3].includes(s)) want.add("down"); if ([-1, -2, -3].includes(s)) want.add("up");
      press(want);
    }
    const move = (e) => { const r = el.getBoundingClientRect(), R = r.width * 0.3 || 1; set((e.clientX - (r.left + r.width / 2)) / R, (e.clientY - (r.top + r.height / 2)) / R); };
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); pid = e.pointerId; try { el.setPointerCapture(pid); } catch (x) { /* ok */ } el.classList.add("on"); move(e); });
    el.addEventListener("pointermove", (e) => { if (e.pointerId === pid) move(e); });
    const up = (e) => { if (e.pointerId !== pid) return; pid = null; el.classList.remove("on"); set(0, 0); };
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((t) => el.addEventListener(t, up));
    el.addEventListener("contextmenu", (e) => e.preventDefault());
    pad._jp = { el, set }; pad.appendChild(el); pad.classList.add("jpOn");
  }
  function detach(pad) { if (!pad._jp) return; pad._jp.set(0, 0); pad._jp.el.remove(); pad._jp = null; pad.classList.remove("jpOn"); }
  function scan() { const on = mode() === "joy"; PADS.forEach(([sel, attr]) => document.querySelectorAll(sel).forEach((p) => (on ? attach(p, attr) : detach(p)))); }
  let q = 0; const later = () => { if (!q) q = requestAnimationFrame(() => { q = 0; scan(); }); };
  // in orizzontale il «✕ Esci» delle saghe va in alto, al centro della scena (css/style.css usa --cvL/--cvT/--cvW)
  function cvVars() { const c = document.getElementById("cv"); if (!c) return; const r = c.getBoundingClientRect(), d = document.documentElement.style; d.setProperty("--cvL", r.left + "px"); d.setProperty("--cvT", r.top + "px"); d.setProperty("--cvW", r.width + "px"); }
  function start() { scan(); cvVars(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); addEventListener("resize", cvVars); setInterval(cvVars, 1000); }
  window.__joypad = { mode, set: (m) => { try { localStorage.setItem(KEY, m === "frecce" ? "frecce" : "joy"); } catch (e) { /* ok */ } scan(); }, scan, pad: (p) => p && p._jp };
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
