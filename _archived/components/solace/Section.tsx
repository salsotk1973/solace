import { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
  return (
    <section className="solace-section">
      <div className="solace-page">{children}</div>
    </section>
  );
}