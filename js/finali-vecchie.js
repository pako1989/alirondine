// js/finali-vecchie.js - Collega al Salone e all'Album i finali multipli delle saghe nate prima del motore comune.
// Non cambia le storie né i salvataggi: legge cosa hanno già registrato (capitoli conclusi e scelte finali) e ricorda i finali trovati
// in una chiave a parte, così restano anche se si rigioca il capitolo e si sceglie diversamente.
(function () {
  "use strict";
  const STORE = "ali-di-rondine.finali-vecchie";
  const d = (n, v) => (m) => !!(m.done && m.done[n] === v);
  const f = (k, v) => (m) => !!(m.flags && m.flags[k] === v);
  // [id, titolo, descrizione, indizio, prova]
  const DEFS = {
    ragnarok: { mod: "__ragnarokStory", key: "ali-di-rondine.ragnarok", list: [
      ["vita_rinata", "La Vita Rinata", "Il sole torna su Midgard e il ciclo della vita riparte.", "Riaccendi il sole.", d(4, "vita_rinata")],
      ["quiete_eterna", "La Quiete Eterna", "Il fuoco si spegne e il gelo regna in pace.", "Scegli il silenzio.", d(4, "quiete_eterna")],
      ["guardiano_equilibrio", "Il Guardiano dell'Equilibrio", "Né fuoco né ghiaccio: resti a custodire il confine.", "Non scegliere un lato.", d(4, "guardiano_equilibrio")]] },
    belovodia: { mod: "__belovodiaStory", key: "ali-di-rondine.belovodia-story", list: [
      ["primavera", "La Primavera", "Il bosco si risveglia e le maschere cadono.", "Scegli il risveglio.", d(4, "primavera")],
      ["guardiano", "Il Guardiano del Bosco", "Resti a custodire il bosco e i suoi spiriti.", "Scegli di restare.", d(4, "guardiano")],
      ["aurora", "L'Aurora", "Una nuova alba per tutti i villaggi.", "Scegli la via della luce.", d(4, "aurora")]] },
    bilancia: { mod: "__bilanciaFeudi", key: "ali-di-rondine.bilancia-feudi", list: [
      ["golden", "La Corona Unita", "Il finale d'oro: i tre regni scelgono l'unione.", "Servono tutte le prove raccolte.", f("finale_feudi", "golden")],
      ["liberta", "Il Destino della Libertà", "I feudi restano liberi, a modo loro.", "Difendi la libertà dei feudi.", f("finale_feudi", "liberta")],
      ["moralita", "Il Destino della Morale", "Governa il giusto, anche se costa.", "Scegli la giustizia.", f("finale_feudi", "moralita")],
      ["utilita", "Il Destino dell'Utile", "Governa ciò che funziona, anche se costa.", "Scegli il risultato.", f("finale_feudi", "utilita")]] },
    ombre: { mod: "__campioneOmbre", key: "ali-di-rondine.campione-ombre", list: [
      ["verita", "La Verità", "Le ombre vengono alla luce.", "Scegli di sapere.", f("finale_ombre", "verita")],
      ["sovrano", "Il Sovrano", "Il circuito ha un nuovo padrone.", "Scegli il potere.", f("finale_ombre", "sovrano")],
      ["corsari", "I Corsari", "Fuori dal circuito, a modo tuo.", "Scegli la strada libera.", f("finale_ombre", "corsari")],
      ["chimera_redenta", "La Chimera Redenta", "Anche il mostro merita una seconda occasione.", "Scegli la pietà.", f("finale_ombre", "chimera_redenta")]] },
    shogun: { mod: "__shogunStory", key: "ali-di-rondine.shogun-story", list: [
      ["purificazione", "La Purificazione", "Il calcio torna libero a tutte le province.", "Scegli la libertà.", d(4, "purificazione_totale")],
      ["guardiano_celeste", "Il Guardiano Celeste", "Custodisci le province per sempre.", "Scegli la corona.", d(4, "guardiano_eterno")]] },
    phantom: { mod: "__phantomGenesis", key: "ali-di-rondine.phantom-genesis", list: [
      ["liberta_rondine", "La Libertà della Rondine", "Si vola via, liberi.", "Scegli la libertà.", d(3, "liberta_rondine")],
      ["giudizio_luce", "Il Giudizio della Luce", "La luce decide per tutti.", "Scegli il giudizio.", d(3, "giudizio_luce")]] },
    pirati: { mod: "__piratiStory", key: "ali-di-rondine.pirati-story", list: [
      ["liberta_totale", "La Libertà Totale", "Cieli aperti per ogni ciurma.", "Scegli la libertà.", d(4, "liberta_totale")],
      ["re_dei_cieli", "Il Re dei Cieli", "Una sola bandiera su tutta la tempesta.", "Scegli il comando.", d(4, "re_dei_cieli")]] },
    alchimia: { mod: "__alchimiaStory", key: "ali-di-rondine.alchimia-story", list: [
      ["sacrificio_umano", "Lo Scambio Equivalente", "Il prezzo si paga, e il corpo torna umano.", "Scegli lo scambio.", f("finale_alchimia", "sacrificio_umano")],
      ["filosofo_supremo", "Il Filosofo Supremo", "Il sapere più alto, e il suo peso.", "Scegli il sapere.", f("finale_alchimia", "filosofo_supremo")],
      ["liberta_errante", "La Libertà Errante", "Una strada senza trasmutazioni.", "Scegli di partire.", f("finale_alchimia", "liberta_errante")]] },
    kronenburg: { mod: "__kronenburgStory", key: "ali-di-rondine.kronenburg-story", list: [
      ["zero_requiem", "Zero Requiem", "Il finale più silenzioso.", "Scegli il requiem.", f("finale_kronenburg", "zero_requiem")],
      ["imperatore_ossidiana", "L'Imperatore d'Ossidiana", "Il trono nero ha un nuovo padrone.", "Scegli il trono.", f("finale_kronenburg", "imperatore_ossidiana")],
      ["volo_rondine", "Il Volo della Rondine", "Si lascia la guglia e si vola via.", "Scegli il volo.", f("finale_kronenburg", "volo_rondine")]] },
  };
  const rd = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } };
  const wr = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  let busy = false;
  // salva i finali che il salvataggio mostra adesso; ritorna l'elenco completo dei trovati per la saga
  function scan(id, raw) {
    const D = DEFS[id], all = rd(STORE) || {}, have = new Set(all[id] || []);
    let m = null; try { m = raw === undefined ? rd(D.key) : JSON.parse(raw); } catch (e) {}
    let grow = false;
    if (m && typeof m === "object") D.list.forEach(([e, , , , test]) => { if (!have.has(e) && test(m)) { have.add(e); grow = true; } });
    if (grow && !busy) { busy = true; all[id] = [...have]; wr(STORE, JSON.stringify(all)); busy = false; }
    return have;
  }
  const byKey = {}; Object.keys(DEFS).forEach((id) => { byKey[DEFS[id].key] = id; });
  try {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { orig.call(this, k, v); if (this === window.localStorage && byKey[k]) scan(byKey[k], v); };
  } catch (e) {}
  function attach() {
    Object.keys(DEFS).forEach((id) => {
      const D = DEFS[id], mod = window[D.mod];
      if (!mod || mod.endings) return;
      mod.endings = () => { const have = scan(id); return D.list.map(([e, title, desc, hint]) => ({ id: e, title, desc, hint, found: have.has(e) })); };
    });
  }
  attach(); window.addEventListener("load", attach);
  window.__finaliVecchie = { DEFS, scan, attach };
})();
