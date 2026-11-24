import { Navigate, useParams } from 'react-router-dom'
import { useSite } from '../data/SiteContext.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'
import { SectorNav } from './Secteurs.jsx'
import { t } from '../i18n/index.jsx'

export default function SecteurDetail() {
  const { secteur } = useParams()
  const { cevSectors } = useSite()
  const sector = cevSectors.find((item) => item.id === secteur)

  if (!sector) return <Navigate to="/secteurs" replace />
  const missingMeetings = sector.cevs.some((cev) => !cev.meeting)

  return (
    <>
      <PageHero kicker={t('Secteur {name}', { name: sector.saint })} title={t('Communautés du secteur {name}', { name: sector.saint })}>
        {t('Aumônier :')} {sector.chaplain}
        {sector.layLeaders ? `. ${t('Responsables laïcs : {names}', { names: sector.layLeaders })}.` : '.'}
      </PageHero>

      <Section title={t("Les CEV")}>
        <SectorNav />
        {sector.cevs.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sector.cevs.map((cev, index) => (
                <Card key={cev.name}>
                  <p className="text-xs tracking-[0.2em] text-wine uppercase">CEV {index + 1}</p>
                  <h2 className="font-serif mt-2 text-2xl text-wine">{cev.name}</h2>
                  <p className="mt-3 text-sm text-muted">{cev.lead}</p>
                  {cev.zone ? (
                    <p className="mt-2 whitespace-pre-line text-sm">
                      <span className="text-xs tracking-[0.15em] text-wine uppercase">{t("Zone ·")} </span>
                      {cev.zone}
                    </p>
                  ) : null}
                  {cev.meeting ? <p className="mt-2 text-sm">{t('Réunion :')} {cev.meeting}</p> : null}
                  {cev.contact ? <p className="mt-1 text-sm text-muted">{t('Contact :')} {cev.contact}</p> : null}
                </Card>
              ))}
            </div>
            {missingMeetings ? (
              <p className="mt-6 text-sm text-muted">
                {t("Les jours de réunion seront ajoutés dès qu’ils seront transmis. Les contacts téléphoniques des responsables ne sont publiés qu’avec leur accord.")}
              </p>
            ) : null}
          </>
        ) : (
          <ComingSoon>
            {t('La liste des CEV de {name}, avec jours de réunion et responsables, sera publiée sur le modèle du secteur Saint Marc.', { name: sector.saint })}
          </ComingSoon>
        )}
      </Section>

      <Section tone="stone" title={t("Programme des descentes")}>
        {sector.descents.length ? (
          <ul className="divide-y divide-gold/20 border border-gold/30 bg-white">
            {sector.descents.map((item) => (
              <li key={item.period + item.activity} className="grid gap-1 px-4 py-4 sm:grid-cols-3">
                <span className="font-medium">{item.period}</span>
                <span className="text-muted sm:col-span-2">{item.activity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ComingSoon>{t('Le programme des descentes de {name} sera publié ici, sur le modèle du secteur Saint Marc.', { name: sector.saint })}</ComingSoon>
        )}
        <p className="mt-8">
          <CtaLink to="/secteurs">{t("Retour aux trois secteurs")}</CtaLink>
        </p>
      </Section>
    </>
  )
}
