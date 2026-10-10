// ============================================================================
// CRONACHE DEL VUOTO DI SALE · LE MEMORIE SOLIDIFICATE
// Saga Sci-Fi Western Cosmico per il Tuo Campione
// Ambientazione: pianeta di sale e cristalli, carovane aeree, dune di memoria
// Motore 2D Camminabile HD con Contratti di Sale, Campi Mobili e Duelli di Memoria
// ============================================================================
(function () {
  "use strict";

  if (window.__vuotoSaleStoryLoaded) return;
  window.__vuotoSaleStoryLoaded = true;

  const KEY = "ali-di-rondine.vuoto-sale";
  let tries = 0, api = null, EXIT = null;

  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&", "<": "<", ">": ">", '"': """ }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});

  let actx = null;
  function getAudioCtx() {
    if (!actx && (window.AudioContext || window.webkitAudioContext)) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (actx && actx.state === "suspended") actx.resume();
    return actx;
  }
  function sfxSaltCrack() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
      g.gain.setValueAtTime(0.4, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.4);
    } catch (e) {}
  }
  function sfxMemoryWhisper() {
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [220, 330, 440].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, now + i * 0.08);
        g.gain.setValueAtTime(0.08, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + i * 0.08); o.stop(now + i * 0.08 + 0.6);
      });
    } catch (e) {}
  }

  function mem() { try { return obj(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return {}; } }
  function memSet(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function hero() { return safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null); }

  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    const h = hero();
    if (!h) {
      return api.scene("sale_dune", "voce",
        "<b>Cronache del Vuoto di Sale</b><br>Questa saga richiede il tuo Campione.",
        [
          { label: "Crea il tuo Campione", cls: "hot", fn: () => { if (window.heroEditor) window.heroEditor(openMain); } },
          { label: "Torna", fn: leave }
        ], "Vuoto di Sale");
    }
    const m = mem();
    const status = m.ch1done ? "Capitolo 1 concluso" : "Capitolo 1 in corso";
    api.scene("sale_citta", "voce",
      `<b>🏜️ Cronache del Vuoto di Sale</b><br>${esc(h.name)} · n. ${esc(h.num)}<br><span style="color:#fbbf24">Il sale ricorda ciò che tu hai dimenticato.</span><br><br>Capitolo 1 · La Carovana del Sale Cieco<br><span style="color:var(--dim)">${status}</span>`,
      [
        { label: m.ch1done ? "Rigioca il Capitolo 1" : "Inizia / Continua", cls: "hot", fn: startChapter1 },
        { label: "Diario del Sale", sub: `Frammenti: ${m.memories || 0}`, fn: showDiary },
        { label: "◂ Torna alle Modalità", fn: leave }
      ], "Vuoto di Sale");
  }

  function leave() {
    const b = EXIT || window.title;
    EXIT = null;
    if (typeof b === "function") b();
  }

  function showDiary() {
    const m = mem();
    api.scene("sale_diario", "voce",
      `<b>Diario del Sale</b><br>Frammenti di memoria raccolti: ${m.memories || 0}<br><br>Il sale non mente. Ogni cristallo è una vita che qualcuno ha già vissuto.`,
      [{ label: "Indietro", fn: openMain }]);
  }

  function startChapter1() {
    sfxSaltCrack();
    api.scene("sale_dune", "guidacarovana",
      "Il vento porta il tuo nome scritto su un cristallo che non ricordi di aver toccato. Le dune si spostano sotto i piedi della carovana aerea. Non sei il primo Campione ad arrivare qui.",
      [
        { label: "Chiedi della Città di Cristallo", fn: askCity },
        { label: "Osserva le dune", fn: observeDunes },
        { label: "Chiedi chi sei", fn: askWho }
      ], "Dune di Sale Bianco");
  }

  function askCity() {
    api.scene("sale_dune", "guidacarovana",
      "La Città di Cristallo è a est, oltre la Miniera delle Memorie. Ma il sale rivela solo a chi è disposto a perdere qualcosa. A volte un ricordo. A volte un nome.",
      [{ label: "Parto subito", cls: "hot", fn: enterWorld }]);
  }

  function observeDunes() {
    sfxMemoryWhisper();
    api.scene("sale_dune", "voce",
      "Una duna si apre come una ferita. Dentro, un frammento di cristallo mostra una partita di calcio giocata su un campo di sale che non esiste più. Tu sei in campo. Stai tirando. Ma non ricordi quella partita. Il pubblico sono statue di sale.",
      [
        { label: "Raccogli il frammento", cls: "hot", fn: () => { const m = mem(); m.memories = (m.memories || 0) + 1; memSet(m); enterWorld(); } },
        { label: "Lascialo", fn: enterWorld }
      ]);
  }

  function askWho() {
    api.scene("sale_dune", "vecchio_sale",
      "Il sale ricorda chi sei anche se tu non lo fai. Qualcuno ha già firmato un Contratto con il tuo nome. Forse sei tu, in un altro strato di dune. Forse sei solo l'eco.",
      [{ label: "Continua", fn: enterWorld }]);
  }

  function enterWorld() {
    api.scene("sale_miniera", "minatore_cieco",
      "Le memorie solidificate... le sento. Alcune sono tue. Alcune sono di qualcuno che ti assomiglia troppo. La Signora dei Contratti ti aspetta nella Città. Non fidarti del sale quando ti parla con la tua voce.",
      [
        { label: "Vai alla Città di Cristallo", cls: "hot", fn: arriveCity },
        { label: "Chiedi delle partite", fn: () => {
          api.scene("sale_miniera", "minatore_cieco",
            "Qui le partite si giocano su campi che si muovono. Chi perde lascia un pezzo di memoria nel sale. Alcuni giocatori non ricordano più perché hanno iniziato.",
            [{ label: "Continua", fn: arriveCity }]);
        }}
      ], "Miniera delle Memorie");
  }

  function arriveCity() {
    sfxMemoryWhisper();
    api.scene("sale_citta", "signora_contratti",
      "Sei arrivato, Campione. Il Contratto di Memoria è pronto. Firmando, il sale ti mostrerà la verità: qualcuno ha già vissuto questa storia. Forse sei tu. Forse sei l'ultimo.",
      [
        { label: "Firma il Contratto", cls: "hot", fn: signContract },
        { label: "Chiedi il prezzo", fn: () => {
          api.scene("sale_citta", "signora_contratti",
            "Il prezzo è sempre lo stesso: un ricordo che credevi tuo. Dopo la firma, saprai se era davvero tuo.",
            [{ label: "Firma comunque", cls: "hot", fn: signContract }]);
        }}
      ], "Città di Cristallo");
  }

  function signContract() {
    const m = mem();
    m.ch1done = true;
    m.memories = (m.memories || 0) + 1;
    memSet(m);
    sfxSaltCrack();
    api.scene("sale_citta", "voce",
      `<b>Contratto firmato.</b><br>Il cristallo si frantuma. Una voce (la tua?) dice: «Non sei il primo. Non sarai l'ultimo. Il sale ricorda tutto.»<br><br>Per un istante vedi te stesso, in un altro tempo, che firma lo stesso contratto e poi dimentica di averlo fatto.<br><br><b>Capitolo 1 concluso.</b> Il Vuoto di Sale ti aspetta.`,
      [{ label: "Torna al menu", fn: openMain }]);
  }

  function init() {
    const a = window.__borgoApi;
    if (!a || !a.scene) {
      if (++tries < 200) setTimeout(init, 150);
      return;
    }
    api = a;
    if (a.CAST) {
      a.CAST.guidacarovana = a.CAST.guidacarovana || { name: "Guida della Carovana", tag: "gold", skin: "#c4a484", eye: "#3a2a1a", bg: ["#92400e", "#fde68a"] };
      a.CAST.vecchio_sale = a.CAST.vecchio_sale || { name: "Vecchio del Sale", tag: "dim", skin: "#d6d3d1", eye: "#1e293b" };
      a.CAST.minatore_cieco = a.CAST.minatore_cieco || { name: "Minatore Cieco", tag: "dim", skin: "#a8a29e", eye: "#57534e" };
      a.CAST.signora_contratti = a.CAST.signora_contratti || { name: "Signora dei Contratti", tag: "hot", skin: "#f5d0a9", eye: "#7c2d12" };
    }
  }

  window.__vuotoSaleStory = {
    version: 1,
    open: openMain,
    menuEntry(back) {
      const h = hero();
      const m = mem();
      return {
        label: "🏜️ Cronache del Vuoto di Sale",
        cls: "hot",
        fn: () => openMain({ onExit: back }),
        sub: h
          ? `${h.name} · ${m.ch1done ? "Capitolo 1 concluso" : "Capitolo 1 in corso"} · Il sale ricorda`
          : "Crea il tuo Campione · Sci-fi western delle memorie solidificate"
      };
    },
    info() { const m = mem(); return { ch1: !!m.ch1done, memories: m.memories || 0 }; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
