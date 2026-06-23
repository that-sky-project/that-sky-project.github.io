import { motion, AnimatePresence } from 'framer-motion'


export default function CollectHUD({ count, total }) {
  const allCollected = count >= total && total > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: count > 0 ? 1 : 0, x: count > 0 ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="fixed top-20 right-6 z-50 flex flex-col items-end gap-1 pointer-events-none"
    >
      <div className="flex items-center gap-2">
        {/* wing icon */}
        <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
          <path d="M18 22 C12 18,5 14,6 10 C7 7,12 9,15 13 C16 15,17 18,18 22Z"
            fill="rgba(255,240,160,0.85)" />
          <path d="M18 22 C24 18,31 14,30 10 C29 7,24 9,21 13 C20 15,19 18,18 22Z"
            fill="rgba(255,240,160,0.85)" />
          <circle cx="18" cy="22" r="2.5" fill="rgba(255,255,220,0.95)" />
        </svg>

        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            initial={{ y: -8, opacity: 0, scale: 1.3 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-sm font-semibold tabular-nums"
            style={{
              fontFamily: 'Space Grotesk',
              color: allCollected ? '#fde68a' : 'rgba(255,240,160,0.9)',
              textShadow: '0 0 12px rgba(255,220,100,0.6)',
            }}
          >
            {count} / {total}
          </motion.span>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {allCollected && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] tracking-widest uppercase"
            style={{
              color: 'rgba(255,240,160,0.6)',
              fontFamily: 'Space Grotesk',
              textShadow: '0 0 8px rgba(255,220,100,0.4)',
            }}
          >
            all light gathered ✦
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
