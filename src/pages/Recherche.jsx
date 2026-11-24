import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchSite } from '../components/SearchBox.jsx'
import SearchBox from '../components/SearchBox.jsx'
import { Card, PageHero, Section } from '../components/Layout.jsx'
import { t } from '../i18n/index.jsx'

export default function Recherche() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const results = useMemo(() => searchSite(query), [query])

  return (
    <>
      <PageHero kicker={t("Recherche")} title={t("Que cherchez-vous ?")}>
        {t("Baptême, confession, messe du dimanche, prêtre, prière…")}
      </PageHero>
      <Section>
        <SearchBox />
        <div className="mt-8 grid gap-4">
          {query && results.length === 0 ? <p className="text-muted">{t('Aucun résultat pour « {query} ».', { query })}</p> : null}
          {results.map((item) => (
            <Link key={item.to} to={item.to}>
              <Card>
                <h2 className="font-serif text-2xl text-wine">{t(item.title)}</h2>
                <p className="mt-2 text-muted">{t(item.text)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
