import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { useSite } from '../data/SiteContext.jsx'
import { api } from '../lib/api.js'
import { COLUMN_LABELS, RESOURCE_BY_KEY } from './resources.js'
import { FieldRow, buildBody, emptyForm } from './fields.jsx'
import Attachments from './Attachments.jsx'
import Translations, { cleanI18n } from './Translations.jsx'

export const STATUS = {
  draft: { label: 'Brouillon', className: 'bg-stone text-muted' },
  pending: { label: 'En attente', className: 'bg-gold-light text-wine-dark' },
  published: { label: 'Publié', className: 'bg-wine text-cream' },
}

export function StatusBadge({ status }) {
  const info = STATUS[status] || { label: status, className: 'bg-stone' }
  return <span className={`inline-block px-2 py-0.5 text-[11px] uppercase ${info.className}`}>{info.label}</span>
}

function cellValue(resource, row, column, fkLabels) {
  const value = row[column]
  if (column === 'status') return <StatusBadge status={value} />
  if (typeof value === 'boolean') return value ? 'Oui' : '—'
  const field = resource.fields.find((fld) => fld.name === column)
  if (field?.type === 'image' && value) return <img src={value} alt="" className="h-10 w-14 object-cover" />
  if (field?.type === 'select') return field.options.find(([v]) => v === value)?.[1] || value
  if (field?.type === 'fk') return fkLabels[column]?.[value] || '—'
  if (column === 'created_at' && value) return new Date(value).toLocaleDateString('fr-FR')
  if (field?.type === 'date' && value) return new Date(`${value}T12:00:00`).toLocaleDateString('fr-FR')
  if (Array.isArray(value)) return value.join(', ')
  const text = value === null || value === undefined || value === '' ? '—' : String(value)
  return text.length > 80 ? `${text.slice(0, 80)}…` : text
}

