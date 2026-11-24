import { Link } from 'react-router-dom'
import { useSite } from '../data/SiteContext.jsx'
import PastoralForm from '../components/PastoralForm.jsx'
import { Placeholder } from '../components/Media.jsx'
import { Card, ComingSoon, CtaLink, PageHero, PhotoGrid, Section } from '../components/Layout.jsx'
import { t } from '../i18n/index.jsx'

export function AssociationCard({ item }) {
  const line = item.summary || (item.patronSaint ? t('Saint patron : {saint}', { saint: item.patronSaint }) : item.charism)
  return (
    <Link
      to={`/mouvements/${item.slug}`}
      className="group flex flex-col overflow-hidden border border-gold/30 bg-white/80 shadow-[0_8px_30px_rgba(26,22,20,0.06)] transition hover:-translate-y-0.5 hover:border-wine"
    >
      {item.photo ? (
        <img src={item.photo} alt="" className="h-36 w-full object-cover" loading="lazy" />
      ) : (
        <Placeholder label={item.name} className="h-36 w-full opacity-90 group-hover:opacity-100" />
      )}
      <span className="flex flex-1 flex-col p-4">
        <span className="font-serif text-xl leading-tight text-wine">{item.name}</span>
        {line ? <span className="mt-1 line-clamp-2 text-sm text-muted">{line}</span> : null}
        {item.meeting ? <span className="mt-2 text-xs text-muted">{t('Réunion :')} {item.meeting}</span> : null}
        <span className="mt-auto pt-3 text-xs tracking-wide text-wine uppercase group-hover:underline">{t("Découvrir le groupe →")}</span>
      </span>
    </Link>
  )
}

export default function Mouvements() {
  const { associationPlatforms, choirs, commissions, councils, gallery, proposedCommissions, youthGroups } = useSite()
  const total = associationPlatforms.reduce((sum, p) => sum + p.items.length, 0)

  return (
    <>
      <PageHero kicker={t("Vie associative")} title={t("Mouvements et services")}>
        {t('{total} associations en {n} plateformes, chorales, groupes de jeunes, conseils et commissions.', { total, n: associationPlatforms.length })}
      </PageHero>

      <Section title={t('Les associations, en {n} plateformes', { n: associationPlatforms.length })}>
        <p className="mb-6 max-w-2xl text-muted">{t("Cliquez sur un groupe pour découvrir sa fiche : histoire, missions, saint patron et photos.")}</p>
        <nav className="mb-10 flex flex-wrap gap-2" aria-label={t("Plateformes")}>
          {associationPlatforms.map((platform) => (
            <a key={platform.id} href={`#${platform.id}`} className="border border-wine/30 px-3 py-1.5 text-sm text-wine hover:bg-wine hover:text-cream">
              {platform.name.replace('Plateforme ', '').replace(/ platform$/i, '')} ({platform.items.length})
            </a>
          ))}
        </nav>
        <div className="grid gap-12">
          {associationPlatforms.map((platform) => (
            <div key={platform.id} id={platform.id} className="scroll-mt-28">
              <h2 className="font-serif text-2xl text-wine sm:text-3xl">{platform.name}</h2>
              {platform.subtitle ? <p className="mt-1 text-sm text-muted">{platform.subtitle}</p> : null}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {platform.associations.map((item) => (
                  <AssociationCard key={item.slug} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="chorales" tone="stone" title={t("Chorales")}>
        {choirs.chaplain ? <p className="mb-4 text-muted">{t('Aumônier :')} {choirs.chaplain}.</p> : null}
        {choirs.items.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {choirs.items.map((choir) => (
              <Card key={choir.name}>
                <h3 className="font-serif text-xl text-wine">{choir.name}</h3>
                {choir.leader ? <p className="mt-2 text-sm text-muted">{t('Responsable :')} {choir.leader}</p> : null}
                {choir.masses ? <p className="mt-1 text-sm text-muted">{t('Anime :')} {choir.masses}</p> : null}
              </Card>
            ))}
          </div>
        ) : (
          <ComingSoon>{choirs.note}</ComingSoon>
        )}
      </Section>

      <Section id="jeunes" title={t("Groupes de jeunes")}>
        {youthGroups.chaplain ? <p className="mb-6 text-muted">{t('Suivis par {name}.', { name: youthGroups.chaplain })}</p> : null}
        <PhotoGrid photos={gallery.filter((item) => item.category === 'Jeunes').slice(0, 3)} className="mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(youthGroups.associations || []).map((item) => (
            <AssociationCard key={item.slug} item={item} />
          ))}
        </div>
        <div className="mt-6">
          <CtaLink to="/mediatheque">{t("Voir plus de photos")}</CtaLink>
        </div>
      </Section>

      <Section tone="wine" title={t("Conseils")}>
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
          <p className="mt-6 text-sm text-cream/70">{t("Les membres des bureaux seront publiés après les nominations.")}</p>
        ) : null}
      </Section>

      <Section title={t("Commissions")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {commissions.map((item) => (
            <Card key={item}>
              <h3 className="font-serif text-xl">{item}</h3>
            </Card>
          ))}
        </div>
        {proposedCommissions.length ? (
          <>
            <h3 className="font-serif mt-10 text-2xl">{t("Propositions au curé")}</h3>
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

      <Section id="servir" tone="stone" title={t("Rejoindre un mouvement")}>
        <div className="mx-auto max-w-2xl">
          <PastoralForm
            endpoint="/requests/"
            submitLabel={t("Proposer mon service")}
            successTitle={t("Merci pour ce don de vous-même")}
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
