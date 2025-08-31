import React, { useEffect, useRef, useState } from 'react'
import './endscreen.css'

export default function EndScreen({ stats, onRestart, onClose, avatar }: { stats: any, onRestart: () => void, onClose?: () => void, avatar?: string }) {
  const playRef = useRef<HTMLButtonElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const confettiRef = useRef<HTMLCanvasElement | null>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)
  const [announce, setAnnounce] = useState('')
  const [displayTime, setDisplayTime] = useState(0)
  const [displayMoves, setDisplayMoves] = useState(0)

  function assetUrl(name?: string){
    if (!name) return ''
    try { return new URL(`../../assets/game-assets/maze-game/${name}.png`, import.meta.url).href } catch {}
    try { return new URL(`../../assets/game-assets/maze-game/${name}.svg`, import.meta.url).href } catch { return '' }
  }

  useEffect(() => {
    // focus play button when modal opens
    prevFocusRef.current = document.activeElement as HTMLElement | null
    playRef.current?.focus()
    // aria-live announcement
    const t = Math.round((stats?.timeMs || 0) / 1000)
    const m = stats?.moves ?? 0
    setAnnounce(`You won in ${t} seconds with ${m} moves.`)
    // animate stats count-up
    const dur = 700
    const start = performance.now()
    const fromTime = 0, toTime = t
    const fromMoves = 0, toMoves = m
    let raf = 0
    function tick(now: number){
      const p = Math.min(1, (now - start) / dur)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplayTime(Math.round(fromTime + (toTime - fromTime) * ease))
      setDisplayMoves(Math.round(fromMoves + (toMoves - fromMoves) * ease))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { if (raf) cancelAnimationFrame(raf) }
  }, [])

  // focus trap and restore
  useEffect(() => {
    function onKey(e: KeyboardEvent){
      if (e.key === 'Tab' && rootRef.current){
        const els = Array.from(rootRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'))
        if (els.length === 0) return
        const first = els[0], last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first){ e.preventDefault(); (last as HTMLElement).focus() }
        else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); (first as HTMLElement).focus() }
      }
      if (e.key === 'Escape') {
        e.preventDefault(); onClose && onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); prevFocusRef.current?.focus() }
  }, [onClose])

  // confetti burst (brief) - respects reduced motion
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const canvas = confettiRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let DPR = window.devicePixelRatio || 1
    function resize(){
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      DPR = window.devicePixelRatio || 1
      canvas.width = Math.round(rect.width * DPR)
      canvas.height = Math.round(rect.height * DPR)
      ctx.setTransform(DPR,0,0,DPR,0,0)
    }
    // make canvas cover viewport (fixed) so confetti isn't clipped
    resize()
    window.addEventListener('resize', resize)
  const colors = ['#06d6a0','#2f8f4f','#9bfbce','#4d96ff','#9b5de5']
    type P = {x:number,y:number,vx:number,vy:number,rot:number,spin:number,w:number,h:number,c:string,ttl:number,age:number}
    const parts: P[] = []
    const count = 80

    // center the burst on the panel if possible
    const panelEl = document.querySelector('.es-panel') as HTMLElement | null
    const panelRect = panelEl ? panelEl.getBoundingClientRect() : null
    const rect = canvas.getBoundingClientRect()
    const centerX = panelRect ? (panelRect.left + panelRect.width/2) : (rect.width/2)
    const centerY = panelRect ? (panelRect.top + panelRect.height/2) : (rect.height/2)

    for (let i=0;i<count;i++){
      const w = 6 + Math.random()*12
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random()*6
      const vx = Math.cos(angle) * speed * (0.6 + Math.random()*0.9)
      const vy = Math.sin(angle) * speed * (0.6 + Math.random()*0.9) - 3
      const ttl = 900 + Math.random()*1200
      parts.push({ x: centerX + (Math.random()-0.5)*40, y: centerY + (Math.random()-0.5)*30, vx, vy, rot: Math.random()*Math.PI*2, spin: (Math.random()-0.5)*0.4, w, h: w*0.6, c: colors[Math.floor(Math.random()*colors.length)], ttl, age: 0 })
    }
    let raf = 0
    let last = performance.now()
    function step(now:number){
      if (!canvas) return
      const dt = Math.min(40, now - last)
      last = now
      // clear using CSS pixels
      ctx.clearRect(0,0,canvas.width/DPR, canvas.height/DPR)
      // update and draw
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        const delta = dt/1000
        p.age += dt
        p.x += p.vx * delta * 60
        p.y += p.vy * delta * 60
        p.vy += 9.8 * 0.02 // gravity scaled
        p.rot += p.spin
        const tfrac = Math.max(0, Math.min(1, p.age / p.ttl))
        const alpha = 1 - tfrac
        if (alpha <= 0) { parts.splice(i,1); continue }
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.c
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h)
        ctx.restore()
      }
      if (parts.length > 0) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div className="es-root" role="dialog" aria-modal="true" aria-labelledby="es-title">
      <div className="es-panel">
        <div className="es-hero">
          {(() => {
            const url = assetUrl(avatar)
            if (url) return <div className="es-avatar" style={{ backgroundImage: `url(${url})` }} aria-hidden />
            return (
              <div className="es-trophy" aria-hidden>
                <svg viewBox="0 0 64 64" className="trophy-svg" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="28" r="18" fill="#ffd166" />
                </svg>
              </div>
            )
          })()}
        </div>

        <div className="es-body">
          <h2 id="es-title" className="es-title">You won!</h2>
          <div className="es-stats">
            <div className="es-stat"><div className="label">Time</div><div className="value">{displayTime}s</div></div>
            <div className="es-stat"><div className="label">Moves</div><div className="value">{displayMoves}</div></div>
          </div>

          <div className="es-actions">
            <button ref={playRef} className="es-play" onClick={onRestart}>Play again</button>
            <button className="es-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
  <canvas ref={confettiRef} className="es-confetti" aria-hidden />
  <div className="sr-only" aria-live="polite">{announce}</div>
    </div>
  )
}
