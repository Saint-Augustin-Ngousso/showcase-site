import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { api } from '../lib/api.js'

export default function Intentions() {
  const { hasRole } = useAuth()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(() => {
    api('/intentions/?scope=all').then(setItems).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!hasRole('pretre')) return <Navigate to="/espace" replace />

  async function toggleHidden(item) {
    await api(`/intentions/${item.id}/`, { method: 'PATCH', body: { hidden: !item.hidden } })
    load()
  }

  async function remove(item) {
    if (!window.confirm('Supprimer définitivement cette intention ?')) return
    await api(`/intentions/${item.id}/`, { method: 'DELETE' })
    load()
  }

  const shown = items.filter((item) =>
    filter === 'public' ? item.is_public && !item.hidden : filter === 'private' ? !item.is_public : filter === 'hidden' ? item.hidden : true,
  )

  return (
    <div>
      <h1 className="font-serif text-3xl">Intentions de prière</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Les intentions publiques apparaissent aussitôt sur le mur de prière. Masquez ou supprimez ce qui n’y a pas sa place.
        Les intentions privées ne sont visibles que des prêtres.
      </p>
      {error ? <p className="mt-3 text-sm text-wine">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          ['', 'Toutes'],
          ['public', 'Sur le mur'],
          ['private', 'Privées'],
          ['hidden', 'Masquées'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`border px-3 py-1.5 text-xs uppercase ${filter === value ? 'border-wine bg-wine text-cream' : 'border-wine/30 text-wine'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-3">
        {shown.map((item) => (
          <li key={item.id} className={`border bg-white p-4 ${item.hidden ? 'border-dashed opacity-60' : 'border-gold/30'}`}>
            <p className="text-xs text-muted">
              {new Date(item.created_at).toLocaleString('fr-FR')} · {item.category_label} ·{' '}
              {item.is_public ? (item.hidden ? 'masquée' : 'sur le mur') : 'privée'} · {item.prayed_count} prière(s)
            </p>
            <p className="mt-2 whitespace-pre-line">{item.text}</p>
            <p className="mt-2 text-sm text-muted">
              {item.author_name || 'Anonyme'}
              {item.user_email ? ` (${item.user_email})` : ''}
            </p>
            <div className="mt-3 flex gap-2">
              {item.is_public ? (
                <button type="button" onClick={() => toggleHidden(item)} className="border border-wine px-2 py-1 text-xs text-wine">
                  {item.hidden ? 'Réafficher' : 'Masquer du mur'}
                </button>
              ) : null}
              <button type="button" onClick={() => remove(item)} className="px-2 py-1 text-xs text-wine underline">
                Supprimer
              </button>
            </div>
          </li>
        ))}
        {!shown.length ? <li className="text-sm text-muted">Aucune intention.</li> : null}
      </ul>
    </div>
  )
}