export default function ResourceManager() {
  const { resourceKey } = useParams()
  const resource = RESOURCE_BY_KEY[resourceKey]
  const { hasRole } = useAuth()
  const { reload: reloadSite } = useSite()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | row
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [fkFilter, setFkFilter] = useState('')
  const [search, setSearch] = useState('')
  const [fkLabels, setFkLabels] = useState({})

  const canWrite = resource && hasRole(resource.writeRole || resource.role)
  const clergy = hasRole('pretre')

  const load = useCallback(() => {
    if (!resource) return
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (fkFilter && resource.filterBy) params.set(resource.filterBy, fkFilter)
    api(`${resource.endpoint}${params.toString() ? `?${params}` : ''}`)
      .then((data) => {
        setRows(data)
        setError('')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [resource, statusFilter, fkFilter])

  useEffect(() => {
    setEditing(null)
    setStatusFilter('')
    setFkFilter('')
    setSearch('')
    setNotice('')
  }, [resourceKey])

  useEffect(() => {
    load()
  }, [load])

  // Libellés des clés étrangères (ex. : nom du secteur d'une CEV).
  useEffect(() => {
    if (!resource) return
    resource.fields
      .filter((fld) => fld.type === 'fk')
      .forEach((fld) => {
        api(fld.endpoint)
          .then((options) =>
            setFkLabels((current) => ({
              ...current,
              [fld.name]: Object.fromEntries(options.map((o) => [o.id, o[fld.labelKey]])),
            })),
          )
          .catch(() => {})
      })
  }, [resource])

  const visibleRows = useMemo(() => {
    if (!search.trim()) return rows
    const needle = search.toLowerCase()
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(needle))
  }, [rows, search])

  if (!resource) return <Navigate to="/espace" replace />
  if (!hasRole(resource.role)) return <Navigate to="/espace" replace />

  function startCreate() {
    const initial = emptyForm(resource.fields)
    if (resource.translate) initial.i18n = { en: {} }
    if (resource.filterBy && fkFilter) initial[resource.filterBy] = Number(fkFilter)
    setForm(initial)
    setEditing('new')
    setNotice('')
  }

  function startEdit(row) {
    const values = {}
    for (const fld of resource.fields) values[fld.name] = row[fld.name] ?? emptyForm([fld])[fld.name]
    if (resource.translate) values.i18n = row.i18n || { en: {} }
    setForm(values)
    setEditing(row)
    setNotice('')
  }

  function done(message) {
    setNotice(message)
    setEditing(null)
    load()
    reloadSite()
  }

  async function save(wantedStatus) {
    setSaving(true)
    setError('')
    try {
      const initial = editing === 'new' ? {} : editing
      const body = buildBody(resource.fields, form, initial)
      if (resource.translate) {
        const i18n = cleanI18n(form.i18n)
        if (body instanceof FormData) body.append('i18n', JSON.stringify(i18n))
        else body.i18n = i18n
      }
      if (resource.publishable && wantedStatus) {
        if (body instanceof FormData) body.append('status', wantedStatus)
        else body.status = wantedStatus
      }
      const saved =
        editing === 'new'
          ? await api(resource.endpoint, { method: 'POST', body })
          : await api(`${resource.endpoint}${editing.id}/`, { method: 'PATCH', body })
      if (editing === 'new' && resource.attachments) {
        load()
        reloadSite()
        startEdit(saved)
        setNotice('Enregistré. Vous pouvez maintenant ajouter les médias ci-dessous.')
        return
      }
      done(
        resource.publishable
          ? saved.status === 'published'
            ? 'Enregistré et publié sur le site.'
            : saved.status === 'pending'
              ? 'Enregistré. En attente de validation par un prêtre.'
              : 'Enregistré comme brouillon (non visible sur le site).'
          : 'Enregistré. Le site est à jour.',
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function act(row, action) {
    setError('')
    try {
      if (action === 'delete') {
        if (!window.confirm('Supprimer définitivement cet élément ?')) return
        await api(`${resource.endpoint}${row.id}/`, { method: 'DELETE' })
        done('Élément supprimé.')
      } else {
        await api(`${resource.endpoint}${row.id}/${action}/`, { method: 'POST' })
        done(action === 'publish' ? 'Validé : le contenu est maintenant visible sur le site.' : 'Retiré du site (repassé en brouillon).')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const fkField = resource.filterBy ? resource.fields.find((fld) => fld.name === resource.filterBy) : null

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-wine uppercase">{resource.group}</p>
          <h1 className="font-serif text-3xl">{resource.label}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {resource.extraLink ? (
            <Link to={resource.extraLink.to} className="border border-wine px-4 py-2 text-sm text-wine">
              {resource.extraLink.label}
            </Link>
          ) : null}
          {canWrite && !resource.noCreate ? (
            <button type="button" onClick={startCreate} className="bg-wine px-4 py-2 text-sm text-cream">
              + Ajouter
            </button>
          ) : null}
        </div>
      </div>
      {resource.intro ? <p className="mt-3 max-w-3xl text-sm text-muted">{resource.intro}</p> : null}
      {resource.publishable && !clergy ? (
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Vos ajouts sont envoyés « en attente » : un prêtre les valide avant qu’ils apparaissent sur le site.
        </p>
      ) : null}

      {notice ? <p className="mt-4 border border-gold bg-gold-light/40 px-3 py-2 text-sm">{notice}</p> : null}
      {error ? <p className="mt-4 border border-wine/40 bg-wine/5 px-3 py-2 text-sm text-wine">{error}</p> : null}

      {editing ? (
        <form
          className="mt-6 grid gap-4 border border-gold/40 bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault()
            save(resource.publishable ? (clergy ? 'published' : 'pending') : null)
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl">{editing === 'new' ? 'Nouvel élément' : 'Modifier'}</h2>
            {editing !== 'new' && resource.publishable ? <StatusBadge status={editing.status} /> : null}
          </div>
          {resource.fields.map((fld) => (
            <FieldRow key={fld.name} field={fld} value={form[fld.name]} onChange={(value) => setForm((cur) => ({ ...cur, [fld.name]: value }))} />
          ))}
          {resource.translate ? (
            <Translations
              fields={resource.fields}
              names={resource.translate}
              value={form.i18n}
              onChange={(i18n) => setForm((cur) => ({ ...cur, i18n }))}
            />
          ) : null}
          {resource.attachments && editing === 'new' ? (
            <p className="text-sm text-muted">Enregistrez d’abord : vous pourrez ensuite ajouter {resource.attachments.title.toLowerCase()}.</p>
          ) : null}
          <div className="flex flex-wrap gap-2 border-t border-stone pt-4">
            {resource.publishable ? (
              <>
                <button type="submit" disabled={saving} className="bg-wine px-4 py-2 text-sm text-cream disabled:opacity-60">
                  {clergy ? 'Enregistrer et publier' : 'Envoyer pour validation'}
                </button>
                <button type="button" disabled={saving} onClick={() => save('draft')} className="border border-wine px-4 py-2 text-sm text-wine">
                  Enregistrer en brouillon
                </button>
              </>
            ) : (
              <button type="submit" disabled={saving} className="bg-wine px-4 py-2 text-sm text-cream disabled:opacity-60">
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            )}
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-muted underline">
              {editing !== 'new' && resource.attachments ? 'Fermer' : 'Annuler'}
            </button>
          </div>
        </form>
      ) : null}
      {editing && editing !== 'new' && resource.attachments ? (
        <div className="border border-t-0 border-gold/40 bg-white px-5 pb-5">
          <Attachments config={resource.attachments} parentId={editing.id} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Filtrer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-stone bg-white px-3 py-2 text-sm"
        />
        {resource.publishable ? (
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-stone bg-white px-3 py-2 text-sm">
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS).map(([value, info]) => (
              <option key={value} value={value}>
                {info.label}
              </option>
            ))}
          </select>
        ) : null}
        {fkField ? (
          <select value={fkFilter} onChange={(e) => setFkFilter(e.target.value)} className="border border-stone bg-white px-3 py-2 text-sm">
            <option value="">{`Tous (${fkField.label.toLowerCase()})`}</option>
            {Object.entries(fkLabels[fkField.name] || {}).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        ) : null}
        <span className="text-sm text-muted">{visibleRows.length} élément(s)</span>
      </div>

      <div className="mt-3 overflow-x-auto border border-gold/30 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-stone text-wine">
            <tr>
              {resource.publishable ? <th className="px-3 py-2 font-medium">Statut</th> : null}
              {resource.columns.map((column) => (
                <th key={column} className="px-3 py-2 font-medium">
                  {COLUMN_LABELS[column] || resource.fields.find((fld) => fld.name === column)?.label || column}
                </th>
              ))}
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {loading ? (
              <tr>
                <td className="px-3 py-4 text-muted" colSpan={10}>
                  Chargement…
                </td>
              </tr>
            ) : null}
            {!loading && !visibleRows.length ? (
              <tr>
                <td className="px-3 py-4 text-muted" colSpan={10}>
                  Rien pour le moment.
                </td>
              </tr>
            ) : null}
            {!loading &&
              visibleRows.map((row) => {
                const lockedForMe = resource.publishable && row.status === 'published' && !clergy
                return (
                  <tr key={row.id} className="align-top">
                    {resource.publishable ? (
                      <td className="px-3 py-2">
                        <StatusBadge status={row.status} />
                        {row.created_by_name ? <span className="mt-1 block text-[11px] text-muted">par {row.created_by_name}</span> : null}
                      </td>
                    ) : null}
                    {resource.columns.map((column) => (
                      <td key={column} className="px-3 py-2">
                        {cellValue(resource, row, column, fkLabels)}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap justify-end gap-1">
                        {resource.publishable && clergy && row.status !== 'published' ? (
                          <button type="button" onClick={() => act(row, 'publish')} className="bg-wine px-2 py-1 text-xs text-cream">
                            Valider
                          </button>
                        ) : null}
                        {resource.publishable && clergy && row.status === 'published' ? (
                          <button type="button" onClick={() => act(row, 'unpublish')} className="border border-wine px-2 py-1 text-xs text-wine">
                            Dépublier
                          </button>
                        ) : null}
                        {canWrite && !lockedForMe ? (
                          <button type="button" onClick={() => startEdit(row)} className="border border-wine px-2 py-1 text-xs text-wine">
                            Modifier
                          </button>
                        ) : null}
                        {canWrite && !lockedForMe ? (
                          <button type="button" onClick={() => act(row, 'delete')} className="px-2 py-1 text-xs text-wine underline">
                            Supprimer
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
