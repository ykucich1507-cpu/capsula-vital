'use client'

import { useEffect } from 'react'

const PRODUCTS = [
  {
    id: 1,
    badge: 'Más vendido',
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
    badge: null,
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
    badge: 'Nuevo',
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
    badge: null,
    name: 'Organizador de Cocina',
    stars: 4.6,
    reviews: 156,
    priceOld: 18000,
    price: 12990,
    img: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg',
    href: 'https://yanitrend.com/collections/all',
  },
]

function fmtARS(n: number) {
  return '$' + n.toLocaleString('es-AR')
}

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
    script.onload = () => {
      // @ts-ignore
      if (window.lucide) window.lucide.createIcons()
    }
    document.head.appendChild(script)

    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).style.opacity = '1', (e.target as HTMLElement).style.transform = 'translateY(0)' }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.r').forEach(el => obs.observe(el))

    // Spot thumb
    document.querySelectorAll('.spot-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.spot-thumb').forEach(t => t.classList.remove('active'))
        thumb.classList.add('active')
        const src = thumb.getAttribute('data-src')
        const main = document.getElementById('spot-img') as HTMLImageElement
        if (main && src) main.src = src
      })
    })
  }, [])

  return (
    <>
      <style>{`
        :root {
          --pink: #E6007E;
          --black: #111111;
          --gray-1: #444444;
          --gray-2: #888888;
          --gray-3: #CCCCCC;
          --gray-bg: #F5F5F5;
          --white: #FFFFFF;
          --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Poppins', system-ui, sans-serif; background: var(--white); color: var(--black); -webkit-font-smoothing: antialiased; }

        .w { max-width: 1120px; margin: 0 auto; padding: 0 40px; }
        @media (max-width: 640px) { .w { padding: 0 20px; } }

        /* reveal */
        .r { opacity: 0; transform: translateY(16px); transition: opacity 0.6s var(--ease), transform 0.6s var(--ease); }
        .d1 { transition-delay: 0.1s; }
        .d2 { transition-delay: 0.2s; }
        .d3 { transition-delay: 0.3s; }
        .d4 { transition-delay: 0.4s; }

        /* ── HEADER ── */
        .hdr {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #EBEBEB;
        }
        .hdr-in {
          display: flex; align-items: center;
          padding: 0 40px; height: 60px;
          max-width: 1120px; margin: 0 auto;
          gap: 32px;
        }
        @media (max-width: 640px) { .hdr-in { padding: 0 20px; gap: 16px; } }
        .logo {
          font-size: 17px; font-weight: 700; letter-spacing: -0.02em;
          color: var(--black); text-decoration: none; flex-shrink: 0;
        }
        .logo span { color: var(--pink); }
        .nav { display: flex; gap: 24px; }
        @media (max-width: 860px) { .nav { display: none; } }
        .nav a {
          font-size: 13px; font-weight: 500; color: var(--gray-1);
          text-decoration: none; letter-spacing: 0.01em;
          transition: color 0.2s;
        }
        .nav a:hover { color: var(--black); }
        .hdr-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .ico { background: none; border: none; cursor: pointer; display: flex; color: var(--gray-1); padding: 8px; border-radius: 8px; transition: color 0.2s; }
        .ico:hover { color: var(--black); }
        .cta-sm {
          background: var(--black); color: var(--white);
          font-family: inherit; font-size: 12px; font-weight: 600;
          border: none; border-radius: 999px; padding: 9px 18px;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .cta-sm:hover { background: var(--pink); transform: scale(1.02); }

        /* ── ANNOUNCEMENT ── */
        .ann {
          background: var(--black); color: #fff;
          text-align: center; padding: 9px 16px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.04em;
        }
        .ann span { opacity: 0.4; margin: 0 10px; }

        /* ── HERO ── */
        .hero { padding: 80px 0 100px; }
        .hero-in {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        @media (max-width: 768px) { .hero-in { grid-template-columns: 1fr; gap: 48px; } }
        .hero-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--gray-2);
          margin-bottom: 20px; display: block;
        }
        .hero-h1 {
          font-size: 52px; font-weight: 700; line-height: 1.06;
          letter-spacing: -0.035em; color: var(--black);
          margin-bottom: 20px;
        }
        @media (max-width: 640px) { .hero-h1 { font-size: 36px; } }
        .hero-p {
          font-size: 16px; line-height: 1.75; color: var(--gray-1);
          margin-bottom: 36px; max-width: 40ch;
        }
        .cta-main {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--black); color: var(--white);
          font-family: inherit; font-size: 14px; font-weight: 600;
          border: none; border-radius: 999px; padding: 15px 32px;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.2s;
          letter-spacing: 0.01em;
        }
        .cta-main:hover { background: var(--pink); transform: translateY(-2px); }
        .hero-img {
          border-radius: 20px; overflow: hidden;
          aspect-ratio: 4/5;
          background: var(--gray-bg);
        }
        .hero-img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.7s var(--ease);
        }
        .hero-img:hover img { transform: scale(1.03); }

        /* ── STRIP ── */
        .strip { border-top: 1px solid #EBEBEB; border-bottom: 1px solid #EBEBEB; padding: 24px 0; }
        .strip-in { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; }
        .strip-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--gray-1); }
        .strip-item svg { color: var(--gray-3); }

        /* ── SECTION LABEL ── */
        .sec-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--gray-2);
          display: block; margin-bottom: 12px;
        }
        .sec-h { font-size: 34px; font-weight: 700; letter-spacing: -0.025em; color: var(--black); }
        @media (max-width: 640px) { .sec-h { font-size: 26px; } }

        /* ── PRODUCTS ── */
        .prods { padding: 96px 0; }
        .prods-hdr { margin-bottom: 52px; display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .see-all { font-size: 13px; font-weight: 500; color: var(--gray-2); text-decoration: none; transition: color 0.2s; }
        .see-all:hover { color: var(--black); }
        .prod-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        @media (max-width: 900px) { .prod-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .prod-grid { grid-template-columns: 1fr 1fr; gap: 12px; } }

        .prod-card { cursor: pointer; }
        .prod-card:hover .prod-img img { transform: scale(1.05); }
        .prod-img {
          border-radius: 16px; overflow: hidden;
          aspect-ratio: 3/4; background: var(--gray-bg);
          position: relative; margin-bottom: 14px;
        }
        .prod-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.55s var(--ease); }
        .prod-badge {
          position: absolute; top: 12px; left: 12px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--white); color: var(--black);
          padding: 4px 10px; border-radius: 999px;
          border: 1px solid #E0E0E0;
        }
        .prod-name { font-size: 14px; font-weight: 600; color: var(--black); margin-bottom: 4px; line-height: 1.4; }
        .prod-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .prod-stars { font-size: 11px; color: var(--pink); letter-spacing: 1px; }
        .prod-reviews { font-size: 11px; color: var(--gray-2); }
        .prod-prices { display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px; }
        .prod-price { font-size: 16px; font-weight: 700; color: var(--black); }
        .prod-was { font-size: 13px; color: var(--gray-3); text-decoration: line-through; }
        .prod-btn {
          width: 100%; background: var(--black); color: var(--white);
          font-family: inherit; font-size: 13px; font-weight: 600;
          border: none; border-radius: 999px; padding: 11px 0;
          cursor: pointer; transition: background 0.2s;
          text-decoration: none; display: block; text-align: center;
        }
        .prod-btn:hover { background: var(--pink); }

        /* ── SPOTLIGHT ── */
        .spot { padding: 96px 0; background: var(--gray-bg); }
        .spot-in { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        @media (max-width: 768px) { .spot-in { grid-template-columns: 1fr; gap: 48px; } }
        .spot-imgs { display: flex; gap: 10px; }
        .spot-main-wrap { flex: 1; border-radius: 20px; overflow: hidden; aspect-ratio: 3/4; background: var(--white); }
        .spot-main-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s var(--ease); }
        .spot-main-wrap:hover img { transform: scale(1.03); }
        .spot-thumbs { display: flex; flex-direction: column; gap: 8px; }
        .spot-thumb {
          width: 72px; height: 96px; border-radius: 10px; overflow: hidden;
          background: var(--white); cursor: pointer;
          border: 2px solid transparent; transition: border-color 0.2s;
        }
        .spot-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .spot-thumb.active, .spot-thumb:hover { border-color: var(--black); }
        .spot-info { max-width: 440px; }
        .spot-badge-lbl {
          display: inline-block; font-size: 10px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          background: var(--black); color: var(--white);
          padding: 5px 12px; border-radius: 999px; margin-bottom: 20px;
        }
        .spot-h { font-size: 38px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; color: var(--black); margin-bottom: 8px; }
        @media (max-width: 640px) { .spot-h { font-size: 28px; } }
        .spot-sub { font-size: 14px; color: var(--gray-1); margin-bottom: 18px; line-height: 1.6; }
        .spot-stars { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
        .spot-stars-val { font-size: 13px; color: var(--pink); letter-spacing: 1px; }
        .spot-stars-txt { font-size: 13px; color: var(--gray-2); }
        .spot-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 10px; }
        .spot-price { font-size: 40px; font-weight: 700; letter-spacing: -0.02em; color: var(--black); }
        .spot-was { font-size: 18px; color: var(--gray-3); text-decoration: line-through; }
        .spot-save { font-size: 12px; font-weight: 700; color: var(--pink); }
        .spot-ctas { display: flex; flex-direction: column; gap: 10px; margin-top: 28px; }
        .spot-cta-main {
          background: var(--black); color: var(--white);
          font-family: inherit; font-size: 14px; font-weight: 600;
          border: none; border-radius: 999px; padding: 16px 0;
          cursor: pointer; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s;
        }
        .spot-cta-main:hover { background: var(--pink); }
        .spot-cta-sec {
          background: transparent; color: var(--black);
          font-family: inherit; font-size: 13px; font-weight: 500;
          border: 1px solid #DCDCDC; border-radius: 999px; padding: 14px 0;
          cursor: pointer; text-decoration: none;
          display: block; text-align: center;
          transition: border-color 0.2s;
        }
        .spot-cta-sec:hover { border-color: var(--black); }
        .spot-note { font-size: 12px; color: var(--gray-2); margin-top: 14px; display: flex; align-items: center; gap: 6px; }

        /* ── TESTIMONIALS ── */
        .testy { padding: 96px 0; }
        .testy-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media (max-width: 768px) { .testy-grid { grid-template-columns: 1fr; } }
        .testy-card {
          border: 1px solid #EBEBEB; border-radius: 16px; padding: 28px;
          transition: border-color 0.2s;
        }
        .testy-card:hover { border-color: var(--gray-3); }
        .testy-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .testy-av {
          width: 40px; height: 40px; border-radius: 50%; background: var(--gray-bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: var(--gray-1); flex-shrink: 0;
        }
        .testy-name { font-size: 14px; font-weight: 600; color: var(--black); }
        .testy-city { font-size: 12px; color: var(--gray-2); }
        .testy-stars { font-size: 12px; color: var(--pink); letter-spacing: 1px; margin-bottom: 12px; }
        .testy-text { font-size: 14px; line-height: 1.75; color: var(--gray-1); }

        /* ── CTA SECTION ── */
        .cta-sec { padding: 120px 0; text-align: center; }
        .cta-sec-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gray-2); display: block; margin-bottom: 16px; }
        .cta-sec-h { font-size: 48px; font-weight: 700; letter-spacing: -0.03em; color: var(--black); margin-bottom: 16px; line-height: 1.08; }
        @media (max-width: 640px) { .cta-sec-h { font-size: 32px; } }
        .cta-sec-p { font-size: 16px; color: var(--gray-1); margin-bottom: 40px; line-height: 1.7; }

        /* ── FOOTER ── */
        .ftr { border-top: 1px solid #EBEBEB; padding: 60px 0 40px; }
        .ftr-in { display: grid; grid-template-columns: 1.5fr repeat(3,1fr); gap: 32px; }
        @media (max-width: 768px) { .ftr-in { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .ftr-in { grid-template-columns: 1fr; } }
        .ftr-brand p { font-size: 13px; color: var(--gray-2); line-height: 1.7; margin-top: 10px; max-width: 24ch; }
        .ftr-col-h { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gray-2); margin-bottom: 14px; }
        .ftr-col a { display: block; font-size: 13px; color: var(--gray-1); text-decoration: none; padding: 4px 0; transition: color 0.2s; }
        .ftr-col a:hover { color: var(--black); }
        .ftr-bottom { border-top: 1px solid #EBEBEB; margin-top: 48px; padding-top: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .ftr-copy { font-size: 12px; color: var(--gray-3); }
        .social { display: flex; gap: 8px; }
        .social a { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #E0E0E0; display: flex; align-items: center; justify-content: center; color: var(--gray-2); text-decoration: none; transition: all 0.2s; }
        .social a:hover { border-color: var(--black); color: var(--black); }
      `}</style>

      {/* Announcement */}
      <div className="ann">
        Envío gratis a todo el país
        <span>·</span>
        Pagás cuando recibís
        <span>·</span>
        Sin tarjetas
      </div>

      {/* Header */}
      <header className="hdr">
        <div className="hdr-in">
          <a href="/" className="logo">Yani<span>Trend</span></a>
          <nav className="nav">
            <a href="/">Inicio</a>
            <a href="https://yanitrend.com/collections/all">Productos</a>
            <a href="https://yanitrend.com/collections/all?sort_by=created-descending">Novedades</a>
            <a href="https://yanitrend.com/collections/all?sort_by=best-selling">Más vendidos</a>
            <a href="https://yanitrend.com/collections/all?sort_by=price-ascending">Ofertas</a>
            <a href="https://yanitrend.com/pages/contact">Contacto</a>
          </nav>
          <div className="hdr-right">
            <button className="ico" aria-label="Buscar"><i data-lucide="search" style={{width:18,height:18}} /></button>
            <button className="ico" aria-label="Favoritos"><i data-lucide="heart" style={{width:18,height:18}} /></button>
            <button className="ico" aria-label="Carrito"><i data-lucide="shopping-bag" style={{width:18,height:18}} /></button>
            <a href="https://yanitrend.com/collections/all" className="cta-sm">Comprar</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="w">
          <div className="hero-in">
            <div>
              <span className="hero-label r">Tendencia · Argentina</span>
              <h1 className="hero-h1 r d1">El producto<br />habla<br />por sí solo.</h1>
              <p className="hero-p r d2">Seleccionamos lo que más se está comprando en todo el país. Lo recibís en casa y pagás al abrir la puerta.</p>
              <a href="https://yanitrend.com/collections/all" className="cta-main r d3">
                Ver productos
                <i data-lucide="arrow-right" style={{width:16,height:16}} />
              </a>
            </div>
            <div className="hero-img r d2">
              <img
                src="https://images.unsplash.com/photo-1617104678098-de229db51175?w=900&q=85&fit=crop"
                alt="Comedor moderno y luminoso"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Strip */}
      <div className="strip">
        <div className="w">
          <div className="strip-in">
            {[
              { icon: 'truck', text: 'Envío gratis a todo el país' },
              { icon: 'lock', text: 'Compra 100% segura' },
              { icon: 'banknote', text: 'Pagás al recibir en efectivo' },
              { icon: 'refresh-cw', text: 'Cambios en 30 días' },
            ].map(item => (
              <div key={item.text} className="strip-item">
                <i data-lucide={item.icon} style={{width:15,height:15}} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="prods">
        <div className="w">
          <div className="prods-hdr">
            <div>
              <span className="sec-label r">Lo más pedido</span>
              <h2 className="sec-h r d1">Productos destacados</h2>
            </div>
            <a href="https://yanitrend.com/collections/all" className="see-all r d1">Ver todos →</a>
          </div>
          <div className="prod-grid">
            {PRODUCTS.map((p, i) => (
              <div key={p.id} className={`prod-card r d${Math.min(i+1,4) as 1|2|3|4}`}>
                <div className="prod-img">
                  {p.badge && <span className="prod-badge">{p.badge}</span>}
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-meta">
                  <span className="prod-stars">{'★'.repeat(Math.round(p.stars))}</span>
                  <span className="prod-reviews">({p.reviews})</span>
                </div>
                <div className="prod-prices">
                  <span className="prod-price">{fmtARS(p.price)}</span>
                  <span className="prod-was">{fmtARS(p.priceOld)}</span>
                </div>
                <a href={p.href} className="prod-btn">Comprar</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight */}
      <section className="spot">
        <div className="w">
          <div className="spot-in">
            <div className="spot-imgs r">
              <div className="spot-main-wrap">
                <img
                  id="spot-img"
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
                  <div key={i} className={`spot-thumb${i===0?' active':''}`} data-src={src}>
                    <img src={src} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div className="spot-info r d2">
              <span className="spot-badge-lbl">Más vendido esta semana</span>
              <h2 className="spot-h">Aspiradora Robot<br />Jessica</h2>
              <p className="spot-sub">Limpieza automática. Sin mover un dedo.</p>
              <div className="spot-stars">
                <span className="spot-stars-val">★★★★★</span>
                <span className="spot-stars-txt">4.9 · 328 reseñas</span>
              </div>
              <div className="spot-price-row">
                <span className="spot-price">$38.630</span>
                <span className="spot-was">$52.000</span>
              </div>
              <span className="spot-save">Ahorrás $13.370 (26% off)</span>
              <div className="spot-ctas">
                <a href="https://yanitrend.com/products/aspiradora-robot-jessica" className="spot-cta-main">
                  <i data-lucide="package" style={{width:16,height:16}} />
                  Pedir ahora · Pago al recibir
                </a>
                <a href="https://yanitrend.com/products/aspiradora-robot-jessica" className="spot-cta-sec">Ver todos los detalles</a>
              </div>
              <p className="spot-note">
                <i data-lucide="shield-check" style={{width:13,height:13}} />
                Sin tarjeta · Revisás antes de pagar · Garantía 30 días
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testy">
        <div className="w">
          <div style={{marginBottom:52}}>
            <span className="sec-label r">Opiniones reales</span>
            <h2 className="sec-h r d1">Lo que dicen nuestras clientas</h2>
          </div>
          <div className="testy-grid">
            {[
              { init: 'V', name: 'Valentina R.', city: 'Buenos Aires', text: 'Al principio dudé porque era internet, pero me encantó que no tenía que pagar nada hasta recibir el paquete. El producto llegó perfecto.' },
              { init: 'S', name: 'Sara M.', city: 'Córdoba', text: 'Lo pedí el lunes y llegó el jueves. Pude abrir el paquete para revisar antes de pagar. Así sí da confianza comprar por internet.' },
              { init: 'C', name: 'Carolina P.', city: 'Rosario', text: 'Ya van 3 pedidos y siempre fue igual de fácil. Nunca tuve que ingresar mi tarjeta. Solo lleno el formulario y espero que llegue.' },
            ].map((t, i) => (
              <div key={t.name} className={`testy-card r d${i+1 as 1|2|3}`}>
                <div className="testy-top">
                  <div className="testy-av">{t.init}</div>
                  <div>
                    <div className="testy-name">{t.name}</div>
                    <div className="testy-city">{t.city}</div>
                  </div>
                </div>
                <div className="testy-stars">★★★★★</div>
                <p className="testy-text">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" style={{background:'var(--gray-bg)'}}>
        <div className="w">
          <span className="cta-sec-label r">Empezá hoy</span>
          <h2 className="cta-sec-h r d1">Elegís. Llegamos.<br />Pagás cuando lo tenés.</h2>
          <p className="cta-sec-p r d2">Sin tarjetas, sin adelantos. Solo tu dirección y nosotros nos encargamos del resto.</p>
          <a href="https://yanitrend.com/collections/all" className="cta-main r d3" style={{margin:'0 auto'}}>
            Ver todos los productos
            <i data-lucide="arrow-right" style={{width:16,height:16}} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="ftr">
        <div className="w">
          <div className="ftr-in">
            <div className="ftr-brand">
              <a href="/" className="logo">Yani<span>Trend</span></a>
              <p>Tendencia y calidad. Pagás cuando lo recibís en la puerta.</p>
            </div>
            <div className="ftr-col">
              <div className="ftr-col-h">Tienda</div>
              <a href="https://yanitrend.com/collections/all">Todos los productos</a>
              <a href="https://yanitrend.com/collections/all?sort_by=created-descending">Novedades</a>
              <a href="https://yanitrend.com/collections/all?sort_by=best-selling">Más vendidos</a>
              <a href="https://yanitrend.com/collections/all?sort_by=price-ascending">Ofertas</a>
            </div>
            <div className="ftr-col">
              <div className="ftr-col-h">Ayuda</div>
              <a href="https://yanitrend.com/pages/preguntas-frecuentes">Preguntas frecuentes</a>
              <a href="https://yanitrend.com/pages/contact">Contacto</a>
              <a href="https://yanitrend.com/pages/politica-de-devoluciones">Devoluciones</a>
            </div>
            <div className="ftr-col">
              <div className="ftr-col-h">Legal</div>
              <a href="https://yanitrend.com/pages/politica-de-privacidad">Privacidad</a>
              <a href="https://yanitrend.com/pages/terminos-y-condiciones">Términos</a>
            </div>
          </div>
          <div className="ftr-bottom">
            <span className="ftr-copy">© 2026 YaniTrend. Todos los derechos reservados.</span>
            <div className="social">
              <a href="#" aria-label="Instagram"><i data-lucide="instagram" style={{width:14,height:14}} /></a>
              <a href="#" aria-label="Facebook"><i data-lucide="facebook" style={{width:14,height:14}} /></a>
              <a href="#" aria-label="TikTok"><i data-lucide="music-2" style={{width:14,height:14}} /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
