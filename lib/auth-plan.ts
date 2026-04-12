import { getCurrentUserId } from "@/lib/auth-user";
import { supabaseAdmin } from "@/lib/supabase/server";

async function getUserPlan(userId: string): Promise<"free" | "paid"> {
  const { data } = await supabaseAdmin
    .from("users")
    .select("plan")
    .eq("clerk_user_id", userId)
    .single();

  return (data?.plan as "free" | "paid") ?? "free";
}

export async function isPaidUser(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const plan = await getUserPlan(userId);
  return plan === "paid";
}

export async function requirePaidPlan(): Promise<{ redirect: string } | null> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { redirect: "/sign-in" };
  }

  const plan = await getUserPlan(userId);

  if (plan === "free") {
    return { redirect: "/pricing" };
  }

  return null;
}
