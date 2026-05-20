import fs from "fs";
import path from "path";
import type { DBSchema } from "../types";

const DEFAULTS: DBSchema = {
  settings: {},
  wheels: [],
  items: [],
  nextWheelId: 1,
  nextItemId: 1,
};

// ── Upstash Redis (production on Vercel) ────────────────────────────────────

async function getRedis() {
  // Vercel's Upstash integration injects KV_REST_API_URL and KV_REST_API_TOKEN
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

async function redisRead(): Promise<DBSchema> {
  const redis = await getRedis();
  const data = await redis.get<DBSchema>("db");
  return data ? { ...DEFAULTS, ...data } : { ...DEFAULTS };
}

async function redisWrite(data: DBSchema): Promise<void> {
  const redis = await getRedis();
  await redis.set("db", data);
}

// ── JSON file (local dev) ───────────────────────────────────────────────────

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");

function fileRead(): DBSchema {
  try {
    if (!fs.existsSync(DB_PATH)) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) };
  } catch {
    return { ...DEFAULTS };
  }
}

function fileWrite(data: DBSchema): void {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ── Public API ──────────────────────────────────────────────────────────────

const useRedis = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

export async function readDB(): Promise<DBSchema> {
  return useRedis ? redisRead() : fileRead();
}

export async function writeDB(data: DBSchema): Promise<void> {
  return useRedis ? redisWrite(data) : fileWrite(data);
}
