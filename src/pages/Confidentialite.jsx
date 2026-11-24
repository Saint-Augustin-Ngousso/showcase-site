import { useSite } from '../data/SiteContext.jsx'
import { PageHero, Section } from '../components/Layout.jsx'
import { t } from '../i18n/index.jsx'

export default function Confidentialite() {
  const { parish } = useSite()
  return (
    <>
      <PageHero kicker={t("Protection")} title={t("Politique de confidentialité")}>
        {t("Le site peut recueillir des noms, téléphones, intentions de prière et demandes de sacrement. Ces données sont sensibles.")}
      </PageHero>
      <Section>
        <div className="max-w-3xl space-y-4 text-muted">
          <p>
            {t('Les demandes envoyées depuis les formulaires (secrétariat, sacrements, prêtre, bénévolat) sont enregistrées sur le serveur de la paroisse et ne sont jamais publiées. Le secrétariat et les prêtres y ont accès ; les demandes « parler à un prêtre » ne sont lisibles que par les prêtres.')}
          </p>
          <p>
            {t("Une intention de prière n’apparaît sur le mur de prière que si vous l’avez choisi. Sinon, elle n’est lue que par les prêtres. Les prêtres peuvent retirer à tout moment une intention publiée.")}
          </p>
          <p>
            {t("Les questions sur la foi et les témoignages ne sont publiés qu’après relecture d’un prêtre. Chaque contenu public est validé par un prêtre avant publication. Les contacts des responsables de CEV ne sont affichés qu’avec leur accord.")}
          </p>
          <p>
            {t("La connexion avec Google est facultative : la consultation du site ne demande aucun compte. Si vous vous connectez, la paroisse conserve votre nom, votre adresse e-mail et votre photo de profil Google, pour signer vos intentions et vos témoignages.")}
          </p>
          <p>
            {t('Pour toute demande d’accès ou de suppression de vos données :')} {parish.email || t('courriel paroissial à publier')}.
          </p>
        </div>
      </Section>
    </>
  )
}
