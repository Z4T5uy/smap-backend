import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import sharp from "sharp";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

function makeRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("Redis env vars not found (UPSTASH_REDIS_REST_URL/TOKEN)");
  }
  return new Redis({ url, token });
}

export async function POST(req: NextRequest) {
  try {
    const redis = makeRedis();
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const size = parseInt((form.get("size") as string) ?? "128", 10) || 128;
    if (!file) return NextResponse.json({ error: "no image" }, { status: 400 });

    const input = Buffer.from(await file.arrayBuffer());
    const png = await sharp(input)
      .resize(size, size, { fit: "cover" })
      .png()
      .toBuffer();

    const id = nanoid(6);
    await redis.set("smap:" + id, png.toString("base64"));
    return NextResponse.json({ id });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
