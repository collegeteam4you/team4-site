const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const gtmId = (process.env.GTM_CONTAINER_ID || "").trim();

const headStart = "<!-- Google Tag Manager -->";
const headEnd = "<!-- End Google Tag Manager -->";
const bodyStart = "<!-- Google Tag Manager (noscript) -->";
const bodyEnd = "<!-- End Google Tag Manager (noscript) -->";

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeBlock(html, start, end) {
  const pattern = new RegExp(
    `\\s*${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`,
    "g"
  );
  return html.replace(pattern, "");
}

function addCspValue(policy, directive, values) {
  const parts = policy
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  const index = parts.findIndex(
    (part) => part === directive || part.startsWith(`${directive} `)
  );

  if (index === -1) {
    parts.push(`${directive} ${values.join(" ")}`);
  } else {
    const current = new Set(parts[index].split(/\s+/));
    values.forEach((value) => current.add(value));
    parts[index] = Array.from(current).join(" ");
  }

  return `${parts.join("; ")};`;
}

function patchCsp(html) {
  return html.replace(/content="([^"]*default-src[^"]*)"/i, (match, policy) => {
    let next = policy;
    next = addCspValue(next, "script-src", ["https://www.googletagmanager.com"]);
    next = addCspValue(next, "connect-src", [
      "'self'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
    ]);
    next = addCspValue(next, "frame-src", [
      "'self'",
      "https://www.googletagmanager.com",
    ]);
    next = addCspValue(next, "img-src", [
      "'self'",
      "data:",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
    ]);
    return `content="${next}"`;
  });
}

function buildHeadSnippet(id) {
  return `
    ${headStart}
    <script>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${id}');
    </script>
    ${headEnd}`;
}

function buildBodySnippet(id) {
  return `
    ${bodyStart}
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=${id}"
        height="0"
        width="0"
        style="display:none;visibility:hidden"
      ></iframe>
    </noscript>
    ${bodyEnd}`;
}

for (const filePath of walk(distDir)) {
  if (!filePath.endsWith(".html")) continue;

  const original = fs.readFileSync(filePath, "utf8");
  let next = removeBlock(original, headStart, headEnd);
  next = removeBlock(next, bodyStart, bodyEnd);

  if (gtmId) {
    next = patchCsp(next);
    next = next.replace(/<\/head>/i, `${buildHeadSnippet(gtmId)}\n  </head>`);
    next = next.replace(/<body([^>]*)>/i, `<body$1>${buildBodySnippet(gtmId)}`);
  }

  if (next !== original) {
    fs.writeFileSync(filePath, next);
  }
}
