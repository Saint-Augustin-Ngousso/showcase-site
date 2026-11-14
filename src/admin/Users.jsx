import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ROLE_LABELS, useAuth } from '../auth/AuthContext.jsx'
import { api } from '../lib/api.js'

export default function Users() {
  const { user: me, hasRole } = useAuth()
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (role) params.set('role', role)
    api(`/users/?${params}`).then(setUsers).catch((err) => setError(err.message))
  }, [q, role])

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])

  if (!hasRole('cure')) return <Navigate to="/espace" replace />

  async function patch(user, body, label) {
    setError('')
    setMessage('')
    try {
      await api(`/users/${user.id}/`, { method: 'PATCH', body })
      setMessage(`${user.name} : ${label}.`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl">Utilisateurs et rôles</h1>
      <div className="mt-2 max-w-3xl space-y-1 text-sm text-muted">
        <p>Toute personne qui se connecte avec Google devient « paroissien ». Attribuez ici les rôles de l’équipe :</p>
        <ul className="list-disc pl-5">
          <li><strong>Secrétariat</strong> : informations pratiques, demandes reçues, propose annonces et événements.</li>
          <li><strong>Prêtre</strong> : publie, valide, modifie et supprime tout le contenu ; modère les intentions.</li>
          <li><strong>Curé</strong> : tout, plus les rôles et les comptes pour les dons.</li>
        </ul>
        <p>La personne doit s’être connectée une première fois pour apparaître dans la liste.</p>
      </div>
      {message ? <p className="mt-3 border border-gold bg-gold-light/40 px-3 py-2 text-sm">{message}</p> : null}
      {error ? <p className="mt-3 border border-wine/40 bg-wine/5 px-3 py-2 text-sm text-wine">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <input type="search" placeholder="Nom ou e-mail…" value={q} onChange={(e) => setQ(e.target.value)} className="border border-stone bg-white px-3 py-2 text-sm" />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-stone bg-white px-3 py-2 text-sm">
          <option value="">Tous les rôles</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 overflow-x-auto border border-gold/30 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-stone text-wine">
            <tr>
              <th className="px-3 py-2">Personne</th>
              <th className="px-3 py-2">Rôle</th>
              <th className="px-3 py-2">Dernière connexion</th>
              <th className="px-3 py-2">Compte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {users.map((user) => {
              const self = user.id === me.id
              return (
                <tr key={user.id} className={user.is_active ? '' : 'opacity-50'}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {user.avatar_url ? <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" /> : null}
                      <div>
                        <p className="font-medium">{user.name}{self ? ' (vous)' : ''}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={user.role}
                      disabled={self || user.is_superuser}
                      onChange={(e) => {
                        const next = e.target.value
                        if (next === 'cure' && !window.confirm(`Donner le rôle de curé à ${user.name} ? Il pourra gérer les rôles et les comptes de dons.`)) return
                        patch(user, { role: next }, `rôle « ${ROLE_LABELS[next]} »`)
                      }}
                      className="border border-stone px-2 py-1"
                    >
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-muted">{user.last_login ? new Date(user.last_login).toLocaleString('fr-FR') : '—'}</td>
                  <td className="px-3 py-2">
                    {!self && !user.is_superuser ? (
                      <button
                        type="button"
                        onClick={() => patch(user, { is_active: !user.is_active }, user.is_active ? 'compte désactivé' : 'compte réactivé')}
                        className="text-xs text-wine underline"
                      >
                        {user.is_active ? 'Désactiver' : 'Réactiver'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
