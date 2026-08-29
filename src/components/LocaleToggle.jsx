import { useLocale, useT } from '../i18n'

export default function LocaleToggle() {
  const { locale, setLocale, locales } = useLocale()
  const t = useT()

  return (
    <div className="locale-toggle" role="group" aria-label={t('nav.localeLabel')}>
      {locales.map(item => (
        <button
          key={item.code}
          type="button"
          className={locale === item.code ? 'active' : ''}
          aria-pressed={locale === item.code}
          onClick={() => setLocale(item.code)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
