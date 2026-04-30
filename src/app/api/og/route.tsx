import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Pill tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(99,102,241,0.2)",
            border: "1px solid rgba(99,102,241,0.5)",
            borderRadius: "100px",
            padding: "10px 24px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#818cf8",
              display: "flex",
            }}
          />
          <span style={{ color: "#D4AF37", fontSize: "22px", fontWeight: 600 }}>
            Free · No account required · 11 guided steps
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              fontSize: "80px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            Start your business
          </span>
          <span
            style={{
              fontSize: "80px",
              fontWeight: 800,
              color: "#818cf8",
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            tonight.
          </span>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              background: "#D4AF37",
              borderRadius: "12px",
            }}
          >
            <span style={{ color: "white", fontSize: "20px", fontWeight: 700 }}>MF</span>
          </div>
          <span style={{ color: "#64748b", fontSize: "26px", fontWeight: 500 }}>
            The Midnight Founder
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
