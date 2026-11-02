// js/presa.js - PRESA UNICA · Gettoni Truccati · Scambio di Costumi (Sala Giochi)
// Un solo modo di lanciare qualunque cabinato della Sala Giochi e di leggerne l'esito normalizzato { punti, vinto, tempo }.
//   window.__presa.run(id, { token, costume, onEnd(res) })  -> lancia il cabinato `id` (true se partito). res = { id, punti, vinto, tempo, token, costume, best, nuovo }
//   window.__presa.begin(id) / end(id, rawRes)               -> usati da js/salone.js (sgPlay) per ogni partita dei cabinati
//   window.__presa.on() / setOn(v)                           -> opzione «Gettoni e Costumi» (Impostazioni); spenta = Sala Giochi come prima
//   window.__presa.sel() / setSel({ tok, cos })              -> gettone e costume scelti nella Sala Giochi
//   window.__presa.TOK, costumeSagas(), recs(), cutin(titolo, sotto, cb)
// GETTONI: nebbia, tremolio, notte, neon. Cambiano solo l'aspetto dello schermo (nessun codice dentro ai cabinati) e moltiplicano i punti mostrati;
//   i record sono separati per gettone. COSTUMI: durante la partita i ritratti dei personaggi sono quelli di un'altra saga (finita).
// Nessun premio, nessun bonus alle partite o alla Storia. Salvataggio proprio: ali-di-rondine.presa
(function () {
  "use strict";
  if (window.__presa) return;
  const KEY = "ali-di-rondine.presa";
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { on: r.on !== false, tok: typeof r.tok === "string" ? r.tok : "", cos: typeof r.cos === "string" ? r.cos : "", rec: r.rec && typeof r.rec === "object" ? r.rec : {} }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)));
  const TOK = {
    nebbia: ["Nebbia", "🌫️", "Una nebbia fitta copre i bordi dello schermo.", 1.3],
    tremolio: ["Tremolio", "🫨", "Lo schermo trema di continuo.", 1.3],
    notte: ["Notte", "🌑", "Quasi buio: si vede solo il centro.", 1.2],
    neon: ["Neon", "🌈", "Colori invertiti, occhi in confusione.", 1.1],
  };
  const hash = (s) => { let h = 7; String(s).split("").forEach((c) => (h = (h * 31 + c.charCodeAt(0)) >>> 0)); return h; };
  let CTX = null, OVR = null, LAST = null, OLD = null, INNER = false;

  function css() {
    if (document.getElementById("pgCss")) return; const st = document.createElement("style"); st.id = "pgCss";
    st.textContent = `#pgFx{position:fixed;inset:0;z-index:2147483000;pointer-events:none}
#pgFx.nebbia{background:radial-gradient(ellipse at 50% 50%,rgba(210,220,235,0) 26%,rgba(210,220,235,.78) 64%,rgba(228,234,246,.95) 100%)}
#pgFx.notte{background:radial-gradient(circle at 50% 50%,rgba(0,0,10,0) 20%,rgba(0,0,10,.9) 58%,rgba(0,0,10,.97) 100%)}
body.pgt-notte canvas{filter:brightness(.7) contrast(1.3)}
body.pgt-neon canvas{filter:invert(1) hue-rotate(180deg)}
body.pgt-tremolio canvas{animation:pgSh .16s infinite}
@keyframes pgSh{0%{transform:translate(2px,1px)}25%{transform:translate(-2px,-1px)}50%{transform:translate(1px,-2px)}75%{transform:translate(-1px,2px)}100%{transform:translate(2px,1px)}}
.pgToast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:2147483001;background:rgba(10,14,34,.94);border:2px solid #fbbf24;color:#fff7d6;border-radius:12px;padding:9px 14px;font:700 13px system-ui;max-width:92vw;text-align:center;animation:pgIn .3s}
@keyframes pgIn{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}
.pgCut{position:fixed;inset:0;z-index:2147483002;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,8,22,.78);animation:pgFade 1.7s both}
.pgCut .bar{position:absolute;left:0;right:0;top:40%;height:20%;background:linear-gradient(90deg,transparent,#f59e0b,#fde047,#f59e0b,transparent);opacity:.9;transform:scaleX(0);animation:pgBar 1.7s both}
.pgCut h2{position:relative;margin:0;font:900 clamp(26px,8vw,52px) system-ui;color:#1a0f00;letter-spacing:.06em;animation:pgZoom 1.7s both;text-align:center}
.pgCut p{position:relative;margin:8px 16px 0;font:700 14px system-ui;color:#2a1800;text-align:center;animation:pgZoom 1.7s .1s both}
@keyframes pgFade{0%{opacity:0}12%{opacity:1}85%{opacity:1}100%{opacity:0}}
@keyframes pgBar{0%{transform:scaleX(0)}25%{transform:scaleX(1)}85%{transform:scaleX(1)}100%{transform:scaleX(1)}}
@keyframes pgZoom{0%{transform:scale(.4);opacity:0}25%{transform:scale(1.08);opacity:1}40%{transform:scale(1)}100%{transform:scale(1)}}`;
    document.head.appendChild(st);
  }
  function cutin(title, sub, cb) {
    css(); const c = document.createElement("div"); c.className = "pgCut";
    c.innerHTML = `<div class="bar"></div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ""}`; document.body.appendChild(c);
    setTimeout(() => { c.remove(); cb && cb(); }, 1700);
  }
  function toast(t) { css(); const d = document.createElement("div"); d.className = "pgToast"; d.innerHTML = t; document.body.appendChild(d); setTimeout(() => d.remove(), 3600); }

  // ---------------------------------------------------------------- costumi
  const cid = (c) => (Array.isArray(c) ? c[0] : c.id), csg = (c) => (Array.isArray(c) ? c[1] : c.saga);
  function pool(saga) { const S = window.__sogni; return S && S.CARDS ? S.CARDS.filter((c) => csg(c) === saga).map(cid) : []; }
  function costumeSagas() {
    const S = window.__sogni, B = window.__borgoApi; if (!S || !S.CARDS || !B || !B.portraitImg) return [];
    const seen = {}; S.CARDS.forEach((c) => { seen[csg(c)] = 1; });
    return Object.keys(seen).filter((k) => pool(k).some((id) => safe(() => B.portraitImg(id), null)));
  }
  function dress(saga) {
    const B = window.__borgoApi, M = window.__mini, ids = pool(saga); if (!B || !B.portraitImg || !ids.length) return false;
    const opi = B.portraitImg, omi = M && M.img; OLD = { B, opi, M, omi };
    const map = (id) => { if (INNER || !id || id === "hero" || ids.indexOf(id) >= 0) return id; return safe(() => opi.call(B, id), null) ? ids[hash(id) % ids.length] : id; };
    B.portraitImg = function (id) { return opi.call(B, map(id)); };
    if (M && omi) M.img = function (id) { if (!id || id === "hero") return omi(id); const cid = map(id); INNER = true; try { return omi(cid); } finally { INNER = false; } };
    return true;
  }
  function undress() { if (!OLD) return; OLD.B.portraitImg = OLD.opi; if (OLD.M && OLD.omi) OLD.M.img = OLD.omi; OLD = null; }

  // ---------------------------------------------------------------- gettoni
  function applyTok(t) {
    css(); clearTok(); if (!t || !TOK[t]) return; document.body.classList.add("pgt-" + t);
    if (t === "nebbia" || t === "notte") { const d = document.createElement("div"); d.id = "pgFx"; d.className = t; document.body.appendChild(d); }
  }
  function clearTok() { Object.keys(TOK).forEach((k) => document.body.classList.remove("pgt-" + k)); const d = document.getElementById("pgFx"); if (d) d.remove(); }

  // ---------------------------------------------------------------- inizio/fine di ogni partita
  function begin(id) {
    end(null, null, true); const r = load(); const o = OVR; OVR = null;
    if (!r.on && !o) return null;
    const tok = o && o.token != null ? o.token : r.tok, cos = o && o.costume != null ? o.costume : r.cos;
    CTX = { id, t0: Date.now(), tok: TOK[tok] ? tok : "", cos: "" }; applyTok(CTX.tok);
    if (cos && dress(cos)) CTX.cos = cos;
    return CTX;
  }
  const norm = (res) => { res = res || {}; const n = [res.score, res.punti, res.a, res.goals, res.gol].find((x) => typeof x === "number" && isFinite(x)); return { vinto: !!(res.win || res.vinto), punti: n != null ? Math.round(n) : res.win ? 1 : 0 }; };
  function end(id, raw, silent) {
    const c = CTX; CTX = null; if (!c) { undress(); clearTok(); return null; }
    undress(); clearTok(); if (silent && raw == null) return null;
    const nr = norm(raw), mult = c.tok ? TOK[c.tok][3] : 1, punti = Math.round(nr.punti * mult);
    const r = load(), k = c.id + "|" + (c.tok || "-"), o = r.rec[k] || { n: 0, w: 0, best: null };
    const nuovo = o.best == null || punti > o.best; o.n++; if (nr.vinto) o.w++; if (nuovo) o.best = punti; r.rec[k] = o; save(r);
    LAST = { id: c.id, punti, vinto: nr.vinto, tempo: Date.now() - c.t0, token: c.tok, costume: c.cos, best: o.best, nuovo };
    if (c.tok || c.cos) toast(`${c.tok ? TOK[c.tok][1] + " " + TOK[c.tok][0] + " ×" + mult : ""}${c.tok && c.cos ? " · " : ""}${c.cos ? "👗 Costume" : ""} → <b>${punti}</b> punti${nuovo ? " · 🏅 nuovo record!" : " · record " + o.best}`);
    return LAST;
  }
  const SAL = () => window.__salone;
  function run(id, o) {
    o = o || {}; const s = SAL(); if (!s || !s.playMachine) return false; OVR = { token: o.token || "", costume: o.costume || "" };
    const ok = s.playMachine(id, () => { const l = LAST; o.onEnd && o.onEnd(l); }); if (!ok) OVR = null; return ok;
  }
  function recs() { return load().rec; }
  window.__presa = {
    run, begin, end, TOK, costumeSagas, recs, cutin, toast,
    on: () => load().on, setOn: (v) => { const r = load(); r.on = !!v; save(r); },
    sel: () => { const r = load(); return { tok: r.tok, cos: r.cos }; },
    setSel: (s) => { const r = load(); if (s && s.tok != null) r.tok = TOK[s.tok] ? s.tok : ""; if (s && s.cos != null) r.cos = s.cos; save(r); },
    reset: () => { CTX = null; OVR = null; undress(); clearTok(); }, norm,
  };
})();
