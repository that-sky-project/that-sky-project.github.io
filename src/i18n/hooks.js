import { useCallback, useContext } from 'react'
import { translate } from './translate'
import { TABLES, DEFAULT_LOCALE } from './locales'
import { LocaleContext } from './context'

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useT() {
  const { locale } = useLocale()
  return useCallback(
    (key, vars) => translate(TABLES[locale], TABLES[DEFAULT_LOCALE], key, vars),
    [locale]
  )
}
