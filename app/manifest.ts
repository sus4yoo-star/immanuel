import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "임마누엘 — 별에서 십자가, 그리고 다시 오심",
    short_name: "임마누엘",
    description: "탄생부터 다시 오심까지 걷는 묵상형 시나리오",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b1729",
    theme_color: "#0b1729",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
