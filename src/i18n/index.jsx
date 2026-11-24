// Traduction de l'interface (français / anglais).
//
// t('Texte français') renvoie la traduction anglaise si la langue active est l'anglais,
// sinon le texte tel quel. Les clés sont le texte français lui-même : une phrase sans
// traduction s'affiche simplement en français.
//   t('Bonjour {name}', { name })  → remplace {name}
//
// Le contenu saisi dans l'administration est traduit côté serveur (/api/site/?lang=en).
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import EN from './en.js'

export const LANGUAGES = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
]

const STORAGE_KEY = 'paroisse.lang'
let currentLang = 'fr'

function initialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (fromUrl === 'en' || fromUrl === 'fr') return fromUrl
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'fr') return saved
  } catch {
    /* stockage indisponible */
  }
  return 'fr'
}

export function getLang() {
  return currentLang
}

/** Locale pour les dates : « samedi 28 novembre » / « Saturday 28 November ». */
export function locale() {
  return currentLang === 'en' ? 'en-GB' : 'fr-FR'
}

export function t(text, vars) {
  let out = currentLang === 'en' ? EN[text] ?? text : text
  if (vars) {
    for (const [key, value] of Object.entries(vars)) out = out.replaceAll(`{${key}}`, value ?? '')
  }
  return out
}

const I18nContext = createContext({ lang: 'fr', setLang: () => {} })

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    currentLang = initialLang()
    return currentLang
  })

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next) => {
    currentLang = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* préférence non mémorisée */
    }
    setLangState(next)
  }, [])

  // `key` : toute l'interface est redessinée dans la nouvelle langue.
  return (
    <I18nContext.Provider value={{ lang, setLang }}>
      <div key={lang} className="contents">
        {children}
      </div>
    </I18nContext.Provider>
  )
}

export function useLang() {
  return useContext(I18nContext)
}

export function LanguageSwitch({ className = '' }) {
  const { lang, setLang } = useLang()
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} role="group" aria-label="Langue / Language">
      {LANGUAGES.map((item, index) => (
        <span key={item.code} className="inline-flex items-center gap-1">
          {index ? <span aria-hidden="true" className="opacity-40">|</span> : null}
          <button
            type="button"
            lang={item.code}
            title={item.name}
            aria-pressed={lang === item.code}
            onClick={() => setLang(item.code)}
            className={lang === item.code ? 'font-semibold underline underline-offset-4' : 'opacity-75 hover:opacity-100'}
          >
            {item.label}
          </button>
        </span>
      ))}
    </span>
  )
}
