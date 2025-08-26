import { useEffect, useRef, useState } from 'react'
import type { Maze } from './maze'
import type { ThemeId } from './theme'
import { loadThemeAssets } from './theme'

export default function GameScreen({ maze, onEnd, theme = 'forest' }: { maze: Maze, onEnd: (result: any) => void, theme?: ThemeId }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [pos, setPos] = useState({ r: 0, c: 0 })
  const [moves, setMoves] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const finishedRef = useRef(false)
  const patternCacheRef = useRef<Map<string, CanvasPattern>>(new Map())
  const floorImageRef = useRef<HTMLImageElement | null>(null)
  const wallImageRef = useRef<HTMLImageElement | null>(null)
  const particleImageRef = useRef<HTMLImageElement | null>(null)
  const fallbackRef = useRef<string | null>(null)
  const [patternReady, setPatternReady] = useState(false)
  const wallPatternRef = useRef<CanvasPattern | null>(null)
  const overlayRef = useRef<HTMLCanvasElement | null>(null)
  const avatarPosRef = useRef({ r: 0, c: 0 })

const THEME_PARTICLE_PARAMS: Record<string, { spawnPerSec: number, sizeRange: [number, number], lifeRange: [number,number], rotSpeedRange: [number,number], depthRange: [number,number], parallaxStrength: number }> = {
    // Increased sizeRange and lifeRange for bigger and longer-lived particles
    forest: { spawnPerSec: 24, sizeRange: [20, 52], lifeRange: [7000,14000], rotSpeedRange: [1.0, 4.0], depthRange: [0.2,1.0], parallaxStrength: 18 },
    desert: { spawnPerSec: 12, sizeRange: [24, 50], lifeRange: [5000,9000], rotSpeedRange: [0.6, 2.0], depthRange: [0.4,1.0], parallaxStrength: 8 },
    river:  { spawnPerSec: 14, sizeRange: [16, 40], lifeRange: [6000,12000], rotSpeedRange: [0.5, 2.5], depthRange: [0.1,0.8], parallaxStrength: 22 },
}

  useEffect(() => {
    let mounted = true
  loadThemeAssets(theme).then(assets => {
      if (!mounted) return
      if (assets.floorImage) {
        floorImageRef.current = assets.floorImage
        // clear any existing cached patterns for this theme
  patternCacheRef.current.forEach((_, k) => { if (k.startsWith(theme + '-')) patternCacheRef.current.delete(k) })
        setPatternReady(true)
      } else {
        fallbackRef.current = assets.fallbackColor
        setPatternReady(true)
      }
  if (assets.particleImage) particleImageRef.current = assets.particleImage
    })
    // also try to load wall image if present
    // wall image loading is handled by loadThemeAssets (we could extend it) but try to load a standard 'dirt-square.png'
    try {
      const wurl = new URL(`../../assets/game-assets/maze-game/dirt-square.png`, import.meta.url).href
      const wimg = new Image()
      wimg.crossOrigin = 'anonymous'
      wimg.onload = () => { wallImageRef.current = wimg }
      wimg.onerror = () => { wallImageRef.current = null }
      wimg.src = wurl
    } catch (err) {
      wallImageRef.current = null
    }
    return () => { mounted = false }
  }, [theme])

  useEffect(() => {
    // place avatar at 0,0
    setPos({ r: 0, c: 0 })
  }, [maze])

  useEffect(() => { avatarPosRef.current = pos }, [pos])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const DPR = window.devicePixelRatio || 1
    const size = Math.min(canvas.parentElement?.clientWidth || 300, 400)
    canvas.width = Math.round(size * DPR)
    canvas.height = Math.round(size * DPR)
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    // size overlay canvas to match
    const overlay = overlayRef.current
    if (overlay) {
      overlay.width = Math.round(size * DPR)
      overlay.height = Math.round(size * DPR)
      overlay.style.width = `${size}px`
      overlay.style.height = `${size}px`
      const octx = overlay.getContext('2d')!
      octx.setTransform(DPR,0,0,DPR,0,0)
    }

    const rows = maze.rows
    const cols = maze.cols
    const cellW = size / cols

    // draw floor: either textured pattern (tiled to cell size) or fallback color
    const cacheKey = `${theme}-${Math.round(cellW)}`
    let pattern = patternCacheRef.current.get(cacheKey)
    if (!pattern && floorImageRef.current) {
      // create an offscreen canvas to draw the image scaled to cellW so it tiles at cell size
      const tile = document.createElement('canvas')
      tile.width = Math.max(1, Math.round(cellW))
      tile.height = Math.max(1, Math.round(cellW))
      const tctx = tile.getContext('2d')!
      // draw the source image into the tile, covering it while preserving aspect
      tctx.drawImage(floorImageRef.current, 0, 0, tile.width, tile.height)
      pattern = tctx.createPattern(tile, 'repeat')!
      patternCacheRef.current.set(cacheKey, pattern)
    }

    if (pattern) {
      ctx.fillStyle = pattern as unknown as CanvasPattern as any
      ctx.fillRect(0, 0, size, size)
    } else {
      ctx.fillStyle = fallbackRef.current || '#081220'
      ctx.fillRect(0, 0, size, size)
    }

    // draw walls
    // draw walls using filled rectangles with wall pattern or solid color
    const wallCacheKey = `${theme}-wall-${Math.round(cellW)}`
    let wallPattern = wallPatternRef.current || patternCacheRef.current.get(wallCacheKey)
    if (!wallPattern && wallImageRef.current) {
      const tile = document.createElement('canvas')
      tile.width = Math.max(1, Math.round(cellW))
      tile.height = Math.max(1, Math.round(cellW))
      const tctx = tile.getContext('2d')!
      tctx.drawImage(wallImageRef.current, 0, 0, tile.width, tile.height)
      wallPattern = tctx.createPattern(tile, 'repeat')!
      patternCacheRef.current.set(wallCacheKey, wallPattern)
      wallPatternRef.current = wallPattern
    }
    ctx.fillStyle = wallPattern ? (wallPattern as unknown as CanvasPattern as any) : '#ffffff'
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW
        const y = r * cellW
        const cell = maze.grid[r][c]
        // draw a thin filled rect for each wall side
        const half = Math.max(2, Math.round(cellW * 0.08))
        if (cell.walls.top) {
          ctx.fillRect(x, y - half/2, cellW, half)
        }
        if (cell.walls.left) {
          ctx.fillRect(x - half/2, y, half, cellW)
        }
        if (cell.walls.right) {
          ctx.fillRect(x + cellW - half/2, y, half, cellW)
        }
        if (cell.walls.bottom) {
          ctx.fillRect(x, y + cellW - half/2, cellW, half)
        }
      }
    }

  // draw avatar
    const avatarX = pos.c * cellW + cellW / 2
    const avatarY = pos.r * cellW + cellW / 2
    ctx.fillStyle = '#ffcc00'
    ctx.beginPath(); ctx.arc(avatarX, avatarY, Math.max(4, cellW * 0.18), 0, Math.PI * 2); ctx.fill()

  // draw goal as a pulsing circle in bottom-right
  const goalX = (cols - 1) * cellW + cellW / 2
  const goalY = (rows - 1) * cellW + cellW / 2
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300)
  ctx.beginPath()
  ctx.fillStyle = '#ffd54f'
  ctx.arc(goalX, goalY, Math.max(6, cellW * 0.22) * pulse, 0, Math.PI * 2)
  ctx.fill()

  }, [maze, pos, patternReady])

  // overlay particles canvas
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    const ctx = overlay.getContext('2d')!
    let raf = 0
    const particles: Array<{ x: number, y: number, vx: number, vy: number, life: number, size: number, rot?: number, drot?: number, depth?: number }> = []

    let last = Date.now()
    function frame() {
      const now = Date.now()
      const dt = now - last
      last = now
      if (!overlay) return
      const DPR = window.devicePixelRatio || 1
      const sizePx = Math.min(overlay.parentElement?.clientWidth || 300, 400)
  overlay.width = Math.round(sizePx * DPR)
  overlay.height = Math.round(sizePx * DPR)
  overlay.style.width = `${sizePx}px`
  overlay.style.height = `${sizePx}px`
  // set transform so 1 unit = 1 CSS pixel while accounting for DPR
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      const w = sizePx
      const h = sizePx
      ctx.clearRect(0,0,w,h)
      // spawn probabilistically
  const params = THEME_PARTICLE_PARAMS[theme] || THEME_PARTICLE_PARAMS.forest
  const expected = params.spawnPerSec * (dt/1000)
  const pType = theme === 'river' ? 'bubble' : (theme === 'desert' ? 'dust' : 'leaf')
  // spawn count based on expected value for this frame (fps-independent)
  let toSpawn = Math.floor(expected)
  if (Math.random() < (expected - toSpawn)) toSpawn++
  // cap to avoid bursts
  toSpawn = Math.min(toSpawn, 12)
      for (let s = 0; s < toSpawn; s++) {
        // choose depth and size per params
        const depth = params.depthRange[0] + Math.random() * (params.depthRange[1] - params.depthRange[0])
        const size = params.sizeRange[0] + Math.random() * (params.sizeRange[1] - params.sizeRange[0])
        const life = params.lifeRange[0] + Math.random() * (params.lifeRange[1] - params.lifeRange[0])
        const rot = (Math.random() * Math.PI * 2)
  // base rotational speed in radians/sec; randomly pick sign so some spin clockwise, some counter
  const baseDrot = params.rotSpeedRange[0] + Math.random() * (params.rotSpeedRange[1] - params.rotSpeedRange[0])
  const drot = (Math.random() < 0.5 ? -1 : 1) * baseDrot
        const baseX = Math.random() * w
        const baseY = pType === 'bubble' ? h + 10 : -10
  // velocities in px/sec; slower, angled
  const vx = (-30 + Math.random()*60) * (1/depth)
  const vy = (pType==='bubble' ? -30 - Math.random()*80 : 20 + Math.random()*60) * (1/depth)
  particles.push({ x: baseX, y: baseY, vx, vy, life, size, rot, drot, depth })
      }

      for (let i = particles.length -1; i >=0; i--) {
        const p: any = particles[i]
        // velocities are px/sec, convert by dt/1000
        p.x += p.vx * (dt/1000)
        p.y += p.vy * (dt/1000)
        p.life -= dt
  const alpha = Math.max(0, Math.min(1, p.life / 3000))
        ctx.save()
        ctx.globalAlpha = alpha
        const img = particleImageRef.current
          if (img) {
          // parallax: offset particle based on avatar and depth
          const av = avatarPosRef.current
          const parallaxFactor = params.parallaxStrength * (1 - (p.depth ?? 0.5))
            // convert avatar cell-based offset into pixels
            const px = p.x + (av.c - (maze.cols / 2)) * (sizePx / maze.cols) * parallaxFactor
            const py = p.y + (av.r - (maze.rows / 2)) * (sizePx / maze.rows) * parallaxFactor
            ctx.translate(px, py)
          // rotate even if rotation is 0; update rotation using drot (radians/sec)
          if (typeof p.rot === 'number') {
            ctx.rotate(p.rot)
            p.rot += (p.drot ?? 0) * (dt/1000)
          }
          ctx.drawImage(img, -p.size/2, -p.size/2, p.size, p.size)
        } else {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (p.life/5000 > 1 ? 1 : Math.max(0.1, p.life/5000)), 0, Math.PI*2); ctx.fill()
        }
        ctx.restore()
        if (p.life <= 0) particles.splice(i,1)
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [theme])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const key = e.key
      const { r, c } = pos
      let nr = r, nc = c
      const cell = maze.grid[r][c]
      if ((key === 'ArrowUp' || key === 'w') && !cell.walls.top) nr = r - 1
      if ((key === 'ArrowDown' || key === 's') && !cell.walls.bottom) nr = r + 1
      if ((key === 'ArrowLeft' || key === 'a') && !cell.walls.left) nc = c - 1
      if ((key === 'ArrowRight' || key === 'd') && !cell.walls.right) nc = c + 1
      if (nr !== r || nc !== c) {
        setPos({ r: nr, c: nc })
        setMoves(m => m + 1)
      }

      // win if at exit; guard to call once
      if (!finishedRef.current && nr === maze.rows - 1 && nc === maze.cols - 1) {
        finishedRef.current = true
        const time = Date.now() - startedAt
        onEnd({ won: true, timeMs: time, moves: moves + (nr !== r || nc !== c ? 1 : 0) })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pos, maze, onEnd, moves, startedAt])

  // helper to move from UI buttons
  function attemptMove(dir: 'up' | 'down' | 'left' | 'right') {
    const { r, c } = pos
    let nr = r, nc = c
    const cell = maze.grid[r][c]
    if (dir === 'up' && !cell.walls.top) nr = r - 1
    if (dir === 'down' && !cell.walls.bottom) nr = r + 1
    if (dir === 'left' && !cell.walls.left) nc = c - 1
    if (dir === 'right' && !cell.walls.right) nc = c + 1
    if (nr !== r || nc !== c) {
      setPos({ r: nr, c: nc })
      setMoves(m => m + 1)
    }
    if (!finishedRef.current && nr === maze.rows - 1 && nc === maze.cols - 1) {
      finishedRef.current = true
      const time = Date.now() - startedAt
      onEnd({ won: true, timeMs: time, moves: moves + (nr !== r || nc !== c ? 1 : 0) })
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 420, height: 420, position: 'relative' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
          <canvas ref={overlayRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'block' }} />
        </div>
      </div>
      <div style={{ color: '#fff', marginTop: 8 }}>
        <div>Use WASD or the arrows below to move. Reach the bottom-right to win.</div>
        <div style={{ marginTop: 8 }}>Moves: {moves} • Time: {Math.floor((Date.now() - startedAt) / 1000)}s</div>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '48px 48px 48px', gap: 8, alignItems: 'center' }}>
            <div />
            <button aria-label="Up" onClick={() => attemptMove('up')} style={{ width: 48, height: 48, borderRadius: 8, background: 'linear-gradient(180deg,#ffffff11,#ffffff06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>▲</button>
            <div />
            <button aria-label="Left" onClick={() => attemptMove('left')} style={{ width: 48, height: 48, borderRadius: 8, background: 'linear-gradient(180deg,#ffffff11,#ffffff06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>◀</button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 12, color: '#ddd' }}>WASD</div>
            </div>
            <button aria-label="Right" onClick={() => attemptMove('right')} style={{ width: 48, height: 48, borderRadius: 8, background: 'linear-gradient(180deg,#ffffff11,#ffffff06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>▶</button>
            <div />
            <button aria-label="Down" onClick={() => attemptMove('down')} style={{ width: 48, height: 48, borderRadius: 8, background: 'linear-gradient(180deg,#ffffff11,#ffffff06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>▼</button>
            <div />
            <div />
          </div>
        </div>
      </div>
    </div>
  )
}
