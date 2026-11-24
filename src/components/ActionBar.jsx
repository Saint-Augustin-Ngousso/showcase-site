import { NavLink } from 'react-router-dom'
import { quickActions } from '../data/content.js'
import { useSite } from '../data/SiteContext.jsx'
import { t } from '../i18n/index.jsx'

export default function ActionBar() {
  const { parish } = useSite()
  return (
    <nav
      aria-label={t("Actions rapides")}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gold/30 bg-cream/95 md:hidden"
    >
      {quickActions.map((item) => {
        if (item.href === 'whatsapp') {
          if (parish.whatsapp) {
            return (
              <a key={t(item.label)} href={parish.whatsapp} className="py-3 text-center text-[11px] tracking-wide text-wine uppercase">
                {t(item.label)}
              </a>
            )
          }
          return (
            <NavLink key={t(item.label)} to="/contact" className="py-3 text-center text-[11px] tracking-wide text-wine uppercase">
              {t(item.label)}
            </NavLink>
          )
        }

        return (
          <NavLink
            key={t(item.label)}
            to={item.to}
            className={({ isActive }) =>
              `py-3 text-center text-[11px] tracking-wide uppercase ${isActive ? 'bg-wine text-cream' : 'text-wine'}`
            }
          >
            {t(item.label)}
          </NavLink>
        )
      })}
    </nav>
  )
}
