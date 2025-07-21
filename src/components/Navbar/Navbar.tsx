import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li><a href="#hero" className={styles.link}>Home</a></li>
        <li><a href="#work" className={styles.link}>Projects</a></li>
        <li><a href="#playground" className={styles.link}>Playground</a></li>
        <li><a href="#art" className={styles.link}>Art</a></li>
        <li><a href="#about" className={styles.link}>About</a></li>
      </ul>
    </nav>
  )
}
