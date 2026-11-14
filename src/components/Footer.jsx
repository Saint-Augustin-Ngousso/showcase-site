import { NavLink } from 'react-router-dom'
import { nav } from '../data/content.js'
import { useSite } from '../data/SiteContext.jsx'

export default function Footer() {
  const { parish } = useSite()
  const socials = [
    { href: parish.facebook, label: 'Facebook' },
    { href: parish.youtube, label: 'YouTube' },
    { href: parish.instagram, label: 'Instagram' },
    { href: parish.tiktok, label: 'TikTok' },
  ].filter((item) => item.href)

  return (
    <footer className="bg-wine-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-serif text-2xl">{parish.fullName}</p>
          <p className="mt-2 text-cream/70">{parish.diocese}</p>
          <p className="text-cream/70">{parish.zone}</p>
          <p className="mt-4 text-sm text-cream/70">{parish.address}</p>
          {parish.whatsapp ? (
            <a href={parish.whatsapp} className="mt-4 inline-flex border border-gold-light px-3 py-2 text-xs uppercase">
              WhatsApp paroissial
            </a>
          ) : (
            <p className="mt-4 text-xs text-cream/50">WhatsApp paroissial à publier</p>
          )}
        </div>

        <div>
          <p className="text-sm tracking-[0.2em] text-gold-light uppercase">Parcourir</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <NavLink to="/" className="hover:text-gold-light">
                Accueil
              </NavLink>
            </li>
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className="hover:text-gold-light">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm tracking-[0.2em] text-gold-light uppercase">Premier pas</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <NavLink to="/messes" className="hover:text-gold-light">Horaires des messes</NavLink>
            </li>
            <li>
              <NavLink to="/pretres#rencontrer" className="hover:text-gold-light">Parler à un prêtre</NavLink>
            </li>
            <li>
              <NavLink to="/priere" className="hover:text-gold-light">Demander une prière</NavLink>
            </li>
            <li>
              <NavLink to="/mouvements#servir" className="hover:text-gold-light">Rejoindre un mouvement</NavLink>
            </li>
            <li>
              <NavLink to="/contact#soutien" className="hover:text-gold-light">Soutenir la paroisse</NavLink>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm tracking-[0.2em] text-gold-light uppercase">Aussi</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <NavLink to="/foi" className="hover:text-gold-light">Enseignements</NavLink>
            </li>
            <li>
              <NavLink to="/mediatheque" className="hover:text-gold-light">Galerie photos</NavLink>
            </li>
            <li>
              <NavLink to="/connexion" className="hover:text-gold-light">Espace connecté</NavLink>
            </li>
            {socials.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noreferrer" className="hover:text-gold-light">{item.label}</a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-cream/50">{parish.slogan}</p>
          <NavLink to="/confidentialite" className="mt-2 block text-xs text-cream/50 hover:text-gold-light">
            Politique de confidentialité
          </NavLink>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {parish.fullName}. {parish.slogan}
      </div>
    </footer>
  )
}
