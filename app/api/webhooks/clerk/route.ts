import { headers } from "next/headers";
import { Webhook } from "svix";
import { supabaseAdmin } from "@/lib/supabase/server";
import { addBrevoContact, sendBrevoTemplate } from "@/lib/brevo";

type ClerkUserEvent = {
  type: "user.created" | "user.updated";
  data: {
    id: string;
    first_name: string | null;
    email_addresses: { email_address: string; primary: boolean }[];
  };
};

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId        = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();

  let event: ClerkUserEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id":        svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const { id: clerkUserId, email_addresses, first_name } = event.data;
    const email =
      email_addresses.find((e) => e.primary)?.email_address ??
      email_addresses[0]?.email_address;

    if (!email) {
      return new Response("No email found on user", { status: 400 });
    }

    const firstName = first_name ?? null;

    const { error } = await supabaseAdmin.from("users").upsert(
      {
        clerk_user_id: clerkUserId,
        email,
        plan: "free",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id" }
    );

    if (error) {
      console.error("Supabase upsert error:", error);
      return new Response("Database error", { status: 500 });
    }

    // Only send welcome email + add to Brevo on new user creation
    if (event.type === "user.created") {
      try {
        await addBrevoContact({
          email,
          firstName: firstName ?? undefined,
          listIds: [3], // Solace Users list
        });
        await sendBrevoTemplate({
          to: email,
          templateId: 1, // Welcome email
          params: { FIRSTNAME: firstName ?? "there" },
        });
      } catch (err) {
        console.error("[Brevo] Failed to add contact or send welcome email:", err);
        // Never block the webhook response — Brevo failure is non-fatal
      }
    }
  }

  return new Response("OK", { status: 200 });
}
