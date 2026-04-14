"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BillingPortalButton from "@/components/dashboard/BillingPortalButton";
import {
  getToolColour,
  getToolRgb,
  glassBackground,
  glassBorder,
  TEXT_COLOURS,
  FONT_SIZE,
} from "@/lib/design-tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToolSession = {
  id:           string;
  tool:         string;
  completed:    boolean;
  created_at:   string;
  session_data: Record<string, unknown>;
};

export type DashboardData = {
  firstName:    string | null;
  email:        string | null;
  plan:         "free" | "paid";
  sessions:     ToolSession[];
  totalSessions: number;
  distinctTools: number;
  streak:       number;
  weekSessions: number;
};

// ─── Tool metadata ────────────────────────────────────────────────────────────

const TOOL_NAMES: Record<string, string> = {
  "clear-your-mind": "Clear Your Mind",
  "choose":          "Choose",
  "break-it-down":   "Break It Down",
  "breathing":       "Breathing",
  "focus-timer":     "Focus Timer",
  "reframe":         "Reframe",
  "mood":            "Mood Tracker",
  "gratitude":       "Gratitude",
  "sleep":           "Sleep Wind-Down",
};

const TOOL_ROUTES: Record<string, string> = {
  "clear-your-mind": "/tools/clear-your-mind",
  "choose":          "/tools/choose",
  "break-it-down":   "/tools/break-it-down",
  "breathing":       "/breathing",
  "focus-timer":     "/focus",
  "reframe":         "/reframe",
  "mood":            "/mood",
  "gratitude":       "/gratitude",
  "sleep":           "/sleep",
};

