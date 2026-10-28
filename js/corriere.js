// js/corriere.js - «IL CORRIERE DEL PALLONE» (saga 3D su js/citta3d.js): corriere in bici in una città aperta di 6 quartieri, giorno e notte, consegne con orari.
// Capitolo 1: «Il Pacco Senza Indirizzo». I capitoli 2-4 si aggiungono in js/corriere-c2.js ... con window.__corriereCh.
(function () {
  "use strict";
  if (!window.__citta3d) return;
  const P = (ground, road, walk, bld, tree, accent) => ({ ground, road, walk, bld, tree, accent });
  const cfg = {
    id: "corriere", key: "ali-di-rondine.corriere", title: "Il Corriere del Pallone", icon: "🚲", chapters: 4,
    menuSub: "Una città aperta in 3D, di giorno e di notte: consegne, orari e un pacco senza indirizzo",
    hourPerSec: 1 / 18,
    start: { d: "stazione", at: [45, 60], hour: 9 },
    hero: { shirt: 0xf59e0b, hair: 0x3a2a1a, pants: 0x334155, hs: "spiky", mood: "happy" },
    districts: [
      { id: "porto", name: "Porto Vecchio", icon: "⚓", gx: 0, gz: 0, landmark: "porto", pal: P("#5a6a78", "#3a424c", "#8a929c", [0xc9b8a0, 0xa8b8c8, 0xd0a890, 0x9aa8a0], 0x2f5a44, 0xf59e0b) },
      { id: "mercato", name: "Mercato dei Mille Odori", icon: "🧺", gx: 1, gz: 0, landmark: "mercato", pal: P("#8a7a5a", "#4a4036", "#b8a888", [0xe0b890, 0xd89a7a, 0xe8d0a0, 0xc88a6a], 0x4a7a38, 0xdc2626) },
      { id: "stazione", name: "Stazione Centrale", icon: "🚉", gx: 2, gz: 0, landmark: "stazione", pal: P("#6a6a72", "#34363c", "#9a9aa4", [0xb8bcc8, 0x9aa0b0, 0xd0d4dc, 0x8a90a0], 0x3a6a4a, 0x2563eb) },
      { id: "collina", name: "Colle delle Ville", icon: "🏛️", gx: 0, gz: 1, landmark: "collina", pal: P("#6a8a52", "#5a5348", "#c4b8a0", [0xf0e4cc, 0xe8d4b0, 0xf4ecd8], 0x3f7a3a, 0xa855f7) },
      { id: "stadio", name: "Stadio Vecchio", icon: "🏟️", gx: 1, gz: 1, landmark: "stadio", pal: P("#5a7a58", "#3a3f44", "#9aa496", [0xb8a890, 0xa09080, 0xc8b8a0], 0x2f6a38, 0x16a34a) },
      { id: "sotterranei", name: "I Sotterranei", icon: "🕳️", gx: 2, gz: 1, landmark: "sotterranei", dark: true, pal: P("#2a323c", "#161b22", "#3f4b5b", [0x4b5563, 0x3f4b5b, 0x5b6676], 0x2a4a3a, 0x22d3ee) }
    ],
    npcs: [
      { id: "marta", name: "Zia Marta", emoji: "📮", look: { hs:"bun",mood:"happy",glasses:1, shirt: 0xb91c1c, hair: 0xd4d4d8, skin: 0xe0b890, pants: 0x1e293b }, sched: [{ h: [0, 24], d: "stazione", at: [40, 52] }] },
      { id: "pina", name: "Nonna Pina", emoji: "🧺", look: { hs:"bun",mood:"happy",glasses:1, shirt: 0xbe185d, hair: 0xe5e7eb, skin: 0xe0b890, pants: 0x4a3a2a }, sched: [{ h: [8, 15], d: "mercato", at: [38, 45] }, { h: [15, 8], away: true }] },
      { id: "ruggero", name: "Custode Ruggero", emoji: "🔦", look: { hs:"cap",cap:0x166534,mood:"grumpy",stache:1, shirt: 0x166534, hair: 0x6b7280, skin: 0xd9a679, pants: 0x1f2937 }, sched: [{ h: [17, 24], d: "stadio", at: [64, 45] }, { h: [0, 6], d: "stadio", at: [64, 45] }, { h: [6, 17], away: true }] },
      { id: "lia", name: "Lia la Barcaiola", emoji: "⛵", look: { hs:"long",mood:"happy", shirt: 0x0e7490, hair: 0x7c2d12, skin: 0xd9a679, pants: 0x1e293b }, sched: [{ h: [8, 13], d: "porto", at: [30, 40] }, { h: [13, 8], away: true }] },
      { id: "tito", name: "Tito del Banco", emoji: "🍋", look: { mood:"happy",stache:1, shirt: 0xca8a04, hair: 0x1f2937, skin: 0xe0b890, pants: 0x3b2a1a }, sched: [{ h: [15, 20], d: "mercato", at: [58, 60] }, { h: [20, 15], away: true }] },
      { id: "volpe", name: "La Volpe", emoji: "🦊", look: { hs:"spiky",mood:"sly", shirt: 0x9a3412, hair: 0x7c2d12, skin: 0xe0b890, pants: 0x1c1917 }, sched: [{ h: [0, 24], away: true }] },
      { id: "nina", name: "Nina", emoji: "🦊", look: { hs:"long",mood:"sly", shirt: 0x9a3412, hair: 0x7c2d12, skin: 0xe8c4a0, pants: 0x1c1917 }, sched: [{ h: [13, 20], d: "mercato", at: [45, 64] }, { h: [20, 13], away: true }] },
      { id: "ettore", name: "Don Ettore", emoji: "🎩", look: { hs:"bald",mood:"sad",beard:1,glasses:1, shirt: 0x1e3a8a, hair: 0x4a4a4a, skin: 0xe8c4a0, pants: 0x111827 }, sched: [{ h: [0, 24], d: "collina", at: [45, 64] }] }
    ],
    shop: { d: "mercato", at: [46, 32], name: "Emporio del Corriere", icon: "🛍️", color: 0xdc2626, open: [8, 21], greet: "Per chi consegna in fretta e con stile.", items: [
      { id: "scarpe", name: "Scarpe da corriere", icon: "👟", price: 30, desc: "corri più veloce", speed: true },
      { id: "berretto", name: "Berretto rosso", icon: "🧢", price: 15, slot: "head", look: { hs: "cap", cap: 0xdc2626 }, desc: "cosmetico" },
      { id: "cilindro", name: "Cilindro", icon: "🎩", price: 25, slot: "head", look: { hs: "hat", cap: 0x111827 }, desc: "cosmetico" },
      { id: "occhiali", name: "Occhiali da sole", icon: "🕶️", price: 15, slot: "glasses", look: { glasses: 1 }, desc: "cosmetico" },
      { id: "baffoni", name: "Baffoni finti", icon: "🥸", price: 10, slot: "stache", look: { stache: 1 }, desc: "cosmetico" },
      { id: "giacca_v", name: "Giacca verde", icon: "🧥", price: 20, slot: "shirt", look: { shirt: 0x16a34a }, desc: "cosmetico" },
      { id: "giacca_r", name: "Giacca rossa", icon: "🧥", price: 20, slot: "shirt", look: { shirt: 0xdc2626 }, desc: "cosmetico" },
      { id: "giacca_p", name: "Giacca viola", icon: "🧥", price: 20, slot: "shirt", look: { shirt: 0xa855f7 }, desc: "cosmetico" }
    ] },
    pois: [
      { id: "pacco", d: "sotterranei", at: [45, 55], r: 3.2, label: "Prendi\nil pacco", mark: true, when: (K) => K.ch() === 1 && K.step(1) === 3 },
      { id: "tana", d: "sotterranei", at: [45, 52], r: 3.4, label: "Aspetta\nla Volpe", mark: true, when: (K) => K.ch() === 3 && K.step(3) === 2 && (K.hour() >= 22 || K.hour() < 4) }
    ],
    endings: { corriere: ["Il Corriere", "Consegni tutto, sempre in orario.", "Chiudi la saga restando fedele alla Zia."], libero: ["Il Corriere Libero", "Consegni a modo tuo, senza consegnare nulla.", "Chiudi la saga seguendo il pacco."], segreto: ["Il Pacco Aperto", "Segreto: il pacco senza indirizzo si apre.", "Segreto: tutte le consegne e il pacco."] }
  };
  const CH = []; window.__corriereCh = (fn) => { CH.push(fn); };
  cfg.story = function (K) {
    const S = { talk: {}, poi: {}, hasTalk: () => false, goal: () => null };
    CH.forEach((fn) => fn(K, S));
    return S;
  };
  // ------------------------------------------------------------------ CAPITOLO 1
  window.__corriereCh(function (K, S) {
    const D = (n) => K.flag("c1_" + n), st = () => (K.ch() === 1 ? K.step(1) : 9);
    const left = () => ["pina", "ruggero", "ettore"].filter((n) => !D(n));
    S.intro = () => K.say([["voce", "Stazione Centrale, mattina. Hai un lavoro nuovo, una bici con una ruota più seria dell'altra e un'agenzia che si chiama «Pallone Express»."], ["voce", "La città è aperta: sei quartieri, un orologio che non aspetta e persone che ci sono solo a certi orari. Muoviti con lo stick, parla con il tasto grande."]]);
    S.hasTalk = (id) => (st() === 0 && id === "marta") || (st() === 1 && ((id === "pina" && !D("pina")) || (id === "ruggero" && !D("ruggero")) || (id === "ettore" && !D("ettore")))) || (st() === 2 && id === "marta");
    S.goal = () => {
      const s = st();
      if (s === 0) return { text: "Parla con Zia Marta, in Stazione.", target: { npc: "marta" } };
      if (s === 1) { const nx = left()[0]; const hint = { pina: "Nonna Pina, al Mercato (solo di giorno, fino alle 15)", ruggero: "Custode Ruggero, allo Stadio Vecchio (solo dopo le 17)", ettore: "Don Ettore, al Colle delle Ville" }[nx]; return { text: `Consegne: ${3 - left().length}/3. Prossima: ${hint}.`, target: { npc: nx } }; }
      if (s === 2) return { text: "Torna da Zia Marta: ha detto che c'è un ultimo pacco.", target: { npc: "marta" } };
      if (s === 3) return { text: "Nei Sotterranei: prendi il pacco senza indirizzo.", target: { d: "sotterranei", at: [45, 55] } };
      if (s === 4) return { text: "Riporta il pacco a Zia Marta, in Stazione.", target: { npc: "marta" } };
      return { text: "Il capitolo 1 è concluso. Il capitolo 2 arriva.", target: null };
    };
    S.talk.marta = (K) => {
      const s = st();
      if (s === 0) {
        K.say([["marta", "[felice] Il nuovo! Puntuale. Il che è sospetto. Qui il tempo è una cosa che si consegna, come tutto il resto."], ["marta", "Tre pacchi, tre destinatari. Nonna Pina, al Mercato, ma solo fino alle 15: poi chiude il banco e sparisce nel mondo. Il Custode Ruggero, allo Stadio Vecchio, ma solo dopo le 17: di giorno non si fa trovare. Don Ettore, al Colle: sempre in casa, sempre di malumore."], ["marta", "Il tempo scorre mentre cammini. Se arrivi tardi, aspetti: puoi riposare dal menu fino a domattina. Niente multe, solo dignità perduta."]], () => { K.inv.give("pacco_pina"); K.inv.give("pacco_ruggero"); K.inv.give("pacco_ettore"); K.setStep(1, 1); K.toast("🎒 3 pacchi"); });
        return;
      }
      if (s === 1) return K.say([["marta", `Ti mancano: ${left().map((n) => ({ pina: "Pina", ruggero: "Ruggero", ettore: "Ettore" }[n])).join(", ")}. Occhio all'orologio.`]]);
      if (s === 2) {
        K.say([["marta", "[pensa] Tre consegne, nessun reclamo. È un record. Ora ti serve un ultimo giro, e questo è un lavoro per chi non fa domande."], ["marta", "Nei Sotterranei c'è un pacco senza indirizzo. Lo trovano ogni anno nello stesso punto e ogni anno nessuno sa a chi spetti. Quest'anno tocca a te portarlo qui. Non aprirlo: è un consiglio, non un ordine."]], () => { K.setStep(1, 3); });
        return;
      }
      if (s === 4) {
        K.say([["marta", "[sorpreso] Il pacco. Non ha etichetta, non ha mittente, e pesa come un pallone. Dentro c'è un pallone, vero?"], ["marta", "Non voglio saperlo. Prendilo, mettilo nello scaffale in fondo e domattina chiamo qualcuno di serio. Il capitolo due, per te, comincia domani."], ["voce", "<b>FINE DEL CAPITOLO 1.</b> Il Corriere del Pallone continua: nuovi quartieri, nuovi orari, un pacco da capire."]], () => { K.coins(80); K.finishChapter(1, "ok"); K.setStep(1, 5); K.toast("✅ Capitolo 1 concluso"); });
        return;
      }
      K.say([["marta", "Consegna fatta, giornata fatta. Vai a dormire, corriere."]]);
    };
    const deliver = (id, lines, coins) => (K2) => {
      if (st() !== 1) return K.say([[id, "Non ho niente da dirti."]]);
      if (D(id)) return K.say([[id, "Ho già avuto il pacco. Grazie, davvero."]]);
      K.say(lines, () => { K.setFlag("c1_" + id, 1); K.inv.take("pacco_" + id); K.coins(coins); if (left().length === 0) { K.setStep(1, 2); K.toast("📦 Consegne finite: torna da Zia Marta"); } K.refresh(); });
    };
    S.talk.pina = deliver("pina", [["pina", "[felice] Il pacco! Sono le uova di Pietra, quelle che sembrano un pallone ma si mangiano. Hai fatto in tempo, il banco chiude alle tre."], ["pina", "Tienti questa pagnotta calda. È più buona di una mancia e meno discutibile di un compenso."]], 25);
    S.talk.ruggero = deliver("ruggero", [["ruggero", "[serio] Finalmente. Una lampadina per il faro dello stadio. L'ultima l'ha mangiata un gufo, o forse un tifoso."], ["ruggero", "Lo stadio di notte è un altro posto. Se un giorno ti serve qualcuno che ascolta, sono qui dalle cinque a mezzanotte. Ho tutto il tempo, a parte quello di dormire."]], 30);
    S.talk.ettore = deliver("ettore", [["ettore", "[freddo] Il corriere. In bici. Con le scarpe sporche. Non si usa più il cavallo?"], ["ettore", "[pensa] È il mio vecchio orologio. L'ho fatto riparare per la sesta volta. Segna ancora l'ora sbagliata, ma almeno la segna con convinzione."]], 35);
    S.poi.pacco = (K) => {
      K.say([["voce", "Tra i tubi, sotto una griglia, un pacco di carta marrone senza scritte. Pesa come un pallone e, sotto la carta, qualcuno ha disegnato una crepa dorata."]], () => { K.inv.give("pacco_senza_indirizzo"); K.setStep(1, 4); K.toast("🎒 Pacco senza indirizzo"); });
    };
  });
  // Squadra dei Sogni, Carte del Destino e ospiti al Borgo: ritratti nel cast comune con prefisso pe_ (Pallone Express)
  const PE = {
    pe_marta: [{ name: "Zia Marta", sub: "Pallone Express", style: "bob", hair: "#d4d4d8", shirt: "#b91c1c", skin: "#e0b890", eye: "#1f2937", acc: ["occhiali"], bg: ["#7f1d1d", "#fde68a"] }, "Dirige l'agenzia «Pallone Express» dalla Stazione Centrale. Considera il tempo una merce come le altre: si consegna, e se arriva tardi si paga."],
    pe_ruggero: [{ name: "Custode Ruggero", sub: "Stadio Vecchio", style: "short", hair: "#6b7280", beard: "pizzetto", shirt: "#166534", skin: "#d9a679", eye: "#1f2937", acc: ["cappellino"], bg: ["#14532d", "#bbf7d0"] }, "Custode dello Stadio Vecchio, dalle cinque a mezzanotte. Tiene acceso il faro anche quando non gioca nessuno, per abitudine e per principio."],
    pe_ettore: [{ name: "Don Ettore", sub: "Colle delle Ville", style: "bald", hair: "#4a4a4a", beard: "folta", shirt: "#1e3a8a", skin: "#e8c4a0", eye: "#1f2937", acc: ["occhiali"], bg: ["#172554", "#bfdbfe"] }, "Vive sul Colle delle Ville con un orologio che segna l'ora sbagliata con convinzione. Un tempo era un portiere."],
    pe_lia: [{ name: "Lia la Barcaiola", sub: "Porto Vecchio", style: "long", hair: "#7c2d12", shirt: "#0e7490", skin: "#d9a679", eye: "#1f2937", bg: ["#164e63", "#a5f3fc"] }, "Traghetta chiunque al Porto Vecchio, la mattina. Il pomeriggio va a pescare, e se perde una partita dice che ha vinto comunque."],
    pe_tito: [{ name: "Tito del Banco", sub: "Mercato dei Mille Odori", style: "short", hair: "#1f2937", beard: "incolta", shirt: "#ca8a04", skin: "#e0b890", eye: "#1f2937", bg: ["#713f12", "#fef08a"] }, "Tiene il banco del Mercato dalle tre alle otto. Vende limoni con un racconto incluso e li usa come munizioni morali."],
    pe_nina: [{ name: "Nina", sub: "Nipote di Zia Marta", style: "long", hair: "#7c2d12", shirt: "#9a3412", skin: "#e8c4a0", eye: "#065f46", bg: ["#431407", "#fdba74"] }, "Nipote di Zia Marta. A sei anni rubava le caramelle e le restituiva con un biglietto di scuse. Corre più di una bici."]
  };
  (function castPE(n) { const a = window.__borgoApi; if (!a || !a.CAST) { if (n < 80) setTimeout(() => castPE(n + 1), 250); return; } Object.keys(PE).forEach((id) => { if (!a.CAST[id]) a.CAST[id] = Object.assign({ tag: "" }, PE[id][0]); if (a.BIO && !a.BIO[id]) a.BIO[id] = PE[id][1]; }); })(0);
  (function guestPE(n) { if (!window.__borgoGuests) { if (n < 80) setTimeout(() => guestPE(n + 1), 250); return; }
    window.__borgoGuests.add({ id: "pe_ruggero", when: () => { try { return window.__corriere.info().ends.length > 0; } catch (e) { return false; } }, lines: [["pe_ruggero", "[serio] {n}. Il faro dello stadio l'ho lasciato acceso, tanto non lo spegne nessuno. Sono venuto a vedere il vostro mare: di notte, dicono, fa luce da solo."], ["pe_ruggero", "Zia Marta ti saluta. Dice che il tuo posto all'agenzia è libero, e che la bici l'hanno aggiustata. Una ruota sola, ma è un inizio."]] }); })(0);
  const E = window.__citta3d.create(cfg);
  window.__corriere = E;
})();
