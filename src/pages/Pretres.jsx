import { useSite } from '../data/SiteContext.jsx'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'

export default function Pretres() {
  const { parish, priests } = useSite()
  const missingPhotos = priests.some((person) => !person.photo)

  return (
    <>
      <PageHero kicker="Équipe sacerdotale" title="Nos prêtres">
        Le curé, les vicaires et le vicaire de week-end : leurs secteurs et leurs aumôneries.
      </PageHero>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {priests.map((person) => (
            <Card key={person.id} className={person.pending ? 'border-dashed' : ''}>
              {person.photo ? (
                <img src={person.photo} alt={`${person.title} ${person.name}`} className="mb-4 h-28 w-28 object-cover" loading="lazy" />
              ) : (
                <div className="mb-4 flex h-14 w-14 items-center justify-center bg-wine font-serif text-2xl text-gold-light">
                  {person.title.slice(0, 1)}
                </div>
              )}
              <p className="text-xs tracking-[0.2em] text-wine uppercase">{person.role}</p>
              <h2 className="font-serif mt-1 text-2xl">
                {person.title} {person.name}
              </h2>
              {person.sector ? <p className="mt-2 text-sm">Aumônier du secteur {person.sector}</p> : null}
              <p className="mt-3 text-muted">{person.chaplaincy}</p>
              {person.bio ? <p className="mt-3 whitespace-pre-line text-sm text-muted">{person.bio}</p> : null}
              {person.writeTo ? (
                <div className="mt-4">
                  <CtaLink href="#rencontrer">Écrire au curé</CtaLink>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
        {missingPhotos ? (
          <div className="mt-8">
            <ComingSoon>
              Une photo officielle et une courte présentation de quelques lignes seront ajoutées pour chaque prêtre, après
              son accord.
            </ComingSoon>
          </div>
        ) : null}
      </Section>

      <Section id="rencontrer" tone="stone" title="J’ai besoin de parler à un prêtre">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <PastoralForm
            endpoint="/requests/"
            submitLabel="Envoyer la demande"
            successTitle="Un prêtre pourra vous joindre"
            successText="Votre demande est arrivée. Seuls les prêtres de la paroisse peuvent la lire."
            notice="Ce formulaire ne remplace pas une situation d’urgence médicale ou psychologique. En cas de danger immédiat, contactez les secours."
            toPayload={(f) => ({
              kind: 'pretre',
              name: f.prenom,
              contact: f.contact,
              subject: f.motif,
              message: f.message,
              extra: { preference: f.preference },
            })}
            fields={[
              { name: 'prenom', label: 'Prénom', required: true },
              { name: 'contact', label: 'Moyen de contact (téléphone ou WhatsApp)', required: true },
              { name: 'motif', label: 'Motif général', type: 'select', required: true, options: ['Accompagnement', 'Confession', 'Deuil', 'Famille', 'Question de foi', 'Autre'] },
              { name: 'preference', label: 'Préférence', type: 'select', required: true, options: ['Appel', 'WhatsApp', 'Rendez-vous'] },
              { name: 'message', label: 'Message', type: 'textarea', required: true },
            ]}
          />
          <div>
            <p className="text-muted">
              {parish.whatsapp
                ? 'Vous pouvez aussi écrire au numéro WhatsApp paroissial, distinct du téléphone personnel des prêtres.'
                : 'Le numéro WhatsApp paroissial, distinct du téléphone personnel du curé, sera publié dès qu’il sera confirmé. En attendant, le secrétariat reste le premier contact.'}
            </p>
            <div className="mt-6">
              <CtaLink to="/contact">Aller au contact</CtaLink>
            </div>
            {parish.whatsapp ? (
              <div className="mt-3">
                <CtaLink href={parish.whatsapp}>WhatsApp paroissial</CtaLink>
              </div>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  )
}
