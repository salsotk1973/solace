export default function AboutPage() {
  return (
    <main
      style={{
        width: "100%",
        paddingTop: 86,
        paddingBottom: 96,
        display: "grid",
        gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
        columnGap: 24,
      }}
    >
      <div style={{ gridColumn: "1 / span 8" }}>
        <div
          style={{
            display: "inline-flex",
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid rgba(112,123,157,0.18)",
            background: "rgba(255,255,255,0.34)",
            color: "#566482",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          About Solace
        </div>

        <h1
          style={{
            margin: "26px 0 0 0",
            fontSize: "clamp(54px, 6vw, 76px)",
            lineHeight: 0.94,
            letterSpacing: "-0.055em",
            fontWeight: 700,
            color: "#4f5c84",
            maxWidth: 760,
          }}
        >
          A calmer way
          <br />
          to design
          <br />
          digital help.
        </h1>

        <p
          style={{
            marginTop: 24,
            marginBottom: 0,
            fontSize: 18,
            lineHeight: 1.9,
            color: "rgba(79,92,132,0.82)",
            maxWidth: 920,
          }}
        >
          Solace exists to create simple digital environments that reduce noise and
          guide people toward clarity. Each tool is designed to feel supportive,
          spacious, and human.
        </p>
      </div>

      <section
        style={{
          gridColumn: "1 / span 9",
          marginTop: 32,
          borderRadius: 30,
          padding: "26px 28px",
          background: "rgba(244, 240, 240, 0.72)",
          border: "1px solid rgba(214, 206, 221, 0.45)",
          boxShadow: "0 18px 40px rgba(168, 154, 228, 0.08)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            lineHeight: 1.2,
            fontWeight: 700,
            color: "#2d3448",
          }}
        >
          What makes Solace different
        </h2>

        <p
          style={{
            marginTop: 16,
            marginBottom: 0,
            fontSize: 16,
            lineHeight: 1.8,
            color: "rgba(79,92,132,0.9)",
            maxWidth: 920,
          }}
        >
          It is not built like a productivity dashboard. It is not trying to
          overwhelm people with inputs, numbers, and noise. It focuses on one calm
          question at a time.
        </p>
      </section>
    </main>
  );
}