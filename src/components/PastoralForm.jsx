import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { parish } from '../data/content.js'
import { Card } from './Layout.jsx'

export default function PastoralForm({
  fields,
  submitLabel,
  successTitle,
  successText,
  notice,
  storageKey,
  whatsappHref,
  sensitiveNotice = true,
  onSubmitExtra,
}) {
  const initial = Object.fromEntries(fields.map((field) => [field.name, '']))
  const [form, setForm] = useState(initial)
  const [sent, setSent] = useState(false)

  function onSubmit(event) {
    event.preventDefault()
    const payload = {
      ...form,
      at: new Date().toISOString(),
      published: false,
    }
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]')
    localStorage.setItem(storageKey, JSON.stringify([payload, ...existing]))
    onSubmitExtra?.(payload)
    setSent(true)
  }

  if (sent) {
    return (
      <Card className="bg-wine text-cream">
        <h3 className="font-serif text-2xl">{successTitle}</h3>
        <p className="mt-3 text-cream/80">
          {successText ||
            'Votre demande est enregistrée pour l’équipe pastorale. Le secrétariat la reprendra dès que le canal officiel (courriel ou WhatsApp) sera publié.'}
        </p>
        {whatsappHref || parish.whatsapp ? (
          <a href={whatsappHref || parish.whatsapp} className="mt-6 inline-flex border border-cream px-4 py-2 text-sm uppercase">
            Continuer sur WhatsApp
          </a>
        ) : (
          <NavLink to="/contact" className="mt-6 inline-flex border border-cream px-4 py-2 text-sm uppercase">
            Voir le contact
          </NavLink>
        )}
      </Card>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 border border-gold/30 bg-white p-5 sm:p-6">
      {fields.map((field) => (
        <label key={field.name} className="grid gap-1 text-sm">
          {field.label}
          {field.type === 'textarea' ? (
            <textarea
              required={field.required}
              rows={field.rows || 4}
              value={form[field.name]}
              onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))}
              className="border border-stone bg-cream px-3 py-2"
            />
          ) : field.type === 'select' ? (
            <select
              required={field.required}
              value={form[field.name]}
              onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))}
              className="border border-stone bg-cream px-3 py-2"
            >
              <option value="">Choisir</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              required={field.required}
              type={field.type || 'text'}
              value={form[field.name]}
              onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))}
              className="border border-stone bg-cream px-3 py-2"
            />
          )}
        </label>
      ))}
      {notice ? <p className="text-xs text-muted">{notice}</p> : null}
      {sensitiveNotice ? (
        <p className="text-xs text-muted">
          Les informations sensibles ne sont jamais publiées automatiquement. Elles restent réservées à l’équipe
          pastorale.
        </p>
      ) : null}
      <button type="submit" className="bg-wine px-5 py-3 text-sm tracking-wide text-cream uppercase">
        {submitLabel}
      </button>
    </form>
  )
}
