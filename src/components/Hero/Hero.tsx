import styles from './Hero.module.css'
import heroGif from '../../assets/hero-bg.gif'

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.mediaContainer}>
        <img src={heroGif} alt="hero background" className={styles.backgroundGif} />
        <div className={styles.gradientOverlay} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.name}>Ella Demarest</h1>
        <h2 className={styles.title}>Full-Stack Developer</h2>
        <p className={styles.subtitle}>
          Specializing in front-end, back-end, and AI-driven systems.
        </p>
      </div>
    </section>
  )
}
