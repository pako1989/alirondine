// js/replica-sparring.js - «SPARRING VOLANTE» · duello aereo a turni per «Eroi in Replica» (e per il cabinato in Sala Giochi)
// Ogni round: SCHIVATA (l'avversario annuncia dove colpisce: tocca la corsia giusta in tempo, ogni schivata dà +1 carica) e COLPO (scegli la corsia: più carica, più danno;
// l'avversario può parare una corsia a caso). Si perde un punto vita a ogni attacco subito. Vince chi azzera la vita dell'altro (max 8 round).
// Opzioni: title, level (1-3), oppName, mate (non usato), hp (vita extra), onDone({win, hp, foe}). Test: window.__sparring.state.finish(win).
(function () {
  "use strict";
  if (window.__sparring) return;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LN = ["Alto", "Centro", "Basso"], AR = ["⬆️", "➡️", "⬇️"];
  let S = null, root = null, timer = null;
  function css() {
    if (document.getElementById("spCss")) return;
    const st = document.createElement("style"); st.id = "spCss";
    st.textContent = `#spOv{position:fixed;inset:0;z-index:300;background:linear-gradient(#0b1530,#1e3a6a);color:#e0efff;font-family:'Trebuchet MS',Georgia,serif;display:flex;flex-direction:column;gap:6px;padding:8px;overflow:auto}
#spOv h3{margin:0;font-size:15px;color:#7dd3fc;display:flex;justify-content:space-between;gap:8px}
#spOv .sc{display:flex;gap:6px;font-size:14px}#spOv .sc b{flex:1;text-align:center;background:#12264a;border:1px solid #3b82c4;border-radius:8px;padding:5px}
#spOv .fd{background:#0a1226;border:2px solid #2f5f9f;border-radius:10px;padding:8px;text-align:center}
#spOv .tg{font-size:34px;min-height:44px}#spOv .tm{height:8px;background:#12264a;border-radius:4px;overflow:hidden;margin:6px 0}#spOv .tm i{display:block;height:100%;width:100%;background:#38bdf8}
#spOv .bt{display:flex;gap:6px}#spOv .bt button{flex:1;min-height:52px;border-radius:10px;border:2px solid #38bdf8;background:#1e3a8a;color:#e0f2fe;font-size:14px;font-weight:700;padding:4px}
#spOv .bt button small{display:block;font-size:11px;font-weight:400;color:#bae6fd}
#spOv .lg{font-size:12px;color:#bae6fd;min-height:52px;background:#060c1c;border-radius:8px;padding:6px 8px}
#spOv .go{min-height:46px;border-radius:10px;border:2px solid #fbbf24;background:#b45309;color:#fff;font-size:16px;font-weight:700}`;
    document.head.appendChild(st);
  }
  const lv = () => S.o.level || 1, foeHp = () => 9 + 4 * lv(), win = () => S.foe <= 0, lose = () => S.hp <= 0;
  const slot = () => Math.max(650, 1700 - 300 * lv());
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }
  function draw() {
    if (!root) return;
    const end = S.phase === "end", rnd = Math.min(S.round, 8);
    let body = "";
    if (S.phase === "dodge") body = `<div class="fd"><b>Schivata · ${esc(S.o.oppName || "Il Campione")} attacca</b><div class="tg">${S.cur == null ? "…" : AR[S.cur] + " " + LN[S.cur]}</div><div class="tm"><i id="spTm"></i></div>Tocca la corsia dove vuoi spostarti: vai dove NON colpisce.</div><div class="bt">${LN.map((n, i) => `<button data-d="${i}">${AR[i]} ${n}</button>`).join("")}</div>`;
    else if (S.phase === "strike") body = `<div class="fd"><b>Colpo · carica ${S.charge}</b><br>${esc(S.o.oppName || "Lui")} si prepara a parare una corsia. Più carica, più danno.</div><div class="bt">${LN.map((n, i) => `<button data-s="${i}">${AR[i]} ${n}<small>Danno ${3 * (1 + Math.min(S.charge, 3))}</small></button>`).join("")}</div>`;
    else body = `<div class="fd"><b>${win() ? "Vittoria" : "Sconfitta"}</b></div><button class="go" id="spGo">Continua ▸</button>`;
    root.innerHTML = `<h3><span>${esc(S.o.title || "Sparring Volante")}</span><span>Round ${rnd}/8</span></h3><div class="sc"><b>Vita ${S.hp}</b><b>Avversario ${Math.max(0, S.foe)}</b><b>Carica ${S.charge}</b></div>${body}<div class="lg">${esc(S.log)}</div>`;
    const g = root.querySelector("#spGo"); if (g) g.onclick = close;
    root.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => dodge(+b.dataset.d)));
    root.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => strike(+b.dataset.s)));
  }
  function nextAtk() {
    if (S.idx >= S.seq.length) { S.phase = "strike"; S.log = `Schivate: ${S.ok}/${S.seq.length}. Ora tocca a te.`; return draw(); }
    S.cur = S.seq[S.idx]; S.phase = "dodge"; S.t0 = Date.now(); draw();
    const tm = root && root.querySelector("#spTm"); if (tm) { tm.style.transition = `width ${slot()}ms linear`; requestAnimationFrame(() => { tm.style.width = "0%"; }); }
    stop(); timer = setTimeout(() => hit("Troppo lento: ti colpisce in pieno."), slot());
  }
  function hit(txt) { stop(); S.hp--; S.log = txt; S.idx++; if (lose()) return end(); nextAtk(); }
  function dodge(i) {
    if (S.phase !== "dodge" || S.cur == null) return; stop();
    if (i === S.cur) return hit("Sbagli corsia: ti prende al volo.");
    S.ok++; S.charge = Math.min(5, S.charge + 1); S.log = "Schivata! Accumuli carica."; S.idx++; nextAtk();
  }
  function strike(i) {
    if (S.phase !== "strike") return;
    const power = 1 + Math.min(S.charge, 3), guard = Math.random() < 0.3 + 0.1 * lv() ? Math.floor(Math.random() * 3) : -1, dmg = 3 * power, real = guard === i ? Math.ceil(dmg / 2) : dmg;
    S.foe -= real; S.log = guard === i ? `Para ${LN[guard].toLowerCase()}: il colpo vale solo ${real}.` : `Colpo ${LN[i].toLowerCase()} a segno: ${real} danni.`; S.charge = 0;
    if (win()) return end();
    S.round++; if (S.round > 8) { S.foe = Math.min(S.foe, S.hp > 2 ? 0 : S.foe); return end(); }
    S.seq = Array.from({ length: 2 + lv() }, () => Math.floor(Math.random() * 3)); S.idx = 0; S.ok = 0; nextAtk();
  }
  function end() { stop(); S.phase = "end"; S.log = (S.log ? S.log + " " : "") + (win() ? "Il tuo avversario si ferma a mezz'aria e ti fa un cenno." : "Sei a terra. Il cielo, oggi, non era tuo."); draw(); }
  function close() { stop(); const o = S.o, r = { win: win(), hp: S.hp, foe: Math.max(0, S.foe), a: win() ? 1 : 0, b: win() ? 0 : 1, recap: "" }; if (root) root.remove(); root = null; S = null; window.__sparring.state = null; o.onDone && o.onDone(r); }
  function start(o) {
    css(); stop(); if (root) root.remove();
    root = document.createElement("div"); root.id = "spOv"; document.body.appendChild(root);
    S = { o, hp: 5 + (o.hp | 0), foe: 0, charge: Math.min(5, o.charge | 0), round: 1, seq: [], idx: 0, ok: 0, cur: null, phase: "dodge", log: "Il duello comincia: leggi dove colpisce e schiva." };
    S.foe = foeHp(); S.seq = Array.from({ length: 2 + lv() }, () => Math.floor(Math.random() * 3));
    window.__sparring.state = { finish: (w) => { if (!S) return; S.foe = w ? 0 : S.foe; S.hp = w ? S.hp : 0; end(); }, get hp() { return S.hp; }, get foe() { return S.foe; }, get cur() { return S.cur; }, get charge() { return S.charge; }, get phase() { return S.phase; } };
    nextAtk(); return true;
  }
  window.__sparring = { start, state: null };
})();
