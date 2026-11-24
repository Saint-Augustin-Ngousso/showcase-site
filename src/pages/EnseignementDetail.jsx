import { Link, Navigate, useParams } from 'react-router-dom'
import { formatDate } from '../data/content.js'
import { useSite } from '../data/SiteContext.jsx'
import { PhotoGallery, VideoEmbed } from '../components/Media.jsx'
import { CtaLink, PageHero, Section } from '../components/Layout.jsx'
import { t } from '../i18n/index.jsx'

export function homilyKind(item) {
  return item.kind === 'enseignement' ? t('Enseignement') : t('Homélie')
}

export default function EnseignementDetail() {
  const { id } = useParams()
  const { homilies } = useSite()
  const item = homilies.find((h) => String(h.id) === id)
  if (!item) return <Navigate to="/foi#homelies" replace />

  const media = item.media || []
  const images = media.filter((m) => m.kind === 'image')
  const videos = [item.videoUrl, ...media.filter((m) => m.kind === 'video').map((m) => m.url)].filter(Boolean)
  const audios = [
    item.audio ? { id: 'main', src: item.audio, caption: '' } : null,
    ...media.filter((m) => m.kind === 'audio'),
  ].filter(Boolean)
  const others = homilies.filter((h) => h.id !== item.id).slice(0, 3)

  return (
    <>
      <PageHero kicker={`${homilyKind(item)}${item.priest ? ` · ${item.priest}` : ''}`} title={item.title}>
        {item.date ? formatDate(item.date) : ''}
      </PageHero>

      <Section>
        <article className="mx-auto grid max-w-3xl gap-8">
          {item.cover ? <img src={item.cover} alt="" className="max-h-[30rem] w-full object-cover" /> : null}
          {item.excerpt ? <p className="font-serif text-2xl leading-snug text-wine">{item.excerpt}</p> : null}
          {item.text ? <div className="whitespace-pre-line text-lg leading-relaxed text-ink/90">{item.text}</div> : null}

          {audios.length ? (
            <div>
              <h2 className="font-serif text-2xl">{t("Écouter")}</h2>
              <div className="mt-3 grid gap-3">
                {audios.map((audio) => (
                  <div key={audio.id} className="border border-gold/30 bg-white p-3">
                    {audio.caption ? <p className="mb-2 text-sm text-muted">{audio.caption}</p> : null}
                    <audio controls preload="none" src={audio.src} className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {videos.length ? (
            <div>
              <h2 className="font-serif text-2xl">{t("Regarder")}</h2>
              <div className="mt-3 grid gap-4">
                {videos.map((url) => (
                  <VideoEmbed key={url} url={url} title={item.title} />
                ))}
              </div>
            </div>
          ) : null}
        </article>
      </Section>

      {images.length ? (
        <Section tone="stone" title={t("En images")}>
          <PhotoGallery items={images} />
        </Section>
      ) : null}

      <Section title={others.length ? t('D’autres enseignements') : ''}>
        {others.length ? (
          <ul className="grid gap-3 md:grid-cols-3">
            {others.map((h) => (
              <li key={h.id}>
                <Link to={`/foi/enseignements/${h.id}`} className="block border border-gold/30 bg-white p-4 hover:border-wine">
                  <span className="text-xs tracking-[0.15em] text-wine uppercase">{homilyKind(h)}</span>
                  <span className="mt-1 block font-serif text-xl">{h.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-8">
          <CtaLink to="/foi#homelies">{t("Tous les enseignements")}</CtaLink>
        </p>
      </Section>
    </>
  )
}
