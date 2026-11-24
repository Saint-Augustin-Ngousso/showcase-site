import { useMemo, useRef, useState } from 'react'
import { formatDateShort } from '../data/content.js'
import { groupUpcoming, isoDay } from '../data/dates.js'
import { useSite } from '../data/SiteContext.jsx'
import EventList from '../components/EventList.jsx'
import { Card, ComingSoon, PageHero, Section } from '../components/Layout.jsx'
import { locale, t } from '../i18n/index.jsx'

function icsEscape(value) {
  return String(value || '').replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
}

function downloadIcs(event) {
  const start = event.date.replaceAll('-', '')
  const endDate = new Date(`${event.dateEnd || event.date}T12:00:00`)
  endDate.setDate(endDate.getDate() + 1)
  const end = endDate.toISOString().slice(0, 10).replaceAll('-', '')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Paroisse Saint Augustin de Ngousso//Agenda//FR',
    'BEGIN:VEVENT',
    `UID:${event.id || start}-${start}@paroisse-ngousso`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `LOCATION:${icsEscape(event.place)}`,
    `DESCRIPTION:${icsEscape([event.audience, event.time, event.description].filter(Boolean).join(' — '))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title}.ics`
  link.click()
  URL.revokeObjectURL(url)
}

const FILTERS = [
  { id: '', label: 'Tout' }, // libellés traduits au rendu
  { id: 'paroisse', label: 'Paroisse' },
  { id: 'recollection', label: 'Récollections' },
  { id: 'jeunes', label: 'Jeunes' },
  { id: 'secteur', label: 'Secteurs' },
  { id: 'liturgie', label: 'Liturgie' },
]

export default function Agenda() {
  const { events, news, upcomingEvents, eventOnDay } = useSite()
  const upcoming = upcomingEvents()
  const [month, setMonth] = useState(() => {
    const first = upcoming[0] ? new Date(`${upcoming[0].date}T12:00:00`) : new Date()
    const now = new Date()
    const base = first > now ? now : first
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })
  const [filter, setFilter] = useState('')
  const [showPast, setShowPast] = useState(false)
  const days = useMemo(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1)
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const pad = (start.getDay() + 6) % 7
    return { pad, count: end.getDate(), label: month.toLocaleDateString(locale(), { month: 'long', year: 'numeric' }) }
  }, [month])
  const [selected, setSelected] = useState(upcoming[0] || events[0])
  const today = isoDay()
  const detailRef = useRef(null)
  const filtered = (showPast ? events : upcoming).filter((item) => !filter || item.category === filter)
  const groups = showPast
    ? [{ id: 'all', label: t('Toute l’année pastorale'), items: filtered }]
    : groupUpcoming(filtered, today)

  function choose(event) {
    setSelected(event)
    const d = new Date(`${event.date}T12:00:00`)
    setMonth(new Date(d.getFullYear(), d.getMonth(), 1))
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  function shiftMonth(delta) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  return (
    <>
      <PageHero kicker={t("Vie de la paroisse")} title={t("Agenda et actualités")}>
        {t("Lancement de l’année, récollections par métier, activités des jeunes et annonces de la semaine.")}
      </PageHero>

      <Section eyebrow={t("Annonces")} title={t("En ce moment")}>
        {news.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((item) => (
              <Card key={item.slug} className={item.image ? 'overflow-hidden !p-0 sm:!p-0' : ''}>
                {item.image ? <img src={item.image} alt="" className="h-44 w-full object-cover" loading="lazy" /> : null}
                <div className={item.image ? 'p-5' : ''}>
                  <p className="text-xs tracking-[0.2em] text-wine uppercase">
                    {item.pinned ? `${t('À la une')} · ` : ''}
                    {item.category ? `${item.category} · ` : ''}
                    {formatDateShort(item.date)}
                  </p>
                  <h2 className="font-serif mt-2 text-2xl">{item.title}</h2>
                  <p className="mt-3 whitespace-pre-line text-muted">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <ComingSoon>{t("Les annonces de la semaine seront publiées ici.")}</ComingSoon>
        )}
      </Section>

      <Section tone="stone" title={t("Calendrier")}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <button type="button" className="border border-wine px-3 py-2 text-sm text-wine" onClick={() => shiftMonth(-1)}>
            {t("Mois précédent")}
          </button>
          <p className="font-serif text-2xl capitalize sm:text-3xl">{days.label}</p>
          <button type="button" className="border border-wine px-3 py-2 text-sm text-wine" onClick={() => shiftMonth(1)}>
            {t("Mois suivant")}
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase text-muted">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => t(d)).map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: days.pad }).map((_, index) => (
            <div key={`pad-${index}`} />
          ))}
          {Array.from({ length: days.count }).map((_, index) => {
            const day = index + 1
            const iso = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayEvents = eventOnDay(iso)
            return (
              <button
                key={iso}
                type="button"
                onClick={() => dayEvents[0] && setSelected(dayEvents[0])}
                className={`min-h-14 border p-1 text-left ${dayEvents.length ? 'bg-wine text-cream' : 'bg-white'} ${
                  iso === today ? 'border-gold ring-2 ring-gold' : 'border-stone'
                } ${iso < today && !dayEvents.length ? 'text-muted/60' : ''}`}
                aria-current={iso === today ? 'date' : undefined}
              >
                <span className="block text-sm">
                  {day}
                  {iso === today ? <span className="ml-1 text-[9px] uppercase">{t("auj.")}</span> : null}
                </span>
                {dayEvents[0] ? <span className="mt-1 block text-[10px] leading-tight normal-case">{dayEvents[0].title}</span> : null}
              </button>
            )
          })}
        </div>

        {selected ? (
          <div ref={detailRef}>
          <Card className="mt-8">
            {selected.image ? <img src={selected.image} alt="" className="mb-4 max-h-80 w-full object-cover" loading="lazy" /> : null}
            <p className="text-xs tracking-[0.2em] text-wine uppercase">
              {formatDateShort(selected.date)}
              {selected.dateEnd ? ` — ${formatDateShort(selected.dateEnd)}` : ''}
            </p>
            <h2 className="font-serif mt-2 text-3xl">{selected.title}</h2>
            <p className="mt-2 text-muted">
              {[selected.audience, selected.place, selected.time].filter(Boolean).join(' · ')}
            </p>
            {selected.description ? <p className="mt-3 whitespace-pre-line text-muted">{selected.description}</p> : null}
            <button type="button" className="mt-5 bg-wine px-4 py-2 text-sm text-cream uppercase" onClick={() => downloadIcs(selected)}>
              {t("Ajouter à mon calendrier")}
            </button>
          </Card>
          </div>
        ) : null}
      </Section>

      <Section title={t("Les rendez-vous")}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`border px-3 py-1.5 text-xs uppercase ${filter === item.id ? 'border-wine bg-wine text-cream' : 'border-wine/30 text-wine'}`}
            >
              {t(item.label)}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="accent-wine" />
            {t("Afficher les dates passées")}
          </label>
        </div>
        {groups.length ? (
          <EventList groups={groups} onSelect={choose} />
        ) : (
          <ComingSoon>{t("Aucun rendez-vous à venir dans cette catégorie.")}</ComingSoon>
        )}
      </Section>
    </>
  )
}
