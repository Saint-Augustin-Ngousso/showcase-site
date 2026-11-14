import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, loadAuth, saveAuth } from '../lib/api.js'

const AuthContext = createContext(null)

export const ROLE_LABELS = {
  paroissien: 'Paroissien',
  secretariat: 'Secrétariat',
  pretre: 'Prêtre',
  cure: 'Curé',
}

const RANK = { paroissien: 0, secretariat: 1, pretre: 2, cure: 3 }

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth)

  useEffect(() => {
    const sync = () => setAuth(loadAuth())
    window.addEventListener('paroisse-auth', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('paroisse-auth', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // Rafraîchit le profil (un rôle a pu changer depuis la dernière visite).
  useEffect(() => {
    if (!loadAuth()?.access) return
    api('/auth/me/')
      .then((user) => {
        const current = loadAuth()
        if (current) saveAuth({ ...current, user })
      })
      .catch(() => {})
  }, [])

  const login = useCallback(async (path, body) => {
    const data = await api(path, { method: 'POST', body, auth: false })
    saveAuth(data)
    return data.user
  }, [])

  const logout = useCallback(() => {
    window.google?.accounts?.id?.disableAutoSelect?.()
    saveAuth(null)
  }, [])

  const user = auth?.user || null
  const hasRole = useCallback((minimum) => Boolean(user && RANK[user.role] >= RANK[minimum]), [user])

  return <AuthContext.Provider value={{ user, login, logout, hasRole }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
