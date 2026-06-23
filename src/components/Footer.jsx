import { motion } from 'framer-motion'
import { GitBranch, Heart, Scale } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6">
      {/* top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk' }}>
            That Sky Project
          </span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            Made with <Heart size={11} className="text-red-400" /> by the community
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500">
          <motion.a
            href="https://github.com/that-sky-project"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <GitBranch size={13} />
            GitHub
          </motion.a>
          <motion.a
            href="https://github.com/that-sky-project/.github/blob/main/profile/LEGAL_NOTICE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Scale size={13} />
            Legal Notice
          </motion.a>
          <span>Independent Community Initiative</span>
        </div>
      </div>
    </footer>
  )
}
