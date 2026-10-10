// Per-site settings for the API Worker build (build.mjs) and router (src/index.js).
export default {
  // cron runs elsewhere; findings/photo serves local uploads (dev-only fallback).
  skip: [/^cron\//, /^findings\/photo\//],
  origins: ["https://heritage.mapmyhyd.com", "https://mapmyhyd-heritage.pages.dev", "http://localhost:3000"],
  cache: { sites: { edge: 300, shared: 3600, tags: ["sites"] }, routes: { edge: 300, shared: 3600, tags: ["sites"] } },
  data: { exclude: [], trim: {} },
};
