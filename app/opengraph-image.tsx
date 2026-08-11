import { ImageResponse } from "next/og";

export const alt = "Watermark Lab - image watermark studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#111411",
        color: "#f6f8f2",
        padding: "74px 82px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: 999,
          background: "#d8ff5f",
          opacity: 0.14,
          right: -120,
          top: -210,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "#d8ff5f",
              color: "#111411",
            }}
          >
            W
          </div>
          WATERMARK LAB
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.055em",
            }}
          >
            Put your mark on every image.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 25,
              color: "#aeb5aa",
            }}
          >
            Text, image, 70+ fonts and batch export.
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
