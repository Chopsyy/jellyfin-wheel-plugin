import type { NextApiRequest, NextApiResponse } from "next";
import { readDB } from "../../../lib/db";
import { fetchJellyfinGenres } from "../../../lib/jellyfin";

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
  try {
    const genres = await fetchJellyfinGenres({ baseUrl, apiKey });
    return res.json(genres);
  } catch (e) {
    return res.status(502).json({ error: (e as Error).message });
  }
}
