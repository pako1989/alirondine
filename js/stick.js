// js/stick.js - joystick virtuale analogico per i giochi con i personaggi (Calcio Eroi, Duello, Corsa da dietro).
// Uso: const st = window.__stick.make({ size: 150 }); contenitore.appendChild(st.el); st.v = { x, y, m } (x,y da -1 a 1, m = intensità 0..1).
// Si usa con il dito (pointer events, anche più dita insieme ai bottoni) e per i test con st.set(x, y).
(function () {
  "use strict";
  if (window.__stick) return;
  function css() {
    if (document.getElementById("stkCss")) return; const s = document.createElement("style"); s.id = "stkCss";
    s.textContent = `.stk{position:relative;border-radius:50%;background:radial-gradient(circle at 50% 40%,#2b2150,#150f2a 70%);border:2px solid #4a3a6a;touch-action:none;user-select:none;-webkit-user-select:none;flex:none;box-shadow:inset 0 0 18px #000a}
.stk::before{content:"";position:absolute;inset:22%;border-radius:50%;border:1.5px dashed #ffffff22}
.stk i{position:absolute;width:44%;height:44%;border-radius:50%;left:28%;top:28%;background:radial-gradient(circle at 35% 30%,#ffe9a8,#c8962a 70%);box-shadow:0 3px 8px #000b,inset 0 -3px 6px #0006;transition:transform .05s;pointer-events:none}
.stk.on i{background:radial-gradient(circle at 35% 30%,#fff7cf,#ffb347 70%)}
.stk b{position:absolute;color:#ffffff44;font:700 11px system-ui;pointer-events:none}.stk b:nth-of-type(1){top:5%;left:46%}.stk b:nth-of-type(2){bottom:5%;left:46%}.stk b:nth-of-type(3){left:6%;top:44%}.stk b:nth-of-type(4){right:6%;top:44%}`;
    document.head.appendChild(s);
  }
  function make(o) {
    css(); o = o || {}; const size = o.size || 150, R = size * 0.34, el = document.createElement("div"); el.className = "stk"; el.style.width = el.style.height = size + "px";
    el.innerHTML = '<b>▲</b><b>▼</b><b>◀</b><b>▶</b><i></i>'; const knob = el.querySelector("i"), st = { el, v: { x: 0, y: 0, m: 0 }, id: null };
    const dead = o.dead != null ? o.dead : 0.14;
    function set(x, y) {
      const m = Math.min(1, Math.hypot(x, y)); if (m < dead) { st.v = { x: 0, y: 0, m: 0 }; knob.style.transform = ""; return; }
      const a = Math.atan2(y, x); st.v = { x: Math.cos(a) * m, y: Math.sin(a) * m, m }; knob.style.transform = `translate(${Math.cos(a) * m * R}px,${Math.sin(a) * m * R}px)`;
    }
    function move(e) { const r = el.getBoundingClientRect(); set((e.clientX - (r.left + r.width / 2)) / R, (e.clientY - (r.top + r.height / 2)) / R); }
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); st.id = e.pointerId; try { el.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } el.classList.add("on"); move(e); });
    el.addEventListener("pointermove", (e) => { if (e.pointerId === st.id) move(e); });
    const up = (e) => { if (e.pointerId !== st.id) return; st.id = null; el.classList.remove("on"); set(0, 0); };
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up); el.addEventListener("lostpointercapture", up);
    st.set = set; return st;
  }
  window.__stick = { make };
})();
