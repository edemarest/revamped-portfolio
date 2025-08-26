export type ThemeId = 'forest' | 'desert' | 'river'

type ThemeDef = {
  id: ThemeId
  floorFile: string
  wallFile?: string
  fallbackColor: string
  goalColor?: string
  particleType?: 'leaf' | 'dust' | 'bubble'
  particleSpriteFile?: string
}

const THEMES: Record<ThemeId, ThemeDef> = {
  forest: { id: 'forest', floorFile: 'grass-square.jpg', wallFile: 'dirt-square.png', fallbackColor: '#2b6b31', goalColor: '#ffd54f', particleType: 'leaf', particleSpriteFile: 'leaf.png' },
  desert: { id: 'desert', floorFile: 'desert-square.jpeg', wallFile: 'dirt-square.png', fallbackColor: '#c99b5a', goalColor: '#ffcc88', particleType: 'dust', particleSpriteFile: 'tumbleweed.png' },
  river: { id: 'river', floorFile: 'water-square.jpg', wallFile: 'dirt-square.png', fallbackColor: '#1e6fa8', goalColor: '#88ddff', particleType: 'bubble', particleSpriteFile: 'grass-blade.png' },
}

export async function loadThemeAssets(themeId: ThemeId) {
  const def = THEMES[themeId] || THEMES.forest

  async function loadImage(filename: string): Promise<HTMLImageElement | null> {
    try {
      const url = new URL(`../../assets/game-assets/maze-game/${filename}`, import.meta.url).href
      return await new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          console.info(`[MazeGame] loaded image ${filename} -> ${url}`)
          resolve(img)
        }
        img.onerror = () => {
          console.warn(`[MazeGame] failed to load image ${filename} -> ${url}`)
          resolve(null)
        }
        img.src = url
      })
    } catch (err) {
      console.warn(`[MazeGame] error resolving image ${filename}:`, err)
      return null
    }
  }

  const floorImage = await loadImage(def.floorFile)
  let particleImage: HTMLImageElement | null = null
  if (def.particleSpriteFile) {
    particleImage = await loadImage(def.particleSpriteFile)
    if (!particleImage) {
      // try alternate extension (.png <-> .svg) in case file was renamed
      const parts = def.particleSpriteFile.split('.')
      if (parts.length > 1) {
        const altExt = parts.pop() === 'png' ? 'svg' : 'png'
        const altName = parts.join('.') + '.' + altExt
        particleImage = await loadImage(altName)
        if (particleImage) {
          console.warn(`[MazeGame] particle sprite ${def.particleSpriteFile} missing, loaded ${altName} instead`)
        }
      }
    }
    if (!particleImage) {
      console.warn(`[MazeGame] particle sprite ${def.particleSpriteFile} failed to load for theme ${themeId}`)
    }
  }

  return {
    floorImage,
    particleImage,
    fallbackColor: def.fallbackColor,
    def,
  }
}

export const AVAILABLE_THEMES: ThemeId[] = ['forest', 'desert', 'river']
