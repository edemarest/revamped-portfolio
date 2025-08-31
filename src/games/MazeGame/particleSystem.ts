import type { Maze } from './maze'
import type { ThemeId } from './theme'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  rotV: number
  scale: number
  alpha: number
  age: number
  ttl: number
  img: HTMLImageElement | null
  w: number
  h: number
}

type ThemeConfig = {
  spawnRate: number // particles per second
  max: number
  speedRange: [number, number]
  scaleRange: [number, number]
  alphaRange: [number, number]
  ttlRange: [number, number]
}

function rand(a: number, b: number) { return a + Math.random() * (b - a) }

function clamp(v:number, a:number, b:number){ return Math.max(a, Math.min(b,v)) }

function themeConfigFor(id: ThemeId, cells: number): ThemeConfig {
  // scale counts with cells and cap
  const factor = clamp(cells / 100, 0.5, 2)
  if (id === 'forest') return { spawnRate: 0.6 * factor, max: Math.round(60 * factor), speedRange: [8, 40], scaleRange: [0.5,0.95], alphaRange: [0.55,1], ttlRange: [4,10] }
  if (id === 'river') return { spawnRate: 0.35 * factor, max: Math.round(45 * factor), speedRange: [6,24], scaleRange: [0.35,0.75], alphaRange: [0.35,0.7], ttlRange: [6,14] }
  // desert
  return { spawnRate: 0.3 * factor, max: Math.round(48 * factor), speedRange: [18,80], scaleRange: [0.6,1.0], alphaRange: [0.7,1], ttlRange: [5,12] }
}

export default class ParticleSystem {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dpr: number = 1
  maze: Maze
  particles: Particle[] = []
  free: number[] = []
  running = false
  raf = 0
  last = 0
  spawnAccumulator = 0
  cfg: ThemeConfig
  theme: ThemeId
  img: HTMLImageElement | null = null

  constructor(canvas: HTMLCanvasElement, maze: Maze, theme: ThemeId, img: HTMLImageElement | null){
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no 2d context')
    this.ctx = ctx
    this.maze = maze
    this.theme = theme
    this.img = img
    this.dpr = window.devicePixelRatio || 1
    this.cfg = themeConfigFor(theme, maze.rows * maze.cols)
    // pre-alloc
    for (let i=0;i<this.cfg.max;i++){ this.particles.push({x:0,y:0,vx:0,vy:0,rot:0,rotV:0,scale:1,alpha:0,age:0,ttl:0,img:null,w:0,h:0}); this.free.push(i) }
  }

  resize(cssW:number, cssH:number, dpr = window.devicePixelRatio || 1){
    this.dpr = dpr
    this.canvas.width = Math.round(cssW * dpr)
    this.canvas.height = Math.round(cssH * dpr)
    this.canvas.style.width = `${cssW}px`
    this.canvas.style.height = `${cssH}px`
    this.ctx.setTransform(dpr,0,0,dpr,0,0)
  }

  setTheme(theme: ThemeId, img: HTMLImageElement | null){
    this.theme = theme
    this.img = img
    this.cfg = themeConfigFor(theme, this.maze.rows * this.maze.cols)
    // reallocate if needed
    if (this.cfg.max > this.particles.length){
      const extra = this.cfg.max - this.particles.length
      for (let i=0;i<extra;i++){ this.particles.push({x:0,y:0,vx:0,vy:0,rot:0,rotV:0,scale:1,alpha:0,age:0,ttl:0,img:null,w:0,h:0}); this.free.push(this.particles.length-1) }
    }
  }

