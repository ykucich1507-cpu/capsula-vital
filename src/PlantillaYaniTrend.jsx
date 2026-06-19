import { useState } from "react";

// ============================================
// PLANTILLAS DE SLIDES - EDITÁ SOLO ESTE BLOQUE
// ============================================
const PLANTILLAS = {
  correctorPostura: {
    nombre: "Corrector de Postura",
    emoji: "💪",
    slides: [
      {
        tipo: "hook",
        titulo: `¿Cuántas veces por día te decís “enderezate”... y en 5 minutos ya estás encorvada de nuevo?`,
        subtitulo: "",
        fondo: "fucsia",
      },
      {
        tipo: "problema",
        titulo: "¿Te pasa esto?",
        items: [
          "❌ Dolor de espalda al final del día",
          "❌ Encorvamiento por la computadora",
          "❌ Tensión muscular constante",
          "❌ Mala postura sin darte cuenta",
        ],
        fondo: "blanco",
      },
      {
        tipo: "solucion",
        titulo: "El Corrector de Postura",
        subtitulo: "Resultados en 2 semanas",
        items: ["Invisible bajo la ropa", "Material transpirable", "Talle único S-XL", "Entrena tu musculatura sola"],
        fondo: "beige",
      },
      {
        tipo: "caracteristicas",
        titulo: "Lo que la hace especial",
        items: [
          "✓ Material transpirable premium",
          "✓ Talle único ajustable S-XL",
          "✓ Invisible bajo la ropa",
          "✓ Resultados visibles en 14 días",
          "✓ Recomendado por especialistas",
        ],
        fondo: "blanco",
      },
      {
        tipo: "testimonio",
        titulo: '"Después de 2 semanas ya no tengo dolor. Lo uso todos los días."',
        subtitulo: "— María S., Buenos Aires ⭐⭐⭐⭐⭐",
        fondo: "oscuro",
      },
      {
        tipo: "precio",
        titulo: "Oferta exclusiva",
        precioAntes: "$89,990 ARS",
        precioAhora: "$54,990 ARS",
        cta: "Comprá en yanitrend.com",
        fondo: "fucsia",
      },
    ],
  },
  cepilloAlisador: {
    nombre: "Cepillo Alisador Pro 2 en 1",
    emoji: "💇‍♀️",
    slides: [
      {
        tipo: "hook",
        titulo: "¿Cuánto tiempo perdés alisándote el pelo... para que en 2 horas ya se encrespó?",
        subtitulo: "",
        fondo: "beige",
      },
      {
        tipo: "problema",
        titulo: "¿Cansada de esto?",
        items: [
          "❌ 45 minutos frente al espejo",
          "❌ Daño por calor excesivo",
          "❌ Se encrespa con la humedad",
          "❌ Gastar en plancha + secador + protector",
        ],
        fondo: "blanco",
      },
      {
        tipo: "solucion",
        titulo: "Cepillo Alisador Pro 2 en 1",
        subtitulo: "Alisa Y riza. Un solo aparato.",
        items: ["15 minutos. Listo.", "Temperatura automática", "Cerámica que protege", "Resultado que dura todo el día"],
        fondo: "fucsia",
      },
      {
        tipo: "caracteristicas",
        titulo: "Por qué lo amarás",
        items: [
          "✓ 2 funciones: alisa y riza",
          "✓ Temperatura inteligente",
          "✓ Cerámica que protege el cabello",
          "✓ Calienta en 30 segundos",
          "✓ Cable giratorio 360°",
        ],
        fondo: "blanco",
      },
      {
        tipo: "comparacion",
        titulo: "El antes y el después",
        antes: ["⏰ 45 min de rutina", "🔥 Daño por calor", "😤 Se encrespa", "💸 Varios aparatos"],
        despues: ["⚡ 15 min de rutina", "💎 Cabello protegido", "✨ Dura todo el día", "🎯 Un solo aparato"],
        fondo: "beige",
      },
      {
        tipo: "precio",
        titulo: "Tu cabello perfecto te espera",
        precioAntes: "$35,850 ARS",
        precioAhora: "$34,900 ARS",
        cta: "Comprá en yanitrend.com",
        fondo: "fucsia",
      },
    ],
  },
};

