import PageShell from "@/components/PageShell";
import BgFlat from "@/components/backgrounds/BgFlat";

export default function SignUpPage() {
  return (
    <PageShell particles={false}>
      <BgFlat>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
        <section
          style={{
            width: "100%",
            maxWidth: "520px",
            padding: "40px 36px",
            borderRadius: "24px",
            border: "0.5px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(185,175,220,0.55)",
              margin: "0 0 14px",
              textAlign: "center",
            }}
          >
            Sign up
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(34px, 4.5vw, 46px)",
              lineHeight: 1.1,
              color: "rgba(240,234,255,0.94)",
              margin: "0 0 12px",
              textAlign: "center",
            }}
          >
            Create your account
          </h1>

          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "15px",
              lineHeight: 1.7,
              color: "rgba(195,188,230,0.78)",
              margin: "0 0 24px",
              textAlign: "center",
            }}
          >
            Create an account with your email and password.
          </p>

          <form action="#" method="post" style={{ display: "grid", gap: "12px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "10px",
                border: "0.5px solid rgba(255,255,255,0.16)",
                background: "rgba(9,13,20,0.75)",
                color: "rgba(240,234,255,0.94)",
                padding: "0 14px",
                boxSizing: "border-box",
                fontFamily: "'Jost', sans-serif",
                fontSize: "14px",
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "10px",
                border: "0.5px solid rgba(255,255,255,0.16)",
                background: "rgba(9,13,20,0.75)",
                color: "rgba(240,234,255,0.94)",
                padding: "0 14px",
                boxSizing: "border-box",
                fontFamily: "'Jost', sans-serif",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                marginTop: "4px",
                width: "100%",
                height: "44px",
                borderRadius: "999px",
                border: "0.5px solid rgba(200,195,235,0.28)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(240,234,255,0.94)",
                fontFamily: "'Jost', sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Start free
            </button>
          </form>

          <p
            style={{
              margin: "16px 0 0",
              textAlign: "center",
              fontFamily: "'Jost', sans-serif",
              fontSize: "13px",
              color: "rgba(195,188,230,0.78)",
            }}
          >
            Already have an account?{" "}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/sign-in"
              style={{
                color: "rgba(240,234,255,0.94)",
                textDecoration: "none",
              }}
            >
              Sign in
            </a>
          </p>
        </section>
        </div>
      </BgFlat>
    </PageShell>
  );
}
