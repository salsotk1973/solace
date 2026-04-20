import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing env: STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("stripe_customer_id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 });
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return NextResponse.json({ url: portalSession.url });
}
