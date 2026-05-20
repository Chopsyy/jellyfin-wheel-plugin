import type { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const wheelId = parseInt(req.query.id as string, 10);
  const db = await readDB();
  if (!db.wheels.find((w) => w.id === wheelId)) {
    return res.status(404).json({ error: "Wheel not found" });
  }

  if (req.method === "GET") {
    return res.json(db.items.filter((i) => i.wheelId === wheelId));
  }

  if (req.method === "POST") {
    const body = req.body as {
      label?: string;
      jellyfinItems?: { label: string; jellyfinId: string }[];
    };

    if (body.jellyfinItems) {
      const added = [];
      for (const ji of body.jellyfinItems) {
        const exists = db.items.find(
          (i) => i.wheelId === wheelId && i.label === ji.label
        );
        if (!exists) {
          const item = {
            id: db.nextItemId++,
            wheelId,
            label: ji.label,
            enabled: true,
            source: "jellyfin" as const,
            jellyfinId: ji.jellyfinId,
          };
          db.items.push(item);
          added.push(item);
        }
      }
      await writeDB(db);
      return res.status(201).json(added);
    }

    const { label } = body;
    if (!label?.trim()) return res.status(400).json({ error: "Label required" });
    if (db.items.find((i) => i.wheelId === wheelId && i.label === label.trim())) {
      return res.status(409).json({ error: "Item already exists" });
    }
    const item = {
      id: db.nextItemId++,
      wheelId,
      label: label.trim(),
      enabled: true,
      source: "manual" as const,
    };
    db.items.push(item);
    await writeDB(db);
    return res.status(201).json(item);
  }

  if (req.method === "PATCH") {
    const { itemId, enabled } = req.body as { itemId: number; enabled: boolean };
    const idx = db.items.findIndex((i) => i.id === itemId && i.wheelId === wheelId);
    if (idx === -1) return res.status(404).json({ error: "Item not found" });
    db.items[idx] = { ...db.items[idx], enabled };
    await writeDB(db);
    return res.json(db.items[idx]);
  }

  if (req.method === "DELETE") {
    const { itemId } = req.body as { itemId: number };
    const idx = db.items.findIndex((i) => i.id === itemId && i.wheelId === wheelId);
    if (idx === -1) return res.status(404).json({ error: "Item not found" });
    db.items.splice(idx, 1);
    await writeDB(db);
    return res.status(204).end();
  }

  res.status(405).end();
}
