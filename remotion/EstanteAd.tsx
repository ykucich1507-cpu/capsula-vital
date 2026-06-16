import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const xScale = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, stiffness: 200 } });

  const emojis = [
    { e: "🌶️", x: 120, y: 300, rot: -20 },
    { e: "🧂", x: 820, y: 420, rot: 15 },
    { e: "🥄", x: 200, y: 700, rot: 35 },
    { e: "☕", x: 750, y: 620, rot: -10 },
    { e: "🍳", x: 500, y: 280, rot: 25 },
    { e: "🧄", x: 650, y: 800, rot: -30 },
    { e: "🥢", x: 300, y: 520, rot: 50 },
  ];

  const titleY = interpolate(titleProgress, [0, 1], [80, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111111" }}>
      {emojis.map((item, i) => {
        const drift = Math.sin((frame + i * 20) / 30) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y + drift,
              fontSize: 64,
              transform: `rotate(${item.rot}deg)`,
              opacity: 0.35,
            }}
          >
            {item.e}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          top: "38%",
          width: "100%",
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleProgress,
          padding: "0 60px",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 900, color: "#ffffff", lineHeight: 1.2, fontFamily: "Arial, sans-serif" }}>
          El problema de TODOS
        </div>
        <div style={{ fontSize: 120, marginTop: 10, transform: `scale(${xScale})` }}>❌</div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "22%",
          width: "100%",
          padding: "0 80px",
          textAlign: "center",
          opacity: subtitleOpacity,
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 42, color: "#cccccc", lineHeight: 1.5, fontFamily: "Arial, sans-serif" }}>
          "Gastás tiempo buscando lo que necesitás y nada tiene lugar fijo."
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const shelfScale = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, stiffness: 120 } });
  const priceOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });
  const ctaOpacity = interpolate(frame, [100, 140], [0, 1], { extrapolateRight: "clamp" });
  const arrowX = interpolate(frame, [30, 80], [0, 18], { extrapolateRight: "clamp" });

  const titleY = interpolate(titleProgress, [0, 1], [60, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#f5f0eb" }}>
      <div
        style={{
          position: "absolute",
          top: "12%",
          width: "100%",
          textAlign: "center",
          padding: "0 60px",
          transform: `translateY(${titleY}px)`,
          opacity: titleProgress,
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 68, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.2, fontFamily: "Arial, sans-serif" }}>
          La solución es ESTO 👇
        </div>
        <div style={{ fontSize: 40, color: "#555555", marginTop: 16, fontFamily: "Arial, sans-serif" }}>
          Estante extensible · 2 niveles
        </div>
      </div>

      {/* Shelf mockup */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: `translateX(-50%) scale(${shelfScale})`,
          width: 680,
          background: "#ffffff",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          padding: "40px 50px",
          boxSizing: "border-box",
        }}
      >
        {/* Level 1 */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 22, color: "#888", marginBottom: 8, fontFamily: "Arial, sans-serif" }}>Nivel 1</div>
          <div style={{ height: 48, backgroundColor: "#c8a87a", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <span style={{ fontSize: 28 }}>🧂</span>
            <span style={{ fontSize: 28 }}>🌶️</span>
            <span style={{ fontSize: 28 }}>☕</span>
          </div>
        </div>
        {/* Level 2 */}
        <div>
          <div style={{ fontSize: 22, color: "#888", marginBottom: 8, fontFamily: "Arial, sans-serif" }}>Nivel 2</div>
          <div style={{ height: 48, backgroundColor: "#a8c4c8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <span style={{ fontSize: 28 }}>🍳</span>
            <span style={{ fontSize: 28 }}>🥄</span>
            <span style={{ fontSize: 28 }}>🧄</span>
          </div>
        </div>
        {/* Extension arrows */}
        <div style={{ marginTop: 28, textAlign: "center", fontSize: 34, color: "#888", letterSpacing: 8, transform: `translateX(${arrowX}px)` }}>
          ←&nbsp;&nbsp;extensible&nbsp;&nbsp;→
        </div>
      </div>

      {/* Price badge */}
      <div
        style={{
          position: "absolute",
          bottom: "22%",
          width: "100%",
          textAlign: "center",
          opacity: priceOpacity,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#e74c3c",
            color: "#ffffff",
            fontSize: 54,
            fontWeight: 900,
            padding: "18px 50px",
            borderRadius: 50,
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 8px 24px rgba(231,76,60,0.4)",
          }}
        >
          $ 14.990 ARS
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          width: "100%",
          textAlign: "center",
          opacity: ctaOpacity,
        }}
      >
        <div style={{ fontSize: 38, color: "#555555", fontFamily: "Arial, sans-serif" }}>
          yanitrend.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Transition: React.FC = () => {
  const frame = useCurrentFrame();
  const slideX = interpolate(frame, [0, 15], [1080, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f5f0eb", transform: `translateX(${slideX}px)` }} />
  );
};

export const EstanteAd: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <Scene1 />
      </Sequence>

      {/* Wipe transition */}
      <Sequence from={80} durationInFrames={15}>
        <Transition />
      </Sequence>

      <Sequence from={90} durationInFrames={510}>
        <Scene2 />
      </Sequence>
    </AbsoluteFill>
  );
};
