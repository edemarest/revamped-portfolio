

import React from 'react'
import styles from './Art.module.css'

// Dynamically import all images from assets/art
const artImages = Object.values(
  import.meta.glob('../../assets/art/*.{png,jpg,jpeg,gif}', { eager: true, as: 'url' })
)

export default function Art() {
  return (
    <section className={styles.artSection}>
      <h2 className="section-header">Art</h2>
      <div className={styles.artGrid}>
        {artImages.map((src, i) => (
          <div className={styles.artItem} key={i} style={{ '--random': `${Math.random() * 12 - 6}deg` } as React.CSSProperties}>
            <span className={styles.tapeTop} />
            <img src={src} alt={`Art ${i + 1}`} className={styles.artImg} />
            <span className={styles.tapeBottom} />
          </div>
        ))}
      </div>
    </section>
  )
}
