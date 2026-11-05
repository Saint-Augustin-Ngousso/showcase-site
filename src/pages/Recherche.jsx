import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchSite } from '../components/SearchBox.jsx'
import SearchBox from '../components/SearchBox.jsx'
import { Card, PageHero, Section } from '../components/Layout.jsx'

export default function Recherche() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const results = useMemo(() => searchSite(query), [query])

  return (
    <>
      <PageHero kicker="Recherche" title="Que cherchez-vous ?">
        Baptême, confession, messe du dimanche, prêtre, prière…
      </PageHero>
      <Section>
        <SearchBox />
        <div className="mt-8 grid gap-4">
          {query && results.length === 0 ? <p className="text-muted">Aucun résultat pour « {query} ».</p> : null}
          {results.map((item) => (
            <Link key={item.to} to={item.to}>
              <Card>
                <h2 className="font-serif text-2xl text-wine">{item.title}</h2>
                <p className="mt-2 text-muted">{item.text}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
