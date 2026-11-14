import { formatDateShort } from '../data/content.js'
import { useSite } from '../data/SiteContext.jsx'
import PastoralForm from '../components/PastoralForm.jsx'
import { Card, ComingSoon, CtaLink, PageHero, Section } from '../components/Layout.jsx'

function youtubeEmbed(url) {
  const match = (url || '').match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null
}

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

      <Section id="homelies" title="Homélies et enseignement du mercredi">
        {published.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {published.map((item) => {
              const video = youtubeEmbed(item.videoUrl)
              return (
                <Card key={item.id}>
                  <p className="text-xs tracking-[0.2em] text-wine uppercase">
                    {item.kind === 'enseignement' ? 'Enseignement · ' : 'Homélie · '}
                    {item.priest}
                    {item.date ? ` · ${formatDateShort(item.date)}` : ''}
                  </p>
                  <h3 className="font-serif mt-2 text-2xl">{item.title}</h3>
                  {item.excerpt ? <p className="mt-3 font-medium text-muted">{item.excerpt}</p> : null}
                  {item.text ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-wine">Lire le texte</summary>
                      <p className="mt-3 whitespace-pre-line text-muted">{item.text}</p>
                    </details>
                  ) : null}
                  {item.audio ? <audio controls preload="none" src={item.audio} className="mt-4 w-full" /> : null}
                  {video ? (
                    <iframe
                      title={item.title}
                      src={video}
                      loading="lazy"
                      className="mt-4 aspect-video w-full"
                      allow="accelerometer; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : item.videoUrl ? (
                    <a href={item.videoUrl} target="_blank" rel="noreferrer" className="mt-4 block text-sm text-wine underline">
                      Voir la vidéo
                    </a>
                  ) : null}
                </Card>
              )
            })}
          </div>
        ) : (
          <ComingSoon>
            Les textes et, le cas échéant, l’audio seront déposés par les prêtres après relecture.
          </ComingSoon>
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
