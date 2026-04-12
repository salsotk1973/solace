"use client";

import Link from "next/link";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

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

function getResetPasswordErrorMessage(error: unknown) {
  const first = getFirstClerkError(error);
  const code = first?.code ?? "";
  const message = (first?.longMessage ?? first?.message ?? "").toLowerCase();

  if (
    code === "form_code_incorrect" ||
    code === "verification_failed" ||
    message.includes("code is incorrect") ||
    message.includes("verification")
  ) {
    return "That reset code is invalid. Please try again.";
  }

  if (
    code === "form_identifier_not_found" ||
    message.includes("couldn't be found")
  ) {
    return "We couldn't find an account for that email.";
  }

  return first?.longMessage ?? first?.message ?? "We couldn't reset your password. Please try again.";
}

const fieldLabelStyle = {
  fontFamily: "'Jost', sans-serif",
  fontWeight: 400,
  fontSize: "11px",
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: "rgba(185,175,220,0.6)",
};

const inputStyle = {
  width: "100%",
  height: "44px",
  borderRadius: "10px",
  border: "0.5px solid rgba(255,255,255,0.16)",
  background: "rgba(9,13,20,0.75)",
  color: "rgba(240,234,255,0.94)",
  padding: "0 14px",
  boxSizing: "border-box" as const,
  fontFamily: "'Jost', sans-serif",
  fontSize: "14px",
};

export default function ResetPasswordForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!isLoaded || !signIn) {
      setError("Password reset is still loading. Please wait a moment and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });

      setEmailSubmitted(true);
      setSuccess("We sent a reset code to your email.");
    } catch (err) {
      setError(getResetPasswordErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!code.trim() || !newPassword) {
      setError("Enter the reset code and your new password.");
      return;
    }

    if (!isLoaded || !signIn || !setActive) {
      setError("Password reset is still loading. Please wait a moment and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({
          session: result.createdSessionId,
          redirectUrl: "/dashboard",
        });
        return;
      }

      setError("We couldn't reset your password. Please try again.");
    } catch (err) {
      setError(getResetPasswordErrorMessage(err));
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
        Reset password
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
        Set a new password
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
        {emailSubmitted
          ? "Enter the code from your email and choose a new password."
          : "Enter your email and we will send you a reset code."}
      </p>

      {!emailSubmitted ? (
        <form onSubmit={handleEmailSubmit} style={{ display: "grid", gap: "12px" }}>
          <label style={{ display: "grid", gap: "6px" }}>
            <span style={fieldLabelStyle}>Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              autoComplete="email"
              disabled={isSubmitting}
              style={inputStyle}
            />
          </label>

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

          {success ? (
            <p
              style={{
                margin: 0,
                fontFamily: "'Jost', sans-serif",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "rgba(190,233,209,0.9)",
              }}
            >
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
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
              cursor: isSubmitting ? "default" : "pointer",
              opacity: isSubmitting ? 0.74 : 1,
            }}
          >
            {isSubmitting ? "Sending code..." : "Send reset code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} style={{ display: "grid", gap: "12px" }}>
          <label style={{ display: "grid", gap: "6px" }}>
            <span style={fieldLabelStyle}>Reset code</span>
            <input
              type="text"
              name="code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter code"
              autoComplete="one-time-code"
              disabled={isSubmitting}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: "6px" }}>
            <span style={fieldLabelStyle}>New password</span>
            <input
              type="password"
              name="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              disabled={isSubmitting}
              style={inputStyle}
            />
          </label>

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

          {success ? (
            <p
              style={{
                margin: 0,
                fontFamily: "'Jost', sans-serif",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "rgba(190,233,209,0.9)",
              }}
            >
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
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
              cursor: isSubmitting ? "default" : "pointer",
              opacity: isSubmitting ? 0.74 : 1,
            }}
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>
      )}

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
          href="/sign-in"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "13px",
            color: "rgba(240,234,255,0.94)",
            textDecoration: "none",
          }}
        >
          Back to sign in
        </Link>

        {emailSubmitted ? (
          <button
            type="button"
            onClick={() => {
              setEmailSubmitted(false);
              setCode("");
              setNewPassword("");
              setError(null);
              setSuccess(null);
            }}
            style={{
              padding: 0,
              border: 0,
              background: "transparent",
              fontFamily: "'Jost', sans-serif",
              fontSize: "13px",
              color: "rgba(195,188,230,0.78)",
              cursor: "pointer",
            }}
          >
            Use a different email
          </button>
        ) : null}
      </div>
    </section>
  );
}
