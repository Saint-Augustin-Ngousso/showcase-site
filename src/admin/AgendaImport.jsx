import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { useSite } from '../data/SiteContext.jsx'
import { api } from '../lib/api.js'

const CATEGORIES = [
  ['paroisse', 'Paroisse'],
  ['recollection', 'Récollection'],
  ['jeunes', 'Jeunes'],
  ['secteur', 'Secteur'],
  ['liturgie', 'Liturgie'],
  ['autre', 'Autre'],
]

const cell = 'w-full border border-stone bg-white px-2 py-1 text-sm'

export default function AgendaImport() {
  const { hasRole } = useAuth()
  const { reload } = useSite()
  const clergy = hasRole('pretre')
  const [file, setFile] = useState(null)
  const [year, setYear] = useState('')
  const [preview, setPreview] = useState(null)
  const [rows, setRows] = useState([])
  const [publish, setPublish] = useState(clergy)
  const [state, setState] = useState({ busy: false, error: '', result: null })

  async function analyse(event) {
    event.preventDefault()
    if (!file) return
    setState({ busy: true, error: '', result: null })
    const body = new FormData()
    body.append('file', file)
    if (year) body.append('year', year)
    try {
      const data = await api('/agenda-imports/', { method: 'POST', body })
      setPreview(data)
      setRows(data.parsed_rows)
      setState({ busy: false, error: '', result: null })
    } catch (err) {
      setState({ busy: false, error: err.message, result: null })
    }
  }

  async function apply() {
    setState({ busy: true, error: '', result: null })
    try {
      const result = await api(`/agenda-imports/${preview.id}/apply/`, { method: 'POST', body: { rows, publish } })
      setState({ busy: false, error: '', result })
      reload()
    } catch (err) {
      setState({ busy: false, error: err.message, result: null })
    }
  }

  const update = (index, key, value) => setRows((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
  const included = rows.filter((row) => row.include).length

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-wine uppercase">Agenda</p>
      <h1 className="font-serif text-3xl">Importer un programme PDF</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Téléversez le programme (par exemple le calendrier des récollections). Le site lit chaque ligne datée du tableau,
        vous montre ce qu’il a compris, puis met l’agenda à jour en un clic. Un événement déjà présent (même date, même
        titre) est mis à jour au lieu d’être dupliqué.
      </p>
      <p className="mt-2 max-w-3xl text-xs text-muted">
        Meilleurs résultats : un PDF issu de Word ou Google Docs (pas une photo scannée), avec un tableau « Date |
        Événement | Public » (colonnes « Lieu » et « Heure » facultatives).
      </p>

      <form onSubmit={analyse} className="mt-6 flex flex-wrap items-end gap-3 border border-gold/30 bg-white p-4">
        <label className="grid gap-1 text-sm">
          Fichier PDF
          <input type="file" accept="application/pdf,.pdf" required onChange={(e) => setFile(e.target.files[0] || null)} />
        </label>
        <label className="grid gap-1 text-sm">
          Année par défaut (si absente du PDF)
          <input type="number" placeholder={String(new Date().getFullYear())} value={year} onChange={(e) => setYear(e.target.value)} className="w-32 border border-stone px-2 py-1" />
        </label>
        <button type="submit" disabled={state.busy || !file} className="bg-wine px-4 py-2 text-sm text-cream disabled:opacity-60">
          {state.busy && !preview ? 'Lecture…' : 'Lire le PDF'}
        </button>
      </form>

      {state.error ? <p className="mt-4 border border-wine/40 bg-wine/5 px-3 py-2 text-sm text-wine">{state.error}</p> : null}

      {state.result ? (
        <div className="mt-6 border border-gold bg-gold-light/40 p-4 text-sm">
          <p className="font-medium">
            Agenda mis à jour : {state.result.created} événement(s) ajouté(s), {state.result.updated} mis à jour.
          </p>
          <p className="mt-1">
            {state.result.status === 'published'
              ? 'Ils sont visibles sur le site.'
              : 'Ils sont en attente : un prêtre doit les valider pour qu’ils apparaissent.'}
          </p>
          {state.result.errors.length ? <p className="mt-1 text-wine">{state.result.errors.length} ligne(s) refusée(s) : vérifiez dates et titres.</p> : null}
          <Link to="/espace/r/events" className="mt-2 inline-block text-wine underline">
            Voir l’agenda
          </Link>
        </div>
      ) : null}

      {preview && !state.result ? (
        <div className="mt-6">
          <p className="text-sm">
            {rows.length} ligne(s) détectée(s) par lecture du {preview.method}. Décochez ce qui ne doit pas aller dans
            l’agenda, corrigez si besoin, puis appliquez.
          </p>
          <div className="mt-3 overflow-x-auto border border-gold/30 bg-white">
            <table className="w-full min-w-[60rem] text-left text-sm">
              <thead className="bg-stone text-wine">
                <tr>
                  <th className="px-2 py-2">Garder</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Fin</th>
                  <th className="px-2 py-2">Titre</th>
                  <th className="px-2 py-2">Public</th>
                  <th className="px-2 py-2">Lieu</th>
                  <th className="px-2 py-2">Catégorie</th>
                  <th className="px-2 py-2">Effet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone">
                {rows.map((row, index) => (
                  <tr key={index} className={row.include ? '' : 'opacity-40'}>
                    <td className="px-2 py-1">
                      <input type="checkbox" checked={row.include} onChange={(e) => update(index, 'include', e.target.checked)} className="accent-wine" />
                    </td>
                    <td className="px-2 py-1">
                      <input type="date" value={row.date} onChange={(e) => update(index, 'date', e.target.value)} className={cell} />
                    </td>
                    <td className="px-2 py-1">
                      <input type="date" value={row.date_end || ''} onChange={(e) => update(index, 'date_end', e.target.value || null)} className={cell} />
                    </td>
                    <td className="px-2 py-1">
                      <input value={row.title} onChange={(e) => update(index, 'title', e.target.value)} className={cell} />
                    </td>
                    <td className="px-2 py-1">
                      <input value={row.audience} onChange={(e) => update(index, 'audience', e.target.value)} className={cell} />
                    </td>
                    <td className="px-2 py-1">
                      <input value={row.place} onChange={(e) => update(index, 'place', e.target.value)} className={cell} />
                    </td>
                    <td className="px-2 py-1">
                      <select value={row.category} onChange={(e) => update(index, 'category', e.target.value)} className={cell}>
                        {CATEGORIES.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1 text-xs">
                      {row.action === 'update' ? (
                        'Mise à jour'
                      ) : row.action === 'possible_duplicate' ? (
                        <span className="text-wine" title={row.similar_title}>
                          Doublon possible de « {row.similar_title} »
                        </span>
                      ) : (
                        'Nouveau'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.ignored?.length ? (
            <details className="mt-3 text-sm text-muted">
              <summary className="cursor-pointer">{preview.ignored.length} ligne(s) ignorée(s) (sans date précise)</summary>
              <ul className="mt-2 list-disc pl-5">
                {preview.ignored.map((item, i) => (
                  <li key={i}>
                    p. {item.page} — {item.text} ({item.reason})
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {clergy ? (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="accent-wine" />
                Publier directement sur le site
              </label>
            ) : (
              <p className="text-sm text-muted">Les événements seront envoyés en attente de validation par un prêtre.</p>
            )}
            <button type="button" onClick={apply} disabled={state.busy || !included} className="bg-wine px-4 py-2 text-sm text-cream disabled:opacity-60">
              {state.busy ? 'Mise à jour…' : `Mettre à jour l’agenda (${included})`}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
