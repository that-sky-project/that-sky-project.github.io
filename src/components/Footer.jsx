import { GitBranch, Scale } from 'lucide-react'
import { useT } from '../i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div>
          <h2>That Sky Project</h2>
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span className="footer-bottom-label">{t('footer.bottom')}</span>
        <nav>
          <a href="https://github.com/that-sky-project" target="_blank" rel="noreferrer"><GitBranch size={13} /> {t('footer.github')}</a>
          <a href="https://github.com/that-sky-project/.github/blob/main/profile/LEGAL_NOTICE.md" target="_blank" rel="noreferrer"><Scale size={13} /> {t('footer.legal')}</a>
        </nav>
      </div>
    </footer>
  )
}
