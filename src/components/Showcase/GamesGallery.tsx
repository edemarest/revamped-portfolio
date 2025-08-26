import { useState } from 'react'
import styles from './GamesGallery.module.css'
import MazeGame from '../../games/MazeGame/MazeGame'

export default function GamesGallery() {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.galleryRoot}>
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.thumb}>Maze Game</div>
          <div className={styles.title}>Maze — find the exit</div>
          <div className={styles.actions}>
            <button className={styles.openBtn} onClick={() => setOpen(true)}>Open</button>
          </div>
        </div>
      </div>

      {open && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal>
          <div className={styles.modalPanel}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>Close</button>
            </div>
            <MazeGame />
          </div>
        </div>
      )}
    </div>
  )
}
