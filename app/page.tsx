'use client'

import { useEffect } from 'react'

const PRODUCTS = [
  {
    id: 1,
    badge: 'viral' as const,
    badgeLabel: '🔥 Viral',
    name: 'Aspiradora Robot Jessica',
    stars: 4.9,
    reviews: 328,
    priceOld: 52000,
    price: 38630,
    img: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg',
    href: 'https://yanitrend.com/products/aspiradora-robot-jessica',
  },
  {
    id: 2,
    badge: 'bestseller' as const,
    badgeLabel: '⭐ Más vendido',
    name: 'Vaso Térmico Sensor LED',
    stars: 4.8,
    reviews: 214,
    priceOld: 28000,
    price: 19990,
    img: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg',
    href: 'https://yanitrend.com/collections/all',
  },
  {
    id: 3,
    badge: 'new' as const,
    badgeLabel: '🆕 Nuevo',
    name: 'Neocell Colágeno Hidrolizado',
    stars: 4.7,
    reviews: 89,
    priceOld: 24000,
    price: 17500,
    img: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg',
    href: 'https://yanitrend.com/collections/all',
  },
  {
    id: 4,
    badge: 'viral' as const,
    badgeLabel: '🔥 Viral',
    name: 'Organizador Inteligente para Cocina',
    stars: 4.6,
    reviews: 156,
    priceOld: 18000,
    price: 12990,
    img: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg',
    href: 'https://yanitrend.com/collections/all',
  },
]

const TRUST = [
  { icon: '🚚', title: 'Envíos rápidos', desc: 'Llega en 3 a 5 días hábiles' },
  { icon: '🔒', title: 'Compra segura', desc: 'Sin tarjeta ni datos bancarios' },
  { icon: '💳', title: 'Pagás al recibir', desc: 'Efectivo en la puerta de tu casa' },
  { icon: '↩️', title: 'Cambios fáciles', desc: 'Garantía de 30 días' },
]

