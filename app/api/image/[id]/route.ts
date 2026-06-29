import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
const redis = Redis.fromEnv();

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const b64 = await redis.get<string>("smap:" + params.id);
  if (!b64) return new Response("not found", { status: 404 });
  const buf = Buffer.from(b64, "base64");
  return new Response(buf, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
