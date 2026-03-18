"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChooseFlow() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tools/choose");
  }, [router]);

  return null;
}