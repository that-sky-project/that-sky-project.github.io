import { GitBranch, Scale } from 'lucide-react'
import { useT } from '../i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div>
          <span className="footer-symbol">✦</span>
          <h2>That Sky Project</h2>
          <p>{t('footer.tagline')}</p>
        </div>
        <nav>
          <a href="https://github.com/that-sky-project" target="_blank" rel="noreferrer"><GitBranch size={15} /> {t('footer.github')}</a>
          <a href="https://github.com/that-sky-project/.github/blob/main/profile/LEGAL_NOTICE.md" target="_blank" rel="noreferrer"><Scale size={15} /> {t('footer.legal')}</a>
        </nav>
      </div>
      <div className="container footer-bottom">{t('footer.bottom')}</div>
    </footer>
  )
}