// Slugs must match TOOL_CATEGORY keys in lib/design-tokens.ts exactly
const QUICK_TOOLS = [
  { slug: "clear",     name: "Clear Your Mind",  feeling: "When my mind won't stop",        family: "Clarity", href: "/tools/clear-your-mind" },
  { slug: "choose",    name: "Choose",            feeling: "When I can't decide",             family: "Decide",  href: "/tools/choose" },
  { slug: "breakdown", name: "Break It Down",     feeling: "When I feel overwhelmed",         family: "Decide",  href: "/tools/break-it-down" },
  { slug: "breathing", name: "Breathing",         feeling: "When I need to slow down",        family: "Calm",    href: "/breathing" },
  { slug: "focus",     name: "Focus Timer",       feeling: "When I need to concentrate",      family: "Clarity", href: "/focus" },
  { slug: "reframe",   name: "Reframe",           feeling: "When I'm stuck in a thought",     family: "Clarity", href: "/reframe" },
  { slug: "mood",      name: "Mood Tracker",      feeling: "When I want to check in",         family: "Clarity", href: "/mood" },
  { slug: "gratitude", name: "Gratitude",         feeling: "When I want to notice the good",  family: "Clarity", href: "/gratitude" },
  { slug: "sleep",     name: "Sleep Wind-Down",   feeling: "When I can't switch off",         family: "Calm",    href: "/sleep" },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeDate(dateStr: string): string {
  const date    = new Date(dateStr);
  const now     = new Date();
  const diffMs  = now.getTime() - date.getTime();
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDay === 0) return "Today";
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7)   return `${diffDay} days ago`;
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  empty,
}: {
  value: string | number;
  label: string;
  empty?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: "14px",
        padding:      "24px 22px 20px",
        background:   "linear-gradient(145deg, #0c0a1e, #08091a)",
        border:       "0.5px solid rgba(100,92,148,0.14)",
        boxSizing:    "border-box",
      }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize:   "44px",
          lineHeight: 1,
          color:      empty ? TEXT_COLOURS.disabled : TEXT_COLOURS.primary,
          margin:     "0 0 8px",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily:    "'Jost', sans-serif",
          fontWeight:    400,
          fontSize:      `${FONT_SIZE.functionalLabel}px`,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color:         TEXT_COLOURS.secondary,
          margin:        0,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function SignOutButton() {
  const { signOut } = useClerk();
  const router      = useRouter();
  const [hov, setHov] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => signOut(() => router.push("/"))}
      style={{
        background:    "transparent",
        border:        "none",
        cursor:        "pointer",
        padding:       0,
        fontFamily:    "'Jost', sans-serif",
        fontWeight:    400,
        fontSize:      `${FONT_SIZE.metadata}px`,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         hov ? TEXT_COLOURS.body : TEXT_COLOURS.secondary,
        transition:    "color 0.3s ease",
      }}
    >
      Sign out
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardContent({ data }: { data: DashboardData }) {
  const { firstName, email, plan, sessions, totalSessions, distinctTools, streak, weekSessions } = data;
  const [hoveredCard, setHoveredCard]       = useState<string | null>(null);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const [upgradeHov, setUpgradeHov]         = useState(false);
  const [manageHov, setManageHov]           = useState(false);

  const recentSessions = sessions.slice(0, 7);
  const hasSessions    = totalSessions > 0;
  const isPro          = plan === "paid";

  return (
    <div
      style={{
        maxWidth:  "1100px",
        margin:    "0 auto",
        padding:   "0 40px",
        boxSizing: "border-box",
      }}
    >
      {/* ── 1. Header ─────────────────────────────────────────────────── */}
      <header style={{ marginBottom: "56px" }}>
        <div
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "14px",
            flexWrap:     "wrap",
            marginBottom: "12px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize:   "clamp(32px, 4vw, 48px)",
              lineHeight: 1.1,
              color:      TEXT_COLOURS.primary,
              margin:     0,
            }}
          >
            {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
          </h1>

          {/* Plan badge */}
          <span
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    400,
              fontSize:      `${FONT_SIZE.eyebrow}px`,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color:         isPro ? "rgba(195,175,245,0.82)" : TEXT_COLOURS.secondary,
              background:    isPro ? "rgba(80,60,140,0.2)" : "rgba(60,55,90,0.15)",
              border:        isPro ? "0.5px solid rgba(140,120,200,0.3)" : "0.5px solid rgba(100,92,148,0.18)",
              borderRadius:  "100px",
              padding:       "5px 11px",
              alignSelf:     "center",
            }}
          >
            {isPro ? "Pro" : "Free plan"}
          </span>
        </div>

        {/* Free upgrade nudge */}
        {!isPro && (
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize:   `${FONT_SIZE.body}px`,
              color:      TEXT_COLOURS.secondary,
              margin:     0,
            }}
          >
            Unlock unlimited sessions and history.{" "}
            <Link
              href="/pricing"
              style={{
                color:          TEXT_COLOURS.body,
                textDecoration: "none",
                borderBottom:   "0.5px solid rgba(140,120,200,0.28)",
                paddingBottom:  "1px",
              }}
            >
              Upgrade to Pro →
            </Link>
          </p>
        )}
      </header>

      {/* ── 2. Activity summary ───────────────────────────────────────── */}
      <section style={{ marginBottom: "64px" }}>
        {!hasSessions ? (
          <div
            style={{
              padding:      "36px",
              borderRadius: "14px",
              background:   "linear-gradient(145deg, #0c0a1e, #08091a)",
              border:       "0.5px solid rgba(100,92,148,0.14)",
              textAlign:    "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   `${FONT_SIZE.body}px`,
                color:      TEXT_COLOURS.secondary,
                margin:     "0 0 6px",
              }}
            >
              You haven&apos;t started a session yet.
            </p>
            <Link
              href="/tools"
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    400,
                fontSize:      `${FONT_SIZE.metadata}px`,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         TEXT_COLOURS.body,
                textDecoration: "none",
              }}
            >
              Pick a tool and begin →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap:                 "12px",
            }}
          >
            <StatCard value={totalSessions} label="Sessions total" />
            <StatCard value={distinctTools} label="Tools explored" />
            <StatCard value={streak === 0 ? "—" : streak} label="Day streak" empty={streak === 0} />
            <StatCard value={weekSessions} label="This week" />
          </div>
        )}
      </section>

      {/* ── 3. Recent sessions ────────────────────────────────────────── */}
      <section style={{ marginBottom: "64px" }}>
        <p
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    400,
            fontSize:      `${FONT_SIZE.eyebrow}px`,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         TEXT_COLOURS.secondary,
            margin:        "0 0 20px",
          }}
        >
          Recent sessions
        </p>

        {!hasSessions ? (
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize:   `${FONT_SIZE.body}px`,
              color:      TEXT_COLOURS.secondary,
              margin:     0,
              padding:    "16px 0",
              borderTop:  "0.5px solid rgba(100,92,148,0.1)",
            }}
          >
            No sessions yet.
          </p>
        ) : (
          <>
            <div style={{ borderTop: "0.5px solid rgba(100,92,148,0.1)" }}>
              {recentSessions.map((session) => {
                const toolName  = TOOL_NAMES[session.tool] ?? session.tool;
                const toolRoute = TOOL_ROUTES[session.tool] ?? "/tools";
                const isHov     = hoveredSession === session.id;

                return (
                  <div
                    key={session.id}
                    onMouseEnter={() => setHoveredSession(session.id)}
                    onMouseLeave={() => setHoveredSession(null)}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      gap:            "16px",
                      padding:        "16px 0",
                      borderBottom:   "0.5px solid rgba(100,92,148,0.08)",
                      background:     isHov ? "rgba(100,92,148,0.03)" : "transparent",
                      transition:     "background 0.2s ease",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily:   "'Jost', sans-serif",
                          fontWeight:   400,
                          fontSize:     `${FONT_SIZE.body}px`,
                          color:        TEXT_COLOURS.body,
                          margin:       "0 0 3px",
                          whiteSpace:   "nowrap",
                          overflow:     "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {toolName}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            fontWeight: 300,
                            fontSize:   `${FONT_SIZE.metadata}px`,
                            color:      TEXT_COLOURS.secondary,
                          }}
                        >
                          {relativeDate(session.created_at)}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            fontWeight: 300,
                            fontSize:   `${FONT_SIZE.metadata}px`,
                            color:      session.completed
                              ? "rgba(60,192,212,0.7)"
                              : TEXT_COLOURS.secondary,
                          }}
                        >
                          {session.completed ? "Completed" : "In progress"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={toolRoute}
                      style={{
                        fontFamily:    "'Jost', sans-serif",
                        fontWeight:    400,
                        fontSize:      `${FONT_SIZE.metadata}px`,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color:         isHov ? TEXT_COLOURS.body : TEXT_COLOURS.secondary,
                        textDecoration: "none",
                        flexShrink:    0,
                        transition:    "color 0.25s ease",
                      }}
                    >
                      Return →
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Free user with many sessions: upgrade nudge */}
            {!isPro && totalSessions > 7 && (
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize:   `${FONT_SIZE.metadata}px`,
                  color:      TEXT_COLOURS.secondary,
                  margin:     "16px 0 0",
                }}
              >
                Showing 7 of {totalSessions} sessions.{" "}
                <Link
                  href="/pricing"
                  style={{
                    color:          TEXT_COLOURS.body,
                    textDecoration: "none",
                  }}
                >
                  See full history with Pro →
                </Link>
              </p>
            )}
          </>
        )}
      </section>

      {/* ── 4. Quick access ───────────────────────────────────────────── */}
      <section style={{ marginBottom: "72px" }}>
        <p
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    400,
            fontSize:      `${FONT_SIZE.eyebrow}px`,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         TEXT_COLOURS.secondary,
            margin:        "0 0 20px",
          }}
        >
          Tools
        </p>

        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap:                 "10px",
          }}
        >
          {QUICK_TOOLS.map((tool) => {
            const isHov = hoveredCard === tool.slug;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                onMouseEnter={() => setHoveredCard(tool.slug)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position:       "relative",
                  display:        "flex",
                  flexDirection:  "column",
                  borderRadius:   "14px",
                  padding:        "22px 22px 18px",
                  background:     glassBackground(tool.slug, isHov ? 0.12 : 0.07),
                  border:         `0.5px solid ${glassBorder(tool.slug, isHov ? 0.35 : 0.18)}`,
                  boxShadow:      isHov ? "0 8px 32px rgba(0,0,0,0.25)" : "none",
                  transform:      isHov ? "translateY(-3px)" : "translateY(0)",
                  transition:     "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s cubic-bezier(0.22,1,0.36,1), border-color 0.45s cubic-bezier(0.22,1,0.36,1), background 0.45s ease",
                  textDecoration: "none",
                  overflow:       "hidden",
                  boxSizing:      "border-box",
                }}
              >
                {/* Shimmer */}
                <div
                  aria-hidden="true"
                  style={{
                    position:      "absolute",
                    top:           0,
                    left:          "20%",
                    right:         "20%",
                    height:        "1px",
                    background:    `linear-gradient(90deg, transparent, rgba(${getToolRgb(tool.slug)}, 0.5), transparent)`,
                    opacity:       isHov ? 0.7 : 0.3,
                    transition:    "opacity 0.45s ease",
                    pointerEvents: "none",
                  }}
                />

                {/* Family eyebrow */}
                <p
                  style={{
                    fontFamily:    "'Jost', sans-serif",
                    fontWeight:    500,
                    fontSize:      `${FONT_SIZE.eyebrow}px`,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color:         getToolColour(tool.slug),
                    margin:        "0 0 8px",
                  }}
                >
                  {tool.family}
                </p>

                {/* Tool name */}
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize:   "20px",
                    lineHeight: 1.2,
                    color:      isHov ? TEXT_COLOURS.primary : TEXT_COLOURS.body,
                    margin:     "0 0 6px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {tool.name}
                </p>

                {/* Feeling / description */}
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize:   `${FONT_SIZE.body}px`,
                    color:      TEXT_COLOURS.secondary,
                    margin:     0,
                    lineHeight: 1.55,
                    transition: "color 0.3s ease",
                  }}
                >
                  {tool.feeling}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 5. Account section ────────────────────────────────────────── */}
      <section
        style={{
          borderTop:     "0.5px solid rgba(100,92,148,0.12)",
          paddingTop:    "40px",
          paddingBottom: "0",
        }}
      >
        <p
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    400,
            fontSize:      `${FONT_SIZE.eyebrow}px`,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         TEXT_COLOURS.secondary,
            margin:        "0 0 24px",
          }}
        >
          Account
        </p>

        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           "18px",
            maxWidth:      "400px",
          }}
        >
          {/* Email */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    300,
                fontSize:      `${FONT_SIZE.metadata}px`,
                color:         TEXT_COLOURS.secondary,
                letterSpacing: "0.03em",
              }}
            >
              Email
            </span>
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   `${FONT_SIZE.metadata}px`,
                color:      TEXT_COLOURS.body,
              }}
            >
              {email ?? "—"}
            </span>
          </div>

          {/* Plan */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    300,
                fontSize:      `${FONT_SIZE.metadata}px`,
                color:         TEXT_COLOURS.secondary,
                letterSpacing: "0.03em",
              }}
            >
              Plan
            </span>
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 400,
                fontSize:   `${FONT_SIZE.metadata}px`,
                color:      isPro ? "rgba(195,175,245,0.82)" : TEXT_COLOURS.secondary,
              }}
            >
              {isPro ? "Pro" : "Free"}
            </span>
          </div>

          {/* Upgrade / Manage */}
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              paddingTop:     "8px",
            }}
          >
            {!isPro ? (
              <Link
                href="/pricing"
                onMouseEnter={() => setUpgradeHov(true)}
                onMouseLeave={() => setUpgradeHov(false)}
                style={{
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    400,
                  fontSize:      `${FONT_SIZE.metadata}px`,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         upgradeHov ? TEXT_COLOURS.primary : TEXT_COLOURS.body,
                  textDecoration: "none",
                  transition:    "color 0.3s ease",
                }}
              >
                Upgrade to Pro →
              </Link>
            ) : (
              <BillingPortalButton
                hovered={manageHov}
                onMouseEnter={() => setManageHov(true)}
                onMouseLeave={() => setManageHov(false)}
              />
            )}

            <SignOutButton />
          </div>
        </div>
      </section>
    </div>
  );
}
