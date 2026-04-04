import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/lab";

export const runtime = "nodejs";

export async function GET() {
  const latest = getAllArticles()[0];

  if (!latest) {
    return NextResponse.json({ title: null, slug: null }, { status: 404 });
  }

  return NextResponse.json({ title: latest.title, slug: latest.slug });
}
