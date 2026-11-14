import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export const alt = "Jay Naik";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", background: "#fbfbf9", color: "#151513", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, fontFamily: "serif" }}>
      <div style={{ fontSize: 150, lineHeight: 1, display: "flex" }}>Jay Naik</div>
      <div style={{ fontSize: 46, marginTop: 24, color: "#6c6c65", display: "flex" }}>AI Product Builder</div>
    </div>), size);
}
