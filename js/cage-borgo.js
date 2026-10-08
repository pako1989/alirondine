// js/cage-borgo.js - Aggancio de "La Gabbia del Molo" al Borgo camminabile
// Don Tullio (custode) e la Signora Nives vivono ai Trabucchi, accanto alla Gabbia: da qui si sceglie la modalità.
// Carica solo se window.__borgoApi esiste. Va incluso DOPO game.js e street-cage-hd.js (anche dopo borgo-expansions.js).
(function () {
  "use strict";
  if (window.__cageBorgoLoaded) return;
  window.__cageBorgoLoaded = true;
  let tries = 0;

  function init() {
    const api = window.__borgoApi, cage = window.__cageHd;
    if (!api || !cage || typeof cage.start !== "function") {
      if (++tries < 100) setTimeout(init, 150); // niente Borgo: nessun effetto
      return;
    }
    const TRZ = api.TRZ, CAST = api.CAST, L = api.L, MN = api.MN_BORGO_BTN;

    // ---------------------------------------------------------------- personaggi
    CAST.don_tullio = CAST.don_tullio || { name: "Don Tullio", tag: "gray", hair: "#c9c5bd", style: "buzz", skin: "#d49a68", eye: "#3b2f1f", bg: ["#78350f", "#d6b98c"], beard: true, cap: "#57534e", shirt: "#78716c" };
    CAST.nives_balcone = CAST.nives_balcone || Object.assign({}, CAST.nonna || {}, { name: "Signora Nives", shirt: "#f472b6", bg: ["#9d174d", "#f9a8d4"] });

    // carte dell'album (Carte dei personaggi): la carta si sblocca solo quando il PNG parla (seeCard)
    const BIOX = {
      don_tullio: "Custode della Gabbia del Molo da quarant'anni: ha le chiavi, il lucchetto e, a sentir lui, nessun altro merito. Ogni sera alle undici chiude, e ogni sera qualcuno gli chiede un'ultima tirata che dura un'ora.",
      nives_balcone: "Dal balcone sopra la Gabbia protesta contro il rumore del pallone con la stessa puntualità con cui non perde un tiro. Stende il bucato proprio all'ora delle partite, per puro caso, giura.",
    };
    if (api.BIO) Object.keys(BIOX).forEach((k) => { if (!api.BIO[k]) api.BIO[k] = BIOX[k]; });
    const meet = (id) => { try { if (api.seeCard) api.seeCard(id); } catch (e) { /* ignora */ } };

    const go = (screen, extra) => cage.start(Object.assign({ screen, onExit: api.trResume, from: "borgo" }, extra || {}));
    const inf = () => { try { return cage.info(); } catch (e) { return { unread: 0, dailyLeft: 0, stars: [0, 0, 0, 0], bosses: 0, open: 1, chapters: 0, titles: 0, cups: 0, season: false, cup: false }; } };

    // ---------------------------------------------------------------- memoria minima dell'NPC (solo cosmetica narrativa)
    const KEY = "ali-di-rondine.cage-hd-borgo";
    const mem = () => { try { const o = JSON.parse(localStorage.getItem(KEY) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } };
    const memSet = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignora */ } };

    // ---------------------------------------------------------------- dialoghi
    // battute a tappe: ironiche di base, poi qualche momento serio. Nessun riferimento alla trama principale.
    const CHAT = [
      { need: () => true, t: ["Il lucchetto? Pesa meno di come lo racconto. Il fatto è che a raccontarlo sembra più importante di una porta. Sei il tipo che ascolta, vedo.", "In quarant'anni ho aperto la Gabbia a ogni ora. L'unica volta che ho fatto tardi, il gabbiano ha scritto una lettera di protesta. Cioè ha fatto un paio di cose sul cancello."] },
      { need: (i) => i.stars[0] > 0, t: ["Gli Scaricatori ti hanno preso in simpatia. Succede quando uno non ti passa la palla ma ti passa la cassetta del pesce. Per loro è la stessa cosa."] },
      { need: (i) => i.stars[2] > 0, t: ["Quando abbiamo fatto la Gabbia eravamo cinque. Io, Remo, Ciro, Nandino ed Elio. Ognuno portò un secchio di cemento. Il secchio di Elio era il più storto. Ci scrivemmo i nomi sopra, e ci sono ancora."] },
      { need: (i) => i.chapters >= 4, t: ["Sai qual è la cosa più difficile del custode? Non aprire. Chiudere. Alle undici, la sera, quando c'è ancora qualcuno che vorrebbe tirare un'ultima volta. L'ultima volta dura sempre un'ora."] },
      { need: (i) => i.bosses >= 1, t: ["I tre del molo ti hanno fatto vedere come si gioca quando si gioca per lavoro. Io, per lavoro, aprivo un cancello. Mi sono sempre sentito un po' in colpa."] },
      { need: (i) => i.titles > 0 || i.cups > 0, t: ["Hai portato un titolo, a questo molo. Tengo la targa nello sgabuzzino, che è dove tengo le cose a cui tengo. Ci sta anche il vecchio pallone di Elio. Sì, c'è un pallone di Elio. Non chiedere."] },
    ];

    function chatLines() {
      const i = inf(), ok = CHAT.filter((c) => { try { return c.need(i); } catch (e) { return false; } });
      const m = mem(), n = (m.chat | 0), pool = ok[Math.min(ok.length - 1, n % ok.length)];
      m.chat = n + 1; memSet(m);
      return pool.t.map((t) => L("don_tullio", t));
    }

    function tullioHead() {
      const i = inf(), m = mem();
      if (!m.met) return "«Ah, il ragazzo della Rondine. Io sono Tullio: ho le chiavi della Gabbia e nessun altro merito. Qui la palla non esce, rimbalza. Dentro si gioca in tre contro tre, a punti. Cosa ti va di fare?»";
      const a = [];
      if (i.dailyLeft > 0) a.push(`«Sul cancello ho appeso ${i.dailyLeft === 1 ? "una sfida" : i.dailyLeft + " sfide"} di oggi. Nives dice che è un abuso d'ufficio. Cosa facciamo?»`);
      if (i.unread > 0) a.push("«Sulla rete c'è qualcosa di nuovo. Non so chi l'abbia messo. Io no, e sospetto Remo.»");
      if (i.season) a.push("«Il campionato è a metà. Il tabellone dice che sei in piedi. La classifica dice che dipende.»");
      if (i.cup) a.push("«La coppa è aperta: o vinci o torni a casa. Le due opzioni sono entrambe rispettabili.»");
      a.push("«Il cancello è aperto. Cosa ti va di giocare?»", "«Ti aspettavo. Cioè: aspettavo qualcuno. Sei capitato tu.»");
      return a[Math.floor(Math.random() * a.length)];
    }

    function tullioMenu() {
      const i = inf(), m = mem();
      const btn = (label, sub, fn, cls) => ({ label, sub, cls: cls || "", fn });
      const head = tullioHead(); m.met = 1; memSet(m);
      return api.trAsk("don_tullio", head, [
        btn("Entra nella Gabbia", "Il menu completo: torneo, boss, campionato...", () => go("hub"), "hot"),
        btn("Scegli una modalità", "Partita libera, sopravvivenza, a tempo, rigori...", modeMenu),
        btn(i.dailyLeft ? `Sfida del giorno (${i.dailyLeft} da fare)` : "Sfida del giorno", "Tre sfide nuove ogni giorno", () => go("daily")),
        btn("Campionato, coppa e boss", "Le sfide lunghe del quartiere", leagueMenu),
        btn(i.unread ? `Diario del molo (${i.unread} nuove)` : "Diario del molo", "Le storie del quartiere, a tappe", () => go("diary")),
        btn("Chiacchiera con Tullio", "Storie, ironie e qualche ricordo", () => api.trSay(chatLines(), api.trResume)),
      ]);
    }
    function modeMenu() {
      const b = (label, sub, screen) => ({ label, sub, cls: "", fn: () => go(screen) });
      api.trAsk("don_tullio", "«Quattro modi di sprecare una sera, e tutti e quattro validi. Quale?»", [
        b("Il torneo", "Dalle squadre del molo in su", "tour"),
        b("Partita libera", "Avversario, punti, tempo e modificatore a scelta", "free"),
        b("Sopravvivenza", "Ondate sempre più toste", "surv"),
        b("Sfida a tempo", "Più punti che puoi", "time"),
        b("Rigori", "Una serie dal dischetto", "pen"),
        b("Allenamento", "Senza fretta, senza giudizio", "train"),
        { label: "◂ Indietro", sub: "", fn: tullioMenu },
      ]);
    }
    function leagueMenu() {
      const i = inf(), b = (label, sub, screen) => ({ label, sub, cls: "", fn: () => go(screen) });
      api.trAsk("don_tullio", "«Il campionato dura una stagione, la coppa una sera, i boss una vita. Ognuno ha il suo ritmo.»", [
        b(i.season ? "Campionato (in corso)" : "Campionato", "Classifica e stagione", "season"),
        b(i.cup ? "Coppa (in corso)" : "Coppa", "Eliminazione diretta", "cup"),
        b("Boss di quartiere", `${i.bosses}/3 battuti`, "boss"),
        b("Squadra e compagni", "Chi gioca davanti, chi dietro", "squad"),
        b("Estetica", "Maglie, palle, campi", "cos"),
        { label: "◂ Indietro", sub: "", fn: tullioMenu },
      ]);
    }
    function nivesTalk() {
      const i = inf(), a = [
        "Fate meno rumore dopo le dieci! ...Cioè. Fate rumore. Ma con garbo.",
        "Io da qui vedo tutto: le sponde troppo vicine al muro, i passaggi sbagliati, il gabbiano che bara. A proposito: il gabbiano bara.",
      ];
      if (i.stars[2] > 0) a.push("Quando hanno chiuso la Gabbia, per un anno, ho avuto un silenzio troppo grande. Poi hanno riaperto. Non lo dico a nessuno. Lo dico a te perché non mi risponderai.");
      if (i.titles > 0 || i.cups > 0) a.push("Ho battuto un colpo sulla ringhiera, quando hai vinto. Uno. Per il rumore. Non andare a dirlo in giro.");
      return api.trSay([L("nives_balcone", a[Math.floor(Math.random() * a.length)])], api.trResume);
    }

    // ---------------------------------------------------------------- hook (concatenato con quelli già presenti o futuri)
    const MINE = ["don_tullio", "nives_balcone"];
    let prev = window.trTalkHook;
    const mine = function (id) {
      if (id === "don_tullio") { meet(id); tullioMenu(); return true; }
      if (id === "nives_balcone") { meet(id); nivesTalk(); return true; }
      return typeof prev === "function" ? prev(id) : false;
    };
    // se borgo-expansions.js (o altri) assegneranno trTalkHook dopo di noi, la loro funzione resta in coda alla catena
    try {
      Object.defineProperty(window, "trTalkHook", { configurable: true, enumerable: true, get() { return mine; }, set(fn) { if (typeof fn !== "function" || fn === mine) return; const old = prev; prev = function (id) { return fn(id) || (typeof old === "function" ? old(id) : false); }; } });
    } catch (e) { window.trTalkHook = mine; }

    // ---------------------------------------------------------------- NPC nella mappa dei Trabucchi (accanto alla Gabbia)
    function place(n) {
      const z = TRZ.trabucchi;
      if (!z) { if (++n < 200) setTimeout(() => place(n), 150); return; }
      if (!Array.isArray(z.npcs)) z.npcs = [];
      [{ id: "don_tullio", at: [21, 15] }, { id: "nives_balcone", at: [26, 15] }].forEach((p) => { if (!z.npcs.some((x) => x.id === p.id)) z.npcs.push(p); });
    }
    place(0);

    // ---------------------------------------------------------------- voce nel menu del Borgo
    if (Array.isArray(MN) && !MN.some((f) => f && f.__cage)) {
      const f = () => {
        const i = inf();
        return {
          label: "👟 La Gabbia del Molo · Don Tullio",
          sub: `${i.dailyLeft ? i.dailyLeft + " sfide del giorno · " : ""}${i.unread ? i.unread + " pagine nuove · " : ""}ai Trabucchi, accanto alla rete`,
          cls: "hot",
          fn: () => { if (TRZ.trabucchi) api.trGo("trabucchi"); else go("hub"); },
        };
      };
      f.__cage = 1; MN.push(f);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
