import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROLE_LABELS, useAuth } from '../auth/AuthContext.jsx'
import { Card, CtaLink, PageHero, Section } from '../components/Layout.jsx'
import { api } from '../lib/api.js'

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.getElementById('google-gsi')
    if (existing) {
      existing.addEventListener('load', resolve)
      return
    }
    const script = document.createElement('script')
    script.id = 'google-gsi'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function GoogleButton({ clientId, onCredential }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let cancelled = false
    loadGoogleScript()
      .then(() => {
        if (cancelled || !ref.current) return
        window.google.accounts.id.initialize({ client_id: clientId, callback: (res) => onCredential(res.credential) })
        window.google.accounts.id.renderButton(ref.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          locale: 'fr',
          width: 300,
        })
      })
      .catch(() => setFailed(true))
    return () => {
      cancelled = true
    }
  }, [clientId, onCredential])
  if (failed) return <p className="text-sm text-wine">Le service Google est injoignable. Vérifiez votre connexion.</p>
  return <div ref={ref} className="min-h-11" />
}

function DevLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('cure')
  return (
    <form
      className="mt-6 grid gap-3 border border-dashed border-wine/40 p-4"
      onSubmit={(e) => {
        e.preventDefault()
        onLogin(email, role)
      }}
    >
      <p className="text-xs tracking-[0.2em] text-wine uppercase">Mode test (local uniquement)</p>
      <input
        type="email"
        required
        placeholder="adresse@exemple.cm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-stone bg-cream px-3 py-2 text-sm"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-stone bg-cream px-3 py-2 text-sm">
        {Object.entries(ROLE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-wine px-4 py-2 text-sm text-cream uppercase">
        Entrer en test
      </button>
    </form>
  )
}

export default function Connexion() {
  const { user, login, logout, hasRole } = useAuth()
  const [config, setConfig] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const next = location.state?.from || null

  useEffect(() => {
    api('/auth/config/', { auth: false })
      .then(setConfig)
      .catch(() => setConfig({ unreachable: true }))
  }, [])

  async function afterLogin(promise) {
    setError('')
    try {
      const me = await promise
      const staff = ['secretariat', 'pretre', 'cure'].includes(me.role)
      navigate(next || (staff ? '/espace' : '/connexion'), { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  if (user && next && hasRole('secretariat')) return <Navigate to={next} replace />

  return (
    <>
      <PageHero kicker="Espace connecté" title={user ? `Bonjour ${user.first_name || user.name}` : 'Se connecter'}>
        La consultation du site ne demande aucun compte. La connexion sert aux paroissiens qui veulent signer leurs
        intentions, et à l’équipe pastorale pour gérer le site.
      </PageHero>
      <Section>
        <div className="mx-auto max-w-md">
          <Card>
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  {user.avatar_url ? <img src={user.avatar_url} alt="" className="h-12 w-12 rounded-full" referrerPolicy="no-referrer" /> : null}
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted">{user.email}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  Rôle : <span className="font-medium text-wine">{user.role_label}</span>
                </p>
                {!hasRole('secretariat') ? (
                  <p className="mt-2 text-sm text-muted">
                    Si vous faites partie de l’équipe pastorale, demandez au curé de vous attribuer votre rôle depuis
                    l’administration du site.
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  {hasRole('secretariat') ? <CtaLink to="/espace">Administration du site</CtaLink> : null}
                  <CtaLink to="/priere">Mur de prière</CtaLink>
                  <button type="button" onClick={logout} className="border border-wine px-4 py-2.5 text-xs text-wine uppercase sm:text-sm">
                    Se déconnecter
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-wine">Avec votre compte Google</h2>
                <p className="mt-2 mb-5 text-sm text-muted">Aucun mot de passe à retenir. Tout nouveau compte est « paroissien ».</p>
                {config === null ? <p className="text-sm text-muted">Chargement…</p> : null}
                {config?.unreachable ? (
                  <p className="text-sm text-wine">Le serveur de la paroisse est injoignable pour le moment.</p>
                ) : null}
                {config?.google_client_id ? (
                  <GoogleButton
                    clientId={config.google_client_id}
                    onCredential={(credential) => afterLogin(login('/auth/google/', { credential }))}
                  />
                ) : config && !config.unreachable ? (
                  <p className="text-sm text-muted">La connexion Google n’est pas encore configurée sur le serveur.</p>
                ) : null}
                {config?.dev_login ? (
                  <DevLogin onLogin={(email, role) => afterLogin(login('/auth/dev-login/', { email, role }))} />
                ) : null}
                {error ? <p className="mt-4 text-sm text-wine">{error}</p> : null}
              </>
            )}
          </Card>
        </div>
      </Section>
    </>
  )
}
