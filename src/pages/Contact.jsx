import { parish, projects } from '../data/content.js'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'

export default function Contact() {
  const mapsSrc = `https://maps.google.com/maps?q=${encodeURIComponent(parish.mapsQuery)}&z=15&output=embed`

  return (
    <>
      <PageHero kicker="Nous trouver" title="Contact et soutien">
        Adresse, plan, téléphone, réseaux sociaux, secrétariat, dons et quêtes.
      </PageHero>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="font-serif text-2xl text-wine">Informations pratiques</h2>
            <p className="mt-3">{parish.address}</p>
            <p className="mt-2 text-muted">{parish.diocese} · {parish.zone}</p>
            <p className="mt-2 text-sm text-muted">{parish.transport}</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="font-medium">Téléphone</dt>
                <dd className="text-muted">{parish.phone || 'À préciser'}</dd>
              </div>
              <div>
                <dt className="font-medium">Courriel</dt>
                <dd className="text-muted">{parish.email || 'À préciser'}</dd>
              </div>
              <div>
                <dt className="font-medium">Secrétariat</dt>
                <dd className="text-muted">{parish.officeHours || 'Horaires à préciser'}</dd>
              </div>
              <div>
                <dt className="font-medium">WhatsApp paroissial</dt>
                <dd className="text-muted">Compte à publier dès confirmation.</dd>
              </div>
            </dl>
            {parish.whatsapp ? (
              <div className="mt-6">
                <CtaLink href={parish.whatsapp}>Nous contacter sur WhatsApp</CtaLink>
              </div>
            ) : null}
          </Card>
          <PastoralForm
            storageKey="messages-secretariat"
            submitLabel="Écrire au secrétariat"
            successTitle="Message préparé"
            fields={[
              { name: 'prenom', label: 'Prénom', required: true },
              { name: 'contact', label: 'Téléphone, WhatsApp ou courriel', required: true },
              { name: 'message', label: 'Message', type: 'textarea', required: true },
            ]}
          />
        </div>
      </Section>

      <Section tone="stone" title="Plan d’accès">
        <iframe
          title="Carte de Ngousso, Yaoundé"
          src={mapsSrc}
          className="h-80 w-full border border-gold/30"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <ComingSoon className="mt-4">
          L’adresse précise, le repère d’accès et le point GPS officiel remplaceront cette carte de quartier.
        </ComingSoon>
      </Section>

      <Section id="soutien" title="Dons, offrandes et quêtes">
        <p className="mb-6 max-w-2xl text-muted">
          Offrandes de messe, dons et soutien aux travaux du presbytère. Les coordonnées de paiement ne seront publiées
          qu’après validation du conseil pour les affaires économiques.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Mobile Money</p>
            <p className="mt-3 text-muted">Numéro à confirmer</p>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Orange Money</p>
            <p className="mt-3 text-muted">Numéro à confirmer</p>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Virement / diaspora</p>
            <p className="mt-3 text-muted">RIB à confirmer</p>
          </Card>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {projects.map((item) => (
            <Card key={item.title}>
              <h3 className="font-serif text-2xl text-wine">{item.title}</h3>
              <p className="mt-3 text-muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
