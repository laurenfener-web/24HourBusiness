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
          justifyContent: "flex-end",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Moon */}
        <div
          style={{
            position: "absolute",
            top: "72px",
            right: "80px",
            fontSize: "120px",
            lineHeight: 1,
          }}
        >
          🌙
        </div>

        {/* Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(79,70,229,0.2)",
            border: "1px solid rgba(99,102,241,0.4)",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#818cf8",
            }}
          />
          <span style={{ color: "#a5b4fc", fontSize: "18px", fontWeight: 600 }}>
            Free · No account required · 11 guided steps
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-2px",
          }}
        >
          Start your business
          <br />
          <span style={{ color: "#818cf8" }}>tonight.</span>
        </div>

        {/* Subtext */}
        <div style={{ fontSize: "26px", color: "#94a3b8", fontWeight: 400 }}>
          The Midnight Founder — themidnightfounder.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
