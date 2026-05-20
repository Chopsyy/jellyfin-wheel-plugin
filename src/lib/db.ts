import fs from "fs";
import path from "path";
import type { DBSchema } from "../types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");

const DEFAULTS: DBSchema = {
  settings: {},
  wheels: [],
  items: [],
  nextWheelId: 1,
  nextItemId: 1,
};

export function readDB(): DBSchema {
  try {
    if (!fs.existsSync(DB_PATH)) return { ...DEFAULTS };
    const content = fs.readFileSync(DB_PATH, "utf-8");
    return { ...DEFAULTS, ...JSON.parse(content) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function writeDB(data: DBSchema): void {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
