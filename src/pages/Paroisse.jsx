import { useSite } from '../data/SiteContext.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'
import { t } from '../i18n/index.jsx'

function HistoryTimeline({ chapters }) {
  return (
    <ol className="relative grid gap-10 border-l-2 border-gold/50 pl-6 sm:pl-10">
      {chapters.map((chapter, index) => (
        <li key={chapter.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[2.15rem] top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-wine font-serif text-sm text-gold-light sm:-left-[3.15rem]"
          >
            {index + 1}
          </span>
          <article className="border border-gold/30 bg-white/80 shadow-[0_8px_30px_rgba(26,22,20,0.06)]">
            {chapter.image ? <img src={chapter.image} alt="" className="max-h-72 w-full object-cover" loading="lazy" /> : null}
            <div className="p-5 sm:p-7">
              {chapter.period ? <p className="text-xs tracking-[0.25em] text-wine uppercase">{chapter.period}</p> : null}
              <h3 className="font-serif mt-2 text-2xl leading-tight sm:text-3xl">{chapter.title}</h3>
              <div className="mt-4 space-y-4 text-muted">
                {chapter.text.split(/\n\s*\n/).map((paragraph, i) => (
                  <p key={i} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </li>
      ))}
    </ol>
  )
}

export default function Paroisse() {
  const { parish, pastoralProgram, priests, history = [] } = useSite()
  const cure = priests.find((person) => person.id === 'cure') || priests[0]

  return (
    <>
      <PageHero kicker={parish.diocese} title={parish.fullName}>
        {parish.zone}. {t('Deux lieux de culte : {places}.', { places: parish.worshipPlaces.join(t(' et ')).toLowerCase() })}
      </PageHero>

      <Section eyebrow={t('Identité')} title={t('Qui nous sommes')}>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">{t('Nom')}</p>
            <p className="mt-3 text-muted">{parish.fullName}</p>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">{t('Diocèse')}</p>
            <p className="mt-3 text-muted">{parish.diocese}</p>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">{t('Zone pastorale')}</p>
            <p className="mt-3 text-muted">{parish.zone}</p>
          </Card>
        </div>
        <p className="mt-8 max-w-3xl text-lg">
          {t('Thème paroissial {year} : « {theme} ».', { year: parish.yearLabel, theme: parish.themeParish })}{' '}
          {t('Thème diocésain : « {theme} ».', { theme: parish.themeDiocesan })}
        </p>
        <p className="font-serif mt-4 text-3xl text-wine">{parish.slogan}</p>
      </Section>

      <Section id="histoire" tone="stone" eyebrow={t('Mémoire')} title={t('Notre histoire')}>
        {history.length ? (
          <>
            <p className="mb-10 max-w-3xl text-muted">
              {t('De la case-chapelle de 1940 à la paroisse érigée en 1988 : trois grandes étapes d’une communauté bâtie par ses catéchistes, ses missionnaires et ses fidèles.')}
            </p>
            <HistoryTimeline chapters={history} />
          </>
        ) : parish.history ? (
          <div className="max-w-3xl space-y-4 whitespace-pre-line text-muted">{parish.history}</div>
        ) : (
          <ComingSoon>
            {t('L’historique officiel — date de création, premiers curés, construction de la chapelle et de la petite église — sera publié après validation de l’équipe pastorale.')}
          </ComingSoon>
        )}
      </Section>

      <Section
        id="programme"
        title={t('Programme pastoral {year}', { year: (parish.yearLabel || '').replace(/^(Année pastorale|Pastoral year) /, '') })}
      >
        <p className="mb-8 max-w-3xl text-muted">{pastoralProgram.objective}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {pastoralProgram.munera.map((block) => (
            <Card key={block.id} id={block.id}>
              <h3 className="font-serif text-2xl text-wine">{block.title}</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink to="/foi">{t('Enseignements')}</CtaLink>
          <CtaLink to="/agenda">{t('Récollections par métier')}</CtaLink>
        </div>
      </Section>

      {cure ? (
        <Section tone="wine" title={t('Le curé')}>
          <p className="max-w-3xl text-cream/85">
            {cure.title} {cure.name}, {t('curé de la paroisse')}
            {cure.sector ? `, ${t('aumônier du secteur {sector}', { sector: cure.sector })}` : ''}. {cure.chaplaincy}
          </p>
          <div className="mt-6">
            <CtaLink to="/pretres" invert>
              {t('Toute l’équipe sacerdotale')}
            </CtaLink>
          </div>
        </Section>
      ) : null}
    </>
  )
}
