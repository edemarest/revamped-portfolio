import styles from './Showcase.module.css'
import { FaRegLightbulb } from 'react-icons/fa'
import GamesGallery from './GamesGallery'

export default function Showcase() {
  

  return (
    <section id="showcase" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <FaRegLightbulb className="section-title-icon" />
          Showcase
        </h2>
        <p className="section-body">Interactive games, puzzles, and demos utilizing AI and neat algorithms.</p>
      </div>

      <div className={styles.comingSoonWrapper}>
        <GamesGallery />
        <div className={styles.gridBackground} />
      </div>
    </section>
  )
}
