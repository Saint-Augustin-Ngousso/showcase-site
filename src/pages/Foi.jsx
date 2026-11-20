import { Link } from 'react-router-dom'
import { formatDateShort } from '../data/content.js'
import { useSite } from '../data/SiteContext.jsx'
import PastoralForm from '../components/PastoralForm.jsx'
import { Placeholder } from '../components/Media.jsx'
import { homilyKind } from './EnseignementDetail.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'


export default function Foi() {
  const { faithQuestions, homilies, prayers, testimonials } = useSite()
  const published = homilies.filter((item) => item.date || item.text)

  return (
    <>
      <PageHero kicker="Grandir dans la foi" title="Enseignements">
        Homélies et enseignement du mercredi, pour prolonger ce qui est annoncé à la messe.
      </PageHero>

      <Section eyebrow="Prier" title="Des prières pour commencer">
        <div className="grid gap-4 md:grid-cols-2">
          {prayers.map((item) => (
            <Card key={item.title}>
              <h3 className="font-serif text-2xl text-wine">{item.title}</h3>
              <p className="mt-3 whitespace-pre-line text-muted">{item.body}</p>
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

      <Section id="homelies" title="Homélies et enseignements">
        {published.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((item) => {
              const mediaCount = (item.media || []).length + (item.audio ? 1 : 0) + (item.videoUrl ? 1 : 0)
              return (
                <Link
                  key={item.id}
                  to={`/foi/enseignements/${item.id}`}
                  className="group flex flex-col overflow-hidden border border-gold/30 bg-white/80 shadow-[0_8px_30px_rgba(26,22,20,0.06)] transition hover:-translate-y-0.5 hover:border-wine"
                >
                  {item.cover ? (
                    <img src={item.cover} alt="" className="h-48 w-full object-cover" loading="lazy" />
                  ) : (
                    <Placeholder label={item.title} className="h-48 w-full" />
                  )}
                  <span className="flex flex-1 flex-col p-5">
                    <span className="text-xs tracking-[0.2em] text-wine uppercase">
                      {homilyKind(item)}
                      {item.priest ? ` · ${item.priest}` : ''}
                    </span>
                    <span className="font-serif mt-2 text-2xl leading-tight">{item.title}</span>
                    {item.date ? <span className="mt-1 text-sm text-muted">{formatDateShort(item.date)}</span> : null}
                    {item.excerpt ? <span className="mt-3 line-clamp-3 text-sm text-muted">{item.excerpt}</span> : null}
                    <span className="mt-auto flex items-center justify-between pt-4 text-xs tracking-wide text-wine uppercase">
                      <span className="group-hover:underline">Lire et écouter →</span>
                      {mediaCount ? <span className="text-muted normal-case">{mediaCount} média{mediaCount > 1 ? 's' : ''}</span> : null}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <ComingSoon>Les textes et, le cas échéant, l’audio seront déposés par les prêtres après relecture.</ComingSoon>
        )}
      </Section>

      <Section id="foi-catholique" title="Comprendre la foi catholique">
        <div className="grid gap-4 md:grid-cols-2">
          {faithQuestions.map((item) => (
            <Card key={item.q}>
              <h3 className="font-serif text-xl text-wine">{item.q}</h3>
              <p className="mt-3 whitespace-pre-line text-muted">{item.a}</p>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <h3 className="font-serif text-2xl">Poser une question</h3>
          <p className="mt-2 mb-4 text-sm text-muted">
            La question n’est pas affichée tout de suite. Quand un prêtre y aura répondu, question et réponse apparaîtront
            ici.
          </p>
          <PastoralForm
            endpoint="/faith-questions/ask/"
            submitLabel="Poser la question"
            successTitle="Question enregistrée"
            successText="Elle apparaîtra ici avec sa réponse, après relecture d’un prêtre."
            sensitiveNotice={false}
            toPayload={(f) => ({ prenom: f.prenom, question: f.question })}
            fields={[
              { name: 'prenom', label: 'Prénom (facultatif)' },
              { name: 'question', label: 'Votre question', type: 'textarea', required: true },
            ]}
          />
        </div>
      </Section>

      <Section tone="stone" title="Dieu agit">
        {testimonials.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.title + (item.at || '')}>
                <h3 className="font-serif text-2xl">{item.title}</h3>
                {item.prenom ? <p className="mt-1 text-xs tracking-wide text-wine uppercase">{item.prenom}</p> : null}
                <p className="mt-3 whitespace-pre-line text-muted">{item.text}</p>
              </Card>
            ))}
          </div>
        ) : (
          <ComingSoon>Les premiers témoignages validés par l’équipe pastorale seront publiés ici.</ComingSoon>
        )}
        <div className="mx-auto mt-10 max-w-2xl">
          <h3 className="font-serif text-2xl">Partager un témoignage</h3>
          <p className="mt-2 mb-4 text-sm text-muted">
            Comment la foi transforme une vie concrète. Un prêtre relit chaque témoignage avant publication.
          </p>
          <PastoralForm
            endpoint="/testimonials/"
            submitLabel="Envoyer le témoignage"
            successTitle="Merci pour ce témoignage"
            successText="Il sera publié ici après relecture d’un prêtre."
            sensitiveNotice={false}
            toPayload={(f) => ({ author_name: f.prenom, title: f.title, text: f.temoignage })}
            fields={[
              { name: 'prenom', label: 'Prénom', required: true },
              { name: 'title', label: 'Titre court', required: true },
              { name: 'temoignage', label: 'Votre témoignage', type: 'textarea', required: true, rows: 5 },
            ]}
          />
        </div>
      </Section>
    </>
  )
}
