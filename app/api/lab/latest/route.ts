import { NextResponse } from "next/server";
import { getFeaturedArticle } from "@/lib/lab";

export const runtime = "nodejs";

export async function GET() {
  const featured = getFeaturedArticle();

  if (!featured) {
    return NextResponse.json({ article: null }, { status: 404 });
  }

  return NextResponse.json({ article: featured });
}
