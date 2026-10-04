// Serves field photos stored on local disk (dev fallback when Cloud Storage isn't configured).

import { readFileSync, existsSync } from "fs";
import { localPhotoPath } from "../../../../../lib/findingsStore.js";

export const dynamic = "force-dynamic";

const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(req, { params }) {
  const path = localPhotoPath(params.name);
  if (!path || !existsSync(path)) return new Response("not found", { status: 404 });
  return new Response(readFileSync(path), {
    headers: { "content-type": MIME[path.split(".").pop()], "cache-control": "public, max-age=31536000, immutable" },
  });
}
