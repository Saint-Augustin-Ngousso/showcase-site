import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ActionBar from './ActionBar.jsx'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    if (location.hash) {
      const node = document.getElementById(location.hash.slice(1))
      node?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.pathname, location.hash])

  return (
    <div className="min-h-screen bg-cream pb-16 text-ink md:pb-0">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-wine focus:px-4 focus:py-2 focus:text-cream"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu">
        <Outlet />
      </main>
      <Footer />
      <ActionBar />
    </div>
  )
}

export function GoldLine() {
  return <span className="mt-4 block h-px w-16 bg-gold" />
}

export function PageHero({ kicker, title, children }) {
  return (
    <section className="relative overflow-hidden bg-wine-dark text-cream">
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        {kicker ? (
          <p className="text-xs tracking-[0.28em] text-gold-light uppercase sm:text-sm">{kicker}</p>
        ) : null}
        <h1 className="font-serif mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl md:text-5xl">{title}</h1>
        {children ? <p className="mt-4 max-w-2xl text-sm text-cream/80 sm:text-base">{children}</p> : null}
      </div>
    </section>
  )
}

export function Section({ id, eyebrow, title, children, tone = 'cream' }) {
  const bg = tone === 'stone' ? 'bg-stone' : tone === 'wine' ? 'bg-wine text-cream' : 'bg-cream'
  return (
    <section id={id} className={`${bg} px-4 py-12 sm:px-6 md:py-16`}>
      <div className="mx-auto max-w-6xl">
        {eyebrow ? (
          <p className={`text-xs tracking-[0.25em] uppercase sm:text-sm ${tone === 'wine' ? 'text-gold-light' : 'text-wine'}`}>
            {eyebrow}
          </p>
        ) : null}
        {title ? <h2 className="font-serif mt-2 text-2xl sm:text-3xl md:text-4xl">{title}</h2> : null}
        {title ? <GoldLine /> : null}
        <div className={title ? 'mt-8' : ''}>{children}</div>
      </div>
    </section>
  )
}

export function Card({ children, className = '' }) {
  return <article className={`border border-gold/30 bg-white/70 p-5 shadow-[0_8px_30px_rgba(26,22,20,0.06)] sm:p-6 ${className}`}>{children}</article>
}

export function ComingSoon({ children, className = '' }) {
  return (
    <p className={`border border-dashed border-gold/40 bg-stone/60 px-4 py-3 text-sm text-muted ${className}`}>
      {children}
    </p>
  )
}

export function PhotoGrid({ photos, className = '' }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {photos.map((item) => (
        <figure key={item.src} className="overflow-hidden border border-gold/20 bg-white">
          <img src={item.src} alt={item.alt} className="h-56 w-full object-cover sm:h-64" loading="lazy" />
          {item.caption ? <figcaption className="px-3 py-2 text-sm text-muted">{item.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  )
}

export function CtaLink({ to, href, children, invert = false, className = '' }) {
  const classes = `inline-flex items-center justify-center border px-4 py-2.5 text-center text-xs tracking-wide uppercase transition sm:px-5 sm:text-sm ${
    invert
      ? 'border-cream text-cream hover:bg-cream hover:text-wine-dark'
      : 'border-wine bg-wine text-cream hover:bg-wine-dark'
  } ${className}`

  const target = href || ((to || '').includes('?') || (to || '').includes('#') ? to : null)

  if (target) {
    return (
      <a href={target} className={classes} rel="noreferrer" target={target.startsWith('http') ? '_blank' : undefined}>
        {children}
      </a>
    )
  }

  return (
    <NavLink to={to} end className={classes}>
      {children}
    </NavLink>
  )
}
