import fs from "fs";
import path from "path";

export default function sitemap() {
  const baseUrl = "https://deccanheritage.org";

  const file = path.join(process.cwd(), "public", "sites-index.json");
  const sites = JSON.parse(fs.readFileSync(file, "utf8"));

  const siteUrls = sites.map((s) => ({
    url: `${baseUrl}/sites/${s.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: s.isGetaway ? 0.8 : 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/getaways`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...siteUrls,
  ];
}
