import { locale, t } from '../i18n/index.jsx'

// Calculs de dates de l'agenda, toujours relatifs au jour du visiteur.

export function isoDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return isoDay(d)
}

/** Dimanche de la semaine en cours (la semaine liturgique et civile se termine le dimanche). */
export function endOfWeek(today = isoDay()) {
  const day = new Date(`${today}T12:00:00`).getDay() // 0 = dimanche
  return addDays(today, day === 0 ? 0 : 7 - day)
}

export function endOfMonth(today = isoDay()) {
  const d = new Date(`${today}T12:00:00`)
  return isoDay(new Date(d.getFullYear(), d.getMonth() + 1, 0, 12))
}

export function isOngoing(event, today = isoDay()) {
  return event.date <= today && (event.dateEnd || event.date) >= today
}

/** Événements à venir regroupés : aujourd'hui (ou en cours), cette semaine, ce mois-ci, plus tard. */
export function groupUpcoming(events, today = isoDay()) {
  const week = endOfWeek(today)
  const month = endOfMonth(today)
  const groups = [
    { id: 'today', label: t('Aujourd’hui et en cours'), items: [] },
    { id: 'week', label: t('Cette semaine'), items: [] },
    { id: 'month', label: t('Plus tard ce mois-ci'), items: [] },
    { id: 'later', label: t('Prochainement'), items: [] },
  ]
  for (const event of events) {
    if ((event.dateEnd || event.date) < today) continue
    if (isOngoing(event, today)) groups[0].items.push(event)
    else if (event.date <= week) groups[1].items.push(event)
    else if (event.date <= month) groups[2].items.push(event)
    else groups[3].items.push(event)
  }
  return groups.filter((group) => group.items.length)
}

/** « Aujourd'hui », « Demain », « Samedi 28 novembre »… */
export function relativeDay(iso, today = isoDay()) {
  if (iso === today) return t('Aujourd’hui')
  if (iso === addDays(today, 1)) return t('Demain')
  const date = new Date(`${iso}T12:00:00`)
  const sameYear = iso.slice(0, 4) === today.slice(0, 4)
  return date.toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long', ...(sameYear ? {} : { year: 'numeric' }) })
}

export function daysUntil(iso, today = isoDay()) {
  return Math.round((new Date(`${iso}T12:00:00`) - new Date(`${today}T12:00:00`)) / 86400000)
}
