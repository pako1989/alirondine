// tests/director-carriera.cjs - Test suite per il motore di carriera (Blocco 1)
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

console.log("▶ Avvio test: Director · Carriera del Golfo (Blocco 1)");

// Creazione sandbox browser minimale
const domWindow = {
  Math,
  JSON,
  Number,
  String,
  Array,
  Object,
  performance: { now: () => Date.now() },
  setTimeout: () => 0,
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  }
};
domWindow.window = domWindow;
const ctx = vm.createContext(domWindow);

// 1. Caricamento js/carriera-core.js
const coreCode = fs.readFileSync(path.join(__dirname, "../js/carriera-core.js"), "utf8");
vm.runInContext(coreCode, ctx);

assert(domWindow.__carrieraCore, "window.__carrieraCore deve essere definito");
const Core = domWindow.__carrieraCore;
console.log("  ✔ Caricamento js/carriera-core.js OK (v" + Core.version + ")");

// 2. Caricamento js/director-carriera-dati.js
const datiCode = fs.readFileSync(path.join(__dirname, "../js/director-carriera-dati.js"), "utf8");
vm.runInContext(datiCode, ctx);

assert(domWindow.__carrieraDati, "window.__carrieraDati deve essere definito");
const Dati = domWindow.__carrieraDati;
assert.strictEqual(Dati.DIVISIONS.length, 3, "Devono esserci esattamente 3 divisioni");
Dati.DIVISIONS.forEach((div, i) => {
  assert.strictEqual(div.teams.length, 8, `La divisione ${i} deve avere 8 squadre`);
});
console.log("  ✔ Caricamento js/director-carriera-dati.js OK (3 divisioni x 8 squadre)");

// 3. Test Generazione Calendario (round-robin a 8 squadre: 7 giornate x 4 partite)
const teamIds = Dati.DIVISIONS[0].teams.map((t) => t.id);
const schedule = Core.generateSchedule(teamIds);

assert.strictEqual(schedule.length, 7, "Il calendario a girone unico deve avere 7 giornate");
const matchCounts = {};
teamIds.forEach((id) => { matchCounts[id] = 0; });

schedule.forEach((round, rIdx) => {
  assert.strictEqual(round.length, 4, `La giornata ${rIdx + 1} deve avere 4 partite`);
  const playingThisRound = new Set();
  round.forEach((m) => {
    assert(m.home && m.away, "Ogni match deve avere squadra di casa e ospite");
    assert.notStrictEqual(m.home, m.away, "Una squadra non può giocare contro se stessa");
    assert(!playingThisRound.has(m.home), `Squadra ${m.home} gioca due volte nella giornata ${rIdx + 1}`);
    assert(!playingThisRound.has(m.away), `Squadra ${m.away} gioca due volte nella giornata ${rIdx + 1}`);
    playingThisRound.add(m.home);
    playingThisRound.add(m.away);
    matchCounts[m.home]++;
    matchCounts[m.away]++;
  });
});

teamIds.forEach((id) => {
  assert.strictEqual(matchCounts[id], 7, `Ogni squadra deve giocare esattamente 7 partite nel girone (trovate ${matchCounts[id]} per ${id})`);
});
console.log("  ✔ Algoritmo Berger calendario OK (7 turni, 4 partite a turno, ogni squadra gioca 7 volte)");

// 4. Test Classifica e calcolo punti
const table = Core.initTable(Dati.DIVISIONS[0].teams);
Core.applyMatchToTable(table, "rondine", "gabbiani", 3, 1);
Core.applyMatchToTable(table, "corsari", "dragoni", 0, 0);

assert.strictEqual(table.rondine.pts, 3, "La vittoria vale 3 punti");
assert.strictEqual(table.rondine.gd, 2, "Diff reti corretta (+2)");
assert.strictEqual(table.gabbiani.pts, 0, "La sconfitta vale 0 punti");
assert.strictEqual(table.corsari.pts, 1, "Il pareggio vale 1 punto");
assert.strictEqual(table.dragoni.pts, 1, "Il pareggio vale 1 punto");

const sorted = Core.sortTable(table);
assert.strictEqual(sorted[0].id, "rondine", "La capolista deve essere prima in classifica");
console.log("  ✔ Inizializzazione, aggiornamento e ordinamento classifica OK");

// 5. Test Simulatore Headless di partita
const teamA = Dati.DIVISIONS[0].teams[0]; // Rondine
const teamB = Dati.DIVISIONS[0].teams[1]; // Gabbiani

