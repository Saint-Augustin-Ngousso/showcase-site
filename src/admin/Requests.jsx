import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { api } from '../lib/api.js'

const STATES = [
  ['new', 'Nouvelle'],
  ['in_progress', 'En cours'],
  ['done', 'Traitée'],
]
const KINDS = [
  ['', 'Toutes'],
  ['secretariat', 'Secrétariat'],
  ['sacrement', 'Sacrements'],
  ['pretre', 'Parler à un prêtre'],
  ['benevolat', 'Bénévolat'],
]

export default function Requests() {
  const { hasRole } = useAuth()
  const [items, setItems] = useState([])
  const [kind, setKind] = useState('')
  const [state, setState] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(() => {
    const params = new URLSearchParams()
    if (kind) params.set('kind', kind)
    if (state) params.set('state', state)
    api(`/requests/?${params}`).then(setItems).catch((err) => setError(err.message))
  }, [kind, state])

  useEffect(() => {
    load()
  }, [load])

  async function patch(item, body) {
    try {
      await api(`/requests/${item.id}/`, { method: 'PATCH', body })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(item) {
    if (!window.confirm('Supprimer définitivement cette demande ?')) return
    await api(`/requests/${item.id}/`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <h1 className="font-serif text-3xl">Demandes reçues</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Messages des formulaires du site. Les demandes « parler à un prêtre » ne sont visibles que des prêtres.
      </p>
      {error ? <p className="mt-3 text-sm text-wine">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {KINDS.filter(([value]) => value !== 'pretre' || hasRole('pretre')).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            className={`border px-3 py-1.5 text-xs uppercase ${kind === value ? 'border-wine bg-wine text-cream' : 'border-wine/30 text-wine'}`}
          >
            {label}
          </button>
        ))}
        <select value={state} onChange={(e) => setState(e.target.value)} className="border border-stone bg-white px-2 py-1 text-sm">
          <option value="">Tous les états</option>
          {STATES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item.id} className={`border bg-white p-4 ${item.state === 'new' ? 'border-wine' : 'border-gold/30'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs tracking-[0.15em] text-wine uppercase">
                {item.kind_label}
                {item.subject ? ` · ${item.subject}` : ''}
              </p>
              <p className="text-xs text-muted">{new Date(item.created_at).toLocaleString('fr-FR')}</p>
            </div>
            <p className="mt-2 font-medium">
              {item.name} — <span className="select-all">{item.contact}</span>
            </p>
            <p className="mt-2 whitespace-pre-line text-sm">{item.message}</p>
            {item.extra && Object.keys(item.extra).length ? (
              <p className="mt-1 text-xs text-muted">
                {Object.entries(item.extra)
                  .map(([k, v]) => `${k} : ${v}`)
                  .join(' · ')}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <select value={item.state} onChange={(e) => patch(item, { state: e.target.value })} className="border border-stone px-2 py-1">
                {STATES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                defaultValue={item.internal_note}
                placeholder="Note interne (non visible du demandeur)"
                onBlur={(e) => e.target.value !== item.internal_note && patch(item, { internal_note: e.target.value })}
                className="min-w-64 flex-1 border border-stone px-2 py-1"
              />
              {item.handled_by_name ? <span className="text-xs text-muted">suivi par {item.handled_by_name}</span> : null}
              {hasRole('pretre') ? (
                <button type="button" onClick={() => remove(item)} className="text-xs text-wine underline">
                  Supprimer
                </button>
              ) : null}
            </div>
          </li>
        ))}
        {!items.length ? <li className="text-sm text-muted">Aucune demande.</li> : null}
      </ul>
    </div>
  )
}
