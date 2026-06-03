import type { Metadata, Viewport } from "next";
import RegisterSW from "./RegisterSW";
import "./globals.css";

export const metadata: Metadata = {
  title: "임마누엘 — 하나님이 우리와 함께 계시다",
  description: "예수님의 탄생부터 십자가와 부활, 다시 오심까지 걷는 묵상형 시나리오",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "임마누엘" },
  icons: { apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0b1729",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
