#!/usr/bin/env node
// Post-build pass over public/:
//   1. Prerender KaTeX math markers (`.math-tex`) to static HTML — zero client JS.
//   2. Inject the KaTeX stylesheet only into pages that actually contain math.
//   3. Copy KaTeX's CSS + fonts into public/ when any page used math.
//   4. Delete the stray giallo-*.css (their rules already live in main.css).
//
// KaTeX is provided by the Nix flake via $KATEX_DIST (see flake.nix).

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KATEX_DIST = process.env.KATEX_DIST;
if (!KATEX_DIST) {
  console.error(
    "postbuild: $KATEX_DIST is not set — run inside `nix develop`.",
  );
  process.exit(1);
}
const katex = (await import(path.join(KATEX_DIST, "katex.mjs"))).default;

const root = process.cwd();
const pub = path.join(root, "public");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const unescapeHtml = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'")
    .replace(/&amp;/g, "&");

// <span|div class="math-tex" data-display="true|false">TEX</span|div>
// (attribute quotes are stripped by minify_html, so quotes are optional).
const MATH_RE =
  /<(span|div) class=("?)math-tex\2 data-display=("?)(true|false)\3>([\s\S]*?)<\/\1>/g;

let pagesWithMath = 0;

for (const file of walk(pub)) {
  let html = fs.readFileSync(file, "utf8");
  let found = false;

  html = html.replace(MATH_RE, (_, _tag, _q1, _q2, display, tex) => {
    found = true;
    return katex.renderToString(unescapeHtml(tex).trim(), {
      displayMode: display === "true",
      throwOnError: false,
      strict: false,
    });
  });

  if (found) {
    pagesWithMath++;
    if (!html.includes("katex.min.css")) {
      // minify_html drops the optional </head>, so fall back to <body.
      const link = '<link rel="stylesheet" href="/katex.min.css">';
      html = html.includes("</head>")
        ? html.replace("</head>", link + "</head>")
        : html.replace("<body", link + "<body");
    }
    fs.writeFileSync(file, html);
  }
}

if (pagesWithMath > 0) {
  fs.copyFileSync(
    path.join(KATEX_DIST, "katex.min.css"),
    path.join(pub, "katex.min.css"),
  );
  fs.cpSync(path.join(KATEX_DIST, "fonts"), path.join(pub, "fonts"), {
    recursive: true,
  });
}

for (const f of ["giallo-light.css", "giallo-dark.css"]) {
  fs.rmSync(path.join(pub, f), { force: true });
}

// Fill the CSP inline-script hashes in _headers. The inline scripts (theme-init
// + toggle) are minified by Zola, so hash the bytes from a built page, not the
// template source. Attribute-less <script> tags only — the constellation has src.
let scripts = 0;
const headersPath = path.join(pub, "_headers");
if (fs.existsSync(headersPath)) {
  const sample = fs.readFileSync(path.join(pub, "index.html"), "utf8");
  const bodies = new Set();
  const re = /<script>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(sample)) !== null) bodies.add(m[1]);
  const tokens = [...bodies].map(
    (b) =>
      "'sha256-" +
      crypto.createHash("sha256").update(b, "utf8").digest("base64") +
      "'",
  );
  scripts = tokens.length;
  fs.writeFileSync(
    headersPath,
    fs
      .readFileSync(headersPath, "utf8")
      .replaceAll("__SCRIPT_HASHES__", tokens.join(" ")),
  );
}

console.log(
  `postbuild: math on ${pagesWithMath} page(s); ${scripts} inline-script CSP hash(es); giallo folded into main.css.`,
);