// ============================================
// COLORES Y ESTILOS DE LA MARCA YANI TREND
// ============================================
const COLORES = {
  fucsia: "#E6007E",
  blanco: "#FFFFFF",
  beige: "#F3E9DF",
  oscuro: "#2B2B2B",
  grisClaro: "#f5f5f5",
};

const fondoEstilos = {
  fucsia: { background: `linear-gradient(135deg, ${COLORES.fucsia} 0%, #b3005f 100%)`, color: COLORES.blanco },
  blanco: { background: COLORES.blanco, color: COLORES.oscuro },
  beige: { background: COLORES.beige, color: COLORES.oscuro },
  oscuro: { background: `linear-gradient(135deg, ${COLORES.oscuro} 0%, #1a1a1a 100%)`, color: COLORES.blanco },
};

// ============================================
// COMPONENTES DE SLIDES
// ============================================

function SlideHook({ slide, nombreProducto }) {
  const estilo = fondoEstilos[slide.fondo];
  return (
    <div style={{ ...estilosBase.slide, ...estilo, textAlign: "center", padding: "40px 30px" }}>
      <div style={{ fontSize: 40, marginBottom: 20 }}>⚡</div>
      <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, opacity: 0.8, marginBottom: 16, textTransform: "uppercase" }}>
        YANI TREND
      </p>
      <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3, maxWidth: 280, margin: "0 auto 20px" }}>
        {slide.titulo}
      </h1>
      <div style={{ width: 40, height: 3, background: slide.fondo === "fucsia" ? COLORES.blanco : COLORES.fucsia, margin: "0 auto 16px", borderRadius: 2 }} />
      <p style={{ fontSize: 13, opacity: 0.85, fontWeight: 500 }}>{nombreProducto}</p>
    </div>
  );
}

