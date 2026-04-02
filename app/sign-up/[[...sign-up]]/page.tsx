import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--solace-void, #050508)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {clerkConfigured ? <SignUp /> : null}
    </div>
  );
}
