import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchIndex } from '../data/content.js'
import { t } from '../i18n/index.jsx'

export function searchSite(query) {
  const fold = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const words = fold(query).split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return searchIndex
    .map((item) => {
      const hay = fold([...item.q, item.title, item.text, t(item.title), t(item.text)].join(' '))
      const score = words.filter((word) => hay.includes(word)).length
      return { ...item, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
}

export default function SearchBox({ compact = false, onDone }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const results = useMemo(() => searchSite(query), [query])

  function onSubmit(event) {
    event.preventDefault()
    if (!query.trim()) return
    navigate(`/recherche?q=${encodeURIComponent(query.trim())}`)
    onDone?.()
  }

  return (
    <div className={compact ? 'relative w-full' : 'relative w-full max-w-md'}>
      <form onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="recherche-site">
          {t("Que cherchez-vous ?")}
        </label>
        <input
          id="recherche-site"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Que cherchez-vous ? messe, baptême…")}
          className="w-full border border-gold/40 bg-white px-3 py-2 text-sm"
        />
      </form>
      {query && results.length > 0 ? (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-auto border border-gold/30 bg-white text-sm shadow">
          {results.slice(0, 6).map((item) => (
            <li key={item.to}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left hover:bg-cream"
                onClick={() => {
                  navigate(item.to)
                  onDone?.()
                }}
              >
                <span className="font-medium text-wine">{t(item.title)}</span>
                <span className="mt-0.5 block text-xs text-muted">{t(item.text)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
