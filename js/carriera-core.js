// js/carriera-core.js - Motore logico comune opt-in per carriere manageriali / sportive
// Zero dipendenze, puro JavaScript, utilizzabile da qualsiasi modalità (Director, Calciatore, ecc.)
// Espone: window.__carrieraCore
(function () {
  "use strict";

  const rnd = Math.random;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

  // ------------------------------------------------------------- Calendario round-robin (algoritmo Berger)
  // Per N squadre (pari): genera (N-1) giornate, ciascuna con N/2 partite.
  function generateSchedule(teamIds) {
    const list = teamIds.slice();
    if (list.length % 2 !== 0) list.push(null); // eventuale turno di riposo
    const n = list.length;
    const roundsCount = n - 1;
    const half = n / 2;
    const rounds = [];

    const teams = list.slice();
    for (let r = 0; r < roundsCount; r++) {
      const matches = [];
      for (let i = 0; i < half; i++) {
        const home = teams[i];
        const away = teams[n - 1 - i];
        if (home && away) {
          // Alternanza casa/trasferta a turni alterni
          if (r % 2 === 1) {
            matches.push({ home: away, away: home, played: false, scoreA: null, scoreB: null });
          } else {
            matches.push({ home, away, played: false, scoreA: null, scoreB: null });
          }
        }
      }
      rounds.push(matches);
      // Ruota l'array tenendo fermo il primo elemento
      const fixed = teams[0];
      const rest = teams.slice(1);
      rest.unshift(rest.pop());
      teams.splice(0, teams.length, fixed, ...rest);
    }
    return rounds;
  }

  // ------------------------------------------------------------- Classifica
  function initTable(teams) {
    const table = {};
    teams.forEach((t) => {
      table[t.id] = {
        id: t.id,
        name: t.name,
        short: t.short || t.name,
        ico: t.ico || "⚽",
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0
      };
    });
    return table;
  }

  function sortTable(table) {
    return Object.values(table).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.name.localeCompare(b.name);
    });
  }

  function applyMatchToTable(table, homeId, awayId, scoreA, scoreB) {
    const h = table[homeId];
    const a = table[awayId];
    if (!h || !a) return;
    h.played++;
    a.played++;
    h.gf += scoreA;
    h.ga += scoreB;
    h.gd = h.gf - h.ga;
    a.gf += scoreB;
    a.ga += scoreA;
    a.gd = a.gf - a.ga;

    if (scoreA > scoreB) {
      h.won++;
      h.pts += 3;
      a.lost++;
    } else if (scoreA === scoreB) {
      h.drawn++;
      h.pts += 1;
      a.drawn++;
      a.pts += 1;
    } else {
      a.won++;
      a.pts += 3;
      h.lost++;
    }
  }

  // ------------------------------------------------------------- Simulatore headless di singola partita
  // Calcola gol ed esito in base ai livelli di forza (base 1.0), fattore campo (+0.08) e varianza
  function simMatch(teamA, teamB, opts) {
    opts = opts || {};
    const lvlA = (teamA.lvl || 1.0) * (opts.isNeutral ? 1.0 : 1.08) * (opts.bonusA || 1.0);
    const lvlB = (teamB.lvl || 1.0) * (opts.bonusB || 1.0);

    // Differenziale attacco vs difesa
    const atkA = (teamA.atk || teamA.lvl || 1.0) * (opts.isNeutral ? 1.0 : 1.05);
    const defA = teamA.def || teamA.lvl || 1.0;
    const atkB = teamB.atk || teamB.lvl || 1.0;
    const defB = teamB.def || teamB.lvl || 1.0;

    // Media attesa gol Poisson-like approssimata
    const expA = clamp(1.4 * (atkA / defB) * (lvlA / lvlB), 0.2, 4.0);
    const expB = clamp(1.1 * (atkB / defA) * (lvlB / lvlA), 0.2, 3.8);

    function sampleGoals(lambda) {
      let g = 0;
      let p = Math.exp(-lambda);
      let s = p;
      const u = rnd();
      while (u > s && g < 7) {
        g++;
        p = (p * lambda) / g;
        s += p;
      }
      return g;
    }

    const scoreA = sampleGoals(expA);
    const scoreB = sampleGoals(expB);

    // Generatore sintetico marcatori
    function pickScorers(team, count) {
      const res = [];
      const names = team.names && team.names.length ? team.names : ["Attaccante", "Ala", "Centrocampista", "Difensore"];
      // Pesi: prime 4 posizioni hanno più probabilità di segnare
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.pow(rnd(), 2) * names.length);
        res.push(names[idx] || names[0]);
      }
      return res;
    }

    return {
      scoreA,
      scoreB,
      scorersA: pickScorers(teamA, scoreA),
      scorersB: pickScorers(teamB, scoreB)
    };
  }

  // ------------------------------------------------------------- Gestione settimana & rosa
  // Recupero fatica, decurtazione infortuni, squalifiche, bilancio
  function processWeek(state, trainChoice) {
    state = state || {};
    const squad = state.squad || [];
    const logs = [];

    // 1. Allenamento & Fatica
    // trainChoice: "fisico", "tattico", "tecnico", "riposo"
    squad.forEach((p) => {
      // Se infortunato
      if (p.injWeeks && p.injWeeks > 0) {
        p.injWeeks--;
        if (p.injWeeks === 0) {
          p.injured = false;
          logs.push(`🏥 ${p.name} ha recuperato dall'infortunio ed è di nuovo disponibile.`);
        }
        return;
      }

      // Squalifica
      if (p.suspWeeks && p.suspWeeks > 0) {
        p.suspWeeks--;
        if (p.suspWeeks === 0) {
          p.suspended = false;
          logs.push(`✅ Squalifica scontata per ${p.name}: torna convocabile.`);
        }
      }

      // Applicazione allenamento
      p.st = p.st == null ? 100 : p.st;
      p.mor = p.mor == null ? 70 : p.mor;

      if (trainChoice === "riposo") {
        p.st = clamp(p.st + 22, 0, 100);
        p.mor = clamp(p.mor + 4, 0, 100);
      } else if (trainChoice === "fisico") {
        p.st = clamp(p.st + 8, 0, 100);
        // Piccolo rischio contrattura se già stanco
        if (p.st < 50 && rnd() < 0.1) {
          p.injured = true;
          p.injWeeks = 1;
          p.injType = "Affaticamento muscolare";
          logs.push(`⚠️ ${p.name} si è fermato in allenamento: affaticamento (1 settimana di stop).`);
        }
      } else if (trainChoice === "tattico") {
        p.st = clamp(p.st + 12, 0, 100);
      } else if (trainChoice === "tecnico") {
        p.st = clamp(p.st + 14, 0, 100);
        // Possibile piccolo progresso per i giovani (<21 anni)
        if (p.age && p.age <= 21 && rnd() < 0.15 && p.r < 82) {
          p.r += 1;
          logs.push(`📈 Crescita: ${p.name} migliora in allenamento! Valutazione ora ${p.r}.`);
        }
      } else {
        p.st = clamp(p.st + 15, 0, 100);
      }
    });

    // 2. Bilancio economico settimanale
    const wageTotal = squad.reduce((acc, p) => acc + (p.wage || 6), 0);
    state.funds = state.funds == null ? 120 : state.funds;
    state.funds -= wageTotal;

    // Sponsor base settimanale
    const sponsorIncome = state.sponsorWeekly || 35;
    state.funds += sponsorIncome;

    return {
      wageTotal,
      sponsorIncome,
      logs
    };
  }

  // ------------------------------------------------------------- Registrazione API
  window.__carrieraCore = {
    version: 1,
    generateSchedule,
    initTable,
    sortTable,
    applyMatchToTable,
    simMatch,
    processWeek
  };
})();
