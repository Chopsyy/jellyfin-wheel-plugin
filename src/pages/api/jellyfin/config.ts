import type { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../lib/db";
import { fetchJellyfinUserId } from "../../../lib/jellyfin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = readDB();

  if (req.method === "GET") {
    return res.json({
      baseUrl: db.settings.jellyfinBaseUrl || "",
      apiKey: db.settings.jellyfinApiKey || "",
    });
  }

  if (req.method === "POST") {
    const { baseUrl, apiKey } = req.body as { baseUrl: string; apiKey: string };
    db.settings.jellyfinBaseUrl = baseUrl?.trim() || "";
    db.settings.jellyfinApiKey = apiKey?.trim() || "";
    writeDB(db);
    return res.json({ ok: true });
  }

  if (req.method === "PUT") {
    const baseUrl = db.settings.jellyfinBaseUrl;
    const apiKey = db.settings.jellyfinApiKey;
    if (!baseUrl || !apiKey) {
      return res.status(400).json({ error: "Jellyfin not configured" });
    }
    try {
      await fetchJellyfinUserId({ baseUrl, apiKey });
      return res.json({ ok: true });
    } catch (e) {
      return res
        .status(502)
        .json({ error: (e as Error).message || "Connection failed" });
    }
  }

  res.status(405).end();
}
