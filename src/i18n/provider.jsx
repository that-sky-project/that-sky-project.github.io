import { useCallback, useEffect, useMemo, useState } from 'react'
import { translate } from './translate'
import { TABLES, LOCALES, DEFAULT_LOCALE } from './locales'
import { LocaleContext } from './context'

const STORAGE_KEY = 'tsp-locale'

function readStored() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return TABLES[value] ? value : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() =>
    typeof window === 'undefined' ? DEFAULT_LOCALE : readStored()
  )

  const setLocale = useCallback(code => {
    if (!TABLES[code]) return
    setLocaleState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // Ignore storage privacy mode failures.
    }
  }, [])

  useEffect(() => {
    const meta = LOCALES.find(item => item.code === locale) || LOCALES[0]
    document.documentElement.lang = meta.htmlLang
    document.title = translate(TABLES[locale], TABLES[DEFAULT_LOCALE], 'meta.title')

    const description = translate(TABLES[locale], TABLES[DEFAULT_LOCALE], 'meta.description')
    const tag = document.querySelector('meta[name="description"]')
    if (tag) tag.setAttribute('content', description)
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, locales: LOCALES }), [locale, setLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
