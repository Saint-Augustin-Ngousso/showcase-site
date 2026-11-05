import { parish, pastoralProgram, priests } from '../data/content.js'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'

export default function Paroisse() {
  const cure = priests.find((person) => person.id === 'cure')

  return (
    <>
      <PageHero kicker={parish.diocese} title={parish.fullName}>
        {parish.zone}. Deux lieux de culte : {parish.worshipPlaces.join(' et ').toLowerCase()}.
      </PageHero>

      <Section eyebrow="Identité" title="Qui nous sommes">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Nom</p>
            <p className="mt-3 text-muted">{parish.fullName}</p>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Diocèse</p>
            <p className="mt-3 text-muted">{parish.diocese}</p>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-wine uppercase">Zone pastorale</p>
            <p className="mt-3 text-muted">{parish.zone}</p>
          </Card>
        </div>
        <p className="mt-8 max-w-3xl text-lg">
          Thème paroissial {parish.yearLabel} : « {parish.themeParish} ». Thème diocésain : « {parish.themeDiocesan} ».
        </p>
        <p className="font-serif mt-4 text-3xl text-wine">{parish.slogan}</p>
      </Section>

      <Section tone="stone" eyebrow="Mémoire" title="Histoire">
        <ComingSoon>
          L’historique officiel — date de création, premiers curés, construction de la chapelle et de la petite église —
          sera publié après validation de l’équipe pastorale.
        </ComingSoon>
      </Section>

      <Section id="programme" title={`Programme pastoral ${parish.yearLabel.replace('Année pastorale ', '')}`}>
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
          <CtaLink to="/foi">Enseignements</CtaLink>
          <CtaLink to="/agenda">Récollections par métier</CtaLink>
        </div>
      </Section>

      <Section tone="wine" title="Le curé">
        <p className="max-w-3xl text-cream/85">
          {cure.title} {cure.name}, curé de la paroisse, aumônier du secteur {cure.sector}. {cure.chaplaincy}
        </p>
        <div className="mt-6">
          <CtaLink to="/pretres" invert>
            Toute l’équipe sacerdotale
          </CtaLink>
        </div>
      </Section>
    </>
  )
}
