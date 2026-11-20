import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const KIND_LABELS = { image: 'Images', video: 'Vidéos (liens)', audio: 'Audios' }
const ACCEPT = { image: 'image/jpeg,image/png,image/webp,image/gif', audio: 'audio/*' }

/** Médias rattachés à un élément (enseignement ou association). */
export default function Attachments({ config, parentId }) {
  const [items, setItems] = useState([])
  const [kind, setKind] = useState(config.kinds[0])
  const [files, setFiles] = useState([])
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    api(`/media-items/?${config.parentField}=${parentId}`)
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [config.parentField, parentId])

  useEffect(() => {
    load()
  }, [load])

  async function add(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (kind === 'video') {
        await api('/media-items/', {
          method: 'POST',
          body: { [config.parentField]: parentId, kind, url, caption, order: items.length },
        })
      } else {
        // Plusieurs fichiers d'un coup : un envoi par fichier.
        let order = items.length
        for (const file of files) {
          const body = new FormData()
          body.append(config.parentField, parentId)
          body.append('kind', kind)
          body.append('file', file)
          body.append('caption', files.length === 1 ? caption : '')
          body.append('order', String(order++))
          await api('/media-items/', { method: 'POST', body })
        }
      }
      setFiles([])
      setUrl('')
      setCaption('')
      event.target.reset()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(item) {
    if (!window.confirm('Retirer ce média ?')) return
    await api(`/media-items/${item.id}/`, { method: 'DELETE' })
    load()
  }

  async function saveCaption(item, value) {
    if (value === item.caption) return
    await api(`/media-items/${item.id}/`, { method: 'PATCH', body: { caption: value } })
    load()
  }

  return (
    <section className="border-t border-stone pt-4">
      <h3 className="font-serif text-xl">{config.title}</h3>
      {error ? <p className="mt-2 text-sm text-wine">{error}</p> : null}

      {config.kinds.map((k) => {
        const list = items.filter((item) => item.kind === k)
        if (!list.length) return null
        return (
          <div key={k} className="mt-3">
            <p className="text-xs tracking-[0.15em] text-wine uppercase">
              {KIND_LABELS[k]} ({list.length})
            </p>
            <ul className={`mt-2 grid gap-2 ${k === 'image' ? 'grid-cols-2 sm:grid-cols-4' : ''}`}>
              {list.map((item) => (
                <li key={item.id} className="border border-stone bg-cream p-2 text-sm">
                  {k === 'image' ? <img src={item.file} alt="" className="h-24 w-full object-cover" /> : null}
                  {k === 'audio' ? <audio controls preload="none" src={item.file} className="w-full" /> : null}
                  {k === 'video' ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="break-all text-wine underline">
                      {item.url}
                    </a>
                  ) : null}
                  <input
                    defaultValue={item.caption}
                    placeholder="Légende"
                    onBlur={(e) => saveCaption(item, e.target.value)}
                    className="mt-1 w-full border border-stone bg-white px-2 py-1 text-xs"
                  />
                  <button type="button" onClick={() => remove(item)} className="mt-1 text-xs text-wine underline">
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      <form onSubmit={add} className="mt-4 grid gap-2 border border-dashed border-gold/50 p-3 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end">
        {config.kinds.length > 1 ? (
          <label className="grid gap-1 text-xs">
            Type
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="border border-stone bg-white px-2 py-1.5 text-sm">
              {config.kinds.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span />
        )}
        {kind === 'video' ? (
          <label className="grid gap-1 text-xs">
            Lien de la vidéo
            <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtu.be/…" className="border border-stone bg-white px-2 py-1.5 text-sm" />
          </label>
        ) : (
          <label className="grid gap-1 text-xs">
            {kind === 'image' ? 'Une ou plusieurs images' : 'Fichier audio'}
            <input
              type="file"
              required
              multiple={kind === 'image'}
              accept={ACCEPT[kind]}
              onChange={(e) => setFiles([...e.target.files])}
              className="text-sm"
            />
          </label>
        )}
        <label className="grid gap-1 text-xs">
          Légende (facultative)
          <input value={caption} onChange={(e) => setCaption(e.target.value)} className="border border-stone bg-white px-2 py-1.5 text-sm" />
        </label>
        <button type="submit" disabled={busy} className="bg-wine px-4 py-2 text-sm text-cream disabled:opacity-60">
          {busy ? 'Envoi…' : 'Ajouter'}
        </button>
      </form>
    </section>
  )
}
