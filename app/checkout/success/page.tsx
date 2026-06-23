'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const params = useSearchParams()
  const pendiente = params.get('pendiente') === '1'
  const nombre = params.get('collection_status') || ''

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
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {pendiente ? '⏳' : '🎉'}
          </div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 800,
            color: pendiente ? '#f59e0b' : '#10b981',
            margin: '0 0 12px',
          }}>
            {pendiente ? '¡Pago en proceso!' : '¡Pedido confirmado!'}
          </h1>
          <p style={{ fontSize: 15, color: '#555', margin: '0 0 24px', lineHeight: 1.6 }}>
            {pendiente
              ? 'Tu pago está siendo procesado. Te avisamos por email cuando se confirme.'
              : 'Tu pago fue aprobado. Vamos a preparar tu pedido y te contactamos por WhatsApp para coordinar la entrega. 📦'}
          </p>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #10b981',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: '#065f46', fontWeight: 600 }}>
              ✅ Envío gratis a tu domicilio<br />
              🚚 Llega en 3 a 7 días hábiles<br />
              📲 Te avisamos por WhatsApp con el seguimiento
            </p>
          </div>

          <a
            href={`https://wa.me/5492996593402?text=Hola!%20Acabo%20de%20comprar%20en%20Yani%20Trend%20%F0%9F%8E%89`}
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
            📲 Escribinos por WhatsApp
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

        <p style={{ marginTop: 16, fontSize: 11, color: '#aaa' }}>
          Yani Trend · yanitrend.com
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
