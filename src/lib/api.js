// Client de l'API du backend (Django).
// En production, l'API est servie sur le même domaine (/api). En local : http://localhost:8000/api.
// VITE_API_URL permet de forcer une autre adresse (adresse complète en https://…).
export const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api')
).replace(/\/$/, '')

const AUTH_KEY = 'paroisse.auth'

function safeStorage(fn, fallback = null) {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export function loadAuth() {
  return safeStorage(() => JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'))
}

export function saveAuth(auth) {
  safeStorage(() => {
    if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
    else localStorage.removeItem(AUTH_KEY)
  })
  window.dispatchEvent(new Event('paroisse-auth'))
}

export class ApiError extends Error {
  constructor(status, data) {
    super(formatError(data) || `Erreur ${status}`)
    this.status = status
    this.data = data
  }
}

export function formatError(data) {
  if (!data) return ''
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  return Object.entries(data)
    .map(([key, value]) => {
      const text = Array.isArray(value) ? value.join(' ') : typeof value === 'object' ? formatError(value) : value
      return key === 'non_field_errors' ? text : `${key} : ${text}`
    })
    .join(' · ')
}

let refreshing = null

async function refreshAccess() {
  const auth = loadAuth()
  if (!auth?.refresh) return null
  if (!refreshing) {
    refreshing = fetch(`${API_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: auth.refresh }),
    })
      .then(async (res) => {
        if (!res.ok) {
          saveAuth(null)
          return null
        }
        const data = await res.json()
        const next = { ...auth, access: data.access, refresh: data.refresh || auth.refresh }
        saveAuth(next)
        return next.access
      })
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}

/**
 * Appel à l'API. `body` peut être un objet (envoyé en JSON) ou un FormData (fichiers).
 */
export async function api(path, { method = 'GET', body, auth = true, retry = true } = {}) {
  const headers = {}
  const token = auth ? loadAuth()?.access : null
  if (token) headers.Authorization = `Bearer ${token}`
  let payload = body
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const res = await fetch(`${API_URL}${path}`, { method, headers, body: payload })
  if (res.status === 401 && token && retry) {
    const fresh = await refreshAccess()
    if (fresh) return api(path, { method, body, auth, retry: false })
  }
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}
