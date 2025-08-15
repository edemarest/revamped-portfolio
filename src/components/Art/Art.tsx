

import React from 'react'
import styles from './Art.module.css'
import caroline from '../../assets/art/caroline.png'
import ember from '../../assets/art/ember.jpg'
import dabi from '../../assets/art/dabi.png'
import gibdo from '../../assets/art/gibdo.png'
import hawks from '../../assets/art/hawks.png'
import eva from '../../assets/art/eva.png'

const artImages = [
  caroline,
  ember,
  dabi,
  gibdo,
  hawks,
  eva,
]

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
