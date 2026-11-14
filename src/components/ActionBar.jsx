import { NavLink } from 'react-router-dom'
import { quickActions } from '../data/content.js'
import { useSite } from '../data/SiteContext.jsx'

export default function ActionBar() {
  const { parish } = useSite()
  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gold/30 bg-cream/95 md:hidden"
    >
      {quickActions.map((item) => {
        if (item.href === 'whatsapp') {
          if (parish.whatsapp) {
            return (
              <a key={item.label} href={parish.whatsapp} className="py-3 text-center text-[11px] tracking-wide text-wine uppercase">
                {item.label}
              </a>
            )
          }
          return (
            <NavLink key={item.label} to="/contact" className="py-3 text-center text-[11px] tracking-wide text-wine uppercase">
              {item.label}
            </NavLink>
          )
        }

        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `py-3 text-center text-[11px] tracking-wide uppercase ${isActive ? 'bg-wine text-cream' : 'text-wine'}`
            }
          >
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
