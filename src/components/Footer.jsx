import { GitBranch, Scale } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div>
          <span className="footer-symbol">✦</span>
          <h2>That Sky Project</h2>
          <p>Made with care by the community</p>
        </div>
        <nav>
          <a href="https://github.com/that-sky-project" target="_blank" rel="noreferrer"><GitBranch size={15} /> GitHub</a>
          <a href="https://github.com/that-sky-project/.github/blob/main/profile/LEGAL_NOTICE.md" target="_blank" rel="noreferrer"><Scale size={15} /> Legal Notice</a>
        </nav>
      </div>
      <div className="container footer-bottom">Independent Community Initiative</div>
    </footer>
  )
}
