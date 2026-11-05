import { useSearchParams } from 'react-router-dom'
import { parish, sacraments, schedules } from '../data/content.js'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'

export default function Messes() {
  const [params] = useSearchParams()
  const selected = params.get('demande') || 'bapteme'
  const current = sacraments.find((item) => item.id === selected) || sacraments[0]

  return (
    <>
      <PageHero kicker="Vie sacramentelle" title="Messes et sacrements">
        Horaires du dimanche à la chapelle et à la petite église, confessions, démarches pour le baptême, le mariage, la
        première communion et les funérailles.
      </PageHero>

      <Section eyebrow="Dimanche" title="Messes du dimanche">
        <p className="mb-6 max-w-2xl text-muted">
          Lieux de culte : {parish.worshipPlaces.join(' et ').toLowerCase()}. Le vicaire de week-end vient en appui selon
          le planning que fixe le curé.
        </p>
        <div className="overflow-x-auto border border-gold/30 bg-white">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="bg-stone text-wine">
              <tr>
                <th className="px-4 py-3 font-medium">Heure</th>
                <th className="px-4 py-3 font-medium">Chapelle</th>
                <th className="px-4 py-3 font-medium">Petite église</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/20">
              {schedules.sunday.map((item) => (
                <tr key={item.time}>
                  <td className="px-4 py-3 font-medium">{item.time}</td>
                  <td className="px-4 py-3 text-muted">{item.chapelle ? 'Oui' : '—'}</td>
                  <td className="px-4 py-3 text-muted">{item.petiteEglise ? 'Oui' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="confessions" tone="stone" title="Confessions et enseignement">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-serif text-2xl text-wine">Confessions</h3>
            <p className="mt-3">
              Chaque {schedules.confessions.days.toLowerCase()} de {schedules.confessions.hours}, à l’église.
            </p>
            <p className="mt-2 text-sm text-muted">{schedules.confessions.extra}</p>
          </Card>
          <Card>
            <h3 className="font-serif text-2xl text-wine">Enseignement du mercredi</h3>
            <p className="mt-3 text-muted">{schedules.teaching.extra}</p>
            <div className="mt-4">
              <CtaLink to="/foi">Voir les enseignements</CtaLink>
            </div>
          </Card>
        </div>
        <div className="mt-6">
          <ComingSoon>
            Heure et lieu de l’enseignement du mercredi, messes de semaine et adoration : à préciser avant publication.
          </ComingSoon>
        </div>
      </Section>

      <Section id="sacrements" title="Démarches pour les sacrements">
        <p className="mb-8 max-w-2xl text-muted">
          Les pièces à fournir et les calendriers exacts seront publiés dès que le secrétariat les aura arrêtés. En
          attendant, chaque demande peut être préparée ici, puis reprise au secrétariat.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {sacraments.map((item) => (
            <Card key={item.id} id={item.id}>
              <h3 className="font-serif text-2xl text-wine">{item.title}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="font-medium">Conditions</dt>
                  <dd className="text-muted">{item.conditions}</dd>
                </div>
                <div>
                  <dt className="font-medium">Documents</dt>
                  <dd className="text-muted">{item.documents}</dd>
                </div>
                <div>
                  <dt className="font-medium">Préparation</dt>
                  <dd className="text-muted">{item.preparation}</dd>
                </div>
                <div>
                  <dt className="font-medium">Calendrier</dt>
                  <dd className="text-muted">{item.calendar}</dd>
                </div>
              </dl>
              <div className="mt-5">
                <CtaLink to={`/messes?demande=${item.id}#demande`}>{item.action}</CtaLink>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="demande" tone="stone" title={current.action}>
        <PastoralForm
          storageKey="demandes-sacrements"
          submitLabel={current.action}
          successTitle="Demande reçue"
          fields={[
            { name: 'prenom', label: 'Prénom', required: true },
            { name: 'contact', label: 'Téléphone ou WhatsApp', required: true },
            { name: 'type', label: 'Démarche', type: 'select', required: true, options: sacraments.map((item) => item.title) },
            { name: 'message', label: 'Précisions', type: 'textarea', required: true },
          ]}
        />
      </Section>
    </>
  )
}
