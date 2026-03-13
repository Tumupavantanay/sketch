import { kv } from "@vercel/kv";

const memoryLikes = new Map<number, number>();

const keyFor = (id: number) => `likes:${id}`;

export async function getLikeCount(id: number): Promise<number> {
  try {
    const value = await kv.get<number>(keyFor(id));
    return typeof value === "number" && value > 0 ? value : 0;
  } catch {
    return memoryLikes.get(id) ?? 0;
  }
}

export async function setLikeCount(id: number, count: number): Promise<number> {
  const safe = Math.max(0, count);

  try {
    await kv.set(keyFor(id), safe);
  } catch {
    memoryLikes.set(id, safe);
  }

  return safe;
}

export async function incrementLikeCount(id: number): Promise<number> {
  try {
    const next = await kv.incr(keyFor(id));
    return typeof next === "number" && next > 0 ? next : 0;
  } catch {
    const next = (memoryLikes.get(id) ?? 0) + 1;
    memoryLikes.set(id, next);
    return next;
  }
}
