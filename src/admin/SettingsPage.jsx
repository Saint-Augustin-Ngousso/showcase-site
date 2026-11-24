import { useEffect, useState } from 'react'
import { useSite } from '../data/SiteContext.jsx'
import { api } from '../lib/api.js'
import { FieldRow, buildBody } from './fields.jsx'
import Translations, { cleanI18n } from './Translations.jsx'

const TRANSLATE = [
  'diocese', 'worship_places', 'theme_parish', 'theme_diocesan', 'slogan', 'year_label', 'objective', 'cure_word',
  'zone', 'landmark', 'transport', 'office_hours', 'church_open', 'donations_intro', 'choirs_note',
]

const f = (name, label, type = 'text', extra = {}) => ({ name, label, type, ...extra })

const SECTIONS = [
  {
    title: 'Identité',
    fields: [
      f('full_name', 'Nom complet'),
      f('name', 'Nom court (en-tête)'),
      f('place', 'Lieu'),
      f('diocese', 'Diocèse'),
      f('zone', 'Zone pastorale'),
      f('worship_places', 'Lieux de culte (un par ligne)', 'lines', { rows: 3 }),
      f('logo', 'Logo ou armoiries', 'image'),
      f('hero_image', 'Image de fond de l’accueil', 'image', {
        help: 'Photo affichée en grand en haut de la page d’accueil (par défaut : l’église et son clocher).',
      }),
    ],
  },
  {
    title: 'Année pastorale',
    fields: [
      f('year_label', 'Libellé de l’année', 'text', { help: 'Ex. : Année pastorale 2026-2027' }),
      f('theme_parish', 'Thème paroissial'),
      f('theme_diocesan', 'Thème diocésain'),
      f('slogan', 'Slogan'),
      f('launch_date', 'Date de lancement', 'date'),
      f('objective', 'Objectif général', 'textarea'),
    ],
  },
  {
    title: 'Textes',
    fields: [
      f('cure_word', 'Mot du curé (page d’accueil)', 'textarea', { rows: 6 }),
      f('donations_intro', 'Introduction de la rubrique dons', 'textarea'),
    ],
  },
  {
    title: 'Contact et accès',
    fields: [
      f('address', 'Adresse'),
      f('landmark', 'Repère d’accès'),
      f('transport', 'Comment venir', 'textarea'),
      f('maps_query', 'Recherche Google Maps', 'text', { help: 'Utilisée si la latitude et la longitude ne sont pas renseignées.' }),
      f('latitude', 'Latitude (point GPS)', 'text', { help: 'Ex. : 3.8920' }),
      f('longitude', 'Longitude (point GPS)', 'text', { help: 'Ex. : 11.5440' }),
      f('phone', 'Téléphone du secrétariat'),
      f('email', 'Courriel', 'email'),
      f('office_hours', 'Horaires du secrétariat'),
      f('church_open', 'Ouverture de l’église'),
      f('whatsapp_number', 'Numéro WhatsApp', 'text', { help: 'Format international sans + ni espace. Ex. : 237690000000' }),
    ],
  },
  {
    title: 'Réseaux sociaux',
    fields: [f('facebook', 'Page Facebook', 'url'), f('youtube', 'Chaîne YouTube', 'url'), f('instagram', 'Instagram', 'url'), f('tiktok', 'TikTok', 'url')],
  },
  {
    title: 'Mouvements',
    fields: [
      f('youth_chaplain', 'Aumônier des jeunes'),
      f('choirs_chaplain', 'Aumônier des chorales'),
      f('choirs_note', 'Note sur les chorales (si aucune chorale saisie)', 'textarea'),
    ],
  },
]

const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields)

export default function SettingsPage() {
  const { reload } = useSite()
  const [initial, setInitial] = useState(null)
  const [form, setForm] = useState({})
  const [state, setState] = useState({ saving: false, message: '', error: '' })

  useEffect(() => {
    api('/settings/')
      .then((data) => {
        setInitial(data)
        setForm({ ...Object.fromEntries(ALL_FIELDS.map((fld) => [fld.name, data[fld.name] ?? ''])), i18n: data.i18n || { en: {} } })
      })
      .catch((err) => setState((s) => ({ ...s, error: err.message })))
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    setState({ saving: true, message: '', error: '' })
    try {
      const values = { ...form }
      for (const key of ['latitude', 'longitude']) values[key] = values[key] === '' ? null : values[key]
      const body = buildBody(ALL_FIELDS, values, initial)
      const i18n = cleanI18n(form.i18n)
      if (body instanceof FormData) body.append('i18n', JSON.stringify(i18n))
      else body.i18n = i18n
      const data = await api('/settings/', { method: 'PATCH', body })
      setInitial(data)
      setForm({ ...Object.fromEntries(ALL_FIELDS.map((fld) => [fld.name, data[fld.name] ?? ''])), i18n: data.i18n || { en: {} } })
      setState({ saving: false, message: 'Fiche enregistrée. Le site est à jour.', error: '' })
      reload()
    } catch (err) {
      setState({ saving: false, message: '', error: err.message })
    }
  }

  if (!initial) return <p className="text-muted">{state.error || 'Chargement…'}</p>

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <h1 className="font-serif text-3xl">Fiche de la paroisse</h1>
      <p className="mt-2 text-sm text-muted">Les champs laissés vides affichent « à préciser » sur le site.</p>
      {SECTIONS.map((section) => (
        <fieldset key={section.title} className="mt-6 grid gap-4 border border-gold/30 bg-white p-5">
          <legend className="px-2 font-serif text-xl text-wine">{section.title}</legend>
          {section.fields.map((fld) => (
            <FieldRow key={fld.name} field={fld} value={form[fld.name]} onChange={(value) => setForm((cur) => ({ ...cur, [fld.name]: value }))} />
          ))}
        </fieldset>
      ))}
      <div className="mt-6">
        <Translations
          fields={ALL_FIELDS}
          names={TRANSLATE}
          value={form.i18n}
          onChange={(i18n) => setForm((cur) => ({ ...cur, i18n }))}
        />
      </div>
      <div className="sticky bottom-0 mt-6 flex items-center gap-3 border-t border-gold/30 bg-cream py-3">
        <button type="submit" disabled={state.saving} className="bg-wine px-5 py-2 text-sm text-cream disabled:opacity-60">
          {state.saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {state.message ? <span className="text-sm">{state.message}</span> : null}
        {state.error ? <span className="text-sm text-wine">{state.error}</span> : null}
      </div>
    </form>
  )
}
