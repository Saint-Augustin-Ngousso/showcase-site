import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { api } from '../lib/api.js'

const PENDING_LINKS = [
  ['news', 'Annonces', '/espace/r/news'],
  ['events', 'Événements', '/espace/r/events'],
  ['homilies', 'Homélies', '/espace/r/homilies'],
  ['photos', 'Photos', '/espace/r/photos'],
  ['downloads', 'Documents', '/espace/r/downloads'],
  ['faith_questions', 'Questions sur la foi', '/espace/r/faith-questions'],
  ['testimonials', 'Témoignages', '/espace/r/testimonials'],
]

function Tile({ to, label, value, highlight }) {
  return (
    <Link to={to} className={`block border p-4 ${highlight ? 'border-wine bg-wine text-cream' : 'border-gold/30 bg-white'}`}>
      <p className="font-serif text-3xl">{value}</p>
      <p className="mt-1 text-sm">{label}</p>
    </Link>
  )
}

export default function Dashboard() {
  const { user, hasRole } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/dashboard/').then(setData).catch((err) => setError(err.message))
  }, [])

  const totalPending = data ? Object.values(data.pending).reduce((a, b) => a + b, 0) : 0

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-wine uppercase">{user.role_label}</p>
      <h1 className="font-serif text-3xl">Bonjour {user.first_name || user.name}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {hasRole('pretre')
          ? 'Vous pouvez publier, valider, modifier et supprimer tout le contenu du site.'
          : 'Vous gérez les informations pratiques et proposez annonces et événements ; un prêtre les valide avant publication.'}
      </p>
      {error ? <p className="mt-4 text-sm text-wine">{error}</p> : null}

      {data ? (
        <>
          <h2 className="font-serif mt-8 text-2xl">À traiter</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile to="/espace/demandes" label="Demandes reçues non lues" value={data.new_requests} highlight={data.new_requests > 0} />
            <Tile
              to="/espace/r/news"
              label={hasRole('pretre') ? 'Contenus en attente de votre validation' : 'Contenus en attente de validation'}
              value={totalPending}
              highlight={hasRole('pretre') && totalPending > 0}
            />
            {hasRole('pretre') ? <Tile to="/espace/intentions" label="Intentions de prière (total)" value={data.intentions_today} /> : null}
            {hasRole('cure') ? <Tile to="/espace/utilisateurs" label="Comptes inscrits" value={data.users} /> : null}
          </div>
          {totalPending ? (
            <ul className="mt-4 divide-y divide-stone border border-gold/30 bg-white text-sm">
              {PENDING_LINKS.filter(([key]) => data.pending[key]).map(([key, label, to]) => (
                <li key={key} className="flex justify-between px-4 py-2">
                  <Link to={to} className="text-wine underline">
                    {label}
                  </Link>
                  <span>{data.pending[key]} en attente</span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      <h2 className="font-serif mt-10 text-2xl">Raccourcis</h2>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <Link to="/espace/r/news" className="border border-wine px-3 py-2 text-wine">Publier une annonce</Link>
        <Link to="/espace/r/events" className="border border-wine px-3 py-2 text-wine">Ajouter un événement</Link>
        <Link to="/espace/import-agenda" className="border border-wine px-3 py-2 text-wine">Importer le programme PDF</Link>
        <Link to="/espace/r/mass-times" className="border border-wine px-3 py-2 text-wine">Horaires des messes</Link>
        <Link to="/espace/parametres" className="border border-wine px-3 py-2 text-wine">Téléphone, adresse, WhatsApp</Link>
        {hasRole('cure') ? (
          <Link to="/espace/r/donation-accounts" className="border border-wine px-3 py-2 text-wine">Comptes pour les dons</Link>
        ) : null}
      </div>
    </div>
  )
}
