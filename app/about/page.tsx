export default function AboutPage() {
  return (
    <main
      style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "120px 40px 96px",
      }}
    >
      <div style={{ maxWidth: 760 }}>
        <div
          style={{
            display: "inline-flex",
            padding: "6px 14px",
            borderRadius: 999,
            border: "0.5px solid rgba(123,111,160,0.28)",
            background: "rgba(123,111,160,0.08)",
            color: "rgba(139,143,168,1)",
            fontSize: 10,
            fontFamily: "var(--font-jost, 'Jost', sans-serif)",
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          About Solace
        </div>

        <h1
          style={{
            margin: "28px 0 0 0",
            fontSize: "clamp(38px, 5.8vw, 70px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            fontWeight: 300,
            fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
            color: "rgba(220,215,245,0.92)",
            maxWidth: 700,
          }}
        >
          A calmer way
          <br />
          to design
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(200,182,248,0.65)" }}>
            digital help.
          </em>
        </h1>

        <p
          style={{
            marginTop: 28,
            marginBottom: 0,
            fontSize: 14,
            lineHeight: 1.72,
            fontFamily: "var(--font-body, 'Jost', sans-serif)",
            color: "rgba(155,147,200,0.52)",
            maxWidth: 560,
          }}
        >
          Solace exists to create simple digital environments that reduce noise
          and guide people toward clarity. Each tool is designed to feel
          supportive, spacious, and human.
        </p>
      </div>

      <section
        style={{
          marginTop: 48,
          maxWidth: 760,
          borderRadius: 18,
          padding: "28px 32px",
          background: "rgba(123,111,160,0.07)",
          border: "0.5px solid rgba(123,111,160,0.18)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(20px, 2.4vw, 28px)",
            lineHeight: 1.2,
            fontWeight: 300,
            fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
            color: "rgba(220,215,245,0.88)",
          }}
        >
          What makes Solace different
        </h2>

        <p
          style={{
            marginTop: 16,
            marginBottom: 0,
            fontSize: 14,
            lineHeight: 1.72,
            fontFamily: "var(--font-body, 'Jost', sans-serif)",
            color: "rgba(155,147,200,0.52)",
            maxWidth: 560,
          }}
        >
          It is not built like a productivity dashboard. It is not trying to
          overwhelm people with inputs, numbers, and noise. It focuses on one
          calm question at a time.
        </p>
      </section>
    </main>
  );
}