  start(){
    if (this.running) return
    this.running = true
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  stop(){
    this.running = false
    cancelAnimationFrame(this.raf)
    this.clear()
  }

  clear(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    // reset pool
    this.free = []
    for (let i=0;i<this.particles.length;i++) this.free.push(i)
  }

  tick = (now:number) => {
    if (!this.running) return
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now
    // spawn logic
    const rate = this.cfg.spawnRate
    this.spawnAccumulator += rate * dt
    while (this.spawnAccumulator >= 1){ this.spawn(); this.spawnAccumulator -= 1 }

    // update
    const ctx = this.ctx
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    const cw = this.canvas.width / this.dpr, ch = this.canvas.height / this.dpr

    for (let i=0;i<this.particles.length;i++){
      const p = this.particles[i]
      if (p.ttl <= 0) continue
      p.age += dt
      if (p.age >= p.ttl){ p.ttl = 0; this.free.push(i); continue }

      // simple behavior per theme
      if (this.theme === 'forest'){
        // gentle horizontal drift and bob
        p.x += p.vx * dt
        p.y += p.vy * dt + Math.sin((p.age*2 + i) ) * 0.3
        p.rot += p.rotV * dt
      } else if (this.theme === 'river'){
        p.x += p.vx * dt
        p.y += p.vy * dt + Math.sin((p.age*1.5 + i))*0.15
        p.rot += p.rotV * dt * 0.3
      } else {
        // desert tumbleweed: roll and reflect on boundaries
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.rotV * dt
        // reflect off edges
        if (p.x < 0){ p.x = 0; p.vx = Math.abs(p.vx)*0.6 }
        if (p.x > cw) { p.x = cw; p.vx = -Math.abs(p.vx)*0.6 }
        if (p.y < 0){ p.y = 0; p.vy = Math.abs(p.vy)*0.6 }
        if (p.y > ch){ p.y = ch; p.vy = -Math.abs(p.vy)*0.6 }
      }

      // fade in/out based on age
      const lifeRatio = p.age / p.ttl
      let alpha = p.alpha
      if (lifeRatio < 0.12) alpha *= (lifeRatio / 0.12)
      else if (lifeRatio > 0.85) alpha *= (1 - (lifeRatio - 0.85) / 0.15)

      // draw
      ctx.save()
      ctx.globalAlpha = clamp(alpha, 0, 1)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      const w = p.w * p.scale, h = p.h * p.scale
      if (p.img) ctx.drawImage(p.img, -w/2, -h/2, w, h)
      else {
        // fallback: small circle
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.beginPath(); ctx.ellipse(0,0,4*p.scale,2*p.scale,0,0,Math.PI*2); ctx.fill()
      }
      ctx.restore()
    }

    this.raf = requestAnimationFrame(this.tick)
  }

  spawn(){
    if (!this.free.length) return
    const idx = this.free.pop()!
    const p = this.particles[idx]
    const cfg = this.cfg
    // spawn across canvas
    const cw = this.canvas.width / this.dpr, ch = this.canvas.height / this.dpr
    p.x = Math.random() * cw
    p.y = Math.random() * ch
    const speed = rand(cfg.speedRange[0], cfg.speedRange[1])
    const angle = (Math.random() * Math.PI * 2)
    p.vx = Math.cos(angle) * speed
    p.vy = Math.sin(angle) * speed * (this.theme === 'river' ? 0.25 : 1)
    p.rot = Math.random() * Math.PI * 2
    p.rotV = (Math.random() - 0.5) * 1.5
    p.scale = rand(cfg.scaleRange[0], cfg.scaleRange[1])
    p.alpha = rand(cfg.alphaRange[0], cfg.alphaRange[1])
    p.age = 0
    p.ttl = rand(cfg.ttlRange[0], cfg.ttlRange[1])
    p.img = this.img
    if (p.img){
      // scale sprite to a reasonable base pixel size relative to canvas
      const cw = this.canvas.width / this.dpr, ch = this.canvas.height / this.dpr
      const baseTarget = Math.round(Math.min(Math.max(12, Math.min(cw, ch) * 0.06), 64)) // 6% of smaller dim, clamped
      const maxImgDim = Math.max(p.img.width || baseTarget, p.img.height || baseTarget)
      const scaleFromImage = baseTarget / maxImgDim
      p.w = Math.max(4, Math.round((p.img.width || baseTarget) * scaleFromImage))
      p.h = Math.max(4, Math.round((p.img.height || baseTarget) * scaleFromImage))
    } else { p.w = 8; p.h = 8 }
  }
}
