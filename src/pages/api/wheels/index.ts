import type { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../lib/db";
import { PALETTES } from "../../../config/palettes";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = readDB();

  if (req.method === "GET") {
    const wheels = db.wheels.map((w) => ({
      ...w,
      items: db.items.filter((i) => i.wheelId === w.id),
    }));
    return res.json(wheels);
  }

  if (req.method === "POST") {
    const { name } = req.body as { name: string };
    if (!name?.trim()) return res.status(400).json({ error: "Name required" });
    const paletteIndex = db.wheels.length % PALETTES.length;
    const wheel = {
      id: db.nextWheelId,
      name: name.trim(),
      paletteIndex,
      position: db.wheels.length,
      createdAt: Date.now(),
    };
    db.wheels.push(wheel);
    db.nextWheelId++;
    writeDB(db);
    return res.status(201).json({ ...wheel, items: [] });
  }

  res.status(405).end();
}
