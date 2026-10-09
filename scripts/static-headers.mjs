#!/usr/bin/env node
// Prints a Cloudflare Pages `_headers` file from next.config.mjs headers().
// Static hosting ignores Next's headers(); only catch-all and prefix rules
// (/(.*), /x/:path*) translate, others are skipped.
import config from "../next.config.mjs";

const rules = (await config.headers?.()) ?? [];
const out = [];
for (const r of rules) {
  if (r.has || r.missing) continue;
  let path = r.source;
  if (path === "/(.*)" || path === "/:path*") path = "/*";
  else if (/^\/[\w./-]*\/:\w+\*$/.test(path)) path = path.replace(/:\w+\*$/, "*");
  else if (/[(:*]/.test(path)) continue;
  out.push(path, ...r.headers.map((h) => `  ${h.key}: ${h.value}`), "");
}
process.stdout.write(out.join("\n"));
