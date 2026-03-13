import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? "",
  token: process.env.KV_REST_API_TOKEN ?? "",
});

const keyFor = (id: number) => `likes:${id}`;

export async function getLikeCount(id: number): Promise<number> {
  const value = await redis.get<number>(keyFor(id));
  return typeof value === "number" && value > 0 ? value : 0;
}

export async function setLikeCount(id: number, count: number): Promise<number> {
  const safe = Math.max(0, count);
  await redis.set(keyFor(id), safe);
  return safe;
}

export async function incrementLikeCount(id: number): Promise<number> {
  const next = await redis.incr(keyFor(id));
  return typeof next === "number" && next > 0 ? next : 0;
}
