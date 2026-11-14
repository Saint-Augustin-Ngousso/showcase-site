import { useSite } from '../data/SiteContext.jsx'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, PhotoGrid, Section } from '../components/Layout.jsx'

function AssociationItem({ item }) {
  const details = [
    item.meeting && `Réunion : ${item.meeting}`,
    item.leader && `Responsable : ${item.leader}`,
    item.chaplain && `Aumônier : ${item.chaplain}`,
  ].filter(Boolean)
  return (
    <li className="border-t border-gold/20 pt-2 first:border-0 first:pt-0">
      <span className="flex items-start gap-3">
        {item.photo ? <img src={item.photo} alt="" className="h-10 w-10 shrink-0 object-cover" loading="lazy" /> : null}
        <span>
          {item.name}
          {item.charism ? <span className="mt-0.5 block text-xs text-muted">{item.charism}</span> : null}
          {details.length ? <span className="mt-0.5 block text-xs text-muted">{details.join(' · ')}</span> : null}
        </span>
      </span>
    </li>
  )
}

export default function Mouvements() {
  const { associationPlatforms, choirs, commissions, councils, gallery, proposedCommissions, youthGroups } = useSite()
  const total = associationPlatforms.reduce((sum, p) => sum + p.items.length, 0)

  return (
    <>
      <PageHero kicker="Vie associative" title="Mouvements et services">
        {total} associations en {associationPlatforms.length} plateformes, chorales, groupes de jeunes, conseils et
        commissions.
      </PageHero>

      <Section title={`Les associations, en ${associationPlatforms.length} plateformes`}>
        <p className="mb-8 max-w-2xl text-muted">
          Pour chaque association : charisme, jour et lieu de réunion, responsable, aumônier, photo — au fur et à mesure
          que les bureaux transmettent leur fiche.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {associationPlatforms.map((platform) => (
            <Card key={platform.id} id={platform.id}>
              <p className="text-xs tracking-[0.2em] text-wine uppercase">{platform.items.length} associations</p>
              <h2 className="font-serif mt-2 text-2xl text-wine">{platform.name}</h2>
              {platform.subtitle ? <p className="mt-1 text-sm text-muted">{platform.subtitle}</p> : null}
              <ul className="mt-4 space-y-2 text-sm">
                {(platform.associations || platform.items.map((name) => ({ name }))).map((item) => (
                  <AssociationItem key={item.id || item.name} item={item} />
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="chorales" tone="stone" title="Chorales">
        {choirs.chaplain ? <p className="mb-4 text-muted">Aumônier : {choirs.chaplain}.</p> : null}
        {choirs.items.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {choirs.items.map((choir) => (
              <Card key={choir.name}>
                <h3 className="font-serif text-xl text-wine">{choir.name}</h3>
                {choir.leader ? <p className="mt-2 text-sm text-muted">Responsable : {choir.leader}</p> : null}
                {choir.masses ? <p className="mt-1 text-sm text-muted">Anime : {choir.masses}</p> : null}
              </Card>
            ))}
          </div>
        ) : (
          <ComingSoon>{choirs.note}</ComingSoon>
        )}
      </Section>

      <Section id="jeunes" title="Groupes de jeunes">
        {youthGroups.chaplain ? <p className="mb-6 text-muted">Suivis par {youthGroups.chaplain}.</p> : null}
        <PhotoGrid photos={gallery.filter((item) => item.category === 'Jeunes').slice(0, 3)} className="mb-8" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {youthGroups.items.map((item) => (
            <Card key={item}>
              <h3 className="font-serif text-xl text-wine">{item}</h3>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <CtaLink to="/mediatheque">Voir plus de photos</CtaLink>
        </div>
      </Section>

      <Section tone="wine" title="Conseils">
        <div className="grid gap-4 md:grid-cols-3">
          {councils.map((item) => (
            <article key={item.name} className="border border-cream/20 p-5">
              <h3 className="font-serif text-2xl">{item.name}</h3>
              <p className="mt-3 text-sm text-cream/80">{item.role}</p>
              {item.members ? <p className="mt-3 whitespace-pre-line text-sm text-cream">{item.members}</p> : null}
            </article>
          ))}
        </div>
        {councils.some((c) => !c.members) ? (
          <p className="mt-6 text-sm text-cream/70">Les membres des bureaux seront publiés après les nominations.</p>
        ) : null}
      </Section>

      <Section title="Commissions">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {commissions.map((item) => (
            <Card key={item}>
              <h3 className="font-serif text-xl">{item}</h3>
            </Card>
          ))}
        </div>
        {proposedCommissions.length ? (
          <>
            <h3 className="font-serif mt-10 text-2xl">Propositions au curé</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {proposedCommissions.map((item) => (
                <Card key={item.name}>
                  <h4 className="font-serif text-xl text-wine">{item.name}</h4>
                  <p className="mt-2 text-sm text-muted">{item.note}</p>
                </Card>
              ))}
            </div>
          </>
        ) : null}
      </Section>

      <Section id="servir" tone="stone" title="Rejoindre un mouvement">
        <div className="mx-auto max-w-2xl">
          <PastoralForm
            endpoint="/requests/"
            submitLabel="Proposer mon service"
            successTitle="Merci pour ce don de vous-même"
            toPayload={(f) => ({ kind: 'benevolat', name: f.prenom, contact: f.contact, subject: f.competence, message: f.message })}
            fields={[
              { name: 'prenom', label: 'Prénom', required: true },
              { name: 'contact', label: 'Téléphone ou WhatsApp', required: true },
              {
                name: 'competence',
                label: 'Mouvement ou service',
                type: 'select',
                required: true,
                options: associationPlatforms.flatMap((platform) => platform.items).concat(['Chorale', 'Autre']),
              },
              { name: 'message', label: 'Précisions', type: 'textarea', required: true },
            ]}
          />
        </div>
      </Section>
    </>
  )
}
