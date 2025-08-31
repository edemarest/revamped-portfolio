import { useState } from 'react'
import styles from './GamesGallery.module.css'
import MazeGame from '../../games/MazeGame/MazeGame'

type Props = { accent?: string }

function hexToRgb(hex: string) {
  const h = hex.replace('#','')
  const bigint = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

function relativeLuminance(r:number,g:number,b:number){
  const srgb = [r,g,b].map(v=>{
    const s = v/255
    return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4)
  })
  return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2]
}

export default function GamesGallery({ accent = '#2f8f4f' }: Props) {
  const [open, setOpen] = useState(false)
  // Use the public/ assets path so Vite doesn't try to resolve this from src/
  const preview = '/assets/maze-game/maze-preview.png'
  // compute accessible button text color based on accent
  let btnText = '#fff'
  try {
    const { r,g,b } = hexToRgb(accent)
    const lum = relativeLuminance(r,g,b)
    // WCAG suggests contrast threshold; choose text dark if background is light
    btnText = lum > 0.5 ? '#2b2b2b' : '#ffffff'
  } catch(e) {
    btnText = '#fff'
  }
  return (
    <div className={styles.galleryRoot}>
      <div className={styles.cards}>
          <div className={styles.card}>
          <div className={styles.previewCard} style={{ ['--game-accent' as any]: accent, ['--btn-text' as any]: btnText }}>
            <div className={styles.previewInner}>
              <img src={preview} alt="Maze preview" className={styles.previewImage} />
            </div>

            <div className={styles.metaWrapper}>
              <div className={styles.meta}>
                <div className={styles.title}>Wild Paths</div>
                <div className={styles.desc}>Play as an animal and traverse different terrains — pick a theme and grid size, then press Start.</div>
              </div>

              <div className={styles.actions}>
                <button className={styles.openBtn} onClick={() => setOpen(true)}>Open</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <MazeGame onClose={() => setOpen(false)} />
      )}
    </div>
  )
}
