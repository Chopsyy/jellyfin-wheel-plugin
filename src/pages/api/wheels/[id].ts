import type { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = parseInt(req.query.id as string, 10);
  const db = await readDB();
  const wheelIdx = db.wheels.findIndex((w) => w.id === id);
  if (wheelIdx === -1) return res.status(404).json({ error: "Wheel not found" });

  if (req.method === "GET") {
    const wheel = db.wheels[wheelIdx];
    return res.json({ ...wheel, items: db.items.filter((i) => i.wheelId === id) });
  }

  if (req.method === "PUT") {
    const { name } = req.body as { name: string };
    if (!name?.trim()) return res.status(400).json({ error: "Name required" });
    db.wheels[wheelIdx] = { ...db.wheels[wheelIdx], name: name.trim() };
    await writeDB(db);
    return res.json(db.wheels[wheelIdx]);
  }

  if (req.method === "DELETE") {
    db.wheels.splice(wheelIdx, 1);
    db.items = db.items.filter((i) => i.wheelId !== id);
    await writeDB(db);
    return res.status(204).end();
  }

  res.status(405).end();
}
