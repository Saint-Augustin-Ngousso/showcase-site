import { useMemo, useState } from 'react'
import { useSite } from '../data/SiteContext.jsx'
import { Card, ComingSoon, CtaLink, PageHero, PhotoGrid, Section } from '../components/Layout.jsx'

export default function Mediatheque() {
  const { downloads, gallery } = useSite()
  const categories = useMemo(() => [...new Set(gallery.map((p) => p.category).filter(Boolean))], [gallery])
  const [category, setCategory] = useState('')
  const photos = category ? gallery.filter((p) => p.category === category) : gallery

  return (
    <>
      <PageHero kicker="Mémoire" title="Galerie photos">
        Des images de la vie de Saint Augustin de Ngousso, publiées avec l’accord des personnes visibles.
      </PageHero>

      <Section title="La vie paroissiale">
        {categories.length > 1 ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {['', ...categories].map((item) => (
              <button
                key={item || 'all'}
                type="button"
                onClick={() => setCategory(item)}
                className={`border px-3 py-1.5 text-xs uppercase ${category === item ? 'border-wine bg-wine text-cream' : 'border-wine/30 text-wine'}`}
              >
                {item || 'Toutes'}
              </button>
            ))}
          </div>
        ) : null}
        {photos.length ? <PhotoGrid photos={photos} /> : <ComingSoon>Les photos des événements seront publiées ici.</ComingSoon>}
      </Section>

      <Section tone="stone" title="Documents">
        <ul className="divide-y divide-gold/20 border border-gold/30 bg-white">
          {downloads.map((item) => (
            <li key={item.title + item.date} className="flex items-center justify-between gap-4 px-5 py-4">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="text-wine underline">
                  {item.title}
                </a>
              ) : (
                <span>{item.title}</span>
              )}
              <span className="text-xs text-wine uppercase">{item.type}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Vidéos">
        <Card>
          <p className="text-muted">Homélies filmées, enseignements et événements. Aucune vidéo ne se lance toute seule.</p>
          <div className="mt-6">
            <CtaLink to="/foi#homelies">Enseignements et homélies</CtaLink>
          </div>
        </Card>
      </Section>
    </>
  )
}
