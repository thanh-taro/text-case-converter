// E2E fixture server (QA phase 5). Serves the production build (dist/) with the generated
// _headers applied the way Cloudflare static assets does, plus a stub portal host on a second
// origin and an unlisted origin for the frame-ancestors refusal test (F-005.AC7).
//   tool      http://localhost:4173   (dist/, headers from dist/_headers)
//   host      http://localhost:4174   (tests/e2e/host/, allow-listed — build with HOST_ORIGINS)
//   unlisted  http://localhost:4175   (tests/e2e/host/, NOT allow-listed)
//   admin     http://localhost:4179   (/log, /reset, /publish?on=1 — serve a newer version)
// Build the dist with HOST_ORIGINS="http://localhost:4174" so both outputs (frame-ancestors and
// the compiled-in allow-list, __HOST_ORIGINS__) point at the stub host.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = path.join(ROOT, 'dist');
const HOST_DIR = path.join(ROOT, 'tests/e2e/host');
const BASE = Number(process.env.E2E_PORT_BASE ?? 4173);
export const PORTS = { tool: BASE, host: BASE + 1, unlisted: BASE + 2, admin: BASE + 6 };

if (!fs.existsSync(path.join(DIST, 'index.html')) || !fs.existsSync(path.join(DIST, '_headers'))) {
  console.error('dist/ is missing: build with HOST_ORIGINS before the e2e tests.');
  process.exit(1);
}

/** Cloudflare `_headers`: matching rules apply in order; "! Name" removes an earlier header. */
function parseHeaders(src) {
  const rules = [];
  let cur = null;
  for (const line of src.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      cur = { pattern: line.trim(), ops: [] };
      rules.push(cur);
      continue;
    }
    const t = line.trim();
    if (t.startsWith('!')) cur.ops.push({ del: t.slice(1).trim().toLowerCase() });
    else {
      const i = t.indexOf(':');
      cur.ops.push({ name: t.slice(0, i).trim(), value: t.slice(i + 1).trim() });
    }
  }
  return rules;
}
const RULES = parseHeaders(fs.readFileSync(path.join(DIST, '_headers'), 'utf8'));
const matches = (pattern, p) => (pattern.endsWith('*') ? p.startsWith(pattern.slice(0, -1)) : p === pattern);
function headersFor(p) {
  const h = new Map();
  for (const r of RULES) {
    if (!matches(r.pattern, p)) continue;
    for (const op of r.ops) {
      if (op.del) h.delete(op.del);
      else {
        const k = op.name.toLowerCase();
        h.set(k, h.has(k) ? [op.name, `${h.get(k)[1]}, ${op.value}`] : [op.name, op.value]);
      }
    }
  }
  return Object.fromEntries(h.values());
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

let log = [];
let published = false;
const t0 = Date.now();

function serve(res, dir, urlPath, extraHeaders, transformHtml) {
  const p = urlPath === '/' ? '/index.html' : urlPath;
  const file = path.join(dir, path.normalize(decodeURIComponent(p)).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(dir + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('not found');
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', ...extraHeaders });
  const body = fs.readFileSync(file);
  res.end(transformHtml && path.extname(file) === '.html' ? transformHtml(body) : body);
}

// "Publishing" a new version: the HTML gains a marker and a changed /sw.js, so an update check
// (F-007.AC3) sees a difference.
const publishHtml = (body) =>
  body.toString('utf8').replace('</head>', '<meta name="tk-test-version" content="2" /></head>');

function tool(req, res) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  log.push({ t: Date.now() - t0, method: req.method, path: u.pathname + u.search });
  const headers = headersFor(u.pathname);
  if (published && u.pathname === '/sw.js') {
    const body = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8') + '\n// published: v2\n';
    headers['Cache-Control'] = 'no-cache';
    res.writeHead(200, { 'Content-Type': 'text/javascript', ...headers });
    return res.end(body);
  }
  serve(res, DIST, u.pathname, headers, published ? publishHtml : undefined);
}

const injectBase = (body) => body.toString('utf8').replaceAll('__E2E_PORT_BASE__', String(BASE));
const host = (req, res) =>
  serve(res, HOST_DIR, new URL(req.url, 'http://x').pathname, { 'Cache-Control': 'no-store' }, injectBase);

function admin(req, res) {
  const u = new URL(req.url, 'http://x');
  res.setHeader('Content-Type', 'application/json');
  if (u.pathname === '/health') return res.end('{"ok":true}');
  if (u.pathname === '/log') return res.end(JSON.stringify({ now: Date.now() - t0, log }));
  if (u.pathname === '/publish') {
    published = u.searchParams.get('on') === '1';
    return res.end(JSON.stringify({ published }));
  }
  if (u.pathname === '/reset') {
    log = [];
    published = false;
    return res.end('{"ok":true}');
  }
  res.statusCode = 404;
  res.end('{}');
}

http.createServer(tool).listen(PORTS.tool, 'localhost');
http.createServer(host).listen(PORTS.host, 'localhost');
http.createServer(host).listen(PORTS.unlisted, 'localhost');
http.createServer(admin).listen(PORTS.admin, 'localhost');
console.log(`e2e: tool :${PORTS.tool}  host :${PORTS.host}  unlisted :${PORTS.unlisted}  admin :${PORTS.admin}`);
