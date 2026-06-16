import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from 'remotion';

// ─── ESCENA 1: El problema (0-3 seg = frames 0-90) ───────────────────────────

const MessyItem: React.FC<{ emoji: string; x: number; y: number; rotate: number; delay: number }> = ({
  emoji, x, y, rotate, delay,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [delay, delay + 15], [0.5, 1], { extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontSize: 60,
        opacity,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      {emoji}
    </div>
  );
};

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, from: 60, to: 0, config: { damping: 14 } });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [25, 45], [30, 0], { extrapolateRight: 'clamp' });

  const items = [
    { emoji: '🌶️', x: 80,  y: 300,  rotate: -15, delay: 5 },
    { emoji: '🧂', x: 820, y: 250,  rotate: 20,  delay: 8 },
    { emoji: '🥄', x: 150, y: 650,  rotate: 35,  delay: 12 },
    { emoji: '☕', x: 750, y: 600,  rotate: -25, delay: 6 },
    { emoji: '🍳', x: 60,  y: 900,  rotate: 10,  delay: 10 },
    { emoji: '🥫', x: 830, y: 880,  rotate: -30, delay: 14 },
    { emoji: '🫙', x: 400, y: 200,  rotate: 5,   delay: 9 },
    { emoji: '🔪', x: 500, y: 1500, rotate: -20, delay: 7 },
  ];

  return (
    <AbsoluteFill style={{ background: '#0d0d0d', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      {/* Emojis desordenados */}
      {items.map((item, i) => (
        <MessyItem key={i} {...item} />
      ))}

      {/* Overlay oscuro sobre los emojis */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />

      {/* Contenido central */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 80px' }}>
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 90,
            marginBottom: 20,
          }}
        >
          ❌
        </div>
        <h1
          style={{
            fontFamily: 'sans-serif',
            fontSize: 76,
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.1,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          El problema{'\n'}de TODOS
        </h1>
        <p
          style={{
            fontFamily: 'sans-serif',
            fontSize: 34,
            color: '#cccccc',
            marginTop: 30,
            fontWeight: 400,
            lineHeight: 1.5,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          "Gastás tiempo buscando{'\n'}lo que necesitás y nada{'\n'}tiene lugar fijo."
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── ESCENA 2: La solución (3-20 seg = frames 90-600) ────────────────────────

const ShelfMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, from: 0.7, to: 1, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const arrowAnim = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ opacity, transform: `scale(${scale})`, width: 700, position: 'relative' }}>
      {/* Estante contenedor */}
      <div
        style={{
          width: '100%',
          border: '4px solid #2d2d2d',
          borderRadius: 20,
          background: '#f5f0e8',
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Nivel superior */}
        <div
          style={{
            background: '#e8dcc8',
            borderRadius: 10,
            height: 80,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 20,
            gap: 16,
            borderBottom: '3px solid #c4b49a',
          }}
        >
          <span style={{ fontSize: 36 }}>☕</span>
          <span style={{ fontSize: 36 }}>🫙</span>
          <span style={{ fontSize: 36 }}>🧂</span>
          <span style={{ fontSize: 24, marginLeft: 'auto', marginRight: 20, color: '#999', fontFamily: 'sans-serif' }}>Nivel 1</span>
        </div>

        {/* Nivel inferior */}
        <div
          style={{
            background: '#e8dcc8',
            borderRadius: 10,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 20,
            gap: 16,
            borderBottom: '3px solid #c4b49a',
          }}
        >
          <span style={{ fontSize: 36 }}>🌶️</span>
          <span style={{ fontSize: 36 }}>🥫</span>
          <span style={{ fontSize: 36 }}>🍵</span>
          <span style={{ fontSize: 24, marginLeft: 'auto', marginRight: 20, color: '#999', fontFamily: 'sans-serif' }}>Nivel 2</span>
        </div>
      </div>

      {/* Flechas de extensión */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 16,
          opacity: arrowAnim,
          transform: `scaleX(${0.8 + arrowAnim * 0.2})`,
        }}
      >
        <span style={{ fontSize: 40 }}>←</span>
        <span style={{ fontSize: 28, color: '#888', fontFamily: 'sans-serif', alignSelf: 'center' }}>extensible</span>
        <span style={{ fontSize: 40 }}>→</span>
      </div>
    </div>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, from: 50, to: 0, config: { damping: 14 } });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const badgeOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' });
  const badgeScale = spring({ frame: frame - 50, fps, from: 0.5, to: 1, config: { damping: 10 } });

  const ctaOpacity = interpolate(frame, [120, 150], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f4ef 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      {/* Título */}
      <div
        style={{
          textAlign: 'center',
          padding: '0 60px',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <p style={{ fontFamily: 'sans-serif', fontSize: 38, color: '#888', margin: '0 0 8px', fontWeight: 500 }}>
          La solución es ESTO 👇
        </p>
        <h2
          style={{
            fontFamily: 'sans-serif',
            fontSize: 64,
            fontWeight: 900,
            color: '#1a1a1a',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Estante extensible
        </h2>
        <p style={{ fontFamily: 'sans-serif', fontSize: 40, color: '#555', margin: '8px 0 0', fontWeight: 600 }}>
          · 2 niveles ·
        </p>
      </div>

      {/* Mockup del producto */}
      <ShelfMockup />

      {/* Badge de precio */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          background: '#E6007E',
          borderRadius: 60,
          padding: '18px 50px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontFamily: 'sans-serif', color: '#fff', fontSize: 22, margin: 0, fontWeight: 600, opacity: 0.9 }}>
          Solo pagás al recibir 📦
        </p>
        <p style={{ fontFamily: 'sans-serif', color: '#fff', fontSize: 48, margin: '4px 0 0', fontWeight: 900 }}>
          $ 14.990 ARS
        </p>
      </div>

      {/* CTA */}
      <p
        style={{
          fontFamily: 'sans-serif',
          fontSize: 34,
          color: '#E6007E',
          fontWeight: 700,
          opacity: ctaOpacity,
          letterSpacing: 1,
        }}
      >
        yanitrend.com ✨
      </p>
    </AbsoluteFill>
  );
};

// ─── COMPOSICIÓN PRINCIPAL ────────────────────────────────────────────────────

export const EstanteAd: React.FC = () => {
  const frame = useCurrentFrame();

  // Transición entre escenas (slide desde la derecha)
  const transitionProgress = interpolate(frame, [85, 105], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scene1X = interpolate(transitionProgress, [0, 1], [0, -1080]);
  const scene2X = interpolate(transitionProgress, [0, 1], [1080, 0]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Escena 1 */}
      <AbsoluteFill style={{ transform: `translateX(${scene1X}px)` }}>
        <Scene1 />
      </AbsoluteFill>

      {/* Escena 2 */}
      <AbsoluteFill style={{ transform: `translateX(${scene2X}px)` }}>
        <Sequence from={90}>
          <Scene2 />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
