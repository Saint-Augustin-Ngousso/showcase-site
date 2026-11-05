import { gallery, heroPhoto, massPlaces, nextSundayMass, parish, schedules, upcomingEvents } from '../data/content.js'
import { Card, CtaLink, PhotoGrid, Section } from '../components/Layout.jsx'

export default function Home() {
  const nextMass = nextSundayMass()
  const nextEvents = upcomingEvents().slice(0, 1)
  const nextEvent = nextEvents[0]

  return (
    <>
      <section className="relative overflow-hidden bg-wine-dark text-cream">
        <img
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-dark via-wine-dark/75 to-wine-dark/40" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-4 py-12 sm:px-6 sm:py-16 md:min-h-[78vh] md:justify-center">
          <p className="text-xs tracking-[0.28em] text-gold-light uppercase">
            {parish.diocese} · {parish.zone}
          </p>
          <p className="mt-4 max-w-xl text-sm text-gold-light">{parish.yearLabel}</p>
          <h1 className="font-serif mt-3 max-w-3xl text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
            {parish.slogan}
          </h1>
          <p className="mt-4 max-w-xl text-base text-cream/85 sm:text-lg">
            {parish.themeParish}. Thème diocésain : « {parish.themeDiocesan} ».
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2">
            <CtaLink to="/messes">Horaires des messes</CtaLink>
            <CtaLink to="/paroisse" invert>
              Le programme pastoral
            </CtaLink>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Prochaine messe</p>
            <p className="font-serif mt-2 text-2xl">{nextMass.time}</p>
            <p className="mt-1 text-sm text-muted">{nextMass.label} · {nextMass.note}</p>
            <div className="mt-4">
              <CtaLink to="/messes">Tous les horaires</CtaLink>
            </div>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Prochain événement</p>
            {nextEvent ? (
              <>
                <p className="font-serif mt-2 text-2xl leading-tight">{nextEvent.title}</p>
                <p className="mt-1 text-sm text-muted">{nextEvent.audience}</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">Consultez l’agenda paroissial.</p>
            )}
            <div className="mt-4">
              <CtaLink to="/agenda">Agenda</CtaLink>
            </div>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Confessions</p>
            <p className="font-serif mt-2 text-2xl">{schedules.confessions.hours}</p>
            <p className="mt-1 text-sm text-muted">
              Chaque {schedules.confessions.days.toLowerCase()}, à l’église.
            </p>
            <div className="mt-4">
              <CtaLink to="/messes#confessions">Voir le détail</CtaLink>
            </div>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Nous trouver</p>
            <p className="font-serif mt-2 text-2xl">{parish.place}</p>
            <p className="mt-1 text-sm text-muted">{parish.worshipPlaces.join(' · ')}</p>
            <div className="mt-4">
              <CtaLink to="/contact">Carte et contact</CtaLink>
            </div>
          </Card>
        </div>
      </Section>

      <Section tone="stone" eyebrow="Dimanche" title="Horaires des messes">
        <p className="mb-6 max-w-2xl text-muted">
          Deux lieux de culte : la chapelle et la petite église. Sur le site public, les heures et les lieux suffisent.
        </p>
        <ul className="divide-y divide-gold/20 border border-gold/30 bg-white">
          {schedules.sunday.map((item) => (
            <li key={item.time} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="font-medium">{item.time}</span>
              <span className="text-right text-muted">{massPlaces(item)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="En images" title="La vie de la communauté">
        <PhotoGrid photos={gallery.slice(0, 3)} />
        <div className="mt-6">
          <CtaLink to="/mediatheque">Voir la galerie</CtaLink>
        </div>
      </Section>

      <Section eyebrow="Mot du curé" title="Mgr Engelbert René Fouda Owona">
        <Card>
          <p className="text-muted">
            Le mot d’accueil de Mgr le curé sera publié ici. En attendant, toute la paroisse est invitée au lancement
            de l’année pastorale, le dimanche 8 novembre 2026.
          </p>
          <p className="font-serif mt-6 text-2xl text-wine">{parish.slogan}</p>
          <div className="mt-6">
            <CtaLink to="/pretres">Rencontrer nos prêtres</CtaLink>
          </div>
        </Card>
      </Section>
    </>
  )
}
