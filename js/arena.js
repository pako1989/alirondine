// js/arena.js - Arena dei Sogni e Torre dei Duelli: battaglia a turni con le carte della Squadra dei Sogni (js/sogni.js).
// Livelli e progressi vivono solo qui (chiave propria): non toccano Storia, Carriera né le stelle della Squadra dei Sogni.
// Tratti: Assalto (ATT) batte Mente (TEC), Mente batte Muro (DIF), Muro batte Assalto. Il tratto è la statistica più alta della carta.
(function () {
  "use strict";
  if (window.__arena) return;
  const KEY = "ali-di-rondine.arena";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const TR = { at: ["Assalto", "🔥", "#e8603a"], df: ["Muro", "🛡️", "#3a8ad8"], te: ["Mente", "🎯", "#a85ad8"] };
  const BEATS = { at: "te", te: "df", df: "at" }; // chi batte chi
  const ABIL = { A: ["Tiro Fuoco", "Colpo da 2,2× su un nemico"], C: ["Regia", "Squadra +25% danni per 2 round"], D: ["Muro Vivente", "Attira i colpi per 2 round e +45 scudo"], P: ["Parata Totale", "Scudo +30 a tutta la squadra"] };
  const ROLE = { A: "Attaccante", C: "Centrocampista", D: "Difensore", P: "Portiere" };
  const XPT = [0, 2, 5, 9, 14, 20, 27, 35, 44, 54]; // soglie livello 1..10
  const lvOf = (xp) => { let l = 1; XPT.forEach((t, i) => { if (xp >= t) l = i + 1; }); return l; };
  const MODS = [["Pioggia", "I danni sono −15%", { dmg: 0.85 }], ["Vento in poppa", "Le abilità si ricaricano un round prima", { cd: 1 }], ["Notte di coppa", "Colpi critici più frequenti", { crit: 0.12 }], ["Terreno pesante", "Tutti hanno +20% punti vita", { hp: 1.2 }]];
  const TMODS = MODS.concat([["Nebbia", "Le intenzioni nemiche sono nascoste (❓)", { fog: 1 }], ["Muraglia", "I nemici iniziano con 30 scudo", { foeSh: 30 }], ["Fretta", "Le abilità nemiche sono subito pronte", { foeCd: 1 }]]);
  const floorRule = (f) => (f < 3 || f % 10 === 0 ? null : TMODS[hash("r" + f) % TMODS.length]);

  // ------------------------------------------------------------ Abilità Iconiche Uniche ("Firme d'Autore")
  const UNIQUE_SKILLS = {
    // Ali di Rondine · Borgo Marino (Storia Principale)
    leo: { name: "Volo della Rondine", desc: "Danno 2,6× che spezza lo scudo bersaglio, brucia per 3 round e carica +20% barra squadra", cd: 3, role: "A", mult: 2.6, pierce: true, burn: 3, gauge: 20 },
    dario: { name: "Mancino del Molo", desc: "Danno 2,7× penetrante che ignora gli scudi e brucia per 3 round", cd: 3, role: "A", mult: 2.7, pierce: true, burn: 3 },
    nico: { name: "Gatto Volante", desc: "Scudo +55 a tutta la squadra e purifica ogni bruciatura o stordimento", cd: 3, role: "P", teamShield: 55, cleanse: true },
    tommy: { name: "Assist dal Cuore", desc: "Danni squadra +30% per 2 round, ricarica di 1 turno le abilità e carica +20% barra", cd: 2, role: "C", buffDmg: 1.30, cdAll: true, gauge: 20 },
    sara: { name: "Dossier Tattico", desc: "Interrompe il nemico, aumenta i danni squadra del +35% e dona +25 scudo a tutti", cd: 3, role: "C", buffDmg: 1.35, interrupt: true, allShield: 25 },
    ruggeri: { name: "Lavagna del Mister", desc: "Attira i colpi per 2 round (+55 scudo), purifica e protegge i compagni (+25 scudo)", cd: 3, role: "D", taunt: 2, shield: 55, allShield: 25, cleanse: true },
    papa: { name: "Rovesciata Moretti", desc: "Danno 2,4× generoso che brucia il bersaglio e carica +25% barra squadra", cd: 3, role: "A", mult: 2.4, burn: 3, gauge: 25 },
    kenji: { name: "Volo dell'Aquila", desc: "Danno 2,5× dall'alto che trafigge lo scudo nemico", cd: 3, role: "A", mult: 2.5, pierce: true },
    sho: { name: "Artiglio Cremisi", desc: "Danno 2,4× rapido con onda d'urto sui nemici vicini", cd: 3, role: "A", mult: 2.4, aoe: true },
    jojo: { name: "Ginga d'Oro", desc: "Danno 2,6× danzante, travolge i nemici vicini e carica +25% barra squadra", cd: 3, role: "A", mult: 2.6, aoe: true, gauge: 25 },
    lina: { name: "Fermo in Area", desc: "Attira i colpi per 2 round (+55 scudo) e interrompe l'azione del bersaglio", cd: 3, role: "D", taunt: 2, shield: 55, interrupt: true },
    ernesta: { name: "Sguardo della Gatta '68", desc: "Scudo +55 a tutta la squadra e purifica gli stati alterati", cd: 3, role: "P", teamShield: 55, cleanse: true },
    marta: { name: "Cambio Modulo Azzurro", desc: "Danni squadra +35% per 2 round e riduce di 1 turno la ricarica alleata", cd: 3, role: "C", buffDmg: 1.35, cdAll: true },
    keller: { name: "Tuono dello Sturmwald", desc: "Danno 2,7× devastante che infrange lo scudo e stordisce il bersaglio", cd: 3, role: "A", mult: 2.7, pierce: true, stun: true },

    // Campetto al Mondiale
    cm_bastiano: { name: "Tiro dell'Incrollabile", desc: "Danno 2,6× micidiale, annulla lo scudo bersaglio e brucia per 3 round", cd: 3, role: "A", mult: 2.6, pierce: true, burn: 3 },
    cm_leone: { name: "Fiammata del Campetto", desc: "Danno 2,4×, infligge Bruciatura e carica la barra squadra del +25%", cd: 3, role: "A", mult: 2.4, burn: 3, gauge: 25 },
    cm_saverio: { name: "Baluardo del Vecchio Molo", desc: "Scudo +50 a tutta la squadra e rimuove le bruciature alleate", cd: 3, role: "P", teamShield: 50, cleanse: true },
    cm_pio: { name: "Corsa Generosa", desc: "Dona +35% danni al gruppo e dona +30 scudo", cd: 2, role: "C", buffDmg: 1.35, allShield: 30 },

    // Tactics Note
    qd_raito: { name: "Sentenza del Taccuino", desc: "Danno 2,5× penetrante, interrompe il nemico e lo stordisce per 1 round", cd: 3, role: "A", mult: 2.5, stun: true, interrupt: true },
    qd_elle: { name: "Deduzione del 99,4%", desc: "Interrompe tutti i piani nemici, aumenta i danni squadra del +35% per 2 round", cd: 3, role: "C", buffDmg: 1.35, interrupt: true },
    qd_ryu: { name: "Rasoio dello Shinigami", desc: "Danno 2,3× che ignora scudo e carica +20% barra squadra", cd: 3, role: "C", mult: 2.3, pierce: true, gauge: 20 },
    qd_misa: { name: "Dribbling d'Amore", desc: "Danno 2,2× rapido, carica la barra squadra del +30%", cd: 2, role: "A", mult: 2.2, gauge: 30 },

    // Colpo al Fortino
    fo_lupin: { name: "Scasso ad Alta Quota", desc: "Danno 2,3× che ignora la difesa e azzera il cooldown delle abilità alleate", cd: 3, role: "A", mult: 2.3, cdAll: true, pierce: true },
    fo_turing: { name: "Decrittazione del Campo", desc: "Squadra +30% danni per 2 round e dona +30 scudo a tutti", cd: 3, role: "C", buffDmg: 1.30, allShield: 30 },
    fo_gargoyle: { name: "Guardiano di Pietra", desc: "Attira tutti i colpi per 2 round e guadagna +65 scudo", cd: 3, role: "D", taunt: 2, shield: 65 },
    fo_boss: { name: "Contratto d'Acciaio", desc: "Scudo +45 a tutta la squadra e purifica i debuff", cd: 3, role: "C", allShield: 45, cleanse: true },

    // Accademia dei Sigilli
    sg_preside: { name: "Sigillo del Destino", desc: "Stordisce il nemico per 1 round e dona +40 scudo a tutta la squadra", cd: 3, role: "C", stun: true, allShield: 40 },
    sg_miriel: { name: "Parabola dei Venti", desc: "Danno 2,5× a parabola che trafigge lo scudo nemico", cd: 3, role: "A", mult: 2.5, pierce: true },
    sg_golem: { name: "Muro di Granito Vivo", desc: "Attira i colpi per 3 round e ottiene +70 scudo", cd: 4, role: "D", taunt: 3, shield: 70 },

    // Operazione Doppio Zero
    dz_sterling: { name: "Licenza di Concludere", desc: "Danno 2,6× micidiale e carica barra squadra del 25%", cd: 3, role: "C", mult: 2.6, gauge: 25 },
    dz_kalt: { name: "Brivido Sottozero", desc: "Danno 2,2×, applica Stordimento e azzera l'intenzione del bersaglio", cd: 3, role: "A", mult: 2.2, stun: true, interrupt: true },
    dz_eva: { name: "Tracciamento Balistico", desc: "Dona +30 scudo a tutta la squadra e +30% danni per 2 round", cd: 3, role: "C", buffDmg: 1.30, allShield: 30 },

    // Neo-Rondine 2099
    nr_zero: { name: "Cyber-Barriera 99.9%", desc: "Scudo +55 a tutta la squadra e purifica ogni debuff", cd: 3, role: "P", teamShield: 55, cleanse: true },
    nr_vektor: { name: "Sovraccarico Energetico", desc: "Danno 2,4× elettrico che colpisce anche i nemici vicini", cd: 3, role: "A", mult: 2.4, aoe: true },
    nr_kira: { name: "Hacking di Squadra", desc: "Ricarica subito le abilità alleate e infligge +25% danni per 2 round", cd: 3, role: "C", cdAll: true, buffDmg: 1.25 },

    // Vallombra
    vl_aurelio: { name: "Fischio del Novantesimo", desc: "Danno 2,4×, carica barra squadra +25% e stordisce se in critico", cd: 3, role: "C", mult: 2.4, gauge: 25 },
    vl_ombra: { name: "Eclisse del Campo", desc: "Danno 2,5×, infligge Bruciatura e interrompe l'intenzione nemica", cd: 3, role: "A", mult: 2.5, burn: 3, interrupt: true },
    vl_berto: { name: "Nodo a Farfalla", desc: "Scudo +50 a tutta la squadra e purifica i compagni", cd: 3, role: "P", teamShield: 50, cleanse: true },
    vl_teodora_l: { name: "Discesa della Cabina", desc: "Attira i colpi per 2 round con +60 scudo", cd: 3, role: "D", taunt: 2, shield: 60 },

    // Ave Calcio Roma
    rm_cesare: { name: "Veni Vidi Vici", desc: "Danno 2,6× imperiale + carica la barra squadra del 30%", cd: 3, role: "A", mult: 2.6, gauge: 30 },
    rm_spartaco: { name: "Scudo della Suburra", desc: "Attira i colpi per 2 round, +60 scudo e protegge gli alleati", cd: 3, role: "D", taunt: 2, shield: 60, allShield: 20 },

    // Shogun Eclipse
    sh_kurogane: { name: "Fendente d'Acciaio Lunare", desc: "Danno 2,7× che ignora completamente lo scudo nemico", cd: 3, role: "A", mult: 2.7, pierce: true },
    sh_hayato: { name: "Danza dei Petali", desc: "Aumenta del 30% i danni della squadra e ricarica le abilità", cd: 3, role: "C", buffDmg: 1.30, cdAll: true },

    // Detective di Campo
    dc_agata: { name: "Deduzione Risolta", desc: "Interrompe il nemico all'istante e dona +45 scudo a tutta la squadra", cd: 2, role: "P", interrupt: true, teamShield: 45 },
    dc_nina: { name: "Prima Pagina", desc: "Aumenta l'attacco di tutti gli alleati del +30% per 2 round", cd: 2, role: "C", buffDmg: 1.30 },

    // Trono di Cuoio
    tc_ardo: { name: "Muro della Casata", desc: "Attira i colpi per 2 round e ottiene +65 scudo", cd: 3, role: "P", taunt: 2, teamShield: 40, shield: 65 },
    tc_brunilde: { name: "Tackle Nobiliare", desc: "Danno 2,2× difensivo, interrompe il nemico e ottiene +35 scudo", cd: 2, role: "D", mult: 2.2, interrupt: true, shield: 35 },
    tc_ysolde: { name: "Vaticinio del Trono", desc: "Rivela tutti i punti deboli: la squadra infligge +35% danni per 2 round", cd: 3, role: "C", buffDmg: 1.35 },

    // Figlio del Titano
    ft_atlante: { name: "Impatto Cosmico", desc: "Danno 2,8× devastante ad altissima penetrazione", cd: 4, role: "A", mult: 2.8, pierce: true },
    ft_vega: { name: "Stella Cadente", desc: "Danno 2,4× e infligge Bruciatura su tutti i nemici", cd: 3, role: "A", mult: 2.4, burn: 3, aoe: true },
    ft_sam: { name: "Ancoraggio a Terra", desc: "Scudo +45 a tutta la squadra e purifica gli status negativi", cd: 3, role: "D", allShield: 45, cleanse: true },

    // Bucanieri del Biscotto
    gl_kraken: { name: "Maremoto d'Acquasanta", desc: "Danno 2,5× travolgente e brucia per 3 round", cd: 3, role: "A", mult: 2.5, burn: 3 },
    gl_barbabiscotto: { name: "Biscotto Rinvigorente", desc: "Scudo +40 a tutta la squadra e attira i colpi nemici", cd: 3, role: "D", taunt: 2, shield: 50, allShield: 20 },

    // Piramide del Sole
    my_kukulkan: { name: "Bagliore Solare Maya", desc: "Danno 2,4×, spezza gli scudi nemici e protegge la squadra (+30)", cd: 3, role: "D", mult: 2.4, pierce: true, allShield: 30 }
  };

  function getUnitAbility(u) {
    if (UNIQUE_SKILLS[u.id]) return Object.assign({}, UNIQUE_SKILLS[u.id]);
    const base = ABIL[u.role] || ABIL.A;
    return { name: base[0], desc: base[1], cd: 3, role: u.role };
  }

  // ------------------------------------------------------------ Reliquie Oniriche della Torre (Roguelike)
  const RELIQUES = [
    ["lente_inversione", "🔮 Lente dell'Inversione", "Annulla gli svantaggi di tratto (danno mai ridotto) e aumenta il vantaggio dal +30% al +45%"],
    ["calzari_mercurio", "👟 Calzari di Mercurio", "+25 Iniziativa alla tua squadra: attacchi quasi sempre per primo a inizio round"],
    ["gemma_vampirica", "💎 Gemma Vampirica", "I tuoi colpi critici convertono il 35% del danno inflitto in Scudo"],
    ["fischietto_oro", "🎺 Fischietto d'Oro", "Inizio round: 25% di probabilità di ricaricare 1 turno di abilità a tutti gli alleati"],
    ["cuore_vulcano", "🌋 Cuore di Vulcano", "I nemici che colpiscono un tuo difensore con Scudo subiscono 2 turni di Bruciatura 🔥"],
    ["prisma_astrale", "✨ Prisma Astrale", "Il Colpo di Squadra si carica il 35% più rapidamente"],
    ["corona_titani", "👑 Corona dei Titani", "+25% danni aggiuntivi contro i Boss e i nemici nei corridoi Elite"],
    ["scudo_faro", "🚨 Scudo del Faro", "Se un alleato scende sotto il 25% PV riceve uno Scudo di emergenza (+55 🛡️, 1 volta a scontro)"]
  ];

  // Identifica tecniche combinate di coppia presenti in squadra
  function findActiveCombo(team) {
    const sObj = S();
    const links = (sObj && sObj.LINKS) || [];
    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        const u1 = team[i], u2 = team[j];
        const match = links.find(([x, y]) => (x === u1.id && y === u2.id) || (x === u2.id && y === u1.id));
        if (match) {
          return { u1, u2, title: match[2] };
        }
      }
    }
    return null;
  }

  const EVENTS = [
    { t: "⛲ Fonte nel buio", p: "Un'acqua azzurra gorgoglia tra le crepe. Bere?", o: [["Bere", "50% salute piena · 50% crampi (−25%)", (run, rn) => { if (rn() < 0.5) { run.team.forEach((id) => delete run.hp[id]); return "L'acqua è fresca e buona: salute piena."; } adjRun(run, (u, c) => Math.max(1, c - Math.round(u.maxhp * 0.25))); return "Crampi: −25% di salute a tutti."; }], ["Passare", "non succede nulla", () => "Tiri dritto. La fonte gorgoglia dietro di voi."]] },
    { t: "🗿 Altare spezzato", p: "Un altare chiede un'offerta. Il sangue non è obbligatorio, ma aiuta.", o: [["Offrire sangue", "−20% salute a tutti · un potenziamento", (run, rn) => { adjRun(run, (u, c) => Math.max(1, c - Math.round(u.maxhp * 0.2))); return "L'altare brilla. " + giveRandomPerk(run, rn); }], ["Lasciar stare", "niente di niente", () => "Nessuno tocca niente. Meglio così."]] },
    { t: "🎲 Il banco del Custode", p: "Un omino con un cappello a tesa larga allunga un mazzo di carte.", o: [["Puntare tutto", "50% due potenziamenti · 50% −30% salute", (run, rn) => { if (rn() < 0.5) return giveRandomPerk(run, rn) + " " + giveRandomPerk(run, rn); adjRun(run, (u, c) => Math.max(1, c - Math.round(u.maxhp * 0.3))); return "Il mazzo era truccato. −30% di salute."; }], ["Puntare poco", "+20% salute sicuro", (run) => { healRun(run, 0.2); return "Vincita modesta: +20% di salute."; }]] },
    {
      t: "🔮 Il Santuario delle Reliquie",
      p: "Una statua di pietra con occhi di zaffiro tiene nelle mani una fiamma onirica. Offre un patto.",
      o: [
        ["Afferrare la fiamma", "−20% salute a tutti · ottieni una Reliquia", (run, rn) => {
          adjRun(run, (u, c) => Math.max(1, c - Math.round(u.maxhp * 0.2)));
          run.relics = run.relics || [];
          const freeR = RELIQUES.filter((x) => !run.relics.includes(x[0]));
          if (!freeR.length) return "La fiamma si dissolve in calore: hai già tutte le reliquie oniriche.";
          const rChosen = freeR[Math.floor(rn() * freeR.length)];
          run.relics.push(rChosen[0]);
          return `La fiamma si condensa in una reliquia: ${rChosen[1]}!`;
        }],
        ["Meditare in silenzio", "+25% salute a tutta la squadra", (run) => {
          healRun(run, 0.25);
          return "La quiete della sala rinvigorisce i tuoi giocatori (+25% salute).";
        }]
      ]
    },
    {
      t: "⚡ La Forgia delle Ombre",
      p: "Un fabbro spettrale batte l'incudine nel buio. Ti osserva senza dire una parola.",
      o: [
        ["Temprare gli scarpini", "+12% danni per il resto della salita", (run) => {
          run.perks.push("fuoco");
          return "Il ferro stride nel fuoco: le tue conclusioni saranno più brucianti (+12% danni).";
        }],
        ["Consacrare i guanti", "+35 scudo iniziale a tutti a ogni piano", (run) => {
          run.perks.push("telo");
          return "Gli scudi della squadra sono avvolti da una benedizione d'acciaio (+35 scudo iniziale).";
        }]
      ]
    }
  ];
  function adjRun(run, fn) { const ar = load(); ownTeam({ team: run.team }, ar).forEach((o) => { const u = mk(o.c, "p", { st: o.st, m: o.m }), cur = run.hp[u.id] == null ? u.maxhp : run.hp[u.id]; run.hp[u.id] = Math.min(u.maxhp, fn(u, cur)); }); }
  function healRun(run, frac) { adjRun(run, (u, c) => (c <= 0 ? Math.round(u.maxhp * 0.35) : c + Math.round(u.maxhp * frac))); }
  function giveRandomPerk(run, rn) { const free = ["fuoco", "scudo", "telo", "pronte"].filter((k) => !run.perks.includes(k)); if (!free.length) { healRun(run, 0.3); return "Hai già tutto: +30% di salute."; } const k = free[Math.floor(rn() * free.length)]; run.perks.push(k); const P = PERKS.find((x) => x[0] === k); return "Ottieni " + P[1] + "."; }
  const PERKS = [
    ["fuoco", "🔥 Colpo caldo", "+12% danni per il resto della salita"], ["scudo", "🛡️ Cuore di roccia", "−10% danni subiti per il resto della salita"],
    ["cura", "💚 Cura completa", "Tutta la squadra torna a piena salute"], ["torna", "✨ Ritorno", "Un caduto rientra al 50%"], ["pronte", "⚡ Abilità pronte", "Tutte le abilità subito disponibili"], ["telo", "🧤 Scudo iniziale", "+35 scudo a tutti a ogni piano"],
  ];
  let OV = null, BACK = null, B = null, FAST = false;
  // ------------------------------------------------------------ dati
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { xp: r.xp && typeof r.xp === "object" ? r.xp : {}, tier: Math.max(1, r.tier | 0), best: r.best | 0, run: r.run && r.run.team ? r.run : null, daily: r.daily || { d: "", won: false }, wins: r.wins | 0, bosses: r.bosses | 0, deep: r.deep !== false }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  const today = () => new Date().toISOString().slice(0, 10);
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const name = (id) => safe(() => S().name(id), id);
  const trOf = (c) => (c.at >= c.df && c.at >= c.te ? "at" : c.df >= c.te ? "df" : "te");
  // ------------------------------------------------------------ unità
  function getTeamMod(r) {
    const s = S();
    if (!s) return { k: "rombo", m: null, sin: false };
    const rd = r || s._load();
    const k = rd.modulo || "rombo";
    const m = (s.MODULI && s.MODULI[k]) || null;
    const sin = s.modSintonia ? s.modSintonia(k, rd.team) : false;
    return { k, m, sin };
  }
  function mk(c, side, o) {
    const m = o.m || 1, st = o.st || { at: c.at, df: c.df, te: c.te };
    const at = Math.round(st.at * m * (o.atm || 1)), df = Math.round(st.df * m * (o.dfm || 1)), te = Math.round(st.te * m * (o.tem || 1));
    const hp = Math.round((70 + df * 1.1 + te * 0.4) * (o.hpm || 1));
    const role = ABIL[c.role] ? c.role : { at: "A", te: "C", df: "D" }[trOf({ at, df, te })];
    const u = { id: c.id, side, n: name(c.id), role, rar: c.rar, tr: trOf({ at, df, te }), at, df, te, maxhp: hp, hp: o.hp != null ? Math.max(1, Math.min(hp, o.hp)) : hp, shield: 0, cd: 1, taunt: 0, def: false, boss: !!o.boss, burn: 0, stun: 0, intent: null, broken: false, ph: 1 };
    u.skill = getUnitAbility(u);
    return u;
  }
  function ownTeam(r, ar) {
    const I = S().intesa(r.team).n, b = 1 + I * 0.015;
    return r.team.map((id) => { const c = S().BY[id]; if (!c) return null; const e = S().eff(c), lv = lvOf(ar.xp[id] | 0); return { c, st: e, m: b * (1 + (lv - 1) * 0.04) }; }).filter(Boolean);
  }
  function enemyTeam(rand, tier, theme, n) {
    const all = S().CARDS.filter((c) => !theme || c.saga === theme), pool = all.length >= 3 ? all : S().CARDS, out = [], used = {};
    const want = ["D", "A", "C", "A", "P"];
    for (let i = 0; i < (n || 5); i++) {
      let list = pool.filter((c) => c.role === want[i] && !used[c.id]); if (!list.length) list = pool.filter((c) => !used[c.id]); if (!list.length) list = S().CARDS.filter((c) => !used[c.id]);
      const c = list[Math.floor(rand() * list.length)]; used[c.id] = 1; out.push(c);
    }
    return out;
  }
  // ------------------------------------------------------------ battaglia
  function start(cfg) {
    const r = load(), sLoad = S()._load(), tMod = getTeamMod(sLoad);
    const modK = tMod.k, sin = tMod.sin;
    let atm = 1, dfm = 1, tem = 1, hpm = (cfg.mod && cfg.mod.hp) || 1;
    let initShield = 0;
    if (modK === "rombo") { tem *= (sin ? 1.20 : 1.10); }
    else if (modK === "catenaccio") { dfm *= (sin ? 1.25 : 1.15); initShield += (sin ? 40 : 25); }
    else if (modK === "tridente") { atm *= (sin ? 1.25 : 1.15); }
    else if (modK === "quadrato") { hpm *= 1.15; atm *= 1.08; dfm *= 1.08; tem *= 1.08; }
    else if (modK === "fortezza") { hpm *= 1.20; dfm *= (sin ? 1.25 : 1.15); initShield += (sin ? 35 : 20); }

    const team = (cfg.team || ownTeam(sLoad, r)).map((o) => {
      const u = mk(o.c, "p", { st: o.st, m: o.m, hp: cfg.hp && cfg.hp[o.c.id], hpm, atm, dfm, tem });
      return u;
    });
    const tm = cfg.tierM || 1, foes = cfg.foes.map((c, i) => mk(c, "e", { m: tm, boss: cfg.boss && i === 0, hpm: (cfg.boss && i === 0 ? 2.2 : 1) * ((cfg.mod && cfg.mod.hp) || 1) }));
    const P = cfg.perks || [];
    const Rels = cfg.relics || [];
    team.forEach((u) => {
      if (initShield > 0) u.shield += initShield;
      if (modK === "rombo" && sin) u.cd = Math.max(0, u.cd - 1);
      if (P.includes("telo")) u.shield += 35;
      if (P.includes("pronte")) u.cd = 0;
      if (cfg.mod && cfg.mod.cd) u.cd = Math.max(0, u.cd - 1);
    });
    const md = cfg.mod || {}; foes.forEach((f) => { if (md.foeSh) f.shield = md.foeSh; if (md.foeCd) f.cd = 0; });
    const activeCombo = findActiveCombo(team);
    B = { deep: cfg.deep != null ? !!cfg.deep : load().deep, gauge: (modK === "quadrato" ? 25 : 0), team, foes, round: 0, order: [], i: -1, cur: null, mode: null, buffT: 0, buffE: 0, over: null, log: [], cfg, perks: P, relics: Rels, rand: cfg.seed != null ? rng(cfg.seed) : Math.random, wait: null, modInfo: tMod, activeCombo };
    render();
    const mLabel = tMod.m ? tMod.m.name : modK;
    let introSay = `📋 Modulo ${mLabel}${sin ? " ✨ Sintonia Attiva" : ""}`;
    if (activeCombo) introSay += ` · ⚡ Doppio Colpo: ${activeCombo.title}`;
    say(introSay);
    nextRound();
    return B;
  }
  const alive = (a) => a.filter((u) => u.hp > 0);
  const delay = (fn, ms) => { if (FAST) return fn(); B.wait = setTimeout(fn, ms); };
  function nextRound() {
    B.round++;
    B.team.concat(B.foes).forEach((u) => {
      if (u.hp > 0) {
        if (u.cd > 0) u.cd--;
        if (u.taunt > 0) u.taunt--;
        u.def = false;
        if (B.deep && u.burn > 0) {
          const d = Math.max(4, Math.round(u.maxhp * 0.06));
          u.hp = Math.max(0, u.hp - d);
          u.burn--;
          pop(u, "-" + d + "🔥", "bad");
        }
      }
    });
    // Reliquia Fischietto d'Oro: chance di ricaricare 1 turno abilità alla squadra
    if (B.relics && B.relics.includes("fischietto_oro") && B.rand() < 0.25) {
      alive(B.team).forEach((u) => { if (u.cd > 0) u.cd--; });
      say("🎺 Fischietto d'Oro: le abilità della squadra si ricaricano prima!");
    }
    // Ordine turni (con Calzari di Mercurio per la squadra)
    B.order = alive(B.team).concat(alive(B.foes)).map((u) => {
      const prio = (u.side === "p" && B.relics && B.relics.includes("calzari_mercurio")) ? 25 : 0;
      return [u, u.te + B.rand() * 14 + prio];
    }).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
    B.i = -1;
    if (B.deep) {
      const ex = [];
      B.order.forEach((u, k) => { if (u.boss && u.ph >= 3) ex.push(k); });
      ex.reverse().forEach((k) => B.order.splice(k + 1, 0, B.order[k]));
      B.foes.forEach((u) => { u.intent = u.hp > 0 ? plan(u) : null; u.broken = false; });
    }
    if (B.buffT > 0) B.buffT--; if (B.buffE > 0) B.buffE--;
    say(`Round ${B.round}`); step();
  }
  function say(t) { B.log.push(t); const el = OV && OV.querySelector(".arLog"); if (el) el.innerHTML = esc(t); }
  function step() {
    if (!B || B.over) return;
    if (!alive(B.foes).length) return end("win"); if (!alive(B.team).length) return end("lose");
    B.i++; if (B.i >= B.order.length) return nextRound();
    const u = B.order[B.i]; if (u.hp <= 0) return step();
    B.cur = u; B.mode = null;
    if (B.deep && u.stun > 0) { u.stun--; u.intent = null; say(`${u.n} è stordito e salta il turno`); pop(u, "💫", "bad"); render(); return delay(() => step(), 600); }
    if (u.side === "p") { render(); return; } // tocca al giocatore
    render(); delay(() => enemyAct(u), 650);
  }
  function enemyAct(u) {
    if (!B || B.over || u.hp <= 0) return step();
    const T = alive(B.team), tk = T.filter((x) => x.taunt > 0), pool = tk.length ? tk : T, I = u.intent; u.intent = null;
    if (u.broken) { u.broken = false; say(`${u.n} perde l'attacco: era stato interrotto`); return finish(u); }
    const weak = pool.slice().sort((a, b) => a.hp - b.hp)[0], tgt = (I && pool.find((x) => x.id === I.t)) || (B.rand() < 0.55 ? weak : pool[Math.floor(B.rand() * pool.length)]);
    if (I ? I.k === "abl" && u.cd <= 0 : u.cd <= 0 && B.rand() < 0.6) ability(u, tgt); else attack(u, tgt);
  }
  // intenzione nemica visibile a inizio round (Battaglia a fondo)
  function plan(u) {
    const T = alive(B.team), tk = T.filter((x) => x.taunt > 0), pool = tk.length ? tk : T; if (!pool.length) return null;
    const weak = pool.slice().sort((a, b) => a.hp - b.hp)[0], tgt = B.rand() < 0.55 ? weak : pool[Math.floor(B.rand() * pool.length)];
    return { k: u.cd <= 0 && B.rand() < 0.6 ? "abl" : "atk", t: tgt.id };
  }
  function dmgCalc(a, d, mult) {
    const raw = a.at * 0.5 * (mult || 1) - d.df * 0.12;
    let trM = BEATS[a.tr] === d.tr ? 1.3 : BEATS[d.tr] === a.tr ? 0.8 : 1;
    // Reliquia Lente dell'Inversione: rimuove lo svantaggio a favore del giocatore
    if (a.side === "p" && B.relics && B.relics.includes("lente_inversione")) {
      if (trM < 1) trM = 1.0;
      else if (trM > 1) trM = 1.45;
    }
    const cfgm = (B.cfg.mod && B.cfg.mod.dmg) || 1;
    const modK = B.modInfo ? B.modInfo.k : "";
    const sin = B.modInfo ? B.modInfo.sin : false;
    let critChance = Math.min(0.5, a.te / 500 + ((B.cfg.mod && B.cfg.mod.crit) || 0));
    if (a.side === "p" && modK === "rombo" && a.tr === "te") critChance += (sin ? 0.12 : 0.06);
    const crit = B.rand() < critChance;
    let buff = (a.side === "p" ? (B.buffT > 0 ? 1.25 : 1) * (B.perks.includes("fuoco") ? 1.12 : 1) : B.buffE > 0 ? 1.25 : 1);
    // Reliquia Corona dei Titani: +25% danni ai boss o corridoi elite
    if (a.side === "p" && B.relics && B.relics.includes("corona_titani") && (d.boss || B.cfg.elite)) {
      buff *= 1.25;
    }
    const critMult = (a.side === "p" && modK === "tridente") ? (sin ? 1.75 : 1.6) : 1.5;
    let v = Math.max(6, raw) * trM * cfgm * buff * (0.92 + B.rand() * 0.16) * (crit ? critMult : 1);
    if (d.side === "p" && B.perks.includes("scudo")) v *= 0.9;
    if (d.side === "p" && modK === "catenaccio") v *= (sin ? 0.88 : 0.92);
    if (d.def) v *= 0.5;
    return { v: Math.max(1, Math.round(v)), crit, trM };
  }
  function hit(a, d, mult) {
    const x = dmgCalc(a, d, mult); let v = x.v;
    const modK = B.modInfo ? B.modInfo.k : "";
    const sin = B.modInfo ? B.modInfo.sin : false;
    if (d.side === "p" && modK === "fortezza" && d.shield > 0 && a.hp > 0 && v > 0) {
      const ret = Math.max(2, Math.round(v * (sin ? 0.18 : 0.10)));
      a.hp = Math.max(0, a.hp - ret); pop(a, "-" + ret + "🛡️", "crit");
      say(`🏰 Contrattacco Fortezza: ${a.n} subisce ${ret} danni di riflesso!`);
    }
    // Reliquia Cuore di Vulcano: chi colpisce uno scudo alleato subisce bruciatura
    if (d.side === "p" && B.relics && B.relics.includes("cuore_vulcano") && d.shield > 0 && a.hp > 0) {
      a.burn = Math.max(a.burn, 2);
      pop(a, "🔥", "bad");
      say(`🌋 Cuore di Vulcano: ${a.n} prende fuoco colpendo lo scudo!`);
    }
    if (d.shield > 0) { const s = Math.min(d.shield, v); d.shield -= s; v -= s; }
    d.hp = Math.max(0, d.hp - v); pop(d, "-" + x.v, x.crit ? "crit" : x.trM > 1 ? "good" : x.trM < 1 ? "bad" : "");
    // Reliquia Gemma Vampirica: i colpi critici convertono il 35% del danno in scudo
    if (a.side === "p" && B.relics && B.relics.includes("gemma_vampirica") && x.crit && v > 0) {
      const vamp = Math.max(3, Math.round(v * 0.35));
      a.shield += vamp; pop(a, "+" + vamp + "🛡️", "good");
      say(`💎 Gemma Vampirica: ${a.n} converte il critico in +${vamp} scudo!`);
    }
    // Reliquia Scudo del Faro: protezione d'emergenza sotto il 25% PV
    if (d.side === "p" && B.relics && B.relics.includes("scudo_faro") && !d._faroUsed && d.hp <= d.maxhp * 0.25 && d.hp > 0) {
      d._faroUsed = true; d.shield += 55; pop(d, "+55🛡️ FARO", "good");
      say(`🚨 Scudo del Faro: barriera d'emergenza attivata su ${d.n}!`);
    }
    if (B.deep) {
      const gRate = (a.side === "p" && modK === "tridente") ? (sin ? 1.3 : 1.15) : 1;
      const relicRate = (a.side === "p" && B.relics && B.relics.includes("prisma_astrale")) ? 1.35 : 1;
      if (a.side === "p") B.gauge = Math.min(100, B.gauge + Math.min(16, 4 + (x.v / d.maxhp) * 60) * gRate * relicRate); else B.gauge = Math.min(100, B.gauge + 5);
      if (d.boss && d.ph < 3 && d.hp <= 0) d.hp = 1;
      if (d.hp > 0) {
        if (x.crit && a.tr === "te") { if (d.boss) pop(d, "resiste", "bad"); else { d.stun = 1; d.intent = null; pop(d, "💫", "bad"); } }
        if (d.side === "e" && d.intent && v >= d.maxhp * 0.3) { d.intent = null; d.broken = true; pop(d, "interrotto!", "crit"); }
        // Fasi multiple del Boss
        if (d.boss && d.ph < 2 && d.hp <= d.maxhp * 0.5) {
          d.ph = 2; d.at = Math.round(d.at * 1.25);
          const fl = (B.cfg && B.cfg.floor) || 10;
          const shAdd = fl >= 30 ? 120 : fl >= 20 ? 85 : 55;
          d.shield += shAdd; d.cd = 0;
          say(`👑 ${d.n} entra nella FASE 2! Ottiene +${shAdd} scudo e scatena un'onda d'urto`);
          pop(d, "FASE 2", "crit");
          const shock = fl >= 30 ? 14 : fl >= 20 ? 10 : 6;
          alive(B.team).forEach((tm) => { tm.hp = Math.max(1, tm.hp - shock); pop(tm, `-${shock}💥`, "bad"); });
        }
        else if (d.boss && d.ph < 3 && d.ph >= 2 && d.hp <= d.maxhp * 0.2) {
          d.ph = 3; d.at = Math.round(d.at * 1.18); d.cd = 0;
          say(`👑 ${d.n} è furioso: FASE 3 attiva, agisce due volte per round!`);
          pop(d, "FURIA", "crit");
        }
      }
    }
    return x;
  }
  function attack(a, d) {
    const x = hit(a, d, 1); say(`${a.n} colpisce ${d.n}: ${x.v}${x.crit ? " critico!" : x.trM > 1 ? " (tratto favorevole)" : x.trM < 1 ? " (tratto sfavorevole)" : ""}${d.hp <= 0 ? " · KO" : ""}`);
    shake(d); finish(a);
  }
  function ability(a, tgt) {
    const ab = getUnitAbility(a); a.cd = ab.cd || 3; cutin(a, ab.name);
    const go = () => {
      if (!B || B.over) return;
      if (ab.pierce && tgt && tgt.shield > 0) { tgt.shield = 0; pop(tgt, "SCUDO INFRANTO", "crit"); }
      if (ab.role === "A") {
        const mult = ab.mult || 2.2;
        const x = hit(a, tgt, mult);
        say(`${a.n}: ${ab.name} su ${tgt.n} (${x.v})${tgt.hp <= 0 ? " · KO" : ""}`);
        shake(tgt);
        if (B.deep && tgt.hp > 0) {
          tgt.burn = Math.max(tgt.burn, ab.burn || 3);
          pop(tgt, "🔥", "bad");
        }
        if (ab.stun && tgt.hp > 0 && !tgt.boss) { tgt.stun = 1; tgt.intent = null; pop(tgt, "💫", "bad"); }
        if (ab.gauge) { B.gauge = Math.min(100, B.gauge + ab.gauge); }
        if (ab.aoe) {
          alive(B.foes).filter((f) => f !== tgt).forEach((f) => { hit(a, f, 0.9); shake(f); });
        }
      }
      else if (ab.role === "C") {
        if (ab.mult && tgt) { const x = hit(a, tgt, ab.mult); say(`${a.n}: ${ab.name} su ${tgt.n} (${x.v})`); shake(tgt); }
        if (a.side === "p") B.buffT = 2; else B.buffE = 2;
        say(`${a.n}: ${ab.name}. Danni della squadra +${ab.buffDmg ? Math.round((ab.buffDmg - 1) * 100) : 25}%`);
        if (ab.cleanse) { alive(a.side === "p" ? B.team : B.foes).forEach((u) => { u.burn = 0; u.stun = 0; }); }
        if (ab.cdAll) { alive(a.side === "p" ? B.team : B.foes).forEach((u) => { if (u.cd > 0) u.cd--; }); }
        if (ab.interrupt && tgt) { tgt.intent = null; tgt.broken = true; pop(tgt, "interrotto!", "crit"); }
        if (ab.allShield) { alive(a.side === "p" ? B.team : B.foes).forEach((u) => { u.shield += ab.allShield; pop(u, `+${ab.allShield}🛡`, "good"); }); }
        if (ab.gauge) { B.gauge = Math.min(100, B.gauge + ab.gauge); }
      }
      else if (ab.role === "D") {
        a.taunt = ab.taunt || 2;
        const sh = ab.shield || 45;
        a.shield += sh;
        if (ab.allShield) { alive(a.side === "p" ? B.team : B.foes).forEach((u) => { u.shield += ab.allShield; pop(u, `+${ab.allShield}🛡`, "good"); }); }
        if (ab.cleanse) { alive(a.side === "p" ? B.team : B.foes).forEach((u) => { u.burn = 0; u.stun = 0; }); }
        if (ab.interrupt && tgt) { tgt.intent = null; tgt.broken = true; pop(tgt, "interrotto!", "crit"); }
        say(`${a.n}: ${ab.name}. Tutti i colpi su di lui (+${sh} scudo)`); pop(a, `+${sh}🛡`, "good");
      }
      else {
        const sh = ab.teamShield || 30;
        alive(a.side === "p" ? B.team : B.foes).forEach((u) => { u.shield += sh; pop(u, `+${sh}🛡`, "good"); });
        if (ab.cleanse) { alive(a.side === "p" ? B.team : B.foes).forEach((u) => { u.burn = 0; u.stun = 0; }); }
        say(`${a.n}: ${ab.name}. Scudo +${sh} a tutta la squadra`);
      }
      finish(a);
    };
    FAST ? go() : (B.wait = setTimeout(go, 950));
  }
  function superMove(a) {
    if (B.activeCombo) {
      cutinDuo(B.activeCombo.u1, B.activeCombo.u2, B.activeCombo.title);
      const go = () => {
        if (!B || B.over) return;
        alive(B.foes).forEach((f) => {
          hit(a, f, 1.85);
          if (f.hp > 0) {
            f.burn = Math.max(f.burn, 3);
            f.intent = null;
            f.broken = true;
            pop(f, "INTERROTTO!", "crit");
            pop(f, "🔥", "bad");
          }
          shake(f);
        });
        alive(B.team).forEach((tm) => {
          tm.shield += 50;
          tm.burn = 0;
          tm.stun = 0;
          pop(tm, "+50🛡️ PURIFICA", "good");
        });
        B.gauge = 0;
        say(`🌟 ATTACCO COMBINATO! ${B.activeCombo.u1.n} & ${B.activeCombo.u2.n} travolgono il campo con «${B.activeCombo.title}»!`);
        finish(a);
      };
      FAST ? go() : (B.wait = setTimeout(go, 1250));
    } else {
      cutin(a, "Colpo di squadra");
      const go = () => {
        if (!B || B.over) return;
        alive(B.foes).forEach((f) => { hit(a, f, 1.3); if (f.hp > 0) { f.burn = Math.max(f.burn, 2); pop(f, "🔥", "bad"); } shake(f); });
        B.gauge = 0; say(`Colpo di squadra! ${a.n} guida l'assalto su tutti i nemici`); finish(a);
      };
      FAST ? go() : (B.wait = setTimeout(go, 950));
    }
  }
  function defend(a) {
    const modK = B.modInfo ? B.modInfo.k : "";
    const extraSh = (modK === "quadrato" || modK === "fortezza") ? 18 : 10;
    a.def = true; a.shield += extraSh; pop(a, `+${extraSh}🛡`, "good");
    say(`${a.n} si copre (+${extraSh} scudo)`); finish(a);
  }
  function finish(a) { render(); delay(() => step(), 420); }
  function end(res) { B.over = res; render(); const f = B.cfg.onEnd; setTimeout(() => f && f(res, B), FAST ? 0 : 900); }
  // ------------------------------------------------------------ azioni del giocatore (anche per i test)
  function act(kind, targetId) {
    if (!B || B.over || !B.cur || B.cur.side !== "p") return false; const u = B.cur;
    if (kind === "defend") { defend(u); return true; }
    if (kind === "super") { if (!B.deep || B.gauge < 100) return false; superMove(u); return true; }
    const T = alive(B.foes), tk = T.filter((x) => x.taunt > 0), pool = tk.length ? tk : T;
    const t = pool.find((x) => x.id === targetId) || pool.slice().sort((a, b) => a.hp - b.hp)[0];
    if (kind === "attack") { attack(u, t); return true; }
    if (kind === "ability") { if (u.cd > 0) return false; ability(u, t); return true; }
    return false;
  }
  // ------------------------------------------------------------ vista
  function css() {
    if (document.getElementById("arCss")) return; const st = document.createElement("style"); st.id = "arCss";
    st.textContent = `.arOv{position:fixed;inset:0;z-index:312;background:radial-gradient(ellipse at 50% 0,#2a1d4a,#0c0818 70%);color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto}
.arOv .wrap{max-width:560px;margin:0 auto;padding:10px 10px 28px}.arOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#0c0818;padding:6px 0;z-index:3}.arOv h2{margin:0;font:900 20px system-ui;color:#ffd23f}.arOv .x{width:40px;height:40px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#fff;font-size:17px}
.arOv .sum{font-size:13px;line-height:1.45;opacity:.9}.arOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}
.arOv .big{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.arOv .big button,.arOv .one{min-height:56px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px}.arOv .big button small{display:block;font-weight:400;font-size:11px;opacity:.75;margin-top:2px}.arOv button:disabled{opacity:.4}
.arOv .one{width:100%;margin:6px 0}.arOv .one small{display:block;font-weight:400;font-size:11px;opacity:.75}
.arRow{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:6px 0}.arU{position:relative;border-radius:9px;background:linear-gradient(160deg,var(--tc),#120e1e 80%);border:2px solid var(--tc);padding:3px;text-align:center;font-size:9.5px;overflow:hidden;transition:transform .15s,opacity .3s}
.arU .im{aspect-ratio:1;border-radius:6px;background:#0a0814;overflow:hidden;display:flex;align-items:center;justify-content:center}.arU .im img{width:100%;height:100%;object-fit:cover}.arU .nm{font-weight:800;line-height:1.1;min-height:2.2em;margin-top:2px}
.arU .hp{height:6px;border-radius:3px;background:#000a;margin-top:2px;overflow:hidden}.arU .hp i{display:block;height:100%;background:linear-gradient(90deg,#e8603a,#7ad87a)}.arU .sh{position:absolute;top:2px;left:3px;font-size:9px;font-weight:800;color:#9ad8ff;text-shadow:0 1px 0 #000}.arU .tag{position:absolute;top:2px;right:3px;font-size:10px}
.arU.cur{box-shadow:0 0 0 3px #ffd23f,0 0 14px #ffd23f88;transform:translateY(-3px)}.arU.ko{opacity:.3;filter:grayscale(1)}.arU.tg{cursor:pointer;animation:arPulse .8s infinite}.arU.shk{animation:arShake .3s}.arU.boss{box-shadow:0 0 0 2px #ff5a5a,0 0 12px #ff5a5a88}
@keyframes arPulse{50%{box-shadow:0 0 0 3px #ff7a7a}}@keyframes arShake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.arPop{position:absolute;left:50%;top:30%;transform:translateX(-50%);font:900 15px system-ui;color:#fff;text-shadow:0 1px 0 #000,0 0 4px #000;animation:arUp .9s forwards;pointer-events:none;z-index:4}.arPop.crit{color:#ffd23f;font-size:19px}.arPop.good{color:#7ad87a}.arPop.bad{color:#9aa5b1}
@keyframes arUp{to{transform:translate(-50%,-34px);opacity:0}}
.arLog{min-height:36px;font-size:13px;text-align:center;margin:6px 0;padding:6px;background:#1a1428;border-radius:8px}.arHd{display:flex;justify-content:space-between;align-items:center;font-size:12px;opacity:.85}
.arModTag{display:inline-block;background:#2a1b4e;border:1px solid #7c3aed;color:#e9d5ff;border-radius:6px;padding:1px 6px;font-size:10.5px;font-weight:700;margin-left:6px;vertical-align:middle}
.arRelicTag{display:inline-block;background:#2d1b00;border:1px solid #eab308;color:#fef08a;border-radius:6px;padding:2px 7px;font-size:11px;font-weight:700;margin:2px 4px 2px 0}
.arRelicRow{margin:8px 0;padding:6px 10px;background:#1b1328;border:1px solid #5b3d88;border-radius:8px;font-size:12px}
.arModCard{background:#181226;border:1px solid #3b2d5a;border-radius:10px;padding:8px 10px;margin:8px 0;font-size:11.5px;line-height:1.4}
.arModCardHd{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:4px}
.arModCardHd b{color:#ffd23f}
.arModCardHd .ok{color:#7ad87a;font-weight:800;font-size:11px}
.arModCardHd .warn{color:#ffd23f;font-weight:800;font-size:11px}
.arModCardTxt{color:#d8cde8;font-size:11px}
.arModBtn{background:#2a1e48;border:1px solid #7c3aed;color:#d8b4fe;font:700 11px system-ui;padding:3px 8px;border-radius:6px;cursor:pointer;transition:all .15s}
.arModBtn:hover{background:#7c3aed;color:#fff}
.arAct{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}.arAct button{min-height:50px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 13px system-ui;padding:6px}.arAct button small{display:block;font-weight:400;font-size:10px;opacity:.75}.arAct button:disabled{opacity:.4}
.arCut{position:absolute;left:0;right:0;top:34%;height:92px;overflow:hidden;z-index:6;pointer-events:none;background:linear-gradient(90deg,#000c,#3a1a6ccc 40%,#000c);border-top:3px solid #ffd23f;border-bottom:3px solid #ffd23f;animation:arCut 1.1s forwards;display:flex;align-items:center;gap:12px;padding:0 14px}
.arCut.duo{background:linear-gradient(90deg,#000c,#581c87ee 40%,#831843ee 60%,#000c);border-color:#ffd23f;box-shadow:0 0 25px rgba(255,210,63,0.5)}
.duoImgs{display:flex;gap:6px;flex:none}
.duoImgs img{height:72px;width:72px;object-fit:cover;border-radius:50%;border:2px solid #ffd23f}
.arCut img{height:80px;width:80px;object-fit:cover;object-position:50% 20%;border-radius:50%;border:2px solid #ffd23f;animation:arSl .5s ease-out}.arCut b{font:900 22px system-ui;color:#ffd23f;text-shadow:0 2px 0 #000}.arCut span{display:block;font-size:12px;color:#fff}
@keyframes arCut{0%{opacity:0;transform:scaleY(.1)}12%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0}}@keyframes arSl{from{transform:translateX(-120px)}}
.arU .st{position:absolute;left:3px;top:13px;font-size:9px;font-weight:800;background:#000a;border-radius:4px;padding:0 2px}.arU .st+.st{top:23px}.arU .it{position:absolute;left:0;right:0;bottom:30px;background:#000c;color:#ffd23f;font-size:9px;font-weight:800;border-radius:4px;padding:1px 0}.arU .aim{position:absolute;left:0;right:0;bottom:30px;background:#a01818d0;color:#fff;font-size:9px;font-weight:800;border-radius:4px;padding:1px 0}
.arGa{height:6px;border-radius:3px;background:#000a;margin:2px 0 4px;overflow:hidden}.arGa i{display:block;height:100%;background:linear-gradient(90deg,#3a8ad8,#ffd23f)}.arAct .sup{grid-column:1/-1;border-color:#ffd23f}
.arAct .sup.combo{background:linear-gradient(90deg,#581c87,#831843);border-color:#ffd23f;box-shadow:0 0 10px #ec489955}
.arBt{position:relative}.arRes{text-align:center;margin:14px 0}.arRes h3{font:900 24px system-ui;margin:4px 0}.arPerk{display:grid;gap:6px}
@media (prefers-reduced-motion:reduce){.arU.tg,.arCut,.arPop{animation:none!important}}`;
    document.head.appendChild(st);
  }
  function shell(title) { css(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "arOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { if (B && !B.over && B.cfg.quit) return B.cfg.quit(); const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function close() { if (B && B.wait) clearTimeout(B.wait); B = null; if (OV) { OV.remove(); OV = null; } }
  const img = (id) => safe(() => S().port(id), null);
  function stat(u) {
    if (!B || !B.deep || u.hp <= 0) return "";
    let h = (u.burn > 0 ? `<span class="st">🔥${u.burn}</span>` : "") + (u.stun > 0 ? `<span class="st">💫</span>` : "");
    if (u.side === "e" && u.intent) { const fog = B.cfg.mod && B.cfg.mod.fog, t = B.team.find((x) => x.id === u.intent.t); h += `<span class="it">${fog ? "❓" : (u.intent.k === "abl" ? "✨" : "⚔️") + (t ? "→" + esc(t.n.split(" ")[0].slice(0, 6)) : "")}</span>`; }
    if (u.side === "p" && !(B.cfg.mod && B.cfg.mod.fog)) { const n = B.foes.filter((f) => f.hp > 0 && f.intent && f.intent.t === u.id).length; if (n) h += `<span class="aim">🎯×${n}</span>`; }
    return h;
  }
  function unit(u, cls, extra) {
    const t = TR[u.tr];
    return `<div class="arU ${cls || ""}${u.hp <= 0 ? " ko" : ""}${u.boss ? " boss" : ""}" data-u="${u.id}" data-s="${u.side}" style="--tc:${t[2]}">${u.shield > 0 ? `<span class="sh">🛡${u.shield}</span>` : ""}<span class="tag">${u.taunt > 0 ? "🎯" : t[1]}</span>${stat(u)}<div class="im">${img(u.id) ? `<img alt="" src="${img(u.id)}">` : "?"}</div><div class="nm">${esc(u.n)}</div><div class="hp"><i style="width:${Math.round((u.hp / u.maxhp) * 100)}%"></i></div></div>`;
  }
  function render() {
    if (!B) return; if (!OV || !OV.querySelector(".arBt")) shell(B.cfg.title || "⚔️ Arena dei Sogni");
    const body = OV.querySelector(".body"), u = B.cur, mine = u && u.side === "p" && !B.over;
    const tk = alive(B.foes).filter((x) => x.taunt > 0), tg = mine && B.mode === "attack";
    const curAb = u ? getUnitAbility(u) : { name: "Abilità", desc: "", cd: 0 };
    const superBtn = B.deep ? `<button type="button" class="sup${B.activeCombo ? " combo" : ""}" data-a="super" ${B.gauge >= 100 ? "" : "disabled"}>${B.activeCombo ? `⚡ ${esc(B.activeCombo.title)}` : "💥 Colpo di squadra"}<small>${B.gauge >= 100 ? (B.activeCombo ? `Combo ${esc(B.activeCombo.u1.n)} &amp; ${esc(B.activeCombo.u2.n)}: travolge tutti` : "pronto: colpisce tutti i nemici") : "carica " + Math.round(B.gauge) + "/100"}</small></button>` : "";
    const act = mine ? `<div class="arAct"><button type="button" data-a="attack">⚔️ Attacca<small>${B.mode === "attack" ? "scegli il bersaglio" : "colpo normale"}</small></button><button type="button" data-a="ability" ${u.cd > 0 ? "disabled" : ""}>${esc(curAb.name)}<small>${u.cd > 0 ? `pronta tra ${u.cd}` : esc(curAb.desc)}</small></button><button type="button" data-a="defend">🛡️ Difendi<small>danni −50%, +10 scudo</small></button>${superBtn}</div>` : `<div class="arAct" style="opacity:.5"><button disabled>…</button><button disabled>…</button><button disabled>…</button></div>`;
    const mTag = B.modInfo && B.modInfo.m ? `<span class="arModTag" title="Modulo tattico attivo">📋 ${esc(B.modInfo.m.name)}${B.modInfo.sin ? " ✨" : ""}</span>` : "";
    const relTag = (B.relics && B.relics.length) ? `<span class="arRelicTag" title="Reliquie Oniriche attive">🏆 ${B.relics.length} reliquie</span>` : "";
    body.innerHTML = `<div class="arBt"><div class="arHd"><span>${esc(B.cfg.sub || "")}${mTag}${relTag}</span><span>Round ${B.round}${B.buffT > 0 ? " · 📣 +25%" : ""}</span></div><div class="arRow" data-r="e">${B.foes.map((x) => unit(x, (tg && x.hp > 0 && (!tk.length || x.taunt > 0) ? "tg " : "") + (u === x ? "cur" : ""))).join("")}</div><div class="arLog">${esc(B.log[B.log.length - 1] || "")}</div>${B.deep ? `<div class="arGa"><i style="width:${Math.round(B.gauge)}%"></i></div>` : ""}<div class="arRow" data-r="p">${B.team.map((x) => unit(x, u === x ? "cur" : "")).join("")}</div>${mine ? `<div class="sum" style="text-align:center">Tocca a <b>${esc(u.n)}</b> · ${esc(ROLE[u.role] || u.role)} · tratto ${TR[u.tr][0]} ${TR[u.tr][1]}</div>` : ""}${act}<p class="sum" style="font-size:11px;opacity:.65">${B.deep ? "Sopra i nemici vedi cosa faranno (⚔️ attacco, ✨ abilità, →bersaglio): un colpo da 30% dei loro PV li interrompe. 🔥 brucia, 💫 salta il turno (Mente in critico). Boss a fasi. " : ""}🔥 Assalto batte 🎯 Mente, 🎯 Mente batte 🛡️ Muro, 🛡️ Muro batte 🔥 Assalto: +30% danni al tratto favorevole.</p></div>`;
    body.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => {
      const k = b.dataset.a; if (k === "defend" || k === "super") return act2(k);
      if (k === "ability") { if (u.role !== "A") return act2("ability"); B.mode = "ability"; return render2(); }
      B.mode = "attack"; render2();
    }));
    body.querySelectorAll(".arU.tg").forEach((el) => (el.onclick = () => act2(B.mode, el.dataset.u)));
    if (B.mode === "ability") body.querySelectorAll('[data-r="e"] .arU:not(.ko)').forEach((el) => { el.classList.add("tg"); el.onclick = () => act2("ability", el.dataset.u); });
  }
  const render2 = () => render();
  const act2 = (k, t) => act(k, t);
  function pop(u, text, cls) { if (FAST || !OV) return; const el = OV.querySelector(`.arU[data-u="${u.id}"][data-s="${u.side}"]`); if (!el) return; const s = document.createElement("span"); s.className = "arPop " + (cls || ""); s.textContent = text; el.appendChild(s); setTimeout(() => s.remove(), 950); }
  function shake(u) { if (FAST || !OV) return; const el = OV.querySelector(`.arU[data-u="${u.id}"][data-s="${u.side}"]`); if (el) { el.classList.add("shk"); setTimeout(() => el.classList.remove("shk"), 320); } }
  function cutin(u, ab) { if (FAST || !OV) return; const bt = OV.querySelector(".arBt"); if (!bt) return; const c = document.createElement("div"); c.className = "arCut"; c.innerHTML = `${img(u.id) ? `<img alt="" src="${img(u.id)}">` : ""}<div><b>${esc(ab)}</b><span>${esc(u.n)} · ${esc(ROLE[u.role] || u.role)}</span></div>`; bt.appendChild(c); setTimeout(() => c.remove(), 1150); }
  function cutinDuo(u1, u2, ab) {
    if (FAST || !OV) return;
    const bt = OV.querySelector(".arBt"); if (!bt) return;
    const c = document.createElement("div"); c.className = "arCut duo";
    c.innerHTML = `<div class="duoImgs">${img(u1.id) ? `<img alt="" src="${img(u1.id)}">` : ""}${img(u2.id) ? `<img alt="" src="${img(u2.id)}">` : ""}</div><div><b style="color:#ffd23f">⚡ ATTACCO COMBINATO!</b><span style="font-size:13px;font-weight:800;color:#fff">${esc(ab)}</span><span style="font-size:11px;color:#93c5fd">${esc(u1.n)} &amp; ${esc(u2.n)}</span></div>`;
    bt.appendChild(c);
    setTimeout(() => c.remove(), 1300);
  }
  // ------------------------------------------------------------ menu, modalità, Torre
  const bestTeam = () => { const s = S(), r = s._load(); const own = r.own.map((id) => s.BY[id]).filter(Boolean).sort((a, b) => (s.eff(b).at + s.eff(b).df + s.eff(b).te) - (s.eff(a).at + s.eff(a).df + s.eff(a).te)); r.team = own.slice(0, 5).map((c) => c.id); s._save(r); return r.team; };
  function teamBar(r, ar) {
    return `<div class="arRow">${[0, 1, 2, 3, 4].map((k) => { const id = r.team[k]; if (!id) return `<div class="arU" style="--tc:#4a3a6a;opacity:.5"><div class="im">+</div><div class="nm">vuoto</div></div>`; const c = S().BY[id], lv = lvOf(ar.xp[id] | 0); return unit({ id, side: "m", n: name(id), tr: trOf(S().eff(c)), hp: 1, maxhp: 1, shield: 0, taunt: 0 }, "") .replace('<div class="hp"><i style="width:100%"></i></div>', `<div class="hp" style="background:none;color:#ffd23f;font-weight:800;height:auto">Liv. ${lv}</div>`); }).join("")}</div>`;
  }
  function open(back) {
    if (back) BACK = back; if (!S()) return; const body = shell("⚔️ Arena dei Sogni"), r = S()._load(), ar = load(); S().sync && S().sync();
    const rr = S()._load(), I = S().intesa(rr.team).n, has = rr.team.length > 0, d = ar.daily.d === today() ? ar.daily : { d: today(), won: false };
    const mod = MODS[hash(today()) % MODS.length];
    const tmInfo = getTeamMod(rr);
    const mObj = tmInfo.m || { name: tmInfo.k, effects: { arena: "Bonus attivi" } };
    const arEff = (mObj.effects && mObj.effects.arena) || "Bonus attivi";
    let h = `<p class="sum">I personaggi della Squadra dei Sogni combattono a turni con abilità iconiche uniche, ruoli, tratti e intesa tra saghe. I livelli di Arena valgono <b>solo qui</b>. Intesa squadra: <b>+${(I * 1.5).toFixed(1)}%</b> a tutte le statistiche.</p>`;
    h += `<div class="sec">La tua squadra</div>${teamBar(rr, ar)}`;
    h += `<div class="arModCard">
      <div class="arModCardHd">
        <span>📋 Modulo: <b>${esc(mObj.name)}</b> ${tmInfo.sin ? '<span class="ok">✨ Sintonia Attiva</span>' : '<span class="warn">⚠️ Sintonia Parziale</span>'}</span>
        <button type="button" class="arModBtn" data-go="modDetail">🔍 Dettagli effetti</button>
      </div>
      <div class="arModCardTxt">${esc(arEff)}</div>
    </div>`;
    if (ar.run && ar.run.relics && ar.run.relics.length) {
      h += `<div class="arRelicRow"><b>🏆 Reliquie Oniriche possedute (${ar.run.relics.length}):</b><br>${ar.run.relics.map((k) => { const rel = RELIQUES.find((x) => x[0] === k); return `<span class="arRelicTag" title="${esc(rel ? rel[2] : "")}">${esc(rel ? rel[1] : k)}</span>`; }).join(" ")}</div>`;
    }
    if (!has) h += `<p class="sum">Nessuna carta in squadra. Sblocca carte giocando le saghe, poi schierale.</p>`;
    h += `<div class="big"><button type="button" data-go="best">✨ Schiera le migliori<small>le 5 carte più forti</small></button><button type="button" data-go="sogni">🃏 Cambia squadra<small>vai alla Squadra dei Sogni</small></button></div>`;
    h += `${window.__picchia ? `<div class="sec">Altri giochi con le tue carte</div><button type="button" class="one" data-go="pic">🥊 Duello dei Sogni<small>Picchiaduro 1 contro 1: mosse, speciale di ruolo e Super</small></button>` : ""}${window.__eroi ? `<button type="button" class="one" data-go="ero">⚽ Calcio d'Azione Eroi<small>Partita a squadre (3v3 o 5v5) con abilità di ruolo · Coppa degli Eroi</small></button>` : ""}${window.__corsa ? `<button type="button" class="one" data-go="cor">🏁 Gran Premio dei Sogni<small>Corsa a squadre: guidi un pilota, due compagni corrono da soli</small></button>` : ""}${window.__beat ? `<button type="button" class="one" data-go="bea">🥋 Rissa dei Sogni<small>Beat 'em up a scorrimento in 3 stadi: ondate, barili, boss e Super della tua saga</small></button>` : ""}<div class="sec">Scontri · livello sbloccato ${ar.tier}/5</div>${[1, 2, 3, 4, 5].map((t) => `<button type="button" class="one" data-tier="${t}" ${!has || t > ar.tier ? "disabled" : ""}>Scontro ${t}${"★".repeat(t)}<small>${t > ar.tier ? "Vinci il livello precedente" : "Avversari +" + Math.round((t - 1) * 12 + 0) + "% · premio " + 10 * t + " monete"}</small></button>`).join("")}`;
    h += `<div class="sec">Arena del giorno</div><button type="button" class="one" data-go="daily" ${!has ? "disabled" : ""}>📅 ${esc(mod[0])}${d.won ? " ✓" : ""}<small>${esc(mod[1])} · ${d.won ? "già vinta oggi" : "primo successo del giorno: +30 monete"}</small></button>`;
    h += `<div class="sec">Torre dei Duelli · record piano ${ar.best}</div><button type="button" class="one" data-go="torre" ${!has ? "disabled" : ""}>🗼 ${ar.run ? "Continua la salita (piano " + ar.run.floor + ")" : "Sali la Torre"}<small>30 piani · boss ogni 10 · reliquie oniriche e porte (riposo, elite, eventi)</small></button>${ar.run ? `<button type="button" class="one" data-go="torreNew">↺ Ricomincia dal piano 1<small>abbandona la salita in corso</small></button>` : ""}`;
    h += `<div class="sec">Opzioni</div><button type="button" class="one" data-go="deep">🧠 Battaglia a fondo: ${ar.deep ? "ATTIVA" : "SPENTA"}<small>intenzioni nemiche visibili, bruciature, stordimenti, Colpo di squadra, boss a fasi, reliquie nella Torre</small></button>`;
    body.innerHTML = h;
    const q = (s) => body.querySelector(s);
    q('[data-go="deep"]').onclick = () => { const a = load(); a.deep = !a.deep; save(a); open(); };
    q('[data-go="best"]').onclick = () => { bestTeam(); open(); };
    q('[data-go="sogni"]').onclick = () => { close(); S().open(() => open()); };
    const mdBtn = q('[data-go="modDetail"]');
    if (mdBtn) mdBtn.onclick = () => { if (S() && S().openModDetail) { close(); S().openModDetail(tmInfo.k, () => open()); } };
    body.querySelectorAll("[data-tier]").forEach((b) => (b.onclick = () => scontro(+b.dataset.tier)));
    const pi = q('[data-go="pic"]'); if (pi) pi.onclick = () => { close(); window.__picchia.open(() => open()); };
    const bt = q('[data-go="bea"]'); if (bt) bt.onclick = () => { close(); window.__beat.open(() => open()); };
    const er = q('[data-go="ero"]'); if (er) er.onclick = () => { close(); window.__eroi.open(() => open()); };
    const co = q('[data-go="cor"]'); if (co) co.onclick = () => { close(); window.__corsa.open(() => open()); };
    const dl = q('[data-go="daily"]'); if (dl) dl.onclick = daily;
    const tr = q('[data-go="torre"]'); if (tr) tr.onclick = () => torre(false);
    const tn = q('[data-go="torreNew"]'); if (tn) tn.onclick = () => torre(true);
  }
  function giveXp(team) {
    const ar = load(), ups = []; team.forEach((t) => { const id = t.id, l0 = lvOf(ar.xp[id] | 0); ar.xp[id] = Math.min(60, (ar.xp[id] | 0) + 1); if (lvOf(ar.xp[id]) > l0) ups.push(name(id) + " Liv. " + lvOf(ar.xp[id])); }); save(ar); return ups;
  }
  function result(res, win, lines, again, title) {
    const body = shell(win ? "🏆 Vittoria" : "💫 Sconfitta");
    body.innerHTML = `<div class="arRes"><h3>${win ? "Vittoria!" : "Sconfitta"}</h3>${lines.map((l) => `<p class="sum">${l}</p>`).join("")}</div><div class="big">${again ? `<button type="button" data-go="again">${esc(again[0])}<small>${esc(again[1])}</small></button>` : ""}<button type="button" data-go="menu">◂ Menu Arena<small>torna alle modalità</small></button></div>`;
    const a = body.querySelector('[data-go="again"]'); if (a) a.onclick = again[2]; body.querySelector('[data-go="menu"]').onclick = () => open();
  }
  function scontro(t) {
    const r = S()._load(), ar = load(), rand = rng(Date.now() & 0xffff);
    const foes = enemyTeam(rand, t, null, 5);
    start({ title: `⚔️ Scontro ${t}${"★".repeat(t)}`, sub: "Scontro singolo", foes, tierM: 0.85 + t * 0.12, onEnd: (res) => {
      const win = res === "win", ups = win ? giveXp(B.team.filter((u) => u.hp > 0 || true)) : [], a = load(), L = [];
      if (win) { a.wins++; if (t === a.tier && a.tier < 5) { a.tier++; L.push(`Livello ${a.tier} sbloccato.`); } save(a); safe(() => window.addCoins(10 * t), 0); L.push(`+${10 * t} monete.`); if (ups.length) L.push("📈 " + ups.map(esc).join(" · ")); } else L.push("Riprova con un'altra squadra o un livello più basso.");
      result(res, win, L, ["⚔️ Ancora", "stesso livello", () => scontro(t)]);
    }, quit: () => { close(); open(); } });
  }
  function daily() {
    const mod = MODS[hash(today()) % MODS.length], rand = rng(hash("d" + today())), theme = [...new Set(S().CARDS.map((c) => c.saga))][hash("t" + today()) % [...new Set(S().CARDS.map((c) => c.saga))].length];
    const foes = enemyTeam(rand, 3, theme, 5);
    start({ title: "📅 Arena del giorno", sub: mod[0] + " · " + mod[1], foes, tierM: 1.05, mod: mod[2], seed: hash("b" + today()), onEnd: (res) => {
      const win = res === "win", a = load(), L = [], ups = win ? giveXp(B.team) : [];
      if (win) { a.wins++; if (a.daily.d !== today() || !a.daily.won) { a.daily = { d: today(), won: true }; safe(() => window.addCoins(30), 0); L.push("+30 monete: primo successo del giorno."); } else L.push("Già vinta oggi: nessun premio extra."); save(a); if (ups.length) L.push("📈 " + ups.map(esc).join(" · ")); } else L.push("Domani l'avversario cambia. Riprova ora se vuoi.");
      result(res, win, L, null);
    }, quit: () => { close(); open(); } });
  }
  // la Torre: 30 piani, boss ogni 10 con una saga a tema; la salute passa da un piano all'altro
  const sagas = () => [...new Set(S().CARDS.map((c) => c.saga))].filter((k) => S().CARDS.filter((c) => c.saga === k).length >= 3);
  function floorFoes(f) {
    const rand = rng(hash("torre" + f)), boss = f % 10 === 0, ss = sagas(), theme = boss ? ss[(f / 10 - 1) * 7 % ss.length] : ss[hash("f" + f) % ss.length];
    let foes = enemyTeam(rand, 1, theme, boss ? 5 : Math.min(5, 2 + Math.ceil(f / 8)));
    if (boss) { const top = S().CARDS.filter((c) => c.saga === theme).sort((a, b) => b.at + b.df + b.te - (a.at + a.df + a.te))[0]; if (top) foes = [top].concat(foes.filter((c) => c.id !== top.id)).slice(0, 5); }
    return { foes, boss, theme };
  }
  function torre(fresh) {
    const ar = load(), r = S()._load(); let run = ar.run;
    if (fresh || !run) { run = { floor: 1, perks: [], relics: [], hp: {}, team: r.team.slice() }; ar.run = run; save(ar); }
    run.relics = run.relics || [];
    const team = run.team.map((id) => S().BY[id]).filter(Boolean), I = S().intesa(run.team).n, tm = ownTeam({ team: run.team }, ar);
    const F = floorFoes(run.floor), deep = ar.deep, rule = deep ? floorRule(run.floor) : null, elite = deep && run.elite, tierM = 0.9 + run.floor * 0.045 + (F.boss ? 0.12 : 0) + (elite ? 0.15 : 0);
    start({ title: `🗼 Torre · piano ${run.floor}`, sub: F.boss ? "👑 BOSS a fasi" : "Piano " + run.floor + "/30" + (elite ? " · 🔥 Elite" : "") + (rule ? " · " + rule[0] + ": " + rule[1] : ""), team: tm, hp: run.hp, perks: run.perks, relics: run.relics, foes: F.foes, boss: F.boss, floor: run.floor, elite: !!elite, tierM, mod: rule ? rule[2] : null, onEnd: (res, b) => {
      const a = load(); const rn = a.run || run;
      if (res === "lose") { a.best = Math.max(a.best, rn.floor - 1); a.run = null; save(a); const ups = giveXp(b.team); return result(res, false, [`Salita finita al piano ${rn.floor}. Record: ${a.best}.`, ups.length ? "📈 " + ups.map(esc).join(" · ") : "Ogni salita conta: i livelli restano."], ["🗼 Riprova", "dal piano 1", () => torre(true)]); }
      const ups = giveXp(b.team); b.team.forEach((u) => (rn.hp[u.id] = u.hp));
      rn.hp = Object.assign({}, rn.hp); b.team.forEach((u) => { if (u.hp > 0) rn.hp[u.id] = Math.min(u.maxhp, u.hp + Math.round(u.maxhp * 0.25)); });
      a.best = Math.max(a.best, rn.floor); if (F.boss) { a.bosses++; safe(() => window.addCoins(5 * rn.floor), 0); }
      if (rn.floor >= 30) { a.run = null; save(a); safe(() => window.addCoins(300), 0); return result(res, true, ["Hai conquistato la cima della Torre! +300 monete.", "Record piano 30."], null); }
      let extra = "";
      if (elite) {
        rn.elite = 0;
        rn.relics = rn.relics || [];
        const freeR = RELIQUES.filter((x) => !rn.relics.includes(x[0]));
        if (freeR.length && Math.random() < 0.6) {
          const rPick = freeR[Math.floor(Math.random() * freeR.length)];
          rn.relics.push(rPick[0]);
          extra = `🏆 Reliquia Elite: ${rPick[1]}! `;
        } else {
          extra = giveRandomPerk(rn, Math.random) + " (ricompensa Elite) ";
        }
        safe(() => window.addCoins(10 * rn.floor), 0);
      }
      rn.floor++; a.run = rn; save(a); perkPick(rn, ups, F.boss, extra);
    }, quit: () => { close(); open(); } });
  }
  function perkPick(rn, ups, boss, extra) {
    rn.relics = rn.relics || [];
    let pick = [];
    if (boss) {
      const freeRels = RELIQUES.filter((r) => !rn.relics.includes(r[0]));
      const relPool = freeRels.slice();
      while (pick.length < 3 && relPool.length) {
        const idx = Math.floor(Math.random() * relPool.length);
        const rItem = relPool.splice(idx, 1)[0];
        pick.push(["relic_" + rItem[0], "🏆 " + rItem[1], rItem[2]]);
      }
    }
    const rand = rng(hash("p" + rn.floor)), pool = PERKS.slice();
    while (pick.length < 3) {
      const idx = Math.floor(rand() * pool.length);
      const pItem = pool.splice(idx, 1)[0];
      if (!pick.some((x) => x[0] === pItem[0])) pick.push(pItem);
    }
    const body = shell(boss ? "👑 Premio del Boss" : "🗼 Un potenziamento");
    body.innerHTML = `<div class="arRes"><h3>Piano ${rn.floor - 1} superato</h3><p class="sum">${boss ? "👑 Boss battuto! Scegli una Reliquia o un Dono per la squadra.<br>" : ""}${esc(extra || "")}Salute +25% a chi è in piedi.${ups.length ? " 📈 " + ups.map(esc).join(" · ") : ""}</p></div><div class="arPerk">${pick.map((p) => `<button type="button" class="one" data-p="${p[0]}">${esc(p[1])}<small>${esc(p[2])}</small></button>`).join("")}</div>`;
    body.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => {
      const a = load(), run = a.run, k = b.dataset.p;
      run.relics = run.relics || [];
      if (k.startsWith("relic_")) {
        const rKey = k.replace("relic_", "");
        if (!run.relics.includes(rKey)) run.relics.push(rKey);
      }
      else if (k === "cura") run.team.forEach((id) => delete run.hp[id]);
      else if (k === "torna") { const d = run.team.find((id) => run.hp[id] === 0 || run.hp[id] <= 0); if (d) delete run.hp[d], (run.hp[d] = 40); }
      else run.perks.push(k);
      a.run = run; save(a); if (a.deep) bivio(run); else torre(false);
    }));
  }
  // bivio tra un piano e l'altro: salita normale, riposo, elite o evento
  function bivio(run) {
    const rand = rng(hash("b" + run.floor)), next = run.floor;
    const all = [["salita", "🚪 Salita normale", "nessun cambio: avanti col piano " + next], ["riposo", "🛏️ Riposo al fuoco", "+50% salute, i caduti rientrano al 35%"], ["evento", "🎲 Una porta strana", "un evento a sorpresa: rischio e ricompensa"]];
    if (next % 10 !== 0 && next > 2) all.push(["elite", "🔥 Corridoio Elite", "nemici +15% più forti · reliquia o potenziamento in premio + monete"]);
    const pool = all.slice(), pick = []; while (pick.length < 3 && pool.length) pick.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
    const body = shell("🗼 Bivio · piano " + next);
    body.innerHTML = `<div class="arRes"><h3>Tre porte</h3><p class="sum">${next % 10 === 0 ? "Il prossimo piano è un boss a fasi. Preparati bene." : "Scegli come affrontare il piano " + next + "."}</p></div><div class="arPerk">${pick.map((d) => `<button type="button" class="one" data-d="${d[0]}">${esc(d[1])}<small>${esc(d[2])}</small></button>`).join("")}</div>`;
    body.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => {
      const a = load(), rn = a.run, k = b.dataset.d;
      if (k === "riposo") { healRun(rn, 0.5); a.run = rn; save(a); return torre(false); }
      if (k === "elite") { rn.elite = 1; a.run = rn; save(a); return torre(false); }
      if (k === "evento") return evento(rn);
      torre(false);
    }));
  }
  function evento(run) {
    const rand = rng(hash("e" + run.floor)), ev = EVENTS[Math.floor(rand() * EVENTS.length)], body = shell("🗼 " + ev.t);
    body.innerHTML = `<div class="arRes"><h3>${esc(ev.t)}</h3><p class="sum">${esc(ev.p)}</p></div><div class="arPerk">${ev.o.map((o, i) => `<button type="button" class="one" data-e="${i}">${esc(o[0])}<small>${esc(o[1])}</small></button>`).join("")}</div>`;
    body.querySelectorAll("[data-e]").forEach((b) => (b.onclick = () => {
      const a = load(), rn = a.run, txt = ev.o[+b.dataset.e][2](rn, Math.random); a.run = rn; save(a);
      body.innerHTML = `<div class="arRes"><h3>${esc(ev.t)}</h3><p class="sum">${esc(txt)}</p></div><div class="big"><button type="button" data-go="on">▶ Avanti<small>piano ${rn.floor}</small></button></div>`;
      body.querySelector('[data-go="on"]').onclick = () => torre(false);
    }));
  }
  window.__arena = { open, close, start, act, state: () => B, load, save, _fast: (v) => { FAST = !!v; }, lvOf, mk, floorFoes, TR, ABIL, PERKS, RELIQUES, UNIQUE_SKILLS, MODS, TMODS, floorRule, bivio, evento, healRun, EVENTS };
})();
