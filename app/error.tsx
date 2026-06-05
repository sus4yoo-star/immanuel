"use client";

import { useEffect } from "react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // 운영 환경에서 오류 추적 도구를 붙일 자리
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "linear-gradient(#13233f, #0b1729)",
        color: "#e2e8f0",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 360 }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#d8b364" }}>✦</div>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>잠시 길을 잃었습니다</h1>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#94a3b8", marginBottom: "1.5rem" }}>
          예상치 못한 문제가 생겼어요. 다시 시도하면 이야기를 이어갈 수 있습니다.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "9999px",
            background: "#d8b364",
            color: "#0b1729",
            border: "none",
            fontSize: "1rem",
          }}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
