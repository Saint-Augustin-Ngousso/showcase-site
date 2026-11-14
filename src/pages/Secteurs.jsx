import { Link } from 'react-router-dom'
import { useSite } from '../data/SiteContext.jsx'
import { Card, CtaLink, PageHero, Section } from '../components/Layout.jsx'

export default function Secteurs() {
  const { cevSectors } = useSite()
  return (
    <>
      <PageHero kicker="Territoire" title="Secteurs et CEV">
        La paroisse est divisée en trois secteurs, chacun confié à un prêtre. Chaque secteur rassemble des communautés
        ecclésiales vivantes.
      </PageHero>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {cevSectors.map((sector) => (
            <Card key={sector.id} className="flex flex-col">
              <p className="text-xs tracking-[0.2em] text-wine uppercase">Secteur</p>
              <h2 className="font-serif mt-2 text-3xl">{sector.saint}</h2>
              <p className="mt-3 text-sm">{sector.chaplain}</p>
              <p className="mt-1 text-sm text-muted">Responsables laïcs : {sector.layLeaders || 'à compléter'}</p>
              <p className="mt-3 flex-1 text-muted">{sector.blurb}</p>
              <p className="mt-3 text-sm text-wine">
                {sector.cevs.length ? `${sector.cevs.length} CEV` : 'Liste des CEV à fournir'}
              </p>
              <div className="mt-5">
                <CtaLink to={`/secteurs/${sector.id}`}>Voir le secteur {sector.saint}</CtaLink>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}

export function SectorNav() {
  const { cevSectors } = useSite()
  return (
    <p className="mb-8 flex flex-wrap gap-3 text-sm">
      <Link to="/secteurs" className="text-wine underline">
        Les trois secteurs
      </Link>
      {cevSectors.map((sector) => (
        <Link key={sector.id} to={`/secteurs/${sector.id}`} className="text-muted hover:text-wine">
          {sector.saint}
        </Link>
      ))}
    </p>
  )
}
