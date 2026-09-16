// Weekly optional pass: pull recent "Hyderabad heritage demolition / restoration"
// news and attach links to nearby sites. No-op unless FIRECRAWL_API_KEY is set.
// Fail-open auth, same as the eateries crons.

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function authOk(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return (req.headers.get("authorization") || "") === `Bearer ${secret}`;
}

export async function GET(req) {
  if (!authOk(req)) return Response.json({ error: "forbidden" }, { status: 403 });
  if (!process.env.FIRECRAWL_API_KEY) {
    return Response.json({ ok: true, skipped: "no FIRECRAWL_API_KEY" });
  }
  // Intentionally minimal for v1: real implementation would search news,
  // geocode headlines, and flag sites within ~300 m as at-risk.
  return Response.json({ ok: true, updated: 0, note: "news enrichment stub" });
}
