import { useEffect, useState } from 'react'
import { t } from '../i18n/index.jsx'

export function youtubeEmbed(url) {
  const match = (url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null
}

export function VideoEmbed({ url, title = 'Video' }) {
  const embed = youtubeEmbed(url)
  if (embed) {
    return (
      <iframe
        title={title}
        src={embed}
        loading="lazy"
        className="aspect-video w-full border-0"
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    )
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex border border-wine px-4 py-2 text-sm text-wine">
      {t("Voir la vidéo")}
    </a>
  )
}

/** Grille de photos ; un clic ouvre la photo en grand (flèches et Échap au clavier). */
export function PhotoGallery({ items }) {
  const [index, setIndex] = useState(null)
  const open = index !== null

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % items.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, items.length])

  if (!items.length) return null
  const current = open ? items[index] : null

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <button key={item.id || item.src} type="button" onClick={() => setIndex(i)} className="group overflow-hidden border border-gold/20 bg-white text-left">
            <img src={item.src} alt={item.caption || ''} loading="lazy" className="h-40 w-full object-cover transition group-hover:scale-105 sm:h-48" />
            {item.caption ? <span className="block px-2 py-1.5 text-xs text-muted">{item.caption}</span> : null}
          </button>
        ))}
      </div>
      {current ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/90 p-4" role="dialog" aria-modal="true" onClick={() => setIndex(null)}>
          <img src={current.src} alt={current.caption || ''} className="max-h-[80vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          {current.caption ? <p className="mt-3 text-center text-sm text-cream">{current.caption}</p> : null}
          <div className="mt-4 flex gap-3" onClick={(e) => e.stopPropagation()}>
            {items.length > 1 ? (
              <>
                <button type="button" className="border border-cream/50 px-3 py-1.5 text-sm text-cream" onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}>
                  {t("← Précédente")}
                </button>
                <button type="button" className="border border-cream/50 px-3 py-1.5 text-sm text-cream" onClick={() => setIndex((i) => (i + 1) % items.length)}>
                  {t("Suivante →")}
                </button>
              </>
            ) : null}
            <button type="button" className="border border-cream/50 px-3 py-1.5 text-sm text-cream" onClick={() => setIndex(null)}>
              {t("Fermer")}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

/** Initiales décoratives quand un groupe ou un enseignement n'a pas encore d'image. */
export function Placeholder({ label, className = '' }) {
  const initials = (label || '')
    .replace(/^(saint|sainte|plateforme|groupe|les?|la|amis du|amis de)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <div className={`flex items-center justify-center bg-wine font-serif text-gold-light ${className}`} aria-hidden="true">
      <span className="text-4xl">{initials || '✝'}</span>
    </div>
  )
}
