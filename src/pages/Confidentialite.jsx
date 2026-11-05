import { parish } from '../data/content.js'
import { PageHero, Section } from '../components/Layout.jsx'

export default function Confidentialite() {
  return (
    <>
      <PageHero kicker="Protection" title="Politique de confidentialité">
        Le site peut recueillir des noms, téléphones, intentions de prière et demandes de sacrement. Ces données sont
        sensibles.
      </PageHero>
      <Section>
        <div className="max-w-3xl space-y-4 text-muted">
          <p>Les formulaires (prière, prêtre, sacrements, bénévolat) ne publient jamais automatiquement leur contenu.</p>
          <p>
            Les intentions de prière sont réservées à l’équipe pastorale. Aucune information familiale ou de santé
            n’apparaît sur une page publique.
          </p>
          <p>
            Chaque contenu public est relu par le prêtre concerné avant publication. Les contacts des responsables de CEV
            ne sont affichés qu’avec leur accord.
          </p>
          <p>
            En Version 1, les demandes sont stockées localement dans le navigateur, en attendant un espace administrateur
            sécurisé.
          </p>
          <p>
            Contact : {parish.email || 'courriel paroissial à publier'}. WhatsApp paroissial uniquement, jamais le numéro
            personnel du curé affiché partout.
          </p>
        </div>
      </Section>
    </>
  )
}
