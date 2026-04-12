"use client";
import Link from "next/link";
import { useClerk, UserButton } from "@clerk/nextjs";

type Props = {
  isSignedIn: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
};

const desktopLinkStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 400,
  fontSize: "13px",
  letterSpacing: "0.04em",
  color: "rgba(215,210,240,0.65)",
  textDecoration: "none",
  transition: "color 220ms ease",
} as const;

const desktopButtonStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 400,
  fontSize: "13px",
  letterSpacing: "0.04em",
  color: "rgba(215,210,240,0.9)",
  textDecoration: "none",
  padding: "7px 18px",
  borderRadius: "4px",
  border: "0.5px solid rgba(200,195,235,0.22)",
  background: "transparent",
  transition: "color 220ms ease, border-color 220ms ease, background 220ms ease",
} as const;

const mobileLinkStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 400,
  fontSize: "14px",
  color: "rgba(215,210,240,0.60)",
  textDecoration: "none",
  transition: "color 220ms ease",
} as const;

const mobileButtonStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 400,
  fontSize: "14px",
  color: "rgba(215,210,240,0.9)",
  textDecoration: "none",
  padding: "8px 20px",
  borderRadius: "4px",
  border: "0.5px solid rgba(200,195,235,0.22)",
  background: "transparent",
} as const;

export default function SiteHeaderAuthControls({
  isSignedIn,
  mobile = false,
  onNavigate,
}: Props) {
  const { signOut } = useClerk();
  const linkStyle = mobile ? mobileLinkStyle : desktopLinkStyle;
  const buttonStyle = mobile ? mobileButtonStyle : desktopButtonStyle;
  const linkClassName = mobile ? "site-header-mobile-auth-link" : "site-header-auth-link";
  const buttonClassName = mobile ? "site-header-mobile-auth-button" : "site-header-auth-button";

  if (!isSignedIn) {
    return (
      <>
        <Link
          href="/sign-in"
          onClick={onNavigate}
          className={linkClassName}
          style={linkStyle}
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          onClick={onNavigate}
          className={buttonClassName}
          style={buttonStyle}
        >
          Start free
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className={linkClassName}
        style={linkStyle}
      >
        Dashboard
      </Link>
      <button
        onClick={() => signOut({ redirectUrl: "/" })}
        className={buttonClassName}
        style={{ ...buttonStyle, cursor: "pointer" }}
      >
        Sign out
      </button>
      {!mobile && (
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
              userButtonPopoverCard: "bg-[#0f1623] border border-white/10",
              userButtonPopoverActionButton: "text-[#e4def6] hover:bg-white/5",
              userButtonPopoverActionButtonText: "text-[#e4def6]",
              userButtonPopoverFooter: "hidden",
            },
          }}
        />
      )}
    </>
  );
}
