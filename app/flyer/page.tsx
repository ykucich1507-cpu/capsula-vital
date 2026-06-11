'use client';

import { useState } from 'react';

export default function FlyerPage() {
  const [format, setFormat] = useState<'story' | 'cuadrado' | 'horizontal'>('story');

  function download() {
    window.print();
  }

  const dims: Record<string, { w: number; h: number }> = {
    story:      { w: 390, h: 693 },
    cuadrado:   { w: 500, h: 500 },
    horizontal: { w: 693, h: 390 },
  };
  const d = dims[format];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 48 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Pantalla: barra de controles ── */
        .controls {
          width: 100%;
          background: #1a1a1a;
          border-bottom: 1px solid #333;
          padding: 16px 24px;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .ctrl-label { color: #888; font-size: 13px; font-weight: 600; }
        .fmt-btn {
          background: #222;
          border: 1.5px solid #444;
          color: #ccc;
          padding: 7px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          transition: all .15s;
        }
        .fmt-btn.active { background: rgba(230,0,126,.15); border-color: #E6007E; color: #E6007E; }
        .dl-btn {
          margin-left: auto;
          background: #E6007E;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dl-btn:hover { background: #c2006b; }
        .preview-wrap {
          margin-top: 36px;
          padding: 24px;
        }

        /* ── Flyer ── */
        .flyer {
          position: relative;
          overflow: hidden;
          background: #0D0D1A;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06);
        }
        .flyer-story    { width: 390px; height: 693px; }
        .flyer-cuadrado { width: 500px; height: 500px; }
        .flyer-horizontal { width: 693px; height: 390px; }

        /* decoración de fondo */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .tag { display: inline-block; background: rgba(230,0,126,.18); color: #E6007E; border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
        .price-old { font-size: 16px; color: #666; text-decoration: line-through; }
        .price-new { font-size: 42px; font-weight: 900; color: #fff; line-height: 1; }
        .discount-badge { display: inline-block; background: #E6007E; color: #fff; font-weight: 800; font-size: 13px; padding: 4px 10px; border-radius: 8px; }
        .benefit { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,.85); }
        .check { width: 18px; height: 18px; background: rgba(230,0,126,.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #E6007E; font-size: 10px; flex-shrink: 0; }
        .wa-pill { display: inline-flex; align-items: center; gap: 7px; background: #25D366; color: #fff; font-size: 12px; font-weight: 700; padding: 8px 18px; border-radius: 30px; }
        .stars { color: #FFB800; font-size: 13px; }
        .logo-text { font-size: 13px; font-weight: 800; color: rgba(255,255,255,.5); letter-spacing: 2px; text-transform: uppercase; }

        /* ── PRINT ── */
        @media print {
          body > *:not(#flyer-print-target) { display: none !important; }
          #flyer-print-target {
            display: block !important;
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: #111;
          }
          .flyer { border-radius: 0 !important; box-shadow: none !important; }
          @page { margin: 0; size: auto; }
        }
      `}</style>

      {/* Controls bar */}
      <div className="controls">
        <span className="ctrl-label">Formato:</span>
        {(['story', 'cuadrado', 'horizontal'] as const).map(f => (
          <button key={f} className={`fmt-btn ${format === f ? 'active' : ''}`} onClick={() => setFormat(f)}>
            {f === 'story' ? '📱 Story (9:16)' : f === 'cuadrado' ? '⬛ Cuadrado (1:1)' : '🖥 Horizontal (16:9)'}
          </button>
        ))}
        <button className="dl-btn" onClick={download}>
          ⬇️ Descargar / Compartir
        </button>
      </div>

      <p style={{ color: '#555', fontSize: 12, marginTop: 16 }}>
        Clic en "Descargar" → Guardar como PDF o hacer captura de pantalla para compartir por WhatsApp
      </p>

      {/* Preview */}
      <div className="preview-wrap" id="flyer-print-target">
        <div
          className={`flyer flyer-${format}`}
          style={{ width: d.w, height: d.h }}
        >
          {/* BG decorations */}
          <div className="bg-blob" style={{ width: 300, height: 300, background: '#E6007E', opacity: .12, top: -100, right: -80 }} />
          <div className="bg-blob" style={{ width: 200, height: 200, background: '#6B21A8', opacity: .15, bottom: 60, left: -60 }} />
          <div className="bg-blob" style={{ width: 120, height: 120, background: '#E6007E', opacity: .08, bottom: 200, right: 40 }} />

          {/* Grid lines accent */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: .04 }} xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1={i * 60} y1="0" x2={i * 60} y2="100%" stroke="white" strokeWidth="1" />
            ))}
          </svg>

          {format === 'story' && <StoryLayout />}
          {format === 'cuadrado' && <SquareLayout />}
          {format === 'horizontal' && <HorizontalLayout />}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   STORY  (390 × 693)
────────────────────────────────────────────── */
function StoryLayout() {
  return (
    <div style={{ padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span className="logo-text">Yani Trend</span>
        <span className="tag">Oferta limitada</span>
      </div>

      {/* Hero emoji / product */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ fontSize: 130, filter: 'drop-shadow(0 20px 40px rgba(230,0,126,.4))' }}>🤖</div>
        <div style={{ position: 'absolute', top: -8, right: 0, background: '#E6007E', color: 'white', borderRadius: 12, padding: '6px 12px', fontWeight: 800, fontSize: 15, boxShadow: '0 4px 16px rgba(230,0,126,.5)' }}>
          26% OFF
        </div>
      </div>

      {/* Content */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 8 }}>
          ¡Nunca más<br />limpies el piso<br />vos mismo! 🙌
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>
          Aspiradora Robot Jessica — limpia sola mientras hacés lo que te gusta.
        </p>

        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
          {[
            'Limpia mientras dormís',
            'Ideal para mascotas',
            'Envío gratis a todo el país',
            '30 días de garantía',
          ].map((b, i) => (
            <div key={i} className="benefit">
              <div className="check">✓</div> {b}
            </div>
          ))}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <span className="price-new">$38.630</span>
          <span className="price-old">$52.000</span>
          <span className="discount-badge">-26%</span>
        </div>
        <p style={{ fontSize: 11, color: '#666', marginBottom: 20 }}>ARS · Pago contra entrega</p>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="wa-pill">
            <span style={{ fontSize: 18 }}>💬</span>
            Pedí al WhatsApp
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="stars">★★★★★</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>328 compradores</div>
          </div>
        </div>

        <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#555' }}>yanitrend.com</span>
          <span style={{ fontSize: 11, color: '#555' }}>💳 Pagás cuando recibís</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   CUADRADO  (500 × 500)
────────────────────────────────────────────── */
function SquareLayout() {
  return (
    <div style={{ padding: 32, height: '100%', display: 'flex', gap: 24, position: 'relative', zIndex: 1 }}>
      {/* Left */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span className="logo-text" style={{ display: 'block', marginBottom: 12 }}>Yani Trend</span>
          <div className="tag" style={{ marginBottom: 16 }}>⚡ Solo quedan 12 unidades</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 12 }}>
            ¡Tu casa limpia sola! 🤖
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 20 }}>
            La Aspiradora Robot Jessica trabaja mientras vos descansás.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 24 }}>
            {['🤖 Limpia automáticamente', '🐾 Ideal para mascotas', '🚚 Envío gratis', '💳 Pagás al recibir'].map((b, i) => (
              <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', display: 'flex', gap: 6 }}>
                <span>{b.split(' ')[0]}</span>
                <span>{b.slice(b.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span className="price-new" style={{ fontSize: 34 }}>$38.630</span>
            <span className="price-old">$52.000</span>
          </div>
          <div className="wa-pill" style={{ display: 'inline-flex' }}>💬 Pedí por WhatsApp</div>
        </div>
      </div>

      {/* Right */}
      <div style={{ width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ fontSize: 100, filter: 'drop-shadow(0 12px 30px rgba(230,0,126,.5))' }}>🤖</div>
        <div style={{ background: '#E6007E', color: 'white', borderRadius: 10, padding: '8px 14px', textAlign: 'center', fontWeight: 800 }}>
          <div style={{ fontSize: 22 }}>26%</div>
          <div style={{ fontSize: 11 }}>DESCUENTO</div>
        </div>
        <div className="stars" style={{ textAlign: 'center' }}>★★★★★</div>
        <div style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>328 reseñas<br />verificadas</div>
        <div style={{ fontSize: 10, color: '#555', textAlign: 'center', marginTop: 8 }}>yanitrend.com</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   HORIZONTAL  (693 × 390)
────────────────────────────────────────────── */
function HorizontalLayout() {
  return (
    <div style={{ padding: '28px 32px', height: '100%', display: 'flex', gap: 32, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      {/* Emoji */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 110, filter: 'drop-shadow(0 12px 30px rgba(230,0,126,.5))' }}>🤖</div>
        <div style={{ background: '#E6007E', color: 'white', borderRadius: 8, padding: '5px 12px', fontWeight: 800, fontSize: 14 }}>26% OFF</div>
      </div>

      {/* Center */}
      <div style={{ flex: 1 }}>
        <span className="logo-text" style={{ display: 'block', marginBottom: 8 }}>Yani Trend</span>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 10 }}>
          ¡Tu piso limpio, solo! 🙌
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 16 }}>
          Aspiradora Robot Jessica — tecnología que trabaja por vos.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 20 }}>
          {['🤖 Limpia automática', '🚚 Envío gratis', '🐾 Apta mascotas', '💳 Pago al recibir'].map((b, i) => (
            <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,.8)' }}>{b}</div>
          ))}
        </div>
        <div className="wa-pill" style={{ display: 'inline-flex' }}>💬 Pedí por WhatsApp</div>
      </div>

      {/* Right price block */}
      <div style={{ flexShrink: 0, textAlign: 'center' }}>
        <div style={{ color: '#666', fontSize: 13, textDecoration: 'line-through', marginBottom: 4 }}>$52.000</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: 'white', lineHeight: 1 }}>$38.630</div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 4, marginBottom: 16 }}>ARS</div>
        <div className="stars">★★★★★</div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>328 compradores</div>
        <div style={{ fontSize: 10, color: '#555', marginTop: 12 }}>yanitrend.com</div>
      </div>
    </div>
  );
}
