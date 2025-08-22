import styles from './Footer.module.css'
import { FaEnvelope, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span className={styles.copyright}>© {new Date().getFullYear()} Ella Demarest</span>
        <div className={styles.socials}>
          <a href="mailto:ellajdemarest@gmail.com" className={styles.icon} aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="https://www.linkedin.com/in/ella-demarest-b48553189/" target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://github.com/edemarest" target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://twitter.com/PhantomMisty" target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="Twitter">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  )
}
