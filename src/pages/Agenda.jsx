import { useMemo, useState } from 'react'
import { eventOnDay, events, formatDateShort, news, upcomingEvents } from '../data/content.js'
import { Card, PageHero, Section } from '../components/Layout.jsx'

function downloadIcs(event) {
  const day = event.date.replaceAll('-', '')
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:${day}\nSUMMARY:${event.title}\nLOCATION:${event.place}\nDESCRIPTION:${event.audience || ''} — ${event.place}\nEND:VEVENT\nEND:VCALENDAR`
  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title}.ics`
  link.click()
  URL.revokeObjectURL(url)
}

export default function Agenda() {
  const upcoming = upcomingEvents()
  const [month, setMonth] = useState(new Date(2026, 10, 1))
  const days = useMemo(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1)
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const pad = (start.getDay() + 6) % 7
    return { pad, count: end.getDate(), label: month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }
  }, [month])
  const [selected, setSelected] = useState(upcoming[0] || events[0])

  function shiftMonth(delta) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  return (
    <>
      <PageHero kicker="Vie de la paroisse" title="Agenda et actualités">
        Lancement de l’année, récollections par métier, activités des jeunes et annonces de la semaine.
      </PageHero>

      <Section eyebrow="Annonces" title="En ce moment">
        <div className="grid gap-4 md:grid-cols-2">
          {news.map((item) => (
            <Card key={item.slug} className={item.image ? 'overflow-hidden !p-0 sm:!p-0' : ''}>
              {item.image ? (
                <img src={item.image} alt="" className="h-44 w-full object-cover" loading="lazy" />
              ) : null}
              <div className={item.image ? 'p-5' : ''}>
                <p className="text-xs tracking-[0.2em] text-wine uppercase">
                  {item.category} · {formatDateShort(item.date)}
                </p>
                <h2 className="font-serif mt-2 text-2xl">{item.title}</h2>
                <p className="mt-3 text-muted">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="stone" title="Calendrier">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button type="button" className="border border-wine px-3 py-2 text-sm text-wine" onClick={() => shiftMonth(-1)}>
            Mois précédent
          </button>
          <p className="font-serif text-2xl capitalize sm:text-3xl">{days.label}</p>
          <button type="button" className="border border-wine px-3 py-2 text-sm text-wine" onClick={() => shiftMonth(1)}>
            Mois suivant
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase text-muted">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="py-2">{day}</div>
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
                className={`min-h-14 border border-stone p-1 text-left ${dayEvents.length ? 'bg-wine text-cream' : 'bg-white'}`}
              >
                <span className="block text-sm">{day}</span>
                {dayEvents[0] ? <span className="mt-1 block text-[10px] leading-tight">{dayEvents[0].title}</span> : null}
              </button>
            )
          })}
        </div>

        {selected ? (
          <Card className="mt-8">
            <p className="text-xs tracking-[0.2em] text-wine uppercase">
              {formatDateShort(selected.date)}
              {selected.dateEnd ? ` — ${formatDateShort(selected.dateEnd)}` : ''}
            </p>
            <h2 className="font-serif mt-2 text-3xl">{selected.title}</h2>
            <p className="mt-2 text-muted">
              {selected.audience}
              {selected.place ? ` · ${selected.place}` : ''}
              {selected.time ? ` · ${selected.time}` : ''}
            </p>
            <button type="button" className="mt-5 bg-wine px-4 py-2 text-sm text-cream uppercase" onClick={() => downloadIcs(selected)}>
              Ajouter à mon calendrier
            </button>
          </Card>
        ) : null}
      </Section>

      <Section title="Récollections par métier">
        <ul className="divide-y divide-gold/20 border border-gold/30 bg-white">
          {events.map((item) => (
            <li key={`${item.date}-${item.title}`} className="grid gap-1 px-4 py-3 sm:grid-cols-3">
              <span className="text-sm text-muted">
                {formatDateShort(item.date)}
                {item.dateEnd ? ` — ${formatDateShort(item.dateEnd)}` : ''}
              </span>
              <span className="font-medium sm:col-span-2">
                {item.title}
                <span className="mt-1 block text-sm font-normal text-muted">{item.audience}{item.place ? ` · ${item.place}` : ''}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
