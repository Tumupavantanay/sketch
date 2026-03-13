import { NextRequest, NextResponse } from "next/server";
import {
  getLikeCount,
  incrementLikeCount,
  setLikeCount,
} from "@/lib/server/likes-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idRaw } = await params;
  const id = Number.parseInt(idRaw, 10);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid sketch id" }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as { liked?: boolean };
  const liked = Boolean(body.liked);

  try {
    const count = liked
      ? await incrementLikeCount(id)
      : await setLikeCount(id, (await getLikeCount(id)) - 1);
    return NextResponse.json({ id, count });
  } catch (err) {
    console.error("likes POST error", err);
    return NextResponse.json({ id, count: 0 }, { status: 500 });
  }
}
