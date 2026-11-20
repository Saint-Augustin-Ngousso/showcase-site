import { Link, Navigate, useParams } from 'react-router-dom'
import { useSite } from '../data/SiteContext.jsx'
import { PhotoGallery, Placeholder } from '../components/Media.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'

export function findAssociation(site, slug) {
  for (const platform of site.associationPlatforms) {
    const found = (platform.associations || []).find((a) => a.slug === slug)
    if (found) return { association: found, platform }
  }
  return {}
}

function Block({ title, children }) {
  if (!children) return null
  return (
    <div>
      <h2 className="font-serif text-2xl text-wine">{title}</h2>
      <p className="mt-3 whitespace-pre-line text-muted">{children}</p>
    </div>
  )
}

export default function AssociationDetail() {
  const { slug } = useParams()
  const site = useSite()
  const { association: a, platform } = findAssociation(site, slug)
  if (!a) return <Navigate to="/mouvements" replace />

  const photos = (a.media || []).filter((m) => m.kind === 'image')
  const facts = [
    ['Saint patron', a.patronSaint],
    ['Réunion', a.meeting],
    ['Responsable', a.leader],
    ['Aumônier', a.chaplain],
  ].filter(([, v]) => v)
  const hasText = a.description || a.charism || a.mission || a.history
  const siblings = (platform.associations || []).filter((x) => x.slug !== a.slug)

  return (
    <>
      <PageHero kicker={platform.name} title={a.name}>
        {a.summary || (a.patronSaint ? `Sous le patronage de ${a.patronSaint}.` : '')}
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="grid gap-8">
            {a.photo ? <img src={a.photo} alt={a.name} className="max-h-[28rem] w-full object-cover" /> : null}
            {hasText ? (
              <>
                <Block title="Présentation">{a.description}</Block>
                <Block title="Charisme">{a.charism}</Block>
                <Block title="Missions">{a.mission}</Block>
                <Block title="Histoire du groupe">{a.history}</Block>
              </>
            ) : (
              <ComingSoon>La fiche complète de ce groupe — histoire, missions, saint patron — sera publiée ici.</ComingSoon>
            )}
          </div>
          <aside className="grid content-start gap-4">
            {!a.photo ? <Placeholder label={a.name} className="h-48 w-full" /> : null}
            <Card>
              <p className="text-xs tracking-[0.2em] text-wine uppercase">En bref</p>
              {facts.length ? (
                <dl className="mt-3 space-y-2 text-sm">
                  {facts.map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-medium">{label}</dt>
                      <dd className="text-muted">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm text-muted">Jour de réunion et responsable à préciser.</p>
              )}
              {a.isYouth ? <p className="mt-3 text-xs tracking-wide text-wine uppercase">Groupe de jeunes</p> : null}
              <div className="mt-5">
                <CtaLink to="/mouvements#servir">Rejoindre ce groupe</CtaLink>
              </div>
            </Card>
          </aside>
        </div>
      </Section>

      {photos.length ? (
        <Section tone="stone" title="En images">
          <PhotoGallery items={photos} />
        </Section>
      ) : null}

      {siblings.length ? (
        <Section title={`Aussi dans la ${platform.name.toLowerCase()}`}>
          <div className="flex flex-wrap gap-2">
            {siblings.map((x) => (
              <Link key={x.slug} to={`/mouvements/${x.slug}`} className="border border-wine/30 px-3 py-1.5 text-sm text-wine hover:bg-wine hover:text-cream">
                {x.name}
              </Link>
            ))}
          </div>
          <p className="mt-8">
            <CtaLink to="/mouvements">Tous les mouvements</CtaLink>
          </p>
        </Section>
      ) : null}
    </>
  )
}
