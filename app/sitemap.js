import fs from "fs";
import path from "path";
import { PSEO_TYPES, PSEO_ERAS, PSEO_TRAILS } from "../lib/pSeoData.js";

export default function sitemap() {
  const baseUrl = "https://heritage.mapmyhyd.com";

  const file = path.join(process.cwd(), "public", "sites-index.json");
  const sites = JSON.parse(fs.readFileSync(file, "utf8"));

  const siteUrls = sites.map((s) => ({
    url: `${baseUrl}/sites/${s.id}`,
    lastModified: s.verifiedAt ? new Date(s.verifiedAt).toISOString() : "2026-09-01T00:00:00.000Z",
    changeFrequency: "weekly",
    priority: s.isGetaway ? 0.8 : 0.7,
  }));

  const buildDate = "2026-09-28T00:00:00.000Z";

  const typeUrls = Object.keys(PSEO_TYPES).map((slug) => ({
    url: `${baseUrl}/types/${slug}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const eraUrls = Object.keys(PSEO_ERAS).map((slug) => ({
    url: `${baseUrl}/eras/${slug}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const trailUrls = Object.keys(PSEO_TRAILS).map((slug) => ({
    url: `${baseUrl}/trails/${slug}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: buildDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/getaways`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...typeUrls,
    ...eraUrls,
    ...trailUrls,
    ...siteUrls,
  ];
}
