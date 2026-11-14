import { Suspense, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { RESOURCES } from './resources.js'

const SPECIAL = [
  { to: '/espace', label: 'Tableau de bord', role: 'secretariat', end: true },
  { to: '/espace/parametres', label: 'Fiche de la paroisse', role: 'secretariat' },
  { to: '/espace/demandes', label: 'Demandes reçues', role: 'secretariat' },
  { to: '/espace/intentions', label: 'Intentions de prière', role: 'pretre' },
  { to: '/espace/import-agenda', label: 'Importer un programme PDF', role: 'secretariat' },
  { to: '/espace/utilisateurs', label: 'Utilisateurs et rôles', role: 'cure' },
]

function linkClass({ isActive }) {
  return `block px-3 py-1.5 text-sm ${isActive ? 'bg-wine text-cream' : 'text-ink hover:bg-stone'}`
}

export default function AdminLayout() {
  const { user, hasRole, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  if (!user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  if (!hasRole('secretariat')) return <Navigate to="/connexion" replace />

  const groups = []
  for (const resource of RESOURCES.filter((r) => hasRole(r.role))) {
    let group = groups.find((g) => g.name === resource.group)
    if (!group) groups.push((group = { name: resource.group, items: [] }))
    group.items.push(resource)
  }

  const nav = (
    <nav className="grid gap-4" onClick={() => setOpen(false)}>
      <div>
        {SPECIAL.filter((item) => hasRole(item.role)).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
      </div>
      {groups.map((group) => (
        <div key={group.name}>
          <p className="px-3 pb-1 text-[11px] tracking-[0.2em] text-wine uppercase">{group.name}</p>
          {group.items.map((item) => (
            <NavLink key={item.key} to={`/espace/r/${item.key}`} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-gold/30 bg-wine-dark text-cream">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button type="button" className="border border-cream/40 px-2 py-1 text-xs lg:hidden" onClick={() => setOpen((v) => !v)}>
              {open ? 'Fermer' : 'Menu'}
            </button>
            <NavLink to="/espace" className="font-serif text-lg">
              Administration · Saint Augustin
            </NavLink>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="hidden sm:inline">
              {user.name} · <span className="text-gold-light">{user.role_label}</span>
            </span>
            <NavLink to="/" className="underline">
              Voir le site
            </NavLink>
            <button type="button" onClick={logout} className="border border-cream/40 px-2 py-1">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        <aside className={`${open ? 'block' : 'hidden'} border-r border-gold/20 bg-white/60 p-3 lg:block lg:min-h-[calc(100vh-3.25rem)]`}>{nav}</aside>
        <main className="min-w-0 p-4 sm:p-6">
          <Suspense fallback={<p className="text-muted">Chargement…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
