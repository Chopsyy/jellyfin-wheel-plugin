import type { NextApiRequest, NextApiResponse } from "next";
import { readDB } from "../../../lib/db";
import { fetchJellyfinShows } from "../../../lib/jellyfin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  const db = readDB();
  const baseUrl = db.settings.jellyfinBaseUrl;
  const apiKey = db.settings.jellyfinApiKey;
  if (!baseUrl || !apiKey) {
    return res.status(400).json({ error: "Jellyfin not configured" });
  }
  const type = (req.query.type as "Movie" | "Series") || "Movie";
  try {
    const items = await fetchJellyfinShows({ baseUrl, apiKey }, type);
    return res.json(items);
  } catch (e) {
    return res.status(502).json({ error: (e as Error).message });
  }
}
