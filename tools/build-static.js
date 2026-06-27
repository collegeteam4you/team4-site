const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const copyEntries = [
  'index.html',
  'admin.html',
  'terms.html',
  'privacy.html',
  'refund.html',
  'assets',
  'src',
];

const textExtensions = new Set(['.html', '.css', '.js', '.json', '.md', '.txt', '.svg']);

const decodeText = (bytes) => {
  const utf8 = bytes.toString('utf8');
  if (!utf8.includes('\uFFFD')) return utf8;
  return bytes.toString('latin1');
};

const copyForStaticHosting = (from, to) => {
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true });
    for (const child of fs.readdirSync(from)) {
      copyForStaticHosting(path.join(from, child), path.join(to, child));
    }
    return;
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (textExtensions.has(path.extname(from).toLowerCase())) {
    fs.writeFileSync(to, decodeText(fs.readFileSync(from)), 'utf8');
    return;
  }
  fs.copyFileSync(from, to);
};

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of copyEntries) {
  const from = path.join(root, entry);
  const to = path.join(dist, entry);
  if (!fs.existsSync(from)) {
    throw new Error(`Build entry not found: ${entry}`);
  }
  copyForStaticHosting(from, to);
}

console.log(`Static site built in ${path.relative(root, dist)}`);
