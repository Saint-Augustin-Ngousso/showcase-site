import { useMemo, useState } from 'react'
import { faithQuestions, formatDateShort, homilies, parish, prayers, testimonials as seedTestimonials } from '../data/content.js'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'

function loadPublishedQuestions() {
  try {
    return JSON.parse(localStorage.getItem('questions-foi') || '[]').filter((item) => item.a)
  } catch {
    return []
  }
}

function loadTestimonials() {
  try {
    return JSON.parse(localStorage.getItem('temoignages-foi') || '[]')
  } catch {
    return []
  }
}

function AskQuestionForm() {
  const [form, setForm] = useState({ prenom: '', question: '' })
  const [sent, setSent] = useState(false)

  function onSubmit(event) {
    event.preventDefault()
    const payload = {
      q: form.question.trim(),
      prenom: form.prenom.trim(),
      at: new Date().toISOString(),
      a: '',
      published: false,
    }
    const existing = JSON.parse(localStorage.getItem('questions-foi') || '[]')
    localStorage.setItem('questions-foi', JSON.stringify([payload, ...existing]))
    if (parish.whatsappNumber) {
      const text = `Question sur la foi catholique (Paroisse Saint Augustin de Ngousso)\n\n${payload.q}${payload.prenom ? `\n\nPrénom : ${payload.prenom}` : ''}`
      window.open(`https://wa.me/${parish.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    }
    setSent(true)
  }

  if (sent) {
    return (
      <Card className="bg-wine text-cream">
        <h3 className="font-serif text-2xl">Question enregistrée</h3>
        <p className="mt-3 text-cream/80">
          Elle n’apparaîtra ici que lorsque l’équipe y aura répondu. Question et réponse seront alors affichées comme les
          autres.
        </p>
      </Card>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 border border-gold/30 bg-white p-5 sm:p-6">
      <label className="grid gap-1 text-sm">
        Prénom (facultatif)
        <input
          value={form.prenom}
          onChange={(e) => setForm((current) => ({ ...current, prenom: e.target.value }))}
          className="border border-stone bg-cream px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Votre question
        <textarea
          required
          rows="4"
          value={form.question}
          onChange={(e) => setForm((current) => ({ ...current, question: e.target.value }))}
          className="border border-stone bg-cream px-3 py-2"
        />
      </label>
      <p className="text-xs text-muted">
        La question reste privée jusqu’à la réponse. Elle sera publiée seulement après relecture du prêtre concerné.
      </p>
      <button type="submit" className="bg-wine px-5 py-3 text-sm tracking-wide text-cream uppercase">
        Poser la question
      </button>
    </form>
  )
}

export default function Foi() {
  const [localTestimonials, setLocalTestimonials] = useState(loadTestimonials)
  const answeredFromWhatsapp = useMemo(loadPublishedQuestions, [])
  const questions = [...faithQuestions, ...answeredFromWhatsapp]
  const allTestimonials = [...seedTestimonials, ...localTestimonials]

  return (
    <>
      <PageHero kicker="Phase 2" title="Enseignements">
        Homélies et enseignement du mercredi, pour prolonger ce qui est annoncé à la messe. Cette rubrique s’enrichira
        après le lancement de la phase 1.
      </PageHero>

      <Section eyebrow="Prier" title="Des prières pour commencer">
        <div className="grid gap-4 md:grid-cols-2">
          {prayers.map((item) => (
            <Card key={item.title}>
              <h3 className="font-serif text-2xl text-wine">{item.title}</h3>
              <p className="mt-3 text-muted">{item.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <CtaLink to="/priere">Confier une intention de prière</CtaLink>
        </div>
      </Section>

      <Section tone="stone" title="Lire la Parole de Dieu">
        <Card>
          <p className="text-muted">Évangile du jour et textes de la messe, via le missel officiel.</p>
          <div className="mt-6">
            <CtaLink href="https://www.aelf.org/">Évangile du jour (AELF)</CtaLink>
          </div>
        </Card>
      </Section>

      <Section id="homelies" title="Homélies et enseignement du mercredi">
        <ComingSoon>
          Les textes et, le cas échéant, l’audio seront déposés par les prêtres après relecture. Heure et lieu de
          l’enseignement du mercredi restent à préciser.
        </ComingSoon>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {homilies.map((item) => (
            <Card key={item.id}>
              <p className="text-xs tracking-[0.2em] text-wine uppercase">
                {item.priest}
                {item.date ? ` · ${formatDateShort(item.date)}` : ''}
              </p>
              <h3 className="font-serif mt-2 text-2xl">{item.title}</h3>
              <p className="mt-3 text-muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="foi-catholique" title="Comprendre la foi catholique">
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((item) => (
            <Card key={item.q}>
              <h3 className="font-serif text-xl text-wine">{item.q}</h3>
              <p className="mt-3 text-muted">{item.a}</p>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <h3 className="font-serif text-2xl">Poser une question</h3>
          <p className="mt-2 mb-4 text-sm text-muted">
            La question n’est pas affichée tout de suite. Quand l’équipe aura répondu, question et réponse apparaîtront
            ici.
          </p>
          <AskQuestionForm />
        </div>
      </Section>

      <Section tone="stone" title="Dieu agit">
        {allTestimonials.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {allTestimonials.map((item) => (
              <Card key={item.title + (item.at || '')}>
                <h3 className="font-serif text-2xl">{item.title}</h3>
                {item.prenom ? <p className="mt-1 text-xs tracking-wide text-wine uppercase">{item.prenom}</p> : null}
                <p className="mt-3 text-muted">{item.text || item.temoignage}</p>
              </Card>
            ))}
          </div>
        ) : (
          <ComingSoon>
            Les premiers témoignages validés par l’équipe pastorale seront publiés ici.
          </ComingSoon>
        )}
        <div className="mx-auto mt-10 max-w-2xl">
          <h3 className="font-serif text-2xl">Partager un témoignage</h3>
          <p className="mt-2 mb-4 text-sm text-muted">
            Comment la foi transforme une vie concrète. Une validation pastorale pourra précéder la publication.
          </p>
          <PastoralForm
            storageKey="temoignages-foi"
            submitLabel="Envoyer le témoignage"
            successTitle="Merci pour ce témoignage"
            successText="Il est enregistré. Quand le canal de validation pastorale sera en place, il pourra être publié ici."
            sensitiveNotice={false}
            fields={[
              { name: 'prenom', label: 'Prénom', required: true },
              { name: 'title', label: 'Titre court', required: true },
              { name: 'temoignage', label: 'Votre témoignage', type: 'textarea', required: true, rows: 5 },
            ]}
            onSubmitExtra={(payload) => {
              setLocalTestimonials((current) => [
                { title: payload.title, text: payload.temoignage, prenom: payload.prenom, at: payload.at },
                ...current,
              ])
            }}
          />
        </div>
      </Section>
    </>
  )
}
