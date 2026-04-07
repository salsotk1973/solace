"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const SITE_TRANSITION_ROUTES = new Set([
  "/",
  "/tools",
  "/principles",
  "/lab",
  "/about",
]);

type SitePageTransitionProps = {
  children: ReactNode;
};

export default function SitePageTransition({ children }: SitePageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = SITE_TRANSITION_ROUTES.has(pathname);

  if (!shouldAnimate || prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: "relative", isolation: "isolate" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`atmosphere-${pathname}`}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 50% 18%, rgba(190,178,238,0.08), transparent 34%), radial-gradient(circle at 20% 72%, rgba(45,212,191,0.045), transparent 32%)",
          }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`page-${pathname}`}
          initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.012, filter: "blur(4px)" }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            zIndex: 1,
            transformOrigin: "50% 22%",
            willChange: "opacity, transform, filter",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
