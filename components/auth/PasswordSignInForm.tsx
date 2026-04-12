"use client";

import Link from "next/link";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";

type ClerkErrorDetail = {
  code?: string;
  longMessage?: string;
  message?: string;
};

function getFirstClerkError(error: unknown): ClerkErrorDetail | null {
  if (
    error &&
    typeof error === "object" &&
    "errors" in error &&
    Array.isArray((error as { errors?: ClerkErrorDetail[] }).errors) &&
    (error as { errors: ClerkErrorDetail[] }).errors.length > 0
  ) {
    return (error as { errors: ClerkErrorDetail[] }).errors[0];
  }

  return null;
}

function getSignInErrorMessage(error: unknown) {
  const first = getFirstClerkError(error);
  const code = first?.code ?? "";
  const message = (first?.longMessage ?? first?.message ?? "").toLowerCase();

  if (
    code === "form_password_incorrect" ||
    code === "form_identifier_not_found" ||
    code === "strategy_for_user_invalid" ||
    message.includes("incorrect password") ||
    message.includes("password is incorrect") ||
    message.includes("identifier is invalid") ||
    message.includes("couldn't be found")
  ) {
    return "Incorrect email or password. Please try again.";
  }

  return first?.longMessage ?? first?.message ?? "We couldn't sign you in. Please try again.";
}

export default function PasswordSignInForm() {
  const clerk = useClerk();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = clerk.loaded ? clerk.client?.signIn : undefined;
  const isReady = clerk.loaded && Boolean(signIn);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    if (!isReady || !signIn) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        strategy: "password",
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await clerk.setActive({
          session: result.createdSessionId,
          redirectUrl: "/dashboard",
        });
        return;
      }

      setError("We couldn't sign you in. Please try again.");
    } catch (err) {
      setError(getSignInErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
        Sign in
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
        Welcome back
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
        Use your email and password to continue.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <label style={{ display: "grid", gap: "6px" }}>
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(185,175,220,0.6)",
            }}
          >
            Email
          </span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            autoComplete="email"
            disabled={isSubmitting || !isReady}
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
              opacity: isReady ? 1 : 0.7,
            }}
          />
        </label>

        <label style={{ display: "grid", gap: "6px" }}>
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(185,175,220,0.6)",
            }}
          >
            Password
          </span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            disabled={isSubmitting || !isReady}
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
              opacity: isReady ? 1 : 0.7,
            }}
          />
        </label>

        {!isReady ? (
          <p
            style={{
              margin: 0,
              fontFamily: "'Jost', sans-serif",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "rgba(195,188,230,0.78)",
            }}
          >
            Loading sign in…
          </p>
        ) : null}

        {error ? (
          <p
            role="alert"
            style={{
              margin: 0,
              fontFamily: "'Jost', sans-serif",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#f5a3b7",
            }}
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || !isReady}
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
            cursor: isSubmitting || !isReady ? "default" : "pointer",
            opacity: isSubmitting || !isReady ? 0.74 : 1,
          }}
        >
          {isSubmitting ? "Signing in..." : isReady ? "Sign in" : "Loading..."}
        </button>
      </form>

      <div
        style={{
          marginTop: "18px",
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/reset-password"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "13px",
            color: "rgba(240,234,255,0.94)",
            textDecoration: "none",
          }}
        >
          Forgot password?
        </Link>

        <p
          style={{
            margin: 0,
            fontFamily: "'Jost', sans-serif",
            fontSize: "13px",
            color: "rgba(195,188,230,0.78)",
          }}
        >
          New here?{" "}
          <Link
            href="/sign-up"
            style={{
              color: "rgba(240,234,255,0.94)",
              textDecoration: "none",
            }}
          >
            Start free
          </Link>
        </p>
      </div>
    </section>
  );
}
