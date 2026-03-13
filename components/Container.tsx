import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "min(1360px, calc(100% - 64px))",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}