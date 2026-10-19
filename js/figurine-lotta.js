// js/figurine-lotta.js - «LOTTA DI FIGURE» · motore a turni 3 contro 3 per «Cacciatori di Figurine» (e per il cabinato in Sala Giochi)
// Ogni figura ha un tipo (campo, aria, ombra, cuore). Triangolo: aria batte campo, campo batte ombra, ombra batte aria (×1.5; al contrario ×0.67). Il cuore è neutro e cura.
// Ogni turno: una mossa (Colpo normale illimitato, Speciale del proprio tipo con 3 usi) oppure un cambio. Vince chi mette KO tutte le figure avversarie.
// Opzioni: team [{id,n,icon,type,hp,atk,def,lv,moves:[[nome,potenza,tipizzata]]}], foe [...], beats {tipo: tipoBattuto}, title, onDone({win, ko}).
// Test: window.__lotta.state.finish(true|false).
(function () {
  "use strict";
  if (window.__lotta) return;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const BEATS = { aria: "campo", campo: "ombra", ombra: "aria" };
  const TI = { campo: "🌿", aria: "🌬️", ombra: "🌑", cuore: "💗" };
  let S = null, root = null;
  function css() {
    if (document.getElementById("lbFgCss")) return;
    const st = document.createElement("style"); st.id = "lbFgCss";
    st.textContent = `#fgOv{position:fixed;inset:0;z-index:300;background:linear-gradient(#1b1038,#2c1a4a);color:#f3e8ff;font-family:'Trebuchet MS',Georgia,serif;display:flex;flex-direction:column;gap:6px;padding:8px;overflow:auto}
#fgOv h3{margin:0;font-size:15px;color:#fde68a;display:flex;justify-content:space-between;gap:8px}
#fgOv .row{display:flex;gap:6px}#fgOv .u{flex:1;background:#2b1d4d;border:2px solid #6d4aa8;border-radius:10px;padding:6px;text-align:center;min-width:0}
#fgOv .u.me{border-color:#fbbf24}#fgOv .u.ko{opacity:.35}#fgOv .u .ic{font-size:34px;line-height:1.1}#fgOv .u small{display:block;color:#d8b4fe;font-size:11px}
#fgOv .bar{height:8px;background:#150b2c;border-radius:4px;overflow:hidden;margin-top:3px}#fgOv .bar i{display:block;height:100%;background:#4ade80}
#fgOv .mini{display:flex;gap:4px;justify-content:center;margin-top:3px;font-size:16px}
#fgOv .bt{display:flex;flex-wrap:wrap;gap:6px}#fgOv .bt button{flex:1 1 45%;min-height:44px;border-radius:10px;border:2px solid #7c3aed;background:#3b2470;color:#f5f3ff;font-size:14px;font-weight:700;padding:4px}
#fgOv .bt button:disabled{opacity:.4}#fgOv .bt button small{display:block;font-size:11px;font-weight:400;color:#ddd6fe}
#fgOv .lg{font-size:12px;color:#ddd6fe;min-height:48px;background:#150b2c;border-radius:8px;padding:6px 8px}
#fgOv .go{min-height:46px;border-radius:10px;border:2px solid #fbbf24;background:#7c3aed;color:#fff;font-size:16px;font-weight:700}`;
    document.head.appendChild(st);
  }
  const mk = (u) => ({ id: u.id, n: u.n, icon: u.icon || "🃏", type: u.type || "campo", max: Math.max(8, u.hp | 0 || 22), hp: Math.max(8, u.hp | 0 || 22), atk: u.atk | 0 || 7, def: u.def | 0 || 4, lv: u.lv || 1, moves: (u.moves && u.moves.length ? u.moves : [["Colpo", 6, 0], ["Speciale", 8, 1]]).map((m) => ({ n: m[0], pow: m[1], typed: !!m[2], heal: m[3] === "heal", pp: m[2] || m[3] ? 3 : 99 })) });
  const alive = (a) => a.filter((u) => u.hp > 0);
  function mult(att, def) { const b = S.beats; if (b[att] === def) return 1.5; if (b[def] === att) return 0.67; return 1; }
  function hit(a, d, m) {
    if (m.heal) { const h = Math.round(a.max * 0.4); a.hp = Math.min(a.max, a.hp + h); return `${a.n} si cura (+${h}).`; }
    const k = m.typed ? mult(a.type, d.type) : 1, dm = Math.max(2, Math.round(((a.atk + (a.lv - 1)) * m.pow / 6 - d.def / 3) * k));
    d.hp = Math.max(0, d.hp - dm);
    return `${a.n} usa ${m.n}: ${dm} danni${k > 1 ? " (superefficace!)" : k < 1 ? " (poco efficace)" : ""}${d.hp ? "" : `. ${d.n} è KO!`}`;
  }
  function foeMove(f, d) {
    const ms = f.moves.filter((m) => m.pp > 0); if (f.hp < f.max * 0.3) { const h = ms.find((m) => m.heal); if (h && Math.random() < 0.6) return h; }
    const best = ms.filter((m) => !m.heal).sort((x, y) => (y.typed ? mult(f.type, d.type) : 1) * y.pow - (x.typed ? mult(f.type, d.type) : 1) * x.pow)[0];
    return Math.random() < 0.75 ? best || ms[0] : ms[Math.floor(Math.random() * ms.length)];
  }
  function draw() {
    if (!root) return;
    const me = S.team[S.pa], fo = S.foe[S.fa], end = S.phase === "end";
    const card = (u, cls) => `<div class="u ${cls}${u.hp <= 0 ? " ko" : ""}"><div class="ic">${esc(u.icon)}</div><b>${esc(u.n)}</b> <small>${TI[u.type] || ""} ${esc(u.type)} · Liv. ${u.lv}</small><div class="bar"><i style="width:${Math.round(100 * u.hp / u.max)}%"></i></div><small>${u.hp}/${u.max}</small></div>`;
    const mini = (a, cur) => `<div class="mini">${a.map((u, i) => `<span style="opacity:${u.hp > 0 ? 1 : .3};${i === cur ? "outline:2px solid #fbbf24;border-radius:4px" : ""}">${esc(u.icon)}</span>`).join("")}</div>`;
    const bts = end ? "" : S.pick === "sw" ? S.team.map((u, i) => `<button data-sw="${i}" ${u.hp <= 0 || i === S.pa ? "disabled" : ""}>${esc(u.icon)} ${esc(u.n)}<small>${u.hp}/${u.max}</small></button>`).join("") + `<button data-bk="1">◂ Indietro</button>`
      : me.moves.map((m, i) => `<button data-mv="${i}" ${m.pp <= 0 ? "disabled" : ""}>${m.heal ? "💗" : m.typed ? TI[me.type] : "👊"} ${esc(m.n)}<small>Pot. ${m.pow}${m.pp < 99 ? " · usi " + m.pp : ""}</small></button>`).join("") + (alive(S.team).length > 1 ? `<button data-sw="x">🔄 Cambia<small>Un turno</small></button>` : "");
    root.innerHTML = `<h3><span>${esc(S.title)}</span><span>Turno ${S.turn}</span></h3><div class="row">${card(fo, "")}</div>${mini(S.foe, S.fa)}<div class="row">${card(me, "me")}</div>${mini(S.team, S.pa)}<div class="bt">${bts}</div><div class="lg">${S.log || "Scegli una mossa."}</div>${end ? `<button class="go" id="fgGo">Fine ▸</button>` : ""}`;
    root.querySelectorAll("[data-mv]").forEach((b) => (b.onclick = () => turn({ mv: +b.dataset.mv })));
    root.querySelectorAll("[data-sw]").forEach((b) => (b.onclick = () => { if (b.dataset.sw === "x") { S.pick = "sw"; draw(); } else turn({ sw: +b.dataset.sw }); }));
    root.querySelectorAll("[data-bk]").forEach((b) => (b.onclick = () => { S.pick = ""; draw(); }));
    const g = root.querySelector("#fgGo"); if (g) g.onclick = close;
  }
  function next(side) { const a = side === "p" ? S.team : S.foe, i = a.findIndex((u) => u.hp > 0); if (i >= 0) { if (side === "p") S.pa = i; else S.fa = i; } return i >= 0; }
  function turn(c) {
    if (S.phase === "end") return;
    const me = S.team[S.pa], fo = S.foe[S.fa], L = []; S.pick = ""; S.turn++;
    if (c.sw != null) { S.pa = c.sw; L.push(`${S.team[S.pa].n} entra in campo.`); }
    else { const m = me.moves[c.mv]; if (m.pp < 99) m.pp--; L.push(hit(me, fo, m)); }
    if (fo.hp <= 0) { if (!next("f")) return endMatch(true, L); L.push(`${S.foe[S.fa].n} scende in campo.`); }
    else { const f2 = S.foe[S.fa], t = S.team[S.pa], m = foeMove(f2, t); if (m.pp < 99) m.pp--; L.push(hit(f2, t, m)); if (t.hp <= 0) { if (!next("p")) return endMatch(false, L); L.push(`Tocca a ${S.team[S.pa].n}.`); } }
    S.log = L.join(" "); draw();
  }
  function endMatch(win, L) { S.phase = "end"; S.win = win; S.log = (L || []).concat(win ? "Vittoria! Le figure si inchinano." : "Sconfitta. Le tue figure si ritirano a leccarsi le ferite.").join(" "); draw(); }
  function close() { const o = S.o, r = { win: !!S.win, ko: S.team.filter((u) => u.hp <= 0).length, a: S.win ? 1 : 0, b: S.win ? 0 : 1, recap: "" }; if (root) root.remove(); root = null; S = null; window.__lotta.state = null; o.onDone && o.onDone(r); }
  function start(o) {
    css(); if (root) root.remove();
    const team = (o.team || []).slice(0, 3).map(mk), foe = (o.foe || []).slice(0, 3).map(mk);
    if (!team.length || !foe.length) return false;
    root = document.createElement("div"); root.id = "fgOv"; document.body.appendChild(root);
    S = { o, team, foe, beats: o.beats || BEATS, pa: 0, fa: 0, turn: 1, phase: "play", log: "", pick: "", title: o.title || "Lotta di figure" };
    window.__lotta.state = { finish: (win) => { if (S) endMatch(!!win, []); }, get team() { return S.team; }, get foe() { return S.foe; } };
    draw(); return true;
  }
  window.__lotta = { start, state: null, BEATS };
})();
