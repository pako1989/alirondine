// js/arena-assedio.js - «ASSEDIO DEI SOGNI»: l'Assedio a ondate (js/assedio.js, quello della Notte dei Tifosi Morti) dentro l'Arena dei Sogni.
// Il Campione corre e calcia da solo; tre carte della tua Squadra dei Sogni corrono con lui, ognuna col potere del suo ruolo
// (Attaccante: Bomber · Difensore: Muro · Portiere: Cura · Centrocampista: Lampo o Coro). Le leggendarie ed epiche danno un potere di partenza.
// Notte normale (tempo + capo) o Notte infinita (record in secondi). Cut-in animato all'ingresso. Spegnibile in Impostazioni.
// Entry: window.__arenaAssedio = { open(back), on(), setOn(v), allies(), cutin(list, cb) }
(function () {
  "use strict";
  if (window.__arenaAssedio) return;
  const KEY = "ali-di-rondine.arena-assedio";
  const S = () => window.__sogni;
  const safe = (f, d) => { try { return f(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const load = () => { const d = { on: true, wins: 0, best: 0, daily: "" }; try { return Object.assign(d, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return d; } };
  const save = (r) => { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {} };
  const POW = { A: ["bomber", "Bomber"], D: ["muro", "Muro"], P: ["cura", "Cura"] };
  const ARENAS = [
    { id: "arena", n: "L'Arena dei Sogni", d: "Il campo onirico: luci viola, pavimento a scacchi.", mix: ["tifoso", "corridore", "panzone", "lanciatore"], boss: "mascotte" },
    { id: "campo", n: "Il campo nella nebbia", d: "Lo Stadio Comunale di Borgo Marino, al novantesimo.", mix: ["tifoso", "corridore"], boss: "tamburo" },
    { id: "tribuna", n: "La tribuna", d: "File di seggiolini e lanciatori di rotoli.", mix: ["tifoso", "corridore", "lanciatore"], boss: "megafono" },
    { id: "curva", n: "La curva ospite", d: "Gradoni, tamburi e ventimila sciarpe.", mix: ["tifoso", "panzone", "tamburino", "lanciatore"], boss: "ringhio" },
    { id: "parcheggio", n: "Il parcheggio all'alba", d: "Macchine, lampioni e un rospo di gommapiuma.", mix: ["tifoso", "corridore", "panzone", "tamburino", "lanciatore"], boss: "mascotte" }
  ];
  let OV = null, BACK = null, PICK = { arena: "arena", mode: "notte" };

  // le tre carte che corrono col Campione: le più forti della squadra, col potere del loro ruolo
  function allies() {
    const s = S(); if (!s) return [];
    const r = s._load(), team = (r.team || []).filter((id) => s.BY[id]);
    const tot = (c) => { const e = safe(() => s.eff(c), c); return (e.at || 0) + (e.df || 0) + (e.te || 0); };
    return team.map((id) => s.BY[id]).sort((a, b) => tot(b) - tot(a)).slice(0, 3).map((c) => {
      const p = POW[c.role] || (c.te >= c.at ? ["coro", "Coro"] : ["flash", "Lampo"]);
      return { id: c.id, n: safe(() => s.name(c.id), c.id), pow: p[0], powN: p[1], rar: c.rar, role: c.role, img: safe(() => s.port(c.id), null) };
    });
  }
  function perksOf(al) {
    const p = {};
    al.forEach((a) => { if (a.rar === "l") p.potenza = (p.potenza || 0) + 1; else if (a.rar === "e") p.raffica = (p.raffica || 0) + 1; });
    const I = safe(() => S().intesa(S()._load().team).n, 0); if (I >= 3) p.sciarpa = 1;
    return p;
  }

  const CSS = `
  .aaRoot{position:fixed;inset:0;z-index:99990;background:radial-gradient(120% 70% at 50% 0%,#2e1065 0%,#0b0618 65%);color:#ede9fe;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;overflow-y:auto;-webkit-overflow-scrolling:touch;font-size:14px}
  .aaRoot *{box-sizing:border-box}.aaW{max-width:640px;margin:0 auto;padding:12px 16px 24px}
  .aaHd{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.aaHd h1{margin:2px 0 0;font-size:20px;color:#fff}.aaHd p{margin:4px 0 0;font-size:12.5px;line-height:1.45;color:#c4b5fd}
  .aaX{flex:none;min-width:48px;min-height:44px;border:1px solid #a78bfa;background:#3b0764;color:#fff;border-radius:10px;font:800 15px system-ui;cursor:pointer}
  .aaSec{margin:14px 0 6px;font-size:11px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#a78bfa}
  .aaTeam{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .aaC{background:#1e1036;border:1px solid #4c1d95;border-radius:12px;padding:8px;text-align:center;min-width:0}.aaC img{width:56px;height:56px;border-radius:10px;image-rendering:pixelated;background:#2e1065}
  .aaC b{display:block;font-size:12.5px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.aaC span{display:block;font-size:11px;color:#c4b5fd}
  .aaRow{display:flex;flex-wrap:wrap;gap:6px}.aaChip{min-height:40px;padding:6px 11px;border-radius:20px;border:1px solid #6d28d9;background:#1e1036;color:#ede9fe;font:700 12.5px system-ui;cursor:pointer}.aaChip.on{background:#7c3aed;border-color:#c4b5fd;color:#fff}
  .aaGo{display:block;width:100%;min-height:52px;margin-top:14px;border:0;border-radius:12px;font:800 16px system-ui;color:#1a0b2e;background:linear-gradient(90deg,#a3e635,#facc15);cursor:pointer}
  .aaGo[disabled]{opacity:.4}.aaInfo{margin-top:12px;padding:10px 12px;border:1px solid #4c1d95;border-radius:12px;background:rgba(30,16,54,.7);font-size:12px;line-height:1.5;color:#c4b5fd}.aaInfo b{color:#fff}
  .aaCut{position:fixed;inset:0;z-index:99995;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:rgba(11,6,24,.92);overflow:hidden;pointer-events:none}
  .aaCut .bar{position:absolute;left:-10%;right:-10%;height:84px;top:calc(50% - 42px);background:linear-gradient(90deg,#4c1d95,#a3e635 50%,#4c1d95);transform:skewY(-6deg);animation:aaBar .5s ease-out both;opacity:.9}
  .aaCut h2{position:relative;margin:0;font:900 28px system-ui;letter-spacing:2px;color:#fff;text-shadow:0 3px 0 #3b0764,0 0 18px #a3e635;animation:aaPop .45s .15s cubic-bezier(.2,1.6,.4,1) both}
  .aaCut .who{position:relative;display:flex;gap:10px}.aaCut .who div{width:76px;text-align:center;font:800 11px system-ui;color:#fde047;animation:aaIn .4s both}
  .aaCut .who img{width:64px;height:64px;border-radius:12px;border:2px solid #facc15;background:#2e1065;image-rendering:pixelated}
  .aaCut .sub{position:relative;font:700 13px system-ui;color:#e9d5ff;animation:aaPop .4s .7s both}
  @keyframes aaBar{from{transform:translateX(-100%) skewY(-6deg)}to{transform:translateX(0) skewY(-6deg)}}
  @keyframes aaPop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes aaIn{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
  @media (prefers-reduced-motion:reduce){.aaCut *{animation:none!important}}`;
  function css() { if (document.getElementById("aaStyle")) return; const st = document.createElement("style"); st.id = "aaStyle"; st.textContent = CSS; document.head.appendChild(st); }
  function close() { if (OV) { OV.remove(); OV = null; } }

  // cut-in animato: barra che entra, titolo, le tre carte che salgono una alla volta
  function cutin(al, cb, title) {
    css(); const c = document.createElement("div"); c.className = "aaCut"; c.id = "aaCut";
    c.innerHTML = `<div class="bar"></div><h2>${esc(title || "ASSEDIO DEI SOGNI")}</h2><div class="who">${al.map((a, i) => `<div style="animation-delay:${0.35 + i * 0.15}s">${a.img ? `<img alt="" src="${a.img}">` : ""}<br>${esc(a.n)}<br><span style="color:#a3e635">${esc(a.powN)}</span></div>`).join("")}</div><div class="sub">Resisti fino all'alba. Il Campione calcia da solo.</div>`;
    document.body.appendChild(c);
    setTimeout(() => { c.remove(); cb && cb(); }, 1700);
  }

  function open(back) {
    if (back) BACK = back; close(); css();
    const r = load(), al = allies(), A = ARENAS.find((x) => x.id === PICK.arena) || ARENAS[0], pk = perksOf(al);
    OV = document.createElement("div"); OV.className = "aaRoot"; OV.id = "aaOv";
    const pkTxt = Object.keys(pk).map((k) => `${k} ${pk[k]}`).join(" · ");
    OV.innerHTML = `<div class="aaW"><div class="aaHd"><div><h1>🧟 Assedio dei Sogni</h1><p>L'Assedio a ondate della Notte dei Tifosi Morti, con le tue carte. Trascina il dito per correre: il Campione calcia da solo. A ogni livello scegli un potere fra tre.</p></div><button type="button" class="aaX" data-a="x" aria-label="Chiudi">✕</button></div>
      <div class="aaSec">Corrono con te</div>
      ${al.length ? `<div class="aaTeam">${al.map((a) => `<div class="aaC">${a.img ? `<img alt="" src="${a.img}">` : ""}<b>${esc(a.n)}</b><span>${esc(a.powN)}${a.rar === "l" ? " · ★ leggendaria" : a.rar === "e" ? " · epica" : ""}</span></div>`).join("")}</div>` : `<p class="aaInfo">Nessuna carta in squadra: corri da solo. Schiera le carte nella Squadra dei Sogni per avere compagni.</p>`}
      ${pkTxt ? `<p class="aaInfo">✨ Poteri di partenza: <b>${esc(pkTxt)}</b> (leggendarie, epiche e intesa di squadra).</p>` : ""}
      <div class="aaSec">Campo</div><div class="aaRow">${ARENAS.map((x) => `<button type="button" class="aaChip${x.id === A.id ? " on" : ""}" data-ar="${x.id}">${esc(x.n)}</button>`).join("")}</div>
      <p class="aaInfo" style="margin-top:6px">${esc(A.d)}</p>
      <div class="aaSec">Notte</div><div class="aaRow"><button type="button" class="aaChip${PICK.mode === "notte" ? " on" : ""}" data-md="notte">🌙 Notte · 2 min + capo</button><button type="button" class="aaChip${PICK.mode === "infinita" ? " on" : ""}" data-md="infinita">♾️ Notte infinita · record</button></div>
      <button type="button" class="aaGo" data-a="go">▶ Si comincia</button>
      <div class="aaInfo">🏆 Notti vinte: <b>${r.wins}</b> · Record notte infinita: <b>${r.best || 0} s</b>. Prima vittoria del giorno: +30 monete. Si spegne in Impostazioni.</div></div>`;
    document.body.appendChild(OV);
    const q = (s) => OV.querySelector(s);
    q('[data-a="x"]').onclick = () => { close(); if (BACK) BACK(); };
    OV.querySelectorAll("[data-ar]").forEach((b) => (b.onclick = () => { PICK.arena = b.dataset.ar; open(); }));
    OV.querySelectorAll("[data-md]").forEach((b) => (b.onclick = () => { PICK.mode = b.dataset.md; open(); }));
    q('[data-a="go"]').onclick = () => play(A, al, pk);
  }
  function play(A, al, pk) {
    const E = window.__assedio; if (!E || !E.start) return;
    close();
    const inf = PICK.mode === "infinita";
    cutin(al, () => {
      E.start({ title: `Assedio dei Sogni · ${A.n}`, arena: A.id, time: inf ? 99999 : 120, mix: A.mix, boss: inf ? null : A.boss, endless: inf, bestKey: inf ? "arena-assedio-best" : undefined,
        allies: al.map((a) => ({ id: a.id, n: a.n, pow: a.pow })), perks: pk, tutorial: true,
        onDone: (res) => {
          const r = load(), sec = Math.floor((res.data && res.data.t) || res.b || 0);
          let msg = "";
          if (inf) { if (sec > (r.best || 0)) { r.best = sec; msg = `Nuovo record: ${sec} s!`; } }
          else if (res.win) { r.wins++; if (r.daily !== today()) { r.daily = today(); safe(() => window.addCoins(30), 0); msg = "+30 monete: prima notte vinta di oggi."; } }
          save(r);
          if (msg) safe(() => window.toast(msg, "info", "🧟"));
          open();
        } });
    });
  }
  window.__arenaAssedio = { open, close, on: () => load().on !== false, setOn: (v) => { const r = load(); r.on = !!v; save(r); }, allies, cutin, ARENAS };
})();
