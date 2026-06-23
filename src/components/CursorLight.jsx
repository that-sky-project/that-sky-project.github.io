import { useEffect, useRef, useState } from 'react'


export default function CursorLight() {
  const canvasRef = useRef(null)
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  })

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updateEnabled = () => setEnabled(media.matches)

    updateEnabled()
    media.addEventListener('change', updateEnabled)

    return () => {
      media.removeEventListener('change', updateEnabled)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let raf, w, h
    let mx = -9999, my = -9999
    let lx = -9999, ly = -9999
    let svx = 0, svy = 0  
    const dust = []
    let t = 0

    function resize() {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    function onMove(e) {
      lx = mx; ly = my
      mx = e.clientX; my = e.clientY
      const dx = mx - lx, dy = my - ly
      const speed = Math.sqrt(dx * dx + dy * dy)

      svx = svx * 0.72 + dx * 0.28
      svy = svy * 0.72 + dy * 0.28

      const count = Math.min(Math.floor(speed * 0.2) + 1, 9)
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2
        const r   = Math.random() * 14
        dust.push({
          x:    mx + Math.cos(ang) * r,
          y:    my + Math.sin(ang) * r,
          vx:   (Math.random() - 0.5) * 0.85 + dx * 0.03,
          vy:   -Math.random() * 1.5 - 0.45,
          life:  1,
          decay: 0.009 + Math.random() * 0.018,
          size:  Math.random() * 2.6 + 0.6,
          warm:  Math.random() > 0.28,
          wing:  false,
        })
      }

      if (speed > 5) {
        const moveAngle = Math.atan2(dy, dx)
        const wCount    = Math.min(Math.floor(speed * 0.28), 7)
        for (let i = 0; i < wCount; i++) {
          for (const side of [-1, 1]) {
            const wAng   = moveAngle + side * (Math.PI * 0.55 + Math.random() * 0.42) + Math.PI
            const wSpeed = 0.7 + Math.random() * 2.4
            dust.push({
              x:    mx - dx * Math.random() * 0.45,
              y:    my - dy * Math.random() * 0.45,
              vx:   Math.cos(wAng) * wSpeed,
              vy:   Math.sin(wAng) * wSpeed - 0.35,
              life:  0.75 + Math.random() * 0.25,
              decay: 0.011 + Math.random() * 0.015,
              size:  Math.random() * 2.2 + 0.7,
              warm:  Math.random() > 0.38,
              wing:  true,
            })
          }
        }
      }

      if (dust.length > 300) dust.splice(0, dust.length - 300)
    }

    window.addEventListener('mousemove', onMove)

    function draw() {
      ctx.clearRect(0, 0, w, h)
      t += 0.038

      if (mx > -100) {
        const speed     = Math.sqrt(svx * svx + svy * svy)
        const sn        = Math.min(speed / 14, 1) 
        const breathe   = 1 + 0.065 * Math.sin(t * 0.9)

        const ambR = (105 + sn * 45) * breathe
        const gAmb = ctx.createRadialGradient(mx, my, 0, mx, my, ambR)
        gAmb.addColorStop(0,   `rgba(255,${220 - sn * 40},${85 + sn * 90},0.055)`)
        gAmb.addColorStop(0.45,'rgba(255,185,58,0.025)')
        gAmb.addColorStop(1,   'transparent')
        ctx.fillStyle = gAmb
        ctx.beginPath()
        ctx.arc(mx, my, ambR, 0, Math.PI * 2)
        ctx.fill()

        const outerR = (72 + sn * 28) * breathe
        const g1 = ctx.createRadialGradient(mx, my, 0, mx, my, outerR)
        g1.addColorStop(0,    `rgba(255,${222 - sn * 42},${82 + sn * 88},0.14)`)
        g1.addColorStop(0.38, `rgba(255,${195 - sn * 32},${60 + sn * 72},0.06)`)
        g1.addColorStop(0.72, 'rgba(255,162,55,0.02)')
        g1.addColorStop(1,    'transparent')
        ctx.fillStyle = g1
        ctx.beginPath()
        ctx.arc(mx, my, outerR, 0, Math.PI * 2)
        ctx.fill()

        const midR = (28 + sn * 14) * breathe
        const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, midR)
        g2.addColorStop(0,    `rgba(255,${255 - sn * 20},${198 + sn * 57},0.62)`)
        g2.addColorStop(0.28, `rgba(255,${225 - sn * 22},${112 + sn * 65},0.24)`)
        g2.addColorStop(0.68, 'rgba(255,178,68,0.07)')
        g2.addColorStop(1,    'transparent')
        ctx.fillStyle = g2
        ctx.beginPath()
        ctx.arc(mx, my, midR, 0, Math.PI * 2)
        ctx.fill()

        const coreR = (3.8 + sn * 2.8) * breathe
        const g3 = ctx.createRadialGradient(mx, my, 0, mx, my, coreR)
        g3.addColorStop(0, `rgba(255,255,${238 + sn * 17},0.98)`)
        g3.addColorStop(1, 'transparent')
        ctx.fillStyle = g3
        ctx.beginPath()
        ctx.arc(mx, my, coreR, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = dust.length - 1; i >= 0; i--) {
        const p = dust[i]
        p.x  += p.vx
        p.y  += p.vy
        p.vy -= p.wing ? 0.018 : 0.009
        p.vx *= 0.978
        p.life -= p.decay
        if (p.life <= 0) { dust.splice(i, 1); continue }

        const a = p.life * (p.wing ? 0.62 : 0.72)
        const r = p.size * Math.min(p.life * 1.25, 1)
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = p.warm
          ? `rgba(255,228,110,${a.toFixed(3)})`
          : `rgba(205,232,255,${(a * 0.52).toFixed(3)})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 40, mixBlendMode: 'screen' }}
    />
  )
}
