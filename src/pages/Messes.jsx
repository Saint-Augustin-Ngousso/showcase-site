import { useSearchParams } from 'react-router-dom'
import { useSite } from '../data/SiteContext.jsx'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'

function MassTable({ rows, showDays = false }) {
  return (
    <div className="overflow-x-auto border border-gold/30 bg-white">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="bg-stone text-wine">
          <tr>
            {showDays ? <th className="px-4 py-3 font-medium">Jours</th> : null}
            <th className="px-4 py-3 font-medium">Heure</th>
            <th className="px-4 py-3 font-medium">Chapelle</th>
            <th className="px-4 py-3 font-medium">Petite église</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold/20">
          {rows.map((item) => (
            <tr key={item.id || item.time}>
              {showDays ? <td className="px-4 py-3">{item.weekdays || 'En semaine'}</td> : null}
              <td className="px-4 py-3 font-medium">
                {item.time}
                {item.note ? <span className="block text-xs font-normal text-muted">{item.note}</span> : null}
              </td>
              <td className="px-4 py-3 text-muted">{item.chapelle ? 'Oui' : '—'}</td>
              <td className="px-4 py-3 text-muted">{item.petiteEglise ? 'Oui' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Messes() {
  const { parish, sacraments, schedules } = useSite()
  const [params] = useSearchParams()
  const selected = params.get('demande') || sacraments[0]?.id
  const current = sacraments.find((item) => item.id === selected) || sacraments[0] || { action: 'Faire une demande' }
  const { confessions, teaching, adoration } = schedules
  const extraAppointments = (schedules.appointments || []).filter(
    (a) => !['confessions', 'enseignement', 'adoration', 'permanence'].includes(a.id) && (a.days || a.hours),
  )
  const missing = []
  if (!teaching.hours || !teaching.place) missing.push('heure et lieu de l’enseignement du mercredi')
  if (!schedules.weekday.length) missing.push('messes de semaine')
  if (!adoration.days) missing.push('adoration')

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
        <MassTable rows={schedules.sunday} />
        {schedules.saturday.length ? (
          <>
            <h3 className="font-serif mt-10 text-2xl">Samedi soir (messe anticipée)</h3>
            <div className="mt-4">
              <MassTable rows={schedules.saturday} />
            </div>
          </>
        ) : null}
        {schedules.weekday.length ? (
          <>
            <h3 className="font-serif mt-10 text-2xl">Messes de semaine</h3>
            <div className="mt-4">
              <MassTable rows={schedules.weekday} showDays />
            </div>
          </>
        ) : null}
      </Section>

      <Section id="confessions" tone="stone" title="Confessions et enseignement">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-serif text-2xl text-wine">Confessions</h3>
            <p className="mt-3">
              {confessions.days ? `Chaque ${confessions.days.toLowerCase()}` : 'Jours à préciser'}
              {confessions.hours ? ` de ${confessions.hours}` : ''}
              {confessions.place ? `, ${confessions.place.toLowerCase()}` : ''}.
            </p>
            {confessions.extra ? <p className="mt-2 text-sm text-muted">{confessions.extra}</p> : null}
          </Card>
          <Card>
            <h3 className="font-serif text-2xl text-wine">Enseignement du mercredi</h3>
            {teaching.hours || teaching.place ? (
              <p className="mt-3">
                {teaching.days || 'Mercredi'}
                {teaching.hours ? ` · ${teaching.hours}` : ''}
                {teaching.place ? ` · ${teaching.place}` : ''}
              </p>
            ) : null}
            {teaching.extra ? <p className="mt-3 text-muted">{teaching.extra}</p> : null}
            <div className="mt-4">
              <CtaLink to="/foi">Voir les enseignements</CtaLink>
            </div>
          </Card>
          {adoration.days ? (
            <Card>
              <h3 className="font-serif text-2xl text-wine">Adoration</h3>
              <p className="mt-3">
                {adoration.days}
                {adoration.hours ? ` · ${adoration.hours}` : ''}
                {adoration.place ? ` · ${adoration.place}` : ''}
              </p>
              {adoration.extra ? <p className="mt-2 text-sm text-muted">{adoration.extra}</p> : null}
            </Card>
          ) : null}
          {extraAppointments.map((a) => (
            <Card key={a.id}>
              <h3 className="font-serif text-2xl text-wine">{a.title}</h3>
              <p className="mt-3">
                {a.days}
                {a.hours ? ` · ${a.hours}` : ''}
                {a.place ? ` · ${a.place}` : ''}
              </p>
              {a.extra ? <p className="mt-2 text-sm text-muted">{a.extra}</p> : null}
            </Card>
          ))}
        </div>
        {missing.length ? (
          <div className="mt-6">
            <ComingSoon>À préciser avant publication : {missing.join(', ')}.</ComingSoon>
          </div>
        ) : null}
      </Section>

      <Section id="sacrements" title="Démarches pour les sacrements">
        <p className="mb-8 max-w-2xl text-muted">
          Conditions, pièces à fournir et calendrier de chaque démarche. Chaque demande peut être envoyée ici au
          secrétariat, qui vous recontacte.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {sacraments.map((item) => (
            <Card key={item.id} id={item.id}>
              <h3 className="font-serif text-2xl text-wine">{item.title}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ['Conditions', item.conditions],
                  ['Documents', item.documents],
                  ['Préparation', item.preparation],
                  ['Calendrier', item.calendar],
                  ['Contact', item.contact],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-medium">{label}</dt>
                      <dd className="whitespace-pre-line text-muted">{value}</dd>
                    </div>
                  ))}
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
          key={current.id}
          endpoint="/requests/"
          submitLabel={current.action}
          successTitle="Demande reçue"
          initialValues={{ type: current.title }}
          toPayload={(f) => ({ kind: 'sacrement', name: f.prenom, contact: f.contact, subject: f.type, message: f.message })}
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
