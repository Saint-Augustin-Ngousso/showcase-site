import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { RESOURCE_BY_KEY } from './resources.js'

// Navigation de l'administration : quelques sections, chacune avec ses sous-éléments.
// `r:` renvoie à une rubrique de resources.js ; sinon `to` est une page dédiée.
const SECTIONS = [
  {
    title: 'La paroisse',
    items: [
      { to: '/espace/parametres', label: 'Fiche de la paroisse', role: 'secretariat', hint: 'Contacts, textes, image d’accueil' },
      { r: 'history' },
      { r: 'munera' },
      { r: 'projects' },
    ],
  },
  {
    title: 'Clergé et horaires',
    items: [{ r: 'priests' }, { r: 'mass-times' }, { r: 'appointments' }, { r: 'sacraments' }],
  },
  {
    title: 'Secteurs et CEV',
    items: [{ r: 'sectors' }, { r: 'cevs' }, { r: 'descents' }],
  },
  {
    title: 'Mouvements',
    items: [{ r: 'associations' }, { r: 'platforms' }, { r: 'choirs' }, { r: 'councils' }, { r: 'commissions' }],
  },
  {
    title: 'Publications',
    items: [
      { r: 'news' },
      { r: 'events' },
      { to: '/espace/import-agenda', label: 'Importer un programme PDF', role: 'secretariat' },
      { r: 'homilies' },
      { r: 'photos' },
      { r: 'downloads' },
    ],
  },
  {
    title: 'Foi et prière',
    items: [
      { to: '/espace/intentions', label: 'Intentions de prière', role: 'pretre' },
      { r: 'faith-questions' },
      { r: 'testimonials' },
      { r: 'prayers' },
    ],
  },
  {
    title: 'Direction',
    items: [
      { to: '/espace/utilisateurs', label: 'Utilisateurs et rôles', role: 'admin' },
      { r: 'donation-accounts' },
    ],
  },
]

function resolve(item) {
  if (!item.r) return item
  const resource = RESOURCE_BY_KEY[item.r]
  return { to: `/espace/r/${resource.key}`, label: resource.label, role: resource.role }
}

function visibleSections(hasRole) {
  return SECTIONS.map((section) => ({
    ...section,
    items: section.items.map(resolve).filter((item) => hasRole(item.role)),
  })).filter((section) => section.items.length)
}

function DesktopSection({ section, active }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const closeTimer = useRef(null)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        clearTimeout(closeTimer.current)
        setOpen(true)
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 150)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-3 py-2 text-sm whitespace-nowrap ${active ? 'text-gold-light' : 'text-cream/90 hover:text-cream'}`}
      >
        {section.title}
        <span aria-hidden="true" className={`text-[10px] transition ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {active ? <span className="absolute inset-x-3 bottom-0 h-0.5 bg-gold" /> : null}
      {open ? (
        <div className="absolute left-0 top-full z-40 min-w-64 border border-gold/30 bg-white py-1 text-ink shadow-[0_12px_30px_rgba(26,22,20,0.18)]">
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'bg-wine text-cream' : 'hover:bg-stone'}`}
            >
              {item.label}
              {item.hint ? <span className="block text-xs opacity-70">{item.hint}</span> : null}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function MobileMenu({ sections, onClose }) {
  const [openTitle, setOpenTitle] = useState(null)
  return (
    <nav className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-cream/10 bg-wine-dark px-2 pb-4 lg:hidden">
      <NavLink to="/espace" end onClick={onClose} className="block px-3 py-3 text-sm text-cream">
        Tableau de bord
      </NavLink>
      <NavLink to="/espace/demandes" onClick={onClose} className="block px-3 py-3 text-sm text-cream">
        Demandes reçues
      </NavLink>
      {sections.map((section) => (
        <div key={section.title} className="border-t border-cream/10">
          <button
            type="button"
            onClick={() => setOpenTitle((t) => (t === section.title ? null : section.title))}
            className="flex w-full items-center justify-between px-3 py-3 text-left text-sm text-cream"
          >
            {section.title}
            <span aria-hidden="true">{openTitle === section.title ? '−' : '+'}</span>
          </button>
          {openTitle === section.title ? (
            <div className="pb-2">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => `block px-6 py-2 text-sm ${isActive ? 'text-gold-light' : 'text-cream/80'}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </nav>
  )
}

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-sm text-cream">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full border border-cream/30" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-wine-dark">{user.name.slice(0, 1)}</span>
        )}
        <span className="hidden text-left leading-tight xl:block">
          {user.first_name || user.name}
          <span className="block text-[11px] text-gold-light">{user.role_label}</span>
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-56 border border-gold/30 bg-white py-1 text-sm text-ink shadow-lg">
          <p className="border-b border-stone px-4 py-2 text-xs text-muted">
            {user.email}
            <span className="block font-medium text-wine">{user.role_label}</span>
          </p>
          <Link to="/" className="block px-4 py-2 hover:bg-stone">
            Voir le site
          </Link>
          <button type="button" onClick={logout} className="block w-full px-4 py-2 text-left hover:bg-stone">
            Se déconnecter
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function AdminLayout() {
  const { user, hasRole, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => setMobileOpen(false), [location.pathname])

  if (!user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  if (!hasRole('secretariat')) return <Navigate to="/" replace />

  const sections = visibleSections(hasRole)
  const activeSection = sections.find((section) => section.items.some((item) => location.pathname.startsWith(item.to)))

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 bg-wine-dark text-cream shadow">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-2 px-4">
          <Link to="/espace" className="mr-2 flex shrink-0 items-center gap-2">
            <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden="true">
              <rect width="48" height="48" rx="6" fill="#C4A35A" />
              <path d="M24 8v32M12 20h24" stroke="#431117" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
            <span className="font-serif text-lg leading-none">
              Administration
              <span className="block text-[10px] tracking-[0.2em] text-gold-light uppercase">Saint Augustin</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center lg:flex" aria-label="Administration">
            <NavLink
              to="/espace"
              end
              className={({ isActive }) => `px-3 py-2 text-sm whitespace-nowrap ${isActive ? 'text-gold-light' : 'text-cream/90 hover:text-cream'}`}
            >
              Tableau de bord
            </NavLink>
            <NavLink
              to="/espace/demandes"
              className={({ isActive }) => `px-3 py-2 text-sm whitespace-nowrap ${isActive ? 'text-gold-light' : 'text-cream/90 hover:text-cream'}`}
            >
              Demandes
            </NavLink>
            {sections.map((section) => (
              <DesktopSection key={section.title} section={section} active={activeSection?.title === section.title} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="hidden text-sm text-cream/80 underline-offset-4 hover:underline sm:inline">
              Voir le site
            </Link>
            <UserMenu user={user} logout={logout} />
            <button
              type="button"
              className="border border-cream/40 px-3 py-1.5 text-xs uppercase lg:hidden"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? 'Fermer' : 'Menu'}
            </button>
          </div>
        </div>
        {mobileOpen ? <MobileMenu sections={sections} onClose={() => setMobileOpen(false)} /> : null}
      </header>

      <main className="mx-auto min-w-0 max-w-[90rem] p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<p className="text-muted">Chargement…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
