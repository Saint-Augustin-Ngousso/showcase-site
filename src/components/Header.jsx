import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { nav } from '../data/content.js'
import { useSite } from '../data/SiteContext.jsx'
import SearchBox from './SearchBox.jsx'
import { LanguageSwitch, t } from '../i18n/index.jsx'

function Cross({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="6" fill="#6B1D2A" />
      <path d="M24 8v32M12 20h24" stroke="#C4A35A" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { parish } = useSite()
  const { user, hasRole } = useAuth()

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-wine-dark text-cream/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-[11px] tracking-wide sm:px-6 sm:text-xs">
          <p className="truncate">{parish.diocese} · {parish.zone}</p>
          <div className="flex shrink-0 items-center gap-3">
            <LanguageSwitch className="text-cream" />
            <NavLink to="/messes" className="text-gold-light">
              {t("Horaires des messes")}
            </NavLink>
            <NavLink to="/contact" className="hidden sm:inline">
              {t("Contact")}
            </NavLink>
            {user ? (
              <>
                {hasRole('secretariat') ? (
                  <NavLink to="/espace" className="text-gold-light">
                    {t("Administration")}
                  </NavLink>
                ) : null}
                <NavLink to="/connexion" className="flex items-center gap-1.5" title={t("Mon compte")}>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="h-5 w-5 rounded-full" referrerPolicy="no-referrer" />
                  ) : null}
                  <span className="hidden sm:inline">{user.first_name || user.name}</span>
                </NavLink>
              </>
            ) : (
              <NavLink to="/connexion">{t("Se connecter")}</NavLink>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-gold/30 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <NavLink to="/" end className="flex shrink-0 items-center gap-2 sm:gap-3" onClick={() => setOpen(false)}>
            {parish.logo ? (
              <img src={parish.logo} alt="" className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9" />
            ) : (
              <Cross className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            )}
            <span>
              <span className="font-serif block text-base leading-none text-wine sm:text-xl">{parish.name}</span>
              <span className="text-[10px] tracking-[0.14em] text-muted uppercase sm:text-xs">{parish.place}</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-x-3 2xl:flex" aria-label={t("Navigation principale")}>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap text-sm ${isActive ? 'border-b border-gold pb-0.5 text-wine' : 'text-muted hover:text-wine'}`
                }
              >
                {t(item.label)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border border-wine/30 px-3 py-2 text-xs text-wine"
              onClick={() => setSearchOpen((v) => !v)}
            >
              {t("Recherche")}
            </button>
            <button
              type="button"
              className="border border-wine/30 px-3 py-2 text-sm text-wine 2xl:hidden"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? t('Fermer') : t('Menu')}
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
            <SearchBox compact onDone={() => setSearchOpen(false)} />
          </div>
        ) : null}

        {open ? (
          <nav className="grid gap-1 border-t border-gold/20 px-4 py-4 2xl:hidden" aria-label={t("Menu mobile")}>
            <NavLink to="/" end onClick={() => setOpen(false)} className="py-2 text-wine">
              {t("Accueil")}
            </NavLink>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `py-2 ${isActive ? 'font-medium text-wine' : 'text-muted'}`}
              >
                {t(item.label)}
              </NavLink>
            ))}
            <div className="mt-3 grid gap-2">
              <NavLink to="/messes" className="bg-wine px-4 py-3 text-center text-cream" onClick={() => setOpen(false)}>
                {t("Horaires des messes")}
              </NavLink>
              <NavLink to="/contact" className="border border-wine px-4 py-3 text-center text-wine" onClick={() => setOpen(false)}>
                {t("Contact")}
              </NavLink>
              {parish.whatsapp ? (
                <a href={parish.whatsapp} className="border border-wine px-4 py-3 text-center text-wine">
                  {t("WhatsApp")}
                </a>
              ) : null}
              <NavLink
                to={user && hasRole('secretariat') ? '/espace' : '/connexion'}
                className="px-4 py-3 text-center text-sm text-wine underline"
                onClick={() => setOpen(false)}
              >
                {user ? (hasRole('secretariat') ? t('Administration du site') : t('Mon compte')) : t('Se connecter avec Google')}
              </NavLink>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
