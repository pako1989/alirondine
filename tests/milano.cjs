// tests/milano.cjs - Test completo BFS, grafica e validazione per «Operazione Fuorigioco Noir · Milano 1954»
const fs = require('fs');
const path = require('path');

// Mock browser environment
const window = {
  addEventListener: () => {},
  document: {
    addEventListener: () => {},
    createElement: () => ({
      setHeader: () => {},
      setAttribute: () => {},
      textContent: "",
      appendChild: () => {},
      style: {},
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      querySelector: () => null,
      querySelectorAll: () => []
    }),
    head: { appendChild: () => {} },
    body: { appendChild: () => {} },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  },
  location: { search: "?debug=1" },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  AudioContext: class {
    constructor() { this.currentTime = 0; this.sampleRate = 44100; this.state = "running"; }
    createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
    createOscillator() { return { frequency: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
    createBuffer() { return { getChannelData: () => new Float32Array(1024) }; }
    createBufferSource() { return { connect: () => {}, start: () => {} }; }
    createBiquadFilter() { return { frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
    resume() {}
  },
  __borgoApi: {
    TRZ: () => {}, trGo: () => {}, play: () => {}, scene: () => {}, match: () => {}, matchPick: () => {}, trZone: () => "", COSM: {}
  }
};
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.location = window.location;

// 1. Load saga-core
const sagaCoreCode = fs.readFileSync(path.join(__dirname, '../js/saga-core.js'), 'utf8');
eval(sagaCoreCode);

// 2. Load pedinamento match engine
const pedinamentoCode = fs.readFileSync(path.join(__dirname, '../js/pedinamento.js'), 'utf8');
eval(pedinamentoCode);

// 3. Load milano core
const milanoCode = fs.readFileSync(path.join(__dirname, '../js/milano.js'), 'utf8');
eval(milanoCode);

// 4. Load chapters 1, 2, 3
const c1Code = fs.readFileSync(path.join(__dirname, '../js/milano-c1.js'), 'utf8');
eval(c1Code);
const c2Code = fs.readFileSync(path.join(__dirname, '../js/milano-c2.js'), 'utf8');
eval(c2Code);
const c3Code = fs.readFileSync(path.join(__dirname, '../js/milano-c3.js'), 'utf8');
eval(c3Code);

console.log("✓ Files loaded and evaluated successfully!");

const G = window.__milano;
if (!G) {
  console.error("FAIL: window.__milano not found!");
  process.exit(1);
}

// Verifica engine pedinamento
if (!window.__pedinamento || typeof window.__pedinamento.start !== "function") {
  console.error("FAIL: window.__pedinamento.start is missing!");
  process.exit(1);
}
console.log("✓ window.__pedinamento engine verified!");

const dbg = G._dbg;
if (!dbg) {
  console.error("FAIL: G._dbg is undefined!");
  process.exit(1);
}
const allZones = dbg.ZONES || {};
const zoneKeys = Object.keys(allZones);
console.log(`Found ${zoneKeys.length} zones in dbg.ZONES:`, zoneKeys);

let allPassed = true;

// BFS Reachability test
zoneKeys.forEach((zid) => {
  const entry = allZones[zid];
  const spec = (entry && entry.spec) || entry;
  if (!spec) return;

  const w = spec.w, h = spec.h;
  const grid = Array.from({ length: h }, () => Array(w).fill("."));

  const builder = {
    lay(x1, y1, x2, y2, ch) {
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          if (x >= 0 && x < w && y >= 0 && y < h) grid[y][x] = ch;
        }
      }
    },
    put(x, y, ch) {
      if (x >= 0 && x < w && y >= 0 && y < h) grid[y][x] = ch;
    },
    house(x, y, hw, hh, cfg) {
      builder.lay(x, y, x + hw - 1, y + hh - 1, "A");
      if (cfg && cfg.door) {
        builder.put(cfg.door[0], cfg.door[1], cfg.enter ? "q" : "+");
      }
    }
  };

  if (typeof spec.build === "function") {
    spec.build(builder);
  }

  const start = spec.start || [2, 2];
  const [sx, sy] = start;

  // Solid tiles definition
  const solidSet = new Set((spec.solid || "SPFTBA#wWCcKk").split(""));

  if (solidSet.has(grid[sy][sx])) {
    console.error(`FAIL: Start position [${sx}, ${sy}] in zone ${zid} is on solid tile '${grid[sy][sx]}'!`);
    allPassed = false;
  }

  // BFS
  const visited = Array.from({ length: h }, () => Array(w).fill(false));
  const queue = [[sx, sy]];
  visited[sy][sx] = true;

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[ny][nx]) {
        const tile = grid[ny][nx];
        if (!solidSet.has(tile)) {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Check items reachability
  if (Array.isArray(spec.items)) {
    spec.items.forEach(([ix, iy], idx) => {
      let reachable = false;
      const dirs = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const nx = ix + dx, ny = iy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h && visited[ny][nx]) {
          reachable = true;
          break;
        }
      }
      if (!reachable) {
        console.error(`FAIL: Item #${idx} at [${ix}, ${iy}] in zone ${zid} is unreachable!`);
        allPassed = false;
      }
    });
  }

  // Check NPCs reachability
  if (typeof spec.npcs === "function") {
    const npcsList = spec.npcs(0) || [];
    npcsList.forEach((npc) => {
      const [nx, ny] = npc.at || [0, 0];
      let reachable = false;
      const dirs = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const ax = nx + dx, ay = ny + dy;
        if (ax >= 0 && ax < w && ay >= 0 && ay < h && visited[ay][ax]) {
          reachable = true;
          break;
        }
      }
      if (!reachable) {
        console.error(`FAIL: NPC '${npc.id}' at [${nx}, ${ny}] in zone ${zid} is unreachable!`);
        allPassed = false;
      }
    });
  }

  console.log(`✓ Zone ${zid} BFS passed (${w}x${h}) from [${sx}, ${sy}]`);
});

