import PageShell from "@/components/PageShell";

export default function DashboardLoading() {
  return (
    <PageShell>
      <div style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        <div
          style={{
            maxWidth:  "1100px",
            margin:    "0 auto",
            padding:   "0 40px",
            boxSizing: "border-box",
          }}
        >
          {/* Header skeleton */}
          <div style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div style={shimmer({ width: "260px", height: "44px", borderRadius: "6px" })} />
              <div style={shimmer({ width: "68px", height: "22px", borderRadius: "100px" })} />
            </div>
            <div style={shimmer({ width: "320px", height: "16px", borderRadius: "4px" })} />
          </div>

          {/* Stat cards skeleton */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "60px" }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  ...shimmer({ width: "100%", height: "110px", borderRadius: "14px" }),
                }}
              />
            ))}
          </div>

          {/* Recent sessions skeleton */}
          <div style={{ marginBottom: "60px" }}>
            <div style={shimmer({ width: "160px", height: "13px", borderRadius: "4px", marginBottom: "24px" })} />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  display:       "flex",
                  alignItems:    "center",
                  justifyContent: "space-between",
                  padding:       "16px 0",
                  borderBottom:  "0.5px solid rgba(100,92,148,0.08)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={shimmer({ width: "140px", height: "14px", borderRadius: "4px" })} />
                  <div style={shimmer({ width: "80px", height: "11px", borderRadius: "4px" })} />
                </div>
                <div style={shimmer({ width: "80px", height: "12px", borderRadius: "4px" })} />
              </div>
            ))}
          </div>

          {/* Quick access skeleton */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={shimmer({ width: "100%", height: "96px", borderRadius: "14px" })} />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes dashboardShimmer {
            0%   { opacity: 0.06; }
            50%  { opacity: 0.12; }
            100% { opacity: 0.06; }
          }
        `}</style>
      </div>
    </PageShell>
  );
}

function shimmer(style: {
  width: string;
  height: string;
  borderRadius: string;
  marginBottom?: string;
}): React.CSSProperties {
  return {
    width:      style.width,
    height:     style.height,
    borderRadius: style.borderRadius,
    marginBottom: style.marginBottom,
    background: "rgba(120,110,180,0.09)",
    animation:  "dashboardShimmer 1.8s ease-in-out infinite",
    flexShrink: 0,
  };
}
