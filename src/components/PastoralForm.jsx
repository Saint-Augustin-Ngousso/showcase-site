import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { useSite } from '../data/SiteContext.jsx'
import { api } from '../lib/api.js'
import { Card } from './Layout.jsx'
import { t } from '../i18n/index.jsx'

/**
 * Formulaire public envoyé au backend.
 * - `endpoint` : chemin de l'API (ex. '/requests/')
 * - `toPayload(form)` : transforme les champs saisis en corps de requête
 */
export default function PastoralForm({
  fields,
  submitLabel,
  successTitle,
  successText,
  notice,
  endpoint,
  toPayload = (form) => form,
  whatsappHref,
  sensitiveNotice = true,
  onSent,
  initialValues = {},
}) {
  const { parish } = useSite()
  const { user } = useAuth()
  const initial = Object.fromEntries(
    fields.map((field) => [
      field.name,
      initialValues[field.name] ?? (field.type === 'checkbox' ? Boolean(field.defaultChecked) : field.name === 'prenom' && user ? user.first_name || user.name : ''),
    ]),
  )
  const [form, setForm] = useState(initial)
  const [website, setWebsite] = useState('')
  const [state, setState] = useState({ sending: false, sent: false, error: '' })

  async function onSubmit(event) {
    event.preventDefault()
    setState({ sending: true, sent: false, error: '' })
    try {
      const result = await api(endpoint, { method: 'POST', body: { ...toPayload(form), website } })
      setState({ sending: false, sent: true, error: '' })
      onSent?.(result, form)
    } catch (error) {
      setState({
        sending: false,
        sent: false,
        error:
          error.status === 429
            ? t('Trop d’envois depuis cette connexion. Réessayez dans un moment.')
            : error.status
              ? error.message
              : t('Le serveur de la paroisse est injoignable. Vérifiez votre connexion et réessayez.'),
      })
    }
  }

  const whatsapp = whatsappHref || parish.whatsapp

  if (state.sent) {
    return (
      <Card className="bg-wine text-cream">
        <h3 className="font-serif text-2xl">{successTitle}</h3>
        <p className="mt-3 text-cream/80">
          {successText || t('Votre demande est bien arrivée à l’équipe pastorale. Le secrétariat vous recontactera.')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex border border-cream px-4 py-2 text-sm uppercase"
            onClick={() => {
              setForm(initial)
              setState({ sending: false, sent: false, error: '' })
            }}
          >
            {t("Nouvel envoi")}
          </button>
          {whatsapp ? (
            <a href={whatsapp} className="inline-flex border border-cream px-4 py-2 text-sm uppercase">
              {t("Continuer sur WhatsApp")}
            </a>
          ) : (
            <NavLink to="/contact" className="inline-flex border border-cream px-4 py-2 text-sm uppercase">
              {t("Voir le contact")}
            </NavLink>
          )}
        </div>
      </Card>
    )
  }

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  return (
    <form onSubmit={onSubmit} className="grid gap-4 border border-gold/30 bg-white p-5 sm:p-6">
      {/* Champ piège invisible : les robots le remplissent, les humains ne le voient pas. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      {fields.map((field) =>
        field.type === 'checkbox' ? (
          <label key={field.name} className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form[field.name])}
              onChange={(e) => update(field.name, e.target.checked)}
              className="mt-1 h-4 w-4 accent-wine"
            />
            <span>
              {t(field.label)}
              {field.help ? <span className="mt-0.5 block text-xs text-muted">{t(field.help)}</span> : null}
            </span>
          </label>
        ) : (
          <label key={field.name} className="grid gap-1 text-sm">
            {t(field.label)}
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                rows={field.rows || 4}
                maxLength={3000}
                value={form[field.name]}
                onChange={(e) => update(field.name, e.target.value)}
                className="border border-stone bg-cream px-3 py-2"
              />
            ) : field.type === 'select' ? (
              <select
                required={field.required}
                value={form[field.name]}
                onChange={(e) => update(field.name, e.target.value)}
                className="border border-stone bg-cream px-3 py-2"
              >
                <option value="">{t("Choisir")}</option>
                {field.options.map((option) => {
                  const value = typeof option === 'string' ? option : option.value
                  const label = t(typeof option === 'string' ? option : option.label)
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                })}
              </select>
            ) : (
              <input
                required={field.required}
                type={field.type || 'text'}
                maxLength={200}
                value={form[field.name]}
                onChange={(e) => update(field.name, e.target.value)}
                className="border border-stone bg-cream px-3 py-2"
              />
            )}
          </label>
        ),
      )}
      {notice ? <p className="text-xs text-muted">{notice}</p> : null}
      {sensitiveNotice ? (
        <p className="text-xs text-muted">
          {t("Les informations sensibles ne sont jamais publiées. Elles restent réservées à l’équipe pastorale.")}
        </p>
      ) : null}
      {state.error ? <p className="border border-wine/40 bg-wine/5 px-3 py-2 text-sm text-wine">{state.error}</p> : null}
      <button
        type="submit"
        disabled={state.sending}
        className="bg-wine px-5 py-3 text-sm tracking-wide text-cream uppercase disabled:opacity-60"
      >
        {state.sending ? t('Envoi…') : submitLabel}
      </button>
    </form>
  )
}
