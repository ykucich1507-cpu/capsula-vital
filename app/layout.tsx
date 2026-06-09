import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yani Trend — Pagás cuando recibís',
  description: 'Moda y accesorios con entrega en casa. Pagás cuando lo recibís en la puerta.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Poppins', system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}
