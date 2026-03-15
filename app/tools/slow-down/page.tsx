import type { CSSProperties } from "react";
import SlowDownFlow from "@/components/tools/SlowDownFlow";

const pageWrapStyle: CSSProperties = {
  width: "100%",
  paddingTop: 120,
  paddingBottom: 120,
};

const introSectionStyle: CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "0 24px",
};

const introInnerStyle: CSSProperties = {
  maxWidth: 760,
  marginLeft: 32,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(52px,5vw,68px)",
  lineHeight: 0.94,
  letterSpacing: "-0.06em",
  fontWeight: 700,
  color: "#4f5c84",
};

const introTextStyle: CSSProperties = {
  marginTop: 12,
  marginBottom: 0,
  fontSize: 17,
  lineHeight: 1.9,
  color: "rgba(79,92,132,0.78)",
  maxWidth: 620,
};

const toolSectionStyle: CSSProperties = {
  maxWidth: 1240,
  margin: "56px auto 0",
  padding: "0 24px",
};

export default function SlowDownPage() {
  return (
    <main style={pageWrapStyle}>
      <section style={introSectionStyle}>
        <div style={introInnerStyle}>
          <h1 style={titleStyle}>Slow Down</h1>

          <p style={introTextStyle}>
            Make a racing mind feel more manageable.
          </p>
        </div>
      </section>

      <section style={toolSectionStyle}>
        <SlowDownFlow />
      </section>
    </main>
  );
}