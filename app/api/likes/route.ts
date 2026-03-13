import { NextResponse } from "next/server";
import { sketches } from "@/lib/data/sketches";
import { getLikeCount } from "@/lib/server/likes-store";

export async function GET() {
  const entries = await Promise.all(
    sketches.map(async (sketch) => [
      sketch.id,
      await getLikeCount(sketch.id),
    ] as const)
  );

  return NextResponse.json({
    counts: Object.fromEntries(entries),
  });
}
