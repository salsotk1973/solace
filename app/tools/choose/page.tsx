import type { CSSProperties } from "react";
import ChooseFlow from "@/components/tools/ChooseFlow";

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(44px,4.6vw,68px)",
  lineHeight: 0.94,
  letterSpacing: "-0.06em",
  fontWeight: 700,
  color: "#4f5c84",
  maxWidth: 760,
};

const introTextStyle: CSSProperties = {
  maxWidth: 680,
  margin: "24px 0 0",
  fontSize: 17,
  lineHeight: 1.9,
  color: "rgba(79,92,132,0.78)",
};

export default function ChoosePage() {
  return (
    <main
      style={{
        width: "100%",
        paddingTop: 120,
        paddingBottom: 120,
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 860 }}>
          <h1 style={titleStyle}>Choose</h1>

          <p style={introTextStyle}>
            Compare options calmly and move toward a clearer next step.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1240,
          margin: "92px auto 0",
          padding: "0 24px",
        }}
      >
        <ChooseFlow />
      </section>
    </main>
  );
}