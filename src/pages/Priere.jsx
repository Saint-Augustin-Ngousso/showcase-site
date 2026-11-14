import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, PageHero, Section } from '../components/Layout.jsx'
import { api } from '../lib/api.js'

const CATEGORIES = [
  { value: 'sante', label: 'Santé' },
  { value: 'famille', label: 'Famille' },
  { value: 'travail', label: 'Travail' },
  { value: 'etudes', label: 'Études' },
  { value: 'deuil', label: 'Deuil' },
  { value: 'conversion', label: 'Conversion' },
  { value: 'action_de_grace', label: 'Action de grâce' },
  { value: 'autre', label: 'Autre' },
]

function timeAgo(iso) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 60) return minutes <= 1 ? 'à l’instant' : `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function Priere() {
  const { hasRole } = useAuth()
  const [wall, setWall] = useState({ loading: true, items: [], error: false })
  const [prayed, setPrayed] = useState(() => new Set())

  const load = useCallback(() => {
    api('/intentions/', { auth: false })
      .then((items) => setWall({ loading: false, items, error: false }))
      .catch(() => setWall({ loading: false, items: [], error: true }))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function pray(id) {
    if (prayed.has(id)) return
    setPrayed((current) => new Set(current).add(id))
    try {
      const { prayed_count } = await api(`/intentions/${id}/pray/`, { method: 'POST', auth: false })
      setWall((current) => ({ ...current, items: current.items.map((i) => (i.id === id ? { ...i, prayed_count } : i)) }))
    } catch {
      /* compteur non mis à jour : sans gravité */
    }
  }

  async function remove(id) {
    if (!window.confirm('Supprimer définitivement cette intention ?')) return
    await api(`/intentions/${id}/`, { method: 'DELETE' })
    setWall((current) => ({ ...current, items: current.items.filter((i) => i.id !== id) }))
  }

  return (
    <>
      <PageHero kicker="Confier" title="Je demande une prière">
        Confiez votre intention à la prière de la communauté. Vous choisissez : visible sur le mur de prière, ou réservée
        aux prêtres de la paroisse.
      </PageHero>

      <Section>
        <div className="mx-auto max-w-2xl">
          <PastoralForm
            endpoint="/intentions/"
            submitLabel="Confier cette intention à la prière"
            successTitle="Intention reçue dans la prière"
            successText="Merci. Si vous l’avez rendue visible, elle apparaît maintenant sur le mur de prière ci-dessous."
            notice="Ne mentionnez que ce que vous souhaitez partager. Évitez les noms complets et les détails de santé sur le mur public."
            sensitiveNotice={false}
            onSent={load}
            toPayload={(f) => ({ author_name: f.prenom, category: f.categorie, text: f.intention, is_public: f.publique })}
            fields={[
              { name: 'prenom', label: 'Prénom (facultatif)' },
              { name: 'categorie', label: 'Catégorie', type: 'select', required: true, options: CATEGORIES },
              { name: 'intention', label: 'Intention de prière', type: 'textarea', required: true, rows: 6 },
              {
                name: 'publique',
                type: 'checkbox',
                defaultChecked: true,
                label: 'Afficher mon intention sur le mur de prière',
                help: 'Décochez pour qu’elle ne soit lue que par les prêtres de la paroisse.',
              },
            ]}
          />
        </div>
      </Section>

      <Section tone="stone" eyebrow="Communion" title="Le mur de prière">
        <p className="mb-6 max-w-2xl text-muted">
          Les intentions partagées par les fidèles. Prenez un instant pour prier avec eux. Les prêtres veillent sur ce mur
          et retirent ce qui n’y a pas sa place.
        </p>
        {wall.loading ? <p className="text-muted">Chargement…</p> : null}
        {wall.error ? <ComingSoon>Le mur de prière est momentanément indisponible.</ComingSoon> : null}
        {!wall.loading && !wall.error && !wall.items.length ? (
          <ComingSoon>Aucune intention partagée pour le moment. Soyez le premier à confier la vôtre.</ComingSoon>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wall.items.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <p className="text-xs tracking-[0.2em] text-wine uppercase">
                {item.category_label} · {timeAgo(item.created_at)}
              </p>
              <p className="mt-3 flex-1 whitespace-pre-line">{item.text}</p>
              <p className="mt-3 text-sm text-muted">{item.author_name || 'Un fidèle'}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => pray(item.id)}
                  disabled={prayed.has(item.id)}
                  className="border border-wine px-3 py-1.5 text-xs text-wine uppercase disabled:bg-wine disabled:text-cream"
                >
                  {prayed.has(item.id) ? 'Je prie avec vous' : 'Je prie aussi'}
                </button>
                {item.prayed_count ? (
                  <span className="text-xs text-muted">
                    {item.prayed_count} {item.prayed_count > 1 ? 'personnes prient' : 'personne prie'}
                  </span>
                ) : null}
                {hasRole('pretre') ? (
                  <button type="button" onClick={() => remove(item.id)} className="ml-auto text-xs text-wine underline">
                    Supprimer
                  </button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
