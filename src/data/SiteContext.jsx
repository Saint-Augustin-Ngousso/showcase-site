import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import * as fallback from './content.js'

// Contenu du site servi par le backend (/api/site/).
// - Dernière version reçue gardée dans le navigateur : affichage immédiat aux visites suivantes.
// - Si le backend est injoignable, le contenu de content.js sert de secours.

const CACHE_KEY = 'paroisse.site.v1'
const SiteContext = createContext(null)

const fallbackPayload = {
  parish: fallback.parish,
  pastoralProgram: fallback.pastoralProgram,
  priests: fallback.priests,
  schedules: { saturday: [], ...fallback.schedules },
  sacraments: fallback.sacraments,
  cevSectors: fallback.cevSectors,
  associationPlatforms: fallback.associationPlatforms,
  youthGroups: fallback.youthGroups,
  choirs: fallback.choirs,
  councils: fallback.councils,
  commissions: fallback.commissions,
  proposedCommissions: fallback.proposedCommissions,
  gallery: fallback.gallery,
  heroPhoto: fallback.heroPhoto,
  news: fallback.news,
  events: fallback.events,
  homilies: fallback.homilies,
  faithQuestions: fallback.faithQuestions,
  prayers: fallback.prayers,
  testimonials: fallback.testimonials,
  downloads: fallback.downloads,
  projects: fallback.projects,
  donationAccounts: [],
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    /* stockage plein ou bloqué : sans importance */
  }
}

export function whatsappLink(parish, text = 'Bonjour, je vous écris depuis le site de la paroisse Saint Augustin de Ngousso.') {
  const number = (parish?.whatsappNumber || '').replace(/\D/g, '')
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null
}

export function massPlaces(item) {
  if (item.chapelle && item.petiteEglise) return 'Chapelle et petite église'
  if (item.chapelle) return 'Chapelle'
  if (item.petiteEglise) return 'Petite église'
  return ''
}

function todayIso() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function slugify(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function withAssociations(platforms) {
  // Contenu de secours : les plateformes n'ont que des noms, on fabrique des fiches minimales.
  return platforms.map((p) =>
    p.associations ? p : { ...p, associations: p.items.map((name) => ({ name, slug: slugify(name), media: [] })) },
  )
}

function enrich(data) {
  const parish = { ...fallback.parish, ...data.parish }
  parish.whatsapp = whatsappLink(parish)
  if (!parish.worshipPlaces?.length) parish.worshipPlaces = fallback.parish.worshipPlaces
  const events = [...(data.events || [])].sort((a, b) => a.date.localeCompare(b.date))
  const schedules = { ...fallbackPayload.schedules, ...data.schedules }

  return {
    ...fallbackPayload,
    ...data,
    parish,
    events,
    schedules,
    associationPlatforms: withAssociations(data.associationPlatforms || fallbackPayload.associationPlatforms),
    youthGroups: {
      ...(data.youthGroups || fallbackPayload.youthGroups),
      associations:
        data.youthGroups?.associations ||
        (data.youthGroups || fallbackPayload.youthGroups).items.map((name) => ({ name, slug: slugify(name), media: [] })),
    },
    heroPhoto: data.heroPhoto || data.gallery?.[0] || null,
    upcomingEvents(from = todayIso()) {
      return events.filter((item) => (item.dateEnd || item.date) >= from)
    },
    eventOnDay(iso) {
      return events.filter((item) => (item.dateEnd ? iso >= item.date && iso <= item.dateEnd : item.date === iso))
    },
    nextSundayMass() {
      const now = new Date()
      const day = now.getDay()
      const daysUntilSunday = day === 0 ? 0 : 7 - day
      const target = new Date(now)
      target.setDate(now.getDate() + daysUntilSunday)
      const first = schedules.sunday?.[0]
      return {
        label: daysUntilSunday === 0 ? 'Aujourd’hui' : 'Prochain dimanche',
        time: first?.time || 'À préciser',
        note: first ? massPlaces(first) : '',
        date: target.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      }
    },
  }
}

export function SiteProvider({ children }) {
  const [raw, setRaw] = useState(() => readCache())
  const [status, setStatus] = useState(raw ? 'cached' : 'loading')

  const reload = useCallback(() => {
    return api('/site/', { auth: false })
      .then((data) => {
        setRaw(data)
        writeCache(data)
        setStatus('ready')
      })
      .catch(() => setStatus((current) => (current === 'loading' ? 'offline' : current)))
  }, [])

  useEffect(() => {
    reload()
    // Connexion très lente : on n'attend pas plus de 5 s pour afficher le site.
    const timer = setTimeout(() => setStatus((current) => (current === 'loading' ? 'offline' : current)), 5000)
    return () => clearTimeout(timer)
  }, [reload])

  const value = useMemo(() => {
    const data = enrich(raw || fallbackPayload)
    return { ...data, status, reload, offline: status === 'offline' }
  }, [raw, status, reload])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-wine">
        <p className="font-serif text-2xl">Paroisse Saint Augustin de Ngousso…</p>
      </div>
    )
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
