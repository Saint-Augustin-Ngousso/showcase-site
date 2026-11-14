import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const fkCache = {}

function useOptions(endpoint) {
  const [options, setOptions] = useState(fkCache[endpoint] || [])
  useEffect(() => {
    if (!endpoint) return
    api(endpoint)
      .then((rows) => {
        fkCache[endpoint] = rows
        setOptions(rows)
      })
      .catch(() => {})
  }, [endpoint])
  return options
}

const inputClass = 'w-full border border-stone bg-white px-3 py-2 text-sm focus:border-wine focus:outline-none'

export function FieldInput({ field, value, onChange }) {
  const options = useOptions(field.type === 'fk' ? field.endpoint : null)

  switch (field.type) {
    case 'textarea':
      return (
        <textarea rows={field.rows || 4} required={field.required} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )
    case 'lines':
      return (
        <textarea
          rows={field.rows || 5}
          value={Array.isArray(value) ? value.join('\n') : value || ''}
          onChange={(e) => onChange(e.target.value.split('\n'))}
          className={inputClass}
        />
      )
    case 'number':
      return <input type="number" value={value ?? 0} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} className={inputClass} />
    case 'bool':
      return (
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-wine" />
      )
    case 'date':
      return <input type="date" required={field.required} value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    case 'select':
      return (
        <select required={field.required} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          <option value="">—</option>
          {field.options.map(([optValue, label]) => (
            <option key={optValue} value={optValue}>
              {label}
            </option>
          ))}
        </select>
      )
    case 'fk':
      return (
        <select required={field.required} value={value ?? ''} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)} className={inputClass}>
          <option value="">—</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt[field.labelKey] || opt.id}
            </option>
          ))}
        </select>
      )
    case 'image':
    case 'file': {
      const isFile = value instanceof File
      const current = !isFile && typeof value === 'string' ? value : ''
      return (
        <div className="grid gap-2">
          {field.type === 'image' && (current || isFile) ? (
            <img src={isFile ? URL.createObjectURL(value) : current} alt="" className="h-28 w-40 border border-stone object-cover" />
          ) : null}
          {field.type === 'file' && current ? (
            <a href={current} target="_blank" rel="noreferrer" className="text-sm text-wine underline">
              Fichier actuel
            </a>
          ) : null}
          <input
            type="file"
            accept={field.accept || (field.type === 'image' ? 'image/*' : undefined)}
            onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
            className="text-sm"
          />
          {current ? (
            <button type="button" onClick={() => onChange(null)} className="w-fit text-xs text-wine underline">
              Retirer le fichier
            </button>
          ) : null}
        </div>
      )
    }
    default:
      return (
        <input
          type={field.type === 'url' || field.type === 'email' ? field.type : 'text'}
          required={field.required}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )
  }
}

/** Corps de requête : JSON, ou FormData si un fichier est joint ou retiré. */
export function buildBody(fields, form, initial = {}) {
  const fileFields = fields.filter((fld) => fld.type === 'image' || fld.type === 'file')
  const hasFileChange = fileFields.some((fld) => form[fld.name] instanceof File || (form[fld.name] === null && initial[fld.name]))
  const values = {}
  for (const fld of fields) {
    let value = form[fld.name]
    if (fld.type === 'lines') value = (value || []).map((line) => line.trim()).filter(Boolean)
    if ((fld.type === 'date' || fld.type === 'fk') && value === '') value = null
    if (fld.type === 'image' || fld.type === 'file') continue
    values[fld.name] = value
  }
  if (!hasFileChange) return values

  const data = new FormData()
  for (const [key, value] of Object.entries(values)) {
    if (value === null || value === undefined) data.append(key, '')
    else if (typeof value === 'object') data.append(key, JSON.stringify(value))
    else data.append(key, String(value))
  }
  for (const fld of fileFields) {
    if (form[fld.name] instanceof File) data.append(fld.name, form[fld.name])
    else if (form[fld.name] === null && initial[fld.name]) data.append(`${fld.name}__clear`, 'true')
  }
  return data
}

export function emptyForm(fields) {
  return Object.fromEntries(
    fields.map((fld) => [
      fld.name,
      fld.default ?? (fld.type === 'bool' ? false : fld.type === 'number' ? 0 : fld.type === 'lines' ? [] : fld.type === 'fk' ? null : ''),
    ]),
  )
}

export function FieldRow({ field, value, onChange }) {
  return (
    <label className={`grid gap-1 text-sm ${field.type === 'bool' ? 'grid-cols-[auto_1fr] items-center gap-3' : ''}`}>
      {field.type === 'bool' ? <FieldInput field={field} value={value} onChange={onChange} /> : null}
      <span className="font-medium">
        {field.label}
        {field.required ? <span className="text-wine"> *</span> : null}
      </span>
      {field.type !== 'bool' ? <FieldInput field={field} value={value} onChange={onChange} /> : null}
      {field.help ? <span className="text-xs text-muted">{field.help}</span> : null}
    </label>
  )
}
