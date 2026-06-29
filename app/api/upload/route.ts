import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import sharp from "sharp";
import { nanoid } from "nanoid";

export const runtime = "nodejs"; // sharp требует Node runtime (не Edge)

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const size = parseInt((form.get("size") as string) ?? "128", 10) || 128;
    if (!file) return NextResponse.json({ error: "no image" }, { status: 400 });

    const input = Buffer.from(await file.arrayBuffer());
    const png = await sharp(input)
      .resize(size, size, { fit: "cover" })
      .png()
      .toBuffer();

    const id = nanoid(6); // короткий ID — влезет в наковальню
    await redis.set("smap:" + id, png.toString("base64"));
    return NextResponse.json({ id });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