function SlideProblema({ slide }) {
  return (
    <div style={{ ...estilosBase.slide, ...fondoEstilos[slide.fondo], padding: "40px 28px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORES.fucsia, marginBottom: 24, textAlign: "center" }}>
        {slide.titulo}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {slide.items.map((item, i) => (
          <div key={i} style={{ background: COLORES.beige, padding: "14px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: COLORES.oscuro }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideSolucion({ slide }) {
  const estilo = fondoEstilos[slide.fondo];
  const esOscuro = slide.fondo === "fucsia" || slide.fondo === "oscuro";
  return (
    <div style={{ ...estilosBase.slide, ...estilo, padding: "40px 28px", textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, opacity: 0.8, marginBottom: 12, textTransform: "uppercase" }}>
        LA SOLUCIÓN
      </p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{slide.titulo}</h2>
      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 24, opacity: 0.9 }}>{slide.subtitulo}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {slide.items.map((item, i) => (
          <div key={i} style={{
            background: esOscuro ? "rgba(255,255,255,0.15)" : COLORES.blanco,
            padding: "12px 16px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            color: esOscuro ? COLORES.blanco : COLORES.oscuro,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{ color: esOscuro ? COLORES.blanco : COLORES.fucsia, fontWeight: 700 }}>✓</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideCaracteristicas({ slide }) {
  return (
    <div style={{ ...estilosBase.slide, ...fondoEstilos[slide.fondo], padding: "40px 28px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORES.fucsia, marginBottom: 24, textAlign: "center" }}>
        {slide.titulo}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {slide.items.map((item, i) => (
          <div key={i} style={{
            padding: "14px 0",
            borderBottom: i < slide.items.length - 1 ? `1px solid ${COLORES.beige}` : "none",
            fontSize: 13,
            fontWeight: 500,
            color: COLORES.oscuro,
            display: "flex",
            gap: 10,
          }}>
            <span style={{ color: COLORES.fucsia, fontWeight: 700, minWidth: 16 }}>✓</span>
            {item.replace("✓ ", "")}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideTestimonio({ slide }) {
  return (
    <div style={{ ...estilosBase.slide, ...fondoEstilos[slide.fondo], padding: "40px 28px", textAlign: "center" }}>
      <div style={{ fontSize: 40, color: COLORES.fucsia, marginBottom: 16, lineHeight: 1 }}>"</div>
      <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, fontStyle: "italic", marginBottom: 20 }}>
        {slide.titulo.replace(/^"|"$/g, "")}
      </p>
      <div style={{ width: 40, height: 2, background: COLORES.fucsia, margin: "0 auto 16px", borderRadius: 2 }} />
      <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>{slide.subtitulo}</p>
    </div>
  );
}

function SlideComparacion({ slide }) {
  return (
    <div style={{ ...estilosBase.slide, ...fondoEstilos[slide.fondo], padding: "36px 20px" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORES.oscuro, marginBottom: 20, textAlign: "center" }}>
        {slide.titulo}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ background: COLORES.oscuro, color: COLORES.blanco, padding: "8px 12px", borderRadius: "8px 8px 0 0", fontSize: 11, fontWeight: 700, textAlign: "center", letterSpacing: 1 }}>
            ANTES
          </div>
          <div style={{ background: "#f0f0f0", borderRadius: "0 0 8px 8px", padding: "12px" }}>
            {slide.antes.map((item, i) => (
              <p key={i} style={{ fontSize: 11, color: COLORES.oscuro, marginBottom: i < slide.antes.length - 1 ? 10 : 0, lineHeight: 1.4 }}>{item}</p>
            ))}
          </div>
        </div>
        <div>
          <div style={{ background: COLORES.fucsia, color: COLORES.blanco, padding: "8px 12px", borderRadius: "8px 8px 0 0", fontSize: 11, fontWeight: 700, textAlign: "center", letterSpacing: 1 }}>
            DESPUÉS
          </div>
          <div style={{ background: COLORES.blanco, borderRadius: "0 0 8px 8px", padding: "12px", border: `2px solid ${COLORES.fucsia}`, borderTop: "none" }}>
            {slide.despues.map((item, i) => (
              <p key={i} style={{ fontSize: 11, color: COLORES.oscuro, marginBottom: i < slide.despues.length - 1 ? 10 : 0, lineHeight: 1.4 }}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlidePrecio({ slide }) {
  return (
    <div style={{ ...estilosBase.slide, ...fondoEstilos[slide.fondo], padding: "40px 28px", textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, opacity: 0.8, marginBottom: 12, textTransform: "uppercase" }}>
        OFERTA ESPECIAL
      </p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, lineHeight: 1.3 }}>{slide.titulo}</h2>
      <div style={{ background: "rgba(255,255,255,0.15)", padding: "20px", borderRadius: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 13, textDecoration: "line-through", opacity: 0.7, marginBottom: 4 }}>{slide.precioAntes}</p>
        <p style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{slide.precioAhora}</p>
        <p style={{ fontSize: 12, opacity: 0.85 }}>Envío a todo el país 🚚</p>
      </div>
      <div style={{ background: COLORES.blanco, color: COLORES.fucsia, padding: "14px 24px", borderRadius: 50, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
        {slide.cta} →
      </div>
      <p style={{ fontSize: 12, opacity: 0.75 }}>Link en BIO ⬆️</p>
    </div>
  );
}

function renderSlide(slide, nombreProducto) {
  switch (slide.tipo) {
    case "hook": return <SlideHook slide={slide} nombreProducto={nombreProducto} />;
    case "problema": return <SlideProblema slide={slide} />;
    case "solucion": return <SlideSolucion slide={slide} />;
    case "caracteristicas": return <SlideCaracteristicas slide={slide} />;
    case "testimonio": return <SlideTestimonio slide={slide} />;
    case "comparacion": return <SlideComparacion slide={slide} />;
    case "precio": return <SlidePrecio slide={slide} />;
    default: return null;
  }
}

// ============================================
// ESTILOS BASE
// ============================================
const estilosBase = {
  slide: {
    width: 320,
    minHeight: 400,
    borderRadius: 16,
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    flexShrink: 0,
    overflow: "hidden",
  },
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function PlantillaYaniTrend() {
  const [productoActivo, setProductoActivo] = useState("correctorPostura");
  const [slideActivo, setSlideActivo] = useState(0);

  const plantilla = PLANTILLAS[productoActivo];
  const slides = plantilla.slides;
  const slide = slides[slideActivo];

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", fontFamily: "'Poppins', sans-serif", padding: "20px 16px" }}>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ background: COLORES.fucsia, borderRadius: 10, padding: "6px 12px" }}>
            <span style={{ color: COLORES.blanco, fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>YANI TREND</span>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Generador de carruseles Instagram</p>
      </div>

      {/* SELECTOR DE PRODUCTO */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
        {Object.entries(PLANTILLAS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => { setProductoActivo(key); setSlideActivo(0); }}
            style={{
              padding: "10px 18px",
              borderRadius: 50,
              border: productoActivo === key ? "none" : "1px solid rgba(255,255,255,0.2)",
              background: productoActivo === key ? COLORES.fucsia : "rgba(255,255,255,0.08)",
              color: COLORES.blanco,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {val.emoji} {val.nombre}
          </button>
        ))}
      </div>

      {/* SLIDE PRINCIPAL */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        {renderSlide(slide, plantilla.nombre)}
      </div>

      {/* INDICADOR DE SLIDE */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          Slide {slideActivo + 1} de {slides.length} · {slide.tipo.toUpperCase()}
        </span>
      </div>

      {/* NAVEGACIÓN */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setSlideActivo(Math.max(0, slideActivo - 1))}
          disabled={slideActivo === 0}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: slideActivo === 0 ? "rgba(255,255,255,0.08)" : COLORES.fucsia,
            border: "none", color: COLORES.blanco, fontSize: 18,
            cursor: slideActivo === 0 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: slideActivo === 0 ? 0.4 : 1,
          }}
        >‹</button>

        {/* PUNTOS */}
        <div style={{ display: "flex", gap: 8 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideActivo(i)}
              style={{
                width: i === slideActivo ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slideActivo ? COLORES.fucsia : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setSlideActivo(Math.min(slides.length - 1, slideActivo + 1))}
          disabled={slideActivo === slides.length - 1}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: slideActivo === slides.length - 1 ? "rgba(255,255,255,0.08)" : COLORES.fucsia,
            border: "none", color: COLORES.blanco, fontSize: 18,
            cursor: slideActivo === slides.length - 1 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: slideActivo === slides.length - 1 ? 0.4 : 1,
          }}
        >›</button>
      </div>

      {/* MINIATURAS */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setSlideActivo(i)}
            style={{
              width: 56, height: 70,
              borderRadius: 8,
              border: i === slideActivo ? `2px solid ${COLORES.fucsia}` : "2px solid transparent",
              background: fondoEstilos[s.fondo]?.background || COLORES.beige,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 16 }}>
              {s.tipo === "hook" ? "🎯" : s.tipo === "problema" ? "😤" : s.tipo === "solucion" ? "✨" : s.tipo === "caracteristicas" ? "📋" : s.tipo === "testimonio" ? "💬" : s.tipo === "comparacion" ? "⚖️" : "🛒"}
            </span>
            <span style={{ fontSize: 8, color: COLORES.blanco, fontWeight: 600, opacity: 0.8, textAlign: "center", lineHeight: 1.2 }}>
              {s.tipo.slice(0, 5).toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* INSTRUCCIONES */}
      <div style={{ maxWidth: 360, margin: "24px auto 0", background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "20px 20px" }}>
        <p style={{ color: COLORES.fucsia, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
          📱 Cómo usar esto en Canva:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "1. Mirá cada slide acá",
            "2. Abrí Canva → Publicación de Instagram",
            "3. Copiá el texto de cada slide",
            "4. Usá el color fucsia #E6007E",
            "5. Fuente: Poppins Bold para títulos",
            "6. Descargá y subí como carrusel",
          ].map((paso, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORES.fucsia, marginTop: 6, flexShrink: 0 }} />
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.4 }}>{paso}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textAlign: "center" }}>
            🎨 Paleta Yani Trend · Fucsia #E6007E · Beige #F3E9DF · Gris #2B2B2B
          </p>
        </div>
      </div>
    </div>
  );
}
