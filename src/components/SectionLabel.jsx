export function SectionLabel({ children, align = 'center' }) {
  const justifyClass = align === 'start' ? 'justify-start' : 'justify-center'

  return (
    <div className={`flex items-center gap-3 mb-5 ${justifyClass}`}>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-sky-400/40" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-400/80">
        {children}
      </span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-sky-400/40" />
    </div>
  )
}
