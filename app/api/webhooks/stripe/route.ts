import Stripe from "stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing env: STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;
        if (!clerkUserId) break;

        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string,
        );

        await supabaseAdmin
          .from("users")
          .update({
            plan: "paid",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
          })
          .eq("clerk_user_id", clerkUserId);

        console.log(`[stripe webhook] upgraded user ${clerkUserId} to paid`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const isActive = sub.status === "active";

        await supabaseAdmin
          .from("users")
          .update({
            plan: isActive ? "paid" : "free",
            subscription_status: sub.status,
          })
          .eq("stripe_customer_id", sub.customer as string);

        console.log(`[stripe webhook] subscription updated: ${sub.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from("users")
          .update({
            plan: "free",
            subscription_status: "canceled",
          })
          .eq("stripe_customer_id", sub.customer as string);

        console.log("[stripe webhook] subscription canceled, user downgraded to free");
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(`[stripe webhook] payment failed for customer ${invoice.customer}`);
        break;
      }

      default:
        console.log(`[stripe webhook] unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error("[stripe webhook] handler error:", err);
    return new Response("Webhook handler error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
