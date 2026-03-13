import { Redis } from "@upstash/redis";

// Strip accidental surrounding quotes (common Vercel paste mistake)
const clean = (v: string | undefined) => (v ?? "").replace(/^"|"$/g, "").trim();

const url = clean(process.env.KV_REST_API_URL);
const token = clean(process.env.KV_REST_API_TOKEN);

const redis = url && token ? new Redis({ url, token }) : null;

const keyFor = (id: number) => `likes:${id}`;

export async function getLikeCount(id: number): Promise<number> {
  if (!redis) return 0;
  try {
    const value = await redis.get<number>(keyFor(id));
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export async function setLikeCount(id: number, count: number): Promise<number> {
  const safe = Math.max(0, count);
  if (!redis) return safe;
  try {
    await redis.set(keyFor(id), safe);
  } catch {
    // ignore write errors
  }
  return safe;
}

export async function incrementLikeCount(id: number): Promise<number> {
  if (!redis) return 0;
  try {
    const next = await redis.incr(keyFor(id));
    const n = Number(next);
    return Number.isFinite(n) && n > 0 ? n : 1;
  } catch {
    return 0;
  }
}
