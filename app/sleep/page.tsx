import SleepOrb    from "@/components/sleep/SleepOrb";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Sleep Wind-Down — Solace",
  description: "A breathing guide for the end of the day. Slow the body, quiet the mind, and drift.",
};

export default async function SleepPage() {
  const { userId } = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#090d14] text-white">
      <SleepOrb userId={userId ?? null} />
    </main>
  );
}
