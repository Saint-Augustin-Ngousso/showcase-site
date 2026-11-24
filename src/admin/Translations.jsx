import { useState } from 'react'
import { FieldInput } from './fields.jsx'

/**
 * Version anglaise d'un élément : mêmes champs texte, stockés dans `i18n.en`.
 * Un champ laissé vide s'affiche en français dans la version anglaise du site.
 */
export default function Translations({ fields, names, value, onChange }) {
  const en = value?.en || {}
  const filled = names.filter((name) => {
    const v = en[name]
    return Array.isArray(v) ? v.length : Boolean(v)
  }).length
  const [open, setOpen] = useState(filled > 0)

  function update(name, text) {
    onChange({ ...(value || {}), en: { ...en, [name]: text } })
  }

  return (
    <fieldset className="border border-dashed border-gold/60 bg-cream/60">
      <legend className="px-2">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-sm font-medium text-wine">
          <span aria-hidden="true">{open ? '▾' : '▸'}</span>
          English version (facultatif)
          <span className="text-xs font-normal text-muted">
            {filled}/{names.length} champ{names.length > 1 ? 's' : ''} traduit{filled > 1 ? 's' : ''}
          </span>
        </button>
      </legend>
      {open ? (
        <div className="grid gap-4 p-4 pt-2">
          <p className="text-xs text-muted">
            Ce qui reste vide s’affiche en français dans la version anglaise du site. Les noms propres (personnes, CEV,
            associations) ne se traduisent pas.
          </p>
          {names.map((name) => {
            const base = fields.find((f) => f.name === name)
            if (!base) return null
            const field = { ...base, required: false, help: undefined, type: base.type === 'select' ? 'text' : base.type }
            return (
              <label key={name} className="grid gap-1 text-sm">
                <span>
                  {base.label} <span className="text-xs text-muted">— EN</span>
                </span>
                <FieldInput field={field} value={en[name] ?? (field.type === 'lines' ? [] : '')} onChange={(v) => update(name, v)} />
              </label>
            )
          })}
        </div>
      ) : null}
    </fieldset>
  )
}

/** Nettoie les traductions avant envoi (lignes vides, champs vides). */
export function cleanI18n(value) {
  const en = {}
  for (const [key, v] of Object.entries(value?.en || {})) {
    const clean = Array.isArray(v) ? v.map((x) => x.trim()).filter(Boolean) : (v || '').trim()
    if (Array.isArray(clean) ? clean.length : clean) en[key] = clean
  }
  return { en }
}