// Mock Canvas 2D Context for drawing testing
function createMockCtx() {
  return {
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    clearRect: () => {},
    fillText: () => {},
    measureText: () => ({ width: 50 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    globalAlpha: 1,
    font: ""
  };
}

// 5. Test bg-scenarios.js detailed backgrounds & clickable points
const bgScenariosCode = fs.readFileSync(path.join(__dirname, '../js/bg-scenarios.js'), 'utf8');
eval(bgScenariosCode);
console.log("✓ Motore Scenari e Sfondi 2D Dettagliati caricato con successo");

const mockCtx = createMockCtx();
const lb = window.__lbBg && window.__lbBg.LB;
if (!lb) {
  console.error("FAIL: window.__lbBg.LB not found!");
  process.exit(1);
}

["mn_titolo", "mn_bastioni", "mn_club", "mn_lucciola", "mn_stadio", "mn_arena"].forEach((k) => {
  const sc = lb[k];
  if (!sc) {
    console.error(`FAIL: Scenario '${k}' not registered in LB!`);
    allPassed = false;
    return;
  }
  if (!Array.isArray(sc.hot) || sc.hot.length < 3) {
    console.error(`FAIL: Scenario '${k}' must have at least 3 clickable hotspots! Found: ${sc.hot ? sc.hot.length : 0}`);
    allPassed = false;
  } else {
    console.log(`✓ Scenario ${k} has ${sc.hot.length} clickable hotspots.`);
  }
  try {
    sc.draw(mockCtx, 320, 200, 10);
    console.log(`✓ Scenario ${k} drawn without errors.`);
  } catch (err) {
    console.error(`FAIL: Error drawing scenario '${k}':`, err);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error("\n✗ TESTS FAILED FOR OPERAZIONE FUORIGIOCO NOIR!");
  process.exit(1);
}

console.log("\n=========================================");
console.log("✓ ALL CHECKS PASSED FOR OPERAZIONE FUORIGIOCO NOIR!");
console.log("=========================================\n");
process.exit(0);
