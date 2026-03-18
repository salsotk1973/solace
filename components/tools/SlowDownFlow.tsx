"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SlowDownFlow() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tools/clear-your-mind");
  }, [router]);

  return null;
}