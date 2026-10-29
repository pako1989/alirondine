// js/ritmo.js - «RITMO» · motore musicale a tempo (Banda di Piazza). Le note scendono su 4 corsie (grancassa, rullante, piatti, ottoni):
// si toccano quando arrivano sulla linea. La base (tuba e accordi, oom-pah) suona da sola e tiene il tempo; grancassa, rullante, piatti e
// la MELODIA degli ottoni suonano solo se le prendi tu. Mancare = buco nel brano, e la piazza se ne accorge.
// Modi: "concerto" (normale) · "sfilata" (si cammina: ogni battuta c'è il PASSO, tasto 👣 o spazio) · "duello" (contro l'altoparlante:
// la barra del pubblico va da te sulle note prese e da lui sugli errori; vince chi ce l'ha a fine brano).
// Opzioni: start({ title, song: id | {…}, mode, venue, need (0..1, quota di precisione), bonus (0-3: finestre di tempo più larghe), mates: [{id, n}], tutorial, onDone({ a, b, win, data }) })
//   a = precisione in %, b = quota in %; data = { acc, stars, perfect, good, miss, combo }. Brani in window.__ritmo.SONGS (anche personalizzati).
// Comandi: pulsanti grandi sotto il campo, tocco sulla corsia, tastiera D F J K (o frecce) e spazio per il passo.
// Test: window.__ritmo.state.finish(win, acc) · .hit(lane) · .tick(sec) · .t · .notes · .judged · .phase · pulsante #rtGo. Richiede js/mini.js.
(function () {
  "use strict";
  if (window.__ritmo) return;
  const M = window.__mini || {}, W = M.W || 380, H = M.H || 230, esc = M.esc || ((s) => String(s == null ? "" : s));
  const LX = [104, 164, 224, 284], LW = 54, HITY = 192, TRAVEL = 1.7;
  const LANES = [
    { n: "Grancassa", icon: "🥁", col: "#ef4444", key: ["d", "arrowleft"] },
    { n: "Rullante", icon: "🪘", col: "#f59e0b", key: ["f", "arrowdown"] },
    { n: "Piatti", icon: "🔔", col: "#38bdf8", key: ["j", "arrowup"] },
    { n: "Ottoni", icon: "🎺", col: "#facc15", key: ["k", "arrowright"] }
  ];
  // brani: bpm, battute per misura, durata in battiti, accordi (gradi della scala, uno per misura), melodia degli ottoni
  // (gradi, «.» = pausa; si legge un simbolo per battito), densità delle percussioni, tonalità (Hz della tonica)
  const SONGS = {
    prova: { n: "Scala di prova", bpm: 96, meter: 4, beats: 32, chords: [0, 3, 4, 0], mel: "0 . 2 . 4 . 5 . 4 . 2 . 0 . . .", dens: 0.45, root: 233.08, venue: "sala" },
    ingresso: { n: "Marcia d'ingresso", bpm: 108, meter: 4, beats: 48, chords: [0, 3, 4, 0, 5, 3, 4, 0], mel: "0 2 4 . 4 5 4 2 0 . 2 4 5 . 4 . 7 . 5 4 2 . 4 . 2 . 1 . 0 . . .", dens: 0.55, root: 233.08, venue: "sala" },
    pioggia: { n: "San Rocco sotto la pioggia", bpm: 100, meter: 4, beats: 56, chords: [0, 4, 5, 3, 0, 4, 3, 0], mel: "4 . 4 5 7 . 5 4 2 . 2 4 5 . . . 4 . 4 5 7 . 9 7 5 . 4 2 0 . . .", dens: 0.6, root: 261.63, venue: "pioggia", mode: "sfilata" },
    derby: { n: "Inno del Derby", bpm: 124, meter: 4, beats: 64, chords: [0, 0, 3, 4, 0, 5, 3, 4], mel: "0 . 0 2 4 . 4 5 7 . 7 . 5 4 2 . 0 . 0 2 4 . 4 7 9 . 7 5 4 . . .", dens: 0.72, root: 261.63, venue: "stadio", mode: "duello" },
    ciro: { n: "Il Silenzio di Ciro", bpm: 76, meter: 3, beats: 42, chords: [5, 3, 0, 4, 5, 3, 4, 0], mel: "4 . . 5 4 2 0 . . 2 . 4 5 . . 4 . . 2 . 0 1 . . 0 . . . . .", dens: 0.35, root: 220.0, venue: "collina", minor: true },
    venezia: { n: "Gran Concerto di Venezia", bpm: 116, meter: 4, beats: 72, chords: [0, 3, 4, 0, 5, 3, 1, 4, 0, 3, 4, 0], mel: "0 2 4 5 7 . 5 4 2 4 5 . 4 . . . 7 . 9 7 5 4 2 . 4 5 7 9 7 . . . 9 . 7 5 4 . 2 4 5 . 4 2 0 . . .", dens: 0.75, root: 233.08, venue: "venezia" },
    rondine: { n: "La Marcia della Rondine", bpm: 128, meter: 4, beats: 80, chords: [0, 3, 4, 0, 5, 1, 4, 0, 3, 4, 5, 0], mel: "0 . 4 . 7 . 9 7 5 4 2 4 0 . . . 0 . 4 . 7 . 9 . 11 9 7 5 4 . . . 5 . 7 5 4 2 4 5 7 . 9 7 5 4 2 . 0 . . .", dens: 0.82, root: 233.08, venue: "venezia" },
    // per la Sala Giochi
    tarantella: { n: "Tarantella del Molo", bpm: 138, meter: 2, beats: 64, chords: [5, 5, 4, 4, 5, 3, 4, 5], mel: "5 4 3 4 5 . 5 . 4 3 2 3 4 . . . 5 4 3 4 5 . 7 . 5 4 3 2 1 . . .", dens: 0.7, root: 220.0, venue: "piazza", minor: true }
  };
  const MAJ = [0, 2, 4, 5, 7, 9, 11], MIN = [0, 2, 3, 5, 7, 8, 10];
  const freq = (root, deg, minor) => { const sc = minor ? MIN : MAJ, o = Math.floor(deg / 7), d = ((deg % 7) + 7) % 7; return root * Math.pow(2, (sc[d] + 12 * o) / 12); };
  let S = null, ui = null, raf = 0, tutC = null, AC = null, keyH = null;
  const now = () => performance.now() / 1000;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function diffK() { const c = window.__sagaCore && window.__sagaCore.cur; return (c && c.opts && c.opts.opp) || 1; }
  function muted() { try { const s = JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni") || "{}"); return !!(s.mute || s.sfx === false || s.sound === false); } catch (e) { return false; } }
  function audio() { if (muted()) return null; if (!AC) { try { const C = window.AudioContext || window.webkitAudioContext; if (C) AC = new C(); } catch (e) { AC = null; } } if (AC && AC.state === "suspended") { try { AC.resume(); } catch (e) {} } return AC; }
  // ------------------------------------------------------------ suoni (tutto generato)
  function osc(type, f, t, d, vol, slide, cut) {
    const c = AC; if (!c) return;
    try {
      const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + d);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      let out = o; if (cut) { const fl = c.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = cut; o.connect(fl); out = fl; }
      out.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.05);
    } catch (e) {}
  }
  function nz(t, d, vol, type, fq) {
    const c = AC; if (!c) return;
    try {
      const n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), x = b.getChannelData(0); for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; fl.type = type || "highpass"; fl.frequency.value = fq || 2000; g.gain.value = vol;
      s.connect(fl); fl.connect(g); g.connect(c.destination); s.start(t);
    } catch (e) {}
  }
  const SND = {
    0: (t) => osc("sine", 120, t, 0.28, 0.5, 0.35),
    1: (t) => { nz(t, 0.14, 0.32, "bandpass", 1800); osc("triangle", 190, t, 0.06, 0.12, 0.7); },
    2: (t) => nz(t, 0.55, 0.16, "highpass", 6000),
    3: (t, f) => { osc("sawtooth", f, t, 0.3, 0.12, 0, 1900); osc("square", f * 2, t, 0.16, 0.025, 0, 2600); },
    passo: (t) => { nz(t, 0.05, 0.12, "lowpass", 400); osc("sine", 70, t, 0.08, 0.18, 0.6); },
    stecca: (t) => osc("sawtooth", 155, t, 0.22, 0.08, 0.82, 900),
    click: (t, hi) => osc("square", hi ? 1500 : 1000, t, 0.04, 0.08)
  };
  // ------------------------------------------------------------ note del brano
  function rnd(seed) { let s = seed | 0 || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function build(song, k, practice) {
    const spb = 60 / song.bpm, mt = song.meter || 4, beats = practice ? 16 : song.beats, notes = [], r = rnd(song.bpm * 31 + beats), dens = clamp((song.dens || 0.5) * (k > 1.05 ? 1.12 : k < 0.95 ? 0.82 : 1), 0.2, 0.95);
    const mel = String(song.mel || "0").split(/\s+/), sf = song.mode === "sfilata";
    let mi = 0;
    const add = (b, lane, f) => notes.push({ t: b * spb, b, lane, f, st: 0 });
    for (let b = 0; b < beats; b++) {
      const m = b % mt, last = b >= beats - 2;
      if (sf && m === 0) add(b, 4);
      if (m === 0 && !sf) add(b, 0);
      else if (mt === 4 && m === 2 && r() < dens + 0.1) add(b, 0);
      if ((mt === 4 && (m === 1 || m === 3)) || (mt === 3 && m === 2) || (mt === 2 && m === 1)) { if (r() < dens + 0.15) add(b, 1); }
      if (dens > 0.7 && r() < 0.25 && !last) add(b + 0.5, 1);
      if (b % 8 === 7 || b === 0) add(b, 2);
      const d = mel[mi++ % mel.length]; if (d && d !== "." && !isNaN(+d)) add(b, 3, +d);
    }
    // non più di due note insieme (una con «Storia»), e almeno 0,2 s tra due note sulla stessa corsia
    notes.sort((a, b) => a.t - b.t || a.lane - b.lane);
    const maxTog = k < 0.95 ? 1 : 2, out = [], lastLane = {};
    for (const n of notes) {
      const same = out.filter((o) => Math.abs(o.t - n.t) < 0.02 && o.lane !== 4);
      if (n.lane !== 4 && same.length >= maxTog) { if (n.lane === 3 && same.length) { const drop = same.find((o) => o.lane !== 3); if (drop) { out.splice(out.indexOf(drop), 1); } else continue; } else continue; }
      if (lastLane[n.lane] != null && n.t - lastLane[n.lane] < 0.2) continue;
      lastLane[n.lane] = n.t; out.push(n);
    }
    return { notes: out, spb, mt, len: beats * spb };
  }
  // ------------------------------------------------------------ stato
  function songOf(o) { const s = typeof o.song === "string" ? SONGS[o.song] : o.song; return s || SONGS.ingresso; }
  function mk(o, practice) {
    const song = practice ? SONGS.prova : songOf(o), k = diffK(), B = build(song, k, practice), mode = practice ? "concerto" : (o.mode || song.mode || "concerto");
    const need = practice ? 0 : clamp(o.need != null ? o.need : 0.6, 0.2, 0.95) - (k < 0.95 ? 0.08 : k > 1.05 ? -0.04 : 0);
    return { o, song, mode, venue: o.venue || song.venue || "piazza", notes: B.notes, spb: B.spb, mt: B.mt, len: B.len, need, ws: (k < 0.95 ? 1.3 : k > 1.05 ? 0.85 : 1) * (1 + 0.06 * clamp(o.bonus | 0, 0, 3)), practice: !!practice,
      t: -4 * B.spb - 0.6, phase: "count", perfect: 0, good: 0, miss: 0, stecche: 0, combo: 0, best: 0, crowd: 50, morale: 60, judged: 0, fl: [0, 0, 0, 0, 0], txt: [], f: 0, lastBeat: -99, sched: -4, win: false, ended: false,
      mates: (o.mates || []).slice(0, 4).map((m) => ({ id: m.id, n: m.n, img: M.img && M.img(m.id) })) };
  }
  function acc() { const tot = S.notes.length || 1; return clamp((S.perfect + S.good * 0.6 - S.stecche * 0.15) / tot, 0, 1); }
  function stars(a) { return a >= 0.9 ? 3 : a >= 0.75 ? 2 : a >= 0.6 ? 1 : 0; }
  function say(t, c) { S.txt.push({ t, c, y: HITY - 24, a: 50 }); if (S.txt.length > 4) S.txt.shift(); }
  // ------------------------------------------------------------ ascolto e giudizio
  function judge(n, dt) {
    const w = S.ws, ad = Math.abs(dt);
    if (ad <= 0.075 * w) { n.st = 2; S.perfect++; say("PERFETTO", "#fde047"); }
    else { n.st = 1; S.good++; say(dt < 0 ? "PRESTO" : "TARDI", "#a7f3d0"); }
    S.judged++; S.combo++; S.best = Math.max(S.best, S.combo); S.morale = clamp(S.morale + (n.st === 2 ? 2 : 1), 0, 100); if (S.mode === "duello") S.crowd = clamp(S.crowd + (n.st === 2 ? 2.2 : 1.2), 0, 100);
    const c = AC; if (c) { const at = c.currentTime + 0.005; if (n.lane === 4) SND.passo(at); else SND[n.lane](at, freq(S.song.root * 2, n.f || 0, S.song.minor)); }
  }
  function miss(n) {
    n.st = -1; S.miss++; S.judged++; S.combo = 0; S.morale = clamp(S.morale - 4, 0, 100); if (S.mode === "duello") S.crowd = clamp(S.crowd - 3.2, 0, 100); say("MANCATA", "#fca5a5");
  }
  function hit(lane) {
    if (!S || S.phase !== "play") return false;
    S.fl[lane] = 10; const t = S.t; let best = null, bd = 0.17 * S.ws;
    S.notes.forEach((n) => { if (n.st || n.lane !== lane) return; const d = Math.abs(n.t - t); if (d < bd) { bd = d; best = n; } });
    if (best) { judge(best, t - best.t); return true; }
    S.stecche++; S.combo = 0; S.morale = clamp(S.morale - 1.5, 0, 100); if (S.mode === "duello") S.crowd = clamp(S.crowd - 0.8, 0, 100); say("STECCA", "#fb923c");
    if (AC) SND.stecca(AC.currentTime + 0.005); return false;
  }
  // ------------------------------------------------------------ tempo
  function schedule() {
    const c = AC; if (!c) return;
    // base (tuba + accordi) e conteggio: si programma un battito alla volta, poco prima che arrivi
    const spb = S.spb, look = 0.15;
    while (S.sched * spb - S.t < look + 4 * spb && S.sched * spb < S.len + 0.01) {
      const b = S.sched, at = c.currentTime + (b * spb - S.t);
      if (at >= c.currentTime - 0.01) {
        const m = ((b % S.mt) + S.mt) % S.mt, bar = Math.floor(b / S.mt), ch = S.song.chords[((bar % S.song.chords.length) + S.song.chords.length) % S.song.chords.length], R = S.song.root;
        if (b < 0) SND.click(at, m === 0);
        else if (m === 0 || (S.mt === 4 && m === 2)) osc("triangle", freq(R / 2, ch, S.song.minor), at, spb * 0.8, 0.16, 0, 700);
        else [0, 2, 4].forEach((d) => osc("square", freq(R, ch + d, S.song.minor), at, spb * 0.25, 0.018, 0, 1400));
      }
      S.sched++;
    }
  }
  function step(dt) {
    if (!S || S.ended) return;
    S.t += dt; S.f++;
    if (S.phase === "count" && S.t >= 0) { S.phase = "play"; say("VIA!", "#fde047"); }
    if (S.phase === "play" || S.phase === "count") {
      schedule();
      S.notes.forEach((n) => { if (!n.st && S.t - n.t > 0.18 * S.ws) miss(n); });
      const b = Math.floor(S.t / S.spb); if (b !== S.lastBeat) S.lastBeat = b;
      if (S.phase === "play" && S.t > S.len + 0.6) end();
    }
    S.fl = S.fl.map((v) => Math.max(0, v - 1));
    S.txt.forEach((x) => { x.y -= 0.5; x.a--; }); S.txt = S.txt.filter((x) => x.a > 0);
  }
  function end(force, forceAcc) {
    if (!S || S.ended) return;
    if (force != null) {
      const n = S.notes.length, k = forceAcc != null ? Math.round(n * clamp(forceAcc, 0, 1)) : force ? n : 0;
      S.notes.forEach((x, i) => { x.st = i < k ? 2 : -1; }); S.perfect = k; S.good = 0; S.miss = n - k; S.stecche = 0; S.judged = n;
      if (S.mode === "duello") S.crowd = force ? 70 : 30;
    }
    const a = acc(); S.ended = true; S.phase = "end"; S.acc = a;
    S.win = force != null ? !!force : (a >= S.need && (S.mode !== "duello" || S.crowd >= 50));
    if (S.practice) S.win = true;
    hud(); controls(); lg();
  }
  // ------------------------------------------------------------ disegno
  function venue(g, v, f, st) {
    const VG = (y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    if (v === "sala") { VG(0, H, "#3b2414", "#1c100a"); g.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 22) R(x, 0, 1, H, "rgba(0,0,0,.25)"); R(0, 150, W, 80, "#5b3a22"); for (let x = 0; x < W; x += 30) R(x, 150, 1, 80, "rgba(0,0,0,.3)"); R(20, 30, 50, 34, "#1e293b"); R(22, 32, 46, 30, "#e2e8f0"); for (let i = 0; i < 5; i++) R(26, 36 + i * 5, 38, 1, "#64748b"); }
    else if (v === "pioggia") { VG(0, H, "#1e293b", "#334155"); g.fillRect(0, 0, W, H); for (let i = 0; i < 8; i++) { const x = ((i * 70 - f * 0.6) % (W + 70) + W + 70) % (W + 70) - 70; R(x, 40, 50, 110, i % 2 ? "#475569" : "#3f4c5f"); for (let j = 0; j < 3; j++) R(x + 8 + j * 14, 60, 8, 12, `rgba(253,224,71,${0.3 + 0.2 * Math.sin(f / 20 + i + j)})`); } R(0, 150, W, 80, "#1f2937"); g.strokeStyle = "rgba(186,230,253,.35)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 50; i++) { const x = (i * 37 + f * 2) % W, y = (i * 53 + f * 6) % H; g.moveTo(x, y); g.lineTo(x - 2, y + 8); } g.stroke(); }
    else if (v === "stadio") { VG(0, H, "#0b1530", "#1e3a5f"); g.fillRect(0, 0, W, H); for (let i = 0; i < 3; i++) { R(30 + i * 140, 6, 6, 30, "#64748b"); g.fillStyle = "rgba(255,255,220,.85)"; g.fillRect(24 + i * 140, 2, 18, 6); } R(0, 60, W, 70, "#172554"); for (let i = 0; i < 140; i++) R((i * 29) % W, 64 + (i * 13) % 60, 3, 3, ["#ef4444", "#facc15", "#e2e8f0", "#1e40af"][i % 4]); R(0, 130, W, 100, "#166534"); for (let x = 0; x < W; x += 40) R(x, 130, 20, 100, "rgba(255,255,255,.05)"); }
    else if (v === "collina") { VG(0, 150, "#7c2d12", "#fdba74"); g.fillRect(0, 0, W, 150); g.fillStyle = "#fde68a"; g.beginPath(); g.arc(300, 110, 22, 0, 7); g.fill(); g.fillStyle = "#3f2d22"; g.beginPath(); g.moveTo(0, 150); for (let x = 0; x <= W; x += 10) g.lineTo(x, 130 - Math.sin(x / 50) * 14); g.lineTo(W, H); g.lineTo(0, H); g.fill(); for (let i = 0; i < 6; i++) { R(30 + i * 60, 118 - Math.sin((30 + i * 60) / 50) * 14, 3, 14, "#1c1917"); R(26 + i * 60, 122 - Math.sin((30 + i * 60) / 50) * 14, 11, 3, "#1c1917"); } }
    else if (v === "venezia") { VG(0, 150, "#1e1b4b", "#7c3aed"); g.fillRect(0, 0, W, 150); R(0, 30, W, 120, "#4c1d95"); for (let i = 0; i < 9; i++) { R(i * 44, 36, 34, 100, "#5b21b6"); g.fillStyle = `rgba(250,204,21,${0.4 + 0.2 * Math.sin(f / 15 + i)})`; g.beginPath(); g.arc(i * 44 + 17, 50, 9, Math.PI, 0); g.fill(); } R(0, 136, W, 14, "#facc15"); R(0, 150, W, 80, "#7f1d1d"); for (let x = 0; x < W; x += 16) R(x, 150, 8, 80, "rgba(0,0,0,.12)"); }
    else { VG(0, 150, "#0f172a", "#334155"); g.fillRect(0, 0, W, 150); for (let i = 0; i < 6; i++) { R(i * 66, 50 - (i % 2) * 14, 56, 100, "#475569"); for (let j = 0; j < 3; j++) R(i * 66 + 8 + j * 16, 70 - (i % 2) * 14, 8, 12, `rgba(253,224,71,${0.35 + 0.25 * Math.sin(f / 25 + i * 2 + j)})`); } R(0, 150, W, 80, "#57534e"); for (let x = 0; x < W; x += 12) for (let y = 150; y < H; y += 8) R(x + ((y / 8) % 2) * 6, y, 11, 7, "rgba(0,0,0,.12)"); for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(250,204,21,${0.5 + 0.4 * Math.sin(f / 10 + i)})`; g.beginPath(); g.arc(i * 34 + 10, 18 + Math.sin(i) * 5, 2, 0, 7); g.fill(); } }
    // le corsie: vetro scuro con il bordo del colore dello strumento
    g.fillStyle = "rgba(2,6,23,.55)"; g.fillRect(LX[0] - LW / 2 - 4, 0, LX[3] - LX[0] + LW + 8, H);
    LANES.forEach((L, i) => { const x = LX[i] - LW / 2; g.fillStyle = `rgba(255,255,255,${0.03 + (st.fl[i] || 0) * 0.02})`; g.fillRect(x, 0, LW, H); g.fillStyle = L.col; g.globalAlpha = 0.3; g.fillRect(x, 0, 1, H); g.fillRect(x + LW - 1, 0, 1, H); g.globalAlpha = 1; });
    // linee di battuta che scendono col tempo
    if (st.spb) for (let b = Math.floor(st.t / st.spb); b < st.t / st.spb + TRAVEL / st.spb + 1; b++) { const y = HITY - ((b * st.spb - st.t) / TRAVEL) * (HITY + 10); if (y > -2 && y < HITY) { g.fillStyle = b % st.mt === 0 ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.06)"; g.fillRect(LX[0] - LW / 2, y, LX[3] - LX[0] + LW, 1); } }
  }
  function conductor(g, st, f) {
    // il maestro a sinistra: la bacchetta batte il tempo
    const ph = st.spb ? ((st.t / st.spb) % 1 + 1) % 1 : 0, by = Math.sin(ph * Math.PI) * 10;
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(38, 206, 18, 5, 0, 0, 7); g.fill();
    g.fillStyle = "#111827"; g.fillRect(28, 150, 20, 54); g.fillStyle = "#f1f5f9"; g.fillRect(34, 152, 8, 18); g.fillStyle = "#b91c1c"; g.fillRect(36, 152, 4, 4);
    g.fillStyle = "#e8c4a0"; g.beginPath(); g.arc(38, 140, 10, 0, 7); g.fill(); g.fillStyle = "#e5e7eb"; g.beginPath(); g.arc(38, 134, 10, Math.PI, 0); g.fill(); g.fillRect(28, 133, 4, 8); g.fillRect(44, 133, 4, 8);
    g.strokeStyle = "#111827"; g.lineWidth = 4; g.beginPath(); g.moveTo(46, 158); g.lineTo(58, 150 - by); g.stroke(); g.strokeStyle = "#f8fafc"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(58, 150 - by); g.lineTo(70, 136 - by * 1.6); g.stroke();
    if (ph < 0.12 && st.phase !== "end") { g.fillStyle = "rgba(253,224,71,.6)"; g.beginPath(); g.arc(70, 136 - by * 1.6, 4, 0, 7); g.fill(); }
    // i compagni della banda, piccoli, sotto al maestro
    st.mates.forEach((m, i) => { if (M.man) M.man(g, 14 + i * 16, 222 - (i % 2) * 4, { col: "#7f1d1d", ring: "#facc15", img: m.img, s: 0.55 }); });
    g.font = "700 7px system-ui"; g.fillStyle = "#e2e8f0"; g.textAlign = "center"; g.fillText(st.mode === "sfilata" ? "AVANTI, MARCH!" : "IL MAESTRO", 38, 124);
  }
  function sidebar(g, st, f) {
    const x0 = 318;
    g.fillStyle = "rgba(2,6,23,.6)"; g.fillRect(x0, 8, 56, 150);
    g.font = "800 7px system-ui"; g.textAlign = "center"; g.fillStyle = "#e2e8f0";
    if (st.mode === "duello") {
      // tiro alla fune col pubblico: in alto l'altoparlante, in basso la banda
      g.fillText("📢 CASSA", x0 + 28, 18); g.fillText("🥁 BANDA", x0 + 28, 154);
      g.fillStyle = "#334155"; g.fillRect(x0 + 22, 24, 12, 120); const y = 24 + 120 * (1 - st.crowd / 100);
      g.fillStyle = "#64748b"; g.fillRect(x0 + 22, 24, 12, y - 24); g.fillStyle = st.crowd >= 50 ? "#22c55e" : "#ef4444"; g.fillRect(x0 + 22, y, 12, 144 - y); g.fillStyle = "#fff"; g.fillRect(x0 + 18, 83, 20, 1);
    } else {
      g.fillText("PIAZZA", x0 + 28, 18); g.fillStyle = "#334155"; g.fillRect(x0 + 22, 24, 12, 120); const y = 24 + 120 * (1 - st.morale / 100);
      g.fillStyle = st.morale > 60 ? "#22c55e" : st.morale > 30 ? "#facc15" : "#ef4444"; g.fillRect(x0 + 22, y, 12, 144 - y);
      for (let i = 0; i < 5; i++) { const on = st.morale > 20 + i * 16; g.font = "10px serif"; g.fillText(on ? "🙌" : "😐", x0 + 10 + (i % 2) * 36, 40 + i * 22 + (on ? Math.sin(f / 6 + i) * 2 : 0)); }
    }
    g.font = "800 8px system-ui"; g.fillStyle = "#facc15"; g.fillText("×" + st.combo, x0 + 28, 172); g.fillStyle = "#e2e8f0"; g.font = "700 7px system-ui"; g.fillText("COMBO", x0 + 28, 181);
  }
  function scene(g, st, f) {
    g.setTransform(M.SS || 2, 0, 0, M.SS || 2, 0, 0); g.clearRect(0, 0, W, H); venue(g, st.venue, f, st);
    // linea di arrivo con i cerchi degli strumenti
    g.fillStyle = "rgba(255,255,255,.75)"; g.fillRect(LX[0] - LW / 2, HITY, LX[3] - LX[0] + LW, 2);
    LANES.forEach((L, i) => { const fl = st.fl[i] || 0; g.strokeStyle = L.col; g.lineWidth = 2 + fl * 0.3; g.beginPath(); g.arc(LX[i], HITY, 15 + fl * 0.6, 0, 7); g.stroke(); g.font = "13px serif"; g.textAlign = "center"; g.fillStyle = "#fff"; g.globalAlpha = 0.55 + fl * 0.04; g.fillText(L.icon, LX[i], HITY + 5); g.globalAlpha = 1; });
    // note che scendono
    st.notes.forEach((n) => {
      if (n.st === 2 || n.st === 1) return; const y = HITY - ((n.t - st.t) / TRAVEL) * (HITY + 10); if (y < -14 || y > H + 10) return;
      if (n.lane === 4) { g.fillStyle = n.st === -1 ? "rgba(120,113,108,.5)" : "rgba(250,204,21,.85)"; g.fillRect(LX[0] - LW / 2 + 2, y - 4, LX[3] - LX[0] + LW - 4, 8); g.font = "8px serif"; g.textAlign = "center"; g.fillStyle = "#1c1917"; g.fillText("👣 PASSO 👣", (LX[0] + LX[3]) / 2, y + 3); return; }
      const L = LANES[n.lane]; g.fillStyle = n.st === -1 ? "#57534e" : L.col; g.beginPath(); g.arc(LX[n.lane], y, 12, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 1.5; g.stroke();
      g.font = "11px serif"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText(L.icon, LX[n.lane], y + 4);
    });
    conductor(g, st, f); sidebar(g, st, f);
    st.txt.forEach((x) => { g.globalAlpha = Math.min(1, x.a / 20); g.font = "900 12px system-ui"; g.textAlign = "center"; g.fillStyle = x.c; g.fillText(x.t, (LX[0] + LX[3]) / 2, x.y); g.globalAlpha = 1; });
    if (st.phase === "count") { const n = Math.ceil(-st.t / st.spb); if (n > 0 && n <= 4) { g.font = "900 40px system-ui"; g.textAlign = "center"; g.fillStyle = "rgba(253,224,71,.9)"; g.fillText(String(n), (LX[0] + LX[3]) / 2, 110); } }
    // avanzamento del brano
    const p = st.len ? clamp(st.t / st.len, 0, 1) : 0; g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(0, 0, W, 4); g.fillStyle = "#facc15"; g.fillRect(0, 0, W * p, 4);
    if (st.phase === "end") { g.fillStyle = "rgba(2,6,23,.72)"; g.fillRect(0, 0, W, H); g.textAlign = "center"; g.font = "900 22px system-ui"; g.fillStyle = st.win ? "#fde047" : "#fca5a5"; g.fillText(st.practice ? "PROVA FINITA" : st.win ? "APPLAUSI!" : "FISCHI…", W / 2, 80); g.font = "800 14px system-ui"; g.fillStyle = "#fff"; g.fillText(`Precisione ${Math.round((st.acc || 0) * 100)}%  ·  ${"★".repeat(stars(st.acc || 0))}${"☆".repeat(3 - stars(st.acc || 0))}`, W / 2, 108); g.font = "700 11px system-ui"; g.fillStyle = "#cbd5e1"; g.fillText(`Perfette ${st.perfect} · Buone ${st.good} · Mancate ${st.miss} · Combo migliore ${st.best}`, W / 2, 128); if (!st.practice) g.fillText(`Quota per convincere la piazza: ${Math.round(st.need * 100)}%${st.mode === "duello" ? " e pubblico dalla tua parte" : ""}`, W / 2, 146); }
  }
  // ------------------------------------------------------------ interfaccia
  function hud() { if (!ui) return; const a = acc(); ui.hud.innerHTML = `<b>${esc(S.song.n)}</b><span>${S.mode === "sfilata" ? "Sfilata" : S.mode === "duello" ? "Duello con l'altoparlante" : "Concerto"}</span><span>Precisione ${Math.round(a * 100)}%</span><span>Quota ${Math.round(S.need * 100)}%</span>`; }
  function controls() {
    if (!ui) return;
    if (S.phase === "end") { ui.bt.innerHTML = S.practice ? `<button class="go" id="rtRe">↺ Riprova</button><button class="go" id="rtGo2">▶ Suona davvero</button>` : `<button class="go" id="rtGo" style="flex-basis:100%">Fine ▸</button>`; }
    else ui.bt.innerHTML = LANES.map((L, i) => `<button data-l="${i}" style="border-color:${L.col}">${L.icon}<small>${L.n}</small></button>`).join("") + (S.mode === "sfilata" ? `<button data-l="4" style="border-color:#facc15;flex-basis:100%;min-height:44px">👣 Passo<small>a ogni battuta gialla</small></button>` : "");
    ui.bt.querySelectorAll("button[data-l]").forEach((b) => b.addEventListener("pointerdown", (ev) => { ev.preventDefault(); audio(); hit(+b.dataset.l); }));
    const q = (id) => ui.bt.querySelector(id); if (q("#rtGo")) q("#rtGo").onclick = close; if (q("#rtRe")) q("#rtRe").onclick = () => restart(true); if (q("#rtGo2")) q("#rtGo2").onclick = () => restart(false);
  }
  function lg() {
    if (!ui) return;
    ui.lg.innerHTML = S.phase === "end" ? (S.practice ? "Prova finita: nulla conta. Riprova o suona davvero." : S.win ? "La piazza batte le mani a tempo. Anche il maestro, quasi." : "Troppi buchi nel brano: la gente si guarda intorno. Si può riprovare.")
      : S.mode === "sfilata" ? "Tocca lo strumento quando la nota arriva sul cerchio. Le <b>barre gialle</b> sono il passo: tocca <b>👣 Passo</b> (o spazio) per marciare a tempo."
      : S.mode === "duello" ? "Ogni nota presa porta il pubblico dalla tua parte; ogni errore lo regala all'altoparlante. A fine brano vince chi ha la barra."
      : "Tocca lo strumento quando la nota arriva sul cerchio (o tocca la corsia; tastiera D F J K). La base va da sola: grancassa, rullante, piatti e <b>la melodia</b> suonano solo se le prendi tu.";
  }
  let lastT = 0;
  function loop() { if (!S) return; raf = requestAnimationFrame(loop); const n = now(), dt = clamp(n - lastT, 0, 0.05); lastT = n; if (!(tutC && tutC.open)) step(dt); scene(ui.g, S, S.f); if (S.f % 12 === 0 && S.phase !== "end") hud(); }
  function restart(practice) { const o = S.o; S = mk(o, practice); lastT = now(); hud(); controls(); lg(); }
  function close() {
    cancelAnimationFrame(raf); raf = 0; const st = S, o = st.o; if (keyH) { document.removeEventListener("keydown", keyH, true); keyH = null; } ui.root.remove(); ui = null; S = null; window.__musHold = false;
    try { window.__sagaCore && window.__sagaCore.endMatch(); } catch (e) {}
    const a = st.acc || 0; o.onDone && o.onDone({ a: Math.round(a * 100), b: Math.round(st.need * 100), win: !!st.win, quit: false, data: { acc: a, stars: stars(a), perfect: st.perfect, good: st.good, miss: st.miss, combo: st.best, crowd: Math.round(st.crowd) } });
  }
  // ------------------------------------------------------------ spiegazione
  function demo(mode, f) {
    const st = mk({ song: mode === "sfilata" ? "pioggia" : mode === "duello" ? "derby" : "ingresso", mode }, false); st.phase = "play"; st.t = 2 + ((f / 60) % 3); st.crowd = 58; st.morale = 70; st.combo = 12;
    st.notes.forEach((n) => { if (n.t < st.t - 0.05) n.st = 2; }); return st;
  }
  const PAGES = [
    { t: "Suona quando arriva", p: "Le note scendono su quattro corsie: <b>🥁 grancassa</b>, <b>🪘 rullante</b>, <b>🔔 piatti</b> e <b>🎺 ottoni</b>. Tocca il pulsante (o la corsia) quando la nota è sul cerchio. Gli ottoni suonano la melodia: se li manchi, il brano resta muto.", draw: (g, f) => scene(g, demo("concerto", f), f) },
    { t: "Sfilate e passo", p: "Nelle sfilate la banda cammina: le <b>barre gialle</b> sono il passo, si prendono con <b>👣 Passo</b> (o spazio). Il maestro a sinistra batte il tempo con la bacchetta: guardalo quando ti perdi.", draw: (g, f) => scene(g, demo("sfilata", f), f) },
    { t: "La piazza ascolta", p: "Sulla destra c'è la piazza: si scalda se suoni bene. Contro l'altoparlante è un tiro alla fune col pubblico. Per convincere serve una <b>quota di precisione</b>: la vedi in alto. Toccare a vuoto è una stecca e costa un po'.", draw: (g, f) => scene(g, demo("duello", f), f) }
  ];
  function start(o) {
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = M.shell("rtOv", "🥁 " + (o.title || "Ritmo"), "#facc15"); ui.root.style.background = "#140a06";
    S = mk(o, false); tutC = null; lastT = now(); ui.cv.style.height = "auto"; ui.cv.style.flex = "none"; window.__musHold = true;
    ui.cv.addEventListener("pointerdown", (ev) => { const r = ui.cv.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * W; audio(); let best = -1, bd = LW / 2 + 4; LX.forEach((lx, i) => { if (Math.abs(lx - x) < bd) { bd = Math.abs(lx - x); best = i; } }); if (best >= 0) hit(best); else if (S && S.mode === "sfilata") hit(4); });
    keyH = (ev) => { if (!S || S.phase !== "play" || (tutC && tutC.open)) return; const k = String(ev.key || "").toLowerCase(); if (k === " " && S.mode === "sfilata") { ev.preventDefault(); audio(); hit(4); return; } const i = LANES.findIndex((L) => L.key.includes(k)); if (i >= 0) { ev.preventDefault(); audio(); hit(i); } };
    document.addEventListener("keydown", keyH, true);
    const openTut = () => { if (S && S.phase !== "end" && !(tutC && tutC.open)) { tutC = M.tut({ root: ui.root, key: "ritmo", pages: PAGES, onClose: (pr) => { tutC = null; audio(); if (pr) restart(true); else restart(false); } }); } };
    ui.help.onclick = openTut;
    window.__ritmo.state = {
      get t() { return S ? S.t : 0; }, get phase() { return S && S.phase; }, get notes() { return S ? S.notes.length : 0; }, get judged() { return S ? S.judged : 0; }, get perfect() { return S ? S.perfect : 0; },
      get combo() { return S ? S.combo : 0; }, get crowd() { return S ? S.crowd : 0; }, get mode() { return S && S.mode; }, get acc() { return S ? acc() : 0; }, tut: () => !!(tutC && tutC.open),
      next: () => { if (!S) return null; const n = S.notes.find((x) => !x.st); return n ? { t: n.t, lane: n.lane } : null; },
      hit, tick: (sec) => { if (!S) return; let k = Math.round((sec || 0) / 0.016); while (k-- > 0) step(0.016); },
      warp: (t) => { if (S) { S.t = t; if (t >= 0) S.phase = "play"; } },
      finish: (win, a) => { if (tutC) { tutC = null; const el = ui && ui.root.querySelector(".tut"); if (el) el.remove(); ui && ui.root.classList.remove("tutOn"); } end(!!win, a); }
    };
    hud(); controls(); lg(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen("ritmo"))) openTut();
    return true;
  }
  window.__ritmo = { start, SONGS, LANES, build, state: null };
})();
