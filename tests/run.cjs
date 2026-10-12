// tests/run.cjs - avvia un piccolo server statico (se non c'è già TEST_URL) e lancia tutti i test, uno dopo l'altro
// Uso: npm test            (tutti)         ·  node tests/run.cjs vento   (solo quelli che contengono «vento»)
const http = require("http"), fs = require("fs"), path = require("path"), { spawn } = require("child_process");
const ROOT = path.join(__dirname, ".."), PORT = +(process.env.TEST_PORT || 8765);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".webmanifest": "application/manifest+json" };
function serve() {
  return new Promise((ok) => {
    const srv = http.createServer((req, res) => {
      const u = decodeURIComponent(req.url.split("?")[0]), f = path.join(ROOT, u === "/" ? "index.html" : u);
      if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); res.end(b); });
    });
    srv.on("error", () => ok(null)); // la porta è già occupata: si usa il server che c'è
    srv.listen(PORT, () => ok(srv));
  });
}
(async () => {
  const srv = process.env.TEST_URL ? null : await serve();
  const only = process.argv[2] || "";
  const files = ["smoke.cjs", "cameos.cjs", "vento.cjs", "detective.cjs", "dopo.cjs", "spazio.cjs", "album.cjs", "torneo.cjs", "cronache.cjs"].filter((f) => f.includes(only));
  let fail = 0;
  for (const f of files) { console.log(`\n— ${f}`); // spawn asincrono: con spawnSync il server qui sopra resterebbe bloccato e la pagina non si caricherebbe mai
    const code = await new Promise((ok) => spawn(process.execPath, [path.join(__dirname, f)], { stdio: "inherit", env: { ...process.env, TEST_URL: process.env.TEST_URL || `http://localhost:${PORT}` } }).on("close", ok)); if (code !== 0) fail++; }
  if (srv) srv.close();
  console.log(fail ? `\n✗ ${fail} file di test con errori` : "\n✓ tutti i test passati"); process.exit(fail ? 1 : 0);
})();
