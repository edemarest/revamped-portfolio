import { useEffect, useRef, useState } from 'react'
import type { Maze } from './maze'
import { loadThemeAssets } from './theme'

export default function GameScreen({ maze, onEnd, theme: _theme }: { maze: Maze, onEnd: (result: any) => void, theme?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [pos, setPos] = useState({ r: 0, c: 0 })
  const movesRef = useRef(0)
  const startedAtRef = useRef<number | null>(null)
  const [assets, setAssets] = useState<any>(null)
  const patternCache = useRef<{ floor?: CanvasPattern | null, wall?: CanvasPattern | null }>({})

  useEffect(() => { setPos({ r: 0, c: 0 }); movesRef.current = 0; startedAtRef.current = Date.now() }, [maze])

  useEffect(() => {
    let mounted = true
    const themeId = (_theme as any) || 'forest'
    loadThemeAssets(themeId as any).then(a => { if (mounted) setAssets(a) })
    return () => { mounted = false }
  }, [_theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const DPR = window.devicePixelRatio || 1
    const size = Math.min(canvas.parentElement?.clientWidth || 300, 420)
    canvas.width = Math.round(size * DPR)
    canvas.height = Math.round(size * DPR)
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
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

    // draw avatar (circle)
    const avatarCx = pos.c*cell + cell/2
    const avatarCy = pos.r*cell + cell/2
    const avatarR = Math.max(6, (cell/2) - Math.floor(cell * 0.22))
    ctx.fillStyle = '#ffd166'
    ctx.beginPath()
    ctx.arc(avatarCx, avatarCy, avatarR, 0, Math.PI * 2)
    ctx.fill()

    // movement handler that checks walls on current cell
    function attemptMove(dir: 'up'|'down'|'left'|'right'){
      const { r,c } = pos
      const dr = dir === 'up' ? -1 : dir === 'down' ? 1 : 0
      const dc = dir === 'left' ? -1 : dir === 'right' ? 1 : 0
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return
      const cur = maze.grid[r][c]
      if (dr === -1 && cur.walls.top) return
      if (dr === 1 && cur.walls.bottom) return
      if (dc === -1 && cur.walls.left) return
      if (dc === 1 && cur.walls.right) return
      setPos({ r: nr, c: nc })
      movesRef.current += 1
      if (nr === rows -1 && nc === cols -1) {
        const time = (startedAtRef.current ? Date.now() - startedAtRef.current : 0)
        onEnd({ won: true, timeMs: time, moves: movesRef.current })
      }
    }

    function onKey(e: KeyboardEvent){
      const k = e.key
      if (k === 'ArrowUp' || k === 'w') attemptMove('up')
      if (k === 'ArrowDown' || k === 's') attemptMove('down')
      if (k === 'ArrowLeft' || k === 'a') attemptMove('left')
      if (k === 'ArrowRight' || k === 'd') attemptMove('right')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pos, maze, onEnd])

  return (
    <div style={{ padding: 12, color: '#fff' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 420, height: 420, position: 'relative' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
        </div>
      </div>
      <div style={{ marginTop: 8, color: '#ddd' }}>Use WASD or arrow keys to move. Reach the bottom-right to win.</div>
    </div>
  )
}
