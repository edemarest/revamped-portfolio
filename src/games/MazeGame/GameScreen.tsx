import { useEffect, useRef, useState } from 'react'
import type { Maze } from './maze'
import { loadThemeAssets } from './theme'
import ParticleSystem from './particleSystem'

export default function GameScreen({ maze, onEnd, theme: _theme, avatar: _avatar }: { maze: Maze, onEnd: (result: any) => void, theme?: string, avatar?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particleRef = useRef<HTMLCanvasElement | null>(null)
  const [pos, setPos] = useState({ r: 0, c: 0 })
  const movesRef = useRef(0)
  const startedAtRef = useRef<number | null>(null)
  const [assets, setAssets] = useState<any>(null)
  const patternCache = useRef<{ floor?: CanvasPattern | null, wall?: CanvasPattern | null }>({})
  const [avatarImg, setAvatarImg] = useState<HTMLImageElement | null>(null)
  const avatarImgRef = useRef<HTMLImageElement | null>(null)
  const prevPosRef = useRef(pos)
  const directionRef = useRef<'up'|'down'|'left'|'right' | null>(null)
  const particleCanvasSizeRef = useRef({ w: 0, h: 0 })
  const animRef = useRef<{ id: number | null, start: number, duration: number }>({ id: null, start: 0, duration: 120 })
  const posRef = useRef(pos)

  useEffect(() => { setPos({ r: 0, c: 0 }); movesRef.current = 0; startedAtRef.current = Date.now() }, [maze])

  useEffect(() => {
    let mounted = true
    const themeId = (_theme as any) || 'forest'
  loadThemeAssets(themeId as any).then(a => { if (mounted) { setAssets(a); drawAll(1) } })
    return () => { mounted = false }
  }, [_theme])


  useEffect(() => {
    let mounted = true
    async function loadAvatar(name?: string){
      if (!name) { setAvatarImg(null); return }
      async function tryLoad(filename: string){
        return await new Promise<HTMLImageElement | null>((resolve) => {
          try {
            const url = new URL(`../../assets/game-assets/maze-game/${filename}`, import.meta.url).href
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = () => resolve(null)
            img.src = url
          } catch (err) { resolve(null) }
        })
      }
      const png = await tryLoad(`${name}.png`)
    if (png) { if (mounted) { avatarImgRef.current = png; setAvatarImg(png); prevPosRef.current = pos; drawAll(1) }; return }
      const svg = await tryLoad(`${name}.svg`)
  if (svg) { if (mounted) { avatarImgRef.current = svg; setAvatarImg(svg); prevPosRef.current = pos; drawAll(1) }; return }
    if (mounted) { avatarImgRef.current = null; setAvatarImg(null) }
    }
    loadAvatar(_avatar)
    return () => { mounted = false }
  }, [_avatar])

  // particle system lifecycle
  useEffect(() => {
  const pcanvas = particleRef.current
    const canvas = canvasRef.current
    if (!pcanvas || !canvas) return
    if (!assets) return
    // create particle system
    const sys = new ParticleSystem(pcanvas, maze, (_theme as any) || 'forest', assets.particleImage || null)
    // size overlay to match maze canvas
    const cssW = canvas.clientWidth || 420
    const cssH = canvas.clientHeight || 420
    sys.resize(cssW, cssH)
    sys.start()
    // store on element for potential debugging
    ;(pcanvas as any).__ps = sys
    return () => { sys.stop(); delete (pcanvas as any).__ps }
  }, [assets, maze, _theme])

  // when assets change, invalidate any cached patterns so drawAll rebuilds them immediately
  useEffect(() => {
    patternCache.current = {}
    drawAll(1)
  }, [assets])

  // draw helper used by static draws and animation frames
  function drawAll(interp = 1){
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const DPR = window.devicePixelRatio || 1
    const size = Math.min(canvas.parentElement?.clientWidth || 300, 420)
    canvas.width = Math.round(size * DPR)
    canvas.height = Math.round(size * DPR)
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    // ensure particle overlay matches, but avoid resizing every frame which clears it
    if (particleRef.current){
      const needW = Math.round(size * DPR)
      const needH = Math.round(size * DPR)
      if (particleCanvasSizeRef.current.w !== needW || particleCanvasSizeRef.current.h !== needH) {
        particleRef.current.width = needW
        particleRef.current.height = needH
        particleRef.current.style.width = `${size}px`
        particleRef.current.style.height = `${size}px`
        particleCanvasSizeRef.current.w = needW
        particleCanvasSizeRef.current.h = needH
      }
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

    const rows = maze.rows, cols = maze.cols
    const cell = size / Math.max(rows, cols)

    // clear
    ctx.clearRect(0,0,size,size)

    // prepare patterns (cache per canvas)
    patternCache.current = patternCache.current || {}
    // floor pattern: tile at cell size so it looks seamless per tile
    if (!patternCache.current.floor) {
      if (assets && assets.floorImage) {
        const tile = document.createElement('canvas')
        tile.width = Math.max(1, Math.round(cell))
        tile.height = Math.max(1, Math.round(cell))
        const tctx = tile.getContext('2d')!
        // draw the floor image scaled to fill the cell tile
        tctx.drawImage(assets.floorImage, 0, 0, tile.width, tile.height)
        patternCache.current.floor = ctx.createPattern(tile, 'repeat')
      } else {
        patternCache.current.floor = null
      }
    }
    if (!patternCache.current.wall) {
      if (assets && assets.wallImage) {
        const tileW = Math.max(1, Math.round(cell))
        const tile = document.createElement('canvas')
        tile.width = tileW
        tile.height = tileW
        const tctx = tile.getContext('2d')!
        tctx.drawImage(assets.wallImage, 0, 0, tileW, tileW)
        patternCache.current.wall = ctx.createPattern(tile, 'repeat')
      } else {
        patternCache.current.wall = null
      }
    }

    // draw floor (pattern or fallback)
    if (patternCache.current.floor) {
      ctx.fillStyle = patternCache.current.floor
      ctx.fillRect(0,0,size,size)
    } else {
      ctx.fillStyle = assets?.fallbackColor || '#123a1f'
      ctx.fillRect(0,0,size,size)
    }

    // wall thickness in css pixels
    const wallW = Math.max(2, Math.floor(cell * 0.12))

  // draw walls as filled rects using wall pattern or solid
  if (patternCache.current.wall) ctx.fillStyle = patternCache.current.wall
  else ctx.fillStyle = '#e9e9e9'
    for (let r=0;r<rows;r++){
      for (let c=0;c<cols;c++){
        const cellObj = maze.grid[r][c]
        const x = c*cell, y = r*cell
        if (cellObj.walls.top) ctx.fillRect(x, y, cell, wallW)
        if (cellObj.walls.left) ctx.fillRect(x, y, wallW, cell)
        if (cellObj.walls.right) ctx.fillRect(x + cell - wallW, y, wallW, cell)
        if (cellObj.walls.bottom) ctx.fillRect(x, y + cell - wallW, cell, wallW)
      }
    }

    // draw goal (circle)
    const goalPadding = Math.max(4, Math.floor(cell * 0.18))
    const goalCx = (cols-1)*cell + cell/2
    const goalCy = (rows-1)*cell + cell/2
    const goalR = (cell/2) - goalPadding
    ctx.fillStyle = '#06d6a0'
    ctx.beginPath()
    ctx.arc(goalCx, goalCy, Math.max(6, goalR), 0, Math.PI * 2)
    ctx.fill()

    // avatar interpolation (lerp between prev and pos)
    const from = prevPosRef.current
    const to = pos
    const ir = from.r + (to.r - from.r) * interp
    const ic = from.c + (to.c - from.c) * interp
    const avatarCx = ic*cell + cell/2
    const avatarCy = ir*cell + cell/2
    const avatarR = Math.max(6, (cell/2) - Math.floor(cell * 0.22))

    // bounce easing: overshoot on early phase
    const bounce = Math.sin(Math.min(1, interp) * Math.PI) * 0.18 // scale multiplier
    const drawScale = 1 + bounce

    // draw glow behind avatar
    ctx.save()
    const glowRadius = avatarR * 1.9 * drawScale
    const g = ctx.createRadialGradient(avatarCx, avatarCy, avatarR*0.4, avatarCx, avatarCy, glowRadius)
    g.addColorStop(0, 'rgba(255,215,102,0.45)')
    g.addColorStop(0.5, 'rgba(255,215,102,0.15)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(avatarCx, avatarCy, glowRadius, 0, Math.PI*2); ctx.fill()
    ctx.restore()

  // draw avatar (image or circle fallback) with scale and rotation based on last move
  const imgToDraw = avatarImgRef.current || avatarImg
  if (imgToDraw) {
      // increase avatar size by ~25% for better visibility
      const baseScale = 1.1
      const sizeMultiplier = baseScale * 1.25
      const aw = avatarR * 2 * sizeMultiplier * drawScale
      const ah = avatarR * 2 * sizeMultiplier * drawScale
  // determine rotation angle from last movement direction
  // sprite base orientation: facing UP (0 rad). Map directions accordingly.
  let angle = 0
  const dir = directionRef.current
  if (dir === 'up') angle = 0
  else if (dir === 'right') angle = Math.PI / 2
  else if (dir === 'down') angle = Math.PI
  else if (dir === 'left') angle = -Math.PI / 2
  ctx.save()
  ctx.translate(avatarCx, avatarCy)
  ctx.rotate(angle)
  ctx.drawImage(imgToDraw, -aw / 2, -ah / 2, aw, ah)
  ctx.restore()
    } else {
      ctx.save()
      ctx.translate(avatarCx, avatarCy)
      ctx.scale(drawScale, drawScale)
      ctx.fillStyle = '#ffd166'
      ctx.beginPath()
      ctx.arc(0, 0, avatarR, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  // initial static draw and on asset/maze/avatar changes
  useEffect(() => { drawAll(1) }, [maze, assets, avatarImg])

  // animate when pos changes
  useEffect(() => {
    // cancel any existing
    if (animRef.current.id) cancelAnimationFrame(animRef.current.id)
    animRef.current.start = performance.now()
  const dur = animRef.current.duration
  const start = animRef.current.start
    // start animation
    const step = (t:number) => {
      const progress = Math.min(1, (t - start) / dur)
      // easing (easeOutBack-like using sin for bounce)
      const eased = progress
      drawAll(eased)
      if (progress < 1) {
        animRef.current.id = requestAnimationFrame(step)
      } else {
        // finalize
        prevPosRef.current = pos
        animRef.current.id = null
        drawAll(1)
      }
    }
    animRef.current.id = requestAnimationFrame(step)
    return () => { if (animRef.current.id) cancelAnimationFrame(animRef.current.id) }
  }, [pos])

  // keep posRef in sync so key handler can read latest position without re-binding
  useEffect(() => { posRef.current = pos }, [pos])

  // keyboard handling for movement (stable listener)
  useEffect(() => {
    function attemptMove(dir: 'up'|'down'|'left'|'right'){
      const cur = posRef.current
      const { r, c } = cur
      const rows = maze.rows, cols = maze.cols
      const dr = dir === 'up' ? -1 : dir === 'down' ? 1 : 0
      const dc = dir === 'left' ? -1 : dir === 'right' ? 1 : 0
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return
      const cell = maze.grid[r][c]
      if (dr === -1 && cell.walls.top) return
      if (dr === 1 && cell.walls.bottom) return
      if (dc === -1 && cell.walls.left) return
      if (dc === 1 && cell.walls.right) return
  // set previous for interpolation, then update pos
  prevPosRef.current = { ...cur }
  // remember movement direction for avatar rotation
  directionRef.current = dir
  setPos({ r: nr, c: nc })
      movesRef.current += 1
      if (nr === rows -1 && nc === cols -1) {
        const time = (startedAtRef.current ? Date.now() - startedAtRef.current : 0)
        onEnd({ won: true, timeMs: time, moves: movesRef.current })
      }
    }

    function onKey(e: KeyboardEvent){
      const k = e.key
      if (k === 'ArrowUp' || k === 'w') { e.preventDefault(); attemptMove('up') }
      if (k === 'ArrowDown' || k === 's') { e.preventDefault(); attemptMove('down') }
      if (k === 'ArrowLeft' || k === 'a') { e.preventDefault(); attemptMove('left') }
      if (k === 'ArrowRight' || k === 'd') { e.preventDefault(); attemptMove('right') }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [maze, onEnd])

  return (
    <div style={{ padding: 12, color: '#fff' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 420, height: 420, position: 'relative' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
          <canvas ref={particleRef} style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }} />
        </div>
      </div>
      <div style={{ marginTop: 8, color: '#ddd' }}>Use WASD or arrow keys to move. Reach the bottom-right to win.</div>
    </div>
  )
}
