import { daysUntil, isOngoing, isoDay, relativeDay } from '../data/dates.js'
import { formatDateShort } from '../data/content.js'
import { t } from '../i18n/index.jsx'

function whenLabel(event, today) {
  if (isOngoing(event, today)) {
    if (event.dateEnd && event.dateEnd !== event.date) {
      return event.dateEnd === today
        ? t('Dernier jour aujourd’hui')
        : t('En cours jusqu’au {date}', { date: formatDateShort(event.dateEnd) })
    }
    return t('Aujourd’hui')
  }
  const label = relativeDay(event.date, today)
  const n = daysUntil(event.date, today)
  return n > 1 && n <= 6 ? `${label} · ${t('dans {n} jours', { n })}` : label
}

/** Liste d'événements groupés par période (voir groupUpcoming). */
export default function EventList({ groups, onSelect, compact = false }) {
  const today = isoDay()
  return (
    <div className="grid gap-6">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="text-xs tracking-[0.2em] text-wine uppercase">{group.label}</p>
          <ul className="mt-2 divide-y divide-gold/20 border border-gold/30 bg-white">
            {group.items.map((item) => {
              const content = (
                <>
                  {item.image && !compact ? <img src={item.image} alt="" className="h-16 w-16 shrink-0 object-cover" loading="lazy" /> : null}
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm ${group.id === 'today' ? 'font-medium text-wine' : 'text-muted'} first-letter:uppercase`}>
                      {whenLabel(item, today)}
                      {item.time ? ` · ${item.time}` : ''}
                    </span>
                    <span className="mt-0.5 block font-medium">{item.title}</span>
                    {item.audience || item.place ? (
                      <span className="mt-0.5 block text-sm text-muted">{[item.audience, item.place].filter(Boolean).join(' · ')}</span>
                    ) : null}
                  </span>
                </>
              )
              return (
                <li key={item.id || `${item.date}-${item.title}`}>
                  {onSelect ? (
                    <button type="button" onClick={() => onSelect(item)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-cream">
                      {content}
                    </button>
                  ) : (
                    <div className="flex items-start gap-3 px-4 py-3">{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
