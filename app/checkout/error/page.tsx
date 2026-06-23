'use client'

export default function ErrorPage() {
  return (
    <div style={{
      fontFamily: "'Poppins', Arial, sans-serif",
      background: '#F3E9DF',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '40px 32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>😔</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#cc0000', margin: '0 0 12px' }}>
            El pago no se completó
          </h1>
          <p style={{ fontSize: 14, color: '#555', margin: '0 0 24px', lineHeight: 1.6 }}>
            Algo salió mal con el pago. Podés intentar de nuevo o escribirnos por WhatsApp y lo coordinamos directo.
          </p>

          <a
            href="/checkout"
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #E6007E, #c0005f)',
              color: '#fff',
              borderRadius: 12,
              padding: '14px',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 12,
            }}
          >
            🔄 Intentar de nuevo
          </a>

          <a
            href={`https://wa.me/5492996593402?text=Hola!%20Quiero%20hacer%20un%20pedido%20pero%20tuve%20un%20problema%20con%20el%20pago`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#25D366',
              color: '#fff',
              borderRadius: 12,
              padding: '14px',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 12,
            }}
          >
            📲 Coordinar por WhatsApp
          </a>

          <a
            href="/"
            style={{
              display: 'block',
              background: '#f5f5f5',
              color: '#555',
              borderRadius: 12,
              padding: '12px',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
