import { useEffect, useRef } from 'react'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export default function StarField() {
  const canvasRef = useRef(null)
  const konamiRef = useRef([])
  const meteorStormRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let w, h
    const stars = []
    const shooting = []
    const STAR_COUNT = 160
    const CONNECT_DIST = 110
    const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST
    const SHOOTING_INTERVAL = 3200
    let t = 0

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      initStars()
    }

    function initStars() {
      stars.length = 0
      for (let i = 0; i < STAR_COUNT; i++) {
        const driftAngle = Math.random() * Math.PI * 2
        const driftSpeed = Math.random() * 0.12 + 0.03
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.15,
          alpha: Math.random() * 0.65 + 0.2,
          twinkleSpeed: Math.random() * 0.003 + 0.001,
          phase: Math.random() * Math.PI * 2,
          vx: Math.cos(driftAngle) * driftSpeed,
          vy: Math.sin(driftAngle) * driftSpeed,
        })
      }
    }

    function addShooting(fast = false) {
      const angle = Math.PI / 5 + Math.random() * 0.3
      const speed = fast ? Math.random() * 14 + 10 : Math.random() * 8 + 6
      shooting.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.4,
        len: fast ? Math.random() * 200 + 120 : Math.random() * 130 + 70,
        alpha: 1,
        angle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: fast
          ? ['rgba(200,230,255,', 'rgba(180,200,255,', 'rgba(210,190,255,'][Math.floor(Math.random() * 3)]
          : 'rgba(210,235,255,',
      })
    }

    function triggerMeteorStorm() {
      if (meteorStormRef.current) return
      meteorStormRef.current = true
      let fired = 0
      const burst = setInterval(() => {
        for (let i = 0; i < 3; i++) addShooting(true)
        fired++
        if (fired >= 14) {
          clearInterval(burst)
          meteorStormRef.current = false
        }
      }, 160)
    }

    function handleKey(e) {
      const seq = konamiRef.current
      seq.push(e.key)
      if (seq.length > KONAMI.length) seq.shift()
      if (seq.join(',') === KONAMI.join(',')) {
        triggerMeteorStorm()
        seq.length = 0
      }
    }
    window.addEventListener('keydown', handleKey)

    function draw() {
      ctx.clearRect(0, 0, w, h)

      const nebulas = [
        { x: w * 0.2,  y: h * 0.15, r: w * 0.32, color: 'rgba(125,211,252,0.028)' },
        { x: w * 0.75, y: h * 0.3,  r: w * 0.28, color: 'rgba(167,139,250,0.022)' },
        { x: w * 0.5,  y: h * 0.75, r: w * 0.25, color: 'rgba(52,211,153,0.018)'  },
      ]
      nebulas.forEach(({ x, y, r, color }) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, color)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      })

      t += 0.01
      for (const s of stars) {
        s.x += s.vx
        s.y += s.vy
        if (s.x < -2) s.x = w + 2
        else if (s.x > w + 2) s.x = -2
        if (s.y < -2) s.y = h + 2
        else if (s.y > h + 2) s.y = -2

        const a = s.alpha * (0.55 + 0.45 * Math.sin(t * s.twinkleSpeed * 100 + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(215,232,255,${a.toFixed(3)})`
        ctx.fill()
      }

      for (let i = 0; i < stars.length - 1; i++) {
        const a = stars[i]
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq > CONNECT_DIST_SQ) continue
          const lineAlpha = (1 - distSq / CONNECT_DIST_SQ) * 0.18
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(180,220,255,${lineAlpha.toFixed(3)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i]
        s.x += s.vx
        s.y += s.vy
        s.alpha -= 0.016
        if (s.alpha <= 0) { shooting.splice(i, 1); continue }

        const tailX = s.x - Math.cos(s.angle) * s.len
        const tailY = s.y - Math.sin(s.angle) * s.len
        const g2 = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        g2.addColorStop(0, 'transparent')
        g2.addColorStop(1, `${s.color}${s.alpha.toFixed(3)})`)
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = g2
        ctx.lineWidth = s.color === 'rgba(210,235,255,' ? 1.4 : 2
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const shootTimer = setInterval(addShooting, SHOOTING_INTERVAL)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(shootTimer)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.88 }}
    />
  )
}
