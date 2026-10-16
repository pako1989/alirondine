// tests/note.cjs - Test completo BFS, grafica e validazione per «Tactics Note · Il Quaderno del Giudizio»
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

// 2. Load quaderno match engine
const quadernoCode = fs.readFileSync(path.join(__dirname, '../js/quaderno.js'), 'utf8');
eval(quadernoCode);

// 3. Load note core
const noteCode = fs.readFileSync(path.join(__dirname, '../js/note.js'), 'utf8');
eval(noteCode);

// 4. Load chapters 1, 2, 3
const c1Code = fs.readFileSync(path.join(__dirname, '../js/note-c1.js'), 'utf8');
eval(c1Code);
const c2Code = fs.readFileSync(path.join(__dirname, '../js/note-c2.js'), 'utf8');
eval(c2Code);
const c3Code = fs.readFileSync(path.join(__dirname, '../js/note-c3.js'), 'utf8');
eval(c3Code);

console.log("✓ Files loaded and evaluated successfully!");

const G = window.__note;
if (!G) {
  console.error("FAIL: window.__note not found!");
  process.exit(1);
}

// Verifica engine quaderno
if (!window.__quaderno || typeof window.__quaderno.start !== "function") {
  console.error("FAIL: window.__quaderno.start is missing!");
  process.exit(1);
}
console.log("✓ window.__quaderno engine verified!");

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

  const w = spec.w || 32;
  const h = spec.h || 22;
  const start = spec.start || [5, 18];

  // Mock map creation
  const map = [];
  for (let y = 0; y < h; y++) {
    map.push(new Array(w).fill(","));
  }

  // Run build if present
  if (spec.build) {
    const meta = Array.from({ length: h }, () => Array(w).fill(null));
    const autos = [];
    const Ls = {
      lay(x0, y0, x1, y1, ch) {
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            if (map[y] && x >= 0 && x < w) map[y][x] = ch;
          }
        }
      },
      put(x, y, ch) {
        if (map[y] && x >= 0 && x < w) map[y][x] = ch;
      },
      house(x, y, hw, hh, o) {
        o = Object.assign({ w: hw, h: hh, rr: Math.max(1, Math.floor(hh / 2)) }, o || {});
        if (o.enter && o.door) autos.push({ x: o.door[0], y: o.door[1], def: o.enter });
        for (let yy = 0; yy < hh; yy++) {
          for (let xx = 0; xx < hw; xx++) {
            if (map[y + yy] && x + xx >= 0 && x + xx < w) map[y + yy][x + xx] = "y";
          }
        }
        if (o.door) {
          if (map[o.door[1]] && o.door[0] >= 0 && o.door[0] < w) map[o.door[1]][o.door[0]] = o.door[2] || "q";
        }
      },
      tag() {},
      w,
      h,
      meta,
      autos
    };
    try {
      spec.build(Ls);
    } catch (e) {
      console.error(`Error building zone ${zid}:`, e.message);
      allPassed = false;
      return;
    }
  }

  const SOLID = "atryqwsxflbgjnpzuBHDTLWKT";
  const isSolid = (x, y) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return true;
    const tile = map[y][x];
    return SOLID.includes(tile);
  };

  if (isSolid(start[0], start[1])) {
    console.error(`FAIL: Start position ${start} in zone ${zid} is on solid tile '${map[start[1]][start[0]]}'!`);
    allPassed = false;
    return;
  }

  // BFS
  const queue = [[start[0], start[1]]];
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      const key = `${nx},${ny}`;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited.has(key)) {
        if (!isSolid(nx, ny)) {
          visited.add(key);
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Verifica items raggiungibili
  if (spec.items && Array.isArray(spec.items)) {
    spec.items.forEach(([ix, iy]) => {
      const isReachable = [[0,0], [0,1], [0,-1], [1,0], [-1,0]].some(([dx, dy]) => visited.has(`${ix+dx},${iy+dy}`));
      if (!isReachable) {
        console.error(`FAIL: Item at [${ix}, ${iy}] in zone ${zid} is NOT reachable via BFS!`);
        allPassed = false;
      }
    });
  }

  // Verifica porte raggiungibili
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (map[y][x] === "q") {
        const canReachDoor = [[0,1], [0,-1], [1,0], [-1,0]].some(([dx, dy]) => visited.has(`${x+dx},${y+dy}`));
        if (!canReachDoor) {
          console.error(`FAIL: Door at [${x}, ${y}] in zone ${zid} is NOT adjacent to reachable floor!`);
          allPassed = false;
        }
      }
    }
  }

  console.log(`✓ Zone ${zid} BFS passed (${w}x${h}) from [${start}]`);
});

// 5. Test bg-scenarios.js
const scenariosCode = fs.readFileSync(path.join(__dirname, '../js/bg-scenarios.js'), 'utf8');
eval(scenariosCode);

const mockCanvas = {
  getContext: () => ({
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    arc: () => {},
    ellipse: () => {},
    fill: () => {},
    stroke: () => {},
    save: () => {},
    restore: () => {},
    fillText: () => {},
    measureText: () => ({ width: 40 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} })
  })
};

const lb = window.__lbBg && window.__lbBg.LB;
if (!lb) {
  console.error("FAIL: window.__lbBg.LB not found!");
  process.exit(1);
}
const testScenarios = ["qd_titolo", "qd_cortile", "qd_aula", "qd_stadio"];

testScenarios.forEach((scenId) => {
  const scen = lb[scenId];
  if (!scen) {
    console.error(`FAIL: Scenario ${scenId} not found in LB!`);
    allPassed = false;
    return;
  }
  if (!scen.hot || scen.hot.length < 4) {
    console.error(`FAIL: Scenario ${scenId} has fewer than 4 hotspots! (${scen.hot ? scen.hot.length : 0})`);
    allPassed = false;
  } else {
    console.log(`✓ Scenario ${scenId} has ${scen.hot.length} clickable hotspots.`);
  }

  // Test draw without error
  try {
    const ctx = mockCanvas.getContext();
    scen.draw(ctx, 320, 200, 10);
    console.log(`✓ Scenario ${scenId} drawn without errors.`);
  } catch (err) {
    console.error(`FAIL drawing scenario ${scenId}:`, err);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error("=========================================");
  console.error("SOME CHECKS FAILED FOR TACTICS NOTE!");
  console.error("=========================================");
  process.exit(1);
} else {
  console.log("=========================================");
  console.log("✓ ALL CHECKS PASSED FOR TACTICS NOTE!");
  console.log("=========================================");
  process.exit(0);
}
