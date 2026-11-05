import { downloads, gallery } from '../data/content.js'
import { Card, CtaLink, PageHero, PhotoGrid, Section } from '../components/Layout.jsx'

export default function Mediatheque() {
  return (
    <>
      <PageHero kicker="Mémoire" title="Galerie photos">
        Quelques images de la vie des jeunes et des enfants de Saint Augustin de Ngousso. D’autres photos d’événements
        seront ajoutées au fil de l’année, avec l’accord des personnes visibles.
      </PageHero>

      <Section title="La vie paroissiale">
        <PhotoGrid photos={gallery} />
      </Section>

      <Section tone="stone" title="Documents">
        <ul className="divide-y divide-gold/20 border border-gold/30 bg-white">
          {downloads.map((item) => (
            <li key={item.title} className="flex justify-between px-5 py-4">
              <span>{item.title}</span>
              <span className="text-xs text-wine uppercase">{item.type}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Vidéos">
        <Card>
          <p className="text-muted">
            Homélies filmées, enseignements et événements. Aucune vidéo ne se lance toute seule. Cette section s’ouvrira
            ensuite.
          </p>
          <div className="mt-6">
            <CtaLink to="/foi#homelies">Enseignements et homélies</CtaLink>
          </div>
        </Card>
      </Section>
    </>
  )
}