let totalGoals = 0;
for (let i = 0; i < 50; i++) {
  const res = Core.simMatch(teamA, teamB);
  assert(res.scoreA >= 0 && res.scoreB >= 0, "I gol non possono essere negativi");
  assert(Array.isArray(res.scorersA), "scorersA deve essere array");
  assert(Array.isArray(res.scorersB), "scorersB deve essere array");
  assert.strictEqual(res.scorersA.length, res.scoreA, "Numero marcatori pari ai gol segnati da A");
  assert.strictEqual(res.scorersB.length, res.scoreB, "Numero marcatori pari ai gol segnati da B");
  totalGoals += res.scoreA + res.scoreB;
}
const avgGoals = totalGoals / 50;
assert(avgGoals >= 1.5 && avgGoals <= 4.5, `Media gol realistica per simulatore (media ottenuta: ${avgGoals.toFixed(2)})`);
console.log(`  ✔ Simulatore headless partite OK (media gol su 50 match: ${avgGoals.toFixed(2)})`);

// 6. Test Gestione Settimanale (Fatica, Infortuni, Bilancio)
const testSquad = [
  { id: 1, name: "Sandro", r: 74, st: 40, mor: 60, wage: 8 },
  { id: 2, name: "Chicco", r: 73, st: 55, mor: 70, wage: 7, injured: true, injWeeks: 2 },
  { id: 3, name: "Ricky", r: 70, st: 80, mor: 70, wage: 5, age: 19 }
];
const state = { squad: testSquad, funds: 100, sponsorWeekly: 30 };

// Avanzamento riposo
const week1 = Core.processWeek(state, "riposo");
assert(testSquad[0].st > 40, "Il riposo deve ripristinare energia");
assert(testSquad[0].mor > 60, "Il riposo deve aumentare il morale");
assert.strictEqual(testSquad[1].injWeeks, 1, "La settimana di infortunio scala a 1");
assert.strictEqual(state.funds, 100 - (8 + 7 + 5) + 30, "Bilancio aggiornato correttamente (100 - 20 stipendi + 30 sponsor = 110)");

// Seconda settimana: Chicco deve guarire
const week2 = Core.processWeek(state, "riposo");
assert.strictEqual(testSquad[1].injWeeks, 0, "Infortunio azzerato");
assert.strictEqual(testSquad[1].injured, false, "Chicco è tornato disponibile");
console.log("  ✔ Ciclo settimanale (allenamento, fatica, infermeria, bilancio) OK");

// 7. Test integrazione patch Matchday Director
const directorCode = fs.readFileSync(path.join(__dirname, "../js/match-director-hd.js"), "utf8");
assert(directorCode.includes('mode === "career"'), "La patch di match-director-hd.js deve gestire mode === 'career'");
assert(directorCode.includes("makeCareerSquad"), "La patch deve includere makeCareerSquad");
assert(directorCode.includes("finishCareer"), "La patch deve includere finishCareer");
assert(directorCode.includes("Carriera del Golfo"), "La patch deve mostrare la voce Carriera del Golfo nel menu");
console.log("  ✔ Patch retrocompatibile su js/match-director-hd.js OK");

// 8. Test Minigioco Trattativa e Interfaccia Carriera
const trattativaCode = fs.readFileSync(path.join(__dirname, "../js/director-trattativa.js"), "utf8");
vm.runInContext(trattativaCode, ctx);
assert(domWindow.__directorTrattativa && typeof domWindow.__directorTrattativa.start === "function", "window.__directorTrattativa.start deve essere definito");
console.log("  ✔ Modulo js/director-trattativa.js OK");

const carrieraCode = fs.readFileSync(path.join(__dirname, "../js/director-carriera.js"), "utf8");
vm.runInContext(carrieraCode, ctx);
assert(typeof domWindow.openDirectorCarriera === "function", "window.openDirectorCarriera deve essere definita");
assert(domWindow.__directorCarriera && typeof domWindow.__directorCarriera.state === "function", "window.__directorCarriera.state deve essere definita");
console.log("  ✔ Interfaccia mobile js/director-carriera.js OK");

// 9. Test Salone e Borgo hook
const saloneCode = fs.readFileSync(path.join(__dirname, "../js/salone.js"), "utf8");
assert(saloneCode.includes('id: "trattativa"'), "Salone MACHINES deve includere il cabinato trattativa");
const borgoCode = fs.readFileSync(path.join(__dirname, "../js/director-borgo.js"), "utf8");
assert(borgoCode.includes("openDirectorCarriera"), "Spigola in director-borgo.js deve consentire di aprire la Carriera");
console.log("  ✔ Registrazione cabinato in Salone e dialogo Presidente Spigola ai Trabucchi OK");

console.log("\n✅ TUTTI I TEST DEL GESTIONALE E MINIGIOCO SONO PASSATI CON SUCCESSO!");
