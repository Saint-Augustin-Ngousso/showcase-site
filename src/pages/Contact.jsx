import { useState } from 'react'
import { useSite } from '../data/SiteContext.jsx'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'
import { t } from '../i18n/index.jsx'

function CopyButton({ value }) {
  const [done, setDone] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch {
      /* presse-papiers indisponible : le texte reste sélectionnable */
    }
  }
  return (
    <button type="button" onClick={copy} className="ml-2 border border-wine/30 px-1.5 py-0.5 text-[11px] text-wine uppercase">
      {done ? t('Copié') : t('Copier')}
    </button>
  )
}

const COPYABLE = new Set(['Numéro', 'Numéro de compte', 'RIB / IBAN', 'SWIFT / BIC'])

function DonationCard({ account }) {
  const lines = [
    ['Titulaire', account.accountName],
    [account.kind === 'bank' ? 'Numéro de compte' : 'Numéro', account.number],
    ['Banque', account.bankName],
    ['RIB / IBAN', account.rib],
    ['SWIFT / BIC', account.swift],
  ].filter(([, value]) => value)
  return (
    <Card>
      <p className="text-xs tracking-[0.2em] text-wine uppercase">{account.kindLabel}</p>
      <h3 className="font-serif mt-2 text-xl">{account.label}</h3>
      <dl className="mt-3 space-y-1 text-sm">
        {lines.map(([label, value]) => (
          <div key={label} className="flex flex-wrap gap-x-2">
            <dt className="text-muted">{t(label)} :</dt>
            <dd className="font-medium break-all select-all">
              {value}
              {COPYABLE.has(label) ? <CopyButton value={value} /> : null}
            </dd>
          </div>
        ))}
      </dl>
      {account.details ? <p className="mt-3 whitespace-pre-line text-sm text-muted">{account.details}</p> : null}
    </Card>
  )
}

export default function Contact() {
  const { parish, projects, donationAccounts } = useSite()
  const mapsTarget =
    parish.latitude && parish.longitude ? `${parish.latitude},${parish.longitude}` : parish.mapsQuery || parish.address
  const mapsSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapsTarget)}&z=15&output=embed`
  const preciseLocation = Boolean(parish.latitude && parish.longitude)

  return (
    <>
      <PageHero kicker={t("Nous trouver")} title={t("Contact et soutien")}>
        {t("Adresse, plan, téléphone, réseaux sociaux, secrétariat, dons et quêtes.")}
      </PageHero>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="font-serif text-2xl text-wine">{t("Informations pratiques")}</h2>
            <p className="mt-3">{parish.address}</p>
            {parish.landmark ? <p className="mt-1 text-sm text-muted">{t('Repère :')} {parish.landmark}</p> : null}
            <p className="mt-2 text-muted">
              {parish.diocese} · {parish.zone}
            </p>
            {parish.transport ? <p className="mt-2 text-sm text-muted">{parish.transport}</p> : null}
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="font-medium">{t("Téléphone")}</dt>
                <dd className="text-muted">
                  {parish.phone ? <a href={`tel:${parish.phone.replace(/\s/g, '')}`}>{parish.phone}</a> : t('À préciser')}
                </dd>
              </div>
              <div>
                <dt className="font-medium">{t("Courriel")}</dt>
                <dd className="text-muted">{parish.email ? <a href={`mailto:${parish.email}`}>{parish.email}</a> : 'À préciser'}</dd>
              </div>
              <div>
                <dt className="font-medium">{t("Secrétariat")}</dt>
                <dd className="text-muted">{parish.officeHours || 'Horaires à préciser'}</dd>
              </div>
              {parish.churchOpen ? (
                <div>
                  <dt className="font-medium">{t("Ouverture de l’église")}</dt>
                  <dd className="text-muted">{parish.churchOpen}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-medium">{t("WhatsApp paroissial")}</dt>
                <dd className="text-muted">{parish.whatsappNumber ? `+${parish.whatsappNumber}` : 'Compte à publier dès confirmation.'}</dd>
              </div>
            </dl>
            {parish.whatsapp ? (
              <div className="mt-6">
                <CtaLink href={parish.whatsapp}>{t("Nous contacter sur WhatsApp")}</CtaLink>
              </div>
            ) : null}
          </Card>
          <PastoralForm
            endpoint="/requests/"
            submitLabel={t("Écrire au secrétariat")}
            successTitle={t("Message envoyé")}
            toPayload={(f) => ({ kind: 'secretariat', name: f.prenom, contact: f.contact, message: f.message })}
            fields={[
              { name: 'prenom', label: 'Prénom', required: true },
              { name: 'contact', label: 'Téléphone, WhatsApp ou courriel', required: true },
              { name: 'message', label: 'Message', type: 'textarea', required: true },
            ]}
          />
        </div>
      </Section>

      <Section tone="stone" title={t("Plan d’accès")}>
        <iframe
          title={t("Carte de la paroisse")}
          src={mapsSrc}
          className="h-80 w-full border border-gold/30"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {preciseLocation ? (
          <div className="mt-4">
            <CtaLink href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsTarget)}`}>
              {t("Itinéraire")}
            </CtaLink>
          </div>
        ) : (
          <ComingSoon className="mt-4">
            {t("L’adresse précise, le repère d’accès et le point GPS officiel remplaceront cette carte de quartier.")}
          </ComingSoon>
        )}
      </Section>

      <Section id="soutien" title={t("Dons, offrandes et quêtes")}>
        {parish.donationsIntro ? <p className="mb-6 max-w-2xl whitespace-pre-line text-muted">{parish.donationsIntro}</p> : null}
        {donationAccounts.length ? (
          <ol className="mb-6 grid max-w-3xl gap-1 text-sm text-muted sm:grid-cols-3 sm:gap-4">
            <li><span className="font-medium text-wine">1.</span> {t("Choisissez un compte ci-dessous et copiez le numéro.")}</li>
            <li><span className="font-medium text-wine">2.</span> {t("Envoyez votre don depuis votre application Mobile Money ou votre banque.")}</li>
            <li><span className="font-medium text-wine">3.</span> {t("Indiquez en motif « Don », « Messe » ou « Presbytère », puis gardez votre reçu.")}</li>
          </ol>
        ) : null}
        {donationAccounts.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {donationAccounts.map((account) => (
              <DonationCard key={account.id} account={account} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {['Mobile Money', 'Orange Money', t('Virement / diaspora')].map((label) => (
              <Card key={label}>
                <p className="text-xs tracking-[0.2em] text-wine uppercase">{label}</p>
                <p className="mt-3 text-muted">{t("Coordonnées à confirmer")}</p>
              </Card>
            ))}
          </div>
        )}
        {projects.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {projects.map((item) => (
              <Card key={item.title}>
                <h3 className="font-serif text-2xl text-wine">{item.title}</h3>
                {item.progress ? (
                  <div className="mt-3">
                    <div className="h-2 w-full bg-stone">
                      <div className="h-2 bg-gold" style={{ width: `${Math.min(100, item.progress)}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-muted">{t('{n} % réalisé', { n: item.progress })}</p>
                  </div>
                ) : null}
                <p className="mt-3 text-muted">{item.text}</p>
              </Card>
            ))}
          </div>
        ) : null}
      </Section>
    </>
  )
}
