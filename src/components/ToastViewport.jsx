import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getToastState, subscribeToToasts, toast } from '../lib/toast'

function ToastCard({ item }) {
  const appearance = item.appearance || {}

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{
        layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        duration: appearance.surfaceFadeDuration,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => toast.dismiss(item.id)}
      className="group relative mb-3 w-fit max-w-full cursor-pointer overflow-hidden shadow-[0_14px_36px_rgba(0,0,0,0.14)]"
      style={{
        borderRadius: `${appearance.radius}px`,
        backgroundColor: `rgba(0,0,0,${appearance.backgroundOpacity})`,
        paddingLeft: `${appearance.paddingX}px`,
        paddingRight: `${appearance.paddingX}px`,
        paddingTop: `${appearance.paddingY}px`,
        paddingBottom: `${appearance.paddingY}px`,
        backdropFilter: `blur(${appearance.blur}px)`,
      }}
    >
      <div className="relative flex min-h-0 items-center justify-center text-center">
        <div className="min-w-0">
          {item.title && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: appearance.textFadeDuration }}
              className="font-medium text-white"
              style={{
                fontFamily: appearance.fontFamily,
                fontSize: `${appearance.titleSize}px`,
              }}
            >
              {item.title}
            </motion.p>
          )}
          {item.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: appearance.textFadeDuration, delay: 0.03 }}
              className="mt-0.5 leading-6 text-white/88"
              style={{ fontSize: `${appearance.descriptionSize}px` }}
            >
              {item.description}
            </motion.p>
          )}

          {item.action && (
            <button
              onClick={event => {
                event.stopPropagation()
                item.action.onClick()
              }}
              className="mt-2 inline-flex items-center uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white"
              style={{
                fontFamily: appearance.fontFamily,
                fontSize: `${appearance.actionSize}px`,
              }}
            >
              {item.action.label}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function useToastItems() {
  const [items, setItems] = useState(() => getToastState())

  useEffect(() => {
    return subscribeToToasts(setItems)
  }, [])

  return items
}

export default function ToastViewport() {
  const items = useToastItems()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-2xl flex-col items-center">
        <AnimatePresence initial={false}>
          {items.map(item => (
            <ToastCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
