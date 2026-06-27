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

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of copyEntries) {
  const from = path.join(root, entry);
  const to = path.join(dist, entry);
  if (!fs.existsSync(from)) {
    throw new Error(`Build entry not found: ${entry}`);
  }
  fs.cpSync(from, to, { recursive: true });
}

console.log(`Static site built in ${path.relative(root, dist)}`);
