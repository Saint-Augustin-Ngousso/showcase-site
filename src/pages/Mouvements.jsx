import {
  associationPlatforms,
  choirs,
  commissions,
  councils,
  gallery,
  proposedCommissions,
  youthGroups,
} from '../data/content.js'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, PhotoGrid, Section } from '../components/Layout.jsx'

export default function Mouvements() {
  return (
    <>
      <PageHero kicker="Vie associative" title="Mouvements et services">
        Vingt-neuf associations en quatre plateformes, chorales, groupes de jeunes, conseils et commissions.
      </PageHero>

      <Section title="Les associations, en quatre plateformes">
        <p className="mb-8 max-w-2xl text-muted">
          Pour chaque association, une fiche complète — charisme, jour et lieu de réunion, responsable, aumônier, photo —
          sera publiée dès que les bureaux l’auront transmise.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {associationPlatforms.map((platform) => (
            <Card key={platform.id} id={platform.id}>
              <p className="text-xs tracking-[0.2em] text-wine uppercase">
                {platform.items.length} associations
              </p>
              <h2 className="font-serif mt-2 text-2xl text-wine">{platform.name}</h2>
              {platform.subtitle ? <p className="mt-1 text-sm text-muted">{platform.subtitle}</p> : null}
              <ul className="mt-4 space-y-2 text-sm">
                {platform.items.map((item) => (
                  <li key={item} className="border-t border-gold/20 pt-2 first:border-0 first:pt-0">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="chorales" tone="stone" title="Chorales">
        <p className="mb-4 text-muted">Aumônier : {choirs.chaplain}.</p>
        <ComingSoon>{choirs.note}</ComingSoon>
      </Section>

      <Section id="jeunes" title="Groupes de jeunes">
        <p className="mb-6 text-muted">Suivis par {youthGroups.chaplain}.</p>
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
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-cream/70">
          Les membres des bureaux seront publiés après les nominations.
        </p>
      </Section>

      <Section title="Commissions">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {commissions.map((item) => (
            <Card key={item}>
              <h3 className="font-serif text-xl">{item}</h3>
            </Card>
          ))}
        </div>
        <h3 className="font-serif mt-10 text-2xl">Propositions au curé</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {proposedCommissions.map((item) => (
            <Card key={item.name}>
              <h4 className="font-serif text-xl text-wine">{item.name}</h4>
              <p className="mt-2 text-sm text-muted">{item.note}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="servir" tone="stone" title="Rejoindre un mouvement">
        <div className="mx-auto max-w-2xl">
          <PastoralForm
            storageKey="volontaires"
            submitLabel="Proposer mon service"
            successTitle="Merci pour ce don de vous-même"
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
