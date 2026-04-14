"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BillingPortalButton from "@/components/dashboard/BillingPortalButton";

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

const QUICK_TOOLS = [
  {
    slug:    "clear-your-mind",
    name:    "Clear Your Mind",
    feeling: "When my mind won't stop",
    family:  "Clear your mind",
    href:    "/tools/clear-your-mind",
    accent:  "rgba(68,200,110,1)",
    bg:      "linear-gradient(145deg, #0a1a12, #0d2018, #081610)",
    border:  "rgba(48,160,88,0.14)",
    borderH: "rgba(48,160,88,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(48,200,100,0.6), transparent)",
  },
  {
    slug:    "choose",
    name:    "Choose",
    feeling: "When I can't decide",
    family:  "Clear your mind",
    href:    "/tools/choose",
    accent:  "rgba(68,138,228,1)",
    bg:      "linear-gradient(145deg, #080e1a, #0c1428, #080c18)",
    border:  "rgba(48,100,210,0.14)",
    borderH: "rgba(48,100,210,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(48,120,240,0.6), transparent)",
  },
  {
    slug:    "break-it-down",
    name:    "Break It Down",
    feeling: "When I feel overwhelmed",
    family:  "Clear your mind",
    href:    "/tools/break-it-down",
    accent:  "rgba(218,148,48,1)",
    bg:      "linear-gradient(145deg, #1a1008, #281808, #180e04)",
    border:  "rgba(200,130,40,0.14)",
    borderH: "rgba(200,130,40,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(220,150,40,0.6), transparent)",
  },
  {
    slug:    "breathing",
    name:    "Breathing",
    feeling: "When I need to slow down",
    family:  "Calm your state",
    href:    "/breathing",
    accent:  "rgba(100,180,215,1)",
    bg:      "linear-gradient(145deg, #081418, #0c1c22, #081218)",
    border:  "rgba(60,160,200,0.14)",
    borderH: "rgba(60,160,200,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(80,180,220,0.6), transparent)",
  },
  {
    slug:    "mood",
    name:    "Mood Tracker",
    feeling: "When I want to check in",
    family:  "Notice what's good",
    href:    "/mood",
    accent:  "rgba(185,100,210,1)",
    bg:      "linear-gradient(145deg, #120a1a, #1a0e24, #10081a)",
    border:  "rgba(160,80,190,0.14)",
    borderH: "rgba(160,80,190,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(180,90,210,0.6), transparent)",
  },
  {
    slug:    "gratitude",
    name:    "Gratitude",
    feeling: "When I want to notice the good",
    family:  "Notice what's good",
    href:    "/gratitude",
    accent:  "rgba(210,170,80,1)",
    bg:      "linear-gradient(145deg, #181208, #241a0a, #181008)",
    border:  "rgba(190,150,60,0.14)",
    borderH: "rgba(190,150,60,0.3)",
    shimmer: "linear-gradient(90deg, transparent, rgba(210,165,70,0.6), transparent)",
  },
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
          color:      empty ? "rgba(148,140,188,0.28)" : "rgba(215,208,248,0.88)",
          margin:     "0 0 8px",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily:    "'Jost', sans-serif",
          fontWeight:    400,
          fontSize:      "10px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color:         "rgba(120,112,165,0.5)",
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
        fontSize:      "12px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         hov ? "rgba(215,208,248,0.55)" : "rgba(120,112,165,0.4)",
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const [upgradeHov, setUpgradeHov] = useState(false);
  const [manageHov, setManageHov]   = useState(false);

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
            display:    "flex",
            alignItems: "center",
            gap:        "14px",
            flexWrap:   "wrap",
            marginBottom: "12px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize:   "clamp(32px, 4vw, 48px)",
              lineHeight: 1.1,
              color:      "rgba(235,228,255,0.9)",
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
              fontSize:      "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color:         isPro ? "rgba(195,175,245,0.82)" : "rgba(148,140,188,0.55)",
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
              fontSize:   "13px",
              color:      "rgba(148,140,188,0.52)",
              margin:     0,
            }}
          >
            Unlock unlimited sessions and history.{" "}
            <Link
              href="/pricing"
              style={{
                color:          "rgba(168,148,225,0.72)",
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
                fontSize:   "14px",
                color:      "rgba(148,140,188,0.52)",
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
                fontSize:      "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         "rgba(168,148,225,0.62)",
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
            fontSize:      "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(120,112,165,0.4)",
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
              fontSize:   "13px",
              color:      "rgba(100,92,148,0.4)",
              margin:     0,
              padding:    "16px 0",
              borderTop:  "0.5px solid rgba(100,92,148,0.1)",
            }}
          >
            No sessions yet.
          </p>
        ) : (
          <>
            <div
              style={{
                borderTop: "0.5px solid rgba(100,92,148,0.1)",
              }}
            >
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
                          fontFamily:  "'Jost', sans-serif",
                          fontWeight:  400,
                          fontSize:    "13px",
                          color:       "rgba(195,188,238,0.8)",
                          margin:      "0 0 3px",
                          whiteSpace:  "nowrap",
                          overflow:    "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {toolName}
                      </p>
                      <div
                        style={{
                          display:    "flex",
                          alignItems: "center",
                          gap:        "12px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            fontWeight: 300,
                            fontSize:   "11px",
                            color:      "rgba(120,112,165,0.5)",
                          }}
                        >
                          {relativeDate(session.created_at)}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            fontWeight: 300,
                            fontSize:   "11px",
                            color:      session.completed
                              ? "rgba(68,200,110,0.45)"
                              : "rgba(120,112,165,0.35)",
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
                        fontSize:      "11px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color:         isHov ? "rgba(168,148,225,0.72)" : "rgba(120,112,165,0.35)",
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
                  fontSize:   "12px",
                  color:      "rgba(120,112,165,0.45)",
                  margin:     "16px 0 0",
                }}
              >
                Showing 7 of {totalSessions} sessions.{" "}
                <Link
                  href="/pricing"
                  style={{
                    color:          "rgba(168,148,225,0.65)",
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
            fontSize:      "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(120,112,165,0.4)",
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
                  background:     tool.bg,
                  border:         `0.5px solid ${isHov ? tool.borderH : tool.border}`,
                  boxShadow:      isHov ? "0 8px 32px rgba(0,0,0,0.25)" : "none",
                  transform:      isHov ? "translateY(-3px)" : "translateY(0)",
                  transition:     "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s cubic-bezier(0.22,1,0.36,1), border-color 0.45s cubic-bezier(0.22,1,0.36,1)",
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
                    background:    tool.shimmer,
                    opacity:       isHov ? 0.6 : 0.28,
                    transition:    "opacity 0.45s ease",
                    pointerEvents: "none",
                  }}
                />

                <p
                  style={{
                    fontFamily:    "'Jost', sans-serif",
                    fontWeight:    400,
                    fontSize:      "9px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color:         tool.accent,
                    opacity:       0.5,
                    margin:        "0 0 8px",
                  }}
                >
                  {tool.family}
                </p>

                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize:   "20px",
                    lineHeight: 1.2,
                    color:      isHov ? "rgba(240,235,255,1)" : "rgba(215,208,248,0.88)",
                    margin:     "0 0 6px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {tool.name}
                </p>

                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize:   "11px",
                    color:      isHov ? "rgba(155,148,200,0.65)" : "rgba(130,122,178,0.42)",
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
          borderTop:   "0.5px solid rgba(100,92,148,0.12)",
          paddingTop:  "40px",
          paddingBottom: "0",
        }}
      >
        <p
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    400,
            fontSize:      "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(120,112,165,0.4)",
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
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   "12px",
                color:      "rgba(120,112,165,0.45)",
                letterSpacing: "0.03em",
              }}
            >
              Email
            </span>
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   "12px",
                color:      "rgba(168,160,215,0.65)",
              }}
            >
              {email ?? "—"}
            </span>
          </div>

          {/* Plan */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize:   "12px",
                color:      "rgba(120,112,165,0.45)",
                letterSpacing: "0.03em",
              }}
            >
              Plan
            </span>
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 400,
                fontSize:   "12px",
                color:      isPro ? "rgba(195,175,245,0.72)" : "rgba(148,140,188,0.55)",
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
                  fontSize:      "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         upgradeHov ? "rgba(215,200,255,0.85)" : "rgba(168,148,225,0.62)",
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
