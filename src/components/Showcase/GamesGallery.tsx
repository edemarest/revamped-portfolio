import React, { useState, useEffect } from 'react'
import styles from './Showcase.module.css'
import mazeStyles from '../../games/MazeGame/MazeGame.module.css'
import games from '../../games'
import type { ComponentType } from 'react'

type GameEntry = {
  id: string
  title: string
  componentPreview: ComponentType
  open?: () => void
  component?: ComponentType<any>
}

export default function GamesGallery() {
  const hasGames = games.length > 0
  const [selected, setSelected] = useState<GameEntry | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={styles.comingSoonWrapper}>
      {hasGames ? (
        <div style={{ display: 'flex', gap: 12, padding: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {games.map((g: GameEntry) => (
            <div key={g.id} style={{ width: 260, height: 260, borderRadius: 12, background: '#0b0b0b', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
              <div style={{ color: '#fff', fontWeight: 700 }}>{g.title}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.createElement(g.componentPreview)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setSelected(g)} style={{ flex: 1 }}>Open</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.comingSoonGrid}>
          <div className={styles.constructionIcon}>
            <span style={{ color: '#ff4444', fontWeight: 700 }}>!</span>
          </div>
          <div className={styles.comingSoonButton}>Coming Soon</div>
        </div>
      )}
      <div className={styles.gridBackground} />
      {selected && (
        <div className={mazeStyles.modalOverlay} onClick={() => setSelected(null)}>
          <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} className={mazeStyles.modalCard}>
            <div className={mazeStyles.modalHeader}>
              <div style={{ color: '#fff', fontWeight: 700 }}>{selected.title}</div>
              <div>
                <button className={mazeStyles.closeBtn} onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
            <div style={{ width: '100%', height: '100%' }}>
              {selected.component ? React.createElement(selected.component) : <div style={{ color: '#ddd' }}>No component available</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
