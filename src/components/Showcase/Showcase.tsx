import Masonry from 'react-masonry-css'
import styles from './Showcase.module.css'
import { FaRegLightbulb, FaTools } from 'react-icons/fa'
import { useEffect, useState } from 'react'

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
}

export default function Showcase() {
  const [typingDone, setTypingDone] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setTypingDone(true), 2200)
    return () => clearTimeout(timer)
  }, [])
  return (
    <section id="showcase" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <FaRegLightbulb className="section-title-icon" />
          Showcase
        </h2>
        <p className="section-body">
          Interactive games, puzzles, and demos utilizing AI and neat algorithms.
        </p>
      </div>
      <div className={styles.comingSoonWrapper}>
        <div className={styles.comingSoonGrid}>
          <div className={styles.constructionIcon}>
            <FaTools size={32} />
          </div>
          <div
            className={`${styles.comingSoonButton} ${styles.comingSoonTyping} ${typingDone ? styles.done : ''}`}
          >
            Coming Soon
          </div>
        </div>
        <div className={styles.gridBackground} />
      </div>
      {/* Uncomment below when ready to show tools */}
      {/* <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        <FunFact />
        <PetPainter />
      </Masonry> */}
    </section>
  )
}