function fmtARS(n: number) {
  return '$' + n.toLocaleString('es-AR')
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars-row" aria-label={`${rating} estrellas`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#E6007E' : '#DDD', fontSize: 14 }}>★</span>
      ))}
    </span>
  )
}

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
    script.onload = () => {
      // @ts-ignore
      if (window.lucide) window.lucide.createIcons()

      // Spot thumb switcher
      document.querySelectorAll('.spot-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          document.querySelectorAll('.spot-thumb').forEach((t) => t.classList.remove('active'))
          thumb.classList.add('active')
        })
      })

      // Scroll reveal
      const obs = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') }),
        { threshold: 0.12 }
      )
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    }
    document.head.appendChild(script)
  }, [])

  return (
    <>
      <style>{`
        :root {
          --pink: #E6007E; --pink-h: #FF1A92; --pink-soft: #FBE0EF;
          --gray-f: #F7F7F7; --gray-e: #ECECEC; --gray-d: #D4D4D4;
          --txt: #1A1A1A; --txt-2: #555; --txt-3: #999;
          --white: #FFFFFF;
          --r-sm: 10px; --r-md: 14px; --r-lg: 20px; --r-xl: 24px;
          --shadow-xs: 0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04);
          --shadow-sm: 0 4px 14px rgba(0,0,0,0.07);
          --shadow-md: 0 8px 28px rgba(0,0,0,0.09);
          --shadow-lg: 0 20px 60px rgba(0,0,0,0.12);
          --shadow-pink: 0 8px 28px rgba(230,0,126,0.25);
          --ease: cubic-bezier(0.22,1,0.36,1);
          --dur: 220ms;
          --font: 'Poppins', system-ui, sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin:0; font-family:var(--font); background:var(--white); color:var(--txt); -webkit-font-smoothing:antialiased; }

        /* ── Scroll reveal ── */
        .reveal { opacity:0; transform:translateY(22px); transition:opacity 0.55s var(--ease), transform 0.55s var(--ease); }
        .reveal.vis { opacity:1; transform:none; }
        .reveal-d1 { transition-delay:0.08s; }
        .reveal-d2 { transition-delay:0.16s; }
        .reveal-d3 { transition-delay:0.24s; }
        .reveal-d4 { transition-delay:0.32s; }

        /* ── Layout ── */
        .wrap { max-width:1180px; margin:0 auto; padding:0 40px; }
        @media(max-width:768px){ .wrap { padding:0 20px; } }

        /* ── Announcement bar ── */
        .ann { background:var(--pink); color:#fff; text-align:center; padding:11px 16px; font-size:13px; font-weight:600; letter-spacing:0.02em; }
        .ann .sep { opacity:.4; margin:0 12px; }

        /* ── Header ── */
        .hdr { position:sticky; top:0; z-index:50; background:rgba(255,255,255,0.92); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid var(--gray-e); }
        .hdr-inner { display:flex; align-items:center; gap:28px; padding:14px 40px; max-width:1180px; margin:0 auto; }
        @media(max-width:768px){ .hdr-inner { padding:14px 20px; gap:16px; } }
        .logo { display:flex; align-items:center; font-weight:700; font-size:22px; letter-spacing:-0.03em; color:var(--txt); text-decoration:none; flex-shrink:0; }
        .logo-accent { color:var(--pink); }
        .logo-dot { width:6px; height:6px; border-radius:50%; background:var(--pink); margin-left:2px; margin-bottom:2px; display:inline-block; }
        .nav { display:flex; gap:22px; }
        @media(max-width:900px){ .nav { display:none; } }
        .nav a { text-decoration:none; font-size:14px; font-weight:500; color:var(--txt-2); transition:color var(--dur); white-space:nowrap; }
        .nav a:hover, .nav a.active { color:var(--pink); font-weight:600; }
        .hdr-right { margin-left:auto; display:flex; align-items:center; gap:10px; flex-shrink:0; }
        .ico-btn { background:none; border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; color:var(--txt-2); padding:7px; border-radius:var(--r-sm); transition:all var(--dur); }
        .ico-btn:hover { color:var(--pink); background:var(--pink-soft); }
        .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; border-radius:999px; font-family:var(--font); font-weight:600; transition:all var(--dur) var(--ease); text-decoration:none; border:none; white-space:nowrap; }
        .btn:active { transform:scale(0.97); }
        .btn-primary { background:var(--pink); color:#fff; font-size:15px; padding:13px 28px; }
        .btn-primary:hover { background:var(--pink-h); box-shadow:var(--shadow-pink); transform:translateY(-2px) scale(1.015); }
        .btn-outline { background:transparent; color:var(--pink); font-size:14px; padding:12px 26px; border:2px solid var(--pink); }
        .btn-outline:hover { background:var(--pink); color:#fff; }
        .btn-lg { font-size:16px; padding:16px 34px; }
        .btn-sm { font-size:13px; padding:10px 20px; }

        /* ── Hero ── */
        .hero { padding:80px 0 96px; background:var(--white); }
        .hero-grid { display:grid; grid-template-columns:1.1fr 0.9fr; gap:60px; align-items:center; }
        @media(max-width:768px){ .hero-grid { grid-template-columns:1fr; gap:40px; } }
        .hero-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--pink); margin-bottom:18px; }
        .hero-eyebrow::before { content:''; width:28px; height:2px; background:var(--pink); border-radius:2px; }
        .hero-h1 { font-size:56px; font-weight:700; line-height:1.04; letter-spacing:-0.03em; color:var(--txt); margin:0 0 22px; }
        .hero-h1 em { font-style:normal; color:var(--pink); }
        @media(max-width:768px){ .hero-h1 { font-size:38px; } }
        .hero-sub { font-size:17px; line-height:1.7; color:var(--txt-2); margin:0 0 36px; max-width:42ch; }
        .hero-ctas { display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
        .ghost-link { font-size:14px; font-weight:600; color:var(--txt-2); text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:color var(--dur); }
        .ghost-link:hover { color:var(--pink); }
        .hero-img-wrap { border-radius:var(--r-xl); overflow:hidden; aspect-ratio:4/5; box-shadow:var(--shadow-md); }
        .hero-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.6s var(--ease); }
        .hero-img-wrap:hover img { transform:scale(1.04); }

        /* ── Trust bar ── */
        .trust { background:var(--gray-f); border-top:1px solid var(--gray-e); border-bottom:1px solid var(--gray-e); padding:32px 0; }
        .trust-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        @media(max-width:768px){ .trust-grid { grid-template-columns:repeat(2,1fr); } }
        .trust-item { display:flex; align-items:center; gap:14px; }
        .trust-icon { width:46px; height:46px; min-width:46px; border-radius:50%; background:var(--white); box-shadow:var(--shadow-xs); display:flex; align-items:center; justify-content:center; font-size:20px; }
        .trust-strong { display:block; font-size:13px; font-weight:700; color:var(--txt); }
        .trust-desc { font-size:12px; color:var(--txt-3); line-height:1.4; }

        /* ── Section header ── */
        .sec-hdr { text-align:center; margin-bottom:56px; }
        .sec-eyebrow { display:inline-block; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--pink); margin-bottom:10px; }
        .sec-hdr h2 { font-size:40px; font-weight:700; letter-spacing:-0.025em; color:var(--txt); margin:0 0 12px; line-height:1.1; }
        @media(max-width:768px){ .sec-hdr h2 { font-size:28px; } }
        .sec-hdr p { font-size:16px; color:var(--txt-2); max-width:52ch; margin:0 auto; line-height:1.7; }

        /* ── Product grid ── */
        .products { padding:96px 0; background:var(--white); }
        .prod-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        @media(max-width:1024px){ .prod-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px){ .prod-grid { grid-template-columns:1fr; } }

        .prod-card { background:var(--white); border:1px solid var(--gray-e); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--shadow-xs); transition:box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease); display:flex; flex-direction:column; }
        .prod-card:hover { box-shadow:var(--shadow-md); transform:translateY(-5px); }
        .prod-img-wrap { position:relative; overflow:hidden; aspect-ratio:1/1; background:var(--gray-f); }
        .prod-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.55s var(--ease); }
        .prod-card:hover .prod-img-wrap img { transform:scale(1.06); }
        .prod-badge { position:absolute; top:12px; left:12px; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; z-index:1; }
        .badge-viral { background:#FFF1F7; color:var(--pink); border:1px solid #F8C6DC; }
        .badge-bestseller { background:#FFF8E1; color:#D4880B; border:1px solid #F0D88A; }
        .badge-new { background:#E6F4FF; color:#0077CC; border:1px solid #A8D4F5; }
        .prod-body { padding:16px 16px 20px; flex:1; display:flex; flex-direction:column; }
        .prod-name { font-size:14px; font-weight:600; color:var(--txt); margin:0 0 6px; line-height:1.4; }
        .prod-rating { display:flex; align-items:center; gap:6px; margin-bottom:10px; }
        .stars-row { display:inline-flex; gap:1px; line-height:1; }
        .prod-rating-txt { font-size:12px; color:var(--txt-3); }
        .prod-prices { display:flex; align-items:baseline; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
        .prod-price-now { font-size:20px; font-weight:700; color:var(--pink); }
        .prod-price-old { font-size:14px; color:var(--txt-3); text-decoration:line-through; }
        .prod-price-save { font-size:11px; font-weight:700; background:var(--pink-soft); color:var(--pink); padding:3px 8px; border-radius:999px; }
        .prod-buy { width:100%; background:var(--txt); color:#fff; border:none; border-radius:999px; font-family:var(--font); font-size:13px; font-weight:600; padding:11px 0; cursor:pointer; transition:all var(--dur) var(--ease); margin-top:auto; text-align:center; text-decoration:none; display:block; }
        .prod-buy:hover { background:var(--pink); box-shadow:var(--shadow-pink); transform:scale(1.02); }

        /* ── How it works ── */
        .steps { padding:96px 0; background:var(--gray-f); }
        .steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        @media(max-width:768px){ .steps-grid { grid-template-columns:1fr; } }
        .step-card { background:var(--white); border:1px solid var(--gray-e); border-radius:var(--r-lg); padding:36px 28px; box-shadow:var(--shadow-xs); transition:box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease); }
        .step-card:hover { box-shadow:var(--shadow-md); transform:translateY(-4px); }
        .step-num { font-size:56px; font-weight:700; color:var(--pink-soft); line-height:1; letter-spacing:-0.04em; margin-bottom:16px; }
        .step-icon { width:52px; height:52px; border-radius:50%; background:var(--pink-soft); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
        .step-card h3 { font-size:18px; font-weight:700; color:var(--txt); margin:0 0 8px; }
        .step-card p { font-size:14px; line-height:1.7; color:var(--txt-2); margin:0; }

        /* ── Spotlight ── */
        .spotlight { padding:96px 0; background:var(--white); }
        .spot-grid { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }
        @media(max-width:768px){ .spot-grid { grid-template-columns:1fr; gap:40px; } }
        .spot-imgs { display:flex; gap:12px; }
        .spot-main { flex:1; aspect-ratio:3/4; border-radius:var(--r-xl); overflow:hidden; box-shadow:var(--shadow-md); }
        .spot-main img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.6s var(--ease); }
        .spot-main:hover img { transform:scale(1.04); }
        .spot-thumbs { display:flex; flex-direction:column; gap:10px; }
        .spot-thumb { width:80px; height:106px; border-radius:var(--r-md); background:var(--gray-f); border:2px solid transparent; cursor:pointer; overflow:hidden; transition:border-color var(--dur); }
        .spot-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
        .spot-thumb.active, .spot-thumb:hover { border-color:var(--pink); }
        .spot-badge { display:inline-flex; align-items:center; gap:7px; background:var(--pink); color:#fff; font-size:12px; font-weight:700; padding:5px 14px; border-radius:999px; margin-bottom:14px; }
        .spot-eyebrow { font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--pink); margin-bottom:10px; }
        .spot-title { font-size:36px; font-weight:700; letter-spacing:-0.025em; color:var(--txt); margin:0 0 8px; line-height:1.1; }
        @media(max-width:768px){ .spot-title { font-size:28px; } }
        .spot-sub { font-size:15px; color:var(--txt-2); margin:0 0 18px; }
        .spot-rating { display:flex; align-items:center; gap:10px; margin-bottom:24px; }
        .spot-rating-txt { font-size:13px; color:var(--txt-3); }
        .price-row { display:flex; align-items:baseline; gap:12px; margin-bottom:28px; flex-wrap:wrap; }
        .price-now { font-size:42px; font-weight:700; color:var(--pink); }
        .price-was { font-size:20px; color:var(--txt-3); text-decoration:line-through; }
        .price-save { background:var(--pink-soft); color:var(--pink); font-size:12px; font-weight:700; padding:4px 10px; border-radius:999px; }
        .spot-ctas { display:flex; flex-direction:column; gap:12px; }
        .spot-ctas .btn { justify-content:center; }
        .spot-guarantee { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--txt-3); margin-top:16px; }

        /* ── Testimonials ── */
        .testies { padding:96px 0; background:var(--gray-f); }
        .testy-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media(max-width:768px){ .testy-grid { grid-template-columns:1fr; } }
        .testy-card { background:var(--white); border:1px solid var(--gray-e); border-radius:var(--r-lg); padding:28px; box-shadow:var(--shadow-xs); display:flex; flex-direction:column; transition:box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease); }
        .testy-card:hover { box-shadow:var(--shadow-md); transform:translateY(-3px); }
        .testy-hdr { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
        .testy-avatar { width:44px; height:44px; min-width:44px; border-radius:50%; background:var(--pink-soft); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:16px; color:var(--pink); }
        .testy-name { font-weight:700; font-size:14px; color:var(--txt); }
        .testy-city { font-size:12px; color:var(--txt-3); }
        .testy-stars { font-size:13px; color:var(--pink); margin-bottom:10px; letter-spacing:1px; }
        .testy-text { font-size:14px; line-height:1.7; color:var(--txt-2); flex:1; margin:0; }
        .testy-tag { display:inline-flex; align-items:center; gap:6px; margin-top:16px; font-size:11px; font-weight:700; padding:5px 11px; border-radius:999px; align-self:flex-start; }
        .tag-cod { background:var(--pink-soft); color:var(--pink); }
        .tag-std { background:var(--gray-f); color:var(--txt-2); }

        /* ── CTA banner ── */
        .cta-ban { padding:96px 0; background:var(--white); }
        .cta-ban-inner { text-align:center; max-width:600px; margin:0 auto; }
        .cta-ban-inner h2 { font-size:44px; font-weight:700; letter-spacing:-0.025em; color:var(--txt); margin:12px 0 16px; line-height:1.1; }
        .cta-ban-inner h2 em { font-style:normal; color:var(--pink); }
        @media(max-width:768px){ .cta-ban-inner h2 { font-size:32px; } }
        .cta-ban-inner p { font-size:17px; color:var(--txt-2); margin:0 0 34px; line-height:1.7; }

        /* ── Footer ── */
        .footer { background:var(--txt); color:#fff; }
        .footer-main { display:grid; grid-template-columns:1.6fr repeat(3,1fr); gap:32px; max-width:1180px; margin:0 auto; padding:60px 40px 44px; }
        @media(max-width:768px){ .footer-main { grid-template-columns:1fr; padding:40px 20px 32px; } }
        .footer-brand p { font-size:13px; line-height:1.8; color:rgba(255,255,255,0.45); margin:12px 0 0; max-width:26ch; }
        .foot-logo { display:flex; align-items:center; font-weight:700; font-size:20px; letter-spacing:-0.03em; }
        .foot-logo-accent { color:var(--pink); margin-left:3px; }
        .foot-logo-dot { width:6px; height:6px; border-radius:50%; background:var(--pink); display:inline-block; margin-left:2px; margin-bottom:2px; }
        .footer-col-hd { font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:14px; color:rgba(255,255,255,0.6); }
        .footer-col a { display:block; font-size:13px; color:rgba(255,255,255,0.45); text-decoration:none; padding:4px 0; transition:color var(--dur); }
        .footer-col a:hover { color:#fff; }
        .footer-bottom { border-top:1px solid rgba(255,255,255,0.08); max-width:1180px; margin:0 auto; padding:18px 40px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        @media(max-width:768px){ .footer-bottom { padding:18px 20px; } }
        .footer-bottom p { font-size:12px; color:rgba(255,255,255,0.3); margin:0; }
        .social-links { display:flex; gap:8px; }
        .social-ico { width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.5); text-decoration:none; transition:all var(--dur); }
        .social-ico:hover { background:var(--pink); color:#fff; }
      `}</style>

      {/* Announcement bar */}
      <div className="ann">
        Envío gratis a todo el país
        <span className="sep">·</span>
        Pagás cuando el paquete llega a tu puerta
        <span className="sep">·</span>
        Sin tarjetas ni datos bancarios
      </div>

      {/* Header */}
      <header className="hdr">
        <div className="hdr-inner">
          <a href="/" className="logo">Yani<span className="logo-accent"> Trend</span><span className="logo-dot" /></a>
          <nav className="nav">
            <a href="/" className="active">Inicio</a>
            <a href="https://yanitrend.com/collections/all">Productos</a>
            <a href="https://yanitrend.com/collections/all?sort_by=created-descending">Novedades</a>
            <a href="https://yanitrend.com/collections/all?sort_by=best-selling">Más vendidos</a>
            <a href="https://yanitrend.com/collections/all?sort_by=price-ascending">Ofertas</a>
            <a href="https://yanitrend.com/pages/contact">Contacto</a>
          </nav>
          <div className="hdr-right">
            <button className="ico-btn" aria-label="Buscar"><i data-lucide="search" style={{width:18,height:18}} /></button>
            <button className="ico-btn" aria-label="Favoritos"><i data-lucide="heart" style={{width:18,height:18}} /></button>
            <button className="ico-btn" aria-label="Carrito"><i data-lucide="shopping-bag" style={{width:18,height:18}} /></button>
            <a href="https://yanitrend.com/collections/all" className="btn btn-primary btn-sm">Comprar ahora</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow reveal">Nueva colección · Envío gratis</div>
              <h1 className="hero-h1 reveal reveal-d1">
                Los productos más virales<br />ya están <em>acá</em>
              </h1>
              <p className="hero-sub reveal reveal-d2">
                Calidad, tendencia y envío a todo el país. Sin tarjetas ni adelantos — pagás cuando tenés el paquete en tus manos.
              </p>
              <div className="hero-ctas reveal reveal-d3">
                <a href="https://yanitrend.com/collections/all" className="btn btn-primary btn-lg">
                  <i data-lucide="package" style={{width:18,height:18}} />
                  Comprar ahora
                </a>
                <a href="#como-funciona" className="ghost-link">
                  ¿Cómo funciona?
                  <i data-lucide="arrow-right" style={{width:15,height:15}} />
                </a>
              </div>
            </div>
            <div className="hero-img-wrap reveal reveal-d2">
              <img
                src="https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg"
                alt="Aspiradora Robot Jessica"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="trust">
        <div className="wrap">
          <div className="trust-grid">
            {TRUST.map((item, i) => (
              <div key={item.title} className={`trust-item reveal reveal-d${i+1 as 1|2|3|4}`}>
                <div className="trust-icon">{item.icon}</div>
                <div>
                  <strong className="trust-strong">{item.title}</strong>
                  <span className="trust-desc">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="products" id="productos">
        <div className="wrap">
          <div className="sec-hdr">
            <span className="sec-eyebrow reveal">Nuestros productos</span>
            <h2 className="reveal reveal-d1">Lo que más está pidiendo la gente</h2>
            <p className="reveal reveal-d2">Selección de los productos con mejor recepción de la semana.</p>
          </div>
          <div className="prod-grid">
            {PRODUCTS.map((p, i) => {
              const save = p.priceOld - p.price
              const pct = Math.round(save / p.priceOld * 100)
              return (
                <div key={p.id} className={`prod-card reveal reveal-d${Math.min(i+1,4) as 1|2|3|4}`}>
                  <div className="prod-img-wrap">
                    <span className={`prod-badge badge-${p.badge}`}>{p.badgeLabel}</span>
                    <img src={p.img} alt={p.name} loading="lazy" />
                  </div>
                  <div className="prod-body">
                    <div className="prod-name">{p.name}</div>
                    <div className="prod-rating">
                      <Stars rating={p.stars} />
                      <span className="prod-rating-txt">{p.stars} ({p.reviews})</span>
                    </div>
                    <div className="prod-prices">
                      <span className="prod-price-now">{fmtARS(p.price)}</span>
                      <span className="prod-price-old">{fmtARS(p.priceOld)}</span>
                      <span className="prod-price-save">-{pct}%</span>
                    </div>
                    <a href={p.href} className="prod-buy">Comprar</a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps" id="como-funciona">
        <div className="wrap">
          <div className="sec-hdr">
            <span className="sec-eyebrow reveal">Sin complicaciones</span>
            <h2 className="reveal reveal-d1">Así de fácil es comprar</h2>
            <p className="reveal reveal-d2">Tres pasos simples. Sin registrarte ni ingresar datos bancarios.</p>
          </div>
          <div className="steps-grid">
            {[
              { num: '01', icon: 'mouse-pointer-click', title: 'Hacés tu pedido online', desc: 'Elegís el producto, escribís tu nombre y dirección. No necesitás tarjeta ni crear ninguna cuenta. Solo dos minutos.' },
              { num: '02', icon: 'package', title: 'Te lo enviamos gratis', desc: 'Tu pedido sale en 24 horas hábiles y llega en 3 a 5 días. Te avisamos en cada paso por WhatsApp.' },
              { num: '03', icon: 'banknote', title: 'Pagás al recibir', desc: 'El repartidor llega, revisás el paquete, y recién ahí entregás el efectivo. Sin adelantar ni un peso.' },
            ].map((s, i) => (
              <div key={s.num} className={`step-card reveal reveal-d${i+1 as 1|2|3}`}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon"><i data-lucide={s.icon} style={{width:24,height:24,color:'var(--pink)'}} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight */}
      <section className="spotlight">
        <div className="wrap">
          <div className="spot-grid">
            <div className="spot-imgs reveal">
              <div className="spot-main">
                <img
                  id="spot-main-img"
                  src="https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg"
                  alt="Aspiradora Robot Jessica"
                />
              </div>
              <div className="spot-thumbs">
                {[
                  'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg',
                  'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_8_177834049417696244411761071309ASPIRADOROBOTJESSICA_2.jpg',
                  'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/v2_aspiradora.jpg',
                ].map((src, i) => (
                  <div
                    key={i}
                    className={`spot-thumb${i === 0 ? ' active' : ''}`}
                    onClick={() => {
                      const el = document.getElementById('spot-main-img') as HTMLImageElement
                      if (el) el.src = src
                    }}
                  >
                    <img src={src} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal reveal-d2">
              <div className="spot-badge">
                <i data-lucide="flame" style={{width:13,height:13}} />
                Más vendido esta semana
              </div>
              <div className="spot-eyebrow">Producto estrella</div>
              <h2 className="spot-title">Aspiradora Robot<br />Jessica</h2>
              <p className="spot-sub">Limpieza automática sin mover un dedo · Envío a todo el país</p>
              <div className="spot-rating">
                <Stars rating={4.9} />
                <span className="spot-rating-txt">4.9 · 328 reseñas verificadas</span>
              </div>
              <div className="price-row">
                <span className="price-now">$38.630</span>
                <span className="price-was">$52.000</span>
                <span className="price-save">Ahorrás $13.370</span>
              </div>
              <div className="spot-ctas">
                <a href="https://yanitrend.com/products/aspiradora-robot-jessica" className="btn btn-primary btn-lg">
                  <i data-lucide="package" style={{width:18,height:18}} />
                  Quiero la mía · Pago en casa
                </a>
                <a href="https://yanitrend.com/products/aspiradora-robot-jessica" className="btn btn-outline">Ver todos los detalles</a>
              </div>
              <div className="spot-guarantee">
                <i data-lucide="shield-check" style={{width:14,height:14,color:'var(--pink)'}} />
                <span>Sin tarjetas · Revisás antes de pagar · Garantía 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testies">
        <div className="wrap">
          <div className="sec-hdr">
            <span className="sec-eyebrow reveal">Lo que dicen nuestras clientas</span>
            <h2 className="reveal reveal-d1">Más de 2.000 pedidos entregados</h2>
            <p className="reveal reveal-d2">Todas pagaron al recibir. Ninguna adelantó nada.</p>
          </div>
          <div className="testy-grid">
            {[
              { init: 'V', name: 'Valentina R.', city: 'Buenos Aires', text: '"Al principio dudé porque era internet, pero me encantó que no tenía que pagar nada hasta recibir el paquete. El producto llegó perfecto y en tiempo."', tag: 'cod' as const, tagText: 'Pagó al recibir', tagIcon: 'check-circle' },
              { init: 'S', name: 'Sara M.', city: 'Córdoba', text: '"Lo pedí el lunes y llegó el jueves. Pude abrir el paquete para revisar y todo estaba perfecto. Así sí da confianza comprar por internet."', tag: 'cod' as const, tagText: 'Pagó al recibir', tagIcon: 'check-circle' },
              { init: 'C', name: 'Carolina P.', city: 'Rosario', text: '"Ya van 3 pedidos y siempre fue igual de fácil. Nunca tuve que ingresar mi tarjeta en ningún lado. Solo lleno el formulario y espero que llegue."', tag: 'std' as const, tagText: 'Clienta recurrente', tagIcon: 'repeat' },
            ].map((t, i) => (
              <div key={t.name} className={`testy-card reveal reveal-d${i+1 as 1|2|3}`}>
                <div className="testy-hdr">
                  <div className="testy-avatar">{t.init}</div>
                  <div>
                    <div className="testy-name">{t.name}</div>
                    <div className="testy-city">{t.city}, Argentina</div>
                  </div>
                </div>
                <div className="testy-stars">★★★★★</div>
                <p className="testy-text">{t.text}</p>
                <div className={`testy-tag tag-${t.tag}`}>
                  <i data-lucide={t.tagIcon} style={{width:12,height:12}} />
                  <span>{t.tagText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="cta-ban">
        <div className="wrap">
          <div className="cta-ban-inner">
            <span className="sec-eyebrow reveal">¿Lista para pedirlo?</span>
            <h2 className="reveal reveal-d1">Pagá cuando lo tenés<br />en tus <em>manos</em></h2>
            <p className="reveal reveal-d2">Sin tarjetas, sin adelantos, sin riesgos. Solo completás tu dirección y nosotros nos encargamos del resto.</p>
            <a href="https://yanitrend.com/collections/all" className="btn btn-primary btn-lg reveal reveal-d3">
              <i data-lucide="package" style={{width:18,height:18}} />
              Comprar ahora
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="foot-logo">Yani<span className="foot-logo-accent"> Trend</span><span className="foot-logo-dot" /></div>
            <p>Tendencia y calidad con entrega en casa. Pagás cuando lo recibís en la puerta.</p>
          </div>
          <div className="footer-col">
            <div className="footer-col-hd">Tienda</div>
            <a href="/">Inicio</a>
            <a href="https://yanitrend.com/collections/all">Productos</a>
            <a href="https://yanitrend.com/collections/all?sort_by=created-descending">Novedades</a>
            <a href="https://yanitrend.com/collections/all?sort_by=best-selling">Más vendidos</a>
            <a href="https://yanitrend.com/collections/all?sort_by=price-ascending">Ofertas</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-hd">Ayuda</div>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="https://yanitrend.com/pages/preguntas-frecuentes">Preguntas frecuentes</a>
            <a href="https://yanitrend.com/pages/contact">Contacto por WhatsApp</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-hd">Legal</div>
            <a href="https://yanitrend.com/pages/politica-de-privacidad">Política de privacidad</a>
            <a href="https://yanitrend.com/pages/terminos-y-condiciones">Términos y condiciones</a>
            <a href="https://yanitrend.com/pages/politica-de-devoluciones">Política de devoluciones</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Yani Trend · Todos los derechos reservados</p>
          <div className="social-links">
            <a href="#" className="social-ico" aria-label="Instagram"><i data-lucide="instagram" style={{width:15,height:15}} /></a>
            <a href="#" className="social-ico" aria-label="Facebook"><i data-lucide="facebook" style={{width:15,height:15}} /></a>
            <a href="#" className="social-ico" aria-label="TikTok"><i data-lucide="music-2" style={{width:15,height:15}} /></a>
          </div>
        </div>
      </footer>
    </>
  )
}
