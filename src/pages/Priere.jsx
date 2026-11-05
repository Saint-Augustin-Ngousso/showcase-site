import PastoralForm from '../components/PastoralForm.jsx'
import { PageHero, Section } from '../components/Layout.jsx'

export default function Priere() {
  return (
    <>
      <PageHero kicker="Confier" title="Je demande une prière">
        Votre intention arrive à l’équipe pastorale. Elle n’est jamais publiée automatiquement.
      </PageHero>

      <Section>
        <div className="mx-auto max-w-2xl">
          <PastoralForm
            storageKey="intentions-priere"
            submitLabel="Confier cette intention à la prière"
            successTitle="Intention reçue dans la prière"
            notice="Ne mentionnez que ce que vous souhaitez partager avec l’équipe. Aucune intention n’apparaît sur le site."
            fields={[
              { name: 'prenom', label: 'Prénom (facultatif)' },
              { name: 'categorie', label: 'Catégorie', type: 'select', required: true, options: ['Santé', 'Famille', 'Travail', 'Études', 'Deuil', 'Conversion', 'Action de grâce', 'Autre'] },
              { name: 'intention', label: 'Intention de prière', type: 'textarea', required: true, rows: 6 },
            ]}
          />
        </div>
      </Section>
    </>
  )
}
