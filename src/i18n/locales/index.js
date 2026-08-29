import en from './en'
import zh from './zh'

export const DEFAULT_LOCALE = 'en'

// Order defines display order in the toggle.
export const LOCALES = [
  { code: 'en', label: 'EN', htmlLang: 'en' },
  { code: 'zh', label: '中', htmlLang: 'zh' },
]

export const TABLES = { en, zh }
